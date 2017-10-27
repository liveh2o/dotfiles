(function() {
  var Commands, CompositeDisposable, EditorLinter, Emitter, Helpers, Linter, LinterViews, Messages, Path, deprecate, _ref;

  Path = require('path');

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Emitter = _ref.Emitter;

  LinterViews = require('./linter-views');

  EditorLinter = require('./editor-linter');

  Helpers = require('./helpers');

  Commands = require('./commands');

  Messages = require('./messages');

  deprecate = require('grim').deprecate;

  Linter = (function() {
    function Linter(state) {
      var _base;
      this.state = state;
      if ((_base = this.state).scope == null) {
        _base.scope = 'File';
      }
      this.lintOnFly = true;
      this.subscriptions = new CompositeDisposable;
      this.emitter = new Emitter;
      this.editorLinters = new Map;
      this.linters = new Set;
      this.messages = new Messages(this);
      this.views = new LinterViews(this);
      this.commands = new Commands(this);
      this.subscriptions.add(atom.config.observe('linter.lintOnFly', (function(_this) {
        return function(value) {
          return _this.lintOnFly = value;
        };
      })(this)));
      this.subscriptions.add(atom.project.onDidChangePaths((function(_this) {
        return function() {
          return _this.commands.lint();
        };
      })(this)));
      this.subscriptions.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          var currentEditorLinter;
          currentEditorLinter = new EditorLinter(_this, editor);
          _this.editorLinters.set(editor, currentEditorLinter);
          _this.emitter.emit('observe-editor-linters', currentEditorLinter);
          currentEditorLinter.lint(false);
          return editor.onDidDestroy(function() {
            currentEditorLinter.destroy();
            return _this.editorLinters["delete"](editor);
          });
        };
      })(this)));
    }

    Linter.prototype.serialize = function() {
      return this.state;
    };

    Linter.prototype.addLinter = function(linter) {
      var err;
      try {
        if (Helpers.validateLinter(linter)) {
          return this.linters.add(linter);
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
      this.linters["delete"](linter);
      return this.deleteMessages(linter);
    };

    Linter.prototype.hasLinter = function(linter) {
      return this.linters.has(linter);
    };

    Linter.prototype.getLinters = function() {
      return this.linters;
    };

    Linter.prototype.setMessages = function(linter, messages) {
      return this.messages.set(linter, messages);
    };

    Linter.prototype.deleteMessages = function(linter) {
      return this.messages["delete"](linter);
    };

    Linter.prototype.getMessages = function() {
      return this.messages.getAll();
    };

    Linter.prototype.onDidChangeMessages = function(callback) {
      return this.messages.onDidChange(callback);
    };

    Linter.prototype.onDidClassifyMessages = function(callback) {
      return this.messages.onDidClassify(callback);
    };

    Linter.prototype.onDidChangeProjectMessages = function(callback) {
      deprecate("Linter::onDidChangeProjectMessages is deprecated, use Linter::onDidChangeMessages instead");
      return this.onDidChangeMessages(callback);
    };

    Linter.prototype.getProjectMessages = function() {
      deprecate("Linter::getProjectMessages is deprecated, use Linter::getMessages instead");
      return this.getMessages();
    };

    Linter.prototype.setProjectMessages = function(linter, messages) {
      deprecate("Linter::setProjectMessages is deprecated, use Linter::setMessages instead");
      return this.setMessages(linter, messages);
    };

    Linter.prototype.deleteProjectMessages = function(linter) {
      deprecate("Linter::deleteProjectMessages is deprecated, use Linter::deleteMessages instead");
      return this.deleteMessages(linter);
    };

    Linter.prototype.getActiveEditorLinter = function() {
      return this.getEditorLinter(atom.workspace.getActiveTextEditor());
    };

    Linter.prototype.getEditorLinter = function(editor) {
      return this.editorLinters.get(editor);
    };

    Linter.prototype.eachEditorLinter = function(callback) {
      return this.editorLinters.forEach(callback);
    };

    Linter.prototype.observeEditorLinters = function(callback) {
      this.eachEditorLinter(callback);
      return this.emitter.on('observe-editor-linters', callback);
    };

    Linter.prototype.deactivate = function() {
      this.subscriptions.dispose();
      this.eachEditorLinter(function(linter) {
        return linter.destroy();
      });
      this.views.destroy();
      this.commands.destroy();
      return this.messages.destroy();
    };

    return Linter;

  })();

  module.exports = Linter;

}).call(this);
