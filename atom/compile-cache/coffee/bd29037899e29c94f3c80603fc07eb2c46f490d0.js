(function() {
  describe("The Lint on the Fly Configuration Option", function() {
    var configString;
    configString = "linter.lintOnFly";
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
