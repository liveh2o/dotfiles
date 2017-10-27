(function() {
  describe('BottomPanelMount', function() {
    var statusBar, statusBarService, workspaceElement, _ref;
    _ref = [], statusBar = _ref[0], statusBarService = _ref[1], workspaceElement = _ref[2];
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      waitsForPromise(function() {
        return atom.packages.activatePackage('status-bar').then(function(pack) {
          statusBar = workspaceElement.querySelector('status-bar');
          return statusBarService = pack.mainModule.provideStatusBar();
        });
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('linter').then(function(pack) {
          return atom.packages.getActivePackage('linter').mainModule.consumeStatusBar(statusBar);
        });
      });
      return waitsForPromise(function() {
        return atom.workspace.open();
      });
    });
    it('can mount to left status-bar', function() {
      var tile;
      tile = statusBar.getLeftTiles()[0];
      return expect(tile.item.localName).toBe('linter-bottom-container');
    });
    return it('can mount to right status-bar', function() {
      var tile;
      atom.config.set('linter.statusIconPosition', 'Right');
      tile = statusBar.getRightTiles()[0];
      return expect(tile.item.localName).toBe('linter-bottom-container');
    });
  });

}).call(this);
