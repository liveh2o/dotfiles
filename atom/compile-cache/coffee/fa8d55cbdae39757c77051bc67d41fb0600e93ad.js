(function() {
  var StatusBarSummary, StatusBarSummaryView, View, moveToNextMessage,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('space-pen').View;

  moveToNextMessage = require('./utils').moveToNextMessage;

  StatusBarSummaryView = (function() {
    function StatusBarSummaryView() {}

    StatusBarSummaryView.prototype.remove = function() {
      if (this.tile != null) {
        this.tile.destroy();
      }
      return this.tile = null;
    };

    StatusBarSummaryView.prototype.render = function(messages, editor) {
      var el, error, info, item, statusBar, warning, _i, _len;
      statusBar = document.querySelector("status-bar");
      if (statusBar == null) {
        return;
      }
      this.remove();
      info = warning = error = 0;
      for (_i = 0, _len = messages.length; _i < _len; _i++) {
        item = messages[_i];
        if (item.level === 'info') {
          info += 1;
        }
        if (item.level === 'warning') {
          warning += 1;
        }
        if (item.level === 'error') {
          error += 1;
        }
      }
      if (info + warning + error === 0) {
        return;
      }
      el = new StatusBarSummary(messages, editor, info, warning, error);
      return this.tile = statusBar.addRightTile({
        item: el,
        priority: 100
      });
    };

    return StatusBarSummaryView;

  })();

  StatusBarSummary = (function(_super) {
    __extends(StatusBarSummary, _super);

    function StatusBarSummary() {
      return StatusBarSummary.__super__.constructor.apply(this, arguments);
    }

    StatusBarSummary.prototype.initialize = function(messages, editor) {
      if (!(messages.length > 0)) {
        return;
      }
      return this.on('click', function() {
        return moveToNextMessage(messages, editor);
      });
    };

    StatusBarSummary.content = function(messages, editor, info, warning, error) {
      return this.div({
        "class": 'linter-summary inline-block'
      }, (function(_this) {
        return function() {
          if (error > 0) {
            _this.div({
              "class": 'linter-error inline-block'
            }, error, function() {
              return _this.span({
                "class": 'icon-right'
              });
            });
          }
          if (warning > 0) {
            _this.div({
              "class": 'linter-warning inline-block'
            }, warning, function() {
              return _this.span({
                "class": 'icon-right'
              });
            });
          }
          if (info > 0) {
            return _this.div({
              "class": 'linter-info inline-block'
            }, info, function() {
              return _this.span({
                "class": 'icon-right'
              });
            });
          }
        };
      })(this));
    };

    StatusBarSummary.prototype.detached = function() {
      return this.off('click', '.linter-summary-click-container');
    };

    return StatusBarSummary;

  })(View);

  module.exports = StatusBarSummaryView;

}).call(this);
