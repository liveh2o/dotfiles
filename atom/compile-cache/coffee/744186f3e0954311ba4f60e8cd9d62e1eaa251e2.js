(function() {
  var TabBarView, _;

  _ = require('underscore-plus');

  TabBarView = require('./tab-bar-view');

  module.exports = {
    activate: function() {
      return this.paneSubscription = atom.workspaceView.eachPane((function(_this) {
        return function(pane) {
          var onPaneRemoved, tabBarView;
          tabBarView = new TabBarView(pane);
          if (_this.tabBarViews == null) {
            _this.tabBarViews = [];
          }
          _this.tabBarViews.push(tabBarView);
          onPaneRemoved = function(event, removedPane) {
            if (pane !== removedPane) {
              return;
            }
            _.remove(_this.tabBarViews, tabBarView);
            return atom.workspaceView.off('pane:removed', onPaneRemoved);
          };
          atom.workspaceView.on('pane:removed', onPaneRemoved);
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGFBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBQUosQ0FBQTs7QUFBQSxFQUNBLFVBQUEsR0FBYSxPQUFBLENBQVEsZ0JBQVIsQ0FEYixDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsUUFBQSxFQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxnQkFBRCxHQUFvQixJQUFJLENBQUMsYUFBYSxDQUFDLFFBQW5CLENBQTRCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLElBQUQsR0FBQTtBQUM5QyxjQUFBLHlCQUFBO0FBQUEsVUFBQSxVQUFBLEdBQWlCLElBQUEsVUFBQSxDQUFXLElBQVgsQ0FBakIsQ0FBQTs7WUFDQSxLQUFDLENBQUEsY0FBZTtXQURoQjtBQUFBLFVBRUEsS0FBQyxDQUFBLFdBQVcsQ0FBQyxJQUFiLENBQWtCLFVBQWxCLENBRkEsQ0FBQTtBQUFBLFVBR0EsYUFBQSxHQUFnQixTQUFDLEtBQUQsRUFBUSxXQUFSLEdBQUE7QUFDZCxZQUFBLElBQWMsSUFBQSxLQUFRLFdBQXRCO0FBQUEsb0JBQUEsQ0FBQTthQUFBO0FBQUEsWUFDQSxDQUFDLENBQUMsTUFBRixDQUFTLEtBQUMsQ0FBQSxXQUFWLEVBQXVCLFVBQXZCLENBREEsQ0FBQTttQkFFQSxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQW5CLENBQXVCLGNBQXZCLEVBQXVDLGFBQXZDLEVBSGM7VUFBQSxDQUhoQixDQUFBO0FBQUEsVUFPQSxJQUFJLENBQUMsYUFBYSxDQUFDLEVBQW5CLENBQXNCLGNBQXRCLEVBQXNDLGFBQXRDLENBUEEsQ0FBQTtpQkFRQSxXQVQ4QztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTVCLEVBRFo7SUFBQSxDQUFWO0FBQUEsSUFZQSxVQUFBLEVBQVksU0FBQSxHQUFBO0FBQ1YsVUFBQSxrREFBQTs7WUFBaUIsQ0FBRSxHQUFuQixDQUFBO09BQUE7QUFDQTtBQUFBO1dBQUEsNENBQUE7K0JBQUE7QUFBQSxzQkFBQSxVQUFVLENBQUMsTUFBWCxDQUFBLEVBQUEsQ0FBQTtBQUFBO3NCQUZVO0lBQUEsQ0FaWjtHQUpGLENBQUE7QUFBQSIKfQ==
//# sourceURL=/Users/ah/.atom/packages/tabs/lib/tabs.coffee