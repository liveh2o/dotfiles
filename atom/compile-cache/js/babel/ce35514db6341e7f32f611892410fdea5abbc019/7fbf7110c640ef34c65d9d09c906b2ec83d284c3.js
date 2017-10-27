var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

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
        ' '
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvdG9vbHRpcC9tZXNzYWdlLWxlZ2FjeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O3FCQUVrQixPQUFPOzs7O0FBSXpCLElBQU0sT0FBTyxHQUFHLFNBQVMsQ0FBQTtBQUN6QixJQUFJLGNBQWMsR0FBRyxDQUFDLENBQUE7O0lBRWhCLGNBQWM7WUFBZCxjQUFjOztXQUFkLGNBQWM7MEJBQWQsY0FBYzs7K0JBQWQsY0FBYzs7U0FLbEIsS0FBSyxHQUVEO0FBQ0YsbUJBQWEsRUFBRSxLQUFLO0tBQ3JCOzs7ZUFURyxjQUFjOztXQVVELDZCQUFHOzs7QUFDbEIsVUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLFlBQU07QUFDdkMsY0FBSyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUE7T0FDbEIsQ0FBQyxDQUFBO0FBQ0YsVUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLFlBQU07QUFDdkMsY0FBSyxRQUFRLENBQUMsRUFBRSxhQUFhLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQTtPQUN2QyxDQUFDLENBQUE7QUFDRixVQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFNO0FBQ3pDLGNBQUssUUFBUSxDQUFDLEVBQUUsYUFBYSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUE7T0FDeEMsQ0FBQyxDQUFBO0tBQ0g7OztXQUNLLGtCQUFHO0FBQ1AsYUFBTyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsZUFBZSxFQUFFLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUE7S0FDdEc7OztXQUNlLDRCQUFHO21CQUNhLElBQUksQ0FBQyxLQUFLO1VBQWhDLE9BQU8sVUFBUCxPQUFPO1VBQUUsUUFBUSxVQUFSLFFBQVE7O0FBRXpCLFVBQU0sTUFBTSxHQUFHLEVBQUUsY0FBYyxDQUFBO0FBQy9CLFVBQU0sU0FBUyx1QkFBcUIsTUFBTSxBQUFFLENBQUE7QUFDNUMsVUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLElBQUksSUFBSSxPQUFPLE9BQU8sQ0FBQyxJQUFJLEtBQUssUUFBUSxDQUFBO0FBQ2xFLFVBQUksU0FBUyxFQUFFO0FBQ2Isb0JBQVksQ0FBQyxZQUFXO0FBQ3RCLGNBQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUE7QUFDbEQsY0FBSSxPQUFPLEVBQUU7O0FBRVgsbUJBQU8sQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQTtXQUNsRCxNQUFNO0FBQ0wsbUJBQU8sQ0FBQyxJQUFJLENBQUMsb0RBQW9ELEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFBO1dBQ3BGO1NBQ0YsQ0FBQyxDQUFBO09BQ0g7O0FBRUQsYUFBUTs7VUFBZ0IsU0FBTyxPQUFPLENBQUMsUUFBUSxBQUFDO1FBQzVDLFFBQVEsQ0FBQyxnQkFBZ0IsR0FBTSxPQUFPLENBQUMsVUFBVSxVQUFPLEVBQUU7UUFDNUQ7O1lBQU0sRUFBRSxFQUFFLFNBQVMsQUFBQyxFQUFDLHVCQUF1QixFQUFFLENBQUMsU0FBUyxJQUFJLE9BQU8sQ0FBQyxJQUFJLEdBQUcsRUFBRSxNQUFNLEVBQUUsT0FBTyxDQUFDLElBQUksRUFBRSxHQUFHLElBQUksQUFBQztVQUN2RyxPQUFPLENBQUMsSUFBSTtTQUNUO1FBQ04sR0FBRztPQUNXLENBQUM7S0FDbkI7OztXQUVjLDJCQUFHOzs7b0JBQ2MsSUFBSSxDQUFDLEtBQUs7VUFBaEMsT0FBTyxXQUFQLE9BQU87VUFBRSxRQUFRLFdBQVIsUUFBUTs7QUFFekIsVUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUE7QUFDNUQsVUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFBLEtBQUs7ZUFBSSxLQUFLLENBQUMsSUFBSSxFQUFFO09BQUEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFDLEtBQUssRUFBRSxLQUFLO2VBQUssS0FBSyxDQUFDLE1BQU0sSUFBSTs7WUFBTSxTQUFTLEVBQUUsS0FBSyxLQUFLLENBQUMsSUFBSSxhQUFhLEFBQUM7VUFBRSxLQUFLO1NBQVE7T0FBQSxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQUEsQ0FBQztlQUFJLENBQUM7T0FBQSxDQUFDLENBQUE7O0FBRWxLLGFBQVE7O1VBQWdCLFNBQU8sT0FBTyxDQUFDLFFBQVEsQUFBQztRQUM5Qzs7WUFBRyxJQUFJLEVBQUMsR0FBRyxFQUFDLE9BQU8sRUFBRTtxQkFBTSxPQUFLLFFBQVEsQ0FBQyxFQUFFLGFBQWEsRUFBRSxDQUFDLE9BQUssS0FBSyxDQUFDLGFBQWEsRUFBRSxDQUFDO2FBQUEsQUFBQztVQUNyRiwyQ0FBTSxTQUFTLDhCQUEyQixJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsR0FBRyxjQUFjLEdBQUcsZUFBZSxDQUFBLEFBQUcsR0FBRztTQUN6RztRQUNGLFFBQVEsQ0FBQyxnQkFBZ0IsR0FBTSxPQUFPLENBQUMsVUFBVSxVQUFPLEVBQUU7UUFDMUQsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNWLEdBQUc7UUFDRixJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztPQUM5QixDQUFDO0tBQ25COzs7U0FsRUcsY0FBYztHQUFTLG1CQUFNLFNBQVM7O0FBcUU1QyxNQUFNLENBQUMsT0FBTyxHQUFHLGNBQWMsQ0FBQSIsImZpbGUiOiIvVXNlcnMvYWgvLmF0b20vcGFja2FnZXMvbGludGVyLXVpLWRlZmF1bHQvbGliL3Rvb2x0aXAvbWVzc2FnZS1sZWdhY3kuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgdHlwZSBUb29sdGlwRGVsZWdhdGUgZnJvbSAnLi9kZWxlZ2F0ZSdcbmltcG9ydCB0eXBlIHsgTWVzc2FnZUxlZ2FjeSB9IGZyb20gJy4uL3R5cGVzJ1xuXG5jb25zdCBORVdMSU5FID0gL1xcclxcbnxcXG4vXG5sZXQgTUVTU0FHRV9OVU1CRVIgPSAwXG5cbmNsYXNzIE1lc3NhZ2VFbGVtZW50IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgcHJvcHM6IHtcbiAgICBtZXNzYWdlOiBNZXNzYWdlTGVnYWN5LFxuICAgIGRlbGVnYXRlOiBUb29sdGlwRGVsZWdhdGUsXG4gIH07XG4gIHN0YXRlOiB7XG4gICAgbXVsdGlMaW5lU2hvdzogYm9vbGVhbixcbiAgfSA9IHtcbiAgICBtdWx0aUxpbmVTaG93OiBmYWxzZSxcbiAgfTtcbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5wcm9wcy5kZWxlZ2F0ZS5vblNob3VsZFVwZGF0ZSgoKSA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHt9KVxuICAgIH0pXG4gICAgdGhpcy5wcm9wcy5kZWxlZ2F0ZS5vblNob3VsZEV4cGFuZCgoKSA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHsgbXVsdGlMaW5lU2hvdzogdHJ1ZSB9KVxuICAgIH0pXG4gICAgdGhpcy5wcm9wcy5kZWxlZ2F0ZS5vblNob3VsZENvbGxhcHNlKCgpID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBtdWx0aUxpbmVTaG93OiBmYWxzZSB9KVxuICAgIH0pXG4gIH1cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiBORVdMSU5FLnRlc3QodGhpcy5wcm9wcy5tZXNzYWdlLnRleHQgfHwgJycpID8gdGhpcy5yZW5kZXJNdWx0aUxpbmUoKSA6IHRoaXMucmVuZGVyU2luZ2xlTGluZSgpXG4gIH1cbiAgcmVuZGVyU2luZ2xlTGluZSgpIHtcbiAgICBjb25zdCB7IG1lc3NhZ2UsIGRlbGVnYXRlIH0gPSB0aGlzLnByb3BzXG5cbiAgICBjb25zdCBudW1iZXIgPSArK01FU1NBR0VfTlVNQkVSXG4gICAgY29uc3QgZWxlbWVudElEID0gYGxpbnRlci1tZXNzYWdlLSR7bnVtYmVyfWBcbiAgICBjb25zdCBpc0VsZW1lbnQgPSBtZXNzYWdlLmh0bWwgJiYgdHlwZW9mIG1lc3NhZ2UuaHRtbCA9PT0gJ29iamVjdCdcbiAgICBpZiAoaXNFbGVtZW50KSB7XG4gICAgICBzZXRJbW1lZGlhdGUoZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbGVtZW50SUQpXG4gICAgICAgIGlmIChlbGVtZW50KSB7XG4gICAgICAgICAgLy8gJEZsb3dJZ25vcmU6IFRoaXMgaXMgYW4gSFRNTCBFbGVtZW50IDpcXFxuICAgICAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQobWVzc2FnZS5odG1sLmNsb25lTm9kZSh0cnVlKSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zb2xlLndhcm4oJ1tMaW50ZXJdIFVuYWJsZSB0byBnZXQgZWxlbWVudCBmb3IgbW91bnRlZCBtZXNzYWdlJywgbnVtYmVyLCBtZXNzYWdlKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuICAgIHJldHVybiAoPGxpbnRlci1tZXNzYWdlIGNsYXNzPXttZXNzYWdlLnNldmVyaXR5fT5cbiAgICAgIHsgZGVsZWdhdGUuc2hvd1Byb3ZpZGVyTmFtZSA/IGAke21lc3NhZ2UubGludGVyTmFtZX06IGAgOiAnJyB9XG4gICAgICA8c3BhbiBpZD17ZWxlbWVudElEfSBkYW5nZXJvdXNseVNldElubmVySFRNTD17IWlzRWxlbWVudCAmJiBtZXNzYWdlLmh0bWwgPyB7IF9faHRtbDogbWVzc2FnZS5odG1sIH0gOiBudWxsfT5cbiAgICAgICAgeyBtZXNzYWdlLnRleHQgfVxuICAgICAgPC9zcGFuPlxuICAgICAgeycgJ31cbiAgICA8L2xpbnRlci1tZXNzYWdlPilcbiAgfVxuXG4gIHJlbmRlck11bHRpTGluZSgpIHtcbiAgICBjb25zdCB7IG1lc3NhZ2UsIGRlbGVnYXRlIH0gPSB0aGlzLnByb3BzXG5cbiAgICBjb25zdCB0ZXh0ID0gbWVzc2FnZS50ZXh0ID8gbWVzc2FnZS50ZXh0LnNwbGl0KE5FV0xJTkUpIDogW11cbiAgICBjb25zdCBjaHVua3MgPSB0ZXh0Lm1hcChlbnRyeSA9PiBlbnRyeS50cmltKCkpLm1hcCgoZW50cnksIGluZGV4KSA9PiBlbnRyeS5sZW5ndGggJiYgPHNwYW4gY2xhc3NOYW1lPXtpbmRleCAhPT0gMCAmJiAnbGludGVyLWxpbmUnfT57ZW50cnl9PC9zcGFuPikuZmlsdGVyKGUgPT4gZSlcblxuICAgIHJldHVybiAoPGxpbnRlci1tZXNzYWdlIGNsYXNzPXttZXNzYWdlLnNldmVyaXR5fT5cbiAgICAgIDxhIGhyZWY9XCIjXCIgb25DbGljaz17KCkgPT4gdGhpcy5zZXRTdGF0ZSh7IG11bHRpTGluZVNob3c6ICF0aGlzLnN0YXRlLm11bHRpTGluZVNob3cgfSl9PlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9e2BpY29uIGxpbnRlci1pY29uIGljb24tJHt0aGlzLnN0YXRlLm11bHRpTGluZVNob3cgPyAnY2hldnJvbi1kb3duJyA6ICdjaGV2cm9uLXJpZ2h0J31gfSAvPlxuICAgICAgPC9hPlxuICAgICAgeyBkZWxlZ2F0ZS5zaG93UHJvdmlkZXJOYW1lID8gYCR7bWVzc2FnZS5saW50ZXJOYW1lfTogYCA6ICcnIH1cbiAgICAgIHsgY2h1bmtzWzBdIH1cbiAgICAgIHsnICd9XG4gICAgICB7IHRoaXMuc3RhdGUubXVsdGlMaW5lU2hvdyAmJiBjaHVua3Muc2xpY2UoMSkgfVxuICAgIDwvbGludGVyLW1lc3NhZ2U+KVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTWVzc2FnZUVsZW1lbnRcbiJdfQ==