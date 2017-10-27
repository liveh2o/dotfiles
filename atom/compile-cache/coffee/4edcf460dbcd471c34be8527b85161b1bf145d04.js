(function() {
  var BottomContainer, BottomPanel, BottomStatus, CompositeDisposable, LinterViews, Message;

  CompositeDisposable = require('atom').CompositeDisposable;

  BottomPanel = require('./ui/bottom-panel').BottomPanel;

  BottomContainer = require('./ui/bottom-container');

  BottomStatus = require('./ui/bottom-status');

  Message = require('./ui/message-element').Message;

  LinterViews = (function() {
    function LinterViews(linter) {
      this.linter = linter;
      this.state = this.linter.state;
      this.subscriptions = new CompositeDisposable;
      this.messages = [];
      this.markers = new WeakMap();
      this.panel = new BottomPanel(this.state.scope);
      this.bottomContainer = new BottomContainer().prepare(this.linter.state);
      this.bottomBar = null;
      this.bubble = null;
      this.count = {
        File: 0,
        Line: 0,
        Project: 0
      };
      this.subscriptions.add(this.panel);
      this.subscriptions.add(atom.config.observe('linter.underlineIssues', (function(_this) {
        return function(underlineIssues) {
          return _this.underlineIssues = underlineIssues;
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('linter.showErrorInline', (function(_this) {
        return function(showBubble) {
          return _this.showBubble = showBubble;
        };
      })(this)));
      this.subscriptions.add(atom.workspace.onDidChangeActivePaneItem((function(_this) {
        return function() {
          _this.classifyMessages(_this.messages);
          _this.renderPanelMarkers({
            added: _this.messages,
            removed: _this.messages
          });
          _this.renderBubble();
          _this.renderCount();
          return _this.panel.refresh(_this.state.scope);
        };
      })(this)));
      this.subscriptions.add(this.bottomContainer.onDidChangeTab((function(_this) {
        return function() {
          atom.config.set('linter.showErrorPanel', true);
          return _this.panel.refresh(_this.state.scope);
        };
      })(this)));
      this.subscriptions.add(this.bottomContainer.onShouldTogglePanel((function(_this) {
        return function() {
          return atom.config.set('linter.showErrorPanel', !atom.config.get('linter.showErrorPanel'));
        };
      })(this)));
    }

    LinterViews.prototype.render = function(_arg) {
      var added, messages, removed;
      added = _arg.added, removed = _arg.removed, messages = _arg.messages;
      this.messages = this.classifyMessages(messages);
      this.panel.setMessages({
        added: added,
        removed: removed
      });
      this.renderPanelMarkers({
        added: added,
        removed: removed
      });
      this.renderBubble();
      return this.renderCount();
    };

    LinterViews.prototype.renderLineMessages = function(render) {
      if (render == null) {
        render = false;
      }
      this.classifyMessagesByLine(this.messages);
      if (render) {
        this.renderCount();
        return this.panel.refresh(this.state.scope);
      }
    };

    LinterViews.prototype.classifyMessages = function(messages) {
      var filePath, key, message, _ref;
      filePath = (_ref = atom.workspace.getActiveTextEditor()) != null ? _ref.getPath() : void 0;
      this.count.File = 0;
      this.count.Project = 0;
      for (key in messages) {
        message = messages[key];
        if (message.currentFile = filePath && message.filePath === filePath) {
          this.count.File++;
        }
        this.count.Project++;
      }
      return this.classifyMessagesByLine(messages);
    };

    LinterViews.prototype.classifyMessagesByLine = function(messages) {
      var key, message, row, _ref;
      row = (_ref = atom.workspace.getActiveTextEditor()) != null ? _ref.getCursorBufferPosition().row : void 0;
      this.count.Line = 0;
      for (key in messages) {
        message = messages[key];
        if (message.currentLine = message.currentFile && message.range && message.range.intersectsRow(row)) {
          this.count.Line++;
        }
      }
      return messages;
    };

    LinterViews.prototype.renderBubble = function() {
      var activeEditor, message, point, _i, _len, _ref, _results;
      this.removeBubble();
      if (!this.showBubble) {
        return;
      }
      activeEditor = atom.workspace.getActiveTextEditor();
      if (!(activeEditor != null ? typeof activeEditor.getPath === "function" ? activeEditor.getPath() : void 0 : void 0)) {
        return;
      }
      point = activeEditor.getCursorBufferPosition();
      _ref = this.messages;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        message = _ref[_i];
        if (!message.currentLine) {
          continue;
        }
        if (!message.range.containsPoint(point)) {
          continue;
        }
        this.bubble = activeEditor.markBufferRange([point, point], {
          invalidate: 'inside'
        });
        activeEditor.decorateMarker(this.bubble, {
          type: 'overlay',
          position: 'tail',
          item: this.renderBubbleContent(message)
        });
        break;
      }
      return _results;
    };

    LinterViews.prototype.renderBubbleContent = function(message) {
      var bubble;
      bubble = document.createElement('div');
      bubble.id = 'linter-inline';
      bubble.appendChild(Message.fromMessage(message));
      if (message.trace) {
        message.trace.forEach(function(trace) {
          var element;
          element = Message.fromMessage(trace);
          bubble.appendChild(element);
          return element.updateVisibility('Project');
        });
      }
      return bubble;
    };

    LinterViews.prototype.renderCount = function() {
      return this.bottomContainer.setCount(this.count);
    };

    LinterViews.prototype.renderPanelMarkers = function(_arg) {
      var activeEditor, added, removed;
      added = _arg.added, removed = _arg.removed;
      this.removeMarkers(removed);
      activeEditor = atom.workspace.getActiveTextEditor();
      if (!activeEditor) {
        return;
      }
      return added.forEach((function(_this) {
        return function(message) {
          var marker;
          if (!message.currentFile) {
            return;
          }
          _this.markers.set(message, marker = activeEditor.markBufferRange(message.range, {
            invalidate: 'inside'
          }));
          activeEditor.decorateMarker(marker, {
            type: 'line-number',
            "class": "linter-highlight " + message["class"]
          });
          if (_this.underlineIssues) {
            return activeEditor.decorateMarker(marker, {
              type: 'highlight',
              "class": "linter-highlight " + message["class"]
            });
          }
        };
      })(this));
    };

    LinterViews.prototype.attachBottom = function(statusBar) {
      this.subscriptions.add(atom.config.observe('linter.statusIconPosition', (function(_this) {
        return function(statusIconPosition) {
          var _ref;
          if ((_ref = _this.bottomBar) != null) {
            _ref.destroy();
          }
          return _this.bottomBar = statusBar["add" + statusIconPosition + "Tile"]({
            item: _this.bottomContainer,
            priority: statusIconPosition === 'Left' ? -100 : 100
          });
        };
      })(this)));
      return this.subscriptions.add(atom.config.observe('linter.displayLinterInfo', (function(_this) {
        return function(displayLinterInfo) {
          return _this.bottomContainer.setVisibility(displayLinterInfo);
        };
      })(this)));
    };

    LinterViews.prototype.removeMarkers = function(messages) {
      if (messages == null) {
        messages = this.messages;
      }
      return messages.forEach((function(_this) {
        return function(message) {
          var marker;
          if (!_this.markers.has(message)) {
            return;
          }
          marker = _this.markers.get(message);
          marker.destroy();
          return _this.markers["delete"](message);
        };
      })(this));
    };

    LinterViews.prototype.removeBubble = function() {
      var _ref;
      if ((_ref = this.bubble) != null) {
        _ref.destroy();
      }
      return this.bubble = null;
    };

    LinterViews.prototype.dispose = function() {
      var _ref;
      this.removeMarkers();
      this.removeBubble();
      this.subscriptions.dispose();
      return (_ref = this.bottomBar) != null ? _ref.destroy() : void 0;
    };

    return LinterViews;

  })();

  module.exports = LinterViews;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvbGludGVyLXZpZXdzLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxxRkFBQTs7QUFBQSxFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFBRCxDQUFBOztBQUFBLEVBRUMsY0FBZSxPQUFBLENBQVEsbUJBQVIsRUFBZixXQUZELENBQUE7O0FBQUEsRUFHQSxlQUFBLEdBQWtCLE9BQUEsQ0FBUSx1QkFBUixDQUhsQixDQUFBOztBQUFBLEVBSUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSxvQkFBUixDQUpmLENBQUE7O0FBQUEsRUFLQyxVQUFXLE9BQUEsQ0FBUSxzQkFBUixFQUFYLE9BTEQsQ0FBQTs7QUFBQSxFQU9NO0FBQ1MsSUFBQSxxQkFBRSxNQUFGLEdBQUE7QUFDWCxNQURZLElBQUMsQ0FBQSxTQUFBLE1BQ2IsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLEtBQUQsR0FBUyxJQUFDLENBQUEsTUFBTSxDQUFDLEtBQWpCLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxhQUFELEdBQWlCLEdBQUEsQ0FBQSxtQkFEakIsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLFFBQUQsR0FBWSxFQUZaLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxPQUFELEdBQWUsSUFBQSxPQUFBLENBQUEsQ0FIZixDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsS0FBRCxHQUFhLElBQUEsV0FBQSxDQUFZLElBQUMsQ0FBQSxLQUFLLENBQUMsS0FBbkIsQ0FKYixDQUFBO0FBQUEsTUFLQSxJQUFDLENBQUEsZUFBRCxHQUF1QixJQUFBLGVBQUEsQ0FBQSxDQUFpQixDQUFDLE9BQWxCLENBQTBCLElBQUMsQ0FBQSxNQUFNLENBQUMsS0FBbEMsQ0FMdkIsQ0FBQTtBQUFBLE1B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

//# sourceURL=/Users/ah/.atom/packages/linter/lib/linter-views.coffee
