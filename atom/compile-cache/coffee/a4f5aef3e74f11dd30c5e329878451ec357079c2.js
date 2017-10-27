(function() {
  var CompositeDisposable, LinterInitializer;

  CompositeDisposable = require('atom').CompositeDisposable;

  LinterInitializer = (function() {
    function LinterInitializer() {}

    LinterInitializer.prototype.config = {
      lintOnSave: {
        type: 'boolean',
        "default": true
      },
      lintOnChange: {
        type: 'boolean',
        "default": true
      },
      lintOnChangeMethod: {
        type: 'string',
        "default": 'debounce',
        "enum": ['throttle', 'debounce'],
        description: 'Change method between two lint on change'
      },
      clearOnChange: {
        type: 'boolean',
        "default": false
      },
      lintOnEditorFocus: {
        type: 'boolean',
        "default": true
      },
      showHighlighting: {
        type: 'boolean',
        "default": true
      },
      showGutters: {
        type: 'boolean',
        "default": true
      },
      lintOnChangeInterval: {
        type: 'integer',
        "default": 1000
      },
      lintDebug: {
        type: 'boolean',
        "default": false
      },
      showErrorInline: {
        type: 'boolean',
        "default": true
      },
      showInfoMessages: {
        type: 'boolean',
        "default": false,
        description: "Display linter messages with error level “Info”."
      },
      statusBar: {
        type: 'string',
        "default": 'None',
        "enum": ['None', 'Show all errors', 'Show error of the selected line', 'Show error if the cursor is in range']
      },
      executionTimeout: {
        type: 'integer',
        "default": 5000,
        description: 'Linter executables are killed after this timeout. Set to 0 to disable.'
      },
      ignoredLinterErrors: {
        type: 'array',
        "default": [],
        items: {
          type: 'string'
        }
      },
      subtleLinterErrors: {
        type: 'array',
        "default": [],
        items: {
          type: 'string'
        }
      }
    };

    LinterInitializer.prototype.setDefaultOldConfig = function() {
      if (atom.config.get('linter.showErrorInStatusBar') === false) {
        atom.config.set('linter.statusBar', 'None');
      } else if (atom.config.get('linter.showAllErrorsInStatusBar')) {
        atom.config.set('linter.statusBar', 'Show all errors');
      } else if (atom.config.get('linter.showStatusBarWhenCursorIsInErrorRange')) {
        atom.config.set('linter.statusBar', 'Show error if the cursor is in range');
      }
      atom.config.unset('linter.showAllErrorsInStatusBar');
      atom.config.unset('linter.showErrorInStatusBar');
      return atom.config.unset('linter.showStatusBarWhenCursorIsInErrorRange');
    };

    LinterInitializer.prototype.activate = function() {
      var InlineView, LinterView, StatusBarSummaryView, StatusBarView, atomPackage, implemention, linterClasses, _i, _len, _ref, _ref1;
      this.setDefaultOldConfig();
      this.linterViews = new Set();
      this.subscriptions = new CompositeDisposable;
      linterClasses = [];
      _ref = atom.packages.getLoadedPackages();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        atomPackage = _ref[_i];
        if (atomPackage.metadata['linter-package'] === true) {
          implemention = (_ref1 = atomPackage.metadata['linter-implementation']) != null ? _ref1 : atomPackage.name;
          linterClasses.push(require("" + atomPackage.path + "/lib/" + implemention));
        }
      }
      this.enabled = true;
      StatusBarView = require('./statusbar-view');
      this.statusBarView = new StatusBarView();
      StatusBarSummaryView = require('./statusbar-summary-view');
      this.statusBarSummaryView = new StatusBarSummaryView();
      InlineView = require('./inline-view');
      this.inlineView = new InlineView();
      LinterView = require('./linter-view');
      return this.subscriptions.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          var linterView;
          if (editor.linterView != null) {
            return;
          }
          linterView = new LinterView(editor, _this.statusBarView, _this.statusBarSummaryView, _this.inlineView, linterClasses);
          _this.linterViews.add(linterView);
          return _this.subscriptions.add(linterView.onDidDestroy(function() {
            return _this.linterViews["delete"](linterView);
          }));
        };
      })(this)));
    };

    LinterInitializer.prototype.deactivate = function() {
      this.subscriptions.dispose();
      
    for (var linterView of this.linterViews) {
      linterView.remove();
    }
    ;
      this.linterViews = null;
      this.inlineView.remove();
      this.inlineView = null;
      this.statusBarView.remove();
      this.statusBarView = null;
      this.statusBarSummaryView.remove();
      return this.statusBarSummaryView = null;
    };

    return LinterInitializer;

  })();

  module.exports = new LinterInitializer();

}).call(this);
