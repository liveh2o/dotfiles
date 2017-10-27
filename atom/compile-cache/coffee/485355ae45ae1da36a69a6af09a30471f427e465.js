(function() {
  module.exports = {
    config: {
      showIcons: {
        type: 'boolean',
        "default": true,
        description: 'Show icons in tabs for panes which define an icon, such as the Settings and Project Find Results.'
      },
      alwaysShowTabBar: {
        type: 'boolean',
        "default": true,
        description: 'Show the tab bar even when only one tab is open.'
      },
      tabScrolling: {
        type: 'boolean',
        "default": process.platform === 'linux',
        description: 'Jump to next or previous tab by scrolling on the tab bar.'
      },
      tabScrollingThreshold: {
        type: 'integer',
        "default": 120,
        description: 'Threshold for switching to the next/previous tab when the `Tab Scrolling` config setting is enabled. Higher numbers mean that a longer scroll is needed to jump to the next/previous tab.'
      },
      enableVcsColoring: {
        title: "Enable VCS Coloring",
        type: 'boolean',
        "default": false,
        description: 'Color file names in tabs based on VCS status, similar to how file names are colored in the tree view.'
      }
    },
    activate: function(state) {
      var TabBarView, _;
      this.tabBarViews = [];
      TabBarView = require('./tab-bar-view');
      _ = require('underscore-plus');
      return this.paneSubscription = atom.workspace.observePanes((function(_this) {
        return function(pane) {
          var paneElement, tabBarView;
          tabBarView = new TabBarView;
          tabBarView.initialize(pane);
          paneElement = atom.views.getView(pane);
          paneElement.insertBefore(tabBarView, paneElement.firstChild);
          _this.tabBarViews.push(tabBarView);
          return pane.onDidDestroy(function() {
            return _.remove(_this.tabBarViews, tabBarView);
          });
        };
      })(this));
    },
    deactivate: function() {
      var tabBarView, _i, _len, _ref;
      this.paneSubscription.dispose();
      _ref = this.tabBarViews;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        tabBarView = _ref[_i];
        tabBarView.remove();
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RhYnMvbGliL21haW4uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLE1BQUEsRUFDRTtBQUFBLE1BQUEsU0FBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLElBRFQ7QUFBQSxRQUVBLFdBQUEsRUFBYSxtR0FGYjtPQURGO0FBQUEsTUFJQSxnQkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLElBRFQ7QUFBQSxRQUVBLFdBQUEsRUFBYSxrREFGYjtPQUxGO0FBQUEsTUFRQSxZQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsT0FBTyxDQUFDLFFBQVIsS0FBb0IsT0FEN0I7QUFBQSxRQUVBLFdBQUEsRUFBYSwyREFGYjtPQVRGO0FBQUEsTUFZQSxxQkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLEdBRFQ7QUFBQSxRQUVBLFdBQUEsRUFBYSwyTEFGYjtPQWJGO0FBQUEsTUFnQkEsaUJBQUEsRUFDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLHFCQUFQO0FBQUEsUUFDQSxJQUFBLEVBQU0sU0FETjtBQUFBLFFBRUEsU0FBQSxFQUFTLEtBRlQ7QUFBQSxRQUdBLFdBQUEsRUFBYSx1R0FIYjtPQWpCRjtLQURGO0FBQUEsSUF1QkEsUUFBQSxFQUFVLFNBQUMsS0FBRCxHQUFBO0FBQ1IsVUFBQSxhQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsV0FBRCxHQUFlLEVBQWYsQ0FBQTtBQUFBLE1BRUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxnQkFBUixDQUZiLENBQUE7QUFBQSxNQUdBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVIsQ0FISixDQUFBO2FBS0EsSUFBQyxDQUFBLGdCQUFELEdBQW9CLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBZixDQUE0QixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxJQUFELEdBQUE7QUFDOUMsY0FBQSx1QkFBQTtBQUFBLFVBQUEsVUFBQSxHQUFhLEdBQUEsQ0FBQSxVQUFiLENBQUE7QUFBQSxVQUNBLFVBQVUsQ0FBQyxVQUFYLENBQXNCLElBQXRCLENBREEsQ0FBQTtBQUFBLFVBR0EsV0FBQSxHQUFjLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixJQUFuQixDQUhkLENBQUE7QUFBQSxVQUlBLFdBQVcsQ0FBQyxZQUFaLENBQXlCLFVBQXpCLEVBQXFDLFdBQVcsQ0FBQyxVQUFqRCxDQUpBLENBQUE7QUFBQSxVQU1BLEtBQUMsQ0FBQSxXQUFXLENBQUMsSUFBYixDQUFrQixVQUFsQixDQU5BLENBQUE7aUJBT0EsSUFBSSxDQUFDLFlBQUwsQ0FBa0IsU0FBQSxHQUFBO21CQUFHLENBQUMsQ0FBQyxNQUFGLENBQVMsS0FBQyxDQUFBLFdBQVYsRUFBdUIsVUFBdkIsRUFBSDtVQUFBLENBQWxCLEVBUjhDO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBNUIsRUFOWjtJQUFBLENBdkJWO0FBQUEsSUF1Q0EsVUFBQSxFQUFZLFNBQUEsR0FBQTtBQUNWLFVBQUEsMEJBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxnQkFBZ0IsQ0FBQyxPQUFsQixDQUFBLENBQUEsQ0FBQTtBQUNBO0FBQUEsV0FBQSwyQ0FBQTs4QkFBQTtBQUFBLFFBQUEsVUFBVSxDQUFDLE1BQVgsQ0FBQSxDQUFBLENBQUE7QUFBQSxPQUZVO0lBQUEsQ0F2Q1o7R0FERixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/ah/.atom/packages/tabs/lib/main.coffee
