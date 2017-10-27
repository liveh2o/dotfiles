(function() {
  var $, CompositeDisposable, Disposable, FuzzyFinderView, PathLoader, ProjectView, humanize, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  $ = require('atom-space-pen-views').$;

  _ref = require('atom'), Disposable = _ref.Disposable, CompositeDisposable = _ref.CompositeDisposable;

  humanize = require('humanize-plus');

  FuzzyFinderView = require('./fuzzy-finder-view');

  PathLoader = require('./path-loader');

  module.exports = ProjectView = (function(_super) {
    __extends(ProjectView, _super);

    function ProjectView() {
      return ProjectView.__super__.constructor.apply(this, arguments);
    }

    ProjectView.prototype.paths = null;

    ProjectView.prototype.reloadPaths = true;

    ProjectView.prototype.reloadAfterFirstLoad = false;

    ProjectView.prototype.initialize = function(paths) {
      var windowFocused, _ref1;
      this.paths = paths;
      ProjectView.__super__.initialize.apply(this, arguments);
      this.disposables = new CompositeDisposable;
      if (((_ref1 = this.paths) != null ? _ref1.length : void 0) > 0) {
        this.reloadPaths = false;
      }
      windowFocused = (function(_this) {
        return function() {
          if (_this.paths != null) {
            return _this.reloadPaths = true;
          } else {
            return _this.reloadAfterFirstLoad = true;
          }
        };
      })(this);
      window.addEventListener('focus', windowFocused);
      this.disposables.add(new Disposable(function() {
        return window.removeEventListener('focus', windowFocused);
      }));
      this.subscribeToConfig();
      return this.disposables.add(atom.project.onDidChangePaths((function(_this) {
        return function() {
          _this.reloadPaths = true;
          return _this.paths = null;
        };
      })(this)));
    };

    ProjectView.prototype.subscribeToConfig = function() {
      this.disposables.add(atom.config.onDidChange('fuzzy-finder.ignoredNames', (function(_this) {
        return function() {
          return _this.reloadPaths = true;
        };
      })(this)));
      this.disposables.add(atom.config.onDidChange('core.followSymlinks', (function(_this) {
        return function() {
          return _this.reloadPaths = true;
        };
      })(this)));
      this.disposables.add(atom.config.onDidChange('core.ignoredNames', (function(_this) {
        return function() {
          return _this.reloadPaths = true;
        };
      })(this)));
      return this.disposables.add(atom.config.onDidChange('core.excludeVcsIgnoredPaths', (function(_this) {
        return function() {
          return _this.reloadPaths = true;
        };
      })(this)));
    };

    ProjectView.prototype.toggle = function() {
      var _ref1;
      if ((_ref1 = this.panel) != null ? _ref1.isVisible() : void 0) {
        return this.cancel();
      } else {
        this.populate();
        return this.show();
      }
    };

    ProjectView.prototype.getEmptyMessage = function(itemCount) {
      if (itemCount === 0) {
        return 'Project is empty';
      } else {
        return ProjectView.__super__.getEmptyMessage.apply(this, arguments);
      }
    };

    ProjectView.prototype.populate = function() {
      var error, pathsFound, task;
      if (this.paths != null) {
        this.setItems(this.paths);
      }
      if (atom.project.getPaths().length === 0) {
        this.setItems([]);
        return;
      }
      if (this.reloadPaths) {
        this.reloadPaths = false;
        try {
          task = this.runLoadPathsTask((function(_this) {
            return function() {
              if (_this.reloadAfterFirstLoad) {
                _this.reloadPaths = true;
                _this.reloadAfterFirstLoad = false;
              }
              return _this.populate();
            };
          })(this));
        } catch (_error) {
          error = _error;
          if (error.code === 'ENOENT') {
            atom.notifications.addError('Project path not found!', {
              detail: error.message
            });
          } else {
            throw error;
          }
        }
        if (this.paths != null) {
          return this.setLoading("Reindexing project\u2026");
        } else {
          this.setLoading("Indexing project\u2026");
          this.loadingBadge.text('0');
          pathsFound = 0;
          return task != null ? task.on('load-paths:paths-found', (function(_this) {
            return function(paths) {
              pathsFound += paths.length;
              return _this.loadingBadge.text(humanize.intComma(pathsFound));
            };
          })(this)) : void 0;
        }
      }
    };

    ProjectView.prototype.projectRelativePathsForFilePaths = function() {
      var entry, filePath, index, lastOpenedPath, projectRelativePaths, _i, _len;
      projectRelativePaths = ProjectView.__super__.projectRelativePathsForFilePaths.apply(this, arguments);
      if (lastOpenedPath = this.getLastOpenedPath()) {
        for (index = _i = 0, _len = projectRelativePaths.length; _i < _len; index = ++_i) {
          filePath = projectRelativePaths[index].filePath;
          if (filePath === lastOpenedPath) {
            entry = projectRelativePaths.splice(index, 1)[0];
            projectRelativePaths.unshift(entry);
            break;
          }
        }
      }
      return projectRelativePaths;
    };

    ProjectView.prototype.getLastOpenedPath = function() {
      var activePath, editor, filePath, lastOpenedEditor, _i, _len, _ref1, _ref2;
      activePath = (_ref1 = atom.workspace.getActivePaneItem()) != null ? typeof _ref1.getPath === "function" ? _ref1.getPath() : void 0 : void 0;
      lastOpenedEditor = null;
      _ref2 = atom.workspace.getTextEditors();
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        editor = _ref2[_i];
        filePath = editor.getPath();
        if (!filePath) {
          continue;
        }
        if (activePath === filePath) {
          continue;
        }
        if (lastOpenedEditor == null) {
          lastOpenedEditor = editor;
        }
        if (editor.lastOpened > lastOpenedEditor.lastOpened) {
          lastOpenedEditor = editor;
        }
      }
      return lastOpenedEditor != null ? lastOpenedEditor.getPath() : void 0;
    };

    ProjectView.prototype.destroy = function() {
      var _ref1;
      if ((_ref1 = this.loadPathsTask) != null) {
        _ref1.terminate();
      }
      this.disposables.dispose();
      return ProjectView.__super__.destroy.apply(this, arguments);
    };

    ProjectView.prototype.runLoadPathsTask = function(fn) {
      var _ref1;
      if ((_ref1 = this.loadPathsTask) != null) {
        _ref1.terminate();
      }
      return this.loadPathsTask = PathLoader.startTask((function(_this) {
        return function(paths) {
          _this.paths = paths;
          _this.reloadPaths = false;
          return typeof fn === "function" ? fn() : void 0;
        };
      })(this));
    };

    return ProjectView;

  })(FuzzyFinderView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2Z1enp5LWZpbmRlci9saWIvcHJvamVjdC12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw0RkFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUMsSUFBSyxPQUFBLENBQVEsc0JBQVIsRUFBTCxDQUFELENBQUE7O0FBQUEsRUFDQSxPQUFvQyxPQUFBLENBQVEsTUFBUixDQUFwQyxFQUFDLGtCQUFBLFVBQUQsRUFBYSwyQkFBQSxtQkFEYixDQUFBOztBQUFBLEVBRUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxlQUFSLENBRlgsQ0FBQTs7QUFBQSxFQUlBLGVBQUEsR0FBa0IsT0FBQSxDQUFRLHFCQUFSLENBSmxCLENBQUE7O0FBQUEsRUFLQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGVBQVIsQ0FMYixDQUFBOztBQUFBLEVBT0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLGtDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSwwQkFBQSxLQUFBLEdBQU8sSUFBUCxDQUFBOztBQUFBLDBCQUNBLFdBQUEsR0FBYSxJQURiLENBQUE7O0FBQUEsMEJBRUEsb0JBQUEsR0FBc0IsS0FGdEIsQ0FBQTs7QUFBQSwwQkFJQSxVQUFBLEdBQVksU0FBRSxLQUFGLEdBQUE7QUFDVixVQUFBLG9CQUFBO0FBQUEsTUFEVyxJQUFDLENBQUEsUUFBQSxLQUNaLENBQUE7QUFBQSxNQUFBLDZDQUFBLFNBQUEsQ0FBQSxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsV0FBRCxHQUFlLEdBQUEsQ0FBQSxtQkFGZixDQUFBO0FBR0EsTUFBQSx5Q0FBOEIsQ0FBRSxnQkFBUixHQUFpQixDQUF6QztBQUFBLFFBQUEsSUFBQyxDQUFBLFdBQUQsR0FBZSxLQUFmLENBQUE7T0FIQTtBQUFBLE1BS0EsYUFBQSxHQUFnQixDQUFB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

//# sourceURL=/Users/ah/.atom/packages/fuzzy-finder/lib/project-view.coffee
