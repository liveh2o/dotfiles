(function() {
  var getEditor, getLinesToJump;

  getEditor = function() {
    var _ref;
    return (_ref = atom.workspaceView.getActiveView()) != null ? _ref.editor : void 0;
  };

  getLinesToJump = function() {
    return atom.config.getPositiveInt('line-jumper.numberOfLines', 1);
  };

  module.exports = {
    configDefaults: {
      numberOfLines: 10
    },
    activate: function() {
      atom.workspaceView.command('line-jumper:move-up', function() {
        var _ref;
        return (_ref = getEditor()) != null ? _ref.moveCursorUp(getLinesToJump()) : void 0;
      });
      atom.workspaceView.command('line-jumper:move-down', function() {
        var _ref;
        return (_ref = getEditor()) != null ? _ref.moveCursorDown(getLinesToJump()) : void 0;
      });
      atom.workspaceView.command('line-jumper:select-up', function() {
        var _ref;
        return (_ref = getEditor()) != null ? _ref.selectUp(getLinesToJump()) : void 0;
      });
      return atom.workspaceView.command('line-jumper:select-down', function() {
        var _ref;
        return (_ref = getEditor()) != null ? _ref.selectDown(getLinesToJump()) : void 0;
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHlCQUFBOztBQUFBLEVBQUEsU0FBQSxHQUFZLFNBQUEsR0FBQTtBQUNWLFFBQUEsSUFBQTtxRUFBa0MsQ0FBRSxnQkFEMUI7RUFBQSxDQUFaLENBQUE7O0FBQUEsRUFHQSxjQUFBLEdBQWlCLFNBQUEsR0FBQTtXQUNmLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBWixDQUEyQiwyQkFBM0IsRUFBd0QsQ0FBeEQsRUFEZTtFQUFBLENBSGpCLENBQUE7O0FBQUEsRUFNQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxjQUFBLEVBQ0U7QUFBQSxNQUFBLGFBQUEsRUFBZSxFQUFmO0tBREY7QUFBQSxJQUdBLFFBQUEsRUFBVSxTQUFBLEdBQUE7QUFDUixNQUFBLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBbkIsQ0FBMkIscUJBQTNCLEVBQWtELFNBQUEsR0FBQTtBQUNoRCxZQUFBLElBQUE7a0RBQVcsQ0FBRSxZQUFiLENBQTBCLGNBQUEsQ0FBQSxDQUExQixXQURnRDtNQUFBLENBQWxELENBQUEsQ0FBQTtBQUFBLE1BR0EsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFuQixDQUEyQix1QkFBM0IsRUFBb0QsU0FBQSxHQUFBO0FBQ2xELFlBQUEsSUFBQTtrREFBVyxDQUFFLGNBQWIsQ0FBNEIsY0FBQSxDQUFBLENBQTVCLFdBRGtEO01BQUEsQ0FBcEQsQ0FIQSxDQUFBO0FBQUEsTUFNQSxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQW5CLENBQTJCLHVCQUEzQixFQUFvRCxTQUFBLEdBQUE7QUFDbEQsWUFBQSxJQUFBO2tEQUFXLENBQUUsUUFBYixDQUFzQixjQUFBLENBQUEsQ0FBdEIsV0FEa0Q7TUFBQSxDQUFwRCxDQU5BLENBQUE7YUFTQSxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQW5CLENBQTJCLHlCQUEzQixFQUFzRCxTQUFBLEdBQUE7QUFDcEQsWUFBQSxJQUFBO2tEQUFXLENBQUUsVUFBYixDQUF3QixjQUFBLENBQUEsQ0FBeEIsV0FEb0Q7TUFBQSxDQUF0RCxFQVZRO0lBQUEsQ0FIVjtHQVBGLENBQUE7QUFBQSIKfQ==
//# sourceURL=/Users/ah/.atom/packages/line-jumper/lib/line-jumper.coffee