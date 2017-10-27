(function() {
  describe("The Issue Underline Configuration Option", function() {
    var configString;
    configString = "linter.underlineIssues";
    beforeEach(function() {
      return waitsForPromise(function() {
        return atom.packages.activatePackage('linter');
      });
    });
    return it("is `true` by default.", function() {
      var packageSetting;
      packageSetting = atom.config.get(configString);
      return expect(packageSetting).toBe(true);
    });
  });

}).call(this);
