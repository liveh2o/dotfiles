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
      var pathsFound, task;
      if (this.paths != null) {
        this.setItems(this.paths);
      }
      if (atom.project.getPaths().length === 0) {
        this.setItems([]);
        return;
      }
      if (this.reloadPaths) {
        this.reloadPaths = false;
        task = this.runLoadPathsTask((function(_this) {
          return function() {
            if (_this.reloadAfterFirstLoad) {
              _this.reloadPaths = true;
              _this.reloadAfterFirstLoad = false;
            }
            return _this.populate();
          };
        })(this));
        if (this.paths != null) {
          return this.setLoading("Reindexing project\u2026");
        } else {
          this.setLoading("Indexing project\u2026");
          this.loadingBadge.text('0');
          pathsFound = 0;
          return task.on('load-paths:paths-found', (function(_this) {
            return function(paths) {
              pathsFound += paths.length;
              return _this.loadingBadge.text(humanize.intComma(pathsFound));
            };
          })(this));
        }
      }
    };

    ProjectView.prototype.dataForFilePaths = function() {
      var dataPromise, lastOpenedPath;
      dataPromise = ProjectView.__super__.dataForFilePaths.apply(this, arguments);
      if (lastOpenedPath = this.getLastOpenedPath()) {
        dataPromise = dataPromise.then(function(data) {
          var entry, filePath, index, _i, _len;
          for (index = _i = 0, _len = data.length; _i < _len; index = ++_i) {
            filePath = data[index].filePath;
            if (filePath === lastOpenedPath) {
              entry = data.splice(index, 1)[0];
              data.unshift(entry);
              return data;
            }
          }
        });
      }
      return dataPromise;
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
