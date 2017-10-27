(function() {
  var LinterView, fs, log, path, rimraf, temp, warn, _, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ = require('lodash');

  fs = require('fs');

  temp = require('temp');

  path = require('path');

  _ref = require('./utils'), log = _ref.log, warn = _ref.warn;

  rimraf = require('rimraf');

  temp.track();

  LinterView = (function() {
    LinterView.prototype.linters = [];

    LinterView.prototype.totalProcessed = 0;

    LinterView.prototype.tempFile = '';

    LinterView.prototype.messages = [];

    LinterView.prototype.subscriptions = [];

    LinterView.prototype.isDestroyed = false;

    function LinterView(editorView, statusBarView, inlineView, linters) {
      this.editorView = editorView;
      this.statusBarView = statusBarView;
      this.inlineView = inlineView;
      this.linters = linters != null ? linters : [];
      this.processMessage = __bind(this.processMessage, this);
      this.handleBufferEvents = __bind(this.handleBufferEvents, this);
      this.editor = this.editorView.getModel();
      if (this.editor == null) {
        warn("No editor instance on this editorView");
      }
      this.markers = null;
      this.initLinters(this.linters);
      this.handleBufferEvents();
      this.handleConfigChanges();
      this.subscriptions.push(this.editorView.on('cursor:moved', (function(_this) {
        return function() {
          return _this.updateViews();
        };
      })(this)));
    }

    LinterView.prototype.initLinters = function(linters) {
      var grammarName, linter, _i, _len, _results;
      this.linters = [];
      grammarName = this.editor.getGrammar().scopeName;
      _results = [];
      for (_i = 0, _len = linters.length; _i < _len; _i++) {
        linter = linters[_i];
        if (_.isArray(linter.syntax) && __indexOf.call(linter.syntax, grammarName) >= 0 || _.isString(linter.syntax) && grammarName === linter.syntax || linter.syntax instanceof RegExp && linter.syntax.test(grammarName)) {
          _results.push(this.linters.push(new linter(this.editor)));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    LinterView.prototype.handleConfigChanges = function() {
      this.subscriptions.push(atom.config.observe('linter.lintOnSave', (function(_this) {
        return function(lintOnSave) {
          return _this.lintOnSave = lintOnSave;
        };
      })(this)));
      this.subscriptions.push(atom.config.observe('linter.lintOnChangeInterval', (function(_this) {
        return function(lintOnModifiedDelayMS) {
          var throttleInterval;
          throttleInterval = parseInt(lintOnModifiedDelayMS);
          if (isNaN(throttleInterval)) {
            throttleInterval = 1000;
          }
          return _this.throttledLint = (_.throttle(_this.lint, throttleInterval)).bind(_this);
        };
      })(this)));
      this.subscriptions.push(atom.config.observe('linter.lintOnChange', (function(_this) {
        return function(lintOnModified) {
          return _this.lintOnModified = lintOnModified;
        };
      })(this)));
      this.subscriptions.push(atom.config.observe('linter.lintOnEditorFocus', (function(_this) {
        return function(lintOnEditorFocus) {
          return _this.lintOnEditorFocus = lintOnEditorFocus;
        };
      })(this)));
      this.subscriptions.push(atom.config.observe('linter.showGutters', (function(_this) {
        return function(showGutters) {
          _this.showGutters = showGutters;
          return _this.display();
        };
      })(this)));
      this.subscriptions.push(atom.config.observe('linter.statusBar', (function(_this) {
        return function(statusBar) {
          _this.showMessagesAroundCursor = statusBar !== 'None';
          return _this.updateViews();
        };
      })(this)));
      this.subscriptions.push(atom.config.observe('linter.showErrorInline', (function(_this) {
        return function(showErrorInline) {
          _this.showErrorInline = showErrorInline;
          return _this.updateViews();
        };
      })(this)));
      return this.subscriptions.push(atom.config.observe('linter.showHighlighting', (function(_this) {
        return function(showHighlighting) {
          _this.showHighlighting = showHighlighting;
          return _this.display();
        };
      })(this)));
    };

    LinterView.prototype.handleBufferEvents = function() {
      var buffer, maybeLintOnSave, pane;
      buffer = this.editor.getBuffer();
      this.bufferSubs = [];
      maybeLintOnSave = (function(_this) {
        return function() {
          if (_this.lintOnSave) {
            return _this.throttledLint();
          }
        };
      })(this);
      this.bufferSubs.push(buffer.onDidReload(maybeLintOnSave));
      this.bufferSubs.push(buffer.onDidDestroy((function(_this) {
        return function() {
          var s, _i, _len, _ref1, _results;
          _this.isDestroyed = true;
          _ref1 = _this.bufferSubs;
          _results = [];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            s = _ref1[_i];
            _results.push(s.dispose());
          }
          return _results;
        };
      })(this)));
      this.subscriptions.push(this.editor.onDidSave(maybeLintOnSave));
      this.subscriptions.push(this.editor.onDidStopChanging((function(_this) {
        return function() {
          if (_this.lintOnModified) {
            return _this.throttledLint();
          }
        };
      })(this)));
      pane = this.editorView.getPaneView().getModel();
      this.subscriptions.push(pane.onDidRemoveItem((function(_this) {
        return function() {
          _this.statusBarView.hide();
          return _this.inlineView.hide();
        };
      })(this)));
      this.subscriptions.push(pane.onDidChangeActive((function(_this) {
        return function() {
          var _ref1;
          if (_this.editor.id === ((_ref1 = atom.workspace.getActiveEditor()) != null ? _ref1.id : void 0)) {
            if (_this.lintOnEditorFocus) {
              _this.throttledLint();
            }
            return _this.updateViews();
          } else {
            _this.statusBarView.hide();
            return _this.inlineView.hide();
          }
        };
      })(this)));
      return atom.workspaceView.command("linter:lint", (function(_this) {
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
            var linter, _i, _len, _ref1;
            if (err != null) {
              throw err;
            }
            _ref1 = _this.linters;
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
              linter = _ref1[_i];
              linter.lintFile(tempFileInfo.path, function(messages) {
                return _this.processMessage(messages, tempFileInfo, linter);
              });
            }
          });
        };
      })(this));
    };

    LinterView.prototype.processMessage = function(messages, tempFileInfo, linter) {
      log("linter returned", linter, messages);
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
      var m, _i, _len, _ref1;
      if (this.markers == null) {
        return;
      }
      _ref1 = this.markers;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        m = _ref1[_i];
        m.destroy();
      }
      return this.markers = null;
    };

    LinterView.prototype.display = function() {
      var klass, marker, message, _i, _len, _ref1;
      this.destroyMarkers();
      if (this.isDestroyed) {
        return;
      }
      if (this.showGutters || this.showHighlighting) {
        if (this.markers == null) {
          this.markers = [];
        }
        _ref1 = this.messages;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          message = _ref1[_i];
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
        return this.inlineView.render(this.messages, this.editorView);
      } else {
        return this.inlineView.render([], this.editorView);
      }
    };

    LinterView.prototype.remove = function() {
      var s, _i, _len, _ref1, _results;
      _ref1 = this.subscriptions;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        s = _ref1[_i];
        _results.push(s.dispose());
      }
      return _results;
    };

    return LinterView;

  })();

  module.exports = LinterView;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNEQUFBO0lBQUE7eUpBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVIsQ0FBSixDQUFBOztBQUFBLEVBQ0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBREwsQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUZQLENBQUE7O0FBQUEsRUFHQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FIUCxDQUFBOztBQUFBLEVBSUEsT0FBYyxPQUFBLENBQVEsU0FBUixDQUFkLEVBQUMsV0FBQSxHQUFELEVBQU0sWUFBQSxJQUpOLENBQUE7O0FBQUEsRUFLQSxNQUFBLEdBQVMsT0FBQSxDQUFRLFFBQVIsQ0FMVCxDQUFBOztBQUFBLEVBUUEsSUFBSSxDQUFDLEtBQUwsQ0FBQSxDQVJBLENBQUE7O0FBQUEsRUFXTTtBQUVKLHlCQUFBLE9BQUEsR0FBUyxFQUFULENBQUE7O0FBQUEseUJBQ0EsY0FBQSxHQUFnQixDQURoQixDQUFBOztBQUFBLHlCQUVBLFFBQUEsR0FBVSxFQUZWLENBQUE7O0FBQUEseUJBR0EsUUFBQSxHQUFVLEVBSFYsQ0FBQTs7QUFBQSx5QkFJQSxhQUFBLEdBQWUsRUFKZixDQUFBOztBQUFBLHlCQUtBLFdBQUEsR0FBYSxLQUxiLENBQUE7O0FBYWEsSUFBQSxvQkFBRSxVQUFGLEVBQWUsYUFBZixFQUErQixVQUEvQixFQUE0QyxPQUE1QyxHQUFBO0FBRVgsTUFGWSxJQUFDLENBQUEsYUFBQSxVQUViLENBQUE7QUFBQSxNQUZ5QixJQUFDLENBQUEsZ0JBQUEsYUFFMUIsQ0FBQTtBQUFBLE1BRnlDLElBQUMsQ0FBQSxhQUFBLFVBRTFDLENBQUE7QUFBQSxNQUZzRCxJQUFDLENBQUEsNEJBQUEsVUFBVSxFQUVqRSxDQUFB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
//# sourceURL=/Users/ah/.atom/packages/linter/lib/linter-view.coffee