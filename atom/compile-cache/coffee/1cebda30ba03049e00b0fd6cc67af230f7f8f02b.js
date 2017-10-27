(function() {
  var helpers;

  helpers = require('./spec-helper');

  describe("Motions", function() {
    var editor, editorElement, keydown, normalModeInputKeydown, submitNormalModeInputText, vimState, _ref;
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
      var theEditor;
      if (opts == null) {
        opts = {};
      }
      theEditor = opts.editor || editor;
      return theEditor.normalModeInputView.editorElement.getModel().setText(key);
    };
    submitNormalModeInputText = function(text) {
      var inputEditor;
      inputEditor = editor.normalModeInputView.editorElement;
      inputEditor.getModel().setText(text);
      return atom.commands.dispatch(inputEditor, "core:confirm");
    };
    describe("simple motions", function() {
      beforeEach(function() {
        editor.setText("12345\nabcd\nABCDE");
        return editor.setCursorScreenPosition([1, 1]);
      });
      describe("the h keybinding", function() {
        describe("as a motion", function() {
          it("moves the cursor left, but not to the previous line", function() {
            keydown('h');
            expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
            keydown('h');
            return expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
          });
          return it("moves the cursor to the previous line if wrapLeftRightMotion is true", function() {
            atom.config.set('vim-mode.wrapLeftRightMotion', true);
            keydown('h');
            keydown('h');
            return expect(editor.getCursorScreenPosition()).toEqual([0, 4]);
          });
        });
        return describe("as a selection", function() {
          return it("selects the character to the left", function() {
            keydown('y');
            keydown('h');
            expect(vimState.getRegister('"').text).toBe('a');
            return expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
          });
        });
      });
      describe("the j keybinding", function() {
        it("moves the cursor down, but not to the end of the last line", function() {
          keydown('j');
          expect(editor.getCursorScreenPosition()).toEqual([2, 1]);
          keydown('j');
          return expect(editor.getCursorScreenPosition()).toEqual([2, 1]);
        });
        it("moves the cursor to the end of the line, not past it", function() {
          editor.setCursorScreenPosition([0, 4]);
          keydown('j');
          return expect(editor.getCursorScreenPosition()).toEqual([1, 3]);
        });
        it("remembers the position it column it was in after moving to shorter line", function() {
          editor.setCursorScreenPosition([0, 4]);
          keydown('j');
          expect(editor.getCursorScreenPosition()).toEqual([1, 3]);
          keydown('j');
          return expect(editor.getCursorScreenPosition()).toEqual([2, 4]);
        });
        return describe("when visual mode", function() {
          beforeEach(function() {
            keydown('v');
            return expect(editor.getCursorScreenPosition()).toEqual([1, 2]);
          });
          it("moves the cursor down", function() {
            keydown('j');
            return expect(editor.getCursorScreenPosition()).toEqual([2, 2]);
          });
          it("doesn't go over after the last line", function() {
            keydown('j');
            return expect(editor.getCursorScreenPosition()).toEqual([2, 2]);
          });
          return it("selects the text while moving", function() {
            keydown('j');
            return expect(editor.getSelectedText()).toBe("bcd\nAB");
          });
        });
      });
      describe("the k keybinding", function() {
        return it("moves the cursor up, but not to the beginning of the first line", function() {
          keydown('k');
          expect(editor.getCursorScreenPosition()).toEqual([0, 1]);
          keydown('k');
          return expect(editor.getCursorScreenPosition()).toEqual([0, 1]);
        });
      });
      return describe("the l keybinding", function() {
        beforeEach(function() {
          return editor.setCursorScreenPosition([1, 2]);
        });
        it("moves the cursor right, but not to the next line", function() {
          keydown('l');
          expect(editor.getCursorScreenPosition()).toEqual([1, 3]);
          keydown('l');
          return expect(editor.getCursorScreenPosition()).toEqual([1, 3]);
        });
        it("moves the cursor to the next line if wrapLeftRightMotion is true", function() {
          atom.config.set('vim-mode.wrapLeftRightMotion', true);
          keydown('l');
          keydown('l');
          return expect(editor.getCursorScreenPosition()).toEqual([2, 0]);
        });
        return describe("on a blank line", function() {
          return it("doesn't move the cursor", function() {
            editor.setText("\n\n\n");
            editor.setCursorBufferPosition([1, 0]);
            keydown('l');
            return expect(editor.getCursorBufferPosition()).toEqual([1, 0]);
          });
        });
      });
    });
    describe("the w keybinding", function() {
      beforeEach(function() {
        return editor.setText("ab cde1+- \n xyz\n\nzip");
      });
      describe("as a motion", function() {
        beforeEach(function() {
          return editor.setCursorScreenPosition([0, 0]);
        });
        it("moves the cursor to the beginning of the next word", function() {
          keydown('w');
          expect(editor.getCursorScreenPosition()).toEqual([0, 3]);
          keydown('w');
          expect(editor.getCursorScreenPosition()).toEqual([0, 7]);
          keydown('w');
          expect(editor.getCursorScreenPosition()).toEqual([1, 1]);
          keydown('w');
          expect(editor.getCursorScreenPosition()).toEqual([2, 0]);
          keydown('w');
          expect(editor.getCursorScreenPosition()).toEqual([3, 0]);
          keydown('w');
          expect(editor.getCursorScreenPosition()).toEqual([3, 2]);
          keydown('w');
          return expect(editor.getCursorScreenPosition()).toEqual([3, 2]);
        });
        return it("moves the cursor to the end of the word if last word in file", function() {
          editor.setText("abc");
          editor.setCursorScreenPosition([0, 0]);
          keydown('w');
          return expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
        });
      });
      return describe("as a selection", function() {
        describe("within a word", function() {
          beforeEach(function() {
            editor.setCursorScreenPosition([0, 0]);
            keydown('y');
            return keydown('w');
          });
          return it("selects to the end of the word", function() {
            return expect(vimState.getRegister('"').text).toBe('ab ');
          });
        });
        return describe("between words", function() {
          beforeEach(function() {
            editor.setCursorScreenPosition([0, 2]);
            keydown('y');
            return keydown('w');
          });
          return it("selects the whitespace", function() {
            return expect(vimState.getRegister('"').text).toBe(' ');
          });
        });
      });
    });
    describe("the W keybinding", function() {
      beforeEach(function() {
        return editor.setText("cde1+- ab \n xyz\n\nzip");
      });
      describe("as a motion", function() {
        beforeEach(function() {
          return editor.setCursorScreenPosition([0, 0]);
        });
        return it("moves the cursor to the beginning of the next word", function() {
          keydown('W', {
            shift: true
          });
          expect(editor.getCursorScreenPosition()).toEqual([0, 7]);
          keydown('W', {
            shift: true
          });
          expect(editor.getCursorScreenPosition()).toEqual([1, 1]);
          keydown('W', {
            shift: true
          });
          expect(editor.getCursorScreenPosition()).toEqual([2, 0]);
          keydown('W', {
            shift: true
          });
          return expect(editor.getCursorScreenPosition()).toEqual([3, 0]);
        });
      });
      return describe("as a selection", function() {
        describe("within a word", function() {
          return it("selects to the end of the whole word", function() {
            editor.setCursorScreenPosition([0, 0]);
            keydown('y');
            keydown('W', {
              shift: true
            });
            return expect(vimState.getRegister('"').text).toBe('cde1+- ');
          });
        });
        it("continues past blank lines", function() {
          editor.setCursorScreenPosition([2, 0]);
          keydown('d');
          keydown('W', {
            shift: true
          });
          expect(editor.getText()).toBe("cde1+- ab \n xyz\nzip");
          return expect(vimState.getRegister('"').text).toBe('\n');
        });
        return it("doesn't go past the end of the file", function() {
          editor.setCursorScreenPosition([3, 0]);
          keydown('d');
          keydown('W', {
            shift: true
          });
          expect(editor.getText()).toBe("cde1+- ab \n xyz\n\n");
          return expect(vimState.getRegister('"').text).toBe('zip');
        });
      });
    });
    describe("the e keybinding", function() {
      beforeEach(function() {
        return editor.setText("ab cde1+- \n xyz\n\nzip");
      });
      describe("as a motion", function() {
        beforeEach(function() {
          return editor.setCursorScreenPosition([0, 0]);
        });
        return it("moves the cursor to the end of the current word", function() {
          keydown('e');
          expect(editor.getCursorScreenPosition()).toEqual([0, 1]);
          keydown('e');
          expect(editor.getCursorScreenPosition()).toEqual([0, 6]);
          keydown('e');
          expect(editor.getCursorScreenPosition()).toEqual([0, 8]);
          keydown('e');
          expect(editor.getCursorScreenPosition()).toEqual([1, 3]);
          keydown('e');
          return expect(editor.getCursorScreenPosition()).toEqual([3, 2]);
        });
      });
      return describe("as selection", function() {
        describe("within a word", function() {
          beforeEach(function() {
            editor.setCursorScreenPosition([0, 0]);
            keydown('y');
            return keydown('e');
          });
          return it("selects to the end of the current word", function() {
            return expect(vimState.getRegister('"').text).toBe('ab');
          });
        });
        return describe("between words", function() {
          beforeEach(function() {
            editor.setCursorScreenPosition([0, 2]);
            keydown('y');
            return keydown('e');
          });
          return it("selects to the end of the next word", function() {
            return expect(vimState.getRegister('"').text).toBe(' cde1');
          });
        });
      });
    });
    describe("the E keybinding", function() {
      beforeEach(function() {
        return editor.setText("ab  cde1+- \n xyz \n\nzip\n");
      });
      describe("as a motion", function() {
        beforeEach(function() {
          return editor.setCursorScreenPosition([0, 0]);
        });
        return it("moves the cursor to the end of the current word", function() {
          keydown('E', {
            shift: true
          });
          expect(editor.getCursorScreenPosition()).toEqual([0, 1]);
          keydown('E', {
            shift: true
          });
          expect(editor.getCursorScreenPosition()).toEqual([0, 9]);
          keydown('E', {
            shift: true
          });
          expect(editor.getCursorScreenPosition()).toEqual([1, 3]);
          keydown('E', {
            shift: true
          });
          expect(editor.getCursorScreenPosition()).toEqual([3, 2]);
          keydown('E', {
            shift: true
          });
          return expect(editor.getCursorScreenPosition()).toEqual([4, 0]);
        });
      });
      return describe("as selection", function() {
        describe("within a word", function() {
          beforeEach(function() {
            editor.setCursorScreenPosition([0, 0]);
            keydown('y');
            return keydown('E', {
              shift: true
            });
          });
          return it("selects to the end of the current word", function() {
            return expect(vimState.getRegister('"').text).toBe('ab');
          });
        });
        describe("between words", function() {
          beforeEach(function() {
            editor.setCursorScreenPosition([0, 2]);
            keydown('y');
            return keydown('E', {
              shift: true
            });
          });
          return it("selects to the end of the next word", function() {
            return expect(vimState.getRegister('"').text).toBe('  cde1+-');
          });
        });
        return describe("press more than once", function() {
          beforeEach(function() {
            editor.setCursorScreenPosition([0, 0]);
            keydown('v');
            keydown('E', {
              shift: true
            });
            keydown('E', {
              shift: true
            });
            return keydown('y');
          });
          return it("selects to the end of the current word", function() {
            return expect(vimState.getRegister('"').text).toBe('ab  cde1+-');
          });
        });
      });
    });
    describe("the } keybinding", function() {
      beforeEach(function() {
        editor.setText("abcde\n\nfghij\nhijk\n  xyz  \n\nzip\n\n  \nthe end");
        return editor.setCursorScreenPosition([0, 0]);
      });
      describe("as a motion", function() {
        return it("moves the cursor to the end of the paragraph", function() {
          keydown('}');
          expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
          keydown('}');
          expect(editor.getCursorScreenPosition()).toEqual([5, 0]);
          keydown('}');
          expect(editor.getCursorScreenPosition()).toEqual([7, 0]);
          keydown('}');
          return expect(editor.getCursorScreenPosition()).toEqual([9, 6]);
        });
      });
      return describe("as a selection", function() {
        beforeEach(function() {
          keydown('y');
          return keydown('}');
        });
        return it('selects to the end of the current paragraph', function() {
          return expect(vimState.getRegister('"').text).toBe("abcde\n");
        });
      });
    });
    describe("the { keybinding", function() {
      beforeEach(function() {
        editor.setText("abcde\n\nfghij\nhijk\n  xyz  \n\nzip\n\n  \nthe end");
        return editor.setCursorScreenPosition([9, 0]);
      });
      describe("as a motion", function() {
        return it("moves the cursor to the beginning of the paragraph", function() {
          keydown('{');
          expect(editor.getCursorScreenPosition()).toEqual([7, 0]);
          keydown('{');
          expect(editor.getCursorScreenPosition()).toEqual([5, 0]);
          keydown('{');
          expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
          keydown('{');
          return expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
        });
      });
      return describe("as a selection", function() {
        beforeEach(function() {
          editor.setCursorScreenPosition([7, 0]);
          keydown('y');
          return keydown('{');
        });
        return it('selects to the beginning of the current paragraph', function() {
          return expect(vimState.getRegister('"').text).toBe("\nzip\n");
        });
      });
    });
    describe("the b keybinding", function() {
      beforeEach(function() {
        return editor.setText(" ab cde1+- \n xyz\n\nzip }\n last");
      });
      describe("as a motion", function() {
        beforeEach(function() {
          return editor.setCursorScreenPosition([4, 1]);
        });
        return it("moves the cursor to the beginning of the previous word", function() {
          keydown('b');
          expect(editor.getCursorScreenPosition()).toEqual([3, 4]);
          keydown('b');
          expect(editor.getCursorScreenPosition()).toEqual([3, 0]);
          keydown('b');
          expect(editor.getCursorScreenPosition()).toEqual([2, 0]);
          keydown('b');
          expect(editor.getCursorScreenPosition()).toEqual([1, 1]);
          keydown('b');
          expect(editor.getCursorScreenPosition()).toEqual([0, 8]);
          keydown('b');
          expect(editor.getCursorScreenPosition()).toEqual([0, 4]);
          keydown('b');
          expect(editor.getCursorScreenPosition()).toEqual([0, 1]);
          keydown('b');
          expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
          keydown('b');
          return expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
        });
      });
      return describe("as a selection", function() {
        describe("within a word", function() {
          beforeEach(function() {
            editor.setCursorScreenPosition([0, 2]);
            keydown('y');
            return keydown('b');
          });
          return it("selects to the beginning of the current word", function() {
            expect(vimState.getRegister('"').text).toBe('a');
            return expect(editor.getCursorScreenPosition()).toEqual([0, 1]);
          });
        });
        return describe("between words", function() {
          beforeEach(function() {
            editor.setCursorScreenPosition([0, 4]);
            keydown('y');
            return keydown('b');
          });
          return it("selects to the beginning of the last word", function() {
            expect(vimState.getRegister('"').text).toBe('ab ');
            return expect(editor.getCursorScreenPosition()).toEqual([0, 1]);
          });
        });
      });
    });
    describe("the B keybinding", function() {
      beforeEach(function() {
        return editor.setText("cde1+- ab \n\t xyz-123\n\n zip");
      });
      describe("as a motion", function() {
        beforeEach(function() {
          return editor.setCursorScreenPosition([4, 1]);
        });
        return it("moves the cursor to the beginning of the previous word", function() {
          keydown('B', {
            shift: true
          });
          expect(editor.getCursorScreenPosition()).toEqual([3, 1]);
          keydown('B', {
            shift: true
          });
          expect(editor.getCursorScreenPosition()).toEqual([2, 0]);
          keydown('B', {
            shift: true
          });
          expect(editor.getCursorScreenPosition()).toEqual([1, 3]);
          keydown('B', {
            shift: true
          });
          expect(editor.getCursorScreenPosition()).toEqual([0, 7]);
          keydown('B', {
            shift: true
          });
          return expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
        });
      });
      return describe("as a selection", function() {
        it("selects to the beginning of the whole word", function() {
          editor.setCursorScreenPosition([1, 9]);
          keydown('y');
          keydown('B', {
            shift: true
          });
          return expect(vimState.getRegister('"').text).toBe('xyz-12');
        });
        return it("doesn't go past the beginning of the file", function() {
          editor.setCursorScreenPosition([0, 0]);
          vimState.setRegister('"', {
            text: 'abc'
          });
          keydown('y');
          keydown('B', {
            shift: true
          });
          return expect(vimState.getRegister('"').text).toBe('abc');
        });
      });
    });
    describe("the ^ keybinding", function() {
      beforeEach(function() {
        return editor.setText("  abcde");
      });
      describe("from the beginning of the line", function() {
        beforeEach(function() {
          return editor.setCursorScreenPosition([0, 0]);
        });
        describe("as a motion", function() {
          beforeEach(function() {
            return keydown('^');
          });
          return it("moves the cursor to the first character of the line", function() {
            return expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
          });
        });
        return describe("as a selection", function() {
          beforeEach(function() {
            keydown('d');
            return keydown('^');
          });
          return it('selects to the first character of the line', function() {
            expect(editor.getText()).toBe('abcde');
            return expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
          });
        });
      });
      describe("from the first character of the line", function() {
        beforeEach(function() {
          return editor.setCursorScreenPosition([0, 2]);
        });
        describe("as a motion", function() {
          beforeEach(function() {
            return keydown('^');
          });
          return it("stays put", function() {
            return expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
          });
        });
        return describe("as a selection", function() {
          beforeEach(function() {
            keydown('d');
            return keydown('^');
          });
          return it("does nothing", function() {
            expect(editor.getText()).toBe('  abcde');
            return expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
          });
        });
      });
      return describe("from the middle of a word", function() {
        beforeEach(function() {
          return editor.setCursorScreenPosition([0, 4]);
        });
        describe("as a motion", function() {
          beforeEach(function() {
            return keydown('^');
          });
          return it("moves the cursor to the first character of the line", function() {
            return expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
          });
        });
        return describe("as a selection", function() {
          beforeEach(function() {
            keydown('d');
            return keydown('^');
          });
          return it('selects to the first character of the line', function() {
            expect(editor.getText()).toBe('  cde');
            return expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
          });
        });
      });
    });
    describe("the 0 keybinding", function() {
      beforeEach(function() {
        editor.setText("  abcde");
        return editor.setCursorScreenPosition([0, 4]);
      });
      describe("as a motion", function() {
        beforeEach(function() {
          return keydown('0');
        });
        return it("moves the cursor to the first column", function() {
          return expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
        });
      });
      return describe("as a selection", function() {
        beforeEach(function() {
          keydown('d');
          return keydown('0');
        });
        return it('selects to the first column of the line', function() {
          expect(editor.getText()).toBe('cde');
          return expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
        });
      });
    });
    describe("the $ keybinding", function() {
      beforeEach(function() {
        editor.setText("  abcde\n\n1234567890");
        return editor.setCursorScreenPosition([0, 4]);
      });
      describe("as a motion from empty line", function() {
        beforeEach(function() {
          return editor.setCursorScreenPosition([1, 0]);
        });
        return it("moves the cursor to the end of the line", function() {
          return expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
        });
      });
      describe("as a motion", function() {
        beforeEach(function() {
          return keydown('$');
        });
        it("moves the cursor to the end of the line", function() {
          return expect(editor.getCursorScreenPosition()).toEqual([0, 6]);
        });
        return it("should remain in the last column when moving down", function() {
          keydown('j');
          expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
          keydown('j');
          return expect(editor.getCursorScreenPosition()).toEqual([2, 9]);
        });
      });
      return describe("as a selection", function() {
        beforeEach(function() {
          keydown('d');
          return keydown('$');
        });
        return it("selects to the beginning of the lines", function() {
          expect(editor.getText()).toBe("  ab\n\n1234567890");
          return expect(editor.getCursorScreenPosition()).toEqual([0, 3]);
        });
      });
    });
    describe("the 0 keybinding", function() {
      beforeEach(function() {
        editor.setText("  a\n");
        return editor.setCursorScreenPosition([0, 2]);
      });
      return describe("as a motion", function() {
        beforeEach(function() {
          return keydown('0');
        });
        return it("moves the cursor to the beginning of the line", function() {
          return expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
        });
      });
    });
    describe("the - keybinding", function() {
      beforeEach(function() {
        return editor.setText("abcdefg\n  abc\n  abc\n");
      });
      describe("from the middle of a line", function() {
        beforeEach(function() {
          return editor.setCursorScreenPosition([1, 3]);
        });
        describe("as a motion", function() {
          beforeEach(function() {
            return keydown('-');
          });
          return it("moves the cursor to the first character of the previous line", function() {
            return expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
          });
        });
        return describe("as a selection", function() {
          beforeEach(function() {
            keydown('d');
            return keydown('-');
          });
          return it("deletes the current and previous line", function() {
            return expect(editor.getText()).toBe("  abc\n");
          });
        });
      });
      describe("from the first character of a line indented the same as the previous one", function() {
        beforeEach(function() {
          return editor.setCursorScreenPosition([2, 2]);
        });
        describe("as a motion", function() {
          beforeEach(function() {
            return keydown('-');
          });
          return it("moves to the first character of the previous line (directly above)", function() {
            return expect(editor.getCursorScreenPosition()).toEqual([1, 2]);
          });
        });
        return describe("as a selection", function() {
          beforeEach(function() {
            keydown('d');
            return keydown('-');
          });
          return it("selects to the first character of the previous line (directly above)", function() {
            return expect(editor.getText()).toBe("abcdefg\n");
          });
        });
      });
      describe("from the beginning of a line preceded by an indented line", function() {
        beforeEach(function() {
          return editor.setCursorScreenPosition([2, 0]);
        });
        describe("as a motion", function() {
          beforeEach(function() {
            return keydown('-');
          });
          return it("moves the cursor to the first character of the previous line", function() {
            return expect(editor.getCursorScreenPosition()).toEqual([1, 2]);
          });
        });
        return describe("as a selection", function() {
          beforeEach(function() {
            keydown('d');
            return keydown('-');
          });
          return it("selects to the first character of the previous line", function() {
            return expect(editor.getText()).toBe("abcdefg\n");
          });
        });
      });
      return describe("with a count", function() {
        beforeEach(function() {
          editor.setText("1\n2\n3\n4\n5\n6\n");
          return editor.setCursorScreenPosition([4, 0]);
        });
        describe("as a motion", function() {
          beforeEach(function() {
            keydown('3');
            return keydown('-');
          });
          return it("moves the cursor to the first character of that many lines previous", function() {
            return expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
          });
        });
        return describe("as a selection", function() {
          beforeEach(function() {
            keydown('d');
            keydown('3');
            return keydown('-');
          });
          return it("deletes the current line plus that many previous lines", function() {
            expect(editor.getText()).toBe("1\n6\n");
            return expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
          });
        });
      });
    });
    describe("the + keybinding", function() {
      beforeEach(function() {
        return editor.setText("  abc\n  abc\nabcdefg\n");
      });
      describe("from the middle of a line", function() {
        beforeEach(function() {
          return editor.setCursorScreenPosition([1, 3]);
        });
        describe("as a motion", function() {
          beforeEach(function() {
            return keydown('+');
          });
          return it("moves the cursor to the first character of the next line", function() {
            return expect(editor.getCursorScreenPosition()).toEqual([2, 0]);
          });
        });
        return describe("as a selection", function() {
          beforeEach(function() {
            keydown('d');
            return keydown('+');
          });
          return it("deletes the current and next line", function() {
            return expect(editor.getText()).toBe("  abc\n");
          });
        });
      });
      describe("from the first character of a line indented the same as the next one", function() {
        beforeEach(function() {
          return editor.setCursorScreenPosition([0, 2]);
        });
        describe("as a motion", function() {
          beforeEach(function() {
            return keydown('+');
          });
          return it("moves to the first character of the next line (directly below)", function() {
            return expect(editor.getCursorScreenPosition()).toEqual([1, 2]);
          });
        });
        return describe("as a selection", function() {
          beforeEach(function() {
            keydown('d');
            return keydown('+');
          });
          return it("selects to the first character of the next line (directly below)", function() {
            return expect(editor.getText()).toBe("abcdefg\n");
          });
        });
      });
      describe("from the beginning of a line followed by an indented line", function() {
        beforeEach(function() {
          return editor.setCursorScreenPosition([0, 0]);
        });
        describe("as a motion", function() {
          beforeEach(function() {
            return keydown('+');
          });
          return it("moves the cursor to the first character of the next line", function() {
            return expect(editor.getCursorScreenPosition()).toEqual([1, 2]);
          });
        });
        return describe("as a selection", function() {
          beforeEach(function() {
            keydown('d');
            return keydown('+');
          });
          return it("selects to the first character of the next line", function() {
            expect(editor.getText()).toBe("abcdefg\n");
            return expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
          });
        });
      });
      return describe("with a count", function() {
        beforeEach(function() {
          editor.setText("1\n2\n3\n4\n5\n6\n");
          return editor.setCursorScreenPosition([1, 0]);
        });
        describe("as a motion", function() {
          beforeEach(function() {
            keydown('3');
            return keydown('+');
          });
          return it("moves the cursor to the first character of that many lines following", function() {
            return expect(editor.getCursorScreenPosition()).toEqual([4, 0]);
          });
        });
        return describe("as a selection", function() {
          beforeEach(function() {
            keydown('d');
            keydown('3');
            return keydown('+');
          });
          return it("deletes the current line plus that many following lines", function() {
            expect(editor.getText()).toBe("1\n6\n");
            return expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
          });
        });
      });
    });
    describe("the _ keybinding", function() {
      beforeEach(function() {
        return editor.setText("  abc\n  abc\nabcdefg\n");
      });
      describe("from the middle of a line", function() {
        beforeEach(function() {
          return editor.setCursorScreenPosition([1, 3]);
        });
        describe("as a motion", function() {
          beforeEach(function() {
            return keydown('_');
          });
          return it("moves the cursor to the first character of the current line", function() {
            return expect(editor.getCursorScreenPosition()).toEqual([1, 2]);
          });
        });
        return describe("as a selection", function() {
          beforeEach(function() {
            keydown('d');
            return keydown('_');
          });
          return it("deletes the current line", function() {
            expect(editor.getText()).toBe("  abc\nabcdefg\n");
            return expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
          });
        });
      });
      return describe("with a count", function() {
        beforeEach(function() {
          editor.setText("1\n2\n3\n4\n5\n6\n");
          return editor.setCursorScreenPosition([1, 0]);
        });
        describe("as a motion", function() {
          beforeEach(function() {
            keydown('3');
            return keydown('_');
          });
          return it("moves the cursor to the first character of that many lines following", function() {
            return expect(editor.getCursorScreenPosition()).toEqual([3, 0]);
          });
        });
        return describe("as a selection", function() {
          beforeEach(function() {
            keydown('d');
            keydown('3');
            return keydown('_');
          });
          return it("deletes the current line plus that many following lines", function() {
            expect(editor.getText()).toBe("1\n5\n6\n");
            return expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
          });
        });
      });
    });
    describe("the enter keybinding", function() {
      var keydownCodeForEnter, startingText;
      keydownCodeForEnter = '\r';
      startingText = "  abc\n  abc\nabcdefg\n";
      return describe("from the middle of a line", function() {
        var startingCursorPosition;
        startingCursorPosition = [1, 3];
        describe("as a motion", function() {
          return it("acts the same as the + keybinding", function() {
            var referenceCursorPosition;
            editor.setText(startingText);
            editor.setCursorScreenPosition(startingCursorPosition);
            keydown('+');
            referenceCursorPosition = editor.getCursorScreenPosition();
            editor.setText(startingText);
            editor.setCursorScreenPosition(startingCursorPosition);
            keydown(keydownCodeForEnter);
            return expect(editor.getCursorScreenPosition()).toEqual(referenceCursorPosition);
          });
        });
        return describe("as a selection", function() {
          return it("acts the same as the + keybinding", function() {
            var referenceCursorPosition, referenceText;
            editor.setText(startingText);
            editor.setCursorScreenPosition(startingCursorPosition);
            keydown('d');
            keydown('+');
            referenceText = editor.getText();
            referenceCursorPosition = editor.getCursorScreenPosition();
            editor.setText(startingText);
            editor.setCursorScreenPosition(startingCursorPosition);
            keydown('d');
            keydown(keydownCodeForEnter);
            expect(editor.getText()).toEqual(referenceText);
            return expect(editor.getCursorScreenPosition()).toEqual(referenceCursorPosition);
          });
        });
      });
    });
    describe("the gg keybinding", function() {
      beforeEach(function() {
        editor.setText(" 1abc\n 2\n3\n");
        return editor.setCursorScreenPosition([0, 2]);
      });
      describe("as a motion", function() {
        describe("in normal mode", function() {
          beforeEach(function() {
            keydown('g');
            return keydown('g');
          });
          return it("moves the cursor to the beginning of the first line", function() {
            return expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
          });
        });
        describe("in linewise visual mode", function() {
          beforeEach(function() {
            editor.setCursorScreenPosition([1, 0]);
            vimState.activateVisualMode('linewise');
            keydown('g');
            return keydown('g');
          });
          it("selects to the first line in the file", function() {
            return expect(editor.getSelectedText()).toBe(" 1abc\n 2\n");
          });
          return it("moves the cursor to a specified line", function() {
            return expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
          });
        });
        return describe("in characterwise visual mode", function() {
          beforeEach(function() {
            editor.setCursorScreenPosition([1, 1]);
            vimState.activateVisualMode();
            keydown('g');
            return keydown('g');
          });
          it("selects to the first line in the file", function() {
            return expect(editor.getSelectedText()).toBe("1abc\n 2");
          });
          return it("moves the cursor to a specified line", function() {
            return expect(editor.getCursorScreenPosition()).toEqual([0, 1]);
          });
        });
      });
      return describe("as a repeated motion", function() {
        describe("in normal mode", function() {
          beforeEach(function() {
            keydown('2');
            keydown('g');
            return keydown('g');
          });
          return it("moves the cursor to a specified line", function() {
            return expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
          });
        });
        describe("in linewise visual motion", function() {
          beforeEach(function() {
            editor.setCursorScreenPosition([2, 0]);
            vimState.activateVisualMode('linewise');
            keydown('2');
            keydown('g');
            return keydown('g');
          });
          it("selects to a specified line", function() {
            return expect(editor.getSelectedText()).toBe(" 2\n3\n");
          });
          return it("moves the cursor to a specified line", function() {
            return expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
          });
        });
        return describe("in characterwise visual motion", function() {
          beforeEach(function() {
            editor.setCursorScreenPosition([2, 0]);
            vimState.activateVisualMode();
            keydown('2');
            keydown('g');
            return keydown('g');
          });
          it("selects to a first character of specified line", function() {
            return expect(editor.getSelectedText()).toBe("2\n3");
          });
          return it("moves the cursor to a specified line", function() {
            return expect(editor.getCursorScreenPosition()).toEqual([1, 1]);
          });
        });
      });
    });
    describe("the g_ keybinding", function() {
      beforeEach(function() {
        return editor.setText("1  \n    2  \n 3abc\n ");
      });
      describe("as a motion", function() {
        it("moves the cursor to the last nonblank character", function() {
          editor.setCursorScreenPosition([1, 0]);
          keydown('g');
          keydown('_');
          return expect(editor.getCursorScreenPosition()).toEqual([1, 4]);
        });
        return it("will move the cursor to the beginning of the line if necessary", function() {
          editor.setCursorScreenPosition([0, 2]);
          keydown('g');
          keydown('_');
          return expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
        });
      });
      describe("as a repeated motion", function() {
        return it("moves the cursor downward and outward", function() {
          editor.setCursorScreenPosition([0, 0]);
          keydown('2');
          keydown('g');
          keydown('_');
          return expect(editor.getCursorScreenPosition()).toEqual([1, 4]);
        });
      });
      return describe("as a selection", function() {
        return it("selects the current line excluding whitespace", function() {
          editor.setCursorScreenPosition([1, 2]);
          vimState.activateVisualMode();
          keydown('2');
          keydown('g');
          keydown('_');
          return expect(editor.getSelectedText()).toEqual("  2  \n 3abc");
        });
      });
    });
    describe("the G keybinding", function() {
      beforeEach(function() {
        editor.setText("1\n    2\n 3abc\n ");
        return editor.setCursorScreenPosition([0, 2]);
      });
      describe("as a motion", function() {
        beforeEach(function() {
          return keydown('G', {
            shift: true
          });
        });
        return it("moves the cursor to the last line after whitespace", function() {
          return expect(editor.getCursorScreenPosition()).toEqual([3, 0]);
        });
      });
      describe("as a repeated motion", function() {
        beforeEach(function() {
          keydown('2');
          return keydown('G', {
            shift: true
          });
        });
        return it("moves the cursor to a specified line", function() {
          return expect(editor.getCursorScreenPosition()).toEqual([1, 4]);
        });
      });
      return describe("as a selection", function() {
        beforeEach(function() {
          editor.setCursorScreenPosition([1, 0]);
          vimState.activateVisualMode();
          return keydown('G', {
            shift: true
          });
        });
        it("selects to the last line in the file", function() {
          return expect(editor.getSelectedText()).toBe("    2\n 3abc\n ");
        });
        return it("moves the cursor to the last line after whitespace", function() {
          return expect(editor.getCursorScreenPosition()).toEqual([3, 1]);
        });
      });
    });
    describe("the / keybinding", function() {
      var pane;
      pane = null;
      beforeEach(function() {
        pane = {
          activate: jasmine.createSpy("activate")
        };
        spyOn(atom.workspace, 'getActivePane').andReturn(pane);
        editor.setText("abc\ndef\nabc\ndef\n");
        editor.setCursorBufferPosition([0, 0]);
        vimState.globalVimState.searchHistory = [];
        return vimState.globalVimState.currentSearch = {};
      });
      describe("as a motion", function() {
        it("beeps when repeating nonexistent last search", function() {
          keydown('/');
          submitNormalModeInputText('');
          expect(editor.getCursorBufferPosition()).toEqual([0, 0]);
          return expect(atom.beep).toHaveBeenCalled();
        });
        it("moves the cursor to the specified search pattern", function() {
          keydown('/');
          submitNormalModeInputText('def');
          expect(editor.getCursorBufferPosition()).toEqual([1, 0]);
          expect(pane.activate).toHaveBeenCalled();
          return expect(atom.beep).not.toHaveBeenCalled();
        });
        it("loops back around", function() {
          editor.setCursorBufferPosition([3, 0]);
          keydown('/');
          submitNormalModeInputText('def');
          expect(editor.getCursorBufferPosition()).toEqual([1, 0]);
          return expect(atom.beep).not.toHaveBeenCalled();
        });
        it("uses a valid regex as a regex", function() {
          keydown('/');
          submitNormalModeInputText('[abc]');
          expect(editor.getCursorBufferPosition()).toEqual([0, 1]);
          keydown('n');
          expect(editor.getCursorBufferPosition()).toEqual([0, 2]);
          return expect(atom.beep).not.toHaveBeenCalled();
        });
        it("uses an invalid regex as a literal string", function() {
          editor.setText("abc\n[abc]\n");
          keydown('/');
          submitNormalModeInputText('[abc');
          expect(editor.getCursorBufferPosition()).toEqual([1, 0]);
          keydown('n');
          expect(editor.getCursorBufferPosition()).toEqual([1, 0]);
          return expect(atom.beep).not.toHaveBeenCalled();
        });
        it("uses ? as a literal string", function() {
          editor.setText("abc\n[a?c?\n");
          keydown('/');
          submitNormalModeInputText('?');
          expect(editor.getCursorBufferPosition()).toEqual([1, 2]);
          keydown('n');
          expect(editor.getCursorBufferPosition()).toEqual([1, 4]);
          return expect(atom.beep).not.toHaveBeenCalled();
        });
        it('works with selection in visual mode', function() {
          editor.setText('one two three');
          keydown('v');
          keydown('/');
          submitNormalModeInputText('th');
          expect(editor.getCursorBufferPosition()).toEqual([0, 9]);
          keydown('d');
          expect(editor.getText()).toBe('hree');
          return expect(atom.beep).not.toHaveBeenCalled();
        });
        it('extends selection when repeating search in visual mode', function() {
          var end, start, _ref1, _ref2;
          editor.setText('line1\nline2\nline3');
          keydown('v');
          keydown('/');
          submitNormalModeInputText('line');
          _ref1 = editor.getSelectedBufferRange(), start = _ref1.start, end = _ref1.end;
          expect(start.row).toEqual(0);
          expect(end.row).toEqual(1);
          keydown('n');
          _ref2 = editor.getSelectedBufferRange(), start = _ref2.start, end = _ref2.end;
          expect(start.row).toEqual(0);
          expect(end.row).toEqual(2);
          return expect(atom.beep).not.toHaveBeenCalled();
        });
        describe("case sensitivity", function() {
          beforeEach(function() {
            editor.setText("\nabc\nABC\n");
            editor.setCursorBufferPosition([0, 0]);
            return keydown('/');
          });
          it("works in case sensitive mode", function() {
            submitNormalModeInputText('ABC');
            expect(editor.getCursorBufferPosition()).toEqual([2, 0]);
            keydown('n');
            expect(editor.getCursorBufferPosition()).toEqual([2, 0]);
            return expect(atom.beep).not.toHaveBeenCalled();
          });
          it("works in case insensitive mode", function() {
            submitNormalModeInputText('\\cAbC');
            expect(editor.getCursorBufferPosition()).toEqual([1, 0]);
            keydown('n');
            expect(editor.getCursorBufferPosition()).toEqual([2, 0]);
            return expect(atom.beep).not.toHaveBeenCalled();
          });
          it("works in case insensitive mode wherever \\c is", function() {
            submitNormalModeInputText('AbC\\c');
            expect(editor.getCursorBufferPosition()).toEqual([1, 0]);
            keydown('n');
            expect(editor.getCursorBufferPosition()).toEqual([2, 0]);
            return expect(atom.beep).not.toHaveBeenCalled();
          });
          it("uses case insensitive search if useSmartcaseForSearch is true and searching lowercase", function() {
            atom.config.set('vim-mode.useSmartcaseForSearch', true);
            submitNormalModeInputText('abc');
            expect(editor.getCursorBufferPosition()).toEqual([1, 0]);
            keydown('n');
            expect(editor.getCursorBufferPosition()).toEqual([2, 0]);
            return expect(atom.beep).not.toHaveBeenCalled();
          });
          return it("uses case sensitive search if useSmartcaseForSearch is true and searching uppercase", function() {
            atom.config.set('vim-mode.useSmartcaseForSearch', true);
            submitNormalModeInputText('ABC');
            expect(editor.getCursorBufferPosition()).toEqual([2, 0]);
            keydown('n');
            expect(editor.getCursorBufferPosition()).toEqual([2, 0]);
            return expect(atom.beep).not.toHaveBeenCalled();
          });
        });
        describe("repeating", function() {
          return it("does nothing with no search history", function() {
            editor.setCursorBufferPosition([0, 0]);
            keydown('n');
            expect(editor.getCursorBufferPosition()).toEqual([0, 0]);
            expect(atom.beep).toHaveBeenCalled();
            editor.setCursorBufferPosition([1, 1]);
            keydown('n');
            expect(editor.getCursorBufferPosition()).toEqual([1, 1]);
            return expect(atom.beep.callCount).toBe(2);
          });
        });
        describe("repeating with search history", function() {
          beforeEach(function() {
            keydown('/');
            return submitNormalModeInputText('def');
          });
          it("repeats previous search with /<enter>", function() {
            keydown('/');
            submitNormalModeInputText('');
            expect(editor.getCursorBufferPosition()).toEqual([3, 0]);
            return expect(atom.beep).not.toHaveBeenCalled();
          });
          it("repeats previous search with //", function() {
            keydown('/');
            submitNormalModeInputText('/');
            expect(editor.getCursorBufferPosition()).toEqual([3, 0]);
            return expect(atom.beep).not.toHaveBeenCalled();
          });
          describe("the n keybinding", function() {
            return it("repeats the last search", function() {
              keydown('n');
              expect(editor.getCursorBufferPosition()).toEqual([3, 0]);
              return expect(atom.beep).not.toHaveBeenCalled();
            });
          });
          return describe("the N keybinding", function() {
            return it("repeats the last search backwards", function() {
              editor.setCursorBufferPosition([0, 0]);
              keydown('N', {
                shift: true
              });
              expect(editor.getCursorBufferPosition()).toEqual([3, 0]);
              keydown('N', {
                shift: true
              });
              expect(editor.getCursorBufferPosition()).toEqual([1, 0]);
              return expect(atom.beep).not.toHaveBeenCalled();
            });
          });
        });
        return describe("composing", function() {
          it("composes with operators", function() {
            keydown('d');
            keydown('/');
            submitNormalModeInputText('def');
            expect(editor.getText()).toEqual("def\nabc\ndef\n");
            return expect(atom.beep).not.toHaveBeenCalled();
          });
          return it("repeats correctly with operators", function() {
            keydown('d');
            keydown('/');
            submitNormalModeInputText('def');
            keydown('.');
            expect(editor.getText()).toEqual("def\n");
            return expect(atom.beep).not.toHaveBeenCalled();
          });
        });
      });
      describe("when reversed as ?", function() {
        it("moves the cursor backwards to the specified search pattern", function() {
          keydown('?');
          submitNormalModeInputText('def');
          expect(editor.getCursorBufferPosition()).toEqual([3, 0]);
          return expect(atom.beep).not.toHaveBeenCalled();
        });
        it("accepts / as a literal search pattern", function() {
          editor.setText("abc\nd/f\nabc\nd/f\n");
          editor.setCursorBufferPosition([0, 0]);
          keydown('?');
          submitNormalModeInputText('/');
          expect(editor.getCursorBufferPosition()).toEqual([3, 1]);
          keydown('?');
          submitNormalModeInputText('/');
          expect(editor.getCursorBufferPosition()).toEqual([1, 1]);
          return expect(atom.beep).not.toHaveBeenCalled();
        });
        return describe("repeating", function() {
          beforeEach(function() {
            keydown('?');
            return submitNormalModeInputText('def');
          });
          it("repeats previous search as reversed with ?<enter>", function() {
            keydown('?');
            submitNormalModeInputText('');
            expect(editor.getCursorBufferPosition()).toEqual([1, 0]);
            return expect(atom.beep).not.toHaveBeenCalled();
          });
          it("repeats previous search as reversed with ??", function() {
            keydown('?');
            submitNormalModeInputText('?');
            expect(editor.getCursorBufferPosition()).toEqual([1, 0]);
            return expect(atom.beep).not.toHaveBeenCalled();
          });
          describe('the n keybinding', function() {
            return it("repeats the last search backwards", function() {
              editor.setCursorBufferPosition([0, 0]);
              keydown('n');
              expect(editor.getCursorBufferPosition()).toEqual([3, 0]);
              return expect(atom.beep).not.toHaveBeenCalled();
            });
          });
          return describe('the N keybinding', function() {
            return it("repeats the last search forwards", function() {
              editor.setCursorBufferPosition([0, 0]);
              keydown('N', {
                shift: true
              });
              expect(editor.getCursorBufferPosition()).toEqual([1, 0]);
              return expect(atom.beep).not.toHaveBeenCalled();
            });
          });
        });
      });
      return describe("using search history", function() {
        var inputEditor;
        inputEditor = null;
        beforeEach(function() {
          keydown('/');
          submitNormalModeInputText('def');
          expect(editor.getCursorBufferPosition()).toEqual([1, 0]);
          keydown('/');
          submitNormalModeInputText('abc');
          expect(editor.getCursorBufferPosition()).toEqual([2, 0]);
          return inputEditor = editor.normalModeInputView.editorElement;
        });
        it("allows searching history in the search field", function() {
          keydown('/');
          atom.commands.dispatch(inputEditor, 'core:move-up');
          expect(inputEditor.getModel().getText()).toEqual('abc');
          atom.commands.dispatch(inputEditor, 'core:move-up');
          expect(inputEditor.getModel().getText()).toEqual('def');
          atom.commands.dispatch(inputEditor, 'core:move-up');
          expect(inputEditor.getModel().getText()).toEqual('def');
          return expect(atom.beep).not.toHaveBeenCalled();
        });
        return it("resets the search field to empty when scrolling back", function() {
          keydown('/');
          atom.commands.dispatch(inputEditor, 'core:move-up');
          expect(inputEditor.getModel().getText()).toEqual('abc');
          atom.commands.dispatch(inputEditor, 'core:move-up');
          expect(inputEditor.getModel().getText()).toEqual('def');
          atom.commands.dispatch(inputEditor, 'core:move-down');
          expect(inputEditor.getModel().getText()).toEqual('abc');
          atom.commands.dispatch(inputEditor, 'core:move-down');
          expect(inputEditor.getModel().getText()).toEqual('');
          return expect(atom.beep).not.toHaveBeenCalled();
        });
      });
    });
    describe("the * keybinding", function() {
      beforeEach(function() {
        editor.setText("abd\n@def\nabd\ndef\n");
        return editor.setCursorBufferPosition([0, 0]);
      });
      return describe("as a motion", function() {
        it("moves cursor to next occurence of word under cursor", function() {
          keydown("*");
          return expect(editor.getCursorBufferPosition()).toEqual([2, 0]);
        });
        it("repeats with the n key", function() {
          keydown("*");
          expect(editor.getCursorBufferPosition()).toEqual([2, 0]);
          keydown("n");
          return expect(editor.getCursorBufferPosition()).toEqual([0, 0]);
        });
        it("doesn't move cursor unless next occurence is the exact word (no partial matches)", function() {
          editor.setText("abc\ndef\nghiabc\njkl\nabcdef");
          editor.setCursorBufferPosition([0, 0]);
          keydown("*");
          return expect(editor.getCursorBufferPosition()).toEqual([0, 0]);
        });
        describe("with words that contain 'non-word' characters", function() {
          it("moves cursor to next occurence of word under cursor", function() {
            editor.setText("abc\n@def\nabc\n@def\n");
            editor.setCursorBufferPosition([1, 0]);
            keydown("*");
            return expect(editor.getCursorBufferPosition()).toEqual([3, 0]);
          });
          it("doesn't move cursor unless next match has exact word ending", function() {
            editor.setText("abc\n@def\nabc\n@def1\n");
            editor.setCursorBufferPosition([1, 1]);
            keydown("*");
            return expect(editor.getCursorBufferPosition()).toEqual([1, 0]);
          });
          return it("moves cursor to the start of valid word char", function() {
            editor.setText("abc\ndef\nabc\n@def\n");
            editor.setCursorBufferPosition([1, 0]);
            keydown("*");
            return expect(editor.getCursorBufferPosition()).toEqual([3, 1]);
          });
        });
        describe("when cursor is on non-word char column", function() {
          return it("matches only the non-word char", function() {
            editor.setText("abc\n@def\nabc\n@def\n");
            editor.setCursorBufferPosition([1, 0]);
            keydown("*");
            return expect(editor.getCursorBufferPosition()).toEqual([3, 0]);
          });
        });
        describe("when cursor is not on a word", function() {
          return it("does a match with the next word", function() {
            editor.setText("abc\na  @def\n abc\n @def");
            editor.setCursorBufferPosition([1, 1]);
            keydown("*");
            return expect(editor.getCursorBufferPosition()).toEqual([3, 1]);
          });
        });
        return describe("when cursor is at EOF", function() {
          return it("doesn't try to do any match", function() {
            editor.setText("abc\n@def\nabc\n ");
            editor.setCursorBufferPosition([3, 0]);
            keydown("*");
            return expect(editor.getCursorBufferPosition()).toEqual([3, 0]);
          });
        });
      });
    });
    describe("the hash keybinding", function() {
      return describe("as a motion", function() {
        it("moves cursor to previous occurence of word under cursor", function() {
          editor.setText("abc\n@def\nabc\ndef\n");
          editor.setCursorBufferPosition([2, 1]);
          keydown("#");
          return expect(editor.getCursorBufferPosition()).toEqual([0, 0]);
        });
        it("repeats with n", function() {
          editor.setText("abc\n@def\nabc\ndef\nabc\n");
          editor.setCursorBufferPosition([2, 1]);
          keydown("#");
          expect(editor.getCursorBufferPosition()).toEqual([0, 0]);
          keydown("n");
          expect(editor.getCursorBufferPosition()).toEqual([4, 0]);
          keydown("n");
          return expect(editor.getCursorBufferPosition()).toEqual([2, 0]);
        });
        it("doesn't move cursor unless next occurence is the exact word (no partial matches)", function() {
          editor.setText("abc\ndef\nghiabc\njkl\nabcdef");
          editor.setCursorBufferPosition([0, 0]);
          keydown("#");
          return expect(editor.getCursorBufferPosition()).toEqual([0, 0]);
        });
        describe("with words that containt 'non-word' characters", function() {
          it("moves cursor to next occurence of word under cursor", function() {
            editor.setText("abc\n@def\nabc\n@def\n");
            editor.setCursorBufferPosition([3, 0]);
            keydown("#");
            return expect(editor.getCursorBufferPosition()).toEqual([1, 0]);
          });
          return it("moves cursor to the start of valid word char", function() {
            editor.setText("abc\n@def\nabc\ndef\n");
            editor.setCursorBufferPosition([3, 0]);
            keydown("#");
            return expect(editor.getCursorBufferPosition()).toEqual([1, 1]);
          });
        });
        return describe("when cursor is on non-word char column", function() {
          return it("matches only the non-word char", function() {
            editor.setText("abc\n@def\nabc\n@def\n");
            editor.setCursorBufferPosition([1, 0]);
            keydown("*");
            return expect(editor.getCursorBufferPosition()).toEqual([3, 0]);
          });
        });
      });
    });
    describe("the H keybinding", function() {
      beforeEach(function() {
        editor.setText("1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n");
        editor.setCursorScreenPosition([8, 0]);
        return spyOn(editor.getLastCursor(), 'setScreenPosition');
      });
      it("moves the cursor to the first row if visible", function() {
        spyOn(editor, 'getFirstVisibleScreenRow').andReturn(0);
        keydown('H', {
          shift: true
        });
        return expect(editor.getLastCursor().setScreenPosition).toHaveBeenCalledWith([0, 0]);
      });
      it("moves the cursor to the first visible row plus offset", function() {
        spyOn(editor, 'getFirstVisibleScreenRow').andReturn(2);
        keydown('H', {
          shift: true
        });
        return expect(editor.getLastCursor().setScreenPosition).toHaveBeenCalledWith([4, 0]);
      });
      return it("respects counts", function() {
        spyOn(editor, 'getFirstVisibleScreenRow').andReturn(0);
        keydown('3');
        keydown('H', {
          shift: true
        });
        return expect(editor.getLastCursor().setScreenPosition).toHaveBeenCalledWith([2, 0]);
      });
    });
    describe("the L keybinding", function() {
      beforeEach(function() {
        editor.setText("1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n");
        editor.setCursorScreenPosition([8, 0]);
        return spyOn(editor.getLastCursor(), 'setScreenPosition');
      });
      it("moves the cursor to the first row if visible", function() {
        spyOn(editor, 'getLastVisibleScreenRow').andReturn(10);
        keydown('L', {
          shift: true
        });
        return expect(editor.getLastCursor().setScreenPosition).toHaveBeenCalledWith([10, 0]);
      });
      it("moves the cursor to the first visible row plus offset", function() {
        spyOn(editor, 'getLastVisibleScreenRow').andReturn(6);
        keydown('L', {
          shift: true
        });
        return expect(editor.getLastCursor().setScreenPosition).toHaveBeenCalledWith([4, 0]);
      });
      return it("respects counts", function() {
        spyOn(editor, 'getLastVisibleScreenRow').andReturn(10);
        keydown('3');
        keydown('L', {
          shift: true
        });
        return expect(editor.getLastCursor().setScreenPosition).toHaveBeenCalledWith([8, 0]);
      });
    });
    describe("the M keybinding", function() {
      beforeEach(function() {
        editor.setText("1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n");
        editor.setCursorScreenPosition([8, 0]);
        spyOn(editor.getLastCursor(), 'setScreenPosition');
        spyOn(editor, 'getLastVisibleScreenRow').andReturn(10);
        return spyOn(editor, 'getFirstVisibleScreenRow').andReturn(0);
      });
      return it("moves the cursor to the first row if visible", function() {
        keydown('M', {
          shift: true
        });
        return expect(editor.getLastCursor().setScreenPosition).toHaveBeenCalledWith([5, 0]);
      });
    });
    describe('the mark keybindings', function() {
      beforeEach(function() {
        editor.setText('  12\n    34\n56\n');
        return editor.setCursorBufferPosition([0, 1]);
      });
      it('moves to the beginning of the line of a mark', function() {
        editor.setCursorBufferPosition([1, 1]);
        keydown('m');
        normalModeInputKeydown('a');
        editor.setCursorBufferPosition([0, 0]);
        keydown('\'');
        normalModeInputKeydown('a');
        return expect(editor.getCursorBufferPosition()).toEqual([1, 4]);
      });
      it('moves literally to a mark', function() {
        editor.setCursorBufferPosition([1, 1]);
        keydown('m');
        normalModeInputKeydown('a');
        editor.setCursorBufferPosition([0, 0]);
        keydown('`');
        normalModeInputKeydown('a');
        return expect(editor.getCursorBufferPosition()).toEqual([1, 1]);
      });
      it('deletes to a mark by line', function() {
        editor.setCursorBufferPosition([1, 5]);
        keydown('m');
        normalModeInputKeydown('a');
        editor.setCursorBufferPosition([0, 0]);
        keydown('d');
        keydown('\'');
        normalModeInputKeydown('a');
        return expect(editor.getText()).toEqual('56\n');
      });
      it('deletes before to a mark literally', function() {
        editor.setCursorBufferPosition([1, 5]);
        keydown('m');
        normalModeInputKeydown('a');
        editor.setCursorBufferPosition([0, 1]);
        keydown('d');
        keydown('`');
        normalModeInputKeydown('a');
        return expect(editor.getText()).toEqual(' 4\n56\n');
      });
      it('deletes after to a mark literally', function() {
        editor.setCursorBufferPosition([1, 5]);
        keydown('m');
        normalModeInputKeydown('a');
        editor.setCursorBufferPosition([2, 1]);
        keydown('d');
        keydown('`');
        normalModeInputKeydown('a');
        return expect(editor.getText()).toEqual('  12\n    36\n');
      });
      return it('moves back to previous', function() {
        editor.setCursorBufferPosition([1, 5]);
        keydown('`');
        normalModeInputKeydown('`');
        editor.setCursorBufferPosition([2, 1]);
        keydown('`');
        normalModeInputKeydown('`');
        return expect(editor.getCursorBufferPosition()).toEqual([1, 5]);
      });
    });
    describe('the f/F keybindings', function() {
      beforeEach(function() {
        editor.setText("abcabcabcabc\n");
        return editor.setCursorScreenPosition([0, 0]);
      });
      it('moves to the first specified character it finds', function() {
        keydown('f');
        normalModeInputKeydown('c');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
      });
      it('moves backwards to the first specified character it finds', function() {
        editor.setCursorScreenPosition([0, 2]);
        keydown('F', {
          shift: true
        });
        normalModeInputKeydown('a');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
      });
      it('respects count forward', function() {
        keydown('2');
        keydown('f');
        normalModeInputKeydown('a');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 6]);
      });
      it('respects count backward', function() {
        editor.setCursorScreenPosition([0, 6]);
        keydown('2');
        keydown('F', {
          shift: true
        });
        normalModeInputKeydown('a');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
      });
      it("doesn't move if the character specified isn't found", function() {
        keydown('f');
        normalModeInputKeydown('d');
        expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
        return expect(atom.beep).not.toHaveBeenCalled();
      });
      it("doesn't move if there aren't the specified count of the specified character", function() {
        keydown('1');
        keydown('0');
        keydown('f');
        normalModeInputKeydown('a');
        expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
        keydown('1');
        keydown('1');
        keydown('f');
        normalModeInputKeydown('a');
        expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
        editor.setCursorScreenPosition([0, 6]);
        keydown('1');
        keydown('0');
        keydown('F', {
          shift: true
        });
        normalModeInputKeydown('a');
        expect(editor.getCursorScreenPosition()).toEqual([0, 6]);
        keydown('1');
        keydown('1');
        keydown('F', {
          shift: true
        });
        normalModeInputKeydown('a');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 6]);
      });
      it("composes with d", function() {
        editor.setCursorScreenPosition([0, 3]);
        keydown('d');
        keydown('2');
        keydown('f');
        normalModeInputKeydown('a');
        return expect(editor.getText()).toEqual('abcbc\n');
      });
      it("cancels c when no match found", function() {
        keydown('c');
        keydown('f');
        normalModeInputKeydown('d');
        expect(editor.getText()).toBe("abcabcabcabc\n");
        expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
        return expect(vimState.mode).toBe("normal");
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
        beforeEach(function() {
          editor.setText("abcébcabcébc\n");
          return editor.setCursorScreenPosition([0, 0]);
        });
        return it('works with IME composition', function() {
          var domNode, inputNode, normalModeEditor;
          keydown('f');
          normalModeEditor = editor.normalModeInputView.editorElement;
          jasmine.attachToDOM(normalModeEditor);
          domNode = normalModeEditor.component.domNode;
          inputNode = domNode.querySelector('.hidden-input');
          domNode.dispatchEvent(buildIMECompositionEvent('compositionstart', {
            target: inputNode
          }));
          domNode.dispatchEvent(buildIMECompositionEvent('compositionupdate', {
            data: "´",
            target: inputNode
          }));
          expect(normalModeEditor.getModel().getText()).toEqual('´');
          domNode.dispatchEvent(buildIMECompositionEvent('compositionend', {
            data: "é",
            target: inputNode
          }));
          domNode.dispatchEvent(buildTextInputEvent({
            data: 'é',
            target: inputNode
          }));
          return expect(editor.getCursorScreenPosition()).toEqual([0, 3]);
        });
      });
    });
    describe('the t/T keybindings', function() {
      beforeEach(function() {
        editor.setText("abcabcabcabc\n");
        return editor.setCursorScreenPosition([0, 0]);
      });
      it('moves to the character previous to the first specified character it finds', function() {
        keydown('t');
        normalModeInputKeydown('a');
        expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
        keydown('t');
        normalModeInputKeydown('a');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
      });
      it('moves backwards to the character after the first specified character it finds', function() {
        editor.setCursorScreenPosition([0, 2]);
        keydown('T', {
          shift: true
        });
        normalModeInputKeydown('a');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 1]);
      });
      it('respects count forward', function() {
        keydown('2');
        keydown('t');
        normalModeInputKeydown('a');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 5]);
      });
      it('respects count backward', function() {
        editor.setCursorScreenPosition([0, 6]);
        keydown('2');
        keydown('T', {
          shift: true
        });
        normalModeInputKeydown('a');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 1]);
      });
      it("doesn't move if the character specified isn't found", function() {
        keydown('t');
        normalModeInputKeydown('d');
        expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
        return expect(atom.beep).not.toHaveBeenCalled();
      });
      it("doesn't move if there aren't the specified count of the specified character", function() {
        keydown('1');
        keydown('0');
        keydown('t');
        normalModeInputKeydown('a');
        expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
        keydown('1');
        keydown('1');
        keydown('t');
        normalModeInputKeydown('a');
        expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
        editor.setCursorScreenPosition([0, 6]);
        keydown('1');
        keydown('0');
        keydown('T', {
          shift: true
        });
        normalModeInputKeydown('a');
        expect(editor.getCursorScreenPosition()).toEqual([0, 6]);
        keydown('1');
        keydown('1');
        keydown('T', {
          shift: true
        });
        normalModeInputKeydown('a');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 6]);
      });
      it("composes with d", function() {
        editor.setCursorScreenPosition([0, 3]);
        keydown('d');
        keydown('2');
        keydown('t');
        normalModeInputKeydown('b');
        return expect(editor.getText()).toBe('abcbcabc\n');
      });
      return it("selects character under cursor even when no movement happens", function() {
        editor.setCursorBufferPosition([0, 0]);
        keydown('d');
        keydown('t');
        normalModeInputKeydown('b');
        return expect(editor.getText()).toBe('bcabcabcabc\n');
      });
    });
    describe('the v keybinding', function() {
      beforeEach(function() {
        editor.setText("01\n002\n0003\n00004\n000005\n");
        return editor.setCursorScreenPosition([1, 1]);
      });
      it("selects down a line", function() {
        keydown('v');
        keydown('j');
        keydown('j');
        expect(editor.getSelectedText()).toBe("02\n0003\n00");
        return expect(editor.getSelectedBufferRange().isSingleLine()).toBeFalsy();
      });
      return it("selects right", function() {
        keydown('v');
        keydown('l');
        expect(editor.getSelectedText()).toBe("02");
        return expect(editor.getSelectedBufferRange().isSingleLine()).toBeTruthy();
      });
    });
    describe('the V keybinding', function() {
      beforeEach(function() {
        editor.setText("01\n002\n0003\n00004\n000005\n");
        return editor.setCursorScreenPosition([1, 1]);
      });
      it("selects down a line", function() {
        keydown('V', {
          shift: true
        });
        expect(editor.getSelectedBufferRange().isSingleLine()).toBeFalsy();
        keydown('j');
        keydown('j');
        expect(editor.getSelectedText()).toBe("002\n0003\n00004\n");
        return expect(editor.getSelectedBufferRange().isSingleLine()).toBeFalsy();
      });
      return it("selects up a line", function() {
        keydown('V', {
          shift: true
        });
        keydown('k');
        return expect(editor.getSelectedText()).toBe("01\n002\n");
      });
    });
    describe('the ; and , keybindings', function() {
      beforeEach(function() {
        editor.setText("abcabcabcabc\n");
        return editor.setCursorScreenPosition([0, 0]);
      });
      it("repeat f in same direction", function() {
        keydown('f');
        normalModeInputKeydown('c');
        expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
        keydown(';');
        expect(editor.getCursorScreenPosition()).toEqual([0, 5]);
        keydown(';');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 8]);
      });
      it("repeat F in same direction", function() {
        editor.setCursorScreenPosition([0, 10]);
        keydown('F', {
          shift: true
        });
        normalModeInputKeydown('c');
        expect(editor.getCursorScreenPosition()).toEqual([0, 8]);
        keydown(';');
        expect(editor.getCursorScreenPosition()).toEqual([0, 5]);
        keydown(';');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
      });
      it("repeat f in opposite direction", function() {
        editor.setCursorScreenPosition([0, 6]);
        keydown('f');
        normalModeInputKeydown('c');
        expect(editor.getCursorScreenPosition()).toEqual([0, 8]);
        keydown(',');
        expect(editor.getCursorScreenPosition()).toEqual([0, 5]);
        keydown(',');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
      });
      it("repeat F in opposite direction", function() {
        editor.setCursorScreenPosition([0, 4]);
        keydown('F', {
          shift: true
        });
        normalModeInputKeydown('c');
        expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
        keydown(',');
        expect(editor.getCursorScreenPosition()).toEqual([0, 5]);
        keydown(',');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 8]);
      });
      it("alternate repeat f in same direction and reverse", function() {
        keydown('f');
        normalModeInputKeydown('c');
        expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
        keydown(';');
        expect(editor.getCursorScreenPosition()).toEqual([0, 5]);
        keydown(',');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
      });
      it("alternate repeat F in same direction and reverse", function() {
        editor.setCursorScreenPosition([0, 10]);
        keydown('F', {
          shift: true
        });
        normalModeInputKeydown('c');
        expect(editor.getCursorScreenPosition()).toEqual([0, 8]);
        keydown(';');
        expect(editor.getCursorScreenPosition()).toEqual([0, 5]);
        keydown(',');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 8]);
      });
      it("repeat t in same direction", function() {
        keydown('t');
        normalModeInputKeydown('c');
        expect(editor.getCursorScreenPosition()).toEqual([0, 1]);
        keydown(';');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 4]);
      });
      it("repeat T in same direction", function() {
        editor.setCursorScreenPosition([0, 10]);
        keydown('T', {
          shift: true
        });
        normalModeInputKeydown('c');
        expect(editor.getCursorScreenPosition()).toEqual([0, 9]);
        keydown(';');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 6]);
      });
      it("repeat t in opposite direction first, and then reverse", function() {
        editor.setCursorScreenPosition([0, 3]);
        keydown('t');
        normalModeInputKeydown('c');
        expect(editor.getCursorScreenPosition()).toEqual([0, 4]);
        keydown(',');
        expect(editor.getCursorScreenPosition()).toEqual([0, 3]);
        keydown(';');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 4]);
      });
      it("repeat T in opposite direction first, and then reverse", function() {
        editor.setCursorScreenPosition([0, 4]);
        keydown('T', {
          shift: true
        });
        normalModeInputKeydown('c');
        expect(editor.getCursorScreenPosition()).toEqual([0, 3]);
        keydown(',');
        expect(editor.getCursorScreenPosition()).toEqual([0, 4]);
        keydown(';');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 3]);
      });
      it("repeat with count in same direction", function() {
        editor.setCursorScreenPosition([0, 0]);
        keydown('f');
        normalModeInputKeydown('c');
        expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
        keydown('2');
        keydown(';');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 8]);
      });
      it("repeat with count in reverse direction", function() {
        editor.setCursorScreenPosition([0, 6]);
        keydown('f');
        normalModeInputKeydown('c');
        expect(editor.getCursorScreenPosition()).toEqual([0, 8]);
        keydown('2');
        keydown(',');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
      });
      return it("shares the most recent find/till command with other editors", function() {
        return helpers.getEditorElement(function(otherEditorElement) {
          var otherEditor;
          otherEditor = otherEditorElement.getModel();
          editor.setText("a baz bar\n");
          editor.setCursorScreenPosition([0, 0]);
          otherEditor.setText("foo bar baz");
          otherEditor.setCursorScreenPosition([0, 0]);
          keydown('f');
          normalModeInputKeydown('b');
          expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
          expect(otherEditor.getCursorScreenPosition()).toEqual([0, 0]);
          keydown(';', {
            element: otherEditorElement
          });
          expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
          expect(otherEditor.getCursorScreenPosition()).toEqual([0, 4]);
          keydown('t', {
            element: otherEditorElement
          });
          normalModeInputKeydown('r', {
            editor: otherEditor
          });
          expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
          expect(otherEditor.getCursorScreenPosition()).toEqual([0, 5]);
          keydown(';');
          expect(editor.getCursorScreenPosition()).toEqual([0, 7]);
          expect(otherEditor.getCursorScreenPosition()).toEqual([0, 5]);
          return expect(atom.beep).not.toHaveBeenCalled();
        });
      });
    });
    describe('the % motion', function() {
      beforeEach(function() {
        editor.setText("( ( ) )--{ text in here; and a function call(with parameters) }\n");
        return editor.setCursorScreenPosition([0, 0]);
      });
      it('matches the correct parenthesis', function() {
        keydown('%');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 6]);
      });
      it('matches the correct brace', function() {
        editor.setCursorScreenPosition([0, 9]);
        keydown('%');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 62]);
      });
      it('composes correctly with d', function() {
        editor.setCursorScreenPosition([0, 9]);
        keydown('d');
        keydown('%');
        return expect(editor.getText()).toEqual("( ( ) )--\n");
      });
      it('moves correctly when composed with v going forward', function() {
        keydown('v');
        keydown('h');
        keydown('%');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 7]);
      });
      it('moves correctly when composed with v going backward', function() {
        editor.setCursorScreenPosition([0, 5]);
        keydown('v');
        keydown('%');
        return expect(editor.getCursorScreenPosition()).toEqual([0, 0]);
      });
      it('it moves appropriately to find the nearest matching action', function() {
        editor.setCursorScreenPosition([0, 3]);
        keydown('%');
        expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
        return expect(editor.getText()).toEqual("( ( ) )--{ text in here; and a function call(with parameters) }\n");
      });
      it('it moves appropriately to find the nearest matching action', function() {
        editor.setCursorScreenPosition([0, 26]);
        keydown('%');
        expect(editor.getCursorScreenPosition()).toEqual([0, 60]);
        return expect(editor.getText()).toEqual("( ( ) )--{ text in here; and a function call(with parameters) }\n");
      });
      it("finds matches across multiple lines", function() {
        editor.setText("...(\n...)");
        editor.setCursorScreenPosition([0, 0]);
        keydown("%");
        return expect(editor.getCursorScreenPosition()).toEqual([1, 3]);
      });
      return it("does not affect search history", function() {
        keydown('/');
        submitNormalModeInputText('func');
        expect(editor.getCursorBufferPosition()).toEqual([0, 31]);
        keydown('%');
        expect(editor.getCursorBufferPosition()).toEqual([0, 60]);
        keydown('n');
        return expect(editor.getCursorBufferPosition()).toEqual([0, 31]);
      });
    });
    return describe("scrolling screen and keeping cursor in the same screen position", function() {
      beforeEach(function() {
        var _i, _results;
        editor.setText((function() {
          _results = [];
          for (_i = 0; _i < 80; _i++){ _results.push(_i); }
          return _results;
        }).apply(this).join("\n"));
        editor.setHeight(20 * 10);
        editor.setLineHeightInPixels(10);
        editor.setScrollTop(40 * 10);
        return editor.setCursorBufferPosition([42, 0]);
      });
      describe("the ctrl-u keybinding", function() {
        it("moves the screen down by half screen size and keeps cursor onscreen", function() {
          keydown('u', {
            ctrl: true
          });
          expect(editor.getScrollTop()).toEqual(300);
          return expect(editor.getCursorBufferPosition()).toEqual([32, 0]);
        });
        it("selects on visual mode", function() {
          editor.setCursorBufferPosition([42, 1]);
          vimState.activateVisualMode();
          keydown('u', {
            ctrl: true
          });
          return expect(editor.getSelectedText()).toEqual([32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42].join("\n"));
        });
        return it("selects on linewise mode", function() {
          vimState.activateVisualMode('linewise');
          keydown('u', {
            ctrl: true
          });
          return expect(editor.getSelectedText()).toEqual([32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42].join("\n").concat("\n"));
        });
      });
      describe("the ctrl-b keybinding", function() {
        it("moves screen up one page", function() {
          keydown('b', {
            ctrl: true
          });
          expect(editor.getScrollTop()).toEqual(200);
          return expect(editor.getCursorScreenPosition()).toEqual([22, 0]);
        });
        it("selects on visual mode", function() {
          editor.setCursorBufferPosition([42, 1]);
          vimState.activateVisualMode();
          keydown('b', {
            ctrl: true
          });
          return expect(editor.getSelectedText()).toEqual([22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42].join("\n"));
        });
        return it("selects on linewise mode", function() {
          vimState.activateVisualMode('linewise');
          keydown('b', {
            ctrl: true
          });
          return expect(editor.getSelectedText()).toEqual([22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42].join("\n").concat("\n"));
        });
      });
      describe("the ctrl-d keybinding", function() {
        it("moves the screen down by half screen size and keeps cursor onscreen", function() {
          keydown('d', {
            ctrl: true
          });
          expect(editor.getScrollTop()).toEqual(500);
          return expect(editor.getCursorBufferPosition()).toEqual([52, 0]);
        });
        it("selects on visual mode", function() {
          editor.setCursorBufferPosition([42, 1]);
          vimState.activateVisualMode();
          keydown('d', {
            ctrl: true
          });
          return expect(editor.getSelectedText()).toEqual([42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52].join("\n").slice(1, -1));
        });
        return it("selects on linewise mode", function() {
          vimState.activateVisualMode('linewise');
          keydown('d', {
            ctrl: true
          });
          return expect(editor.getSelectedText()).toEqual([42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52].join("\n").concat("\n"));
        });
      });
      return describe("the ctrl-f keybinding", function() {
        it("moves screen down one page", function() {
          keydown('f', {
            ctrl: true
          });
          expect(editor.getScrollTop()).toEqual(600);
          return expect(editor.getCursorScreenPosition()).toEqual([62, 0]);
        });
        it("selects on visual mode", function() {
          editor.setCursorBufferPosition([42, 1]);
          vimState.activateVisualMode();
          keydown('f', {
            ctrl: true
          });
          return expect(editor.getSelectedText()).toEqual([42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62].join("\n").slice(1, -1));
        });
        return it("selects on linewise mode", function() {
          vimState.activateVisualMode('linewise');
          keydown('f', {
            ctrl: true
          });
          return expect(editor.getSelectedText()).toEqual([42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62].join("\n").concat("\n"));
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3ZpbS1tb2RlL3NwZWMvbW90aW9ucy1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxPQUFBOztBQUFBLEVBQUEsT0FBQSxHQUFVLE9BQUEsQ0FBUSxlQUFSLENBQVYsQ0FBQTs7QUFBQSxFQUVBLFFBQUEsQ0FBUyxTQUFULEVBQW9CLFNBQUEsR0FBQTtBQUNsQixRQUFBLGlHQUFBO0FBQUEsSUFBQSxPQUFvQyxFQUFwQyxFQUFDLGdCQUFELEVBQVMsdUJBQVQsRUFBd0Isa0JBQXhCLENBQUE7QUFBQSxJQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxVQUFBLE9BQUE7QUFBQSxNQUFBLE9BQUEsR0FBVSxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQWQsQ0FBMEIsVUFBMUIsQ0FBVixDQUFBO0FBQUEsTUFDQSxPQUFPLENBQUMsaUJBQVIsQ0FBQSxDQURBLENBQUE7YUFHQSxPQUFPLENBQUMsZ0JBQVIsQ0FBeUIsU0FBQyxPQUFELEdBQUE7QUFDdkIsUUFBQSxhQUFBLEdBQWdCLE9BQWhCLENBQUE7QUFBQSxRQUNBLE1BQUEsR0FBUyxhQUFhLENBQUMsUUFBZCxDQUFBLENBRFQsQ0FBQTtBQUFBLFFBRUEsUUFBQSxHQUFXLGFBQWEsQ0FBQyxRQUZ6QixDQUFBO0FBQUEsUUFHQSxRQUFRLENBQUMsa0JBQVQsQ0FBQSxDQUhBLENBQUE7ZUFJQSxRQUFRLENBQUMsZUFBVCxDQUFBLEVBTHVCO01BQUEsQ0FBekIsRUFKUztJQUFBLENBQVgsQ0FGQSxDQUFBO0FBQUEsSUFhQSxPQUFBLEdBQVUsU0FBQyxHQUFELEVBQU0sT0FBTixHQUFBOztRQUFNLFVBQVE7T0FDdEI7O1FBQUEsT0FBTyxDQUFDLFVBQVc7T0FBbkI7YUFDQSxPQUFPLENBQUMsT0FBUixDQUFnQixHQUFo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

//# sourceURL=/Users/ah/.atom/packages/vim-mode/spec/motions-spec.coffee
