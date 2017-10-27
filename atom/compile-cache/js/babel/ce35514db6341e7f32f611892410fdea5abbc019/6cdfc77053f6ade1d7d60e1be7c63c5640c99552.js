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
            _etch2['default'].dom(
              'label',
              null,
              _etch2['default'].dom('input', { className: 'input-checkbox', type: 'checkbox', checked: atom.config.get('welcome.showOnStartup'), onchange: this.didChangeShowOnStartup }),
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy93ZWxjb21lL2xpYi93ZWxjb21lLXZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztvQkFHaUIsTUFBTTs7OztJQUVGLFdBQVc7QUFDbEIsV0FETyxXQUFXLENBQ2pCLEtBQUssRUFBRTs7OzBCQURELFdBQVc7O0FBRTVCLFFBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFBO0FBQ2xCLHNCQUFLLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQTs7QUFFckIsUUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsVUFBQyxLQUFLLEVBQUs7QUFDaEQsVUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUE7QUFDdEMsVUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUU7QUFDOUIsY0FBSyxLQUFLLENBQUMsYUFBYSxDQUFDLFNBQVMsc0JBQW9CLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxXQUFRLENBQUE7T0FDakY7S0FDRixDQUFDLENBQUE7R0FDSDs7ZUFYa0IsV0FBVzs7V0FhUCxrQ0FBRztBQUN4QixVQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7S0FDdkQ7OztXQUVNLGtCQUFHLEVBQUU7OztXQUVGLHFCQUFHO0FBQ1gsYUFBTztBQUNMLG9CQUFZLEVBQUUsYUFBYTtBQUMzQixXQUFHLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHO09BQ3BCLENBQUE7S0FDRjs7O1dBRU0sa0JBQUc7QUFDUixhQUNFOztVQUFLLFNBQVMsRUFBQyxTQUFTO1FBQ3RCOztZQUFLLFNBQVMsRUFBQyxtQkFBbUI7VUFDaEM7O2NBQVEsU0FBUyxFQUFDLGdCQUFnQjtZQUNoQzs7Z0JBQUcsSUFBSSxFQUFDLGtCQUFrQjtj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S0FDN0I7OztTQTFGa0IsV0FBVzs7O3FCQUFYLFdBQVciLCJmaWxlIjoiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3dlbGNvbWUvbGliL3dlbGNvbWUtdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cbi8qKiBAanN4IGV0Y2guZG9tICoqL1xuXG5pbXBvcnQgZXRjaCBmcm9tICdldGNoJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXZWxjb21lVmlldyB7XG4gIGNvbnN0cnVjdG9yIChwcm9wcykge1xuICAgIHRoaXMucHJvcHMgPSBwcm9wc1xuICAgIGV0Y2guaW5pdGlhbGl6ZSh0aGlzKVxuXG4gICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgICBjb25zdCBsaW5rID0gZXZlbnQudGFyZ2V0LmNsb3Nlc3QoJ2EnKVxuICAgICAgaWYgKGxpbmsgJiYgbGluay5kYXRhc2V0LmV2ZW50KSB7XG4gICAgICAgIHRoaXMucHJvcHMucmVwb3J0ZXJQcm94eS5zZW5kRXZlbnQoYGNsaWNrZWQtd2VsY29tZS0ke2xpbmsuZGF0YXNldC5ldmVudH0tbGlua2ApXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGRpZENoYW5nZVNob3dPblN0YXJ0dXAgKCkge1xuICAgIGF0b20uY29uZmlnLnNldCgnd2VsY29tZS5zaG93T25TdGFydHVwJywgdGhpcy5jaGVja2VkKVxuICB9XG5cbiAgdXBkYXRlICgpIHt9XG5cbiAgc2VyaWFsaXplICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZGVzZXJpYWxpemVyOiAnV2VsY29tZVZpZXcnLFxuICAgICAgdXJpOiB0aGlzLnByb3BzLnVyaVxuICAgIH1cbiAgfVxuXG4gIHJlbmRlciAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPSd3ZWxjb21lJz5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J3dlbGNvbWUtY29udGFpbmVyJz5cbiAgICAgICAgICA8aGVhZGVyIGNsYXNzTmFtZT0nd2VsY29tZS1oZWFkZXInPlxuICAgICAgICAgICAgPGEgaHJlZj0naHR0cHM6Ly9hdG9tLmlvLyc+XG4gICAgICAgICAgICAgIDxzdmcgY2xhc3NOYW1lPSd3ZWxjb21lLWxvZ28nIHdpZHRoPSczMzBweCcgaGVpZ2h0PSc2OHB4JyB2aWV3Qm94PScwIDAgMzMwIDY4JyB2ZXJzaW9uPScxLjEnPlxuICAgICAgICAgICAgICAgIDxnIHN0cm9rZT0nbm9uZScgc3Ryb2tlLXdpZHRoPScxJyBmaWxsPSdub25lJyBmaWxsLXJ1bGU9J2V2ZW5vZGQnPlxuICAgICAgICAgICAgICAgICAgPGcgdHJhbnNmb3JtPSd0cmFuc2xhdGUoMi4wMDAwMDAsIDEuMDAwMDAwKSc+XG4gICAgICAgICAgICAgICAgICAgIDxnIHRyYW5zZm9ybT0ndHJhbnNsYXRlKDk2LjAwMDAwMCwgOC4wMDAwMDApJyBmaWxsPSdjdXJyZW50Q29sb3InPlxuICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9J00xODUuNDk4LDMuMzk5IEMxODUuNDk4LDIuNDE3IDE4Ni4zNCwxLjU3MyAxODcuMzI0LDEuNTczIEwxODcuNjc0LDEuNTczIEMxODguNDQ3LDEuNTczIDE4OS4wMSwxLjk5NSAxODkuNSwyLjYyOCBMMjA4LjY3NiwzMC44NjIgTDIyNy44NTIsMi42MjggQzIyOC4yNzIsMS45OTUgMjI4LjkwNSwxLjU3MyAyMjkuNjc2LDEuNTczIEwyMzAuMDI4LDEuNTczIEMyMzEuMDEsMS41NzMgMjMxLjg1NCwyLjQxNyAyMzEuODU0LDMuMzk5IEwyMzEuODU0LDQ5LjQwMyBDMjMxLjg1NCw1MC4zODcgMjMxLjAxLDUxLjIzMSAyMzAuMDI4LDUxLjIzMSBDMjI5LjA0NCw1MS4yMzEgMjI4LjIwMiw1MC4zODcgMjI4LjIwMiw0OS40MDMgTDIyOC4yMDIsOC4yNDYgTDIxMC4xNTEsMzQuNTE1IEMyMDkuNzI5LDM1LjE0OCAyMDkuMjM3LDM1LjQyOCAyMDguNjA2LDM1LjQyOCBDMjA3Ljk3MywzNS40MjggMjA3LjQ4MSwzNS4xNDggMjA3LjA2MSwzNC41MTUgTDE4OS4wMSw4LjI0NiBMMTg5LjAxLDQ5LjQ3NSBDMTg5LjAxLDUwLjQ1NyAxODguMjM3LDUxLjIzMSAxODcuMjU0LDUxLjIzMSBDMTg2LjI3LDUxLjIzMSAxODUuNDk4LDUwLjQ1OCAxODUuNDk4LDQ5LjQ3NSBMMTg1LjQ5OCwzLjM5OSBMMTg1LjQ5OCwzLjM5OSBaJyAvPlxuICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9J00xMTMuMDg2LDI2LjUwNyBMMTEzLjA4NiwyNi4zNjcgQzExMy4wODYsMTIuOTUyIDEyMi45OSwwLjk0MSAxMzcuODgxLDAuOTQxIEMxNTIuNzcsMC45NDEgMTYyLjUzMywxMi44MTEgMTYyLjUzMywyNi4yMjUgTDE2Mi41MzMsMjYuMzY3IEMxNjIuNTMzLDM5Ljc4MiAxNTIuNjI5LDUxLjc5MiAxMzcuNzQsNTEuNzkyIEMxMjIuODUsNTEuNzkyIDExMy4wODYsMzkuOTIzIDExMy4wODYsMjYuNTA3IE0xNTguNzQsMjYuNTA3IEwxNTguNzQsMjYuMzY3IEMxNTguNzQsMTQuMjE2IDE0OS44OSw0LjI0MiAxMzcuNzQsNC4yNDIgQzEyNS41ODgsNC4yNDIgMTE2Ljg3OSwxNC4wNzUgMTE2Ljg3OSwyNi4yMjUgTDExNi44NzksMjYuMzY3IEMxMTYuODc5LDM4LjUxOCAxMjUuNzI5LDQ4LjQ5MSAxMzcuODgxLDQ4LjQ5MSBDMTUwLjAzMSw0OC40OTEgMTU4Ljc0LDM4LjY1OCAxNTguNzQsMjYuNTA3JyAvPlxuICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9J003Ni43MDUsNS4xNTUgTDYwLjk3Miw1LjE1NSBDNjAuMDYsNS4xNTUgNTkuMjg3LDQuMzg0IDU5LjI4NywzLjQ2OSBDNTkuMjg3LDIuNTU2IDYwLjA1OSwxLjc4MyA2MC45NzIsMS43ODMgTDk2LjA5MiwxLjc4MyBDOTcuMDA0LDEuNzgzIDk3Ljc3OCwyLjU1NSA5Ny43NzgsMy40NjkgQzk3Ljc3OCw0LjM4MyA5Ny4wMDUsNS4xNTUgOTYuMDkyLDUuMTU1IEw4MC4zNTgsNS4xNTUgTDgwLjM1OCw0OS40MDUgQzgwLjM1OCw1MC4zODcgNzkuNTE2LDUxLjIzMSA3OC41MzIsNTEuMjMxIEM3Ny41NSw1MS4yMzEgNzYuNzA2LDUwLjM4NyA3Ni43MDYsNDkuNDA1IEw3Ni43MDYsNS4xNTUgTDc2LjcwNSw1LjE1NSBaJyAvPlxuICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9J00wLjI5MSw0OC41NjIgTDIxLjI5MSwzLjA1IEMyMS43ODMsMS45OTUgMjIuNDg1LDEuMjkyIDIzLjc1LDEuMjkyIEwyMy44OTEsMS4yOTIgQzI1LjE1NSwxLjI5MiAyNS44NTgsMS45OTUgMjYuMzQ4LDMuMDUgTDQ3LjI3OSw0OC40MjEgQzQ3LjQ5LDQ4Ljg0MyA0Ny41Niw0OS4xOTQgNDcuNTYsNDkuNTQ2IEM0Ny41Niw1MC40NTggNDYuNzg4LDUxLjIzMSA0NS44MDMsNTEuMjMxIEM0NC45NjEsNTEuMjMxIDQ0LjMyOSw1MC41OTkgNDMuOTc4LDQ5LjgyNiBMMzguMjE5LDM3LjE4MyBMOS4yMSwzNy4xODMgTDMuNDUsNDkuODk3IEMzLjA5OSw1MC43MzkgMi41MzgsNTEuMjMxIDEuNjk0LDUxLjIzMSBDMC43ODEsNTEuMjMxIDAuMDA4LDUwLjUyOSAwLjAwOCw0OS42ODUgQzAuMDA5LDQ5LjQwNCAwLjA4LDQ4Ljk4MyAwLjI5MSw0OC41NjIgTDAuMjkxLDQ4LjU2MiBaIE0zNi42NzMsMzMuODgyIEwyMy43NDksNS40MzcgTDEwLjc1NSwzMy44ODIgTDM2LjY3MywzMy44ODIgTDM2LjY3MywzMy44ODIgWicgLz5cbiAgICAgICAgICAgICAgICAgICAgPC9nPlxuICAgICAgICAgICAgICAgICAgICA8Zz5cbiAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSdNNDAuMzYzLDMyLjA3NSBDNDAuODc0LDM0LjQ0IDM5LjM3MSwzNi43NyAzNy4wMDYsMzcuMjgyIEMzNC42NDEsMzcuNzkzIDMyLjMxMSwzNi4yOSAzMS43OTksMzMuOTI1IEMzMS4yODksMzEuNTYgMzIuNzkxLDI5LjIzIDM1LjE1NiwyOC43MTggQzM3LjUyMSwyOC4yMDcgMzkuODUxLDI5LjcxIDQwLjM2MywzMi4wNzUnIGZpbGw9J2N1cnJlbnRDb2xvcicgLz5cbiAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSdNNDguNTc4LDI4LjYxNSBDNTYuODUxLDQ1LjU4NyA1OC41NTgsNjEuNTgxIDUyLjI4OCw2NC43NzggQzQ1LjgyMiw2OC4wNzYgMzMuMzI2LDU2LjUyMSAyNC4zNzUsMzguOTY5IEMxNS40MjQsMjEuNDE4IDEzLjQwOSw0LjUxOCAxOS44NzQsMS4yMjEgQzIyLjY4OSwtMC4yMTYgMjYuNjQ4LDEuMTY2IDMwLjk1OSw0LjYyOScgc3Ryb2tlPSdjdXJyZW50Q29sb3InIHN0cm9rZS13aWR0aD0nMy4wOCcgc3Ryb2tlLWxpbmVjYXA9J3JvdW5kJyAvPlxuICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9J003LjY0LDM5LjQ1IEMyLjgwNiwzNi45NCAtMC4wMDksMzMuOTE1IDAuMTU0LDMwLjc5IEMwLjUzMSwyMy41NDIgMTYuNzg3LDE4LjQ5NyAzNi40NjIsMTkuNTIgQzU2LjEzNywyMC41NDQgNzEuNzgxLDI3LjI0OSA3MS40MDQsMzQuNDk3IEM3MS4yNDEsMzcuNjIyIDY4LjEyNyw0MC4zMzggNjMuMDYsNDIuMzMzJyBzdHJva2U9J2N1cnJlbnRDb2xvcicgc3Ryb2tlLXdpZHRoPSczLjA4JyBzdHJva2UtbGluZWNhcD0ncm91bmQnIC8+XG4gICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0nTTI4LjgyOCw1OS4zNTQgQzIzLjU0NSw2My4xNjggMTguODQzLDY0LjU2MSAxNS45MDIsNjIuNjUzIEM5LjgxNCw1OC43MDIgMTMuNTcyLDQyLjEwMiAyNC4yOTYsMjUuNTc1IEMzNS4wMiw5LjA0OCA0OC42NDksLTEuMTQ5IDU0LjczNiwyLjgwMyBDNTcuNTY2LDQuNjM5IDU4LjI2OSw5LjIwOCA1Ny4xMzMsMTUuMjMyJyBzdHJva2U9J2N1cnJlbnRDb2xvcicgc3Ryb2tlLXdpZHRoPSczLjA4JyBzdHJva2UtbGluZWNhcD0ncm91bmQnIC8+XG4gICAgICAgICAgICAgICAgICAgIDwvZz5cbiAgICAgICAgICAgICAgICAgIDwvZz5cbiAgICAgICAgICAgICAgICA8L2c+XG4gICAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICAgICAgICA8aDEgY2xhc3NOYW1lPSd3ZWxjb21lLXRpdGxlJz5cbiAgICAgICAgICAgICAgICBBIGhhY2thYmxlIHRleHQgZWRpdG9yIGZvciB0aGUgMjE8c3VwPnN0PC9zdXA+IENlbnR1cnlcbiAgICAgICAgICAgICAgPC9oMT5cbiAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICA8L2hlYWRlcj5cblxuICAgICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT0nd2VsY29tZS1wYW5lbCc+XG4gICAgICAgICAgICA8cD5Gb3IgaGVscCwgcGxlYXNlIHZpc2l0PC9wPlxuICAgICAgICAgICAgPHVsPlxuICAgICAgICAgICAgICA8bGk+VGhlIDxhIGhyZWY9J2h0dHBzOi8vd3d3LmF0b20uaW8vZG9jcycgZGF0YXNldD17e2V2ZW50OiAnYXRvbS1kb2NzJ319PkF0b20gZG9jczwvYT4gZm9yIEd1aWRlcyBhbmQgdGhlIEFQSSByZWZlcmVuY2UuPC9saT5cbiAgICAgICAgICAgICAgPGxpPlRoZSBBdG9tIGZvcnVtIGF0IDxhIGhyZWY9J2h0dHA6Ly9kaXNjdXNzLmF0b20uaW8nIGRhdGFzZXQ9e3tldmVudDogJ2Rpc2N1c3MnfX0+ZGlzY3Vzcy5hdG9tLmlvPC9hPjwvbGk+XG4gICAgICAgICAgICAgIDxsaT5UaGUgPGEgaHJlZj0naHR0cHM6Ly9naXRodWIuY29tL2F0b20nIGRhdGFzZXQ9e3tldmVudDogJ2F0b20tb3JnJ319PkF0b20gb3JnPC9hPi4gVGhpcyBpcyB3aGVyZSBhbGwgR2l0SHViLWNyZWF0ZWQgQXRvbSBwYWNrYWdlcyBjYW4gYmUgZm91bmQuPC9saT5cbiAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgPC9zZWN0aW9uPlxuXG4gICAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPSd3ZWxjb21lLXBhbmVsJz5cbiAgICAgICAgICAgIDxsYWJlbD5cbiAgICAgICAgICAgICAgPGlucHV0IGNsYXNzTmFtZT0naW5wdXQtY2hlY2tib3gnIHR5cGU9J2NoZWNrYm94JyBjaGVja2VkPXthdG9tLmNvbmZpZy5nZXQoJ3dlbGNvbWUuc2hvd09uU3RhcnR1cCcpfSBvbmNoYW5nZT17dGhpcy5kaWRDaGFuZ2VTaG93T25TdGFydHVwfSAvPlxuICAgICAgICAgICAgICBTaG93IFdlbGNvbWUgR3VpZGUgd2hlbiBvcGVuaW5nIEF0b21cbiAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgPC9zZWN0aW9uPlxuXG4gICAgICAgICAgPGZvb3RlciBjbGFzc05hbWU9J3dlbGNvbWUtZm9vdGVyJz5cbiAgICAgICAgICAgIDxhIGhyZWY9J2h0dHBzOi8vYXRvbS5pby8nIGRhdGFzZXQ9e3tldmVudDogJ2Zvb3Rlci1hdG9tLWlvJ319PmF0b20uaW88L2E+IDxzcGFuIGNsYXNzTmFtZT0ndGV4dC1zdWJ0bGUnPsOXPC9zcGFuPiA8YSBjbGFzc05hbWU9J2ljb24gaWNvbi1vY3RvZmFjZScgaHJlZj0naHR0cHM6Ly9naXRodWIuY29tLycgZGF0YXNldD17e2V2ZW50OiAnZm9vdGVyLW9jdG9jYXQnfX0gLz5cbiAgICAgICAgICA8L2Zvb3Rlcj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICBnZXRVUkkgKCkge1xuICAgIHJldHVybiB0aGlzLnByb3BzLnVyaVxuICB9XG5cbiAgZ2V0VGl0bGUgKCkge1xuICAgIHJldHVybiAnV2VsY29tZSdcbiAgfVxuXG4gIGlzRXF1YWwgKG90aGVyKSB7XG4gICAgb3RoZXIgaW5zdGFuY2VvZiBXZWxjb21lVmlld1xuICB9XG59XG4iXX0=