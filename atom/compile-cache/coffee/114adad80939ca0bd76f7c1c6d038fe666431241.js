(function() {
  var Disposable;

  Disposable = require('atom').Disposable;

  module.exports = {
    instance: null,
    config: {
      lintOnFly: {
        title: 'Lint As You Type',
        description: 'Lint files while typing, without the need to save',
        type: 'boolean',
        "default": true,
        order: 1
      },
      lintOnFlyInterval: {
        title: 'Lint As You Type Interval',
        description: 'Interval at which providers are triggered as you type (in ms)',
        type: 'integer',
        "default": 300,
        order: 1
      },
      ignoredMessageTypes: {
        description: 'Comma separated list of message types to completely ignore',
        type: 'array',
        "default": [],
        items: {
          type: 'string'
        },
        order: 2
      },
      ignoreVCSIgnoredFiles: {
        title: 'Do Not Lint Files Ignored by VCS',
        description: 'E.g., ignore files specified in .gitignore',
        type: 'boolean',
        "default": true,
        order: 2
      },
      ignoreMatchedFiles: {
        title: 'Do Not Lint Files that match this Glob',
        type: 'string',
        "default": '/**/*.min.{js,css}',
        order: 2
      },
      showErrorInline: {
        title: 'Show Inline Error Tooltips',
        type: 'boolean',
        "default": true,
        order: 3
      },
      inlineTooltipInterval: {
        title: 'Inline Tooltip Interval',
        description: 'Interval at which inline tooltip is updated (in ms)',
        type: 'integer',
        "default": 60,
        order: 3
      },
      gutterEnabled: {
        title: 'Highlight Error Lines in Gutter',
        type: 'boolean',
        "default": true,
        order: 3
      },
      gutterPosition: {
        title: 'Position of Gutter Highlights',
        "enum": ['Left', 'Right'],
        "default": 'Right',
        order: 3,
        type: 'string'
      },
      underlineIssues: {
        title: 'Underline Issues',
        type: 'boolean',
        "default": true,
        order: 3
      },
      showProviderName: {
        title: 'Show Provider Name (When Available)',
        type: 'boolean',
        "default": true,
        order: 3
      },
      showErrorPanel: {
        title: 'Show Error Panel',
        description: 'Show a list of errors at the bottom of the editor',
        type: 'boolean',
        "default": true,
        order: 4
      },
      errorPanelHeight: {
        title: 'Error Panel Height',
        description: 'Height of the error panel (in px)',
        type: 'number',
        "default": 150,
        order: 4
      },
      alwaysTakeMinimumSpace: {
        title: 'Automatically Reduce Error Panel Height',
        description: 'Reduce panel height when it exceeds the height of the error list',
        type: 'boolean',
        "default": true,
        order: 4
      },
      displayLinterInfo: {
        title: 'Display Linter Info in the Status Bar',
        description: 'Whether to show any linter information in the status bar',
        type: 'boolean',
        "default": true,
        order: 5
      },
      displayLinterStatus: {
        title: 'Display Linter Status Info in Status Bar',
        description: 'The `No Issues` or `X Issues` widget',
        type: 'boolean',
        "default": true,
        order: 5
      },
      showErrorTabLine: {
        title: 'Show "Line" Tab in the Status Bar',
        type: 'boolean',
        "default": false,
        order: 5
      },
      showErrorTabFile: {
        title: 'Show "File" Tab in the Status Bar',
        type: 'boolean',
        "default": true,
        order: 5
      },
      showErrorTabProject: {
        title: 'Show "Project" Tab in the Status Bar',
        type: 'boolean',
        "default": true,
        order: 5
      },
      statusIconScope: {
        title: 'Scope of Linter Messages to Show in Status Icon',
        type: 'string',
        "enum": ['File', 'Line', 'Project'],
        "default": 'Project',
        order: 5
      },
      statusIconPosition: {
        title: 'Position of Status Icon in the Status Bar',
        "enum": ['Left', 'Right'],
        type: 'string',
        "default": 'Left',
        order: 5
      }
    },
    activate: function(state) {
      var LinterPlus;
      this.state = state;
      LinterPlus = require('./linter.coffee');
      return this.instance = new LinterPlus(state);
    },
    serialize: function() {
      return this.state;
    },
    consumeLinter: function(linters) {
      var linter, _i, _len;
      if (!(linters instanceof Array)) {
        linters = [linters];
      }
      for (_i = 0, _len = linters.length; _i < _len; _i++) {
        linter = linters[_i];
        this.instance.addLinter(linter);
      }
      return new Disposable((function(_this) {
        return function() {
          var _j, _len1, _results;
          _results = [];
          for (_j = 0, _len1 = linters.length; _j < _len1; _j++) {
            linter = linters[_j];
            _results.push(_this.instance.deleteLinter(linter));
          }
          return _results;
        };
      })(this));
    },
    consumeStatusBar: function(statusBar) {
      return this.instance.views.attachBottom(statusBar);
    },
    provideLinter: function() {
      return this.instance;
    },
    provideIndie: function() {
      var _ref;
      return (_ref = this.instance) != null ? _ref.indieLinters : void 0;
    },
    deactivate: function() {
      var _ref;
      return (_ref = this.instance) != null ? _ref.deactivate() : void 0;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvbWFpbi5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsVUFBQTs7QUFBQSxFQUFDLGFBQWMsT0FBQSxDQUFRLE1BQVIsRUFBZCxVQUFELENBQUE7O0FBQUEsRUFDQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxRQUFBLEVBQVUsSUFBVjtBQUFBLElBQ0EsTUFBQSxFQUNFO0FBQUEsTUFBQSxTQUFBLEVBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTyxrQkFBUDtBQUFBLFFBQ0EsV0FBQSxFQUFhLG1EQURiO0FBQUEsUUFFQSxJQUFBLEVBQU0sU0FGTjtBQUFBLFFBR0EsU0FBQSxFQUFTLElBSFQ7QUFBQSxRQUlBLEtBQUEsRUFBTyxDQUpQO09BREY7QUFBQSxNQU1BLGlCQUFBLEVBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTywyQkFBUDtBQUFBLFFBQ0EsV0FBQSxFQUFhLCtEQURiO0FBQUEsUUFFQSxJQUFBLEVBQU0sU0FGTjtBQUFBLFFBR0EsU0FBQSxFQUFTLEdBSFQ7QUFBQSxRQUlBLEtBQUEsRUFBTyxDQUpQO09BUEY7QUFBQSxNQWFBLG1CQUFBLEVBQ0U7QUFBQSxRQUFBLFdBQUEsRUFBYSw0REFBYjtBQUFBLFFBQ0EsSUFBQSxFQUFNLE9BRE47QUFBQSxRQUVBLFNBQUEsRUFBUyxFQUZUO0FBQUEsUUFHQSxLQUFBLEVBQ0U7QUFBQSxVQUFBLElBQUEsRUFBTSxRQUFOO1NBSkY7QUFBQSxRQUtBLEtBQUEsRUFBTyxDQUxQO09BZEY7QUFBQSxNQW9CQSxxQkFBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8sa0NBQVA7QUFBQSxRQUNBLFdBQUEsRUFBYSw0Q0FEYjtBQUFBLFFBRUEsSUFBQSxFQUFNLFNBRk47QUFBQSxRQUdBLFNBQUEsRUFBUyxJ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

//# sourceURL=/Users/ah/.atom/packages/linter/lib/main.coffee
