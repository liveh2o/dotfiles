(function() {
  var CompositeDisposable, HighlightLineView, Point, lines,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  CompositeDisposable = require('atom').CompositeDisposable;

  Point = require('atom').Point;

  lines = [];

  module.exports = HighlightLineView = (function() {
    function HighlightLineView() {
      this.observeSettings = bind(this.observeSettings, this);
      this.createDecoration = bind(this.createDecoration, this);
      this.handleMultiLine = bind(this.handleMultiLine, this);
      this.handleSingleLine = bind(this.handleSingleLine, this);
      this.showHighlight = bind(this.showHighlight, this);
      this.updateSelectedLine = bind(this.updateSelectedLine, this);
      this.destroy = bind(this.destroy, this);
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.workspace.observeTextEditors((function(_this) {
        return function(activeEditor) {
          activeEditor.onDidAddSelection(_this.updateSelectedLine);
          activeEditor.onDidChangeSelectionRange(_this.updateSelectedLine);
          return activeEditor.onDidRemoveSelection(_this.updateSelectedLine);
        };
      })(this)));
      this.subscriptions.add(atom.workspace.onDidChangeActivePaneItem(this.updateSelectedLine));
      this.markers = [];
      this.observeSettings();
      this.updateSelectedLine();
    }

    HighlightLineView.prototype.getEditor = function() {
      return atom.workspace.getActiveTextEditor();
    };

    HighlightLineView.prototype.destroy = function() {
      return this.subscriptions.dispose();
    };

    HighlightLineView.prototype.updateSelectedLine = function() {
      this.resetBackground();
      return this.showHighlight();
    };

    HighlightLineView.prototype.resetBackground = function() {
      var decoration, i, len, ref;
      ref = this.markers;
      for (i = 0, len = ref.length; i < len; i++) {
        decoration = ref[i];
        decoration.destroy();
        decoration = null;
      }
      return this.markers = [];
    };

    HighlightLineView.prototype.showHighlight = function() {
      if (!this.getEditor()) {
        return;
      }
      this.handleMultiLine();
      return this.handleSingleLine();
    };

    HighlightLineView.prototype.handleSingleLine = function() {
      var i, len, ref, results, selection, selectionRange, style;
      ref = this.getEditor().getSelections();
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        selection = ref[i];
        if (selection.isSingleScreenLine()) {
          selectionRange = selection.getBufferRange();
          if (!(selection.getText() !== '' && atom.config.get("highlight-line.hideHighlightOnSelect"))) {
            if (atom.config.get('highlight-line.enableBackgroundColor')) {
              this.createDecoration(selectionRange);
            }
          }
          if (atom.config.get('highlight-line.enableUnderline')) {
            style = atom.config.get("highlight-line.underline");
            results.push(this.createDecoration(selectionRange, "-multi-line-" + style + "-bottom"));
          } else {
            results.push(void 0);
          }
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    HighlightLineView.prototype.handleMultiLine = function() {
      var bottomLine, i, len, results, selection, selectionRange, selections, style, topLine;
      if (!atom.config.get('highlight-line.enableSelectionBorder')) {
        return;
      }
      selections = this.getEditor().getSelections();
      results = [];
      for (i = 0, len = selections.length; i < len; i++) {
        selection = selections[i];
        if (!selection.isSingleScreenLine()) {
          selectionRange = selection.getBufferRange().copy();
          topLine = selectionRange;
          bottomLine = selectionRange.copy();
          topLine.end = topLine.start;
          bottomLine.start = new Point(bottomLine.end.row - 1, bottomLine.end.column);
          style = atom.config.get("highlight-line.underline");
          this.createDecoration(topLine, "-multi-line-" + style + "-top");
          results.push(this.createDecoration(bottomLine, "-multi-line-" + style + "-bottom"));
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    HighlightLineView.prototype.createDecoration = function(range, klassToAdd) {
      var decoration, klass, marker;
      if (klassToAdd == null) {
        klassToAdd = '';
      }
      klass = 'highlight-line';
      klass += klassToAdd;
      marker = this.getEditor().markBufferRange(range);
      decoration = this.getEditor().decorateMarker(marker, {
        type: 'line',
        "class": klass
      });
      return this.markers.push(marker);
    };

    HighlightLineView.prototype.observeSettings = function() {
      this.subscriptions.add(atom.config.onDidChange("highlight-line.enableBackgroundColor", this.updateSelectedLine));
      this.subscriptions.add(atom.config.onDidChange("highlight-line.hideHighlightOnSelect", this.updateSelectedLine));
      this.subscriptions.add(atom.config.onDidChange("highlight-line.enableUnderline", this.updateSelectedLine));
      return this.subscriptions.add(atom.config.onDidChange("highlight-line.enableSelectionBorder", this.updateSelectedLine));
    };

    return HighlightLineView;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2hpZ2hsaWdodC1saW5lL2xpYi9oaWdobGlnaHQtbGluZS1tb2RlbC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLG9EQUFBO0lBQUE7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUN2QixRQUFTLE9BQUEsQ0FBUSxNQUFSOztFQUVWLEtBQUEsR0FBUTs7RUFFUixNQUFNLENBQUMsT0FBUCxHQUNNO0lBRVMsMkJBQUE7Ozs7Ozs7O01BQ1gsSUFBQyxDQUFBLGFBQUQsR0FBaUIsSUFBSTtNQUVyQixJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBZixDQUFrQyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsWUFBRDtVQUNuRCxZQUFZLENBQUMsaUJBQWIsQ0FBK0IsS0FBQyxDQUFBLGtCQUFoQztVQUNBLFlBQVksQ0FBQyx5QkFBYixDQUF1QyxLQUFDLENBQUEsa0JBQXhDO2lCQUNBLFlBQVksQ0FBQyxvQkFBYixDQUFrQyxLQUFDLENBQUEsa0JBQW5DO1FBSG1EO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFsQyxDQUFuQjtNQUtBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUNFLElBQUksQ0FBQyxTQUFTLENBQUMseUJBQWYsQ0FBeUMsSUFBQyxDQUFBLGtCQUExQyxDQURGO01BSUEsSUFBQyxDQUFBLE9BQUQsR0FBVztNQUNYLElBQUMsQ0FBQSxlQUFELENBQUE7TUFDQSxJQUFDLENBQUEsa0JBQUQsQ0FBQTtJQWRXOztnQ0FnQmIsU0FBQSxHQUFXLFNBQUE7YUFDVCxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUE7SUFEUzs7Z0NBSVgsT0FBQSxHQUFTLFNBQUE7YUFDUCxJQUFDLENBQUEsYUFBYSxDQUFDLE9BQWYsQ0FBQTtJQURPOztnQ0FHVCxr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QURMLEVBQ2E7UUFBQyxJQUFBLEVBQU0sTUFBUDtRQUFlLENBQUEsS0FBQSxDQUFBLEVBQU8sS0FBdEI7T0FEYjthQUdiLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjLE1BQWQ7SUFQZ0I7O2dDQVNsQixlQUFBLEdBQWlCLFNBQUE7TUFDZixJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFaLENBQ2pCLHNDQURpQixFQUN1QixJQUFDLENBQUEsa0JBRHhCLENBQW5CO01BRUEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBWixDQUNqQixzQ0FEaUIsRUFDdUIsSUFBQyxDQUFBLGtCQUR4QixDQUFuQjtNQUVBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVosQ0FDakIsZ0NBRGlCLEVBQ2lCLElBQUMsQ0FBQSxrQkFEbEIsQ0FBbkI7YUFFQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFaLENBQ2pCLHNDQURpQixFQUN1QixJQUFDLENBQUEsa0JBRHhCLENBQW5CO0lBUGU7Ozs7O0FBMUZuQiIsInNvdXJjZXNDb250ZW50IjpbIntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG57UG9pbnR9ID0gcmVxdWlyZSAnYXRvbSdcblxubGluZXMgPSBbXVxuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBIaWdobGlnaHRMaW5lVmlld1xuXG4gIGNvbnN0cnVjdG9yOiAtPlxuICAgIEBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZChhdG9tLndvcmtzcGFjZS5vYnNlcnZlVGV4dEVkaXRvcnMoKGFjdGl2ZUVkaXRvcikgPT5cbiAgICAgIGFjdGl2ZUVkaXRvci5vbkRpZEFkZFNlbGVjdGlvbihAdXBkYXRlU2VsZWN0ZWRMaW5lKVxuICAgICAgYWN0aXZlRWRpdG9yLm9uRGlkQ2hhbmdlU2VsZWN0aW9uUmFuZ2UoQHVwZGF0ZVNlbGVjdGVkTGluZSlcbiAgICAgIGFjdGl2ZUVkaXRvci5vbkRpZFJlbW92ZVNlbGVjdGlvbihAdXBkYXRlU2VsZWN0ZWRMaW5lKVxuICAgICkpXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS53b3Jrc3BhY2Uub25EaWRDaGFuZ2VBY3RpdmVQYW5lSXRlbShAdXBkYXRlU2VsZWN0ZWRMaW5lKVxuICAgIClcblxuICAgIEBtYXJrZXJzID0gW11cbiAgICBAb2JzZXJ2ZVNldHRpbmdzKClcbiAgICBAdXBkYXRlU2VsZWN0ZWRMaW5lKClcblxuICBnZXRFZGl0b3I6IC0+XG4gICAgYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG5cbiAgIyBUZWFyIGRvd24gYW55IHN0YXRlIGFuZCBkZXRhY2hcbiAgZGVzdHJveTogPT5cbiAgICBAc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcblxuICB1cGRhdGVTZWxlY3RlZExpbmU6ID0+XG4gICAgQHJlc2V0QmFja2dyb3VuZCgpXG4gICAgQHNob3dIaWdobGlnaHQoKVxuXG4gIHJlc2V0QmFja2dyb3VuZDogLT5cbiAgICBmb3IgZGVjb3JhdGlvbiBpbiBAbWFya2Vyc1xuICAgICAgZGVjb3JhdGlvbi5kZXN0cm95KClcbiAgICAgIGRlY29yYXRpb24gPSBudWxsXG4gICAgQG1hcmtlcnMgPSBbXVxuXG4gIHNob3dIaWdobGlnaHQ6ID0+XG4gICAgcmV0dXJuIHVubGVzcyBAZ2V0RWRpdG9yKClcbiAgICBAaGFuZGxlTXVsdGlMaW5lKClcbiAgICBAaGFuZGxlU2luZ2xlTGluZSgpXG5cbiAgaGFuZGxlU2luZ2xlTGluZTogPT5cbiAgICBmb3Igc2VsZWN0aW9uIGluIEBnZXRFZGl0b3IoKS5nZXRTZWxlY3Rpb25zKClcbiAgICAgIGlmIHNlbGVjdGlvbi5pc1NpbmdsZVNjcmVlbkxpbmUoKVxuICAgICAgICBzZWxlY3Rpb25SYW5nZSA9IHNlbGVjdGlvbi5nZXRCdWZmZXJSYW5nZSgpXG4gICAgICAgIHVubGVzcyBzZWxlY3Rpb24uZ2V0VGV4dCgpIGlzbnQgJycgXFxcbiAgICAgICAgYW5kIGF0b20uY29uZmlnLmdldChcImhpZ2hsaWdodC1saW5lLmhpZGVIaWdobGlnaHRPblNlbGVjdFwiKVxuICAgICAgICAgIGlmIGF0b20uY29uZmlnLmdldCgnaGlnaGxpZ2h0LWxpbmUuZW5hYmxlQmFja2dyb3VuZENvbG9yJylcbiAgICAgICAgICAgIEBjcmVhdGVEZWNvcmF0aW9uKHNlbGVjdGlvblJhbmdlKVxuXG4gICAgICAgIGlmIGF0b20uY29uZmlnLmdldCgnaGlnaGxpZ2h0LWxpbmUuZW5hYmxlVW5kZXJsaW5lJylcbiAgICAgICAgICBzdHlsZSA9IGF0b20uY29uZmlnLmdldCBcImhpZ2hsaWdodC1saW5lLnVuZGVybGluZVwiXG4gICAgICAgICAgQGNyZWF0ZURlY29yYXRpb24oc2VsZWN0aW9uUmFuZ2UsXG4gICAgICAgICAgICBcIi1tdWx0aS1saW5lLSN7c3R5bGV9LWJvdHRvbVwiKVxuXG4gIGhhbmRsZU11bHRpTGluZTogPT5cbiAgICByZXR1cm4gdW5sZXNzIGF0b20uY29uZmlnLmdldCgnaGlnaGxpZ2h0LWxpbmUuZW5hYmxlU2VsZWN0aW9uQm9yZGVyJylcblxuICAgIHNlbGVjdGlvbnMgPSBAZ2V0RWRpdG9yKCkuZ2V0U2VsZWN0aW9ucygpXG4gICAgZm9yIHNlbGVjdGlvbiBpbiBzZWxlY3Rpb25zXG4gICAgICB1bmxlc3Mgc2VsZWN0aW9uLmlzU2luZ2xlU2NyZWVuTGluZSgpXG4gICAgICAgIHNlbGVjdGlvblJhbmdlID0gc2VsZWN0aW9uLmdldEJ1ZmZlclJhbmdlKCkuY29weSgpXG4gICAgICAgIHRvcExpbmUgPSBzZWxlY3Rpb25SYW5nZVxuICAgICAgICBib3R0b21MaW5lID0gc2VsZWN0aW9uUmFuZ2UuY29weSgpXG5cbiAgICAgICAgdG9wTGluZS5lbmQgPSB0b3BMaW5lLnN0YXJ0XG4gICAgICAgIGJvdHRvbUxpbmUuc3RhcnQgPSBuZXcgUG9pbnQoYm90dG9tTGluZS5lbmQucm93IC0gMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3R0b21MaW5lLmVuZC5jb2x1bW4pXG5cbiAgICAgICAgc3R5bGUgPSBhdG9tLmNvbmZpZy5nZXQgXCJoaWdobGlnaHQtbGluZS51bmRlcmxpbmVcIlxuXG4gICAgICAgIEBjcmVhdGVEZWNvcmF0aW9uKHRvcExpbmUsXG4gICAgICAgICAgXCItbXVsdGktbGluZS0je3N0eWxlfS10b3BcIilcbiAgICAgICAgQGNyZWF0ZURlY29yYXRpb24oYm90dG9tTGluZSxcbiAgICAgICAgICBcIi1tdWx0aS1saW5lLSN7c3R5bGV9LWJvdHRvbVwiKVxuXG4gIGNyZWF0ZURlY29yYXRpb246IChyYW5nZSwga2xhc3NUb0FkZCA9ICcnKSA9PlxuICAgIGtsYXNzID0gJ2hpZ2hsaWdodC1saW5lJ1xuICAgIGtsYXNzICs9IGtsYXNzVG9BZGRcbiAgICBtYXJrZXIgPSBAZ2V0RWRpdG9yKCkubWFya0J1ZmZlclJhbmdlKHJhbmdlKVxuICAgIGRlY29yYXRpb24gPSBAZ2V0RWRpdG9yKClcbiAgICAgIC5kZWNvcmF0ZU1hcmtlcihtYXJrZXIsIHt0eXBlOiAnbGluZScsIGNsYXNzOiBrbGFzc30pXG5cbiAgICBAbWFya2Vycy5wdXNoIG1hcmtlclxuXG4gIG9ic2VydmVTZXR0aW5nczogPT5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb25maWcub25EaWRDaGFuZ2UoXG4gICAgICBcImhpZ2hsaWdodC1saW5lLmVuYWJsZUJhY2tncm91bmRDb2xvclwiLCBAdXBkYXRlU2VsZWN0ZWRMaW5lKVxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbmZpZy5vbkRpZENoYW5nZShcbiAgICAgIFwiaGlnaGxpZ2h0LWxpbmUuaGlkZUhpZ2hsaWdodE9uU2VsZWN0XCIsIEB1cGRhdGVTZWxlY3RlZExpbmUpXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlKFxuICAgICAgXCJoaWdobGlnaHQtbGluZS5lbmFibGVVbmRlcmxpbmVcIiwgQHVwZGF0ZVNlbGVjdGVkTGluZSlcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb25maWcub25EaWRDaGFuZ2UoXG4gICAgICBcImhpZ2hsaWdodC1saW5lLmVuYWJsZVNlbGVjdGlvbkJvcmRlclwiLCBAdXBkYXRlU2VsZWN0ZWRMaW5lKVxuIl19
