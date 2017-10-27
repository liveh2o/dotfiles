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
      var editor, _i, _len, _ref;
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
      if (atom.project.getPaths().length > 0) {
        this.createProjectView().runLoadPathsTask();
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
      var ProjectView;
      if (this.projectView == null) {
        ProjectView = require('./project-view');
        this.projectView = new ProjectView();
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
