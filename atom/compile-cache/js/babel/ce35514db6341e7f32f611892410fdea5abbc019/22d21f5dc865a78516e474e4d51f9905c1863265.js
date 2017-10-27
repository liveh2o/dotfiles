var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _validate = require('./validate');

var UIRegistry = (function () {
  function UIRegistry() {
    _classCallCheck(this, UIRegistry);

    this.providers = new Set();
    this.subscriptions = new _atom.CompositeDisposable();
  }

  _createClass(UIRegistry, [{
    key: 'add',
    value: function add(ui) {
      if (!this.providers.has(ui) && (0, _validate.ui)(ui)) {
        this.subscriptions.add(ui);
        this.providers.add(ui);
      }
    }
  }, {
    key: 'delete',
    value: function _delete(provider) {
      if (this.providers.has(provider)) {
        provider.dispose();
        this.providers['delete'](provider);
      }
    }
  }, {
    key: 'render',
    value: function render(messages) {
      this.providers.forEach(function (provider) {
        provider.render(messages);
      });
    }
  }, {
    key: 'didBeginLinting',
    value: function didBeginLinting(linter) {
      var filePath = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

      this.providers.forEach(function (provider) {
        provider.didBeginLinting(linter, filePath);
      });
    }
  }, {
    key: 'didFinishLinting',
    value: function didFinishLinting(linter) {
      var filePath = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

      this.providers.forEach(function (provider) {
        provider.didFinishLinting(linter, filePath);
      });
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.providers.clear();
      this.subscriptions.dispose();
    }
  }]);

  return UIRegistry;
})();

module.exports = UIRegistry;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL3VpLXJlZ2lzdHJ5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7b0JBRW9DLE1BQU07O3dCQUNULFlBQVk7O0lBR3ZDLFVBQVU7QUFJSCxXQUpQLFVBQVUsR0FJQTswQkFKVixVQUFVOztBQUtaLFFBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTtBQUMxQixRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFBO0dBQy9DOztlQVBHLFVBQVU7O1dBUVgsYUFBQyxFQUFNLEVBQUU7QUFDVixVQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksa0JBQVcsRUFBRSxDQUFDLEVBQUU7QUFDN0MsWUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUE7QUFDMUIsWUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUE7T0FDdkI7S0FDRjs7O1dBQ0ssaUJBQUMsUUFBWSxFQUFFO0FBQ25CLFVBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEVBQUU7QUFDaEMsZ0JBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUNsQixZQUFJLENBQUMsU0FBUyxVQUFPLENBQUMsUUFBUSxDQUFDLENBQUE7T0FDaEM7S0FDRjs7O1dBQ0ssZ0JBQUMsUUFBdUIsRUFBRTtBQUM5QixVQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFTLFFBQVEsRUFBRTtBQUN4QyxnQkFBUSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQTtPQUMxQixDQUFDLENBQUE7S0FDSDs7O1dBQ2MseUJBQUMsTUFBYyxFQUE0QjtVQUExQixRQUFpQix5REFBRyxJQUFJOztBQUN0RCxVQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFTLFFBQVEsRUFBRTtBQUN4QyxnQkFBUSxDQUFDLGVBQWUsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUE7T0FDM0MsQ0FBQyxDQUFBO0tBQ0g7OztXQUNlLDBCQUFDLE1BQWMsRUFBNEI7VUFBMUIsUUFBaUIseURBQUcsSUFBSTs7QUFDdkQsVUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBUyxRQUFRLEVBQUU7QUFDeEMsZ0JBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUE7T0FDNUMsQ0FBQyxDQUFBO0tBQ0g7OztXQUNNLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtBQUN0QixVQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFBO0tBQzdCOzs7U0F0Q0csVUFBVTs7O0FBeUNoQixNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVUsQ0FBQSIsImZpbGUiOiIvVXNlcnMvYWgvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi91aS1yZWdpc3RyeS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdhdG9tJ1xuaW1wb3J0IHsgdWkgYXMgdmFsaWRhdGVVSSB9IGZyb20gJy4vdmFsaWRhdGUnXG5pbXBvcnQgdHlwZSB7IExpbnRlciwgVUksIE1lc3NhZ2VzUGF0Y2ggfSBmcm9tICcuL3R5cGVzJ1xuXG5jbGFzcyBVSVJlZ2lzdHJ5IHtcbiAgcHJvdmlkZXJzOiBTZXQ8VUk+O1xuICBzdWJzY3JpcHRpb25zOiBDb21wb3NpdGVEaXNwb3NhYmxlO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucHJvdmlkZXJzID0gbmV3IFNldCgpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICB9XG4gIGFkZCh1aTogVUkpIHtcbiAgICBpZiAoIXRoaXMucHJvdmlkZXJzLmhhcyh1aSkgJiYgdmFsaWRhdGVVSSh1aSkpIHtcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodWkpXG4gICAgICB0aGlzLnByb3ZpZGVycy5hZGQodWkpXG4gICAgfVxuICB9XG4gIGRlbGV0ZShwcm92aWRlcjogVUkpIHtcbiAgICBpZiAodGhpcy5wcm92aWRlcnMuaGFzKHByb3ZpZGVyKSkge1xuICAgICAgcHJvdmlkZXIuZGlzcG9zZSgpXG4gICAgICB0aGlzLnByb3ZpZGVycy5kZWxldGUocHJvdmlkZXIpXG4gICAgfVxuICB9XG4gIHJlbmRlcihtZXNzYWdlczogTWVzc2FnZXNQYXRjaCkge1xuICAgIHRoaXMucHJvdmlkZXJzLmZvckVhY2goZnVuY3Rpb24ocHJvdmlkZXIpIHtcbiAgICAgIHByb3ZpZGVyLnJlbmRlcihtZXNzYWdlcylcbiAgICB9KVxuICB9XG4gIGRpZEJlZ2luTGludGluZyhsaW50ZXI6IExpbnRlciwgZmlsZVBhdGg6ID9zdHJpbmcgPSBudWxsKSB7XG4gICAgdGhpcy5wcm92aWRlcnMuZm9yRWFjaChmdW5jdGlvbihwcm92aWRlcikge1xuICAgICAgcHJvdmlkZXIuZGlkQmVnaW5MaW50aW5nKGxpbnRlciwgZmlsZVBhdGgpXG4gICAgfSlcbiAgfVxuICBkaWRGaW5pc2hMaW50aW5nKGxpbnRlcjogTGludGVyLCBmaWxlUGF0aDogP3N0cmluZyA9IG51bGwpIHtcbiAgICB0aGlzLnByb3ZpZGVycy5mb3JFYWNoKGZ1bmN0aW9uKHByb3ZpZGVyKSB7XG4gICAgICBwcm92aWRlci5kaWRGaW5pc2hMaW50aW5nKGxpbnRlciwgZmlsZVBhdGgpXG4gICAgfSlcbiAgfVxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMucHJvdmlkZXJzLmNsZWFyKClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBVSVJlZ2lzdHJ5XG4iXX0=