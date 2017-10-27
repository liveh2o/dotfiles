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
        return expect(linterRegistry.linters.size).toBe(1);
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
      return it('disallows two co-current lints of same type', function() {
        var editorLinter, linter;
        editorLinter = new EditorLinter(atom.workspace.getActiveTextEditor());
        linter = {
          grammarScopes: ['*'],
          lintOnFly: false,
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
    });
    return describe('::onDidUpdateMessages', function() {
      return it('is triggered whenever messages change', function() {
        var editorLinter, info, linter;
        editorLinter = new EditorLinter(atom.workspace.getActiveTextEditor());
        linter = {
          grammarScopes: ['*'],
          lintOnFly: false,
          scope: 'file',
          lint: function() {
            return [
              {
                type: 'Error',
                text: 'Something'
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
