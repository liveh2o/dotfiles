(function() {
  describe('message-registry', function() {
    var EditorLinter, LinterRegistry, MessageRegistry, getLinterRegistry, nextAnimationFrame;
    MessageRegistry = require('../lib/message-registry');
    EditorLinter = require('../lib/editor-linter');
    LinterRegistry = require('../lib/linter-registry');
    nextAnimationFrame = function() {
      return new Promise(function(resolve) {
        return requestAnimationFrame(resolve);
      });
    };
    getLinterRegistry = function() {
      var editorLinter, linter, linterRegistry;
      linterRegistry = new LinterRegistry;
      editorLinter = new EditorLinter(atom.workspace.getActiveTextEditor());
      linter = {
        grammarScopes: ['*'],
        lintOnFly: false,
        modifiesBuffer: false,
        scope: 'file',
        lint: function() {
          return [
            {
              type: "Error",
              text: "Something"
            }
          ];
        }
      };
      linterRegistry.addLinter(linter);
      return {
        linterRegistry: linterRegistry,
        editorLinter: editorLinter
      };
    };
    beforeEach(function() {
      return waitsForPromise(function() {
        atom.workspace.destroyActivePaneItem();
        return atom.workspace.open('test.txt');
      });
    });
    describe('::constructor', function() {
      return it('accepts not arguments', function() {
        var messageRegistry;
        messageRegistry = new MessageRegistry();
        messageRegistry.deactivate();
        return expect(true).toBe(true);
      });
    });
    describe('::set', function() {
      return it('accepts info from LinterRegistry::lint', function() {
        var editorLinter, linterRegistry, messageRegistry, wasUpdated, _ref;
        messageRegistry = new MessageRegistry();
        _ref = getLinterRegistry(), linterRegistry = _ref.linterRegistry, editorLinter = _ref.editorLinter;
        wasUpdated = false;
        linterRegistry.onDidUpdateMessages(function(linterInfo) {
          wasUpdated = true;
          messageRegistry.set(linterInfo);
          return expect(messageRegistry.updated).toBe(true);
        });
        return waitsForPromise(function() {
          return linterRegistry.lint({
            onChange: false,
            editorLinter: editorLinter
          }).then(function() {
            expect(wasUpdated).toBe(true);
            linterRegistry.deactivate();
            return messageRegistry.deactivate();
          });
        });
      });
    });
    describe('::onDidUpdateMessages', function() {
      return it('is triggered asyncly with results', function() {
        var editorLinter, gotMessages, linterRegistry, messageRegistry, _ref;
        messageRegistry = new MessageRegistry();
        _ref = getLinterRegistry(), linterRegistry = _ref.linterRegistry, editorLinter = _ref.editorLinter;
        linterRegistry.onDidUpdateMessages(function(linterInfo) {
          messageRegistry.set(linterInfo);
          return expect(messageRegistry.updated).toBe(true);
        });
        gotMessages = null;
        return messageRegistry.onDidUpdateMessages(function(messages) {
          return gotMessages = messages;
        });
      });
    });
    return describe('::deleteEditorMessages', function() {
      return it('removes messages for that editor', function() {
        var editor, editorLinter, gotMessages, linterRegistry, messageRegistry, _ref;
        messageRegistry = new MessageRegistry();
        _ref = getLinterRegistry(), linterRegistry = _ref.linterRegistry, editorLinter = _ref.editorLinter;
        editor = editorLinter.editor;
        linterRegistry.onDidUpdateMessages(function(linterInfo) {
          messageRegistry.set(linterInfo);
          return expect(messageRegistry.updated).toBe(true);
        });
        gotMessages = null;
        return messageRegistry.onDidUpdateMessages(function(messages) {
          gotMessages = messages;
          return messageRegistry.deleteEditorMessages(editor);
        });
      });
    });
  });

}).call(this);
