(function() {
  var RangeFinder, naturalSort, sortLines, sortLinesInsensitive, sortLinesNatural, sortLinesReversed, sortTextLines, uniqueLines;

  RangeFinder = require('./range-finder');

  naturalSort = require('javascript-natural-sort');

  module.exports = {
    activate: function() {
      return atom.commands.add('atom-text-editor:not([mini])', {
        'sort-lines:sort': function() {
          var editor;
          editor = atom.workspace.getActiveTextEditor();
          return sortLines(editor);
        },
        'sort-lines:reverse-sort': function() {
          var editor;
          editor = atom.workspace.getActiveTextEditor();
          return sortLinesReversed(editor);
        },
        'sort-lines:unique': function() {
          var editor;
          editor = atom.workspace.getActiveTextEditor();
          return uniqueLines(editor);
        },
        'sort-lines:case-insensitive-sort': function() {
          var editor;
          editor = atom.workspace.getActiveTextEditor();
          return sortLinesInsensitive(editor);
        },
        'sort-lines:natural': function() {
          var editor;
          editor = atom.workspace.getActiveTextEditor();
          return sortLinesNatural(editor);
        }
      });
    }
  };

  sortTextLines = function(editor, sorter) {
    var sortableRanges;
    sortableRanges = RangeFinder.rangesFor(editor);
    return sortableRanges.forEach(function(range) {
      var textLines;
      textLines = editor.getTextInBufferRange(range).split(/\r?\n/g);
      textLines = sorter(textLines);
      return editor.setTextInBufferRange(range, textLines.join("\n"));
    });
  };

  sortLines = function(editor) {
    return sortTextLines(editor, function(textLines) {
      return textLines.sort(function(a, b) {
        return a.localeCompare(b);
      });
    });
  };

  sortLinesReversed = function(editor) {
    return sortTextLines(editor, function(textLines) {
      return textLines.sort(function(a, b) {
        return b.localeCompare(a);
      });
    });
  };

  uniqueLines = function(editor) {
    return sortTextLines(editor, function(textLines) {
      return Array.from(new Set(textLines));
    });
  };

  sortLinesInsensitive = function(editor) {
    return sortTextLines(editor, function(textLines) {
      return textLines.sort(function(a, b) {
        return a.toLowerCase().localeCompare(b.toLowerCase());
      });
    });
  };

  sortLinesNatural = function(editor) {
    return sortTextLines(editor, function(textLines) {
      return textLines.sort(naturalSort);
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3NvcnQtbGluZXMvbGliL3NvcnQtbGluZXMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxXQUFBLEdBQWMsT0FBQSxDQUFRLGdCQUFSOztFQUNkLFdBQUEsR0FBYyxPQUFBLENBQVEseUJBQVI7O0VBRWQsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLFFBQUEsRUFBVSxTQUFBO2FBQ1IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLDhCQUFsQixFQUNFO1FBQUEsaUJBQUEsRUFBbUIsU0FBQTtBQUNqQixjQUFBO1VBQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQTtpQkFDVCxTQUFBLENBQVUsTUFBVjtRQUZpQixDQUFuQjtRQUdBLHlCQUFBLEVBQTJCLFNBQUE7QUFDekIsY0FBQTtVQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUE7aUJBQ1QsaUJBQUEsQ0FBa0IsTUFBbEI7UUFGeUIsQ0FIM0I7UUFNQSxtQkFBQSxFQUFxQixTQUFBO0FBQ25CLGNBQUE7VUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBO2lCQUNULFdBQUEsQ0FBWSxNQUFaO1FBRm1CLENBTnJCO1FBU0Esa0NBQUEsRUFBb0MsU0FBQTtBQUNsQyxjQUFBO1VBQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQTtpQkFDVCxvQkFBQSxDQUFxQixNQUFyQjtRQUZrQyxDQVRwQztRQVlBLG9CQUFBLEVBQXNCLFNBQUE7QUFDcEIsY0FBQTtVQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUE7aUJBQ1QsZ0JBQUEsQ0FBaUIsTUFBakI7UUFGb0IsQ0FadEI7T0FERjtJQURRLENBQVY7OztFQWtCRixhQUFBLEdBQWdCLFNBQUMsTUFBRCxFQUFTLE1BQVQ7QUFDZCxRQUFBO0lBQUEsY0FBQSxHQUFpQixXQUFXLENBQUMsU0FBWixDQUFzQixNQUF0QjtXQUNqQixjQUFjLENBQUMsT0FBZixDQUF1QixTQUFDLEtBQUQ7QUFDckIsVUFBQTtNQUFBLFNBQUEsR0FBWSxNQUFNLENBQUMsb0JBQVAsQ0FBNEIsS0FBNUIsQ0FBa0MsQ0FBQyxLQUFuQyxDQUF5QyxRQUF6QztNQUNaLFNBQUEsR0FBWSxNQUFBLENBQU8sU0FBUDthQUNaLE1BQU0sQ0FBQyxvQkFBUCxDQUE0QixLQUE1QixFQUFtQyxTQUFTLENBQUMsSUFBVixDQUFlLElBQWYsQ0FBbkM7SUFIcUIsQ0FBdkI7RUFGYzs7RUFPaEIsU0FBQSxHQUFZLFNBQUMsTUFBRDtXQUNWLGFBQUEsQ0FBYyxNQUFkLEVBQXNCLFNBQUMsU0FBRDthQUNwQixTQUFTLENBQUMsSUFBVixDQUFlLFNBQUMsQ0FBRCxFQUFJLENBQUo7ZUFBVSxDQUFDLENBQUMsYUFBRixDQUFnQixDQUFoQjtNQUFWLENBQWY7SUFEb0IsQ0FBdEI7RUFEVTs7RUFJWixpQkFBQSxHQUFvQixTQUFDLE1BQUQ7V0FDbEIsYUFBQSxDQUFjLE1BQWQsRUFBc0IsU0FBQyxTQUFEO2FBQ3BCLFNBQVMsQ0FBQyxJQUFWLENBQWUsU0FBQyxDQUFELEVBQUksQ0FBSjtlQUFVLENBQUMsQ0FBQyxhQUFGLENBQWdCLENBQWhCO01BQVYsQ0FBZjtJQURvQixDQUF0QjtFQURrQjs7RUFJcEIsV0FBQSxHQUFjLFNBQUMsTUFBRDtXQUNaLGFBQUEsQ0FBYyxNQUFkLEVBQXNCLFNBQUMsU0FBRDthQUNwQixLQUFLLENBQUMsSUFBTixDQUFlLElBQUEsR0FBQSxDQUFJLFNBQUosQ0FBZjtJQURvQixDQUF0QjtFQURZOztFQUlkLG9CQUFBLEdBQXVCLFNBQUMsTUFBRDtXQUNyQixhQUFBLENBQWMsTUFBZCxFQUFzQixTQUFDLFNBQUQ7YUFDcEIsU0FBUyxDQUFDLElBQVYsQ0FBZSxTQUFDLENBQUQsRUFBSSxDQUFKO2VBQVUsQ0FBQyxDQUFDLFdBQUYsQ0FBQSxDQUFlLENBQUMsYUFBaEIsQ0FBOEIsQ0FBQyxDQUFDLFdBQUYsQ0FBQSxDQUE5QjtNQUFWLENBQWY7SUFEb0IsQ0FBdEI7RUFEcUI7O0VBSXZCLGdCQUFBLEdBQW1CLFNBQUMsTUFBRDtXQUNqQixhQUFBLENBQWMsTUFBZCxFQUFzQixTQUFDLFNBQUQ7YUFDcEIsU0FBUyxDQUFDLElBQVYsQ0FBZSxXQUFmO0lBRG9CLENBQXRCO0VBRGlCO0FBN0NuQiIsInNvdXJjZXNDb250ZW50IjpbIlJhbmdlRmluZGVyID0gcmVxdWlyZSAnLi9yYW5nZS1maW5kZXInXG5uYXR1cmFsU29ydCA9IHJlcXVpcmUgJ2phdmFzY3JpcHQtbmF0dXJhbC1zb3J0J1xuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIGFjdGl2YXRlOiAtPlxuICAgIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXRleHQtZWRpdG9yOm5vdChbbWluaV0pJyxcbiAgICAgICdzb3J0LWxpbmVzOnNvcnQnOiAtPlxuICAgICAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgICAgc29ydExpbmVzKGVkaXRvcilcbiAgICAgICdzb3J0LWxpbmVzOnJldmVyc2Utc29ydCc6IC0+XG4gICAgICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgICAgICBzb3J0TGluZXNSZXZlcnNlZChlZGl0b3IpXG4gICAgICAnc29ydC1saW5lczp1bmlxdWUnOiAtPlxuICAgICAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgICAgdW5pcXVlTGluZXMoZWRpdG9yKVxuICAgICAgJ3NvcnQtbGluZXM6Y2FzZS1pbnNlbnNpdGl2ZS1zb3J0JzogLT5cbiAgICAgICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICAgIHNvcnRMaW5lc0luc2Vuc2l0aXZlKGVkaXRvcilcbiAgICAgICdzb3J0LWxpbmVzOm5hdHVyYWwnOiAtPlxuICAgICAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgICAgc29ydExpbmVzTmF0dXJhbChlZGl0b3IpXG5cbnNvcnRUZXh0TGluZXMgPSAoZWRpdG9yLCBzb3J0ZXIpIC0+XG4gIHNvcnRhYmxlUmFuZ2VzID0gUmFuZ2VGaW5kZXIucmFuZ2VzRm9yKGVkaXRvcilcbiAgc29ydGFibGVSYW5nZXMuZm9yRWFjaCAocmFuZ2UpIC0+XG4gICAgdGV4dExpbmVzID0gZWRpdG9yLmdldFRleHRJbkJ1ZmZlclJhbmdlKHJhbmdlKS5zcGxpdCgvXFxyP1xcbi9nKVxuICAgIHRleHRMaW5lcyA9IHNvcnRlcih0ZXh0TGluZXMpXG4gICAgZWRpdG9yLnNldFRleHRJbkJ1ZmZlclJhbmdlKHJhbmdlLCB0ZXh0TGluZXMuam9pbihcIlxcblwiKSlcblxuc29ydExpbmVzID0gKGVkaXRvcikgLT5cbiAgc29ydFRleHRMaW5lcyBlZGl0b3IsICh0ZXh0TGluZXMpIC0+XG4gICAgdGV4dExpbmVzLnNvcnQgKGEsIGIpIC0+IGEubG9jYWxlQ29tcGFyZShiKVxuXG5zb3J0TGluZXNSZXZlcnNlZCA9IChlZGl0b3IpIC0+XG4gIHNvcnRUZXh0TGluZXMgZWRpdG9yLCAodGV4dExpbmVzKSAtPlxuICAgIHRleHRMaW5lcy5zb3J0IChhLCBiKSAtPiBiLmxvY2FsZUNvbXBhcmUoYSlcblxudW5pcXVlTGluZXMgPSAoZWRpdG9yKSAtPlxuICBzb3J0VGV4dExpbmVzIGVkaXRvciwgKHRleHRMaW5lcykgLT5cbiAgICBBcnJheS5mcm9tKG5ldyBTZXQodGV4dExpbmVzKSlcblxuc29ydExpbmVzSW5zZW5zaXRpdmUgPSAoZWRpdG9yKSAtPlxuICBzb3J0VGV4dExpbmVzIGVkaXRvciwgKHRleHRMaW5lcykgLT5cbiAgICB0ZXh0TGluZXMuc29ydCAoYSwgYikgLT4gYS50b0xvd2VyQ2FzZSgpLmxvY2FsZUNvbXBhcmUoYi50b0xvd2VyQ2FzZSgpKVxuXG5zb3J0TGluZXNOYXR1cmFsID0gKGVkaXRvcikgLT5cbiAgc29ydFRleHRMaW5lcyBlZGl0b3IsICh0ZXh0TGluZXMpIC0+XG4gICAgdGV4dExpbmVzLnNvcnQgbmF0dXJhbFNvcnRcbiJdfQ==
