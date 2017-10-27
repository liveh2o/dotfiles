(function() {
  var TabBarView, _;

  _ = require('underscore-plus');

  TabBarView = require('./tab-bar-view');

  module.exports = {
    config: {
      showIcons: {
        type: 'boolean',
        "default": true
      },
      hideTabBarWhenOnlyOneTabIsOpen: {
        type: 'boolean',
        "default": false
      },
      tabScrolling: {
        type: 'boolean',
        "default": process.platform === 'linux'
      },
      tabScrollingThreshold: {
        type: 'integer',
        "default": 120
      }
    },
    activate: function() {
      this.tabBarViews = [];
      return this.paneSubscription = atom.workspace.observePanes((function(_this) {
        return function(pane) {
          var paneElement, tabBarView;
          tabBarView = new TabBarView(pane);
          paneElement = atom.views.getView(pane);
          paneElement.insertBefore(tabBarView.element, paneElement.firstChild);
          _this.tabBarViews.push(tabBarView);
          return pane.onDidDestroy(function() {
            return _.remove(_this.tabBarViews, tabBarView);
          });
        };
      })(this));
    },
    deactivate: function() {
      var tabBarView, _i, _len, _ref, _results;
      this.paneSubscription.dispose();
      _ref = this.tabBarViews;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        tabBarView = _ref[_i];
        _results.push(tabBarView.remove());
      }
      return _results;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGFBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBQUosQ0FBQTs7QUFBQSxFQUNBLFVBQUEsR0FBYSxPQUFBLENBQVEsZ0JBQVIsQ0FEYixDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsTUFBQSxFQUNFO0FBQUEsTUFBQSxTQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsSUFEVDtPQURGO0FBQUEsTUFHQSw4QkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLEtBRFQ7T0FKRjtBQUFBLE1BTUEsWUFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLE9BQU8sQ0FBQyxRQUFSLEtBQW9CLE9BRDdCO09BUEY7QUFBQSxNQVNBLHFCQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsR0FEVDtPQVZGO0tBREY7QUFBQSxJQWNBLFFBQUEsRUFBVSxTQUFBLEdBQUE7QUFDUixNQUFBLElBQUMsQ0FBQSxXQUFELEdBQWUsRUFBZixDQUFBO2FBRUEsSUFBQyxDQUFBLGdCQUFELEdBQW9CLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBZixDQUE0QixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxJQUFELEdBQUE7QUFDOUMsY0FBQSx1QkFBQTtBQUFBLFVBQUEsVUFBQSxHQUFpQixJQUFBLFVBQUEsQ0FBVyxJQUFYLENBQWpCLENBQUE7QUFBQSxVQUVBLFdBQUEsR0FBYyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBbkIsQ0FGZCxDQUFBO0FBQUEsVUFHQSxXQUFXLENBQUMsWUFBWixDQUF5QixVQUFVLENBQUMsT0FBcEMsRUFBNkMsV0FBVyxDQUFDLFVBQXpELENBSEEsQ0FBQTtBQUFBLFVBS0EsS0FBQyxDQUFBLFdBQVcsQ0FBQyxJQUFiLENBQWtCLFVBQWxCLENBTEEsQ0FBQTtpQkFNQSxJQUFJLENBQUMsWUFBTCxDQUFrQixTQUFBLEdBQUE7bUJBQUcsQ0FBQyxDQUFDLE1BQUYsQ0FBUyxLQUFDLENBQUEsV0FBVixFQUF1QixVQUF2QixFQUFIO1VBQUEsQ0FBbEIsRUFQOEM7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE1QixFQUhaO0lBQUEsQ0FkVjtBQUFBLElBMEJBLFVBQUEsRUFBWSxTQUFBLEdBQUE7QUFDVixVQUFBLG9DQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsZ0JBQWdCLENBQUMsT0FBbEIsQ0FBQSxDQUFBLENBQUE7QUFDQTtBQUFBO1dBQUEsMkNBQUE7OEJBQUE7QUFBQSxzQkFBQSxVQUFVLENBQUMsTUFBWCxDQUFBLEVBQUEsQ0FBQTtBQUFBO3NCQUZVO0lBQUEsQ0ExQlo7R0FKRixDQUFBO0FBQUEiCn0=
//# sourceURL=/Users/ah/.atom/packages/tabs/lib/main.coffee