(function() {
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
      var TabBarView, _;
      this.tabBarViews = [];
      TabBarView = require('./tab-bar-view');
      _ = require('underscore-plus');
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
