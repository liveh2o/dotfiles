(function() {
  var inputCfg, os;

  os = require('os');

  inputCfg = (function() {
    switch (os.platform()) {
      case 'win32':
        return {
          selectKey: 'altKey',
          mainMouseNum: 1,
          middleMouseNum: 2,
          enableMiddleMouse: true
        };
      case 'darwin':
        return {
          selectKey: 'altKey',
          mainMouseNum: 1,
          middleMouseNum: 2,
          enableMiddleMouse: true
        };
      case 'linux':
        return {
          selectKey: 'shiftKey',
          mainMouseNum: 2,
          middleMouseNum: 2,
          enableMiddleMouse: false
        };
      default:
        return {
          selectKey: 'shiftKey',
          mainMouseNum: 2,
          middleMouseNum: 2,
          enableMiddleMouse: false
        };
    }
  })();

  module.exports = {
    activate: function(state) {
      return atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          return _this._handleLoad(editor);
        };
      })(this));
    },
    deactivate: function() {
      return this.unsubscribe();
    },
    _handleLoad: function(editor) {
      var editorBuffer, editorComponent, editorElement, hijackMouseEvent, mouseEndPos, mouseStartPos, onBlur, onMouseDown, onMouseMove, onRangeChange, resetState, _keyDown, _mainMouseAndKeyDown, _mainMouseDown, _middleMouseDown, _screenPositionForMouseEvent, _selectBoxAroundCursors;
      editorBuffer = editor.displayBuffer;
      editorElement = atom.views.getView(editor);
      editorComponent = editorElement.component;
      mouseStartPos = null;
      mouseEndPos = null;
      resetState = function() {
        mouseStartPos = null;
        return mouseEndPos = null;
      };
      onMouseDown = function(e) {
        if (mouseStartPos) {
          e.preventDefault();
          return false;
        }
        if (_middleMouseDown(e) || _mainMouseAndKeyDown(e)) {
          resetState();
          mouseStartPos = _screenPositionForMouseEvent(e);
          mouseEndPos = mouseStartPos;
          e.preventDefault();
          return false;
        }
      };
      onMouseMove = function(e) {
        if (mouseStartPos) {
          e.preventDefault();
          if (_middleMouseDown(e) || _mainMouseDown(e)) {
            mouseEndPos = _screenPositionForMouseEvent(e);
            _selectBoxAroundCursors();
            return false;
          }
          if (e.which === 0) {
            return resetState();
          }
        }
      };
      hijackMouseEvent = function(e) {
        if (mouseStartPos) {
          e.preventDefault();
          return false;
        }
      };
      onBlur = function(e) {
        return resetState();
      };
      onRangeChange = function(newVal) {
        if (mouseStartPos && !newVal.selection.isSingleScreenLine()) {
          newVal.selection.destroy();
          return _selectBoxAroundCursors();
        }
      };
      _screenPositionForMouseEvent = function(e) {
        var column, defaultCharWidth, pixelPosition, row, targetLeft, targetTop;
        pixelPosition = editorComponent.pixelPositionForMouseEvent(e);
        targetTop = pixelPosition.top;
        targetLeft = pixelPosition.left;
        defaultCharWidth = editorBuffer.defaultCharWidth;
        row = Math.floor(targetTop / editorBuffer.getLineHeightInPixels());
        if (row > editorBuffer.getLastRow()) {
          targetLeft = Infinity;
        }
        row = Math.min(row, editorBuffer.getLastRow());
        row = Math.max(0, row);
        column = Math.round(targetLeft / defaultCharWidth);
        return {
          row: row,
          column: column
        };
      };
      _middleMouseDown = function(e) {
        return inputCfg.enableMiddleMouse && e.which === inputCfg.middleMouseNum;
      };
      _mainMouseDown = function(e) {
        return e.which === inputCfg.mainMouseNum;
      };
      _keyDown = function(e) {
        return e[inputCfg.selectKey];
      };
      _mainMouseAndKeyDown = function(e) {
        return _mainMouseDown(e) && e[inputCfg.selectKey];
      };
      _selectBoxAroundCursors = function() {
        var allRanges, range, rangesWithLength, row, _i, _ref, _ref1;
        if (mouseStartPos && mouseEndPos) {
          allRanges = [];
          rangesWithLength = [];
          for (row = _i = _ref = mouseStartPos.row, _ref1 = mouseEndPos.row; _ref <= _ref1 ? _i <= _ref1 : _i >= _ref1; row = _ref <= _ref1 ? ++_i : --_i) {
            range = [[row, mouseStartPos.column], [row, mouseEndPos.column]];
            allRanges.push(range);
            if (editor.getTextInBufferRange(range).length > 0) {
              rangesWithLength.push(range);
            }
          }
          if (rangesWithLength.length) {
            return editor.setSelectedScreenRanges(rangesWithLength);
          } else if (allRanges.length) {
            return editor.setSelectedScreenRanges(allRanges);
          }
        }
      };
      editor.onDidChangeSelectionRange(onRangeChange);
      editorElement.onmousedown = onMouseDown;
      editorElement.onmousemove = onMouseMove;
      editorElement.onmouseup = hijackMouseEvent;
      editorElement.onmouseleave = hijackMouseEvent;
      editorElement.onmouseenter = hijackMouseEvent;
      editorElement.oncontextmenu = hijackMouseEvent;
      return editorElement.onblur = onBlur;
    }
  };

}).call(this);
