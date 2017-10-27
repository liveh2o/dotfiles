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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvcGFuZWwvY29tcG9uZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O3FCQUVrQixPQUFPOzs7OzRCQUNGLGdCQUFnQjs7OztpQ0FDZCxxQkFBcUI7Ozs7dUJBQ3NELFlBQVk7O0lBSTNGLGNBQWM7WUFBZCxjQUFjOztBQVN0QixXQVRRLGNBQWMsQ0FTckIsS0FBYSxFQUFFLE9BQWdCLEVBQUU7OzswQkFUMUIsY0FBYzs7QUFVL0IsK0JBVmlCLGNBQWMsNkNBVXpCLEtBQUssRUFBRSxPQUFPLEVBQUM7O1NBa0J2QixPQUFPLEdBQUcsVUFBQyxDQUFDLEVBQWMsR0FBRyxFQUFvQjtBQUMvQyxVQUFJLE9BQU8sQ0FBQyxRQUFRLEtBQUssUUFBUSxHQUFHLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLE9BQU8sRUFBRTtBQUN6RCxZQUFJLENBQUMsQ0FBQyxRQUFRLEVBQUU7QUFDZCx1Q0FBZSxHQUFHLENBQUMsQ0FBQTtTQUNwQixNQUFNO0FBQ0wscUNBQWEsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFBO1NBQ3hCO09BQ0YsTUFBTTtBQUNMLG1DQUFhLEdBQUcsQ0FBQyxDQUFBO09BQ2xCO0tBQ0Y7O1NBQ0QsUUFBUSxHQUFHLFVBQUMsU0FBUyxFQUFTLElBQUksRUFBd0M7QUFDeEUsWUFBSyxRQUFRLENBQUMsRUFBRSxVQUFVLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUE7S0FDM0M7O1NBQ0QsWUFBWSxHQUFHLFVBQUMsU0FBUyxFQUFTLElBQUksRUFBd0M7QUFDNUUsWUFBSyxLQUFLLENBQUMsUUFBUSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQTtLQUNuRDs7QUFqQ0MsUUFBSSxDQUFDLEtBQUssR0FBRztBQUNYLGNBQVEsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0I7QUFDOUMsZ0JBQVUsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxVQUFVO0FBQzFDLGdCQUFVLEVBQUUsSUFBSTtLQUNqQixDQUFBO0dBQ0Y7O2VBaEJrQixjQUFjOztXQWlCaEIsNkJBQUc7OztBQUNsQixVQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxVQUFDLFFBQVEsRUFBSztBQUNwRCxlQUFLLFFBQVEsQ0FBQyxFQUFFLFFBQVEsRUFBUixRQUFRLEVBQUUsQ0FBQyxDQUFBO09BQzVCLENBQUMsQ0FBQTtBQUNGLFVBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLHFCQUFxQixDQUFDLFVBQUMsVUFBVSxFQUFLO0FBQ3hELGVBQUssUUFBUSxDQUFDLEVBQUUsVUFBVSxFQUFWLFVBQVUsRUFBRSxDQUFDLENBQUE7T0FDOUIsQ0FBQyxDQUFBO0FBQ0YsVUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsc0JBQXNCLENBQUMsWUFBTTtBQUMvQyxlQUFLLFFBQVEsQ0FBQyxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFBO09BQ3BDLENBQUMsQ0FBQTtLQUNIOzs7V0FrQkssa0JBQUc7VUFDQyxRQUFRLEdBQUssSUFBSSxDQUFDLEtBQUssQ0FBdkIsUUFBUTs7QUFDaEIsVUFBTSxPQUFPLEdBQUcsQ0FDZCxFQUFFLEdBQUcsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLEVBQ3RELEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsRUFDeEQsRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxhQUFhLEVBQUUsRUFDeEMsRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUN0RSxDQUFBO0FBQ0QsVUFBSSxRQUFRLENBQUMsZUFBZSxLQUFLLGdCQUFnQixFQUFFO0FBQ2pELGVBQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUE7T0FDcEY7O0FBRUQsVUFBSSxNQUFNLFlBQUEsQ0FBQTtBQUNWLFVBQU0sV0FBbUIsR0FBRyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsQ0FBQTtBQUNuRCxVQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFO0FBQ3pCLGNBQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQTtPQUMvQixNQUFNLElBQUksUUFBUSxDQUFDLHVCQUF1QixFQUFFO0FBQzNDLGNBQU0sR0FBRyxNQUFNLENBQUE7QUFDZixtQkFBVyxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUMsV0FBVyxDQUFBO09BQzdDLE1BQU07QUFDTCxjQUFNLEdBQUcsUUFBUSxDQUFDLFdBQVcsQ0FBQTtPQUM5QjtBQUNELGNBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsS0FBSyxDQUFDLFFBQVEsQ0FBQyx1QkFBdUIsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFBLEFBQUMsQ0FBQyxDQUFBOztBQUV6SCxhQUNFOztVQUFjLFdBQVcsRUFBRSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsQUFBQyxFQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUSxBQUFDLEVBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxZQUFZLEFBQUMsRUFBQyxNQUFNLEVBQUUsTUFBTSxBQUFDLEVBQUMsS0FBSyxFQUFDLE1BQU0sRUFBQyxXQUFXLEVBQUUsV0FBVyxBQUFDO1FBQ3hKOztZQUFLLEVBQUUsRUFBQyxjQUFjLEVBQUMsUUFBUSxFQUFDLElBQUk7VUFDbEM7QUFDRSxnQkFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxBQUFDO0FBQzFCLG1CQUFPLEVBQUUsT0FBTyxBQUFDOztBQUVqQix1QkFBVyxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUMsQUFBQztBQUN0SCxnQkFBSSx1QkFBZTtBQUNuQixrQkFBTSxFQUFFLFVBQUEsQ0FBQztxQkFBSSxDQUFDLENBQUMsR0FBRzthQUFBLEFBQUM7O0FBRW5CLDhCQUFrQixFQUFFLFVBQUEsQ0FBQztxQkFBSSxDQUFDLENBQUMsS0FBSzthQUFBLEFBQUM7QUFDakMsNEJBQWdCLEVBQUUsY0FBYyxDQUFDLGVBQWUsQUFBQzs7QUFFakQsaUJBQUssRUFBRSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsQUFBQztBQUN6QixxQkFBUyxFQUFDLFFBQVE7WUFDbEI7U0FDRTtPQUNPLENBQ2hCO0tBQ0Y7OztXQUNxQix5QkFBQyxHQUFrQixFQUFFLE1BQWMsRUFBbUI7QUFDMUUsVUFBTSxLQUFLLEdBQUcscUJBQU8sR0FBRyxDQUFDLENBQUE7O0FBRXpCLGNBQVEsTUFBTTtBQUNaLGFBQUssTUFBTTtBQUNULGlCQUFPLCtCQUFpQixHQUFHLENBQUMsQ0FBQTtBQUFBLEFBQzlCLGFBQUssTUFBTTtBQUNULGlCQUFPLEtBQUssR0FBTSxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFDLFVBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFBLEdBQUssRUFBRSxDQUFBO0FBQUEsQUFDeEUsYUFBSyxTQUFTO0FBQ1osY0FBSSxHQUFHLENBQUMsT0FBTyxLQUFLLENBQUMsRUFBRTtBQUNyQixnQkFBSSxHQUFHLENBQUMsSUFBSSxFQUFFO0FBQ1oscUJBQU8sMkNBQU0sdUJBQXVCLEVBQUUsRUFBRSxNQUFNLEVBQUUsR0FBRyxDQUFDLElBQUksRUFBRSxBQUFDLEdBQUcsQ0FBQTthQUMvRDtBQUNELG1CQUFPLEdBQUcsQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFBO1dBQ3RCO0FBQ0QsaUJBQU8sR0FBRyxDQUFDLE9BQU8sQ0FBQTtBQUFBLEFBQ3BCLGFBQUssVUFBVTtBQUNiLGlCQUFPLHVCQUFjLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUFBLEFBQ3BDO0FBQ0UsaUJBQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBQUEsT0FDckI7S0FDRjs7O1NBL0drQixjQUFjO0dBQVMsbUJBQU0sU0FBUzs7cUJBQXRDLGNBQWMiLCJmaWxlIjoiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2xpbnRlci11aS1kZWZhdWx0L2xpYi9wYW5lbC9jb21wb25lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgUmVhY3RUYWJsZSBmcm9tICdzYi1yZWFjdC10YWJsZSdcbmltcG9ydCBSZXNpemFibGVCb3ggZnJvbSAncmVhY3QtcmVzaXphYmxlLWJveCdcbmltcG9ydCB7ICRyYW5nZSwgc2V2ZXJpdHlOYW1lcywgc29ydE1lc3NhZ2VzLCB2aXNpdE1lc3NhZ2UsIG9wZW5FeHRlcm5hbGx5LCBnZXRQYXRoT2ZNZXNzYWdlIH0gZnJvbSAnLi4vaGVscGVycydcbmltcG9ydCB0eXBlIERlbGVnYXRlIGZyb20gJy4vZGVsZWdhdGUnXG5pbXBvcnQgdHlwZSB7IExpbnRlck1lc3NhZ2UgfSBmcm9tICcuLi90eXBlcydcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGFuZWxDb21wb25lbnQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBwcm9wczoge1xuICAgIGRlbGVnYXRlOiBEZWxlZ2F0ZSxcbiAgfTtcbiAgc3RhdGU6IHtcbiAgICBtZXNzYWdlczogQXJyYXk8TGludGVyTWVzc2FnZT4sXG4gICAgdmlzaWJpbGl0eTogYm9vbGVhbixcbiAgICB0ZW1wSGVpZ2h0OiA/bnVtYmVyLFxuICB9O1xuICBjb25zdHJ1Y3Rvcihwcm9wczogT2JqZWN0LCBjb250ZXh0OiA/T2JqZWN0KSB7XG4gICAgc3VwZXIocHJvcHMsIGNvbnRleHQpXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIG1lc3NhZ2VzOiB0aGlzLnByb3BzLmRlbGVnYXRlLmZpbHRlcmVkTWVzc2FnZXMsXG4gICAgICB2aXNpYmlsaXR5OiB0aGlzLnByb3BzLmRlbGVnYXRlLnZpc2liaWxpdHksXG4gICAgICB0ZW1wSGVpZ2h0OiBudWxsLFxuICAgIH1cbiAgfVxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLnByb3BzLmRlbGVnYXRlLm9uRGlkQ2hhbmdlTWVzc2FnZXMoKG1lc3NhZ2VzKSA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHsgbWVzc2FnZXMgfSlcbiAgICB9KVxuICAgIHRoaXMucHJvcHMuZGVsZWdhdGUub25EaWRDaGFuZ2VWaXNpYmlsaXR5KCh2aXNpYmlsaXR5KSA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHsgdmlzaWJpbGl0eSB9KVxuICAgIH0pXG4gICAgdGhpcy5wcm9wcy5kZWxlZ2F0ZS5vbkRpZENoYW5nZVBhbmVsQ29uZmlnKCgpID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyB0ZW1wSGVpZ2h0OiBudWxsIH0pXG4gICAgfSlcbiAgfVxuICBvbkNsaWNrID0gKGU6IE1vdXNlRXZlbnQsIHJvdzogTGludGVyTWVzc2FnZSkgPT4ge1xuICAgIGlmIChwcm9jZXNzLnBsYXRmb3JtID09PSAnZGFyd2luJyA/IGUubWV0YUtleSA6IGUuY3RybEtleSkge1xuICAgICAgaWYgKGUuc2hpZnRLZXkpIHtcbiAgICAgICAgb3BlbkV4dGVybmFsbHkocm93KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmlzaXRNZXNzYWdlKHJvdywgdHJ1ZSlcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdmlzaXRNZXNzYWdlKHJvdylcbiAgICB9XG4gIH1cbiAgb25SZXNpemUgPSAoZGlyZWN0aW9uOiAndG9wJywgc2l6ZTogeyB3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlciB9KSA9PiB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IHRlbXBIZWlnaHQ6IHNpemUuaGVpZ2h0IH0pXG4gIH1cbiAgb25SZXNpemVTdG9wID0gKGRpcmVjdGlvbjogJ3RvcCcsIHNpemU6IHsgd2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIgfSkgPT4ge1xuICAgIHRoaXMucHJvcHMuZGVsZWdhdGUudXBkYXRlUGFuZWxIZWlnaHQoc2l6ZS5oZWlnaHQpXG4gIH1cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgZGVsZWdhdGUgfSA9IHRoaXMucHJvcHNcbiAgICBjb25zdCBjb2x1bW5zID0gW1xuICAgICAgeyBrZXk6ICdzZXZlcml0eScsIGxhYmVsOiAnU2V2ZXJpdHknLCBzb3J0YWJsZTogdHJ1ZSB9LFxuICAgICAgeyBrZXk6ICdsaW50ZXJOYW1lJywgbGFiZWw6ICdQcm92aWRlcicsIHNvcnRhYmxlOiB0cnVlIH0sXG4gICAgICB7IGtleTogJ2V4Y2VycHQnLCBsYWJlbDogJ0Rlc2NyaXB0aW9uJyB9LFxuICAgICAgeyBrZXk6ICdsaW5lJywgbGFiZWw6ICdMaW5lJywgc29ydGFibGU6IHRydWUsIG9uQ2xpY2s6IHRoaXMub25DbGljayB9LFxuICAgIF1cbiAgICBpZiAoZGVsZWdhdGUucGFuZWxSZXByZXNlbnRzID09PSAnRW50aXJlIFByb2plY3QnKSB7XG4gICAgICBjb2x1bW5zLnB1c2goeyBrZXk6ICdmaWxlJywgbGFiZWw6ICdGaWxlJywgc29ydGFibGU6IHRydWUsIG9uQ2xpY2s6IHRoaXMub25DbGljayB9KVxuICAgIH1cblxuICAgIGxldCBoZWlnaHRcbiAgICBjb25zdCBjdXN0b21TdHlsZTogT2JqZWN0ID0geyBvdmVyZmxvd1k6ICdzY3JvbGwnIH1cbiAgICBpZiAodGhpcy5zdGF0ZS50ZW1wSGVpZ2h0KSB7XG4gICAgICBoZWlnaHQgPSB0aGlzLnN0YXRlLnRlbXBIZWlnaHRcbiAgICB9IGVsc2UgaWYgKGRlbGVnYXRlLnBhbmVsVGFrZXNNaW5pbXVtSGVpZ2h0KSB7XG4gICAgICBoZWlnaHQgPSAnYXV0bydcbiAgICAgIGN1c3RvbVN0eWxlLm1heEhlaWdodCA9IGRlbGVnYXRlLnBhbmVsSGVpZ2h0XG4gICAgfSBlbHNlIHtcbiAgICAgIGhlaWdodCA9IGRlbGVnYXRlLnBhbmVsSGVpZ2h0XG4gICAgfVxuICAgIGRlbGVnYXRlLnNldFBhbmVsVmlzaWJpbGl0eSh0aGlzLnN0YXRlLnZpc2liaWxpdHkgJiYgKCFkZWxlZ2F0ZS5wYW5lbFRha2VzTWluaW11bUhlaWdodCB8fCAhIXRoaXMuc3RhdGUubWVzc2FnZXMubGVuZ3RoKSlcblxuICAgIHJldHVybiAoXG4gICAgICA8UmVzaXphYmxlQm94IGlzUmVzaXphYmxlPXt7IHRvcDogdHJ1ZSB9fSBvblJlc2l6ZT17dGhpcy5vblJlc2l6ZX0gb25SZXNpemVTdG9wPXt0aGlzLm9uUmVzaXplU3RvcH0gaGVpZ2h0PXtoZWlnaHR9IHdpZHRoPVwiYXV0b1wiIGN1c3RvbVN0eWxlPXtjdXN0b21TdHlsZX0+XG4gICAgICAgIDxkaXYgaWQ9XCJsaW50ZXItcGFuZWxcIiB0YWJJbmRleD1cIi0xXCI+XG4gICAgICAgICAgPFJlYWN0VGFibGVcbiAgICAgICAgICAgIHJvd3M9e3RoaXMuc3RhdGUubWVzc2FnZXN9XG4gICAgICAgICAgICBjb2x1bW5zPXtjb2x1bW5zfVxuXG4gICAgICAgICAgICBpbml0aWFsU29ydD17W3sgY29sdW1uOiAnc2V2ZXJpdHknLCB0eXBlOiAnZGVzYycgfSwgeyBjb2x1bW46ICdmaWxlJywgdHlwZTogJ2FzYycgfSwgeyBjb2x1bW46ICdsaW5lJywgdHlwZTogJ2FzYycgfV19XG4gICAgICAgICAgICBzb3J0PXtzb3J0TWVzc2FnZXN9XG4gICAgICAgICAgICByb3dLZXk9e2kgPT4gaS5rZXl9XG5cbiAgICAgICAgICAgIHJlbmRlckhlYWRlckNvbHVtbj17aSA9PiBpLmxhYmVsfVxuICAgICAgICAgICAgcmVuZGVyQm9keUNvbHVtbj17UGFuZWxDb21wb25lbnQucmVuZGVyUm93Q29sdW1ufVxuXG4gICAgICAgICAgICBzdHlsZT17eyB3aWR0aDogJzEwMCUnIH19XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJsaW50ZXJcIlxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9SZXNpemFibGVCb3g+XG4gICAgKVxuICB9XG4gIHN0YXRpYyByZW5kZXJSb3dDb2x1bW4ocm93OiBMaW50ZXJNZXNzYWdlLCBjb2x1bW46IHN0cmluZyk6IHN0cmluZyB8IE9iamVjdCB7XG4gICAgY29uc3QgcmFuZ2UgPSAkcmFuZ2Uocm93KVxuXG4gICAgc3dpdGNoIChjb2x1bW4pIHtcbiAgICAgIGNhc2UgJ2ZpbGUnOlxuICAgICAgICByZXR1cm4gZ2V0UGF0aE9mTWVzc2FnZShyb3cpXG4gICAgICBjYXNlICdsaW5lJzpcbiAgICAgICAgcmV0dXJuIHJhbmdlID8gYCR7cmFuZ2Uuc3RhcnQucm93ICsgMX06JHtyYW5nZS5zdGFydC5jb2x1bW4gKyAxfWAgOiAnJ1xuICAgICAgY2FzZSAnZXhjZXJwdCc6XG4gICAgICAgIGlmIChyb3cudmVyc2lvbiA9PT0gMSkge1xuICAgICAgICAgIGlmIChyb3cuaHRtbCkge1xuICAgICAgICAgICAgcmV0dXJuIDxzcGFuIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXt7IF9faHRtbDogcm93Lmh0bWwgfX0gLz5cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHJvdy50ZXh0IHx8ICcnXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJvdy5leGNlcnB0XG4gICAgICBjYXNlICdzZXZlcml0eSc6XG4gICAgICAgIHJldHVybiBzZXZlcml0eU5hbWVzW3Jvdy5zZXZlcml0eV1cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiByb3dbY29sdW1uXVxuICAgIH1cbiAgfVxufVxuIl19