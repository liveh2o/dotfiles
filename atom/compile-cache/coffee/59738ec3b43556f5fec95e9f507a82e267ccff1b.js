(function() {
  var Point, StatusBarView, View, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom'), View = _ref.View, Point = _ref.Point;

  StatusBarView = (function(_super) {
    __extends(StatusBarView, _super);

    function StatusBarView() {
      return StatusBarView.__super__.constructor.apply(this, arguments);
    }

    StatusBarView.content = function() {
      return this.div({
        "class": 'tool-panel panel-bottom padded text-smaller'
      }, (function(_this) {
        return function() {
          return _this.dl({
            "class": 'linter-statusbar',
            outlet: 'violations'
          });
        };
      })(this));
    };

    StatusBarView.prototype.show = function() {
      StatusBarView.__super__.show.apply(this, arguments);
      this.on('click', '.copy', function() {
        var el;
        el = this.parentElement.getElementsByClassName('error-message')[0];
        return atom.clipboard.write(el.innerText);
      });
      return this.on('click', '.goToError', function() {
        var col, line, _ref1;
        line = parseInt(this.dataset.line, 10);
        col = parseInt(this.dataset.col, 10);
        return (_ref1 = atom.workspace.getActiveEditor()) != null ? _ref1.setCursorBufferPosition(new Point(line, col)) : void 0;
      });
    };

    StatusBarView.prototype.highlightLines = function(currentLine) {
      var $line;
      if (!this.showAllErrors) {
        return;
      }
      this.find('.error-message').removeClass('message-highlighted');
      $line = this.find('.linter-line-' + currentLine);
      return $line != null ? $line.addClass('message-highlighted') : void 0;
    };

    StatusBarView.prototype.hide = function() {
      this.off('click', '.copy');
      this.off('click', '.goToError');
      return StatusBarView.__super__.hide.apply(this, arguments);
    };

    StatusBarView.prototype.computeMessages = function(messages, position, currentLine, limitOnErrorRange) {
      var index, item, pos, showInRange, showOnLine, violation, _i, _len, _ref1, _ref2;
      this.violations.empty();
      if (this.showAllErrors) {
        messages.sort(function(a, b) {
          return a.line - b.line;
        });
      }
      for (index = _i = 0, _len = messages.length; _i < _len; index = ++_i) {
        item = messages[index];
        showInRange = ((_ref1 = item.range) != null ? _ref1.containsPoint(position) : void 0) && index <= 10 && limitOnErrorRange;
        showOnLine = ((_ref2 = item.range) != null ? _ref2.start.row : void 0) === currentLine && !limitOnErrorRange;
        if (showInRange || showOnLine || this.showAllErrors) {
          pos = "line: " + item.line;
          if (item.col != null) {
            pos = "" + pos + " / col: " + item.col;
          }
          violation = "<dt>\n  <span class='highlight-" + item.level + "'>" + item.linter + "</span>\n</dt>\n<dd>\n  <span class='copy icon-clippy'></span>\n  <span class='goToError' data-line='" + (item.line - 1) + "' data-col='" + (item.col - 1 || 0) + "'>\n    <span class='error-message linter-line-" + (item.line - 1) + "'>" + item.message + "</span>\n    <span class='pos'>" + pos + "</span>\n  </span>\n</dd>";
          this.violations.append(violation);
        }
      }
      if (violation != null) {
        this.show();
        return this.highlightLines(currentLine);
      }
    };

    StatusBarView.prototype.render = function(messages, editor) {
      var currentLine, limitOnErrorRange, position;
      atom.workspaceView.prependToBottom(this);
      limitOnErrorRange = atom.config.get('linter.showStatusBarWhenCursorIsInErrorRange');
      this.showAllErrors = atom.config.get('linter.showAllErrorsInStatusBar');
      this.hide();
      if (!(messages.length > 0)) {
        return;
      }
      if (editor.getLastCursor() != null) {
        position = editor.getCursorBufferPosition();
      } else {
        return;
      }
      currentLine = position.row;
      return this.computeMessages(messages, position, currentLine, limitOnErrorRange);
    };

    return StatusBarView;

  })(View);

  module.exports = StatusBarView;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdDQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxPQUFnQixPQUFBLENBQVEsTUFBUixDQUFoQixFQUFDLFlBQUEsSUFBRCxFQUFPLGFBQUEsS0FBUCxDQUFBOztBQUFBLEVBR007QUFFSixvQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSxhQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE9BQUEsRUFBTyw2Q0FBUDtPQUFMLEVBQTJELENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQ3pELEtBQUMsQ0FBQSxFQUFELENBQUk7QUFBQSxZQUFBLE9BQUEsRUFBTyxrQkFBUDtBQUFBLFlBQTJCLE1BQUEsRUFBUSxZQUFuQztXQUFKLEVBRHlEO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBM0QsRUFEUTtJQUFBLENBQVYsQ0FBQTs7QUFBQSw0QkFJQSxJQUFBLEdBQU0sU0FBQSxHQUFBO0FBQ0osTUFBQSx5Q0FBQSxTQUFBLENBQUEsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLEVBQUQsQ0FBSSxPQUFKLEVBQWEsT0FBYixFQUFzQixTQUFBLEdBQUE7QUFDcEIsWUFBQSxFQUFBO0FBQUEsUUFBQSxFQUFBLEdBQUssSUFBQyxDQUFBLGFBQWEsQ0FBQyxzQkFBZixDQUFzQyxlQUF0QyxDQUF1RCxDQUFBLENBQUEsQ0FBNUQsQ0FBQTtlQUNBLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBZixDQUFxQixFQUFFLENBQUMsU0FBeEIsRUFGb0I7TUFBQSxDQUF0QixDQUZBLENBQUE7YUFNQSxJQUFDLENBQUEsRUFBRCxDQUFJLE9BQUosRUFBYSxZQUFiLEVBQTJCLFNBQUEsR0FBQTtB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
//# sourceURL=/Users/ah/.atom/packages/linter/lib/statusbar-view.coffee