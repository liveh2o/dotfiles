(function() {
  var CompositeDisposable, InlineView, LinterInitializer, LinterView, StatusBarSummaryView, StatusBarView, _;

  _ = require('lodash');

  CompositeDisposable = require('event-kit').CompositeDisposable;

  LinterView = require('./linter-view');

  StatusBarView = require('./statusbar-view');

  StatusBarSummaryView = require('./statusbar-summary-view');

  InlineView = require('./inline-view');

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
      atom.config.restoreDefault('linter.showAllErrorsInStatusBar');
      atom.config.restoreDefault('linter.showErrorInStatusBar');
      return atom.config.restoreDefault('linter.showStatusBarWhenCursorIsInErrorRange');
    };

    LinterInitializer.prototype.activate = function() {
      var atomPackage, implemention, linterClasses, _i, _len, _ref, _ref1;
      this.setDefaultOldConfig();
      this.linterViews = [];
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
      this.statusBarView = new StatusBarView();
      this.statusBarSummaryView = new StatusBarSummaryView();
      this.inlineView = new InlineView();
      return this.subscriptions.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          var linterView;
          if (editor.linterView != null) {
            return;
          }
          linterView = new LinterView(editor, _this.statusBarView, _this.statusBarSummaryView, _this.inlineView, linterClasses);
          _this.linterViews.push(linterView);
          return _this.subscriptions.add(linterView.onDidDestroy(function() {
            return _this.linterViews = _.without(_this.linterViews, linterView);
          }));
        };
      })(this)));
    };

    LinterInitializer.prototype.deactivate = function() {
      var linterView, _i, _len, _ref;
      this.subscriptions.dispose();
      _ref = this.linterViews;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        linterView = _ref[_i];
        linterView.remove();
      }
      this.inlineView.remove();
      this.statusBarView.remove();
      return this.statusBarSummaryView.remove();
    };

    return LinterInitializer;

  })();

  module.exports = new LinterInitializer();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNHQUFBOztBQUFBLEVBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSLENBQUosQ0FBQTs7QUFBQSxFQUNDLHNCQUF1QixPQUFBLENBQVEsV0FBUixFQUF2QixtQkFERCxDQUFBOztBQUFBLEVBR0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxlQUFSLENBSGIsQ0FBQTs7QUFBQSxFQUlBLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLGtCQUFSLENBSmhCLENBQUE7O0FBQUEsRUFLQSxvQkFBQSxHQUF1QixPQUFBLENBQVEsMEJBQVIsQ0FMdkIsQ0FBQTs7QUFBQSxFQU1BLFVBQUEsR0FBYSxPQUFBLENBQVEsZUFBUixDQU5iLENBQUE7O0FBQUEsRUFVTTttQ0FHSjs7QUFBQSxnQ0FBQSxNQUFBLEdBQ0U7QUFBQSxNQUFBLFVBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxJQURUO09BREY7QUFBQSxNQUdBLFlBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxJQURUO09BSkY7QUFBQSxNQU1BLGlCQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsSUFEVDtPQVBGO0FBQUEsTUFTQSxnQkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLElBRFQ7T0FWRjtBQUFBLE1BWUEsV0FBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLElBRFQ7T0FiRjtBQUFBLE1BZUEsb0JBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxJ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
//# sourceURL=/Users/ah/.atom/packages/linter/lib/init.coffee