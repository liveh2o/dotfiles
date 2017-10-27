(function() {
  var StatusBarSummary, StatusBarSummaryView, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom').View;

  StatusBarSummaryView = (function() {
    function StatusBarSummaryView() {}

    StatusBarSummaryView.prototype.remove = function() {
      if (this.decoration != null) {
        this.decoration.remove();
      }
      return this.decoration = null;
    };

    StatusBarSummaryView.prototype.render = function(messages) {
      var error, item, statusBar, warning, _i, _len;
      statusBar = atom.workspaceView.statusBar;
      if (!statusBar) {
        return;
      }
      warning = error = 0;
      for (_i = 0, _len = messages.length; _i < _len; _i++) {
        item = messages[_i];
        if (item.level === 'warning') {
          warning += 1;
        }
        if (item.level === 'error') {
          error += 1;
        }
      }
      this.remove();
      this.decoration = new StatusBarSummary(warning || 0, error || 0);
      return statusBar.prependRight(this.decoration);
    };

    return StatusBarSummaryView;

  })();

  StatusBarSummary = (function(_super) {
    __extends(StatusBarSummary, _super);

    function StatusBarSummary() {
      return StatusBarSummary.__super__.constructor.apply(this, arguments);
    }

    StatusBarSummary.content = function(warning, error) {
      return this.div({
        "class": 'linter-summary inline-block'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'linter-warning inline-block'
          }, warning, function() {
            return _this.span({
              "class": 'icon-right'
            });
          });
          return _this.div({
            "class": 'linter-error inline-block'
          }, error, function() {
            return _this.span({
              "class": 'icon-right'
            });
          });
        };
      })(this));
    };

    return StatusBarSummary;

  })(View);

  module.exports = StatusBarSummaryView;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDRDQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxPQUFRLE9BQUEsQ0FBUSxNQUFSLEVBQVIsSUFBRCxDQUFBOztBQUFBLEVBR007c0NBQ0o7O0FBQUEsbUNBQUEsTUFBQSxHQUFRLFNBQUEsR0FBQTtBQUNOLE1BQUEsSUFBd0IsdUJBQXhCO0FBQUEsUUFBQSxJQUFDLENBQUEsVUFBVSxDQUFDLE1BQVosQ0FBQSxDQUFBLENBQUE7T0FBQTthQUNBLElBQUMsQ0FBQSxVQUFELEdBQWMsS0FGUjtJQUFBLENBQVIsQ0FBQTs7QUFBQSxtQ0FLQSxNQUFBLEdBQVEsU0FBQyxRQUFELEdBQUE7QUFDTixVQUFBLHlDQUFBO0FBQUEsTUFBQSxTQUFBLEdBQVksSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUEvQixDQUFBO0FBQ0EsTUFBQSxJQUFBLENBQUEsU0FBQTtBQUFBLGNBQUEsQ0FBQTtPQURBO0FBQUEsTUFHQSxPQUFBLEdBQVUsS0FBQSxHQUFRLENBSGxCLENBQUE7QUFLQSxXQUFBLCtDQUFBOzRCQUFBO0FBQ0UsUUFBQSxJQUFnQixJQUFJLENBQUMsS0FBTCxLQUFjLFNBQTlCO0FBQUEsVUFBQSxPQUFBLElBQVcsQ0FBWCxDQUFBO1NBQUE7QUFDQSxRQUFBLElBQWMsSUFBSSxDQUFDLEtBQUwsS0FBYyxPQUE1QjtBQUFBLFVBQUEsS0FBQSxJQUFTLENBQVQsQ0FBQTtTQUZGO0FBQUEsT0FMQTtBQUFBLE1BVUEsSUFBQyxDQUFBLE1BQUQsQ0FBQSxDQVZBLENBQUE7QUFBQSxNQVlBLElBQUMsQ0FBQSxVQUFELEdBQWtCLElBQUEsZ0JBQUEsQ0FBaUIsT0FBQSxJQUFXLENBQTVCLEVBQStCLEtBQUEsSUFBUyxDQUF4QyxDQVpsQixDQUFBO2FBY0EsU0FBUyxDQUFDLFlBQVYsQ0FBdUIsSUFBQyxDQUFBLFVBQXhCLEVBZk07SUFBQSxDQUxSLENBQUE7O2dDQUFBOztNQUpGLENBQUE7O0FBQUEsRUEwQk07QUFDSix1Q0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSxnQkFBQyxDQUFBLE9BQUQsR0FBVSxTQUFDLE9BQUQsRUFBVSxLQUFWLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sNkJBQVA7T0FBTCxFQUEyQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ3pDLFVBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFPLDZCQUFQO1dBQUwsRUFBMkMsT0FBM0MsRUFBb0QsU0FBQSxHQUFBO21CQUNsRCxLQUFDLENBQUEsSUFBRCxDQUFNO0FBQUEsY0FBQSxPQUFBLEVBQU8sWUFBUDthQUFOLEVBRGtEO1VBQUEsQ0FBcEQsQ0FBQSxDQUFBO2lCQUVBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE9BQUEsRUFBTywyQkFBUDtXQUFMLEVBQXlDLEtBQXpDLEVBQWdELFNBQUEsR0FBQTttQkFDOUMsS0FBQyxDQUFBLElBQUQsQ0FBTTtBQUFBLGNBQUEsT0FBQSxFQUFPLFlBQVA7YUFBTixFQUQ4QztVQUFBLENBQWhELEVBSHlDO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBM0MsRUFEUTtJQUFBLENBQVYsQ0FBQTs7NEJBQUE7O0tBRDZCLEtBMUIvQixDQUFBOztBQUFBLEVBa0NBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLG9CQWxDakIsQ0FBQTtBQUFBIgp9
//# sourceURL=/Users/ah/.atom/packages/linter/lib/statusbar-summary-view.coffee