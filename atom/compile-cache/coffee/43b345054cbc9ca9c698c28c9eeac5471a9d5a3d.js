(function() {
  var CompositeDisposable, Emitter, LinterView, fs, log, path, rimraf, temp, warn, _, _ref, _ref1,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ = require('lodash');

  fs = require('fs');

  temp = require('temp');

  path = require('path');

  rimraf = require('rimraf');

  _ref = require('event-kit'), CompositeDisposable = _ref.CompositeDisposable, Emitter = _ref.Emitter;

  _ref1 = require('./utils'), log = _ref1.log, warn = _ref1.warn;

  temp.track();

  LinterView = (function() {
    LinterView.prototype.linters = [];

    LinterView.prototype.totalProcessed = 0;

    LinterView.prototype.tempFile = '';

    LinterView.prototype.messages = [];

    function LinterView(editor, statusBarView, statusBarSummaryView, inlineView, allLinters) {
      this.editor = editor;
      this.statusBarView = statusBarView;
      this.statusBarSummaryView = statusBarSummaryView;
      this.inlineView = inlineView;
      this.allLinters = allLinters != null ? allLinters : [];
      this.processMessage = __bind(this.processMessage, this);
      this.handleEditorEvents = __bind(this.handleEditorEvents, this);
      this.emitter = new Emitter;
      this.subscriptions = new CompositeDisposable;
      if (this.editor == null) {
        warn("No editor instance on this editor");
      }
      this.markers = null;
      this.initLinters();
      this.handleEditorEvents();
      this.handleConfigChanges();
      this.subscriptions.add(this.editor.onDidChangeCursorPosition((function(_this) {
        return function() {
          return _this.updateViews();
        };
      })(this)));
    }

    LinterView.prototype.initLinters = function() {
      var grammarName, linter, _i, _len, _ref2, _results;
      this.linters = [];
      grammarName = this.editor.getGrammar().scopeName;
      _ref2 = this.allLinters;
      _results = [];
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        linter = _ref2[_i];
        if (_.isArray(linter.syntax) && __indexOf.call(linter.syntax, grammarName) >= 0 || _.isString(linter.syntax) && grammarName === linter.syntax || linter.syntax instanceof RegExp && linter.syntax.test(grammarName)) {
          _results.push(this.linters.push(new linter(this.editor)));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    LinterView.prototype.handleConfigChanges = function() {
      this.subscriptions.add(atom.config.observe('linter.lintOnSave', (function(_this) {
        return function(lintOnSave) {
          return _this.lintOnSave = lintOnSave;
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('linter.lintOnChangeInterval', (function(_this) {
        return function(lintOnModifiedDelayMS) {
          var throttleInterval;
          throttleInterval = parseInt(lintOnModifiedDelayMS);
          if (isNaN(throttleInterval)) {
            throttleInterval = 1000;
          }
          return _this.throttledLint = (_.throttle(_this.lint, throttleInterval)).bind(_this);
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('linter.lintOnChange', (function(_this) {
        return function(lintOnModified) {
          return _this.lintOnModified = lintOnModified;
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('linter.lintOnEditorFocus', (function(_this) {
        return function(lintOnEditorFocus) {
          return _this.lintOnEditorFocus = lintOnEditorFocus;
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('linter.showGutters', (function(_this) {
        return function(showGutters) {
          _this.showGutters = showGutters;
          return _this.display();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('linter.statusBar', (function(_this) {
        return function(statusBar) {
          _this.showMessagesAroundCursor = statusBar !== 'None';
          return _this.updateViews();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('linter.showErrorInline', (function(_this) {
        return function(showErrorInline) {
          _this.showErrorInline = showErrorInline;
          return _this.updateViews();
        };
      })(this)));
      return this.subscriptions.add(atom.config.observe('linter.showHighlighting', (function(_this) {
        return function(showHighlighting) {
          _this.showHighlighting = showHighlighting;
          return _this.display();
        };
      })(this)));
    };

    LinterView.prototype.handleEditorEvents = function() {
      var maybeLintOnSave;
      this.editor.onDidChangeGrammar((function(_this) {
        return function() {
          _this.initLinters();
          return _this.lint();
        };
      })(this));
      maybeLintOnSave = (function(_this) {
        return function() {
          if (_this.lintOnSave) {
            return _this.throttledLint();
          }
        };
      })(this);
      this.subscriptions.add(this.editor.getBuffer().onDidReload(maybeLintOnSave));
      this.subscriptions.add(this.editor.onDidSave(maybeLintOnSave));
      this.subscriptions.add(this.editor.onDidStopChanging((function(_this) {
        return function() {
          if (_this.lintOnModified) {
            return _this.throttledLint();
          }
        };
      })(this)));
      this.subscriptions.add(this.editor.onDidDestroy((function(_this) {
        return function() {
          return _this.remove();
        };
      })(this)));
      this.subscriptions.add(atom.workspace.observeActivePaneItem((function(_this) {
        return function() {
          var _ref2;
          if (_this.editor.id === ((_ref2 = atom.workspace.getActiveTextEditor()) != null ? _ref2.id : void 0)) {
            if (_this.lintOnEditorFocus) {
              _this.throttledLint();
            }
            return _this.updateViews();
          } else {
            _this.statusBarView.hide();
            _this.statusBarSummaryView.remove();
            return _this.inlineView.remove();
          }
        };
      })(this)));
      return atom.commands.add("atom-text-editor", "linter:lint", (function(_this) {
        return function() {
          return _this.lint();
        };
      })(this));
    };

    LinterView.prototype.lint = function() {
      if (this.linters.length === 0) {
        return;
      }
      this.totalProcessed = 0;
      this.messages = [];
      this.destroyMarkers();
      return temp.mkdir({
        prefix: 'AtomLinter',
        suffix: this.editor.getGrammar().scopeName
      }, (function(_this) {
        return function(err, tmpDir) {
          var fileName, tempFileInfo;
          if (err != null) {
            throw err;
          }
          fileName = path.basename(_this.editor.getPath());
          tempFileInfo = {
            completedLinters: 0,
            path: path.join(tmpDir, fileName)
          };
          return fs.writeFile(tempFileInfo.path, _this.editor.getText(), function(err) {
            if (err != null) {
              throw err;
            }
            _this.linters.forEach(function(linter) {
              return linter.lintFile(tempFileInfo.path, function(messages) {
                return _this.processMessage(messages, tempFileInfo, linter);
              });
            });
          });
        };
      })(this));
    };

    LinterView.prototype.processMessage = function(messages, tempFileInfo, linter) {
      log("" + linter.linterName + " returned", linter, messages);
      tempFileInfo.completedLinters++;
      if (tempFileInfo.completedLinters === this.linters.length) {
        rimraf(tempFileInfo.path, function(err) {
          if (err != null) {
            throw err;
          }
        });
      }
      this.messages = this.messages.concat(messages);
      return this.display();
    };

    LinterView.prototype.destroyMarkers = function() {
      var m, _i, _len, _ref2;
      if (this.markers == null) {
        return;
      }
      _ref2 = this.markers;
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        m = _ref2[_i];
        m.destroy();
      }
      return this.markers = null;
    };

    LinterView.prototype.display = function() {
      var klass, marker, message, _i, _len, _ref2;
      this.destroyMarkers();
      if (!this.editor.isAlive()) {
        return;
      }
      if (this.showGutters || this.showHighlighting) {
        if (this.markers == null) {
          this.markers = [];
        }
        _ref2 = this.messages;
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          message = _ref2[_i];
          klass = message.level === 'error' ? 'linter-error' : message.level === 'warning' ? 'linter-warning' : void 0;
          if (klass == null) {
            continue;
          }
          marker = this.editor.markBufferRange(message.range, {
            invalidate: 'never'
          });
          this.markers.push(marker);
          if (this.showGutters) {
            this.editor.decorateMarker(marker, {
              type: 'gutter',
              "class": klass
            });
          }
          if (this.showHighlighting) {
            this.editor.decorateMarker(marker, {
              type: 'highlight',
              "class": klass
            });
          }
        }
      }
      return this.updateViews();
    };

    LinterView.prototype.updateViews = function() {
      this.statusBarSummaryView.render(this.messages);
      if (this.showMessagesAroundCursor) {
        this.statusBarView.render(this.messages, this.editor);
      } else {
        this.statusBarView.render([], this.editor);
      }
      if (this.showErrorInline) {
        return this.inlineView.render(this.messages, this.editor);
      } else {
        return this.inlineView.render([], this.editor);
      }
    };

    LinterView.prototype.remove = function() {
      var l, _i, _len, _ref2;
      this.statusBarView.hide();
      this.statusBarSummaryView.remove();
      this.inlineView.remove();
      this.subscriptions.dispose();
      _ref2 = this.linters;
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        l = _ref2[_i];
        l.destroy();
      }
      return this.emitter.emit('did-destroy');
    };

    LinterView.prototype.onDidDestroy = function(callback) {
      return this.emitter.on('did-destroy', callback);
    };

    return LinterView;

  })();

  module.exports = LinterView;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDJGQUFBO0lBQUE7eUpBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVIsQ0FBSixDQUFBOztBQUFBLEVBQ0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBREwsQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUZQLENBQUE7O0FBQUEsRUFHQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FIUCxDQUFBOztBQUFBLEVBSUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxRQUFSLENBSlQsQ0FBQTs7QUFBQSxFQUtBLE9BQWlDLE9BQUEsQ0FBUSxXQUFSLENBQWpDLEVBQUMsMkJBQUEsbUJBQUQsRUFBc0IsZUFBQSxPQUx0QixDQUFBOztBQUFBLEVBT0EsUUFBYyxPQUFBLENBQVEsU0FBUixDQUFkLEVBQUMsWUFBQSxHQUFELEVBQU0sYUFBQSxJQVBOLENBQUE7O0FBQUEsRUFVQSxJQUFJLENBQUMsS0FBTCxDQUFBLENBVkEsQ0FBQTs7QUFBQSxFQWFNO0FBRUoseUJBQUEsT0FBQSxHQUFTLEVBQVQsQ0FBQTs7QUFBQSx5QkFDQSxjQUFBLEdBQWdCLENBRGhCLENBQUE7O0FBQUEseUJBRUEsUUFBQSxHQUFVLEVBRlYsQ0FBQTs7QUFBQSx5QkFHQSxRQUFBLEdBQVUsRUFIVixDQUFBOztBQVVhLElBQUEsb0JBQUUsTUFBRixFQUFXLGFBQVgsRUFBMkIsb0JBQTNCLEVBQWtELFVBQWxELEVBQStELFVBQS9ELEdBQUE7QUFDWCxNQURZLElBQUMsQ0FBQSxTQUFBLE1BQ2IsQ0FBQTtBQUFBLE1BRHFCLElBQUMsQ0FBQSxnQkFBQSxhQUN0QixDQUFBO0FBQUEsTUFEcUMsSUFBQyxDQUFBLHVCQUFBLG9CQUN0QyxDQUFBO0FBQUEsTUFENEQsSUFB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
//# sourceURL=/Users/ah/.atom/packages/linter/lib/linter-view.coffee