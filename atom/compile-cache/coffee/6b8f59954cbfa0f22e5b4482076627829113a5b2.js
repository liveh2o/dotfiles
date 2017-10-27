(function() {
  describe('editor-registry', function() {
    var EditorRegistry, editorRegistry;
    EditorRegistry = require('../lib/editor-registry');
    editorRegistry = null;
    beforeEach(function() {
      waitsForPromise(function() {
        atom.workspace.destroyActivePaneItem();
        return atom.workspace.open(__dirname + '/fixtures/file.txt');
      });
      if (editorRegistry != null) {
        editorRegistry.dispose();
      }
      return editorRegistry = new EditorRegistry;
    });
    describe('::create', function() {
      it('cries when invalid TextEditor was provided', function() {
        expect(function() {
          return editorRegistry.create();
        }).toThrow();
        return expect(function() {
          return editorRegistry.create(5);
        }).toThrow();
      });
      it("adds TextEditor to it's registry", function() {
        editorRegistry.create(atom.workspace.getActiveTextEditor());
        return expect(editorRegistry.editorLinters.size).toBe(1);
      });
      return it('automatically clears the TextEditor from registry when destroyed', function() {
        editorRegistry.create(atom.workspace.getActiveTextEditor());
        atom.workspace.destroyActivePaneItem();
        return expect(editorRegistry.editorLinters.size).toBe(0);
      });
    });
    describe('::has', function() {
      return it('returns the status of existence', function() {
        var editor;
        editor = atom.workspace.getActiveTextEditor();
        expect(editorRegistry.has(1)).toBe(false);
        expect(editorRegistry.has(false)).toBe(false);
        expect(editorRegistry.has([])).toBe(false);
        expect(editorRegistry.has(editor)).toBe(false);
        editorRegistry.create(editor);
        expect(editorRegistry.has(editor)).toBe(true);
        atom.workspace.destroyActivePaneItem();
        return expect(editorRegistry.has(editor)).toBe(false);
      });
    });
    describe('::forEach', function() {
      return it('calls the callback once per editorLinter', function() {
        var timesCalled;
        editorRegistry.create(atom.workspace.getActiveTextEditor());
        timesCalled = 0;
        editorRegistry.forEach(function() {
          return ++timesCalled;
        });
        editorRegistry.forEach(function() {
          return ++timesCalled;
        });
        return expect(timesCalled).toBe(2);
      });
    });
    describe('::ofTextEditor', function() {
      it('returns undefined when invalid key is provided', function() {
        expect(editorRegistry.ofTextEditor(null)).toBeUndefined();
        expect(editorRegistry.ofTextEditor(1)).toBeUndefined();
        expect(editorRegistry.ofTextEditor(5)).toBeUndefined();
        return expect(editorRegistry.ofTextEditor('asd')).toBeUndefined();
      });
      return it('returns editorLinter when valid key is provided', function() {
        var activeEditor;
        activeEditor = atom.workspace.getActiveTextEditor();
        expect(editorRegistry.ofTextEditor(activeEditor)).toBeUndefined();
        editorRegistry.create(activeEditor);
        return expect(editorRegistry.ofTextEditor(activeEditor)).toBeDefined();
      });
    });
    describe('::ofPath', function() {
      it('returns undefined when invalid key is provided', function() {
        expect(editorRegistry.ofPath(null)).toBeUndefined();
        expect(editorRegistry.ofPath(1)).toBeUndefined();
        expect(editorRegistry.ofPath(5)).toBeUndefined();
        return expect(editorRegistry.ofPath('asd')).toBeUndefined();
      });
      return it('returns editorLinter when valid key is provided', function() {
        var activeEditor, editorPath;
        activeEditor = atom.workspace.getActiveTextEditor();
        editorPath = activeEditor.getPath();
        expect(editorRegistry.ofPath(editorPath)).toBeUndefined();
        editorRegistry.create(activeEditor);
        return expect(editorRegistry.ofPath(editorPath)).toBeDefined();
      });
    });
    describe('::observe', function() {
      it('calls with the current editorLinters', function() {
        var timesCalled;
        timesCalled = 0;
        editorRegistry.create(atom.workspace.getActiveTextEditor());
        editorRegistry.observe(function() {
          return ++timesCalled;
        });
        return expect(timesCalled).toBe(1);
      });
      return it('calls in the future with new editorLinters', function() {
        var timesCalled;
        timesCalled = 0;
        editorRegistry.observe(function() {
          return ++timesCalled;
        });
        editorRegistry.create(atom.workspace.getActiveTextEditor());
        return waitsForPromise(function() {
          return atom.workspace.open('someNonExistingFile').then(function() {
            editorRegistry.create(atom.workspace.getActiveTextEditor());
            return expect(timesCalled).toBe(2);
          });
        });
      });
    });
    return describe('::ofActiveTextEditor', function() {
      it('returns undefined if active pane is not a text editor', function() {
        return expect(editorRegistry.ofActiveTextEditor()).toBeUndefined();
      });
      return it('returns editorLinter when active pane is a text editor', function() {
        editorRegistry.create(atom.workspace.getActiveTextEditor());
        return expect(editorRegistry.ofActiveTextEditor()).toBeDefined();
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9zcGVjL2VkaXRvci1yZWdpc3RyeS1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsRUFBQSxRQUFBLENBQVMsaUJBQVQsRUFBNEIsU0FBQSxHQUFBO0FBQzFCLFFBQUEsOEJBQUE7QUFBQSxJQUFBLGNBQUEsR0FBaUIsT0FBQSxDQUFRLHdCQUFSLENBQWpCLENBQUE7QUFBQSxJQUNBLGNBQUEsR0FBaUIsSUFEakIsQ0FBQTtBQUFBLElBRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsZUFBQSxDQUFnQixTQUFBLEdBQUE7QUFDZCxRQUFBLElBQUksQ0FBQyxTQUFTLENBQUMscUJBQWYsQ0FBQSxDQUFBLENBQUE7ZUFDQSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsU0FBQSxHQUFZLG9CQUFoQyxFQUZjO01BQUEsQ0FBaEIsQ0FBQSxDQUFBOztRQUdBLGNBQWMsQ0FBRSxPQUFoQixDQUFBO09BSEE7YUFJQSxjQUFBLEdBQWlCLEdBQUEsQ0FBQSxlQUxSO0lBQUEsQ0FBWCxDQUZBLENBQUE7QUFBQSxJQVNBLFFBQUEsQ0FBUyxVQUFULEVBQXFCLFNBQUEsR0FBQTtBQUNuQixNQUFBLEVBQUEsQ0FBRyw0Q0FBSCxFQUFpRCxTQUFBLEdBQUE7QUFDL0MsUUFBQSxNQUFBLENBQU8sU0FBQSxHQUFBO2lCQUNMLGNBQWMsQ0FBQyxNQUFmLENBQUEsRUFESztRQUFBLENBQVAsQ0FFQSxDQUFDLE9BRkQsQ0FBQSxDQUFBLENBQUE7ZUFHQSxNQUFBLENBQU8sU0FBQSxHQUFBO2lCQUNMLGNBQWMsQ0FBQyxNQUFmLENBQXNCLENBQXRCLEVBREs7UUFBQSxDQUFQLENBRUEsQ0FBQyxPQUZELENBQUEsRUFKK0M7TUFBQSxDQUFqRCxDQUFBLENBQUE7QUFBQSxNQU9BLEVBQUEsQ0FBRyxrQ0FBSCxFQUF1QyxTQUFBLEdBQUE7QUFDckMsUUFBQSxjQUFjLENBQUMsTUFBZixDQUFzQixJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBdEIsQ0FBQSxDQUFBO2VBQ0EsTUFBQSxDQUFPLGNBQWMsQ0FBQyxhQUFhLENBQUMsSUFBcEMsQ0FBeUMsQ0FBQyxJQUExQyxDQUErQyxDQUEvQyxFQUZxQztNQUFBLENBQXZDLENBUEEsQ0FBQTthQVVBLEVBQUEsQ0FBRyxrRUFBSCxFQUF1RSxTQUFBLEdBQUE7QUFDckUsUUFBQSxjQUFjLENBQUMsTUFBZixDQUFzQixJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBdEIsQ0FBQSxDQUFBO0FBQUEsUUFDQSxJQUFJLENBQUMsU0FBUyxDQUFDLHFCQUFmLENBQUEsQ0FEQSxDQUFBO2VBRUEsTUFBQSxDQUFPLGNBQWMsQ0FBQyxhQUFhLENBQUMsSUFBcEMsQ0FBeUMsQ0FBQyxJQUExQyxDQUErQyxDQUEvQyxFQUhxRTtNQUFBLENBQXZFLEVBWG1CO0lBQUEsQ0FBckIsQ0FUQSxDQUFBO0FBQUEsSUF5QkEsUUFBQSxDQUFTLE9BQVQsRUFBa0IsU0FBQSxHQUFBO2FBQ2hCLEVBQUEsQ0FBRyxpQ0FBSCxFQUFzQyxTQUFBLEdBQUE7QUFDcEMsWUFBQSxNQUFBO0FBQUEsUUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBQVQsQ0FBQTtBQUFBLFFBQ0EsTUFBQSxDQUFPLGNBQWMsQ0FBQyxHQUFmLENBQW1CLENBQW5CLENBQVAsQ0FBNkIsQ0FBQyxJQUE5QixDQUFtQyxLQUFuQyxDQURBLENBQUE7QUFBQSxRQUVBLE1BQUEsQ0FBTyxjQUFjLENBQUMsR0FBZixDQUFtQixLQUFuQixDQUFQLENBQWlDLENBQUMsSUFBbEMsQ0FBdUMsS0FBdkMsQ0FGQSxDQUFBO0FBQUEsUUFHQSxNQUFBLENBQU8sY0FBYyxDQUFDLEdBQWYsQ0FBbUIsRUFBbkIsQ0FBUCxDQUE4QixDQUFDLElBQS9CLENBQW9DLEtBQXBDLENBSEEsQ0FBQTtBQUFBLFFBSUEsTUFBQSxDQUFPLGNBQWMsQ0FBQyxHQUFmLENBQW1CLE1BQW5CLENBQVAsQ0FBa0MsQ0FBQyxJQUFuQyxDQUF3QyxLQUF4QyxDQUpBLENBQUE7QUFBQSxRQUtBLGNBQWMsQ0FBQyxNQUFmLENBQXNCLE1BQXRCLENBTEEsQ0FBQTtBQUFBLFFBTUEsTUFBQSxDQUFPLGNBQWMsQ0FBQyxHQUFmLENBQW1CLE1BQW5CLENBQVAsQ0FBa0MsQ0FBQyxJQUFuQyxDQUF3QyxJQUF4QyxDQU5BLENBQUE7QUFBQSxRQU9BLElBQUksQ0FBQyxTQUFTLENBQUMscUJBQWYsQ0FBQSxDQVBBLENBQUE7ZUFRQSxNQUFBLENBQU8sY0FBYyxDQUFDLEdBQWYsQ0FBbUIsTUFBbkIsQ0FBUCxDQUFrQyxDQUFDLElBQW5DLENBQXdDLEtBQXhDLEVBVG9DO01BQUEsQ0FBdEMsRUFEZ0I7SUFBQSxDQUFsQixDQXpCQSxDQUFBO0FBQUEsSUFxQ0EsUUFBQSxDQUFTLFdBQVQsRUFBc0IsU0FBQSxHQUFBO2FBQ3BCLEVBQUEsQ0FBRywwQ0FBSCxFQUErQyxTQUFBLEdBQUE7QUFDN0MsWUFBQSxXQUFBO0FBQUEsUUFBQSxjQUFjLENBQUMsTUFBZixDQUFzQixJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBdEIsQ0FBQSxDQUFBO0FBQUEsUUFDQSxXQUFBLEdBQWMsQ0FEZCxDQUFBO0FBQUEsUUFFQSxjQUFjLENBQUMsT0FBZixDQUF1QixTQUFBLEdBQUE7aUJBQUcsRUFBQSxZQUFIO1FBQUEsQ0FBdkIsQ0FGQSxDQUFBO0FBQUEsUUFHQSxjQUFjLENBQUMsT0FBZixDQUF1QixTQUFBLEdBQUE7aUJBQUcsRUFBQSxZQUFIO1FBQUEsQ0FBdkIsQ0FIQSxDQUFBO2VBSUEsTUFBQSxDQUFPLFdBQVAsQ0FBbUIsQ0FBQyxJQUFwQixDQUF5QixDQUF6QixFQUw2QztNQUFBLENBQS9DLEVBRG9CO0lBQUEsQ0FBdEIsQ0FyQ0EsQ0FBQTtBQUFBLElBNkNBLFFBQUEsQ0FBUyxnQkFBVCxFQUEyQixTQUFBLEdBQUE7QUFDekIsTUFBQSxFQUFBLENBQUcsZ0RBQUgsRUFBcUQsU0FBQSxHQUFBO0FBQ25ELFFBQUEsTUFBQSxDQUFPLGNBQWMsQ0FBQyxZQUFmLENBQTRCLElBQTVCLENBQVAsQ0FBeUMsQ0FBQyxhQUExQyxDQUFBLENBQUEsQ0FBQTtBQUFBLFFBQ0EsTUFBQSxDQUFPLGNBQWMsQ0FBQyxZQUFmLENBQTRCLENBQTVCLENBQVAsQ0FBc0MsQ0FBQyxhQUF2QyxDQUFBLENBREEsQ0FBQTtBQUFBLFFBRUEsTUFBQSxDQUFPLGNBQWMsQ0FBQyxZQUFmLENBQTRCLENBQTVCLENBQVAsQ0FBc0MsQ0FBQyxhQUF2QyxDQUFBLENBRkEsQ0FBQTtlQUdBLE1BQUEsQ0FBTyxjQUFjLENBQUMsWUFBZixDQUE0QixLQUE1QixDQUFQLENBQTBDLENBQUMsYUFBM0MsQ0FBQSxFQUptRDtNQUFBLENBQXJELENBQUEsQ0FBQTthQUtBLEVBQUEsQ0FBRyxpREFBSCxFQUFzRCxTQUFBLEdBQUE7QUFDcEQsWUFBQSxZQUFBO0FBQUEsUUFBQSxZQUFBLEdBQWUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBQWYsQ0FBQTtBQUFBLFFBQ0EsTUFBQSxDQUFPLGNBQWMsQ0FBQyxZQUFmLENBQTRCLFlBQTVCLENBQVAsQ0FBaUQsQ0FBQyxhQUFsRCxDQUFBLENBREEsQ0FBQTtBQUFBLFFBRUEsY0FBYyxDQUFDLE1BQWYsQ0FBc0IsWUFBdEIsQ0FGQSxDQUFBO2VBR0EsTUFBQSxDQUFPLGNBQWMsQ0FBQyxZQUFmLENBQTRCLFlBQTVCLENBQVAsQ0FBaUQsQ0FBQyxXQUFsRCxDQUFBLEVBSm9EO01BQUEsQ0FBdEQsRUFOeUI7SUFBQSxDQUEzQixDQTdDQSxDQUFBO0FBQUEsSUF5REEsUUFBQSxDQUFTLFVBQVQsRUFBcUIsU0FBQSxHQUFBO0FBQ25CLE1BQUEsRUFBQSxDQUFHLGdEQUFILEVBQXFELFNBQUEsR0FBQTtBQUNuRCxRQUFBLE1BQUEsQ0FBTyxjQUFjLENBQUMsTUFBZixDQUFzQixJQUF0QixDQUFQLENBQW1DLENBQUMsYUFBcEMsQ0FBQSxDQUFBLENBQUE7QUFBQSxRQUNBLE1BQUEsQ0FBTyxjQUFjLENBQUMsTUFBZixDQUFzQixDQUF0QixDQUFQLENBQWdDLENBQUMsYUFBakMsQ0FBQSxDQURBLENBQUE7QUFBQSxRQUVBLE1BQUEsQ0FBTyxjQUFjLENBQUMsTUFBZixDQUFzQixDQUF0QixDQUFQLENBQWdDLENBQUMsYUFBakMsQ0FBQSxDQUZBLENBQUE7ZUFHQSxNQUFBLENBQU8sY0FBYyxDQUFDLE1BQWYsQ0FBc0IsS0FBdEIsQ0FBUCxDQUFvQyxDQUFDLGFBQXJDLENBQUEsRUFKbUQ7TUFBQSxDQUFyRCxDQUFBLENBQUE7YUFLQSxFQUFBLENBQUcsaURBQUgsRUFBc0QsU0FBQSxHQUFBO0FBQ3BELFlBQUEsd0JBQUE7QUFBQSxRQUFBLFlBQUEsR0FBZSxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBZixDQUFBO0FBQUEsUUFDQSxVQUFBLEdBQWEsWUFBWSxDQUFDLE9BQWIsQ0FBQSxDQURiLENBQUE7QUFBQSxRQUVBLE1BQUEsQ0FBTyxjQUFjLENBQUMsTUFBZixDQUFzQixVQUF0QixDQUFQLENBQXlDLENBQUMsYUFBMUMsQ0FBQSxDQUZBLENBQUE7QUFBQSxRQUdBLGNBQWMsQ0FBQyxNQUFmLENBQXNCLFlBQXRCLENBSEEsQ0FBQTtlQUlBLE1BQUEsQ0FBTyxjQUFjLENBQUMsTUFBZixDQUFzQixVQUF0QixDQUFQLENBQXlDLENBQUMsV0FBMUMsQ0FBQSxFQUxvRDtNQUFBLENBQXRELEVBTm1CO0lBQUEsQ0FBckIsQ0F6REEsQ0FBQTtBQUFBLElBc0VBLFFBQUEsQ0FBUyxXQUFULEVBQXNCLFNBQUEsR0FBQTtBQUNwQixNQUFBLEVBQUEsQ0FBRyxzQ0FBSCxFQUEyQyxTQUFBLEdBQUE7QUFDekMsWUFBQSxXQUFBO0FBQUEsUUFBQSxXQUFBLEdBQWMsQ0FBZCxDQUFBO0FBQUEsUUFDQSxjQUFjLENBQUMsTUFBZixDQUFzQixJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBdEIsQ0FEQSxDQUFBO0FBQUEsUUFFQSxjQUFjLENBQUMsT0FBZixDQUF1QixTQUFBLEdBQUE7aUJBQUcsRUFBQSxZQUFIO1FBQUEsQ0FBdkIsQ0FGQSxDQUFBO2VBR0EsTUFBQSxDQUFPLFdBQVAsQ0FBbUIsQ0FBQyxJQUFwQixDQUF5QixDQUF6QixFQUp5QztNQUFBLENBQTNDLENBQUEsQ0FBQTthQUtBLEVBQUEsQ0FBRyw0Q0FBSCxFQUFpRCxTQUFBLEdBQUE7QUFDL0MsWUFBQSxXQUFBO0FBQUEsUUFBQSxXQUFBLEdBQWMsQ0FBZCxDQUFBO0FBQUEsUUFDQSxjQUFjLENBQUMsT0FBZixDQUF1QixTQUFBLEdBQUE7aUJBQUcsRUFBQSxZQUFIO1FBQUEsQ0FBdkIsQ0FEQSxDQUFBO0FBQUEsUUFFQSxjQUFjLENBQUMsTUFBZixDQUFzQixJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBdEIsQ0FGQSxDQUFBO2VBR0EsZUFBQSxDQUFnQixTQUFBLEdBQUE7aUJBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLHFCQUFwQixDQUEwQyxDQUFDLElBQTNDLENBQWdELFNBQUEsR0FBQTtBQUM5QyxZQUFBLGNBQWMsQ0FBQyxNQUFmLENBQXNCLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUF0QixDQUFBLENBQUE7bUJBQ0EsTUFBQSxDQUFPLFdBQVAsQ0FBbUIsQ0FBQyxJQUFwQixDQUF5QixDQUF6QixFQUY4QztVQUFBLENBQWhELEVBRGM7UUFBQSxDQUFoQixFQUorQztNQUFBLENBQWpELEVBTm9CO0lBQUEsQ0FBdEIsQ0F0RUEsQ0FBQTtXQXFGQSxRQUFBLENBQVMsc0JBQVQsRUFBaUMsU0FBQSxHQUFBO0FBQy9CLE1BQUEsRUFBQSxDQUFHLHVEQUFILEVBQTRELFNBQUEsR0FBQTtlQUMxRCxNQUFBLENBQU8sY0FBYyxDQUFDLGtCQUFmLENBQUEsQ0FBUCxDQUEyQyxDQUFDLGFBQTVDLENBQUEsRUFEMEQ7TUFBQSxDQUE1RCxDQUFBLENBQUE7YUFFQSxFQUFBLENBQUcsd0RBQUgsRUFBNkQsU0FBQSxHQUFBO0FBQzNELFFBQUEsY0FBYyxDQUFDLE1BQWYsQ0FBc0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBQXRCLENBQUEsQ0FBQTtlQUNBLE1BQUEsQ0FBTyxjQUFjLENBQUMsa0JBQWYsQ0FBQSxDQUFQLENBQTJDLENBQUMsV0FBNUMsQ0FBQSxFQUYyRDtNQUFBLENBQTdELEVBSCtCO0lBQUEsQ0FBakMsRUF0RjBCO0VBQUEsQ0FBNUIsQ0FBQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/ah/.atom/packages/linter/spec/editor-registry-spec.coffee
