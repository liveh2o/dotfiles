(function() {
  var Subscriber;

  Subscriber = require('emissary').Subscriber;

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
      var altDown, calculateMonoSpacedCharacterWidth, columnWidth, editor, mouseEnd, mouseStart, onKeyDown, onKeyUp, onMouseDown, onMouseMove, onMouseUp, onMouseleave, overflowableScreenPositionFromMouseEvent, scrollView, selectBoxAroundCursors;
      editor = editorView.getEditor();
      scrollView = editorView.find('.scroll-view');
      altDown = false;
      mouseStart = null;
      mouseEnd = null;
      columnWidth = null;
      calculateMonoSpacedCharacterWidth = (function(_this) {
        return function() {
          var size, span;
          if (scrollView) {
            span = document.createElement('span');
            span.appendChild(document.createTextNode('x'));
            scrollView.append(span);
            size = span.offsetWidth;
            span.remove();
            return size;
          }
          return null;
        };
      })(this);
      onKeyDown = (function(_this) {
        return function(e) {
          if (e.which === 18) {
            return altDown = true;
          }
        };
      })(this);
      onKeyUp = (function(_this) {
        return function(e) {
          if (e.which === 18) {
            return altDown = false;
          }
        };
      })(this);
      onMouseDown = (function(_this) {
        return function(e) {
          if (altDown) {
            columnWidth = calculateMonoSpacedCharacterWidth();
            mouseStart = overflowableScreenPositionFromMouseEvent(e);
            mouseEnd = mouseStart;
            e.preventDefault();
            return false;
          }
        };
      })(this);
      onMouseUp = (function(_this) {
        return function(e) {
          mouseStart = null;
          return mouseEnd = null;
        };
      })(this);
      onMouseMove = (function(_this) {
        return function(e) {
          if (mouseStart) {
            mouseEnd = overflowableScreenPositionFromMouseEvent(e);
            selectBoxAroundCursors();
            e.preventDefault();
            return false;
          }
        };
      })(this);
      onMouseleave = (function(_this) {
        return function(e) {
          if (altDown) {
            e.preventDefault();
            return false;
          }
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
      this.subscribe(editorView, 'keydown', onKeyDown);
      this.subscribe(editorView, 'keyup', onKeyUp);
      this.subscribe(editorView, 'mousedown', onMouseDown);
      this.subscribe(editorView, 'mouseup', onMouseUp);
      this.subscribe(editorView, 'mousemove', onMouseMove);
      return this.subscribe(editorView, 'mouseleave', onMouseleave);
    }
  };

  Subscriber.extend(module.exports);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFVBQUE7O0FBQUEsRUFBQyxhQUFjLE9BQUEsQ0FBUSxVQUFSLEVBQWQsVUFBRCxDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FFRTtBQUFBLElBQUEsUUFBQSxFQUFVLFNBQUMsS0FBRCxHQUFBO2FBQ1IsSUFBQyxDQUFBLFNBQUQsQ0FBVyxJQUFJLENBQUMsYUFBYSxDQUFDLGNBQW5CLENBQWtDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLFVBQUQsR0FBQTtpQkFDM0MsS0FBQyxDQUFBLFdBQUQsQ0FBYSxVQUFiLEVBRDJDO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEMsQ0FBWCxFQURRO0lBQUEsQ0FBVjtBQUFBLElBSUEsVUFBQSxFQUFZLFNBQUEsR0FBQTthQUNWLElBQUMsQ0FBQSxXQUFELENBQUEsRUFEVTtJQUFBLENBSlo7QUFBQSxJQU9BLFdBQUEsRUFBYSxTQUFDLFVBQUQsR0FBQTtBQUNYLFVBQUEsME9BQUE7QUFBQSxNQUFBLE1BQUEsR0FBYSxVQUFVLENBQUMsU0FBWCxDQUFBLENBQWIsQ0FBQTtBQUFBLE1BQ0EsVUFBQSxHQUFhLFVBQVUsQ0FBQyxJQUFYLENBQWdCLGNBQWhCLENBRGIsQ0FBQTtBQUFBLE1BR0EsT0FBQSxHQUFhLEtBSGIsQ0FBQTtBQUFBLE1BSUEsVUFBQSxHQUFhLElBSmIsQ0FBQTtBQUFBLE1BS0EsUUFBQSxHQUFhLElBTGIsQ0FBQTtBQUFBLE1BTUEsV0FBQSxHQUFlLElBTmYsQ0FBQTtBQUFBLE1BUUEsaUNBQUEsR0FBb0MsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUNsQyxjQUFBLFVBQUE7QUFBQSxVQUFBLElBQUcsVUFBSDtBQUVFLFlBQUEsSUFBQSxHQUFPLFFB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
//# sourceURL=/Users/ah/.atom/packages/Sublime-Style-Column-Selection/lib/sublime-select.coffee