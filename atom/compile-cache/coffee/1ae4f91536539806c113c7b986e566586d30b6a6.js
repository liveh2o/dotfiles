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
        return function() {
          if (mouseStart) {
            return editorView.mouseup();
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
          var allRanges, range, rangesWithLength, row, selectedColumns, _i, _ref, _ref1;
          if (mouseStart && mouseEnd) {
            allRanges = [];
            rangesWithLength = [];
            selectedColumns = mouseEnd.column - mouseStart.column;
            for (row = _i = _ref = mouseStart.row, _ref1 = mouseEnd.row; _ref <= _ref1 ? _i <= _ref1 : _i >= _ref1; row = _ref <= _ref1 ? ++_i : --_i) {
              range = [[row, mouseStart.column], [row, mouseStart.column + selectedColumns]];
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFVBQUE7O0FBQUEsRUFBQyxhQUFjLE9BQUEsQ0FBUSxVQUFSLEVBQWQsVUFBRCxDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FFRTtBQUFBLElBQUEsUUFBQSxFQUFVLFNBQUMsS0FBRCxHQUFBO2FBQ1IsSUFBQyxDQUFBLFNBQUQsQ0FBVyxJQUFJLENBQUMsYUFBYSxDQUFDLGNBQW5CLENBQWtDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLFVBQUQsR0FBQTtpQkFDM0MsS0FBQyxDQUFBLFdBQUQsQ0FBYSxVQUFiLEVBRDJDO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEMsQ0FBWCxFQURRO0lBQUEsQ0FBVjtBQUFBLElBSUEsVUFBQSxFQUFZLFNBQUEsR0FBQTthQUNWLElBQUMsQ0FBQSxXQUFELENBQUEsRUFEVTtJQUFBLENBSlo7QUFBQSxJQU9BLFdBQUEsRUFBYSxTQUFDLFVBQUQsR0FBQTtBQUNYLFVBQUEsME9BQUE7QUFBQSxNQUFBLE1BQUEsR0FBYSxVQUFVLENBQUMsU0FBWCxDQUFBLENBQWIsQ0FBQTtBQUFBLE1BQ0EsVUFBQSxHQUFhLFVBQVUsQ0FBQyxJQUFYLENBQWdCLGNBQWhCLENBRGIsQ0FBQTtBQUFBLE1BR0EsT0FBQSxHQUFhLEtBSGIsQ0FBQTtBQUFBLE1BSUEsVUFBQSxHQUFhLElBSmIsQ0FBQTtBQUFBLE1BS0EsUUFBQSxHQUFhLElBTGIsQ0FBQTtBQUFBLE1BTUEsV0FBQSxHQUFlLElBTmYsQ0FBQTtBQUFBLE1BUUEsaUNBQUEsR0FBb0MsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUNsQyxjQUFBLFVBQUE7QUFBQSxVQUFBLElBQUcsVUFBSDtBQUVFLFlBQUEsSUFBQSxHQUFPLFFBQVEsQ0FBQyxhQUFULENBQXVCLE1BQXZCLENBQVAsQ0FBQTtBQUFBLFlBQ0EsSUFBSSxDQUFDLFdBQUwsQ0FBaUIsUUFBUSxDQUFDLGNBQVQsQ0FBd0IsR0FBeEIsQ0FBakIsQ0FEQSxDQUFBO0FBQUEsWUFFQSxVQUFVLENBQUMsTUFBWCxDQUFrQixJQUFsQixDQUZBLENBQUE7QUFBQSxZQUdBLElBQUEsR0FBTyxJQUFJLENBQUMsV0FIWixDQUFBO0FBQUEsWUFJQSxJQUFJLENBQUMsTUFBTCxDQUFBLENBSkEsQ0FBQTtBQUtBLG1CQUFPLElBQVAsQ0FQRjtXQUFBO2lCQVFBLEtBVGtDO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FScEMsQ0FBQTtBQUFBLE1BbUJBLFNBQUEsR0FBWSxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxDQUFELEdBQUE7QUFDVixVQUFBLElBQUcsQ0FBQyxDQUFDLEtBQUYsS0FBVyxFQUFkO21CQUNFLE9BQUEsR0FBVSxLQURaO1dBRFU7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQW5CWixDQUFBO0FBQUEsTUF1QkEsT0FBQSxHQUFVLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLENBQUQsR0FBQTtBQUNSLFVBQUEsSUFBRyxDQUFDLENBQUMsS0FBRixLQUFXLEVBQWQ7bUJBQ0UsT0FBQSxHQUFVLE1BRFo7V0FEUTtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBdkJWLENBQUE7QUFBQSxNQTJCQSxXQUFBLEdBQWMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsQ0FBRCxHQUFBO0FBQ1osVUFBQSxJQUFHLE9BQUg7QUFDRSxZQUFBLFdBQUEsR0FBYyxpQ0FBQSxDQUFBLENBQWQsQ0FBQTtBQUFBLFlBQ0EsVUFBQSxHQUFjLHdDQUFBLENBQXlDLENBQXpDLENBRGQsQ0FBQTtBQUFBLFlBRUEsUUFBQSxHQUFjLFVBRmQsQ0FBQTtBQUFBLFlBR0EsQ0FBQyxDQUFDLGNBQUYsQ0FBQSxDQUhBLENBQUE7QUFJQSxtQkFBTyxLQUFQLENBTEY7V0FEWTtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBM0JkLENBQUE7QUFBQSxNQW1DQSxTQUFBLEdBQVksQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsQ0FBRCxHQUFBO0FBQ1YsVUFBQSxVQUFBLEdBQWEsSUFBYixDQUFBO2lCQUNBLFFBQUEsR0FBVyxLQUZEO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FuQ1osQ0FBQTtBQUFBLE1BdUNBLFdBQUEsR0FBYyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxDQUFELEdBQUE7QUFDWixVQUFBLElBQUcsVUFBSDtBQUNFLFlBQUEsUUFBQSxHQUFXLHdDQUFBLENBQXlDLENBQXpDLENBQVgsQ0FBQTtBQUFBLFlBQ0Esc0JBQUEsQ0FBQSxDQURBLENBQUE7QUFBQSxZQUVBLENBQUMsQ0FBQyxjQUFGLENBQUEsQ0FGQSxDQUFBO0FBR0EsbUJBQU8sS0FBUCxDQUpGO1dBRFk7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQXZDZCxDQUFBO0FBQUEsTUE4Q0EsWUFBQSxHQUFlLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDYixVQUFBLElBQUcsVUFBSDttQkFDRSxVQUFVLENBQUMsT0FBWCxDQUFBLEVBREY7V0FEYTtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBOUNmLENBQUE7QUFBQSxNQW9EQSx3Q0FBQSxHQUEyQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxDQUFELEdBQUE7QUFDekMsY0FBQSxvREFBQTtBQUFBLFVBQUUsVUFBQSxLQUFGLEVBQVMsVUFBQSxLQUFULENBQUE7QUFBQSxVQUNBLE1BQUEsR0FBb0IsVUFBVSxDQUFDLFVBQVUsQ0FBQyxNQUF0QixDQUFBLENBRHBCLENBQUE7QUFBQSxVQUVBLGlCQUFBLEdBQW9CLEtBQUEsR0FBUSxNQUFNLENBQUMsR0FBZixHQUFxQixVQUFVLENBQUMsU0FBWCxDQUFBLENBRnpDLENBQUE7QUFBQSxVQUdBLEdBQUEsR0FBb0IsSUFBSSxDQUFDLEtBQUwsQ0FBVyxpQkFBQSxHQUFvQixVQUFVLENBQUMsVUFBMUMsQ0FIcEIsQ0FBQTtBQUFBLFVBSUEsTUFBQSxHQUFvQixJQUFJLENBQUMsS0FBTCxDQUFXLENBQUMsS0FBQSxHQUFRLE1BQU0sQ0FBQyxJQUFoQixDQUFBLEdBQXdCLFdBQW5DLENBSnBCLENBQUE7QUFLQSxpQkFBTztBQUFBLFlBQUMsR0FBQSxFQUFLLEdBQU47QUFBQSxZQUFXLE1BQUEsRUFBUSxNQUFuQjtXQUFQLENBTnlDO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FwRDNDLENBQUE7QUFBQSxNQTREQSxzQkFBQSxHQUF5QixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ3ZCLGNBQUEseUVBQUE7QUFBQSxVQUFBLElBQUcsVUFBQSxJQUFlLFFBQWxCO0FBQ0UsWUFBQSxTQUFBLEdBQVksRUFBWixDQUFBO0FBQUEsWUFDQSxnQkFBQSxHQUFtQixFQURuQixDQUFBO0FBQUEsWUFFQSxlQUFBLEdBQWtCLFFBQVEsQ0FBQyxNQUFULEdBQWtCLFVBQVUsQ0FBQyxNQUYvQyxDQUFBO0FBSUEsaUJBQVcsb0lBQVgsR0FBQTtBQUdFLGNBQUEsS0FBQSxHQUFRLENBQUMsQ0FBQyxHQUFELEVBQU0sVUFBVSxDQUFDLE1BQWpCLENBQUQsRUFBMkIsQ0FBQyxHQUFELEVBQU0sVUFBVSxDQUFDLE1BQVgsR0FBb0IsZUFBMUIsQ0FBM0IsQ0FBUixDQUFBO0FBQUEsY0FFQSxTQUFTLENBQUMsSUFBVixDQUFlLEtBQWYsQ0FGQSxDQUFBO0FBR0EsY0FBQSxJQUFHLE1BQU0sQ0FBQyxvQkFBUCxDQUE0QixLQUE1QixDQUFrQyxDQUFDLE1BQW5DLEdBQTRDLENBQS9DO0FBQ0UsZ0JBQUEsZ0JBQWdCLENBQUMsSUFBakIsQ0FBc0IsS0FBdEIsQ0FBQSxDQURGO2VBTkY7QUFBQSxhQUpBO0FBZUEsWUFBQSxJQUFHLGdCQUFnQixDQUFDLE1BQXBCO3FCQUNFLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixnQkFBL0IsRUFERjthQUFBLE1BQUE7cUJBR0UsTUFBTSxDQUFDLHVCQUFQLENBQStCLFNBQS9CLEVBSEY7YUFoQkY7V0FEdUI7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQTVEekIsQ0FBQTtBQUFBLE1BbUZBLElBQUMsQ0FBQSxTQUFELENBQVcsVUFBWCxFQUF1QixTQUF2QixFQUFxQyxTQUFyQyxDQW5GQSxDQUFBO0FBQUEsTUFvRkEsSUFBQyxDQUFBLFNBQUQsQ0FBVyxVQUFYLEVBQXVCLE9BQXZCLEVBQXFDLE9BQXJDLENBcEZBLENBQUE7QUFBQSxNQXFGQSxJQUFDLENBQUEsU0FBRCxDQUFXLFVBQVgsRUFBdUIsV0FBdkIsRUFBcUMsV0FBckMsQ0FyRkEsQ0FBQTtBQUFBLE1Bc0ZBLElBQUMsQ0FBQSxTQUFELENBQVcsVUFBWCxFQUF1QixTQUF2QixFQUFxQyxTQUFyQyxDQXRGQSxDQUFBO0FBQUEsTUF1RkEsSUFBQyxDQUFBLFNBQUQsQ0FBVyxVQUFYLEVBQXVCLFdBQXZCLEVBQXFDLFdBQXJDLENBdkZBLENBQUE7YUF3RkEsSUFBQyxDQUFBLFNBQUQsQ0FBVyxVQUFYLEVBQXVCLFlBQXZCLEVBQXFDLFlBQXJDLEVBekZXO0lBQUEsQ0FQYjtHQUpGLENBQUE7O0FBQUEsRUFzR0EsVUFBVSxDQUFDLE1BQVgsQ0FBa0IsTUFBTSxDQUFDLE9BQXpCLENBdEdBLENBQUE7QUFBQSIKfQ==
//# sourceURL=/Users/ah/.atom/packages/Sublime-Style-Column-Selection/lib/sublime-select.coffee