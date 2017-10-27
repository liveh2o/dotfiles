(function() {
  module.exports = {
    configDefaults: {
      ignoredNames: [],
      traverseIntoSymlinkDirectories: false
    },
    activate: function(state) {
      var PathLoader, editor, _i, _len, _ref;
      atom.workspaceView.command('fuzzy-finder:toggle-file-finder', (function(_this) {
        return function() {
          return _this.createProjectView().toggle();
        };
      })(this));
      atom.workspaceView.command('fuzzy-finder:toggle-buffer-finder', (function(_this) {
        return function() {
          return _this.createBufferView().toggle();
        };
      })(this));
      atom.workspaceView.command('fuzzy-finder:toggle-git-status-finder', (function(_this) {
        return function() {
          return _this.createGitStatusView().toggle();
        };
      })(this));
      if (atom.project.getPath() != null) {
        PathLoader = require('./path-loader');
        this.loadPathsTask = PathLoader.startTask((function(_this) {
          return function(paths) {
            return _this.projectPaths = paths;
          };
        })(this));
      }
      _ref = atom.workspace.getEditors();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        editor = _ref[_i];
        editor.lastOpened = state[editor.getPath()];
      }
      return atom.workspaceView.eachPaneView(function(paneView) {
        var _ref1;
        if ((_ref1 = paneView.activeItem) != null) {
          _ref1.lastOpened = Date.now();
        }
        return paneView.on('pane:active-item-changed', function(e, item) {
          return item.lastOpened = Date.now();
        });
      });
    },
    deactivate: function() {
      if (this.loadPathsTask != null) {
        this.loadPathsTask.terminate();
        this.loadPathsTask = null;
      }
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
      return this.projectPaths = null;
    },
    serialize: function() {
      var editor, path, paths, _i, _len, _ref;
      paths = {};
      _ref = atom.workspace.getEditors();
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
      var ProjectView, _ref;
      if (this.projectView == null) {
        if ((_ref = this.loadPathsTask) != null) {
          _ref.terminate();
        }
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
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLGNBQUEsRUFDRTtBQUFBLE1BQUEsWUFBQSxFQUFjLEVBQWQ7QUFBQSxNQUNBLDhCQUFBLEVBQWdDLEtBRGhDO0tBREY7QUFBQSxJQUlBLFFBQUEsRUFBVSxTQUFDLEtBQUQsR0FBQTtBQUNSLFVBQUEsa0NBQUE7QUFBQSxNQUFBLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBbkIsQ0FBMkIsaUNBQTNCLEVBQThELENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQzVELEtBQUMsQ0FBQSxpQkFBRCxDQUFBLENBQW9CLENBQUMsTUFBckIsQ0FBQSxFQUQ0RDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTlELENBQUEsQ0FBQTtBQUFBLE1BRUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFuQixDQUEyQixtQ0FBM0IsRUFBZ0UsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDOUQsS0FBQyxDQUFBLGdCQUFELENBQUEsQ0FBbUIsQ0FBQyxNQUFwQixDQUFBLEVBRDhEO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBaEUsQ0FGQSxDQUFBO0FBQUEsTUFJQSxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQW5CLENBQTJCLHVDQUEzQixFQUFvRSxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUNsRSxLQUFDLENBQUEsbUJBQUQsQ0FBQSxDQUFzQixDQUFDLE1BQXZCLENBQUEsRUFEa0U7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFwRSxDQUpBLENBQUE7QUFPQSxNQUFBLElBQUcsOEJBQUg7QUFDRSxRQUFBLFVBQUEs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
//# sourceURL=/Users/ah/.atom/packages/fuzzy-finder/lib/main.coffee