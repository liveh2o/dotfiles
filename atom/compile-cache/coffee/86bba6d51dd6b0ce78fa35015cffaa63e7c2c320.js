(function() {
  var SoftWrapIndicator;

  SoftWrapIndicator = (function() {
    function SoftWrapIndicator() {}

    SoftWrapIndicator.prototype.view = null;

    SoftWrapIndicator.prototype.activate = function() {
      return atom.packages.once('activated', (function(_this) {
        return function() {
          var SoftWrapIndicatorView, statusBar;
          statusBar = atom.workspaceView.statusBar;
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
      return (_ref = this.view) != null ? _ref.destroy() : void 0;
    };

    return SoftWrapIndicator;

  })();

  module.exports = new SoftWrapIndicator();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQ0E7QUFBQSxNQUFBLGlCQUFBOztBQUFBLEVBQU07bUNBQ0o7O0FBQUEsZ0NBQUEsSUFBQSxHQUFNLElBQU4sQ0FBQTs7QUFBQSxnQ0FHQSxRQUFBLEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFkLENBQW1CLFdBQW5CLEVBQWdDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDOUIsY0FBQSxnQ0FBQTtBQUFBLFVBQUMsWUFBYSxJQUFJLENBQUMsY0FBbEIsU0FBRCxDQUFBO0FBQ0EsVUFBQSxJQUFHLGlCQUFIO0FBQ0UsWUFBQSxxQkFBQSxHQUF3QixPQUFBLENBQVEsNEJBQVIsQ0FBeEIsQ0FBQTtBQUFBLFlBQ0EsS0FBQyxDQUFBLElBQUQsR0FBUSxHQUFBLENBQUEscUJBRFIsQ0FBQTtBQUFBLFlBRUEsS0FBQyxDQUFBLElBQUksQ0FBQyxVQUFOLENBQWlCLFNBQWpCLENBRkEsQ0FBQTttQkFHQSxLQUFDLENBQUEsSUFBSSxDQUFDLE1BQU4sQ0FBQSxFQUpGO1dBRjhCO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBaEMsRUFEUTtJQUFBLENBSFYsQ0FBQTs7QUFBQSxnQ0FhQSxVQUFBLEdBQVksU0FBQSxHQUFBO0FBQ1YsVUFBQSxJQUFBOzhDQUFLLENBQUUsT0FBUCxDQUFBLFdBRFU7SUFBQSxDQWJaLENBQUE7OzZCQUFBOztNQURGLENBQUE7O0FBQUEsRUFpQkEsTUFBTSxDQUFDLE9BQVAsR0FBcUIsSUFBQSxpQkFBQSxDQUFBLENBakJyQixDQUFBO0FBQUEiCn0=
//# sourceURL=/Users/ah/.atom/packages/soft-wrap-indicator/lib/soft-wrap-indicator.coffee