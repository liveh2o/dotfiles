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
      var cursor, newFirstRow, oldFirstRow, position, _i, _len, _ref;
      if (count == null) {
        count = 1;
      }
      oldFirstRow = this.editor.getFirstVisibleScreenRow();
      this.editor.setFirstVisibleScreenRow(oldFirstRow + count);
      newFirstRow = this.editor.getFirstVisibleScreenRow();
      _ref = this.editor.getCursors();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        cursor = _ref[_i];
        position = cursor.getScreenPosition();
        if (position.row <= newFirstRow + this.scrolloff) {
          cursor.setScreenPosition([position.row + newFirstRow - oldFirstRow, position.column], {
            autoscroll: false
          });
        }
      }
      this.editorElement.component.updateSync();
    };

    return ScrollDown;

  })(Scroll);

  ScrollUp = (function(_super) {
    __extends(ScrollUp, _super);

    function ScrollUp() {
      return ScrollUp.__super__.constructor.apply(this, arguments);
    }

    ScrollUp.prototype.execute = function(count) {
      var cursor, newLastRow, oldFirstRow, oldLastRow, position, _i, _len, _ref;
      if (count == null) {
        count = 1;
      }
      oldFirstRow = this.editor.getFirstVisibleScreenRow();
      oldLastRow = this.editor.getLastVisibleScreenRow();
      this.editor.setFirstVisibleScreenRow(oldFirstRow - count);
      newLastRow = this.editor.getLastVisibleScreenRow();
      _ref = this.editor.getCursors();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        cursor = _ref[_i];
        position = cursor.getScreenPosition();
        if (position.row >= newLastRow - this.scrolloff) {
          cursor.setScreenPosition([position.row - (oldLastRow - newLastRow), position.column], {
            autoscroll: false
          });
        }
      }
      this.editorElement.component.updateSync();
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3ZpbS1tb2RlL2xpYi9zY3JvbGwuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG9LQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBTTtBQUNKLHFCQUFBLFVBQUEsR0FBWSxTQUFBLEdBQUE7YUFBRyxLQUFIO0lBQUEsQ0FBWixDQUFBOztBQUFBLHFCQUNBLFlBQUEsR0FBYyxTQUFBLEdBQUE7YUFBRyxNQUFIO0lBQUEsQ0FEZCxDQUFBOztBQUVhLElBQUEsZ0JBQUUsYUFBRixHQUFBO0FBQ1gsTUFEWSxJQUFDLENBQUEsZ0JBQUEsYUFDYixDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsU0FBRCxHQUFhLENBQWIsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLE1BQUQsR0FBVSxJQUFDLENBQUEsYUFBYSxDQUFDLFFBQWYsQ0FBQSxDQURWLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxJQUFELEdBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTyxJQUFDLENBQUEsYUFBYSxDQUFDLHdCQUFmLENBQUEsQ0FBUDtBQUFBLFFBQ0EsSUFBQSxFQUFNLElBQUMsQ0FBQSxhQUFhLENBQUMsdUJBQWYsQ0FBQSxDQUROO0FBQUEsUUFFQSxLQUFBLEVBQU8sSUFBQyxDQUFBLE1BQU0sQ0FBQyxnQkFBUixDQUFBLENBRlA7T0FIRixDQURXO0lBQUEsQ0FGYjs7a0JBQUE7O01BREYsQ0FBQTs7QUFBQSxFQVdNO0FBQ0osaUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLHlCQUFBLE9BQUEsR0FBUyxTQUFDLEtBQUQsR0FBQTtBQUNQLFVBQUEsMERBQUE7O1FBRFEsUUFBTTtPQUNkO0FBQUEsTUFBQSxXQUFBLEdBQWMsSUFBQyxDQUFBLE1BQU0sQ0FBQyx3QkFBUixDQUFBLENBQWQsQ0FBQTtBQUFBLE1BQ0Es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

//# sourceURL=/Users/ah/.atom/packages/vim-mode/lib/scroll.coffee
