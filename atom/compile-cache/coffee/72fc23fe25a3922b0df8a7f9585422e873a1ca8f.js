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
      },
      usePreviewTabs: {
        type: 'boolean',
        "default": false,
        description: 'Tabs will only stay open if they are modified or double-clicked'
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
          tabBarView = new TabBarView(pane, state.shift());
          paneElement = atom.views.getView(pane);
          paneElement.insertBefore(tabBarView.element, paneElement.firstChild);
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
