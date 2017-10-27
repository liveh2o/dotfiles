(function() {
  describe('Pre-Linter v1.0 API Compatibility', function() {
    var legacyAdapter;
    legacyAdapter = require('../lib/legacy.coffee');
    it('Adapts plain string `syntax` property', function() {
      var adapted, classicLinter;
      classicLinter = {
        syntax: 'source.js'
      };
      adapted = legacyAdapter(classicLinter);
      return expect(adapted.grammarScopes).toEqual(['source.js']);
    });
    return it('Adapts array `syntax` property', function() {
      var adapted, classicLinter;
      classicLinter = {
        syntax: ['source.js']
      };
      adapted = legacyAdapter(classicLinter);
      return expect(adapted.grammarScopes).toEqual(['source.js']);
    });
  });

}).call(this);
