Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _validate = require('./validate');

var Validate = _interopRequireWildcard(_validate);

var _helpers = require('./helpers');

var IndieDelegate = (function () {
  function IndieDelegate(indie, version) {
    _classCallCheck(this, IndieDelegate);

    this.indie = indie;
    this.scope = 'project';
    this.version = version;
    this.emitter = new _atom.Emitter();
    this.messages = new Map();
    this.subscriptions = new _atom.CompositeDisposable();

    this.subscriptions.add(this.emitter);
  }

  _createClass(IndieDelegate, [{
    key: 'getMessages',
    value: function getMessages() {
      return Array.from(this.messages.values()).reduce(function (toReturn, entry) {
        return toReturn.concat(entry);
      }, []);
    }
  }, {
    key: 'deleteMessages',
    value: function deleteMessages() {
      if (this.version === 1) {
        this.clearMessages();
      } else {
        throw new Error('Call to depreciated method deleteMessages(). Use clearMessages() insead');
      }
    }
  }, {
    key: 'clearMessages',
    value: function clearMessages() {
      if (!this.subscriptions.disposed) {
        this.emitter.emit('did-update', []);
        this.messages.clear();
      }
    }
  }, {
    key: 'setMessages',
    value: function setMessages(filePathOrMessages) {
      var messages = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

      // Legacy support area
      if (this.version === 1) {
        if (!Array.isArray(filePathOrMessages)) {
          throw new Error('Parameter 1 to setMessages() must be Array');
        }
        this.setAllMessages(filePathOrMessages);
        return;
      }

      // v2 Support from here on
      if (typeof filePathOrMessages !== 'string' || !Array.isArray(messages)) {
        throw new Error('Invalid Parameters to setMessages()');
      }
      var filePath = filePathOrMessages;
      if (this.subscriptions.disposed || !Validate.messages(this.name, messages)) {
        return;
      }
      messages.forEach(function (message) {
        if (message.location.file !== filePath) {
          console.debug('[Linter-UI-Default] Expected File', filePath, 'Message', message);
          throw new Error('message.location.file does not match the given filePath');
        }
      });

      (0, _helpers.normalizeMessages)(this.name, messages);
      this.messages.set(filePath, messages);
      this.emitter.emit('did-update', this.getMessages());
    }
  }, {
    key: 'setAllMessages',
    value: function setAllMessages(messages) {
      if (this.subscriptions.disposed) {
        return;
      }

      if (this.version === 1) {
        if (!Validate.messagesLegacy(this.name, messages)) return;
        (0, _helpers.normalizeMessagesLegacy)(this.name, messages);
      } else {
        if (!Validate.messages(this.name, messages)) return;
        (0, _helpers.normalizeMessages)(this.name, messages);
      }

      this.messages.clear();
      for (var i = 0, _length = messages.length; i < _length; ++i) {
        var message = messages[i];
        var filePath = message.version === 1 ? message.filePath : message.location.file;
        var fileMessages = this.messages.get(filePath);
        if (!fileMessages) {
          this.messages.set(filePath, fileMessages = []);
        }
        fileMessages.push(message);
      }
      this.emitter.emit('did-update', this.getMessages());
    }
  }, {
    key: 'onDidUpdate',
    value: function onDidUpdate(callback) {
      return this.emitter.on('did-update', callback);
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
      this.subscriptions.dispose();
      this.messages.clear();
    }
  }, {
    key: 'name',
    get: function get() {
      return this.indie.name;
    }
  }]);

  return IndieDelegate;
})();

exports['default'] = IndieDelegate;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL2luZGllLWRlbGVnYXRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7b0JBRTZDLE1BQU07O3dCQUd6QixZQUFZOztJQUExQixRQUFROzt1QkFDdUMsV0FBVzs7SUFHakQsYUFBYTtBQVFyQixXQVJRLGFBQWEsQ0FRcEIsS0FBWSxFQUFFLE9BQWMsRUFBRTswQkFSdkIsYUFBYTs7QUFTOUIsUUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUE7QUFDbEIsUUFBSSxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUE7QUFDdEIsUUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUE7QUFDdEIsUUFBSSxDQUFDLE9BQU8sR0FBRyxtQkFBYSxDQUFBO0FBQzVCLFFBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTtBQUN6QixRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFBOztBQUU5QyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7R0FDckM7O2VBakJrQixhQUFhOztXQXFCckIsdUJBQW1DO0FBQzVDLGFBQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQVMsUUFBUSxFQUFFLEtBQUssRUFBRTtBQUN6RSxlQUFPLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUE7T0FDOUIsRUFBRSxFQUFFLENBQUMsQ0FBQTtLQUNQOzs7V0FDYSwwQkFBUztBQUNyQixVQUFJLElBQUksQ0FBQyxPQUFPLEtBQUssQ0FBQyxFQUFFO0FBQ3RCLFlBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQTtPQUNyQixNQUFNO0FBQ0wsY0FBTSxJQUFJLEtBQUssQ0FBQyx5RUFBeUUsQ0FBQyxDQUFBO09BQzNGO0tBQ0Y7OztXQUNZLHlCQUFT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QVksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUM5QyxZQUFJLENBQUMsWUFBWSxFQUFFO0FBQ2pCLGNBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxZQUFZLEdBQUcsRUFBRSxDQUFDLENBQUE7U0FDL0M7QUFDRCxvQkFBWSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtPQUMzQjtBQUNELFVBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQTtLQUNwRDs7O1dBQ1UscUJBQUMsUUFBa0IsRUFBYztBQUMxQyxhQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxRQUFRLENBQUMsQ0FBQTtLQUMvQzs7O1dBQ1csc0JBQUMsUUFBa0IsRUFBYztBQUMzQyxhQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxRQUFRLENBQUMsQ0FBQTtLQUNoRDs7O1dBQ00sbUJBQVM7QUFDZCxVQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQTtBQUNoQyxVQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQzVCLFVBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUE7S0FDdEI7OztTQXJGTyxlQUFXO0FBQ2pCLGFBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUE7S0FDdkI7OztTQXBCa0IsYUFBYTs7O3FCQUFiLGFBQWEiLCJmaWxlIjoiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvaW5kaWUtZGVsZWdhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgeyBFbWl0dGVyLCBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcbmltcG9ydCB0eXBlIHsgRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nXG5cbmltcG9ydCAqIGFzIFZhbGlkYXRlIGZyb20gJy4vdmFsaWRhdGUnXG5pbXBvcnQgeyBub3JtYWxpemVNZXNzYWdlcywgbm9ybWFsaXplTWVzc2FnZXNMZWdhY3kgfSBmcm9tICcuL2hlbHBlcnMnXG5pbXBvcnQgdHlwZSB7IEluZGllLCBNZXNzYWdlLCBNZXNzYWdlTGVnYWN5IH0gZnJvbSAnLi90eXBlcydcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW5kaWVEZWxlZ2F0ZSB7XG4gIGluZGllOiBJbmRpZTtcbiAgc2NvcGU6ICdwcm9qZWN0JztcbiAgZW1pdHRlcjogRW1pdHRlcjtcbiAgdmVyc2lvbjogMSB8IDJcbiAgbWVzc2FnZXM6IE1hcDw/c3RyaW5nLCBBcnJheTxNZXNzYWdlIHwgTWVzc2FnZUxlZ2FjeT4+O1xuICBzdWJzY3JpcHRpb25zOiBDb21wb3NpdGVEaXNwb3NhYmxlO1xuXG4gIGNvbnN0cnVjdG9yKGluZGllOiBJbmRpZSwgdmVyc2lvbjogMSB8IDIpIHtcbiAgICB0aGlzLmluZGllID0gaW5kaWVcbiAgICB0aGlzLnNjb3BlID0gJ3Byb2plY3QnXG4gICAgdGhpcy52ZXJzaW9uID0gdmVyc2lvblxuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKClcbiAgICB0aGlzLm1lc3NhZ2VzID0gbmV3IE1hcCgpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLmVtaXR0ZXIpXG4gIH1cbiAgZ2V0IG5hbWUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5pbmRpZS5uYW1lXG4gIH1cbiAgZ2V0TWVzc2FnZXMoKTogQXJyYXk8TWVzc2FnZSB8IE1lc3NhZ2VMZWdhY3k+IHtcbiAgICByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLm1lc3NhZ2VzLnZhbHVlcygpKS5yZWR1Y2UoZnVuY3Rpb24odG9SZXR1cm4sIGVudHJ5KSB7XG4gICAgICByZXR1cm4gdG9SZXR1cm4uY29uY2F0KGVudHJ5KVxuICAgIH0sIFtdKVxuICB9XG4gIGRlbGV0ZU1lc3NhZ2VzKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnZlcnNpb24gPT09IDEpIHtcbiAgICAgIHRoaXMuY2xlYXJNZXNzYWdlcygpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2FsbCB0byBkZXByZWNpYXRlZCBtZXRob2QgZGVsZXRlTWVzc2FnZXMoKS4gVXNlIGNsZWFyTWVzc2FnZXMoKSBpbnNlYWQnKVxuICAgIH1cbiAgfVxuICBjbGVhck1lc3NhZ2VzKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2VkKSB7XG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLXVwZGF0ZScsIFtdKVxuICAgICAgdGhpcy5tZXNzYWdlcy5jbGVhcigpXG4gICAgfVxuICB9XG4gIHNldE1lc3NhZ2VzKGZpbGVQYXRoT3JNZXNzYWdlczogc3RyaW5nIHwgQXJyYXk8T2JqZWN0PiwgbWVzc2FnZXM6ID9BcnJheTxPYmplY3Q+ID0gbnVsbCk6IHZvaWQge1xuICAgIC8vIExlZ2FjeSBzdXBwb3J0IGFyZWFcbiAgICBpZiAodGhpcy52ZXJzaW9uID09PSAxKSB7XG4gICAgICBpZiAoIUFycmF5LmlzQXJyYXkoZmlsZVBhdGhPck1lc3NhZ2VzKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1BhcmFtZXRlciAxIHRvIHNldE1lc3NhZ2VzKCkgbXVzdCBiZSBBcnJheScpXG4gICAgICB9XG4gICAgICB0aGlzLnNldEFsbE1lc3NhZ2VzKGZpbGVQYXRoT3JNZXNzYWdlcylcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIC8vIHYyIFN1cHBvcnQgZnJvbSBoZXJlIG9uXG4gICAgaWYgKHR5cGVvZiBmaWxlUGF0aE9yTWVzc2FnZXMgIT09ICdzdHJpbmcnIHx8ICFBcnJheS5pc0FycmF5KG1lc3NhZ2VzKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIFBhcmFtZXRlcnMgdG8gc2V0TWVzc2FnZXMoKScpXG4gICAgfVxuICAgIGNvbnN0IGZpbGVQYXRoID0gZmlsZVBhdGhPck1lc3NhZ2VzXG4gICAgaWYgKHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlZCB8fCAhVmFsaWRhdGUubWVzc2FnZXModGhpcy5uYW1lLCBtZXNzYWdlcykpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBtZXNzYWdlcy5mb3JFYWNoKGZ1bmN0aW9uKG1lc3NhZ2UpIHtcbiAgICAgIGlmIChtZXNzYWdlLmxvY2F0aW9uLmZpbGUgIT09IGZpbGVQYXRoKSB7XG4gICAgICAgIGNvbnNvbGUuZGVidWcoJ1tMaW50ZXItVUktRGVmYXVsdF0gRXhwZWN0ZWQgRmlsZScsIGZpbGVQYXRoLCAnTWVzc2FnZScsIG1lc3NhZ2UpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignbWVzc2FnZS5sb2NhdGlvbi5maWxlIGRvZXMgbm90IG1hdGNoIHRoZSBnaXZlbiBmaWxlUGF0aCcpXG4gICAgICB9XG4gICAgfSlcblxuICAgIG5vcm1hbGl6ZU1lc3NhZ2VzKHRoaXMubmFtZSwgbWVzc2FnZXMpXG4gICAgdGhpcy5tZXNzYWdlcy5zZXQoZmlsZVBhdGgsIG1lc3NhZ2VzKVxuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtdXBkYXRlJywgdGhpcy5nZXRNZXNzYWdlcygpKVxuICB9XG4gIHNldEFsbE1lc3NhZ2VzKG1lc3NhZ2VzOiBBcnJheTxPYmplY3Q+KTogdm9pZCB7XG4gICAgaWYgKHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlZCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgaWYgKHRoaXMudmVyc2lvbiA9PT0gMSkge1xuICAgICAgaWYgKCFWYWxpZGF0ZS5tZXNzYWdlc0xlZ2FjeSh0aGlzLm5hbWUsIG1lc3NhZ2VzKSkgcmV0dXJuXG4gICAgICBub3JtYWxpemVNZXNzYWdlc0xlZ2FjeSh0aGlzLm5hbWUsIG1lc3NhZ2VzKVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoIVZhbGlkYXRlLm1lc3NhZ2VzKHRoaXMubmFtZSwgbWVzc2FnZXMpKSByZXR1cm5cbiAgICAgIG5vcm1hbGl6ZU1lc3NhZ2VzKHRoaXMubmFtZSwgbWVzc2FnZXMpXG4gICAgfVxuXG4gICAgdGhpcy5tZXNzYWdlcy5jbGVhcigpXG4gICAgZm9yIChsZXQgaSA9IDAsIGxlbmd0aCA9IG1lc3NhZ2VzLmxlbmd0aDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICBjb25zdCBtZXNzYWdlOiBNZXNzYWdlIHwgTWVzc2FnZUxlZ2FjeSA9IG1lc3NhZ2VzW2ldXG4gICAgICBjb25zdCBmaWxlUGF0aCA9IG1lc3NhZ2UudmVyc2lvbiA9PT0gMSA/IG1lc3NhZ2UuZmlsZVBhdGggOiBtZXNzYWdlLmxvY2F0aW9uLmZpbGVcbiAgICAgIGxldCBmaWxlTWVzc2FnZXMgPSB0aGlzLm1lc3NhZ2VzLmdldChmaWxlUGF0aClcbiAgICAgIGlmICghZmlsZU1lc3NhZ2VzKSB7XG4gICAgICAgIHRoaXMubWVzc2FnZXMuc2V0KGZpbGVQYXRoLCBmaWxlTWVzc2FnZXMgPSBbXSlcbiAgICAgIH1cbiAgICAgIGZpbGVNZXNzYWdlcy5wdXNoKG1lc3NhZ2UpXG4gICAgfVxuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtdXBkYXRlJywgdGhpcy5nZXRNZXNzYWdlcygpKVxuICB9XG4gIG9uRGlkVXBkYXRlKGNhbGxiYWNrOiBGdW5jdGlvbik6IERpc3Bvc2FibGUge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC11cGRhdGUnLCBjYWxsYmFjaylcbiAgfVxuICBvbkRpZERlc3Ryb3koY2FsbGJhY2s6IEZ1bmN0aW9uKTogRGlzcG9zYWJsZSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLWRlc3Ryb3knLCBjYWxsYmFjaylcbiAgfVxuICBkaXNwb3NlKCk6IHZvaWQge1xuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtZGVzdHJveScpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgIHRoaXMubWVzc2FnZXMuY2xlYXIoKVxuICB9XG59XG4iXX0=