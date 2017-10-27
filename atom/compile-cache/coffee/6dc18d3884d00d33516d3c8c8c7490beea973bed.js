(function() {
  var $$, Delete, Join, Mark, Operator, OperatorError, OperatorWithInput, Point, Range, Repeat, ToggleCase, Utils, ViewModel, Yank, _, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('underscore-plus');

  _ref = require('atom'), $$ = _ref.$$, Point = _ref.Point, Range = _ref.Range;

  ViewModel = require('../view-models/view-model').ViewModel;

  Utils = require('../utils');

  OperatorError = (function() {
    function OperatorError(message) {
      this.message = message;
      this.name = 'Operator Error';
    }

    return OperatorError;

  })();

  Operator = (function() {
    Operator.prototype.vimState = null;

    Operator.prototype.motion = null;

    Operator.prototype.complete = null;

    Operator.prototype.selectOptions = null;

    function Operator(editor, vimState, _arg) {
      this.editor = editor;
      this.vimState = vimState;
      this.selectOptions = (_arg != null ? _arg : {}).selectOptions;
      this.complete = false;
    }

    Operator.prototype.isComplete = function() {
      return this.complete;
    };

    Operator.prototype.isRecordable = function() {
      return true;
    };

    Operator.prototype.compose = function(motion) {
      var _ref1;
      if (!motion.select) {
        throw new OperatorError('Must compose with a motion');
      }
      if (motion.isLinewise == null) {
        motion.isLinewise = (_ref1 = motion.composedObject) != null ? _ref1.isLinewise : void 0;
      }
      this.motion = motion;
      return this.complete = true;
    };

    Operator.prototype.canComposeWith = function(operation) {
      return operation.select != null;
    };

    Operator.prototype.undoTransaction = function(fn) {
      return this.editor.getBuffer().transact(fn);
    };

    Operator.prototype.setTextRegister = function(register, text) {
      var type, _ref1;
      if ((_ref1 = this.motion) != null ? typeof _ref1.isLinewise === "function" ? _ref1.isLinewise() : void 0 : void 0) {
        type = 'linewise';
        if (text.slice(-1) !== '\n') {
          text += '\n';
        }
      } else {
        type = Utils.copyType(text);
      }
      return this.vimState.setRegister(register, {
        text: text,
        type: type
      });
    };

    return Operator;

  })();

  OperatorWithInput = (function(_super) {
    __extends(OperatorWithInput, _super);

    function OperatorWithInput(editorView, vimState) {
      this.editorView = editorView;
      this.vimState = vimState;
      this.editor = this.editorView.editor;
      this.complete = false;
    }

    OperatorWithInput.prototype.canComposeWith = function(operation) {
      return (operation.characters != null) || (operation.select != null);
    };

    OperatorWithInput.prototype.compose = function(operation) {
      if (operation.select != null) {
        this.motion = operation;
      }
      if (operation.characters != null) {
        this.input = operation;
        return this.complete = true;
      }
    };

    return OperatorWithInput;

  })(Operator);

  Delete = (function(_super) {
    __extends(Delete, _super);

    Delete.prototype.register = '"';

    Delete.prototype.allowEOL = null;

    function Delete(editor, vimState, _arg) {
      var _base, _ref1;
      this.editor = editor;
      this.vimState = vimState;
      _ref1 = _arg != null ? _arg : {}, this.allowEOL = _ref1.allowEOL, this.selectOptions = _ref1.selectOptions;
      this.complete = false;
      if (this.selectOptions == null) {
        this.selectOptions = {};
      }
      if ((_base = this.selectOptions).requireEOL == null) {
        _base.requireEOL = true;
      }
    }

    Delete.prototype.execute = function(count) {
      var cursor, text, validSelection, _base, _base1;
      cursor = this.editor.getLastCursor();
      if (_.contains(this.motion.select(count, this.selectOptions), true)) {
        validSelection = true;
      }
      if (validSelection != null) {
        text = this.editor.getSelectedText();
        this.setTextRegister(this.register, text);
        this.editor["delete"]();
        if (!this.allowEOL && cursor.isAtEndOfLine() && !(typeof (_base = this.motion).isLinewise === "function" ? _base.isLinewise() : void 0)) {
          this.editor.moveLeft();
        }
      }
      if (typeof (_base1 = this.motion).isLinewise === "function" ? _base1.isLinewise() : void 0) {
        this.editor.setCursorScreenPosition([cursor.getScreenRow(), 0]);
      }
      return this.vimState.activateCommandMode();
    };

    return Delete;

  })(Operator);

  ToggleCase = (function(_super) {
    __extends(ToggleCase, _super);

    function ToggleCase(editor, vimState, _arg) {
      this.editor = editor;
      this.vimState = vimState;
      this.selectOptions = (_arg != null ? _arg : {}).selectOptions;
      this.complete = true;
    }

    ToggleCase.prototype.execute = function(count) {
      var lastCharIndex, pos;
      if (count == null) {
        count = 1;
      }
      pos = this.editor.getCursorBufferPosition();
      lastCharIndex = this.editor.lineTextForBufferRow(pos.row).length - 1;
      count = Math.min(count, this.editor.lineTextForBufferRow(pos.row).length - pos.column);
      if (this.editor.getBuffer().isRowBlank(pos.row)) {
        return;
      }
      this.undoTransaction((function(_this) {
        return function() {
          return _.times(count, function() {
            var char, point, range;
            point = _this.editor.getCursorBufferPosition();
            range = Range.fromPointWithDelta(point, 0, 1);
            char = _this.editor.getTextInBufferRange(range);
            if (char === char.toLowerCase()) {
              _this.editor.setTextInBufferRange(range, char.toUpperCase());
            } else {
              _this.editor.setTextInBufferRange(range, char.toLowerCase());
            }
            if (!(point.column >= lastCharIndex)) {
              return _this.editor.moveRight();
            }
          });
        };
      })(this));
      return this.vimState.activateCommandMode();
    };

    return ToggleCase;

  })(Operator);

  Yank = (function(_super) {
    __extends(Yank, _super);

    function Yank() {
      return Yank.__super__.constructor.apply(this, arguments);
    }

    Yank.prototype.register = '"';

    Yank.prototype.execute = function(count) {
      var originalPosition, selectedPosition, text;
      originalPosition = this.editor.getCursorScreenPosition();
      if (_.contains(this.motion.select(count), true)) {
        selectedPosition = this.editor.getCursorScreenPosition();
        text = this.editor.getLastSelection().getText();
        originalPosition = Point.min(originalPosition, selectedPosition);
      } else {
        text = '';
      }
      this.setTextRegister(this.register, text);
      this.editor.setCursorScreenPosition(originalPosition);
      return this.vimState.activateCommandMode();
    };

    return Yank;

  })(Operator);

  Join = (function(_super) {
    __extends(Join, _super);

    function Join(editor, vimState, _arg) {
      this.editor = editor;
      this.vimState = vimState;
      this.selectOptions = (_arg != null ? _arg : {}).selectOptions;
      this.complete = true;
    }

    Join.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      this.undoTransaction((function(_this) {
        return function() {
          return _.times(count, function() {
            return _this.editor.joinLines();
          });
        };
      })(this));
      return this.vimState.activateCommandMode();
    };

    return Join;

  })(Operator);

  Repeat = (function(_super) {
    __extends(Repeat, _super);

    function Repeat(editor, vimState, _arg) {
      this.editor = editor;
      this.vimState = vimState;
      this.selectOptions = (_arg != null ? _arg : {}).selectOptions;
      this.complete = true;
    }

    Repeat.prototype.isRecordable = function() {
      return false;
    };

    Repeat.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      return this.undoTransaction((function(_this) {
        return function() {
          return _.times(count, function() {
            var cmd;
            cmd = _this.vimState.history[0];
            return cmd != null ? cmd.execute() : void 0;
          });
        };
      })(this));
    };

    return Repeat;

  })(Operator);

  Mark = (function(_super) {
    __extends(Mark, _super);

    function Mark(editorView, vimState, _arg) {
      this.editorView = editorView;
      this.vimState = vimState;
      this.selectOptions = (_arg != null ? _arg : {}).selectOptions;
      Mark.__super__.constructor.call(this, this.editorView, this.vimState);
      this.viewModel = new ViewModel(this, {
        "class": 'mark',
        singleChar: true,
        hidden: true
      });
    }

    Mark.prototype.execute = function() {
      this.vimState.setMark(this.input.characters, this.editorView.editor.getCursorBufferPosition());
      return this.vimState.activateCommandMode();
    };

    return Mark;

  })(OperatorWithInput);

  module.exports = {
    Operator: Operator,
    OperatorWithInput: OperatorWithInput,
    OperatorError: OperatorError,
    Delete: Delete,
    ToggleCase: ToggleCase,
    Yank: Yank,
    Join: Join,
    Repeat: Repeat,
    Mark: Mark
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHFJQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBQUosQ0FBQTs7QUFBQSxFQUNBLE9BQXFCLE9BQUEsQ0FBUSxNQUFSLENBQXJCLEVBQUMsVUFBQSxFQUFELEVBQUssYUFBQSxLQUFMLEVBQVksYUFBQSxLQURaLENBQUE7O0FBQUEsRUFFQyxZQUFhLE9BQUEsQ0FBUSwyQkFBUixFQUFiLFNBRkQsQ0FBQTs7QUFBQSxFQUdBLEtBQUEsR0FBUSxPQUFBLENBQVEsVUFBUixDQUhSLENBQUE7O0FBQUEsRUFLTTtBQUNTLElBQUEsdUJBQUUsT0FBRixHQUFBO0FBQ1gsTUFEWSxJQUFDLENBQUEsVUFBQSxPQUNiLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxJQUFELEdBQVEsZ0JBQVIsQ0FEVztJQUFBLENBQWI7O3lCQUFBOztNQU5GLENBQUE7O0FBQUEsRUFTTTtBQUNKLHVCQUFBLFFBQUEsR0FBVSxJQUFWLENBQUE7O0FBQUEsdUJBQ0EsTUFBQSxHQUFRLElBRFIsQ0FBQTs7QUFBQSx1QkFFQSxRQUFBLEdBQVUsSUFGVixDQUFBOztBQUFBLHVCQUdBLGFBQUEsR0FBZSxJQUhmLENBQUE7O0FBT2EsSUFBQSxrQkFBRSxNQUFGLEVBQVcsUUFBWCxFQUFxQixJQUFyQixHQUFBO0FBQ1gsTUFEWSxJQUFDLENBQUEsU0FBQSxNQUNiLENBQUE7QUFBQSxNQURxQixJQUFDLENBQUEsV0FBQSxRQUN0QixDQUFBO0FBQUEsTUFEaUMsSUFBQyxDQUFBLGdDQUFGLE9BQWlCLElBQWYsYUFDbEMsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLFFBQUQsR0FBWSxLQUFaLENBRFc7SUFBQSxDQVBiOztBQUFBLHVCQWFBLFVBQUEsR0FBWSxTQUFBLEdBQUE7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
//# sourceURL=/Users/ah/.atom/packages/vim-mode/lib/operators/general-operators.coffee