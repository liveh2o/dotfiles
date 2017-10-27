(function() {
  var FileIcons;

  FileIcons = require('./file-icons');

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
      var _ref;
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
      if ((_ref = this.fileIconsDisposable) != null) {
        _ref.dispose();
      }
      this.stopLoadPathsTask();
      return this.active = false;
    },
    consumeFileIcons: function(service) {
      FileIcons.setService(service);
      return this.fileIconsDisposable = service.onWillDeactivate(function() {
        return FileIcons.resetService();
      });
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2Z1enp5LWZpbmRlci9saWIvbWFpbi5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsU0FBQTs7QUFBQSxFQUFBLFNBQUEsR0FBWSxPQUFBLENBQVEsY0FBUixDQUFaLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxRQUFBLEVBQVUsU0FBQyxLQUFELEdBQUE7QUFDUixVQUFBLHNCQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsTUFBRCxHQUFVLElBQVYsQ0FBQTtBQUFBLE1BRUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUNFO0FBQUEsUUFBQSxpQ0FBQSxFQUFtQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTttQkFDakMsS0FBQyxDQUFBLGlCQUFELENBQUEsQ0FBb0IsQ0FBQyxNQUFyQixDQUFBLEVBRGlDO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbkM7QUFBQSxRQUVBLG1DQUFBLEVBQXFDLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUNuQyxLQUFDLENBQUEsZ0JBQUQsQ0FBQSxDQUFtQixDQUFDLE1BQXBCLENBQUEsRUFEbUM7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUZyQztBQUFBLFFBSUEsdUNBQUEsRUFBeUMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7bUJBQ3ZDLEtBQUMsQ0FBQSxtQkFBRCxDQUFBLENBQXNCLENBQUMsTUFBdkIsQ0FBQSxFQUR1QztVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBSnpDO09BREYsQ0FGQSxDQUFBO0FBQUEsTUFVQSxPQUFPLENB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

//# sourceURL=/Users/ah/.atom/packages/fuzzy-finder/lib/main.coffee
