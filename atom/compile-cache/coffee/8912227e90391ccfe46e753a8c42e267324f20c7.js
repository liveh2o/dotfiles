(function() {
  describe('linter-registry', function() {
    var EditorLinter, LinterRegistry, getLinter, getMessage, linterRegistry, _ref;
    LinterRegistry = require('../lib/linter-registry');
    EditorLinter = require('../lib/editor-linter');
    linterRegistry = null;
    _ref = require('./common'), getLinter = _ref.getLinter, getMessage = _ref.getMessage;
    beforeEach(function() {
      waitsForPromise(function() {
        atom.workspace.destroyActivePaneItem();
        return atom.workspace.open('file.txt');
      });
      if (linterRegistry != null) {
        linterRegistry.dispose();
      }
      return linterRegistry = new LinterRegistry;
    });
    describe('::addLinter', function() {
      it('adds error notification if linter is invalid', function() {
        linterRegistry.addLinter({});
        return expect(atom.notifications.getNotifications().length).toBe(1);
      });
      it('pushes linter into registry when valid', function() {
        var linter;
        linter = getLinter();
        linterRegistry.addLinter(linter);
        return expect(linterRegistry.linters.length).toBe(1);
      });
      return it('set deactivated to false on linter', function() {
        var linter;
        linter = getLinter();
        linterRegistry.addLinter(linter);
        return expect(linter.deactivated).toBe(false);
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
      it('deletes the linter from registry', function() {
        var linter;
        linter = getLinter();
        linterRegistry.addLinter(linter);
        expect(linterRegistry.hasLinter(linter)).toBe(true);
        linterRegistry.deleteLinter(linter);
        return expect(linterRegistry.hasLinter(linter)).toBe(false);
      });
      return it('sets deactivated to true on linter', function() {
        var linter;
        linter = getLinter();
        linterRegistry.addLinter(linter);
        linterRegistry.deleteLinter(linter);
        return expect(linter.deactivated).toBe(true);
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9zcGVjL2xpbnRlci1yZWdpc3RyeS1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsRUFBQSxRQUFBLENBQVMsaUJBQVQsRUFBNEIsU0FBQSxHQUFBO0FBQzFCLFFBQUEseUVBQUE7QUFBQSxJQUFBLGNBQUEsR0FBaUIsT0FBQSxDQUFRLHdCQUFSLENBQWpCLENBQUE7QUFBQSxJQUNBLFlBQUEsR0FBZSxPQUFBLENBQVEsc0JBQVIsQ0FEZixDQUFBO0FBQUEsSUFFQSxjQUFBLEdBQWlCLElBRmpCLENBQUE7QUFBQSxJQUdBLE9BQTBCLE9BQUEsQ0FBUSxVQUFSLENBQTFCLEVBQUMsaUJBQUEsU0FBRCxFQUFZLGtCQUFBLFVBSFosQ0FBQTtBQUFBLElBS0EsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsZUFBQSxDQUFnQixTQUFBLEdBQUE7QUFDZCxRQUFBLElBQUksQ0FBQyxTQUFTLENBQUMscUJBQWYsQ0FBQSxDQUFBLENBQUE7ZUFDQSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsVUFBcEIsRUFGYztNQUFBLENBQWhCLENBQUEsQ0FBQTs7UUFHQSxjQUFjLENBQUUsT0FBaEIsQ0FBQTtPQUhBO2FBSUEsY0FBQSxHQUFpQixHQUFBLENBQUEsZUFMUjtJQUFBLENBQVgsQ0FMQSxDQUFBO0FBQUEsSUFZQSxRQUFBLENBQVMsYUFBVCxFQUF3QixTQUFBLEdBQUE7QUFDdEIsTUFBQSxFQUFBLENBQUcsOENBQUgsRUFBbUQsU0FBQSxHQUFBO0FBQ2pELFFBQUEsY0FBYyxDQUFDLFNBQWYsQ0FBeUIsRUFBekIsQ0FBQSxDQUFBO2VBQ0EsTUFBQSxDQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsZ0JBQW5CLENBQUEsQ0FBcUMsQ0FBQyxNQUE3QyxDQUFv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

//# sourceURL=/Users/ah/.atom/packages/linter/spec/linter-registry-spec.coffee
