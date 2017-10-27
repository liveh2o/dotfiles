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
      if (linter.lint) {
        if (typeof linter.lint !== 'function') {
          throw new Error("linter.lint isn't a function on provider");
        }
      } else {
        throw new Error('Missing linter.lint on provider');
      }
      return true;
    },
    messages: function(messages) {
      if (!(messages instanceof Array)) {
        throw new Error("Expected messages to be array, provided: " + (typeof messages));
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
          if (typeof result.html !== 'string') {
            throw new Error('Invalid html field on Linter Response');
          }
        } else if (result.text) {
          if (typeof result.text !== 'string') {
            throw new Error('Invalid text field on Linter Response');
          }
        } else {
          throw new Error('Missing html/text field on Linter Response');
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvdmFsaWRhdGUuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHdCQUFBOztBQUFBLEVBQUMsUUFBUyxPQUFBLENBQVEsTUFBUixFQUFULEtBQUQsQ0FBQTs7QUFBQSxFQUNBLE9BQUEsR0FBVSxPQUFBLENBQVEsV0FBUixDQURWLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUFpQixRQUFBLEdBRWY7QUFBQSxJQUFBLE1BQUEsRUFBUSxTQUFDLE1BQUQsR0FBQTtBQUVOLE1BQUEsTUFBTSxDQUFDLGNBQVAsR0FBd0IsT0FBQSxDQUFRLE1BQU0sQ0FBQyxjQUFmLENBQXhCLENBQUE7QUFDQSxNQUFBLElBQUEsQ0FBQSxDQUFPLE1BQU0sQ0FBQyxhQUFQLFlBQWdDLEtBQXZDLENBQUE7QUFDRSxjQUFVLElBQUEsS0FBQSxDQUFPLHNDQUFBLEdBQXNDLE1BQU0sQ0FBQyxhQUFwRCxDQUFWLENBREY7T0FEQTtBQUdBLE1BQUEsSUFBRyxNQUFNLENBQUMsSUFBVjtBQUNFLFFBQUEsSUFBK0QsTUFBQSxDQUFBLE1BQWEsQ0FBQyxJQUFkLEtBQXdCLFVBQXZGO0FBQUEsZ0JBQVUsSUFBQSxLQUFBLENBQU0sMENBQU4sQ0FBVixDQUFBO1NBREY7T0FBQSxNQUFBO0FBR0UsY0FBVSxJQUFBLEtBQUEsQ0FBTSxpQ0FBTixDQUFWLENBSEY7T0FIQTtBQU9BLGFBQU8sSUFBUCxDQVRNO0lBQUEsQ0FBUjtBQUFBLElBV0EsUUFBQSxFQUFVLFNBQUMsUUFBRCxHQUFBO0FBQ1IsTUFBQSxJQUFBLENBQUEsQ0FBTyxRQUFBLFlBQW9CLEtBQTNCLENBQUE7QUFDRSxjQUFVLElBQUEsS0FBQSxDQUFPLDJDQUFBLEdBQTBDLENBQUMsTUFBQSxDQUFBLFFBQUQsQ0FBakQsQ0FBVixDQURGO09BQUE7QUFBQSxNQUVBLFFBQVEsQ0FBQyxPQUFULENBQWlCLFNBQUMsTUFBRCxHQUFBO0FBQ2YsUUFBQSxJQUFHLE1BQU0sQ0FBQyxJQUFWO0FBQ0UsVUFBQSxJQUEyRCxNQUFBLENBQUEsTUFBYSxDQUFDLElBQWQsS0FBd0IsUUFBbkY7QUFBQSxrQkFBVSxJQUFBLEtBQUEsQ0FBTSx1Q0FBTixDQUFWLENBQUE7V0FERjtTQUFBLE1BQUE7QUFHRSxnQkFBVSxJQUFBLEtBQUEsQ0FBTSx1Q0FBTixDQUFWLENBSEY7U0FBQTtBQUlBLFFBQUEsSUFBRyxNQUFNLENBQUMsSUFBVjtBQUNFLFVBQUEsSUFBMkQsTUFBQSxDQUFBLE1BQWEsQ0FBQyxJQUFkLEtBQXdCLFFBQW5GO0FBQUEsa0JBQVUsSUFBQSxLQUFBLENBQU0sdUNBQU4sQ0FBVixDQUFBO1dBREY7U0FBQSxNQUVLLElBQUcsTUFBTSxDQUFDLElBQVY7QUFDSCxVQUFBLElBQTJELE1BQUEsQ0FBQSxNQUFhLENBQUMsSUFBZCxLQUF3QixRQUFuRjtBQUFBLGtCQUFVLElBQUEsS0FBQSxDQUFNLHVDQUFOLENBQVYsQ0FBQTtXQURHO1NBQUEsTUFBQTtBQUdILGdCQUFVLElBQUEsS0FBQSxDQUFNLDRDQUFOLENBQVYsQ0FIRztTQU5MO0FBVUEsUUFBQSxJQUFnRCxvQkFBaEQ7QUFBQSxVQUFBLE1BQU0sQ0FBQyxLQUFQLEdBQWUsS0FBSyxDQUFDLFVBQU4sQ0FBaUIsTUFBTSxDQUFDLEtBQXhCLENBQWYsQ0FBQTtTQVZBO0FBQUEsUUFXQSxNQUFNLENBQUMsR0FBUCxHQUFhLElBQUksQ0FBQyxTQUFMLENBQWUsTUFBZixDQVhiLENBQUE7QUFBQSxRQVlBLE1BQU0sQ0FBQyxPQUFELENBQU4sR0FBZSxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVosQ0FBQSxDQUF5QixDQUFDLE9BQTFCLENBQWtDLEdBQWxDLEVBQXVDLEdBQXZDLENBWmYsQ0FBQTtBQWFBLFFBQUEsSUFBbUMsTUFBTSxDQUFDLEtBQTFDO2lCQUFBLFFBQVEsQ0FBQyxRQUFULENBQWtCLE1BQU0sQ0FBQyxLQUF6QixFQUFBO1NBZGU7TUFBQSxDQUFqQixDQUZBLENBQUE7QUFpQkEsYUFBTyxNQUFQLENBbEJRO0lBQUEsQ0FYVjtHQUxGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/ah/.atom/packages/linter/lib/validate.coffee
