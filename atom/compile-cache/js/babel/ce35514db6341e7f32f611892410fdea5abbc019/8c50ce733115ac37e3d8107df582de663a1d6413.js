Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/** @jsx etch.dom */

var _etch = require('etch');

var _etch2 = _interopRequireDefault(_etch);

var _etchStateless = require('etch-stateless');

var _etchStateless2 = _interopRequireDefault(_etchStateless);

'use babel';

var IndicatorAnchor = (0, _etchStateless2['default'])(_etch2['default'], function (_ref) {
  var onclick = _ref.onclick;
  var wrapped = _ref.wrapped;

  var classes = 'soft-wrap-indicator';
  if (wrapped) {
    classes += ' lit';
  }

  return _etch2['default'].dom(
    'a',
    { className: classes, onclick: onclick, href: '#' },
    'Wrap'
  );
});

/**
 * Handles the UI for the status bar element.
 */

var SoftWrapStatusComponent = (function () {
  /**
   * Public: Initializes the component.
   *
   * @param {SoftWrapStatus} model Model that handles the logic behind the component.
   */

  function SoftWrapStatusComponent(model) {
    _classCallCheck(this, SoftWrapStatusComponent);

    this.model = model;

    _etch2['default'].initialize(this);
  }

  /**
   * Public: Draws the component.
   *
   * @return {HTMLElement} HTML of the component.
   */

  _createClass(SoftWrapStatusComponent, [{
    key: 'render',
    value: function render() {
      return _etch2['default'].dom(
        'div',
        { className: 'soft-wrap-status-component inline-block' },
        this.renderIndicator()
      );
    }

    /**
     * Public: Updates the state of the component before being redrawn.
     *
     * @return {Promise} Resolved when the component is done updating.
     */
  }, {
    key: 'update',
    value: function update() {
      return _etch2['default'].update(this);
    }

    /**
     * Public: Destroys the component.
     */
  }, {
    key: 'destroy',
    value: function destroy() {
      _etch2['default'].destroy(this);
    }

    /**
     * Private: Draws the clickable indicator, if necessary.
     *
     * @return {HTMLElement} HTML of the clickable indicator.
     */
  }, {
    key: 'renderIndicator',
    value: function renderIndicator() {
      if (this.model.shouldRenderIndicator()) {
        return _etch2['default'].dom(IndicatorAnchor, { onclick: this.model.toggleSoftWrapped.bind(this.model),
          wrapped: this.model.shouldBeLit() });
      }
    }
  }]);

  return SoftWrapStatusComponent;
})();

exports['default'] = SoftWrapStatusComponent;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9zb2Z0LXdyYXAtaW5kaWNhdG9yL2xpYi9zb2Z0LXdyYXAtc3RhdHVzLWNvbXBvbmVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7b0JBR2lCLE1BQU07Ozs7NkJBQ0QsZ0JBQWdCOzs7O0FBSnRDLFdBQVcsQ0FBQTs7QUFNWCxJQUFNLGVBQWUsR0FBRyxtREFBZ0IsVUFBQyxJQUFrQixFQUFLO01BQXRCLE9BQU8sR0FBUixJQUFrQixDQUFqQixPQUFPO01BQUUsT0FBTyxHQUFqQixJQUFrQixDQUFSLE9BQU87O0FBQ3hELE1BQUksT0FBTyxHQUFHLHFCQUFxQixDQUFBO0FBQ25DLE1BQUksT0FBTyxFQUFFO0FBQ1gsV0FBTyxJQUFJLE1BQU0sQ0FBQTtHQUNsQjs7QUFFRCxTQUFPOztNQUFHLFNBQVMsRUFBRSxPQUFPLEFBQUMsRUFBQyxPQUFPLEVBQUUsT0FBTyxBQUFDLEVBQUMsSUFBSSxFQUFDLEdBQUc7O0dBQVMsQ0FBQTtDQUNsRSxDQUFDLENBQUE7Ozs7OztJQUttQix1QkFBdUI7Ozs7Ozs7QUFNOUIsV0FOTyx1QkFBdUIsQ0FNN0IsS0FBSyxFQUFFOzBCQU5ELHVCQUF1Qjs7QUFPeEMsUUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUE7O0FBRWxCLHNCQUFLLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQTtHQUN0Qjs7Ozs7Ozs7ZUFWa0IsdUJBQXVCOztXQWlCbkMsa0JBQUc7QUFDUixhQUNFOztVQUFLLFNBQVMsRUFBQyx5Q0FBeUM7UUFDckQsSUFBSSxDQUFDLGVBQWUsRUFBRTtPQUNuQixDQUNQO0tBQ0Y7Ozs7Ozs7OztXQU9NLGtCQUFHO0FBQ1IsYUFBTyxrQkFBSyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUE7S0FDekI7Ozs7Ozs7V0FLTyxtQkFBRztBQUNULHdCQUFLLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtLQUNuQjs7Ozs7Ozs7O1dBT2UsMkJBQUc7QUFDakIsVUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLHFCQUFxQixFQUFFLEVBQUU7QUFDdEMsZUFDRSxzQkFBQyxlQUFlLElBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQUFBQztBQUN2RCxpQkFBTyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLEFBQUMsR0FBRyxDQUN2RDtPQUNGO0tBQ0Y7OztTQXJEa0IsdUJBQXVCOzs7cUJBQXZCLHVCQUF1QiIsImZpbGUiOiIvVXNlcnMvYWgvLmF0b20vcGFja2FnZXMvc29mdC13cmFwLWluZGljYXRvci9saWIvc29mdC13cmFwLXN0YXR1cy1jb21wb25lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuLyoqIEBqc3ggZXRjaC5kb20gKi9cblxuaW1wb3J0IGV0Y2ggZnJvbSAnZXRjaCdcbmltcG9ydCBzdGF0ZWxlc3MgZnJvbSAnZXRjaC1zdGF0ZWxlc3MnXG5cbmNvbnN0IEluZGljYXRvckFuY2hvciA9IHN0YXRlbGVzcyhldGNoLCAoe29uY2xpY2ssIHdyYXBwZWR9KSA9PiB7XG4gIGxldCBjbGFzc2VzID0gJ3NvZnQtd3JhcC1pbmRpY2F0b3InXG4gIGlmICh3cmFwcGVkKSB7XG4gICAgY2xhc3NlcyArPSAnIGxpdCdcbiAgfVxuXG4gIHJldHVybiA8YSBjbGFzc05hbWU9e2NsYXNzZXN9IG9uY2xpY2s9e29uY2xpY2t9IGhyZWY9XCIjXCI+V3JhcDwvYT5cbn0pXG5cbi8qKlxuICogSGFuZGxlcyB0aGUgVUkgZm9yIHRoZSBzdGF0dXMgYmFyIGVsZW1lbnQuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNvZnRXcmFwU3RhdHVzQ29tcG9uZW50IHtcbiAgLyoqXG4gICAqIFB1YmxpYzogSW5pdGlhbGl6ZXMgdGhlIGNvbXBvbmVudC5cbiAgICpcbiAgICogQHBhcmFtIHtTb2Z0V3JhcFN0YXR1c30gbW9kZWwgTW9kZWwgdGhhdCBoYW5kbGVzIHRoZSBsb2dpYyBiZWhpbmQgdGhlIGNvbXBvbmVudC5cbiAgICovXG4gIGNvbnN0cnVjdG9yIChtb2RlbCkge1xuICAgIHRoaXMubW9kZWwgPSBtb2RlbFxuXG4gICAgZXRjaC5pbml0aWFsaXplKHRoaXMpXG4gIH1cblxuICAvKipcbiAgICogUHVibGljOiBEcmF3cyB0aGUgY29tcG9uZW50LlxuICAgKlxuICAgKiBAcmV0dXJuIHtIVE1MRWxlbWVudH0gSFRNTCBvZiB0aGUgY29tcG9uZW50LlxuICAgKi9cbiAgcmVuZGVyICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJzb2Z0LXdyYXAtc3RhdHVzLWNvbXBvbmVudCBpbmxpbmUtYmxvY2tcIj5cbiAgICAgICAge3RoaXMucmVuZGVySW5kaWNhdG9yKCl9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICAvKipcbiAgICogUHVibGljOiBVcGRhdGVzIHRoZSBzdGF0ZSBvZiB0aGUgY29tcG9uZW50IGJlZm9yZSBiZWluZyByZWRyYXduLlxuICAgKlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSBSZXNvbHZlZCB3aGVuIHRoZSBjb21wb25lbnQgaXMgZG9uZSB1cGRhdGluZy5cbiAgICovXG4gIHVwZGF0ZSAoKSB7XG4gICAgcmV0dXJuIGV0Y2gudXBkYXRlKHRoaXMpXG4gIH1cblxuICAvKipcbiAgICogUHVibGljOiBEZXN0cm95cyB0aGUgY29tcG9uZW50LlxuICAgKi9cbiAgZGVzdHJveSAoKSB7XG4gICAgZXRjaC5kZXN0cm95KHRoaXMpXG4gIH1cblxuICAvKipcbiAgICogUHJpdmF0ZTogRHJhd3MgdGhlIGNsaWNrYWJsZSBpbmRpY2F0b3IsIGlmIG5lY2Vzc2FyeS5cbiAgICpcbiAgICogQHJldHVybiB7SFRNTEVsZW1lbnR9IEhUTUwgb2YgdGhlIGNsaWNrYWJsZSBpbmRpY2F0b3IuXG4gICAqL1xuICByZW5kZXJJbmRpY2F0b3IgKCkge1xuICAgIGlmICh0aGlzLm1vZGVsLnNob3VsZFJlbmRlckluZGljYXRvcigpKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8SW5kaWNhdG9yQW5jaG9yIG9uY2xpY2s9e3RoaXMubW9kZWwudG9nZ2xlU29mdFdyYXBwZWQuYmluZCh0aGlzLm1vZGVsKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICB3cmFwcGVkPXt0aGlzLm1vZGVsLnNob3VsZEJlTGl0KCl9IC8+XG4gICAgICApXG4gICAgfVxuICB9XG59XG4iXX0=
//# sourceURL=/Users/ah/.atom/packages/soft-wrap-indicator/lib/soft-wrap-status-component.js
