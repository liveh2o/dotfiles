Object.defineProperty(exports, '__esModule', {
  value: true
});

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

exports['default'] = IndieRegistry;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL2luZGllLXJlZ2lzdHJ5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7b0JBRTZDLE1BQU07OzZCQUd6QixrQkFBa0I7Ozs7d0JBQ0wsWUFBWTs7SUFHOUIsYUFBYTtBQUtyQixXQUxRLGFBQWEsR0FLbEI7MEJBTEssYUFBYTs7QUFNOUIsUUFBSSxDQUFDLE9BQU8sR0FBRyxtQkFBYSxDQUFBO0FBQzVCLFFBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTtBQUMxQixRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFBOztBQUU5QyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7R0FDckM7O2VBWGtCLGFBQWE7O1dBWXhCLGtCQUFDLE1BQWEsRUFBRSxPQUFjLEVBQWlCOzs7QUFDckQsVUFBSSxDQUFDLHFCQUFjLE1BQU0sQ0FBQyxFQUFFO0FBQzFCLGNBQU0sSUFBSSxLQUFLLENBQUMsZ0NBQWdDLENBQUMsQ0FBQTtPQUNsRDtBQUNELFVBQU0sV0FBVyxHQUFHLCtCQUFrQixNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUE7QUFDdEQsVUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUE7QUFDL0IsaUJBQVcsQ0FBQyxZQUFZLENBQUMsWUFBTTtBQUM3QixjQUFLLFNBQVMsVUFBTyxDQUFDLFdBQVcsQ0FBQyxDQUFBO09BQ25DLENBQUMsQ0FBQTtBQUNGLGlCQUFXLENBQUMsV0FBVyxDQUFDLFVBQUMsUUFBUSxFQUFLO0FBQ3BDLGNBQUssT0FBTyxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBUixRQUFRLEVBQUUsQ0FBQyxDQUFBO09BQ25FLENBQUMsQ0FBQTtBQUNGLFVBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxXQUFXLENBQUMsQ0FBQTs7QUFFekMsYUFBTyxXQUFXLENBQUE7S0FDbkI7OztXQUNNLGlCQUFDLFFBQWtCLEVBQWM7QUFDdEMsVUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUE7QUFDaEMsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUE7S0FDNUM7OztXQUNVLHFCQUFDLFFBQWtCLEVBQWM7QUFDMUMsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsUUFBUSxDQUFDLENBQUE7S0FDL0M7OztXQUNNLG1CQUFHO0FBQ1IsV0FBSyxJQUFNLEtBQUssSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO0FBQ2xDLGFBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQTtPQUNoQjtBQUNELFVBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUE7S0FDN0I7OztTQXhDa0IsYUFBYTs7O3FCQUFiLGFBQWEiLCJmaWxlIjoiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvaW5kaWUtcmVnaXN0cnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgeyBFbWl0dGVyLCBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcbmltcG9ydCB0eXBlIHsgRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nXG5cbmltcG9ydCBJbmRpZURlbGVnYXRlIGZyb20gJy4vaW5kaWUtZGVsZWdhdGUnXG5pbXBvcnQgeyBpbmRpZSBhcyB2YWxpZGF0ZUluZGllIH0gZnJvbSAnLi92YWxpZGF0ZSdcbmltcG9ydCB0eXBlIHsgSW5kaWUgfSBmcm9tICcuL3R5cGVzJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbmRpZVJlZ2lzdHJ5IHtcbiAgZW1pdHRlcjogRW1pdHRlcjtcbiAgZGVsZWdhdGVzOiBTZXQ8SW5kaWVEZWxlZ2F0ZT47XG4gIHN1YnNjcmlwdGlvbnM6IENvbXBvc2l0ZURpc3Bvc2FibGU7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXIoKVxuICAgIHRoaXMuZGVsZWdhdGVzID0gbmV3IFNldCgpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLmVtaXR0ZXIpXG4gIH1cbiAgcmVnaXN0ZXIoY29uZmlnOiBJbmRpZSwgdmVyc2lvbjogMSB8IDIpOiBJbmRpZURlbGVnYXRlIHtcbiAgICBpZiAoIXZhbGlkYXRlSW5kaWUoY29uZmlnKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdFcnJvciByZWdpc3RlcmluZyBJbmRpZSBMaW50ZXInKVxuICAgIH1cbiAgICBjb25zdCBpbmRpZUxpbnRlciA9IG5ldyBJbmRpZURlbGVnYXRlKGNvbmZpZywgdmVyc2lvbilcbiAgICB0aGlzLmRlbGVnYXRlcy5hZGQoaW5kaWVMaW50ZXIpXG4gICAgaW5kaWVMaW50ZXIub25EaWREZXN0cm95KCgpID0+IHtcbiAgICAgIHRoaXMuZGVsZWdhdGVzLmRlbGV0ZShpbmRpZUxpbnRlcilcbiAgICB9KVxuICAgIGluZGllTGludGVyLm9uRGlkVXBkYXRlKChtZXNzYWdlcykgPT4ge1xuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC11cGRhdGUnLCB7IGxpbnRlcjogaW5kaWVMaW50ZXIsIG1lc3NhZ2VzIH0pXG4gICAgfSlcbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnb2JzZXJ2ZScsIGluZGllTGludGVyKVxuXG4gICAgcmV0dXJuIGluZGllTGludGVyXG4gIH1cbiAgb2JzZXJ2ZShjYWxsYmFjazogRnVuY3Rpb24pOiBEaXNwb3NhYmxlIHtcbiAgICB0aGlzLmRlbGVnYXRlcy5mb3JFYWNoKGNhbGxiYWNrKVxuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ29ic2VydmUnLCBjYWxsYmFjaylcbiAgfVxuICBvbkRpZFVwZGF0ZShjYWxsYmFjazogRnVuY3Rpb24pOiBEaXNwb3NhYmxlIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtdXBkYXRlJywgY2FsbGJhY2spXG4gIH1cbiAgZGlzcG9zZSgpIHtcbiAgICBmb3IgKGNvbnN0IGVudHJ5IG9mIHRoaXMuZGVsZWdhdGVzKSB7XG4gICAgICBlbnRyeS5kaXNwb3NlKClcbiAgICB9XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICB9XG59XG4iXX0=