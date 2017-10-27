(function() {
  var CompositeDisposable, Emitter, Helpers, MessageRegistry, _ref;

  Helpers = require('./helpers');

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Emitter = _ref.Emitter;


  /*
    Note: We are reclassifying the messages on on Pane Item Change,
    even though we are relinting on that same event, 'cause linters
    could take time and we have to refresh the views immediately
   */

  MessageRegistry = (function() {
    function MessageRegistry(linter) {
      this.linter = linter;
      this.count = {
        File: 0,
        Project: 0
      };
      this.messages = new Map();
      this.emitter = new Emitter;
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(this.linter.observeEditorLinters((function(_this) {
        return function(EditorLinter) {
          EditorLinter.onShouldUpdate(function(_arg) {
            var linter, messages;
            linter = _arg.linter, messages = _arg.results;
            Helpers.validateMessages(messages);
            _this.classifyMessages(messages);
            if (EditorLinter.messages.has(linter)) {
              _this.countMessages(EditorLinter.messages.get(linter), false);
            }
            EditorLinter.messages.set(linter, messages);
            _this.countMessages(messages);
            return _this.emitter.emit('did-change');
          });
          return EditorLinter.onDidDestroy(function() {
            return EditorLinter.messages.forEach(function(messages) {
              _this.countMessages(messages, false);
              return _this.emitter.emit('did-change');
            });
          });
        };
      })(this)));
      this.subscriptions.add(atom.workspace.onDidChangeActivePaneItem((function(_this) {
        return function() {
          _this.count = {
            File: 0,
            Project: 0
          };
          _this.messages.forEach(function(messages) {
            _this.classifyMessages(messages);
            return _this.countMessages(messages);
          });
          _this.linter.eachEditorLinter(function(EditorLinter) {
            return EditorLinter.messages.forEach(function(messages) {
              _this.classifyMessages(messages);
              return _this.countMessages(messages);
            });
          });
          return _this.emitter.emit('did-change');
        };
      })(this)));
    }

    MessageRegistry.prototype.set = function(linter, messages) {
      Helpers.validateMessages(messages);
      this.classifyMessages(messages);
      if (this.messages.has(linter)) {
        this.countMessages(this.messages.get(linter), false);
      }
      this.messages.set(linter, messages);
      this.countMessages(messages);
      return this.emitter.emit('did-change');
    };

    MessageRegistry.prototype["delete"] = function(linter) {
      if (this.messages.has(linter)) {
        this.countMessages(this.messages.get(linter));
        this.messages["delete"](linter, false);
        return this.emitter.emit('did-change');
      }
    };

    MessageRegistry.prototype.getCount = function() {
      return {
        File: this.count.File,
        Project: this.count.Project
      };
    };

    MessageRegistry.prototype.getAllMessages = function() {
      var toReturn;
      toReturn = [];
      this.messages.forEach(function(messages) {
        return toReturn = toReturn.concat(messages);
      });
      this.linter.eachEditorLinter(function(EditorLinter) {
        return EditorLinter.messages.forEach(function(messages) {
          return toReturn = toReturn.concat(messages);
        });
      });
      return toReturn;
    };

    MessageRegistry.prototype.getActiveFileMessages = function() {
      var toReturn;
      toReturn = [];
      this.messages.forEach(function(messages) {
        return toReturn = toReturn.concat(messages.filter(function(message) {
          return message.currentFile;
        }));
      });
      this.linter.eachEditorLinter(function(EditorLinter) {
        return EditorLinter.messages.forEach(function(messages) {
          return toReturn = toReturn.concat(messages.filter(function(message) {
            return message.currentFile;
          }));
        });
      });
      return toReturn;
    };

    MessageRegistry.prototype.getActiveFileMessagesForActiveRow = function() {
      var _ref1, _ref2;
      return this.getActiveFileMessagesForRow((_ref1 = atom.workspace.getActiveTextEditor()) != null ? (_ref2 = _ref1.getCursorBufferPosition()) != null ? _ref2.row : void 0 : void 0);
    };

    MessageRegistry.prototype.getActiveFileMessagesForRow = function(row) {
      var toReturn;
      toReturn = [];
      this.messages.forEach(function(messages) {
        return toReturn = toReturn.concat(messages.filter(function(message) {
          var _ref1;
          return message.currentFile && ((_ref1 = message.range) != null ? _ref1.intersectsRow(row) : void 0);
        }));
      });
      this.linter.eachEditorLinter(function(EditorLinter) {
        return EditorLinter.messages.forEach(function(messages) {
          return toReturn = toReturn.concat(messages.filter(function(message) {
            var _ref1;
            return message.currentFile && ((_ref1 = message.range) != null ? _ref1.intersectsRow(row) : void 0);
          }));
        });
      });
      return toReturn;
    };

    MessageRegistry.prototype.onDidChange = function(callback) {
      return this.emitter.on('did-change', callback);
    };

    MessageRegistry.prototype.classifyMessages = function(messages) {
      var activeFile, isProject, _ref1;
      isProject = this.linter.state.scope === 'Project';
      activeFile = (_ref1 = atom.workspace.getActiveTextEditor()) != null ? _ref1.getPath() : void 0;
      return messages.forEach(function(message) {
        if ((!message.filePath && !isProject) || message.filePath === activeFile) {
          return message.currentFile = true;
        } else {
          return message.currentFile = false;
        }
      });
    };

    MessageRegistry.prototype.countMessages = function(messages, add) {
      var count;
      if (add == null) {
        add = true;
      }
      count = {
        File: 0,
        Project: messages.length || messages.size || 0
      };
      messages.forEach(function(message) {
        if (message.currentFile) {
          return count.File++;
        }
      });
      if (add) {
        this.count.File += count.File;
        return this.count.Project += count.Project;
      } else {
        this.count.File -= count.File;
        return this.count.Project -= count.Project;
      }
    };

    MessageRegistry.prototype.destroy = function() {
      this.messages.clear();
      this.subscriptions.dispose();
      return this.emitter.dispose();
    };

    return MessageRegistry;

  })();

  module.exports = MessageRegistry;

}).call(this);
