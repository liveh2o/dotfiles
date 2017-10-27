(function() {
  var InlineView, LinterInitializer, LinterView, StatusBarView;

  LinterView = require('./linter-view');

  StatusBarView = require('./statusbar-view');

  InlineView = require('./inline-view');

  LinterInitializer = (function() {
    function LinterInitializer() {}

    LinterInitializer.prototype.configDefaults = {
      lintOnSave: true,
      lintOnChange: true,
      lintOnEditorFocus: true,
      showAllErrorsInStatusBar: false,
      showHighlighting: true,
      showGutters: true,
      showErrorInStatusBar: true,
      showErrorInline: false,
      lintOnChangeInterval: 1000,
      showStatusBarWhenCursorIsInErrorRange: false,
      lintDebug: false
    };

    LinterInitializer.prototype.activate = function() {
      var atomPackage, implemention, _i, _len, _ref, _ref1;
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHdEQUFBOztBQUFBLEVBQUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxlQUFSLENBQWIsQ0FBQTs7QUFBQSxFQUNBLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLGtCQUFSLENBRGhCLENBQUE7O0FBQUEsRUFFQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGVBQVIsQ0FGYixDQUFBOztBQUFBLEVBSU07bUNBR0o7O0FBQUEsZ0NBQUEsY0FBQSxHQUNFO0FBQUEsTUFBQSxVQUFBLEVBQVksSUFBWjtBQUFBLE1BQ0EsWUFBQSxFQUFjLElBRGQ7QUFBQSxNQUVBLGlCQUFBLEVBQW1CLElBRm5CO0FBQUEsTUFHQSx3QkFBQSxFQUEwQixLQUgxQjtBQUFBLE1BSUEsZ0JBQUEsRUFBa0IsSUFKbEI7QUFBQSxNQUtBLFdBQUEsRUFBYSxJQUxiO0FBQUEsTUFNQSxvQkFBQSxFQUFzQixJQU50QjtBQUFBLE1BT0EsZUFBQSxFQUFpQixLQVBqQjtBQUFBLE1BUUEsb0JBQUEsRUFBc0IsSUFSdEI7QUFBQSxNQVNBLHFDQUFBLEVBQXVDLEtBVHZDO0FBQUEsTUFVQSxTQUFBLEVBQVcsS0FWWDtLQURGLENBQUE7O0FBQUEsZ0NBY0EsUUFBQSxHQUFVLFNBQUEsR0FBQTtBQUNSLFVBQUEsZ0RBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxXQUFELEdBQWUsRUFBZixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsT0FBRCxHQUFXLEVBRFgsQ0FBQTtBQUdBO0FBQUEsV0FBQSwyQ0FBQTsrQkFBQTtBQUNFLFFBQUEsSUFBRyxXQUFXLENBQUMsUUFBUyxDQUFBLGdCQUFBLENBQXJCLEtBQTBDLElBQTdDO0FBQ0UsVUFBQSxZQUFBLDZFQUErRCxXQUFXLENBQUMsSUFBM0UsQ0FBQTtBQUFBLFVBQ0EsSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWMsT0FBQSxDQUFRLEVBQUEsR0FBRSxXQUFXLENBQUMsSUFBZCxHQUFvQixPQUFwQixHQUEwQixZQUFsQyxDQUFkLENBREEsQ0FERjtTQURGO0FBQUEsT0FIQTtBQUFBLE1BUUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxJQVJYLENBQUE7QUFBQSxNQVNBLElBQUMsQ0FBQSxhQUFELEdBQXFCLElBQUEsYUFBQSxDQUFBLENBVHJCLENBQUE7QUFBQSxNQVVBLElBQUMsQ0FBQSxVQUFELEdBQWtCLElBQUEsVUFBQSxDQUFBLENBVmxCLENBQUE7YUFhQSxJQUFDLENBQUEsc0JBQUQsR0FBMEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxjQUFuQixDQUFrQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxVQUFELEdBQUE7QUFDMUQsY0FBQSxVQUFBO0FBQUEsVUFBQSxVQUFBLEdBQWEsS0FBQyxDQUFBLDhCQUFELENBQWdDLFVBQWhDLEVBQTRDLEtBQUMsQ0FBQSxhQUE3QyxFQUE0RCxLQUFDLENBQUEsVUFBN0QsQ0FBYixDQUFBO2lCQUNBLFVBQVUsQ0FBQyxNQUFNLENBQUMsRUFBbEIsQ0FBcUIsaUJBQXJCLEVBQXdDLFNBQUEsR0FBQTtBQUN0QyxZQUFBLFVBQVUsQ0FBQyxXQUFYLENBQXVCLEtBQUMsQ0FBQSxPQUF4QixDQUFBLENBQUE7QUFBQSxZQUNBLFVBQVUsQ0FBQyxJQUFYLENBQUEsQ0FEQSxDQUFBO21CQUVBLEtBQUMsQ0FBQSxXQUFXLENBQUMsSUFBYixDQUFrQixVQUFsQixFQUhzQztVQUFBLENBQXhDLEVBRjBEO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEMsRUFkbEI7SUFBQSxDQWRWLENBQUE7O0FBQUEsZ0NBb0NBLDhCQUFBLEdBQWdDLFNBQUMsVUFBRCxFQUFhLGFBQWIsRUFBNEIsVUFBNUIsR0FBQTtBQUM5QixVQUFBLFVBQUE7QUFBQSxNQUFBLElBQWMsNEJBQWQ7QUFBQSxjQUFBLENBQUE7T0FBQTtBQUNBLE1BQUEsSUFBQSxDQUFBLFVBQXdCLENBQUMsUUFBekI7QUFBQSxjQUFBLENBQUE7T0FEQTtBQUVBLE1BQUEsSUFBVSw2QkFBVjtBQUFBLGNBQUEsQ0FBQTtPQUZBO0FBQUEsTUFJQSxVQUFBLEdBQWlCLElBQUEsVUFBQSxDQUFXLFVBQVgsRUFBdUIsYUFBdkIsRUFBc0MsVUFBdEMsRUFBa0QsSUFBQyxDQUFBLE9BQW5ELENBSmpCLENBQUE7YUFLQSxXQU44QjtJQUFBLENBcENoQyxDQUFBOztBQUFBLGdDQTZDQSxVQUFBLEdBQVksU0FBQSxHQUFBO0FBQ1YsVUFBQSwwQkFBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLHNCQUFzQixDQUFDLEdBQXhCLENBQUEsQ0FBQSxDQUFBO0FBQ0E7QUFBQSxXQUFBLDJDQUFBOzhCQUFBO0FBQUEsUUFBQSxVQUFVLENBQUMsTUFBWCxDQUFBLENBQUEsQ0FBQTtBQUFBLE9BREE7QUFBQSxNQUVBLElBQUMsQ0FBQSxVQUFVLENBQUMsTUFBWixDQUFBLENBRkEsQ0FBQTthQUdBLElBQUMsQ0FBQSxhQUFhLENBQUMsTUFBZixDQUFBLEVBSlU7SUFBQSxDQTdDWixDQUFBOzs2QkFBQTs7TUFQRixDQUFBOztBQUFBLEVBMERBLE1BQU0sQ0FBQyxPQUFQLEdBQXFCLElBQUEsaUJBQUEsQ0FBQSxDQTFEckIsQ0FBQTtBQUFBIgp9
//# sourceURL=/Users/ah/.atom/packages/linter/lib/init.coffee