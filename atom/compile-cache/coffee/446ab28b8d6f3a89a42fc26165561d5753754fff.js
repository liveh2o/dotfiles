(function() {
  var VimNormalModeInputElement,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  VimNormalModeInputElement = (function(_super) {
    __extends(VimNormalModeInputElement, _super);

    function VimNormalModeInputElement() {
      return VimNormalModeInputElement.__super__.constructor.apply(this, arguments);
    }

    VimNormalModeInputElement.prototype.createdCallback = function() {
      return this.className = "normal-mode-input";
    };

    VimNormalModeInputElement.prototype.initialize = function(viewModel, mainEditorElement, opts) {
      var _ref;
      this.viewModel = viewModel;
      this.mainEditorElement = mainEditorElement;
      if (opts == null) {
        opts = {};
      }
      if (opts["class"] != null) {
        this.classList.add(opts["class"]);
      }
      this.editorElement = document.createElement("atom-text-editor");
      this.editorElement.classList.add('editor');
      this.editorElement.getModel().setMini(true);
      this.editorElement.setAttribute('mini', '');
      this.appendChild(this.editorElement);
      this.singleChar = opts.singleChar;
      this.defaultText = (_ref = opts.defaultText) != null ? _ref : '';
      if (opts.hidden) {
        this.classList.add('vim-hidden-normal-mode-input');
        this.mainEditorElement.parentNode.appendChild(this);
      } else {
        this.panel = atom.workspace.addBottomPanel({
          item: this,
          priority: 100
        });
      }
      this.focus();
      this.handleEvents();
      return this;
    };

    VimNormalModeInputElement.prototype.handleEvents = function() {
      var compositing;
      if (this.singleChar != null) {
        compositing = false;
        this.editorElement.getModel().getBuffer().onDidChange((function(_this) {
          return function(e) {
            if (e.newText && !compositing) {
              return _this.confirm();
            }
          };
        })(this));
        this.editorElement.addEventListener('compositionstart', function() {
          return compositing = true;
        });
        this.editorElement.addEventListener('compositionend', function() {
          return compositing = false;
        });
      } else {
        atom.commands.add(this.editorElement, 'editor:newline', this.confirm.bind(this));
      }
      atom.commands.add(this.editorElement, 'core:confirm', this.confirm.bind(this));
      atom.commands.add(this.editorElement, 'core:cancel', this.cancel.bind(this));
      return atom.commands.add(this.editorElement, 'blur', this.cancel.bind(this));
    };

    VimNormalModeInputElement.prototype.confirm = function() {
      this.value = this.editorElement.getModel().getText() || this.defaultText;
      this.viewModel.confirm(this);
      return this.removePanel();
    };

    VimNormalModeInputElement.prototype.focus = function() {
      return this.editorElement.focus();
    };

    VimNormalModeInputElement.prototype.cancel = function(e) {
      this.viewModel.cancel(this);
      return this.removePanel();
    };

    VimNormalModeInputElement.prototype.removePanel = function() {
      atom.workspace.getActivePane().activate();
      if (this.panel != null) {
        return this.panel.destroy();
      } else {
        return this.remove();
      }
    };

    return VimNormalModeInputElement;

  })(HTMLDivElement);

  module.exports = document.registerElement("vim-normal-mode-input", {
    "extends": "div",
    prototype: VimNormalModeInputElement.prototype
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3ZpbS1tb2RlL2xpYi92aWV3LW1vZGVscy92aW0tbm9ybWFsLW1vZGUtaW5wdXQtZWxlbWVudC5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEseUJBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFNO0FBQ0osZ0RBQUEsQ0FBQTs7OztLQUFBOztBQUFBLHdDQUFBLGVBQUEsR0FBaUIsU0FBQSxHQUFBO2FBQ2YsSUFBQyxDQUFBLFNBQUQsR0FBYSxvQkFERTtJQUFBLENBQWpCLENBQUE7O0FBQUEsd0NBR0EsVUFBQSxHQUFZLFNBQUUsU0FBRixFQUFjLGlCQUFkLEVBQWlDLElBQWpDLEdBQUE7QUFDVixVQUFBLElBQUE7QUFBQSxNQURXLElBQUMsQ0FBQSxZQUFBLFNBQ1osQ0FBQTtBQUFBLE1BRHVCLElBQUMsQ0FBQSxvQkFBQSxpQkFDeEIsQ0FBQTs7UUFEMkMsT0FBTztPQUNsRDtBQUFBLE1BQUEsSUFBRyxxQkFBSDtBQUNFLFFBQUEsSUFBQyxDQUFBLFNBQVMsQ0FBQyxHQUFYLENBQWUsSUFBSSxDQUFDLE9BQUQsQ0FBbkIsQ0FBQSxDQURGO09BQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxhQUFELEdBQWlCLFFBQVEsQ0FBQyxhQUFULENBQXVCLGtCQUF2QixDQUhqQixDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsYUFBYSxDQUFDLFNBQVMsQ0FBQyxHQUF6QixDQUE2QixRQUE3QixDQUpBLENBQUE7QUFBQSxNQUtBLElBQUMsQ0FBQSxhQUFhLENBQUMsUUFBZixDQUFBLENBQXlCLENBQUMsT0FBMUIsQ0FBa0MsSUFBbEMsQ0FMQSxDQUFBO0FBQUEsTUFNQSxJQUFDLENBQUEsYUFBYSxDQUFDLFlBQWYsQ0FBNEIsTUFBNUIsRUFBb0MsRUFBcEMsQ0FOQSxDQUFBO0FBQUEsTUFP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

//# sourceURL=/Users/ah/.atom/packages/vim-mode/lib/view-models/vim-normal-mode-input-element.coffee
