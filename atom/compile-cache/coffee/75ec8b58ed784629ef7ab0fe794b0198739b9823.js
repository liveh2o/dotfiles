(function() {
  var $$, CurrentSelection, Motion, MotionError, MotionWithInput, MoveDown, MoveLeft, MoveRight, MoveToBeginningOfLine, MoveToBottomOfScreen, MoveToEndOfWholeWord, MoveToEndOfWord, MoveToFirstCharacterOfLine, MoveToFirstCharacterOfLineDown, MoveToFirstCharacterOfLineUp, MoveToLastCharacterOfLine, MoveToLine, MoveToMiddleOfScreen, MoveToNextParagraph, MoveToNextWholeWord, MoveToNextWord, MoveToPreviousParagraph, MoveToPreviousWholeWord, MoveToPreviousWord, MoveToRelativeLine, MoveToScreenLine, MoveToStartOfFile, MoveToTopOfScreen, MoveUp, MoveVertically, Point, Range, _, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  _ = require('underscore-plus');

  _ref = require('atom'), $$ = _ref.$$, Point = _ref.Point, Range = _ref.Range;

  MotionError = (function() {
    function MotionError(message) {
      this.message = message;
      this.name = 'Motion Error';
    }

    return MotionError;

  })();

  Motion = (function() {
    function Motion(editor, vimState) {
      this.editor = editor;
      this.vimState = vimState;
      this.vimState.desiredCursorColumn = null;
    }

    Motion.prototype.isComplete = function() {
      return true;
    };

    Motion.prototype.isRecordable = function() {
      return false;
    };

    Motion.prototype.inVisualMode = function() {
      return this.vimState.mode === "visual";
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

    CurrentSelection.prototype.isLinewise = function() {
      return this.vimState.mode === 'visual' && this.vimState.submode === 'linewise';
    };

    return CurrentSelection;

  })(Motion);

  MotionWithInput = (function(_super) {
    __extends(MotionWithInput, _super);

    function MotionWithInput(editorView, vimState) {
      this.editorView = editorView;
      this.vimState = vimState;
      MotionWithInput.__super__.constructor.call(this, this.editorView.editor, this.vimState);
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

    MoveLeft.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          var column;
          column = _this.editor.getCursorBufferPosition().column;
          if (column > 0) {
            return _this.editor.moveLeft();
          }
        };
      })(this));
    };

    MoveLeft.prototype.select = function(count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          var column;
          column = _this.editor.getCursorBufferPosition().column;
          if (column > 0) {
            _this.editor.selectLeft();
            return true;
          } else {
            return false;
          }
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

    MoveRight.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          var column, row, _ref1;
          _ref1 = _this.editor.getCursorBufferPosition(), row = _ref1.row, column = _ref1.column;
          if (column < _this.editor.lineTextForBufferRow(row).length - 1) {
            return _this.editor.moveRight();
          }
        };
      })(this));
    };

    MoveRight.prototype.select = function(count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          var end, rowLength, start, _ref1;
          _ref1 = _this.editor.getSelectedBufferRange(), start = _ref1.start, end = _ref1.end;
          rowLength = _this.editor.getLastCursor().getCurrentBufferLine().length;
          if (end.column < rowLength) {
            _this.editor.selectRight();
            return true;
          } else {
            return false;
          }
        };
      })(this));
    };

    return MoveRight;

  })(Motion);

  MoveVertically = (function(_super) {
    __extends(MoveVertically, _super);

    function MoveVertically(editor, vimState) {
      var column;
      this.editor = editor;
      this.vimState = vimState;
      column = this.vimState.desiredCursorColumn;
      MoveVertically.__super__.constructor.call(this, this.editor, this.vimState);
      this.vimState.desiredCursorColumn = column;
    }

    MoveVertically.prototype.execute = function(count) {
      var column, nextColumn, nextLineLength, nextRow, row, _ref1;
      if (count == null) {
        count = 1;
      }
      _ref1 = this.editor.getCursorBufferPosition(), row = _ref1.row, column = _ref1.column;
      nextRow = this.nextValidRow(count);
      if (nextRow !== row) {
        nextLineLength = this.editor.lineTextForBufferRow(nextRow).length;
        nextColumn = this.vimState.desiredCursorColumn || column;
        if (nextColumn >= nextLineLength) {
          this.editor.setCursorBufferPosition([nextRow, nextLineLength - 1]);
          return this.vimState.desiredCursorColumn = nextColumn;
        } else {
          this.editor.setCursorBufferPosition([nextRow, nextColumn]);
          return this.vimState.desiredCursorColumn = null;
        }
      }
    };

    MoveVertically.prototype.nextValidRow = function(count) {
      var column, maxRow, minRow, row, _ref1;
      _ref1 = this.editor.getCursorBufferPosition(), row = _ref1.row, column = _ref1.column;
      maxRow = this.editor.getLastBufferRow();
      minRow = 0;
      _.times(count, (function(_this) {
        return function() {
          var _results;
          if (_this.editor.isFoldedAtBufferRow(row)) {
            _results = [];
            while (_this.editor.isFoldedAtBufferRow(row)) {
              _results.push(row += _this.directionIncrement());
            }
            return _results;
          } else {
            return row += _this.directionIncrement();
          }
        };
      })(this));
      if (row > maxRow) {
        return maxRow;
      } else if (row < minRow) {
        return minRow;
      } else {
        return row;
      }
    };

    return MoveVertically;

  })(Motion);

  MoveUp = (function(_super) {
    __extends(MoveUp, _super);

    function MoveUp() {
      return MoveUp.__super__.constructor.apply(this, arguments);
    }

    MoveUp.prototype.directionIncrement = function() {
      return -1;
    };

    MoveUp.prototype.select = function(count) {
      if (count == null) {
        count = 1;
      }
      if (!this.inVisualMode()) {
        this.editor.moveToBeginningOfLine();
        this.editor.moveDown();
        this.editor.selectUp();
      }
      return _.times(count, (function(_this) {
        return function() {
          _this.editor.selectUp();
          return true;
        };
      })(this));
    };

    return MoveUp;

  })(MoveVertically);

  MoveDown = (function(_super) {
    __extends(MoveDown, _super);

    function MoveDown() {
      return MoveDown.__super__.constructor.apply(this, arguments);
    }

    MoveDown.prototype.directionIncrement = function() {
      return 1;
    };

    MoveDown.prototype.select = function(count) {
      if (count == null) {
        count = 1;
      }
      if (!this.inVisualMode()) {
        this.editor.selectLinesContainingCursors();
      }
      return _.times(count, (function(_this) {
        return function() {
          _this.editor.selectDown();
          return true;
        };
      })(this));
    };

    return MoveDown;

  })(MoveVertically);

  MoveToPreviousWord = (function(_super) {
    __extends(MoveToPreviousWord, _super);

    function MoveToPreviousWord() {
      return MoveToPreviousWord.__super__.constructor.apply(this, arguments);
    }

    MoveToPreviousWord.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          return _this.editor.moveToBeginningOfWord();
        };
      })(this));
    };

    MoveToPreviousWord.prototype.select = function(count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          _this.editor.selectToBeginningOfWord();
          return true;
        };
      })(this));
    };

    return MoveToPreviousWord;

  })(Motion);

  MoveToPreviousWholeWord = (function(_super) {
    __extends(MoveToPreviousWholeWord, _super);

    function MoveToPreviousWholeWord() {
      return MoveToPreviousWholeWord.__super__.constructor.apply(this, arguments);
    }

    MoveToPreviousWholeWord.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          var _results;
          _this.editor.moveToBeginningOfWord();
          _results = [];
          while (!_this.isWholeWord() && !_this.isBeginningOfFile()) {
            _results.push(_this.editor.moveToBeginningOfWord());
          }
          return _results;
        };
      })(this));
    };

    MoveToPreviousWholeWord.prototype.select = function(count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          _this.editor.selectToBeginningOfWord();
          while (!_this.isWholeWord() && !_this.isBeginningOfFile()) {
            _this.editor.selectToBeginningOfWord();
          }
          return true;
        };
      })(this));
    };

    MoveToPreviousWholeWord.prototype.isWholeWord = function() {
      var char;
      char = this.editor.getLastCursor().getCurrentWordPrefix().slice(-1);
      return char === ' ' || char === '\n';
    };

    MoveToPreviousWholeWord.prototype.isBeginningOfFile = function() {
      var cur;
      cur = this.editor.getCursorBufferPosition();
      return !cur.row && !cur.column;
    };

    return MoveToPreviousWholeWord;

  })(Motion);

  MoveToNextWord = (function(_super) {
    __extends(MoveToNextWord, _super);

    function MoveToNextWord() {
      return MoveToNextWord.__super__.constructor.apply(this, arguments);
    }

    MoveToNextWord.prototype.execute = function(count) {
      var cursor;
      if (count == null) {
        count = 1;
      }
      cursor = this.editor.getLastCursor();
      return _.times(count, (function(_this) {
        return function() {
          var current, next;
          current = cursor.getBufferPosition();
          next = cursor.getBeginningOfNextWordBufferPosition();
          if (_this.isEndOfFile()) {
            return;
          }
          if (cursor.isAtEndOfLine()) {
            cursor.moveDown();
            cursor.moveToBeginningOfLine();
            return cursor.skipLeadingWhitespace();
          } else if (current.row === next.row && current.column === next.column) {
            return cursor.moveToEndOfWord();
          } else {
            return cursor.moveToBeginningOfNextWord();
          }
        };
      })(this));
    };

    MoveToNextWord.prototype.select = function(count, _arg) {
      var cursor, excludeWhitespace;
      if (count == null) {
        count = 1;
      }
      excludeWhitespace = (_arg != null ? _arg : {}).excludeWhitespace;
      cursor = this.editor.getLastCursor();
      return _.times(count, (function(_this) {
        return function() {
          var current, next;
          current = cursor.getBufferPosition();
          next = cursor.getBeginningOfNextWordBufferPosition();
          if (current.row !== next.row || excludeWhitespace || current === next) {
            _this.editor.selectToEndOfWord();
          } else {
            _this.editor.selectToBeginningOfNextWord();
          }
          return true;
        };
      })(this));
    };

    MoveToNextWord.prototype.isEndOfFile = function() {
      var cur, eof;
      cur = this.editor.getLastCursor().getBufferPosition();
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

    MoveToNextWholeWord.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          var _results;
          _this.editor.moveToBeginningOfNextWord();
          _results = [];
          while (!_this.isWholeWord() && !_this.isEndOfFile()) {
            _results.push(_this.editor.moveToBeginningOfNextWord());
          }
          return _results;
        };
      })(this));
    };

    MoveToNextWholeWord.prototype.select = function(count, _arg) {
      var cursor, excludeWhitespace;
      if (count == null) {
        count = 1;
      }
      excludeWhitespace = (_arg != null ? _arg : {}).excludeWhitespace;
      cursor = this.editor.getLastCursor();
      return _.times(count, (function(_this) {
        return function() {
          var current, next;
          current = cursor.getBufferPosition();
          next = cursor.getBeginningOfNextWordBufferPosition(/[^\s]/);
          if (current.row !== next.row || excludeWhitespace) {
            _this.editor.selectToEndOfWord();
          } else {
            _this.editor.selectToBeginningOfNextWord();
            while (!_this.isWholeWord() && !_this.isEndOfFile()) {
              _this.editor.selectToBeginningOfNextWord();
            }
          }
          return true;
        };
      })(this));
    };

    MoveToNextWholeWord.prototype.isWholeWord = function() {
      var char;
      char = this.editor.getLastCursor().getCurrentWordPrefix().slice(-1);
      return char === ' ' || char === '\n';
    };

    MoveToNextWholeWord.prototype.isEndOfFile = function() {
      var cur, last;
      last = this.editor.getEofBufferPosition();
      cur = this.editor.getCursorBufferPosition();
      return last.row === cur.row && last.column === cur.column;
    };

    return MoveToNextWholeWord;

  })(Motion);

  MoveToEndOfWord = (function(_super) {
    __extends(MoveToEndOfWord, _super);

    function MoveToEndOfWord() {
      return MoveToEndOfWord.__super__.constructor.apply(this, arguments);
    }

    MoveToEndOfWord.prototype.execute = function(count) {
      var cursor;
      if (count == null) {
        count = 1;
      }
      cursor = this.editor.getLastCursor();
      return _.times(count, (function(_this) {
        return function() {
          return cursor.setBufferPosition(_this.nextBufferPosition({
            exclusive: true
          }));
        };
      })(this));
    };

    MoveToEndOfWord.prototype.select = function(count) {
      var cursor;
      if (count == null) {
        count = 1;
      }
      cursor = this.editor.getLastCursor();
      return _.times(count, (function(_this) {
        return function() {
          var bufferPosition, screenPosition;
          bufferPosition = _this.nextBufferPosition();
          screenPosition = _this.editor.screenPositionForBufferPosition(bufferPosition);
          _this.editor.selectToScreenPosition(screenPosition);
          return true;
        };
      })(this));
    };

    MoveToEndOfWord.prototype.nextBufferPosition = function(_arg) {
      var current, cursor, exclusive, next;
      exclusive = (_arg != null ? _arg : {}).exclusive;
      cursor = this.editor.getLastCursor();
      current = cursor.getBufferPosition();
      next = cursor.getEndOfCurrentWordBufferPosition();
      if (exclusive) {
        next.column -= 1;
      }
      if (exclusive && current.row === next.row && current.column === next.column) {
        cursor.moveRight();
        next = cursor.getEndOfCurrentWordBufferPosition();
        next.column -= 1;
      }
      return next;
    };

    return MoveToEndOfWord;

  })(Motion);

  MoveToEndOfWholeWord = (function(_super) {
    __extends(MoveToEndOfWholeWord, _super);

    function MoveToEndOfWholeWord() {
      return MoveToEndOfWholeWord.__super__.constructor.apply(this, arguments);
    }

    MoveToEndOfWholeWord.prototype.execute = function(count) {
      var cursor;
      if (count == null) {
        count = 1;
      }
      cursor = this.editor.getLastCursor();
      return _.times(count, (function(_this) {
        return function() {
          return cursor.setBufferPosition(_this.nextBufferPosition({
            exclusive: true
          }));
        };
      })(this));
    };

    MoveToEndOfWholeWord.prototype.select = function(count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          var bufferPosition, screenPosition;
          bufferPosition = _this.nextBufferPosition();
          screenPosition = _this.editor.screenPositionForBufferPosition(bufferPosition);
          _this.editor.selectToScreenPosition(screenPosition);
          return true;
        };
      })(this));
    };

    MoveToEndOfWholeWord.prototype.nextBufferPosition = function(_arg) {
      var column, exclusive, position, row, scanRange, start, _ref1;
      exclusive = (_arg != null ? _arg : {}).exclusive;
      _ref1 = this.editor.getCursorBufferPosition(), row = _ref1.row, column = _ref1.column;
      start = new Point(row, column + 1);
      scanRange = [start, this.editor.getEofBufferPosition()];
      position = this.editor.getEofBufferPosition();
      this.editor.scanInBufferRange(/\S+/, scanRange, (function(_this) {
        return function(_arg1) {
          var range, stop;
          range = _arg1.range, stop = _arg1.stop;
          position = range.end;
          return stop();
        };
      })(this));
      if (exclusive) {
        position.column -= 1;
      }
      return position;
    };

    return MoveToEndOfWholeWord;

  })(Motion);

  MoveToNextParagraph = (function(_super) {
    __extends(MoveToNextParagraph, _super);

    function MoveToNextParagraph() {
      return MoveToNextParagraph.__super__.constructor.apply(this, arguments);
    }

    MoveToNextParagraph.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          return _this.editor.setCursorScreenPosition(_this.nextPosition());
        };
      })(this));
    };

    MoveToNextParagraph.prototype.select = function(count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          _this.editor.selectToScreenPosition(_this.nextPosition());
          return true;
        };
      })(this));
    };

    MoveToNextParagraph.prototype.nextPosition = function() {
      var column, position, row, scanRange, start, _ref1;
      start = this.editor.getCursorBufferPosition();
      scanRange = [start, this.editor.getEofBufferPosition()];
      _ref1 = this.editor.getEofBufferPosition(), row = _ref1.row, column = _ref1.column;
      position = new Point(row, column - 1);
      this.editor.scanInBufferRange(/^\n*$/g, scanRange, (function(_this) {
        return function(_arg) {
          var range, stop;
          range = _arg.range, stop = _arg.stop;
          if (!range.start.isEqual(start)) {
            position = range.start;
            return stop();
          }
        };
      })(this));
      return this.editor.screenPositionForBufferPosition(position);
    };

    return MoveToNextParagraph;

  })(Motion);

  MoveToPreviousParagraph = (function(_super) {
    __extends(MoveToPreviousParagraph, _super);

    function MoveToPreviousParagraph() {
      return MoveToPreviousParagraph.__super__.constructor.apply(this, arguments);
    }

    MoveToPreviousParagraph.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          return _this.editor.setCursorScreenPosition(_this.previousPosition());
        };
      })(this));
    };

    MoveToPreviousParagraph.prototype.select = function(count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          _this.editor.selectToScreenPosition(_this.previousPosition());
          return true;
        };
      })(this));
    };

    MoveToPreviousParagraph.prototype.previousPosition = function() {
      var column, position, row, scanRange, start;
      start = this.editor.getCursorBufferPosition();
      row = start.row, column = start.column;
      scanRange = [[row - 1, column], [0, 0]];
      position = new Point(0, 0);
      this.editor.backwardsScanInBufferRange(/^\n*$/g, scanRange, (function(_this) {
        return function(_arg) {
          var range, stop;
          range = _arg.range, stop = _arg.stop;
          if (!range.start.isEqual(new Point(0, 0))) {
            position = range.start;
            return stop();
          }
        };
      })(this));
      return this.editor.screenPositionForBufferPosition(position);
    };

    return MoveToPreviousParagraph;

  })(Motion);

  MoveToLine = (function(_super) {
    __extends(MoveToLine, _super);

    function MoveToLine() {
      this.selectRows = __bind(this.selectRows, this);
      return MoveToLine.__super__.constructor.apply(this, arguments);
    }

    MoveToLine.prototype.isLinewise = function() {
      return true;
    };

    MoveToLine.prototype.execute = function(count) {
      this.setCursorPosition(count);
      return this.editor.getLastCursor().skipLeadingWhitespace();
    };

    MoveToLine.prototype.select = function(count, _arg) {
      var column, end, requireEOL, row, start, _ref1;
      if (count == null) {
        count = this.editor.getLineCount();
      }
      requireEOL = (_arg != null ? _arg : {}).requireEOL;
      _ref1 = this.editor.getCursorBufferPosition(), row = _ref1.row, column = _ref1.column;
      if (row >= count) {
        start = count - 1;
        end = row;
      } else {
        start = row;
        end = count - 1;
      }
      this.editor.setSelectedBufferRange(this.selectRows(start, end, {
        requireEOL: requireEOL
      }));
      return _.times(count, function() {
        return true;
      });
    };

    MoveToLine.prototype.selectRows = function(start, end, _arg) {
      var buffer, endPoint, requireEOL, startPoint;
      requireEOL = (_arg != null ? _arg : {}).requireEOL;
      startPoint = null;
      endPoint = null;
      buffer = this.editor.getBuffer();
      if (end >= buffer.getLastRow()) {
        end = buffer.getLastRow();
        if (start > 0 && requireEOL && start === end) {
          startPoint = [start - 1, buffer.lineLengthForRow(start - 1)];
        } else {
          startPoint = [start, 0];
        }
        endPoint = [end, buffer.lineLengthForRow(end)];
      } else {
        startPoint = [start, 0];
        endPoint = [end + 1, 0];
      }
      return new Range(startPoint, endPoint);
    };

    MoveToLine.prototype.setCursorPosition = function(count) {
      return this.editor.setCursorBufferPosition([this.getDestinationRow(count), 0]);
    };

    MoveToLine.prototype.getDestinationRow = function(count) {
      if (count != null) {
        return count - 1;
      } else {
        return this.editor.getLineCount() - 1;
      }
    };

    return MoveToLine;

  })(Motion);

  MoveToRelativeLine = (function(_super) {
    __extends(MoveToRelativeLine, _super);

    function MoveToRelativeLine() {
      return MoveToRelativeLine.__super__.constructor.apply(this, arguments);
    }

    MoveToRelativeLine.prototype.select = function(count, _arg) {
      var column, requireEOL, row, _ref1;
      if (count == null) {
        count = 1;
      }
      requireEOL = (_arg != null ? _arg : {}).requireEOL;
      _ref1 = this.editor.getCursorBufferPosition(), row = _ref1.row, column = _ref1.column;
      this.editor.setSelectedBufferRange(this.selectRows(row, row + (count - 1), {
        requireEOL: requireEOL
      }));
      return _.times(count, function() {
        return true;
      });
    };

    return MoveToRelativeLine;

  })(MoveToLine);

  MoveToScreenLine = (function(_super) {
    __extends(MoveToScreenLine, _super);

    function MoveToScreenLine(editor, vimState, editorView, scrolloff) {
      this.editor = editor;
      this.vimState = vimState;
      this.editorView = editorView;
      this.scrolloff = scrolloff;
      this.scrolloff = 2;
      MoveToScreenLine.__super__.constructor.call(this, this.editor, this.vimState);
    }

    MoveToScreenLine.prototype.setCursorPosition = function(count) {
      return this.editor.setCursorScreenPosition([this.getDestinationRow(count), 0]);
    };

    return MoveToScreenLine;

  })(MoveToLine);

  MoveToBeginningOfLine = (function(_super) {
    __extends(MoveToBeginningOfLine, _super);

    function MoveToBeginningOfLine() {
      return MoveToBeginningOfLine.__super__.constructor.apply(this, arguments);
    }

    MoveToBeginningOfLine.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      return this.editor.moveToBeginningOfLine();
    };

    MoveToBeginningOfLine.prototype.select = function(count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          _this.editor.selectToBeginningOfLine();
          return true;
        };
      })(this));
    };

    return MoveToBeginningOfLine;

  })(Motion);

  MoveToFirstCharacterOfLine = (function(_super) {
    __extends(MoveToFirstCharacterOfLine, _super);

    function MoveToFirstCharacterOfLine(editor, vimState) {
      this.editor = editor;
      this.vimState = vimState;
      this.cursor = this.editor.getLastCursor();
      MoveToFirstCharacterOfLine.__super__.constructor.call(this, this.editor, this.vimState);
    }

    MoveToFirstCharacterOfLine.prototype.execute = function() {
      return this.editor.setCursorBufferPosition([this.cursor.getBufferRow(), this.getDestinationColumn()]);
    };

    MoveToFirstCharacterOfLine.prototype.select = function(count) {
      if (count == null) {
        count = 1;
      }
      if (this.getDestinationColumn() !== this.cursor.getBufferColumn()) {
        return _.times(count, (function(_this) {
          return function() {
            _this.editor.selectToFirstCharacterOfLine();
            return true;
          };
        })(this));
      }
    };

    MoveToFirstCharacterOfLine.prototype.getDestinationColumn = function() {
      return this.editor.lineTextForBufferRow(this.cursor.getBufferRow()).search(/\S/);
    };

    return MoveToFirstCharacterOfLine;

  })(Motion);

  MoveToLastCharacterOfLine = (function(_super) {
    __extends(MoveToLastCharacterOfLine, _super);

    function MoveToLastCharacterOfLine() {
      return MoveToLastCharacterOfLine.__super__.constructor.apply(this, arguments);
    }

    MoveToLastCharacterOfLine.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      this.vimState.desiredCursorColumn = Infinity;
      return _.times(count, (function(_this) {
        return function() {
          _this.editor.moveToEndOfLine();
          if (_this.editor.getLastCursor().getBufferColumn() !== 0) {
            return _this.editor.moveLeft();
          }
        };
      })(this));
    };

    MoveToLastCharacterOfLine.prototype.select = function(count) {
      if (count == null) {
        count = 1;
      }
      return _.times(count, (function(_this) {
        return function() {
          _this.editor.selectToEndOfLine();
          return true;
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

    MoveToFirstCharacterOfLineUp.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      (new MoveUp(this.editor, this.vimState)).execute(count);
      return (new MoveToFirstCharacterOfLine(this.editor, this.vimState)).execute();
    };

    MoveToFirstCharacterOfLineUp.prototype.select = function(count) {
      if (count == null) {
        count = 1;
      }
      return (new MoveUp(this.editor, this.vimState)).select(count);
    };

    return MoveToFirstCharacterOfLineUp;

  })(Motion);

  MoveToFirstCharacterOfLineDown = (function(_super) {
    __extends(MoveToFirstCharacterOfLineDown, _super);

    function MoveToFirstCharacterOfLineDown() {
      return MoveToFirstCharacterOfLineDown.__super__.constructor.apply(this, arguments);
    }

    MoveToFirstCharacterOfLineDown.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      (new MoveDown(this.editor, this.vimState)).execute(count);
      return (new MoveToFirstCharacterOfLine(this.editor, this.vimState)).execute();
    };

    MoveToFirstCharacterOfLineDown.prototype.select = function(count) {
      if (count == null) {
        count = 1;
      }
      return (new MoveDown(this.editor, this.vimState)).select(count);
    };

    return MoveToFirstCharacterOfLineDown;

  })(Motion);

  MoveToStartOfFile = (function(_super) {
    __extends(MoveToStartOfFile, _super);

    function MoveToStartOfFile() {
      return MoveToStartOfFile.__super__.constructor.apply(this, arguments);
    }

    MoveToStartOfFile.prototype.isLinewise = function() {
      return this.vimState.mode === 'visual' && this.vimState.submode === 'linewise';
    };

    MoveToStartOfFile.prototype.getDestinationRow = function(count) {
      if (count == null) {
        count = 1;
      }
      return count - 1;
    };

    MoveToStartOfFile.prototype.getDestinationColumn = function(row) {
      if (this.isLinewise()) {
        return 0;
      } else {
        return this.editor.lineTextForBufferRow(row).search(/\S/);
      }
    };

    MoveToStartOfFile.prototype.getStartingColumn = function(column) {
      if (this.isLinewise()) {
        return column;
      } else {
        return column + 1;
      }
    };

    MoveToStartOfFile.prototype.select = function(count) {
      var bufferRange, column, destinationCol, destinationRow, row, startingCol, _ref1;
      if (count == null) {
        count = 1;
      }
      _ref1 = this.editor.getCursorBufferPosition(), row = _ref1.row, column = _ref1.column;
      startingCol = this.getStartingColumn(column);
      destinationRow = this.getDestinationRow(count);
      destinationCol = this.getDestinationColumn(destinationRow);
      bufferRange = new Range([row, startingCol], [destinationRow, destinationCol]);
      return this.editor.setSelectedBufferRange(bufferRange, {
        reversed: true
      });
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
      firstScreenRow = this.editorView.getFirstVisibleScreenRow();
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
      lastScreenRow = this.editorView.getLastVisibleScreenRow();
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
      firstScreenRow = this.editorView.getFirstVisibleScreenRow();
      lastScreenRow = this.editorView.getLastVisibleScreenRow();
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
    MoveToLine: MoveToLine,
    MoveToRelativeLine: MoveToRelativeLine,
    MoveToBeginningOfLine: MoveToBeginningOfLine,
    MoveToFirstCharacterOfLineUp: MoveToFirstCharacterOfLineUp,
    MoveToFirstCharacterOfLineDown: MoveToFirstCharacterOfLineDown,
    MoveToFirstCharacterOfLine: MoveToFirstCharacterOfLine,
    MoveToLastCharacterOfLine: MoveToLastCharacterOfLine,
    MoveToStartOfFile: MoveToStartOfFile,
    MoveToTopOfScreen: MoveToTopOfScreen,
    MoveToBottomOfScreen: MoveToBottomOfScreen,
    MoveToMiddleOfScreen: MoveToMiddleOfScreen,
    MoveToEndOfWholeWord: MoveToEndOfWholeWord,
    MotionError: MotionError
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLCtqQkFBQTtJQUFBOztzRkFBQTs7QUFBQSxFQUFBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVIsQ0FBSixDQUFBOztBQUFBLEVBQ0EsT0FBcUIsT0FBQSxDQUFRLE1BQVIsQ0FBckIsRUFBQyxVQUFBLEVBQUQsRUFBSyxhQUFBLEtBQUwsRUFBWSxhQUFBLEtBRFosQ0FBQTs7QUFBQSxFQUdNO0FBQ1MsSUFBQSxxQkFBRSxPQUFGLEdBQUE7QUFDWCxNQURZLElBQUMsQ0FBQSxVQUFBLE9BQ2IsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLElBQUQsR0FBUSxjQUFSLENBRFc7SUFBQSxDQUFiOzt1QkFBQTs7TUFKRixDQUFBOztBQUFBLEVBT007QUFDUyxJQUFBLGdCQUFFLE1BQUYsRUFBVyxRQUFYLEdBQUE7QUFDWCxNQURZLElBQUMsQ0FBQSxTQUFBLE1BQ2IsQ0FBQTtBQUFBLE1BRHFCLElBQUMsQ0FBQSxXQUFBLFFBQ3RCLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxRQUFRLENBQUMsbUJBQVYsR0FBZ0MsSUFBaEMsQ0FEVztJQUFBLENBQWI7O0FBQUEscUJBR0EsVUFBQSxHQUFZLFNBQUEsR0FBQTthQUFHLEtBQUg7SUFBQSxDQUhaLENBQUE7O0FBQUEscUJBSUEsWUFBQSxHQUFjLFNBQUEsR0FBQTthQUFHLE1BQUg7SUFBQSxDQUpkLENBQUE7O0FBQUEscUJBS0EsWUFBQSxHQUFjLFNBQUEsR0FBQTthQUFHLElBQUMsQ0FBQSxRQUFRLENBQUMsSUFBVixLQUFrQixTQUFyQjtJQUFBLENBTGQsQ0FBQTs7a0JBQUE7O01BUkYsQ0FBQTs7QUFBQSxFQWVNO0FBQ0osdUNBQUEsQ0FBQTs7QUFBYSxJQUFBLDBCQUFFLE1BQUYsRUFBVyxRQUFYLEdBQUE7QUFDWCxNQURZLElBQUMs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
//# sourceURL=/Users/ah/.atom/packages/vim-mode/lib/motions/general-motions.coffee