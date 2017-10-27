(function() {
  module.exports = {
    config: {
      ignoredNames: {
        type: 'array',
        "default": [],
        description: 'List of string glob patterns. Files and directories matching these patterns will be ignored. This list is merged with the list defined by the core `Ignored Names` config setting. Example: `.git, ._*, Thumbs.db`.'
      },
      searchAllPanes: {
        type: 'boolean',
        "default": false,
        description: 'Search all panes when opening files. If disabled, only the active pane is searched. Holding `shift` inverts this setting.'
      },
      preserveLastSearch: {
        type: 'boolean',
        "default": false,
        description: 'Remember the typed query when closing the fuzzy finder and use that as the starting query next time the fuzzy finder is opened.'
      },
      useAlternateScoring: {
        type: 'boolean',
        "default": true,
        description: 'Use an alternative scoring approach which prefers run of consecutive characters, acronyms and start of words. (Experimental)'
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2Z1enp5LWZpbmRlci9saWIvbWFpbi5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLEVBQUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsTUFBQSxFQUNFO0FBQUEsTUFBQSxZQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxPQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsRUFEVDtBQUFBLFFBRUEsV0FBQSxFQUFhLHFOQUZiO09BREY7QUFBQSxNQUlBLGNBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxLQURUO0FBQUEsUUFFQSxXQUFBLEVBQWEsMkhBRmI7T0FMRjtBQUFBLE1BUUEsa0JBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxLQURUO0FBQUEsUUFFQSxXQUFBLEVBQWEsaUlBRmI7T0FURjtBQUFBLE1BWUEsbUJBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxJQURUO0FBQUEsUUFFQSxXQUFBLEVBQWEsOEhBRmI7T0FiRjtLQURGO0FBQUEsSUFrQkEsUUFBQSxFQUFVLFNBQUMsS0FBRCxHQUFBO0FBQ1IsVUFBQSxzQkFBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLE1BQUQsR0FBVSxJQUFWLENBQUE7QUFBQSxNQUVBLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFDRTtBQUFBLFFBQUEsaUNBQUEsRUFBbUMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7bUJBQ2pDLEtBQUMsQ0FBQSxpQkFBRCxDQUFBLENBQW9CLENBQUMsTUFBckIsQ0FBQSxFQURpQztVQUFBLEVBQUE7UUFB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

//# sourceURL=/Users/ah/.atom/packages/fuzzy-finder/lib/main.coffee
