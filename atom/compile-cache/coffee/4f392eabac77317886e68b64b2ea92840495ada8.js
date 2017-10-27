(function() {
  var CompositeDisposable, EditorLinter, Emitter, Helpers, Range, _ref;

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Emitter = _ref.Emitter, Range = _ref.Range;

  Helpers = require('./helpers');

  EditorLinter = (function() {
    function EditorLinter(linter, editor) {
      this.linter = linter;
      this.editor = editor;
      this.status = true;
      this.messages = new Map;
      this.inProgress = false;
      this.inProgressFly = false;
      if (this.editor === atom.workspace.getActiveTextEditor()) {
        this.linter.views.updateLineMessages(true);
      }
      this.emitter = new Emitter;
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(this.editor.onDidSave((function(_this) {
        return function() {
          return _this.lint(false);
        };
      })(this)));
      this.subscriptions.add(this.editor.onDidChangeCursorPosition((function(_this) {
        return function(_arg) {
          var newBufferPosition, oldBufferPosition;
          oldBufferPosition = _arg.oldBufferPosition, newBufferPosition = _arg.newBufferPosition;
          if (newBufferPosition.row !== oldBufferPosition.row) {
            _this.linter.views.updateLineMessages(true);
          }
          return _this.linter.views.renderBubble(newBufferPosition);
        };
      })(this)));
      this.subscriptions.add(this.editor.onDidStopChanging((function(_this) {
        return function() {
          if (_this.linter.lintOnFly) {
            return _this.lint(true);
          }
        };
      })(this)));
    }

    EditorLinter.prototype.toggleStatus = function() {
      return this.setStatus(!this.status);
    };

    EditorLinter.prototype.getStatus = function() {
      return this.status;
    };

    EditorLinter.prototype.setStatus = function(status) {
      this.status = status;
      if (!status) {
        this.messages.clear();
        return this.linter.views.render();
      }
    };

    EditorLinter.prototype.onShouldUpdate = function(callback) {
      return this.emitter.on('should-update', callback);
    };

    EditorLinter.prototype.onDidDestroy = function(callback) {
      return this.emitter.on('did-destroy', callback);
    };

    EditorLinter.prototype.lint = function(wasTriggeredOnChange) {
      var scopes;
      if (!this.status) {
        return;
      }
      if (this.editor !== atom.workspace.getActiveTextEditor()) {
        return;
      }
      if (!this.editor.getPath()) {
        return;
      }
      if (this.lock(wasTriggeredOnChange)) {
        return;
      }
      scopes = this.editor.scopeDescriptorForBufferPosition(this.editor.getCursorBufferPosition()).scopes;
      scopes.push('*');
      return this.triggerLinters(true, wasTriggeredOnChange, scopes).then((function(_this) {
        return function() {
          return Promise.all(_this.triggerLinters(false, wasTriggeredOnChange, scopes));
        };
      })(this)).then((function(_this) {
        return function() {
          return _this.lock(wasTriggeredOnChange, false);
        };
      })(this));
    };

    EditorLinter.prototype.triggerLinters = function(bufferModifying, wasTriggeredOnChange, scopes) {
      var ToReturn;
      ToReturn = bufferModifying ? Promise.resolve() : [];
      this.linter.getLinters().forEach((function(_this) {
        return function(linter) {
          var currentLinter;
          if (linter.modifiesBuffer !== bufferModifying) {
            return;
          }
          if (!Helpers.shouldTriggerLinter(linter, wasTriggeredOnChange, scopes)) {
            return;
          }
          currentLinter = function() {
            return new Promise(function(resolve) {
              return resolve(linter.lint(_this.editor, Helpers));
            }).then(function(results) {
              if (linter.scope === 'project') {
                return _this.linter.setMessages(linter, results);
              } else {
                return _this.emitter.emit('should-update', {
                  linter: linter,
                  results: results
                });
              }
            })["catch"](function(error) {
              return atom.notifications.addError(error.message, {
                detail: error.stack,
                dismissable: true
              });
            });
          };
          if (bufferModifying) {
            return ToReturn.then(function() {
              return currentLinter();
            });
          } else {
            return ToReturn.push(currentLinter());
          }
        };
      })(this));
      return ToReturn;
    };

    EditorLinter.prototype.lock = function(wasTriggeredOnChange, value) {
      var key;
      key = wasTriggeredOnChange ? 'inProgressFly' : 'inProgress';
      if (typeof value === 'undefined') {
        return this[key];
      } else {
        return this[key] = value;
      }
    };

    EditorLinter.prototype.destroy = function() {
      this.emitter.emit('did-destroy');
      this.emitter.dispose();
      return this.subscriptions.dispose();
    };

    return EditorLinter;

  })();

  module.exports = EditorLinter;

}).call(this);
