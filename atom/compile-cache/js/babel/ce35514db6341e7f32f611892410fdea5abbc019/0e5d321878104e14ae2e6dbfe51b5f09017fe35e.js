function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libSoftWrapStatus = require('../lib/soft-wrap-status');

var _libSoftWrapStatus2 = _interopRequireDefault(_libSoftWrapStatus);

var _mockEditor = require('./mock-editor');

var _mockEditor2 = _interopRequireDefault(_mockEditor);

'use babel';

describe('SoftWrapStatus', function () {
  var atomEnv = undefined,
      status = undefined;

  beforeEach(function () {
    atomEnv = global.buildAtomEnvironment();
  });

  afterEach(function () {
    atomEnv.destroy();
  });

  describe('when editor is null', function () {
    beforeEach(function () {
      status = new _libSoftWrapStatus2['default'](atomEnv, null);
    });

    it('does not render the indicator', function () {
      expect(status.shouldRenderIndicator()).to.not.be.ok;
    });

    it('does not light the indicator', function () {
      expect(status.shouldBeLit()).to.not.be.ok;
    });

    it('does not raise an exception when attempting to toggle soft wrap', function () {
      status.toggleSoftWrapped();
    });
  });

  describe('when editor is an editor', function () {
    describe('and softWrapped is false', function () {
      var editor = undefined;

      beforeEach(function () {
        editor = new _mockEditor2['default'](false);
        status = new _libSoftWrapStatus2['default'](atomEnv, editor);
      });

      it('renders the indicator', function () {
        expect(status.shouldRenderIndicator()).to.be.ok;
      });

      it('does not light the indicator', function () {
        expect(status.shouldBeLit()).to.not.be.ok;
      });

      it('toggles soft wrap', function () {
        status.toggleSoftWrapped();

        expect(editor.toggled).to.be['true'];
      });
    });

    describe('and softWrapped is true', function () {
      var editor = undefined;

      beforeEach(function () {
        editor = new _mockEditor2['default'](true);
        status = new _libSoftWrapStatus2['default'](atomEnv, editor);
      });

      it('renders the indicator', function () {
        expect(status.shouldRenderIndicator()).to.be.ok;
      });

      it('lights the indicator', function () {
        expect(status.shouldBeLit()).to.be.ok;
      });

      it('toggles soft wrap', function () {
        status.toggleSoftWrapped();

        expect(editor.toggled).to.be['true'];
      });
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9zb2Z0LXdyYXAtaW5kaWNhdG9yL3NwZWMvc29mdC13cmFwLXN0YXR1cy5zcGVjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O2lDQUUyQix5QkFBeUI7Ozs7MEJBRTdCLGVBQWU7Ozs7QUFKdEMsV0FBVyxDQUFBOztBQU1YLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxZQUFZO0FBQ3JDLE1BQUksT0FBTyxZQUFBO01BQUUsTUFBTSxZQUFBLENBQUE7O0FBRW5CLFlBQVUsQ0FBQyxZQUFZO0FBQ3JCLFdBQU8sR0FBRyxNQUFNLENBQUMsb0JBQW9CLEVBQUUsQ0FBQTtHQUN4QyxDQUFDLENBQUE7O0FBRUYsV0FBUyxDQUFDLFlBQVk7QUFDcEIsV0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFBO0dBQ2xCLENBQUMsQ0FBQTs7QUFFRixVQUFRLENBQUMscUJBQXFCLEVBQUUsWUFBWTtBQUMxQyxjQUFVLENBQUMsWUFBWTtBQUNyQixZQUFNLEdBQUcsbUNBQW1CLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQTtLQUMzQyxDQUFDLENBQUE7O0FBRUYsTUFBRSxDQUFDLCtCQUErQixFQUFFLFlBQVk7QUFDOUMsWUFBTSxDQUFDLE1BQU0sQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFBO0tBQ3BELENBQUMsQ0FBQTs7QUFFRixNQUFFLENBQUMsOEJBQThCLEVBQUUsWUFBWTtBQUM3QyxZQUFNLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFBO0tBQzFDLENBQUMsQ0FBQTs7QUFFRixNQUFFLENBQUMsaUVBQWlFLEVBQUUsWUFBWTtBQUNoRixZQUFNLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtLQUMzQixDQUFDLENBQUE7R0FDSCxDQUFDLENBQUE7O0FBRUYsVUFBUSxDQUFDLDBCQUEwQixFQUFFLFlBQVk7QUFDL0MsWUFBUSxDQUFDLDBCQUEwQixFQUFFLFlBQVk7QUFDL0MsVUFBSSxNQUFNLFlBQUEsQ0FBQTs7QUFFVixnQkFBVSxDQUFDLFlBQVk7QUFDckIsY0FBTSxHQUFHLDRCQUFlLEtBQUssQ0FBQyxDQUFBO0FBQzlCLGNBQU0sR0FBRyxtQ0FBbUIsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFBO09BQzdDLENBQUMsQ0FBQTs7QUFFRixRQUFFLENBQUMsdUJBQXVCLEVBQUUsWUFBWTtBQUN0QyxjQUFNLENBQUMsTUFBTSxDQUFDLHFCQUFxQixFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQTtPQUNoRCxDQUFDLENBQUE7O0FBRUYsUUFBRSxDQUFDLDhCQUE4QixFQUFFLFlBQVk7QUFDN0MsY0FBTSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQTtPQUMxQyxDQUFDLENBQUE7O0FBRUYsUUFBRSxDQUFDLG1CQUFtQixFQUFFLFlBQVk7QUFDbEMsY0FBTSxDQUFDLGlCQUFpQixFQUFFLENBQUE7O0FBRTFCLGNBQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsUUFBSyxDQUFBO09BQ2xDLENBQUMsQ0FBQTtLQUNILENBQUMsQ0FBQTs7QUFFRixZQUFRLENBQUMseUJBQXlCLEVBQUUsWUFBWTtBQUM5QyxVQUFJLE1BQU0sWUFBQSxDQUFBOztBQUVWLGdCQUFVLENBQUMsWUFBWTtBQUNyQixjQUFNLEdBQUcsNEJBQWUsSUFBSSxDQUFDLENBQUE7QUFDN0IsY0FBTSxHQUFHLG1DQUFtQixPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUE7T0FDN0MsQ0FBQyxDQUFBOztBQUVGLFFBQUUsQ0FBQyx1QkFBdUIsRUFBRSxZQUFZO0FBQ3RDLGNBQU0sQ0FBQyxNQUFNLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFBO09BQ2hELENBQUMsQ0FBQTs7QUFFRixRQUFFLENBQUMsc0JBQXNCLEVBQUUsWUFBWTtBQUNyQyxjQUFNLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUE7T0FDdEMsQ0FBQyxDQUFBOztBQUVGLFFBQUUsQ0FBQyxtQkFBbUIsRUFBRSxZQUFZO0FBQ2xDLGNBQU0sQ0FBQyxpQkFBaUIsRUFBRSxDQUFBOztBQUUxQixjQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLFFBQUssQ0FBQTtPQUNsQyxDQUFDLENBQUE7S0FDSCxDQUFDLENBQUE7R0FDSCxDQUFDLENBQUE7Q0FDSCxDQUFDLENBQUEiLCJmaWxlIjoiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3NvZnQtd3JhcC1pbmRpY2F0b3Ivc3BlYy9zb2Z0LXdyYXAtc3RhdHVzLnNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQgU29mdFdyYXBTdGF0dXMgZnJvbSAnLi4vbGliL3NvZnQtd3JhcC1zdGF0dXMnXG5cbmltcG9ydCBNb2NrRWRpdG9yIGZyb20gJy4vbW9jay1lZGl0b3InXG5cbmRlc2NyaWJlKCdTb2Z0V3JhcFN0YXR1cycsIGZ1bmN0aW9uICgpIHtcbiAgbGV0IGF0b21FbnYsIHN0YXR1c1xuXG4gIGJlZm9yZUVhY2goZnVuY3Rpb24gKCkge1xuICAgIGF0b21FbnYgPSBnbG9iYWwuYnVpbGRBdG9tRW52aXJvbm1lbnQoKVxuICB9KVxuXG4gIGFmdGVyRWFjaChmdW5jdGlvbiAoKSB7XG4gICAgYXRvbUVudi5kZXN0cm95KClcbiAgfSlcblxuICBkZXNjcmliZSgnd2hlbiBlZGl0b3IgaXMgbnVsbCcsIGZ1bmN0aW9uICgpIHtcbiAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHN0YXR1cyA9IG5ldyBTb2Z0V3JhcFN0YXR1cyhhdG9tRW52LCBudWxsKVxuICAgIH0pXG5cbiAgICBpdCgnZG9lcyBub3QgcmVuZGVyIHRoZSBpbmRpY2F0b3InLCBmdW5jdGlvbiAoKSB7XG4gICAgICBleHBlY3Qoc3RhdHVzLnNob3VsZFJlbmRlckluZGljYXRvcigpKS50by5ub3QuYmUub2tcbiAgICB9KVxuXG4gICAgaXQoJ2RvZXMgbm90IGxpZ2h0IHRoZSBpbmRpY2F0b3InLCBmdW5jdGlvbiAoKSB7XG4gICAgICBleHBlY3Qoc3RhdHVzLnNob3VsZEJlTGl0KCkpLnRvLm5vdC5iZS5va1xuICAgIH0pXG5cbiAgICBpdCgnZG9lcyBub3QgcmFpc2UgYW4gZXhjZXB0aW9uIHdoZW4gYXR0ZW1wdGluZyB0byB0b2dnbGUgc29mdCB3cmFwJywgZnVuY3Rpb24gKCkge1xuICAgICAgc3RhdHVzLnRvZ2dsZVNvZnRXcmFwcGVkKClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCd3aGVuIGVkaXRvciBpcyBhbiBlZGl0b3InLCBmdW5jdGlvbiAoKSB7XG4gICAgZGVzY3JpYmUoJ2FuZCBzb2Z0V3JhcHBlZCBpcyBmYWxzZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGxldCBlZGl0b3JcblxuICAgICAgYmVmb3JlRWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGVkaXRvciA9IG5ldyBNb2NrRWRpdG9yKGZhbHNlKVxuICAgICAgICBzdGF0dXMgPSBuZXcgU29mdFdyYXBTdGF0dXMoYXRvbUVudiwgZWRpdG9yKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3JlbmRlcnMgdGhlIGluZGljYXRvcicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZXhwZWN0KHN0YXR1cy5zaG91bGRSZW5kZXJJbmRpY2F0b3IoKSkudG8uYmUub2tcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdkb2VzIG5vdCBsaWdodCB0aGUgaW5kaWNhdG9yJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBleHBlY3Qoc3RhdHVzLnNob3VsZEJlTGl0KCkpLnRvLm5vdC5iZS5va1xuICAgICAgfSlcblxuICAgICAgaXQoJ3RvZ2dsZXMgc29mdCB3cmFwJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBzdGF0dXMudG9nZ2xlU29mdFdyYXBwZWQoKVxuXG4gICAgICAgIGV4cGVjdChlZGl0b3IudG9nZ2xlZCkudG8uYmUudHJ1ZVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ2FuZCBzb2Z0V3JhcHBlZCBpcyB0cnVlJywgZnVuY3Rpb24gKCkge1xuICAgICAgbGV0IGVkaXRvclxuXG4gICAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZWRpdG9yID0gbmV3IE1vY2tFZGl0b3IodHJ1ZSlcbiAgICAgICAgc3RhdHVzID0gbmV3IFNvZnRXcmFwU3RhdHVzKGF0b21FbnYsIGVkaXRvcilcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdyZW5kZXJzIHRoZSBpbmRpY2F0b3InLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGV4cGVjdChzdGF0dXMuc2hvdWxkUmVuZGVySW5kaWNhdG9yKCkpLnRvLmJlLm9rXG4gICAgICB9KVxuXG4gICAgICBpdCgnbGlnaHRzIHRoZSBpbmRpY2F0b3InLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGV4cGVjdChzdGF0dXMuc2hvdWxkQmVMaXQoKSkudG8uYmUub2tcbiAgICAgIH0pXG5cbiAgICAgIGl0KCd0b2dnbGVzIHNvZnQgd3JhcCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc3RhdHVzLnRvZ2dsZVNvZnRXcmFwcGVkKClcblxuICAgICAgICBleHBlY3QoZWRpdG9yLnRvZ2dsZWQpLnRvLmJlLnRydWVcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=
//# sourceURL=/Users/ah/.atom/packages/soft-wrap-indicator/spec/soft-wrap-status.spec.js
