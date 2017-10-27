(function() {
  var StatusBarSummary, StatusBarSummaryView, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('space-pen').View;

  StatusBarSummaryView = (function() {
    function StatusBarSummaryView() {}

    StatusBarSummaryView.prototype.remove = function() {
      if (this.tile != null) {
        this.tile.destroy();
      }
      return this.tile = null;
    };

    StatusBarSummaryView.prototype.render = function(messages) {
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
      el = new StatusBarSummary(info, warning, error);
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

    StatusBarSummary.content = function(info, warning, error) {
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

    return StatusBarSummary;

  })(View);

  module.exports = StatusBarSummaryView;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDRDQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxPQUFRLE9BQUEsQ0FBUSxXQUFSLEVBQVIsSUFBRCxDQUFBOztBQUFBLEVBR007c0NBQ0o7O0FBQUEsbUNBQUEsTUFBQSxHQUFRLFNBQUEsR0FBQTtBQUVOLE1BQUEsSUFBbUIsaUJBQW5CO0FBQUEsUUFBQSxJQUFDLENBQUEsSUFBSSxDQUFDLE9BQU4sQ0FBQSxDQUFBLENBQUE7T0FBQTthQUNBLElBQUMsQ0FBQSxJQUFELEdBQVEsS0FIRjtJQUFBLENBQVIsQ0FBQTs7QUFBQSxtQ0FNQSxNQUFBLEdBQVEsU0FBQyxRQUFELEdBQUE7QUFDTixVQUFBLG1EQUFBO0FBQUEsTUFBQSxTQUFBLEdBQVksUUFBUSxDQUFDLGFBQVQsQ0FBdUIsWUFBdkIsQ0FBWixDQUFBO0FBQ0EsTUFBQSxJQUFjLGlCQUFkO0FBQUEsY0FBQSxDQUFBO09BREE7QUFBQSxNQUlBLElBQUMsQ0FBQSxNQUFELENBQUEsQ0FKQSxDQUFBO0FBQUEsTUFNQSxJQUFBLEdBQU8sT0FBQSxHQUFVLEtBQUEsR0FBUSxDQU56QixDQUFBO0FBT0EsV0FBQSwrQ0FBQTs0QkFBQTtBQUNFLFFBQUEsSUFBYSxJQUFJLENBQUMsS0FBTCxLQUFjLE1BQTNCO0FBQUEsVUFBQSxJQUFBLElBQVEsQ0FBUixDQUFBO1NBQUE7QUFDQSxRQUFBLElBQWdCLElBQUksQ0FBQyxLQUFMLEtBQWMsU0FBOUI7QUFBQSxVQUFBLE9BQUEsSUFBVyxDQUFYLENBQUE7U0FEQTtBQUVBLFFBQUEsSUFBYyxJQUFJLENBQUMsS0FBTCxLQUFjLE9BQTVCO0FBQUEsVUFBQSxLQUFBLElBQVMsQ0FBVCxDQUFBO1NBSEY7QUFBQSxPQVBBO0FBWUEsTUFBQSxJQUFVLElBQUEsR0FBTyxPQUFQLEdBQWlCLEtBQWpCLEtBQTBCLENBQXBDO0FBQUEsY0FBQSxDQUFBO09BWkE7QUFBQSxNQWNBLEVBQUEsR0FBUyxJQUFBLGdCQUFBLENBQWlCLElBQWpCLEVBQXVCLE9BQXZCLEVBQWdDLEtBQWhDLENBZFQsQ0FBQTthQWVBLElBQUMsQ0FBQSxJQUFELEdBQVEsU0FBUyxDQUFDLFlBQVYsQ0FBdUI7QUFBQSxRQUFDLElBQUEsRUFBTSxFQUFQO0FBQUEsUUFBVyxRQUFBLEVBQVUsR0FBckI7T0FBdkIsRUFoQkY7SUFBQSxDQU5SLENBQUE7O2dDQUFBOztNQUpGLENBQUE7O0FBQUEsRUE0Qk07QUFDSix1Q0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSxnQkFBQyxDQUFBLE9BQUQsR0FBVSxTQUFDLElBQUQsRUFBTyxPQUFQLEVBQWdCLEtBQWhCLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sNkJBQVA7T0FBTCxFQUEyQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ3pDLFVBQUEsSUFBRyxLQUFBLEdBQVEsQ0FBWDtBQUNFLFlBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLGNBQUEsT0FBQSxFQUFPLDJCQUFQO2FBQUwsRUFBeUMsS0FBekMsRUFBZ0QsU0FBQSxHQUFBO3FCQUM5QyxLQUFDLENBQUEsSUFBRCxDQUFNO0FBQUEsZ0JBQUEsT0FBQSxFQUFPLFlBQVA7ZUFBTixFQUQ4QztZQUFBLENBQWhELENBQUEsQ0FERjtXQUFBO0FBR0EsVUFBQSxJQUFHLE9BQUEsR0FBVSxDQUFiO0FBQ0UsWUFBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsY0FBQSxPQUFBLEVBQU8sNkJBQVA7YUFBTCxFQUEyQyxPQUEzQyxFQUFvRCxTQUFBLEdBQUE7cUJBQ2xELEtBQUMsQ0FBQSxJQUFELENBQU07QUFBQSxnQkFBQSxPQUFBLEVBQU8sWUFBUDtlQUFOLEVBRGtEO1lBQUEsQ0FBcEQsQ0FBQSxDQURGO1dBSEE7QUFNQSxVQUFBLElBQUcsSUFBQSxHQUFPLENBQVY7bUJBQ0UsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLGNBQUEsT0FBQSxFQUFPLDBCQUFQO2FBQUwsRUFBd0MsSUFBeEMsRUFBOEMsU0FBQSxHQUFBO3FCQUM1QyxLQUFDLENBQUEsSUFBRCxDQUFNO0FBQUEsZ0JBQUEsT0FBQSxFQUFPLFlBQVA7ZUFBTixFQUQ0QztZQUFBLENBQTlDLEVBREY7V0FQeUM7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUEzQyxFQURRO0lBQUEsQ0FBVixDQUFBOzs0QkFBQTs7S0FENkIsS0E1Qi9CLENBQUE7O0FBQUEsRUF5Q0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIsb0JBekNqQixDQUFBO0FBQUEiCn0=
//# sourceURL=/Users/ah/.atom/packages/linter/lib/statusbar-summary-view.coffee