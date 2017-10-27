Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/** @babel */

var _atom = require('atom');

var _reporterProxy = require('./reporter-proxy');

var _reporterProxy2 = _interopRequireDefault(_reporterProxy);

var WelcomeView = undefined,
    GuideView = undefined,
    ConsentView = undefined;

var WELCOME_URI = 'atom://welcome/welcome';
var GUIDE_URI = 'atom://welcome/guide';
var CONSENT_URI = 'atom://welcome/consent';

var WelcomePackage = (function () {
  function WelcomePackage() {
    _classCallCheck(this, WelcomePackage);

    this.reporterProxy = new _reporterProxy2['default']();
  }

  _createClass(WelcomePackage, [{
    key: 'activate',
    value: _asyncToGenerator(function* () {
      var _this = this;

      this.subscriptions = new _atom.CompositeDisposable();

      this.subscriptions.add(atom.workspace.addOpener(function (filePath) {
        if (filePath === WELCOME_URI) {
          return _this.createWelcomeView({ uri: WELCOME_URI });
        }
      }));

      this.subscriptions.add(atom.workspace.addOpener(function (filePath) {
        if (filePath === GUIDE_URI) {
          return _this.createGuideView({ uri: GUIDE_URI });
        }
      }));

      this.subscriptions.add(atom.workspace.addOpener(function (filePath) {
        if (filePath === CONSENT_URI) {
          return _this.createConsentView({ uri: CONSENT_URI });
        }
      }));

      this.subscriptions.add(atom.commands.add('atom-workspace', 'welcome:show', function () {
        return _this.show();
      }));

      if (atom.config.get('core.telemetryConsent') === 'undecided') {
        yield atom.workspace.open(CONSENT_URI);
      }

      if (atom.config.get('welcome.showOnStartup')) {
        yield this.show();
        this.reporterProxy.sendEvent('show-on-initial-load');
      }
    })
  }, {
    key: 'show',
    value: function show() {
      return Promise.all([atom.workspace.open(WELCOME_URI, { split: 'left' }), atom.workspace.open(GUIDE_URI, { split: 'right' })]);
    }
  }, {
    key: 'consumeReporter',
    value: function consumeReporter(reporter) {
      return this.reporterProxy.setReporter(reporter);
    }
  }, {
    key: 'deactivate',
    value: function deactivate() {
      this.subscriptions.dispose();
    }
  }, {
    key: 'createWelcomeView',
    value: function createWelcomeView(state) {
      if (WelcomeView == null) WelcomeView = require('./welcome-view');
      return new WelcomeView(_extends({ reporterProxy: this.reporterProxy }, state));
    }
  }, {
    key: 'createGuideView',
    value: function createGuideView(state) {
      if (GuideView == null) GuideView = require('./guide-view');
      return new GuideView(_extends({ reporterProxy: this.reporterProxy }, state));
    }
  }, {
    key: 'createConsentView',
    value: function createConsentView(state) {
      if (ConsentView == null) ConsentView = require('./consent-view');
      return new ConsentView(_extends({ reporterProxy: this.reporterProxy }, state));
    }
  }]);

  return WelcomePackage;
})();

exports['default'] = WelcomePackage;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy93ZWxjb21lL2xpYi93ZWxjb21lLXBhY2thZ2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztvQkFFa0MsTUFBTTs7NkJBQ2Qsa0JBQWtCOzs7O0FBRTVDLElBQUksV0FBVyxZQUFBO0lBQUUsU0FBUyxZQUFBO0lBQUUsV0FBVyxZQUFBLENBQUE7O0FBRXZDLElBQU0sV0FBVyxHQUFHLHdCQUF3QixDQUFBO0FBQzVDLElBQU0sU0FBUyxHQUFHLHNCQUFzQixDQUFBO0FBQ3hDLElBQU0sV0FBVyxHQUFHLHdCQUF3QixDQUFBOztJQUV2QixjQUFjO0FBQ3JCLFdBRE8sY0FBYyxHQUNsQjswQkFESSxjQUFjOztBQUUvQixRQUFJLENBQUMsYUFBYSxHQUFHLGdDQUFtQixDQUFBO0dBQ3pDOztlQUhrQixjQUFjOzs2QkFLbEIsYUFBRzs7O0FBQ2hCLFVBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7O0FBRTlDLFVBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLFVBQUMsUUFBUSxFQUFLO0FBQzVELFlBQUksUUFBUSxLQUFLLFdBQVcsRUFBRTtBQUM1QixpQkFBTyxNQUFLLGlCQUFpQixDQUFDLEVBQUMsR0FBRyxFQUFFLFdBQVcsRUFBQyxDQUFDLENBQUE7U0FDbEQ7T0FDRixDQUFDLENBQUMsQ0FBQTs7QUFFSCxVQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxVQUFDLFFBQVEsRUFBSztBQUM1RCxZQUFJLFFBQVEsS0FBSyxTQUFTLEVBQUU7QUFDMUIsaUJBQU8sTUFBSyxlQUFlLENBQUMsRUFBQyxHQUFHLEVBQUUsU0FBUyxFQUFDLENBQUMsQ0FBQTtTQUM5QztPQUNGLENBQUMsQ0FBQyxDQUFBOztBQUVILFVBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLFVBQUMsUUFBUSxFQUFLO0FBQzVELFlBQUksUUFBUSxLQUFLLFdBQVcsRUFBRTtBQUM1QixpQkFBTyxNQUFLLGlCQUFpQixDQUFDLEVBQUMsR0FBRyxFQUFFLFdBQVcsRUFBQyxDQUFDLENBQUE7U0FDbEQ7T0FDRixDQUFDLENBQUMsQ0FBQTs7QUFFSCxVQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FDcEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsY0FBYyxFQUFFO2VBQU0sTUFBSyxJQUFJLEVBQUU7T0FBQSxDQUFDLENBQ3ZFLENBQUE7O0FBRUQsVUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxLQUFLLFdBQVcsRUFBRTtBQUM1RCxjQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFBO09BQ3ZDOztBQUVELFVBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUMsRUFBRTtBQUM1QyxjQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQTtBQUNqQixZQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFBO09BQ3JEO0tBQ0Y7OztXQUVJLGdCQUFHO0FBQ04sYUFBTyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQ2pCLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxFQUFDLEtBQUssRUFBRSxNQUFNLEVBQUMsQ0FBQyxFQUNqRCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsRUFBQyxLQUFLLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FDakQsQ0FBQyxDQUFBO0tBQ0g7OztXQUVlLHlCQUFDLFFBQVEsRUFBRTtBQUN6QixhQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFBO0tBQ2hEOzs7V0FFVSxzQkFBRztBQUNaLFVBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUE7S0FDN0I7OztXQUVpQiwyQkFBQyxLQUFLLEVBQUU7QUFDeEIsVUFBSSxXQUFXLElBQUksSUFBSSxFQUFFLFdBQVcsR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtBQUNoRSxhQUFPLElBQUksV0FBVyxZQUFFLGFBQWEsRUFBRSxJQUFJLENBQUMsYUFBYSxJQUFLLEtBQUssRUFBRSxDQUFBO0tBQ3RFOzs7V0FFZSx5QkFBQyxLQUFLLEVBQUU7QUFDdEIsVUFBSSxTQUFTLElBQUksSUFBSSxFQUFFLFNBQVMsR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUE7QUFDMUQsYUFBTyxJQUFJLFNBQVMsWUFBRSxhQUFhLEVBQUUsSUFBSSxDQUFDLGFBQWEsSUFBSyxLQUFLLEVBQUUsQ0FBQTtLQUNwRTs7O1dBRWlCLDJCQUFDLEtBQUssRUFBRTtBQUN4QixVQUFJLFdBQVcsSUFBSSxJQUFJLEVBQUUsV0FBVyxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO0FBQ2hFLGFBQU8sSUFBSSxXQUFXLFlBQUUsYUFBYSxFQUFFLElBQUksQ0FBQyxhQUFhLElBQUssS0FBSyxFQUFFLENBQUE7S0FDdEU7OztTQXBFa0IsY0FBYzs7O3FCQUFkLGNBQWMiLCJmaWxlIjoiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3dlbGNvbWUvbGliL3dlbGNvbWUtcGFja2FnZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cblxuaW1wb3J0IHtDb21wb3NpdGVEaXNwb3NhYmxlfSBmcm9tICdhdG9tJ1xuaW1wb3J0IFJlcG9ydGVyUHJveHkgZnJvbSAnLi9yZXBvcnRlci1wcm94eSdcblxubGV0IFdlbGNvbWVWaWV3LCBHdWlkZVZpZXcsIENvbnNlbnRWaWV3XG5cbmNvbnN0IFdFTENPTUVfVVJJID0gJ2F0b206Ly93ZWxjb21lL3dlbGNvbWUnXG5jb25zdCBHVUlERV9VUkkgPSAnYXRvbTovL3dlbGNvbWUvZ3VpZGUnXG5jb25zdCBDT05TRU5UX1VSSSA9ICdhdG9tOi8vd2VsY29tZS9jb25zZW50J1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXZWxjb21lUGFja2FnZSB7XG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICB0aGlzLnJlcG9ydGVyUHJveHkgPSBuZXcgUmVwb3J0ZXJQcm94eSgpXG4gIH1cblxuICBhc3luYyBhY3RpdmF0ZSAoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLndvcmtzcGFjZS5hZGRPcGVuZXIoKGZpbGVQYXRoKSA9PiB7XG4gICAgICBpZiAoZmlsZVBhdGggPT09IFdFTENPTUVfVVJJKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZVdlbGNvbWVWaWV3KHt1cmk6IFdFTENPTUVfVVJJfSlcbiAgICAgIH1cbiAgICB9KSlcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS53b3Jrc3BhY2UuYWRkT3BlbmVyKChmaWxlUGF0aCkgPT4ge1xuICAgICAgaWYgKGZpbGVQYXRoID09PSBHVUlERV9VUkkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlR3VpZGVWaWV3KHt1cmk6IEdVSURFX1VSSX0pXG4gICAgICB9XG4gICAgfSkpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20ud29ya3NwYWNlLmFkZE9wZW5lcigoZmlsZVBhdGgpID0+IHtcbiAgICAgIGlmIChmaWxlUGF0aCA9PT0gQ09OU0VOVF9VUkkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlQ29uc2VudFZpZXcoe3VyaTogQ09OU0VOVF9VUkl9KVxuICAgICAgfVxuICAgIH0pKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsICd3ZWxjb21lOnNob3cnLCAoKSA9PiB0aGlzLnNob3coKSlcbiAgICApXG5cbiAgICBpZiAoYXRvbS5jb25maWcuZ2V0KCdjb3JlLnRlbGVtZXRyeUNvbnNlbnQnKSA9PT0gJ3VuZGVjaWRlZCcpIHtcbiAgICAgIGF3YWl0IGF0b20ud29ya3NwYWNlLm9wZW4oQ09OU0VOVF9VUkkpXG4gICAgfVxuXG4gICAgaWYgKGF0b20uY29uZmlnLmdldCgnd2VsY29tZS5zaG93T25TdGFydHVwJykpIHtcbiAgICAgIGF3YWl0IHRoaXMuc2hvdygpXG4gICAgICB0aGlzLnJlcG9ydGVyUHJveHkuc2VuZEV2ZW50KCdzaG93LW9uLWluaXRpYWwtbG9hZCcpXG4gICAgfVxuICB9XG5cbiAgc2hvdyAoKSB7XG4gICAgcmV0dXJuIFByb21pc2UuYWxsKFtcbiAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oV0VMQ09NRV9VUkksIHtzcGxpdDogJ2xlZnQnfSksXG4gICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKEdVSURFX1VSSSwge3NwbGl0OiAncmlnaHQnfSlcbiAgICBdKVxuICB9XG5cbiAgY29uc3VtZVJlcG9ydGVyIChyZXBvcnRlcikge1xuICAgIHJldHVybiB0aGlzLnJlcG9ydGVyUHJveHkuc2V0UmVwb3J0ZXIocmVwb3J0ZXIpXG4gIH1cblxuICBkZWFjdGl2YXRlICgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gIH1cblxuICBjcmVhdGVXZWxjb21lVmlldyAoc3RhdGUpIHtcbiAgICBpZiAoV2VsY29tZVZpZXcgPT0gbnVsbCkgV2VsY29tZVZpZXcgPSByZXF1aXJlKCcuL3dlbGNvbWUtdmlldycpXG4gICAgcmV0dXJuIG5ldyBXZWxjb21lVmlldyh7cmVwb3J0ZXJQcm94eTogdGhpcy5yZXBvcnRlclByb3h5LCAuLi5zdGF0ZX0pXG4gIH1cblxuICBjcmVhdGVHdWlkZVZpZXcgKHN0YXRlKSB7XG4gICAgaWYgKEd1aWRlVmlldyA9PSBudWxsKSBHdWlkZVZpZXcgPSByZXF1aXJlKCcuL2d1aWRlLXZpZXcnKVxuICAgIHJldHVybiBuZXcgR3VpZGVWaWV3KHtyZXBvcnRlclByb3h5OiB0aGlzLnJlcG9ydGVyUHJveHksIC4uLnN0YXRlfSlcbiAgfVxuXG4gIGNyZWF0ZUNvbnNlbnRWaWV3IChzdGF0ZSkge1xuICAgIGlmIChDb25zZW50VmlldyA9PSBudWxsKSBDb25zZW50VmlldyA9IHJlcXVpcmUoJy4vY29uc2VudC12aWV3JylcbiAgICByZXR1cm4gbmV3IENvbnNlbnRWaWV3KHtyZXBvcnRlclByb3h5OiB0aGlzLnJlcG9ydGVyUHJveHksIC4uLnN0YXRlfSlcbiAgfVxufVxuIl19