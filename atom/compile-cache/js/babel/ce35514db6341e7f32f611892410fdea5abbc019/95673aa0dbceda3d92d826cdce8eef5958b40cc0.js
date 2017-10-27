function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libMain = require('../lib/main');

var _libMain2 = _interopRequireDefault(_libMain);

var _common = require('./common');

describe('Atom Linter', function () {
  var atomLinter = undefined;

  beforeEach(function () {
    atomLinter = new _libMain2['default']();
  });
  afterEach(function () {
    atomLinter.dispose();
  });

  it('feeds old messages to newly added ui providers', function () {
    var patchCalled = 0;

    var message = (0, _common.getMessage)(true);
    var uiProvider = {
      name: 'test',
      didBeginLinting: function didBeginLinting() {},
      didFinishLinting: function didFinishLinting() {},
      render: function render(patch) {
        expect(patch.added).toEqual([message]);
        expect(patch.messages).toEqual([message]);
        expect(patch.removed).toEqual([]);
        patchCalled++;
      },
      dispose: function dispose() {}
    };
    // Force the MessageRegistry to initialze, note that this is handled under
    // normal usage!
    atomLinter.registryMessagesInit();
    atomLinter.registryMessages.messages.push(message);
    atomLinter.addUI(uiProvider);
    expect(patchCalled).toBe(1);
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvc3BlYy9tYWluLXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7dUJBRXVCLGFBQWE7Ozs7c0JBQ1QsVUFBVTs7QUFFckMsUUFBUSxDQUFDLGFBQWEsRUFBRSxZQUFXO0FBQ2pDLE1BQUksVUFBVSxZQUFBLENBQUE7O0FBRWQsWUFBVSxDQUFDLFlBQVc7QUFDcEIsY0FBVSxHQUFHLDBCQUFnQixDQUFBO0dBQzlCLENBQUMsQ0FBQTtBQUNGLFdBQVMsQ0FBQyxZQUFXO0FBQ25CLGNBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtHQUNyQixDQUFDLENBQUE7O0FBRUYsSUFBRSxDQUFDLGdEQUFnRCxFQUFFLFlBQVc7QUFDOUQsUUFBSSxXQUFXLEdBQUcsQ0FBQyxDQUFBOztBQUVuQixRQUFNLE9BQU8sR0FBRyx3QkFBVyxJQUFJLENBQUMsQ0FBQTtBQUNoQyxRQUFNLFVBQVUsR0FBRztBQUNqQixVQUFJLEVBQUUsTUFBTTtBQUNaLHFCQUFlLEVBQUEsMkJBQUcsRUFBRTtBQUNwQixzQkFBZ0IsRUFBQSw0QkFBRyxFQUFFO0FBQ3JCLFlBQU0sRUFBQSxnQkFBQyxLQUFLLEVBQUU7QUFDWixjQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUE7QUFDdEMsY0FBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFBO0FBQ3pDLGNBQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFBO0FBQ2pDLG1CQUFXLEVBQUUsQ0FBQTtPQUNkO0FBQ0QsYUFBTyxFQUFBLG1CQUFHLEVBQUU7S0FDYixDQUFBOzs7QUFHRCxjQUFVLENBQUMsb0JBQW9CLEVBQUUsQ0FBQTtBQUNqQyxjQUFVLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUNsRCxjQUFVLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFBO0FBQzVCLFVBQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7R0FDNUIsQ0FBQyxDQUFBO0NBQ0gsQ0FBQyxDQUFBIiwiZmlsZSI6Ii9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvc3BlYy9tYWluLXNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgQXRvbUxpbnRlciBmcm9tICcuLi9saWIvbWFpbidcbmltcG9ydCB7IGdldE1lc3NhZ2UgfSBmcm9tICcuL2NvbW1vbidcblxuZGVzY3JpYmUoJ0F0b20gTGludGVyJywgZnVuY3Rpb24oKSB7XG4gIGxldCBhdG9tTGludGVyXG5cbiAgYmVmb3JlRWFjaChmdW5jdGlvbigpIHtcbiAgICBhdG9tTGludGVyID0gbmV3IEF0b21MaW50ZXIoKVxuICB9KVxuICBhZnRlckVhY2goZnVuY3Rpb24oKSB7XG4gICAgYXRvbUxpbnRlci5kaXNwb3NlKClcbiAgfSlcblxuICBpdCgnZmVlZHMgb2xkIG1lc3NhZ2VzIHRvIG5ld2x5IGFkZGVkIHVpIHByb3ZpZGVycycsIGZ1bmN0aW9uKCkge1xuICAgIGxldCBwYXRjaENhbGxlZCA9IDBcblxuICAgIGNvbnN0IG1lc3NhZ2UgPSBnZXRNZXNzYWdlKHRydWUpXG4gICAgY29uc3QgdWlQcm92aWRlciA9IHtcbiAgICAgIG5hbWU6ICd0ZXN0JyxcbiAgICAgIGRpZEJlZ2luTGludGluZygpIHt9LFxuICAgICAgZGlkRmluaXNoTGludGluZygpIHt9LFxuICAgICAgcmVuZGVyKHBhdGNoKSB7XG4gICAgICAgIGV4cGVjdChwYXRjaC5hZGRlZCkudG9FcXVhbChbbWVzc2FnZV0pXG4gICAgICAgIGV4cGVjdChwYXRjaC5tZXNzYWdlcykudG9FcXVhbChbbWVzc2FnZV0pXG4gICAgICAgIGV4cGVjdChwYXRjaC5yZW1vdmVkKS50b0VxdWFsKFtdKVxuICAgICAgICBwYXRjaENhbGxlZCsrXG4gICAgICB9LFxuICAgICAgZGlzcG9zZSgpIHt9LFxuICAgIH1cbiAgICAvLyBGb3JjZSB0aGUgTWVzc2FnZVJlZ2lzdHJ5IHRvIGluaXRpYWx6ZSwgbm90ZSB0aGF0IHRoaXMgaXMgaGFuZGxlZCB1bmRlclxuICAgIC8vIG5vcm1hbCB1c2FnZSFcbiAgICBhdG9tTGludGVyLnJlZ2lzdHJ5TWVzc2FnZXNJbml0KClcbiAgICBhdG9tTGludGVyLnJlZ2lzdHJ5TWVzc2FnZXMubWVzc2FnZXMucHVzaChtZXNzYWdlKVxuICAgIGF0b21MaW50ZXIuYWRkVUkodWlQcm92aWRlcilcbiAgICBleHBlY3QocGF0Y2hDYWxsZWQpLnRvQmUoMSlcbiAgfSlcbn0pXG4iXX0=