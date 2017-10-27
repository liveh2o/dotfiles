(function() {
  var helpers;

  helpers = require('./spec-helper');

  describe("Insert mode commands", function() {
    var editor, editorElement, keydown, vimState, _ref;
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
    return describe("Copy from line above/below", function() {
      beforeEach(function() {
        editor.setText("12345\n\nabcd\nefghi");
        editor.setCursorBufferPosition([1, 0]);
        editor.addCursorAtBufferPosition([3, 0]);
        return keydown('i');
      });
      describe("the ctrl-y command", function() {
        it("copies from the line above", function() {
          keydown('y', {
            ctrl: true
          });
          expect(editor.getText()).toBe('12345\n1\nabcd\naefghi');
          editor.insertText(' ');
          keydown('y', {
            ctrl: true
          });
          return expect(editor.getText()).toBe('12345\n1 3\nabcd\na cefghi');
        });
        it("does nothing if there's nothing above the cursor", function() {
          editor.insertText('fill');
          keydown('y', {
            ctrl: true
          });
          expect(editor.getText()).toBe('12345\nfill5\nabcd\nfillefghi');
          keydown('y', {
            ctrl: true
          });
          return expect(editor.getText()).toBe('12345\nfill5\nabcd\nfillefghi');
        });
        return it("does nothing on the first line", function() {
          editor.setCursorBufferPosition([0, 2]);
          editor.addCursorAtBufferPosition([3, 2]);
          editor.insertText('a');
          expect(editor.getText()).toBe('12a345\n\nabcd\nefaghi');
          keydown('y', {
            ctrl: true
          });
          return expect(editor.getText()).toBe('12a345\n\nabcd\nefadghi');
        });
      });
      return describe("the ctrl-e command", function() {
        beforeEach(function() {
          return atom.keymaps.add("test", {
            'atom-text-editor.vim-mode.insert-mode': {
              'ctrl-e': 'vim-mode:copy-from-line-below'
            }
          });
        });
        it("copies from the line below", function() {
          keydown('e', {
            ctrl: true
          });
          expect(editor.getText()).toBe('12345\na\nabcd\nefghi');
          editor.insertText(' ');
          keydown('e', {
            ctrl: true
          });
          return expect(editor.getText()).toBe('12345\na c\nabcd\n efghi');
        });
        return it("does nothing if there's nothing below the cursor", function() {
          editor.insertText('foo');
          keydown('e', {
            ctrl: true
          });
          expect(editor.getText()).toBe('12345\nfood\nabcd\nfooefghi');
          keydown('e', {
            ctrl: true
          });
          return expect(editor.getText()).toBe('12345\nfood\nabcd\nfooefghi');
        });
      });
    });
  });

}).call(this);
