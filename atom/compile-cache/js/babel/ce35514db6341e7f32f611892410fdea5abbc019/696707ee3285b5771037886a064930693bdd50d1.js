Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/** @babel */

var ReporterProxy = (function () {
  function ReporterProxy() {
    _classCallCheck(this, ReporterProxy);

    this.reporter = null;
    this.queue = [];
  }

  _createClass(ReporterProxy, [{
    key: 'setReporter',
    value: function setReporter(reporter) {
      this.reporter = reporter;
      var event = undefined;
      while (event = this.queue.shift()) {
        var _reporter;

        (_reporter = this.reporter).sendEvent.apply(_reporter, _toConsumableArray(event));
      }
    }
  }, {
    key: 'sendEvent',
    value: function sendEvent(action, label, value) {
      if (this.reporter) {
        this.reporter.sendEvent('welcome-v1', action, label, value);
      } else {
        this.queue.push(['welcome-v1', action, label, value]);
      }
    }
  }]);

  return ReporterProxy;
})();

exports['default'] = ReporterProxy;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy93ZWxjb21lL2xpYi9yZXBvcnRlci1wcm94eS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7SUFFcUIsYUFBYTtBQUNwQixXQURPLGFBQWEsR0FDakI7MEJBREksYUFBYTs7QUFFOUIsUUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUE7QUFDcEIsUUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUE7R0FDaEI7O2VBSmtCLGFBQWE7O1dBTXBCLHFCQUFDLFFBQVEsRUFBRTtBQUNyQixVQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQTtBQUN4QixVQUFJLEtBQUssWUFBQSxDQUFBO0FBQ1QsYUFBUSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRzs7O0FBQ25DLHFCQUFBLElBQUksQ0FBQyxRQUFRLEVBQUMsU0FBUyxNQUFBLCtCQUFJLEtBQUssRUFBQyxDQUFBO09BQ2xDO0tBQ0Y7OztXQUVTLG1CQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFO0FBQy9CLFVBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtBQUNqQixZQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxZQUFZLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQTtPQUM1RCxNQUFNO0FBQ0wsWUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxZQUFZLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFBO09BQ3REO0tBQ0Y7OztTQXBCa0IsYUFBYTs7O3FCQUFiLGFBQWEiLCJmaWxlIjoiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3dlbGNvbWUvbGliL3JlcG9ydGVyLXByb3h5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZXBvcnRlclByb3h5IHtcbiAgY29uc3RydWN0b3IgKCkge1xuICAgIHRoaXMucmVwb3J0ZXIgPSBudWxsXG4gICAgdGhpcy5xdWV1ZSA9IFtdXG4gIH1cblxuICBzZXRSZXBvcnRlciAocmVwb3J0ZXIpIHtcbiAgICB0aGlzLnJlcG9ydGVyID0gcmVwb3J0ZXJcbiAgICBsZXQgZXZlbnRcbiAgICB3aGlsZSAoKGV2ZW50ID0gdGhpcy5xdWV1ZS5zaGlmdCgpKSkge1xuICAgICAgdGhpcy5yZXBvcnRlci5zZW5kRXZlbnQoLi4uZXZlbnQpXG4gICAgfVxuICB9XG5cbiAgc2VuZEV2ZW50IChhY3Rpb24sIGxhYmVsLCB2YWx1ZSkge1xuICAgIGlmICh0aGlzLnJlcG9ydGVyKSB7XG4gICAgICB0aGlzLnJlcG9ydGVyLnNlbmRFdmVudCgnd2VsY29tZS12MScsIGFjdGlvbiwgbGFiZWwsIHZhbHVlKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnF1ZXVlLnB1c2goWyd3ZWxjb21lLXYxJywgYWN0aW9uLCBsYWJlbCwgdmFsdWVdKVxuICAgIH1cbiAgfVxufVxuIl19