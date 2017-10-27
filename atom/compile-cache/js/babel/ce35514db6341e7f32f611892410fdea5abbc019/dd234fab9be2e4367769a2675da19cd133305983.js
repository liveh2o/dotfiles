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

var MessageElement = (function (_React$Component) {
  _inherits(MessageElement, _React$Component);

  function MessageElement() {
    _classCallCheck(this, MessageElement);

    _get(Object.getPrototypeOf(MessageElement.prototype), 'constructor', this).apply(this, arguments);

    this.state = {
      multiLineShow: false
    };
  }

  _createClass(MessageElement, [{
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
        this.state.multiLineShow && chunks.slice(1)
      );
    }
  }]);

  return MessageElement;
})(_react2['default'].Component);

module.exports = MessageElement;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvdG9vbHRpcC9tZXNzYWdlLWxlZ2FjeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O3FCQUVrQixPQUFPOzs7O3VCQUNNLFlBQVk7O0FBSTNDLElBQU0sT0FBTyxHQUFHLFNBQVMsQ0FBQTtBQUN6QixJQUFJLGNBQWMsR0FBRyxDQUFDLENBQUE7O0lBRWhCLGNBQWM7WUFBZCxjQUFjOztXQUFkLGNBQWM7MEJBQWQsY0FBYzs7K0JBQWQsY0FBYzs7U0FLbEIsS0FBSyxHQUVEO0FBQ0YsbUJBQWEsRUFBRSxLQUFLO0tBQ3JCOzs7ZUFURyxjQUFjOztXQVVELDZCQUFHOzs7QUFDbEIsVUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLFlBQU07QUFDdkMsY0FBSyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUE7T0FDbEIsQ0FBQyxDQUFBO0FBQ0YsVUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLFlBQU07QUFDdkMsY0FBSyxRQUFRLENBQUMsRUFBRSxhQUFhLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQTtPQUN2QyxDQUFDLENBQUE7QUFDRixVQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFNO0FBQ3pDLGNBQUssUUFBUSxDQUFDLEVBQUUsYUFBYSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUE7T0FDeEMsQ0FBQyxDQUFBO0tBQ0g7OztXQUNLLGtCQUFHO0FBQ1AsYUFBTyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsZUFBZSxFQUFFLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUE7S0FDdEc7OztXQUNlLDRCQUFHO21CQUNhLElBQUksQ0FBQyxLQUFLO1VBQWhDLE9B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Y0FBYyxDQUFBIiwiZmlsZSI6Ii9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvdG9vbHRpcC9tZXNzYWdlLWxlZ2FjeS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB7IG9wZW5FeHRlcm5hbGx5IH0gZnJvbSAnLi4vaGVscGVycydcbmltcG9ydCB0eXBlIFRvb2x0aXBEZWxlZ2F0ZSBmcm9tICcuL2RlbGVnYXRlJ1xuaW1wb3J0IHR5cGUgeyBNZXNzYWdlTGVnYWN5IH0gZnJvbSAnLi4vdHlwZXMnXG5cbmNvbnN0IE5FV0xJTkUgPSAvXFxyXFxufFxcbi9cbmxldCBNRVNTQUdFX05VTUJFUiA9IDBcblxuY2xhc3MgTWVzc2FnZUVsZW1lbnQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBwcm9wczoge1xuICAgIG1lc3NhZ2U6IE1lc3NhZ2VMZWdhY3ksXG4gICAgZGVsZWdhdGU6IFRvb2x0aXBEZWxlZ2F0ZSxcbiAgfTtcbiAgc3RhdGU6IHtcbiAgICBtdWx0aUxpbmVTaG93OiBib29sZWFuLFxuICB9ID0ge1xuICAgIG11bHRpTGluZVNob3c6IGZhbHNlLFxuICB9O1xuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLnByb3BzLmRlbGVnYXRlLm9uU2hvdWxkVXBkYXRlKCgpID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe30pXG4gICAgfSlcbiAgICB0aGlzLnByb3BzLmRlbGVnYXRlLm9uU2hvdWxkRXhwYW5kKCgpID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBtdWx0aUxpbmVTaG93OiB0cnVlIH0pXG4gICAgfSlcbiAgICB0aGlzLnByb3BzLmRlbGVnYXRlLm9uU2hvdWxkQ29sbGFwc2UoKCkgPT4ge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7IG11bHRpTGluZVNob3c6IGZhbHNlIH0pXG4gICAgfSlcbiAgfVxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIE5FV0xJTkUudGVzdCh0aGlzLnByb3BzLm1lc3NhZ2UudGV4dCB8fCAnJykgPyB0aGlzLnJlbmRlck11bHRpTGluZSgpIDogdGhpcy5yZW5kZXJTaW5nbGVMaW5lKClcbiAgfVxuICByZW5kZXJTaW5nbGVMaW5lKCkge1xuICAgIGNvbnN0IHsgbWVzc2FnZSwgZGVsZWdhdGUgfSA9IHRoaXMucHJvcHNcblxuICAgIGNvbnN0IG51bWJlciA9ICsrTUVTU0FHRV9OVU1CRVJcbiAgICBjb25zdCBlbGVtZW50SUQgPSBgbGludGVyLW1lc3NhZ2UtJHtudW1iZXJ9YFxuICAgIGNvbnN0IGlzRWxlbWVudCA9IG1lc3NhZ2UuaHRtbCAmJiB0eXBlb2YgbWVzc2FnZS5odG1sID09PSAnb2JqZWN0J1xuICAgIGlmIChpc0VsZW1lbnQpIHtcbiAgICAgIHNldEltbWVkaWF0ZShmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsZW1lbnRJRClcbiAgICAgICAgaWYgKGVsZW1lbnQpIHtcbiAgICAgICAgICAvLyAkRmxvd0lnbm9yZTogVGhpcyBpcyBhbiBIVE1MIEVsZW1lbnQgOlxcXG4gICAgICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZChtZXNzYWdlLmh0bWwuY2xvbmVOb2RlKHRydWUpKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnNvbGUud2FybignW0xpbnRlcl0gVW5hYmxlIHRvIGdldCBlbGVtZW50IGZvciBtb3VudGVkIG1lc3NhZ2UnLCBudW1iZXIsIG1lc3NhZ2UpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgcmV0dXJuICg8bGludGVyLW1lc3NhZ2UgY2xhc3M9e21lc3NhZ2Uuc2V2ZXJpdHl9PlxuICAgICAgeyBkZWxlZ2F0ZS5zaG93UHJvdmlkZXJOYW1lID8gYCR7bWVzc2FnZS5saW50ZXJOYW1lfTogYCA6ICcnIH1cbiAgICAgIDxzcGFuIGlkPXtlbGVtZW50SUR9IGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXshaXNFbGVtZW50ICYmIG1lc3NhZ2UuaHRtbCA/IHsgX19odG1sOiBtZXNzYWdlLmh0bWwgfSA6IG51bGx9PlxuICAgICAgICB7IG1lc3NhZ2UudGV4dCB9XG4gICAgICA8L3NwYW4+XG4gICAgICB7JyAnfVxuICAgICAgPGEgaHJlZj1cIiNcIiBvbkNsaWNrPXsoKSA9PiBvcGVuRXh0ZXJuYWxseShtZXNzYWdlKX0+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImljb24gaWNvbi1saW5rIGxpbnRlci1pY29uXCIgLz5cbiAgICAgIDwvYT5cbiAgICA8L2xpbnRlci1tZXNzYWdlPilcbiAgfVxuXG4gIHJlbmRlck11bHRpTGluZSgpIHtcbiAgICBjb25zdCB7IG1lc3NhZ2UsIGRlbGVnYXRlIH0gPSB0aGlzLnByb3BzXG5cbiAgICBjb25zdCB0ZXh0ID0gbWVzc2FnZS50ZXh0ID8gbWVzc2FnZS50ZXh0LnNwbGl0KE5FV0xJTkUpIDogW11cbiAgICBjb25zdCBjaHVua3MgPSB0ZXh0Lm1hcChlbnRyeSA9PiBlbnRyeS50cmltKCkpLm1hcCgoZW50cnksIGluZGV4KSA9PiBlbnRyeS5sZW5ndGggJiYgPHNwYW4gY2xhc3NOYW1lPXtpbmRleCAhPT0gMCAmJiAnbGludGVyLWxpbmUnfT57ZW50cnl9PC9zcGFuPikuZmlsdGVyKGUgPT4gZSlcblxuICAgIHJldHVybiAoPGxpbnRlci1tZXNzYWdlIGNsYXNzPXttZXNzYWdlLnNldmVyaXR5fT5cbiAgICAgIDxhIGhyZWY9XCIjXCIgb25DbGljaz17KCkgPT4gdGhpcy5zZXRTdGF0ZSh7IG11bHRpTGluZVNob3c6ICF0aGlzLnN0YXRlLm11bHRpTGluZVNob3cgfSl9PlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9e2BpY29uIGxpbnRlci1pY29uIGljb24tJHt0aGlzLnN0YXRlLm11bHRpTGluZVNob3cgPyAnY2hldnJvbi1kb3duJyA6ICdjaGV2cm9uLXJpZ2h0J31gfSAvPlxuICAgICAgPC9hPlxuICAgICAgeyBkZWxlZ2F0ZS5zaG93UHJvdmlkZXJOYW1lID8gYCR7bWVzc2FnZS5saW50ZXJOYW1lfTogYCA6ICcnIH1cbiAgICAgIHsgY2h1bmtzWzBdIH1cbiAgICAgIHsnICd9XG4gICAgICB7IHRoaXMuc3RhdGUubXVsdGlMaW5lU2hvdyAmJiBjaHVua3Muc2xpY2UoMSkgfVxuICAgIDwvbGludGVyLW1lc3NhZ2U+KVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTWVzc2FnZUVsZW1lbnRcbiJdfQ==