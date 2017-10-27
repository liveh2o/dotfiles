(function() {
  var AllWhitespace, Paragraph, Range, SelectAParagraph, SelectAWholeWord, SelectAWord, SelectInsideBrackets, SelectInsideParagraph, SelectInsideQuotes, SelectInsideWholeWord, SelectInsideWord, TextObject, WholeWordRegex,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Range = require('atom').Range;

  AllWhitespace = /^\s$/;

  WholeWordRegex = /\S+/;

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

    return TextObject;

  })();

  SelectInsideWord = (function(_super) {
    __extends(SelectInsideWord, _super);

    function SelectInsideWord() {
      return SelectInsideWord.__super__.constructor.apply(this, arguments);
    }

    SelectInsideWord.prototype.select = function() {
      this.editor.selectWordsContainingCursors();
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
        selection.setBufferRange(range);
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
            selection.setBufferRange([start, end]);
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
            selection.setBufferRange([start, end]);
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
        selection.selectWord();
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
        selection.setBufferRange(range);
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
      var range, startPoint;
      startPoint = selection.getBufferRange().start;
      range = this.paragraphDelimitedRange(startPoint);
      selection.setBufferRange(range);
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
      var nextRange, range, startPoint;
      startPoint = selection.getBufferRange().start;
      range = this.paragraphDelimitedRange(startPoint);
      nextRange = this.paragraphDelimitedRange(range.end);
      selection.setBufferRange([range.start, nextRange.end]);
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
