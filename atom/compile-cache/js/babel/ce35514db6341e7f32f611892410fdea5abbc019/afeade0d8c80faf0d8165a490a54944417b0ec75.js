'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var SynchronousScheduler = (function () {
  function SynchronousScheduler() {
    _classCallCheck(this, SynchronousScheduler);
  }

  _createClass(SynchronousScheduler, [{
    key: 'updateDocument',
    value: function updateDocument(fn) {
      fn();
    }
  }, {
    key: 'readDocument',
    value: function readDocument(fn) {
      fn();
    }
  }, {
    key: 'getNextUpdatePromise',
    value: function getNextUpdatePromise() {
      return Promise.resolve();
    }
  }]);

  return SynchronousScheduler;
})();

exports['default'] = SynchronousScheduler;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9zb2Z0LXdyYXAtaW5kaWNhdG9yL3NwZWMvZXRjaC1zeW5jaHJvbm91cy1zY2hlZHVsZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFBOzs7Ozs7Ozs7O0lBRVUsb0JBQW9CO1dBQXBCLG9CQUFvQjswQkFBcEIsb0JBQW9COzs7ZUFBcEIsb0JBQW9COztXQUN4Qix3QkFBQyxFQUFFLEVBQUU7QUFDbEIsUUFBRSxFQUFFLENBQUE7S0FDTDs7O1dBRVksc0JBQUMsRUFBRSxFQUFFO0FBQ2hCLFFBQUUsRUFBRSxDQUFBO0tBQ0w7OztXQUVvQixnQ0FBRztBQUN0QixhQUFPLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQTtLQUN6Qjs7O1NBWGtCLG9CQUFvQjs7O3FCQUFwQixvQkFBb0IiLCJmaWxlIjoiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3NvZnQtd3JhcC1pbmRpY2F0b3Ivc3BlYy9ldGNoLXN5bmNocm9ub3VzLXNjaGVkdWxlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN5bmNocm9ub3VzU2NoZWR1bGVyIHtcbiAgdXBkYXRlRG9jdW1lbnQgKGZuKSB7XG4gICAgZm4oKVxuICB9XG5cbiAgcmVhZERvY3VtZW50IChmbikge1xuICAgIGZuKClcbiAgfVxuXG4gIGdldE5leHRVcGRhdGVQcm9taXNlICgpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKClcbiAgfVxufVxuIl19
//# sourceURL=/Users/ah/.atom/packages/soft-wrap-indicator/spec/etch-synchronous-scheduler.js
