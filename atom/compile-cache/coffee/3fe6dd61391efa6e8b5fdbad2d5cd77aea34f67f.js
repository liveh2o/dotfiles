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
      this.views = new LinterViews(this.state.scope, this.editors);
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
