(function() {
  var AdjustIndentation, Autoindent, Indent, Operator, Outdent, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('underscore-plus');

  Operator = require('./general-operators').Operator;

  AdjustIndentation = (function(_super) {
    __extends(AdjustIndentation, _super);

    function AdjustIndentation() {
      return AdjustIndentation.__super__.constructor.apply(this, arguments);
    }

    AdjustIndentation.prototype.execute = function(count) {
      var mode, originalRanges, range, _i, _len;
      mode = this.vimState.mode;
      this.motion.select(count);
      originalRanges = this.editor.getSelectedBufferRanges();
      if (mode === 'visual') {
        this.editor.transact((function(_this) {
          return function() {
            return _.times(count != null ? count : 1, function() {
              return _this.indent();
            });
          };
        })(this));
      } else {
        this.indent();
      }
      this.editor.clearSelections();
      this.editor.getLastCursor().setBufferPosition([originalRanges.shift().start.row, 0]);
      for (_i = 0, _len = originalRanges.length; _i < _len; _i++) {
        range = originalRanges[_i];
        this.editor.addCursorAtBufferPosition([range.start.row, 0]);
      }
      this.editor.moveToFirstCharacterOfLine();
      return this.vimState.activateNormalMode();
    };

    return AdjustIndentation;

  })(Operator);

  Indent = (function(_super) {
    __extends(Indent, _super);

    function Indent() {
      return Indent.__super__.constructor.apply(this, arguments);
    }

    Indent.prototype.indent = function() {
      return this.editor.indentSelectedRows();
    };

    return Indent;

  })(AdjustIndentation);

  Outdent = (function(_super) {
    __extends(Outdent, _super);

    function Outdent() {
      return Outdent.__super__.constructor.apply(this, arguments);
    }

    Outdent.prototype.indent = function() {
      return this.editor.outdentSelectedRows();
    };

    return Outdent;

  })(AdjustIndentation);

  Autoindent = (function(_super) {
    __extends(Autoindent, _super);

    function Autoindent() {
      return Autoindent.__super__.constructor.apply(this, arguments);
    }

    Autoindent.prototype.indent = function() {
      return this.editor.autoIndentSelectedRows();
    };

    return Autoindent;

  })(AdjustIndentation);

  module.exports = {
    Indent: Indent,
    Outdent: Outdent,
    Autoindent: Autoindent
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3ZpbS1tb2RlL2xpYi9vcGVyYXRvcnMvaW5kZW50LW9wZXJhdG9ycy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsMkRBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVIsQ0FBSixDQUFBOztBQUFBLEVBQ0MsV0FBWSxPQUFBLENBQVEscUJBQVIsRUFBWixRQURELENBQUE7O0FBQUEsRUFHTTtBQUNKLHdDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxnQ0FBQSxPQUFBLEdBQVMsU0FBQyxLQUFELEdBQUE7QUFDUCxVQUFBLHFDQUFBO0FBQUEsTUFBQSxJQUFBLEdBQU8sSUFBQyxDQUFBLFFBQVEsQ0FBQyxJQUFqQixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsTUFBTSxDQUFDLE1BQVIsQ0FBZSxLQUFmLENBREEsQ0FBQTtBQUFBLE1BRUEsY0FBQSxHQUFpQixJQUFDLENBQUEsTUFBTSxDQUFDLHVCQUFSLENBQUEsQ0FGakIsQ0FBQTtBQUlBLE1BQUEsSUFBRyxJQUFBLEtBQVEsUUFBWDtBQUNFLFFBQUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxRQUFSLENBQWlCLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUNmLENBQUMsQ0FBQyxLQUFGLGlCQUFRLFFBQVEsQ0FBaEIsRUFBbUIsU0FBQSxHQUFBO3FCQUFHLEtBQUMsQ0FBQSxNQUFELENBQUEsRUFBSDtZQUFBLENBQW5CLEVBRGU7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFqQixDQUFBLENBREY7T0FBQSxNQUFBO0FBSUUsUUFBQSxJQUFDLENBQUEsTUFBRCxDQUFBLENBQUEsQ0FKRjtPQUpBO0FBQUEsTUFVQSxJQUFDLENBQUEsTUFBTSxDQUFDLGVBQVIsQ0FBQSxDQVZBLENBQUE7QUFBQSxNQVdBLElBQUMsQ0FBQSxNQUFNLENBQUMsYUFBUixDQUFBLENBQXVCLENBQUMsaUJBQXhCLENBQTBDLENBQUMsY0FBYyxDQUFDLEtBQWYsQ0FBQSxDQUFzQixDQUFDLEtBQUssQ0FBQyxHQUE5QixFQUFtQyxDQUFuQyxDQUExQyxDQVhBLENBQUE7QUFZQSxXQUFBLHFEQUFBO21DQUFBO0FBQ0UsUUFBQSxJQUFDLENBQUEsTUFBTSxDQUFDLHlCQUFSLENBQWtDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFiLEVBQWtCLENBQWxCLENBQWxDLENBQUEsQ0FERjtBQUFBLE9BWkE7QUFBQSxNQWNBLElBQUMsQ0FBQSxNQUFNLENBQUMsMEJBQVIsQ0FBQSxDQWRBLENBQUE7YUFlQSxJQUFDLENBQUEsUUFBUSxDQUFDLGtCQUFWLENBQUEsRUFoQk87SUFBQSxDQUFULENBQUE7OzZCQUFBOztLQUQ4QixTQUhoQyxDQUFBOztBQUFBLEVBc0JNO0FBQ0osNkJBQUEsQ0FBQTs7OztLQUFBOztBQUFBLHFCQUFBLE1BQUEsR0FBUSxTQUFBLEdBQUE7YUFDTixJQUFDLENBQUEsTUFBTSxDQUFDLGtCQUFSLENBQUEsRUFETTtJQUFBLENBQVIsQ0FBQTs7a0JBQUE7O0tBRG1CLGtCQXRCckIsQ0FBQTs7QUFBQSxFQTBCTTtBQUNKLDhCQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxzQkFBQSxNQUFBLEdBQVEsU0FBQSxHQUFBO2FBQ04sSUFBQyxDQUFBLE1BQU0sQ0FBQyxtQkFBUixDQUFBLEVBRE07SUFBQSxDQUFSLENBQUE7O21CQUFBOztLQURvQixrQkExQnRCLENBQUE7O0FBQUEsRUE4Qk07QUFDSixpQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEseUJBQUEsTUFBQSxHQUFRLFNBQUEsR0FBQTthQUNOLElBQUMsQ0FBQSxNQUFNLENBQUMsc0JBQVIsQ0FBQSxFQURNO0lBQUEsQ0FBUixDQUFBOztzQkFBQTs7S0FEdUIsa0JBOUJ6QixDQUFBOztBQUFBLEVBa0NBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0FBQUEsSUFBQyxRQUFBLE1BQUQ7QUFBQSxJQUFTLFNBQUEsT0FBVDtBQUFBLElBQWtCLFlBQUEsVUFBbEI7R0FsQ2pCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/ah/.atom/packages/vim-mode/lib/operators/indent-operators.coffee
