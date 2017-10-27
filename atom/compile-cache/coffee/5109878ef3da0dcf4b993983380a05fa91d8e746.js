(function() {
  describe('Pretty JSON', function() {
    var PrettyJSON;
    PrettyJSON = [][0];
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.packages.activatePackage('language-json');
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('language-gfm');
      });
      return waitsForPromise(function() {
        return atom.packages.activatePackage('pretty-json').then(function(pack) {
          return PrettyJSON = pack.mainModule;
        });
      });
    });
    describe('when prettifying large data file', function() {
      return it('does not crash', function() {
        return waitsForPromise(function() {
          return atom.workspace.open('large.json').then(function(editor) {
            return PrettyJSON.prettify(editor, {
              sorted: false
            });
          });
        });
      });
    });
    describe('when prettifying large integers', function() {
      return it('does not truncate integers', function() {
        return waitsForPromise(function() {
          return atom.workspace.open('bigint.json').then(function(editor) {
            PrettyJSON.prettify(editor, {
              sorted: false
            });
            return expect(editor.getText()).toBe("{\n  \"bigint\": 6926665213734576388,\n  \"float\": 1.23456e-10\n}");
          });
        });
      });
    });
    describe('when no text is selected', function() {
      return it('does not change anything', function() {
        return waitsForPromise(function() {
          return atom.workspace.open('valid.md').then(function(editor) {
            PrettyJSON.prettify(editor, {
              sorted: false
            });
            return expect(editor.getText()).toBe("Start\n{ \"c\": \"d\", \"a\": \"b\" }\nEnd\n");
          });
        });
      });
    });
    describe('when a valid json text is selected', function() {
      return it('formats it correctly', function() {
        return waitsForPromise(function() {
          return atom.workspace.open('valid.md').then(function(editor) {
            editor.setSelectedBufferRange([[1, 0], [1, 22]]);
            PrettyJSON.prettify(editor, {
              sorted: false
            });
            return expect(editor.getText()).toBe("Start\n{\n  \"c\": \"d\",\n  \"a\": \"b\"\n}\nEnd\n");
          });
        });
      });
    });
    describe('when an invalid json text is selected', function() {
      return it('does not change anything', function() {
        return waitsForPromise(function() {
          return atom.workspace.open('invalid.md').then(function(editor) {
            editor.setSelectedBufferRange([[1, 0], [1, 2]]);
            PrettyJSON.prettify(editor, {
              sorted: false
            });
            return expect(editor.getText()).toBe("Start\n{]\nEnd\n");
          });
        });
      });
    });
    describe('JSON file with invalid JSON', function() {
      return it('does not change anything', function() {
        return waitsForPromise(function() {
          return atom.workspace.open('invalid.json').then(function(editor) {
            PrettyJSON.prettify(editor, {
              sorted: false
            });
            return expect(editor.getText()).toBe("{ \"c\": \"d\", \"a\": \"b\", }\n");
          });
        });
      });
    });
    describe('JSON file with valid JSON', function() {
      return it('formats the whole file correctly', function() {
        return waitsForPromise(function() {
          return atom.workspace.open('valid.json').then(function(editor) {
            PrettyJSON.prettify(editor, {
              sorted: false
            });
            return expect(editor.getText()).toBe("{\n  \"c\": \"d\",\n  \"a\": \"b\"\n}");
          });
        });
      });
    });
    describe('Sort and prettify JSON file with invalid JSON', function() {
      return it('does not change anything', function() {
        return waitsForPromise(function() {
          return atom.workspace.open('invalid.json').then(function(editor) {
            PrettyJSON.prettify(editor, {
              sorted: true
            });
            return expect(editor.getText()).toBe("{ \"c\": \"d\", \"a\": \"b\", }\n");
          });
        });
      });
    });
    describe('Sort and prettify JSON file with valid JSON', function() {
      return it('formats the whole file correctly', function() {
        return waitsForPromise(function() {
          return atom.workspace.open('valid.json').then(function(editor) {
            PrettyJSON.prettify(editor, {
              sorted: true
            });
            return expect(editor.getText()).toBe("{\n  \"a\": \"b\",\n  \"c\": \"d\"\n}");
          });
        });
      });
    });
    describe('Minify JSON file with invalid JSON', function() {
      return it('does not change anything', function() {
        return waitsForPromise(function() {
          return atom.workspace.open('invalid.json').then(function(editor) {
            PrettyJSON.minify(editor);
            return expect(editor.getText()).toBe("{ \"c\": \"d\", \"a\": \"b\", }\n");
          });
        });
      });
    });
    describe('Minify JSON file with valid JSON', function() {
      return it('formats the whole file correctly', function() {
        return waitsForPromise(function() {
          return atom.workspace.open('valid.json').then(function(editor) {
            PrettyJSON.minify(editor);
            return expect(editor.getText()).toBe("{\"c\":\"d\",\"a\":\"b\"}");
          });
        });
      });
    });
    describe('Minify selected JSON', function() {
      return it('Minifies JSON data', function() {
        return waitsForPromise(function() {
          return atom.workspace.open('valid.md').then(function(editor) {
            editor.setSelectedBufferRange([[1, 0], [1, 22]]);
            PrettyJSON.minify(editor);
            return expect(editor.getText()).toBe("Start\n{\"c\":\"d\",\"a\":\"b\" }\nEnd\n");
          });
        });
      });
    });
    describe('JSON file with valid JavaScript Object Literal', function() {
      return it('jsonifies file correctly', function() {
        return waitsForPromise(function() {
          return atom.workspace.open('object.json').then(function(editor) {
            PrettyJSON.jsonify(editor, {
              sorted: false
            });
            return expect(editor.getText()).toBe("{\n  \"c\": 3,\n  \"a\": 1\n}");
          });
        });
      });
    });
    describe('JSON file with valid JavaScript Object Literal', function() {
      return it('jsonifies and sorts file correctly', function() {
        return waitsForPromise(function() {
          return atom.workspace.open('object.json').then(function(editor) {
            PrettyJSON.jsonify(editor, {
              sorted: true
            });
            return expect(editor.getText()).toBe("{\n  \"a\": 1,\n  \"c\": 3\n}");
          });
        });
      });
    });
    describe('Sort and prettify JSON file with BigNumbers', function() {
      return it('does not destroy formatting of numbers', function() {
        return waitsForPromise(function() {
          return atom.workspace.open('stats.json').then(function(editor) {
            PrettyJSON.prettify(editor, {
              sorted: true
            });
            return expect(editor.getText()).toBe("{\n  \"DV\": [\n    {\n      \"BC\": 100,\n      \"Chromosome\": \"chr22\",\n      \"PopulationFrequencyEthnicBackground\": \"20.316622691292874\",\n      \"PopulationFrequencyGeneral\": \"29.716117216117215\",\n      \"RQ\": null,\n      \"ZW\": [\n      ]\n    }\n  ]\n}");
          });
        });
      });
    });
    describe('when a valid json text is selected', function() {
      return it('formats it correctly, and selects the formatted text', function() {
        return waitsForPromise(function() {
          return atom.workspace.open('selected.json').then(function(editor) {
            var range;
            editor.setSelectedBufferRange([[0, 0], [0, 32]]);
            PrettyJSON.prettify(editor, {
              sorted: false
            });
            expect(editor.getText()).toBe("{\n  \"key\": {\n    \"key\": {\n      \"key\": \"value\"\n    }\n  }\n}\n");
            range = editor.getSelectedBufferRange();
            expect(range.start.row).toBe(0);
            expect(range.start.column).toBe(0);
            expect(range.end.row).toBe(6);
            return expect(range.end.column).toBe(1);
          });
        });
      });
    });
    xdescribe('when sorting and prettifying floating point numbers', function() {
      return it('does not turn them into strings', function() {
        return waitsForPromise(function() {
          return atom.workspace.open('floating.json').then(function(editor) {
            PrettyJSON.prettify(editor, {
              sorted: true
            });
            return expect(editor.getText()).toBe("{\n  \"floating_point\": -0.6579373322603248\n}");
          });
        });
      });
    });
    return xdescribe('when prettifying whole numbers represented as floating point', function() {
      return it('does not turn them into whole numbers', function() {
        return waitsForPromise(function() {
          return atom.workspace.open('number.json').then(function(editor) {
            PrettyJSON.prettify(editor, {
              sorted: false
            });
            return expect(editor.getText()).toBe("{\n  \"int\": 6.0\n}");
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3ByZXR0eS1qc29uL3NwZWMvaW5kZXgtc3BlYy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQSxRQUFBLENBQVMsYUFBVCxFQUF3QixTQUFBO0FBQ3RCLFFBQUE7SUFBQyxhQUFjO0lBRWYsVUFBQSxDQUFXLFNBQUE7TUFDVCxlQUFBLENBQWdCLFNBQUE7ZUFBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsZUFBOUI7TUFBSCxDQUFoQjtNQUNBLGVBQUEsQ0FBZ0IsU0FBQTtlQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixjQUE5QjtNQUFILENBQWhCO2FBQ0EsZUFBQSxDQUFnQixTQUFBO2VBQ2QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLGFBQTlCLENBQTRDLENBQUMsSUFBN0MsQ0FBa0QsU0FBQyxJQUFEO2lCQUNoRCxVQUFBLEdBQWEsSUFBSSxDQUFDO1FBRDhCLENBQWxEO01BRGMsQ0FBaEI7SUFIUyxDQUFYO0lBT0EsUUFBQSxDQUFTLGtDQUFULEVBQTZDLFNBQUE7YUFDM0MsRUFBQSxDQUFHLGdCQUFILEVBQXFCLFNBQUE7ZUFDbkIsZUFBQSxDQUFnQixTQUFBO2lCQUNkLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixZQUFwQixDQUNFLENBQUMsSUFESCxDQUNRLFNBQUMsTUFBRDttQkFDSixVQUFVLENBQUMsUUFBWCxDQUFvQixNQUFwQixFQUNFO2NBQUEsTUFBQSxFQUFRLEtBQVI7YUFERjtVQURJLENBRFI7UUFEYyxDQUFoQjtNQURtQixDQUFyQjtJQUQyQyxDQUE3QztJQVFBLFFBQUEsQ0FBUyxpQ0FBVCxFQUE0QyxTQUFBO2FBQzFDLEVBQUEsQ0FBRyw0QkFBSCxFQUFpQyxTQUFBO2VBQy9CLGVBQUEsQ0FBZ0IsU0FBQTtpQkFDZCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsYUFBcEIsQ0FDRSxDQUFDLElBREgsQ0FDUSxTQUFDLE1BQUQ7WUFDSixVQUFVLENBQUMsUUFBWCxDQUFvQixNQUFwQixFQUNFO2NBQUEsTUFBQSxFQUFRLEtBQVI7YUFERjttQkFFQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsb0VBQTlCO1VBSEksQ0FEUjtRQURjLENBQWhCO01BRCtCLENBQWpDO0lBRDBDLENBQTVDO0lBY0EsUUFBQSxDQUFTLDBCQUFULEVBQXFDLFNBQUE7YUFDbkMsRUFBQSxDQUFHLDBCQUFILEVBQStCLFNBQUE7ZUFDN0IsZUFBQSxDQUFnQixTQUFBO2lCQUNkLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixVQUFwQixDQUNFLENBQUMsSUFESCxDQUNRLFNBQUMsTUFBRDtZQUNKLFVBQVUsQ0FBQyxRQUFYLENBQW9CLE1BQXBCLEVBQ0U7Y0FBQSxNQUFBLEVBQVEsS0FBUjthQURGO21CQUVBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4Qiw4Q0FBOUI7VUFISSxDQURSO1FBRGMsQ0FBaEI7TUFENkIsQ0FBL0I7SUFEbUMsQ0FBckM7SUFjQSxRQUFBLENBQVMsb0NBQVQsRUFBK0MsU0FBQTthQUM3QyxFQUFBLENBQUcsc0JBQUgsRUFBMkIsU0FBQTtlQUN6QixlQUFBLENBQWdCLFNBQUE7aUJBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLFVBQXBCLENBQ0UsQ0FBQyxJQURILENBQ1EsU0FBQyxNQUFEO1lBQ0osTUFBTSxDQUFDLHNCQUFQLENBQThCLENBQUMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFELEVBQVMsQ0FBQyxDQUFELEVBQUksRUFBSixDQUFULENBQTlCO1lBQ0EsVUFBVSxDQUFDLFFBQVgsQ0FBb0IsTUFBcEIsRUFDRTtjQUFBLE1BQUEsRUFBUSxLQUFSO2FBREY7bUJBRUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLHFEQUE5QjtVQUpJLENBRFI7UUFEYyxDQUFoQjtNQUR5QixDQUEzQjtJQUQ2QyxDQUEvQztJQWtCQSxRQUFBLENBQVMsdUNBQVQsRUFBa0QsU0FBQTthQUNoRCxFQUFBLENBQUcsMEJBQUgsRUFBK0IsU0FBQTtlQUM3QixlQUFBLENBQWdCLFNBQUE7aUJBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLFlBQXBCLENBQ0UsQ0FBQyxJQURILENBQ1EsU0FBQyxNQUFEO1lBQ0osTUFBTSxDQUFDLHNCQUFQLENBQThCLENBQUMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFELEVBQVMsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFULENBQTlCO1lBQ0EsVUFBVSxDQUFDLFFBQVgsQ0FBb0IsTUFBcEIsRUFDRTtjQUFBLE1BQUEsRUFBUSxLQUFSO2FBREY7bUJBRUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLGtCQUE5QjtVQUpJLENBRFI7UUFEYyxDQUFoQjtNQUQ2QixDQUEvQjtJQURnRCxDQUFsRDtJQWVBLFFBQUEsQ0FBUyw2QkFBVCxFQUF3QyxTQUFBO2FBQ3RDLEVBQUEsQ0FBRywwQkFBSCxFQUErQixTQUFBO2VBQzdCLGVBQUEsQ0FBZ0IsU0FBQTtpQkFDZCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsY0FBcEIsQ0FDRSxDQUFDLElBREgsQ0FDUSxTQUFDLE1BQUQ7WUFDSixVQUFVLENBQUMsUUFBWCxDQUFvQixNQUFwQixFQUNFO2NBQUEsTUFBQSxFQUFRLEtBQVI7YUFERjttQkFFQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsbUNBQTlCO1VBSEksQ0FEUjtRQURjLENBQWhCO01BRDZCLENBQS9CO0lBRHNDLENBQXhDO0lBWUEsUUFBQSxDQUFTLDJCQUFULEVBQXNDLFNBQUE7YUFDcEMsRUFBQSxDQUFHLGtDQUFILEVBQXVDLFNBQUE7ZUFDckMsZUFBQSxDQUFnQixTQUFBO2lCQUNkLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixZQUFwQixDQUNFLENBQUMsSUFESCxDQUNRLFNBQUMsTUFBRDtZQUNKLFVBQVUsQ0FBQyxRQUFYLENBQW9CLE1BQXBCLEVBQ0U7Y0FBQSxNQUFBLEVBQVEsS0FBUjthQURGO21CQUVBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4Qix1Q0FBOUI7VUFISSxDQURSO1FBRGMsQ0FBaEI7TUFEcUMsQ0FBdkM7SUFEb0MsQ0FBdEM7SUFjQSxRQUFBLENBQVMsK0NBQVQsRUFBMEQsU0FBQTthQUN4RCxFQUFBLENBQUcsMEJBQUgsRUFBK0IsU0FBQTtlQUM3QixlQUFBLENBQWdCLFNBQUE7aUJBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLGNBQXBCLENBQ0UsQ0FBQyxJQURILENBQ1EsU0FBQyxNQUFEO1lBQ0osVUFBVSxDQUFDLFFBQVgsQ0FBb0IsTUFBcEIsRUFDRTtjQUFBLE1BQUEsRUFBUSxJQUFSO2FBREY7bUJBRUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLG1DQUE5QjtVQUhJLENBRFI7UUFEYyxDQUFoQjtNQUQ2QixDQUEvQjtJQUR3RCxDQUExRDtJQVlBLFFBQUEsQ0FBUyw2Q0FBVCxFQUF3RCxTQUFBO2FBQ3RELEVBQUEsQ0FBRyxrQ0FBSCxFQUF1QyxTQUFBO2VBQ3JDLGVBQUEsQ0FBZ0IsU0FBQTtpQkFDZCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsWUFBcEIsQ0FDRSxDQUFDLElBREgsQ0FDUSxTQUFDLE1BQUQ7WUFDSixVQUFVLENBQUMsUUFBWCxDQUFvQixNQUFwQixFQUNFO2NBQUEsTUFBQSxFQUFRLElBQVI7YUFERjttQkFFQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsdUNBQTlCO1VBSEksQ0FEUjtRQURjLENBQWhCO01BRHFDLENBQXZDO0lBRHNELENBQXhEO0lBY0EsUUFBQSxDQUFTLG9DQUFULEVBQStDLFNBQUE7YUFDN0MsRUFBQSxDQUFHLDBCQUFILEVBQStCLFNBQUE7ZUFDN0IsZUFBQSxDQUFnQixTQUFBO2lCQUNkLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixjQUFwQixDQUNFLENBQUMsSUFESCxDQUNRLFNBQUMsTUFBRDtZQUNKLFVBQVUsQ0FBQyxNQUFYLENBQWtCLE1BQWxCO21CQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixtQ0FBOUI7VUFGSSxDQURSO1FBRGMsQ0FBaEI7TUFENkIsQ0FBL0I7SUFENkMsQ0FBL0M7SUFXQSxRQUFBLENBQVMsa0NBQVQsRUFBNkMsU0FBQTthQUMzQyxFQUFBLENBQUcsa0NBQUgsRUFBdUMsU0FBQTtlQUNyQyxlQUFBLENBQWdCLFNBQUE7aUJBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLFlBQXBCLENBQ0UsQ0FBQyxJQURILENBQ1EsU0FBQyxNQUFEO1lBQ0osVUFBVSxDQUFDLE1BQVgsQ0FBa0IsTUFBbEI7bUJBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLDJCQUE5QjtVQUZJLENBRFI7UUFEYyxDQUFoQjtNQURxQyxDQUF2QztJQUQyQyxDQUE3QztJQVVBLFFBQUEsQ0FBUyxzQkFBVCxFQUFpQyxTQUFBO2FBQy9CLEVBQUEsQ0FBRyxvQkFBSCxFQUF5QixTQUFBO2VBQ3ZCLGVBQUEsQ0FBZ0IsU0FBQTtpQkFDZCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsVUFBcEIsQ0FDRSxDQUFDLElBREgsQ0FDUSxTQUFDLE1BQUQ7WUFDSixNQUFNLENBQUMsc0JBQVAsQ0FBOEIsQ0FBQyxDQUFDLENBQUQsRUFBSSxDQUFKLENBQUQsRUFBUyxDQUFDLENBQUQsRUFBSSxFQUFKLENBQVQsQ0FBOUI7WUFDQSxVQUFVLENBQUMsTUFBWCxDQUFrQixNQUFsQjttQkFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsMENBQTlCO1VBSEksQ0FEUjtRQURjLENBQWhCO01BRHVCLENBQXpCO0lBRCtCLENBQWpDO0lBY0EsUUFBQSxDQUFTLGdEQUFULEVBQTJELFNBQUE7YUFDekQsRUFBQSxDQUFHLDBCQUFILEVBQStCLFNBQUE7ZUFDN0IsZUFBQSxDQUFnQixTQUFBO2lCQUNkLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixhQUFwQixDQUNFLENBQUMsSUFESCxDQUNRLFNBQUMsTUFBRDtZQUNKLFVBQVUsQ0FBQyxPQUFYLENBQW1CLE1BQW5CLEVBQ0U7Y0FBQSxNQUFBLEVBQVEsS0FBUjthQURGO21CQUVBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QiwrQkFBOUI7VUFISSxDQURSO1FBRGMsQ0FBaEI7TUFENkIsQ0FBL0I7SUFEeUQsQ0FBM0Q7SUFjQSxRQUFBLENBQVMsZ0RBQVQsRUFBMkQsU0FBQTthQUN6RCxFQUFBLENBQUcsb0NBQUgsRUFBeUMsU0FBQTtlQUN2QyxlQUFBLENBQWdCLFNBQUE7aUJBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLGFBQXBCLENBQ0UsQ0FBQyxJQURILENBQ1EsU0FBQyxNQUFEO1lBQ0osVUFBVSxDQUFDLE9BQVgsQ0FBbUIsTUFBbkIsRUFDRTtjQUFBLE1BQUEsRUFBUSxJQUFSO2FBREY7bUJBRUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLCtCQUE5QjtVQUhJLENBRFI7UUFEYyxDQUFoQjtNQUR1QyxDQUF6QztJQUR5RCxDQUEzRDtJQWNBLFFBQUEsQ0FBUyw2Q0FBVCxFQUF3RCxTQUFBO2FBQ3RELEVBQUEsQ0FBRyx3Q0FBSCxFQUE2QyxTQUFBO2VBQzNDLGVBQUEsQ0FBZ0IsU0FBQTtpQkFDZCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsWUFBcEIsQ0FDRSxDQUFDLElBREgsQ0FDUSxTQUFDLE1BQUQ7WUFDSixVQUFVLENBQUMsUUFBWCxDQUFvQixNQUFwQixFQUNFO2NBQUEsTUFBQSxFQUFRLElBQVI7YUFERjttQkFFQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsa1JBQTlCO1VBSEksQ0FEUjtRQURjLENBQWhCO01BRDJDLENBQTdDO0lBRHNELENBQXhEO0lBdUJBLFFBQUEsQ0FBUyxvQ0FBVCxFQUErQyxTQUFBO2FBQzdDLEVBQUEsQ0FBRyxzREFBSCxFQUEyRCxTQUFBO2VBQ3pELGVBQUEsQ0FBZ0IsU0FBQTtpQkFDZCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsZUFBcEIsQ0FDRSxDQUFDLElBREgsQ0FDUSxTQUFDLE1BQUQ7QUFDSixnQkFBQTtZQUFBLE1BQU0sQ0FBQyxzQkFBUCxDQUE4QixDQUFDLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBRCxFQUFTLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBVCxDQUE5QjtZQUNBLFVBQVUsQ0FBQyxRQUFYLENBQW9CLE1BQXBCLEVBQ0U7Y0FBQSxNQUFBLEVBQVEsS0FBUjthQURGO1lBRUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLDRFQUE5QjtZQVVBLEtBQUEsR0FBUSxNQUFNLENBQUMsc0JBQVAsQ0FBQTtZQUNSLE1BQUEsQ0FBTyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQW5CLENBQXVCLENBQUMsSUFBeEIsQ0FBNkIsQ0FBN0I7WUFDQSxNQUFBLENBQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFuQixDQUEwQixDQUFDLElBQTNCLENBQWdDLENBQWhDO1lBQ0EsTUFBQSxDQUFPLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBakIsQ0FBcUIsQ0FBQyxJQUF0QixDQUEyQixDQUEzQjttQkFDQSxNQUFBLENBQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFqQixDQUF3QixDQUFDLElBQXpCLENBQThCLENBQTlCO1VBbEJJLENBRFI7UUFEYyxDQUFoQjtNQUR5RCxDQUEzRDtJQUQ2QyxDQUEvQztJQTBCQSxTQUFBLENBQVUscURBQVYsRUFBaUUsU0FBQTthQUMvRCxFQUFBLENBQUcsaUNBQUgsRUFBc0MsU0FBQTtlQUNwQyxlQUFBLENBQWdCLFNBQUE7aUJBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLGVBQXBCLENBQ0UsQ0FBQyxJQURILENBQ1EsU0FBQyxNQUFEO1lBQ0osVUFBVSxDQUFDLFFBQVgsQ0FBb0IsTUFBcEIsRUFDRTtjQUFBLE1BQUEsRUFBUSxJQUFSO2FBREY7bUJBRUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLGlEQUE5QjtVQUhJLENBRFI7UUFEYyxDQUFoQjtNQURvQyxDQUF0QztJQUQrRCxDQUFqRTtXQWVBLFNBQUEsQ0FBVSw4REFBVixFQUEwRSxTQUFBO2FBQ3hFLEVBQUEsQ0FBRyx1Q0FBSCxFQUE0QyxTQUFBO2VBQzFDLGVBQUEsQ0FBZ0IsU0FBQTtpQkFDZCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsYUFBcEIsQ0FDRSxDQUFDLElBREgsQ0FDUSxTQUFDLE1BQUQ7WUFDSixVQUFVLENBQUMsUUFBWCxDQUFvQixNQUFwQixFQUNFO2NBQUEsTUFBQSxFQUFRLEtBQVI7YUFERjttQkFFQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsc0JBQTlCO1VBSEksQ0FEUjtRQURjLENBQWhCO01BRDBDLENBQTVDO0lBRHdFLENBQTFFO0VBbFFzQixDQUF4QjtBQUFBIiwic291cmNlc0NvbnRlbnQiOlsiZGVzY3JpYmUgJ1ByZXR0eSBKU09OJywgLT5cbiAgW1ByZXR0eUpTT05dID0gW11cblxuICBiZWZvcmVFYWNoIC0+XG4gICAgd2FpdHNGb3JQcm9taXNlIC0+IGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdsYW5ndWFnZS1qc29uJylcbiAgICB3YWl0c0ZvclByb21pc2UgLT4gYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoJ2xhbmd1YWdlLWdmbScpXG4gICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICBhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZSgncHJldHR5LWpzb24nKS50aGVuIChwYWNrKSAtPlxuICAgICAgICBQcmV0dHlKU09OID0gcGFjay5tYWluTW9kdWxlXG5cbiAgZGVzY3JpYmUgJ3doZW4gcHJldHRpZnlpbmcgbGFyZ2UgZGF0YSBmaWxlJywgLT5cbiAgICBpdCAnZG9lcyBub3QgY3Jhc2gnLCAtPlxuICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oJ2xhcmdlLmpzb24nKVxuICAgICAgICAgIC50aGVuIChlZGl0b3IpIC0+XG4gICAgICAgICAgICBQcmV0dHlKU09OLnByZXR0aWZ5IGVkaXRvcixcbiAgICAgICAgICAgICAgc29ydGVkOiBmYWxzZVxuXG4gIGRlc2NyaWJlICd3aGVuIHByZXR0aWZ5aW5nIGxhcmdlIGludGVnZXJzJywgLT5cbiAgICBpdCAnZG9lcyBub3QgdHJ1bmNhdGUgaW50ZWdlcnMnLCAtPlxuICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oJ2JpZ2ludC5qc29uJylcbiAgICAgICAgICAudGhlbiAoZWRpdG9yKSAtPlxuICAgICAgICAgICAgUHJldHR5SlNPTi5wcmV0dGlmeSBlZGl0b3IsXG4gICAgICAgICAgICAgIHNvcnRlZDogZmFsc2VcbiAgICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiXCJcIlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcImJpZ2ludFwiOiA2OTI2NjY1MjEzNzM0NTc2Mzg4LFxuICAgICAgICAgICAgICBcImZsb2F0XCI6IDEuMjM0NTZlLTEwXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcIlwiXCJcblxuICBkZXNjcmliZSAnd2hlbiBubyB0ZXh0IGlzIHNlbGVjdGVkJywgLT5cbiAgICBpdCAnZG9lcyBub3QgY2hhbmdlIGFueXRoaW5nJywgLT5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKCd2YWxpZC5tZCcpXG4gICAgICAgICAgLnRoZW4gKGVkaXRvcikgLT5cbiAgICAgICAgICAgIFByZXR0eUpTT04ucHJldHRpZnkgZWRpdG9yLFxuICAgICAgICAgICAgICBzb3J0ZWQ6IGZhbHNlXG4gICAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSBcIlwiXCJcbiAgICAgICAgICAgICAgU3RhcnRcbiAgICAgICAgICAgICAgeyBcImNcIjogXCJkXCIsIFwiYVwiOiBcImJcIiB9XG4gICAgICAgICAgICAgIEVuZFxuXG4gICAgICAgICAgICBcIlwiXCJcblxuICBkZXNjcmliZSAnd2hlbiBhIHZhbGlkIGpzb24gdGV4dCBpcyBzZWxlY3RlZCcsIC0+XG4gICAgaXQgJ2Zvcm1hdHMgaXQgY29ycmVjdGx5JywgLT5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKCd2YWxpZC5tZCcpXG4gICAgICAgICAgLnRoZW4gKGVkaXRvcikgLT5cbiAgICAgICAgICAgIGVkaXRvci5zZXRTZWxlY3RlZEJ1ZmZlclJhbmdlKFtbMSwgMF0sIFsxLCAyMl1dKVxuICAgICAgICAgICAgUHJldHR5SlNPTi5wcmV0dGlmeSBlZGl0b3IsXG4gICAgICAgICAgICAgIHNvcnRlZDogZmFsc2VcbiAgICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiXCJcIlxuICAgICAgICAgICAgICBTdGFydFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJjXCI6IFwiZFwiLFxuICAgICAgICAgICAgICAgIFwiYVwiOiBcImJcIlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIEVuZFxuXG4gICAgICAgICAgICBcIlwiXCJcblxuICBkZXNjcmliZSAnd2hlbiBhbiBpbnZhbGlkIGpzb24gdGV4dCBpcyBzZWxlY3RlZCcsIC0+XG4gICAgaXQgJ2RvZXMgbm90IGNoYW5nZSBhbnl0aGluZycsIC0+XG4gICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbignaW52YWxpZC5tZCcpXG4gICAgICAgICAgLnRoZW4gKGVkaXRvcikgLT5cbiAgICAgICAgICAgIGVkaXRvci5zZXRTZWxlY3RlZEJ1ZmZlclJhbmdlKFtbMSwgMF0sIFsxLCAyXV0pXG4gICAgICAgICAgICBQcmV0dHlKU09OLnByZXR0aWZ5IGVkaXRvcixcbiAgICAgICAgICAgICAgc29ydGVkOiBmYWxzZVxuICAgICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCJcIlwiXG4gICAgICAgICAgICBTdGFydFxuICAgICAgICAgICAge11cbiAgICAgICAgICAgIEVuZFxuXG4gICAgICAgICAgICBcIlwiXCJcblxuICBkZXNjcmliZSAnSlNPTiBmaWxlIHdpdGggaW52YWxpZCBKU09OJywgLT5cbiAgICBpdCAnZG9lcyBub3QgY2hhbmdlIGFueXRoaW5nJywgLT5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKCdpbnZhbGlkLmpzb24nKVxuICAgICAgICAgIC50aGVuIChlZGl0b3IpIC0+XG4gICAgICAgICAgICBQcmV0dHlKU09OLnByZXR0aWZ5IGVkaXRvcixcbiAgICAgICAgICAgICAgc29ydGVkOiBmYWxzZVxuICAgICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCJcIlwiXG4gICAgICAgICAgICB7IFwiY1wiOiBcImRcIiwgXCJhXCI6IFwiYlwiLCB9XG5cbiAgICAgICAgICAgIFwiXCJcIlxuXG4gIGRlc2NyaWJlICdKU09OIGZpbGUgd2l0aCB2YWxpZCBKU09OJywgLT5cbiAgICBpdCAnZm9ybWF0cyB0aGUgd2hvbGUgZmlsZSBjb3JyZWN0bHknLCAtPlxuICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oJ3ZhbGlkLmpzb24nKVxuICAgICAgICAgIC50aGVuIChlZGl0b3IpIC0+XG4gICAgICAgICAgICBQcmV0dHlKU09OLnByZXR0aWZ5IGVkaXRvcixcbiAgICAgICAgICAgICAgc29ydGVkOiBmYWxzZVxuICAgICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCJcIlwiXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcImNcIjogXCJkXCIsXG4gICAgICAgICAgICAgICAgXCJhXCI6IFwiYlwiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFwiXCJcIlxuXG4gIGRlc2NyaWJlICdTb3J0IGFuZCBwcmV0dGlmeSBKU09OIGZpbGUgd2l0aCBpbnZhbGlkIEpTT04nLCAtPlxuICAgIGl0ICdkb2VzIG5vdCBjaGFuZ2UgYW55dGhpbmcnLCAtPlxuICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oJ2ludmFsaWQuanNvbicpXG4gICAgICAgICAgLnRoZW4gKGVkaXRvcikgLT5cbiAgICAgICAgICAgIFByZXR0eUpTT04ucHJldHRpZnkgZWRpdG9yLFxuICAgICAgICAgICAgICBzb3J0ZWQ6IHRydWVcbiAgICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiXCJcIlxuICAgICAgICAgICAgeyBcImNcIjogXCJkXCIsIFwiYVwiOiBcImJcIiwgfVxuXG4gICAgICAgICAgICBcIlwiXCJcblxuICBkZXNjcmliZSAnU29ydCBhbmQgcHJldHRpZnkgSlNPTiBmaWxlIHdpdGggdmFsaWQgSlNPTicsIC0+XG4gICAgaXQgJ2Zvcm1hdHMgdGhlIHdob2xlIGZpbGUgY29ycmVjdGx5JywgLT5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKCd2YWxpZC5qc29uJylcbiAgICAgICAgICAudGhlbiAoZWRpdG9yKSAtPlxuICAgICAgICAgICAgUHJldHR5SlNPTi5wcmV0dGlmeSBlZGl0b3IsXG4gICAgICAgICAgICAgIHNvcnRlZDogdHJ1ZVxuICAgICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCJcIlwiXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcImFcIjogXCJiXCIsXG4gICAgICAgICAgICAgICAgXCJjXCI6IFwiZFwiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFwiXCJcIlxuXG4gIGRlc2NyaWJlICdNaW5pZnkgSlNPTiBmaWxlIHdpdGggaW52YWxpZCBKU09OJywgLT5cbiAgICBpdCAnZG9lcyBub3QgY2hhbmdlIGFueXRoaW5nJywgLT5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKCdpbnZhbGlkLmpzb24nKVxuICAgICAgICAgIC50aGVuIChlZGl0b3IpIC0+XG4gICAgICAgICAgICBQcmV0dHlKU09OLm1pbmlmeSBlZGl0b3JcbiAgICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiXCJcIlxuICAgICAgICAgICAgeyBcImNcIjogXCJkXCIsIFwiYVwiOiBcImJcIiwgfVxuXG4gICAgICAgICAgICBcIlwiXCJcblxuICBkZXNjcmliZSAnTWluaWZ5IEpTT04gZmlsZSB3aXRoIHZhbGlkIEpTT04nLCAtPlxuICAgIGl0ICdmb3JtYXRzIHRoZSB3aG9sZSBmaWxlIGNvcnJlY3RseScsIC0+XG4gICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbigndmFsaWQuanNvbicpXG4gICAgICAgICAgLnRoZW4gKGVkaXRvcikgLT5cbiAgICAgICAgICAgIFByZXR0eUpTT04ubWluaWZ5IGVkaXRvclxuICAgICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCJcIlwiXG4gICAgICAgICAgICAgIHtcImNcIjpcImRcIixcImFcIjpcImJcIn1cbiAgICAgICAgICAgIFwiXCJcIlxuXG4gIGRlc2NyaWJlICdNaW5pZnkgc2VsZWN0ZWQgSlNPTicsIC0+XG4gICAgaXQgJ01pbmlmaWVzIEpTT04gZGF0YScsIC0+XG4gICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbigndmFsaWQubWQnKVxuICAgICAgICAgIC50aGVuIChlZGl0b3IpIC0+XG4gICAgICAgICAgICBlZGl0b3Iuc2V0U2VsZWN0ZWRCdWZmZXJSYW5nZShbWzEsIDBdLCBbMSwgMjJdXSlcbiAgICAgICAgICAgIFByZXR0eUpTT04ubWluaWZ5IGVkaXRvclxuICAgICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCJcIlwiXG4gICAgICAgICAgICAgIFN0YXJ0XG4gICAgICAgICAgICAgIHtcImNcIjpcImRcIixcImFcIjpcImJcIiB9XG4gICAgICAgICAgICAgIEVuZFxuXG4gICAgICAgICAgICBcIlwiXCJcblxuICBkZXNjcmliZSAnSlNPTiBmaWxlIHdpdGggdmFsaWQgSmF2YVNjcmlwdCBPYmplY3QgTGl0ZXJhbCcsIC0+XG4gICAgaXQgJ2pzb25pZmllcyBmaWxlIGNvcnJlY3RseScsIC0+XG4gICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3Blbignb2JqZWN0Lmpzb24nKVxuICAgICAgICAgIC50aGVuIChlZGl0b3IpIC0+XG4gICAgICAgICAgICBQcmV0dHlKU09OLmpzb25pZnkgZWRpdG9yLFxuICAgICAgICAgICAgICBzb3J0ZWQ6IGZhbHNlXG4gICAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSBcIlwiXCJcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwiY1wiOiAzLFxuICAgICAgICAgICAgICAgIFwiYVwiOiAxXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFwiXCJcIlxuXG4gIGRlc2NyaWJlICdKU09OIGZpbGUgd2l0aCB2YWxpZCBKYXZhU2NyaXB0IE9iamVjdCBMaXRlcmFsJywgLT5cbiAgICBpdCAnanNvbmlmaWVzIGFuZCBzb3J0cyBmaWxlIGNvcnJlY3RseScsIC0+XG4gICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3Blbignb2JqZWN0Lmpzb24nKVxuICAgICAgICAgIC50aGVuIChlZGl0b3IpIC0+XG4gICAgICAgICAgICBQcmV0dHlKU09OLmpzb25pZnkgZWRpdG9yLFxuICAgICAgICAgICAgICBzb3J0ZWQ6IHRydWVcbiAgICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiXCJcIlxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJhXCI6IDEsXG4gICAgICAgICAgICAgICAgXCJjXCI6IDNcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXCJcIlwiXG5cbiAgZGVzY3JpYmUgJ1NvcnQgYW5kIHByZXR0aWZ5IEpTT04gZmlsZSB3aXRoIEJpZ051bWJlcnMnLCAtPlxuICAgIGl0ICdkb2VzIG5vdCBkZXN0cm95IGZvcm1hdHRpbmcgb2YgbnVtYmVycycsIC0+XG4gICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3Blbignc3RhdHMuanNvbicpXG4gICAgICAgICAgLnRoZW4gKGVkaXRvcikgLT5cbiAgICAgICAgICAgIFByZXR0eUpTT04ucHJldHRpZnkgZWRpdG9yLFxuICAgICAgICAgICAgICBzb3J0ZWQ6IHRydWVcbiAgICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiXCJcIlxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJEVlwiOiBbXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwiQkNcIjogMTAwLFxuICAgICAgICAgICAgICAgICAgICBcIkNocm9tb3NvbWVcIjogXCJjaHIyMlwiLFxuICAgICAgICAgICAgICAgICAgICBcIlBvcHVsYXRpb25GcmVxdWVuY3lFdGhuaWNCYWNrZ3JvdW5kXCI6IFwiMjAuMzE2NjIyNjkxMjkyODc0XCIsXG4gICAgICAgICAgICAgICAgICAgIFwiUG9wdWxhdGlvbkZyZXF1ZW5jeUdlbmVyYWxcIjogXCIyOS43MTYxMTcyMTYxMTcyMTVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJSUVwiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBcIlpXXCI6IFtcbiAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXCJcIlwiXG5cbiAgZGVzY3JpYmUgJ3doZW4gYSB2YWxpZCBqc29uIHRleHQgaXMgc2VsZWN0ZWQnLCAtPlxuICAgIGl0ICdmb3JtYXRzIGl0IGNvcnJlY3RseSwgYW5kIHNlbGVjdHMgdGhlIGZvcm1hdHRlZCB0ZXh0JywgLT5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKCdzZWxlY3RlZC5qc29uJylcbiAgICAgICAgICAudGhlbiAoZWRpdG9yKSAtPlxuICAgICAgICAgICAgZWRpdG9yLnNldFNlbGVjdGVkQnVmZmVyUmFuZ2UoW1swLCAwXSwgWzAsIDMyXV0pXG4gICAgICAgICAgICBQcmV0dHlKU09OLnByZXR0aWZ5IGVkaXRvcixcbiAgICAgICAgICAgICAgc29ydGVkOiBmYWxzZVxuICAgICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCJcIlwiXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcImtleVwiOiB7XG4gICAgICAgICAgICAgICAgICBcImtleVwiOiB7XG4gICAgICAgICAgICAgICAgICAgIFwia2V5XCI6IFwidmFsdWVcIlxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBcIlwiXCJcbiAgICAgICAgICAgIHJhbmdlID0gZWRpdG9yLmdldFNlbGVjdGVkQnVmZmVyUmFuZ2UoKVxuICAgICAgICAgICAgZXhwZWN0KHJhbmdlLnN0YXJ0LnJvdykudG9CZSAwXG4gICAgICAgICAgICBleHBlY3QocmFuZ2Uuc3RhcnQuY29sdW1uKS50b0JlIDBcbiAgICAgICAgICAgIGV4cGVjdChyYW5nZS5lbmQucm93KS50b0JlIDZcbiAgICAgICAgICAgIGV4cGVjdChyYW5nZS5lbmQuY29sdW1uKS50b0JlIDFcblxuICAjIFNvcnQgcGx1cyBwcmV0dGlmeSBjYXVzZXMgZmxvYXRpbmcgcG9pbnQgbnVtYmVycyB0byBiZWNvbWUgc3RyaW5ncy5cbiAgIyBTZWUgaXNzdWUgIzYyIGZvciBtb3JlIGRldGFpbHMuXG4gIHhkZXNjcmliZSAnd2hlbiBzb3J0aW5nIGFuZCBwcmV0dGlmeWluZyBmbG9hdGluZyBwb2ludCBudW1iZXJzJywgLT5cbiAgICBpdCAnZG9lcyBub3QgdHVybiB0aGVtIGludG8gc3RyaW5ncycsIC0+XG4gICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbignZmxvYXRpbmcuanNvbicpXG4gICAgICAgICAgLnRoZW4gKGVkaXRvcikgLT5cbiAgICAgICAgICAgIFByZXR0eUpTT04ucHJldHRpZnkgZWRpdG9yLFxuICAgICAgICAgICAgICBzb3J0ZWQ6IHRydWVcbiAgICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiXCJcIlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcImZsb2F0aW5nX3BvaW50XCI6IC0wLjY1NzkzNzMzMjI2MDMyNDhcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFwiXCJcIlxuXG4gICMgUHJldHRpZnkgY2FuIGFmZmVjdCBKYXZhU2NyaXB0IG51bWJlciByZXByZXNlbnRhdGlvbjsgaWUuIDYuMCA9PiA2LlxuICAjIFNlZSBpc3N1ZSAjNDYgZm9yIG1vcmUgZGV0YWlscy5cbiAgeGRlc2NyaWJlICd3aGVuIHByZXR0aWZ5aW5nIHdob2xlIG51bWJlcnMgcmVwcmVzZW50ZWQgYXMgZmxvYXRpbmcgcG9pbnQnLCAtPlxuICAgIGl0ICdkb2VzIG5vdCB0dXJuIHRoZW0gaW50byB3aG9sZSBudW1iZXJzJywgLT5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKCdudW1iZXIuanNvbicpXG4gICAgICAgICAgLnRoZW4gKGVkaXRvcikgLT5cbiAgICAgICAgICAgIFByZXR0eUpTT04ucHJldHRpZnkgZWRpdG9yLFxuICAgICAgICAgICAgICBzb3J0ZWQ6IGZhbHNlXG4gICAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSBcIlwiXCJcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJpbnRcIjogNi4wXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcIlwiXCJcbiJdfQ==
