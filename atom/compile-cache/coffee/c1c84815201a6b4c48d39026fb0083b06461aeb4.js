(function() {
  var Helpers, Range;

  Range = require('atom').Range;

  Helpers = module.exports = {
    validateResults: function(results) {
      var result, _i, _len;
      if ((!results) || results.constructor.name !== 'Array') {
        throw new Error("Got invalid response from Linter, Type: " + (typeof results));
      }
      for (_i = 0, _len = results.length; _i < _len; _i++) {
        result = results[_i];
        if (!result.type) {
          throw new Error("Missing type field on Linter Response, Got: " + (Object.keys(result)));
        }
        if (result.range != null) {
          result.range = Range.fromObject(result.range);
        }
        result["class"] = result.type.toLowerCase().replace(' ', '-');
        if (result.trace) {
          Helpers.validateResults(result.trace);
        }
      }
      return results;
    },
    validateLinter: function(linter) {
      var message;
      if (!(linter.grammarScopes instanceof Array)) {
        message = "grammarScopes is not an Array. (see console for more info)";
        console.warn(message);
        console.warn('grammarScopes', linter.grammarScopes);
        throw new Error(message);
      }
      if (linter.lint == null) {
        throw new Error("Missing linter.lint");
      }
      if (typeof linter.lint !== 'function') {
        throw new Error("linter.lint isn't a function");
      }
      return true;
    }
  };

}).call(this);
