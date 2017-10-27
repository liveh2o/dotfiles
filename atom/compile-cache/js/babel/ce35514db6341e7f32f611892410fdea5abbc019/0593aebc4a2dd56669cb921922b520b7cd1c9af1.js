Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** @babel */

var _fuzzyFinderView = require('./fuzzy-finder-view');

var _fuzzyFinderView2 = _interopRequireDefault(_fuzzyFinderView);

var BufferView = (function (_FuzzyFinderView) {
  _inherits(BufferView, _FuzzyFinderView);

  function BufferView() {
    _classCallCheck(this, BufferView);

    _get(Object.getPrototypeOf(BufferView.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(BufferView, [{
    key: 'getEmptyMessage',
    value: function getEmptyMessage() {
      return 'No open editors';
    }
  }, {
    key: 'toggle',
    value: _asyncToGenerator(function* () {
      var _this = this;

      if (this.panel && this.panel.isVisible()) {
        this.cancel();
      } else {
        yield* (function* () {
          var editors = atom.workspace.getTextEditors().filter(function (editor) {
            return editor.getPath();
          });
          var activeEditor = atom.workspace.getActiveTextEditor();
          editors.sort(function (a, b) {
            if (a === activeEditor) {
              return 1;
            } else if (b === activeEditor) {
              return -1;
            } else {
              return (b.lastOpened || 1) - (a.lastOpened || 1);
            }
          });

          var paths = Array.from(new Set(editors.map(function (editor) {
            return editor.getPath();
          })));
          if (paths.length > 0) {
            _this.show();
            yield _this.setItems(paths);
          }
        })();
      }
    })
  }]);

  return BufferView;
})(_fuzzyFinderView2['default']);

exports['default'] = BufferView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9mdXp6eS1maW5kZXIvbGliL2J1ZmZlci12aWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OzsrQkFFNEIscUJBQXFCOzs7O0lBRTVCLFVBQVU7WUFBVixVQUFVOztXQUFWLFVBQVU7MEJBQVYsVUFBVTs7K0JBQVYsVUFBVTs7O2VBQVYsVUFBVTs7V0FDYiwyQkFBRztBQUNqQixhQUFPLGlCQUFpQixDQUFBO0tBQ3pCOzs7NkJBRVksYUFBRzs7O0FBQ2QsVUFBSSxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFLEVBQUU7QUFDeEMsWUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFBO09BQ2QsTUFBTTs7QUFDTCxjQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxVQUFDLE1BQU07bUJBQUssTUFBTSxDQUFDLE9BQU8sRUFBRTtXQUFBLENBQUMsQ0FBQTtBQUNwRixjQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFtQixFQUFFLENBQUE7QUFDekQsaUJBQU8sQ0FBQyxJQUFJLENBQUMsVUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFLO0FBQ3JCLGdCQUFJLENBQUMsS0FBSyxZQUFZLEVBQUU7QUFDdEIscUJBQU8sQ0FBQyxDQUFBO2FBQ1QsTUFBTSxJQUFJLENBQUMsS0FBSyxZQUFZLEVBQUU7QUFDN0IscUJBQU8sQ0FBQyxDQUFDLENBQUE7YUFDVixNQUFNO0FBQ0wscUJBQU8sQ0FBQyxDQUFDLENBQUMsVUFBVSxJQUFJLENBQUMsQ0FBQSxJQUFLLENBQUMsQ0FBQyxVQUFVLElBQUksQ0FBQyxDQUFBLEFBQUMsQ0FBQTthQUNqRDtXQUNGLENBQUMsQ0FBQTs7QUFFRixjQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBQyxNQUFNO21CQUFLLE1BQU0sQ0FBQyxPQUFPLEVBQUU7V0FBQSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQzVFLGNBQUksS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7QUFDcEIsa0JBQUssSUFBSSxFQUFFLENBQUE7QUFDWCxrQkFBTSxNQUFLLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQTtXQUMzQjs7T0FDRjtLQUNGOzs7U0EzQmtCLFVBQVU7OztxQkFBVixVQUFVIiwiZmlsZSI6Ii9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9mdXp6eS1maW5kZXIvbGliL2J1ZmZlci12aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG5pbXBvcnQgRnV6enlGaW5kZXJWaWV3IGZyb20gJy4vZnV6enktZmluZGVyLXZpZXcnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJ1ZmZlclZpZXcgZXh0ZW5kcyBGdXp6eUZpbmRlclZpZXcge1xuICBnZXRFbXB0eU1lc3NhZ2UgKCkge1xuICAgIHJldHVybiAnTm8gb3BlbiBlZGl0b3JzJ1xuICB9XG5cbiAgYXN5bmMgdG9nZ2xlICgpIHtcbiAgICBpZiAodGhpcy5wYW5lbCAmJiB0aGlzLnBhbmVsLmlzVmlzaWJsZSgpKSB7XG4gICAgICB0aGlzLmNhbmNlbCgpXG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGVkaXRvcnMgPSBhdG9tLndvcmtzcGFjZS5nZXRUZXh0RWRpdG9ycygpLmZpbHRlcigoZWRpdG9yKSA9PiBlZGl0b3IuZ2V0UGF0aCgpKVxuICAgICAgY29uc3QgYWN0aXZlRWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICBlZGl0b3JzLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgaWYgKGEgPT09IGFjdGl2ZUVkaXRvcikge1xuICAgICAgICAgIHJldHVybiAxXG4gICAgICAgIH0gZWxzZSBpZiAoYiA9PT0gYWN0aXZlRWRpdG9yKSB7XG4gICAgICAgICAgcmV0dXJuIC0xXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIChiLmxhc3RPcGVuZWQgfHwgMSkgLSAoYS5sYXN0T3BlbmVkIHx8IDEpXG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IHBhdGhzID0gQXJyYXkuZnJvbShuZXcgU2V0KGVkaXRvcnMubWFwKChlZGl0b3IpID0+IGVkaXRvci5nZXRQYXRoKCkpKSlcbiAgICAgIGlmIChwYXRocy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHRoaXMuc2hvdygpXG4gICAgICAgIGF3YWl0IHRoaXMuc2V0SXRlbXMocGF0aHMpXG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iXX0=