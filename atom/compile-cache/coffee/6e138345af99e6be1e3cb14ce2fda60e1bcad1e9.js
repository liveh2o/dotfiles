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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLGNBQUEsRUFDRTtBQUFBLE1BQUEsWUFBQSxFQUFjLEVBQWQ7S0FERjtBQUFBLElBR0EsUUFBQSxFQUFVLFNBQUMsS0FBRCxHQUFBO0FBQ1IsVUFBQSxrQ0FBQTtBQUFBLE1BQUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFuQixDQUEyQixpQ0FBM0IsRUFBOEQsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDNUQsS0FBQyxDQUFBLGlCQUFELENBQUEsQ0FBb0IsQ0FBQyxNQUFyQixDQUFBLEVBRDREO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBOUQsQ0FBQSxDQUFBO0FBQUEsTUFFQSxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQW5CLENBQTJCLG1DQUEzQixFQUFnRSxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUM5RCxLQUFDLENBQUEsZ0JBQUQsQ0FBQSxDQUFtQixDQUFDLE1BQXBCLENBQUEsRUFEOEQ7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFoRSxDQUZBLENBQUE7QUFBQSxNQUlBLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBbkIsQ0FBMkIsdUNBQTNCLEVBQW9FLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQ2xFLEtBQUMsQ0FBQSxtQkFBRCxDQUFBLENBQXNCLENBQUMsTUFBdkIsQ0FBQSxFQURrRTtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXBFLENBSkEsQ0FBQTtBQU9BLE1BQUEsSUFBRyw4QkFBSDtBQUNFLFFBQUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxlQUFSLENBQWIsQ0FBQTtBQUFBLFFBQ0EsSUFBQyxDQUFBLGFBQUQsR0FBaUIsVUFBVSxDQUFDLFNBQVgsQ0FBcUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFDLEtBQUQsR0FBQTttQkFBVyxLQUFDLENBQUEsWUFBRCxHQUFnQixNQUEzQjtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXJCLENBRGpCLENBREY7T0FQQTtBQVdBO0FBQUEsV0FBQSwyQ0FBQTswQkFBQTtBQUNFLFFBQUEsTUFBTSxDQUFDLFVBQVAsR0FBb0IsS0FBTSxDQUFBLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBQSxDQUExQixDQURGO0FBQUEsT0FYQTthQWNBLElBQUksQ0FBQyxhQUFhLENBQUMsWUFBbkIsQ0FBZ0MsU0FBQyxRQUFELEdBQUE7QUFDOUIsWUFBQSxLQUFBOztlQUFtQixDQUFFLFVBQXJCLEdBQWtDLElBQUksQ0FBQyxHQUFMLENBQUE7U0FBbEM7ZUFDQSxRQUFRLENBQUMsRUFBVCxDQUFZLDBCQUFaLEVBQXdDLFNBQUMsQ0FBRCxFQUFJLElBQUosR0FBQTtpQkFBYSxJQUFJLENBQUMsVUFBTCxHQUFrQixJQUFJLENBQUMsR0FBTCxDQUFBLEVBQS9CO1FBQUEsQ0FBeEMsRUFGOEI7TUFBQSxDQUFoQyxFQWZRO0lBQUEsQ0FIVjtBQUFBLElBc0JBLFVBQUEsRUFBWSxTQUFBLEdBQUE7QUFDVixNQUFBLElBQUcsMEJBQUg7QUFDRSxRQUFBLElBQUMsQ0FBQSxhQUFhLENBQUMsU0FBZixDQUFBLENBQUEsQ0FBQTtBQUFBLFFBQ0EsSUFBQyxDQUFBLGFBQUQsR0FBaUIsSUFEakIsQ0FERjtPQUFBO0FBR0EsTUFBQSxJQUFHLHdCQUFIO0FBQ0UsUUFBQSxJQUFDLENBQUEsV0FBVyxDQUFDLE9BQWIsQ0FBQSxDQUFBLENBQUE7QUFBQSxRQUNBLElBQUMsQ0FBQSxXQUFELEdBQWUsSUFEZixDQURGO09BSEE7QUFNQSxNQUFBLElBQUcsdUJBQUg7QUFDRSxRQUFBLElBQUMsQ0FBQSxVQUFVLENBQUMsT0FBWixDQUFBLENBQUEsQ0FBQTtBQUFBLFFBQ0EsSUFBQyxDQUFBLFVBQUQsR0FBYyxJQURkLENBREY7T0FOQTtBQVNBLE1BQUEsSUFBRywwQkFBSDtBQUNFLFFBQUEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxPQUFmLENBQUEsQ0FBQSxDQUFBO0FBQUEsUUFDQSxJQUFDLENBQUEsYUFBRCxHQUFpQixJQURqQixDQURGO09BVEE7YUFZQSxJQUFDLENBQUEsWUFBRCxHQUFnQixLQWJOO0lBQUEsQ0F0Qlo7QUFBQSxJQXFDQSxTQUFBLEVBQVcsU0FBQSxHQUFBO0FBQ1QsVUFBQSxtQ0FBQTtBQUFBLE1BQUEsS0FBQSxHQUFRLEVBQVIsQ0FBQTtBQUNBO0FBQUEsV0FBQSwyQ0FBQTswQkFBQTtBQUNFLFFBQUEsSUFBQSxHQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUFBO0FBQ0EsUUFBQSxJQUFtQyxZQUFuQztBQUFBLFVBQUEsS0FBTSxDQUFBLElBQUEsQ0FBTixHQUFjLE1BQU0sQ0FBQyxVQUFyQixDQUFBO1NBRkY7QUFBQSxPQURBO2FBSUEsTUFMUztJQUFBLENBckNYO0FBQUEsSUE0Q0EsaUJBQUEsRUFBb0IsU0FBQSxHQUFBO0FBQ2xCLFVBQUEsaUJBQUE7QUFBQSxNQUFBLElBQU8sd0JBQVA7O2NBQ2dCLENBQUUsU0FBaEIsQ0FBQTtTQUFBO0FBQUEsUUFDQSxXQUFBLEdBQWUsT0FBQSxDQUFRLGdCQUFSLENBRGYsQ0FBQTtBQUFBLFFBRUEsSUFBQyxDQUFBLFdBQUQsR0FBbUIsSUFBQSxXQUFBLENBQVksSUFBQyxDQUFBLFlBQWIsQ0FGbkIsQ0FBQTtBQUFBLFFBR0EsSUFBQyxDQUFBLFlBQUQsR0FBZ0IsSUFIaEIsQ0FERjtPQUFBO2FBS0EsSUFBQyxDQUFBLFlBTmlCO0lBQUEsQ0E1Q3BCO0FBQUEsSUFvREEsbUJBQUEsRUFBc0IsU0FBQSxHQUFBO0FBQ3BCLFVBQUEsYUFBQTtBQUFBLE1BQUEsSUFBTywwQkFBUDtBQUNFLFFBQUEsYUFBQSxHQUFpQixPQUFBLENBQVEsbUJBQVIsQ0FBakIsQ0FBQTtBQUFBLFFBQ0EsSUFBQyxDQUFBLGFBQUQsR0FBcUIsSUFBQSxhQUFBLENBQUEsQ0FEckIsQ0FERjtPQUFBO2FBR0EsSUFBQyxDQUFBLGNBSm1CO0lBQUEsQ0FwRHRCO0FBQUEsSUEwREEsZ0JBQUEsRUFBa0IsU0FBQSxHQUFBO0FBQ2hCLFVBQUEsVUFBQTtBQUFBLE1BQUEsSUFBTyx1QkFBUDtBQUNFLFFBQUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxlQUFSLENBQWIsQ0FBQTtBQUFBLFFBQ0EsSUFBQyxDQUFBLFVBQUQsR0FBa0IsSUFBQSxVQUFBLENBQUEsQ0FEbEIsQ0FERjtPQUFBO2FBR0EsSUFBQyxDQUFBLFdBSmU7SUFBQSxDQTFEbEI7R0FERixDQUFBO0FBQUEiCn0=
//# sourceURL=/Users/ah/.atom/packages/fuzzy-finder/lib/main.coffee