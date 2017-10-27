(function() {
  describe('validate', function() {
    var validate;
    validate = require('../lib/validate');
    describe('::linter', function() {
      it('throws error if grammarScopes is not an array', function() {
        return expect(function() {
          return validate.linter({
            lint: function() {}
          });
        }).toThrow("grammarScopes is not an Array. Got: undefined");
      });
      it('throws if lint is missing', function() {
        return expect(function() {
          return validate.linter({
            grammarScopes: []
          });
        }).toThrow();
      });
      return it('throws if lint is not a function', function() {
        return expect(function() {
          return validate.linter({
            grammarScopes: [],
            lint: true
          });
        }).toThrow();
      });
    });
    return describe('::messages', function() {
      it('throws if messages is not an array', function() {
        expect(function() {
          return validate.messages();
        }).toThrow("Expected messages to be array, provided: undefined");
        return expect(function() {
          return validate.messages(true);
        }).toThrow("Expected messages to be array, provided: boolean");
      });
      it('throws if type field is not present', function() {
        return expect(function() {
          return validate.messages([{}]);
        }).toThrow();
      });
      it("throws if type field is invalid", function() {
        return expect(function() {
          return validate.messages([
            {
              type: 1
            }
          ]);
        }).toThrow();
      });
      it("throws if there's no html/text field on message", function() {
        return expect(function() {
          return validate.messages([
            {
              type: 'Error'
            }
          ]);
        }).toThrow();
      });
      return it("throws if html/text is invalid", function() {
        expect(function() {
          return validate.messages([
            {
              type: 'Error',
              html: 1
            }
          ]);
        }).toThrow();
        expect(function() {
          return validate.messages([
            {
              type: 'Error',
              text: 1
            }
          ]);
        }).toThrow();
        expect(function() {
          return validate.messages([
            {
              type: 'Error',
              html: false
            }
          ]);
        }).toThrow();
        expect(function() {
          return validate.messages([
            {
              type: 'Error',
              text: false
            }
          ]);
        }).toThrow();
        expect(function() {
          return validate.messages([
            {
              type: 'Error',
              html: []
            }
          ]);
        }).toThrow();
        return expect(function() {
          return validate.messages([
            {
              type: 'Error',
              text: []
            }
          ]);
        }).toThrow();
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9zcGVjL3ZhbGlkYXRlLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLFFBQUEsQ0FBUyxVQUFULEVBQXFCLFNBQUEsR0FBQTtBQUNuQixRQUFBLFFBQUE7QUFBQSxJQUFBLFFBQUEsR0FBVyxPQUFBLENBQVEsaUJBQVIsQ0FBWCxDQUFBO0FBQUEsSUFDQSxRQUFBLENBQVMsVUFBVCxFQUFxQixTQUFBLEdBQUE7QUFDbkIsTUFBQSxFQUFBLENBQUcsK0NBQUgsRUFBb0QsU0FBQSxHQUFBO2VBQ2xELE1BQUEsQ0FBTyxTQUFBLEdBQUE7aUJBQ0wsUUFBUSxDQUFDLE1BQVQsQ0FBZ0I7QUFBQSxZQUFDLElBQUEsRUFBTSxTQUFBLEdBQUEsQ0FBUDtXQUFoQixFQURLO1FBQUEsQ0FBUCxDQUVBLENBQUMsT0FGRCxDQUVTLCtDQUZULEVBRGtEO01BQUEsQ0FBcEQsQ0FBQSxDQUFBO0FBQUEsTUFJQSxFQUFBLENBQUcsMkJBQUgsRUFBZ0MsU0FBQSxHQUFBO2VBQzlCLE1BQUEsQ0FBTyxTQUFBLEdBQUE7aUJBQ0wsUUFBUSxDQUFDLE1BQVQsQ0FBZ0I7QUFBQSxZQUFDLGFBQUEsRUFBZSxFQUFoQjtXQUFoQixFQURLO1FBQUEsQ0FBUCxDQUVBLENBQUMsT0FGRCxDQUFBLEVBRDhCO01BQUEsQ0FBaEMsQ0FKQSxDQUFBO2FBUUEsRUFBQSxDQUFHLGtDQUFILEVBQXVDLFNBQUEsR0FBQTtlQUNyQyxNQUFBLENBQU8sU0FBQSxHQUFBO2lCQUNMLFFBQVEsQ0FBQyxNQUFULENBQWdCO0FBQUEsWUFBQyxhQUFBLEVBQWUsRUFBaEI7QUFBQSxZQUFvQixJQUFBLEVBQU0sSUFBMUI7V0FBaEIsRUFESztRQUFBLENBQVAsQ0FFQSxDQUFDLE9BRkQsQ0FBQSxFQURxQztN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

//# sourceURL=/Users/ah/.atom/packages/linter/spec/validate-spec.coffee
