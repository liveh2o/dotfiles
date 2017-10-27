(function() {
  var BottomContainer, BottomPanel, BottomStatus, CompositeDisposable, LinterViews, Message;

  CompositeDisposable = require('atom').CompositeDisposable;

  BottomPanel = require('./views/bottom-panel');

  BottomContainer = require('./views/bottom-container');

  BottomStatus = require('./views/bottom-status');

  Message = require('./views/message');

  LinterViews = (function() {
    function LinterViews(linter) {
      this.linter = linter;
      this.state = this.linter.state;
      this.subscriptions = new CompositeDisposable;
      this.messages = [];
      this.messagesLine = [];
      this.markers = [];
      this.panel = new BottomPanel().prepare();
      this.bottomContainer = new BottomContainer().prepare(this.linter.state);
      this.bottomBar = null;
      this.bubble = null;
      this.subscriptions.add(atom.config.observe('linter.ignoredMessageTypes', (function(_this) {
        return function(ignoredMessageTypes) {
          return _this.ignoredMessageTypes = ignoredMessageTypes;
        };
      })(this)));
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
      this.subscriptions.add(atom.config.observe('linter.showErrorPanel', (function(_this) {
        return function(showPanel) {
          return _this.panel.panelVisibility = showPanel;
        };
      })(this)));
      this.subscriptions.add(atom.workspace.onDidChangeActivePaneItem((function(_this) {
        return function(paneItem) {
          var isTextEditor;
          isTextEditor = (paneItem != null ? paneItem.getPath : void 0) != null;
          _this.bottomContainer.setVisibility(isTextEditor);
          return _this.panel.panelVisibility = atom.config.get('linter.showErrorPanel') && isTextEditor;
        };
      })(this)));
      this.subscriptions.add(this.linter.onDidChangeMessages((function(_this) {
        return function() {
          return _this.render();
        };
      })(this)));
      this.subscriptions.add(this.bottomContainer.onDidChangeTab((function(_this) {
        return function() {
          return _this.renderPanelMessages();
        };
      })(this)));
    }

    LinterViews.prototype.render = function() {
      this.messages = this.linter.messages.getAllMessages();
      if (this.ignoredMessageTypes.length) {
        this.messages = this.messages.filter((function(_this) {
          return function(message) {
            return _this.ignoredMessageTypes.indexOf(message.type) === -1;
          };
        })(this));
      }
      this.updateLineMessages();
      this.renderPanelMessages();
      this.renderPanelMarkers();
      this.renderBubble();
      return this.renderCount();
    };

    LinterViews.prototype.renderBubble = function(point) {
      var activeEditor, message, _i, _len, _ref, _ref1, _results;
      this.removeBubble();
      if (!this.messagesLine.length) {
        return;
      }
      if (!this.showBubble) {
        return;
      }
      activeEditor = atom.workspace.getActiveTextEditor();
      if (!(activeEditor != null ? typeof activeEditor.getPath === "function" ? activeEditor.getPath() : void 0 : void 0)) {
        return;
      }
      point = point || activeEditor.getCursorBufferPosition();
      _ref = this.messagesLine;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        message = _ref[_i];
        if (!((_ref1 = message.range) != null ? _ref1.containsPoint(point) : void 0)) {
          continue;
        }
        this.bubble = activeEditor.decorateMarker(activeEditor.markBufferRange([point, point], {
          invalidate: 'never'
        }), {
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
          return bubble.appendChild(Message.fromMessage(trace, {
            addPath: true
          }));
        });
      }
      return bubble;
    };

    LinterViews.prototype.renderCount = function() {
      var count;
      if (this.ignoredMessageTypes.length) {
        count = {
          File: 0,
          Project: this.messages.length
        };
        this.messages.forEach(function(message) {
          if (message.currentFile) {
            return count.File++;
          }
        });
      } else {
        count = this.linter.messages.getCount();
      }
      count.Line = this.messagesLine.length;
      return this.bottomContainer.setCount(count);
    };

    LinterViews.prototype.renderPanelMessages = function() {
      var messages;
      messages = null;
      if (this.state.scope === 'Project') {
        messages = this.messages;
      } else if (this.state.scope === 'File') {
        messages = this.messages.filter(function(message) {
          return message.currentFile;
        });
      } else if (this.state.scope === 'Line') {
        messages = this.messagesLine;
      }
      return this.panel.updateMessages(messages, this.state.scope === 'Project');
    };

    LinterViews.prototype.renderPanelMarkers = function() {
      var activeEditor;
      this.removeMarkers();
      activeEditor = atom.workspace.getActiveTextEditor();
      if (!activeEditor) {
        return;
      }
      return this.messages.forEach((function(_this) {
        return function(message) {
          var marker;
          if (!message.currentFile) {
            return;
          }
          _this.markers.push(marker = activeEditor.markBufferRange(message.range, {
            invalidate: 'never'
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

    LinterViews.prototype.updateLineMessages = function(render) {
      if (render == null) {
        render = false;
      }
      this.messagesLine = this.linter.messages.getActiveFileMessagesForActiveRow();
      if (this.ignoredMessageTypes.length) {
        this.messagesLine = this.messagesLine.filter((function(_this) {
          return function(message) {
            return _this.ignoredMessageTypes.indexOf(message.type) === -1;
          };
        })(this));
      }
      if (render) {
        this.renderCount();
        return this.renderPanelMessages();
      }
    };

    LinterViews.prototype.attachBottom = function(statusBar) {
      return this.bottomBar = statusBar.addLeftTile({
        item: this.bottomContainer,
        priority: -100
      });
    };

    LinterViews.prototype.removeMarkers = function() {
      this.markers.forEach(function(marker) {
        try {
          return marker.destroy();
        } catch (_error) {}
      });
      return this.markers = [];
    };

    LinterViews.prototype.removeBubble = function() {
      var _ref;
      if ((_ref = this.bubble) != null) {
        _ref.destroy();
      }
      return this.bubble = null;
    };

    LinterViews.prototype.destroy = function() {
      this.removeMarkers();
      this.removeBubble();
      this.subscriptions.dispose();
      if (this.bottomBar) {
        this.bottomBar.destroy();
      }
      return this.panel.destroy();
    };

    return LinterViews;

  })();

  module.exports = LinterViews;

}).call(this);
