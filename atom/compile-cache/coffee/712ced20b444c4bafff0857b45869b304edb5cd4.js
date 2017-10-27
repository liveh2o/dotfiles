(function() {
  module.exports = {
    config: {
      ignoredNames: {
        type: 'array',
        "default": []
      },
      traverseIntoSymlinkDirectories: {
        type: 'boolean',
        "default": false
      }
    },
    activate: function(state) {
      var PathLoader, editor, _i, _len, _ref;
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
      if (atom.project.getPaths()[0] != null) {
        PathLoader = require('./path-loader');
        this.loadPathsTask = PathLoader.startTask((function(_this) {
          return function(paths) {
            return _this.projectPaths = paths;
          };
        })(this));
      }
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLE1BQUEsRUFDRTtBQUFBLE1BQUEsWUFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sT0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLEVBRFQ7T0FERjtBQUFBLE1BR0EsOEJBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxLQURUO09BSkY7S0FERjtBQUFBLElBUUEsUUFBQSxFQUFVLFNBQUMsS0FBRCxHQUFBO0FBQ1IsVUFBQSxrQ0FBQTtBQUFBLE1BQUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUNFO0FBQUEsUUFBQSxpQ0FBQSxFQUFtQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTttQkFDakMsS0FBQyxDQUFBLGlCQUFELENBQUEsQ0FBb0IsQ0FBQyxNQUFyQixDQUFBLEVBRGlDO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbkM7QUFBQSxRQUVBLG1DQUFBLEVBQXFDLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUNuQyxLQUFDLENBQUEsZ0JBQUQsQ0FBQSxDQUFtQixDQUFDLE1BQXBCLENBQUEsRUFEbUM7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUZyQztBQUFBLFFBSUEsdUNBQUEsRUFBeUMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7bUJBQ3ZDLEtBQUMsQ0FBQSxtQkFBRCxDQUFBLENBQXNCLENBQUMsTUFBdkIsQ0FBQSxFQUR1QztVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBSnpDO09BREYsQ0FBQSxD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
//# sourceURL=/Users/ah/.atom/packages/fuzzy-finder/lib/main.coffee