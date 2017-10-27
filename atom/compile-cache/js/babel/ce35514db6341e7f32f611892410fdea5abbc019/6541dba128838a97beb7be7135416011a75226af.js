function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var _jasmineFix = require('jasmine-fix');

var _libHelpers = require('../lib/helpers');

var Helpers = _interopRequireWildcard(_libHelpers);

var _libLinterRegistry = require('../lib/linter-registry');

var _libLinterRegistry2 = _interopRequireDefault(_libLinterRegistry);

var _common = require('./common');

describe('LinterRegistry', function () {
  var linterRegistry = undefined;

  (0, _jasmineFix.beforeEach)(_asyncToGenerator(function* () {
    atom.packages.loadPackage('linter');
    atom.packages.loadPackage('language-javascript');
    linterRegistry = new _libLinterRegistry2['default']();
    yield atom.packages.activatePackage('language-javascript');
    yield atom.workspace.open(__filename);
  }));
  afterEach(function () {
    linterRegistry.dispose();
    atom.workspace.destroyActivePane();
  });

  describe('life cycle', function () {
    (0, _jasmineFix.it)('works', function () {
      var linter = (0, _common.getLinter)();
      expect(linterRegistry.hasLinter(linter)).toBe(false);
      linterRegistry.addLinter(linter);
      expect(linterRegistry.hasLinter(linter)).toBe(true);
      linterRegistry.deleteLinter(linter);
      expect(linterRegistry.hasLinter(linter)).toBe(false);
    });
    (0, _jasmineFix.it)('sets props on add', function () {
      var linter = (0, _common.getLinter)();
      expect(typeof linter[Helpers.$version]).toBe('undefined');
      expect(typeof linter[Helpers.$requestLatest]).toBe('undefined');
      expect(typeof linter[Helpers.$requestLastReceived]).toBe('undefined');
      linterRegistry.addLinter(linter);
      expect(typeof linter[Helpers.$version]).toBe('number');
      expect(typeof linter[Helpers.$requestLatest]).toBe('number');
      expect(typeof linter[Helpers.$requestLastReceived]).toBe('number');
      expect(linter[Helpers.$version]).toBe(2);
      expect(linter[Helpers.$requestLatest]).toBe(0);
      expect(linter[Helpers.$requestLastReceived]).toBe(0);
    });
    (0, _jasmineFix.it)('sets version based on legacy param', function () {
      {
        // scenario: 2
        var linter = (0, _common.getLinter)();
        linterRegistry.addLinter(linter);
        expect(linter[Helpers.$version]).toBe(2);
      }
      {
        // scenario: 1
        var linter = (0, _common.getLinter)();
        linter.lintOnFly = linter.lintsOnChange;
        linterRegistry.addLinter(linter, true);
        expect(linter[Helpers.$version]).toBe(1);
      }
    });
    (0, _jasmineFix.it)('deactivates the attributes on delete', function () {
      var linter = (0, _common.getLinter)();
      linterRegistry.addLinter(linter);
      expect(linter[Helpers.$activated]).toBe(true);
      linterRegistry.deleteLinter(linter);
      expect(linter[Helpers.$activated]).toBe(false);
    });
  });
  describe('::lint', function () {
    (0, _jasmineFix.it)('does not lint if editor is not saved on disk', _asyncToGenerator(function* () {
      try {
        yield atom.workspace.open();
        var editor = atom.workspace.getActiveTextEditor();
        expect((yield linterRegistry.lint({ editor: editor, onChange: false }))).toBe(false);
      } finally {
        atom.workspace.destroyActivePane();
      }
    }));
    (0, _jasmineFix.it)('does not lint if editor is ignored by VCS', _asyncToGenerator(function* () {
      try {
        yield atom.workspace.open((0, _common.getFixturesPath)('ignored.txt'));
        var editor = atom.workspace.getActiveTextEditor();
        expect((yield linterRegistry.lint({ editor: editor, onChange: false }))).toBe(false);
      } finally {
        atom.workspace.destroyActivePane();
      }
    }));
    (0, _jasmineFix.it)('does not lint onChange if onChange is disabled by config', _asyncToGenerator(function* () {
      try {
        atom.config.set('linter.lintOnChange', false);
        yield atom.workspace.open((0, _common.getFixturesPath)('file.txt'));
        var editor = atom.workspace.getActiveTextEditor();
        expect((yield linterRegistry.lint({ editor: editor, onChange: true }))).toBe(false);
      } finally {
        atom.config.set('linter.lintOnChange', true);
        atom.workspace.destroyActivePane();
      }
    }));
    (0, _jasmineFix.it)('lints onChange if allowed by config', _asyncToGenerator(function* () {
      try {
        yield atom.workspace.open((0, _common.getFixturesPath)('file.txt'));
        var editor = atom.workspace.getActiveTextEditor();
        expect((yield linterRegistry.lint({ editor: editor, onChange: true }))).toBe(true);
      } finally {
        atom.workspace.destroyActivePane();
      }
    }));
    (0, _jasmineFix.it)('does not lint preview tabs if disallowed by config', _asyncToGenerator(function* () {
      try {
        yield* (function* () {
          atom.config.set('linter.lintPreviewTabs', false);
          yield atom.workspace.open((0, _common.getFixturesPath)('file.txt'));
          var editor = atom.workspace.getActiveTextEditor();
          var activePane = atom.workspace.getActivePane();
          spyOn(activePane, 'getPendingItem').andCallFake(function () {
            return editor;
          });
          expect((yield linterRegistry.lint({ editor: editor, onChange: false }))).toBe(false);
        })();
      } finally {
        atom.config.set('linter.lintPreviewTabs', true);
        atom.workspace.destroyActivePane();
      }
    }));
    (0, _jasmineFix.it)('does lint preview tabs if allowed by config', _asyncToGenerator(function* () {
      try {
        yield atom.workspace.open((0, _common.getFixturesPath)('file.txt'));
        var editor = atom.workspace.getActiveTextEditor();
        editor.hasTerminatedPendingState = false;
        expect((yield linterRegistry.lint({ editor: editor, onChange: false }))).toBe(true);
      } finally {
        atom.workspace.destroyActivePane();
      }
    }));
    (0, _jasmineFix.it)('lints the editor even if its not the active one', _asyncToGenerator(function* () {
      try {
        yield atom.workspace.open((0, _common.getFixturesPath)('file.txt'));
        var editor = atom.workspace.getActiveTextEditor();
        yield atom.workspace.open(__filename);
        expect((yield linterRegistry.lint({ editor: editor, onChange: false }))).toBe(true);
      } finally {
        atom.workspace.destroyActivePane();
      }
    }));
    (0, _jasmineFix.it)('triggers providers if scopes match', _asyncToGenerator(function* () {
      var linter = (0, _common.getLinter)();
      var editor = atom.workspace.getActiveTextEditor();
      linterRegistry.addLinter(linter);
      spyOn(Helpers, 'shouldTriggerLinter').andCallThrough();
      spyOn(linter, 'lint').andCallThrough();
      expect((yield linterRegistry.lint({ editor: editor, onChange: false }))).toBe(true);
      expect(Helpers.shouldTriggerLinter).toHaveBeenCalled();
      // $FlowIgnore: It's a magic property, duh
      expect(Helpers.shouldTriggerLinter.calls.length).toBe(1);
      expect(linter.lint).toHaveBeenCalled();
      expect(linter.lint.calls.length).toBe(1);
    }));
    (0, _jasmineFix.it)('does not match if scopes dont match', _asyncToGenerator(function* () {
      var linter = (0, _common.getLinter)();
      var editor = atom.workspace.getActiveTextEditor();
      linter.grammarScopes = ['source.coffee'];
      linterRegistry.addLinter(linter);
      spyOn(Helpers, 'shouldTriggerLinter').andCallThrough();
      spyOn(linter, 'lint').andCallThrough();
      expect((yield linterRegistry.lint({ editor: editor, onChange: false }))).toBe(true);
      expect(Helpers.shouldTriggerLinter).toHaveBeenCalled();
      // $FlowIgnore: It's a magic property, duh
      expect(Helpers.shouldTriggerLinter.calls.length).toBe(1);
      expect(linter.lint).not.toHaveBeenCalled();
      expect(linter.lint.calls.length).toBe(0);
    }));
    (0, _jasmineFix.it)('emits events properly', _asyncToGenerator(function* () {
      var timesBegan = 0;
      var timesUpdated = 0;
      var timesFinished = 0;

      linterRegistry.onDidBeginLinting(function () {
        timesBegan++;
        expect(timesFinished).toBe(0);
      });
      linterRegistry.onDidFinishLinting(function () {
        timesFinished++;
        expect(timesUpdated).toBe(0);
      });
      linterRegistry.onDidUpdateMessages(function () {
        timesUpdated++;
        expect(timesFinished).toBe(1);
      });

      var linter = (0, _common.getLinter)();
      var editor = atom.workspace.getActiveTextEditor();
      linterRegistry.addLinter(linter);
      var promise = linterRegistry.lint({ editor: editor, onChange: false });
      expect((yield promise)).toBe(true);
      expect(timesBegan).toBe(1);
      expect(timesUpdated).toBe(1);
      expect(timesFinished).toBe(1);
    }));
    (0, _jasmineFix.it)('does not update if the buffer it was associated to was destroyed', _asyncToGenerator(function* () {
      var timesBegan = 0;
      var timesUpdated = 0;
      var timesFinished = 0;

      linterRegistry.onDidBeginLinting(function () {
        timesBegan++;
        expect(timesFinished).toBe(0);
      });
      linterRegistry.onDidFinishLinting(function () {
        timesFinished++;
        expect(timesUpdated).toBe(0);
      });
      linterRegistry.onDidUpdateMessages(function () {
        timesUpdated++;
        expect(timesFinished).toBe(1);
      });

      var linter = (0, _common.getLinter)();
      var editor = atom.workspace.getActiveTextEditor();
      linter.scope = 'file';
      linterRegistry.addLinter(linter);
      editor.destroy();
      var promise = linterRegistry.lint({ editor: editor, onChange: false });
      expect((yield promise)).toBe(true);
      expect(timesBegan).toBe(1);
      expect(timesUpdated).toBe(0);
      expect(timesFinished).toBe(1);
    }));
    (0, _jasmineFix.it)('does update if buffer was destroyed if its project scoped', _asyncToGenerator(function* () {
      var timesBegan = 0;
      var timesUpdated = 0;
      var timesFinished = 0;

      linterRegistry.onDidBeginLinting(function () {
        timesBegan++;
        expect(timesFinished).toBe(0);
      });
      linterRegistry.onDidFinishLinting(function () {
        timesFinished++;
        expect(timesUpdated).toBe(0);
      });
      linterRegistry.onDidUpdateMessages(function () {
        timesUpdated++;
        expect(timesFinished).toBe(1);
      });

      var linter = (0, _common.getLinter)();
      var editor = atom.workspace.getActiveTextEditor();
      linterRegistry.addLinter(linter);
      editor.destroy();
      var promise = linterRegistry.lint({ editor: editor, onChange: false });
      expect((yield promise)).toBe(true);
      expect(timesBegan).toBe(1);
      expect(timesUpdated).toBe(1);
      expect(timesFinished).toBe(1);
    }));
    (0, _jasmineFix.it)('does not update if null is returned', _asyncToGenerator(function* () {
      var promise = undefined;
      var timesBegan = 0;
      var timesUpdated = 0;
      var timesFinished = 0;

      linterRegistry.onDidBeginLinting(function () {
        timesBegan++;
        expect(timesBegan - 1).toBe(timesFinished);
      });
      linterRegistry.onDidFinishLinting(function () {
        timesFinished++;
        expect(timesFinished - 1).toBe(timesUpdated);
      });
      linterRegistry.onDidUpdateMessages(function () {
        timesUpdated++;
      });

      var linter = (0, _common.getLinter)();
      var editor = atom.workspace.getActiveTextEditor();
      linterRegistry.addLinter(linter);
      linter.lint = _asyncToGenerator(function* () {
        yield (0, _jasmineFix.wait)(50);
        if (timesBegan === 2) {
          return null;
        }
        return [];
      });

      promise = linterRegistry.lint({ editor: editor, onChange: false });
      expect((yield promise)).toBe(true);
      expect(timesUpdated).toBe(1);
      expect(timesFinished).toBe(1);
      promise = linterRegistry.lint({ editor: editor, onChange: false });
      expect((yield promise)).toBe(true);
      expect(timesUpdated).toBe(1);
      expect(timesFinished).toBe(2);
    }));
    (0, _jasmineFix.it)('shows error notification if response is not array and is non-null', _asyncToGenerator(function* () {
      var promise = undefined;
      var timesBegan = 0;
      var timesUpdated = 0;
      var timesFinished = 0;

      linterRegistry.onDidBeginLinting(function () {
        timesBegan++;
        expect(timesBegan - 1).toBe(timesFinished);
      });
      linterRegistry.onDidFinishLinting(function () {
        timesFinished++;
        // NOTE: Not adding a timesUpdated assertion here on purpose
        // Because we're testing invalid return values and they don't
        // update linter result
      });
      linterRegistry.onDidUpdateMessages(function () {
        timesUpdated++;
      });

      var linter = (0, _common.getLinter)();
      var editor = atom.workspace.getActiveTextEditor();
      linterRegistry.addLinter(linter);
      linter.lint = _asyncToGenerator(function* () {
        yield (0, _jasmineFix.wait)(50);
        if (timesBegan === 2) {
          return false;
        } else if (timesBegan === 3) {
          return null;
        } else if (timesBegan === 4) {
          return undefined;
        }
        return [];
      });

      // with array
      promise = linterRegistry.lint({ editor: editor, onChange: false });
      expect((yield promise)).toBe(true);
      expect(timesUpdated).toBe(1);
      expect(timesFinished).toBe(1);
      expect(atom.notifications.getNotifications().length).toBe(0);

      // with false
      promise = linterRegistry.lint({ editor: editor, onChange: false });
      expect((yield promise)).toBe(true);
      expect(timesUpdated).toBe(1);
      expect(timesFinished).toBe(2);
      expect(atom.notifications.getNotifications().length).toBe(1);

      // with null
      promise = linterRegistry.lint({ editor: editor, onChange: false });
      expect((yield promise)).toBe(true);
      expect(timesUpdated).toBe(1);
      expect(timesFinished).toBe(3);
      expect(atom.notifications.getNotifications().length).toBe(1);

      // with undefined
      promise = linterRegistry.lint({ editor: editor, onChange: false });
      expect((yield promise)).toBe(true);
      expect(timesUpdated).toBe(1);
      expect(timesFinished).toBe(4);
      expect(atom.notifications.getNotifications().length).toBe(2);
    }));
    (0, _jasmineFix.it)('triggers the finish event even when the provider crashes', _asyncToGenerator(function* () {
      var timesBegan = 0;
      var timesUpdated = 0;
      var timesFinished = 0;

      linterRegistry.onDidBeginLinting(function () {
        timesBegan++;
        expect(timesFinished).toBe(0);
      });
      linterRegistry.onDidFinishLinting(function () {
        timesFinished++;
        expect(timesUpdated).toBe(0);
      });
      linterRegistry.onDidUpdateMessages(function () {
        timesUpdated++;
        expect(timesFinished).toBe(1);
      });

      var linter = (0, _common.getLinter)();
      var editor = atom.workspace.getActiveTextEditor();
      linterRegistry.addLinter(linter);
      linter.lint = _asyncToGenerator(function* () {
        yield (0, _jasmineFix.wait)(50);throw new Error('Boom');
      });
      var promise = linterRegistry.lint({ editor: editor, onChange: false });
      expect((yield promise)).toBe(true);
      expect(timesBegan).toBe(1);
      expect(timesUpdated).toBe(0);
      expect(timesFinished).toBe(1);
    }));
    (0, _jasmineFix.it)('gives buffer for file scoped linters on update event', _asyncToGenerator(function* () {
      var timesBegan = 0;
      var timesUpdated = 0;
      var timesFinished = 0;

      linterRegistry.onDidBeginLinting(function () {
        timesBegan++;
        expect(timesFinished).toBe(0);
      });
      linterRegistry.onDidFinishLinting(function () {
        timesFinished++;
        expect(timesBegan).toBe(1);
      });
      linterRegistry.onDidUpdateMessages(function (_ref) {
        var buffer = _ref.buffer;

        timesUpdated++;
        expect(buffer.constructor.name).toBe('TextBuffer');
        expect(timesFinished).toBe(1);
      });

      var linter = (0, _common.getLinter)();
      var editor = atom.workspace.getActiveTextEditor();
      linter.scope = 'file';
      linterRegistry.addLinter(linter);
      var promise = linterRegistry.lint({ editor: editor, onChange: false });
      expect((yield promise)).toBe(true);
      expect(timesBegan).toBe(1);
      expect(timesUpdated).toBe(1);
      expect(timesFinished).toBe(1);
    }));
    (0, _jasmineFix.it)('does not give a buffer for project scoped linters on update event', _asyncToGenerator(function* () {
      var timesBegan = 0;
      var timesUpdated = 0;
      var timesFinished = 0;

      linterRegistry.onDidBeginLinting(function () {
        timesBegan++;
        expect(timesFinished).toBe(0);
      });
      linterRegistry.onDidFinishLinting(function () {
        timesFinished++;
        expect(timesBegan).toBe(1);
      });
      linterRegistry.onDidUpdateMessages(function (_ref2) {
        var buffer = _ref2.buffer;

        timesUpdated++;
        expect(buffer).toBe(null);
        expect(timesFinished).toBe(1);
      });

      var linter = (0, _common.getLinter)();
      var editor = atom.workspace.getActiveTextEditor();
      linterRegistry.addLinter(linter);
      var promise = linterRegistry.lint({ editor: editor, onChange: false });
      expect((yield promise)).toBe(true);
      expect(timesBegan).toBe(1);
      expect(timesUpdated).toBe(1);
      expect(timesFinished).toBe(1);
    }));
    (0, _jasmineFix.it)('gives a filepath for file scoped linters on start and finish events', _asyncToGenerator(function* () {
      var timesBegan = 0;
      var timesUpdated = 0;
      var timesFinished = 0;

      linterRegistry.onDidBeginLinting(function (_ref3) {
        var filePath = _ref3.filePath;

        timesBegan++;
        expect(timesFinished).toBe(0);
        expect(filePath).toBe(__filename);
      });
      linterRegistry.onDidFinishLinting(function (_ref4) {
        var filePath = _ref4.filePath;

        timesFinished++;
        expect(timesBegan).toBe(1);
        expect(filePath).toBe(__filename);
      });
      linterRegistry.onDidUpdateMessages(function () {
        timesUpdated++;
        expect(timesFinished).toBe(1);
      });

      var linter = (0, _common.getLinter)();
      var editor = atom.workspace.getActiveTextEditor();
      linter.scope = 'file';
      linterRegistry.addLinter(linter);
      var promise = linterRegistry.lint({ editor: editor, onChange: false });
      expect((yield promise)).toBe(true);
      expect(timesBegan).toBe(1);
      expect(timesUpdated).toBe(1);
      expect(timesFinished).toBe(1);
    }));
    (0, _jasmineFix.it)('does not give a file path for project scoped linters on start and finish events', _asyncToGenerator(function* () {
      var timesBegan = 0;
      var timesUpdated = 0;
      var timesFinished = 0;

      linterRegistry.onDidBeginLinting(function (_ref5) {
        var filePath = _ref5.filePath;

        timesBegan++;
        expect(timesFinished).toBe(0);
        expect(filePath).toBe(null);
      });
      linterRegistry.onDidFinishLinting(function (_ref6) {
        var filePath = _ref6.filePath;

        timesFinished++;
        expect(timesBegan).toBe(1);
        expect(filePath).toBe(null);
      });
      linterRegistry.onDidUpdateMessages(function () {
        timesUpdated++;
        expect(timesFinished).toBe(1);
      });

      var linter = (0, _common.getLinter)();
      var editor = atom.workspace.getActiveTextEditor();
      linterRegistry.addLinter(linter);
      var promise = linterRegistry.lint({ editor: editor, onChange: false });
      expect((yield promise)).toBe(true);
      expect(timesBegan).toBe(1);
      expect(timesUpdated).toBe(1);
      expect(timesFinished).toBe(1);
    }));
    (0, _jasmineFix.it)("does not invoke a linter if it's ignored", _asyncToGenerator(function* () {
      var promise = undefined;
      var timesBegan = 0;
      var timesUpdated = 0;
      var timesFinished = 0;

      linterRegistry.onDidBeginLinting(function () {
        return timesBegan++;
      });
      linterRegistry.onDidFinishLinting(function () {
        return timesFinished++;
      });
      linterRegistry.onDidUpdateMessages(function () {
        return timesUpdated++;
      });

      var linter = (0, _common.getLinter)();
      atom.config.set('linter.disabledProviders', []);
      var editor = atom.workspace.getActiveTextEditor();
      linter.name = 'Some Linter';
      linterRegistry.addLinter(linter);

      promise = linterRegistry.lint({ editor: editor, onChange: false });
      expect((yield promise)).toBe(true);
      expect(timesBegan).toBe(1);
      expect(timesBegan).toBe(1);
      expect(timesUpdated).toBe(1);
      expect(timesFinished).toBe(1);

      atom.config.set('linter.disabledProviders', [linter.name]);
      yield (0, _jasmineFix.wait)(100);

      promise = linterRegistry.lint({ editor: editor, onChange: false });
      expect((yield promise)).toBe(true);
      expect(timesBegan).toBe(1);
      expect(timesUpdated).toBe(1);
      expect(timesFinished).toBe(1);

      atom.config.set('linter.disabledProviders', []);
      yield (0, _jasmineFix.wait)(100);

      promise = linterRegistry.lint({ editor: editor, onChange: false });
      expect((yield promise)).toBe(true);
      expect(timesBegan).toBe(2);
      expect(timesUpdated).toBe(2);
      expect(timesFinished).toBe(2);
    }));
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvc3BlYy9saW50ZXItcmVnaXN0cnktc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7MEJBRXFDLGFBQWE7OzBCQUN6QixnQkFBZ0I7O0lBQTdCLE9BQU87O2lDQUNRLHdCQUF3Qjs7OztzQkFDUixVQUFVOztBQUVyRCxRQUFRLENBQUMsZ0JBQWdCLEVBQUUsWUFBVztBQUNwQyxNQUFJLGNBQWMsWUFBQSxDQUFBOztBQUVsQixnREFBVyxhQUFpQjtBQUMxQixRQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUNuQyxRQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFBO0FBQ2hELGtCQUFjLEdBQUcsb0NBQW9CLENBQUE7QUFDckMsVUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFBO0FBQzFELFVBQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUE7R0FDdEMsRUFBQyxDQUFBO0FBQ0YsV0FBUyxDQUFDLFlBQVc7QUFDbkIsa0JBQWMsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUN4QixRQUFJLENBQUMsU0FBUyxDQUFDLGlCQUFpQixFQUFFLENBQUE7R0FDbkMsQ0FBQyxDQUFBOztBQUVGLFVBQVEsQ0FBQyxZQUFZLEVBQUUsWUFBVztBQUNoQyx3QkFBRyxPQUFPLEVBQUUsWUFBVztBQUNyQixVQUFNLE1BQU0sR0FBRyx3QkFBVyxDQUFBO0FBQzFCLFlBQU0sQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO0FBQ3BELG9CQUFjLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBQ2hDLFlBQU0sQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFD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QUFBO0FBQzFELFlBQU0sc0JBQUssR0FBRyxDQUFDLENBQUE7O0FBRWYsYUFBTyxHQUFHLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNLEVBQU4sTUFBTSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFBO0FBQzFELFlBQU0sRUFBQyxNQUFNLE9BQU8sQ0FBQSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQ2hDLFlBQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDMUIsWUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUM1QixZQUFNLENBQUMsYUFBYSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBOztBQUU3QixVQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsRUFBRSxFQUFFLENBQUMsQ0FBQTtBQUMvQyxZQUFNLHNCQUFLLEdBQUcsQ0FBQyxDQUFBOztBQUVmLGFBQU8sR0FBRyxjQUFjLENBQUMsSUFBSSxDQUFDLEVBQUUsTUFBTSxFQUFOLE1BQU0sRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQTtBQUMxRCxZQUFNLEVBQUMsTUFBTSxPQUFPLENBQUEsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtBQUNoQyxZQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQzFCLFlBQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDNUIsWUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtLQUM5QixFQUFDLENBQUE7R0FDSCxDQUFDLENBQUE7Q0FDSCxDQUFDLENBQUEiLCJmaWxlIjoiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9zcGVjL2xpbnRlci1yZWdpc3RyeS1zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IHsgaXQsIHdhaXQsIGJlZm9yZUVhY2ggfSBmcm9tICdqYXNtaW5lLWZpeCdcbmltcG9ydCAqIGFzIEhlbHBlcnMgZnJvbSAnLi4vbGliL2hlbHBlcnMnXG5pbXBvcnQgTGludGVyUmVnaXN0cnkgZnJvbSAnLi4vbGliL2xpbnRlci1yZWdpc3RyeSdcbmltcG9ydCB7IGdldExpbnRlciwgZ2V0Rml4dHVyZXNQYXRoIH0gZnJvbSAnLi9jb21tb24nXG5cbmRlc2NyaWJlKCdMaW50ZXJSZWdpc3RyeScsIGZ1bmN0aW9uKCkge1xuICBsZXQgbGludGVyUmVnaXN0cnlcblxuICBiZWZvcmVFYWNoKGFzeW5jIGZ1bmN0aW9uKCkge1xuICAgIGF0b20ucGFja2FnZXMubG9hZFBhY2thZ2UoJ2xpbnRlcicpXG4gICAgYXRvbS5wYWNrYWdlcy5sb2FkUGFja2FnZSgnbGFuZ3VhZ2UtamF2YXNjcmlwdCcpXG4gICAgbGludGVyUmVnaXN0cnkgPSBuZXcgTGludGVyUmVnaXN0cnkoKVxuICAgIGF3YWl0IGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdsYW5ndWFnZS1qYXZhc2NyaXB0JylcbiAgICBhd2FpdCBhdG9tLndvcmtzcGFjZS5vcGVuKF9fZmlsZW5hbWUpXG4gIH0pXG4gIGFmdGVyRWFjaChmdW5jdGlvbigpIHtcbiAgICBsaW50ZXJSZWdpc3RyeS5kaXNwb3NlKClcbiAgICBhdG9tLndvcmtzcGFjZS5kZXN0cm95QWN0aXZlUGFuZSgpXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ2xpZmUgY3ljbGUnLCBmdW5jdGlvbigpIHtcbiAgICBpdCgnd29ya3MnLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IGxpbnRlciA9IGdldExpbnRlcigpXG4gICAgICBleHBlY3QobGludGVyUmVnaXN0cnkuaGFzTGludGVyKGxpbnRlcikpLnRvQmUoZmFsc2UpXG4gICAgICBsaW50ZXJSZWdpc3RyeS5hZGRMaW50ZXIobGludGVyKVxuICAgICAgZXhwZWN0KGxpbnRlclJlZ2lzdHJ5Lmhhc0xpbnRlcihsaW50ZXIpKS50b0JlKHRydWUpXG4gICAgICBsaW50ZXJSZWdpc3RyeS5kZWxldGVMaW50ZXIobGludGVyKVxuICAgICAgZXhwZWN0KGxpbnRlclJlZ2lzdHJ5Lmhhc0xpbnRlcihsaW50ZXIpKS50b0JlKGZhbHNlKVxuICAgIH0pXG4gICAgaXQoJ3NldHMgcHJvcHMgb24gYWRkJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBsaW50ZXIgPSBnZXRMaW50ZXIoKVxuICAgICAgZXhwZWN0KHR5cGVvZiBsaW50ZXJbSGVscGVycy4kdmVyc2lvbl0pLnRvQmUoJ3VuZGVmaW5lZCcpXG4gICAgICBleHBlY3QodHlwZW9mIGxpbnRlcltIZWxwZXJzLiRyZXF1ZXN0TGF0ZXN0XSkudG9CZSgndW5kZWZpbmVkJylcbiAgICAgIGV4cGVjdCh0eXBlb2YgbGludGVyW0hlbHBlcnMuJHJlcXVlc3RMYXN0UmVjZWl2ZWRdKS50b0JlKCd1bmRlZmluZWQnKVxuICAgICAgbGludGVyUmVnaXN0cnkuYWRkTGludGVyKGxpbnRlcilcbiAgICAgIGV4cGVjdCh0eXBlb2YgbGludGVyW0hlbHBlcnMuJHZlcnNpb25dKS50b0JlKCdudW1iZXInKVxuICAgICAgZXhwZWN0KHR5cGVvZiBsaW50ZXJbSGVscGVycy4kcmVxdWVzdExhdGVzdF0pLnRvQmUoJ251bWJlcicpXG4gICAgICBleHBlY3QodHlwZW9mIGxpbnRlcltIZWxwZXJzLiRyZXF1ZXN0TGFzdFJlY2VpdmVkXSkudG9CZSgnbnVtYmVyJylcbiAgICAgIGV4cGVjdChsaW50ZXJbSGVscGVycy4kdmVyc2lvbl0pLnRvQmUoMilcbiAgICAgIGV4cGVjdChsaW50ZXJbSGVscGVycy4kcmVxdWVzdExhdGVzdF0pLnRvQmUoMClcbiAgICAgIGV4cGVjdChsaW50ZXJbSGVscGVycy4kcmVxdWVzdExhc3RSZWNlaXZlZF0pLnRvQmUoMClcbiAgICB9KVxuICAgIGl0KCdzZXRzIHZlcnNpb24gYmFzZWQgb24gbGVnYWN5IHBhcmFtJywgZnVuY3Rpb24oKSB7XG4gICAgICB7XG4gICAgICAgIC8vIHNjZW5hcmlvOiAyXG4gICAgICAgIGNvbnN0IGxpbnRlciA9IGdldExpbnRlcigpXG4gICAgICAgIGxpbnRlclJlZ2lzdHJ5LmFkZExpbnRlcihsaW50ZXIpXG4gICAgICAgIGV4cGVjdChsaW50ZXJbSGVscGVycy4kdmVyc2lvbl0pLnRvQmUoMilcbiAgICAgIH1cbiAgICAgIHtcbiAgICAgICAgLy8gc2NlbmFyaW86IDFcbiAgICAgICAgY29uc3QgbGludGVyID0gZ2V0TGludGVyKClcbiAgICAgICAgbGludGVyLmxpbnRPbkZseSA9IGxpbnRlci5saW50c09uQ2hhbmdlXG4gICAgICAgIGxpbnRlclJlZ2lzdHJ5LmFkZExpbnRlcihsaW50ZXIsIHRydWUpXG4gICAgICAgIGV4cGVjdChsaW50ZXJbSGVscGVycy4kdmVyc2lvbl0pLnRvQmUoMSlcbiAgICAgIH1cbiAgICB9KVxuICAgIGl0KCdkZWFjdGl2YXRlcyB0aGUgYXR0cmlidXRlcyBvbiBkZWxldGUnLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IGxpbnRlciA9IGdldExpbnRlcigpXG4gICAgICBsaW50ZXJSZWdpc3RyeS5hZGRMaW50ZXIobGludGVyKVxuICAgICAgZXhwZWN0KGxpbnRlcltIZWxwZXJzLiRhY3RpdmF0ZWRdKS50b0JlKHRydWUpXG4gICAgICBsaW50ZXJSZWdpc3RyeS5kZWxldGVMaW50ZXIobGludGVyKVxuICAgICAgZXhwZWN0KGxpbnRlcltIZWxwZXJzLiRhY3RpdmF0ZWRdKS50b0JlKGZhbHNlKVxuICAgIH0pXG4gIH0pXG4gIGRlc2NyaWJlKCc6OmxpbnQnLCBmdW5jdGlvbigpIHtcbiAgICBpdCgnZG9lcyBub3QgbGludCBpZiBlZGl0b3IgaXMgbm90IHNhdmVkIG9uIGRpc2snLCBhc3luYyBmdW5jdGlvbigpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IGF0b20ud29ya3NwYWNlLm9wZW4oKVxuICAgICAgICBjb25zdCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgICAgZXhwZWN0KGF3YWl0IGxpbnRlclJlZ2lzdHJ5LmxpbnQoeyBlZGl0b3IsIG9uQ2hhbmdlOiBmYWxzZSB9KSkudG9CZShmYWxzZSlcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIGF0b20ud29ya3NwYWNlLmRlc3Ryb3lBY3RpdmVQYW5lKClcbiAgICAgIH1cbiAgICB9KVxuICAgIGl0KCdkb2VzIG5vdCBsaW50IGlmIGVkaXRvciBpcyBpZ25vcmVkIGJ5IFZDUycsIGFzeW5jIGZ1bmN0aW9uKCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgYXRvbS53b3Jrc3BhY2Uub3BlbihnZXRGaXh0dXJlc1BhdGgoJ2lnbm9yZWQudHh0JykpXG4gICAgICAgIGNvbnN0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgICAgICBleHBlY3QoYXdhaXQgbGludGVyUmVnaXN0cnkubGludCh7IGVkaXRvciwgb25DaGFuZ2U6IGZhbHNlIH0pKS50b0JlKGZhbHNlKVxuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgYXRvbS53b3Jrc3BhY2UuZGVzdHJveUFjdGl2ZVBhbmUoKVxuICAgICAgfVxuICAgIH0pXG4gICAgaXQoJ2RvZXMgbm90IGxpbnQgb25DaGFuZ2UgaWYgb25DaGFuZ2UgaXMgZGlzYWJsZWQgYnkgY29uZmlnJywgYXN5bmMgZnVuY3Rpb24oKSB7XG4gICAgICB0cnkge1xuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ2xpbnRlci5saW50T25DaGFuZ2UnLCBmYWxzZSlcbiAgICAgICAgYXdhaXQgYXRvbS53b3Jrc3BhY2Uub3BlbihnZXRGaXh0dXJlc1BhdGgoJ2ZpbGUudHh0JykpXG4gICAgICAgIGNvbnN0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgICAgICBleHBlY3QoYXdhaXQgbGludGVyUmVnaXN0cnkubGludCh7IGVkaXRvciwgb25DaGFuZ2U6IHRydWUgfSkpLnRvQmUoZmFsc2UpXG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ2xpbnRlci5saW50T25DaGFuZ2UnLCB0cnVlKVxuICAgICAgICBhdG9tLndvcmtzcGFjZS5kZXN0cm95QWN0aXZlUGFuZSgpXG4gICAgICB9XG4gICAgfSlcbiAgICBpdCgnbGludHMgb25DaGFuZ2UgaWYgYWxsb3dlZCBieSBjb25maWcnLCBhc3luYyBmdW5jdGlvbigpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IGF0b20ud29ya3NwYWNlLm9wZW4oZ2V0Rml4dHVyZXNQYXRoKCdmaWxlLnR4dCcpKVxuICAgICAgICBjb25zdCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgICAgZXhwZWN0KGF3YWl0IGxpbnRlclJlZ2lzdHJ5LmxpbnQoeyBlZGl0b3IsIG9uQ2hhbmdlOiB0cnVlIH0pKS50b0JlKHRydWUpXG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBhdG9tLndvcmtzcGFjZS5kZXN0cm95QWN0aXZlUGFuZSgpXG4gICAgICB9XG4gICAgfSlcbiAgICBpdCgnZG9lcyBub3QgbGludCBwcmV2aWV3IHRhYnMgaWYgZGlzYWxsb3dlZCBieSBjb25maWcnLCBhc3luYyBmdW5jdGlvbigpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGF0b20uY29uZmlnLnNldCgnbGludGVyLmxpbnRQcmV2aWV3VGFicycsIGZhbHNlKVxuICAgICAgICBhd2FpdCBhdG9tLndvcmtzcGFjZS5vcGVuKGdldEZpeHR1cmVzUGF0aCgnZmlsZS50eHQnKSlcbiAgICAgICAgY29uc3QgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICAgIGNvbnN0IGFjdGl2ZVBhbmUgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKClcbiAgICAgICAgc3B5T24oYWN0aXZlUGFuZSwgJ2dldFBlbmRpbmdJdGVtJykuYW5kQ2FsbEZha2UoKCkgPT4gZWRpdG9yKVxuICAgICAgICBleHBlY3QoYXdhaXQgbGludGVyUmVnaXN0cnkubGludCh7IGVkaXRvciwgb25DaGFuZ2U6IGZhbHNlIH0pKS50b0JlKGZhbHNlKVxuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgYXRvbS5jb25maWcuc2V0KCdsaW50ZXIubGludFByZXZpZXdUYWJzJywgdHJ1ZSlcbiAgICAgICAgYXRvbS53b3Jrc3BhY2UuZGVzdHJveUFjdGl2ZVBhbmUoKVxuICAgICAgfVxuICAgIH0pXG4gICAgaXQoJ2RvZXMgbGludCBwcmV2aWV3IHRhYnMgaWYgYWxsb3dlZCBieSBjb25maWcnLCBhc3luYyBmdW5jdGlvbigpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IGF0b20ud29ya3NwYWNlLm9wZW4oZ2V0Rml4dHVyZXNQYXRoKCdmaWxlLnR4dCcpKVxuICAgICAgICBjb25zdCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgICAgZWRpdG9yLmhhc1Rlcm1pbmF0ZWRQZW5kaW5nU3RhdGUgPSBmYWxzZVxuICAgICAgICBleHBlY3QoYXdhaXQgbGludGVyUmVnaXN0cnkubGludCh7IGVkaXRvciwgb25DaGFuZ2U6IGZhbHNlIH0pKS50b0JlKHRydWUpXG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBhdG9tLndvcmtzcGFjZS5kZXN0cm95QWN0aXZlUGFuZSgpXG4gICAgICB9XG4gICAgfSlcbiAgICBpdCgnbGludHMgdGhlIGVkaXRvciBldmVuIGlmIGl0cyBub3QgdGhlIGFjdGl2ZSBvbmUnLCBhc3luYyBmdW5jdGlvbigpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IGF0b20ud29ya3NwYWNlLm9wZW4oZ2V0Rml4dHVyZXNQYXRoKCdmaWxlLnR4dCcpKVxuICAgICAgICBjb25zdCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgICAgYXdhaXQgYXRvbS53b3Jrc3BhY2Uub3BlbihfX2ZpbGVuYW1lKVxuICAgICAgICBleHBlY3QoYXdhaXQgbGludGVyUmVnaXN0cnkubGludCh7IGVkaXRvciwgb25DaGFuZ2U6IGZhbHNlIH0pKS50b0JlKHRydWUpXG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBhdG9tLndvcmtzcGFjZS5kZXN0cm95QWN0aXZlUGFuZSgpXG4gICAgICB9XG4gICAgfSlcbiAgICBpdCgndHJpZ2dlcnMgcHJvdmlkZXJzIGlmIHNjb3BlcyBtYXRjaCcsIGFzeW5jIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbGludGVyID0gZ2V0TGludGVyKClcbiAgICAgIGNvbnN0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgICAgbGludGVyUmVnaXN0cnkuYWRkTGludGVyKGxpbnRlcilcbiAgICAgIHNweU9uKEhlbHBlcnMsICdzaG91bGRUcmlnZ2VyTGludGVyJykuYW5kQ2FsbFRocm91Z2goKVxuICAgICAgc3B5T24obGludGVyLCAnbGludCcpLmFuZENhbGxUaHJvdWdoKClcbiAgICAgIGV4cGVjdChhd2FpdCBsaW50ZXJSZWdpc3RyeS5saW50KHsgZWRpdG9yLCBvbkNoYW5nZTogZmFsc2UgfSkpLnRvQmUodHJ1ZSlcbiAgICAgIGV4cGVjdChIZWxwZXJzLnNob3VsZFRyaWdnZXJMaW50ZXIpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgLy8gJEZsb3dJZ25vcmU6IEl0J3MgYSBtYWdpYyBwcm9wZXJ0eSwgZHVoXG4gICAgICBleHBlY3QoSGVscGVycy5zaG91bGRUcmlnZ2VyTGludGVyLmNhbGxzLmxlbmd0aCkudG9CZSgxKVxuICAgICAgZXhwZWN0KGxpbnRlci5saW50KS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIGV4cGVjdChsaW50ZXIubGludC5jYWxscy5sZW5ndGgpLnRvQmUoMSlcbiAgICB9KVxuICAgIGl0KCdkb2VzIG5vdCBtYXRjaCBpZiBzY29wZXMgZG9udCBtYXRjaCcsIGFzeW5jIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbGludGVyID0gZ2V0TGludGVyKClcbiAgICAgIGNvbnN0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgICAgbGludGVyLmdyYW1tYXJTY29wZXMgPSBbJ3NvdXJjZS5jb2ZmZWUnXVxuICAgICAgbGludGVyUmVnaXN0cnkuYWRkTGludGVyKGxpbnRlcilcbiAgICAgIHNweU9uKEhlbHBlcnMsICdzaG91bGRUcmlnZ2VyTGludGVyJykuYW5kQ2FsbFRocm91Z2goKVxuICAgICAgc3B5T24obGludGVyLCAnbGludCcpLmFuZENhbGxUaHJvdWdoKClcbiAgICAgIGV4cGVjdChhd2FpdCBsaW50ZXJSZWdpc3RyeS5saW50KHsgZWRpdG9yLCBvbkNoYW5nZTogZmFsc2UgfSkpLnRvQmUodHJ1ZSlcbiAgICAgIGV4cGVjdChIZWxwZXJzLnNob3VsZFRyaWdnZXJMaW50ZXIpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgLy8gJEZsb3dJZ25vcmU6IEl0J3MgYSBtYWdpYyBwcm9wZXJ0eSwgZHVoXG4gICAgICBleHBlY3QoSGVscGVycy5zaG91bGRUcmlnZ2VyTGludGVyLmNhbGxzLmxlbmd0aCkudG9CZSgxKVxuICAgICAgZXhwZWN0KGxpbnRlci5saW50KS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICBleHBlY3QobGludGVyLmxpbnQuY2FsbHMubGVuZ3RoKS50b0JlKDApXG4gICAgfSlcbiAgICBpdCgnZW1pdHMgZXZlbnRzIHByb3Blcmx5JywgYXN5bmMgZnVuY3Rpb24oKSB7XG4gICAgICBsZXQgdGltZXNCZWdhbiA9IDBcbiAgICAgIGxldCB0aW1lc1VwZGF0ZWQgPSAwXG4gICAgICBsZXQgdGltZXNGaW5pc2hlZCA9IDBcblxuICAgICAgbGludGVyUmVnaXN0cnkub25EaWRCZWdpbkxpbnRpbmcoZnVuY3Rpb24oKSB7XG4gICAgICAgIHRpbWVzQmVnYW4rK1xuICAgICAgICBleHBlY3QodGltZXNGaW5pc2hlZCkudG9CZSgwKVxuICAgICAgfSlcbiAgICAgIGxpbnRlclJlZ2lzdHJ5Lm9uRGlkRmluaXNoTGludGluZyhmdW5jdGlvbigpIHtcbiAgICAgICAgdGltZXNGaW5pc2hlZCsrXG4gICAgICAgIGV4cGVjdCh0aW1lc1VwZGF0ZWQpLnRvQmUoMClcbiAgICAgIH0pXG4gICAgICBsaW50ZXJSZWdpc3RyeS5vbkRpZFVwZGF0ZU1lc3NhZ2VzKGZ1bmN0aW9uKCkge1xuICAgICAgICB0aW1lc1VwZGF0ZWQrK1xuICAgICAgICBleHBlY3QodGltZXNGaW5pc2hlZCkudG9CZSgxKVxuICAgICAgfSlcblxuICAgICAgY29uc3QgbGludGVyID0gZ2V0TGludGVyKClcbiAgICAgIGNvbnN0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgICAgbGludGVyUmVnaXN0cnkuYWRkTGludGVyKGxpbnRlcilcbiAgICAgIGNvbnN0IHByb21pc2UgPSBsaW50ZXJSZWdpc3RyeS5saW50KHsgZWRpdG9yLCBvbkNoYW5nZTogZmFsc2UgfSlcbiAgICAgIGV4cGVjdChhd2FpdCBwcm9taXNlKS50b0JlKHRydWUpXG4gICAgICBleHBlY3QodGltZXNCZWdhbikudG9CZSgxKVxuICAgICAgZXhwZWN0KHRpbWVzVXBkYXRlZCkudG9CZSgxKVxuICAgICAgZXhwZWN0KHRpbWVzRmluaXNoZWQpLnRvQmUoMSlcbiAgICB9KVxuICAgIGl0KCdkb2VzIG5vdCB1cGRhdGUgaWYgdGhlIGJ1ZmZlciBpdCB3YXMgYXNzb2NpYXRlZCB0byB3YXMgZGVzdHJveWVkJywgYXN5bmMgZnVuY3Rpb24oKSB7XG4gICAgICBsZXQgdGltZXNCZWdhbiA9IDBcbiAgICAgIGxldCB0aW1lc1VwZGF0ZWQgPSAwXG4gICAgICBsZXQgdGltZXNGaW5pc2hlZCA9IDBcblxuICAgICAgbGludGVyUmVnaXN0cnkub25EaWRCZWdpbkxpbnRpbmcoZnVuY3Rpb24oKSB7XG4gICAgICAgIHRpbWVzQmVnYW4rK1xuICAgICAgICBleHBlY3QodGltZXNGaW5pc2hlZCkudG9CZSgwKVxuICAgICAgfSlcbiAgICAgIGxpbnRlclJlZ2lzdHJ5Lm9uRGlkRmluaXNoTGludGluZyhmdW5jdGlvbigpIHtcbiAgICAgICAgdGltZXNGaW5pc2hlZCsrXG4gICAgICAgIGV4cGVjdCh0aW1lc1VwZGF0ZWQpLnRvQmUoMClcbiAgICAgIH0pXG4gICAgICBsaW50ZXJSZWdpc3RyeS5vbkRpZFVwZGF0ZU1lc3NhZ2VzKGZ1bmN0aW9uKCkge1xuICAgICAgICB0aW1lc1VwZGF0ZWQrK1xuICAgICAgICBleHBlY3QodGltZXNGaW5pc2hlZCkudG9CZSgxKVxuICAgICAgfSlcblxuICAgICAgY29uc3QgbGludGVyID0gZ2V0TGludGVyKClcbiAgICAgIGNvbnN0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgICAgbGludGVyLnNjb3BlID0gJ2ZpbGUnXG4gICAgICBsaW50ZXJSZWdpc3RyeS5hZGRMaW50ZXIobGludGVyKVxuICAgICAgZWRpdG9yLmRlc3Ryb3koKVxuICAgICAgY29uc3QgcHJvbWlzZSA9IGxpbnRlclJlZ2lzdHJ5LmxpbnQoeyBlZGl0b3IsIG9uQ2hhbmdlOiBmYWxzZSB9KVxuICAgICAgZXhwZWN0KGF3YWl0IHByb21pc2UpLnRvQmUodHJ1ZSlcbiAgICAgIGV4cGVjdCh0aW1lc0JlZ2FuKS50b0JlKDEpXG4gICAgICBleHBlY3QodGltZXNVcGRhdGVkKS50b0JlKDApXG4gICAgICBleHBlY3QodGltZXNGaW5pc2hlZCkudG9CZSgxKVxuICAgIH0pXG4gICAgaXQoJ2RvZXMgdXBkYXRlIGlmIGJ1ZmZlciB3YXMgZGVzdHJveWVkIGlmIGl0cyBwcm9qZWN0IHNjb3BlZCcsIGFzeW5jIGZ1bmN0aW9uKCkge1xuICAgICAgbGV0IHRpbWVzQmVnYW4gPSAwXG4gICAgICBsZXQgdGltZXNVcGRhdGVkID0gMFxuICAgICAgbGV0IHRpbWVzRmluaXNoZWQgPSAwXG5cbiAgICAgIGxpbnRlclJlZ2lzdHJ5Lm9uRGlkQmVnaW5MaW50aW5nKGZ1bmN0aW9uKCkge1xuICAgICAgICB0aW1lc0JlZ2FuKytcbiAgICAgICAgZXhwZWN0KHRpbWVzRmluaXNoZWQpLnRvQmUoMClcbiAgICAgIH0pXG4gICAgICBsaW50ZXJSZWdpc3RyeS5vbkRpZEZpbmlzaExpbnRpbmcoZnVuY3Rpb24oKSB7XG4gICAgICAgIHRpbWVzRmluaXNoZWQrK1xuICAgICAgICBleHBlY3QodGltZXNVcGRhdGVkKS50b0JlKDApXG4gICAgICB9KVxuICAgICAgbGludGVyUmVnaXN0cnkub25EaWRVcGRhdGVNZXNzYWdlcyhmdW5jdGlvbigpIHtcbiAgICAgICAgdGltZXNVcGRhdGVkKytcbiAgICAgICAgZXhwZWN0KHRpbWVzRmluaXNoZWQpLnRvQmUoMSlcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IGxpbnRlciA9IGdldExpbnRlcigpXG4gICAgICBjb25zdCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgIGxpbnRlclJlZ2lzdHJ5LmFkZExpbnRlcihsaW50ZXIpXG4gICAgICBlZGl0b3IuZGVzdHJveSgpXG4gICAgICBjb25zdCBwcm9taXNlID0gbGludGVyUmVnaXN0cnkubGludCh7IGVkaXRvciwgb25DaGFuZ2U6IGZhbHNlIH0pXG4gICAgICBleHBlY3QoYXdhaXQgcHJvbWlzZSkudG9CZSh0cnVlKVxuICAgICAgZXhwZWN0KHRpbWVzQmVnYW4pLnRvQmUoMSlcbiAgICAgIGV4cGVjdCh0aW1lc1VwZGF0ZWQpLnRvQmUoMSlcbiAgICAgIGV4cGVjdCh0aW1lc0ZpbmlzaGVkKS50b0JlKDEpXG4gICAgfSlcbiAgICBpdCgnZG9lcyBub3QgdXBkYXRlIGlmIG51bGwgaXMgcmV0dXJuZWQnLCBhc3luYyBmdW5jdGlvbigpIHtcbiAgICAgIGxldCBwcm9taXNlXG4gICAgICBsZXQgdGltZXNCZWdhbiA9IDBcbiAgICAgIGxldCB0aW1lc1VwZGF0ZWQgPSAwXG4gICAgICBsZXQgdGltZXNGaW5pc2hlZCA9IDBcblxuICAgICAgbGludGVyUmVnaXN0cnkub25EaWRCZWdpbkxpbnRpbmcoZnVuY3Rpb24oKSB7XG4gICAgICAgIHRpbWVzQmVnYW4rK1xuICAgICAgICBleHBlY3QodGltZXNCZWdhbiAtIDEpLnRvQmUodGltZXNGaW5pc2hlZClcbiAgICAgIH0pXG4gICAgICBsaW50ZXJSZWdpc3RyeS5vbkRpZEZpbmlzaExpbnRpbmcoZnVuY3Rpb24oKSB7XG4gICAgICAgIHRpbWVzRmluaXNoZWQrK1xuICAgICAgICBleHBlY3QodGltZXNGaW5pc2hlZCAtIDEpLnRvQmUodGltZXNVcGRhdGVkKVxuICAgICAgfSlcbiAgICAgIGxpbnRlclJlZ2lzdHJ5Lm9uRGlkVXBkYXRlTWVzc2FnZXMoZnVuY3Rpb24oKSB7XG4gICAgICAgIHRpbWVzVXBkYXRlZCsrXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBsaW50ZXIgPSBnZXRMaW50ZXIoKVxuICAgICAgY29uc3QgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICBsaW50ZXJSZWdpc3RyeS5hZGRMaW50ZXIobGludGVyKVxuICAgICAgbGludGVyLmxpbnQgPSBhc3luYyBmdW5jdGlvbigpIHtcbiAgICAgICAgYXdhaXQgd2FpdCg1MClcbiAgICAgICAgaWYgKHRpbWVzQmVnYW4gPT09IDIpIHtcbiAgICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbXVxuICAgICAgfVxuXG4gICAgICBwcm9taXNlID0gbGludGVyUmVnaXN0cnkubGludCh7IGVkaXRvciwgb25DaGFuZ2U6IGZhbHNlIH0pXG4gICAgICBleHBlY3QoYXdhaXQgcHJvbWlzZSkudG9CZSh0cnVlKVxuICAgICAgZXhwZWN0KHRpbWVzVXBkYXRlZCkudG9CZSgxKVxuICAgICAgZXhwZWN0KHRpbWVzRmluaXNoZWQpLnRvQmUoMSlcbiAgICAgIHByb21pc2UgPSBsaW50ZXJSZWdpc3RyeS5saW50KHsgZWRpdG9yLCBvbkNoYW5nZTogZmFsc2UgfSlcbiAgICAgIGV4cGVjdChhd2FpdCBwcm9taXNlKS50b0JlKHRydWUpXG4gICAgICBleHBlY3QodGltZXNVcGRhdGVkKS50b0JlKDEpXG4gICAgICBleHBlY3QodGltZXNGaW5pc2hlZCkudG9CZSgyKVxuICAgIH0pXG4gICAgaXQoJ3Nob3dzIGVycm9yIG5vdGlmaWNhdGlvbiBpZiByZXNwb25zZSBpcyBub3QgYXJyYXkgYW5kIGlzIG5vbi1udWxsJywgYXN5bmMgZnVuY3Rpb24oKSB7XG4gICAgICBsZXQgcHJvbWlzZVxuICAgICAgbGV0IHRpbWVzQmVnYW4gPSAwXG4gICAgICBsZXQgdGltZXNVcGRhdGVkID0gMFxuICAgICAgbGV0IHRpbWVzRmluaXNoZWQgPSAwXG5cbiAgICAgIGxpbnRlclJlZ2lzdHJ5Lm9uRGlkQmVnaW5MaW50aW5nKGZ1bmN0aW9uKCkge1xuICAgICAgICB0aW1lc0JlZ2FuKytcbiAgICAgICAgZXhwZWN0KHRpbWVzQmVnYW4gLSAxKS50b0JlKHRpbWVzRmluaXNoZWQpXG4gICAgICB9KVxuICAgICAgbGludGVyUmVnaXN0cnkub25EaWRGaW5pc2hMaW50aW5nKGZ1bmN0aW9uKCkge1xuICAgICAgICB0aW1lc0ZpbmlzaGVkKytcbiAgICAgICAgLy8gTk9URTogTm90IGFkZGluZyBhIHRpbWVzVXBkYXRlZCBhc3NlcnRpb24gaGVyZSBvbiBwdXJwb3NlXG4gICAgICAgIC8vIEJlY2F1c2Ugd2UncmUgdGVzdGluZyBpbnZhbGlkIHJldHVybiB2YWx1ZXMgYW5kIHRoZXkgZG9uJ3RcbiAgICAgICAgLy8gdXBkYXRlIGxpbnRlciByZXN1bHRcbiAgICAgIH0pXG4gICAgICBsaW50ZXJSZWdpc3RyeS5vbkRpZFVwZGF0ZU1lc3NhZ2VzKGZ1bmN0aW9uKCkge1xuICAgICAgICB0aW1lc1VwZGF0ZWQrK1xuICAgICAgfSlcblxuICAgICAgY29uc3QgbGludGVyID0gZ2V0TGludGVyKClcbiAgICAgIGNvbnN0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgICAgbGludGVyUmVnaXN0cnkuYWRkTGludGVyKGxpbnRlcilcbiAgICAgIGxpbnRlci5saW50ID0gYXN5bmMgZnVuY3Rpb24oKSB7XG4gICAgICAgIGF3YWl0IHdhaXQoNTApXG4gICAgICAgIGlmICh0aW1lc0JlZ2FuID09PSAyKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgIH0gZWxzZSBpZiAodGltZXNCZWdhbiA9PT0gMykge1xuICAgICAgICAgIHJldHVybiBudWxsXG4gICAgICAgIH0gZWxzZSBpZiAodGltZXNCZWdhbiA9PT0gNCkge1xuICAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW11cbiAgICAgIH1cblxuICAgICAgLy8gd2l0aCBhcnJheVxuICAgICAgcHJvbWlzZSA9IGxpbnRlclJlZ2lzdHJ5LmxpbnQoeyBlZGl0b3IsIG9uQ2hhbmdlOiBmYWxzZSB9KVxuICAgICAgZXhwZWN0KGF3YWl0IHByb21pc2UpLnRvQmUodHJ1ZSlcbiAgICAgIGV4cGVjdCh0aW1lc1VwZGF0ZWQpLnRvQmUoMSlcbiAgICAgIGV4cGVjdCh0aW1lc0ZpbmlzaGVkKS50b0JlKDEpXG4gICAgICBleHBlY3QoYXRvbS5ub3RpZmljYXRpb25zLmdldE5vdGlmaWNhdGlvbnMoKS5sZW5ndGgpLnRvQmUoMClcblxuICAgICAgLy8gd2l0aCBmYWxzZVxuICAgICAgcHJvbWlzZSA9IGxpbnRlclJlZ2lzdHJ5LmxpbnQoeyBlZGl0b3IsIG9uQ2hhbmdlOiBmYWxzZSB9KVxuICAgICAgZXhwZWN0KGF3YWl0IHByb21pc2UpLnRvQmUodHJ1ZSlcbiAgICAgIGV4cGVjdCh0aW1lc1VwZGF0ZWQpLnRvQmUoMSlcbiAgICAgIGV4cGVjdCh0aW1lc0ZpbmlzaGVkKS50b0JlKDIpXG4gICAgICBleHBlY3QoYXRvbS5ub3RpZmljYXRpb25zLmdldE5vdGlmaWNhdGlvbnMoKS5sZW5ndGgpLnRvQmUoMSlcblxuICAgICAgLy8gd2l0aCBudWxsXG4gICAgICBwcm9taXNlID0gbGludGVyUmVnaXN0cnkubGludCh7IGVkaXRvciwgb25DaGFuZ2U6IGZhbHNlIH0pXG4gICAgICBleHBlY3QoYXdhaXQgcHJvbWlzZSkudG9CZSh0cnVlKVxuICAgICAgZXhwZWN0KHRpbWVzVXBkYXRlZCkudG9CZSgxKVxuICAgICAgZXhwZWN0KHRpbWVzRmluaXNoZWQpLnRvQmUoMylcbiAgICAgIGV4cGVjdChhdG9tLm5vdGlmaWNhdGlvbnMuZ2V0Tm90aWZpY2F0aW9ucygpLmxlbmd0aCkudG9CZSgxKVxuXG4gICAgICAvLyB3aXRoIHVuZGVmaW5lZFxuICAgICAgcHJvbWlzZSA9IGxpbnRlclJlZ2lzdHJ5LmxpbnQoeyBlZGl0b3IsIG9uQ2hhbmdlOiBmYWxzZSB9KVxuICAgICAgZXhwZWN0KGF3YWl0IHByb21pc2UpLnRvQmUodHJ1ZSlcbiAgICAgIGV4cGVjdCh0aW1lc1VwZGF0ZWQpLnRvQmUoMSlcbiAgICAgIGV4cGVjdCh0aW1lc0ZpbmlzaGVkKS50b0JlKDQpXG4gICAgICBleHBlY3QoYXRvbS5ub3RpZmljYXRpb25zLmdldE5vdGlmaWNhdGlvbnMoKS5sZW5ndGgpLnRvQmUoMilcbiAgICB9KVxuICAgIGl0KCd0cmlnZ2VycyB0aGUgZmluaXNoIGV2ZW50IGV2ZW4gd2hlbiB0aGUgcHJvdmlkZXIgY3Jhc2hlcycsIGFzeW5jIGZ1bmN0aW9uKCkge1xuICAgICAgbGV0IHRpbWVzQmVnYW4gPSAwXG4gICAgICBsZXQgdGltZXNVcGRhdGVkID0gMFxuICAgICAgbGV0IHRpbWVzRmluaXNoZWQgPSAwXG5cbiAgICAgIGxpbnRlclJlZ2lzdHJ5Lm9uRGlkQmVnaW5MaW50aW5nKGZ1bmN0aW9uKCkge1xuICAgICAgICB0aW1lc0JlZ2FuKytcbiAgICAgICAgZXhwZWN0KHRpbWVzRmluaXNoZWQpLnRvQmUoMClcbiAgICAgIH0pXG4gICAgICBsaW50ZXJSZWdpc3RyeS5vbkRpZEZpbmlzaExpbnRpbmcoZnVuY3Rpb24oKSB7XG4gICAgICAgIHRpbWVzRmluaXNoZWQrK1xuICAgICAgICBleHBlY3QodGltZXNVcGRhdGVkKS50b0JlKDApXG4gICAgICB9KVxuICAgICAgbGludGVyUmVnaXN0cnkub25EaWRVcGRhdGVNZXNzYWdlcyhmdW5jdGlvbigpIHtcbiAgICAgICAgdGltZXNVcGRhdGVkKytcbiAgICAgICAgZXhwZWN0KHRpbWVzRmluaXNoZWQpLnRvQmUoMSlcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IGxpbnRlciA9IGdldExpbnRlcigpXG4gICAgICBjb25zdCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgIGxpbnRlclJlZ2lzdHJ5LmFkZExpbnRlcihsaW50ZXIpXG4gICAgICBsaW50ZXIubGludCA9IGFzeW5jIGZ1bmN0aW9uKCkgeyBhd2FpdCB3YWl0KDUwKTsgdGhyb3cgbmV3IEVycm9yKCdCb29tJykgfVxuICAgICAgY29uc3QgcHJvbWlzZSA9IGxpbnRlclJlZ2lzdHJ5LmxpbnQoeyBlZGl0b3IsIG9uQ2hhbmdlOiBmYWxzZSB9KVxuICAgICAgZXhwZWN0KGF3YWl0IHByb21pc2UpLnRvQmUodHJ1ZSlcbiAgICAgIGV4cGVjdCh0aW1lc0JlZ2FuKS50b0JlKDEpXG4gICAgICBleHBlY3QodGltZXNVcGRhdGVkKS50b0JlKDApXG4gICAgICBleHBlY3QodGltZXNGaW5pc2hlZCkudG9CZSgxKVxuICAgIH0pXG4gICAgaXQoJ2dpdmVzIGJ1ZmZlciBmb3IgZmlsZSBzY29wZWQgbGludGVycyBvbiB1cGRhdGUgZXZlbnQnLCBhc3luYyBmdW5jdGlvbigpIHtcbiAgICAgIGxldCB0aW1lc0JlZ2FuID0gMFxuICAgICAgbGV0IHRpbWVzVXBkYXRlZCA9IDBcbiAgICAgIGxldCB0aW1lc0ZpbmlzaGVkID0gMFxuXG4gICAgICBsaW50ZXJSZWdpc3RyeS5vbkRpZEJlZ2luTGludGluZyhmdW5jdGlvbigpIHtcbiAgICAgICAgdGltZXNCZWdhbisrXG4gICAgICAgIGV4cGVjdCh0aW1lc0ZpbmlzaGVkKS50b0JlKDApXG4gICAgICB9KVxuICAgICAgbGludGVyUmVnaXN0cnkub25EaWRGaW5pc2hMaW50aW5nKGZ1bmN0aW9uKCkge1xuICAgICAgICB0aW1lc0ZpbmlzaGVkKytcbiAgICAgICAgZXhwZWN0KHRpbWVzQmVnYW4pLnRvQmUoMSlcbiAgICAgIH0pXG4gICAgICBsaW50ZXJSZWdpc3RyeS5vbkRpZFVwZGF0ZU1lc3NhZ2VzKGZ1bmN0aW9uKHsgYnVmZmVyIH0pIHtcbiAgICAgICAgdGltZXNVcGRhdGVkKytcbiAgICAgICAgZXhwZWN0KGJ1ZmZlci5jb25zdHJ1Y3Rvci5uYW1lKS50b0JlKCdUZXh0QnVmZmVyJylcbiAgICAgICAgZXhwZWN0KHRpbWVzRmluaXNoZWQpLnRvQmUoMSlcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IGxpbnRlciA9IGdldExpbnRlcigpXG4gICAgICBjb25zdCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgIGxpbnRlci5zY29wZSA9ICdmaWxlJ1xuICAgICAgbGludGVyUmVnaXN0cnkuYWRkTGludGVyKGxpbnRlcilcbiAgICAgIGNvbnN0IHByb21pc2UgPSBsaW50ZXJSZWdpc3RyeS5saW50KHsgZWRpdG9yLCBvbkNoYW5nZTogZmFsc2UgfSlcbiAgICAgIGV4cGVjdChhd2FpdCBwcm9taXNlKS50b0JlKHRydWUpXG4gICAgICBleHBlY3QodGltZXNCZWdhbikudG9CZSgxKVxuICAgICAgZXhwZWN0KHRpbWVzVXBkYXRlZCkudG9CZSgxKVxuICAgICAgZXhwZWN0KHRpbWVzRmluaXNoZWQpLnRvQmUoMSlcbiAgICB9KVxuICAgIGl0KCdkb2VzIG5vdCBnaXZlIGEgYnVmZmVyIGZvciBwcm9qZWN0IHNjb3BlZCBsaW50ZXJzIG9uIHVwZGF0ZSBldmVudCcsIGFzeW5jIGZ1bmN0aW9uKCkge1xuICAgICAgbGV0IHRpbWVzQmVnYW4gPSAwXG4gICAgICBsZXQgdGltZXNVcGRhdGVkID0gMFxuICAgICAgbGV0IHRpbWVzRmluaXNoZWQgPSAwXG5cbiAgICAgIGxpbnRlclJlZ2lzdHJ5Lm9uRGlkQmVnaW5MaW50aW5nKGZ1bmN0aW9uKCkge1xuICAgICAgICB0aW1lc0JlZ2FuKytcbiAgICAgICAgZXhwZWN0KHRpbWVzRmluaXNoZWQpLnRvQmUoMClcbiAgICAgIH0pXG4gICAgICBsaW50ZXJSZWdpc3RyeS5vbkRpZEZpbmlzaExpbnRpbmcoZnVuY3Rpb24oKSB7XG4gICAgICAgIHRpbWVzRmluaXNoZWQrK1xuICAgICAgICBleHBlY3QodGltZXNCZWdhbikudG9CZSgxKVxuICAgICAgfSlcbiAgICAgIGxpbnRlclJlZ2lzdHJ5Lm9uRGlkVXBkYXRlTWVzc2FnZXMoZnVuY3Rpb24oeyBidWZmZXIgfSkge1xuICAgICAgICB0aW1lc1VwZGF0ZWQrK1xuICAgICAgICBleHBlY3QoYnVmZmVyKS50b0JlKG51bGwpXG4gICAgICAgIGV4cGVjdCh0aW1lc0ZpbmlzaGVkKS50b0JlKDEpXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBsaW50ZXIgPSBnZXRMaW50ZXIoKVxuICAgICAgY29uc3QgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICBsaW50ZXJSZWdpc3RyeS5hZGRMaW50ZXIobGludGVyKVxuICAgICAgY29uc3QgcHJvbWlzZSA9IGxpbnRlclJlZ2lzdHJ5LmxpbnQoeyBlZGl0b3IsIG9uQ2hhbmdlOiBmYWxzZSB9KVxuICAgICAgZXhwZWN0KGF3YWl0IHByb21pc2UpLnRvQmUodHJ1ZSlcbiAgICAgIGV4cGVjdCh0aW1lc0JlZ2FuKS50b0JlKDEpXG4gICAgICBleHBlY3QodGltZXNVcGRhdGVkKS50b0JlKDEpXG4gICAgICBleHBlY3QodGltZXNGaW5pc2hlZCkudG9CZSgxKVxuICAgIH0pXG4gICAgaXQoJ2dpdmVzIGEgZmlsZXBhdGggZm9yIGZpbGUgc2NvcGVkIGxpbnRlcnMgb24gc3RhcnQgYW5kIGZpbmlzaCBldmVudHMnLCBhc3luYyBmdW5jdGlvbigpIHtcbiAgICAgIGxldCB0aW1lc0JlZ2FuID0gMFxuICAgICAgbGV0IHRpbWVzVXBkYXRlZCA9IDBcbiAgICAgIGxldCB0aW1lc0ZpbmlzaGVkID0gMFxuXG4gICAgICBsaW50ZXJSZWdpc3RyeS5vbkRpZEJlZ2luTGludGluZyhmdW5jdGlvbih7IGZpbGVQYXRoIH0pIHtcbiAgICAgICAgdGltZXNCZWdhbisrXG4gICAgICAgIGV4cGVjdCh0aW1lc0ZpbmlzaGVkKS50b0JlKDApXG4gICAgICAgIGV4cGVjdChmaWxlUGF0aCkudG9CZShfX2ZpbGVuYW1lKVxuICAgICAgfSlcbiAgICAgIGxpbnRlclJlZ2lzdHJ5Lm9uRGlkRmluaXNoTGludGluZyhmdW5jdGlvbih7IGZpbGVQYXRoIH0pIHtcbiAgICAgICAgdGltZXNGaW5pc2hlZCsrXG4gICAgICAgIGV4cGVjdCh0aW1lc0JlZ2FuKS50b0JlKDEpXG4gICAgICAgIGV4cGVjdChmaWxlUGF0aCkudG9CZShfX2ZpbGVuYW1lKVxuICAgICAgfSlcbiAgICAgIGxpbnRlclJlZ2lzdHJ5Lm9uRGlkVXBkYXRlTWVzc2FnZXMoZnVuY3Rpb24oKSB7XG4gICAgICAgIHRpbWVzVXBkYXRlZCsrXG4gICAgICAgIGV4cGVjdCh0aW1lc0ZpbmlzaGVkKS50b0JlKDEpXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBsaW50ZXIgPSBnZXRMaW50ZXIoKVxuICAgICAgY29uc3QgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICBsaW50ZXIuc2NvcGUgPSAnZmlsZSdcbiAgICAgIGxpbnRlclJlZ2lzdHJ5LmFkZExpbnRlcihsaW50ZXIpXG4gICAgICBjb25zdCBwcm9taXNlID0gbGludGVyUmVnaXN0cnkubGludCh7IGVkaXRvciwgb25DaGFuZ2U6IGZhbHNlIH0pXG4gICAgICBleHBlY3QoYXdhaXQgcHJvbWlzZSkudG9CZSh0cnVlKVxuICAgICAgZXhwZWN0KHRpbWVzQmVnYW4pLnRvQmUoMSlcbiAgICAgIGV4cGVjdCh0aW1lc1VwZGF0ZWQpLnRvQmUoMSlcbiAgICAgIGV4cGVjdCh0aW1lc0ZpbmlzaGVkKS50b0JlKDEpXG4gICAgfSlcbiAgICBpdCgnZG9lcyBub3QgZ2l2ZSBhIGZpbGUgcGF0aCBmb3IgcHJvamVjdCBzY29wZWQgbGludGVycyBvbiBzdGFydCBhbmQgZmluaXNoIGV2ZW50cycsIGFzeW5jIGZ1bmN0aW9uKCkge1xuICAgICAgbGV0IHRpbWVzQmVnYW4gPSAwXG4gICAgICBsZXQgdGltZXNVcGRhdGVkID0gMFxuICAgICAgbGV0IHRpbWVzRmluaXNoZWQgPSAwXG5cbiAgICAgIGxpbnRlclJlZ2lzdHJ5Lm9uRGlkQmVnaW5MaW50aW5nKGZ1bmN0aW9uKHsgZmlsZVBhdGggfSkge1xuICAgICAgICB0aW1lc0JlZ2FuKytcbiAgICAgICAgZXhwZWN0KHRpbWVzRmluaXNoZWQpLnRvQmUoMClcbiAgICAgICAgZXhwZWN0KGZpbGVQYXRoKS50b0JlKG51bGwpXG4gICAgICB9KVxuICAgICAgbGludGVyUmVnaXN0cnkub25EaWRGaW5pc2hMaW50aW5nKGZ1bmN0aW9uKHsgZmlsZVBhdGggfSkge1xuICAgICAgICB0aW1lc0ZpbmlzaGVkKytcbiAgICAgICAgZXhwZWN0KHRpbWVzQmVnYW4pLnRvQmUoMSlcbiAgICAgICAgZXhwZWN0KGZpbGVQYXRoKS50b0JlKG51bGwpXG4gICAgICB9KVxuICAgICAgbGludGVyUmVnaXN0cnkub25EaWRVcGRhdGVNZXNzYWdlcyhmdW5jdGlvbigpIHtcbiAgICAgICAgdGltZXNVcGRhdGVkKytcbiAgICAgICAgZXhwZWN0KHRpbWVzRmluaXNoZWQpLnRvQmUoMSlcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IGxpbnRlciA9IGdldExpbnRlcigpXG4gICAgICBjb25zdCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgIGxpbnRlclJlZ2lzdHJ5LmFkZExpbnRlcihsaW50ZXIpXG4gICAgICBjb25zdCBwcm9taXNlID0gbGludGVyUmVnaXN0cnkubGludCh7IGVkaXRvciwgb25DaGFuZ2U6IGZhbHNlIH0pXG4gICAgICBleHBlY3QoYXdhaXQgcHJvbWlzZSkudG9CZSh0cnVlKVxuICAgICAgZXhwZWN0KHRpbWVzQmVnYW4pLnRvQmUoMSlcbiAgICAgIGV4cGVjdCh0aW1lc1VwZGF0ZWQpLnRvQmUoMSlcbiAgICAgIGV4cGVjdCh0aW1lc0ZpbmlzaGVkKS50b0JlKDEpXG4gICAgfSlcbiAgICBpdChcImRvZXMgbm90IGludm9rZSBhIGxpbnRlciBpZiBpdCdzIGlnbm9yZWRcIiwgYXN5bmMgZnVuY3Rpb24oKSB7XG4gICAgICBsZXQgcHJvbWlzZVxuICAgICAgbGV0IHRpbWVzQmVnYW4gPSAwXG4gICAgICBsZXQgdGltZXNVcGRhdGVkID0gMFxuICAgICAgbGV0IHRpbWVzRmluaXNoZWQgPSAwXG5cbiAgICAgIGxpbnRlclJlZ2lzdHJ5Lm9uRGlkQmVnaW5MaW50aW5nKCgpID0+IHRpbWVzQmVnYW4rKylcbiAgICAgIGxpbnRlclJlZ2lzdHJ5Lm9uRGlkRmluaXNoTGludGluZygoKSA9PiB0aW1lc0ZpbmlzaGVkKyspXG4gICAgICBsaW50ZXJSZWdpc3RyeS5vbkRpZFVwZGF0ZU1lc3NhZ2VzKCgpID0+IHRpbWVzVXBkYXRlZCsrKVxuXG4gICAgICBjb25zdCBsaW50ZXIgPSBnZXRMaW50ZXIoKVxuICAgICAgYXRvbS5jb25maWcuc2V0KCdsaW50ZXIuZGlzYWJsZWRQcm92aWRlcnMnLCBbXSlcbiAgICAgIGNvbnN0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgICAgbGludGVyLm5hbWUgPSAnU29tZSBMaW50ZXInXG4gICAgICBsaW50ZXJSZWdpc3RyeS5hZGRMaW50ZXIobGludGVyKVxuXG4gICAgICBwcm9taXNlID0gbGludGVyUmVnaXN0cnkubGludCh7IGVkaXRvciwgb25DaGFuZ2U6IGZhbHNlIH0pXG4gICAgICBleHBlY3QoYXdhaXQgcHJvbWlzZSkudG9CZSh0cnVlKVxuICAgICAgZXhwZWN0KHRpbWVzQmVnYW4pLnRvQmUoMSlcbiAgICAgIGV4cGVjdCh0aW1lc0JlZ2FuKS50b0JlKDEpXG4gICAgICBleHBlY3QodGltZXNVcGRhdGVkKS50b0JlKDEpXG4gICAgICBleHBlY3QodGltZXNGaW5pc2hlZCkudG9CZSgxKVxuXG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ2xpbnRlci5kaXNhYmxlZFByb3ZpZGVycycsIFtsaW50ZXIubmFtZV0pXG4gICAgICBhd2FpdCB3YWl0KDEwMClcblxuICAgICAgcHJvbWlzZSA9IGxpbnRlclJlZ2lzdHJ5LmxpbnQoeyBlZGl0b3IsIG9uQ2hhbmdlOiBmYWxzZSB9KVxuICAgICAgZXhwZWN0KGF3YWl0IHByb21pc2UpLnRvQmUodHJ1ZSlcbiAgICAgIGV4cGVjdCh0aW1lc0JlZ2FuKS50b0JlKDEpXG4gICAgICBleHBlY3QodGltZXNVcGRhdGVkKS50b0JlKDEpXG4gICAgICBleHBlY3QodGltZXNGaW5pc2hlZCkudG9CZSgxKVxuXG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ2xpbnRlci5kaXNhYmxlZFByb3ZpZGVycycsIFtdKVxuICAgICAgYXdhaXQgd2FpdCgxMDApXG5cbiAgICAgIHByb21pc2UgPSBsaW50ZXJSZWdpc3RyeS5saW50KHsgZWRpdG9yLCBvbkNoYW5nZTogZmFsc2UgfSlcbiAgICAgIGV4cGVjdChhd2FpdCBwcm9taXNlKS50b0JlKHRydWUpXG4gICAgICBleHBlY3QodGltZXNCZWdhbikudG9CZSgyKVxuICAgICAgZXhwZWN0KHRpbWVzVXBkYXRlZCkudG9CZSgyKVxuICAgICAgZXhwZWN0KHRpbWVzRmluaXNoZWQpLnRvQmUoMilcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==