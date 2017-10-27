(function() {
  var CompositeDisposable, InlineView, LinterInitializer, LinterView, StatusBarView, _;

  _ = require('lodash');

  CompositeDisposable = require('event-kit').CompositeDisposable;

  LinterView = require('./linter-view');

  StatusBarView = require('./statusbar-view');

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
      this.inlineView = new InlineView();
      return this.subscriptions.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          var linterView;
          if (editor.linterView != null) {
            return;
          }
          linterView = new LinterView(editor, _this.statusBarView, _this.inlineView, _this.linters);
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdGQUFBOztBQUFBLEVBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSLENBQUosQ0FBQTs7QUFBQSxFQUNDLHNCQUF1QixPQUFBLENBQVEsV0FBUixFQUF2QixtQkFERCxDQUFBOztBQUFBLEVBR0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxlQUFSLENBSGIsQ0FBQTs7QUFBQSxFQUlBLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLGtCQUFSLENBSmhCLENBQUE7O0FBQUEsRUFLQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGVBQVIsQ0FMYixDQUFBOztBQUFBLEVBU007bUNBR0o7O0FBQUEsZ0NBQUEsTUFBQSxHQUNFO0FBQUEsTUFBQSxVQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsSUFEVDtPQURGO0FBQUEsTUFHQSxZQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsSUFEVDtPQUpGO0FBQUEsTUFNQSxpQkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLElBRFQ7T0FQRjtBQUFBLE1BU0EsZ0JBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxJQURUO09BVkY7QUFBQSxNQVlBLFdBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxJQURUO09BYkY7QUFBQSxNQWVBLG9CQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsSUFEVDtPQWhCRjtBQUFBLE1Ba0JBLFNBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFN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
//# sourceURL=/Users/ah/.atom/packages/linter/lib/init.coffee