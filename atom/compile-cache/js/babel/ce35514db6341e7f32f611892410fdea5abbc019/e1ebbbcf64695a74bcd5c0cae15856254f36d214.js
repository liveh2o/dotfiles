Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _atom = require('atom');

var _main = require('./main');

var _main2 = _interopRequireDefault(_main);

var _greeter = require('./greeter');

var _greeter2 = _interopRequireDefault(_greeter);

var greeter = undefined;
var instance = undefined;

exports['default'] = {
  activate: function activate() {
    if (!atom.inSpecMode()) {
      // eslint-disable-next-line global-require
      require('atom-package-deps').install('linter', true);
    }
    greeter = new _greeter2['default']();
    instance = new _main2['default']();

    greeter.activate()['catch'](function (e) {
      return console.error('[Linter-UI-Default] Error', e);
    });
  },
  consumeLinter: function consumeLinter(linter) {
    var linters = [].concat(linter);
    for (var entry of linters) {
      instance.addLinter(entry);
    }
    return new _atom.Disposable(function () {
      for (var entry of linters) {
        instance.deleteLinter(entry);
      }
    });
  },
  consumeLinterLegacy: function consumeLinterLegacy(linter) {
    var linters = [].concat(linter);
    for (var entry of linters) {
      linter.name = linter.name || 'Unknown';
      linter.lintOnFly = Boolean(linter.lintOnFly);
      instance.addLinter(entry, true);
    }
    return new _atom.Disposable(function () {
      for (var entry of linters) {
        instance.deleteLinter(entry);
      }
    });
  },
  consumeUI: function consumeUI(ui) {
    var uis = [].concat(ui);
    for (var entry of uis) {
      instance.addUI(entry);
    }
    return new _atom.Disposable(function () {
      for (var entry of uis) {
        instance.deleteUI(entry);
      }
    });
  },
  provideIndie: function provideIndie() {
    return function (indie) {
      return instance.registryIndie.register(indie, 2);
    };
  },
  provideIndieLegacy: function provideIndieLegacy() {
    return {
      register: function register(indie) {
        return instance.registryIndie.register(indie, 1);
      }
    };
  },
  deactivate: function deactivate() {
    instance.dispose();
    greeter.dispose();
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztvQkFFMkIsTUFBTTs7b0JBQ2QsUUFBUTs7Ozt1QkFDUCxXQUFXOzs7O0FBRy9CLElBQUksT0FBTyxZQUFBLENBQUE7QUFDWCxJQUFJLFFBQVEsWUFBQSxDQUFBOztxQkFFRztBQUNiLFVBQVEsRUFBQSxvQkFBRztBQUNULFFBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLEVBQUU7O0FBRXRCLGFBQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUE7S0FDckQ7QUFDRCxXQUFPLEdBQUcsMEJBQWEsQ0FBQTtBQUN2QixZQUFRLEdBQUcsdUJBQVksQ0FBQTs7QUFFdkIsV0FBTyxDQUFDLFFBQVEsRUFBRSxTQUFNLENBQUMsVUFBQSxDQUFDO2FBQUksT0FBTyxDQUFDLEtBQUssQ0FBQywyQkFBMkIsRUFBRSxDQUFDLENBQUM7S0FBQSxDQUFDLENBQUE7R0FDN0U7QUFDRCxlQUFhLEVBQUEsdUJBQUMsTUFBc0IsRUFBYztBQUNoRCxRQUFNLE9BQU8sR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBQ2pDLFNBQUssSUFBTSxLQUFLLElBQUksT0FBTyxFQUFFO0FBQzNCLGNBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUE7S0FDMUI7QUFDRCxXQUFPLHFCQUFlLFlBQU07QUFDMUIsV0FBSyxJQUFNLEtBQUssSUFBSSxPQUFPLEVBQUU7QUFDM0IsZ0JBQVEsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUE7T0FDN0I7S0FDRixDQUFDLENBQUE7R0FDSDtBQUNELHFCQUFtQixFQUFBLDZCQUFDLE1BQXNCLEVBQWM7QUFDdEQsUUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUNqQyxTQUFLLElBQU0sS0FBSyxJQUFJLE9BQU8sRUFBRTtBQUMzQixZQUFNLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLElBQUksU0FBUyxDQUFBO0FBQ3RDLFlBQU0sQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQTtBQUM1QyxjQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQTtLQUNoQztBQUNELFdBQU8scUJBQWUsWUFBTTtBQUMxQixXQUFLLElBQU0sS0FBSyxJQUFJLE9BQU8sRUFBRTtBQUMzQixnQkFBUSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQTtPQUM3QjtLQUNGLENBQUMsQ0FBQTtHQUNIO0FBQ0QsV0FBUyxFQUFBLG1CQUFDLEVBQU0sRUFBYztBQUM1QixRQUFNLEdBQUcsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFBO0FBQ3pCLFNBQUssSUFBTSxLQUFLLElBQUksR0FBRyxFQUFFO0FBQ3ZCLGNBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUE7S0FDdEI7QUFDRCxXQUFPLHFCQUFlLFlBQU07QUFDMUIsV0FBSyxJQUFNLEtBQUssSUFBSSxHQUFHLEVBQUU7QUFDdkIsZ0JBQVEsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUE7T0FDekI7S0FDRixDQUFDLENBQUE7R0FDSDtBQUNELGNBQVksRUFBQSx3QkFBVztBQUNyQixXQUFPLFVBQUEsS0FBSzthQUNWLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7S0FBQSxDQUFBO0dBQzVDO0FBQ0Qsb0JBQWtCLEVBQUEsOEJBQVc7QUFDM0IsV0FBTztBQUNMLGNBQVEsRUFBRSxrQkFBQSxLQUFLO2VBQUksUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztPQUFBO0tBQzdELENBQUE7R0FDRjtBQUNELFlBQVUsRUFBQSxzQkFBRztBQUNYLFlBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUNsQixXQUFPLENBQUMsT0FBTyxFQUFFLENBQUE7R0FDbEI7Q0FDRiIsImZpbGUiOiIvVXNlcnMvYWgvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCB7IERpc3Bvc2FibGUgfSBmcm9tICdhdG9tJ1xuaW1wb3J0IExpbnRlciBmcm9tICcuL21haW4nXG5pbXBvcnQgR3JlZXRlciBmcm9tICcuL2dyZWV0ZXInXG5pbXBvcnQgdHlwZSB7IFVJLCBMaW50ZXIgYXMgTGludGVyUHJvdmlkZXIgfSBmcm9tICcuL3R5cGVzJ1xuXG5sZXQgZ3JlZXRlclxubGV0IGluc3RhbmNlXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgYWN0aXZhdGUoKSB7XG4gICAgaWYgKCFhdG9tLmluU3BlY01vZGUoKSkge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGdsb2JhbC1yZXF1aXJlXG4gICAgICByZXF1aXJlKCdhdG9tLXBhY2thZ2UtZGVwcycpLmluc3RhbGwoJ2xpbnRlcicsIHRydWUpXG4gICAgfVxuICAgIGdyZWV0ZXIgPSBuZXcgR3JlZXRlcigpXG4gICAgaW5zdGFuY2UgPSBuZXcgTGludGVyKClcblxuICAgIGdyZWV0ZXIuYWN0aXZhdGUoKS5jYXRjaChlID0+IGNvbnNvbGUuZXJyb3IoJ1tMaW50ZXItVUktRGVmYXVsdF0gRXJyb3InLCBlKSlcbiAgfSxcbiAgY29uc3VtZUxpbnRlcihsaW50ZXI6IExpbnRlclByb3ZpZGVyKTogRGlzcG9zYWJsZSB7XG4gICAgY29uc3QgbGludGVycyA9IFtdLmNvbmNhdChsaW50ZXIpXG4gICAgZm9yIChjb25zdCBlbnRyeSBvZiBsaW50ZXJzKSB7XG4gICAgICBpbnN0YW5jZS5hZGRMaW50ZXIoZW50cnkpXG4gICAgfVxuICAgIHJldHVybiBuZXcgRGlzcG9zYWJsZSgoKSA9PiB7XG4gICAgICBmb3IgKGNvbnN0IGVudHJ5IG9mIGxpbnRlcnMpIHtcbiAgICAgICAgaW5zdGFuY2UuZGVsZXRlTGludGVyKGVudHJ5KVxuICAgICAgfVxuICAgIH0pXG4gIH0sXG4gIGNvbnN1bWVMaW50ZXJMZWdhY3kobGludGVyOiBMaW50ZXJQcm92aWRlcik6IERpc3Bvc2FibGUge1xuICAgIGNvbnN0IGxpbnRlcnMgPSBbXS5jb25jYXQobGludGVyKVxuICAgIGZvciAoY29uc3QgZW50cnkgb2YgbGludGVycykge1xuICAgICAgbGludGVyLm5hbWUgPSBsaW50ZXIubmFtZSB8fCAnVW5rbm93bidcbiAgICAgIGxpbnRlci5saW50T25GbHkgPSBCb29sZWFuKGxpbnRlci5saW50T25GbHkpXG4gICAgICBpbnN0YW5jZS5hZGRMaW50ZXIoZW50cnksIHRydWUpXG4gICAgfVxuICAgIHJldHVybiBuZXcgRGlzcG9zYWJsZSgoKSA9PiB7XG4gICAgICBmb3IgKGNvbnN0IGVudHJ5IG9mIGxpbnRlcnMpIHtcbiAgICAgICAgaW5zdGFuY2UuZGVsZXRlTGludGVyKGVudHJ5KVxuICAgICAgfVxuICAgIH0pXG4gIH0sXG4gIGNvbnN1bWVVSSh1aTogVUkpOiBEaXNwb3NhYmxlIHtcbiAgICBjb25zdCB1aXMgPSBbXS5jb25jYXQodWkpXG4gICAgZm9yIChjb25zdCBlbnRyeSBvZiB1aXMpIHtcbiAgICAgIGluc3RhbmNlLmFkZFVJKGVudHJ5KVxuICAgIH1cbiAgICByZXR1cm4gbmV3IERpc3Bvc2FibGUoKCkgPT4ge1xuICAgICAgZm9yIChjb25zdCBlbnRyeSBvZiB1aXMpIHtcbiAgICAgICAgaW5zdGFuY2UuZGVsZXRlVUkoZW50cnkpXG4gICAgICB9XG4gICAgfSlcbiAgfSxcbiAgcHJvdmlkZUluZGllKCk6IE9iamVjdCB7XG4gICAgcmV0dXJuIGluZGllID0+XG4gICAgICBpbnN0YW5jZS5yZWdpc3RyeUluZGllLnJlZ2lzdGVyKGluZGllLCAyKVxuICB9LFxuICBwcm92aWRlSW5kaWVMZWdhY3koKTogT2JqZWN0IHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVnaXN0ZXI6IGluZGllID0+IGluc3RhbmNlLnJlZ2lzdHJ5SW5kaWUucmVnaXN0ZXIoaW5kaWUsIDEpLFxuICAgIH1cbiAgfSxcbiAgZGVhY3RpdmF0ZSgpIHtcbiAgICBpbnN0YW5jZS5kaXNwb3NlKClcbiAgICBncmVldGVyLmRpc3Bvc2UoKVxuICB9LFxufVxuIl19