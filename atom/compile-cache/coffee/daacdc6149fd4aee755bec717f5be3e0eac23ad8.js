(function() {
  module.exports = {
    configDefaults: {
      fullscreen: false,
      hideTabs: true,
      width: atom.config.get('editor.preferredLineLength')
    },
    unSoftWrap: false,
    showTreeView: false,
    oldWidth: null,
    paneChanged: null,
    activate: function(state) {
      return atom.workspaceView.command("zen:toggle", (function(_this) {
        return function() {
          return _this.toggle();
        };
      })(this));
    },
    toggle: function() {
      var bgColor, charWidth, editor, editorView, fullscreen, hideTabs, tabs, width, workspace, _ref;
      fullscreen = atom.config.get('Zen.fullscreen');
      hideTabs = atom.config.get('Zen.hideTabs');
      width = atom.config.get('Zen.width');
      workspace = atom.workspaceView;
      tabs = atom.packages.activePackages.tabs;
      editor = workspace.getActiveView().editor;
      editorView = workspace.find('.editor:not(.mini)');
      charWidth = editor.getDefaultCharWidth();
      if (workspace.is(':not(.zen)')) {
        if (!editor.isSoftWrapped()) {
          editor.setSoftWrapped(true);
          this.unSoftWrap = true;
        }
        if (workspace.find('.tree-view').length) {
          workspace.trigger('tree-view:toggle');
          this.showTreeView = true;
        }
        if (hideTabs) {
          if (tabs != null) {
            tabs.deactivate();
          }
        }
        this.oldWidth = editorView.css('width');
        editorView.css('width', "" + (charWidth * width) + "px");
        bgColor = workspace.find('.editor-colors').css('background-color');
        if (fullscreen) {
          atom.setFullScreen(true);
        }
        this.paneChanged = atom.workspace.onDidChangeActivePaneItem(function() {
          return requestAnimationFrame(function() {
            var view;
            view = atom.workspaceView.find('.editor:not(.mini)');
            return view.css({
              'width': "" + (charWidth * width) + "px"
            });
          });
        });
      } else {
        bgColor = workspace.find('.panes .pane').css('background-color');
        if (hideTabs) {
          if (tabs != null) {
            tabs.activate();
          }
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
        if ((_ref = this.paneChanged) != null) {
          _ref.dispose();
        }
      }
      workspace.find('.panes .pane').css('background-color', bgColor);
      return workspace.toggleClass('zen');
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLGNBQUEsRUFDRTtBQUFBLE1BQUEsVUFBQSxFQUFZLEtBQVo7QUFBQSxNQUNBLFFBQUEsRUFBVSxJQURWO0FBQUEsTUFFQSxLQUFBLEVBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDRCQUFoQixDQUZQO0tBREY7QUFBQSxJQUtBLFVBQUEsRUFBWSxLQUxaO0FBQUEsSUFNQSxZQUFBLEVBQWMsS0FOZDtBQUFBLElBT0EsUUFBQSxFQUFVLElBUFY7QUFBQSxJQVFBLFdBQUEsRUFBYSxJQVJiO0FBQUEsSUFVQSxRQUFBLEVBQVUsU0FBQyxLQUFELEdBQUE7YUFDUixJQUFJLENBQUMsYUFBYSxDQUFDLE9BQW5CLENBQTJCLFlBQTNCLEVBQXlDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQUcsS0FBQyxDQUFBLE1BQUQsQ0FBQSxFQUFIO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBekMsRUFEUTtJQUFBLENBVlY7QUFBQSxJQWFBLE1BQUEsRUFBUSxTQUFBLEdBQUE7QUFDTixVQUFBLDBGQUFBO0FBQUEsTUFBQSxVQUFBLEdBQWEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGdCQUFoQixDQUFiLENBQUE7QUFBQSxNQUNBLFFBQUEsR0FBVyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsY0FBaEIsQ0FEWCxDQUFBO0FBQUEsTUFFQSxLQUFBLEdBQVEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLFdBQWhCLENBRlIsQ0FBQTtBQUFBLE1BSUEsU0FBQSxHQUFZLElBQUksQ0FBQyxhQUpqQixDQUFBO0FBQUEsTUFLQSxJQUFBLEdBQU8sSUFB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
//# sourceURL=/Users/ah/.atom/packages/Zen/lib/zen.coffee