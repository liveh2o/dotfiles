(function() {
  module.exports = {
    configDefaults: {
      ignoredNames: []
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
      _ref = atom.project.getEditors();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        editor = _ref[_i];
        editor.lastOpened = state[editor.getPath()];
      }
      return atom.workspaceView.eachPane(function(pane) {
        var _ref1;
        if ((_ref1 = pane.activeItem) != null) {
          _ref1.lastOpened = Date.now();
        }
        return pane.on('pane:active-item-changed', function(e, item) {
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
      _ref = atom.project.getEditors();
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLGNBQUEsRUFDRTtBQUFBLE1BQUEsWUFBQSxFQUFjLEVBQWQ7S0FERjtBQUFBLElBR0EsUUFBQSxFQUFVLFNBQUMsS0FBRCxHQUFBO0FBQ1IsVUFBQSxrQ0FBQTtBQUFBLE1BQUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFuQixDQUEyQixpQ0FBM0IsRUFBOEQsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDNUQsS0FBQyxDQUFBLGlCQUFELENBQUEsQ0FBb0IsQ0FBQyxNQUFyQixDQUFBLEVBRDREO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBOUQsQ0FBQSxDQUFBO0FBQUEsTUFFQSxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQW5CLENBQTJCLG1DQUEzQixFQUFnRSxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUM5RCxLQUFDLENBQUEsZ0JBQUQsQ0FBQSxDQUFtQixDQUFDLE1BQXBCLENBQUEsRUFEOEQ7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFoRSxDQUZBLENBQUE7QUFBQSxNQUlBLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBbkIsQ0FBMkIsdUNBQTNCLEVBQW9FLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQ2xFLEtBQUMsQ0FBQSxtQkFBRCxDQUFBLENBQXNCLENBQUMsTUFBdkIsQ0FBQSxFQURrRTtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXBFLENBSkEsQ0FBQTtBQU9BLE1BQUEsSUFBRyw4QkFBSDtBQUNFLFFBQUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxlQUFSLENBQWIsQ0FB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
//# sourceURL=/Users/ah/.atom/packages/fuzzy-finder/lib/fuzzy-finder.coffee