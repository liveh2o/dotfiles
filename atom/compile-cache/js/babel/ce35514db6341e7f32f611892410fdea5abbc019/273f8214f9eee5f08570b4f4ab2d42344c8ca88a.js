Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/** @babel */

var _whitespace = require('./whitespace');

var _whitespace2 = _interopRequireDefault(_whitespace);

exports['default'] = {
  activate: function activate() {
    this.whitespace = new _whitespace2['default']();
  },

  deactivate: function deactivate() {
    if (this.whitespace) this.whitespace.destroy();
    this.whitespace = null;
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy93aGl0ZXNwYWNlL2xpYi9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OzBCQUV1QixjQUFjOzs7O3FCQUV0QjtBQUNiLFVBQVEsRUFBQyxvQkFBRztBQUNWLFFBQUksQ0FBQyxVQUFVLEdBQUcsNkJBQWdCLENBQUE7R0FDbkM7O0FBRUQsWUFBVSxFQUFDLHNCQUFHO0FBQ1osUUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDOUMsUUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUE7R0FDdkI7Q0FDRiIsImZpbGUiOiIvVXNlcnMvYWgvLmF0b20vcGFja2FnZXMvd2hpdGVzcGFjZS9saWIvbWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cblxuaW1wb3J0IFdoaXRlc3BhY2UgZnJvbSAnLi93aGl0ZXNwYWNlJ1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGFjdGl2YXRlICgpIHtcbiAgICB0aGlzLndoaXRlc3BhY2UgPSBuZXcgV2hpdGVzcGFjZSgpXG4gIH0sXG5cbiAgZGVhY3RpdmF0ZSAoKSB7XG4gICAgaWYgKHRoaXMud2hpdGVzcGFjZSkgdGhpcy53aGl0ZXNwYWNlLmRlc3Ryb3koKVxuICAgIHRoaXMud2hpdGVzcGFjZSA9IG51bGxcbiAgfVxufVxuIl19