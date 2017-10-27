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
      this.subscriptions.push(atom.workspaceView.on('pane:item-removed', (function(_this) {
        return function() {
          _this.statusBarView.hide();
          return _this.inlineView.hide();
        };
      })(this)));
      this.subscriptions.push(atom.workspaceView.on('pane:active-item-changed', (function(_this) {
        return function() {
          var _ref1;
          if (_this.editor.id === ((_ref1 = atom.workspace.getActiveEditor()) != null ? _ref1.id : void 0)) {
            return _this.updateViews();
          } else {
            _this.statusBarView.hide();
            return _this.inlineView.hide();
          }
        };
      })(this)));
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
        if (_.isArray(linter.syntax) && __indexOf.call(linter.syntax, grammarName) >= 0 || _.isString(linter.syntax) && grammarName === linter.syntax) {
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
      this.subscriptions.push(atom.config.observe('linter.showErrorInStatusBar', (function(_this) {
        return function(showMessagesAroundCursor) {
          _this.showMessagesAroundCursor = showMessagesAroundCursor;
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
      var buffer;
      buffer = this.editor.getBuffer();
      this.subscriptions.push(buffer.on('reloaded saved', (function(_this) {
        return function(buffer) {
          if (_this.lintOnSave) {
            return _this.throttledLint();
          }
        };
      })(this)));
      this.subscriptions.push(buffer.on('destroyed', function() {
        buffer.off('reloaded saved');
        return buffer.off('destroyed');
      }));
      this.subscriptions.push(this.editor.on('contents-modified', (function(_this) {
        return function() {
          if (_this.lintOnModified) {
            return _this.throttledLint();
          }
        };
      })(this)));
      this.subscriptions.push(atom.workspaceView.on('pane:active-item-changed', (function(_this) {
        return function() {
          var _ref1;
          if (_this.editor.id === ((_ref1 = atom.workspace.getActiveEditor()) != null ? _ref1.id : void 0)) {
            if (_this.lintOnEditorFocus) {
              return _this.throttledLint();
            }
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
      var subscription, _i, _len, _ref1, _results;
      _ref1 = this.subscriptions;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        subscription = _ref1[_i];
        _results.push(subscription.off());
      }
      return _results;
    };

    return LinterView;

  })();

  module.exports = LinterView;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNEQUFBO0lBQUE7eUpBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVIsQ0FBSixDQUFBOztBQUFBLEVBQ0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBREwsQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUZQLENBQUE7O0FBQUEsRUFHQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FIUCxDQUFBOztBQUFBLEVBSUEsT0FBYyxPQUFBLENBQVEsU0FBUixDQUFkLEVBQUMsV0FBQSxHQUFELEVBQU0sWUFBQSxJQUpOLENBQUE7O0FBQUEsRUFLQSxNQUFBLEdBQVMsT0FBQSxDQUFRLFFBQVIsQ0FMVCxDQUFBOztBQUFBLEVBUUEsSUFBSSxDQUFDLEtBQUwsQ0FBQSxDQVJBLENBQUE7O0FBQUEsRUFXTTtBQUVKLHlCQUFBLE9BQUEsR0FBUyxFQUFULENBQUE7O0FBQUEseUJBQ0EsY0FBQSxHQUFnQixDQURoQixDQUFBOztBQUFBLHlCQUVBLFFBQUEsR0FBVSxFQUZWLENBQUE7O0FBQUEseUJBR0EsUUFBQSxHQUFVLEVBSFYsQ0FBQTs7QUFBQSx5QkFJQSxhQUFBLEdBQWUsRUFKZixDQUFBOztBQVlhLElBQUEsb0JBQUUsVUFBRixFQUFlLGFBQWYsRUFBK0IsVUFBL0IsRUFBNEMsT0FBNUMsR0FBQTtBQUVYLE1BRlksSUFBQyxDQUFBLGFBQUEsVUFFYixDQUFBO0FBQUEsTUFGeUIsSUFBQyxDQUFBLGdCQUFBLGFBRTFCLENBQUE7QUFBQSxNQUZ5QyxJQUFDLENBQUEsYUFBQSxVQUUxQyxDQUFBO0FBQUEsTUFGc0QsSUFBQyxDQUFBLDRCQUFBLFVBQVUsRUFFakUsQ0FBQTtBQUFBLDZEQUFBLENBQUE7QUFBQSxxRUFBQSxDQUFB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
//# sourceURL=/Users/ah/.atom/packages/linter/lib/linter-view.coffee