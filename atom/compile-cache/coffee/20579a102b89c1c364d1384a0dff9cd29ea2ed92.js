(function() {
  describe('buffer modifying linter', function() {
    var linter;
    linter = null;
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.packages.activatePackage('linter').then(function(pack) {
          return linter = pack.mainModule.instance;
        });
      });
      return waitsForPromise(function() {
        return atom.workspace.open('test.txt');
      });
    });
    it('triggers before other linters', function() {
      var bufferModifying, last, normalLinter;
      last = null;
      bufferModifying = {
        grammarScopes: ['*'],
        scope: 'file',
        lintOnFly: false,
        modifiesBuffer: true,
        lint: function() {
          last = 'bufferModifying';
          return [];
        }
      };
      normalLinter = {
        grammarScopes: ['*'],
        scope: 'file',
        lintOnFly: false,
        modifiesBuffer: false,
        lint: function() {
          last = 'normal';
          return [];
        }
      };
      linter.addLinter(bufferModifying);
      linter.addLinter(normalLinter);
      return waitsForPromise(function() {
        return linter.getActiveEditorLinter().lint(false).then(function() {
          return expect(last).toBe('normal');
        });
      });
    });
    return it('runs in sequence', function() {
      var exeOrder, first, normalLinter, second, third;
      exeOrder = [];
      first = {
        grammarScopes: ['*'],
        scope: 'file',
        lintOnFly: false,
        modifiesBuffer: true,
        lint: function() {
          exeOrder.push('first');
          return [];
        }
      };
      second = {
        grammarScopes: ['*'],
        scope: 'file',
        lintOnFly: false,
        modifiesBuffer: true,
        lint: function() {
          exeOrder.push('second');
          return [];
        }
      };
      third = {
        grammarScopes: ['*'],
        scope: 'file',
        lintOnFly: false,
        modifiesBuffer: true,
        lint: function() {
          exeOrder.push('third');
          return [];
        }
      };
      normalLinter = {
        grammarScopes: ['*'],
        scope: 'file',
        lintOnFly: false,
        modifiesBuffer: false,
        lint: function() {
          exeOrder.push('forth');
          return [];
        }
      };
      linter.addLinter(first);
      linter.addLinter(second);
      linter.addLinter(third);
      linter.addLinter(normalLinter);
      return waitsForPromise(function() {
        return linter.getActiveEditorLinter().lint(false).then(function() {
          expect(exeOrder[0]).toBe('first');
          expect(exeOrder[1]).toBe('second');
          expect(exeOrder[2]).toBe('third');
          return expect(exeOrder[3]).toBe('forth');
        });
      });
    });
  });

}).call(this);
