(function() {
  var fs, path, temp;

  path = require('path');

  fs = require('fs-plus');

  temp = require('temp');

  describe("Whitespace", function() {
    var buffer, editor, ref, workspaceElement;
    ref = [], editor = ref[0], buffer = ref[1], workspaceElement = ref[2];
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
      it("strips trailing whitespace before an editor saves a buffer", function() {
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
      it("works for files with CRLF line endings", function() {
        editor.insertText("foo   \r\nbar\t   \r\n\r\nbaz\r\n");
        editor.save();
        return expect(editor.getText()).toBe("foo\r\nbar\r\n\r\nbaz\r\n");
      });
      return it("clears blank lines when the editor inserts a newline", function() {
        atom.config.set('editor.autoIndent', true);
        editor.setIndentationForBufferRow(0, 1);
        editor.insertText('\n');
        expect(editor.getText()).toBe('\n  ');
        editor.undo();
        expect(editor.getText()).toBe('  ');
        editor.redo();
        expect(editor.getText()).toBe('\n  ');
        editor.insertText('foo');
        editor.insertText('\n');
        editor.setCursorBufferPosition([1, 5]);
        editor.addCursorAtBufferPosition([2, 2]);
        editor.insertText('\n');
        return expect(editor.getText()).toBe('\n  foo\n  \n\n  ');
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
      describe('when keepMarkdownLineBreakWhitespace is true', function() {
        beforeEach(function() {
          atom.config.set("whitespace.removeTrailingWhitespace", true);
          atom.config.set("whitespace.ignoreWhitespaceOnCurrentLine", false);
          atom.config.set("whitespace.keepMarkdownLineBreakWhitespace", true);
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
        it("leaves GFM text with a more than two spaces", function() {
          editor.insertText("foo   \nline break!");
          editor.save();
          return expect(editor.getText()).toBe("foo   \nline break!\n");
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
      return describe('when keepMarkdownLineBreakWhitespace is false', function() {
        beforeEach(function() {
          atom.config.set("whitespace.ignoreWhitespaceOnCurrentLine", false);
          atom.config.set("whitespace.keepMarkdownLineBreakWhitespace", false);
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
        it("trims GFM text with two spaces", function() {
          editor.insertText("foo  \nline break!");
          editor.save();
          return expect(editor.getText()).toBe("foo\nline break!\n");
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
    describe("when the 'whitespace:save-with-trailing-whitespace' command is run", function() {
      beforeEach(function() {
        atom.config.set("whitespace.removeTrailingWhitespace", true);
        atom.config.set("whitespace.ensureSingleTrailingNewline", false);
        return buffer.setText("foo   \nbar\t   \n\nbaz");
      });
      return it("saves the file without removing any trailing whitespace", function() {
        return waitsFor(function(done) {
          buffer.onDidSave(function() {
            expect(buffer.getText()).toBe("foo   \nbar\t   \n\nbaz");
            expect(buffer.isModified()).toBe(false);
            return done();
          });
          return atom.commands.dispatch(workspaceElement, 'whitespace:save-with-trailing-whitespace');
        });
      });
    });
    describe("when the 'whitespace:save-without-trailing-whitespace' command is run", function() {
      beforeEach(function() {
        atom.config.set("whitespace.removeTrailingWhitespace", false);
        atom.config.set("whitespace.ensureSingleTrailingNewline", false);
        return buffer.setText("foo   \nbar\t   \n\nbaz");
      });
      return it("saves the file and removes any trailing whitespace", function() {
        return waitsFor(function(done) {
          buffer.onDidSave(function() {
            expect(buffer.getText()).toBe("foo\nbar\n\nbaz");
            expect(buffer.isModified()).toBe(false);
            return done();
          });
          return atom.commands.dispatch(workspaceElement, 'whitespace:save-without-trailing-whitespace');
        });
      });
    });
    describe("when the 'whitespace:convert-tabs-to-spaces' command is run", function() {
      it("removes leading \\t characters and replaces them with spaces using the configured tab length", function() {
        editor.setTabLength(2);
        buffer.setText('\ta\n\t\nb\t\nc\t\td');
        atom.commands.dispatch(workspaceElement, 'whitespace:convert-tabs-to-spaces');
        expect(buffer.getText()).toBe("  a\n  \nb\t\nc\t\td");
        editor.setTabLength(3);
        buffer.setText('\ta\n\t\nb\t\nc\t\td');
        atom.commands.dispatch(workspaceElement, 'whitespace:convert-tabs-to-spaces');
        return expect(buffer.getText()).toBe("   a\n   \nb\t\nc\t\td");
      });
      return it("changes the tab type to soft tabs", function() {
        atom.commands.dispatch(workspaceElement, 'whitespace:convert-tabs-to-spaces');
        return expect(editor.getSoftTabs()).toBe(true);
      });
    });
    describe("when the 'whitespace:convert-spaces-to-tabs' command is run", function() {
      it("removes leading space characters and replaces them with hard tabs", function() {
        editor.setTabLength(2);
        buffer.setText("   a\n  \nb  \nc    d");
        atom.commands.dispatch(workspaceElement, 'whitespace:convert-spaces-to-tabs');
        expect(buffer.getText()).toBe('\t a\n\t\nb  \nc    d');
        editor.setTabLength(3);
        buffer.setText("     a\n   \nb   \nc      d");
        atom.commands.dispatch(workspaceElement, 'whitespace:convert-spaces-to-tabs');
        return expect(buffer.getText()).toBe('\t  a\n\t\nb   \nc      d');
      });
      it("handles mixed runs of tabs and spaces correctly", function() {
        editor.setTabLength(4);
        buffer.setText("     \t    \t\ta   ");
        atom.commands.dispatch(workspaceElement, 'whitespace:convert-spaces-to-tabs');
        return expect(buffer.getText()).toBe("\t\t\t\t\ta   ");
      });
      it("changes the tab type to hard tabs", function() {
        atom.commands.dispatch(workspaceElement, 'whitespace:convert-spaces-to-tabs');
        return expect(editor.getSoftTabs()).toBe(false);
      });
      return it("changes the tab length to user's tab-size", function() {
        editor.setTabLength(4);
        buffer.setText("    ");
        atom.commands.dispatch(workspaceElement, 'whitespace:convert-spaces-to-tabs');
        return expect(editor.getTabLength()).toBe(2);
      });
    });
    return describe("when the 'whitespace:convert-all-tabs-to-spaces' command is run", function() {
      it("removes all \\t characters and replaces them with spaces using the configured tab length", function() {
        editor.setTabLength(2);
        buffer.setText('\ta\n\t\nb\t\nc\t\td');
        atom.commands.dispatch(workspaceElement, 'whitespace:convert-all-tabs-to-spaces');
        expect(buffer.getText()).toBe("  a\n  \nb  \nc    d");
        editor.setTabLength(3);
        buffer.setText('\ta\n\t\nb\t\nc\t\td');
        atom.commands.dispatch(workspaceElement, 'whitespace:convert-all-tabs-to-spaces');
        return expect(buffer.getText()).toBe("   a\n   \nb   \nc      d");
      });
      return it("changes the tab type to soft tabs", function() {
        atom.commands.dispatch(workspaceElement, 'whitespace:convert-all-tabs-to-spaces');
        return expect(editor.getSoftTabs()).toBe(true);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3doaXRlc3BhY2Uvc3BlYy93aGl0ZXNwYWNlLXNwZWMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSOztFQUNMLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFFUCxRQUFBLENBQVMsWUFBVCxFQUF1QixTQUFBO0FBQ3JCLFFBQUE7SUFBQSxNQUFxQyxFQUFyQyxFQUFDLGVBQUQsRUFBUyxlQUFULEVBQWlCO0lBRWpCLFVBQUEsQ0FBVyxTQUFBO0FBQ1QsVUFBQTtNQUFBLFNBQUEsR0FBWSxJQUFJLENBQUMsU0FBTCxDQUFBO01BQ1osSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQXNCLENBQUMsU0FBRCxDQUF0QjtNQUNBLGdCQUFBLEdBQW1CLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixJQUFJLENBQUMsU0FBeEI7TUFDbkIsUUFBQSxHQUFXLElBQUksQ0FBQyxJQUFMLENBQVUsU0FBVixFQUFxQixxQkFBckI7TUFDWCxFQUFFLENBQUMsYUFBSCxDQUFpQixRQUFqQixFQUEyQixFQUEzQjtNQUNBLEVBQUUsQ0FBQyxhQUFILENBQWlCLElBQUksQ0FBQyxJQUFMLENBQVUsU0FBVixFQUFxQixZQUFyQixDQUFqQixFQUFxRCxjQUFyRDtNQUVBLGVBQUEsQ0FBZ0IsU0FBQTtlQUNkLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixRQUFwQixDQUE2QixDQUFDLElBQTlCLENBQW1DLFNBQUMsQ0FBRDtpQkFBTyxNQUFBLEdBQVM7UUFBaEIsQ0FBbkM7TUFEYyxDQUFoQjtNQUdBLElBQUEsQ0FBSyxTQUFBO2VBQ0gsTUFBQSxHQUFTLE1BQU0sQ0FBQyxTQUFQLENBQUE7TUFETixDQUFMO2FBR0Es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LENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QiwyQkFBOUI7TUFUNkYsQ0FBL0Y7YUFXQSxFQUFBLENBQUcsbUNBQUgsRUFBd0MsU0FBQTtRQUN0QyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsZ0JBQXZCLEVBQXlDLHVDQUF6QztlQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsV0FBUCxDQUFBLENBQVAsQ0FBNEIsQ0FBQyxJQUE3QixDQUFrQyxJQUFsQztNQUZzQyxDQUF4QztJQVowRSxDQUE1RTtFQS9acUIsQ0FBdkI7QUFKQSIsInNvdXJjZXNDb250ZW50IjpbInBhdGggPSByZXF1aXJlICdwYXRoJ1xuZnMgPSByZXF1aXJlICdmcy1wbHVzJ1xudGVtcCA9IHJlcXVpcmUgJ3RlbXAnXG5cbmRlc2NyaWJlIFwiV2hpdGVzcGFjZVwiLCAtPlxuICBbZWRpdG9yLCBidWZmZXIsIHdvcmtzcGFjZUVsZW1lbnRdID0gW11cblxuICBiZWZvcmVFYWNoIC0+XG4gICAgZGlyZWN0b3J5ID0gdGVtcC5ta2RpclN5bmMoKVxuICAgIGF0b20ucHJvamVjdC5zZXRQYXRocyhbZGlyZWN0b3J5XSlcbiAgICB3b3Jrc3BhY2VFbGVtZW50ID0gYXRvbS52aWV3cy5nZXRWaWV3KGF0b20ud29ya3NwYWNlKVxuICAgIGZpbGVQYXRoID0gcGF0aC5qb2luKGRpcmVjdG9yeSwgJ2F0b20td2hpdGVzcGFjZS50eHQnKVxuICAgIGZzLndyaXRlRmlsZVN5bmMoZmlsZVBhdGgsICcnKVxuICAgIGZzLndyaXRlRmlsZVN5bmMocGF0aC5qb2luKGRpcmVjdG9yeSwgJ3NhbXBsZS50eHQnKSwgJ1NvbWUgdGV4dC5cXG4nKVxuXG4gICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKGZpbGVQYXRoKS50aGVuIChvKSAtPiBlZGl0b3IgPSBvXG5cbiAgICBydW5zIC0+XG4gICAgICBidWZmZXIgPSBlZGl0b3IuZ2V0QnVmZmVyKClcblxuICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoJ3doaXRlc3BhY2UnKVxuXG4gIGRlc2NyaWJlIFwid2hlbiB0aGUgZWRpdG9yIGlzIGRlc3Ryb3llZFwiLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIGVkaXRvci5kZXN0cm95KClcblxuICAgIGl0IFwiZG9lcyBub3QgbGVhayBzdWJzY3JpcHRpb25zXCIsIC0+XG4gICAgICB7d2hpdGVzcGFjZX0gPSBhdG9tLnBhY2thZ2VzLmdldEFjdGl2ZVBhY2thZ2UoJ3doaXRlc3BhY2UnKS5tYWluTW9kdWxlXG4gICAgICBleHBlY3Qod2hpdGVzcGFjZS5zdWJzY3JpcHRpb25zLmRpc3Bvc2FibGVzLnNpemUpLnRvQmUgMlxuXG4gICAgICBhdG9tLnBhY2thZ2VzLmRlYWN0aXZhdGVQYWNrYWdlKCd3aGl0ZXNwYWNlJylcbiAgICAgIGV4cGVjdCh3aGl0ZXNwYWNlLnN1YnNjcmlwdGlvbnMuZGlzcG9zYWJsZXMpLnRvQmVOdWxsKClcblxuICBkZXNjcmliZSBcIndoZW4gJ3doaXRlc3BhY2UucmVtb3ZlVHJhaWxpbmdXaGl0ZXNwYWNlJyBpcyB0cnVlXCIsIC0+XG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgYXRvbS5jb25maWcuc2V0KFwid2hpdGVzcGFjZS5yZW1vdmVUcmFpbGluZ1doaXRlc3BhY2VcIiwgdHJ1ZSlcblxuICAgIGl0IFwic3RyaXBzIHRyYWlsaW5nIHdoaXRlc3BhY2UgYmVmb3JlIGFuIGVkaXRvciBzYXZlcyBhIGJ1ZmZlclwiLCAtPlxuICAgICAgIyB3b3JrcyBmb3IgYnVmZmVycyB0aGF0IGFyZSBhbHJlYWR5IG9wZW4gd2hlbiBwYWNrYWdlIGlzIGluaXRpYWxpemVkXG4gICAgICBlZGl0b3IuaW5zZXJ0VGV4dChcImZvbyAgIFxcbmJhclxcdCAgIFxcblxcbmJhelxcblwiKVxuICAgICAgZWRpdG9yLnNhdmUoKVxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCJmb29cXG5iYXJcXG5cXG5iYXpcXG5cIlxuXG4gICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgIyB3b3JrcyBmb3IgYnVmZmVycyB0aGF0IGFyZSBvcGVuZWQgYWZ0ZXIgcGFja2FnZSBpcyBpbml0aWFsaXplZFxuICAgICAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5vcGVuKCdzYW1wbGUudHh0JykudGhlbiAobykgLT4gZWRpdG9yID0gb1xuXG4gICAgICBydW5zIC0+XG4gICAgICAgIGVkaXRvci5tb3ZlVG9FbmRPZkxpbmUoKVxuICAgICAgICBlZGl0b3IuaW5zZXJ0VGV4dChcIiAgICAgICAgICAgXCIpXG5cbiAgICAgICAgIyBtb3ZlIGN1cnNvciB0byBuZXh0IGxpbmUgdG8gYXZvaWQgaWdub3JlV2hpdGVzcGFjZU9uQ3VycmVudExpbmVcbiAgICAgICAgZWRpdG9yLm1vdmVUb0JvdHRvbSgpXG5cbiAgICAgICAgZWRpdG9yLnNhdmUoKVxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSAnU29tZSB0ZXh0LlxcbidcblxuICAgIGl0IFwid29ya3MgZm9yIGZpbGVzIHdpdGggQ1JMRiBsaW5lIGVuZGluZ3NcIiwgLT5cbiAgICAgIGVkaXRvci5pbnNlcnRUZXh0KFwiZm9vICAgXFxyXFxuYmFyXFx0ICAgXFxyXFxuXFxyXFxuYmF6XFxyXFxuXCIpXG4gICAgICBlZGl0b3Iuc2F2ZSgpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSBcImZvb1xcclxcbmJhclxcclxcblxcclxcbmJhelxcclxcblwiXG5cbiAgICBpdCBcImNsZWFycyBibGFuayBsaW5lcyB3aGVuIHRoZSBlZGl0b3IgaW5zZXJ0cyBhIG5ld2xpbmVcIiwgLT5cbiAgICAgICMgTmVlZCBhdXRvSW5kZW50IHRvIGJlIHRydWVcbiAgICAgIGF0b20uY29uZmlnLnNldCAnZWRpdG9yLmF1dG9JbmRlbnQnLCB0cnVlXG4gICAgICAjIENyZWF0ZSBhbiBpbmRlbnQgbGV2ZWwgYW5kIGluc2VydCBhIG5ld2xpbmVcbiAgICAgIGVkaXRvci5zZXRJbmRlbnRhdGlvbkZvckJ1ZmZlclJvdyAwLCAxXG4gICAgICBlZGl0b3IuaW5zZXJ0VGV4dCAnXFxuJ1xuICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgJ1xcbiAgJ1xuXG4gICAgICAjIFVuZG8gdGhlIG5ld2xpbmUgaW5zZXJ0IGFuZCByZWRvIGl0XG4gICAgICBlZGl0b3IudW5kbygpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSAnICAnXG4gICAgICBlZGl0b3IucmVkbygpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSAnXFxuICAnXG5cbiAgICAgICMgVGVzdCBmb3IgbXVsdGlwbGUgY3Vyc29ycywgcG9zc2libHkgd2l0aG91dCBibGFuayBsaW5lc1xuICAgICAgZWRpdG9yLmluc2VydFRleHQgJ2ZvbydcbiAgICAgIGVkaXRvci5pbnNlcnRUZXh0ICdcXG4nXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24gWzEsIDVdICAgICMgQ3Vyc29yIGFmdGVyICdmb28nXG4gICAgICBlZGl0b3IuYWRkQ3Vyc29yQXRCdWZmZXJQb3NpdGlvbiBbMiwgMl0gICMgQ3Vyc29yIG9uIHRoZSBuZXh0IGxpbmUgKGJsYW5rKVxuICAgICAgZWRpdG9yLmluc2VydFRleHQgJ1xcbidcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlICdcXG4gIGZvb1xcbiAgXFxuXFxuICAnXG5cbiAgZGVzY3JpYmUgXCJ3aGVuICd3aGl0ZXNwYWNlLnJlbW92ZVRyYWlsaW5nV2hpdGVzcGFjZScgaXMgZmFsc2VcIiwgLT5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBhdG9tLmNvbmZpZy5zZXQoXCJ3aGl0ZXNwYWNlLnJlbW92ZVRyYWlsaW5nV2hpdGVzcGFjZVwiLCBmYWxzZSlcblxuICAgIGl0IFwiZG9lcyBub3QgdHJpbSB0cmFpbGluZyB3aGl0ZXNwYWNlXCIsIC0+XG4gICAgICBlZGl0b3IuaW5zZXJ0VGV4dCBcImRvbid0IHRyaW0gbWUgXFxuXFxuXCJcbiAgICAgIGVkaXRvci5zYXZlKClcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiZG9uJ3QgdHJpbSBtZSBcXG5cIlxuXG4gICAgZGVzY3JpYmUgXCJ3aGVuIHRoZSBzZXR0aW5nIGlzIHNldCBzY29wZWQgdG8gdGhlIGdyYW1tYXJcIiwgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgYXRvbS5jb25maWcuc2V0KFwid2hpdGVzcGFjZS5yZW1vdmVUcmFpbGluZ1doaXRlc3BhY2VcIiwgdHJ1ZSlcbiAgICAgICAgYXRvbS5jb25maWcuc2V0KFwid2hpdGVzcGFjZS5yZW1vdmVUcmFpbGluZ1doaXRlc3BhY2VcIiwgZmFsc2UsIHNjb3BlU2VsZWN0b3I6ICcudGV4dC5wbGFpbicpXG5cbiAgICAgIGl0IFwiZG9lcyBub3QgdHJpbSB0cmFpbGluZyB3aGl0ZXNwYWNlXCIsIC0+XG4gICAgICAgIGVkaXRvci5pbnNlcnRUZXh0IFwiZG9uJ3QgdHJpbSBtZSBcXG5cXG5cIlxuICAgICAgICBlZGl0b3Iuc2F2ZSgpXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiZG9uJ3QgdHJpbSBtZSBcXG5cIlxuXG4gIGRlc2NyaWJlIFwid2hlbiAnd2hpdGVzcGFjZS5pZ25vcmVXaGl0ZXNwYWNlT25DdXJyZW50TGluZScgaXMgdHJ1ZVwiLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIGF0b20uY29uZmlnLnNldChcIndoaXRlc3BhY2UuaWdub3JlV2hpdGVzcGFjZU9uQ3VycmVudExpbmVcIiwgdHJ1ZSlcblxuICAgIGl0IFwicmVtb3ZlcyB0aGUgd2hpdGVzcGFjZSBmcm9tIGFsbCBsaW5lcywgZXhjbHVkaW5nIHRoZSBjdXJyZW50IGxpbmVzXCIsIC0+XG4gICAgICBlZGl0b3IuaW5zZXJ0VGV4dCBcIjEgIFxcbjIgIFxcbjMgIFxcblwiXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzEsIDNdKVxuICAgICAgZWRpdG9yLmFkZEN1cnNvckF0QnVmZmVyUG9zaXRpb24oWzIsIDNdKVxuICAgICAgZWRpdG9yLnNhdmUoKVxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCIxXFxuMiAgXFxuMyAgXFxuXCJcblxuICBkZXNjcmliZSBcIndoZW4gJ3doaXRlc3BhY2UuaWdub3JlV2hpdGVzcGFjZU9uQ3VycmVudExpbmUnIGlzIGZhbHNlXCIsIC0+XG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgYXRvbS5jb25maWcuc2V0KFwid2hpdGVzcGFjZS5pZ25vcmVXaGl0ZXNwYWNlT25DdXJyZW50TGluZVwiLCBmYWxzZSlcblxuICAgIGl0IFwicmVtb3ZlcyB0aGUgd2hpdGVzcGFjZSBmcm9tIGFsbCBsaW5lcywgaW5jbHVkaW5nIHRoZSBjdXJyZW50IGxpbmVzXCIsIC0+XG4gICAgICBlZGl0b3IuaW5zZXJ0VGV4dCBcIjEgIFxcbjIgIFxcbjMgIFxcblwiXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzEsIDNdKVxuICAgICAgZWRpdG9yLmFkZEN1cnNvckF0QnVmZmVyUG9zaXRpb24oWzIsIDNdKVxuICAgICAgZWRpdG9yLnNhdmUoKVxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCIxXFxuMlxcbjNcXG5cIlxuXG4gIGRlc2NyaWJlIFwid2hlbiAnd2hpdGVzcGFjZS5pZ25vcmVXaGl0ZXNwYWNlT25seUxpbmVzJyBpcyBmYWxzZVwiLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIGF0b20uY29uZmlnLnNldChcIndoaXRlc3BhY2UuaWdub3JlV2hpdGVzcGFjZU9ubHlMaW5lc1wiLCBmYWxzZSlcblxuICAgIGl0IFwicmVtb3ZlcyB0aGUgd2hpdGVzcGFjZSBmcm9tIGFsbCBsaW5lcywgaW5jbHVkaW5nIHRoZSB3aGl0ZXNwYWNlLW9ubHkgbGluZXNcIiwgLT5cbiAgICAgIGVkaXRvci5pbnNlcnRUZXh0IFwiMSAgXFxuMlxcdCAgXFxuXFx0IFxcbjNcXG5cIlxuXG4gICAgICAjIG1vdmUgY3Vyc29yIHRvIGJvdHRvbSBmb3IgcHJldmVudGluZyBlZmZlY3Qgb2Ygd2hpdGVzcGFjZS5pZ25vcmVXaGl0ZXNwYWNlT25DdXJyZW50TGluZVxuICAgICAgZWRpdG9yLm1vdmVUb0JvdHRvbSgpXG4gICAgICBlZGl0b3Iuc2F2ZSgpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSBcIjFcXG4yXFxuXFxuM1xcblwiXG5cbiAgZGVzY3JpYmUgXCJ3aGVuICd3aGl0ZXNwYWNlLmlnbm9yZVdoaXRlc3BhY2VPbmx5TGluZXMnIGlzIHRydWVcIiwgLT5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBhdG9tLmNvbmZpZy5zZXQoXCJ3aGl0ZXNwYWNlLmlnbm9yZVdoaXRlc3BhY2VPbmx5TGluZXNcIiwgdHJ1ZSlcblxuICAgIGl0IFwicmVtb3ZlcyB0aGUgd2hpdGVzcGFjZSBmcm9tIGFsbCBsaW5lcywgZXhjbHVkaW5nIHRoZSB3aGl0ZXNwYWNlLW9ubHkgbGluZXNcIiwgLT5cbiAgICAgIGVkaXRvci5pbnNlcnRUZXh0IFwiMSAgXFxuMlxcdCAgXFxuXFx0IFxcbjNcXG5cIlxuXG4gICAgICAjIG1vdmUgY3Vyc29yIHRvIGJvdHRvbSBmb3IgcHJldmVudGluZyBlZmZlY3Qgb2Ygd2hpdGVzcGFjZS5pZ25vcmVXaGl0ZXNwYWNlT25DdXJyZW50TGluZVxuICAgICAgZWRpdG9yLm1vdmVUb0JvdHRvbSgpXG4gICAgICBlZGl0b3Iuc2F2ZSgpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSBcIjFcXG4yXFxuXFx0IFxcbjNcXG5cIlxuXG4gIGRlc2NyaWJlIFwid2hlbiAnd2hpdGVzcGFjZS5lbnN1cmVTaW5nbGVUcmFpbGluZ05ld2xpbmUnIGlzIHRydWVcIiwgLT5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBhdG9tLmNvbmZpZy5zZXQoXCJ3aGl0ZXNwYWNlLmVuc3VyZVNpbmdsZVRyYWlsaW5nTmV3bGluZVwiLCB0cnVlKVxuXG4gICAgaXQgXCJhZGRzIGEgdHJhaWxpbmcgbmV3bGluZSB3aGVuIHRoZXJlIGlzIG5vIHRyYWlsaW5nIG5ld2xpbmVcIiwgLT5cbiAgICAgIGVkaXRvci5pbnNlcnRUZXh0IFwiZm9vXCJcbiAgICAgIGVkaXRvci5zYXZlKClcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiZm9vXFxuXCJcblxuICAgIGl0IFwicmVtb3ZlcyBleHRyYSB0cmFpbGluZyBuZXdsaW5lcyBhbmQgb25seSBrZWVwcyBvbmVcIiwgLT5cbiAgICAgIGVkaXRvci5pbnNlcnRUZXh0IFwiZm9vXFxuXFxuXFxuXFxuXCJcbiAgICAgIGVkaXRvci5zYXZlKClcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiZm9vXFxuXCJcblxuICAgIGl0IFwibGVhdmVzIGEgYnVmZmVyIHdpdGggYSBzaW5nbGUgdHJhaWxpbmcgbmV3bGluZSB1bnRvdWNoZWRcIiwgLT5cbiAgICAgIGVkaXRvci5pbnNlcnRUZXh0IFwiZm9vXFxuYmFyXFxuXCJcbiAgICAgIGVkaXRvci5zYXZlKClcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiZm9vXFxuYmFyXFxuXCJcblxuICAgIGl0IFwibGVhdmVzIGFuIGVtcHR5IGJ1ZmZlciB1bnRvdWNoZWRcIiwgLT5cbiAgICAgIGVkaXRvci5pbnNlcnRUZXh0IFwiXCJcbiAgICAgIGVkaXRvci5zYXZlKClcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiXCJcblxuICAgIGl0IFwibGVhdmVzIGEgYnVmZmVyIHRoYXQgaXMgYSBzaW5nbGUgbmV3bGluZSB1bnRvdWNoZWRcIiwgLT5cbiAgICAgIGVkaXRvci5pbnNlcnRUZXh0IFwiXFxuXCJcbiAgICAgIGVkaXRvci5zYXZlKClcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiXFxuXCJcblxuICAgIGl0IFwiZG9lcyBub3QgbW92ZSB0aGUgY3Vyc29yIHdoZW4gdGhlIG5ldyBsaW5lIGlzIGFkZGVkXCIsIC0+XG4gICAgICBlZGl0b3IuaW5zZXJ0VGV4dCBcImZvb1xcbmJvb1wiXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzAsIDNdKVxuICAgICAgZWRpdG9yLnNhdmUoKVxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCJmb29cXG5ib29cXG5cIlxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpKS50b0VxdWFsKFswLCAzXSlcblxuICAgIGl0IFwicHJlc2VydmVzIHNlbGVjdGlvbnMgd2hlbiBzYXZpbmcgb24gbGFzdCBsaW5lXCIsIC0+XG4gICAgICBlZGl0b3IuaW5zZXJ0VGV4dCBcImZvb1wiXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzAsIDBdKVxuICAgICAgZWRpdG9yLnNlbGVjdFRvRW5kT2ZMaW5lKClcbiAgICAgIG9yaWdpbmFsU2VsZWN0aW9uUmFuZ2UgPSBlZGl0b3IuZ2V0TGFzdFNlbGVjdGlvbigpLmdldEJ1ZmZlclJhbmdlKClcbiAgICAgIGVkaXRvci5zYXZlKClcbiAgICAgIG5ld1NlbGVjdGlvblJhbmdlID0gZWRpdG9yLmdldExhc3RTZWxlY3Rpb24oKS5nZXRCdWZmZXJSYW5nZSgpXG4gICAgICBleHBlY3Qob3JpZ2luYWxTZWxlY3Rpb25SYW5nZSkudG9FcXVhbChuZXdTZWxlY3Rpb25SYW5nZSlcblxuICBkZXNjcmliZSBcIndoZW4gJ3doaXRlc3BhY2UuZW5zdXJlU2luZ2xlVHJhaWxpbmdOZXdsaW5lJyBpcyBmYWxzZVwiLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIGF0b20uY29uZmlnLnNldChcIndoaXRlc3BhY2UuZW5zdXJlU2luZ2xlVHJhaWxpbmdOZXdsaW5lXCIsIGZhbHNlKVxuXG4gICAgaXQgXCJkb2VzIG5vdCBhZGQgdHJhaWxpbmcgbmV3bGluZSBpZiBlbnN1cmVTaW5nbGVUcmFpbGluZ05ld2xpbmUgaXMgZmFsc2VcIiwgLT5cbiAgICAgIGVkaXRvci5pbnNlcnRUZXh0IFwibm8gdHJhaWxpbmcgbmV3bGluZVwiXG4gICAgICBlZGl0b3Iuc2F2ZSgpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSBcIm5vIHRyYWlsaW5nIG5ld2xpbmVcIlxuXG4gIGRlc2NyaWJlIFwiR0ZNIHdoaXRlc3BhY2UgdHJpbW1pbmdcIiwgLT5cbiAgICBkZXNjcmliZSAnd2hlbiBrZWVwTWFya2Rvd25MaW5lQnJlYWtXaGl0ZXNwYWNlIGlzIHRydWUnLCAtPlxuICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoXCJ3aGl0ZXNwYWNlLnJlbW92ZVRyYWlsaW5nV2hpdGVzcGFjZVwiLCB0cnVlKVxuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoXCJ3aGl0ZXNwYWNlLmlnbm9yZVdoaXRlc3BhY2VPbkN1cnJlbnRMaW5lXCIsIGZhbHNlKVxuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoXCJ3aGl0ZXNwYWNlLmtlZXBNYXJrZG93bkxpbmVCcmVha1doaXRlc3BhY2VcIiwgdHJ1ZSlcblxuICAgICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgICBhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZShcImxhbmd1YWdlLWdmbVwiKVxuXG4gICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICBlZGl0b3Iuc2V0R3JhbW1hcihhdG9tLmdyYW1tYXJzLmdyYW1tYXJGb3JTY29wZU5hbWUoXCJzb3VyY2UuZ2ZtXCIpKVxuXG4gICAgICBpdCBcInRyaW1zIEdGTSB0ZXh0IHdpdGggYSBzaW5nbGUgc3BhY2VcIiwgLT5cbiAgICAgICAgZWRpdG9yLmluc2VydFRleHQgXCJmb28gXFxubGluZSBicmVhayFcIlxuICAgICAgICBlZGl0b3Iuc2F2ZSgpXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiZm9vXFxubGluZSBicmVhayFcXG5cIlxuXG4gICAgICBpdCBcImxlYXZlcyBHRk0gdGV4dCB3aXRoIGRvdWJsZSBzcGFjZXMgYWxvbmVcIiwgLT5cbiAgICAgICAgZWRpdG9yLmluc2VydFRleHQgXCJmb28gIFxcbmxpbmUgYnJlYWshXCJcbiAgICAgICAgZWRpdG9yLnNhdmUoKVxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSBcImZvbyAgXFxubGluZSBicmVhayFcXG5cIlxuXG4gICAgICBpdCBcImxlYXZlcyBHRk0gdGV4dCB3aXRoIGEgbW9yZSB0aGFuIHR3byBzcGFjZXNcIiwgLT5cbiAgICAgICAgZWRpdG9yLmluc2VydFRleHQgXCJmb28gICBcXG5saW5lIGJyZWFrIVwiXG4gICAgICAgIGVkaXRvci5zYXZlKClcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCJmb28gICBcXG5saW5lIGJyZWFrIVxcblwiXG5cbiAgICAgIGl0IFwidHJpbXMgZW1wdHkgbGluZXNcIiwgLT5cbiAgICAgICAgZWRpdG9yLmluc2VydFRleHQgXCJmb29cXG4gIFwiXG4gICAgICAgIGVkaXRvci5zYXZlKClcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCJmb29cXG5cIlxuXG4gICAgICAgIGVkaXRvci5zZXRUZXh0IFwiZm9vXFxuIFwiXG4gICAgICAgIGVkaXRvci5zYXZlKClcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCJmb29cXG5cIlxuXG4gICAgICBpdCBcInJlc3BlY3RzICd3aGl0ZXNwYWNlLmlnbm9yZVdoaXRlc3BhY2VPbkN1cnJlbnRMaW5lJyBzZXR0aW5nXCIsIC0+XG4gICAgICAgIGF0b20uY29uZmlnLnNldChcIndoaXRlc3BhY2UuaWdub3JlV2hpdGVzcGFjZU9uQ3VycmVudExpbmVcIiwgdHJ1ZSlcblxuICAgICAgICBlZGl0b3IuaW5zZXJ0VGV4dCBcImZvbyBcXG5saW5lIGJyZWFrIVwiXG4gICAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbMCwgNF0pXG4gICAgICAgIGVkaXRvci5zYXZlKClcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCJmb28gXFxubGluZSBicmVhayFcXG5cIlxuXG4gICAgICBpdCBcInJlc3BlY3RzICd3aGl0ZXNwYWNlLmlnbm9yZVdoaXRlc3BhY2VPbmx5TGluZXMnIHNldHRpbmdcIiwgLT5cbiAgICAgICAgYXRvbS5jb25maWcuc2V0KFwid2hpdGVzcGFjZS5pZ25vcmVXaGl0ZXNwYWNlT25seUxpbmVzXCIsIHRydWUpXG5cbiAgICAgICAgZWRpdG9yLmluc2VydFRleHQgXCJcXHQgXFxubGluZSBicmVhayFcIlxuICAgICAgICBlZGl0b3Iuc2F2ZSgpXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiXFx0IFxcbmxpbmUgYnJlYWshXFxuXCJcblxuICAgIGRlc2NyaWJlICd3aGVuIGtlZXBNYXJrZG93bkxpbmVCcmVha1doaXRlc3BhY2UgaXMgZmFsc2UnLCAtPlxuICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoXCJ3aGl0ZXNwYWNlLmlnbm9yZVdoaXRlc3BhY2VPbkN1cnJlbnRMaW5lXCIsIGZhbHNlKVxuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoXCJ3aGl0ZXNwYWNlLmtlZXBNYXJrZG93bkxpbmVCcmVha1doaXRlc3BhY2VcIiwgZmFsc2UpXG5cbiAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgICAgYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoXCJsYW5ndWFnZS1nZm1cIilcblxuICAgICAgICBydW5zIC0+XG4gICAgICAgICAgZWRpdG9yLnNldEdyYW1tYXIoYXRvbS5ncmFtbWFycy5ncmFtbWFyRm9yU2NvcGVOYW1lKFwic291cmNlLmdmbVwiKSlcblxuICAgICAgaXQgXCJ0cmltcyBHRk0gdGV4dCB3aXRoIGEgc2luZ2xlIHNwYWNlXCIsIC0+XG4gICAgICAgIGVkaXRvci5pbnNlcnRUZXh0IFwiZm9vIFxcbmxpbmUgYnJlYWshXCJcbiAgICAgICAgZWRpdG9yLnNhdmUoKVxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSBcImZvb1xcbmxpbmUgYnJlYWshXFxuXCJcblxuICAgICAgaXQgXCJ0cmltcyBHRk0gdGV4dCB3aXRoIHR3byBzcGFjZXNcIiwgLT5cbiAgICAgICAgZWRpdG9yLmluc2VydFRleHQgXCJmb28gIFxcbmxpbmUgYnJlYWshXCJcbiAgICAgICAgZWRpdG9yLnNhdmUoKVxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSBcImZvb1xcbmxpbmUgYnJlYWshXFxuXCJcblxuICAgICAgaXQgXCJ0cmltcyBHRk0gdGV4dCB3aXRoIGEgbW9yZSB0aGFuIHR3byBzcGFjZXNcIiwgLT5cbiAgICAgICAgZWRpdG9yLmluc2VydFRleHQgXCJmb28gICBcXG5saW5lIGJyZWFrIVwiXG4gICAgICAgIGVkaXRvci5zYXZlKClcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCJmb29cXG5saW5lIGJyZWFrIVxcblwiXG5cbiAgICAgIGl0IFwidHJpbXMgZW1wdHkgbGluZXNcIiwgLT5cbiAgICAgICAgZWRpdG9yLmluc2VydFRleHQgXCJmb29cXG4gIFwiXG4gICAgICAgIGVkaXRvci5zYXZlKClcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCJmb29cXG5cIlxuXG4gICAgICAgIGVkaXRvci5zZXRUZXh0IFwiZm9vXFxuIFwiXG4gICAgICAgIGVkaXRvci5zYXZlKClcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCJmb29cXG5cIlxuXG4gICAgICBpdCBcInJlc3BlY3RzICd3aGl0ZXNwYWNlLmlnbm9yZVdoaXRlc3BhY2VPbkN1cnJlbnRMaW5lJyBzZXR0aW5nXCIsIC0+XG4gICAgICAgIGF0b20uY29uZmlnLnNldChcIndoaXRlc3BhY2UuaWdub3JlV2hpdGVzcGFjZU9uQ3VycmVudExpbmVcIiwgdHJ1ZSlcblxuICAgICAgICBlZGl0b3IuaW5zZXJ0VGV4dCBcImZvbyBcXG5saW5lIGJyZWFrIVwiXG4gICAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbMCwgNF0pXG4gICAgICAgIGVkaXRvci5zYXZlKClcbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCJmb28gXFxubGluZSBicmVhayFcXG5cIlxuXG4gICAgICBpdCBcInJlc3BlY3RzICd3aGl0ZXNwYWNlLmlnbm9yZVdoaXRlc3BhY2VPbmx5TGluZXMnIHNldHRpbmdcIiwgLT5cbiAgICAgICAgYXRvbS5jb25maWcuc2V0KFwid2hpdGVzcGFjZS5pZ25vcmVXaGl0ZXNwYWNlT25seUxpbmVzXCIsIHRydWUpXG5cbiAgICAgICAgZWRpdG9yLmluc2VydFRleHQgXCJcXHQgXFxubGluZSBicmVhayFcIlxuICAgICAgICBlZGl0b3Iuc2F2ZSgpXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiXFx0IFxcbmxpbmUgYnJlYWshXFxuXCJcblxuICBkZXNjcmliZSBcIndoZW4gdGhlIGVkaXRvciBpcyBzcGxpdFwiLCAtPlxuICAgIGl0IFwiZG9lcyBub3QgdGhyb3cgZXhjZXB0aW9ucyB3aGVuIHRoZSBlZGl0b3IgaXMgc2F2ZWQgYWZ0ZXIgdGhlIHNwbGl0IGlzIGNsb3NlZCAocmVncmVzc2lvbilcIiwgLT5cbiAgICAgIGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKS5zcGxpdFJpZ2h0KGNvcHlBY3RpdmVJdGVtOiB0cnVlKVxuICAgICAgYXRvbS53b3Jrc3BhY2UuZ2V0UGFuZXMoKVswXS5kZXN0cm95SXRlbXMoKVxuXG4gICAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lSXRlbSgpXG4gICAgICBlZGl0b3Iuc2V0VGV4dCgndGVzdCcpXG4gICAgICBleHBlY3QoLT4gZWRpdG9yLnNhdmUoKSkubm90LnRvVGhyb3coKVxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgJ3Rlc3RcXG4nXG5cbiAgZGVzY3JpYmUgXCJ3aGVuIGRlYWN0aXZhdGVkXCIsIC0+XG4gICAgaXQgXCJkb2VzIG5vdCByZW1vdmUgdHJhaWxpbmcgd2hpdGVzcGFjZSBmcm9tIGVkaXRvcnMgb3BlbmVkIGFmdGVyIGRlYWN0aXZhdGlvblwiLCAtPlxuICAgICAgYXRvbS5jb25maWcuc2V0KFwid2hpdGVzcGFjZS5yZW1vdmVUcmFpbGluZ1doaXRlc3BhY2VcIiwgdHJ1ZSlcbiAgICAgIGF0b20ucGFja2FnZXMuZGVhY3RpdmF0ZVBhY2thZ2UoJ3doaXRlc3BhY2UnKVxuXG4gICAgICBlZGl0b3Iuc2V0VGV4dChcImZvbyBcXG5cIilcbiAgICAgIGVkaXRvci5zYXZlKClcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiZm9vIFxcblwiXG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKCdzYW1wbGUyLnR4dCcpXG5cbiAgICAgIHJ1bnMgLT5cbiAgICAgICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICAgIGVkaXRvci5zZXRUZXh0KFwiZm9vIFxcblwiKVxuICAgICAgICBlZGl0b3Iuc2F2ZSgpXG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiZm9vIFxcblwiXG5cbiAgZGVzY3JpYmUgXCJ3aGVuIHRoZSAnd2hpdGVzcGFjZTpyZW1vdmUtdHJhaWxpbmctd2hpdGVzcGFjZScgY29tbWFuZCBpcyBydW5cIiwgLT5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBidWZmZXIuc2V0VGV4dChcImZvbyAgIFxcbmJhclxcdCAgIFxcblxcbmJhelwiKVxuXG4gICAgaXQgXCJyZW1vdmVzIHRoZSB0cmFpbGluZyB3aGl0ZXNwYWNlIGluIHRoZSBhY3RpdmUgZWRpdG9yXCIsIC0+XG4gICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHdvcmtzcGFjZUVsZW1lbnQsICd3aGl0ZXNwYWNlOnJlbW92ZS10cmFpbGluZy13aGl0ZXNwYWNlJylcbiAgICAgIGV4cGVjdChidWZmZXIuZ2V0VGV4dCgpKS50b0JlIFwiZm9vXFxuYmFyXFxuXFxuYmF6XCJcblxuICAgIGl0IFwiZG9lcyBub3QgYXR0ZW1wdCB0byByZW1vdmUgd2hpdGVzcGFjZSB3aGVuIHRoZSBwYWNrYWdlIGlzIGRlYWN0aXZhdGVkXCIsIC0+XG4gICAgICBhdG9tLnBhY2thZ2VzLmRlYWN0aXZhdGVQYWNrYWdlICd3aGl0ZXNwYWNlJ1xuICAgICAgZXhwZWN0KGJ1ZmZlci5nZXRUZXh0KCkpLnRvQmUgXCJmb28gICBcXG5iYXJcXHQgICBcXG5cXG5iYXpcIlxuXG4gIGRlc2NyaWJlIFwid2hlbiB0aGUgJ3doaXRlc3BhY2U6c2F2ZS13aXRoLXRyYWlsaW5nLXdoaXRlc3BhY2UnIGNvbW1hbmQgaXMgcnVuXCIsIC0+XG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgYXRvbS5jb25maWcuc2V0KFwid2hpdGVzcGFjZS5yZW1vdmVUcmFpbGluZ1doaXRlc3BhY2VcIiwgdHJ1ZSlcbiAgICAgIGF0b20uY29uZmlnLnNldChcIndoaXRlc3BhY2UuZW5zdXJlU2luZ2xlVHJhaWxpbmdOZXdsaW5lXCIsIGZhbHNlKVxuICAgICAgYnVmZmVyLnNldFRleHQoXCJmb28gICBcXG5iYXJcXHQgICBcXG5cXG5iYXpcIilcblxuICAgIGl0IFwic2F2ZXMgdGhlIGZpbGUgd2l0aG91dCByZW1vdmluZyBhbnkgdHJhaWxpbmcgd2hpdGVzcGFjZVwiLCAtPlxuICAgICAgd2FpdHNGb3IgKGRvbmUpIC0+XG4gICAgICAgIGJ1ZmZlci5vbkRpZFNhdmUgLT5cbiAgICAgICAgICBleHBlY3QoYnVmZmVyLmdldFRleHQoKSkudG9CZSBcImZvbyAgIFxcbmJhclxcdCAgIFxcblxcbmJhelwiXG4gICAgICAgICAgZXhwZWN0KGJ1ZmZlci5pc01vZGlmaWVkKCkpLnRvQmUgZmFsc2VcbiAgICAgICAgICBkb25lKClcbiAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh3b3Jrc3BhY2VFbGVtZW50LCAnd2hpdGVzcGFjZTpzYXZlLXdpdGgtdHJhaWxpbmctd2hpdGVzcGFjZScpXG5cbiAgZGVzY3JpYmUgXCJ3aGVuIHRoZSAnd2hpdGVzcGFjZTpzYXZlLXdpdGhvdXQtdHJhaWxpbmctd2hpdGVzcGFjZScgY29tbWFuZCBpcyBydW5cIiwgLT5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBhdG9tLmNvbmZpZy5zZXQoXCJ3aGl0ZXNwYWNlLnJlbW92ZVRyYWlsaW5nV2hpdGVzcGFjZVwiLCBmYWxzZSlcbiAgICAgIGF0b20uY29uZmlnLnNldChcIndoaXRlc3BhY2UuZW5zdXJlU2luZ2xlVHJhaWxpbmdOZXdsaW5lXCIsIGZhbHNlKVxuICAgICAgYnVmZmVyLnNldFRleHQoXCJmb28gICBcXG5iYXJcXHQgICBcXG5cXG5iYXpcIilcblxuICAgIGl0IFwic2F2ZXMgdGhlIGZpbGUgYW5kIHJlbW92ZXMgYW55IHRyYWlsaW5nIHdoaXRlc3BhY2VcIiwgLT5cbiAgICAgIHdhaXRzRm9yIChkb25lKSAtPlxuICAgICAgICBidWZmZXIub25EaWRTYXZlIC0+XG4gICAgICAgICAgZXhwZWN0KGJ1ZmZlci5nZXRUZXh0KCkpLnRvQmUgXCJmb29cXG5iYXJcXG5cXG5iYXpcIlxuICAgICAgICAgIGV4cGVjdChidWZmZXIuaXNNb2RpZmllZCgpKS50b0JlIGZhbHNlXG4gICAgICAgICAgZG9uZSgpXG4gICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2god29ya3NwYWNlRWxlbWVudCwgJ3doaXRlc3BhY2U6c2F2ZS13aXRob3V0LXRyYWlsaW5nLXdoaXRlc3BhY2UnKVxuXG4gIGRlc2NyaWJlIFwid2hlbiB0aGUgJ3doaXRlc3BhY2U6Y29udmVydC10YWJzLXRvLXNwYWNlcycgY29tbWFuZCBpcyBydW5cIiwgLT5cbiAgICBpdCBcInJlbW92ZXMgbGVhZGluZyBcXFxcdCBjaGFyYWN0ZXJzIGFuZCByZXBsYWNlcyB0aGVtIHdpdGggc3BhY2VzIHVzaW5nIHRoZSBjb25maWd1cmVkIHRhYiBsZW5ndGhcIiwgLT5cbiAgICAgIGVkaXRvci5zZXRUYWJMZW5ndGgoMilcbiAgICAgIGJ1ZmZlci5zZXRUZXh0KCdcXHRhXFxuXFx0XFxuYlxcdFxcbmNcXHRcXHRkJylcbiAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2god29ya3NwYWNlRWxlbWVudCwgJ3doaXRlc3BhY2U6Y29udmVydC10YWJzLXRvLXNwYWNlcycpXG4gICAgICBleHBlY3QoYnVmZmVyLmdldFRleHQoKSkudG9CZSBcIiAgYVxcbiAgXFxuYlxcdFxcbmNcXHRcXHRkXCJcblxuICAgICAgZWRpdG9yLnNldFRhYkxlbmd0aCgzKVxuICAgICAgYnVmZmVyLnNldFRleHQoJ1xcdGFcXG5cXHRcXG5iXFx0XFxuY1xcdFxcdGQnKVxuICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh3b3Jrc3BhY2VFbGVtZW50LCAnd2hpdGVzcGFjZTpjb252ZXJ0LXRhYnMtdG8tc3BhY2VzJylcbiAgICAgIGV4cGVjdChidWZmZXIuZ2V0VGV4dCgpKS50b0JlIFwiICAgYVxcbiAgIFxcbmJcXHRcXG5jXFx0XFx0ZFwiXG5cbiAgICBpdCBcImNoYW5nZXMgdGhlIHRhYiB0eXBlIHRvIHNvZnQgdGFic1wiLCAtPlxuICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh3b3Jrc3BhY2VFbGVtZW50LCAnd2hpdGVzcGFjZTpjb252ZXJ0LXRhYnMtdG8tc3BhY2VzJylcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0U29mdFRhYnMoKSkudG9CZSB0cnVlXG5cbiAgZGVzY3JpYmUgXCJ3aGVuIHRoZSAnd2hpdGVzcGFjZTpjb252ZXJ0LXNwYWNlcy10by10YWJzJyBjb21tYW5kIGlzIHJ1blwiLCAtPlxuICAgIGl0IFwicmVtb3ZlcyBsZWFkaW5nIHNwYWNlIGNoYXJhY3RlcnMgYW5kIHJlcGxhY2VzIHRoZW0gd2l0aCBoYXJkIHRhYnNcIiwgLT5cbiAgICAgIGVkaXRvci5zZXRUYWJMZW5ndGgoMilcbiAgICAgIGJ1ZmZlci5zZXRUZXh0KFwiICAgYVxcbiAgXFxuYiAgXFxuYyAgICBkXCIpXG4gICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHdvcmtzcGFjZUVsZW1lbnQsICd3aGl0ZXNwYWNlOmNvbnZlcnQtc3BhY2VzLXRvLXRhYnMnKVxuICAgICAgZXhwZWN0KGJ1ZmZlci5nZXRUZXh0KCkpLnRvQmUgJ1xcdCBhXFxuXFx0XFxuYiAgXFxuYyAgICBkJ1xuXG4gICAgICBlZGl0b3Iuc2V0VGFiTGVuZ3RoKDMpXG4gICAgICBidWZmZXIuc2V0VGV4dChcIiAgICAgYVxcbiAgIFxcbmIgICBcXG5jICAgICAgZFwiKVxuICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh3b3Jrc3BhY2VFbGVtZW50LCAnd2hpdGVzcGFjZTpjb252ZXJ0LXNwYWNlcy10by10YWJzJylcbiAgICAgIGV4cGVjdChidWZmZXIuZ2V0VGV4dCgpKS50b0JlICdcXHQgIGFcXG5cXHRcXG5iICAgXFxuYyAgICAgIGQnXG5cbiAgICBpdCBcImhhbmRsZXMgbWl4ZWQgcnVucyBvZiB0YWJzIGFuZCBzcGFjZXMgY29ycmVjdGx5XCIsIC0+XG4gICAgICBlZGl0b3Iuc2V0VGFiTGVuZ3RoKDQpXG4gICAgICBidWZmZXIuc2V0VGV4dChcIiAgICAgXFx0ICAgIFxcdFxcdGEgICBcIilcbiAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2god29ya3NwYWNlRWxlbWVudCwgJ3doaXRlc3BhY2U6Y29udmVydC1zcGFjZXMtdG8tdGFicycpXG4gICAgICBleHBlY3QoYnVmZmVyLmdldFRleHQoKSkudG9CZSBcIlxcdFxcdFxcdFxcdFxcdGEgICBcIlxuXG4gICAgaXQgXCJjaGFuZ2VzIHRoZSB0YWIgdHlwZSB0byBoYXJkIHRhYnNcIiwgLT5cbiAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2god29ya3NwYWNlRWxlbWVudCwgJ3doaXRlc3BhY2U6Y29udmVydC1zcGFjZXMtdG8tdGFicycpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFNvZnRUYWJzKCkpLnRvQmUgZmFsc2VcblxuICAgIGl0IFwiY2hhbmdlcyB0aGUgdGFiIGxlbmd0aCB0byB1c2VyJ3MgdGFiLXNpemVcIiwgLT5cbiAgICAgIGVkaXRvci5zZXRUYWJMZW5ndGgoNClcbiAgICAgIGJ1ZmZlci5zZXRUZXh0KFwiICAgIFwiKVxuICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh3b3Jrc3BhY2VFbGVtZW50LCAnd2hpdGVzcGFjZTpjb252ZXJ0LXNwYWNlcy10by10YWJzJylcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGFiTGVuZ3RoKCkpLnRvQmUgMlxuXG4gIGRlc2NyaWJlIFwid2hlbiB0aGUgJ3doaXRlc3BhY2U6Y29udmVydC1hbGwtdGFicy10by1zcGFjZXMnIGNvbW1hbmQgaXMgcnVuXCIsIC0+XG4gICAgaXQgXCJyZW1vdmVzIGFsbCBcXFxcdCBjaGFyYWN0ZXJzIGFuZCByZXBsYWNlcyB0aGVtIHdpdGggc3BhY2VzIHVzaW5nIHRoZSBjb25maWd1cmVkIHRhYiBsZW5ndGhcIiwgLT5cbiAgICAgIGVkaXRvci5zZXRUYWJMZW5ndGgoMilcbiAgICAgIGJ1ZmZlci5zZXRUZXh0KCdcXHRhXFxuXFx0XFxuYlxcdFxcbmNcXHRcXHRkJylcbiAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2god29ya3NwYWNlRWxlbWVudCwgJ3doaXRlc3BhY2U6Y29udmVydC1hbGwtdGFicy10by1zcGFjZXMnKVxuICAgICAgZXhwZWN0KGJ1ZmZlci5nZXRUZXh0KCkpLnRvQmUgXCIgIGFcXG4gIFxcbmIgIFxcbmMgICAgZFwiXG5cbiAgICAgIGVkaXRvci5zZXRUYWJMZW5ndGgoMylcbiAgICAgIGJ1ZmZlci5zZXRUZXh0KCdcXHRhXFxuXFx0XFxuYlxcdFxcbmNcXHRcXHRkJylcbiAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2god29ya3NwYWNlRWxlbWVudCwgJ3doaXRlc3BhY2U6Y29udmVydC1hbGwtdGFicy10by1zcGFjZXMnKVxuICAgICAgZXhwZWN0KGJ1ZmZlci5nZXRUZXh0KCkpLnRvQmUgXCIgICBhXFxuICAgXFxuYiAgIFxcbmMgICAgICBkXCJcblxuICAgIGl0IFwiY2hhbmdlcyB0aGUgdGFiIHR5cGUgdG8gc29mdCB0YWJzXCIsIC0+XG4gICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHdvcmtzcGFjZUVsZW1lbnQsICd3aGl0ZXNwYWNlOmNvbnZlcnQtYWxsLXRhYnMtdG8tc3BhY2VzJylcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0U29mdFRhYnMoKSkudG9CZSB0cnVlXG4iXX0=
