(function() {
  var CompositeDisposable, Disposable, GlobalVimState, StatusBarManager, VimState, settings, _ref;

  _ref = require('event-kit'), Disposable = _ref.Disposable, CompositeDisposable = _ref.CompositeDisposable;

  StatusBarManager = require('./status-bar-manager');

  GlobalVimState = require('./global-vim-state');

  VimState = require('./vim-state');

  settings = require('./settings');

  module.exports = {
    config: settings.config,
    activate: function(state) {
      this.disposables = new CompositeDisposable;
      this.globalVimState = new GlobalVimState;
      this.statusBarManager = new StatusBarManager;
      this.vimStates = new Set;
      this.vimStatesByEditor = new WeakMap;
      this.disposables.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          var vimState;
          if (editor.isMini() || _this.getEditorState(editor)) {
            return;
          }
          vimState = new VimState(atom.views.getView(editor), _this.statusBarManager, _this.globalVimState);
          _this.vimStates.add(vimState);
          _this.vimStatesByEditor.set(editor, vimState);
          return vimState.onDidDestroy(function() {
            return _this.vimStates["delete"](vimState);
          });
        };
      })(this)));
      this.disposables.add(atom.workspace.onDidChangeActivePaneItem(this.updateToPaneItem.bind(this)));
      return this.disposables.add(new Disposable((function(_this) {
        return function() {
          return _this.vimStates.forEach(function(vimState) {
            return vimState.destroy();
          });
        };
      })(this)));
    },
    deactivate: function() {
      return this.disposables.dispose();
    },
    getGlobalState: function() {
      return this.globalVimState;
    },
    getEditorState: function(editor) {
      return this.vimStatesByEditor.get(editor);
    },
    consumeStatusBar: function(statusBar) {
      this.statusBarManager.initialize(statusBar);
      this.statusBarManager.attach();
      return this.disposables.add(new Disposable((function(_this) {
        return function() {
          return _this.statusBarManager.detach();
        };
      })(this)));
    },
    updateToPaneItem: function(item) {
      var vimState;
      if (item != null) {
        vimState = this.getEditorState(item);
      }
      if (vimState != null) {
        return vimState.updateStatusBar();
      } else {
        return this.statusBarManager.hide();
      }
    },
    provideVimMode: function() {
      return {
        getGlobalState: this.getGlobalState.bind(this),
        getEditorState: this.getEditorState.bind(this)
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3ZpbS1tb2RlL2xpYi92aW0tbW9kZS5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsMkZBQUE7O0FBQUEsRUFBQSxPQUFvQyxPQUFBLENBQVEsV0FBUixDQUFwQyxFQUFDLGtCQUFBLFVBQUQsRUFBYSwyQkFBQSxtQkFBYixDQUFBOztBQUFBLEVBQ0EsZ0JBQUEsR0FBbUIsT0FBQSxDQUFRLHNCQUFSLENBRG5CLENBQUE7O0FBQUEsRUFFQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSxvQkFBUixDQUZqQixDQUFBOztBQUFBLEVBR0EsUUFBQSxHQUFXLE9BQUEsQ0FBUSxhQUFSLENBSFgsQ0FBQTs7QUFBQSxFQUlBLFFBQUEsR0FBVyxPQUFBLENBQVEsWUFBUixDQUpYLENBQUE7O0FBQUEsRUFNQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxNQUFBLEVBQVEsUUFBUSxDQUFDLE1BQWpCO0FBQUEsSUFFQSxRQUFBLEVBQVUsU0FBQyxLQUFELEdBQUE7QUFDUixNQUFBLElBQUMsQ0FBQSxXQUFELEdBQWUsR0FBQSxDQUFBLG1CQUFmLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxjQUFELEdBQWtCLEdBQUEsQ0FBQSxjQURsQixDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsZ0JBQUQsR0FBb0IsR0FBQSxDQUFBLGdCQUZwQixDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsU0FBRCxHQUFhLEdBQUEsQ0FBQSxHQUpiLENBQUE7QUFBQSxNQUtBLElBQUMsQ0FBQSxpQkFBRCxHQUFxQixHQUFBLENBQUEsT0FMckIsQ0FBQTtBQUFBLE1BT0EsSUFBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCLElBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWYsQ0FBa0MsQ0FBQSxTQUFBLEtBQUEs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

//# sourceURL=/Users/ah/.atom/packages/vim-mode/lib/vim-mode.coffee
