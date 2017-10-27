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
    greeter = new _greeter2['default']();

    var linterConfigs = atom.config.get('linter');
    // Unset v1 configs
    var removedV1Configs = ['lintOnFly', 'lintOnFlyInterval', 'ignoredMessageTypes', 'ignoreVCSIgnoredFiles', 'ignoreMatchedFiles', 'showErrorInline', 'inlineTooltipInterval', 'gutterEnabled', 'gutterPosition', 'underlineIssues', 'showProviderName', 'showErrorPanel', 'errorPanelHeight', 'alwaysTakeMinimumSpace', 'displayLinterInfo', 'displayLinterStatus', 'showErrorTabLine', 'showErrorTabFile', 'showErrorTabProject', 'statusIconScope', 'statusIconPosition'];
    if (removedV1Configs.some(function (config) {
      return ({}).hasOwnProperty.call(linterConfigs, config);
    })) {
      greeter.showWelcome();
    }
    removedV1Configs.forEach(function (e) {
      atom.config.unset('linter.' + e);
    });

    if (!atom.inSpecMode()) {
      // eslint-disable-next-line global-require
      require('atom-package-deps').install('linter', true);
    }

    instance = new _main2['default']();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztvQkFFMkIsTUFBTTs7b0JBQ2QsUUFBUTs7Ozt1QkFDUCxXQUFXOzs7O0FBRy9CLElBQUksT0FBTyxZQUFBLENBQUE7QUFDWCxJQUFJLFFBQVEsWUFBQSxDQUFBOztxQkFFRztBQUNiLFVBQVEsRUFBQSxvQkFBRztBQUNULFdBQU8sR0FBRywwQkFBYSxDQUFBOztBQUV2QixRQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQTs7QUFFL0MsUUFBTSxnQkFBZ0IsR0FBRyxDQUN2QixXQUFXLEVBQ1gsbUJBQW1CLEVBQ25CLHFCQUFxQixFQUNyQix1QkFBdUIsRUFDdkIsb0JBQW9CLEVBQ3BCLGlCQUFpQixFQUNqQix1QkFBdUIsRUFDdkIsZUFBZSxFQUNmLGdCQUFnQixFQUNoQixpQkFBaUIsRUFDakIsa0JBQWtCLEVBQ2xCLGdCQUFnQixFQUNoQixrQkFBa0IsRUFDbEIsd0JBQXdCLEVBQ3hCLG1CQUFtQixFQUNuQixxQkFBcUIsRUFDckIsa0JBQWtCLEVBQ2xCLGtCQUFrQixFQUNsQixxQkFBcUIsRUFDckIsaUJBQWlCLEVBQ2pCLG9CQUFvQixDQUNyQixDQUFBO0FBQ0QsUUFBSSxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsVUFBQSxNQUFNO2FBQUssQ0FBQSxHQUFFLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsTUFBTSxDQUFDO0tBQUMsQ0FBQyxFQUFFO0FBQ3BGLGFBQU8sQ0FBQyxXQUFXLEVBQUUsQ0FBQTtLQUN0QjtBQUNELG9CQUFnQixDQUFDLE9BQU8sQ0FBQyxVQUFDLENBQUMsRUFBSztBQUFFLFVBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxhQUFXLENBQUMsQ0FBRyxDQUFBO0tBQUUsQ0FBQyxDQUFBOztBQUVyRSxRQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxFQUFFOztBQUV0QixhQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFBO0tBQ3JEOztBQUVELFlBQVEsR0FBRyx1QkFBWSxDQUFBO0dBQ3hCO0FBQ0QsZUFBYSxFQUFBLHVCQUFDLE1BQXNCLEVBQWM7QUFDaEQsUUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUNqQyxTQUFLLElBQU0sS0FBSyxJQUFJLE9BQU8sRUFBRTtBQUMzQixjQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFBO0tBQzFCO0FBQ0QsV0FBTyxxQkFBZSxZQUFNO0FBQzFCLFdBQUssSUFBTSxLQUFLLElBQUksT0FBTyxFQUFFO0FBQzNCLGdCQUFRLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFBO09BQzdCO0tBQ0YsQ0FBQyxDQUFBO0dBQ0g7QUFDRCxxQkFBbUIsRUFBQSw2QkFBQyxNQUFzQixFQUFjO0FBQ3RELFFBQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDakMsU0FBSyxJQUFNLEtBQUssSUFBSSxPQUFPLEVBQUU7QUFDM0IsWUFBTSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxJQUFJLFNBQVMsQ0FBQTtBQUN0QyxZQUFNLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUE7QUFDNUMsY0FBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUE7S0FDaEM7QUFDRCxXQUFPLHFCQUFlLFlBQU07QUFDMUIsV0FBSyxJQUFNLEtBQUssSUFBSSxPQUFPLEVBQUU7QUFDM0IsZ0JBQVEsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUE7T0FDN0I7S0FDRixDQUFDLENBQUE7R0FDSDtBQUNELFdBQVMsRUFBQSxtQkFBQyxFQUFNLEVBQWM7QUFDNUIsUUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQTtBQUN6QixTQUFLLElBQU0sS0FBSyxJQUFJLEdBQUcsRUFBRTtBQUN2QixjQUFRLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFBO0tBQ3RCO0FBQ0QsV0FBTyxxQkFBZSxZQUFNO0FBQzFCLFdBQUssSUFBTSxLQUFLLElBQUksR0FBRyxFQUFFO0FBQ3ZCLGdCQUFRLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFBO09BQ3pCO0tBQ0YsQ0FBQyxDQUFBO0dBQ0g7QUFDRCxjQUFZLEVBQUEsd0JBQVc7QUFDckIsV0FBTyxVQUFBLEtBQUs7YUFDVixRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO0tBQUEsQ0FBQTtHQUM1QztBQUNELG9CQUFrQixFQUFBLDhCQUFXO0FBQzNCLFdBQU87QUFDTCxjQUFRLEVBQUUsa0JBQUEsS0FBSztlQUFJLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7T0FBQTtLQUM3RCxDQUFBO0dBQ0Y7QUFDRCxZQUFVLEVBQUEsc0JBQUc7QUFDWCxZQUFRLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDbEIsV0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFBO0dBQ2xCO0NBQ0YiLCJmaWxlIjoiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgeyBEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcbmltcG9ydCBMaW50ZXIgZnJvbSAnLi9tYWluJ1xuaW1wb3J0IEdyZWV0ZXIgZnJvbSAnLi9ncmVldGVyJ1xuaW1wb3J0IHR5cGUgeyBVSSwgTGludGVyIGFzIExpbnRlclByb3ZpZGVyIH0gZnJvbSAnLi90eXBlcydcblxubGV0IGdyZWV0ZXJcbmxldCBpbnN0YW5jZVxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGFjdGl2YXRlKCkge1xuICAgIGdyZWV0ZXIgPSBuZXcgR3JlZXRlcigpXG5cbiAgICBjb25zdCBsaW50ZXJDb25maWdzID0gYXRvbS5jb25maWcuZ2V0KCdsaW50ZXInKVxuICAgIC8vIFVuc2V0IHYxIGNvbmZpZ3NcbiAgICBjb25zdCByZW1vdmVkVjFDb25maWdzID0gW1xuICAgICAgJ2xpbnRPbkZseScsXG4gICAgICAnbGludE9uRmx5SW50ZXJ2YWwnLFxuICAgICAgJ2lnbm9yZWRNZXNzYWdlVHlwZXMnLFxuICAgICAgJ2lnbm9yZVZDU0lnbm9yZWRGaWxlcycsXG4gICAgICAnaWdub3JlTWF0Y2hlZEZpbGVzJyxcbiAgICAgICdzaG93RXJyb3JJbmxpbmUnLFxuICAgICAgJ2lubGluZVRvb2x0aXBJbnRlcnZhbCcsXG4gICAgICAnZ3V0dGVyRW5hYmxlZCcsXG4gICAgICAnZ3V0dGVyUG9zaXRpb24nLFxuICAgICAgJ3VuZGVybGluZUlzc3VlcycsXG4gICAgICAnc2hvd1Byb3ZpZGVyTmFtZScsXG4gICAgICAnc2hvd0Vycm9yUGFuZWwnLFxuICAgICAgJ2Vycm9yUGFuZWxIZWlnaHQnLFxuICAgICAgJ2Fsd2F5c1Rha2VNaW5pbXVtU3BhY2UnLFxuICAgICAgJ2Rpc3BsYXlMaW50ZXJJbmZvJyxcbiAgICAgICdkaXNwbGF5TGludGVyU3RhdHVzJyxcbiAgICAgICdzaG93RXJyb3JUYWJMaW5lJyxcbiAgICAgICdzaG93RXJyb3JUYWJGaWxlJyxcbiAgICAgICdzaG93RXJyb3JUYWJQcm9qZWN0JyxcbiAgICAgICdzdGF0dXNJY29uU2NvcGUnLFxuICAgICAgJ3N0YXR1c0ljb25Qb3NpdGlvbicsXG4gICAgXVxuICAgIGlmIChyZW1vdmVkVjFDb25maWdzLnNvbWUoY29uZmlnID0+ICh7fS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGxpbnRlckNvbmZpZ3MsIGNvbmZpZykpKSkge1xuICAgICAgZ3JlZXRlci5zaG93V2VsY29tZSgpXG4gICAgfVxuICAgIHJlbW92ZWRWMUNvbmZpZ3MuZm9yRWFjaCgoZSkgPT4geyBhdG9tLmNvbmZpZy51bnNldChgbGludGVyLiR7ZX1gKSB9KVxuXG4gICAgaWYgKCFhdG9tLmluU3BlY01vZGUoKSkge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGdsb2JhbC1yZXF1aXJlXG4gICAgICByZXF1aXJlKCdhdG9tLXBhY2thZ2UtZGVwcycpLmluc3RhbGwoJ2xpbnRlcicsIHRydWUpXG4gICAgfVxuXG4gICAgaW5zdGFuY2UgPSBuZXcgTGludGVyKClcbiAgfSxcbiAgY29uc3VtZUxpbnRlcihsaW50ZXI6IExpbnRlclByb3ZpZGVyKTogRGlzcG9zYWJsZSB7XG4gICAgY29uc3QgbGludGVycyA9IFtdLmNvbmNhdChsaW50ZXIpXG4gICAgZm9yIChjb25zdCBlbnRyeSBvZiBsaW50ZXJzKSB7XG4gICAgICBpbnN0YW5jZS5hZGRMaW50ZXIoZW50cnkpXG4gICAgfVxuICAgIHJldHVybiBuZXcgRGlzcG9zYWJsZSgoKSA9PiB7XG4gICAgICBmb3IgKGNvbnN0IGVudHJ5IG9mIGxpbnRlcnMpIHtcbiAgICAgICAgaW5zdGFuY2UuZGVsZXRlTGludGVyKGVudHJ5KVxuICAgICAgfVxuICAgIH0pXG4gIH0sXG4gIGNvbnN1bWVMaW50ZXJMZWdhY3kobGludGVyOiBMaW50ZXJQcm92aWRlcik6IERpc3Bvc2FibGUge1xuICAgIGNvbnN0IGxpbnRlcnMgPSBbXS5jb25jYXQobGludGVyKVxuICAgIGZvciAoY29uc3QgZW50cnkgb2YgbGludGVycykge1xuICAgICAgbGludGVyLm5hbWUgPSBsaW50ZXIubmFtZSB8fCAnVW5rbm93bidcbiAgICAgIGxpbnRlci5saW50T25GbHkgPSBCb29sZWFuKGxpbnRlci5saW50T25GbHkpXG4gICAgICBpbnN0YW5jZS5hZGRMaW50ZXIoZW50cnksIHRydWUpXG4gICAgfVxuICAgIHJldHVybiBuZXcgRGlzcG9zYWJsZSgoKSA9PiB7XG4gICAgICBmb3IgKGNvbnN0IGVudHJ5IG9mIGxpbnRlcnMpIHtcbiAgICAgICAgaW5zdGFuY2UuZGVsZXRlTGludGVyKGVudHJ5KVxuICAgICAgfVxuICAgIH0pXG4gIH0sXG4gIGNvbnN1bWVVSSh1aTogVUkpOiBEaXNwb3NhYmxlIHtcbiAgICBjb25zdCB1aXMgPSBbXS5jb25jYXQodWkpXG4gICAgZm9yIChjb25zdCBlbnRyeSBvZiB1aXMpIHtcbiAgICAgIGluc3RhbmNlLmFkZFVJKGVudHJ5KVxuICAgIH1cbiAgICByZXR1cm4gbmV3IERpc3Bvc2FibGUoKCkgPT4ge1xuICAgICAgZm9yIChjb25zdCBlbnRyeSBvZiB1aXMpIHtcbiAgICAgICAgaW5zdGFuY2UuZGVsZXRlVUkoZW50cnkpXG4gICAgICB9XG4gICAgfSlcbiAgfSxcbiAgcHJvdmlkZUluZGllKCk6IE9iamVjdCB7XG4gICAgcmV0dXJuIGluZGllID0+XG4gICAgICBpbnN0YW5jZS5yZWdpc3RyeUluZGllLnJlZ2lzdGVyKGluZGllLCAyKVxuICB9LFxuICBwcm92aWRlSW5kaWVMZWdhY3koKTogT2JqZWN0IHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVnaXN0ZXI6IGluZGllID0+IGluc3RhbmNlLnJlZ2lzdHJ5SW5kaWUucmVnaXN0ZXIoaW5kaWUsIDEpLFxuICAgIH1cbiAgfSxcbiAgZGVhY3RpdmF0ZSgpIHtcbiAgICBpbnN0YW5jZS5kaXNwb3NlKClcbiAgICBncmVldGVyLmRpc3Bvc2UoKVxuICB9LFxufVxuIl19