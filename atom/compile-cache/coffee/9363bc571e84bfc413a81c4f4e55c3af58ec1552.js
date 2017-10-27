(function() {
  var WrapGuideElement;

  WrapGuideElement = require('./wrap-guide-element');

  module.exports = {
    activate: function() {
      return atom.workspace.observeTextEditors(function(editor) {
        var editorElement, wrapGuideElement, _ref;
        wrapGuideElement = new WrapGuideElement().initialize(editor);
        editorElement = atom.views.getView(editor);
        return (_ref = editorElement.querySelector(".underlayer")) != null ? _ref.appendChild(wrapGuideElement) : void 0;
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdCQUFBOztBQUFBLEVBQUEsZ0JBQUEsR0FBbUIsT0FBQSxDQUFRLHNCQUFSLENBQW5CLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxRQUFBLEVBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBZixDQUFrQyxTQUFDLE1BQUQsR0FBQTtBQUNoQyxZQUFBLHFDQUFBO0FBQUEsUUFBQSxnQkFBQSxHQUF1QixJQUFBLGdCQUFBLENBQUEsQ0FBa0IsQ0FBQyxVQUFuQixDQUE4QixNQUE5QixDQUF2QixDQUFBO0FBQUEsUUFDQSxhQUFBLEdBQWdCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixNQUFuQixDQURoQixDQUFBO2lGQUUwQyxDQUFFLFdBQTVDLENBQXdELGdCQUF4RCxXQUhnQztNQUFBLENBQWxDLEVBRFE7SUFBQSxDQUFWO0dBSEYsQ0FBQTtBQUFBIgp9
//# sourceURL=/Users/ah/.atom/packages/wrap-guide/lib/main.coffee