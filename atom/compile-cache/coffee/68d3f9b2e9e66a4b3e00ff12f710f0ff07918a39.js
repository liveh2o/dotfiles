(function() {
  describe('linter-registry', function() {
    var EditorLinter, LinterRegistry, getLinter, linterRegistry;
    LinterRegistry = require('../lib/linter-registry');
    EditorLinter = require('../lib/editor-linter');
    linterRegistry = null;
    getLinter = function() {
      return {
        grammarScopes: ['*'],
        lintOnFly: false,
        modifiesBuffer: false,
        scope: 'file',
        lint: function() {}
      };
    };
    beforeEach(function() {
      waitsForPromise(function() {
        atom.workspace.destroyActivePaneItem();
        return atom.workspace.open('test.txt');
      });
      if (linterRegistry != null) {
        linterRegistry.deactivate();
      }
      return linterRegistry = new LinterRegistry;
    });
    describe('::addLinter', function() {
      it('adds error notification if linter is invalid', function() {
        linterRegistry.addLinter({});
        return expect(atom.notifications.getNotifications().length).toBe(1);
      });
      return it('pushes linter into registry when valid', function() {
        var linter;
        linter = getLinter();
        linterRegistry.addLinter(linter);
        return expect(linterRegistry.linters.length).toBe(1);
      });
    });
    describe('::hasLinter', function() {
      it('returns true if present', function() {
        var linter;
        linter = getLinter();
        linterRegistry.addLinter(linter);
        return expect(linterRegistry.hasLinter(linter)).toBe(true);
      });
      return it('returns false if not', function() {
        var linter;
        linter = getLinter();
        return expect(linterRegistry.hasLinter(linter)).toBe(false);
      });
    });
    describe('::deleteLinter', function() {
      return it('deletes the linter from registry', function() {
        var linter;
        linter = getLinter();
        linterRegistry.addLinter(linter);
        expect(linterRegistry.hasLinter(linter)).toBe(true);
        linterRegistry.deleteLinter(linter);
        return expect(linterRegistry.hasLinter(linter)).toBe(false);
      });
    });
    describe('::lint', function() {
      it("doesn't lint if textEditor isn't active one", function() {
        var editorLinter, linter;
        editorLinter = new EditorLinter(atom.workspace.getActiveTextEditor());
        linter = {
          grammarScopes: ['*'],
          lintOnFly: false,
          modifiesBuffer: false,
          scope: 'file',
          lint: function() {}
        };
        linterRegistry.addLinter(linter);
        return waitsForPromise(function() {
          return atom.workspace.open('test2.txt').then(function() {
            return expect(linterRegistry.lint({
              onChange: false,
              editorLinter: editorLinter
            })).toBeUndefined();
          });
        });
      });
      it("doesn't lint if textEditor doesn't have a path", function() {
        var editorLinter, linter;
        editorLinter = new EditorLinter(atom.workspace.getActiveTextEditor());
        linter = {
          grammarScopes: ['*'],
          lintOnFly: false,
          modifiesBuffer: false,
          scope: 'file',
          lint: function() {}
        };
        linterRegistry.addLinter(linter);
        return waitsForPromise(function() {
          return atom.workspace.open('someNonExistingFile.txt').then(function() {
            return expect(linterRegistry.lint({
              onChange: false,
              editorLinter: editorLinter
            })).toBeUndefined();
          });
        });
      });
      it('disallows two co-current lints of same type', function() {
        var editorLinter, linter;
        editorLinter = new EditorLinter(atom.workspace.getActiveTextEditor());
        linter = {
          grammarScopes: ['*'],
          lintOnFly: false,
          modifiesBuffer: false,
          scope: 'file',
          lint: function() {}
        };
        linterRegistry.addLinter(linter);
        expect(linterRegistry.lint({
          onChange: false,
          editorLinter: editorLinter
        })).toBeDefined();
        return expect(linterRegistry.lint({
          onChange: false,
          editorLinter: editorLinter
        })).toBeUndefined();
      });
      return describe('buffer modifying linter', function() {
        it('triggers before other linters', function() {
          var bufferModifying, editorLinter, last, normalLinter;
          last = null;
          normalLinter = {
            grammarScopes: ['*'],
            lintOnFly: false,
            modifiesBuffer: false,
            scope: 'file',
            lint: function() {
              return last = 'normal';
            }
          };
          bufferModifying = {
            grammarScopes: ['*'],
            lintOnFly: false,
            modifiesBuffer: true,
            scope: 'file',
            lint: function() {
              return last = 'bufferModifying';
            }
          };
          editorLinter = new EditorLinter(atom.workspace.getActiveTextEditor());
          linterRegistry.addLinter(normalLinter);
          linterRegistry.addLinter(bufferModifying);
          return waitsForPromise(function() {
            return linterRegistry.lint({
              onChange: false,
              editorLinter: editorLinter
            }).then(function() {
              return expect(last).toBe('normal');
            });
          });
        });
        return it('runs in sequence', function() {
          var editorLinter, first, order, second, third;
          order = [];
          first = {
            grammarScopes: ['*'],
            lintOnFly: false,
            modifiesBuffer: true,
            scope: 'file',
            lint: function() {
              return order.push('first');
            }
          };
          second = {
            grammarScopes: ['*'],
            lintOnFly: false,
            modifiesBuffer: true,
            scope: 'file',
            lint: function() {
              return order.push('second');
            }
          };
          third = {
            grammarScopes: ['*'],
            lintOnFly: false,
            modifiesBuffer: true,
            scope: 'file',
            lint: function() {
              return order.push('third');
            }
          };
          editorLinter = new EditorLinter(atom.workspace.getActiveTextEditor());
          linterRegistry.addLinter(first);
          linterRegistry.addLinter(second);
          linterRegistry.addLinter(third);
          return waitsForPromise(function() {
            return linterRegistry.lint({
              onChange: false,
              editorLinter: editorLinter
            }).then(function() {
              expect(order[0]).toBe('first');
              expect(order[1]).toBe('second');
              return expect(order[2]).toBe('third');
            });
          });
        });
      });
    });
    return describe('::onDidUpdateMessages', function() {
      return it('is triggered whenever messages change', function() {
        var editorLinter, info, linter;
        editorLinter = new EditorLinter(atom.workspace.getActiveTextEditor());
        linter = {
          grammarScopes: ['*'],
          lintOnFly: false,
          modifiesBuffer: false,
          scope: 'file',
          lint: function() {
            return [
              {
                type: "Error",
                text: "Something"
              }
            ];
          }
        };
        info = void 0;
        linterRegistry.addLinter(linter);
        linterRegistry.onDidUpdateMessages(function(linterInfo) {
          return info = linterInfo;
        });
        return waitsForPromise(function() {
          return linterRegistry.lint({
            onChange: false,
            editorLinter: editorLinter
          }).then(function() {
            expect(info).toBeDefined();
            return expect(info.messages.length).toBe(1);
          });
        });
      });
    });
  });

}).call(this);
