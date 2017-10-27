Object.defineProperty(exports, '__esModule', {
  value: true
});

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

exports['default'] = UIRegistry;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL3VpLXJlZ2lzdHJ5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O29CQUVvQyxNQUFNOzt3QkFDVCxZQUFZOztJQUd4QixVQUFVO0FBSWxCLFdBSlEsVUFBVSxHQUlmOzBCQUpLLFVBQVU7O0FBSzNCLFFBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTtBQUMxQixRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFBO0dBQy9DOztlQVBrQixVQUFVOztXQVExQixhQUFDLEVBQU0sRUFBRTtBQUNWLFVBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxrQkFBVyxFQUFFLENBQUMsRUFBRTtBQUM3QyxZQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQTtBQUMxQixZQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQTtPQUN2QjtLQUNGOzs7V0FDSyxpQkFBQyxRQUFZLEVBQUU7QUFDbkIsVUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRTtBQUNoQyxnQkFBUSxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQ2xCLFlBQUksQ0FBQyxTQUFTLFVBQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQTtPQUNoQztLQUNGOzs7V0FDSyxnQkFBQyxRQUF1QixFQUFFO0FBQzlCLFVBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFVBQVMsUUFBUSxFQUFFO0FBQ3hDLGdCQUFRLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFBO09BQzFCLENBQUMsQ0FBQTtLQUNIOzs7V0FDYyx5QkFBQyxNQUFjLEVBQTRCO1VBQTFCLFFBQWlCLHlEQUFHLElBQUk7O0FBQ3RELFVBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFVBQVMsUUFBUSxFQUFFO0FBQ3hDLGdCQUFRLENBQUMsZUFBZSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQTtPQUMzQyxDQUFDLENBQUE7S0FDSDs7O1dBQ2UsMEJBQUMsTUFBYyxFQUE0QjtVQUExQixRQUFpQix5REFBRyxJQUFJOztBQUN2RCxVQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFTLFFBQVEsRUFBRTtBQUN4QyxnQkFBUSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQTtPQUM1QyxDQUFDLENBQUE7S0FDSDs7O1dBQ00sbUJBQUc7QUFDUixVQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFBO0FBQ3RCLFVBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUE7S0FDN0I7OztTQXRDa0IsVUFBVTs7O3FCQUFWLFVBQVUiLCJmaWxlIjoiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvdWktcmVnaXN0cnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcbmltcG9ydCB7IHVpIGFzIHZhbGlkYXRlVUkgfSBmcm9tICcuL3ZhbGlkYXRlJ1xuaW1wb3J0IHR5cGUgeyBMaW50ZXIsIFVJLCBNZXNzYWdlc1BhdGNoIH0gZnJvbSAnLi90eXBlcydcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVUlSZWdpc3RyeSB7XG4gIHByb3ZpZGVyczogU2V0PFVJPjtcbiAgc3Vic2NyaXB0aW9uczogQ29tcG9zaXRlRGlzcG9zYWJsZTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnByb3ZpZGVycyA9IG5ldyBTZXQoKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgfVxuICBhZGQodWk6IFVJKSB7XG4gICAgaWYgKCF0aGlzLnByb3ZpZGVycy5oYXModWkpICYmIHZhbGlkYXRlVUkodWkpKSB7XG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHVpKVxuICAgICAgdGhpcy5wcm92aWRlcnMuYWRkKHVpKVxuICAgIH1cbiAgfVxuICBkZWxldGUocHJvdmlkZXI6IFVJKSB7XG4gICAgaWYgKHRoaXMucHJvdmlkZXJzLmhhcyhwcm92aWRlcikpIHtcbiAgICAgIHByb3ZpZGVyLmRpc3Bvc2UoKVxuICAgICAgdGhpcy5wcm92aWRlcnMuZGVsZXRlKHByb3ZpZGVyKVxuICAgIH1cbiAgfVxuICByZW5kZXIobWVzc2FnZXM6IE1lc3NhZ2VzUGF0Y2gpIHtcbiAgICB0aGlzLnByb3ZpZGVycy5mb3JFYWNoKGZ1bmN0aW9uKHByb3ZpZGVyKSB7XG4gICAgICBwcm92aWRlci5yZW5kZXIobWVzc2FnZXMpXG4gICAgfSlcbiAgfVxuICBkaWRCZWdpbkxpbnRpbmcobGludGVyOiBMaW50ZXIsIGZpbGVQYXRoOiA/c3RyaW5nID0gbnVsbCkge1xuICAgIHRoaXMucHJvdmlkZXJzLmZvckVhY2goZnVuY3Rpb24ocHJvdmlkZXIpIHtcbiAgICAgIHByb3ZpZGVyLmRpZEJlZ2luTGludGluZyhsaW50ZXIsIGZpbGVQYXRoKVxuICAgIH0pXG4gIH1cbiAgZGlkRmluaXNoTGludGluZyhsaW50ZXI6IExpbnRlciwgZmlsZVBhdGg6ID9zdHJpbmcgPSBudWxsKSB7XG4gICAgdGhpcy5wcm92aWRlcnMuZm9yRWFjaChmdW5jdGlvbihwcm92aWRlcikge1xuICAgICAgcHJvdmlkZXIuZGlkRmluaXNoTGludGluZyhsaW50ZXIsIGZpbGVQYXRoKVxuICAgIH0pXG4gIH1cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLnByb3ZpZGVycy5jbGVhcigpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICB9XG59XG4iXX0=