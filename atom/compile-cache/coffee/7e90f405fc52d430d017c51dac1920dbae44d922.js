(function() {
  var FileIcons, layout;

  FileIcons = require('./file-icons');

  layout = require('./layout');

  module.exports = {
    activate: function(state) {
      var TabBarView, _;
      layout.activate();
      this.tabBarViews = [];
      TabBarView = require('./tab-bar-view');
      _ = require('underscore-plus');
      atom.commands.add('atom-workspace', {
        'tabs:close-all-tabs': (function(_this) {
          return function() {
            var tabBarView, _i, _ref, _results;
            _ref = _this.tabBarViews;
            _results = [];
            for (_i = _ref.length - 1; _i >= 0; _i += -1) {
              tabBarView = _ref[_i];
              _results.push(tabBarView.closeAllTabs());
            }
            return _results;
          };
        })(this)
      });
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
      var tabBarView, _i, _len, _ref, _ref1;
      layout.deactivate();
      this.paneSubscription.dispose();
      if ((_ref = this.fileIconsDisposable) != null) {
        _ref.dispose();
      }
      _ref1 = this.tabBarViews;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        tabBarView = _ref1[_i];
        tabBarView.remove();
      }
    },
    consumeFileIcons: function(service) {
      FileIcons.setService(service);
      this.fileIconsDisposable = service.onWillDeactivate(function() {
        FileIcons.resetService();
        return this.updateFileIcons();
      });
      return this.updateFileIcons();
    },
    updateFileIcons: function() {
      var tabBarView, tabView, _i, _len, _ref, _results;
      _ref = this.tabBarViews;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        tabBarView = _ref[_i];
        _results.push((function() {
          var _j, _len1, _ref1, _results1;
          _ref1 = tabBarView.getTabs();
          _results1 = [];
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            tabView = _ref1[_j];
            _results1.push(tabView.updateIcon());
          }
          return _results1;
        })());
      }
      return _results;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RhYnMvbGliL21haW4uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlCQUFBOztBQUFBLEVBQUEsU0FBQSxHQUFZLE9BQUEsQ0FBUSxjQUFSLENBQVosQ0FBQTs7QUFBQSxFQUNBLE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUixDQURULENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxRQUFBLEVBQVUsU0FBQyxLQUFELEdBQUE7QUFDUixVQUFBLGFBQUE7QUFBQSxNQUFBLE1BQU0sQ0FBQyxRQUFQLENBQUEsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsV0FBRCxHQUFlLEVBRGYsQ0FBQTtBQUFBLE1BR0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxnQkFBUixDQUhiLENBQUE7QUFBQSxNQUlBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVIsQ0FKSixDQUFBO0FBQUEsTUFRQSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQ0U7QUFBQSxRQUFBLHFCQUFBLEVBQXVCLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO0FBR3JCLGdCQUFBLDhCQUFBO0FBQUE7QUFBQTtpQkFBQSx1Q0FBQTtvQ0FBQTtBQUNFLDRCQUFBLFVBQVUsQ0FBQyxZQUFYLENBQUEsRUFBQSxDQURGO0FBQUE7NEJBSHFCO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBdkI7T0FERixDQVJBLENBQUE7YUFlQSxJQUFDLENBQUEsZ0JBQUQsR0FBb0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFmLENBQTRCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLElBQUQsR0FBQTtBQUM5QyxjQUFBLHVCQUFBO0FBQUEsVUFBQSxVQUFBLEdBQWEsR0FBQSxDQUFBLFVBQWIsQ0FBQTtBQUFBLFVBQ0EsVUFBVSxDQUFDLFVBQVgsQ0FBc0IsSUFBdEIsQ0FEQSxDQUFBO0FBQUEsVUFHQSxXQUFBLEdBQWMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLElBQW5CLENBSGQsQ0FBQTtBQUFBLFVBSUEsV0FBVyxDQUFDLFlBQVosQ0FBeUIsVUFBekIsRUFBcUMsV0FBVyxDQUFDLFVBQWpELENBSkEsQ0FBQTtBQUFBLFVBTUEsS0FBQyxDQUFBLFdBQVcsQ0FBQyxJQUFiLENBQWtCLFVBQWxCLENBTkEsQ0FBQTtpQkFPQSxJQUFJLENBQUMsWUFBTCxDQUFrQixTQUFBLEdBQUE7bUJBQUcsQ0FBQyxDQUFDLE1BQUYsQ0FBUyxLQUFDLENBQUEsV0FBVixFQUF1QixVQUF2QixFQUFIO1VBQUEsQ0FBbEIsRUFSOEM7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE1QixFQWhCWjtJQUFBLENBQVY7QUFBQSxJQTBCQSxVQUFBLEVBQVksU0FBQSxHQUFBO0FBQ1YsVUFBQSxpQ0FBQTtBQUFBLE1BQUEsTUFBTSxDQUFDLFVBQVAsQ0FBQSxDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxnQkFBZ0IsQ0FBQyxPQUFsQixDQUFBLENBREEsQ0FBQTs7WUFFb0IsQ0FBRSxPQUF0QixDQUFBO09BRkE7QUFHQTtBQUFBLFdBQUEsNENBQUE7K0JBQUE7QUFBQSxRQUFBLFVBQVUsQ0FBQyxNQUFYLENBQUEsQ0FBQSxDQUFBO0FBQUEsT0FKVTtJQUFBLENBMUJaO0FBQUEsSUFpQ0EsZ0JBQUEsRUFBa0IsU0FBQyxPQUFELEdBQUE7QUFDaEIsTUFBQSxTQUFTLENBQUMsVUFBVixDQUFxQixPQUFyQixDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxtQkFBRCxHQUF1QixPQUFPLENBQUMsZ0JBQVIsQ0FBeUIsU0FBQSxHQUFBO0FBQzlDLFFBQUEsU0FBUyxDQUFDLFlBQVYsQ0FBQSxDQUFBLENBQUE7ZUFDQSxJQUFDLENBQUEsZUFBRCxDQUFBLEVBRjhDO01BQUEsQ0FBekIsQ0FEdkIsQ0FBQTthQUlBLElBQUMsQ0FBQSxlQUFELENBQUEsRUFMZ0I7SUFBQSxDQWpDbEI7QUFBQSxJQXdDQSxlQUFBLEVBQWlCLFNBQUEsR0FBQTtBQUNmLFVBQUEsNkNBQUE7QUFBQTtBQUFBO1dBQUEsMkNBQUE7OEJBQUE7QUFDRTs7QUFBQTtBQUFBO2VBQUEsOENBQUE7Z0NBQUE7QUFBQSwyQkFBQSxPQUFPLENBQUMsVUFBUixDQUFBLEVBQUEsQ0FBQTtBQUFBOzthQUFBLENBREY7QUFBQTtzQkFEZTtJQUFBLENBeENqQjtHQUpGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/ah/.atom/packages/tabs/lib/main.coffee
