(function() {
  var Path, RailsRspec, Workspace;

  Path = require('path');

  Workspace = require('atom').Workspace;

  RailsRspec = require('../lib/rails-rspec');

  describe('RailsRspec', function() {
    var activationPromise, currentPath, toggleFile;
    activationPromise = null;
    currentPath = function() {
      return atom.workspace.getActiveTextEditor().getPath();
    };
    toggleFile = function(file) {
      var editor;
      atom.workspace.openSync(file);
      editor = atom.workspace.getActiveTextEditor();
      atom.commands.dispatch(atom.views.getView(editor), 'rails-rspec:toggle-spec-file');
      return waitsForPromise(function() {
        return activationPromise;
      });
    };
    beforeEach(function() {
      atom.commands.dispatch(atom.views.getView(atom.workspace), 'rails-rspec:toggle-spec-file');
      return activationPromise = atom.packages.activatePackage('rails-rspec');
    });
    return describe('when the rails-rspec:toggle-spec-file event is triggered', function() {
      return it('swtiches to spec file', function() {
        toggleFile('app/models/user.rb');
        return runs(function() {
          return expect(currentPath()).toBe(Path.join(__dirname, 'fixtures/spec/models/user_spec.rb'));
        });
      });
    });
  });

}).call(this);
