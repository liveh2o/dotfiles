function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libMessageRegistry = require('../lib/message-registry');

var _libMessageRegistry2 = _interopRequireDefault(_libMessageRegistry);

var _common = require('./common');

describe('Message Registry', function () {
  var messageRegistry = undefined;
  beforeEach(function () {
    messageRegistry = new _libMessageRegistry2['default']();
    messageRegistry.debouncedUpdate = jasmine.createSpy('debouncedUpdate');
  });
  afterEach(function () {
    messageRegistry.dispose();
  });

  describe('::set', function () {
    it('stores results using both buffer and linter', function () {
      var messageFirst = (0, _common.getMessageLegacy)();
      var messageSecond = (0, _common.getMessageLegacy)();
      var messageThird = (0, _common.getMessageLegacy)();
      var linter = { name: 'any' };
      var buffer = {};
      var info = undefined;

      messageRegistry.set({ linter: linter, buffer: null, messages: [messageFirst] });
      expect(messageRegistry.debouncedUpdate.calls.length).toBe(1);
      expect(messageRegistry.messagesMap.size).toBe(1);
      info = Array.from(messageRegistry.messagesMap)[0];

      expect(info.changed).toBe(true);
      expect(info.linter).toBe(linter);
      expect(info.buffer).toBe(null);
      expect(info.oldMessages.length).toBe(0);
      expect(info.messages.length).toBe(1);
      expect(info.messages[0]).toBe(messageFirst);

      messageRegistry.set({ linter: linter, buffer: null, messages: [messageFirst] });
      expect(messageRegistry.debouncedUpdate.calls.length).toBe(2);
      expect(messageRegistry.messagesMap.size).toBe(1);
      info = Array.from(messageRegistry.messagesMap)[0];

      expect(info.changed).toBe(true);
      expect(info.linter).toBe(linter);
      expect(info.buffer).toBe(null);
      expect(info.messages.length).toBe(1);
      expect(info.messages[0]).toBe(messageFirst);

      messageRegistry.set({ linter: linter, buffer: buffer, messages: [messageThird] });
      expect(messageRegistry.debouncedUpdate.calls.length).toBe(3);
      expect(messageRegistry.messagesMap.size).toBe(2);
      info = Array.from(messageRegistry.messagesMap)[0];

      expect(info.changed).toBe(true);
      expect(info.linter).toBe(linter);
      expect(info.buffer).toBe(null);
      expect(info.messages.length).toBe(1);
      expect(info.messages[0]).toBe(messageFirst);

      info = Array.from(messageRegistry.messagesMap)[1];

      expect(info.changed).toBe(true);
      expect(info.linter).toBe(linter);
      expect(info.buffer).toBe(buffer);
      expect(info.messages.length).toBe(1);
      expect(info.messages[0]).toBe(messageThird);

      messageRegistry.set({ linter: linter, buffer: null, messages: [messageFirst, messageSecond] });
      expect(messageRegistry.debouncedUpdate.calls.length).toBe(4);
      expect(messageRegistry.messagesMap.size).toBe(2);
      info = Array.from(messageRegistry.messagesMap)[0];

      expect(info.changed).toBe(true);
      expect(info.linter).toBe(linter);
      expect(info.buffer).toBe(null);
      expect(info.messages.length).toBe(2);
      expect(info.messages[0]).toBe(messageFirst);
      expect(info.messages[1]).toBe(messageSecond);

      info = Array.from(messageRegistry.messagesMap)[1];

      expect(info.changed).toBe(true);
      expect(info.linter).toBe(linter);
      expect(info.buffer).toBe(buffer);
      expect(info.messages.length).toBe(1);
      expect(info.messages[0]).toBe(messageThird);
    });
  });

  describe('updates (::update & ::onDidUpdateMessages)', function () {
    it('notifies on changes', function () {
      var called = 0;
      var linter = { name: 'any' };
      var message = (0, _common.getMessageLegacy)();
      messageRegistry.onDidUpdateMessages(function (_ref) {
        var added = _ref.added;
        var removed = _ref.removed;
        var messages = _ref.messages;

        called++;
        expect(added.length).toBe(1);
        expect(removed.length).toBe(0);
        expect(messages.length).toBe(1);
        expect(added).toEqual(messages);
        expect(added[0]).toBe(message);
      });
      messageRegistry.set({ linter: linter, buffer: null, messages: [message] });
      messageRegistry.update();
      expect(called).toBe(1);
    });
    it('notifies properly for as many linters as you want', function () {
      var buffer = {};
      var linterFirst = { name: 'any' };
      var linterSecond = {};
      var messageFirst = (0, _common.getMessageLegacy)();
      var messageSecond = (0, _common.getMessageLegacy)();
      var messageThird = (0, _common.getMessageLegacy)();
      var called = 0;

      messageRegistry.onDidUpdateMessages(function (_ref2) {
        var added = _ref2.added;
        var removed = _ref2.removed;
        var messages = _ref2.messages;

        called++;

        if (called === 1) {
          expect(added.length).toBe(1);
          expect(removed.length).toBe(0);
          expect(added).toEqual(messages);
          expect(added[0]).toEqual(messageFirst);
        } else if (called === 2) {
          expect(added.length).toBe(2);
          expect(removed.length).toBe(0);
          expect(messages.length).toBe(3);
          expect(messages[0]).toBe(messageFirst);
          expect(messages[1]).toBe(messageSecond);
          expect(messages[2]).toBe(messageThird);
        } else if (called === 3) {
          expect(added.length).toBe(0);
          expect(removed.length).toBe(1);
          expect(removed[0]).toBe(messageFirst);
          expect(messages.length).toBe(2);
          expect(messages[0]).toBe(messageSecond);
          expect(messages[1]).toBe(messageThird);
        } else if (called === 4) {
          expect(added.length).toBe(0);
          expect(removed.length).toBe(2);
          expect(messages.length).toBe(0);
          expect(removed[0]).toBe(messageSecond);
          expect(removed[1]).toBe(messageThird);
        } else {
          throw new Error('Unnecessary update call');
        }
      });

      messageRegistry.set({ buffer: buffer, linter: linterFirst, messages: [messageFirst] });
      messageRegistry.update();
      messageRegistry.update();
      messageRegistry.update();
      messageRegistry.update();
      expect(called).toBe(1);
      messageRegistry.set({ buffer: buffer, linter: linterSecond, messages: [messageSecond, messageThird] });
      messageRegistry.update();
      messageRegistry.update();
      messageRegistry.update();
      messageRegistry.update();
      expect(called).toBe(2);
      messageRegistry.set({ buffer: buffer, linter: linterFirst, messages: [] });
      messageRegistry.update();
      messageRegistry.update();
      messageRegistry.update();
      messageRegistry.update();
      expect(called).toBe(3);
      messageRegistry.set({ buffer: buffer, linter: linterSecond, messages: [] });
      messageRegistry.update();
      messageRegistry.update();
      messageRegistry.update();
      messageRegistry.update();
      expect(called).toBe(4);
    });

    it('sets key, severity on messages', function () {
      var linter = { name: 'any' };
      var buffer = {};
      var messageFirst = (0, _common.getMessageLegacy)();
      var messageSecond = (0, _common.getMessageLegacy)();
      var messageThird = (0, _common.getMessageLegacy)();

      var called = 0;

      messageRegistry.onDidUpdateMessages(function (_ref3) {
        var added = _ref3.added;
        var removed = _ref3.removed;
        var messages = _ref3.messages;

        called++;
        if (called === 1) {
          // All messages are new
          expect(added.length).toBe(2);
          expect(removed.length).toBe(0);
          expect(messages.length).toBe(2);
          expect(added).toEqual(messages);
          expect(typeof messages[0].key).toBe('string');
          expect(typeof messages[1].key).toBe('string');
          expect(typeof messages[0].severity).toBe('string');
          expect(typeof messages[1].severity).toBe('string');
        } else {
          // One removed, one added
          expect(added.length).toBe(1);
          expect(removed.length).toBe(1);
          expect(messages.length).toBe(2);
          expect(messages.indexOf(added[0])).not.toBe(-1);
          expect(typeof messages[0].key).toBe('string');
          expect(typeof messages[1].key).toBe('string');
          expect(typeof messages[0].severity).toBe('string');
          expect(typeof messages[1].severity).toBe('string');
        }
      });

      messageRegistry.set({ buffer: buffer, linter: linter, messages: [messageFirst, messageSecond] });
      messageRegistry.update();
      messageRegistry.set({ buffer: buffer, linter: linter, messages: [messageFirst, messageThird] });
      messageRegistry.update();
      expect(called).toBe(2);
    });

    it('checks if an old message has updated, if so invalidates it properly', function () {
      var called = 0;
      var messageFirst = (0, _common.getMessageLegacy)();
      var messageSecond = Object.assign({}, messageFirst);
      var linter = { name: 'any' };
      var buffer = {};

      messageRegistry.onDidUpdateMessages(function (_ref4) {
        var added = _ref4.added;
        var removed = _ref4.removed;
        var messages = _ref4.messages;

        called++;
        if (called === 1) {
          expect(messages.length).toBe(1);
          expect(removed.length).toBe(0);
          expect(added.length).toBe(1);
          expect(added[0]).toBe(messageFirst);
        } else {
          expect(messages.length).toBe(1);
          expect(removed.length).toBe(1);
          expect(added.length).toBe(1);
          expect(added[0]).toBe(messageSecond);
          expect(removed[0]).toBe(messageFirst);
        }
      });

      expect(called).toBe(0);
      messageRegistry.set({ buffer: buffer, linter: linter, messages: [messageFirst] });
      messageRegistry.update();
      messageRegistry.set({ buffer: buffer, linter: linter, messages: [messageSecond] });
      messageRegistry.update();
      expect(called).toBe(1);
      messageFirst.text = 'Hellow';
      messageRegistry.set({ buffer: buffer, linter: linter, messages: [messageSecond] });
      messageRegistry.update();
      expect(called).toBe(2);
    });

    it('sends the same object each time even in complicated scenarios', function () {
      var called = 0;
      var knownMessages = new Set();
      messageRegistry.onDidUpdateMessages(function (_ref5) {
        var added = _ref5.added;
        var removed = _ref5.removed;
        var messages = _ref5.messages;

        called++;
        for (var entry of added) {
          if (knownMessages.has(entry)) {
            throw new Error('Message already exists');
          } else knownMessages.add(entry);
        }
        for (var entry of removed) {
          if (knownMessages.has(entry)) {
            knownMessages['delete'](entry);
          } else throw new Error('Message does not exist');
        }
        if (messages.length !== knownMessages.size) {
          throw new Error('Size mismatch, registry is having hiccups');
        }
      });

      var linter = { name: 'any' };
      var buffer = {};
      var messageRealFirst = (0, _common.getMessageLegacy)();
      var messageDupeFirst = Object.assign({}, messageRealFirst);
      var messageRealSecond = (0, _common.getMessageLegacy)();
      var messageDupeSecond = Object.assign({}, messageRealSecond);

      expect(called).toBe(0);
      messageRegistry.set({ buffer: buffer, linter: linter, messages: [messageRealFirst, messageRealSecond] });
      messageRegistry.update();
      expect(called).toBe(1);
      expect(knownMessages.size).toBe(2);
      messageRegistry.update();
      expect(called).toBe(1);
      expect(knownMessages.size).toBe(2);
      messageRegistry.set({ buffer: buffer, linter: linter, messages: [messageRealFirst, messageRealSecond] });
      messageRegistry.update();
      expect(called).toBe(1);
      expect(knownMessages.size).toBe(2);
      messageRegistry.set({ buffer: buffer, linter: linter, messages: [messageDupeFirst, messageDupeSecond] });
      messageRegistry.update();
      expect(called).toBe(1);
      expect(knownMessages.size).toBe(2);
      messageRegistry.deleteByLinter(linter);
      messageRegistry.update();
      expect(called).toBe(2);
      expect(knownMessages.size).toBe(0);
    });
    it('notices changes on last messages instead of relying on their keys and invaildates them', function () {
      var called = 0;

      var linter = { name: 'any' };
      var buffer = {};
      var messageA = (0, _common.getMessageLegacy)();
      var messageB = Object.assign({}, messageA);
      var messageC = Object.assign({}, messageA);

      messageRegistry.onDidUpdateMessages(function (_ref6) {
        var added = _ref6.added;
        var removed = _ref6.removed;
        var messages = _ref6.messages;

        called++;
        if (called === 1) {
          expect(added.length).toBe(1);
          expect(removed.length).toBe(0);
          expect(messages.length).toBe(1);
          expect(added).toEqual(messages);
          expect(added[0]).toBe(messageA);
        } else if (called === 2) {
          expect(added.length).toBe(1);
          expect(removed.length).toBe(1);
          expect(messages.length).toBe(1);
          expect(added).toEqual(messages);
          expect(added[0]).toBe(messageB);
          expect(removed[0]).toBe(messageA);
        } else {
          throw new Error('Should not have been triggered');
        }
      });
      messageRegistry.set({ buffer: buffer, linter: linter, messages: [messageA] });
      messageRegistry.update();
      messageA.text = 'MURICAAA';
      messageRegistry.set({ buffer: buffer, linter: linter, messages: [messageB] });
      messageRegistry.update();
      messageRegistry.set({ buffer: buffer, linter: linter, messages: [messageC] });
      messageRegistry.update();
      expect(called).toBe(2);
    });
  });

  describe('::deleteByBuffer', function () {
    it('deletes the messages and sends them in an event', function () {
      var linter = { name: 'any' };
      var buffer = {};
      var messageFirst = (0, _common.getMessageLegacy)();
      var messageSecond = (0, _common.getMessageLegacy)();

      var called = 0;

      messageRegistry.onDidUpdateMessages(function (_ref7) {
        var added = _ref7.added;
        var removed = _ref7.removed;
        var messages = _ref7.messages;

        called++;
        if (called === 1) {
          expect(added.length).toBe(2);
          expect(removed.length).toBe(0);
          expect(messages.length).toBe(2);
          expect(added).toEqual(messages);
          expect(added[0]).toBe(messageFirst);
          expect(added[1]).toBe(messageSecond);
        } else if (called === 2) {
          expect(added.length).toBe(0);
          expect(removed.length).toBe(2);
          expect(messages.length).toBe(0);
          expect(removed[0]).toBe(messageFirst);
          expect(removed[1]).toBe(messageSecond);
        } else {
          throw new Error('Unnecessary update call');
        }
      });
      messageRegistry.set({ buffer: buffer, linter: linter, messages: [messageFirst, messageSecond] });
      messageRegistry.update();
      messageRegistry.update();
      messageRegistry.update();
      messageRegistry.update();
      expect(called).toBe(1);
      messageRegistry.deleteByBuffer(buffer);
      messageRegistry.update();
      messageRegistry.update();
      messageRegistry.update();
      messageRegistry.update();
      expect(called).toBe(2);
    });
  });

  describe('::deleteByLinter', function () {
    it('deletes the messages and sends them in an event', function () {
      var linter = { name: 'any' };
      var buffer = {};
      var messageFirst = (0, _common.getMessageLegacy)();
      var messageSecond = (0, _common.getMessageLegacy)();

      var called = 0;

      messageRegistry.onDidUpdateMessages(function (_ref8) {
        var added = _ref8.added;
        var removed = _ref8.removed;
        var messages = _ref8.messages;

        called++;
        if (called === 1) {
          expect(added.length).toBe(2);
          expect(removed.length).toBe(0);
          expect(messages.length).toBe(2);
          expect(added).toEqual(messages);
          expect(added[0]).toBe(messageFirst);
          expect(added[1]).toBe(messageSecond);
        } else if (called === 2) {
          expect(added.length).toBe(0);
          expect(removed.length).toBe(2);
          expect(messages.length).toBe(0);
          expect(removed[0]).toBe(messageFirst);
          expect(removed[1]).toBe(messageSecond);
        } else {
          throw new Error('Unnecessary update call');
        }
      });
      messageRegistry.set({ buffer: buffer, linter: linter, messages: [messageFirst, messageSecond] });
      messageRegistry.update();
      messageRegistry.update();
      messageRegistry.update();
      messageRegistry.update();
      expect(called).toBe(1);
      messageRegistry.deleteByLinter(linter);
      messageRegistry.update();
      messageRegistry.update();
      messageRegistry.update();
      messageRegistry.update();
      expect(called).toBe(2);
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvc3BlYy9tZXNzYWdlLXJlZ2lzdHJ5LXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7a0NBRTRCLHlCQUF5Qjs7OztzQkFDcEIsVUFBVTs7QUFFM0MsUUFBUSxDQUFDLGtCQUFrQixFQUFFLFlBQVc7QUFDdEMsTUFBSSxlQUFlLFlBQUEsQ0FBQTtBQUNuQixZQUFVLENBQUMsWUFBVztBQUNwQixtQkFBZSxHQUFHLHFDQUFxQixDQUFBO0FBQ3ZDLG1CQUFlLENBQUMsZUFBZSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsaUJBQWlCLENBQUMsQ0FBQTtHQUN2RSxDQUFDLENBQUE7QUFDRixXQUFTLENBQUMsWUFBVztBQUNuQixtQkFBZSxDQUFDLE9BQU8sRUFBRSxDQUFBO0dBQzFCLENBQUMsQ0FBQTs7QUFFRixVQUFRLENBQUMsT0FBTyxFQUFFLFlBQVc7QUFDM0IsTUFBRSxDQUFDLDZDQUE2QyxFQUFFLFlBQVc7QUFDM0QsVUFBTSxZQUFZLEdBQUcsK0JBQWtCLENBQUE7QUFDdkMsVUFBTSxhQUFhLEdBQUcsK0JBQWtCLENBQUE7QUFDeEMsVUFBTSxZQUFZLEdBQUcsK0JBQWtCLENBQUE7QUFDdkMsVUFBTSxNQUFjLEdBQUcsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUE7QUFDdEMsVUFBTSxNQUFjLEdBQUcsRUFBRSxDQUFBO0FBQ3pCLFVBQUksSUFBSSxZQUFBLENBQUE7O0FBRVIscUJBQWUsQ0FBQyxHQUFHLENBQUMsRUFBRSxNQUFNLEVBQU4sTUFBTSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxDQUFBO0FBQ3ZFLFlBQU0sQ0FBQyxlQUFlLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDNUQsWUFBTSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ2hELFVBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTs7QUFFakQsWUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDL0IsWUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDaEMsWUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDOUIsWUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ3ZDLFlBQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUNwQyxZQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQTs7QUFFM0MscUJBQWUsQ0FBQyxHQUFHLENBQUMsRUFBRSxNQUFNLEVBQU4sTUFBTSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxDQUFBO0FBQ3ZFLFlBQU0sQ0FBQyxlQUFlLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDNUQsWUFBTSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ2hELFVBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMs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QTtBQUM1QixnQkFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDOUIsZ0JBQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQy9CLGdCQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFBO0FBQ3RDLGdCQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFBO0FBQ3ZDLGdCQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFBO1NBQ3ZDLE1BQU0sSUFBSSxNQUFNLEtBQUssQ0FBQyxFQUFFO0FBQ3ZCLGdCQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUM1QixnQkFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDOUIsZ0JBQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUE7QUFDckMsZ0JBQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQy9CLGdCQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFBO0FBQ3ZDLGdCQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFBO1NBQ3ZDLE1BQU0sSUFBSSxNQUFNLEtBQUssQ0FBQyxFQUFFO0FBQ3ZCLGdCQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUM1QixnQkFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDOUIsZ0JBQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQy9CLGdCQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFBO0FBQ3RDLGdCQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFBO1NBQ3RDLE1BQU07QUFDTCxnQkFBTSxJQUFJLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxDQUFBO1NBQzNDO09BQ0YsQ0FBQyxDQUFBOztBQUVGLHFCQUFlLENBQUMsR0FBRyxDQUFDLEVBQUUsTUFBTSxFQUFOLE1BQU0sRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBRSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsQ0FBQTtBQUM5RSxxQkFBZSxDQUFDLE1BQU0sRUFBRSxDQUFBO0FBQ3hCLHFCQUFlLENBQUMsTUFBTSxFQUFFLENBQUE7QUFDeEIscUJBQWUsQ0FBQyxNQUFNLEVBQUUsQ0FBQTtBQUN4QixxQkFBZSxDQUFDLE1BQU0sRUFBRSxDQUFBO0FBQ3hCLFlBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDdEIscUJBQWUsQ0FBQyxHQUFHLENBQUMsRUFBRSxNQUFNLEVBQU4sTUFBTSxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFFLENBQUMsYUFBYSxFQUFFLFlBQVksQ0FBQyxFQUFFLENBQUMsQ0FBQTtBQUM5RixxQkFBZSxDQUFDLE1BQU0sRUFBRSxDQUFBO0FBQ3hCLHFCQUFlLENBQUMsTUFBTSxFQUFFLENBQUE7QUFDeEIscUJBQWUsQ0FBQyxNQUFNLEVBQUUsQ0FBQTtBQUN4QixxQkFBZSxDQUFDLE1BQU0sRUFBRSxDQUFBO0FBQ3hCLFlBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDdEIscUJBQWUsQ0FBQyxHQUFHLENBQUMsRUFBRSxNQUFNLEVBQU4sTUFBTSxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUE7QUFDbEUscUJBQWUsQ0FBQyxNQUFNLEVBQUUsQ0FBQTtBQUN4QixxQkFBZSxDQUFDLE1BQU0sRUFBRSxDQUFBO0FBQ3hCLHFCQUFlLENBQUMsTUFBTSxFQUFFLENBQUE7QUFDeEIscUJBQWUsQ0FBQyxNQUFNLEVBQUUsQ0FBQTtBQUN4QixZQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ3RCLHFCQUFlLENBQUMsR0FBRyxDQUFDLEVBQUUsTUFBTSxFQUFOLE1BQU0sRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFBO0FBQ25FLHFCQUFlLENBQUMsTUFBTSxFQUFFLENBQUE7QUFDeEIscUJBQWUsQ0FBQyxNQUFNLEVBQUUsQ0FBQTtBQUN4QixxQkFBZSxDQUFDLE1BQU0sRUFBRSxDQUFBO0FBQ3hCLHFCQUFlLENBQUMsTUFBTSxFQUFFLENBQUE7QUFDeEIsWUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtLQUN2QixDQUFDLENBQUE7O0FBRUYsTUFBRSxDQUFDLGdDQUFnQyxFQUFFLFlBQVc7QUFDOUMsVUFBTSxNQUFjLEdBQUcsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUE7QUFDdEMsVUFBTSxNQUFjLEdBQUcsRUFBRSxDQUFBO0FBQ3pCLFVBQU0sWUFBWSxHQUFHLCtCQUFrQixDQUFBO0FBQ3ZDLFVBQU0sYUFBYSxHQUFHLCtCQUFrQixDQUFBO0FBQ3hDLFVBQU0sWUFBWSxHQUFHLCtCQUFrQixDQUFBOztBQUV2QyxVQUFJLE1BQU0sR0FBRyxDQUFDLENBQUE7O0FBRWQscUJBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxVQUFTLEtBQTRCLEVBQUU7WUFBNUIsS0FBSyxHQUFQLEtBQTRCLENBQTFCLEtBQUs7WUFBRSxPQUFPLEdBQWhCLEtBQTRCLENBQW5CLE9BQU87WUFBRSxRQUFRLEdBQTFCLEtBQTRCLENBQVYsUUFBUTs7QUFDckUsY0FBTSxFQUFFLENBQUE7QUFDUixZQUFJLE1BQU0sS0FBSyxDQUFDLEVBQUU7O0FBRWhCLGdCQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUM1QixnQkFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDOUIsZ0JBQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQy9CLGdCQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQy9CLGdCQUFNLENBQUMsT0FBTyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQzdDLGdCQUFNLENBQUMsT0FBTyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQzdDLGdCQUFNLENBQUMsT0FBTyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQ2xELGdCQUFNLENBQUMsT0FBTyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFBO1NBQ25ELE1BQU07O0FBRUwsZ0JBQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQzVCLGdCQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUM5QixnQkFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDL0IsZ0JBQU0sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQy9DLGdCQUFNLENBQUMsT0FBTyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQzdDLGdCQUFNLENBQUMsT0FBTyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQzdDLGdCQUFNLENBQUMsT0FBTyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQ2xELGdCQUFNLENBQUMsT0FBTyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFBO1NBQ25EO09BQ0YsQ0FBQyxDQUFBOztBQUVGLHFCQUFlLENBQUMsR0FBRyxDQUFDLEVBQUUsTUFBTSxFQUFOLE1BQU0sRUFBRSxNQUFNLEVBQU4sTUFBTSxFQUFFLFFBQVEsRUFBRSxDQUFDLFlBQVksRUFBRSxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUE7QUFDaEYscUJBQWUsQ0FBQyxNQUFNLEVBQUUsQ0FBQTtBQUN4QixxQkFBZSxDQUFDLEdBQUcsQ0FBQyxFQUFFLE1BQU0sRUFBTixNQUFNLEVBQUUsTUFBTSxFQUFOLE1BQU0sRUFBRSxRQUFRLEVBQUUsQ0FBQyxZQUFZLEVBQUUsWUFBWSxDQUFDLEVBQUUsQ0FBQyxDQUFBO0FBQy9FLHFCQUFlLENBQUMsTUFBTSxFQUFFLENBQUE7QUFDeEIsWUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtLQUN2QixDQUFDLENBQUE7O0FBRUYsTUFBRSxDQUFDLHFFQUFxRSxFQUFFLFlBQVc7QUFDbkYsVUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFBO0FBQ2QsVUFBTSxZQUFZLEdBQUcsK0JBQWtCLENBQUE7QUFDdkMsVUFBTSxhQUFhLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsWUFBWSxDQUFDLENBQUE7QUFDckQsVUFBTSxNQUFjLEdBQUcsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUE7QUFDdEMsVUFBTSxNQUFjLEdBQUcsRUFBRSxDQUFBOztBQUV6QixxQkFBZSxDQUFDLG1CQUFtQixDQUFDLFVBQVMsS0FBNEIsRUFBRTtZQUE1QixLQUFLLEdBQVAsS0FBNEIsQ0FBMUIsS0FBSztZQUFFLE9BQU8sR0FBaEIsS0FBNEIsQ0FBbkIsT0FBTztZQUFFLFFBQVEsR0FBMUIsS0FBNEIsQ0FBVixRQUFROztBQUNyRSxjQUFNLEVBQUUsQ0FBQTtBQUNSLFlBQUksTUFBTSxLQUFLLENBQUMsRUFBRTtBQUNoQixnQkFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDL0IsZ0JBQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQzlCLGdCQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUM1QixnQkFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQTtTQUNwQyxNQUFNO0FBQ0wsZ0JBQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQy9CLGdCQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUM5QixnQkFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDNUIsZ0JBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUE7QUFDcEMsZ0JBQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUE7U0FDdEM7T0FDRixDQUFDLENBQUE7O0FBRUYsWUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUN0QixxQkFBZSxDQUFDLEdBQUcsQ0FBQyxFQUFFLE1BQU0sRUFBTixNQUFNLEVBQUUsTUFBTSxFQUFOLE1BQU0sRUFBRSxRQUFRLEVBQUUsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLENBQUE7QUFDakUscUJBQWUsQ0FBQyxNQUFNLEVBQUUsQ0FBQTtBQUN4QixxQkFBZSxDQUFDLEdBQUcsQ0FBQyxFQUFFLE1BQU0sRUFBTixNQUFNLEVBQUUsTUFBTSxFQUFOLE1BQU0sRUFBRSxRQUFRLEVBQUUsQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUE7QUFDbEUscUJBQWUsQ0FBQyxNQUFNLEVBQUUsQ0FBQTtBQUN4QixZQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ3RCLGtCQUFZLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQTtBQUM1QixxQkFBZSxDQUFDLEdBQUcsQ0FBQyxFQUFFLE1BQU0sRUFBTixNQUFNLEVBQUUsTUFBTSxFQUFOLE1BQU0sRUFBRSxRQUFRLEVBQUUsQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUE7QUFDbEUscUJBQWUsQ0FBQyxNQUFNLEVBQUUsQ0FBQTtBQUN4QixZQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0tBQ3ZCLENBQUMsQ0FBQTs7QUFFRixNQUFFLENBQUMsK0RBQStELEVBQUUsWUFBVztBQUM3RSxVQUFJLE1BQU0sR0FBRyxDQUFDLENBQUE7QUFDZCxVQUFNLGFBQWEsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBO0FBQy9CLHFCQUFlLENBQUMsbUJBQW1CLENBQUMsVUFBUyxLQUE0QixFQUFFO1lBQTVCLEtBQUssR0FBUCxLQUE0QixDQUExQixLQUFLO1lBQUUsT0FBTyxHQUFoQixLQUE0QixDQUFuQixPQUFPO1lBQUUsUUFBUSxHQUExQixLQUE0QixDQUFWLFFBQVE7O0FBQ3JFLGNBQU0sRUFBRSxDQUFBO0FBQ1IsYUFBSyxJQUFNLEtBQUssSUFBSSxLQUFLLEVBQUU7QUFDekIsY0FBSSxhQUFhLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFO0FBQzVCLGtCQUFNLElBQUksS0FBSyxDQUFDLHdCQUF3QixDQUFDLENBQUE7V0FDMUMsTUFBTSxhQUFhLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFBO1NBQ2hDO0FBQ0QsYUFBSyxJQUFNLEtBQUssSUFBSSxPQUFPLEVBQUU7QUFDM0IsY0FBSSxhQUFhLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFO0FBQzVCLHlCQUFhLFVBQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQTtXQUM1QixNQUFNLE1BQU0sSUFBSSxLQUFLLENBQUMsd0JBQXdCLENBQUMsQ0FBQTtTQUNqRDtBQUNELFlBQUksUUFBUSxDQUFDLE1BQU0sS0FBSyxhQUFhLENBQUMsSUFBSSxFQUFFO0FBQzFDLGdCQUFNLElBQUksS0FBSyxDQUFDLDJDQUEyQyxDQUFDLENBQUE7U0FDN0Q7T0FDRixDQUFDLENBQUE7O0FBRUYsVUFBTSxNQUFjLEdBQUcsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUE7QUFDdEMsVUFBTSxNQUFjLEdBQUcsRUFBRSxDQUFBO0FBQ3pCLFVBQU0sZ0JBQWdCLEdBQUcsK0JBQWtCLENBQUE7QUFDM0MsVUFBTSxnQkFBZ0IsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFBO0FBQzVELFVBQU0saUJBQWlCLEdBQUcsK0JBQWtCLENBQUE7QUFDNUMsVUFBTSxpQkFBaUIsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxpQkFBaUIsQ0FBQyxDQUFBOztBQUU5RCxZQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ3RCLHFCQUFlLENBQUMsR0FBRyxDQUFDLEVBQUUsTUFBTSxFQUFOLE1BQU0sRUFBRSxNQUFNLEVBQU4sTUFBTSxFQUFFLFFBQVEsRUFBRSxDQUFDLGdCQUFnQixFQUFFLGlCQUFpQixDQUFDLEVBQUUsQ0FBQyxDQUFBO0FBQ3hGLHFCQUFlLENBQUMsTUFBTSxFQUFFLENBQUE7QUFDeEIsWUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUN0QixZQUFNLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUNsQyxxQkFBZSxDQUFDLE1BQU0sRUFBRSxDQUFBO0FBQ3hCLFlBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDdEIsWUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDbEMscUJBQWUsQ0FBQyxHQUFHLENBQUMsRUFBRSxNQUFNLEVBQU4sTUFBTSxFQUFFLE1BQU0sRUFBTixNQUFNLEVBQUUsUUFBUSxFQUFFLENBQUMsZ0JBQWdCLEVBQUUsaUJBQWlCLENBQUMsRUFBRSxDQUFDLENBQUE7QUFDeEYscUJBQWUsQ0FBQyxNQUFNLEVBQUUsQ0FBQTtBQUN4QixZQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ3RCLFlBQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ2xDLHFCQUFlLENBQUMsR0FBRyxDQUFDLEVBQUUsTUFBTSxFQUFOLE1BQU0sRUFBRSxNQUFNLEVBQU4sTUFBTSxFQUFFLFFBQVEsRUFBRSxDQUFDLGdCQUFnQixFQUFFLGlCQUFpQixDQUFDLEVBQUUsQ0FBQyxDQUFBO0FBQ3hGLHFCQUFlLENBQUMsTUFBTSxFQUFFLENBQUE7QUFDeEIsWUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUN0QixZQUFNLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUNsQyxxQkFBZSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUN0QyxxQkFBZSxDQUFDLE1BQU0sRUFBRSxDQUFBO0FBQ3hCLFlBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDdEIsWUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7S0FDbkMsQ0FBQyxDQUFBO0FBQ0YsTUFBRSxDQUFDLHdGQUF3RixFQUFFLFlBQVc7QUFDdEcsVUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFBOztBQUVkLFVBQU0sTUFBYyxHQUFHLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxDQUFBO0FBQ3RDLFVBQU0sTUFBYyxHQUFHLEVBQUUsQ0FBQTtBQUN6QixVQUFNLFFBQVEsR0FBRywrQkFBa0IsQ0FBQTtBQUNuQyxVQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQTtBQUM1QyxVQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQTs7QUFFNUMscUJBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxVQUFTLEtBQTRCLEVBQUU7WUFBNUIsS0FBSyxHQUFQLEtBQTRCLENBQTFCLEtBQUs7WUFBRSxPQUFPLEdBQWhCLEtBQTRCLENBQW5CLE9BQU87WUFBRSxRQUFRLEdBQTFCLEtBQTRCLENBQVYsUUFBUTs7QUFDckUsY0FBTSxFQUFFLENBQUE7QUFDUixZQUFJLE1BQU0sS0FBSyxDQUFDLEVBQUU7QUFDaEIsZ0JBQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQzVCLGdCQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUM5QixnQkFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDL0IsZ0JBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUE7QUFDL0IsZ0JBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7U0FDaEMsTUFBTSxJQUFJLE1BQU0sS0FBSyxDQUFDLEVBQUU7QUFDdkIsZ0JBQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQzVCLGdCQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUM5QixnQkFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDL0IsZ0JBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUE7QUFDL0IsZ0JBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7QUFDL0IsZ0JBQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7U0FDbEMsTUFBTTtBQUNMLGdCQUFNLElBQUksS0FBSyxDQUFDLGdDQUFnQyxDQUFDLENBQUE7U0FDbEQ7T0FDRixDQUFDLENBQUE7QUFDRixxQkFBZSxDQUFDLEdBQUcsQ0FBQyxFQUFFLE1BQU0sRUFBTixNQUFNLEVBQUUsTUFBTSxFQUFOLE1BQU0sRUFBRSxRQUFRLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUE7QUFDN0QscUJBQWUsQ0FBQyxNQUFNLEVBQUUsQ0FBQTtBQUN4QixjQUFRLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQTtBQUMxQixxQkFBZSxDQUFDLEdBQUcsQ0FBQyxFQUFFLE1BQU0sRUFBTixNQUFNLEVBQUUsTUFBTSxFQUFOLE1BQU0sRUFBRSxRQUFRLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUE7QUFDN0QscUJBQWUsQ0FBQyxNQUFNLEVBQUUsQ0FBQTtBQUN4QixxQkFBZSxDQUFDLEdBQUcsQ0FBQyxFQUFFLE1BQU0sRUFBTixNQUFNLEVBQUUsTUFBTSxFQUFOLE1BQU0sRUFBRSxRQUFRLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUE7QUFDN0QscUJBQWUsQ0FBQyxNQUFNLEVBQUUsQ0FBQTtBQUN4QixZQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0tBQ3ZCLENBQUMsQ0FBQTtHQUNILENBQUMsQ0FBQTs7QUFFRixVQUFRLENBQUMsa0JBQWtCLEVBQUUsWUFBVztBQUN0QyxNQUFFLENBQUMsaURBQWlELEVBQUUsWUFBVztBQUMvRCxVQUFNLE1BQWMsR0FBRyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQTtBQUN0QyxVQUFNLE1BQWMsR0FBRyxFQUFFLENBQUE7QUFDekIsVUFBTSxZQUFZLEdBQUcsK0JBQWtCLENBQUE7QUFDdkMsVUFBTSxhQUFhLEdBQUcsK0JBQWtCLENBQUE7O0FBRXhDLFVBQUksTUFBTSxHQUFHLENBQUMsQ0FBQTs7QUFFZCxxQkFBZSxDQUFDLG1CQUFtQixDQUFDLFVBQVMsS0FBNEIsRUFBRTtZQUE1QixLQUFLLEdBQVAsS0FBNEIsQ0FBMUIsS0FBSztZQUFFLE9BQU8sR0FBaEIsS0FBNEIsQ0FBbkIsT0FBTztZQUFFLFFBQVEsR0FBMUIsS0FBNEIsQ0FBVixRQUFROztBQUNyRSxjQUFNLEVBQUUsQ0FBQTtBQUNSLFlBQUksTUFBTSxLQUFLLENBQUMsRUFBRTtBQUNoQixnQkFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDNUIsZ0JBQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQzlCLGdCQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUMvQixnQkFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUMvQixnQkFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQTtBQUNuQyxnQkFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQTtTQUNyQyxNQUFNLElBQUksTUFBTSxLQUFLLENBQUMsRUFBRTtBQUN2QixnQkFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDNUIsZ0JBQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQzlCLGdCQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUMvQixnQkFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQTtBQUNyQyxnQkFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQTtTQUN2QyxNQUFNO0FBQ0wsZ0JBQU0sSUFBSSxLQUFLLENBQUMseUJBQXlCLENBQUMsQ0FBQTtTQUMzQztPQUNGLENBQUMsQ0FBQTtBQUNGLHFCQUFlLENBQUMsR0FBRyxDQUFDLEVBQUUsTUFBTSxFQUFOLE1BQU0sRUFBRSxNQUFNLEVBQU4sTUFBTSxFQUFFLFFBQVEsRUFBRSxDQUFDLFlBQVksRUFBRSxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUE7QUFDaEYscUJBQWUsQ0FBQyxNQUFNLEVBQUUsQ0FBQTtBQUN4QixxQkFBZSxDQUFDLE1BQU0sRUFBRSxDQUFBO0FBQ3hCLHFCQUFlLENBQUMsTUFBTSxFQUFFLENBQUE7QUFDeEIscUJBQWUsQ0FBQyxNQUFNLEVBQUUsQ0FBQTtBQUN4QixZQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ3RCLHFCQUFlLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBQ3RDLHFCQUFlLENBQUMsTUFBTSxFQUFFLENBQUE7QUFDeEIscUJBQWUsQ0FBQyxNQUFNLEVBQUUsQ0FBQTtBQUN4QixxQkFBZSxDQUFDLE1BQU0sRUFBRSxDQUFBO0FBQ3hCLHFCQUFlLENBQUMsTUFBTSxFQUFFLENBQUE7QUFDeEIsWUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtLQUN2QixDQUFDLENBQUE7R0FDSCxDQUFDLENBQUE7O0FBRUYsVUFBUSxDQUFDLGtCQUFrQixFQUFFLFlBQVc7QUFDdEMsTUFBRSxDQUFDLGlEQUFpRCxFQUFFLFlBQVc7QUFDL0QsVUFBTSxNQUFjLEdBQUcsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUE7QUFDdEMsVUFBTSxNQUFjLEdBQUcsRUFBRSxDQUFBO0FBQ3pCLFVBQU0sWUFBWSxHQUFHLCtCQUFrQixDQUFBO0FBQ3ZDLFVBQU0sYUFBYSxHQUFHLCtCQUFrQixDQUFBOztBQUV4QyxVQUFJLE1BQU0sR0FBRyxDQUFDLENBQUE7O0FBRWQscUJBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxVQUFTLEtBQTRCLEVBQUU7WUFBNUIsS0FBSyxHQUFQLEtBQTRCLENBQTFCLEtBQUs7WUFBRSxPQUFPLEdBQWhCLEtBQTRCLENBQW5CLE9BQU87WUFBRSxRQUFRLEdBQTFCLEtBQTRCLENBQVYsUUFBUTs7QUFDckUsY0FBTSxFQUFFLENBQUE7QUFDUixZQUFJLE1BQU0sS0FBSyxDQUFDLEVBQUU7QUFDaEIsZ0JBQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQzVCLGdCQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUM5QixnQkFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDL0IsZ0JBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUE7QUFDL0IsZ0JBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUE7QUFDbkMsZ0JBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUE7U0FDckMsTUFBTSxJQUFJLE1BQU0sS0FBSyxDQUFDLEVBQUU7QUFDdkIsZ0JBQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQzVCLGdCQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUM5QixnQkFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDL0IsZ0JBQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUE7QUFDckMsZ0JBQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUE7U0FDdkMsTUFBTTtBQUNMLGdCQUFNLElBQUksS0FBSyxDQUFDLHlCQUF5QixDQUFDLENBQUE7U0FDM0M7T0FDRixDQUFDLENBQUE7QUFDRixxQkFBZSxDQUFDLEdBQUcsQ0FBQyxFQUFFLE1BQU0sRUFBTixNQUFNLEVBQUUsTUFBTSxFQUFOLE1BQU0sRUFBRSxRQUFRLEVBQUUsQ0FBQyxZQUFZLEVBQUUsYUFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFBO0FBQ2hGLHFCQUFlLENBQUMsTUFBTSxFQUFFLENBQUE7QUFDeEIscUJBQWUsQ0FBQyxNQUFNLEVBQUUsQ0FBQTtBQUN4QixxQkFBZSxDQUFDLE1BQU0sRUFBRSxDQUFBO0FBQ3hCLHFCQUFlLENBQUMsTUFBTSxFQUFFLENBQUE7QUFDeEIsWUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUN0QixxQkFBZSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUN0QyxxQkFBZSxDQUFDLE1BQU0sRUFBRSxDQUFBO0FBQ3hCLHFCQUFlLENBQUMsTUFBTSxFQUFFLENBQUE7QUFDeEIscUJBQWUsQ0FBQyxNQUFNLEVBQUUsQ0FBQTtBQUN4QixxQkFBZSxDQUFDLE1BQU0sRUFBRSxDQUFBO0FBQ3hCLFlBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7S0FDdkIsQ0FBQyxDQUFBO0dBQ0gsQ0FBQyxDQUFBO0NBQ0gsQ0FBQyxDQUFBIiwiZmlsZSI6Ii9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvc3BlYy9tZXNzYWdlLXJlZ2lzdHJ5LXNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgTWVzc2FnZVJlZ2lzdHJ5IGZyb20gJy4uL2xpYi9tZXNzYWdlLXJlZ2lzdHJ5J1xuaW1wb3J0IHsgZ2V0TWVzc2FnZUxlZ2FjeSB9IGZyb20gJy4vY29tbW9uJ1xuXG5kZXNjcmliZSgnTWVzc2FnZSBSZWdpc3RyeScsIGZ1bmN0aW9uKCkge1xuICBsZXQgbWVzc2FnZVJlZ2lzdHJ5XG4gIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XG4gICAgbWVzc2FnZVJlZ2lzdHJ5ID0gbmV3IE1lc3NhZ2VSZWdpc3RyeSgpXG4gICAgbWVzc2FnZVJlZ2lzdHJ5LmRlYm91bmNlZFVwZGF0ZSA9IGphc21pbmUuY3JlYXRlU3B5KCdkZWJvdW5jZWRVcGRhdGUnKVxuICB9KVxuICBhZnRlckVhY2goZnVuY3Rpb24oKSB7XG4gICAgbWVzc2FnZVJlZ2lzdHJ5LmRpc3Bvc2UoKVxuICB9KVxuXG4gIGRlc2NyaWJlKCc6OnNldCcsIGZ1bmN0aW9uKCkge1xuICAgIGl0KCdzdG9yZXMgcmVzdWx0cyB1c2luZyBib3RoIGJ1ZmZlciBhbmQgbGludGVyJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBtZXNzYWdlRmlyc3QgPSBnZXRNZXNzYWdlTGVnYWN5KClcbiAgICAgIGNvbnN0IG1lc3NhZ2VTZWNvbmQgPSBnZXRNZXNzYWdlTGVnYWN5KClcbiAgICAgIGNvbnN0IG1lc3NhZ2VUaGlyZCA9IGdldE1lc3NhZ2VMZWdhY3koKVxuICAgICAgY29uc3QgbGludGVyOiBPYmplY3QgPSB7IG5hbWU6ICdhbnknIH1cbiAgICAgIGNvbnN0IGJ1ZmZlcjogT2JqZWN0ID0ge31cbiAgICAgIGxldCBpbmZvXG5cbiAgICAgIG1lc3NhZ2VSZWdpc3RyeS5zZXQoeyBsaW50ZXIsIGJ1ZmZlcjogbnVsbCwgbWVzc2FnZXM6IFttZXNzYWdlRmlyc3RdIH0pXG4gICAgICBleHBlY3QobWVzc2FnZVJlZ2lzdHJ5LmRlYm91bmNlZFVwZGF0ZS5jYWxscy5sZW5ndGgpLnRvQmUoMSlcbiAgICAgIGV4cGVjdChtZXNzYWdlUmVnaXN0cnkubWVzc2FnZXNNYXAuc2l6ZSkudG9CZSgxKVxuICAgICAgaW5mbyA9IEFycmF5LmZyb20obWVzc2FnZVJlZ2lzdHJ5Lm1lc3NhZ2VzTWFwKVswXVxuXG4gICAgICBleHBlY3QoaW5mby5jaGFuZ2VkKS50b0JlKHRydWUpXG4gICAgICBleHBlY3QoaW5mby5saW50ZXIpLnRvQmUobGludGVyKVxuICAgICAgZXhwZWN0KGluZm8uYnVmZmVyKS50b0JlKG51bGwpXG4gICAgICBleHBlY3QoaW5mby5vbGRNZXNzYWdlcy5sZW5ndGgpLnRvQmUoMClcbiAgICAgIGV4cGVjdChpbmZvLm1lc3NhZ2VzLmxlbmd0aCkudG9CZSgxKVxuICAgICAgZXhwZWN0KGluZm8ubWVzc2FnZXNbMF0pLnRvQmUobWVzc2FnZUZpcnN0KVxuXG4gICAgICBtZXNzYWdlUmVnaXN0cnkuc2V0KHsgbGludGVyLCBidWZmZXI6IG51bGwsIG1lc3NhZ2VzOiBbbWVzc2FnZUZpcnN0XSB9KVxuICAgICAgZXhwZWN0KG1lc3NhZ2VSZWdpc3RyeS5kZWJvdW5jZWRVcGRhdGUuY2FsbHMubGVuZ3RoKS50b0JlKDIpXG4gICAgICBleHBlY3QobWVzc2FnZVJlZ2lzdHJ5Lm1lc3NhZ2VzTWFwLnNpemUpLnRvQmUoMSlcbiAgICAgIGluZm8gPSBBcnJheS5mcm9tKG1lc3NhZ2VSZWdpc3RyeS5tZXNzYWdlc01hcClbMF1cblxuICAgICAgZXhwZWN0KGluZm8uY2hhbmdlZCkudG9CZSh0cnVlKVxuICAgICAgZXhwZWN0KGluZm8ubGludGVyKS50b0JlKGxpbnRlcilcbiAgICAgIGV4cGVjdChpbmZvLmJ1ZmZlcikudG9CZShudWxsKVxuICAgICAgZXhwZWN0KGluZm8ubWVzc2FnZXMubGVuZ3RoKS50b0JlKDEpXG4gICAgICBleHBlY3QoaW5mby5tZXNzYWdlc1swXSkudG9CZShtZXNzYWdlRmlyc3QpXG5cbiAgICAgIG1lc3NhZ2VSZWdpc3RyeS5zZXQoeyBsaW50ZXIsIGJ1ZmZlciwgbWVzc2FnZXM6IFttZXNzYWdlVGhpcmRdIH0pXG4gICAgICBleHBlY3QobWVzc2FnZVJlZ2lzdHJ5LmRlYm91bmNlZFVwZGF0ZS5jYWxscy5sZW5ndGgpLnRvQmUoMylcbiAgICAgIGV4cGVjdChtZXNzYWdlUmVnaXN0cnkubWVzc2FnZXNNYXAuc2l6ZSkudG9CZSgyKVxuICAgICAgaW5mbyA9IEFycmF5LmZyb20obWVzc2FnZVJlZ2lzdHJ5Lm1lc3NhZ2VzTWFwKVswXVxuXG4gICAgICBleHBlY3QoaW5mby5jaGFuZ2VkKS50b0JlKHRydWUpXG4gICAgICBleHBlY3QoaW5mby5saW50ZXIpLnRvQmUobGludGVyKVxuICAgICAgZXhwZWN0KGluZm8uYnVmZmVyKS50b0JlKG51bGwpXG4gICAgICBleHBlY3QoaW5mby5tZXNzYWdlcy5sZW5ndGgpLnRvQmUoMSlcbiAgICAgIGV4cGVjdChpbmZvLm1lc3NhZ2VzWzBdKS50b0JlKG1lc3NhZ2VGaXJzdClcblxuICAgICAgaW5mbyA9IEFycmF5LmZyb20obWVzc2FnZVJlZ2lzdHJ5Lm1lc3NhZ2VzTWFwKVsxXVxuXG4gICAgICBleHBlY3QoaW5mby5jaGFuZ2VkKS50b0JlKHRydWUpXG4gICAgICBleHBlY3QoaW5mby5saW50ZXIpLnRvQmUobGludGVyKVxuICAgICAgZXhwZWN0KGluZm8uYnVmZmVyKS50b0JlKGJ1ZmZlcilcbiAgICAgIGV4cGVjdChpbmZvLm1lc3NhZ2VzLmxlbmd0aCkudG9CZSgxKVxuICAgICAgZXhwZWN0KGluZm8ubWVzc2FnZXNbMF0pLnRvQmUobWVzc2FnZVRoaXJkKVxuXG4gICAgICBtZXNzYWdlUmVnaXN0cnkuc2V0KHsgbGludGVyLCBidWZmZXI6IG51bGwsIG1lc3NhZ2VzOiBbbWVzc2FnZUZpcnN0LCBtZXNzYWdlU2Vjb25kXSB9KVxuICAgICAgZXhwZWN0KG1lc3NhZ2VSZWdpc3RyeS5kZWJvdW5jZWRVcGRhdGUuY2FsbHMubGVuZ3RoKS50b0JlKDQpXG4gICAgICBleHBlY3QobWVzc2FnZVJlZ2lzdHJ5Lm1lc3NhZ2VzTWFwLnNpemUpLnRvQmUoMilcbiAgICAgIGluZm8gPSBBcnJheS5mcm9tKG1lc3NhZ2VSZWdpc3RyeS5tZXNzYWdlc01hcClbMF1cblxuICAgICAgZXhwZWN0KGluZm8uY2hhbmdlZCkudG9CZSh0cnVlKVxuICAgICAgZXhwZWN0KGluZm8ubGludGVyKS50b0JlKGxpbnRlcilcbiAgICAgIGV4cGVjdChpbmZvLmJ1ZmZlcikudG9CZShudWxsKVxuICAgICAgZXhwZWN0KGluZm8ubWVzc2FnZXMubGVuZ3RoKS50b0JlKDIpXG4gICAgICBleHBlY3QoaW5mby5tZXNzYWdlc1swXSkudG9CZShtZXNzYWdlRmlyc3QpXG4gICAgICBleHBlY3QoaW5mby5tZXNzYWdlc1sxXSkudG9CZShtZXNzYWdlU2Vjb25kKVxuXG4gICAgICBpbmZvID0gQXJyYXkuZnJvbShtZXNzYWdlUmVnaXN0cnkubWVzc2FnZXNNYXApWzFdXG5cbiAgICAgIGV4cGVjdChpbmZvLmNoYW5nZWQpLnRvQmUodHJ1ZSlcbiAgICAgIGV4cGVjdChpbmZvLmxpbnRlcikudG9CZShsaW50ZXIpXG4gICAgICBleHBlY3QoaW5mby5idWZmZXIpLnRvQmUoYnVmZmVyKVxuICAgICAgZXhwZWN0KGluZm8ubWVzc2FnZXMubGVuZ3RoKS50b0JlKDEpXG4gICAgICBleHBlY3QoaW5mby5tZXNzYWdlc1swXSkudG9CZShtZXNzYWdlVGhpcmQpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgndXBkYXRlcyAoOjp1cGRhdGUgJiA6Om9uRGlkVXBkYXRlTWVzc2FnZXMpJywgZnVuY3Rpb24oKSB7XG4gICAgaXQoJ25vdGlmaWVzIG9uIGNoYW5nZXMnLCBmdW5jdGlvbigpIHtcbiAgICAgIGxldCBjYWxsZWQgPSAwXG4gICAgICBjb25zdCBsaW50ZXI6IE9iamVjdCA9IHsgbmFtZTogJ2FueScgfVxuICAgICAgY29uc3QgbWVzc2FnZSA9IGdldE1lc3NhZ2VMZWdhY3koKVxuICAgICAgbWVzc2FnZVJlZ2lzdHJ5Lm9uRGlkVXBkYXRlTWVzc2FnZXMoZnVuY3Rpb24oeyBhZGRlZCwgcmVtb3ZlZCwgbWVzc2FnZXMgfSkge1xuICAgICAgICBjYWxsZWQrK1xuICAgICAgICBleHBlY3QoYWRkZWQubGVuZ3RoKS50b0JlKDEpXG4gICAgICAgIGV4cGVjdChyZW1vdmVkLmxlbmd0aCkudG9CZSgwKVxuICAgICAgICBleHBlY3QobWVzc2FnZXMubGVuZ3RoKS50b0JlKDEpXG4gICAgICAgIGV4cGVjdChhZGRlZCkudG9FcXVhbChtZXNzYWdlcylcbiAgICAgICAgZXhwZWN0KGFkZGVkWzBdKS50b0JlKG1lc3NhZ2UpXG4gICAgICB9KVxuICAgICAgbWVzc2FnZVJlZ2lzdHJ5LnNldCh7IGxpbnRlciwgYnVmZmVyOiBudWxsLCBtZXNzYWdlczogW21lc3NhZ2VdIH0pXG4gICAgICBtZXNzYWdlUmVnaXN0cnkudXBkYXRlKClcbiAgICAgIGV4cGVjdChjYWxsZWQpLnRvQmUoMSlcbiAgICB9KVxuICAgIGl0KCdub3RpZmllcyBwcm9wZXJseSBmb3IgYXMgbWFueSBsaW50ZXJzIGFzIHlvdSB3YW50JywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBidWZmZXI6IE9iamVjdCA9IHt9XG4gICAgICBjb25zdCBsaW50ZXJGaXJzdDogT2JqZWN0ID0geyBuYW1lOiAnYW55JyB9XG4gICAgICBjb25zdCBsaW50ZXJTZWNvbmQ6IE9iamVjdCA9IHt9XG4gICAgICBjb25zdCBtZXNzYWdlRmlyc3QgPSBnZXRNZXNzYWdlTGVnYWN5KClcbiAgICAgIGNvbnN0IG1lc3NhZ2VTZWNvbmQgPSBnZXRNZXNzYWdlTGVnYWN5KClcbiAgICAgIGNvbnN0IG1lc3NhZ2VUaGlyZCA9IGdldE1lc3NhZ2VMZWdhY3koKVxuICAgICAgbGV0IGNhbGxlZCA9IDBcblxuICAgICAgbWVzc2FnZVJlZ2lzdHJ5Lm9uRGlkVXBkYXRlTWVzc2FnZXMoZnVuY3Rpb24oeyBhZGRlZCwgcmVtb3ZlZCwgbWVzc2FnZXMgfSkge1xuICAgICAgICBjYWxsZWQrK1xuXG4gICAgICAgIGlmIChjYWxsZWQgPT09IDEpIHtcbiAgICAgICAgICBleHBlY3QoYWRkZWQubGVuZ3RoKS50b0JlKDEpXG4gICAgICAgICAgZXhwZWN0KHJlbW92ZWQubGVuZ3RoKS50b0JlKDApXG4gICAgICAgICAgZXhwZWN0KGFkZGVkKS50b0VxdWFsKG1lc3NhZ2VzKVxuICAgICAgICAgIGV4cGVjdChhZGRlZFswXSkudG9FcXVhbChtZXNzYWdlRmlyc3QpXG4gICAgICAgIH0gZWxzZSBpZiAoY2FsbGVkID09PSAyKSB7XG4gICAgICAgICAgZXhwZWN0KGFkZGVkLmxlbmd0aCkudG9CZSgyKVxuICAgICAgICAgIGV4cGVjdChyZW1vdmVkLmxlbmd0aCkudG9CZSgwKVxuICAgICAgICAgIGV4cGVjdChtZXNzYWdlcy5sZW5ndGgpLnRvQmUoMylcbiAgICAgICAgICBleHBlY3QobWVzc2FnZXNbMF0pLnRvQmUobWVzc2FnZUZpcnN0KVxuICAgICAgICAgIGV4cGVjdChtZXNzYWdlc1sxXSkudG9CZShtZXNzYWdlU2Vjb25kKVxuICAgICAgICAgIGV4cGVjdChtZXNzYWdlc1syXSkudG9CZShtZXNzYWdlVGhpcmQpXG4gICAgICAgIH0gZWxzZSBpZiAoY2FsbGVkID09PSAzKSB7XG4gICAgICAgICAgZXhwZWN0KGFkZGVkLmxlbmd0aCkudG9CZSgwKVxuICAgICAgICAgIGV4cGVjdChyZW1vdmVkLmxlbmd0aCkudG9CZSgxKVxuICAgICAgICAgIGV4cGVjdChyZW1vdmVkWzBdKS50b0JlKG1lc3NhZ2VGaXJzdClcbiAgICAgICAgICBleHBlY3QobWVzc2FnZXMubGVuZ3RoKS50b0JlKDIpXG4gICAgICAgICAgZXhwZWN0KG1lc3NhZ2VzWzBdKS50b0JlKG1lc3NhZ2VTZWNvbmQpXG4gICAgICAgICAgZXhwZWN0KG1lc3NhZ2VzWzFdKS50b0JlKG1lc3NhZ2VUaGlyZClcbiAgICAgICAgfSBlbHNlIGlmIChjYWxsZWQgPT09IDQpIHtcbiAgICAgICAgICBleHBlY3QoYWRkZWQubGVuZ3RoKS50b0JlKDApXG4gICAgICAgICAgZXhwZWN0KHJlbW92ZWQubGVuZ3RoKS50b0JlKDIpXG4gICAgICAgICAgZXhwZWN0KG1lc3NhZ2VzLmxlbmd0aCkudG9CZSgwKVxuICAgICAgICAgIGV4cGVjdChyZW1vdmVkWzBdKS50b0JlKG1lc3NhZ2VTZWNvbmQpXG4gICAgICAgICAgZXhwZWN0KHJlbW92ZWRbMV0pLnRvQmUobWVzc2FnZVRoaXJkKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVW5uZWNlc3NhcnkgdXBkYXRlIGNhbGwnKVxuICAgICAgICB9XG4gICAgICB9KVxuXG4gICAgICBtZXNzYWdlUmVnaXN0cnkuc2V0KHsgYnVmZmVyLCBsaW50ZXI6IGxpbnRlckZpcnN0LCBtZXNzYWdlczogW21lc3NhZ2VGaXJzdF0gfSlcbiAgICAgIG1lc3NhZ2VSZWdpc3RyeS51cGRhdGUoKVxuICAgICAgbWVzc2FnZVJlZ2lzdHJ5LnVwZGF0ZSgpXG4gICAgICBtZXNzYWdlUmVnaXN0cnkudXBkYXRlKClcbiAgICAgIG1lc3NhZ2VSZWdpc3RyeS51cGRhdGUoKVxuICAgICAgZXhwZWN0KGNhbGxlZCkudG9CZSgxKVxuICAgICAgbWVzc2FnZVJlZ2lzdHJ5LnNldCh7IGJ1ZmZlciwgbGludGVyOiBsaW50ZXJTZWNvbmQsIG1lc3NhZ2VzOiBbbWVzc2FnZVNlY29uZCwgbWVzc2FnZVRoaXJkXSB9KVxuICAgICAgbWVzc2FnZVJlZ2lzdHJ5LnVwZGF0ZSgpXG4gICAgICBtZXNzYWdlUmVnaXN0cnkudXBkYXRlKClcbiAgICAgIG1lc3NhZ2VSZWdpc3RyeS51cGRhdGUoKVxuICAgICAgbWVzc2FnZVJlZ2lzdHJ5LnVwZGF0ZSgpXG4gICAgICBleHBlY3QoY2FsbGVkKS50b0JlKDIpXG4gICAgICBtZXNzYWdlUmVnaXN0cnkuc2V0KHsgYnVmZmVyLCBsaW50ZXI6IGxpbnRlckZpcnN0LCBtZXNzYWdlczogW10gfSlcbiAgICAgIG1lc3NhZ2VSZWdpc3RyeS51cGRhdGUoKVxuICAgICAgbWVzc2FnZVJlZ2lzdHJ5LnVwZGF0ZSgpXG4gICAgICBtZXNzYWdlUmVnaXN0cnkudXBkYXRlKClcbiAgICAgIG1lc3NhZ2VSZWdpc3RyeS51cGRhdGUoKVxuICAgICAgZXhwZWN0KGNhbGxlZCkudG9CZSgzKVxuICAgICAgbWVzc2FnZVJlZ2lzdHJ5LnNldCh7IGJ1ZmZlciwgbGludGVyOiBsaW50ZXJTZWNvbmQsIG1lc3NhZ2VzOiBbXSB9KVxuICAgICAgbWVzc2FnZVJlZ2lzdHJ5LnVwZGF0ZSgpXG4gICAgICBtZXNzYWdlUmVnaXN0cnkudXBkYXRlKClcbiAgICAgIG1lc3NhZ2VSZWdpc3RyeS51cGRhdGUoKVxuICAgICAgbWVzc2FnZVJlZ2lzdHJ5LnVwZGF0ZSgpXG4gICAgICBleHBlY3QoY2FsbGVkKS50b0JlKDQpXG4gICAgfSlcblxuICAgIGl0KCdzZXRzIGtleSwgc2V2ZXJpdHkgb24gbWVzc2FnZXMnLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IGxpbnRlcjogT2JqZWN0ID0geyBuYW1lOiAnYW55JyB9XG4gICAgICBjb25zdCBidWZmZXI6IE9iamVjdCA9IHt9XG4gICAgICBjb25zdCBtZXNzYWdlRmlyc3QgPSBnZXRNZXNzYWdlTGVnYWN5KClcbiAgICAgIGNvbnN0IG1lc3NhZ2VTZWNvbmQgPSBnZXRNZXNzYWdlTGVnYWN5KClcbiAgICAgIGNvbnN0IG1lc3NhZ2VUaGlyZCA9IGdldE1lc3NhZ2VMZWdhY3koKVxuXG4gICAgICBsZXQgY2FsbGVkID0gMFxuXG4gICAgICBtZXNzYWdlUmVnaXN0cnkub25EaWRVcGRhdGVNZXNzYWdlcyhmdW5jdGlvbih7IGFkZGVkLCByZW1vdmVkLCBtZXNzYWdlcyB9KSB7XG4gICAgICAgIGNhbGxlZCsrXG4gICAgICAgIGlmIChjYWxsZWQgPT09IDEpIHtcbiAgICAgICAgICAvLyBBbGwgbWVzc2FnZXMgYXJlIG5ld1xuICAgICAgICAgIGV4cGVjdChhZGRlZC5sZW5ndGgpLnRvQmUoMilcbiAgICAgICAgICBleHBlY3QocmVtb3ZlZC5sZW5ndGgpLnRvQmUoMClcbiAgICAgICAgICBleHBlY3QobWVzc2FnZXMubGVuZ3RoKS50b0JlKDIpXG4gICAgICAgICAgZXhwZWN0KGFkZGVkKS50b0VxdWFsKG1lc3NhZ2VzKVxuICAgICAgICAgIGV4cGVjdCh0eXBlb2YgbWVzc2FnZXNbMF0ua2V5KS50b0JlKCdzdHJpbmcnKVxuICAgICAgICAgIGV4cGVjdCh0eXBlb2YgbWVzc2FnZXNbMV0ua2V5KS50b0JlKCdzdHJpbmcnKVxuICAgICAgICAgIGV4cGVjdCh0eXBlb2YgbWVzc2FnZXNbMF0uc2V2ZXJpdHkpLnRvQmUoJ3N0cmluZycpXG4gICAgICAgICAgZXhwZWN0KHR5cGVvZiBtZXNzYWdlc1sxXS5zZXZlcml0eSkudG9CZSgnc3RyaW5nJylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBPbmUgcmVtb3ZlZCwgb25lIGFkZGVkXG4gICAgICAgICAgZXhwZWN0KGFkZGVkLmxlbmd0aCkudG9CZSgxKVxuICAgICAgICAgIGV4cGVjdChyZW1vdmVkLmxlbmd0aCkudG9CZSgxKVxuICAgICAgICAgIGV4cGVjdChtZXNzYWdlcy5sZW5ndGgpLnRvQmUoMilcbiAgICAgICAgICBleHBlY3QobWVzc2FnZXMuaW5kZXhPZihhZGRlZFswXSkpLm5vdC50b0JlKC0xKVxuICAgICAgICAgIGV4cGVjdCh0eXBlb2YgbWVzc2FnZXNbMF0ua2V5KS50b0JlKCdzdHJpbmcnKVxuICAgICAgICAgIGV4cGVjdCh0eXBlb2YgbWVzc2FnZXNbMV0ua2V5KS50b0JlKCdzdHJpbmcnKVxuICAgICAgICAgIGV4cGVjdCh0eXBlb2YgbWVzc2FnZXNbMF0uc2V2ZXJpdHkpLnRvQmUoJ3N0cmluZycpXG4gICAgICAgICAgZXhwZWN0KHR5cGVvZiBtZXNzYWdlc1sxXS5zZXZlcml0eSkudG9CZSgnc3RyaW5nJylcbiAgICAgICAgfVxuICAgICAgfSlcblxuICAgICAgbWVzc2FnZVJlZ2lzdHJ5LnNldCh7IGJ1ZmZlciwgbGludGVyLCBtZXNzYWdlczogW21lc3NhZ2VGaXJzdCwgbWVzc2FnZVNlY29uZF0gfSlcbiAgICAgIG1lc3NhZ2VSZWdpc3RyeS51cGRhdGUoKVxuICAgICAgbWVzc2FnZVJlZ2lzdHJ5LnNldCh7IGJ1ZmZlciwgbGludGVyLCBtZXNzYWdlczogW21lc3NhZ2VGaXJzdCwgbWVzc2FnZVRoaXJkXSB9KVxuICAgICAgbWVzc2FnZVJlZ2lzdHJ5LnVwZGF0ZSgpXG4gICAgICBleHBlY3QoY2FsbGVkKS50b0JlKDIpXG4gICAgfSlcblxuICAgIGl0KCdjaGVja3MgaWYgYW4gb2xkIG1lc3NhZ2UgaGFzIHVwZGF0ZWQsIGlmIHNvIGludmFsaWRhdGVzIGl0IHByb3Blcmx5JywgZnVuY3Rpb24oKSB7XG4gICAgICBsZXQgY2FsbGVkID0gMFxuICAgICAgY29uc3QgbWVzc2FnZUZpcnN0ID0gZ2V0TWVzc2FnZUxlZ2FjeSgpXG4gICAgICBjb25zdCBtZXNzYWdlU2Vjb25kID0gT2JqZWN0LmFzc2lnbih7fSwgbWVzc2FnZUZpcnN0KVxuICAgICAgY29uc3QgbGludGVyOiBPYmplY3QgPSB7IG5hbWU6ICdhbnknIH1cbiAgICAgIGNvbnN0IGJ1ZmZlcjogT2JqZWN0ID0ge31cblxuICAgICAgbWVzc2FnZVJlZ2lzdHJ5Lm9uRGlkVXBkYXRlTWVzc2FnZXMoZnVuY3Rpb24oeyBhZGRlZCwgcmVtb3ZlZCwgbWVzc2FnZXMgfSkge1xuICAgICAgICBjYWxsZWQrK1xuICAgICAgICBpZiAoY2FsbGVkID09PSAxKSB7XG4gICAgICAgICAgZXhwZWN0KG1lc3NhZ2VzLmxlbmd0aCkudG9CZSgxKVxuICAgICAgICAgIGV4cGVjdChyZW1vdmVkLmxlbmd0aCkudG9CZSgwKVxuICAgICAgICAgIGV4cGVjdChhZGRlZC5sZW5ndGgpLnRvQmUoMSlcbiAgICAgICAgICBleHBlY3QoYWRkZWRbMF0pLnRvQmUobWVzc2FnZUZpcnN0KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGV4cGVjdChtZXNzYWdlcy5sZW5ndGgpLnRvQmUoMSlcbiAgICAgICAgICBleHBlY3QocmVtb3ZlZC5sZW5ndGgpLnRvQmUoMSlcbiAgICAgICAgICBleHBlY3QoYWRkZWQubGVuZ3RoKS50b0JlKDEpXG4gICAgICAgICAgZXhwZWN0KGFkZGVkWzBdKS50b0JlKG1lc3NhZ2VTZWNvbmQpXG4gICAgICAgICAgZXhwZWN0KHJlbW92ZWRbMF0pLnRvQmUobWVzc2FnZUZpcnN0KVxuICAgICAgICB9XG4gICAgICB9KVxuXG4gICAgICBleHBlY3QoY2FsbGVkKS50b0JlKDApXG4gICAgICBtZXNzYWdlUmVnaXN0cnkuc2V0KHsgYnVmZmVyLCBsaW50ZXIsIG1lc3NhZ2VzOiBbbWVzc2FnZUZpcnN0XSB9KVxuICAgICAgbWVzc2FnZVJlZ2lzdHJ5LnVwZGF0ZSgpXG4gICAgICBtZXNzYWdlUmVnaXN0cnkuc2V0KHsgYnVmZmVyLCBsaW50ZXIsIG1lc3NhZ2VzOiBbbWVzc2FnZVNlY29uZF0gfSlcbiAgICAgIG1lc3NhZ2VSZWdpc3RyeS51cGRhdGUoKVxuICAgICAgZXhwZWN0KGNhbGxlZCkudG9CZSgxKVxuICAgICAgbWVzc2FnZUZpcnN0LnRleHQgPSAnSGVsbG93J1xuICAgICAgbWVzc2FnZVJlZ2lzdHJ5LnNldCh7IGJ1ZmZlciwgbGludGVyLCBtZXNzYWdlczogW21lc3NhZ2VTZWNvbmRdIH0pXG4gICAgICBtZXNzYWdlUmVnaXN0cnkudXBkYXRlKClcbiAgICAgIGV4cGVjdChjYWxsZWQpLnRvQmUoMilcbiAgICB9KVxuXG4gICAgaXQoJ3NlbmRzIHRoZSBzYW1lIG9iamVjdCBlYWNoIHRpbWUgZXZlbiBpbiBjb21wbGljYXRlZCBzY2VuYXJpb3MnLCBmdW5jdGlvbigpIHtcbiAgICAgIGxldCBjYWxsZWQgPSAwXG4gICAgICBjb25zdCBrbm93bk1lc3NhZ2VzID0gbmV3IFNldCgpXG4gICAgICBtZXNzYWdlUmVnaXN0cnkub25EaWRVcGRhdGVNZXNzYWdlcyhmdW5jdGlvbih7IGFkZGVkLCByZW1vdmVkLCBtZXNzYWdlcyB9KSB7XG4gICAgICAgIGNhbGxlZCsrXG4gICAgICAgIGZvciAoY29uc3QgZW50cnkgb2YgYWRkZWQpIHtcbiAgICAgICAgICBpZiAoa25vd25NZXNzYWdlcy5oYXMoZW50cnkpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ01lc3NhZ2UgYWxyZWFkeSBleGlzdHMnKVxuICAgICAgICAgIH0gZWxzZSBrbm93bk1lc3NhZ2VzLmFkZChlbnRyeSlcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IGVudHJ5IG9mIHJlbW92ZWQpIHtcbiAgICAgICAgICBpZiAoa25vd25NZXNzYWdlcy5oYXMoZW50cnkpKSB7XG4gICAgICAgICAgICBrbm93bk1lc3NhZ2VzLmRlbGV0ZShlbnRyeSlcbiAgICAgICAgICB9IGVsc2UgdGhyb3cgbmV3IEVycm9yKCdNZXNzYWdlIGRvZXMgbm90IGV4aXN0JylcbiAgICAgICAgfVxuICAgICAgICBpZiAobWVzc2FnZXMubGVuZ3RoICE9PSBrbm93bk1lc3NhZ2VzLnNpemUpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NpemUgbWlzbWF0Y2gsIHJlZ2lzdHJ5IGlzIGhhdmluZyBoaWNjdXBzJylcbiAgICAgICAgfVxuICAgICAgfSlcblxuICAgICAgY29uc3QgbGludGVyOiBPYmplY3QgPSB7IG5hbWU6ICdhbnknIH1cbiAgICAgIGNvbnN0IGJ1ZmZlcjogT2JqZWN0ID0ge31cbiAgICAgIGNvbnN0IG1lc3NhZ2VSZWFsRmlyc3QgPSBnZXRNZXNzYWdlTGVnYWN5KClcbiAgICAgIGNvbnN0IG1lc3NhZ2VEdXBlRmlyc3QgPSBPYmplY3QuYXNzaWduKHt9LCBtZXNzYWdlUmVhbEZpcnN0KVxuICAgICAgY29uc3QgbWVzc2FnZVJlYWxTZWNvbmQgPSBnZXRNZXNzYWdlTGVnYWN5KClcbiAgICAgIGNvbnN0IG1lc3NhZ2VEdXBlU2Vjb25kID0gT2JqZWN0LmFzc2lnbih7fSwgbWVzc2FnZVJlYWxTZWNvbmQpXG5cbiAgICAgIGV4cGVjdChjYWxsZWQpLnRvQmUoMClcbiAgICAgIG1lc3NhZ2VSZWdpc3RyeS5zZXQoeyBidWZmZXIsIGxpbnRlciwgbWVzc2FnZXM6IFttZXNzYWdlUmVhbEZpcnN0LCBtZXNzYWdlUmVhbFNlY29uZF0gfSlcbiAgICAgIG1lc3NhZ2VSZWdpc3RyeS51cGRhdGUoKVxuICAgICAgZXhwZWN0KGNhbGxlZCkudG9CZSgxKVxuICAgICAgZXhwZWN0KGtub3duTWVzc2FnZXMuc2l6ZSkudG9CZSgyKVxuICAgICAgbWVzc2FnZVJlZ2lzdHJ5LnVwZGF0ZSgpXG4gICAgICBleHBlY3QoY2FsbGVkKS50b0JlKDEpXG4gICAgICBleHBlY3Qoa25vd25NZXNzYWdlcy5zaXplKS50b0JlKDIpXG4gICAgICBtZXNzYWdlUmVnaXN0cnkuc2V0KHsgYnVmZmVyLCBsaW50ZXIsIG1lc3NhZ2VzOiBbbWVzc2FnZVJlYWxGaXJzdCwgbWVzc2FnZVJlYWxTZWNvbmRdIH0pXG4gICAgICBtZXNzYWdlUmVnaXN0cnkudXBkYXRlKClcbiAgICAgIGV4cGVjdChjYWxsZWQpLnRvQmUoMSlcbiAgICAgIGV4cGVjdChrbm93bk1lc3NhZ2VzLnNpemUpLnRvQmUoMilcbiAgICAgIG1lc3NhZ2VSZWdpc3RyeS5zZXQoeyBidWZmZXIsIGxpbnRlciwgbWVzc2FnZXM6IFttZXNzYWdlRHVwZUZpcnN0LCBtZXNzYWdlRHVwZVNlY29uZF0gfSlcbiAgICAgIG1lc3NhZ2VSZWdpc3RyeS51cGRhdGUoKVxuICAgICAgZXhwZWN0KGNhbGxlZCkudG9CZSgxKVxuICAgICAgZXhwZWN0KGtub3duTWVzc2FnZXMuc2l6ZSkudG9CZSgyKVxuICAgICAgbWVzc2FnZVJlZ2lzdHJ5LmRlbGV0ZUJ5TGludGVyKGxpbnRlcilcbiAgICAgIG1lc3NhZ2VSZWdpc3RyeS51cGRhdGUoKVxuICAgICAgZXhwZWN0KGNhbGxlZCkudG9CZSgyKVxuICAgICAgZXhwZWN0KGtub3duTWVzc2FnZXMuc2l6ZSkudG9CZSgwKVxuICAgIH0pXG4gICAgaXQoJ25vdGljZXMgY2hhbmdlcyBvbiBsYXN0IG1lc3NhZ2VzIGluc3RlYWQgb2YgcmVseWluZyBvbiB0aGVpciBrZXlzIGFuZCBpbnZhaWxkYXRlcyB0aGVtJywgZnVuY3Rpb24oKSB7XG4gICAgICBsZXQgY2FsbGVkID0gMFxuXG4gICAgICBjb25zdCBsaW50ZXI6IE9iamVjdCA9IHsgbmFtZTogJ2FueScgfVxuICAgICAgY29uc3QgYnVmZmVyOiBPYmplY3QgPSB7fVxuICAgICAgY29uc3QgbWVzc2FnZUEgPSBnZXRNZXNzYWdlTGVnYWN5KClcbiAgICAgIGNvbnN0IG1lc3NhZ2VCID0gT2JqZWN0LmFzc2lnbih7fSwgbWVzc2FnZUEpXG4gICAgICBjb25zdCBtZXNzYWdlQyA9IE9iamVjdC5hc3NpZ24oe30sIG1lc3NhZ2VBKVxuXG4gICAgICBtZXNzYWdlUmVnaXN0cnkub25EaWRVcGRhdGVNZXNzYWdlcyhmdW5jdGlvbih7IGFkZGVkLCByZW1vdmVkLCBtZXNzYWdlcyB9KSB7XG4gICAgICAgIGNhbGxlZCsrXG4gICAgICAgIGlmIChjYWxsZWQgPT09IDEpIHtcbiAgICAgICAgICBleHBlY3QoYWRkZWQubGVuZ3RoKS50b0JlKDEpXG4gICAgICAgICAgZXhwZWN0KHJlbW92ZWQubGVuZ3RoKS50b0JlKDApXG4gICAgICAgICAgZXhwZWN0KG1lc3NhZ2VzLmxlbmd0aCkudG9CZSgxKVxuICAgICAgICAgIGV4cGVjdChhZGRlZCkudG9FcXVhbChtZXNzYWdlcylcbiAgICAgICAgICBleHBlY3QoYWRkZWRbMF0pLnRvQmUobWVzc2FnZUEpXG4gICAgICAgIH0gZWxzZSBpZiAoY2FsbGVkID09PSAyKSB7XG4gICAgICAgICAgZXhwZWN0KGFkZGVkLmxlbmd0aCkudG9CZSgxKVxuICAgICAgICAgIGV4cGVjdChyZW1vdmVkLmxlbmd0aCkudG9CZSgxKVxuICAgICAgICAgIGV4cGVjdChtZXNzYWdlcy5sZW5ndGgpLnRvQmUoMSlcbiAgICAgICAgICBleHBlY3QoYWRkZWQpLnRvRXF1YWwobWVzc2FnZXMpXG4gICAgICAgICAgZXhwZWN0KGFkZGVkWzBdKS50b0JlKG1lc3NhZ2VCKVxuICAgICAgICAgIGV4cGVjdChyZW1vdmVkWzBdKS50b0JlKG1lc3NhZ2VBKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignU2hvdWxkIG5vdCBoYXZlIGJlZW4gdHJpZ2dlcmVkJylcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIG1lc3NhZ2VSZWdpc3RyeS5zZXQoeyBidWZmZXIsIGxpbnRlciwgbWVzc2FnZXM6IFttZXNzYWdlQV0gfSlcbiAgICAgIG1lc3NhZ2VSZWdpc3RyeS51cGRhdGUoKVxuICAgICAgbWVzc2FnZUEudGV4dCA9ICdNVVJJQ0FBQSdcbiAgICAgIG1lc3NhZ2VSZWdpc3RyeS5zZXQoeyBidWZmZXIsIGxpbnRlciwgbWVzc2FnZXM6IFttZXNzYWdlQl0gfSlcbiAgICAgIG1lc3NhZ2VSZWdpc3RyeS51cGRhdGUoKVxuICAgICAgbWVzc2FnZVJlZ2lzdHJ5LnNldCh7IGJ1ZmZlciwgbGludGVyLCBtZXNzYWdlczogW21lc3NhZ2VDXSB9KVxuICAgICAgbWVzc2FnZVJlZ2lzdHJ5LnVwZGF0ZSgpXG4gICAgICBleHBlY3QoY2FsbGVkKS50b0JlKDIpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnOjpkZWxldGVCeUJ1ZmZlcicsIGZ1bmN0aW9uKCkge1xuICAgIGl0KCdkZWxldGVzIHRoZSBtZXNzYWdlcyBhbmQgc2VuZHMgdGhlbSBpbiBhbiBldmVudCcsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbGludGVyOiBPYmplY3QgPSB7IG5hbWU6ICdhbnknIH1cbiAgICAgIGNvbnN0IGJ1ZmZlcjogT2JqZWN0ID0ge31cbiAgICAgIGNvbnN0IG1lc3NhZ2VGaXJzdCA9IGdldE1lc3NhZ2VMZWdhY3koKVxuICAgICAgY29uc3QgbWVzc2FnZVNlY29uZCA9IGdldE1lc3NhZ2VMZWdhY3koKVxuXG4gICAgICBsZXQgY2FsbGVkID0gMFxuXG4gICAgICBtZXNzYWdlUmVnaXN0cnkub25EaWRVcGRhdGVNZXNzYWdlcyhmdW5jdGlvbih7IGFkZGVkLCByZW1vdmVkLCBtZXNzYWdlcyB9KSB7XG4gICAgICAgIGNhbGxlZCsrXG4gICAgICAgIGlmIChjYWxsZWQgPT09IDEpIHtcbiAgICAgICAgICBleHBlY3QoYWRkZWQubGVuZ3RoKS50b0JlKDIpXG4gICAgICAgICAgZXhwZWN0KHJlbW92ZWQubGVuZ3RoKS50b0JlKDApXG4gICAgICAgICAgZXhwZWN0KG1lc3NhZ2VzLmxlbmd0aCkudG9CZSgyKVxuICAgICAgICAgIGV4cGVjdChhZGRlZCkudG9FcXVhbChtZXNzYWdlcylcbiAgICAgICAgICBleHBlY3QoYWRkZWRbMF0pLnRvQmUobWVzc2FnZUZpcnN0KVxuICAgICAgICAgIGV4cGVjdChhZGRlZFsxXSkudG9CZShtZXNzYWdlU2Vjb25kKVxuICAgICAgICB9IGVsc2UgaWYgKGNhbGxlZCA9PT0gMikge1xuICAgICAgICAgIGV4cGVjdChhZGRlZC5sZW5ndGgpLnRvQmUoMClcbiAgICAgICAgICBleHBlY3QocmVtb3ZlZC5sZW5ndGgpLnRvQmUoMilcbiAgICAgICAgICBleHBlY3QobWVzc2FnZXMubGVuZ3RoKS50b0JlKDApXG4gICAgICAgICAgZXhwZWN0KHJlbW92ZWRbMF0pLnRvQmUobWVzc2FnZUZpcnN0KVxuICAgICAgICAgIGV4cGVjdChyZW1vdmVkWzFdKS50b0JlKG1lc3NhZ2VTZWNvbmQpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbm5lY2Vzc2FyeSB1cGRhdGUgY2FsbCcpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICBtZXNzYWdlUmVnaXN0cnkuc2V0KHsgYnVmZmVyLCBsaW50ZXIsIG1lc3NhZ2VzOiBbbWVzc2FnZUZpcnN0LCBtZXNzYWdlU2Vjb25kXSB9KVxuICAgICAgbWVzc2FnZVJlZ2lzdHJ5LnVwZGF0ZSgpXG4gICAgICBtZXNzYWdlUmVnaXN0cnkudXBkYXRlKClcbiAgICAgIG1lc3NhZ2VSZWdpc3RyeS51cGRhdGUoKVxuICAgICAgbWVzc2FnZVJlZ2lzdHJ5LnVwZGF0ZSgpXG4gICAgICBleHBlY3QoY2FsbGVkKS50b0JlKDEpXG4gICAgICBtZXNzYWdlUmVnaXN0cnkuZGVsZXRlQnlCdWZmZXIoYnVmZmVyKVxuICAgICAgbWVzc2FnZVJlZ2lzdHJ5LnVwZGF0ZSgpXG4gICAgICBtZXNzYWdlUmVnaXN0cnkudXBkYXRlKClcbiAgICAgIG1lc3NhZ2VSZWdpc3RyeS51cGRhdGUoKVxuICAgICAgbWVzc2FnZVJlZ2lzdHJ5LnVwZGF0ZSgpXG4gICAgICBleHBlY3QoY2FsbGVkKS50b0JlKDIpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnOjpkZWxldGVCeUxpbnRlcicsIGZ1bmN0aW9uKCkge1xuICAgIGl0KCdkZWxldGVzIHRoZSBtZXNzYWdlcyBhbmQgc2VuZHMgdGhlbSBpbiBhbiBldmVudCcsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbGludGVyOiBPYmplY3QgPSB7IG5hbWU6ICdhbnknIH1cbiAgICAgIGNvbnN0IGJ1ZmZlcjogT2JqZWN0ID0ge31cbiAgICAgIGNvbnN0IG1lc3NhZ2VGaXJzdCA9IGdldE1lc3NhZ2VMZWdhY3koKVxuICAgICAgY29uc3QgbWVzc2FnZVNlY29uZCA9IGdldE1lc3NhZ2VMZWdhY3koKVxuXG4gICAgICBsZXQgY2FsbGVkID0gMFxuXG4gICAgICBtZXNzYWdlUmVnaXN0cnkub25EaWRVcGRhdGVNZXNzYWdlcyhmdW5jdGlvbih7IGFkZGVkLCByZW1vdmVkLCBtZXNzYWdlcyB9KSB7XG4gICAgICAgIGNhbGxlZCsrXG4gICAgICAgIGlmIChjYWxsZWQgPT09IDEpIHtcbiAgICAgICAgICBleHBlY3QoYWRkZWQubGVuZ3RoKS50b0JlKDIpXG4gICAgICAgICAgZXhwZWN0KHJlbW92ZWQubGVuZ3RoKS50b0JlKDApXG4gICAgICAgICAgZXhwZWN0KG1lc3NhZ2VzLmxlbmd0aCkudG9CZSgyKVxuICAgICAgICAgIGV4cGVjdChhZGRlZCkudG9FcXVhbChtZXNzYWdlcylcbiAgICAgICAgICBleHBlY3QoYWRkZWRbMF0pLnRvQmUobWVzc2FnZUZpcnN0KVxuICAgICAgICAgIGV4cGVjdChhZGRlZFsxXSkudG9CZShtZXNzYWdlU2Vjb25kKVxuICAgICAgICB9IGVsc2UgaWYgKGNhbGxlZCA9PT0gMikge1xuICAgICAgICAgIGV4cGVjdChhZGRlZC5sZW5ndGgpLnRvQmUoMClcbiAgICAgICAgICBleHBlY3QocmVtb3ZlZC5sZW5ndGgpLnRvQmUoMilcbiAgICAgICAgICBleHBlY3QobWVzc2FnZXMubGVuZ3RoKS50b0JlKDApXG4gICAgICAgICAgZXhwZWN0KHJlbW92ZWRbMF0pLnRvQmUobWVzc2FnZUZpcnN0KVxuICAgICAgICAgIGV4cGVjdChyZW1vdmVkWzFdKS50b0JlKG1lc3NhZ2VTZWNvbmQpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbm5lY2Vzc2FyeSB1cGRhdGUgY2FsbCcpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICBtZXNzYWdlUmVnaXN0cnkuc2V0KHsgYnVmZmVyLCBsaW50ZXIsIG1lc3NhZ2VzOiBbbWVzc2FnZUZpcnN0LCBtZXNzYWdlU2Vjb25kXSB9KVxuICAgICAgbWVzc2FnZVJlZ2lzdHJ5LnVwZGF0ZSgpXG4gICAgICBtZXNzYWdlUmVnaXN0cnkudXBkYXRlKClcbiAgICAgIG1lc3NhZ2VSZWdpc3RyeS51cGRhdGUoKVxuICAgICAgbWVzc2FnZVJlZ2lzdHJ5LnVwZGF0ZSgpXG4gICAgICBleHBlY3QoY2FsbGVkKS50b0JlKDEpXG4gICAgICBtZXNzYWdlUmVnaXN0cnkuZGVsZXRlQnlMaW50ZXIobGludGVyKVxuICAgICAgbWVzc2FnZVJlZ2lzdHJ5LnVwZGF0ZSgpXG4gICAgICBtZXNzYWdlUmVnaXN0cnkudXBkYXRlKClcbiAgICAgIG1lc3NhZ2VSZWdpc3RyeS51cGRhdGUoKVxuICAgICAgbWVzc2FnZVJlZ2lzdHJ5LnVwZGF0ZSgpXG4gICAgICBleHBlY3QoY2FsbGVkKS50b0JlKDIpXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=