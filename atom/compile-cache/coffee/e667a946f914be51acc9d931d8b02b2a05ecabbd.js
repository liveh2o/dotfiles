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
        "default": false
      },
      statusBar: {
        type: 'string',
        "default": 'Show error of the selected line',
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