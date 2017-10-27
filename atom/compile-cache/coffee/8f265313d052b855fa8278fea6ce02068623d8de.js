(function() {
  var Range, Validate, helpers;

  Range = require('atom').Range;

  helpers = require('./helpers');

  module.exports = Validate = {
    linter: function(linter, indie) {
      if (indie == null) {
        indie = false;
      }
      if (!indie) {
        if (!(linter.grammarScopes instanceof Array)) {
          throw new Error("grammarScopes is not an Array. Got: " + linter.grammarScopes);
        }
        if (linter.lint) {
          if (typeof linter.lint !== 'function') {
            throw new Error("linter.lint isn't a function on provider");
          }
        } else {
          throw new Error('Missing linter.lint on provider');
        }
        if (linter.scope && typeof linter.scope === 'string') {
          linter.scope = linter.scope.toLowerCase();
        }
        if (linter.scope !== 'file' && linter.scope !== 'project') {
          throw new Error('Linter.scope must be either `file` or `project`');
        }
      }
      if (linter.name) {
        if (typeof linter.name !== 'string') {
          throw new Error('Linter.name must be a string');
        }
      } else {
        linter.name = null;
      }
      return true;
    },
    messages: function(messages, linter) {
      if (!(messages instanceof Array)) {
        throw new Error("Expected messages to be array, provided: " + (typeof messages));
      }
      if (!linter) {
        throw new Error('No linter provided');
      }
      messages.forEach(function(result) {
        if (result.type) {
          if (typeof result.type !== 'string') {
            throw new Error('Invalid type field on Linter Response');
          }
        } else {
          throw new Error('Missing type field on Linter Response');
        }
        if (result.html) {
          if (typeof result.text === 'string') {
            throw new Error('Got both html and text fields on Linter Response, expecting only one');
          }
          if (typeof result.html !== 'string' && !(result.html instanceof HTMLElement)) {
            throw new Error('Invalid html field on Linter Response');
          }
          result.text = null;
        } else if (result.text) {
          if (typeof result.text !== 'string') {
            throw new Error('Invalid text field on Linter Response');
          }
          result.html = null;
        } else {
          throw new Error('Missing html/text field on Linter Response');
        }
        if (result.trace) {
          if (!(result.trace instanceof Array)) {
            throw new Error('Invalid trace field on Linter Response');
          }
        } else {
          result.trace = null;
        }
        if (result["class"]) {
          if (typeof result["class"] !== 'string') {
            throw new Error('Invalid class field on Linter Response');
          }
        } else {
          result["class"] = result.type.toLowerCase().replace(' ', '-');
        }
        if (result.filePath) {
          if (typeof result.filePath !== 'string') {
            throw new Error('Invalid filePath field on Linter response');
          }
        } else {
          result.filePath = null;
        }
        if (result.range != null) {
          result.range = Range.fromObject(result.range);
        }
        result.key = JSON.stringify(result);
        result.linter = linter.name;
        if (result.trace && result.trace.length) {
          return Validate.messages(result.trace, linter);
        }
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvdmFsaWRhdGUuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHdCQUFBOztBQUFBLEVBQUMsUUFBUyxPQUFBLENBQVEsTUFBUixFQUFULEtBQUQsQ0FBQTs7QUFBQSxFQUNBLE9BQUEsR0FBVSxPQUFBLENBQVEsV0FBUixDQURWLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUFpQixRQUFBLEdBRWY7QUFBQSxJQUFBLE1BQUEsRUFBUSxTQUFDLE1BQUQsRUFBUyxLQUFULEdBQUE7O1FBQVMsUUFBUTtPQUN2QjtBQUFBLE1BQUEsSUFBQSxDQUFBLEtBQUE7QUFDRSxRQUFBLElBQUEsQ0FBQSxDQUFPLE1BQU0sQ0FBQyxhQUFQLFlBQWdDLEtBQXZDLENBQUE7QUFDRSxnQkFBVSxJQUFBLEtBQUEsQ0FBTyxzQ0FBQSxHQUFzQyxNQUFNLENBQUMsYUFBcEQsQ0FBVixDQURGO1NBQUE7QUFFQSxRQUFBLElBQUcsTUFBTSxDQUFDLElBQVY7QUFDRSxVQUFBLElBQStELE1BQUEsQ0FBQSxNQUFhLENBQUMsSUFBZCxLQUF3QixVQUF2RjtBQUFBLGtCQUFVLElBQUEsS0FBQSxDQUFNLDBDQUFOLENBQVYsQ0FBQTtXQURGO1NBQUEsTUFBQTtBQUdFLGdCQUFVLElBQUEsS0FBQSxDQUFNLGlDQUFOLENBQVYsQ0FIRjtTQUZBO0FBTUEsUUFBQSxJQUFHLE1BQU0sQ0FBQyxLQUFQLElBQWlCLE1BQUEsQ0FBQSxNQUFhLENBQUMsS0FBZCxLQUF1QixRQUEzQztBQUNFLFVBQUEsTUFBTSxDQUFDLEtBQVAsR0FBZSxNQUFNLENBQUMsS0FBSyxDQUFDLFdBQWIsQ0FBQSxDQUFmLENBREY7U0FOQTtBQVFBLFFBQUEsSUFBc0UsTUFBTSxDQUFDLEtBQVAsS0FBa0Is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

//# sourceURL=/Users/ah/.atom/packages/linter/lib/validate.coffee
