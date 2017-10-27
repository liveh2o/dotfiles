(function() {
  var AllWhitespace, CurrentSelection, Motion, MotionError, MotionWithInput, MoveDown, MoveLeft, MoveRight, MoveToAbsoluteLine, MoveToBeginningOfLine, MoveToBottomOfScreen, MoveToEndOfWholeWord, MoveToEndOfWord, MoveToFirstCharacterOfLine, MoveToFirstCharacterOfLineAndDown, MoveToFirstCharacterOfLineDown, MoveToFirstCharacterOfLineUp, MoveToLastCharacterOfLine, MoveToLine, MoveToMiddleOfScreen, MoveToNextParagraph, MoveToNextWholeWord, MoveToNextWord, MoveToPreviousParagraph, MoveToPreviousWholeWord, MoveToPreviousWord, MoveToRelativeLine, MoveToScreenLine, MoveToStartOfFile, MoveToTopOfScreen, MoveUp, Point, Range, WholeWordOrEmptyLineRegex, WholeWordRegex, _, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('underscore-plus');

  _ref = require('atom'), Point = _ref.Point, Range = _ref.Range;

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
    Motion.prototype.operatesInclusively = true;

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
          } else if (this.isInclusive()) {
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
      return selection.modifySelection((function(_this) {
        return function() {
          var isEmpty, isReversed, newEnd, newStart, oldEnd, oldStart, range, wasEmpty, wasReversed, _ref1, _ref2;
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
          if (wasReversed && !isReversed) {
            return selection.setBufferRange([[newStart.row, oldEnd.column - 1], newEnd]);
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

    Motion.prototype.ensureCursorIsWithinLine = function(cursor) {
      var column, goalColumn, lastColumn, row, _ref1;
      if (this.vimState.mode === 'visual' || !cursor.selection.isEmpty()) {
        return;
      }
      goalColumn = cursor.goalColumn;
      _ref1 = cursor.getBufferPosition(), row = _ref1.row, column = _ref1.column;
      lastColumn = cursor.getCurrentLineBufferRange().end.column;
      if (column >= lastColumn - 1) {
        cursor.setBufferPosition([row, Math.max(lastColumn - 1, 0)]);
      }
      return cursor.goalColumn != null ? cursor.goalColumn : cursor.goalColumn = goalColumn;
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

    Motion.prototype.isInclusive = function() {
      return this.vimState.mode === 'visual' || this.operatesInclusively;
    };

    return Motion;

  })();

  CurrentSelection = (function(_super) {
    __extends(CurrentSelection, _super);

    function CurrentSelection(editor, vimState) {
      this.editor = editor;
      this.vimState = vimState;
      CurrentSelection.__super__.constructor.call(this, this.editor, this.vimState);
      this.selection = this.editor.getSelectedBufferRanges();
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
      this.editor.setSelectedBufferRanges(this.selection);
      return _.times(count, function() {
        return true;
      });
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

    MoveLeft.prototype.operatesInclusively = false;

    MoveLeft.prototype.moveCursor = function(cursor, count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          if (!cursor.isAtBeginningOfLine() || atom.config.get('vim-mode.wrapLeftRightMotion')) {
            cursor.moveLeft();
          }
          return _this.ensureCursorIsWithinLine(cursor);
        };
      })(this));
    };

    return MoveLeft;

  })(Motion);

  MoveRight = (function(_super) {
    __extends(MoveRight, _super);

    function MoveRight() {
      return MoveRight.__super__.constructor.apply(this, arguments);
    }

    MoveRight.prototype.operatesInclusively = false;

    MoveRight.prototype.moveCursor = function(cursor, count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          if (!cursor.isAtEndOfLine()) {
            cursor.moveRight();
          }
          if (atom.config.get('vim-mode.wrapLeftRightMotion') && cursor.isAtEndOfLine()) {
            cursor.moveRight();
          }
          return _this.ensureCursorIsWithinLine(cursor);
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
      return _.times(count, (function(_this) {
        return function() {
          if (cursor.getBufferRow() !== 0) {
            cursor.moveUp();
            return _this.ensureCursorIsWithinLine(cursor);
          }
        };
      })(this));
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
          if (cursor.getBufferRow() !== _this.editor.getEofBufferPosition().row) {
            cursor.moveDown();
            return _this.ensureCursorIsWithinLine(cursor);
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

    MoveToPreviousWord.prototype.operatesInclusively = false;

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

    MoveToPreviousWholeWord.prototype.operatesInclusively = false;

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

    MoveToNextWord.prototype.operatesInclusively = false;

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

  MoveToNextParagraph = (function(_super) {
    __extends(MoveToNextParagraph, _super);

    function MoveToNextParagraph() {
      return MoveToNextParagraph.__super__.constructor.apply(this, arguments);
    }

    MoveToNextParagraph.prototype.operatesInclusively = false;

    MoveToNextParagraph.prototype.moveCursor = function(cursor, count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          return cursor.moveToBeginningOfNextParagraph();
        };
      })(this));
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
      return _.times(count, (function(_this) {
        return function() {
          return cursor.moveToBeginningOfPreviousParagraph();
        };
      })(this));
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

    MoveToRelativeLine.prototype.operatesLinewise = true;

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

    function MoveToScreenLine(editor, vimState, scrolloff) {
      this.editor = editor;
      this.vimState = vimState;
      this.scrolloff = scrolloff;
      this.scrolloff = 2;
      MoveToScreenLine.__super__.constructor.call(this, this.editor, this.vimState);
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

    MoveToBeginningOfLine.prototype.operatesInclusively = false;

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

    MoveToFirstCharacterOfLine.prototype.operatesInclusively = false;

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

    MoveToFirstCharacterOfLineAndDown.prototype.operatesInclusively = true;

    MoveToFirstCharacterOfLineAndDown.prototype.moveCursor = function(cursor, count) {
      if (count == null) {
        count = 0;
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

    MoveToLastCharacterOfLine.prototype.operatesInclusively = false;

    MoveToLastCharacterOfLine.prototype.moveCursor = function(cursor, count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          cursor.moveToEndOfLine();
          cursor.goalColumn = Infinity;
          return _this.ensureCursorIsWithinLine(cursor);
        };
      })(this));
    };

    return MoveToLastCharacterOfLine;

  })(Motion);

  MoveToFirstCharacterOfLineUp = (function(_super) {
    __extends(MoveToFirstCharacterOfLineUp, _super);

    function MoveToFirstCharacterOfLineUp() {
      return MoveToFirstCharacterOfLineUp.__super__.constructor.apply(this, arguments);
    }

    MoveToFirstCharacterOfLineUp.prototype.operatesLinewise = true;

    MoveToFirstCharacterOfLineUp.prototype.operatesInclusively = true;

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
      firstScreenRow = this.editor.getFirstVisibleScreenRow();
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
      lastScreenRow = this.editor.getLastVisibleScreenRow();
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

    MoveToMiddleOfScreen.prototype.getDestinationRow = function(count) {
      var firstScreenRow, height, lastScreenRow;
      firstScreenRow = this.editor.getFirstVisibleScreenRow();
      lastScreenRow = this.editor.getLastVisibleScreenRow();
      height = lastScreenRow - firstScreenRow;
      return Math.floor(firstScreenRow + (height / 2));
    };

    return MoveToMiddleOfScreen;

  })(MoveToScreenLine);

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
    MoveToStartOfFile: MoveToStartOfFile,
    MoveToTopOfScreen: MoveToTopOfScreen,
    MoveToBottomOfScreen: MoveToBottomOfScreen,
    MoveToMiddleOfScreen: MoveToMiddleOfScreen,
    MoveToEndOfWholeWord: MoveToEndOfWholeWord,
    MotionError: MotionError
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDRwQkFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQUFKLENBQUE7O0FBQUEsRUFDQSxPQUFpQixPQUFBLENBQVEsTUFBUixDQUFqQixFQUFDLGFBQUEsS0FBRCxFQUFRLGFBQUEsS0FEUixDQUFBOztBQUFBLEVBR0EsY0FBQSxHQUFpQixLQUhqQixDQUFBOztBQUFBLEVBSUEseUJBQUEsR0FBNEIsV0FKNUIsQ0FBQTs7QUFBQSxFQUtBLGFBQUEsR0FBZ0IsTUFMaEIsQ0FBQTs7QUFBQSxFQU9NO0FBQ1MsSUFBQSxxQkFBRSxPQUFGLEdBQUE7QUFDWCxNQURZLElBQUMsQ0FBQSxVQUFBLE9BQ2IsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLElBQUQsR0FBUSxjQUFSLENBRFc7SUFBQSxDQUFiOzt1QkFBQTs7TUFSRixDQUFBOztBQUFBLEVBV007QUFDSixxQkFBQSxtQkFBQSxHQUFxQixJQUFyQixDQUFBOztBQUFBLHFCQUNBLGdCQUFBLEdBQWtCLEtBRGxCLENBQUE7O0FBR2EsSUFBQSxnQkFBRSxNQUFGLEVBQVcsUUFBWCxHQUFBO0FBQXNCLE1BQXJCLElBQUMsQ0FBQSxTQUFBLE1BQW9CLENBQUE7QUFBQSxNQUFaLElBQUMsQ0FBQSxXQUFBLFFBQVcsQ0FBdEI7SUFBQSxDQUhiOztBQUFBLHFCQUtBLE1BQUEsR0FBUSxTQUFDLEtBQUQsRUFBUSxPQUFSLEdBQUE7QUFDTixVQUFBLGdCQUFBO0FBQUEsTUFBQSxLQUFBOztBQUFRO0FBQUE7YUFBQSw0Q0FBQTtnQ0FBQTtBQUNOLFVBQUEsSUFBRyxJQUFDLENBQUEsVUFBRCxDQUFBLENBQUg7QUFDRSxZQUFBLElBQUMsQ0FBQSxxQkFBRCxDQUF1QixTQUF2QixFQUFrQyxLQUFsQyxF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
//# sourceURL=/Users/ah/.atom/packages/vim-mode/lib/motions/general-motions.coffee