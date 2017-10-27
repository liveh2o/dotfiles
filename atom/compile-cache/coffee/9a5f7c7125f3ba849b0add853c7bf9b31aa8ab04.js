(function() {
  var Scroll, ScrollCursor, ScrollCursorToBottom, ScrollCursorToLeft, ScrollCursorToMiddle, ScrollCursorToRight, ScrollCursorToTop, ScrollDown, ScrollHorizontal, ScrollUp,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Scroll = (function() {
    Scroll.prototype.isComplete = function() {
      return true;
    };

    Scroll.prototype.isRecordable = function() {
      return false;
    };

    function Scroll(editorElement) {
      this.editorElement = editorElement;
      this.scrolloff = 2;
      this.editor = this.editorElement.getModel();
      this.rows = {
        first: this.editorElement.getFirstVisibleScreenRow(),
        last: this.editorElement.getLastVisibleScreenRow(),
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
      return this.editor.scrollToScreenPosition([lastScreenRow + count, 0]);
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
      return this.editor.scrollToScreenPosition([firstScreenRow - count, 0]);
    };

    return ScrollUp;

  })(Scroll);

  ScrollCursor = (function(_super) {
    __extends(ScrollCursor, _super);

    function ScrollCursor(editorElement, opts) {
      var cursor;
      this.editorElement = editorElement;
      this.opts = opts != null ? opts : {};
      ScrollCursor.__super__.constructor.apply(this, arguments);
      cursor = this.editor.getCursorScreenPosition();
      this.pixel = this.editorElement.pixelPositionForScreenPosition(cursor).top;
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
      this.pixel -= this.editor.getLineHeightInPixels() * this.scrolloff;
      return this.editorElement.setScrollTop(this.pixel);
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
      this.pixel -= this.editorElement.getHeight() / 2;
      return this.editorElement.setScrollTop(this.pixel);
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
      offset = this.editor.getLineHeightInPixels() * (this.scrolloff + 1);
      this.pixel -= this.editorElement.getHeight() - offset;
      return this.editorElement.setScrollTop(this.pixel);
    };

    ScrollCursorToBottom.prototype.moveToFirstNonBlank = function() {
      return this.editor.moveToFirstCharacterOfLine();
    };

    return ScrollCursorToBottom;

  })(ScrollCursor);

  ScrollHorizontal = (function() {
    ScrollHorizontal.prototype.isComplete = function() {
      return true;
    };

    ScrollHorizontal.prototype.isRecordable = function() {
      return false;
    };

    function ScrollHorizontal(editorElement) {
      var cursorPos;
      this.editorElement = editorElement;
      this.editor = this.editorElement.getModel();
      cursorPos = this.editor.getCursorScreenPosition();
      this.pixel = this.editorElement.pixelPositionForScreenPosition(cursorPos).left;
      this.cursor = this.editor.getLastCursor();
    }

    ScrollHorizontal.prototype.putCursorOnScreen = function() {
      return this.editor.scrollToCursorPosition({
        center: false
      });
    };

    return ScrollHorizontal;

  })();

  ScrollCursorToLeft = (function(_super) {
    __extends(ScrollCursorToLeft, _super);

    function ScrollCursorToLeft() {
      return ScrollCursorToLeft.__super__.constructor.apply(this, arguments);
    }

    ScrollCursorToLeft.prototype.execute = function() {
      this.editorElement.setScrollLeft(this.pixel);
      return this.putCursorOnScreen();
    };

    return ScrollCursorToLeft;

  })(ScrollHorizontal);

  ScrollCursorToRight = (function(_super) {
    __extends(ScrollCursorToRight, _super);

    function ScrollCursorToRight() {
      return ScrollCursorToRight.__super__.constructor.apply(this, arguments);
    }

    ScrollCursorToRight.prototype.execute = function() {
      this.editorElement.setScrollRight(this.pixel);
      return this.putCursorOnScreen();
    };

    return ScrollCursorToRight;

  })(ScrollHorizontal);

  module.exports = {
    ScrollDown: ScrollDown,
    ScrollUp: ScrollUp,
    ScrollCursorToTop: ScrollCursorToTop,
    ScrollCursorToMiddle: ScrollCursorToMiddle,
    ScrollCursorToBottom: ScrollCursorToBottom,
    ScrollCursorToLeft: ScrollCursorToLeft,
    ScrollCursorToRight: ScrollCursorToRight
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3ZpbS1tb2RlL2xpYi9zY3JvbGwuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG9LQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBTTtBQUNKLHFCQUFBLFVBQUEsR0FBWSxTQUFBLEdBQUE7YUFBRyxLQUFIO0lBQUEsQ0FBWixDQUFBOztBQUFBLHFCQUNBLFlBQUEsR0FBYyxTQUFBLEdBQUE7YUFBRyxNQUFIO0lBQUEsQ0FEZCxDQUFBOztBQUVhLElBQUEsZ0JBQUUsYUFBRixHQUFBO0FBQ1gsTUFEWSxJQUFDLENBQUEsZ0JBQUEsYUFDYixDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsU0FBRCxHQUFhLENBQWIsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLE1BQUQsR0FBVSxJQUFDLENBQUEsYUFBYSxDQUFDLFFBQWYsQ0FBQSxDQURWLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxJQUFELEdBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTyxJQUFDLENBQUEsYUFBYSxDQUFDLHdCQUFmLENBQUEsQ0FBUDtBQUFBLFFBQ0EsSUFBQSxFQUFNLElBQUMsQ0FBQSxhQUFhLENBQUMsdUJBQWYsQ0FBQSxDQUROO0FBQUEsUUFFQSxLQUFBLEVBQU8sSUFBQyxDQUFBLE1BQU0sQ0FBQyxnQkFBUixDQUFBLENBRlA7T0FIRixDQURXO0lBQUEsQ0FGYjs7a0JBQUE7O01BREYsQ0FBQTs7QUFBQSxFQVdNO0FBQ0osaUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLHlCQUFBLE9BQUEsR0FBUyxTQUFDLEtBQUQsR0FBQTs7UUFBQyxRQUFNO09BQ2Q7QUFBQSxNQUFBLElBQUMsQ0FBQSxrQkFBRCxDQUFvQixLQUFwQixDQUFBLENBQUE7YUFDQSxJQUFDLENBQUEsUUFBRCxDQUFVLEtBQVYsRUFGTztJQUFB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

//# sourceURL=/Users/ah/.atom/packages/vim-mode/lib/scroll.coffee
