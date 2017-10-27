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
      var marker = _this.editor.markBufferRange(message.range, { invalidate: 'inside' });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL2VkaXRvci1saW50ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztvQkFFMkMsTUFBTTs7dUJBQzdCLFdBQVc7Ozs7QUFIL0IsV0FBVyxDQUFBOztJQUtVLFlBQVk7QUFDcEIsV0FEUSxZQUFZLENBQ25CLE1BQU0sRUFBRTs7OzBCQURELFlBQVk7O0FBRTdCLFFBQUksT0FBTyxNQUFNLEtBQUssUUFBUSxJQUFJLE9BQU8sTUFBTSxDQUFDLGVBQWUsS0FBSyxVQUFVLEVBQUU7QUFDOUUsWUFBTSxJQUFJLEtBQUssQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFBO0tBQ3hEOztBQUVELFFBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFBO0FBQ3BCLFFBQUksQ0FBQyxPQUFPLEdBQUcsbUJBQWEsQ0FBQTtBQUM1QixRQUFJLENBQUMsUUFBUSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7QUFDekIsUUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBO0FBQ3hCLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXVCLENBQUE7QUFDNUMsUUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUE7QUFDbEIsUUFBSSxDQUFDLGlCQUFpQixHQUFHLENBQUMsQ0FBQTs7QUFFMUIsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsd0JBQXdCLEVBQUUsVUFBQSxlQUFlO2FBQ2xGLE1BQUssZUFBZSxHQUFHLGVBQWU7S0FBQSxDQUN2QyxDQUFDLENBQUE7QUFDRixRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyx3QkFBd0IsRUFBRSxVQUFBLFVBQVU7YUFDN0UsTUFBSyxVQUFVLEdBQUcsVUFBVTtLQUFBLENBQzdCLENBQUMsQ0FBQTtBQUNGLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDO2FBQzlDLE1BQUssT0FBTyxFQUFFO0tBQUEsQ0FDZixDQUFDLENBQUE7QUFDRixRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQzthQUMzQyxNQUFLLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLEtBQUssQ0FBQztLQUFBLENBQ3hDLENBQUMsQ0FBQTtBQUNGLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMseUJBQXlCLENBQUMsVUFBQyxJQUFzQyxFQUFLO1VBQTFDLGlCQUFpQixHQUFsQixJQUFzQyxDQUFyQyxpQkFBaUI7VUFBRSxpQkFBaUIsR0FBckMsSUFBc0MsQ0FBbEIsaUJBQWlCOztBQUNqRyxVQUFJLGlCQUFpQixDQUFDLEdBQUcsS0FBSyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUU7QUFDbkQsY0FBSyxxQkFBcUIsQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsQ0FBQTtPQUNsRDtBQUNELFlBQUssT0FBTyxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFBO0tBQzFDLENBQUMsQ0FBQyxDQUFBO0FBQ0gsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsc0JBQXNCLEVBQUUsVUFBQSxhQUFhLEVBQUk7QUFDbEYsWUFBSyxhQUFhLEdBQUcsYUFBYSxDQUFBO0FBQ2xDLFlBQUssWUFBWSxFQUFFLENBQUE7S0FDcEIsQ0FBQyxDQUFDLENBQUE7O0FBRUgsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsdUJBQXVCLEVBQUU7YUFDdEUsTUFBSyxZQUFZLEVBQUU7S0FBQSxDQUNwQixDQUFDLENBQUE7QUFDRixRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLFVBQUEsT0FBTyxFQUFJO0FBQ3JELFVBQUksQ0FBQyxNQUFLLGVBQWUsSUFBSSxDQUFDLE1BQUssYUFBYSxJQUFJLENBQUMsTUFBSyxVQUFVLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFO0FBQ3RGLGVBQU07T0FDUDtBQUNELFVBQU0sTUFBTSxHQUFHLE1BQUssTUFBTSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUMsVUFBVSxFQUFFLFFBQVEsRUFBQyxDQUFDLENBQUE7QUFDakYsWUFBSyxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQTtBQUNqQyxVQUFJLE1BQUssZUFBZSxFQUFFO0FBQ3hCLGNBQUssTUFBTSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUU7QUFDakMsY0FBSSxFQUFFLFdBQVc7QUFDakIseUNBQTJCLE9BQU8sU0FBTSxBQUFFO1NBQzNDLENBQUMsQ0FBQTtPQUNIO0FBQ0QsVUFBSSxNQUFLLGFBQWEsRUFBRTtBQUN0QixZQUFNLElBQUksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBQzNDLFlBQUksQ0FBQyxTQUFTLHVDQUFxQyxPQUFPLFNBQU0sQUFBRSxDQUFBO0FBQ2xFLGNBQUssTUFBTSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUU7QUFDakMsbUJBQU8sWUFBWTtBQUNuQixjQUFJLEVBQUosSUFBSTtTQUNMLENBQUMsQ0FBQTtPQUNIO0tBQ0YsQ0FBQyxDQUFDLENBQUE7QUFDSCxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsVUFBQSxPQUFPLEVBQUk7QUFDeEQsVUFBSSxNQUFLLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUU7QUFDN0IsY0FBSyxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQ25DLGNBQUssT0FBTyxVQUFPLENBQUMsT0FBTyxDQUFDLENBQUE7T0FDN0I7S0FDRixDQUFDLENBQUMsQ0FBQTs7O0FBR0gsUUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsMEJBQTBCLEVBQUUsVUFBQyxRQUFRLEVBQUs7QUFDNUQsVUFBSSxNQUFLLGtCQUFrQixFQUFFO0FBQzNCLGNBQUssa0JBQWtCLENBQUMsT0FBTyxFQUFFLENBQUE7T0FDbEM7QUFDRCxZQUFLLGtCQUFrQixHQUFHLE1BQUssTUFBTSxDQUFDLFdBQVcsQ0FBQyxxQkFBUSxRQUFRLENBQUMsWUFBTTtBQUN2RSxjQUFLLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFBO09BQ3ZDLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQTtLQUNkLENBQUMsQ0FBQTs7QUFFRixRQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQTtHQUNuQjs7ZUEvRWtCLFlBQVk7O1dBOEZuQix3QkFBRztBQUNiLFVBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxJQUFJLEVBQUU7QUFDeEIsWUFBSSxDQUFDLFlBQVksRUFBRSxDQUFBO09BQ3BCO0FBQ0QsVUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO0FBQ3RCLFlBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQTtPQUNqQjtLQUNGOzs7V0FFUSxxQkFBRztBQUNWLFVBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHVCQUF1QixDQUFDLENBQUE7QUFDekQsVUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQztBQUNsQyxZQUFJLEVBQUUsUUFBUTtBQUNkLGdCQUFRLEVBQUUsUUFBUSxLQUFLLE1BQU0sR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHO09BQzNDLENBQUMsQ0FBQTtLQUNIOzs7V0FFVyx3QkFBRztBQUNiLFVBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxJQUFJLEVBQUU7QUFDeEIsWUFBSTs7QUFFRixjQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFBO1NBQ3RCLENBQUMsT0FBTyxHQUFHLEVBQUUsRUFBRTtBQUNoQixZQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQTtPQUNuQjtLQUNGOzs7V0FFVSx1QkFBRztBQUNaLGFBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQTtLQUNyQjs7O1dBRVMsb0JBQUMsT0FBTyxFQUFFO0FBQ2xCLFVBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUMvQixZQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7QUFDZixpQkFBTyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUE7U0FDM0I7QUFDRCxZQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUMxQixZQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxPQUFPLENBQUMsQ0FBQTtBQUM3QyxZQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxFQUFDLE9BQU8sRUFBUCxPQUFPLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUE7T0FDaEU7S0FDRjs7O1dBRVksdUJBQUMsT0FBTyxFQUFFO0FBQ3JCLFVBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUU7QUFDOUIsWUFBSSxDQUFDLFFBQVEsVUFBTyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQzdCLFlBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLG9CQUFvQixFQUFFLE9BQU8sQ0FBQyxDQUFBO0FBQ2hELFlBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLG9CQUFvQixFQUFFLEVBQUMsT0FBTyxFQUFQLE9BQU8sRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFDLENBQUMsQ0FBQTtPQUNuRTtLQUNGOzs7V0FFb0IsK0JBQUMsR0FBRyxFQUFFOzs7QUFDekIsVUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxFQUFFO0FBQzlDLFlBQUksR0FBRyxLQUFLLElBQUksRUFBRTtBQUNoQixhQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyx1QkFBdUIsRUFBRSxDQUFDLEdBQUcsQ0FBQTtTQUNoRDtBQUNELFlBQUksQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLENBQUE7QUFDMUIsWUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsVUFBQSxPQUFPLEVBQUk7QUFDL0IsY0FBSSxPQUFPLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQyxLQUFLLElBQUksT0FBTyxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLEVBQUU7QUFDM0UsbUJBQUssaUJBQWlCLEVBQUUsQ0FBQTtXQUN6QjtTQUNGLENBQUMsQ0FBQTtPQUNILE1BQU07QUFDTCxZQUFJLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxDQUFBO09BQzNCO0FBQ0QsVUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsNkJBQTZCLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUE7QUFDeEUsYUFBTyxJQUFJLENBQUMsaUJBQWlCLENBQUE7S0FDOUI7OztXQUVHLGdCQUFtQjtVQUFsQixRQUFRLHlEQUFHLEtBQUs7O0FBQ25CLFVBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxRQUFRLENBQUMsQ0FBQTtLQUMzQzs7O1dBRWMseUJBQUMsUUFBUSxFQUFFO0FBQ3hCLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsaUJBQWlCLEVBQUUsUUFBUSxDQUFDLENBQUE7S0FDcEQ7OztXQUVpQiw0QkFBQyxRQUFRLEVBQUU7QUFDM0IsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxvQkFBb0IsRUFBRSxRQUFRLENBQUMsQ0FBQTtLQUN2RDs7O1dBRWlCLDRCQUFDLFFBQVEsRUFBRTtBQUMzQixhQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLG9CQUFvQixFQUFFLFFBQVEsQ0FBQyxDQUFBO0tBQ3ZEOzs7V0FFeUIsb0NBQUMsUUFBUSxFQUFFO0FBQ25DLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsNkJBQTZCLEVBQUUsUUFBUSxDQUFDLENBQUE7S0FDaEU7OztXQUVtQiw4QkFBQyxRQUFRLEVBQUU7QUFDN0IsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxzQkFBc0IsRUFBRSxRQUFRLENBQUMsQ0FBQTtLQUN6RDs7O1dBRVcsc0JBQUMsUUFBUSxFQUFFO0FBQ3JCLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLFFBQVEsQ0FBQyxDQUFBO0tBQ2hEOzs7V0FFVyxzQkFBQyxRQUFRLEVBQUU7QUFDckIsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsUUFBUSxDQUFDLENBQUE7S0FDaEQ7OztXQUVNLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUE7QUFDaEMsVUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRTtBQUNyQixZQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFBLE1BQU07aUJBQUksTUFBTSxDQUFDLE9BQU8sRUFBRTtTQUFBLENBQUMsQ0FBQTtBQUNoRCxZQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFBO09BQ3JCO0FBQ0QsVUFBSSxDQUFDLFlBQVksRUFBRSxDQUFBO0FBQ25CLFVBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDNUIsVUFBSSxJQUFJLENBQUMsa0JBQWtCLEVBQUU7QUFDM0IsWUFBSSxDQUFDLGtCQUFrQixDQUFDLE9BQU8sRUFBRSxDQUFBO09BQ2xDO0FBQ0QsVUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUN0QixVQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFBO0tBQ3RCOzs7U0E5SFMsYUFBQyxLQUFLLEVBQUU7QUFDaEIsV0FBSyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQTtBQUN0QixVQUFJLEtBQUssS0FBSyxJQUFJLENBQUMsT0FBTyxFQUFFO0FBQzFCLFlBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFBO0FBQ3BCLFlBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUU7QUFDdEIsY0FBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsVUFBQSxPQUFPO21CQUFJLE9BQU8sQ0FBQyxXQUFXLEdBQUcsS0FBSztXQUFBLENBQUMsQ0FBQTtTQUM5RDtPQUNGO0tBQ0Y7U0FDUyxlQUFHO0FBQ1gsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFBO0tBQ3BCOzs7U0E1RmtCLFlBQVk7OztxQkFBWixZQUFZIiwiZmlsZSI6Ii9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL2VkaXRvci1saW50ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5pbXBvcnQge0VtaXR0ZXIsIENvbXBvc2l0ZURpc3Bvc2FibGV9IGZyb20gJ2F0b20nXG5pbXBvcnQgSGVscGVycyBmcm9tICcuL2hlbHBlcnMnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVkaXRvckxpbnRlciB7XG4gIGNvbnN0cnVjdG9yKGVkaXRvcikge1xuICAgIGlmICh0eXBlb2YgZWRpdG9yICE9PSAnb2JqZWN0JyB8fCB0eXBlb2YgZWRpdG9yLm1hcmtCdWZmZXJSYW5nZSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdHaXZlbiBlZGl0b3IgaXMgbm90IHJlYWxseSBhbiBlZGl0b3InKVxuICAgIH1cblxuICAgIHRoaXMuZWRpdG9yID0gZWRpdG9yXG4gICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXIoKVxuICAgIHRoaXMubWVzc2FnZXMgPSBuZXcgU2V0KClcbiAgICB0aGlzLm1hcmtlcnMgPSBuZXcgTWFwKClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIHRoaXMuZ3V0dGVyID0gbnVsbFxuICAgIHRoaXMuY291bnRMaW5lTWVzc2FnZXMgPSAwXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci51bmRlcmxpbmVJc3N1ZXMnLCB1bmRlcmxpbmVJc3N1ZXMgPT5cbiAgICAgIHRoaXMudW5kZXJsaW5lSXNzdWVzID0gdW5kZXJsaW5lSXNzdWVzXG4gICAgKSlcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci5zaG93RXJyb3JJbmxpbmUnLCBzaG93QnViYmxlID0+XG4gICAgICB0aGlzLnNob3dCdWJibGUgPSBzaG93QnViYmxlXG4gICAgKSlcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuZWRpdG9yLm9uRGlkRGVzdHJveSgoKSA9PlxuICAgICAgdGhpcy5kaXNwb3NlKClcbiAgICApKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5lZGl0b3Iub25EaWRTYXZlKCgpID0+XG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnc2hvdWxkLWxpbnQnLCBmYWxzZSlcbiAgICApKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5lZGl0b3Iub25EaWRDaGFuZ2VDdXJzb3JQb3NpdGlvbigoe29sZEJ1ZmZlclBvc2l0aW9uLCBuZXdCdWZmZXJQb3NpdGlvbn0pID0+IHtcbiAgICAgIGlmIChuZXdCdWZmZXJQb3NpdGlvbi5yb3cgIT09IG9sZEJ1ZmZlclBvc2l0aW9uLnJvdykge1xuICAgICAgICB0aGlzLmNhbGN1bGF0ZUxpbmVNZXNzYWdlcyhuZXdCdWZmZXJQb3NpdGlvbi5yb3cpXG4gICAgICB9XG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnc2hvdWxkLXVwZGF0ZS1idWJibGUnKVxuICAgIH0pKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLmd1dHRlckVuYWJsZWQnLCBndXR0ZXJFbmFibGVkID0+IHtcbiAgICAgIHRoaXMuZ3V0dGVyRW5hYmxlZCA9IGd1dHRlckVuYWJsZWRcbiAgICAgIHRoaXMuaGFuZGxlR3V0dGVyKClcbiAgICB9KSlcbiAgICAvLyBVc2luZyBvbkRpZENoYW5nZSBpbnN0ZWFkIG9mIG9ic2VydmUgaGVyZSAnY2F1c2UgdGhlIHNhbWUgZnVuY3Rpb24gaXMgaW52b2tlZCBhYm92ZVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub25EaWRDaGFuZ2UoJ2xpbnRlci5ndXR0ZXJQb3NpdGlvbicsICgpID0+XG4gICAgICB0aGlzLmhhbmRsZUd1dHRlcigpXG4gICAgKSlcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMub25EaWRNZXNzYWdlQWRkKG1lc3NhZ2UgPT4ge1xuICAgICAgaWYgKCF0aGlzLnVuZGVybGluZUlzc3VlcyAmJiAhdGhpcy5ndXR0ZXJFbmFibGVkICYmICF0aGlzLnNob3dCdWJibGUgfHwgIW1lc3NhZ2UucmFuZ2UpIHtcbiAgICAgICAgcmV0dXJuIC8vIE5vLU9wXG4gICAgICB9XG4gICAgICBjb25zdCBtYXJrZXIgPSB0aGlzLmVkaXRvci5tYXJrQnVmZmVyUmFuZ2UobWVzc2FnZS5yYW5nZSwge2ludmFsaWRhdGU6ICdpbnNpZGUnfSlcbiAgICAgIHRoaXMubWFya2Vycy5zZXQobWVzc2FnZSwgbWFya2VyKVxuICAgICAgaWYgKHRoaXMudW5kZXJsaW5lSXNzdWVzKSB7XG4gICAgICAgIHRoaXMuZWRpdG9yLmRlY29yYXRlTWFya2VyKG1hcmtlciwge1xuICAgICAgICAgIHR5cGU6ICdoaWdobGlnaHQnLFxuICAgICAgICAgIGNsYXNzOiBgbGludGVyLWhpZ2hsaWdodCAke21lc3NhZ2UuY2xhc3N9YFxuICAgICAgICB9KVxuICAgICAgfVxuICAgICAgaWYgKHRoaXMuZ3V0dGVyRW5hYmxlZCkge1xuICAgICAgICBjb25zdCBpdGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXG4gICAgICAgIGl0ZW0uY2xhc3NOYW1lID0gYGxpbnRlci1ndXR0ZXIgbGludGVyLWhpZ2hsaWdodCAke21lc3NhZ2UuY2xhc3N9YFxuICAgICAgICB0aGlzLmd1dHRlci5kZWNvcmF0ZU1hcmtlcihtYXJrZXIsIHtcbiAgICAgICAgICBjbGFzczogJ2xpbnRlci1yb3cnLFxuICAgICAgICAgIGl0ZW1cbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9KSlcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMub25EaWRNZXNzYWdlRGVsZXRlKG1lc3NhZ2UgPT4ge1xuICAgICAgaWYgKHRoaXMubWFya2Vycy5oYXMobWVzc2FnZSkpIHtcbiAgICAgICAgdGhpcy5tYXJrZXJzLmdldChtZXNzYWdlKS5kZXN0cm95KClcbiAgICAgICAgdGhpcy5tYXJrZXJzLmRlbGV0ZShtZXNzYWdlKVxuICAgICAgfVxuICAgIH0pKVxuXG4gICAgLy8gVE9ETzogQXRvbSBpbnZva2VzIG9uRGlke0NoYW5nZSwgU3RvcENoYW5naW5nfSBjYWxsYmFja3MgaW1tZWRpYXRlbHkuIFdvcmthcm91bmQgaXRcbiAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXIubGludE9uRmx5SW50ZXJ2YWwnLCAoaW50ZXJ2YWwpID0+IHtcbiAgICAgIGlmICh0aGlzLmNoYW5nZVN1YnNjcmlwdGlvbikge1xuICAgICAgICB0aGlzLmNoYW5nZVN1YnNjcmlwdGlvbi5kaXNwb3NlKClcbiAgICAgIH1cbiAgICAgIHRoaXMuY2hhbmdlU3Vic2NyaXB0aW9uID0gdGhpcy5lZGl0b3Iub25EaWRDaGFuZ2UoSGVscGVycy5kZWJvdW5jZSgoKSA9PiB7XG4gICAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdzaG91bGQtbGludCcsIHRydWUpXG4gICAgICB9LCBpbnRlcnZhbCkpXG4gICAgfSlcblxuICAgIHRoaXMuYWN0aXZlID0gdHJ1ZVxuICB9XG5cbiAgc2V0IGFjdGl2ZSh2YWx1ZSkge1xuICAgIHZhbHVlID0gQm9vbGVhbih2YWx1ZSlcbiAgICBpZiAodmFsdWUgIT09IHRoaXMuX2FjdGl2ZSkge1xuICAgICAgdGhpcy5fYWN0aXZlID0gdmFsdWVcbiAgICAgIGlmICh0aGlzLm1lc3NhZ2VzLnNpemUpIHtcbiAgICAgICAgdGhpcy5tZXNzYWdlcy5mb3JFYWNoKG1lc3NhZ2UgPT4gbWVzc2FnZS5jdXJyZW50RmlsZSA9IHZhbHVlKVxuICAgICAgfVxuICAgIH1cbiAgfVxuICBnZXQgYWN0aXZlKCkge1xuICAgIHJldHVybiB0aGlzLl9hY3RpdmVcbiAgfVxuXG4gIGhhbmRsZUd1dHRlcigpIHtcbiAgICBpZiAodGhpcy5ndXR0ZXIgIT09IG51bGwpIHtcbiAgICAgIHRoaXMucmVtb3ZlR3V0dGVyKClcbiAgICB9XG4gICAgaWYgKHRoaXMuZ3V0dGVyRW5hYmxlZCkge1xuICAgICAgdGhpcy5hZGRHdXR0ZXIoKVxuICAgIH1cbiAgfVxuXG4gIGFkZEd1dHRlcigpIHtcbiAgICBjb25zdCBwb3NpdGlvbiA9IGF0b20uY29uZmlnLmdldCgnbGludGVyLmd1dHRlclBvc2l0aW9uJylcbiAgICB0aGlzLmd1dHRlciA9IHRoaXMuZWRpdG9yLmFkZEd1dHRlcih7XG4gICAgICBuYW1lOiAnbGludGVyJyxcbiAgICAgIHByaW9yaXR5OiBwb3NpdGlvbiA9PT0gJ0xlZnQnID8gLTEwMCA6IDEwMFxuICAgIH0pXG4gIH1cblxuICByZW1vdmVHdXR0ZXIoKSB7XG4gICAgaWYgKHRoaXMuZ3V0dGVyICE9PSBudWxsKSB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBBdG9tIHRocm93cyB3aGVuIHdlIHRyeSB0byByZW1vdmUgYSBndXR0ZXIgY29udGFpbmVyIGZyb20gYSBjbG9zZWQgdGV4dCBlZGl0b3JcbiAgICAgICAgdGhpcy5ndXR0ZXIuZGVzdHJveSgpXG4gICAgICB9IGNhdGNoIChlcnIpIHt9XG4gICAgICB0aGlzLmd1dHRlciA9IG51bGxcbiAgICB9XG4gIH1cblxuICBnZXRNZXNzYWdlcygpIHtcbiAgICByZXR1cm4gdGhpcy5tZXNzYWdlc1xuICB9XG5cbiAgYWRkTWVzc2FnZShtZXNzYWdlKSB7XG4gICAgaWYgKCF0aGlzLm1lc3NhZ2VzLmhhcyhtZXNzYWdlKSkge1xuICAgICAgaWYgKHRoaXMuYWN0aXZlKSB7XG4gICAgICAgIG1lc3NhZ2UuY3VycmVudEZpbGUgPSB0cnVlXG4gICAgICB9XG4gICAgICB0aGlzLm1lc3NhZ2VzLmFkZChtZXNzYWdlKVxuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1tZXNzYWdlLWFkZCcsIG1lc3NhZ2UpXG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLW1lc3NhZ2UtY2hhbmdlJywge21lc3NhZ2UsIHR5cGU6ICdhZGQnfSlcbiAgICB9XG4gIH1cblxuICBkZWxldGVNZXNzYWdlKG1lc3NhZ2UpIHtcbiAgICBpZiAodGhpcy5tZXNzYWdlcy5oYXMobWVzc2FnZSkpIHtcbiAgICAgIHRoaXMubWVzc2FnZXMuZGVsZXRlKG1lc3NhZ2UpXG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLW1lc3NhZ2UtZGVsZXRlJywgbWVzc2FnZSlcbiAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtbWVzc2FnZS1jaGFuZ2UnLCB7bWVzc2FnZSwgdHlwZTogJ2RlbGV0ZSd9KVxuICAgIH1cbiAgfVxuXG4gIGNhbGN1bGF0ZUxpbmVNZXNzYWdlcyhyb3cpIHtcbiAgICBpZiAoYXRvbS5jb25maWcuZ2V0KCdsaW50ZXIuc2hvd0Vycm9yVGFiTGluZScpKSB7XG4gICAgICBpZiAocm93ID09PSBudWxsKSB7XG4gICAgICAgIHJvdyA9IHRoaXMuZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKCkucm93XG4gICAgICB9XG4gICAgICB0aGlzLmNvdW50TGluZU1lc3NhZ2VzID0gMFxuICAgICAgdGhpcy5tZXNzYWdlcy5mb3JFYWNoKG1lc3NhZ2UgPT4ge1xuICAgICAgICBpZiAobWVzc2FnZS5jdXJyZW50TGluZSA9IG1lc3NhZ2UucmFuZ2UgJiYgbWVzc2FnZS5yYW5nZS5pbnRlcnNlY3RzUm93KHJvdykpIHtcbiAgICAgICAgICB0aGlzLmNvdW50TGluZU1lc3NhZ2VzKytcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jb3VudExpbmVNZXNzYWdlcyA9IDBcbiAgICB9XG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1jYWxjdWxhdGUtbGluZS1tZXNzYWdlcycsIHRoaXMuY291bnRMaW5lTWVzc2FnZXMpXG4gICAgcmV0dXJuIHRoaXMuY291bnRMaW5lTWVzc2FnZXNcbiAgfVxuXG4gIGxpbnQob25DaGFuZ2UgPSBmYWxzZSkge1xuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdzaG91bGQtbGludCcsIG9uQ2hhbmdlKVxuICB9XG5cbiAgb25EaWRNZXNzYWdlQWRkKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLW1lc3NhZ2UtYWRkJywgY2FsbGJhY2spXG4gIH1cblxuICBvbkRpZE1lc3NhZ2VEZWxldGUoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtbWVzc2FnZS1kZWxldGUnLCBjYWxsYmFjaylcbiAgfVxuXG4gIG9uRGlkTWVzc2FnZUNoYW5nZShjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC1tZXNzYWdlLWNoYW5nZScsIGNhbGxiYWNrKVxuICB9XG5cbiAgb25EaWRDYWxjdWxhdGVMaW5lTWVzc2FnZXMoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtY2FsY3VsYXRlLWxpbmUtbWVzc2FnZXMnLCBjYWxsYmFjaylcbiAgfVxuXG4gIG9uU2hvdWxkVXBkYXRlQnViYmxlKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignc2hvdWxkLXVwZGF0ZS1idWJibGUnLCBjYWxsYmFjaylcbiAgfVxuXG4gIG9uU2hvdWxkTGludChjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ3Nob3VsZC1saW50JywgY2FsbGJhY2spXG4gIH1cblxuICBvbkRpZERlc3Ryb3koY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtZGVzdHJveScsIGNhbGxiYWNrKVxuICB9XG5cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWRlc3Ryb3knKVxuICAgIGlmICh0aGlzLm1hcmtlcnMuc2l6ZSkge1xuICAgICAgdGhpcy5tYXJrZXJzLmZvckVhY2gobWFya2VyID0+IG1hcmtlci5kZXN0cm95KCkpXG4gICAgICB0aGlzLm1hcmtlcnMuY2xlYXIoKVxuICAgIH1cbiAgICB0aGlzLnJlbW92ZUd1dHRlcigpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgIGlmICh0aGlzLmNoYW5nZVN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5jaGFuZ2VTdWJzY3JpcHRpb24uZGlzcG9zZSgpXG4gICAgfVxuICAgIHRoaXMuZW1pdHRlci5kaXNwb3NlKClcbiAgICB0aGlzLm1lc3NhZ2VzLmNsZWFyKClcbiAgfVxufVxuIl19
//# sourceURL=/Users/ah/.atom/packages/linter/lib/editor-linter.js
