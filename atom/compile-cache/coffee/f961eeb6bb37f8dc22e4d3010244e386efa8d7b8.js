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
      this.view = new VimNormalModeInputElement().initialize(this, opts);
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
        return this.vimState.pushOperations(new Input(''));
      }
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
