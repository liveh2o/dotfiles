(function() {
  module.exports = {
    activate: function() {},
    consumeStatusBar: function(statusBar) {
      var SoftWrapIndicatorView;
      this.statusBar = statusBar;
      SoftWrapIndicatorView = require('./soft-wrap-indicator-view');
      this.view = new SoftWrapIndicatorView();
      this.view.initialize(statusBar);
      return this.view.attach();
    },
    deactivate: function() {
      var _ref;
      if ((_ref = this.view) != null) {
        _ref.destroy();
      }
      return this.view = null;
    }
  };

}).call(this);
