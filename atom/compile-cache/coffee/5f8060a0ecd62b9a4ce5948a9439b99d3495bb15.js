(function() {
  var RSpec;

  RSpec = require('../lib/rspec');

  describe("Rspec", function() {
    var activationPromise;
    activationPromise = null;
    beforeEach(function() {
      atom.workspaceView = new WorkspaceView;
      return activationPromise = atom.packages.activatePackage('rspec');
    });
    return xdescribe("when the rspec:toggle event is triggered", function() {
      return it("attaches and then detaches the view", function() {
        expect(atom.workspaceView.find('.rspec')).not.toExist();
        atom.workspaceView.trigger('rspec:toggle');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          expect(atom.workspaceView.find('.rspec')).toExist();
          atom.workspaceView.trigger('rspec:toggle');
          return expect(atom.workspaceView.find('.rspec')).not.toExist();
        });
      });
    });
  });

}).call(this);
