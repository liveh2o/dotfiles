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
      var linterView, _i, _len, _ref;
      this.subscriptions.dispose();
      _ref = this.linterViews;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        linterView = _ref[_i];
        linterView.remove();
      }
      this.inlineView.remove();
      return this.statusBarView.remove();
    };

    return LinterInitializer;

  })();

  module.exports = new LinterInitializer();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdGQUFBOztBQUFBLEVBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSLENBQUosQ0FBQTs7QUFBQSxFQUNDLHNCQUF1QixPQUFBLENBQVEsV0FBUixFQUF2QixtQkFERCxDQUFBOztBQUFBLEVBR0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxlQUFSLENBSGIsQ0FBQTs7QUFBQSxFQUlBLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLGtCQUFSLENBSmhCLENBQUE7O0FBQUEsRUFLQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGVBQVIsQ0FMYixDQUFBOztBQUFBLEVBU007bUNBR0o7O0FBQUEsZ0NBQUEsTUFBQSxHQUNFO0FBQUEsTUFBQSxVQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsSUFEVDtPQURGO0FBQUEsTUFHQSxZQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsSUFEVDtPQUpGO0FBQUEsTUFNQSxpQkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLElBRFQ7T0FQRjtBQUFBLE1BU0EsZ0JBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxJQURUO09BVkY7QUFBQSxNQVlBLFdBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxJQURUO09BYkY7QUFBQSxNQWVBLG9CQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsSUFEVDtPQWhCRjtBQUFBLE1Ba0JBLFNBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFN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
//# sourceURL=/Users/ah/.atom/packages/linter/lib/init.coffee