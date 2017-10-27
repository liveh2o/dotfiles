(function() {
  describe('editor-linter', function() {
    var EditorLinter, editorLinter, textEditor;
    EditorLinter = require('../lib/editor-linter');
    editorLinter = null;
    textEditor = null;
    beforeEach(function() {
      return waitsForPromise(function() {
        atom.workspace.destroyActivePaneItem();
        return atom.workspace.open('/tmp/test.txt').then(function() {
          if (editorLinter != null) {
            editorLinter.dispose();
          }
          textEditor = atom.workspace.getActiveTextEditor();
          return editorLinter = new EditorLinter(textEditor);
        });
      });
    });
    describe('::constructor', function() {
      return it("cries when provided argument isn't a TextEditor", function() {
        expect(function() {
          return new EditorLinter;
        }).toThrow("Given editor isn't really an editor");
        expect(function() {
          return new EditorLinter(null);
        }).toThrow("Given editor isn't really an editor");
        return expect(function() {
          return new EditorLinter(55);
        }).toThrow("Given editor isn't really an editor");
      });
    });
    describe('::onShouldLint', function() {
      return it('ignores instant save requests', function() {
        var timesTriggered;
        timesTriggered = 0;
        editorLinter.onShouldLint(function() {
          return timesTriggered++;
        });
        textEditor.save();
        textEditor.save();
        textEditor.save();
        textEditor.save();
        textEditor.save();
        return expect(timesTriggered).toBe(5);
      });
    });
    return describe('::onDidDestroy', function() {
      return it('is called when TextEditor is destroyed', function() {
        var didDestroy;
        didDestroy = false;
        editorLinter.onDidDestroy(function() {
          return didDestroy = true;
        });
        textEditor.destroy();
        return expect(didDestroy).toBe(true);
      });
    });
  });

}).call(this);
