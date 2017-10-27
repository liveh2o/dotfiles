(function() {
  var $, FuzzyFinderView, PathLoader, ProjectView, humanize,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  $ = require('atom').$;

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
      var _ref;
      this.paths = paths;
      ProjectView.__super__.initialize.apply(this, arguments);
      if (((_ref = this.paths) != null ? _ref.length : void 0) > 0) {
        this.reloadPaths = false;
      }
      this.subscribe($(window), 'focus', (function(_this) {
        return function() {
          if (_this.paths != null) {
            return _this.reloadPaths = true;
          } else {
            return _this.reloadAfterFirstLoad = true;
          }
        };
      })(this));
      this.subscribeToConfig();
      return this.subscribe(atom.project, 'path-changed', (function(_this) {
        return function() {
          _this.reloadPaths = true;
          return _this.paths = null;
        };
      })(this));
    };

    ProjectView.prototype.subscribeToConfig = function() {
      this.subscribe(atom.config.observe('fuzzy-finder.ignoredNames', {
        callNow: false
      }, (function(_this) {
        return function() {
          return _this.reloadPaths = true;
        };
      })(this)));
      this.subscribe(atom.config.observe('core.ignoredNames', {
        callNow: false
      }, (function(_this) {
        return function() {
          return _this.reloadPaths = true;
        };
      })(this)));
      return this.subscribe(atom.config.observe('core.excludeVcsIgnoredPaths', {
        callNow: false
      }, (function(_this) {
        return function() {
          return _this.reloadPaths = true;
        };
      })(this)));
    };

    ProjectView.prototype.toggle = function() {
      if (this.hasParent()) {
        return this.cancel();
      } else if (atom.project.getPath() != null) {
        this.populate();
        return this.attach();
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
      var pathsFound, _ref;
      if (this.paths != null) {
        this.setItems(this.paths);
      }
      if (this.reloadPaths) {
        this.reloadPaths = false;
        if ((_ref = this.loadPathsTask) != null) {
          _ref.terminate();
        }
        this.loadPathsTask = PathLoader.startTask((function(_this) {
          return function(paths) {
            _this.paths = paths;
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
          return this.loadPathsTask.on('load-paths:paths-found', (function(_this) {
            return function(paths) {
              pathsFound += paths.length;
              return _this.loadingBadge.text(humanize.intComma(pathsFound));
            };
          })(this));
        }
      }
    };

    ProjectView.prototype.projectRelativePathsForFilePaths = function() {
      var index, lastOpenedPath, lastOpenedProjectRelativePath, projectRelativePath, projectRelativePaths, _i, _len;
      projectRelativePaths = ProjectView.__super__.projectRelativePathsForFilePaths.apply(this, arguments);
      if (lastOpenedPath = this.getLastOpenedPath()) {
        lastOpenedProjectRelativePath = atom.project.relativize(lastOpenedPath);
        for (index = _i = 0, _len = projectRelativePaths.length; _i < _len; index = ++_i) {
          projectRelativePath = projectRelativePaths[index].projectRelativePath;
          if (lastOpenedProjectRelativePath === projectRelativePath) {
            projectRelativePaths.splice(index, 1);
            break;
          }
        }
        projectRelativePaths.unshift({
          filePath: lastOpenedPath,
          projectRelativePath: lastOpenedProjectRelativePath
        });
      }
      return projectRelativePaths;
    };

    ProjectView.prototype.getLastOpenedPath = function() {
      var activePath, editor, filePath, lastOpenedEditor, _i, _len, _ref, _ref1;
      activePath = (_ref = atom.workspace.activePaneItem) != null ? typeof _ref.getPath === "function" ? _ref.getPath() : void 0 : void 0;
      lastOpenedEditor = null;
      _ref1 = atom.workspace.getEditors();
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        editor = _ref1[_i];
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

    ProjectView.prototype.beforeRemove = function() {
      var _ref;
      return (_ref = this.loadPathsTask) != null ? _ref.terminate() : void 0;
    };

    return ProjectView;

  })(FuzzyFinderView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHFEQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxJQUFLLE9BQUEsQ0FBUSxNQUFSLEVBQUwsQ0FBRCxDQUFBOztBQUFBLEVBQ0EsUUFBQSxHQUFXLE9BQUEsQ0FBUSxlQUFSLENBRFgsQ0FBQTs7QUFBQSxFQUdBLGVBQUEsR0FBa0IsT0FBQSxDQUFRLHFCQUFSLENBSGxCLENBQUE7O0FBQUEsRUFJQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGVBQVIsQ0FKYixDQUFBOztBQUFBLEVBTUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLGtDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSwwQkFBQSxLQUFBLEdBQU8sSUFBUCxDQUFBOztBQUFBLDBCQUNBLFdBQUEsR0FBYSxJQURiLENBQUE7O0FBQUEsMEJBRUEsb0JBQUEsR0FBc0IsS0FGdEIsQ0FBQTs7QUFBQSwwQkFJQSxVQUFBLEdBQVksU0FBRSxLQUFGLEdBQUE7QUFDVixVQUFBLElBQUE7QUFBQSxNQURXLElBQUMsQ0FBQSxRQUFBLEtBQ1osQ0FBQTtBQUFBLE1BQUEsNkNBQUEsU0FBQSxDQUFBLENBQUE7QUFFQSxNQUFBLHVDQUE4QixDQUFFLGdCQUFSLEdBQWlCLENBQXpDO0FBQUEsUUFBQSxJQUFDLENBQUEsV0FBRCxHQUFlLEtBQWYsQ0FBQTtPQUZBO0FBQUEsTUFJQSxJQUFDLENBQUEsU0FBRCxDQUFXLENBQUEsQ0FBRSxNQUFGLENBQVgsRUFBc0IsT0FBdEIsRUFBK0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUM3QixVQUFBLElBQUcsbUJBQUg7bUJBQ0UsS0FBQyxDQUFBLFdBQUQsR0FBZSxLQURqQjtXQUFBLE1BQUE7bUJBS0UsS0FBQyxDQUFBLG9CQUFELEdBQXdCLEtBTDFCO1dBRDZCO1FBQUEsRUFB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
//# sourceURL=/Users/ah/.atom/packages/fuzzy-finder/lib/project-view.coffee