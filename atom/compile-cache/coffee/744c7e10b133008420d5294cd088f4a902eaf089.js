(function() {
  var Delete, Join, LowerCase, Mark, Operator, OperatorError, OperatorWithInput, Point, Range, Repeat, ToggleCase, UpperCase, Utils, ViewModel, Yank, settings, _, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('underscore-plus');

  _ref = require('atom'), Point = _ref.Point, Range = _ref.Range;

  ViewModel = require('../view-models/view-model').ViewModel;

  Utils = require('../utils');

  settings = require('../settings');

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

    function Operator(editor, vimState) {
      this.editor = editor;
      this.vimState = vimState;
      this.complete = false;
    }

    Operator.prototype.isComplete = function() {
      return this.complete;
    };

    Operator.prototype.isRecordable = function() {
      return true;
    };

    Operator.prototype.compose = function(motion) {
      if (!motion.select) {
        throw new OperatorError('Must compose with a motion');
      }
      this.motion = motion;
      return this.complete = true;
    };

    Operator.prototype.canComposeWith = function(operation) {
      return operation.select != null;
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
      if (text !== '') {
        return this.vimState.setRegister(register, {
          text: text,
          type: type
        });
      }
    };

    return Operator;

  })();

  OperatorWithInput = (function(_super) {
    __extends(OperatorWithInput, _super);

    function OperatorWithInput(editor, vimState) {
      this.editor = editor;
      this.vimState = vimState;
      this.editor = this.editor;
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

    Delete.prototype.register = null;

    function Delete(editor, vimState) {
      this.editor = editor;
      this.vimState = vimState;
      this.complete = false;
      this.register = settings.defaultRegister();
    }

    Delete.prototype.execute = function(count) {
      var cursor, _base, _i, _len, _ref1;
      if (_.contains(this.motion.select(count), true)) {
        this.setTextRegister(this.register, this.editor.getSelectedText());
        this.editor.transact((function(_this) {
          return function() {
            var selection, _i, _len, _ref1, _results;
            _ref1 = _this.editor.getSelections();
            _results = [];
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
              selection = _ref1[_i];
              _results.push(selection.deleteSelectedText());
            }
            return _results;
          };
        })(this));
        _ref1 = this.editor.getCursors();
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          cursor = _ref1[_i];
          if (typeof (_base = this.motion).isLinewise === "function" ? _base.isLinewise() : void 0) {
            cursor.skipLeadingWhitespace();
          } else {
            if (cursor.isAtEndOfLine() && !cursor.isAtBeginningOfLine()) {
              cursor.moveLeft();
            }
          }
        }
      }
      return this.vimState.activateNormalMode();
    };

    return Delete;

  })(Operator);

  ToggleCase = (function(_super) {
    __extends(ToggleCase, _super);

    function ToggleCase(editor, vimState, _arg) {
      this.editor = editor;
      this.vimState = vimState;
      this.complete = (_arg != null ? _arg : {}).complete;
    }

    ToggleCase.prototype.execute = function(count) {
      if (this.motion != null) {
        if (_.contains(this.motion.select(count), true)) {
          this.editor.replaceSelectedText({}, function(text) {
            return text.split('').map(function(char) {
              var lower;
              lower = char.toLowerCase();
              if (char === lower) {
                return char.toUpperCase();
              } else {
                return lower;
              }
            }).join('');
          });
        }
      } else {
        this.editor.transact((function(_this) {
          return function() {
            var cursor, cursorCount, lineLength, point, _i, _len, _ref1, _results;
            _ref1 = _this.editor.getCursors();
            _results = [];
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
              cursor = _ref1[_i];
              point = cursor.getBufferPosition();
              lineLength = _this.editor.lineTextForBufferRow(point.row).length;
              cursorCount = Math.min(count != null ? count : 1, lineLength - point.column);
              _results.push(_.times(cursorCount, function() {
                var char, range;
                point = cursor.getBufferPosition();
                range = Range.fromPointWithDelta(point, 0, 1);
                char = _this.editor.getTextInBufferRange(range);
                if (char === char.toLowerCase()) {
                  _this.editor.setTextInBufferRange(range, char.toUpperCase());
                } else {
                  _this.editor.setTextInBufferRange(range, char.toLowerCase());
                }
                if (!(point.column >= lineLength - 1)) {
                  return cursor.moveRight();
                }
              }));
            }
            return _results;
          };
        })(this));
      }
      return this.vimState.activateNormalMode();
    };

    return ToggleCase;

  })(Operator);

  UpperCase = (function(_super) {
    __extends(UpperCase, _super);

    function UpperCase(editor, vimState) {
      this.editor = editor;
      this.vimState = vimState;
      this.complete = false;
    }

    UpperCase.prototype.execute = function(count) {
      if (_.contains(this.motion.select(count), true)) {
        this.editor.replaceSelectedText({}, function(text) {
          return text.toUpperCase();
        });
      }
      return this.vimState.activateNormalMode();
    };

    return UpperCase;

  })(Operator);

  LowerCase = (function(_super) {
    __extends(LowerCase, _super);

    function LowerCase(editor, vimState) {
      this.editor = editor;
      this.vimState = vimState;
      this.complete = false;
    }

    LowerCase.prototype.execute = function(count) {
      if (_.contains(this.motion.select(count), true)) {
        this.editor.replaceSelectedText({}, function(text) {
          return text.toLowerCase();
        });
      }
      return this.vimState.activateNormalMode();
    };

    return LowerCase;

  })(Operator);

  Yank = (function(_super) {
    __extends(Yank, _super);

    Yank.prototype.register = null;

    function Yank(editor, vimState) {
      this.editor = editor;
      this.vimState = vimState;
      this.register = settings.defaultRegister();
    }

    Yank.prototype.execute = function(count) {
      var i, newPositions, oldLastCursorPosition, oldLeft, oldTop, originalPosition, originalPositions, position, startPositions, text;
      oldTop = this.editor.getScrollTop();
      oldLeft = this.editor.getScrollLeft();
      oldLastCursorPosition = this.editor.getCursorBufferPosition();
      originalPositions = this.editor.getCursorBufferPositions();
      if (_.contains(this.motion.select(count), true)) {
        text = this.editor.getSelectedText();
        startPositions = _.pluck(this.editor.getSelectedBufferRanges(), "start");
        newPositions = (function() {
          var _base, _i, _len, _results;
          _results = [];
          for (i = _i = 0, _len = originalPositions.length; _i < _len; i = ++_i) {
            originalPosition = originalPositions[i];
            if (startPositions[i]) {
              position = Point.min(startPositions[i], originalPositions[i]);
              if (this.vimState.mode !== 'visual' && (typeof (_base = this.motion).isLinewise === "function" ? _base.isLinewise() : void 0)) {
                position = new Point(position.row, originalPositions[i].column);
              }
              _results.push(position);
            } else {
              _results.push(originalPosition);
            }
          }
          return _results;
        }).call(this);
      } else {
        text = '';
        newPositions = originalPositions;
      }
      this.setTextRegister(this.register, text);
      this.editor.setSelectedBufferRanges(newPositions.map(function(p) {
        return new Range(p, p);
      }));
      if (oldLastCursorPosition.isEqual(this.editor.getCursorBufferPosition())) {
        this.editor.setScrollLeft(oldLeft);
        this.editor.setScrollTop(oldTop);
      }
      return this.vimState.activateNormalMode();
    };

    return Yank;

  })(Operator);

  Join = (function(_super) {
    __extends(Join, _super);

    function Join(editor, vimState) {
      this.editor = editor;
      this.vimState = vimState;
      this.complete = true;
    }

    Join.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      this.editor.transact((function(_this) {
        return function() {
          return _.times(count, function() {
            return _this.editor.joinLines();
          });
        };
      })(this));
      return this.vimState.activateNormalMode();
    };

    return Join;

  })(Operator);

  Repeat = (function(_super) {
    __extends(Repeat, _super);

    function Repeat(editor, vimState) {
      this.editor = editor;
      this.vimState = vimState;
      this.complete = true;
    }

    Repeat.prototype.isRecordable = function() {
      return false;
    };

    Repeat.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      return this.editor.transact((function(_this) {
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

    function Mark(editor, vimState) {
      this.editor = editor;
      this.vimState = vimState;
      Mark.__super__.constructor.call(this, this.editor, this.vimState);
      this.viewModel = new ViewModel(this, {
        "class": 'mark',
        singleChar: true,
        hidden: true
      });
    }

    Mark.prototype.execute = function() {
      this.vimState.setMark(this.input.characters, this.editor.getCursorBufferPosition());
      return this.vimState.activateNormalMode();
    };

    return Mark;

  })(OperatorWithInput);

  module.exports = {
    Operator: Operator,
    OperatorWithInput: OperatorWithInput,
    OperatorError: OperatorError,
    Delete: Delete,
    ToggleCase: ToggleCase,
    UpperCase: UpperCase,
    LowerCase: LowerCase,
    Yank: Yank,
    Join: Join,
    Repeat: Repeat,
    Mark: Mark
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3ZpbS1tb2RlL2xpYi9vcGVyYXRvcnMvZ2VuZXJhbC1vcGVyYXRvcnMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlLQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBQUosQ0FBQTs7QUFBQSxFQUNBLE9BQWlCLE9BQUEsQ0FBUSxNQUFSLENBQWpCLEVBQUMsYUFBQSxLQUFELEVBQVEsYUFBQSxLQURSLENBQUE7O0FBQUEsRUFFQyxZQUFhLE9BQUEsQ0FBUSwyQkFBUixFQUFiLFNBRkQsQ0FBQTs7QUFBQSxFQUdBLEtBQUEsR0FBUSxPQUFBLENBQVEsVUFBUixDQUhSLENBQUE7O0FBQUEsRUFJQSxRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVIsQ0FKWCxDQUFBOztBQUFBLEVBTU07QUFDUyxJQUFBLHVCQUFFLE9BQUYsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLFVBQUEsT0FDYixDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsSUFBRCxHQUFRLGdCQUFSLENBRFc7SUFBQSxDQUFiOzt5QkFBQTs7TUFQRixDQUFBOztBQUFBLEVBVU07QUFDSix1QkFBQSxRQUFBLEdBQVUsSUFBVixDQUFBOztBQUFBLHVCQUNBLE1BQUEsR0FBUSxJQURSLENBQUE7O0FBQUEsdUJBRUEsUUFBQSxHQUFVLElBRlYsQ0FBQTs7QUFJYSxJQUFBLGtCQUFFLE1BQUYsRUFBVyxRQUFYLEdBQUE7QUFDWCxNQURZLElBQUMsQ0FBQSxTQUFBLE1BQ2IsQ0FBQTtBQUFBLE1BRHFCLElBQUMsQ0FBQSxXQUFBLFFBQ3RCLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxRQUFELEdBQVksS0FBWixDQURXO0lBQUEsQ0FKYjs7QUFBQSx1QkFVQSxVQUFBLEdBQVks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

//# sourceURL=/Users/ah/.atom/packages/vim-mode/lib/operators/general-operators.coffee
