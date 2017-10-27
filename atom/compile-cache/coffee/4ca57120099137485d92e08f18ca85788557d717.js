(function() {
  describe("Puppet grammar", function() {
    var grammar;
    grammar = null;
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.packages.activatePackage("language-puppet");
      });
      return runs(function() {
        return grammar = atom.grammars.grammarForScopeName("source.puppet");
      });
    });
    it("parses the grammar", function() {
      expect(grammar).toBeTruthy();
      return expect(grammar.scopeName).toBe("source.puppet");
    });
    describe("separators", function() {
      it("tokenizes attribute separator", function() {
        var tokens;
        tokens = grammar.tokenizeLine('ensure => present').tokens;
        return expect(tokens[1]).toEqual({
          value: '=>',
          scopes: ['source.puppet', 'punctuation.separator.key-value.puppet']
        });
      });
      return it("tokenizes attribute separator with string values", function() {
        var tokens;
        tokens = grammar.tokenizeLine('ensure => "present"').tokens;
        return expect(tokens[1]).toEqual({
          value: '=>',
          scopes: ['source.puppet', 'punctuation.separator.key-value.puppet']
        });
      });
    });
    return describe("blocks", function() {
      it("tokenizes single quoted node", function() {
        var tokens;
        tokens = grammar.tokenizeLine("node 'hostname' {").tokens;
        return expect(tokens[0]).toEqual({
          value: 'node',
          scopes: ['source.puppet', 'meta.definition.class.puppet', 'storage.type.puppet']
        });
      });
      it("tokenizes double quoted node", function() {
        var tokens;
        tokens = grammar.tokenizeLine('node "hostname" {').tokens;
        return expect(tokens[0]).toEqual({
          value: 'node',
          scopes: ['source.puppet', 'meta.definition.class.puppet', 'storage.type.puppet']
        });
      });
      it("tokenizes non-default class parameters", function() {
        var tokens;
        tokens = grammar.tokenizeLine('class "classname" ($myvar) {').tokens;
        expect(tokens[5]).toEqual({
          value: '$',
          scopes: ['source.puppet', 'meta.definition.class.puppet', 'meta.function.argument.no-default.untyped.puppet', 'variable.other.puppet', 'punctuation.definition.variable.puppet']
        });
        return expect(tokens[6]).toEqual({
          value: 'myvar',
          scopes: ['source.puppet', 'meta.definition.class.puppet', 'meta.function.argument.no-default.untyped.puppet', 'variable.other.puppet']
        });
      });
      it("tokenizes default class parameters", function() {
        var tokens;
        tokens = grammar.tokenizeLine('class "classname" ($myvar = "myval") {').tokens;
        expect(tokens[5]).toEqual({
          value: '$',
          scopes: ['source.puppet', 'meta.definition.class.puppet', 'meta.function.argument.default.untyped.puppet', 'variable.other.puppet', 'punctuation.definition.variable.puppet']
        });
        return expect(tokens[6]).toEqual({
          value: 'myvar',
          scopes: ['source.puppet', 'meta.definition.class.puppet', 'meta.function.argument.default.untyped.puppet', 'variable.other.puppet']
        });
      });
      it("tokenizes non-default class parameter types", function() {
        var tokens;
        tokens = grammar.tokenizeLine('class "classname" (String $myvar) {').tokens;
        return expect(tokens[5]).toEqual({
          value: 'String',
          scopes: ['source.puppet', 'meta.definition.class.puppet', 'meta.function.argument.no-default.typed.puppet', 'storage.type.puppet']
        });
      });
      it("tokenizes default class parameter types", function() {
        var tokens;
        tokens = grammar.tokenizeLine('class "classname" (String $myvar = "myval") {').tokens;
        return expect(tokens[5]).toEqual({
          value: 'String',
          scopes: ['source.puppet', 'meta.definition.class.puppet', 'meta.function.argument.default.typed.puppet', 'storage.type.puppet']
        });
      });
      it("tokenizes include as an include function", function() {
        var tokens;
        tokens = grammar.tokenizeLine("contain foo").tokens;
        return expect(tokens[0]).toEqual({
          value: 'contain',
          scopes: ['source.puppet', 'meta.include.puppet', 'keyword.control.import.include.puppet']
        });
      });
      it("tokenizes contain as an include function", function() {
        var tokens;
        tokens = grammar.tokenizeLine('include foo').tokens;
        return expect(tokens[0]).toEqual({
          value: 'include',
          scopes: ['source.puppet', 'meta.include.puppet', 'keyword.control.import.include.puppet']
        });
      });
      it("tokenizes resource type and string title", function() {
        var tokens;
        tokens = grammar.tokenizeLine("package {'foo':}").tokens;
        expect(tokens[0]).toEqual({
          value: 'package',
          scopes: ['source.puppet', 'meta.definition.resource.puppet', 'storage.type.puppet']
        });
        return expect(tokens[2]).toEqual({
          value: "'foo'",
          scopes: ['source.puppet', 'meta.definition.resource.puppet', 'entity.name.section.puppet']
        });
      });
      it("tokenizes resource type and variable title", function() {
        var tokens;
        tokens = grammar.tokenizeLine("package {$foo:}").tokens;
        expect(tokens[0]).toEqual({
          value: 'package',
          scopes: ['source.puppet', 'meta.definition.resource.puppet', 'storage.type.puppet']
        });
        return expect(tokens[2]).toEqual({
          value: '$foo',
          scopes: ['source.puppet', 'meta.definition.resource.puppet', 'entity.name.section.puppet']
        });
      });
      it("tokenizes require classname as an include", function() {
        var tokens;
        tokens = grammar.tokenizeLine("require ::foo").tokens;
        return expect(tokens[0]).toEqual({
          value: 'require',
          scopes: ['source.puppet', 'meta.include.puppet', 'keyword.control.import.include.puppet']
        });
      });
      it("tokenizes require => variable as a parameter", function() {
        var tokens;
        tokens = grammar.tokenizeLine("require => Class['foo']").tokens;
        return expect(tokens[0]).toEqual({
          value: 'require ',
          scopes: ['source.puppet', 'constant.other.key.puppet']
        });
      });
      it("tokenizes regular variables", function() {
        var tokens;
        tokens = grammar.tokenizeLine('$foo').tokens;
        expect(tokens[0]).toEqual({
          value: '$',
          scopes: ['source.puppet', 'variable.other.readwrite.global.puppet', 'punctuation.definition.variable.puppet']
        });
        expect(tokens[1]).toEqual({
          value: 'foo',
          scopes: ['source.puppet', 'variable.other.readwrite.global.puppet']
        });
        tokens = grammar.tokenizeLine('$_foo').tokens;
        expect(tokens[0]).toEqual({
          value: '$',
          scopes: ['source.puppet', 'variable.other.readwrite.global.puppet', 'punctuation.definition.variable.puppet']
        });
        expect(tokens[1]).toEqual({
          value: '_foo',
          scopes: ['source.puppet', 'variable.other.readwrite.global.puppet']
        });
        tokens = grammar.tokenizeLine('$_foo_').tokens;
        expect(tokens[0]).toEqual({
          value: '$',
          scopes: ['source.puppet', 'variable.other.readwrite.global.puppet', 'punctuation.definition.variable.puppet']
        });
        expect(tokens[1]).toEqual({
          value: '_foo_',
          scopes: ['source.puppet', 'variable.other.readwrite.global.puppet']
        });
        tokens = grammar.tokenizeLine('$::foo').tokens;
        expect(tokens[0]).toEqual({
          value: '$',
          scopes: ['source.puppet', 'variable.other.readwrite.global.puppet', 'punctuation.definition.variable.puppet']
        });
        return expect(tokens[1]).toEqual({
          value: '::foo',
          scopes: ['source.puppet', 'variable.other.readwrite.global.puppet']
        });
      });
      return it("tokenizes resource types correctly", function() {
        var tokens;
        tokens = grammar.tokenizeLine("file {'/var/tmp':}").tokens;
        expect(tokens[0]).toEqual({
          value: 'file',
          scopes: ['source.puppet', 'meta.definition.resource.puppet', 'storage.type.puppet']
        });
        tokens = grammar.tokenizeLine("package {'foo':}").tokens;
        return expect(tokens[0]).toEqual({
          value: 'package',
          scopes: ['source.puppet', 'meta.definition.resource.puppet', 'storage.type.puppet']
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2xhbmd1YWdlLXB1cHBldC9zcGVjL3B1cHBldC1zcGVjLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBLFFBQUEsQ0FBUyxnQkFBVCxFQUEyQixTQUFBO0FBQ3pCLFFBQUE7SUFBQSxPQUFBLEdBQVU7SUFFVixVQUFBLENBQVcsU0FBQTtNQUNULGVBQUEsQ0FBZ0IsU0FBQTtlQUNkLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixpQkFBOUI7TUFEYyxDQUFoQjthQUdBLElBQUEsQ0FBSyxTQUFBO2VBQ0gsT0FBQSxHQUFVLElBQUksQ0FBQyxRQUFRLENBQUMsbUJBQWQsQ0FBa0MsZUFBbEM7TUFEUCxDQUFMO0lBSlMsQ0FBWDtJQU9BLEVBQUEsQ0FBRyxvQkFBSCxFQUF5QixTQUFBO01BQ3ZCLE1BQUEsQ0FBTyxPQUFQLENBQWUsQ0FBQyxVQUFoQixDQUFBO2FBQ0EsTUFBQSxDQUFPLE9BQU8sQ0FBQyxTQUFmLENBQXlCLENBQUMsSUFBMUIsQ0FBK0IsZUFBL0I7SUFGdUIsQ0FBekI7SUFJQSxRQUFBLENBQVMsWUFBVCxFQUF1QixTQUFBO01BQ3JCLEVBQUEsQ0FBRywrQkFBSCxFQUFvQyxTQUFBO0FBQ2xDLFlBQUE7UUFBQyxTQUFVLE9BQU8sQ0FBQyxZQUFSLENBQXFCLG1CQUFyQjtlQUNYLE1BQUEsQ0FBTyxNQUFPLENBQUEsQ0FBQSxDQUFkLENBQWlCLENBQUMsT0FBbEIsQ0FBMEI7VUFBQSxLQUFBLEVBQU8sSUFBUDtVQUFhLE1BQUEsRUFBUSxDQUFDLGVBQUQsRUFBa0Isd0NBQWxCLENBQXJCO1NBQTFCO01BRmtDLENBQXBDO2FBSUEsRUFBQSxDQUFHLGtEQUFILEVBQXVELFNBQUE7QUFDckQsWUFBQTtRQUFDLFNBQVUsT0FBTyxDQUFDLFlBQVIsQ0FBcUIscUJBQXJCO2VBQ1gsTUFBQSxDQUFPLE1BQU8sQ0FBQSxDQUFB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LCAtPlxuICBncmFtbWFyID0gbnVsbFxuXG4gIGJlZm9yZUVhY2ggLT5cbiAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgIGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKFwibGFuZ3VhZ2UtcHVwcGV0XCIpXG5cbiAgICBydW5zIC0+XG4gICAgICBncmFtbWFyID0gYXRvbS5ncmFtbWFycy5ncmFtbWFyRm9yU2NvcGVOYW1lKFwic291cmNlLnB1cHBldFwiKVxuXG4gIGl0IFwicGFyc2VzIHRoZSBncmFtbWFyXCIsIC0+XG4gICAgZXhwZWN0KGdyYW1tYXIpLnRvQmVUcnV0aHkoKVxuICAgIGV4cGVjdChncmFtbWFyLnNjb3BlTmFtZSkudG9CZSBcInNvdXJjZS5wdXBwZXRcIlxuXG4gIGRlc2NyaWJlIFwic2VwYXJhdG9yc1wiLCAtPlxuICAgIGl0IFwidG9rZW5pemVzIGF0dHJpYnV0ZSBzZXBhcmF0b3JcIiwgLT5cbiAgICAgIHt0b2tlbnN9ID0gZ3JhbW1hci50b2tlbml6ZUxpbmUoJ2Vuc3VyZSA9PiBwcmVzZW50JylcbiAgICAgIGV4cGVjdCh0b2tlbnNbMV0pLnRvRXF1YWwgdmFsdWU6ICc9PicsIHNjb3BlczogWydzb3VyY2UucHVwcGV0JywgJ3B1bmN0dWF0aW9uLnNlcGFyYXRvci5rZXktdmFsdWUucHVwcGV0J11cblxuICAgIGl0IFwidG9rZW5pemVzIGF0dHJpYnV0ZSBzZXBhcmF0b3Igd2l0aCBzdHJpbmcgdmFsdWVzXCIsIC0+XG4gICAgICB7dG9rZW5zfSA9IGdyYW1tYXIudG9rZW5pemVMaW5lKCdlbnN1cmUgPT4gXCJwcmVzZW50XCInKVxuICAgICAgZXhwZWN0KHRva2Vuc1sxXSkudG9FcXVhbCB2YWx1ZTogJz0+Jywgc2NvcGVzOiBbJ3NvdXJjZS5wdXBwZXQnLCAncHVuY3R1YXRpb24uc2VwYXJhdG9yLmtleS12YWx1ZS5wdXBwZXQnXVxuXG4gIGRlc2NyaWJlIFwiYmxvY2tzXCIsIC0+XG4gICAgaXQgXCJ0b2tlbml6ZXMgc2luZ2xlIHF1b3RlZCBub2RlXCIsIC0+XG4gICAgICB7dG9rZW5zfSA9IGdyYW1tYXIudG9rZW5pemVMaW5lKFwibm9kZSAnaG9zdG5hbWUnIHtcIilcbiAgICAgIGV4cGVjdCh0b2tlbnNbMF0pLnRvRXF1YWwgdmFsdWU6ICdub2RlJywgc2NvcGVzOiBbJ3NvdXJjZS5wdXBwZXQnLCAnbWV0YS5kZWZpbml0aW9uLmNsYXNzLnB1cHBldCcsICdzdG9yYWdlLnR5cGUucHVwcGV0J11cblxuICAgIGl0IFwidG9rZW5pemVzIGRvdWJsZSBxdW90ZWQgbm9kZVwiLCAtPlxuICAgICAge3Rva2Vuc30gPSBncmFtbWFyLnRva2VuaXplTGluZSgnbm9kZSBcImhvc3RuYW1lXCIgeycpXG4gICAgICBleHBlY3QodG9rZW5zWzBdKS50b0VxdWFsIHZhbHVlOiAnbm9kZScsIHNjb3BlczogWydzb3VyY2UucHVwcGV0JywgJ21ldGEuZGVmaW5pdGlvbi5jbGFzcy5wdXBwZXQnLCAnc3RvcmFnZS50eXBlLnB1cHBldCddXG5cbiAgICBpdCBcInRva2VuaXplcyBub24tZGVmYXVsdCBjbGFzcyBwYXJhbWV0ZXJzXCIsIC0+XG4gICAgICB7dG9rZW5zfSA9IGdyYW1tYXIudG9rZW5pemVMaW5lKCdjbGFzcyBcImNsYXNzbmFtZVwiICgkbXl2YXIpIHsnKVxuICAgICAgZXhwZWN0KHRva2Vuc1s1XSkudG9FcXVhbCB2YWx1ZTogJyQnLCBzY29wZXM6IFsnc291cmNlLnB1cHBldCcsICdtZXRhLmRlZmluaXRpb24uY2xhc3MucHVwcGV0JywgJ21ldGEuZnVuY3Rpb24uYXJndW1lbnQubm8tZGVmYXVsdC51bnR5cGVkLnB1cHBldCcsICd2YXJpYWJsZS5vdGhlci5wdXBwZXQnLCAncHVuY3R1YXRpb24uZGVmaW5pdGlvbi52YXJpYWJsZS5wdXBwZXQnXVxuICAgICAgZXhwZWN0KHRva2Vuc1s2XSkudG9FcXVhbCB2YWx1ZTogJ215dmFyJywgc2NvcGVzOiBbJ3NvdXJjZS5wdXBwZXQnLCAnbWV0YS5kZWZpbml0aW9uLmNsYXNzLnB1cHBldCcsICdtZXRhLmZ1bmN0aW9uLmFyZ3VtZW50Lm5vLWRlZmF1bHQudW50eXBlZC5wdXBwZXQnLCAndmFyaWFibGUub3RoZXIucHVwcGV0J11cblxuICAgIGl0IFwidG9rZW5pemVzIGRlZmF1bHQgY2xhc3MgcGFyYW1ldGVyc1wiLCAtPlxuICAgICAge3Rva2Vuc30gPSBncmFtbWFyLnRva2VuaXplTGluZSgnY2xhc3MgXCJjbGFzc25hbWVcIiAoJG15dmFyID0gXCJteXZhbFwiKSB7JylcbiAgICAgIGV4cGVjdCh0b2tlbnNbNV0pLnRvRXF1YWwgdmFsdWU6ICckJywgc2NvcGVzOiBbJ3NvdXJjZS5wdXBwZXQnLCAnbWV0YS5kZWZpbml0aW9uLmNsYXNzLnB1cHBldCcsICdtZXRhLmZ1bmN0aW9uLmFyZ3VtZW50LmRlZmF1bHQudW50eXBlZC5wdXBwZXQnLCAndmFyaWFibGUub3RoZXIucHVwcGV0JywgJ3B1bmN0dWF0aW9uLmRlZmluaXRpb24udmFyaWFibGUucHVwcGV0J11cbiAgICAgIGV4cGVjdCh0b2tlbnNbNl0pLnRvRXF1YWwgdmFsdWU6ICdteXZhcicsIHNjb3BlczogWydzb3VyY2UucHVwcGV0JywgJ21ldGEuZGVmaW5pdGlvbi5jbGFzcy5wdXBwZXQnLCAnbWV0YS5mdW5jdGlvbi5hcmd1bWVudC5kZWZhdWx0LnVudHlwZWQucHVwcGV0JywgJ3ZhcmlhYmxlLm90aGVyLnB1cHBldCddXG5cbiAgICBpdCBcInRva2VuaXplcyBub24tZGVmYXVsdCBjbGFzcyBwYXJhbWV0ZXIgdHlwZXNcIiwgLT5cbiAgICAgIHt0b2tlbnN9ID0gZ3JhbW1hci50b2tlbml6ZUxpbmUoJ2NsYXNzIFwiY2xhc3NuYW1lXCIgKFN0cmluZyAkbXl2YXIpIHsnKVxuICAgICAgZXhwZWN0KHRva2Vuc1s1XSkudG9FcXVhbCB2YWx1ZTogJ1N0cmluZycsIHNjb3BlczogWydzb3VyY2UucHVwcGV0JywgJ21ldGEuZGVmaW5pdGlvbi5jbGFzcy5wdXBwZXQnLCAnbWV0YS5mdW5jdGlvbi5hcmd1bWVudC5uby1kZWZhdWx0LnR5cGVkLnB1cHBldCcsICdzdG9yYWdlLnR5cGUucHVwcGV0J11cblxuICAgIGl0IFwidG9rZW5pemVzIGRlZmF1bHQgY2xhc3MgcGFyYW1ldGVyIHR5cGVzXCIsIC0+XG4gICAgICB7dG9rZW5zfSA9IGdyYW1tYXIudG9rZW5pemVMaW5lKCdjbGFzcyBcImNsYXNzbmFtZVwiIChTdHJpbmcgJG15dmFyID0gXCJteXZhbFwiKSB7JylcbiAgICAgIGV4cGVjdCh0b2tlbnNbNV0pLnRvRXF1YWwgdmFsdWU6ICdTdHJpbmcnLCBzY29wZXM6IFsnc291cmNlLnB1cHBldCcsICdtZXRhLmRlZmluaXRpb24uY2xhc3MucHVwcGV0JywgJ21ldGEuZnVuY3Rpb24uYXJndW1lbnQuZGVmYXVsdC50eXBlZC5wdXBwZXQnLCAnc3RvcmFnZS50eXBlLnB1cHBldCddXG5cbiAgICBpdCBcInRva2VuaXplcyBpbmNsdWRlIGFzIGFuIGluY2x1ZGUgZnVuY3Rpb25cIiwgLT5cbiAgICAgIHt0b2tlbnN9ID0gZ3JhbW1hci50b2tlbml6ZUxpbmUoXCJjb250YWluIGZvb1wiKVxuICAgICAgZXhwZWN0KHRva2Vuc1swXSkudG9FcXVhbCB2YWx1ZTogJ2NvbnRhaW4nLCBzY29wZXM6IFsnc291cmNlLnB1cHBldCcsICdtZXRhLmluY2x1ZGUucHVwcGV0JywgJ2tleXdvcmQuY29udHJvbC5pbXBvcnQuaW5jbHVkZS5wdXBwZXQnXVxuXG4gICAgaXQgXCJ0b2tlbml6ZXMgY29udGFpbiBhcyBhbiBpbmNsdWRlIGZ1bmN0aW9uXCIsIC0+XG4gICAgICB7dG9rZW5zfSA9IGdyYW1tYXIudG9rZW5pemVMaW5lKCdpbmNsdWRlIGZvbycpXG4gICAgICBleHBlY3QodG9rZW5zWzBdKS50b0VxdWFsIHZhbHVlOiAnaW5jbHVkZScsIHNjb3BlczogWydzb3VyY2UucHVwcGV0JywgJ21ldGEuaW5jbHVkZS5wdXBwZXQnLCAna2V5d29yZC5jb250cm9sLmltcG9ydC5pbmNsdWRlLnB1cHBldCddXG5cbiAgICBpdCBcInRva2VuaXplcyByZXNvdXJjZSB0eXBlIGFuZCBzdHJpbmcgdGl0bGVcIiwgLT5cbiAgICAgIHt0b2tlbnN9ID0gZ3JhbW1hci50b2tlbml6ZUxpbmUoXCJwYWNrYWdlIHsnZm9vJzp9XCIpXG4gICAgICBleHBlY3QodG9rZW5zWzBdKS50b0VxdWFsIHZhbHVlOiAncGFja2FnZScsIHNjb3BlczogWydzb3VyY2UucHVwcGV0JywgJ21ldGEuZGVmaW5pdGlvbi5yZXNvdXJjZS5wdXBwZXQnLCAnc3RvcmFnZS50eXBlLnB1cHBldCddXG4gICAgICBleHBlY3QodG9rZW5zWzJdKS50b0VxdWFsIHZhbHVlOiBcIidmb28nXCIsIHNjb3BlczogWydzb3VyY2UucHVwcGV0JywgJ21ldGEuZGVmaW5pdGlvbi5yZXNvdXJjZS5wdXBwZXQnLCAnZW50aXR5Lm5hbWUuc2VjdGlvbi5wdXBwZXQnXVxuXG4gICAgaXQgXCJ0b2tlbml6ZXMgcmVzb3VyY2UgdHlwZSBhbmQgdmFyaWFibGUgdGl0bGVcIiwgLT5cbiAgICAgIHt0b2tlbnN9ID0gZ3JhbW1hci50b2tlbml6ZUxpbmUoXCJwYWNrYWdlIHskZm9vOn1cIilcbiAgICAgIGV4cGVjdCh0b2tlbnNbMF0pLnRvRXF1YWwgdmFsdWU6ICdwYWNrYWdlJywgc2NvcGVzOiBbJ3NvdXJjZS5wdXBwZXQnLCAnbWV0YS5kZWZpbml0aW9uLnJlc291cmNlLnB1cHBldCcsICdzdG9yYWdlLnR5cGUucHVwcGV0J11cbiAgICAgIGV4cGVjdCh0b2tlbnNbMl0pLnRvRXF1YWwgdmFsdWU6ICckZm9vJywgc2NvcGVzOiBbJ3NvdXJjZS5wdXBwZXQnLCAnbWV0YS5kZWZpbml0aW9uLnJlc291cmNlLnB1cHBldCcsICdlbnRpdHkubmFtZS5zZWN0aW9uLnB1cHBldCddXG5cbiAgICBpdCBcInRva2VuaXplcyByZXF1aXJlIGNsYXNzbmFtZSBhcyBhbiBpbmNsdWRlXCIsIC0+XG4gICAgICB7dG9rZW5zfSA9IGdyYW1tYXIudG9rZW5pemVMaW5lKFwicmVxdWlyZSA6OmZvb1wiKVxuICAgICAgZXhwZWN0KHRva2Vuc1swXSkudG9FcXVhbCB2YWx1ZTogJ3JlcXVpcmUnLCBzY29wZXM6IFsnc291cmNlLnB1cHBldCcsICdtZXRhLmluY2x1ZGUucHVwcGV0JywgJ2tleXdvcmQuY29udHJvbC5pbXBvcnQuaW5jbHVkZS5wdXBwZXQnXVxuXG4gICAgaXQgXCJ0b2tlbml6ZXMgcmVxdWlyZSA9PiB2YXJpYWJsZSBhcyBhIHBhcmFtZXRlclwiLCAtPlxuICAgICAge3Rva2Vuc30gPSBncmFtbWFyLnRva2VuaXplTGluZShcInJlcXVpcmUgPT4gQ2xhc3NbJ2ZvbyddXCIpXG4gICAgICBleHBlY3QodG9rZW5zWzBdKS50b0VxdWFsIHZhbHVlOiAncmVxdWlyZSAnLCBzY29wZXM6IFsnc291cmNlLnB1cHBldCcsICdjb25zdGFudC5vdGhlci5rZXkucHVwcGV0J11cblxuICAgIGl0IFwidG9rZW5pemVzIHJlZ3VsYXIgdmFyaWFibGVzXCIsIC0+XG4gICAgICB7dG9rZW5zfSA9IGdyYW1tYXIudG9rZW5pemVMaW5lKCckZm9vJylcbiAgICAgIGV4cGVjdCh0b2tlbnNbMF0pLnRvRXF1YWwgdmFsdWU6ICckJywgc2NvcGVzOiBbJ3NvdXJjZS5wdXBwZXQnLCAndmFyaWFibGUub3RoZXIucmVhZHdyaXRlLmdsb2JhbC5wdXBwZXQnLCAncHVuY3R1YXRpb24uZGVmaW5pdGlvbi52YXJpYWJsZS5wdXBwZXQnXVxuICAgICAgZXhwZWN0KHRva2Vuc1sxXSkudG9FcXVhbCB2YWx1ZTogJ2ZvbycsIHNjb3BlczogWydzb3VyY2UucHVwcGV0JywgJ3ZhcmlhYmxlLm90aGVyLnJlYWR3cml0ZS5nbG9iYWwucHVwcGV0J11cblxuICAgICAge3Rva2Vuc30gPSBncmFtbWFyLnRva2VuaXplTGluZSgnJF9mb28nKVxuICAgICAgZXhwZWN0KHRva2Vuc1swXSkudG9FcXVhbCB2YWx1ZTogJyQnLCBzY29wZXM6IFsnc291cmNlLnB1cHBldCcsICd2YXJpYWJsZS5vdGhlci5yZWFkd3JpdGUuZ2xvYmFsLnB1cHBldCcsICdwdW5jdHVhdGlvbi5kZWZpbml0aW9uLnZhcmlhYmxlLnB1cHBldCddXG4gICAgICBleHBlY3QodG9rZW5zWzFdKS50b0VxdWFsIHZhbHVlOiAnX2ZvbycsIHNjb3BlczogWydzb3VyY2UucHVwcGV0JywgJ3ZhcmlhYmxlLm90aGVyLnJlYWR3cml0ZS5nbG9iYWwucHVwcGV0J11cblxuICAgICAge3Rva2Vuc30gPSBncmFtbWFyLnRva2VuaXplTGluZSgnJF9mb29fJylcbiAgICAgIGV4cGVjdCh0b2tlbnNbMF0pLnRvRXF1YWwgdmFsdWU6ICckJywgc2NvcGVzOiBbJ3NvdXJjZS5wdXBwZXQnLCAndmFyaWFibGUub3RoZXIucmVhZHdyaXRlLmdsb2JhbC5wdXBwZXQnLCAncHVuY3R1YXRpb24uZGVmaW5pdGlvbi52YXJpYWJsZS5wdXBwZXQnXVxuICAgICAgZXhwZWN0KHRva2Vuc1sxXSkudG9FcXVhbCB2YWx1ZTogJ19mb29fJywgc2NvcGVzOiBbJ3NvdXJjZS5wdXBwZXQnLCAndmFyaWFibGUub3RoZXIucmVhZHdyaXRlLmdsb2JhbC5wdXBwZXQnXVxuXG4gICAgICB7dG9rZW5zfSA9IGdyYW1tYXIudG9rZW5pemVMaW5lKCckOjpmb28nKVxuICAgICAgZXhwZWN0KHRva2Vuc1swXSkudG9FcXVhbCB2YWx1ZTogJyQnLCBzY29wZXM6IFsnc291cmNlLnB1cHBldCcsICd2YXJpYWJsZS5vdGhlci5yZWFkd3JpdGUuZ2xvYmFsLnB1cHBldCcsICdwdW5jdHVhdGlvbi5kZWZpbml0aW9uLnZhcmlhYmxlLnB1cHBldCddXG4gICAgICBleHBlY3QodG9rZW5zWzFdKS50b0VxdWFsIHZhbHVlOiAnOjpmb28nLCBzY29wZXM6IFsnc291cmNlLnB1cHBldCcsICd2YXJpYWJsZS5vdGhlci5yZWFkd3JpdGUuZ2xvYmFsLnB1cHBldCddXG5cbiAgICBpdCBcInRva2VuaXplcyByZXNvdXJjZSB0eXBlcyBjb3JyZWN0bHlcIiwgLT5cbiAgICAgIHt0b2tlbnN9ID0gZ3JhbW1hci50b2tlbml6ZUxpbmUoXCJmaWxlIHsnL3Zhci90bXAnOn1cIilcbiAgICAgIGV4cGVjdCh0b2tlbnNbMF0pLnRvRXF1YWwgdmFsdWU6ICdmaWxlJywgc2NvcGVzOiBbJ3NvdXJjZS5wdXBwZXQnLCAnbWV0YS5kZWZpbml0aW9uLnJlc291cmNlLnB1cHBldCcsICdzdG9yYWdlLnR5cGUucHVwcGV0J11cblxuICAgICAge3Rva2Vuc30gPSBncmFtbWFyLnRva2VuaXplTGluZShcInBhY2thZ2Ugeydmb28nOn1cIilcbiAgICAgIGV4cGVjdCh0b2tlbnNbMF0pLnRvRXF1YWwgdmFsdWU6ICdwYWNrYWdlJywgc2NvcGVzOiBbJ3NvdXJjZS5wdXBwZXQnLCAnbWV0YS5kZWZpbml0aW9uLnJlc291cmNlLnB1cHBldCcsICdzdG9yYWdlLnR5cGUucHVwcGV0J11cbiJdfQ==
