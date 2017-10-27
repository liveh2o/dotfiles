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
        "class": 'padded text-smaller'
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
        return (_ref = atom.workspace.getActiveTextEditor()) != null ? _ref.setCursorBufferPosition(new Point(line, col)) : void 0;
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

    StatusBarView.prototype.detached = function() {
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

    StatusBarView.prototype.filterInfoMessages = function(messages, config) {
      var msg, showInfoMessages;
      showInfoMessages = config.get('linter.showInfoMessages');
      if (showInfoMessages) {
        return messages;
      }
      return (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = messages.length; _i < _len; _i++) {
          msg = messages[_i];
          if (msg.level !== 'info') {
            _results.push(msg);
          }
        }
        return _results;
      })();
    };

    StatusBarView.prototype.render = function(messages, editor) {
      var currentLine, limitOnErrorRange, position, statusBarConfig;
      statusBarConfig = atom.config.get('linter.statusBar');
      limitOnErrorRange = statusBarConfig === 'Show error if the cursor is in range';
      this.showAllErrors = statusBarConfig === 'Show all errors';
      this.hide();
      messages = this.filterInfoMessages(messages, atom.config);
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
