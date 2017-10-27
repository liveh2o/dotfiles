(function() {
  module.exports = {
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2Z1enp5LWZpbmRlci9saWIvbWFpbi5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsUUFBQSxFQUFVLFNBQUMsS0FBRCxHQUFBO0FBQ1IsVUFBQSxzQkFBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLE1BQUQsR0FBVSxJQUFWLENBQUE7QUFBQSxNQUVBLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFDRTtBQUFBLFFBQUEsaUNBQUEsRUFBbUMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7bUJBQ2pDLEtBQUMsQ0FBQSxpQkFBRCxDQUFBLENBQW9CLENBQUMsTUFBckIsQ0FBQSxFQURpQztVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQW5DO0FBQUEsUUFFQSxtQ0FBQSxFQUFxQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTttQkFDbkMsS0FBQyxDQUFBLGdCQUFELENBQUEsQ0FBbUIsQ0FBQyxNQUFwQixDQUFBLEVBRG1DO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FGckM7QUFBQSxRQUlBLHVDQUFBLEVBQXlDLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUN2QyxLQUFDLENBQUEsbUJBQUQsQ0FBQSxDQUFzQixDQUFDLE1BQXZCLENBQUEsRUFEdUM7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUp6QztPQURGLENBRkEsQ0FBQTtBQUFBLE1BVUEsT0FBTyxDQUFDLFFBQVIsQ0FBaUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFBRyxLQUFDLENB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

//# sourceURL=/Users/ah/.atom/packages/fuzzy-finder/lib/main.coffee
