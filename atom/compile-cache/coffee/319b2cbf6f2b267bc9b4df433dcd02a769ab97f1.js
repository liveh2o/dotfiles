(function() {
  var HighlightLineView;

  HighlightLineView = require('./highlight-line-view');

  module.exports = {
    configDefaults: {
      enableBackgroundColor: true,
      hideHighlightOnSelect: false,
      enableUnderline: false,
      enableSelectionBorder: false,
      underline: {
        solid: true,
        dotted: false,
        dashed: false
      }
    },
    line: null,
    activate: function() {
      this.line = new HighlightLineView();
      this.line.attach();
      atom.workspaceView.command('highlight-line:toggle-background', '.editor', (function(_this) {
        return function() {
          return _this.toggleHighlight();
        };
      })(this));
      atom.workspaceView.command('highlight-line:toggle-hide-highlight-on-select', '.editor', (function(_this) {
        return function() {
          return _this.toggleHideHighlightOnSelect();
        };
      })(this));
      atom.workspaceView.command('highlight-line:toggle-underline', '.editor', (function(_this) {
        return function() {
          return _this.toggleUnderline();
        };
      })(this));
      return atom.workspaceView.command('highlight-line:toggle-selection-borders', '.editor', (function(_this) {
        return function() {
          return _this.toggleSelectionBorders();
        };
      })(this));
    },
    deactivate: function() {
      this.line.destroy();
      atom.workspaceView.off('highlight-line:toggle-background');
      atom.workspaceView.off('highlight-line:toggle-underline');
      return atom.workspaceView.off('highlight-line:toggle-selection-borders');
    },
    toggleHighlight: function() {
      var current;
      current = atom.config.get('highlight-line.enableBackgroundColor');
      return atom.config.set('highlight-line.enableBackgroundColor', !current);
    },
    toggleHideHighlightOnSelect: function() {
      var current;
      current = atom.config.get('highlight-line.hideHighlightOnSelect');
      return atom.config.set('highlight-line.hideHighlightOnSelect', !current);
    },
    toggleUnderline: function() {
      var current;
      current = atom.config.get('highlight-line.enableUnderline');
      return atom.config.set('highlight-line.enableUnderline', !current);
    },
    toggleSelectionBorders: function() {
      var current;
      current = atom.config.get('highlight-line.enableSelectionBorder');
      return atom.config.set('highlight-line.enableSelectionBorder', !current);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlCQUFBOztBQUFBLEVBQUEsaUJBQUEsR0FBb0IsT0FBQSxDQUFRLHVCQUFSLENBQXBCLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxjQUFBLEVBQ0U7QUFBQSxNQUFBLHFCQUFBLEVBQXVCLElBQXZCO0FBQUEsTUFDQSxxQkFBQSxFQUF1QixLQUR2QjtBQUFBLE1BRUEsZUFBQSxFQUFpQixLQUZqQjtBQUFBLE1BR0EscUJBQUEsRUFBdUIsS0FIdkI7QUFBQSxNQUlBLFNBQUEsRUFDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLElBQVA7QUFBQSxRQUNBLE1BQUEsRUFBUSxLQURSO0FBQUEsUUFFQSxNQUFBLEVBQVEsS0FGUjtPQUxGO0tBREY7QUFBQSxJQVNBLElBQUEsRUFBTSxJQVROO0FBQUEsSUFXQSxRQUFBLEVBQVUsU0FBQSxHQUFBO0FBQ1IsTUFBQSxJQUFDLENBQUEsSUFBRCxHQUFZLElBQUEsaUJBQUEsQ0FBQSxDQUFaLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxJQUFJLENBQUMsTUFBTixDQUFBLENBREEsQ0FBQTtBQUFBLE1BR0EsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFuQixDQUNFLGtDQURGLEVBQ3NDLFNBRHRDLEVBQ2lELENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQzdDLEtBQUMsQ0FBQSxlQUFELENBQUEsRUFENkM7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQURqRCxDQUhBLENBQUE7QUFBQSxNQU9BLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBbkIsQ0FDRSxnREFERixFQUNvRCxTQURwRCxFQUMrRCxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUMzRCxLQUFDLENBQUEsMkJBQUQsQ0FBQSxFQUQyRDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRC9ELENBUEEsQ0FBQTtBQUFBLE1BV0EsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFuQixDQUNFLGlDQURGLEVBQ3FDLFNBRHJDLEVBQ2dELENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQzVDLEtBQUMsQ0FBQSxlQUFELENBQUEsRUFENEM7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQURoRCxDQVhBLENBQUE7YUFlQSxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQW5CLENBQ0UseUNBREYsRUFDNkMsU0FEN0MsRUFDd0QsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDcEQsS0FBQyxDQUFBLHNCQUFELENBQUEsRUFEb0Q7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUR4RCxFQWhCUTtJQUFBLENBWFY7QUFBQSxJQWdDQSxVQUFBLEVBQVksU0FBQSxHQUFBO0FBQ1YsTUFBQSxJQUFDLENBQUEsSUFBSSxDQUFDLE9BQU4sQ0FBQSxDQUFBLENBQUE7QUFBQSxNQUNBLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBbkIsQ0FBdUIsa0NBQXZCLENBREEsQ0FBQTtBQUFBLE1BRUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFuQixDQUF1QixpQ0FBdkIsQ0FGQSxDQUFBO2FBR0EsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFuQixDQUF1Qix5Q0FBdkIsRUFKVTtJQUFBLENBaENaO0FBQUEsSUFzQ0EsZUFBQSxFQUFpQixTQUFBLEdBQUE7QUFDZixVQUFBLE9BQUE7QUFBQSxNQUFBLE9BQUEsR0FBVSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isc0NBQWhCLENBQVYsQ0FBQTthQUNBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixzQ0FBaEIsRUFBd0QsQ0FBQSxPQUF4RCxFQUZlO0lBQUEsQ0F0Q2pCO0FBQUEsSUEwQ0EsMkJBQUEsRUFBNkIsU0FBQSxHQUFBO0FBQzNCLFVBQUEsT0FBQTtBQUFBLE1BQUEsT0FBQSxHQUFVLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixzQ0FBaEIsQ0FBVixDQUFBO2FBQ0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHNDQUFoQixFQUF3RCxDQUFBLE9BQXhELEVBRjJCO0lBQUEsQ0ExQzdCO0FBQUEsSUE4Q0EsZUFBQSxFQUFpQixTQUFBLEdBQUE7QUFDZixVQUFBLE9BQUE7QUFBQSxNQUFBLE9BQUEsR0FBVSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsZ0NBQWhCLENBQVYsQ0FBQTthQUNBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixnQ0FBaEIsRUFBa0QsQ0FBQSxPQUFsRCxFQUZlO0lBQUEsQ0E5Q2pCO0FBQUEsSUFrREEsc0JBQUEsRUFBd0IsU0FBQSxHQUFBO0FBQ3RCLFVBQUEsT0FBQTtBQUFBLE1BQUEsT0FBQSxHQUFVLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixzQ0FBaEIsQ0FBVixDQUFBO2FBQ0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHNDQUFoQixFQUF3RCxDQUFBLE9BQXhELEVBRnNCO0lBQUEsQ0FsRHhCO0dBSEYsQ0FBQTtBQUFBIgp9
//# sourceURL=/Users/ah/.atom/packages/highlight-line/lib/highlight-line.coffee