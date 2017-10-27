(function() {
  var Grim;

  Grim = require('grim');

  describe("WrapGuide", function() {
    var editor, getLeftPosition, workspaceElement, wrapGuide, _ref;
    _ref = [], editor = _ref[0], wrapGuide = _ref[1], workspaceElement = _ref[2];
    getLeftPosition = function(element) {
      return parseInt(element.style.left);
    };
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      workspaceElement.style.height = "200px";
      workspaceElement.style.width = "1500px";
      jasmine.attachToDOM(workspaceElement);
      waitsForPromise(function() {
        return atom.packages.activatePackage('wrap-guide');
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('language-javascript');
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('language-coffee-script');
      });
      waitsForPromise(function() {
        return atom.workspace.open('sample.js');
      });
      return runs(function() {
        editor = atom.workspace.getActiveTextEditor();
        return wrapGuide = workspaceElement.querySelector(".wrap-guide");
      });
    });
    describe(".activate", function() {
      var getWrapGuides;
      getWrapGuides = function() {
        return workspaceElement.querySelectorAll(".underlayer > .wrap-guide");
      };
      it("appends a wrap guide to all existing and new editors", function() {
        expect(atom.workspace.getPanes().length).toBe(1);
        expect(getWrapGuides().length).toBe(1);
        expect(getLeftPosition(getWrapGuides()[0])).toBeGreaterThan(0);
        atom.workspace.getActivePane().splitRight({
          copyActiveItem: true
        });
        expect(atom.workspace.getPanes().length).toBe(2);
        expect(getWrapGuides().length).toBe(2);
        expect(getLeftPosition(getWrapGuides()[0])).toBeGreaterThan(0);
        return expect(getLeftPosition(getWrapGuides()[1])).toBeGreaterThan(0);
      });
      return it("positions the guide at the configured column", function() {
        var width;
        width = editor.getDefaultCharWidth() * wrapGuide.getDefaultColumn();
        expect(width).toBeGreaterThan(0);
        expect(getLeftPosition(wrapGuide)).toBe(width);
        return expect(wrapGuide).toBeVisible();
      });
    });
    describe("when the font size changes", function() {
      return it("updates the wrap guide position", function() {
        var fontSize, initial;
        initial = getLeftPosition(wrapGuide);
        expect(initial).toBeGreaterThan(0);
        fontSize = atom.config.get("editor.fontSize");
        atom.config.set("editor.fontSize", fontSize + 10);
        advanceClock(1);
        expect(getLeftPosition(wrapGuide)).toBeGreaterThan(initial);
        return expect(wrapGuide).toBeVisible();
      });
    });
    describe("when the column config changes", function() {
      return it("updates the wrap guide position", function() {
        var column, initial;
        initial = getLeftPosition(wrapGuide);
        expect(initial).toBeGreaterThan(0);
        column = atom.config.get("editor.preferredLineLength");
        atom.config.set("editor.preferredLineLength", column + 10);
        expect(getLeftPosition(wrapGuide)).toBeGreaterThan(initial);
        expect(wrapGuide).toBeVisible();
        atom.config.set("wrap-guide.columns", [
          {
            pattern: ".*",
            column: column - 10
          }
        ]);
        expect(getLeftPosition(wrapGuide)).toBeLessThan(initial);
        return expect(wrapGuide).toBeVisible();
      });
    });
    describe("when the editor's grammar changes", function() {
      it("updates the wrap guide position", function() {
        var initial;
        atom.config.set('editor.preferredLineLength', 20, {
          scopeSelector: '.source.js'
        });
        initial = getLeftPosition(wrapGuide);
        expect(initial).toBeGreaterThan(0);
        expect(wrapGuide).toBeVisible();
        editor.setGrammar(atom.grammars.grammarForScopeName('text.plain.null-grammar'));
        expect(getLeftPosition(wrapGuide)).toBeGreaterThan(initial);
        return expect(wrapGuide).toBeVisible();
      });
      it('listens for preferredLineLength updates for the new grammar', function() {
        editor.setGrammar(atom.grammars.grammarForScopeName('source.coffee'));
        spyOn(wrapGuide, 'updateGuide');
        atom.config.set('editor.preferredLineLength', 20, {
          scopeSelector: '.source.coffee'
        });
        return expect(wrapGuide.updateGuide).toHaveBeenCalled();
      });
      return it('listens for wrap-guide.enabled updates for the new grammar', function() {
        editor.setGrammar(atom.grammars.grammarForScopeName('source.coffee'));
        spyOn(wrapGuide, 'updateGuide');
        atom.config.set('wrap-guide.enabled', false, {
          scopeSelecotr: '.source.coffee'
        });
        return expect(wrapGuide.updateGuide).toHaveBeenCalled();
      });
    });
    describe("using a custom config column", function() {
      it("places the wrap guide at the custom column", function() {
        var width;
        atom.config.set('wrap-guide.columns', [
          {
            pattern: '\.js$',
            column: 20
          }
        ]);
        wrapGuide.updateGuide();
        width = editor.getDefaultCharWidth() * 20;
        expect(width).toBeGreaterThan(0);
        return expect(getLeftPosition(wrapGuide)).toBe(width);
      });
      it("uses the default column when no custom column matches the path", function() {
        var width;
        atom.config.set('wrap-guide.columns', [
          {
            pattern: '\.jsp$',
            column: '100'
          }
        ]);
        wrapGuide.updateGuide();
        width = editor.getDefaultCharWidth() * wrapGuide.getDefaultColumn();
        expect(width).toBeGreaterThan(0);
        return expect(getLeftPosition(wrapGuide)).toBe(width);
      });
      it("hides the guide when the config column is less than 1", function() {
        atom.config.set('wrap-guide.columns', [
          {
            pattern: 'sample\.js$',
            column: -1
          }
        ]);
        wrapGuide.updateGuide();
        return expect(wrapGuide).toBeHidden();
      });
      it("ignores invalid regexes", function() {
        atom.config.set('wrap-guide.columns', [
          {
            pattern: '(',
            column: -1
          }
        ]);
        return expect(function() {
          return wrapGuide.updateGuide();
        }).not.toThrow();
      });
      it("places the wrap guide at the custom column using scope name", function() {
        var width;
        atom.config.set('wrap-guide.columns', [
          {
            scope: 'source.js',
            column: 20
          }
        ]);
        wrapGuide.updateGuide();
        width = editor.getDefaultCharWidth() * 20;
        expect(width).toBeGreaterThan(0);
        return expect(getLeftPosition(wrapGuide)).toBe(width);
      });
      it("uses the default column when no scope name matches", function() {
        var width;
        atom.config.set('wrap-guide.columns', [
          {
            scope: 'source.gfm',
            column: '100'
          }
        ]);
        wrapGuide.updateGuide();
        width = editor.getDefaultCharWidth() * wrapGuide.getDefaultColumn();
        expect(width).toBeGreaterThan(0);
        return expect(getLeftPosition(wrapGuide)).toBe(width);
      });
      return it("favors the first matching rule", function() {
        var width;
        atom.config.set('wrap-guide.columns', [
          {
            pattern: '\.js$',
            column: 20
          }, {
            pattern: 'sample\.js$',
            column: 30
          }
        ]);
        wrapGuide.updateGuide();
        width = editor.getDefaultCharWidth() * 20;
        expect(width).toBeGreaterThan(0);
        return expect(getLeftPosition(wrapGuide)).toBe(width);
      });
    });
    describe('scoped config', function() {
      it('::getDefaultColumn returns the scope-specific column value', function() {
        atom.config.set('editor.preferredLineLength', 132, {
          scopeSelector: '.source.js'
        });
        return expect(wrapGuide.getDefaultColumn()).toBe(132);
      });
      it('updates the guide when the scope-specific column changes', function() {
        var column;
        spyOn(wrapGuide, 'updateGuide');
        column = atom.config.get('editor.preferredLineLength', {
          scope: editor.getRootScopeDescriptor()
        });
        atom.config.set('editor.preferredLineLength', column + 10, {
          scope: '.source.js'
        });
        return expect(wrapGuide.updateGuide).toHaveBeenCalled();
      });
      return it('updates the guide when wrap-guide.enabled is set to false', function() {
        expect(wrapGuide).toBeVisible();
        atom.config.set('wrap-guide.enabled', false, {
          scopeSelector: '.source.js'
        });
        return expect(wrapGuide).not.toBeVisible();
      });
    });
    return describe('converting old configuration', function() {
      beforeEach(function() {
        return atom.packages.deactivatePackage('wrap-guide');
      });
      it('converts old package-specific scoped config to new Atom style', function() {
        atom.config.set('wrap-guide.columns', [
          {
            scope: 'source.gfm',
            column: 100
          }
        ]);
        waitsForPromise(function() {
          return atom.packages.activatePackage('wrap-guide');
        });
        return runs(function() {
          expect(atom.config.get('editor.preferredLineLength', {
            scope: ['source.gfm']
          })).toBe(100);
          return expect(atom.config.get('wrap-guide.columns')).toBeUndefined();
        });
      });
      it('converts package-specific scoped config of -1 to wrap-guide.enabled = false', function() {
        atom.config.set('wrap-guide.columns', [
          {
            scope: 'source.gfm',
            column: -1
          }
        ]);
        waitsForPromise(function() {
          return atom.packages.activatePackage('wrap-guide');
        });
        return runs(function() {
          expect(atom.config.get('wrap-guide.enabled', {
            scope: ['source.gfm']
          })).toBe(false);
          return expect(atom.config.get('wrap-guide.columns')).toBeUndefined();
        });
      });
      return it('does not convert pattern column settings', function() {
        spyOn(Grim, 'deprecate');
        atom.config.set('wrap-guide.columns', [
          {
            pattern: '\.js$',
            column: 100
          }
        ]);
        waitsForPromise(function() {
          return atom.packages.activatePackage('wrap-guide');
        });
        return runs(function() {
          expect(atom.config.get('wrap-guide.columns')).toEqual([
            {
              pattern: '\.js$',
              column: 100
            }
          ]);
          return expect(Grim.deprecate.callCount).toBe(1);
        });
      });
    });
  });

}).call(this);
