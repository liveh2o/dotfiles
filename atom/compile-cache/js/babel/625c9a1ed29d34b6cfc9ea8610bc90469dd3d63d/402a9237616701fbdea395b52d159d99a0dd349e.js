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
    this.editorMessages = new Map();

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
      var editor = _ref.editor;

      if (linter.deactivated) return;
      try {
        Validate.messages(messages);
      } catch (e) {
        return Helpers.error(e);
      }
      messages = messages.filter(function (i) {
        return _this2.ignoredMessageTypes.indexOf(i.type) === -1;
      });
      if (linter.scope === 'file') {
        if (!editor.alive) return;
        if (!(editor instanceof _atom.TextEditor)) throw new Error("Given editor isn't really an editor");
        if (!this.editorMessages.has(editor)) this.editorMessages.set(editor, new Map());
        this.editorMessages.get(editor).set(linter, messages);
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
      this.editorMessages.forEach(function (editorMessages) {
        return editorMessages.forEach(function (messages) {
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
        if (currentKeys.indexOf(i.key) === -1) removed.push(i);else publicMessages.push(i);
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
        this.editorMessages.forEach(function (r) {
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
    value: function deleteEditorMessages(editor) {
      if (!this.editorMessages.has(editor)) return;
      this.editorMessages['delete'](editor);
      this.hasChanged = true;
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.shouldRefresh = false;
      this.subscriptions.dispose();
      this.linterResponses.clear();
      this.editorMessages.clear();
    }
  }]);

  return MessageRegistry;
})();

module.exports = MessageRegistry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL21lc3NhZ2UtcmVnaXN0cnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztvQkFDdUQsTUFBTTs7QUFEN0QsV0FBVyxDQUFBOztBQUdYLElBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQTtBQUN0QyxJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUE7O0lBRTlCLGVBQWU7QUFDUixXQURQLGVBQWUsR0FDTDs7OzBCQURWLGVBQWU7O0FBRWpCLFFBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFBO0FBQ3ZCLFFBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFBO0FBQ3pCLFFBQUksQ0FBQyxjQUFjLEdBQUcsRUFBRSxDQUFBO0FBQ3hCLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7QUFDOUMsUUFBSSxDQUFDLE9BQU8sR0FBRyxtQkFBYSxDQUFBO0FBQzVCLFFBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTtBQUNoQyxRQUFJLENBQUMsY0FBYyxHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7O0FBRS9CLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUNwQyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyw0QkFBNEIsRUFBRSxVQUFBLEtBQUs7YUFBSSxNQUFLLG1CQUFtQixHQUFJLEtBQUssSUFBSSxFQUFFLEFBQUM7S0FBQSxDQUFDLENBQUMsQ0FBQTs7QUFFNUgsUUFBTSxjQUFjLEdBQUcsU0FBakIsY0FBYyxHQUFTO0FBQzNCLFVBQUksTUFBSyxhQUFhLEVBQUU7QUFDdEIsWUFBSSxNQUFLLFVBQVUsRUFBRTtBQUNuQixnQkFBSyxVQUFVLEdBQUcsS0FBSyxDQUFBO0FBQ3ZCLGdCQUFLLFlB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Q0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxPQUFNO0FBQzVDLFVBQUksQ0FBQyxjQUFjLFVBQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUNsQyxVQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQTtLQUN2Qjs7O1dBQ00sbUJBQUc7QUFDUixVQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQTtBQUMxQixVQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQzVCLFVBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUFFLENBQUE7QUFDNUIsVUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtLQUM1Qjs7O1NBL0ZHLGVBQWU7OztBQWtHckIsTUFBTSxDQUFDLE9BQU8sR0FBRyxlQUFlLENBQUEiLCJmaWxlIjoiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvbWVzc2FnZS1yZWdpc3RyeS5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5pbXBvcnQge0VtaXR0ZXIsIFRleHRFZGl0b3IsIENvbXBvc2l0ZURpc3Bvc2FibGV9IGZyb20gJ2F0b20nXG5cbmNvbnN0IFZhbGlkYXRlID0gcmVxdWlyZSgnLi92YWxpZGF0ZScpXG5jb25zdCBIZWxwZXJzID0gcmVxdWlyZSgnLi9oZWxwZXJzJylcblxuY2xhc3MgTWVzc2FnZVJlZ2lzdHJ5IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5oYXNDaGFuZ2VkID0gZmFsc2VcbiAgICB0aGlzLnNob3VsZFJlZnJlc2ggPSB0cnVlXG4gICAgdGhpcy5wdWJsaWNNZXNzYWdlcyA9IFtdXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKClcbiAgICB0aGlzLmxpbnRlclJlc3BvbnNlcyA9IG5ldyBNYXAoKVxuICAgIHRoaXMuZWRpdG9yTWVzc2FnZXMgPSBuZXcgTWFwKClcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5lbWl0dGVyKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLmlnbm9yZWRNZXNzYWdlVHlwZXMnLCB2YWx1ZSA9PiB0aGlzLmlnbm9yZWRNZXNzYWdlVHlwZXMgPSAodmFsdWUgfHwgW10pKSlcblxuICAgIGNvbnN0IFVwZGF0ZU1lc3NhZ2VzID0gKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuc2hvdWxkUmVmcmVzaCkge1xuICAgICAgICBpZiAodGhpcy5oYXNDaGFuZ2VkKSB7XG4gICAgICAgICAgdGhpcy5oYXNDaGFuZ2VkID0gZmFsc2VcbiAgICAgICAgICB0aGlzLnVwZGF0ZVB1YmxpYygpXG4gICAgICAgIH1cbiAgICAgICAgSGVscGVycy5yZXF1ZXN0VXBkYXRlRnJhbWUoVXBkYXRlTWVzc2FnZXMpXG4gICAgICB9XG4gICAgfVxuICAgIEhlbHBlcnMucmVxdWVzdFVwZGF0ZUZyYW1lKFVwZGF0ZU1lc3NhZ2VzKVxuICB9XG4gIHNldCh7bGludGVyLCBtZXNzYWdlcywgZWRpdG9yfSkge1xuICAgIGlmIChsaW50ZXIuZGVhY3RpdmF0ZWQpIHJldHVyblxuICAgIHRyeSB7XG4gICAgICBWYWxpZGF0ZS5tZXNzYWdlcyhtZXNzYWdlcylcbiAgICB9IGNhdGNoIChlKSB7IHJldHVybiBIZWxwZXJzLmVycm9yKGUpIH1cbiAgICBtZXNzYWdlcyA9IG1lc3NhZ2VzLmZpbHRlcihpID0+IHRoaXMuaWdub3JlZE1lc3NhZ2VUeXBlcy5pbmRleE9mKGkudHlwZSkgPT09IC0xKVxuICAgIGlmIChsaW50ZXIuc2NvcGUgPT09ICdmaWxlJykge1xuICAgICAgaWYgKCFlZGl0b3IuYWxpdmUpIHJldHVyblxuICAgICAgaWYgKCEoZWRpdG9yIGluc3RhbmNlb2YgVGV4dEVkaXRvcikpIHRocm93IG5ldyBFcnJvcihcIkdpdmVuIGVkaXRvciBpc24ndCByZWFsbHkgYW4gZWRpdG9yXCIpXG4gICAgICBpZiAoIXRoaXMuZWRpdG9yTWVzc2FnZXMuaGFzKGVkaXRvcikpXG4gICAgICAgIHRoaXMuZWRpdG9yTWVzc2FnZXMuc2V0KGVkaXRvciwgbmV3IE1hcCgpKVxuICAgICAgdGhpcy5lZGl0b3JNZXNzYWdlcy5nZXQoZWRpdG9yKS5zZXQobGludGVyLCBtZXNzYWdlcylcbiAgICB9IGVsc2UgeyAvLyBJdCdzIHByb2plY3RcbiAgICAgIHRoaXMubGludGVyUmVzcG9uc2VzLnNldChsaW50ZXIsIG1lc3NhZ2VzKVxuICAgIH1cbiAgICB0aGlzLmhhc0NoYW5nZWQgPSB0cnVlXG4gIH1cbiAgdXBkYXRlUHVibGljKCkge1xuICAgIGxldCBsYXRlc3RNZXNzYWdlcyA9IFtdXG4gICAgbGV0IHB1YmxpY01lc3NhZ2VzID0gW11cbiAgICBsZXQgYWRkZWQgPSBbXVxuICAgIGxldCByZW1vdmVkID0gW11cbiAgICBsZXQgY3VycmVudEtleXNcbiAgICBsZXQgbGFzdEtleXNcblxuICAgIHRoaXMubGludGVyUmVzcG9uc2VzLmZvckVhY2gobWVzc2FnZXMgPT4gbGF0ZXN0TWVzc2FnZXMgPSBsYXRlc3RNZXNzYWdlcy5jb25jYXQobWVzc2FnZXMpKVxuICAgIHRoaXMuZWRpdG9yTWVzc2FnZXMuZm9yRWFjaChlZGl0b3JNZXNzYWdlcyA9PlxuICAgICAgZWRpdG9yTWVzc2FnZXMuZm9yRWFjaChtZXNzYWdlcyA9PiBsYXRlc3RNZXNzYWdlcyA9IGxhdGVzdE1lc3NhZ2VzLmNvbmNhdChtZXNzYWdlcykpXG4gICAgKVxuXG4gICAgY3VycmVudEtleXMgPSBsYXRlc3RNZXNzYWdlcy5tYXAoaSA9PiBpLmtleSlcbiAgICBsYXN0S2V5cyA9IHRoaXMucHVibGljTWVzc2FnZXMubWFwKGkgPT4gaS5rZXkpXG5cbiAgICBmb3IgKGxldCBpIG9mIGxhdGVzdE1lc3NhZ2VzKSB7XG4gICAgICBpZiAobGFzdEtleXMuaW5kZXhPZihpLmtleSkgPT09IC0xKSB7XG4gICAgICAgIGFkZGVkLnB1c2goaSlcbiAgICAgICAgcHVibGljTWVzc2FnZXMucHVzaChpKVxuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAobGV0IGkgb2YgdGhpcy5wdWJsaWNNZXNzYWdlcylcbiAgICAgIGlmIChjdXJyZW50S2V5cy5pbmRleE9mKGkua2V5KSA9PT0gLTEpXG4gICAgICAgIHJlbW92ZWQucHVzaChpKVxuICAgICAgZWxzZVxuICAgICAgICBwdWJsaWNNZXNzYWdlcy5wdXNoKGkpXG5cbiAgICB0aGlzLnB1YmxpY01lc3NhZ2VzID0gcHVibGljTWVzc2FnZXNcbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLXVwZGF0ZS1tZXNzYWdlcycsIHthZGRlZCwgcmVtb3ZlZCwgbWVzc2FnZXM6IHB1YmxpY01lc3NhZ2VzfSlcbiAgfVxuICBvbkRpZFVwZGF0ZU1lc3NhZ2VzKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLXVwZGF0ZS1tZXNzYWdlcycsIGNhbGxiYWNrKVxuICB9XG4gIGRlbGV0ZU1lc3NhZ2VzKGxpbnRlcikge1xuICAgIGlmIChsaW50ZXIuc2NvcGUgPT09ICdmaWxlJykge1xuICAgICAgdGhpcy5lZGl0b3JNZXNzYWdlcy5mb3JFYWNoKHIgPT4gci5kZWxldGUobGludGVyKSlcbiAgICAgIHRoaXMuaGFzQ2hhbmdlZCA9IHRydWVcbiAgICB9IGVsc2UgaWYodGhpcy5saW50ZXJSZXNwb25zZXMuaGFzKGxpbnRlcikpIHtcbiAgICAgIHRoaXMubGludGVyUmVzcG9uc2VzLmRlbGV0ZShsaW50ZXIpXG4gICAgICB0aGlzLmhhc0NoYW5nZWQgPSB0cnVlXG4gICAgfVxuICB9XG4gIGRlbGV0ZUVkaXRvck1lc3NhZ2VzKGVkaXRvcikge1xuICAgIGlmICghdGhpcy5lZGl0b3JNZXNzYWdlcy5oYXMoZWRpdG9yKSkgcmV0dXJuXG4gICAgdGhpcy5lZGl0b3JNZXNzYWdlcy5kZWxldGUoZWRpdG9yKVxuICAgIHRoaXMuaGFzQ2hhbmdlZCA9IHRydWVcbiAgfVxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMuc2hvdWxkUmVmcmVzaCA9IGZhbHNlXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgIHRoaXMubGludGVyUmVzcG9uc2VzLmNsZWFyKClcbiAgICB0aGlzLmVkaXRvck1lc3NhZ2VzLmNsZWFyKClcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE1lc3NhZ2VSZWdpc3RyeVxuIl19