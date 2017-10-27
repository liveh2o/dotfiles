var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _sbReactTable = require('sb-react-table');

var _sbReactTable2 = _interopRequireDefault(_sbReactTable);

var _helpers = require('../helpers');

var PanelComponent = (function (_React$Component) {
  _inherits(PanelComponent, _React$Component);

  function PanelComponent(props, context) {
    _classCallCheck(this, PanelComponent);

    _get(Object.getPrototypeOf(PanelComponent.prototype), 'constructor', this).call(this, props, context);

    this.onClick = function (e, row) {
      if (e.target.tagName === 'A') {
        return;
      }
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

    this.state = {
      messages: this.props.delegate.filteredMessages
    };
  }

  _createClass(PanelComponent, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this = this;

      this.props.delegate.onDidChangeMessages(function (messages) {
        _this.setState({ messages: messages });
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

      var customStyle = { overflowY: 'scroll', height: '100%' };

      return _react2['default'].createElement(
        'div',
        { id: 'linter-panel', tabIndex: '-1', style: customStyle },
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvcGFuZWwvY29tcG9uZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7cUJBRWtCLE9BQU87Ozs7NEJBQ0YsZ0JBQWdCOzs7O3VCQUM2RCxZQUFZOztJQUkxRyxjQUFjO1lBQWQsY0FBYzs7QUFPUCxXQVBQLGNBQWMsQ0FPTixLQUFhLEVBQUUsT0FBZ0IsRUFBRTswQkFQekMsY0FBYzs7QUFRaEIsK0JBUkUsY0FBYyw2Q0FRVixLQUFLLEVBQUUsT0FBTyxFQUFDOztTQVV2QixPQUFPLEdBQUcsVUFBQyxDQUFDLEVBQWMsR0FBRyxFQUFvQjtBQUMvQyxVQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxLQUFLLEdBQUcsRUFBRTtBQUM1QixlQUFNO09BQ1A7QUFDRCxVQUFJLE9BQU8sQ0FBQyxRQUFRLEtBQUssUUFBUSxHQUFHLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLE9BQU8sRUFBRTtBQUN6RCxZQUFJLENBQUMsQ0FBQyxRQUFRLEVBQUU7QUFDZCx1Q0FBZSxHQUFHLENBQUMsQ0FBQTtTQUNwQixNQUFNO0FBQ0wscUNBQWEsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFBO1NBQ3hCO09BQ0YsTUFBTTtBQUNMLG1DQUFhLEdBQUcsQ0FBQyxDQUFBO09BQ2xCO0tBQ0Y7O0FBdEJDLFFBQUksQ0FBQyxLQUFLLEdBQUc7QUFDWCxjQUFRLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsZ0JBQWdCO0tBQy9DLENBQUE7R0FDRjs7ZUFaRyxjQUFjOztXQWFELDZCQUFHOzs7QUFDbEIsVUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsbUJBQW1CLENBQUMsVUFBQyxRQUFRLEVBQUs7QUFDcEQsY0FBSyxRQUFRLENBQUMsRUFBRSxRQUFRLEVBQVIsUUFBUSxFQUFFLENBQUMsQ0FBQTtPQUM1QixDQUFDLENBQUE7S0FDSDs7O1dB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LGFBQUssVUFBVTtBQUNiLGlCQUFPLHVCQUFjLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUFBLEFBQ3BDO0FBQ0UsaUJBQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBQUEsT0FDckI7S0FDRjs7O1NBdEZHLGNBQWM7R0FBUyxtQkFBTSxTQUFTOztBQXlGNUMsTUFBTSxDQUFDLE9BQU8sR0FBRyxjQUFjLENBQUEiLCJmaWxlIjoiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2xpbnRlci11aS1kZWZhdWx0L2xpYi9wYW5lbC9jb21wb25lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgUmVhY3RUYWJsZSBmcm9tICdzYi1yZWFjdC10YWJsZSdcbmltcG9ydCB7ICRyYW5nZSwgc2V2ZXJpdHlOYW1lcywgc29ydE1lc3NhZ2VzLCB2aXNpdE1lc3NhZ2UsIG9wZW5FeHRlcm5hbGx5LCBnZXRQYXRoT2ZNZXNzYWdlIH0gZnJvbSAnLi4vaGVscGVycydcbmltcG9ydCB0eXBlIERlbGVnYXRlIGZyb20gJy4vZGVsZWdhdGUnXG5pbXBvcnQgdHlwZSB7IExpbnRlck1lc3NhZ2UgfSBmcm9tICcuLi90eXBlcydcblxuY2xhc3MgUGFuZWxDb21wb25lbnQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBwcm9wczoge1xuICAgIGRlbGVnYXRlOiBEZWxlZ2F0ZSxcbiAgfTtcbiAgc3RhdGU6IHtcbiAgICBtZXNzYWdlczogQXJyYXk8TGludGVyTWVzc2FnZT4sXG4gIH07XG4gIGNvbnN0cnVjdG9yKHByb3BzOiBPYmplY3QsIGNvbnRleHQ6ID9PYmplY3QpIHtcbiAgICBzdXBlcihwcm9wcywgY29udGV4dClcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgbWVzc2FnZXM6IHRoaXMucHJvcHMuZGVsZWdhdGUuZmlsdGVyZWRNZXNzYWdlcyxcbiAgICB9XG4gIH1cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5wcm9wcy5kZWxlZ2F0ZS5vbkRpZENoYW5nZU1lc3NhZ2VzKChtZXNzYWdlcykgPT4ge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7IG1lc3NhZ2VzIH0pXG4gICAgfSlcbiAgfVxuICBvbkNsaWNrID0gKGU6IE1vdXNlRXZlbnQsIHJvdzogTGludGVyTWVzc2FnZSkgPT4ge1xuICAgIGlmIChlLnRhcmdldC50YWdOYW1lID09PSAnQScpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBpZiAocHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ2RhcndpbicgPyBlLm1ldGFLZXkgOiBlLmN0cmxLZXkpIHtcbiAgICAgIGlmIChlLnNoaWZ0S2V5KSB7XG4gICAgICAgIG9wZW5FeHRlcm5hbGx5KHJvdylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZpc2l0TWVzc2FnZShyb3csIHRydWUpXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHZpc2l0TWVzc2FnZShyb3cpXG4gICAgfVxuICB9XG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IGRlbGVnYXRlIH0gPSB0aGlzLnByb3BzXG4gICAgY29uc3QgY29sdW1ucyA9IFtcbiAgICAgIHsga2V5OiAnc2V2ZXJpdHknLCBsYWJlbDogJ1NldmVyaXR5Jywgc29ydGFibGU6IHRydWUgfSxcbiAgICAgIHsga2V5OiAnbGludGVyTmFtZScsIGxhYmVsOiAnUHJvdmlkZXInLCBzb3J0YWJsZTogdHJ1ZSB9LFxuICAgICAgeyBrZXk6ICdleGNlcnB0JywgbGFiZWw6ICdEZXNjcmlwdGlvbicsIG9uQ2xpY2s6IHRoaXMub25DbGljayB9LFxuICAgICAgeyBrZXk6ICdsaW5lJywgbGFiZWw6ICdMaW5lJywgc29ydGFibGU6IHRydWUsIG9uQ2xpY2s6IHRoaXMub25DbGljayB9LFxuICAgIF1cbiAgICBpZiAoZGVsZWdhdGUucGFuZWxSZXByZXNlbnRzID09PSAnRW50aXJlIFByb2plY3QnKSB7XG4gICAgICBjb2x1bW5zLnB1c2goeyBrZXk6ICdmaWxlJywgbGFiZWw6ICdGaWxlJywgc29ydGFibGU6IHRydWUsIG9uQ2xpY2s6IHRoaXMub25DbGljayB9KVxuICAgIH1cblxuICAgIGNvbnN0IGN1c3RvbVN0eWxlOiBPYmplY3QgPSB7IG92ZXJmbG93WTogJ3Njcm9sbCcsIGhlaWdodDogJzEwMCUnIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGlkPVwibGludGVyLXBhbmVsXCIgdGFiSW5kZXg9XCItMVwiIHN0eWxlPXtjdXN0b21TdHlsZX0+XG4gICAgICAgIDxSZWFjdFRhYmxlXG4gICAgICAgICAgcm93cz17dGhpcy5zdGF0ZS5tZXNzYWdlc31cbiAgICAgICAgICBjb2x1bW5zPXtjb2x1bW5zfVxuXG4gICAgICAgICAgaW5pdGlhbFNvcnQ9e1t7IGNvbHVtbjogJ3NldmVyaXR5JywgdHlwZTogJ2Rlc2MnIH0sIHsgY29sdW1uOiAnZmlsZScsIHR5cGU6ICdhc2MnIH0sIHsgY29sdW1uOiAnbGluZScsIHR5cGU6ICdhc2MnIH1dfVxuICAgICAgICAgIHNvcnQ9e3NvcnRNZXNzYWdlc31cbiAgICAgICAgICByb3dLZXk9e2kgPT4gaS5rZXl9XG5cbiAgICAgICAgICByZW5kZXJIZWFkZXJDb2x1bW49e2kgPT4gaS5sYWJlbH1cbiAgICAgICAgICByZW5kZXJCb2R5Q29sdW1uPXtQYW5lbENvbXBvbmVudC5yZW5kZXJSb3dDb2x1bW59XG5cbiAgICAgICAgICBzdHlsZT17eyB3aWR0aDogJzEwMCUnIH19XG4gICAgICAgICAgY2xhc3NOYW1lPVwibGludGVyXCJcbiAgICAgICAgLz5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuICBzdGF0aWMgcmVuZGVyUm93Q29sdW1uKHJvdzogTGludGVyTWVzc2FnZSwgY29sdW1uOiBzdHJpbmcpOiBzdHJpbmcgfCBPYmplY3Qge1xuICAgIGNvbnN0IHJhbmdlID0gJHJhbmdlKHJvdylcblxuICAgIHN3aXRjaCAoY29sdW1uKSB7XG4gICAgICBjYXNlICdmaWxlJzpcbiAgICAgICAgcmV0dXJuIGdldFBhdGhPZk1lc3NhZ2Uocm93KVxuICAgICAgY2FzZSAnbGluZSc6XG4gICAgICAgIHJldHVybiByYW5nZSA/IGAke3JhbmdlLnN0YXJ0LnJvdyArIDF9OiR7cmFuZ2Uuc3RhcnQuY29sdW1uICsgMX1gIDogJydcbiAgICAgIGNhc2UgJ2V4Y2VycHQnOlxuICAgICAgICBpZiAocm93LnZlcnNpb24gPT09IDEpIHtcbiAgICAgICAgICBpZiAocm93Lmh0bWwpIHtcbiAgICAgICAgICAgIHJldHVybiA8c3BhbiBkYW5nZXJvdXNseVNldElubmVySFRNTD17eyBfX2h0bWw6IHJvdy5odG1sIH19IC8+XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiByb3cudGV4dCB8fCAnJ1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByb3cuZXhjZXJwdFxuICAgICAgY2FzZSAnc2V2ZXJpdHknOlxuICAgICAgICByZXR1cm4gc2V2ZXJpdHlOYW1lc1tyb3cuc2V2ZXJpdHldXG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gcm93W2NvbHVtbl1cbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBQYW5lbENvbXBvbmVudFxuIl19