(function() {
  module.exports = {
    config: {
      ignoredNames: {
        type: 'array',
        "default": []
      },
      searchAllPanes: {
        description: "Whether to search through all open panes or just the active one. Holding shift inverts this setting.",
        type: 'boolean',
        "default": false
      },
      preserveLastSearch: {
        type: 'boolean',
        "default": false
      },
      useAlternateScoring: {
        description: "Prefers run of consecutive characters, acronyms and start of words. (Experimental)",
        type: 'boolean',
        "default": false
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2Z1enp5LWZpbmRlci9saWIvbWFpbi5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsTUFBQSxFQUNFO0FBQUEsTUFBQSxZQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxPQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsRUFEVDtPQURGO0FBQUEsTUFHQSxjQUFBLEVBQ0U7QUFBQSxRQUFBLFdBQUEsRUFBYSxzR0FBYjtBQUFBLFFBQ0EsSUFBQSxFQUFNLFNBRE47QUFBQSxRQUVBLFNBQUEsRUFBUyxLQUZUO09BSkY7QUFBQSxNQU9BLGtCQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsS0FEVDtPQVJGO0FBQUEsTUFVQSxtQkFBQSxFQUNFO0FBQUEsUUFBQSxXQUFBLEVBQWEsb0ZBQWI7QUFBQSxRQUNBLElBQUEsRUFBTSxTQUROO0FBQUEsUUFFQSxTQUFBLEVBQVMsS0FGVDtPQVhGO0tBREY7QUFBQSxJQWdCQSxRQUFBLEVBQVUsU0FBQyxLQUFELEdBQUE7QUFDUixVQUFBLHNCQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsTUFBRCxHQUFVLElBQVYsQ0FBQTtBQUFBLE1BRUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUNFO0FBQUEsUUFBQSxpQ0FBQSxFQUFtQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTttQkFDakMsS0FBQyxDQUFBLGlCQUFELENBQUEsQ0FBb0IsQ0FBQyxNQUFyQixDQUFBLEVBRGlDO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbkM7QUFBQSxRQUVBLG1DQUFBLEVBQXFDLENB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

//# sourceURL=/Users/ah/.atom/packages/fuzzy-finder/lib/main.coffee
