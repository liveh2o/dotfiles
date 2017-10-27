(function() {
  describe('helpers', function() {
    var helpers;
    helpers = require('../lib/helpers');
    beforeEach(function() {
      return atom.notifications.clear();
    });
    describe('::error', function() {
      return it('adds an error notification', function() {
        helpers.error(new Error());
        return expect(atom.notifications.getNotifications().length).toBe(1);
      });
    });
    return describe('::shouldTriggerLinter', function() {
      var bufferModifying, lintOnFly, normalLinter;
      normalLinter = {
        grammarScopes: ['*'],
        scope: 'file',
        modifiesBuffer: false,
        lintOnFly: false,
        lint: function() {}
      };
      lintOnFly = {
        grammarScopes: ['*'],
        scope: 'file',
        modifiesBuffer: false,
        lintOnFly: true,
        lint: function() {}
      };
      bufferModifying = {
        grammarScopes: ['*'],
        scope: 'file',
        modifiesBuffer: true,
        lintOnFly: false,
        lint: function() {}
      };
      it('accepts a wildcard grammarScope', function() {
        return expect(helpers.shouldTriggerLinter(normalLinter, false, false, ['*'])).toBe(true);
      });
      it('runs lintOnFly ones on both save and lintOnFly', function() {
        expect(helpers.shouldTriggerLinter(lintOnFly, false, false, ['*'])).toBe(true);
        return expect(helpers.shouldTriggerLinter(lintOnFly, false, true, ['*'])).toBe(true);
      });
      it("doesn't run save ones on fly", function() {
        return expect(helpers.shouldTriggerLinter(normalLinter, false, true, ['*'])).toBe(false);
      });
      return it('runs only if bufferModifying flag matches with linter', function() {
        expect(helpers.shouldTriggerLinter(normalLinter, false, false, ['*'])).toBe(true);
        expect(helpers.shouldTriggerLinter(normalLinter, true, false, ['*'])).toBe(false);
        expect(helpers.shouldTriggerLinter(bufferModifying, false, false, ['*'])).toBe(false);
        return expect(helpers.shouldTriggerLinter(bufferModifying, true, false, ['*'])).toBe(true);
      });
    });
  });

}).call(this);
