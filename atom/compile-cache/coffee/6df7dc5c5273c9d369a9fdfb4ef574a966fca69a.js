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
      var el, error, item, statusBar, warning, _i, _len;
      statusBar = document.querySelector("status-bar");
      if (statusBar == null) {
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
      el = new StatusBarSummary(warning, error);
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDRDQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxPQUFRLE9BQUEsQ0FBUSxXQUFSLEVBQVIsSUFBRCxDQUFBOztBQUFBLEVBR007c0NBQ0o7O0FBQUEsbUNBQUEsTUFBQSxHQUFRLFNBQUEsR0FBQTtBQUVOLE1BQUEsSUFBbUIsaUJBQW5CO0FBQUEsUUFBQSxJQUFDLENBQUEsSUFBSSxDQUFDLE9BQU4sQ0FBQSxDQUFBLENBQUE7T0FBQTthQUNBLElBQUMsQ0FBQSxJQUFELEdBQVEsS0FIRjtJQUFBLENBQVIsQ0FBQTs7QUFBQSxtQ0FNQSxNQUFBLEdBQVEsU0FBQyxRQUFELEdBQUE7QUFDTixVQUFBLDZDQUFBO0FBQUEsTUFBQSxTQUFBLEdBQVksUUFBUSxDQUFDLGFBQVQsQ0FBdUIsWUFBdkIsQ0FBWixDQUFBO0FBQ0EsTUFBQSxJQUFjLGlCQUFkO0FBQUEsY0FBQSxDQUFBO09BREE7QUFBQSxNQUdBLE9BQUEsR0FBVSxLQUFBLEdBQVEsQ0FIbEIsQ0FBQTtBQUtBLFdBQUEsK0NBQUE7NEJBQUE7QUFDRSxRQUFBLElBQWdCLElBQUksQ0FBQyxLQUFMLEtBQWMsU0FBOUI7QUFBQSxVQUFBLE9BQUEsSUFBVyxDQUFYLENBQUE7U0FBQTtBQUNBLFFBQUEsSUFBYyxJQUFJLENBQUMsS0FBTCxLQUFjLE9BQTVCO0FBQUEsVUFBQSxLQUFBLElBQVMsQ0FBVCxDQUFBO1NBRkY7QUFBQSxPQUxBO0FBQUEsTUFVQSxJQUFDLENBQUEsTUFBRCxDQUFBLENBVkEsQ0FBQTtBQUFBLE1BWUEsRUFBQSxHQUFTLElBQUEsZ0JBQUEsQ0FBaUIsT0FBakIsRUFBMEIsS0FBMUIsQ0FaVCxDQUFBO2FBYUEsSUFBQyxDQUFBLElBQUQsR0FBUSxTQUFTLENBQUMsWUFBVixDQUF1QjtBQUFBLFFBQUMsSUFBQSxFQUFNLEVBQVA7QUFBQSxRQUFXLFFBQUEsRUFBVSxHQUFyQjtPQUF2QixFQWRGO0lBQUEsQ0FOUixDQUFBOztnQ0FBQTs7TUFKRixDQUFBOztBQUFBLEVBMEJNO0FBQ0osdUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsZ0JBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQyxPQUFELEVBQVUsS0FBVixHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLDZCQUFQO09BQUwsRUFBMkMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUN6QyxVQUFBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE9BQUEsRUFBTyw2QkFBUDtXQUFMLEVBQTJDLE9BQTNDLEVBQW9ELFNBQUEsR0FBQTttQkFDbEQsS0FBQyxDQUFBLElBQUQsQ0FBTTtBQUFBLGNBQUEsT0FBQSxFQUFPLFlBQVA7YUFBTixFQURrRDtVQUFBLENBQXBELENBQUEsQ0FBQTtpQkFFQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxPQUFBLEVBQU8sMkJBQVA7V0FBTCxFQUF5QyxLQUF6QyxFQUFnRCxTQUFBLEdBQUE7bUJBQzlDLEtBQUMsQ0FBQSxJQUFELENBQU07QUFBQSxjQUFBLE9BQUEsRUFBTyxZQUFQO2FBQU4sRUFEOEM7VUFBQSxDQUFoRCxFQUh5QztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTNDLEVBRFE7SUFBQSxDQUFWLENBQUE7OzRCQUFBOztLQUQ2QixLQTFCL0IsQ0FBQTs7QUFBQSxFQWtDQSxNQUFNLENBQUMsT0FBUCxHQUFpQixvQkFsQ2pCLENBQUE7QUFBQSIKfQ==
//# sourceURL=/Users/ah/.atom/packages/linter/lib/statusbar-summary-view.coffee