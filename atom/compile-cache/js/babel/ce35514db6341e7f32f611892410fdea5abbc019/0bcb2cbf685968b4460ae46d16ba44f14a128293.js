var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _atom = require('atom');

var _component = require('./component');

var _component2 = _interopRequireDefault(_component);

var _helpers = require('../helpers');

var PanelDock = (function () {
  function PanelDock(delegate) {
    _classCallCheck(this, PanelDock);

    this.element = document.createElement('div');
    this.subscriptions = new _atom.CompositeDisposable();
    _reactDom2['default'].render(_react2['default'].createElement(_component2['default'], { delegate: delegate }), this.element);
  }

  _createClass(PanelDock, [{
    key: 'getURI',
    value: function getURI() {
      return _helpers.WORKSPACE_URI;
    }
  }, {
    key: 'getTitle',
    value: function getTitle() {
      return 'Linter';
    }
  }, {
    key: 'getDefaultLocation',
    value: function getDefaultLocation() {
      return 'bottom';
    }
  }, {
    key: 'getAllowedLocations',
    value: function getAllowedLocations() {
      return ['center', 'bottom', 'top'];
    }
  }, {
    key: 'getPreferredHeight',
    value: function getPreferredHeight() {
      return 100;
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
      var paneContainer = atom.workspace.paneContainerForItem(this);
      if (paneContainer) {
        paneContainer.paneForItem(this).destroyItem(this, true);
      }
    }
  }]);

  return PanelDock;
})();

module.exports = PanelDock;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvcGFuZWwvZG9jay5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7cUJBRWtCLE9BQU87Ozs7d0JBQ0osV0FBVzs7OztvQkFDSSxNQUFNOzt5QkFFcEIsYUFBYTs7Ozt1QkFDTCxZQUFZOztJQUVwQyxTQUFTO0FBSUYsV0FKUCxTQUFTLENBSUQsUUFBZ0IsRUFBRTswQkFKMUIsU0FBUzs7QUFLWCxRQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDNUMsUUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQTtBQUM5QywwQkFBUyxNQUFNLENBQUMsMkRBQVcsUUFBUSxFQUFFLFFBQVEsQUFBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0dBQ2pFOztlQVJHLFNBQVM7O1dBU1Asa0JBQUc7QUFDUCxvQ0FBb0I7S0FDckI7OztXQUNPLG9CQUFHO0FBQ1QsYUFBTyxRQUFRLENBQUE7S0FDaEI7OztXQUNpQiw4QkFBRztBQUNuQixhQUFPLFFBQVEsQ0FBQTtLQUNoQjs7O1dBQ2tCLCtCQUFHO0FBQ3BCLGFBQU8sQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFBO0tBQ25DOzs7V0FDaUIsOEJBQUc7QUFDbkIsYUFBTyxHQUFHLENBQUE7S0FDWDs7O1dBQ00sbUJBQUc7QUFDUixVQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQzVCLFVBQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDL0QsVUFBSSxhQUFhLEVBQUU7QUFDakIscUJBQWEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQTtPQUN4RDtLQUNGOzs7U0E5QkcsU0FBUzs7O0FBaUNmLE1BQU0sQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFBIiwiZmlsZSI6Ii9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvcGFuZWwvZG9jay5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20nXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcblxuaW1wb3J0IENvbXBvbmVudCBmcm9tICcuL2NvbXBvbmVudCdcbmltcG9ydCB7IFdPUktTUEFDRV9VUkkgfSBmcm9tICcuLi9oZWxwZXJzJ1xuXG5jbGFzcyBQYW5lbERvY2sge1xuICBlbGVtZW50OiBIVE1MRWxlbWVudDtcbiAgc3Vic2NyaXB0aW9uczogQ29tcG9zaXRlRGlzcG9zYWJsZTtcblxuICBjb25zdHJ1Y3RvcihkZWxlZ2F0ZTogT2JqZWN0KSB7XG4gICAgdGhpcy5lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgUmVhY3RET00ucmVuZGVyKDxDb21wb25lbnQgZGVsZWdhdGU9e2RlbGVnYXRlfSAvPiwgdGhpcy5lbGVtZW50KVxuICB9XG4gIGdldFVSSSgpIHtcbiAgICByZXR1cm4gV09SS1NQQUNFX1VSSVxuICB9XG4gIGdldFRpdGxlKCkge1xuICAgIHJldHVybiAnTGludGVyJ1xuICB9XG4gIGdldERlZmF1bHRMb2NhdGlvbigpIHtcbiAgICByZXR1cm4gJ2JvdHRvbSdcbiAgfVxuICBnZXRBbGxvd2VkTG9jYXRpb25zKCkge1xuICAgIHJldHVybiBbJ2NlbnRlcicsICdib3R0b20nLCAndG9wJ11cbiAgfVxuICBnZXRQcmVmZXJyZWRIZWlnaHQoKSB7XG4gICAgcmV0dXJuIDEwMFxuICB9XG4gIGRpc3Bvc2UoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgIGNvbnN0IHBhbmVDb250YWluZXIgPSBhdG9tLndvcmtzcGFjZS5wYW5lQ29udGFpbmVyRm9ySXRlbSh0aGlzKVxuICAgIGlmIChwYW5lQ29udGFpbmVyKSB7XG4gICAgICBwYW5lQ29udGFpbmVyLnBhbmVGb3JJdGVtKHRoaXMpLmRlc3Ryb3lJdGVtKHRoaXMsIHRydWUpXG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUGFuZWxEb2NrXG4iXX0=