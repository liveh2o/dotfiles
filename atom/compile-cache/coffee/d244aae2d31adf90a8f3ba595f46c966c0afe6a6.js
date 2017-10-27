(function() {
  var StatusBarManager, VimState, helpers, _;

  _ = require('underscore-plus');

  helpers = require('./spec-helper');

  VimState = require('../lib/vim-state');

  StatusBarManager = require('../lib/status-bar-manager');

  describe("VimState", function() {
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
    describe("initialization", function() {
      it("puts the editor in normal-mode initially by default", function() {
        expect(editorElement.classList.contains('vim-mode')).toBe(true);
        return expect(editorElement.classList.contains('normal-mode')).toBe(true);
      });
      return it("puts the editor in insert-mode if startInInsertMode is true", function() {
        atom.config.set('vim-mode.startInInsertMode', true);
        editor.vimState = new VimState(editorElement, new StatusBarManager);
        return expect(editorElement.classList.contains('insert-mode')).toBe(true);
      });
    });
    describe("::destroy", function() {
      it("re-enables text input on the editor", function() {
        expect(editorElement.component.isInputEnabled()).toBeFalsy();
        vimState.destroy();
        return expect(editorElement.component.isInputEnabled()).toBeTruthy();
      });
      it("removes the mode classes from the editor", function() {
        expect(editorElement.classList.contains("normal-mode")).toBeTruthy();
        vimState.destroy();
        return expect(editorElement.classList.contains("normal-mode")).toBeFalsy();
      });
      return it("is a noop when the editor is already destroyed", function() {
        editorElement.getModel().destroy();
        return vimState.destroy();
      });
    });
    describe("normal-mode", function() {
      describe("when entering an insertable character", function() {
        beforeEach(function() {
          return keydown('\\');
        });
        return it("stops propagation", function() {
          return expect(editor.getText()).toEqual('');
        });
      });
      describe("when entering an operator", function() {
        beforeEach(function() {
          return keydown('d');
        });
        describe("with an operator that can't be composed", function() {
          beforeEach(function() {
            return keydown('x');
          });
          return it("clears the operator stack", function() {
            return expect(vimState.opStack.length).toBe(0);
          });
        });
        describe("the escape keybinding", function() {
          beforeEach(function() {
            return keydown('escape');
          });
          return it("clears the operator stack", function() {
            return expect(vimState.opStack.length).toBe(0);
          });
        });
        return describe("the ctrl-c keybinding", function() {
          beforeEach(function() {
            return keydown('c', {
              ctrl: true
            });
          });
          return it("clears the operator stack", function() {
            return expect(vimState.opStack.length).toBe(0);
          });
        });
      });
      describe("the escape keybinding", function() {
        return it("clears any extra cursors", function() {
          editor.setText("one-two-three");
          editor.addCursorAtBufferPosition([0, 3]);
          expect(editor.getCursors().length).toBe(2);
          keydown('escape');
          return expect(editor.getCursors().length).toBe(1);
        });
      });
      describe("the v keybinding", function() {
        beforeEach(function() {
          editor.setText("012345\nabcdef");
          editor.setCursorScreenPosition([0, 0]);
          return keydown('v');
        });
        it("puts the editor into visual characterwise mode", function() {
          expect(editorElement.classList.contains('visual-mode')).toBe(true);
          expect(vimState.submode).toEqual('characterwise');
          return expect(editorElement.classList.contains('normal-mode')).toBe(false);
        });
        return it("selects the current character", function() {
          return expect(editor.getLastSelection().getText()).toEqual('0');
        });
      });
      describe("the V keybinding", function() {
        beforeEach(function() {
          editor.setText("012345\nabcdef");
          editor.setCursorScreenPosition([0, 0]);
          return keydown('V', {
            shift: true
          });
        });
        it("puts the editor into visual linewise mode", function() {
          expect(editorElement.classList.contains('visual-mode')).toBe(true);
          expect(vimState.submode).toEqual('linewise');
          return expect(editorElement.classList.contains('normal-mode')).toBe(false);
        });
        return it("selects the current line", function() {
          return expect(editor.getLastSelection().getText()).toEqual('012345\n');
        });
      });
      describe("the ctrl-v keybinding", function() {
        beforeEach(function() {
          editor.setText("012345\nabcdef");
          editor.setCursorScreenPosition([0, 0]);
          return keydown('v', {
            ctrl: true
          });
        });
        return it("puts the editor into visual blockwise mode", function() {
          expect(editorElement.classList.contains('visual-mode')).toBe(true);
          expect(vimState.submode).toEqual('blockwise');
          return expect(editorElement.classList.contains('normal-mode')).toBe(false);
        });
      });
      describe("selecting text", function() {
        beforeEach(function() {
          editor.setText("abc def");
          return editor.setCursorScreenPosition([0, 0]);
        });
        it("puts the editor into visual mode", function() {
          expect(vimState.mode).toEqual('normal');
          atom.commands.dispatch(editorElement, "core:select-right");
          expect(vimState.mode).toEqual('visual');
          expect(vimState.submode).toEqual('characterwise');
          return expect(editor.getSelectedBufferRanges()).toEqual([[[0, 0], [0, 1]]]);
        });
        it("handles the editor being destroyed shortly after selecting text", function() {
          editor.setSelectedBufferRanges([[[0, 0], [0, 3]]]);
          editor.destroy();
          vimState.destroy();
          return advanceClock(100);
        });
        return it("handles native selection such as core:select-all", function() {
          atom.commands.dispatch(editorElement, "core:select-all");
          return expect(editor.getSelectedBufferRanges()).toEqual([[[0, 0], [0, 7]]]);
        });
      });
      describe("the i keybinding", function() {
        beforeEach(function() {
          return keydown('i');
        });
        return it("puts the editor into insert mode", function() {
          expect(editorElement.classList.contains('insert-mode')).toBe(true);
          return expect(editorElement.classList.contains('normal-mode')).toBe(false);
        });
      });
      describe("the R keybinding", function() {
        beforeEach(function() {
          return keydown('R', {
            shift: true
          });
        });
        return it("puts the editor into replace mode", function() {
          expect(editorElement.classList.contains('insert-mode')).toBe(true);
          expect(editorElement.classList.contains('replace-mode')).toBe(true);
          return expect(editorElement.classList.contains('normal-mode')).toBe(false);
        });
      });
      describe("with content", function() {
        beforeEach(function() {
          editor.setText("012345\n\nabcdef");
          return editor.setCursorScreenPosition([0, 0]);
        });
        describe("on a line with content", function() {
          return it("does not allow atom commands to place the cursor on the \\n character", function() {
            atom.commands.dispatch(editorElement, "editor:move-to-end-of-line");
            return expect(editor.getCursorScreenPosition()).toEqual([0, 5]);
          });
        });
        return describe("on an empty line", function() {
          beforeEach(function() {
            editor.setCursorScreenPosition([1, 0]);
            return atom.commands.dispatch(editorElement, "editor:move-to-end-of-line");
          });
          return it("allows the cursor to be placed on the \\n character", function() {
            return expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
          });
        });
      });
      return describe('with character-input operations', function() {
        beforeEach(function() {
          return editor.setText('012345\nabcdef');
        });
        return it('properly clears the opStack', function() {
          keydown('d');
          keydown('r');
          expect(vimState.mode).toBe('normal');
          expect(vimState.opStack.length).toBe(0);
          atom.commands.dispatch(editor.normalModeInputView.editorElement, "core:cancel");
          keydown('d');
          return expect(editor.getText()).toBe('012345\nabcdef');
        });
      });
    });
    describe("insert-mode", function() {
      beforeEach(function() {
        return keydown('i');
      });
      describe("with content", function() {
        beforeEach(function() {
          return editor.setText("012345\n\nabcdef");
        });
        describe("when cursor is in the middle of the line", function() {
          beforeEach(function() {
            return editor.setCursorScreenPosition([0, 3]);
          });
          return it("moves the cursor to the left when exiting insert mode", function() {
            keydown('escape');
            return expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
          });
        });
        describe("when cursor is at the beginning of line", function() {
          beforeEach(function() {
            return editor.setCursorScreenPosition([1, 0]);
          });
          return it("leaves the cursor at the beginning of line", function() {
            keydown('escape');
            return expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
          });
        });
        return describe("on a line with content", function() {
          beforeEach(function() {
            editor.setCursorScreenPosition([0, 0]);
            return atom.commands.dispatch(editorElement, "editor:move-to-end-of-line");
          });
          return it("allows the cursor to be placed on the \\n character", function() {
            return expect(editor.getCursorScreenPosition()).toEqual([0, 6]);
          });
        });
      });
      it("puts the editor into normal mode when <escape> is pressed", function() {
        keydown('escape');
        expect(editorElement.classList.contains('normal-mode')).toBe(true);
        expect(editorElement.classList.contains('insert-mode')).toBe(false);
        return expect(editorElement.classList.contains('visual-mode')).toBe(false);
      });
      return it("puts the editor into normal mode when <ctrl-c> is pressed", function() {
        helpers.mockPlatform(editorElement, 'platform-darwin');
        keydown('c', {
          ctrl: true
        });
        helpers.unmockPlatform(editorElement);
        expect(editorElement.classList.contains('normal-mode')).toBe(true);
        expect(editorElement.classList.contains('insert-mode')).toBe(false);
        return expect(editorElement.classList.contains('visual-mode')).toBe(false);
      });
    });
    describe("replace-mode", function() {
      describe("with content", function() {
        beforeEach(function() {
          return editor.setText("012345\n\nabcdef");
        });
        describe("when cursor is in the middle of the line", function() {
          beforeEach(function() {
            editor.setCursorScreenPosition([0, 3]);
            return keydown('R', {
              shift: true
            });
          });
          return it("moves the cursor to the left when exiting replace mode", function() {
            keydown('escape');
            return expect(editor.getCursorScreenPosition()).toEqual([0, 2]);
          });
        });
        describe("when cursor is at the beginning of line", function() {
          beforeEach(function() {
            editor.setCursorScreenPosition([1, 0]);
            return keydown('R', {
              shift: true
            });
          });
          return it("leaves the cursor at the beginning of line", function() {
            keydown('escape');
            return expect(editor.getCursorScreenPosition()).toEqual([1, 0]);
          });
        });
        return describe("on a line with content", function() {
          beforeEach(function() {
            keydown('R', {
              shift: true
            });
            editor.setCursorScreenPosition([0, 0]);
            return atom.commands.dispatch(editorElement, "editor:move-to-end-of-line");
          });
          return it("allows the cursor to be placed on the \\n character", function() {
            return expect(editor.getCursorScreenPosition()).toEqual([0, 6]);
          });
        });
      });
      it("puts the editor into normal mode when <escape> is pressed", function() {
        keydown('R', {
          shift: true
        });
        keydown('escape');
        expect(editorElement.classList.contains('normal-mode')).toBe(true);
        expect(editorElement.classList.contains('insert-mode')).toBe(false);
        expect(editorElement.classList.contains('replace-mode')).toBe(false);
        return expect(editorElement.classList.contains('visual-mode')).toBe(false);
      });
      return it("puts the editor into normal mode when <ctrl-c> is pressed", function() {
        keydown('R', {
          shift: true
        });
        helpers.mockPlatform(editorElement, 'platform-darwin');
        keydown('c', {
          ctrl: true
        });
        helpers.unmockPlatform(editorElement);
        expect(editorElement.classList.contains('normal-mode')).toBe(true);
        expect(editorElement.classList.contains('insert-mode')).toBe(false);
        expect(editorElement.classList.contains('replace-mode')).toBe(false);
        return expect(editorElement.classList.contains('visual-mode')).toBe(false);
      });
    });
    describe("visual-mode", function() {
      beforeEach(function() {
        editor.setText("one two three");
        editor.setCursorBufferPosition([0, 4]);
        return keydown('v');
      });
      it("selects the character under the cursor", function() {
        expect(editor.getSelectedBufferRanges()).toEqual([[[0, 4], [0, 5]]]);
        return expect(editor.getSelectedText()).toBe("t");
      });
      it("puts the editor into normal mode when <escape> is pressed", function() {
        keydown('escape');
        expect(editor.getCursorBufferPositions()).toEqual([[0, 4]]);
        expect(editorElement.classList.contains('normal-mode')).toBe(true);
        return expect(editorElement.classList.contains('visual-mode')).toBe(false);
      });
      it("puts the editor into normal mode when <escape> is pressed on selection is reversed", function() {
        expect(editor.getSelectedText()).toBe("t");
        keydown("h");
        keydown("h");
        expect(editor.getSelectedText()).toBe("e t");
        expect(editor.getLastSelection().isReversed()).toBe(true);
        keydown('escape');
        expect(editorElement.classList.contains('normal-mode')).toBe(true);
        return expect(editor.getCursorBufferPositions()).toEqual([[0, 2]]);
      });
      describe("motions", function() {
        it("transforms the selection", function() {
          keydown('w');
          return expect(editor.getLastSelection().getText()).toEqual('two t');
        });
        return it("always leaves the initially selected character selected", function() {
          keydown("h");
          expect(editor.getSelectedText()).toBe(" t");
          keydown("l");
          expect(editor.getSelectedText()).toBe("t");
          keydown("l");
          return expect(editor.getSelectedText()).toBe("tw");
        });
      });
      describe("operators", function() {
        beforeEach(function() {
          editor.setText("012345\n\nabcdef");
          editor.setCursorScreenPosition([0, 0]);
          editor.selectLinesContainingCursors();
          return keydown('d');
        });
        return it("operate on the current selection", function() {
          return expect(editor.getText()).toEqual("\nabcdef");
        });
      });
      describe("returning to normal-mode", function() {
        beforeEach(function() {
          editor.setText("012345\n\nabcdef");
          editor.selectLinesContainingCursors();
          return keydown('escape');
        });
        return it("operate on the current selection", function() {
          return expect(editor.getLastSelection().getText()).toEqual('');
        });
      });
      describe("the o keybinding", function() {
        it("reversed each selection", function() {
          editor.addCursorAtBufferPosition([0, Infinity]);
          keydown("i");
          keydown("w");
          expect(editor.getSelectedBufferRanges()).toEqual([[[0, 4], [0, 7]], [[0, 8], [0, 13]]]);
          expect(editor.getCursorBufferPositions()).toEqual([[0, 7], [0, 13]]);
          keydown("o");
          expect(editor.getSelectedBufferRanges()).toEqual([[[0, 4], [0, 7]], [[0, 8], [0, 13]]]);
          return expect(editor.getCursorBufferPositions()).toEqual([[0, 4], [0, 8]]);
        });
        return it("harmonizes selection directions", function() {
          keydown("e");
          editor.addCursorAtBufferPosition([0, Infinity]);
          keydown("h");
          keydown("h");
          expect(editor.getSelectedBufferRanges()).toEqual([[[0, 4], [0, 5]], [[0, 11], [0, 13]]]);
          expect(editor.getCursorBufferPositions()).toEqual([[0, 5], [0, 11]]);
          keydown("o");
          expect(editor.getSelectedBufferRanges()).toEqual([[[0, 4], [0, 5]], [[0, 11], [0, 13]]]);
          return expect(editor.getCursorBufferPositions()).toEqual([[0, 5], [0, 13]]);
        });
      });
      return describe("activate visualmode witin visualmode", function() {
        beforeEach(function() {
          keydown('escape');
          expect(vimState.mode).toEqual('normal');
          return expect(editorElement.classList.contains('normal-mode')).toBe(true);
        });
        it("activateVisualMode with same type puts the editor into normal mode", function() {
          keydown('v');
          expect(editorElement.classList.contains('visual-mode')).toBe(true);
          expect(vimState.submode).toEqual('characterwise');
          expect(editorElement.classList.contains('normal-mode')).toBe(false);
          keydown('v');
          expect(vimState.mode).toEqual('normal');
          expect(editorElement.classList.contains('normal-mode')).toBe(true);
          keydown('V', {
            shift: true
          });
          expect(editorElement.classList.contains('visual-mode')).toBe(true);
          expect(vimState.submode).toEqual('linewise');
          expect(editorElement.classList.contains('normal-mode')).toBe(false);
          keydown('V', {
            shift: true
          });
          expect(vimState.mode).toEqual('normal');
          expect(editorElement.classList.contains('normal-mode')).toBe(true);
          keydown('v', {
            ctrl: true
          });
          expect(editorElement.classList.contains('visual-mode')).toBe(true);
          expect(vimState.submode).toEqual('blockwise');
          expect(editorElement.classList.contains('normal-mode')).toBe(false);
          keydown('v', {
            ctrl: true
          });
          expect(vimState.mode).toEqual('normal');
          return expect(editorElement.classList.contains('normal-mode')).toBe(true);
        });
        return describe("change submode within visualmode", function() {
          beforeEach(function() {
            editor.setText("line one\nline two\nline three\n");
            editor.setCursorBufferPosition([0, 5]);
            return editor.addCursorAtBufferPosition([2, 5]);
          });
          it("can change submode within visual mode", function() {
            keydown('v');
            expect(editorElement.classList.contains('visual-mode')).toBe(true);
            expect(vimState.submode).toEqual('characterwise');
            expect(editorElement.classList.contains('normal-mode')).toBe(false);
            keydown('V', {
              shift: true
            });
            expect(editorElement.classList.contains('visual-mode')).toBe(true);
            expect(vimState.submode).toEqual('linewise');
            expect(editorElement.classList.contains('normal-mode')).toBe(false);
            keydown('v', {
              ctrl: true
            });
            expect(editorElement.classList.contains('visual-mode')).toBe(true);
            expect(vimState.submode).toEqual('blockwise');
            expect(editorElement.classList.contains('normal-mode')).toBe(false);
            keydown('v');
            expect(editorElement.classList.contains('visual-mode')).toBe(true);
            expect(vimState.submode).toEqual('characterwise');
            return expect(editorElement.classList.contains('normal-mode')).toBe(false);
          });
          return it("recover original range when shift from linewse to characterwise", function() {
            keydown('v');
            keydown('i');
            keydown('w');
            expect(_.map(editor.getSelections(), function(selection) {
              return selection.getText();
            })).toEqual(['one', 'three']);
            keydown('V', {
              shift: true
            });
            expect(_.map(editor.getSelections(), function(selection) {
              return selection.getText();
            })).toEqual(["line one\n", "line three\n"]);
            keydown('v', {
              ctrl: true
            });
            return expect(_.map(editor.getSelections(), function(selection) {
              return selection.getText();
            })).toEqual(['one', 'three']);
          });
        });
      });
    });
    return describe("marks", function() {
      beforeEach(function() {
        return editor.setText("text in line 1\ntext in line 2\ntext in line 3");
      });
      it("basic marking functionality", function() {
        editor.setCursorScreenPosition([1, 1]);
        keydown('m');
        normalModeInputKeydown('t');
        expect(editor.getText()).toEqual("text in line 1\ntext in line 2\ntext in line 3");
        editor.setCursorScreenPosition([2, 2]);
        keydown('`');
        normalModeInputKeydown('t');
        return expect(editor.getCursorScreenPosition()).toEqual([1, 1]);
      });
      it("real (tracking) marking functionality", function() {
        editor.setCursorScreenPosition([2, 2]);
        keydown('m');
        normalModeInputKeydown('q');
        editor.setCursorScreenPosition([1, 2]);
        keydown('o');
        keydown('escape');
        keydown('`');
        normalModeInputKeydown('q');
        return expect(editor.getCursorScreenPosition()).toEqual([3, 2]);
      });
      return it("real (tracking) marking functionality", function() {
        editor.setCursorScreenPosition([2, 2]);
        keydown('m');
        normalModeInputKeydown('q');
        editor.setCursorScreenPosition([1, 2]);
        keydown('d');
        keydown('d');
        keydown('escape');
        keydown('`');
        normalModeInputKeydown('q');
        return expect(editor.getCursorScreenPosition()).toEqual([1, 2]);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3ZpbS1tb2RlL3NwZWMvdmltLXN0YXRlLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNDQUFBOztBQUFBLEVBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQUFKLENBQUE7O0FBQUEsRUFDQSxPQUFBLEdBQVUsT0FBQSxDQUFRLGVBQVIsQ0FEVixDQUFBOztBQUFBLEVBRUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxrQkFBUixDQUZYLENBQUE7O0FBQUEsRUFHQSxnQkFBQSxHQUFtQixPQUFBLENBQVEsMkJBQVIsQ0FIbkIsQ0FBQTs7QUFBQSxFQUtBLFFBQUEsQ0FBUyxVQUFULEVBQXFCLFNBQUEsR0FBQTtBQUNuQixRQUFBLHNFQUFBO0FBQUEsSUFBQSxPQUFvQyxFQUFwQyxFQUFDLGdCQUFELEVBQVMsdUJBQVQsRUFBd0Isa0JBQXhCLENBQUE7QUFBQSxJQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxVQUFBLE9BQUE7QUFBQSxNQUFBLE9BQUEsR0FBVSxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQWQsQ0FBMEIsVUFBMUIsQ0FBVixDQUFBO0FBQUEsTUFDQSxPQUFPLENBQUMsaUJBQVIsQ0FBQSxDQURBLENBQUE7YUFHQSxPQUFPLENBQUMsZ0JBQVIsQ0FBeUIsU0FBQyxPQUFELEdBQUE7QUFDdkIsUUFBQSxhQUFBLEdBQWdCLE9BQWhCLENBQUE7QUFBQSxRQUNBLE1BQUEsR0FBUyxhQUFhLENBQUMsUUFBZCxDQUFBLENBRFQsQ0FBQTtBQUFBLFFBRUEsUUFBQSxHQUFXLGFBQWEsQ0FBQyxRQUZ6QixDQUFBO0FBQUEsUUFHQSxRQUFRLENBQUMsa0JBQVQsQ0FBQSxDQUhBLENBQUE7ZUFJQSxRQUFRLENBQUMsZUFBVCxDQUFBLEVBTHVCO01BQUEsQ0FB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

//# sourceURL=/Users/ah/.atom/packages/vim-mode/spec/vim-state-spec.coffee
