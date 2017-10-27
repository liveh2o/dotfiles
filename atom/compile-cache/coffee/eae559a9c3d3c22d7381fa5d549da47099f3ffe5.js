(function() {
  var Point, SublimeSelectEditorHandler,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Point = require('atom').Point;

  module.exports = SublimeSelectEditorHandler = (function() {
    function SublimeSelectEditorHandler(editor, inputCfg) {
      this.onRangeChange = __bind(this.onRangeChange, this);
      this.onBlur = __bind(this.onBlur, this);
      this.onMouseEventToHijack = __bind(this.onMouseEventToHijack, this);
      this.onMouseMove = __bind(this.onMouseMove, this);
      this.onMouseDown = __bind(this.onMouseDown, this);
      this.editor = editor;
      this.inputCfg = inputCfg;
      this._resetState();
      this._setup_vars();
    }

    SublimeSelectEditorHandler.prototype.subscribe = function() {
      this.selection_observer = this.editor.onDidChangeSelectionRange(this.onRangeChange);
      this.editorElement.addEventListener('mousedown', this.onMouseDown);
      this.editorElement.addEventListener('mousemove', this.onMouseMove);
      this.editorElement.addEventListener('mouseup', this.onMouseEventToHijack);
      this.editorElement.addEventListener('mouseleave', this.onMouseEventToHijack);
      this.editorElement.addEventListener('mouseenter', this.onMouseEventToHijack);
      this.editorElement.addEventListener('contextmenu', this.onMouseEventToHijack);
      return this.editorElement.addEventListener('blur', this.onBlur);
    };

    SublimeSelectEditorHandler.prototype.unsubscribe = function() {
      this._resetState();
      this.selection_observer.dispose();
      this.editorElement.removeEventListener('mousedown', this.onMouseDown);
      this.editorElement.removeEventListener('mousemove', this.onMouseMove);
      this.editorElement.removeEventListener('mouseup', this.onMouseEventToHijack);
      this.editorElement.removeEventListener('mouseleave', this.onMouseEventToHijack);
      this.editorElement.removeEventListener('mouseenter', this.onMouseEventToHijack);
      this.editorElement.removeEventListener('contextmenu', this.onMouseEventToHijack);
      return this.editorElement.removeEventListener('blur', this.onBlur);
    };

    SublimeSelectEditorHandler.prototype.onMouseDown = function(e) {
      if (this.mouseStartPos) {
        e.preventDefault();
        return false;
      }
      if (this._mainMouseAndKeyDown(e)) {
        this._resetState();
        this.mouseStartPos = this._screenPositionForMouseEvent(e);
        this.mouseEndPos = this.mouseStartPos;
        e.preventDefault();
        return false;
      }
    };

    SublimeSelectEditorHandler.prototype.onMouseMove = function(e) {
      if (this.mouseStartPos) {
        e.preventDefault();
        if (this._mainMouseDown(e)) {
          this.mouseEndPos = this._screenPositionForMouseEvent(e);
          if (this.mouseEndPos.isEqual(this.mouseEndPosPrev)) {
            return;
          }
          this._selectBoxAroundCursors();
          this.mouseEndPosPrev = this.mouseEndPos;
          return false;
        }
        if (e.which === 0) {
          return this._resetState();
        }
      }
    };

    SublimeSelectEditorHandler.prototype.onMouseEventToHijack = function(e) {
      if (this.mouseStartPos) {
        e.preventDefault();
        return false;
      }
    };

    SublimeSelectEditorHandler.prototype.onBlur = function(e) {
      return this._resetState();
    };

    SublimeSelectEditorHandler.prototype.onRangeChange = function(newVal) {
      if (this.mouseStartPos && !newVal.selection.isSingleScreenLine()) {
        newVal.selection.destroy();
        return this._selectBoxAroundCursors();
      }
    };

    SublimeSelectEditorHandler.prototype._resetState = function() {
      this.mouseStartPos = null;
      return this.mouseEndPos = null;
    };

    SublimeSelectEditorHandler.prototype._setup_vars = function() {
      if (this.editorBuffer == null) {
        this.editorBuffer = this.editor.displayBuffer;
      }
      if (this.editorElement == null) {
        this.editorElement = atom.views.getView(this.editor);
      }
      return this.editorComponent != null ? this.editorComponent : this.editorComponent = this.editorElement.component;
    };

    SublimeSelectEditorHandler.prototype._screenPositionForMouseEvent = function(e) {
      var column, defaultCharWidth, pixelPosition, row, targetLeft, targetTop;
      this._setup_vars();
      pixelPosition = this.editorComponent.pixelPositionForMouseEvent(e);
      targetTop = pixelPosition.top;
      targetLeft = pixelPosition.left;
      defaultCharWidth = this.editorBuffer.defaultCharWidth;
      row = Math.floor(targetTop / this.editorBuffer.getLineHeightInPixels());
      if (row > this.editorBuffer.getLastRow()) {
        targetLeft = Infinity;
      }
      row = Math.min(row, this.editorBuffer.getLastRow());
      row = Math.max(0, row);
      column = Math.round(targetLeft / defaultCharWidth);
      return new Point(row, column);
    };

    SublimeSelectEditorHandler.prototype._mainMouseDown = function(e) {
      return e.which === this.inputCfg.mouseNum;
    };

    SublimeSelectEditorHandler.prototype._mainMouseAndKeyDown = function(e) {
      if (this.inputCfg.selectKey) {
        return this._mainMouseDown(e) && e[this.inputCfg.selectKey];
      } else {
        return this._mainMouseDown(e);
      }
    };

    SublimeSelectEditorHandler.prototype._selectBoxAroundCursors = function() {
      var isReversed, range, ranges, row, rowLength, _i, _ref, _ref1;
      if (this.mouseStartPos && this.mouseEndPos) {
        ranges = [];
        for (row = _i = _ref = this.mouseStartPos.row, _ref1 = this.mouseEndPos.row; _ref <= _ref1 ? _i <= _ref1 : _i >= _ref1; row = _ref <= _ref1 ? ++_i : --_i) {
          if (this.mouseEndPos.column < 0) {
            this.mouseEndPos.column = 0;
          }
          rowLength = this.editor.lineTextForScreenRow(row).length;
          if (rowLength > this.mouseStartPos.column || rowLength > this.mouseEndPos.column) {
            range = [[row, this.mouseStartPos.column], [row, this.mouseEndPos.column]];
            ranges.push(range);
          }
        }
        if (ranges.length) {
          isReversed = this.mouseEndPos.column < this.mouseStartPos.column;
          return this.editor.setSelectedScreenRanges(ranges, {
            reversed: isReversed
          });
        }
      }
    };

    return SublimeSelectEditorHandler;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3N1YmxpbWUtc3R5bGUtY29sdW1uLXNlbGVjdGlvbi9saWIvZWRpdG9yLWhhbmRsZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlDQUFBO0lBQUEsa0ZBQUE7O0FBQUEsRUFBQyxRQUFTLE9BQUEsQ0FBUSxNQUFSLEVBQVQsS0FBRCxDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDUTtBQUNTLElBQUEsb0NBQUMsTUFBRCxFQUFTLFFBQVQsR0FBQTtBQUNYLDJEQUFBLENBQUE7QUFBQSw2Q0FBQSxDQUFBO0FBQUEseUVBQUEsQ0FBQTtBQUFBLHVEQUFBLENBQUE7QUFBQSx1REFBQSxDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsTUFBRCxHQUFVLE1BQVYsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFFBQUQsR0FBWSxRQURaLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxXQUFELENBQUEsQ0FGQSxDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsV0FBRCxDQUFBLENBSEEsQ0FEVztJQUFBLENBQWI7O0FBQUEseUNBTUEsU0FBQSxHQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsSUFBQyxDQUFBLGtCQUFELEdBQXNCLElBQUMsQ0FBQSxNQUFNLENBQUMseUJBQVIsQ0FBa0MsSUFBQyxDQUFBLGFBQW5DLENBQXRCLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxhQUFhLENBQUMsZ0JBQWYsQ0FBZ0MsV0FBaEMsRUFBK0MsSUFBQyxDQUFBLFdBQWhELENBREEsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxnQkFBZixDQUFnQyxXQUFoQyxFQUErQyxJQUFDLENBQUEsV0FBaEQsQ0FGQSxDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsYUFBYSxDQUFDLGdC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

//# sourceURL=/Users/ah/.atom/packages/sublime-style-column-selection/lib/editor-handler.coffee
