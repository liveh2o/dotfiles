(function() {
  module.exports = {
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RhYnMvbGliL21haW4uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLFFBQUEsRUFBVSxTQUFDLEtBQUQsR0FBQTtBQUNSLFVBQUEsYUFBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLFdBQUQsR0FBZSxFQUFmLENBQUE7QUFBQSxNQUVBLFVBQUEsR0FBYSxPQUFBLENBQVEsZ0JBQVIsQ0FGYixDQUFBO0FBQUEsTUFHQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBSEosQ0FBQTthQUtBLElBQUMsQ0FBQSxnQkFBRCxHQUFvQixJQUFJLENBQUMsU0FBUyxDQUFDLFlBQWYsQ0FBNEIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsSUFBRCxHQUFBO0FBQzlDLGNBQUEsdUJBQUE7QUFBQSxVQUFBLFVBQUEsR0FBYSxHQUFBLENBQUEsVUFBYixDQUFBO0FBQUEsVUFDQSxVQUFVLENBQUMsVUFBWCxDQUFzQixJQUF0QixDQURBLENBQUE7QUFBQSxVQUdBLFdBQUEsR0FBYyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBbkIsQ0FIZCxDQUFBO0FBQUEsVUFJQSxXQUFXLENBQUMsWUFBWixDQUF5QixVQUF6QixFQUFxQyxXQUFXLENBQUMsVUFBakQsQ0FKQSxDQUFBO0FBQUEsVUFNQSxLQUFDLENBQUEsV0FBVyxDQUFDLElBQWIsQ0FBa0IsVUFBbEIsQ0FOQSxDQUFBO2lCQU9BLElBQUksQ0FBQyxZQUFMLENBQWtCLFNBQUEsR0FBQTttQkFBRyxDQUFDLENBQUMsTUFBRixDQUFTLEtBQUMsQ0FBQSxXQUFWLEVBQXVCLFVBQXZCLEVBQUg7VUFBQSxDQUFsQixFQVI4QztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTVCLEVBTlo7SUFBQSxDQUFWO0FBQUEsSUFnQkEsVUFBQSxFQUFZLFNBQUEsR0FBQTtBQUNWLFVBQUEsMEJBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxnQkFBZ0IsQ0FBQyxPQUFsQixDQUFBLENBQUEsQ0FBQTtBQUNBO0FBQUEsV0FBQSwyQ0FBQTs4QkFBQTtBQUFBLFFBQUEsVUFBVSxDQUFDLE1BQVgsQ0FBQSxDQUFBLENBQUE7QUFBQSxPQUZVO0lBQUEsQ0FoQlo7R0FERixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/ah/.atom/packages/tabs/lib/main.coffee
