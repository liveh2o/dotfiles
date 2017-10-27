var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _commands = require('./commands');

var _commands2 = _interopRequireDefault(_commands);

var Helpers = undefined;
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
      _this.registryUIInit();
      _this.registryIndieInit();
      _this.registryLintersInit();
      _this.commands.showDebug(_this.registryLinters.getProviders(), _this.registryIndie.getProviders(), _this.registryUI.getProviders());
    }));
    this.commands.onShouldToggleLinter(function (action) {
      if (!ToggleView) {
        ToggleView = require('./toggle-view');
      }
      if (!arrayUnique) {
        arrayUnique = require('lodash.uniq');
      }
      _this.registryLintersInit();
      var toggleView = new ToggleView(action, arrayUnique(_this.registryLinters.getProviders().map(function (linter) {
        return linter.name;
      })));
      toggleView.onDidDispose(function () {
        _this.subscriptions.remove(toggleView);
      });
      toggleView.onDidDisable(function (name) {
        var linter = _this.registryLinters.getProviders().find(function (entry) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7b0JBRW9DLE1BQU07O3dCQUVyQixZQUFZOzs7O0FBR2pDLElBQUksT0FBTyxZQUFBLENBQUE7QUFDWCxJQUFJLFVBQVUsWUFBQSxDQUFBO0FBQ2QsSUFBSSxVQUFVLFlBQUEsQ0FBQTtBQUNkLElBQUksV0FBVyxZQUFBLENBQUE7QUFDZixJQUFJLGFBQWEsWUFBQSxDQUFBO0FBQ2pCLElBQUksY0FBYyxZQUFBLENBQUE7QUFDbEIsSUFBSSxlQUFlLFlBQUEsQ0FBQTtBQUNuQixJQUFJLGVBQWUsWUFBQSxDQUFBOztJQUViLE1BQU07QUFVQyxXQVZQLE1BQU0sR0FVSTs7OzBCQVZWLE1BQU07O0FBV1IsUUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBO0FBQzlCLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7O0FBRTlDLFFBQUksQ0FBQyxRQUFRLEdBQUcsMkJBQWMsQ0FBQTtBQUM5QixRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7O0FBRXJDLFFBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLFlBQU07QUFDL0IsWUFBSyxtQkFBbUIsRUFBRSxDQUFBO0FBQzFCLFVBQU0sWUFBWSxHQUFHLE1BQUssZUFBZSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFtQixFQUFFLENBQUMsQ0FBQTtBQUNuRixVQUFJLFlBQVksRUFBRTtBQUNoQixvQkFBWSxDQUFDLElBQUksRUFBRSxDQUFBO09BQ3BCO0tBQ0YsQ0FBQyxDQUFBO0FBQ0YsUUFBSSxDQUFDLFFBQVEsQ0FBQywwQkFBMEIsQ0FBQyxZQUFNO0FBQzdDLFVBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQW1CLEVBQUUsQ0FBQTtBQUN2RCxZ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QUE7S0FDN0M7OztTQTFORyxNQUFNOzs7QUE2TlosTUFBTSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUEiLCJmaWxlIjoiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvbWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdhdG9tJ1xuXG5pbXBvcnQgQ29tbWFuZHMgZnJvbSAnLi9jb21tYW5kcydcbmltcG9ydCB0eXBlIHsgVUksIExpbnRlciBhcyBMaW50ZXJQcm92aWRlciB9IGZyb20gJy4vdHlwZXMnXG5cbmxldCBIZWxwZXJzXG5sZXQgVG9nZ2xlVmlld1xubGV0IFVJUmVnaXN0cnlcbmxldCBhcnJheVVuaXF1ZVxubGV0IEluZGllUmVnaXN0cnlcbmxldCBMaW50ZXJSZWdpc3RyeVxubGV0IEVkaXRvcnNSZWdpc3RyeVxubGV0IE1lc3NhZ2VSZWdpc3RyeVxuXG5jbGFzcyBMaW50ZXIge1xuICBjb21tYW5kczogQ29tbWFuZHM7XG4gIHJlZ2lzdHJ5VUk6IFVJUmVnaXN0cnk7XG4gIHJlZ2lzdHJ5SW5kaWU6IEluZGllUmVnaXN0cnk7XG4gIHJlZ2lzdHJ5RWRpdG9yczogRWRpdG9yc1JlZ2lzdHJ5O1xuICByZWdpc3RyeUxpbnRlcnM6IExpbnRlclJlZ2lzdHJ5O1xuICByZWdpc3RyeU1lc3NhZ2VzOiBNZXNzYWdlUmVnaXN0cnk7XG4gIHN1YnNjcmlwdGlvbnM6IENvbXBvc2l0ZURpc3Bvc2FibGU7XG4gIGlkbGVDYWxsYmFja3M6IFNldDxudW1iZXI+O1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuaWRsZUNhbGxiYWNrcyA9IG5ldyBTZXQoKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcblxuICAgIHRoaXMuY29tbWFuZHMgPSBuZXcgQ29tbWFuZHMoKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5jb21tYW5kcylcblxuICAgIHRoaXMuY29tbWFuZHMub25TaG91bGRMaW50KCgpID0+IHtcbiAgICAgIHRoaXMucmVnaXN0cnlFZGl0b3JzSW5pdCgpXG4gICAgICBjb25zdCBlZGl0b3JMaW50ZXIgPSB0aGlzLnJlZ2lzdHJ5RWRpdG9ycy5nZXQoYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpKVxuICAgICAgaWYgKGVkaXRvckxpbnRlcikge1xuICAgICAgICBlZGl0b3JMaW50ZXIubGludCgpXG4gICAgICB9XG4gICAgfSlcbiAgICB0aGlzLmNvbW1hbmRzLm9uU2hvdWxkVG9nZ2xlQWN0aXZlRWRpdG9yKCgpID0+IHtcbiAgICAgIGNvbnN0IHRleHRFZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgIHRoaXMucmVnaXN0cnlFZGl0b3JzSW5pdCgpXG4gICAgICBjb25zdCBlZGl0b3IgPSB0aGlzLnJlZ2lzdHJ5RWRpdG9ycy5nZXQodGV4dEVkaXRvcilcbiAgICAgIGlmIChlZGl0b3IpIHtcbiAgICAgICAgZWRpdG9yLmRpc3Bvc2UoKVxuICAgICAgfSBlbHNlIGlmICh0ZXh0RWRpdG9yKSB7XG4gICAgICAgIHRoaXMucmVnaXN0cnlFZGl0b3JzLmNyZWF0ZUZyb21UZXh0RWRpdG9yKHRleHRFZGl0b3IpXG4gICAgICB9XG4gICAgfSlcbiAgICB0aGlzLmNvbW1hbmRzLm9uU2hvdWxkRGVidWcoYXN5bmMgKCkgPT4ge1xuICAgICAgaWYgKCFIZWxwZXJzKSB7XG4gICAgICAgIEhlbHBlcnMgPSByZXF1aXJlKCcuL2hlbHBlcnMnKVxuICAgICAgfVxuICAgICAgdGhpcy5yZWdpc3RyeVVJSW5pdCgpXG4gICAgICB0aGlzLnJlZ2lzdHJ5SW5kaWVJbml0KClcbiAgICAgIHRoaXMucmVnaXN0cnlMaW50ZXJzSW5pdCgpXG4gICAgICB0aGlzLmNvbW1hbmRzLnNob3dEZWJ1ZyhcbiAgICAgICAgdGhpcy5yZWdpc3RyeUxpbnRlcnMuZ2V0UHJvdmlkZXJzKCksXG4gICAgICAgIHRoaXMucmVnaXN0cnlJbmRpZS5nZXRQcm92aWRlcnMoKSxcbiAgICAgICAgdGhpcy5yZWdpc3RyeVVJLmdldFByb3ZpZGVycygpLFxuICAgICAgKVxuICAgIH0pXG4gICAgdGhpcy5jb21tYW5kcy5vblNob3VsZFRvZ2dsZUxpbnRlcigoYWN0aW9uKSA9PiB7XG4gICAgICBpZiAoIVRvZ2dsZVZpZXcpIHtcbiAgICAgICAgVG9nZ2xlVmlldyA9IHJlcXVpcmUoJy4vdG9nZ2xlLXZpZXcnKVxuICAgICAgfVxuICAgICAgaWYgKCFhcnJheVVuaXF1ZSkge1xuICAgICAgICBhcnJheVVuaXF1ZSA9IHJlcXVpcmUoJ2xvZGFzaC51bmlxJylcbiAgICAgIH1cbiAgICAgIHRoaXMucmVnaXN0cnlMaW50ZXJzSW5pdCgpXG4gICAgICBjb25zdCB0b2dnbGVWaWV3ID0gbmV3IFRvZ2dsZVZpZXcoYWN0aW9uLFxuICAgICAgICBhcnJheVVuaXF1ZSh0aGlzLnJlZ2lzdHJ5TGludGVycy5nZXRQcm92aWRlcnMoKS5tYXAobGludGVyID0+IGxpbnRlci5uYW1lKSkpXG4gICAgICB0b2dnbGVWaWV3Lm9uRGlkRGlzcG9zZSgoKSA9PiB7XG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5yZW1vdmUodG9nZ2xlVmlldylcbiAgICAgIH0pXG4gICAgICB0b2dnbGVWaWV3Lm9uRGlkRGlzYWJsZSgobmFtZSkgPT4ge1xuICAgICAgICBjb25zdCBsaW50ZXIgPSB0aGlzLnJlZ2lzdHJ5TGludGVycy5nZXRQcm92aWRlcnMoKS5maW5kKGVudHJ5ID0+IGVudHJ5Lm5hbWUgPT09IG5hbWUpXG4gICAgICAgIGlmIChsaW50ZXIpIHtcbiAgICAgICAgICB0aGlzLnJlZ2lzdHJ5TWVzc2FnZXNJbml0KClcbiAgICAgICAgICB0aGlzLnJlZ2lzdHJ5TWVzc2FnZXMuZGVsZXRlQnlMaW50ZXIobGludGVyKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgdG9nZ2xlVmlldy5zaG93KClcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodG9nZ2xlVmlldylcbiAgICB9KVxuXG4gICAgY29uc3QgcHJvamVjdFBhdGhDaGFuZ2VDYWxsYmFja0lEID0gd2luZG93LnJlcXVlc3RJZGxlQ2FsbGJhY2soXG4gICAgICBmdW5jdGlvbiBwcm9qZWN0UGF0aENoYW5nZSgpIHtcbiAgICAgICAgdGhpcy5pZGxlQ2FsbGJhY2tzLmRlbGV0ZShwcm9qZWN0UGF0aENoYW5nZUNhbGxiYWNrSUQpXG4gICAgICAgIC8vIE5PVEU6IEF0b20gdHJpZ2dlcnMgdGhpcyBvbiBib290IHNvIHdhaXQgYSB3aGlsZVxuICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20ucHJvamVjdC5vbkRpZENoYW5nZVBhdGhzKCgpID0+IHtcbiAgICAgICAgICB0aGlzLmNvbW1hbmRzLmxpbnQoKVxuICAgICAgICB9KSlcbiAgICAgIH0uYmluZCh0aGlzKSlcbiAgICB0aGlzLmlkbGVDYWxsYmFja3MuYWRkKHByb2plY3RQYXRoQ2hhbmdlQ2FsbGJhY2tJRClcblxuICAgIGNvbnN0IHJlZ2lzdHJ5RWRpdG9yc0luaXRDYWxsYmFja0lEID0gd2luZG93LnJlcXVlc3RJZGxlQ2FsbGJhY2soXG4gICAgICBmdW5jdGlvbiByZWdpc3RyeUVkaXRvcnNJZGxlSW5pdCgpIHtcbiAgICAgICAgdGhpcy5pZGxlQ2FsbGJhY2tzLmRlbGV0ZShyZWdpc3RyeUVkaXRvcnNJbml0Q2FsbGJhY2tJRClcbiAgICAgICAgLy8gVGhpcyB3aWxsIGJlIGNhbGxlZCBvbiB0aGUgZmx5IGlmIG5lZWRlZCwgYnV0IG5lZWRzIHRvIHJ1biBvbiBpdCdzXG4gICAgICAgIC8vIG93biBhdCBzb21lIHBvaW50IG9yIGxpbnRpbmcgb24gb3BlbiBvciBvbiBjaGFuZ2Ugd2lsbCBuZXZlciB0cmlnZ2VyXG4gICAgICAgIHRoaXMucmVnaXN0cnlFZGl0b3JzSW5pdCgpXG4gICAgICB9LmJpbmQodGhpcykpXG4gICAgdGhpcy5pZGxlQ2FsbGJhY2tzLmFkZChyZWdpc3RyeUVkaXRvcnNJbml0Q2FsbGJhY2tJRClcbiAgfVxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMuaWRsZUNhbGxiYWNrcy5mb3JFYWNoKGNhbGxiYWNrSUQgPT4gd2luZG93LmNhbmNlbElkbGVDYWxsYmFjayhjYWxsYmFja0lEKSlcbiAgICB0aGlzLmlkbGVDYWxsYmFja3MuY2xlYXIoKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgfVxuXG4gIHJlZ2lzdHJ5RWRpdG9yc0luaXQoKSB7XG4gICAgaWYgKHRoaXMucmVnaXN0cnlFZGl0b3JzKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgaWYgKCFFZGl0b3JzUmVnaXN0cnkpIHtcbiAgICAgIEVkaXRvcnNSZWdpc3RyeSA9IHJlcXVpcmUoJy4vZWRpdG9yLXJlZ2lzdHJ5JylcbiAgICB9XG4gICAgdGhpcy5yZWdpc3RyeUVkaXRvcnMgPSBuZXcgRWRpdG9yc1JlZ2lzdHJ5KClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMucmVnaXN0cnlFZGl0b3JzKVxuICAgIHRoaXMucmVnaXN0cnlFZGl0b3JzLm9ic2VydmUoKGVkaXRvckxpbnRlcikgPT4ge1xuICAgICAgZWRpdG9yTGludGVyLm9uU2hvdWxkTGludCgob25DaGFuZ2UpID0+IHtcbiAgICAgICAgdGhpcy5yZWdpc3RyeUxpbnRlcnNJbml0KClcbiAgICAgICAgdGhpcy5yZWdpc3RyeUxpbnRlcnMubGludCh7IG9uQ2hhbmdlLCBlZGl0b3I6IGVkaXRvckxpbnRlci5nZXRFZGl0b3IoKSB9KVxuICAgICAgfSlcbiAgICAgIGVkaXRvckxpbnRlci5vbkRpZERlc3Ryb3koKCkgPT4ge1xuICAgICAgICB0aGlzLnJlZ2lzdHJ5TWVzc2FnZXNJbml0KClcbiAgICAgICAgdGhpcy5yZWdpc3RyeU1lc3NhZ2VzLmRlbGV0ZUJ5QnVmZmVyKGVkaXRvckxpbnRlci5nZXRFZGl0b3IoKS5nZXRCdWZmZXIoKSlcbiAgICAgIH0pXG4gICAgfSlcbiAgICB0aGlzLnJlZ2lzdHJ5RWRpdG9ycy5hY3RpdmF0ZSgpXG4gIH1cbiAgcmVnaXN0cnlMaW50ZXJzSW5pdCgpIHtcbiAgICBpZiAodGhpcy5yZWdpc3RyeUxpbnRlcnMpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBpZiAoIUxpbnRlclJlZ2lzdHJ5KSB7XG4gICAgICBMaW50ZXJSZWdpc3RyeSA9IHJlcXVpcmUoJy4vbGludGVyLXJlZ2lzdHJ5JylcbiAgICB9XG4gICAgdGhpcy5yZWdpc3RyeUxpbnRlcnMgPSBuZXcgTGludGVyUmVnaXN0cnkoKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5yZWdpc3RyeUxpbnRlcnMpXG4gICAgdGhpcy5yZWdpc3RyeUxpbnRlcnMub25EaWRVcGRhdGVNZXNzYWdlcygoeyBsaW50ZXIsIG1lc3NhZ2VzLCBidWZmZXIgfSkgPT4ge1xuICAgICAgdGhpcy5yZWdpc3RyeU1lc3NhZ2VzSW5pdCgpXG4gICAgICB0aGlzLnJlZ2lzdHJ5TWVzc2FnZXMuc2V0KHsgbGludGVyLCBtZXNzYWdlcywgYnVmZmVyIH0pXG4gICAgfSlcbiAgICB0aGlzLnJlZ2lzdHJ5TGludGVycy5vbkRpZEJlZ2luTGludGluZygoeyBsaW50ZXIsIGZpbGVQYXRoIH0pID0+IHtcbiAgICAgIHRoaXMucmVnaXN0cnlVSUluaXQoKVxuICAgICAgdGhpcy5yZWdpc3RyeVVJLmRpZEJlZ2luTGludGluZyhsaW50ZXIsIGZpbGVQYXRoKVxuICAgIH0pXG4gICAgdGhpcy5yZWdpc3RyeUxpbnRlcnMub25EaWRGaW5pc2hMaW50aW5nKCh7IGxpbnRlciwgZmlsZVBhdGggfSkgPT4ge1xuICAgICAgdGhpcy5yZWdpc3RyeVVJSW5pdCgpXG4gICAgICB0aGlzLnJlZ2lzdHJ5VUkuZGlkRmluaXNoTGludGluZyhsaW50ZXIsIGZpbGVQYXRoKVxuICAgIH0pXG4gIH1cbiAgcmVnaXN0cnlJbmRpZUluaXQoKSB7XG4gICAgaWYgKHRoaXMucmVnaXN0cnlJbmRpZSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGlmICghSW5kaWVSZWdpc3RyeSkge1xuICAgICAgSW5kaWVSZWdpc3RyeSA9IHJlcXVpcmUoJy4vaW5kaWUtcmVnaXN0cnknKVxuICAgIH1cbiAgICB0aGlzLnJlZ2lzdHJ5SW5kaWUgPSBuZXcgSW5kaWVSZWdpc3RyeSgpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLnJlZ2lzdHJ5SW5kaWUpXG4gICAgdGhpcy5yZWdpc3RyeUluZGllLm9ic2VydmUoKGluZGllTGludGVyKSA9PiB7XG4gICAgICBpbmRpZUxpbnRlci5vbkRpZERlc3Ryb3koKCkgPT4ge1xuICAgICAgICB0aGlzLnJlZ2lzdHJ5TWVzc2FnZXNJbml0KClcbiAgICAgICAgdGhpcy5yZWdpc3RyeU1lc3NhZ2VzLmRlbGV0ZUJ5TGludGVyKGluZGllTGludGVyKVxuICAgICAgfSlcbiAgICB9KVxuICAgIHRoaXMucmVnaXN0cnlJbmRpZS5vbkRpZFVwZGF0ZSgoeyBsaW50ZXIsIG1lc3NhZ2VzIH0pID0+IHtcbiAgICAgIHRoaXMucmVnaXN0cnlNZXNzYWdlc0luaXQoKVxuICAgICAgdGhpcy5yZWdpc3RyeU1lc3NhZ2VzLnNldCh7IGxpbnRlciwgbWVzc2FnZXMsIGJ1ZmZlcjogbnVsbCB9KVxuICAgIH0pXG4gIH1cbiAgcmVnaXN0cnlNZXNzYWdlc0luaXQoKSB7XG4gICAgaWYgKHRoaXMucmVnaXN0cnlNZXNzYWdlcykge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGlmICghTWVzc2FnZVJlZ2lzdHJ5KSB7XG4gICAgICBNZXNzYWdlUmVnaXN0cnkgPSByZXF1aXJlKCcuL21lc3NhZ2UtcmVnaXN0cnknKVxuICAgIH1cbiAgICB0aGlzLnJlZ2lzdHJ5TWVzc2FnZXMgPSBuZXcgTWVzc2FnZVJlZ2lzdHJ5KClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMucmVnaXN0cnlNZXNzYWdlcylcbiAgICB0aGlzLnJlZ2lzdHJ5TWVzc2FnZXMub25EaWRVcGRhdGVNZXNzYWdlcygoZGlmZmVyZW5jZSkgPT4ge1xuICAgICAgdGhpcy5yZWdpc3RyeVVJSW5pdCgpXG4gICAgICB0aGlzLnJlZ2lzdHJ5VUkucmVuZGVyKGRpZmZlcmVuY2UpXG4gICAgfSlcbiAgfVxuICByZWdpc3RyeVVJSW5pdCgpIHtcbiAgICBpZiAodGhpcy5yZWdpc3RyeVVJKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgaWYgKCFVSVJlZ2lzdHJ5KSB7XG4gICAgICBVSVJlZ2lzdHJ5ID0gcmVxdWlyZSgnLi91aS1yZWdpc3RyeScpXG4gICAgfVxuICAgIHRoaXMucmVnaXN0cnlVSSA9IG5ldyBVSVJlZ2lzdHJ5KClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMucmVnaXN0cnlVSSlcbiAgfVxuXG4gIC8vIEFQSSBtZXRob2RzIGZvciBwcm92aWRpbmcvY29uc3VtaW5nIHNlcnZpY2VzXG4gIC8vIFVJXG4gIGFkZFVJKHVpOiBVSSkge1xuICAgIHRoaXMucmVnaXN0cnlVSUluaXQoKVxuICAgIHRoaXMucmVnaXN0cnlVSS5hZGQodWkpXG4gICAgdGhpcy5yZWdpc3RyeU1lc3NhZ2VzSW5pdCgpXG4gICAgY29uc3QgbWVzc2FnZXMgPSB0aGlzLnJlZ2lzdHJ5TWVzc2FnZXMubWVzc2FnZXNcbiAgICBpZiAobWVzc2FnZXMubGVuZ3RoKSB7XG4gICAgICB1aS5yZW5kZXIoeyBhZGRlZDogbWVzc2FnZXMsIG1lc3NhZ2VzLCByZW1vdmVkOiBbXSB9KVxuICAgIH1cbiAgfVxuICBkZWxldGVVSSh1aTogVUkpIHtcbiAgICB0aGlzLnJlZ2lzdHJ5VUlJbml0KClcbiAgICB0aGlzLnJlZ2lzdHJ5VUkuZGVsZXRlKHVpKVxuICB9XG4gIC8vIFN0YW5kYXJkIExpbnRlclxuICBhZGRMaW50ZXIobGludGVyOiBMaW50ZXJQcm92aWRlciwgbGVnYWN5OiBib29sZWFuID0gZmFsc2UpIHtcbiAgICB0aGlzLnJlZ2lzdHJ5TGludGVyc0luaXQoKVxuICAgIHRoaXMucmVnaXN0cnlMaW50ZXJzLmFkZExpbnRlcihsaW50ZXIsIGxlZ2FjeSlcbiAgfVxuICBkZWxldGVMaW50ZXIobGludGVyOiBMaW50ZXJQcm92aWRlcikge1xuICAgIHRoaXMucmVnaXN0cnlMaW50ZXJzSW5pdCgpXG4gICAgdGhpcy5yZWdpc3RyeUxpbnRlcnMuZGVsZXRlTGludGVyKGxpbnRlcilcbiAgICB0aGlzLnJlZ2lzdHJ5TWVzc2FnZXNJbml0KClcbiAgICB0aGlzLnJlZ2lzdHJ5TWVzc2FnZXMuZGVsZXRlQnlMaW50ZXIobGludGVyKVxuICB9XG4gIC8vIEluZGllIExpbnRlclxuICBhZGRJbmRpZShpbmRpZTogT2JqZWN0KSB7XG4gICAgdGhpcy5yZWdpc3RyeUluZGllSW5pdCgpXG4gICAgcmV0dXJuIHRoaXMucmVnaXN0cnlJbmRpZS5yZWdpc3RlcihpbmRpZSwgMilcbiAgfVxuICBhZGRMZWdhY3lJbmRpZShpbmRpZTogT2JqZWN0KSB7XG4gICAgdGhpcy5yZWdpc3RyeUluZGllSW5pdCgpXG4gICAgcmV0dXJuIHRoaXMucmVnaXN0cnlJbmRpZS5yZWdpc3RlcihpbmRpZSwgMSlcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IExpbnRlclxuIl19