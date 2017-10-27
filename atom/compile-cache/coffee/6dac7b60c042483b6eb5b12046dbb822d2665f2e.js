(function() {
  var Helpers;

  Helpers = require('../lib/helpers');

  describe("The Results Validation Helper", function() {
    it("should throw an exception when nothing is passed.", function() {
      return expect(function() {
        return Helpers.validateMessages();
      }).toThrow();
    });
    it("should throw an exception when a String is passed.", function() {
      return expect(function() {
        return Helpers.validateMessages('String');
      }).toThrow();
    });
    it("should throw an exception when a result's type is missing.", function() {
      var results;
      results = [{}];
      return expect(function() {
        return Helpers.validateMessages(results);
      }).toThrow();
    });
    return it("should return the results when validated.", function() {
      var results;
      results = [
        {
          type: 'Type'
        }
      ];
      return expect(Helpers.validateMessages(results)).toBeUndefined();
    });
  });

  describe("The Linter Validation Helper", function() {
    it("should throw an exception when grammarScopes is not an Array.", function() {
      var linter;
      linter = {
        grammarScopes: 'not an array',
        lint: function() {}
      };
      return expect(function() {
        return Helpers.validateLinter(linter);
      }).toThrow();
    });
    it("should throw an exception when lint is missing.", function() {
      var linter;
      linter = {
        grammarScopes: []
      };
      return expect(function() {
        return Helpers.validateLinter(linter);
      }).toThrow();
    });
    it("should throw an exception when a lint is not a function.", function() {
      var linter;
      linter = {
        grammarScopes: [],
        lint: 'not a function'
      };
      return expect(function() {
        return Helpers.validateLinter(linter);
      }).toThrow();
    });
    return it("should return true when everything validates.", function() {
      var linter;
      linter = {
        grammarScopes: [],
        lint: function() {}
      };
      return expect(Helpers.validateLinter(linter)).toEqual(true);
    });
  });

}).call(this);
