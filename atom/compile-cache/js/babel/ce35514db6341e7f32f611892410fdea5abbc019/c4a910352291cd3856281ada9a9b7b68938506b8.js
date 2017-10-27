Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _messageElement = require('./message-element');

'use babel';

var Interact = require('interact.js');
var Clipboard = undefined;
try {
  Clipboard = require('electron').clipboard;
} catch (_) {
  Clipboard = require('clipboard');
}

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL3VpL2JvdHRvbS1wYW5lbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztvQkFTa0MsTUFBTTs7OEJBQ2xCLG1CQUFtQjs7QUFWekMsV0FBVyxDQUFBOztBQUVYLElBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQTtBQUN2QyxJQUFJLFNBQVMsWUFBQSxDQUFBO0FBQ2IsSUFBSTtBQUNGLFdBQVMsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsU0FBUyxDQUFBO0NBQzFDLENBQUMsT0FBTyxDQUFDLEVBQUU7QUFDVixXQUFTLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFBO0NBQ2pDOztJQUlvQixXQUFXO0FBQ25CLFdBRFEsV0FBVyxDQUNsQixLQUFLLEVBQUU7OzswQkFEQSxXQUFXOztBQUU1QixRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF1QixDQUFBOztBQUU1QyxRQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQTtBQUN2QixRQUFJLENBQUMsZUFBZSxHQUFHLENBQUMsQ0FBQTtBQUN4QixRQUFJLENBQUMsc0JBQXNCLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsK0JBQStCLENBQUMsQ0FBQTtBQUM5RSxRQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMseUJBQXlCLENBQUMsQ0FBQTtBQUNsRSxRQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUMsQ0FBQTtBQUNoRSxRQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQTtBQUNsQixRQUFJLENBQUMsY0FBYyxHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7QUFDL0IsUUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBOztBQUV6QixRQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFBO0FBQ3RELFdBQU8sQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFBO0FBQ3ZCLFFBQUksQ0FBQyxlQUFlLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQTtBQUNwRCxXQUFPLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQTtBQUN6QyxRQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLEVBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUMsQ0FBQyxDQUFBO0FBQzFGLFlBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsRUFBQyxLQUFLLEVBQUUsRUFBQyxHQUFHLEVBQUUsSUFBSSxFQUFDLEVBQUMsQ0FBQyxDQUM5QyxFQUFFLENBQUMsWUFBWSxFQUFFLFVBQUEsS0FBSyxFQUFJO0FBQ3pCLFdBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBTSxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sT0FBSSxDQUFBO0tBQ3JELENBQUMsQ0FDRCxFQUFFLENBQUMsV0FBVyxFQUFFLFVBQUEsS0FBSyxFQUFJO0FBQ3hCLFVBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHlCQUF5QixFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUE7S0FDdEUsQ0FBQyxDQUFBO0FBQ0osV0FBTyxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxVQUFTLENBQUMsRUFBRTtBQUM5QyxVQUFJLENBQUMsQ0FBQyxLQUFLLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQyxPQUFPLEVBQUU7QUFDL0IsaUJBQVMsQ0FBQyxTQUFTLENBQUMsWUFBWSxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQTtPQUMvQztLQUNGLENBQUMsQ0FBQTs7QUFFRixRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQywrQkFBK0IsRUFBRSxVQUFDLElBQVUsRUFBSztVQUFkLFFBQVEsR0FBVCxJQUFVLENBQVQsUUFBUTs7QUFDeEYsWUFBSyxzQkFBc0IsR0FBRyxRQUFRLENBQUE7QUFDdEMsWUFBSyxZQUFZLEVBQUUsQ0FBQTtLQUNwQixDQUFDLENBQUMsQ0FBQTs7QUFFSCxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyx5QkFBeUIsRUFBRSxVQUFDLEtBQVUsRUFBSztVQUFkLFFBQVEsR0FBVCxLQUFVLENBQVQsUUFBUTs7QUFDbEYsWUFBSyxnQkFBZ0IsR0FBRyxRQUFRLENBQUE7QUFDaEMsWUFBSyxZQUFZLEVBQUUsQ0FBQTtLQUNwQixDQUFDLENBQUMsQ0FBQTs7QUFFSCxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyx1QkFBdUIsRUFBRSxVQUFDLEtBQVUsRUFBSztVQUFkLFFBQVEsR0FBVCxLQUFVLENBQVQsUUFBUTs7QUFDaEYsWUFBSyxnQkFBZ0IsR0FBRyxRQUFRLENBQUE7QUFDaEMsWUFBSyxnQkFBZ0IsRUFBRSxDQUFBO0tBQ3hCLENBQUMsQ0FBQyxDQUFBOztBQUVILFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMscUJBQXFCLENBQUMsVUFBQSxRQUFRLEVBQUk7QUFDdEUsWUFBSyxjQUFjLEdBQUcsUUFBUSxLQUFLLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQW1CLEVBQUUsQ0FBQTtBQUN2RSxZQUFLLGdCQUFnQixFQUFFLENBQUE7S0FDeEIsQ0FBQyxDQUFDLENBQUE7OztBQUdILFFBQU0sZ0JBQWdCLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQTtBQUN0RCxRQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQTtBQUMvQyxRQUFJLENBQUMsZUFBZSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO0FBQ2xELFFBQUksS0FBSyxLQUFLLFNBQVMsRUFBRTtBQUN2QixzQkFBZ0IsQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFBO0tBQzlDO0dBQ0Y7O2VBMURrQixXQUFXOztXQTJEbkIscUJBQUMsS0FBZ0IsRUFBRTs7O1VBQWpCLEtBQUssR0FBTixLQUFnQixDQUFmLEtBQUs7VUFBRSxPQUFPLEdBQWYsS0FBZ0IsQ0FBUixPQUFPOztBQUN6QixVQUFJLE9BQU8sQ0FBQyxNQUFNLEVBQUU7QUFDbEIsWUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQTtPQUM3QjtBQUNELFVBQUksS0FBSyxDQUFDLE1BQU0sRUFBRTs7QUFDaEIsY0FBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsRUFBRSxDQUFBO0FBQ3JELG9CQUFVLEdBQUcsVUFBVSxHQUFHLFVBQVUsQ0FBQyxPQUFPLEVBQUUsR0FBRyxTQUFTLENBQUE7QUFDMUQsZUFBSyxDQUFDLE9BQU8sQ0FBQyxVQUFBLE9BQU8sRUFBSTtBQUN2QixnQkFBSSxDQUFDLE9BQUssY0FBYyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUU7QUFDOUMsa0JBQU0sU0FBUyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDL0MscUJBQUssY0FBYyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFBO0FBQ3BELHFCQUFLLGVBQWUsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUE7QUFDM0Msa0JBQUksRUFBRSxPQUFLLEtBQUssS0FBSyxTQUFTLElBQUksVUFBVSxLQUFLLE9BQU8sQ0FBQyxRQUFRLENBQUEsQUFBQyxFQUFFO0FBQ2xFLHlCQUFTLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQTtlQUN2QzthQUNGO0FBQ0QsZ0JBQU0sY0FBYyxHQUFHLHdCQUFRLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUNuRCxtQkFBSyxRQUFRLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxjQUFjLENBQUMsQ0FBQTtBQUMxQyxtQkFBSyxjQUFjLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLENBQUE7QUFDckUsZ0JBQUksY0FBYyxDQUFDLGdCQUFnQixDQUFDLE9BQUssS0FBSyxDQUFDLENBQUMsVUFBVSxFQUFFO0FBQzFELHFCQUFLLGVBQWUsRUFBRSxDQUFBO2FBQ3ZCO1dBQ0YsQ0FBQyxDQUFBOztPQUNIOztBQUVELFVBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBSzs7QUFFMUMsWUFBSSxHQUFHLEtBQUssSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUU7QUFDNUMsZUFBSyxDQUFDLE1BQU0sRUFBRSxDQUFBO0FBQ2QsaUJBQUssY0FBYyxVQUFPLENBQUMsR0FBRyxDQUFDLENBQUE7U0FDaEM7T0FDRixDQUFDLENBQUE7O0FBRUYsVUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUE7S0FDeEI7OztXQUNhLHdCQUFDLFFBQVEsRUFBRTs7O0FBQ3ZCLGNBQVEsQ0FBQyxPQUFPLENBQUMsVUFBQSxPQUFPLEVBQUk7QUFDMUIsWUFBTSxjQUFjLEdBQUcsT0FBSyxRQUFRLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQ2pELGVBQUssUUFBUSxVQUFPLENBQUMsT0FBTyxDQUFDLENBQUE7QUFDN0Isc0JBQWMsQ0FBQyxNQUFNLEVBQUUsQ0FBQTtBQUN2QixZQUFJLGNBQWMsQ0FBQyxVQUFVLEVBQUU7QUFDN0IsaUJBQUssZUFBZSxFQUFFLENBQUE7U0FDdkI7T0FDRixDQUFDLENBQUE7S0FDSDs7O1dBQ00saUJBQUMsS0FBSyxFQUFFOzs7QUFDYixVQUFJLEtBQUssRUFBRTtBQUNULFlBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFBO09BQ25CLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUE7QUFDekIsVUFBSSxDQUFDLGVBQWUsR0FBRyxDQUFDLENBQUE7O0FBRXhCLFVBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUEsY0FBYyxFQUFJO0FBQ3RDLFlBQUksY0FBYyxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDLFVBQVUsSUFBSSxLQUFLLEtBQUssTUFBTSxFQUFFO0FBQ3pFLGlCQUFLLGVBQWUsRUFBRSxDQUFBO1NBQ3ZCO09BQ0YsQ0FBQyxDQUFBOztBQUVGLFVBQUksS0FBSyxLQUFLLE1BQU0sRUFBRTs7QUFDcEIsY0FBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsRUFBRSxDQUFBO0FBQ3JELG9CQUFVLEdBQUcsVUFBVSxHQUFHLFVBQVUsQ0FBQyxPQUFPLEVBQUUsR0FBRyxTQUFTLENBQUE7QUFDMUQsaUJBQUssY0FBYyxDQUFDLE9BQU8sQ0FBQyxVQUFDLGVBQWUsRUFBRSxRQUFRLEVBQUs7QUFDekQsZ0JBQUksUUFBUSxLQUFLLFVBQVUsRUFBRTtBQUMzQiw2QkFBZSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUN6QyxxQkFBSyxlQUFlLEdBQUcsZUFBZSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUE7YUFDekQsTUFBTSxlQUFlLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQTtXQUNwRCxDQUFDLENBQUE7O09BQ0gsTUFBTSxJQUFJLEtBQUssS0FBSyxTQUFTLEVBQUU7QUFDOUIsWUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQTtBQUN6QyxZQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxVQUFBLGNBQWMsRUFBSTtBQUM1Qyx3QkFBYyxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQTtTQUN6QyxDQUFDLENBQUE7T0FDSDs7QUFFRCxVQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQTtLQUN4Qjs7O1dBQ1csd0JBQUc7QUFDYixVQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUE7O0FBRWxDLFVBQUksSUFBSSxDQUFDLHNCQUFzQixFQUFFOztBQUUvQixjQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLFlBQVksR0FBRyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUE7T0FDakU7O0FBRUQsVUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBTSxNQUFNLE9BQUksQ0FBQTtLQUM3RDs7O1dBQ1kseUJBQUc7QUFDZCxhQUFPLElBQUksQ0FBQyxVQUFVLENBQUE7S0FDdkI7OztXQUNlLDRCQUFHO0FBQ2pCLFVBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixJQUFJLElBQUksQ0FBQyxjQUFjLElBQUksSUFBSSxDQUFDLGVBQWUsR0FBRyxDQUFDLENBQUE7O0FBRTFGLFVBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtBQUNuQixZQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFBO0FBQ2pCLFlBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQTtPQUNwQixNQUFNO0FBQ0wsWUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQTtPQUNsQjtLQUNGOzs7V0FDTSxtQkFBRztBQUNSLFVBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDNUIsVUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtBQUNyQixVQUFJO0FBQ0YsWUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQTtPQUNyQixDQUFDLE9BQU8sR0FBRyxFQUFFOztPQUViO0tBQ0Y7OztTQXJLa0IsV0FBVzs7O3FCQUFYLFdBQVciLCJmaWxlIjoiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvdWkvYm90dG9tLXBhbmVsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuY29uc3QgSW50ZXJhY3QgPSByZXF1aXJlKCdpbnRlcmFjdC5qcycpXG5sZXQgQ2xpcGJvYXJkXG50cnkge1xuICBDbGlwYm9hcmQgPSByZXF1aXJlKCdlbGVjdHJvbicpLmNsaXBib2FyZFxufSBjYXRjaCAoXykge1xuICBDbGlwYm9hcmQgPSByZXF1aXJlKCdjbGlwYm9hcmQnKVxufVxuaW1wb3J0IHtDb21wb3NpdGVEaXNwb3NhYmxlfSBmcm9tICdhdG9tJ1xuaW1wb3J0IHtNZXNzYWdlfSBmcm9tICcuL21lc3NhZ2UtZWxlbWVudCdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQm90dG9tUGFuZWwge1xuICBjb25zdHJ1Y3RvcihzY29wZSkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG5cbiAgICB0aGlzLnZpc2liaWxpdHkgPSBmYWxzZVxuICAgIHRoaXMudmlzaWJsZU1lc3NhZ2VzID0gMFxuICAgIHRoaXMuYWx3YXlzVGFrZU1pbmltdW1TcGFjZSA9IGF0b20uY29uZmlnLmdldCgnbGludGVyLmFsd2F5c1Rha2VNaW5pbXVtU3BhY2UnKVxuICAgIHRoaXMuZXJyb3JQYW5lbEhlaWdodCA9IGF0b20uY29uZmlnLmdldCgnbGludGVyLmVycm9yUGFuZWxIZWlnaHQnKVxuICAgIHRoaXMuY29uZmlnVmlzaWJpbGl0eSA9IGF0b20uY29uZmlnLmdldCgnbGludGVyLnNob3dFcnJvclBhbmVsJylcbiAgICB0aGlzLnNjb3BlID0gc2NvcGVcbiAgICB0aGlzLmVkaXRvck1lc3NhZ2VzID0gbmV3IE1hcCgpXG4gICAgdGhpcy5tZXNzYWdlcyA9IG5ldyBNYXAoKVxuXG4gICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpbnRlci1wYW5lbCcpIC8vIFRPRE8oc3RlZWxicmFpbik6IE1ha2UgdGhpcyBhIGBkaXZgXG4gICAgZWxlbWVudC50YWJJbmRleCA9ICctMSdcbiAgICB0aGlzLm1lc3NhZ2VzRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLm1lc3NhZ2VzRWxlbWVudClcbiAgICB0aGlzLnBhbmVsID0gYXRvbS53b3Jrc3BhY2UuYWRkQm90dG9tUGFuZWwoe2l0ZW06IGVsZW1lbnQsIHZpc2libGU6IGZhbHNlLCBwcmlvcml0eTogNTAwfSlcbiAgICBJbnRlcmFjdChlbGVtZW50KS5yZXNpemFibGUoe2VkZ2VzOiB7dG9wOiB0cnVlfX0pXG4gICAgICAub24oJ3Jlc2l6ZW1vdmUnLCBldmVudCA9PiB7XG4gICAgICAgIGV2ZW50LnRhcmdldC5zdHlsZS5oZWlnaHQgPSBgJHtldmVudC5yZWN0LmhlaWdodH1weGBcbiAgICAgIH0pXG4gICAgICAub24oJ3Jlc2l6ZWVuZCcsIGV2ZW50ID0+IHtcbiAgICAgICAgYXRvbS5jb25maWcuc2V0KCdsaW50ZXIuZXJyb3JQYW5lbEhlaWdodCcsIGV2ZW50LnRhcmdldC5jbGllbnRIZWlnaHQpXG4gICAgICB9KVxuICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGZ1bmN0aW9uKGUpIHtcbiAgICAgIGlmIChlLndoaWNoID09PSA2NyAmJiBlLmN0cmxLZXkpIHtcbiAgICAgICAgQ2xpcGJvYXJkLndyaXRlVGV4dChnZXRTZWxlY3Rpb24oKS50b1N0cmluZygpKVxuICAgICAgfVxuICAgIH0pXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlKCdsaW50ZXIuYWx3YXlzVGFrZU1pbmltdW1TcGFjZScsICh7bmV3VmFsdWV9KSA9PiB7XG4gICAgICB0aGlzLmFsd2F5c1Rha2VNaW5pbXVtU3BhY2UgPSBuZXdWYWx1ZVxuICAgICAgdGhpcy51cGRhdGVIZWlnaHQoKVxuICAgIH0pKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSgnbGludGVyLmVycm9yUGFuZWxIZWlnaHQnLCAoe25ld1ZhbHVlfSkgPT4ge1xuICAgICAgdGhpcy5lcnJvclBhbmVsSGVpZ2h0ID0gbmV3VmFsdWVcbiAgICAgIHRoaXMudXBkYXRlSGVpZ2h0KClcbiAgICB9KSlcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub25EaWRDaGFuZ2UoJ2xpbnRlci5zaG93RXJyb3JQYW5lbCcsICh7bmV3VmFsdWV9KSA9PiB7XG4gICAgICB0aGlzLmNvbmZpZ1Zpc2liaWxpdHkgPSBuZXdWYWx1ZVxuICAgICAgdGhpcy51cGRhdGVWaXNpYmlsaXR5KClcbiAgICB9KSlcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZUFjdGl2ZVBhbmVJdGVtKHBhbmVJdGVtID0+IHtcbiAgICAgIHRoaXMucGFuZVZpc2liaWxpdHkgPSBwYW5lSXRlbSA9PT0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICB0aGlzLnVwZGF0ZVZpc2liaWxpdHkoKVxuICAgIH0pKVxuXG4gICAgLy8gQ29udGFpbmVyIGZvciBtZXNzYWdlcyB3aXRoIG5vIGZpbGVQYXRoXG4gICAgY29uc3QgZGVmYXVsdENvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgdGhpcy5lZGl0b3JNZXNzYWdlcy5zZXQobnVsbCwgZGVmYXVsdENvbnRhaW5lcilcbiAgICB0aGlzLm1lc3NhZ2VzRWxlbWVudC5hcHBlbmRDaGlsZChkZWZhdWx0Q29udGFpbmVyKVxuICAgIGlmIChzY29wZSAhPT0gJ1Byb2plY3QnKSB7XG4gICAgICBkZWZhdWx0Q29udGFpbmVyLnNldEF0dHJpYnV0ZSgnaGlkZGVuJywgdHJ1ZSlcbiAgICB9XG4gIH1cbiAgc2V0TWVzc2FnZXMoe2FkZGVkLCByZW1vdmVkfSkge1xuICAgIGlmIChyZW1vdmVkLmxlbmd0aCkge1xuICAgICAgdGhpcy5yZW1vdmVNZXNzYWdlcyhyZW1vdmVkKVxuICAgIH1cbiAgICBpZiAoYWRkZWQubGVuZ3RoKSB7XG4gICAgICBsZXQgYWN0aXZlRmlsZSA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgICAgYWN0aXZlRmlsZSA9IGFjdGl2ZUZpbGUgPyBhY3RpdmVGaWxlLmdldFBhdGgoKSA6IHVuZGVmaW5lZFxuICAgICAgYWRkZWQuZm9yRWFjaChtZXNzYWdlID0+IHtcbiAgICAgICAgaWYgKCF0aGlzLmVkaXRvck1lc3NhZ2VzLmhhcyhtZXNzYWdlLmZpbGVQYXRoKSkge1xuICAgICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgICAgICAgdGhpcy5lZGl0b3JNZXNzYWdlcy5zZXQobWVzc2FnZS5maWxlUGF0aCwgY29udGFpbmVyKVxuICAgICAgICAgIHRoaXMubWVzc2FnZXNFbGVtZW50LmFwcGVuZENoaWxkKGNvbnRhaW5lcilcbiAgICAgICAgICBpZiAoISh0aGlzLnNjb3BlID09PSAnUHJvamVjdCcgfHwgYWN0aXZlRmlsZSA9PT0gbWVzc2FnZS5maWxlUGF0aCkpIHtcbiAgICAgICAgICAgIGNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoJ2hpZGRlbicsIHRydWUpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG1lc3NhZ2VFbGVtZW50ID0gTWVzc2FnZS5mcm9tTWVzc2FnZShtZXNzYWdlKVxuICAgICAgICB0aGlzLm1lc3NhZ2VzLnNldChtZXNzYWdlLCBtZXNzYWdlRWxlbWVudClcbiAgICAgICAgdGhpcy5lZGl0b3JNZXNzYWdlcy5nZXQobWVzc2FnZS5maWxlUGF0aCkuYXBwZW5kQ2hpbGQobWVzc2FnZUVsZW1lbnQpXG4gICAgICAgIGlmIChtZXNzYWdlRWxlbWVudC51cGRhdGVWaXNpYmlsaXR5KHRoaXMuc2NvcGUpLnZpc2liaWxpdHkpIHtcbiAgICAgICAgICB0aGlzLnZpc2libGVNZXNzYWdlcysrXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgdGhpcy5lZGl0b3JNZXNzYWdlcy5mb3JFYWNoKChjaGlsZCwga2V5KSA9PiB7XG4gICAgICAvLyBOZXZlciBkZWxldGUgdGhlIGRlZmF1bHQgY29udGFpbmVyXG4gICAgICBpZiAoa2V5ICE9PSBudWxsICYmICFjaGlsZC5jaGlsZE5vZGVzLmxlbmd0aCkge1xuICAgICAgICBjaGlsZC5yZW1vdmUoKVxuICAgICAgICB0aGlzLmVkaXRvck1lc3NhZ2VzLmRlbGV0ZShrZXkpXG4gICAgICB9XG4gICAgfSlcblxuICAgIHRoaXMudXBkYXRlVmlzaWJpbGl0eSgpXG4gIH1cbiAgcmVtb3ZlTWVzc2FnZXMobWVzc2FnZXMpIHtcbiAgICBtZXNzYWdlcy5mb3JFYWNoKG1lc3NhZ2UgPT4ge1xuICAgICAgY29uc3QgbWVzc2FnZUVsZW1lbnQgPSB0aGlzLm1lc3NhZ2VzLmdldChtZXNzYWdlKVxuICAgICAgdGhpcy5tZXNzYWdlcy5kZWxldGUobWVzc2FnZSlcbiAgICAgIG1lc3NhZ2VFbGVtZW50LnJlbW92ZSgpXG4gICAgICBpZiAobWVzc2FnZUVsZW1lbnQudmlzaWJpbGl0eSkge1xuICAgICAgICB0aGlzLnZpc2libGVNZXNzYWdlcy0tXG4gICAgICB9XG4gICAgfSlcbiAgfVxuICByZWZyZXNoKHNjb3BlKSB7XG4gICAgaWYgKHNjb3BlKSB7XG4gICAgICB0aGlzLnNjb3BlID0gc2NvcGVcbiAgICB9IGVsc2Ugc2NvcGUgPSB0aGlzLnNjb3BlXG4gICAgdGhpcy52aXNpYmxlTWVzc2FnZXMgPSAwXG5cbiAgICB0aGlzLm1lc3NhZ2VzLmZvckVhY2gobWVzc2FnZUVsZW1lbnQgPT4ge1xuICAgICAgaWYgKG1lc3NhZ2VFbGVtZW50LnVwZGF0ZVZpc2liaWxpdHkoc2NvcGUpLnZpc2liaWxpdHkgJiYgc2NvcGUgPT09ICdMaW5lJykge1xuICAgICAgICB0aGlzLnZpc2libGVNZXNzYWdlcysrXG4gICAgICB9XG4gICAgfSlcblxuICAgIGlmIChzY29wZSA9PT0gJ0ZpbGUnKSB7XG4gICAgICBsZXQgYWN0aXZlRmlsZSA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgICAgYWN0aXZlRmlsZSA9IGFjdGl2ZUZpbGUgPyBhY3RpdmVGaWxlLmdldFBhdGgoKSA6IHVuZGVmaW5lZFxuICAgICAgdGhpcy5lZGl0b3JNZXNzYWdlcy5mb3JFYWNoKChtZXNzYWdlc0VsZW1lbnQsIGZpbGVQYXRoKSA9PiB7XG4gICAgICAgIGlmIChmaWxlUGF0aCA9PT0gYWN0aXZlRmlsZSkge1xuICAgICAgICAgIG1lc3NhZ2VzRWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoJ2hpZGRlbicpXG4gICAgICAgICAgdGhpcy52aXNpYmxlTWVzc2FnZXMgPSBtZXNzYWdlc0VsZW1lbnQuY2hpbGROb2Rlcy5sZW5ndGhcbiAgICAgICAgfSBlbHNlIG1lc3NhZ2VzRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2hpZGRlbicsIHRydWUpXG4gICAgICB9KVxuICAgIH0gZWxzZSBpZiAoc2NvcGUgPT09ICdQcm9qZWN0Jykge1xuICAgICAgdGhpcy52aXNpYmxlTWVzc2FnZXMgPSB0aGlzLm1lc3NhZ2VzLnNpemVcbiAgICAgIHRoaXMuZWRpdG9yTWVzc2FnZXMuZm9yRWFjaChtZXNzYWdlRWxlbWVudCA9PiB7XG4gICAgICAgIG1lc3NhZ2VFbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgnaGlkZGVuJylcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgdGhpcy51cGRhdGVWaXNpYmlsaXR5KClcbiAgfVxuICB1cGRhdGVIZWlnaHQoKSB7XG4gICAgbGV0IGhlaWdodCA9IHRoaXMuZXJyb3JQYW5lbEhlaWdodFxuXG4gICAgaWYgKHRoaXMuYWx3YXlzVGFrZU1pbmltdW1TcGFjZSkge1xuICAgICAgLy8gQWRkIGAxcHhgIGZvciB0aGUgdG9wIGJvcmRlci5cbiAgICAgIGhlaWdodCA9IE1hdGgubWluKHRoaXMubWVzc2FnZXNFbGVtZW50LmNsaWVudEhlaWdodCArIDEsIGhlaWdodClcbiAgICB9XG5cbiAgICB0aGlzLm1lc3NhZ2VzRWxlbWVudC5wYXJlbnROb2RlLnN0eWxlLmhlaWdodCA9IGAke2hlaWdodH1weGBcbiAgfVxuICBnZXRWaXNpYmlsaXR5KCkge1xuICAgIHJldHVybiB0aGlzLnZpc2liaWxpdHlcbiAgfVxuICB1cGRhdGVWaXNpYmlsaXR5KCkge1xuICAgIHRoaXMudmlzaWJpbGl0eSA9IHRoaXMuY29uZmlnVmlzaWJpbGl0eSAmJiB0aGlzLnBhbmVWaXNpYmlsaXR5ICYmIHRoaXMudmlzaWJsZU1lc3NhZ2VzID4gMFxuXG4gICAgaWYgKHRoaXMudmlzaWJpbGl0eSkge1xuICAgICAgdGhpcy5wYW5lbC5zaG93KClcbiAgICAgIHRoaXMudXBkYXRlSGVpZ2h0KClcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wYW5lbC5oaWRlKClcbiAgICB9XG4gIH1cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgdGhpcy5tZXNzYWdlcy5jbGVhcigpXG4gICAgdHJ5IHtcbiAgICAgIHRoaXMucGFuZWwuZGVzdHJveSgpXG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAvLyBBdG9tIGZhaWxzIHdlaXJkbHkgc29tZXRpbWVzIHdoZW4gZG9pbmcgdGhpc1xuICAgIH1cbiAgfVxufVxuIl19
//# sourceURL=/Users/ah/.atom/packages/linter/lib/ui/bottom-panel.js
