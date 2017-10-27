(function() {
  var Emitter, LinterRegistry, helpers, validate;

  Emitter = require('atom').Emitter;

  validate = require('./validate');

  helpers = require('./helpers');

  LinterRegistry = (function() {
    function LinterRegistry() {
      this.linters = [];
      this.locks = {
        Regular: new WeakSet,
        Fly: new WeakSet
      };
      this.emitter = new Emitter;
    }

    LinterRegistry.prototype.getLinters = function() {
      return this.linters.slice();
    };

    LinterRegistry.prototype.hasLinter = function(linter) {
      return this.linters.indexOf(linter) !== -1;
    };

    LinterRegistry.prototype.addLinter = function(linter) {
      var e;
      try {
        validate.linter(linter);
        linter.deactivated = false;
        return this.linters.push(linter);
      } catch (_error) {
        e = _error;
        return helpers.error(e);
      }
    };

    LinterRegistry.prototype.deleteLinter = function(linter) {
      if (!this.hasLinter(linter)) {
        return;
      }
      linter.deactivated = true;
      return this.linters.splice(this.linters.indexOf(linter), 1);
    };

    LinterRegistry.prototype.lint = function(_arg) {
      var editor, editorLinter, lockKey, onChange, scopes;
      onChange = _arg.onChange, editorLinter = _arg.editorLinter;
      editor = editorLinter.editor;
      lockKey = onChange ? 'Fly' : 'Regular';
      if (onChange && !atom.config.get('linter.lintOnFly')) {
        return;
      }
      if (editor !== atom.workspace.getActiveTextEditor()) {
        return;
      }
      if (!editor.getPath()) {
        return;
      }
      if (this.locks[lockKey].has(editorLinter)) {
        return;
      }
      this.locks[lockKey].add(editorLinter);
      scopes = editor.scopeDescriptorForBufferPosition(editor.getCursorBufferPosition()).scopes;
      scopes.push('*');
      return this.linters.reduce((function(_this) {
        return function(promise, linter) {
          if (!helpers.shouldTriggerLinter(linter, true, onChange, scopes)) {
            return promise;
          }
          return promise.then(function() {
            return _this.triggerLinter(linter, editor, scopes);
          });
        };
      })(this), Promise.resolve()).then((function(_this) {
        return function() {
          var Promises;
          Promises = _this.linters.map(function(linter) {
            if (!helpers.shouldTriggerLinter(linter, false, onChange, scopes)) {
              return;
            }
            return _this.triggerLinter(linter, editor, scopes);
          });
          return Promise.all(Promises);
        };
      })(this)).then((function(_this) {
        return function() {
          return _this.locks[lockKey]["delete"](editorLinter);
        };
      })(this));
    };

    LinterRegistry.prototype.triggerLinter = function(linter, editor, scopes) {
      return new Promise(function(resolve) {
        return resolve(linter.lint(editor));
      }).then((function(_this) {
        return function(results) {
          if (results) {
            return _this.emitter.emit('did-update-messages', {
              linter: linter,
              messages: results,
              editor: editor
            });
          }
        };
      })(this))["catch"](function(e) {
        return helpers.error(e);
      });
    };

    LinterRegistry.prototype.onDidUpdateMessages = function(callback) {
      return this.emitter.on('did-update-messages', callback);
    };

    LinterRegistry.prototype.dispose = function() {
      this.emitter.dispose();
      return this.linters = [];
    };

    return LinterRegistry;

  })();

  module.exports = LinterRegistry;

}).call(this);
