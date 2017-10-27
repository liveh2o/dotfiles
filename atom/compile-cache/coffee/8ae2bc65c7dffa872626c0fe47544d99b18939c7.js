(function() {
  var Point, StatusBarView, View, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Point = require('atom').Point;

  View = require('space-pen').View;

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

    StatusBarView.prototype.initialize = function() {
      this.on('click', '.copy', function() {
        var el;
        el = this.parentElement.getElementsByClassName('error-message')[0];
        return atom.clipboard.write(el.innerText);
      });
      return this.on('click', '.goToError', function() {
        var col, line, _ref;
        line = parseInt(this.dataset.line, 10);
        col = parseInt(this.dataset.col, 10);
        return (_ref = atom.workspace.getActiveEditor()) != null ? _ref.setCursorBufferPosition(new Point(line, col)) : void 0;
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

    StatusBarView.prototype.beforeRemove = function() {
      this.off('click', '.copy');
      return this.off('click', '.goToError');
    };

    StatusBarView.prototype.computeMessages = function(messages, position, currentLine, limitOnErrorRange) {
      var index, item, message, pos, showInRange, showOnLine, violation, _i, _len, _ref, _ref1;
      this.violations.empty();
      if (this.showAllErrors) {
        messages.sort(function(a, b) {
          return a.line - b.line;
        });
      }
      for (index = _i = 0, _len = messages.length; _i < _len; index = ++_i) {
        item = messages[index];
        showInRange = ((_ref = item.range) != null ? _ref.containsPoint(position) : void 0) && index <= 10 && limitOnErrorRange;
        showOnLine = ((_ref1 = item.range) != null ? _ref1.start.row : void 0) === currentLine && !limitOnErrorRange;
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
      this.computeMessages(messages, position, currentLine, limitOnErrorRange);
      if (!this.added) {
        atom.workspace.addBottomPanel({
          item: this
        });
        return this.added = true;
      }
    };

    return StatusBarView;

  })(View);

  module.exports = StatusBarView;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxRQUFTLE9BQUEsQ0FBUSxNQUFSLEVBQVQsS0FBRCxDQUFBOztBQUFBLEVBQ0MsT0FBUSxPQUFBLENBQVEsV0FBUixFQUFSLElBREQsQ0FBQTs7QUFBQSxFQUdBLENBQUEsR0FBSSxPQUFBLENBQVEsUUFBUixDQUhKLENBQUE7O0FBQUEsRUFNTTtBQUVKLG9DQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLGFBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLDZDQUFQO09BQUwsRUFBMkQsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDekQsS0FBQyxDQUFBLEVBQUQsQ0FBSTtBQUFBLFlBQUEsT0FBQSxFQUFPLGtCQUFQO0FBQUEsWUFBMkIsTUFBQSxFQUFRLFlBQW5DO1dBQUosRUFEeUQ7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUEzRCxFQURRO0lBQUEsQ0FBVixDQUFBOztBQUFBLDRCQUlBLFVBQUEsR0FBWSxTQUFBLEdBQUE7QUFFVixNQUFBLElBQUMsQ0FBQSxFQUFELENBQUksT0FBSixFQUFhLE9BQWIsRUFBc0IsU0FBQSxHQUFBO0FBQ3BCLFlBQUEsRUFBQTtBQUFBLFFBQUEsRUFBQSxHQUFLLElBQUMsQ0FBQSxhQUFhLENBQUMsc0JBQWYsQ0FBc0MsZUFBdEMsQ0FBdUQsQ0FBQSxDQUFBLENBQTVELENBQUE7ZUFDQSxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQWYsQ0FBcUIsRUFBRSxDQUFDLFNBQXhCLEVBRm9CO01BQUEsQ0FBdEIsQ0FBQSxDQUFBO2FBSUEsSUFBQyxDQUFBLEVBQUQsQ0FB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
//# sourceURL=/Users/ah/.atom/packages/linter/lib/statusbar-view.coffee