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

var _sbReactTable = require('sb-react-table');

var _sbReactTable2 = _interopRequireDefault(_sbReactTable);

var _reactResizableBox = require('react-resizable-box');

var _reactResizableBox2 = _interopRequireDefault(_reactResizableBox);

var _helpers = require('../helpers');

var PanelComponent = (function (_React$Component) {
  _inherits(PanelComponent, _React$Component);

  function PanelComponent() {
    var _this = this;

    _classCallCheck(this, PanelComponent);

    _get(Object.getPrototypeOf(PanelComponent.prototype), 'constructor', this).apply(this, arguments);

    this.state = {
      messages: [],
      visibility: false,
      tempHeight: null
    };

    this.onClick = function (e, row) {
      if (process.platform === 'darwin' ? e.metaKey : e.ctrlKey) {
        if (e.shiftKey) {
          (0, _helpers.openExternally)(row);
        } else {
          (0, _helpers.visitMessage)(row, true);
        }
      } else {
        (0, _helpers.visitMessage)(row);
      }
    };

    this.onResize = function (direction, size) {
      _this.setState({ tempHeight: size.height });
    };

    this.onResizeStop = function (direction, size) {
      _this.props.delegate.updatePanelHeight(size.height);
    };
  }

  _createClass(PanelComponent, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      this.props.delegate.onDidChangeMessages(function (messages) {
        _this2.setState({ messages: messages });
      });
      this.props.delegate.onDidChangeVisibility(function (visibility) {
        _this2.setState({ visibility: visibility });
      });
      this.props.delegate.onDidChangePanelConfig(function () {
        _this2.setState({ tempHeight: null });
      });
      this.setState({ messages: this.props.delegate.filteredMessages, visibility: this.props.delegate.visibility });
    }
  }, {
    key: 'render',
    value: function render() {
      var delegate = this.props.delegate;

      var columns = [{ key: 'severity', label: 'Severity', sortable: true }, { key: 'linterName', label: 'Provider', sortable: true }, { key: 'excerpt', label: 'Description' }, { key: 'line', label: 'Line', sortable: true, onClick: this.onClick }];
      if (delegate.panelRepresents === 'Entire Project') {
        columns.push({ key: 'file', label: 'File', sortable: true, onClick: this.onClick });
      }

      var height = undefined;
      var customStyle = { overflowY: 'scroll' };
      if (this.state.tempHeight) {
        height = this.state.tempHeight;
      } else if (delegate.panelTakesMinimumHeight) {
        height = 'auto';
        customStyle.maxHeight = delegate.panelHeight;
      } else {
        height = delegate.panelHeight;
      }
      delegate.setPanelVisibility(this.state.visibility && (!delegate.panelTakesMinimumHeight || !!this.state.messages.length));

      return _react2['default'].createElement(
        _reactResizableBox2['default'],
        { isResizable: { top: true }, onResize: this.onResize, onResizeStop: this.onResizeStop, height: height, width: 'auto', customStyle: customStyle },
        _react2['default'].createElement(
          'div',
          { id: 'linter-panel', tabIndex: '-1' },
          _react2['default'].createElement(_sbReactTable2['default'], {
            rows: this.state.messages,
            columns: columns,

            initialSort: [{ column: 'severity', type: 'desc' }, { column: 'file', type: 'asc' }, { column: 'line', type: 'asc' }],
            sort: _helpers.sortMessages,
            rowKey: function (i) {
              return i.key;
            },

            renderHeaderColumn: function (i) {
              return i.label;
            },
            renderBodyColumn: PanelComponent.renderRowColumn,

            style: { width: '100%' },
            className: 'linter'
          })
        )
      );
    }
  }], [{
    key: 'renderRowColumn',
    value: function renderRowColumn(row, column) {
      var range = (0, _helpers.$range)(row);

      switch (column) {
        case 'file':
          return (0, _helpers.getPathOfMessage)(row);
        case 'line':
          return range ? range.start.row + 1 + ':' + (range.start.column + 1) : '';
        case 'excerpt':
          if (row.version === 1) {
            if (row.html) {
              return _react2['default'].createElement('span', { dangerouslySetInnerHTML: { __html: row.html } });
            }
            return row.text || '';
          }
          return row.excerpt;
        case 'severity':
          return _helpers.severityNames[row.severity];
        default:
          return row[column];
      }
    }
  }]);

  return PanelComponent;
})(_react2['default'].Component);

exports['default'] = PanelComponent;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvcGFuZWwvY29tcG9uZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O3FCQUVrQixPQUFPOzs7OzRCQUNGLGdCQUFnQjs7OztpQ0FDZCxxQkFBcUI7Ozs7dUJBQ3NELFlBQVk7O0lBSTNGLGNBQWM7WUFBZCxjQUFjOztXQUFkLGNBQWM7OzswQkFBZCxjQUFjOzsrQkFBZCxjQUFjOztTQUlqQyxLQUFLLEdBSUQ7QUFDRixjQUFRLEVBQUUsRUFBRTtBQUNaLGdCQUFVLEVBQUUsS0FBSztBQUNqQixnQkFBVSxFQUFFLElBQUk7S0FDakI7O1NBYUQsT0FBTyxHQUFHLFVBQUMsQ0FBQyxFQUFjLEdBQUcsRUFBb0I7QUFDL0MsVUFBSSxPQUFPLENBQUMsUUFBUSxLQUFLLFFBQVEsR0FBRyxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQUU7QUFDekQsWUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFO0FBQ2QsdUNBQWUsR0FBRyxDQUFDLENBQUE7U0FDcEIsTUFBTTtBQUNMLHFDQUFhLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQTtTQUN4QjtPQUNGLE1BQU07QUFDTCxtQ0FBYSxHQUFHLENBQUMsQ0FBQTtPQUNsQjtLQUNGOztTQUNELFFBQVEsR0FBRyxVQUFDLFNBQVMsRUFBUyxJQUFJLEVBQXdDO0FBQ3hFLFlBQUssUUFBUSxDQUFDLEVBQUUsVUFBVSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFBO0tBQzNDOztTQUNELFlBQVksR0FBRyxVQUFDLFNBQVMsRUFBUyxJQUFJLEVBQXdDO0FBQzVFLFlBQUssS0FBSyxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUE7S0FDbkQ7OztlQXpDa0IsY0FBYzs7V0FhaEIsNkJBQUc7OztBQUNsQixVQUFJLENBQUMsS0FBSyxDQUFDLFFB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QkFBTywyQ0FBTSx1QkFBdUIsRUFBRSxFQUFFLE1BQU0sRUFBRSxHQUFHLENBQUMsSUFBSSxFQUFFLEFBQUMsR0FBRyxDQUFBO2FBQy9EO0FBQ0QsbUJBQU8sR0FBRyxDQUFDLElBQUksSUFBSSxFQUFFLENBQUE7V0FDdEI7QUFDRCxpQkFBTyxHQUFHLENBQUMsT0FBTyxDQUFBO0FBQUEsQUFDcEIsYUFBSyxVQUFVO0FBQ2IsaUJBQU8sdUJBQWMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQUEsQUFDcEM7QUFDRSxpQkFBTyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUE7QUFBQSxPQUNyQjtLQUNGOzs7U0E1R2tCLGNBQWM7R0FBUyxtQkFBTSxTQUFTOztxQkFBdEMsY0FBYyIsImZpbGUiOiIvVXNlcnMvYWgvLmF0b20vcGFja2FnZXMvbGludGVyLXVpLWRlZmF1bHQvbGliL3BhbmVsL2NvbXBvbmVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCBSZWFjdFRhYmxlIGZyb20gJ3NiLXJlYWN0LXRhYmxlJ1xuaW1wb3J0IFJlc2l6YWJsZUJveCBmcm9tICdyZWFjdC1yZXNpemFibGUtYm94J1xuaW1wb3J0IHsgJHJhbmdlLCBzZXZlcml0eU5hbWVzLCBzb3J0TWVzc2FnZXMsIHZpc2l0TWVzc2FnZSwgb3BlbkV4dGVybmFsbHksIGdldFBhdGhPZk1lc3NhZ2UgfSBmcm9tICcuLi9oZWxwZXJzJ1xuaW1wb3J0IHR5cGUgRGVsZWdhdGUgZnJvbSAnLi9kZWxlZ2F0ZSdcbmltcG9ydCB0eXBlIHsgTGludGVyTWVzc2FnZSB9IGZyb20gJy4uL3R5cGVzJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQYW5lbENvbXBvbmVudCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHByb3BzOiB7XG4gICAgZGVsZWdhdGU6IERlbGVnYXRlLFxuICB9O1xuICBzdGF0ZToge1xuICAgIG1lc3NhZ2VzOiBBcnJheTxMaW50ZXJNZXNzYWdlPixcbiAgICB2aXNpYmlsaXR5OiBib29sZWFuLFxuICAgIHRlbXBIZWlnaHQ6ID9udW1iZXIsXG4gIH0gPSB7XG4gICAgbWVzc2FnZXM6IFtdLFxuICAgIHZpc2liaWxpdHk6IGZhbHNlLFxuICAgIHRlbXBIZWlnaHQ6IG51bGwsXG4gIH07XG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMucHJvcHMuZGVsZWdhdGUub25EaWRDaGFuZ2VNZXNzYWdlcygobWVzc2FnZXMpID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBtZXNzYWdlcyB9KVxuICAgIH0pXG4gICAgdGhpcy5wcm9wcy5kZWxlZ2F0ZS5vbkRpZENoYW5nZVZpc2liaWxpdHkoKHZpc2liaWxpdHkpID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyB2aXNpYmlsaXR5IH0pXG4gICAgfSlcbiAgICB0aGlzLnByb3BzLmRlbGVnYXRlLm9uRGlkQ2hhbmdlUGFuZWxDb25maWcoKCkgPT4ge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7IHRlbXBIZWlnaHQ6IG51bGwgfSlcbiAgICB9KVxuICAgIHRoaXMuc2V0U3RhdGUoeyBtZXNzYWdlczogdGhpcy5wcm9wcy5kZWxlZ2F0ZS5maWx0ZXJlZE1lc3NhZ2VzLCB2aXNpYmlsaXR5OiB0aGlzLnByb3BzLmRlbGVnYXRlLnZpc2liaWxpdHkgfSlcbiAgfVxuICBvbkNsaWNrID0gKGU6IE1vdXNlRXZlbnQsIHJvdzogTGludGVyTWVzc2FnZSkgPT4ge1xuICAgIGlmIChwcm9jZXNzLnBsYXRmb3JtID09PSAnZGFyd2luJyA/IGUubWV0YUtleSA6IGUuY3RybEtleSkge1xuICAgICAgaWYgKGUuc2hpZnRLZXkpIHtcbiAgICAgICAgb3BlbkV4dGVybmFsbHkocm93KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmlzaXRNZXNzYWdlKHJvdywgdHJ1ZSlcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdmlzaXRNZXNzYWdlKHJvdylcbiAgICB9XG4gIH1cbiAgb25SZXNpemUgPSAoZGlyZWN0aW9uOiAndG9wJywgc2l6ZTogeyB3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlciB9KSA9PiB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IHRlbXBIZWlnaHQ6IHNpemUuaGVpZ2h0IH0pXG4gIH1cbiAgb25SZXNpemVTdG9wID0gKGRpcmVjdGlvbjogJ3RvcCcsIHNpemU6IHsgd2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIgfSkgPT4ge1xuICAgIHRoaXMucHJvcHMuZGVsZWdhdGUudXBkYXRlUGFuZWxIZWlnaHQoc2l6ZS5oZWlnaHQpXG4gIH1cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgZGVsZWdhdGUgfSA9IHRoaXMucHJvcHNcbiAgICBjb25zdCBjb2x1bW5zID0gW1xuICAgICAgeyBrZXk6ICdzZXZlcml0eScsIGxhYmVsOiAnU2V2ZXJpdHknLCBzb3J0YWJsZTogdHJ1ZSB9LFxuICAgICAgeyBrZXk6ICdsaW50ZXJOYW1lJywgbGFiZWw6ICdQcm92aWRlcicsIHNvcnRhYmxlOiB0cnVlIH0sXG4gICAgICB7IGtleTogJ2V4Y2VycHQnLCBsYWJlbDogJ0Rlc2NyaXB0aW9uJyB9LFxuICAgICAgeyBrZXk6ICdsaW5lJywgbGFiZWw6ICdMaW5lJywgc29ydGFibGU6IHRydWUsIG9uQ2xpY2s6IHRoaXMub25DbGljayB9LFxuICAgIF1cbiAgICBpZiAoZGVsZWdhdGUucGFuZWxSZXByZXNlbnRzID09PSAnRW50aXJlIFByb2plY3QnKSB7XG4gICAgICBjb2x1bW5zLnB1c2goeyBrZXk6ICdmaWxlJywgbGFiZWw6ICdGaWxlJywgc29ydGFibGU6IHRydWUsIG9uQ2xpY2s6IHRoaXMub25DbGljayB9KVxuICAgIH1cblxuICAgIGxldCBoZWlnaHRcbiAgICBjb25zdCBjdXN0b21TdHlsZTogT2JqZWN0ID0geyBvdmVyZmxvd1k6ICdzY3JvbGwnIH1cbiAgICBpZiAodGhpcy5zdGF0ZS50ZW1wSGVpZ2h0KSB7XG4gICAgICBoZWlnaHQgPSB0aGlzLnN0YXRlLnRlbXBIZWlnaHRcbiAgICB9IGVsc2UgaWYgKGRlbGVnYXRlLnBhbmVsVGFrZXNNaW5pbXVtSGVpZ2h0KSB7XG4gICAgICBoZWlnaHQgPSAnYXV0bydcbiAgICAgIGN1c3RvbVN0eWxlLm1heEhlaWdodCA9IGRlbGVnYXRlLnBhbmVsSGVpZ2h0XG4gICAgfSBlbHNlIHtcbiAgICAgIGhlaWdodCA9IGRlbGVnYXRlLnBhbmVsSGVpZ2h0XG4gICAgfVxuICAgIGRlbGVnYXRlLnNldFBhbmVsVmlzaWJpbGl0eSh0aGlzLnN0YXRlLnZpc2liaWxpdHkgJiYgKCFkZWxlZ2F0ZS5wYW5lbFRha2VzTWluaW11bUhlaWdodCB8fCAhIXRoaXMuc3RhdGUubWVzc2FnZXMubGVuZ3RoKSlcblxuICAgIHJldHVybiAoXG4gICAgICA8UmVzaXphYmxlQm94IGlzUmVzaXphYmxlPXt7IHRvcDogdHJ1ZSB9fSBvblJlc2l6ZT17dGhpcy5vblJlc2l6ZX0gb25SZXNpemVTdG9wPXt0aGlzLm9uUmVzaXplU3RvcH0gaGVpZ2h0PXtoZWlnaHR9IHdpZHRoPVwiYXV0b1wiIGN1c3RvbVN0eWxlPXtjdXN0b21TdHlsZX0+XG4gICAgICAgIDxkaXYgaWQ9XCJsaW50ZXItcGFuZWxcIiB0YWJJbmRleD1cIi0xXCI+XG4gICAgICAgICAgPFJlYWN0VGFibGVcbiAgICAgICAgICAgIHJvd3M9e3RoaXMuc3RhdGUubWVzc2FnZXN9XG4gICAgICAgICAgICBjb2x1bW5zPXtjb2x1bW5zfVxuXG4gICAgICAgICAgICBpbml0aWFsU29ydD17W3sgY29sdW1uOiAnc2V2ZXJpdHknLCB0eXBlOiAnZGVzYycgfSwgeyBjb2x1bW46ICdmaWxlJywgdHlwZTogJ2FzYycgfSwgeyBjb2x1bW46ICdsaW5lJywgdHlwZTogJ2FzYycgfV19XG4gICAgICAgICAgICBzb3J0PXtzb3J0TWVzc2FnZXN9XG4gICAgICAgICAgICByb3dLZXk9e2kgPT4gaS5rZXl9XG5cbiAgICAgICAgICAgIHJlbmRlckhlYWRlckNvbHVtbj17aSA9PiBpLmxhYmVsfVxuICAgICAgICAgICAgcmVuZGVyQm9keUNvbHVtbj17UGFuZWxDb21wb25lbnQucmVuZGVyUm93Q29sdW1ufVxuXG4gICAgICAgICAgICBzdHlsZT17eyB3aWR0aDogJzEwMCUnIH19XG4gICAgICAgICAgICBjbGFzc05hbWU9J2xpbnRlcidcbiAgICAgICAgICAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvUmVzaXphYmxlQm94PlxuICAgIClcbiAgfVxuICBzdGF0aWMgcmVuZGVyUm93Q29sdW1uKHJvdzogTGludGVyTWVzc2FnZSwgY29sdW1uOiBzdHJpbmcpOiBzdHJpbmcgfCBPYmplY3Qge1xuICAgIGNvbnN0IHJhbmdlID0gJHJhbmdlKHJvdylcblxuICAgIHN3aXRjaCAoY29sdW1uKSB7XG4gICAgICBjYXNlICdmaWxlJzpcbiAgICAgICAgcmV0dXJuIGdldFBhdGhPZk1lc3NhZ2Uocm93KVxuICAgICAgY2FzZSAnbGluZSc6XG4gICAgICAgIHJldHVybiByYW5nZSA/IGAke3JhbmdlLnN0YXJ0LnJvdyArIDF9OiR7cmFuZ2Uuc3RhcnQuY29sdW1uICsgMX1gIDogJydcbiAgICAgIGNhc2UgJ2V4Y2VycHQnOlxuICAgICAgICBpZiAocm93LnZlcnNpb24gPT09IDEpIHtcbiAgICAgICAgICBpZiAocm93Lmh0bWwpIHtcbiAgICAgICAgICAgIHJldHVybiA8c3BhbiBkYW5nZXJvdXNseVNldElubmVySFRNTD17eyBfX2h0bWw6IHJvdy5odG1sIH19IC8+XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiByb3cudGV4dCB8fCAnJ1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByb3cuZXhjZXJwdFxuICAgICAgY2FzZSAnc2V2ZXJpdHknOlxuICAgICAgICByZXR1cm4gc2V2ZXJpdHlOYW1lc1tyb3cuc2V2ZXJpdHldXG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gcm93W2NvbHVtbl1cbiAgICB9XG4gIH1cbn1cbiJdfQ==