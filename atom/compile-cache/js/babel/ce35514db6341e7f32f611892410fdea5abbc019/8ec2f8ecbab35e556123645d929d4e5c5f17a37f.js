var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _editor = require('./editor');

var _editor2 = _interopRequireDefault(_editor);

var _helpers = require('./helpers');

var Editors = (function () {
  function Editors() {
    var _this = this;

    _classCallCheck(this, Editors);

    this.editors = new Set();
    this.messages = [];
    this.firstRender = true;
    this.subscriptions = new _atom.CompositeDisposable();

    this.subscriptions.add(atom.workspace.observeTextEditors(function (textEditor) {
      _this.getEditor(textEditor);
    }));
    this.subscriptions.add(atom.workspace.observeActivePaneItem(function (paneItem) {
      _this.editors.forEach(function (editor) {
        if (editor.textEditor !== paneItem) {
          editor.removeTooltip();
        }
      });
    }));
  }

  _createClass(Editors, [{
    key: 'isFirstRender',
    value: function isFirstRender() {
      return this.firstRender;
    }
  }, {
    key: 'update',
    value: function update(_ref) {
      var messages = _ref.messages;
      var added = _ref.added;
      var removed = _ref.removed;

      this.messages = messages;
      this.firstRender = false;

      var _getEditorsMap = (0, _helpers.getEditorsMap)(this);

      var editorsMap = _getEditorsMap.editorsMap;
      var filePaths = _getEditorsMap.filePaths;

      added.forEach(function (message) {
        var filePath = (0, _helpers.$file)(message);
        if (filePath && editorsMap[filePath]) {
          editorsMap[filePath].added.push(message);
        }
      });
      removed.forEach(function (message) {
        var filePath = (0, _helpers.$file)(message);
        if (filePath && editorsMap[filePath]) {
          editorsMap[filePath].removed.push(message);
        }
      });

      filePaths.forEach(function (filePath) {
        var value = editorsMap[filePath];
        if (value.added.length || value.removed.length) {
          value.editors.forEach(function (editor) {
            return editor.apply(value.added, value.removed);
          });
        }
      });
    }
  }, {
    key: 'getEditor',
    value: function getEditor(textEditor) {
      var _this2 = this;

      for (var entry of this.editors) {
        if (entry.textEditor === textEditor) {
          return entry;
        }
      }
      var editor = new _editor2['default'](textEditor);
      this.editors.add(editor);
      editor.onDidDestroy(function () {
        _this2.editors['delete'](editor);
      });
      editor.subscriptions.add(textEditor.onDidChangePath(function () {
        editor.dispose();
        _this2.getEditor(textEditor);
      }));
      editor.subscriptions.add(textEditor.onDidChangeGrammar(function () {
        editor.dispose();
        _this2.getEditor(textEditor);
      }));
      editor.apply((0, _helpers.filterMessages)(this.messages, textEditor.getPath()), []);
      return editor;
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      for (var entry of this.editors) {
        entry.dispose();
      }
      this.subscriptions.dispose();
    }
  }]);

  return Editors;
})();

module.exports = Editors;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvZWRpdG9ycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7b0JBRW9DLE1BQU07O3NCQUV2QixVQUFVOzs7O3VCQUN3QixXQUFXOztJQUcxRCxPQUFPO0FBTUEsV0FOUCxPQUFPLEdBTUc7OzswQkFOVixPQUFPOztBQU9ULFFBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTtBQUN4QixRQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQTtBQUNsQixRQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQTtBQUN2QixRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFBOztBQUU5QyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLFVBQUMsVUFBVSxFQUFLO0FBQ3ZFLFlBQUssU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFBO0tBQzNCLENBQUMsQ0FBQyxDQUFBO0FBQ0gsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxxQkFBcUIsQ0FBQyxVQUFDLFFBQVEsRUFBSztBQUN4RSxZQUFLLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBQyxNQUFNLEVBQUs7QUFDL0IsWUFBSSxNQUFNLENBQUMsVUFBVSxLQUFLLFFBQVEsRUFBRTtBQUNsQyxnQkFBTSxDQUFDLGFBQWEsRUFBRSxDQUFBO1NBQ3ZCO09BQ0YsQ0FBQyxDQUFBO0tBQ0gsQ0FBQyxDQUFDLENBQUE7R0FDSjs7ZUF0QkcsT0FBTzs7V0F1QkUseUJBQVk7QUFDdkIsYUFBTyxJQUFJLENBQUMsV0FBVyxDQUFBO0tBQ3hCOzs7V0FDSyxnQkFBQyxJQUEyQyxFQUFFO1VBQTNDLFFBQVEsR0FBVixJQUEyQyxDQUF6QyxRQUFRO1VBQUUsS0FBSyxHQUFqQixJQUEyQyxDQUEvQixLQUFLO1VBQUUs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O1NBOUVHLE9BQU87OztBQWlGYixNQUFNLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQSIsImZpbGUiOiIvVXNlcnMvYWgvLmF0b20vcGFja2FnZXMvbGludGVyLXVpLWRlZmF1bHQvbGliL2VkaXRvcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcbmltcG9ydCB0eXBlIHsgVGV4dEVkaXRvciB9IGZyb20gJ2F0b20nXG5pbXBvcnQgRWRpdG9yIGZyb20gJy4vZWRpdG9yJ1xuaW1wb3J0IHsgJGZpbGUsIGdldEVkaXRvcnNNYXAsIGZpbHRlck1lc3NhZ2VzIH0gZnJvbSAnLi9oZWxwZXJzJ1xuaW1wb3J0IHR5cGUgeyBMaW50ZXJNZXNzYWdlLCBNZXNzYWdlc1BhdGNoIH0gZnJvbSAnLi90eXBlcydcblxuY2xhc3MgRWRpdG9ycyB7XG4gIGVkaXRvcnM6IFNldDxFZGl0b3I+O1xuICBtZXNzYWdlczogQXJyYXk8TGludGVyTWVzc2FnZT47XG4gIGZpcnN0UmVuZGVyOiBib29sO1xuICBzdWJzY3JpcHRpb25zOiBDb21wb3NpdGVEaXNwb3NhYmxlO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuZWRpdG9ycyA9IG5ldyBTZXQoKVxuICAgIHRoaXMubWVzc2FnZXMgPSBbXVxuICAgIHRoaXMuZmlyc3RSZW5kZXIgPSB0cnVlXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLndvcmtzcGFjZS5vYnNlcnZlVGV4dEVkaXRvcnMoKHRleHRFZGl0b3IpID0+IHtcbiAgICAgIHRoaXMuZ2V0RWRpdG9yKHRleHRFZGl0b3IpXG4gICAgfSkpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLndvcmtzcGFjZS5vYnNlcnZlQWN0aXZlUGFuZUl0ZW0oKHBhbmVJdGVtKSA9PiB7XG4gICAgICB0aGlzLmVkaXRvcnMuZm9yRWFjaCgoZWRpdG9yKSA9PiB7XG4gICAgICAgIGlmIChlZGl0b3IudGV4dEVkaXRvciAhPT0gcGFuZUl0ZW0pIHtcbiAgICAgICAgICBlZGl0b3IucmVtb3ZlVG9vbHRpcCgpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSkpXG4gIH1cbiAgaXNGaXJzdFJlbmRlcigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5maXJzdFJlbmRlclxuICB9XG4gIHVwZGF0ZSh7IG1lc3NhZ2VzLCBhZGRlZCwgcmVtb3ZlZCB9OiBNZXNzYWdlc1BhdGNoKSB7XG4gICAgdGhpcy5tZXNzYWdlcyA9IG1lc3NhZ2VzXG4gICAgdGhpcy5maXJzdFJlbmRlciA9IGZhbHNlXG5cbiAgICBjb25zdCB7IGVkaXRvcnNNYXAsIGZpbGVQYXRocyB9ID0gZ2V0RWRpdG9yc01hcCh0aGlzKVxuICAgIGFkZGVkLmZvckVhY2goZnVuY3Rpb24obWVzc2FnZSkge1xuICAgICAgY29uc3QgZmlsZVBhdGggPSAkZmlsZShtZXNzYWdlKVxuICAgICAgaWYgKGZpbGVQYXRoICYmIGVkaXRvcnNNYXBbZmlsZVBhdGhdKSB7XG4gICAgICAgIGVkaXRvcnNNYXBbZmlsZVBhdGhdLmFkZGVkLnB1c2gobWVzc2FnZSlcbiAgICAgIH1cbiAgICB9KVxuICAgIHJlbW92ZWQuZm9yRWFjaChmdW5jdGlvbihtZXNzYWdlKSB7XG4gICAgICBjb25zdCBmaWxlUGF0aCA9ICRmaWxlKG1lc3NhZ2UpXG4gICAgICBpZiAoZmlsZVBhdGggJiYgZWRpdG9yc01hcFtmaWxlUGF0aF0pIHtcbiAgICAgICAgZWRpdG9yc01hcFtmaWxlUGF0aF0ucmVtb3ZlZC5wdXNoKG1lc3NhZ2UpXG4gICAgICB9XG4gICAgfSlcblxuICAgIGZpbGVQYXRocy5mb3JFYWNoKGZ1bmN0aW9uKGZpbGVQYXRoKSB7XG4gICAgICBjb25zdCB2YWx1ZSA9IGVkaXRvcnNNYXBbZmlsZVBhdGhdXG4gICAgICBpZiAodmFsdWUuYWRkZWQubGVuZ3RoIHx8IHZhbHVlLnJlbW92ZWQubGVuZ3RoKSB7XG4gICAgICAgIHZhbHVlLmVkaXRvcnMuZm9yRWFjaChlZGl0b3IgPT4gZWRpdG9yLmFwcGx5KHZhbHVlLmFkZGVkLCB2YWx1ZS5yZW1vdmVkKSlcbiAgICAgIH1cbiAgICB9KVxuICB9XG4gIGdldEVkaXRvcih0ZXh0RWRpdG9yOiBUZXh0RWRpdG9yKTogRWRpdG9yIHtcbiAgICBmb3IgKGNvbnN0IGVudHJ5IG9mIHRoaXMuZWRpdG9ycykge1xuICAgICAgaWYgKGVudHJ5LnRleHRFZGl0b3IgPT09IHRleHRFZGl0b3IpIHtcbiAgICAgICAgcmV0dXJuIGVudHJ5XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IGVkaXRvciA9IG5ldyBFZGl0b3IodGV4dEVkaXRvcilcbiAgICB0aGlzLmVkaXRvcnMuYWRkKGVkaXRvcilcbiAgICBlZGl0b3Iub25EaWREZXN0cm95KCgpID0+IHtcbiAgICAgIHRoaXMuZWRpdG9ycy5kZWxldGUoZWRpdG9yKVxuICAgIH0pXG4gICAgZWRpdG9yLnN1YnNjcmlwdGlvbnMuYWRkKHRleHRFZGl0b3Iub25EaWRDaGFuZ2VQYXRoKCgpID0+IHtcbiAgICAgIGVkaXRvci5kaXNwb3NlKClcbiAgICAgIHRoaXMuZ2V0RWRpdG9yKHRleHRFZGl0b3IpXG4gICAgfSkpXG4gICAgZWRpdG9yLnN1YnNjcmlwdGlvbnMuYWRkKHRleHRFZGl0b3Iub25EaWRDaGFuZ2VHcmFtbWFyKCgpID0+IHtcbiAgICAgIGVkaXRvci5kaXNwb3NlKClcbiAgICAgIHRoaXMuZ2V0RWRpdG9yKHRleHRFZGl0b3IpXG4gICAgfSkpXG4gICAgZWRpdG9yLmFwcGx5KGZpbHRlck1lc3NhZ2VzKHRoaXMubWVzc2FnZXMsIHRleHRFZGl0b3IuZ2V0UGF0aCgpKSwgW10pXG4gICAgcmV0dXJuIGVkaXRvclxuICB9XG4gIGRpc3Bvc2UoKSB7XG4gICAgZm9yIChjb25zdCBlbnRyeSBvZiB0aGlzLmVkaXRvcnMpIHtcbiAgICAgIGVudHJ5LmRpc3Bvc2UoKVxuICAgIH1cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBFZGl0b3JzXG4iXX0=