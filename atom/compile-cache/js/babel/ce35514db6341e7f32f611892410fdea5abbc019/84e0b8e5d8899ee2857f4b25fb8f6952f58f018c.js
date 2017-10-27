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
      if (this.bubble && editorLinter.messages.has(this.bubble.message) && this.bubble.range.containsPoint(point)) {
        return; // The marker remains the same
      }
      this.removeBubble();
      for (var message of editorLinter.messages) {
        if (message.range && message.range.containsPoint(point)) {
          var range = _atom.Range.fromObject([point, point]);
          var marker = editorLinter.editor.markBufferRange(range, { invalidate: 'inside' });
          this.bubble = { message: message, range: range, marker: marker };
          marker.onDidDestroy(function () {
            _this2.bubble = null;
          });
          editorLinter.editor.decorateMarker(marker, {
            type: 'overlay',
            item: (0, _uiMessageBubble.create)(message)
          });
          break;
        }
      }
    }
  }, {
    key: 'removeBubble',
    value: function removeBubble() {
      if (this.bubble) {
        this.bubble.marker.destroy();
        this.bubble = null;
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
      this.removeBubble();
    }
  }]);

  return LinterViews;
})();

exports['default'] = LinterViews;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL2xpbnRlci12aWV3cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O29CQUVrRCxNQUFNOzs2QkFDaEMsbUJBQW1COzs7O2lDQUNmLHVCQUF1Qjs7OztnQ0FDN0Isc0JBQXNCOzt1QkFDeEIsV0FBVzs7OzsrQkFDTSxxQkFBcUI7O0FBUDFELFdBQVcsQ0FBQTs7SUFTVSxXQUFXO0FBQ25CLFdBRFEsV0FBVyxDQUNsQixLQUFLLEVBQUUsY0FBYyxFQUFFOzs7MEJBRGhCLFdBQVc7O0FBRTVCLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7QUFDOUMsUUFBSSxDQUFDLE9BQU8sR0FBRyxtQkFBYSxDQUFBO0FBQzVCLFFBQUksQ0FBQyxXQUFXLEdBQUcsK0JBQWdCLEtBQUssQ0FBQyxDQUFBO0FBQ3pDLFFBQUksQ0FBQyxlQUFlLEdBQUcsK0JBQWdCLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQTtBQUNwRCxRQUFJLENBQUMsT0FBTyxHQUFHLGNBQWMsQ0FBQTtBQUM3QixRQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQTtBQUNyQixRQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQTs7QUFFbEIsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFBO0FBQ3hDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQTtBQUM1QyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7O0FBRXBDLFFBQUksQ0FBQyxLQUFLLEdBQUc7QUFDWCxVQUFJLEVBQUUsQ0FBQztBQUNQLFVBQUksRUFBRSxDQUFDO0FBQ1AsYUFBTyxFQUFFLENBQUM7S0FDWCxDQUFBO0FBQ0QsUUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUE7QUFDbEIsUUFB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MEJBQUMsUUFBUSxFQUFFO0FBQ3pCLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsa0JBQWtCLEVBQUUsUUFBUSxDQUFDLENBQUE7S0FDckQ7OztXQUNNLG1CQUFHOzs7QUFHUixVQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQzVCLFVBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtBQUNsQixZQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxDQUFBO09BQ3pCO0FBQ0QsVUFBSSxDQUFDLFlBQVksRUFBRSxDQUFBO0tBQ3BCOzs7U0FoSmtCLFdBQVc7OztxQkFBWCxXQUFXIiwiZmlsZSI6Ii9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL2xpbnRlci12aWV3cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCB7RW1pdHRlciwgQ29tcG9zaXRlRGlzcG9zYWJsZSwgUmFuZ2V9IGZyb20gJ2F0b20nXG5pbXBvcnQgQm90dG9tUGFuZWwgZnJvbSAnLi91aS9ib3R0b20tcGFuZWwnXG5pbXBvcnQgQm90dG9tQ29udGFpbmVyIGZyb20gJy4vdWkvYm90dG9tLWNvbnRhaW5lcidcbmltcG9ydCB7TWVzc2FnZX0gZnJvbSAnLi91aS9tZXNzYWdlLWVsZW1lbnQnXG5pbXBvcnQgSGVscGVycyBmcm9tICcuL2hlbHBlcnMnXG5pbXBvcnQge2NyZWF0ZSBhcyBjcmVhdGVCdWJibGV9IGZyb20gJy4vdWkvbWVzc2FnZS1idWJibGUnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExpbnRlclZpZXdzIHtcbiAgY29uc3RydWN0b3Ioc2NvcGUsIGVkaXRvclJlZ2lzdHJ5KSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKClcbiAgICB0aGlzLmJvdHRvbVBhbmVsID0gbmV3IEJvdHRvbVBhbmVsKHNjb3BlKVxuICAgIHRoaXMuYm90dG9tQ29udGFpbmVyID0gQm90dG9tQ29udGFpbmVyLmNyZWF0ZShzY29wZSlcbiAgICB0aGlzLmVkaXRvcnMgPSBlZGl0b3JSZWdpc3RyeVxuICAgIHRoaXMuYm90dG9tQmFyID0gbnVsbCAvLyBUbyBiZSBhZGRlZCB3aGVuIHN0YXR1cy1iYXIgc2VydmljZSBpcyBjb25zdW1lZFxuICAgIHRoaXMuYnViYmxlID0gbnVsbFxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLmJvdHRvbVBhbmVsKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5ib3R0b21Db250YWluZXIpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLmVtaXR0ZXIpXG5cbiAgICB0aGlzLmNvdW50ID0ge1xuICAgICAgTGluZTogMCxcbiAgICAgIEZpbGU6IDAsXG4gICAgICBQcm9qZWN0OiAwXG4gICAgfVxuICAgIHRoaXMubWVzc2FnZXMgPSBbXVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLnNob3dFcnJvcklubGluZScsIHNob3dCdWJibGUgPT5cbiAgICAgIHRoaXMuc2hvd0J1YmJsZSA9IHNob3dCdWJibGVcbiAgICApKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS53b3Jrc3BhY2Uub25EaWRDaGFuZ2VBY3RpdmVQYW5lSXRlbShwYW5lSXRlbSA9PiB7XG4gICAgICBsZXQgaXNFZGl0b3IgPSBmYWxzZVxuICAgICAgdGhpcy5lZGl0b3JzLmZvckVhY2goZnVuY3Rpb24oZWRpdG9yTGludGVyKSB7XG4gICAgICAgIGlzRWRpdG9yID0gKGVkaXRvckxpbnRlci5hY3RpdmUgPSBlZGl0b3JMaW50ZXIuZWRpdG9yID09PSBwYW5lSXRlbSkgfHwgaXNFZGl0b3JcbiAgICAgIH0pXG4gICAgICB0aGlzLnVwZGF0ZUNvdW50cygpXG4gICAgICB0aGlzLmJvdHRvbVBhbmVsLnJlZnJlc2goKVxuICAgICAgdGhpcy5ib3R0b21Db250YWluZXIudmlzaWJpbGl0eSA9IGlzRWRpdG9yXG4gICAgfSkpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLmJvdHRvbUNvbnRhaW5lci5vbkRpZENoYW5nZVRhYihzY29wZSA9PiB7XG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLXVwZGF0ZS1zY29wZScsIHNjb3BlKVxuICAgICAgYXRvbS5jb25maWcuc2V0KCdsaW50ZXIuc2hvd0Vycm9yUGFuZWwnLCB0cnVlKVxuICAgICAgdGhpcy5ib3R0b21QYW5lbC5yZWZyZXNoKHNjb3BlKVxuICAgIH0pKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5ib3R0b21Db250YWluZXIub25TaG91bGRUb2dnbGVQYW5lbChmdW5jdGlvbigpIHtcbiAgICAgIGF0b20uY29uZmlnLnNldCgnbGludGVyLnNob3dFcnJvclBhbmVsJywgIWF0b20uY29uZmlnLmdldCgnbGludGVyLnNob3dFcnJvclBhbmVsJykpXG4gICAgfSkpXG5cbiAgICB0aGlzLl9yZW5kZXJCdWJibGUgPSB0aGlzLnJlbmRlckJ1YmJsZVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLmlubGluZVRvb2x0aXBJbnRlcnZhbCcsIGJ1YmJsZUludGVydmFsID0+XG4gICAgICB0aGlzLnJlbmRlckJ1YmJsZSA9IEhlbHBlcnMuZGVib3VuY2UodGhpcy5fcmVuZGVyQnViYmxlLCBidWJibGVJbnRlcnZhbClcbiAgICApKVxuICB9XG4gIHJlbmRlcih7YWRkZWQsIHJlbW92ZWQsIG1lc3NhZ2VzfSkge1xuICAgIHRoaXMubWVzc2FnZXMgPSBtZXNzYWdlc1xuICAgIHRoaXMubm90aWZ5RWRpdG9yTGludGVycyh7YWRkZWQsIHJlbW92ZWR9KVxuICAgIHRoaXMuYm90dG9tUGFuZWwuc2V0TWVzc2FnZXMoe2FkZGVkLCByZW1vdmVkfSlcbiAgICB0aGlzLnVwZGF0ZUNvdW50cygpXG4gIH1cbiAgdXBkYXRlQ291bnRzKCkge1xuICAgIGNvbnN0IGFjdGl2ZUVkaXRvckxpbnRlciA9IHRoaXMuZWRpdG9ycy5vZkFjdGl2ZVRleHRFZGl0b3IoKVxuXG4gICAgdGhpcy5jb3VudC5Qcm9qZWN0ID0gdGhpcy5tZXNzYWdlcy5sZW5ndGhcbiAgICB0aGlzLmNvdW50LkZpbGUgPSBhY3RpdmVFZGl0b3JMaW50ZXIgPyBhY3RpdmVFZGl0b3JMaW50ZXIuZ2V0TWVzc2FnZXMoKS5zaXplIDogMFxuICAgIHRoaXMuY291bnQuTGluZSA9IGFjdGl2ZUVkaXRvckxpbnRlciA/IGFjdGl2ZUVkaXRvckxpbnRlci5jb3VudExpbmVNZXNzYWdlcyA6IDBcbiAgICB0aGlzLmJvdHRvbUNvbnRhaW5lci5zZXRDb3VudCh0aGlzLmNvdW50KVxuICB9XG4gIHJlbmRlckJ1YmJsZShlZGl0b3JMaW50ZXIpIHtcbiAgICBpZiAoIXRoaXMuc2hvd0J1YmJsZSB8fCAhZWRpdG9yTGludGVyLm1lc3NhZ2VzLnNpemUpIHtcbiAgICAgIHRoaXMucmVtb3ZlQnViYmxlKClcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBjb25zdCBwb2ludCA9IGVkaXRvckxpbnRlci5lZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKVxuICAgIGlmICh0aGlzLmJ1YmJsZSAmJiBlZGl0b3JMaW50ZXIubWVzc2FnZXMuaGFzKHRoaXMuYnViYmxlLm1lc3NhZ2UpICYmIHRoaXMuYnViYmxlLnJhbmdlLmNvbnRhaW5zUG9pbnQocG9pbnQpKSB7XG4gICAgICByZXR1cm4gLy8gVGhlIG1hcmtlciByZW1haW5zIHRoZSBzYW1lXG4gICAgfVxuICAgIHRoaXMucmVtb3ZlQnViYmxlKClcbiAgICBmb3IgKGxldCBtZXNzYWdlIG9mIGVkaXRvckxpbnRlci5tZXNzYWdlcykge1xuICAgICAgaWYgKG1lc3NhZ2UucmFuZ2UgJiYgbWVzc2FnZS5yYW5nZS5jb250YWluc1BvaW50KHBvaW50KSkge1xuICAgICAgICBjb25zdCByYW5nZSA9IFJhbmdlLmZyb21PYmplY3QoW3BvaW50LCBwb2ludF0pXG4gICAgICAgIGNvbnN0IG1hcmtlciA9IGVkaXRvckxpbnRlci5lZGl0b3IubWFya0J1ZmZlclJhbmdlKHJhbmdlLCB7aW52YWxpZGF0ZTogJ2luc2lkZSd9KVxuICAgICAgICB0aGlzLmJ1YmJsZSA9IHttZXNzYWdlLCByYW5nZSwgbWFya2VyfVxuICAgICAgICBtYXJrZXIub25EaWREZXN0cm95KCgpID0+IHtcbiAgICAgICAgICB0aGlzLmJ1YmJsZSA9IG51bGxcbiAgICAgICAgfSlcbiAgICAgICAgZWRpdG9yTGludGVyLmVkaXRvci5kZWNvcmF0ZU1hcmtlcihtYXJrZXIsIHtcbiAgICAgICAgICB0eXBlOiAnb3ZlcmxheScsXG4gICAgICAgICAgaXRlbTogY3JlYXRlQnViYmxlKG1lc3NhZ2UpXG4gICAgICAgIH0pXG4gICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJlbW92ZUJ1YmJsZSgpIHtcbiAgICBpZiAodGhpcy5idWJibGUpIHtcbiAgICAgIHRoaXMuYnViYmxlLm1hcmtlci5kZXN0cm95KClcbiAgICAgIHRoaXMuYnViYmxlID0gbnVsbFxuICAgIH1cbiAgfVxuICBub3RpZnlFZGl0b3JMaW50ZXJzKHthZGRlZCwgcmVtb3ZlZH0pIHtcbiAgICBsZXQgZWRpdG9yTGludGVyXG4gICAgcmVtb3ZlZC5mb3JFYWNoKG1lc3NhZ2UgPT4ge1xuICAgICAgaWYgKG1lc3NhZ2UuZmlsZVBhdGggJiYgKGVkaXRvckxpbnRlciA9IHRoaXMuZWRpdG9ycy5vZlBhdGgobWVzc2FnZS5maWxlUGF0aCkpKSB7XG4gICAgICAgIGVkaXRvckxpbnRlci5kZWxldGVNZXNzYWdlKG1lc3NhZ2UpXG4gICAgICB9XG4gICAgfSlcbiAgICBhZGRlZC5mb3JFYWNoKG1lc3NhZ2UgPT4ge1xuICAgICAgaWYgKG1lc3NhZ2UuZmlsZVBhdGggJiYgKGVkaXRvckxpbnRlciA9IHRoaXMuZWRpdG9ycy5vZlBhdGgobWVzc2FnZS5maWxlUGF0aCkpKSB7XG4gICAgICAgIGVkaXRvckxpbnRlci5hZGRNZXNzYWdlKG1lc3NhZ2UpXG4gICAgICB9XG4gICAgfSlcbiAgICBlZGl0b3JMaW50ZXIgPSB0aGlzLmVkaXRvcnMub2ZBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBpZiAoZWRpdG9yTGludGVyKSB7XG4gICAgICBlZGl0b3JMaW50ZXIuY2FsY3VsYXRlTGluZU1lc3NhZ2VzKG51bGwpXG4gICAgICB0aGlzLnJlbmRlckJ1YmJsZShlZGl0b3JMaW50ZXIpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVtb3ZlQnViYmxlKClcbiAgICB9XG4gIH1cbiAgbm90aWZ5RWRpdG9yTGludGVyKGVkaXRvckxpbnRlcikge1xuICAgIGNvbnN0IHBhdGggPSBlZGl0b3JMaW50ZXIuZWRpdG9yLmdldFBhdGgoKVxuICAgIGlmICghcGF0aCkgcmV0dXJuXG4gICAgdGhpcy5tZXNzYWdlcy5mb3JFYWNoKGZ1bmN0aW9uKG1lc3NhZ2UpIHtcbiAgICAgIGlmIChtZXNzYWdlLmZpbGVQYXRoICYmIG1lc3NhZ2UuZmlsZVBhdGggPT09IHBhdGgpIHtcbiAgICAgICAgZWRpdG9yTGludGVyLmFkZE1lc3NhZ2UobWVzc2FnZSlcbiAgICAgIH1cbiAgICB9KVxuICB9XG4gIGF0dGFjaEJvdHRvbShzdGF0dXNCYXIpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci5zdGF0dXNJY29uUG9zaXRpb24nLCBwb3NpdGlvbiA9PiB7XG4gICAgICBpZiAodGhpcy5ib3R0b21CYXIpIHtcbiAgICAgICAgdGhpcy5ib3R0b21CYXIuZGVzdHJveSgpXG4gICAgICB9XG4gICAgICB0aGlzLmJvdHRvbUJhciA9IHN0YXR1c0JhcltgYWRkJHtwb3NpdGlvbn1UaWxlYF0oe1xuICAgICAgICBpdGVtOiB0aGlzLmJvdHRvbUNvbnRhaW5lcixcbiAgICAgICAgcHJpb3JpdHk6IHBvc2l0aW9uID09PSAnTGVmdCcgPyAtMTAwIDogMTAwXG4gICAgICB9KVxuICAgIH0pKVxuICB9XG5cbiAgb25EaWRVcGRhdGVTY29wZShjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC11cGRhdGUtc2NvcGUnLCBjYWxsYmFjaylcbiAgfVxuICBkaXNwb3NlKCkge1xuICAgIC8vIE5vIG5lZWQgdG8gbm90aWZ5IGVkaXRvcnMgb2YgdGhpcywgd2UncmUgYmVpbmcgZGlzcG9zZWQgbWVhbnMgdGhlIHBhY2thZ2UgaXNcbiAgICAvLyBiZWluZyBkZWFjdGl2YXRlZC4gVGhleSdsbCBiZSBkaXNwb3NlZCBhdXRvbWF0aWNhbGx5IGJ5IHRoZSByZWdpc3RyeS5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgaWYgKHRoaXMuYm90dG9tQmFyKSB7XG4gICAgICB0aGlzLmJvdHRvbUJhci5kZXN0cm95KClcbiAgICB9XG4gICAgdGhpcy5yZW1vdmVCdWJibGUoKVxuICB9XG59XG4iXX0=
//# sourceURL=/Users/ah/.atom/packages/linter/lib/linter-views.js
