(function() {
  module.exports = {
    configDefaults: {
      fullscreen: false,
      width: atom.config.get('editor.preferredLineLength')
    },
    unSoftWrap: false,
    showTreeView: false,
    oldWidth: null,
    activate: function(state) {
      return atom.workspaceView.command("zen:toggle", (function(_this) {
        return function() {
          return _this.toggle();
        };
      })(this));
    },
    toggle: function() {
      var bgColor, editor, editorView, fullscreen, tabs, width, workspace;
      fullscreen = atom.config.get('Zen.fullscreen');
      width = atom.config.get('Zen.width');
      workspace = atom.workspaceView;
      tabs = atom.packages.activePackages.tabs;
      editor = workspace.getActiveView().editor;
      editorView = workspace.find('.editor:not(.mini)');
      if (workspace.is(':not(.zen)')) {
        if (!editor.isSoftWrapped()) {
          editor.setSoftWrapped(true);
          this.unSoftWrap = true;
        }
        if (workspace.find('.tree-view').length) {
          workspace.trigger('tree-view:toggle');
          this.showTreeView = true;
        }
        if (tabs != null) {
          tabs.deactivate();
        }
        this.oldWidth = editorView.css('width');
        editorView.css('width', "" + (editor.getDefaultCharWidth() * width) + "px");
        bgColor = workspace.find('.editor-colors').css('background-color');
        if (fullscreen) {
          atom.setFullScreen(true);
        }
      } else {
        bgColor = workspace.find('.panes .pane').css('background-color');
        if (tabs != null) {
          tabs.activate();
        }
        if (fullscreen) {
          atom.setFullScreen(false);
        }
        if (this.unSoftWrap) {
          editor.setSoftWrapped(false);
          this.unSoftWrap = null;
        }
        if (this.showTreeView) {
          workspace.trigger('tree-view:toggle');
          this.showTreeView = null;
        }
        if (this.oldWidth) {
          editorView.css('width', this.oldWidth);
          this.oldWidth = null;
        }
      }
      workspace.find('.panes .pane').css('background-color', bgColor);
      return workspace.toggleClass('zen');
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLGNBQUEsRUFDRTtBQUFBLE1BQUEsVUFBQSxFQUFZLEtBQVo7QUFBQSxNQUNBLEtBQUEsRUFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsNEJBQWhCLENBRFA7S0FERjtBQUFBLElBSUEsVUFBQSxFQUFZLEtBSlo7QUFBQSxJQUtBLFlBQUEsRUFBYyxLQUxkO0FBQUEsSUFNQSxRQUFBLEVBQVUsSUFOVjtBQUFBLElBUUEsUUFBQSxFQUFVLFNBQUMsS0FBRCxHQUFBO2FBQ1IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFuQixDQUEyQixZQUEzQixFQUF5QyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUFHLEtBQUMsQ0FBQSxNQUFELENBQUEsRUFBSDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXpDLEVBRFE7SUFBQSxDQVJWO0FBQUEsSUFXQSxNQUFBLEVBQVEsU0FBQSxHQUFBO0FBQ04sVUFBQSwrREFBQTtBQUFBLE1BQUEsVUFBQSxHQUFhLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixnQkFBaEIsQ0FBYixDQUFBO0FBQUEsTUFDQSxLQUFBLEdBQVEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLFdBQWhCLENBRFIsQ0FBQTtBQUFBLE1BRUEsU0FBQSxHQUFZLElBQUksQ0FBQyxhQUZqQixDQUFBO0FBQUEsTUFHQSxJQUFBLEdBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsSUFIcEMsQ0FBQTtBQUFBLE1BSUEsTUFBQSxHQUFTLFNBQVMsQ0FBQyxhQUFWLENBQUEsQ0FBeUIsQ0FBQyxNQUpuQyxDQUFBO0FBQUEsTUFLQSxVQUFBLEdB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
//# sourceURL=/Users/ah/.atom/packages/Zen/lib/zen.coffee