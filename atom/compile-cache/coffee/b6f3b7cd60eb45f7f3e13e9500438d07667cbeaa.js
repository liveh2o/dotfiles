(function() {
  var fs, path, temp;

  path = require('path');

  fs = require('fs-plus');

  temp = require('temp');

  describe("Whitespace", function() {
    var buffer, editor, workspaceElement, _ref;
    _ref = [], editor = _ref[0], buffer = _ref[1], workspaceElement = _ref[2];
    beforeEach(function() {
      var directory, filePath;
      directory = temp.mkdirSync();
      atom.project.setPaths([directory]);
      workspaceElement = atom.views.getView(atom.workspace);
      filePath = path.join(directory, 'atom-whitespace.txt');
      fs.writeFileSync(filePath, '');
      fs.writeFileSync(path.join(directory, 'sample.txt'), 'Some text.\n');
      waitsForPromise(function() {
        return atom.workspace.open(filePath).then(function(o) {
          return editor = o;
        });
      });
      runs(function() {
        return buffer = editor.getBuffer();
      });
      return waitsForPromise(function() {
        return atom.packages.activatePackage('whitespace');
      });
    });
    describe("when the editor is destroyed", function() {
      beforeEach(function() {
        return editor.destroy();
      });
      it("unsubscribes from the buffer", function() {
        buffer.setText("foo   \nbar\t   \n\nbaz");
        buffer.save();
        return expect(buffer.getText()).toBe("foo   \nbar\t   \n\nbaz");
      });
      return it("does not leak subscriptions", function() {
        var whitespace;
        whitespace = atom.packages.getActivePackage('whitespace').mainModule.whitespace;
        expect(whitespace.subscriptions.disposables.size).toBe(2);
        atom.packages.deactivatePackage('whitespace');
        return expect(whitespace.subscriptions.disposables).toBeNull();
      });
    });
    describe("when 'whitespace.removeTrailingWhitespace' is true", function() {
      beforeEach(function() {
        return atom.config.set("whitespace.removeTrailingWhitespace", true);
      });
      return it("strips trailing whitespace before an editor saves a buffer", function() {
        editor.insertText("foo   \nbar\t   \n\nbaz\n");
        editor.save();
        expect(editor.getText()).toBe("foo\nbar\n\nbaz\n");
        waitsForPromise(function() {
          return editor = atom.workspace.open('sample.txt').then(function(o) {
            return editor = o;
          });
        });
        return runs(function() {
          editor.moveToEndOfLine();
          editor.insertText("           ");
          editor.moveToBottom();
          editor.save();
          return expect(editor.getText()).toBe('Some text.\n');
        });
      });
    });
    describe("when 'whitespace.removeTrailingWhitespace' is false", function() {
      beforeEach(function() {
        return atom.config.set("whitespace.removeTrailingWhitespace", false);
      });
      it("does not trim trailing whitespace", function() {
        editor.insertText("don't trim me \n\n");
        editor.save();
        return expect(editor.getText()).toBe("don't trim me \n");
      });
      return describe("when the setting is set scoped to the grammar", function() {
        beforeEach(function() {
          atom.config.set("whitespace.removeTrailingWhitespace", true);
          return atom.config.set("whitespace.removeTrailingWhitespace", false, {
            scopeSelector: '.text.plain'
          });
        });
        return it("does not trim trailing whitespace", function() {
          editor.insertText("don't trim me \n\n");
          editor.save();
          return expect(editor.getText()).toBe("don't trim me \n");
        });
      });
    });
    describe("when 'whitespace.ignoreWhitespaceOnCurrentLine' is true", function() {
      beforeEach(function() {
        return atom.config.set("whitespace.ignoreWhitespaceOnCurrentLine", true);
      });
      return it("removes the whitespace from all lines, excluding the current lines", function() {
        editor.insertText("1  \n2  \n3  \n");
        editor.setCursorBufferPosition([1, 3]);
        editor.addCursorAtBufferPosition([2, 3]);
        editor.save();
        return expect(editor.getText()).toBe("1\n2  \n3  \n");
      });
    });
    describe("when 'whitespace.ignoreWhitespaceOnCurrentLine' is false", function() {
      beforeEach(function() {
        return atom.config.set("whitespace.ignoreWhitespaceOnCurrentLine", false);
      });
      return it("removes the whitespace from all lines, including the current lines", function() {
        editor.insertText("1  \n2  \n3  \n");
        editor.setCursorBufferPosition([1, 3]);
        editor.addCursorAtBufferPosition([2, 3]);
        editor.save();
        return expect(editor.getText()).toBe("1\n2\n3\n");
      });
    });
    describe("when 'whitespace.ignoreWhitespaceOnlyLines' is false", function() {
      beforeEach(function() {
        return atom.config.set("whitespace.ignoreWhitespaceOnlyLines", false);
      });
      return it("removes the whitespace from all lines, including the whitespace-only lines", function() {
        editor.insertText("1  \n2\t  \n\t \n3\n");
        editor.moveToBottom();
        editor.save();
        return expect(editor.getText()).toBe("1\n2\n\n3\n");
      });
    });
    describe("when 'whitespace.ignoreWhitespaceOnlyLines' is true", function() {
      beforeEach(function() {
        return atom.config.set("whitespace.ignoreWhitespaceOnlyLines", true);
      });
      return it("removes the whitespace from all lines, excluding the whitespace-only lines", function() {
        editor.insertText("1  \n2\t  \n\t \n3\n");
        editor.moveToBottom();
        editor.save();
        return expect(editor.getText()).toBe("1\n2\n\t \n3\n");
      });
    });
    describe("when 'whitespace.ensureSingleTrailingNewline' is true", function() {
      beforeEach(function() {
        return atom.config.set("whitespace.ensureSingleTrailingNewline", true);
      });
      it("adds a trailing newline when there is no trailing newline", function() {
        editor.insertText("foo");
        editor.save();
        return expect(editor.getText()).toBe("foo\n");
      });
      it("removes extra trailing newlines and only keeps one", function() {
        editor.insertText("foo\n\n\n\n");
        editor.save();
        return expect(editor.getText()).toBe("foo\n");
      });
      it("leaves a buffer with a single trailing newline untouched", function() {
        editor.insertText("foo\nbar\n");
        editor.save();
        return expect(editor.getText()).toBe("foo\nbar\n");
      });
      it("leaves an empty buffer untouched", function() {
        editor.insertText("");
        editor.save();
        return expect(editor.getText()).toBe("");
      });
      it("leaves a buffer that is a single newline untouched", function() {
        editor.insertText("\n");
        editor.save();
        return expect(editor.getText()).toBe("\n");
      });
      it("does not move the cursor when the new line is added", function() {
        editor.insertText("foo\nboo");
        editor.setCursorBufferPosition([0, 3]);
        editor.save();
        expect(editor.getText()).toBe("foo\nboo\n");
        return expect(editor.getCursorBufferPosition()).toEqual([0, 3]);
      });
      return it("preserves selections when saving on last line", function() {
        var newSelectionRange, originalSelectionRange;
        editor.insertText("foo");
        editor.setCursorBufferPosition([0, 0]);
        editor.selectToEndOfLine();
        originalSelectionRange = editor.getLastSelection().getBufferRange();
        editor.save();
        newSelectionRange = editor.getLastSelection().getBufferRange();
        return expect(originalSelectionRange).toEqual(newSelectionRange);
      });
    });
    describe("when 'whitespace.ensureSingleTrailingNewline' is false", function() {
      beforeEach(function() {
        return atom.config.set("whitespace.ensureSingleTrailingNewline", false);
      });
      return it("does not add trailing newline if ensureSingleTrailingNewline is false", function() {
        editor.insertText("no trailing newline");
        editor.save();
        return expect(editor.getText()).toBe("no trailing newline");
      });
    });
    describe("GFM whitespace trimming", function() {
      beforeEach(function() {
        atom.config.set("whitespace.ignoreWhitespaceOnCurrentLine", false);
        waitsForPromise(function() {
          return atom.packages.activatePackage("language-gfm");
        });
        return runs(function() {
          return editor.setGrammar(atom.grammars.grammarForScopeName("source.gfm"));
        });
      });
      it("trims GFM text with a single space", function() {
        editor.insertText("foo \nline break!");
        editor.save();
        return expect(editor.getText()).toBe("foo\nline break!\n");
      });
      it("leaves GFM text with double spaces alone", function() {
        editor.insertText("foo  \nline break!");
        editor.save();
        return expect(editor.getText()).toBe("foo  \nline break!\n");
      });
      it("trims GFM text with a more than two spaces", function() {
        editor.insertText("foo   \nline break!");
        editor.save();
        return expect(editor.getText()).toBe("foo\nline break!\n");
      });
      it("trims empty lines", function() {
        editor.insertText("foo\n  ");
        editor.save();
        expect(editor.getText()).toBe("foo\n");
        editor.setText("foo\n ");
        editor.save();
        return expect(editor.getText()).toBe("foo\n");
      });
      it("respects 'whitespace.ignoreWhitespaceOnCurrentLine' setting", function() {
        atom.config.set("whitespace.ignoreWhitespaceOnCurrentLine", true);
        editor.insertText("foo \nline break!");
        editor.setCursorBufferPosition([0, 4]);
        editor.save();
        return expect(editor.getText()).toBe("foo \nline break!\n");
      });
      return it("respects 'whitespace.ignoreWhitespaceOnlyLines' setting", function() {
        atom.config.set("whitespace.ignoreWhitespaceOnlyLines", true);
        editor.insertText("\t \nline break!");
        editor.save();
        return expect(editor.getText()).toBe("\t \nline break!\n");
      });
    });
    describe("when the editor is split", function() {
      return it("does not throw exceptions when the editor is saved after the split is closed (regression)", function() {
        atom.workspace.getActivePane().splitRight({
          copyActiveItem: true
        });
        atom.workspace.getPanes()[0].destroyItems();
        editor = atom.workspace.getActivePaneItem();
        editor.setText('test');
        expect(function() {
          return editor.save();
        }).not.toThrow();
        return expect(editor.getText()).toBe('test\n');
      });
    });
    describe("when deactivated", function() {
      return it("does not remove trailing whitespace from editors opened after deactivation", function() {
        atom.config.set("whitespace.removeTrailingWhitespace", true);
        atom.packages.deactivatePackage('whitespace');
        editor.setText("foo \n");
        editor.save();
        expect(editor.getText()).toBe("foo \n");
        waitsForPromise(function() {
          return atom.workspace.open('sample2.txt');
        });
        return runs(function() {
          editor = atom.workspace.getActiveTextEditor();
          editor.setText("foo \n");
          editor.save();
          return expect(editor.getText()).toBe("foo \n");
        });
      });
    });
    describe("when the 'whitespace:remove-trailing-whitespace' command is run", function() {
      beforeEach(function() {
        return buffer.setText("foo   \nbar\t   \n\nbaz");
      });
      it("removes the trailing whitespace in the active editor", function() {
        atom.commands.dispatch(workspaceElement, 'whitespace:remove-trailing-whitespace');
        return expect(buffer.getText()).toBe("foo\nbar\n\nbaz");
      });
      return it("does not attempt to remove whitespace when the package is deactivated", function() {
        atom.packages.deactivatePackage('whitespace');
        return expect(buffer.getText()).toBe("foo   \nbar\t   \n\nbaz");
      });
    });
    describe("when the 'whitespace:convert-tabs-to-spaces' command is run", function() {
      return it("removes all \t characters and replaces them with spaces using the configured tab length", function() {
        editor.setTabLength(2);
        buffer.setText('\ta\n\t\nb\t\nc\t\td');
        atom.commands.dispatch(workspaceElement, 'whitespace:convert-tabs-to-spaces');
        expect(buffer.getText()).toBe("  a\n  \nb  \nc    d");
        editor.setTabLength(3);
        buffer.setText('\ta\n\t\nb\t\nc\t\td');
        atom.commands.dispatch(workspaceElement, 'whitespace:convert-tabs-to-spaces');
        return expect(buffer.getText()).toBe("   a\n   \nb   \nc      d");
      });
    });
    return describe("when the 'whitespace:convert-spaces-to-tabs' command is run", function() {
      return it("removes all space characters and replaces them with hard tabs", function() {
        editor.setTabLength(2);
        buffer.setText("  a\n  \nb  \nc    d");
        atom.commands.dispatch(workspaceElement, 'whitespace:convert-spaces-to-tabs');
        expect(buffer.getText()).toBe('\ta\n\t\nb\t\nc\t\td');
        editor.setTabLength(3);
        return buffer.setText("   a\n   \nb   \nc      d", atom.commands.dispatch(workspaceElement, 'whitespace:convert-spaces-to-tabs'), expect(buffer.getText()).toBe('\ta\n\t\nb\t\nc\t\td'));
      });
    });
  });

}).call(this);
