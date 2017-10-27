Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _helpers = require('../helpers');

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
    key: 'activate',
    value: _asyncToGenerator(function* () {
      var updated = false;
      var configFile = yield (0, _helpers.getConfigFile)();
      var shown = yield configFile.get('greeter.shown');

      if (!shown.includes('V2_WELCOME_MESSAGE')) {
        updated = true;
        shown.push('V2_WELCOME_MESSAGE');
        (0, _greetV2Welcome2['default'])();
      }

      if (updated) {
        yield configFile.set('greeter.shown', shown);
      }
    })
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL2dyZWV0ZXIvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O3VCQUU4QixZQUFZOzs7OzhCQUdmLG9CQUFvQjs7Ozs7OztJQUsxQixPQUFPO0FBRWYsV0FGUSxPQUFPLEdBRVo7MEJBRkssT0FBTzs7QUFHeEIsUUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBO0dBQy9COztlQUprQixPQUFPOzs2QkFLWixhQUFHO0FBQ2YsVUFBSSxPQUFPLEdBQUcsS0FBSyxDQUFBO0FBQ25CLFVBQU0sVUFBVSxHQUFHLE1BQU0sNkJBQWUsQ0FBQTtBQUN4QyxVQUFNLEtBQUssR0FBRyxNQUFNLFVBQVUsQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUE7O0FBRW5ELFVBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLG9CQUFvQixDQUFDLEVBQUU7QUFDekMsZUFBTyxHQUFHLElBQUksQ0FBQTtBQUNkLGFBQUssQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQTtBQUNoQywwQ0FBZ0IsQ0FBQTtPQUNqQjs7QUFFRCxVQUFJLE9BQU8sRUFBRTtBQUNYLGNBQU0sVUFBVSxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsS0FBSyxDQUFDLENBQUE7T0FDN0M7S0FDRjs7O1dBQ00sbUJBQUc7QUFDUixVQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxVQUFBLENBQUM7ZUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFO09BQUEsQ0FBQyxDQUFBO0FBQzVDLFVBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLENBQUE7S0FDM0I7OztTQXZCa0IsT0FBTzs7O3FCQUFQLE9BQU8iLCJmaWxlIjoiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvZ3JlZXRlci9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCB7IGdldENvbmZpZ0ZpbGUgfSBmcm9tICcuLi9oZWxwZXJzJ1xuXG4vLyBHcmVldHNcbmltcG9ydCBncmVldFYyV2VsY29tZSBmcm9tICcuL2dyZWV0LXYyLXdlbGNvbWUnXG5cblxuLy8gTm90ZTogVGhpcyBwYWNrYWdlIHNob3VsZCBub3QgYmUgdXNlZCBmcm9tIFwiTWFpblwiIGNsYXNzLFxuLy8gSW5zdGVhZCBpdCBzaG91bGQgYmUgdXNlZCBmcm9tIHRoZSBtYWluIHBhY2thZ2UgZW50cnkgcG9pbnQgZGlyZWN0bHlcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdyZWV0ZXIge1xuICBub3RpZmljYXRpb25zOiBTZXQ8T2JqZWN0PjtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5ub3RpZmljYXRpb25zID0gbmV3IFNldCgpXG4gIH1cbiAgYXN5bmMgYWN0aXZhdGUoKSB7XG4gICAgbGV0IHVwZGF0ZWQgPSBmYWxzZVxuICAgIGNvbnN0IGNvbmZpZ0ZpbGUgPSBhd2FpdCBnZXRDb25maWdGaWxlKClcbiAgICBjb25zdCBzaG93biA9IGF3YWl0IGNvbmZpZ0ZpbGUuZ2V0KCdncmVldGVyLnNob3duJylcblxuICAgIGlmICghc2hvd24uaW5jbHVkZXMoJ1YyX1dFTENPTUVfTUVTU0FHRScpKSB7XG4gICAgICB1cGRhdGVkID0gdHJ1ZVxuICAgICAgc2hvd24ucHVzaCgnVjJfV0VMQ09NRV9NRVNTQUdFJylcbiAgICAgIGdyZWV0VjJXZWxjb21lKClcbiAgICB9XG5cbiAgICBpZiAodXBkYXRlZCkge1xuICAgICAgYXdhaXQgY29uZmlnRmlsZS5zZXQoJ2dyZWV0ZXIuc2hvd24nLCBzaG93bilcbiAgICB9XG4gIH1cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLm5vdGlmaWNhdGlvbnMuZm9yRWFjaChuID0+IG4uZGlzbWlzcygpKVxuICAgIHRoaXMubm90aWZpY2F0aW9ucy5jbGVhcigpXG4gIH1cbn1cbiJdfQ==