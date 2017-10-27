var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodashUniq = require('lodash.uniq');

var _lodashUniq2 = _interopRequireDefault(_lodashUniq);

var _atom = require('atom');

var _packageJson = require('../package.json');

var _packageJson2 = _interopRequireDefault(_packageJson);

var _commands = require('./commands');

var _commands2 = _interopRequireDefault(_commands);

var _uiRegistry = require('./ui-registry');

var _uiRegistry2 = _interopRequireDefault(_uiRegistry);

var _toggleView = require('./toggle-view');

var _toggleView2 = _interopRequireDefault(_toggleView);

var _indieRegistry = require('./indie-registry');

var _indieRegistry2 = _interopRequireDefault(_indieRegistry);

var _linterRegistry = require('./linter-registry');

var _linterRegistry2 = _interopRequireDefault(_linterRegistry);

var _messageRegistry = require('./message-registry');

var _messageRegistry2 = _interopRequireDefault(_messageRegistry);

var _editorRegistry = require('./editor-registry');

var _editorRegistry2 = _interopRequireDefault(_editorRegistry);

var _helpers = require('./helpers');

var Helpers = _interopRequireWildcard(_helpers);

var Linter = (function () {
  function Linter() {
    var _this = this;

    _classCallCheck(this, Linter);

    this.commands = new _commands2['default']();
    this.registryUI = new _uiRegistry2['default']();
    this.registryIndie = new _indieRegistry2['default']();
    this.registryEditors = new _editorRegistry2['default']();
    this.registryLinters = new _linterRegistry2['default']();
    this.registryMessages = new _messageRegistry2['default']();

    this.subscriptions = new _atom.CompositeDisposable();

    this.subscriptions.add(this.commands);
    this.subscriptions.add(this.registryUI);
    this.subscriptions.add(this.registryIndie);
    this.subscriptions.add(this.registryMessages);
    this.subscriptions.add(this.registryEditors);
    this.subscriptions.add(this.registryLinters);

    this.commands.onShouldLint(function () {
      var editorLinter = _this.registryEditors.get(atom.workspace.getActiveTextEditor());
      if (editorLinter) {
        editorLinter.lint();
      }
    });
    this.commands.onShouldToggleActiveEditor(function () {
      var textEditor = atom.workspace.getActiveTextEditor();
      var editor = _this.registryEditors.get(textEditor);
      if (editor) {
        editor.dispose();
      } else if (textEditor) {
        _this.registryEditors.createFromTextEditor(textEditor);
      }
    });
    // NOTE: ESLint arrow-parens rule has a bug
    // eslint-disable-next-line arrow-parens
    this.commands.onShouldDebug(_asyncToGenerator(function* () {
      var linters = _this.registryLinters.getLinters();
      var configFile = yield Helpers.getConfigFile();
      var textEditor = atom.workspace.getActiveTextEditor();
      var textEditorScopes = Helpers.getEditorCursorScopes(textEditor);

      var allLinters = linters.sort(function (a, b) {
        return a.name.localeCompare(b.name);
      }).map(function (linter) {
        return '  - ' + linter.name;
      }).join('\n');
      var matchingLinters = linters.filter(function (linter) {
        return Helpers.shouldTriggerLinter(linter, false, textEditorScopes);
      }).sort(function (a, b) {
        return a.name.localeCompare(b.name);
      }).map(function (linter) {
        return '  - ' + linter.name;
      }).join('\n');
      var humanizedScopes = textEditorScopes.map(function (scope) {
        return '  - ' + scope;
      }).join('\n');
      var disabledLinters = (yield configFile.get('disabled')).map(function (linter) {
        return '  - ' + linter;
      }).join('\n');

      atom.notifications.addInfo('Linter Debug Info', {
        detail: ['Platform: ' + process.platform, 'Atom Version: ' + atom.getVersion(), 'Linter Version: ' + _packageJson2['default'].version, 'All Linter Providers: \n' + allLinters, 'Matching Linter Providers: \n' + matchingLinters, 'Disabled Linter Providers; \n' + disabledLinters, 'Current File scopes: \n' + humanizedScopes].join('\n'),
        dismissable: true
      });
    }));
    this.commands.onShouldToggleLinter(function (action) {
      var toggleView = new _toggleView2['default'](action, (0, _lodashUniq2['default'])(_this.registryLinters.getLinters().map(function (linter) {
        return linter.name;
      })));
      toggleView.onDidDispose(function () {
        _this.subscriptions.remove(toggleView);
      });
      toggleView.onDidDisable(function (name) {
        var linter = _this.registryLinters.getLinters().find(function (entry) {
          return entry.name === name;
        });
        if (linter) {
          _this.registryMessages.deleteByLinter(linter);
        }
      });
      toggleView.show();
      _this.subscriptions.add(toggleView);
    });
    this.registryIndie.observe(function (indieLinter) {
      indieLinter.onDidDestroy(function () {
        _this.registryMessages.deleteByLinter(indieLinter);
      });
    });
    this.registryEditors.observe(function (editorLinter) {
      editorLinter.onShouldLint(function (onChange) {
        _this.registryLinters.lint({ onChange: onChange, editor: editorLinter.getEditor() });
      });
      editorLinter.onDidDestroy(function () {
        _this.registryMessages.deleteByBuffer(editorLinter.getEditor().getBuffer());
      });
    });
    this.registryIndie.onDidUpdate(function (_ref) {
      var linter = _ref.linter;
      var messages = _ref.messages;

      _this.registryMessages.set({ linter: linter, messages: messages, buffer: null });
    });
    this.registryLinters.onDidUpdateMessages(function (_ref2) {
      var linter = _ref2.linter;
      var messages = _ref2.messages;
      var buffer = _ref2.buffer;

      _this.registryMessages.set({ linter: linter, messages: messages, buffer: buffer });
    });
    this.registryLinters.onDidBeginLinting(function (_ref3) {
      var linter = _ref3.linter;
      var filePath = _ref3.filePath;

      _this.registryUI.didBeginLinting(linter, filePath);
    });
    this.registryLinters.onDidFinishLinting(function (_ref4) {
      var linter = _ref4.linter;
      var filePath = _ref4.filePath;

      _this.registryUI.didFinishLinting(linter, filePath);
    });
    this.registryMessages.onDidUpdateMessages(function (difference) {
      _this.registryUI.render(difference);
    });

    this.registryEditors.activate();

    setTimeout(function () {
      // NOTE: Atom triggers this on boot so wait a while
      if (!_this.subscriptions.disposed) {
        _this.subscriptions.add(atom.project.onDidChangePaths(function () {
          _this.commands.lint();
        }));
      }
    }, 100);
  }

  _createClass(Linter, [{
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
    }

    // API methods for providing/consuming services
  }, {
    key: 'addUI',
    value: function addUI(ui) {
      this.registryUI.add(ui);
    }
  }, {
    key: 'deleteUI',
    value: function deleteUI(ui) {
      this.registryUI['delete'](ui);
    }
  }, {
    key: 'addLinter',
    value: function addLinter(linter) {
      var legacy = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

      this.registryLinters.addLinter(linter, legacy);
    }
  }, {
    key: 'deleteLinter',
    value: function deleteLinter(linter) {
      this.registryLinters.deleteLinter(linter);
      this.registryMessages.deleteByLinter(linter);
    }
  }]);

  return Linter;
})();

module.exports = Linter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OzswQkFFd0IsYUFBYTs7OztvQkFDRCxNQUFNOzsyQkFFckIsaUJBQWlCOzs7O3dCQUNqQixZQUFZOzs7OzBCQUNWLGVBQWU7Ozs7MEJBQ2YsZUFBZTs7Ozs2QkFDWixrQkFBa0I7Ozs7OEJBQ2pCLG1CQUFtQjs7OzsrQkFDbEIsb0JBQW9COzs7OzhCQUNwQixtQkFBbUI7Ozs7dUJBQ3RCLFdBQVc7O0lBQXhCLE9BQU87O0lBR2IsTUFBTTtBQVNDLFdBVFAsTUFBTSxHQVNJOzs7MEJBVFYsTUFBTTs7QUFVUixRQUFJLENBQUMsUUFBUSxHQUFHLDJCQUFjLENBQUE7QUFDOUIsUUFBSSxDQUFDLFVBQVUsR0FBRyw2QkFBZ0IsQ0FBQTtBQUNsQyxRQUFJLENBQUMsYUFBYSxHQUFHLGdDQUFtQixDQUFBO0FBQ3hDLFFBQUksQ0FBQyxlQUFlLEdBQUcsaUNBQXFCLENBQUE7QUFDNUMsUUFBSSxDQUFDLGVBQWUsR0FBRyxpQ0FBb0IsQ0FBQTtBQUMzQyxRQUFJLENBQUMsZ0JBQWdCLEdBQUcsa0NBQXFCLENBQUE7O0FBRTdDLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7O0FBRTlDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUNyQyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUE7QUFDdkMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFBO0FBQzFDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO0FBQzdDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FB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QTtLQUMzQjs7O1dBQ1EsbUJBQUMsTUFBc0IsRUFBMkI7VUFBekIsTUFBZSx5REFBRyxLQUFLOztBQUN2RCxVQUFJLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUE7S0FDL0M7OztXQUNXLHNCQUFDLE1BQXNCLEVBQUU7QUFDbkMsVUFBSSxDQUFDLGVBQWUsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDekMsVUFBSSxDQUFDLGdCQUFnQixDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQTtLQUM3Qzs7O1NBakpHLE1BQU07OztBQW9KWixNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQSIsImZpbGUiOiIvVXNlcnMvYWgvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi9tYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IGFycmF5VW5pcXVlIGZyb20gJ2xvZGFzaC51bmlxJ1xuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nXG5cbmltcG9ydCBtYW5pZmVzdCBmcm9tICcuLi9wYWNrYWdlLmpzb24nXG5pbXBvcnQgQ29tbWFuZHMgZnJvbSAnLi9jb21tYW5kcydcbmltcG9ydCBVSVJlZ2lzdHJ5IGZyb20gJy4vdWktcmVnaXN0cnknXG5pbXBvcnQgVG9nZ2xlVmlldyBmcm9tICcuL3RvZ2dsZS12aWV3J1xuaW1wb3J0IEluZGllUmVnaXN0cnkgZnJvbSAnLi9pbmRpZS1yZWdpc3RyeSdcbmltcG9ydCBMaW50ZXJSZWdpc3RyeSBmcm9tICcuL2xpbnRlci1yZWdpc3RyeSdcbmltcG9ydCBNZXNzYWdlUmVnaXN0cnkgZnJvbSAnLi9tZXNzYWdlLXJlZ2lzdHJ5J1xuaW1wb3J0IEVkaXRvcnNSZWdpc3RyeSBmcm9tICcuL2VkaXRvci1yZWdpc3RyeSdcbmltcG9ydCAqIGFzIEhlbHBlcnMgZnJvbSAnLi9oZWxwZXJzJ1xuaW1wb3J0IHR5cGUgeyBVSSwgTGludGVyIGFzIExpbnRlclByb3ZpZGVyIH0gZnJvbSAnLi90eXBlcydcblxuY2xhc3MgTGludGVyIHtcbiAgY29tbWFuZHM6IENvbW1hbmRzO1xuICByZWdpc3RyeVVJOiBVSVJlZ2lzdHJ5O1xuICByZWdpc3RyeUluZGllOiBJbmRpZVJlZ2lzdHJ5O1xuICByZWdpc3RyeUVkaXRvcnM6IEVkaXRvcnNSZWdpc3RyeTtcbiAgcmVnaXN0cnlMaW50ZXJzOiBMaW50ZXJSZWdpc3RyeTtcbiAgcmVnaXN0cnlNZXNzYWdlczogTWVzc2FnZVJlZ2lzdHJ5O1xuICBzdWJzY3JpcHRpb25zOiBDb21wb3NpdGVEaXNwb3NhYmxlO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuY29tbWFuZHMgPSBuZXcgQ29tbWFuZHMoKVxuICAgIHRoaXMucmVnaXN0cnlVSSA9IG5ldyBVSVJlZ2lzdHJ5KClcbiAgICB0aGlzLnJlZ2lzdHJ5SW5kaWUgPSBuZXcgSW5kaWVSZWdpc3RyeSgpXG4gICAgdGhpcy5yZWdpc3RyeUVkaXRvcnMgPSBuZXcgRWRpdG9yc1JlZ2lzdHJ5KClcbiAgICB0aGlzLnJlZ2lzdHJ5TGludGVycyA9IG5ldyBMaW50ZXJSZWdpc3RyeSgpXG4gICAgdGhpcy5yZWdpc3RyeU1lc3NhZ2VzID0gbmV3IE1lc3NhZ2VSZWdpc3RyeSgpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuY29tbWFuZHMpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLnJlZ2lzdHJ5VUkpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLnJlZ2lzdHJ5SW5kaWUpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLnJlZ2lzdHJ5TWVzc2FnZXMpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLnJlZ2lzdHJ5RWRpdG9ycylcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMucmVnaXN0cnlMaW50ZXJzKVxuXG4gICAgdGhpcy5jb21tYW5kcy5vblNob3VsZExpbnQoKCkgPT4ge1xuICAgICAgY29uc3QgZWRpdG9yTGludGVyID0gdGhpcy5yZWdpc3RyeUVkaXRvcnMuZ2V0KGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKSlcbiAgICAgIGlmIChlZGl0b3JMaW50ZXIpIHtcbiAgICAgICAgZWRpdG9yTGludGVyLmxpbnQoKVxuICAgICAgfVxuICAgIH0pXG4gICAgdGhpcy5jb21tYW5kcy5vblNob3VsZFRvZ2dsZUFjdGl2ZUVkaXRvcigoKSA9PiB7XG4gICAgICBjb25zdCB0ZXh0RWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICBjb25zdCBlZGl0b3IgPSB0aGlzLnJlZ2lzdHJ5RWRpdG9ycy5nZXQodGV4dEVkaXRvcilcbiAgICAgIGlmIChlZGl0b3IpIHtcbiAgICAgICAgZWRpdG9yLmRpc3Bvc2UoKVxuICAgICAgfSBlbHNlIGlmICh0ZXh0RWRpdG9yKSB7XG4gICAgICAgIHRoaXMucmVnaXN0cnlFZGl0b3JzLmNyZWF0ZUZyb21UZXh0RWRpdG9yKHRleHRFZGl0b3IpXG4gICAgICB9XG4gICAgfSlcbiAgICAvLyBOT1RFOiBFU0xpbnQgYXJyb3ctcGFyZW5zIHJ1bGUgaGFzIGEgYnVnXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGFycm93LXBhcmVuc1xuICAgIHRoaXMuY29tbWFuZHMub25TaG91bGREZWJ1Zyhhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBsaW50ZXJzID0gdGhpcy5yZWdpc3RyeUxpbnRlcnMuZ2V0TGludGVycygpXG4gICAgICBjb25zdCBjb25maWdGaWxlID0gYXdhaXQgSGVscGVycy5nZXRDb25maWdGaWxlKClcbiAgICAgIGNvbnN0IHRleHRFZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgIGNvbnN0IHRleHRFZGl0b3JTY29wZXMgPSBIZWxwZXJzLmdldEVkaXRvckN1cnNvclNjb3Blcyh0ZXh0RWRpdG9yKVxuXG4gICAgICBjb25zdCBhbGxMaW50ZXJzID0gbGludGVyc1xuICAgICAgICAuc29ydCgoYSwgYikgPT4gYS5uYW1lLmxvY2FsZUNvbXBhcmUoYi5uYW1lKSlcbiAgICAgICAgLm1hcChsaW50ZXIgPT4gYCAgLSAke2xpbnRlci5uYW1lfWApLmpvaW4oJ1xcbicpXG4gICAgICBjb25zdCBtYXRjaGluZ0xpbnRlcnMgPSBsaW50ZXJzXG4gICAgICAgIC5maWx0ZXIobGludGVyID0+IEhlbHBlcnMuc2hvdWxkVHJpZ2dlckxpbnRlcihsaW50ZXIsIGZhbHNlLCB0ZXh0RWRpdG9yU2NvcGVzKSlcbiAgICAgICAgLnNvcnQoKGEsIGIpID0+IGEubmFtZS5sb2NhbGVDb21wYXJlKGIubmFtZSkpXG4gICAgICAgIC5tYXAobGludGVyID0+IGAgIC0gJHtsaW50ZXIubmFtZX1gKS5qb2luKCdcXG4nKVxuICAgICAgY29uc3QgaHVtYW5pemVkU2NvcGVzID0gdGV4dEVkaXRvclNjb3Blc1xuICAgICAgICAubWFwKHNjb3BlID0+IGAgIC0gJHtzY29wZX1gKS5qb2luKCdcXG4nKVxuICAgICAgY29uc3QgZGlzYWJsZWRMaW50ZXJzID0gKGF3YWl0IGNvbmZpZ0ZpbGUuZ2V0KCdkaXNhYmxlZCcpKVxuICAgICAgICAubWFwKGxpbnRlciA9PiBgICAtICR7bGludGVyfWApLmpvaW4oJ1xcbicpXG5cbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRJbmZvKCdMaW50ZXIgRGVidWcgSW5mbycsIHtcbiAgICAgICAgZGV0YWlsOiBbXG4gICAgICAgICAgYFBsYXRmb3JtOiAke3Byb2Nlc3MucGxhdGZvcm19YCxcbiAgICAgICAgICBgQXRvbSBWZXJzaW9uOiAke2F0b20uZ2V0VmVyc2lvbigpfWAsXG4gICAgICAgICAgYExpbnRlciBWZXJzaW9uOiAke21hbmlmZXN0LnZlcnNpb259YCxcbiAgICAgICAgICBgQWxsIExpbnRlciBQcm92aWRlcnM6IFxcbiR7YWxsTGludGVyc31gLFxuICAgICAgICAgIGBNYXRjaGluZyBMaW50ZXIgUHJvdmlkZXJzOiBcXG4ke21hdGNoaW5nTGludGVyc31gLFxuICAgICAgICAgIGBEaXNhYmxlZCBMaW50ZXIgUHJvdmlkZXJzOyBcXG4ke2Rpc2FibGVkTGludGVyc31gLFxuICAgICAgICAgIGBDdXJyZW50IEZpbGUgc2NvcGVzOiBcXG4ke2h1bWFuaXplZFNjb3Blc31gLFxuICAgICAgICBdLmpvaW4oJ1xcbicpLFxuICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZSxcbiAgICAgIH0pXG4gICAgfSlcbiAgICB0aGlzLmNvbW1hbmRzLm9uU2hvdWxkVG9nZ2xlTGludGVyKChhY3Rpb24pID0+IHtcbiAgICAgIGNvbnN0IHRvZ2dsZVZpZXcgPSBuZXcgVG9nZ2xlVmlldyhhY3Rpb24sIGFycmF5VW5pcXVlKHRoaXMucmVnaXN0cnlMaW50ZXJzLmdldExpbnRlcnMoKS5tYXAobGludGVyID0+IGxpbnRlci5uYW1lKSkpXG4gICAgICB0b2dnbGVWaWV3Lm9uRGlkRGlzcG9zZSgoKSA9PiB7XG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5yZW1vdmUodG9nZ2xlVmlldylcbiAgICAgIH0pXG4gICAgICB0b2dnbGVWaWV3Lm9uRGlkRGlzYWJsZSgobmFtZSkgPT4ge1xuICAgICAgICBjb25zdCBsaW50ZXIgPSB0aGlzLnJlZ2lzdHJ5TGludGVycy5nZXRMaW50ZXJzKCkuZmluZChlbnRyeSA9PiBlbnRyeS5uYW1lID09PSBuYW1lKVxuICAgICAgICBpZiAobGludGVyKSB7XG4gICAgICAgICAgdGhpcy5yZWdpc3RyeU1lc3NhZ2VzLmRlbGV0ZUJ5TGludGVyKGxpbnRlcilcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIHRvZ2dsZVZpZXcuc2hvdygpXG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRvZ2dsZVZpZXcpXG4gICAgfSlcbiAgICB0aGlzLnJlZ2lzdHJ5SW5kaWUub2JzZXJ2ZSgoaW5kaWVMaW50ZXIpID0+IHtcbiAgICAgIGluZGllTGludGVyLm9uRGlkRGVzdHJveSgoKSA9PiB7XG4gICAgICAgIHRoaXMucmVnaXN0cnlNZXNzYWdlcy5kZWxldGVCeUxpbnRlcihpbmRpZUxpbnRlcilcbiAgICAgIH0pXG4gICAgfSlcbiAgICB0aGlzLnJlZ2lzdHJ5RWRpdG9ycy5vYnNlcnZlKChlZGl0b3JMaW50ZXIpID0+IHtcbiAgICAgIGVkaXRvckxpbnRlci5vblNob3VsZExpbnQoKG9uQ2hhbmdlKSA9PiB7XG4gICAgICAgIHRoaXMucmVnaXN0cnlMaW50ZXJzLmxpbnQoeyBvbkNoYW5nZSwgZWRpdG9yOiBlZGl0b3JMaW50ZXIuZ2V0RWRpdG9yKCkgfSlcbiAgICAgIH0pXG4gICAgICBlZGl0b3JMaW50ZXIub25EaWREZXN0cm95KCgpID0+IHtcbiAgICAgICAgdGhpcy5yZWdpc3RyeU1lc3NhZ2VzLmRlbGV0ZUJ5QnVmZmVyKGVkaXRvckxpbnRlci5nZXRFZGl0b3IoKS5nZXRCdWZmZXIoKSlcbiAgICAgIH0pXG4gICAgfSlcbiAgICB0aGlzLnJlZ2lzdHJ5SW5kaWUub25EaWRVcGRhdGUoKHsgbGludGVyLCBtZXNzYWdlcyB9KSA9PiB7XG4gICAgICB0aGlzLnJlZ2lzdHJ5TWVzc2FnZXMuc2V0KHsgbGludGVyLCBtZXNzYWdlcywgYnVmZmVyOiBudWxsIH0pXG4gICAgfSlcbiAgICB0aGlzLnJlZ2lzdHJ5TGludGVycy5vbkRpZFVwZGF0ZU1lc3NhZ2VzKCh7IGxpbnRlciwgbWVzc2FnZXMsIGJ1ZmZlciB9KSA9PiB7XG4gICAgICB0aGlzLnJlZ2lzdHJ5TWVzc2FnZXMuc2V0KHsgbGludGVyLCBtZXNzYWdlcywgYnVmZmVyIH0pXG4gICAgfSlcbiAgICB0aGlzLnJlZ2lzdHJ5TGludGVycy5vbkRpZEJlZ2luTGludGluZygoeyBsaW50ZXIsIGZpbGVQYXRoIH0pID0+IHtcbiAgICAgIHRoaXMucmVnaXN0cnlVSS5kaWRCZWdpbkxpbnRpbmcobGludGVyLCBmaWxlUGF0aClcbiAgICB9KVxuICAgIHRoaXMucmVnaXN0cnlMaW50ZXJzLm9uRGlkRmluaXNoTGludGluZygoeyBsaW50ZXIsIGZpbGVQYXRoIH0pID0+IHtcbiAgICAgIHRoaXMucmVnaXN0cnlVSS5kaWRGaW5pc2hMaW50aW5nKGxpbnRlciwgZmlsZVBhdGgpXG4gICAgfSlcbiAgICB0aGlzLnJlZ2lzdHJ5TWVzc2FnZXMub25EaWRVcGRhdGVNZXNzYWdlcygoZGlmZmVyZW5jZSkgPT4ge1xuICAgICAgdGhpcy5yZWdpc3RyeVVJLnJlbmRlcihkaWZmZXJlbmNlKVxuICAgIH0pXG5cbiAgICB0aGlzLnJlZ2lzdHJ5RWRpdG9ycy5hY3RpdmF0ZSgpXG5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIC8vIE5PVEU6IEF0b20gdHJpZ2dlcnMgdGhpcyBvbiBib290IHNvIHdhaXQgYSB3aGlsZVxuICAgICAgaWYgKCF0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZWQpIHtcbiAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLnByb2plY3Qub25EaWRDaGFuZ2VQYXRocygoKSA9PiB7XG4gICAgICAgICAgdGhpcy5jb21tYW5kcy5saW50KClcbiAgICAgICAgfSkpXG4gICAgICB9XG4gICAgfSwgMTAwKVxuICB9XG4gIGRpc3Bvc2UoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICB9XG5cbiAgLy8gQVBJIG1ldGhvZHMgZm9yIHByb3ZpZGluZy9jb25zdW1pbmcgc2VydmljZXNcbiAgYWRkVUkodWk6IFVJKSB7XG4gICAgdGhpcy5yZWdpc3RyeVVJLmFkZCh1aSlcbiAgfVxuICBkZWxldGVVSSh1aTogVUkpIHtcbiAgICB0aGlzLnJlZ2lzdHJ5VUkuZGVsZXRlKHVpKVxuICB9XG4gIGFkZExpbnRlcihsaW50ZXI6IExpbnRlclByb3ZpZGVyLCBsZWdhY3k6IGJvb2xlYW4gPSBmYWxzZSkge1xuICAgIHRoaXMucmVnaXN0cnlMaW50ZXJzLmFkZExpbnRlcihsaW50ZXIsIGxlZ2FjeSlcbiAgfVxuICBkZWxldGVMaW50ZXIobGludGVyOiBMaW50ZXJQcm92aWRlcikge1xuICAgIHRoaXMucmVnaXN0cnlMaW50ZXJzLmRlbGV0ZUxpbnRlcihsaW50ZXIpXG4gICAgdGhpcy5yZWdpc3RyeU1lc3NhZ2VzLmRlbGV0ZUJ5TGludGVyKGxpbnRlcilcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IExpbnRlclxuIl19