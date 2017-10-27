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
              { href: 'https://atom.io/' },
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
              _etch2['default'].dom('a', { className: 'icon icon-logo-github', href: 'https://github.com' })
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
      return "Telemetry Consent";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy93ZWxjb21lL2xpYi9jb25zZW50LXZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7b0JBR2lCLE1BQU07Ozs7QUFIdkIsV0FBVyxDQUFBO0lBS1UsV0FBVztBQUNsQixXQURPLFdBQVcsR0FDZjswQkFESSxXQUFXOztBQUU1QixzQkFBSyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUE7R0FDdEI7O2VBSGtCLFdBQVc7O1dBS3ZCLGtCQUFHO0FBQ1IsYUFDRTs7VUFBSyxTQUFTLEVBQUMsU0FBUztRQUN0Qjs7WUFBSyxTQUFTLEVBQUMsbUJBQW1CO1VBQ2hDOztjQUFLLFNBQVMsRUFBQyxRQUFRO1lBQ3JCOztnQkFBRyxJQUFJLEVBQUMsa0JBQWtCO2NBQ3hCOztrQkFBSyxTQUFNLGNBQWMsRUFBQyxLQUFLLEVBQUMsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLEVBQUMsT0FBTyxFQUFDLFlBQVksRUFBQyxPQUFPLEVBQUMsS0FBSztnQkFDdEY7O29CQUFHLE1BQU0sRUFBQyxNQUFNLEVBQUMsZ0JBQWEsR0FBRyxFQUFDLElBQUksRUFBQyxNQUFNLEVBQUMsYUFBVSxTQUFTO2tCQUM3RDs7c0JBQUcsU0FBUyxFQUFDLCtCQUErQjtvQkFDeEM7O3dCQUFHLFNBQVMsRUFBQyxnQ0FBZ0MsRUFBQyxJQUFJLEVBQUMsY0FBYztzQkFDN0QsZ0NBQU0sQ0FBQyxFQUFDLGluQkFBaW5CLEdBQVE7c0JBQ2pvQixnQ0FBTSxDQUFDLEVBQUMsZ2NBQWdjLEdBQVE7c0JBQ2hkLGdDQUFNLENBQUMsRUFBQywwVkFBMFYsR0FBUTtzQkFDMVcsZ0NBQU0sQ0FBQyxFQUFDLGdnQkFBZ2dCLEdBQVE7cUJBQ2hoQjtvQkFDSjs7O3NCQUNJLGdDQUFNLENBQUMsRUFBQyxzTEFBc0wsRUFBQyxJQUFJLEVBQUMsY0FBYyxHQUFRO3NCQUMxTixnQ0FBTSxDQUFDLEVBQUMsd0xBQXdMLEVBQUMsTUFBTSxFQUFDLGNBQWMsRUFBQyxnQkFBYSxNQUFNLEVBQUMsa0JBQWUsT0FBTyxHQUFRO3NCQUN6USxnQ0FBTSxDQUFDLEVBQUMsa0xBQWtMLEVBQUMsTUFBTSxFQUFDLGNBQWMsRUFBQyxnQkFBYSxNQUFNLEVBQUMsa0JBQWUsT0FBTyxHQUFRO3NCQUNuUSxnQ0FBTSxDQUFDLEVBQUMsc0xBQXNMLEVBQUMsTUFBTSxFQUFDLGNBQWMsRUFBQyxnQkFBYSxNQUFNLEVBQUMsa0JBQWUsT0FBTyxHQUFRO3FCQUN2UTttQkFDSjtpQkFDSjtlQUNBO2FBQ0o7V0FDQTtVQUNOOztjQUFLLFNBQVMsRUFBQyxpQkFBaUI7WUFDOUI7Ozs7YUFBZ0o7WUFDaEo7O2dCQUFHLFNBQVMsRUFBQyxjQUFjOztjQUFxSTs7a0JBQUcsT0FBTyxFQUFFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEFBQUM7O2VBQXlCOzthQUFzQztZQUU5UTs7Z0JBQUssU0FBUyxFQUFDLHlCQUF5QjtjQUN0Qzs7O2dCQUNFOztvQkFBUSxTQUFTLEVBQUMsS0FBSyxFQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQUFBQzs7aUJBQWtDO2dCQUMzRjs7b0JBQUcsU0FBUyxFQUFDLGNBQWM7O2lCQUE0RztlQUNuSTtjQUVOOzs7Z0JBQ0U7O29CQUFRLFNBQVMsRUFBQyxpQkFBaUIsRUFBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEFBQUM7O2lCQUEwQztnQkFDL0c7O29CQUFHLFNBQVMsRUFBQyxjQUFjOztpQkFBZ0Y7ZUFDdkc7YUFDRjtXQUNGO1VBRU47O2NBQUssU0FBUyxFQUFDLGdCQUFnQjtZQUM3Qjs7Z0JBQUcsU0FBUyxFQUFDLGNBQWM7Y0FDekIsZ0NBQU0sU0FBUyxFQUFDLGdCQUFnQixHQUFRO2NBQ3hDOztrQkFBTSxTQUFTLEVBQUMsUUFBUTs7ZUFBYztjQUN0QyxnQ0FBTSxTQUFTLEVBQUMsaUJBQWlCLEdBQVE7Y0FDekM7O2tCQUFNLFNBQVMsRUFBQyxRQUFROztlQUFZO2NBQ3BDLDZCQUFHLFNBQVMsRUFBQyx1QkFBdUIsRUFBQyxJQUFJLEVBQUMsb0JBQW9CLEdBQUc7YUFDL0Q7V0FDQTtTQUNGO09BQ0YsQ0FDUDtLQUNGOzs7V0FFTSxrQkFBRztBQUNSLGFBQU8sa0JBQUssTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFBO0tBQ3pCOzs7V0FFTyxtQkFBRztBQUNULFVBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHVCQUF1QixFQUFFLFNBQVMsQ0FBQyxDQUFBO0FBQ25ELFVBQUksQ0FBQyxTQUFTLENBQUMsc0NBQXNDLEVBQUUsQ0FBQTtLQUN4RDs7O1dBRU8sbUJBQUc7QUFDVCxVQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsRUFBRSxJQUFJLENBQUMsQ0FBQTtBQUM5QyxVQUFJLENBQUMsU0FBUyxDQUFDLHNDQUFzQyxFQUFFLENBQUE7S0FDeEQ7OztXQUVrQiw4QkFBRztBQUNwQixVQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFBO0tBQ3REOzs7V0FFUSxvQkFBRztBQUNWLGFBQU8sbUJBQW1CLENBQUE7S0FDM0I7Ozs2QkFFYSxhQUFHO0FBQ2YsWUFBTSxrQkFBSyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7S0FDekI7OztTQXRGa0IsV0FBVzs7O3FCQUFYLFdBQVciLCJmaWxlIjoiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3dlbGNvbWUvbGliL2NvbnNlbnQtdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG4vKiogQGpzeCBldGNoLmRvbSAqL1xuXG5pbXBvcnQgZXRjaCBmcm9tICdldGNoJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb25zZW50VmlldyB7XG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICBldGNoLmluaXRpYWxpemUodGhpcylcbiAgfVxuXG4gIHJlbmRlciAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPSd3ZWxjb21lJz5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J3dlbGNvbWUtY29udGFpbmVyJz5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0naGVhZGVyJz5cbiAgICAgICAgICAgIDxhIGhyZWY9J2h0dHBzOi8vYXRvbS5pby8nPlxuICAgICAgICAgICAgICA8c3ZnIGNsYXNzPVwid2VsY29tZS1sb2dvXCIgd2lkdGg9XCIzMzBweFwiIGhlaWdodD1cIjY4cHhcIiB2aWV3Qm94PVwiMCAwIDMzMCA2OFwiIHZlcnNpb249XCIxLjFcIj5cbiAgICAgICAgICAgICAgICA8ZyBzdHJva2U9XCJub25lXCIgc3Ryb2tlLXdpZHRoPVwiMVwiIGZpbGw9XCJub25lXCIgZmlsbC1ydWxlPVwiZXZlbm9kZFwiPlxuICAgICAgICAgICAgICAgICAgICA8ZyB0cmFuc2Zvcm09XCJ0cmFuc2xhdGUoMi4wMDAwMDAsIDEuMDAwMDAwKVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGcgdHJhbnNmb3JtPVwidHJhbnNsYXRlKDk2LjAwMDAwMCwgOC4wMDAwMDApXCIgZmlsbD1cImN1cnJlbnRDb2xvclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMTg1LjQ5OCwzLjM5OSBDMTg1LjQ5OCwyLjQxNyAxODYuMzQsMS41NzMgMTg3LjMyNCwxLjU3MyBMMTg3LjY3NCwxLjU3MyBDMTg4LjQ0NywxLjU3MyAxODkuMDEsMS45OTUgMTg5LjUsMi42MjggTDIwOC42NzYsMzAuODYyIEwyMjcuODUyLDIuNjI4IEMyMjguMjcyLDEuOTk1IDIyOC45MDUsMS41NzMgMjI5LjY3NiwxLjU3MyBMMjMwLjAyOCwxLjU3MyBDMjMxLjAxLDEuNTczIDIzMS44NTQsMi40MTcgMjMxLjg1NCwzLjM5OSBMMjMxLjg1NCw0OS40MDMgQzIzMS44NTQsNTAuMzg3IDIzMS4wMSw1MS4yMzEgMjMwLjAyOCw1MS4yMzEgQzIyOS4wNDQsNTEuMjMxIDIyOC4yMDIsNTAuMzg3IDIyOC4yMDIsNDkuNDAzIEwyMjguMjAyLDguMjQ2IEwyMTAuMTUxLDM0LjUxNSBDMjA5LjcyOSwzNS4xNDggMjA5LjIzNywzNS40MjggMjA4LjYwNiwzNS40MjggQzIwNy45NzMsMzUuNDI4IDIwNy40ODEsMzUuMTQ4IDIwNy4wNjEsMzQuNTE1IEwxODkuMDEsOC4yNDYgTDE4OS4wMSw0OS40NzUgQzE4OS4wMSw1MC40NTcgMTg4LjIzNyw1MS4yMzEgMTg3LjI1NCw1MS4yMzEgQzE4Ni4yNyw1MS4yMzEgMTg1LjQ5OCw1MC40NTggMTg1LjQ5OCw0OS40NzUgTDE4NS40OTgsMy4zOTkgTDE4NS40OTgsMy4zOTkgWlwiPjwvcGF0aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTExMy4wODYsMjYuNTA3IEwxMTMuMDg2LDI2LjM2NyBDMTEzLjA4NiwxMi45NTIgMTIyLjk5LDAuOTQxIDEzNy44ODEsMC45NDEgQzE1Mi43NywwLjk0MSAxNjIuNTMzLDEyLjgxMSAxNjIuNTMzLDI2LjIyNSBMMTYyLjUzMywyNi4zNjcgQzE2Mi41MzMsMzkuNzgyIDE1Mi42MjksNTEuNzkyIDEzNy43NCw1MS43OTIgQzEyMi44NSw1MS43OTIgMTEzLjA4NiwzOS45MjMgMTEzLjA4NiwyNi41MDcgTTE1OC43NCwyNi41MDcgTDE1OC43NCwyNi4zNjcgQzE1OC43NCwxNC4yMTYgMTQ5Ljg5LDQuMjQyIDEzNy43NCw0LjI0MiBDMTI1LjU4OCw0LjI0MiAxMTYuODc5LDE0LjA3NSAxMTYuODc5LDI2LjIyNSBMMTE2Ljg3OSwyNi4zNjcgQzExNi44NzksMzguNTE4IDEyNS43MjksNDguNDkxIDEzNy44ODEsNDguNDkxIEMxNTAuMDMxLDQ4LjQ5MSAxNTguNzQsMzguNjU4IDE1OC43NCwyNi41MDdcIj48L3BhdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk03Ni43MDUsNS4xNTUgTDYwLjk3Miw1LjE1NSBDNjAuMDYsNS4xNTUgNTkuMjg3LDQuMzg0IDU5LjI4NywzLjQ2OSBDNTkuMjg3LDIuNTU2IDYwLjA1OSwxLjc4MyA2MC45NzIsMS43ODMgTDk2LjA5MiwxLjc4MyBDOTcuMDA0LDEuNzgzIDk3Ljc3OCwyLjU1NSA5Ny43NzgsMy40NjkgQzk3Ljc3OCw0LjM4MyA5Ny4wMDUsNS4xNTUgOTYuMDkyLDUuMTU1IEw4MC4zNTgsNS4xNTUgTDgwLjM1OCw0OS40MDUgQzgwLjM1OCw1MC4zODcgNzkuNTE2LDUxLjIzMSA3OC41MzIsNTEuMjMxIEM3Ny41NSw1MS4yMzEgNzYuNzA2LDUwLjM4NyA3Ni43MDYsNDkuNDA1IEw3Ni43MDYsNS4xNTUgTDc2LjcwNSw1LjE1NSBaXCI+PC9wYXRoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMC4yOTEsNDguNTYyIEwyMS4yOTEsMy4wNSBDMjEuNzgzLDEuOTk1IDIyLjQ4NSwxLjI5MiAyMy43NSwxLjI5MiBMMjMuODkxLDEuMjkyIEMyNS4xNTUsMS4yOTIgMjUuODU4LDEuOTk1IDI2LjM0OCwzLjA1IEw0Ny4yNzksNDguNDIxIEM0Ny40OSw0OC44NDMgNDcuNTYsNDkuMTk0IDQ3LjU2LDQ5LjU0NiBDNDcuNTYsNTAuNDU4IDQ2Ljc4OCw1MS4yMzEgNDUuODAzLDUxLjIzMSBDNDQuOTYxLDUxLjIzMSA0NC4zMjksNTAuNTk5IDQzLjk3OCw0OS44MjYgTDM4LjIxOSwzNy4xODMgTDkuMjEsMzcuMTgzIEwzLjQ1LDQ5Ljg5NyBDMy4wOTksNTAuNzM5IDIuNTM4LDUxLjIzMSAxLjY5NCw1MS4yMzEgQzAuNzgxLDUxLjIzMSAwLjAwOCw1MC41MjkgMC4wMDgsNDkuNjg1IEMwLjAwOSw0OS40MDQgMC4wOCw0OC45ODMgMC4yOTEsNDguNTYyIEwwLjI5MSw0OC41NjIgWiBNMzYuNjczLDMzLjg4MiBMMjMuNzQ5LDUuNDM3IEwxMC43NTUsMzMuODgyIEwzNi42NzMsMzMuODgyIEwzNi42NzMsMzMuODgyIFpcIj48L3BhdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2c+XG4gICAgICAgICAgICAgICAgICAgICAgICA8Zz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTQwLjM2MywzMi4wNzUgQzQwLjg3NCwzNC40NCAzOS4zNzEsMzYuNzcgMzcuMDA2LDM3LjI4MiBDMzQuNjQxLDM3Ljc5MyAzMi4zMTEsMzYuMjkgMzEuNzk5LDMzLjkyNSBDMzEuMjg5LDMxLjU2IDMyLjc5MSwyOS4yMyAzNS4xNTYsMjguNzE4IEMzNy41MjEsMjguMjA3IDM5Ljg1MSwyOS43MSA0MC4zNjMsMzIuMDc1XCIgZmlsbD1cImN1cnJlbnRDb2xvclwiPjwvcGF0aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTQ4LjU3OCwyOC42MTUgQzU2Ljg1MSw0NS41ODcgNTguNTU4LDYxLjU4MSA1Mi4yODgsNjQuNzc4IEM0NS44MjIsNjguMDc2IDMzLjMyNiw1Ni41MjEgMjQuMzc1LDM4Ljk2OSBDMTUuNDI0LDIxLjQxOCAxMy40MDksNC41MTggMTkuODc0LDEuMjIxIEMyMi42ODksLTAuMjE2IDI2LjY0OCwxLjE2NiAzMC45NTksNC42MjlcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2Utd2lkdGg9XCIzLjA4XCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiPjwvcGF0aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTcuNjQsMzkuNDUgQzIuODA2LDM2Ljk0IC0wLjAwOSwzMy45MTUgMC4xNTQsMzAuNzkgQzAuNTMxLDIzLjU0MiAxNi43ODcsMTguNDk3IDM2LjQ2MiwxOS41MiBDNTYuMTM3LDIwLjU0NCA3MS43ODEsMjcuMjQ5IDcxLjQwNCwzNC40OTcgQzcxLjI0MSwzNy42MjIgNjguMTI3LDQwLjMzOCA2My4wNiw0Mi4zMzNcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2Utd2lkdGg9XCIzLjA4XCIgc3Ryb2tlLWxpbmVjYXA9XCJyb3VuZFwiPjwvcGF0aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTTI4LjgyOCw1OS4zNTQgQzIzLjU0NSw2My4xNjggMTguODQzLDY0LjU2MSAxNS45MDIsNjIuNjUzIEM5LjgxNCw1OC43MDIgMTMuNTcyLDQyLjEwMiAyNC4yOTYsMjUuNTc1IEMzNS4wMiw5LjA0OCA0OC42NDksLTEuMTQ5IDU0LjczNiwyLjgwMyBDNTcuNTY2LDQuNjM5IDU4LjI2OSw5LjIwOCA1Ny4xMzMsMTUuMjMyXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlLXdpZHRoPVwiMy4wOFwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIj48L3BhdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2c+XG4gICAgICAgICAgICAgICAgICAgIDwvZz5cbiAgICAgICAgICAgICAgICA8L2c+XG4gICAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICAgICAgPC9hPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwid2VsY29tZS1jb25zZW50XCI+XG4gICAgICAgICAgICA8cD5UbyBoZWxwIGltcHJvdmUgQXRvbSwgeW91IGNhbiBhbm9ueW1vdXNseSBzZW5kIHVzYWdlIHN0YXRzIHRvIHRoZSB0ZWFtLiBUaGUgcmVzdWx0aW5nIGRhdGEgcGxheXMgYSBrZXkgcm9sZSBpbiBkZWNpZGluZyB3aGF0IHRvIGZvY3VzIG9uLjwvcD5cbiAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cIndlbGNvbWUtbm90ZVwiPlRoZSBkYXRhIHdlIHNlbmQgaXMgbWluaW1hbC4gQnJvYWRseSwgd2Ugc2VuZCB0aGluZ3MgbGlrZSBzdGFydHVwIHRpbWUsIHNlc3Npb24gdGltZSwgYW5kIGV4Y2VwdGlvbnMg4oCUIG5ldmVyIGNvZGUgb3IgcGF0aHMuIFNlZSB0aGUgPGEgb25jbGljaz17dGhpcy5vcGVuTWV0cmljc1BhY2thZ2UuYmluZCh0aGlzKX0+YXRvbS9tZXRyaWNzIHBhY2thZ2U8L2E+IGZvciBkZXRhaWxzIG9uIHdoYXQgZGF0YSBpcyBzZW50LjwvcD5cblxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3ZWxjb21lLWNvbnNlbnQtY2hvaWNlc1wiPlxuICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuXCIgb25jbGljaz17dGhpcy5kZWNsaW5lLmJpbmQodGhpcyl9Pk5vLCBJIGRvbid0IHdhbnQgdG8gaGVscDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cIndlbGNvbWUtbm90ZVwiPkJ5IG9wdGluZyBvdXQsIHlvdXIgdXNhZ2UgcGF0dGVybnMgd2lsbCBub3QgYmUgdGFrZW4gaW50byBhY2NvdW50LiBXZSBvbmx5IHJlZ2lzdGVyIHRoYXQgeW91IG9wdGVkLW91dC48L3A+XG4gICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLXByaW1hcnlcIiBvbmNsaWNrPXt0aGlzLmNvbnNlbnQuYmluZCh0aGlzKX0+WWVzLCBJIHdhbnQgdG8gaGVscCBpbXByb3ZlIEF0b208L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ3ZWxjb21lLW5vdGVcIj5Zb3UgYXJlIGhlbHBpbmcgdXMgYXNzZXNzIEF0b20ncyBwZXJmb3JtYW5jZSBhbmQgdW5kZXJzdGFuZCB1c2FnZSBwYXR0ZXJucy48L3A+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIndlbGNvbWUtZm9vdGVyXCI+XG4gICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ3ZWxjb21lLWxvdmVcIj5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaWNvbiBpY29uLWNvZGVcIj48L3NwYW4+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImlubGluZVwiPiB3aXRoIDwvc3Bhbj5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaWNvbiBpY29uLWhlYXJ0XCI+PC9zcGFuPlxuICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJpbmxpbmVcIj4gYnkgPC9zcGFuPlxuICAgICAgICAgICAgICA8YSBjbGFzc05hbWU9XCJpY29uIGljb24tbG9nby1naXRodWJcIiBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tXCIgLz5cbiAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICB1cGRhdGUgKCkge1xuICAgIHJldHVybiBldGNoLnVwZGF0ZSh0aGlzKVxuICB9XG5cbiAgY29uc2VudCAoKSB7XG4gICAgYXRvbS5jb25maWcuc2V0KCdjb3JlLnRlbGVtZXRyeUNvbnNlbnQnLCAnbGltaXRlZCcpXG4gICAgYXRvbS53b3Jrc3BhY2UuY2xvc2VBY3RpdmVQYW5lSXRlbU9yRW1wdHlQYW5lT3JXaW5kb3coKVxuICB9XG5cbiAgZGVjbGluZSAoKSB7XG4gICAgYXRvbS5jb25maWcuc2V0KCdjb3JlLnRlbGVtZXRyeUNvbnNlbnQnLCAnbm8nKVxuICAgIGF0b20ud29ya3NwYWNlLmNsb3NlQWN0aXZlUGFuZUl0ZW1PckVtcHR5UGFuZU9yV2luZG93KClcbiAgfVxuXG4gIG9wZW5NZXRyaWNzUGFja2FnZSAoKSB7XG4gICAgYXRvbS53b3Jrc3BhY2Uub3BlbignYXRvbTovL2NvbmZpZy9wYWNrYWdlcy9tZXRyaWNzJylcbiAgfVxuXG4gIGdldFRpdGxlICgpIHtcbiAgICByZXR1cm4gXCJUZWxlbWV0cnkgQ29uc2VudFwiXG4gIH1cblxuICBhc3luYyBkZXN0cm95ICgpIHtcbiAgICBhd2FpdCBldGNoLmRlc3Ryb3kodGhpcylcbiAgfVxufVxuIl19
//# sourceURL=/Users/ah/.atom/packages/welcome/lib/consent-view.js
