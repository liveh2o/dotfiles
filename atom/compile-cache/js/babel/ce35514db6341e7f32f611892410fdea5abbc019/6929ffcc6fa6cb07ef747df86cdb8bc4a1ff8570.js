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
      var _this2 = this;

      if (!this.showBubble || !editorLinter.messages.size) {
        this.removeBubble();
        return;
      }
      var point = editorLinter.editor.getCursorBufferPosition();
      if (this.bubbleRange && this.bubbleRange.containsPoint(point)) {
        return; // The marker remains the same
      }
      this.removeBubble();
      for (var message of editorLinter.messages) {
        if (message.range && message.range.containsPoint(point)) {
          this.bubbleRange = _atom.Range.fromObject([point, point]);
          this.bubble = editorLinter.editor.markBufferRange(this.bubbleRange, { invalidate: 'inside' });
          this.bubble.onDidDestroy(function () {
            _this2.bubble = null;
            _this2.bubbleRange = null;
          });
          editorLinter.editor.decorateMarker(this.bubble, {
            type: 'overlay',
            item: (0, _uiMessageBubble.create)(message)
          });
          return;
        }
      }
      this.bubbleRange = null;
    }
  }, {
    key: 'removeBubble',
    value: function removeBubble() {
      if (this.bubble) {
        this.bubble.destroy();
      }
    }
  }, {
    key: 'notifyEditorLinters',
    value: function notifyEditorLinters(_ref2) {
      var _this3 = this;

      var added = _ref2.added;
      var removed = _ref2.removed;

      var editorLinter = undefined;
      removed.forEach(function (message) {
        if (message.filePath && (editorLinter = _this3.editors.ofPath(message.filePath))) {
          editorLinter.deleteMessage(message);
        }
      });
      added.forEach(function (message) {
        if (message.filePath && (editorLinter = _this3.editors.ofPath(message.filePath))) {
          editorLinter.addMessage(message);
        }
      });
      editorLinter = this.editors.ofActiveTextEditor();
      if (editorLinter) {
        editorLinter.calculateLineMessages(null);
        this.renderBubble(editorLinter);
      } else {
        this.removeBubble();
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
      var _this4 = this;

      this.subscriptions.add(atom.config.observe('linter.statusIconPosition', function (position) {
        if (_this4.bottomBar) {
          _this4.bottomBar.destroy();
        }
        _this4.bottomBar = statusBar['add' + position + 'Tile']({
          item: _this4.bottomContainer,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL2xpbnRlci12aWV3cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O29CQUVrRCxNQUFNOzs2QkFDaEMsbUJBQW1COzs7O2lDQUNmLHVCQUF1Qjs7OztnQ0FDN0Isc0JBQXNCOzt1QkFDeEIsV0FBVzs7OzsrQkFDTSxxQkFBcUI7O0FBUDFELFdBQVcsQ0FBQTs7SUFTVSxXQUFXO0FBQ25CLFdBRFEsV0FBVyxDQUNsQixLQUFLLEVBQUUsY0FBYyxFQUFFOzs7MEJBRGhCLFdBQVc7O0FBRTVCLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7QUFDOUMsUUFBSSxDQUFDLE9BQU8sR0FBRyxtQkFBYSxDQUFBO0FBQzVCLFFBQUksQ0FBQyxXQUFXLEdBQUcsK0JBQWdCLEtBQUssQ0FBQyxDQUFBO0FBQ3pDLFFBQUksQ0FBQyxlQUFlLEdBQUcsK0JBQWdCLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQTtBQUNwRCxRQUFJLENBQUMsT0FBTyxHQUFHLGNBQWMsQ0FBQTtBQUM3QixRQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQTtBQUNyQixRQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQTtBQUNsQixRQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQTs7QUFFdkIsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFBO0FBQ3hDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQTtBQUM1QyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7O0FBRXBDLFFBQUksQ0FBQyxLQUFLLEdBQUc7QUFDWCxVQUFJLEVBQUUsQ0FBQztBQUNQLFVBQUksRUFBRSxDQUFDO0FBQ1AsYUFBTyxFQUFFLENBQUM7S0FDWCxDQUFBO0FBQ0QsUUFB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Q0FBQyxDQUFBO0tBQ3JEOzs7V0FDTSxtQkFBRzs7O0FBR1IsVUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUM1QixVQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7QUFDbEIsWUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtPQUN6QjtBQUNELFVBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtBQUNmLFlBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDckIsWUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUE7T0FDeEI7S0FDRjs7O1NBcEprQixXQUFXOzs7cUJBQVgsV0FBVyIsImZpbGUiOiIvVXNlcnMvYWgvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi9saW50ZXItdmlld3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQge0VtaXR0ZXIsIENvbXBvc2l0ZURpc3Bvc2FibGUsIFJhbmdlfSBmcm9tICdhdG9tJ1xuaW1wb3J0IEJvdHRvbVBhbmVsIGZyb20gJy4vdWkvYm90dG9tLXBhbmVsJ1xuaW1wb3J0IEJvdHRvbUNvbnRhaW5lciBmcm9tICcuL3VpL2JvdHRvbS1jb250YWluZXInXG5pbXBvcnQge01lc3NhZ2V9IGZyb20gJy4vdWkvbWVzc2FnZS1lbGVtZW50J1xuaW1wb3J0IEhlbHBlcnMgZnJvbSAnLi9oZWxwZXJzJ1xuaW1wb3J0IHtjcmVhdGUgYXMgY3JlYXRlQnViYmxlfSBmcm9tICcuL3VpL21lc3NhZ2UtYnViYmxlJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMaW50ZXJWaWV3cyB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlLCBlZGl0b3JSZWdpc3RyeSkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpXG4gICAgdGhpcy5ib3R0b21QYW5lbCA9IG5ldyBCb3R0b21QYW5lbChzY29wZSlcbiAgICB0aGlzLmJvdHRvbUNvbnRhaW5lciA9IEJvdHRvbUNvbnRhaW5lci5jcmVhdGUoc2NvcGUpXG4gICAgdGhpcy5lZGl0b3JzID0gZWRpdG9yUmVnaXN0cnlcbiAgICB0aGlzLmJvdHRvbUJhciA9IG51bGwgLy8gVG8gYmUgYWRkZWQgd2hlbiBzdGF0dXMtYmFyIHNlcnZpY2UgaXMgY29uc3VtZWRcbiAgICB0aGlzLmJ1YmJsZSA9IG51bGxcbiAgICB0aGlzLmJ1YmJsZVJhbmdlID0gbnVsbFxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLmJvdHRvbVBhbmVsKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5ib3R0b21Db250YWluZXIpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLmVtaXR0ZXIpXG5cbiAgICB0aGlzLmNvdW50ID0ge1xuICAgICAgTGluZTogMCxcbiAgICAgIEZpbGU6IDAsXG4gICAgICBQcm9qZWN0OiAwXG4gICAgfVxuICAgIHRoaXMubWVzc2FnZXMgPSBbXVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLnNob3dFcnJvcklubGluZScsIHNob3dCdWJibGUgPT5cbiAgICAgIHRoaXMuc2hvd0J1YmJsZSA9IHNob3dCdWJibGVcbiAgICApKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS53b3Jrc3BhY2Uub25EaWRDaGFuZ2VBY3RpdmVQYW5lSXRlbShwYW5lSXRlbSA9PiB7XG4gICAgICBsZXQgaXNFZGl0b3IgPSBmYWxzZVxuICAgICAgdGhpcy5lZGl0b3JzLmZvckVhY2goZnVuY3Rpb24oZWRpdG9yTGludGVyKSB7XG4gICAgICAgIGlzRWRpdG9yID0gKGVkaXRvckxpbnRlci5hY3RpdmUgPSBlZGl0b3JMaW50ZXIuZWRpdG9yID09PSBwYW5lSXRlbSkgfHwgaXNFZGl0b3JcbiAgICAgIH0pXG4gICAgICB0aGlzLnVwZGF0ZUNvdW50cygpXG4gICAgICB0aGlzLmJvdHRvbVBhbmVsLnJlZnJlc2goKVxuICAgICAgdGhpcy5ib3R0b21Db250YWluZXIudmlzaWJpbGl0eSA9IGlzRWRpdG9yXG4gICAgfSkpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLmJvdHRvbUNvbnRhaW5lci5vbkRpZENoYW5nZVRhYihzY29wZSA9PiB7XG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLXVwZGF0ZS1zY29wZScsIHNjb3BlKVxuICAgICAgYXRvbS5jb25maWcuc2V0KCdsaW50ZXIuc2hvd0Vycm9yUGFuZWwnLCB0cnVlKVxuICAgICAgdGhpcy5ib3R0b21QYW5lbC5yZWZyZXNoKHNjb3BlKVxuICAgIH0pKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5ib3R0b21Db250YWluZXIub25TaG91bGRUb2dnbGVQYW5lbChmdW5jdGlvbigpIHtcbiAgICAgIGF0b20uY29uZmlnLnNldCgnbGludGVyLnNob3dFcnJvclBhbmVsJywgIWF0b20uY29uZmlnLmdldCgnbGludGVyLnNob3dFcnJvclBhbmVsJykpXG4gICAgfSkpXG5cbiAgICB0aGlzLl9yZW5kZXJCdWJibGUgPSB0aGlzLnJlbmRlckJ1YmJsZVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLmlubGluZVRvb2x0aXBJbnRlcnZhbCcsIGJ1YmJsZUludGVydmFsID0+XG4gICAgICB0aGlzLnJlbmRlckJ1YmJsZSA9IEhlbHBlcnMuZGVib3VuY2UodGhpcy5fcmVuZGVyQnViYmxlLCBidWJibGVJbnRlcnZhbClcbiAgICApKVxuICB9XG4gIHJlbmRlcih7YWRkZWQsIHJlbW92ZWQsIG1lc3NhZ2VzfSkge1xuICAgIHRoaXMubWVzc2FnZXMgPSBtZXNzYWdlc1xuICAgIHRoaXMubm90aWZ5RWRpdG9yTGludGVycyh7YWRkZWQsIHJlbW92ZWR9KVxuICAgIHRoaXMuYm90dG9tUGFuZWwuc2V0TWVzc2FnZXMoe2FkZGVkLCByZW1vdmVkfSlcbiAgICB0aGlzLnVwZGF0ZUNvdW50cygpXG4gIH1cbiAgdXBkYXRlQ291bnRzKCkge1xuICAgIGNvbnN0IGFjdGl2ZUVkaXRvckxpbnRlciA9IHRoaXMuZWRpdG9ycy5vZkFjdGl2ZVRleHRFZGl0b3IoKVxuXG4gICAgdGhpcy5jb3VudC5Qcm9qZWN0ID0gdGhpcy5tZXNzYWdlcy5sZW5ndGhcbiAgICB0aGlzLmNvdW50LkZpbGUgPSBhY3RpdmVFZGl0b3JMaW50ZXIgPyBhY3RpdmVFZGl0b3JMaW50ZXIuZ2V0TWVzc2FnZXMoKS5zaXplIDogMFxuICAgIHRoaXMuY291bnQuTGluZSA9IGFjdGl2ZUVkaXRvckxpbnRlciA/IGFjdGl2ZUVkaXRvckxpbnRlci5jb3VudExpbmVNZXNzYWdlcyA6IDBcbiAgICB0aGlzLmJvdHRvbUNvbnRhaW5lci5zZXRDb3VudCh0aGlzLmNvdW50KVxuICB9XG4gIHJlbmRlckJ1YmJsZShlZGl0b3JMaW50ZXIpIHtcbiAgICBpZiAoIXRoaXMuc2hvd0J1YmJsZSB8fCAhZWRpdG9yTGludGVyLm1lc3NhZ2VzLnNpemUpIHtcbiAgICAgIHRoaXMucmVtb3ZlQnViYmxlKClcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBjb25zdCBwb2ludCA9IGVkaXRvckxpbnRlci5lZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKVxuICAgIGlmICh0aGlzLmJ1YmJsZVJhbmdlICYmIHRoaXMuYnViYmxlUmFuZ2UuY29udGFpbnNQb2ludChwb2ludCkpIHtcbiAgICAgIHJldHVybiAvLyBUaGUgbWFya2VyIHJlbWFpbnMgdGhlIHNhbWVcbiAgICB9XG4gICAgdGhpcy5yZW1vdmVCdWJibGUoKVxuICAgIGZvciAobGV0IG1lc3NhZ2Ugb2YgZWRpdG9yTGludGVyLm1lc3NhZ2VzKSB7XG4gICAgICBpZiAobWVzc2FnZS5yYW5nZSAmJiBtZXNzYWdlLnJhbmdlLmNvbnRhaW5zUG9pbnQocG9pbnQpKSB7XG4gICAgICAgIHRoaXMuYnViYmxlUmFuZ2UgPSBSYW5nZS5mcm9tT2JqZWN0KFtwb2ludCwgcG9pbnRdKVxuICAgICAgICB0aGlzLmJ1YmJsZSA9IGVkaXRvckxpbnRlci5lZGl0b3IubWFya0J1ZmZlclJhbmdlKHRoaXMuYnViYmxlUmFuZ2UsIHtpbnZhbGlkYXRlOiAnaW5zaWRlJ30pXG4gICAgICAgIHRoaXMuYnViYmxlLm9uRGlkRGVzdHJveSgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5idWJibGUgPSBudWxsXG4gICAgICAgICAgdGhpcy5idWJibGVSYW5nZSA9IG51bGxcbiAgICAgICAgfSlcbiAgICAgICAgZWRpdG9yTGludGVyLmVkaXRvci5kZWNvcmF0ZU1hcmtlcih0aGlzLmJ1YmJsZSwge1xuICAgICAgICAgIHR5cGU6ICdvdmVybGF5JyxcbiAgICAgICAgICBpdGVtOiBjcmVhdGVCdWJibGUobWVzc2FnZSlcbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuYnViYmxlUmFuZ2UgPSBudWxsXG4gIH1cbiAgcmVtb3ZlQnViYmxlKCkge1xuICAgIGlmICh0aGlzLmJ1YmJsZSkge1xuICAgICAgdGhpcy5idWJibGUuZGVzdHJveSgpXG4gICAgfVxuICB9XG4gIG5vdGlmeUVkaXRvckxpbnRlcnMoe2FkZGVkLCByZW1vdmVkfSkge1xuICAgIGxldCBlZGl0b3JMaW50ZXJcbiAgICByZW1vdmVkLmZvckVhY2gobWVzc2FnZSA9PiB7XG4gICAgICBpZiAobWVzc2FnZS5maWxlUGF0aCAmJiAoZWRpdG9yTGludGVyID0gdGhpcy5lZGl0b3JzLm9mUGF0aChtZXNzYWdlLmZpbGVQYXRoKSkpIHtcbiAgICAgICAgZWRpdG9yTGludGVyLmRlbGV0ZU1lc3NhZ2UobWVzc2FnZSlcbiAgICAgIH1cbiAgICB9KVxuICAgIGFkZGVkLmZvckVhY2gobWVzc2FnZSA9PiB7XG4gICAgICBpZiAobWVzc2FnZS5maWxlUGF0aCAmJiAoZWRpdG9yTGludGVyID0gdGhpcy5lZGl0b3JzLm9mUGF0aChtZXNzYWdlLmZpbGVQYXRoKSkpIHtcbiAgICAgICAgZWRpdG9yTGludGVyLmFkZE1lc3NhZ2UobWVzc2FnZSlcbiAgICAgIH1cbiAgICB9KVxuICAgIGVkaXRvckxpbnRlciA9IHRoaXMuZWRpdG9ycy5vZkFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIGlmIChlZGl0b3JMaW50ZXIpIHtcbiAgICAgIGVkaXRvckxpbnRlci5jYWxjdWxhdGVMaW5lTWVzc2FnZXMobnVsbClcbiAgICAgIHRoaXMucmVuZGVyQnViYmxlKGVkaXRvckxpbnRlcilcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yZW1vdmVCdWJibGUoKVxuICAgIH1cbiAgfVxuICBub3RpZnlFZGl0b3JMaW50ZXIoZWRpdG9yTGludGVyKSB7XG4gICAgY29uc3QgcGF0aCA9IGVkaXRvckxpbnRlci5lZGl0b3IuZ2V0UGF0aCgpXG4gICAgaWYgKCFwYXRoKSByZXR1cm5cbiAgICB0aGlzLm1lc3NhZ2VzLmZvckVhY2goZnVuY3Rpb24obWVzc2FnZSkge1xuICAgICAgaWYgKG1lc3NhZ2UuZmlsZVBhdGggJiYgbWVzc2FnZS5maWxlUGF0aCA9PT0gcGF0aCkge1xuICAgICAgICBlZGl0b3JMaW50ZXIuYWRkTWVzc2FnZShtZXNzYWdlKVxuICAgICAgfVxuICAgIH0pXG4gIH1cbiAgYXR0YWNoQm90dG9tKHN0YXR1c0Jhcikge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLnN0YXR1c0ljb25Qb3NpdGlvbicsIHBvc2l0aW9uID0+IHtcbiAgICAgIGlmICh0aGlzLmJvdHRvbUJhcikge1xuICAgICAgICB0aGlzLmJvdHRvbUJhci5kZXN0cm95KClcbiAgICAgIH1cbiAgICAgIHRoaXMuYm90dG9tQmFyID0gc3RhdHVzQmFyW2BhZGQke3Bvc2l0aW9ufVRpbGVgXSh7XG4gICAgICAgIGl0ZW06IHRoaXMuYm90dG9tQ29udGFpbmVyLFxuICAgICAgICBwcmlvcml0eTogcG9zaXRpb24gPT09ICdMZWZ0JyA/IC0xMDAgOiAxMDBcbiAgICAgIH0pXG4gICAgfSkpXG4gIH1cblxuICBvbkRpZFVwZGF0ZVNjb3BlKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLXVwZGF0ZS1zY29wZScsIGNhbGxiYWNrKVxuICB9XG4gIGRpc3Bvc2UoKSB7XG4gICAgLy8gTm8gbmVlZCB0byBub3RpZnkgZWRpdG9ycyBvZiB0aGlzLCB3ZSdyZSBiZWluZyBkaXNwb3NlZCBtZWFucyB0aGUgcGFja2FnZSBpc1xuICAgIC8vIGJlaW5nIGRlYWN0aXZhdGVkLiBUaGV5J2xsIGJlIGRpc3Bvc2VkIGF1dG9tYXRpY2FsbHkgYnkgdGhlIHJlZ2lzdHJ5LlxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICBpZiAodGhpcy5ib3R0b21CYXIpIHtcbiAgICAgIHRoaXMuYm90dG9tQmFyLmRlc3Ryb3koKVxuICAgIH1cbiAgICBpZiAodGhpcy5idWJibGUpIHtcbiAgICAgIHRoaXMuYnViYmxlLmRlc3Ryb3koKVxuICAgICAgdGhpcy5idWJibGVSYW5nZSA9IG51bGxcbiAgICB9XG4gIH1cbn1cbiJdfQ==
//# sourceURL=/Users/ah/.atom/packages/linter/lib/linter-views.js
