(function() {
  var Commands, CompositeDisposable, EditorLinter, Emitter, Helpers, Linter, LinterViews, Path, deprecate, _ref;

  Path = require('path');

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Emitter = _ref.Emitter;

  LinterViews = require('./linter-views');

  EditorLinter = require('./editor-linter');

  Helpers = require('./helpers');

  Commands = require('./commands');

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
      this.linters = new (require('./linter-registry'))();
      this.editors = new (require('./editor-registry'))();
      this.messages = new (require('./message-registry'))();
      this.views = new LinterViews(this);
      this.commands = new Commands(this);
      this.subscriptions.add(this.linters.onDidUpdateMessages((function(_this) {
        return function(info) {
          return _this.messages.set(info);
        };
      })(this)));
      this.subscriptions.add(this.messages.onDidUpdateMessages((function(_this) {
        return function(messages) {
          return _this.views.render(messages);
        };
      })(this)));
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
          return _this.createEditorLinter(editor);
        };
      })(this)));
    }

    Linter.prototype.serialize = function() {
      return this.state;
    };

    Linter.prototype.addLinter = function(linter) {
      return this.linters.addLinter(linter);
    };

    Linter.prototype.deleteLinter = function(linter) {
      return this.linters.deleteLinter(linter);
    };

    Linter.prototype.hasLinter = function(linter) {
      return this.linters.hasLinter(linter);
    };

    Linter.prototype.getLinters = function() {
      return this.linters.getLinters();
    };

    Linter.prototype.setMessages = function(linter, messages) {
      return this.messages.set({
        linter: linter,
        messages: messages
      });
    };

    Linter.prototype.deleteMessages = function(linter) {
      return this.messages.deleteMessages(linter);
    };

    Linter.prototype.getMessages = function() {
      return this.messages.publicMessages;
    };

    Linter.prototype.onDidUpdateMessages = function(callback) {
      return this.messages.onDidUpdateMessages(callback);
    };

    Linter.prototype.onDidChangeMessages = function(callback) {
      deprecate("Linter::onDidChangeMessages is deprecated, use Linter::onDidUpdateMessages instead");
      return this.onDidUpdateMessages(callback);
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
      return this.editors.ofActiveTextEditor();
    };

    Linter.prototype.getEditorLinter = function(editor) {
      return this.editors.ofTextEditor(editor);
    };

    Linter.prototype.eachEditorLinter = function(callback) {
      return this.editors.forEach(callback);
    };

    Linter.prototype.observeEditorLinters = function(callback) {
      return this.editors.observe(callback);
    };

    Linter.prototype.createEditorLinter = function(editor) {
      var editorLinter;
      editorLinter = this.editors.create(editor);
      editorLinter.onShouldUpdateBubble((function(_this) {
        return function() {
          return _this.views.renderBubble();
        };
      })(this));
      editorLinter.onShouldUpdateLineMessages((function(_this) {
        return function() {
          return _this.views.renderLineMessages(true);
        };
      })(this));
      editorLinter.onShouldLint((function(_this) {
        return function(onChange) {
          return _this.linters.lint({
            onChange: onChange,
            editorLinter: editorLinter
          });
        };
      })(this));
      return editorLinter.onDidDestroy((function(_this) {
        return function() {
          editorLinter.deactivate();
          return _this.messages.deleteEditorMessages(editor);
        };
      })(this));
    };

    Linter.prototype.deactivate = function() {
      this.subscriptions.dispose();
      this.views.destroy();
      this.editors.deactivate();
      this.linters.deactivate();
      this.commands.destroy();
      return this.messages.deactivate();
    };

    return Linter;

  })();

  module.exports = Linter;

}).call(this);
