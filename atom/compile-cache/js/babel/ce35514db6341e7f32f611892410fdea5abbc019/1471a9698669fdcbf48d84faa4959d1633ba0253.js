Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** @babel */

var _atom = require('atom');

var _humanizePlus = require('humanize-plus');

var _humanizePlus2 = _interopRequireDefault(_humanizePlus);

var _fuzzyFinderView = require('./fuzzy-finder-view');

var _fuzzyFinderView2 = _interopRequireDefault(_fuzzyFinderView);

var _pathLoader = require('./path-loader');

var _pathLoader2 = _interopRequireDefault(_pathLoader);

var ProjectView = (function (_FuzzyFinderView) {
  _inherits(ProjectView, _FuzzyFinderView);

  function ProjectView(paths) {
    var _this = this;

    _classCallCheck(this, ProjectView);

    _get(Object.getPrototypeOf(ProjectView.prototype), 'constructor', this).call(this);
    this.disposables = new _atom.CompositeDisposable();
    this.paths = paths;
    this.reloadPaths = !this.paths || this.paths.length === 0;
    this.reloadAfterFirstLoad = false;

    var windowFocused = function windowFocused() {
      if (_this.paths) {
        _this.reloadPaths = true;
      } else {
        // The window gained focused while the first task was still running
        // so let it complete but reload the paths on the next populate call.
        _this.reloadAfterFirstLoad = true;
      }
    };
    window.addEventListener('focus', windowFocused);
    this.disposables.add(new _atom.Disposable(function () {
      window.removeEventListener('focus', windowFocused);
    }));

    this.disposables.add(atom.config.onDidChange('fuzzy-finder.ignoredNames', function () {
      _this.reloadPaths = true;
    }));
    this.disposables.add(atom.config.onDidChange('core.followSymlinks', function () {
      _this.reloadPaths = true;
    }));
    this.disposables.add(atom.config.onDidChange('core.ignoredNames', function () {
      _this.reloadPaths = true;
    }));
    this.disposables.add(atom.config.onDidChange('core.excludeVcsIgnoredPaths', function () {
      _this.reloadPaths = true;
    }));
    this.disposables.add(atom.project.onDidChangePaths(function () {
      _this.reloadPaths = true;
      _this.paths = null;
    }));
  }

  _createClass(ProjectView, [{
    key: 'destroy',
    value: function destroy() {
      if (this.loadPathsTask) {
        this.loadPathsTask.terminate();
      }

      this.disposables.dispose();
      return _get(Object.getPrototypeOf(ProjectView.prototype), 'destroy', this).call(this);
    }
  }, {
    key: 'toggle',
    value: _asyncToGenerator(function* () {
      if (this.panel && this.panel.isVisible()) {
        this.cancel();
      } else {
        this.show();
        yield this.populate();
      }
    })
  }, {
    key: 'populate',
    value: _asyncToGenerator(function* () {
      var _this2 = this;

      if (atom.project.getPaths().length === 0) {
        yield this.setItems([]);
        return;
      }

      yield this.setItems(this.paths || []);

      if (this.reloadPaths) {
        this.reloadPaths = false;
        var task = null;
        try {
          task = this.runLoadPathsTask(function () {
            if (_this2.reloadAfterFirstLoad) {
              _this2.reloadPaths = true;
              _this2.reloadAfterFirstLoad = false;
            }

            _this2.populate();
          });
        } catch (error) {
          // If, for example, a network drive is unmounted, @runLoadPathsTask will
          // throw ENOENT when it tries to get the realpath of all the project paths.
          // This catch block allows the file finder to still operate on the last
          // set of paths and still let the user know that something is wrong.
          if (error.code === 'ENOENT' || error.code === 'EPERM') {
            atom.notifications.addError('Project path not found!', { detail: error.message });
          } else {
            throw error;
          }
        }

        if (this.paths) {
          yield this.selectListView.update({ loadingMessage: 'Reindexing project…' });
        } else {
          yield this.selectListView.update({ loadingMessage: 'Indexing project…', loadingBadge: '0' });
          if (task) {
            (function () {
              var pathsFound = 0;
              task.on('load-paths:paths-found', function (paths) {
                pathsFound += paths.length;
                _this2.selectListView.update({ loadingMessage: 'Indexing project…', loadingBadge: _humanizePlus2['default'].intComma(pathsFound) });
              });
            })();
          }
        }
      }
    })
  }, {
    key: 'getEmptyMessage',
    value: function getEmptyMessage() {
      return 'Project is empty';
    }
  }, {
    key: 'projectRelativePathsForFilePaths',
    value: function projectRelativePathsForFilePaths(filePaths) {
      var projectRelativePaths = _get(Object.getPrototypeOf(ProjectView.prototype), 'projectRelativePathsForFilePaths', this).call(this, filePaths);
      var lastOpenedPath = this.getLastOpenedPath();
      if (lastOpenedPath) {
        for (var i = 0; i < projectRelativePaths.length; i++) {
          var filePath = projectRelativePaths[i].filePath;

          if (filePath === lastOpenedPath) {
            var _projectRelativePaths$splice = projectRelativePaths.splice(i, 1);

            var _projectRelativePaths$splice2 = _slicedToArray(_projectRelativePaths$splice, 1);

            var entry = _projectRelativePaths$splice2[0];

            projectRelativePaths.unshift(entry);
            break;
          }
        }
      }

      return projectRelativePaths;
    }
  }, {
    key: 'getLastOpenedPath',
    value: function getLastOpenedPath() {
      var activePath = null;
      var activePaneItem = atom.workspace.getActivePaneItem();
      if (activePaneItem && activePaneItem.getPath) {
        activePath = activePaneItem.getPath();
      }

      var lastOpenedEditor = null;
      for (var editor of atom.workspace.getTextEditors()) {
        var filePath = editor.getPath();
        if (!filePath) {
          continue;
        }

        if (activePath === filePath) {
          continue;
        }

        if (!lastOpenedEditor) {
          lastOpenedEditor = editor;
        }

        if (editor.lastOpened > lastOpenedEditor.lastOpened) {
          lastOpenedEditor = editor;
        }
      }

      return lastOpenedEditor ? lastOpenedEditor.getPath() : null;
    }
  }, {
    key: 'runLoadPathsTask',
    value: function runLoadPathsTask(fn) {
      var _this3 = this;

      if (this.loadPathsTask) {
        this.loadPathsTask.terminate();
      }

      this.loadPathsTask = _pathLoader2['default'].startTask(function (paths) {
        _this3.paths = paths;
        _this3.reloadPaths = false;
        if (fn) {
          fn();
        }
      });
      return this.loadPathsTask;
    }
  }]);

  return ProjectView;
})(_fuzzyFinderView2['default']);

exports['default'] = ProjectView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9mdXp6eS1maW5kZXIvbGliL3Byb2plY3Qtdmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztvQkFFOEMsTUFBTTs7NEJBQy9CLGVBQWU7Ozs7K0JBRVIscUJBQXFCOzs7OzBCQUMxQixlQUFlOzs7O0lBRWpCLFdBQVc7WUFBWCxXQUFXOztBQUNsQixXQURPLFdBQVcsQ0FDakIsS0FBSyxFQUFFOzs7MEJBREQsV0FBVzs7QUFFNUIsK0JBRmlCLFdBQVcsNkNBRXJCO0FBQ1AsUUFBSSxDQUFDLFdBQVcsR0FBRywrQkFBeUIsQ0FBQTtBQUM1QyxRQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQTtBQUNsQixRQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUE7QUFDekQsUUFBSSxDQUFDLG9CQUFvQixHQUFHLEtBQUssQ0FBQTs7QUFFakMsUUFBTSxhQUFhLEdBQUcsU0FBaEIsYUFBYSxHQUFTO0FBQzFCLFVBQUksTUFBSyxLQUFLLEVBQUU7QUFDZCxjQUFLLFdBQVcsR0FBRyxJQUFJLENBQUE7T0FDeEIsTUFBTTs7O0FBR0wsY0FBSyxvQkFBb0IsR0FBRyxJQUFJLENBQUE7T0FDakM7S0FDRixDQUFBO0FBQ0QsVUFBTSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxhQUFhLENBQUMsQ0FBQTtBQUMvQyxRQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxxQkFBZSxZQUFNO0FBQUUsWUFBTSxDQUFDLG1CQUFtQixDQUFDLE9BQU8sRUFBRSxhQUFhLENBQUMsQ0FBQTtLQUFFLENBQUMsQ0FBQyxDQUFBOztBQUVsRyxRQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQywyQkFBMkIsRUFBRSxZQUFNO0FBQUUsWUFB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QUFDeEIsWUFBSSxFQUFFLEVBQUU7QUFDTixZQUFFLEVBQUUsQ0FBQTtTQUNMO09BQ0YsQ0FBQyxDQUFBO0FBQ0YsYUFBTyxJQUFJLENBQUMsYUFBYSxDQUFBO0tBQzFCOzs7U0EvSmtCLFdBQVc7OztxQkFBWCxXQUFXIiwiZmlsZSI6Ii9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9mdXp6eS1maW5kZXIvbGliL3Byb2plY3Qtdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cblxuaW1wb3J0IHtEaXNwb3NhYmxlLCBDb21wb3NpdGVEaXNwb3NhYmxlfSBmcm9tICdhdG9tJ1xuaW1wb3J0IGh1bWFuaXplIGZyb20gJ2h1bWFuaXplLXBsdXMnXG5cbmltcG9ydCBGdXp6eUZpbmRlclZpZXcgZnJvbSAnLi9mdXp6eS1maW5kZXItdmlldydcbmltcG9ydCBQYXRoTG9hZGVyIGZyb20gJy4vcGF0aC1sb2FkZXInXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFByb2plY3RWaWV3IGV4dGVuZHMgRnV6enlGaW5kZXJWaWV3IHtcbiAgY29uc3RydWN0b3IgKHBhdGhzKSB7XG4gICAgc3VwZXIoKVxuICAgIHRoaXMuZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgdGhpcy5wYXRocyA9IHBhdGhzXG4gICAgdGhpcy5yZWxvYWRQYXRocyA9ICF0aGlzLnBhdGhzIHx8IHRoaXMucGF0aHMubGVuZ3RoID09PSAwXG4gICAgdGhpcy5yZWxvYWRBZnRlckZpcnN0TG9hZCA9IGZhbHNlXG5cbiAgICBjb25zdCB3aW5kb3dGb2N1c2VkID0gKCkgPT4ge1xuICAgICAgaWYgKHRoaXMucGF0aHMpIHtcbiAgICAgICAgdGhpcy5yZWxvYWRQYXRocyA9IHRydWVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFRoZSB3aW5kb3cgZ2FpbmVkIGZvY3VzZWQgd2hpbGUgdGhlIGZpcnN0IHRhc2sgd2FzIHN0aWxsIHJ1bm5pbmdcbiAgICAgICAgLy8gc28gbGV0IGl0IGNvbXBsZXRlIGJ1dCByZWxvYWQgdGhlIHBhdGhzIG9uIHRoZSBuZXh0IHBvcHVsYXRlIGNhbGwuXG4gICAgICAgIHRoaXMucmVsb2FkQWZ0ZXJGaXJzdExvYWQgPSB0cnVlXG4gICAgICB9XG4gICAgfVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdmb2N1cycsIHdpbmRvd0ZvY3VzZWQpXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5hZGQobmV3IERpc3Bvc2FibGUoKCkgPT4geyB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignZm9jdXMnLCB3aW5kb3dGb2N1c2VkKSB9KSlcblxuICAgIHRoaXMuZGlzcG9zYWJsZXMuYWRkKGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlKCdmdXp6eS1maW5kZXIuaWdub3JlZE5hbWVzJywgKCkgPT4geyB0aGlzLnJlbG9hZFBhdGhzID0gdHJ1ZSB9KSlcbiAgICB0aGlzLmRpc3Bvc2FibGVzLmFkZChhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSgnY29yZS5mb2xsb3dTeW1saW5rcycsICgpID0+IHsgdGhpcy5yZWxvYWRQYXRocyA9IHRydWUgfSkpXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5hZGQoYXRvbS5jb25maWcub25EaWRDaGFuZ2UoJ2NvcmUuaWdub3JlZE5hbWVzJywgKCkgPT4geyB0aGlzLnJlbG9hZFBhdGhzID0gdHJ1ZSB9KSlcbiAgICB0aGlzLmRpc3Bvc2FibGVzLmFkZChhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSgnY29yZS5leGNsdWRlVmNzSWdub3JlZFBhdGhzJywgKCkgPT4geyB0aGlzLnJlbG9hZFBhdGhzID0gdHJ1ZSB9KSlcbiAgICB0aGlzLmRpc3Bvc2FibGVzLmFkZChhdG9tLnByb2plY3Qub25EaWRDaGFuZ2VQYXRocygoKSA9PiB7XG4gICAgICB0aGlzLnJlbG9hZFBhdGhzID0gdHJ1ZVxuICAgICAgdGhpcy5wYXRocyA9IG51bGxcbiAgICB9KSlcbiAgfVxuXG4gIGRlc3Ryb3kgKCkge1xuICAgIGlmICh0aGlzLmxvYWRQYXRoc1Rhc2spIHtcbiAgICAgIHRoaXMubG9hZFBhdGhzVGFzay50ZXJtaW5hdGUoKVxuICAgIH1cblxuICAgIHRoaXMuZGlzcG9zYWJsZXMuZGlzcG9zZSgpXG4gICAgcmV0dXJuIHN1cGVyLmRlc3Ryb3koKVxuICB9XG5cbiAgYXN5bmMgdG9nZ2xlICgpIHtcbiAgICBpZiAodGhpcy5wYW5lbCAmJiB0aGlzLnBhbmVsLmlzVmlzaWJsZSgpKSB7XG4gICAgICB0aGlzLmNhbmNlbCgpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2hvdygpXG4gICAgICBhd2FpdCB0aGlzLnBvcHVsYXRlKClcbiAgICB9XG4gIH1cblxuICBhc3luYyBwb3B1bGF0ZSAoKSB7XG4gICAgaWYgKGF0b20ucHJvamVjdC5nZXRQYXRocygpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgYXdhaXQgdGhpcy5zZXRJdGVtcyhbXSlcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGF3YWl0IHRoaXMuc2V0SXRlbXModGhpcy5wYXRocyB8fCBbXSlcblxuICAgIGlmICh0aGlzLnJlbG9hZFBhdGhzKSB7XG4gICAgICB0aGlzLnJlbG9hZFBhdGhzID0gZmFsc2VcbiAgICAgIGxldCB0YXNrID0gbnVsbFxuICAgICAgdHJ5IHtcbiAgICAgICAgdGFzayA9IHRoaXMucnVuTG9hZFBhdGhzVGFzaygoKSA9PiB7XG4gICAgICAgICAgaWYgKHRoaXMucmVsb2FkQWZ0ZXJGaXJzdExvYWQpIHtcbiAgICAgICAgICAgIHRoaXMucmVsb2FkUGF0aHMgPSB0cnVlXG4gICAgICAgICAgICB0aGlzLnJlbG9hZEFmdGVyRmlyc3RMb2FkID0gZmFsc2VcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLnBvcHVsYXRlKClcbiAgICAgICAgfSlcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIC8vIElmLCBmb3IgZXhhbXBsZSwgYSBuZXR3b3JrIGRyaXZlIGlzIHVubW91bnRlZCwgQHJ1bkxvYWRQYXRoc1Rhc2sgd2lsbFxuICAgICAgICAvLyB0aHJvdyBFTk9FTlQgd2hlbiBpdCB0cmllcyB0byBnZXQgdGhlIHJlYWxwYXRoIG9mIGFsbCB0aGUgcHJvamVjdCBwYXRocy5cbiAgICAgICAgLy8gVGhpcyBjYXRjaCBibG9jayBhbGxvd3MgdGhlIGZpbGUgZmluZGVyIHRvIHN0aWxsIG9wZXJhdGUgb24gdGhlIGxhc3RcbiAgICAgICAgLy8gc2V0IG9mIHBhdGhzIGFuZCBzdGlsbCBsZXQgdGhlIHVzZXIga25vdyB0aGF0IHNvbWV0aGluZyBpcyB3cm9uZy5cbiAgICAgICAgaWYgKGVycm9yLmNvZGUgPT09ICdFTk9FTlQnIHx8IGVycm9yLmNvZGUgPT09ICdFUEVSTScpIHtcbiAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoJ1Byb2plY3QgcGF0aCBub3QgZm91bmQhJywge2RldGFpbDogZXJyb3IubWVzc2FnZX0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhyb3cgZXJyb3JcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5wYXRocykge1xuICAgICAgICBhd2FpdCB0aGlzLnNlbGVjdExpc3RWaWV3LnVwZGF0ZSh7bG9hZGluZ01lc3NhZ2U6ICdSZWluZGV4aW5nIHByb2plY3RcXHUyMDI2J30pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhd2FpdCB0aGlzLnNlbGVjdExpc3RWaWV3LnVwZGF0ZSh7bG9hZGluZ01lc3NhZ2U6ICdJbmRleGluZyBwcm9qZWN0XFx1MjAyNicsIGxvYWRpbmdCYWRnZTogJzAnfSlcbiAgICAgICAgaWYgKHRhc2spIHtcbiAgICAgICAgICBsZXQgcGF0aHNGb3VuZCA9IDBcbiAgICAgICAgICB0YXNrLm9uKCdsb2FkLXBhdGhzOnBhdGhzLWZvdW5kJywgKHBhdGhzKSA9PiB7XG4gICAgICAgICAgICBwYXRoc0ZvdW5kICs9IHBhdGhzLmxlbmd0aFxuICAgICAgICAgICAgdGhpcy5zZWxlY3RMaXN0Vmlldy51cGRhdGUoe2xvYWRpbmdNZXNzYWdlOiAnSW5kZXhpbmcgcHJvamVjdFxcdTIwMjYnLCBsb2FkaW5nQmFkZ2U6IGh1bWFuaXplLmludENvbW1hKHBhdGhzRm91bmQpfSlcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZ2V0RW1wdHlNZXNzYWdlICgpIHtcbiAgICByZXR1cm4gJ1Byb2plY3QgaXMgZW1wdHknXG4gIH1cblxuICBwcm9qZWN0UmVsYXRpdmVQYXRoc0ZvckZpbGVQYXRocyAoZmlsZVBhdGhzKSB7XG4gICAgY29uc3QgcHJvamVjdFJlbGF0aXZlUGF0aHMgPSBzdXBlci5wcm9qZWN0UmVsYXRpdmVQYXRoc0ZvckZpbGVQYXRocyhmaWxlUGF0aHMpXG4gICAgY29uc3QgbGFzdE9wZW5lZFBhdGggPSB0aGlzLmdldExhc3RPcGVuZWRQYXRoKClcbiAgICBpZiAobGFzdE9wZW5lZFBhdGgpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcHJvamVjdFJlbGF0aXZlUGF0aHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3Qge2ZpbGVQYXRofSA9IHByb2plY3RSZWxhdGl2ZVBhdGhzW2ldXG4gICAgICAgIGlmIChmaWxlUGF0aCA9PT0gbGFzdE9wZW5lZFBhdGgpIHtcbiAgICAgICAgICBjb25zdCBbZW50cnldID0gcHJvamVjdFJlbGF0aXZlUGF0aHMuc3BsaWNlKGksIDEpXG4gICAgICAgICAgcHJvamVjdFJlbGF0aXZlUGF0aHMudW5zaGlmdChlbnRyeSlcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHByb2plY3RSZWxhdGl2ZVBhdGhzXG4gIH1cblxuICBnZXRMYXN0T3BlbmVkUGF0aCAoKSB7XG4gICAgbGV0IGFjdGl2ZVBhdGggPSBudWxsXG4gICAgY29uc3QgYWN0aXZlUGFuZUl0ZW0gPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lSXRlbSgpXG4gICAgaWYgKGFjdGl2ZVBhbmVJdGVtICYmIGFjdGl2ZVBhbmVJdGVtLmdldFBhdGgpIHtcbiAgICAgIGFjdGl2ZVBhdGggPSBhY3RpdmVQYW5lSXRlbS5nZXRQYXRoKClcbiAgICB9XG5cbiAgICBsZXQgbGFzdE9wZW5lZEVkaXRvciA9IG51bGxcbiAgICBmb3IgKGNvbnN0IGVkaXRvciBvZiBhdG9tLndvcmtzcGFjZS5nZXRUZXh0RWRpdG9ycygpKSB7XG4gICAgICBjb25zdCBmaWxlUGF0aCA9IGVkaXRvci5nZXRQYXRoKClcbiAgICAgIGlmICghZmlsZVBhdGgpIHtcbiAgICAgICAgY29udGludWVcbiAgICAgIH1cblxuICAgICAgaWYgKGFjdGl2ZVBhdGggPT09IGZpbGVQYXRoKSB7XG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG5cbiAgICAgIGlmICghbGFzdE9wZW5lZEVkaXRvcikge1xuICAgICAgICBsYXN0T3BlbmVkRWRpdG9yID0gZWRpdG9yXG4gICAgICB9XG5cbiAgICAgIGlmIChlZGl0b3IubGFzdE9wZW5lZCA+IGxhc3RPcGVuZWRFZGl0b3IubGFzdE9wZW5lZCkge1xuICAgICAgICBsYXN0T3BlbmVkRWRpdG9yID0gZWRpdG9yXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGxhc3RPcGVuZWRFZGl0b3IgPyBsYXN0T3BlbmVkRWRpdG9yLmdldFBhdGgoKSA6IG51bGxcbiAgfVxuXG4gIHJ1bkxvYWRQYXRoc1Rhc2sgKGZuKSB7XG4gICAgaWYgKHRoaXMubG9hZFBhdGhzVGFzaykge1xuICAgICAgdGhpcy5sb2FkUGF0aHNUYXNrLnRlcm1pbmF0ZSgpXG4gICAgfVxuXG4gICAgdGhpcy5sb2FkUGF0aHNUYXNrID0gUGF0aExvYWRlci5zdGFydFRhc2soKHBhdGhzKSA9PiB7XG4gICAgICB0aGlzLnBhdGhzID0gcGF0aHNcbiAgICAgIHRoaXMucmVsb2FkUGF0aHMgPSBmYWxzZVxuICAgICAgaWYgKGZuKSB7XG4gICAgICAgIGZuKClcbiAgICAgIH1cbiAgICB9KVxuICAgIHJldHVybiB0aGlzLmxvYWRQYXRoc1Rhc2tcbiAgfVxufVxuIl19