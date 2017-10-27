(function() {
  var Helpers, Range, XRegExp, child_process, path,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Range = require('atom').Range;

  XRegExp = require('xregexp').XRegExp;

  path = require('path');

  child_process = require('child_process');

  Helpers = module.exports = {
    error: function(e) {
      return atom.notifications.addError(e.toString(), {
        detail: e.stack || '',
        dismissable: true
      });
    },
    shouldTriggerLinter: function(linter, bufferModifying, onChange, scopes) {
      if (onChange && !linter.lintOnFly) {
        return false;
      }
      if (!scopes.some(function(entry) {
        return __indexOf.call(linter.grammarScopes, entry) >= 0;
      })) {
        return false;
      }
      if (linter.modifiesBuffer !== bufferModifying) {
        return false;
      }
      return true;
    }
  };

}).call(this);
