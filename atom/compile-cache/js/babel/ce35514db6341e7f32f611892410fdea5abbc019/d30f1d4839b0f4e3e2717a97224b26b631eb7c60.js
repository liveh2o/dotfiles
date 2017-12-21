Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _recompose = require('recompose');

'use babel';

function GutterResize(_ref) {
  var children = _ref.children;
  var onMouseDown = _ref.onMouseDown;

  return _react2['default'].createElement(
    'div',
    { className: 'resize-container' },
    children,
    _react2['default'].createElement('div', {
      className: 'resize',
      onMouseDown: onMouseDown
    })
  );
}

exports['default'] = (0, _recompose.compose)((0, _recompose.withHandlers)({
  onMouseDown: function onMouseDown(_ref2) {
    var onResizeStart = _ref2.onResizeStart;

    return function (e) {
      return (0, _lodash.isFunction)(onResizeStart) && onResizeStart(e.nativeEvent);
    };
  }
}))(GutterResize);
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy90ZXN0Ly5kb3RmaWxlcy9hdG9tL3BhY2thZ2VzL2dpdC1ibGFtZS9saWIvY29tcG9uZW50cy9HdXR0ZXJSZXNpemUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O3NCQUUyQixRQUFROztxQkFDakIsT0FBTzs7Ozt5QkFDYSxXQUFXOztBQUpqRCxXQUFXLENBQUM7O0FBTVosU0FBUyxZQUFZLENBQUMsSUFBdUIsRUFBRTtNQUF4QixRQUFRLEdBQVQsSUFBdUIsQ0FBdEIsUUFBUTtNQUFFLFdBQVcsR0FBdEIsSUFBdUIsQ0FBWixXQUFXOztBQUMxQyxTQUNFOztNQUFLLFNBQVMsRUFBQyxrQkFBa0I7SUFDOUIsUUFBUTtJQUNUO0FBQ0UsZUFBUyxFQUFDLFFBQVE7QUFDbEIsaUJBQVcsRUFBRSxXQUFXLEFBQUM7TUFDekI7R0FDRSxDQUNOO0NBQ0g7O3FCQUVjLHdCQUNiLDZCQUFhO0FBQ1gsYUFBVyxFQUFBLHFCQUFDLEtBQWlCLEVBQUU7UUFBakIsYUFBYSxHQUFmLEtBQWlCLENBQWYsYUFBYTs7QUFDekIsV0FBTyxVQUFVLENBQUMsRUFBRTtBQUNsQixhQUFPLHdCQUFXLGFBQWEsQ0FBQyxJQUFJLGFBQWEsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUM7S0FDbEUsQ0FBQztHQUNIO0NBQ0YsQ0FBQyxDQUNILENBQUMsWUFBWSxDQUFDIiwiZmlsZSI6Ii9Vc2Vycy90ZXN0Ly5kb3RmaWxlcy9hdG9tL3BhY2thZ2VzL2dpdC1ibGFtZS9saWIvY29tcG9uZW50cy9HdXR0ZXJSZXNpemUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHsgaXNGdW5jdGlvbiB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgY29tcG9zZSwgd2l0aEhhbmRsZXJzIH0gZnJvbSAncmVjb21wb3NlJztcblxuZnVuY3Rpb24gR3V0dGVyUmVzaXplKHtjaGlsZHJlbiwgb25Nb3VzZURvd259KSB7XG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJyZXNpemUtY29udGFpbmVyXCI+XG4gICAgICB7Y2hpbGRyZW59XG4gICAgICA8ZGl2XG4gICAgICAgIGNsYXNzTmFtZT1cInJlc2l6ZVwiXG4gICAgICAgIG9uTW91c2VEb3duPXtvbk1vdXNlRG93bn1cbiAgICAgIC8+XG4gICAgPC9kaXY+XG4gICk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNvbXBvc2UoXG4gIHdpdGhIYW5kbGVycyh7XG4gICAgb25Nb3VzZURvd24oeyBvblJlc2l6ZVN0YXJ0IH0pIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoZSkge1xuICAgICAgICByZXR1cm4gaXNGdW5jdGlvbihvblJlc2l6ZVN0YXJ0KSAmJiBvblJlc2l6ZVN0YXJ0KGUubmF0aXZlRXZlbnQpO1xuICAgICAgfTtcbiAgICB9LFxuICB9KVxuKShHdXR0ZXJSZXNpemUpO1xuIl19