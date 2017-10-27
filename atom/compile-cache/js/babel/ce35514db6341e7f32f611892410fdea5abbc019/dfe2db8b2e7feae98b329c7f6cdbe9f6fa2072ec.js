Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var Helpers = undefined;
var manifest = undefined;

function formatItem(item) {
  var name = undefined;
  if (item && typeof item === 'object' && typeof item.name === 'string') {
    name = item.name;
  } else if (typeof item === 'string') {
    name = item;
  } else {
    throw new Error('Unknown object passed to formatItem()');
  }
  return '  - ' + name;
}
function sortByName(item1, item2) {
  return item1.name.localeCompare(item2.name);
}

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
    key: 'showDebug',
    value: function showDebug(standardLinters, indieLinters, uiProviders) {
      if (!manifest) {
        manifest = require('../package.json');
      }
      if (!Helpers) {
        Helpers = require('./helpers');
      }

      var textEditor = atom.workspace.getActiveTextEditor();
      var textEditorScopes = Helpers.getEditorCursorScopes(textEditor);
      var sortedLinters = standardLinters.slice().sort(sortByName);
      var sortedIndieLinters = indieLinters.slice().sort(sortByName);
      var sortedUIProviders = uiProviders.slice().sort(sortByName);

      var indieLinterNames = sortedIndieLinters.map(formatItem).join('\n');
      var standardLinterNames = sortedLinters.map(formatItem).join('\n');
      var matchingStandardLinters = sortedLinters.filter(function (linter) {
        return Helpers.shouldTriggerLinter(linter, false, textEditorScopes);
      }).map(formatItem).join('\n');
      var humanizedScopes = textEditorScopes.map(formatItem).join('\n');
      var uiProviderNames = sortedUIProviders.map(formatItem).join('\n');

      var ignoreGlob = atom.config.get('linter.ignoreGlob');
      var ignoreVCSIgnoredPaths = atom.config.get('core.excludeVcsIgnoredPaths');
      var disabledLinters = atom.config.get('linter.disabledProviders').map(formatItem).join('\n');
      var filePathIgnored = Helpers.isPathIgnored(textEditor.getPath(), ignoreGlob, ignoreVCSIgnoredPaths);

      atom.notifications.addInfo('Linter Debug Info', {
        detail: ['Platform: ' + process.platform, 'Atom Version: ' + atom.getVersion(), 'Linter Version: ' + manifest.version, 'Opened file is ignored: ' + (filePathIgnored ? 'Yes' : 'No'), 'Matching Linter Providers: \n' + matchingStandardLinters, 'Disabled Linter Providers: \n' + disabledLinters, 'Standard Linter Providers: \n' + standardLinterNames, 'Indie Linter Providers: \n' + indieLinterNames, 'UI Providers: \n' + uiProviderNames, 'Ignore Glob: ' + ignoreGlob, 'VCS Ignored Paths are excluded: ' + ignoreVCSIgnoredPaths, 'Current File Scopes: \n' + humanizedScopes].join('\n'),
        dismissable: true
      });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL2NvbW1hbmRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O29CQUU2QyxNQUFNOztBQUtuRCxJQUFJLE9BQU8sWUFBQSxDQUFBO0FBQ1gsSUFBSSxRQUFRLFlBQUEsQ0FBQTs7QUFFWixTQUFTLFVBQVUsQ0FBQyxJQUFJLEVBQUU7QUFDeEIsTUFBSSxJQUFJLFlBQUEsQ0FBQTtBQUNSLE1BQUksSUFBSSxJQUFJLE9BQU8sSUFBSSxLQUFLLFFBQVEsSUFBSSxPQUFPLElBQUksQ0FBQyxJQUFJLEtBQUssUUFBUSxFQUFFO0FBQ3JFLFFBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFBO0dBQ2pCLE1BQU0sSUFBSSxPQUFPLElBQUksS0FBSyxRQUFRLEVBQUU7QUFDbkMsUUFBSSxHQUFHLElBQUksQ0FBQTtHQUNaLE1BQU07QUFDTCxVQUFNLElBQUksS0FBSyxDQUFDLHVDQUF1QyxDQUFDLENBQUE7R0FDekQ7QUFDRCxrQkFBYyxJQUFJLENBQUU7Q0FDckI7QUFDRCxTQUFTLFVBQVUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFO0FBQ2hDLFNBQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFBO0NBQzVDOztJQUVvQixRQUFRO0FBSWhCLFdBSlEsUUFBUSxHQUliOzs7MEJBSkssUUFBUTs7QUFLekIsUUFBSSxDQUFDLE9BQU8sR0FBRyxtQkFBYSxDQUFBO0FBQzVCLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7O0FBRTlDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUNwQyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRTtBQUN6RCw0QkFBc0IsRUFBRTtlQUFNLE1BQUssWUFB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RUFBRSxRQUFRLENBQUMsQ0FBQTtLQUNoRTs7O1dBQ21CLDhCQUFDLFFBQWtCLEVBQWM7QUFDbkQsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxzQkFBc0IsRUFBRSxRQUFRLENBQUMsQ0FBQTtLQUN6RDs7O1dBQ00sbUJBQUc7QUFDUixVQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFBO0tBQzdCOzs7U0FsR2tCLFFBQVE7OztxQkFBUixRQUFRIiwiZmlsZSI6Ii9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL2NvbW1hbmRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSwgRW1pdHRlciB9IGZyb20gJ2F0b20nXG5pbXBvcnQgdHlwZSB7IERpc3Bvc2FibGUgfSBmcm9tICdhdG9tJ1xuaW1wb3J0IHR5cGUgeyBMaW50ZXIsIFVJIH0gZnJvbSAnLi90eXBlcydcbmltcG9ydCB0eXBlIEluZGllRGVsZWdhdGUgZnJvbSAnLi9pbmRpZS1kZWxlZ2F0ZSdcblxubGV0IEhlbHBlcnNcbmxldCBtYW5pZmVzdFxuXG5mdW5jdGlvbiBmb3JtYXRJdGVtKGl0ZW0pIHtcbiAgbGV0IG5hbWVcbiAgaWYgKGl0ZW0gJiYgdHlwZW9mIGl0ZW0gPT09ICdvYmplY3QnICYmIHR5cGVvZiBpdGVtLm5hbWUgPT09ICdzdHJpbmcnKSB7XG4gICAgbmFtZSA9IGl0ZW0ubmFtZVxuICB9IGVsc2UgaWYgKHR5cGVvZiBpdGVtID09PSAnc3RyaW5nJykge1xuICAgIG5hbWUgPSBpdGVtXG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIG9iamVjdCBwYXNzZWQgdG8gZm9ybWF0SXRlbSgpJylcbiAgfVxuICByZXR1cm4gYCAgLSAke25hbWV9YFxufVxuZnVuY3Rpb24gc29ydEJ5TmFtZShpdGVtMSwgaXRlbTIpIHtcbiAgcmV0dXJuIGl0ZW0xLm5hbWUubG9jYWxlQ29tcGFyZShpdGVtMi5uYW1lKVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb21tYW5kcyB7XG4gIGVtaXR0ZXI6IEVtaXR0ZXI7XG4gIHN1YnNjcmlwdGlvbnM6IENvbXBvc2l0ZURpc3Bvc2FibGU7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXIoKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5lbWl0dGVyKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywge1xuICAgICAgJ2xpbnRlcjplbmFibGUtbGludGVyJzogKCkgPT4gdGhpcy5lbmFibGVMaW50ZXIoKSxcbiAgICAgICdsaW50ZXI6ZGlzYWJsZS1saW50ZXInOiAoKSA9PiB0aGlzLmRpc2FibGVMaW50ZXIoKSxcbiAgICB9KSlcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXRleHQtZWRpdG9yOm5vdChbbWluaV0pJywge1xuICAgICAgJ2xpbnRlcjpsaW50JzogKCkgPT4gdGhpcy5saW50KCksXG4gICAgICAnbGludGVyOmRlYnVnJzogKCkgPT4gdGhpcy5kZWJ1ZygpLFxuICAgICAgJ2xpbnRlcjp0b2dnbGUtYWN0aXZlLWVkaXRvcic6ICgpID0+IHRoaXMudG9nZ2xlQWN0aXZlRWRpdG9yKCksXG4gICAgfSkpXG4gIH1cbiAgbGludCgpIHtcbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnc2hvdWxkLWxpbnQnKVxuICB9XG4gIGRlYnVnKCkge1xuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdzaG91bGQtZGVidWcnKVxuICB9XG4gIGVuYWJsZUxpbnRlcigpIHtcbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnc2hvdWxkLXRvZ2dsZS1saW50ZXInLCAnZW5hYmxlJylcbiAgfVxuICBkaXNhYmxlTGludGVyKCkge1xuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdzaG91bGQtdG9nZ2xlLWxpbnRlcicsICdkaXNhYmxlJylcbiAgfVxuICB0b2dnbGVBY3RpdmVFZGl0b3IoKSB7XG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ3Nob3VsZC10b2dnbGUtYWN0aXZlLWVkaXRvcicpXG4gIH1cbiAgc2hvd0RlYnVnKHN0YW5kYXJkTGludGVyczogQXJyYXk8TGludGVyPiwgaW5kaWVMaW50ZXJzOiBBcnJheTxJbmRpZURlbGVnYXRlPiwgdWlQcm92aWRlcnM6IEFycmF5PFVJPikge1xuICAgIGlmICghbWFuaWZlc3QpIHtcbiAgICAgIG1hbmlmZXN0ID0gcmVxdWlyZSgnLi4vcGFja2FnZS5qc29uJylcbiAgICB9XG4gICAgaWYgKCFIZWxwZXJzKSB7XG4gICAgICBIZWxwZXJzID0gcmVxdWlyZSgnLi9oZWxwZXJzJylcbiAgICB9XG5cbiAgICBjb25zdCB0ZXh0RWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgY29uc3QgdGV4dEVkaXRvclNjb3BlcyA9IEhlbHBlcnMuZ2V0RWRpdG9yQ3Vyc29yU2NvcGVzKHRleHRFZGl0b3IpXG4gICAgY29uc3Qgc29ydGVkTGludGVycyA9IHN0YW5kYXJkTGludGVycy5zbGljZSgpLnNvcnQoc29ydEJ5TmFtZSlcbiAgICBjb25zdCBzb3J0ZWRJbmRpZUxpbnRlcnMgPSBpbmRpZUxpbnRlcnMuc2xpY2UoKS5zb3J0KHNvcnRCeU5hbWUpXG4gICAgY29uc3Qgc29ydGVkVUlQcm92aWRlcnMgPSB1aVByb3ZpZGVycy5zbGljZSgpLnNvcnQoc29ydEJ5TmFtZSlcblxuICAgIGNvbnN0IGluZGllTGludGVyTmFtZXMgPSBzb3J0ZWRJbmRpZUxpbnRlcnNcbiAgICAgIC5tYXAoZm9ybWF0SXRlbSkuam9pbignXFxuJylcbiAgICBjb25zdCBzdGFuZGFyZExpbnRlck5hbWVzID0gc29ydGVkTGludGVyc1xuICAgICAgLm1hcChmb3JtYXRJdGVtKS5qb2luKCdcXG4nKVxuICAgIGNvbnN0IG1hdGNoaW5nU3RhbmRhcmRMaW50ZXJzID0gc29ydGVkTGludGVyc1xuICAgICAgLmZpbHRlcihsaW50ZXIgPT4gSGVscGVycy5zaG91bGRUcmlnZ2VyTGludGVyKGxpbnRlciwgZmFsc2UsIHRleHRFZGl0b3JTY29wZXMpKVxuICAgICAgLm1hcChmb3JtYXRJdGVtKS5qb2luKCdcXG4nKVxuICAgIGNvbnN0IGh1bWFuaXplZFNjb3BlcyA9IHRleHRFZGl0b3JTY29wZXNcbiAgICAgIC5tYXAoZm9ybWF0SXRlbSkuam9pbignXFxuJylcbiAgICBjb25zdCB1aVByb3ZpZGVyTmFtZXMgPSBzb3J0ZWRVSVByb3ZpZGVyc1xuICAgICAgLm1hcChmb3JtYXRJdGVtKS5qb2luKCdcXG4nKVxuXG4gICAgY29uc3QgaWdub3JlR2xvYiA9IGF0b20uY29uZmlnLmdldCgnbGludGVyLmlnbm9yZUdsb2InKVxuICAgIGNvbnN0IGlnbm9yZVZDU0lnbm9yZWRQYXRocyA9IGF0b20uY29uZmlnLmdldCgnY29yZS5leGNsdWRlVmNzSWdub3JlZFBhdGhzJylcbiAgICBjb25zdCBkaXNhYmxlZExpbnRlcnMgPSBhdG9tLmNvbmZpZy5nZXQoJ2xpbnRlci5kaXNhYmxlZFByb3ZpZGVycycpXG4gICAgICAubWFwKGZvcm1hdEl0ZW0pLmpvaW4oJ1xcbicpXG4gICAgY29uc3QgZmlsZVBhdGhJZ25vcmVkID0gSGVscGVycy5pc1BhdGhJZ25vcmVkKHRleHRFZGl0b3IuZ2V0UGF0aCgpLCBpZ25vcmVHbG9iLCBpZ25vcmVWQ1NJZ25vcmVkUGF0aHMpXG5cbiAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkSW5mbygnTGludGVyIERlYnVnIEluZm8nLCB7XG4gICAgICBkZXRhaWw6IFtcbiAgICAgICAgYFBsYXRmb3JtOiAke3Byb2Nlc3MucGxhdGZvcm19YCxcbiAgICAgICAgYEF0b20gVmVyc2lvbjogJHthdG9tLmdldFZlcnNpb24oKX1gLFxuICAgICAgICBgTGludGVyIFZlcnNpb246ICR7bWFuaWZlc3QudmVyc2lvbn1gLFxuICAgICAgICBgT3BlbmVkIGZpbGUgaXMgaWdub3JlZDogJHtmaWxlUGF0aElnbm9yZWQgPyAnWWVzJyA6ICdObyd9YCxcbiAgICAgICAgYE1hdGNoaW5nIExpbnRlciBQcm92aWRlcnM6IFxcbiR7bWF0Y2hpbmdTdGFuZGFyZExpbnRlcnN9YCxcbiAgICAgICAgYERpc2FibGVkIExpbnRlciBQcm92aWRlcnM6IFxcbiR7ZGlzYWJsZWRMaW50ZXJzfWAsXG4gICAgICAgIGBTdGFuZGFyZCBMaW50ZXIgUHJvdmlkZXJzOiBcXG4ke3N0YW5kYXJkTGludGVyTmFtZXN9YCxcbiAgICAgICAgYEluZGllIExpbnRlciBQcm92aWRlcnM6IFxcbiR7aW5kaWVMaW50ZXJOYW1lc31gLFxuICAgICAgICBgVUkgUHJvdmlkZXJzOiBcXG4ke3VpUHJvdmlkZXJOYW1lc31gLFxuICAgICAgICBgSWdub3JlIEdsb2I6ICR7aWdub3JlR2xvYn1gLFxuICAgICAgICBgVkNTIElnbm9yZWQgUGF0aHMgYXJlIGV4Y2x1ZGVkOiAke2lnbm9yZVZDU0lnbm9yZWRQYXRoc31gLFxuICAgICAgICBgQ3VycmVudCBGaWxlIFNjb3BlczogXFxuJHtodW1hbml6ZWRTY29wZXN9YCxcbiAgICAgIF0uam9pbignXFxuJyksXG4gICAgICBkaXNtaXNzYWJsZTogdHJ1ZSxcbiAgICB9KVxuICB9XG4gIG9uU2hvdWxkTGludChjYWxsYmFjazogRnVuY3Rpb24pOiBEaXNwb3NhYmxlIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdzaG91bGQtbGludCcsIGNhbGxiYWNrKVxuICB9XG4gIG9uU2hvdWxkRGVidWcoY2FsbGJhY2s6IEZ1bmN0aW9uKTogRGlzcG9zYWJsZSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignc2hvdWxkLWRlYnVnJywgY2FsbGJhY2spXG4gIH1cbiAgb25TaG91bGRUb2dnbGVBY3RpdmVFZGl0b3IoY2FsbGJhY2s6IEZ1bmN0aW9uKTogRGlzcG9zYWJsZSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignc2hvdWxkLXRvZ2dsZS1hY3RpdmUtZWRpdG9yJywgY2FsbGJhY2spXG4gIH1cbiAgb25TaG91bGRUb2dnbGVMaW50ZXIoY2FsbGJhY2s6IEZ1bmN0aW9uKTogRGlzcG9zYWJsZSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignc2hvdWxkLXRvZ2dsZS1saW50ZXInLCBjYWxsYmFjaylcbiAgfVxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgfVxufVxuIl19