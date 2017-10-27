(function() {
  var helpers;

  helpers = require('./spec-helper');

  describe("Scrolling", function() {
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
        vimState.activateCommandMode();
        return vimState.resetCommandMode();
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
    describe("scrolling keybindings", function() {
      beforeEach(function() {
        editor.setText("1\n2\n3\n4\n5\n6\n7\n8\n9\n10");
        spyOn(editor, 'getFirstVisibleScreenRow').andReturn(2);
        spyOn(editor, 'getLastVisibleScreenRow').andReturn(8);
        return spyOn(editor, 'scrollToScreenPosition');
      });
      describe("the ctrl-e keybinding", function() {
        beforeEach(function() {
          spyOn(editor, 'getCursorScreenPosition').andReturn({
            row: 4,
            column: 0
          });
          return spyOn(editor, 'setCursorScreenPosition');
        });
        return it("moves the screen down by one and keeps cursor onscreen", function() {
          keydown('e', {
            ctrl: true
          });
          expect(editor.scrollToScreenPosition).toHaveBeenCalledWith([7, 0]);
          return expect(editor.setCursorScreenPosition).toHaveBeenCalledWith([6, 0]);
        });
      });
      return describe("the ctrl-y keybinding", function() {
        beforeEach(function() {
          spyOn(editor, 'getCursorScreenPosition').andReturn({
            row: 6,
            column: 0
          });
          return spyOn(editor, 'setCursorScreenPosition');
        });
        return it("moves the screen up by one and keeps the cursor onscreen", function() {
          keydown('y', {
            ctrl: true
          });
          expect(editor.scrollToScreenPosition).toHaveBeenCalledWith([3, 0]);
          return expect(editor.setCursorScreenPosition).toHaveBeenCalledWith([4, 0]);
        });
      });
    });
    describe("scroll cursor keybindings", function() {
      beforeEach(function() {
        var i, text, _i;
        text = "";
        for (i = _i = 1; _i <= 200; i = ++_i) {
          text += "" + i + "\n";
        }
        editor.setText(text);
        spyOn(editor, 'moveToFirstCharacterOfLine');
        spyOn(editor, 'getLineHeightInPixels').andReturn(20);
        spyOn(editor, 'setScrollTop');
        spyOn(editor, 'getHeight').andReturn(200);
        spyOn(editor, 'getFirstVisibleScreenRow').andReturn(90);
        return spyOn(editor, 'getLastVisibleScreenRow').andReturn(110);
      });
      describe("the z<CR> keybinding", function() {
        var keydownCodeForEnter;
        keydownCodeForEnter = '\r';
        beforeEach(function() {
          return spyOn(editor, 'pixelPositionForScreenPosition').andReturn({
            top: 1000,
            left: 0
          });
        });
        return it("moves the screen to position cursor at the top of the window and moves cursor to first non-blank in the line", function() {
          keydown('z');
          keydown(keydownCodeForEnter);
          expect(editor.setScrollTop).toHaveBeenCalledWith(960);
          return expect(editor.moveToFirstCharacterOfLine).toHaveBeenCalled();
        });
      });
      describe("the zt keybinding", function() {
        beforeEach(function() {
          return spyOn(editor, 'pixelPositionForScreenPosition').andReturn({
            top: 1000,
            left: 0
          });
        });
        return it("moves the screen to position cursor at the top of the window and leave cursor in the same column", function() {
          keydown('z');
          keydown('t');
          expect(editor.setScrollTop).toHaveBeenCalledWith(960);
          return expect(editor.moveToFirstCharacterOfLine).not.toHaveBeenCalled();
        });
      });
      describe("the z. keybinding", function() {
        beforeEach(function() {
          return spyOn(editor, 'pixelPositionForScreenPosition').andReturn({
            top: 1000,
            left: 0
          });
        });
        return it("moves the screen to position cursor at the center of the window and moves cursor to first non-blank in the line", function() {
          keydown('z');
          keydown('.');
          expect(editor.setScrollTop).toHaveBeenCalledWith(900);
          return expect(editor.moveToFirstCharacterOfLine).toHaveBeenCalled();
        });
      });
      describe("the zz keybinding", function() {
        beforeEach(function() {
          return spyOn(editor, 'pixelPositionForScreenPosition').andReturn({
            top: 1000,
            left: 0
          });
        });
        return it("moves the screen to position cursor at the center of the window and leave cursor in the same column", function() {
          keydown('z');
          keydown('z');
          expect(editor.setScrollTop).toHaveBeenCalledWith(900);
          return expect(editor.moveToFirstCharacterOfLine).not.toHaveBeenCalled();
        });
      });
      describe("the z- keybinding", function() {
        beforeEach(function() {
          return spyOn(editor, 'pixelPositionForScreenPosition').andReturn({
            top: 1000,
            left: 0
          });
        });
        return it("moves the screen to position cursor at the bottom of the window and moves cursor to first non-blank in the line", function() {
          keydown('z');
          keydown('-');
          expect(editor.setScrollTop).toHaveBeenCalledWith(860);
          return expect(editor.moveToFirstCharacterOfLine).toHaveBeenCalled();
        });
      });
      return describe("the zb keybinding", function() {
        beforeEach(function() {
          return spyOn(editor, 'pixelPositionForScreenPosition').andReturn({
            top: 1000,
            left: 0
          });
        });
        return it("moves the screen to position cursor at the bottom of the window and leave cursor in the same column", function() {
          keydown('z');
          keydown('b');
          expect(editor.setScrollTop).toHaveBeenCalledWith(860);
          return expect(editor.moveToFirstCharacterOfLine).not.toHaveBeenCalled();
        });
      });
    });
    return describe("horizontal scroll cursor keybindings", function() {
      beforeEach(function() {
        var i, text, _i;
        editor.setWidth(600);
        editor.setLineHeightInPixels(10);
        editor.setDefaultCharWidth(10);
        text = "";
        for (i = _i = 100; _i <= 199; i = ++_i) {
          text += "" + i + " ";
        }
        editor.setText(text);
        return editor.setCursorBufferPosition([0, 0]);
      });
      describe("the zs keybinding", function() {
        var startPosition, zsPos;
        zsPos = function(pos) {
          editor.setCursorBufferPosition([0, pos]);
          keydown('z');
          keydown('s');
          return editor.getScrollLeft();
        };
        startPosition = NaN;
        beforeEach(function() {
          return startPosition = editor.getScrollLeft();
        });
        it("does nothing near the start of the line", function() {
          var pos1;
          pos1 = zsPos(1);
          return expect(pos1).toEqual(startPosition);
        });
        it("moves the cursor the nearest it can to the left edge of the editor", function() {
          var pos10, pos11;
          pos10 = zsPos(10);
          expect(pos10).toBeGreaterThan(startPosition);
          pos11 = zsPos(11);
          return expect(pos11 - pos10).toEqual(10);
        });
        it("does nothing near the end of the line", function() {
          var pos340, pos342, pos390, posEnd;
          posEnd = zsPos(399);
          expect(editor.getCursorBufferPosition()).toEqual([0, 399]);
          pos390 = zsPos(390);
          expect(pos390).toEqual(posEnd);
          expect(editor.getCursorBufferPosition()).toEqual([0, 390]);
          pos340 = zsPos(340);
          expect(pos340).toBeLessThan(posEnd);
          pos342 = zsPos(342);
          return expect(pos342 - pos340).toEqual(20);
        });
        return it("does nothing if all lines are short", function() {
          var pos1, pos10;
          editor.setText('short');
          startPosition = editor.getScrollLeft();
          pos1 = zsPos(1);
          expect(pos1).toEqual(startPosition);
          expect(editor.getCursorBufferPosition()).toEqual([0, 1]);
          pos10 = zsPos(10);
          expect(pos10).toEqual(startPosition);
          return expect(editor.getCursorBufferPosition()).toEqual([0, 5]);
        });
      });
      return describe("the ze keybinding", function() {
        var startPosition, zePos;
        zePos = function(pos) {
          editor.setCursorBufferPosition([0, pos]);
          keydown('z');
          keydown('e');
          return editor.getScrollLeft();
        };
        startPosition = NaN;
        beforeEach(function() {
          return startPosition = editor.getScrollLeft();
        });
        it("does nothing near the start of the line", function() {
          var pos1, pos40;
          pos1 = zePos(1);
          expect(pos1).toEqual(startPosition);
          pos40 = zePos(40);
          return expect(pos40).toEqual(startPosition);
        });
        it("moves the cursor the nearest it can to the right edge of the editor", function() {
          var pos109, pos110;
          pos110 = zePos(110);
          expect(pos110).toBeGreaterThan(startPosition);
          pos109 = zePos(109);
          return expect(pos110 - pos109).toEqual(10);
        });
        it("does nothing when very near the end of the line", function() {
          var pos380, pos382, pos397, posEnd;
          posEnd = zePos(399);
          expect(editor.getCursorBufferPosition()).toEqual([0, 399]);
          pos397 = zePos(397);
          expect(pos397).toEqual(posEnd);
          expect(editor.getCursorBufferPosition()).toEqual([0, 397]);
          pos380 = zePos(380);
          expect(pos380).toBeLessThan(posEnd);
          pos382 = zePos(382);
          return expect(pos382 - pos380).toEqual(20);
        });
        return it("does nothing if all lines are short", function() {
          var pos1, pos10;
          editor.setText('short');
          startPosition = editor.getScrollLeft();
          pos1 = zePos(1);
          expect(pos1).toEqual(startPosition);
          expect(editor.getCursorBufferPosition()).toEqual([0, 1]);
          pos10 = zePos(10);
          expect(pos10).toEqual(startPosition);
          return expect(editor.getCursorBufferPosition()).toEqual([0, 5]);
        });
      });
    });
  });

}).call(this);
