(function() {
  var Rails;

  Rails = require('./rails');

  module.exports = {
    configDefaults: {
      specSearchPaths: ['spec', 'fast_spec'],
      specDefaultPath: 'spec'
    },
    activate: function(state) {
      return atom.commands.add('atom-text-editor', {
        'rails-rspec:toggle-spec-file': (function(_this) {
          return function(event) {
            return _this.toggleSpecFile();
          };
        })(this)
      });
    },
    toggleSpecFile: function() {
      var editor, file, root, specDefault, specPaths;
      editor = atom.workspace.getActiveTextEditor();
      specPaths = atom.config.get('rails-rspec.specSearchPaths');
      specDefault = atom.config.get('rails-rspec.specDefaultPath');
      root = atom.project.getPaths()[0];
      file = new Rails(root, specPaths, specDefault).toggleSpecFile(editor.getPath());
      if (file != null) {
        return atom.workspace.open(file);
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLEtBQUE7O0FBQUEsRUFBQSxLQUFBLEdBQVEsT0FBQSxDQUFRLFNBQVIsQ0FBUixDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsY0FBQSxFQUNFO0FBQUEsTUFBQSxlQUFBLEVBQWlCLENBQUMsTUFBRCxFQUFTLFdBQVQsQ0FBakI7QUFBQSxNQUNBLGVBQUEsRUFBaUIsTUFEakI7S0FERjtBQUFBLElBSUEsUUFBQSxFQUFVLFNBQUMsS0FBRCxHQUFBO2FBQ1IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGtCQUFsQixFQUNFO0FBQUEsUUFBQSw4QkFBQSxFQUFnQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUMsS0FBRCxHQUFBO21CQUFXLEtBQUMsQ0FBQSxjQUFELENBQUEsRUFBWDtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWhDO09BREYsRUFEUTtJQUFBLENBSlY7QUFBQSxJQVFBLGNBQUEsRUFBZ0IsU0FBQSxHQUFBO0FBQ2QsVUFBQSwwQ0FBQTtBQUFBLE1BQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFULENBQUE7QUFBQSxNQUNBLFNBQUEsR0FBWSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsNkJBQWhCLENBRFosQ0FBQTtBQUFBLE1BRUEsV0FBQSxHQUFjLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiw2QkFBaEIsQ0FGZCxDQUFBO0FBQUEsTUFHQSxJQUFBLEdBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLENBSC9CLENBQUE7QUFBQSxNQUlBLElBQUEsR0FBVyxJQUFBLEtBQUEsQ0FBTSxJQUFOLEVBQVksU0FBWixFQUF1QixXQUF2QixDQUFtQyxDQUFDLGNBQXBDLENBQW1ELE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBbkQsQ0FKWCxDQUFBO0FBS0EsTUFBQSxJQUE2QixZQUE3QjtlQUFBLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixJQUFwQixFQUFBO09BTmM7SUFBQSxDQVJoQjtHQUhGLENBQUE7QUFBQSIKfQ==
//# sourceURL=/Users/ah/.atom/packages/rails-rspec/lib/rails-rspec.coffee