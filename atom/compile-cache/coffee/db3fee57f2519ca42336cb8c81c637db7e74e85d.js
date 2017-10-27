(function() {
  var CompositeDisposable, EditorLinter, Emitter, Helpers, Range, _ref,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Emitter = _ref.Emitter, Range = _ref.Range;

  Helpers = require('./helpers');

  EditorLinter = (function() {
    function EditorLinter(linter, editor) {
      this.linter = linter;
      this.editor = editor;
      this._messages = new Map;
      this._inProgress = false;
      this._inProgressFly = false;
      this._emitter = new Emitter;
      this._subscriptions = new CompositeDisposable;
      this._subscriptions.add(this.editor.onDidSave((function(_this) {
        return function() {
          return _this.lint(false);
        };
      })(this)));
      this._subscriptions.add(this.editor.onDidChangeCursorPosition((function(_this) {
        return function(_arg) {
          var newBufferPosition;
          newBufferPosition = _arg.newBufferPosition;
          return _this.linter.views.updateBubble(newBufferPosition);
        };
      })(this)));
      this._subscriptions.add(this.editor.onDidStopChanging((function(_this) {
        return function() {
          if (_this.linter.lintOnFly) {
            return _this.lint(true);
          }
        };
      })(this)));
    }

    EditorLinter.prototype.getMessages = function() {
      return this._messages;
    };

    EditorLinter.prototype.deleteMessages = function(linter) {
      return this._messages["delete"](linter);
    };

    EditorLinter.prototype.setMessages = function(linter, messages) {
      return this._messages.set(linter, Helpers.validateResults(messages));
    };

    EditorLinter.prototype.destroy = function() {
      this._emitter.emit('did-destroy');
      return this._subscriptions.dispose();
    };

    EditorLinter.prototype.onDidUpdate = function(callback) {
      return this._emitter.on('did-update', callback);
    };

    EditorLinter.prototype.onDidDestroy = function(callback) {
      return this._emitter.on('did-destroy', callback);
    };

    EditorLinter.prototype.lint = function(wasTriggeredOnChange) {
      var scopes;
      if (this.editor !== atom.workspace.getActiveTextEditor()) {
        return;
      }
      if (this._lock(wasTriggeredOnChange)) {
        return;
      }
      scopes = this.editor.scopeDescriptorForBufferPosition(this.editor.getCursorBufferPosition()).scopes;
      scopes.push('*');
      return Promise.all(this._lint(wasTriggeredOnChange, scopes)).then((function(_this) {
        return function() {
          return _this._lock(wasTriggeredOnChange, false);
        };
      })(this));
    };

    EditorLinter.prototype._lint = function(wasTriggeredOnChange, scopes) {
      var Promises;
      Promises = [];
      this.linter.getLinters().forEach((function(_this) {
        return function(linter) {
          if (_this.linter.lintOnFly) {
            if (wasTriggeredOnChange !== linter.lintOnFly) {
              return;
            }
          }
          if (!scopes.some(function(entry) {
            return __indexOf.call(linter.grammarScopes, entry) >= 0;
          })) {
            return;
          }
          return Promises.push(new Promise(function(resolve) {
            return resolve(linter.lint(_this.editor));
          }).then(function(results) {
            if (linter.scope === 'project') {
              _this.linter.setProjectMessages(linter, results);
            } else {
              _this.setMessages(linter, results);
            }
            _this._emitter.emit('did-update');
            if (_this.editor === atom.workspace.getActiveTextEditor()) {
              return _this.linter.views.render();
            }
          })["catch"](function(error) {
            return atom.notifications.addError(error.message, {
              detail: error.stack,
              dismissable: true
            });
          }));
        };
      })(this));
      return Promises;
    };

    EditorLinter.prototype._lock = function(wasTriggeredOnChange, value) {
      var key;
      key = wasTriggeredOnChange != null ? wasTriggeredOnChange : {
        '_inProgressFly': '_inProgress'
      };
      if (typeof value === 'undefined') {
        return this[key];
      } else {
        return this[key] = value;
      }
    };

    return EditorLinter;

  })();

  module.exports = EditorLinter;

}).call(this);
