(function() {
  var Commands, CompositeDisposable, EditorLinter, Emitter, Helpers, Linter, LinterViews, Path, _ref;

  Path = require('path');

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Emitter = _ref.Emitter;

  LinterViews = require('./linter-views');

  EditorLinter = require('./editor-linter');

  Helpers = require('./helpers');

  Commands = require('./commands');

  Linter = (function() {
    function Linter(state) {
      var _base;
      this.state = state;
      if ((_base = this.state).scope == null) {
        _base.scope = 'File';
      }
      this.lintOnFly = true;
      this.emitter = new Emitter;
      this.linters = new (require('./linter-registry'))();
      this.editors = new (require('./editor-registry'))();
      this.messages = new (require('./message-registry'))();
      this.views = new LinterViews(state.scope, this.editors);
      this.commands = new Commands(this);
      this.subscriptions = new CompositeDisposable(this.views, this.editors, this.linters, this.messages, this.commands);
      this.linters.onDidUpdateMessages((function(_this) {
        return function(_arg) {
          var editor, linter, messages;
          linter = _arg.linter, messages = _arg.messages, editor = _arg.editor;
          return _this.messages.set({
            linter: linter,
            messages: messages,
            editorLinter: _this.editors.ofTextEditor(editor)
          });
        };
      })(this));
      this.messages.onDidUpdateMessages((function(_this) {
        return function(messages) {
          return _this.views.render(messages);
        };
      })(this));
      this.views.onDidUpdateScope((function(_this) {
        return function(scope) {
          return _this.state.scope = scope;
        };
      })(this));
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

    Linter.prototype.addLinter = function(linter) {
      return this.linters.addLinter(linter);
    };

    Linter.prototype.deleteLinter = function(linter) {
      if (!this.hasLinter(linter)) {
        return;
      }
      this.linters.deleteLinter(linter);
      return this.deleteMessages(linter);
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

    Linter.prototype.getActiveEditorLinter = function() {
      return this.editors.ofActiveTextEditor();
    };

    Linter.prototype.getEditorLinter = function(editor) {
      return this.editors.ofTextEditor(editor);
    };

    Linter.prototype.getEditorLinterByPath = function(path) {
      return this.editors.ofPath(path);
    };

    Linter.prototype.eachEditorLinter = function(callback) {
      return this.editors.forEach(callback);
    };

    Linter.prototype.observeEditorLinters = function(callback) {
      return this.editors.observe(callback);
    };

    Linter.prototype.createEditorLinter = function(editor) {
      var editorLinter;
      if (this.editors.has(editor)) {
        return;
      }
      editorLinter = this.editors.create(editor);
      editorLinter.onShouldUpdateBubble((function(_this) {
        return function() {
          return _this.views.renderBubble(editorLinter);
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
      editorLinter.onDidDestroy((function(_this) {
        return function() {
          return _this.messages.deleteEditorMessages(editorLinter);
        };
      })(this));
      editorLinter.onDidCalculateLineMessages((function(_this) {
        return function() {
          _this.views.updateCounts();
          if (_this.state.scope === 'Line') {
            return _this.views.bottomPanel.refresh();
          }
        };
      })(this));
      return this.views.notifyEditorLinter(editorLinter);
    };

    Linter.prototype.deactivate = function() {
      return this.subscriptions.dispose();
    };

    return Linter;

  })();

  module.exports = Linter;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvbGludGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw4RkFBQTs7QUFBQSxFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUFQLENBQUE7O0FBQUEsRUFDQSxPQUFpQyxPQUFBLENBQVEsTUFBUixDQUFqQyxFQUFDLDJCQUFBLG1CQUFELEVBQXNCLGVBQUEsT0FEdEIsQ0FBQTs7QUFBQSxFQUVBLFdBQUEsR0FBYyxPQUFBLENBQVEsZ0JBQVIsQ0FGZCxDQUFBOztBQUFBLEVBR0EsWUFBQSxHQUFlLE9BQUEsQ0FBUSxpQkFBUixDQUhmLENBQUE7O0FBQUEsRUFJQSxPQUFBLEdBQVUsT0FBQSxDQUFRLFdBQVIsQ0FKVixDQUFBOztBQUFBLEVBS0EsUUFBQSxHQUFXLE9BQUEsQ0FBUSxZQUFSLENBTFgsQ0FBQTs7QUFBQSxFQU9NO0FBRVMsSUFBQSxnQkFBRSxLQUFGLEdBQUE7QUFDWCxVQUFBLEtBQUE7QUFBQSxNQURZLElBQUMsQ0FBQSxRQUFBLEtBQ2IsQ0FBQTs7YUFBTSxDQUFDLFFBQVM7T0FBaEI7QUFBQSxNQUdBLElBQUMsQ0FBQSxTQUFELEdBQWEsSUFIYixDQUFBO0FBQUEsTUFNQSxJQUFDLENBQUEsT0FBRCxHQUFXLEdBQUEsQ0FBQSxPQU5YLENBQUE7QUFBQSxNQU9BLElBQUMsQ0FBQSxPQUFELEdBQWUsSUFBQSxDQUFDLE9BQUEsQ0FBUSxtQkFBUixDQUFELENBQUEsQ0FBQSxDQVBmLENBQUE7QUFBQSxNQVFBLElBQUMsQ0FBQSxPQUFELEdBQWUsSUFBQSxDQUFDLE9BQUEsQ0FBUSxtQkFBUixDQUFELENBQUEsQ0FBQSxDQVJmLENBQUE7QUFBQSxNQVNBLElBQUMsQ0FBQSxRQUFELEdBQWdCLElBQUEsQ0FBQyxPQUFBLENBQVEs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

//# sourceURL=/Users/ah/.atom/packages/linter/lib/linter.coffee
