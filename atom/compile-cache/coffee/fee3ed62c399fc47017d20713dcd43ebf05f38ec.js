(function() {
  var Rails;

  Rails = require('./rails');

  module.exports = {
    configDefaults: {
      specSearchPaths: ['spec', 'fast_spec'],
      specDefaultPath: 'spec'
    },
    activate: function(state) {
      return atom.workspaceView.command('rails-rspec:toggle-spec-file', '.editor', (function(_this) {
        return function() {
          return _this.toggleSpecFile();
        };
      })(this));
    },
    toggleSpecFile: function() {
      var editor, file, specDefault, specPaths;
      editor = atom.workspace.getActiveEditor();
      specPaths = atom.config.get('rails-rspec.specSearchPaths');
      specDefault = atom.config.get('rails-rspec.specDefaultPath');
      file = new Rails(atom.project.getPath(), specPaths, specDefault).toggleSpecFile(editor.getPath());
      if (file != null) {
        return atom.workspaceView.open(file);
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLEtBQUE7O0FBQUEsRUFBQSxLQUFBLEdBQVEsT0FBQSxDQUFRLFNBQVIsQ0FBUixDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsY0FBQSxFQUNFO0FBQUEsTUFBQSxlQUFBLEVBQWlCLENBQUMsTUFBRCxFQUFTLFdBQVQsQ0FBakI7QUFBQSxNQUNBLGVBQUEsRUFBaUIsTUFEakI7S0FERjtBQUFBLElBSUEsUUFBQSxFQUFVLFNBQUMsS0FBRCxHQUFBO2FBQ1IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFuQixDQUEyQiw4QkFBM0IsRUFBMkQsU0FBM0QsRUFBc0UsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDcEUsS0FBQyxDQUFBLGNBQUQsQ0FBQSxFQURvRTtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXRFLEVBRFE7SUFBQSxDQUpWO0FBQUEsSUFRQSxjQUFBLEVBQWdCLFNBQUEsR0FBQTtBQUNkLFVBQUEsb0NBQUE7QUFBQSxNQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLGVBQWYsQ0FBQSxDQUFULENBQUE7QUFBQSxNQUNBLFNBQUEsR0FBWSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsNkJBQWhCLENBRFosQ0FBQTtBQUFBLE1BRUEsV0FBQSxHQUFjLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiw2QkFBaEIsQ0FGZCxDQUFBO0FBQUEsTUFHQSxJQUFBLEdBQVcsSUFBQSxLQUFBLENBQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFiLENBQUEsQ0FBTixFQUE4QixTQUE5QixFQUF5QyxXQUF6QyxDQUFxRCxDQUFDLGNBQXRELENBQXFFLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBckUsQ0FIWCxDQUFBO0FBSUEsTUFBQSxJQUFpQyxZQUFqQztlQUFBLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBbkIsQ0FBd0IsSUFBeEIsRUFBQTtPQUxjO0lBQUEsQ0FSaEI7R0FIRixDQUFBO0FBQUEiCn0=
//# sourceURL=/Users/ah/.atom/packages/rails-rspec/lib/rails-rspec.coffee