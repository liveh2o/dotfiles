(function() {
  var helpers, settings;

  helpers = require('./spec-helper');

  settings = require('../lib/settings');

  describe("Operators", function() {
    var editor, editorElement, keydown, normalModeInputKeydown, vimState, _ref;
    _ref = [], editor = _ref[0], editorElement = _ref[1], vimState = _ref[2];
    beforeEach(function() {
      var vimMode;
      vimMode = atom.packages.loadPackage('vim-mode');
      vimMode.activateResources();
      return helpers.getEditorElement(function(element) {
        editorElement = element;
        editor = editorElement.getModel();
        vimState = editorElement.vimState;
        vimState.activateNormalMode();
        return vimState.resetNormalMode();
      });
    });
    keydown = function(key, options) {
      if (options == null) {
        options = {};
      }
      if (options.element == null) {
        options.element = editorElement;
      }
      return helpers.keydown(key, options);
    };
    normalModeInputKeydown = function(key, opts) {
      if (opts == null) {
        opts = {};
      }
      return editor.normalModeInputView.editorElement.getModel().setText(key);
    };
    describe("cancelling operations", function() {
      it("throws an error when no operation is pending", function() {
        return expect(function() {
          return vimState.pushOperations(new Input(''));
        }).toThrow();
      });
      return it("cancels and cleans up properly", function() {
        keydown('/');
        expect(vimState.isOperatorPending()).toBe(true);
        editor.normalModeInputView.viewModel.cancel();
        expect(vimState.isOperatorPending()).toBe(false);
        return expect(editor.normalModeInputView).toBe(void 0);
      });
    });
    describe("the x keybinding", function() {
      describe("on a line with content", function() {
        describe("without vim-mode.wrapLeftRightMotion", function() {
          beforeEach(function() {
            editor.setText("abc\n012345\n\nxyz");
            return editor.setCursorScreenPosition([1, 4]);
          });
          it("deletes a character", function() {
            keydown('x');
            expect(editor.getText()).toBe('abc\n01235\n\nxyz');
            expect(editor.getCursorScreenPosition()).toEqual([1, 4]);
            expect(vimState.getRegister('"').text).toBe('4');
            keydown('x');
            expect(editor.getText()).toBe('abc\n0123\n\nxyz');
            expect(editor.getCursorScreenPosition()).toEqual([1, 3]);
            expect(vimState.getRegister('"').text).toBe('5');
            keydown('x');
            expect(editor.getText()).toBe('abc\n012\n\nxyz');
            expect(editor.getCursorScreenPosition()).toEqual([1, 2]);
            expect(vimState.getRegister('"').text).toBe('3');
            keydown('x');
            expect(editor.getText()).toBe('abc\n01\n\nxyz');
            expect(editor.getCursorScreenPosition()).toEqual([1, 1]);
            expect(vimState.getRegister('"').text).toBe('2');
            keydown('x');
            expect(editor.getText()).toBe('abc\n0\n\nxyz');
            expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
            expect(vimState.getRegister('"').text).toBe('1');
            keydown('x');
            expect(editor.getText()).toBe('abc\n\n\nxyz');
            expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
            return expect(vimState.getRegister('"').text).toBe('0');
          });
          return it("deletes multiple characters with a count", function() {
            keydown('2');
            keydown('x');
            expect(editor.getText()).toBe('abc\n0123\n\nxyz');
            expect(editor.getCursorScreenPosition()).toEqual([1, 3]);
            expect(vimState.getRegister('"').text).toBe('45');
            editor.setCursorScreenPosition([0, 1]);
            keydown('3');
            keydown('x');
            expect(editor.getText()).toBe('a\n0123\n\nxyz');
            expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
            return expect(vimState.getRegister('"').text).toBe('bc');
          });
        });
        describe("with multiple cursors", function() {
          beforeEach(function() {
            editor.setText("abc\n012345\n\nxyz");
            editor.setCursorScreenPosition([1, 4]);
            return editor.addCursorAtBufferPosition([0, 1]);
          });
          return it("is undone as one operation", function() {
            keydown('x');
            expect(editor.getText()).toBe("ac\n01235\n\nxyz");
            keydown('u');
            return expect(editor.getText()).toBe("abc\n012345\n\nxyz");
          });
        });
        return describe("with vim-mode.wrapLeftRightMotion", function() {
          beforeEach(function() {
            editor.setText("abc\n012345\n\nxyz");
            editor.setCursorScreenPosition([1, 4]);
            return atom.config.set('vim-mode.wrapLeftRightMotion', true);
          });
          it("deletes a character", function() {
            keydown('x');
            expect(editor.getText()).toBe('abc\n01235\n\nxyz');
            expect(editor.getCursorScreenPosition()).toEqual([1, 4]);
            expect(vimState.getRegister('"').text).toBe('4');
            keydown('x');
            expect(editor.getText()).toBe('abc\n0123\n\nxyz');
            expect(editor.getCursorScreenPosition()).toEqual([1, 3]);
            expect(vimState.getRegister('"').text).toBe('5');
            keydown('x');
            expect(editor.getText()).toBe('abc\n012\n\nxyz');
            expect(editor.getCursorScreenPosition()).toEqual([1, 2]);
            expect(vimState.getRegister('"').text).toBe('3');
            keydown('x');
            expect(editor.getText()).toBe('abc\n01\n\nxyz');
            expect(editor.getCursorScreenPosition()).toEqual([1, 1]);
            expect(vimState.getRegister('"').text).toBe('2');
            keydown('x');
            expect(editor.getText()).toBe('abc\n0\n\nxyz');
            expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
            expect(vimState.getRegister('"').text).toBe('1');
            keydown('x');
            expect(editor.getText()).toBe('abc\n\n\nxyz');
            expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
            return expect(vimState.getRegister('"').text).toBe('0');
          });
          return it("deletes multiple characters and newlines with a count", function() {
            atom.config.set('vim-mode.wrapLeftRightMotion', true);
            keydown('2');
            keydown('x');
            expect(editor.getText()).toBe('abc\n0123\n\nxyz');
            expect(editor.getCursorScreenPosition()).toEqual([1, 3]);
            expect(vimState.getRegister('"').text).toBe('45');
            editor.setCursorScreenPosition([0, 1]);
            keydown('3');
            keydown('x');
            expect(editor.getText()).toBe('a0123\n\nxyz');
            expect(editor.getCursorScreenPosition()).toEqual([0, 1]);
            expect(vimState.getRegister('"').text).toBe('bc\n');
            keydown('7');
            keydown('x');
            expect(editor.getText()).toBe('ayz');
            expect(editor.getCursorScreenPosition()).toEqual([0, 1]);
            return expect(vimState.getRegister('"').text).toBe('0123\n\nx');
          });
        });
      });
      return describe("on an empty line", function() {
        beforeEach(function() {
          editor.setText("abc\n012345\n\nxyz");
          return editor.setCursorScreenPosition([2, 0]);
        });
        it("deletes nothing on an empty line when vim-mode.wrapLeftRightMotion is false", function() {
          atom.config.set('vim-mode.wrapLeftRightMotion', false);
          keydown('x');
          expect(editor.getText()).toBe("abc\n012345\n\nxyz");
          return expect(editor.getCursorScreenPosition()).toEqual([2, 0]);
        });
        return it("deletes an empty line when vim-mode.wrapLeftRightMotion is true", function() {
          atom.config.set('vim-mode.wrapLeftRightMotion', true);
          keydown('x');
          expect(editor.getText()).toBe("abc\n012345\nxyz");
          return expect(editor.getCursorScreenPosition()).toEqual([2, 0]);
        });
      });
    });
    describe("the X keybinding", function() {
      describe("on a line with content", function() {
        beforeEach(function() {
          editor.setText("ab\n012345");
          return editor.setCursorScreenPosition([1, 2]);
        });
        return it("deletes a character", function() {
          keydown('X', {
            shift: true
          });
          expect(editor.getText()).toBe('ab\n02345');
          expect(editor.getCursorScreenPosition()).toEqual([1, 1]);
          expect(vimState.getRegister('"').text).toBe('1');
          keydown('X', {
            shift: true
          });
          expect(editor.getText()).toBe('ab\n2345');
          expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
          expect(vimState.getRegister('"').text).toBe('0');
          keydown('X', {
            shift: true
          });
          expect(editor.getText()).toBe('ab\n2345');
          expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
          expect(vimState.getRegister('"').text).toBe('0');
          atom.config.set('vim-mode.wrapLeftRightMotion', true);
          keydown('X', {
            shift: true
          });
          expect(editor.getText()).toBe('ab2345');
          expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
          return expect(vimState.getRegister('"').text).toBe('\n');
        });
      });
      return describe("on an empty line", function() {
        beforeEach(function() {
          editor.setText("012345\n\nabcdef");
          return editor.setCursorScreenPosition([1, 0]);
        });
        it("deletes nothing when vim-mode.wrapLeftRightMotion is false", function() {
          atom.config.set('vim-mode.wrapLeftRightMotion', false);
          keydown('X', {
            shift: true
          });
          expect(editor.getText()).toBe("012345\n\nabcdef");
          return expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
        });
        return it("deletes the newline when wrapLeftRightMotion is true", function() {
          atom.config.set('vim-mode.wrapLeftRightMotion', true);
          keydown('X', {
            shift: true
          });
          expect(editor.getText()).toBe("012345\nabcdef");
          return expect(editor.getCursorScreenPosition()).toEqual([0, 5]);
        });
      });
    });
    describe("the s keybinding", function() {
      beforeEach(function() {
        editor.setText('012345');
        return editor.setCursorScreenPosition([0, 1]);
      });
      it("deletes the character to the right and enters insert mode", function() {
        keydown('s');
        expect(editorElement.classList.contains('insert-mode')).toBe(true);
        expect(editor.getText()).toBe('02345');
        expect(editor.getCursorScreenPosition()).toEqual([0, 1]);
        return expect(vimState.getRegister('"').text).toBe('1');
      });
      it("is repeatable", function() {
        editor.setCursorScreenPosition([0, 0]);
        keydown('3');
        keydown('s');
        editor.insertText("ab");
        keydown('escape');
        expect(editor.getText()).toBe('ab345');
        editor.setCursorScreenPosition([0, 2]);
        keydown('.');
        return expect(editor.getText()).toBe('abab');
      });
      it("is undoable", function() {
        editor.setCursorScreenPosition([0, 0]);
        keydown('3');
        keydown('s');
        editor.insertText("ab");
        keydown('escape');
        expect(editor.getText()).toBe('ab345');
        keydown('u');
        expect(editor.getText()).toBe('012345');
        return expect(editor.getSelectedText()).toBe('');
      });
      return describe("in visual mode", function() {
        beforeEach(function() {
          keydown('v');
          editor.selectRight();
          return keydown('s');
        });
        return it("deletes the selected characters and enters insert mode", function() {
          expect(editorElement.classList.contains('insert-mode')).toBe(true);
          expect(editor.getText()).toBe('0345');
          expect(editor.getCursorScreenPosition()).toEqual([0, 1]);
          return expect(vimState.getRegister('"').text).toBe('12');
        });
      });
    });
    describe("the S keybinding", function() {
      beforeEach(function() {
        editor.setText("12345\nabcde\nABCDE");
        return editor.setCursorScreenPosition([1, 3]);
      });
      it("deletes the entire line and enters insert mode", function() {
        keydown('S', {
          shift: true
        });
        expect(editorElement.classList.contains('insert-mode')).toBe(true);
        expect(editor.getText()).toBe("12345\n\nABCDE");
        expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
        expect(vimState.getRegister('"').text).toBe("abcde\n");
        return expect(vimState.getRegister('"').type).toBe('linewise');
      });
      it("is repeatable", function() {
        keydown('S', {
          shift: true
        });
        editor.insertText("abc");
        keydown('escape');
        expect(editor.getText()).toBe("12345\nabc\nABCDE");
        editor.setCursorScreenPosition([2, 3]);
        keydown('.');
        return expect(editor.getText()).toBe("12345\nabc\nabc\n");
      });
      it("is undoable", function() {
        keydown('S', {
          shift: true
        });
        editor.insertText("abc");
        keydown('escape');
        expect(editor.getText()).toBe("12345\nabc\nABCDE");
        keydown('u');
        expect(editor.getText()).toBe("12345\nabcde\nABCDE");
        return expect(editor.getSelectedText()).toBe('');
      });
      it("works when the cursor's goal column is greater than its current column", function() {
        editor.setText("\n12345");
        editor.setCursorBufferPosition([1, Infinity]);
        editor.moveUp();
        keydown("S", {
          shift: true
        });
        return expect(editor.getText()).toBe("\n12345");
      });
      return xit("respects indentation", function() {});
    });
    describe("the d keybinding", function() {
      it("enters operator-pending mode", function() {
        keydown('d');
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(true);
        return expect(editorElement.classList.contains('normal-mode')).toBe(false);
      });
      describe("when followed by a d", function() {
        it("deletes the current line and exits operator-pending mode", function() {
          editor.setText("12345\nabcde\n\nABCDE");
          editor.setCursorScreenPosition([1, 1]);
          keydown('d');
          keydown('d');
          expect(editor.getText()).toBe("12345\n\nABCDE");
          expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
          expect(vimState.getRegister('"').text).toBe("abcde\n");
          expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
          return expect(editorElement.classList.contains('normal-mode')).toBe(true);
        });
        it("deletes the last line", function() {
          editor.setText("12345\nabcde\nABCDE");
          editor.setCursorScreenPosition([2, 1]);
          keydown('d');
          keydown('d');
          expect(editor.getText()).toBe("12345\nabcde\n");
          return expect(editor.getCursorScreenPosition()).toEqual([2, 0]);
        });
        return it("leaves the cursor on the first nonblank character", function() {
          editor.setText("12345\n  abcde\n");
          editor.setCursorScreenPosition([0, 4]);
          keydown('d');
          keydown('d');
          expect(editor.getText()).toBe("  abcde\n");
          return expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
        });
      });
      describe("undo behavior", function() {
        beforeEach(function() {
          editor.setText("12345\nabcde\nABCDE\nQWERT");
          return editor.setCursorScreenPosition([1, 1]);
        });
        it("undoes both lines", function() {
          keydown('d');
          keydown('2');
          keydown('d');
          keydown('u');
          expect(editor.getText()).toBe("12345\nabcde\nABCDE\nQWERT");
          return expect(editor.getSelectedText()).toBe('');
        });
        return describe("with multiple cursors", function() {
          beforeEach(function() {
            editor.setCursorBufferPosition([1, 1]);
            return editor.addCursorAtBufferPosition([0, 0]);
          });
          return it("is undone as one operation", function() {
            keydown('d');
            keydown('l');
            keydown('u');
            expect(editor.getText()).toBe("12345\nabcde\nABCDE\nQWERT");
            return expect(editor.getSelectedText()).toBe('');
          });
        });
      });
      describe("when followed by a w", function() {
        it("deletes the next word until the end of the line and exits operator-pending mode", function() {
          editor.setText("abcd efg\nabc");
          editor.setCursorScreenPosition([0, 5]);
          keydown('d');
          keydown('w');
          expect(editor.getText()).toBe("abcd abc");
          expect(editor.getCursorScreenPosition()).toEqual([0, 5]);
          expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
          return expect(editorElement.classList.contains('normal-mode')).toBe(true);
        });
        return it("deletes to the beginning of the next word", function() {
          editor.setText('abcd efg');
          editor.setCursorScreenPosition([0, 2]);
          keydown('d');
          keydown('w');
          expect(editor.getText()).toBe('abefg');
          expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
          editor.setText('one two three four');
          editor.setCursorScreenPosition([0, 0]);
          keydown('d');
          keydown('3');
          keydown('w');
          expect(editor.getText()).toBe('four');
          return expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
        });
      });
      describe("when followed by an iw", function() {
        return it("deletes the containing word", function() {
          editor.setText("12345 abcde ABCDE");
          editor.setCursorScreenPosition([0, 9]);
          keydown('d');
          expect(editorElement.classList.contains('operator-pending-mode')).toBe(true);
          keydown('i');
          keydown('w');
          expect(editor.getText()).toBe("12345  ABCDE");
          expect(editor.getCursorScreenPosition()).toEqual([0, 6]);
          expect(vimState.getRegister('"').text).toBe("abcde");
          expect(editorElement.classList.contains('operator-pending-mode')).toBe(false);
          return expect(editorElement.classList.contains('normal-mode')).toBe(true);
        });
      });
      describe("when followed by a j", function() {
        var originalText;
        originalText = "12345\nabcde\nABCDE\n";
        beforeEach(function() {
          return editor.setText(originalText);
        });
        describe("on the beginning of the file", function() {
          return it("deletes the next two lines", function() {
            editor.setCursorScreenPosition([0, 0]);
            keydown('d');
            keydown('j');
            return expect(editor.getText()).toBe("ABCDE\n");
          });
        });
        describe("on the end of the file", function() {
          return it("deletes nothing", function() {
            editor.setCursorScreenPosition([4, 0]);
            keydown('d');
            keydown('j');
            return expect(editor.getText()).toBe(originalText);
          });
        });
        return describe("on the middle of second line", function() {
          return it("deletes the last two lines", function() {
            editor.setCursorScreenPosition([1, 2]);
            keydown('d');
            keydown('j');
            return expect(editor.getText()).toBe("12345\n");
          });
        });
      });
      describe("when followed by an k", function() {
        var originalText;
        originalText = "12345\nabcde\nABCDE";
        beforeEach(function() {
          return editor.setText(originalText);
        });
        describe("on the end of the file", function() {
          return it("deletes the bottom two lines", function() {
            editor.setCursorScreenPosition([2, 4]);
            keydown('d');
            keydown('k');
            return expect(editor.getText()).toBe("12345\n");
          });
        });
        describe("on the beginning of the file", function() {
          return xit("deletes nothing", function() {
            editor.setCursorScreenPosition([0, 0]);
            keydown('d');
            keydown('k');
            return expect(editor.getText()).toBe(originalText);
          });
        });
        return describe("when on the middle of second line", function() {
          return it("deletes the first two lines", function() {
            editor.setCursorScreenPosition([1, 2]);
            keydown('d');
            keydown('k');
            return expect(editor.getText()).toBe("ABCDE");
          });
        });
      });
      describe("when followed by a G", function() {
        beforeEach(function() {
          var originalText;
          originalText = "12345\nabcde\nABCDE";
          return editor.setText(originalText);
        });
        describe("on the beginning of the second line", function() {
          return it("deletes the bottom two lines", function() {
            editor.setCursorScreenPosition([1, 0]);
            keydown('d');
            keydown('G', {
              shift: true
            });
            return expect(editor.getText()).toBe("12345\n");
          });
        });
        return describe("on the middle of the second line", function() {
          return it("deletes the bottom two lines", function() {
            editor.setCursorScreenPosition([1, 2]);
            keydown('d');
            keydown('G', {
              shift: true
            });
            return expect(editor.getText()).toBe("12345\n");
          });
        });
      });
      describe("when followed by a goto line G", function() {
        beforeEach(function() {
          var originalText;
          originalText = "12345\nabcde\nABCDE";
          return editor.setText(originalText);
        });
        describe("on the beginning of the second line", function() {
          return it("deletes the bottom two lines", function() {
            editor.setCursorScreenPosition([1, 0]);
            keydown('d');
            keydown('2');
            keydown('G', {
              shift: true
            });
            return expect(editor.getText()).toBe("12345\nABCDE");
          });
        });
        return describe("on the middle of the second line", function() {
          return it("deletes the bottom two lines", function() {
            editor.setCursorScreenPosition([1, 2]);
            keydown('d');
            keydown('2');
            keydown('G', {
              shift: true
            });
            return expect(editor.getText()).toBe("12345\nABCDE");
          });
        });
      });
      describe("when followed by a t)", function() {
        return describe("with the entire line yanked before", function() {
          beforeEach(function() {
            editor.setText("test (xyz)");
            return editor.setCursorScreenPosition([0, 6]);
          });
          return it("deletes until the closing parenthesis", function() {
            keydown('y');
            keydown('y');
            keydown('d');
            keydown('t');
            normalModeInputKeydown(')');
            expect(editor.getText()).toBe("test ()");
            return expect(editor.getCursorScreenPosition()).toEqual([0, 6]);
          });
        });
      });
      return describe("with multiple cursors", function() {
        it("deletes each selection", function() {
          editor.setText("abcd\n1234\nABCD\n");
          editor.setCursorBufferPosition([0, 1]);
          editor.addCursorAtBufferPosition([1, 2]);
          editor.addCursorAtBufferPosition([2, 3]);
          keydown('d');
          keydown('e');
          expect(editor.getText()).toBe("a\n12\nABC");
          return expect(editor.getCursorBufferPositions()).toEqual([[0, 0], [1, 1], [2, 2]]);
        });
        return it("doesn't delete empty selections", function() {
          editor.setText("abcd\nabc\nabd");
          editor.setCursorBufferPosition([0, 0]);
          editor.addCursorAtBufferPosition([1, 0]);
          editor.addCursorAtBufferPosition([2, 0]);
          keydown('d');
          keydown('t');
          normalModeInputKeydown('d');
          expect(editor.getText()).toBe("d\nabc\nd");
          return expect(editor.getCursorBufferPositions()).toEqual([[0, 0], [1, 0], [2, 0]]);
        });
      });
    });
    describe("the D keybinding", function() {
      beforeEach(function() {
        editor.getBuffer().setText("012\n");
        editor.setCursorScreenPosition([0, 1]);
        return keydown('D', {
          shift: true
        });
      });
      return it("deletes the contents until the end of the line", function() {
        return expect(editor.getText()).toBe("0\n");
      });
    });
    describe("the c keybinding", function() {
      beforeEach(function() {
        return editor.setText("12345\nabcde\nABCDE");
      });
      describe("when followed by a c", function() {
        describe("with autoindent", function() {
          beforeEach(function() {
            editor.setText("12345\n  abcde\nABCDE");
            editor.setCursorScreenPosition([1, 1]);
            spyOn(editor, 'shouldAutoIndent').andReturn(true);
            spyOn(editor, 'autoIndentBufferRow').andCallFake(function(line) {
              return editor.indent();
            });
            return spyOn(editor.languageMode, 'suggestedIndentForLineAtBufferRow').andCallFake(function() {
              return 1;
            });
          });
          it("deletes the current line and enters insert mode", function() {
            editor.setCursorScreenPosition([1, 1]);
            keydown('c');
            keydown('c');
            expect(editor.getText()).toBe("12345\n  \nABCDE");
            expect(editor.getCursorScreenPosition()).toEqual([1, 2]);
            expect(editorElement.classList.contains('normal-mode')).toBe(false);
            return expect(editorElement.classList.contains('insert-mode')).toBe(true);
          });
          it("is repeatable", function() {
            keydown('c');
            keydown('c');
            editor.insertText("abc");
            keydown('escape');
            expect(editor.getText()).toBe("12345\n  abc\nABCDE");
            editor.setCursorScreenPosition([2, 3]);
            keydown('.');
            return expect(editor.getText()).toBe("12345\n  abc\n  abc\n");
          });
          return it("is undoable", function() {
            keydown('c');
            keydown('c');
            editor.insertText("abc");
            keydown('escape');
            expect(editor.getText()).toBe("12345\n  abc\nABCDE");
            keydown('u');
            expect(editor.getText()).toBe("12345\n  abcde\nABCDE");
            return expect(editor.getSelectedText()).toBe('');
          });
        });
        describe("when the cursor is on the last line", function() {
          return it("deletes the line's content and enters insert mode on the last line", function() {
            editor.setCursorScreenPosition([2, 1]);
            keydown('c');
            keydown('c');
            expect(editor.getText()).toBe("12345\nabcde\n\n");
            expect(editor.getCursorScreenPosition()).toEqual([2, 0]);
            expect(editorElement.classList.contains('normal-mode')).toBe(false);
            return expect(editorElement.classList.contains('insert-mode')).toBe(true);
          });
        });
        return describe("when the cursor is on the only line", function() {
          return it("deletes the line's content and enters insert mode", function() {
            editor.setText("12345");
            editor.setCursorScreenPosition([0, 2]);
            keydown('c');
            keydown('c');
            expect(editor.getText()).toBe("");
            expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
            expect(editorElement.classList.contains('normal-mode')).toBe(false);
            return expect(editorElement.classList.contains('insert-mode')).toBe(true);
          });
        });
      });
      describe("when followed by i w", function() {
        return it("undo's and redo's completely", function() {
          editor.setCursorScreenPosition([1, 1]);
          keydown('c');
          keydown('i');
          keydown('w');
          expect(editor.getText()).toBe("12345\n\nABCDE");
          expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
          expect(editorElement.classList.contains('insert-mode')).toBe(true);
          editor.setText("12345\nfg\nABCDE");
          keydown('escape');
          expect(editorElement.classList.contains('normal-mode')).toBe(true);
          expect(editor.getText()).toBe("12345\nfg\nABCDE");
          keydown('u');
          expect(editor.getText()).toBe("12345\nabcde\nABCDE");
          keydown('r', {
            ctrl: true
          });
          return expect(editor.getText()).toBe("12345\nfg\nABCDE");
        });
      });
      describe("when followed by a w", function() {
        return it("changes the word", function() {
          editor.setText("word1 word2 word3");
          editor.setCursorBufferPosition([0, "word1 w".length]);
          keydown("c");
          keydown("w");
          keydown("escape");
          return expect(editor.getText()).toBe("word1 w word3");
        });
      });
      describe("when followed by a G", function() {
        beforeEach(function() {
          var originalText;
          originalText = "12345\nabcde\nABCDE";
          return editor.setText(originalText);
        });
        describe("on the beginning of the second line", function() {
          return it("deletes the bottom two lines", function() {
            editor.setCursorScreenPosition([1, 0]);
            keydown('c');
            keydown('G', {
              shift: true
            });
            keydown('escape');
            return expect(editor.getText()).toBe("12345\n\n");
          });
        });
        return describe("on the middle of the second line", function() {
          return it("deletes the bottom two lines", function() {
            editor.setCursorScreenPosition([1, 2]);
            keydown('c');
            keydown('G', {
              shift: true
            });
            keydown('escape');
            return expect(editor.getText()).toBe("12345\n\n");
          });
        });
      });
      describe("when followed by a %", function() {
        beforeEach(function() {
          return editor.setText("12345(67)8\nabc(d)e\nA()BCDE");
        });
        describe("before brackets or on the first one", function() {
          beforeEach(function() {
            editor.setCursorScreenPosition([0, 1]);
            editor.addCursorAtScreenPosition([1, 1]);
            editor.addCursorAtScreenPosition([2, 1]);
            keydown('c');
            keydown('%');
            return editor.insertText('x');
          });
          it("replaces inclusively until matching bracket", function() {
            expect(editor.getText()).toBe("1x8\naxe\nAxBCDE");
            return expect(vimState.mode).toBe("insert");
          });
          return it("undoes correctly with u", function() {
            keydown('escape');
            expect(vimState.mode).toBe("normal");
            keydown('u');
            return expect(editor.getText()).toBe("12345(67)8\nabc(d)e\nA()BCDE");
          });
        });
        describe("inside brackets or on the ending one", function() {
          return it("replaces inclusively backwards until matching bracket", function() {
            editor.setCursorScreenPosition([0, 6]);
            editor.addCursorAtScreenPosition([1, 5]);
            editor.addCursorAtScreenPosition([2, 2]);
            keydown('c');
            keydown('%');
            editor.insertText('x');
            expect(editor.getText()).toBe("12345x7)8\nabcxe\nAxBCDE");
            return expect(vimState.mode).toBe("insert");
          });
        });
        describe("after or without brackets", function() {
          return it("deletes nothing", function() {
            editor.setText("12345(67)8\nabc(d)e\nABCDE");
            editor.setCursorScreenPosition([0, 9]);
            editor.addCursorAtScreenPosition([2, 2]);
            keydown('c');
            keydown('%');
            expect(editor.getText()).toBe("12345(67)8\nabc(d)e\nABCDE");
            return expect(vimState.mode).toBe("normal");
          });
        });
        return describe("repetition with .", function() {
          beforeEach(function() {
            editor.setCursorScreenPosition([0, 1]);
            keydown('c');
            keydown('%');
            editor.insertText('x');
            return keydown('escape');
          });
          it("repeats correctly before a bracket", function() {
            editor.setCursorScreenPosition([1, 0]);
            keydown('.');
            expect(editor.getText()).toBe("1x8\nxe\nA()BCDE");
            return expect(vimState.mode).toBe("normal");
          });
          it("repeats correctly on the opening bracket", function() {
            editor.setCursorScreenPosition([1, 3]);
            keydown('.');
            expect(editor.getText()).toBe("1x8\nabcxe\nA()BCDE");
            return expect(vimState.mode).toBe("normal");
          });
          it("repeats correctly inside brackets", function() {
            editor.setCursorScreenPosition([1, 4]);
            keydown('.');
            expect(editor.getText()).toBe("1x8\nabcx)e\nA()BCDE");
            return expect(vimState.mode).toBe("normal");
          });
          it("repeats correctly on the closing bracket", function() {
            editor.setCursorScreenPosition([1, 5]);
            keydown('.');
            expect(editor.getText()).toBe("1x8\nabcxe\nA()BCDE");
            return expect(vimState.mode).toBe("normal");
          });
          return it("does nothing when repeated after a bracket", function() {
            editor.setCursorScreenPosition([2, 3]);
            keydown('.');
            expect(editor.getText()).toBe("1x8\nabc(d)e\nA()BCDE");
            return expect(vimState.mode).toBe("normal");
          });
        });
      });
      describe("when followed by a goto line G", function() {
        beforeEach(function() {
          return editor.setText("12345\nabcde\nABCDE");
        });
        describe("on the beginning of the second line", function() {
          return it("deletes all the text on the line", function() {
            editor.setCursorScreenPosition([1, 0]);
            keydown('c');
            keydown('2');
            keydown('G', {
              shift: true
            });
            keydown('escape');
            return expect(editor.getText()).toBe("12345\n\nABCDE");
          });
        });
        return describe("on the middle of the second line", function() {
          return it("deletes all the text on the line", function() {
            editor.setCursorScreenPosition([1, 2]);
            keydown('c');
            keydown('2');
            keydown('G', {
              shift: true
            });
            keydown('escape');
            return expect(editor.getText()).toBe("12345\n\nABCDE");
          });
        });
      });
      return describe("in visual mode", function() {
        beforeEach(function() {
          editor.setText("123456789\nabcde\nfghijklmnopq\nuvwxyz");
          return editor.setCursorScreenPosition([1, 1]);
        });
        describe("with characterwise selection on a single line", function() {
          it("repeats with .", function() {
            keydown('v');
            keydown('2');
            keydown('l');
            keydown('c');
            editor.insertText("ab");
            keydown('escape');
            expect(editor.getText()).toBe("123456789\naabe\nfghijklmnopq\nuvwxyz");
            editor.setCursorScreenPosition([0, 1]);
            keydown('.');
            return expect(editor.getText()).toBe("1ab56789\naabe\nfghijklmnopq\nuvwxyz");
          });
          it("repeats shortened with . near the end of the line", function() {
            editor.setCursorScreenPosition([0, 2]);
            keydown('v');
            keydown('4');
            keydown('l');
            keydown('c');
            editor.insertText("ab");
            keydown('escape');
            expect(editor.getText()).toBe("12ab89\nabcde\nfghijklmnopq\nuvwxyz");
            editor.setCursorScreenPosition([1, 3]);
            keydown('.');
            return expect(editor.getText()).toBe("12ab89\nabcab\nfghijklmnopq\nuvwxyz");
          });
          return it("repeats shortened with . near the end of the line regardless of whether motion wrapping is enabled", function() {
            atom.config.set('vim-mode.wrapLeftRightMotion', true);
            editor.setCursorScreenPosition([0, 2]);
            keydown('v');
            keydown('4');
            keydown('l');
            keydown('c');
            editor.insertText("ab");
            keydown('escape');
            expect(editor.getText()).toBe("12ab89\nabcde\nfghijklmnopq\nuvwxyz");
            editor.setCursorScreenPosition([1, 3]);
            keydown('.');
            return expect(editor.getText()).toBe("12ab89\nabcab\nfghijklmnopq\nuvwxyz");
          });
        });
        describe("is repeatable with characterwise selection over multiple lines", function() {
          it("repeats with .", function() {
            keydown('v');
            keydown('j');
            keydown('3');
            keydown('l');
            keydown('c');
            editor.insertText("x");
            keydown('escape');
            expect(editor.getText()).toBe("123456789\naxklmnopq\nuvwxyz");
            editor.setCursorScreenPosition([0, 1]);
            keydown('.');
            return expect(editor.getText()).toBe("1xnopq\nuvwxyz");
          });
          return it("repeats shortened with . near the end of the line", function() {
            keydown('v');
            keydown('j');
            keydown('6');
            keydown('l');
            keydown('c');
            editor.insertText("x");
            keydown('escape');
            expect(editor.getText()).toBe("123456789\naxnopq\nuvwxyz");
            editor.setCursorScreenPosition([0, 1]);
            keydown('.');
            return expect(editor.getText()).toBe("1x\nuvwxyz");
          });
        });
        describe("is repeatable with linewise selection", function() {
          describe("with one line selected", function() {
            return it("repeats with .", function() {
              keydown('V', {
                shift: true
              });
              keydown('c');
              editor.insertText("x");
              keydown('escape');
              expect(editor.getText()).toBe("123456789\nx\nfghijklmnopq\nuvwxyz");
              editor.setCursorScreenPosition([0, 7]);
              keydown('.');
              expect(editor.getText()).toBe("x\nx\nfghijklmnopq\nuvwxyz");
              editor.setCursorScreenPosition([2, 0]);
              keydown('.');
              return expect(editor.getText()).toBe("x\nx\nx\nuvwxyz");
            });
          });
          return describe("with multiple lines selected", function() {
            it("repeats with .", function() {
              keydown('V', {
                shift: true
              });
              keydown('j');
              keydown('c');
              editor.insertText("x");
              keydown('escape');
              expect(editor.getText()).toBe("123456789\nx\nuvwxyz");
              editor.setCursorScreenPosition([0, 7]);
              keydown('.');
              return expect(editor.getText()).toBe("x\nuvwxyz");
            });
            return it("repeats shortened with . near the end of the file", function() {
              keydown('V', {
                shift: true
              });
              keydown('j');
              keydown('c');
              editor.insertText("x");
              keydown('escape');
              expect(editor.getText()).toBe("123456789\nx\nuvwxyz");
              editor.setCursorScreenPosition([1, 7]);
              keydown('.');
              return expect(editor.getText()).toBe("123456789\nx\n");
            });
          });
        });
        return xdescribe("is repeatable with block selection", function() {});
      });
    });
    describe("the C keybinding", function() {
      beforeEach(function() {
        editor.getBuffer().setText("012\n");
        editor.setCursorScreenPosition([0, 1]);
        return keydown('C', {
          shift: true
        });
      });
      return it("deletes the contents until the end of the line and enters insert mode", function() {
        expect(editor.getText()).toBe("0\n");
        expect(editor.getCursorScreenPosition()).toEqual([0, 1]);
        expect(editorElement.classList.contains('normal-mode')).toBe(false);
        return expect(editorElement.classList.contains('insert-mode')).toBe(true);
      });
    });
    describe("the y keybinding", function() {
      beforeEach(function() {
        editor.getBuffer().setText("012 345\nabc\ndefg\n");
        editor.setCursorScreenPosition([0, 4]);
        return vimState.setRegister('"', {
          text: '345'
        });
      });
      describe("when selected lines in visual linewise mode", function() {
        beforeEach(function() {
          keydown('V', {
            shift: true
          });
          keydown('j');
          return keydown('y');
        });
        it("is in linewise motion", function() {
          return expect(vimState.getRegister('"').type).toEqual("linewise");
        });
        it("saves the lines to the default register", function() {
          return expect(vimState.getRegister('"').text).toBe("012 345\nabc\n");
        });
        return it("places the cursor at the beginning of the selection", function() {
          return expect(editor.getCursorBufferPositions()).toEqual([[0, 0]]);
        });
      });
      describe("when followed by a second y ", function() {
        beforeEach(function() {
          keydown('y');
          return keydown('y');
        });
        it("saves the line to the default register", function() {
          return expect(vimState.getRegister('"').text).toBe("012 345\n");
        });
        return it("leaves the cursor at the starting position", function() {
          return expect(editor.getCursorScreenPosition()).toEqual([0, 4]);
        });
      });
      describe("when useClipboardAsDefaultRegister enabled", function() {
        return it("writes to clipboard", function() {
          atom.config.set('vim-mode.useClipboardAsDefaultRegister', true);
          keydown('y');
          keydown('y');
          return expect(atom.clipboard.read()).toBe('012 345\n');
        });
      });
      describe("when followed with a repeated y", function() {
        beforeEach(function() {
          keydown('y');
          keydown('2');
          return keydown('y');
        });
        it("copies n lines, starting from the current", function() {
          return expect(vimState.getRegister('"').text).toBe("012 345\nabc\n");
        });
        return it("leaves the cursor at the starting position", function() {
          return expect(editor.getCursorScreenPosition()).toEqual([0, 4]);
        });
      });
      describe("with a register", function() {
        beforeEach(function() {
          keydown('"');
          keydown('a');
          keydown('y');
          return keydown('y');
        });
        it("saves the line to the a register", function() {
          return expect(vimState.getRegister('a').text).toBe("012 345\n");
        });
        return it("appends the line to the A register", function() {
          keydown('"');
          keydown('A', {
            shift: true
          });
          keydown('y');
          keydown('y');
          return expect(vimState.getRegister('a').text).toBe("012 345\n012 345\n");
        });
      });
      describe("with a forward motion", function() {
        beforeEach(function() {
          keydown('y');
          return keydown('e');
        });
        it("saves the selected text to the default register", function() {
          return expect(vimState.getRegister('"').text).toBe('345');
        });
        it("leaves the cursor at the starting position", function() {
          return expect(editor.getCursorScreenPosition()).toEqual([0, 4]);
        });
        return it("does not yank when motion fails", function() {
          keydown('y');
          keydown('t');
          normalModeInputKeydown('x');
          return expect(vimState.getRegister('"').text).toBe('345');
        });
      });
      describe("with a text object", function() {
        return it("moves the cursor to the beginning of the text object", function() {
          editor.setCursorBufferPosition([0, 5]);
          keydown("y");
          keydown("i");
          keydown("w");
          return expect(editor.getCursorBufferPositions()).toEqual([[0, 4]]);
        });
      });
      describe("with a left motion", function() {
        beforeEach(function() {
          keydown('y');
          return keydown('h');
        });
        it("saves the left letter to the default register", function() {
          return expect(vimState.getRegister('"').text).toBe(" ");
        });
        return it("moves the cursor position to the left", function() {
          return expect(editor.getCursorScreenPosition()).toEqual([0, 3]);
        });
      });
      describe("with a down motion", function() {
        beforeEach(function() {
          keydown('y');
          return keydown('j');
        });
        it("saves both full lines to the default register", function() {
          return expect(vimState.getRegister('"').text).toBe("012 345\nabc\n");
        });
        return it("leaves the cursor at the starting position", function() {
          return expect(editor.getCursorScreenPosition()).toEqual([0, 4]);
        });
      });
      describe("with an up motion", function() {
        beforeEach(function() {
          editor.setCursorScreenPosition([2, 2]);
          keydown('y');
          return keydown('k');
        });
        it("saves both full lines to the default register", function() {
          return expect(vimState.getRegister('"').text).toBe("abc\ndefg\n");
        });
        return it("puts the cursor on the first line and the original column", function() {
          return expect(editor.getCursorScreenPosition()).toEqual([1, 2]);
        });
      });
      describe("when followed by a G", function() {
        beforeEach(function() {
          var originalText;
          originalText = "12345\nabcde\nABCDE";
          return editor.setText(originalText);
        });
        describe("on the beginning of the second line", function() {
          return it("deletes the bottom two lines", function() {
            editor.setCursorScreenPosition([1, 0]);
            keydown('y');
            keydown('G', {
              shift: true
            });
            keydown('P', {
              shift: true
            });
            return expect(editor.getText()).toBe("12345\nabcde\nABCDE\nabcde\nABCDE");
          });
        });
        return describe("on the middle of the second line", function() {
          return it("deletes the bottom two lines", function() {
            editor.setCursorScreenPosition([1, 2]);
            keydown('y');
            keydown('G', {
              shift: true
            });
            keydown('P', {
              shift: true
            });
            return expect(editor.getText()).toBe("12345\nabcde\nABCDE\nabcde\nABCDE");
          });
        });
      });
      describe("when followed by a goto line G", function() {
        beforeEach(function() {
          var originalText;
          originalText = "12345\nabcde\nABCDE";
          return editor.setText(originalText);
        });
        describe("on the beginning of the second line", function() {
          return it("deletes the bottom two lines", function() {
            editor.setCursorScreenPosition([1, 0]);
            keydown('y');
            keydown('2');
            keydown('G', {
              shift: true
            });
            keydown('P', {
              shift: true
            });
            return expect(editor.getText()).toBe("12345\nabcde\nabcde\nABCDE");
          });
        });
        return describe("on the middle of the second line", function() {
          return it("deletes the bottom two lines", function() {
            editor.setCursorScreenPosition([1, 2]);
            keydown('y');
            keydown('2');
            keydown('G', {
              shift: true
            });
            keydown('P', {
              shift: true
            });
            return expect(editor.getText()).toBe("12345\nabcde\nabcde\nABCDE");
          });
        });
      });
      describe("with multiple cursors", function() {
        return it("moves each cursor and copies the last selection's text", function() {
          editor.setText("  abcd\n  1234");
          editor.setCursorBufferPosition([0, 0]);
          editor.addCursorAtBufferPosition([1, 5]);
          keydown("y");
          keydown("^");
          expect(vimState.getRegister('"').text).toBe('123');
          return expect(editor.getCursorBufferPositions()).toEqual([[0, 0], [1, 2]]);
        });
      });
      return describe("in a long file", function() {
        beforeEach(function() {
          var i, text, _i;
          jasmine.attachToDOM(editorElement);
          editorElement.setHeight(400);
          editorElement.style.lineHeight = "10px";
          editorElement.style.font = "16px monospace";
          atom.views.performDocumentPoll();
          text = "";
          for (i = _i = 1; _i <= 200; i = ++_i) {
            text += "" + i + "\n";
          }
          return editor.setText(text);
        });
        describe("yanking many lines forward", function() {
          return it("does not scroll the window", function() {
            var previousScrollTop;
            editor.setCursorBufferPosition([40, 1]);
            previousScrollTop = editorElement.getScrollTop();
            keydown('y');
            keydown('1');
            keydown('6');
            keydown('0');
            keydown('G', {
              shift: true
            });
            expect(editorElement.getScrollTop()).toEqual(previousScrollTop);
            expect(editor.getCursorBufferPosition()).toEqual([40, 1]);
            return expect(vimState.getRegister('"').text.split('\n').length).toBe(121);
          });
        });
        return describe("yanking many lines backwards", function() {
          return it("scrolls the window", function() {
            var previousScrollTop;
            editor.setCursorBufferPosition([140, 1]);
            previousScrollTop = editorElement.getScrollTop();
            keydown('y');
            keydown('6');
            keydown('0');
            keydown('G', {
              shift: true
            });
            expect(editorElement.getScrollTop()).toNotEqual(previousScrollTop);
            expect(editor.getCursorBufferPosition()).toEqual([59, 1]);
            return expect(vimState.getRegister('"').text.split('\n').length).toBe(83);
          });
        });
      });
    });
    describe("the yy keybinding", function() {
      describe("on a single line file", function() {
        beforeEach(function() {
          editor.getBuffer().setText("exclamation!\n");
          return editor.setCursorScreenPosition([0, 0]);
        });
        return it("copies the entire line and pastes it correctly", function() {
          keydown('y');
          keydown('y');
          keydown('p');
          expect(vimState.getRegister('"').text).toBe("exclamation!\n");
          return expect(editor.getText()).toBe("exclamation!\nexclamation!\n");
        });
      });
      return describe("on a single line file with no newline", function() {
        beforeEach(function() {
          editor.getBuffer().setText("no newline!");
          return editor.setCursorScreenPosition([0, 0]);
        });
        it("copies the entire line and pastes it correctly", function() {
          keydown('y');
          keydown('y');
          keydown('p');
          expect(vimState.getRegister('"').text).toBe("no newline!\n");
          return expect(editor.getText()).toBe("no newline!\nno newline!");
        });
        return it("copies the entire line and pastes it respecting count and new lines", function() {
          keydown('y');
          keydown('y');
          keydown('2');
          keydown('p');
          expect(vimState.getRegister('"').text).toBe("no newline!\n");
          return expect(editor.getText()).toBe("no newline!\nno newline!\nno newline!");
        });
      });
    });
    describe("the Y keybinding", function() {
      beforeEach(function() {
        editor.getBuffer().setText("012 345\nabc\n");
        return editor.setCursorScreenPosition([0, 4]);
      });
      return it("saves the line to the default register", function() {
        keydown('Y', {
          shift: true
        });
        expect(vimState.getRegister('"').text).toBe("012 345\n");
        return expect(editor.getCursorScreenPosition()).toEqual([0, 4]);
      });
    });
    describe("the p keybinding", function() {
      describe("with character contents", function() {
        beforeEach(function() {
          editor.getBuffer().setText("012\n");
          editor.setCursorScreenPosition([0, 0]);
          vimState.setRegister('"', {
            text: '345'
          });
          vimState.setRegister('a', {
            text: 'a'
          });
          return atom.clipboard.write("clip");
        });
        describe("from the default register", function() {
          beforeEach(function() {
            return keydown('p');
          });
          return it("inserts the contents", function() {
            expect(editor.getText()).toBe("034512\n");
            return expect(editor.getCursorScreenPosition()).toEqual([0, 3]);
          });
        });
        describe("at the end of a line", function() {
          beforeEach(function() {
            editor.setCursorScreenPosition([0, 2]);
            return keydown('p');
          });
          return it("positions cursor correctly", function() {
            expect(editor.getText()).toBe("012345\n");
            return expect(editor.getCursorScreenPosition()).toEqual([0, 5]);
          });
        });
        describe("when useClipboardAsDefaultRegister enabled", function() {
          return it("inserts contents from clipboard", function() {
            atom.config.set('vim-mode.useClipboardAsDefaultRegister', true);
            keydown('p');
            return expect(editor.getText()).toBe("0clip12\n");
          });
        });
        describe("from a specified register", function() {
          beforeEach(function() {
            keydown('"');
            keydown('a');
            return keydown('p');
          });
          return it("inserts the contents of the 'a' register", function() {
            expect(editor.getText()).toBe("0a12\n");
            return expect(editor.getCursorScreenPosition()).toEqual([0, 1]);
          });
        });
        describe("at the end of a line", function() {
          return it("inserts before the current line's newline", function() {
            editor.setText("abcde\none two three");
            editor.setCursorScreenPosition([1, 4]);
            keydown('d');
            keydown('$');
            keydown('k');
            keydown('$');
            keydown('p');
            return expect(editor.getText()).toBe("abcdetwo three\none ");
          });
        });
        return describe("with a selection", function() {
          beforeEach(function() {
            editor.selectRight();
            return keydown('p');
          });
          return it("replaces the current selection", function() {
            expect(editor.getText()).toBe("34512\n");
            return expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
          });
        });
      });
      describe("with linewise contents", function() {
        describe("on a single line", function() {
          beforeEach(function() {
            editor.getBuffer().setText("012");
            editor.setCursorScreenPosition([0, 1]);
            return vimState.setRegister('"', {
              text: " 345\n",
              type: 'linewise'
            });
          });
          it("inserts the contents of the default register", function() {
            keydown('p');
            expect(editor.getText()).toBe("012\n 345");
            return expect(editor.getCursorScreenPosition()).toEqual([1, 1]);
          });
          return it("replaces the current selection", function() {
            editor.selectRight();
            keydown('p');
            expect(editor.getText()).toBe("0 345\n2");
            return expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
          });
        });
        return describe("on multiple lines", function() {
          beforeEach(function() {
            editor.getBuffer().setText("012\n 345");
            return vimState.setRegister('"', {
              text: " 456\n",
              type: 'linewise'
            });
          });
          it("inserts the contents of the default register at middle line", function() {
            editor.setCursorScreenPosition([0, 1]);
            keydown('p');
            expect(editor.getText()).toBe("012\n 456\n 345");
            return expect(editor.getCursorScreenPosition()).toEqual([1, 1]);
          });
          return it("inserts the contents of the default register at end of line", function() {
            editor.setCursorScreenPosition([1, 1]);
            keydown('p');
            expect(editor.getText()).toBe("012\n 345\n 456");
            return expect(editor.getCursorScreenPosition()).toEqual([2, 1]);
          });
        });
      });
      describe("with multiple linewise contents", function() {
        beforeEach(function() {
          editor.getBuffer().setText("012\nabc");
          editor.setCursorScreenPosition([1, 0]);
          vimState.setRegister('"', {
            text: " 345\n 678\n",
            type: 'linewise'
          });
          return keydown('p');
        });
        return it("inserts the contents of the default register", function() {
          expect(editor.getText()).toBe("012\nabc\n 345\n 678");
          return expect(editor.getCursorScreenPosition()).toEqual([2, 1]);
        });
      });
      return describe("pasting twice", function() {
        beforeEach(function() {
          editor.setText("12345\nabcde\nABCDE\nQWERT");
          editor.setCursorScreenPosition([1, 1]);
          vimState.setRegister('"', {
            text: '123'
          });
          keydown('2');
          return keydown('p');
        });
        it("inserts the same line twice", function() {
          return expect(editor.getText()).toBe("12345\nab123123cde\nABCDE\nQWERT");
        });
        return describe("when undone", function() {
          beforeEach(function() {
            return keydown('u');
          });
          return it("removes both lines", function() {
            return expect(editor.getText()).toBe("12345\nabcde\nABCDE\nQWERT");
          });
        });
      });
    });
    describe("the P keybinding", function() {
      return describe("with character contents", function() {
        beforeEach(function() {
          editor.getBuffer().setText("012\n");
          editor.setCursorScreenPosition([0, 0]);
          vimState.setRegister('"', {
            text: '345'
          });
          vimState.setRegister('a', {
            text: 'a'
          });
          return keydown('P', {
            shift: true
          });
        });
        return it("inserts the contents of the default register above", function() {
          expect(editor.getText()).toBe("345012\n");
          return expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
        });
      });
    });
    describe("the O keybinding", function() {
      beforeEach(function() {
        spyOn(editor, 'shouldAutoIndent').andReturn(true);
        spyOn(editor, 'autoIndentBufferRow').andCallFake(function(line) {
          return editor.indent();
        });
        editor.getBuffer().setText("  abc\n  012\n");
        return editor.setCursorScreenPosition([1, 1]);
      });
      it("switches to insert and adds a newline above the current one", function() {
        keydown('O', {
          shift: true
        });
        expect(editor.getText()).toBe("  abc\n  \n  012\n");
        expect(editor.getCursorScreenPosition()).toEqual([1, 2]);
        return expect(editorElement.classList.contains('insert-mode')).toBe(true);
      });
      it("is repeatable", function() {
        editor.getBuffer().setText("  abc\n  012\n    4spaces\n");
        editor.setCursorScreenPosition([1, 1]);
        keydown('O', {
          shift: true
        });
        editor.insertText("def");
        keydown('escape');
        expect(editor.getText()).toBe("  abc\n  def\n  012\n    4spaces\n");
        editor.setCursorScreenPosition([1, 1]);
        keydown('.');
        expect(editor.getText()).toBe("  abc\n  def\n  def\n  012\n    4spaces\n");
        editor.setCursorScreenPosition([4, 1]);
        keydown('.');
        return expect(editor.getText()).toBe("  abc\n  def\n  def\n  012\n    def\n    4spaces\n");
      });
      return it("is undoable", function() {
        keydown('O', {
          shift: true
        });
        editor.insertText("def");
        keydown('escape');
        expect(editor.getText()).toBe("  abc\n  def\n  012\n");
        keydown('u');
        return expect(editor.getText()).toBe("  abc\n  012\n");
      });
    });
    describe("the o keybinding", function() {
      beforeEach(function() {
        spyOn(editor, 'shouldAutoIndent').andReturn(true);
        spyOn(editor, 'autoIndentBufferRow').andCallFake(function(line) {
          return editor.indent();
        });
        editor.getBuffer().setText("abc\n  012\n");
        return editor.setCursorScreenPosition([1, 2]);
      });
      it("switches to insert and adds a newline above the current one", function() {
        keydown('o');
        expect(editor.getText()).toBe("abc\n  012\n  \n");
        expect(editorElement.classList.contains('insert-mode')).toBe(true);
        return expect(editor.getCursorScreenPosition()).toEqual([2, 2]);
      });
      xit("is repeatable", function() {
        editor.getBuffer().setText("  abc\n  012\n    4spaces\n");
        editor.setCursorScreenPosition([1, 1]);
        keydown('o');
        editor.insertText("def");
        keydown('escape');
        expect(editor.getText()).toBe("  abc\n  012\n  def\n    4spaces\n");
        keydown('.');
        expect(editor.getText()).toBe("  abc\n  012\n  def\n  def\n    4spaces\n");
        editor.setCursorScreenPosition([4, 1]);
        keydown('.');
        return expect(editor.getText()).toBe("  abc\n  def\n  def\n  012\n    4spaces\n    def\n");
      });
      return it("is undoable", function() {
        keydown('o');
        editor.insertText("def");
        keydown('escape');
        expect(editor.getText()).toBe("abc\n  012\n  def\n");
        keydown('u');
        return expect(editor.getText()).toBe("abc\n  012\n");
      });
    });
    describe("the a keybinding", function() {
      beforeEach(function() {
        return editor.getBuffer().setText("012\n");
      });
      describe("at the beginning of the line", function() {
        beforeEach(function() {
          editor.setCursorScreenPosition([0, 0]);
          return keydown('a');
        });
        return it("switches to insert mode and shifts to the right", function() {
          expect(editor.getCursorScreenPosition()).toEqual([0, 1]);
          return expect(editorElement.classList.contains('insert-mode')).toBe(true);
        });
      });
      return describe("at the end of the line", function() {
        beforeEach(function() {
          editor.setCursorScreenPosition([0, 3]);
          return keydown('a');
        });
        return it("doesn't linewrap", function() {
          return expect(editor.getCursorScreenPosition()).toEqual([0, 3]);
        });
      });
    });
    describe("the A keybinding", function() {
      beforeEach(function() {
        return editor.getBuffer().setText("11\n22\n");
      });
      return describe("at the beginning of a line", function() {
        it("switches to insert mode at the end of the line", function() {
          editor.setCursorScreenPosition([0, 0]);
          keydown('A', {
            shift: true
          });
          expect(editorElement.classList.contains('insert-mode')).toBe(true);
          return expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
        });
        return it("repeats always as insert at the end of the line", function() {
          editor.setCursorScreenPosition([0, 0]);
          keydown('A', {
            shift: true
          });
          editor.insertText("abc");
          keydown('escape');
          editor.setCursorScreenPosition([1, 0]);
          keydown('.');
          expect(editor.getText()).toBe("11abc\n22abc\n");
          expect(editorElement.classList.contains('insert-mode')).toBe(false);
          return expect(editor.getCursorScreenPosition()).toEqual([1, 4]);
        });
      });
    });
    describe("the I keybinding", function() {
      beforeEach(function() {
        return editor.getBuffer().setText("11\n  22\n");
      });
      return describe("at the end of a line", function() {
        it("switches to insert mode at the beginning of the line", function() {
          editor.setCursorScreenPosition([0, 2]);
          keydown('I', {
            shift: true
          });
          expect(editorElement.classList.contains('insert-mode')).toBe(true);
          return expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
        });
        it("switches to insert mode after leading whitespace", function() {
          editor.setCursorScreenPosition([1, 4]);
          keydown('I', {
            shift: true
          });
          expect(editorElement.classList.contains('insert-mode')).toBe(true);
          return expect(editor.getCursorScreenPosition()).toEqual([1, 2]);
        });
        return it("repeats always as insert at the first character of the line", function() {
          editor.setCursorScreenPosition([0, 2]);
          keydown('I', {
            shift: true
          });
          editor.insertText("abc");
          keydown('escape');
          expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
          editor.setCursorScreenPosition([1, 4]);
          keydown('.');
          expect(editor.getText()).toBe("abc11\n  abc22\n");
          expect(editorElement.classList.contains('insert-mode')).toBe(false);
          return expect(editor.getCursorScreenPosition()).toEqual([1, 4]);
        });
      });
    });
    describe("the J keybinding", function() {
      beforeEach(function() {
        editor.getBuffer().setText("012\n    456\n");
        return editor.setCursorScreenPosition([0, 1]);
      });
      describe("without repeating", function() {
        beforeEach(function() {
          return keydown('J', {
            shift: true
          });
        });
        return it("joins the contents of the current line with the one below it", function() {
          return expect(editor.getText()).toBe("012 456\n");
        });
      });
      return describe("with repeating", function() {
        beforeEach(function() {
          editor.setText("12345\nabcde\nABCDE\nQWERT");
          editor.setCursorScreenPosition([1, 1]);
          keydown('2');
          return keydown('J', {
            shift: true
          });
        });
        return describe("undo behavior", function() {
          beforeEach(function() {
            return keydown('u');
          });
          return it("handles repeats", function() {
            return expect(editor.getText()).toBe("12345\nabcde\nABCDE\nQWERT");
          });
        });
      });
    });
    describe("the > keybinding", function() {
      beforeEach(function() {
        return editor.setText("12345\nabcde\nABCDE");
      });
      describe("on the last line", function() {
        beforeEach(function() {
          return editor.setCursorScreenPosition([2, 0]);
        });
        return describe("when followed by a >", function() {
          beforeEach(function() {
            keydown('>');
            return keydown('>');
          });
          return it("indents the current line", function() {
            expect(editor.getText()).toBe("12345\nabcde\n  ABCDE");
            return expect(editor.getCursorScreenPosition()).toEqual([2, 2]);
          });
        });
      });
      describe("on the first line", function() {
        beforeEach(function() {
          return editor.setCursorScreenPosition([0, 0]);
        });
        describe("when followed by a >", function() {
          beforeEach(function() {
            keydown('>');
            return keydown('>');
          });
          return it("indents the current line", function() {
            expect(editor.getText()).toBe("  12345\nabcde\nABCDE");
            return expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
          });
        });
        return describe("when followed by a repeating >", function() {
          beforeEach(function() {
            keydown('3');
            keydown('>');
            return keydown('>');
          });
          it("indents multiple lines at once", function() {
            expect(editor.getText()).toBe("  12345\n  abcde\n  ABCDE");
            return expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
          });
          return describe("undo behavior", function() {
            beforeEach(function() {
              return keydown('u');
            });
            return it("outdents all three lines", function() {
              return expect(editor.getText()).toBe("12345\nabcde\nABCDE");
            });
          });
        });
      });
      describe("in visual mode linewise", function() {
        beforeEach(function() {
          editor.setCursorScreenPosition([0, 0]);
          keydown('v', {
            shift: true
          });
          return keydown('j');
        });
        describe("single indent multiple lines", function() {
          beforeEach(function() {
            return keydown('>');
          });
          it("indents both lines once and exits visual mode", function() {
            expect(editorElement.classList.contains('normal-mode')).toBe(true);
            expect(editor.getText()).toBe("  12345\n  abcde\nABCDE");
            return expect(editor.getSelectedBufferRanges()).toEqual([[[0, 2], [0, 2]]]);
          });
          return it("allows repeating the operation", function() {
            keydown('.');
            return expect(editor.getText()).toBe("    12345\n    abcde\nABCDE");
          });
        });
        return describe("multiple indent multiple lines", function() {
          beforeEach(function() {
            keydown('2');
            return keydown('>');
          });
          return it("indents both lines twice and exits visual mode", function() {
            expect(editorElement.classList.contains('normal-mode')).toBe(true);
            expect(editor.getText()).toBe("    12345\n    abcde\nABCDE");
            return expect(editor.getSelectedBufferRanges()).toEqual([[[0, 4], [0, 4]]]);
          });
        });
      });
      return describe("with multiple selections", function() {
        beforeEach(function() {
          editor.setCursorScreenPosition([1, 3]);
          keydown('v');
          keydown('j');
          return editor.addCursorAtScreenPosition([0, 0]);
        });
        return it("indents the lines and keeps the cursors", function() {
          keydown('>');
          expect(editor.getText()).toBe("  12345\n  abcde\n  ABCDE");
          return expect(editor.getCursorScreenPositions()).toEqual([[1, 2], [0, 2]]);
        });
      });
    });
    describe("the < keybinding", function() {
      beforeEach(function() {
        editor.setText("    12345\n    abcde\nABCDE");
        return editor.setCursorScreenPosition([0, 0]);
      });
      describe("when followed by a <", function() {
        beforeEach(function() {
          keydown('<');
          return keydown('<');
        });
        return it("outdents the current line", function() {
          expect(editor.getText()).toBe("  12345\n    abcde\nABCDE");
          return expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
        });
      });
      describe("when followed by a repeating <", function() {
        beforeEach(function() {
          keydown('2');
          keydown('<');
          return keydown('<');
        });
        it("outdents multiple lines at once", function() {
          expect(editor.getText()).toBe("  12345\n  abcde\nABCDE");
          return expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
        });
        return describe("undo behavior", function() {
          beforeEach(function() {
            return keydown('u');
          });
          return it("indents both lines", function() {
            return expect(editor.getText()).toBe("    12345\n    abcde\nABCDE");
          });
        });
      });
      return describe("in visual mode linewise", function() {
        beforeEach(function() {
          keydown('v', {
            shift: true
          });
          return keydown('j');
        });
        describe("single outdent multiple lines", function() {
          beforeEach(function() {
            return keydown('<');
          });
          it("outdents the current line and exits visual mode", function() {
            expect(editorElement.classList.contains('normal-mode')).toBe(true);
            expect(editor.getText()).toBe("  12345\n  abcde\nABCDE");
            return expect(editor.getSelectedBufferRanges()).toEqual([[[0, 2], [0, 2]]]);
          });
          return it("allows repeating the operation", function() {
            keydown('.');
            return expect(editor.getText()).toBe("12345\nabcde\nABCDE");
          });
        });
        return describe("multiple outdent multiple lines", function() {
          beforeEach(function() {
            keydown('2');
            return keydown('<');
          });
          return it("outdents both lines twice and exits visual mode", function() {
            expect(editorElement.classList.contains('normal-mode')).toBe(true);
            expect(editor.getText()).toBe("12345\nabcde\nABCDE");
            return expect(editor.getSelectedBufferRanges()).toEqual([[[0, 0], [0, 0]]]);
          });
        });
      });
    });
    describe("the = keybinding", function() {
      var oldGrammar;
      oldGrammar = [];
      beforeEach(function() {
        waitsForPromise(function() {
          return atom.packages.activatePackage('language-javascript');
        });
        oldGrammar = editor.getGrammar();
        editor.setText("foo\n  bar\n  baz");
        return editor.setCursorScreenPosition([1, 0]);
      });
      return describe("when used in a scope that supports auto-indent", function() {
        beforeEach(function() {
          var jsGrammar;
          jsGrammar = atom.grammars.grammarForScopeName('source.js');
          return editor.setGrammar(jsGrammar);
        });
        afterEach(function() {
          return editor.setGrammar(oldGrammar);
        });
        describe("when followed by a =", function() {
          beforeEach(function() {
            keydown('=');
            return keydown('=');
          });
          return it("indents the current line", function() {
            return expect(editor.indentationForBufferRow(1)).toBe(0);
          });
        });
        describe("when followed by a G", function() {
          beforeEach(function() {
            editor.setCursorScreenPosition([0, 0]);
            keydown('=');
            return keydown('G', {
              shift: true
            });
          });
          return it("uses the default count", function() {
            expect(editor.indentationForBufferRow(1)).toBe(0);
            return expect(editor.indentationForBufferRow(2)).toBe(0);
          });
        });
        return describe("when followed by a repeating =", function() {
          beforeEach(function() {
            keydown('2');
            keydown('=');
            return keydown('=');
          });
          it("autoindents multiple lines at once", function() {
            expect(editor.getText()).toBe("foo\nbar\nbaz");
            return expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
          });
          return describe("undo behavior", function() {
            beforeEach(function() {
              return keydown('u');
            });
            return it("indents both lines", function() {
              return expect(editor.getText()).toBe("foo\n  bar\n  baz");
            });
          });
        });
      });
    });
    describe("the . keybinding", function() {
      beforeEach(function() {
        editor.setText("12\n34\n56\n78");
        return editor.setCursorScreenPosition([0, 0]);
      });
      it("repeats the last operation", function() {
        keydown('2');
        keydown('d');
        keydown('d');
        keydown('.');
        return expect(editor.getText()).toBe("");
      });
      return it("composes with motions", function() {
        keydown('d');
        keydown('d');
        keydown('2');
        keydown('.');
        return expect(editor.getText()).toBe("78");
      });
    });
    describe("the r keybinding", function() {
      beforeEach(function() {
        editor.setText("12\n34\n\n");
        editor.setCursorBufferPosition([0, 0]);
        return editor.addCursorAtBufferPosition([1, 0]);
      });
      it("replaces a single character", function() {
        keydown('r');
        normalModeInputKeydown('x');
        return expect(editor.getText()).toBe('x2\nx4\n\n');
      });
      it("does nothing when cancelled", function() {
        keydown('r');
        expect(editorElement.classList.contains('operator-pending-mode')).toBe(true);
        keydown('escape');
        expect(editor.getText()).toBe('12\n34\n\n');
        return expect(editorElement.classList.contains('normal-mode')).toBe(true);
      });
      it("replaces a single character with a line break", function() {
        keydown('r');
        atom.commands.dispatch(editor.normalModeInputView.editorElement, 'core:confirm');
        expect(editor.getText()).toBe('\n2\n\n4\n\n');
        return expect(editor.getCursorBufferPositions()).toEqual([[1, 0], [3, 0]]);
      });
      it("composes properly with motions", function() {
        keydown('2');
        keydown('r');
        normalModeInputKeydown('x');
        return expect(editor.getText()).toBe('xx\nxx\n\n');
      });
      it("does nothing on an empty line", function() {
        editor.setCursorBufferPosition([2, 0]);
        keydown('r');
        normalModeInputKeydown('x');
        return expect(editor.getText()).toBe('12\n34\n\n');
      });
      it("does nothing if asked to replace more characters than there are on a line", function() {
        keydown('3');
        keydown('r');
        normalModeInputKeydown('x');
        return expect(editor.getText()).toBe('12\n34\n\n');
      });
      describe("when in visual mode", function() {
        beforeEach(function() {
          keydown('v');
          return keydown('e');
        });
        it("replaces the entire selection with the given character", function() {
          keydown('r');
          normalModeInputKeydown('x');
          return expect(editor.getText()).toBe('xx\nxx\n\n');
        });
        return it("leaves the cursor at the beginning of the selection", function() {
          keydown('r');
          normalModeInputKeydown('x');
          return expect(editor.getCursorBufferPositions()).toEqual([[0, 0], [1, 0]]);
        });
      });
      return describe('with accented characters', function() {
        var buildIMECompositionEvent, buildTextInputEvent;
        buildIMECompositionEvent = function(event, _arg) {
          var data, target, _ref1;
          _ref1 = _arg != null ? _arg : {}, data = _ref1.data, target = _ref1.target;
          event = new Event(event);
          event.data = data;
          Object.defineProperty(event, 'target', {
            get: function() {
              return target;
            }
          });
          return event;
        };
        buildTextInputEvent = function(_arg) {
          var data, event, target;
          data = _arg.data, target = _arg.target;
          event = new Event('textInput');
          event.data = data;
          Object.defineProperty(event, 'target', {
            get: function() {
              return target;
            }
          });
          return event;
        };
        return it('works with IME composition', function() {
          var domNode, inputNode, normalModeEditor;
          keydown('r');
          normalModeEditor = editor.normalModeInputView.editorElement;
          jasmine.attachToDOM(normalModeEditor);
          domNode = normalModeEditor.component.domNode;
          inputNode = domNode.querySelector('.hidden-input');
          domNode.dispatchEvent(buildIMECompositionEvent('compositionstart', {
            target: inputNode
          }));
          domNode.dispatchEvent(buildIMECompositionEvent('compositionupdate', {
            data: 's',
            target: inputNode
          }));
          expect(normalModeEditor.getModel().getText()).toEqual('s');
          domNode.dispatchEvent(buildIMECompositionEvent('compositionupdate', {
            data: 'sd',
            target: inputNode
          }));
          expect(normalModeEditor.getModel().getText()).toEqual('sd');
          domNode.dispatchEvent(buildIMECompositionEvent('compositionend', {
            target: inputNode
          }));
          domNode.dispatchEvent(buildTextInputEvent({
            data: '速度',
            target: inputNode
          }));
          return expect(editor.getText()).toBe('速度2\n速度4\n\n');
        });
      });
    });
    describe('the m keybinding', function() {
      beforeEach(function() {
        editor.setText('12\n34\n56\n');
        return editor.setCursorBufferPosition([0, 1]);
      });
      return it('marks a position', function() {
        keydown('m');
        normalModeInputKeydown('a');
        return expect(vimState.getMark('a')).toEqual([0, 1]);
      });
    });
    describe('the ~ keybinding', function() {
      beforeEach(function() {
        editor.setText('aBc\nXyZ');
        editor.setCursorBufferPosition([0, 0]);
        return editor.addCursorAtBufferPosition([1, 0]);
      });
      it('toggles the case and moves right', function() {
        keydown('~');
        expect(editor.getText()).toBe('ABc\nxyZ');
        expect(editor.getCursorScreenPositions()).toEqual([[0, 1], [1, 1]]);
        keydown('~');
        expect(editor.getText()).toBe('Abc\nxYZ');
        expect(editor.getCursorScreenPositions()).toEqual([[0, 2], [1, 2]]);
        keydown('~');
        expect(editor.getText()).toBe('AbC\nxYz');
        return expect(editor.getCursorScreenPositions()).toEqual([[0, 2], [1, 2]]);
      });
      it('takes a count', function() {
        keydown('4');
        keydown('~');
        expect(editor.getText()).toBe('AbC\nxYz');
        return expect(editor.getCursorScreenPositions()).toEqual([[0, 2], [1, 2]]);
      });
      describe("in visual mode", function() {
        return it("toggles the case of the selected text", function() {
          editor.setCursorBufferPosition([0, 0]);
          keydown("V", {
            shift: true
          });
          keydown("~");
          return expect(editor.getText()).toBe('AbC\nXyZ');
        });
      });
      return describe("with g and motion", function() {
        it("toggles the case of text", function() {
          editor.setCursorBufferPosition([0, 0]);
          keydown("g");
          keydown("~");
          keydown("2");
          keydown("l");
          return expect(editor.getText()).toBe('Abc\nXyZ');
        });
        return it("uses default count", function() {
          editor.setCursorBufferPosition([0, 0]);
          keydown("g");
          keydown("~");
          keydown("G", {
            shift: true
          });
          return expect(editor.getText()).toBe('AbC\nxYz');
        });
      });
    });
    describe('the U keybinding', function() {
      beforeEach(function() {
        editor.setText('aBc\nXyZ');
        return editor.setCursorBufferPosition([0, 0]);
      });
      it("makes text uppercase with g and motion", function() {
        keydown("g");
        keydown("U", {
          shift: true
        });
        keydown("l");
        expect(editor.getText()).toBe('ABc\nXyZ');
        keydown("g");
        keydown("U", {
          shift: true
        });
        keydown("e");
        expect(editor.getText()).toBe('ABC\nXyZ');
        editor.setCursorBufferPosition([1, 0]);
        keydown("g");
        keydown("U", {
          shift: true
        });
        keydown("$");
        expect(editor.getText()).toBe('ABC\nXYZ');
        return expect(editor.getCursorScreenPosition()).toEqual([1, 2]);
      });
      it("uses default count", function() {
        editor.setCursorBufferPosition([0, 0]);
        keydown("g");
        keydown("U", {
          shift: true
        });
        keydown("G", {
          shift: true
        });
        return expect(editor.getText()).toBe('ABC\nXYZ');
      });
      return it("makes the selected text uppercase in visual mode", function() {
        keydown("V", {
          shift: true
        });
        keydown("U", {
          shift: true
        });
        return expect(editor.getText()).toBe('ABC\nXyZ');
      });
    });
    describe('the u keybinding', function() {
      beforeEach(function() {
        editor.setText('aBc\nXyZ');
        return editor.setCursorBufferPosition([0, 0]);
      });
      it("makes text lowercase with g and motion", function() {
        keydown("g");
        keydown("u");
        keydown("$");
        expect(editor.getText()).toBe('abc\nXyZ');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
      });
      it("uses default count", function() {
        editor.setCursorBufferPosition([0, 0]);
        keydown("g");
        keydown("u");
        keydown("G", {
          shift: true
        });
        return expect(editor.getText()).toBe('abc\nxyz');
      });
      return it("makes the selected text lowercase in visual mode", function() {
        keydown("V", {
          shift: true
        });
        keydown("u");
        return expect(editor.getText()).toBe('abc\nXyZ');
      });
    });
    describe("the i keybinding", function() {
      beforeEach(function() {
        editor.setText('123\n4567');
        editor.setCursorBufferPosition([0, 0]);
        return editor.addCursorAtBufferPosition([1, 0]);
      });
      it("allows undoing an entire batch of typing", function() {
        keydown('i');
        editor.insertText("abcXX");
        editor.backspace();
        editor.backspace();
        keydown('escape');
        expect(editor.getText()).toBe("abc123\nabc4567");
        keydown('i');
        editor.insertText("d");
        editor.insertText("e");
        editor.insertText("f");
        keydown('escape');
        expect(editor.getText()).toBe("abdefc123\nabdefc4567");
        keydown('u');
        expect(editor.getText()).toBe("abc123\nabc4567");
        keydown('u');
        return expect(editor.getText()).toBe("123\n4567");
      });
      it("allows repeating typing", function() {
        keydown('i');
        editor.insertText("abcXX");
        editor.backspace();
        editor.backspace();
        keydown('escape');
        expect(editor.getText()).toBe("abc123\nabc4567");
        keydown('.');
        expect(editor.getText()).toBe("ababcc123\nababcc4567");
        keydown('.');
        return expect(editor.getText()).toBe("abababccc123\nabababccc4567");
      });
      return describe('with nonlinear input', function() {
        beforeEach(function() {
          editor.setText('');
          return editor.setCursorBufferPosition([0, 0]);
        });
        it('deals with auto-matched brackets', function() {
          keydown('i');
          editor.insertText('()');
          editor.moveLeft();
          editor.insertText('a');
          editor.moveRight();
          editor.insertText('b\n');
          keydown('escape');
          expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
          keydown('.');
          expect(editor.getText()).toBe('(a)b\n(a)b\n');
          return expect(editor.getCursorScreenPosition()).toEqual([2, 0]);
        });
        return it('deals with autocomplete', function() {
          keydown('i');
          editor.insertText('a');
          editor.insertText('d');
          editor.insertText('d');
          editor.setTextInBufferRange([[0, 0], [0, 3]], 'addFoo');
          keydown('escape');
          expect(editor.getCursorScreenPosition()).toEqual([0, 5]);
          expect(editor.getText()).toBe('addFoo');
          keydown('.');
          expect(editor.getText()).toBe('addFoaddFooo');
          return expect(editor.getCursorScreenPosition()).toEqual([0, 10]);
        });
      });
    });
    describe('the a keybinding', function() {
      beforeEach(function() {
        editor.setText('');
        return editor.setCursorBufferPosition([0, 0]);
      });
      it("can be undone in one go", function() {
        keydown('a');
        editor.insertText("abc");
        keydown('escape');
        expect(editor.getText()).toBe("abc");
        keydown('u');
        return expect(editor.getText()).toBe("");
      });
      return it("repeats correctly", function() {
        keydown('a');
        editor.insertText("abc");
        keydown('escape');
        expect(editor.getText()).toBe("abc");
        expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
        keydown('.');
        expect(editor.getText()).toBe("abcabc");
        return expect(editor.getCursorScreenPosition()).toEqual([0, 5]);
      });
    });
    describe("the ctrl-a/ctrl-x keybindings", function() {
      beforeEach(function() {
        atom.config.set('vim-mode.numberRegex', settings.config.numberRegex["default"]);
        editor.setText('123\nab45\ncd-67ef\nab-5\na-bcdef');
        editor.setCursorBufferPosition([0, 0]);
        editor.addCursorAtBufferPosition([1, 0]);
        editor.addCursorAtBufferPosition([2, 0]);
        editor.addCursorAtBufferPosition([3, 3]);
        return editor.addCursorAtBufferPosition([4, 0]);
      });
      describe("increasing numbers", function() {
        it("increases the next number", function() {
          keydown('a', {
            ctrl: true
          });
          expect(editor.getCursorBufferPositions()).toEqual([[0, 2], [1, 3], [2, 4], [3, 3], [4, 0]]);
          expect(editor.getText()).toBe('124\nab46\ncd-66ef\nab-4\na-bcdef');
          return expect(atom.beep).not.toHaveBeenCalled();
        });
        it("repeats with .", function() {
          keydown('a', {
            ctrl: true
          });
          keydown('.');
          expect(editor.getCursorBufferPositions()).toEqual([[0, 2], [1, 3], [2, 4], [3, 3], [4, 0]]);
          expect(editor.getText()).toBe('125\nab47\ncd-65ef\nab-3\na-bcdef');
          return expect(atom.beep).not.toHaveBeenCalled();
        });
        it("can have a count", function() {
          keydown('5');
          keydown('a', {
            ctrl: true
          });
          expect(editor.getCursorBufferPositions()).toEqual([[0, 2], [1, 3], [2, 4], [3, 2], [4, 0]]);
          expect(editor.getText()).toBe('128\nab50\ncd-62ef\nab0\na-bcdef');
          return expect(atom.beep).not.toHaveBeenCalled();
        });
        it("can make a negative number positive, change number of digits", function() {
          keydown('9');
          keydown('9');
          keydown('a', {
            ctrl: true
          });
          expect(editor.getCursorBufferPositions()).toEqual([[0, 2], [1, 4], [2, 3], [3, 3], [4, 0]]);
          expect(editor.getText()).toBe('222\nab144\ncd32ef\nab94\na-bcdef');
          return expect(atom.beep).not.toHaveBeenCalled();
        });
        it("does nothing when cursor is after the number", function() {
          editor.setCursorBufferPosition([2, 5]);
          keydown('a', {
            ctrl: true
          });
          expect(editor.getCursorBufferPositions()).toEqual([[2, 5]]);
          expect(editor.getText()).toBe('123\nab45\ncd-67ef\nab-5\na-bcdef');
          return expect(atom.beep).toHaveBeenCalled();
        });
        it("does nothing on an empty line", function() {
          editor.setText('\n');
          editor.setCursorBufferPosition([0, 0]);
          editor.addCursorAtBufferPosition([1, 0]);
          keydown('a', {
            ctrl: true
          });
          expect(editor.getCursorBufferPositions()).toEqual([[0, 0], [1, 0]]);
          expect(editor.getText()).toBe('\n');
          return expect(atom.beep).toHaveBeenCalled();
        });
        return it("honours the vim-mode:numberRegex setting", function() {
          editor.setText('123\nab45\ncd -67ef\nab-5\na-bcdef');
          editor.setCursorBufferPosition([0, 0]);
          editor.addCursorAtBufferPosition([1, 0]);
          editor.addCursorAtBufferPosition([2, 0]);
          editor.addCursorAtBufferPosition([3, 3]);
          editor.addCursorAtBufferPosition([4, 0]);
          atom.config.set('vim-mode.numberRegex', '(?:\\B-)?[0-9]+');
          keydown('a', {
            ctrl: true
          });
          expect(editor.getCursorBufferPositions()).toEqual([[0, 2], [1, 3], [2, 5], [3, 3], [4, 0]]);
          expect(editor.getText()).toBe('124\nab46\ncd -66ef\nab-6\na-bcdef');
          return expect(atom.beep).not.toHaveBeenCalled();
        });
      });
      return describe("decreasing numbers", function() {
        it("decreases the next number", function() {
          keydown('x', {
            ctrl: true
          });
          expect(editor.getCursorBufferPositions()).toEqual([[0, 2], [1, 3], [2, 4], [3, 3], [4, 0]]);
          expect(editor.getText()).toBe('122\nab44\ncd-68ef\nab-6\na-bcdef');
          return expect(atom.beep).not.toHaveBeenCalled();
        });
        it("repeats with .", function() {
          keydown('x', {
            ctrl: true
          });
          keydown('.');
          expect(editor.getCursorBufferPositions()).toEqual([[0, 2], [1, 3], [2, 4], [3, 3], [4, 0]]);
          expect(editor.getText()).toBe('121\nab43\ncd-69ef\nab-7\na-bcdef');
          return expect(atom.beep).not.toHaveBeenCalled();
        });
        it("can have a count", function() {
          keydown('5');
          keydown('x', {
            ctrl: true
          });
          expect(editor.getCursorBufferPositions()).toEqual([[0, 2], [1, 3], [2, 4], [3, 4], [4, 0]]);
          expect(editor.getText()).toBe('118\nab40\ncd-72ef\nab-10\na-bcdef');
          return expect(atom.beep).not.toHaveBeenCalled();
        });
        it("can make a positive number negative, change number of digits", function() {
          keydown('9');
          keydown('9');
          keydown('x', {
            ctrl: true
          });
          expect(editor.getCursorBufferPositions()).toEqual([[0, 1], [1, 4], [2, 5], [3, 5], [4, 0]]);
          expect(editor.getText()).toBe('24\nab-54\ncd-166ef\nab-104\na-bcdef');
          return expect(atom.beep).not.toHaveBeenCalled();
        });
        it("does nothing when cursor is after the number", function() {
          editor.setCursorBufferPosition([2, 5]);
          keydown('x', {
            ctrl: true
          });
          expect(editor.getCursorBufferPositions()).toEqual([[2, 5]]);
          expect(editor.getText()).toBe('123\nab45\ncd-67ef\nab-5\na-bcdef');
          return expect(atom.beep).toHaveBeenCalled();
        });
        it("does nothing on an empty line", function() {
          editor.setText('\n');
          editor.setCursorBufferPosition([0, 0]);
          editor.addCursorAtBufferPosition([1, 0]);
          keydown('x', {
            ctrl: true
          });
          expect(editor.getCursorBufferPositions()).toEqual([[0, 0], [1, 0]]);
          expect(editor.getText()).toBe('\n');
          return expect(atom.beep).toHaveBeenCalled();
        });
        return it("honours the vim-mode:numberRegex setting", function() {
          editor.setText('123\nab45\ncd -67ef\nab-5\na-bcdef');
          editor.setCursorBufferPosition([0, 0]);
          editor.addCursorAtBufferPosition([1, 0]);
          editor.addCursorAtBufferPosition([2, 0]);
          editor.addCursorAtBufferPosition([3, 3]);
          editor.addCursorAtBufferPosition([4, 0]);
          atom.config.set('vim-mode.numberRegex', '(?:\\B-)?[0-9]+');
          keydown('x', {
            ctrl: true
          });
          expect(editor.getCursorBufferPositions()).toEqual([[0, 2], [1, 3], [2, 5], [3, 3], [4, 0]]);
          expect(editor.getText()).toBe('122\nab44\ncd -68ef\nab-4\na-bcdef');
          return expect(atom.beep).not.toHaveBeenCalled();
        });
      });
    });
    return describe('the R keybinding', function() {
      beforeEach(function() {
        editor.setText('12345\n67890');
        return editor.setCursorBufferPosition([0, 2]);
      });
      it("enters replace mode and replaces characters", function() {
        keydown("R", {
          shift: true
        });
        expect(editorElement.classList.contains('insert-mode')).toBe(true);
        expect(editorElement.classList.contains('replace-mode')).toBe(true);
        editor.insertText("ab");
        keydown('escape');
        expect(editor.getText()).toBe("12ab5\n67890");
        expect(editor.getCursorScreenPosition()).toEqual([0, 3]);
        expect(editorElement.classList.contains('insert-mode')).toBe(false);
        expect(editorElement.classList.contains('replace-mode')).toBe(false);
        return expect(editorElement.classList.contains('normal-mode')).toBe(true);
      });
      it("continues beyond end of line as insert", function() {
        keydown("R", {
          shift: true
        });
        expect(editorElement.classList.contains('insert-mode')).toBe(true);
        expect(editorElement.classList.contains('replace-mode')).toBe(true);
        editor.insertText("abcde");
        keydown('escape');
        return expect(editor.getText()).toBe("12abcde\n67890");
      });
      it("treats backspace as undo", function() {
        editor.insertText("foo");
        keydown("R", {
          shift: true
        });
        editor.insertText("a");
        editor.insertText("b");
        expect(editor.getText()).toBe("12fooab5\n67890");
        keydown('backspace', {
          raw: true
        });
        expect(editor.getText()).toBe("12fooa45\n67890");
        editor.insertText("c");
        expect(editor.getText()).toBe("12fooac5\n67890");
        keydown('backspace', {
          raw: true
        });
        keydown('backspace', {
          raw: true
        });
        expect(editor.getText()).toBe("12foo345\n67890");
        expect(editor.getSelectedText()).toBe("");
        keydown('backspace', {
          raw: true
        });
        expect(editor.getText()).toBe("12foo345\n67890");
        return expect(editor.getSelectedText()).toBe("");
      });
      it("can be repeated", function() {
        keydown("R", {
          shift: true
        });
        editor.insertText("ab");
        keydown('escape');
        editor.setCursorBufferPosition([1, 2]);
        keydown('.');
        expect(editor.getText()).toBe("12ab5\n67ab0");
        expect(editor.getCursorScreenPosition()).toEqual([1, 3]);
        editor.setCursorBufferPosition([0, 4]);
        keydown('.');
        expect(editor.getText()).toBe("12abab\n67ab0");
        return expect(editor.getCursorScreenPosition()).toEqual([0, 5]);
      });
      it("can be interrupted by arrow keys and behave as insert for repeat", function() {});
      it("repeats correctly when backspace was used in the text", function() {
        keydown("R", {
          shift: true
        });
        editor.insertText("a");
        keydown('backspace', {
          raw: true
        });
        editor.insertText("b");
        keydown('escape');
        editor.setCursorBufferPosition([1, 2]);
        keydown('.');
        expect(editor.getText()).toBe("12b45\n67b90");
        expect(editor.getCursorScreenPosition()).toEqual([1, 2]);
        editor.setCursorBufferPosition([0, 4]);
        keydown('.');
        expect(editor.getText()).toBe("12b4b\n67b90");
        return expect(editor.getCursorScreenPosition()).toEqual([0, 4]);
      });
      return it("doesn't replace a character if newline is entered", function() {
        keydown("R", {
          shift: true
        });
        expect(editorElement.classList.contains('insert-mode')).toBe(true);
        expect(editorElement.classList.contains('replace-mode')).toBe(true);
        editor.insertText("\n");
        keydown('escape');
        return expect(editor.getText()).toBe("12\n345\n67890");
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3ZpbS1tb2RlL3NwZWMvb3BlcmF0b3JzLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlCQUFBOztBQUFBLEVBQUEsT0FBQSxHQUFVLE9BQUEsQ0FBUSxlQUFSLENBQVYsQ0FBQTs7QUFBQSxFQUNBLFFBQUEsR0FBVyxPQUFBLENBQVEsaUJBQVIsQ0FEWCxDQUFBOztBQUFBLEVBR0EsUUFBQSxDQUFTLFdBQVQsRUFBc0IsU0FBQSxHQUFBO0FBQ3BCLFFBQUEsc0VBQUE7QUFBQSxJQUFBLE9BQW9DLEVBQXBDLEVBQUMsZ0JBQUQsRUFBUyx1QkFBVCxFQUF3QixrQkFBeEIsQ0FBQTtBQUFBLElBRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFVBQUEsT0FBQTtBQUFBLE1BQUEsT0FBQSxHQUFVLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBZCxDQUEwQixVQUExQixDQUFWLENBQUE7QUFBQSxNQUNBLE9BQU8sQ0FBQyxpQkFBUixDQUFBLENBREEsQ0FBQTthQUdBLE9BQU8sQ0FBQyxnQkFBUixDQUF5QixTQUFDLE9BQUQsR0FBQTtBQUN2QixRQUFBLGFBQUEsR0FBZ0IsT0FBaEIsQ0FBQTtBQUFBLFFBQ0EsTUFBQSxHQUFTLGFBQWEsQ0FBQyxRQUFkLENBQUEsQ0FEVCxDQUFBO0FBQUEsUUFFQSxRQUFBLEdBQVcsYUFBYSxDQUFDLFFBRnpCLENBQUE7QUFBQSxRQUdBLFFBQVEsQ0FBQyxrQkFBVCxDQUFBLENBSEEsQ0FBQTtlQUlBLFFBQVEsQ0FBQyxlQUFULENBQUEsRUFMdUI7TUFBQSxDQUF6QixFQUpTO0lBQUEsQ0FBWCxDQUZBLENBQUE7QUFBQSxJQWFBLE9BQUEsR0FBVSxTQUFDLEdBQUQsRUFBTSxPQUFOLEdBQUE7O1FBQU0sVUFBUTtPQUN0Qjs7UUFBQSxP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

//# sourceURL=/Users/ah/.atom/packages/vim-mode/spec/operators-spec.coffee
