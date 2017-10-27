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
      this.subscribe(atom.config.observe('fuzzy-finder.traverseIntoSymlinkDirectories', {
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