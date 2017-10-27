Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var Commands = (function () {
  function Commands() {
    var _this = this;

    _classCallCheck(this, Commands);

    this.emitter = new _atom.Emitter();
    this.subscriptions = new _atom.CompositeDisposable();

    this.subscriptions.add(this.emitter);
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'linter:enable-linter': function linterEnableLinter() {
        return _this.enableLinter();
      },
      'linter:disable-linter': function linterDisableLinter() {
        return _this.disableLinter();
      }
    }));
    this.subscriptions.add(atom.commands.add('atom-text-editor:not([mini])', {
      'linter:lint': function linterLint() {
        return _this.lint();
      },
      'linter:debug': function linterDebug() {
        return _this.debug();
      },
      'linter:toggle-active-editor': function linterToggleActiveEditor() {
        return _this.toggleActiveEditor();
      }
    }));
  }

  _createClass(Commands, [{
    key: 'lint',
    value: function lint() {
      this.emitter.emit('should-lint');
    }
  }, {
    key: 'debug',
    value: function debug() {
      this.emitter.emit('should-debug');
    }
  }, {
    key: 'enableLinter',
    value: function enableLinter() {
      this.emitter.emit('should-toggle-linter', 'enable');
    }
  }, {
    key: 'disableLinter',
    value: function disableLinter() {
      this.emitter.emit('should-toggle-linter', 'disable');
    }
  }, {
    key: 'toggleActiveEditor',
    value: function toggleActiveEditor() {
      this.emitter.emit('should-toggle-active-editor');
    }
  }, {
    key: 'onShouldLint',
    value: function onShouldLint(callback) {
      return this.emitter.on('should-lint', callback);
    }
  }, {
    key: 'onShouldDebug',
    value: function onShouldDebug(callback) {
      return this.emitter.on('should-debug', callback);
    }
  }, {
    key: 'onShouldToggleActiveEditor',
    value: function onShouldToggleActiveEditor(callback) {
      return this.emitter.on('should-toggle-active-editor', callback);
    }
  }, {
    key: 'onShouldToggleLinter',
    value: function onShouldToggleLinter(callback) {
      return this.emitter.on('should-toggle-linter', callback);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
    }
  }]);

  return Commands;
})();

exports['default'] = Commands;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL2NvbW1hbmRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O29CQUU2QyxNQUFNOztJQUc5QixRQUFRO0FBSWhCLFdBSlEsUUFBUSxHQUliOzs7MEJBSkssUUFBUTs7QUFLekIsUUFBSSxDQUFDLE9BQU8sR0FBRyxtQkFBYSxDQUFBO0FBQzVCLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7O0FBRTlDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUNwQyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRTtBQUN6RCw0QkFBc0IsRUFBRTtlQUFNLE1BQUssWUFBWSxFQUFFO09BQUE7QUFDakQsNkJBQXVCLEVBQUU7ZUFBTSxNQUFLLGFBQWEsRUFBRTtPQUFBO0tBQ3BELENBQUMsQ0FBQyxDQUFBO0FBQ0gsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsOEJBQThCLEVBQUU7QUFDdkUsbUJBQWEsRUFBRTtlQUFNLE1BQUssSUFBSSxFQUFFO09BQUE7QUFDaEMsb0JBQWMsRUFBRTtlQUFNLE1BQUssS0FBSyxFQUFFO09BQUE7QUFDbEMsbUNBQTZCLEVBQUU7ZUFBTSxNQUFLLGtCQUFrQixFQUFFO09BQUE7S0FDL0QsQ0FBQyxDQUFDLENBQUE7R0FDSjs7ZUFsQmtCLFFBQVE7O1dBbUJ2QixnQkFBRztBQUNMLFVBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFBO0tBQ2pDOzs7V0FDSSxpQkFBRztBQUNOLFVBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFBO0tBQ2xDOzs7V0FDVyx3QkFBRztBQUNiLFVBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLHNCQUFzQixFQUFFLFFBQVEsQ0FBQyxDQUFBO0tBQ3BEOzs7V0FDWSx5QkFBRztBQUNkLFVBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLHNCQUFzQixFQUFFLFNBQVMsQ0FBQyxDQUFBO0tBQ3JEOzs7V0FDaUIsOEJBQUc7QUFDbkIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsNkJBQTZCLENBQUMsQ0FBQTtLQUNqRDs7O1dBQ1csc0JBQUMsUUFBa0IsRUFBYztBQUMzQyxhQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxRQUFRLENBQUMsQ0FBQTtLQUNoRDs7O1dBQ1ksdUJBQUMsUUFBa0IsRUFBYztBQUM1QyxhQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLGNBQWMsRUFBRSxRQUFRLENBQUMsQ0FBQTtLQUNqRDs7O1dBQ3lCLG9DQUFDLFFBQWtCLEVBQWM7QUFDekQsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyw2QkFBNkIsRUFBRSxRQUFRLENBQUMsQ0FBQTtLQUNoRTs7O1dBQ21CLDhCQUFDLFFBQWtCLEVBQWM7QUFDbkQsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxzQkFBc0IsRUFBRSxRQUFRLENBQUMsQ0FBQTtLQUN6RDs7O1dBQ00sbUJBQUc7QUFDUixVQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFBO0tBQzdCOzs7U0FoRGtCLFFBQVE7OztxQkFBUixRQUFRIiwiZmlsZSI6Ii9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL2NvbW1hbmRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSwgRW1pdHRlciB9IGZyb20gJ2F0b20nXG5pbXBvcnQgdHlwZSB7IERpc3Bvc2FibGUgfSBmcm9tICdhdG9tJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb21tYW5kcyB7XG4gIGVtaXR0ZXI6IEVtaXR0ZXI7XG4gIHN1YnNjcmlwdGlvbnM6IENvbXBvc2l0ZURpc3Bvc2FibGU7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXIoKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5lbWl0dGVyKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywge1xuICAgICAgJ2xpbnRlcjplbmFibGUtbGludGVyJzogKCkgPT4gdGhpcy5lbmFibGVMaW50ZXIoKSxcbiAgICAgICdsaW50ZXI6ZGlzYWJsZS1saW50ZXInOiAoKSA9PiB0aGlzLmRpc2FibGVMaW50ZXIoKSxcbiAgICB9KSlcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXRleHQtZWRpdG9yOm5vdChbbWluaV0pJywge1xuICAgICAgJ2xpbnRlcjpsaW50JzogKCkgPT4gdGhpcy5saW50KCksXG4gICAgICAnbGludGVyOmRlYnVnJzogKCkgPT4gdGhpcy5kZWJ1ZygpLFxuICAgICAgJ2xpbnRlcjp0b2dnbGUtYWN0aXZlLWVkaXRvcic6ICgpID0+IHRoaXMudG9nZ2xlQWN0aXZlRWRpdG9yKCksXG4gICAgfSkpXG4gIH1cbiAgbGludCgpIHtcbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnc2hvdWxkLWxpbnQnKVxuICB9XG4gIGRlYnVnKCkge1xuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdzaG91bGQtZGVidWcnKVxuICB9XG4gIGVuYWJsZUxpbnRlcigpIHtcbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnc2hvdWxkLXRvZ2dsZS1saW50ZXInLCAnZW5hYmxlJylcbiAgfVxuICBkaXNhYmxlTGludGVyKCkge1xuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdzaG91bGQtdG9nZ2xlLWxpbnRlcicsICdkaXNhYmxlJylcbiAgfVxuICB0b2dnbGVBY3RpdmVFZGl0b3IoKSB7XG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ3Nob3VsZC10b2dnbGUtYWN0aXZlLWVkaXRvcicpXG4gIH1cbiAgb25TaG91bGRMaW50KGNhbGxiYWNrOiBGdW5jdGlvbik6IERpc3Bvc2FibGUge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ3Nob3VsZC1saW50JywgY2FsbGJhY2spXG4gIH1cbiAgb25TaG91bGREZWJ1ZyhjYWxsYmFjazogRnVuY3Rpb24pOiBEaXNwb3NhYmxlIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdzaG91bGQtZGVidWcnLCBjYWxsYmFjaylcbiAgfVxuICBvblNob3VsZFRvZ2dsZUFjdGl2ZUVkaXRvcihjYWxsYmFjazogRnVuY3Rpb24pOiBEaXNwb3NhYmxlIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdzaG91bGQtdG9nZ2xlLWFjdGl2ZS1lZGl0b3InLCBjYWxsYmFjaylcbiAgfVxuICBvblNob3VsZFRvZ2dsZUxpbnRlcihjYWxsYmFjazogRnVuY3Rpb24pOiBEaXNwb3NhYmxlIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdzaG91bGQtdG9nZ2xlLWxpbnRlcicsIGNhbGxiYWNrKVxuICB9XG4gIGRpc3Bvc2UoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICB9XG59XG4iXX0=