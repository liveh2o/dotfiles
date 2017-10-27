Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _validate = require('./validate');

var _validate2 = _interopRequireDefault(_validate);

var _indie = require('./indie');

var _indie2 = _interopRequireDefault(_indie);

'use babel';

var IndieRegistry = (function () {
  function IndieRegistry() {
    _classCallCheck(this, IndieRegistry);

    this.subscriptions = new _atom.CompositeDisposable();
    this.emitter = new _atom.Emitter();

    this.indieLinters = new Set();
    this.subscriptions.add(this.emitter);
  }

  _createClass(IndieRegistry, [{
    key: 'register',
    value: function register(linter) {
      var _this = this;

      _validate2['default'].linter(linter, true);
      var indieLinter = new _indie2['default'](linter);

      this.subscriptions.add(indieLinter);
      this.indieLinters.add(indieLinter);

      indieLinter.onDidDestroy(function () {
        _this.indieLinters['delete'](indieLinter);
      });
      indieLinter.onDidUpdateMessages(function (messages) {
        _this.emitter.emit('did-update-messages', { linter: indieLinter, messages: messages });
      });
      this.emitter.emit('observe', indieLinter);

      return indieLinter;
    }
  }, {
    key: 'has',
    value: function has(indieLinter) {
      return this.indieLinters.has(indieLinter);
    }
  }, {
    key: 'unregister',
    value: function unregister(indieLinter) {
      if (this.indieLinters.has(indieLinter)) {
        indieLinter.dispose();
      }
    }

    // Private method
  }, {
    key: 'observe',
    value: function observe(callback) {
      this.indieLinters.forEach(callback);
      return this.emitter.on('observe', callback);
    }

    // Private method
  }, {
    key: 'onDidUpdateMessages',
    value: function onDidUpdateMessages(callback) {
      return this.emitter.on('did-update-messages', callback);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
    }
  }]);

  return IndieRegistry;
})();

exports['default'] = IndieRegistry;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL2luZGllLXJlZ2lzdHJ5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7b0JBRTJDLE1BQU07O3dCQUM1QixZQUFZOzs7O3FCQUNmLFNBQVM7Ozs7QUFKM0IsV0FBVyxDQUFBOztJQU1VLGFBQWE7QUFDckIsV0FEUSxhQUFhLEdBQ2xCOzBCQURLLGFBQWE7O0FBRTlCLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7QUFDOUMsUUFBSSxDQUFDLE9BQU8sR0FBRyxtQkFBYSxDQUFBOztBQUU1QixRQUFJLENBQUMsWUFBWSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7QUFDN0IsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0dBQ3JDOztlQVBrQixhQUFhOztXQVN4QixrQkFBQyxNQUFNLEVBQUU7OztBQUNmLDRCQUFTLE1BQU0sQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUE7QUFDN0IsVUFBTSxXQUFXLEdBQUcsdUJBQVUsTUFBTSxDQUFDLENBQUE7O0FBRXJDLFVBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFBO0FBQ25DLFVBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFBOztBQUVsQyxpQkFBVyxDQUFDLFlBQVksQ0FBQyxZQUFNO0FBQzdCLGNBQUssWUFBWSxVQUFPLENBQUMsV0FBVyxDQUFDLENBQUE7T0FDdEMsQ0FBQyxDQUFBO0FBQ0YsaUJBQVcsQ0FBQyxtQkFBbUIsQ0FBQyxVQUFBLFFBQVEsRUFBSTtBQUMxQyxjQUFLLE9BQU8sQ0FBQyxJQUFJLENBQUMscUJBQXFCLEVBQUUsRUFBQyxNQUFNLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBUixRQUFRLEVBQUMsQ0FBQyxDQUFBO09BQzFFLENBQUMsQ0FBQTtBQUNGLFVBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxXQUFXLENBQUMsQ0FBQTs7QUFFekMsYUFBTyxXQUFXLENBQUE7S0FDbkI7OztXQUNFLGFBQUMsV0FBVyxFQUFFO0FBQ2YsYUFBTyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQTtLQUMxQzs7O1dBQ1Msb0JBQUMsV0FBVyxFQUFFO0FBQ3RCLFVBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLEVBQUU7QUFDdEMsbUJBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtPQUN0QjtLQUNGOzs7OztXQUdNLGlCQUFDLFFBQVEsRUFBRTtBQUNoQixVQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUNuQyxhQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQTtLQUM1Qzs7Ozs7V0FFa0IsNkJBQUMsUUFBUSxFQUFFO0FBQzVCLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMscUJBQXFCLEVBQUUsUUFBUSxDQUFDLENBQUE7S0FDeEQ7OztXQUVNLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtLQUM3Qjs7O1NBL0NrQixhQUFhOzs7cUJBQWIsYUFBYSIsImZpbGUiOiIvVXNlcnMvYWgvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi9pbmRpZS1yZWdpc3RyeS5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCB7RW1pdHRlciwgQ29tcG9zaXRlRGlzcG9zYWJsZX0gZnJvbSAnYXRvbSdcbmltcG9ydCBWYWxpZGF0ZSBmcm9tICcuL3ZhbGlkYXRlJ1xuaW1wb3J0IEluZGllIGZyb20gJy4vaW5kaWUnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEluZGllUmVnaXN0cnkge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXIoKVxuXG4gICAgdGhpcy5pbmRpZUxpbnRlcnMgPSBuZXcgU2V0KClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuZW1pdHRlcilcbiAgfVxuXG4gIHJlZ2lzdGVyKGxpbnRlcikge1xuICAgIFZhbGlkYXRlLmxpbnRlcihsaW50ZXIsIHRydWUpXG4gICAgY29uc3QgaW5kaWVMaW50ZXIgPSBuZXcgSW5kaWUobGludGVyKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChpbmRpZUxpbnRlcilcbiAgICB0aGlzLmluZGllTGludGVycy5hZGQoaW5kaWVMaW50ZXIpXG5cbiAgICBpbmRpZUxpbnRlci5vbkRpZERlc3Ryb3koKCkgPT4ge1xuICAgICAgdGhpcy5pbmRpZUxpbnRlcnMuZGVsZXRlKGluZGllTGludGVyKVxuICAgIH0pXG4gICAgaW5kaWVMaW50ZXIub25EaWRVcGRhdGVNZXNzYWdlcyhtZXNzYWdlcyA9PiB7XG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLXVwZGF0ZS1tZXNzYWdlcycsIHtsaW50ZXI6IGluZGllTGludGVyLCBtZXNzYWdlc30pXG4gICAgfSlcbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnb2JzZXJ2ZScsIGluZGllTGludGVyKVxuXG4gICAgcmV0dXJuIGluZGllTGludGVyXG4gIH1cbiAgaGFzKGluZGllTGludGVyKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5kaWVMaW50ZXJzLmhhcyhpbmRpZUxpbnRlcilcbiAgfVxuICB1bnJlZ2lzdGVyKGluZGllTGludGVyKSB7XG4gICAgaWYgKHRoaXMuaW5kaWVMaW50ZXJzLmhhcyhpbmRpZUxpbnRlcikpIHtcbiAgICAgIGluZGllTGludGVyLmRpc3Bvc2UoKVxuICAgIH1cbiAgfVxuXG4gIC8vIFByaXZhdGUgbWV0aG9kXG4gIG9ic2VydmUoY2FsbGJhY2spIHtcbiAgICB0aGlzLmluZGllTGludGVycy5mb3JFYWNoKGNhbGxiYWNrKVxuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ29ic2VydmUnLCBjYWxsYmFjaylcbiAgfVxuICAvLyBQcml2YXRlIG1ldGhvZFxuICBvbkRpZFVwZGF0ZU1lc3NhZ2VzKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLXVwZGF0ZS1tZXNzYWdlcycsIGNhbGxiYWNrKVxuICB9XG5cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gIH1cbn1cbiJdfQ==
//# sourceURL=/Users/ah/.atom/packages/linter/lib/indie-registry.js
