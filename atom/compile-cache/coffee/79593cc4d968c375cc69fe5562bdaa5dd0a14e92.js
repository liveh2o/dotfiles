(function() {
  var Find, MotionWithInput, Point, Range, Till, ViewModel, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  MotionWithInput = require('./general-motions').MotionWithInput;

  ViewModel = require('../view-models/view-model').ViewModel;

  _ref = require('atom'), Point = _ref.Point, Range = _ref.Range;

  Find = (function(_super) {
    __extends(Find, _super);

    function Find(editorView, vimState) {
      this.editorView = editorView;
      this.vimState = vimState;
      Find.__super__.constructor.call(this, this.editorView, this.vimState);
      this.vimState.currentFind = this;
      this.viewModel = new ViewModel(this, {
        "class": 'find',
        singleChar: true,
        hidden: true
      });
      this.backwards = false;
      this.repeatReversed = false;
      this.offset = 0;
    }

    Find.prototype.match = function(count) {
      var currentPosition, i, index, line, point, _i, _j, _ref1, _ref2;
      currentPosition = this.editorView.editor.getCursorBufferPosition();
      line = this.editorView.editor.lineTextForBufferRow(currentPosition.row);
      if (this.backwards) {
        index = currentPosition.column;
        for (i = _i = 0, _ref1 = count - 1; 0 <= _ref1 ? _i <= _ref1 : _i >= _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
          index = line.lastIndexOf(this.input.characters, index - 1);
        }
        if (index !== -1) {
          point = new Point(currentPosition.row, index + this.offset);
          return {
            point: point,
            range: new Range(point, currentPosition)
          };
        }
      } else {
        index = currentPosition.column;
        for (i = _j = 0, _ref2 = count - 1; 0 <= _ref2 ? _j <= _ref2 : _j >= _ref2; i = 0 <= _ref2 ? ++_j : --_j) {
          index = line.indexOf(this.input.characters, index + 1);
        }
        if (index !== -1) {
          point = new Point(currentPosition.row, index - this.offset);
          return {
            point: point,
            range: new Range(currentPosition, point.add([0, 1]))
          };
        }
      }
    };

    Find.prototype.reverse = function() {
      this.backwards = !this.backwards;
      return this;
    };

    Find.prototype.execute = function(count) {
      var match;
      if (count == null) {
        count = 1;
      }
      if ((match = this.match(count)) != null) {
        return this.editorView.editor.setCursorBufferPosition(match.point);
      }
    };

    Find.prototype.select = function(count, _arg) {
      var match, requireEOL;
      if (count == null) {
        count = 1;
      }
      requireEOL = (_arg != null ? _arg : {}).requireEOL;
      if ((match = this.match(count)) != null) {
        this.editorView.editor.setSelectedBufferRange(match.range);
        return [true];
      }
      return [false];
    };

    Find.prototype.repeat = function(opts) {
      if (opts == null) {
        opts = {};
      }
      opts.reverse = !!opts.reverse;
      if (opts.reverse !== this.repeatReversed) {
        this.reverse();
        this.repeatReversed = opts.reverse;
      }
      return this;
    };

    return Find;

  })(MotionWithInput);

  Till = (function(_super) {
    __extends(Till, _super);

    function Till(editorView, vimState) {
      this.editorView = editorView;
      this.vimState = vimState;
      Till.__super__.constructor.call(this, this.editorView, this.vimState);
      this.offset = 1;
    }

    return Till;

  })(Find);

  module.exports = {
    Find: Find,
    Till: Till
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDBEQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxrQkFBbUIsT0FBQSxDQUFRLG1CQUFSLEVBQW5CLGVBQUQsQ0FBQTs7QUFBQSxFQUNDLFlBQWEsT0FBQSxDQUFRLDJCQUFSLEVBQWIsU0FERCxDQUFBOztBQUFBLEVBRUEsT0FBaUIsT0FBQSxDQUFRLE1BQVIsQ0FBakIsRUFBQyxhQUFBLEtBQUQsRUFBUSxhQUFBLEtBRlIsQ0FBQTs7QUFBQSxFQUlNO0FBQ0osMkJBQUEsQ0FBQTs7QUFBYSxJQUFBLGNBQUUsVUFBRixFQUFlLFFBQWYsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLGFBQUEsVUFDYixDQUFBO0FBQUEsTUFEeUIsSUFBQyxDQUFBLFdBQUEsUUFDMUIsQ0FBQTtBQUFBLE1BQUEsc0NBQU0sSUFBQyxDQUFBLFVBQVAsRUFBbUIsSUFBQyxDQUFBLFFBQXBCLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFFBQVEsQ0FBQyxXQUFWLEdBQXdCLElBRHhCLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxTQUFELEdBQWlCLElBQUEsU0FBQSxDQUFVLElBQVYsRUFBYTtBQUFBLFFBQUEsT0FBQSxFQUFPLE1BQVA7QUFBQSxRQUFlLFVBQUEsRUFBWSxJQUEzQjtBQUFBLFFBQWlDLE1BQUEsRUFBUSxJQUF6QztPQUFiLENBRmpCLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxTQUFELEdBQWEsS0FIYixDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsY0FBRCxHQUFrQixLQUpsQixDQUFBO0FBQUEsTUFLQSxJQUFDLENBQUEsTUFBRCxHQUFVLENBTFYsQ0FEVztJQUFBLENBQWI7O0FBQUEsbUJBUUEsS0FBQSxHQUFPLFNBQUMsS0FBRCxHQUFBO0FBQ0wsVUFBQSw0REFBQTtBQUFB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
//# sourceURL=/Users/ah/.atom/packages/vim-mode/lib/motions/find-motion.coffee