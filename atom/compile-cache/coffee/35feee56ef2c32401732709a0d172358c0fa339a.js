(function() {
  describe('Message Element', function() {
    var Message, filePath, getMessage, visibleText;
    Message = require('../../lib/ui/message-element').Message;
    filePath = __dirname + '/fixtures/file.txt';
    getMessage = function(type) {
      return {
        type: type,
        text: "Some Message",
        filePath: filePath
      };
    };
    visibleText = function(element) {
      var cloned;
      cloned = element.cloneNode(true);
      Array.prototype.forEach.call(cloned.querySelectorAll('[hidden]'), function(item) {
        return item.remove();
      });
      return cloned.textContent;
    };
    return it('works', function() {
      var message, messageElement;
      message = getMessage('Error');
      messageElement = Message.fromMessage(message, 'Project');
      messageElement.attachedCallback();
      expect(visibleText(messageElement).indexOf(filePath) !== -1).toBe(true);
      messageElement.updateVisibility('File');
      expect(messageElement.hasAttribute('hidden')).toBe(true);
      message.currentFile = true;
      messageElement.updateVisibility('File');
      expect(messageElement.hasAttribute('hidden')).toBe(false);
      expect(visibleText(messageElement).indexOf(filePath) === -1).toBe(true);
      messageElement.updateVisibility('Line');
      expect(messageElement.hasAttribute('hidden')).toBe(true);
      message.currentLine = true;
      messageElement.updateVisibility('Line');
      expect(messageElement.hasAttribute('hidden')).toBe(false);
      return expect(visibleText(messageElement).indexOf(filePath) === -1).toBe(true);
    });
  });

}).call(this);
