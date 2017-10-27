(function() {
  var Input, ViewModel, VimNormalModeInputElement;

  VimNormalModeInputElement = require('./vim-normal-mode-input-element');

  ViewModel = (function() {
    function ViewModel(operation, opts) {
      var _ref;
      this.operation = operation;
      if (opts == null) {
        opts = {};
      }
      _ref = this.operation, this.editor = _ref.editor, this.vimState = _ref.vimState;
      this.view = new VimNormalModeInputElement().initialize(this, atom.views.getView(this.editor), opts);
      this.editor.normalModeInputView = this.view;
      this.vimState.onDidFailToCompose((function(_this) {
        return function() {
          return _this.view.remove();
        };
      })(this));
    }

    ViewModel.prototype.confirm = function(view) {
      return this.vimState.pushOperations(new Input(this.view.value));
    };

    ViewModel.prototype.cancel = function(view) {
      if (this.vimState.isOperatorPending()) {
        this.vimState.pushOperations(new Input(''));
      }
      return delete this.editor.normalModeInputView;
    };

    return ViewModel;

  })();

  Input = (function() {
    function Input(characters) {
      this.characters = characters;
    }

    Input.prototype.isComplete = function() {
      return true;
    };

    Input.prototype.isRecordable = function() {
      return true;
    };

    return Input;

  })();

  module.exports = {
    ViewModel: ViewModel,
    Input: Input
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3ZpbS1tb2RlL2xpYi92aWV3LW1vZGVscy92aWV3LW1vZGVsLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwyQ0FBQTs7QUFBQSxFQUFBLHlCQUFBLEdBQTRCLE9BQUEsQ0FBUSxpQ0FBUixDQUE1QixDQUFBOztBQUFBLEVBRU07QUFDUyxJQUFBLG1CQUFFLFNBQUYsRUFBYSxJQUFiLEdBQUE7QUFDWCxVQUFBLElBQUE7QUFBQSxNQURZLElBQUMsQ0FBQSxZQUFBLFNBQ2IsQ0FBQTs7UUFEd0IsT0FBSztPQUM3QjtBQUFBLE1BQUEsT0FBdUIsSUFBQyxDQUFBLFNBQXhCLEVBQUMsSUFBQyxDQUFBLGNBQUEsTUFBRixFQUFVLElBQUMsQ0FBQSxnQkFBQSxRQUFYLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxJQUFELEdBQVksSUFBQSx5QkFBQSxDQUFBLENBQTJCLENBQUMsVUFBNUIsQ0FBdUMsSUFBdkMsRUFBNkMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLElBQUMsQ0FBQSxNQUFwQixDQUE3QyxFQUEwRSxJQUExRSxDQURaLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxNQUFNLENBQUMsbUJBQVIsR0FBOEIsSUFBQyxDQUFBLElBRi9CLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxRQUFRLENBQUMsa0JBQVYsQ0FBNkIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFBRyxLQUFDLENBQUEsSUFBSSxDQUFDLE1BQU4sQ0FBQSxFQUFIO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBN0IsQ0FIQSxDQURXO0lBQUEsQ0FBYjs7QUFBQSx3QkFNQSxPQUFBLEdBQVMsU0FBQyxJQUFELEdBQUE7YUFDUCxJQUFDLENBQUEsUUFBUSxDQUFDLGNBQVYsQ0FBNkIsSUFBQSxLQUFBLENBQU0sSUFBQyxDQUFBLElBQUksQ0FBQyxLQUFaLENBQTdCLEVBRE87SUFBQSxDQU5ULENBQUE7O0FBQUEsd0JBU0EsTUFBQSxHQUFRLFNBQUMsSUFBRCxHQUFBO0FBQ04sTUFBQSxJQUFHLElBQUMsQ0FBQSxRQUFRLENBQUMsaUJBQVYsQ0FBQSxDQUFIO0FBQ0UsUUFBQSxJQUFDLENBQUEsUUFBUSxDQUFDLGNBQVYsQ0FBNkIsSUFBQSxLQUFBLENBQU0sRUFBTixDQUE3QixDQUFBLENBREY7T0FBQTthQUVBLE1BQUEsQ0FBQSxJQUFRLENBQUEsTUFBTSxDQUFDLG9CQUhUO0lBQUEsQ0FUUixDQUFBOztxQkFBQTs7TUFIRixDQUFBOztBQUFBLEVBaUJNO0FBQ1MsSUFBQSxlQUFFLFVBQUYsR0FBQTtBQUFlLE1BQWQsSUFBQyxDQUFBLGFBQUEsVUFBYSxDQUFmO0lBQUEsQ0FBYjs7QUFBQSxvQkFDQSxVQUFBLEdBQVksU0FBQSxHQUFBO2FBQUcsS0FBSDtJQUFBLENBRFosQ0FBQTs7QUFBQSxvQkFFQSxZQUFBLEdBQWMsU0FBQSxHQUFBO2FBQUcsS0FBSDtJQUFBLENBRmQsQ0FBQTs7aUJBQUE7O01BbEJGLENBQUE7O0FBQUEsRUFzQkEsTUFBTSxDQUFDLE9BQVAsR0FBaUI7QUFBQSxJQUNmLFdBQUEsU0FEZTtBQUFBLElBQ0osT0FBQSxLQURJO0dBdEJqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/ah/.atom/packages/vim-mode/lib/view-models/view-model.coffee
