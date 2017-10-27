(function() {
  var HighlightLineView;

  HighlightLineView = require('./highlight-line-view');

  module.exports = {
    config: {
      enableBackgroundColor: {
        type: 'boolean',
        "default": true
      },
      hideHighlightOnSelect: {
        type: 'boolean',
        "default": false
      },
      enableUnderline: {
        type: 'boolean',
        "default": false
      },
      enableSelectionBorder: {
        type: 'boolean',
        "default": false
      },
      underline: {
        type: 'string',
        "default": 'solid',
        "enum": ['solid', 'dotted', 'dashed']
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlCQUFBOztBQUFBLEVBQUEsaUJBQUEsR0FBb0IsT0FBQSxDQUFRLHVCQUFSLENBQXBCLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxNQUFBLEVBQ0U7QUFBQSxNQUFBLHFCQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsSUFEVDtPQURGO0FBQUEsTUFHQSxxQkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLEtBRFQ7T0FKRjtBQUFBLE1BTUEsZUFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLEtBRFQ7T0FQRjtBQUFBLE1BU0EscUJBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxLQURUO09BVkY7QUFBQSxNQVlBLFNBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFFBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxPQURUO0FBQUEsUUFFQSxNQUFBLEVBQU0sQ0FBQyxPQUFELEVBQVUsUUFBVixFQUFvQixRQUFwQixDQUZOO09BYkY7S0FERjtBQUFBLElBaUJBLElBQUEsRUFBTSxJQWpCTjtBQUFBLElBbUJBLFFBQUEsRUFBVSxTQUFBLEdBQUE7QUFDUixNQUFBLElBQUMsQ0FBQSxJQUFELEdBQVksSUFBQSxpQkFBQSxDQUFBLENBQVosQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLElBQUksQ0FBQyxNQUFOLENBQUEsQ0FEQSxDQUFBO0FBQUEsTUFHQSxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQW5CLENBQ0Usa0NBREYsRUFDc0MsU0FEdEMsRUFDaUQs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
//# sourceURL=/Users/ah/.atom/packages/highlight-line/lib/highlight-line.coffee