(function() {
  var Helpers, Range, XRegExp, child_process, path,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Range = require('atom').Range;

  XRegExp = require('xregexp').XRegExp;

  path = require('path');

  child_process = require('child_process');

  Helpers = module.exports = {
    shouldTriggerLinter: function(linter, wasTriggeredOnChange, scopes) {
      if (wasTriggeredOnChange && !linter.lintOnFly) {
        return false;
      }
      if (!scopes.some(function(entry) {
        return __indexOf.call(linter.grammarScopes, entry) >= 0;
      })) {
        return false;
      }
      return true;
    },
    validateMessages: function(results) {
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
          Helpers.validateMessages(result.trace);
        }
      }
    },
    validateLinter: function(linter) {
      if (!(linter.grammarScopes instanceof Array)) {
        throw new Error("grammarScopes is not an Array. Got: " + linter.grammarScopes + ")");
      }
      if (linter.lint == null) {
        throw new Error("Missing linter.lint");
      }
      if (typeof linter.lint !== 'function') {
        throw new Error("linter.lint isn't a function");
      }
      linter.modifiesBuffer = Boolean(linter.modifiesBuffer);
      return true;
    }
  };

}).call(this);
