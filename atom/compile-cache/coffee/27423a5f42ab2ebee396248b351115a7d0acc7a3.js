(function() {
  var $$, CurrentSelection, Motion, MotionError, MotionWithInput, MoveDown, MoveLeft, MoveRight, MoveToBeginningOfLine, MoveToBottomOfScreen, MoveToEndOfWholeWord, MoveToEndOfWord, MoveToFirstCharacterOfLine, MoveToFirstCharacterOfLineDown, MoveToFirstCharacterOfLineUp, MoveToLastCharacterOfLine, MoveToLine, MoveToMiddleOfScreen, MoveToNextParagraph, MoveToNextWholeWord, MoveToNextWord, MoveToPreviousParagraph, MoveToPreviousWholeWord, MoveToPreviousWord, MoveToScreenLine, MoveToStartOfFile, MoveToTopOfScreen, MoveUp, MoveVertically, Point, Range, _, _ref,
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

    function CurrentSelection() {
      return CurrentSelection.__super__.constructor.apply(this, arguments);
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
            return _this.editor.moveCursorLeft();
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
          if (column < _this.editor.lineLengthForBufferRow(row) - 1) {
            return _this.editor.moveCursorRight();
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
          rowLength = _this.editor.getCursor().getCurrentBufferLine().length;
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
        nextLineLength = this.editor.lineLengthForBufferRow(nextRow);
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
        this.editor.moveCursorToBeginningOfLine();
        this.editor.moveCursorDown();
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
        this.editor.selectLine();
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
          return _this.editor.moveCursorToBeginningOfWord();
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
          _this.editor.moveCursorToBeginningOfWord();
          _results = [];
          while (!_this.isWholeWord() && !_this.isBeginningOfFile()) {
            _results.push(_this.editor.moveCursorToBeginningOfWord());
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
      char = this.editor.getCursor().getCurrentWordPrefix().slice(-1);
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
      cursor = this.editor.getCursor();
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
      cursor = this.editor.getCursor();
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
      cur = this.editor.getCursor().getBufferPosition();
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
          _this.editor.moveCursorToBeginningOfNextWord();
          _results = [];
          while (!_this.isWholeWord() && !_this.isEndOfFile()) {
            _results.push(_this.editor.moveCursorToBeginningOfNextWord());
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
      cursor = this.editor.getCursor();
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
      char = this.editor.getCursor().getCurrentWordPrefix().slice(-1);
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
      cursor = this.editor.getCursor();
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
      cursor = this.editor.getCursor();
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
      cursor = this.editor.getCursor();
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
      cursor = this.editor.getCursor();
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
      return this.editor.getCursor().skipLeadingWhitespace();
    };

    MoveToLine.prototype.select = function(count, _arg) {
      var column, requireEOL, row, _ref1;
      if (count == null) {
        count = this.editor.getLineCount();
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

    MoveToLine.prototype.selectRows = function(start, end, _arg) {
      var buffer, endPoint, requireEOL, startPoint;
      requireEOL = (_arg != null ? _arg : {}).requireEOL;
      startPoint = null;
      endPoint = null;
      buffer = this.editor.getBuffer();
      if (end === buffer.getLastRow()) {
        if (start > 0 && requireEOL) {
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
      return this.editor.moveCursorToBeginningOfLine();
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
      this.cursor = this.editor.getCursor();
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
      return this.editor.lineForBufferRow(this.cursor.getBufferRow()).search(/\S/);
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
          _this.editor.moveCursorToEndOfLine();
          if (_this.editor.getCursor().getBufferColumn() !== 0) {
            return _this.editor.moveCursorLeft();
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
        return this.editor.lineForBufferRow(row).search(/\S/);
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDJpQkFBQTtJQUFBOztzRkFBQTs7QUFBQSxFQUFBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVIsQ0FBSixDQUFBOztBQUFBLEVBQ0EsT0FBcUIsT0FBQSxDQUFRLE1BQVIsQ0FBckIsRUFBQyxVQUFBLEVBQUQsRUFBSyxhQUFBLEtBQUwsRUFBWSxhQUFBLEtBRFosQ0FBQTs7QUFBQSxFQUdNO0FBQ1MsSUFBQSxxQkFBRSxPQUFGLEdBQUE7QUFDWCxNQURZLElBQUMsQ0FBQSxVQUFBLE9BQ2IsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLElBQUQsR0FBUSxjQUFSLENBRFc7SUFBQSxDQUFiOzt1QkFBQTs7TUFKRixDQUFBOztBQUFBLEVBT007QUFDUyxJQUFBLGdCQUFFLE1BQUYsRUFBVyxRQUFYLEdBQUE7QUFDWCxNQURZLElBQUMsQ0FBQSxTQUFBLE1BQ2IsQ0FBQTtBQUFBLE1BRHFCLElBQUMsQ0FBQSxXQUFBLFFBQ3RCLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxRQUFRLENBQUMsbUJBQVYsR0FBZ0MsSUFBaEMsQ0FEVztJQUFBLENBQWI7O0FBQUEscUJBR0EsVUFBQSxHQUFZLFNBQUEsR0FBQTthQUFHLEtBQUg7SUFBQSxDQUhaLENBQUE7O0FBQUEscUJBSUEsWUFBQSxHQUFjLFNBQUEsR0FBQTthQUFHLE1BQUg7SUFBQSxDQUpkLENBQUE7O0FBQUEscUJBS0EsWUFBQSxHQUFjLFNBQUEsR0FBQTthQUFHLElBQUMsQ0FBQSxRQUFRLENBQUMsSUFBVixLQUFrQixTQUFyQjtJQUFBLENBTGQsQ0FBQTs7a0JBQUE7O01BUkYsQ0FBQTs7QUFBQSxFQWVNO0FBQ0osdUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLCtCQUFBLE9BQUEsR0FBUyxTQUFDLEtBQUQsR0FBQTs7UUFBQyxR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
//# sourceURL=/Users/ah/.atom/packages/vim-mode/lib/motions/general-motions.coffee