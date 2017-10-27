function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libUiRegistry = require('../lib/ui-registry');

var _libUiRegistry2 = _interopRequireDefault(_libUiRegistry);

var uiRegistry = undefined;
var uiProvider = undefined;

describe('UI Registry', function () {
  beforeEach(function () {
    if (uiRegistry) {
      uiRegistry.dispose();
    }
    uiRegistry = new _libUiRegistry2['default']();
    uiProvider = {
      name: 'Test',
      render: jasmine.createSpy('ui.didCalculateMessages'),
      didBeginLinting: jasmine.createSpy('ui.didBeginLinting'),
      didFinishLinting: jasmine.createSpy('ui.didFinishLinting'),
      dispose: jasmine.createSpy('ui.dispose')
    };
  });

  it('works in a lifecycle', function () {
    var testObjA = {};
    var testObjB = {};
    var testObjC = {};

    uiRegistry.add(uiProvider);

    uiRegistry.render(testObjA);
    expect(uiProvider.render).toHaveBeenCalledWith(testObjA);

    uiRegistry.didBeginLinting(testObjB);
    expect(uiProvider.didBeginLinting.mostRecentCall.args[0]).toBe(testObjB);
    expect(uiProvider.didBeginLinting.mostRecentCall.args[1]).toBe(null);

    uiRegistry.didFinishLinting(testObjC);
    expect(uiProvider.didFinishLinting.mostRecentCall.args[0]).toBe(testObjC);
    expect(uiProvider.didFinishLinting.mostRecentCall.args[1]).toBe(null);

    uiRegistry.dispose();
    expect(uiProvider.dispose).toHaveBeenCalled();
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvc3BlYy91aS1yZWdpc3RyeS1zcGVjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OzZCQUV1QixvQkFBb0I7Ozs7QUFFM0MsSUFBSSxVQUFVLFlBQUEsQ0FBQTtBQUNkLElBQUksVUFBa0IsWUFBQSxDQUFBOztBQUV0QixRQUFRLENBQUMsYUFBYSxFQUFFLFlBQVc7QUFDakMsWUFBVSxDQUFDLFlBQVc7QUFDcEIsUUFBSSxVQUFVLEVBQUU7QUFDZCxnQkFBVSxDQUFDLE9BQU8sRUFBRSxDQUFBO0tBQ3JCO0FBQ0QsY0FBVSxHQUFHLGdDQUFnQixDQUFBO0FBQzdCLGNBQVUsR0FBRztBQUNYLFVBQUksRUFBRSxNQUFNO0FBQ1osWUFBTSxFQUFFLE9BQU8sQ0FBQyxTQUFTLENBQUMseUJBQXlCLENBQUM7QUFDcEQscUJBQWUsRUFBRSxPQUFPLENBQUMsU0FBUyxDQUFDLG9CQUFvQixDQUFDO0FBQ3hELHNCQUFnQixFQUFFLE9BQU8sQ0FBQyxTQUFTLENBQUMscUJBQXFCLENBQUM7QUFDMUQsYUFBTyxFQUFFLE9BQU8sQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDO0tBQ3pDLENBQUE7R0FDRixDQUFDLENBQUE7O0FBRUYsSUFBRSxDQUFDLHNCQUFzQixFQUFFLFlBQVc7QUFDcEMsUUFBTSxRQUFnQixHQUFHLEVBQUUsQ0FBQTtBQUMzQixRQUFNLFFBQWdCLEdBQUcsRUFBRSxDQUFBO0FBQzNCLFFBQU0sUUFBZ0IsR0FBRyxFQUFFLENBQUE7O0FBRTNCLGNBQVUsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUE7O0FBRTFCLGNBQVUsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUE7QUFDM0IsVUFBTSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLENBQUMsQ0FBQTs7QUFFeEQsY0FBVSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUNwQyxVQUFNLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQ3hFLFVBQU0sQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7O0FBRXBFLGNBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUNyQyxVQUFNLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7QUFDekUsVUFBTSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBOztBQUVyRSxjQUFVLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDcEIsVUFBTSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFBO0dBQzlDLENBQUMsQ0FBQTtDQUNILENBQUMsQ0FBQSIsImZpbGUiOiIvVXNlcnMvYWgvLmF0b20vcGFja2FnZXMvbGludGVyL3NwZWMvdWktcmVnaXN0cnktc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCBVSVJlZ2lzdHJ5IGZyb20gJy4uL2xpYi91aS1yZWdpc3RyeSdcblxubGV0IHVpUmVnaXN0cnlcbmxldCB1aVByb3ZpZGVyOiBPYmplY3RcblxuZGVzY3JpYmUoJ1VJIFJlZ2lzdHJ5JywgZnVuY3Rpb24oKSB7XG4gIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XG4gICAgaWYgKHVpUmVnaXN0cnkpIHtcbiAgICAgIHVpUmVnaXN0cnkuZGlzcG9zZSgpXG4gICAgfVxuICAgIHVpUmVnaXN0cnkgPSBuZXcgVUlSZWdpc3RyeSgpXG4gICAgdWlQcm92aWRlciA9IHtcbiAgICAgIG5hbWU6ICdUZXN0JyxcbiAgICAgIHJlbmRlcjogamFzbWluZS5jcmVhdGVTcHkoJ3VpLmRpZENhbGN1bGF0ZU1lc3NhZ2VzJyksXG4gICAgICBkaWRCZWdpbkxpbnRpbmc6IGphc21pbmUuY3JlYXRlU3B5KCd1aS5kaWRCZWdpbkxpbnRpbmcnKSxcbiAgICAgIGRpZEZpbmlzaExpbnRpbmc6IGphc21pbmUuY3JlYXRlU3B5KCd1aS5kaWRGaW5pc2hMaW50aW5nJyksXG4gICAgICBkaXNwb3NlOiBqYXNtaW5lLmNyZWF0ZVNweSgndWkuZGlzcG9zZScpLFxuICAgIH1cbiAgfSlcblxuICBpdCgnd29ya3MgaW4gYSBsaWZlY3ljbGUnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCB0ZXN0T2JqQTogT2JqZWN0ID0ge31cbiAgICBjb25zdCB0ZXN0T2JqQjogT2JqZWN0ID0ge31cbiAgICBjb25zdCB0ZXN0T2JqQzogT2JqZWN0ID0ge31cblxuICAgIHVpUmVnaXN0cnkuYWRkKHVpUHJvdmlkZXIpXG5cbiAgICB1aVJlZ2lzdHJ5LnJlbmRlcih0ZXN0T2JqQSlcbiAgICBleHBlY3QodWlQcm92aWRlci5yZW5kZXIpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHRlc3RPYmpBKVxuXG4gICAgdWlSZWdpc3RyeS5kaWRCZWdpbkxpbnRpbmcodGVzdE9iakIpXG4gICAgZXhwZWN0KHVpUHJvdmlkZXIuZGlkQmVnaW5MaW50aW5nLm1vc3RSZWNlbnRDYWxsLmFyZ3NbMF0pLnRvQmUodGVzdE9iakIpXG4gICAgZXhwZWN0KHVpUHJvdmlkZXIuZGlkQmVnaW5MaW50aW5nLm1vc3RSZWNlbnRDYWxsLmFyZ3NbMV0pLnRvQmUobnVsbClcblxuICAgIHVpUmVnaXN0cnkuZGlkRmluaXNoTGludGluZyh0ZXN0T2JqQylcbiAgICBleHBlY3QodWlQcm92aWRlci5kaWRGaW5pc2hMaW50aW5nLm1vc3RSZWNlbnRDYWxsLmFyZ3NbMF0pLnRvQmUodGVzdE9iakMpXG4gICAgZXhwZWN0KHVpUHJvdmlkZXIuZGlkRmluaXNoTGludGluZy5tb3N0UmVjZW50Q2FsbC5hcmdzWzFdKS50b0JlKG51bGwpXG5cbiAgICB1aVJlZ2lzdHJ5LmRpc3Bvc2UoKVxuICAgIGV4cGVjdCh1aVByb3ZpZGVyLmRpc3Bvc2UpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICB9KVxufSlcbiJdfQ==