(function() {
  var Disposable, FileIcons;

  Disposable = require('atom').Disposable;

  FileIcons = require('./file-icons');

  module.exports = {
    activate: function(state) {
      var editor, i, len, ref;
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
      ref = atom.workspace.getTextEditors();
      for (i = 0, len = ref.length; i < len; i++) {
        editor = ref[i];
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
    consumeFileIcons: function(service) {
      FileIcons.setService(service);
      return new Disposable(function() {
        return FileIcons.resetService();
      });
    },
    serialize: function() {
      var editor, i, len, path, paths, ref;
      paths = {};
      ref = atom.workspace.getTextEditors();
      for (i = 0, len = ref.length; i < len; i++) {
        editor = ref[i];
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
      var ref, ref1;
      if ((ref = this.projectPathsSubscription) != null) {
        ref.dispose();
      }
      this.projectPathsSubscription = null;
      if ((ref1 = this.loadPathsTask) != null) {
        ref1.terminate();
      }
      return this.loadPathsTask = null;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2Z1enp5LWZpbmRlci9saWIvbWFpbi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFDLGFBQWMsT0FBQSxDQUFRLE1BQVI7O0VBQ2YsU0FBQSxHQUFZLE9BQUEsQ0FBUSxjQUFSOztFQUVaLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxRQUFBLEVBQVUsU0FBQyxLQUFEO0FBQ1IsVUFBQTtNQUFBLElBQUMsQ0FBQSxNQUFELEdBQVU7TUFFVixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQ0U7UUFBQSxpQ0FBQSxFQUFtQyxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUNqQyxLQUFDLENBQUEsaUJBQUQsQ0FBQSxDQUFvQixDQUFDLE1BQXJCLENBQUE7VUFEaUM7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQW5DO1FBRUEsbUNBQUEsRUFBcUMsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTttQkFDbkMsS0FBQyxDQUFBLGdCQUFELENBQUEsQ0FBbUIsQ0FBQyxNQUFwQixDQUFBO1VBRG1DO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUZyQztRQUlBLHVDQUFBLEVBQXlDLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQ3ZDLEtBQUMsQ0FBQSxtQkFBRCxDQUFBLENBQXNCLENBQUMsTUFBdkIsQ0FBQTtVQUR1QztRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FKekM7T0FERjtNQVFBLE9BQU8sQ0FBQyxRQUFSLENBQWlCLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFBRyxLQUFDLENBQUEsa0JBQUQsQ0FBQTtRQUFIO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFqQjtBQUVBO0FBQUEsV0FBQSxxQ0FBQTs7UUFDRSxNQUFNLENBQUMsVUFBUCxHQUFvQixLQUFNLENB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QyxPQUFPLENBQUMsZ0JBQWIsQ0FBOEIsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO1VBQ3hELEtBQUMsQ0FBQSxZQUFELEdBQWdCO2lCQUNoQixLQUFDLENBQUEsaUJBQUQsQ0FBQTtRQUZ3RDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBOUI7SUFSVixDQWxFcEI7SUE4RUEsaUJBQUEsRUFBbUIsU0FBQTtBQUNqQixVQUFBOztXQUF5QixDQUFFLE9BQTNCLENBQUE7O01BQ0EsSUFBQyxDQUFBLHdCQUFELEdBQTRCOztZQUNkLENBQUUsU0FBaEIsQ0FBQTs7YUFDQSxJQUFDLENBQUEsYUFBRCxHQUFpQjtJQUpBLENBOUVuQjs7QUFKRiIsInNvdXJjZXNDb250ZW50IjpbIntEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG5GaWxlSWNvbnMgPSByZXF1aXJlICcuL2ZpbGUtaWNvbnMnXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgYWN0aXZhdGU6IChzdGF0ZSkgLT5cbiAgICBAYWN0aXZlID0gdHJ1ZVxuXG4gICAgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJyxcbiAgICAgICdmdXp6eS1maW5kZXI6dG9nZ2xlLWZpbGUtZmluZGVyJzogPT5cbiAgICAgICAgQGNyZWF0ZVByb2plY3RWaWV3KCkudG9nZ2xlKClcbiAgICAgICdmdXp6eS1maW5kZXI6dG9nZ2xlLWJ1ZmZlci1maW5kZXInOiA9PlxuICAgICAgICBAY3JlYXRlQnVmZmVyVmlldygpLnRvZ2dsZSgpXG4gICAgICAnZnV6enktZmluZGVyOnRvZ2dsZS1naXQtc3RhdHVzLWZpbmRlcic6ID0+XG4gICAgICAgIEBjcmVhdGVHaXRTdGF0dXNWaWV3KCkudG9nZ2xlKClcblxuICAgIHByb2Nlc3MubmV4dFRpY2sgPT4gQHN0YXJ0TG9hZFBhdGhzVGFzaygpXG5cbiAgICBmb3IgZWRpdG9yIGluIGF0b20ud29ya3NwYWNlLmdldFRleHRFZGl0b3JzKClcbiAgICAgIGVkaXRvci5sYXN0T3BlbmVkID0gc3RhdGVbZWRpdG9yLmdldFBhdGgoKV1cblxuICAgIGF0b20ud29ya3NwYWNlLm9ic2VydmVQYW5lcyAocGFuZSkgLT5cbiAgICAgIHBhbmUub2JzZXJ2ZUFjdGl2ZUl0ZW0gKGl0ZW0pIC0+IGl0ZW0/Lmxhc3RPcGVuZWQgPSBEYXRlLm5vdygpXG5cbiAgZGVhY3RpdmF0ZTogLT5cbiAgICBpZiBAcHJvamVjdFZpZXc/XG4gICAgICBAcHJvamVjdFZpZXcuZGVzdHJveSgpXG4gICAgICBAcHJvamVjdFZpZXcgPSBudWxsXG4gICAgaWYgQGJ1ZmZlclZpZXc/XG4gICAgICBAYnVmZmVyVmlldy5kZXN0cm95KClcbiAgICAgIEBidWZmZXJWaWV3ID0gbnVsbFxuICAgIGlmIEBnaXRTdGF0dXNWaWV3P1xuICAgICAgQGdpdFN0YXR1c1ZpZXcuZGVzdHJveSgpXG4gICAgICBAZ2l0U3RhdHVzVmlldyA9IG51bGxcbiAgICBAcHJvamVjdFBhdGhzID0gbnVsbFxuICAgIEBzdG9wTG9hZFBhdGhzVGFzaygpXG4gICAgQGFjdGl2ZSA9IGZhbHNlXG5cbiAgY29uc3VtZUZpbGVJY29uczogKHNlcnZpY2UpIC0+XG4gICAgRmlsZUljb25zLnNldFNlcnZpY2Uoc2VydmljZSlcbiAgICBuZXcgRGlzcG9zYWJsZSAtPlxuICAgICAgRmlsZUljb25zLnJlc2V0U2VydmljZSgpXG5cbiAgc2VyaWFsaXplOiAtPlxuICAgIHBhdGhzID0ge31cbiAgICBmb3IgZWRpdG9yIGluIGF0b20ud29ya3NwYWNlLmdldFRleHRFZGl0b3JzKClcbiAgICAgIHBhdGggPSBlZGl0b3IuZ2V0UGF0aCgpXG4gICAgICBwYXRoc1twYXRoXSA9IGVkaXRvci5sYXN0T3BlbmVkIGlmIHBhdGg/XG4gICAgcGF0aHNcblxuICBjcmVhdGVQcm9qZWN0VmlldzogLT5cbiAgICBAc3RvcExvYWRQYXRoc1Rhc2soKVxuXG4gICAgdW5sZXNzIEBwcm9qZWN0Vmlldz9cbiAgICAgIFByb2plY3RWaWV3ICA9IHJlcXVpcmUgJy4vcHJvamVjdC12aWV3J1xuICAgICAgQHByb2plY3RWaWV3ID0gbmV3IFByb2plY3RWaWV3KEBwcm9qZWN0UGF0aHMpXG4gICAgICBAcHJvamVjdFBhdGhzID0gbnVsbFxuICAgIEBwcm9qZWN0Vmlld1xuXG4gIGNyZWF0ZUdpdFN0YXR1c1ZpZXc6IC0+XG4gICAgdW5sZXNzIEBnaXRTdGF0dXNWaWV3P1xuICAgICAgR2l0U3RhdHVzVmlldyAgPSByZXF1aXJlICcuL2dpdC1zdGF0dXMtdmlldydcbiAgICAgIEBnaXRTdGF0dXNWaWV3ID0gbmV3IEdpdFN0YXR1c1ZpZXcoKVxuICAgIEBnaXRTdGF0dXNWaWV3XG5cbiAgY3JlYXRlQnVmZmVyVmlldzogLT5cbiAgICB1bmxlc3MgQGJ1ZmZlclZpZXc/XG4gICAgICBCdWZmZXJWaWV3ID0gcmVxdWlyZSAnLi9idWZmZXItdmlldydcbiAgICAgIEBidWZmZXJWaWV3ID0gbmV3IEJ1ZmZlclZpZXcoKVxuICAgIEBidWZmZXJWaWV3XG5cbiAgc3RhcnRMb2FkUGF0aHNUYXNrOiAtPlxuICAgIEBzdG9wTG9hZFBhdGhzVGFzaygpXG5cbiAgICByZXR1cm4gdW5sZXNzIEBhY3RpdmVcbiAgICByZXR1cm4gaWYgYXRvbS5wcm9qZWN0LmdldFBhdGhzKCkubGVuZ3RoIGlzIDBcblxuICAgIFBhdGhMb2FkZXIgPSByZXF1aXJlICcuL3BhdGgtbG9hZGVyJ1xuICAgIEBsb2FkUGF0aHNUYXNrID0gUGF0aExvYWRlci5zdGFydFRhc2sgKEBwcm9qZWN0UGF0aHMpID0+XG4gICAgQHByb2plY3RQYXRoc1N1YnNjcmlwdGlvbiA9IGF0b20ucHJvamVjdC5vbkRpZENoYW5nZVBhdGhzID0+XG4gICAgICBAcHJvamVjdFBhdGhzID0gbnVsbFxuICAgICAgQHN0b3BMb2FkUGF0aHNUYXNrKClcblxuICBzdG9wTG9hZFBhdGhzVGFzazogLT5cbiAgICBAcHJvamVjdFBhdGhzU3Vic2NyaXB0aW9uPy5kaXNwb3NlKClcbiAgICBAcHJvamVjdFBhdGhzU3Vic2NyaXB0aW9uID0gbnVsbFxuICAgIEBsb2FkUGF0aHNUYXNrPy50ZXJtaW5hdGUoKVxuICAgIEBsb2FkUGF0aHNUYXNrID0gbnVsbFxuIl19
