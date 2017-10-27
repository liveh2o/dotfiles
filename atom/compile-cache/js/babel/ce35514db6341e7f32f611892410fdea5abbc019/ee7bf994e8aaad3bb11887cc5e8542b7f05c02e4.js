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

  function PanelComponent(props, context) {
    var _this = this;

    _classCallCheck(this, PanelComponent);

    _get(Object.getPrototypeOf(PanelComponent.prototype), 'constructor', this).call(this, props, context);

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

    this.state = {
      messages: this.props.delegate.filteredMessages,
      visibility: this.props.delegate.visibility,
      tempHeight: null
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
    }
  }, {
    key: 'render',
    value: function render() {
      var delegate = this.props.delegate;

      var columns = [{ key: 'severity', label: 'Severity', sortable: true }, { key: 'linterName', label: 'Provider', sortable: true }, { key: 'excerpt', label: 'Description', onClick: this.onClick }, { key: 'line', label: 'Line', sortable: true, onClick: this.onClick }];
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

module.exports = PanelComponent;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvcGFuZWwvY29tcG9uZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7cUJBRWtCLE9BQU87Ozs7NEJBQ0YsZ0JBQWdCOzs7O2lDQUNkLHFCQUFxQjs7Ozt1QkFDc0QsWUFBWTs7SUFJMUcsY0FBYztZQUFkLGNBQWM7O0FBU1AsV0FUUCxjQUFjLENBU04sS0FBYSxFQUFFLE9BQWdCLEVBQUU7OzswQkFUekMsY0FBYzs7QUFVaEIsK0JBVkUsY0FBYyw2Q0FVVixLQUFLLEVBQUUsT0FBTyxFQUFDOztTQWtCdkIsT0FBTyxHQUFHLFVBQUMsQ0FBQyxFQUFjLEdBQUcsRUFBb0I7QUFDL0MsVUFBSSxPQUFPLENBQUMsUUFBUSxLQUFLLFFBQVEsR0FBRyxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQUU7QUFDekQsWUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFO0FBQ2QsdUNBQWUsR0FBRyxDQUFDLENBQUE7U0FDcEIsTUFBTTtBQUNMLHFDQUFhLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQTtTQUN4QjtPQUNGLE1BQU07QUFDTCxtQ0FBYSxHQUFHLENBQUMsQ0FBQTtPQUNsQjtLQUNGOztTQUNELFFBQVEsR0FBRyxVQUFDLFNBQVMsRUFBUyxJQUFJLEVBQXdDO0FBQ3hFLFlBQUssUUFBUSxDQUFDLEVBQUUsVUFBVSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFBO0tBQzNDOztTQUNELFlBQVksR0FBRyxVQUFDLFNBQVMsRUFBUyxJQUFJLEVBQXdDO0FBQzVFLFlBQUssS0FBSyxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUE7S0FDbkQ7O0FBakNDLFFBQUksQ0FBQyxLQUFLLEdBQUc7QUFDWCxjQUFRLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsZ0JBQWdCO0FB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QUFJLEdBQUcsQ0FBQyxJQUFJLEVBQUU7QUFDWixxQkFBTywyQ0FBTSx1QkFBdUIsRUFBRSxFQUFFLE1BQU0sRUFBRSxHQUFHLENBQUMsSUFBSSxFQUFFLEFBQUMsR0FBRyxDQUFBO2FBQy9EO0FBQ0QsbUJBQU8sR0FBRyxDQUFDLElBQUksSUFBSSxFQUFFLENBQUE7V0FDdEI7QUFDRCxpQkFBTyxHQUFHLENBQUMsT0FBTyxDQUFBO0FBQUEsQUFDcEIsYUFBSyxVQUFVO0FBQ2IsaUJBQU8sdUJBQWMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQUEsQUFDcEM7QUFDRSxpQkFBTyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUE7QUFBQSxPQUNyQjtLQUNGOzs7U0EvR0csY0FBYztHQUFTLG1CQUFNLFNBQVM7O0FBa0g1QyxNQUFNLENBQUMsT0FBTyxHQUFHLGNBQWMsQ0FBQSIsImZpbGUiOiIvVXNlcnMvYWgvLmF0b20vcGFja2FnZXMvbGludGVyLXVpLWRlZmF1bHQvbGliL3BhbmVsL2NvbXBvbmVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCBSZWFjdFRhYmxlIGZyb20gJ3NiLXJlYWN0LXRhYmxlJ1xuaW1wb3J0IFJlc2l6YWJsZUJveCBmcm9tICdyZWFjdC1yZXNpemFibGUtYm94J1xuaW1wb3J0IHsgJHJhbmdlLCBzZXZlcml0eU5hbWVzLCBzb3J0TWVzc2FnZXMsIHZpc2l0TWVzc2FnZSwgb3BlbkV4dGVybmFsbHksIGdldFBhdGhPZk1lc3NhZ2UgfSBmcm9tICcuLi9oZWxwZXJzJ1xuaW1wb3J0IHR5cGUgRGVsZWdhdGUgZnJvbSAnLi9kZWxlZ2F0ZSdcbmltcG9ydCB0eXBlIHsgTGludGVyTWVzc2FnZSB9IGZyb20gJy4uL3R5cGVzJ1xuXG5jbGFzcyBQYW5lbENvbXBvbmVudCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHByb3BzOiB7XG4gICAgZGVsZWdhdGU6IERlbGVnYXRlLFxuICB9O1xuICBzdGF0ZToge1xuICAgIG1lc3NhZ2VzOiBBcnJheTxMaW50ZXJNZXNzYWdlPixcbiAgICB2aXNpYmlsaXR5OiBib29sZWFuLFxuICAgIHRlbXBIZWlnaHQ6ID9udW1iZXIsXG4gIH07XG4gIGNvbnN0cnVjdG9yKHByb3BzOiBPYmplY3QsIGNvbnRleHQ6ID9PYmplY3QpIHtcbiAgICBzdXBlcihwcm9wcywgY29udGV4dClcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgbWVzc2FnZXM6IHRoaXMucHJvcHMuZGVsZWdhdGUuZmlsdGVyZWRNZXNzYWdlcyxcbiAgICAgIHZpc2liaWxpdHk6IHRoaXMucHJvcHMuZGVsZWdhdGUudmlzaWJpbGl0eSxcbiAgICAgIHRlbXBIZWlnaHQ6IG51bGwsXG4gICAgfVxuICB9XG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMucHJvcHMuZGVsZWdhdGUub25EaWRDaGFuZ2VNZXNzYWdlcygobWVzc2FnZXMpID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBtZXNzYWdlcyB9KVxuICAgIH0pXG4gICAgdGhpcy5wcm9wcy5kZWxlZ2F0ZS5vbkRpZENoYW5nZVZpc2liaWxpdHkoKHZpc2liaWxpdHkpID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyB2aXNpYmlsaXR5IH0pXG4gICAgfSlcbiAgICB0aGlzLnByb3BzLmRlbGVnYXRlLm9uRGlkQ2hhbmdlUGFuZWxDb25maWcoKCkgPT4ge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7IHRlbXBIZWlnaHQ6IG51bGwgfSlcbiAgICB9KVxuICB9XG4gIG9uQ2xpY2sgPSAoZTogTW91c2VFdmVudCwgcm93OiBMaW50ZXJNZXNzYWdlKSA9PiB7XG4gICAgaWYgKHByb2Nlc3MucGxhdGZvcm0gPT09ICdkYXJ3aW4nID8gZS5tZXRhS2V5IDogZS5jdHJsS2V5KSB7XG4gICAgICBpZiAoZS5zaGlmdEtleSkge1xuICAgICAgICBvcGVuRXh0ZXJuYWxseShyb3cpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2aXNpdE1lc3NhZ2Uocm93LCB0cnVlKVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB2aXNpdE1lc3NhZ2Uocm93KVxuICAgIH1cbiAgfVxuICBvblJlc2l6ZSA9IChkaXJlY3Rpb246ICd0b3AnLCBzaXplOiB7IHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyIH0pID0+IHtcbiAgICB0aGlzLnNldFN0YXRlKHsgdGVtcEhlaWdodDogc2l6ZS5oZWlnaHQgfSlcbiAgfVxuICBvblJlc2l6ZVN0b3AgPSAoZGlyZWN0aW9uOiAndG9wJywgc2l6ZTogeyB3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlciB9KSA9PiB7XG4gICAgdGhpcy5wcm9wcy5kZWxlZ2F0ZS51cGRhdGVQYW5lbEhlaWdodChzaXplLmhlaWdodClcbiAgfVxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyBkZWxlZ2F0ZSB9ID0gdGhpcy5wcm9wc1xuICAgIGNvbnN0IGNvbHVtbnMgPSBbXG4gICAgICB7IGtleTogJ3NldmVyaXR5JywgbGFiZWw6ICdTZXZlcml0eScsIHNvcnRhYmxlOiB0cnVlIH0sXG4gICAgICB7IGtleTogJ2xpbnRlck5hbWUnLCBsYWJlbDogJ1Byb3ZpZGVyJywgc29ydGFibGU6IHRydWUgfSxcbiAgICAgIHsga2V5OiAnZXhjZXJwdCcsIGxhYmVsOiAnRGVzY3JpcHRpb24nLCBvbkNsaWNrOiB0aGlzLm9uQ2xpY2sgfSxcbiAgICAgIHsga2V5OiAnbGluZScsIGxhYmVsOiAnTGluZScsIHNvcnRhYmxlOiB0cnVlLCBvbkNsaWNrOiB0aGlzLm9uQ2xpY2sgfSxcbiAgICBdXG4gICAgaWYgKGRlbGVnYXRlLnBhbmVsUmVwcmVzZW50cyA9PT0gJ0VudGlyZSBQcm9qZWN0Jykge1xuICAgICAgY29sdW1ucy5wdXNoKHsga2V5OiAnZmlsZScsIGxhYmVsOiAnRmlsZScsIHNvcnRhYmxlOiB0cnVlLCBvbkNsaWNrOiB0aGlzLm9uQ2xpY2sgfSlcbiAgICB9XG5cbiAgICBsZXQgaGVpZ2h0XG4gICAgY29uc3QgY3VzdG9tU3R5bGU6IE9iamVjdCA9IHsgb3ZlcmZsb3dZOiAnc2Nyb2xsJyB9XG4gICAgaWYgKHRoaXMuc3RhdGUudGVtcEhlaWdodCkge1xuICAgICAgaGVpZ2h0ID0gdGhpcy5zdGF0ZS50ZW1wSGVpZ2h0XG4gICAgfSBlbHNlIGlmIChkZWxlZ2F0ZS5wYW5lbFRha2VzTWluaW11bUhlaWdodCkge1xuICAgICAgaGVpZ2h0ID0gJ2F1dG8nXG4gICAgICBjdXN0b21TdHlsZS5tYXhIZWlnaHQgPSBkZWxlZ2F0ZS5wYW5lbEhlaWdodFxuICAgIH0gZWxzZSB7XG4gICAgICBoZWlnaHQgPSBkZWxlZ2F0ZS5wYW5lbEhlaWdodFxuICAgIH1cbiAgICBkZWxlZ2F0ZS5zZXRQYW5lbFZpc2liaWxpdHkodGhpcy5zdGF0ZS52aXNpYmlsaXR5ICYmICghZGVsZWdhdGUucGFuZWxUYWtlc01pbmltdW1IZWlnaHQgfHwgISF0aGlzLnN0YXRlLm1lc3NhZ2VzLmxlbmd0aCkpXG5cbiAgICByZXR1cm4gKFxuICAgICAgPFJlc2l6YWJsZUJveCBpc1Jlc2l6YWJsZT17eyB0b3A6IHRydWUgfX0gb25SZXNpemU9e3RoaXMub25SZXNpemV9IG9uUmVzaXplU3RvcD17dGhpcy5vblJlc2l6ZVN0b3B9IGhlaWdodD17aGVpZ2h0fSB3aWR0aD1cImF1dG9cIiBjdXN0b21TdHlsZT17Y3VzdG9tU3R5bGV9PlxuICAgICAgICA8ZGl2IGlkPVwibGludGVyLXBhbmVsXCIgdGFiSW5kZXg9XCItMVwiPlxuICAgICAgICAgIDxSZWFjdFRhYmxlXG4gICAgICAgICAgICByb3dzPXt0aGlzLnN0YXRlLm1lc3NhZ2VzfVxuICAgICAgICAgICAgY29sdW1ucz17Y29sdW1uc31cblxuICAgICAgICAgICAgaW5pdGlhbFNvcnQ9e1t7IGNvbHVtbjogJ3NldmVyaXR5JywgdHlwZTogJ2Rlc2MnIH0sIHsgY29sdW1uOiAnZmlsZScsIHR5cGU6ICdhc2MnIH0sIHsgY29sdW1uOiAnbGluZScsIHR5cGU6ICdhc2MnIH1dfVxuICAgICAgICAgICAgc29ydD17c29ydE1lc3NhZ2VzfVxuICAgICAgICAgICAgcm93S2V5PXtpID0+IGkua2V5fVxuXG4gICAgICAgICAgICByZW5kZXJIZWFkZXJDb2x1bW49e2kgPT4gaS5sYWJlbH1cbiAgICAgICAgICAgIHJlbmRlckJvZHlDb2x1bW49e1BhbmVsQ29tcG9uZW50LnJlbmRlclJvd0NvbHVtbn1cblxuICAgICAgICAgICAgc3R5bGU9e3sgd2lkdGg6ICcxMDAlJyB9fVxuICAgICAgICAgICAgY2xhc3NOYW1lPVwibGludGVyXCJcbiAgICAgICAgICAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvUmVzaXphYmxlQm94PlxuICAgIClcbiAgfVxuICBzdGF0aWMgcmVuZGVyUm93Q29sdW1uKHJvdzogTGludGVyTWVzc2FnZSwgY29sdW1uOiBzdHJpbmcpOiBzdHJpbmcgfCBPYmplY3Qge1xuICAgIGNvbnN0IHJhbmdlID0gJHJhbmdlKHJvdylcblxuICAgIHN3aXRjaCAoY29sdW1uKSB7XG4gICAgICBjYXNlICdmaWxlJzpcbiAgICAgICAgcmV0dXJuIGdldFBhdGhPZk1lc3NhZ2Uocm93KVxuICAgICAgY2FzZSAnbGluZSc6XG4gICAgICAgIHJldHVybiByYW5nZSA/IGAke3JhbmdlLnN0YXJ0LnJvdyArIDF9OiR7cmFuZ2Uuc3RhcnQuY29sdW1uICsgMX1gIDogJydcbiAgICAgIGNhc2UgJ2V4Y2VycHQnOlxuICAgICAgICBpZiAocm93LnZlcnNpb24gPT09IDEpIHtcbiAgICAgICAgICBpZiAocm93Lmh0bWwpIHtcbiAgICAgICAgICAgIHJldHVybiA8c3BhbiBkYW5nZXJvdXNseVNldElubmVySFRNTD17eyBfX2h0bWw6IHJvdy5odG1sIH19IC8+XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiByb3cudGV4dCB8fCAnJ1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByb3cuZXhjZXJwdFxuICAgICAgY2FzZSAnc2V2ZXJpdHknOlxuICAgICAgICByZXR1cm4gc2V2ZXJpdHlOYW1lc1tyb3cuc2V2ZXJpdHldXG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gcm93W2NvbHVtbl1cbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBQYW5lbENvbXBvbmVudFxuIl19