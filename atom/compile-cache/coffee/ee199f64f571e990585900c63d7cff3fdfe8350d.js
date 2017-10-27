(function() {
  var Disposable, FileIcons, layout;

  Disposable = require('atom').Disposable;

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
      this.updateFileIcons();
      return new Disposable((function(_this) {
        return function() {
          FileIcons.resetService();
          return _this.updateFileIcons();
        };
      })(this));
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RhYnMvbGliL21haW4uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZCQUFBOztBQUFBLEVBQUMsYUFBYyxPQUFBLENBQVEsTUFBUixFQUFkLFVBQUQsQ0FBQTs7QUFBQSxFQUNBLFNBQUEsR0FBWSxPQUFBLENBQVEsY0FBUixDQURaLENBQUE7O0FBQUEsRUFFQSxNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVIsQ0FGVCxDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsUUFBQSxFQUFVLFNBQUMsS0FBRCxHQUFBO0FBQ1IsVUFBQSxhQUFBO0FBQUEsTUFBQSxNQUFNLENBQUMsUUFBUCxDQUFBLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFdBQUQsR0FBZSxFQURmLENBQUE7QUFBQSxNQUdBLFVBQUEsR0FBYSxPQUFBLENBQVEsZ0JBQVIsQ0FIYixDQUFBO0FBQUEsTUFJQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBSkosQ0FBQTtBQUFBLE1BUUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUNFO0FBQUEsUUFBQSxxQkFBQSxFQUF1QixDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTtBQUdyQixnQkFBQSw4QkFBQTtBQUFBO0FBQUE7aUJBQUEsdUNBQUE7b0NBQUE7QUFDRSw0QkFBQSxVQUFVLENBQUMsWUFBWCxDQUFBLEVBQUEsQ0FERjtBQUFBOzRCQUhxQjtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXZCO09BREYsQ0FSQSxDQUFBO2FBZUEsSUFBQyxDQUFBLGdCQUFELEdBQW9CLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBZixDQUE0QixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxJQUFELEdBQUE7QUFDOUMsY0FBQSx1QkFBQTtBQUFBLFVBQUEsVUFBQSxHQUFhLEdBQUEsQ0FBQSxVQUFiLENBQUE7QUFBQSxVQUNBLFVBQVUsQ0FBQyxVQUFYLENBQXNCLElBQXRCLENBREEsQ0FBQTtBQUFBLFVBR0EsV0FBQSxHQUFjLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixJQUFuQixDQUhkLENBQUE7QUFBQSxVQUlBLFdBQVcsQ0FBQyxZQUFaLENBQXlCLFVBQXpCLEVBQXFDLFdBQVcsQ0FBQyxVQUFqRCxDQUpBLENBQUE7QUFBQSxVQU1BLEtBQUMsQ0FBQSxXQUFXLENBQUMsSUFBYixDQUFrQixVQUFsQixDQU5BLENBQUE7aUJBT0EsSUFBSSxDQUFDLFlBQUwsQ0FBa0IsU0FBQSxHQUFBO21CQUFHLENBQUMsQ0FBQyxNQUFGLENBQVMsS0FBQyxDQUFBLFdBQVYsRUFBdUIsVUFBdkIsRUFBSDtVQUFBLENBQWxCLEVBUjhDO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBNUIsRUFoQlo7SUFBQSxDQUFWO0FBQUEsSUEwQkEsVUFBQSxFQUFZLFNBQUEsR0FBQTtBQUNWLFVBQUEsaUNBQUE7QUFBQSxNQUFBLE1BQU0sQ0FBQyxVQUFQLENBQUEsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsZ0JBQWdCLENBQUMsT0FBbEIsQ0FBQSxDQURBLENBQUE7O1lBRW9CLENBQUUsT0FBdEIsQ0FBQTtPQUZBO0FBR0E7QUFBQSxXQUFBLDRDQUFBOytCQUFBO0FBQUEsUUFBQSxVQUFVLENBQUMsTUFBWCxDQUFBLENBQUEsQ0FBQTtBQUFBLE9BSlU7SUFBQSxDQTFCWjtBQUFBLElBaUNBLGdCQUFBLEVBQWtCLFNBQUMsT0FBRCxHQUFBO0FBQ2hCLE1BQUEsU0FBUyxDQUFDLFVBQVYsQ0FBcUIsT0FBckIsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsZUFBRCxDQUFBLENBREEsQ0FBQTthQUVJLElBQUEsVUFBQSxDQUFXLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDYixVQUFBLFNBQVMsQ0FBQyxZQUFWLENBQUEsQ0FBQSxDQUFBO2lCQUNBLEtBQUMsQ0FBQSxlQUFELENBQUEsRUFGYTtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVgsRUFIWTtJQUFBLENBakNsQjtBQUFBLElBd0NBLGVBQUEsRUFBaUIsU0FBQSxHQUFBO0FBQ2YsVUFBQSw2Q0FBQTtBQUFBO0FBQUE7V0FBQSwyQ0FBQTs4QkFBQTtBQUNFOztBQUFBO0FBQUE7ZUFBQSw4Q0FBQTtnQ0FBQTtBQUFBLDJCQUFBLE9BQU8sQ0FBQyxVQUFSLENBQUEsRUFBQSxDQUFBO0FBQUE7O2FBQUEsQ0FERjtBQUFBO3NCQURlO0lBQUEsQ0F4Q2pCO0dBTEYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/ah/.atom/packages/tabs/lib/main.coffee
