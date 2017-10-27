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
    describe("when the 'whitespace:convert-tabs-to-spaces' command is run", function() {
      it("removes all \t characters and replaces them with spaces using the configured tab length", function() {
        editor.setTabLength(2);
        buffer.setText('\ta\n\t\nb\t\nc\t\td');
        atom.commands.dispatch(workspaceElement, 'whitespace:convert-tabs-to-spaces');
        expect(buffer.getText()).toBe("  a\n  \nb  \nc    d");
        editor.setTabLength(3);
        buffer.setText('\ta\n\t\nb\t\nc\t\td');
        atom.commands.dispatch(workspaceElement, 'whitespace:convert-tabs-to-spaces');
        return expect(buffer.getText()).toBe("   a\n   \nb   \nc      d");
      });
      return it("changes the tab type to soft tabs", function() {
        atom.commands.dispatch(workspaceElement, 'whitespace:convert-tabs-to-spaces');
        return expect(editor.getSoftTabs()).toBe(true);
      });
    });
    return describe("when the 'whitespace:convert-spaces-to-tabs' command is run", function() {
      it("removes all space characters and replaces them with hard tabs", function() {
        editor.setTabLength(2);
        buffer.setText("  a\n  \nb  \nc    d");
        atom.commands.dispatch(workspaceElement, 'whitespace:convert-spaces-to-tabs');
        expect(buffer.getText()).toBe('\ta\n\t\nb\t\nc\t\td');
        editor.setTabLength(3);
        return buffer.setText("   a\n   \nb   \nc      d", atom.commands.dispatch(workspaceElement, 'whitespace:convert-spaces-to-tabs'), expect(buffer.getText()).toBe('\ta\n\t\nb\t\nc\t\td'));
      });
      return it("changes the tab type to hard tabs", function() {
        atom.commands.dispatch(workspaceElement, 'whitespace:convert-spaces-to-tabs');
        return expect(editor.getSoftTabs()).toBe(false);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3doaXRlc3BhY2Uvc3BlYy93aGl0ZXNwYWNlLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGNBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBUCxDQUFBOztBQUFBLEVBQ0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSLENBREwsQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUZQLENBQUE7O0FBQUEsRUFJQSxRQUFBLENBQVMsWUFBVCxFQUF1QixTQUFBLEdBQUE7QUFDckIsUUFBQSxzQ0FBQTtBQUFBLElBQUEsT0FBcUMsRUFBckMsRUFBQyxnQkFBRCxFQUFTLGdCQUFULEVBQWlCLDBCQUFqQixDQUFBO0FBQUEsSUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsVUFBQSxtQkFBQTtBQUFBLE1BQUEsU0FBQSxHQUFZLElBQUksQ0FBQyxTQUFMLENBQUEsQ0FBWixDQUFBO0FBQUEsTUFDQSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBc0IsQ0FBQyxTQUFELENBQXRCLENBREEsQ0FBQTtBQUFBLE1BRUEsZ0JBQUEsR0FBbUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLElBQUksQ0FBQyxTQUF4QixDQUZuQixDQUFBO0FBQUEsTUFHQSxRQUFBLEdBQVcsSUFBSSxDQUFDLElBQUwsQ0FBVSxTQUFWLEVBQXFCLHFCQUFyQixDQUhYLENBQUE7QUFBQSxNQUlBLEVBQUUsQ0FBQyxhQUFILENBQWlCLFFBQWpCLEVBQTJCLEVBQTNCLENBSkEsQ0FBQTtBQUFBLE1BS0EsRUFBRSxDQUFDLGFBQUgsQ0FBaUIsSUFBSSxDQUFDLElBQUwsQ0FBVSxTQUFWLEVBQXFCLFlBQXJCLENBQWpCLEVBQXFE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

//# sourceURL=/Users/ah/.atom/packages/whitespace/spec/whitespace-spec.coffee
