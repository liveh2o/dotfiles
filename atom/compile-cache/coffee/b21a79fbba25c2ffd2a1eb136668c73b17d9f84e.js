(function() {
  var CompositeDisposable, Emitter, MessageRegistry, TextEditor, helpers, validate, _ref;

  _ref = require('atom'), Emitter = _ref.Emitter, TextEditor = _ref.TextEditor, CompositeDisposable = _ref.CompositeDisposable;

  validate = require('./validate');

  helpers = require('./helpers');

  MessageRegistry = (function() {
    function MessageRegistry() {
      this.updated = false;
      this.publicMessages = [];
      this.subscriptions = new CompositeDisposable();
      this.emitter = new Emitter;
      this.linterResponses = new Map();
      this.editorMessages = new Map();
      this.subscriptions.add(this.emitter);
      this.subscriptions.add(atom.config.observe('linter.ignoredMessageTypes', (function(_this) {
        return function(ignoredMessageTypes) {
          return _this.ignoredMessageTypes = ignoredMessageTypes;
        };
      })(this)));
      this.shouldUpdatePublic = true;
      requestAnimationFrame((function(_this) {
        return function() {
          return _this.updatePublic();
        };
      })(this));
    }

    MessageRegistry.prototype.set = function(_arg) {
      var e, editor, linter, messages;
      linter = _arg.linter, messages = _arg.messages, editor = _arg.editor;
      try {
        validate.messages(messages);
      } catch (_error) {
        e = _error;
        return helpers.error(e);
      }
      messages = messages.filter((function(_this) {
        return function(entry) {
          return _this.ignoredMessageTypes.indexOf(entry.type) === -1;
        };
      })(this));
      if (linter.scope === 'project') {
        this.linterResponses.set(linter, messages);
      } else {
        if (!editor.alive) {
          return;
        }
        if (!(editor instanceof TextEditor)) {
          throw new Error("Given editor isn't really an editor");
        }
        if (!this.editorMessages.has(editor)) {
          this.editorMessages.set(editor, new Map());
        }
        this.editorMessages.get(editor).set(linter, messages);
      }
      return this.updated = true;
    };

    MessageRegistry.prototype.updatePublic = function() {
      var added, currentKeys, lastKeys, publicMessages, removed;
      if (!this.shouldUpdatePublic) {
        return;
      }
      if (this.updated) {
        this.updated = false;
        publicMessages = [];
        added = [];
        removed = [];
        this.linterResponses.forEach(function(messages) {
          return publicMessages = publicMessages.concat(messages);
        });
        this.editorMessages.forEach(function(linters) {
          return linters.forEach(function(messages) {
            return publicMessages = publicMessages.concat(messages);
          });
        });
        currentKeys = publicMessages.map(function(i) {
          return i.key;
        });
        lastKeys = publicMessages.map(function(i) {
          return i.key;
        });
        publicMessages.forEach(function(i) {
          if (lastKeys.indexOf(i) === -1) {
            return added.push(i);
          }
        });
        this.publicMessages.forEach(function(i) {
          if (currentKeys.indexOf(i) === -1) {
            return removed.push(i);
          }
        });
        this.publicMessages = publicMessages;
        this.emitter.emit('did-update-messages', {
          added: added,
          removed: removed,
          messages: publicMessages
        });
      }
      return requestAnimationFrame((function(_this) {
        return function() {
          return _this.updatePublic();
        };
      })(this));
    };

    MessageRegistry.prototype.onDidUpdateMessages = function(callback) {
      return this.emitter.on('did-update-messages', callback);
    };

    MessageRegistry.prototype.deleteMessages = function(linter) {
      if (this.linterResponses.has(linter)) {
        this.updated = true;
        return this.linterResponses["delete"](linter);
      }
    };

    MessageRegistry.prototype.deleteEditorMessages = function(editor) {
      if (this.editorMessages.has(editor)) {
        this.updated = true;
        return this.editorMessages["delete"](editor);
      }
    };

    MessageRegistry.prototype.deactivate = function() {
      this.shouldUpdatePublic = false;
      this.subscriptions.dispose();
      this.linterResponses.clear();
      return this.editorMessages.clear();
    };

    return MessageRegistry;

  })();

  module.exports = MessageRegistry;

}).call(this);
