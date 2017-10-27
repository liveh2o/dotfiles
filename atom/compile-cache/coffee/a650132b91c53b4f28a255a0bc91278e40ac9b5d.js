(function() {
  var Scroll, ScrollCursor, ScrollCursorToBottom, ScrollCursorToMiddle, ScrollCursorToTop, ScrollDown, ScrollUp,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Scroll = (function() {
    Scroll.prototype.isComplete = function() {
      return true;
    };

    Scroll.prototype.isRecordable = function() {
      return false;
    };

    function Scroll(editorView, editor) {
      this.editorView = editorView;
      this.editor = editor;
      this.scrolloff = 2;
      this.rows = {
        first: this.editor.getFirstVisibleScreenRow(),
        last: this.editor.getLastVisibleScreenRow(),
        final: this.editor.getLastScreenRow()
      };
    }

    return Scroll;

  })();

  ScrollDown = (function(_super) {
    __extends(ScrollDown, _super);

    function ScrollDown() {
      return ScrollDown.__super__.constructor.apply(this, arguments);
    }

    ScrollDown.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      this.keepCursorOnScreen(count);
      return this.scrollUp(count);
    };

    ScrollDown.prototype.keepCursorOnScreen = function(count) {
      var column, firstScreenRow, row, _ref;
      _ref = this.editor.getCursorScreenPosition(), row = _ref.row, column = _ref.column;
      firstScreenRow = this.rows.first + this.scrolloff + 1;
      if (row - count <= firstScreenRow) {
        return this.editor.setCursorScreenPosition([firstScreenRow + count, column]);
      }
    };

    ScrollDown.prototype.scrollUp = function(count) {
      var lastScreenRow;
      lastScreenRow = this.rows.last - this.scrolloff;
      return this.editorView.scrollToScreenPosition([lastScreenRow + count, 0]);
    };

    return ScrollDown;

  })(Scroll);

  ScrollUp = (function(_super) {
    __extends(ScrollUp, _super);

    function ScrollUp() {
      return ScrollUp.__super__.constructor.apply(this, arguments);
    }

    ScrollUp.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      this.keepCursorOnScreen(count);
      return this.scrollDown(count);
    };

    ScrollUp.prototype.keepCursorOnScreen = function(count) {
      var column, lastScreenRow, row, _ref;
      _ref = this.editor.getCursorScreenPosition(), row = _ref.row, column = _ref.column;
      lastScreenRow = this.rows.last - this.scrolloff - 1;
      if (row + count >= lastScreenRow) {
        return this.editor.setCursorScreenPosition([lastScreenRow - count, column]);
      }
    };

    ScrollUp.prototype.scrollDown = function(count) {
      var firstScreenRow;
      firstScreenRow = this.rows.first + this.scrolloff;
      return this.editorView.scrollToScreenPosition([firstScreenRow - count, 0]);
    };

    return ScrollUp;

  })(Scroll);

  ScrollCursor = (function(_super) {
    __extends(ScrollCursor, _super);

    function ScrollCursor(editorView, editor, opts) {
      var cursor;
      this.editorView = editorView;
      this.editor = editor;
      this.opts = opts != null ? opts : {};
      ScrollCursor.__super__.constructor.apply(this, arguments);
      cursor = this.editor.getCursorScreenPosition();
      this.pixel = this.editorView.pixelPositionForScreenPosition(cursor).top;
    }

    return ScrollCursor;

  })(Scroll);

  ScrollCursorToTop = (function(_super) {
    __extends(ScrollCursorToTop, _super);

    function ScrollCursorToTop() {
      return ScrollCursorToTop.__super__.constructor.apply(this, arguments);
    }

    ScrollCursorToTop.prototype.execute = function() {
      if (!this.opts.leaveCursor) {
        this.moveToFirstNonBlank();
      }
      return this.scrollUp();
    };

    ScrollCursorToTop.prototype.scrollUp = function() {
      if (this.rows.last === this.rows.final) {
        return;
      }
      this.pixel -= this.editorView.lineHeight * this.scrolloff;
      return this.editorView.scrollTop(this.pixel);
    };

    ScrollCursorToTop.prototype.moveToFirstNonBlank = function() {
      return this.editor.moveToFirstCharacterOfLine();
    };

    return ScrollCursorToTop;

  })(ScrollCursor);

  ScrollCursorToMiddle = (function(_super) {
    __extends(ScrollCursorToMiddle, _super);

    function ScrollCursorToMiddle() {
      return ScrollCursorToMiddle.__super__.constructor.apply(this, arguments);
    }

    ScrollCursorToMiddle.prototype.execute = function() {
      if (!this.opts.leaveCursor) {
        this.moveToFirstNonBlank();
      }
      return this.scrollMiddle();
    };

    ScrollCursorToMiddle.prototype.scrollMiddle = function() {
      this.pixel -= this.editorView.height() / 2;
      return this.editorView.scrollTop(this.pixel);
    };

    ScrollCursorToMiddle.prototype.moveToFirstNonBlank = function() {
      return this.editor.moveToFirstCharacterOfLine();
    };

    return ScrollCursorToMiddle;

  })(ScrollCursor);

  ScrollCursorToBottom = (function(_super) {
    __extends(ScrollCursorToBottom, _super);

    function ScrollCursorToBottom() {
      return ScrollCursorToBottom.__super__.constructor.apply(this, arguments);
    }

    ScrollCursorToBottom.prototype.execute = function() {
      if (!this.opts.leaveCursor) {
        this.moveToFirstNonBlank();
      }
      return this.scrollDown();
    };

    ScrollCursorToBottom.prototype.scrollDown = function() {
      var offset;
      if (this.rows.first === 0) {
        return;
      }
      offset = this.editorView.lineHeight * (this.scrolloff + 1);
      this.pixel -= this.editorView.height() - offset;
      return this.editorView.scrollTop(this.pixel);
    };

    ScrollCursorToBottom.prototype.moveToFirstNonBlank = function() {
      return this.editor.moveToFirstCharacterOfLine();
    };

    return ScrollCursorToBottom;

  })(ScrollCursor);

  module.exports = {
    ScrollDown: ScrollDown,
    ScrollUp: ScrollUp,
    ScrollCursorToTop: ScrollCursorToTop,
    ScrollCursorToMiddle: ScrollCursorToMiddle,
    ScrollCursorToBottom: ScrollCursorToBottom
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHlHQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBTTtBQUNKLHFCQUFBLFVBQUEsR0FBWSxTQUFBLEdBQUE7YUFBRyxLQUFIO0lBQUEsQ0FBWixDQUFBOztBQUFBLHFCQUNBLFlBQUEsR0FBYyxTQUFBLEdBQUE7YUFBRyxNQUFIO0lBQUEsQ0FEZCxDQUFBOztBQUVhLElBQUEsZ0JBQUUsVUFBRixFQUFlLE1BQWYsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLGFBQUEsVUFDYixDQUFBO0FBQUEsTUFEeUIsSUFBQyxDQUFBLFNBQUEsTUFDMUIsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLFNBQUQsR0FBYSxDQUFiLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxJQUFELEdBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTyxJQUFDLENBQUEsTUFBTSxDQUFDLHdCQUFSLENBQUEsQ0FBUDtBQUFBLFFBQ0EsSUFBQSxFQUFNLElBQUMsQ0FBQSxNQUFNLENBQUMsdUJBQVIsQ0FBQSxDQUROO0FBQUEsUUFFQSxLQUFBLEVBQU8sSUFBQyxDQUFBLE1BQU0sQ0FBQyxnQkFBUixDQUFBLENBRlA7T0FGRixDQURXO0lBQUEsQ0FGYjs7a0JBQUE7O01BREYsQ0FBQTs7QUFBQSxFQVVNO0FBQ0osaUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLHlCQUFBLE9BQUEsR0FBUyxTQUFDLEtBQUQsR0FBQTs7UUFBQyxRQUFNO09BQ2Q7QUFBQSxNQUFBLElBQUMsQ0FBQSxrQkFBRCxDQUFvQixLQUFwQixDQUFBLENBQUE7YUFDQSxJQUFDLENBQUEsUUFBRCxDQUFVLEtBQVYsRUFGTztJQUFBLENBQVQsQ0FBQTs7QUFBQSx5QkFJQSxrQkFBQSxHQUFvQixTQUFDLEtBQUQsR0FBQTtBQUNsQixVQUFBLGlDQUFBO0FBQUEsTUFBQSxPQUFnQixJQUFDLENBQUEsTUFBTSxDQUFDLHVCQUFSLENBQUEsQ0FBaEIsRUFBQyxXQUFBLEdBQUQsRUFBTSxjQUFBLE1BQU4sQ0FBQTtBQUFBLE1BQ0EsY0FBQSxHQUFpQixJQUFDLENBQUEsSUFBSSxDQUFDLEtBQU4sR0FBYyxJQUFDLENBQUEsU0FBZixHQUEyQixDQUQ1QyxDQUFBO0FBRUEsTUFBQSxJQUFHLEdBQUEsR0FBTSxLQUFOLElBQWUsY0FBbEI7ZUFDRSxJQUFDLENBQUEsTUFBTSxDQUFDLHVCQUFSLENBQWdDLENBQUMsY0FBQSxHQUFpQixLQUFsQixFQUF5QixNQUF6QixDQUFoQyxFQURGO09BSGtCO0lBQUEsQ0FKcEIsQ0FBQTs7QUFBQSx5QkFVQSxRQUFBLEdBQVUsU0FBQyxLQUFELEdBQUE7QUFDUixVQUFBLGFBQUE7QUFBQSxNQUFBLGFBQUEsR0FBZ0IsSUFBQyxDQUFBLElBQUksQ0FBQyxJQUFOLEdBQWEsSUFBQyxDQUFBLFNBQTlCLENBQUE7YUFDQSxJQUFDLENBQUEsVUFBVSxDQUFDLHNCQUFaLENBQW1DLENBQUMsYUFBQSxHQUFnQixLQUFqQixFQUF3QixDQUF4QixDQUFuQyxFQUZRO0lBQUEsQ0FWVixDQUFBOztzQkFBQTs7S0FEdUIsT0FWekIsQ0FBQTs7QUFBQSxFQXlCTTtBQUNKLCtCQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSx1QkFBQSxPQUFBLEdBQVMsU0FBQyxLQUFELEdBQUE7O1FBQUMsUUFBTTtPQUNkO0FBQUEsTUFBQSxJQUFDLENBQUEsa0JBQUQsQ0FBb0IsS0FBcEIsQ0FBQSxDQUFBO2FBQ0EsSUFBQyxDQUFBLFVBQUQsQ0FBWSxLQUFaLEVBRk87SUFBQSxDQUFULENBQUE7O0FBQUEsdUJBSUEsa0JBQUEsR0FBb0IsU0FBQyxLQUFELEdBQUE7QUFDbEIsVUFBQSxnQ0FBQTtBQUFBLE1BQUEsT0FBZ0IsSUFBQyxDQUFBLE1BQU0sQ0FBQyx1QkFBUixDQUFBLENBQWhCLEVBQUMsV0FBQSxHQUFELEVBQU0sY0FBQSxNQUFOLENBQUE7QUFBQSxNQUNBLGFBQUEsR0FBZ0IsSUFBQyxDQUFBLElBQUksQ0FBQyxJQUFOLEdBQWEsSUFBQyxDQUFBLFNBQWQsR0FBMEIsQ0FEMUMsQ0FBQTtBQUVBLE1BQUEsSUFBRyxHQUFBLEdBQU0sS0FBTixJQUFlLGFBQWxCO2VBQ0ksSUFBQyxDQUFBLE1BQU0sQ0FBQyx1QkFBUixDQUFnQyxDQUFDLGFBQUEsR0FBZ0IsS0FBakIsRUFBd0IsTUFBeEIsQ0FBaEMsRUFESjtPQUhrQjtJQUFBLENBSnBCLENBQUE7O0FBQUEsdUJBVUEsVUFBQSxHQUFZLFNBQUMsS0FBRCxHQUFBO0FBQ1YsVUFBQSxjQUFBO0FBQUEsTUFBQSxjQUFBLEdBQWlCLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBTixHQUFjLElBQUMsQ0FBQSxTQUFoQyxDQUFBO2FBQ0EsSUFBQyxDQUFBLFVBQVUsQ0FBQyxzQkFBWixDQUFtQyxDQUFDLGNBQUEsR0FBaUIsS0FBbEIsRUFBeUIsQ0FBekIsQ0FBbkMsRUFGVTtJQUFBLENBVlosQ0FBQTs7b0JBQUE7O0tBRHFCLE9BekJ2QixDQUFBOztBQUFBLEVBd0NNO0FBQ0osbUNBQUEsQ0FBQTs7QUFBYSxJQUFBLHNCQUFFLFVBQUYsRUFBZSxNQUFmLEVBQXdCLElBQXhCLEdBQUE7QUFDWCxVQUFBLE1BQUE7QUFBQSxNQURZLElBQUMsQ0FBQSxhQUFBLFVBQ2IsQ0FBQTtBQUFBLE1BRHlCLElBQUMsQ0FBQSxTQUFBLE1BQzFCLENBQUE7QUFBQSxNQURrQyxJQUFDLENBQUEsc0JBQUEsT0FBSyxFQUN4QyxDQUFBO0FBQUEsTUFBQSwrQ0FBQSxTQUFBLENBQUEsQ0FBQTtBQUFBLE1BQ0EsTUFBQSxHQUFTLElBQUMsQ0FBQSxNQUFNLENBQUMsdUJBQVIsQ0FBQSxDQURULENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxLQUFELEdBQVMsSUFBQyxDQUFBLFVBQVUsQ0FBQyw4QkFBWixDQUEyQyxNQUEzQyxDQUFrRCxDQUFDLEdBRjVELENBRFc7SUFBQSxDQUFiOzt3QkFBQTs7S0FEeUIsT0F4QzNCLENBQUE7O0FBQUEsRUE4Q007QUFDSix3Q0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsZ0NBQUEsT0FBQSxHQUFTLFNBQUEsR0FBQTtBQUNQLE1BQUEsSUFBQSxDQUFBLElBQStCLENBQUEsSUFBSSxDQUFDLFdBQXBDO0FBQUEsUUFBQSxJQUFDLENBQUEsbUJBQUQsQ0FBQSxDQUFBLENBQUE7T0FBQTthQUNBLElBQUMsQ0FBQSxRQUFELENBQUEsRUFGTztJQUFBLENBQVQsQ0FBQTs7QUFBQSxnQ0FJQSxRQUFBLEdBQVUsU0FBQSxHQUFBO0FBQ1IsTUFBQSxJQUFVLElBQUMsQ0FBQSxJQUFJLENBQUMsSUFBTixLQUFjLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBOUI7QUFBQSxjQUFBLENBQUE7T0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLEtBQUQsSUFBVyxJQUFDLENBQUEsVUFBVSxDQUFDLFVBQVosR0FBeUIsSUFBQyxDQUFBLFNBRHJDLENBQUE7YUFFQSxJQUFDLENBQUEsVUFBVSxDQUFDLFNBQVosQ0FBc0IsSUFBQyxDQUFBLEtBQXZCLEVBSFE7SUFBQSxDQUpWLENBQUE7O0FBQUEsZ0NBU0EsbUJBQUEsR0FBcUIsU0FBQSxHQUFBO2FBQ25CLElBQUMsQ0FBQSxNQUFNLENBQUMsMEJBQVIsQ0FBQSxFQURtQjtJQUFBLENBVHJCLENBQUE7OzZCQUFBOztLQUQ4QixhQTlDaEMsQ0FBQTs7QUFBQSxFQTJETTtBQUNKLDJDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxtQ0FBQSxPQUFBLEdBQVMsU0FBQSxHQUFBO0FBQ1AsTUFBQSxJQUFBLENBQUEsSUFBK0IsQ0FBQSxJQUFJLENBQUMsV0FBcEM7QUFBQSxRQUFBLElBQUMsQ0FBQSxtQkFBRCxDQUFBLENBQUEsQ0FBQTtPQUFBO2FBQ0EsSUFBQyxDQUFBLFlBQUQsQ0FBQSxFQUZPO0lBQUEsQ0FBVCxDQUFBOztBQUFBLG1DQUlBLFlBQUEsR0FBYyxTQUFBLEdBQUE7QUFDWixNQUFBLElBQUMsQ0FBQSxLQUFELElBQVcsSUFBQyxDQUFBLFVBQVUsQ0FBQyxNQUFaLENBQUEsQ0FBQSxHQUF1QixDQUFsQyxDQUFBO2FBQ0EsSUFBQyxDQUFBLFVBQVUsQ0FBQyxTQUFaLENBQXNCLElBQUMsQ0FBQSxLQUF2QixFQUZZO0lBQUEsQ0FKZCxDQUFBOztBQUFBLG1DQVFBLG1CQUFBLEdBQXFCLFNBQUEsR0FBQTthQUNuQixJQUFDLENBQUEsTUFBTSxDQUFDLDBCQUFSLENBQUEsRUFEbUI7SUFBQSxDQVJyQixDQUFBOztnQ0FBQTs7S0FEaUMsYUEzRG5DLENBQUE7O0FBQUEsRUF1RU07QUFDSiwyQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsbUNBQUEsT0FBQSxHQUFTLFNBQUEsR0FBQTtBQUNQLE1BQUEsSUFBQSxDQUFBLElBQStCLENBQUEsSUFBSSxDQUFDLFdBQXBDO0FBQUEsUUFBQSxJQUFDLENBQUEsbUJBQUQsQ0FBQSxDQUFBLENBQUE7T0FBQTthQUNBLElBQUMsQ0FBQSxVQUFELENBQUEsRUFGTztJQUFBLENBQVQsQ0FBQTs7QUFBQSxtQ0FJQSxVQUFBLEdBQVksU0FBQSxHQUFBO0FBQ1YsVUFBQSxNQUFBO0FBQUEsTUFBQSxJQUFVLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBTixLQUFlLENBQXpCO0FBQUEsY0FBQSxDQUFBO09BQUE7QUFBQSxNQUNBLE1BQUEsR0FBVSxJQUFDLENBQUEsVUFBVSxDQUFDLFVBQVosR0FBeUIsQ0FBQyxJQUFDLENBQUEsU0FBRCxHQUFhLENBQWQsQ0FEbkMsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLEtBQUQsSUFBVyxJQUFDLENBQUEsVUFBVSxDQUFDLE1BQVosQ0FBQSxDQUFBLEdBQXVCLE1BRmxDLENBQUE7YUFHQSxJQUFDLENBQUEsVUFBVSxDQUFDLFNBQVosQ0FBc0IsSUFBQyxDQUFBLEtBQXZCLEVBSlU7SUFBQSxDQUpaLENBQUE7O0FBQUEsbUNBVUEsbUJBQUEsR0FBcUIsU0FBQSxHQUFBO2FBQ25CLElBQUMsQ0FBQSxNQUFNLENBQUMsMEJBQVIsQ0FBQSxFQURtQjtJQUFBLENBVnJCLENBQUE7O2dDQUFBOztLQURpQyxhQXZFbkMsQ0FBQTs7QUFBQSxFQXFGQSxNQUFNLENBQUMsT0FBUCxHQUFpQjtBQUFBLElBQUUsWUFBQSxVQUFGO0FBQUEsSUFBYyxVQUFBLFFBQWQ7QUFBQSxJQUF3QixtQkFBQSxpQkFBeEI7QUFBQSxJQUEyQyxzQkFBQSxvQkFBM0M7QUFBQSxJQUFpRSxzQkFBQSxvQkFBakU7R0FyRmpCLENBQUE7QUFBQSIKfQ==
//# sourceURL=/Users/ah/.atom/packages/vim-mode/lib/scroll.coffee