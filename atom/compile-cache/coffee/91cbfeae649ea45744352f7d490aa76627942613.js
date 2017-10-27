(function() {
  var SoftWrapIndicator;

  SoftWrapIndicator = (function() {
    function SoftWrapIndicator() {}

    SoftWrapIndicator.prototype.view = null;

    SoftWrapIndicator.prototype.activate = function() {
      return atom.packages.onDidActivateAll((function(_this) {
        return function() {
          var SoftWrapIndicatorView, statusBar;
          statusBar = document.querySelector('status-bar');
          if (statusBar != null) {
            SoftWrapIndicatorView = require('./soft-wrap-indicator-view');
            _this.view = new SoftWrapIndicatorView;
            _this.view.initialize(statusBar);
            return _this.view.attach();
          }
        };
      })(this));
    };

    SoftWrapIndicator.prototype.deactivate = function() {
      var _ref;
      if ((_ref = this.view) != null) {
        _ref.destroy();
      }
      return this.view = null;
    };

    return SoftWrapIndicator;

  })();

  module.exports = new SoftWrapIndicator();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQ0E7QUFBQSxNQUFBLGlCQUFBOztBQUFBLEVBQU07bUNBQ0o7O0FBQUEsZ0NBQUEsSUFBQSxHQUFNLElBQU4sQ0FBQTs7QUFBQSxnQ0FHQSxRQUFBLEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZCxDQUErQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQzdCLGNBQUEsZ0NBQUE7QUFBQSxVQUFBLFNBQUEsR0FBWSxRQUFRLENBQUMsYUFBVCxDQUF1QixZQUF2QixDQUFaLENBQUE7QUFDQSxVQUFBLElBQUcsaUJBQUg7QUFDRSxZQUFBLHFCQUFBLEdBQXdCLE9BQUEsQ0FBUSw0QkFBUixDQUF4QixDQUFBO0FBQUEsWUFDQSxLQUFDLENBQUEsSUFBRCxHQUFRLEdBQUEsQ0FBQSxxQkFEUixDQUFBO0FBQUEsWUFFQSxLQUFDLENBQUEsSUFBSSxDQUFDLFVBQU4sQ0FBaUIsU0FBakIsQ0FGQSxDQUFBO21CQUdBLEtBQUMsQ0FBQSxJQUFJLENBQUMsTUFBTixDQUFBLEVBSkY7V0FGNkI7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUEvQixFQURRO0lBQUEsQ0FIVixDQUFBOztBQUFBLGdDQWFBLFVBQUEsR0FBWSxTQUFBLEdBQUE7QUFDVixVQUFBLElBQUE7O1lBQUssQ0FBRSxPQUFQLENBQUE7T0FBQTthQUNBLElBQUMsQ0FBQSxJQUFELEdBQVEsS0FGRTtJQUFBLENBYlosQ0FBQTs7NkJBQUE7O01BREYsQ0FBQTs7QUFBQSxFQWtCQSxNQUFNLENBQUMsT0FBUCxHQUFxQixJQUFBLGlCQUFBLENBQUEsQ0FsQnJCLENBQUE7QUFBQSIKfQ==
//# sourceURL=/Users/ah/.atom/packages/soft-wrap-indicator/lib/soft-wrap-indicator.coffee