Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _uiBottomPanel = require('./ui/bottom-panel');

var _uiBottomPanel2 = _interopRequireDefault(_uiBottomPanel);

var _uiBottomContainer = require('./ui/bottom-container');

var _uiBottomContainer2 = _interopRequireDefault(_uiBottomContainer);

var _uiMessageElement = require('./ui/message-element');

var _helpers = require('./helpers');

var _helpers2 = _interopRequireDefault(_helpers);

var _uiMessageBubble = require('./ui/message-bubble');

'use babel';

var LinterViews = (function () {
  function LinterViews(scope, editorRegistry) {
    var _this = this;

    _classCallCheck(this, LinterViews);

    this.subscriptions = new _atom.CompositeDisposable();
    this.emitter = new _atom.Emitter();
    this.bottomPanel = new _uiBottomPanel2['default'](scope);
    this.bottomContainer = _uiBottomContainer2['default'].create(scope);
    this.editors = editorRegistry;
    this.bottomBar = null; // To be added when status-bar service is consumed
    this.bubble = null;
    this.bubbleRange = null;

    this.subscriptions.add(this.bottomPanel);
    this.subscriptions.add(this.bottomContainer);
    this.subscriptions.add(this.emitter);

    this.count = {
      Line: 0,
      File: 0,
      Project: 0
    };
    this.messages = [];
    this.subscriptions.add(atom.config.observe('linter.showErrorInline', function (showBubble) {
      return _this.showBubble = showBubble;
    }));
    this.subscriptions.add(atom.workspace.onDidChangeActivePaneItem(function (paneItem) {
      var isEditor = false;
      _this.editors.forEach(function (editorLinter) {
        isEditor = (editorLinter.active = editorLinter.editor === paneItem) || isEditor;
      });
      _this.updateCounts();
      _this.bottomPanel.refresh();
      _this.bottomContainer.visibility = isEditor;
    }));
    this.subscriptions.add(this.bottomContainer.onDidChangeTab(function (scope) {
      _this.emitter.emit('did-update-scope', scope);
      atom.config.set('linter.showErrorPanel', true);
      _this.bottomPanel.refresh(scope);
    }));
    this.subscriptions.add(this.bottomContainer.onShouldTogglePanel(function () {
      atom.config.set('linter.showErrorPanel', !atom.config.get('linter.showErrorPanel'));
    }));

    this._renderBubble = this.renderBubble;
    this.subscriptions.add(atom.config.observe('linter.inlineTooltipInterval', function (bubbleInterval) {
      return _this.renderBubble = _helpers2['default'].debounce(_this._renderBubble, bubbleInterval);
    }));
  }

  _createClass(LinterViews, [{
    key: 'render',
    value: function render(_ref) {
      var added = _ref.added;
      var removed = _ref.removed;
      var messages = _ref.messages;

      this.messages = messages;
      this.notifyEditorLinters({ added: added, removed: removed });
      this.bottomPanel.setMessages({ added: added, removed: removed });
      this.updateCounts();
    }
  }, {
    key: 'updateCounts',
    value: function updateCounts() {
      var activeEditorLinter = this.editors.ofActiveTextEditor();

      this.count.Project = this.messages.length;
      this.count.File = activeEditorLinter ? activeEditorLinter.getMessages().size : 0;
      this.count.Line = activeEditorLinter ? activeEditorLinter.countLineMessages : 0;
      this.bottomContainer.setCount(this.count);
    }
  }, {
    key: 'renderBubble',
    value: function renderBubble(editorLinter) {
      if (!this.showBubble || !editorLinter.messages.size) {
        return;
      }
      var point = editorLinter.editor.getCursorBufferPosition();
      if (this.bubbleRange && this.bubbleRange.containsPoint(point)) {
        return; // The marker remains the same
      } else if (this.bubble) {
          this.bubble.destroy();
          this.bubble = null;
        }
      for (var entry of editorLinter.markers) {
        var bubbleRange = entry[1].getBufferRange();
        if (bubbleRange.containsPoint(point)) {
          this.bubbleRange = bubbleRange;
          this.bubble = editorLinter.editor.decorateMarker(entry[1], {
            type: 'overlay',
            item: (0, _uiMessageBubble.create)(entry[0])
          });
          return;
        }
      }
      this.bubbleRange = null;
    }
  }, {
    key: 'notifyEditorLinters',
    value: function notifyEditorLinters(_ref2) {
      var _this2 = this;

      var added = _ref2.added;
      var removed = _ref2.removed;

      var editorLinter = undefined;
      removed.forEach(function (message) {
        if (message.filePath && (editorLinter = _this2.editors.ofPath(message.filePath))) {
          editorLinter.deleteMessage(message);
        }
      });
      added.forEach(function (message) {
        if (message.filePath && (editorLinter = _this2.editors.ofPath(message.filePath))) {
          editorLinter.addMessage(message);
        }
      });
      editorLinter = this.editors.ofActiveTextEditor();
      if (editorLinter) {
        editorLinter.calculateLineMessages(null);
        this.renderBubble(editorLinter);
      }
    }
  }, {
    key: 'notifyEditorLinter',
    value: function notifyEditorLinter(editorLinter) {
      var path = editorLinter.editor.getPath();
      if (!path) return;
      this.messages.forEach(function (message) {
        if (message.filePath && message.filePath === path) {
          editorLinter.addMessage(message);
        }
      });
    }
  }, {
    key: 'attachBottom',
    value: function attachBottom(statusBar) {
      var _this3 = this;

      this.subscriptions.add(atom.config.observe('linter.statusIconPosition', function (position) {
        if (_this3.bottomBar) {
          _this3.bottomBar.destroy();
        }
        _this3.bottomBar = statusBar['add' + position + 'Tile']({
          item: _this3.bottomContainer,
          priority: position === 'Left' ? -100 : 100
        });
      }));
    }
  }, {
    key: 'onDidUpdateScope',
    value: function onDidUpdateScope(callback) {
      return this.emitter.on('did-update-scope', callback);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      // No need to notify editors of this, we're being disposed means the package is
      // being deactivated. They'll be disposed automatically by the registry.
      this.subscriptions.dispose();
      if (this.bottomBar) {
        this.bottomBar.destroy();
      }
      if (this.bubble) {
        this.bubble.destroy();
        this.bubbleRange = null;
      }
    }
  }]);

  return LinterViews;
})();

exports['default'] = LinterViews;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL2xpbnRlci12aWV3cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O29CQUUyQyxNQUFNOzs2QkFDekIsbUJBQW1COzs7O2lDQUNmLHVCQUF1Qjs7OztnQ0FDN0Isc0JBQXNCOzt1QkFDeEIsV0FBVzs7OzsrQkFDTSxxQkFBcUI7O0FBUDFELFdBQVcsQ0FBQTs7SUFTVSxXQUFXO0FBQ25CLFdBRFEsV0FBVyxDQUNsQixLQUFLLEVBQUUsY0FBYyxFQUFFOzs7MEJBRGhCLFdBQVc7O0FBRTVCLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7QUFDOUMsUUFBSSxDQUFDLE9BQU8sR0FBRyxtQkFBYSxDQUFBO0FBQzVCLFFBQUksQ0FBQyxXQUFXLEdBQUcsK0JBQWdCLEtBQUssQ0FBQyxDQUFBO0FBQ3pDLFFBQUksQ0FBQyxlQUFlLEdBQUcsK0JBQWdCLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQTtBQUNwRCxRQUFJLENBQUMsT0FBTyxHQUFHLGNBQWMsQ0FBQTtBQUM3QixRQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQTtBQUNyQixRQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQTtBQUNsQixRQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQTs7QUFFdkIsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFBO0FBQ3hDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQTtBQUM1QyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7O0FBRXBDLFFBQUksQ0FBQyxLQUFLLEdBQUc7QUFDWCxVQUFJLEVBQUUsQ0FBQztBQUNQLFVBQUksRUFBRSxDQUFDO0FBQ1AsYUFBTyxFQUFFLENBQUM7S0FDWCxDQUFBO0FBQ0QsUUFB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LFdBQVciLCJmaWxlIjoiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvbGludGVyLXZpZXdzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IHtFbWl0dGVyLCBDb21wb3NpdGVEaXNwb3NhYmxlfSBmcm9tICdhdG9tJ1xuaW1wb3J0IEJvdHRvbVBhbmVsIGZyb20gJy4vdWkvYm90dG9tLXBhbmVsJ1xuaW1wb3J0IEJvdHRvbUNvbnRhaW5lciBmcm9tICcuL3VpL2JvdHRvbS1jb250YWluZXInXG5pbXBvcnQge01lc3NhZ2V9IGZyb20gJy4vdWkvbWVzc2FnZS1lbGVtZW50J1xuaW1wb3J0IEhlbHBlcnMgZnJvbSAnLi9oZWxwZXJzJ1xuaW1wb3J0IHtjcmVhdGUgYXMgY3JlYXRlQnViYmxlfSBmcm9tICcuL3VpL21lc3NhZ2UtYnViYmxlJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMaW50ZXJWaWV3cyB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlLCBlZGl0b3JSZWdpc3RyeSkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpXG4gICAgdGhpcy5ib3R0b21QYW5lbCA9IG5ldyBCb3R0b21QYW5lbChzY29wZSlcbiAgICB0aGlzLmJvdHRvbUNvbnRhaW5lciA9IEJvdHRvbUNvbnRhaW5lci5jcmVhdGUoc2NvcGUpXG4gICAgdGhpcy5lZGl0b3JzID0gZWRpdG9yUmVnaXN0cnlcbiAgICB0aGlzLmJvdHRvbUJhciA9IG51bGwgLy8gVG8gYmUgYWRkZWQgd2hlbiBzdGF0dXMtYmFyIHNlcnZpY2UgaXMgY29uc3VtZWRcbiAgICB0aGlzLmJ1YmJsZSA9IG51bGxcbiAgICB0aGlzLmJ1YmJsZVJhbmdlID0gbnVsbFxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLmJvdHRvbVBhbmVsKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5ib3R0b21Db250YWluZXIpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLmVtaXR0ZXIpXG5cbiAgICB0aGlzLmNvdW50ID0ge1xuICAgICAgTGluZTogMCxcbiAgICAgIEZpbGU6IDAsXG4gICAgICBQcm9qZWN0OiAwXG4gICAgfVxuICAgIHRoaXMubWVzc2FnZXMgPSBbXVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLnNob3dFcnJvcklubGluZScsIHNob3dCdWJibGUgPT5cbiAgICAgIHRoaXMuc2hvd0J1YmJsZSA9IHNob3dCdWJibGVcbiAgICApKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS53b3Jrc3BhY2Uub25EaWRDaGFuZ2VBY3RpdmVQYW5lSXRlbShwYW5lSXRlbSA9PiB7XG4gICAgICBsZXQgaXNFZGl0b3IgPSBmYWxzZVxuICAgICAgdGhpcy5lZGl0b3JzLmZvckVhY2goZnVuY3Rpb24oZWRpdG9yTGludGVyKSB7XG4gICAgICAgIGlzRWRpdG9yID0gKGVkaXRvckxpbnRlci5hY3RpdmUgPSBlZGl0b3JMaW50ZXIuZWRpdG9yID09PSBwYW5lSXRlbSkgfHwgaXNFZGl0b3JcbiAgICAgIH0pXG4gICAgICB0aGlzLnVwZGF0ZUNvdW50cygpXG4gICAgICB0aGlzLmJvdHRvbVBhbmVsLnJlZnJlc2goKVxuICAgICAgdGhpcy5ib3R0b21Db250YWluZXIudmlzaWJpbGl0eSA9IGlzRWRpdG9yXG4gICAgfSkpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLmJvdHRvbUNvbnRhaW5lci5vbkRpZENoYW5nZVRhYihzY29wZSA9PiB7XG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLXVwZGF0ZS1zY29wZScsIHNjb3BlKVxuICAgICAgYXRvbS5jb25maWcuc2V0KCdsaW50ZXIuc2hvd0Vycm9yUGFuZWwnLCB0cnVlKVxuICAgICAgdGhpcy5ib3R0b21QYW5lbC5yZWZyZXNoKHNjb3BlKVxuICAgIH0pKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5ib3R0b21Db250YWluZXIub25TaG91bGRUb2dnbGVQYW5lbChmdW5jdGlvbigpIHtcbiAgICAgIGF0b20uY29uZmlnLnNldCgnbGludGVyLnNob3dFcnJvclBhbmVsJywgIWF0b20uY29uZmlnLmdldCgnbGludGVyLnNob3dFcnJvclBhbmVsJykpXG4gICAgfSkpXG5cbiAgICB0aGlzLl9yZW5kZXJCdWJibGUgPSB0aGlzLnJlbmRlckJ1YmJsZVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLmlubGluZVRvb2x0aXBJbnRlcnZhbCcsIGJ1YmJsZUludGVydmFsID0+XG4gICAgICB0aGlzLnJlbmRlckJ1YmJsZSA9IEhlbHBlcnMuZGVib3VuY2UodGhpcy5fcmVuZGVyQnViYmxlLCBidWJibGVJbnRlcnZhbClcbiAgICApKVxuICB9XG4gIHJlbmRlcih7YWRkZWQsIHJlbW92ZWQsIG1lc3NhZ2VzfSkge1xuICAgIHRoaXMubWVzc2FnZXMgPSBtZXNzYWdlc1xuICAgIHRoaXMubm90aWZ5RWRpdG9yTGludGVycyh7YWRkZWQsIHJlbW92ZWR9KVxuICAgIHRoaXMuYm90dG9tUGFuZWwuc2V0TWVzc2FnZXMoe2FkZGVkLCByZW1vdmVkfSlcbiAgICB0aGlzLnVwZGF0ZUNvdW50cygpXG4gIH1cbiAgdXBkYXRlQ291bnRzKCkge1xuICAgIGNvbnN0IGFjdGl2ZUVkaXRvckxpbnRlciA9IHRoaXMuZWRpdG9ycy5vZkFjdGl2ZVRleHRFZGl0b3IoKVxuXG4gICAgdGhpcy5jb3VudC5Qcm9qZWN0ID0gdGhpcy5tZXNzYWdlcy5sZW5ndGhcbiAgICB0aGlzLmNvdW50LkZpbGUgPSBhY3RpdmVFZGl0b3JMaW50ZXIgPyBhY3RpdmVFZGl0b3JMaW50ZXIuZ2V0TWVzc2FnZXMoKS5zaXplIDogMFxuICAgIHRoaXMuY291bnQuTGluZSA9IGFjdGl2ZUVkaXRvckxpbnRlciA/IGFjdGl2ZUVkaXRvckxpbnRlci5jb3VudExpbmVNZXNzYWdlcyA6IDBcbiAgICB0aGlzLmJvdHRvbUNvbnRhaW5lci5zZXRDb3VudCh0aGlzLmNvdW50KVxuICB9XG4gIHJlbmRlckJ1YmJsZShlZGl0b3JMaW50ZXIpIHtcbiAgICBpZiAoIXRoaXMuc2hvd0J1YmJsZSB8fCAhZWRpdG9yTGludGVyLm1lc3NhZ2VzLnNpemUpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBjb25zdCBwb2ludCA9IGVkaXRvckxpbnRlci5lZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKVxuICAgIGlmICh0aGlzLmJ1YmJsZVJhbmdlICYmIHRoaXMuYnViYmxlUmFuZ2UuY29udGFpbnNQb2ludChwb2ludCkpIHtcbiAgICAgIHJldHVybiAvLyBUaGUgbWFya2VyIHJlbWFpbnMgdGhlIHNhbWVcbiAgICB9IGVsc2UgaWYgKHRoaXMuYnViYmxlKSB7XG4gICAgICB0aGlzLmJ1YmJsZS5kZXN0cm95KClcbiAgICAgIHRoaXMuYnViYmxlID0gbnVsbFxuICAgIH1cbiAgICBmb3IgKGxldCBlbnRyeSBvZiBlZGl0b3JMaW50ZXIubWFya2Vycykge1xuICAgICAgY29uc3QgYnViYmxlUmFuZ2UgPSBlbnRyeVsxXS5nZXRCdWZmZXJSYW5nZSgpXG4gICAgICBpZiAoYnViYmxlUmFuZ2UuY29udGFpbnNQb2ludChwb2ludCkpIHtcbiAgICAgICAgdGhpcy5idWJibGVSYW5nZSA9IGJ1YmJsZVJhbmdlXG4gICAgICAgIHRoaXMuYnViYmxlID0gZWRpdG9yTGludGVyLmVkaXRvci5kZWNvcmF0ZU1hcmtlcihlbnRyeVsxXSwge1xuICAgICAgICAgIHR5cGU6ICdvdmVybGF5JyxcbiAgICAgICAgICBpdGVtOiBjcmVhdGVCdWJibGUoZW50cnlbMF0pXG4gICAgICAgIH0pXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmJ1YmJsZVJhbmdlID0gbnVsbFxuICB9XG4gIG5vdGlmeUVkaXRvckxpbnRlcnMoe2FkZGVkLCByZW1vdmVkfSkge1xuICAgIGxldCBlZGl0b3JMaW50ZXJcbiAgICByZW1vdmVkLmZvckVhY2gobWVzc2FnZSA9PiB7XG4gICAgICBpZiAobWVzc2FnZS5maWxlUGF0aCAmJiAoZWRpdG9yTGludGVyID0gdGhpcy5lZGl0b3JzLm9mUGF0aChtZXNzYWdlLmZpbGVQYXRoKSkpIHtcbiAgICAgICAgZWRpdG9yTGludGVyLmRlbGV0ZU1lc3NhZ2UobWVzc2FnZSlcbiAgICAgIH1cbiAgICB9KVxuICAgIGFkZGVkLmZvckVhY2gobWVzc2FnZSA9PiB7XG4gICAgICBpZiAobWVzc2FnZS5maWxlUGF0aCAmJiAoZWRpdG9yTGludGVyID0gdGhpcy5lZGl0b3JzLm9mUGF0aChtZXNzYWdlLmZpbGVQYXRoKSkpIHtcbiAgICAgICAgZWRpdG9yTGludGVyLmFkZE1lc3NhZ2UobWVzc2FnZSlcbiAgICAgIH1cbiAgICB9KVxuICAgIGVkaXRvckxpbnRlciA9IHRoaXMuZWRpdG9ycy5vZkFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIGlmIChlZGl0b3JMaW50ZXIpIHtcbiAgICAgIGVkaXRvckxpbnRlci5jYWxjdWxhdGVMaW5lTWVzc2FnZXMobnVsbClcbiAgICAgIHRoaXMucmVuZGVyQnViYmxlKGVkaXRvckxpbnRlcilcbiAgICB9XG4gIH1cbiAgbm90aWZ5RWRpdG9yTGludGVyKGVkaXRvckxpbnRlcikge1xuICAgIGNvbnN0IHBhdGggPSBlZGl0b3JMaW50ZXIuZWRpdG9yLmdldFBhdGgoKVxuICAgIGlmICghcGF0aCkgcmV0dXJuXG4gICAgdGhpcy5tZXNzYWdlcy5mb3JFYWNoKGZ1bmN0aW9uKG1lc3NhZ2UpIHtcbiAgICAgIGlmIChtZXNzYWdlLmZpbGVQYXRoICYmIG1lc3NhZ2UuZmlsZVBhdGggPT09IHBhdGgpIHtcbiAgICAgICAgZWRpdG9yTGludGVyLmFkZE1lc3NhZ2UobWVzc2FnZSlcbiAgICAgIH1cbiAgICB9KVxuICB9XG4gIGF0dGFjaEJvdHRvbShzdGF0dXNCYXIpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci5zdGF0dXNJY29uUG9zaXRpb24nLCBwb3NpdGlvbiA9PiB7XG4gICAgICBpZiAodGhpcy5ib3R0b21CYXIpIHtcbiAgICAgICAgdGhpcy5ib3R0b21CYXIuZGVzdHJveSgpXG4gICAgICB9XG4gICAgICB0aGlzLmJvdHRvbUJhciA9IHN0YXR1c0JhcltgYWRkJHtwb3NpdGlvbn1UaWxlYF0oe1xuICAgICAgICBpdGVtOiB0aGlzLmJvdHRvbUNvbnRhaW5lcixcbiAgICAgICAgcHJpb3JpdHk6IHBvc2l0aW9uID09PSAnTGVmdCcgPyAtMTAwIDogMTAwXG4gICAgICB9KVxuICAgIH0pKVxuICB9XG5cbiAgb25EaWRVcGRhdGVTY29wZShjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC11cGRhdGUtc2NvcGUnLCBjYWxsYmFjaylcbiAgfVxuICBkaXNwb3NlKCkge1xuICAgIC8vIE5vIG5lZWQgdG8gbm90aWZ5IGVkaXRvcnMgb2YgdGhpcywgd2UncmUgYmVpbmcgZGlzcG9zZWQgbWVhbnMgdGhlIHBhY2thZ2UgaXNcbiAgICAvLyBiZWluZyBkZWFjdGl2YXRlZC4gVGhleSdsbCBiZSBkaXNwb3NlZCBhdXRvbWF0aWNhbGx5IGJ5IHRoZSByZWdpc3RyeS5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgaWYgKHRoaXMuYm90dG9tQmFyKSB7XG4gICAgICB0aGlzLmJvdHRvbUJhci5kZXN0cm95KClcbiAgICB9XG4gICAgaWYgKHRoaXMuYnViYmxlKSB7XG4gICAgICB0aGlzLmJ1YmJsZS5kZXN0cm95KClcbiAgICAgIHRoaXMuYnViYmxlUmFuZ2UgPSBudWxsXG4gICAgfVxuICB9XG59XG4iXX0=
//# sourceURL=/Users/ah/.atom/packages/linter/lib/linter-views.js
