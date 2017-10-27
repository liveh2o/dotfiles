Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _sbDebounce = require('sb-debounce');

var _sbDebounce2 = _interopRequireDefault(_sbDebounce);

var _helpers = require('./helpers');

var EditorLinter = (function () {
  function EditorLinter(editor) {
    var _this = this;

    _classCallCheck(this, EditorLinter);

    if (!atom.workspace.isTextEditor(editor)) {
      throw new Error('EditorLinter expects a valid TextEditor');
    }

    this.editor = editor;
    this.emitter = new _atom.Emitter();
    this.subscriptions = new _atom.CompositeDisposable();

    this.subscriptions.add(this.editor.onDidDestroy(function () {
      return _this.dispose();
    }));
    this.subscriptions.add(this.editor.onDidSave((0, _sbDebounce2['default'])(function () {
      return _this.emitter.emit('should-lint', false);
    }), 16, true));
    // NOTE: TextEditor::onDidChange immediately invokes the callback if the text editor was *just* created
    // Using TextBuffer::onDidChange doesn't have the same behavior so using it instead.
    this.subscriptions.add((0, _helpers.subscriptiveObserve)(atom.config, 'linter.lintOnChangeInterval', function (interval) {
      return _this.editor.getBuffer().onDidChange((0, _sbDebounce2['default'])(function () {
        _this.emitter.emit('should-lint', true);
      }, interval));
    }));
  }

  _createClass(EditorLinter, [{
    key: 'getEditor',
    value: function getEditor() {
      return this.editor;
    }
  }, {
    key: 'lint',
    value: function lint() {
      var onChange = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

      this.emitter.emit('should-lint', onChange);
    }
  }, {
    key: 'onShouldLint',
    value: function onShouldLint(callback) {
      return this.emitter.on('should-lint', callback);
    }
  }, {
    key: 'onDidDestroy',
    value: function onDidDestroy(callback) {
      return this.emitter.on('did-destroy', callback);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.emitter.emit('did-destroy');
      this.subscriptions.dispose();
      this.emitter.dispose();
    }
  }]);

  return EditorLinter;
})();

exports['default'] = EditorLinter;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL2VkaXRvci1saW50ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztvQkFFeUQsTUFBTTs7MEJBQzFDLGFBQWE7Ozs7dUJBRUUsV0FBVzs7SUFFMUIsWUFBWTtBQUtwQixXQUxRLFlBQVksQ0FLbkIsTUFBa0IsRUFBRTs7OzBCQUxiLFlBQVk7O0FBTTdCLFFBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsRUFBRTtBQUN4QyxZQUFNLElBQUksS0FBSyxDQUFDLHlDQUF5QyxDQUFDLENBQUE7S0FDM0Q7O0FBRUQsUUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUE7QUFDcEIsUUFBSSxDQUFDLE9BQU8sR0FBRyxtQkFBYSxDQUFBO0FBQzVCLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7O0FBRTlDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDO2FBQzlDLE1BQUssT0FBTyxFQUFFO0tBQUEsQ0FDZixDQUFDLENBQUE7QUFDRixRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyw2QkFBUzthQUNwRCxNQUFLLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLEtBQUssQ0FBQztLQUFBLENBQ3hDLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUE7OztBQUdiLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLGtDQUFvQixJQUFJLENBQUMsTUFBTSxFQUFFLDZCQUE2QixFQUFFLFVBQUEsUUFBUTthQUM3RixNQUFLLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQyxXQUFXLENBQUMsNkJBQVMsWUFBTTtBQUNqRCxjQUFLLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFBO09BQ3ZDLEVBQUUsUUFBUSxDQUFDLENBQUM7S0FBQSxDQUNkLENBQUMsQ0FBQTtHQUNIOztlQTNCa0IsWUFBWTs7V0E0QnRCLHFCQUFlO0FBQ3RCLGFBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQTtLQUNuQjs7O1dBQ0csZ0JBQTRCO1VBQTNCLFFBQWlCLHlEQUFHLEtBQUs7O0FBQzVCLFVBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxRQUFRLENBQUMsQ0FBQTtLQUMzQzs7O1dBQ1csc0JBQUMsUUFBa0IsRUFBYztBQUMzQyxhQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxRQUFRLENBQUMsQ0FBQTtLQUNoRDs7O1dBQ1csc0JBQUMsUUFBa0IsRUFBYztBQUMzQyxhQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxRQUFRLENBQUMsQ0FBQTtLQUNoRDs7O1dBQ00sbUJBQUc7QUFDUixVQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQTtBQUNoQyxVQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQzVCLFVBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUE7S0FDdkI7OztTQTVDa0IsWUFBWTs7O3FCQUFaLFlBQVkiLCJmaWxlIjoiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvZWRpdG9yLWxpbnRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCB7IEVtaXR0ZXIsIENvbXBvc2l0ZURpc3Bvc2FibGUsIERpc3Bvc2FibGUgfSBmcm9tICdhdG9tJ1xuaW1wb3J0IGRlYm91bmNlIGZyb20gJ3NiLWRlYm91bmNlJ1xuaW1wb3J0IHR5cGUgeyBUZXh0RWRpdG9yIH0gZnJvbSAnYXRvbSdcbmltcG9ydCB7IHN1YnNjcmlwdGl2ZU9ic2VydmUgfSBmcm9tICcuL2hlbHBlcnMnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVkaXRvckxpbnRlciB7XG4gIGVkaXRvcjogVGV4dEVkaXRvcjtcbiAgZW1pdHRlcjogRW1pdHRlcjtcbiAgc3Vic2NyaXB0aW9uczogQ29tcG9zaXRlRGlzcG9zYWJsZTtcblxuICBjb25zdHJ1Y3RvcihlZGl0b3I6IFRleHRFZGl0b3IpIHtcbiAgICBpZiAoIWF0b20ud29ya3NwYWNlLmlzVGV4dEVkaXRvcihlZGl0b3IpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0VkaXRvckxpbnRlciBleHBlY3RzIGEgdmFsaWQgVGV4dEVkaXRvcicpXG4gICAgfVxuXG4gICAgdGhpcy5lZGl0b3IgPSBlZGl0b3JcbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLmVkaXRvci5vbkRpZERlc3Ryb3koKCkgPT5cbiAgICAgIHRoaXMuZGlzcG9zZSgpLFxuICAgICkpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLmVkaXRvci5vbkRpZFNhdmUoZGVib3VuY2UoKCkgPT5cbiAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdzaG91bGQtbGludCcsIGZhbHNlKSxcbiAgICApLCAxNiwgdHJ1ZSkpXG4gICAgLy8gTk9URTogVGV4dEVkaXRvcjo6b25EaWRDaGFuZ2UgaW1tZWRpYXRlbHkgaW52b2tlcyB0aGUgY2FsbGJhY2sgaWYgdGhlIHRleHQgZWRpdG9yIHdhcyAqanVzdCogY3JlYXRlZFxuICAgIC8vIFVzaW5nIFRleHRCdWZmZXI6Om9uRGlkQ2hhbmdlIGRvZXNuJ3QgaGF2ZSB0aGUgc2FtZSBiZWhhdmlvciBzbyB1c2luZyBpdCBpbnN0ZWFkLlxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoc3Vic2NyaXB0aXZlT2JzZXJ2ZShhdG9tLmNvbmZpZywgJ2xpbnRlci5saW50T25DaGFuZ2VJbnRlcnZhbCcsIGludGVydmFsID0+XG4gICAgICB0aGlzLmVkaXRvci5nZXRCdWZmZXIoKS5vbkRpZENoYW5nZShkZWJvdW5jZSgoKSA9PiB7XG4gICAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdzaG91bGQtbGludCcsIHRydWUpXG4gICAgICB9LCBpbnRlcnZhbCkpLFxuICAgICkpXG4gIH1cbiAgZ2V0RWRpdG9yKCk6IFRleHRFZGl0b3Ige1xuICAgIHJldHVybiB0aGlzLmVkaXRvclxuICB9XG4gIGxpbnQob25DaGFuZ2U6IGJvb2xlYW4gPSBmYWxzZSkge1xuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdzaG91bGQtbGludCcsIG9uQ2hhbmdlKVxuICB9XG4gIG9uU2hvdWxkTGludChjYWxsYmFjazogRnVuY3Rpb24pOiBEaXNwb3NhYmxlIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdzaG91bGQtbGludCcsIGNhbGxiYWNrKVxuICB9XG4gIG9uRGlkRGVzdHJveShjYWxsYmFjazogRnVuY3Rpb24pOiBEaXNwb3NhYmxlIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtZGVzdHJveScsIGNhbGxiYWNrKVxuICB9XG4gIGRpc3Bvc2UoKSB7XG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1kZXN0cm95JylcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgdGhpcy5lbWl0dGVyLmRpc3Bvc2UoKVxuICB9XG59XG4iXX0=