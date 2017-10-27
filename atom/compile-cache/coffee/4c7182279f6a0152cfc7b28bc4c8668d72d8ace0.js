(function() {
  var Rails;

  Rails = require('./rails');

  module.exports = {
    config: {
      specSearchPaths: {
        type: 'array',
        "default": ['spec', 'fast_spec']
      },
      specDefaultPath: {
        type: 'string',
        "default": 'spec'
      }
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
