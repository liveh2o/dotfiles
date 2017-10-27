(function() {
  var TabBarView, _;

  _ = require('underscore-plus');

  TabBarView = require('./tab-bar-view');

  module.exports = {
    configDefaults: {
      showIcons: true
    },
    activate: function() {
      return this.paneSubscription = atom.workspaceView.eachPaneView((function(_this) {
        return function(paneView) {
          var onPaneViewRemoved, tabBarView;
          tabBarView = new TabBarView(paneView);
          if (_this.tabBarViews == null) {
            _this.tabBarViews = [];
          }
          _this.tabBarViews.push(tabBarView);
          onPaneViewRemoved = function(event, removedPaneView) {
            if (paneView !== removedPaneView) {
              return;
            }
            _.remove(_this.tabBarViews, tabBarView);
            return atom.workspaceView.off('pane:removed', onPaneViewRemoved);
          };
          atom.workspaceView.on('pane:removed', onPaneViewRemoved);
          return tabBarView;
        };
      })(this));
    },
    deactivate: function() {
      var tabBarView, _i, _len, _ref, _ref1, _ref2, _results;
      if ((_ref = this.paneSubscription) != null) {
        _ref.off();
      }
      _ref2 = (_ref1 = this.tabBarViews) != null ? _ref1 : [];
      _results = [];
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        tabBarView = _ref2[_i];
        _results.push(tabBarView.remove());
      }
      return _results;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGFBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBQUosQ0FBQTs7QUFBQSxFQUNBLFVBQUEsR0FBYSxPQUFBLENBQVEsZ0JBQVIsQ0FEYixDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsY0FBQSxFQUNFO0FBQUEsTUFBQSxTQUFBLEVBQVcsSUFBWDtLQURGO0FBQUEsSUFHQSxRQUFBLEVBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLGdCQUFELEdBQW9CLElBQUksQ0FBQyxhQUFhLENBQUMsWUFBbkIsQ0FBZ0MsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsUUFBRCxHQUFBO0FBQ2xELGNBQUEsNkJBQUE7QUFBQSxVQUFBLFVBQUEsR0FBaUIsSUFBQSxVQUFBLENBQVcsUUFBWCxDQUFqQixDQUFBOztZQUNBLEtBQUMsQ0FBQSxjQUFlO1dBRGhCO0FBQUEsVUFFQSxLQUFDLENBQUEsV0FBVyxDQUFDLElBQWIsQ0FBa0IsVUFBbEIsQ0FGQSxDQUFBO0FBQUEsVUFHQSxpQkFBQSxHQUFvQixTQUFDLEtBQUQsRUFBUSxlQUFSLEdBQUE7QUFDbEIsWUFBQSxJQUFjLFFBQUEsS0FBWSxlQUExQjtBQUFBLG9CQUFBLENBQUE7YUFBQTtBQUFBLFlBQ0EsQ0FBQyxDQUFDLE1BQUYsQ0FBUyxLQUFDLENBQUEsV0FBVixFQUF1QixVQUF2QixDQURBLENBQUE7bUJBRUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFuQixDQUF1QixjQUF2QixFQUF1QyxpQkFBdkMsRUFIa0I7VUFBQSxDQUhwQixDQUFBO0FBQUEsVUFPQSxJQUFJLENBQUMsYUFBYSxDQUFDLEVBQW5CLENBQXNCLGNBQXRCLEVBQXNDLGlCQUF0QyxDQVBBLENBQUE7aUJBUUEsV0FUa0Q7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFoQyxFQURaO0lBQUEsQ0FIVjtBQUFBLElBZUEsVUFBQSxFQUFZLFNBQUEsR0FBQTtBQUNWLFVBQUEsa0RBQUE7O1lBQWlCLENBQUUsR0FBbkIsQ0FBQTtPQUFBO0FBQ0E7QUFBQTtXQUFBLDRDQUFBOytCQUFBO0FBQUEsc0JBQUEsVUFBVSxDQUFDLE1BQVgsQ0FBQSxFQUFBLENBQUE7QUFBQTtzQkFGVTtJQUFBLENBZlo7R0FKRixDQUFBO0FBQUEiCn0=
//# sourceURL=/Users/ah/.atom/packages/tabs/lib/tabs.coffee