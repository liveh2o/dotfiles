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
      usePreviewTabs: {
        type: 'boolean',
        "default": false,
        description: 'Tabs will only stay open if they\'re double-clicked or their contents is modified.'
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
      if (!Array.isArray(state)) {
        state = [];
      }
      this.tabBarViews = [];
      TabBarView = require('./tab-bar-view');
      _ = require('underscore-plus');
      this.paneSubscription = atom.workspace.observePanes((function(_this) {
        return function(pane) {
          var paneElement, tabBarView;
          tabBarView = new TabBarView;
          tabBarView.initialize(pane, state.shift());
          paneElement = atom.views.getView(pane);
          paneElement.insertBefore(tabBarView, paneElement.firstChild);
          _this.tabBarViews.push(tabBarView);
          return pane.onDidDestroy(function() {
            return _.remove(_this.tabBarViews, tabBarView);
          });
        };
      })(this));
      return state = [];
    },
    deactivate: function() {
      var tabBarView, _i, _len, _ref;
      this.paneSubscription.dispose();
      _ref = this.tabBarViews;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        tabBarView = _ref[_i];
        tabBarView.remove();
      }
    },
    serialize: function() {
      return this.tabBarViews.map(function(tabBarView) {
        return {
          previewTabURI: tabBarView.getPreviewTabURI()
        };
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RhYnMvbGliL21haW4uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLE1BQUEsRUFDRTtBQUFBLE1BQUEsU0FBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLElBRFQ7QUFBQSxRQUVBLFdBQUEsRUFBYSxtR0FGYjtPQURGO0FBQUEsTUFJQSxnQkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLElBRFQ7QUFBQSxRQUVBLFdBQUEsRUFBYSxrREFGYjtPQUxGO0FBQUEsTUFRQSxZQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsT0FBTyxDQUFDLFFBQVIsS0FBb0IsT0FEN0I7QUFBQSxRQUVBLFdBQUEsRUFBYSwyREFGYjtPQVRGO0FBQUEsTUFZQSxxQkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLEdBRFQ7QUFBQSxRQUVBLFdBQUEsRUFBYSwyTEFGYjtPQWJGO0FBQUEsTUFnQkEsY0FBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLEtBRFQ7QUFBQSxRQUVBLFdBQUEsRUFBYSxvRkFGYjtPQWpCRjtBQUFBLE1Bb0JBLGlCQUFBLEVBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTyxxQkFBUDtBQUFBLFFBQ0EsSUFBQSxFQUFNLFNBRE47QUFBQSxRQUVBLFNBQUEsRUFBUyxLQUZUO0FBQUEsUUFHQSxXQUFBLEVBQWEsdUdBSGI7T0FyQkY7S0FERjtBQUFBLElBMkJBLFFBQUEsRUFBVSxTQUFDLEtBQUQsR0FBQTtBQUNSLFVBQUEsYUFBQTtBQUFBLE1BQUEsSUFBQSxDQUFBLEtBQXVCLENBQUMsT0FBTixDQUFjLEtBQWQsQ0FBbEI7QUFBQSxRQUFBLEtBQUEsR0FBUSxFQUFSLENBQUE7T0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFdBQUQsR0FBZSxFQURmLENBQUE7QUFBQSxNQUdBLFVBQUEsR0FBYSxPQUFBLENBQVEsZ0JBQVIsQ0FIYixDQUFBO0FBQUEsTUFJQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBSkosQ0FBQTtBQUFBLE1BTUEsSUFBQyxDQUFBLGdCQUFELEdBQW9CLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBZixDQUE0QixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxJQUFELEdBQUE7QUFDOUMsY0FBQSx1QkFBQTtBQUFBLFVBQUEsVUFBQSxHQUFhLEdBQUEsQ0FBQSxVQUFiLENBQUE7QUFBQSxVQUNBLFVBQVUsQ0FBQyxVQUFYLENBQXNCLElBQXRCLEVBQTRCLEtBQUssQ0FBQyxLQUFOLENBQUEsQ0FBNUIsQ0FEQSxDQUFBO0FBQUEsVUFHQSxXQUFBLEdBQWMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLElBQW5CLENBSGQsQ0FBQTtBQUFBLFVBSUEsV0FBVyxDQUFDLFlBQVosQ0FBeUIsVUFBekIsRUFBcUMsV0FBVyxDQUFDLFVBQWpELENBSkEsQ0FBQTtBQUFBLFVBTUEsS0FBQyxDQUFBLFdBQVcsQ0FBQyxJQUFiLENBQWtCLFVBQWxCLENBTkEsQ0FBQTtpQkFPQSxJQUFJLENBQUMsWUFBTCxDQUFrQixTQUFBLEdBQUE7bUJBQUcsQ0FBQyxDQUFDLE1BQUYsQ0FBUyxLQUFDLENBQUEsV0FBVixFQUF1QixVQUF2QixFQUFIO1VBQUEsQ0FBbEIsRUFSOEM7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE1QixDQU5wQixDQUFBO2FBZ0JBLEtBQUEsR0FBUSxHQWpCQTtJQUFBLENBM0JWO0FBQUEsSUE4Q0EsVUFBQSxFQUFZLFNBQUEsR0FBQTtBQUNWLFVBQUEsMEJBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxnQkFBZ0IsQ0FBQyxPQUFsQixDQUFBLENBQUEsQ0FBQTtBQUNBO0FBQUEsV0FBQSwyQ0FBQTs4QkFBQTtBQUFBLFFBQUEsVUFBVSxDQUFDLE1BQVgsQ0FBQSxDQUFBLENBQUE7QUFBQSxPQUZVO0lBQUEsQ0E5Q1o7QUFBQSxJQW1EQSxTQUFBLEVBQVcsU0FBQSxHQUFBO2FBQ1QsSUFBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCLFNBQUMsVUFBRCxHQUFBO2VBQ2Y7QUFBQSxVQUFBLGFBQUEsRUFBZSxVQUFVLENBQUMsZ0JBQVgsQ0FBQSxDQUFmO1VBRGU7TUFBQSxDQUFqQixFQURTO0lBQUEsQ0FuRFg7R0FERixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/ah/.atom/packages/tabs/lib/main.coffee
