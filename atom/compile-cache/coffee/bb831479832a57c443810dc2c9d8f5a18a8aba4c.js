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
      var atomPackage, implemention, _i, _len, _ref, _ref1;
      this.setDefaultOldConfig();
      this.linterViews = [];
      this.linters = [];
      this.subscriptions = new CompositeDisposable;
      _ref = atom.packages.getLoadedPackages();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        atomPackage = _ref[_i];
        if (atomPackage.metadata['linter-package'] === true) {
          implemention = (_ref1 = atomPackage.metadata['linter-implementation']) != null ? _ref1 : atomPackage.name;
          this.linters.push(require("" + atomPackage.path + "/lib/" + implemention));
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
          linterView = new LinterView(editor, _this.statusBarView, _this.statusBarSummaryView, _this.inlineView, _this.linters);
          _this.linterViews.push(linterView);
          return _this.subscriptions.add(linterView.onDidDestroy(function() {
            return _this.linterViews = _.without(_this.linterViews, linterView);
          }));
        };
      })(this)));
    };

    LinterInitializer.prototype.deactivate = function() {
      var l, linterView, _i, _j, _len, _len1, _ref, _ref1, _results;
      this.subscriptions.dispose();
      _ref = this.linterViews;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        linterView = _ref[_i];
        linterView.remove();
      }
      this.inlineView.remove();
      this.statusBarView.remove();
      this.statusBarSummaryView.remove();
      _ref1 = this.linters;
      _results = [];
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        l = _ref1[_j];
        _results.push(l.destroy());
      }
      return _results;
    };

    return LinterInitializer;

  })();

  module.exports = new LinterInitializer();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNHQUFBOztBQUFBLEVBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSLENBQUosQ0FBQTs7QUFBQSxFQUNDLHNCQUF1QixPQUFBLENBQVEsV0FBUixFQUF2QixtQkFERCxDQUFBOztBQUFBLEVBR0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxlQUFSLENBSGIsQ0FBQTs7QUFBQSxFQUlBLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLGtCQUFSLENBSmhCLENBQUE7O0FBQUEsRUFLQSxvQkFBQSxHQUF1QixPQUFBLENBQVEsMEJBQVIsQ0FMdkIsQ0FBQTs7QUFBQSxFQU1BLFVBQUEsR0FBYSxPQUFBLENBQVEsZUFBUixDQU5iLENBQUE7O0FBQUEsRUFVTTttQ0FHSjs7QUFBQSxnQ0FBQSxNQUFBLEdBQ0U7QUFBQSxNQUFBLFVBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxJQURUO09BREY7QUFBQSxNQUdBLFlBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxJQURUO09BSkY7QUFBQSxNQU1BLGlCQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsSUFEVDtPQVBGO0FBQUEsTUFTQSxnQkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLElBRFQ7T0FWRjtBQUFBLE1BWUEsV0FBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLElBRFQ7T0FiRjtBQUFBLE1BZUEsb0JBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxJ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
//# sourceURL=/Users/ah/.atom/packages/linter/lib/init.coffee