(function() {
  describe('message-registry', function() {
    var EditorLinter, LinterRegistry, MessageRegistry, getLinterRegistry, getMessage, messageRegistry, objectSize, _ref;
    messageRegistry = null;
    MessageRegistry = require('../lib/message-registry');
    EditorLinter = require('../lib/editor-linter');
    LinterRegistry = require('../lib/linter-registry');
    objectSize = function(obj) {
      var size, value;
      size = 0;
      for (value in obj) {
        size++;
      }
      return size;
    };
    _ref = require('./common'), getLinterRegistry = _ref.getLinterRegistry, getMessage = _ref.getMessage;
    beforeEach(function() {
      return waitsForPromise(function() {
        atom.workspace.destroyActivePaneItem();
        return atom.workspace.open('test.txt').then(function() {
          if (messageRegistry != null) {
            messageRegistry.dispose();
          }
          return messageRegistry = new MessageRegistry();
        });
      });
    });
    describe('::set', function() {
      it('accepts info from LinterRegistry::lint', function() {
        var editorLinter, linterRegistry, wasUpdated, _ref1;
        _ref1 = getLinterRegistry(), linterRegistry = _ref1.linterRegistry, editorLinter = _ref1.editorLinter;
        wasUpdated = false;
        linterRegistry.onDidUpdateMessages(function(linterInfo) {
          wasUpdated = true;
          messageRegistry.set(linterInfo);
          return expect(messageRegistry.hasChanged).toBe(true);
        });
        return waitsForPromise(function() {
          return linterRegistry.lint({
            onChange: false,
            editorLinter: editorLinter
          }).then(function() {
            expect(wasUpdated).toBe(true);
            return linterRegistry.dispose();
          });
        });
      });
      return it('ignores deactivated linters', function() {
        var editorLinter, linter, linterRegistry, _ref1;
        _ref1 = getLinterRegistry(), linterRegistry = _ref1.linterRegistry, editorLinter = _ref1.editorLinter, linter = _ref1.linter;
        messageRegistry.set({
          linter: linter,
          messages: [getMessage('Error'), getMessage('Warning')]
        });
        messageRegistry.updatePublic();
        expect(messageRegistry.publicMessages.length).toBe(2);
        linter.deactivated = true;
        messageRegistry.set({
          linter: linter,
          messages: [getMessage('Error')]
        });
        messageRegistry.updatePublic();
        expect(messageRegistry.publicMessages.length).toBe(2);
        linter.deactivated = false;
        messageRegistry.set({
          linter: linter,
          messages: [getMessage('Error')]
        });
        messageRegistry.updatePublic();
        return expect(messageRegistry.publicMessages.length).toBe(1);
      });
    });
    describe('::onDidUpdateMessages', function() {
      it('is triggered asyncly with results and provides a diff', function() {
        var editorLinter, linterRegistry, wasUpdated, _ref1;
        wasUpdated = false;
        _ref1 = getLinterRegistry(), linterRegistry = _ref1.linterRegistry, editorLinter = _ref1.editorLinter;
        linterRegistry.onDidUpdateMessages(function(linterInfo) {
          messageRegistry.set(linterInfo);
          expect(messageRegistry.hasChanged).toBe(true);
          return messageRegistry.updatePublic();
        });
        messageRegistry.onDidUpdateMessages(function(_arg) {
          var added, messages, removed;
          added = _arg.added, removed = _arg.removed, messages = _arg.messages;
          wasUpdated = true;
          expect(added.length).toBe(1);
          expect(removed.length).toBe(0);
          return expect(messages.length).toBe(1);
        });
        return waitsForPromise(function() {
          return linterRegistry.lint({
            onChange: false,
            editorLinter: editorLinter
          }).then(function() {
            expect(wasUpdated).toBe(true);
            return linterRegistry.dispose();
          });
        });
      });
      return it('provides the same objects when they dont change', function() {
        var disposable, editorLinter, linterRegistry, wasUpdated, _ref1;
        wasUpdated = false;
        _ref1 = getLinterRegistry(), linterRegistry = _ref1.linterRegistry, editorLinter = _ref1.editorLinter;
        linterRegistry.onDidUpdateMessages(function(linterInfo) {
          messageRegistry.set(linterInfo);
          return messageRegistry.updatePublic();
        });
        disposable = messageRegistry.onDidUpdateMessages(function(_arg) {
          var added, obj;
          added = _arg.added;
          expect(added.length).toBe(1);
          obj = added[0];
          disposable.dispose();
          return messageRegistry.onDidUpdateMessages(function(_arg1) {
            var messages;
            messages = _arg1.messages;
            wasUpdated = true;
            return expect(messages[0]).toBe(obj);
          });
        });
        return waitsForPromise(function() {
          return linterRegistry.lint({
            onChange: false,
            editorLinter: editorLinter
          }).then(function() {
            return linterRegistry.lint({
              onChange: false,
              editorLinter: editorLinter
            });
          }).then(function() {
            expect(wasUpdated).toBe(true);
            return linterRegistry.dispose();
          });
        });
      });
    });
    describe('::deleteEditorMessages', function() {
      return it('removes messages for that editor', function() {
        var editor, editorLinter, linterRegistry, wasUpdated, _ref1;
        wasUpdated = 0;
        _ref1 = getLinterRegistry(), linterRegistry = _ref1.linterRegistry, editorLinter = _ref1.editorLinter;
        editor = editorLinter.editor;
        linterRegistry.onDidUpdateMessages(function(linterInfo) {
          messageRegistry.set(linterInfo);
          expect(messageRegistry.hasChanged).toBe(true);
          return messageRegistry.updatePublic();
        });
        messageRegistry.onDidUpdateMessages(function(_arg) {
          var messages;
          messages = _arg.messages;
          wasUpdated = 1;
          expect(objectSize(messages)).toBe(1);
          return messageRegistry.deleteEditorMessages(editor);
        });
        return waitsForPromise(function() {
          return linterRegistry.lint({
            onChange: false,
            editorLinter: editorLinter
          }).then(function() {
            expect(wasUpdated).toBe(1);
            return linterRegistry.dispose();
          });
        });
      });
    });
    return describe('handles multiple panes resulting in multiple editors', function() {
      var leftEditorLinter, leftPane, linter, linterRegistry, messageUpdateDetails, rightEditorLinter, rightPane, runLint;
      leftPane = rightPane = linterRegistry = linter = null;
      leftEditorLinter = rightEditorLinter = messageUpdateDetails = null;
      beforeEach(function() {
        var lintCount, _ref1;
        _ref1 = getLinterRegistry(), linterRegistry = _ref1.linterRegistry, linter = _ref1.linter, leftEditorLinter = _ref1.editorLinter;
        linter.scope = 'file';
        lintCount = 0;
        linter.lint = function() {
          var lintId;
          lintId = lintCount++;
          return [
            {
              key: lintId,
              type: "Error " + lintId,
              text: "Something"
            }
          ];
        };
        leftPane = atom.workspace.getActivePane();
        rightPane = leftPane.splitRight({
          copyActiveItem: true
        });
        rightEditorLinter = new EditorLinter(rightPane.getActiveItem());
        expect(leftEditorLinter.editor).not.toBe(rightEditorLinter.editor);
        linterRegistry.onDidUpdateMessages(function(linterInfo) {
          messageRegistry.set(linterInfo);
          return messageRegistry.updatePublic();
        });
        return messageRegistry.onDidUpdateMessages(function(updateDetails) {
          return messageUpdateDetails = updateDetails;
        });
      });
      afterEach(function() {
        return linterRegistry.dispose();
      });
      runLint = function(editorLinter) {
        atom.workspace.paneForItem(editorLinter.editor).activate();
        return linterRegistry.lint({
          onChange: false,
          editorLinter: editorLinter
        }).then(function() {
          var returnDetails;
          returnDetails = messageUpdateDetails;
          messageUpdateDetails = null;
          return returnDetails;
        });
      };
      return it('stores messages on a per-buffer basis', function() {
        expect(messageRegistry.publicMessages.length).toBe(0);
        return waitsForPromise(function() {
          return runLint(leftEditorLinter).then(function(_arg) {
            var added, removed;
            added = _arg.added, removed = _arg.removed;
            expect(added.length).toBe(1);
            expect(removed.length).toBe(0);
            expect(messageRegistry.publicMessages.length).toBe(1);
            return runLint(rightEditorLinter);
          }).then(function(_arg) {
            var added, removed;
            added = _arg.added, removed = _arg.removed;
            expect(added.length).toBe(1);
            expect(removed.length).toBe(1);
            return expect(messageRegistry.publicMessages.length).toBe(1);
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9zcGVjL21lc3NhZ2UtcmVnaXN0cnktc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLEVBQUEsUUFBQSxDQUFTLGtCQUFULEVBQTZCLFNBQUEsR0FBQTtBQUMzQixRQUFBLCtHQUFBO0FBQUEsSUFBQSxlQUFBLEdBQWtCLElBQWxCLENBQUE7QUFBQSxJQUNBLGVBQUEsR0FBa0IsT0FBQSxDQUFRLHlCQUFSLENBRGxCLENBQUE7QUFBQSxJQUVBLFlBQUEsR0FBZSxPQUFBLENBQVEsc0JBQVIsQ0FGZixDQUFBO0FBQUEsSUFHQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSx3QkFBUixDQUhqQixDQUFBO0FBQUEsSUFJQSxVQUFBLEdBQWEsU0FBQyxHQUFELEdBQUE7QUFDWCxVQUFBLFdBQUE7QUFBQSxNQUFBLElBQUEsR0FBTyxDQUFQLENBQUE7QUFDQSxXQUFBLFlBQUEsR0FBQTtBQUFBLFFBQUEsSUFBQSxFQUFBLENBQUE7QUFBQSxPQURBO0FBRUEsYUFBTyxJQUFQLENBSFc7SUFBQSxDQUpiLENBQUE7QUFBQSxJQVFBLE9BQWtDLE9BQUEsQ0FBUSxVQUFSLENBQWxDLEVBQUMseUJBQUEsaUJBQUQsRUFBb0Isa0JBQUEsVUFScEIsQ0FBQTtBQUFBLElBVUEsVUFBQSxDQUFXLFNBQUEsR0FBQTthQUNULGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO0FBQ2QsUUFBQSxJQUFJLENBQUMsU0FBUyxDQUFDLHFCQUFmLENBQUEsQ0FBQSxDQUFBO2VBQ0EsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLFVBQXBCLENBQStCLENBQUMsSUFBaEMsQ0FBcUMsU0FBQSxHQUFBOztZQUNuQyxlQUFlLENBQUUsT0FBakIsQ0FBQTtXQUFBO2lCQUNBLGVBQUEsR0FBc0IsSUFBQSxlQUFBLENBQUEsRUFGYTtRQUFBLENBQXJDLEVBRmM7TUFBQSxDQUFoQixFQURTO0lBQUEsQ0FBWCxDQVZBLENBQUE7QUFBQSxJQWlCQSxRQUFBLENBQVMsT0FBVCxFQUFrQixTQUFBLEdBQUE7QUFDaEIsTUFBQSxFQUFBLENBQUcsd0NBQUgsRUFBNkMsU0FBQSxHQUFBO0FBQzNDLFlBQUEsK0NBQUE7QUFBQSxRQUFBLFFBQWlDLGlCQUFBLENBQUEsQ0FBakMsRUFBQyx1QkFBQSxjQUFELEVBQWlCLHFCQUFBLFlBQWpCLENBQUE7QUFBQSxRQUNBLFVBQUEsR0FBYSxLQURiLENBQUE7QUFBQSxRQUVBLGNBQWMsQ0FBQyxtQkFBZixDQUFtQyxTQUFDLFVBQUQsR0FBQTtBQUNqQyxVQUFBLFVBQUEsR0FBYSxJQUFiLENBQUE7QUFBQSxVQUNBLGVBQWUsQ0FBQyxHQUFoQixDQUFvQixVQUFwQixDQURBLENBQUE7aUJBRUEsTUFBQSxDQUFPLGVBQWUsQ0FBQyxVQUF2QixDQUFrQyxDQUFDLElBQW5DLENBQXdDLElBQXhDLEVBSGlDO1FBQUEsQ0FBbkMsQ0FGQSxDQUFBO2VBTUEsZUFBQSxDQUFnQixTQUFBLEdBQUE7aUJBQ2QsY0FBYyxDQUFDLElBQWYsQ0FBb0I7QUFBQSxZQUFDLFFBQUEsRUFBVSxLQUFYO0FBQUEsWUFBa0IsY0FBQSxZQUFsQjtXQUFwQixDQUFvRCxDQUFDLElBQXJELENBQTBELFNBQUEsR0FBQTtBQUN4RCxZQUFBLE1BQUEsQ0FBTyxVQUFQLENBQWtCLENBQUMsSUFBbkIsQ0FBd0IsSUFBeEIsQ0FBQSxDQUFBO21CQUNBLGNBQWMsQ0FBQyxPQUFmLENBQUEsRUFGd0Q7VUFBQSxDQUExRCxFQURjO1FBQUEsQ0FBaEIsRUFQMkM7TUFBQSxDQUE3QyxDQUFBLENBQUE7YUFXQSxFQUFBLENBQUcsNkJBQUgsRUFBa0MsU0FBQSxHQUFBO0FBQ2hDLFlBQUEsMkNBQUE7QUFBQSxRQUFBLFFBQXlDLGlCQUFBLENBQUEsQ0FBekMsRUFBQyx1QkFBQSxjQUFELEVBQWlCLHFCQUFBLFlBQWpCLEVBQStCLGVBQUEsTUFBL0IsQ0FBQTtBQUFBLFFBQ0EsZUFBZSxDQUFDLEdBQWhCLENBQW9CO0FBQUEsVUFBQyxRQUFBLE1BQUQ7QUFBQSxVQUFTLFFBQUEsRUFBVSxDQUFDLFVBQUEsQ0FBVyxPQUFYLENBQUQsRUFBc0IsVUFBQSxDQUFXLFNBQVgsQ0FBdEIsQ0FBbkI7U0FBcEIsQ0FEQSxDQUFBO0FBQUEsUUFFQSxlQUFlLENBQUMsWUFBaEIsQ0FBQSxDQUZBLENBQUE7QUFBQSxRQUdBLE1BQUEsQ0FBTyxlQUFlLENBQUMsY0FBYyxDQUFDLE1BQXRDLENBQTZDLENBQUMsSUFBOUMsQ0FBbUQsQ0FBbkQsQ0FIQSxDQUFBO0FBQUEsUUFJQSxNQUFNLENBQUMsV0FBUCxHQUFxQixJQUpyQixDQUFBO0FBQUEsUUFLQSxlQUFlLENBQUMsR0FBaEIsQ0FBb0I7QUFBQSxVQUFDLFFBQUEsTUFBRDtBQUFBLFVBQVMsUUFBQSxFQUFVLENBQUMsVUFBQSxDQUFXLE9BQVgsQ0FBRCxDQUFuQjtTQUFwQixDQUxBLENBQUE7QUFBQSxRQU1BLGVBQWUsQ0FBQyxZQUFoQixDQUFBLENBTkEsQ0FBQTtBQUFBLFFBT0EsTUFBQSxDQUFPLGVBQWUsQ0FBQyxjQUFjLENBQUMsTUFBdEMsQ0FBNkMsQ0FBQyxJQUE5QyxDQUFtRCxDQUFuRCxDQVBBLENBQUE7QUFBQSxRQVFBLE1BQU0sQ0FBQyxXQUFQLEdBQXFCLEtBUnJCLENBQUE7QUFBQSxRQVNBLGVBQWUsQ0FBQyxHQUFoQixDQUFvQjtBQUFBLFVBQUMsUUFBQSxNQUFEO0FBQUEsVUFBUyxRQUFBLEVBQVUsQ0FBQyxVQUFBLENBQVcsT0FBWCxDQUFELENBQW5CO1NBQXBCLENBVEEsQ0FBQTtBQUFBLFFBVUEsZUFBZSxDQUFDLFlBQWhCLENBQUEsQ0FWQSxDQUFBO2VBV0EsTUFBQSxDQUFPLGVBQWUsQ0FBQyxjQUFjLENBQUMsTUFBdEMsQ0FBNkMsQ0FBQyxJQUE5QyxDQUFtRCxDQUFuRCxFQVpnQztNQUFBLENBQWxDLEVBWmdCO0lBQUEsQ0FBbEIsQ0FqQkEsQ0FBQTtBQUFBLElBMkNBLFFBQUEsQ0FBUyx1QkFBVCxFQUFrQyxTQUFBLEdBQUE7QUFDaEMsTUFBQSxFQUFBLENBQUcsdURBQUgsRUFBNEQsU0FBQSxHQUFBO0FBQzFELFlBQUEsK0NBQUE7QUFBQSxRQUFBLFVBQUEsR0FBYSxLQUFiLENBQUE7QUFBQSxRQUNBLFFBQWlDLGlCQUFBLENBQUEsQ0FBakMsRUFBQyx1QkFBQSxjQUFELEVBQWlCLHFCQUFBLFlBRGpCLENBQUE7QUFBQSxRQUVBLGNBQWMsQ0FBQyxtQkFBZixDQUFtQyxTQUFDLFVBQUQsR0FBQTtBQUNqQyxVQUFBLGVBQWUsQ0FBQyxHQUFoQixDQUFvQixVQUFwQixDQUFBLENBQUE7QUFBQSxVQUNBLE1BQUEsQ0FBTyxlQUFlLENBQUMsVUFBdkIsQ0FBa0MsQ0FBQyxJQUFuQyxDQUF3QyxJQUF4QyxDQURBLENBQUE7aUJBRUEsZUFBZSxDQUFDLFlBQWhCLENBQUEsRUFIaUM7UUFBQSxDQUFuQyxDQUZBLENBQUE7QUFBQSxRQU1BLGVBQWUsQ0FBQyxtQkFBaEIsQ0FBb0MsU0FBQyxJQUFELEdBQUE7QUFDbEMsY0FBQSx3QkFBQTtBQUFBLFVBRG9DLGFBQUEsT0FBTyxlQUFBLFNBQVMsZ0JBQUEsUUFDcEQsQ0FBQTtBQUFBLFVBQUEsVUFBQSxHQUFhLElBQWIsQ0FBQTtBQUFBLFVBQ0EsTUFBQSxDQUFPLEtBQUssQ0FBQyxNQUFiLENBQW9CLENBQUMsSUFBckIsQ0FBMEIsQ0FBMUIsQ0FEQSxDQUFBO0FBQUEsVUFFQSxNQUFBLENBQU8sT0FBTyxDQUFDLE1BQWYsQ0FBc0IsQ0FBQyxJQUF2QixDQUE0QixDQUE1QixDQUZBLENBQUE7aUJBR0EsTUFBQSxDQUFPLFFBQVEsQ0FBQyxNQUFoQixDQUF1QixDQUFDLElBQXhCLENBQTZCLENBQTdCLEVBSmtDO1FBQUEsQ0FBcEMsQ0FOQSxDQUFBO2VBV0EsZUFBQSxDQUFnQixTQUFBLEdBQUE7aUJBQ2QsY0FBYyxDQUFDLElBQWYsQ0FBb0I7QUFBQSxZQUFDLFFBQUEsRUFBVSxLQUFYO0FBQUEsWUFBa0IsY0FBQSxZQUFsQjtXQUFwQixDQUFvRCxDQUFDLElBQXJELENBQTBELFNBQUEsR0FBQTtBQUN4RCxZQUFBLE1BQUEsQ0FBTyxVQUFQLENBQWtCLENBQUMsSUFBbkIsQ0FBd0IsSUFBeEIsQ0FBQSxDQUFBO21CQUNBLGNBQWMsQ0FBQyxPQUFmLENBQUEsRUFGd0Q7VUFBQSxDQUExRCxFQURjO1FBQUEsQ0FBaEIsRUFaMEQ7TUFBQSxDQUE1RCxDQUFBLENBQUE7YUFnQkEsRUFBQSxDQUFHLGlEQUFILEVBQXNELFNBQUEsR0FBQTtBQUNwRCxZQUFBLDJEQUFBO0FBQUEsUUFBQSxVQUFBLEdBQWEsS0FBYixDQUFBO0FBQUEsUUFDQSxRQUFpQyxpQkFBQSxDQUFBLENBQWpDLEVBQUMsdUJBQUEsY0FBRCxFQUFpQixxQkFBQSxZQURqQixDQUFBO0FBQUEsUUFFQSxjQUFjLENBQUMsbUJBQWYsQ0FBbUMsU0FBQyxVQUFELEdBQUE7QUFDakMsVUFBQSxlQUFlLENBQUMsR0FBaEIsQ0FBb0IsVUFBcEIsQ0FBQSxDQUFBO2lCQUNBLGVBQWUsQ0FBQyxZQUFoQixDQUFBLEVBRmlDO1FBQUEsQ0FBbkMsQ0FGQSxDQUFBO0FBQUEsUUFLQSxVQUFBLEdBQWEsZUFBZSxDQUFDLG1CQUFoQixDQUFvQyxTQUFDLElBQUQsR0FBQTtBQUMvQyxjQUFBLFVBQUE7QUFBQSxVQURpRCxRQUFELEtBQUMsS0FDakQsQ0FBQTtBQUFBLFVBQUEsTUFBQSxDQUFPLEtBQUssQ0FBQyxNQUFiLENBQW9CLENBQUMsSUFBckIsQ0FBMEIsQ0FBMUIsQ0FBQSxDQUFBO0FBQUEsVUFDQSxHQUFBLEdBQU0sS0FBTSxDQUFBLENBQUEsQ0FEWixDQUFBO0FBQUEsVUFFQSxVQUFVLENBQUMsT0FBWCxDQUFBLENBRkEsQ0FBQTtpQkFHQSxlQUFlLENBQUMsbUJBQWhCLENBQW9DLFNBQUMsS0FBRCxHQUFBO0FBQ2xDLGdCQUFBLFFBQUE7QUFBQSxZQURvQyxXQUFELE1BQUMsUUFDcEMsQ0FBQTtBQUFBLFlBQUEsVUFBQSxHQUFhLElBQWIsQ0FBQTttQkFDQSxNQUFBLENBQU8sUUFBUyxDQUFBLENBQUEsQ0FBaEIsQ0FBbUIsQ0FBQyxJQUFwQixDQUF5QixHQUF6QixFQUZrQztVQUFBLENBQXBDLEVBSitDO1FBQUEsQ0FBcEMsQ0FMYixDQUFBO2VBWUEsZUFBQSxDQUFnQixTQUFBLEdBQUE7aUJBQ2QsY0FBYyxDQUFDLElBQWYsQ0FBb0I7QUFBQSxZQUFDLFFBQUEsRUFBVSxLQUFYO0FBQUEsWUFBa0IsY0FBQSxZQUFsQjtXQUFwQixDQUFvRCxDQUFDLElBQXJELENBQTJELFNBQUEsR0FBQTtBQUN6RCxtQkFBTyxjQUFjLENBQUMsSUFBZixDQUFvQjtBQUFBLGNBQUMsUUFBQSxFQUFVLEtBQVg7QUFBQSxjQUFrQixjQUFBLFlBQWxCO2FBQXBCLENBQVAsQ0FEeUQ7VUFBQSxDQUEzRCxDQUVDLENBQUMsSUFGRixDQUVPLFNBQUEsR0FBQTtBQUNMLFlBQUEsTUFBQSxDQUFPLFVBQVAsQ0FBa0IsQ0FBQyxJQUFuQixDQUF3QixJQUF4QixDQUFBLENBQUE7bUJBQ0EsY0FBYyxDQUFDLE9BQWYsQ0FBQSxFQUZLO1VBQUEsQ0FGUCxFQURjO1FBQUEsQ0FBaEIsRUFib0Q7TUFBQSxDQUF0RCxFQWpCZ0M7SUFBQSxDQUFsQyxDQTNDQSxDQUFBO0FBQUEsSUFnRkEsUUFBQSxDQUFTLHdCQUFULEVBQW1DLFNBQUEsR0FBQTthQUNqQyxFQUFBLENBQUcsa0NBQUgsRUFBdUMsU0FBQSxHQUFBO0FBQ3JDLFlBQUEsdURBQUE7QUFBQSxRQUFBLFVBQUEsR0FBYSxDQUFiLENBQUE7QUFBQSxRQUNBLFFBQWlDLGlCQUFBLENBQUEsQ0FBakMsRUFBQyx1QkFBQSxjQUFELEVBQWlCLHFCQUFBLFlBRGpCLENBQUE7QUFBQSxRQUVBLE1BQUEsR0FBUyxZQUFZLENBQUMsTUFGdEIsQ0FBQTtBQUFBLFFBR0EsY0FBYyxDQUFDLG1CQUFmLENBQW1DLFNBQUMsVUFBRCxHQUFBO0FBQ2pDLFVBQUEsZUFBZSxDQUFDLEdBQWhCLENBQW9CLFVBQXBCLENBQUEsQ0FBQTtBQUFBLFVBQ0EsTUFBQSxDQUFPLGVBQWUsQ0FBQyxVQUF2QixDQUFrQyxDQUFDLElBQW5DLENBQXdDLElBQXhDLENBREEsQ0FBQTtpQkFFQSxlQUFlLENBQUMsWUFBaEIsQ0FBQSxFQUhpQztRQUFBLENBQW5DLENBSEEsQ0FBQTtBQUFBLFFBT0EsZUFBZSxDQUFDLG1CQUFoQixDQUFvQyxTQUFDLElBQUQsR0FBQTtBQUNsQyxjQUFBLFFBQUE7QUFBQSxVQURvQyxXQUFELEtBQUMsUUFDcEMsQ0FBQTtBQUFBLFVBQUEsVUFBQSxHQUFhLENBQWIsQ0FBQTtBQUFBLFVBQ0EsTUFBQSxDQUFPLFVBQUEsQ0FBVyxRQUFYLENBQVAsQ0FBNEIsQ0FBQyxJQUE3QixDQUFrQyxDQUFsQyxDQURBLENBQUE7aUJBRUEsZUFBZSxDQUFDLG9CQUFoQixDQUFxQyxNQUFyQyxFQUhrQztRQUFBLENBQXBDLENBUEEsQ0FBQTtlQVdBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2lCQUNkLGNBQWMsQ0FBQyxJQUFmLENBQW9CO0FBQUEsWUFBQyxRQUFBLEVBQVUsS0FBWDtBQUFBLFlBQWtCLGNBQUEsWUFBbEI7V0FBcEIsQ0FBb0QsQ0FBQyxJQUFyRCxDQUEwRCxTQUFBLEdBQUE7QUFDeEQsWUFBQSxNQUFBLENBQU8sVUFBUCxDQUFrQixDQUFDLElBQW5CLENBQXdCLENBQXhCLENBQUEsQ0FBQTttQkFDQSxjQUFjLENBQUMsT0FBZixDQUFBLEVBRndEO1VBQUEsQ0FBMUQsRUFEYztRQUFBLENBQWhCLEVBWnFDO01BQUEsQ0FBdkMsRUFEaUM7SUFBQSxDQUFuQyxDQWhGQSxDQUFBO1dBa0dBLFFBQUEsQ0FBUyxzREFBVCxFQUFpRSxTQUFBLEdBQUE7QUFDL0QsVUFBQSwrR0FBQTtBQUFBLE1BQUEsUUFBQSxHQUFXLFNBQUEsR0FBWSxjQUFBLEdBQWlCLE1BQUEsR0FBUyxJQUFqRCxDQUFBO0FBQUEsTUFDQSxnQkFBQSxHQUFtQixpQkFBQSxHQUFvQixvQkFBQSxHQUF1QixJQUQ5RCxDQUFBO0FBQUEsTUFHQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsWUFBQSxnQkFBQTtBQUFBLFFBQUEsUUFBMkQsaUJBQUEsQ0FBQSxDQUEzRCxFQUFDLHVCQUFBLGNBQUQsRUFBaUIsZUFBQSxNQUFqQixFQUF1Qyx5QkFBZCxZQUF6QixDQUFBO0FBQUEsUUFFQSxNQUFNLENBQUMsS0FBUCxHQUFlLE1BRmYsQ0FBQTtBQUFBLFFBR0EsU0FBQSxHQUFZLENBSFosQ0FBQTtBQUFBLFFBSUEsTUFBTSxDQUFDLElBQVAsR0FBYyxTQUFBLEdBQUE7QUFDWixjQUFBLE1BQUE7QUFBQSxVQUFBLE1BQUEsR0FBUyxTQUFBLEVBQVQsQ0FBQTtpQkFDQTtZQUFDO0FBQUEsY0FBQyxHQUFBLEVBQUssTUFBTjtBQUFBLGNBQWMsSUFBQSxFQUFNLFFBQUEsR0FBVyxNQUEvQjtBQUFBLGNBQXVDLElBQUEsRUFBTSxXQUE3QzthQUFEO1lBRlk7UUFBQSxDQUpkLENBQUE7QUFBQSxRQU9BLFFBQUEsR0FBVyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBQSxDQVBYLENBQUE7QUFBQSxRQVFBLFNBQUEsR0FBWSxRQUFRLENBQUMsVUFBVCxDQUFvQjtBQUFBLFVBQUMsY0FBQSxFQUFnQixJQUFqQjtTQUFwQixDQVJaLENBQUE7QUFBQSxRQVNBLGlCQUFBLEdBQXdCLElBQUEsWUFBQSxDQUFhLFNBQVMsQ0FBQyxhQUFWLENBQUEsQ0FBYixDQVR4QixDQUFBO0FBQUEsUUFVQSxNQUFBLENBQU8sZ0JBQWdCLENBQUMsTUFBeEIsQ0FBK0IsQ0FBQyxHQUFHLENBQUMsSUFBcEMsQ0FBeUMsaUJBQWlCLENBQUMsTUFBM0QsQ0FWQSxDQUFBO0FBQUEsUUFXQSxjQUFjLENBQUMsbUJBQWYsQ0FBbUMsU0FBQyxVQUFELEdBQUE7QUFDakMsVUFBQSxlQUFlLENBQUMsR0FBaEIsQ0FBb0IsVUFBcEIsQ0FBQSxDQUFBO2lCQUNBLGVBQWUsQ0FBQyxZQUFoQixDQUFBLEVBRmlDO1FBQUEsQ0FBbkMsQ0FYQSxDQUFBO2VBY0EsZUFBZSxDQUFDLG1CQUFoQixDQUFvQyxTQUFDLGFBQUQsR0FBQTtpQkFDbEMsb0JBQUEsR0FBdUIsY0FEVztRQUFBLENBQXBDLEVBZlM7TUFBQSxDQUFYLENBSEEsQ0FBQTtBQUFBLE1Bb0JBLFNBQUEsQ0FBVSxTQUFBLEdBQUE7ZUFDUixjQUFjLENBQUMsT0FBZixDQUFBLEVBRFE7TUFBQSxDQUFWLENBcEJBLENBQUE7QUFBQSxNQXVCQSxPQUFBLEdBQVUsU0FBQyxZQUFELEdBQUE7QUFDUixRQUFBLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBZixDQUEyQixZQUFZLENBQUMsTUFBeEMsQ0FBK0MsQ0FBQyxRQUFoRCxDQUFBLENBQUEsQ0FBQTtlQUNBLGNBQWMsQ0FBQyxJQUFmLENBQW9CO0FBQUEsVUFBQyxRQUFBLEVBQVUsS0FBWDtBQUFBLFVBQWtCLGNBQUEsWUFBbEI7U0FBcEIsQ0FBb0QsQ0FBQyxJQUFyRCxDQUEwRCxTQUFBLEdBQUE7QUFDeEQsY0FBQSxhQUFBO0FBQUEsVUFBQSxhQUFBLEdBQWdCLG9CQUFoQixDQUFBO0FBQUEsVUFDQSxvQkFBQSxHQUF1QixJQUR2QixDQUFBO2lCQUVBLGNBSHdEO1FBQUEsQ0FBMUQsRUFGUTtNQUFBLENBdkJWLENBQUE7YUE4QkEsRUFBQSxDQUFHLHVDQUFILEVBQTRDLFNBQUEsR0FBQTtBQUMxQyxRQUFBLE1BQUEsQ0FBTyxlQUFlLENBQUMsY0FBYyxDQUFDLE1BQXRDLENBQTZDLENBQUMsSUFBOUMsQ0FBbUQsQ0FBbkQsQ0FBQSxDQUFBO2VBQ0EsZUFBQSxDQUFnQixTQUFBLEdBQUE7aUJBQ2QsT0FBQSxDQUFRLGdCQUFSLENBQ0EsQ0FBQyxJQURELENBQ00sU0FBQyxJQUFELEdBQUE7QUFDSixnQkFBQSxjQUFBO0FBQUEsWUFETSxhQUFBLE9BQU8sZUFBQSxPQUNiLENBQUE7QUFBQSxZQUFBLE1BQUEsQ0FBTyxLQUFLLENBQUMsTUFBYixDQUFvQixDQUFDLElBQXJCLENBQTBCLENBQTFCLENBQUEsQ0FBQTtBQUFBLFlBQ0EsTUFBQSxDQUFPLE9BQU8sQ0FBQyxNQUFmLENBQXNCLENBQUMsSUFBdkIsQ0FBNEIsQ0FBNUIsQ0FEQSxDQUFBO0FBQUEsWUFFQSxNQUFBLENBQU8sZUFBZSxDQUFDLGNBQWMsQ0FBQyxNQUF0QyxDQUE2QyxDQUFDLElBQTlDLENBQW1ELENBQW5ELENBRkEsQ0FBQTttQkFHQSxPQUFBLENBQVMsaUJBQVQsRUFKSTtVQUFBLENBRE4sQ0FNQSxDQUFDLElBTkQsQ0FNTSxTQUFDLElBQUQsR0FBQTtBQUNKLGdCQUFBLGNBQUE7QUFBQSxZQURNLGFBQUEsT0FBTyxlQUFBLE9BQ2IsQ0FBQTtBQUFBLFlBQUEsTUFBQSxDQUFPLEtBQUssQ0FBQyxNQUFiLENBQW9CLENBQUMsSUFBckIsQ0FBMEIsQ0FBMUIsQ0FBQSxDQUFBO0FBQUEsWUFDQSxNQUFBLENBQU8sT0FBTyxDQUFDLE1BQWYsQ0FBc0IsQ0FBQyxJQUF2QixDQUE0QixDQUE1QixDQURBLENBQUE7bUJBRUEsTUFBQSxDQUFPLGVBQWUsQ0FBQyxjQUFjLENBQUMsTUFBdEMsQ0FBNkMsQ0FBQyxJQUE5QyxDQUFtRCxDQUFuRCxFQUhJO1VBQUEsQ0FOTixFQURjO1FBQUEsQ0FBaEIsRUFGMEM7TUFBQSxDQUE1QyxFQS9CK0Q7SUFBQSxDQUFqRSxFQW5HMkI7RUFBQSxDQUE3QixDQUFBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/ah/.atom/packages/linter/spec/message-registry-spec.coffee
