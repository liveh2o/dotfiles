(function() {
  var CompositeDisposable;

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = {
    consumeStatusBar: function(statusBar) {
      var SoftWrapIndicatorView;
      this.observeEditors();
      SoftWrapIndicatorView = require('./soft-wrap-indicator-view');
      this.view = new SoftWrapIndicatorView();
      this.view.initialize();
      return this.tile = statusBar.addLeftTile({
        item: this.view,
        priority: 150
      });
    },
    deactivate: function() {
      var _ref, _ref1, _ref2;
      if ((_ref = this.osberver) != null) {
        _ref.dispose();
      }
      this.observer = null;
      if ((_ref1 = this.view) != null) {
        _ref1.destroy();
      }
      this.view = null;
      if ((_ref2 = this.tile) != null) {
        _ref2.destroy();
      }
      return this.tile = null;
    },
    observeEditors: function() {
      return this.observer = atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          var disposables;
          disposables = new CompositeDisposable;
          disposables.add(editor.onDidChangeGrammar(function() {
            var _ref;
            return (_ref = _this.view) != null ? _ref.update(editor) : void 0;
          }));
          disposables.add(editor.onDidChangeSoftWrapped(function() {
            var _ref;
            return (_ref = _this.view) != null ? _ref.update(editor) : void 0;
          }));
          return editor.onDidDestroy(function() {
            return disposables.dispose();
          });
        };
      })(this));
    }
  };

}).call(this);
