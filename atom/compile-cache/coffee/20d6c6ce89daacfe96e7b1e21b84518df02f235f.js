(function() {
  var CompositeDisposable, HighlightLineView;

  CompositeDisposable = require("atom").CompositeDisposable;

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
    subscriptions: null,
    activate: function() {
      this.line = new HighlightLineView();
      this.line.attach();
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.commands.add("atom-workspace", {
        'highlight-line:toggle-background': (function(_this) {
          return function() {
            return _this.toggleHighlight();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add("atom-workspace", {
        'highlight-line:toggle-hide-highlight-on-select': (function(_this) {
          return function() {
            return _this.toggleHideHighlightOnSelect();
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add("atom-workspace", {
        'highlight-line:toggle-underline': (function(_this) {
          return function() {
            return _this.toggleUnderline();
          };
        })(this)
      }));
      return this.subscriptions.add(atom.commands.add("atom-workspace", {
        'highlight-line:toggle-selection-borders': (function(_this) {
          return function() {
            return _this.toggleSelectionBorders();
          };
        })(this)
      }));
    },
    deactivate: function() {
      this.line.destroy();
      this.subscriptions.dispose();
      return this.subscriptions = null;
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
