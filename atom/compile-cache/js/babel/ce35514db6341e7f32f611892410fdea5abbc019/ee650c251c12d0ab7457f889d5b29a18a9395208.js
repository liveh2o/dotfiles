var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _url = require('url');

var url = _interopRequireWildcard(_url);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _marked = require('marked');

var _marked2 = _interopRequireDefault(_marked);

var _helpers = require('../helpers');

function findHref(el) {
  while (el && !el.classList.contains('linter-line')) {
    if (el instanceof HTMLAnchorElement) {
      return el.href;
    }
    el = el.parentElement;
  }
  return null;
}

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

    this.openFile = function (ev) {
      if (!(ev.target instanceof HTMLElement)) {
        return;
      }
      var href = findHref(ev.target);
      if (!href) {
        return;
      }
      // parse the link. e.g. atom://linter?file=<path>&row=<number>&column=<number>

      var _url$parse = url.parse(href, true);

      var protocol = _url$parse.protocol;
      var hostname = _url$parse.hostname;
      var query = _url$parse.query;

      var file = query && query.file;
      if (protocol !== 'atom:' || hostname !== 'linter' || !file) {
        return;
      }
      var row = query && query.row ? parseInt(query.row, 10) : 0;
      var column = query && query.column ? parseInt(query.column, 10) : 0;
      (0, _helpers.openFile)(file, { row: row, column: column });
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
        { 'class': message.severity, onClick: this.openFile },
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvdG9vbHRpcC9tZXNzYWdlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OzttQkFFcUIsS0FBSzs7SUFBZCxHQUFHOztxQkFDRyxPQUFPOzs7O3NCQUNOLFFBQVE7Ozs7dUJBRTRCLFlBQVk7O0FBSW5FLFNBQVMsUUFBUSxDQUFDLEVBQVksRUFBVztBQUN2QyxTQUFPLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxFQUFFO0FBQ2xELFFBQUksRUFBRSxZQUFZLGlCQUFpQixFQUFFO0FBQ25DLGFBQU8sRUFBRSxDQUFDLElBQUksQ0FBQTtLQUNmO0FBQ0QsTUFBRSxHQUFHLEVBQUUsQ0FBQyxhQUFhLENBQUE7R0FDdEI7QUFDRCxTQUFPLElBQUksQ0FBQTtDQUNaOztJQUVLLGNBQWM7WUFBZCxjQUFjOztXQUFkLGNBQWM7MEJBQWQsY0FBYzs7K0JBQWQsY0FBYzs7U0FLbEIsS0FBSyxHQUdEO0FBQ0YsaUJBQVcsRUFBRSxFQUFFO0FBQ2YscUJBQWUsRUFBRSxLQUFLO0tBQ3ZCO1NBQ0Qsa0JBQWtCLEdBQVksS0FBSzs7U0FvRG5DLFFBQVEsR0FBRyxVQUFDLEVBQUUsRUFBWTtBQUN4QixVQUFJLEVBQUUsRUFBRSxDQUFDLE1BQU0sWUFBWSxXQUFXLENBQUEsQUFBQyxFQUFFO0FBQ3ZDLGVBQU07T0FDUDtBQUNELFVBQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDaEMsVUFBSSxDQUFDLElBQUksRUFBRTtBQUNULGVBQU07T0FDUDs7O3VCQUVxQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7O1VBQW5ELFFBQVEsY0FBUixRQUFRO1VBQUUsUUFBUSxjQUFSLFFBQVE7VUFBRSxLQUFLLGNBQUwsS0FBSzs7QUFDakMsVUFBTSxJQUFJ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QUcsRUFBQyxPQUFPLEVBQUU7cUJBQU0sNkJBQWUsT0FBTyxDQUFDO2FBQUEsQUFBQztVQUNsRSwyQ0FBTSxTQUFTLEVBQUMsNEJBQTRCLEdBQUc7U0FDN0M7UUFDRixJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsSUFDMUIsMENBQUssdUJBQXVCLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLElBQUksWUFBWSxFQUFFLEFBQUMsRUFBQyxTQUFTLEVBQUMsYUFBYSxHQUFHLEFBQzdHO09BQ2MsQ0FBQztLQUNuQjs7O1NBM0dHLGNBQWM7R0FBUyxtQkFBTSxTQUFTOztBQThHNUMsTUFBTSxDQUFDLE9BQU8sR0FBRyxjQUFjLENBQUEiLCJmaWxlIjoiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2xpbnRlci11aS1kZWZhdWx0L2xpYi90b29sdGlwL21lc3NhZ2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgKiBhcyB1cmwgZnJvbSAndXJsJ1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IG1hcmtlZCBmcm9tICdtYXJrZWQnXG5cbmltcG9ydCB7IHZpc2l0TWVzc2FnZSwgb3BlbkV4dGVybmFsbHksIG9wZW5GaWxlIH0gZnJvbSAnLi4vaGVscGVycydcbmltcG9ydCB0eXBlIFRvb2x0aXBEZWxlZ2F0ZSBmcm9tICcuL2RlbGVnYXRlJ1xuaW1wb3J0IHR5cGUgeyBNZXNzYWdlIH0gZnJvbSAnLi4vdHlwZXMnXG5cbmZ1bmN0aW9uIGZpbmRIcmVmKGVsOiA/RWxlbWVudCk6ID9zdHJpbmcge1xuICB3aGlsZSAoZWwgJiYgIWVsLmNsYXNzTGlzdC5jb250YWlucygnbGludGVyLWxpbmUnKSkge1xuICAgIGlmIChlbCBpbnN0YW5jZW9mIEhUTUxBbmNob3JFbGVtZW50KSB7XG4gICAgICByZXR1cm4gZWwuaHJlZlxuICAgIH1cbiAgICBlbCA9IGVsLnBhcmVudEVsZW1lbnRcbiAgfVxuICByZXR1cm4gbnVsbFxufVxuXG5jbGFzcyBNZXNzYWdlRWxlbWVudCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHByb3BzOiB7XG4gICAgbWVzc2FnZTogTWVzc2FnZSxcbiAgICBkZWxlZ2F0ZTogVG9vbHRpcERlbGVnYXRlLFxuICB9O1xuICBzdGF0ZToge1xuICAgIGRlc2NyaXB0aW9uOiBzdHJpbmcsXG4gICAgZGVzY3JpcHRpb25TaG93OiBib29sZWFuLFxuICB9ID0ge1xuICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICBkZXNjcmlwdGlvblNob3c6IGZhbHNlLFxuICB9O1xuICBkZXNjcmlwdGlvbkxvYWRpbmc6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLnByb3BzLmRlbGVnYXRlLm9uU2hvdWxkVXBkYXRlKCgpID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe30pXG4gICAgfSlcbiAgICB0aGlzLnByb3BzLmRlbGVnYXRlLm9uU2hvdWxkRXhwYW5kKCgpID0+IHtcbiAgICAgIGlmICghdGhpcy5zdGF0ZS5kZXNjcmlwdGlvblNob3cpIHtcbiAgICAgICAgdGhpcy50b2dnbGVEZXNjcmlwdGlvbigpXG4gICAgICB9XG4gICAgfSlcbiAgICB0aGlzLnByb3BzLmRlbGVnYXRlLm9uU2hvdWxkQ29sbGFwc2UoKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuc3RhdGUuZGVzY3JpcHRpb25TaG93KSB7XG4gICAgICAgIHRoaXMudG9nZ2xlRGVzY3JpcHRpb24oKVxuICAgICAgfVxuICAgIH0pXG4gIH1cbiAgdG9nZ2xlRGVzY3JpcHRpb24ocmVzdWx0OiA/c3RyaW5nID0gbnVsbCkge1xuICAgIGNvbnN0IG5ld1N0YXR1cyA9ICF0aGlzLnN0YXRlLmRlc2NyaXB0aW9uU2hvd1xuICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gdGhpcy5zdGF0ZS5kZXNjcmlwdGlvbiB8fCB0aGlzLnByb3BzLm1lc3NhZ2UuZGVzY3JpcHRpb25cblxuICAgIGlmICghbmV3U3RhdHVzICYmICFyZXN1bHQpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBkZXNjcmlwdGlvblNob3c6IGZhbHNlIH0pXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgaWYgKHR5cGVvZiBkZXNjcmlwdGlvbiA9PT0gJ3N0cmluZycgfHwgcmVzdWx0KSB7XG4gICAgICBjb25zdCBkZXNjcmlwdGlvblRvVXNlID0gbWFya2VkKHJlc3VsdCB8fCBkZXNjcmlwdGlvbilcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBkZXNjcmlwdGlvblNob3c6IHRydWUsIGRlc2NyaXB0aW9uOiBkZXNjcmlwdGlvblRvVXNlIH0pXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZGVzY3JpcHRpb24gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBkZXNjcmlwdGlvblNob3c6IHRydWUgfSlcbiAgICAgIGlmICh0aGlzLmRlc2NyaXB0aW9uTG9hZGluZykge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIHRoaXMuZGVzY3JpcHRpb25Mb2FkaW5nID0gdHJ1ZVxuICAgICAgbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkgeyByZXNvbHZlKGRlc2NyaXB0aW9uKCkpIH0pXG4gICAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgIGlmICh0eXBlb2YgcmVzcG9uc2UgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGVkIHJlc3VsdCB0byBiZSBzdHJpbmcsIGdvdDogJHt0eXBlb2YgcmVzcG9uc2V9YClcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy50b2dnbGVEZXNjcmlwdGlvbihyZXNwb25zZSlcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdbTGludGVyXSBFcnJvciBnZXR0aW5nIGRlc2NyaXB0aW9ucycsIGVycm9yKVxuICAgICAgICAgIHRoaXMuZGVzY3JpcHRpb25Mb2FkaW5nID0gZmFsc2VcbiAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5kZXNjcmlwdGlvblNob3cpIHtcbiAgICAgICAgICAgIHRoaXMudG9nZ2xlRGVzY3JpcHRpb24oKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5lcnJvcignW0xpbnRlcl0gSW52YWxpZCBkZXNjcmlwdGlvbiBkZXRlY3RlZCwgZXhwZWN0ZWQgc3RyaW5nIG9yIGZ1bmN0aW9uIGJ1dCBnb3Q6JywgdHlwZW9mIGRlc2NyaXB0aW9uKVxuICAgIH1cbiAgfVxuICBvcGVuRmlsZSA9IChldjogRXZlbnQpID0+IHtcbiAgICBpZiAoIShldi50YXJnZXQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBjb25zdCBocmVmID0gZmluZEhyZWYoZXYudGFyZ2V0KVxuICAgIGlmICghaHJlZikge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIC8vIHBhcnNlIHRoZSBsaW5rLiBlLmcuIGF0b206Ly9saW50ZXI/ZmlsZT08cGF0aD4mcm93PTxudW1iZXI+JmNvbHVtbj08bnVtYmVyPlxuICAgIGNvbnN0IHsgcHJvdG9jb2wsIGhvc3RuYW1lLCBxdWVyeSB9ID0gdXJsLnBhcnNlKGhyZWYsIHRydWUpXG4gICAgY29uc3QgZmlsZSA9IHF1ZXJ5ICYmIHF1ZXJ5LmZpbGVcbiAgICBpZiAocHJvdG9jb2wgIT09ICdhdG9tOicgfHwgaG9zdG5hbWUgIT09ICdsaW50ZXInIHx8ICFmaWxlKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgY29uc3Qgcm93ID0gcXVlcnkgJiYgcXVlcnkucm93ID8gcGFyc2VJbnQocXVlcnkucm93LCAxMCkgOiAwXG4gICAgY29uc3QgY29sdW1uID0gcXVlcnkgJiYgcXVlcnkuY29sdW1uID8gcGFyc2VJbnQocXVlcnkuY29sdW1uLCAxMCkgOiAwXG4gICAgb3BlbkZpbGUoZmlsZSwgeyByb3csIGNvbHVtbiB9KVxuICB9XG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IG1lc3NhZ2UsIGRlbGVnYXRlIH0gPSB0aGlzLnByb3BzXG5cbiAgICByZXR1cm4gKDxsaW50ZXItbWVzc2FnZSBjbGFzcz17bWVzc2FnZS5zZXZlcml0eX0gb25DbGljaz17dGhpcy5vcGVuRmlsZX0+XG4gICAgICB7IG1lc3NhZ2UuZGVzY3JpcHRpb24gJiYgKFxuICAgICAgICA8YSBocmVmPVwiI1wiIG9uQ2xpY2s9eygpID0+IHRoaXMudG9nZ2xlRGVzY3JpcHRpb24oKX0+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPXtgaWNvbiBsaW50ZXItaWNvbiBpY29uLSR7dGhpcy5zdGF0ZS5kZXNjcmlwdGlvblNob3cgPyAnY2hldnJvbi1kb3duJyA6ICdjaGV2cm9uLXJpZ2h0J31gfSAvPlxuICAgICAgICA8L2E+XG4gICAgICApfVxuICAgICAgPGxpbnRlci1leGNlcnB0PlxuICAgICAgICB7IGRlbGVnYXRlLnNob3dQcm92aWRlck5hbWUgPyBgJHttZXNzYWdlLmxpbnRlck5hbWV9OiBgIDogJycgfVxuICAgICAgICB7IG1lc3NhZ2UuZXhjZXJwdCB9XG4gICAgICA8L2xpbnRlci1leGNlcnB0PnsnICd9XG4gICAgICB7IG1lc3NhZ2UucmVmZXJlbmNlICYmIG1lc3NhZ2UucmVmZXJlbmNlLmZpbGUgJiYgKFxuICAgICAgICA8YSBocmVmPVwiI1wiIG9uQ2xpY2s9eygpID0+IHZpc2l0TWVzc2FnZShtZXNzYWdlLCB0cnVlKX0+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaWNvbiBsaW50ZXItaWNvbiBpY29uLWFsaWdubWVudC1hbGlnbmVkLXRvXCIgLz5cbiAgICAgICAgPC9hPlxuICAgICAgKX1cbiAgICAgIHsgbWVzc2FnZS51cmwgJiYgPGEgaHJlZj1cIiNcIiBvbkNsaWNrPXsoKSA9PiBvcGVuRXh0ZXJuYWxseShtZXNzYWdlKX0+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImljb24gbGludGVyLWljb24gaWNvbi1saW5rXCIgLz5cbiAgICAgIDwvYT59XG4gICAgICB7IHRoaXMuc3RhdGUuZGVzY3JpcHRpb25TaG93ICYmIChcbiAgICAgICAgPGRpdiBkYW5nZXJvdXNseVNldElubmVySFRNTD17eyBfX2h0bWw6IHRoaXMuc3RhdGUuZGVzY3JpcHRpb24gfHwgJ0xvYWRpbmcuLi4nIH19IGNsYXNzTmFtZT1cImxpbnRlci1saW5lXCIgLz5cbiAgICAgICkgfVxuICAgIDwvbGludGVyLW1lc3NhZ2U+KVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTWVzc2FnZUVsZW1lbnRcbiJdfQ==