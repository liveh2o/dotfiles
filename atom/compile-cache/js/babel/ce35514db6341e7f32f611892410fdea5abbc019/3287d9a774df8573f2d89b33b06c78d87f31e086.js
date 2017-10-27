var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _sbDebounce = require('sb-debounce');

var _sbDebounce2 = _interopRequireDefault(_sbDebounce);

var _helpers = require('./helpers');

var MessageRegistry = (function () {
  function MessageRegistry() {
    _classCallCheck(this, MessageRegistry);

    this.emitter = new _atom.Emitter();
    this.messages = [];
    this.messagesMap = new Set();
    this.subscriptions = new _atom.CompositeDisposable();
    this.debouncedUpdate = (0, _sbDebounce2['default'])(this.update, 100, true);

    this.subscriptions.add(this.emitter);
  }

  _createClass(MessageRegistry, [{
    key: 'set',
    value: function set(_ref) {
      var messages = _ref.messages;
      var linter = _ref.linter;
      var buffer = _ref.buffer;
      return (function () {
        var found = null;
        for (var entry of this.messagesMap) {
          if (entry.buffer === buffer && entry.linter === linter) {
            found = entry;
            break;
          }
        }

        if (found) {
          found.messages = messages;
          found.changed = true;
        } else {
          this.messagesMap.add({ messages: messages, linter: linter, buffer: buffer, oldMessages: [], changed: true, deleted: false });
        }
        this.debouncedUpdate();
      }).apply(this, arguments);
    }
  }, {
    key: 'update',
    value: function update() {
      var result = { added: [], removed: [], messages: [] };

      for (var entry of this.messagesMap) {
        if (entry.deleted) {
          result.removed = result.removed.concat(entry.oldMessages);
          this.messagesMap['delete'](entry);
          continue;
        }
        if (!entry.changed) {
          result.messages = result.messages.concat(entry.oldMessages);
          continue;
        }
        entry.changed = false;
        if (!entry.oldMessages.length) {
          // All messages are new, no need to diff
          // NOTE: No need to add .key here because normalizeMessages already does that
          result.added = result.added.concat(entry.messages);
          result.messages = result.messages.concat(entry.messages);
          entry.oldMessages = entry.messages;
          continue;
        }
        if (!entry.messages.length) {
          // All messages are old, no need to diff
          result.removed = result.removed.concat(entry.oldMessages);
          entry.oldMessages = [];
          continue;
        }

        var newKeys = new Set();
        var oldKeys = new Set();
        var _oldMessages = entry.oldMessages;
        var foundNew = false;
        entry.oldMessages = [];

        for (var i = 0, _length = _oldMessages.length; i < _length; ++i) {
          var message = _oldMessages[i];
          if (message.version === 2) {
            message.key = (0, _helpers.messageKey)(message);
          } else {
            message.key = (0, _helpers.messageKeyLegacy)(message);
          }
          oldKeys.add(message.key);
        }

        for (var i = 0, _length2 = entry.messages.length; i < _length2; ++i) {
          var message = entry.messages[i];
          if (newKeys.has(message.key)) {
            continue;
          }
          newKeys.add(message.key);
          if (!oldKeys.has(message.key)) {
            foundNew = true;
            result.added.push(message);
            result.messages.push(message);
            entry.oldMessages.push(message);
          }
        }

        if (!foundNew && entry.messages.length === _oldMessages.length) {
          // Messages are unchanged
          result.messages = result.messages.concat(_oldMessages);
          entry.oldMessages = _oldMessages;
          continue;
        }

        for (var i = 0, _length3 = _oldMessages.length; i < _length3; ++i) {
          var message = _oldMessages[i];
          if (newKeys.has(message.key)) {
            entry.oldMessages.push(message);
            result.messages.push(message);
          } else {
            result.removed.push(message);
          }
        }
      }

      if (result.added.length || result.removed.length) {
        this.messages = result.messages;
        this.emitter.emit('did-update-messages', result);
      }
    }
  }, {
    key: 'onDidUpdateMessages',
    value: function onDidUpdateMessages(callback) {
      return this.emitter.on('did-update-messages', callback);
    }
  }, {
    key: 'deleteByBuffer',
    value: function deleteByBuffer(buffer) {
      for (var entry of this.messagesMap) {
        if (entry.buffer === buffer) {
          entry.deleted = true;
        }
      }
      this.debouncedUpdate();
    }
  }, {
    key: 'deleteByLinter',
    value: function deleteByLinter(linter) {
      for (var entry of this.messagesMap) {
        if (entry.linter === linter) {
          entry.deleted = true;
        }
      }
      this.debouncedUpdate();
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
    }
  }]);

  return MessageRegistry;
})();

module.exports = MessageRegistry;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL21lc3NhZ2UtcmVnaXN0cnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O29CQUU2QyxNQUFNOzswQkFDOUIsYUFBYTs7Ozt1QkFFVyxXQUFXOztJQVlsRCxlQUFlO0FBT1IsV0FQUCxlQUFlLEdBT0w7MEJBUFYsZUFBZTs7QUFRakIsUUFBSSxDQUFDLE9BQU8sR0FBRyxtQkFBYSxDQUFBO0FBQzVCLFFBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFBO0FBQ2xCLFFBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTtBQUM1QixRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFBO0FBQzlDLFFBQUksQ0FBQyxlQUFlLEdBQUcsNkJBQVMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUE7O0FBRXZELFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtHQUNyQzs7ZUFmRyxlQUFlOztXQWdCaEIsYUFBQyxJQUE4RztVQUE1RyxRQUFRLEdBQVYsSUFBOEcsQ0FBNUcsUUFBUTtVQUFFLE1BQU0sR0FBbEIsSUFBOEcsQ0FBbEcsTUFBTTtVQUFFLE1BQU0sR0FBMUIsSUFBOEcsQ0FBMUYsTUFBTTswQkFBc0Y7QUFDbEgsWUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFBO0FBQ2hCLGFBQUssSUFBTSxLQUFLLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtBQUNwQyxjQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssTUFBTSxJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssTUFBTSxFQUFFO0FBQ3RELGlCQUFLLEdBQUcsS0FBSyxDQUFBO0FBQ2Isa0JBQUs7V0FDTjtTQUNGOztBQUVELFlBQUksS0FBSyxFQUFFO0FBQ1QsZUFBSyxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUE7QUFDekIsZUFBSyxDQUFD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LEVBQUUsQ0FBQTtLQUM3Qjs7O1NBeElHLGVBQWU7OztBQTJJckIsTUFBTSxDQUFDLE9BQU8sR0FBRyxlQUFlLENBQUEiLCJmaWxlIjoiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvbWVzc2FnZS1yZWdpc3RyeS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUsIEVtaXR0ZXIgfSBmcm9tICdhdG9tJ1xuaW1wb3J0IGRlYm91bmNlIGZyb20gJ3NiLWRlYm91bmNlJ1xuaW1wb3J0IHR5cGUgeyBEaXNwb3NhYmxlLCBUZXh0QnVmZmVyIH0gZnJvbSAnYXRvbSdcbmltcG9ydCB7IG1lc3NhZ2VLZXksIG1lc3NhZ2VLZXlMZWdhY3kgfSBmcm9tICcuL2hlbHBlcnMnXG5pbXBvcnQgdHlwZSB7IE1lc3NhZ2VzUGF0Y2gsIE1lc3NhZ2UsIE1lc3NhZ2VMZWdhY3ksIExpbnRlciB9IGZyb20gJy4vdHlwZXMnXG5cbnR5cGUgTGludGVyJE1lc3NhZ2UkTWFwID0ge1xuICBidWZmZXI6ID9UZXh0QnVmZmVyLFxuICBsaW50ZXI6IExpbnRlcixcbiAgY2hhbmdlZDogYm9vbGVhbixcbiAgZGVsZXRlZDogYm9vbGVhbixcbiAgbWVzc2FnZXM6IEFycmF5PE1lc3NhZ2UgfCBNZXNzYWdlTGVnYWN5PixcbiAgb2xkTWVzc2FnZXM6IEFycmF5PE1lc3NhZ2UgfCBNZXNzYWdlTGVnYWN5PlxufVxuXG5jbGFzcyBNZXNzYWdlUmVnaXN0cnkge1xuICBlbWl0dGVyOiBFbWl0dGVyO1xuICBtZXNzYWdlczogQXJyYXk8TWVzc2FnZSB8IE1lc3NhZ2VMZWdhY3k+O1xuICBtZXNzYWdlc01hcDogU2V0PExpbnRlciRNZXNzYWdlJE1hcD47XG4gIHN1YnNjcmlwdGlvbnM6IENvbXBvc2l0ZURpc3Bvc2FibGU7XG4gIGRlYm91bmNlZFVwZGF0ZTogKCgpID0+IHZvaWQpO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKClcbiAgICB0aGlzLm1lc3NhZ2VzID0gW11cbiAgICB0aGlzLm1lc3NhZ2VzTWFwID0gbmV3IFNldCgpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgIHRoaXMuZGVib3VuY2VkVXBkYXRlID0gZGVib3VuY2UodGhpcy51cGRhdGUsIDEwMCwgdHJ1ZSlcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5lbWl0dGVyKVxuICB9XG4gIHNldCh7IG1lc3NhZ2VzLCBsaW50ZXIsIGJ1ZmZlciB9OiB7IG1lc3NhZ2VzOiBBcnJheTxNZXNzYWdlIHwgTWVzc2FnZUxlZ2FjeT4sIGxpbnRlcjogTGludGVyLCBidWZmZXI6IFRleHRCdWZmZXIgfSkge1xuICAgIGxldCBmb3VuZCA9IG51bGxcbiAgICBmb3IgKGNvbnN0IGVudHJ5IG9mIHRoaXMubWVzc2FnZXNNYXApIHtcbiAgICAgIGlmIChlbnRyeS5idWZmZXIgPT09IGJ1ZmZlciAmJiBlbnRyeS5saW50ZXIgPT09IGxpbnRlcikge1xuICAgICAgICBmb3VuZCA9IGVudHJ5XG4gICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGZvdW5kKSB7XG4gICAgICBmb3VuZC5tZXNzYWdlcyA9IG1lc3NhZ2VzXG4gICAgICBmb3VuZC5jaGFuZ2VkID0gdHJ1ZVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm1lc3NhZ2VzTWFwLmFkZCh7IG1lc3NhZ2VzLCBsaW50ZXIsIGJ1ZmZlciwgb2xkTWVzc2FnZXM6IFtdLCBjaGFuZ2VkOiB0cnVlLCBkZWxldGVkOiBmYWxzZSB9KVxuICAgIH1cbiAgICB0aGlzLmRlYm91bmNlZFVwZGF0ZSgpXG4gIH1cbiAgdXBkYXRlKCkge1xuICAgIGNvbnN0IHJlc3VsdCA9IHsgYWRkZWQ6IFtdLCByZW1vdmVkOiBbXSwgbWVzc2FnZXM6IFtdIH1cblxuICAgIGZvciAoY29uc3QgZW50cnkgb2YgdGhpcy5tZXNzYWdlc01hcCkge1xuICAgICAgaWYgKGVudHJ5LmRlbGV0ZWQpIHtcbiAgICAgICAgcmVzdWx0LnJlbW92ZWQgPSByZXN1bHQucmVtb3ZlZC5jb25jYXQoZW50cnkub2xkTWVzc2FnZXMpXG4gICAgICAgIHRoaXMubWVzc2FnZXNNYXAuZGVsZXRlKGVudHJ5KVxuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuICAgICAgaWYgKCFlbnRyeS5jaGFuZ2VkKSB7XG4gICAgICAgIHJlc3VsdC5tZXNzYWdlcyA9IHJlc3VsdC5tZXNzYWdlcy5jb25jYXQoZW50cnkub2xkTWVzc2FnZXMpXG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG4gICAgICBlbnRyeS5jaGFuZ2VkID0gZmFsc2VcbiAgICAgIGlmICghZW50cnkub2xkTWVzc2FnZXMubGVuZ3RoKSB7XG4gICAgICAgIC8vIEFsbCBtZXNzYWdlcyBhcmUgbmV3LCBubyBuZWVkIHRvIGRpZmZcbiAgICAgICAgLy8gTk9URTogTm8gbmVlZCB0byBhZGQgLmtleSBoZXJlIGJlY2F1c2Ugbm9ybWFsaXplTWVzc2FnZXMgYWxyZWFkeSBkb2VzIHRoYXRcbiAgICAgICAgcmVzdWx0LmFkZGVkID0gcmVzdWx0LmFkZGVkLmNvbmNhdChlbnRyeS5tZXNzYWdlcylcbiAgICAgICAgcmVzdWx0Lm1lc3NhZ2VzID0gcmVzdWx0Lm1lc3NhZ2VzLmNvbmNhdChlbnRyeS5tZXNzYWdlcylcbiAgICAgICAgZW50cnkub2xkTWVzc2FnZXMgPSBlbnRyeS5tZXNzYWdlc1xuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuICAgICAgaWYgKCFlbnRyeS5tZXNzYWdlcy5sZW5ndGgpIHtcbiAgICAgICAgLy8gQWxsIG1lc3NhZ2VzIGFyZSBvbGQsIG5vIG5lZWQgdG8gZGlmZlxuICAgICAgICByZXN1bHQucmVtb3ZlZCA9IHJlc3VsdC5yZW1vdmVkLmNvbmNhdChlbnRyeS5vbGRNZXNzYWdlcylcbiAgICAgICAgZW50cnkub2xkTWVzc2FnZXMgPSBbXVxuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuXG4gICAgICBjb25zdCBuZXdLZXlzID0gbmV3IFNldCgpXG4gICAgICBjb25zdCBvbGRLZXlzID0gbmV3IFNldCgpXG4gICAgICBjb25zdCBvbGRNZXNzYWdlcyA9IGVudHJ5Lm9sZE1lc3NhZ2VzXG4gICAgICBsZXQgZm91bmROZXcgPSBmYWxzZVxuICAgICAgZW50cnkub2xkTWVzc2FnZXMgPSBbXVxuXG4gICAgICBmb3IgKGxldCBpID0gMCwgbGVuZ3RoID0gb2xkTWVzc2FnZXMubGVuZ3RoOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgICAgY29uc3QgbWVzc2FnZSA9IG9sZE1lc3NhZ2VzW2ldXG4gICAgICAgIGlmIChtZXNzYWdlLnZlcnNpb24gPT09IDIpIHtcbiAgICAgICAgICBtZXNzYWdlLmtleSA9IG1lc3NhZ2VLZXkobWVzc2FnZSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtZXNzYWdlLmtleSA9IG1lc3NhZ2VLZXlMZWdhY3kobWVzc2FnZSlcbiAgICAgICAgfVxuICAgICAgICBvbGRLZXlzLmFkZChtZXNzYWdlLmtleSlcbiAgICAgIH1cblxuICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbmd0aCA9IGVudHJ5Lm1lc3NhZ2VzLmxlbmd0aDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBlbnRyeS5tZXNzYWdlc1tpXVxuICAgICAgICBpZiAobmV3S2V5cy5oYXMobWVzc2FnZS5rZXkpKSB7XG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfVxuICAgICAgICBuZXdLZXlzLmFkZChtZXNzYWdlLmtleSlcbiAgICAgICAgaWYgKCFvbGRLZXlzLmhhcyhtZXNzYWdlLmtleSkpIHtcbiAgICAgICAgICBmb3VuZE5ldyA9IHRydWVcbiAgICAgICAgICByZXN1bHQuYWRkZWQucHVzaChtZXNzYWdlKVxuICAgICAgICAgIHJlc3VsdC5tZXNzYWdlcy5wdXNoKG1lc3NhZ2UpXG4gICAgICAgICAgZW50cnkub2xkTWVzc2FnZXMucHVzaChtZXNzYWdlKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICghZm91bmROZXcgJiYgZW50cnkubWVzc2FnZXMubGVuZ3RoID09PSBvbGRNZXNzYWdlcy5sZW5ndGgpIHtcbiAgICAgICAgLy8gTWVzc2FnZXMgYXJlIHVuY2hhbmdlZFxuICAgICAgICByZXN1bHQubWVzc2FnZXMgPSByZXN1bHQubWVzc2FnZXMuY29uY2F0KG9sZE1lc3NhZ2VzKVxuICAgICAgICBlbnRyeS5vbGRNZXNzYWdlcyA9IG9sZE1lc3NhZ2VzXG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG5cbiAgICAgIGZvciAobGV0IGkgPSAwLCBsZW5ndGggPSBvbGRNZXNzYWdlcy5sZW5ndGg7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgICBjb25zdCBtZXNzYWdlID0gb2xkTWVzc2FnZXNbaV1cbiAgICAgICAgaWYgKG5ld0tleXMuaGFzKG1lc3NhZ2Uua2V5KSkge1xuICAgICAgICAgIGVudHJ5Lm9sZE1lc3NhZ2VzLnB1c2gobWVzc2FnZSlcbiAgICAgICAgICByZXN1bHQubWVzc2FnZXMucHVzaChtZXNzYWdlKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc3VsdC5yZW1vdmVkLnB1c2gobWVzc2FnZSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChyZXN1bHQuYWRkZWQubGVuZ3RoIHx8IHJlc3VsdC5yZW1vdmVkLmxlbmd0aCkge1xuICAgICAgdGhpcy5tZXNzYWdlcyA9IHJlc3VsdC5tZXNzYWdlc1xuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC11cGRhdGUtbWVzc2FnZXMnLCByZXN1bHQpXG4gICAgfVxuICB9XG4gIG9uRGlkVXBkYXRlTWVzc2FnZXMoY2FsbGJhY2s6ICgoZGlmZmVyZW5jZTogTWVzc2FnZXNQYXRjaCkgPT4gdm9pZCkpOiBEaXNwb3NhYmxlIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtdXBkYXRlLW1lc3NhZ2VzJywgY2FsbGJhY2spXG4gIH1cbiAgZGVsZXRlQnlCdWZmZXIoYnVmZmVyOiBUZXh0QnVmZmVyKSB7XG4gICAgZm9yIChjb25zdCBlbnRyeSBvZiB0aGlzLm1lc3NhZ2VzTWFwKSB7XG4gICAgICBpZiAoZW50cnkuYnVmZmVyID09PSBidWZmZXIpIHtcbiAgICAgICAgZW50cnkuZGVsZXRlZCA9IHRydWVcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5kZWJvdW5jZWRVcGRhdGUoKVxuICB9XG4gIGRlbGV0ZUJ5TGludGVyKGxpbnRlcjogTGludGVyKSB7XG4gICAgZm9yIChjb25zdCBlbnRyeSBvZiB0aGlzLm1lc3NhZ2VzTWFwKSB7XG4gICAgICBpZiAoZW50cnkubGludGVyID09PSBsaW50ZXIpIHtcbiAgICAgICAgZW50cnkuZGVsZXRlZCA9IHRydWVcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5kZWJvdW5jZWRVcGRhdGUoKVxuICB9XG4gIGRpc3Bvc2UoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTWVzc2FnZVJlZ2lzdHJ5XG4iXX0=