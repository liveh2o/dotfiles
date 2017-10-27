(function() {
  var Point, SublimeSelectEditorHandler,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Point = require('atom').Point;

  module.exports = SublimeSelectEditorHandler = (function() {
    function SublimeSelectEditorHandler(editor, inputCfg) {
      this.onRangeChange = bind(this.onRangeChange, this);
      this.onBlur = bind(this.onBlur, this);
      this.onMouseEventToHijack = bind(this.onMouseEventToHijack, this);
      this.onMouseMove = bind(this.onMouseMove, this);
      this.onMouseDown = bind(this.onMouseDown, this);
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
      defaultCharWidth = this.editor.getDefaultCharWidth();
      row = Math.floor(targetTop / this.editor.getLineHeightInPixels());
      if (row > this.editor.getLastBufferRow()) {
        targetLeft = 2e308;
      }
      row = Math.min(row, this.editor.getLastBufferRow());
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
      var i, isReversed, range, ranges, ref, ref1, row, rowLength;
      if (this.mouseStartPos && this.mouseEndPos) {
        ranges = [];
        for (row = i = ref = this.mouseStartPos.row, ref1 = this.mouseEndPos.row; ref <= ref1 ? i <= ref1 : i >= ref1; row = ref <= ref1 ? ++i : --i) {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL1N1YmxpbWUtU3R5bGUtQ29sdW1uLVNlbGVjdGlvbi9saWIvZWRpdG9yLWhhbmRsZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSxpQ0FBQTtJQUFBOztFQUFDLFFBQVMsT0FBQSxDQUFRLE1BQVI7O0VBRVYsTUFBTSxDQUFDLE9BQVAsR0FDUTtJQUNTLG9DQUFDLE1BQUQsRUFBUyxRQUFUOzs7Ozs7TUFDWCxJQUFDLENBQUEsTUFBRCxHQUFVO01BQ1YsSUFBQyxDQUFBLFFBQUQsR0FBWTtNQUNaLElBQUMsQ0FBQSxXQUFELENBQUE7TUFDQSxJQUFDLENBQUEsV0FBRCxDQUFBO0lBSlc7O3lDQU1iLFNBQUEsR0FBVyxTQUFBO01BQ1QsSUFBQyxDQUFBLGtCQUFELEdBQXNCLElBQUMsQ0FBQSxNQUFNLENBQUMseUJBQVIsQ0FBa0MsSUFBQyxDQUFBLGFBQW5DO01BQ3RCLElBQUMsQ0FBQSxhQUFhLENBQUMsZ0JBQWYsQ0FBZ0MsV0FBaEMsRUFBK0MsSUFBQyxDQUFBLFdBQWhEO01BQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxnQkFBZixDQUFnQyxXQUFoQyxFQUErQyxJQUFDLENBQUEsV0FBaEQ7TUFDQSxJQUFDLENBQUEsYUFBYSxDQUFDLGdCQUFmLENBQWdDLFNBQWhDLEVBQStDLElBQUMsQ0FBQSxvQkFBaEQ7TUFDQSxJQUFDLENBQUEsYUFBYSxDQUFDLGdCQUFmLENBQWdDLFlBQWhDLEVBQStDLElBQUMsQ0FBQSxvQkFBaEQ7TUFDQSxJQUFDLENBQUEsYUFBYSxDQUFDLGdCQUFmLENBQWdDLFlBQWhDLEVBQStDLElBQUMsQ0FBQSxvQkFBaEQ7TUFDQSxJQUFDLENBQUEsYUFBYSxDQUFDLGdCQUFmLENBQWdDLGFBQWhDLEVBQStDLElBQUMsQ0FBQSxvQkFBaEQ7YUFDQSxJQUFDLENBQUEsYUFBYSxDQUFDLGdCQUFmLENBQWdD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QUQzQjtPQUFBLE1BQUE7ZUFHRSxJQUFDLENBQUEsY0FBRCxDQUFnQixDQUFoQixFQUhGOztJQURvQjs7eUNBT3RCLHVCQUFBLEdBQXlCLFNBQUE7QUFDdkIsVUFBQTtNQUFBLElBQUcsSUFBQyxDQUFBLGFBQUQsSUFBbUIsSUFBQyxDQUFBLFdBQXZCO1FBQ0UsTUFBQSxHQUFTO0FBRVQsYUFBVyx1SUFBWDtVQUNFLElBQTJCLElBQUMsQ0FBQSxXQUFXLENBQUMsTUFBYixHQUFzQixDQUFqRDtZQUFBLElBQUMsQ0FBQSxXQUFXLENBQUMsTUFBYixHQUFzQixFQUF0Qjs7VUFDQSxTQUFBLEdBQVksSUFBQyxDQUFBLE1BQU0sQ0FBQyxvQkFBUixDQUE2QixHQUE3QixDQUFpQyxDQUFDO1VBQzlDLElBQUcsU0FBQSxHQUFZLElBQUMsQ0FBQSxhQUFhLENBQUMsTUFBM0IsSUFBcUMsU0FBQSxHQUFZLElBQUMsQ0FBQSxXQUFXLENBQUMsTUFBakU7WUFDRSxLQUFBLEdBQVEsQ0FBQyxDQUFDLEdBQUQsRUFBTSxJQUFDLENBQUEsYUFBYSxDQUFDLE1BQXJCLENBQUQsRUFBK0IsQ0FBQyxHQUFELEVBQU0sSUFBQyxDQUFBLFdBQVcsQ0FBQyxNQUFuQixDQUEvQjtZQUNSLE1BQU0sQ0FBQyxJQUFQLENBQVksS0FBWixFQUZGOztBQUhGO1FBT0EsSUFBRyxNQUFNLENBQUMsTUFBVjtVQUNFLFVBQUEsR0FBYSxJQUFDLENBQUEsV0FBVyxDQUFDLE1BQWIsR0FBc0IsSUFBQyxDQUFBLGFBQWEsQ0FBQztpQkFDbEQsSUFBQyxDQUFBLE1BQU0sQ0FBQyx1QkFBUixDQUFnQyxNQUFoQyxFQUF3QztZQUFDLFFBQUEsRUFBVSxVQUFYO1dBQXhDLEVBRkY7U0FWRjs7SUFEdUI7Ozs7O0FBOUc3QiIsInNvdXJjZXNDb250ZW50IjpbIntQb2ludH0gPSByZXF1aXJlICdhdG9tJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIGNsYXNzIFN1YmxpbWVTZWxlY3RFZGl0b3JIYW5kbGVyXG4gICAgY29uc3RydWN0b3I6IChlZGl0b3IsIGlucHV0Q2ZnKSAtPlxuICAgICAgQGVkaXRvciA9IGVkaXRvclxuICAgICAgQGlucHV0Q2ZnID0gaW5wdXRDZmdcbiAgICAgIEBfcmVzZXRTdGF0ZSgpXG4gICAgICBAX3NldHVwX3ZhcnMoKVxuXG4gICAgc3Vic2NyaWJlOiAtPlxuICAgICAgQHNlbGVjdGlvbl9vYnNlcnZlciA9IEBlZGl0b3Iub25EaWRDaGFuZ2VTZWxlY3Rpb25SYW5nZSBAb25SYW5nZUNoYW5nZVxuICAgICAgQGVkaXRvckVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lciAnbW91c2Vkb3duJywgICBAb25Nb3VzZURvd25cbiAgICAgIEBlZGl0b3JFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIgJ21vdXNlbW92ZScsICAgQG9uTW91c2VNb3ZlXG4gICAgICBAZWRpdG9yRWxlbWVudC5hZGRFdmVudExpc3RlbmVyICdtb3VzZXVwJywgICAgIEBvbk1vdXNlRXZlbnRUb0hpamFja1xuICAgICAgQGVkaXRvckVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lciAnbW91c2VsZWF2ZScsICBAb25Nb3VzZUV2ZW50VG9IaWphY2tcbiAgICAgIEBlZGl0b3JFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIgJ21vdXNlZW50ZXInLCAgQG9uTW91c2VFdmVudFRvSGlqYWNrXG4gICAgICBAZWRpdG9yRWxlbWVudC5hZGRFdmVudExpc3RlbmVyICdjb250ZXh0bWVudScsIEBvbk1vdXNlRXZlbnRUb0hpamFja1xuICAgICAgQGVkaXRvckVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lciAnYmx1cicsICAgICAgICBAb25CbHVyXG5cbiAgICB1bnN1YnNjcmliZTogLT5cbiAgICAgIEBfcmVzZXRTdGF0ZSgpXG4gICAgICBAc2VsZWN0aW9uX29ic2VydmVyLmRpc3Bvc2UoKVxuICAgICAgQGVkaXRvckVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lciAnbW91c2Vkb3duJywgICBAb25Nb3VzZURvd25cbiAgICAgIEBlZGl0b3JFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIgJ21vdXNlbW92ZScsICAgQG9uTW91c2VNb3ZlXG4gICAgICBAZWRpdG9yRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyICdtb3VzZXVwJywgICAgIEBvbk1vdXNlRXZlbnRUb0hpamFja1xuICAgICAgQGVkaXRvckVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lciAnbW91c2VsZWF2ZScsICBAb25Nb3VzZUV2ZW50VG9IaWphY2tcbiAgICAgIEBlZGl0b3JFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIgJ21vdXNlZW50ZXInLCAgQG9uTW91c2VFdmVudFRvSGlqYWNrXG4gICAgICBAZWRpdG9yRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyICdjb250ZXh0bWVudScsIEBvbk1vdXNlRXZlbnRUb0hpamFja1xuICAgICAgQGVkaXRvckVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lciAnYmx1cicsICAgICAgICBAb25CbHVyXG5cbiAgICAjIC0tLS0tLS1cbiAgICAjIEV2ZW50IEhhbmRsZXJzXG4gICAgIyAtLS0tLS0tXG5cbiAgICBvbk1vdXNlRG93bjogKGUpID0+XG4gICAgICBpZiBAbW91c2VTdGFydFBvc1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgcmV0dXJuIGZhbHNlXG5cbiAgICAgIGlmIEBfbWFpbk1vdXNlQW5kS2V5RG93bihlKVxuICAgICAgICBAX3Jlc2V0U3RhdGUoKVxuICAgICAgICBAbW91c2VTdGFydFBvcyA9IEBfc2NyZWVuUG9zaXRpb25Gb3JNb3VzZUV2ZW50KGUpXG4gICAgICAgIEBtb3VzZUVuZFBvcyAgID0gQG1vdXNlU3RhcnRQb3NcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIHJldHVybiBmYWxzZVxuXG4gICAgb25Nb3VzZU1vdmU6IChlKSA9PlxuICAgICAgaWYgQG1vdXNlU3RhcnRQb3NcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIGlmIEBfbWFpbk1vdXNlRG93bihlKVxuICAgICAgICAgIEBtb3VzZUVuZFBvcyA9IEBfc2NyZWVuUG9zaXRpb25Gb3JNb3VzZUV2ZW50KGUpXG4gICAgICAgICAgcmV0dXJuIGlmIEBtb3VzZUVuZFBvcy5pc0VxdWFsIEBtb3VzZUVuZFBvc1ByZXZcbiAgICAgICAgICBAX3NlbGVjdEJveEFyb3VuZEN1cnNvcnMoKVxuICAgICAgICAgIEBtb3VzZUVuZFBvc1ByZXYgPSBAbW91c2VFbmRQb3NcbiAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgaWYgZS53aGljaCA9PSAwXG4gICAgICAgICAgQF9yZXNldFN0YXRlKClcblxuICAgICMgSGlqYWNrIGFsbCB0aGUgbW91c2UgZXZlbnRzIHdoaWxlIHNlbGVjdGluZ1xuICAgIG9uTW91c2VFdmVudFRvSGlqYWNrOiAoZSkgPT5cbiAgICAgIGlmIEBtb3VzZVN0YXJ0UG9zXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICByZXR1cm4gZmFsc2VcblxuICAgIG9uQmx1cjogKGUpID0+XG4gICAgICBAX3Jlc2V0U3RhdGUoKVxuXG4gICAgb25SYW5nZUNoYW5nZTogKG5ld1ZhbCkgPT5cbiAgICAgIGlmIEBtb3VzZVN0YXJ0UG9zIGFuZCAhbmV3VmFsLnNlbGVjdGlvbi5pc1NpbmdsZVNjcmVlbkxpbmUoKVxuICAgICAgICBuZXdWYWwuc2VsZWN0aW9uLmRlc3Ryb3koKVxuICAgICAgICBAX3NlbGVjdEJveEFyb3VuZEN1cnNvcnMoKVxuXG4gICAgIyAtLS0tLS0tXG4gICAgIyBNZXRob2RzXG4gICAgIyAtLS0tLS0tXG5cbiAgICBfcmVzZXRTdGF0ZTogLT5cbiAgICAgIEBtb3VzZVN0YXJ0UG9zID0gbnVsbFxuICAgICAgQG1vdXNlRW5kUG9zICAgPSBudWxsXG5cbiAgICBfc2V0dXBfdmFyczogLT5cbiAgICAgIEBlZGl0b3JFbGVtZW50ID89IGF0b20udmlld3MuZ2V0VmlldyBAZWRpdG9yXG4gICAgICBAZWRpdG9yQ29tcG9uZW50ID89IEBlZGl0b3JFbGVtZW50LmNvbXBvbmVudFxuXG4gICAgIyBJIGhhZCB0byBjcmVhdGUgbXkgb3duIHZlcnNpb24gb2YgQGVkaXRvckNvbXBvbmVudC5zY3JlZW5Qb3NpdGlvbkZyb21Nb3VzZUV2ZW50XG4gICAgX3NjcmVlblBvc2l0aW9uRm9yTW91c2VFdmVudDogKGUpIC0+XG4gICAgICBAX3NldHVwX3ZhcnMoKVxuICAgICAgcGl4ZWxQb3NpdGlvbiAgICA9IEBlZGl0b3JDb21wb25lbnQucGl4ZWxQb3NpdGlvbkZvck1vdXNlRXZlbnQoZSlcbiAgICAgIHRhcmdldFRvcCAgICAgICAgPSBwaXhlbFBvc2l0aW9uLnRvcFxuICAgICAgdGFyZ2V0TGVmdCAgICAgICA9IHBpeGVsUG9zaXRpb24ubGVmdFxuICAgICAgZGVmYXVsdENoYXJXaWR0aCA9IEBlZGl0b3IuZ2V0RGVmYXVsdENoYXJXaWR0aCgpXG4gICAgICByb3cgICAgICAgICAgICAgID0gTWF0aC5mbG9vcih0YXJnZXRUb3AgLyBAZWRpdG9yLmdldExpbmVIZWlnaHRJblBpeGVscygpKVxuICAgICAgdGFyZ2V0TGVmdCAgICAgICA9IEluZmluaXR5IGlmIHJvdyA+IEBlZGl0b3IuZ2V0TGFzdEJ1ZmZlclJvdygpXG4gICAgICByb3cgICAgICAgICAgICAgID0gTWF0aC5taW4ocm93LCBAZWRpdG9yLmdldExhc3RCdWZmZXJSb3coKSlcbiAgICAgIHJvdyAgICAgICAgICAgICAgPSBNYXRoLm1heCgwLCByb3cpXG4gICAgICBjb2x1bW4gICAgICAgICAgID0gTWF0aC5yb3VuZCAodGFyZ2V0TGVmdCkgLyBkZWZhdWx0Q2hhcldpZHRoXG4gICAgICBuZXcgUG9pbnQocm93LCBjb2x1bW4pXG5cbiAgICAjIG1ldGhvZHMgZm9yIGNoZWNraW5nIG1vdXNlL2tleSBzdGF0ZSBhZ2FpbnN0IGNvbmZpZ1xuICAgIF9tYWluTW91c2VEb3duOiAoZSkgLT5cbiAgICAgIGUud2hpY2ggaXMgQGlucHV0Q2ZnLm1vdXNlTnVtXG5cbiAgICBfbWFpbk1vdXNlQW5kS2V5RG93bjogKGUpIC0+XG4gICAgICBpZiBAaW5wdXRDZmcuc2VsZWN0S2V5XG4gICAgICAgIEBfbWFpbk1vdXNlRG93bihlKSBhbmQgZVtAaW5wdXRDZmcuc2VsZWN0S2V5XVxuICAgICAgZWxzZVxuICAgICAgICBAX21haW5Nb3VzZURvd24oZSlcblxuICAgICMgRG8gdGhlIGFjdHVhbCBzZWxlY3RpbmdcbiAgICBfc2VsZWN0Qm94QXJvdW5kQ3Vyc29yczogLT5cbiAgICAgIGlmIEBtb3VzZVN0YXJ0UG9zIGFuZCBAbW91c2VFbmRQb3NcbiAgICAgICAgcmFuZ2VzID0gW11cblxuICAgICAgICBmb3Igcm93IGluIFtAbW91c2VTdGFydFBvcy5yb3cuLkBtb3VzZUVuZFBvcy5yb3ddXG4gICAgICAgICAgQG1vdXNlRW5kUG9zLmNvbHVtbiA9IDAgaWYgQG1vdXNlRW5kUG9zLmNvbHVtbiA8IDBcbiAgICAgICAgICByb3dMZW5ndGggPSBAZWRpdG9yLmxpbmVUZXh0Rm9yU2NyZWVuUm93KHJvdykubGVuZ3RoXG4gICAgICAgICAgaWYgcm93TGVuZ3RoID4gQG1vdXNlU3RhcnRQb3MuY29sdW1uIG9yIHJvd0xlbmd0aCA+IEBtb3VzZUVuZFBvcy5jb2x1bW5cbiAgICAgICAgICAgIHJhbmdlID0gW1tyb3csIEBtb3VzZVN0YXJ0UG9zLmNvbHVtbl0sIFtyb3csIEBtb3VzZUVuZFBvcy5jb2x1bW5dXVxuICAgICAgICAgICAgcmFuZ2VzLnB1c2ggcmFuZ2VcblxuICAgICAgICBpZiByYW5nZXMubGVuZ3RoXG4gICAgICAgICAgaXNSZXZlcnNlZCA9IEBtb3VzZUVuZFBvcy5jb2x1bW4gPCBAbW91c2VTdGFydFBvcy5jb2x1bW5cbiAgICAgICAgICBAZWRpdG9yLnNldFNlbGVjdGVkU2NyZWVuUmFuZ2VzIHJhbmdlcywge3JldmVyc2VkOiBpc1JldmVyc2VkfVxuIl19
