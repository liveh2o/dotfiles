function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var _jasmineFix = require('jasmine-fix');

var _libEditorRegistry = require('../lib/editor-registry');

var _libEditorRegistry2 = _interopRequireDefault(_libEditorRegistry);

describe('EditorRegistry', function () {
  var editorRegistry = undefined;

  (0, _jasmineFix.beforeEach)(_asyncToGenerator(function* () {
    yield atom.workspace.open(__filename);
    editorRegistry = new _libEditorRegistry2['default']();
  }));
  afterEach(function () {
    atom.workspace.destroyActivePane();
    editorRegistry.dispose();
  });

  describe('::constructor', function () {
    (0, _jasmineFix.it)('is a saint', function () {
      expect(function () {
        return new _libEditorRegistry2['default']();
      }).not.toThrow();
    });
  });

  describe('::activate && ::createFromTextEditor', function () {
    (0, _jasmineFix.it)('adds current open editors to registry', function () {
      expect(editorRegistry.editorLinters.size).toBe(0);
      editorRegistry.activate();
      expect(editorRegistry.editorLinters.size).toBe(1);
    });
    (0, _jasmineFix.it)('adds editors as they are opened', _asyncToGenerator(function* () {
      expect(editorRegistry.editorLinters.size).toBe(0);
      editorRegistry.activate();
      expect(editorRegistry.editorLinters.size).toBe(1);
      yield atom.workspace.open();
      expect(editorRegistry.editorLinters.size).toBe(2);
    }));
    (0, _jasmineFix.it)('removes the editor as it is closed', _asyncToGenerator(function* () {
      expect(editorRegistry.editorLinters.size).toBe(0);
      editorRegistry.activate();
      expect(editorRegistry.editorLinters.size).toBe(1);
      yield atom.workspace.open();
      expect(editorRegistry.editorLinters.size).toBe(2);
      atom.workspace.destroyActivePaneItem();
      expect(editorRegistry.editorLinters.size).toBe(1);
      atom.workspace.destroyActivePane();
      expect(editorRegistry.editorLinters.size).toBe(0);
    }));
    (0, _jasmineFix.it)('does not lint instantly if lintOnOpen is off', _asyncToGenerator(function* () {
      editorRegistry.activate();
      atom.config.set('linter.lintOnOpen', false);
      var lintCalls = 0;
      editorRegistry.observe(function (editorLinter) {
        editorLinter.onShouldLint(function () {
          return ++lintCalls;
        });
      });
      expect(lintCalls).toBe(0);
      yield atom.workspace.open();
      expect(lintCalls).toBe(0);
    }));
    (0, _jasmineFix.it)('invokes lint instantly if lintOnOpen is on', _asyncToGenerator(function* () {
      editorRegistry.activate();
      atom.config.set('linter.lintOnOpen', true);
      var lintCalls = 0;
      editorRegistry.observe(function (editorLinter) {
        editorLinter.onShouldLint(function () {
          return ++lintCalls;
        });
      });
      expect(lintCalls).toBe(0);
      yield atom.workspace.open();
      expect(lintCalls).toBe(1);
    }));
  });
  describe('::observe', function () {
    (0, _jasmineFix.it)('calls with current editors and updates as new are opened', _asyncToGenerator(function* () {
      var timesCalled = 0;
      editorRegistry.observe(function () {
        timesCalled++;
      });
      expect(timesCalled).toBe(0);
      editorRegistry.activate();
      expect(timesCalled).toBe(1);
      yield atom.workspace.open();
      expect(timesCalled).toBe(2);
    }));
  });
  describe('::dispose', function () {
    (0, _jasmineFix.it)('disposes all the editors on dispose', _asyncToGenerator(function* () {
      var timesDisposed = 0;
      editorRegistry.observe(function (editorLinter) {
        editorLinter.onDidDestroy(function () {
          timesDisposed++;
        });
      });
      expect(timesDisposed).toBe(0);
      editorRegistry.activate();
      expect(timesDisposed).toBe(0);
      atom.workspace.destroyActivePaneItem();
      expect(timesDisposed).toBe(1);
      yield atom.workspace.open();
      expect(timesDisposed).toBe(1);
      atom.workspace.destroyActivePaneItem();
      expect(timesDisposed).toBe(2);
      yield atom.workspace.open();
      yield atom.workspace.open();
      editorRegistry.dispose();
      expect(timesDisposed).toBe(4);
    }));
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvc3BlYy9lZGl0b3ItcmVnaXN0cnktc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OzBCQUUrQixhQUFhOztpQ0FDakIsd0JBQXdCOzs7O0FBRW5ELFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxZQUFXO0FBQ3BDLE1BQUksY0FBYyxZQUFBLENBQUE7O0FBRWxCLGdEQUFXLGFBQWlCO0FBQzFCLFVBQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUE7QUFDckMsa0JBQWMsR0FBRyxvQ0FBb0IsQ0FBQTtHQUN0QyxFQUFDLENBQUE7QUFDRixXQUFTLENBQUMsWUFBVztBQUNuQixRQUFJLENBQUMsU0FBUyxDQUFDLGlCQUFpQixFQUFFLENBQUE7QUFDbEMsa0JBQWMsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtHQUN6QixDQUFDLENBQUE7O0FBRUYsVUFBUSxDQUFDLGVBQWUsRUFBRSxZQUFXO0FBQ25DLHdCQUFHLFlBQVksRUFBRSxZQUFXO0FBQzFCLFlBQU0sQ0FBQyxZQUFXO0FBQ2hCLGVBQU8sb0NBQW9CLENBQUE7T0FDNUIsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtLQUNqQixDQUFDLENBQUE7R0FDSCxDQUFDLENBQUE7O0FBRUYsVUFBUSxDQUFDLHNDQUFzQyxFQUFFLFlBQVc7QUFDMUQsd0JBQUcsdUNBQXVDLEVBQUUsWUFBVztBQUNyRCxZQUFNLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDakQsb0JBQWMsQ0FBQyxRQUFRLEVBQUUsQ0FBQTtBQUN6QixZQUFNLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7S0FDbEQsQ0FBQyxDQUFBO0FBQ0Ysd0JBQUcsaUNBQWlDLG9CQUFFLGFBQWlC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LENBQUMsQ0FBQyxDQUFBO0FBQzdCLFlBQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtBQUMzQixZQUFNLENBQUMsYUFBYSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQzdCLFVBQUksQ0FBQyxTQUFTLENBQUMscUJBQXFCLEVBQUUsQ0FBQTtBQUN0QyxZQUFNLENBQUMsYUFBYSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQzdCLFlBQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtBQUMzQixZQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUE7QUFDM0Isb0JBQWMsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUN4QixZQUFNLENBQUMsYUFBYSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0tBQzlCLEVBQUMsQ0FBQTtHQUNILENBQUMsQ0FBQTtDQUNILENBQUMsQ0FBQSIsImZpbGUiOiIvVXNlcnMvYWgvLmF0b20vcGFja2FnZXMvbGludGVyL3NwZWMvZWRpdG9yLXJlZ2lzdHJ5LXNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgeyBpdCwgYmVmb3JlRWFjaCB9IGZyb20gJ2phc21pbmUtZml4J1xuaW1wb3J0IEVkaXRvclJlZ2lzdHJ5IGZyb20gJy4uL2xpYi9lZGl0b3ItcmVnaXN0cnknXG5cbmRlc2NyaWJlKCdFZGl0b3JSZWdpc3RyeScsIGZ1bmN0aW9uKCkge1xuICBsZXQgZWRpdG9yUmVnaXN0cnlcblxuICBiZWZvcmVFYWNoKGFzeW5jIGZ1bmN0aW9uKCkge1xuICAgIGF3YWl0IGF0b20ud29ya3NwYWNlLm9wZW4oX19maWxlbmFtZSlcbiAgICBlZGl0b3JSZWdpc3RyeSA9IG5ldyBFZGl0b3JSZWdpc3RyeSgpXG4gIH0pXG4gIGFmdGVyRWFjaChmdW5jdGlvbigpIHtcbiAgICBhdG9tLndvcmtzcGFjZS5kZXN0cm95QWN0aXZlUGFuZSgpXG4gICAgZWRpdG9yUmVnaXN0cnkuZGlzcG9zZSgpXG4gIH0pXG5cbiAgZGVzY3JpYmUoJzo6Y29uc3RydWN0b3InLCBmdW5jdGlvbigpIHtcbiAgICBpdCgnaXMgYSBzYWludCcsIGZ1bmN0aW9uKCkge1xuICAgICAgZXhwZWN0KGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gbmV3IEVkaXRvclJlZ2lzdHJ5KClcbiAgICAgIH0pLm5vdC50b1Rocm93KClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCc6OmFjdGl2YXRlICYmIDo6Y3JlYXRlRnJvbVRleHRFZGl0b3InLCBmdW5jdGlvbigpIHtcbiAgICBpdCgnYWRkcyBjdXJyZW50IG9wZW4gZWRpdG9ycyB0byByZWdpc3RyeScsIGZ1bmN0aW9uKCkge1xuICAgICAgZXhwZWN0KGVkaXRvclJlZ2lzdHJ5LmVkaXRvckxpbnRlcnMuc2l6ZSkudG9CZSgwKVxuICAgICAgZWRpdG9yUmVnaXN0cnkuYWN0aXZhdGUoKVxuICAgICAgZXhwZWN0KGVkaXRvclJlZ2lzdHJ5LmVkaXRvckxpbnRlcnMuc2l6ZSkudG9CZSgxKVxuICAgIH0pXG4gICAgaXQoJ2FkZHMgZWRpdG9ycyBhcyB0aGV5IGFyZSBvcGVuZWQnLCBhc3luYyBmdW5jdGlvbigpIHtcbiAgICAgIGV4cGVjdChlZGl0b3JSZWdpc3RyeS5lZGl0b3JMaW50ZXJzLnNpemUpLnRvQmUoMClcbiAgICAgIGVkaXRvclJlZ2lzdHJ5LmFjdGl2YXRlKClcbiAgICAgIGV4cGVjdChlZGl0b3JSZWdpc3RyeS5lZGl0b3JMaW50ZXJzLnNpemUpLnRvQmUoMSlcbiAgICAgIGF3YWl0IGF0b20ud29ya3NwYWNlLm9wZW4oKVxuICAgICAgZXhwZWN0KGVkaXRvclJlZ2lzdHJ5LmVkaXRvckxpbnRlcnMuc2l6ZSkudG9CZSgyKVxuICAgIH0pXG4gICAgaXQoJ3JlbW92ZXMgdGhlIGVkaXRvciBhcyBpdCBpcyBjbG9zZWQnLCBhc3luYyBmdW5jdGlvbigpIHtcbiAgICAgIGV4cGVjdChlZGl0b3JSZWdpc3RyeS5lZGl0b3JMaW50ZXJzLnNpemUpLnRvQmUoMClcbiAgICAgIGVkaXRvclJlZ2lzdHJ5LmFjdGl2YXRlKClcbiAgICAgIGV4cGVjdChlZGl0b3JSZWdpc3RyeS5lZGl0b3JMaW50ZXJzLnNpemUpLnRvQmUoMSlcbiAgICAgIGF3YWl0IGF0b20ud29ya3NwYWNlLm9wZW4oKVxuICAgICAgZXhwZWN0KGVkaXRvclJlZ2lzdHJ5LmVkaXRvckxpbnRlcnMuc2l6ZSkudG9CZSgyKVxuICAgICAgYXRvbS53b3Jrc3BhY2UuZGVzdHJveUFjdGl2ZVBhbmVJdGVtKClcbiAgICAgIGV4cGVjdChlZGl0b3JSZWdpc3RyeS5lZGl0b3JMaW50ZXJzLnNpemUpLnRvQmUoMSlcbiAgICAgIGF0b20ud29ya3NwYWNlLmRlc3Ryb3lBY3RpdmVQYW5lKClcbiAgICAgIGV4cGVjdChlZGl0b3JSZWdpc3RyeS5lZGl0b3JMaW50ZXJzLnNpemUpLnRvQmUoMClcbiAgICB9KVxuICAgIGl0KCdkb2VzIG5vdCBsaW50IGluc3RhbnRseSBpZiBsaW50T25PcGVuIGlzIG9mZicsIGFzeW5jIGZ1bmN0aW9uKCkge1xuICAgICAgZWRpdG9yUmVnaXN0cnkuYWN0aXZhdGUoKVxuICAgICAgYXRvbS5jb25maWcuc2V0KCdsaW50ZXIubGludE9uT3BlbicsIGZhbHNlKVxuICAgICAgbGV0IGxpbnRDYWxscyA9IDBcbiAgICAgIGVkaXRvclJlZ2lzdHJ5Lm9ic2VydmUoZnVuY3Rpb24oZWRpdG9yTGludGVyKSB7XG4gICAgICAgIGVkaXRvckxpbnRlci5vblNob3VsZExpbnQoKCkgPT4gKytsaW50Q2FsbHMpXG4gICAgICB9KVxuICAgICAgZXhwZWN0KGxpbnRDYWxscykudG9CZSgwKVxuICAgICAgYXdhaXQgYXRvbS53b3Jrc3BhY2Uub3BlbigpXG4gICAgICBleHBlY3QobGludENhbGxzKS50b0JlKDApXG4gICAgfSlcbiAgICBpdCgnaW52b2tlcyBsaW50IGluc3RhbnRseSBpZiBsaW50T25PcGVuIGlzIG9uJywgYXN5bmMgZnVuY3Rpb24oKSB7XG4gICAgICBlZGl0b3JSZWdpc3RyeS5hY3RpdmF0ZSgpXG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ2xpbnRlci5saW50T25PcGVuJywgdHJ1ZSlcbiAgICAgIGxldCBsaW50Q2FsbHMgPSAwXG4gICAgICBlZGl0b3JSZWdpc3RyeS5vYnNlcnZlKGZ1bmN0aW9uKGVkaXRvckxpbnRlcikge1xuICAgICAgICBlZGl0b3JMaW50ZXIub25TaG91bGRMaW50KCgpID0+ICsrbGludENhbGxzKVxuICAgICAgfSlcbiAgICAgIGV4cGVjdChsaW50Q2FsbHMpLnRvQmUoMClcbiAgICAgIGF3YWl0IGF0b20ud29ya3NwYWNlLm9wZW4oKVxuICAgICAgZXhwZWN0KGxpbnRDYWxscykudG9CZSgxKVxuICAgIH0pXG4gIH0pXG4gIGRlc2NyaWJlKCc6Om9ic2VydmUnLCBmdW5jdGlvbigpIHtcbiAgICBpdCgnY2FsbHMgd2l0aCBjdXJyZW50IGVkaXRvcnMgYW5kIHVwZGF0ZXMgYXMgbmV3IGFyZSBvcGVuZWQnLCBhc3luYyBmdW5jdGlvbigpIHtcbiAgICAgIGxldCB0aW1lc0NhbGxlZCA9IDBcbiAgICAgIGVkaXRvclJlZ2lzdHJ5Lm9ic2VydmUoZnVuY3Rpb24oKSB7XG4gICAgICAgIHRpbWVzQ2FsbGVkKytcbiAgICAgIH0pXG4gICAgICBleHBlY3QodGltZXNDYWxsZWQpLnRvQmUoMClcbiAgICAgIGVkaXRvclJlZ2lzdHJ5LmFjdGl2YXRlKClcbiAgICAgIGV4cGVjdCh0aW1lc0NhbGxlZCkudG9CZSgxKVxuICAgICAgYXdhaXQgYXRvbS53b3Jrc3BhY2Uub3BlbigpXG4gICAgICBleHBlY3QodGltZXNDYWxsZWQpLnRvQmUoMilcbiAgICB9KVxuICB9KVxuICBkZXNjcmliZSgnOjpkaXNwb3NlJywgZnVuY3Rpb24oKSB7XG4gICAgaXQoJ2Rpc3Bvc2VzIGFsbCB0aGUgZWRpdG9ycyBvbiBkaXNwb3NlJywgYXN5bmMgZnVuY3Rpb24oKSB7XG4gICAgICBsZXQgdGltZXNEaXNwb3NlZCA9IDBcbiAgICAgIGVkaXRvclJlZ2lzdHJ5Lm9ic2VydmUoZnVuY3Rpb24oZWRpdG9yTGludGVyKSB7XG4gICAgICAgIGVkaXRvckxpbnRlci5vbkRpZERlc3Ryb3koZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdGltZXNEaXNwb3NlZCsrXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgICAgZXhwZWN0KHRpbWVzRGlzcG9zZWQpLnRvQmUoMClcbiAgICAgIGVkaXRvclJlZ2lzdHJ5LmFjdGl2YXRlKClcbiAgICAgIGV4cGVjdCh0aW1lc0Rpc3Bvc2VkKS50b0JlKDApXG4gICAgICBhdG9tLndvcmtzcGFjZS5kZXN0cm95QWN0aXZlUGFuZUl0ZW0oKVxuICAgICAgZXhwZWN0KHRpbWVzRGlzcG9zZWQpLnRvQmUoMSlcbiAgICAgIGF3YWl0IGF0b20ud29ya3NwYWNlLm9wZW4oKVxuICAgICAgZXhwZWN0KHRpbWVzRGlzcG9zZWQpLnRvQmUoMSlcbiAgICAgIGF0b20ud29ya3NwYWNlLmRlc3Ryb3lBY3RpdmVQYW5lSXRlbSgpXG4gICAgICBleHBlY3QodGltZXNEaXNwb3NlZCkudG9CZSgyKVxuICAgICAgYXdhaXQgYXRvbS53b3Jrc3BhY2Uub3BlbigpXG4gICAgICBhd2FpdCBhdG9tLndvcmtzcGFjZS5vcGVuKClcbiAgICAgIGVkaXRvclJlZ2lzdHJ5LmRpc3Bvc2UoKVxuICAgICAgZXhwZWN0KHRpbWVzRGlzcG9zZWQpLnRvQmUoNClcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==