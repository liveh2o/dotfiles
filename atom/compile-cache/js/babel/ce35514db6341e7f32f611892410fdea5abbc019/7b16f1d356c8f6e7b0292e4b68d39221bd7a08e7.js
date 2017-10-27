function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _etch = require('etch');

var _etch2 = _interopRequireDefault(_etch);

var _mockSoftWrapStatus = require('./mock-soft-wrap-status');

var _mockSoftWrapStatus2 = _interopRequireDefault(_mockSoftWrapStatus);

var _libSoftWrapStatusComponent = require('../lib/soft-wrap-status-component');

var _libSoftWrapStatusComponent2 = _interopRequireDefault(_libSoftWrapStatusComponent);

var _etchSynchronousScheduler = require('./etch-synchronous-scheduler');

var _etchSynchronousScheduler2 = _interopRequireDefault(_etchSynchronousScheduler);

'use babel';

describe('SoftWrapStatusComponent', function () {
  var component = undefined,
      model = undefined,
      previousScheduler = undefined;

  beforeEach(function () {
    previousScheduler = _etch2['default'].getScheduler();
    _etch2['default'].setScheduler(new _etchSynchronousScheduler2['default']());
  });

  afterEach(function () {
    _etch2['default'].setScheduler(previousScheduler);
  });

  describe('when shouldRenderIndicator is false', function () {
    beforeEach(function () {
      model = new _mockSoftWrapStatus2['default'](false, false);
      component = new _libSoftWrapStatusComponent2['default'](model);
      component.update();
    });

    it('renders the component', function () {
      expect(component.element.classList.contains('soft-wrap-status-component')).to.be['true'];
    });

    it('does not render the indicator', function () {
      expect(component.element.querySelector('a.soft-wrap-indicator')).to.be['null'];
    });

    it('does not toggle the soft wrap when clicked', function () {
      component.element.click();

      expect(model.toggled).to.be['false'];
    });
  });

  describe('when shouldRenderIndicator is true', function () {
    beforeEach(function () {
      model = new _mockSoftWrapStatus2['default'](true, false);
      component = new _libSoftWrapStatusComponent2['default'](model);
      component.update();
    });

    it('renders the component', function () {
      expect(component.element.classList.contains('soft-wrap-status-component')).to.be['true'];
    });

    describe('the indicator', function () {
      var indicator = undefined;

      beforeEach(function () {
        indicator = component.element.querySelector('a.soft-wrap-indicator');
      });

      it('is unlit', function () {
        expect(indicator).to.be.ok;
        expect(indicator.classList.contains('lit')).to.be['false'];
      });

      it('toggles the soft wrap when clicked', function () {
        indicator.click();

        expect(model.toggled).to.be['true'];
      });
    });
  });

  describe('when shouldRenderIndicator and shouldBeLit are both true', function () {
    beforeEach(function () {
      model = new _mockSoftWrapStatus2['default'](true, true);
      component = new _libSoftWrapStatusComponent2['default'](model);
      component.update();
    });

    it('renders the component', function () {
      expect(component.element.classList.contains('soft-wrap-status-component')).to.be['true'];
    });

    describe('the indicator', function () {
      beforeEach(function () {
        indicator = component.element.querySelector('a.soft-wrap-indicator');
      });

      it('is lit', function () {
        expect(indicator).to.be.ok;
        expect(indicator.classList.contains('lit')).to.be['true'];
      });

      it('toggles the soft wrap when clicked', function () {
        indicator.click();

        expect(model.toggled).to.be['true'];
      });
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9zb2Z0LXdyYXAtaW5kaWNhdG9yL3NwZWMvc29mdC13cmFwLXN0YXR1cy1jb21wb25lbnQuc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztvQkFFaUIsTUFBTTs7OztrQ0FFUSx5QkFBeUI7Ozs7MENBQ3BCLG1DQUFtQzs7Ozt3Q0FDdEMsOEJBQThCOzs7O0FBTi9ELFdBQVcsQ0FBQTs7QUFRWCxRQUFRLENBQUMseUJBQXlCLEVBQUUsWUFBWTtBQUM5QyxNQUFJLFNBQVMsWUFBQTtNQUFFLEtBQUssWUFBQTtNQUFFLGlCQUFpQixZQUFBLENBQUE7O0FBRXZDLFlBQVUsQ0FBQyxZQUFZO0FBQ3JCLHFCQUFpQixHQUFHLGtCQUFLLFlBQVksRUFBRSxDQUFBO0FBQ3ZDLHNCQUFLLFlBQVksQ0FBQywyQ0FBMEIsQ0FBQyxDQUFBO0dBQzlDLENBQUMsQ0FBQTs7QUFFRixXQUFTLENBQUMsWUFBWTtBQUNwQixzQkFBSyxZQUFZLENBQUMsaUJBQWlCLENBQUMsQ0FBQTtHQUNyQyxDQUFDLENBQUE7O0FBRUYsVUFBUSxDQUFDLHFDQUFxQyxFQUFFLFlBQVk7QUFDMUQsY0FBVSxDQUFDLFlBQVk7QUFDckIsV0FBSyxHQUFHLG9DQUF1QixLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUE7QUFDNUMsZUFBUyxHQUFHLDRDQUE0QixLQUFLLENBQUMsQ0FBQTtBQUM5QyxlQUFTLENBQUMsTUFBTSxFQUFFLENBQUE7S0FDbkIsQ0FBQyxDQUFBOztBQUVGLE1BQUUsQ0FBQyx1QkFBdUIsRUFBRSxZQUFZO0FBQ3RDLFlBQU0sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsNEJBQTRCLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLFFBQUssQ0FBQTtLQUN0RixDQUFDLENBQUE7O0FBRUYsTUFBRSxDQUFDLCtCQUErQixFQUFFLFlBQVk7QUFDOUMsWUFBTSxDQUFDLFNBQVMsQ0FBQyxP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O0FBRUYsUUFBRSxDQUFDLG9DQUFvQyxFQUFFLFlBQVk7QUFDbkQsaUJBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQTs7QUFFakIsY0FBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxRQUFLLENBQUE7T0FDakMsQ0FBQyxDQUFBO0tBQ0gsQ0FBQyxDQUFBO0dBQ0gsQ0FBQyxDQUFBO0NBQ0gsQ0FBQyxDQUFBIiwiZmlsZSI6Ii9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9zb2Z0LXdyYXAtaW5kaWNhdG9yL3NwZWMvc29mdC13cmFwLXN0YXR1cy1jb21wb25lbnQuc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCBldGNoIGZyb20gJ2V0Y2gnXG5cbmltcG9ydCBNb2NrU29mdFdyYXBTdGF0dXMgZnJvbSAnLi9tb2NrLXNvZnQtd3JhcC1zdGF0dXMnXG5pbXBvcnQgU29mdFdyYXBTdGF0dXNDb21wb25lbnQgZnJvbSAnLi4vbGliL3NvZnQtd3JhcC1zdGF0dXMtY29tcG9uZW50J1xuaW1wb3J0IFN5bmNocm9ub3VzU2NoZWR1bGVyIGZyb20gJy4vZXRjaC1zeW5jaHJvbm91cy1zY2hlZHVsZXInXG5cbmRlc2NyaWJlKCdTb2Z0V3JhcFN0YXR1c0NvbXBvbmVudCcsIGZ1bmN0aW9uICgpIHtcbiAgbGV0IGNvbXBvbmVudCwgbW9kZWwsIHByZXZpb3VzU2NoZWR1bGVyXG5cbiAgYmVmb3JlRWFjaChmdW5jdGlvbiAoKSB7XG4gICAgcHJldmlvdXNTY2hlZHVsZXIgPSBldGNoLmdldFNjaGVkdWxlcigpXG4gICAgZXRjaC5zZXRTY2hlZHVsZXIobmV3IFN5bmNocm9ub3VzU2NoZWR1bGVyKCkpXG4gIH0pXG5cbiAgYWZ0ZXJFYWNoKGZ1bmN0aW9uICgpIHtcbiAgICBldGNoLnNldFNjaGVkdWxlcihwcmV2aW91c1NjaGVkdWxlcilcbiAgfSlcblxuICBkZXNjcmliZSgnd2hlbiBzaG91bGRSZW5kZXJJbmRpY2F0b3IgaXMgZmFsc2UnLCBmdW5jdGlvbiAoKSB7XG4gICAgYmVmb3JlRWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICBtb2RlbCA9IG5ldyBNb2NrU29mdFdyYXBTdGF0dXMoZmFsc2UsIGZhbHNlKVxuICAgICAgY29tcG9uZW50ID0gbmV3IFNvZnRXcmFwU3RhdHVzQ29tcG9uZW50KG1vZGVsKVxuICAgICAgY29tcG9uZW50LnVwZGF0ZSgpXG4gICAgfSlcblxuICAgIGl0KCdyZW5kZXJzIHRoZSBjb21wb25lbnQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBleHBlY3QoY29tcG9uZW50LmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdzb2Z0LXdyYXAtc3RhdHVzLWNvbXBvbmVudCcpKS50by5iZS50cnVlXG4gICAgfSlcblxuICAgIGl0KCdkb2VzIG5vdCByZW5kZXIgdGhlIGluZGljYXRvcicsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGV4cGVjdChjb21wb25lbnQuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdhLnNvZnQtd3JhcC1pbmRpY2F0b3InKSkudG8uYmUubnVsbFxuICAgIH0pXG5cbiAgICBpdCgnZG9lcyBub3QgdG9nZ2xlIHRoZSBzb2Z0IHdyYXAgd2hlbiBjbGlja2VkJywgZnVuY3Rpb24gKCkge1xuICAgICAgY29tcG9uZW50LmVsZW1lbnQuY2xpY2soKVxuXG4gICAgICBleHBlY3QobW9kZWwudG9nZ2xlZCkudG8uYmUuZmFsc2VcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCd3aGVuIHNob3VsZFJlbmRlckluZGljYXRvciBpcyB0cnVlJywgZnVuY3Rpb24gKCkge1xuICAgIGJlZm9yZUVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgbW9kZWwgPSBuZXcgTW9ja1NvZnRXcmFwU3RhdHVzKHRydWUsIGZhbHNlKVxuICAgICAgY29tcG9uZW50ID0gbmV3IFNvZnRXcmFwU3RhdHVzQ29tcG9uZW50KG1vZGVsKVxuICAgICAgY29tcG9uZW50LnVwZGF0ZSgpXG4gICAgfSlcblxuICAgIGl0KCdyZW5kZXJzIHRoZSBjb21wb25lbnQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBleHBlY3QoY29tcG9uZW50LmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdzb2Z0LXdyYXAtc3RhdHVzLWNvbXBvbmVudCcpKS50by5iZS50cnVlXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCd0aGUgaW5kaWNhdG9yJywgZnVuY3Rpb24gKCkge1xuICAgICAgbGV0IGluZGljYXRvclxuXG4gICAgICBiZWZvcmVFYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaW5kaWNhdG9yID0gY29tcG9uZW50LmVsZW1lbnQucXVlcnlTZWxlY3RvcignYS5zb2Z0LXdyYXAtaW5kaWNhdG9yJylcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdpcyB1bmxpdCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZXhwZWN0KGluZGljYXRvcikudG8uYmUub2tcbiAgICAgICAgZXhwZWN0KGluZGljYXRvci5jbGFzc0xpc3QuY29udGFpbnMoJ2xpdCcpKS50by5iZS5mYWxzZVxuICAgICAgfSlcblxuICAgICAgaXQoJ3RvZ2dsZXMgdGhlIHNvZnQgd3JhcCB3aGVuIGNsaWNrZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGluZGljYXRvci5jbGljaygpXG5cbiAgICAgICAgZXhwZWN0KG1vZGVsLnRvZ2dsZWQpLnRvLmJlLnRydWVcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnd2hlbiBzaG91bGRSZW5kZXJJbmRpY2F0b3IgYW5kIHNob3VsZEJlTGl0IGFyZSBib3RoIHRydWUnLCBmdW5jdGlvbiAoKSB7XG4gICAgYmVmb3JlRWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICBtb2RlbCA9IG5ldyBNb2NrU29mdFdyYXBTdGF0dXModHJ1ZSwgdHJ1ZSlcbiAgICAgIGNvbXBvbmVudCA9IG5ldyBTb2Z0V3JhcFN0YXR1c0NvbXBvbmVudChtb2RlbClcbiAgICAgIGNvbXBvbmVudC51cGRhdGUoKVxuICAgIH0pXG5cbiAgICBpdCgncmVuZGVycyB0aGUgY29tcG9uZW50JywgZnVuY3Rpb24gKCkge1xuICAgICAgZXhwZWN0KGNvbXBvbmVudC5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnc29mdC13cmFwLXN0YXR1cy1jb21wb25lbnQnKSkudG8uYmUudHJ1ZVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgndGhlIGluZGljYXRvcicsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGJlZm9yZUVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICBpbmRpY2F0b3IgPSBjb21wb25lbnQuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdhLnNvZnQtd3JhcC1pbmRpY2F0b3InKVxuICAgICAgfSlcblxuICAgICAgaXQoJ2lzIGxpdCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZXhwZWN0KGluZGljYXRvcikudG8uYmUub2tcbiAgICAgICAgZXhwZWN0KGluZGljYXRvci5jbGFzc0xpc3QuY29udGFpbnMoJ2xpdCcpKS50by5iZS50cnVlXG4gICAgICB9KVxuXG4gICAgICBpdCgndG9nZ2xlcyB0aGUgc29mdCB3cmFwIHdoZW4gY2xpY2tlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaW5kaWNhdG9yLmNsaWNrKClcblxuICAgICAgICBleHBlY3QobW9kZWwudG9nZ2xlZCkudG8uYmUudHJ1ZVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==
//# sourceURL=/Users/ah/.atom/packages/soft-wrap-indicator/spec/soft-wrap-status-component.spec.js
