var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _marked = require('marked');

var _marked2 = _interopRequireDefault(_marked);

var _helpers = require('../helpers');

var MessageElement = (function (_React$Component) {
  _inherits(MessageElement, _React$Component);

  function MessageElement() {
    _classCallCheck(this, MessageElement);

    _get(Object.getPrototypeOf(MessageElement.prototype), 'constructor', this).apply(this, arguments);

    this.state = {
      description: '',
      descriptionShow: false
    };
    this.descriptionLoading = false;
  }

  _createClass(MessageElement, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this = this;

      this.props.delegate.onShouldUpdate(function () {
        _this.setState({});
      });
      this.props.delegate.onShouldExpand(function () {
        if (!_this.state.descriptionShow) {
          _this.toggleDescription();
        }
      });
      this.props.delegate.onShouldCollapse(function () {
        if (_this.state.descriptionShow) {
          _this.toggleDescription();
        }
      });
    }
  }, {
    key: 'toggleDescription',
    value: function toggleDescription() {
      var _this2 = this;

      var result = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      var newStatus = !this.state.descriptionShow;
      var description = this.state.description || this.props.message.description;

      if (!newStatus && !result) {
        this.setState({ descriptionShow: false });
        return;
      }
      if (typeof description === 'string' || result) {
        var descriptionToUse = (0, _marked2['default'])(result || description);
        this.setState({ descriptionShow: true, description: descriptionToUse });
      } else if (typeof description === 'function') {
        this.setState({ descriptionShow: true });
        if (this.descriptionLoading) {
          return;
        }
        this.descriptionLoading = true;
        new Promise(function (resolve) {
          resolve(description());
        }).then(function (response) {
          if (typeof response !== 'string') {
            throw new Error('Expected result to be string, got: ' + typeof response);
          }
          _this2.toggleDescription(response);
        })['catch'](function (error) {
          console.log('[Linter] Error getting descriptions', error);
          _this2.descriptionLoading = false;
          if (_this2.state.descriptionShow) {
            _this2.toggleDescription();
          }
        });
      } else {
        console.error('[Linter] Invalid description detected, expected string or function but got:', typeof description);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var _props = this.props;
      var message = _props.message;
      var delegate = _props.delegate;

      return _react2['default'].createElement(
        'linter-message',
        { 'class': message.severity },
        message.description && _react2['default'].createElement(
          'a',
          { href: '#', onClick: function () {
              return _this3.toggleDescription();
            } },
          _react2['default'].createElement('span', { className: 'icon linter-icon icon-' + (this.state.descriptionShow ? 'chevron-down' : 'chevron-right') })
        ),
        _react2['default'].createElement(
          'linter-excerpt',
          null,
          delegate.showProviderName ? message.linterName + ': ' : '',
          message.excerpt
        ),
        ' ',
        message.reference && message.reference.file && _react2['default'].createElement(
          'a',
          { href: '#', onClick: function () {
              return (0, _helpers.visitMessage)(message, true);
            } },
          _react2['default'].createElement('span', { className: 'icon linter-icon icon-alignment-aligned-to' })
        ),
        message.url && _react2['default'].createElement(
          'a',
          { href: '#', onClick: function () {
              return (0, _helpers.openExternally)(message);
            } },
          _react2['default'].createElement('span', { className: 'icon linter-icon icon-link' })
        ),
        this.state.descriptionShow && _react2['default'].createElement('div', { dangerouslySetInnerHTML: { __html: this.state.description || 'Loading...' }, className: 'linter-line' })
      );
    }
  }]);

  return MessageElement;
})(_react2['default'].Component);

module.exports = MessageElement;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvdG9vbHRpcC9tZXNzYWdlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7cUJBRWtCLE9BQU87Ozs7c0JBQ04sUUFBUTs7Ozt1QkFFa0IsWUFBWTs7SUFJbkQsY0FBYztZQUFkLGNBQWM7O1dBQWQsY0FBYzswQkFBZCxjQUFjOzsrQkFBZCxjQUFjOztTQUtsQixLQUFLLEdBR0Q7QUFDRixpQkFBVyxFQUFFLEVBQUU7QUFDZixxQkFBZSxFQUFFLEtBQUs7S0FDdkI7U0FDRCxrQkFBa0IsR0FBWSxLQUFLOzs7ZUFaL0IsY0FBYzs7V0FjRCw2QkFBRzs7O0FBQ2xCLFVBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxZQUFNO0FBQ3ZDLGNBQUssUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFBO09BQ2xCLENBQUMsQ0FBQTtBQUNGLFVBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxZQUFNO0FBQ3ZDLFlBQUksQ0FBQyxNQUFLLEtBQUssQ0FBQyxlQUFlLEVBQUU7QUFDL0IsZ0JBQUssaUJBQWlCLEVBQUUsQ0FBQTtTQUN6QjtPQUNGLENBQUMsQ0FBQTtBQUNGLFVBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLFlBQU07QUFDekMsWUFBSSxNQUFLLEtBQUssQ0FBQyxlQUFlLEVBQUU7QUFDOUIsZ0JBQUssaUJBQWlCLEVBQUUsQ0FBQTtTQUN6QjtPQUNGLENBQUMsQ0FBQTtLQUNIOzs7V0FDZ0IsNkJBQXlCOzs7VUFBeEIsTUFBZSx5REFBRyxJQUFJOztBQUN0QyxVQUFNLFNBQVMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFBO0FBQzdDLFVBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFD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LEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLElBQUksWUFBWSxFQUFFLEFBQUMsRUFBQyxTQUFTLEVBQUMsYUFBYSxHQUFHLEFBQzdHO09BQ2MsQ0FBQztLQUNuQjs7O1NBekZHLGNBQWM7R0FBUyxtQkFBTSxTQUFTOztBQTRGNUMsTUFBTSxDQUFDLE9BQU8sR0FBRyxjQUFjLENBQUEiLCJmaWxlIjoiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2xpbnRlci11aS1kZWZhdWx0L2xpYi90b29sdGlwL21lc3NhZ2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgbWFya2VkIGZyb20gJ21hcmtlZCdcblxuaW1wb3J0IHsgdmlzaXRNZXNzYWdlLCBvcGVuRXh0ZXJuYWxseSB9IGZyb20gJy4uL2hlbHBlcnMnXG5pbXBvcnQgdHlwZSBUb29sdGlwRGVsZWdhdGUgZnJvbSAnLi9kZWxlZ2F0ZSdcbmltcG9ydCB0eXBlIHsgTWVzc2FnZSB9IGZyb20gJy4uL3R5cGVzJ1xuXG5jbGFzcyBNZXNzYWdlRWxlbWVudCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHByb3BzOiB7XG4gICAgbWVzc2FnZTogTWVzc2FnZSxcbiAgICBkZWxlZ2F0ZTogVG9vbHRpcERlbGVnYXRlLFxuICB9O1xuICBzdGF0ZToge1xuICAgIGRlc2NyaXB0aW9uOiBzdHJpbmcsXG4gICAgZGVzY3JpcHRpb25TaG93OiBib29sZWFuLFxuICB9ID0ge1xuICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICBkZXNjcmlwdGlvblNob3c6IGZhbHNlLFxuICB9O1xuICBkZXNjcmlwdGlvbkxvYWRpbmc6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLnByb3BzLmRlbGVnYXRlLm9uU2hvdWxkVXBkYXRlKCgpID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe30pXG4gICAgfSlcbiAgICB0aGlzLnByb3BzLmRlbGVnYXRlLm9uU2hvdWxkRXhwYW5kKCgpID0+IHtcbiAgICAgIGlmICghdGhpcy5zdGF0ZS5kZXNjcmlwdGlvblNob3cpIHtcbiAgICAgICAgdGhpcy50b2dnbGVEZXNjcmlwdGlvbigpXG4gICAgICB9XG4gICAgfSlcbiAgICB0aGlzLnByb3BzLmRlbGVnYXRlLm9uU2hvdWxkQ29sbGFwc2UoKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuc3RhdGUuZGVzY3JpcHRpb25TaG93KSB7XG4gICAgICAgIHRoaXMudG9nZ2xlRGVzY3JpcHRpb24oKVxuICAgICAgfVxuICAgIH0pXG4gIH1cbiAgdG9nZ2xlRGVzY3JpcHRpb24ocmVzdWx0OiA/c3RyaW5nID0gbnVsbCkge1xuICAgIGNvbnN0IG5ld1N0YXR1cyA9ICF0aGlzLnN0YXRlLmRlc2NyaXB0aW9uU2hvd1xuICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gdGhpcy5zdGF0ZS5kZXNjcmlwdGlvbiB8fCB0aGlzLnByb3BzLm1lc3NhZ2UuZGVzY3JpcHRpb25cblxuICAgIGlmICghbmV3U3RhdHVzICYmICFyZXN1bHQpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBkZXNjcmlwdGlvblNob3c6IGZhbHNlIH0pXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgaWYgKHR5cGVvZiBkZXNjcmlwdGlvbiA9PT0gJ3N0cmluZycgfHwgcmVzdWx0KSB7XG4gICAgICBjb25zdCBkZXNjcmlwdGlvblRvVXNlID0gbWFya2VkKHJlc3VsdCB8fCBkZXNjcmlwdGlvbilcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBkZXNjcmlwdGlvblNob3c6IHRydWUsIGRlc2NyaXB0aW9uOiBkZXNjcmlwdGlvblRvVXNlIH0pXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZGVzY3JpcHRpb24gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBkZXNjcmlwdGlvblNob3c6IHRydWUgfSlcbiAgICAgIGlmICh0aGlzLmRlc2NyaXB0aW9uTG9hZGluZykge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIHRoaXMuZGVzY3JpcHRpb25Mb2FkaW5nID0gdHJ1ZVxuICAgICAgbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkgeyByZXNvbHZlKGRlc2NyaXB0aW9uKCkpIH0pXG4gICAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgIGlmICh0eXBlb2YgcmVzcG9uc2UgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGVkIHJlc3VsdCB0byBiZSBzdHJpbmcsIGdvdDogJHt0eXBlb2YgcmVzcG9uc2V9YClcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy50b2dnbGVEZXNjcmlwdGlvbihyZXNwb25zZSlcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdbTGludGVyXSBFcnJvciBnZXR0aW5nIGRlc2NyaXB0aW9ucycsIGVycm9yKVxuICAgICAgICAgIHRoaXMuZGVzY3JpcHRpb25Mb2FkaW5nID0gZmFsc2VcbiAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5kZXNjcmlwdGlvblNob3cpIHtcbiAgICAgICAgICAgIHRoaXMudG9nZ2xlRGVzY3JpcHRpb24oKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5lcnJvcignW0xpbnRlcl0gSW52YWxpZCBkZXNjcmlwdGlvbiBkZXRlY3RlZCwgZXhwZWN0ZWQgc3RyaW5nIG9yIGZ1bmN0aW9uIGJ1dCBnb3Q6JywgdHlwZW9mIGRlc2NyaXB0aW9uKVxuICAgIH1cbiAgfVxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyBtZXNzYWdlLCBkZWxlZ2F0ZSB9ID0gdGhpcy5wcm9wc1xuXG4gICAgcmV0dXJuICg8bGludGVyLW1lc3NhZ2UgY2xhc3M9e21lc3NhZ2Uuc2V2ZXJpdHl9PlxuICAgICAgeyBtZXNzYWdlLmRlc2NyaXB0aW9uICYmIChcbiAgICAgICAgPGEgaHJlZj1cIiNcIiBvbkNsaWNrPXsoKSA9PiB0aGlzLnRvZ2dsZURlc2NyaXB0aW9uKCl9PlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT17YGljb24gbGludGVyLWljb24gaWNvbi0ke3RoaXMuc3RhdGUuZGVzY3JpcHRpb25TaG93ID8gJ2NoZXZyb24tZG93bicgOiAnY2hldnJvbi1yaWdodCd9YH0gLz5cbiAgICAgICAgPC9hPlxuICAgICAgKX1cbiAgICAgIDxsaW50ZXItZXhjZXJwdD5cbiAgICAgICAgeyBkZWxlZ2F0ZS5zaG93UHJvdmlkZXJOYW1lID8gYCR7bWVzc2FnZS5saW50ZXJOYW1lfTogYCA6ICcnIH1cbiAgICAgICAgeyBtZXNzYWdlLmV4Y2VycHQgfVxuICAgICAgPC9saW50ZXItZXhjZXJwdD57JyAnfVxuICAgICAgeyBtZXNzYWdlLnJlZmVyZW5jZSAmJiBtZXNzYWdlLnJlZmVyZW5jZS5maWxlICYmIChcbiAgICAgICAgPGEgaHJlZj1cIiNcIiBvbkNsaWNrPXsoKSA9PiB2aXNpdE1lc3NhZ2UobWVzc2FnZSwgdHJ1ZSl9PlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImljb24gbGludGVyLWljb24gaWNvbi1hbGlnbm1lbnQtYWxpZ25lZC10b1wiIC8+XG4gICAgICAgIDwvYT5cbiAgICAgICl9XG4gICAgICB7IG1lc3NhZ2UudXJsICYmIDxhIGhyZWY9XCIjXCIgb25DbGljaz17KCkgPT4gb3BlbkV4dGVybmFsbHkobWVzc2FnZSl9PlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJpY29uIGxpbnRlci1pY29uIGljb24tbGlua1wiIC8+XG4gICAgICA8L2E+fVxuICAgICAgeyB0aGlzLnN0YXRlLmRlc2NyaXB0aW9uU2hvdyAmJiAoXG4gICAgICAgIDxkaXYgZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw9e3sgX19odG1sOiB0aGlzLnN0YXRlLmRlc2NyaXB0aW9uIHx8ICdMb2FkaW5nLi4uJyB9fSBjbGFzc05hbWU9XCJsaW50ZXItbGluZVwiIC8+XG4gICAgICApIH1cbiAgICA8L2xpbnRlci1tZXNzYWdlPilcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE1lc3NhZ2VFbGVtZW50XG4iXX0=