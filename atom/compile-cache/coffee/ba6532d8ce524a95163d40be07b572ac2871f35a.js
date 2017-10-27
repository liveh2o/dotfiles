(function() {
  var Find, MotionWithInput, Point, Range, Till, ViewModel, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  MotionWithInput = require('./general-motions').MotionWithInput;

  ViewModel = require('../view-models/view-model').ViewModel;

  _ref = require('atom'), Point = _ref.Point, Range = _ref.Range;

  Find = (function(_super) {
    __extends(Find, _super);

    function Find(editor, vimState, opts) {
      var orig;
      this.editor = editor;
      this.vimState = vimState;
      if (opts == null) {
        opts = {};
      }
      Find.__super__.constructor.call(this, this.editor, this.vimState);
      this.offset = 0;
      if (!opts.repeated) {
        this.viewModel = new ViewModel(this, {
          "class": 'find',
          singleChar: true,
          hidden: true
        });
        this.backwards = false;
        this.repeated = false;
        this.vimState.globalVimState.currentFind = this;
      } else {
        this.repeated = true;
        orig = this.vimState.globalVimState.currentFind;
        this.backwards = orig.backwards;
        this.complete = orig.complete;
        this.input = orig.input;
        if (opts.reverse) {
          this.reverse();
        }
      }
    }

    Find.prototype.match = function(cursor, count) {
      var currentPosition, i, index, line, _i, _j, _ref1, _ref2;
      currentPosition = cursor.getBufferPosition();
      line = this.editor.lineTextForBufferRow(currentPosition.row);
      if (this.backwards) {
        index = currentPosition.column;
        for (i = _i = 0, _ref1 = count - 1; 0 <= _ref1 ? _i <= _ref1 : _i >= _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
          if (index <= 0) {
            return;
          }
          index = line.lastIndexOf(this.input.characters, index - 1 - (this.offset * this.repeated));
        }
        if (index >= 0) {
          return new Point(currentPosition.row, index + this.offset);
        }
      } else {
        index = currentPosition.column;
        for (i = _j = 0, _ref2 = count - 1; 0 <= _ref2 ? _j <= _ref2 : _j >= _ref2; i = 0 <= _ref2 ? ++_j : --_j) {
          index = line.indexOf(this.input.characters, index + 1 + (this.offset * this.repeated));
          if (index < 0) {
            return;
          }
        }
        if (index >= 0) {
          return new Point(currentPosition.row, index - this.offset);
        }
      }
    };

    Find.prototype.reverse = function() {
      this.backwards = !this.backwards;
      return this;
    };

    Find.prototype.moveCursor = function(cursor, count) {
      var match;
      if (count == null) {
        count = 1;
      }
      if ((match = this.match(cursor, count)) != null) {
        return cursor.setBufferPosition(match);
      }
    };

    return Find;

  })(MotionWithInput);

  Till = (function(_super) {
    __extends(Till, _super);

    function Till(editor, vimState, opts) {
      this.editor = editor;
      this.vimState = vimState;
      if (opts == null) {
        opts = {};
      }
      Till.__super__.constructor.call(this, this.editor, this.vimState, opts);
      this.offset = 1;
    }

    Till.prototype.match = function() {
      var retval;
      this.selectAtLeastOne = false;
      retval = Till.__super__.match.apply(this, arguments);
      if ((retval != null) && !this.backwards) {
        this.selectAtLeastOne = true;
      }
      return retval;
    };

    Till.prototype.moveSelectionInclusively = function(selection, count, options) {
      Till.__super__.moveSelectionInclusively.apply(this, arguments);
      if (selection.isEmpty() && this.selectAtLeastOne) {
        return selection.modifySelection(function() {
          return selection.cursor.moveRight();
        });
      }
    };

    return Till;

  })(Find);

  module.exports = {
    Find: Find,
    Till: Till
  };

}).call(this);
