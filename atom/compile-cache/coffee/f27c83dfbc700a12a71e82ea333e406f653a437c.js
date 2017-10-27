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
      if (atom.project.getPaths().length === 0) {
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

    return ProjectView;

  })(FuzzyFinderView);

}).call(this);
