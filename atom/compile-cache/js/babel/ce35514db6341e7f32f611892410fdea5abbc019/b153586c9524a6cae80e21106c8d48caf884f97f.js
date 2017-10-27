Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

'use babel';

var MockEditor = (function () {
  function MockEditor(softWrap) {
    _classCallCheck(this, MockEditor);

    this.softWrap = softWrap;
    this.toggled = false;
  }

  _createClass(MockEditor, [{
    key: 'onDidChangeGrammar',
    value: function onDidChangeGrammar() {
      return new _atom.CompositeDisposable();
    }
  }, {
    key: 'onDidChangeSoftWrapped',
    value: function onDidChangeSoftWrapped() {
      return new _atom.CompositeDisposable();
    }
  }, {
    key: 'onDidDestroy',
    value: function onDidDestroy() {
      return new _atom.CompositeDisposable();
    }
  }, {
    key: 'isSoftWrapped',
    value: function isSoftWrapped() {
      return this.softWrap;
    }
  }, {
    key: 'toggleSoftWrapped',
    value: function toggleSoftWrapped() {
      this.toggled = true;
    }
  }]);

  return MockEditor;
})();

exports['default'] = MockEditor;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9zb2Z0LXdyYXAtaW5kaWNhdG9yL3NwZWMvbW9jay1lZGl0b3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7b0JBRWtDLE1BQU07O0FBRnhDLFdBQVcsQ0FBQTs7SUFJVSxVQUFVO0FBQ2pCLFdBRE8sVUFBVSxDQUNoQixRQUFRLEVBQUU7MEJBREosVUFBVTs7QUFFM0IsUUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUE7QUFDeEIsUUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUE7R0FDckI7O2VBSmtCLFVBQVU7O1dBTVYsOEJBQUc7QUFDcEIsYUFBTywrQkFBeUIsQ0FBQTtLQUNqQzs7O1dBRXNCLGtDQUFHO0FBQ3hCLGFBQU8sK0JBQXlCLENBQUE7S0FDakM7OztXQUVZLHdCQUFHO0FBQ2QsYUFBTywrQkFBeUIsQ0FBQTtLQUNqQzs7O1dBRWEseUJBQUc7QUFDZixhQUFPLElBQUksQ0FBQyxRQUFRLENBQUE7S0FDckI7OztXQUVpQiw2QkFBRztBQUNuQixVQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQTtLQUNwQjs7O1NBeEJrQixVQUFVOzs7cUJBQVYsVUFBVSIsImZpbGUiOiIvVXNlcnMvYWgvLmF0b20vcGFja2FnZXMvc29mdC13cmFwLWluZGljYXRvci9zcGVjL21vY2stZWRpdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IHtDb21wb3NpdGVEaXNwb3NhYmxlfSBmcm9tICdhdG9tJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNb2NrRWRpdG9yIHtcbiAgY29uc3RydWN0b3IgKHNvZnRXcmFwKSB7XG4gICAgdGhpcy5zb2Z0V3JhcCA9IHNvZnRXcmFwXG4gICAgdGhpcy50b2dnbGVkID0gZmFsc2VcbiAgfVxuXG4gIG9uRGlkQ2hhbmdlR3JhbW1hciAoKSB7XG4gICAgcmV0dXJuIG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgfVxuXG4gIG9uRGlkQ2hhbmdlU29mdFdyYXBwZWQgKCkge1xuICAgIHJldHVybiBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gIH1cblxuICBvbkRpZERlc3Ryb3kgKCkge1xuICAgIHJldHVybiBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gIH1cblxuICBpc1NvZnRXcmFwcGVkICgpIHtcbiAgICByZXR1cm4gdGhpcy5zb2Z0V3JhcFxuICB9XG5cbiAgdG9nZ2xlU29mdFdyYXBwZWQgKCkge1xuICAgIHRoaXMudG9nZ2xlZCA9IHRydWVcbiAgfVxufVxuIl19
//# sourceURL=/Users/ah/.atom/packages/soft-wrap-indicator/spec/mock-editor.js
