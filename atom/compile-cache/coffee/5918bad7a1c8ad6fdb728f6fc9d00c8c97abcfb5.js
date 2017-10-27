(function() {
  var Range, Validate, helpers;

  Range = require('atom').Range;

  helpers = require('./helpers');

  module.exports = Validate = {
    linter: function(linter) {
      linter.modifiesBuffer = Boolean(linter.modifiesBuffer);
      if (!(linter.grammarScopes instanceof Array)) {
        throw new Error("grammarScopes is not an Array. Got: " + linter.grammarScopes);
      }
      if (linter.lint == null) {
        throw new Error("Missing linter.lint");
      }
      if (typeof linter.lint !== 'function') {
        throw new Error("linter.lint isn't a function");
      }
      return true;
    },
    messages: function(messages) {
      if (!(messages instanceof Array)) {
        throw new Error("Expected messages to be array, provided: " + (typeof messages));
      }
      messages.forEach(function(result) {
        if (!result.type) {
          throw new Error("Missing type field on Linter Response");
        }
        if (!(result.html || result.text)) {
          throw new Error("Missing html/text field on Linter Response");
        }
        if (result.range != null) {
          result.range = Range.fromObject(result.range);
        }
        result.key = JSON.stringify(result);
        result["class"] = result.type.toLowerCase().replace(' ', '-');
        if (result.trace) {
          return Validate.messages(result.trace);
        }
      });
      return void 0;
    }
  };

}).call(this);
