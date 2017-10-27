(function() {
  var RangeFinder, sortLines, sortLinesInsensitive, sortLinesNatural, sortLinesReversed, sortTextLines, uniqueLines;

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

  sortLinesNatural = function(editor) {
    return sortTextLines(editor, function(textLines) {
      var naturalSortRegex;
      naturalSortRegex = /^(\d*)(\D*)(\d*)([\s\S]*)$/;
      return textLines.sort((function(_this) {
        return function(a, b) {
          var aLeadingNum, aRemainder, aTrailingNum, aWord, bLeadingNum, bRemainder, bTrailingNum, bWord, __, _ref, _ref1;
          if (a === b) {
            return 0;
          }
          _ref = naturalSortRegex.exec(a), __ = _ref[0], aLeadingNum = _ref[1], aWord = _ref[2], aTrailingNum = _ref[3], aRemainder = _ref[4];
          _ref1 = naturalSortRegex.exec(b), __ = _ref1[0], bLeadingNum = _ref1[1], bWord = _ref1[2], bTrailingNum = _ref1[3], bRemainder = _ref1[4];
          if (aWord !== bWord) {
            return (a < b ? -1 : 1);
          }
          if (aLeadingNum !== bLeadingNum) {
            return (aLeadingNum < bLeadingNum ? -1 : 1);
          }
          if (aTrailingNum !== bTrailingNum) {
            return (aTrailingNum < bTrailingNum ? -1 : 1);
          }
          return 0;
        };
      })(this));
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3NvcnQtbGluZXMvbGliL3NvcnQtbGluZXMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZHQUFBOztBQUFBLEVBQUEsV0FBQSxHQUFjLE9BQUEsQ0FBUSxnQkFBUixDQUFkLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxRQUFBLEVBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLDhCQUFsQixFQUNFO0FBQUEsUUFBQSxpQkFBQSxFQUFtQixTQUFBLEdBQUE7QUFDakIsY0FBQSxNQUFBO0FBQUEsVUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBQVQsQ0FBQTtpQkFDQSxTQUFBLENBQVUsTUFBVixFQUZpQjtRQUFBLENBQW5CO0FBQUEsUUFHQSx5QkFBQSxFQUEyQixTQUFBLEdBQUE7QUFDekIsY0FBQSxNQUFBO0FBQUEsVUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBQVQsQ0FBQTtpQkFDQSxpQkFBQSxDQUFrQixNQUFsQixFQUZ5QjtRQUFBLENBSDNCO0FBQUEsUUFNQSxtQkFBQSxFQUFxQixTQUFBLEdBQUE7QUFDbkIsY0FBQSxNQUFBO0FBQUEsVUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBQVQsQ0FBQTtpQkFDQSxXQUFBLENBQVksTUFBWixFQUZtQjtRQUFBLENBTnJCO0FBQUEsUUFTQSxrQ0FBQSxFQUFvQyxTQUFBLEdBQUE7QUFDbEMsY0FBQSxNQUFBO0FBQUEsVUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBQVQsQ0FBQTtpQkFD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

//# sourceURL=/Users/ah/.atom/packages/sort-lines/lib/sort-lines.coffee
