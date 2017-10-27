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
    // We track messages by the underlying TextBuffer the lint was run against
    // rather than the TextEditor because there may be multiple TextEditors per
    // TextBuffer when multiple panes are in use.  For each buffer, we store a
    // map whose values are messages and whose keys are the linter that produced
    // the messages.  (Note that we are talking about linter instances, not
    // EditorLinter instances.  EditorLinter instances are per-TextEditor and
    // could result in duplicated sets of messages.)
    this.bufferMessages = new Map();

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
        var buffer = editor.getBuffer();
        if (!this.bufferMessages.has(buffer)) this.bufferMessages.set(buffer, new Map());
        this.bufferMessages.get(buffer).set(linter, messages);
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
      this.bufferMessages.forEach(function (bufferMessages) {
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
        this.bufferMessages.forEach(function (r) {
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
      // Caveat: in the event that there are multiple TextEditor instances open
      // referring to the same underlying buffer and those instances are not also
      // closed, the linting results for this buffer will be temporarily removed
      // until such time as a lint is re-triggered by one of the other
      // corresponding EditorLinter instances.  There are ways to mitigate this,
      // but they all involve some complexity that does not yet seem justified.
      var buffer = editor.getBuffer();
      if (!this.bufferMessages.has(buffer)) return;
      this.bufferMessages['delete'](buffer);
      this.hasChanged = true;
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.shouldRefresh = false;
      this.subscriptions.dispose();
      this.linterResponses.clear();
      this.bufferMessages.clear();
    }
  }]);

  return MessageRegistry;
})();

module.exports = MessageRegistry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL21lc3NhZ2UtcmVnaXN0cnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztvQkFDdUQsTUFBTTs7QUFEN0QsV0FBVyxDQUFBOztBQUdYLElBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQTtBQUN0QyxJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUE7O0lBRTlCLGVBQWU7QUFDUixXQURQLGVBQWUsR0FDTDs7OzBCQURWLGVBQWU7O0FBRWpCLFFBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFBO0FBQ3ZCLFFBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFBO0FBQ3pCLFFBQUksQ0FBQyxjQUFjLEdBQUcsRUFBRSxDQUFBO0FBQ3hCLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7QUFDOUMsUUFBSSxDQUFDLE9BQU8sR0FBRyxtQkFBYSxDQUFBO0FBQzVCLFFBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTs7Ozs7Ozs7QUFRaEMsUUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBOztBQUUvQixRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7QUFDcEMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsNEJBQTRCLEVBQUUsVUFBQSxLQUFLO2FBQUksTUFBSyxtQkFBbUIsR0FBSSxLQUFLLElBQUksRUFBRSxBQUFDO0tBQUEsQ0FBQyxDQUFDLENBQUE7O0FBRTVILFFBQU0sY0FBYyxHQUFHLFNBQWpCLGNBQWMsR0FBUztBQUMzQixVQUFJLE1BQUssYUFBYSxFQUFFO0FBQ3RCLFlBQUksTUFBSyxVQUFVLEVBQUU7QUFDbkIsZ0JBQUssVUFBVSxHQUFHLEtBQUssQ0FBQTtBQUN2Qixn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SSxDQUFBO09BQ3ZCO0tBQ0Y7OztXQUNtQiw4QkFBQyxNQUFNLEVBQUU7Ozs7Ozs7QUFPM0IsVUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBQ2hDLFVBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxPQUFNO0FBQzVDLFVBQUksQ0FBQyxjQUFjLFVBQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUNsQyxVQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQTtLQUN2Qjs7O1dBQ00sbUJBQUc7QUFDUixVQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQTtBQUMxQixVQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQzVCLFVBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUFFLENBQUE7QUFDNUIsVUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtLQUM1Qjs7O1NBOUdHLGVBQWU7OztBQWlIckIsTUFBTSxDQUFDLE9BQU8sR0FBRyxlQUFlLENBQUEiLCJmaWxlIjoiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvbWVzc2FnZS1yZWdpc3RyeS5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5pbXBvcnQge0VtaXR0ZXIsIFRleHRFZGl0b3IsIENvbXBvc2l0ZURpc3Bvc2FibGV9IGZyb20gJ2F0b20nXG5cbmNvbnN0IFZhbGlkYXRlID0gcmVxdWlyZSgnLi92YWxpZGF0ZScpXG5jb25zdCBIZWxwZXJzID0gcmVxdWlyZSgnLi9oZWxwZXJzJylcblxuY2xhc3MgTWVzc2FnZVJlZ2lzdHJ5IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5oYXNDaGFuZ2VkID0gZmFsc2VcbiAgICB0aGlzLnNob3VsZFJlZnJlc2ggPSB0cnVlXG4gICAgdGhpcy5wdWJsaWNNZXNzYWdlcyA9IFtdXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKClcbiAgICB0aGlzLmxpbnRlclJlc3BvbnNlcyA9IG5ldyBNYXAoKVxuICAgIC8vIFdlIHRyYWNrIG1lc3NhZ2VzIGJ5IHRoZSB1bmRlcmx5aW5nIFRleHRCdWZmZXIgdGhlIGxpbnQgd2FzIHJ1biBhZ2FpbnN0XG4gICAgLy8gcmF0aGVyIHRoYW4gdGhlIFRleHRFZGl0b3IgYmVjYXVzZSB0aGVyZSBtYXkgYmUgbXVsdGlwbGUgVGV4dEVkaXRvcnMgcGVyXG4gICAgLy8gVGV4dEJ1ZmZlciB3aGVuIG11bHRpcGxlIHBhbmVzIGFyZSBpbiB1c2UuICBGb3IgZWFjaCBidWZmZXIsIHdlIHN0b3JlIGFcbiAgICAvLyBtYXAgd2hvc2UgdmFsdWVzIGFyZSBtZXNzYWdlcyBhbmQgd2hvc2Uga2V5cyBhcmUgdGhlIGxpbnRlciB0aGF0IHByb2R1Y2VkXG4gICAgLy8gdGhlIG1lc3NhZ2VzLiAgKE5vdGUgdGhhdCB3ZSBhcmUgdGFsa2luZyBhYm91dCBsaW50ZXIgaW5zdGFuY2VzLCBub3RcbiAgICAvLyBFZGl0b3JMaW50ZXIgaW5zdGFuY2VzLiAgRWRpdG9yTGludGVyIGluc3RhbmNlcyBhcmUgcGVyLVRleHRFZGl0b3IgYW5kXG4gICAgLy8gY291bGQgcmVzdWx0IGluIGR1cGxpY2F0ZWQgc2V0cyBvZiBtZXNzYWdlcy4pXG4gICAgdGhpcy5idWZmZXJNZXNzYWdlcyA9IG5ldyBNYXAoKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLmVtaXR0ZXIpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXIuaWdub3JlZE1lc3NhZ2VUeXBlcycsIHZhbHVlID0+IHRoaXMuaWdub3JlZE1lc3NhZ2VUeXBlcyA9ICh2YWx1ZSB8fCBbXSkpKVxuXG4gICAgY29uc3QgVXBkYXRlTWVzc2FnZXMgPSAoKSA9PiB7XG4gICAgICBpZiAodGhpcy5zaG91bGRSZWZyZXNoKSB7XG4gICAgICAgIGlmICh0aGlzLmhhc0NoYW5nZWQpIHtcbiAgICAgICAgICB0aGlzLmhhc0NoYW5nZWQgPSBmYWxzZVxuICAgICAgICAgIHRoaXMudXBkYXRlUHVibGljKClcbiAgICAgICAgfVxuICAgICAgICBIZWxwZXJzLnJlcXVlc3RVcGRhdGVGcmFtZShVcGRhdGVNZXNzYWdlcylcbiAgICAgIH1cbiAgICB9XG4gICAgSGVscGVycy5yZXF1ZXN0VXBkYXRlRnJhbWUoVXBkYXRlTWVzc2FnZXMpXG4gIH1cbiAgc2V0KHtsaW50ZXIsIG1lc3NhZ2VzLCBlZGl0b3J9KSB7XG4gICAgaWYgKGxpbnRlci5kZWFjdGl2YXRlZCkgcmV0dXJuXG4gICAgdHJ5IHtcbiAgICAgIFZhbGlkYXRlLm1lc3NhZ2VzKG1lc3NhZ2VzKVxuICAgIH0gY2F0Y2ggKGUpIHsgcmV0dXJuIEhlbHBlcnMuZXJyb3IoZSkgfVxuICAgIG1lc3NhZ2VzID0gbWVzc2FnZXMuZmlsdGVyKGkgPT4gdGhpcy5pZ25vcmVkTWVzc2FnZVR5cGVzLmluZGV4T2YoaS50eXBlKSA9PT0gLTEpXG4gICAgaWYgKGxpbnRlci5zY29wZSA9PT0gJ2ZpbGUnKSB7XG4gICAgICBpZiAoIWVkaXRvci5hbGl2ZSkgcmV0dXJuXG4gICAgICBpZiAoIShlZGl0b3IgaW5zdGFuY2VvZiBUZXh0RWRpdG9yKSkgdGhyb3cgbmV3IEVycm9yKFwiR2l2ZW4gZWRpdG9yIGlzbid0IHJlYWxseSBhbiBlZGl0b3JcIilcbiAgICAgIGxldCBidWZmZXIgPSBlZGl0b3IuZ2V0QnVmZmVyKClcbiAgICAgIGlmICghdGhpcy5idWZmZXJNZXNzYWdlcy5oYXMoYnVmZmVyKSlcbiAgICAgICAgdGhpcy5idWZmZXJNZXNzYWdlcy5zZXQoYnVmZmVyLCBuZXcgTWFwKCkpXG4gICAgICB0aGlzLmJ1ZmZlck1lc3NhZ2VzLmdldChidWZmZXIpLnNldChsaW50ZXIsIG1lc3NhZ2VzKVxuICAgIH0gZWxzZSB7IC8vIEl0J3MgcHJvamVjdFxuICAgICAgdGhpcy5saW50ZXJSZXNwb25zZXMuc2V0KGxpbnRlciwgbWVzc2FnZXMpXG4gICAgfVxuICAgIHRoaXMuaGFzQ2hhbmdlZCA9IHRydWVcbiAgfVxuICB1cGRhdGVQdWJsaWMoKSB7XG4gICAgbGV0IGxhdGVzdE1lc3NhZ2VzID0gW11cbiAgICBsZXQgcHVibGljTWVzc2FnZXMgPSBbXVxuICAgIGxldCBhZGRlZCA9IFtdXG4gICAgbGV0IHJlbW92ZWQgPSBbXVxuICAgIGxldCBjdXJyZW50S2V5c1xuICAgIGxldCBsYXN0S2V5c1xuXG4gICAgdGhpcy5saW50ZXJSZXNwb25zZXMuZm9yRWFjaChtZXNzYWdlcyA9PiBsYXRlc3RNZXNzYWdlcyA9IGxhdGVzdE1lc3NhZ2VzLmNvbmNhdChtZXNzYWdlcykpXG4gICAgdGhpcy5idWZmZXJNZXNzYWdlcy5mb3JFYWNoKGJ1ZmZlck1lc3NhZ2VzID0+XG4gICAgICBidWZmZXJNZXNzYWdlcy5mb3JFYWNoKG1lc3NhZ2VzID0+IGxhdGVzdE1lc3NhZ2VzID0gbGF0ZXN0TWVzc2FnZXMuY29uY2F0KG1lc3NhZ2VzKSlcbiAgICApXG5cbiAgICBjdXJyZW50S2V5cyA9IGxhdGVzdE1lc3NhZ2VzLm1hcChpID0+IGkua2V5KVxuICAgIGxhc3RLZXlzID0gdGhpcy5wdWJsaWNNZXNzYWdlcy5tYXAoaSA9PiBpLmtleSlcblxuICAgIGZvciAobGV0IGkgb2YgbGF0ZXN0TWVzc2FnZXMpIHtcbiAgICAgIGlmIChsYXN0S2V5cy5pbmRleE9mKGkua2V5KSA9PT0gLTEpIHtcbiAgICAgICAgYWRkZWQucHVzaChpKVxuICAgICAgICBwdWJsaWNNZXNzYWdlcy5wdXNoKGkpXG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSBvZiB0aGlzLnB1YmxpY01lc3NhZ2VzKVxuICAgICAgaWYgKGN1cnJlbnRLZXlzLmluZGV4T2YoaS5rZXkpID09PSAtMSlcbiAgICAgICAgcmVtb3ZlZC5wdXNoKGkpXG4gICAgICBlbHNlXG4gICAgICAgIHB1YmxpY01lc3NhZ2VzLnB1c2goaSlcblxuICAgIHRoaXMucHVibGljTWVzc2FnZXMgPSBwdWJsaWNNZXNzYWdlc1xuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtdXBkYXRlLW1lc3NhZ2VzJywge2FkZGVkLCByZW1vdmVkLCBtZXNzYWdlczogcHVibGljTWVzc2FnZXN9KVxuICB9XG4gIG9uRGlkVXBkYXRlTWVzc2FnZXMoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtdXBkYXRlLW1lc3NhZ2VzJywgY2FsbGJhY2spXG4gIH1cbiAgZGVsZXRlTWVzc2FnZXMobGludGVyKSB7XG4gICAgaWYgKGxpbnRlci5zY29wZSA9PT0gJ2ZpbGUnKSB7XG4gICAgICB0aGlzLmJ1ZmZlck1lc3NhZ2VzLmZvckVhY2gociA9PiByLmRlbGV0ZShsaW50ZXIpKVxuICAgICAgdGhpcy5oYXNDaGFuZ2VkID0gdHJ1ZVxuICAgIH0gZWxzZSBpZih0aGlzLmxpbnRlclJlc3BvbnNlcy5oYXMobGludGVyKSkge1xuICAgICAgdGhpcy5saW50ZXJSZXNwb25zZXMuZGVsZXRlKGxpbnRlcilcbiAgICAgIHRoaXMuaGFzQ2hhbmdlZCA9IHRydWVcbiAgICB9XG4gIH1cbiAgZGVsZXRlRWRpdG9yTWVzc2FnZXMoZWRpdG9yKSB7XG4gICAgLy8gQ2F2ZWF0OiBpbiB0aGUgZXZlbnQgdGhhdCB0aGVyZSBhcmUgbXVsdGlwbGUgVGV4dEVkaXRvciBpbnN0YW5jZXMgb3BlblxuICAgIC8vIHJlZmVycmluZyB0byB0aGUgc2FtZSB1bmRlcmx5aW5nIGJ1ZmZlciBhbmQgdGhvc2UgaW5zdGFuY2VzIGFyZSBub3QgYWxzb1xuICAgIC8vIGNsb3NlZCwgdGhlIGxpbnRpbmcgcmVzdWx0cyBmb3IgdGhpcyBidWZmZXIgd2lsbCBiZSB0ZW1wb3JhcmlseSByZW1vdmVkXG4gICAgLy8gdW50aWwgc3VjaCB0aW1lIGFzIGEgbGludCBpcyByZS10cmlnZ2VyZWQgYnkgb25lIG9mIHRoZSBvdGhlclxuICAgIC8vIGNvcnJlc3BvbmRpbmcgRWRpdG9yTGludGVyIGluc3RhbmNlcy4gIFRoZXJlIGFyZSB3YXlzIHRvIG1pdGlnYXRlIHRoaXMsXG4gICAgLy8gYnV0IHRoZXkgYWxsIGludm9sdmUgc29tZSBjb21wbGV4aXR5IHRoYXQgZG9lcyBub3QgeWV0IHNlZW0ganVzdGlmaWVkLlxuICAgIGxldCBidWZmZXIgPSBlZGl0b3IuZ2V0QnVmZmVyKCk7XG4gICAgaWYgKCF0aGlzLmJ1ZmZlck1lc3NhZ2VzLmhhcyhidWZmZXIpKSByZXR1cm5cbiAgICB0aGlzLmJ1ZmZlck1lc3NhZ2VzLmRlbGV0ZShidWZmZXIpXG4gICAgdGhpcy5oYXNDaGFuZ2VkID0gdHJ1ZVxuICB9XG4gIGRpc3Bvc2UoKSB7XG4gICAgdGhpcy5zaG91bGRSZWZyZXNoID0gZmFsc2VcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgdGhpcy5saW50ZXJSZXNwb25zZXMuY2xlYXIoKVxuICAgIHRoaXMuYnVmZmVyTWVzc2FnZXMuY2xlYXIoKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTWVzc2FnZVJlZ2lzdHJ5XG4iXX0=
//# sourceURL=/Users/ah/.atom/packages/linter/lib/message-registry.js
