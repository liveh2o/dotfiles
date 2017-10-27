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
      alwaysShowTabBar: {
        type: 'boolean',
        "default": true,
        description: "Shows the Tab Bar when only 1 tab is open"
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGFBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBQUosQ0FBQTs7QUFBQSxFQUNBLFVBQUEsR0FBYSxPQUFBLENBQVEsZ0JBQVIsQ0FEYixDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsTUFBQSxFQUNFO0FBQUEsTUFBQSxTQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsSUFEVDtPQURGO0FBQUEsTUFHQSxnQkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLElBRFQ7QUFBQSxRQUVBLFdBQUEsRUFBYSwyQ0FGYjtPQUpGO0FBQUEsTUFPQSxZQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsT0FBTyxDQUFDLFFBQVIsS0FBb0IsT0FEN0I7T0FSRjtBQUFBLE1BVUEscUJBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxHQURUO09BWEY7S0FERjtBQUFBLElBZUEsUUFBQSxFQUFVLFNBQUEsR0FBQTtBQUNSLE1BQUEsSUFBQyxDQUFBLFdBQUQsR0FBZSxFQUFmLENBQUE7YUFFQSxJQUFDLENBQUEsZ0JBQUQsR0FBb0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFmLENBQTRCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLElBQUQsR0FBQTtBQUM5QyxjQUFBLHVCQUFBO0FBQUEsVUFBQSxVQUFBLEdBQWlCLElBQUEsVUFBQSxDQUFXLElBQVgsQ0FBakIsQ0FBQTtBQUFBLFVBRUEsV0FBQSxHQUFjLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixJQUFuQixDQUZkLENBQUE7QUFBQSxVQUdBLFdBQVcsQ0FBQyxZQUFaLENBQXlCLFVBQVUsQ0FBQyxPQUFwQyxFQUE2QyxXQUFXLENBQUMsVUFBekQsQ0FIQSxDQUFBO0FBQUEsVUFLQSxLQUFDLENBQUEsV0FBVyxDQUFDLElBQWIsQ0FBa0IsVUFBbEIsQ0FMQSxDQUFBO2lCQU1BLElBQUksQ0FBQyxZQUFMLENBQWtCLFNBQUEsR0FBQTttQkFBRyxDQUFDLENBQUMsTUFBRixDQUFTLEtBQUMsQ0FBQSxXQUFWLEVBQXVCLFVBQXZCLEVBQUg7VUFBQSxDQUFsQixFQVA4QztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTVCLEVBSFo7SUFBQSxDQWZWO0FBQUEsSUEyQkEsVUFBQSxFQUFZLFNBQUEsR0FBQTtBQUNWLFVBQUEsb0NBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxnQkFBZ0IsQ0FBQyxPQUFsQixDQUFBLENBQUEsQ0FBQTtBQUNBO0FBQUE7V0FBQSwyQ0FBQTs4QkFBQTtBQUFBLHNCQUFBLFVBQVUsQ0FBQyxNQUFYLENBQUEsRUFBQSxDQUFBO0FBQUE7c0JBRlU7SUFBQSxDQTNCWjtHQUpGLENBQUE7QUFBQSIKfQ==
//# sourceURL=/Users/ah/.atom/packages/tabs/lib/main.coffee