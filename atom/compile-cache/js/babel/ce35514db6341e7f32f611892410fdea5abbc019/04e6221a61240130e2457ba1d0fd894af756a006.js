Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/** @jsx etch.dom */

var _etch = require('etch');

var _etch2 = _interopRequireDefault(_etch);

'use babel';
var ConsentView = (function () {
  function ConsentView() {
    _classCallCheck(this, ConsentView);

    _etch2['default'].initialize(this);
  }

  _createClass(ConsentView, [{
    key: 'render',
    value: function render() {
      return _etch2['default'].dom(
        'div',
        { className: 'welcome' },
        _etch2['default'].dom(
          'div',
          { className: 'welcome-container' },
          _etch2['default'].dom(
            'div',
            { className: 'header' },
            _etch2['default'].dom(
              'a',
              { title: 'atom.io', href: 'https://atom.io/' },
              _etch2['default'].dom(
                'svg',
                { 'class': 'welcome-logo', width: '330px', height: '68px', viewBox: '0 0 330 68', version: '1.1' },
                _etch2['default'].dom(
                  'g',
                  { stroke: 'none', 'stroke-width': '1', fill: 'none', 'fill-rule': 'evenodd' },
                  _etch2['default'].dom(
                    'g',
                    { transform: 'translate(2.000000, 1.000000)' },
                    _etch2['default'].dom(
                      'g',
                      { transform: 'translate(96.000000, 8.000000)', fill: 'currentColor' },
                      _etch2['default'].dom('path', { d: 'M185.498,3.399 C185.498,2.417 186.34,1.573 187.324,1.573 L187.674,1.573 C188.447,1.573 189.01,1.995 189.5,2.628 L208.676,30.862 L227.852,2.628 C228.272,1.995 228.905,1.573 229.676,1.573 L230.028,1.573 C231.01,1.573 231.854,2.417 231.854,3.399 L231.854,49.403 C231.854,50.387 231.01,51.231 230.028,51.231 C229.044,51.231 228.202,50.387 228.202,49.403 L228.202,8.246 L210.151,34.515 C209.729,35.148 209.237,35.428 208.606,35.428 C207.973,35.428 207.481,35.148 207.061,34.515 L189.01,8.246 L189.01,49.475 C189.01,50.457 188.237,51.231 187.254,51.231 C186.27,51.231 185.498,50.458 185.498,49.475 L185.498,3.399 L185.498,3.399 Z' }),
                      _etch2['default'].dom('path', { d: 'M113.086,26.507 L113.086,26.367 C113.086,12.952 122.99,0.941 137.881,0.941 C152.77,0.941 162.533,12.811 162.533,26.225 L162.533,26.367 C162.533,39.782 152.629,51.792 137.74,51.792 C122.85,51.792 113.086,39.923 113.086,26.507 M158.74,26.507 L158.74,26.367 C158.74,14.216 149.89,4.242 137.74,4.242 C125.588,4.242 116.879,14.075 116.879,26.225 L116.879,26.367 C116.879,38.518 125.729,48.491 137.881,48.491 C150.031,48.491 158.74,38.658 158.74,26.507' }),
                      _etch2['default'].dom('path', { d: 'M76.705,5.155 L60.972,5.155 C60.06,5.155 59.287,4.384 59.287,3.469 C59.287,2.556 60.059,1.783 60.972,1.783 L96.092,1.783 C97.004,1.783 97.778,2.555 97.778,3.469 C97.778,4.383 97.005,5.155 96.092,5.155 L80.358,5.155 L80.358,49.405 C80.358,50.387 79.516,51.231 78.532,51.231 C77.55,51.231 76.706,50.387 76.706,49.405 L76.706,5.155 L76.705,5.155 Z' }),
                      _etch2['default'].dom('path', { d: 'M0.291,48.562 L21.291,3.05 C21.783,1.995 22.485,1.292 23.75,1.292 L23.891,1.292 C25.155,1.292 25.858,1.995 26.348,3.05 L47.279,48.421 C47.49,48.843 47.56,49.194 47.56,49.546 C47.56,50.458 46.788,51.231 45.803,51.231 C44.961,51.231 44.329,50.599 43.978,49.826 L38.219,37.183 L9.21,37.183 L3.45,49.897 C3.099,50.739 2.538,51.231 1.694,51.231 C0.781,51.231 0.008,50.529 0.008,49.685 C0.009,49.404 0.08,48.983 0.291,48.562 L0.291,48.562 Z M36.673,33.882 L23.749,5.437 L10.755,33.882 L36.673,33.882 L36.673,33.882 Z' })
                    ),
                    _etch2['default'].dom(
                      'g',
                      null,
                      _etch2['default'].dom('path', { d: 'M40.363,32.075 C40.874,34.44 39.371,36.77 37.006,37.282 C34.641,37.793 32.311,36.29 31.799,33.925 C31.289,31.56 32.791,29.23 35.156,28.718 C37.521,28.207 39.851,29.71 40.363,32.075', fill: 'currentColor' }),
                      _etch2['default'].dom('path', { d: 'M48.578,28.615 C56.851,45.587 58.558,61.581 52.288,64.778 C45.822,68.076 33.326,56.521 24.375,38.969 C15.424,21.418 13.409,4.518 19.874,1.221 C22.689,-0.216 26.648,1.166 30.959,4.629', stroke: 'currentColor', 'stroke-width': '3.08', 'stroke-linecap': 'round' }),
                      _etch2['default'].dom('path', { d: 'M7.64,39.45 C2.806,36.94 -0.009,33.915 0.154,30.79 C0.531,23.542 16.787,18.497 36.462,19.52 C56.137,20.544 71.781,27.249 71.404,34.497 C71.241,37.622 68.127,40.338 63.06,42.333', stroke: 'currentColor', 'stroke-width': '3.08', 'stroke-linecap': 'round' }),
                      _etch2['default'].dom('path', { d: 'M28.828,59.354 C23.545,63.168 18.843,64.561 15.902,62.653 C9.814,58.702 13.572,42.102 24.296,25.575 C35.02,9.048 48.649,-1.149 54.736,2.803 C57.566,4.639 58.269,9.208 57.133,15.232', stroke: 'currentColor', 'stroke-width': '3.08', 'stroke-linecap': 'round' })
                    )
                  )
                )
              )
            )
          ),
          _etch2['default'].dom(
            'div',
            { className: 'welcome-consent' },
            _etch2['default'].dom(
              'p',
              null,
              'To help improve Atom, you can anonymously send usage stats to the team. The resulting data plays a key role in deciding what to focus on.'
            ),
            _etch2['default'].dom(
              'p',
              { className: 'welcome-note' },
              'The data we send is minimal. Broadly, we send things like startup time, session time, and exceptions — never code or paths. See the ',
              _etch2['default'].dom(
                'a',
                { onclick: this.openMetricsPackage.bind(this) },
                'atom/metrics package'
              ),
              ' for details on what data is sent.'
            ),
            _etch2['default'].dom(
              'div',
              { className: 'welcome-consent-choices' },
              _etch2['default'].dom(
                'div',
                null,
                _etch2['default'].dom(
                  'button',
                  { className: 'btn', onclick: this.decline.bind(this) },
                  'No, I don\'t want to help'
                ),
                _etch2['default'].dom(
                  'p',
                  { className: 'welcome-note' },
                  'By opting out, your usage patterns will not be taken into account. We only register that you opted-out.'
                )
              ),
              _etch2['default'].dom(
                'div',
                null,
                _etch2['default'].dom(
                  'button',
                  { className: 'btn btn-primary', onclick: this.consent.bind(this) },
                  'Yes, I want to help improve Atom'
                ),
                _etch2['default'].dom(
                  'p',
                  { className: 'welcome-note' },
                  'You are helping us assess Atom\'s performance and understand usage patterns.'
                )
              )
            )
          ),
          _etch2['default'].dom(
            'div',
            { className: 'welcome-footer' },
            _etch2['default'].dom(
              'p',
              { className: 'welcome-love' },
              _etch2['default'].dom('span', { className: 'icon icon-code' }),
              _etch2['default'].dom(
                'span',
                { className: 'inline' },
                ' with '
              ),
              _etch2['default'].dom('span', { className: 'icon icon-heart' }),
              _etch2['default'].dom(
                'span',
                { className: 'inline' },
                ' by '
              ),
              _etch2['default'].dom('a', { className: 'icon icon-logo-github', title: 'GitHub', href: 'https://github.com' })
            )
          )
        )
      );
    }
  }, {
    key: 'update',
    value: function update() {
      return _etch2['default'].update(this);
    }
  }, {
    key: 'consent',
    value: function consent() {
      atom.config.set('core.telemetryConsent', 'limited');
      atom.workspace.closeActivePaneItemOrEmptyPaneOrWindow();
    }
  }, {
    key: 'decline',
    value: function decline() {
      atom.config.set('core.telemetryConsent', 'no');
      atom.workspace.closeActivePaneItemOrEmptyPaneOrWindow();
    }
  }, {
    key: 'openMetricsPackage',
    value: function openMetricsPackage() {
      atom.workspace.open('atom://config/packages/metrics');
    }
  }, {
    key: 'getTitle',
    value: function getTitle() {
      return 'Telemetry Consent';
    }
  }, {
    key: 'destroy',
    value: _asyncToGenerator(function* () {
      yield _etch2['default'].destroy(this);
    })
  }]);

  return ConsentView;
})();

exports['default'] = ConsentView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy93ZWxjb21lL2xpYi9jb25zZW50LXZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7b0JBR2lCLE1BQU07Ozs7QUFIdkIsV0FBVyxDQUFBO0lBS1UsV0FBVztBQUNsQixXQURPLFdBQVcsR0FDZjswQkFESSxXQUFXOztBQUU1QixzQkFBSyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUE7R0FDdEI7O2VBSGtCLFdBQVc7O1dBS3ZCLGtCQUFHO0FBQ1IsYUFDRTs7VUFBSyxTQUFTLEVBQUMsU0FBUztRQUN0Qjs7WUFBSyxTQUFTLEVBQUMsbUJBQW1CO1VBQ2hDOztjQUFLLFNBQVMsRUFBQyxRQUFRO1lBQ3JCOztnQkFBRyxLQUFLLEVBQUMsU0FBUyxFQUFDLElBQUksRUFBQyxrQkFBa0I7Y0FDeEM7O2tCQUFLLFNBQU0sY0FBYyxFQUFDLEtBQUssRUFBQyxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sRUFBQyxPQUFPLEVBQUMsWUFBWSxFQUFDLE9BQU8sRUFBQyxLQUFLO2dCQUN0Rjs7b0JBQUcsTUFBTSxFQUFDLE1BQU0sRUFBQyxnQkFBYSxHQUFHLEVBQUMsSUFBSSxFQUFDLE1BQU0sRUFBQyxhQUFVLFNBQVM7a0JBQy9EOztzQkFBRyxTQUFTLEVBQUMsK0JBQStCO29CQUMxQzs7d0JBQUcsU0FBUyxFQUFDLGdDQUFnQyxFQUFDLElBQUksRUFBQyxjQUFjO3NCQUMvRCxnQ0FBTSxDQUFDLEVBQUMsaW5CQUFpbkIsR0FBRztzQkFDNW5CLGdDQUFNLENBQUMsRUFBQyxnY0FBZ2MsR0FBRztzQkFDM2MsZ0NBQU0sQ0FBQyxFQUFDLDBWQUEwVixHQUFHO3NCQUNyVyxnQ0FBTSxDQUFDLEVBQUMsZ2dCQUFnZ0IsR0FBRztxQkFDemdCO29CQUNKOzs7c0JBQ0UsZ0NBQU0sQ0FBQyxFQUFDLHNMQUFzTCxFQUFDLElBQUksRUFBQyxjQUFjLEdBQUc7c0JBQ3JOLGdDQUFNLENBQUMsRUFBQyx3TEFBd0wsRUFBQyxNQUFNLEVBQUMsY0FBYyxFQUFDLGdCQUFhLE1BQU0sRUFBQyxrQkFBZSxPQUFPLEdBQUc7c0JBQ3BRLGdDQUFNLENBQUMsRUFBQyxrTEFBa0wsRUFBQyxNQUFNLEVBQUMsY0FBYyxFQUFDLGdCQUFhLE1BQU0sRUFBQyxrQkFBZSxPQUFPLEdBQUc7c0JBQzlQLGdDQUFNLENBQUMsRUFBQyxzTEFBc0wsRUFBQyxNQUFNLEVBQUMsY0FBYyxFQUFDLGdCQUFhLE1BQU0sRUFBQyxrQkFBZSxPQUFPLEdBQUc7cUJBQ2hRO21CQUNGO2lCQUNGO2VBQ0E7YUFDSjtXQUNBO1VBQ047O2NBQUssU0FBUyxFQUFDLGlCQUFpQjtZQUM5Qjs7OzthQUFnSjtZQUNoSjs7Z0JBQUcsU0FBUyxFQUFDLGNBQWM7O2NBQXFJOztrQkFBRyxPQUFPLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQUFBQzs7ZUFBeUI7O2FBQXNDO1lBRTlROztnQkFBSyxTQUFTLEVBQUMseUJBQXlCO2NBQ3RDOzs7Z0JBQ0U7O29CQUFRLFNBQVMsRUFBQyxLQUFLLEVBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxBQUFDOztpQkFBa0M7Z0JBQzNGOztvQkFBRyxTQUFTLEVBQUMsY0FBYzs7aUJBQTRHO2VBQ25JO2NBRU47OztnQkFDRTs7b0JBQVEsU0FBUyxFQUFDLGlCQUFpQixFQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQUFBQzs7aUJBQTBDO2dCQUMvRzs7b0JBQUcsU0FBUyxFQUFDLGNBQWM7O2lCQUFnRjtlQUN2RzthQUNGO1dBQ0Y7VUFFTjs7Y0FBSyxTQUFTLEVBQUMsZ0JBQWdCO1lBQzdCOztnQkFBRyxTQUFTLEVBQUMsY0FBYztjQUN6QixnQ0FBTSxTQUFTLEVBQUMsZ0JBQWdCLEdBQUc7Y0FDbkM7O2tCQUFNLFNBQVMsRUFBQyxRQUFROztlQUFjO2NBQ3RDLGdDQUFNLFNBQVMsRUFBQyxpQkFBaUIsR0FBRztjQUNwQzs7a0JBQU0sU0FBUyxFQUFDLFFBQVE7O2VBQVk7Y0FDcEMsNkJBQUcsU0FBUyxFQUFDLHVCQUF1QixFQUFDLEtBQUssRUFBQyxRQUFRLEVBQUMsSUFBSSxFQUFDLG9CQUFvQixHQUFHO2FBQzlFO1dBQ0E7U0FDRjtPQUNGLENBQ1A7S0FDRjs7O1dBRU0sa0JBQUc7QUFDUixhQUFPLGtCQUFLLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQTtLQUN6Qjs7O1dBRU8sbUJBQUc7QUFDVCxVQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsRUFBRSxTQUFTLENBQUMsQ0FBQTtBQUNuRCxVQUFJLENBQUMsU0FBUyxDQUFDLHNDQUFzQyxFQUFFLENBQUE7S0FDeEQ7OztXQUVPLG1CQUFHO0FBQ1QsVUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLEVBQUUsSUFBSSxDQUFDLENBQUE7QUFDOUMsVUFBSSxDQUFDLFNBQVMsQ0FBQyxzQ0FBc0MsRUFBRSxDQUFBO0tBQ3hEOzs7V0FFa0IsOEJBQUc7QUFDcEIsVUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsZ0NBQWdDLENBQUMsQ0FBQTtLQUN0RDs7O1dBRVEsb0JBQUc7QUFDVixhQUFPLG1CQUFtQixDQUFBO0tBQzNCOzs7NkJBRWEsYUFBRztBQUNmLFlBQU0sa0JBQUssT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO0tBQ3pCOzs7U0F0RmtCLFdBQVc7OztxQkFBWCxXQUFXIiwiZmlsZSI6Ii9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy93ZWxjb21lL2xpYi9jb25zZW50LXZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuLyoqIEBqc3ggZXRjaC5kb20gKi9cblxuaW1wb3J0IGV0Y2ggZnJvbSAnZXRjaCdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29uc2VudFZpZXcge1xuICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgZXRjaC5pbml0aWFsaXplKHRoaXMpXG4gIH1cblxuICByZW5kZXIgKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT0nd2VsY29tZSc+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSd3ZWxjb21lLWNvbnRhaW5lcic+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2hlYWRlcic+XG4gICAgICAgICAgICA8YSB0aXRsZT0nYXRvbS5pbycgaHJlZj0naHR0cHM6Ly9hdG9tLmlvLyc+XG4gICAgICAgICAgICAgIDxzdmcgY2xhc3M9J3dlbGNvbWUtbG9nbycgd2lkdGg9JzMzMHB4JyBoZWlnaHQ9JzY4cHgnIHZpZXdCb3g9JzAgMCAzMzAgNjgnIHZlcnNpb249JzEuMSc+XG4gICAgICAgICAgICAgICAgPGcgc3Ryb2tlPSdub25lJyBzdHJva2Utd2lkdGg9JzEnIGZpbGw9J25vbmUnIGZpbGwtcnVsZT0nZXZlbm9kZCc+XG4gICAgICAgICAgICAgICAgICA8ZyB0cmFuc2Zvcm09J3RyYW5zbGF0ZSgyLjAwMDAwMCwgMS4wMDAwMDApJz5cbiAgICAgICAgICAgICAgICAgICAgPGcgdHJhbnNmb3JtPSd0cmFuc2xhdGUoOTYuMDAwMDAwLCA4LjAwMDAwMCknIGZpbGw9J2N1cnJlbnRDb2xvcic+XG4gICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0nTTE4NS40OTgsMy4zOTkgQzE4NS40OTgsMi40MTcgMTg2LjM0LDEuNTczIDE4Ny4zMjQsMS41NzMgTDE4Ny42NzQsMS41NzMgQzE4OC40NDcsMS41NzMgMTg5LjAxLDEuOTk1IDE4OS41LDIuNjI4IEwyMDguNjc2LDMwLjg2MiBMMjI3Ljg1MiwyLjYyOCBDMjI4LjI3MiwxLjk5NSAyMjguOTA1LDEuNTczIDIyOS42NzYsMS41NzMgTDIzMC4wMjgsMS41NzMgQzIzMS4wMSwxLjU3MyAyMzEuODU0LDIuNDE3IDIzMS44NTQsMy4zOTkgTDIzMS44NTQsNDkuNDAzIEMyMzEuODU0LDUwLjM4NyAyMzEuMDEsNTEuMjMxIDIzMC4wMjgsNTEuMjMxIEMyMjkuMDQ0LDUxLjIzMSAyMjguMjAyLDUwLjM4NyAyMjguMjAyLDQ5LjQwMyBMMjI4LjIwMiw4LjI0NiBMMjEwLjE1MSwzNC41MTUgQzIwOS43MjksMzUuMTQ4IDIwOS4yMzcsMzUuNDI4IDIwOC42MDYsMzUuNDI4IEMyMDcuOTczLDM1LjQyOCAyMDcuNDgxLDM1LjE0OCAyMDcuMDYxLDM0LjUxNSBMMTg5LjAxLDguMjQ2IEwxODkuMDEsNDkuNDc1IEMxODkuMDEsNTAuNDU3IDE4OC4yMzcsNTEuMjMxIDE4Ny4yNTQsNTEuMjMxIEMxODYuMjcsNTEuMjMxIDE4NS40OTgsNTAuNDU4IDE4NS40OTgsNDkuNDc1IEwxODUuNDk4LDMuMzk5IEwxODUuNDk4LDMuMzk5IFonIC8+XG4gICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0nTTExMy4wODYsMjYuNTA3IEwxMTMuMDg2LDI2LjM2NyBDMTEzLjA4NiwxMi45NTIgMTIyLjk5LDAuOTQxIDEzNy44ODEsMC45NDEgQzE1Mi43NywwLjk0MSAxNjIuNTMzLDEyLjgxMSAxNjIuNTMzLDI2LjIyNSBMMTYyLjUzMywyNi4zNjcgQzE2Mi41MzMsMzkuNzgyIDE1Mi42MjksNTEuNzkyIDEzNy43NCw1MS43OTIgQzEyMi44NSw1MS43OTIgMTEzLjA4NiwzOS45MjMgMTEzLjA4NiwyNi41MDcgTTE1OC43NCwyNi41MDcgTDE1OC43NCwyNi4zNjcgQzE1OC43NCwxNC4yMTYgMTQ5Ljg5LDQuMjQyIDEzNy43NCw0LjI0MiBDMTI1LjU4OCw0LjI0MiAxMTYuODc5LDE0LjA3NSAxMTYuODc5LDI2LjIyNSBMMTE2Ljg3OSwyNi4zNjcgQzExNi44NzksMzguNTE4IDEyNS43MjksNDguNDkxIDEzNy44ODEsNDguNDkxIEMxNTAuMDMxLDQ4LjQ5MSAxNTguNzQsMzguNjU4IDE1OC43NCwyNi41MDcnIC8+XG4gICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0nTTc2LjcwNSw1LjE1NSBMNjAuOTcyLDUuMTU1IEM2MC4wNiw1LjE1NSA1OS4yODcsNC4zODQgNTkuMjg3LDMuNDY5IEM1OS4yODcsMi41NTYgNjAuMDU5LDEuNzgzIDYwLjk3MiwxLjc4MyBMOTYuMDkyLDEuNzgzIEM5Ny4wMDQsMS43ODMgOTcuNzc4LDIuNTU1IDk3Ljc3OCwzLjQ2OSBDOTcuNzc4LDQuMzgzIDk3LjAwNSw1LjE1NSA5Ni4wOTIsNS4xNTUgTDgwLjM1OCw1LjE1NSBMODAuMzU4LDQ5LjQwNSBDODAuMzU4LDUwLjM4NyA3OS41MTYsNTEuMjMxIDc4LjUzMiw1MS4yMzEgQzc3LjU1LDUxLjIzMSA3Ni43MDYsNTAuMzg3IDc2LjcwNiw0OS40MDUgTDc2LjcwNiw1LjE1NSBMNzYuNzA1LDUuMTU1IFonIC8+XG4gICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0nTTAuMjkxLDQ4LjU2MiBMMjEuMjkxLDMuMDUgQzIxLjc4MywxLjk5NSAyMi40ODUsMS4yOTIgMjMuNzUsMS4yOTIgTDIzLjg5MSwxLjI5MiBDMjUuMTU1LDEuMjkyIDI1Ljg1OCwxLjk5NSAyNi4zNDgsMy4wNSBMNDcuMjc5LDQ4LjQyMSBDNDcuNDksNDguODQzIDQ3LjU2LDQ5LjE5NCA0Ny41Niw0OS41NDYgQzQ3LjU2LDUwLjQ1OCA0Ni43ODgsNTEuMjMxIDQ1LjgwMyw1MS4yMzEgQzQ0Ljk2MSw1MS4yMzEgNDQuMzI5LDUwLjU5OSA0My45NzgsNDkuODI2IEwzOC4yMTksMzcuMTgzIEw5LjIxLDM3LjE4MyBMMy40NSw0OS44OTcgQzMuMDk5LDUwLjczOSAyLjUzOCw1MS4yMzEgMS42OTQsNTEuMjMxIEMwLjc4MSw1MS4yMzEgMC4wMDgsNTAuNTI5IDAuMDA4LDQ5LjY4NSBDMC4wMDksNDkuNDA0IDAuMDgsNDguOTgzIDAuMjkxLDQ4LjU2MiBMMC4yOTEsNDguNTYyIFogTTM2LjY3MywzMy44ODIgTDIzLjc0OSw1LjQzNyBMMTAuNzU1LDMzLjg4MiBMMzYuNjczLDMzLjg4MiBMMzYuNjczLDMzLjg4MiBaJyAvPlxuICAgICAgICAgICAgICAgICAgICA8L2c+XG4gICAgICAgICAgICAgICAgICAgIDxnPlxuICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9J000MC4zNjMsMzIuMDc1IEM0MC44NzQsMzQuNDQgMzkuMzcxLDM2Ljc3IDM3LjAwNiwzNy4yODIgQzM0LjY0MSwzNy43OTMgMzIuMzExLDM2LjI5IDMxLjc5OSwzMy45MjUgQzMxLjI4OSwzMS41NiAzMi43OTEsMjkuMjMgMzUuMTU2LDI4LjcxOCBDMzcuNTIxLDI4LjIwNyAzOS44NTEsMjkuNzEgNDAuMzYzLDMyLjA3NScgZmlsbD0nY3VycmVudENvbG9yJyAvPlxuICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9J000OC41NzgsMjguNjE1IEM1Ni44NTEsNDUuNTg3IDU4LjU1OCw2MS41ODEgNTIuMjg4LDY0Ljc3OCBDNDUuODIyLDY4LjA3NiAzMy4zMjYsNTYuNTIxIDI0LjM3NSwzOC45NjkgQzE1LjQyNCwyMS40MTggMTMuNDA5LDQuNTE4IDE5Ljg3NCwxLjIyMSBDMjIuNjg5LC0wLjIxNiAyNi42NDgsMS4xNjYgMzAuOTU5LDQuNjI5JyBzdHJva2U9J2N1cnJlbnRDb2xvcicgc3Ryb2tlLXdpZHRoPSczLjA4JyBzdHJva2UtbGluZWNhcD0ncm91bmQnIC8+XG4gICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0nTTcuNjQsMzkuNDUgQzIuODA2LDM2Ljk0IC0wLjAwOSwzMy45MTUgMC4xNTQsMzAuNzkgQzAuNTMxLDIzLjU0MiAxNi43ODcsMTguNDk3IDM2LjQ2MiwxOS41MiBDNTYuMTM3LDIwLjU0NCA3MS43ODEsMjcuMjQ5IDcxLjQwNCwzNC40OTcgQzcxLjI0MSwzNy42MjIgNjguMTI3LDQwLjMzOCA2My4wNiw0Mi4zMzMnIHN0cm9rZT0nY3VycmVudENvbG9yJyBzdHJva2Utd2lkdGg9JzMuMDgnIHN0cm9rZS1saW5lY2FwPSdyb3VuZCcgLz5cbiAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSdNMjguODI4LDU5LjM1NCBDMjMuNTQ1LDYzLjE2OCAxOC44NDMsNjQuNTYxIDE1LjkwMiw2Mi42NTMgQzkuODE0LDU4LjcwMiAxMy41NzIsNDIuMTAyIDI0LjI5NiwyNS41NzUgQzM1LjAyLDkuMDQ4IDQ4LjY0OSwtMS4xNDkgNTQuNzM2LDIuODAzIEM1Ny41NjYsNC42MzkgNTguMjY5LDkuMjA4IDU3LjEzMywxNS4yMzInIHN0cm9rZT0nY3VycmVudENvbG9yJyBzdHJva2Utd2lkdGg9JzMuMDgnIHN0cm9rZS1saW5lY2FwPSdyb3VuZCcgLz5cbiAgICAgICAgICAgICAgICAgICAgPC9nPlxuICAgICAgICAgICAgICAgICAgPC9nPlxuICAgICAgICAgICAgICAgIDwvZz5cbiAgICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgICAgICA8L2E+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9J3dlbGNvbWUtY29uc2VudCc+XG4gICAgICAgICAgICA8cD5UbyBoZWxwIGltcHJvdmUgQXRvbSwgeW91IGNhbiBhbm9ueW1vdXNseSBzZW5kIHVzYWdlIHN0YXRzIHRvIHRoZSB0ZWFtLiBUaGUgcmVzdWx0aW5nIGRhdGEgcGxheXMgYSBrZXkgcm9sZSBpbiBkZWNpZGluZyB3aGF0IHRvIGZvY3VzIG9uLjwvcD5cbiAgICAgICAgICAgIDxwIGNsYXNzTmFtZT0nd2VsY29tZS1ub3RlJz5UaGUgZGF0YSB3ZSBzZW5kIGlzIG1pbmltYWwuIEJyb2FkbHksIHdlIHNlbmQgdGhpbmdzIGxpa2Ugc3RhcnR1cCB0aW1lLCBzZXNzaW9uIHRpbWUsIGFuZCBleGNlcHRpb25zIOKAlCBuZXZlciBjb2RlIG9yIHBhdGhzLiBTZWUgdGhlIDxhIG9uY2xpY2s9e3RoaXMub3Blbk1ldHJpY3NQYWNrYWdlLmJpbmQodGhpcyl9PmF0b20vbWV0cmljcyBwYWNrYWdlPC9hPiBmb3IgZGV0YWlscyBvbiB3aGF0IGRhdGEgaXMgc2VudC48L3A+XG5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSd3ZWxjb21lLWNvbnNlbnQtY2hvaWNlcyc+XG4gICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9J2J0bicgb25jbGljaz17dGhpcy5kZWNsaW5lLmJpbmQodGhpcyl9Pk5vLCBJIGRvbid0IHdhbnQgdG8gaGVscDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT0nd2VsY29tZS1ub3RlJz5CeSBvcHRpbmcgb3V0LCB5b3VyIHVzYWdlIHBhdHRlcm5zIHdpbGwgbm90IGJlIHRha2VuIGludG8gYWNjb3VudC4gV2Ugb25seSByZWdpc3RlciB0aGF0IHlvdSBvcHRlZC1vdXQuPC9wPlxuICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPSdidG4gYnRuLXByaW1hcnknIG9uY2xpY2s9e3RoaXMuY29uc2VudC5iaW5kKHRoaXMpfT5ZZXMsIEkgd2FudCB0byBoZWxwIGltcHJvdmUgQXRvbTwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT0nd2VsY29tZS1ub3RlJz5Zb3UgYXJlIGhlbHBpbmcgdXMgYXNzZXNzIEF0b20ncyBwZXJmb3JtYW5jZSBhbmQgdW5kZXJzdGFuZCB1c2FnZSBwYXR0ZXJucy48L3A+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nd2VsY29tZS1mb290ZXInPlxuICAgICAgICAgICAgPHAgY2xhc3NOYW1lPSd3ZWxjb21lLWxvdmUnPlxuICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9J2ljb24gaWNvbi1jb2RlJyAvPlxuICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9J2lubGluZSc+IHdpdGggPC9zcGFuPlxuICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9J2ljb24gaWNvbi1oZWFydCcgLz5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPSdpbmxpbmUnPiBieSA8L3NwYW4+XG4gICAgICAgICAgICAgIDxhIGNsYXNzTmFtZT0naWNvbiBpY29uLWxvZ28tZ2l0aHViJyB0aXRsZT0nR2l0SHViJyBocmVmPSdodHRwczovL2dpdGh1Yi5jb20nIC8+XG4gICAgICAgICAgICA8L3A+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgdXBkYXRlICgpIHtcbiAgICByZXR1cm4gZXRjaC51cGRhdGUodGhpcylcbiAgfVxuXG4gIGNvbnNlbnQgKCkge1xuICAgIGF0b20uY29uZmlnLnNldCgnY29yZS50ZWxlbWV0cnlDb25zZW50JywgJ2xpbWl0ZWQnKVxuICAgIGF0b20ud29ya3NwYWNlLmNsb3NlQWN0aXZlUGFuZUl0ZW1PckVtcHR5UGFuZU9yV2luZG93KClcbiAgfVxuXG4gIGRlY2xpbmUgKCkge1xuICAgIGF0b20uY29uZmlnLnNldCgnY29yZS50ZWxlbWV0cnlDb25zZW50JywgJ25vJylcbiAgICBhdG9tLndvcmtzcGFjZS5jbG9zZUFjdGl2ZVBhbmVJdGVtT3JFbXB0eVBhbmVPcldpbmRvdygpXG4gIH1cblxuICBvcGVuTWV0cmljc1BhY2thZ2UgKCkge1xuICAgIGF0b20ud29ya3NwYWNlLm9wZW4oJ2F0b206Ly9jb25maWcvcGFja2FnZXMvbWV0cmljcycpXG4gIH1cblxuICBnZXRUaXRsZSAoKSB7XG4gICAgcmV0dXJuICdUZWxlbWV0cnkgQ29uc2VudCdcbiAgfVxuXG4gIGFzeW5jIGRlc3Ryb3kgKCkge1xuICAgIGF3YWl0IGV0Y2guZGVzdHJveSh0aGlzKVxuICB9XG59XG4iXX0=