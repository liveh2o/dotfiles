(function() {
  var CompositeDisposable, EditorLinter, Emitter, TextEditor, _ref;

  _ref = require('atom'), TextEditor = _ref.TextEditor, Emitter = _ref.Emitter, CompositeDisposable = _ref.CompositeDisposable;

  EditorLinter = (function() {
    function EditorLinter(editor) {
      this.editor = editor;
      if (!(this.editor instanceof TextEditor)) {
        throw new Error("Given editor isn't really an editor");
      }
      this.emitter = new Emitter;
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(this.emitter);
      this.subscriptions.add(this.editor.onDidDestroy((function(_this) {
        return function() {
          return _this.emitter.emit('did-destroy');
        };
      })(this)));
      this.subscriptions.add(this.editor.onDidSave((function(_this) {
        return function() {
          return _this.emitter.emit('should-lint', false);
        };
      })(this)));
      this.subscriptions.add(this.editor.onDidChangeCursorPosition((function(_this) {
        return function(_arg) {
          var newBufferPosition, oldBufferPosition;
          oldBufferPosition = _arg.oldBufferPosition, newBufferPosition = _arg.newBufferPosition;
          if (newBufferPosition.row !== oldBufferPosition.row) {
            _this.emitter.emit('should-update-line-messages');
          }
          return _this.emitter.emit('should-update-bubble');
        };
      })(this)));
      setImmediate((function(_this) {
        return function() {
          return _this.subscriptions.add(_this.editor.onDidStopChanging(function() {
            return _this.lint(true);
          }));
        };
      })(this));
    }

    EditorLinter.prototype.lint = function(onChange) {
      if (onChange == null) {
        onChange = false;
      }
      return this.emitter.emit('should-lint', onChange);
    };

    EditorLinter.prototype.onShouldUpdateBubble = function(callback) {
      return this.emitter.on('should-update-bubble', callback);
    };

    EditorLinter.prototype.onShouldUpdateLineMessages = function(callback) {
      return this.emitter.on('should-update-line-messages', callback);
    };

    EditorLinter.prototype.onShouldLint = function(callback) {
      return this.emitter.on('should-lint', callback);
    };

    EditorLinter.prototype.onDidDestroy = function(callback) {
      return this.emitter.on('did-destroy', callback);
    };

    EditorLinter.prototype.destroy = function() {
      this.emitter.emit('did-destroy');
      return this.dispose();
    };

    EditorLinter.prototype.dispose = function() {
      return this.subscriptions.dispose();
    };

    return EditorLinter;

  })();

  module.exports = EditorLinter;

}).call(this);
