Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _helpers = require('../helpers');

var NEWLINE = /\r\n|\n/;
var MESSAGE_NUMBER = 0;

var Message = (function (_React$Component) {
  _inherits(Message, _React$Component);

  function Message() {
    _classCallCheck(this, Message);

    _get(Object.getPrototypeOf(Message.prototype), 'constructor', this).apply(this, arguments);

    this.state = {
      multiLineShow: false
    };
  }

  _createClass(Message, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this = this;

      this.props.delegate.onShouldUpdate(function () {
        _this.setState({});
      });
      this.props.delegate.onShouldExpand(function () {
        _this.setState({ multiLineShow: true });
      });
      this.props.delegate.onShouldCollapse(function () {
        _this.setState({ multiLineShow: false });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return NEWLINE.test(this.props.message.text || '') ? this.renderMultiLine() : this.renderSingleLine();
    }
  }, {
    key: 'renderSingleLine',
    value: function renderSingleLine() {
      var _props = this.props;
      var message = _props.message;
      var delegate = _props.delegate;

      var number = ++MESSAGE_NUMBER;
      var elementID = 'linter-message-' + number;
      var isElement = message.html && typeof message.html === 'object';
      if (isElement) {
        setImmediate(function () {
          var element = document.getElementById(elementID);
          if (element) {
            // $FlowIgnore: This is an HTML Element :\
            element.appendChild(message.html.cloneNode(true));
          } else {
            console.warn('[Linter] Unable to get element for mounted message', number, message);
          }
        });
      }

      return _react2['default'].createElement(
        'linter-message',
        { 'class': message.severity },
        delegate.showProviderName ? message.linterName + ': ' : '',
        _react2['default'].createElement(
          'span',
          { id: elementID, dangerouslySetInnerHTML: !isElement && message.html ? { __html: message.html } : null },
          message.text
        ),
        ' ',
        _react2['default'].createElement(
          'a',
          { href: '#', onClick: function () {
              return (0, _helpers.openExternally)(message);
            } },
          _react2['default'].createElement('span', { className: 'icon icon-link linter-icon' })
        )
      );
    }
  }, {
    key: 'renderMultiLine',
    value: function renderMultiLine() {
      var _this2 = this;

      var _props2 = this.props;
      var message = _props2.message;
      var delegate = _props2.delegate;

      var text = message.text ? message.text.split(NEWLINE) : [];
      var chunks = text.map(function (entry) {
        return entry.trim();
      }).map(function (entry, index) {
        return entry.length && _react2['default'].createElement(
          'span',
          { className: index !== 0 && 'linter-line' },
          entry
        );
      }).filter(function (e) {
        return e;
      });

      return _react2['default'].createElement(
        'linter-message',
        { 'class': message.severity },
        _react2['default'].createElement(
          'a',
          { href: '#', onClick: function () {
              return _this2.setState({ multiLineShow: !_this2.state.multiLineShow });
            } },
          _react2['default'].createElement('span', { className: 'icon linter-icon icon-' + (this.state.multiLineShow ? 'chevron-down' : 'chevron-right') })
        ),
        delegate.showProviderName ? message.linterName + ': ' : '',
        chunks[0],
        ' ',
        _react2['default'].createElement(
          'a',
          { href: '#', onClick: function () {
              return (0, _helpers.openExternally)(message);
            } },
          _react2['default'].createElement('span', { className: 'icon icon-link linter-icon' })
        ),
        this.state.multiLineShow && chunks.slice(1)
      );
    }
  }]);

  return Message;
})(_react2['default'].Component);

exports['default'] = Message;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvdG9vbHRpcC9tZXNzYWdlLWxlZ2FjeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztxQkFFa0IsT0FBTzs7Ozt1QkFDTSxZQUFZOztBQUkzQyxJQUFNLE9BQU8sR0FBRyxTQUFTLENBQUE7QUFDekIsSUFBSSxjQUFjLEdBQUcsQ0FBQyxDQUFBOztJQUVELE9BQU87WUFBUCxPQUFPOztXQUFQLE9BQU87MEJBQVAsT0FBTzs7K0JBQVAsT0FBTzs7U0FLMUIsS0FBSyxHQUVEO0FBQ0YsbUJBQWEsRUFBRSxLQUFLO0tBQ3JCOzs7ZUFUa0IsT0FBTzs7V0FVVCw2QkFBRzs7O0FBQ2xCLFVBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxZQUFNO0FBQ3ZDLGNBQUssUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFBO09BQ2xCLENBQUMsQ0FBQTtBQUNGLFVBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxZQUFNO0FBQ3ZDLGNBQUssUUFBUSxDQUFDLEVBQUUsYUFBYSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUE7T0FDdkMsQ0FBQyxDQUFBO0FBQ0YsVUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsWUFBTTtBQUN6QyxjQUFLLFFBQVEsQ0FBQyxFQUFFLGFBQWEsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFBO09BQ3hDLENBQUMsQ0FBQTtLQUNIOzs7V0FDSyxrQkFBRztBQUNQLGFBQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLGVBQWUsRUFBRSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFBO0tBQ3RHOzs7V0FDZSw0QkFBRzttQkFDYSxJQUFJLENBQUMsS0FBSztVQUFoQyxPQUFPLFVBQVAsT0FBTztVQUFFLFFBQVEsVUFBUixRQUFROztBQUV6QixVQUFNLE1BQU0sR0FBRyxFQUFFLGNBQWMsQ0FBQTtBQUMvQixVQUFNLFNBQVMsdUJBQXFCLE1BQU0sQUFBRSxDQUFBO0FBQzVDLFVBQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxJQUFJLElBQUksT0FBTyxPQUFPLENBQUMsSUFBSSxLQUFLLFFBQVEsQ0FBQTtBQUNsRSxVQUFJLFNBQVMsRUFBRTtBQUNiLG9CQUFZLENBQUMsWUFBVztBQUN0QixjQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFBO0FBQ2xELGNBQUksT0FBTyxFQUFFOztBQUVYLG1CQUFPLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUE7V0FDbEQsTUFBTTtBQUNMLG1CQUFPLENBQUMsSUFBSSxDQUFDLG9EQUFvRCxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQTtXQUNwRjtTQUNGLENBQUMsQ0FBQTtPQUNIOztBQUVELGFBQVE7O1VBQWdCLFNBQU8sT0FBTyxDQUFDLFFBQVEsQUFBQztRQUM1QyxRQUFRLENBQUMsZ0JBQWdCLEdBQU0sT0FBTyxDQUFDLFVBQVUsVUFBTyxFQUFFO1FBQzVEOztZQUFNLEVBQUUsRUFBRSxTQUFTLEFBQUMsRUFBQyx1QkFBdUIsRUFBRyxDQUFDLFNBQVMsSUFBSSxPQUFPLENBQUMsSUFBSSxHQUFHLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxJQUFJLEVBQUUsR0FBRyxJQUFJLEFBQUU7VUFDekcsT0FBTyxDQUFDLElBQUk7U0FDVDtRQUNOLEdBQUc7UUFDSjs7WUFBRyxJQUFJLEVBQUMsR0FBRyxFQUFDLE9BQU8sRUFBRTtxQkFBTSw2QkFBZSxPQUFPLENBQUM7YUFBQSxBQUFDO1VBQ2pELDJDQUFNLFNBQVMsRUFBQyw0QkFBNEIsR0FBUTtTQUNsRDtPQUNXLENBQUM7S0FDbkI7OztXQUVjLDJCQUFHOzs7b0JBQ2MsSUFBSSxDQUFDLEtBQUs7VUFBaEMsT0FBTyxXQUFQLE9BQU87VUFBRSxRQUFRLFdBQVIsUUFBUTs7QUFFekIsVUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUE7QUFDNUQsVUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFBLEtBQUs7ZUFBSSxLQUFLLENBQUMsSUFBSSxFQUFFO09BQUEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFDLEtBQUssRUFBRSxLQUFLO2VBQUssS0FBSyxDQUFDLE1BQU0sSUFBSTs7WUFBTSxTQUFTLEVBQUUsS0FBSyxLQUFLLENBQUMsSUFBSSxhQUFhLEFBQUM7VUFBRSxLQUFLO1NBQVE7T0FBQSxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQUEsQ0FBQztlQUFJLENBQUM7T0FBQSxDQUFDLENBQUE7O0FBRWxLLGFBQVE7O1VBQWdCLFNBQU8sT0FBTyxDQUFDLFFBQVEsQUFBQztRQUM5Qzs7WUFBRyxJQUFJLEVBQUMsR0FBRyxFQUFDLE9BQU8sRUFBRTtxQkFBTSxPQUFLLFFBQVEsQ0FBQyxFQUFFLGFBQWEsRUFBRSxDQUFDLE9BQUssS0FBSyxDQUFDLGFBQWEsRUFBRSxDQUFDO2FBQUEsQUFBQztVQUNyRiwyQ0FBTSxTQUFTLDhCQUEyQixJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsR0FBRyxjQUFjLEdBQUcsZUFBZSxDQUFBLEFBQUcsR0FBUTtTQUM5RztRQUNGLFFBQVEsQ0FBQyxnQkFBZ0IsR0FBTSxPQUFPLENBQUMsVUFBVSxVQUFPLEVBQUU7UUFDMUQsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNWLEdBQUc7UUFDSjs7WUFBRyxJQUFJLEVBQUMsR0FBRyxFQUFDLE9BQU8sRUFBRTtxQkFBTSw2QkFBZSxPQUFPLENBQUM7YUFBQSxBQUFDO1VBQ2pELDJDQUFNLFNBQVMsRUFBQyw0QkFBNEIsR0FBUTtTQUNsRDtRQUNGLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO09BQzlCLENBQUM7S0FDbkI7OztTQXhFa0IsT0FBTztHQUFTLG1CQUFNLFNBQVM7O3FCQUEvQixPQUFPIiwiZmlsZSI6Ii9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvdG9vbHRpcC9tZXNzYWdlLWxlZ2FjeS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB7IG9wZW5FeHRlcm5hbGx5IH0gZnJvbSAnLi4vaGVscGVycydcbmltcG9ydCB0eXBlIFRvb2x0aXBEZWxlZ2F0ZSBmcm9tICcuL2RlbGVnYXRlJ1xuaW1wb3J0IHR5cGUgeyBNZXNzYWdlTGVnYWN5IH0gZnJvbSAnLi4vdHlwZXMnXG5cbmNvbnN0IE5FV0xJTkUgPSAvXFxyXFxufFxcbi9cbmxldCBNRVNTQUdFX05VTUJFUiA9IDBcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWVzc2FnZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHByb3BzOiB7XG4gICAgbWVzc2FnZTogTWVzc2FnZUxlZ2FjeSxcbiAgICBkZWxlZ2F0ZTogVG9vbHRpcERlbGVnYXRlLFxuICB9O1xuICBzdGF0ZToge1xuICAgIG11bHRpTGluZVNob3c6IGJvb2xlYW4sXG4gIH0gPSB7XG4gICAgbXVsdGlMaW5lU2hvdzogZmFsc2UsXG4gIH07XG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMucHJvcHMuZGVsZWdhdGUub25TaG91bGRVcGRhdGUoKCkgPT4ge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7fSlcbiAgICB9KVxuICAgIHRoaXMucHJvcHMuZGVsZWdhdGUub25TaG91bGRFeHBhbmQoKCkgPT4ge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7IG11bHRpTGluZVNob3c6IHRydWUgfSlcbiAgICB9KVxuICAgIHRoaXMucHJvcHMuZGVsZWdhdGUub25TaG91bGRDb2xsYXBzZSgoKSA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHsgbXVsdGlMaW5lU2hvdzogZmFsc2UgfSlcbiAgICB9KVxuICB9XG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gTkVXTElORS50ZXN0KHRoaXMucHJvcHMubWVzc2FnZS50ZXh0IHx8ICcnKSA/IHRoaXMucmVuZGVyTXVsdGlMaW5lKCkgOiB0aGlzLnJlbmRlclNpbmdsZUxpbmUoKVxuICB9XG4gIHJlbmRlclNpbmdsZUxpbmUoKSB7XG4gICAgY29uc3QgeyBtZXNzYWdlLCBkZWxlZ2F0ZSB9ID0gdGhpcy5wcm9wc1xuXG4gICAgY29uc3QgbnVtYmVyID0gKytNRVNTQUdFX05VTUJFUlxuICAgIGNvbnN0IGVsZW1lbnRJRCA9IGBsaW50ZXItbWVzc2FnZS0ke251bWJlcn1gXG4gICAgY29uc3QgaXNFbGVtZW50ID0gbWVzc2FnZS5odG1sICYmIHR5cGVvZiBtZXNzYWdlLmh0bWwgPT09ICdvYmplY3QnXG4gICAgaWYgKGlzRWxlbWVudCkge1xuICAgICAgc2V0SW1tZWRpYXRlKGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxlbWVudElEKVxuICAgICAgICBpZiAoZWxlbWVudCkge1xuICAgICAgICAgIC8vICRGbG93SWdub3JlOiBUaGlzIGlzIGFuIEhUTUwgRWxlbWVudCA6XFxcbiAgICAgICAgICBlbGVtZW50LmFwcGVuZENoaWxkKG1lc3NhZ2UuaHRtbC5jbG9uZU5vZGUodHJ1ZSkpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc29sZS53YXJuKCdbTGludGVyXSBVbmFibGUgdG8gZ2V0IGVsZW1lbnQgZm9yIG1vdW50ZWQgbWVzc2FnZScsIG51bWJlciwgbWVzc2FnZSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICByZXR1cm4gKDxsaW50ZXItbWVzc2FnZSBjbGFzcz17bWVzc2FnZS5zZXZlcml0eX0+XG4gICAgICB7IGRlbGVnYXRlLnNob3dQcm92aWRlck5hbWUgPyBgJHttZXNzYWdlLmxpbnRlck5hbWV9OiBgIDogJycgfVxuICAgICAgPHNwYW4gaWQ9e2VsZW1lbnRJRH0gZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw9eyAhaXNFbGVtZW50ICYmIG1lc3NhZ2UuaHRtbCA/IHsgX19odG1sOiBtZXNzYWdlLmh0bWwgfSA6IG51bGwgfT5cbiAgICAgICAgeyBtZXNzYWdlLnRleHQgfVxuICAgICAgPC9zcGFuPlxuICAgICAgeycgJ31cbiAgICAgIDxhIGhyZWY9XCIjXCIgb25DbGljaz17KCkgPT4gb3BlbkV4dGVybmFsbHkobWVzc2FnZSl9PlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJpY29uIGljb24tbGluayBsaW50ZXItaWNvblwiPjwvc3Bhbj5cbiAgICAgIDwvYT5cbiAgICA8L2xpbnRlci1tZXNzYWdlPilcbiAgfVxuXG4gIHJlbmRlck11bHRpTGluZSgpIHtcbiAgICBjb25zdCB7IG1lc3NhZ2UsIGRlbGVnYXRlIH0gPSB0aGlzLnByb3BzXG5cbiAgICBjb25zdCB0ZXh0ID0gbWVzc2FnZS50ZXh0ID8gbWVzc2FnZS50ZXh0LnNwbGl0KE5FV0xJTkUpIDogW11cbiAgICBjb25zdCBjaHVua3MgPSB0ZXh0Lm1hcChlbnRyeSA9PiBlbnRyeS50cmltKCkpLm1hcCgoZW50cnksIGluZGV4KSA9PiBlbnRyeS5sZW5ndGggJiYgPHNwYW4gY2xhc3NOYW1lPXtpbmRleCAhPT0gMCAmJiAnbGludGVyLWxpbmUnfT57ZW50cnl9PC9zcGFuPikuZmlsdGVyKGUgPT4gZSlcblxuICAgIHJldHVybiAoPGxpbnRlci1tZXNzYWdlIGNsYXNzPXttZXNzYWdlLnNldmVyaXR5fT5cbiAgICAgIDxhIGhyZWY9XCIjXCIgb25DbGljaz17KCkgPT4gdGhpcy5zZXRTdGF0ZSh7IG11bHRpTGluZVNob3c6ICF0aGlzLnN0YXRlLm11bHRpTGluZVNob3cgfSl9PlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9e2BpY29uIGxpbnRlci1pY29uIGljb24tJHt0aGlzLnN0YXRlLm11bHRpTGluZVNob3cgPyAnY2hldnJvbi1kb3duJyA6ICdjaGV2cm9uLXJpZ2h0J31gfT48L3NwYW4+XG4gICAgICA8L2E+XG4gICAgICB7IGRlbGVnYXRlLnNob3dQcm92aWRlck5hbWUgPyBgJHttZXNzYWdlLmxpbnRlck5hbWV9OiBgIDogJycgfVxuICAgICAgeyBjaHVua3NbMF0gfVxuICAgICAgeycgJ31cbiAgICAgIDxhIGhyZWY9XCIjXCIgb25DbGljaz17KCkgPT4gb3BlbkV4dGVybmFsbHkobWVzc2FnZSl9PlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJpY29uIGljb24tbGluayBsaW50ZXItaWNvblwiPjwvc3Bhbj5cbiAgICAgIDwvYT5cbiAgICAgIHsgdGhpcy5zdGF0ZS5tdWx0aUxpbmVTaG93ICYmIGNodW5rcy5zbGljZSgxKSB9XG4gICAgPC9saW50ZXItbWVzc2FnZT4pXG4gIH1cbn1cbiJdfQ==