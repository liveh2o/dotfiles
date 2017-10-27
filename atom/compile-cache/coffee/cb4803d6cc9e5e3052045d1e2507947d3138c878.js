(function() {
  var Disposable;

  Disposable = require('atom').Disposable;

  module.exports = {
    instance: null,
    config: {
      lintOnFly: {
        title: 'Lint on fly',
        description: 'Lint files while typing, without the need to save them',
        type: 'boolean',
        "default": true,
        order: 1
      },
      ignoredMessageTypes: {
        title: "Ignored message Types",
        type: 'array',
        "default": [],
        items: {
          type: 'string'
        },
        order: 2
      },
      showErrorInline: {
        title: 'Show Inline Tooltips',
        description: 'Show inline tooltips for errors',
        type: 'boolean',
        "default": true,
        order: 3
      },
      underlineIssues: {
        title: 'Underline Issues',
        type: 'boolean',
        "default": true,
        order: 3
      },
      showErrorPanel: {
        title: 'Show Error Panel at the Bottom',
        description: 'Show the list of errors in a bottom panel',
        type: 'boolean',
        "default": true,
        order: 4
      },
      displayLinterInfo: {
        title: 'Display Linter Info in Status Bar',
        description: 'Whether to show any linter information in the status bar',
        type: 'boolean',
        "default": true,
        order: 5
      },
      showErrorTabLine: {
        title: 'Show Line tab in Status Bar',
        type: 'boolean',
        "default": false,
        order: 5
      },
      showErrorTabFile: {
        title: 'Show File tab in Status Bar',
        type: 'boolean',
        "default": true,
        order: 5
      },
      showErrorTabProject: {
        title: 'Show Project tab in Status Bar',
        type: 'boolean',
        "default": true,
        order: 5
      },
      statusIconScope: {
        title: "Scope of messages to show in status icon",
        type: 'string',
        "enum": ['File', 'Line', 'Project'],
        "default": 'Project',
        order: 5
      },
      statusIconPosition: {
        title: 'Position of Status Icon in Status Bar',
        "enum": ['Left', 'Right'],
        type: 'string',
        "default": 'Left',
        order: 5
      }
    },
    activate: function(state) {
      var LinterPlus, atomPackage, deprecate, _i, _len, _ref, _results;
      this.state = state;
      LinterPlus = require('./linter.coffee');
      this.instance = new LinterPlus(state);
      deprecate = require('grim').deprecate;
      _ref = atom.packages.getLoadedPackages();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        atomPackage = _ref[_i];
        if (atomPackage.metadata['linter-package']) {
          _results.push(deprecate('AtomLinter legacy API has been removed. Please refer to the Linter docs to update and the latest API: https://github.com/atom-community/linter/wiki/Migrating-to-the-new-API', {
            packageName: atomPackage.name
          }));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
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
    deactivate: function() {
      var _ref;
      return (_ref = this.instance) != null ? _ref.deactivate() : void 0;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvbWFpbi5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsVUFBQTs7QUFBQSxFQUFDLGFBQWMsT0FBQSxDQUFRLE1BQVIsRUFBZCxVQUFELENBQUE7O0FBQUEsRUFDQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxRQUFBLEVBQVUsSUFBVjtBQUFBLElBQ0EsTUFBQSxFQUNFO0FBQUEsTUFBQSxTQUFBLEVBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTyxhQUFQO0FBQUEsUUFDQSxXQUFBLEVBQWEsd0RBRGI7QUFBQSxRQUVBLElBQUEsRUFBTSxTQUZOO0FBQUEsUUFHQSxTQUFBLEVBQVMsSUFIVDtBQUFBLFFBSUEsS0FBQSxFQUFPLENBSlA7T0FERjtBQUFBLE1BT0EsbUJBQUEsRUFDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLHVCQUFQO0FBQUEsUUFDQSxJQUFBLEVBQU0sT0FETjtBQUFBLFFBRUEsU0FBQSxFQUFTLEVBRlQ7QUFBQSxRQUdBLEtBQUEsRUFDRTtBQUFBLFVBQUEsSUFBQSxFQUFNLFFBQU47U0FKRjtBQUFBLFFBS0EsS0FBQSxFQUFPLENBTFA7T0FSRjtBQUFBLE1BZUEsZUFBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8sc0JBQVA7QUFBQSxRQUNBLFdBQUEsRUFBYSxpQ0FEYjtBQUFBLFFBRUEsSUFBQSxFQUFNLFNBRk47QUFBQSxRQUdBLFNBQUEsRUFBUyxJQUhUO0FBQUEsUUFJQSxLQUFBLEVBQU8sQ0FKUDtPQWhCRjtBQUFBLE1BcUJBLGVBQUEsRUFDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLGtCQUFQO0FBQUEsUUFDQSxJQUFBLEVBQU0sU0FETjtBQUFBLFFBRUEsU0FBQSxFQUFTLElBRlQ7QUFBQSxRQUdBLEtBQUEsRUFBTyxDQUhQ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

//# sourceURL=/Users/ah/.atom/packages/linter/lib/main.coffee
