(function() {
  var Change, Delete, Insert, InsertAboveWithNewline, InsertAfter, InsertBelowWithNewline, Operator, Substitute, SubstituteLine, TransactionBundler, _, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('./general-operators'), Operator = _ref.Operator, Delete = _ref.Delete;

  _ = require('underscore-plus');

  Insert = (function(_super) {
    __extends(Insert, _super);

    function Insert() {
      return Insert.__super__.constructor.apply(this, arguments);
    }

    Insert.prototype.standalone = true;

    Insert.prototype.isComplete = function() {
      return this.standalone || Insert.__super__.isComplete.apply(this, arguments);
    };

    Insert.prototype.confirmTransaction = function(transaction) {
      var bundler;
      bundler = new TransactionBundler(transaction);
      return this.typedText = bundler.buildInsertText();
    };

    Insert.prototype.execute = function() {
      if (this.typingCompleted) {
        if (!((this.typedText != null) && this.typedText.length > 0)) {
          return;
        }
        return this.editor.transact((function(_this) {
          return function() {
            return _this.editor.getBuffer().insert(_this.editor.getCursorBufferPosition(), _this.typedText, true);
          };
        })(this));
      } else {
        this.vimState.activateInsertMode();
        return this.typingCompleted = true;
      }
    };

    Insert.prototype.inputOperator = function() {
      return true;
    };

    return Insert;

  })(Operator);

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

  InsertAboveWithNewline = (function(_super) {
    __extends(InsertAboveWithNewline, _super);

    function InsertAboveWithNewline() {
      return InsertAboveWithNewline.__super__.constructor.apply(this, arguments);
    }

    InsertAboveWithNewline.prototype.execute = function(count) {
      var transactionStarted;
      if (count == null) {
        count = 1;
      }
      if (!this.typingCompleted) {
        this.vimState.setInsertionCheckpoint();
      }
      this.editor.insertNewlineAbove();
      this.editor.getLastCursor().skipLeadingWhitespace();
      if (this.typingCompleted) {
        this.typedText = this.typedText.trimLeft();
        return InsertAboveWithNewline.__super__.execute.apply(this, arguments);
      }
      this.vimState.activateInsertMode(transactionStarted = true);
      return this.typingCompleted = true;
    };

    return InsertAboveWithNewline;

  })(Insert);

  InsertBelowWithNewline = (function(_super) {
    __extends(InsertBelowWithNewline, _super);

    function InsertBelowWithNewline() {
      return InsertBelowWithNewline.__super__.constructor.apply(this, arguments);
    }

    InsertBelowWithNewline.prototype.execute = function(count) {
      var transactionStarted;
      if (count == null) {
        count = 1;
      }
      if (!this.typingCompleted) {
        this.vimState.setInsertionCheckpoint();
      }
      this.editor.insertNewlineBelow();
      this.editor.getLastCursor().skipLeadingWhitespace();
      if (this.typingCompleted) {
        this.typedText = this.typedText.trimLeft();
        return InsertBelowWithNewline.__super__.execute.apply(this, arguments);
      }
      this.vimState.activateInsertMode(transactionStarted = true);
      return this.typingCompleted = true;
    };

    return InsertBelowWithNewline;

  })(Insert);

  Change = (function(_super) {
    __extends(Change, _super);

    function Change() {
      return Change.__super__.constructor.apply(this, arguments);
    }

    Change.prototype.standalone = false;

    Change.prototype.register = '"';

    Change.prototype.execute = function(count) {
      var transactionStarted, _base;
      if (!this.typingCompleted) {
        this.vimState.setInsertionCheckpoint();
      }
      if (_.contains(this.motion.select(count, {
        excludeWhitespace: true
      }), true)) {
        this.setTextRegister(this.register, this.editor.getSelectedText());
        if (typeof (_base = this.motion).isLinewise === "function" ? _base.isLinewise() : void 0) {
          this.editor.insertNewline();
          this.editor.moveLeft();
        } else {
          this.editor["delete"]();
        }
      }
      if (this.typingCompleted) {
        return Change.__super__.execute.apply(this, arguments);
      }
      this.vimState.activateInsertMode(transactionStarted = true);
      return this.typingCompleted = true;
    };

    return Change;

  })(Insert);

  Substitute = (function(_super) {
    __extends(Substitute, _super);

    function Substitute() {
      return Substitute.__super__.constructor.apply(this, arguments);
    }

    Substitute.prototype.register = '"';

    Substitute.prototype.execute = function(count) {
      var text, transactionStarated;
      if (count == null) {
        count = 1;
      }
      if (!this.typingCompleted) {
        this.vimState.setInsertionCheckpoint();
      }
      _.times(count, (function(_this) {
        return function() {
          return _this.editor.selectRight();
        };
      })(this));
      text = this.editor.getLastSelection().getText();
      this.setTextRegister(this.register, text);
      this.editor["delete"]();
      if (this.typingCompleted) {
        this.typedText = this.typedText.trimLeft();
        return Substitute.__super__.execute.apply(this, arguments);
      }
      this.vimState.activateInsertMode(transactionStarated = true);
      return this.typingCompleted = true;
    };

    return Substitute;

  })(Insert);

  SubstituteLine = (function(_super) {
    __extends(SubstituteLine, _super);

    function SubstituteLine() {
      return SubstituteLine.__super__.constructor.apply(this, arguments);
    }

    SubstituteLine.prototype.register = '"';

    SubstituteLine.prototype.execute = function(count) {
      var text, transactionStarated;
      if (count == null) {
        count = 1;
      }
      if (!this.typingCompleted) {
        this.vimState.setInsertionCheckpoint();
      }
      this.editor.moveToBeginningOfLine();
      _.times(count, (function(_this) {
        return function() {
          return _this.editor.selectDown();
        };
      })(this));
      text = this.editor.getLastSelection().getText();
      this.setTextRegister(this.register, text);
      this.editor["delete"]();
      this.editor.insertNewlineAbove();
      this.editor.getLastCursor().skipLeadingWhitespace();
      if (this.typingCompleted) {
        this.typedText = this.typedText.trimLeft();
        return SubstituteLine.__super__.execute.apply(this, arguments);
      }
      this.vimState.activateInsertMode(transactionStarated = true);
      return this.typingCompleted = true;
    };

    return SubstituteLine;

  })(Insert);

  TransactionBundler = (function() {
    function TransactionBundler(transaction) {
      this.transaction = transaction;
    }

    TransactionBundler.prototype.buildInsertText = function() {
      var chars, patch, _i, _len, _ref1;
      if (!this.transaction.patches) {
        return "";
      }
      chars = [];
      _ref1 = this.transaction.patches;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        patch = _ref1[_i];
        switch (false) {
          case !this.isTypedChar(patch):
            chars.push(this.isTypedChar(patch));
            break;
          case !this.isBackspacedChar(patch):
            chars.pop();
        }
      }
      return chars.join("");
    };

    TransactionBundler.prototype.isTypedChar = function(patch) {
      var _ref1, _ref2;
      if (!(((_ref1 = patch.newText) != null ? _ref1.length : void 0) >= 1 && ((_ref2 = patch.oldText) != null ? _ref2.length : void 0) === 0)) {
        return false;
      }
      return patch.newText;
    };

    TransactionBundler.prototype.isBackspacedChar = function(patch) {
      var _ref1;
      return patch.newText === "" && ((_ref1 = patch.oldText) != null ? _ref1.length : void 0) === 1;
    };

    return TransactionBundler;

  })();

  module.exports = {
    Insert: Insert,
    InsertAfter: InsertAfter,
    InsertAboveWithNewline: InsertAboveWithNewline,
    InsertBelowWithNewline: InsertBelowWithNewline,
    Change: Change,
    Substitute: Substitute,
    SubstituteLine: SubstituteLine
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNKQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxPQUFxQixPQUFBLENBQVEscUJBQVIsQ0FBckIsRUFBQyxnQkFBQSxRQUFELEVBQVcsY0FBQSxNQUFYLENBQUE7O0FBQUEsRUFDQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBREosQ0FBQTs7QUFBQSxFQU9NO0FBQ0osNkJBQUEsQ0FBQTs7OztLQUFBOztBQUFBLHFCQUFBLFVBQUEsR0FBWSxJQUFaLENBQUE7O0FBQUEscUJBRUEsVUFBQSxHQUFZLFNBQUEsR0FBQTthQUFHLElBQUMsQ0FBQSxVQUFELElBQWUsd0NBQUEsU0FBQSxFQUFsQjtJQUFBLENBRlosQ0FBQTs7QUFBQSxxQkFJQSxrQkFBQSxHQUFvQixTQUFDLFdBQUQsR0FBQTtBQUNsQixVQUFBLE9BQUE7QUFBQSxNQUFBLE9BQUEsR0FBYyxJQUFBLGtCQUFBLENBQW1CLFdBQW5CLENBQWQsQ0FBQTthQUNBLElBQUMsQ0FBQSxTQUFELEdBQWEsT0FBTyxDQUFDLGVBQVIsQ0FBQSxFQUZLO0lBQUEsQ0FKcEIsQ0FBQTs7QUFBQSxxQkFRQSxPQUFBLEdBQVMsU0FBQSxHQUFBO0FBQ1AsTUFBQSxJQUFHLElBQUMsQ0FBQSxlQUFKO0FBQ0UsUUFBQSxJQUFBLENBQUEsQ0FBYyx3QkFBQSxJQUFnQixJQUFDLENBQUEsU0FBUyxDQUFDLE1BQVgsR0FBb0IsQ0FBbEQsQ0FBQTtBQUFBLGdCQUFBLENBQUE7U0FBQTtlQUNBLElBQUMsQ0FBQSxNQUFNLENBQUMsUUFBUixDQUFpQixDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTttQkFDZixLQUFDLENBQUEsTUFBTSxDQUFDLFNBQVIsQ0FBQSxDQUFtQixDQUFDLE1BQXBCLENBQTJCLEtBQUMsQ0FBQSxNQUFN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
//# sourceURL=/Users/ah/.atom/packages/vim-mode/lib/operators/input.coffee