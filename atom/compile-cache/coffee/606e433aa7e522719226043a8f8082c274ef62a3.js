(function() {
  var Grim;

  Grim = require('grim');

  describe("WrapGuide", function() {
    var editor, editorElement, getLeftPosition, workspaceElement, wrapGuide, _ref;
    _ref = [], editor = _ref[0], editorElement = _ref[1], wrapGuide = _ref[2], workspaceElement = _ref[3];
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
        editorElement = atom.views.getView(editor);
        return wrapGuide = editorElement.rootElement.querySelector(".wrap-guide");
      });
    });
    describe(".activate", function() {
      var getWrapGuides;
      getWrapGuides = function() {
        var wrapGuides;
        wrapGuides = [];
        atom.workspace.getTextEditors().forEach(function(editor) {
          var guide;
          guide = atom.views.getView(editor).rootElement.querySelector(".wrap-guide");
          if (guide) {
            return wrapGuides.push(guide);
          }
        });
        return wrapGuides;
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
        expect(Math.abs(getLeftPosition(wrapGuide) - width)).toBeLessThan(1);
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
    describe("when the editor's scroll left changes", function() {
      return it("updates the wrap guide position to a relative position on screen", function() {
        var initial;
        editor.setText("a long line which causes the editor to scroll");
        if (editorElement.logicalDisplayBuffer) {
          editorElement.setWidth(100);
        } else {
          editor.setWidth(100);
        }
        initial = getLeftPosition(wrapGuide);
        expect(initial).toBeGreaterThan(0);
        if (editorElement.logicalDisplayBuffer) {
          editorElement.setScrollLeft(10);
        } else {
          editor.setScrollLeft(10);
        }
        expect(getLeftPosition(wrapGuide)).toBe(initial - 10);
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
        return expect(Math.abs(getLeftPosition(wrapGuide) - width)).toBeLessThan(1);
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
        return expect(Math.abs(getLeftPosition(wrapGuide) - width)).toBeLessThan(1);
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
        return expect(Math.abs(getLeftPosition(wrapGuide) - width)).toBeLessThan(1);
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
        return expect(Math.abs(getLeftPosition(wrapGuide) - width)).toBeLessThan(1);
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
        return expect(Math.abs(getLeftPosition(wrapGuide) - width)).toBeLessThan(1);
      });
    });
    return describe('scoped config', function() {
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
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3dyYXAtZ3VpZGUvc3BlYy93cmFwLWd1aWRlLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLElBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBUCxDQUFBOztBQUFBLEVBSUEsUUFBQSxDQUFTLFdBQVQsRUFBc0IsU0FBQSxHQUFBO0FBQ3BCLFFBQUEseUVBQUE7QUFBQSxJQUFBLE9BQXVELEVBQXZELEVBQUMsZ0JBQUQsRUFBUyx1QkFBVCxFQUF3QixtQkFBeEIsRUFBbUMsMEJBQW5DLENBQUE7QUFBQSxJQUVBLGVBQUEsR0FBa0IsU0FBQyxPQUFELEdBQUE7YUFDaEIsUUFBQSxDQUFTLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBdkIsRUFEZ0I7SUFBQSxDQUZsQixDQUFBO0FBQUEsSUFLQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsTUFBQSxnQkFBQSxHQUFtQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBSSxDQUFDLFNBQXhCLENBQW5CLENBQUE7QUFBQSxNQUNBLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxNQUF2QixHQUFnQyxPQURoQyxDQUFBO0FBQUEsTUFFQSxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsS0FBdkIsR0FBK0IsUUFGL0IsQ0FBQTtBQUFBLE1BSUEsT0FBTyxDQUFDLFdBQVIsQ0FBb0IsZ0JBQXBCLENBSkEsQ0FBQTtBQUFBLE1BTUEsZUFBQSxDQUFnQixTQUFBLEdBQUE7ZUFDZCxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsWUFBOUIsRUFEYztNQUFBLENBQWhCLENBTkEsQ0FBQTtBQUFBLE1BU0EsZUFBQSxDQUFnQixTQUFBLEdBQUE7ZUFDZCxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQs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

//# sourceURL=/Users/ah/.atom/packages/wrap-guide/spec/wrap-guide-spec.coffee
