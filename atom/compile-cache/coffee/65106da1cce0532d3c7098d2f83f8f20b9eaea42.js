(function() {
  var Commands, CompositeDisposable,
    __modulo = function(a, b) { return (+a % (b = +b) + b) % b; };

  CompositeDisposable = require('atom').CompositeDisposable;

  Commands = (function() {
    function Commands(linter) {
      this.linter = linter;
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'linter:next-error': (function(_this) {
          return function() {
            return _this.nextError();
          };
        })(this),
        'linter:previous-error': (function(_this) {
          return function() {
            return _this.previousError();
          };
        })(this),
        'linter:toggle': (function(_this) {
          return function() {
            return _this.toggleLinter();
          };
        })(this),
        'linter:togglePanel': (function(_this) {
          return function() {
            return _this.togglePanel();
          };
        })(this),
        'linter:set-bubble-transparent': (function(_this) {
          return function() {
            return _this.setBubbleTransparent();
          };
        })(this),
        'linter:expand-multiline-messages': (function(_this) {
          return function() {
            return _this.expandMultilineMessages();
          };
        })(this),
        'linter:lint': (function(_this) {
          return function() {
            return _this.lint();
          };
        })(this)
      }));
      this.index = null;
    }

    Commands.prototype.togglePanel = function() {
      return atom.config.set('linter.showErrorPanel', !atom.config.get('linter.showErrorPanel'));
    };

    Commands.prototype.toggleLinter = function() {
      var activeEditor, editorLinter;
      activeEditor = atom.workspace.getActiveTextEditor();
      if (!activeEditor) {
        return;
      }
      editorLinter = this.linter.getEditorLinter(activeEditor);
      if (editorLinter) {
        return editorLinter.destroy();
      } else {
        this.linter.createEditorLinter(activeEditor);
        return this.lint();
      }
    };

    Commands.prototype.setBubbleTransparent = function() {
      var bubble;
      bubble = document.getElementById('linter-inline');
      if (bubble) {
        bubble.classList.add('transparent');
        document.addEventListener('keyup', this.setBubbleOpaque);
        return window.addEventListener('blur', this.setBubbleOpaque);
      }
    };

    Commands.prototype.setBubbleOpaque = function() {
      var bubble;
      bubble = document.getElementById('linter-inline');
      if (bubble) {
        bubble.classList.remove('transparent');
      }
      document.removeEventListener('keyup', this.setBubbleOpaque);
      return window.removeEventListener('blur', this.setBubbleOpaque);
    };

    Commands.prototype.expandMultilineMessages = function() {
      var elem, _i, _len, _ref;
      _ref = document.getElementsByTagName('linter-multiline-message');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        elem = _ref[_i];
        elem.classList.add('expanded');
      }
      document.addEventListener('keyup', this.collapseMultilineMessages);
      return window.addEventListener('blur', this.collapseMultilineMessages);
    };

    Commands.prototype.collapseMultilineMessages = function() {
      var elem, _i, _len, _ref;
      _ref = document.getElementsByTagName('linter-multiline-message');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        elem = _ref[_i];
        elem.classList.remove('expanded');
      }
      document.removeEventListener('keyup', this.collapseMultilineMessages);
      return window.removeEventListener('blur', this.collapseMultilineMessages);
    };

    Commands.prototype.lint = function() {
      var error, _ref;
      try {
        return (_ref = this.linter.getActiveEditorLinter()) != null ? _ref.lint(false) : void 0;
      } catch (_error) {
        error = _error;
        return atom.notifications.addError(error.message, {
          detail: error.stack,
          dismissable: true
        });
      }
    };

    Commands.prototype.getMessage = function(index) {
      var messages;
      messages = this.linter.views.messages;
      return messages[__modulo(index, messages.length)];
    };

    Commands.prototype.nextError = function() {
      var message;
      if (this.index != null) {
        this.index++;
      } else {
        this.index = 0;
      }
      message = this.getMessage(this.index);
      if (!(message != null ? message.filePath : void 0)) {
        return;
      }
      if (!(message != null ? message.range : void 0)) {
        return;
      }
      return atom.workspace.open(message.filePath).then(function() {
        return atom.workspace.getActiveTextEditor().setCursorBufferPosition(message.range.start);
      });
    };

    Commands.prototype.previousError = function() {
      var message;
      if (this.index != null) {
        this.index--;
      } else {
        this.index = 0;
      }
      message = this.getMessage(this.index);
      if (!(message != null ? message.filePath : void 0)) {
        return;
      }
      if (!(message != null ? message.range : void 0)) {
        return;
      }
      return atom.workspace.open(message.filePath).then(function() {
        return atom.workspace.getActiveTextEditor().setCursorBufferPosition(message.range.start);
      });
    };

    Commands.prototype.dispose = function() {
      this.messages = null;
      return this.subscriptions.dispose();
    };

    return Commands;

  })();

  module.exports = Commands;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvY29tbWFuZHMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZCQUFBO0lBQUEsNkRBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUVNO0FBQ1MsSUFBQSxrQkFBRSxNQUFGLEdBQUE7QUFDWCxNQURZLElBQUMsQ0FBQSxTQUFBLE1BQ2IsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLGFBQUQsR0FBaUIsR0FBQSxDQUFBLG1CQUFqQixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUNqQjtBQUFBLFFBQUEsbUJBQUEsRUFBcUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7bUJBQUcsS0FBQyxDQUFBLFNBQUQsQ0FBQSxFQUFIO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBckI7QUFBQSxRQUNBLHVCQUFBLEVBQXlCLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUFHLEtBQUMsQ0FBQSxhQUFELENBQUEsRUFBSDtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRHpCO0FBQUEsUUFFQSxlQUFBLEVBQWlCLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUFHLEtBQUMsQ0FBQSxZQUFELENBQUEsRUFBSDtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRmpCO0FBQUEsUUFHQSxvQkFBQSxFQUFzQixDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTtt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

//# sourceURL=/Users/ah/.atom/packages/linter/lib/commands.coffee
