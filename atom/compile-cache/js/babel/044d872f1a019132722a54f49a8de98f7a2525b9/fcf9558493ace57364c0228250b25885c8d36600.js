Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

'use babel';

var EditorLinter = require('./editor-linter');

var EditorRegistry = (function () {
  function EditorRegistry() {
    _classCallCheck(this, EditorRegistry);

    this.emitter = new _atom.Emitter();
    this.subscriptions = new _atom.CompositeDisposable();
    this.editorLinters = new Map();

    this.subscriptions.add(this.emitter);
  }

  _createClass(EditorRegistry, [{
    key: 'create',
    value: function create(textEditor) {
      var _this = this;

      var editorLinter = new EditorLinter(textEditor);
      this.editorLinters.set(textEditor, editorLinter);
      this.emitter.emit('observe', editorLinter);
      editorLinter.onDidDestroy(function () {
        return _this.editorLinters['delete'](textEditor);
      });
      return editorLinter;
    }
  }, {
    key: 'has',
    value: function has(textEditor) {
      return this.editorLinters.has(textEditor);
    }
  }, {
    key: 'forEach',
    value: function forEach(textEditor) {
      this.editorLinters.forEach(textEditor);
    }
  }, {
    key: 'ofPath',
    value: function ofPath(path) {
      for (var editorLinter of this.editorLinters) {
        if (editorLinter[0].getPath() === path) {
          return editorLinter[1];
        }
      }
    }
  }, {
    key: 'ofTextEditor',
    value: function ofTextEditor(textEditor) {
      return this.editorLinters.get(textEditor);
    }
  }, {
    key: 'ofActiveTextEditor',
    value: function ofActiveTextEditor() {
      return this.ofTextEditor(atom.workspace.getActiveTextEditor());
    }
  }, {
    key: 'observe',
    value: function observe(callback) {
      this.forEach(callback);
      return this.emitter.on('observe', callback);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
      this.editorLinters.forEach(function (editorLinter) {
        editorLinter.dispose();
      });
      this.editorLinters.clear();
    }
  }]);

  return EditorRegistry;
})();

exports['default'] = EditorRegistry;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL2VkaXRvci1yZWdpc3RyeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztvQkFFMkMsTUFBTTs7QUFGakQsV0FBVyxDQUFBOztBQUdYLElBQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFBOztJQUUxQixjQUFjO0FBQ3RCLFdBRFEsY0FBYyxHQUNuQjswQkFESyxjQUFjOztBQUUvQixRQUFJLENBQUMsT0FBTyxHQUFHLG1CQUFhLENBQUE7QUFDNUIsUUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQTtBQUM5QyxRQUFJLENBQUMsYUFBYSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7O0FBRTlCLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtHQUNyQzs7ZUFQa0IsY0FBYzs7V0FTM0IsZ0JBQUMsVUFBVSxFQUFFOzs7QUFDakIsVUFBTSxZQUFZLEdBQUcsSUFBSSxZQUFZLENBQUMsVUFBVSxDQUFDLENBQUE7QUFDakQsVUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLFlBQVksQ0FBQyxDQUFBO0FBQ2hELFVBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxZQUFZLENBQUMsQ0FBQTtBQUMxQyxrQkFBWSxDQUFDLFlBQVksQ0FBQztlQUN4QixNQUFLLGFBQWEsVUFBTyxDQUFDLFVBQVUsQ0FBQztPQUFBLENBQ3RDLENBQUE7QUFDRCxhQUFPLFlBQVksQ0FBQTtLQUNwQjs7O1dBRUUsYUFBQyxVQUFVLEVBQUU7QUFDZCxhQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFBO0tBQzFDOzs7V0FFTSxpQkFBQyxVQUFVLEVBQUU7QUFDbEIsVUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUE7S0FDdkM7OztXQUVLLGdCQUFDLElBQUksRUFBRTtBQUNYLFdBQUssSUFBSSxZQUFZLElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtBQUMzQyxZQUFJLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsS0FBSyxJQUFJLEVBQUU7QUFDdEMsaUJBQU8sWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFBO1NBQ3ZCO09BQ0Y7S0FDRjs7O1dBRVcsc0JBQUMsVUFBVSxFQUFFO0FBQ3ZCLGFBQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUE7S0FDMUM7OztXQUVpQiw4QkFBRztBQUNuQixhQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLENBQUE7S0FDL0Q7OztXQUVNLGlCQUFDLFFBQVEsRUFBRTtBQUNoQixVQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQ3RCLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFBO0tBQzVDOzs7V0FFTSxtQkFBRztBQUNSLFVBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDNUIsVUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsVUFBUyxZQUFZLEVBQUU7QUFDaEQsb0JBQVksQ0FBQyxPQUFPLEVBQUUsQ0FBQTtPQUN2QixDQUFDLENBQUE7QUFDRixVQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxDQUFBO0tBQzNCOzs7U0F0RGtCLGNBQWM7OztxQkFBZCxjQUFjIiwiZmlsZSI6Ii9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL2VkaXRvci1yZWdpc3RyeS5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCB7RW1pdHRlciwgQ29tcG9zaXRlRGlzcG9zYWJsZX0gZnJvbSAnYXRvbSdcbmNvbnN0IEVkaXRvckxpbnRlciA9IHJlcXVpcmUoJy4vZWRpdG9yLWxpbnRlcicpXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVkaXRvclJlZ2lzdHJ5IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXIoKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICB0aGlzLmVkaXRvckxpbnRlcnMgPSBuZXcgTWFwKClcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5lbWl0dGVyKVxuICB9XG5cbiAgY3JlYXRlKHRleHRFZGl0b3IpIHtcbiAgICBjb25zdCBlZGl0b3JMaW50ZXIgPSBuZXcgRWRpdG9yTGludGVyKHRleHRFZGl0b3IpXG4gICAgdGhpcy5lZGl0b3JMaW50ZXJzLnNldCh0ZXh0RWRpdG9yLCBlZGl0b3JMaW50ZXIpXG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ29ic2VydmUnLCBlZGl0b3JMaW50ZXIpXG4gICAgZWRpdG9yTGludGVyLm9uRGlkRGVzdHJveSgoKSA9PlxuICAgICAgdGhpcy5lZGl0b3JMaW50ZXJzLmRlbGV0ZSh0ZXh0RWRpdG9yKVxuICAgIClcbiAgICByZXR1cm4gZWRpdG9yTGludGVyXG4gIH1cblxuICBoYXModGV4dEVkaXRvcikge1xuICAgIHJldHVybiB0aGlzLmVkaXRvckxpbnRlcnMuaGFzKHRleHRFZGl0b3IpXG4gIH1cblxuICBmb3JFYWNoKHRleHRFZGl0b3IpIHtcbiAgICB0aGlzLmVkaXRvckxpbnRlcnMuZm9yRWFjaCh0ZXh0RWRpdG9yKVxuICB9XG5cbiAgb2ZQYXRoKHBhdGgpIHtcbiAgICBmb3IgKGxldCBlZGl0b3JMaW50ZXIgb2YgdGhpcy5lZGl0b3JMaW50ZXJzKSB7XG4gICAgICBpZiAoZWRpdG9yTGludGVyWzBdLmdldFBhdGgoKSA9PT0gcGF0aCkge1xuICAgICAgICByZXR1cm4gZWRpdG9yTGludGVyWzFdXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgb2ZUZXh0RWRpdG9yKHRleHRFZGl0b3IpIHtcbiAgICByZXR1cm4gdGhpcy5lZGl0b3JMaW50ZXJzLmdldCh0ZXh0RWRpdG9yKVxuICB9XG5cbiAgb2ZBY3RpdmVUZXh0RWRpdG9yKCkge1xuICAgIHJldHVybiB0aGlzLm9mVGV4dEVkaXRvcihhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCkpXG4gIH1cblxuICBvYnNlcnZlKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5mb3JFYWNoKGNhbGxiYWNrKVxuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ29ic2VydmUnLCBjYWxsYmFjaylcbiAgfVxuXG4gIGRpc3Bvc2UoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgIHRoaXMuZWRpdG9yTGludGVycy5mb3JFYWNoKGZ1bmN0aW9uKGVkaXRvckxpbnRlcikge1xuICAgICAgZWRpdG9yTGludGVyLmRpc3Bvc2UoKVxuICAgIH0pXG4gICAgdGhpcy5lZGl0b3JMaW50ZXJzLmNsZWFyKClcbiAgfVxufVxuIl19
//# sourceURL=/Users/ah/.atom/packages/linter/lib/editor-registry.js
