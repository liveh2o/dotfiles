(function() {
  module.exports = {
    config: {
      ignoredNames: {
        type: 'array',
        "default": []
      }
    },
    activate: function(state) {
      var editor, _i, _len, _ref;
      this.active = true;
      atom.commands.add('atom-workspace', {
        'fuzzy-finder:toggle-file-finder': (function(_this) {
          return function() {
            return _this.createProjectView().toggle();
          };
        })(this),
        'fuzzy-finder:toggle-buffer-finder': (function(_this) {
          return function() {
            return _this.createBufferView().toggle();
          };
        })(this),
        'fuzzy-finder:toggle-git-status-finder': (function(_this) {
          return function() {
            return _this.createGitStatusView().toggle();
          };
        })(this)
      });
      process.nextTick((function(_this) {
        return function() {
          return _this.startLoadPathsTask();
        };
      })(this));
      _ref = atom.workspace.getTextEditors();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        editor = _ref[_i];
        editor.lastOpened = state[editor.getPath()];
      }
      return atom.workspace.observePanes(function(pane) {
        return pane.observeActiveItem(function(item) {
          return item != null ? item.lastOpened = Date.now() : void 0;
        });
      });
    },
    deactivate: function() {
      if (this.projectView != null) {
        this.projectView.destroy();
        this.projectView = null;
      }
      if (this.bufferView != null) {
        this.bufferView.destroy();
        this.bufferView = null;
      }
      if (this.gitStatusView != null) {
        this.gitStatusView.destroy();
        this.gitStatusView = null;
      }
      this.projectPaths = null;
      this.stopLoadPathsTask();
      return this.active = false;
    },
    serialize: function() {
      var editor, path, paths, _i, _len, _ref;
      paths = {};
      _ref = atom.workspace.getTextEditors();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        editor = _ref[_i];
        path = editor.getPath();
        if (path != null) {
          paths[path] = editor.lastOpened;
        }
      }
      return paths;
    },
    createProjectView: function() {
      var ProjectView;
      this.stopLoadPathsTask();
      if (this.projectView == null) {
        ProjectView = require('./project-view');
        this.projectView = new ProjectView(this.projectPaths);
        this.projectPaths = null;
      }
      return this.projectView;
    },
    createGitStatusView: function() {
      var GitStatusView;
      if (this.gitStatusView == null) {
        GitStatusView = require('./git-status-view');
        this.gitStatusView = new GitStatusView();
      }
      return this.gitStatusView;
    },
    createBufferView: function() {
      var BufferView;
      if (this.bufferView == null) {
        BufferView = require('./buffer-view');
        this.bufferView = new BufferView();
      }
      return this.bufferView;
    },
    startLoadPathsTask: function() {
      var PathLoader;
      this.stopLoadPathsTask();
      if (!this.active) {
        return;
      }
      if (atom.project.getPaths().length === 0) {
        return;
      }
      PathLoader = require('./path-loader');
      this.loadPathsTask = PathLoader.startTask((function(_this) {
        return function(projectPaths) {
          _this.projectPaths = projectPaths;
        };
      })(this));
      return this.projectPathsSubscription = atom.project.onDidChangePaths((function(_this) {
        return function() {
          _this.projectPaths = null;
          return _this.stopLoadPathsTask();
        };
      })(this));
    },
    stopLoadPathsTask: function() {
      var _ref, _ref1;
      if ((_ref = this.projectPathsSubscription) != null) {
        _ref.dispose();
      }
      this.projectPathsSubscription = null;
      if ((_ref1 = this.loadPathsTask) != null) {
        _ref1.terminate();
      }
      return this.loadPathsTask = null;
    }
  };

}).call(this);
