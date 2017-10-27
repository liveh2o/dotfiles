(function() {
  var Change, Delete, Insert, InsertAboveWithNewline, InsertAfter, InsertAfterEndOfLine, InsertAtBeginningOfLine, InsertBelowWithNewline, Motions, Operator, ReplaceMode, TransactionBundler, settings, _, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Motions = require('../motions/index');

  _ref = require('./general-operators'), Operator = _ref.Operator, Delete = _ref.Delete;

  _ = require('underscore-plus');

  settings = require('../settings');

  Insert = (function(_super) {
    __extends(Insert, _super);

    function Insert() {
      return Insert.__super__.constructor.apply(this, arguments);
    }

    Insert.prototype.standalone = true;

    Insert.prototype.isComplete = function() {
      return this.standalone || Insert.__super__.isComplete.apply(this, arguments);
    };

    Insert.prototype.confirmChanges = function(changes) {
      var bundler;
      bundler = new TransactionBundler(changes, this.editor);
      return this.typedText = bundler.buildInsertText();
    };

    Insert.prototype.execute = function() {
      var cursor, _i, _len, _ref1;
      if (this.typingCompleted) {
        if (!((this.typedText != null) && this.typedText.length > 0)) {
          return;
        }
        this.editor.insertText(this.typedText, {
          normalizeLineEndings: true,
          autoIndent: true
        });
        _ref1 = this.editor.getCursors();
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          cursor = _ref1[_i];
          if (!cursor.isAtBeginningOfLine()) {
            cursor.moveLeft();
          }
        }
      } else {
        this.vimState.activateInsertMode();
        this.typingCompleted = true;
      }
    };

    Insert.prototype.inputOperator = function() {
      return true;
    };

    return Insert;

  })(Operator);

  ReplaceMode = (function(_super) {
    __extends(ReplaceMode, _super);

    function ReplaceMode() {
      return ReplaceMode.__super__.constructor.apply(this, arguments);
    }

    ReplaceMode.prototype.execute = function() {
      if (this.typingCompleted) {
        if (!((this.typedText != null) && this.typedText.length > 0)) {
          return;
        }
        return this.editor.transact((function(_this) {
          return function() {
            var count, cursor, selection, toDelete, _i, _j, _len, _len1, _ref1, _ref2, _results;
            _this.editor.insertText(_this.typedText, {
              normalizeLineEndings: true
            });
            toDelete = _this.typedText.length - _this.countChars('\n', _this.typedText);
            _ref1 = _this.editor.getSelections();
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
              selection = _ref1[_i];
              count = toDelete;
              while (count-- && !selection.cursor.isAtEndOfLine()) {
                selection["delete"]();
              }
            }
            _ref2 = _this.editor.getCursors();
            _results = [];
            for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
              cursor = _ref2[_j];
              if (!cursor.isAtBeginningOfLine()) {
                _results.push(cursor.moveLeft());
              } else {
                _results.push(void 0);
              }
            }
            return _results;
          };
        })(this));
      } else {
        this.vimState.activateReplaceMode();
        return this.typingCompleted = true;
      }
    };

    ReplaceMode.prototype.countChars = function(char, string) {
      return string.split(char).length - 1;
    };

    return ReplaceMode;

  })(Insert);

  InsertAfter = (function(_super) {
    __extends(InsertAfter, _super);

    function InsertAfter() {
      return InsertAfter.__super__.constructor.apply(this, arguments);
    }

    InsertAfter.prototype.execute = function() {
      if (!this.editor.getLastCursor().isAtEndOfLine()) {
        this.editor.moveRight();
      }
      return InsertAfter.__super__.execute.apply(this, arguments);
    };

    return InsertAfter;

  })(Insert);

  InsertAfterEndOfLine = (function(_super) {
    __extends(InsertAfterEndOfLine, _super);

    function InsertAfterEndOfLine() {
      return InsertAfterEndOfLine.__super__.constructor.apply(this, arguments);
    }

    InsertAfterEndOfLine.prototype.execute = function() {
      this.editor.moveToEndOfLine();
      return InsertAfterEndOfLine.__super__.execute.apply(this, arguments);
    };

    return InsertAfterEndOfLine;

  })(Insert);

  InsertAtBeginningOfLine = (function(_super) {
    __extends(InsertAtBeginningOfLine, _super);

    function InsertAtBeginningOfLine() {
      return InsertAtBeginningOfLine.__super__.constructor.apply(this, arguments);
    }

    InsertAtBeginningOfLine.prototype.execute = function() {
      this.editor.moveToBeginningOfLine();
      this.editor.moveToFirstCharacterOfLine();
      return InsertAtBeginningOfLine.__super__.execute.apply(this, arguments);
    };

    return InsertAtBeginningOfLine;

  })(Insert);

  InsertAboveWithNewline = (function(_super) {
    __extends(InsertAboveWithNewline, _super);

    function InsertAboveWithNewline() {
      return InsertAboveWithNewline.__super__.constructor.apply(this, arguments);
    }

    InsertAboveWithNewline.prototype.execute = function() {
      if (!this.typingCompleted) {
        this.vimState.setInsertionCheckpoint();
      }
      this.editor.insertNewlineAbove();
      this.editor.getLastCursor().skipLeadingWhitespace();
      if (this.typingCompleted) {
        this.typedText = this.typedText.trimLeft();
        return InsertAboveWithNewline.__super__.execute.apply(this, arguments);
      }
      this.vimState.activateInsertMode();
      return this.typingCompleted = true;
    };

    return InsertAboveWithNewline;

  })(Insert);

  InsertBelowWithNewline = (function(_super) {
    __extends(InsertBelowWithNewline, _super);

    function InsertBelowWithNewline() {
      return InsertBelowWithNewline.__super__.constructor.apply(this, arguments);
    }

    InsertBelowWithNewline.prototype.execute = function() {
      if (!this.typingCompleted) {
        this.vimState.setInsertionCheckpoint();
      }
      this.editor.insertNewlineBelow();
      this.editor.getLastCursor().skipLeadingWhitespace();
      if (this.typingCompleted) {
        this.typedText = this.typedText.trimLeft();
        return InsertBelowWithNewline.__super__.execute.apply(this, arguments);
      }
      this.vimState.activateInsertMode();
      return this.typingCompleted = true;
    };

    return InsertBelowWithNewline;

  })(Insert);

  Change = (function(_super) {
    __extends(Change, _super);

    Change.prototype.standalone = false;

    Change.prototype.register = null;

    function Change(editor, vimState) {
      this.editor = editor;
      this.vimState = vimState;
      this.register = settings.defaultRegister();
    }

    Change.prototype.execute = function(count) {
      var selection, _base, _i, _j, _len, _len1, _ref1, _ref2;
      if (_.contains(this.motion.select(count, {
        excludeWhitespace: true
      }), true)) {
        if (!this.typingCompleted) {
          this.vimState.setInsertionCheckpoint();
        }
        this.setTextRegister(this.register, this.editor.getSelectedText());
        if ((typeof (_base = this.motion).isLinewise === "function" ? _base.isLinewise() : void 0) && !this.typingCompleted) {
          _ref1 = this.editor.getSelections();
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            selection = _ref1[_i];
            if (selection.getBufferRange().end.row === 0) {
              selection.deleteSelectedText();
            } else {
              selection.insertText("\n", {
                autoIndent: true
              });
            }
            selection.cursor.moveLeft();
          }
        } else {
          _ref2 = this.editor.getSelections();
          for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
            selection = _ref2[_j];
            selection.deleteSelectedText();
          }
        }
        if (this.typingCompleted) {
          return Change.__super__.execute.apply(this, arguments);
        }
        this.vimState.activateInsertMode();
        return this.typingCompleted = true;
      } else {
        return this.vimState.activateNormalMode();
      }
    };

    return Change;

  })(Insert);

  TransactionBundler = (function() {
    function TransactionBundler(changes, editor) {
      this.changes = changes;
      this.editor = editor;
      this.start = null;
      this.end = null;
    }

    TransactionBundler.prototype.buildInsertText = function() {
      var change, _i, _len, _ref1;
      _ref1 = this.changes;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        change = _ref1[_i];
        this.addChange(change);
      }
      if (this.start != null) {
        return this.editor.getTextInBufferRange([this.start, this.end]);
      } else {
        return "";
      }
    };

    TransactionBundler.prototype.addChange = function(change) {
      if (change.newRange == null) {
        return;
      }
      if (this.isRemovingFromPrevious(change)) {
        this.subtractRange(change.oldRange);
      }
      if (this.isAddingWithinPrevious(change)) {
        return this.addRange(change.newRange);
      }
    };

    TransactionBundler.prototype.isAddingWithinPrevious = function(change) {
      if (!this.isAdding(change)) {
        return false;
      }
      if (this.start === null) {
        return true;
      }
      return this.start.isLessThanOrEqual(change.newRange.start) && this.end.isGreaterThanOrEqual(change.newRange.start);
    };

    TransactionBundler.prototype.isRemovingFromPrevious = function(change) {
      if (!(this.isRemoving(change) && (this.start != null))) {
        return false;
      }
      return this.start.isLessThanOrEqual(change.oldRange.start) && this.end.isGreaterThanOrEqual(change.oldRange.end);
    };

    TransactionBundler.prototype.isAdding = function(change) {
      return change.newText.length > 0;
    };

    TransactionBundler.prototype.isRemoving = function(change) {
      return change.oldText.length > 0;
    };

    TransactionBundler.prototype.addRange = function(range) {
      var cols, rows;
      if (this.start === null) {
        this.start = range.start, this.end = range.end;
        return;
      }
      rows = range.end.row - range.start.row;
      if (range.start.row === this.end.row) {
        cols = range.end.column - range.start.column;
      } else {
        cols = 0;
      }
      return this.end = this.end.translate([rows, cols]);
    };

    TransactionBundler.prototype.subtractRange = function(range) {
      var cols, rows;
      rows = range.end.row - range.start.row;
      if (range.end.row === this.end.row) {
        cols = range.end.column - range.start.column;
      } else {
        cols = 0;
      }
      return this.end = this.end.translate([-rows, -cols]);
    };

    return TransactionBundler;

  })();

  module.exports = {
    Insert: Insert,
    InsertAfter: InsertAfter,
    InsertAfterEndOfLine: InsertAfterEndOfLine,
    InsertAtBeginningOfLine: InsertAtBeginningOfLine,
    InsertAboveWithNewline: InsertAboveWithNewline,
    InsertBelowWithNewline: InsertBelowWithNewline,
    ReplaceMode: ReplaceMode,
    Change: Change
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3ZpbS1tb2RlL2xpYi9vcGVyYXRvcnMvaW5wdXQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHlNQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxPQUFBLEdBQVUsT0FBQSxDQUFRLGtCQUFSLENBQVYsQ0FBQTs7QUFBQSxFQUNBLE9BQXFCLE9BQUEsQ0FBUSxxQkFBUixDQUFyQixFQUFDLGdCQUFBLFFBQUQsRUFBVyxjQUFBLE1BRFgsQ0FBQTs7QUFBQSxFQUVBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVIsQ0FGSixDQUFBOztBQUFBLEVBR0EsUUFBQSxHQUFXLE9BQUEsQ0FBUSxhQUFSLENBSFgsQ0FBQTs7QUFBQSxFQVNNO0FBQ0osNkJBQUEsQ0FBQTs7OztLQUFBOztBQUFBLHFCQUFBLFVBQUEsR0FBWSxJQUFaLENBQUE7O0FBQUEscUJBRUEsVUFBQSxHQUFZLFNBQUEsR0FBQTthQUFHLElBQUMsQ0FBQSxVQUFELElBQWUsd0NBQUEsU0FBQSxFQUFsQjtJQUFBLENBRlosQ0FBQTs7QUFBQSxxQkFJQSxjQUFBLEdBQWdCLFNBQUMsT0FBRCxHQUFBO0FBQ2QsVUFBQSxPQUFBO0FBQUEsTUFBQSxPQUFBLEdBQWMsSUFBQSxrQkFBQSxDQUFtQixPQUFuQixFQUE0QixJQUFDLENBQUEsTUFBN0IsQ0FBZCxDQUFBO2FBQ0EsSUFBQyxDQUFBLFNBQUQsR0FBYSxPQUFPLENBQUMsZUFBUixDQUFBLEVBRkM7SUFBQSxDQUpoQixDQUFBOztBQUFBLHFCQVFBLE9BQUEsR0FBUyxTQUFBLEdBQUE7QUFDUCxVQUFBLHVCQUFBO0FBQUEsTUFBQSxJQUFHLElBQUMsQ0FBQSxlQUFKO0FBQ0UsUUFBQSxJQUFBLENBQUEsQ0FBYyx3QkFBQSxJQUFnQixJQUFDLENBQUEsU0FBUyxDQUFD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

//# sourceURL=/Users/ah/.atom/packages/vim-mode/lib/operators/input.coffee
