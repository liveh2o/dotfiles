(function() {
  var Subscriber, inputCfg, os;

  Subscriber = require('emissary').Subscriber;

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
      return this.subscribe(atom.workspaceView.eachEditorView((function(_this) {
        return function(editorView) {
          return _this._handleLoad(editorView);
        };
      })(this)));
    },
    deactivate: function() {
      return this.unsubscribe();
    },
    _handleLoad: function(editorView) {
      var calculateMonoSpacedCharacterWidth, columnWidth, editor, hikackMouseEvent, mouseEnd, mouseStart, onFocusOut, onMouseDown, onMouseMove, overflowableScreenPositionFromMouseEvent, resetState, selectBoxAroundCursors;
      editor = editorView.getEditor();
      mouseStart = null;
      mouseEnd = null;
      columnWidth = null;
      resetState = (function(_this) {
        return function() {
          mouseStart = null;
          mouseEnd = null;
          return columnWidth = null;
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
            columnWidth = calculateMonoSpacedCharacterWidth();
            mouseStart = overflowableScreenPositionFromMouseEvent(e);
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
              mouseEnd = overflowableScreenPositionFromMouseEvent(e);
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
      onFocusOut = (function(_this) {
        return function(e) {
          return resetState();
        };
      })(this);
      calculateMonoSpacedCharacterWidth = (function(_this) {
        return function() {
          var size, span;
          span = document.createElement('span');
          span.appendChild(document.createTextNode('x'));
          editorView.scrollView.append(span);
          size = span.offsetWidth;
          span.remove();
          return size;
        };
      })(this);
      overflowableScreenPositionFromMouseEvent = (function(_this) {
        return function(e) {
          var column, editorRelativeTop, offset, pageX, pageY, row;
          pageX = e.pageX, pageY = e.pageY;
          offset = editorView.scrollView.offset();
          editorRelativeTop = pageY - offset.top + editorView.scrollTop();
          row = Math.floor(editorRelativeTop / editorView.lineHeight);
          column = Math.round((pageX - offset.left) / columnWidth);
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
            } else {
              return editor.setSelectedBufferRanges(allRanges);
            }
          }
        };
      })(this);
      this.subscribe(editorView, 'mousedown', onMouseDown);
      this.subscribe(editorView, 'mousemove', onMouseMove);
      this.subscribe(editorView, 'mouseup', hikackMouseEvent);
      this.subscribe(editorView, 'mouseleave', hikackMouseEvent);
      this.subscribe(editorView, 'mouseenter', hikackMouseEvent);
      this.subscribe(editorView, 'contextmenu', hikackMouseEvent);
      return this.subscribe(editorView, 'focusout', onFocusOut);
    }
  };

  Subscriber.extend(module.exports);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHdCQUFBOztBQUFBLEVBQUMsYUFBYyxPQUFBLENBQVEsVUFBUixFQUFkLFVBQUQsQ0FBQTs7QUFBQSxFQUNBLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUixDQURMLENBQUE7O0FBQUEsRUFHQSxRQUFBO0FBQVcsWUFBTyxFQUFFLENBQUMsUUFBSCxDQUFBLENBQVA7QUFBQSxXQUNKLFFBREk7ZUFFUDtBQUFBLFVBQUEsR0FBQSxFQUFLLFFBQUw7QUFBQSxVQUNBLEtBQUEsRUFBTyxDQURQO0FBQUEsVUFFQSxXQUFBLEVBQWEsSUFGYjtVQUZPO0FBQUEsV0FLSixPQUxJO2VBTVA7QUFBQSxVQUFBLEdBQUEsRUFBSyxVQUFMO0FBQUEsVUFDQSxLQUFBLEVBQU8sQ0FEUDtBQUFBLFVBRUEsV0FBQSxFQUFhLEtBRmI7VUFOTztBQUFBO2VBVVA7QUFBQSxVQUFBLEdBQUEsRUFBSyxVQUFMO0FBQUEsVUFDQSxLQUFBLEVBQU8sQ0FEUDtBQUFBLFVBRUEsV0FBQSxFQUFhLElBRmI7VUFWTztBQUFBO01BSFgsQ0FBQTs7QUFBQSxFQWlCQSxNQUFNLENBQUMsT0FBUCxHQUVFO0FBQUEsSUFBQSxRQUFBLEVBQVUsU0FBQyxLQUFELEdBQUE7YUFDUixJQUFDLENBQUEsU0FBRCxDQUFXLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBbkIsQ0FBa0MsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsVUFBRCxHQUFBO2lCQUMzQyxLQUFDLENBQUEsV0FBRCxDQUFhLFVBQWIsRUFEMkM7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFsQyxDQUFYLEVBRFE7SUFBQSxDQUFWO0FBQUEsSUFJQSxVQUFBLEVBQVksU0FBQSxHQUFBO2FBQ1YsSUFBQyxDQUFBLFdBQUQsQ0FBQSxFQURV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
//# sourceURL=/Users/ah/.atom/packages/Sublime-Style-Column-Selection/lib/sublime-select.coffee