(function() {
  var Change, Delete, Insert, InsertAboveWithNewline, InsertAfter, InsertAfterEndOfLine, InsertAtBeginningOfLine, InsertBelowWithNewline, Motions, Operator, ReplaceMode, settings, _, _ref,
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
      if (changes.length > 0) {
        return this.typedText = changes[0].newText;
      } else {
        return this.typedText = "";
      }
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3ZpbS1tb2RlL2xpYi9vcGVyYXRvcnMvaW5wdXQuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHFMQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxPQUFBLEdBQVUsT0FBQSxDQUFRLGtCQUFSLENBQVYsQ0FBQTs7QUFBQSxFQUNBLE9BQXFCLE9BQUEsQ0FBUSxxQkFBUixDQUFyQixFQUFDLGdCQUFBLFFBQUQsRUFBVyxjQUFBLE1BRFgsQ0FBQTs7QUFBQSxFQUVBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVIsQ0FGSixDQUFBOztBQUFBLEVBR0EsUUFBQSxHQUFXLE9BQUEsQ0FBUSxhQUFSLENBSFgsQ0FBQTs7QUFBQSxFQVNNO0FBQ0osNkJBQUEsQ0FBQTs7OztLQUFBOztBQUFBLHFCQUFBLFVBQUEsR0FBWSxJQUFaLENBQUE7O0FBQUEscUJBRUEsVUFBQSxHQUFZLFNBQUEsR0FBQTthQUFHLElBQUMsQ0FBQSxVQUFELElBQWUsd0NBQUEsU0FBQSxFQUFsQjtJQUFBLENBRlosQ0FBQTs7QUFBQSxxQkFJQSxjQUFBLEdBQWdCLFNBQUMsT0FBRCxHQUFBO0FBQ2QsTUFBQSxJQUFHLE9BQU8sQ0FBQyxNQUFSLEdBQWlCLENBQXBCO2VBQ0UsSUFBQyxDQUFBLFNBQUQsR0FBYSxPQUFRLENBQUEsQ0FBQSxDQUFFLENBQUMsUUFEMUI7T0FBQSxNQUFBO2VBR0UsSUFBQyxDQUFBLFNBQUQsR0FBYSxHQUhmO09BRGM7SUFBQSxDQUpoQixDQUFBOztBQUFBLHFCQVVBLE9BQUEsR0FBUyxTQUFBLEdBQUE7QUFDUCxVQUFBLHVCQUFBO0FBQUEsTUFBQSxJQUFHLElBQUMsQ0FBQSxlQUFKO0FBQ0UsUUFBQSxJQUFBLENBQUEsQ0FBYyx3QkFBQSxJQUFnQixJQUFDLENBQUEsU0FBUyxD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

//# sourceURL=/Users/ah/.atom/packages/vim-mode/lib/operators/input.coffee
