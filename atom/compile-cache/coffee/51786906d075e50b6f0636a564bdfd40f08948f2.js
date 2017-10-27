(function() {
  var inputCfg, os;

  os = require('os');

  inputCfg = (function() {
    switch (os.platform()) {
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFlBQUE7O0FBQUEsRUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FBTCxDQUFBOztBQUFBLEVBRUEsUUFBQTtBQUFXLFlBQU8sRUFBRSxDQUFDLFFBQUgsQ0FBQSxDQUFQO0FBQUEsV0FDSixRQURJO2VBRVA7QUFBQSxVQUFBLEdBQUEsRUFBSyxRQUFMO0FBQUEsVUFDQSxLQUFBLEVBQU8sQ0FEUDtBQUFBLFVBRUEsV0FBQSxFQUFhLElBRmI7VUFGTztBQUFBLFdBS0osT0FMSTtlQU1QO0FBQUEsVUFBQSxHQUFBLEVBQUssVUFBTDtBQUFBLFVBQ0EsS0FBQSxFQUFPLENBRFA7QUFBQSxVQUVBLFdBQUEsRUFBYSxLQUZiO1VBTk87QUFBQTtlQVVQO0FBQUEsVUFBQSxHQUFBLEVBQUssVUFBTDtBQUFBLFVBQ0EsS0FBQSxFQUFPLENBRFA7QUFBQSxVQUVBLFdBQUEsRUFBYSxJQUZiO1VBVk87QUFBQTtNQUZYLENBQUE7O0FBQUEsRUFnQkEsTUFBTSxDQUFDLE9BQVAsR0FFRTtBQUFBLElBQUEsUUFBQSxFQUFVLFNBQUMsS0FBRCxHQUFBO2FBQ1IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBZixDQUFrQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxNQUFELEdBQUE7aUJBQ2hDLEtBQUMsQ0FBQSxXQUFELENBQWEsTUFBYixFQURnQztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWxDLEVBRFE7SUFBQSxDQUFWO0FBQUEsSUFJQSxVQUFBLEVBQVksU0FBQSxHQUFBO2FBQ1YsSUFBQyxDQUFBLFdBQUQsQ0FBQSxFQURVO0lBQUEsQ0FKWjtBQUFBLElBT0EsV0FBQSxFQUFhLFNBQUMsTUFBRCxHQUFBO0FBQ1gsVUFBQSx3TEFBQTtBQUFBLE1BQUEs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
//# sourceURL=/Users/ah/.atom/packages/Sublime-Style-Column-Selection/lib/sublime-select.coffee