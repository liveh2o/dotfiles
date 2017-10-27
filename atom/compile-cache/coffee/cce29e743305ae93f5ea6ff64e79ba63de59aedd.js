(function() {
  var Range, RangeFinder;

  Range = require('atom').Range;

  module.exports = RangeFinder = (function() {
    RangeFinder.rangesFor = function(editor) {
      return new RangeFinder(editor).ranges();
    };

    function RangeFinder(editor) {
      this.editor = editor;
    }

    RangeFinder.prototype.ranges = function() {
      var selectionRanges;
      selectionRanges = this.selectionRanges();
      if (selectionRanges.length === 0) {
        return [this.sortableRangeFrom(this.sortableRangeForEntireBuffer())];
      } else {
        return selectionRanges.map((function(_this) {
          return function(selectionRange) {
            return _this.sortableRangeFrom(selectionRange);
          };
        })(this));
      }
    };

    RangeFinder.prototype.selectionRanges = function() {
      return this.editor.getSelectedBufferRanges().filter(function(range) {
        return !range.isEmpty();
      });
    };

    RangeFinder.prototype.sortableRangeForEntireBuffer = function() {
      return this.editor.getBuffer().getRange();
    };

    RangeFinder.prototype.sortableRangeFrom = function(selectionRange) {
      var endCol, endRow, startCol, startRow;
      startRow = selectionRange.start.row;
      startCol = 0;
      endRow = selectionRange.end.column === 0 ? selectionRange.end.row - 1 : selectionRange.end.row;
      endCol = this.editor.lineTextForBufferRow(endRow).length;
      return new Range([startRow, startCol], [endRow, endCol]);
    };

    return RangeFinder;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3NvcnQtbGluZXMvbGliL3JhbmdlLWZpbmRlci5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsa0JBQUE7O0FBQUEsRUFBQyxRQUFTLE9BQUEsQ0FBUSxNQUFSLEVBQVQsS0FBRCxDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUVKLElBQUEsV0FBQyxDQUFBLFNBQUQsR0FBWSxTQUFDLE1BQUQsR0FBQTthQUNOLElBQUEsV0FBQSxDQUFZLE1BQVosQ0FBbUIsQ0FBQyxNQUFwQixDQUFBLEVBRE07SUFBQSxDQUFaLENBQUE7O0FBSWEsSUFBQSxxQkFBRSxNQUFGLEdBQUE7QUFBVyxNQUFWLElBQUMsQ0FBQSxTQUFBLE1BQVMsQ0FBWDtJQUFBLENBSmI7O0FBQUEsMEJBT0EsTUFBQSxHQUFRLFNBQUEsR0FBQTtBQUNOLFVBQUEsZUFBQTtBQUFBLE1BQUEsZUFBQSxHQUFrQixJQUFDLENBQUEsZUFBRCxDQUFBLENBQWxCLENBQUE7QUFDQSxNQUFBLElBQUcsZUFBZSxDQUFDLE1BQWhCLEtBQTBCLENBQTdCO2VBQ0UsQ0FBQyxJQUFDLENBQUEsaUJBQUQsQ0FBbUIsSUFBQyxDQUFBLDRCQUFELENBQUEsQ0FBbkIsQ0FBRCxFQURGO09BQUEsTUFBQTtlQUdFLGVBQWUsQ0FBQyxHQUFoQixDQUFvQixDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUMsY0FBRCxHQUFBO21CQUNsQixLQUFDLENBQUEsaUJBQUQsQ0FBbUIsY0FBbkIsRUFEa0I7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFwQixFQUhGO09BRk07SUFBQSxDQVBSLENBQUE7O0FBQUEsMEJBZ0JBLGVBQUEsR0FBaUIsU0FBQSxHQUFBO2FBQ2YsSUFBQyxDQUFBLE1BQU0sQ0FBQyx1QkFBUixDQUFBLENBQWlDLENBQUMsTUFBbEMsQ0FBeUMsU0FBQyxLQUFELEdBQUE7ZUFDdkMsQ0FBQSxLQUFTLENBQUMsT0FBTixDQUFBLEVBRG1DO01BQUEsQ0FBekMsRUFEZTtJQUFBLENBaEJqQixDQUFBOztBQUFBLDBCQXFCQSw0QkFBQSxHQUE4QixTQUFBLEdBQUE7YUFDNUIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxTQUFSLENBQUEsQ0FBbUIsQ0FBQyxRQUFwQixDQUFBLEVBRDRCO0lBQUEsQ0FyQjlCLENBQUE7O0FBQUEsMEJBeUJBLGlCQUFBLEdBQW1CLFNBQUMsY0FBRCxHQUFBO0FBQ2pCLFVBQUEsa0NBQUE7QUFBQSxNQUFBLFFBQUEsR0FBVyxjQUFjLENBQUMsS0FBSyxDQUFDLEdBQWhDLENBQUE7QUFBQSxNQUNBLFFBQUEsR0FBVyxDQURYLENBQUE7QUFBQSxNQUVBLE1BQUEsR0FBWSxjQUFjLENBQUMsR0FBRyxDQUFDLE1BQW5CLEtBQTZCLENBQWhDLEdBQ1AsY0FBYyxDQUFDLEdBQUcsQ0FBQyxHQUFuQixHQUF5QixDQURsQixHQUdQLGNBQWMsQ0FBQyxHQUFHLENBQUMsR0FMckIsQ0FBQTtBQUFBLE1BTUEsTUFBQSxHQUFTLElBQUMsQ0FBQSxNQUFNLENBQUMsb0JBQVIsQ0FBNkIsTUFBN0IsQ0FBb0MsQ0FBQyxNQU45QyxDQUFBO2FBUUksSUFBQSxLQUFBLENBQU0sQ0FBQyxRQUFELEVBQVcsUUFBWCxDQUFOLEVBQTRCLENBQUMsTUFBRCxFQUFTLE1BQVQsQ0FBNUIsRUFUYTtJQUFBLENBekJuQixDQUFBOzt1QkFBQTs7TUFMRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/ah/.atom/packages/sort-lines/lib/range-finder.coffee
