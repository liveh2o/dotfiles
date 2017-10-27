(function() {
  var VimState;

  VimState = require('./vim-state');

  module.exports = {
    configDefaults: {
      'commandModeInputViewFontSize': 11,
      'startInInsertMode': false,
      'useSmartcaseForSearch': false
    },
    _initializeWorkspaceState: function() {
      var _base, _base1, _base2;
      (_base = atom.workspace).vimState || (_base.vimState = {});
      (_base1 = atom.workspace.vimState).registers || (_base1.registers = {});
      return (_base2 = atom.workspace.vimState).searchHistory || (_base2.searchHistory = []);
    },
    activate: function(state) {
      this._initializeWorkspaceState();
      return atom.workspaceView.eachEditorView((function(_this) {
        return function(editorView) {
          if (!editorView.attached) {
            return;
          }
          if (editorView.mini) {
            return;
          }
          editorView.addClass('vim-mode');
          return editorView.vimState = new VimState(editorView);
        };
      })(this));
    },
    deactivate: function() {
      var _ref;
      return (_ref = atom.workspaceView) != null ? _ref.eachEditorView((function(_this) {
        return function(editorView) {
          return editorView.off('.vim-mode');
        };
      })(this)) : void 0;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFFBQUE7O0FBQUEsRUFBQSxRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVIsQ0FBWCxDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsY0FBQSxFQUNFO0FBQUEsTUFBQSw4QkFBQSxFQUFnQyxFQUFoQztBQUFBLE1BQ0EsbUJBQUEsRUFBcUIsS0FEckI7QUFBQSxNQUVBLHVCQUFBLEVBQXlCLEtBRnpCO0tBREY7QUFBQSxJQUtBLHlCQUFBLEVBQTJCLFNBQUEsR0FBQTtBQUN6QixVQUFBLHFCQUFBO0FBQUEsZUFBQSxJQUFJLENBQUMsVUFBUyxDQUFDLGtCQUFELENBQUMsV0FBYSxHQUE1QixDQUFBO0FBQUEsZ0JBQ0EsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFRLENBQUMsb0JBQUQsQ0FBQyxZQUFjLEdBRHRDLENBQUE7dUJBRUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFRLENBQUMsd0JBQUQsQ0FBQyxnQkFBa0IsSUFIakI7SUFBQSxDQUwzQjtBQUFBLElBVUEsUUFBQSxFQUFVLFNBQUMsS0FBRCxHQUFBO0FBQ1IsTUFBQSxJQUFDLENBQUEseUJBQUQsQ0FBQSxDQUFBLENBQUE7YUFDQSxJQUFJLENBQUMsYUFBYSxDQUFDLGNBQW5CLENBQWtDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLFVBQUQsR0FBQTtBQUNoQyxVQUFBLElBQUEsQ0FBQSxVQUF3QixDQUFDLFFBQXpCO0FBQUEsa0JBQUEsQ0FBQTtXQUFBO0FBQ0EsVUFBQSxJQUFVLFVBQVUsQ0FBQyxJQUFyQjtBQUFBLGtCQUFBLENBQUE7V0FEQTtBQUFBLFVBR0EsVUFBVSxDQUFDLFFBQVgsQ0FBb0IsVUFBcEIsQ0FIQSxDQUFBO2lCQUlBLFVBQVUsQ0FBQyxRQUFYLEdBQTBCLElBQUEsUUFBQSxDQUFTLFVBQVQsRUFMTTtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWxDLEVBRlE7SUFBQSxDQVZWO0FBQUEsSUFtQkEsVUFBQSxFQUFZLFNBQUEsR0FBQTtBQUNWLFVBQUEsSUFBQTt1REFBa0IsQ0FBRSxjQUFwQixDQUFtQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxVQUFELEdBQUE7aUJBQ2pDLFVBQVUsQ0FBQyxHQUFYLENBQWUsV0FBZixFQURpQztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQW5DLFdBRFU7SUFBQSxDQW5CWjtHQUhGLENBQUE7QUFBQSIKfQ==
//# sourceURL=/Users/ah/.atom/packages/vim-mode/lib/vim-mode.coffee