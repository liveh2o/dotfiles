(function() {
  var CompositeDisposable, EditorLinter, Emitter, Helpers, Linter, LinterViews, Path, _ref;

  Path = require('path');

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Emitter = _ref.Emitter;

  LinterViews = require('./linter-views');

  EditorLinter = require('./editor-linter');

  Helpers = require('./helpers');

  Linter = (function() {
    function Linter() {
      this.lintOnFly = true;
      this.views = new LinterViews(this);
      this._subscriptions = new CompositeDisposable;
      this._emitter = new Emitter;
      this._editorLinters = new Map;
      this._messagesProject = new Map;
      this._linters = new Set;
      this._subscriptions.add(atom.config.observe('linter.showErrorInline', (function(_this) {
        return function(showBubble) {
          return _this.views.setShowBubble(showBubble);
        };
      })(this)));
      this._subscriptions.add(atom.config.observe('linter.lintOnFly', (function(_this) {
        return function(value) {
          return _this.lintOnFly = value;
        };
      })(this)));
      this._subscriptions.add(atom.workspace.onDidChangeActivePaneItem((function(_this) {
        return function(editor) {
          var error, _ref1;
          try {
            if ((_ref1 = _this.getEditorLinter(editor)) != null) {
              _ref1.lint(false);
            }
            return _this.views.render();
          } catch (_error) {
            error = _error;
            return atom.notifications.addError(error.message, {
              detail: error.stack,
              dismissable: true
            });
          }
        };
      })(this)));
      this._subscriptions.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          var currentEditorLinter;
          currentEditorLinter = new EditorLinter(_this, editor);
          _this._editorLinters.set(editor, currentEditorLinter);
          _this._emitter.emit('linters-observe', currentEditorLinter);
          currentEditorLinter.lint(false);
          return editor.onDidDestroy(function() {
            currentEditorLinter.destroy();
            return _this._editorLinters["delete"](editor);
          });
        };
      })(this)));
    }

    Linter.prototype.addLinter = function(linter) {
      var err;
      try {
        if (Helpers.validateLinter(linter)) {
          return this._linters.add(linter);
        }
      } catch (_error) {
        err = _error;
        return atom.notifications.addError("Invalid Linter: " + err.message, {
          detail: err.stack,
          dismissable: true
        });
      }
    };

    Linter.prototype.deleteLinter = function(linter) {
      if (!this.hasLinter(linter)) {
        return;
      }
      this._linters["delete"](linter);
      if (linter.scope === 'project') {
        this.deleteProjectMessages(linter);
      } else {
        this.eachEditorLinter(function(editorLinter) {
          return editorLinter.deleteMessages(linter);
        });
      }
      return this.views.render();
    };

    Linter.prototype.hasLinter = function(linter) {
      return this._linters.has(linter);
    };

    Linter.prototype.getLinters = function() {
      return this._linters;
    };

    Linter.prototype.getProjectMessages = function() {
      return this._messagesProject;
    };

    Linter.prototype.setProjectMessages = function(linter, messages) {
      return this._messagesProject.set(linter, Helpers.validateResults(messages));
    };

    Linter.prototype.deleteProjectMessages = function(linter) {
      return this._messagesProject["delete"](linter);
    };

    Linter.prototype.getActiveEditorLinter = function() {
      return this.getEditorLinter(atom.workspace.getActiveTextEditor());
    };

    Linter.prototype.getEditorLinter = function(editor) {
      return this._editorLinters.get(editor);
    };

    Linter.prototype.eachEditorLinter = function(callback) {
      return this._editorLinters.forEach(callback);
    };

    Linter.prototype.observeEditorLinters = function(callback) {
      this.eachEditorLinter(callback);
      return this._emitter.on('linters-observe', callback);
    };

    Linter.prototype.deactivate = function() {
      this._subscriptions.dispose();
      this.eachEditorLinter(function(linter) {
        return linter.destroy();
      });
      return this.views.destroy();
    };

    return Linter;

  })();

  module.exports = Linter;

}).call(this);
