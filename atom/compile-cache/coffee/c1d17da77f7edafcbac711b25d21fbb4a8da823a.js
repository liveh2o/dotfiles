(function() {
  var Range, RangeFinder;

  Range = require('atom').Range;

  module.exports = RangeFinder = (function() {
    RangeFinder.rangesFor = function(editor) {
      return new RangeFinder(editor).ranges();
    };

    function RangeFinder(editor1) {
      this.editor = editor1;
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
      endRow = selectionRange.end.column === 0 ? selectionRange.end.row ? selectionRange.end.row - 1 : 0 : selectionRange.end.row;
      endCol = this.editor.lineTextForBufferRow(endRow).length;
      return new Range([startRow, startCol], [endRow, endCol]);
    };

    return RangeFinder;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3NvcnQtbGluZXMvbGliL3JhbmdlLWZpbmRlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFDLFFBQVMsT0FBQSxDQUFRLE1BQVI7O0VBRVYsTUFBTSxDQUFDLE9BQVAsR0FDTTtJQUVKLFdBQUMsQ0FBQSxTQUFELEdBQVksU0FBQyxNQUFEO2FBQ04sSUFBQSxXQUFBLENBQVksTUFBWixDQUFtQixDQUFDLE1BQXBCLENBQUE7SUFETTs7SUFJQyxxQkFBQyxPQUFEO01BQUMsSUFBQyxDQUFBLFNBQUQ7SUFBRDs7MEJBR2IsTUFBQSxHQUFRLFNBQUE7QUFDTixVQUFBO01BQUEsZUFBQSxHQUFrQixJQUFDLENBQUEsZUFBRCxDQUFBO01BQ2xCLElBQUcsZUFBZSxDQUFDLE1BQWhCLEtBQTBCLENBQTdCO2VBQ0UsQ0FBQyxJQUFDLENBQUEsaUJBQUQsQ0FBbUIsSUFBQyxDQUFBLDRCQUFELENBQUEsQ0FBbkIsQ0FBRCxFQURGO09BQUEsTUFBQTtlQUdFLGVBQWUsQ0FBQyxHQUFoQixDQUFvQixDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFDLGNBQUQ7bUJBQ2xCLEtBQUMsQ0FBQSxpQkFBRCxDQUFtQixjQUFuQjtVQURrQjtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBcEIsRUFIRjs7SUFGTTs7MEJBU1IsZUFBQSxHQUFpQixTQUFBO2FBQ2YsSUFBQyxDQUFBLE1BQU0sQ0FBQyx1QkFBUixDQUFBLENBQWlDLENBQUMsTUFBbEMsQ0FBeUMsU0FBQyxLQUFEO2VBQ3ZDLENBQUksS0FBSyxDQUFDLE9BQU4sQ0FBQTtNQURtQyxDQUF6QztJQURlOzswQkFLakIsNEJBQUEsR0FBOEIsU0FBQTthQUM1QixJQUFDLENBQUEsTUFBTSxDQUFDLFNBQVIsQ0FBQSxDQUFtQixDQUFDLFFBQXBCLENBQUE7SUFENEI7OzBCQUk5QixpQkFBQSxHQUFtQixTQUFDLGNBQUQ7QUFDakIsVUFBQTtNQUFBLFFBQUEsR0FBVyxjQUFjLENBQUMsS0FBSyxDQUFDO01BQ2hDLFFBQUEsR0FBVztNQUNYLE1BQUEsR0FBWSxjQUFjLENBQUMsR0FBRyxDQUFDLE1BQW5CLEtBQTZCLENBQWhDLEdBQ0osY0FBYyxDQUFDLEdBQUcsQ0FBQyxHQUF0QixHQUErQixjQUFjLENBQUMsR0FBRyxDQUFDLEdBQW5CLEdBQXlCLENBQXhELEdBQStELENBRHhELEdBR1AsY0FBYyxDQUFDLEdBQUcsQ0FBQztNQUNyQixNQUFBLEdBQVMsSUFBQyxDQUFBLE1BQU0sQ0FBQyxvQkFBUixDQUE2QixNQUE3QixDQUFvQyxDQUFDO2FBRTFDLElBQUEsS0FBQSxDQUFNLENBQUMsUUFBRCxFQUFXLFFBQVgsQ0FBTixFQUE0QixDQUFDLE1BQUQsRUFBUyxNQUFULENBQTVCO0lBVGE7Ozs7O0FBOUJyQiIsInNvdXJjZXNDb250ZW50IjpbIntSYW5nZX0gPSByZXF1aXJlICdhdG9tJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBSYW5nZUZpbmRlclxuICAjIFB1YmxpY1xuICBAcmFuZ2VzRm9yOiAoZWRpdG9yKSAtPlxuICAgIG5ldyBSYW5nZUZpbmRlcihlZGl0b3IpLnJhbmdlcygpXG5cbiAgIyBQdWJsaWNcbiAgY29uc3RydWN0b3I6IChAZWRpdG9yKSAtPlxuXG4gICMgUHVibGljXG4gIHJhbmdlczogLT5cbiAgICBzZWxlY3Rpb25SYW5nZXMgPSBAc2VsZWN0aW9uUmFuZ2VzKClcbiAgICBpZiBzZWxlY3Rpb25SYW5nZXMubGVuZ3RoIGlzIDBcbiAgICAgIFtAc29ydGFibGVSYW5nZUZyb20oQHNvcnRhYmxlUmFuZ2VGb3JFbnRpcmVCdWZmZXIoKSldXG4gICAgZWxzZVxuICAgICAgc2VsZWN0aW9uUmFuZ2VzLm1hcCAoc2VsZWN0aW9uUmFuZ2UpID0+XG4gICAgICAgIEBzb3J0YWJsZVJhbmdlRnJvbShzZWxlY3Rpb25SYW5nZSlcblxuICAjIEludGVybmFsXG4gIHNlbGVjdGlvblJhbmdlczogLT5cbiAgICBAZWRpdG9yLmdldFNlbGVjdGVkQnVmZmVyUmFuZ2VzKCkuZmlsdGVyIChyYW5nZSkgLT5cbiAgICAgIG5vdCByYW5nZS5pc0VtcHR5KClcblxuICAjIEludGVybmFsXG4gIHNvcnRhYmxlUmFuZ2VGb3JFbnRpcmVCdWZmZXI6IC0+XG4gICAgQGVkaXRvci5nZXRCdWZmZXIoKS5nZXRSYW5nZSgpXG5cbiAgIyBJbnRlcm5hbFxuICBzb3J0YWJsZVJhbmdlRnJvbTogKHNlbGVjdGlvblJhbmdlKSAtPlxuICAgIHN0YXJ0Um93ID0gc2VsZWN0aW9uUmFuZ2Uuc3RhcnQucm93XG4gICAgc3RhcnRDb2wgPSAwXG4gICAgZW5kUm93ID0gaWYgc2VsZWN0aW9uUmFuZ2UuZW5kLmNvbHVtbiA9PSAwXG4gICAgICBpZiBzZWxlY3Rpb25SYW5nZS5lbmQucm93IHRoZW4gc2VsZWN0aW9uUmFuZ2UuZW5kLnJvdyAtIDEgZWxzZSAwXG4gICAgZWxzZVxuICAgICAgc2VsZWN0aW9uUmFuZ2UuZW5kLnJvd1xuICAgIGVuZENvbCA9IEBlZGl0b3IubGluZVRleHRGb3JCdWZmZXJSb3coZW5kUm93KS5sZW5ndGhcblxuICAgIG5ldyBSYW5nZSBbc3RhcnRSb3csIHN0YXJ0Q29sXSwgW2VuZFJvdywgZW5kQ29sXVxuIl19
