var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _atom = require('atom');

var _delegate = require('./delegate');

var _delegate2 = _interopRequireDefault(_delegate);

var _component = require('./component');

var _component2 = _interopRequireDefault(_component);

var Panel = (function () {
  function Panel() {
    _classCallCheck(this, Panel);

    this.subscriptions = new _atom.CompositeDisposable();

    var element = document.createElement('div');
    var panel = atom.workspace.addBottomPanel({
      item: element,
      visible: true,
      priority: 500
    });
    this.subscriptions.add(new _atom.Disposable(function () {
      panel.destroy();
    }));

    this.delegate = new _delegate2['default'](panel);
    this.subscriptions.add(this.delegate);

    _reactDom2['default'].render(_react2['default'].createElement(_component2['default'], { delegate: this.delegate }), element);
  }

  _createClass(Panel, [{
    key: 'update',
    value: function update(messages) {
      this.delegate.update(messages);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
    }
  }]);

  return Panel;
})();

module.exports = Panel;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvcGFuZWwvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O3FCQUVrQixPQUFPOzs7O3dCQUNKLFdBQVc7Ozs7b0JBQ2dCLE1BQU07O3dCQUVqQyxZQUFZOzs7O3lCQUNYLGFBQWE7Ozs7SUFHN0IsS0FBSztBQUlFLFdBSlAsS0FBSyxHQUlLOzBCQUpWLEtBQUs7O0FBS1AsUUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQTs7QUFFOUMsUUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQTtBQUM3QyxRQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQztBQUMxQyxVQUFJLEVBQUUsT0FBTztBQUNiLGFBQU8sRUFBRSxJQUFJO0FBQ2IsY0FBUSxFQUFFLEdBQUc7S0FDZCxDQUFDLENBQUE7QUFDRixRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxxQkFBZSxZQUFXO0FBQy9DLFdBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQTtLQUNoQixDQUFDLENBQUMsQ0FBQTs7QUFFSCxRQUFJLENBQUMsUUFBUSxHQUFHLDBCQUFhLEtBQUssQ0FBQyxDQUFBO0FBQ25DLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQTs7QUFFckMsMEJBQVMsTUFBTSxDQUFDLDJEQUFXLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUSxBQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQTtHQUNqRTs7ZUFyQkcsS0FBSzs7V0FzQkgsZ0JBQUMsUUFBOEIsRUFBUTtBQUMzQyxVQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQTtLQUMvQjs7O1dBQ00sbUJBQUc7QUFDUixVQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFBO0tBQzdCOzs7U0EzQkcsS0FBSzs7O0FBOEJYLE1BQU0sQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFBIiwiZmlsZSI6Ii9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvcGFuZWwvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJ1xuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSwgRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nXG5cbmltcG9ydCBEZWxlZ2F0ZSBmcm9tICcuL2RlbGVnYXRlJ1xuaW1wb3J0IENvbXBvbmVudCBmcm9tICcuL2NvbXBvbmVudCdcbmltcG9ydCB0eXBlIHsgTGludGVyTWVzc2FnZSB9IGZyb20gJy4uL3R5cGVzJ1xuXG5jbGFzcyBQYW5lbCB7XG4gIGRlbGVnYXRlOiBEZWxlZ2F0ZTtcbiAgc3Vic2NyaXB0aW9uczogQ29tcG9zaXRlRGlzcG9zYWJsZTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICBjb25zdCBwYW5lbCA9IGF0b20ud29ya3NwYWNlLmFkZEJvdHRvbVBhbmVsKHtcbiAgICAgIGl0ZW06IGVsZW1lbnQsXG4gICAgICB2aXNpYmxlOiB0cnVlLFxuICAgICAgcHJpb3JpdHk6IDUwMCxcbiAgICB9KVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQobmV3IERpc3Bvc2FibGUoZnVuY3Rpb24oKSB7XG4gICAgICBwYW5lbC5kZXN0cm95KClcbiAgICB9KSlcblxuICAgIHRoaXMuZGVsZWdhdGUgPSBuZXcgRGVsZWdhdGUocGFuZWwpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLmRlbGVnYXRlKVxuXG4gICAgUmVhY3RET00ucmVuZGVyKDxDb21wb25lbnQgZGVsZWdhdGU9e3RoaXMuZGVsZWdhdGV9IC8+LCBlbGVtZW50KVxuICB9XG4gIHVwZGF0ZShtZXNzYWdlczogQXJyYXk8TGludGVyTWVzc2FnZT4pOiB2b2lkIHtcbiAgICB0aGlzLmRlbGVnYXRlLnVwZGF0ZShtZXNzYWdlcylcbiAgfVxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFBhbmVsXG4iXX0=