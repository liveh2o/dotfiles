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
        "default": true
      },
      showErrorPanel: {
        title: 'Show Error Panel at the bottom',
        type: 'boolean',
        "default": true
      },
      showErrorTabLine: {
        title: 'Show Line tab in Bottom Panel',
        type: 'boolean',
        "default": false
      },
      showErrorTabFile: {
        title: 'Show File tab in Bottom Panel',
        type: 'boolean',
        "default": true
      },
      showErrorTabProject: {
        title: 'Show Project tab in Bottom Panel',
        type: 'boolean',
        "default": true
      },
      showErrorInline: {
        title: 'Show Inline Tooltips',
        descriptions: 'Show inline tooltips for errors',
        type: 'boolean',
        "default": true
      },
      underlineIssues: {
        title: 'Underline Issues',
        type: 'boolean',
        "default": true
      },
      ignoredMessageTypes: {
        title: "Ignored message Types",
        type: 'array',
        "default": [],
        items: {
          type: 'string'
        }
      },
      statusIconScope: {
        title: "Scope of messages to show in status icon",
        type: 'string',
        "enum": ['File', 'Line', 'Project'],
        "default": 'Project'
      }
    },
    activate: function(state) {
      var LinterPlus, atomPackage, deprecate, _i, _len, _ref, _results;
      LinterPlus = require('./linter-plus.coffee');
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
      return this.instance.serialize();
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
