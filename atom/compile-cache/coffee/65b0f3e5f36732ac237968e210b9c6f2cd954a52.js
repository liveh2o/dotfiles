(function() {
  describe('The Issue Underline Configuration Option', function() {
    var configString;
    configString = 'linter.underlineIssues';
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9zcGVjL2NvbmZpZy91bmRlcmxpbmUtaXNzdWUtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLEVBQUEsUUFBQSxDQUFTLDBDQUFULEVBQXFELFNBQUEsR0FBQTtBQUVuRCxRQUFBLFlBQUE7QUFBQSxJQUFBLFlBQUEsR0FBZSx3QkFBZixDQUFBO0FBQUEsSUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO2FBQ1QsZUFBQSxDQUFnQixTQUFBLEdBQUE7ZUFDZCxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsUUFBOUIsRUFEYztNQUFBLENBQWhCLEVBRFM7SUFBQSxDQUFYLENBRkEsQ0FBQTtXQU1BLEVBQUEsQ0FBRyx1QkFBSCxFQUE0QixTQUFBLEdBQUE7QUFDMUIsVUFBQSxjQUFBO0FBQUEsTUFBQSxjQUFBLEdBQWlCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixZQUFoQixDQUFqQixDQUFBO2FBQ0EsTUFBQSxDQUFPLGNBQVAsQ0FBc0IsQ0FBQyxJQUF2QixDQUE0QixJQUE1QixFQUYwQjtJQUFBLENBQTVCLEVBUm1EO0VBQUEsQ0FBckQsQ0FBQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/ah/.atom/packages/linter/spec/config/underline-issue-spec.coffee
