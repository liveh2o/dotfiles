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

    function LinterView(editor, statusBarView, inlineView, allLinters) {
      this.editor = editor;
      this.statusBarView = statusBarView;
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
      this.statusBarView.hide();
      this.inlineView.remove();
      this.subscriptions.dispose();
      return this.emitter.emit('did-destroy');
    };

    LinterView.prototype.onDidDestroy = function(callback) {
      return this.emitter.on('did-destroy', callback);
    };

    return LinterView;

  })();

  module.exports = LinterView;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDJGQUFBO0lBQUE7eUpBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVIsQ0FBSixDQUFBOztBQUFBLEVBQ0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBREwsQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUZQLENBQUE7O0FBQUEsRUFHQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FIUCxDQUFBOztBQUFBLEVBSUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxRQUFSLENBSlQsQ0FBQTs7QUFBQSxFQUtBLE9BQWlDLE9BQUEsQ0FBUSxXQUFSLENBQWpDLEVBQUMsMkJBQUEsbUJBQUQsRUFBc0IsZUFBQSxPQUx0QixDQUFBOztBQUFBLEVBT0EsUUFBYyxPQUFBLENBQVEsU0FBUixDQUFkLEVBQUMsWUFBQSxHQUFELEVBQU0sYUFBQSxJQVBOLENBQUE7O0FBQUEsRUFVQSxJQUFJLENBQUMsS0FBTCxDQUFBLENBVkEsQ0FBQTs7QUFBQSxFQWFNO0FBRUoseUJBQUEsT0FBQSxHQUFTLEVBQVQsQ0FBQTs7QUFBQSx5QkFDQSxjQUFBLEdBQWdCLENBRGhCLENBQUE7O0FBQUEseUJBRUEsUUFBQSxHQUFVLEVBRlYsQ0FBQTs7QUFBQSx5QkFHQSxRQUFBLEdBQVUsRUFIVixDQUFBOztBQVVhLElBQUEsb0JBQUUsTUFBRixFQUFXLGFBQVgsRUFBMkIsVUFBM0IsRUFBd0MsVUFBeEMsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLFNBQUEsTUFDYixDQUFBO0FBQUEsTUFEcUIsSUFBQyxDQUFBLGdCQUFBLGFBQ3RCLENBQUE7QUFBQSxNQURxQyxJQUFDLENBQUEsYUFBQSxVQUN0QyxDQUFBO0FBQUEsTUFEa0QsSUFBQyxDQUFBLGtDQUFBLGFB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
//# sourceURL=/Users/ah/.atom/packages/linter/lib/linter-view.coffee