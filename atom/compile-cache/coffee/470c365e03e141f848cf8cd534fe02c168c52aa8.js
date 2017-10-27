(function() {
  var SoftWrapIndicator, SoftWrapIndicatorView;

  SoftWrapIndicatorView = require('./soft-wrap-indicator-view');

  SoftWrapIndicator = (function() {
    function SoftWrapIndicator() {}

    SoftWrapIndicator.prototype.view = null;

    SoftWrapIndicator.prototype.activate = function() {
      return atom.packages.once('activated', (function(_this) {
        return function() {
          var statusBar;
          statusBar = atom.workspaceView.statusBar;
          if (statusBar != null) {
            _this.view = new SoftWrapIndicatorView(statusBar);
            return statusBar.appendLeft(_this.view);
          }
        };
      })(this));
    };

    SoftWrapIndicator.prototype.deactivate = function() {
      var _ref;
      return (_ref = this.view) != null ? _ref.destroy() : void 0;
    };

    return SoftWrapIndicator;

  })();

  module.exports = new SoftWrapIndicator();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHdDQUFBOztBQUFBLEVBQUEscUJBQUEsR0FBd0IsT0FBQSxDQUFRLDRCQUFSLENBQXhCLENBQUE7O0FBQUEsRUFHTTttQ0FDSjs7QUFBQSxnQ0FBQSxJQUFBLEdBQU0sSUFBTixDQUFBOztBQUFBLGdDQUdBLFFBQUEsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFJLENBQUMsUUFBUSxDQUFDLElBQWQsQ0FBbUIsV0FBbkIsRUFBZ0MsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUM5QixjQUFBLFNBQUE7QUFBQSxVQUFBLFNBQUEsR0FBWSxJQUFJLENBQUMsYUFBYSxDQUFDLFNBQS9CLENBQUE7QUFDQSxVQUFBLElBQUcsaUJBQUg7QUFDRSxZQUFBLEtBQUMsQ0FBQSxJQUFELEdBQVksSUFBQSxxQkFBQSxDQUFzQixTQUF0QixDQUFaLENBQUE7bUJBQ0EsU0FBUyxDQUFDLFVBQVYsQ0FBcUIsS0FBQyxDQUFBLElBQXRCLEVBRkY7V0FGOEI7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFoQyxFQURRO0lBQUEsQ0FIVixDQUFBOztBQUFBLGdDQVdBLFVBQUEsR0FBWSxTQUFBLEdBQUE7QUFDVixVQUFBLElBQUE7OENBQUssQ0FBRSxPQUFQLENBQUEsV0FEVTtJQUFBLENBWFosQ0FBQTs7NkJBQUE7O01BSkYsQ0FBQTs7QUFBQSxFQWtCQSxNQUFNLENBQUMsT0FBUCxHQUFxQixJQUFBLGlCQUFBLENBQUEsQ0FsQnJCLENBQUE7QUFBQSIKfQ==
//# sourceURL=/Users/ah/.atom/packages/soft-wrap-indicator/lib/soft-wrap-indicator.coffee