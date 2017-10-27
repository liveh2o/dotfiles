(function() {
  var BottomStatus, BottomTab, LinterViews, Message;

  BottomTab = require('./views/bottom-tab');

  BottomStatus = require('./views/bottom-status');

  Message = require('./views/message');

  LinterViews = (function() {
    function LinterViews(linter) {
      this.linter = linter;
      this._showBubble = true;
      this._messages = [];
      this._markers = [];
      this._statusTiles = [];
      this._bottomTabFile = new BottomTab();
      this._bottomTabProject = new BottomTab();
      this._panel = document.createElement('div');
      this._bubble = null;
      this._bottomStatus = new BottomStatus();
      this._bottomTabFile.initialize("Current File", (function(_this) {
        return function() {
          return _this._changeTab('file');
        };
      })(this));
      this._bottomTabProject.initialize("Project", (function(_this) {
        return function() {
          return _this._changeTab('project');
        };
      })(this));
      this._bottomStatus.initialize();
      this._panelWorkspace = atom.workspace.addBottomPanel({
        item: this._panel,
        visible: false
      });
      this._scope = 'file';
      this._bottomTabFile.active = true;
      this._panel.id = 'linter-panel';
    }

    LinterViews.prototype.setShowBubble = function(showBubble) {
      return this._showBubble = showBubble;
    };

    LinterViews.prototype.render = function() {
      var counts, messages;
      counts = {
        project: 0,
        file: 0
      };
      messages = [];
      this.linter.eachEditorLinter((function(_this) {
        return function(editorLinter) {
          return messages = messages.concat(_this._extractMessages(editorLinter.getMessages(), counts));
        };
      })(this));
      messages = messages.concat(this._extractMessages(this.linter.getProjectMessages(), counts));
      this._messages = messages;
      this._renderPanel();
      this._bottomTabFile.count = counts.file;
      this._bottomTabProject.count = counts.project;
      return this._bottomStatus.count = counts.project;
    };

    LinterViews.prototype.updateBubble = function(point) {
      var activeEditor, message, _i, _len, _ref, _ref1, _results;
      this._removeBubble();
      if (!this._showBubble) {
        return;
      }
      if (!this._messages.length) {
        return;
      }
      activeEditor = atom.workspace.getActiveTextEditor();
      if (!(activeEditor != null ? typeof activeEditor.getPath === "function" ? activeEditor.getPath() : void 0 : void 0)) {
        return;
      }
      point = point || activeEditor.getCursorBufferPosition();
      _ref = this._messages;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        message = _ref[_i];
        if (!message.currentFile) {
          continue;
        }
        if (!((_ref1 = message.range) != null ? typeof _ref1.containsPoint === "function" ? _ref1.containsPoint(point) : void 0 : void 0)) {
          continue;
        }
        this._bubble = activeEditor.decorateMarker(activeEditor.markBufferRange(message.range, {
          invalidate: 'never'
        }), {
          type: 'overlay',
          position: 'tail',
          item: this._renderBubble(message)
        });
        break;
      }
      return _results;
    };

    LinterViews.prototype.setPanelVisibility = function(Status) {
      if (Status) {
        if (!this._panelWorkspace.isVisible()) {
          return this._panelWorkspace.show();
        }
      } else {
        if (this._panelWorkspace.isVisible()) {
          return this._panelWorkspace.hide();
        }
      }
    };

    LinterViews.prototype.attachBottom = function(statusBar) {
      this._statusTiles.push(statusBar.addLeftTile({
        item: this._bottomTabFile,
        priority: -1001
      }));
      this._statusTiles.push(statusBar.addLeftTile({
        item: this._bottomTabProject,
        priority: -1000
      }));
      return this._statusTiles.push(statusBar.addLeftTile({
        item: this._bottomStatus,
        priority: -999
      }));
    };

    LinterViews.prototype.destroy = function() {
      var statusTile, _i, _len, _ref, _results;
      this._removeMarkers();
      this._panelWorkspace.destroy();
      this._removeBubble();
      _ref = this._statusTiles;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        statusTile = _ref[_i];
        _results.push(statusTile.destroy());
      }
      return _results;
    };

    LinterViews.prototype._changeTab = function(Tab) {
      this._scope = Tab;
      this._bottomTabProject.active = Tab === 'project';
      this._bottomTabFile.active = Tab === 'file';
      return this._renderPanel();
    };

    LinterViews.prototype._removeBubble = function() {
      if (!this._bubble) {
        return;
      }
      this._bubble.destroy();
      return this._bubble = null;
    };

    LinterViews.prototype._renderBubble = function(message) {
      var bubble;
      bubble = document.createElement('div');
      bubble.id = 'linter-inline';
      bubble.appendChild(Message.fromMessage(message));
      if (message.trace) {
        message.trace.forEach(function(trace) {
          return bubble.appendChild(Message.fromMessage(trace, true));
        });
      }
      return bubble;
    };

    LinterViews.prototype._renderPanel = function() {
      var activeEditor;
      this._panel.innerHTML = '';
      this._removeMarkers();
      this._removeBubble();
      if (!this._messages.length) {
        return this.setPanelVisibility(false);
      }
      this.setPanelVisibility(true);
      activeEditor = atom.workspace.getActiveTextEditor();
      this._messages.forEach((function(_this) {
        return function(message) {
          var Element, marker;
          if (_this._scope === 'file') {
            if (!message.currentFile) {
              return;
            }
          }
          if (message.currentFile && message.range) {
            _this._markers.push(marker = activeEditor.markBufferRange(message.range, {
              invalidate: 'never'
            }));
            activeEditor.decorateMarker(marker, {
              type: 'line-number',
              "class": "linter-highlight " + message["class"]
            });
            activeEditor.decorateMarker(marker, {
              type: 'highlight',
              "class": "linter-highlight " + message["class"]
            });
          }
          Element = Message.fromMessage(message, _this._scope === 'project');
          return _this._panel.appendChild(Element);
        };
      })(this));
      return this.updateBubble();
    };

    LinterViews.prototype._removeMarkers = function() {
      var marker, _i, _len, _ref;
      if (!this._markers.length) {
        return;
      }
      _ref = this._markers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        marker = _ref[_i];
        try {
          marker.destroy();
        } catch (_error) {}
      }
      return this._markers = [];
    };

    LinterViews.prototype._extractMessages = function(Gen, counts) {
      var ToReturn, activeFile, isProject, _ref;
      isProject = this._scope === 'project';
      activeFile = (_ref = atom.workspace.getActiveTextEditor()) != null ? typeof _ref.getPath === "function" ? _ref.getPath() : void 0 : void 0;
      ToReturn = [];
      Gen.forEach(function(Entry) {
        return Entry.forEach(function(message) {
          if ((!message.filePath && !isProject) || message.filePath === activeFile) {
            counts.file++;
            counts.project++;
            message.currentFile = true;
          } else {
            counts.project++;
            message.currentFile = false;
          }
          return ToReturn.push(message);
        });
      });
      return ToReturn;
    };

    return LinterViews;

  })();

  module.exports = LinterViews;

}).call(this);
