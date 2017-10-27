(function() {
  describe('The Error Panel Visibility Configuration Option', function() {
    var configString;
    configString = 'linter.showErrorPanel';
    beforeEach(function() {
      return waitsForPromise(function() {
        return atom.packages.activatePackage('linter');
      });
    });
    return it('is `true` by default.', function() {
      var packageSetting;
      packageSetting = atom.config.get(configString);
      return expect(packageSetting).toBe(true);
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9zcGVjL2NvbmZpZy9zaG93LWVycm9yLXBhbmVsLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLFFBQUEsQ0FBUyxpREFBVCxFQUE0RCxTQUFBLEdBQUE7QUFFMUQsUUFBQSxZQUFBO0FBQUEsSUFBQSxZQUFBLEdBQWUsdUJBQWYsQ0FBQTtBQUFBLElBRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTthQUNULGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQ2QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLFFBQTlCLEVBRGM7TUFBQSxDQUFoQixFQURTO0lBQUEsQ0FBWCxDQUZBLENBQUE7V0FNQSxFQUFBLENBQUcsdUJBQUgsRUFBNEIsU0FBQSxHQUFBO0FBQzFCLFVBQUEsY0FBQTtBQUFBLE1BQUEsY0FBQSxHQUFpQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsWUFBaEIsQ0FBakIsQ0FBQTthQUNBLE1BQUEsQ0FBTyxjQUFQLENBQXNCLENBQUMsSUFBdkIsQ0FBNEIsSUFBNUIsRUFGMEI7SUFBQSxDQUE1QixFQVIwRDtFQUFBLENBQTVELENBQUEsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/ah/.atom/packages/linter/spec/config/show-error-panel-spec.coffee
