(function() {
  var AllWhitespace, Paragraph, Range, SelectAParagraph, SelectAWholeWord, SelectAWord, SelectInsideBrackets, SelectInsideParagraph, SelectInsideQuotes, SelectInsideWholeWord, SelectInsideWord, TextObject, WholeWordRegex, mergeRanges,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Range = require('atom').Range;

  AllWhitespace = /^\s$/;

  WholeWordRegex = /\S+/;

  mergeRanges = require('./utils').mergeRanges;

  TextObject = (function() {
    function TextObject(editor, state) {
      this.editor = editor;
      this.state = state;
    }

    TextObject.prototype.isComplete = function() {
      return true;
    };

    TextObject.prototype.isRecordable = function() {
      return false;
    };

    TextObject.prototype.execute = function() {
      return this.select.apply(this, arguments);
    };

    return TextObject;

  })();

  SelectInsideWord = (function(_super) {
    __extends(SelectInsideWord, _super);

    function SelectInsideWord() {
      return SelectInsideWord.__super__.constructor.apply(this, arguments);
    }

    SelectInsideWord.prototype.select = function() {
      var selection, _i, _len, _ref;
      _ref = this.editor.getSelections();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        selection = _ref[_i];
        if (selection.isEmpty()) {
          selection.selectRight();
        }
        selection.expandOverWord();
      }
      return [true];
    };

    return SelectInsideWord;

  })(TextObject);

  SelectInsideWholeWord = (function(_super) {
    __extends(SelectInsideWholeWord, _super);

    function SelectInsideWholeWord() {
      return SelectInsideWholeWord.__super__.constructor.apply(this, arguments);
    }

    SelectInsideWholeWord.prototype.select = function() {
      var range, selection, _i, _len, _ref, _results;
      _ref = this.editor.getSelections();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        selection = _ref[_i];
        range = selection.cursor.getCurrentWordBufferRange({
          wordRegex: WholeWordRegex
        });
        selection.setBufferRange(mergeRanges(selection.getBufferRange(), range));
        _results.push(true);
      }
      return _results;
    };

    return SelectInsideWholeWord;

  })(TextObject);

  SelectInsideQuotes = (function(_super) {
    __extends(SelectInsideQuotes, _super);

    function SelectInsideQuotes(editor, char, includeQuotes) {
      this.editor = editor;
      this.char = char;
      this.includeQuotes = includeQuotes;
    }

    SelectInsideQuotes.prototype.findOpeningQuote = function(pos) {
      var line, start;
      start = pos.copy();
      pos = pos.copy();
      while (pos.row >= 0) {
        line = this.editor.lineTextForBufferRow(pos.row);
        if (pos.column === -1) {
          pos.column = line.length - 1;
        }
        while (pos.column >= 0) {
          if (line[pos.column] === this.char) {
            if (pos.column === 0 || line[pos.column - 1] !== '\\') {
              if (this.isStartQuote(pos)) {
                return pos;
              } else {
                return this.lookForwardOnLine(start);
              }
            }
          }
          --pos.column;
        }
        pos.column = -1;
        --pos.row;
      }
      return this.lookForwardOnLine(start);
    };

    SelectInsideQuotes.prototype.isStartQuote = function(end) {
      var line, numQuotes;
      line = this.editor.lineTextForBufferRow(end.row);
      numQuotes = line.substring(0, end.column + 1).replace("'" + this.char, '').split(this.char).length - 1;
      return numQuotes % 2;
    };

    SelectInsideQuotes.prototype.lookForwardOnLine = function(pos) {
      var index, line;
      line = this.editor.lineTextForBufferRow(pos.row);
      index = line.substring(pos.column).indexOf(this.char);
      if (index >= 0) {
        pos.column += index;
        return pos;
      }
      return null;
    };

    SelectInsideQuotes.prototype.findClosingQuote = function(start) {
      var end, endLine, escaping;
      end = start.copy();
      escaping = false;
      while (end.row < this.editor.getLineCount()) {
        endLine = this.editor.lineTextForBufferRow(end.row);
        while (end.column < endLine.length) {
          if (endLine[end.column] === '\\') {
            ++end.column;
          } else if (endLine[end.column] === this.char) {
            if (this.includeQuotes) {
              --start.column;
            }
            if (this.includeQuotes) {
              ++end.column;
            }
            return end;
          }
          ++end.column;
        }
        end.column = 0;
        ++end.row;
      }
    };

    SelectInsideQuotes.prototype.select = function() {
      var end, selection, start, _i, _len, _ref, _results;
      _ref = this.editor.getSelections();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        selection = _ref[_i];
        start = this.findOpeningQuote(selection.cursor.getBufferPosition());
        if (start != null) {
          ++start.column;
          end = this.findClosingQuote(start);
          if (end != null) {
            selection.setBufferRange(mergeRanges(selection.getBufferRange(), [start, end]));
          }
        }
        _results.push(!selection.isEmpty());
      }
      return _results;
    };

    return SelectInsideQuotes;

  })(TextObject);

  SelectInsideBrackets = (function(_super) {
    __extends(SelectInsideBrackets, _super);

    function SelectInsideBrackets(editor, beginChar, endChar, includeBrackets) {
      this.editor = editor;
      this.beginChar = beginChar;
      this.endChar = endChar;
      this.includeBrackets = includeBrackets;
    }

    SelectInsideBrackets.prototype.findOpeningBracket = function(pos) {
      var depth, line;
      pos = pos.copy();
      depth = 0;
      while (pos.row >= 0) {
        line = this.editor.lineTextForBufferRow(pos.row);
        if (pos.column === -1) {
          pos.column = line.length - 1;
        }
        while (pos.column >= 0) {
          switch (line[pos.column]) {
            case this.endChar:
              ++depth;
              break;
            case this.beginChar:
              if (--depth < 0) {
                return pos;
              }
          }
          --pos.column;
        }
        pos.column = -1;
        --pos.row;
      }
    };

    SelectInsideBrackets.prototype.findClosingBracket = function(start) {
      var depth, end, endLine;
      end = start.copy();
      depth = 0;
      while (end.row < this.editor.getLineCount()) {
        endLine = this.editor.lineTextForBufferRow(end.row);
        while (end.column < endLine.length) {
          switch (endLine[end.column]) {
            case this.beginChar:
              ++depth;
              break;
            case this.endChar:
              if (--depth < 0) {
                if (this.includeBrackets) {
                  --start.column;
                }
                if (this.includeBrackets) {
                  ++end.column;
                }
                return end;
              }
          }
          ++end.column;
        }
        end.column = 0;
        ++end.row;
      }
    };

    SelectInsideBrackets.prototype.select = function() {
      var end, selection, start, _i, _len, _ref, _results;
      _ref = this.editor.getSelections();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        selection = _ref[_i];
        start = this.findOpeningBracket(selection.cursor.getBufferPosition());
        if (start != null) {
          ++start.column;
          end = this.findClosingBracket(start);
          if (end != null) {
            selection.setBufferRange(mergeRanges(selection.getBufferRange(), [start, end]));
          }
        }
        _results.push(!selection.isEmpty());
      }
      return _results;
    };

    return SelectInsideBrackets;

  })(TextObject);

  SelectAWord = (function(_super) {
    __extends(SelectAWord, _super);

    function SelectAWord() {
      return SelectAWord.__super__.constructor.apply(this, arguments);
    }

    SelectAWord.prototype.select = function() {
      var char, endPoint, selection, _i, _len, _ref, _results;
      _ref = this.editor.getSelections();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        selection = _ref[_i];
        if (selection.isEmpty()) {
          selection.selectRight();
        }
        selection.expandOverWord();
        while (true) {
          endPoint = selection.getBufferRange().end;
          char = this.editor.getTextInRange(Range.fromPointWithDelta(endPoint, 0, 1));
          if (!AllWhitespace.test(char)) {
            break;
          }
          selection.selectRight();
        }
        _results.push(true);
      }
      return _results;
    };

    return SelectAWord;

  })(TextObject);

  SelectAWholeWord = (function(_super) {
    __extends(SelectAWholeWord, _super);

    function SelectAWholeWord() {
      return SelectAWholeWord.__super__.constructor.apply(this, arguments);
    }

    SelectAWholeWord.prototype.select = function() {
      var char, endPoint, range, selection, _i, _len, _ref, _results;
      _ref = this.editor.getSelections();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        selection = _ref[_i];
        range = selection.cursor.getCurrentWordBufferRange({
          wordRegex: WholeWordRegex
        });
        selection.setBufferRange(mergeRanges(selection.getBufferRange(), range));
        while (true) {
          endPoint = selection.getBufferRange().end;
          char = this.editor.getTextInRange(Range.fromPointWithDelta(endPoint, 0, 1));
          if (!AllWhitespace.test(char)) {
            break;
          }
          selection.selectRight();
        }
        _results.push(true);
      }
      return _results;
    };

    return SelectAWholeWord;

  })(TextObject);

  Paragraph = (function(_super) {
    __extends(Paragraph, _super);

    function Paragraph() {
      return Paragraph.__super__.constructor.apply(this, arguments);
    }

    Paragraph.prototype.select = function() {
      var selection, _i, _len, _ref, _results;
      _ref = this.editor.getSelections();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        selection = _ref[_i];
        _results.push(this.selectParagraph(selection));
      }
      return _results;
    };

    Paragraph.prototype.paragraphDelimitedRange = function(startPoint) {
      var inParagraph, lowerRow, upperRow;
      inParagraph = this.isParagraphLine(this.editor.lineTextForBufferRow(startPoint.row));
      upperRow = this.searchLines(startPoint.row, -1, inParagraph);
      lowerRow = this.searchLines(startPoint.row, this.editor.getLineCount(), inParagraph);
      return new Range([upperRow + 1, 0], [lowerRow, 0]);
    };

    Paragraph.prototype.searchLines = function(startRow, rowLimit, startedInParagraph) {
      var currentRow, line, _i;
      for (currentRow = _i = startRow; startRow <= rowLimit ? _i <= rowLimit : _i >= rowLimit; currentRow = startRow <= rowLimit ? ++_i : --_i) {
        line = this.editor.lineTextForBufferRow(currentRow);
        if (startedInParagraph !== this.isParagraphLine(line)) {
          return currentRow;
        }
      }
      return rowLimit;
    };

    Paragraph.prototype.isParagraphLine = function(line) {
      return /\S/.test(line);
    };

    return Paragraph;

  })(TextObject);

  SelectInsideParagraph = (function(_super) {
    __extends(SelectInsideParagraph, _super);

    function SelectInsideParagraph() {
      return SelectInsideParagraph.__super__.constructor.apply(this, arguments);
    }

    SelectInsideParagraph.prototype.selectParagraph = function(selection) {
      var newRange, oldRange, startPoint;
      oldRange = selection.getBufferRange();
      startPoint = selection.cursor.getBufferPosition();
      newRange = this.paragraphDelimitedRange(startPoint);
      selection.setBufferRange(mergeRanges(oldRange, newRange));
      return true;
    };

    return SelectInsideParagraph;

  })(Paragraph);

  SelectAParagraph = (function(_super) {
    __extends(SelectAParagraph, _super);

    function SelectAParagraph() {
      return SelectAParagraph.__super__.constructor.apply(this, arguments);
    }

    SelectAParagraph.prototype.selectParagraph = function(selection) {
      var newRange, nextRange, oldRange, startPoint;
      oldRange = selection.getBufferRange();
      startPoint = selection.cursor.getBufferPosition();
      newRange = this.paragraphDelimitedRange(startPoint);
      nextRange = this.paragraphDelimitedRange(newRange.end);
      selection.setBufferRange(mergeRanges(oldRange, [newRange.start, nextRange.end]));
      return true;
    };

    return SelectAParagraph;

  })(Paragraph);

  module.exports = {
    TextObject: TextObject,
    SelectInsideWord: SelectInsideWord,
    SelectInsideWholeWord: SelectInsideWholeWord,
    SelectInsideQuotes: SelectInsideQuotes,
    SelectInsideBrackets: SelectInsideBrackets,
    SelectAWord: SelectAWord,
    SelectAWholeWord: SelectAWholeWord,
    SelectInsideParagraph: SelectInsideParagraph,
    SelectAParagraph: SelectAParagraph
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3ZpbS1tb2RlL2xpYi90ZXh0LW9iamVjdHMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1PQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxRQUFTLE9BQUEsQ0FBUSxNQUFSLEVBQVQsS0FBRCxDQUFBOztBQUFBLEVBQ0EsYUFBQSxHQUFnQixNQURoQixDQUFBOztBQUFBLEVBRUEsY0FBQSxHQUFpQixLQUZqQixDQUFBOztBQUFBLEVBR0MsY0FBZSxPQUFBLENBQVEsU0FBUixFQUFmLFdBSEQsQ0FBQTs7QUFBQSxFQUtNO0FBQ1MsSUFBQSxvQkFBRSxNQUFGLEVBQVcsS0FBWCxHQUFBO0FBQW1CLE1BQWxCLElBQUMsQ0FBQSxTQUFBLE1BQWlCLENBQUE7QUFBQSxNQUFULElBQUMsQ0FBQSxRQUFBLEtBQVEsQ0FBbkI7SUFBQSxDQUFiOztBQUFBLHlCQUVBLFVBQUEsR0FBWSxTQUFBLEdBQUE7YUFBRyxLQUFIO0lBQUEsQ0FGWixDQUFBOztBQUFBLHlCQUdBLFlBQUEsR0FBYyxTQUFBLEdBQUE7YUFBRyxNQUFIO0lBQUEsQ0FIZCxDQUFBOztBQUFBLHlCQUtBLE9BQUEsR0FBUyxTQUFBLEdBQUE7YUFBRyxJQUFDLENBQUEsTUFBTSxDQUFDLEtBQVIsQ0FBYyxJQUFkLEVBQW9CLFNBQXBCLEVBQUg7SUFBQSxDQUxULENBQUE7O3NCQUFBOztNQU5GLENBQUE7O0FBQUEsRUFhTTtBQUNKLHVDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSwrQkFBQSxNQUFBLEdBQVEsU0FBQSxHQUFBO0FBQ04sVUFBQSx5QkFBQTtBQUFBO0FBQUEsV0FBQSwyQ0FBQTs2QkFBQTtBQUNFLFFBQUEsSUFBRyxTQUFTLENBQUMsT0FBVixDQUFBLENBQUg7QUFDRSxVQUFBLFNBQVMsQ0FBQyxXQUFWLENB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

//# sourceURL=/Users/ah/.atom/packages/vim-mode/lib/text-objects.coffee
