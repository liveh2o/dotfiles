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
        return atom.packages.activatePackage('linter').then(function() {
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
    it('can mount to right status-bar', function() {
      var tile;
      atom.config.set('linter.statusIconPosition', 'Right');
      tile = statusBar.getRightTiles()[0];
      return expect(tile.item.localName).toBe('linter-bottom-container');
    });
    return it('defaults to visible', function() {
      var tile;
      tile = statusBar.getLeftTiles()[0];
      return expect(tile.item.visibility).toBe(true);
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9zcGVjL3VpL2JvdHRvbS1wYW5lbC1tb3VudC1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsRUFBQSxRQUFBLENBQVMsa0JBQVQsRUFBNkIsU0FBQSxHQUFBO0FBQzNCLFFBQUEsbURBQUE7QUFBQSxJQUFBLE9BQWtELEVBQWxELEVBQUMsbUJBQUQsRUFBWSwwQkFBWixFQUE4QiwwQkFBOUIsQ0FBQTtBQUFBLElBQ0EsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsZ0JBQUEsR0FBbUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLElBQUksQ0FBQyxTQUF4QixDQUFuQixDQUFBO0FBQUEsTUFDQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUNkLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixZQUE5QixDQUEyQyxDQUFDLElBQTVDLENBQWlELFNBQUMsSUFBRCxHQUFBO0FBQy9DLFVBQUEsU0FBQSxHQUFZLGdCQUFnQixDQUFDLGFBQWpCLENBQStCLFlBQS9CLENBQVosQ0FBQTtpQkFDQSxnQkFBQSxHQUFtQixJQUFJLENBQUMsVUFBVSxDQUFDLGdCQUFoQixDQUFBLEVBRjRCO1FBQUEsQ0FBakQsRUFEYztNQUFBLENBQWhCLENBREEsQ0FBQTtBQUFBLE1BS0EsZUFBQSxDQUFnQixTQUFBLEdBQUE7ZUFDZCxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsUUFBOUIsQ0FBdUMsQ0FBQyxJQUF4QyxDQUE2QyxTQUFBLEdBQUE7aUJBQzNDLElBQUksQ0FBQyxRQUFRLENBQUMsZ0JBQWQsQ0FBK0IsUUFBL0IsQ0FBd0MsQ0FBQyxVQUFVLENBQUMsZ0JBQXBELENBQXFFLFNBQXJFLEVBRDJDO1FBQUEsQ0FBN0MsRUFEYztNQUFBLENBQWhCLENBTEEsQ0FBQTthQVFBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQUEsRUFEYztNQUFBLENBQWhCLEVBVFM7SUFBQSxDQUFYLENBREEsQ0FBQTtBQUFBLElBYUEsRUFBQSxDQUFHLDhCQUFILEVBQW1DLFNBQUEsR0FBQTtBQUNqQyxVQUFBLElBQUE7QUFBQSxNQUFBLElBQUEsR0FBTyxTQUFTLENBQUMsWUFBVixDQUFBLENBQXlCLENBQUEsQ0FBQSxDQUFoQyxDQUFBO2FBQ0EsTUFBQSxDQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBakIsQ0FBMkIsQ0FBQyxJQUE1QixDQUFpQyx5QkFBakMsRUFGaUM7SUFBQSxDQUFuQyxDQWJBLENBQUE7QUFBQSxJQWlCQSxFQUFBLENBQUcsK0JBQUgsRUFBb0MsU0FBQSxHQUFBO0FBQ2xDLFVBQUEsSUFBQTtBQUFBLE1BQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDJCQUFoQixFQUE2QyxPQUE3QyxDQUFBLENBQUE7QUFBQSxNQUNBLElBQUEsR0FBTyxTQUFTLENBQUMsYUFBVixDQUFBLENBQTBCLENBQUEsQ0FBQSxDQURqQyxDQUFBO2FBRUEsTUFBQSxDQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBakIsQ0FBMkIsQ0FBQyxJQUE1QixDQUFpQyx5QkFBakMsRUFIa0M7SUFBQSxDQUFwQyxDQWpCQSxDQUFBO1dBc0JBLEVBQUEsQ0FBRyxxQkFBSCxFQUEwQixTQUFBLEdBQUE7QUFDeEIsVUFBQSxJQUFBO0FBQUEsTUFBQSxJQUFBLEdBQU8sU0FBUyxDQUFDLFlBQVYsQ0FBQSxDQUF5QixDQUFBLENBQUEsQ0FBaEMsQ0FBQTthQUNBLE1BQUEsQ0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQWpCLENBQTRCLENBQUMsSUFBN0IsQ0FBa0MsSUFBbEMsRUFGd0I7SUFBQSxDQUExQixFQXZCMkI7RUFBQSxDQUE3QixDQUFBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/ah/.atom/packages/linter/spec/ui/bottom-panel-mount-spec.coffee
