var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _indieDelegate = require('./indie-delegate');

var _indieDelegate2 = _interopRequireDefault(_indieDelegate);

var _validate = require('./validate');

var IndieRegistry = (function () {
  function IndieRegistry() {
    _classCallCheck(this, IndieRegistry);

    this.emitter = new _atom.Emitter();
    this.delegates = new Set();
    this.subscriptions = new _atom.CompositeDisposable();

    this.subscriptions.add(this.emitter);
  }

  // Public method

  _createClass(IndieRegistry, [{
    key: 'register',
    value: function register(config, version) {
      var _this = this;

      if (!(0, _validate.indie)(config)) {
        throw new Error('Error registering Indie Linter');
      }
      var indieLinter = new _indieDelegate2['default'](config, version);
      this.delegates.add(indieLinter);
      indieLinter.onDidDestroy(function () {
        _this.delegates['delete'](indieLinter);
      });
      indieLinter.onDidUpdate(function (messages) {
        _this.emitter.emit('did-update', { linter: indieLinter, messages: messages });
      });
      this.emitter.emit('observe', indieLinter);

      return indieLinter;
    }
  }, {
    key: 'getProviders',
    value: function getProviders() {
      return Array.from(this.delegates);
    }
  }, {
    key: 'observe',
    value: function observe(callback) {
      this.delegates.forEach(callback);
      return this.emitter.on('observe', callback);
    }
  }, {
    key: 'onDidUpdate',
    value: function onDidUpdate(callback) {
      return this.emitter.on('did-update', callback);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      for (var entry of this.delegates) {
        entry.dispose();
      }
      this.subscriptions.dispose();
    }
  }]);

  return IndieRegistry;
})();

module.exports = IndieRegistry;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL2luZGllLXJlZ2lzdHJ5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztvQkFFNkMsTUFBTTs7NkJBR3pCLGtCQUFrQjs7Ozt3QkFDTCxZQUFZOztJQUc3QyxhQUFhO0FBS04sV0FMUCxhQUFhLEdBS0g7MEJBTFYsYUFBYTs7QUFNZixRQUFJLENBQUMsT0FBTyxHQUFHLG1CQUFhLENBQUE7QUFDNUIsUUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBO0FBQzFCLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7O0FBRTlDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtHQUNyQzs7OztlQVhHLGFBQWE7O1dBYVQsa0JBQUMsTUFBYSxFQUFFLE9BQWMsRUFBaUI7OztBQUNyRCxVQUFJLENBQUMscUJBQWMsTUFBTSxDQUFDLEVBQUU7QUFDMUIsY0FBTSxJQUFJLEtBQUssQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFBO09BQ2xEO0FBQ0QsVUFBTSxXQUFXLEdBQUcsK0JBQWtCLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQTtBQUN0RCxVQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQTtBQUMvQixpQkFBVyxDQUFDLFlBQVksQ0FBQyxZQUFNO0FBQzdCLGNBQUssU0FBUyxVQUFPLENBQUMsV0FBVyxDQUFDLENBQUE7T0FDbkMsQ0FBQyxDQUFBO0FBQ0YsaUJBQVcsQ0FBQyxXQUFXLENBQUMsVUFBQyxRQUFRLEVBQUs7QUFDcEMsY0FBSyxPQUFPLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsUUFBUSxFQUFSLFFBQVEsRUFBRSxDQUFDLENBQUE7T0FDbkUsQ0FBQyxDQUFBO0FBQ0YsVUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFdBQVcsQ0FBQyxDQUFBOztBQUV6QyxhQUFPLFdBQVcsQ0FBQTtLQUNuQjs7O1dBQ1csd0JBQUc7QUFDYixhQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFBO0tBQ2xDOzs7V0FDTSxpQkFBQyxRQUFrQixFQUFjO0FBQ3RDLFVBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQ2hDLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFBO0tBQzVDOzs7V0FDVSxxQkFBQyxRQUFrQixFQUFjO0FBQzFDLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLFFBQVEsQ0FBQyxDQUFBO0tBQy9DOzs7V0FDTSxtQkFBRztBQUNSLFdBQUssSUFBTSxLQUFLLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtBQUNsQyxhQUFLLENBQUMsT0FBTyxFQUFFLENBQUE7T0FDaEI7QUFDRCxVQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFBO0tBQzdCOzs7U0E1Q0csYUFBYTs7O0FBK0NuQixNQUFNLENBQUMsT0FBTyxHQUFHLGFBQWEsQ0FBQSIsImZpbGUiOiIvVXNlcnMvYWgvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi9pbmRpZS1yZWdpc3RyeS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCB7IEVtaXR0ZXIsIENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdhdG9tJ1xuaW1wb3J0IHR5cGUgeyBEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcblxuaW1wb3J0IEluZGllRGVsZWdhdGUgZnJvbSAnLi9pbmRpZS1kZWxlZ2F0ZSdcbmltcG9ydCB7IGluZGllIGFzIHZhbGlkYXRlSW5kaWUgfSBmcm9tICcuL3ZhbGlkYXRlJ1xuaW1wb3J0IHR5cGUgeyBJbmRpZSB9IGZyb20gJy4vdHlwZXMnXG5cbmNsYXNzIEluZGllUmVnaXN0cnkge1xuICBlbWl0dGVyOiBFbWl0dGVyO1xuICBkZWxlZ2F0ZXM6IFNldDxJbmRpZURlbGVnYXRlPjtcbiAgc3Vic2NyaXB0aW9uczogQ29tcG9zaXRlRGlzcG9zYWJsZTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpXG4gICAgdGhpcy5kZWxlZ2F0ZXMgPSBuZXcgU2V0KClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuZW1pdHRlcilcbiAgfVxuICAvLyBQdWJsaWMgbWV0aG9kXG4gIHJlZ2lzdGVyKGNvbmZpZzogSW5kaWUsIHZlcnNpb246IDEgfCAyKTogSW5kaWVEZWxlZ2F0ZSB7XG4gICAgaWYgKCF2YWxpZGF0ZUluZGllKGNvbmZpZykpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignRXJyb3IgcmVnaXN0ZXJpbmcgSW5kaWUgTGludGVyJylcbiAgICB9XG4gICAgY29uc3QgaW5kaWVMaW50ZXIgPSBuZXcgSW5kaWVEZWxlZ2F0ZShjb25maWcsIHZlcnNpb24pXG4gICAgdGhpcy5kZWxlZ2F0ZXMuYWRkKGluZGllTGludGVyKVxuICAgIGluZGllTGludGVyLm9uRGlkRGVzdHJveSgoKSA9PiB7XG4gICAgICB0aGlzLmRlbGVnYXRlcy5kZWxldGUoaW5kaWVMaW50ZXIpXG4gICAgfSlcbiAgICBpbmRpZUxpbnRlci5vbkRpZFVwZGF0ZSgobWVzc2FnZXMpID0+IHtcbiAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtdXBkYXRlJywgeyBsaW50ZXI6IGluZGllTGludGVyLCBtZXNzYWdlcyB9KVxuICAgIH0pXG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ29ic2VydmUnLCBpbmRpZUxpbnRlcilcblxuICAgIHJldHVybiBpbmRpZUxpbnRlclxuICB9XG4gIGdldFByb3ZpZGVycygpIHtcbiAgICByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLmRlbGVnYXRlcylcbiAgfVxuICBvYnNlcnZlKGNhbGxiYWNrOiBGdW5jdGlvbik6IERpc3Bvc2FibGUge1xuICAgIHRoaXMuZGVsZWdhdGVzLmZvckVhY2goY2FsbGJhY2spXG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignb2JzZXJ2ZScsIGNhbGxiYWNrKVxuICB9XG4gIG9uRGlkVXBkYXRlKGNhbGxiYWNrOiBGdW5jdGlvbik6IERpc3Bvc2FibGUge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC11cGRhdGUnLCBjYWxsYmFjaylcbiAgfVxuICBkaXNwb3NlKCkge1xuICAgIGZvciAoY29uc3QgZW50cnkgb2YgdGhpcy5kZWxlZ2F0ZXMpIHtcbiAgICAgIGVudHJ5LmRpc3Bvc2UoKVxuICAgIH1cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBJbmRpZVJlZ2lzdHJ5XG4iXX0=