(function() {
  var RangeFinder, sortLines, sortLinesInsensitive, sortLinesReversed, sortTextLines, uniqueLines;

  RangeFinder = require('./range-finder');

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
        }
      });
    }
  };

  sortTextLines = function(editor, sorter) {
    var sortableRanges;
    sortableRanges = RangeFinder.rangesFor(editor);
    return sortableRanges.forEach(function(range) {
      var textLines;
      textLines = editor.getTextInBufferRange(range).split("\n");
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
      return textLines.filter(function(value, index, self) {
        return self.indexOf(value) === index;
      });
    });
  };

  sortLinesInsensitive = function(editor) {
    return sortTextLines(editor, function(textLines) {
      return textLines.sort(function(a, b) {
        return a.toLowerCase().localeCompare(b.toLowerCase());
      });
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3NvcnQtbGluZXMvbGliL3NvcnQtbGluZXMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDJGQUFBOztBQUFBLEVBQUEsV0FBQSxHQUFjLE9BQUEsQ0FBUSxnQkFBUixDQUFkLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxRQUFBLEVBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLDhCQUFsQixFQUNFO0FBQUEsUUFBQSxpQkFBQSxFQUFtQixTQUFBLEdBQUE7QUFDakIsY0FBQSxNQUFBO0FBQUEsVUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBQVQsQ0FBQTtpQkFDQSxTQUFBLENBQVUsTUFBVixFQUZpQjtRQUFBLENBQW5CO0FBQUEsUUFHQSx5QkFBQSxFQUEyQixTQUFBLEdBQUE7QUFDekIsY0FBQSxNQUFBO0FBQUEsVUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBQVQsQ0FBQTtpQkFDQSxpQkFBQSxDQUFrQixNQUFsQixFQUZ5QjtRQUFBLENBSDNCO0FBQUEsUUFNQSxtQkFBQSxFQUFxQixTQUFBLEdBQUE7QUFDbkIsY0FBQSxNQUFBO0FBQUEsVUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBQVQsQ0FBQTtpQkFDQSxXQUFBLENBQVksTUFBWixFQUZtQjtRQUFBLENBTnJCO0FBQUEsUUFTQSxrQ0FBQSxFQUFvQyxTQUFBLEdBQUE7QUFDbEMsY0FBQSxNQUFBO0FBQUEsVUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBQVQsQ0FBQTtpQkFDQSxvQkFBQSxDQUFxQixNQUFyQixFQUZrQztRQUFBLENBVHBDO09BREYsRUFEUTtJQUFBLENBQVY7R0FIRixDQUFBOztBQUFBLEVBa0JBLGFBQUEsR0FBZ0IsU0FBQyxNQUFELEVBQVMsTUFBVCxHQUFBO0FBQ2QsUUFBQSxjQUFBO0FBQUEsSUFBQSxjQUFBLEdBQWlCLFdBQVcsQ0FBQyxTQUFaLENBQXNCLE1BQXRCLENBQWpCLENBQUE7V0FDQSxjQUFjLENBQUMsT0FBZixDQUF1QixTQUFDLEtBQUQsR0FBQTtBQUNyQixVQUFBLFNBQUE7QUFBQSxNQUFBLFNBQUEsR0FBWSxNQUFNLENBQUMsb0JBQVAsQ0FBNEIsS0FBNUIsQ0FBa0MsQ0FBQyxLQUFuQyxDQUF5QyxJQUF6QyxDQUFaLENBQUE7QUFBQSxNQUNBLFNBQUEsR0FBWSxNQUFBLENBQU8sU0FBUCxDQURaLENBQUE7YUFFQSxNQUFNLENBQUMsb0JBQVAsQ0FBNEIsS0FBNUIsRUFBbUMsU0FBUyxDQUFDLElBQVYsQ0FBZSxJQUFmLENBQW5DLEVBSHFCO0lBQUEsQ0FBdkIsRUFGYztFQUFBLENBbEJoQixDQUFBOztBQUFBLEVBeUJBLFNBQUEsR0FBWSxTQUFDLE1BQUQsR0FBQTtXQUNWLGFBQUEsQ0FBYyxNQUFkLEVBQXNCLFNBQUMsU0FBRCxHQUFBO2FBQ3BCLFNBQVMsQ0FBQyxJQUFWLENBQWUsU0FBQyxDQUFELEVBQUksQ0FBSixHQUFBO2VBQVUsQ0FBQyxDQUFDLGFBQUYsQ0FBZ0IsQ0FBaEIsRUFBVjtNQUFBLENBQWYsRUFEb0I7SUFBQSxDQUF0QixFQURVO0VBQUEsQ0F6QlosQ0FBQTs7QUFBQSxFQTZCQSxpQkFBQSxHQUFvQixTQUFDLE1BQUQsR0FBQTtXQUNsQixhQUFBLENBQWMsTUFBZCxFQUFzQixTQUFDLFNBQUQsR0FBQTthQUNwQixTQUFTLENBQUMsSUFBVixDQUFlLFNBQUMsQ0FBRCxFQUFJLENBQUosR0FBQTtlQUFVLENBQUMsQ0FBQyxhQUFGLENBQWdCLENBQWhCLEVBQVY7TUFBQSxDQUFmLEVBRG9CO0lBQUEsQ0FBdEIsRUFEa0I7RUFBQSxDQTdCcEIsQ0FBQTs7QUFBQSxFQWlDQSxXQUFBLEdBQWMsU0FBQyxNQUFELEdBQUE7V0FDWixhQUFBLENBQWMsTUFBZCxFQUFzQixTQUFDLFNBQUQsR0FBQTthQUNwQixTQUFTLENBQUMsTUFBVixDQUFpQixTQUFDLEtBQUQsRUFBUSxLQUFSLEVBQWUsSUFBZixHQUFBO2VBQXdCLElBQUksQ0FBQyxPQUFMLENBQWEsS0FBYixDQUFBLEtBQXVCLE1BQS9DO01BQUEsQ0FBakIsRUFEb0I7SUFBQSxDQUF0QixFQURZO0VBQUEsQ0FqQ2QsQ0FBQTs7QUFBQSxFQXFDQSxvQkFBQSxHQUF1QixTQUFDLE1BQUQsR0FBQTtXQUNyQixhQUFBLENBQWMsTUFBZCxFQUFzQixTQUFDLFNBQUQsR0FBQTthQUNwQixTQUFTLENBQUMsSUFBVixDQUFlLFNBQUMsQ0FBRCxFQUFJLENBQUosR0FBQTtlQUFVLENBQUMsQ0FBQyxXQUFGLENBQUEsQ0FBZSxDQUFDLGFBQWhCLENBQThCLENBQUMsQ0FBQyxXQUFGLENBQUEsQ0FBOUIsRUFBVjtNQUFBLENBQWYsRUFEb0I7SUFBQSxDQUF0QixFQURxQjtFQUFBLENBckN2QixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/ah/.atom/packages/sort-lines/lib/sort-lines.coffee
