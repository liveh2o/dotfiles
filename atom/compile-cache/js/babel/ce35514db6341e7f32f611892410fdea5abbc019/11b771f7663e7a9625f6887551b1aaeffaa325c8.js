Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _sbEventKit = require('sb-event-kit');

var _delegate = require('./delegate');

var _delegate2 = _interopRequireDefault(_delegate);

var _component = require('./component');

var _component2 = _interopRequireDefault(_component);

var Panel = (function () {
  function Panel() {
    _classCallCheck(this, Panel);

    var element = document.createElement('div');
    var panel = atom.workspace.addBottomPanel({
      item: element,
      visible: true,
      priority: 500
    });
    this.delegate = new _delegate2['default'](panel);
    this.subscriptions = new _sbEventKit.CompositeDisposable();

    _reactDom2['default'].render(_react2['default'].createElement(_component2['default'], { delegate: this.delegate }), element);
    this.subscriptions.add(function () {
      panel.destroy();
    });
    this.subscriptions.add(this.delegate);
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

exports['default'] = Panel;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvcGFuZWwvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztxQkFFa0IsT0FBTzs7Ozt3QkFDSixXQUFXOzs7OzBCQUNJLGNBQWM7O3dCQUU3QixZQUFZOzs7O3lCQUNYLGFBQWE7Ozs7SUFHZCxLQUFLO0FBSWIsV0FKUSxLQUFLLEdBSVY7MEJBSkssS0FBSzs7QUFLdEIsUUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQTtBQUM3QyxRQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQztBQUMxQyxVQUFJLEVBQUUsT0FBTztBQUNiLGFBQU8sRUFBRSxJQUFJO0FBQ2IsY0FBUSxFQUFFLEdBQUc7S0FDZCxDQUFDLENBQUE7QUFDRixRQUFJLENBQUMsUUFBUSxHQUFHLDBCQUFhLEtBQUssQ0FBQyxDQUFBO0FBQ25DLFFBQUksQ0FBQyxhQUFhLEdBQUcscUNBQXlCLENBQUE7O0FBRTlDLDBCQUFTLE1BQU0sQ0FBQywyREFBVyxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsQUFBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUE7QUFDaEUsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsWUFBVztBQUNoQyxXQUFLLENBQUMsT0FBTyxFQUFFLENBQUE7S0FDaEIsQ0FBQyxDQUFBO0FBQ0YsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0dBQ3RDOztlQW5Ca0IsS0FBSzs7V0FvQmxCLGdCQUFDLFFBQThCLEVBQVE7QUFDM0MsVUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUE7S0FDL0I7OztXQUNNLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtLQUM3Qjs7O1NBekJrQixLQUFLOzs7cUJBQUwsS0FBSyIsImZpbGUiOiIvVXNlcnMvYWgvLmF0b20vcGFja2FnZXMvbGludGVyLXVpLWRlZmF1bHQvbGliL3BhbmVsL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IFJlYWN0RE9NIGZyb20gJ3JlYWN0LWRvbSdcbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdzYi1ldmVudC1raXQnXG5cbmltcG9ydCBEZWxlZ2F0ZSBmcm9tICcuL2RlbGVnYXRlJ1xuaW1wb3J0IENvbXBvbmVudCBmcm9tICcuL2NvbXBvbmVudCdcbmltcG9ydCB0eXBlIHsgTGludGVyTWVzc2FnZSB9IGZyb20gJy4uL3R5cGVzJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQYW5lbCB7XG4gIGRlbGVnYXRlOiBEZWxlZ2F0ZTtcbiAgc3Vic2NyaXB0aW9uczogQ29tcG9zaXRlRGlzcG9zYWJsZTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICBjb25zdCBwYW5lbCA9IGF0b20ud29ya3NwYWNlLmFkZEJvdHRvbVBhbmVsKHtcbiAgICAgIGl0ZW06IGVsZW1lbnQsXG4gICAgICB2aXNpYmxlOiB0cnVlLFxuICAgICAgcHJpb3JpdHk6IDUwMCxcbiAgICB9KVxuICAgIHRoaXMuZGVsZWdhdGUgPSBuZXcgRGVsZWdhdGUocGFuZWwpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuXG4gICAgUmVhY3RET00ucmVuZGVyKDxDb21wb25lbnQgZGVsZWdhdGU9e3RoaXMuZGVsZWdhdGV9IC8+LCBlbGVtZW50KVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoZnVuY3Rpb24oKSB7XG4gICAgICBwYW5lbC5kZXN0cm95KClcbiAgICB9KVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5kZWxlZ2F0ZSlcbiAgfVxuICB1cGRhdGUobWVzc2FnZXM6IEFycmF5PExpbnRlck1lc3NhZ2U+KTogdm9pZCB7XG4gICAgdGhpcy5kZWxlZ2F0ZS51cGRhdGUobWVzc2FnZXMpXG4gIH1cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gIH1cbn1cbiJdfQ==