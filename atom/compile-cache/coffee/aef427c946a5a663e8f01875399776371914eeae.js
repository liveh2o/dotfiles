(function() {
  var CompositeDisposable, EditorLinter, EditorRegistry, Emitter, _ref;

  _ref = require('atom'), Emitter = _ref.Emitter, CompositeDisposable = _ref.CompositeDisposable;

  EditorLinter = require('./editor-linter');

  EditorRegistry = (function() {
    function EditorRegistry() {
      this.emitter = new Emitter;
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(this.emitter);
      this.editorLinters = new Map();
    }

    EditorRegistry.prototype.create = function(textEditor) {
      var editorLinter;
      this.editorLinters.set(textEditor, editorLinter = new EditorLinter(textEditor));
      editorLinter.onDidDestroy((function(_this) {
        return function() {
          _this.editorLinters["delete"](textEditor);
          return editorLinter.dispose();
        };
      })(this));
      this.emitter.emit('observe', editorLinter);
      return editorLinter;
    };

    EditorRegistry.prototype.forEach = function(callback) {
      return this.editorLinters.forEach(callback);
    };

    EditorRegistry.prototype.ofTextEditor = function(editor) {
      return this.editorLinters.get(editor);
    };

    EditorRegistry.prototype.ofActiveTextEditor = function() {
      return this.ofTextEditor(atom.workspace.getActiveTextEditor());
    };

    EditorRegistry.prototype.observe = function(callback) {
      this.forEach(callback);
      return this.emitter.on('observe', callback);
    };

    EditorRegistry.prototype.dispose = function() {
      this.subscriptions.dispose();
      this.editorLinters.forEach(function(editorLinter) {
        return editorLinter.dispose();
      });
      return this.editorLinters.clear();
    };

    return EditorRegistry;

  })();

  module.exports = EditorRegistry;

}).call(this);
