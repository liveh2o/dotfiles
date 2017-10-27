var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

'use babel';

var Validate = require('./validate');
var Helpers = require('./helpers');

var MessageRegistry = (function () {
  function MessageRegistry() {
    var _this = this;

    _classCallCheck(this, MessageRegistry);

    this.hasChanged = false;
    this.shouldRefresh = true;
    this.publicMessages = [];
    this.subscriptions = new _atom.CompositeDisposable();
    this.emitter = new _atom.Emitter();
    this.linterResponses = new Map();
    this.messages = new Map();

    this.subscriptions.add(this.emitter);
    this.subscriptions.add(atom.config.observe('linter.ignoredMessageTypes', function (value) {
      return _this.ignoredMessageTypes = value || [];
    }));

    var UpdateMessages = function UpdateMessages() {
      if (_this.shouldRefresh) {
        if (_this.hasChanged) {
          _this.hasChanged = false;
          _this.updatePublic();
        }
        Helpers.requestUpdateFrame(UpdateMessages);
      }
    };
    Helpers.requestUpdateFrame(UpdateMessages);
  }

  _createClass(MessageRegistry, [{
    key: 'set',
    value: function set(_ref) {
      var _this2 = this;

      var linter = _ref.linter;
      var messages = _ref.messages;
      var editorLinter = _ref.editorLinter;

      if (linter.deactivated) {
        return;
      }
      try {
        Validate.messages(messages, linter);
      } catch (e) {
        return Helpers.error(e);
      }
      messages = messages.filter(function (i) {
        return _this2.ignoredMessageTypes.indexOf(i.type) === -1;
      });
      if (linter.scope === 'file') {
        if (!editorLinter) {
          throw new Error('Given editor is not really an editor');
        }
        if (!editorLinter.editor.isAlive()) {
          return;
        }
        if (!this.messages.has(editorLinter)) {
          this.messages.set(editorLinter, new Map());
        }
        this.messages.get(editorLinter).set(linter, messages);
      } else {
        // It's project
        this.linterResponses.set(linter, messages);
      }
      this.hasChanged = true;
    }
  }, {
    key: 'updatePublic',
    value: function updatePublic() {
      var latestMessages = [];
      var publicMessages = [];
      var added = [];
      var removed = [];
      var currentKeys = undefined;
      var lastKeys = undefined;

      this.linterResponses.forEach(function (messages) {
        return latestMessages = latestMessages.concat(messages);
      });
      this.messages.forEach(function (bufferMessages) {
        return bufferMessages.forEach(function (messages) {
          return latestMessages = latestMessages.concat(messages);
        });
      });

      currentKeys = latestMessages.map(function (i) {
        return i.key;
      });
      lastKeys = this.publicMessages.map(function (i) {
        return i.key;
      });

      for (var i of latestMessages) {
        if (lastKeys.indexOf(i.key) === -1) {
          added.push(i);
          publicMessages.push(i);
        }
      }

      for (var i of this.publicMessages) {
        if (currentKeys.indexOf(i.key) === -1) {
          removed.push(i);
        } else publicMessages.push(i);
      }this.publicMessages = publicMessages;
      this.emitter.emit('did-update-messages', { added: added, removed: removed, messages: publicMessages });
    }
  }, {
    key: 'onDidUpdateMessages',
    value: function onDidUpdateMessages(callback) {
      return this.emitter.on('did-update-messages', callback);
    }
  }, {
    key: 'deleteMessages',
    value: function deleteMessages(linter) {
      if (linter.scope === 'file') {
        this.messages.forEach(function (r) {
          return r['delete'](linter);
        });
        this.hasChanged = true;
      } else if (this.linterResponses.has(linter)) {
        this.linterResponses['delete'](linter);
        this.hasChanged = true;
      }
    }
  }, {
    key: 'deleteEditorMessages',
    value: function deleteEditorMessages(editorLinter) {
      if (this.messages.has(editorLinter)) {
        this.messages['delete'](editorLinter);
        this.hasChanged = true;
      }
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.shouldRefresh = false;
      this.subscriptions.dispose();
      this.linterResponses.clear();
      this.messages.clear();
    }
  }]);

  return MessageRegistry;
})();

module.exports = MessageRegistry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL21lc3NhZ2UtcmVnaXN0cnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztvQkFDMkMsTUFBTTs7QUFEakQsV0FBVyxDQUFBOztBQUdYLElBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQTtBQUN0QyxJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUE7O0lBRTlCLGVBQWU7QUFDUixXQURQLGVBQWUsR0FDTDs7OzBCQURWLGVBQWU7O0FBRWpCLFFBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFBO0FBQ3ZCLFFBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFBO0FBQ3pCLFFBQUksQ0FBQyxjQUFjLEdBQUcsRUFBRSxDQUFBO0FBQ3hCLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7QUFDOUMsUUFBSSxDQUFDLE9BQU8sR0FBRyxtQkFBYSxDQUFBO0FBQzVCLFFBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTtBQUNoQyxRQUFJLENBQUMsUUFBUSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7O0FBRXpCLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUNwQyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyw0QkFBNEIsRUFBRSxVQUFBLEtBQUs7YUFBSSxNQUFLLG1CQUFtQixHQUFJLEtBQUssSUFBSSxFQUFFLEFBQUM7S0FBQSxDQUFDLENBQUMsQ0FBQTs7QUFFNUgsUUFBTSxjQUFjLEdBQUcsU0FBakIsY0FBYyxHQUFTO0FBQzNCLFVBQUksTUFBSyxhQUFhLEVBQUU7QUFDdEIsWUFBSSxNQUFLLFVBQVUsRUFBRTtBQUNuQixnQkFBSyxVQUFVLEdBQUcsS0FBSyxDQUFBO0FBQ3ZCLGdCQUFLLFlB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QyxVQUFVLEdBQUcsSUFBSSxDQUFBO09BQ3ZCO0tBQ0Y7OztXQUNtQiw4QkFBQyxZQUFZLEVBQUU7QUFDakMsVUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsRUFBRTtBQUNuQyxZQUFJLENBQUMsUUFBUSxVQUFPLENBQUMsWUFBWSxDQUFDLENBQUE7QUFDbEMsWUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUE7T0FDdkI7S0FDRjs7O1dBQ00sbUJBQUc7QUFDUixVQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQTtBQUMxQixVQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQzVCLFVBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUFFLENBQUE7QUFDNUIsVUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtLQUN0Qjs7O1NBdEdHLGVBQWU7OztBQXlHckIsTUFBTSxDQUFDLE9BQU8sR0FBRyxlQUFlLENBQUEiLCJmaWxlIjoiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvbWVzc2FnZS1yZWdpc3RyeS5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5pbXBvcnQge0VtaXR0ZXIsIENvbXBvc2l0ZURpc3Bvc2FibGV9IGZyb20gJ2F0b20nXG5cbmNvbnN0IFZhbGlkYXRlID0gcmVxdWlyZSgnLi92YWxpZGF0ZScpXG5jb25zdCBIZWxwZXJzID0gcmVxdWlyZSgnLi9oZWxwZXJzJylcblxuY2xhc3MgTWVzc2FnZVJlZ2lzdHJ5IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5oYXNDaGFuZ2VkID0gZmFsc2VcbiAgICB0aGlzLnNob3VsZFJlZnJlc2ggPSB0cnVlXG4gICAgdGhpcy5wdWJsaWNNZXNzYWdlcyA9IFtdXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKClcbiAgICB0aGlzLmxpbnRlclJlc3BvbnNlcyA9IG5ldyBNYXAoKVxuICAgIHRoaXMubWVzc2FnZXMgPSBuZXcgTWFwKClcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5lbWl0dGVyKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLmlnbm9yZWRNZXNzYWdlVHlwZXMnLCB2YWx1ZSA9PiB0aGlzLmlnbm9yZWRNZXNzYWdlVHlwZXMgPSAodmFsdWUgfHwgW10pKSlcblxuICAgIGNvbnN0IFVwZGF0ZU1lc3NhZ2VzID0gKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuc2hvdWxkUmVmcmVzaCkge1xuICAgICAgICBpZiAodGhpcy5oYXNDaGFuZ2VkKSB7XG4gICAgICAgICAgdGhpcy5oYXNDaGFuZ2VkID0gZmFsc2VcbiAgICAgICAgICB0aGlzLnVwZGF0ZVB1YmxpYygpXG4gICAgICAgIH1cbiAgICAgICAgSGVscGVycy5yZXF1ZXN0VXBkYXRlRnJhbWUoVXBkYXRlTWVzc2FnZXMpXG4gICAgICB9XG4gICAgfVxuICAgIEhlbHBlcnMucmVxdWVzdFVwZGF0ZUZyYW1lKFVwZGF0ZU1lc3NhZ2VzKVxuICB9XG4gIHNldCh7bGludGVyLCBtZXNzYWdlcywgZWRpdG9yTGludGVyfSkge1xuICAgIGlmIChsaW50ZXIuZGVhY3RpdmF0ZWQpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICB0cnkge1xuICAgICAgVmFsaWRhdGUubWVzc2FnZXMobWVzc2FnZXMsIGxpbnRlcilcbiAgICB9IGNhdGNoIChlKSB7IHJldHVybiBIZWxwZXJzLmVycm9yKGUpIH1cbiAgICBtZXNzYWdlcyA9IG1lc3NhZ2VzLmZpbHRlcihpID0+IHRoaXMuaWdub3JlZE1lc3NhZ2VUeXBlcy5pbmRleE9mKGkudHlwZSkgPT09IC0xKVxuICAgIGlmIChsaW50ZXIuc2NvcGUgPT09ICdmaWxlJykge1xuICAgICAgaWYgKCFlZGl0b3JMaW50ZXIpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdHaXZlbiBlZGl0b3IgaXMgbm90IHJlYWxseSBhbiBlZGl0b3InKVxuICAgICAgfVxuICAgICAgaWYgKCFlZGl0b3JMaW50ZXIuZWRpdG9yLmlzQWxpdmUoKSkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIGlmICghdGhpcy5tZXNzYWdlcy5oYXMoZWRpdG9yTGludGVyKSkge1xuICAgICAgICB0aGlzLm1lc3NhZ2VzLnNldChlZGl0b3JMaW50ZXIsIG5ldyBNYXAoKSlcbiAgICAgIH1cbiAgICAgIHRoaXMubWVzc2FnZXMuZ2V0KGVkaXRvckxpbnRlcikuc2V0KGxpbnRlciwgbWVzc2FnZXMpXG4gICAgfSBlbHNlIHsgLy8gSXQncyBwcm9qZWN0XG4gICAgICB0aGlzLmxpbnRlclJlc3BvbnNlcy5zZXQobGludGVyLCBtZXNzYWdlcylcbiAgICB9XG4gICAgdGhpcy5oYXNDaGFuZ2VkID0gdHJ1ZVxuICB9XG4gIHVwZGF0ZVB1YmxpYygpIHtcbiAgICBsZXQgbGF0ZXN0TWVzc2FnZXMgPSBbXVxuICAgIGxldCBwdWJsaWNNZXNzYWdlcyA9IFtdXG4gICAgbGV0IGFkZGVkID0gW11cbiAgICBsZXQgcmVtb3ZlZCA9IFtdXG4gICAgbGV0IGN1cnJlbnRLZXlzXG4gICAgbGV0IGxhc3RLZXlzXG5cbiAgICB0aGlzLmxpbnRlclJlc3BvbnNlcy5mb3JFYWNoKG1lc3NhZ2VzID0+IGxhdGVzdE1lc3NhZ2VzID0gbGF0ZXN0TWVzc2FnZXMuY29uY2F0KG1lc3NhZ2VzKSlcbiAgICB0aGlzLm1lc3NhZ2VzLmZvckVhY2goYnVmZmVyTWVzc2FnZXMgPT5cbiAgICAgIGJ1ZmZlck1lc3NhZ2VzLmZvckVhY2gobWVzc2FnZXMgPT4gbGF0ZXN0TWVzc2FnZXMgPSBsYXRlc3RNZXNzYWdlcy5jb25jYXQobWVzc2FnZXMpKVxuICAgIClcblxuICAgIGN1cnJlbnRLZXlzID0gbGF0ZXN0TWVzc2FnZXMubWFwKGkgPT4gaS5rZXkpXG4gICAgbGFzdEtleXMgPSB0aGlzLnB1YmxpY01lc3NhZ2VzLm1hcChpID0+IGkua2V5KVxuXG4gICAgZm9yIChsZXQgaSBvZiBsYXRlc3RNZXNzYWdlcykge1xuICAgICAgaWYgKGxhc3RLZXlzLmluZGV4T2YoaS5rZXkpID09PSAtMSkge1xuICAgICAgICBhZGRlZC5wdXNoKGkpXG4gICAgICAgIHB1YmxpY01lc3NhZ2VzLnB1c2goaSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGxldCBpIG9mIHRoaXMucHVibGljTWVzc2FnZXMpXG4gICAgICBpZiAoY3VycmVudEtleXMuaW5kZXhPZihpLmtleSkgPT09IC0xKSB7XG4gICAgICAgIHJlbW92ZWQucHVzaChpKVxuICAgICAgfSBlbHNlIHB1YmxpY01lc3NhZ2VzLnB1c2goaSlcblxuICAgIHRoaXMucHVibGljTWVzc2FnZXMgPSBwdWJsaWNNZXNzYWdlc1xuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtdXBkYXRlLW1lc3NhZ2VzJywge2FkZGVkLCByZW1vdmVkLCBtZXNzYWdlczogcHVibGljTWVzc2FnZXN9KVxuICB9XG4gIG9uRGlkVXBkYXRlTWVzc2FnZXMoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtdXBkYXRlLW1lc3NhZ2VzJywgY2FsbGJhY2spXG4gIH1cbiAgZGVsZXRlTWVzc2FnZXMobGludGVyKSB7XG4gICAgaWYgKGxpbnRlci5zY29wZSA9PT0gJ2ZpbGUnKSB7XG4gICAgICB0aGlzLm1lc3NhZ2VzLmZvckVhY2gociA9PiByLmRlbGV0ZShsaW50ZXIpKVxuICAgICAgdGhpcy5oYXNDaGFuZ2VkID0gdHJ1ZVxuICAgIH0gZWxzZSBpZih0aGlzLmxpbnRlclJlc3BvbnNlcy5oYXMobGludGVyKSkge1xuICAgICAgdGhpcy5saW50ZXJSZXNwb25zZXMuZGVsZXRlKGxpbnRlcilcbiAgICAgIHRoaXMuaGFzQ2hhbmdlZCA9IHRydWVcbiAgICB9XG4gIH1cbiAgZGVsZXRlRWRpdG9yTWVzc2FnZXMoZWRpdG9yTGludGVyKSB7XG4gICAgaWYgKHRoaXMubWVzc2FnZXMuaGFzKGVkaXRvckxpbnRlcikpIHtcbiAgICAgIHRoaXMubWVzc2FnZXMuZGVsZXRlKGVkaXRvckxpbnRlcilcbiAgICAgIHRoaXMuaGFzQ2hhbmdlZCA9IHRydWVcbiAgICB9XG4gIH1cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLnNob3VsZFJlZnJlc2ggPSBmYWxzZVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICB0aGlzLmxpbnRlclJlc3BvbnNlcy5jbGVhcigpXG4gICAgdGhpcy5tZXNzYWdlcy5jbGVhcigpXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBNZXNzYWdlUmVnaXN0cnlcbiJdfQ==
//# sourceURL=/Users/ah/.atom/packages/linter/lib/message-registry.js
