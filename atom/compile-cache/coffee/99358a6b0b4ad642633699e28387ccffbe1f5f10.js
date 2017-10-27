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
      return this.linter.views.panel.panelVisibility = !this.linter.views.panel.panelVisibility;
    };

    Commands.prototype.toggleLinter = function() {
      var _ref;
      return (_ref = this.linter.getActiveEditorLinter()) != null ? _ref.toggleStatus() : void 0;
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
        if ((_ref = this.linter.getActiveEditorLinter()) != null) {
          _ref.lint(false);
        }
        return this.linter.views.render();
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

    Commands.prototype.destroy = function() {
      this.messages = null;
      return this.subscriptions.dispose();
    };

    return Commands;

  })();

  module.exports = Commands;

}).call(this);
