var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _atom = require('atom');

var _delegate = require('./delegate');

var _delegate2 = _interopRequireDefault(_delegate);

var _message = require('./message');

var _message2 = _interopRequireDefault(_message);

var _messageLegacy = require('./message-legacy');

var _messageLegacy2 = _interopRequireDefault(_messageLegacy);

var _helpers = require('../helpers');

var TooltipElement = (function () {
  function TooltipElement(messages, position, textEditor) {
    var _this = this;

    _classCallCheck(this, TooltipElement);

    this.emitter = new _atom.Emitter();
    this.element = document.createElement('div');
    this.messages = messages;
    this.subscriptions = new _atom.CompositeDisposable();

    this.subscriptions.add(this.emitter);
    this.marker = textEditor.markBufferRange([position, position]);
    this.marker.onDidDestroy(function () {
      return _this.emitter.emit('did-destroy');
    });

    var delegate = new _delegate2['default']();
    this.element.id = 'linter-tooltip';
    textEditor.decorateMarker(this.marker, {
      type: 'overlay',
      item: this.element
    });
    this.subscriptions.add(delegate);

    var children = [];
    messages.forEach(function (message) {
      if (message.version === 2) {
        children.push(_react2['default'].createElement(_message2['default'], { key: message.key, delegate: delegate, message: message }));
        return;
      }
      children.push(_react2['default'].createElement(_messageLegacy2['default'], { key: message.key, delegate: delegate, message: message }));
      if (message.trace && message.trace.length) {
        children.push.apply(children, _toConsumableArray(message.trace.map(function (trace) {
          return _react2['default'].createElement(_messageLegacy2['default'], { key: message.key + ':trace:' + trace.key, delegate: delegate, message: trace });
        })));
      }
    });
    _reactDom2['default'].render(_react2['default'].createElement(
      'linter-messages',
      null,
      children
    ), this.element);
  }

  _createClass(TooltipElement, [{
    key: 'isValid',
    value: function isValid(position, messages) {
      var range = (0, _helpers.$range)(this.messages[0]);
      return !!(this.messages.length === 1 && messages.has(this.messages[0]) && range && range.containsPoint(position));
    }
  }, {
    key: 'onDidDestroy',
    value: function onDidDestroy(callback) {
      this.emitter.on('did-destroy', callback);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.emitter.emit('did-destroy');
      this.subscriptions.dispose();
    }
  }]);

  return TooltipElement;
})();

module.exports = TooltipElement;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvdG9vbHRpcC9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztxQkFFa0IsT0FBTzs7Ozt3QkFDSixXQUFXOzs7O29CQUNhLE1BQU07O3dCQUc5QixZQUFZOzs7O3VCQUNOLFdBQVc7Ozs7NkJBQ0wsa0JBQWtCOzs7O3VCQUM1QixZQUFZOztJQUc3QixjQUFjO0FBT1AsV0FQUCxjQUFjLENBT04sUUFBOEIsRUFBRSxRQUFlLEVBQUUsVUFBc0IsRUFBRTs7OzBCQVBqRixjQUFjOztBQVFoQixRQUFJLENBQUMsT0FBTyxHQUFHLG1CQUFhLENBQUE7QUFDNUIsUUFBSSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFBO0FBQzVDLFFBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFBO0FBQ3hCLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7O0FBRTlDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUNwQyxRQUFJLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FBQyxlQUFlLENBQUMsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQTtBQUM5RCxRQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQzthQUFNLE1BQUssT0FBTyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUM7S0FBQSxDQUFDLENBQUE7O0FBRWhFLFFBQU0sUUFBUSxHQUFHLDJCQUFjLENBQUE7QUFDL0IsUUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEdBQUcsZ0JBQWdCLENBQUE7QUFDbEMsY0FBVSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQ3JDLFVBQUksRUFBRSxTQUFTO0FBQ2YsVUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPO0tBQ25CLENBQUMsQ0FBQTtBQUNGLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFBOztBQUVoQyxRQUFNLFFBQVEsR0FBRyxFQUFFLENBQUE7QUFDbkIsWUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBSztBQUM1QixVQUFJLE9BQU8sQ0FBQyxPQUFPLEtBQUssQ0FBQyxFQUFFO0FBQ3pCLGdCQUFRLENBQUMsSUFBSSxDQUFDLHlEQUFnQixHQUFHLEVBQUUsT0FBTyxDQUFDLEdBQUcsQUFBQyxFQUFDLFFBQVEsRUFBRSxRQUFRLEFBQUMsRUFBQyxPQUFPLEVBQUUsT0FBTyxBQUFDLEdBQUcsQ0FBQyxDQUFBO0FBQ3pGLGVBQU07T0FDUDtBQUNELGNBQVEsQ0FBQyxJQUFJLENBQUMsK0RBQXNCLEdBQUcsRUFBRSxPQUFPLENBQUMsR0FBRyxBQUFDLEVBQUMsUUFBUSxFQUFFLFFBQVEsQUFBQyxFQUFDLE9BQU8sRUFBRSxPQUFPLEFBQUMsR0FBRyxDQUFDLENBQUE7QUFDL0YsVUFBSSxPQUFPLENBQUMsS0FBSyxJQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFO0FBQ3pDLGdCQUFRLENBQUMsSUFBSSxNQUFBLENBQWIsUUFBUSxxQkFBUyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFBLEtBQUs7aUJBQ3RDLCtEQUFzQixHQUFHLEVBQUssT0FBTyxDQUFDLEdBQUcsZUFBVSxLQUFLLENBQUMsR0FBRyxBQUFHLEVBQUMsUUFBUSxFQUFFLFFBQVEsQUFBQyxFQUFDLE9BQU8sRUFBRSxLQUFLLEFBQUMsR0FBRztTQUFBLENBQ3ZHLEVBQUMsQ0FBQTtPQUNIO0tBQ0YsQ0FBQyxDQUFBO0FBQ0YsMEJBQVMsTUFBTSxDQUFDOzs7TUFBa0IsUUFBUTtLQUFtQixFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtHQUM3RTs7ZUF2Q0csY0FBYzs7V0F3Q1gsaUJBQUMsUUFBZSxFQUFFLFFBQTRCLEVBQVc7QUFDOUQsVUFBTSxLQUFLLEdBQUcscUJBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ3RDLGFBQU8sQ0FBQyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLElBQUksS0FBSyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQSxBQUFDLENBQUE7S0FDbEg7OztXQUNXLHNCQUFDLFFBQXFCLEVBQWM7QUFDOUMsVUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLFFBQVEsQ0FBQyxDQUFBO0tBQ3pDOzs7V0FDTSxtQkFBRztBQUNSLFVBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFBO0FBQ2hDLFVBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUE7S0FDN0I7OztTQWxERyxjQUFjOzs7QUFxRHBCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsY0FBYyxDQUFBIiwiZmlsZSI6Ii9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvdG9vbHRpcC9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20nXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlLCBFbWl0dGVyIH0gZnJvbSAnYXRvbSdcbmltcG9ydCB0eXBlIHsgRGlzcG9zYWJsZSwgUG9pbnQsIFRleHRFZGl0b3IgfSBmcm9tICdhdG9tJ1xuXG5pbXBvcnQgRGVsZWdhdGUgZnJvbSAnLi9kZWxlZ2F0ZSdcbmltcG9ydCBNZXNzYWdlRWxlbWVudCBmcm9tICcuL21lc3NhZ2UnXG5pbXBvcnQgTWVzc2FnZUVsZW1lbnRMZWdhY3kgZnJvbSAnLi9tZXNzYWdlLWxlZ2FjeSdcbmltcG9ydCB7ICRyYW5nZSB9IGZyb20gJy4uL2hlbHBlcnMnXG5pbXBvcnQgdHlwZSB7IExpbnRlck1lc3NhZ2UgfSBmcm9tICcuLi90eXBlcydcblxuY2xhc3MgVG9vbHRpcEVsZW1lbnQge1xuICBtYXJrZXI6IE9iamVjdDtcbiAgZWxlbWVudDogSFRNTEVsZW1lbnQ7XG4gIGVtaXR0ZXI6IEVtaXR0ZXI7XG4gIG1lc3NhZ2VzOiBBcnJheTxMaW50ZXJNZXNzYWdlPjtcbiAgc3Vic2NyaXB0aW9uczogQ29tcG9zaXRlRGlzcG9zYWJsZTtcblxuICBjb25zdHJ1Y3RvcihtZXNzYWdlczogQXJyYXk8TGludGVyTWVzc2FnZT4sIHBvc2l0aW9uOiBQb2ludCwgdGV4dEVkaXRvcjogVGV4dEVkaXRvcikge1xuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKClcbiAgICB0aGlzLmVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIHRoaXMubWVzc2FnZXMgPSBtZXNzYWdlc1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5lbWl0dGVyKVxuICAgIHRoaXMubWFya2VyID0gdGV4dEVkaXRvci5tYXJrQnVmZmVyUmFuZ2UoW3Bvc2l0aW9uLCBwb3NpdGlvbl0pXG4gICAgdGhpcy5tYXJrZXIub25EaWREZXN0cm95KCgpID0+IHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtZGVzdHJveScpKVxuXG4gICAgY29uc3QgZGVsZWdhdGUgPSBuZXcgRGVsZWdhdGUoKVxuICAgIHRoaXMuZWxlbWVudC5pZCA9ICdsaW50ZXItdG9vbHRpcCdcbiAgICB0ZXh0RWRpdG9yLmRlY29yYXRlTWFya2VyKHRoaXMubWFya2VyLCB7XG4gICAgICB0eXBlOiAnb3ZlcmxheScsXG4gICAgICBpdGVtOiB0aGlzLmVsZW1lbnQsXG4gICAgfSlcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGRlbGVnYXRlKVxuXG4gICAgY29uc3QgY2hpbGRyZW4gPSBbXVxuICAgIG1lc3NhZ2VzLmZvckVhY2goKG1lc3NhZ2UpID0+IHtcbiAgICAgIGlmIChtZXNzYWdlLnZlcnNpb24gPT09IDIpIHtcbiAgICAgICAgY2hpbGRyZW4ucHVzaCg8TWVzc2FnZUVsZW1lbnQga2V5PXttZXNzYWdlLmtleX0gZGVsZWdhdGU9e2RlbGVnYXRlfSBtZXNzYWdlPXttZXNzYWdlfSAvPilcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICBjaGlsZHJlbi5wdXNoKDxNZXNzYWdlRWxlbWVudExlZ2FjeSBrZXk9e21lc3NhZ2Uua2V5fSBkZWxlZ2F0ZT17ZGVsZWdhdGV9IG1lc3NhZ2U9e21lc3NhZ2V9IC8+KVxuICAgICAgaWYgKG1lc3NhZ2UudHJhY2UgJiYgbWVzc2FnZS50cmFjZS5sZW5ndGgpIHtcbiAgICAgICAgY2hpbGRyZW4ucHVzaCguLi5tZXNzYWdlLnRyYWNlLm1hcCh0cmFjZSA9PlxuICAgICAgICAgIDxNZXNzYWdlRWxlbWVudExlZ2FjeSBrZXk9e2Ake21lc3NhZ2Uua2V5fTp0cmFjZToke3RyYWNlLmtleX1gfSBkZWxlZ2F0ZT17ZGVsZWdhdGV9IG1lc3NhZ2U9e3RyYWNlfSAvPixcbiAgICAgICAgKSlcbiAgICAgIH1cbiAgICB9KVxuICAgIFJlYWN0RE9NLnJlbmRlcig8bGludGVyLW1lc3NhZ2VzPntjaGlsZHJlbn08L2xpbnRlci1tZXNzYWdlcz4sIHRoaXMuZWxlbWVudClcbiAgfVxuICBpc1ZhbGlkKHBvc2l0aW9uOiBQb2ludCwgbWVzc2FnZXM6IFNldDxMaW50ZXJNZXNzYWdlPik6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHJhbmdlID0gJHJhbmdlKHRoaXMubWVzc2FnZXNbMF0pXG4gICAgcmV0dXJuICEhKHRoaXMubWVzc2FnZXMubGVuZ3RoID09PSAxICYmIG1lc3NhZ2VzLmhhcyh0aGlzLm1lc3NhZ2VzWzBdKSAmJiByYW5nZSAmJiByYW5nZS5jb250YWluc1BvaW50KHBvc2l0aW9uKSlcbiAgfVxuICBvbkRpZERlc3Ryb3koY2FsbGJhY2s6ICgoKSA9PiBhbnkpKTogRGlzcG9zYWJsZSB7XG4gICAgdGhpcy5lbWl0dGVyLm9uKCdkaWQtZGVzdHJveScsIGNhbGxiYWNrKVxuICB9XG4gIGRpc3Bvc2UoKSB7XG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1kZXN0cm95JylcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBUb29sdGlwRWxlbWVudFxuIl19