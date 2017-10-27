(function() {
  describe('Linter Config', function() {
    var getLinter, getMessage, linter, nextAnimationFrame;
    linter = null;
    beforeEach(function() {
      return waitsForPromise(function() {
        return atom.packages.activatePackage('linter').then(function() {
          return linter = atom.packages.getActivePackage('linter').mainModule.instance;
        });
      });
    });
    getLinter = function() {
      return {
        grammarScopes: ['*'],
        lintOnFly: false,
        modifiesBuffer: false,
        scope: 'project',
        lint: function() {}
      };
    };
    getMessage = function(type, filePath) {
      return {
        type: type,
        text: "Some Message",
        filePath: filePath
      };
    };
    nextAnimationFrame = function() {
      return new Promise(function(resolve) {
        return requestAnimationFrame(resolve);
      });
    };
    describe('ignoredMessageTypes', function() {
      return it('ignores certain types of messages', function() {
        var linterProvider;
        linterProvider = getLinter();
        expect(linter.messages.publicMessages.length).toBe(0);
        linter.messages.set({
          linter: linterProvider,
          messages: [getMessage('Error'), getMessage('Warning')]
        });
        return waitsForPromise(function() {
          return nextAnimationFrame().then(function() {
            expect(linter.messages.publicMessages.length).toBe(2);
            atom.config.set('linter.ignoredMessageTypes', ['Error']);
            linter.messages.set({
              linter: linterProvider,
              messages: [getMessage('Error'), getMessage('Warning')]
            });
            return nextAnimationFrame();
          }).then(function() {
            return expect(linter.messages.publicMessages.length).toBe(1);
          });
        });
      });
    });
    return describe('statusIconScope', function() {
      return it('only shows messages of the current scope', function() {
        var linterProvider;
        linterProvider = getLinter();
        expect(linter.views.bottomContainer.status.count).toBe(0);
        linter.messages.set({
          linter: linterProvider,
          messages: [getMessage('Error', '/tmp/test.coffee')]
        });
        return waitsForPromise(function() {
          return nextAnimationFrame().then(function() {
            expect(linter.views.bottomContainer.status.count).toBe(1);
            atom.config.set('linter.statusIconScope', 'File');
            expect(linter.views.bottomContainer.status.count).toBe(0);
            atom.config.set('linter.statusIconScope', 'Project');
            return expect(linter.views.bottomContainer.status.count).toBe(1);
          });
        });
      });
    });
  });

}).call(this);
