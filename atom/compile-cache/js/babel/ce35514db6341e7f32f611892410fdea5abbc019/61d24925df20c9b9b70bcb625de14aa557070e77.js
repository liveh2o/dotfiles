Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/** @babel */
/** @jsx etch.dom **/

var _etch = require('etch');

var _etch2 = _interopRequireDefault(_etch);

var WelcomeView = (function () {
  function WelcomeView(props) {
    var _this = this;

    _classCallCheck(this, WelcomeView);

    this.props = props;
    _etch2['default'].initialize(this);

    this.element.addEventListener('click', function (event) {
      var link = event.target.closest('a');
      if (link && link.dataset.event) {
        _this.props.reporterProxy.sendEvent('clicked-welcome-' + link.dataset.event + '-link');
      }
    });
  }

  _createClass(WelcomeView, [{
    key: 'didChangeShowOnStartup',
    value: function didChangeShowOnStartup() {
      atom.config.set('welcome.showOnStartup', this.checked);
    }
  }, {
    key: 'update',
    value: function update() {}
  }, {
    key: 'serialize',
    value: function serialize() {
      return {
        deserializer: 'WelcomeView',
        uri: this.props.uri
      };
    }
  }, {
    key: 'render',
    value: function render() {
      return _etch2['default'].dom(
        'div',
        { className: 'welcome' },
        _etch2['default'].dom(
          'div',
          { className: 'welcome-container' },
          _etch2['default'].dom(
            'header',
            { className: 'welcome-header' },
            _etch2['default'].dom(
              'a',
              { href: 'https://atom.io/' },
              _etch2['default'].dom(
                'svg',
                { className: 'welcome-logo', width: '330px', height: '68px', viewBox: '0 0 330 68', version: '1.1' },
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
              ),
              _etch2['default'].dom(
                'h1',
                { className: 'welcome-title' },
                'A hackable text editor for the 21',
                _etch2['default'].dom(
                  'sup',
                  null,
                  'st'
                ),
                ' Century'
              )
            )
          ),
          _etch2['default'].dom(
            'section',
            { className: 'welcome-panel' },
            _etch2['default'].dom(
              'p',
              null,
              'For help, please visit'
            ),
            _etch2['default'].dom(
              'ul',
              null,
              _etch2['default'].dom(
                'li',
                null,
                'The ',
                _etch2['default'].dom(
                  'a',
                  { href: 'https://www.atom.io/docs', dataset: { event: 'atom-docs' } },
                  'Atom docs'
                ),
                ' for Guides and the API reference.'
              ),
              _etch2['default'].dom(
                'li',
                null,
                'The Atom forum at ',
                _etch2['default'].dom(
                  'a',
                  { href: 'http://discuss.atom.io', dataset: { event: 'discuss' } },
                  'discuss.atom.io'
                )
              ),
              _etch2['default'].dom(
                'li',
                null,
                'The ',
                _etch2['default'].dom(
                  'a',
                  { href: 'https://github.com/atom', dataset: { event: 'atom-org' } },
                  'Atom org'
                ),
                '. This is where all GitHub-created Atom packages can be found.'
              )
            )
          ),
          _etch2['default'].dom(
            'section',
            { className: 'welcome-panel' },
            _etch2['default'].dom('input', { className: 'input-checkbox', type: 'checkbox', id: 'show-welcome-on-startup', checked: atom.config.get('welcome.showOnStartup'), onchange: this.didChangeShowOnStartup }),
            _etch2['default'].dom(
              'label',
              { 'for': 'show-welcome-on-startup' },
              'Show Welcome Guide when opening Atom'
            )
          ),
          _etch2['default'].dom(
            'footer',
            { className: 'welcome-footer' },
            _etch2['default'].dom(
              'a',
              { href: 'https://atom.io/', dataset: { event: 'footer-atom-io' } },
              'atom.io'
            ),
            ' ',
            _etch2['default'].dom(
              'span',
              { className: 'text-subtle' },
              '×'
            ),
            ' ',
            _etch2['default'].dom('a', { className: 'icon icon-octoface', href: 'https://github.com/', dataset: { event: 'footer-octocat' } })
          )
        )
      );
    }
  }, {
    key: 'getURI',
    value: function getURI() {
      return this.props.uri;
    }
  }, {
    key: 'getTitle',
    value: function getTitle() {
      return 'Welcome';
    }
  }, {
    key: 'isEqual',
    value: function isEqual(other) {
      other instanceof WelcomeView;
    }
  }]);

  return WelcomeView;
})();

exports['default'] = WelcomeView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy93ZWxjb21lL2xpYi93ZWxjb21lLXZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztvQkFHaUIsTUFBTTs7OztJQUVGLFdBQVc7QUFDbEIsV0FETyxXQUFXLENBQ2pCLEtBQUssRUFBRTs7OzBCQURELFdBQVc7O0FBRTVCLFFBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFBO0FBQ2xCLHNCQUFLLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQTs7QUFFckIsUUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsVUFBQyxLQUFLLEVBQUs7QUFDaEQsVUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUE7QUFDdEMsVUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUU7QUFDOUIsY0FBSyxLQUFLLENBQUMsYUFBYSxDQUFDLFNBQVMsc0JBQW9CLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxXQUFRLENBQUE7T0FDakY7S0FDRixDQUFDLENBQUE7R0FDSDs7ZUFYa0IsV0FBVzs7V0FhUCxrQ0FBRztBQUN4QixVQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7S0FDdkQ7OztXQUVNLGtCQUFHLEVBQUU7OztXQUVGLHFCQUFHO0FBQ1gsYUFBTztBQUNMLG9CQUFZLEVBQUUsYUFBYTtBQUMzQixXQUFHLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHO09BQ3BCLENBQUE7S0FDRjs7O1dBRU0sa0JBQUc7QUFDUixhQUNFOztVQUFLLFNBQVMsRUFBQyxTQUFTO1FBQ3RCOztZQUFLLFNBQVMsRUFBQyxtQkFBbUI7VUFDaEM7O2NBQVEsU0FBUyxFQUFDLGdCQUFnQjtZQUNoQzs7Z0JBQUcsSUFBSSxFQUFDLGtCQUFrQjtj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aUJBQUMsS0FBSyxFQUFFO0FBQ2QsV0FBSyxZQUFZLFdBQVcsQ0FBQTtLQUM3Qjs7O1NBeEZrQixXQUFXOzs7cUJBQVgsV0FBVyIsImZpbGUiOiIvVXNlcnMvYWgvLmF0b20vcGFja2FnZXMvd2VsY29tZS9saWIvd2VsY29tZS12aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuLyoqIEBqc3ggZXRjaC5kb20gKiovXG5cbmltcG9ydCBldGNoIGZyb20gJ2V0Y2gnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdlbGNvbWVWaWV3IHtcbiAgY29uc3RydWN0b3IgKHByb3BzKSB7XG4gICAgdGhpcy5wcm9wcyA9IHByb3BzXG4gICAgZXRjaC5pbml0aWFsaXplKHRoaXMpXG5cbiAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICAgIGNvbnN0IGxpbmsgPSBldmVudC50YXJnZXQuY2xvc2VzdCgnYScpXG4gICAgICBpZiAobGluayAmJiBsaW5rLmRhdGFzZXQuZXZlbnQpIHtcbiAgICAgICAgdGhpcy5wcm9wcy5yZXBvcnRlclByb3h5LnNlbmRFdmVudChgY2xpY2tlZC13ZWxjb21lLSR7bGluay5kYXRhc2V0LmV2ZW50fS1saW5rYClcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgZGlkQ2hhbmdlU2hvd09uU3RhcnR1cCAoKSB7XG4gICAgYXRvbS5jb25maWcuc2V0KCd3ZWxjb21lLnNob3dPblN0YXJ0dXAnLCB0aGlzLmNoZWNrZWQpXG4gIH1cblxuICB1cGRhdGUgKCkge31cblxuICBzZXJpYWxpemUgKCkge1xuICAgIHJldHVybiB7XG4gICAgICBkZXNlcmlhbGl6ZXI6ICdXZWxjb21lVmlldycsXG4gICAgICB1cmk6IHRoaXMucHJvcHMudXJpXG4gICAgfVxuICB9XG5cbiAgcmVuZGVyICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9J3dlbGNvbWUnPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nd2VsY29tZS1jb250YWluZXInPlxuICAgICAgICAgIDxoZWFkZXIgY2xhc3NOYW1lPSd3ZWxjb21lLWhlYWRlcic+XG4gICAgICAgICAgICA8YSBocmVmPSdodHRwczovL2F0b20uaW8vJz5cbiAgICAgICAgICAgICAgPHN2ZyBjbGFzc05hbWU9J3dlbGNvbWUtbG9nbycgd2lkdGg9JzMzMHB4JyBoZWlnaHQ9JzY4cHgnIHZpZXdCb3g9JzAgMCAzMzAgNjgnIHZlcnNpb249JzEuMSc+XG4gICAgICAgICAgICAgICAgPGcgc3Ryb2tlPSdub25lJyBzdHJva2Utd2lkdGg9JzEnIGZpbGw9J25vbmUnIGZpbGwtcnVsZT0nZXZlbm9kZCc+XG4gICAgICAgICAgICAgICAgICA8ZyB0cmFuc2Zvcm09J3RyYW5zbGF0ZSgyLjAwMDAwMCwgMS4wMDAwMDApJz5cbiAgICAgICAgICAgICAgICAgICAgPGcgdHJhbnNmb3JtPSd0cmFuc2xhdGUoOTYuMDAwMDAwLCA4LjAwMDAwMCknIGZpbGw9J2N1cnJlbnRDb2xvcic+XG4gICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0nTTE4NS40OTgsMy4zOTkgQzE4NS40OTgsMi40MTcgMTg2LjM0LDEuNTczIDE4Ny4zMjQsMS41NzMgTDE4Ny42NzQsMS41NzMgQzE4OC40NDcsMS41NzMgMTg5LjAxLDEuOTk1IDE4OS41LDIuNjI4IEwyMDguNjc2LDMwLjg2MiBMMjI3Ljg1MiwyLjYyOCBDMjI4LjI3MiwxLjk5NSAyMjguOTA1LDEuNTczIDIyOS42NzYsMS41NzMgTDIzMC4wMjgsMS41NzMgQzIzMS4wMSwxLjU3MyAyMzEuODU0LDIuNDE3IDIzMS44NTQsMy4zOTkgTDIzMS44NTQsNDkuNDAzIEMyMzEuODU0LDUwLjM4NyAyMzEuMDEsNTEuMjMxIDIzMC4wMjgsNTEuMjMxIEMyMjkuMDQ0LDUxLjIzMSAyMjguMjAyLDUwLjM4NyAyMjguMjAyLDQ5LjQwMyBMMjI4LjIwMiw4LjI0NiBMMjEwLjE1MSwzNC41MTUgQzIwOS43MjksMzUuMTQ4IDIwOS4yMzcsMzUuNDI4IDIwOC42MDYsMzUuNDI4IEMyMDcuOTczLDM1LjQyOCAyMDcuNDgxLDM1LjE0OCAyMDcuMDYxLDM0LjUxNSBMMTg5LjAxLDguMjQ2IEwxODkuMDEsNDkuNDc1IEMxODkuMDEsNTAuNDU3IDE4OC4yMzcsNTEuMjMxIDE4Ny4yNTQsNTEuMjMxIEMxODYuMjcsNTEuMjMxIDE4NS40OTgsNTAuNDU4IDE4NS40OTgsNDkuNDc1IEwxODUuNDk4LDMuMzk5IEwxODUuNDk4LDMuMzk5IFonIC8+XG4gICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0nTTExMy4wODYsMjYuNTA3IEwxMTMuMDg2LDI2LjM2NyBDMTEzLjA4NiwxMi45NTIgMTIyLjk5LDAuOTQxIDEzNy44ODEsMC45NDEgQzE1Mi43NywwLjk0MSAxNjIuNTMzLDEyLjgxMSAxNjIuNTMzLDI2LjIyNSBMMTYyLjUzMywyNi4zNjcgQzE2Mi41MzMsMzkuNzgyIDE1Mi42MjksNTEuNzkyIDEzNy43NCw1MS43OTIgQzEyMi44NSw1MS43OTIgMTEzLjA4NiwzOS45MjMgMTEzLjA4NiwyNi41MDcgTTE1OC43NCwyNi41MDcgTDE1OC43NCwyNi4zNjcgQzE1OC43NCwxNC4yMTYgMTQ5Ljg5LDQuMjQyIDEzNy43NCw0LjI0MiBDMTI1LjU4OCw0LjI0MiAxMTYuODc5LDE0LjA3NSAxMTYuODc5LDI2LjIyNSBMMTE2Ljg3OSwyNi4zNjcgQzExNi44NzksMzguNTE4IDEyNS43MjksNDguNDkxIDEzNy44ODEsNDguNDkxIEMxNTAuMDMxLDQ4LjQ5MSAxNTguNzQsMzguNjU4IDE1OC43NCwyNi41MDcnIC8+XG4gICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0nTTc2LjcwNSw1LjE1NSBMNjAuOTcyLDUuMTU1IEM2MC4wNiw1LjE1NSA1OS4yODcsNC4zODQgNTkuMjg3LDMuNDY5IEM1OS4yODcsMi41NTYgNjAuMDU5LDEuNzgzIDYwLjk3MiwxLjc4MyBMOTYuMDkyLDEuNzgzIEM5Ny4wMDQsMS43ODMgOTcuNzc4LDIuNTU1IDk3Ljc3OCwzLjQ2OSBDOTcuNzc4LDQuMzgzIDk3LjAwNSw1LjE1NSA5Ni4wOTIsNS4xNTUgTDgwLjM1OCw1LjE1NSBMODAuMzU4LDQ5LjQwNSBDODAuMzU4LDUwLjM4NyA3OS41MTYsNTEuMjMxIDc4LjUzMiw1MS4yMzEgQzc3LjU1LDUxLjIzMSA3Ni43MDYsNTAuMzg3IDc2LjcwNiw0OS40MDUgTDc2LjcwNiw1LjE1NSBMNzYuNzA1LDUuMTU1IFonIC8+XG4gICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0nTTAuMjkxLDQ4LjU2MiBMMjEuMjkxLDMuMDUgQzIxLjc4MywxLjk5NSAyMi40ODUsMS4yOTIgMjMuNzUsMS4yOTIgTDIzLjg5MSwxLjI5MiBDMjUuMTU1LDEuMjkyIDI1Ljg1OCwxLjk5NSAyNi4zNDgsMy4wNSBMNDcuMjc5LDQ4LjQyMSBDNDcuNDksNDguODQzIDQ3LjU2LDQ5LjE5NCA0Ny41Niw0OS41NDYgQzQ3LjU2LDUwLjQ1OCA0Ni43ODgsNTEuMjMxIDQ1LjgwMyw1MS4yMzEgQzQ0Ljk2MSw1MS4yMzEgNDQuMzI5LDUwLjU5OSA0My45NzgsNDkuODI2IEwzOC4yMTksMzcuMTgzIEw5LjIxLDM3LjE4MyBMMy40NSw0OS44OTcgQzMuMDk5LDUwLjczOSAyLjUzOCw1MS4yMzEgMS42OTQsNTEuMjMxIEMwLjc4MSw1MS4yMzEgMC4wMDgsNTAuNTI5IDAuMDA4LDQ5LjY4NSBDMC4wMDksNDkuNDA0IDAuMDgsNDguOTgzIDAuMjkxLDQ4LjU2MiBMMC4yOTEsNDguNTYyIFogTTM2LjY3MywzMy44ODIgTDIzLjc0OSw1LjQzNyBMMTAuNzU1LDMzLjg4MiBMMzYuNjczLDMzLjg4MiBMMzYuNjczLDMzLjg4MiBaJyAvPlxuICAgICAgICAgICAgICAgICAgICA8L2c+XG4gICAgICAgICAgICAgICAgICAgIDxnPlxuICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9J000MC4zNjMsMzIuMDc1IEM0MC44NzQsMzQuNDQgMzkuMzcxLDM2Ljc3IDM3LjAwNiwzNy4yODIgQzM0LjY0MSwzNy43OTMgMzIuMzExLDM2LjI5IDMxLjc5OSwzMy45MjUgQzMxLjI4OSwzMS41NiAzMi43OTEsMjkuMjMgMzUuMTU2LDI4LjcxOCBDMzcuNTIxLDI4LjIwNyAzOS44NTEsMjkuNzEgNDAuMzYzLDMyLjA3NScgZmlsbD0nY3VycmVudENvbG9yJyAvPlxuICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9J000OC41NzgsMjguNjE1IEM1Ni44NTEsNDUuNTg3IDU4LjU1OCw2MS41ODEgNTIuMjg4LDY0Ljc3OCBDNDUuODIyLDY4LjA3NiAzMy4zMjYsNTYuNTIxIDI0LjM3NSwzOC45NjkgQzE1LjQyNCwyMS40MTggMTMuNDA5LDQuNTE4IDE5Ljg3NCwxLjIyMSBDMjIuNjg5LC0wLjIxNiAyNi42NDgsMS4xNjYgMzAuOTU5LDQuNjI5JyBzdHJva2U9J2N1cnJlbnRDb2xvcicgc3Ryb2tlLXdpZHRoPSczLjA4JyBzdHJva2UtbGluZWNhcD0ncm91bmQnIC8+XG4gICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0nTTcuNjQsMzkuNDUgQzIuODA2LDM2Ljk0IC0wLjAwOSwzMy45MTUgMC4xNTQsMzAuNzkgQzAuNTMxLDIzLjU0MiAxNi43ODcsMTguNDk3IDM2LjQ2MiwxOS41MiBDNTYuMTM3LDIwLjU0NCA3MS43ODEsMjcuMjQ5IDcxLjQwNCwzNC40OTcgQzcxLjI0MSwzNy42MjIgNjguMTI3LDQwLjMzOCA2My4wNiw0Mi4zMzMnIHN0cm9rZT0nY3VycmVudENvbG9yJyBzdHJva2Utd2lkdGg9JzMuMDgnIHN0cm9rZS1saW5lY2FwPSdyb3VuZCcgLz5cbiAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSdNMjguODI4LDU5LjM1NCBDMjMuNTQ1LDYzLjE2OCAxOC44NDMsNjQuNTYxIDE1LjkwMiw2Mi42NTMgQzkuODE0LDU4LjcwMiAxMy41NzIsNDIuMTAyIDI0LjI5NiwyNS41NzUgQzM1LjAyLDkuMDQ4IDQ4LjY0OSwtMS4xNDkgNTQuNzM2LDIuODAzIEM1Ny41NjYsNC42MzkgNTguMjY5LDkuMjA4IDU3LjEzMywxNS4yMzInIHN0cm9rZT0nY3VycmVudENvbG9yJyBzdHJva2Utd2lkdGg9JzMuMDgnIHN0cm9rZS1saW5lY2FwPSdyb3VuZCcgLz5cbiAgICAgICAgICAgICAgICAgICAgPC9nPlxuICAgICAgICAgICAgICAgICAgPC9nPlxuICAgICAgICAgICAgICAgIDwvZz5cbiAgICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgICAgICAgIDxoMSBjbGFzc05hbWU9J3dlbGNvbWUtdGl0bGUnPlxuICAgICAgICAgICAgICAgIEEgaGFja2FibGUgdGV4dCBlZGl0b3IgZm9yIHRoZSAyMTxzdXA+c3Q8L3N1cD4gQ2VudHVyeVxuICAgICAgICAgICAgICA8L2gxPlxuICAgICAgICAgICAgPC9hPlxuICAgICAgICAgIDwvaGVhZGVyPlxuXG4gICAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPSd3ZWxjb21lLXBhbmVsJz5cbiAgICAgICAgICAgIDxwPkZvciBoZWxwLCBwbGVhc2UgdmlzaXQ8L3A+XG4gICAgICAgICAgICA8dWw+XG4gICAgICAgICAgICAgIDxsaT5UaGUgPGEgaHJlZj0naHR0cHM6Ly93d3cuYXRvbS5pby9kb2NzJyBkYXRhc2V0PXt7ZXZlbnQ6ICdhdG9tLWRvY3MnfX0+QXRvbSBkb2NzPC9hPiBmb3IgR3VpZGVzIGFuZCB0aGUgQVBJIHJlZmVyZW5jZS48L2xpPlxuICAgICAgICAgICAgICA8bGk+VGhlIEF0b20gZm9ydW0gYXQgPGEgaHJlZj0naHR0cDovL2Rpc2N1c3MuYXRvbS5pbycgZGF0YXNldD17e2V2ZW50OiAnZGlzY3Vzcyd9fT5kaXNjdXNzLmF0b20uaW88L2E+PC9saT5cbiAgICAgICAgICAgICAgPGxpPlRoZSA8YSBocmVmPSdodHRwczovL2dpdGh1Yi5jb20vYXRvbScgZGF0YXNldD17e2V2ZW50OiAnYXRvbS1vcmcnfX0+QXRvbSBvcmc8L2E+LiBUaGlzIGlzIHdoZXJlIGFsbCBHaXRIdWItY3JlYXRlZCBBdG9tIHBhY2thZ2VzIGNhbiBiZSBmb3VuZC48L2xpPlxuICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICA8L3NlY3Rpb24+XG5cbiAgICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9J3dlbGNvbWUtcGFuZWwnPlxuICAgICAgICAgICAgPGlucHV0IGNsYXNzTmFtZT0naW5wdXQtY2hlY2tib3gnIHR5cGU9J2NoZWNrYm94JyBpZD0nc2hvdy13ZWxjb21lLW9uLXN0YXJ0dXAnIGNoZWNrZWQ9e2F0b20uY29uZmlnLmdldCgnd2VsY29tZS5zaG93T25TdGFydHVwJyl9IG9uY2hhbmdlPXt0aGlzLmRpZENoYW5nZVNob3dPblN0YXJ0dXB9IC8+XG4gICAgICAgICAgICA8bGFiZWwgZm9yPSdzaG93LXdlbGNvbWUtb24tc3RhcnR1cCc+U2hvdyBXZWxjb21lIEd1aWRlIHdoZW4gb3BlbmluZyBBdG9tPC9sYWJlbD5cbiAgICAgICAgICA8L3NlY3Rpb24+XG5cbiAgICAgICAgICA8Zm9vdGVyIGNsYXNzTmFtZT0nd2VsY29tZS1mb290ZXInPlxuICAgICAgICAgICAgPGEgaHJlZj0naHR0cHM6Ly9hdG9tLmlvLycgZGF0YXNldD17e2V2ZW50OiAnZm9vdGVyLWF0b20taW8nfX0+YXRvbS5pbzwvYT4gPHNwYW4gY2xhc3NOYW1lPSd0ZXh0LXN1YnRsZSc+w5c8L3NwYW4+IDxhIGNsYXNzTmFtZT0naWNvbiBpY29uLW9jdG9mYWNlJyBocmVmPSdodHRwczovL2dpdGh1Yi5jb20vJyBkYXRhc2V0PXt7ZXZlbnQ6ICdmb290ZXItb2N0b2NhdCd9fSAvPlxuICAgICAgICAgIDwvZm9vdGVyPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIGdldFVSSSAoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMudXJpXG4gIH1cblxuICBnZXRUaXRsZSAoKSB7XG4gICAgcmV0dXJuICdXZWxjb21lJ1xuICB9XG5cbiAgaXNFcXVhbCAob3RoZXIpIHtcbiAgICBvdGhlciBpbnN0YW5jZW9mIFdlbGNvbWVWaWV3XG4gIH1cbn1cbiJdfQ==