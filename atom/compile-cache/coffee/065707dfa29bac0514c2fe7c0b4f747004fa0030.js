(function() {
  var InlineView, LinterInitializer, LinterView, StatusBarView;

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
      return this.editorViewSubscription = atom.workspaceView.eachEditorView((function(_this) {
        return function(editorView) {
          var linterView;
          linterView = _this.injectLinterViewIntoEditorView(editorView, _this.statusBarView, _this.inlineView);
          return editorView.editor.on('grammar-changed', function() {
            linterView.initLinters(_this.linters);
            linterView.lint();
            return _this.linterViews.push(linterView);
          });
        };
      })(this));
    };

    LinterInitializer.prototype.injectLinterViewIntoEditorView = function(editorView, statusBarView, inlineView) {
      var linterView;
      if (editorView.getPane() == null) {
        return;
      }
      if (!editorView.attached) {
        return;
      }
      if (editorView.linterView != null) {
        return;
      }
      linterView = new LinterView(editorView, statusBarView, inlineView, this.linters);
      return linterView;
    };

    LinterInitializer.prototype.deactivate = function() {
      var linterView, _i, _len, _ref;
      this.editorViewSubscription.off();
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHdEQUFBOztBQUFBLEVBQUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxlQUFSLENBQWIsQ0FBQTs7QUFBQSxFQUNBLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLGtCQUFSLENBRGhCLENBQUE7O0FBQUEsRUFFQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGVBQVIsQ0FGYixDQUFBOztBQUFBLEVBSU07bUNBR0o7O0FBQUEsZ0NBQUEsTUFBQSxHQUNFO0FBQUEsTUFBQSxVQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsSUFEVDtPQURGO0FBQUEsTUFHQSxZQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsSUFEVDtPQUpGO0FBQUEsTUFNQSxpQkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLElBRFQ7T0FQRjtBQUFBLE1BU0EsZ0JBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxJQURUO09BVkY7QUFBQSxNQVlBLFdBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxJQURUO09BYkY7QUFBQSxNQWVBLG9CQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsSUFEVDtPQWhCRjtBQUFBLE1Ba0JBLFNBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxLQURUO09BbkJGO0FBQUEsTUFxQkEsZUFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FB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
//# sourceURL=/Users/ah/.atom/packages/linter/lib/init.coffee