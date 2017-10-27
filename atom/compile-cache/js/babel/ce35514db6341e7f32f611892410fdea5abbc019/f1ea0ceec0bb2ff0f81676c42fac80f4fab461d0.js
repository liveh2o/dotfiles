Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var _atom = require('atom');

var _main = require('./main');

var _main2 = _interopRequireDefault(_main);

// Internal variables
var instance = undefined;

var idleCallbacks = new Set();

exports['default'] = {
  activate: function activate() {
    this.subscriptions = new _atom.CompositeDisposable();

    instance = new _main2['default']();
    this.subscriptions.add(instance);

    // TODO: Remove this after a few version bumps
    var oldConfigCallbackID = window.requestIdleCallback(_asyncToGenerator(function* () {
      idleCallbacks['delete'](oldConfigCallbackID);
      var FS = require('sb-fs');
      var Path = require('path');
      var Greeter = require('./greeter');

      // Greet the user if they are coming from Linter v1
      var greeter = new Greeter();
      this.subscriptions.add(greeter);
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

      // There was an external config file in use briefly, migrate any use of that to settings
      var oldConfigFile = Path.join(atom.getConfigDirPath(), 'linter-config.json');
      if (yield FS.exists(oldConfigFile)) {
        var disabledProviders = atom.config.get('linter.disabledProviders');
        try {
          var oldConfigFileContents = yield FS.readFile(oldConfigFile, 'utf8');
          disabledProviders = disabledProviders.concat(JSON.parse(oldConfigFileContents).disabled);
        } catch (_) {
          console.error('[Linter] Error reading old state file', _);
        }
        atom.config.set('linter.disabledProviders', disabledProviders);
        try {
          yield FS.unlink(oldConfigFile);
        } catch (_) {/* No Op */}
      }
    }).bind(this));
    idleCallbacks.add(oldConfigCallbackID);

    var linterDepsCallback = window.requestIdleCallback(function linterDepsInstall() {
      idleCallbacks['delete'](linterDepsCallback);
      if (!atom.inSpecMode()) {
        // eslint-disable-next-line global-require
        require('atom-package-deps').install('linter', true);
      }
    });
    idleCallbacks.add(linterDepsCallback);
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
      return instance.addIndie(indie);
    };
  },
  provideIndieLegacy: function provideIndieLegacy() {
    return {
      register: function register(indie) {
        return instance.addLegacyIndie(indie);
      }
    };
  },
  deactivate: function deactivate() {
    idleCallbacks.forEach(function (callbackID) {
      return window.cancelIdleCallback(callbackID);
    });
    idleCallbacks.clear();
    this.subscriptions.dispose();
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O29CQUVnRCxNQUFNOztvQkFFbkMsUUFBUTs7Ozs7QUFJM0IsSUFBSSxRQUFRLFlBQUEsQ0FBQTs7QUFFWixJQUFNLGFBQWEsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBOztxQkFFaEI7QUFDYixVQUFRLEVBQUEsb0JBQUc7QUFDVCxRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFBOztBQUU5QyxZQUFRLEdBQUcsdUJBQVksQ0FBQTtBQUN2QixRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQTs7O0FBR2hDLFFBQU0sbUJBQW1CLEdBQUcsTUFBTSxDQUFDLG1CQUFtQixDQUFDLGtCQUFBLGFBQWtDO0FBQ3ZGLG1CQUFhLFVBQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO0FBQ3pDLFVBQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUMzQixVQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDNUIsVUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFBOzs7QUFHcEMsVUFBTSxPQUFPLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQTtBQUM3QixVQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUMvQixVQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQTs7QUFFL0MsVUFBTSxnQkFBZ0IsR0FBRyxDQUN2QixXQUFXLEVBQ1gsbUJBQW1CLEVBQ25CLHFCQUFxQixFQUNyQix1QkFBdUIsRUFDdkIsb0JBQW9CLEVBQ3BCLGlCQUFpQixFQUNqQix1QkFBdUIsRUFDdkIsZUFBZSxFQUNmLGdCQUFnQixFQUNoQixpQkFBaUIsRUFDakIsa0JBQWtC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QUMsVUFBVSxDQUFDO0tBQUEsQ0FBQyxDQUFBO0FBQzFFLGlCQUFhLENBQUMsS0FBSyxFQUFFLENBQUE7QUFDckIsUUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtHQUM3QjtDQUNGIiwiZmlsZSI6Ii9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSwgRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nXG5cbmltcG9ydCBMaW50ZXIgZnJvbSAnLi9tYWluJ1xuaW1wb3J0IHR5cGUgeyBVSSwgTGludGVyIGFzIExpbnRlclByb3ZpZGVyIH0gZnJvbSAnLi90eXBlcydcblxuLy8gSW50ZXJuYWwgdmFyaWFibGVzXG5sZXQgaW5zdGFuY2VcblxuY29uc3QgaWRsZUNhbGxiYWNrcyA9IG5ldyBTZXQoKVxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGFjdGl2YXRlKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcblxuICAgIGluc3RhbmNlID0gbmV3IExpbnRlcigpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChpbnN0YW5jZSlcblxuICAgIC8vIFRPRE86IFJlbW92ZSB0aGlzIGFmdGVyIGEgZmV3IHZlcnNpb24gYnVtcHNcbiAgICBjb25zdCBvbGRDb25maWdDYWxsYmFja0lEID0gd2luZG93LnJlcXVlc3RJZGxlQ2FsbGJhY2soYXN5bmMgZnVuY3Rpb24gbGludGVyT2xkQ29uZmlncygpIHtcbiAgICAgIGlkbGVDYWxsYmFja3MuZGVsZXRlKG9sZENvbmZpZ0NhbGxiYWNrSUQpXG4gICAgICBjb25zdCBGUyA9IHJlcXVpcmUoJ3NiLWZzJylcbiAgICAgIGNvbnN0IFBhdGggPSByZXF1aXJlKCdwYXRoJylcbiAgICAgIGNvbnN0IEdyZWV0ZXIgPSByZXF1aXJlKCcuL2dyZWV0ZXInKVxuXG4gICAgICAvLyBHcmVldCB0aGUgdXNlciBpZiB0aGV5IGFyZSBjb21pbmcgZnJvbSBMaW50ZXIgdjFcbiAgICAgIGNvbnN0IGdyZWV0ZXIgPSBuZXcgR3JlZXRlcigpXG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGdyZWV0ZXIpXG4gICAgICBjb25zdCBsaW50ZXJDb25maWdzID0gYXRvbS5jb25maWcuZ2V0KCdsaW50ZXInKVxuICAgICAgLy8gVW5zZXQgdjEgY29uZmlnc1xuICAgICAgY29uc3QgcmVtb3ZlZFYxQ29uZmlncyA9IFtcbiAgICAgICAgJ2xpbnRPbkZseScsXG4gICAgICAgICdsaW50T25GbHlJbnRlcnZhbCcsXG4gICAgICAgICdpZ25vcmVkTWVzc2FnZVR5cGVzJyxcbiAgICAgICAgJ2lnbm9yZVZDU0lnbm9yZWRGaWxlcycsXG4gICAgICAgICdpZ25vcmVNYXRjaGVkRmlsZXMnLFxuICAgICAgICAnc2hvd0Vycm9ySW5saW5lJyxcbiAgICAgICAgJ2lubGluZVRvb2x0aXBJbnRlcnZhbCcsXG4gICAgICAgICdndXR0ZXJFbmFibGVkJyxcbiAgICAgICAgJ2d1dHRlclBvc2l0aW9uJyxcbiAgICAgICAgJ3VuZGVybGluZUlzc3VlcycsXG4gICAgICAgICdzaG93UHJvdmlkZXJOYW1lJyxcbiAgICAgICAgJ3Nob3dFcnJvclBhbmVsJyxcbiAgICAgICAgJ2Vycm9yUGFuZWxIZWlnaHQnLFxuICAgICAgICAnYWx3YXlzVGFrZU1pbmltdW1TcGFjZScsXG4gICAgICAgICdkaXNwbGF5TGludGVySW5mbycsXG4gICAgICAgICdkaXNwbGF5TGludGVyU3RhdHVzJyxcbiAgICAgICAgJ3Nob3dFcnJvclRhYkxpbmUnLFxuICAgICAgICAnc2hvd0Vycm9yVGFiRmlsZScsXG4gICAgICAgICdzaG93RXJyb3JUYWJQcm9qZWN0JyxcbiAgICAgICAgJ3N0YXR1c0ljb25TY29wZScsXG4gICAgICAgICdzdGF0dXNJY29uUG9zaXRpb24nLFxuICAgICAgXVxuICAgICAgaWYgKHJlbW92ZWRWMUNvbmZpZ3Muc29tZShjb25maWcgPT4gKHt9Lmhhc093blByb3BlcnR5LmNhbGwobGludGVyQ29uZmlncywgY29uZmlnKSkpKSB7XG4gICAgICAgIGdyZWV0ZXIuc2hvd1dlbGNvbWUoKVxuICAgICAgfVxuICAgICAgcmVtb3ZlZFYxQ29uZmlncy5mb3JFYWNoKChlKSA9PiB7IGF0b20uY29uZmlnLnVuc2V0KGBsaW50ZXIuJHtlfWApIH0pXG5cbiAgICAgIC8vIFRoZXJlIHdhcyBhbiBleHRlcm5hbCBjb25maWcgZmlsZSBpbiB1c2UgYnJpZWZseSwgbWlncmF0ZSBhbnkgdXNlIG9mIHRoYXQgdG8gc2V0dGluZ3NcbiAgICAgIGNvbnN0IG9sZENvbmZpZ0ZpbGUgPSBQYXRoLmpvaW4oYXRvbS5nZXRDb25maWdEaXJQYXRoKCksICdsaW50ZXItY29uZmlnLmpzb24nKVxuICAgICAgaWYgKGF3YWl0IEZTLmV4aXN0cyhvbGRDb25maWdGaWxlKSkge1xuICAgICAgICBsZXQgZGlzYWJsZWRQcm92aWRlcnMgPSBhdG9tLmNvbmZpZy5nZXQoJ2xpbnRlci5kaXNhYmxlZFByb3ZpZGVycycpXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3Qgb2xkQ29uZmlnRmlsZUNvbnRlbnRzID0gYXdhaXQgRlMucmVhZEZpbGUob2xkQ29uZmlnRmlsZSwgJ3V0ZjgnKVxuICAgICAgICAgIGRpc2FibGVkUHJvdmlkZXJzID0gZGlzYWJsZWRQcm92aWRlcnMuY29uY2F0KEpTT04ucGFyc2Uob2xkQ29uZmlnRmlsZUNvbnRlbnRzKS5kaXNhYmxlZClcbiAgICAgICAgfSBjYXRjaCAoXykgeyBjb25zb2xlLmVycm9yKCdbTGludGVyXSBFcnJvciByZWFkaW5nIG9sZCBzdGF0ZSBmaWxlJywgXykgfVxuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ2xpbnRlci5kaXNhYmxlZFByb3ZpZGVycycsIGRpc2FibGVkUHJvdmlkZXJzKVxuICAgICAgICB0cnkge1xuICAgICAgICAgIGF3YWl0IEZTLnVubGluayhvbGRDb25maWdGaWxlKVxuICAgICAgICB9IGNhdGNoIChfKSB7IC8qIE5vIE9wICovIH1cbiAgICAgIH1cbiAgICB9LmJpbmQodGhpcykpXG4gICAgaWRsZUNhbGxiYWNrcy5hZGQob2xkQ29uZmlnQ2FsbGJhY2tJRClcblxuICAgIGNvbnN0IGxpbnRlckRlcHNDYWxsYmFjayA9IHdpbmRvdy5yZXF1ZXN0SWRsZUNhbGxiYWNrKGZ1bmN0aW9uIGxpbnRlckRlcHNJbnN0YWxsKCkge1xuICAgICAgaWRsZUNhbGxiYWNrcy5kZWxldGUobGludGVyRGVwc0NhbGxiYWNrKVxuICAgICAgaWYgKCFhdG9tLmluU3BlY01vZGUoKSkge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZ2xvYmFsLXJlcXVpcmVcbiAgICAgICAgcmVxdWlyZSgnYXRvbS1wYWNrYWdlLWRlcHMnKS5pbnN0YWxsKCdsaW50ZXInLCB0cnVlKVxuICAgICAgfVxuICAgIH0pXG4gICAgaWRsZUNhbGxiYWNrcy5hZGQobGludGVyRGVwc0NhbGxiYWNrKVxuICB9LFxuICBjb25zdW1lTGludGVyKGxpbnRlcjogTGludGVyUHJvdmlkZXIpOiBEaXNwb3NhYmxlIHtcbiAgICBjb25zdCBsaW50ZXJzID0gW10uY29uY2F0KGxpbnRlcilcbiAgICBmb3IgKGNvbnN0IGVudHJ5IG9mIGxpbnRlcnMpIHtcbiAgICAgIGluc3RhbmNlLmFkZExpbnRlcihlbnRyeSlcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBEaXNwb3NhYmxlKCgpID0+IHtcbiAgICAgIGZvciAoY29uc3QgZW50cnkgb2YgbGludGVycykge1xuICAgICAgICBpbnN0YW5jZS5kZWxldGVMaW50ZXIoZW50cnkpXG4gICAgICB9XG4gICAgfSlcbiAgfSxcbiAgY29uc3VtZUxpbnRlckxlZ2FjeShsaW50ZXI6IExpbnRlclByb3ZpZGVyKTogRGlzcG9zYWJsZSB7XG4gICAgY29uc3QgbGludGVycyA9IFtdLmNvbmNhdChsaW50ZXIpXG4gICAgZm9yIChjb25zdCBlbnRyeSBvZiBsaW50ZXJzKSB7XG4gICAgICBsaW50ZXIubmFtZSA9IGxpbnRlci5uYW1lIHx8ICdVbmtub3duJ1xuICAgICAgbGludGVyLmxpbnRPbkZseSA9IEJvb2xlYW4obGludGVyLmxpbnRPbkZseSlcbiAgICAgIGluc3RhbmNlLmFkZExpbnRlcihlbnRyeSwgdHJ1ZSlcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBEaXNwb3NhYmxlKCgpID0+IHtcbiAgICAgIGZvciAoY29uc3QgZW50cnkgb2YgbGludGVycykge1xuICAgICAgICBpbnN0YW5jZS5kZWxldGVMaW50ZXIoZW50cnkpXG4gICAgICB9XG4gICAgfSlcbiAgfSxcbiAgY29uc3VtZVVJKHVpOiBVSSk6IERpc3Bvc2FibGUge1xuICAgIGNvbnN0IHVpcyA9IFtdLmNvbmNhdCh1aSlcbiAgICBmb3IgKGNvbnN0IGVudHJ5IG9mIHVpcykge1xuICAgICAgaW5zdGFuY2UuYWRkVUkoZW50cnkpXG4gICAgfVxuICAgIHJldHVybiBuZXcgRGlzcG9zYWJsZSgoKSA9PiB7XG4gICAgICBmb3IgKGNvbnN0IGVudHJ5IG9mIHVpcykge1xuICAgICAgICBpbnN0YW5jZS5kZWxldGVVSShlbnRyeSlcbiAgICAgIH1cbiAgICB9KVxuICB9LFxuICBwcm92aWRlSW5kaWUoKTogT2JqZWN0IHtcbiAgICByZXR1cm4gaW5kaWUgPT5cbiAgICAgIGluc3RhbmNlLmFkZEluZGllKGluZGllKVxuICB9LFxuICBwcm92aWRlSW5kaWVMZWdhY3koKTogT2JqZWN0IHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVnaXN0ZXI6IGluZGllID0+IGluc3RhbmNlLmFkZExlZ2FjeUluZGllKGluZGllKSxcbiAgICB9XG4gIH0sXG4gIGRlYWN0aXZhdGUoKSB7XG4gICAgaWRsZUNhbGxiYWNrcy5mb3JFYWNoKGNhbGxiYWNrSUQgPT4gd2luZG93LmNhbmNlbElkbGVDYWxsYmFjayhjYWxsYmFja0lEKSlcbiAgICBpZGxlQ2FsbGJhY2tzLmNsZWFyKClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gIH0sXG59XG4iXX0=