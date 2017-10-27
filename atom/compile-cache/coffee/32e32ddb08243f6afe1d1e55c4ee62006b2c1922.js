(function() {
  var Point, StatusBarView, View, _, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom'), View = _ref.View, Point = _ref.Point;

  _ = require('lodash');

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
      var index, item, message, pos, showInRange, showOnLine, violation, _i, _len, _ref1, _ref2;
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
          message = _.escape(item.message);
          violation = "<dt>\n  <span class='highlight-" + item.level + "'>" + item.linter + "</span>\n</dt>\n<dd>\n  <span class='copy icon-clippy'></span>\n  <span class='goToError' data-line='" + (item.line - 1) + "' data-col='" + (item.col - 1 || 0) + "'>\n    <span class='error-message linter-line-" + (item.line - 1) + "'>" + message + "</span>\n    <span class='pos'>" + pos + "</span>\n  </span>\n</dd>";
          this.violations.append(violation);
        }
      }
      if (violation != null) {
        this.show();
        return this.highlightLines(currentLine);
      }
    };

    StatusBarView.prototype.render = function(messages, editor) {
      var currentLine, limitOnErrorRange, position, statusBarConfig;
      atom.workspaceView.prependToBottom(this);
      statusBarConfig = atom.config.get('linter.statusBar');
      limitOnErrorRange = statusBarConfig === 'Show error if the cursor is in range';
      this.showAllErrors = statusBarConfig === 'Show all errors';
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1DQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxPQUFnQixPQUFBLENBQVEsTUFBUixDQUFoQixFQUFDLFlBQUEsSUFBRCxFQUFPLGFBQUEsS0FBUCxDQUFBOztBQUFBLEVBQ0EsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSLENBREosQ0FBQTs7QUFBQSxFQUlNO0FBRUosb0NBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsYUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sNkNBQVA7T0FBTCxFQUEyRCxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUN6RCxLQUFDLENBQUEsRUFBRCxDQUFJO0FBQUEsWUFBQSxPQUFBLEVBQU8sa0JBQVA7QUFBQSxZQUEyQixNQUFBLEVBQVEsWUFBbkM7V0FBSixFQUR5RDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTNELEVBRFE7SUFBQSxDQUFWLENBQUE7O0FBQUEsNEJBSUEsSUFBQSxHQUFNLFNBQUEsR0FBQTtBQUNKLE1BQUEseUNBQUEsU0FBQSxDQUFBLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxFQUFELENBQUksT0FBSixFQUFhLE9BQWIsRUFBc0IsU0FBQSxHQUFBO0FBQ3BCLFlBQUEsRUFBQTtBQUFBLFFBQUEsRUFBQSxHQUFLLElBQUMsQ0FBQSxhQUFhLENBQUMsc0JBQWYsQ0FBc0MsZUFBdEMsQ0FBdUQsQ0FBQSxDQUFBLENBQTVELENBQUE7ZUFDQSxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQWYsQ0FBcUIsRUFBRSxDQUFDLFNBQXhCLEVBRm9CO01BQUEsQ0FBdEIsQ0FGQSxDQUFBO2FBTUEsSUFBQyxD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
//# sourceURL=/Users/ah/.atom/packages/linter/lib/statusbar-view.coffee