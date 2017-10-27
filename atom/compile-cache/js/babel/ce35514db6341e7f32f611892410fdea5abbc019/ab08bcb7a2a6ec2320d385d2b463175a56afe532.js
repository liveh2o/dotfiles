function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var _atom = require('atom');

var _jasmineFix = require('jasmine-fix');

var _libHelpers = require('../lib/helpers');

var Helpers = _interopRequireWildcard(_libHelpers);

var _common = require('./common');

describe('Helpers', function () {
  // NOTE: Did *not* add specs for messageKey and messageKeyLegacy on purpose
  describe('shouldTriggerLinter', function () {
    function shouldTriggerLinter(a, b, c) {
      return Helpers.shouldTriggerLinter(a, b, c);
    }

    (0, _jasmineFix.it)('works does not trigger non-fly ones on fly', function () {
      expect(shouldTriggerLinter({
        lintOnFly: false,
        grammarScopes: ['source.js']
      }, true, ['source.js'])).toBe(false);
    });
    (0, _jasmineFix.it)('triggers on fly ones on fly', function () {
      expect(shouldTriggerLinter({
        lintOnFly: true,
        grammarScopes: ['source.js', 'source.coffee']
      }, true, ['source.js', 'source.js.emebdded'])).toBe(true);
    });
    (0, _jasmineFix.it)('triggers all on non-fly', function () {
      expect(shouldTriggerLinter({
        lintOnFly: false,
        grammarScopes: ['source.js']
      }, false, ['source.js'])).toBe(true);
      expect(shouldTriggerLinter({
        lintOnFly: true,
        grammarScopes: ['source.js']
      }, false, ['source.js'])).toBe(true);
    });
    (0, _jasmineFix.it)('does not trigger if grammarScopes does not match', function () {
      expect(shouldTriggerLinter({
        lintOnFly: true,
        grammarScopes: ['source.coffee']
      }, true, ['source.js'])).toBe(false);
      expect(shouldTriggerLinter({
        lintOnFly: true,
        grammarScopes: ['source.coffee', 'source.go']
      }, false, ['source.js'])).toBe(false);
      expect(shouldTriggerLinter({
        lintOnFly: false,
        grammarScopes: ['source.coffee', 'source.rust']
      }, false, ['source.js', 'source.hell'])).toBe(false);
    });
  });
  describe('isPathIgnored', function () {
    function isPathIgnored(a, b, c) {
      return Helpers.isPathIgnored(a, b || '**/*.min.{js,css}', c || false);
    }

    (0, _jasmineFix.it)('returns false if path does not match glob', function () {
      expect(isPathIgnored('a.js')).toBe(false);
      expect(isPathIgnored('a.css')).toBe(false);
      expect(isPathIgnored('/a.js')).toBe(false);
      expect(isPathIgnored('/a.css')).toBe(false);
    });
    (0, _jasmineFix.it)('returns false correctly for windows styled paths', function () {
      expect(isPathIgnored('a.js')).toBe(false);
      expect(isPathIgnored('a.css')).toBe(false);
      expect(isPathIgnored('\\a.js')).toBe(false);
      expect(isPathIgnored('\\a.css')).toBe(false);
    });
    (0, _jasmineFix.it)('returns true if path matches glob', function () {
      expect(isPathIgnored('a.min.js')).toBe(true);
      expect(isPathIgnored('a.min.css')).toBe(true);
      expect(isPathIgnored('/a.min.js')).toBe(true);
      expect(isPathIgnored('/a.min.css')).toBe(true);
    });
    (0, _jasmineFix.it)('returns true correctly for windows styled paths', function () {
      expect(isPathIgnored('a.min.js')).toBe(true);
      expect(isPathIgnored('a.min.css')).toBe(true);
      expect(isPathIgnored('\\a.min.js')).toBe(true);
      expect(isPathIgnored('\\a.min.css')).toBe(true);
    });
    (0, _jasmineFix.it)('returns true if the path is ignored by VCS', _asyncToGenerator(function* () {
      try {
        yield atom.workspace.open(__filename);
        expect(isPathIgnored((0, _common.getFixturesPath)('ignored.txt'), null, true)).toBe(true);
      } finally {
        atom.workspace.destroyActivePane();
      }
    }));
    (0, _jasmineFix.it)('returns false if the path is not ignored by VCS', _asyncToGenerator(function* () {
      try {
        yield atom.workspace.open(__filename);
        expect(isPathIgnored((0, _common.getFixturesPath)('file.txt'), null, true)).toBe(false);
      } finally {
        atom.workspace.destroyActivePane();
      }
    }));
  });
  describe('subscriptiveObserve', function () {
    (0, _jasmineFix.it)('activates synchronously', function () {
      var activated = false;
      Helpers.subscriptiveObserve({
        observe: function observe(eventName, callback) {
          activated = true;
          expect(eventName).toBe('someEvent');
          expect(typeof callback).toBe('function');
        }
      }, 'someEvent', function () {});
      expect(activated).toBe(true);
    });
    (0, _jasmineFix.it)('clears last subscription when value changes', function () {
      var disposed = 0;
      var activated = false;
      Helpers.subscriptiveObserve({
        observe: function observe(eventName, callback) {
          activated = true;
          expect(disposed).toBe(0);
          callback();
          expect(disposed).toBe(0);
          callback();
          expect(disposed).toBe(1);
          callback();
          expect(disposed).toBe(2);
        }
      }, 'someEvent', function () {
        return new _atom.Disposable(function () {
          disposed++;
        });
      });
      expect(activated).toBe(true);
    });
    (0, _jasmineFix.it)('clears both subscriptions at the end', function () {
      var disposed = 0;
      var observeDisposed = 0;
      var activated = false;
      var subscription = Helpers.subscriptiveObserve({
        observe: function observe(eventName, callback) {
          activated = true;
          expect(disposed).toBe(0);
          callback();
          expect(disposed).toBe(0);
          return new _atom.Disposable(function () {
            observeDisposed++;
          });
        }
      }, 'someEvent', function () {
        return new _atom.Disposable(function () {
          disposed++;
        });
      });
      expect(activated).toBe(true);
      subscription.dispose();
      expect(disposed).toBe(1);
      expect(observeDisposed).toBe(1);
    });
  });
  describe('normalizeMessages', function () {
    (0, _jasmineFix.it)('adds a key to the message', function () {
      var message = (0, _common.getMessage)(false);
      expect(typeof message.key).toBe('undefined');
      Helpers.normalizeMessages('Some Linter', [message]);
      expect(typeof message.key).toBe('string');
    });
    (0, _jasmineFix.it)('adds a version to the message', function () {
      var message = (0, _common.getMessage)(false);
      expect(typeof message.version).toBe('undefined');
      Helpers.normalizeMessages('Some Linter', [message]);
      expect(typeof message.version).toBe('number');
      expect(message.version).toBe(2);
    });
    (0, _jasmineFix.it)('adds a name to the message', function () {
      var message = (0, _common.getMessage)(false);
      expect(typeof message.linterName).toBe('undefined');
      Helpers.normalizeMessages('Some Linter', [message]);
      expect(typeof message.linterName).toBe('string');
      expect(message.linterName).toBe('Some Linter');
    });
    (0, _jasmineFix.it)('preserves linterName if provided', function () {
      var message = (0, _common.getMessage)(false);
      message.linterName = 'Some Linter 2';
      Helpers.normalizeMessages('Some Linter', [message]);
      expect(typeof message.linterName).toBe('string');
      expect(message.linterName).toBe('Some Linter 2');
    });
    (0, _jasmineFix.it)('converts arrays in location->position to ranges', function () {
      var message = (0, _common.getMessage)(false);
      message.location.position = [[0, 0], [0, 0]];
      expect(Array.isArray(message.location.position)).toBe(true);
      Helpers.normalizeMessages('Some Linter', [message]);
      expect(Array.isArray(message.location.position)).toBe(false);
      expect(message.location.position.constructor.name).toBe('Range');
    });
    (0, _jasmineFix.it)('converts arrays in source->position to points', function () {
      var message = (0, _common.getMessage)(false);
      message.reference = { file: __dirname, position: [0, 0] };
      expect(Array.isArray(message.reference.position)).toBe(true);
      Helpers.normalizeMessages('Some Linter', [message]);
      expect(Array.isArray(message.reference.position)).toBe(false);
      expect(message.reference.position.constructor.name).toBe('Point');
    });
    (0, _jasmineFix.it)('converts arrays in solution[index]->position to ranges', function () {
      var message = (0, _common.getMessage)(false);
      message.solutions = [{ position: [[0, 0], [0, 0]], apply: function apply() {} }];
      expect(Array.isArray(message.solutions[0].position)).toBe(true);
      Helpers.normalizeMessages('Some Linter', [message]);
      expect(Array.isArray(message.solutions[0].position)).toBe(false);
      expect(message.solutions[0].position.constructor.name).toBe('Range');
    });
  });
  describe('normalizeMessagesLegacy', function () {
    (0, _jasmineFix.it)('adds a key to the message', function () {
      var message = (0, _common.getMessageLegacy)(false);
      expect(typeof message.key).toBe('undefined');
      Helpers.normalizeMessagesLegacy('Some Linter', [message]);
      expect(typeof message.key).toBe('string');
    });
    (0, _jasmineFix.it)('adds a version to the message', function () {
      var message = (0, _common.getMessageLegacy)(false);
      expect(typeof message.version).toBe('undefined');
      Helpers.normalizeMessagesLegacy('Some Linter', [message]);
      expect(typeof message.version).toBe('number');
      expect(message.version).toBe(1);
    });
    (0, _jasmineFix.it)('adds a linterName to the message', function () {
      var message = (0, _common.getMessageLegacy)(false);
      expect(typeof message.linterName).toBe('undefined');
      Helpers.normalizeMessagesLegacy('Some Linter', [message]);
      expect(typeof message.linterName).toBe('string');
      expect(message.linterName).toBe('Some Linter');
    });
    describe('adds a severity to the message', function () {
      (0, _jasmineFix.it)('adds info correctly', function () {
        var message = (0, _common.getMessageLegacy)(false);
        message.type = 'Info';
        expect(typeof message.severity).toBe('undefined');
        Helpers.normalizeMessagesLegacy('Some Linter', [message]);
        expect(typeof message.severity).toBe('string');
        expect(message.severity).toBe('info');
      });
      (0, _jasmineFix.it)('adds info and is not case sensitive', function () {
        var message = (0, _common.getMessageLegacy)(false);
        message.type = 'info';
        expect(typeof message.severity).toBe('undefined');
        Helpers.normalizeMessagesLegacy('Some Linter', [message]);
        expect(typeof message.severity).toBe('string');
        expect(message.severity).toBe('info');
      });
      (0, _jasmineFix.it)('adds warning correctly', function () {
        var message = (0, _common.getMessageLegacy)(false);
        message.type = 'Warning';
        expect(typeof message.severity).toBe('undefined');
        Helpers.normalizeMessagesLegacy('Some Linter', [message]);
        expect(typeof message.severity).toBe('string');
        expect(message.severity).toBe('warning');
      });
      (0, _jasmineFix.it)('adds warning and is not case sensitive', function () {
        var message = (0, _common.getMessageLegacy)(false);
        message.type = 'warning';
        expect(typeof message.severity).toBe('undefined');
        Helpers.normalizeMessagesLegacy('Some Linter', [message]);
        expect(typeof message.severity).toBe('string');
        expect(message.severity).toBe('warning');
      });
      (0, _jasmineFix.it)('adds info to traces', function () {
        var message = (0, _common.getMessageLegacy)(false);
        message.type = 'Trace';
        expect(typeof message.severity).toBe('undefined');
        Helpers.normalizeMessagesLegacy('Some Linter', [message]);
        expect(typeof message.severity).toBe('string');
        expect(message.severity).toBe('info');
      });
      (0, _jasmineFix.it)('adds error for anything else', function () {
        {
          var message = (0, _common.getMessageLegacy)(false);
          message.type = 'asdasd';
          expect(typeof message.severity).toBe('undefined');
          Helpers.normalizeMessagesLegacy('Some Linter', [message]);
          expect(typeof message.severity).toBe('string');
          expect(message.severity).toBe('error');
        }
        {
          var message = (0, _common.getMessageLegacy)(false);
          message.type = 'AsdSDasdasd';
          expect(typeof message.severity).toBe('undefined');
          Helpers.normalizeMessagesLegacy('Some Linter', [message]);
          expect(typeof message.severity).toBe('string');
          expect(message.severity).toBe('error');
        }
      });
    });
    (0, _jasmineFix.it)('converts arrays in range to Range', function () {
      var message = (0, _common.getMessageLegacy)(false);
      message.range = [[0, 0], [0, 0]];
      expect(Array.isArray(message.range)).toBe(true);
      Helpers.normalizeMessagesLegacy('Some Linter', [message]);
      expect(Array.isArray(message.range)).toBe(false);
      expect(message.range.constructor.name).toBe('Range');
    });
    (0, _jasmineFix.it)('converts arrays in fix->range to Range', function () {
      var message = (0, _common.getMessageLegacy)(false);
      message.fix = { range: [[0, 0], [0, 0]], newText: 'fair' };
      expect(Array.isArray(message.fix.range)).toBe(true);
      Helpers.normalizeMessagesLegacy('Some Linter', [message]);
      expect(Array.isArray(message.fix.range)).toBe(false);
      expect(message.fix.range.constructor.name).toBe('Range');
    });
    (0, _jasmineFix.it)('processes traces on messages', function () {
      var message = (0, _common.getMessageLegacy)(false);
      message.type = 'asdasd';
      var trace = (0, _common.getMessageLegacy)(false);
      trace.type = 'Trace';
      message.trace = [trace];
      expect(typeof trace.severity).toBe('undefined');
      Helpers.normalizeMessagesLegacy('Some Linter', [message]);
      expect(typeof trace.severity).toBe('string');
      expect(trace.severity).toBe('info');
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvc3BlYy9oZWxwZXJzLXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztvQkFFMkIsTUFBTTs7MEJBQ2QsYUFBYTs7MEJBQ1AsZ0JBQWdCOztJQUE3QixPQUFPOztzQkFDMkMsVUFBVTs7QUFFeEUsUUFBUSxDQUFDLFNBQVMsRUFBRSxZQUFXOztBQUU3QixVQUFRLENBQUMscUJBQXFCLEVBQUUsWUFBVztBQUN6QyxhQUFTLG1CQUFtQixDQUFDLENBQU0sRUFBRSxDQUFNLEVBQUUsQ0FBTSxFQUFFO0FBQ25ELGFBQU8sT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7S0FDNUM7O0FBRUQsd0JBQUcsNENBQTRDLEVBQUUsWUFBVztBQUMxRCxZQUFNLENBQUMsbUJBQW1CLENBQUM7QUFDekIsaUJBQVMsRUFBRSxLQUFLO0FBQ2hCLHFCQUFhLEVBQUUsQ0FBQyxXQUFXLENBQUM7T0FDN0IsRUFBRSxJQUFJLEVBQUUsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO0tBQ3JDLENBQUMsQ0FBQTtBQUNGLHdCQUFHLDZCQUE2QixFQUFFLFlBQVc7QUFDM0MsWUFBTSxDQUFDLG1CQUFtQixDQUFDO0FBQ3pCLGlCQUFTLEVBQUUsSUFBSTtBQUNmLHFCQUFhLEVBQUUsQ0FBQyxXQUFXLEVBQUUsZUFBZSxDQUFDO09BQzlDLEVBQUUsSUFBSSxFQUFFLENBQUMsV0FBVyxFQUFFLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtLQUMxRCxDQUFDLENBQUE7QUFDRix3QkFBRyx5QkFBeUIsRUFBRSxZQUFXO0FBQ3ZDLFlBQU0sQ0FBQyxtQkFBbUIsQ0FBQztBQUN6QixpQkFBUyxFQUFFLEtBQUs7QUFDaEIscUJBQWEsRUFBRSxDQUFDLFdBQVcsQ0FBQztP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Q0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtBQUNwRCxZQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtLQUN6RCxDQUFDLENBQUE7QUFDRix3QkFBRyw4QkFBOEIsRUFBRSxZQUFXO0FBQzVDLFVBQU0sT0FBTyxHQUFHLDhCQUFpQixLQUFLLENBQUMsQ0FBQTtBQUN2QyxhQUFPLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQTtBQUN2QixVQUFNLEtBQUssR0FBRyw4QkFBaUIsS0FBSyxDQUFDLENBQUE7QUFDckMsV0FBSyxDQUFDLElBQUksR0FBRyxPQUFPLENBQUE7QUFDcEIsYUFBTyxDQUFDLEtBQUssR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFBO0FBQ3ZCLFlBQU0sQ0FBQyxPQUFPLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUE7QUFDL0MsYUFBTyxDQUFDLHVCQUF1QixDQUFDLGFBQWEsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUE7QUFDekQsWUFBTSxDQUFDLE9BQU8sS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUM1QyxZQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQTtLQUNwQyxDQUFDLENBQUE7R0FDSCxDQUFDLENBQUE7Q0FDSCxDQUFDLENBQUEiLCJmaWxlIjoiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9zcGVjL2hlbHBlcnMtc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCB7IERpc3Bvc2FibGUgfSBmcm9tICdhdG9tJ1xuaW1wb3J0IHsgaXQgfSBmcm9tICdqYXNtaW5lLWZpeCdcbmltcG9ydCAqIGFzIEhlbHBlcnMgZnJvbSAnLi4vbGliL2hlbHBlcnMnXG5pbXBvcnQgeyBnZXRGaXh0dXJlc1BhdGgsIGdldE1lc3NhZ2UsIGdldE1lc3NhZ2VMZWdhY3kgfSBmcm9tICcuL2NvbW1vbidcblxuZGVzY3JpYmUoJ0hlbHBlcnMnLCBmdW5jdGlvbigpIHtcbiAgLy8gTk9URTogRGlkICpub3QqIGFkZCBzcGVjcyBmb3IgbWVzc2FnZUtleSBhbmQgbWVzc2FnZUtleUxlZ2FjeSBvbiBwdXJwb3NlXG4gIGRlc2NyaWJlKCdzaG91bGRUcmlnZ2VyTGludGVyJywgZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gc2hvdWxkVHJpZ2dlckxpbnRlcihhOiBhbnksIGI6IGFueSwgYzogYW55KSB7XG4gICAgICByZXR1cm4gSGVscGVycy5zaG91bGRUcmlnZ2VyTGludGVyKGEsIGIsIGMpXG4gICAgfVxuXG4gICAgaXQoJ3dvcmtzIGRvZXMgbm90IHRyaWdnZXIgbm9uLWZseSBvbmVzIG9uIGZseScsIGZ1bmN0aW9uKCkge1xuICAgICAgZXhwZWN0KHNob3VsZFRyaWdnZXJMaW50ZXIoe1xuICAgICAgICBsaW50T25GbHk6IGZhbHNlLFxuICAgICAgICBncmFtbWFyU2NvcGVzOiBbJ3NvdXJjZS5qcyddLFxuICAgICAgfSwgdHJ1ZSwgWydzb3VyY2UuanMnXSkpLnRvQmUoZmFsc2UpXG4gICAgfSlcbiAgICBpdCgndHJpZ2dlcnMgb24gZmx5IG9uZXMgb24gZmx5JywgZnVuY3Rpb24oKSB7XG4gICAgICBleHBlY3Qoc2hvdWxkVHJpZ2dlckxpbnRlcih7XG4gICAgICAgIGxpbnRPbkZseTogdHJ1ZSxcbiAgICAgICAgZ3JhbW1hclNjb3BlczogWydzb3VyY2UuanMnLCAnc291cmNlLmNvZmZlZSddLFxuICAgICAgfSwgdHJ1ZSwgWydzb3VyY2UuanMnLCAnc291cmNlLmpzLmVtZWJkZGVkJ10pKS50b0JlKHRydWUpXG4gICAgfSlcbiAgICBpdCgndHJpZ2dlcnMgYWxsIG9uIG5vbi1mbHknLCBmdW5jdGlvbigpIHtcbiAgICAgIGV4cGVjdChzaG91bGRUcmlnZ2VyTGludGVyKHtcbiAgICAgICAgbGludE9uRmx5OiBmYWxzZSxcbiAgICAgICAgZ3JhbW1hclNjb3BlczogWydzb3VyY2UuanMnXSxcbiAgICAgIH0sIGZhbHNlLCBbJ3NvdXJjZS5qcyddKSkudG9CZSh0cnVlKVxuICAgICAgZXhwZWN0KHNob3VsZFRyaWdnZXJMaW50ZXIoe1xuICAgICAgICBsaW50T25GbHk6IHRydWUsXG4gICAgICAgIGdyYW1tYXJTY29wZXM6IFsnc291cmNlLmpzJ10sXG4gICAgICB9LCBmYWxzZSwgWydzb3VyY2UuanMnXSkpLnRvQmUodHJ1ZSlcbiAgICB9KVxuICAgIGl0KCdkb2VzIG5vdCB0cmlnZ2VyIGlmIGdyYW1tYXJTY29wZXMgZG9lcyBub3QgbWF0Y2gnLCBmdW5jdGlvbigpIHtcbiAgICAgIGV4cGVjdChzaG91bGRUcmlnZ2VyTGludGVyKHtcbiAgICAgICAgbGludE9uRmx5OiB0cnVlLFxuICAgICAgICBncmFtbWFyU2NvcGVzOiBbJ3NvdXJjZS5jb2ZmZWUnXSxcbiAgICAgIH0sIHRydWUsIFsnc291cmNlLmpzJ10pKS50b0JlKGZhbHNlKVxuICAgICAgZXhwZWN0KHNob3VsZFRyaWdnZXJMaW50ZXIoe1xuICAgICAgICBsaW50T25GbHk6IHRydWUsXG4gICAgICAgIGdyYW1tYXJTY29wZXM6IFsnc291cmNlLmNvZmZlZScsICdzb3VyY2UuZ28nXSxcbiAgICAgIH0sIGZhbHNlLCBbJ3NvdXJjZS5qcyddKSkudG9CZShmYWxzZSlcbiAgICAgIGV4cGVjdChzaG91bGRUcmlnZ2VyTGludGVyKHtcbiAgICAgICAgbGludE9uRmx5OiBmYWxzZSxcbiAgICAgICAgZ3JhbW1hclNjb3BlczogWydzb3VyY2UuY29mZmVlJywgJ3NvdXJjZS5ydXN0J10sXG4gICAgICB9LCBmYWxzZSwgWydzb3VyY2UuanMnLCAnc291cmNlLmhlbGwnXSkpLnRvQmUoZmFsc2UpXG4gICAgfSlcbiAgfSlcbiAgZGVzY3JpYmUoJ2lzUGF0aElnbm9yZWQnLCBmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiBpc1BhdGhJZ25vcmVkKGE6IGFueSwgYjogYW55LCBjOiBhbnkpIHtcbiAgICAgIHJldHVybiBIZWxwZXJzLmlzUGF0aElnbm9yZWQoYSwgYiB8fCAnKiovKi5taW4ue2pzLGNzc30nLCBjIHx8IGZhbHNlKVxuICAgIH1cblxuICAgIGl0KCdyZXR1cm5zIGZhbHNlIGlmIHBhdGggZG9lcyBub3QgbWF0Y2ggZ2xvYicsIGZ1bmN0aW9uKCkge1xuICAgICAgZXhwZWN0KGlzUGF0aElnbm9yZWQoJ2EuanMnKSkudG9CZShmYWxzZSlcbiAgICAgIGV4cGVjdChpc1BhdGhJZ25vcmVkKCdhLmNzcycpKS50b0JlKGZhbHNlKVxuICAgICAgZXhwZWN0KGlzUGF0aElnbm9yZWQoJy9hLmpzJykpLnRvQmUoZmFsc2UpXG4gICAgICBleHBlY3QoaXNQYXRoSWdub3JlZCgnL2EuY3NzJykpLnRvQmUoZmFsc2UpXG4gICAgfSlcbiAgICBpdCgncmV0dXJucyBmYWxzZSBjb3JyZWN0bHkgZm9yIHdpbmRvd3Mgc3R5bGVkIHBhdGhzJywgZnVuY3Rpb24oKSB7XG4gICAgICBleHBlY3QoaXNQYXRoSWdub3JlZCgnYS5qcycpKS50b0JlKGZhbHNlKVxuICAgICAgZXhwZWN0KGlzUGF0aElnbm9yZWQoJ2EuY3NzJykpLnRvQmUoZmFsc2UpXG4gICAgICBleHBlY3QoaXNQYXRoSWdub3JlZCgnXFxcXGEuanMnKSkudG9CZShmYWxzZSlcbiAgICAgIGV4cGVjdChpc1BhdGhJZ25vcmVkKCdcXFxcYS5jc3MnKSkudG9CZShmYWxzZSlcbiAgICB9KVxuICAgIGl0KCdyZXR1cm5zIHRydWUgaWYgcGF0aCBtYXRjaGVzIGdsb2InLCBmdW5jdGlvbigpIHtcbiAgICAgIGV4cGVjdChpc1BhdGhJZ25vcmVkKCdhLm1pbi5qcycpKS50b0JlKHRydWUpXG4gICAgICBleHBlY3QoaXNQYXRoSWdub3JlZCgnYS5taW4uY3NzJykpLnRvQmUodHJ1ZSlcbiAgICAgIGV4cGVjdChpc1BhdGhJZ25vcmVkKCcvYS5taW4uanMnKSkudG9CZSh0cnVlKVxuICAgICAgZXhwZWN0KGlzUGF0aElnbm9yZWQoJy9hLm1pbi5jc3MnKSkudG9CZSh0cnVlKVxuICAgIH0pXG4gICAgaXQoJ3JldHVybnMgdHJ1ZSBjb3JyZWN0bHkgZm9yIHdpbmRvd3Mgc3R5bGVkIHBhdGhzJywgZnVuY3Rpb24oKSB7XG4gICAgICBleHBlY3QoaXNQYXRoSWdub3JlZCgnYS5taW4uanMnKSkudG9CZSh0cnVlKVxuICAgICAgZXhwZWN0KGlzUGF0aElnbm9yZWQoJ2EubWluLmNzcycpKS50b0JlKHRydWUpXG4gICAgICBleHBlY3QoaXNQYXRoSWdub3JlZCgnXFxcXGEubWluLmpzJykpLnRvQmUodHJ1ZSlcbiAgICAgIGV4cGVjdChpc1BhdGhJZ25vcmVkKCdcXFxcYS5taW4uY3NzJykpLnRvQmUodHJ1ZSlcbiAgICB9KVxuICAgIGl0KCdyZXR1cm5zIHRydWUgaWYgdGhlIHBhdGggaXMgaWdub3JlZCBieSBWQ1MnLCBhc3luYyBmdW5jdGlvbigpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IGF0b20ud29ya3NwYWNlLm9wZW4oX19maWxlbmFtZSlcbiAgICAgICAgZXhwZWN0KGlzUGF0aElnbm9yZWQoZ2V0Rml4dHVyZXNQYXRoKCdpZ25vcmVkLnR4dCcpLCBudWxsLCB0cnVlKSkudG9CZSh0cnVlKVxuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgYXRvbS53b3Jrc3BhY2UuZGVzdHJveUFjdGl2ZVBhbmUoKVxuICAgICAgfVxuICAgIH0pXG4gICAgaXQoJ3JldHVybnMgZmFsc2UgaWYgdGhlIHBhdGggaXMgbm90IGlnbm9yZWQgYnkgVkNTJywgYXN5bmMgZnVuY3Rpb24oKSB7XG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCBhdG9tLndvcmtzcGFjZS5vcGVuKF9fZmlsZW5hbWUpXG4gICAgICAgIGV4cGVjdChpc1BhdGhJZ25vcmVkKGdldEZpeHR1cmVzUGF0aCgnZmlsZS50eHQnKSwgbnVsbCwgdHJ1ZSkpLnRvQmUoZmFsc2UpXG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBhdG9tLndvcmtzcGFjZS5kZXN0cm95QWN0aXZlUGFuZSgpXG4gICAgICB9XG4gICAgfSlcbiAgfSlcbiAgZGVzY3JpYmUoJ3N1YnNjcmlwdGl2ZU9ic2VydmUnLCBmdW5jdGlvbigpIHtcbiAgICBpdCgnYWN0aXZhdGVzIHN5bmNocm9ub3VzbHknLCBmdW5jdGlvbigpIHtcbiAgICAgIGxldCBhY3RpdmF0ZWQgPSBmYWxzZVxuICAgICAgSGVscGVycy5zdWJzY3JpcHRpdmVPYnNlcnZlKHtcbiAgICAgICAgb2JzZXJ2ZShldmVudE5hbWUsIGNhbGxiYWNrKSB7XG4gICAgICAgICAgYWN0aXZhdGVkID0gdHJ1ZVxuICAgICAgICAgIGV4cGVjdChldmVudE5hbWUpLnRvQmUoJ3NvbWVFdmVudCcpXG4gICAgICAgICAgZXhwZWN0KHR5cGVvZiBjYWxsYmFjaykudG9CZSgnZnVuY3Rpb24nKVxuICAgICAgICB9LFxuICAgICAgfSwgJ3NvbWVFdmVudCcsIGZ1bmN0aW9uKCkgeyB9KVxuICAgICAgZXhwZWN0KGFjdGl2YXRlZCkudG9CZSh0cnVlKVxuICAgIH0pXG4gICAgaXQoJ2NsZWFycyBsYXN0IHN1YnNjcmlwdGlvbiB3aGVuIHZhbHVlIGNoYW5nZXMnLCBmdW5jdGlvbigpIHtcbiAgICAgIGxldCBkaXNwb3NlZCA9IDBcbiAgICAgIGxldCBhY3RpdmF0ZWQgPSBmYWxzZVxuICAgICAgSGVscGVycy5zdWJzY3JpcHRpdmVPYnNlcnZlKHtcbiAgICAgICAgb2JzZXJ2ZShldmVudE5hbWUsIGNhbGxiYWNrKSB7XG4gICAgICAgICAgYWN0aXZhdGVkID0gdHJ1ZVxuICAgICAgICAgIGV4cGVjdChkaXNwb3NlZCkudG9CZSgwKVxuICAgICAgICAgIGNhbGxiYWNrKClcbiAgICAgICAgICBleHBlY3QoZGlzcG9zZWQpLnRvQmUoMClcbiAgICAgICAgICBjYWxsYmFjaygpXG4gICAgICAgICAgZXhwZWN0KGRpc3Bvc2VkKS50b0JlKDEpXG4gICAgICAgICAgY2FsbGJhY2soKVxuICAgICAgICAgIGV4cGVjdChkaXNwb3NlZCkudG9CZSgyKVxuICAgICAgICB9LFxuICAgICAgfSwgJ3NvbWVFdmVudCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gbmV3IERpc3Bvc2FibGUoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgZGlzcG9zZWQrK1xuICAgICAgICB9KVxuICAgICAgfSlcbiAgICAgIGV4cGVjdChhY3RpdmF0ZWQpLnRvQmUodHJ1ZSlcbiAgICB9KVxuICAgIGl0KCdjbGVhcnMgYm90aCBzdWJzY3JpcHRpb25zIGF0IHRoZSBlbmQnLCBmdW5jdGlvbigpIHtcbiAgICAgIGxldCBkaXNwb3NlZCA9IDBcbiAgICAgIGxldCBvYnNlcnZlRGlzcG9zZWQgPSAwXG4gICAgICBsZXQgYWN0aXZhdGVkID0gZmFsc2VcbiAgICAgIGNvbnN0IHN1YnNjcmlwdGlvbiA9IEhlbHBlcnMuc3Vic2NyaXB0aXZlT2JzZXJ2ZSh7XG4gICAgICAgIG9ic2VydmUoZXZlbnROYW1lLCBjYWxsYmFjaykge1xuICAgICAgICAgIGFjdGl2YXRlZCA9IHRydWVcbiAgICAgICAgICBleHBlY3QoZGlzcG9zZWQpLnRvQmUoMClcbiAgICAgICAgICBjYWxsYmFjaygpXG4gICAgICAgICAgZXhwZWN0KGRpc3Bvc2VkKS50b0JlKDApXG4gICAgICAgICAgcmV0dXJuIG5ldyBEaXNwb3NhYmxlKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgb2JzZXJ2ZURpc3Bvc2VkKytcbiAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgICAgfSwgJ3NvbWVFdmVudCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gbmV3IERpc3Bvc2FibGUoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgZGlzcG9zZWQrK1xuICAgICAgICB9KVxuICAgICAgfSlcbiAgICAgIGV4cGVjdChhY3RpdmF0ZWQpLnRvQmUodHJ1ZSlcbiAgICAgIHN1YnNjcmlwdGlvbi5kaXNwb3NlKClcbiAgICAgIGV4cGVjdChkaXNwb3NlZCkudG9CZSgxKVxuICAgICAgZXhwZWN0KG9ic2VydmVEaXNwb3NlZCkudG9CZSgxKVxuICAgIH0pXG4gIH0pXG4gIGRlc2NyaWJlKCdub3JtYWxpemVNZXNzYWdlcycsIGZ1bmN0aW9uKCkge1xuICAgIGl0KCdhZGRzIGEga2V5IHRvIHRoZSBtZXNzYWdlJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBtZXNzYWdlID0gZ2V0TWVzc2FnZShmYWxzZSlcbiAgICAgIGV4cGVjdCh0eXBlb2YgbWVzc2FnZS5rZXkpLnRvQmUoJ3VuZGVmaW5lZCcpXG4gICAgICBIZWxwZXJzLm5vcm1hbGl6ZU1lc3NhZ2VzKCdTb21lIExpbnRlcicsIFttZXNzYWdlXSlcbiAgICAgIGV4cGVjdCh0eXBlb2YgbWVzc2FnZS5rZXkpLnRvQmUoJ3N0cmluZycpXG4gICAgfSlcbiAgICBpdCgnYWRkcyBhIHZlcnNpb24gdG8gdGhlIG1lc3NhZ2UnLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSBnZXRNZXNzYWdlKGZhbHNlKVxuICAgICAgZXhwZWN0KHR5cGVvZiBtZXNzYWdlLnZlcnNpb24pLnRvQmUoJ3VuZGVmaW5lZCcpXG4gICAgICBIZWxwZXJzLm5vcm1hbGl6ZU1lc3NhZ2VzKCdTb21lIExpbnRlcicsIFttZXNzYWdlXSlcbiAgICAgIGV4cGVjdCh0eXBlb2YgbWVzc2FnZS52ZXJzaW9uKS50b0JlKCdudW1iZXInKVxuICAgICAgZXhwZWN0KG1lc3NhZ2UudmVyc2lvbikudG9CZSgyKVxuICAgIH0pXG4gICAgaXQoJ2FkZHMgYSBuYW1lIHRvIHRoZSBtZXNzYWdlJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBtZXNzYWdlID0gZ2V0TWVzc2FnZShmYWxzZSlcbiAgICAgIGV4cGVjdCh0eXBlb2YgbWVzc2FnZS5saW50ZXJOYW1lKS50b0JlKCd1bmRlZmluZWQnKVxuICAgICAgSGVscGVycy5ub3JtYWxpemVNZXNzYWdlcygnU29tZSBMaW50ZXInLCBbbWVzc2FnZV0pXG4gICAgICBleHBlY3QodHlwZW9mIG1lc3NhZ2UubGludGVyTmFtZSkudG9CZSgnc3RyaW5nJylcbiAgICAgIGV4cGVjdChtZXNzYWdlLmxpbnRlck5hbWUpLnRvQmUoJ1NvbWUgTGludGVyJylcbiAgICB9KVxuICAgIGl0KCdwcmVzZXJ2ZXMgbGludGVyTmFtZSBpZiBwcm92aWRlZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbWVzc2FnZSA9IGdldE1lc3NhZ2UoZmFsc2UpXG4gICAgICBtZXNzYWdlLmxpbnRlck5hbWUgPSAnU29tZSBMaW50ZXIgMidcbiAgICAgIEhlbHBlcnMubm9ybWFsaXplTWVzc2FnZXMoJ1NvbWUgTGludGVyJywgW21lc3NhZ2VdKVxuICAgICAgZXhwZWN0KHR5cGVvZiBtZXNzYWdlLmxpbnRlck5hbWUpLnRvQmUoJ3N0cmluZycpXG4gICAgICBleHBlY3QobWVzc2FnZS5saW50ZXJOYW1lKS50b0JlKCdTb21lIExpbnRlciAyJylcbiAgICB9KVxuICAgIGl0KCdjb252ZXJ0cyBhcnJheXMgaW4gbG9jYXRpb24tPnBvc2l0aW9uIHRvIHJhbmdlcycsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbWVzc2FnZSA9IGdldE1lc3NhZ2UoZmFsc2UpXG4gICAgICBtZXNzYWdlLmxvY2F0aW9uLnBvc2l0aW9uID0gW1swLCAwXSwgWzAsIDBdXVxuICAgICAgZXhwZWN0KEFycmF5LmlzQXJyYXkobWVzc2FnZS5sb2NhdGlvbi5wb3NpdGlvbikpLnRvQmUodHJ1ZSlcbiAgICAgIEhlbHBlcnMubm9ybWFsaXplTWVzc2FnZXMoJ1NvbWUgTGludGVyJywgW21lc3NhZ2VdKVxuICAgICAgZXhwZWN0KEFycmF5LmlzQXJyYXkobWVzc2FnZS5sb2NhdGlvbi5wb3NpdGlvbikpLnRvQmUoZmFsc2UpXG4gICAgICBleHBlY3QobWVzc2FnZS5sb2NhdGlvbi5wb3NpdGlvbi5jb25zdHJ1Y3Rvci5uYW1lKS50b0JlKCdSYW5nZScpXG4gICAgfSlcbiAgICBpdCgnY29udmVydHMgYXJyYXlzIGluIHNvdXJjZS0+cG9zaXRpb24gdG8gcG9pbnRzJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBtZXNzYWdlID0gZ2V0TWVzc2FnZShmYWxzZSlcbiAgICAgIG1lc3NhZ2UucmVmZXJlbmNlID0geyBmaWxlOiBfX2Rpcm5hbWUsIHBvc2l0aW9uOiBbMCwgMF0gfVxuICAgICAgZXhwZWN0KEFycmF5LmlzQXJyYXkobWVzc2FnZS5yZWZlcmVuY2UucG9zaXRpb24pKS50b0JlKHRydWUpXG4gICAgICBIZWxwZXJzLm5vcm1hbGl6ZU1lc3NhZ2VzKCdTb21lIExpbnRlcicsIFttZXNzYWdlXSlcbiAgICAgIGV4cGVjdChBcnJheS5pc0FycmF5KG1lc3NhZ2UucmVmZXJlbmNlLnBvc2l0aW9uKSkudG9CZShmYWxzZSlcbiAgICAgIGV4cGVjdChtZXNzYWdlLnJlZmVyZW5jZS5wb3NpdGlvbi5jb25zdHJ1Y3Rvci5uYW1lKS50b0JlKCdQb2ludCcpXG4gICAgfSlcbiAgICBpdCgnY29udmVydHMgYXJyYXlzIGluIHNvbHV0aW9uW2luZGV4XS0+cG9zaXRpb24gdG8gcmFuZ2VzJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBtZXNzYWdlID0gZ2V0TWVzc2FnZShmYWxzZSlcbiAgICAgIG1lc3NhZ2Uuc29sdXRpb25zID0gW3sgcG9zaXRpb246IFtbMCwgMF0sIFswLCAwXV0sIGFwcGx5KCkgeyB9IH1dXG4gICAgICBleHBlY3QoQXJyYXkuaXNBcnJheShtZXNzYWdlLnNvbHV0aW9uc1swXS5wb3NpdGlvbikpLnRvQmUodHJ1ZSlcbiAgICAgIEhlbHBlcnMubm9ybWFsaXplTWVzc2FnZXMoJ1NvbWUgTGludGVyJywgW21lc3NhZ2VdKVxuICAgICAgZXhwZWN0KEFycmF5LmlzQXJyYXkobWVzc2FnZS5zb2x1dGlvbnNbMF0ucG9zaXRpb24pKS50b0JlKGZhbHNlKVxuICAgICAgZXhwZWN0KG1lc3NhZ2Uuc29sdXRpb25zWzBdLnBvc2l0aW9uLmNvbnN0cnVjdG9yLm5hbWUpLnRvQmUoJ1JhbmdlJylcbiAgICB9KVxuICB9KVxuICBkZXNjcmliZSgnbm9ybWFsaXplTWVzc2FnZXNMZWdhY3knLCBmdW5jdGlvbigpIHtcbiAgICBpdCgnYWRkcyBhIGtleSB0byB0aGUgbWVzc2FnZScsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbWVzc2FnZSA9IGdldE1lc3NhZ2VMZWdhY3koZmFsc2UpXG4gICAgICBleHBlY3QodHlwZW9mIG1lc3NhZ2Uua2V5KS50b0JlKCd1bmRlZmluZWQnKVxuICAgICAgSGVscGVycy5ub3JtYWxpemVNZXNzYWdlc0xlZ2FjeSgnU29tZSBMaW50ZXInLCBbbWVzc2FnZV0pXG4gICAgICBleHBlY3QodHlwZW9mIG1lc3NhZ2Uua2V5KS50b0JlKCdzdHJpbmcnKVxuICAgIH0pXG4gICAgaXQoJ2FkZHMgYSB2ZXJzaW9uIHRvIHRoZSBtZXNzYWdlJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBtZXNzYWdlID0gZ2V0TWVzc2FnZUxlZ2FjeShmYWxzZSlcbiAgICAgIGV4cGVjdCh0eXBlb2YgbWVzc2FnZS52ZXJzaW9uKS50b0JlKCd1bmRlZmluZWQnKVxuICAgICAgSGVscGVycy5ub3JtYWxpemVNZXNzYWdlc0xlZ2FjeSgnU29tZSBMaW50ZXInLCBbbWVzc2FnZV0pXG4gICAgICBleHBlY3QodHlwZW9mIG1lc3NhZ2UudmVyc2lvbikudG9CZSgnbnVtYmVyJylcbiAgICAgIGV4cGVjdChtZXNzYWdlLnZlcnNpb24pLnRvQmUoMSlcbiAgICB9KVxuICAgIGl0KCdhZGRzIGEgbGludGVyTmFtZSB0byB0aGUgbWVzc2FnZScsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbWVzc2FnZSA9IGdldE1lc3NhZ2VMZWdhY3koZmFsc2UpXG4gICAgICBleHBlY3QodHlwZW9mIG1lc3NhZ2UubGludGVyTmFtZSkudG9CZSgndW5kZWZpbmVkJylcbiAgICAgIEhlbHBlcnMubm9ybWFsaXplTWVzc2FnZXNMZWdhY3koJ1NvbWUgTGludGVyJywgW21lc3NhZ2VdKVxuICAgICAgZXhwZWN0KHR5cGVvZiBtZXNzYWdlLmxpbnRlck5hbWUpLnRvQmUoJ3N0cmluZycpXG4gICAgICBleHBlY3QobWVzc2FnZS5saW50ZXJOYW1lKS50b0JlKCdTb21lIExpbnRlcicpXG4gICAgfSlcbiAgICBkZXNjcmliZSgnYWRkcyBhIHNldmVyaXR5IHRvIHRoZSBtZXNzYWdlJywgZnVuY3Rpb24oKSB7XG4gICAgICBpdCgnYWRkcyBpbmZvIGNvcnJlY3RseScsIGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zdCBtZXNzYWdlID0gZ2V0TWVzc2FnZUxlZ2FjeShmYWxzZSlcbiAgICAgICAgbWVzc2FnZS50eXBlID0gJ0luZm8nXG4gICAgICAgIGV4cGVjdCh0eXBlb2YgbWVzc2FnZS5zZXZlcml0eSkudG9CZSgndW5kZWZpbmVkJylcbiAgICAgICAgSGVscGVycy5ub3JtYWxpemVNZXNzYWdlc0xlZ2FjeSgnU29tZSBMaW50ZXInLCBbbWVzc2FnZV0pXG4gICAgICAgIGV4cGVjdCh0eXBlb2YgbWVzc2FnZS5zZXZlcml0eSkudG9CZSgnc3RyaW5nJylcbiAgICAgICAgZXhwZWN0KG1lc3NhZ2Uuc2V2ZXJpdHkpLnRvQmUoJ2luZm8nKVxuICAgICAgfSlcbiAgICAgIGl0KCdhZGRzIGluZm8gYW5kIGlzIG5vdCBjYXNlIHNlbnNpdGl2ZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zdCBtZXNzYWdlID0gZ2V0TWVzc2FnZUxlZ2FjeShmYWxzZSlcbiAgICAgICAgbWVzc2FnZS50eXBlID0gJ2luZm8nXG4gICAgICAgIGV4cGVjdCh0eXBlb2YgbWVzc2FnZS5zZXZlcml0eSkudG9CZSgndW5kZWZpbmVkJylcbiAgICAgICAgSGVscGVycy5ub3JtYWxpemVNZXNzYWdlc0xlZ2FjeSgnU29tZSBMaW50ZXInLCBbbWVzc2FnZV0pXG4gICAgICAgIGV4cGVjdCh0eXBlb2YgbWVzc2FnZS5zZXZlcml0eSkudG9CZSgnc3RyaW5nJylcbiAgICAgICAgZXhwZWN0KG1lc3NhZ2Uuc2V2ZXJpdHkpLnRvQmUoJ2luZm8nKVxuICAgICAgfSlcbiAgICAgIGl0KCdhZGRzIHdhcm5pbmcgY29ycmVjdGx5JywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBnZXRNZXNzYWdlTGVnYWN5KGZhbHNlKVxuICAgICAgICBtZXNzYWdlLnR5cGUgPSAnV2FybmluZydcbiAgICAgICAgZXhwZWN0KHR5cGVvZiBtZXNzYWdlLnNldmVyaXR5KS50b0JlKCd1bmRlZmluZWQnKVxuICAgICAgICBIZWxwZXJzLm5vcm1hbGl6ZU1lc3NhZ2VzTGVnYWN5KCdTb21lIExpbnRlcicsIFttZXNzYWdlXSlcbiAgICAgICAgZXhwZWN0KHR5cGVvZiBtZXNzYWdlLnNldmVyaXR5KS50b0JlKCdzdHJpbmcnKVxuICAgICAgICBleHBlY3QobWVzc2FnZS5zZXZlcml0eSkudG9CZSgnd2FybmluZycpXG4gICAgICB9KVxuICAgICAgaXQoJ2FkZHMgd2FybmluZyBhbmQgaXMgbm90IGNhc2Ugc2Vuc2l0aXZlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBnZXRNZXNzYWdlTGVnYWN5KGZhbHNlKVxuICAgICAgICBtZXNzYWdlLnR5cGUgPSAnd2FybmluZydcbiAgICAgICAgZXhwZWN0KHR5cGVvZiBtZXNzYWdlLnNldmVyaXR5KS50b0JlKCd1bmRlZmluZWQnKVxuICAgICAgICBIZWxwZXJzLm5vcm1hbGl6ZU1lc3NhZ2VzTGVnYWN5KCdTb21lIExpbnRlcicsIFttZXNzYWdlXSlcbiAgICAgICAgZXhwZWN0KHR5cGVvZiBtZXNzYWdlLnNldmVyaXR5KS50b0JlKCdzdHJpbmcnKVxuICAgICAgICBleHBlY3QobWVzc2FnZS5zZXZlcml0eSkudG9CZSgnd2FybmluZycpXG4gICAgICB9KVxuICAgICAgaXQoJ2FkZHMgaW5mbyB0byB0cmFjZXMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc3QgbWVzc2FnZSA9IGdldE1lc3NhZ2VMZWdhY3koZmFsc2UpXG4gICAgICAgIG1lc3NhZ2UudHlwZSA9ICdUcmFjZSdcbiAgICAgICAgZXhwZWN0KHR5cGVvZiBtZXNzYWdlLnNldmVyaXR5KS50b0JlKCd1bmRlZmluZWQnKVxuICAgICAgICBIZWxwZXJzLm5vcm1hbGl6ZU1lc3NhZ2VzTGVnYWN5KCdTb21lIExpbnRlcicsIFttZXNzYWdlXSlcbiAgICAgICAgZXhwZWN0KHR5cGVvZiBtZXNzYWdlLnNldmVyaXR5KS50b0JlKCdzdHJpbmcnKVxuICAgICAgICBleHBlY3QobWVzc2FnZS5zZXZlcml0eSkudG9CZSgnaW5mbycpXG4gICAgICB9KVxuICAgICAgaXQoJ2FkZHMgZXJyb3IgZm9yIGFueXRoaW5nIGVsc2UnLCBmdW5jdGlvbigpIHtcbiAgICAgICAge1xuICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBnZXRNZXNzYWdlTGVnYWN5KGZhbHNlKVxuICAgICAgICAgIG1lc3NhZ2UudHlwZSA9ICdhc2Rhc2QnXG4gICAgICAgICAgZXhwZWN0KHR5cGVvZiBtZXNzYWdlLnNldmVyaXR5KS50b0JlKCd1bmRlZmluZWQnKVxuICAgICAgICAgIEhlbHBlcnMubm9ybWFsaXplTWVzc2FnZXNMZWdhY3koJ1NvbWUgTGludGVyJywgW21lc3NhZ2VdKVxuICAgICAgICAgIGV4cGVjdCh0eXBlb2YgbWVzc2FnZS5zZXZlcml0eSkudG9CZSgnc3RyaW5nJylcbiAgICAgICAgICBleHBlY3QobWVzc2FnZS5zZXZlcml0eSkudG9CZSgnZXJyb3InKVxuICAgICAgICB9XG4gICAgICAgIHtcbiAgICAgICAgICBjb25zdCBtZXNzYWdlID0gZ2V0TWVzc2FnZUxlZ2FjeShmYWxzZSlcbiAgICAgICAgICBtZXNzYWdlLnR5cGUgPSAnQXNkU0Rhc2Rhc2QnXG4gICAgICAgICAgZXhwZWN0KHR5cGVvZiBtZXNzYWdlLnNldmVyaXR5KS50b0JlKCd1bmRlZmluZWQnKVxuICAgICAgICAgIEhlbHBlcnMubm9ybWFsaXplTWVzc2FnZXNMZWdhY3koJ1NvbWUgTGludGVyJywgW21lc3NhZ2VdKVxuICAgICAgICAgIGV4cGVjdCh0eXBlb2YgbWVzc2FnZS5zZXZlcml0eSkudG9CZSgnc3RyaW5nJylcbiAgICAgICAgICBleHBlY3QobWVzc2FnZS5zZXZlcml0eSkudG9CZSgnZXJyb3InKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0pXG4gICAgaXQoJ2NvbnZlcnRzIGFycmF5cyBpbiByYW5nZSB0byBSYW5nZScsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbWVzc2FnZSA9IGdldE1lc3NhZ2VMZWdhY3koZmFsc2UpXG4gICAgICBtZXNzYWdlLnJhbmdlID0gW1swLCAwXSwgWzAsIDBdXVxuICAgICAgZXhwZWN0KEFycmF5LmlzQXJyYXkobWVzc2FnZS5yYW5nZSkpLnRvQmUodHJ1ZSlcbiAgICAgIEhlbHBlcnMubm9ybWFsaXplTWVzc2FnZXNMZWdhY3koJ1NvbWUgTGludGVyJywgW21lc3NhZ2VdKVxuICAgICAgZXhwZWN0KEFycmF5LmlzQXJyYXkobWVzc2FnZS5yYW5nZSkpLnRvQmUoZmFsc2UpXG4gICAgICBleHBlY3QobWVzc2FnZS5yYW5nZS5jb25zdHJ1Y3Rvci5uYW1lKS50b0JlKCdSYW5nZScpXG4gICAgfSlcbiAgICBpdCgnY29udmVydHMgYXJyYXlzIGluIGZpeC0+cmFuZ2UgdG8gUmFuZ2UnLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSBnZXRNZXNzYWdlTGVnYWN5KGZhbHNlKVxuICAgICAgbWVzc2FnZS5maXggPSB7IHJhbmdlOiBbWzAsIDBdLCBbMCwgMF1dLCBuZXdUZXh0OiAnZmFpcicgfVxuICAgICAgZXhwZWN0KEFycmF5LmlzQXJyYXkobWVzc2FnZS5maXgucmFuZ2UpKS50b0JlKHRydWUpXG4gICAgICBIZWxwZXJzLm5vcm1hbGl6ZU1lc3NhZ2VzTGVnYWN5KCdTb21lIExpbnRlcicsIFttZXNzYWdlXSlcbiAgICAgIGV4cGVjdChBcnJheS5pc0FycmF5KG1lc3NhZ2UuZml4LnJhbmdlKSkudG9CZShmYWxzZSlcbiAgICAgIGV4cGVjdChtZXNzYWdlLmZpeC5yYW5nZS5jb25zdHJ1Y3Rvci5uYW1lKS50b0JlKCdSYW5nZScpXG4gICAgfSlcbiAgICBpdCgncHJvY2Vzc2VzIHRyYWNlcyBvbiBtZXNzYWdlcycsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbWVzc2FnZSA9IGdldE1lc3NhZ2VMZWdhY3koZmFsc2UpXG4gICAgICBtZXNzYWdlLnR5cGUgPSAnYXNkYXNkJ1xuICAgICAgY29uc3QgdHJhY2UgPSBnZXRNZXNzYWdlTGVnYWN5KGZhbHNlKVxuICAgICAgdHJhY2UudHlwZSA9ICdUcmFjZSdcbiAgICAgIG1lc3NhZ2UudHJhY2UgPSBbdHJhY2VdXG4gICAgICBleHBlY3QodHlwZW9mIHRyYWNlLnNldmVyaXR5KS50b0JlKCd1bmRlZmluZWQnKVxuICAgICAgSGVscGVycy5ub3JtYWxpemVNZXNzYWdlc0xlZ2FjeSgnU29tZSBMaW50ZXInLCBbbWVzc2FnZV0pXG4gICAgICBleHBlY3QodHlwZW9mIHRyYWNlLnNldmVyaXR5KS50b0JlKCdzdHJpbmcnKVxuICAgICAgZXhwZWN0KHRyYWNlLnNldmVyaXR5KS50b0JlKCdpbmZvJylcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==