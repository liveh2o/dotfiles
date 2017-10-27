Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _helpers = require('./helpers');

var _helpers2 = _interopRequireDefault(_helpers);

'use babel';

var EditorLinter = (function () {
  function EditorLinter(editor) {
    var _this = this;

    _classCallCheck(this, EditorLinter);

    if (typeof editor !== 'object' || typeof editor.markBufferRange !== 'function') {
      throw new Error('Given editor is not really an editor');
    }

    this.editor = editor;
    this.emitter = new _atom.Emitter();
    this.messages = new Set();
    this.markers = new Map();
    this.subscriptions = new _atom.CompositeDisposable();
    this.gutter = null;
    this.countLineMessages = 0;

    this.subscriptions.add(atom.config.observe('linter.underlineIssues', function (underlineIssues) {
      return _this.underlineIssues = underlineIssues;
    }));
    this.subscriptions.add(atom.config.observe('linter.showErrorInline', function (showBubble) {
      return _this.showBubble = showBubble;
    }));
    this.subscriptions.add(this.editor.onDidDestroy(function () {
      return _this.dispose();
    }));
    this.subscriptions.add(this.editor.onDidSave(function () {
      return _this.emitter.emit('should-lint', false);
    }));
    this.subscriptions.add(this.editor.onDidChangeCursorPosition(function (_ref) {
      var oldBufferPosition = _ref.oldBufferPosition;
      var newBufferPosition = _ref.newBufferPosition;

      if (newBufferPosition.row !== oldBufferPosition.row) {
        _this.calculateLineMessages(newBufferPosition.row);
      }
      _this.emitter.emit('should-update-bubble');
    }));
    this.subscriptions.add(atom.config.observe('linter.gutterEnabled', function (gutterEnabled) {
      _this.gutterEnabled = gutterEnabled;
      _this.handleGutter();
    }));
    // Using onDidChange instead of observe here 'cause the same function is invoked above
    this.subscriptions.add(atom.config.onDidChange('linter.gutterPosition', function () {
      return _this.handleGutter();
    }));
    this.subscriptions.add(this.onDidMessageAdd(function (message) {
      if (!_this.underlineIssues && !_this.gutterEnabled && !_this.showBubble || !message.range) {
        return; // No-Op
      }
      var marker = _this.editor.getBuffer().markRange(message.range, { invalidate: 'inside' });
      marker.onDidChange(function (_ref2) {
        var oldHeadPosition = _ref2.oldHeadPosition;
        var newHeadPosition = _ref2.newHeadPosition;
        var isValid = _ref2.isValid;

        if (isValid && (oldHeadPosition.row !== 0 || newHeadPosition.row === 0)) {
          message.range = marker.previousEventState.range;
          message.key = _helpers2['default'].messageKey(message);
        }
      });
      _this.markers.set(message, marker);
      if (_this.underlineIssues) {
        _this.editor.decorateMarker(marker, {
          type: 'highlight',
          'class': 'linter-highlight ' + message['class']
        });
      }
      if (_this.gutterEnabled) {
        var item = document.createElement('span');
        item.className = 'linter-gutter linter-highlight ' + message['class'];
        _this.gutter.decorateMarker(marker, {
          'class': 'linter-row',
          item: item
        });
      }
    }));
    this.subscriptions.add(this.onDidMessageDelete(function (message) {
      if (_this.markers.has(message)) {
        _this.markers.get(message).destroy();
        _this.markers['delete'](message);
      }
    }));

    // TODO: Atom invokes onDid{Change, StopChanging} callbacks immediately. Workaround it
    atom.config.observe('linter.lintOnFlyInterval', function (interval) {
      if (_this.changeSubscription) {
        _this.changeSubscription.dispose();
      }
      _this.changeSubscription = _this.editor.onDidChange(_helpers2['default'].debounce(function () {
        _this.emitter.emit('should-lint', true);
      }, interval));
    });

    this.active = true;
  }

  _createClass(EditorLinter, [{
    key: 'handleGutter',
    value: function handleGutter() {
      if (this.gutter !== null) {
        this.removeGutter();
      }
      if (this.gutterEnabled) {
        this.addGutter();
      }
    }
  }, {
    key: 'addGutter',
    value: function addGutter() {
      var position = atom.config.get('linter.gutterPosition');
      this.gutter = this.editor.addGutter({
        name: 'linter',
        priority: position === 'Left' ? -100 : 100
      });
    }
  }, {
    key: 'removeGutter',
    value: function removeGutter() {
      if (this.gutter !== null) {
        try {
          // Atom throws when we try to remove a gutter container from a closed text editor
          this.gutter.destroy();
        } catch (err) {}
        this.gutter = null;
      }
    }
  }, {
    key: 'getMessages',
    value: function getMessages() {
      return this.messages;
    }
  }, {
    key: 'addMessage',
    value: function addMessage(message) {
      if (!this.messages.has(message)) {
        if (this.active) {
          message.currentFile = true;
        }
        this.messages.add(message);
        this.emitter.emit('did-message-add', message);
        this.emitter.emit('did-message-change', { message: message, type: 'add' });
      }
    }
  }, {
    key: 'deleteMessage',
    value: function deleteMessage(message) {
      if (this.messages.has(message)) {
        this.messages['delete'](message);
        this.emitter.emit('did-message-delete', message);
        this.emitter.emit('did-message-change', { message: message, type: 'delete' });
      }
    }
  }, {
    key: 'calculateLineMessages',
    value: function calculateLineMessages(row) {
      var _this2 = this;

      if (atom.config.get('linter.showErrorTabLine')) {
        if (row === null) {
          row = this.editor.getCursorBufferPosition().row;
        }
        this.countLineMessages = 0;
        this.messages.forEach(function (message) {
          if (message.currentLine = message.range && message.range.intersectsRow(row)) {
            _this2.countLineMessages++;
          }
        });
      } else {
        this.countLineMessages = 0;
      }
      this.emitter.emit('did-calculate-line-messages', this.countLineMessages);
      return this.countLineMessages;
    }
  }, {
    key: 'lint',
    value: function lint() {
      var onChange = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

      this.emitter.emit('should-lint', onChange);
    }
  }, {
    key: 'onDidMessageAdd',
    value: function onDidMessageAdd(callback) {
      return this.emitter.on('did-message-add', callback);
    }
  }, {
    key: 'onDidMessageDelete',
    value: function onDidMessageDelete(callback) {
      return this.emitter.on('did-message-delete', callback);
    }
  }, {
    key: 'onDidMessageChange',
    value: function onDidMessageChange(callback) {
      return this.emitter.on('did-message-change', callback);
    }
  }, {
    key: 'onDidCalculateLineMessages',
    value: function onDidCalculateLineMessages(callback) {
      return this.emitter.on('did-calculate-line-messages', callback);
    }
  }, {
    key: 'onShouldUpdateBubble',
    value: function onShouldUpdateBubble(callback) {
      return this.emitter.on('should-update-bubble', callback);
    }
  }, {
    key: 'onShouldLint',
    value: function onShouldLint(callback) {
      return this.emitter.on('should-lint', callback);
    }
  }, {
    key: 'onDidDestroy',
    value: function onDidDestroy(callback) {
      return this.emitter.on('did-destroy', callback);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.emitter.emit('did-destroy');
      if (this.markers.size) {
        this.markers.forEach(function (marker) {
          return marker.destroy();
        });
        this.markers.clear();
      }
      this.removeGutter();
      this.subscriptions.dispose();
      if (this.changeSubscription) {
        this.changeSubscription.dispose();
      }
      this.emitter.dispose();
      this.messages.clear();
    }
  }, {
    key: 'active',
    set: function set(value) {
      value = Boolean(value);
      if (value !== this._active) {
        this._active = value;
        if (this.messages.size) {
          this.messages.forEach(function (message) {
            return message.currentFile = value;
          });
        }
      }
    },
    get: function get() {
      return this._active;
    }
  }]);

  return EditorLinter;
})();

exports['default'] = EditorLinter;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL2VkaXRvci1saW50ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztvQkFFMkMsTUFBTTs7dUJBQzdCLFdBQVc7Ozs7QUFIL0IsV0FBVyxDQUFBOztJQUtVLFlBQVk7QUFDcEIsV0FEUSxZQUFZLENBQ25CLE1BQU0sRUFBRTs7OzBCQURELFlBQVk7O0FBRTdCLFFBQUksT0FBTyxNQUFNLEtBQUssUUFBUSxJQUFJLE9BQU8sTUFBTSxDQUFDLGVBQWUsS0FBSyxVQUFVLEVBQUU7QUFDOUUsWUFBTSxJQUFJLEtBQUssQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFBO0tBQ3hEOztBQUVELFFBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFBO0FBQ3BCLFFBQUksQ0FBQyxPQUFPLEdBQUcsbUJBQWEsQ0FBQTtBQUM1QixRQUFJLENBQUMsUUFBUSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7QUFDekIsUUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBO0FBQ3hCLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXVCLENBQUE7QUFDNUMsUUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUE7QUFDbEIsUUFBSSxDQUFDLGlCQUFpQixHQUFHLENBQUMsQ0FBQTs7QUFFMUIsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsd0JBQXdCLEVBQUUsVUFBQSxlQUFlO2FBQ2xGLE1BQUssZUFBZSxHQUFHLGVBQWU7S0FBQSxDQUN2QyxDQUFDLENBQUE7QUFDRixRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyx3QkFBd0IsRUFBRSxVQUFBLFVBQVU7YUFDN0UsTUFBSyxVQUFVLEdBQUcsVUFBVTtLQUFBLENBQzdCLENBQUMsQ0FBQTtBQUNGLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDO2FBQzlDLE1BQUssT0FBTyxFQUFFO0tBQUEsQ0FDZixDQUFDLENBQUE7QUFDRixRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQzthQUMzQyxNQUFLLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLEtBQUssQ0FBQztLQUFBLENBQ3hDLENBQUMsQ0FBQTtBQUNGLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMseUJBQXlCLENBQUMsVUFBQyxJQUFzQyxFQUFLO1VBQTFDLGlCQUFpQixHQUFsQixJQUFzQyxDQUFyQyxpQkFBaUI7VUFBRSxpQkFBaUIsR0FBckMsSUFBc0MsQ0FBbEIsaUJBQWlCOztBQUNqRyxVQUFJLGlCQUFpQixDQUFDLEdBQUcsS0FBSyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUU7QUFDbkQsY0FBSyxxQkFBcUIsQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsQ0FBQTtPQUNsRDtBQUNELFlBQUssT0FBTyxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFBO0tBQzFDLENBQUMsQ0FBQyxDQUFBO0FBQ0gsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsc0JBQXNCLEVBQUUsVUFBQSxhQUFhLEVBQUk7QUFDbEYsWUFBSyxhQUFhLEdBQUcsYUFBYSxDQUFBO0FBQ2xDLFlBQUssWUFBWSxFQUFFLENBQUE7S0FDcEIsQ0FBQyxDQUFDLENBQUE7O0FBRUgsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsdUJBQXVCLEVBQUU7YUFDdEUsTUFBSyxZQUFZLEVBQUU7S0FBQSxDQUNwQixDQUFDLENBQUE7QUFDRixRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLFVBQUEsT0FBTyxFQUFJO0FBQ3JELFVBQUksQ0FBQyxNQUFLLGVBQWUsSUFBSSxDQUFDLE1BQUssYUFBYSxJQUFJLENBQUMsTUFBSyxVQUFVLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFO0FBQ3RGLGVBQU07T0FDUDtBQUNELFVBQU0sTUFBTSxHQUFHLE1BQUssTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUMsVUFBVSxFQUFFLFFBQVEsRUFBQyxDQUFDLENBQUE7QUFDdkYsWUFBTSxDQUFDLFdBQVcsQ0FBQyxVQUFDLEtBQTZDLEVBQUs7WUFBaEQsZUFBZSxHQUFqQixLQUE2QyxDQUEzQyxlQUFlO1lBQUUsZUFBZSxHQUFsQyxLQUE2QyxDQUExQixlQUFlO1lBQUUsT0FBTyxHQUEzQyxLQUE2QyxDQUFULE9BQU87O0FBQzdELFlBQUksT0FBTyxLQUFLLGVBQWUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxJQUFJLGVBQWUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFBLEFBQUMsRUFBRTtBQUN2RSxpQkFBTyxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFBO0FBQy9DLGlCQUFPLENBQUMsR0FBRyxHQUFHLHFCQUFRLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQTtTQUMxQztPQUNGLENBQUMsQ0FBQTtBQUNGLFlBQUssT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUE7QUFDakMsVUFBSSxNQUFLLGVBQWUsRUFBRTtBQUN4QixjQUFLLE1BQU0sQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFO0FBQ2pDLGNBQUksRUFBRSxXQUFXO0FBQ2pCLHlDQUEyQixPQUFPLFNBQU0sQUFBRTtTQUMzQyxDQUFDLENBQUE7T0FDSDtBQUNELFVBQUksTUFBSyxhQUFhLEVBQUU7QUFDdEIsWUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUMzQyxZQUFJLENBQUMsU0FBUyx1Q0FBcUMsT0FBTyxTQUFNLEFBQUUsQ0FBQTtBQUNsRSxjQUFLLE1BQU0sQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFO0FBQ2pDLG1CQUFPLFlBQVk7QUFDbkIsY0FBSSxFQUFKLElBQUk7U0FDTCxDQUFDLENBQUE7T0FDSDtLQUNGLENBQUMsQ0FBQyxDQUFBO0FBQ0gsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFVBQUEsT0FBTyxFQUFJO0FBQ3hELFVBQUksTUFBSyxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQzdCLGNBQUssT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUNuQyxjQUFLLE9BQU8sVUFBTyxDQUFDLE9BQU8sQ0FBQyxDQUFBO09BQzdCO0tBQ0YsQ0FBQyxDQUFDLENBQUE7OztBQUdILFFBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLDBCQUEwQixFQUFFLFVBQUMsUUFBUSxFQUFLO0FBQzVELFVBQUksTUFBSyxrQkFBa0IsRUFBRTtBQUMzQixjQUFLLGtCQUFrQixDQUFDLE9BQU8sRUFBRSxDQUFBO09BQ2xDO0FBQ0QsWUFBSyxrQkFBa0IsR0FBRyxNQUFLLE1BQU0sQ0FBQyxXQUFXLENBQUMscUJBQVEsUUFBUSxDQUFDLFlBQU07QUFDdkUsY0FBSyxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsQ0FBQTtPQUN2QyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUE7S0FDZCxDQUFDLENBQUE7O0FBRUYsUUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUE7R0FDbkI7O2VBckZrQixZQUFZOztXQW9HbkIsd0JBQUc7QUFDYixVQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssSUFBSSxFQUFFO0FBQ3hCLFlBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQTtPQUNwQjtBQUNELFVBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtBQUN0QixZQUFJLENBQUMsU0FBUyxFQUFFLENBQUE7T0FDakI7S0FDRjs7O1dBRVEscUJBQUc7QUFDVixVQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFBO0FBQ3pELFVBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUM7QUFDbEMsWUFBSSxFQUFFLFFBQVE7QUFDZCxnQkFBUSxFQUFFLFFBQVEsS0FBSyxNQUFNLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRztPQUMzQyxDQUFDLENBQUE7S0FDSDs7O1dBRVcsd0JBQUc7QUFDYixVQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssSUFBSSxFQUFFO0FBQ3hCLFlBQUk7O0FBRUYsY0FBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQTtTQUN0QixDQUFDLE9BQU8sR0FBRyxFQUFFLEVBQUU7QUFDaEIsWUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUE7T0FDbkI7S0FDRjs7O1dBRVUsdUJBQUc7QUFDWixhQUFPLElBQUksQ0FBQyxRQUFRLENBQUE7S0FDckI7OztXQUVTLG9CQUFDLE9BQU8sRUFBRTtBQUNsQixVQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUU7QUFDL0IsWUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQ2YsaUJBQU8sQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFBO1NBQzNCO0FBQ0QsWUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUE7QUFDMUIsWUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsT0FBTyxDQUFDLENBQUE7QUFDN0MsWUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsRUFBQyxPQUFPLEVBQVAsT0FBTyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFBO09BQ2hFO0tBQ0Y7OztXQUVZLHVCQUFDLE9BQU8sRUFBRTtBQUNyQixVQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQzlCLFlBQUksQ0FBQyxRQUFRLFVBQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUM3QixZQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxPQUFPLENBQUMsQ0FBQTtBQUNoRCxZQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxFQUFDLE9BQU8sRUFBUCxPQUFPLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBQyxDQUFDLENBQUE7T0FDbkU7S0FDRjs7O1dBRW9CLCtCQUFDLEdBQUcsRUFBRTs7O0FBQ3pCLFVBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMseUJBQXlCLENBQUMsRUFBRTtBQUM5QyxZQUFJLEdBQUcsS0FBSyxJQUFJLEVBQUU7QUFDaEIsYUFBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsdUJBQXVCLEVBQUUsQ0FBQyxHQUFHLENBQUE7U0FDaEQ7QUFDRCxZQUFJLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxDQUFBO0FBQzFCLFlBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUEsT0FBTyxFQUFJO0FBQy9CLGNBQUksT0FBTyxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUMsS0FBSyxJQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxFQUFFO0FBQzNFLG1CQUFLLGlCQUFpQixFQUFFLENBQUE7V0FDekI7U0FDRixDQUFDLENBQUE7T0FDSCxNQUFNO0FBQ0wsWUFBSSxDQUFDLGlCQUFpQixHQUFHLENBQUMsQ0FBQTtPQUMzQjtBQUNELFVBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLDZCQUE2QixFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFBO0FBQ3hFLGFBQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFBO0tBQzlCOzs7V0FFRyxnQkFBbUI7VUFBbEIsUUFBUSx5REFBRyxLQUFLOztBQUNuQixVQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsUUFBUSxDQUFDLENBQUE7S0FDM0M7OztXQUVjLHlCQUFDLFFBQVEsRUFBRTtBQUN4QixhQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLGlCQUFpQixFQUFFLFFBQVEsQ0FBQyxDQUFBO0tBQ3BEOzs7V0FFaUIsNEJBQUMsUUFBUSxFQUFFO0FBQzNCLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsb0JBQW9CLEVBQUUsUUFBUSxDQUFDLENBQUE7S0FDdkQ7OztXQUVpQiw0QkFBQyxRQUFRLEVBQUU7QUFDM0IsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxvQkFBb0IsRUFBRSxRQUFRLENBQUMsQ0FBQTtLQUN2RDs7O1dBRXlCLG9DQUFDLFFBQVEsRUFBRTtBQUNuQyxhQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLDZCQUE2QixFQUFFLFFBQVEsQ0FBQyxDQUFBO0tBQ2hFOzs7V0FFbUIsOEJBQUMsUUFBUSxFQUFFO0FBQzdCLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsc0JBQXNCLEVBQUUsUUFBUSxDQUFDLENBQUE7S0FDekQ7OztXQUVXLHNCQUFDLFFBQVEsRUFBRTtBQUNyQixhQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxRQUFRLENBQUMsQ0FBQTtLQUNoRDs7O1dBRVcsc0JBQUMsUUFBUSxFQUFFO0FBQ3JCLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLFFBQVEsQ0FBQyxDQUFBO0tBQ2hEOzs7V0FFTSxtQkFBRztBQUNSLFVBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFBO0FBQ2hDLFVBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUU7QUFDckIsWUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBQSxNQUFNO2lCQUFJLE1BQU0sQ0FBQyxPQUFPLEVBQUU7U0FBQSxDQUFDLENBQUE7QUFDaEQsWUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQTtPQUNyQjtBQUNELFVBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQTtBQUNuQixVQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQzVCLFVBQUksSUFBSSxDQUFDLGtCQUFrQixFQUFFO0FBQzNCLFlBQUksQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtPQUNsQztBQUNELFVBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDdEIsVUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtLQUN0Qjs7O1NBOUhTLGFBQUMsS0FBSyxFQUFFO0FBQ2hCLFdBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDdEIsVUFBSSxLQUFLLEtBQUssSUFBSSxDQUFDLE9BQU8sRUFBRTtBQUMxQixZQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQTtBQUNwQixZQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFO0FBQ3RCLGNBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUEsT0FBTzttQkFBSSxPQUFPLENBQUMsV0FBVyxHQUFHLEtBQUs7V0FBQSxDQUFDLENBQUE7U0FDOUQ7T0FDRjtLQUNGO1NBQ1MsZUFBRztBQUNYLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQTtLQUNwQjs7O1NBbEdrQixZQUFZOzs7cUJBQVosWUFBWSIsImZpbGUiOiIvVXNlcnMvYWgvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi9lZGl0b3ItbGludGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCdcblxuaW1wb3J0IHtFbWl0dGVyLCBDb21wb3NpdGVEaXNwb3NhYmxlfSBmcm9tICdhdG9tJ1xuaW1wb3J0IEhlbHBlcnMgZnJvbSAnLi9oZWxwZXJzJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFZGl0b3JMaW50ZXIge1xuICBjb25zdHJ1Y3RvcihlZGl0b3IpIHtcbiAgICBpZiAodHlwZW9mIGVkaXRvciAhPT0gJ29iamVjdCcgfHwgdHlwZW9mIGVkaXRvci5tYXJrQnVmZmVyUmFuZ2UgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignR2l2ZW4gZWRpdG9yIGlzIG5vdCByZWFsbHkgYW4gZWRpdG9yJylcbiAgICB9XG5cbiAgICB0aGlzLmVkaXRvciA9IGVkaXRvclxuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKClcbiAgICB0aGlzLm1lc3NhZ2VzID0gbmV3IFNldCgpXG4gICAgdGhpcy5tYXJrZXJzID0gbmV3IE1hcCgpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICB0aGlzLmd1dHRlciA9IG51bGxcbiAgICB0aGlzLmNvdW50TGluZU1lc3NhZ2VzID0gMFxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXIudW5kZXJsaW5lSXNzdWVzJywgdW5kZXJsaW5lSXNzdWVzID0+XG4gICAgICB0aGlzLnVuZGVybGluZUlzc3VlcyA9IHVuZGVybGluZUlzc3Vlc1xuICAgICkpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXIuc2hvd0Vycm9ySW5saW5lJywgc2hvd0J1YmJsZSA9PlxuICAgICAgdGhpcy5zaG93QnViYmxlID0gc2hvd0J1YmJsZVxuICAgICkpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLmVkaXRvci5vbkRpZERlc3Ryb3koKCkgPT5cbiAgICAgIHRoaXMuZGlzcG9zZSgpXG4gICAgKSlcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuZWRpdG9yLm9uRGlkU2F2ZSgoKSA9PlxuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ3Nob3VsZC1saW50JywgZmFsc2UpXG4gICAgKSlcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuZWRpdG9yLm9uRGlkQ2hhbmdlQ3Vyc29yUG9zaXRpb24oKHtvbGRCdWZmZXJQb3NpdGlvbiwgbmV3QnVmZmVyUG9zaXRpb259KSA9PiB7XG4gICAgICBpZiAobmV3QnVmZmVyUG9zaXRpb24ucm93ICE9PSBvbGRCdWZmZXJQb3NpdGlvbi5yb3cpIHtcbiAgICAgICAgdGhpcy5jYWxjdWxhdGVMaW5lTWVzc2FnZXMobmV3QnVmZmVyUG9zaXRpb24ucm93KVxuICAgICAgfVxuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ3Nob3VsZC11cGRhdGUtYnViYmxlJylcbiAgICB9KSlcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci5ndXR0ZXJFbmFibGVkJywgZ3V0dGVyRW5hYmxlZCA9PiB7XG4gICAgICB0aGlzLmd1dHRlckVuYWJsZWQgPSBndXR0ZXJFbmFibGVkXG4gICAgICB0aGlzLmhhbmRsZUd1dHRlcigpXG4gICAgfSkpXG4gICAgLy8gVXNpbmcgb25EaWRDaGFuZ2UgaW5zdGVhZCBvZiBvYnNlcnZlIGhlcmUgJ2NhdXNlIHRoZSBzYW1lIGZ1bmN0aW9uIGlzIGludm9rZWQgYWJvdmVcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlKCdsaW50ZXIuZ3V0dGVyUG9zaXRpb24nLCAoKSA9PlxuICAgICAgdGhpcy5oYW5kbGVHdXR0ZXIoKVxuICAgICkpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLm9uRGlkTWVzc2FnZUFkZChtZXNzYWdlID0+IHtcbiAgICAgIGlmICghdGhpcy51bmRlcmxpbmVJc3N1ZXMgJiYgIXRoaXMuZ3V0dGVyRW5hYmxlZCAmJiAhdGhpcy5zaG93QnViYmxlIHx8ICFtZXNzYWdlLnJhbmdlKSB7XG4gICAgICAgIHJldHVybiAvLyBOby1PcFxuICAgICAgfVxuICAgICAgY29uc3QgbWFya2VyID0gdGhpcy5lZGl0b3IuZ2V0QnVmZmVyKCkubWFya1JhbmdlKG1lc3NhZ2UucmFuZ2UsIHtpbnZhbGlkYXRlOiAnaW5zaWRlJ30pXG4gICAgICBtYXJrZXIub25EaWRDaGFuZ2UoKHsgb2xkSGVhZFBvc2l0aW9uLCBuZXdIZWFkUG9zaXRpb24sIGlzVmFsaWQgfSkgPT4ge1xuICAgICAgICBpZiAoaXNWYWxpZCAmJiAob2xkSGVhZFBvc2l0aW9uLnJvdyAhPT0gMCB8fCBuZXdIZWFkUG9zaXRpb24ucm93ID09PSAwKSkge1xuICAgICAgICAgIG1lc3NhZ2UucmFuZ2UgPSBtYXJrZXIucHJldmlvdXNFdmVudFN0YXRlLnJhbmdlXG4gICAgICAgICAgbWVzc2FnZS5rZXkgPSBIZWxwZXJzLm1lc3NhZ2VLZXkobWVzc2FnZSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIHRoaXMubWFya2Vycy5zZXQobWVzc2FnZSwgbWFya2VyKVxuICAgICAgaWYgKHRoaXMudW5kZXJsaW5lSXNzdWVzKSB7XG4gICAgICAgIHRoaXMuZWRpdG9yLmRlY29yYXRlTWFya2VyKG1hcmtlciwge1xuICAgICAgICAgIHR5cGU6ICdoaWdobGlnaHQnLFxuICAgICAgICAgIGNsYXNzOiBgbGludGVyLWhpZ2hsaWdodCAke21lc3NhZ2UuY2xhc3N9YFxuICAgICAgICB9KVxuICAgICAgfVxuICAgICAgaWYgKHRoaXMuZ3V0dGVyRW5hYmxlZCkge1xuICAgICAgICBjb25zdCBpdGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXG4gICAgICAgIGl0ZW0uY2xhc3NOYW1lID0gYGxpbnRlci1ndXR0ZXIgbGludGVyLWhpZ2hsaWdodCAke21lc3NhZ2UuY2xhc3N9YFxuICAgICAgICB0aGlzLmd1dHRlci5kZWNvcmF0ZU1hcmtlcihtYXJrZXIsIHtcbiAgICAgICAgICBjbGFzczogJ2xpbnRlci1yb3cnLFxuICAgICAgICAgIGl0ZW1cbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9KSlcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMub25EaWRNZXNzYWdlRGVsZXRlKG1lc3NhZ2UgPT4ge1xuICAgICAgaWYgKHRoaXMubWFya2Vycy5oYXMobWVzc2FnZSkpIHtcbiAgICAgICAgdGhpcy5tYXJrZXJzLmdldChtZXNzYWdlKS5kZXN0cm95KClcbiAgICAgICAgdGhpcy5tYXJrZXJzLmRlbGV0ZShtZXNzYWdlKVxuICAgICAgfVxuICAgIH0pKVxuXG4gICAgLy8gVE9ETzogQXRvbSBpbnZva2VzIG9uRGlke0NoYW5nZSwgU3RvcENoYW5naW5nfSBjYWxsYmFja3MgaW1tZWRpYXRlbHkuIFdvcmthcm91bmQgaXRcbiAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXIubGludE9uRmx5SW50ZXJ2YWwnLCAoaW50ZXJ2YWwpID0+IHtcbiAgICAgIGlmICh0aGlzLmNoYW5nZVN1YnNjcmlwdGlvbikge1xuICAgICAgICB0aGlzLmNoYW5nZVN1YnNjcmlwdGlvbi5kaXNwb3NlKClcbiAgICAgIH1cbiAgICAgIHRoaXMuY2hhbmdlU3Vic2NyaXB0aW9uID0gdGhpcy5lZGl0b3Iub25EaWRDaGFuZ2UoSGVscGVycy5kZWJvdW5jZSgoKSA9PiB7XG4gICAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdzaG91bGQtbGludCcsIHRydWUpXG4gICAgICB9LCBpbnRlcnZhbCkpXG4gICAgfSlcblxuICAgIHRoaXMuYWN0aXZlID0gdHJ1ZVxuICB9XG5cbiAgc2V0IGFjdGl2ZSh2YWx1ZSkge1xuICAgIHZhbHVlID0gQm9vbGVhbih2YWx1ZSlcbiAgICBpZiAodmFsdWUgIT09IHRoaXMuX2FjdGl2ZSkge1xuICAgICAgdGhpcy5fYWN0aXZlID0gdmFsdWVcbiAgICAgIGlmICh0aGlzLm1lc3NhZ2VzLnNpemUpIHtcbiAgICAgICAgdGhpcy5tZXNzYWdlcy5mb3JFYWNoKG1lc3NhZ2UgPT4gbWVzc2FnZS5jdXJyZW50RmlsZSA9IHZhbHVlKVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBnZXQgYWN0aXZlKCkge1xuICAgIHJldHVybiB0aGlzLl9hY3RpdmVcbiAgfVxuXG4gIGhhbmRsZUd1dHRlcigpIHtcbiAgICBpZiAodGhpcy5ndXR0ZXIgIT09IG51bGwpIHtcbiAgICAgIHRoaXMucmVtb3ZlR3V0dGVyKClcbiAgICB9XG4gICAgaWYgKHRoaXMuZ3V0dGVyRW5hYmxlZCkge1xuICAgICAgdGhpcy5hZGRHdXR0ZXIoKVxuICAgIH1cbiAgfVxuXG4gIGFkZEd1dHRlcigpIHtcbiAgICBjb25zdCBwb3NpdGlvbiA9IGF0b20uY29uZmlnLmdldCgnbGludGVyLmd1dHRlclBvc2l0aW9uJylcbiAgICB0aGlzLmd1dHRlciA9IHRoaXMuZWRpdG9yLmFkZEd1dHRlcih7XG4gICAgICBuYW1lOiAnbGludGVyJyxcbiAgICAgIHByaW9yaXR5OiBwb3NpdGlvbiA9PT0gJ0xlZnQnID8gLTEwMCA6IDEwMFxuICAgIH0pXG4gIH1cblxuICByZW1vdmVHdXR0ZXIoKSB7XG4gICAgaWYgKHRoaXMuZ3V0dGVyICE9PSBudWxsKSB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBBdG9tIHRocm93cyB3aGVuIHdlIHRyeSB0byByZW1vdmUgYSBndXR0ZXIgY29udGFpbmVyIGZyb20gYSBjbG9zZWQgdGV4dCBlZGl0b3JcbiAgICAgICAgdGhpcy5ndXR0ZXIuZGVzdHJveSgpXG4gICAgICB9IGNhdGNoIChlcnIpIHt9XG4gICAgICB0aGlzLmd1dHRlciA9IG51bGxcbiAgICB9XG4gIH1cblxuICBnZXRNZXNzYWdlcygpIHtcbiAgICByZXR1cm4gdGhpcy5tZXNzYWdlc1xuICB9XG5cbiAgYWRkTWVzc2FnZShtZXNzYWdlKSB7XG4gICAgaWYgKCF0aGlzLm1lc3NhZ2VzLmhhcyhtZXNzYWdlKSkge1xuICAgICAgaWYgKHRoaXMuYWN0aXZlKSB7XG4gICAgICAgIG1lc3NhZ2UuY3VycmVudEZpbGUgPSB0cnVlXG4gICAgICB9XG4gICAgICB0aGlzLm1lc3NhZ2VzLmFkZChtZXNzYWdlKVxuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1tZXNzYWdlLWFkZCcsIG1lc3NhZ2UpXG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLW1lc3NhZ2UtY2hhbmdlJywge21lc3NhZ2UsIHR5cGU6ICdhZGQnfSlcbiAgICB9XG4gIH1cblxuICBkZWxldGVNZXNzYWdlKG1lc3NhZ2UpIHtcbiAgICBpZiAodGhpcy5tZXNzYWdlcy5oYXMobWVzc2FnZSkpIHtcbiAgICAgIHRoaXMubWVzc2FnZXMuZGVsZXRlKG1lc3NhZ2UpXG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLW1lc3NhZ2UtZGVsZXRlJywgbWVzc2FnZSlcbiAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtbWVzc2FnZS1jaGFuZ2UnLCB7bWVzc2FnZSwgdHlwZTogJ2RlbGV0ZSd9KVxuICAgIH1cbiAgfVxuXG4gIGNhbGN1bGF0ZUxpbmVNZXNzYWdlcyhyb3cpIHtcbiAgICBpZiAoYXRvbS5jb25maWcuZ2V0KCdsaW50ZXIuc2hvd0Vycm9yVGFiTGluZScpKSB7XG4gICAgICBpZiAocm93ID09PSBudWxsKSB7XG4gICAgICAgIHJvdyA9IHRoaXMuZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKCkucm93XG4gICAgICB9XG4gICAgICB0aGlzLmNvdW50TGluZU1lc3NhZ2VzID0gMFxuICAgICAgdGhpcy5tZXNzYWdlcy5mb3JFYWNoKG1lc3NhZ2UgPT4ge1xuICAgICAgICBpZiAobWVzc2FnZS5jdXJyZW50TGluZSA9IG1lc3NhZ2UucmFuZ2UgJiYgbWVzc2FnZS5yYW5nZS5pbnRlcnNlY3RzUm93KHJvdykpIHtcbiAgICAgICAgICB0aGlzLmNvdW50TGluZU1lc3NhZ2VzKytcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jb3VudExpbmVNZXNzYWdlcyA9IDBcbiAgICB9XG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1jYWxjdWxhdGUtbGluZS1tZXNzYWdlcycsIHRoaXMuY291bnRMaW5lTWVzc2FnZXMpXG4gICAgcmV0dXJuIHRoaXMuY291bnRMaW5lTWVzc2FnZXNcbiAgfVxuXG4gIGxpbnQob25DaGFuZ2UgPSBmYWxzZSkge1xuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdzaG91bGQtbGludCcsIG9uQ2hhbmdlKVxuICB9XG5cbiAgb25EaWRNZXNzYWdlQWRkKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLW1lc3NhZ2UtYWRkJywgY2FsbGJhY2spXG4gIH1cblxuICBvbkRpZE1lc3NhZ2VEZWxldGUoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtbWVzc2FnZS1kZWxldGUnLCBjYWxsYmFjaylcbiAgfVxuXG4gIG9uRGlkTWVzc2FnZUNoYW5nZShjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC1tZXNzYWdlLWNoYW5nZScsIGNhbGxiYWNrKVxuICB9XG5cbiAgb25EaWRDYWxjdWxhdGVMaW5lTWVzc2FnZXMoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtY2FsY3VsYXRlLWxpbmUtbWVzc2FnZXMnLCBjYWxsYmFjaylcbiAgfVxuXG4gIG9uU2hvdWxkVXBkYXRlQnViYmxlKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignc2hvdWxkLXVwZGF0ZS1idWJibGUnLCBjYWxsYmFjaylcbiAgfVxuXG4gIG9uU2hvdWxkTGludChjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ3Nob3VsZC1saW50JywgY2FsbGJhY2spXG4gIH1cblxuICBvbkRpZERlc3Ryb3koY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtZGVzdHJveScsIGNhbGxiYWNrKVxuICB9XG5cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWRlc3Ryb3knKVxuICAgIGlmICh0aGlzLm1hcmtlcnMuc2l6ZSkge1xuICAgICAgdGhpcy5tYXJrZXJzLmZvckVhY2gobWFya2VyID0+IG1hcmtlci5kZXN0cm95KCkpXG4gICAgICB0aGlzLm1hcmtlcnMuY2xlYXIoKVxuICAgIH1cbiAgICB0aGlzLnJlbW92ZUd1dHRlcigpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgIGlmICh0aGlzLmNoYW5nZVN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5jaGFuZ2VTdWJzY3JpcHRpb24uZGlzcG9zZSgpXG4gICAgfVxuICAgIHRoaXMuZW1pdHRlci5kaXNwb3NlKClcbiAgICB0aGlzLm1lc3NhZ2VzLmNsZWFyKClcbiAgfVxufVxuIl19
//# sourceURL=/Users/ah/.atom/packages/linter/lib/editor-linter.js
