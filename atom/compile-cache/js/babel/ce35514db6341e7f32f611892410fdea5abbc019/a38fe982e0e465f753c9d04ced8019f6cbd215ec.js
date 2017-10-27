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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvcGFuZWwvY29tcG9uZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7cUJBRWtCLE9BQU87Ozs7NEJBQ0YsZ0JBQWdCOzs7O3VCQUM2RCxZQUFZOztJQUkxRyxjQUFjO1lBQWQsY0FBYzs7QUFPUCxXQVBQLGNBQWMsQ0FPTixLQUFhLEVBQUUsT0FBZ0IsRUFBRTswQkFQekMsY0FBYzs7QUFRaEIsK0JBUkUsY0FBYyw2Q0FRVixLQUFLLEVBQUUsT0FBTyxFQUFDOztTQVV2QixPQUFPLEdBQUcsVUFBQyxDQUFDLEVBQWMsR0FBRyxFQUFvQjtBQUMvQyxVQUFJLE9BQU8sQ0FBQyxRQUFRLEtBQUssUUFBUSxHQUFHLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLE9BQU8sRUFBRTtBQUN6RCxZQUFJLENBQUMsQ0FBQyxRQUFRLEVBQUU7QUFDZCx1Q0FBZSxHQUFHLENBQUMsQ0FBQTtTQUNwQixNQUFNO0FBQ0wscUNBQWEsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFBO1NBQ3hCO09BQ0YsTUFBTTtBQUNMLG1DQUFhLEdBQUcsQ0FBQyxDQUFBO09BQ2xCO0tBQ0Y7O0FBbkJDLFFBQUksQ0FBQyxLQUFLLEdBQUc7QUFDWCxjQUFRLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsZ0JBQWdCO0tBQy9DLENBQUE7R0FDRjs7ZUFaRyxjQUFjOztXQWFELDZCQUFHOzs7QUFDbEIsVUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsbUJBQW1CLENBQUMsVUFBQyxRQUFRLEVBQUs7QUFDcEQsY0FBSyxRQUFRLENBQUMsRUFBRSxRQUFRLEVBQVIsUUFBUSxFQUFFLENBQUMsQ0FBQTtPQUM1QixDQUFDLENBQUE7S0FDSDs7O1dBWUssa0JBQUc7VUFDQyxRQUFRLEdBQUssSUFBSSxDQUFDLEtBQUssQ0FBdkIsUUFBUTs7QUFDaEIsVUFBTSxPQUFP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Q0UsaUJBQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBQUEsT0FDckI7S0FDRjs7O1NBbkZHLGNBQWM7R0FBUyxtQkFBTSxTQUFTOztBQXNGNUMsTUFBTSxDQUFDLE9BQU8sR0FBRyxjQUFjLENBQUEiLCJmaWxlIjoiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2xpbnRlci11aS1kZWZhdWx0L2xpYi9wYW5lbC9jb21wb25lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgUmVhY3RUYWJsZSBmcm9tICdzYi1yZWFjdC10YWJsZSdcbmltcG9ydCB7ICRyYW5nZSwgc2V2ZXJpdHlOYW1lcywgc29ydE1lc3NhZ2VzLCB2aXNpdE1lc3NhZ2UsIG9wZW5FeHRlcm5hbGx5LCBnZXRQYXRoT2ZNZXNzYWdlIH0gZnJvbSAnLi4vaGVscGVycydcbmltcG9ydCB0eXBlIERlbGVnYXRlIGZyb20gJy4vZGVsZWdhdGUnXG5pbXBvcnQgdHlwZSB7IExpbnRlck1lc3NhZ2UgfSBmcm9tICcuLi90eXBlcydcblxuY2xhc3MgUGFuZWxDb21wb25lbnQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBwcm9wczoge1xuICAgIGRlbGVnYXRlOiBEZWxlZ2F0ZSxcbiAgfTtcbiAgc3RhdGU6IHtcbiAgICBtZXNzYWdlczogQXJyYXk8TGludGVyTWVzc2FnZT4sXG4gIH07XG4gIGNvbnN0cnVjdG9yKHByb3BzOiBPYmplY3QsIGNvbnRleHQ6ID9PYmplY3QpIHtcbiAgICBzdXBlcihwcm9wcywgY29udGV4dClcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgbWVzc2FnZXM6IHRoaXMucHJvcHMuZGVsZWdhdGUuZmlsdGVyZWRNZXNzYWdlcyxcbiAgICB9XG4gIH1cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5wcm9wcy5kZWxlZ2F0ZS5vbkRpZENoYW5nZU1lc3NhZ2VzKChtZXNzYWdlcykgPT4ge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7IG1lc3NhZ2VzIH0pXG4gICAgfSlcbiAgfVxuICBvbkNsaWNrID0gKGU6IE1vdXNlRXZlbnQsIHJvdzogTGludGVyTWVzc2FnZSkgPT4ge1xuICAgIGlmIChwcm9jZXNzLnBsYXRmb3JtID09PSAnZGFyd2luJyA/IGUubWV0YUtleSA6IGUuY3RybEtleSkge1xuICAgICAgaWYgKGUuc2hpZnRLZXkpIHtcbiAgICAgICAgb3BlbkV4dGVybmFsbHkocm93KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmlzaXRNZXNzYWdlKHJvdywgdHJ1ZSlcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdmlzaXRNZXNzYWdlKHJvdylcbiAgICB9XG4gIH1cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgZGVsZWdhdGUgfSA9IHRoaXMucHJvcHNcbiAgICBjb25zdCBjb2x1bW5zID0gW1xuICAgICAgeyBrZXk6ICdzZXZlcml0eScsIGxhYmVsOiAnU2V2ZXJpdHknLCBzb3J0YWJsZTogdHJ1ZSB9LFxuICAgICAgeyBrZXk6ICdsaW50ZXJOYW1lJywgbGFiZWw6ICdQcm92aWRlcicsIHNvcnRhYmxlOiB0cnVlIH0sXG4gICAgICB7IGtleTogJ2V4Y2VycHQnLCBsYWJlbDogJ0Rlc2NyaXB0aW9uJywgb25DbGljazogdGhpcy5vbkNsaWNrIH0sXG4gICAgICB7IGtleTogJ2xpbmUnLCBsYWJlbDogJ0xpbmUnLCBzb3J0YWJsZTogdHJ1ZSwgb25DbGljazogdGhpcy5vbkNsaWNrIH0sXG4gICAgXVxuICAgIGlmIChkZWxlZ2F0ZS5wYW5lbFJlcHJlc2VudHMgPT09ICdFbnRpcmUgUHJvamVjdCcpIHtcbiAgICAgIGNvbHVtbnMucHVzaCh7IGtleTogJ2ZpbGUnLCBsYWJlbDogJ0ZpbGUnLCBzb3J0YWJsZTogdHJ1ZSwgb25DbGljazogdGhpcy5vbkNsaWNrIH0pXG4gICAgfVxuXG4gICAgY29uc3QgY3VzdG9tU3R5bGU6IE9iamVjdCA9IHsgb3ZlcmZsb3dZOiAnc2Nyb2xsJywgaGVpZ2h0OiAnMTAwJScgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgaWQ9XCJsaW50ZXItcGFuZWxcIiB0YWJJbmRleD1cIi0xXCIgc3R5bGU9e2N1c3RvbVN0eWxlfT5cbiAgICAgICAgPFJlYWN0VGFibGVcbiAgICAgICAgICByb3dzPXt0aGlzLnN0YXRlLm1lc3NhZ2VzfVxuICAgICAgICAgIGNvbHVtbnM9e2NvbHVtbnN9XG5cbiAgICAgICAgICBpbml0aWFsU29ydD17W3sgY29sdW1uOiAnc2V2ZXJpdHknLCB0eXBlOiAnZGVzYycgfSwgeyBjb2x1bW46ICdmaWxlJywgdHlwZTogJ2FzYycgfSwgeyBjb2x1bW46ICdsaW5lJywgdHlwZTogJ2FzYycgfV19XG4gICAgICAgICAgc29ydD17c29ydE1lc3NhZ2VzfVxuICAgICAgICAgIHJvd0tleT17aSA9PiBpLmtleX1cblxuICAgICAgICAgIHJlbmRlckhlYWRlckNvbHVtbj17aSA9PiBpLmxhYmVsfVxuICAgICAgICAgIHJlbmRlckJvZHlDb2x1bW49e1BhbmVsQ29tcG9uZW50LnJlbmRlclJvd0NvbHVtbn1cblxuICAgICAgICAgIHN0eWxlPXt7IHdpZHRoOiAnMTAwJScgfX1cbiAgICAgICAgICBjbGFzc05hbWU9XCJsaW50ZXJcIlxuICAgICAgICAvPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG4gIHN0YXRpYyByZW5kZXJSb3dDb2x1bW4ocm93OiBMaW50ZXJNZXNzYWdlLCBjb2x1bW46IHN0cmluZyk6IHN0cmluZyB8IE9iamVjdCB7XG4gICAgY29uc3QgcmFuZ2UgPSAkcmFuZ2Uocm93KVxuXG4gICAgc3dpdGNoIChjb2x1bW4pIHtcbiAgICAgIGNhc2UgJ2ZpbGUnOlxuICAgICAgICByZXR1cm4gZ2V0UGF0aE9mTWVzc2FnZShyb3cpXG4gICAgICBjYXNlICdsaW5lJzpcbiAgICAgICAgcmV0dXJuIHJhbmdlID8gYCR7cmFuZ2Uuc3RhcnQucm93ICsgMX06JHtyYW5nZS5zdGFydC5jb2x1bW4gKyAxfWAgOiAnJ1xuICAgICAgY2FzZSAnZXhjZXJwdCc6XG4gICAgICAgIGlmIChyb3cudmVyc2lvbiA9PT0gMSkge1xuICAgICAgICAgIGlmIChyb3cuaHRtbCkge1xuICAgICAgICAgICAgcmV0dXJuIDxzcGFuIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXt7IF9faHRtbDogcm93Lmh0bWwgfX0gLz5cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHJvdy50ZXh0IHx8ICcnXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJvdy5leGNlcnB0XG4gICAgICBjYXNlICdzZXZlcml0eSc6XG4gICAgICAgIHJldHVybiBzZXZlcml0eU5hbWVzW3Jvdy5zZXZlcml0eV1cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiByb3dbY29sdW1uXVxuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFBhbmVsQ29tcG9uZW50XG4iXX0=