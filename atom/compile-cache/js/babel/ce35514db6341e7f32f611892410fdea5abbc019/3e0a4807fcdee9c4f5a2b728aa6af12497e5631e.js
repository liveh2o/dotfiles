Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _sbEventKit = require('sb-event-kit');

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

    this.emitter = new _sbEventKit.Emitter();
    this.element = document.createElement('div');
    this.messages = messages;
    this.subscriptions = new _sbEventKit.CompositeDisposable();

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
        children.push.apply(children, _toConsumableArray(message.trace.map(function (trace, index) {
          return _react2['default'].createElement(_messageLegacy2['default'], { key: trace.key + ':trace:' + index, delegate: delegate, message: trace });
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

exports['default'] = TooltipElement;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvdG9vbHRpcC9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7cUJBRWtCLE9BQU87Ozs7d0JBQ0osV0FBVzs7OzswQkFDYSxjQUFjOzt3QkFJdEMsWUFBWTs7Ozt1QkFDTixXQUFXOzs7OzZCQUNMLGtCQUFrQjs7Ozt1QkFDNUIsWUFBWTs7SUFHZCxjQUFjO0FBT3RCLFdBUFEsY0FBYyxDQU9yQixRQUE4QixFQUFFLFFBQWUsRUFBRSxVQUFzQixFQUFFOzs7MEJBUGxFLGNBQWM7O0FBUS9CLFFBQUksQ0FBQyxPQUFPLEdBQUcseUJBQWEsQ0FBQTtBQUM1QixRQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDNUMsUUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUE7QUFDeEIsUUFBSSxDQUFDLGFBQWEsR0FBRyxxQ0FBeUIsQ0FBQTs7QUFFOUMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQ3BDLFFBQUksQ0FBQyxNQUFNLEdBQUcsVUFBVSxDQUFDLGVBQWUsQ0FBQyxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFBO0FBQzlELFFBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDO2FBQU0sTUFBSyxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQztLQUFBLENBQUMsQ0FBQTs7QUFFaEUsUUFBTSxRQUFRLEdBQUcsMkJBQWMsQ0FBQTtBQUMvQixRQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsR0FBRyxnQkFBZ0IsQ0FBQTtBQUNsQyxjQUFVLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUU7QUFDckMsVUFBSSxFQUFFLFNBQVM7QUFDZixVQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU87S0FDbkIsQ0FBQyxDQUFBO0FBQ0YsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUE7O0FBRWhDLFFBQU0sUUFBUSxHQUFHLEVBQUUsQ0FBQTtBQUNuQixZQUFRLENBQUMsT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFLO0FBQzVCLFVBQUksT0FBTyxDQUFDLE9BQU8sS0FBSyxDQUFDLEVBQUU7QUFDekIsZ0JBQVEsQ0FBQyxJQUFJLENBQUMseURBQWdCLEdBQUcsRUFBRSxPQUFPLENBQUMsR0FBRyxBQUFDLEVBQUMsUUFBUSxFQUFFLFFBQVEsQUFBQyxFQUFDLE9BQU8sRUFBRSxPQUFPLEFBQUMsR0FBRyxDQUFDLENBQUE7QUFDekYsZUFBTTtPQUNQO0FBQ0QsY0FBUSxDQUFDLElBQUksQ0FBQywrREFBc0IsR0FBRyxFQUFFLE9BQU8sQ0FBQyxHQUFHLEFBQUMsRUFBQyxRQUFRLEVBQUUsUUFBUSxBQUFDLEVBQUMsT0FBTyxFQUFFLE9BQU8sQUFBQyxHQUFHLENBQUMsQ0FBQTtBQUMvRixVQUFJLE9BQU8sQ0FBQyxLQUFLLElBQUksT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUU7QUFDekMsZ0JBQVEsQ0FBQyxJQUFJLE1BQUEsQ0FBYixRQUFRLHFCQUFTLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQUMsS0FBSyxFQUFFLEtBQUs7aUJBQzlDLCtEQUFzQixHQUFHLEVBQUssS0FBSyxDQUFDLEdBQUcsZUFBVSxLQUFLLEFBQUcsRUFBQyxRQUFRLEVBQUUsUUFBUSxBQUFDLEVBQUMsT0FBTyxFQUFFLEtBQUssQUFBQyxHQUFHO1NBQUEsQ0FDakcsRUFBQyxDQUFBO09BQ0g7S0FDRixDQUFDLENBQUE7QUFDRiwwQkFBUyxNQUFNLENBQUM7OztNQUFrQixRQUFRO0tBQW1CLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0dBQzdFOztlQXZDa0IsY0FBYzs7V0F3QzFCLGlCQUFDLFFBQWUsRUFBRSxRQUE0QixFQUFXO0FBQzlELFVBQU0sS0FBSyxHQUFHLHFCQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUN0QyxhQUFPLENBQUMsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxJQUFJLEtBQUssQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUEsQUFBQyxDQUFBO0tBQ2xIOzs7V0FDVyxzQkFBQyxRQUFxQixFQUFjO0FBQzlDLFVBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxRQUFRLENBQUMsQ0FBQTtLQUN6Qzs7O1dBQ00sbUJBQUc7QUFDUixVQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQTtBQUNoQyxVQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFBO0tBQzdCOzs7U0FsRGtCLGNBQWM7OztxQkFBZCxjQUFjIiwiZmlsZSI6Ii9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvdG9vbHRpcC9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20nXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlLCBFbWl0dGVyIH0gZnJvbSAnc2ItZXZlbnQta2l0J1xuaW1wb3J0IHR5cGUgeyBQb2ludCwgVGV4dEVkaXRvciB9IGZyb20gJ2F0b20nXG5pbXBvcnQgdHlwZSB7IERpc3Bvc2FibGUgfSBmcm9tICdzYi1ldmVudC1raXQnXG5cbmltcG9ydCBEZWxlZ2F0ZSBmcm9tICcuL2RlbGVnYXRlJ1xuaW1wb3J0IE1lc3NhZ2VFbGVtZW50IGZyb20gJy4vbWVzc2FnZSdcbmltcG9ydCBNZXNzYWdlRWxlbWVudExlZ2FjeSBmcm9tICcuL21lc3NhZ2UtbGVnYWN5J1xuaW1wb3J0IHsgJHJhbmdlIH0gZnJvbSAnLi4vaGVscGVycydcbmltcG9ydCB0eXBlIHsgTGludGVyTWVzc2FnZSB9IGZyb20gJy4uL3R5cGVzJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUb29sdGlwRWxlbWVudCB7XG4gIG1hcmtlcjogT2JqZWN0O1xuICBlbGVtZW50OiBIVE1MRWxlbWVudDtcbiAgZW1pdHRlcjogRW1pdHRlcjtcbiAgbWVzc2FnZXM6IEFycmF5PExpbnRlck1lc3NhZ2U+O1xuICBzdWJzY3JpcHRpb25zOiBDb21wb3NpdGVEaXNwb3NhYmxlO1xuXG4gIGNvbnN0cnVjdG9yKG1lc3NhZ2VzOiBBcnJheTxMaW50ZXJNZXNzYWdlPiwgcG9zaXRpb246IFBvaW50LCB0ZXh0RWRpdG9yOiBUZXh0RWRpdG9yKSB7XG4gICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXIoKVxuICAgIHRoaXMuZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgdGhpcy5tZXNzYWdlcyA9IG1lc3NhZ2VzXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLmVtaXR0ZXIpXG4gICAgdGhpcy5tYXJrZXIgPSB0ZXh0RWRpdG9yLm1hcmtCdWZmZXJSYW5nZShbcG9zaXRpb24sIHBvc2l0aW9uXSlcbiAgICB0aGlzLm1hcmtlci5vbkRpZERlc3Ryb3koKCkgPT4gdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1kZXN0cm95JykpXG5cbiAgICBjb25zdCBkZWxlZ2F0ZSA9IG5ldyBEZWxlZ2F0ZSgpXG4gICAgdGhpcy5lbGVtZW50LmlkID0gJ2xpbnRlci10b29sdGlwJ1xuICAgIHRleHRFZGl0b3IuZGVjb3JhdGVNYXJrZXIodGhpcy5tYXJrZXIsIHtcbiAgICAgIHR5cGU6ICdvdmVybGF5JyxcbiAgICAgIGl0ZW06IHRoaXMuZWxlbWVudCxcbiAgICB9KVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoZGVsZWdhdGUpXG5cbiAgICBjb25zdCBjaGlsZHJlbiA9IFtdXG4gICAgbWVzc2FnZXMuZm9yRWFjaCgobWVzc2FnZSkgPT4ge1xuICAgICAgaWYgKG1lc3NhZ2UudmVyc2lvbiA9PT0gMikge1xuICAgICAgICBjaGlsZHJlbi5wdXNoKDxNZXNzYWdlRWxlbWVudCBrZXk9e21lc3NhZ2Uua2V5fSBkZWxlZ2F0ZT17ZGVsZWdhdGV9IG1lc3NhZ2U9e21lc3NhZ2V9IC8+KVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIGNoaWxkcmVuLnB1c2goPE1lc3NhZ2VFbGVtZW50TGVnYWN5IGtleT17bWVzc2FnZS5rZXl9IGRlbGVnYXRlPXtkZWxlZ2F0ZX0gbWVzc2FnZT17bWVzc2FnZX0gLz4pXG4gICAgICBpZiAobWVzc2FnZS50cmFjZSAmJiBtZXNzYWdlLnRyYWNlLmxlbmd0aCkge1xuICAgICAgICBjaGlsZHJlbi5wdXNoKC4uLm1lc3NhZ2UudHJhY2UubWFwKCh0cmFjZSwgaW5kZXgpID0+XG4gICAgICAgICAgPE1lc3NhZ2VFbGVtZW50TGVnYWN5IGtleT17YCR7dHJhY2Uua2V5fTp0cmFjZToke2luZGV4fWB9IGRlbGVnYXRlPXtkZWxlZ2F0ZX0gbWVzc2FnZT17dHJhY2V9IC8+XG4gICAgICAgICkpXG4gICAgICB9XG4gICAgfSlcbiAgICBSZWFjdERPTS5yZW5kZXIoPGxpbnRlci1tZXNzYWdlcz57Y2hpbGRyZW59PC9saW50ZXItbWVzc2FnZXM+LCB0aGlzLmVsZW1lbnQpXG4gIH1cbiAgaXNWYWxpZChwb3NpdGlvbjogUG9pbnQsIG1lc3NhZ2VzOiBTZXQ8TGludGVyTWVzc2FnZT4pOiBib29sZWFuIHtcbiAgICBjb25zdCByYW5nZSA9ICRyYW5nZSh0aGlzLm1lc3NhZ2VzWzBdKVxuICAgIHJldHVybiAhISh0aGlzLm1lc3NhZ2VzLmxlbmd0aCA9PT0gMSAmJiBtZXNzYWdlcy5oYXModGhpcy5tZXNzYWdlc1swXSkgJiYgcmFuZ2UgJiYgcmFuZ2UuY29udGFpbnNQb2ludChwb3NpdGlvbikpXG4gIH1cbiAgb25EaWREZXN0cm95KGNhbGxiYWNrOiAoKCkgPT4gYW55KSk6IERpc3Bvc2FibGUge1xuICAgIHRoaXMuZW1pdHRlci5vbignZGlkLWRlc3Ryb3knLCBjYWxsYmFjaylcbiAgfVxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtZGVzdHJveScpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICB9XG59XG4iXX0=