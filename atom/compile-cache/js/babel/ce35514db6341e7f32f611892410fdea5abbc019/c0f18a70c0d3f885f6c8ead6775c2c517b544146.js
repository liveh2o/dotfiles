Object.defineProperty(exports, '__esModule', {
  value: true
});

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
      (0, _greetV2Welcome2['default'])();
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

exports['default'] = Greeter;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL2dyZWV0ZXIvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OzhCQUcyQixvQkFBb0I7Ozs7Ozs7SUFLMUIsT0FBTztBQUVmLFdBRlEsT0FBTyxHQUVaOzBCQUZLLE9BQU87O0FBR3hCLFFBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTtHQUMvQjs7ZUFKa0IsT0FBTzs7V0FLZix1QkFBUztBQUNsQix3Q0FBZ0IsQ0FBQTtLQUNqQjs7O1dBQ00sbUJBQUc7QUFDUixVQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxVQUFBLENBQUM7ZUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFO09BQUEsQ0FBQyxDQUFBO0FBQzVDLFVBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLENBQUE7S0FDM0I7OztTQVhrQixPQUFPOzs7cUJBQVAsT0FBTyIsImZpbGUiOiIvVXNlcnMvYWgvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi9ncmVldGVyL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuLy8gR3JlZXRzXG5pbXBvcnQgZ3JlZXRWMldlbGNvbWUgZnJvbSAnLi9ncmVldC12Mi13ZWxjb21lJ1xuXG5cbi8vIE5vdGU6IFRoaXMgcGFja2FnZSBzaG91bGQgbm90IGJlIHVzZWQgZnJvbSBcIk1haW5cIiBjbGFzcyxcbi8vIEluc3RlYWQgaXQgc2hvdWxkIGJlIHVzZWQgZnJvbSB0aGUgbWFpbiBwYWNrYWdlIGVudHJ5IHBvaW50IGRpcmVjdGx5XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHcmVldGVyIHtcbiAgbm90aWZpY2F0aW9uczogU2V0PE9iamVjdD47XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMubm90aWZpY2F0aW9ucyA9IG5ldyBTZXQoKVxuICB9XG4gIHNob3dXZWxjb21lKCk6IHZvaWQge1xuICAgIGdyZWV0VjJXZWxjb21lKClcbiAgfVxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMubm90aWZpY2F0aW9ucy5mb3JFYWNoKG4gPT4gbi5kaXNtaXNzKCkpXG4gICAgdGhpcy5ub3RpZmljYXRpb25zLmNsZWFyKClcbiAgfVxufVxuIl19