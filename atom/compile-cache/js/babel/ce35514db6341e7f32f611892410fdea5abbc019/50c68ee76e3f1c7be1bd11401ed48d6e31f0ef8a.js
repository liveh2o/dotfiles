var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _commands = require('./commands');

var _commands2 = _interopRequireDefault(_commands);

var Helpers = undefined;
var manifest = undefined;
var ToggleView = undefined;
var UIRegistry = undefined;
var arrayUnique = undefined;
var IndieRegistry = undefined;
var LinterRegistry = undefined;
var EditorsRegistry = undefined;
var MessageRegistry = undefined;

var Linter = (function () {
  function Linter() {
    var _this = this;

    _classCallCheck(this, Linter);

    this.idleCallbacks = new Set();
    this.subscriptions = new _atom.CompositeDisposable();

    this.commands = new _commands2['default']();
    this.subscriptions.add(this.commands);

    this.commands.onShouldLint(function () {
      _this.registryEditorsInit();
      var editorLinter = _this.registryEditors.get(atom.workspace.getActiveTextEditor());
      if (editorLinter) {
        editorLinter.lint();
      }
    });
    this.commands.onShouldToggleActiveEditor(function () {
      var textEditor = atom.workspace.getActiveTextEditor();
      _this.registryEditorsInit();
      var editor = _this.registryEditors.get(textEditor);
      if (editor) {
        editor.dispose();
      } else if (textEditor) {
        _this.registryEditors.createFromTextEditor(textEditor);
      }
    });
    this.commands.onShouldDebug(_asyncToGenerator(function* () {
      if (!Helpers) {
        Helpers = require('./helpers');
      }
      if (!manifest) {
        manifest = require('../package.json');
      }
      _this.registryLintersInit();
      var linters = _this.registryLinters.getLinters();
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
      var disabledLinters = atom.config.get('linter.disabledProviders').map(function (linter) {
        return '  - ' + linter;
      }).join('\n');

      atom.notifications.addInfo('Linter Debug Info', {
        detail: ['Platform: ' + process.platform, 'Atom Version: ' + atom.getVersion(), 'Linter Version: ' + manifest.version, 'All Linter Providers: \n' + allLinters, 'Matching Linter Providers: \n' + matchingLinters, 'Disabled Linter Providers; \n' + disabledLinters, 'Current File scopes: \n' + humanizedScopes].join('\n'),
        dismissable: true
      });
    }));
    this.commands.onShouldToggleLinter(function (action) {
      if (!ToggleView) {
        ToggleView = require('./toggle-view');
      }
      if (!arrayUnique) {
        arrayUnique = require('lodash.uniq');
      }
      _this.registryLintersInit();
      var toggleView = new ToggleView(action, arrayUnique(_this.registryLinters.getLinters().map(function (linter) {
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
          _this.registryMessagesInit();
          _this.registryMessages.deleteByLinter(linter);
        }
      });
      toggleView.show();
      _this.subscriptions.add(toggleView);
    });

    var projectPathChangeCallbackID = window.requestIdleCallback((function projectPathChange() {
      var _this2 = this;

      this.idleCallbacks['delete'](projectPathChangeCallbackID);
      // NOTE: Atom triggers this on boot so wait a while
      this.subscriptions.add(atom.project.onDidChangePaths(function () {
        _this2.commands.lint();
      }));
    }).bind(this));
    this.idleCallbacks.add(projectPathChangeCallbackID);

    var registryEditorsInitCallbackID = window.requestIdleCallback((function registryEditorsIdleInit() {
      this.idleCallbacks['delete'](registryEditorsInitCallbackID);
      // This will be called on the fly if needed, but needs to run on it's
      // own at some point or linting on open or on change will never trigger
      this.registryEditorsInit();
    }).bind(this));
    this.idleCallbacks.add(registryEditorsInitCallbackID);
  }

  _createClass(Linter, [{
    key: 'dispose',
    value: function dispose() {
      this.idleCallbacks.forEach(function (callbackID) {
        return window.cancelIdleCallback(callbackID);
      });
      this.idleCallbacks.clear();
      this.subscriptions.dispose();
    }
  }, {
    key: 'registryEditorsInit',
    value: function registryEditorsInit() {
      var _this3 = this;

      if (this.registryEditors) {
        return;
      }
      if (!EditorsRegistry) {
        EditorsRegistry = require('./editor-registry');
      }
      this.registryEditors = new EditorsRegistry();
      this.subscriptions.add(this.registryEditors);
      this.registryEditors.observe(function (editorLinter) {
        editorLinter.onShouldLint(function (onChange) {
          _this3.registryLintersInit();
          _this3.registryLinters.lint({ onChange: onChange, editor: editorLinter.getEditor() });
        });
        editorLinter.onDidDestroy(function () {
          _this3.registryMessagesInit();
          _this3.registryMessages.deleteByBuffer(editorLinter.getEditor().getBuffer());
        });
      });
      this.registryEditors.activate();
    }
  }, {
    key: 'registryLintersInit',
    value: function registryLintersInit() {
      var _this4 = this;

      if (this.registryLinters) {
        return;
      }
      if (!LinterRegistry) {
        LinterRegistry = require('./linter-registry');
      }
      this.registryLinters = new LinterRegistry();
      this.subscriptions.add(this.registryLinters);
      this.registryLinters.onDidUpdateMessages(function (_ref) {
        var linter = _ref.linter;
        var messages = _ref.messages;
        var buffer = _ref.buffer;

        _this4.registryMessagesInit();
        _this4.registryMessages.set({ linter: linter, messages: messages, buffer: buffer });
      });
      this.registryLinters.onDidBeginLinting(function (_ref2) {
        var linter = _ref2.linter;
        var filePath = _ref2.filePath;

        _this4.registryUIInit();
        _this4.registryUI.didBeginLinting(linter, filePath);
      });
      this.registryLinters.onDidFinishLinting(function (_ref3) {
        var linter = _ref3.linter;
        var filePath = _ref3.filePath;

        _this4.registryUIInit();
        _this4.registryUI.didFinishLinting(linter, filePath);
      });
    }
  }, {
    key: 'registryIndieInit',
    value: function registryIndieInit() {
      var _this5 = this;

      if (this.registryIndie) {
        return;
      }
      if (!IndieRegistry) {
        IndieRegistry = require('./indie-registry');
      }
      this.registryIndie = new IndieRegistry();
      this.subscriptions.add(this.registryIndie);
      this.registryIndie.observe(function (indieLinter) {
        indieLinter.onDidDestroy(function () {
          _this5.registryMessagesInit();
          _this5.registryMessages.deleteByLinter(indieLinter);
        });
      });
      this.registryIndie.onDidUpdate(function (_ref4) {
        var linter = _ref4.linter;
        var messages = _ref4.messages;

        _this5.registryMessagesInit();
        _this5.registryMessages.set({ linter: linter, messages: messages, buffer: null });
      });
    }
  }, {
    key: 'registryMessagesInit',
    value: function registryMessagesInit() {
      var _this6 = this;

      if (this.registryMessages) {
        return;
      }
      if (!MessageRegistry) {
        MessageRegistry = require('./message-registry');
      }
      this.registryMessages = new MessageRegistry();
      this.subscriptions.add(this.registryMessages);
      this.registryMessages.onDidUpdateMessages(function (difference) {
        _this6.registryUIInit();
        _this6.registryUI.render(difference);
      });
    }
  }, {
    key: 'registryUIInit',
    value: function registryUIInit() {
      if (this.registryUI) {
        return;
      }
      if (!UIRegistry) {
        UIRegistry = require('./ui-registry');
      }
      this.registryUI = new UIRegistry();
      this.subscriptions.add(this.registryUI);
    }

    // API methods for providing/consuming services
    // UI
  }, {
    key: 'addUI',
    value: function addUI(ui) {
      this.registryUIInit();
      this.registryUI.add(ui);
      this.registryMessagesInit();
      var messages = this.registryMessages.messages;
      if (messages.length) {
        ui.render({ added: messages, messages: messages, removed: [] });
      }
    }
  }, {
    key: 'deleteUI',
    value: function deleteUI(ui) {
      this.registryUIInit();
      this.registryUI['delete'](ui);
    }

    // Standard Linter
  }, {
    key: 'addLinter',
    value: function addLinter(linter) {
      var legacy = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

      this.registryLintersInit();
      this.registryLinters.addLinter(linter, legacy);
    }
  }, {
    key: 'deleteLinter',
    value: function deleteLinter(linter) {
      this.registryLintersInit();
      this.registryLinters.deleteLinter(linter);
      this.registryMessagesInit();
      this.registryMessages.deleteByLinter(linter);
    }

    // Indie Linter
  }, {
    key: 'addIndie',
    value: function addIndie(indie) {
      this.registryIndieInit();
      return this.registryIndie.register(indie, 2);
    }
  }, {
    key: 'addLegacyIndie',
    value: function addLegacyIndie(indie) {
      this.registryIndieInit();
      return this.registryIndie.register(indie, 1);
    }
  }]);

  return Linter;
})();

module.exports = Linter;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7b0JBRW9DLE1BQU07O3dCQUVyQixZQUFZOzs7O0FBR2pDLElBQUksT0FBTyxZQUFBLENBQUE7QUFDWCxJQUFJLFFBQVEsWUFBQSxDQUFBO0FBQ1osSUFBSSxVQUFVLFlBQUEsQ0FBQTtBQUNkLElBQUksVUFBVSxZQUFBLENBQUE7QUFDZCxJQUFJLFdBQVcsWUFBQSxDQUFBO0FBQ2YsSUFBSSxhQUFhLFlBQUEsQ0FBQTtBQUNqQixJQUFJLGNBQWMsWUFBQSxDQUFBO0FBQ2xCLElBQUksZUFBZSxZQUFBLENBQUE7QUFDbkIsSUFBSSxlQUFlLFlBQUEsQ0FBQTs7SUFFYixNQUFNO0FBVUMsV0FWUCxNQUFNLEdBVUk7OzswQkFWVixNQUFNOztBQVdSLFFBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTtBQUM5QixRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFBOztBQUU5QyxRQUFJLENBQUMsUUFBUSxHQUFHLDJCQUFjLENBQUE7QUFDOUIsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFBOztBQUVyQyxRQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxZQUFNO0FBQy9CLFlBQUssbUJBQW1CLEVBQUUsQ0FBQTtBQUMxQixVQUFNLFlBQVksR0FBRyxNQUFLLGVBQWUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLENBQUE7QUFDbkYsVUFBSSxZQUFZLEVBQUU7QUFDaEIsb0JBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQTtPQUNwQjtLQUNGLENBQUMsQ0FBQTtBQUNGLFFBQUksQ0FBQyxRQUFRLENBQUMsMEJBQTBCLENBQUMsWUFBTTtBQUM3QyxVQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFD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QUUsQ0FBQTtBQUN4QixhQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQTtLQUM3Qzs7O1dBQ2Esd0JBQUMsS0FBYSxFQUFFO0FBQzVCLFVBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO0FBQ3hCLGFBQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFBO0tBQzdDOzs7U0FsUEcsTUFBTTs7O0FBcVBaLE1BQU0sQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFBIiwiZmlsZSI6Ii9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL21haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcblxuaW1wb3J0IENvbW1hbmRzIGZyb20gJy4vY29tbWFuZHMnXG5pbXBvcnQgdHlwZSB7IFVJLCBMaW50ZXIgYXMgTGludGVyUHJvdmlkZXIgfSBmcm9tICcuL3R5cGVzJ1xuXG5sZXQgSGVscGVyc1xubGV0IG1hbmlmZXN0XG5sZXQgVG9nZ2xlVmlld1xubGV0IFVJUmVnaXN0cnlcbmxldCBhcnJheVVuaXF1ZVxubGV0IEluZGllUmVnaXN0cnlcbmxldCBMaW50ZXJSZWdpc3RyeVxubGV0IEVkaXRvcnNSZWdpc3RyeVxubGV0IE1lc3NhZ2VSZWdpc3RyeVxuXG5jbGFzcyBMaW50ZXIge1xuICBjb21tYW5kczogQ29tbWFuZHM7XG4gIHJlZ2lzdHJ5VUk6IFVJUmVnaXN0cnk7XG4gIHJlZ2lzdHJ5SW5kaWU6IEluZGllUmVnaXN0cnk7XG4gIHJlZ2lzdHJ5RWRpdG9yczogRWRpdG9yc1JlZ2lzdHJ5O1xuICByZWdpc3RyeUxpbnRlcnM6IExpbnRlclJlZ2lzdHJ5O1xuICByZWdpc3RyeU1lc3NhZ2VzOiBNZXNzYWdlUmVnaXN0cnk7XG4gIHN1YnNjcmlwdGlvbnM6IENvbXBvc2l0ZURpc3Bvc2FibGU7XG4gIGlkbGVDYWxsYmFja3M6IFNldDxudW1iZXI+O1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuaWRsZUNhbGxiYWNrcyA9IG5ldyBTZXQoKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcblxuICAgIHRoaXMuY29tbWFuZHMgPSBuZXcgQ29tbWFuZHMoKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5jb21tYW5kcylcblxuICAgIHRoaXMuY29tbWFuZHMub25TaG91bGRMaW50KCgpID0+IHtcbiAgICAgIHRoaXMucmVnaXN0cnlFZGl0b3JzSW5pdCgpXG4gICAgICBjb25zdCBlZGl0b3JMaW50ZXIgPSB0aGlzLnJlZ2lzdHJ5RWRpdG9ycy5nZXQoYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpKVxuICAgICAgaWYgKGVkaXRvckxpbnRlcikge1xuICAgICAgICBlZGl0b3JMaW50ZXIubGludCgpXG4gICAgICB9XG4gICAgfSlcbiAgICB0aGlzLmNvbW1hbmRzLm9uU2hvdWxkVG9nZ2xlQWN0aXZlRWRpdG9yKCgpID0+IHtcbiAgICAgIGNvbnN0IHRleHRFZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgIHRoaXMucmVnaXN0cnlFZGl0b3JzSW5pdCgpXG4gICAgICBjb25zdCBlZGl0b3IgPSB0aGlzLnJlZ2lzdHJ5RWRpdG9ycy5nZXQodGV4dEVkaXRvcilcbiAgICAgIGlmIChlZGl0b3IpIHtcbiAgICAgICAgZWRpdG9yLmRpc3Bvc2UoKVxuICAgICAgfSBlbHNlIGlmICh0ZXh0RWRpdG9yKSB7XG4gICAgICAgIHRoaXMucmVnaXN0cnlFZGl0b3JzLmNyZWF0ZUZyb21UZXh0RWRpdG9yKHRleHRFZGl0b3IpXG4gICAgICB9XG4gICAgfSlcbiAgICB0aGlzLmNvbW1hbmRzLm9uU2hvdWxkRGVidWcoYXN5bmMgKCkgPT4ge1xuICAgICAgaWYgKCFIZWxwZXJzKSB7XG4gICAgICAgIEhlbHBlcnMgPSByZXF1aXJlKCcuL2hlbHBlcnMnKVxuICAgICAgfVxuICAgICAgaWYgKCFtYW5pZmVzdCkge1xuICAgICAgICBtYW5pZmVzdCA9IHJlcXVpcmUoJy4uL3BhY2thZ2UuanNvbicpXG4gICAgICB9XG4gICAgICB0aGlzLnJlZ2lzdHJ5TGludGVyc0luaXQoKVxuICAgICAgY29uc3QgbGludGVycyA9IHRoaXMucmVnaXN0cnlMaW50ZXJzLmdldExpbnRlcnMoKVxuICAgICAgY29uc3QgdGV4dEVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgICAgY29uc3QgdGV4dEVkaXRvclNjb3BlcyA9IEhlbHBlcnMuZ2V0RWRpdG9yQ3Vyc29yU2NvcGVzKHRleHRFZGl0b3IpXG5cbiAgICAgIGNvbnN0IGFsbExpbnRlcnMgPSBsaW50ZXJzXG4gICAgICAgIC5zb3J0KChhLCBiKSA9PiBhLm5hbWUubG9jYWxlQ29tcGFyZShiLm5hbWUpKVxuICAgICAgICAubWFwKGxpbnRlciA9PiBgICAtICR7bGludGVyLm5hbWV9YCkuam9pbignXFxuJylcbiAgICAgIGNvbnN0IG1hdGNoaW5nTGludGVycyA9IGxpbnRlcnNcbiAgICAgICAgLmZpbHRlcihsaW50ZXIgPT4gSGVscGVycy5zaG91bGRUcmlnZ2VyTGludGVyKGxpbnRlciwgZmFsc2UsIHRleHRFZGl0b3JTY29wZXMpKVxuICAgICAgICAuc29ydCgoYSwgYikgPT4gYS5uYW1lLmxvY2FsZUNvbXBhcmUoYi5uYW1lKSlcbiAgICAgICAgLm1hcChsaW50ZXIgPT4gYCAgLSAke2xpbnRlci5uYW1lfWApLmpvaW4oJ1xcbicpXG4gICAgICBjb25zdCBodW1hbml6ZWRTY29wZXMgPSB0ZXh0RWRpdG9yU2NvcGVzXG4gICAgICAgIC5tYXAoc2NvcGUgPT4gYCAgLSAke3Njb3BlfWApLmpvaW4oJ1xcbicpXG4gICAgICBjb25zdCBkaXNhYmxlZExpbnRlcnMgPSBhdG9tLmNvbmZpZy5nZXQoJ2xpbnRlci5kaXNhYmxlZFByb3ZpZGVycycpXG4gICAgICAgIC5tYXAobGludGVyID0+IGAgIC0gJHtsaW50ZXJ9YCkuam9pbignXFxuJylcblxuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEluZm8oJ0xpbnRlciBEZWJ1ZyBJbmZvJywge1xuICAgICAgICBkZXRhaWw6IFtcbiAgICAgICAgICBgUGxhdGZvcm06ICR7cHJvY2Vzcy5wbGF0Zm9ybX1gLFxuICAgICAgICAgIGBBdG9tIFZlcnNpb246ICR7YXRvbS5nZXRWZXJzaW9uKCl9YCxcbiAgICAgICAgICBgTGludGVyIFZlcnNpb246ICR7bWFuaWZlc3QudmVyc2lvbn1gLFxuICAgICAgICAgIGBBbGwgTGludGVyIFByb3ZpZGVyczogXFxuJHthbGxMaW50ZXJzfWAsXG4gICAgICAgICAgYE1hdGNoaW5nIExpbnRlciBQcm92aWRlcnM6IFxcbiR7bWF0Y2hpbmdMaW50ZXJzfWAsXG4gICAgICAgICAgYERpc2FibGVkIExpbnRlciBQcm92aWRlcnM7IFxcbiR7ZGlzYWJsZWRMaW50ZXJzfWAsXG4gICAgICAgICAgYEN1cnJlbnQgRmlsZSBzY29wZXM6IFxcbiR7aHVtYW5pemVkU2NvcGVzfWAsXG4gICAgICAgIF0uam9pbignXFxuJyksXG4gICAgICAgIGRpc21pc3NhYmxlOiB0cnVlLFxuICAgICAgfSlcbiAgICB9KVxuICAgIHRoaXMuY29tbWFuZHMub25TaG91bGRUb2dnbGVMaW50ZXIoKGFjdGlvbikgPT4ge1xuICAgICAgaWYgKCFUb2dnbGVWaWV3KSB7XG4gICAgICAgIFRvZ2dsZVZpZXcgPSByZXF1aXJlKCcuL3RvZ2dsZS12aWV3JylcbiAgICAgIH1cbiAgICAgIGlmICghYXJyYXlVbmlxdWUpIHtcbiAgICAgICAgYXJyYXlVbmlxdWUgPSByZXF1aXJlKCdsb2Rhc2gudW5pcScpXG4gICAgICB9XG4gICAgICB0aGlzLnJlZ2lzdHJ5TGludGVyc0luaXQoKVxuICAgICAgY29uc3QgdG9nZ2xlVmlldyA9IG5ldyBUb2dnbGVWaWV3KGFjdGlvbixcbiAgICAgICAgYXJyYXlVbmlxdWUodGhpcy5yZWdpc3RyeUxpbnRlcnMuZ2V0TGludGVycygpLm1hcChsaW50ZXIgPT4gbGludGVyLm5hbWUpKSlcbiAgICAgIHRvZ2dsZVZpZXcub25EaWREaXNwb3NlKCgpID0+IHtcbiAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLnJlbW92ZSh0b2dnbGVWaWV3KVxuICAgICAgfSlcbiAgICAgIHRvZ2dsZVZpZXcub25EaWREaXNhYmxlKChuYW1lKSA9PiB7XG4gICAgICAgIGNvbnN0IGxpbnRlciA9IHRoaXMucmVnaXN0cnlMaW50ZXJzLmdldExpbnRlcnMoKS5maW5kKGVudHJ5ID0+IGVudHJ5Lm5hbWUgPT09IG5hbWUpXG4gICAgICAgIGlmIChsaW50ZXIpIHtcbiAgICAgICAgICB0aGlzLnJlZ2lzdHJ5TWVzc2FnZXNJbml0KClcbiAgICAgICAgICB0aGlzLnJlZ2lzdHJ5TWVzc2FnZXMuZGVsZXRlQnlMaW50ZXIobGludGVyKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgdG9nZ2xlVmlldy5zaG93KClcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodG9nZ2xlVmlldylcbiAgICB9KVxuXG4gICAgY29uc3QgcHJvamVjdFBhdGhDaGFuZ2VDYWxsYmFja0lEID0gd2luZG93LnJlcXVlc3RJZGxlQ2FsbGJhY2soXG4gICAgICBmdW5jdGlvbiBwcm9qZWN0UGF0aENoYW5nZSgpIHtcbiAgICAgICAgdGhpcy5pZGxlQ2FsbGJhY2tzLmRlbGV0ZShwcm9qZWN0UGF0aENoYW5nZUNhbGxiYWNrSUQpXG4gICAgICAgIC8vIE5PVEU6IEF0b20gdHJpZ2dlcnMgdGhpcyBvbiBib290IHNvIHdhaXQgYSB3aGlsZVxuICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20ucHJvamVjdC5vbkRpZENoYW5nZVBhdGhzKCgpID0+IHtcbiAgICAgICAgICB0aGlzLmNvbW1hbmRzLmxpbnQoKVxuICAgICAgICB9KSlcbiAgICAgIH0uYmluZCh0aGlzKSlcbiAgICB0aGlzLmlkbGVDYWxsYmFja3MuYWRkKHByb2plY3RQYXRoQ2hhbmdlQ2FsbGJhY2tJRClcblxuICAgIGNvbnN0IHJlZ2lzdHJ5RWRpdG9yc0luaXRDYWxsYmFja0lEID0gd2luZG93LnJlcXVlc3RJZGxlQ2FsbGJhY2soXG4gICAgICBmdW5jdGlvbiByZWdpc3RyeUVkaXRvcnNJZGxlSW5pdCgpIHtcbiAgICAgICAgdGhpcy5pZGxlQ2FsbGJhY2tzLmRlbGV0ZShyZWdpc3RyeUVkaXRvcnNJbml0Q2FsbGJhY2tJRClcbiAgICAgICAgLy8gVGhpcyB3aWxsIGJlIGNhbGxlZCBvbiB0aGUgZmx5IGlmIG5lZWRlZCwgYnV0IG5lZWRzIHRvIHJ1biBvbiBpdCdzXG4gICAgICAgIC8vIG93biBhdCBzb21lIHBvaW50IG9yIGxpbnRpbmcgb24gb3BlbiBvciBvbiBjaGFuZ2Ugd2lsbCBuZXZlciB0cmlnZ2VyXG4gICAgICAgIHRoaXMucmVnaXN0cnlFZGl0b3JzSW5pdCgpXG4gICAgICB9LmJpbmQodGhpcykpXG4gICAgdGhpcy5pZGxlQ2FsbGJhY2tzLmFkZChyZWdpc3RyeUVkaXRvcnNJbml0Q2FsbGJhY2tJRClcbiAgfVxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMuaWRsZUNhbGxiYWNrcy5mb3JFYWNoKGNhbGxiYWNrSUQgPT4gd2luZG93LmNhbmNlbElkbGVDYWxsYmFjayhjYWxsYmFja0lEKSlcbiAgICB0aGlzLmlkbGVDYWxsYmFja3MuY2xlYXIoKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgfVxuXG4gIHJlZ2lzdHJ5RWRpdG9yc0luaXQoKSB7XG4gICAgaWYgKHRoaXMucmVnaXN0cnlFZGl0b3JzKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgaWYgKCFFZGl0b3JzUmVnaXN0cnkpIHtcbiAgICAgIEVkaXRvcnNSZWdpc3RyeSA9IHJlcXVpcmUoJy4vZWRpdG9yLXJlZ2lzdHJ5JylcbiAgICB9XG4gICAgdGhpcy5yZWdpc3RyeUVkaXRvcnMgPSBuZXcgRWRpdG9yc1JlZ2lzdHJ5KClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMucmVnaXN0cnlFZGl0b3JzKVxuICAgIHRoaXMucmVnaXN0cnlFZGl0b3JzLm9ic2VydmUoKGVkaXRvckxpbnRlcikgPT4ge1xuICAgICAgZWRpdG9yTGludGVyLm9uU2hvdWxkTGludCgob25DaGFuZ2UpID0+IHtcbiAgICAgICAgdGhpcy5yZWdpc3RyeUxpbnRlcnNJbml0KClcbiAgICAgICAgdGhpcy5yZWdpc3RyeUxpbnRlcnMubGludCh7IG9uQ2hhbmdlLCBlZGl0b3I6IGVkaXRvckxpbnRlci5nZXRFZGl0b3IoKSB9KVxuICAgICAgfSlcbiAgICAgIGVkaXRvckxpbnRlci5vbkRpZERlc3Ryb3koKCkgPT4ge1xuICAgICAgICB0aGlzLnJlZ2lzdHJ5TWVzc2FnZXNJbml0KClcbiAgICAgICAgdGhpcy5yZWdpc3RyeU1lc3NhZ2VzLmRlbGV0ZUJ5QnVmZmVyKGVkaXRvckxpbnRlci5nZXRFZGl0b3IoKS5nZXRCdWZmZXIoKSlcbiAgICAgIH0pXG4gICAgfSlcbiAgICB0aGlzLnJlZ2lzdHJ5RWRpdG9ycy5hY3RpdmF0ZSgpXG4gIH1cbiAgcmVnaXN0cnlMaW50ZXJzSW5pdCgpIHtcbiAgICBpZiAodGhpcy5yZWdpc3RyeUxpbnRlcnMpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBpZiAoIUxpbnRlclJlZ2lzdHJ5KSB7XG4gICAgICBMaW50ZXJSZWdpc3RyeSA9IHJlcXVpcmUoJy4vbGludGVyLXJlZ2lzdHJ5JylcbiAgICB9XG4gICAgdGhpcy5yZWdpc3RyeUxpbnRlcnMgPSBuZXcgTGludGVyUmVnaXN0cnkoKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5yZWdpc3RyeUxpbnRlcnMpXG4gICAgdGhpcy5yZWdpc3RyeUxpbnRlcnMub25EaWRVcGRhdGVNZXNzYWdlcygoeyBsaW50ZXIsIG1lc3NhZ2VzLCBidWZmZXIgfSkgPT4ge1xuICAgICAgdGhpcy5yZWdpc3RyeU1lc3NhZ2VzSW5pdCgpXG4gICAgICB0aGlzLnJlZ2lzdHJ5TWVzc2FnZXMuc2V0KHsgbGludGVyLCBtZXNzYWdlcywgYnVmZmVyIH0pXG4gICAgfSlcbiAgICB0aGlzLnJlZ2lzdHJ5TGludGVycy5vbkRpZEJlZ2luTGludGluZygoeyBsaW50ZXIsIGZpbGVQYXRoIH0pID0+IHtcbiAgICAgIHRoaXMucmVnaXN0cnlVSUluaXQoKVxuICAgICAgdGhpcy5yZWdpc3RyeVVJLmRpZEJlZ2luTGludGluZyhsaW50ZXIsIGZpbGVQYXRoKVxuICAgIH0pXG4gICAgdGhpcy5yZWdpc3RyeUxpbnRlcnMub25EaWRGaW5pc2hMaW50aW5nKCh7IGxpbnRlciwgZmlsZVBhdGggfSkgPT4ge1xuICAgICAgdGhpcy5yZWdpc3RyeVVJSW5pdCgpXG4gICAgICB0aGlzLnJlZ2lzdHJ5VUkuZGlkRmluaXNoTGludGluZyhsaW50ZXIsIGZpbGVQYXRoKVxuICAgIH0pXG4gIH1cbiAgcmVnaXN0cnlJbmRpZUluaXQoKSB7XG4gICAgaWYgKHRoaXMucmVnaXN0cnlJbmRpZSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGlmICghSW5kaWVSZWdpc3RyeSkge1xuICAgICAgSW5kaWVSZWdpc3RyeSA9IHJlcXVpcmUoJy4vaW5kaWUtcmVnaXN0cnknKVxuICAgIH1cbiAgICB0aGlzLnJlZ2lzdHJ5SW5kaWUgPSBuZXcgSW5kaWVSZWdpc3RyeSgpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLnJlZ2lzdHJ5SW5kaWUpXG4gICAgdGhpcy5yZWdpc3RyeUluZGllLm9ic2VydmUoKGluZGllTGludGVyKSA9PiB7XG4gICAgICBpbmRpZUxpbnRlci5vbkRpZERlc3Ryb3koKCkgPT4ge1xuICAgICAgICB0aGlzLnJlZ2lzdHJ5TWVzc2FnZXNJbml0KClcbiAgICAgICAgdGhpcy5yZWdpc3RyeU1lc3NhZ2VzLmRlbGV0ZUJ5TGludGVyKGluZGllTGludGVyKVxuICAgICAgfSlcbiAgICB9KVxuICAgIHRoaXMucmVnaXN0cnlJbmRpZS5vbkRpZFVwZGF0ZSgoeyBsaW50ZXIsIG1lc3NhZ2VzIH0pID0+IHtcbiAgICAgIHRoaXMucmVnaXN0cnlNZXNzYWdlc0luaXQoKVxuICAgICAgdGhpcy5yZWdpc3RyeU1lc3NhZ2VzLnNldCh7IGxpbnRlciwgbWVzc2FnZXMsIGJ1ZmZlcjogbnVsbCB9KVxuICAgIH0pXG4gIH1cbiAgcmVnaXN0cnlNZXNzYWdlc0luaXQoKSB7XG4gICAgaWYgKHRoaXMucmVnaXN0cnlNZXNzYWdlcykge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGlmICghTWVzc2FnZVJlZ2lzdHJ5KSB7XG4gICAgICBNZXNzYWdlUmVnaXN0cnkgPSByZXF1aXJlKCcuL21lc3NhZ2UtcmVnaXN0cnknKVxuICAgIH1cbiAgICB0aGlzLnJlZ2lzdHJ5TWVzc2FnZXMgPSBuZXcgTWVzc2FnZVJlZ2lzdHJ5KClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMucmVnaXN0cnlNZXNzYWdlcylcbiAgICB0aGlzLnJlZ2lzdHJ5TWVzc2FnZXMub25EaWRVcGRhdGVNZXNzYWdlcygoZGlmZmVyZW5jZSkgPT4ge1xuICAgICAgdGhpcy5yZWdpc3RyeVVJSW5pdCgpXG4gICAgICB0aGlzLnJlZ2lzdHJ5VUkucmVuZGVyKGRpZmZlcmVuY2UpXG4gICAgfSlcbiAgfVxuICByZWdpc3RyeVVJSW5pdCgpIHtcbiAgICBpZiAodGhpcy5yZWdpc3RyeVVJKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgaWYgKCFVSVJlZ2lzdHJ5KSB7XG4gICAgICBVSVJlZ2lzdHJ5ID0gcmVxdWlyZSgnLi91aS1yZWdpc3RyeScpXG4gICAgfVxuICAgIHRoaXMucmVnaXN0cnlVSSA9IG5ldyBVSVJlZ2lzdHJ5KClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMucmVnaXN0cnlVSSlcbiAgfVxuXG4gIC8vIEFQSSBtZXRob2RzIGZvciBwcm92aWRpbmcvY29uc3VtaW5nIHNlcnZpY2VzXG4gIC8vIFVJXG4gIGFkZFVJKHVpOiBVSSkge1xuICAgIHRoaXMucmVnaXN0cnlVSUluaXQoKVxuICAgIHRoaXMucmVnaXN0cnlVSS5hZGQodWkpXG4gICAgdGhpcy5yZWdpc3RyeU1lc3NhZ2VzSW5pdCgpXG4gICAgY29uc3QgbWVzc2FnZXMgPSB0aGlzLnJlZ2lzdHJ5TWVzc2FnZXMubWVzc2FnZXNcbiAgICBpZiAobWVzc2FnZXMubGVuZ3RoKSB7XG4gICAgICB1aS5yZW5kZXIoeyBhZGRlZDogbWVzc2FnZXMsIG1lc3NhZ2VzLCByZW1vdmVkOiBbXSB9KVxuICAgIH1cbiAgfVxuICBkZWxldGVVSSh1aTogVUkpIHtcbiAgICB0aGlzLnJlZ2lzdHJ5VUlJbml0KClcbiAgICB0aGlzLnJlZ2lzdHJ5VUkuZGVsZXRlKHVpKVxuICB9XG4gIC8vIFN0YW5kYXJkIExpbnRlclxuICBhZGRMaW50ZXIobGludGVyOiBMaW50ZXJQcm92aWRlciwgbGVnYWN5OiBib29sZWFuID0gZmFsc2UpIHtcbiAgICB0aGlzLnJlZ2lzdHJ5TGludGVyc0luaXQoKVxuICAgIHRoaXMucmVnaXN0cnlMaW50ZXJzLmFkZExpbnRlcihsaW50ZXIsIGxlZ2FjeSlcbiAgfVxuICBkZWxldGVMaW50ZXIobGludGVyOiBMaW50ZXJQcm92aWRlcikge1xuICAgIHRoaXMucmVnaXN0cnlMaW50ZXJzSW5pdCgpXG4gICAgdGhpcy5yZWdpc3RyeUxpbnRlcnMuZGVsZXRlTGludGVyKGxpbnRlcilcbiAgICB0aGlzLnJlZ2lzdHJ5TWVzc2FnZXNJbml0KClcbiAgICB0aGlzLnJlZ2lzdHJ5TWVzc2FnZXMuZGVsZXRlQnlMaW50ZXIobGludGVyKVxuICB9XG4gIC8vIEluZGllIExpbnRlclxuICBhZGRJbmRpZShpbmRpZTogT2JqZWN0KSB7XG4gICAgdGhpcy5yZWdpc3RyeUluZGllSW5pdCgpXG4gICAgcmV0dXJuIHRoaXMucmVnaXN0cnlJbmRpZS5yZWdpc3RlcihpbmRpZSwgMilcbiAgfVxuICBhZGRMZWdhY3lJbmRpZShpbmRpZTogT2JqZWN0KSB7XG4gICAgdGhpcy5yZWdpc3RyeUluZGllSW5pdCgpXG4gICAgcmV0dXJuIHRoaXMucmVnaXN0cnlJbmRpZS5yZWdpc3RlcihpbmRpZSwgMSlcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IExpbnRlclxuIl19