var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

// Greets

var _greetV2Welcome = require('./greet-v2-welcome');

var _greetV2Welcome2 = _interopRequireDefault(_greetV2Welcome);

// Note: This package should not be used from "Main" class,
// Instead it should be used from the main package entry point directly

var Greeter = (function () {
  function Greeter() {
    _classCallCheck(this, Greeter);

    this.notifications = new Set();
  }

  _createClass(Greeter, [{
    key: 'showWelcome',
    value: function showWelcome() {
      var _this = this;

      var notification = (0, _greetV2Welcome2['default'])();
      notification.onDidDismiss(function () {
        return _this.notifications['delete'](notification);
      });
      this.notifications.add(notification);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.notifications.forEach(function (n) {
        return n.dismiss();
      });
      this.notifications.clear();
    }
  }]);

  return Greeter;
})();

module.exports = Greeter;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL2dyZWV0ZXIvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OEJBRzJCLG9CQUFvQjs7Ozs7OztJQUl6QyxPQUFPO0FBRUEsV0FGUCxPQUFPLEdBRUc7MEJBRlYsT0FBTzs7QUFHVCxRQUFJLENBQUMsYUFBYSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7R0FDL0I7O2VBSkcsT0FBTzs7V0FLQSx1QkFBUzs7O0FBQ2xCLFVBQU0sWUFBWSxHQUFHLGtDQUFnQixDQUFBO0FBQ3JDLGtCQUFZLENBQUMsWUFBWSxDQUFDO2VBQU0sTUFBSyxhQUFhLFVBQU8sQ0FBQyxZQUFZLENBQUM7T0FBQSxDQUFDLENBQUE7QUFDeEUsVUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUE7S0FDckM7OztXQUNNLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsVUFBQSxDQUFDO2VBQUksQ0FBQyxDQUFDLE9BQU8sRUFBRTtPQUFBLENBQUMsQ0FBQTtBQUM1QyxVQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxDQUFBO0tBQzNCOzs7U0FiRyxPQUFPOzs7QUFnQmIsTUFBTSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUEiLCJmaWxlIjoiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvZ3JlZXRlci9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbi8vIEdyZWV0c1xuaW1wb3J0IGdyZWV0VjJXZWxjb21lIGZyb20gJy4vZ3JlZXQtdjItd2VsY29tZSdcblxuLy8gTm90ZTogVGhpcyBwYWNrYWdlIHNob3VsZCBub3QgYmUgdXNlZCBmcm9tIFwiTWFpblwiIGNsYXNzLFxuLy8gSW5zdGVhZCBpdCBzaG91bGQgYmUgdXNlZCBmcm9tIHRoZSBtYWluIHBhY2thZ2UgZW50cnkgcG9pbnQgZGlyZWN0bHlcbmNsYXNzIEdyZWV0ZXIge1xuICBub3RpZmljYXRpb25zOiBTZXQ8T2JqZWN0PjtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5ub3RpZmljYXRpb25zID0gbmV3IFNldCgpXG4gIH1cbiAgc2hvd1dlbGNvbWUoKTogdm9pZCB7XG4gICAgY29uc3Qgbm90aWZpY2F0aW9uID0gZ3JlZXRWMldlbGNvbWUoKVxuICAgIG5vdGlmaWNhdGlvbi5vbkRpZERpc21pc3MoKCkgPT4gdGhpcy5ub3RpZmljYXRpb25zLmRlbGV0ZShub3RpZmljYXRpb24pKVxuICAgIHRoaXMubm90aWZpY2F0aW9ucy5hZGQobm90aWZpY2F0aW9uKVxuICB9XG4gIGRpc3Bvc2UoKSB7XG4gICAgdGhpcy5ub3RpZmljYXRpb25zLmZvckVhY2gobiA9PiBuLmRpc21pc3MoKSlcbiAgICB0aGlzLm5vdGlmaWNhdGlvbnMuY2xlYXIoKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gR3JlZXRlclxuIl19