(function() {
  var inputCfg, os;

  os = require('os');

  inputCfg = (function() {
    switch (os.platform()) {
      case 'win32':
        return {
          key: 'altKey',
          mouse: 1,
          middleMouse: true
        };
      case 'darwin':
        return {
          key: 'altKey',
          mouse: 1,
          middleMouse: true
        };
      case 'linux':
        return {
          key: 'shiftKey',
          mouse: 2,
          middleMouse: false
        };
      default:
        return {
          key: 'shiftKey',
          mouse: 2,
          middleMouse: true
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
      var editorBuffer, editorComponent, editorElement, hikackMouseEvent, mouseEnd, mouseStart, onBlur, onMouseDown, onMouseMove, resetState, selectBoxAroundCursors, _screenPositionForMouseEvent;
      editorBuffer = editor.displayBuffer;
      editorElement = atom.views.getView(editor);
      editorComponent = editorElement.component;
      mouseStart = null;
      mouseEnd = null;
      resetState = (function(_this) {
        return function() {
          mouseStart = null;
          return mouseEnd = null;
        };
      })(this);
      onMouseDown = (function(_this) {
        return function(e) {
          if (mouseStart) {
            e.preventDefault();
            return false;
          }
          if ((inputCfg.middleMouse && e.which === 2) || (e.which === inputCfg.mouse && e[inputCfg.key])) {
            resetState();
            mouseStart = _screenPositionForMouseEvent(e);
            mouseEnd = mouseStart;
            e.preventDefault();
            return false;
          }
        };
      })(this);
      onMouseMove = (function(_this) {
        return function(e) {
          if (mouseStart) {
            if ((inputCfg.middleMouse && e.which === 2) || (e.which === inputCfg.mouse)) {
              mouseEnd = _screenPositionForMouseEvent(e);
              selectBoxAroundCursors();
              e.preventDefault();
              return false;
            }
            if (e.which === 0) {
              return resetState();
            }
          }
        };
      })(this);
      hikackMouseEvent = (function(_this) {
        return function(e) {
          if (mouseStart) {
            e.preventDefault();
            return false;
          }
        };
      })(this);
      onBlur = (function(_this) {
        return function(e) {
          return resetState();
        };
      })(this);
      _screenPositionForMouseEvent = (function(_this) {
        return function(e) {
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
      })(this);
      selectBoxAroundCursors = (function(_this) {
        return function() {
          var allRanges, range, rangesWithLength, row, _i, _ref, _ref1;
          if (mouseStart && mouseEnd) {
            allRanges = [];
            rangesWithLength = [];
            for (row = _i = _ref = mouseStart.row, _ref1 = mouseEnd.row; _ref <= _ref1 ? _i <= _ref1 : _i >= _ref1; row = _ref <= _ref1 ? ++_i : --_i) {
              range = editor.bufferRangeForScreenRange([[row, mouseStart.column], [row, mouseEnd.column]]);
              allRanges.push(range);
              if (editor.getTextInBufferRange(range).length > 0) {
                rangesWithLength.push(range);
              }
            }
            if (rangesWithLength.length) {
              return editor.setSelectedBufferRanges(rangesWithLength);
            } else if (allRanges.length) {
              return editor.setSelectedBufferRanges(allRanges);
            }
          }
        };
      })(this);
      editorElement.onmousedown = onMouseDown;
      editorElement.onmousemove = onMouseMove;
      editorElement.onmouseup = hikackMouseEvent;
      editorElement.onmouseleave = hikackMouseEvent;
      editorElement.onmouseenter = hikackMouseEvent;
      editorElement.oncontextmenu = hikackMouseEvent;
      return editorElement.onblur = onBlur;
    }
  };

}).call(this);
