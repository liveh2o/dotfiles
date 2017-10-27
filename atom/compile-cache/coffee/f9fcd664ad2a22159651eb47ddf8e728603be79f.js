(function() {
  var SublimeSelectEditorHandler,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

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
          this._selectBoxAroundCursors();
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
      return {
        row: row,
        column: column
      };
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
      var allRanges, range, rangesWithLength, row, _i, _ref, _ref1;
      if (this.mouseStartPos && this.mouseEndPos) {
        allRanges = [];
        rangesWithLength = [];
        for (row = _i = _ref = this.mouseStartPos.row, _ref1 = this.mouseEndPos.row; _ref <= _ref1 ? _i <= _ref1 : _i >= _ref1; row = _ref <= _ref1 ? ++_i : --_i) {
          range = [[row, this.mouseStartPos.column], [row, this.mouseEndPos.column]];
          allRanges.push(range);
          if (this.editor.getTextInBufferRange(range).length > 0) {
            rangesWithLength.push(range);
          }
        }
        if (rangesWithLength.length) {
          return this.editor.setSelectedScreenRanges(rangesWithLength);
        } else if (allRanges.length) {
          return this.editor.setSelectedScreenRanges(allRanges);
        }
      }
    };

    return SublimeSelectEditorHandler;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3N1YmxpbWUtc3R5bGUtY29sdW1uLXNlbGVjdGlvbi9saWIvZWRpdG9yLWhhbmRsZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDBCQUFBO0lBQUEsa0ZBQUE7O0FBQUEsRUFBQSxNQUFNLENBQUMsT0FBUCxHQUNRO0FBQ1MsSUFBQSxvQ0FBQyxNQUFELEVBQVMsUUFBVCxHQUFBO0FBQ1gsMkRBQUEsQ0FBQTtBQUFBLDZDQUFBLENBQUE7QUFBQSx5RUFBQSxDQUFBO0FBQUEsdURBQUEsQ0FBQTtBQUFBLHVEQUFBLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxNQUFELEdBQVUsTUFBVixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsUUFBRCxHQUFZLFFBRFosQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLFdBQUQsQ0FBQSxDQUZBLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxXQUFELENBQUEsQ0FIQSxDQURXO0lBQUEsQ0FBYjs7QUFBQSx5Q0FNQSxTQUFBLEdBQVcsU0FBQSxHQUFBO0FBQ1QsTUFBQSxJQUFDLENBQUEsa0JBQUQsR0FBc0IsSUFBQyxDQUFBLE1BQU0sQ0FBQyx5QkFBUixDQUFrQyxJQUFDLENBQUEsYUFBbkMsQ0FBdEIsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxnQkFBZixDQUFnQyxXQUFoQyxFQUErQyxJQUFDLENBQUEsV0FBaEQsQ0FEQSxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsYUFBYSxDQUFDLGdCQUFmLENBQWdDLFdBQWhDLEVBQStDLElBQUMsQ0FBQSxXQUFoRCxDQUZBLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxhQUFhLENBQUMsZ0JBQWYsQ0FBZ0MsU0FBaEMsRUFBK0MsSUFBQyxDQUFBLG9CQUFoRCxDQUhBLENB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

//# sourceURL=/Users/ah/.atom/packages/sublime-style-column-selection/lib/editor-handler.coffee
