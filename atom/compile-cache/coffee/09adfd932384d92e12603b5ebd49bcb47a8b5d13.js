(function() {
  describe('BottomPanel', function() {
    var BottomPanel, bottomPanel, getMessage, linter;
    BottomPanel = require('../../lib/ui/bottom-panel').BottomPanel;
    linter = null;
    bottomPanel = null;
    beforeEach(function() {
      if (bottomPanel != null) {
        bottomPanel.dispose();
      }
      bottomPanel = new BottomPanel('File');
      return waitsForPromise(function() {
        return atom.packages.activatePackage('linter').then(function() {
          return linter = atom.packages.getActivePackage('linter').mainModule.instance;
        });
      });
    });
    getMessage = function(type, filePath) {
      return {
        type: type,
        text: "Some Message",
        filePath: filePath
      };
    };
    it('remains visible when theres no active pane', function() {
      return expect(linter.views.panel.getVisibility()).toBe(true);
    });
    it('hides on config change', function() {
      expect(linter.views.panel.getVisibility()).toBe(true);
      atom.config.set('linter.showErrorPanel', false);
      expect(linter.views.panel.getVisibility()).toBe(false);
      atom.config.set('linter.showErrorPanel', true);
      return expect(linter.views.panel.getVisibility()).toBe(true);
    });
    return describe('{set, remove}Messages', function() {
      return it('works as expected', function() {
        var messages;
        messages = [getMessage('Error'), getMessage('Warning')];
        bottomPanel.setMessages({
          added: messages,
          removed: []
        });
        expect(bottomPanel.element.childNodes.length).toBe(2);
        bottomPanel.setMessages({
          added: [],
          removed: messages
        });
        expect(bottomPanel.element.childNodes.length).toBe(0);
        bottomPanel.setMessages({
          added: messages,
          removed: []
        });
        expect(bottomPanel.element.childNodes.length).toBe(2);
        bottomPanel.removeMessages(messages);
        return expect(bottomPanel.element.childNodes.length).toBe(0);
      });
    });
  });

}).call(this);
