(function() {
  describe('rspec grammar', function() {
    var grammar;
    grammar = null;
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.packages.activatePackage('language-rspec');
      });
      return runs(function() {
        return grammar = atom.grammars.grammarForScopeName('source.ruby.rspec');
      });
    });
    it('parses the grammar', function() {
      expect(grammar).toBeTruthy();
      return expect(grammar.scopeName).toBe('source.ruby.rspec');
    });
    it('tokenizes describe', function() {
      var tokens;
      tokens = grammar.tokenizeLine('describe PostController do').tokens;
      expect(tokens[0]).toEqual({
        value: 'describe',
        scopes: ['source.ruby.rspec', 'meta.rspec.behaviour', 'keyword.other.rspec.behaviour']
      });
      expect(tokens[1]).toEqual({
        value: ' PostController ',
        scopes: ['source.ruby.rspec', 'meta.rspec.behaviour']
      });
      expect(tokens[2]).toEqual({
        value: 'do',
        scopes: ['source.ruby.rspec', 'meta.rspec.behaviour', 'keyword.control.ruby.start-block']
      });
      tokens = grammar.tokenizeLine('describe "some text" do').tokens;
      expect(tokens[0]).toEqual({
        value: 'describe',
        scopes: ['source.ruby.rspec', 'meta.rspec.behaviour', 'keyword.other.rspec.behaviour']
      });
      expect(tokens[1]).toEqual({
        value: ' ',
        scopes: ['source.ruby.rspec', 'meta.rspec.behaviour']
      });
      expect(tokens[2]).toEqual({
        value: '"',
        scopes: ['source.ruby.rspec', 'meta.rspec.behaviour', 'string.quoted.double.interpolated.ruby', 'punctuation.definition.string.begin.ruby']
      });
      expect(tokens[3]).toEqual({
        value: 'some text',
        scopes: ['source.ruby.rspec', 'meta.rspec.behaviour', 'string.quoted.double.interpolated.ruby']
      });
      expect(tokens[4]).toEqual({
        value: '"',
        scopes: ['source.ruby.rspec', 'meta.rspec.behaviour', 'string.quoted.double.interpolated.ruby', 'punctuation.definition.string.end.ruby']
      });
      expect(tokens[5]).toEqual({
        value: ' ',
        scopes: ['source.ruby.rspec', 'meta.rspec.behaviour']
      });
      expect(tokens[6]).toEqual({
        value: 'do',
        scopes: ['source.ruby.rspec', 'meta.rspec.behaviour', 'keyword.control.ruby.start-block']
      });
      tokens = grammar.tokenizeLine("describe 'some text' do").tokens;
      expect(tokens[0]).toEqual({
        value: 'describe',
        scopes: ['source.ruby.rspec', 'meta.rspec.behaviour', 'keyword.other.rspec.behaviour']
      });
      expect(tokens[1]).toEqual({
        value: ' ',
        scopes: ['source.ruby.rspec', 'meta.rspec.behaviour']
      });
      expect(tokens[2]).toEqual({
        value: "'",
        scopes: ['source.ruby.rspec', 'meta.rspec.behaviour', 'string.quoted.single.ruby', 'punctuation.definition.string.begin.ruby']
      });
      expect(tokens[3]).toEqual({
        value: 'some text',
        scopes: ['source.ruby.rspec', 'meta.rspec.behaviour', 'string.quoted.single.ruby']
      });
      expect(tokens[4]).toEqual({
        value: "'",
        scopes: ['source.ruby.rspec', 'meta.rspec.behaviour', 'string.quoted.single.ruby', 'punctuation.definition.string.end.ruby']
      });
      expect(tokens[5]).toEqual({
        value: ' ',
        scopes: ['source.ruby.rspec', 'meta.rspec.behaviour']
      });
      expect(tokens[6]).toEqual({
        value: 'do',
        scopes: ['source.ruby.rspec', 'meta.rspec.behaviour', 'keyword.control.ruby.start-block']
      });
      tokens = grammar.tokenizeLine("describe :some_text do").tokens;
      expect(tokens[0]).toEqual({
        value: 'describe',
        scopes: ['source.ruby.rspec', 'meta.rspec.behaviour', 'keyword.other.rspec.behaviour']
      });
      expect(tokens[1]).toEqual({
        value: ' ',
        scopes: ['source.ruby.rspec', 'meta.rspec.behaviour']
      });
      expect(tokens[2]).toEqual({
        value: ':',
        scopes: ['source.ruby.rspec', 'meta.rspec.behaviour', 'constant.other.symbol.ruby', 'punctuation.definition.constant.ruby']
      });
      expect(tokens[3]).toEqual({
        value: 'some_text',
        scopes: ['source.ruby.rspec', 'meta.rspec.behaviour', 'constant.other.symbol.ruby']
      });
      expect(tokens[4]).toEqual({
        value: ' ',
        scopes: ['source.ruby.rspec', 'meta.rspec.behaviour']
      });
      expect(tokens[5]).toEqual({
        value: 'do',
        scopes: ['source.ruby.rspec', 'meta.rspec.behaviour', 'keyword.control.ruby.start-block']
      });
      tokens = grammar.tokenizeLine('RSpec.describe PostController do').tokens;
      expect(tokens[0]).toEqual({
        value: 'RSpec',
        scopes: ['source.ruby.rspec', 'meta.rspec.behaviour', 'support.class.ruby']
      });
      expect(tokens[1]).toEqual({
        value: '.',
        scopes: ['source.ruby.rspec', 'meta.rspec.behaviour']
      });
      expect(tokens[2]).toEqual({
        value: 'describe',
        scopes: ['source.ruby.rspec', 'meta.rspec.behaviour', 'keyword.other.rspec.behaviour']
      });
      expect(tokens[3]).toEqual({
        value: ' PostController ',
        scopes: ['source.ruby.rspec', 'meta.rspec.behaviour']
      });
      expect(tokens[4]).toEqual({
        value: 'do',
        scopes: ['source.ruby.rspec', 'meta.rspec.behaviour', 'keyword.control.ruby.start-block']
      });
      tokens = grammar.tokenizeLine('describe = create(:describe)').tokens;
      expect(tokens[0]).toEqual({
        value: 'describe = create(:describe)',
        scopes: ['source.ruby.rspec']
      });
      tokens = grammar.tokenizeLine('describe=create(:describe)').tokens;
      return expect(tokens[0]).toEqual({
        value: 'describe=create(:describe)',
        scopes: ['source.ruby.rspec']
      });
    });
    it('tokenizes expect', function() {
      var tokens;
      tokens = grammar.tokenizeLine('expect(a).to eq b').tokens;
      expect(tokens[0]).toEqual({
        value: 'expect',
        scopes: ['source.ruby.rspec', 'keyword.other.example.rspec']
      });
      expect(tokens[1]).toEqual({
        value: '(a).to ',
        scopes: ['source.ruby.rspec']
      });
      expect(tokens[2]).toEqual({
        value: 'eq',
        scopes: ['source.ruby.rspec', 'keyword.other.matcher.rspec']
      });
      expect(tokens[3]).toEqual({
        value: ' b',
        scopes: ['source.ruby.rspec']
      });
      tokens = grammar.tokenizeLine('expect do').tokens;
      expect(tokens[0]).toEqual({
        value: 'expect',
        scopes: ['source.ruby.rspec', 'keyword.other.example.rspec']
      });
      expect(tokens[1]).toEqual({
        value: ' do',
        scopes: ['source.ruby.rspec']
      });
      tokens = grammar.tokenizeLine('expect = a == b').tokens;
      return expect(tokens[0]).toEqual({
        value: 'expect = a == b',
        scopes: ['source.ruby.rspec']
      });
    });
    return it('tokenizes keywords', function() {
      var keyword, keywordLists, list, results, scope, tokens;
      keywordLists = {
        'keyword.other.example.rspec': ['it', 'specify', 'example', 'scenario', 'pending', 'skip', 'xit', 'xspecify', 'xexample', 'expect', 'should_not', 'should'],
        'keyword.other.hook.rspec': ['before', 'after', 'around']
      };
      results = [];
      for (scope in keywordLists) {
        list = keywordLists[scope];
        results.push((function() {
          var i, len, results1;
          results1 = [];
          for (i = 0, len = list.length; i < len; i++) {
            keyword = list[i];
            tokens = grammar.tokenizeLine(keyword).tokens;
            expect(tokens[0].value).toEqual(keyword);
            results1.push(expect(tokens[0].scopes).toEqual(['source.ruby.rspec', scope]));
          }
          return results1;
        })());
      }
      return results;
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2xhbmd1YWdlLXJzcGVjL3NwZWMvZ3JhbW1hci1zcGVjLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBLFFBQUEsQ0FBUyxlQUFULEVBQTBCLFNBQUE7QUFDeEIsUUFBQTtJQUFBLE9BQUEsR0FBVTtJQUVWLFVBQUEsQ0FBVyxTQUFBO01BQ1QsZUFBQSxDQUFnQixTQUFBO2VBQ2QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLGdCQUE5QjtNQURjLENBQWhCO2FBR0EsSUFBQSxDQUFLLFNBQUE7ZUFDSCxPQUFBLEdBQVUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxtQkFBZCxDQUFrQyxtQkFBbEM7TUFEUCxDQUFMO0lBSlMsQ0FBWDtJQU9BLEVBQUEsQ0FBRyxvQkFBSCxFQUF5QixTQUFBO01BQ3ZCLE1BQUEsQ0FBTyxPQUFQLENBQWUsQ0FBQyxVQUFoQixDQUFBO2FBQ0EsTUFBQSxDQUFPLE9BQU8sQ0FBQyxTQUFmLENBQXlCLENBQUMsSUFBMUIsQ0FBK0IsbUJBQS9CO0lBRnVCLENBQXpCO0lBSUEsRUFBQSxDQUFHLG9CQUFILEVBQXlCLFNBQUE7QUFDdkIsVUFBQTtNQUFDLFNBQVUsT0FBTyxDQUFDLFlBQVIsQ0FBcUIsNEJBQXJCO01BQ1gsTUFBQSxDQUFPLE1BQU8sQ0FBQSxDQUFBLENBQWQsQ0FBaUIsQ0FBQyxPQUFsQixDQUEwQjtRQUFBLEtBQUEsRUFBTyxVQUFQO1FBQW1CLE1BQUEsRUFBUSxDQUFDLG1CQUFELEVBQXNCLHNCQUF0QixFQUE4QywrQkFBOUMsQ0FBM0I7T0FBMUI7TUFDQSxNQUFBLENBQU8sTUFBTyxDQUFBLENBQUEsQ0FBZCxDQUFpQixDQUFDLE9BQWxCLENBQTBCO1FBQUEsS0FBQSxFQUFPLGtCQUFQO1FBQTJCLE1BQUEsRUFBUSxDQUFDLG1CQUFELEVBQXNCLHNCQUF0QixDQUFuQztPQUExQjtNQUNBLE1BQUEsQ0FBTyxNQUFPLENBQUEsQ0FBQSxDQUFkLENBQWlCLENBQUMsT0FBbEIsQ0FBMEI7UUFBQSxLQUFBLEVBQU8sSUFBUDtRQUFhLE1BQUEsRUFBUSxDQUFDLG1CQUFELEVBQXNCLHNCQUF0QixFQUE4QyxrQ0FBOUMsQ0FBckI7T0FBMUI7TUFFQyxTQUFVLE9BQU8sQ0FBQyxZQUFSLENBQXFCLHlCQUFyQjtNQUNYLE1BQUEsQ0FBTyxNQUFPLENBQUEsQ0FBQSxDQUFkLENBQWlCLENBQUMsT0FBbEIsQ0FBMEI7UUFBQSxLQUFBLEVBQU8sVUFBUDtRQUFtQixNQUFBLEVBQVEsQ0FBQyxtQkFBRCxFQUFzQixzQkFBdEIsRUFBOEMsK0JBQTlDLENBQTNCO09BQTFCO01BQ0EsTUFBQSxDQUFPLE1BQU8sQ0FBQSxDQUFBLENBQWQsQ0FBaUIsQ0FBQyxPQUFsQixDQUEwQjtRQUFBLEtBQUEsRUFBTyxHQUFQO1FBQVksTUFBQSxFQUFRLENBQUMsbUJBQUQsRUFBc0Isc0JBQXRCLENBQXBCO09BQTFCO01BQ0EsTUFBQSxDQUFPLE1BQU8sQ0FBQSxDQUFBLENBQWQsQ0FBaUIsQ0FBQyxPQUFsQixDQUEwQjtRQUFBLEtBQUEsRUFBTyxHQUFQO1FBQVksTUFBQSxFQUFRLENBQUMsbUJBQUQsRUFBc0Isc0JBQXRCLEVBQThDLHdDQUE5QyxFQUF3RiwwQ0FBeEYsQ0FBcEI7T0FBMUI7TUFDQSxNQUFBLENBQU8sTUFBTyxDQUFBLENBQUEsQ0FBZCxDQUFpQixDQUFDLE9BQWxCLENBQTBCO1FBQUEsS0FBQSxFQUFPLFdBQVA7UUFBb0IsTUFBQSxFQUFRLENBQUMsbUJBQUQsRUFBc0Isc0JBQXRCLEVBQThDLHdDQUE5QyxDQUE1QjtPQUExQjtNQUNBLE1BQUEsQ0FBTyxNQUFPLENBQUEsQ0FBQSxDQUFkLENBQWlCLENBQUMsT0FBbEIsQ0FBMEI7UUFBQSxLQUFBLEVBQU8sR0FBUDtRQUFZLE1BQUEsRUFBUSxDQUFDLG1CQUFELEVBQXNCLHNCQUF0QixFQUE4Qyx3Q0FBOUMsRUFBd0Ysd0NBQXhGLENBQXBCO09BQTFCO01BQ0EsTUFBQSxDQUFPLE1BQU8sQ0FBQSxDQUFBLENBQWQsQ0FBaUIsQ0FBQyxPQUFsQixDQUEwQjtRQUFBLEtBQUEsRUFBTyxHQUFQO1FBQVksTUFBQSxFQUFRLENBQUMsbUJBQUQsRUFBc0Isc0JBQXRCLENBQXBCO09BQTFCO01BQ0EsTUFBQSxDQUFPLE1BQU8sQ0FBQSxDQUFBLENBQWQsQ0FBaUIsQ0FBQyxPQUFsQixDQUEwQjtRQUFBLEtBQUEsRUFBTyxJQUFQO1FBQWEsTUFBQSxFQUFRLENBQUMsbUJBQUQsRUFBc0Isc0JBQXRCLEVBQThDLGtDQUE5QyxDQUFyQjtPQUExQjtNQUVDLFNBQVUsT0FBTyxDQUFDLFlBQVIsQ0FBcUIseUJBQXJCO01BQ1gsTUFBQSxDQUFPLE1BQU8sQ0FBQSxDQUFBLENBQWQsQ0FBaUIsQ0FBQyxPQUFsQixDQUEwQjtRQUFBLEtBQUEsRUFBTyxVQUFQO1FBQW1CLE1BQUEsRUFBUSxDQUFDLG1CQUFELEVBQXNCLHNCQUF0QixFQUE4QywrQkFBOUMsQ0FBM0I7T0FBMUI7TUFDQSxNQUFBLENBQU8sTUFBTyxDQUFBLENBQUEsQ0FBZCxDQUFpQixDQUFDLE9BQWxCLENBQTBCO1FBQUEsS0FBQSxFQUFPLEdBQVA7UUFBWSxNQUFBLEVBQVEsQ0FBQyxtQkFBRCxFQUFzQixzQkFBdEIsQ0FBcEI7T0FBMUI7TUFDQSxNQUFBLENBQU8sTUFBTyxDQUFBLENBQUEsQ0FBZCxDQUFpQixDQUFDLE9BQWxCLENBQTBCO1FBQUEsS0FBQSxFQUFPLEdBQVA7UUFBWSxNQUFBLEVBQVEsQ0FBQyxtQkFBRCxFQUFzQixzQkFBdEIsRUFBOEMsMkJBQTlDLEVBQTJFLDBDQUEzRSxDQUFwQjtPQUExQjtNQUNBLE1BQUEsQ0FBTyxNQUFPLENBQUEsQ0FBQSxDQUFkLENBQWlCLENBQUMsT0FBbEIsQ0FBMEI7UUFBQSxLQUFBLEVBQU8sV0FBUDtRQUFvQixNQUFBLEVBQVEsQ0FBQyxtQkFBRCxFQUFzQixzQkFBdEIsRUFBOEMsMkJBQTlDLENBQTVCO09BQTFCO01BQ0EsTUFBQSxDQUFPLE1BQU8sQ0FBQSxDQUFBLENBQWQsQ0FBaUIsQ0FBQyxPQUFsQixDQUEwQjtRQUFBLEtBQUEsRUFBTyxHQUFQO1FBQVksTUFBQSxFQUFRLENBQUMsbUJBQUQsRUFBc0Isc0JBQXRCLEVBQThDLDJCQUE5QyxFQUEyRSx3Q0FBM0UsQ0FBcEI7T0FBMUI7TUFDQSxNQUFBLENBQU8sTUFBTyxDQUFBLENBQUEsQ0FBZCxDQUFpQixDQUFDLE9BQWxCLENBQTBCO1FBQUEsS0FBQSxFQUFPLEdBQVA7UUFBWSxNQUFBLEVBQVEsQ0FBQyxtQkFBRCxFQUFzQixzQkFBdEIsQ0FBcEI7T0FBMUI7TUFDQSxNQUFBLENBQU8sTUFBTyxDQUFBLENBQUEsQ0FBZCxDQUFpQixDQUFDLE9BQWxCLENBQTBCO1FBQUEsS0FBQSxFQUFPLElBQVA7UUFBYSxNQUFBLEVBQVEsQ0FBQyxtQkFBRCxFQUFzQixzQkFBdEIsRUFBOEMsa0NBQTlDLENBQXJCO09BQTFCO01BRUMsU0FBVSxPQUFPLENBQUMsWUFBUixDQUFxQix3QkFBckI7TUFDWCxNQUFBLENBQU8sTUFBTyxDQUFBLENBQUEsQ0FBZCxDQUFpQixDQUFDLE9BQWxCLENBQTBCO1FBQUEsS0FBQSxFQUFPLFVBQVA7UUFBbUIsTUFBQSxFQUFRLENBQUMsbUJBQUQsRUFBc0Isc0JBQXRCLEVBQThDLCtCQUE5QyxDQUEzQjtPQUExQjtNQUNBLE1BQUEsQ0FBTyxNQUFPLENBQUEsQ0FBQSxDQUFkLENBQWlCLENBQUMsT0FBbEIsQ0FBMEI7UUFBQSxLQUFBLEVBQU8sR0FBUDtRQUFZLE1BQUEsRUFBUSxDQUFDLG1CQUFELEVBQXNCLHNCQUF0QixDQUFwQjtPQUExQjtNQUNBLE1BQUEsQ0FBTyxNQUFPLENBQUEsQ0FBQSxDQUFkLENBQWlCLENBQUMsT0FBbEIsQ0FBMEI7UUFBQSxLQUFBLEVBQU8sR0FBUDtRQUFZLE1BQUEsRUFBUSxDQUFDLG1CQUFELEVBQXNCLHNCQUF0QixFQUE4Qyw0QkFBOUMsRUFBNEUsc0NBQTVFLENBQXBCO09BQTFCO01BQ0EsTUFBQSxDQUFPLE1BQU8sQ0FBQSxDQUFBLENBQWQsQ0FBaUIsQ0FBQyxPQUFsQixDQUEwQjtRQUFBLEtBQUEsRUFBTyxXQUFQO1FBQW9CLE1BQUEsRUFBUSxDQUFDLG1CQUFELEVBQXNCLHNCQUF0QixFQUE4Qyw0QkFBOUMsQ0FBNUI7T0FBMUI7TUFDQSxNQUFBLENBQU8sTUFBTyxDQUFBLENBQUEsQ0FBZCxDQUFpQixDQUFDLE9BQWxCLENBQTBCO1FBQUEsS0FBQSxFQUFPLEdBQVA7UUFBWSxNQUFBLEVBQVEsQ0FBQyxtQkFBRCxFQUFzQixzQkFBdEIsQ0FBcEI7T0FBMUI7TUFDQSxNQUFBLENBQU8sTUFBTyxDQUFBLENBQUEsQ0FBZCxDQUFpQixDQUFDLE9BQWxCLENBQTBCO1FBQUEsS0FBQSxFQUFPLElBQVA7UUFBYSxNQUFBLEVBQVEsQ0FBQyxtQkFBRCxFQUFzQixzQkFBdEIsRUFBOEMsa0NBQTlDLENBQXJCO09BQTFCO01BRUMsU0FBVSxPQUFPLENBQUMsWUFBUixDQUFxQixrQ0FBckI7TUFDWCxNQUFBLENBQU8sTUFBTyxDQUFBLENBQUEsQ0FBZCxDQUFpQixDQUFDLE9BQWxCLENBQTBCO1FBQUEsS0FBQSxFQUFPLE9BQVA7UUFBZ0IsTUFBQSxFQUFRLENBQUMsbUJBQUQsRUFBc0Isc0JBQXRCLEVBQThDLG9CQUE5QyxDQUF4QjtPQUExQjtNQUNBLE1BQUEsQ0FBTyxNQUFPLENBQUEsQ0FBQSxDQUFkLENBQWlCLENBQUMsT0FBbEIsQ0FBMEI7UUFBQSxLQUFBLEVBQU8sR0FBUDtRQUFZLE1BQUEsRUFBUSxDQUFDLG1CQUFELEVBQXNCLHNCQUF0QixDQUFwQjtPQUExQjtNQUNBLE1BQUEsQ0FBTyxNQUFPLENBQUEsQ0FBQSxDQUFkLENBQWlCLENBQUMsT0FBbEIsQ0FBMEI7UUFBQSxLQUFBLEVBQU8sVUFBUDtRQUFtQixNQUFBLEVBQVEsQ0FBQyxtQkFBRCxFQUFzQixzQkFBdEIsRUFBOEMsK0JBQTlDLENBQTNCO09BQTFCO01BQ0EsTUFBQSxDQUFPLE1BQU8sQ0FBQSxDQUFBLENBQWQsQ0FBaUIsQ0FBQyxPQUFsQixDQUEwQjtRQUFBLEtBQUEsRUFBTyxrQkFBUDtRQUEyQixNQUFBLEVBQVEsQ0FBQyxtQkFBRCxFQUFzQixzQkFBdEIsQ0FBbkM7T0FBMUI7TUFDQSxNQUFBLENBQU8sTUFBTyxDQUFBLENBQUEsQ0FBZCxDQUFpQixDQUFDLE9BQWxCLENBQTBCO1FBQUEsS0FBQSxFQUFPLElBQVA7UUFBYSxNQUFBLEVBQVEsQ0FBQyxtQkFBRCxFQUFzQixzQkFBdEIsRUFBOEMsa0NBQTlDLENBQXJCO09BQTFCO01BRUMsU0FBVSxPQUFPLENBQUMsWUFBUixDQUFxQiw4QkFBckI7TUFDWCxNQUFBLENBQU8sTUFBTyxDQUFBLENBQUEsQ0FBZCxDQUFpQixDQUFDLE9BQWxCLENBQTBCO1FBQUEsS0FBQSxFQUFPLDhCQUFQO1FBQXVDLE1BQUEsRUFBUSxDQUFDLG1CQUFELENBQS9DO09BQTFCO01BRUMsU0FBVSxPQUFPLENBQUMsWUFBUixDQUFxQiw0QkFBckI7YUFDWCxNQUFBLENBQU8sTUFBTyxDQUFBLENBQUEsQ0FBZCxDQUFpQixDQUFDLE9BQWxCLENBQTBCO1FBQUEsS0FBQSxFQUFPLDRCQUFQO1FBQXFDLE1BQUEsRUFBUSxDQUFDLG1CQUFELENBQTdDO09BQTFCO0lBM0N1QixDQUF6QjtJQTZDQSxFQUFBLENBQUcsa0JBQUgsRUFBdUIsU0FBQTtBQUNyQixVQUFBO01BQUMsU0FBVSxPQUFPLENBQUMsWUFBUixDQUFxQixtQkFBckI7TUFDWCxNQUFBLENBQU8sTUFBTyxDQUFBLENBQUEsQ0FBZCxDQUFpQixDQUFDLE9BQWxCLENBQTBCO1FBQUEsS0FBQSxFQUFPLFFBQVA7UUFBaUIsTUFBQSxFQUFRLENBQUMsbUJBQUQsRUFBc0IsNkJBQXRCLENBQXpCO09BQTFCO01BQ0EsTUFBQSxDQUFPLE1BQU8sQ0FBQSxDQUFBLENBQWQsQ0FBaUIsQ0FBQyxPQUFsQixDQUEwQjtRQUFBLEtBQUEsRUFBTyxTQUFQO1FBQWtCLE1BQUEsRUFBUSxDQUFDLG1CQUFELENBQTFCO09BQTFCO01BQ0EsTUFBQSxDQUFPLE1BQU8sQ0FBQSxDQUFBLENBQWQsQ0FBaUIsQ0FBQyxPQUFsQixDQUEwQjtRQUFBLEtBQUEsRUFBTyxJQUFQO1FBQWEsTUFBQSxFQUFRLENBQUMsbUJBQUQsRUFBc0IsNkJBQXRCLENBQXJCO09BQTFCO01BQ0EsTUFBQSxDQUFPLE1BQU8sQ0FBQSxDQUFBLENBQWQsQ0FBaUIsQ0FBQyxPQUFsQixDQUEwQjtRQUFBLEtBQUEsRUFBTyxJQUFQO1FBQWEsTUFBQSxFQUFRLENBQUMsbUJBQUQsQ0FBckI7T0FBMUI7TUFFQyxTQUFVLE9BQU8sQ0FBQyxZQUFSLENBQXFCLFdBQXJCO01BQ1gsTUFBQSxDQUFPLE1BQU8sQ0FBQSxDQUFBLENBQWQsQ0FBaUIsQ0FBQyxPQUFsQixDQUEwQjtRQUFBLEtBQUEsRUFBTyxRQUFQO1FBQWlCLE1BQUEsRUFBUSxDQUFDLG1CQUFELEVBQXNCLDZCQUF0QixDQUF6QjtPQUExQjtNQUNBLE1BQUEsQ0FBTyxNQUFPLENBQUEsQ0FBQSxDQUFkLENBQWlCLENBQUMsT0FBbEIsQ0FBMEI7UUFBQSxLQUFBLEVBQU8sS0FBUDtRQUFjLE1BQUEsRUFBUSxDQUFDLG1CQUFELENBQXRCO09BQTFCO01BRUMsU0FBVSxPQUFPLENBQUMsWUFBUixDQUFxQixpQkFBckI7YUFDWCxNQUFBLENBQU8sTUFBTyxDQUFBLENBQUEsQ0FBZCxDQUFpQixDQUFDLE9BQWxCLENBQTBCO1FBQUEsS0FBQSxFQUFPLGlCQUFQO1FBQTBCLE1BQUEsRUFBUSxDQUFDLG1CQUFELENBQWxDO09BQTFCO0lBWnFCLENBQXZCO1dBY0EsRUFBQSxDQUFHLG9CQUFILEVBQXlCLFNBQUE7QUFDdkIsVUFBQTtNQUFBLFlBQUEsR0FDRTtRQUFBLDZCQUFBLEVBQStCLENBQUMsSUFBRCxFQUFPLFNBQVAsRUFBa0IsU0FBbEIsRUFBNkIsVUFBN0IsRUFBeUMsU0FBekMsRUFBb0QsTUFBcEQsRUFBNEQsS0FBNUQsRUFBbUUsVUFBbkUsRUFBK0UsVUFBL0UsRUFBMkYsUUFBM0YsRUFBcUcsWUFBckcsRUFBbUgsUUFBbkgsQ0FBL0I7UUFDQSwwQkFBQSxFQUE0QixDQUFDLFFBQUQsRUFBVyxPQUFYLEVBQW9CLFFBQXBCLENBRDVCOztBQUdGO1dBQUEscUJBQUE7Ozs7QUFDRTtlQUFBLHNDQUFBOztZQUNHLFNBQVUsT0FBTyxDQUFDLFlBQVIsQ0FBcUIsT0FBckI7WUFDWCxNQUFBLENBQU8sTUFBTyxDQUFBLENBQUEsQ0FBRSxDQUFDLEtBQWpCLENBQXVCLENBQUMsT0FBeEIsQ0FBZ0MsT0FBaEM7MEJBQ0EsTUFBQSxDQUFPLE1BQU8sQ0FBQSxDQUFBLENBQUUsQ0FBQyxNQUFqQixDQUF3QixDQUFDLE9BQXpCLENBQWlDLENBQUMsbUJBQUQsRUFBc0IsS0FBdEIsQ0FBakM7QUFIRjs7O0FBREY7O0lBTHVCLENBQXpCO0VBekV3QixDQUExQjtBQUFBIiwic291cmNlc0NvbnRlbnQiOlsiZGVzY3JpYmUgJ3JzcGVjIGdyYW1tYXInLCAtPlxuICBncmFtbWFyID0gbnVsbFxuXG4gIGJlZm9yZUVhY2ggLT5cbiAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgIGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdsYW5ndWFnZS1yc3BlYycpXG5cbiAgICBydW5zIC0+XG4gICAgICBncmFtbWFyID0gYXRvbS5ncmFtbWFycy5ncmFtbWFyRm9yU2NvcGVOYW1lKCdzb3VyY2UucnVieS5yc3BlYycpXG5cbiAgaXQgJ3BhcnNlcyB0aGUgZ3JhbW1hcicsIC0+XG4gICAgZXhwZWN0KGdyYW1tYXIpLnRvQmVUcnV0aHkoKVxuICAgIGV4cGVjdChncmFtbWFyLnNjb3BlTmFtZSkudG9CZSAnc291cmNlLnJ1YnkucnNwZWMnXG5cbiAgaXQgJ3Rva2VuaXplcyBkZXNjcmliZScsIC0+XG4gICAge3Rva2Vuc30gPSBncmFtbWFyLnRva2VuaXplTGluZSgnZGVzY3JpYmUgUG9zdENvbnRyb2xsZXIgZG8nKVxuICAgIGV4cGVjdCh0b2tlbnNbMF0pLnRvRXF1YWwgdmFsdWU6ICdkZXNjcmliZScsIHNjb3BlczogWydzb3VyY2UucnVieS5yc3BlYycsICdtZXRhLnJzcGVjLmJlaGF2aW91cicsICdrZXl3b3JkLm90aGVyLnJzcGVjLmJlaGF2aW91ciddXG4gICAgZXhwZWN0KHRva2Vuc1sxXSkudG9FcXVhbCB2YWx1ZTogJyBQb3N0Q29udHJvbGxlciAnLCBzY29wZXM6IFsnc291cmNlLnJ1YnkucnNwZWMnLCAnbWV0YS5yc3BlYy5iZWhhdmlvdXInXVxuICAgIGV4cGVjdCh0b2tlbnNbMl0pLnRvRXF1YWwgdmFsdWU6ICdkbycsIHNjb3BlczogWydzb3VyY2UucnVieS5yc3BlYycsICdtZXRhLnJzcGVjLmJlaGF2aW91cicsICdrZXl3b3JkLmNvbnRyb2wucnVieS5zdGFydC1ibG9jayddXG5cbiAgICB7dG9rZW5zfSA9IGdyYW1tYXIudG9rZW5pemVMaW5lKCdkZXNjcmliZSBcInNvbWUgdGV4dFwiIGRvJylcbiAgICBleHBlY3QodG9rZW5zWzBdKS50b0VxdWFsIHZhbHVlOiAnZGVzY3JpYmUnLCBzY29wZXM6IFsnc291cmNlLnJ1YnkucnNwZWMnLCAnbWV0YS5yc3BlYy5iZWhhdmlvdXInLCAna2V5d29yZC5vdGhlci5yc3BlYy5iZWhhdmlvdXInXVxuICAgIGV4cGVjdCh0b2tlbnNbMV0pLnRvRXF1YWwgdmFsdWU6ICcgJywgc2NvcGVzOiBbJ3NvdXJjZS5ydWJ5LnJzcGVjJywgJ21ldGEucnNwZWMuYmVoYXZpb3VyJ11cbiAgICBleHBlY3QodG9rZW5zWzJdKS50b0VxdWFsIHZhbHVlOiAnXCInLCBzY29wZXM6IFsnc291cmNlLnJ1YnkucnNwZWMnLCAnbWV0YS5yc3BlYy5iZWhhdmlvdXInLCAnc3RyaW5nLnF1b3RlZC5kb3VibGUuaW50ZXJwb2xhdGVkLnJ1YnknLCAncHVuY3R1YXRpb24uZGVmaW5pdGlvbi5zdHJpbmcuYmVnaW4ucnVieSddXG4gICAgZXhwZWN0KHRva2Vuc1szXSkudG9FcXVhbCB2YWx1ZTogJ3NvbWUgdGV4dCcsIHNjb3BlczogWydzb3VyY2UucnVieS5yc3BlYycsICdtZXRhLnJzcGVjLmJlaGF2aW91cicsICdzdHJpbmcucXVvdGVkLmRvdWJsZS5pbnRlcnBvbGF0ZWQucnVieSddXG4gICAgZXhwZWN0KHRva2Vuc1s0XSkudG9FcXVhbCB2YWx1ZTogJ1wiJywgc2NvcGVzOiBbJ3NvdXJjZS5ydWJ5LnJzcGVjJywgJ21ldGEucnNwZWMuYmVoYXZpb3VyJywgJ3N0cmluZy5xdW90ZWQuZG91YmxlLmludGVycG9sYXRlZC5ydWJ5JywgJ3B1bmN0dWF0aW9uLmRlZmluaXRpb24uc3RyaW5nLmVuZC5ydWJ5J11cbiAgICBleHBlY3QodG9rZW5zWzVdKS50b0VxdWFsIHZhbHVlOiAnICcsIHNjb3BlczogWydzb3VyY2UucnVieS5yc3BlYycsICdtZXRhLnJzcGVjLmJlaGF2aW91ciddXG4gICAgZXhwZWN0KHRva2Vuc1s2XSkudG9FcXVhbCB2YWx1ZTogJ2RvJywgc2NvcGVzOiBbJ3NvdXJjZS5ydWJ5LnJzcGVjJywgJ21ldGEucnNwZWMuYmVoYXZpb3VyJywgJ2tleXdvcmQuY29udHJvbC5ydWJ5LnN0YXJ0LWJsb2NrJ11cblxuICAgIHt0b2tlbnN9ID0gZ3JhbW1hci50b2tlbml6ZUxpbmUoXCJkZXNjcmliZSAnc29tZSB0ZXh0JyBkb1wiKVxuICAgIGV4cGVjdCh0b2tlbnNbMF0pLnRvRXF1YWwgdmFsdWU6ICdkZXNjcmliZScsIHNjb3BlczogWydzb3VyY2UucnVieS5yc3BlYycsICdtZXRhLnJzcGVjLmJlaGF2aW91cicsICdrZXl3b3JkLm90aGVyLnJzcGVjLmJlaGF2aW91ciddXG4gICAgZXhwZWN0KHRva2Vuc1sxXSkudG9FcXVhbCB2YWx1ZTogJyAnLCBzY29wZXM6IFsnc291cmNlLnJ1YnkucnNwZWMnLCAnbWV0YS5yc3BlYy5iZWhhdmlvdXInXVxuICAgIGV4cGVjdCh0b2tlbnNbMl0pLnRvRXF1YWwgdmFsdWU6IFwiJ1wiLCBzY29wZXM6IFsnc291cmNlLnJ1YnkucnNwZWMnLCAnbWV0YS5yc3BlYy5iZWhhdmlvdXInLCAnc3RyaW5nLnF1b3RlZC5zaW5nbGUucnVieScsICdwdW5jdHVhdGlvbi5kZWZpbml0aW9uLnN0cmluZy5iZWdpbi5ydWJ5J11cbiAgICBleHBlY3QodG9rZW5zWzNdKS50b0VxdWFsIHZhbHVlOiAnc29tZSB0ZXh0Jywgc2NvcGVzOiBbJ3NvdXJjZS5ydWJ5LnJzcGVjJywgJ21ldGEucnNwZWMuYmVoYXZpb3VyJywgJ3N0cmluZy5xdW90ZWQuc2luZ2xlLnJ1YnknXVxuICAgIGV4cGVjdCh0b2tlbnNbNF0pLnRvRXF1YWwgdmFsdWU6IFwiJ1wiLCBzY29wZXM6IFsnc291cmNlLnJ1YnkucnNwZWMnLCAnbWV0YS5yc3BlYy5iZWhhdmlvdXInLCAnc3RyaW5nLnF1b3RlZC5zaW5nbGUucnVieScsICdwdW5jdHVhdGlvbi5kZWZpbml0aW9uLnN0cmluZy5lbmQucnVieSddXG4gICAgZXhwZWN0KHRva2Vuc1s1XSkudG9FcXVhbCB2YWx1ZTogJyAnLCBzY29wZXM6IFsnc291cmNlLnJ1YnkucnNwZWMnLCAnbWV0YS5yc3BlYy5iZWhhdmlvdXInXVxuICAgIGV4cGVjdCh0b2tlbnNbNl0pLnRvRXF1YWwgdmFsdWU6ICdkbycsIHNjb3BlczogWydzb3VyY2UucnVieS5yc3BlYycsICdtZXRhLnJzcGVjLmJlaGF2aW91cicsICdrZXl3b3JkLmNvbnRyb2wucnVieS5zdGFydC1ibG9jayddXG5cbiAgICB7dG9rZW5zfSA9IGdyYW1tYXIudG9rZW5pemVMaW5lKFwiZGVzY3JpYmUgOnNvbWVfdGV4dCBkb1wiKVxuICAgIGV4cGVjdCh0b2tlbnNbMF0pLnRvRXF1YWwgdmFsdWU6ICdkZXNjcmliZScsIHNjb3BlczogWydzb3VyY2UucnVieS5yc3BlYycsICdtZXRhLnJzcGVjLmJlaGF2aW91cicsICdrZXl3b3JkLm90aGVyLnJzcGVjLmJlaGF2aW91ciddXG4gICAgZXhwZWN0KHRva2Vuc1sxXSkudG9FcXVhbCB2YWx1ZTogJyAnLCBzY29wZXM6IFsnc291cmNlLnJ1YnkucnNwZWMnLCAnbWV0YS5yc3BlYy5iZWhhdmlvdXInXVxuICAgIGV4cGVjdCh0b2tlbnNbMl0pLnRvRXF1YWwgdmFsdWU6ICc6Jywgc2NvcGVzOiBbJ3NvdXJjZS5ydWJ5LnJzcGVjJywgJ21ldGEucnNwZWMuYmVoYXZpb3VyJywgJ2NvbnN0YW50Lm90aGVyLnN5bWJvbC5ydWJ5JywgJ3B1bmN0dWF0aW9uLmRlZmluaXRpb24uY29uc3RhbnQucnVieSddXG4gICAgZXhwZWN0KHRva2Vuc1szXSkudG9FcXVhbCB2YWx1ZTogJ3NvbWVfdGV4dCcsIHNjb3BlczogWydzb3VyY2UucnVieS5yc3BlYycsICdtZXRhLnJzcGVjLmJlaGF2aW91cicsICdjb25zdGFudC5vdGhlci5zeW1ib2wucnVieSddXG4gICAgZXhwZWN0KHRva2Vuc1s0XSkudG9FcXVhbCB2YWx1ZTogJyAnLCBzY29wZXM6IFsnc291cmNlLnJ1YnkucnNwZWMnLCAnbWV0YS5yc3BlYy5iZWhhdmlvdXInXVxuICAgIGV4cGVjdCh0b2tlbnNbNV0pLnRvRXF1YWwgdmFsdWU6ICdkbycsIHNjb3BlczogWydzb3VyY2UucnVieS5yc3BlYycsICdtZXRhLnJzcGVjLmJlaGF2aW91cicsICdrZXl3b3JkLmNvbnRyb2wucnVieS5zdGFydC1ibG9jayddXG5cbiAgICB7dG9rZW5zfSA9IGdyYW1tYXIudG9rZW5pemVMaW5lKCdSU3BlYy5kZXNjcmliZSBQb3N0Q29udHJvbGxlciBkbycpXG4gICAgZXhwZWN0KHRva2Vuc1swXSkudG9FcXVhbCB2YWx1ZTogJ1JTcGVjJywgc2NvcGVzOiBbJ3NvdXJjZS5ydWJ5LnJzcGVjJywgJ21ldGEucnNwZWMuYmVoYXZpb3VyJywgJ3N1cHBvcnQuY2xhc3MucnVieSddXG4gICAgZXhwZWN0KHRva2Vuc1sxXSkudG9FcXVhbCB2YWx1ZTogJy4nLCBzY29wZXM6IFsnc291cmNlLnJ1YnkucnNwZWMnLCAnbWV0YS5yc3BlYy5iZWhhdmlvdXInXVxuICAgIGV4cGVjdCh0b2tlbnNbMl0pLnRvRXF1YWwgdmFsdWU6ICdkZXNjcmliZScsIHNjb3BlczogWydzb3VyY2UucnVieS5yc3BlYycsICdtZXRhLnJzcGVjLmJlaGF2aW91cicsICdrZXl3b3JkLm90aGVyLnJzcGVjLmJlaGF2aW91ciddXG4gICAgZXhwZWN0KHRva2Vuc1szXSkudG9FcXVhbCB2YWx1ZTogJyBQb3N0Q29udHJvbGxlciAnLCBzY29wZXM6IFsnc291cmNlLnJ1YnkucnNwZWMnLCAnbWV0YS5yc3BlYy5iZWhhdmlvdXInXVxuICAgIGV4cGVjdCh0b2tlbnNbNF0pLnRvRXF1YWwgdmFsdWU6ICdkbycsIHNjb3BlczogWydzb3VyY2UucnVieS5yc3BlYycsICdtZXRhLnJzcGVjLmJlaGF2aW91cicsICdrZXl3b3JkLmNvbnRyb2wucnVieS5zdGFydC1ibG9jayddXG5cbiAgICB7dG9rZW5zfSA9IGdyYW1tYXIudG9rZW5pemVMaW5lKCdkZXNjcmliZSA9IGNyZWF0ZSg6ZGVzY3JpYmUpJylcbiAgICBleHBlY3QodG9rZW5zWzBdKS50b0VxdWFsIHZhbHVlOiAnZGVzY3JpYmUgPSBjcmVhdGUoOmRlc2NyaWJlKScsIHNjb3BlczogWydzb3VyY2UucnVieS5yc3BlYyddXG5cbiAgICB7dG9rZW5zfSA9IGdyYW1tYXIudG9rZW5pemVMaW5lKCdkZXNjcmliZT1jcmVhdGUoOmRlc2NyaWJlKScpXG4gICAgZXhwZWN0KHRva2Vuc1swXSkudG9FcXVhbCB2YWx1ZTogJ2Rlc2NyaWJlPWNyZWF0ZSg6ZGVzY3JpYmUpJywgc2NvcGVzOiBbJ3NvdXJjZS5ydWJ5LnJzcGVjJ11cblxuICBpdCAndG9rZW5pemVzIGV4cGVjdCcsIC0+XG4gICAge3Rva2Vuc30gPSBncmFtbWFyLnRva2VuaXplTGluZSgnZXhwZWN0KGEpLnRvIGVxIGInKVxuICAgIGV4cGVjdCh0b2tlbnNbMF0pLnRvRXF1YWwgdmFsdWU6ICdleHBlY3QnLCBzY29wZXM6IFsnc291cmNlLnJ1YnkucnNwZWMnLCAna2V5d29yZC5vdGhlci5leGFtcGxlLnJzcGVjJ11cbiAgICBleHBlY3QodG9rZW5zWzFdKS50b0VxdWFsIHZhbHVlOiAnKGEpLnRvICcsIHNjb3BlczogWydzb3VyY2UucnVieS5yc3BlYyddXG4gICAgZXhwZWN0KHRva2Vuc1syXSkudG9FcXVhbCB2YWx1ZTogJ2VxJywgc2NvcGVzOiBbJ3NvdXJjZS5ydWJ5LnJzcGVjJywgJ2tleXdvcmQub3RoZXIubWF0Y2hlci5yc3BlYyddXG4gICAgZXhwZWN0KHRva2Vuc1szXSkudG9FcXVhbCB2YWx1ZTogJyBiJywgc2NvcGVzOiBbJ3NvdXJjZS5ydWJ5LnJzcGVjJ11cblxuICAgIHt0b2tlbnN9ID0gZ3JhbW1hci50b2tlbml6ZUxpbmUoJ2V4cGVjdCBkbycpXG4gICAgZXhwZWN0KHRva2Vuc1swXSkudG9FcXVhbCB2YWx1ZTogJ2V4cGVjdCcsIHNjb3BlczogWydzb3VyY2UucnVieS5yc3BlYycsICdrZXl3b3JkLm90aGVyLmV4YW1wbGUucnNwZWMnXVxuICAgIGV4cGVjdCh0b2tlbnNbMV0pLnRvRXF1YWwgdmFsdWU6ICcgZG8nLCBzY29wZXM6IFsnc291cmNlLnJ1YnkucnNwZWMnXVxuXG4gICAge3Rva2Vuc30gPSBncmFtbWFyLnRva2VuaXplTGluZSgnZXhwZWN0ID0gYSA9PSBiJylcbiAgICBleHBlY3QodG9rZW5zWzBdKS50b0VxdWFsIHZhbHVlOiAnZXhwZWN0ID0gYSA9PSBiJywgc2NvcGVzOiBbJ3NvdXJjZS5ydWJ5LnJzcGVjJ11cblxuICBpdCAndG9rZW5pemVzIGtleXdvcmRzJywgLT5cbiAgICBrZXl3b3JkTGlzdHMgPVxuICAgICAgJ2tleXdvcmQub3RoZXIuZXhhbXBsZS5yc3BlYyc6IFsnaXQnLCAnc3BlY2lmeScsICdleGFtcGxlJywgJ3NjZW5hcmlvJywgJ3BlbmRpbmcnLCAnc2tpcCcsICd4aXQnLCAneHNwZWNpZnknLCAneGV4YW1wbGUnLCAnZXhwZWN0JywgJ3Nob3VsZF9ub3QnLCAnc2hvdWxkJ11cbiAgICAgICdrZXl3b3JkLm90aGVyLmhvb2sucnNwZWMnOiBbJ2JlZm9yZScsICdhZnRlcicsICdhcm91bmQnXVxuXG4gICAgZm9yIHNjb3BlLCBsaXN0IG9mIGtleXdvcmRMaXN0c1xuICAgICAgZm9yIGtleXdvcmQgaW4gbGlzdFxuICAgICAgICB7dG9rZW5zfSA9IGdyYW1tYXIudG9rZW5pemVMaW5lIGtleXdvcmRcbiAgICAgICAgZXhwZWN0KHRva2Vuc1swXS52YWx1ZSkudG9FcXVhbCBrZXl3b3JkXG4gICAgICAgIGV4cGVjdCh0b2tlbnNbMF0uc2NvcGVzKS50b0VxdWFsIFsnc291cmNlLnJ1YnkucnNwZWMnLCBzY29wZV1cbiJdfQ==
