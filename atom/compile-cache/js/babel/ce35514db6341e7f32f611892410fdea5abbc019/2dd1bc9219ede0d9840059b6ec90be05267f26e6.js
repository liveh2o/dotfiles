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

var _fsPlus = require('fs-plus');

var _fsPlus2 = _interopRequireDefault(_fsPlus);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fuzzyFinderView = require('./fuzzy-finder-view');

var _fuzzyFinderView2 = _interopRequireDefault(_fuzzyFinderView);

var GitStatusView = (function (_FuzzyFinderView) {
  _inherits(GitStatusView, _FuzzyFinderView);

  function GitStatusView() {
    _classCallCheck(this, GitStatusView);

    _get(Object.getPrototypeOf(GitStatusView.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(GitStatusView, [{
    key: 'toggle',
    value: _asyncToGenerator(function* () {
      if (this.panel && this.panel.isVisible()) {
        this.cancel();
      } else if (atom.project.getRepositories().some(function (repo) {
        return repo;
      })) {
        var paths = [];
        for (var repo of atom.project.getRepositories()) {
          if (repo) {
            var workingDirectory = repo.getWorkingDirectory();
            for (var filePath in repo.statuses) {
              filePath = _path2['default'].join(workingDirectory, filePath);
              if (_fsPlus2['default'].isFileSync(filePath)) {
                paths.push(filePath);
              }
            }
          }
        }
        this.show();
        yield this.setItems(paths);
      }
    })
  }, {
    key: 'getEmptyMessage',
    value: function getEmptyMessage() {
      return 'Nothing to commit, working directory clean';
    }
  }]);

  return GitStatusView;
})(_fuzzyFinderView2['default']);

exports['default'] = GitStatusView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9mdXp6eS1maW5kZXIvbGliL2dpdC1zdGF0dXMtdmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7c0JBRWUsU0FBUzs7OztvQkFDUCxNQUFNOzs7OytCQUVLLHFCQUFxQjs7OztJQUU1QixhQUFhO1lBQWIsYUFBYTs7V0FBYixhQUFhOzBCQUFiLGFBQWE7OytCQUFiLGFBQWE7OztlQUFiLGFBQWE7OzZCQUNuQixhQUFHO0FBQ2QsVUFBSSxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFLEVBQUU7QUFDeEMsWUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFBO09BQ2QsTUFBTSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBZSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQUMsSUFBSTtlQUFLLElBQUk7T0FBQSxDQUFDLEVBQUU7QUFDOUQsWUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFBO0FBQ2hCLGFBQUssSUFBTSxJQUFJLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxlQUFlLEVBQUUsRUFBRTtBQUNqRCxjQUFJLElBQUksRUFBRTtBQUNSLGdCQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFBO0FBQ25ELGlCQUFLLElBQUksUUFBUSxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7QUFDbEMsc0JBQVEsR0FBRyxrQkFBSyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsUUFBUSxDQUFDLENBQUE7QUFDaEQsa0JBQUksb0JBQUcsVUFBVSxDQUFDLFFBQVEsQ0FBQyxFQUFFO0FBQzNCLHFCQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFBO2VBQ3JCO2FBQ0Y7V0FDRjtTQUNGO0FBQ0QsWUFBSSxDQUFDLElBQUksRUFBRSxDQUFBO0FBQ1gsY0FBTSxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFBO09BQzNCO0tBQ0Y7OztXQUVlLDJCQUFHO0FBQ2pCLGFBQU8sNENBQTRDLENBQUE7S0FDcEQ7OztTQXhCa0IsYUFBYTs7O3FCQUFiLGFBQWEiLCJmaWxlIjoiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2Z1enp5LWZpbmRlci9saWIvZ2l0LXN0YXR1cy12aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBiYWJlbCAqL1xuXG5pbXBvcnQgZnMgZnJvbSAnZnMtcGx1cydcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5cbmltcG9ydCBGdXp6eUZpbmRlclZpZXcgZnJvbSAnLi9mdXp6eS1maW5kZXItdmlldydcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2l0U3RhdHVzVmlldyBleHRlbmRzIEZ1enp5RmluZGVyVmlldyB7XG4gIGFzeW5jIHRvZ2dsZSAoKSB7XG4gICAgaWYgKHRoaXMucGFuZWwgJiYgdGhpcy5wYW5lbC5pc1Zpc2libGUoKSkge1xuICAgICAgdGhpcy5jYW5jZWwoKVxuICAgIH0gZWxzZSBpZiAoYXRvbS5wcm9qZWN0LmdldFJlcG9zaXRvcmllcygpLnNvbWUoKHJlcG8pID0+IHJlcG8pKSB7XG4gICAgICBjb25zdCBwYXRocyA9IFtdXG4gICAgICBmb3IgKGNvbnN0IHJlcG8gb2YgYXRvbS5wcm9qZWN0LmdldFJlcG9zaXRvcmllcygpKSB7XG4gICAgICAgIGlmIChyZXBvKSB7XG4gICAgICAgICAgY29uc3Qgd29ya2luZ0RpcmVjdG9yeSA9IHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpXG4gICAgICAgICAgZm9yIChsZXQgZmlsZVBhdGggaW4gcmVwby5zdGF0dXNlcykge1xuICAgICAgICAgICAgZmlsZVBhdGggPSBwYXRoLmpvaW4od29ya2luZ0RpcmVjdG9yeSwgZmlsZVBhdGgpXG4gICAgICAgICAgICBpZiAoZnMuaXNGaWxlU3luYyhmaWxlUGF0aCkpIHtcbiAgICAgICAgICAgICAgcGF0aHMucHVzaChmaWxlUGF0aClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMuc2hvdygpXG4gICAgICBhd2FpdCB0aGlzLnNldEl0ZW1zKHBhdGhzKVxuICAgIH1cbiAgfVxuXG4gIGdldEVtcHR5TWVzc2FnZSAoKSB7XG4gICAgcmV0dXJuICdOb3RoaW5nIHRvIGNvbW1pdCwgd29ya2luZyBkaXJlY3RvcnkgY2xlYW4nXG4gIH1cbn1cbiJdfQ==