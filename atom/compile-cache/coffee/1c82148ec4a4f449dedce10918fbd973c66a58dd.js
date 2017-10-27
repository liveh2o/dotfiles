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
      this.disposables.add(atom.config.onDidChange('fuzzy-finder.traverseIntoSymlinkDirectories', (function(_this) {
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
      var pathsFound, _ref1;
      if (this.paths != null) {
        this.setItems(this.paths);
      }
      if (atom.project.getPaths()[0] == null) {
        this.setItems([]);
        return;
      }
      if (this.reloadPaths) {
        this.reloadPaths = false;
        if ((_ref1 = this.loadPathsTask) != null) {
          _ref1.terminate();
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

    return ProjectView;

  })(FuzzyFinderView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDRGQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxJQUFLLE9BQUEsQ0FBUSxzQkFBUixFQUFMLENBQUQsQ0FBQTs7QUFBQSxFQUNBLE9BQW9DLE9BQUEsQ0FBUSxNQUFSLENBQXBDLEVBQUMsa0JBQUEsVUFBRCxFQUFhLDJCQUFBLG1CQURiLENBQUE7O0FBQUEsRUFFQSxRQUFBLEdBQVcsT0FBQSxDQUFRLGVBQVIsQ0FGWCxDQUFBOztBQUFBLEVBSUEsZUFBQSxHQUFrQixPQUFBLENBQVEscUJBQVIsQ0FKbEIsQ0FBQTs7QUFBQSxFQUtBLFVBQUEsR0FBYSxPQUFBLENBQVEsZUFBUixDQUxiLENBQUE7O0FBQUEsRUFPQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osa0NBQUEsQ0FBQTs7OztLQUFBOztBQUFBLDBCQUFBLEtBQUEsR0FBTyxJQUFQLENBQUE7O0FBQUEsMEJBQ0EsV0FBQSxHQUFhLElBRGIsQ0FBQTs7QUFBQSwwQkFFQSxvQkFBQSxHQUFzQixLQUZ0QixDQUFBOztBQUFBLDBCQUlBLFVBQUEsR0FBWSxTQUFFLEtBQUYsR0FBQTtBQUNWLFVBQUEsb0JBQUE7QUFBQSxNQURXLElBQUMsQ0FBQSxRQUFBLEtBQ1osQ0FBQTtBQUFBLE1BQUEsNkNBQUEsU0FBQSxDQUFBLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxXQUFELEdBQWUsR0FBQSxDQUFBLG1CQUZmLENBQUE7QUFJQSxNQUFBLHlDQUE4QixDQUFFLGdCQUFSLEdBQWlCLENBQXpDO0FBQUEsUUFBQSxJQUFDLENBQUEsV0FBRCxHQUFlLEtBQWYsQ0FBQTtPQUpBO0FBQUEsTUFNQSxhQUFBLEdBQWdCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDZCxVQUFBLElBQUcsbUJBQUg7bUJBQ0UsS0FB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
//# sourceURL=/Users/ah/.atom/packages/fuzzy-finder/lib/project-view.coffee