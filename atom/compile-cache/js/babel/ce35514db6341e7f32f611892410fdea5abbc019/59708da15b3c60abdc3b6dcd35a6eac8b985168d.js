Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodash = require('lodash');

var _reactForAtom = require('react-for-atom');

var _reactForAtom2 = _interopRequireDefault(_reactForAtom);

var _recompose = require('recompose');

'use babel';

function GutterResize(_ref) {
  var children = _ref.children;
  var onMouseDown = _ref.onMouseDown;

  return _reactForAtom2['default'].createElement(
    'div',
    { className: 'resize-container' },
    children,
    _reactForAtom2['default'].createElement('div', {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9naXQtYmxhbWUvbGliL2NvbXBvbmVudHMvR3V0dGVyUmVzaXplLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztzQkFFMkIsUUFBUTs7NEJBQ2pCLGdCQUFnQjs7Ozt5QkFDSSxXQUFXOztBQUpqRCxXQUFXLENBQUM7O0FBTVosU0FBUyxZQUFZLENBQUMsSUFBdUIsRUFBRTtNQUF4QixRQUFRLEdBQVQsSUFBdUIsQ0FBdEIsUUFBUTtNQUFFLFdBQVcsR0FBdEIsSUFBdUIsQ0FBWixXQUFXOztBQUMxQyxTQUNFOztNQUFLLFNBQVMsRUFBQyxrQkFBa0I7SUFDOUIsUUFBUTtJQUNUO0FBQ0UsZUFBUyxFQUFDLFFBQVE7QUFDbEIsaUJBQVcsRUFBRSxXQUFXLEFBQUM7TUFDekI7R0FDRSxDQUNOO0NBQ0g7O3FCQUVjLHdCQUNiLDZCQUFhO0FBQ1gsYUFBVyxFQUFBLHFCQUFDLEtBQWlCLEVBQUU7UUFBakIsYUFBYSxHQUFmLEtBQWlCLENBQWYsYUFBYTs7QUFDekIsV0FBTyxVQUFVLENBQUMsRUFBRTtBQUNsQixhQUFPLHdCQUFXLGFBQWEsQ0FBQyxJQUFJLGFBQWEsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUM7S0FDbEUsQ0FBQztHQUNIO0NBQ0YsQ0FBQyxDQUNILENBQUMsWUFBWSxDQUFDIiwiZmlsZSI6Ii9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9naXQtYmxhbWUvbGliL2NvbXBvbmVudHMvR3V0dGVyUmVzaXplLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCB7IGlzRnVuY3Rpb24gfSBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0LWZvci1hdG9tJztcbmltcG9ydCB7IGNvbXBvc2UsIHdpdGhIYW5kbGVycyB9IGZyb20gJ3JlY29tcG9zZSc7XG5cbmZ1bmN0aW9uIEd1dHRlclJlc2l6ZSh7Y2hpbGRyZW4sIG9uTW91c2VEb3dufSkge1xuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwicmVzaXplLWNvbnRhaW5lclwiPlxuICAgICAge2NoaWxkcmVufVxuICAgICAgPGRpdlxuICAgICAgICBjbGFzc05hbWU9XCJyZXNpemVcIlxuICAgICAgICBvbk1vdXNlRG93bj17b25Nb3VzZURvd259XG4gICAgICAvPlxuICAgIDwvZGl2PlxuICApO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjb21wb3NlKFxuICB3aXRoSGFuZGxlcnMoe1xuICAgIG9uTW91c2VEb3duKHsgb25SZXNpemVTdGFydCB9KSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgcmV0dXJuIGlzRnVuY3Rpb24ob25SZXNpemVTdGFydCkgJiYgb25SZXNpemVTdGFydChlLm5hdGl2ZUV2ZW50KTtcbiAgICAgIH07XG4gICAgfVxuICB9KVxuKShHdXR0ZXJSZXNpemUpO1xuIl19