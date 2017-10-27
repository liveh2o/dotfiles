function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

/** @babel */
/* global beforeEach, afterEach, describe, it */

var _libWelcomePackage = require('../lib/welcome-package');

var _libWelcomePackage2 = _interopRequireDefault(_libWelcomePackage);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _helpers = require('./helpers');

describe('Welcome', function () {
  var welcomePackage = undefined;

  beforeEach(function () {
    welcomePackage = new _libWelcomePackage2['default']();
    atom.config.set('welcome.showOnStartup', true);
  });

  afterEach(function () {
    atom.reset();
  });

  describe("when `core.telemetryConsent` is 'undecided'", function () {
    beforeEach(_asyncToGenerator(function* () {
      atom.config.set('core.telemetryConsent', 'undecided');
      yield welcomePackage.activate();
    }));

    it('opens the telemetry consent pane and the welcome panes', function () {
      var panes = atom.workspace.getCenter().getPanes();
      _assert2['default'].equal(panes.length, 2);
      _assert2['default'].equal(panes[0].getItems()[0].getTitle(), 'Telemetry Consent');
      _assert2['default'].equal(panes[0].getItems()[1].getTitle(), 'Welcome');
      _assert2['default'].equal(panes[1].getItems()[0].getTitle(), 'Welcome Guide');
    });
  });

  describe('when `core.telemetryConsent` is not `undecided`', function () {
    beforeEach(_asyncToGenerator(function* () {
      atom.config.set('core.telemetryConsent', 'no');
      yield welcomePackage.activate();
    }));

    describe('when activated for the first time', function () {
      return it('shows the welcome panes', function () {
        var panes = atom.workspace.getCenter().getPanes();
        _assert2['default'].equal(panes.length, 2);
        _assert2['default'].equal(panes[0].getItems()[0].getTitle(), 'Welcome');
        _assert2['default'].equal(panes[1].getItems()[0].getTitle(), 'Welcome Guide');
      });
    });

    describe('the welcome:show command', function () {
      it('shows the welcome buffer', _asyncToGenerator(function* () {
        atom.workspace.getCenter().getPanes().map(function (pane) {
          return pane.destroy();
        });
        (0, _assert2['default'])(!atom.workspace.getActivePaneItem());

        var workspaceElement = atom.views.getView(atom.workspace);
        atom.commands.dispatch(workspaceElement, 'welcome:show');

        yield (0, _helpers.conditionPromise)(function () {
          return atom.workspace.getActivePaneItem();
        });

        var panes = atom.workspace.getCenter().getPanes();
        _assert2['default'].equal(panes.length, 2);
        _assert2['default'].equal(panes[0].getItems()[0].getTitle(), 'Welcome');
      }));
    });

    describe('deserializing the pane items', function () {
      describe('when GuideView is deserialized', function () {
        it('remembers open sections', function () {
          var panes = atom.workspace.getCenter().getPanes();
          var guideView = panes[1].getItems()[0];

          guideView.element.querySelector('details[data-section="snippets"]').setAttribute('open', 'open');
          guideView.element.querySelector('details[data-section="init-script"]').setAttribute('open', 'open');

          var state = guideView.serialize();

          _assert2['default'].deepEqual(state.openSections, ['init-script', 'snippets']);

          var newGuideView = welcomePackage.createGuideView(state);
          (0, _assert2['default'])(!newGuideView.element.querySelector('details[data-section="packages"]').hasAttribute('open'));
          (0, _assert2['default'])(newGuideView.element.querySelector('details[data-section="snippets"]').hasAttribute('open'));
          (0, _assert2['default'])(newGuideView.element.querySelector('details[data-section="init-script"]').hasAttribute('open'));
        });
      });
    });

    describe('reporting events', function () {
      var panes = undefined,
          guideView = undefined,
          reportedEvents = undefined;
      beforeEach(function () {
        panes = atom.workspace.getCenter().getPanes();
        guideView = panes[1].getItems()[0];
        reportedEvents = [];

        welcomePackage.reporterProxy.sendEvent = function () {
          for (var _len = arguments.length, event = Array(_len), _key = 0; _key < _len; _key++) {
            event[_key] = arguments[_key];
          }

          reportedEvents.push(event);
        };
      });

      describe('GuideView events', function () {
        it('captures expand and collapse events', function () {
          guideView.element.querySelector('details[data-section="packages"] summary').click();
          _assert2['default'].deepEqual(reportedEvents, [['expand-packages-section']]);

          guideView.element.querySelector('details[data-section="packages"]').setAttribute('open', 'open');
          guideView.element.querySelector('details[data-section="packages"] summary').click();
          _assert2['default'].deepEqual(reportedEvents, [['expand-packages-section'], ['collapse-packages-section']]);
        });

        it('captures button events', function () {
          for (var detailElement of Array.from(guideView.element.querySelector('details'))) {
            reportedEvents.length = 0;

            var sectionName = detailElement.dataset.section;
            var eventName = 'clicked-' + sectionName + '-cta';
            var primaryButton = detailElement.querySelector('.btn-primary');
            if (primaryButton) {
              primaryButton.click();
              _assert2['default'].deepEqual(reportedEvents, [[eventName]]);
            }
          }
        });
      });
    });

    describe('when the reporter changes', function () {
      return it('sends all queued events', function () {
        welcomePackage.reporterProxy.queue.length = 0;

        var reporter1 = { sendEvent: function sendEvent() {
            for (var _len2 = arguments.length, event = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
              event[_key2] = arguments[_key2];
            }

            this.reportedEvents.push(event);
          }, reportedEvents: [] };
        var reporter2 = { sendEvent: function sendEvent() {
            for (var _len3 = arguments.length, event = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
              event[_key3] = arguments[_key3];
            }

            this.reportedEvents.push(event);
          }, reportedEvents: [] };

        welcomePackage.reporterProxy.sendEvent('foo', 'bar', 'baz');
        welcomePackage.reporterProxy.sendEvent('foo2', 'bar2', 'baz2');
        welcomePackage.reporterProxy.setReporter(reporter1);

        _assert2['default'].deepEqual(reporter1.reportedEvents, [['welcome-v1', 'foo', 'bar', 'baz'], ['welcome-v1', 'foo2', 'bar2', 'baz2']]);

        welcomePackage.consumeReporter(reporter2);

        _assert2['default'].deepEqual(reporter2.reportedEvents, []);
      });
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy93ZWxjb21lL3Rlc3Qvd2VsY29tZS50ZXN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7aUNBRzJCLHdCQUF3Qjs7OztzQkFDaEMsUUFBUTs7Ozt1QkFDSSxXQUFXOztBQUUxQyxRQUFRLENBQUMsU0FBUyxFQUFFLFlBQU07QUFDeEIsTUFBSSxjQUFjLFlBQUEsQ0FBQTs7QUFFbEIsWUFBVSxDQUFDLFlBQU07QUFDZixrQkFBYyxHQUFHLG9DQUFvQixDQUFBO0FBQ3JDLFFBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHVCQUF1QixFQUFFLElBQUksQ0FBQyxDQUFBO0dBQy9DLENBQUMsQ0FBQTs7QUFFRixXQUFTLENBQUMsWUFBTTtBQUNkLFFBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQTtHQUNiLENBQUMsQ0FBQTs7QUFFRixVQUFRLENBQUMsNkNBQTZDLEVBQUUsWUFBTTtBQUM1RCxjQUFVLG1CQUFDLGFBQVk7QUFDckIsVUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLEVBQUUsV0FBVyxDQUFDLENBQUE7QUFDckQsWUFBTSxjQUFjLENBQUMsUUFBUSxFQUFFLENBQUE7S0FDaEMsRUFBQyxDQUFBOztBQUVGLE1BQUUsQ0FBQyx3REFBd0QsRUFBRSxZQUFNO0FBQ2pFLFVBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUE7QUFDbkQsMEJBQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUE7QUFDN0IsMEJBQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxtQkFBbUIsQ0FBQyxDQUFBO0FBQ3BFLDBCQUFPLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxF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QUFFLEtBQUssRUFBRSxLQUFLLENBQUMsRUFDbkMsQ0FBQyxZQUFZLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FDdkMsQ0FBQyxDQUFBOztBQUVGLHNCQUFjLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFBOztBQUV6Qyw0QkFBTyxTQUFTLENBQUMsU0FBUyxDQUFDLGNBQWMsRUFBRSxFQUFFLENBQUMsQ0FBQTtPQUMvQyxDQUFDO0tBQUEsQ0FDSCxDQUFBO0dBQ0YsQ0FBQyxDQUFBO0NBQ0gsQ0FBQyxDQUFBIiwiZmlsZSI6Ii9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy93ZWxjb21lL3Rlc3Qvd2VsY29tZS50ZXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuLyogZ2xvYmFsIGJlZm9yZUVhY2gsIGFmdGVyRWFjaCwgZGVzY3JpYmUsIGl0ICovXG5cbmltcG9ydCBXZWxjb21lUGFja2FnZSBmcm9tICcuLi9saWIvd2VsY29tZS1wYWNrYWdlJ1xuaW1wb3J0IGFzc2VydCBmcm9tICdhc3NlcnQnXG5pbXBvcnQge2NvbmRpdGlvblByb21pc2V9IGZyb20gJy4vaGVscGVycydcblxuZGVzY3JpYmUoJ1dlbGNvbWUnLCAoKSA9PiB7XG4gIGxldCB3ZWxjb21lUGFja2FnZVxuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHdlbGNvbWVQYWNrYWdlID0gbmV3IFdlbGNvbWVQYWNrYWdlKClcbiAgICBhdG9tLmNvbmZpZy5zZXQoJ3dlbGNvbWUuc2hvd09uU3RhcnR1cCcsIHRydWUpXG4gIH0pXG5cbiAgYWZ0ZXJFYWNoKCgpID0+IHtcbiAgICBhdG9tLnJlc2V0KClcbiAgfSlcblxuICBkZXNjcmliZShcIndoZW4gYGNvcmUudGVsZW1ldHJ5Q29uc2VudGAgaXMgJ3VuZGVjaWRlZCdcIiwgKCkgPT4ge1xuICAgIGJlZm9yZUVhY2goYXN5bmMgKCkgPT4ge1xuICAgICAgYXRvbS5jb25maWcuc2V0KCdjb3JlLnRlbGVtZXRyeUNvbnNlbnQnLCAndW5kZWNpZGVkJylcbiAgICAgIGF3YWl0IHdlbGNvbWVQYWNrYWdlLmFjdGl2YXRlKClcbiAgICB9KVxuXG4gICAgaXQoJ29wZW5zIHRoZSB0ZWxlbWV0cnkgY29uc2VudCBwYW5lIGFuZCB0aGUgd2VsY29tZSBwYW5lcycsICgpID0+IHtcbiAgICAgIGNvbnN0IHBhbmVzID0gYXRvbS53b3Jrc3BhY2UuZ2V0Q2VudGVyKCkuZ2V0UGFuZXMoKVxuICAgICAgYXNzZXJ0LmVxdWFsKHBhbmVzLmxlbmd0aCwgMilcbiAgICAgIGFzc2VydC5lcXVhbChwYW5lc1swXS5nZXRJdGVtcygpWzBdLmdldFRpdGxlKCksICdUZWxlbWV0cnkgQ29uc2VudCcpXG4gICAgICBhc3NlcnQuZXF1YWwocGFuZXNbMF0uZ2V0SXRlbXMoKVsxXS5nZXRUaXRsZSgpLCAnV2VsY29tZScpXG4gICAgICBhc3NlcnQuZXF1YWwocGFuZXNbMV0uZ2V0SXRlbXMoKVswXS5nZXRUaXRsZSgpLCAnV2VsY29tZSBHdWlkZScpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnd2hlbiBgY29yZS50ZWxlbWV0cnlDb25zZW50YCBpcyBub3QgYHVuZGVjaWRlZGAnLCAoKSA9PiB7XG4gICAgYmVmb3JlRWFjaChhc3luYyAoKSA9PiB7XG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ2NvcmUudGVsZW1ldHJ5Q29uc2VudCcsICdubycpXG4gICAgICBhd2FpdCB3ZWxjb21lUGFja2FnZS5hY3RpdmF0ZSgpXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCd3aGVuIGFjdGl2YXRlZCBmb3IgdGhlIGZpcnN0IHRpbWUnLCAoKSA9PlxuICAgICAgaXQoJ3Nob3dzIHRoZSB3ZWxjb21lIHBhbmVzJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBwYW5lcyA9IGF0b20ud29ya3NwYWNlLmdldENlbnRlcigpLmdldFBhbmVzKClcbiAgICAgICAgYXNzZXJ0LmVxdWFsKHBhbmVzLmxlbmd0aCwgMilcbiAgICAgICAgYXNzZXJ0LmVxdWFsKHBhbmVzWzBdLmdldEl0ZW1zKClbMF0uZ2V0VGl0bGUoKSwgJ1dlbGNvbWUnKVxuICAgICAgICBhc3NlcnQuZXF1YWwocGFuZXNbMV0uZ2V0SXRlbXMoKVswXS5nZXRUaXRsZSgpLCAnV2VsY29tZSBHdWlkZScpXG4gICAgICB9KVxuICAgIClcblxuICAgIGRlc2NyaWJlKCd0aGUgd2VsY29tZTpzaG93IGNvbW1hbmQnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvd3MgdGhlIHdlbGNvbWUgYnVmZmVyJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICBhdG9tLndvcmtzcGFjZS5nZXRDZW50ZXIoKS5nZXRQYW5lcygpLm1hcChwYW5lID0+IHBhbmUuZGVzdHJveSgpKVxuICAgICAgICBhc3NlcnQoIWF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmVJdGVtKCkpXG5cbiAgICAgICAgY29uc3Qgd29ya3NwYWNlRWxlbWVudCA9IGF0b20udmlld3MuZ2V0VmlldyhhdG9tLndvcmtzcGFjZSlcbiAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh3b3Jrc3BhY2VFbGVtZW50LCAnd2VsY29tZTpzaG93JylcblxuICAgICAgICBhd2FpdCBjb25kaXRpb25Qcm9taXNlKCgpID0+IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmVJdGVtKCkpXG5cbiAgICAgICAgY29uc3QgcGFuZXMgPSBhdG9tLndvcmtzcGFjZS5nZXRDZW50ZXIoKS5nZXRQYW5lcygpXG4gICAgICAgIGFzc2VydC5lcXVhbChwYW5lcy5sZW5ndGgsIDIpXG4gICAgICAgIGFzc2VydC5lcXVhbChwYW5lc1swXS5nZXRJdGVtcygpWzBdLmdldFRpdGxlKCksICdXZWxjb21lJylcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdkZXNlcmlhbGl6aW5nIHRoZSBwYW5lIGl0ZW1zJywgKCkgPT4ge1xuICAgICAgZGVzY3JpYmUoJ3doZW4gR3VpZGVWaWV3IGlzIGRlc2VyaWFsaXplZCcsICgpID0+IHtcbiAgICAgICAgaXQoJ3JlbWVtYmVycyBvcGVuIHNlY3Rpb25zJywgKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IHBhbmVzID0gYXRvbS53b3Jrc3BhY2UuZ2V0Q2VudGVyKCkuZ2V0UGFuZXMoKVxuICAgICAgICAgIGNvbnN0IGd1aWRlVmlldyA9IHBhbmVzWzFdLmdldEl0ZW1zKClbMF1cblxuICAgICAgICAgIGd1aWRlVmlldy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2RldGFpbHNbZGF0YS1zZWN0aW9uPVwic25pcHBldHNcIl0nKS5zZXRBdHRyaWJ1dGUoJ29wZW4nLCAnb3BlbicpXG4gICAgICAgICAgZ3VpZGVWaWV3LmVsZW1lbnQucXVlcnlTZWxlY3RvcignZGV0YWlsc1tkYXRhLXNlY3Rpb249XCJpbml0LXNjcmlwdFwiXScpLnNldEF0dHJpYnV0ZSgnb3BlbicsICdvcGVuJylcblxuICAgICAgICAgIGNvbnN0IHN0YXRlID0gZ3VpZGVWaWV3LnNlcmlhbGl6ZSgpXG5cbiAgICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKHN0YXRlLm9wZW5TZWN0aW9ucywgWydpbml0LXNjcmlwdCcsICdzbmlwcGV0cyddKVxuXG4gICAgICAgICAgY29uc3QgbmV3R3VpZGVWaWV3ID0gd2VsY29tZVBhY2thZ2UuY3JlYXRlR3VpZGVWaWV3KHN0YXRlKVxuICAgICAgICAgIGFzc2VydCghbmV3R3VpZGVWaWV3LmVsZW1lbnQucXVlcnlTZWxlY3RvcignZGV0YWlsc1tkYXRhLXNlY3Rpb249XCJwYWNrYWdlc1wiXScpLmhhc0F0dHJpYnV0ZSgnb3BlbicpKVxuICAgICAgICAgIGFzc2VydChuZXdHdWlkZVZpZXcuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdkZXRhaWxzW2RhdGEtc2VjdGlvbj1cInNuaXBwZXRzXCJdJykuaGFzQXR0cmlidXRlKCdvcGVuJykpXG4gICAgICAgICAgYXNzZXJ0KG5ld0d1aWRlVmlldy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2RldGFpbHNbZGF0YS1zZWN0aW9uPVwiaW5pdC1zY3JpcHRcIl0nKS5oYXNBdHRyaWJ1dGUoJ29wZW4nKSlcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdyZXBvcnRpbmcgZXZlbnRzJywgKCkgPT4ge1xuICAgICAgbGV0IHBhbmVzLCBndWlkZVZpZXcsIHJlcG9ydGVkRXZlbnRzXG4gICAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgcGFuZXMgPSBhdG9tLndvcmtzcGFjZS5nZXRDZW50ZXIoKS5nZXRQYW5lcygpXG4gICAgICAgIGd1aWRlVmlldyA9IHBhbmVzWzFdLmdldEl0ZW1zKClbMF1cbiAgICAgICAgcmVwb3J0ZWRFdmVudHMgPSBbXVxuXG4gICAgICAgIHdlbGNvbWVQYWNrYWdlLnJlcG9ydGVyUHJveHkuc2VuZEV2ZW50ID0gKC4uLmV2ZW50KSA9PiB7IHJlcG9ydGVkRXZlbnRzLnB1c2goZXZlbnQpIH1cbiAgICAgIH0pXG5cbiAgICAgIGRlc2NyaWJlKCdHdWlkZVZpZXcgZXZlbnRzJywgKCkgPT4ge1xuICAgICAgICBpdCgnY2FwdHVyZXMgZXhwYW5kIGFuZCBjb2xsYXBzZSBldmVudHMnLCAoKSA9PiB7XG4gICAgICAgICAgZ3VpZGVWaWV3LmVsZW1lbnQucXVlcnlTZWxlY3RvcignZGV0YWlsc1tkYXRhLXNlY3Rpb249XCJwYWNrYWdlc1wiXSBzdW1tYXJ5JykuY2xpY2soKVxuICAgICAgICAgIGFzc2VydC5kZWVwRXF1YWwocmVwb3J0ZWRFdmVudHMsIFtbJ2V4cGFuZC1wYWNrYWdlcy1zZWN0aW9uJ11dKVxuXG4gICAgICAgICAgZ3VpZGVWaWV3LmVsZW1lbnQucXVlcnlTZWxlY3RvcignZGV0YWlsc1tkYXRhLXNlY3Rpb249XCJwYWNrYWdlc1wiXScpLnNldEF0dHJpYnV0ZSgnb3BlbicsICdvcGVuJylcbiAgICAgICAgICBndWlkZVZpZXcuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdkZXRhaWxzW2RhdGEtc2VjdGlvbj1cInBhY2thZ2VzXCJdIHN1bW1hcnknKS5jbGljaygpXG4gICAgICAgICAgYXNzZXJ0LmRlZXBFcXVhbChyZXBvcnRlZEV2ZW50cywgW1snZXhwYW5kLXBhY2thZ2VzLXNlY3Rpb24nXSwgWydjb2xsYXBzZS1wYWNrYWdlcy1zZWN0aW9uJ11dKVxuICAgICAgICB9KVxuXG4gICAgICAgIGl0KCdjYXB0dXJlcyBidXR0b24gZXZlbnRzJywgKCkgPT4ge1xuICAgICAgICAgIGZvciAoY29uc3QgZGV0YWlsRWxlbWVudCBvZiBBcnJheS5mcm9tKGd1aWRlVmlldy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2RldGFpbHMnKSkpIHtcbiAgICAgICAgICAgIHJlcG9ydGVkRXZlbnRzLmxlbmd0aCA9IDBcblxuICAgICAgICAgICAgY29uc3Qgc2VjdGlvbk5hbWUgPSBkZXRhaWxFbGVtZW50LmRhdGFzZXQuc2VjdGlvblxuICAgICAgICAgICAgY29uc3QgZXZlbnROYW1lID0gYGNsaWNrZWQtJHtzZWN0aW9uTmFtZX0tY3RhYFxuICAgICAgICAgICAgY29uc3QgcHJpbWFyeUJ1dHRvbiA9IGRldGFpbEVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ0bi1wcmltYXJ5JylcbiAgICAgICAgICAgIGlmIChwcmltYXJ5QnV0dG9uKSB7XG4gICAgICAgICAgICAgIHByaW1hcnlCdXR0b24uY2xpY2soKVxuICAgICAgICAgICAgICBhc3NlcnQuZGVlcEVxdWFsKHJlcG9ydGVkRXZlbnRzLCBbW2V2ZW50TmFtZV1dKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCd3aGVuIHRoZSByZXBvcnRlciBjaGFuZ2VzJywgKCkgPT5cbiAgICAgIGl0KCdzZW5kcyBhbGwgcXVldWVkIGV2ZW50cycsICgpID0+IHtcbiAgICAgICAgd2VsY29tZVBhY2thZ2UucmVwb3J0ZXJQcm94eS5xdWV1ZS5sZW5ndGggPSAwXG5cbiAgICAgICAgY29uc3QgcmVwb3J0ZXIxID0ge3NlbmRFdmVudCAoLi4uZXZlbnQpIHsgdGhpcy5yZXBvcnRlZEV2ZW50cy5wdXNoKGV2ZW50KSB9LCByZXBvcnRlZEV2ZW50czogW119XG4gICAgICAgIGNvbnN0IHJlcG9ydGVyMiA9IHtzZW5kRXZlbnQgKC4uLmV2ZW50KSB7IHRoaXMucmVwb3J0ZWRFdmVudHMucHVzaChldmVudCkgfSwgcmVwb3J0ZWRFdmVudHM6IFtdfVxuXG4gICAgICAgIHdlbGNvbWVQYWNrYWdlLnJlcG9ydGVyUHJveHkuc2VuZEV2ZW50KCdmb28nLCAnYmFyJywgJ2JheicpXG4gICAgICAgIHdlbGNvbWVQYWNrYWdlLnJlcG9ydGVyUHJveHkuc2VuZEV2ZW50KCdmb28yJywgJ2JhcjInLCAnYmF6MicpXG4gICAgICAgIHdlbGNvbWVQYWNrYWdlLnJlcG9ydGVyUHJveHkuc2V0UmVwb3J0ZXIocmVwb3J0ZXIxKVxuXG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwocmVwb3J0ZXIxLnJlcG9ydGVkRXZlbnRzLCBbXG4gICAgICAgICAgWyd3ZWxjb21lLXYxJywgJ2ZvbycsICdiYXInLCAnYmF6J10sXG4gICAgICAgICAgWyd3ZWxjb21lLXYxJywgJ2ZvbzInLCAnYmFyMicsICdiYXoyJ11cbiAgICAgICAgXSlcblxuICAgICAgICB3ZWxjb21lUGFja2FnZS5jb25zdW1lUmVwb3J0ZXIocmVwb3J0ZXIyKVxuXG4gICAgICAgIGFzc2VydC5kZWVwRXF1YWwocmVwb3J0ZXIyLnJlcG9ydGVkRXZlbnRzLCBbXSlcbiAgICAgIH0pXG4gICAgKVxuICB9KVxufSlcbiJdfQ==