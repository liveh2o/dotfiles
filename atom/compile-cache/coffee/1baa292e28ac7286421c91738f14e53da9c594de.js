(function() {
  var MotionWithInput, MoveToFirstCharacterOfLine, MoveToMark, Point, Range, ViewModel, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('./general-motions'), MotionWithInput = _ref.MotionWithInput, MoveToFirstCharacterOfLine = _ref.MoveToFirstCharacterOfLine;

  ViewModel = require('../view-models/view-model').ViewModel;

  _ref1 = require('atom'), Point = _ref1.Point, Range = _ref1.Range;

  module.exports = MoveToMark = (function(_super) {
    __extends(MoveToMark, _super);

    function MoveToMark(editor, vimState, linewise) {
      this.editor = editor;
      this.vimState = vimState;
      this.linewise = linewise != null ? linewise : true;
      MoveToMark.__super__.constructor.call(this, this.editor, this.vimState);
      this.operatesLinewise = this.linewise;
      this.viewModel = new ViewModel(this, {
        "class": 'move-to-mark',
        singleChar: true,
        hidden: true
      });
    }

    MoveToMark.prototype.isLinewise = function() {
      return this.linewise;
    };

    MoveToMark.prototype.moveCursor = function(cursor, count) {
      var markPosition;
      if (count == null) {
        count = 1;
      }
      markPosition = this.vimState.getMark(this.input.characters);
      if (this.input.characters === '`') {
        if (markPosition == null) {
          markPosition = [0, 0];
        }
        this.vimState.setMark('`', cursor.getBufferPosition());
      }
      if (markPosition != null) {
        cursor.setBufferPosition(markPosition);
      }
      if (this.linewise) {
        return cursor.moveToFirstCharacterOfLine();
      }
    };

    return MoveToMark;

  })(MotionWithInput);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3ZpbS1tb2RlL2xpYi9tb3Rpb25zL21vdmUtdG8tbWFyay1tb3Rpb24uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZGQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxPQUFnRCxPQUFBLENBQVEsbUJBQVIsQ0FBaEQsRUFBQyx1QkFBQSxlQUFELEVBQWtCLGtDQUFBLDBCQUFsQixDQUFBOztBQUFBLEVBQ0MsWUFBYSxPQUFBLENBQVEsMkJBQVIsRUFBYixTQURELENBQUE7O0FBQUEsRUFFQSxRQUFpQixPQUFBLENBQVEsTUFBUixDQUFqQixFQUFDLGNBQUEsS0FBRCxFQUFRLGNBQUEsS0FGUixDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLGlDQUFBLENBQUE7O0FBQWEsSUFBQSxvQkFBRSxNQUFGLEVBQVcsUUFBWCxFQUFzQixRQUF0QixHQUFBO0FBQ1gsTUFEWSxJQUFDLENBQUEsU0FBQSxNQUNiLENBQUE7QUFBQSxNQURxQixJQUFDLENBQUEsV0FBQSxRQUN0QixDQUFBO0FBQUEsTUFEZ0MsSUFBQyxDQUFBLDhCQUFBLFdBQVMsSUFDMUMsQ0FBQTtBQUFBLE1BQUEsNENBQU0sSUFBQyxDQUFBLE1BQVAsRUFBZSxJQUFDLENBQUEsUUFBaEIsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsZ0JBQUQsR0FBb0IsSUFBQyxDQUFBLFFBRHJCLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxTQUFELEdBQWlCLElBQUEsU0FBQSxDQUFVLElBQVYsRUFBZ0I7QUFBQSxRQUFBLE9BQUEsRUFBTyxjQUFQO0FBQUEsUUFBdUIsVUFBQSxFQUFZLElBQW5DO0FBQUEsUUFBeUMsTUFBQSxFQUFRLElBQWpEO09BQWhCLENBRmpCLENBRFc7SUFBQSxDQUFiOztBQUFBLHlCQUtBLFVBQUEsR0FBWSxTQUFBLEdBQUE7YUFBRyxJQUFDLENBQUEsU0FBSjtJQUFBLENBTFosQ0FBQTs7QUFBQSx5QkFPQSxVQUFBLEdBQVksU0FBQyxNQUFELEVBQVMsS0FBVCxHQUFBO0FBQ1YsVUFBQSxZQUFBOztRQURtQixRQUFNO09BQ3pCO0FBQUEsTUFBQSxZQUFBLEdBQWUsSUFBQyxDQUFBLFFBQVEsQ0FBQyxPQUFWLENBQWtCLElBQUMsQ0FBQSxLQUFLLENBQUMsVUFBekIsQ0FBZixDQUFBO0FBRUEsTUFBQSxJQUFHLElBQUMsQ0FBQSxLQUFLLENBQUMsVUFBUCxLQUFxQixHQUF4Qjs7VUFDRSxlQUFnQixDQUFDLENBQUQsRUFBSSxDQUFKO1NBQWhCO0FBQUEsUUFDQSxJQUFDLENBQUEsUUFBUSxDQUFDLE9BQVYsQ0FBa0IsR0FBbEIsRUFBdUIsTUFBTSxDQUFDLGlCQUFQLENBQUEsQ0FBdkIsQ0FEQSxDQURGO09BRkE7QUFNQSxNQUFBLElBQTBDLG9CQUExQztBQUFBLFFBQUEsTUFBTSxDQUFDLGlCQUFQLENBQXlCLFlBQXpCLENBQUEsQ0FBQTtPQU5BO0FBT0EsTUFBQSxJQUFHLElBQUMsQ0FBQSxRQUFKO2VBQ0UsTUFBTSxDQUFDLDBCQUFQLENBQUEsRUFERjtPQVJVO0lBQUEsQ0FQWixDQUFBOztzQkFBQTs7S0FEdUIsZ0JBTHpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/ah/.atom/packages/vim-mode/lib/motions/move-to-mark-motion.coffee
