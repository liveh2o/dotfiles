(function() {
  var Commands, CompositeDisposable, EditorLinter, EditorRegistry, Emitter, Helpers, IndieRegistry, Linter, LinterRegistry, LinterViews, MessageRegistry, Path, _ref;

  Path = require('path');

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Emitter = _ref.Emitter;

  LinterViews = require('./linter-views');

  MessageRegistry = require('./message-registry');

  EditorRegistry = require('./editor-registry');

  EditorLinter = require('./editor-linter');

  LinterRegistry = require('./linter-registry');

  IndieRegistry = require('./indie-registry');

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
      this.linters = new LinterRegistry;
      this.indieLinters = new IndieRegistry();
      this.editors = new EditorRegistry;
      this.messages = new MessageRegistry();
      this.views = new LinterViews(state.scope, this.editors);
      this.commands = new Commands(this);
      this.subscriptions = new CompositeDisposable(this.views, this.editors, this.linters, this.messages, this.commands, this.indieLinters);
      this.indieLinters.observe((function(_this) {
        return function(indieLinter) {
          return indieLinter.onDidDestroy(function() {
            return _this.messages.deleteMessages(indieLinter);
          });
        };
      })(this));
      this.indieLinters.onDidUpdateMessages((function(_this) {
        return function(_arg) {
          var linter, messages;
          linter = _arg.linter, messages = _arg.messages;
          return _this.messages.set({
            linter: linter,
            messages: messages
          });
        };
      })(this));
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvbGludGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw4SkFBQTs7QUFBQSxFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUFQLENBQUE7O0FBQUEsRUFDQSxPQUFpQyxPQUFBLENBQVEsTUFBUixDQUFqQyxFQUFDLDJCQUFBLG1CQUFELEVBQXNCLGVBQUEsT0FEdEIsQ0FBQTs7QUFBQSxFQUVBLFdBQUEsR0FBYyxPQUFBLENBQVEsZ0JBQVIsQ0FGZCxDQUFBOztBQUFBLEVBR0EsZUFBQSxHQUFrQixPQUFBLENBQVEsb0JBQVIsQ0FIbEIsQ0FBQTs7QUFBQSxFQUlBLGNBQUEsR0FBaUIsT0FBQSxDQUFRLG1CQUFSLENBSmpCLENBQUE7O0FBQUEsRUFLQSxZQUFBLEdBQWUsT0FBQSxDQUFRLGlCQUFSLENBTGYsQ0FBQTs7QUFBQSxFQU1BLGNBQUEsR0FBaUIsT0FBQSxDQUFRLG1CQUFSLENBTmpCLENBQUE7O0FBQUEsRUFPQSxhQUFBLEdBQWdCLE9BQUEsQ0FBUSxrQkFBUixDQVBoQixDQUFBOztBQUFBLEVBUUEsT0FBQSxHQUFVLE9BQUEsQ0FBUSxXQUFSLENBUlYsQ0FBQTs7QUFBQSxFQVNBLFFBQUEsR0FBVyxPQUFBLENBQVEsWUFBUixDQVRYLENBQUE7O0FBQUEsRUFXTTtBQUVTLElBQUEsZ0JBQUUsS0FBRixHQUFBO0FBQ1gsVUFBQSxLQUFBO0FBQUEsTUFEWSxJQUFDLENBQUEsUUFBQSxLQUNiLENBQUE7O2FBQU0sQ0FBQyxRQUFTO09BQWhCO0FBQUEsTUFHQSxJQUFDLENBQUEsU0FBRCxHQUFhLElBSGIsQ0FBQTtBQUFBLE1BTUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxHQUFBLENBQUEsT0FOWCxDQUFBO0FBQUEsTUFPQSxJQUFDLENB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

//# sourceURL=/Users/ah/.atom/packages/linter/lib/linter.coffee
