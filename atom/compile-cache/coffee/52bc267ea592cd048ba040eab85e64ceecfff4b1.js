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
      return expect(tokens[4]).toEqual({
        value: 'do',
        scopes: ['source.ruby.rspec', 'meta.rspec.behaviour', 'keyword.control.ruby.start-block']
      });
    });
    return it('tokenizes keywords', function() {
      var keyword, keywordLists, list, scope, tokens, _results;
      keywordLists = {
        'keyword.other.example.rspec': ['it', 'specify', 'example', 'scenario', 'pending', 'skip', 'xit', 'xspecify', 'xexample'],
        'keyword.other.hook.rspec': ['before', 'after', 'around']
      };
      _results = [];
      for (scope in keywordLists) {
        list = keywordLists[scope];
        _results.push((function() {
          var _i, _len, _results1;
          _results1 = [];
          for (_i = 0, _len = list.length; _i < _len; _i++) {
            keyword = list[_i];
            tokens = grammar.tokenizeLine(keyword).tokens;
            expect(tokens[0].value).toEqual(keyword);
            _results1.push(expect(tokens[0].scopes).toEqual(['source.ruby.rspec', scope]));
          }
          return _results1;
        })());
      }
      return _results;
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2xhbmd1YWdlLXJzcGVjL3NwZWMvZ3JhbW1hci1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsRUFBQSxRQUFBLENBQVMsZUFBVCxFQUEwQixTQUFBLEdBQUE7QUFDeEIsUUFBQSxPQUFBO0FBQUEsSUFBQSxPQUFBLEdBQVUsSUFBVixDQUFBO0FBQUEsSUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsTUFBQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUNkLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixnQkFBOUIsRUFEYztNQUFBLENBQWhCLENBQUEsQ0FBQTthQUdBLElBQUEsQ0FBSyxTQUFBLEdBQUE7ZUFDSCxPQUFBLEdBQVUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxtQkFBZCxDQUFrQyxtQkFBbEMsRUFEUDtNQUFBLENBQUwsRUFKUztJQUFBLENBQVgsQ0FGQSxDQUFBO0FBQUEsSUFTQSxFQUFBLENBQUcsb0JBQUgsRUFBeUIsU0FBQSxHQUFBO0FBQ3ZCLE1BQUEsTUFBQSxDQUFPLE9BQVAsQ0FBZSxDQUFDLFVBQWhCLENBQUEsQ0FBQSxDQUFBO2FBQ0EsTUFBQSxDQUFPLE9BQU8sQ0FBQyxTQUFmLENBQXlCLENBQUMsSUFBMUIsQ0FBK0IsbUJBQS9CLEVBRnVCO0lBQUEsQ0FBekIsQ0FUQSxDQUFBO0FBQUEsSUFhQSxFQUFBLENBQUcsb0JBQUgsRUFBeUIsU0FBQSxHQUFBO0FBQ3ZCLFVBQUEsTUFBQTtBQUFBLE1BQUMsU0FBVSxPQUFPLENBQUMsWUFBUixDQUFxQiw0QkFBckIsRUFBVixNQUFELENBQUE7QUFBQSxNQUNBLE1BQUEsQ0FBTyxNQUFPLENBQUEsQ0FBQSxDQUFkLENBQWlCLENBQUMsT0FBbEIsQ0FBMEI7QUFBQSxRQUFBLEtBQUEsRUFBTyxV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

//# sourceURL=/Users/ah/.atom/packages/language-rspec/spec/grammar-spec.coffee
