Object.defineProperty(exports, '__esModule', {
  value: true
});

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
        _react2['default'].createElement(
          'a',
          { href: '#', onClick: function () {
              return (0, _helpers.openExternally)(message);
            } },
          _react2['default'].createElement('span', { className: 'icon linter-icon icon-link' })
        ),
        this.state.descriptionShow && _react2['default'].createElement('div', { dangerouslySetInnerHTML: { __html: this.state.description || 'Loading...' }, 'class': 'linter-line' })
      );
    }
  }]);

  return MessageElement;
})(_react2['default'].Component);

exports['default'] = MessageElement;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvdG9vbHRpcC9tZXNzYWdlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O3FCQUVrQixPQUFPOzs7O3NCQUNOLFFBQVE7Ozs7dUJBRWtCLFlBQVk7O0lBSXBDLGNBQWM7WUFBZCxjQUFjOztXQUFkLGNBQWM7MEJBQWQsY0FBYzs7K0JBQWQsY0FBYzs7U0FLakMsS0FBSyxHQUdEO0FBQ0YsaUJBQVcsRUFBRSxFQUFFO0FBQ2YscUJBQWUsRUFBRSxLQUFLO0tBQ3ZCO1NBQ0Qsa0JBQWtCLEdBQVksS0FBSzs7O2VBWmhCLGNBQWM7O1dBY2hCLDZCQUFHOzs7QUFDbEIsVUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLFlBQU07QUFDdkMsY0FBSyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUE7T0FDbEIsQ0FBQyxDQUFBO0FBQ0YsVUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLFlBQU07QUFDdkMsWUFBSSxDQUFDLE1BQUssS0FBSyxDQUFDLGVBQWUsRUFBRTtBQUMvQixnQkFBSyxpQkFBaUIsRUFBRSxDQUFBO1NBQ3pCO09BQ0YsQ0FBQyxDQUFBO0FBQ0YsVUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsWUFBTTtBQUN6QyxZQUFJLE1BQUssS0FBSyxDQUFDLGVBQWUsRUFBRTtBQUM5QixnQkFBSyxpQkFBaUIsRUFBRSxDQUFBO1NBQ3pCO09BQ0YsQ0FBQyxDQUFBO0tBQ0g7OztXQUNnQiw2QkFBeUI7OztVQUF4QixNQUFlLHlEQUFHLElBQUk7O0FBQ3RDLFVBQU0sU0FBUyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUE7QUFDN0MsVUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFBOztBQUU1RSxVQUFJLENBQUMsU0FBUyxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQ3pCLFlBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxlQUFlLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQTtBQUN6QyxlQUFNO09BQ1A7QUFDRCxVQUFJLE9BQU8sV0FBVyxLQUFLLFFBQVEsSUFBSSxNQUFNLEVBQUU7QUFDN0MsWUFBTSxnQkFBZ0IsR0FBRyx5QkFBTyxNQUFNLElBQUksV0FBVyxDQUFDLENBQUE7QUFDdEQsWUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLGVBQWUsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLGdCQUFnQixFQUFFLENBQUMsQ0FBQTtPQUN4RSxNQUFNLElBQUksT0FBTyxXQUFXLEtBQUssVUFBVSxFQUFFO0FBQzVDLFlBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxlQUFlLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQTtBQUN4QyxZQUFJLElBQUksQ0FBQyxrQkFBa0IsRUFBRTtBQUMzQixpQkFBTTtTQUNQO0FBQ0QsWUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksQ0FBQTtBQUM5QixZQUFJLE9BQU8sQ0FBQyxVQUFTLE9BQU8sRUFBRTtBQUFFLGlCQUFPLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQTtTQUFFLENBQUMsQ0FDdEQsSUFBSSxDQUFDLFVBQUMsUUFBUSxFQUFLO0FBQ2xCLGNBQUksT0FBTyxRQUFRLEtBQUssUUFBUSxFQUFFO0FBQ2hDLGtCQUFNLElBQUksS0FBSyx5Q0FBdUMsT0FBTyxRQUFRLENBQUcsQ0FBQTtXQUN6RTtBQUNELGlCQUFLLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxDQUFBO1NBQ2pDLENBQUMsU0FDSSxDQUFDLFVBQUMsS0FBSyxFQUFLO0FBQ2hCLGlCQUFPLENBQUMsR0FBRyxDQUFDLHFDQUFxQyxFQUFFLEtBQUssQ0FBQyxDQUFBO0FBQ3pELGlCQUFLLGtCQUFrQixHQUFHLEtBQUssQ0FBQTtBQUMvQixjQUFJLE9BQUssS0FBSyxDQUFDLGVBQWUsRUFBRTtBQUM5QixtQkFBSyxpQkFBaUIsRUFBRSxDQUFBO1dBQ3pCO1NBQ0YsQ0FBQyxDQUFBO09BQ0wsTUFBTTtBQUNMLGVBQU8sQ0FBQyxLQUFLLENBQUMsNkVBQTZFLEVBQUUsT0FBTyxXQUFXLENBQUMsQ0FBQTtPQUNqSDtLQUNGOzs7V0FDSyxrQkFBRzs7O21CQUN1QixJQUFJLENBQUMsS0FBSztVQUFoQyxPQUFPLFVBQVAsT0FBTztVQUFFLFFBQVEsVUFBUixRQUFROztBQUV6QixhQUFROztVQUFnQixTQUFPLE9BQU8sQ0FBQyxRQUFRLEFBQUM7UUFDNUMsT0FBTyxDQUFDLFdBQVcsSUFDbkI7O1lBQUcsSUFBSSxFQUFDLEdBQUcsRUFBQyxPQUFPLEVBQUU7cUJBQU0sT0FBSyxpQkFBaUIsRUFBRTthQUFBLEFBQUM7VUFDbEQsMkNBQU0sU0FBUyw4QkFBMkIsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLEdBQUcsY0FBYyxHQUFHLGVBQWUsQ0FBQSxBQUFHLEdBQVE7U0FDaEgsQUFDTDtRQUNEOzs7VUFDSSxRQUFRLENBQUMsZ0JBQWdCLEdBQU0sT0FBTyxDQUFDLFVBQVUsVUFBTyxFQUFFO1VBQzFELE9BQU8sQ0FBQyxPQUFPO1NBQ0Y7UUFBQyxHQUFHO1FBQ25CLE9BQU8sQ0FBQyxTQUFTLElBQUksT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLElBQzNDOztZQUFHLElBQUksRUFBQyxHQUFHLEVBQUMsT0FBTyxFQUFFO3FCQUFNLDJCQUFhLE9BQU8sRUFBRSxJQUFJLENBQUM7YUFBQSxBQUFDO1VBQ3JELDJDQUFNLFNBQVMsRUFBQyw0Q0FBNEMsR0FBUTtTQUNsRSxBQUNMO1FBQ0Q7O1lBQUcsSUFBSSxFQUFDLEdBQUcsRUFBQyxPQUFPLEVBQUU7cUJBQU0sNkJBQWUsT0FBTyxDQUFDO2FBQUEsQUFBQztVQUNqRCwyQ0FBTSxTQUFTLEVBQUMsNEJBQTRCLEdBQVE7U0FDbEQ7UUFDRixJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsSUFDMUIsMENBQUssdUJBQXVCLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLElBQUksWUFBWSxFQUFFLEFBQUMsRUFBQyxTQUFNLGFBQWEsR0FBTyxBQUM3RztPQUNjLENBQUM7S0FDbkI7OztTQXpGa0IsY0FBYztHQUFTLG1CQUFNLFNBQVM7O3FCQUF0QyxjQUFjIiwiZmlsZSI6Ii9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvdG9vbHRpcC9tZXNzYWdlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IG1hcmtlZCBmcm9tICdtYXJrZWQnXG5cbmltcG9ydCB7IHZpc2l0TWVzc2FnZSwgb3BlbkV4dGVybmFsbHkgfSBmcm9tICcuLi9oZWxwZXJzJ1xuaW1wb3J0IHR5cGUgVG9vbHRpcERlbGVnYXRlIGZyb20gJy4vZGVsZWdhdGUnXG5pbXBvcnQgdHlwZSB7IE1lc3NhZ2UgfSBmcm9tICcuLi90eXBlcydcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWVzc2FnZUVsZW1lbnQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBwcm9wczoge1xuICAgIG1lc3NhZ2U6IE1lc3NhZ2UsXG4gICAgZGVsZWdhdGU6IFRvb2x0aXBEZWxlZ2F0ZSxcbiAgfTtcbiAgc3RhdGU6IHtcbiAgICBkZXNjcmlwdGlvbjogc3RyaW5nLFxuICAgIGRlc2NyaXB0aW9uU2hvdzogYm9vbGVhbixcbiAgfSA9IHtcbiAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgZGVzY3JpcHRpb25TaG93OiBmYWxzZSxcbiAgfTtcbiAgZGVzY3JpcHRpb25Mb2FkaW5nOiBib29sZWFuID0gZmFsc2U7XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5wcm9wcy5kZWxlZ2F0ZS5vblNob3VsZFVwZGF0ZSgoKSA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHt9KVxuICAgIH0pXG4gICAgdGhpcy5wcm9wcy5kZWxlZ2F0ZS5vblNob3VsZEV4cGFuZCgoKSA9PiB7XG4gICAgICBpZiAoIXRoaXMuc3RhdGUuZGVzY3JpcHRpb25TaG93KSB7XG4gICAgICAgIHRoaXMudG9nZ2xlRGVzY3JpcHRpb24oKVxuICAgICAgfVxuICAgIH0pXG4gICAgdGhpcy5wcm9wcy5kZWxlZ2F0ZS5vblNob3VsZENvbGxhcHNlKCgpID0+IHtcbiAgICAgIGlmICh0aGlzLnN0YXRlLmRlc2NyaXB0aW9uU2hvdykge1xuICAgICAgICB0aGlzLnRvZ2dsZURlc2NyaXB0aW9uKClcbiAgICAgIH1cbiAgICB9KVxuICB9XG4gIHRvZ2dsZURlc2NyaXB0aW9uKHJlc3VsdDogP3N0cmluZyA9IG51bGwpIHtcbiAgICBjb25zdCBuZXdTdGF0dXMgPSAhdGhpcy5zdGF0ZS5kZXNjcmlwdGlvblNob3dcbiAgICBjb25zdCBkZXNjcmlwdGlvbiA9IHRoaXMuc3RhdGUuZGVzY3JpcHRpb24gfHwgdGhpcy5wcm9wcy5tZXNzYWdlLmRlc2NyaXB0aW9uXG5cbiAgICBpZiAoIW5ld1N0YXR1cyAmJiAhcmVzdWx0KSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHsgZGVzY3JpcHRpb25TaG93OiBmYWxzZSB9KVxuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGlmICh0eXBlb2YgZGVzY3JpcHRpb24gPT09ICdzdHJpbmcnIHx8IHJlc3VsdCkge1xuICAgICAgY29uc3QgZGVzY3JpcHRpb25Ub1VzZSA9IG1hcmtlZChyZXN1bHQgfHwgZGVzY3JpcHRpb24pXG4gICAgICB0aGlzLnNldFN0YXRlKHsgZGVzY3JpcHRpb25TaG93OiB0cnVlLCBkZXNjcmlwdGlvbjogZGVzY3JpcHRpb25Ub1VzZSB9KVxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGRlc2NyaXB0aW9uID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHsgZGVzY3JpcHRpb25TaG93OiB0cnVlIH0pXG4gICAgICBpZiAodGhpcy5kZXNjcmlwdGlvbkxvYWRpbmcpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICB0aGlzLmRlc2NyaXB0aW9uTG9hZGluZyA9IHRydWVcbiAgICAgIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpIHsgcmVzb2x2ZShkZXNjcmlwdGlvbigpKSB9KVxuICAgICAgICAudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICBpZiAodHlwZW9mIHJlc3BvbnNlICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFeHBlY3RlZCByZXN1bHQgdG8gYmUgc3RyaW5nLCBnb3Q6ICR7dHlwZW9mIHJlc3BvbnNlfWApXG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMudG9nZ2xlRGVzY3JpcHRpb24ocmVzcG9uc2UpXG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnW0xpbnRlcl0gRXJyb3IgZ2V0dGluZyBkZXNjcmlwdGlvbnMnLCBlcnJvcilcbiAgICAgICAgICB0aGlzLmRlc2NyaXB0aW9uTG9hZGluZyA9IGZhbHNlXG4gICAgICAgICAgaWYgKHRoaXMuc3RhdGUuZGVzY3JpcHRpb25TaG93KSB7XG4gICAgICAgICAgICB0aGlzLnRvZ2dsZURlc2NyaXB0aW9uKClcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ1tMaW50ZXJdIEludmFsaWQgZGVzY3JpcHRpb24gZGV0ZWN0ZWQsIGV4cGVjdGVkIHN0cmluZyBvciBmdW5jdGlvbiBidXQgZ290OicsIHR5cGVvZiBkZXNjcmlwdGlvbilcbiAgICB9XG4gIH1cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgbWVzc2FnZSwgZGVsZWdhdGUgfSA9IHRoaXMucHJvcHNcblxuICAgIHJldHVybiAoPGxpbnRlci1tZXNzYWdlIGNsYXNzPXttZXNzYWdlLnNldmVyaXR5fT5cbiAgICAgIHsgbWVzc2FnZS5kZXNjcmlwdGlvbiAmJiAoXG4gICAgICAgIDxhIGhyZWY9XCIjXCIgb25DbGljaz17KCkgPT4gdGhpcy50b2dnbGVEZXNjcmlwdGlvbigpfT5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9e2BpY29uIGxpbnRlci1pY29uIGljb24tJHt0aGlzLnN0YXRlLmRlc2NyaXB0aW9uU2hvdyA/ICdjaGV2cm9uLWRvd24nIDogJ2NoZXZyb24tcmlnaHQnfWB9Pjwvc3Bhbj5cbiAgICAgICAgPC9hPlxuICAgICAgKX1cbiAgICAgIDxsaW50ZXItZXhjZXJwdD5cbiAgICAgICAgeyBkZWxlZ2F0ZS5zaG93UHJvdmlkZXJOYW1lID8gYCR7bWVzc2FnZS5saW50ZXJOYW1lfTogYCA6ICcnIH1cbiAgICAgICAgeyBtZXNzYWdlLmV4Y2VycHQgfVxuICAgICAgPC9saW50ZXItZXhjZXJwdD57JyAnfVxuICAgICAgeyBtZXNzYWdlLnJlZmVyZW5jZSAmJiBtZXNzYWdlLnJlZmVyZW5jZS5maWxlICYmIChcbiAgICAgICAgPGEgaHJlZj1cIiNcIiBvbkNsaWNrPXsoKSA9PiB2aXNpdE1lc3NhZ2UobWVzc2FnZSwgdHJ1ZSl9PlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImljb24gbGludGVyLWljb24gaWNvbi1hbGlnbm1lbnQtYWxpZ25lZC10b1wiPjwvc3Bhbj5cbiAgICAgICAgPC9hPlxuICAgICAgKX1cbiAgICAgIDxhIGhyZWY9XCIjXCIgb25DbGljaz17KCkgPT4gb3BlbkV4dGVybmFsbHkobWVzc2FnZSl9PlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJpY29uIGxpbnRlci1pY29uIGljb24tbGlua1wiPjwvc3Bhbj5cbiAgICAgIDwvYT5cbiAgICAgIHsgdGhpcy5zdGF0ZS5kZXNjcmlwdGlvblNob3cgJiYgKFxuICAgICAgICA8ZGl2IGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXt7IF9faHRtbDogdGhpcy5zdGF0ZS5kZXNjcmlwdGlvbiB8fCAnTG9hZGluZy4uLicgfX0gY2xhc3M9XCJsaW50ZXItbGluZVwiPjwvZGl2PlxuICAgICAgKSB9XG4gICAgPC9saW50ZXItbWVzc2FnZT4pXG4gIH1cbn1cbiJdfQ==