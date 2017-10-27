(function() {
  describe('validate', function() {
    var getLinter, validate;
    validate = require('../lib/validate');
    getLinter = require('./common').getLinter;
    describe('::linter', function() {
      it('throws error if grammarScopes is not an array', function() {
        return expect(function() {
          var linter;
          linter = getLinter();
          linter.grammarScopes = false;
          return validate.linter(linter);
        }).toThrow('grammarScopes is not an Array. Got: false');
      });
      it('throws if lint is missing', function() {
        return expect(function() {
          var linter;
          linter = getLinter();
          delete linter.lint;
          return validate.linter(linter);
        }).toThrow();
      });
      it('throws if lint is not a function', function() {
        return expect(function() {
          var linter;
          linter = getLinter();
          linter.lint = 'woah';
          return validate.linter(linter);
        }).toThrow();
      });
      it('works well with name attribute', function() {
        var linter;
        expect(function() {
          var linter;
          linter = getLinter();
          linter.name = 1;
          return validate.linter(linter);
        }).toThrow('Linter.name must be a string');
        linter = getLinter();
        linter.name = null;
        return validate.linter(linter);
      });
      it('works well with scope attribute', function() {
        var linter;
        expect(function() {
          var linter;
          linter = getLinter();
          linter.scope = null;
          return validate.linter(linter);
        }).toThrow('Linter.scope must be either `file` or `project`');
        expect(function() {
          var linter;
          linter = getLinter();
          linter.scope = 'a';
          return validate.linter(linter);
        }).toThrow('Linter.scope must be either `file` or `project`');
        linter = getLinter();
        linter.scope = 'Project';
        return validate.linter(linter);
      });
      return it('works overall', function() {
        validate.linter(getLinter());
        return expect(true).toBe(true);
      });
    });
    return describe('::messages', function() {
      it('throws if messages is not an array', function() {
        expect(function() {
          return validate.messages();
        }).toThrow('Expected messages to be array, provided: undefined');
        return expect(function() {
          return validate.messages(true);
        }).toThrow('Expected messages to be array, provided: boolean');
      });
      it('throws if type field is not present', function() {
        return expect(function() {
          return validate.messages([{}], {
            name: ''
          });
        }).toThrow();
      });
      it('throws if type field is invalid', function() {
        return expect(function() {
          return validate.messages([
            {
              type: 1
            }
          ], {
            name: ''
          });
        }).toThrow();
      });
      it("throws if there's no html/text field on message", function() {
        return expect(function() {
          return validate.messages([
            {
              type: 'Error'
            }
          ], {
            name: ''
          });
        }).toThrow();
      });
      it('throws if html/text is invalid', function() {
        expect(function() {
          return validate.messages([
            {
              type: 'Error',
              html: 1
            }
          ], {
            name: ''
          });
        }).toThrow();
        expect(function() {
          return validate.messages([
            {
              type: 'Error',
              text: 1
            }
          ], {
            name: ''
          });
        }).toThrow();
        expect(function() {
          return validate.messages([
            {
              type: 'Error',
              html: false
            }
          ], {
            name: ''
          });
        }).toThrow();
        expect(function() {
          return validate.messages([
            {
              type: 'Error',
              text: false
            }
          ], {
            name: ''
          });
        }).toThrow();
        expect(function() {
          return validate.messages([
            {
              type: 'Error',
              html: []
            }
          ], {
            name: ''
          });
        }).toThrow();
        return expect(function() {
          return validate.messages([
            {
              type: 'Error',
              text: []
            }
          ], {
            name: ''
          });
        }).toThrow();
      });
      it('throws if trace is invalid', function() {
        expect(function() {
          return validate.messages([
            {
              type: 'Error',
              html: 'a',
              trace: 1
            }
          ], {
            name: ''
          });
        }).toThrow();
        return validate.messages([
          {
            type: 'Error',
            html: 'a',
            trace: false
          }
        ], {
          name: ''
        });
      });
      it('throws if class is invalid', function() {
        expect(function() {
          return validate.messages([
            {
              type: 'Error',
              text: 'Well',
              "class": 1
            }
          ], {
            name: ''
          });
        }).toThrow();
        expect(function() {
          return validate.messages([
            {
              type: 'Error',
              text: 'Well',
              "class": []
            }
          ], {
            name: ''
          });
        }).toThrow();
        return validate.messages([
          {
            type: 'Error',
            text: 'Well',
            "class": 'error'
          }
        ], {
          name: ''
        });
      });
      it('throws if filePath is invalid', function() {
        expect(function() {
          return validate.messages([
            {
              type: 'Error',
              text: 'Well',
              "class": 'error',
              filePath: 1
            }
          ], {
            name: ''
          });
        }).toThrow();
        return validate.messages([
          {
            type: 'Error',
            text: 'Well',
            "class": 'error',
            filePath: '/'
          }
        ], {
          name: ''
        });
      });
      return it('throws if both text and html are provided', function() {
        expect(function() {
          return validate.messages([
            {
              type: 'Error',
              text: 'Well',
              html: 'a',
              "class": 'error',
              filePath: '/'
            }
          ], {
            name: ''
          });
        }).toThrow();
        validate.messages([
          {
            type: 'Error',
            text: 'Well',
            "class": 'error',
            filePath: '/'
          }
        ], {
          name: ''
        });
        validate.messages([
          {
            type: 'Error',
            html: 'Well',
            "class": 'error',
            filePath: '/'
          }
        ], {
          name: ''
        });
        return validate.messages([
          {
            type: 'Error',
            html: document.createElement('div'),
            "class": 'error',
            filePath: '/'
          }
        ], {
          name: ''
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9zcGVjL3ZhbGlkYXRlLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLFFBQUEsQ0FBUyxVQUFULEVBQXFCLFNBQUEsR0FBQTtBQUNuQixRQUFBLG1CQUFBO0FBQUEsSUFBQSxRQUFBLEdBQVcsT0FBQSxDQUFRLGlCQUFSLENBQVgsQ0FBQTtBQUFBLElBQ0MsWUFBYSxPQUFBLENBQVEsVUFBUixFQUFiLFNBREQsQ0FBQTtBQUFBLElBRUEsUUFBQSxDQUFTLFVBQVQsRUFBcUIsU0FBQSxHQUFBO0FBQ25CLE1BQUEsRUFBQSxDQUFHLCtDQUFILEVBQW9ELFNBQUEsR0FBQTtlQUNsRCxNQUFBLENBQU8sU0FBQSxHQUFBO0FBQ0wsY0FBQSxNQUFBO0FBQUEsVUFBQSxNQUFBLEdBQVMsU0FBQSxDQUFBLENBQVQsQ0FBQTtBQUFBLFVBQ0EsTUFBTSxDQUFDLGFBQVAsR0FBdUIsS0FEdkIsQ0FBQTtpQkFFQSxRQUFRLENBQUMsTUFBVCxDQUFnQixNQUFoQixFQUhLO1FBQUEsQ0FBUCxDQUlBLENBQUMsT0FKRCxDQUlTLDJDQUpULEVBRGtEO01BQUEsQ0FBcEQsQ0FBQSxDQUFBO0FBQUEsTUFNQSxFQUFBLENBQUcsMkJBQUgsRUFBZ0MsU0FBQSxHQUFBO2VBQzlCLE1BQUEsQ0FBTyxTQUFBLEdBQUE7QUFDTCxjQUFBLE1BQUE7QUFBQSxVQUFBLE1BQUEsR0FBUyxTQUFBLENBQUEsQ0FBVCxDQUFBO0FBQUEsVUFDQSxNQUFBLENBQUEsTUFBYSxDQUFDLElBRGQsQ0FBQTtpQkFFQSxRQUFRLENBQUMsTUFBVCxDQUFnQixNQUFoQixFQUhLO1FBQUEsQ0FBUCxDQUlBLENBQUMsT0FKRCxDQUFBLEVBRDhCO01BQUEsQ0FBaEMsQ0FOQSxDQUFBO0FBQUEsTUFZQSxFQUFB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

//# sourceURL=/Users/ah/.atom/packages/linter/spec/validate-spec.coffee
