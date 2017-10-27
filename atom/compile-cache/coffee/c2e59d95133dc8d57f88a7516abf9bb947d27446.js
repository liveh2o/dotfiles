(function() {
  var Find, MotionWithInput, Point, Range, Till, ViewModel, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  MotionWithInput = require('./general-motions').MotionWithInput;

  ViewModel = require('../view-models/view-model').ViewModel;

  _ref = require('atom'), Point = _ref.Point, Range = _ref.Range;

  Find = (function(_super) {
    __extends(Find, _super);

    Find.prototype.operatesInclusively = true;

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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3ZpbS1tb2RlL2xpYi9tb3Rpb25zL2ZpbmQtbW90aW9uLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwwREFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUMsa0JBQW1CLE9BQUEsQ0FBUSxtQkFBUixFQUFuQixlQUFELENBQUE7O0FBQUEsRUFDQyxZQUFhLE9BQUEsQ0FBUSwyQkFBUixFQUFiLFNBREQsQ0FBQTs7QUFBQSxFQUVBLE9BQWlCLE9BQUEsQ0FBUSxNQUFSLENBQWpCLEVBQUMsYUFBQSxLQUFELEVBQVEsYUFBQSxLQUZSLENBQUE7O0FBQUEsRUFJTTtBQUNKLDJCQUFBLENBQUE7O0FBQUEsbUJBQUEsbUJBQUEsR0FBcUIsSUFBckIsQ0FBQTs7QUFFYSxJQUFBLGNBQUUsTUFBRixFQUFXLFFBQVgsRUFBcUIsSUFBckIsR0FBQTtBQUNYLFVBQUEsSUFBQTtBQUFBLE1BRFksSUFBQyxDQUFBLFNBQUEsTUFDYixDQUFBO0FBQUEsTUFEcUIsSUFBQyxDQUFBLFdBQUEsUUFDdEIsQ0FBQTs7UUFEZ0MsT0FBSztPQUNyQztBQUFBLE1BQUEsc0NBQU0sSUFBQyxDQUFBLE1BQVAsRUFBZSxJQUFDLENBQUEsUUFBaEIsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsTUFBRCxHQUFVLENBRFYsQ0FBQTtBQUdBLE1BQUEsSUFBRyxDQUFBLElBQVEsQ0FBQyxRQUFaO0FBQ0UsUUFBQSxJQUFDLENBQUEsU0FBRCxHQUFpQixJQUFBLFNBQUEsQ0FBVSxJQUFWLEVBQWdCO0FBQUEsVUFBQSxPQUFBLEVBQU8sTUFBUDtBQUFBLFVBQWUsVUFBQSxFQUFZLElBQTNCO0FBQUEsVUFBaUMsTUFBQSxFQUFRLElBQXpDO1NBQWhCLENBQWpCLENBQUE7QUFBQSxRQUNBLElBQUMsQ0FBQSxTQUFELEdBQWEsS0FEYixDQUFBO0FBQUEsUUFFQSxJQUFDLENBQUEsUUFBRCxHQUFZLEtBRlosQ0FBQTtBQUFBLFFBR0EsSUFBQyxDQUFBLFFBQVEsQ0FBQyxjQUFjLENBQUMsV0FBekIsR0FBdUMsSUFIdkMsQ0FERjtPQUFBLE1BQUE7QUFPRSxRQUFBLElBQUMsQ0FBQSxRQUFELEdBQVksSUFBWixDQUFBO0FBQUEsUUFFQSxJQUFBLEdBQU8sSUFBQyxDQUFBLFFBQVEsQ0FBQyxjQUFjLENBQUMsV0FGaEMsQ0FBQTtBQUFBLFFBR0EsSUFBQyxDQUFBLFNBQUQsR0FBYSxJQUFJLENBQUMsU0FIbEIsQ0FBQTtBQUFBLFFBSUEsSUFBQyxDQUFBLFFBQUQsR0FBWSxJQUFJLENBQUMsUUFKakIsQ0FBQTtBQUFBLFFBS0EsSUFBQyxDQUFBLEtBQUQsR0FBUyxJQUFJLENBQUMsS0FMZCxDQUFBO0FBT0EsUUFBQSxJQUFjLElBQUksQ0FBQyxPQUFuQjtBQUFBLFVBQUEsSUFBQyxDQUFBLE9BQUQsQ0FBQSxDQUFBLENBQUE7U0FkRjtPQUpXO0lBQUEsQ0FGYjs7QUFBQSxtQkFzQkEsS0FBQSxHQUFPLFNBQUMsTUFBRCxFQUFTLEtBQVQsR0FBQTtBQUNMLFVBQUEscURBQUE7QUFBQSxNQUFBLGVBQUEsR0FBa0IsTUFBTSxDQUFDLGlCQUFQLENBQUEsQ0FBbEIsQ0FBQTtBQUFBLE1BQ0EsSUFBQSxHQUFPLElBQUMsQ0FBQSxNQUFNLENBQUMsb0JBQVIsQ0FBNkIsZUFBZSxDQUFDLEdBQTdDLENBRFAsQ0FBQTtBQUVBLE1BQUEsSUFBRyxJQUFDLENBQUEsU0FBSjtBQUNFLFFBQUEsS0FBQSxHQUFRLGVBQWUsQ0FBQyxNQUF4QixDQUFBO0FBQ0EsYUFBUyxtR0FBVCxHQUFBO0FBQ0UsVUFBQSxJQUFVLEtBQUEsSUFBUyxDQUFuQjtBQUFBLGtCQUFBLENBQUE7V0FBQTtBQUFBLFVBQ0EsS0FBQSxHQUFRLElBQUksQ0FBQyxXQUFMLENBQWlCLElBQUMsQ0FBQSxLQUFLLENBQUMsVUFBeEIsRUFBb0MsS0FBQSxHQUFNLENBQU4sR0FBUSxDQUFDLElBQUMsQ0FBQSxNQUFELEdBQVEsSUFBQyxDQUFBLFFBQVYsQ0FBNUMsQ0FEUixDQURGO0FBQUEsU0FEQTtBQUlBLFFBQUEsSUFBRyxLQUFBLElBQVMsQ0FBWjtpQkFDTSxJQUFBLEtBQUEsQ0FBTSxlQUFlLENBQUMsR0FBdEIsRUFBMkIsS0FBQSxHQUFRLElBQUMsQ0FBQSxNQUFwQyxFQUROO1NBTEY7T0FBQSxNQUFBO0FBUUUsUUFBQSxLQUFBLEdBQVEsZUFBZSxDQUFDLE1BQXhCLENBQUE7QUFDQSxhQUFTLG1HQUFULEdBQUE7QUFDRSxVQUFBLEtBQUEsR0FBUSxJQUFJLENBQUMsT0FBTCxDQUFhLElBQUMsQ0FBQSxLQUFLLENBQUMsVUFBcEIsRUFBZ0MsS0FBQSxHQUFNLENBQU4sR0FBUSxDQUFDLElBQUMsQ0FBQSxNQUFELEdBQVEsSUFBQyxDQUFBLFFBQVYsQ0FBeEMsQ0FBUixDQUFBO0FBQ0EsVUFBQSxJQUFVLEtBQUEsR0FBUSxDQUFsQjtBQUFBLGtCQUFBLENBQUE7V0FGRjtBQUFBLFNBREE7QUFJQSxRQUFBLElBQUcsS0FBQSxJQUFTLENBQVo7aUJBQ00sSUFBQSxLQUFBLENBQU0sZUFBZSxDQUFDLEdBQXRCLEVBQTJCLEtBQUEsR0FBUSxJQUFDLENBQUEsTUFBcEMsRUFETjtTQVpGO09BSEs7SUFBQSxDQXRCUCxDQUFBOztBQUFBLG1CQXdDQSxPQUFBLEdBQVMsU0FBQSxHQUFBO0FBQ1AsTUFBQSxJQUFDLENBQUEsU0FBRCxHQUFhLENBQUEsSUFBSyxDQUFBLFNBQWxCLENBQUE7YUFDQSxLQUZPO0lBQUEsQ0F4Q1QsQ0FBQTs7QUFBQSxtQkE0Q0EsVUFBQSxHQUFZLFNBQUMsTUFBRCxFQUFTLEtBQVQsR0FBQTtBQUNWLFVBQUEsS0FBQTs7UUFEbUIsUUFBTTtPQUN6QjtBQUFBLE1BQUEsSUFBRywyQ0FBSDtlQUNFLE1BQU0sQ0FBQyxpQkFBUCxDQUF5QixLQUF6QixFQURGO09BRFU7SUFBQSxDQTVDWixDQUFBOztnQkFBQTs7S0FEaUIsZ0JBSm5CLENBQUE7O0FBQUEsRUFxRE07QUFDSiwyQkFBQSxDQUFBOztBQUFhLElBQUEsY0FBRSxNQUFGLEVBQVcsUUFBWCxFQUFxQixJQUFyQixHQUFBO0FBQ1gsTUFEWSxJQUFDLENBQUEsU0FBQSxNQUNiLENBQUE7QUFBQSxNQURxQixJQUFDLENBQUEsV0FBQSxRQUN0QixDQUFBOztRQURnQyxPQUFLO09BQ3JDO0FBQUEsTUFBQSxzQ0FBTSxJQUFDLENBQUEsTUFBUCxFQUFlLElBQUMsQ0FBQSxRQUFoQixFQUEwQixJQUExQixDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxNQUFELEdBQVUsQ0FEVixDQURXO0lBQUEsQ0FBYjs7QUFBQSxtQkFJQSxLQUFBLEdBQU8sU0FBQSxHQUFBO0FBQ0wsVUFBQSxNQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsZ0JBQUQsR0FBb0IsS0FBcEIsQ0FBQTtBQUFBLE1BQ0EsTUFBQSxHQUFTLGlDQUFBLFNBQUEsQ0FEVCxDQUFBO0FBRUEsTUFBQSxJQUFHLGdCQUFBLElBQVksQ0FBQSxJQUFLLENBQUEsU0FBcEI7QUFDRSxRQUFBLElBQUMsQ0FBQSxnQkFBRCxHQUFvQixJQUFwQixDQURGO09BRkE7YUFJQSxPQUxLO0lBQUEsQ0FKUCxDQUFBOztBQUFBLG1CQVdBLHdCQUFBLEdBQTBCLFNBQUMsU0FBRCxFQUFZLEtBQVosRUFBbUIsT0FBbkIsR0FBQTtBQUN4QixNQUFBLG9EQUFBLFNBQUEsQ0FBQSxDQUFBO0FBQ0EsTUFBQSxJQUFHLFNBQVMsQ0FBQyxPQUFWLENBQUEsQ0FBQSxJQUF3QixJQUFDLENBQUEsZ0JBQTVCO2VBQ0UsU0FBUyxDQUFDLGVBQVYsQ0FBMEIsU0FBQSxHQUFBO2lCQUN4QixTQUFTLENBQUMsTUFBTSxDQUFDLFNBQWpCLENBQUEsRUFEd0I7UUFBQSxDQUExQixFQURGO09BRndCO0lBQUEsQ0FYMUIsQ0FBQTs7Z0JBQUE7O0tBRGlCLEtBckRuQixDQUFBOztBQUFBLEVBdUVBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0FBQUEsSUFBQyxNQUFBLElBQUQ7QUFBQSxJQUFPLE1BQUEsSUFBUDtHQXZFakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/ah/.atom/packages/vim-mode/lib/motions/find-motion.coffee
