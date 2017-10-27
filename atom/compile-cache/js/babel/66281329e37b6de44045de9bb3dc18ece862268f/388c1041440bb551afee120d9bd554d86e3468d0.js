Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _messageElement = require('./message-element');

'use babel';

var Interact = require('interact.js');
var Clipboard = require('clipboard');

var BottomPanel = (function () {
  function BottomPanel(scope) {
    var _this = this;

    _classCallCheck(this, BottomPanel);

    this.subscriptions = new _atom.CompositeDisposable();

    this.visibility = false;
    this.visibleMessages = 0;
    this.alwaysTakeMinimumSpace = atom.config.get('linter.alwaysTakeMinimumSpace');
    this.errorPanelHeight = atom.config.get('linter.errorPanelHeight');
    this.configVisibility = atom.config.get('linter.showErrorPanel');
    this.scope = scope;
    this.editorMessages = new Map();
    this.messages = new Map();

    var element = document.createElement('linter-panel'); // TODO(steelbrain): Make this a `div`
    element.tabIndex = '-1';
    this.messagesElement = document.createElement('div');
    element.appendChild(this.messagesElement);
    this.panel = atom.workspace.addBottomPanel({ item: element, visible: false, priority: 500 });
    Interact(element).resizable({ edges: { top: true } }).on('resizemove', function (event) {
      event.target.style.height = event.rect.height + 'px';
    }).on('resizeend', function (event) {
      atom.config.set('linter.errorPanelHeight', event.target.clientHeight);
    });
    element.addEventListener('keydown', function (e) {
      if (e.which === 67 && e.ctrlKey) {
        Clipboard.writeText(getSelection().toString());
      }
    });

    this.subscriptions.add(atom.config.onDidChange('linter.alwaysTakeMinimumSpace', function (_ref) {
      var newValue = _ref.newValue;

      _this.alwaysTakeMinimumSpace = newValue;
      _this.updateHeight();
    }));

    this.subscriptions.add(atom.config.onDidChange('linter.errorPanelHeight', function (_ref2) {
      var newValue = _ref2.newValue;

      _this.errorPanelHeight = newValue;
      _this.updateHeight();
    }));

    this.subscriptions.add(atom.config.onDidChange('linter.showErrorPanel', function (_ref3) {
      var newValue = _ref3.newValue;

      _this.configVisibility = newValue;
      _this.updateVisibility();
    }));

    this.subscriptions.add(atom.workspace.observeActivePaneItem(function (paneItem) {
      _this.paneVisibility = paneItem === atom.workspace.getActiveTextEditor();
      _this.updateVisibility();
    }));

    // Container for messages with no filePath
    var defaultContainer = document.createElement('div');
    this.editorMessages.set(null, defaultContainer);
    this.messagesElement.appendChild(defaultContainer);
    if (scope !== 'Project') {
      defaultContainer.setAttribute('hidden', true);
    }
  }

  _createClass(BottomPanel, [{
    key: 'setMessages',
    value: function setMessages(_ref4) {
      var _this2 = this;

      var added = _ref4.added;
      var removed = _ref4.removed;

      if (removed.length) {
        this.removeMessages(removed);
      }
      if (added.length) {
        (function () {
          var activeFile = atom.workspace.getActiveTextEditor();
          activeFile = activeFile ? activeFile.getPath() : undefined;
          added.forEach(function (message) {
            if (!_this2.editorMessages.has(message.filePath)) {
              var container = document.createElement('div');
              _this2.editorMessages.set(message.filePath, container);
              _this2.messagesElement.appendChild(container);
              if (!(_this2.scope === 'Project' || activeFile === message.filePath)) {
                container.setAttribute('hidden', true);
              }
            }
            var messageElement = _messageElement.Message.fromMessage(message);
            _this2.messages.set(message, messageElement);
            _this2.editorMessages.get(message.filePath).appendChild(messageElement);
            if (messageElement.updateVisibility(_this2.scope).visibility) {
              _this2.visibleMessages++;
            }
          });
        })();
      }

      this.editorMessages.forEach(function (child, key) {
        // Never delete the default container
        if (key !== null && !child.childNodes.length) {
          child.remove();
          _this2.editorMessages['delete'](key);
        }
      });

      this.updateVisibility();
    }
  }, {
    key: 'removeMessages',
    value: function removeMessages(messages) {
      var _this3 = this;

      messages.forEach(function (message) {
        var messageElement = _this3.messages.get(message);
        _this3.messages['delete'](message);
        messageElement.remove();
        if (messageElement.visibility) {
          _this3.visibleMessages--;
        }
      });
    }
  }, {
    key: 'refresh',
    value: function refresh(scope) {
      var _this4 = this;

      if (scope) {
        this.scope = scope;
      } else scope = this.scope;
      this.visibleMessages = 0;

      this.messages.forEach(function (messageElement) {
        if (messageElement.updateVisibility(scope).visibility && scope === 'Line') {
          _this4.visibleMessages++;
        }
      });

      if (scope === 'File') {
        (function () {
          var activeFile = atom.workspace.getActiveTextEditor();
          activeFile = activeFile ? activeFile.getPath() : undefined;
          _this4.editorMessages.forEach(function (messagesElement, filePath) {
            if (filePath === activeFile) {
              messagesElement.removeAttribute('hidden');
              _this4.visibleMessages = messagesElement.childNodes.length;
            } else messagesElement.setAttribute('hidden', true);
          });
        })();
      } else if (scope === 'Project') {
        this.visibleMessages = this.messages.size;
        this.editorMessages.forEach(function (messageElement) {
          messageElement.removeAttribute('hidden');
        });
      }

      this.updateVisibility();
    }
  }, {
    key: 'updateHeight',
    value: function updateHeight() {
      var height = this.errorPanelHeight;

      if (this.alwaysTakeMinimumSpace) {
        // Add `1px` for the top border.
        height = Math.min(this.messagesElement.clientHeight + 1, height);
      }

      this.messagesElement.parentNode.style.height = height + 'px';
    }
  }, {
    key: 'getVisibility',
    value: function getVisibility() {
      return this.visibility;
    }
  }, {
    key: 'updateVisibility',
    value: function updateVisibility() {
      this.visibility = this.configVisibility && this.paneVisibility && this.visibleMessages > 0;

      if (this.visibility) {
        this.panel.show();
        this.updateHeight();
      } else {
        this.panel.hide();
      }
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
      this.messages.clear();
      try {
        this.panel.destroy();
      } catch (err) {
        // Atom fails weirdly sometimes when doing this
      }
    }
  }]);

  return BottomPanel;
})();

exports['default'] = BottomPanel;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL3VpL2JvdHRvbS1wYW5lbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztvQkFJa0MsTUFBTTs7OEJBQ2xCLG1CQUFtQjs7QUFMekMsV0FBVyxDQUFBOztBQUVYLElBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQTtBQUN2QyxJQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUE7O0lBSWpCLFdBQVc7QUFDbkIsV0FEUSxXQUFXLENBQ2xCLEtBQUssRUFBRTs7OzBCQURBLFdBQVc7O0FBRTVCLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXVCLENBQUE7O0FBRTVDLFFBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFBO0FBQ3ZCLFFBQUksQ0FBQyxlQUFlLEdBQUcsQ0FBQyxDQUFBO0FBQ3hCLFFBQUksQ0FBQyxzQkFBc0IsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQywrQkFBK0IsQ0FBQyxDQUFBO0FBQzlFLFFBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFBO0FBQ2xFLFFBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFBO0FBQ2hFLFFBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFBO0FBQ2xCLFFBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTtBQUMvQixRQUFJLENBQUMsUUFBUSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7O0FBRXpCLFFBQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUE7QUFDdEQsV0FBTyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUE7QUFDdkIsUUFBSSxDQUFDLGVBQWUsR0FBRyxRQUFRLENBQUMs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QTs7QUFFbEMsVUFBSSxJQUFJLENBQUMsc0JBQXNCLEVBQUU7O0FBRS9CLGNBQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsWUFBWSxHQUFHLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQTtPQUNqRTs7QUFFRCxVQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFNLE1BQU0sT0FBSSxDQUFBO0tBQzdEOzs7V0FDWSx5QkFBRztBQUNkLGFBQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQTtLQUN2Qjs7O1dBQ2UsNEJBQUc7QUFDakIsVUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLElBQUksSUFBSSxDQUFDLGNBQWMsSUFBSSxJQUFJLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQTs7QUFFMUYsVUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO0FBQ25CLFlBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUE7QUFDakIsWUFBSSxDQUFDLFlBQVksRUFBRSxDQUFBO09BQ3BCLE1BQU07QUFDTCxZQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFBO09BQ2xCO0tBQ0Y7OztXQUNNLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUM1QixVQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFBO0FBQ3JCLFVBQUk7QUFDRixZQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFBO09BQ3JCLENBQUMsT0FBTyxHQUFHLEVBQUU7O09BRWI7S0FDRjs7O1NBcktrQixXQUFXOzs7cUJBQVgsV0FBVyIsImZpbGUiOiIvVXNlcnMvYWgvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi91aS9ib3R0b20tcGFuZWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5jb25zdCBJbnRlcmFjdCA9IHJlcXVpcmUoJ2ludGVyYWN0LmpzJylcbmNvbnN0IENsaXBib2FyZCA9IHJlcXVpcmUoJ2NsaXBib2FyZCcpXG5pbXBvcnQge0NvbXBvc2l0ZURpc3Bvc2FibGV9IGZyb20gJ2F0b20nXG5pbXBvcnQge01lc3NhZ2V9IGZyb20gJy4vbWVzc2FnZS1lbGVtZW50J1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCb3R0b21QYW5lbCB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcblxuICAgIHRoaXMudmlzaWJpbGl0eSA9IGZhbHNlXG4gICAgdGhpcy52aXNpYmxlTWVzc2FnZXMgPSAwXG4gICAgdGhpcy5hbHdheXNUYWtlTWluaW11bVNwYWNlID0gYXRvbS5jb25maWcuZ2V0KCdsaW50ZXIuYWx3YXlzVGFrZU1pbmltdW1TcGFjZScpXG4gICAgdGhpcy5lcnJvclBhbmVsSGVpZ2h0ID0gYXRvbS5jb25maWcuZ2V0KCdsaW50ZXIuZXJyb3JQYW5lbEhlaWdodCcpXG4gICAgdGhpcy5jb25maWdWaXNpYmlsaXR5ID0gYXRvbS5jb25maWcuZ2V0KCdsaW50ZXIuc2hvd0Vycm9yUGFuZWwnKVxuICAgIHRoaXMuc2NvcGUgPSBzY29wZVxuICAgIHRoaXMuZWRpdG9yTWVzc2FnZXMgPSBuZXcgTWFwKClcbiAgICB0aGlzLm1lc3NhZ2VzID0gbmV3IE1hcCgpXG5cbiAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGludGVyLXBhbmVsJykgLy8gVE9ETyhzdGVlbGJyYWluKTogTWFrZSB0aGlzIGEgYGRpdmBcbiAgICBlbGVtZW50LnRhYkluZGV4ID0gJy0xJ1xuICAgIHRoaXMubWVzc2FnZXNFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICBlbGVtZW50LmFwcGVuZENoaWxkKHRoaXMubWVzc2FnZXNFbGVtZW50KVxuICAgIHRoaXMucGFuZWwgPSBhdG9tLndvcmtzcGFjZS5hZGRCb3R0b21QYW5lbCh7aXRlbTogZWxlbWVudCwgdmlzaWJsZTogZmFsc2UsIHByaW9yaXR5OiA1MDB9KVxuICAgIEludGVyYWN0KGVsZW1lbnQpLnJlc2l6YWJsZSh7ZWRnZXM6IHt0b3A6IHRydWV9fSlcbiAgICAgIC5vbigncmVzaXplbW92ZScsIGV2ZW50ID0+IHtcbiAgICAgICAgZXZlbnQudGFyZ2V0LnN0eWxlLmhlaWdodCA9IGAke2V2ZW50LnJlY3QuaGVpZ2h0fXB4YFxuICAgICAgfSlcbiAgICAgIC5vbigncmVzaXplZW5kJywgZXZlbnQgPT4ge1xuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ2xpbnRlci5lcnJvclBhbmVsSGVpZ2h0JywgZXZlbnQudGFyZ2V0LmNsaWVudEhlaWdodClcbiAgICAgIH0pXG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgZnVuY3Rpb24oZSkge1xuICAgICAgaWYgKGUud2hpY2ggPT09IDY3ICYmIGUuY3RybEtleSkge1xuICAgICAgICBDbGlwYm9hcmQud3JpdGVUZXh0KGdldFNlbGVjdGlvbigpLnRvU3RyaW5nKCkpXG4gICAgICB9XG4gICAgfSlcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub25EaWRDaGFuZ2UoJ2xpbnRlci5hbHdheXNUYWtlTWluaW11bVNwYWNlJywgKHtuZXdWYWx1ZX0pID0+IHtcbiAgICAgIHRoaXMuYWx3YXlzVGFrZU1pbmltdW1TcGFjZSA9IG5ld1ZhbHVlXG4gICAgICB0aGlzLnVwZGF0ZUhlaWdodCgpXG4gICAgfSkpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlKCdsaW50ZXIuZXJyb3JQYW5lbEhlaWdodCcsICh7bmV3VmFsdWV9KSA9PiB7XG4gICAgICB0aGlzLmVycm9yUGFuZWxIZWlnaHQgPSBuZXdWYWx1ZVxuICAgICAgdGhpcy51cGRhdGVIZWlnaHQoKVxuICAgIH0pKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSgnbGludGVyLnNob3dFcnJvclBhbmVsJywgKHtuZXdWYWx1ZX0pID0+IHtcbiAgICAgIHRoaXMuY29uZmlnVmlzaWJpbGl0eSA9IG5ld1ZhbHVlXG4gICAgICB0aGlzLnVwZGF0ZVZpc2liaWxpdHkoKVxuICAgIH0pKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLndvcmtzcGFjZS5vYnNlcnZlQWN0aXZlUGFuZUl0ZW0ocGFuZUl0ZW0gPT4ge1xuICAgICAgdGhpcy5wYW5lVmlzaWJpbGl0eSA9IHBhbmVJdGVtID09PSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgIHRoaXMudXBkYXRlVmlzaWJpbGl0eSgpXG4gICAgfSkpXG5cbiAgICAvLyBDb250YWluZXIgZm9yIG1lc3NhZ2VzIHdpdGggbm8gZmlsZVBhdGhcbiAgICBjb25zdCBkZWZhdWx0Q29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICB0aGlzLmVkaXRvck1lc3NhZ2VzLnNldChudWxsLCBkZWZhdWx0Q29udGFpbmVyKVxuICAgIHRoaXMubWVzc2FnZXNFbGVtZW50LmFwcGVuZENoaWxkKGRlZmF1bHRDb250YWluZXIpXG4gICAgaWYgKHNjb3BlICE9PSAnUHJvamVjdCcpIHtcbiAgICAgIGRlZmF1bHRDb250YWluZXIuc2V0QXR0cmlidXRlKCdoaWRkZW4nLCB0cnVlKVxuICAgIH1cbiAgfVxuICBzZXRNZXNzYWdlcyh7YWRkZWQsIHJlbW92ZWR9KSB7XG4gICAgaWYgKHJlbW92ZWQubGVuZ3RoKSB7XG4gICAgICB0aGlzLnJlbW92ZU1lc3NhZ2VzKHJlbW92ZWQpXG4gICAgfVxuICAgIGlmIChhZGRlZC5sZW5ndGgpIHtcbiAgICAgIGxldCBhY3RpdmVGaWxlID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICBhY3RpdmVGaWxlID0gYWN0aXZlRmlsZSA/IGFjdGl2ZUZpbGUuZ2V0UGF0aCgpIDogdW5kZWZpbmVkXG4gICAgICBhZGRlZC5mb3JFYWNoKG1lc3NhZ2UgPT4ge1xuICAgICAgICBpZiAoIXRoaXMuZWRpdG9yTWVzc2FnZXMuaGFzKG1lc3NhZ2UuZmlsZVBhdGgpKSB7XG4gICAgICAgICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICAgICAgICB0aGlzLmVkaXRvck1lc3NhZ2VzLnNldChtZXNzYWdlLmZpbGVQYXRoLCBjb250YWluZXIpXG4gICAgICAgICAgdGhpcy5tZXNzYWdlc0VsZW1lbnQuYXBwZW5kQ2hpbGQoY29udGFpbmVyKVxuICAgICAgICAgIGlmICghKHRoaXMuc2NvcGUgPT09ICdQcm9qZWN0JyB8fCBhY3RpdmVGaWxlID09PSBtZXNzYWdlLmZpbGVQYXRoKSkge1xuICAgICAgICAgICAgY29udGFpbmVyLnNldEF0dHJpYnV0ZSgnaGlkZGVuJywgdHJ1ZSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbWVzc2FnZUVsZW1lbnQgPSBNZXNzYWdlLmZyb21NZXNzYWdlKG1lc3NhZ2UpXG4gICAgICAgIHRoaXMubWVzc2FnZXMuc2V0KG1lc3NhZ2UsIG1lc3NhZ2VFbGVtZW50KVxuICAgICAgICB0aGlzLmVkaXRvck1lc3NhZ2VzLmdldChtZXNzYWdlLmZpbGVQYXRoKS5hcHBlbmRDaGlsZChtZXNzYWdlRWxlbWVudClcbiAgICAgICAgaWYgKG1lc3NhZ2VFbGVtZW50LnVwZGF0ZVZpc2liaWxpdHkodGhpcy5zY29wZSkudmlzaWJpbGl0eSkge1xuICAgICAgICAgIHRoaXMudmlzaWJsZU1lc3NhZ2VzKytcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICB0aGlzLmVkaXRvck1lc3NhZ2VzLmZvckVhY2goKGNoaWxkLCBrZXkpID0+IHtcbiAgICAgIC8vIE5ldmVyIGRlbGV0ZSB0aGUgZGVmYXVsdCBjb250YWluZXJcbiAgICAgIGlmIChrZXkgIT09IG51bGwgJiYgIWNoaWxkLmNoaWxkTm9kZXMubGVuZ3RoKSB7XG4gICAgICAgIGNoaWxkLnJlbW92ZSgpXG4gICAgICAgIHRoaXMuZWRpdG9yTWVzc2FnZXMuZGVsZXRlKGtleSlcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgdGhpcy51cGRhdGVWaXNpYmlsaXR5KClcbiAgfVxuICByZW1vdmVNZXNzYWdlcyhtZXNzYWdlcykge1xuICAgIG1lc3NhZ2VzLmZvckVhY2gobWVzc2FnZSA9PiB7XG4gICAgICBjb25zdCBtZXNzYWdlRWxlbWVudCA9IHRoaXMubWVzc2FnZXMuZ2V0KG1lc3NhZ2UpXG4gICAgICB0aGlzLm1lc3NhZ2VzLmRlbGV0ZShtZXNzYWdlKVxuICAgICAgbWVzc2FnZUVsZW1lbnQucmVtb3ZlKClcbiAgICAgIGlmIChtZXNzYWdlRWxlbWVudC52aXNpYmlsaXR5KSB7XG4gICAgICAgIHRoaXMudmlzaWJsZU1lc3NhZ2VzLS1cbiAgICAgIH1cbiAgICB9KVxuICB9XG4gIHJlZnJlc2goc2NvcGUpIHtcbiAgICBpZiAoc2NvcGUpIHtcbiAgICAgIHRoaXMuc2NvcGUgPSBzY29wZVxuICAgIH0gZWxzZSBzY29wZSA9IHRoaXMuc2NvcGVcbiAgICB0aGlzLnZpc2libGVNZXNzYWdlcyA9IDBcblxuICAgIHRoaXMubWVzc2FnZXMuZm9yRWFjaChtZXNzYWdlRWxlbWVudCA9PiB7XG4gICAgICBpZiAobWVzc2FnZUVsZW1lbnQudXBkYXRlVmlzaWJpbGl0eShzY29wZSkudmlzaWJpbGl0eSAmJiBzY29wZSA9PT0gJ0xpbmUnKSB7XG4gICAgICAgIHRoaXMudmlzaWJsZU1lc3NhZ2VzKytcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgaWYgKHNjb3BlID09PSAnRmlsZScpIHtcbiAgICAgIGxldCBhY3RpdmVGaWxlID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICBhY3RpdmVGaWxlID0gYWN0aXZlRmlsZSA/IGFjdGl2ZUZpbGUuZ2V0UGF0aCgpIDogdW5kZWZpbmVkXG4gICAgICB0aGlzLmVkaXRvck1lc3NhZ2VzLmZvckVhY2goKG1lc3NhZ2VzRWxlbWVudCwgZmlsZVBhdGgpID0+IHtcbiAgICAgICAgaWYgKGZpbGVQYXRoID09PSBhY3RpdmVGaWxlKSB7XG4gICAgICAgICAgbWVzc2FnZXNFbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgnaGlkZGVuJylcbiAgICAgICAgICB0aGlzLnZpc2libGVNZXNzYWdlcyA9IG1lc3NhZ2VzRWxlbWVudC5jaGlsZE5vZGVzLmxlbmd0aFxuICAgICAgICB9IGVsc2UgbWVzc2FnZXNFbGVtZW50LnNldEF0dHJpYnV0ZSgnaGlkZGVuJywgdHJ1ZSlcbiAgICAgIH0pXG4gICAgfSBlbHNlIGlmIChzY29wZSA9PT0gJ1Byb2plY3QnKSB7XG4gICAgICB0aGlzLnZpc2libGVNZXNzYWdlcyA9IHRoaXMubWVzc2FnZXMuc2l6ZVxuICAgICAgdGhpcy5lZGl0b3JNZXNzYWdlcy5mb3JFYWNoKG1lc3NhZ2VFbGVtZW50ID0+IHtcbiAgICAgICAgbWVzc2FnZUVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCdoaWRkZW4nKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICB0aGlzLnVwZGF0ZVZpc2liaWxpdHkoKVxuICB9XG4gIHVwZGF0ZUhlaWdodCgpIHtcbiAgICBsZXQgaGVpZ2h0ID0gdGhpcy5lcnJvclBhbmVsSGVpZ2h0XG5cbiAgICBpZiAodGhpcy5hbHdheXNUYWtlTWluaW11bVNwYWNlKSB7XG4gICAgICAvLyBBZGQgYDFweGAgZm9yIHRoZSB0b3AgYm9yZGVyLlxuICAgICAgaGVpZ2h0ID0gTWF0aC5taW4odGhpcy5tZXNzYWdlc0VsZW1lbnQuY2xpZW50SGVpZ2h0ICsgMSwgaGVpZ2h0KVxuICAgIH1cblxuICAgIHRoaXMubWVzc2FnZXNFbGVtZW50LnBhcmVudE5vZGUuc3R5bGUuaGVpZ2h0ID0gYCR7aGVpZ2h0fXB4YFxuICB9XG4gIGdldFZpc2liaWxpdHkoKSB7XG4gICAgcmV0dXJuIHRoaXMudmlzaWJpbGl0eVxuICB9XG4gIHVwZGF0ZVZpc2liaWxpdHkoKSB7XG4gICAgdGhpcy52aXNpYmlsaXR5ID0gdGhpcy5jb25maWdWaXNpYmlsaXR5ICYmIHRoaXMucGFuZVZpc2liaWxpdHkgJiYgdGhpcy52aXNpYmxlTWVzc2FnZXMgPiAwXG5cbiAgICBpZiAodGhpcy52aXNpYmlsaXR5KSB7XG4gICAgICB0aGlzLnBhbmVsLnNob3coKVxuICAgICAgdGhpcy51cGRhdGVIZWlnaHQoKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnBhbmVsLmhpZGUoKVxuICAgIH1cbiAgfVxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICB0aGlzLm1lc3NhZ2VzLmNsZWFyKClcbiAgICB0cnkge1xuICAgICAgdGhpcy5wYW5lbC5kZXN0cm95KClcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIC8vIEF0b20gZmFpbHMgd2VpcmRseSBzb21ldGltZXMgd2hlbiBkb2luZyB0aGlzXG4gICAgfVxuICB9XG59XG4iXX0=
//# sourceURL=/Users/ah/.atom/packages/linter/lib/ui/bottom-panel.js
