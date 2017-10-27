(function() {
  describe('editor-registry', function() {
    var EditorRegistry, editorRegistry;
    EditorRegistry = require('../lib/editor-registry');
    editorRegistry = null;
    beforeEach(function() {
      waitsForPromise(function() {
        atom.workspace.destroyActivePaneItem();
        return atom.workspace.open('test.txt');
      });
      if (editorRegistry != null) {
        editorRegistry.deactivate();
      }
      return editorRegistry = new EditorRegistry;
    });
    describe('::create', function() {
      it('cries when invalid TextEditor was provided', function() {
        expect(function() {
          return editorRegistry.create();
        }).toThrow("Given editor isn't really an editor");
        return expect(function() {
          return editorRegistry.create(5);
        }).toThrow("Given editor isn't really an editor");
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
        return expect(editorRegistry.ofTextEditor("asd")).toBeUndefined();
      });
      return it('returns editorLinter when valid key is provided', function() {
        var activeEditor;
        activeEditor = atom.workspace.getActiveTextEditor();
        editorRegistry.create(activeEditor);
        return expect(editorRegistry.ofTextEditor(activeEditor)).toBeDefined();
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
