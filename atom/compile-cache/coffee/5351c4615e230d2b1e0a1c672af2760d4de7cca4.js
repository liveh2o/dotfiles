(function() {
  describe('The Inline Tooltips Configuration Option', function() {
    var configString;
    configString = 'linter.showErrorInline';
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9zcGVjL2NvbmZpZy9zaG93LWVycm9yLWlubGluZS1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsRUFBQSxRQUFBLENBQVMsMENBQVQsRUFBcUQsU0FBQSxHQUFBO0FBRW5ELFFBQUEsWUFBQTtBQUFBLElBQUEsWUFBQSxHQUFlLHdCQUFmLENBQUE7QUFBQSxJQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7YUFDVCxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUNkLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixRQUE5QixFQURjO01BQUEsQ0FBaEIsRUFEUztJQUFBLENBQVgsQ0FGQSxDQUFBO1dBTUEsRUFBQSxDQUFHLHVCQUFILEVBQTRCLFNBQUEsR0FBQTtBQUMxQixVQUFBLGNBQUE7QUFBQSxNQUFBLGNBQUEsR0FBaUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLFlBQWhCLENBQWpCLENBQUE7YUFDQSxNQUFBLENBQU8sY0FBUCxDQUFzQixDQUFDLElBQXZCLENBQTRCLElBQTVCLEVBRjBCO0lBQUEsQ0FBNUIsRUFSbUQ7RUFBQSxDQUFyRCxDQUFBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/ah/.atom/packages/linter/spec/config/show-error-inline-spec.coffee
