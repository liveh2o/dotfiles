(function() {
  var AllWhitespace, CurrentSelection, Motion, MotionError, MotionWithInput, MoveDown, MoveLeft, MoveRight, MoveToAbsoluteLine, MoveToBeginningOfLine, MoveToBottomOfScreen, MoveToEndOfWholeWord, MoveToEndOfWord, MoveToFirstCharacterOfLine, MoveToFirstCharacterOfLineAndDown, MoveToFirstCharacterOfLineDown, MoveToFirstCharacterOfLineUp, MoveToLastCharacterOfLine, MoveToLastNonblankCharacterOfLineAndDown, MoveToLine, MoveToMiddleOfScreen, MoveToNextParagraph, MoveToNextSentence, MoveToNextWholeWord, MoveToNextWord, MoveToPreviousParagraph, MoveToPreviousSentence, MoveToPreviousWholeWord, MoveToPreviousWord, MoveToRelativeLine, MoveToScreenLine, MoveToStartOfFile, MoveToTopOfScreen, MoveUp, Point, Range, ScrollFullDownKeepCursor, ScrollFullUpKeepCursor, ScrollHalfDownKeepCursor, ScrollHalfUpKeepCursor, ScrollKeepingCursor, WholeWordOrEmptyLineRegex, WholeWordRegex, settings, _, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('underscore-plus');

  _ref = require('atom'), Point = _ref.Point, Range = _ref.Range;

  settings = require('../settings');

  WholeWordRegex = /\S+/;

  WholeWordOrEmptyLineRegex = /^\s*$|\S+/;

  AllWhitespace = /^\s$/;

  MotionError = (function() {
    function MotionError(message) {
      this.message = message;
      this.name = 'Motion Error';
    }

    return MotionError;

  })();

  Motion = (function() {
    Motion.prototype.operatesInclusively = false;

    Motion.prototype.operatesLinewise = false;

    function Motion(editor, vimState) {
      this.editor = editor;
      this.vimState = vimState;
    }

    Motion.prototype.select = function(count, options) {
      var selection, value;
      value = (function() {
        var _i, _len, _ref1, _results;
        _ref1 = this.editor.getSelections();
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          selection = _ref1[_i];
          if (this.isLinewise()) {
            this.moveSelectionLinewise(selection, count, options);
          } else if (this.vimState.mode === 'visual') {
            this.moveSelectionVisual(selection, count, options);
          } else if (this.operatesInclusively) {
            this.moveSelectionInclusively(selection, count, options);
          } else {
            this.moveSelection(selection, count, options);
          }
          _results.push(!selection.isEmpty());
        }
        return _results;
      }).call(this);
      this.editor.mergeCursors();
      this.editor.mergeIntersectingSelections();
      return value;
    };

    Motion.prototype.execute = function(count) {
      var cursor, _i, _len, _ref1;
      _ref1 = this.editor.getCursors();
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        cursor = _ref1[_i];
        this.moveCursor(cursor, count);
      }
      return this.editor.mergeCursors();
    };

    Motion.prototype.moveSelectionLinewise = function(selection, count, options) {
      return selection.modifySelection((function(_this) {
        return function() {
          var isEmpty, isReversed, newEndRow, newStartRow, oldEndRow, oldStartRow, wasEmpty, wasReversed, _ref1, _ref2;
          _ref1 = selection.getBufferRowRange(), oldStartRow = _ref1[0], oldEndRow = _ref1[1];
          wasEmpty = selection.isEmpty();
          wasReversed = selection.isReversed();
          if (!(wasEmpty || wasReversed)) {
            selection.cursor.moveLeft();
          }
          _this.moveCursor(selection.cursor, count, options);
          isEmpty = selection.isEmpty();
          isReversed = selection.isReversed();
          if (!(isEmpty || isReversed)) {
            selection.cursor.moveRight();
          }
          _ref2 = selection.getBufferRowRange(), newStartRow = _ref2[0], newEndRow = _ref2[1];
          if (isReversed && !wasReversed) {
            newEndRow = Math.max(newEndRow, oldStartRow);
          }
          if (wasReversed && !isReversed) {
            newStartRow = Math.min(newStartRow, oldEndRow);
          }
          return selection.setBufferRange([[newStartRow, 0], [newEndRow + 1, 0]]);
        };
      })(this));
    };

    Motion.prototype.moveSelectionInclusively = function(selection, count, options) {
      if (!selection.isEmpty()) {
        return this.moveSelectionVisual(selection, count, options);
      }
      return selection.modifySelection((function(_this) {
        return function() {
          var end, start, _ref1;
          _this.moveCursor(selection.cursor, count, options);
          if (selection.isEmpty()) {
            return;
          }
          if (selection.isReversed()) {
            _ref1 = selection.getBufferRange(), start = _ref1.start, end = _ref1.end;
            return selection.setBufferRange([start, [end.row, end.column + 1]]);
          } else {
            return selection.cursor.moveRight();
          }
        };
      })(this));
    };

    Motion.prototype.moveSelectionVisual = function(selection, count, options) {
      return selection.modifySelection((function(_this) {
        return function() {
          var isEmpty, isReversed, newEnd, newStart, oldEnd, oldStart, range, wasEmpty, wasReversed, _ref1, _ref2, _ref3;
          range = selection.getBufferRange();
          _ref1 = [range.start, range.end], oldStart = _ref1[0], oldEnd = _ref1[1];
          wasEmpty = selection.isEmpty();
          wasReversed = selection.isReversed();
          if (!(wasEmpty || wasReversed)) {
            selection.cursor.moveLeft();
          }
          _this.moveCursor(selection.cursor, count, options);
          isEmpty = selection.isEmpty();
          isReversed = selection.isReversed();
          if (!(isEmpty || isReversed)) {
            selection.cursor.moveRight();
          }
          range = selection.getBufferRange();
          _ref2 = [range.start, range.end], newStart = _ref2[0], newEnd = _ref2[1];
          if ((isReversed || isEmpty) && !(wasReversed || wasEmpty)) {
            selection.setBufferRange([newStart, [newEnd.row, oldStart.column + 1]]);
          }
          if (wasReversed && !wasEmpty && !isReversed) {
            selection.setBufferRange([[oldEnd.row, oldEnd.column - 1], newEnd]);
          }
          range = selection.getBufferRange();
          _ref3 = [range.start, range.end], newStart = _ref3[0], newEnd = _ref3[1];
          if (selection.isReversed() && newStart.row === newEnd.row && newStart.column + 1 === newEnd.column) {
            return selection.setBufferRange(range, {
              reversed: false
            });
          }
        };
      })(this));
    };

    Motion.prototype.moveSelection = function(selection, count, options) {
      return selection.modifySelection((function(_this) {
        return function() {
          return _this.moveCursor(selection.cursor, count, options);
        };
      })(this));
    };

    Motion.prototype.isComplete = function() {
      return true;
    };

    Motion.prototype.isRecordable = function() {
      return false;
    };

    Motion.prototype.isLinewise = function() {
      var _ref1, _ref2;
      if (((_ref1 = this.vimState) != null ? _ref1.mode : void 0) === 'visual') {
        return ((_ref2 = this.vimState) != null ? _ref2.submode : void 0) === 'linewise';
      } else {
        return this.operatesLinewise;
      }
    };

    return Motion;

  })();

  CurrentSelection = (function(_super) {
    __extends(CurrentSelection, _super);

    function CurrentSelection(editor, vimState) {
      this.editor = editor;
      this.vimState = vimState;
      CurrentSelection.__super__.constructor.call(this, this.editor, this.vimState);
      this.lastSelectionRange = this.editor.getSelectedBufferRange();
      this.wasLinewise = this.isLinewise();
    }

    CurrentSelection.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, function() {
        return true;
      });
    };

    CurrentSelection.prototype.select = function(count) {
      if (count == null) {
        count = 1;
      }
      if (this.vimState.mode !== 'visual') {
        if (this.wasLinewise) {
          this.selectLines();
        } else {
          this.selectCharacters();
        }
      }
      return _.times(count, function() {
        return true;
      });
    };

    CurrentSelection.prototype.selectLines = function() {
      var cursor, lastSelectionExtent, selection, _i, _len, _ref1;
      lastSelectionExtent = this.lastSelectionRange.getExtent();
      _ref1 = this.editor.getSelections();
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        selection = _ref1[_i];
        cursor = selection.cursor.getBufferPosition();
        selection.setBufferRange([[cursor.row, 0], [cursor.row + lastSelectionExtent.row, 0]]);
      }
    };

    CurrentSelection.prototype.selectCharacters = function() {
      var lastSelectionExtent, newEnd, selection, start, _i, _len, _ref1;
      lastSelectionExtent = this.lastSelectionRange.getExtent();
      _ref1 = this.editor.getSelections();
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        selection = _ref1[_i];
        start = selection.getBufferRange().start;
        newEnd = start.traverse(lastSelectionExtent);
        selection.setBufferRange([start, newEnd]);
      }
    };

    return CurrentSelection;

  })(Motion);

  MotionWithInput = (function(_super) {
    __extends(MotionWithInput, _super);

    function MotionWithInput(editor, vimState) {
      this.editor = editor;
      this.vimState = vimState;
      MotionWithInput.__super__.constructor.call(this, this.editor, this.vimState);
      this.complete = false;
    }

    MotionWithInput.prototype.isComplete = function() {
      return this.complete;
    };

    MotionWithInput.prototype.canComposeWith = function(operation) {
      return operation.characters != null;
    };

    MotionWithInput.prototype.compose = function(input) {
      if (!input.characters) {
        throw new MotionError('Must compose with an Input');
      }
      this.input = input;
      return this.complete = true;
    };

    return MotionWithInput;

  })(Motion);

  MoveLeft = (function(_super) {
    __extends(MoveLeft, _super);

    function MoveLeft() {
      return MoveLeft.__super__.constructor.apply(this, arguments);
    }

    MoveLeft.prototype.moveCursor = function(cursor, count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, function() {
        if (!cursor.isAtBeginningOfLine() || settings.wrapLeftRightMotion()) {
          return cursor.moveLeft();
        }
      });
    };

    return MoveLeft;

  })(Motion);

  MoveRight = (function(_super) {
    __extends(MoveRight, _super);

    function MoveRight() {
      return MoveRight.__super__.constructor.apply(this, arguments);
    }

    MoveRight.prototype.moveCursor = function(cursor, count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          var wrapToNextLine;
          wrapToNextLine = settings.wrapLeftRightMotion();
          if (_this.vimState.mode === 'operator-pending' && !cursor.isAtEndOfLine()) {
            wrapToNextLine = false;
          }
          if (!cursor.isAtEndOfLine()) {
            cursor.moveRight();
          }
          if (wrapToNextLine && cursor.isAtEndOfLine()) {
            return cursor.moveRight();
          }
        };
      })(this));
    };

    return MoveRight;

  })(Motion);

  MoveUp = (function(_super) {
    __extends(MoveUp, _super);

    function MoveUp() {
      return MoveUp.__super__.constructor.apply(this, arguments);
    }

    MoveUp.prototype.operatesLinewise = true;

    MoveUp.prototype.moveCursor = function(cursor, count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, function() {
        if (cursor.getScreenRow() !== 0) {
          return cursor.moveUp();
        }
      });
    };

    return MoveUp;

  })(Motion);

  MoveDown = (function(_super) {
    __extends(MoveDown, _super);

    function MoveDown() {
      return MoveDown.__super__.constructor.apply(this, arguments);
    }

    MoveDown.prototype.operatesLinewise = true;

    MoveDown.prototype.moveCursor = function(cursor, count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          if (cursor.getScreenRow() !== _this.editor.getLastScreenRow()) {
            return cursor.moveDown();
          }
        };
      })(this));
    };

    return MoveDown;

  })(Motion);

  MoveToPreviousWord = (function(_super) {
    __extends(MoveToPreviousWord, _super);

    function MoveToPreviousWord() {
      return MoveToPreviousWord.__super__.constructor.apply(this, arguments);
    }

    MoveToPreviousWord.prototype.moveCursor = function(cursor, count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, function() {
        return cursor.moveToBeginningOfWord();
      });
    };

    return MoveToPreviousWord;

  })(Motion);

  MoveToPreviousWholeWord = (function(_super) {
    __extends(MoveToPreviousWholeWord, _super);

    function MoveToPreviousWholeWord() {
      return MoveToPreviousWholeWord.__super__.constructor.apply(this, arguments);
    }

    MoveToPreviousWholeWord.prototype.moveCursor = function(cursor, count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          var _results;
          cursor.moveToBeginningOfWord();
          _results = [];
          while (!_this.isWholeWord(cursor) && !_this.isBeginningOfFile(cursor)) {
            _results.push(cursor.moveToBeginningOfWord());
          }
          return _results;
        };
      })(this));
    };

    MoveToPreviousWholeWord.prototype.isWholeWord = function(cursor) {
      var char;
      char = cursor.getCurrentWordPrefix().slice(-1);
      return AllWhitespace.test(char);
    };

    MoveToPreviousWholeWord.prototype.isBeginningOfFile = function(cursor) {
      var cur;
      cur = cursor.getBufferPosition();
      return !cur.row && !cur.column;
    };

    return MoveToPreviousWholeWord;

  })(Motion);

  MoveToNextWord = (function(_super) {
    __extends(MoveToNextWord, _super);

    function MoveToNextWord() {
      return MoveToNextWord.__super__.constructor.apply(this, arguments);
    }

    MoveToNextWord.prototype.wordRegex = null;

    MoveToNextWord.prototype.moveCursor = function(cursor, count, options) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          var current, next;
          current = cursor.getBufferPosition();
          next = (options != null ? options.excludeWhitespace : void 0) ? cursor.getEndOfCurrentWordBufferPosition({
            wordRegex: _this.wordRegex
          }) : cursor.getBeginningOfNextWordBufferPosition({
            wordRegex: _this.wordRegex
          });
          if (_this.isEndOfFile(cursor)) {
            return;
          }
          if (cursor.isAtEndOfLine()) {
            cursor.moveDown();
            cursor.moveToBeginningOfLine();
            return cursor.skipLeadingWhitespace();
          } else if (current.row === next.row && current.column === next.column) {
            return cursor.moveToEndOfWord();
          } else {
            return cursor.setBufferPosition(next);
          }
        };
      })(this));
    };

    MoveToNextWord.prototype.isEndOfFile = function(cursor) {
      var cur, eof;
      cur = cursor.getBufferPosition();
      eof = this.editor.getEofBufferPosition();
      return cur.row === eof.row && cur.column === eof.column;
    };

    return MoveToNextWord;

  })(Motion);

  MoveToNextWholeWord = (function(_super) {
    __extends(MoveToNextWholeWord, _super);

    function MoveToNextWholeWord() {
      return MoveToNextWholeWord.__super__.constructor.apply(this, arguments);
    }

    MoveToNextWholeWord.prototype.wordRegex = WholeWordOrEmptyLineRegex;

    return MoveToNextWholeWord;

  })(MoveToNextWord);

  MoveToEndOfWord = (function(_super) {
    __extends(MoveToEndOfWord, _super);

    function MoveToEndOfWord() {
      return MoveToEndOfWord.__super__.constructor.apply(this, arguments);
    }

    MoveToEndOfWord.prototype.operatesInclusively = true;

    MoveToEndOfWord.prototype.wordRegex = null;

    MoveToEndOfWord.prototype.moveCursor = function(cursor, count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          var current, next;
          current = cursor.getBufferPosition();
          next = cursor.getEndOfCurrentWordBufferPosition({
            wordRegex: _this.wordRegex
          });
          if (next.column > 0) {
            next.column--;
          }
          if (next.isEqual(current)) {
            cursor.moveRight();
            if (cursor.isAtEndOfLine()) {
              cursor.moveDown();
              cursor.moveToBeginningOfLine();
            }
            next = cursor.getEndOfCurrentWordBufferPosition({
              wordRegex: _this.wordRegex
            });
            if (next.column > 0) {
              next.column--;
            }
          }
          return cursor.setBufferPosition(next);
        };
      })(this));
    };

    return MoveToEndOfWord;

  })(Motion);

  MoveToEndOfWholeWord = (function(_super) {
    __extends(MoveToEndOfWholeWord, _super);

    function MoveToEndOfWholeWord() {
      return MoveToEndOfWholeWord.__super__.constructor.apply(this, arguments);
    }

    MoveToEndOfWholeWord.prototype.wordRegex = WholeWordRegex;

    return MoveToEndOfWholeWord;

  })(MoveToEndOfWord);

  MoveToNextSentence = (function(_super) {
    __extends(MoveToNextSentence, _super);

    function MoveToNextSentence() {
      return MoveToNextSentence.__super__.constructor.apply(this, arguments);
    }

    MoveToNextSentence.prototype.moveCursor = function(cursor, count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, function() {
        var eof, scanRange, start;
        start = cursor.getBufferPosition().translate(new Point(0, 1));
        eof = cursor.editor.getBuffer().getEndPosition();
        scanRange = [start, eof];
        return cursor.editor.scanInBufferRange(/(^$)|(([\.!?] )|^[A-Za-z0-9])/, scanRange, function(_arg) {
          var adjustment, matchText, range, stop;
          matchText = _arg.matchText, range = _arg.range, stop = _arg.stop;
          adjustment = new Point(0, 0);
          if (matchText.match(/[\.!?]/)) {
            adjustment = new Point(0, 2);
          }
          cursor.setBufferPosition(range.start.translate(adjustment));
          return stop();
        });
      });
    };

    return MoveToNextSentence;

  })(Motion);

  MoveToPreviousSentence = (function(_super) {
    __extends(MoveToPreviousSentence, _super);

    function MoveToPreviousSentence() {
      return MoveToPreviousSentence.__super__.constructor.apply(this, arguments);
    }

    MoveToPreviousSentence.prototype.moveCursor = function(cursor, count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, function() {
        var bof, end, scanRange;
        end = cursor.getBufferPosition().translate(new Point(0, -1));
        bof = cursor.editor.getBuffer().getFirstPosition();
        scanRange = [bof, end];
        return cursor.editor.backwardsScanInBufferRange(/(^$)|(([\.!?] )|^[A-Za-z0-9])/, scanRange, function(_arg) {
          var adjustment, matchText, range, stop;
          matchText = _arg.matchText, range = _arg.range, stop = _arg.stop;
          adjustment = new Point(0, 0);
          if (matchText.match(/[\.!?]/)) {
            adjustment = new Point(0, 2);
          }
          cursor.setBufferPosition(range.start.translate(adjustment));
          return stop();
        });
      });
    };

    return MoveToPreviousSentence;

  })(Motion);

  MoveToNextParagraph = (function(_super) {
    __extends(MoveToNextParagraph, _super);

    function MoveToNextParagraph() {
      return MoveToNextParagraph.__super__.constructor.apply(this, arguments);
    }

    MoveToNextParagraph.prototype.moveCursor = function(cursor, count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, function() {
        return cursor.moveToBeginningOfNextParagraph();
      });
    };

    return MoveToNextParagraph;

  })(Motion);

  MoveToPreviousParagraph = (function(_super) {
    __extends(MoveToPreviousParagraph, _super);

    function MoveToPreviousParagraph() {
      return MoveToPreviousParagraph.__super__.constructor.apply(this, arguments);
    }

    MoveToPreviousParagraph.prototype.moveCursor = function(cursor, count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, function() {
        return cursor.moveToBeginningOfPreviousParagraph();
      });
    };

    return MoveToPreviousParagraph;

  })(Motion);

  MoveToLine = (function(_super) {
    __extends(MoveToLine, _super);

    function MoveToLine() {
      return MoveToLine.__super__.constructor.apply(this, arguments);
    }

    MoveToLine.prototype.operatesLinewise = true;

    MoveToLine.prototype.getDestinationRow = function(count) {
      if (count != null) {
        return count - 1;
      } else {
        return this.editor.getLineCount() - 1;
      }
    };

    return MoveToLine;

  })(Motion);

  MoveToAbsoluteLine = (function(_super) {
    __extends(MoveToAbsoluteLine, _super);

    function MoveToAbsoluteLine() {
      return MoveToAbsoluteLine.__super__.constructor.apply(this, arguments);
    }

    MoveToAbsoluteLine.prototype.moveCursor = function(cursor, count) {
      cursor.setBufferPosition([this.getDestinationRow(count), Infinity]);
      cursor.moveToFirstCharacterOfLine();
      if (cursor.getBufferColumn() === 0) {
        return cursor.moveToEndOfLine();
      }
    };

    return MoveToAbsoluteLine;

  })(MoveToLine);

  MoveToRelativeLine = (function(_super) {
    __extends(MoveToRelativeLine, _super);

    function MoveToRelativeLine() {
      return MoveToRelativeLine.__super__.constructor.apply(this, arguments);
    }

    MoveToRelativeLine.prototype.moveCursor = function(cursor, count) {
      var column, row, _ref1;
      if (count == null) {
        count = 1;
      }
      _ref1 = cursor.getBufferPosition(), row = _ref1.row, column = _ref1.column;
      return cursor.setBufferPosition([row + (count - 1), 0]);
    };

    return MoveToRelativeLine;

  })(MoveToLine);

  MoveToScreenLine = (function(_super) {
    __extends(MoveToScreenLine, _super);

    function MoveToScreenLine(editorElement, vimState, scrolloff) {
      this.editorElement = editorElement;
      this.vimState = vimState;
      this.scrolloff = scrolloff;
      this.scrolloff = 2;
      MoveToScreenLine.__super__.constructor.call(this, this.editorElement.getModel(), this.vimState);
    }

    MoveToScreenLine.prototype.moveCursor = function(cursor, count) {
      var column, row, _ref1;
      if (count == null) {
        count = 1;
      }
      _ref1 = cursor.getBufferPosition(), row = _ref1.row, column = _ref1.column;
      return cursor.setScreenPosition([this.getDestinationRow(count), 0]);
    };

    return MoveToScreenLine;

  })(MoveToLine);

  MoveToBeginningOfLine = (function(_super) {
    __extends(MoveToBeginningOfLine, _super);

    function MoveToBeginningOfLine() {
      return MoveToBeginningOfLine.__super__.constructor.apply(this, arguments);
    }

    MoveToBeginningOfLine.prototype.moveCursor = function(cursor, count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, function() {
        return cursor.moveToBeginningOfLine();
      });
    };

    return MoveToBeginningOfLine;

  })(Motion);

  MoveToFirstCharacterOfLine = (function(_super) {
    __extends(MoveToFirstCharacterOfLine, _super);

    function MoveToFirstCharacterOfLine() {
      return MoveToFirstCharacterOfLine.__super__.constructor.apply(this, arguments);
    }

    MoveToFirstCharacterOfLine.prototype.moveCursor = function(cursor, count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, function() {
        cursor.moveToBeginningOfLine();
        return cursor.moveToFirstCharacterOfLine();
      });
    };

    return MoveToFirstCharacterOfLine;

  })(Motion);

  MoveToFirstCharacterOfLineAndDown = (function(_super) {
    __extends(MoveToFirstCharacterOfLineAndDown, _super);

    function MoveToFirstCharacterOfLineAndDown() {
      return MoveToFirstCharacterOfLineAndDown.__super__.constructor.apply(this, arguments);
    }

    MoveToFirstCharacterOfLineAndDown.prototype.operatesLinewise = true;

    MoveToFirstCharacterOfLineAndDown.prototype.moveCursor = function(cursor, count) {
      if (count == null) {
        count = 1;
      }
      _.times(count - 1, function() {
        return cursor.moveDown();
      });
      cursor.moveToBeginningOfLine();
      return cursor.moveToFirstCharacterOfLine();
    };

    return MoveToFirstCharacterOfLineAndDown;

  })(Motion);

  MoveToLastCharacterOfLine = (function(_super) {
    __extends(MoveToLastCharacterOfLine, _super);

    function MoveToLastCharacterOfLine() {
      return MoveToLastCharacterOfLine.__super__.constructor.apply(this, arguments);
    }

    MoveToLastCharacterOfLine.prototype.moveCursor = function(cursor, count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, function() {
        cursor.moveToEndOfLine();
        return cursor.goalColumn = Infinity;
      });
    };

    return MoveToLastCharacterOfLine;

  })(Motion);

  MoveToLastNonblankCharacterOfLineAndDown = (function(_super) {
    __extends(MoveToLastNonblankCharacterOfLineAndDown, _super);

    function MoveToLastNonblankCharacterOfLineAndDown() {
      return MoveToLastNonblankCharacterOfLineAndDown.__super__.constructor.apply(this, arguments);
    }

    MoveToLastNonblankCharacterOfLineAndDown.prototype.operatesInclusively = true;

    MoveToLastNonblankCharacterOfLineAndDown.prototype.skipTrailingWhitespace = function(cursor) {
      var position, scanRange, startOfTrailingWhitespace;
      position = cursor.getBufferPosition();
      scanRange = cursor.getCurrentLineBufferRange();
      startOfTrailingWhitespace = [scanRange.end.row, scanRange.end.column - 1];
      this.editor.scanInBufferRange(/[ \t]+$/, scanRange, function(_arg) {
        var range;
        range = _arg.range;
        startOfTrailingWhitespace = range.start;
        return startOfTrailingWhitespace.column -= 1;
      });
      return cursor.setBufferPosition(startOfTrailingWhitespace);
    };

    MoveToLastNonblankCharacterOfLineAndDown.prototype.moveCursor = function(cursor, count) {
      if (count == null) {
        count = 1;
      }
      _.times(count - 1, function() {
        return cursor.moveDown();
      });
      return this.skipTrailingWhitespace(cursor);
    };

    return MoveToLastNonblankCharacterOfLineAndDown;

  })(Motion);

  MoveToFirstCharacterOfLineUp = (function(_super) {
    __extends(MoveToFirstCharacterOfLineUp, _super);

    function MoveToFirstCharacterOfLineUp() {
      return MoveToFirstCharacterOfLineUp.__super__.constructor.apply(this, arguments);
    }

    MoveToFirstCharacterOfLineUp.prototype.operatesLinewise = true;

    MoveToFirstCharacterOfLineUp.prototype.moveCursor = function(cursor, count) {
      if (count == null) {
        count = 1;
      }
      _.times(count, function() {
        return cursor.moveUp();
      });
      cursor.moveToBeginningOfLine();
      return cursor.moveToFirstCharacterOfLine();
    };

    return MoveToFirstCharacterOfLineUp;

  })(Motion);

  MoveToFirstCharacterOfLineDown = (function(_super) {
    __extends(MoveToFirstCharacterOfLineDown, _super);

    function MoveToFirstCharacterOfLineDown() {
      return MoveToFirstCharacterOfLineDown.__super__.constructor.apply(this, arguments);
    }

    MoveToFirstCharacterOfLineDown.prototype.operatesLinewise = true;

    MoveToFirstCharacterOfLineDown.prototype.moveCursor = function(cursor, count) {
      if (count == null) {
        count = 1;
      }
      _.times(count, function() {
        return cursor.moveDown();
      });
      cursor.moveToBeginningOfLine();
      return cursor.moveToFirstCharacterOfLine();
    };

    return MoveToFirstCharacterOfLineDown;

  })(Motion);

  MoveToStartOfFile = (function(_super) {
    __extends(MoveToStartOfFile, _super);

    function MoveToStartOfFile() {
      return MoveToStartOfFile.__super__.constructor.apply(this, arguments);
    }

    MoveToStartOfFile.prototype.moveCursor = function(cursor, count) {
      var column, row, _ref1;
      if (count == null) {
        count = 1;
      }
      _ref1 = this.editor.getCursorBufferPosition(), row = _ref1.row, column = _ref1.column;
      cursor.setBufferPosition([this.getDestinationRow(count), 0]);
      if (!this.isLinewise()) {
        return cursor.moveToFirstCharacterOfLine();
      }
    };

    return MoveToStartOfFile;

  })(MoveToLine);

  MoveToTopOfScreen = (function(_super) {
    __extends(MoveToTopOfScreen, _super);

    function MoveToTopOfScreen() {
      return MoveToTopOfScreen.__super__.constructor.apply(this, arguments);
    }

    MoveToTopOfScreen.prototype.getDestinationRow = function(count) {
      var firstScreenRow, offset;
      if (count == null) {
        count = 0;
      }
      firstScreenRow = this.editorElement.getFirstVisibleScreenRow();
      if (firstScreenRow > 0) {
        offset = Math.max(count - 1, this.scrolloff);
      } else {
        offset = count > 0 ? count - 1 : count;
      }
      return firstScreenRow + offset;
    };

    return MoveToTopOfScreen;

  })(MoveToScreenLine);

  MoveToBottomOfScreen = (function(_super) {
    __extends(MoveToBottomOfScreen, _super);

    function MoveToBottomOfScreen() {
      return MoveToBottomOfScreen.__super__.constructor.apply(this, arguments);
    }

    MoveToBottomOfScreen.prototype.getDestinationRow = function(count) {
      var lastRow, lastScreenRow, offset;
      if (count == null) {
        count = 0;
      }
      lastScreenRow = this.editorElement.getLastVisibleScreenRow();
      lastRow = this.editor.getBuffer().getLastRow();
      if (lastScreenRow !== lastRow) {
        offset = Math.max(count - 1, this.scrolloff);
      } else {
        offset = count > 0 ? count - 1 : count;
      }
      return lastScreenRow - offset;
    };

    return MoveToBottomOfScreen;

  })(MoveToScreenLine);

  MoveToMiddleOfScreen = (function(_super) {
    __extends(MoveToMiddleOfScreen, _super);

    function MoveToMiddleOfScreen() {
      return MoveToMiddleOfScreen.__super__.constructor.apply(this, arguments);
    }

    MoveToMiddleOfScreen.prototype.getDestinationRow = function() {
      var firstScreenRow, height, lastScreenRow;
      firstScreenRow = this.editorElement.getFirstVisibleScreenRow();
      lastScreenRow = this.editorElement.getLastVisibleScreenRow();
      height = lastScreenRow - firstScreenRow;
      return Math.floor(firstScreenRow + (height / 2));
    };

    return MoveToMiddleOfScreen;

  })(MoveToScreenLine);

  ScrollKeepingCursor = (function(_super) {
    __extends(ScrollKeepingCursor, _super);

    ScrollKeepingCursor.prototype.operatesLinewise = true;

    ScrollKeepingCursor.prototype.cursorRow = null;

    function ScrollKeepingCursor(editorElement, vimState) {
      this.editorElement = editorElement;
      this.vimState = vimState;
      ScrollKeepingCursor.__super__.constructor.call(this, this.editorElement.getModel(), this.vimState);
    }

    ScrollKeepingCursor.prototype.select = function(count, options) {
      var scrollTop;
      scrollTop = this.scrollScreen(count);
      ScrollKeepingCursor.__super__.select.call(this, count, options);
      return this.editorElement.setScrollTop(scrollTop);
    };

    ScrollKeepingCursor.prototype.execute = function(count) {
      var scrollTop;
      scrollTop = this.scrollScreen(count);
      ScrollKeepingCursor.__super__.execute.call(this, count);
      return this.editorElement.setScrollTop(scrollTop);
    };

    ScrollKeepingCursor.prototype.moveCursor = function(cursor) {
      return cursor.setScreenPosition(Point(this.cursorRow, 0), {
        autoscroll: false
      });
    };

    ScrollKeepingCursor.prototype.scrollScreen = function(count) {
      var currentCursorRow, currentScrollTop, lineHeight, rowsPerPage, scrollRows, _ref1;
      if (count == null) {
        count = 1;
      }
      currentScrollTop = (_ref1 = this.editorElement.component.presenter.pendingScrollTop) != null ? _ref1 : this.editorElement.getScrollTop();
      currentCursorRow = this.editor.getCursorScreenPosition().row;
      rowsPerPage = this.editor.getRowsPerPage();
      lineHeight = this.editor.getLineHeightInPixels();
      scrollRows = Math.floor(this.pageScrollFraction * rowsPerPage * count);
      this.cursorRow = currentCursorRow + scrollRows;
      return currentScrollTop + scrollRows * lineHeight;
    };

    return ScrollKeepingCursor;

  })(Motion);

  ScrollHalfUpKeepCursor = (function(_super) {
    __extends(ScrollHalfUpKeepCursor, _super);

    function ScrollHalfUpKeepCursor() {
      return ScrollHalfUpKeepCursor.__super__.constructor.apply(this, arguments);
    }

    ScrollHalfUpKeepCursor.prototype.pageScrollFraction = -1 / 2;

    return ScrollHalfUpKeepCursor;

  })(ScrollKeepingCursor);

  ScrollFullUpKeepCursor = (function(_super) {
    __extends(ScrollFullUpKeepCursor, _super);

    function ScrollFullUpKeepCursor() {
      return ScrollFullUpKeepCursor.__super__.constructor.apply(this, arguments);
    }

    ScrollFullUpKeepCursor.prototype.pageScrollFraction = -1;

    return ScrollFullUpKeepCursor;

  })(ScrollKeepingCursor);

  ScrollHalfDownKeepCursor = (function(_super) {
    __extends(ScrollHalfDownKeepCursor, _super);

    function ScrollHalfDownKeepCursor() {
      return ScrollHalfDownKeepCursor.__super__.constructor.apply(this, arguments);
    }

    ScrollHalfDownKeepCursor.prototype.pageScrollFraction = 1 / 2;

    return ScrollHalfDownKeepCursor;

  })(ScrollKeepingCursor);

  ScrollFullDownKeepCursor = (function(_super) {
    __extends(ScrollFullDownKeepCursor, _super);

    function ScrollFullDownKeepCursor() {
      return ScrollFullDownKeepCursor.__super__.constructor.apply(this, arguments);
    }

    ScrollFullDownKeepCursor.prototype.pageScrollFraction = 1;

    return ScrollFullDownKeepCursor;

  })(ScrollKeepingCursor);

  module.exports = {
    Motion: Motion,
    MotionWithInput: MotionWithInput,
    CurrentSelection: CurrentSelection,
    MoveLeft: MoveLeft,
    MoveRight: MoveRight,
    MoveUp: MoveUp,
    MoveDown: MoveDown,
    MoveToPreviousWord: MoveToPreviousWord,
    MoveToPreviousWholeWord: MoveToPreviousWholeWord,
    MoveToNextWord: MoveToNextWord,
    MoveToNextWholeWord: MoveToNextWholeWord,
    MoveToEndOfWord: MoveToEndOfWord,
    MoveToNextSentence: MoveToNextSentence,
    MoveToPreviousSentence: MoveToPreviousSentence,
    MoveToNextParagraph: MoveToNextParagraph,
    MoveToPreviousParagraph: MoveToPreviousParagraph,
    MoveToAbsoluteLine: MoveToAbsoluteLine,
    MoveToRelativeLine: MoveToRelativeLine,
    MoveToBeginningOfLine: MoveToBeginningOfLine,
    MoveToFirstCharacterOfLineUp: MoveToFirstCharacterOfLineUp,
    MoveToFirstCharacterOfLineDown: MoveToFirstCharacterOfLineDown,
    MoveToFirstCharacterOfLine: MoveToFirstCharacterOfLine,
    MoveToFirstCharacterOfLineAndDown: MoveToFirstCharacterOfLineAndDown,
    MoveToLastCharacterOfLine: MoveToLastCharacterOfLine,
    MoveToLastNonblankCharacterOfLineAndDown: MoveToLastNonblankCharacterOfLineAndDown,
    MoveToStartOfFile: MoveToStartOfFile,
    MoveToTopOfScreen: MoveToTopOfScreen,
    MoveToBottomOfScreen: MoveToBottomOfScreen,
    MoveToMiddleOfScreen: MoveToMiddleOfScreen,
    MoveToEndOfWholeWord: MoveToEndOfWholeWord,
    MotionError: MotionError,
    ScrollHalfUpKeepCursor: ScrollHalfUpKeepCursor,
    ScrollFullUpKeepCursor: ScrollFullUpKeepCursor,
    ScrollHalfDownKeepCursor: ScrollHalfDownKeepCursor,
    ScrollFullDownKeepCursor: ScrollFullDownKeepCursor
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3ZpbS1tb2RlL2xpYi9tb3Rpb25zL2dlbmVyYWwtbW90aW9ucy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEscTNCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBQUosQ0FBQTs7QUFBQSxFQUNBLE9BQWlCLE9BQUEsQ0FBUSxNQUFSLENBQWpCLEVBQUMsYUFBQSxLQUFELEVBQVEsYUFBQSxLQURSLENBQUE7O0FBQUEsRUFFQSxRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVIsQ0FGWCxDQUFBOztBQUFBLEVBSUEsY0FBQSxHQUFpQixLQUpqQixDQUFBOztBQUFBLEVBS0EseUJBQUEsR0FBNEIsV0FMNUIsQ0FBQTs7QUFBQSxFQU1BLGFBQUEsR0FBZ0IsTUFOaEIsQ0FBQTs7QUFBQSxFQVFNO0FBQ1MsSUFBQSxxQkFBRSxPQUFGLEdBQUE7QUFDWCxNQURZLElBQUMsQ0FBQSxVQUFBLE9BQ2IsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLElBQUQsR0FBUSxjQUFSLENBRFc7SUFBQSxDQUFiOzt1QkFBQTs7TUFURixDQUFBOztBQUFBLEVBWU07QUFDSixxQkFBQSxtQkFBQSxHQUFxQixLQUFyQixDQUFBOztBQUFBLHFCQUNBLGdCQUFBLEdBQWtCLEtBRGxCLENBQUE7O0FBR2EsSUFBQSxnQkFBRSxNQUFGLEVBQVcsUUFBWCxHQUFBO0FBQXNCLE1BQXJCLElBQUMsQ0FBQSxTQUFBLE1BQW9CLENBQUE7QUFBQSxNQUFaLElBQUMsQ0FBQSxXQUFBLFFBQVcsQ0FBdEI7SUFBQSxDQUhiOztBQUFBLHFCQUtBLE1BQUEsR0FBUSxTQUFDLEtBQUQsRUFBUSxPQUFSLEdBQUE7QUFDTixVQUFBLGdCQUFBO0FBQUEsTUFBQSxLQUFBOztBQUFR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

//# sourceURL=/Users/ah/.atom/packages/vim-mode/lib/motions/general-motions.coffee
