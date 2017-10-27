(function() {
  var TabBarView, _;

  _ = require('underscore-plus');

  TabBarView = require('./tab-bar-view');

  module.exports = {
    configDefaults: {
      showIcons: true,
      tabScrolling: process.platform === 'linux' ? true : false,
      tabScrollingThreshold: 120
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGFBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBQUosQ0FBQTs7QUFBQSxFQUNBLFVBQUEsR0FBYSxPQUFBLENBQVEsZ0JBQVIsQ0FEYixDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsY0FBQSxFQUNFO0FBQUEsTUFBQSxTQUFBLEVBQVcsSUFBWDtBQUFBLE1BQ0EsWUFBQSxFQUFpQixPQUFPLENBQUMsUUFBUixLQUFvQixPQUF2QixHQUFvQyxJQUFwQyxHQUE4QyxLQUQ1RDtBQUFBLE1BRUEscUJBQUEsRUFBdUIsR0FGdkI7S0FERjtBQUFBLElBS0EsUUFBQSxFQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxnQkFBRCxHQUFvQixJQUFJLENBQUMsYUFBYSxDQUFDLFlBQW5CLENBQWdDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLFFBQUQsR0FBQTtBQUNsRCxjQUFBLDZCQUFBO0FBQUEsVUFBQSxVQUFBLEdBQWlCLElBQUEsVUFBQSxDQUFXLFFBQVgsQ0FBakIsQ0FBQTs7WUFDQSxLQUFDLENBQUEsY0FBZTtXQURoQjtBQUFBLFVBRUEsS0FBQyxDQUFBLFdBQVcsQ0FBQyxJQUFiLENBQWtCLFVBQWxCLENBRkEsQ0FBQTtBQUFBLFVBR0EsaUJBQUEsR0FBb0IsU0FBQyxLQUFELEVBQVEsZUFBUixHQUFBO0FBQ2xCLFlBQUEsSUFBYyxRQUFBLEtBQVksZUFBMUI7QUFBQSxvQkFBQSxDQUFBO2FBQUE7QUFBQSxZQUNBLENBQUMsQ0FBQyxNQUFGLENBQVMsS0FBQyxDQUFBLFdBQVYsRUFBdUIsVUFBdkIsQ0FEQSxDQUFBO21CQUVBLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBbkIsQ0FBdUIsY0FBdkIsRUFBdUMsaUJBQXZDLEVBSGtCO1VBQUEsQ0FIcEIsQ0FBQTtBQUFBLFVBT0EsSUFBSSxDQUFDLGFBQWEsQ0FBQyxFQUFuQixDQUFzQixjQUF0QixFQUFzQyxpQkFBdEMsQ0FQQSxDQUFBO2lCQVFBLFdBVGtEO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBaEMsRUFEWjtJQUFBLENBTFY7QUFBQSxJQWlCQSxVQUFBLEVBQVksU0FBQSxHQUFBO0FBQ1YsVUFBQSxrREFBQTs7WUFBaUIsQ0FBRSxHQUFuQixDQUFBO09BQUE7QUFDQTtBQUFBO1dBQUEsNENBQUE7K0JBQUE7QUFBQSxzQkFBQSxVQUFVLENBQUMsTUFBWCxDQUFBLEVBQUEsQ0FBQTtBQUFBO3NCQUZVO0lBQUEsQ0FqQlo7R0FKRixDQUFBO0FBQUEiCn0=
//# sourceURL=/Users/ah/.atom/packages/tabs/lib/tabs.coffee