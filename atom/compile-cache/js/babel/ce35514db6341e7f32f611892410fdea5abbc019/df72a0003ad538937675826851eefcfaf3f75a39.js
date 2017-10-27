function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _libValidate = require('../lib/validate');

var Validate = _interopRequireWildcard(_libValidate);

describe('Validate', function () {
  function expectNotification(message) {
    var notifications = atom.notifications.getNotifications();
    expect(notifications.length).toBe(1);
    var issues = notifications[0].options.detail.split('\n');
    issues.shift();
    expect(issues[0]).toBe('  • ' + message);
    atom.notifications.clear();
  }

  describe('::ui', function () {
    function validateUI(ui, expectedValue) {
      var message = arguments.length <= 2 || arguments[2] === undefined ? '' : arguments[2];

      expect(Validate.ui(ui)).toBe(expectedValue);
      if (!expectedValue) {
        expectNotification(message);
      }
    }

    it('cries if param is not an object', function () {
      validateUI(undefined, false, 'UI must be an object');
      validateUI(null, false, 'UI must be an object');
      validateUI(2, false, 'UI must be an object');
      validateUI(NaN, false, 'UI must be an object');
    });
    it('cries if ui.name is not a string', function () {
      validateUI({
        name: NaN
      }, false, 'UI.name must be a string');
      validateUI({
        name: null
      }, false, 'UI.name must be a string');
      validateUI({
        name: 2
      }, false, 'UI.name must be a string');
    });
    it('cries if ui.didBeginLinting is not a function', function () {
      validateUI({
        name: 'Some',
        didBeginLinting: null
      }, false, 'UI.didBeginLinting must be a function');
      validateUI({
        name: 'Some',
        didBeginLinting: {}
      }, false, 'UI.didBeginLinting must be a function');
      validateUI({
        name: 'Some',
        didBeginLinting: NaN
      }, false, 'UI.didBeginLinting must be a function');
      validateUI({
        name: 'Some',
        didBeginLinting: 5
      }, false, 'UI.didBeginLinting must be a function');
    });
    it('cries if ui.didFinishLinting is not a function', function () {
      validateUI({
        name: 'Some',
        didBeginLinting: function didBeginLinting() {},
        didFinishLinting: null
      }, false, 'UI.didFinishLinting must be a function');
      validateUI({
        name: 'Some',
        didBeginLinting: function didBeginLinting() {},
        didFinishLinting: {}
      }, false, 'UI.didFinishLinting must be a function');
      validateUI({
        name: 'Some',
        didBeginLinting: function didBeginLinting() {},
        didFinishLinting: NaN
      }, false, 'UI.didFinishLinting must be a function');
      validateUI({
        name: 'Some',
        didBeginLinting: function didBeginLinting() {},
        didFinishLinting: 5
      }, false, 'UI.didFinishLinting must be a function');
    });
    it('cries if ui.render is not a function', function () {
      validateUI({
        name: 'Some',
        didBeginLinting: function didBeginLinting() {},
        didFinishLinting: function didFinishLinting() {},
        render: null
      }, false, 'UI.render must be a function');
      validateUI({
        name: 'Some',
        didBeginLinting: function didBeginLinting() {},
        didFinishLinting: function didFinishLinting() {},
        render: {}
      }, false, 'UI.render must be a function');
      validateUI({
        name: 'Some',
        didBeginLinting: function didBeginLinting() {},
        didFinishLinting: function didFinishLinting() {},
        render: NaN
      }, false, 'UI.render must be a function');
      validateUI({
        name: 'Some',
        didBeginLinting: function didBeginLinting() {},
        didFinishLinting: function didFinishLinting() {},
        render: 5
      }, false, 'UI.render must be a function');
    });
    it('cries if ui.dispose is not a function', function () {
      validateUI({
        name: 'Some',
        didBeginLinting: function didBeginLinting() {},
        didFinishLinting: function didFinishLinting() {},
        render: function render() {},
        dispose: null
      }, false, 'UI.dispose must be a function');
      validateUI({
        name: 'Some',
        didBeginLinting: function didBeginLinting() {},
        didFinishLinting: function didFinishLinting() {},
        render: function render() {},
        dispose: {}
      }, false, 'UI.dispose must be a function');
      validateUI({
        name: 'Some',
        didBeginLinting: function didBeginLinting() {},
        didFinishLinting: function didFinishLinting() {},
        render: function render() {},
        dispose: NaN
      }, false, 'UI.dispose must be a function');
      validateUI({
        name: 'Some',
        didBeginLinting: function didBeginLinting() {},
        didFinishLinting: function didFinishLinting() {},
        render: function render() {},
        dispose: 5
      }, false, 'UI.dispose must be a function');
    });
    it('does not cry if everything is good', function () {
      validateUI({
        name: 'Some',
        didBeginLinting: function didBeginLinting() {},
        didFinishLinting: function didFinishLinting() {},
        render: function render() {},
        dispose: function dispose() {}
      }, true);
    });
  });
  describe('::linter', function () {
    function validateLinter(linter, expectedValue, message, version) {
      if (message === undefined) message = '';

      expect(Validate.linter(linter, version)).toBe(expectedValue);
      if (!expectedValue) {
        expectNotification(message);
      }
    }

    it('cries if params is not an object', function () {
      validateLinter(null, false, 'Linter must be an object', 1);
      validateLinter(5, false, 'Linter must be an object', 1);
      validateLinter(NaN, false, 'Linter must be an object', 1);
      validateLinter(undefined, false, 'Linter must be an object', 1);
    });
    it('does not cry if linter.name is not a string on v1', function () {
      validateLinter({
        lint: function lint() {},
        scope: 'file',
        lintOnFly: true,
        grammarScopes: []
      }, true, '', 1);
    });
    it('cries if linter.name is not a string', function () {
      validateLinter({
        name: undefined
      }, false, 'Linter.name must be a string', 2);
      validateLinter({
        name: NaN
      }, false, 'Linter.name must be a string', 2);
      validateLinter({
        name: null
      }, false, 'Linter.name must be a string', 2);
      validateLinter({
        name: 5
      }, false, 'Linter.name must be a string', 2);
    });
    it('cries if linter.scope is not valid', function () {
      validateLinter({
        name: 'Linter',
        scope: 5
      }, false, "Linter.scope must be either 'file' or 'project'", 1);
      validateLinter({
        name: 'Linter',
        scope: NaN
      }, false, "Linter.scope must be either 'file' or 'project'", 1);
      validateLinter({
        name: 'Linter',
        scope: null
      }, false, "Linter.scope must be either 'file' or 'project'", 1);
      validateLinter({
        name: 'Linter',
        scope: undefined
      }, false, "Linter.scope must be either 'file' or 'project'", 1);
      validateLinter({
        name: 'Linter',
        scope: 'something'
      }, false, "Linter.scope must be either 'file' or 'project'", 1);
      validateLinter({
        name: 'Linter',
        scope: 'fileistic'
      }, false, "Linter.scope must be either 'file' or 'project'", 1);
    });
    it('cries if v is 1 and linter.lintOnFly is not boolean', function () {
      validateLinter({
        name: 'Linter',
        scope: 'file',
        lintOnFly: {}
      }, false, 'Linter.lintOnFly must be a boolean', 1);
      validateLinter({
        name: 'Linter',
        scope: 'file',
        lintOnFly: []
      }, false, 'Linter.lintOnFly must be a boolean', 1);
      validateLinter({
        name: 'Linter',
        scope: 'file',
        lintOnFly: ''
      }, false, 'Linter.lintOnFly must be a boolean', 1);
      validateLinter({
        name: 'Linter',
        scope: 'file',
        lintOnFly: function lintOnFly() {}
      }, false, 'Linter.lintOnFly must be a boolean', 1);
    });
    it('cries if v is 2 and linter.lintsOnChange is not boolean', function () {
      validateLinter({
        name: 'Linter',
        scope: 'file',
        lintsOnChange: {}
      }, false, 'Linter.lintsOnChange must be a boolean', 2);
      validateLinter({
        name: 'Linter',
        scope: 'file',
        lintsOnChange: []
      }, false, 'Linter.lintsOnChange must be a boolean', 2);
      validateLinter({
        name: 'Linter',
        scope: 'file',
        lintsOnChange: ''
      }, false, 'Linter.lintsOnChange must be a boolean', 2);
      validateLinter({
        name: 'Linter',
        scope: 'file',
        lintsOnChange: function lintsOnChange() {}
      }, false, 'Linter.lintsOnChange must be a boolean', 2);
    });
    it('cries if linter.grammarScopes is not an array', function () {
      validateLinter({
        name: 'Linter',
        scope: 'file',
        lintOnFly: false,
        grammarScopes: undefined
      }, false, 'Linter.grammarScopes must be an Array', 1);
      validateLinter({
        name: 'Linter',
        scope: 'file',
        lintOnFly: false,
        grammarScopes: null
      }, false, 'Linter.grammarScopes must be an Array', 1);
      validateLinter({
        name: 'Linter',
        scope: 'file',
        lintOnFly: false,
        grammarScopes: 5
      }, false, 'Linter.grammarScopes must be an Array', 1);
      validateLinter({
        name: 'Linter',
        scope: 'file',
        lintOnFly: false,
        grammarScopes: NaN
      }, false, 'Linter.grammarScopes must be an Array', 1);
      validateLinter({
        name: 'Linter',
        scope: 'file',
        lintOnFly: false,
        grammarScopes: {}
      }, false, 'Linter.grammarScopes must be an Array', 1);
    });
    it('cries if linter.lint is not a function', function () {
      validateLinter({
        name: 'Linter',
        scope: 'file',
        lintOnFly: false,
        grammarScopes: ['source.js'],
        lint: undefined
      }, false, 'Linter.lint must be a function', 1);
      validateLinter({
        name: 'Linter',
        scope: 'file',
        lintOnFly: false,
        grammarScopes: ['source.js'],
        lint: 5
      }, false, 'Linter.lint must be a function', 1);
      validateLinter({
        name: 'Linter',
        scope: 'file',
        lintOnFly: false,
        grammarScopes: ['source.js'],
        lint: NaN
      }, false, 'Linter.lint must be a function', 1);
      validateLinter({
        name: 'Linter',
        scope: 'file',
        lintOnFly: false,
        grammarScopes: ['source.js'],
        lint: {}
      }, false, 'Linter.lint must be a function', 1);
      validateLinter({
        name: 'Linter',
        scope: 'file',
        lintOnFly: false,
        grammarScopes: ['source.js'],
        lint: 'something'
      }, false, 'Linter.lint must be a function', 1);
    });
    it('does not cry if everything is valid', function () {
      validateLinter({
        name: 'Linter',
        scope: 'file',
        lintOnFly: false,
        grammarScopes: ['source.js'],
        lint: function lint() {}
      }, true, '', 1);
      validateLinter({
        name: 'Linter',
        scope: 'file',
        lintsOnChange: false,
        grammarScopes: ['source.js'],
        lint: function lint() {}
      }, true, '', 2);
    });
  });
  describe('::indie', function () {
    function validateIndie(linter, expectedValue) {
      var message = arguments.length <= 2 || arguments[2] === undefined ? '' : arguments[2];

      expect(Validate.indie(linter)).toBe(expectedValue);
      if (!expectedValue) {
        expectNotification(message);
      }
    }

    it('cries if params is not an object', function () {
      validateIndie(null, false, 'Indie must be an object');
      validateIndie(5, false, 'Indie must be an object');
      validateIndie(NaN, false, 'Indie must be an object');
      validateIndie(undefined, false, 'Indie must be an object');
    });
    it('cries if indie.name is not a string', function () {
      validateIndie({
        name: undefined
      }, false, 'Indie.name must be a string');
      validateIndie({
        name: 5
      }, false, 'Indie.name must be a string');
      validateIndie({
        name: {}
      }, false, 'Indie.name must be a string');
      validateIndie({
        name: NaN
      }, false, 'Indie.name must be a string');
    });
    it('does not cry if everything is valid', function () {
      validateIndie({
        name: 'Indie'
      }, true);
    });
  });
  describe('::messages', function () {
    function validateMessages(linter, expectedValue) {
      var message = arguments.length <= 2 || arguments[2] === undefined ? '' : arguments[2];

      expect(Validate.messages('Some Linter', linter)).toBe(expectedValue);
      if (!expectedValue) {
        expectNotification(message);
      }
    }

    it('cries if results are not array', function () {
      validateMessages(undefined, false, 'Linter Result must be an Array');
      validateMessages({}, false, 'Linter Result must be an Array');
      validateMessages(5, false, 'Linter Result must be an Array');
      validateMessages(NaN, false, 'Linter Result must be an Array');
    });
    it('cries if message.icon is present and invalid', function () {
      validateMessages([{
        icon: 5
      }], false, 'Message.icon must be a string');
      validateMessages([{
        icon: {}
      }], false, 'Message.icon must be a string');
      validateMessages([{
        icon: function icon() {}
      }], false, 'Message.icon must be a string');
    });
    it('cries if message.location is invalid', function () {
      validateMessages([{
        location: 5
      }], false, 'Message.location must be valid');
      validateMessages([{
        location: NaN
      }], false, 'Message.location must be valid');
      validateMessages([{
        location: {}
      }], false, 'Message.location must be valid');
      validateMessages([{
        location: { file: __filename }
      }], false, 'Message.location must be valid');
      validateMessages([{
        location: { file: __filename, position: 5 }
      }], false, 'Message.location must be valid');
      validateMessages([{
        location: { file: __filename, position: null }
      }], false, 'Message.location must be valid');
      validateMessages([{
        location: { file: __filename, position: '' }
      }], false, 'Message.location must be valid');
      validateMessages([{
        location: { file: __filename, position: NaN }
      }], false, 'Message.location must be valid');
    });
    it('cries if message.location contains NaN', function () {
      validateMessages([{
        location: { file: __filename, position: [[NaN, NaN], [NaN, NaN]] }
      }], false, 'Message.location.position should not contain NaN coordinates');
      validateMessages([{
        location: { file: __filename, position: [[0, 0], [0, NaN]] }
      }], false, 'Message.location.position should not contain NaN coordinates');
      validateMessages([{
        location: { file: __filename, position: [[0, 0], [NaN, 0]] }
      }], false, 'Message.location.position should not contain NaN coordinates');
      validateMessages([{
        location: { file: __filename, position: [[0, NaN], [0, 0]] }
      }], false, 'Message.location.position should not contain NaN coordinates');
      validateMessages([{
        location: { file: __filename, position: [[NaN, 0], [0, 0]] }
      }], false, 'Message.location.position should not contain NaN coordinates');
    });
    it('cries if message.solutions is present and is not array', function () {
      validateMessages([{
        location: { file: __filename, position: [[0, 0], [0, 0]] },
        solutions: {}
      }], false, 'Message.solutions must be valid');
      validateMessages([{
        location: { file: __filename, position: [[0, 0], [0, 0]] },
        solutions: 'asdsad'
      }], false, 'Message.solutions must be valid');
      validateMessages([{
        location: { file: __filename, position: [[0, 0], [0, 0]] },
        solutions: 5
      }], false, 'Message.solutions must be valid');
    });
    it('cries if message.reference is present and invalid', function () {
      validateMessages([{
        location: { file: __filename, position: [[0, 0], [0, 0]] },
        reference: 5
      }], false, 'Message.reference must be valid');
      validateMessages([{
        location: { file: __filename, position: [[0, 0], [0, 0]] },
        reference: {}
      }], false, 'Message.reference must be valid');
      validateMessages([{
        location: { file: __filename, position: [[0, 0], [0, 0]] },
        reference: 'asdasd'
      }], false, 'Message.reference must be valid');
      validateMessages([{
        location: { file: __filename, position: [[0, 0], [0, 0]] },
        reference: { file: __filename }
      }], false, 'Message.reference must be valid');
      validateMessages([{
        location: { file: __filename, position: [[0, 0], [0, 0]] },
        reference: { file: __filename, position: 5 }
      }], false, 'Message.reference must be valid');
      validateMessages([{
        location: { file: __filename, position: [[0, 0], [0, 0]] },
        reference: { file: __filename, position: NaN }
      }], false, 'Message.reference must be valid');
      validateMessages([{
        location: { file: __filename, position: [[0, 0], [0, 0]] },
        reference: { file: __filename, position: null }
      }], false, 'Message.reference must be valid');
    });
    it('cries if message.reference contains NaN', function () {
      validateMessages([{
        location: { file: __filename, position: [[0, 0], [0, 0]] },
        reference: { file: __filename, position: [NaN, 5] }
      }], false, 'Message.reference.position should not contain NaN coordinates');
      validateMessages([{
        location: { file: __filename, position: [[0, 0], [0, 0]] },
        reference: { file: __filename, position: [5, NaN] }
      }], false, 'Message.reference.position should not contain NaN coordinates');
      validateMessages([{
        location: { file: __filename, position: [[0, 0], [0, 0]] },
        reference: { file: __filename, position: [NaN, NaN] }
      }], false, 'Message.reference.position should not contain NaN coordinates');
    });
    it('cries if message.excerpt is not string', function () {
      validateMessages([{
        location: { file: __filename, position: [[0, 0], [0, 0]] },
        excerpt: undefined
      }], false, 'Message.excerpt must be a string');
      validateMessages([{
        location: { file: __filename, position: [[0, 0], [0, 0]] },
        excerpt: {}
      }], false, 'Message.excerpt must be a string');
      validateMessages([{
        location: { file: __filename, position: [[0, 0], [0, 0]] },
        excerpt: null
      }], false, 'Message.excerpt must be a string');
      validateMessages([{
        location: { file: __filename, position: [[0, 0], [0, 0]] },
        excerpt: NaN
      }], false, 'Message.excerpt must be a string');
      validateMessages([{
        location: { file: __filename, position: [[0, 0], [0, 0]] },
        excerpt: 5
      }], false, 'Message.excerpt must be a string');
    });
    it('cries if message.severity is invalid', function () {
      validateMessages([{
        location: { file: __filename, position: [[0, 0], [0, 0]] },
        excerpt: '',
        severity: ''
      }], false, "Message.severity must be 'error', 'warning' or 'info'");
      validateMessages([{
        location: { file: __filename, position: [[0, 0], [0, 0]] },
        excerpt: '',
        severity: NaN
      }], false, "Message.severity must be 'error', 'warning' or 'info'");
      validateMessages([{
        location: { file: __filename, position: [[0, 0], [0, 0]] },
        excerpt: '',
        severity: 5
      }], false, "Message.severity must be 'error', 'warning' or 'info'");
      validateMessages([{
        location: { file: __filename, position: [[0, 0], [0, 0]] },
        excerpt: '',
        severity: {}
      }], false, "Message.severity must be 'error', 'warning' or 'info'");
      validateMessages([{
        location: { file: __filename, position: [[0, 0], [0, 0]] },
        excerpt: '',
        severity: 'errorish'
      }], false, "Message.severity must be 'error', 'warning' or 'info'");
      validateMessages([{
        location: { file: __filename, position: [[0, 0], [0, 0]] },
        excerpt: '',
        severity: 'warningish'
      }], false, "Message.severity must be 'error', 'warning' or 'info'");
    });
    it('cries if message.url is present and is not string', function () {
      validateMessages([{
        location: { file: __filename, position: [[0, 0], [0, 0]] },
        excerpt: '',
        severity: 'error',
        url: 5
      }], false, 'Message.url must be a string');
      validateMessages([{
        location: { file: __filename, position: [[0, 0], [0, 0]] },
        excerpt: '',
        severity: 'error',
        url: {}
      }], false, 'Message.url must be a string');
    });
    it('cries if message.description is present and is invalid', function () {
      validateMessages([{
        location: { file: __filename, position: [[0, 0], [0, 0]] },
        excerpt: '',
        severity: 'error',
        description: 5
      }], false, 'Message.description must be a function or string');
      validateMessages([{
        location: { file: __filename, position: [[0, 0], [0, 0]] },
        excerpt: '',
        severity: 'error',
        description: {}
      }], false, 'Message.description must be a function or string');
    });
    it('does not cry if provided with valid values', function () {
      validateMessages([{
        location: { file: __filename, position: [[0, 0], [0, 0]] },
        excerpt: '',
        severity: 'error'
      }], true);
      validateMessages([{
        location: { file: __filename, position: [[0, 0], [0, 0]] },
        excerpt: '',
        severity: 'error',
        solutions: []
      }], true);
      validateMessages([{
        location: { file: __filename, position: [[0, 0], [0, 0]] },
        reference: { file: __filename, position: [0, 0] },
        excerpt: '',
        severity: 'warning'
      }], true);
      validateMessages([{
        location: { file: __filename, position: [[0, 0], [0, 0]] },
        excerpt: '',
        url: 'something',
        severity: 'info'
      }], true);
      validateMessages([{
        location: { file: __filename, position: [[0, 0], [0, 0]] },
        excerpt: '',
        description: 'something',
        severity: 'warning'
      }], true);
      validateMessages([{
        location: { file: __filename, position: [[0, 0], [0, 0]] },
        excerpt: '',
        description: function description() {},
        severity: 'warning'
      }], true);
    });
    it('cries if message.linterName is present and is invalid', function () {
      validateMessages([{
        location: { file: __filename, position: [[0, 0], [0, 0]] },
        excerpt: '',
        severity: 'error',
        description: '',
        linterName: 1
      }], false, 'Message.linterName must be a string');
    });
  });
  describe('::messagesLegacy', function () {
    function validateMessagesLegacy(linter, expectedValue) {
      var message = arguments.length <= 2 || arguments[2] === undefined ? '' : arguments[2];

      expect(Validate.messagesLegacy('Some Linter', linter)).toBe(expectedValue);
      if (!expectedValue) {
        expectNotification(message);
      }
    }

    it('cries if results are not array', function () {
      validateMessagesLegacy(undefined, false, 'Linter Result must be an Array');
      validateMessagesLegacy({}, false, 'Linter Result must be an Array');
      validateMessagesLegacy(5, false, 'Linter Result must be an Array');
      validateMessagesLegacy(NaN, false, 'Linter Result must be an Array');
    });
    it('cries if message.type is invalid', function () {
      validateMessagesLegacy([{
        type: undefined
      }], false, 'Message.type must be a string');
      validateMessagesLegacy([{
        type: NaN
      }], false, 'Message.type must be a string');
      validateMessagesLegacy([{
        type: 5
      }], false, 'Message.type must be a string');
      validateMessagesLegacy([{
        type: null
      }], false, 'Message.type must be a string');
    });
    it('cries if message.text and message.html are invalid', function () {
      validateMessagesLegacy([{
        type: 'Error'
      }], false, 'Message.text or Message.html must have a valid value');
      validateMessagesLegacy([{
        type: 'Error',
        html: {}
      }], false, 'Message.text or Message.html must have a valid value');
      validateMessagesLegacy([{
        type: 'Error',
        html: 5
      }], false, 'Message.text or Message.html must have a valid value');
      validateMessagesLegacy([{
        type: 'Error',
        html: NaN
      }], false, 'Message.text or Message.html must have a valid value');
      validateMessagesLegacy([{
        type: 'Error',
        text: 5
      }], false, 'Message.text or Message.html must have a valid value');
      validateMessagesLegacy([{
        type: 'Error',
        text: {}
      }], false, 'Message.text or Message.html must have a valid value');
      validateMessagesLegacy([{
        type: 'Error',
        text: NaN
      }], false, 'Message.text or Message.html must have a valid value');
    });
    it('cries if message.filePath is present and invalid', function () {
      validateMessagesLegacy([{
        type: 'Error',
        text: 'some',
        filePath: 5
      }], false, 'Message.filePath must be a string');
      validateMessagesLegacy([{
        type: 'Error',
        text: 'some',
        filePath: {}
      }], false, 'Message.filePath must be a string');
      validateMessagesLegacy([{
        type: 'Error',
        text: 'some',
        filePath: function filePath() {}
      }], false, 'Message.filePath must be a string');
    });
    it('cries if message.range is present and invalid', function () {
      validateMessagesLegacy([{
        type: 'Error',
        text: 'some',
        range: 'some'
      }], false, 'Message.range must be an object');
      validateMessagesLegacy([{
        type: 'Error',
        text: 'some',
        range: 5
      }], false, 'Message.range must be an object');
      validateMessagesLegacy([{
        type: 'Error',
        text: 'some',
        range: function range() {}
      }], false, 'Message.range must be an object');
    });
    it('cries if message.range has NaN values', function () {
      validateMessagesLegacy([{
        type: 'Error',
        text: 'some',
        range: [[NaN, NaN], [NaN, NaN]]
      }], false, 'Message.range should not contain NaN coordinates');
      validateMessagesLegacy([{
        type: 'Error',
        text: 'some',
        range: [[NaN, 0], [0, 0]]
      }], false, 'Message.range should not contain NaN coordinates');
      validateMessagesLegacy([{
        type: 'Error',
        text: 'some',
        range: [[0, NaN], [0, 0]]
      }], false, 'Message.range should not contain NaN coordinates');
      validateMessagesLegacy([{
        type: 'Error',
        text: 'some',
        range: [[0, 0], [NaN, 0]]
      }], false, 'Message.range should not contain NaN coordinates');
      validateMessagesLegacy([{
        type: 'Error',
        text: 'some',
        range: [[0, 0], [0, NaN]]
      }], false, 'Message.range should not contain NaN coordinates');
    });
    it('cries if message.class is present and invalid', function () {
      validateMessagesLegacy([{
        type: 'Error',
        text: 'some',
        'class': 5
      }], false, 'Message.class must be a string');
      validateMessagesLegacy([{
        type: 'Error',
        text: 'some',
        'class': {}
      }], false, 'Message.class must be a string');
      validateMessagesLegacy([{
        type: 'Error',
        text: 'some',
        'class': function _class() {}
      }], false, 'Message.class must be a string');
    });
    it('cries if message.severity is present and invalid', function () {
      validateMessagesLegacy([{
        type: 'Error',
        text: 'some',
        severity: {}
      }], false, "Message.severity must be 'error', 'warning' or 'info'");
      validateMessagesLegacy([{
        type: 'Error',
        text: 'some',
        severity: []
      }], false, "Message.severity must be 'error', 'warning' or 'info'");
      validateMessagesLegacy([{
        type: 'Error',
        text: 'some',
        severity: function severity() {}
      }], false, "Message.severity must be 'error', 'warning' or 'info'");
      validateMessagesLegacy([{
        type: 'Error',
        text: 'some',
        severity: 'error-ish'
      }], false, "Message.severity must be 'error', 'warning' or 'info'");
    });
    it('cries if message.trace is present and invalid', function () {
      validateMessagesLegacy([{
        type: 'Error',
        text: 'some',
        trace: {}
      }], false, 'Message.trace must be an Array');
      validateMessagesLegacy([{
        type: 'Error',
        text: 'some',
        trace: function trace() {}
      }], false, 'Message.trace must be an Array');
      validateMessagesLegacy([{
        type: 'Error',
        text: 'some',
        trace: 5
      }], false, 'Message.trace must be an Array');
    });
    it('cries if message.fix is present and invalid', function () {
      validateMessagesLegacy([{
        type: 'Error',
        text: 'some',
        fix: {}
      }], false, 'Message.fix must be valid');
      validateMessagesLegacy([{
        type: 'Error',
        text: 'some',
        fix: 5
      }], false, 'Message.fix must be valid');
      validateMessagesLegacy([{
        type: 'Error',
        text: 'some',
        fix: function fix() {}
      }], false, 'Message.fix must be valid');
      validateMessagesLegacy([{
        type: 'Error',
        text: 'some',
        fix: { range: 5, newText: 'some', oldText: 'some' }
      }], false, 'Message.fix must be valid');
      validateMessagesLegacy([{
        type: 'Error',
        text: 'some',
        fix: { range: NaN, newText: 'some', oldText: 'some' }
      }], false, 'Message.fix must be valid');
      validateMessagesLegacy([{
        type: 'Error',
        text: 'some',
        fix: { range: undefined, newText: 'some', oldText: 'some' }
      }], false, 'Message.fix must be valid');
      validateMessagesLegacy([{
        type: 'Error',
        text: 'some',
        fix: { range: [[0, 0], [0, 0]], newText: 5, oldText: 'some' }
      }], false, 'Message.fix must be valid');
      validateMessagesLegacy([{
        type: 'Error',
        text: 'some',
        fix: { range: [[0, 0], [0, 0]], newText: {}, oldText: 'some' }
      }], false, 'Message.fix must be valid');
      validateMessagesLegacy([{
        type: 'Error',
        text: 'some',
        fix: { range: [[0, 0], [0, 0]], newText: function newText() {}, oldText: 'some' }
      }], false, 'Message.fix must be valid');
      validateMessagesLegacy([{
        type: 'Error',
        text: 'some',
        fix: { range: [[0, 0], [0, 0]], newText: 'some', oldText: 5 }
      }], false, 'Message.fix must be valid');
      validateMessagesLegacy([{
        type: 'Error',
        text: 'some',
        fix: { range: [[0, 0], [0, 0]], newText: 'some', oldText: {} }
      }], false, 'Message.fix must be valid');
      validateMessagesLegacy([{
        type: 'Error',
        text: 'some',
        fix: { range: [[0, 0], [0, 0]], newText: 'some', oldText: function oldText() {} }
      }], false, 'Message.fix must be valid');
    });
    it('does not cry if the object is valid', function () {
      validateMessagesLegacy([{
        type: 'Error',
        text: 'some'
      }], true);
      validateMessagesLegacy([{
        type: 'Error',
        text: 'some',
        filePath: 'some'
      }], true);
      validateMessagesLegacy([{
        type: 'Error',
        text: 'some'
      }], true);
      validateMessagesLegacy([{
        type: 'Error',
        html: 'Some'
      }], true);
      validateMessagesLegacy([{
        type: 'Error',
        html: document.createElement('div')
      }], true);
      validateMessagesLegacy([{
        type: 'Error',
        text: 'some',
        range: [[0, 0], [0, 0]]
      }], true);
      validateMessagesLegacy([{
        type: 'Error',
        text: 'some',
        'class': 'some'
      }], true);
      validateMessagesLegacy([{
        type: 'Error',
        text: 'some',
        severity: 'error'
      }], true);
      validateMessagesLegacy([{
        type: 'Error',
        text: 'some',
        severity: 'info'
      }], true);
      validateMessagesLegacy([{
        type: 'Error',
        text: 'some',
        severity: 'warning'
      }], true);
      validateMessagesLegacy([{
        type: 'Error',
        text: 'some',
        trace: []
      }], true);
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvc3BlYy92YWxpZGF0ZS1zcGVjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OzJCQUUwQixpQkFBaUI7O0lBQS9CLFFBQVE7O0FBRXBCLFFBQVEsQ0FBQyxVQUFVLEVBQUUsWUFBVztBQUM5QixXQUFTLGtCQUFrQixDQUFDLE9BQWUsRUFBRTtBQUMzQyxRQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLGdCQUFnQixFQUFFLENBQUE7QUFDM0QsVUFBTSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDcEMsUUFBTSxNQUFNLEdBQUcsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQzFELFVBQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQTtBQUNkLFVBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLFVBQVEsT0FBTyxDQUFHLENBQUE7QUFDeEMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtHQUMzQjs7QUFFRCxVQUFRLENBQUMsTUFBTSxFQUFFLFlBQVc7QUFDMUIsYUFBUyxVQUFVLENBQUMsRUFBTyxFQUFFLGFBQXNCLEVBQXdCO1VBQXRCLE9BQWUseURBQUcsRUFBRTs7QUFDdkUsWUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUE7QUFDM0MsVUFBSSxDQUFDLGFBQWEsRUFBRTtBQUNsQiwwQkFBa0IsQ0FBQyxPQUFPLENBQUMsQ0FBQTtPQUM1QjtLQUNGOztBQUVELE1BQUUsQ0FBQyxpQ0FBaUMsRUFBRSxZQUFXO0FBQy9DLGdCQUFVLENBQUMsU0FBUyxFQUFFLEtBQUssRUFBRSxzQkFBc0IsQ0FBQyxDQUFBO0FBQ3BE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LE1BQU07QUFDWixpQkFBTyxNQUFNO09BQ2QsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFBO0FBQ1QsNEJBQXNCLENBQUMsQ0FBQztBQUN0QixZQUFJLEVBQUUsT0FBTztBQUNiLFlBQUksRUFBRSxNQUFNO0FBQ1osZ0JBQVEsRUFBRSxPQUFPO09BQ2xCLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQTtBQUNULDRCQUFzQixDQUFDLENBQUM7QUFDdEIsWUFBSSxFQUFFLE9BQU87QUFDYixZQUFJLEVBQUUsTUFBTTtBQUNaLGdCQUFRLEVBQUUsTUFBTTtPQUNqQixDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUE7QUFDVCw0QkFBc0IsQ0FBQyxDQUFDO0FBQ3RCLFlBQUksRUFBRSxPQUFPO0FBQ2IsWUFBSSxFQUFFLE1BQU07QUFDWixnQkFBUSxFQUFFLFNBQVM7T0FDcEIsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFBO0FBQ1QsNEJBQXNCLENBQUMsQ0FBQztBQUN0QixZQUFJLEVBQUUsT0FBTztBQUNiLFlBQUksRUFBRSxNQUFNO0FBQ1osYUFBSyxFQUFFLEVBQUU7T0FDVixDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUE7S0FDVixDQUFDLENBQUE7R0FDSCxDQUFDLENBQUE7Q0FDSCxDQUFDLENBQUEiLCJmaWxlIjoiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9zcGVjL3ZhbGlkYXRlLXNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgKiBhcyBWYWxpZGF0ZSBmcm9tICcuLi9saWIvdmFsaWRhdGUnXG5cbmRlc2NyaWJlKCdWYWxpZGF0ZScsIGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBleHBlY3ROb3RpZmljYXRpb24obWVzc2FnZTogc3RyaW5nKSB7XG4gICAgY29uc3Qgbm90aWZpY2F0aW9ucyA9IGF0b20ubm90aWZpY2F0aW9ucy5nZXROb3RpZmljYXRpb25zKClcbiAgICBleHBlY3Qobm90aWZpY2F0aW9ucy5sZW5ndGgpLnRvQmUoMSlcbiAgICBjb25zdCBpc3N1ZXMgPSBub3RpZmljYXRpb25zWzBdLm9wdGlvbnMuZGV0YWlsLnNwbGl0KCdcXG4nKVxuICAgIGlzc3Vlcy5zaGlmdCgpXG4gICAgZXhwZWN0KGlzc3Vlc1swXSkudG9CZShgICDigKIgJHttZXNzYWdlfWApXG4gICAgYXRvbS5ub3RpZmljYXRpb25zLmNsZWFyKClcbiAgfVxuXG4gIGRlc2NyaWJlKCc6OnVpJywgZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gdmFsaWRhdGVVSSh1aTogYW55LCBleHBlY3RlZFZhbHVlOiBib29sZWFuLCBtZXNzYWdlOiBzdHJpbmcgPSAnJykge1xuICAgICAgZXhwZWN0KFZhbGlkYXRlLnVpKHVpKSkudG9CZShleHBlY3RlZFZhbHVlKVxuICAgICAgaWYgKCFleHBlY3RlZFZhbHVlKSB7XG4gICAgICAgIGV4cGVjdE5vdGlmaWNhdGlvbihtZXNzYWdlKVxuICAgICAgfVxuICAgIH1cblxuICAgIGl0KCdjcmllcyBpZiBwYXJhbSBpcyBub3QgYW4gb2JqZWN0JywgZnVuY3Rpb24oKSB7XG4gICAgICB2YWxpZGF0ZVVJKHVuZGVmaW5lZCwgZmFsc2UsICdVSSBtdXN0IGJlIGFuIG9iamVjdCcpXG4gICAgICB2YWxpZGF0ZVVJKG51bGwsIGZhbHNlLCAnVUkgbXVzdCBiZSBhbiBvYmplY3QnKVxuICAgICAgdmFsaWRhdGVVSSgyLCBmYWxzZSwgJ1VJIG11c3QgYmUgYW4gb2JqZWN0JylcbiAgICAgIHZhbGlkYXRlVUkoTmFOLCBmYWxzZSwgJ1VJIG11c3QgYmUgYW4gb2JqZWN0JylcbiAgICB9KVxuICAgIGl0KCdjcmllcyBpZiB1aS5uYW1lIGlzIG5vdCBhIHN0cmluZycsIGZ1bmN0aW9uKCkge1xuICAgICAgdmFsaWRhdGVVSSh7XG4gICAgICAgIG5hbWU6IE5hTixcbiAgICAgIH0sIGZhbHNlLCAnVUkubmFtZSBtdXN0IGJlIGEgc3RyaW5nJylcbiAgICAgIHZhbGlkYXRlVUkoe1xuICAgICAgICBuYW1lOiBudWxsLFxuICAgICAgfSwgZmFsc2UsICdVSS5uYW1lIG11c3QgYmUgYSBzdHJpbmcnKVxuICAgICAgdmFsaWRhdGVVSSh7XG4gICAgICAgIG5hbWU6IDIsXG4gICAgICB9LCBmYWxzZSwgJ1VJLm5hbWUgbXVzdCBiZSBhIHN0cmluZycpXG4gICAgfSlcbiAgICBpdCgnY3JpZXMgaWYgdWkuZGlkQmVnaW5MaW50aW5nIGlzIG5vdCBhIGZ1bmN0aW9uJywgZnVuY3Rpb24oKSB7XG4gICAgICB2YWxpZGF0ZVVJKHtcbiAgICAgICAgbmFtZTogJ1NvbWUnLFxuICAgICAgICBkaWRCZWdpbkxpbnRpbmc6IG51bGwsXG4gICAgICB9LCBmYWxzZSwgJ1VJLmRpZEJlZ2luTGludGluZyBtdXN0IGJlIGEgZnVuY3Rpb24nKVxuICAgICAgdmFsaWRhdGVVSSh7XG4gICAgICAgIG5hbWU6ICdTb21lJyxcbiAgICAgICAgZGlkQmVnaW5MaW50aW5nOiB7fSxcbiAgICAgIH0sIGZhbHNlLCAnVUkuZGlkQmVnaW5MaW50aW5nIG11c3QgYmUgYSBmdW5jdGlvbicpXG4gICAgICB2YWxpZGF0ZVVJKHtcbiAgICAgICAgbmFtZTogJ1NvbWUnLFxuICAgICAgICBkaWRCZWdpbkxpbnRpbmc6IE5hTixcbiAgICAgIH0sIGZhbHNlLCAnVUkuZGlkQmVnaW5MaW50aW5nIG11c3QgYmUgYSBmdW5jdGlvbicpXG4gICAgICB2YWxpZGF0ZVVJKHtcbiAgICAgICAgbmFtZTogJ1NvbWUnLFxuICAgICAgICBkaWRCZWdpbkxpbnRpbmc6IDUsXG4gICAgICB9LCBmYWxzZSwgJ1VJLmRpZEJlZ2luTGludGluZyBtdXN0IGJlIGEgZnVuY3Rpb24nKVxuICAgIH0pXG4gICAgaXQoJ2NyaWVzIGlmIHVpLmRpZEZpbmlzaExpbnRpbmcgaXMgbm90IGEgZnVuY3Rpb24nLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhbGlkYXRlVUkoe1xuICAgICAgICBuYW1lOiAnU29tZScsXG4gICAgICAgIGRpZEJlZ2luTGludGluZygpIHsgfSxcbiAgICAgICAgZGlkRmluaXNoTGludGluZzogbnVsbCxcbiAgICAgIH0sIGZhbHNlLCAnVUkuZGlkRmluaXNoTGludGluZyBtdXN0IGJlIGEgZnVuY3Rpb24nKVxuICAgICAgdmFsaWRhdGVVSSh7XG4gICAgICAgIG5hbWU6ICdTb21lJyxcbiAgICAgICAgZGlkQmVnaW5MaW50aW5nKCkgeyB9LFxuICAgICAgICBkaWRGaW5pc2hMaW50aW5nOiB7fSxcbiAgICAgIH0sIGZhbHNlLCAnVUkuZGlkRmluaXNoTGludGluZyBtdXN0IGJlIGEgZnVuY3Rpb24nKVxuICAgICAgdmFsaWRhdGVVSSh7XG4gICAgICAgIG5hbWU6ICdTb21lJyxcbiAgICAgICAgZGlkQmVnaW5MaW50aW5nKCkgeyB9LFxuICAgICAgICBkaWRGaW5pc2hMaW50aW5nOiBOYU4sXG4gICAgICB9LCBmYWxzZSwgJ1VJLmRpZEZpbmlzaExpbnRpbmcgbXVzdCBiZSBhIGZ1bmN0aW9uJylcbiAgICAgIHZhbGlkYXRlVUkoe1xuICAgICAgICBuYW1lOiAnU29tZScsXG4gICAgICAgIGRpZEJlZ2luTGludGluZygpIHsgfSxcbiAgICAgICAgZGlkRmluaXNoTGludGluZzogNSxcbiAgICAgIH0sIGZhbHNlLCAnVUkuZGlkRmluaXNoTGludGluZyBtdXN0IGJlIGEgZnVuY3Rpb24nKVxuICAgIH0pXG4gICAgaXQoJ2NyaWVzIGlmIHVpLnJlbmRlciBpcyBub3QgYSBmdW5jdGlvbicsIGZ1bmN0aW9uKCkge1xuICAgICAgdmFsaWRhdGVVSSh7XG4gICAgICAgIG5hbWU6ICdTb21lJyxcbiAgICAgICAgZGlkQmVnaW5MaW50aW5nKCkgeyB9LFxuICAgICAgICBkaWRGaW5pc2hMaW50aW5nKCkgeyB9LFxuICAgICAgICByZW5kZXI6IG51bGwsXG4gICAgICB9LCBmYWxzZSwgJ1VJLnJlbmRlciBtdXN0IGJlIGEgZnVuY3Rpb24nKVxuICAgICAgdmFsaWRhdGVVSSh7XG4gICAgICAgIG5hbWU6ICdTb21lJyxcbiAgICAgICAgZGlkQmVnaW5MaW50aW5nKCkgeyB9LFxuICAgICAgICBkaWRGaW5pc2hMaW50aW5nKCkgeyB9LFxuICAgICAgICByZW5kZXI6IHt9LFxuICAgICAgfSwgZmFsc2UsICdVSS5yZW5kZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJylcbiAgICAgIHZhbGlkYXRlVUkoe1xuICAgICAgICBuYW1lOiAnU29tZScsXG4gICAgICAgIGRpZEJlZ2luTGludGluZygpIHsgfSxcbiAgICAgICAgZGlkRmluaXNoTGludGluZygpIHsgfSxcbiAgICAgICAgcmVuZGVyOiBOYU4sXG4gICAgICB9LCBmYWxzZSwgJ1VJLnJlbmRlciBtdXN0IGJlIGEgZnVuY3Rpb24nKVxuICAgICAgdmFsaWRhdGVVSSh7XG4gICAgICAgIG5hbWU6ICdTb21lJyxcbiAgICAgICAgZGlkQmVnaW5MaW50aW5nKCkgeyB9LFxuICAgICAgICBkaWRGaW5pc2hMaW50aW5nKCkgeyB9LFxuICAgICAgICByZW5kZXI6IDUsXG4gICAgICB9LCBmYWxzZSwgJ1VJLnJlbmRlciBtdXN0IGJlIGEgZnVuY3Rpb24nKVxuICAgIH0pXG4gICAgaXQoJ2NyaWVzIGlmIHVpLmRpc3Bvc2UgaXMgbm90IGEgZnVuY3Rpb24nLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhbGlkYXRlVUkoe1xuICAgICAgICBuYW1lOiAnU29tZScsXG4gICAgICAgIGRpZEJlZ2luTGludGluZygpIHsgfSxcbiAgICAgICAgZGlkRmluaXNoTGludGluZygpIHsgfSxcbiAgICAgICAgcmVuZGVyKCkge30sXG4gICAgICAgIGRpc3Bvc2U6IG51bGwsXG4gICAgICB9LCBmYWxzZSwgJ1VJLmRpc3Bvc2UgbXVzdCBiZSBhIGZ1bmN0aW9uJylcbiAgICAgIHZhbGlkYXRlVUkoe1xuICAgICAgICBuYW1lOiAnU29tZScsXG4gICAgICAgIGRpZEJlZ2luTGludGluZygpIHsgfSxcbiAgICAgICAgZGlkRmluaXNoTGludGluZygpIHsgfSxcbiAgICAgICAgcmVuZGVyKCkge30sXG4gICAgICAgIGRpc3Bvc2U6IHt9LFxuICAgICAgfSwgZmFsc2UsICdVSS5kaXNwb3NlIG11c3QgYmUgYSBmdW5jdGlvbicpXG4gICAgICB2YWxpZGF0ZVVJKHtcbiAgICAgICAgbmFtZTogJ1NvbWUnLFxuICAgICAgICBkaWRCZWdpbkxpbnRpbmcoKSB7IH0sXG4gICAgICAgIGRpZEZpbmlzaExpbnRpbmcoKSB7IH0sXG4gICAgICAgIHJlbmRlcigpIHt9LFxuICAgICAgICBkaXNwb3NlOiBOYU4sXG4gICAgICB9LCBmYWxzZSwgJ1VJLmRpc3Bvc2UgbXVzdCBiZSBhIGZ1bmN0aW9uJylcbiAgICAgIHZhbGlkYXRlVUkoe1xuICAgICAgICBuYW1lOiAnU29tZScsXG4gICAgICAgIGRpZEJlZ2luTGludGluZygpIHsgfSxcbiAgICAgICAgZGlkRmluaXNoTGludGluZygpIHsgfSxcbiAgICAgICAgcmVuZGVyKCkge30sXG4gICAgICAgIGRpc3Bvc2U6IDUsXG4gICAgICB9LCBmYWxzZSwgJ1VJLmRpc3Bvc2UgbXVzdCBiZSBhIGZ1bmN0aW9uJylcbiAgICB9KVxuICAgIGl0KCdkb2VzIG5vdCBjcnkgaWYgZXZlcnl0aGluZyBpcyBnb29kJywgZnVuY3Rpb24oKSB7XG4gICAgICB2YWxpZGF0ZVVJKHtcbiAgICAgICAgbmFtZTogJ1NvbWUnLFxuICAgICAgICBkaWRCZWdpbkxpbnRpbmcoKSB7fSxcbiAgICAgICAgZGlkRmluaXNoTGludGluZygpIHt9LFxuICAgICAgICByZW5kZXIoKSB7fSxcbiAgICAgICAgZGlzcG9zZSgpIHt9LFxuICAgICAgfSwgdHJ1ZSlcbiAgICB9KVxuICB9KVxuICBkZXNjcmliZSgnOjpsaW50ZXInLCBmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiB2YWxpZGF0ZUxpbnRlcihsaW50ZXI6IGFueSwgZXhwZWN0ZWRWYWx1ZTogYm9vbGVhbiwgbWVzc2FnZTogc3RyaW5nID0gJycsIHZlcnNpb246IDEgfCAyKSB7XG4gICAgICBleHBlY3QoVmFsaWRhdGUubGludGVyKGxpbnRlciwgdmVyc2lvbikpLnRvQmUoZXhwZWN0ZWRWYWx1ZSlcbiAgICAgIGlmICghZXhwZWN0ZWRWYWx1ZSkge1xuICAgICAgICBleHBlY3ROb3RpZmljYXRpb24obWVzc2FnZSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpdCgnY3JpZXMgaWYgcGFyYW1zIGlzIG5vdCBhbiBvYmplY3QnLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhbGlkYXRlTGludGVyKG51bGwsIGZhbHNlLCAnTGludGVyIG11c3QgYmUgYW4gb2JqZWN0JywgMSlcbiAgICAgIHZhbGlkYXRlTGludGVyKDUsIGZhbHNlLCAnTGludGVyIG11c3QgYmUgYW4gb2JqZWN0JywgMSlcbiAgICAgIHZhbGlkYXRlTGludGVyKE5hTiwgZmFsc2UsICdMaW50ZXIgbXVzdCBiZSBhbiBvYmplY3QnLCAxKVxuICAgICAgdmFsaWRhdGVMaW50ZXIodW5kZWZpbmVkLCBmYWxzZSwgJ0xpbnRlciBtdXN0IGJlIGFuIG9iamVjdCcsIDEpXG4gICAgfSlcbiAgICBpdCgnZG9lcyBub3QgY3J5IGlmIGxpbnRlci5uYW1lIGlzIG5vdCBhIHN0cmluZyBvbiB2MScsIGZ1bmN0aW9uKCkge1xuICAgICAgdmFsaWRhdGVMaW50ZXIoe1xuICAgICAgICBsaW50KCkge30sXG4gICAgICAgIHNjb3BlOiAnZmlsZScsXG4gICAgICAgIGxpbnRPbkZseTogdHJ1ZSxcbiAgICAgICAgZ3JhbW1hclNjb3BlczogW10sXG4gICAgICB9LCB0cnVlLCAnJywgMSlcbiAgICB9KVxuICAgIGl0KCdjcmllcyBpZiBsaW50ZXIubmFtZSBpcyBub3QgYSBzdHJpbmcnLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhbGlkYXRlTGludGVyKHtcbiAgICAgICAgbmFtZTogdW5kZWZpbmVkLFxuICAgICAgfSwgZmFsc2UsICdMaW50ZXIubmFtZSBtdXN0IGJlIGEgc3RyaW5nJywgMilcbiAgICAgIHZhbGlkYXRlTGludGVyKHtcbiAgICAgICAgbmFtZTogTmFOLFxuICAgICAgfSwgZmFsc2UsICdMaW50ZXIubmFtZSBtdXN0IGJlIGEgc3RyaW5nJywgMilcbiAgICAgIHZhbGlkYXRlTGludGVyKHtcbiAgICAgICAgbmFtZTogbnVsbCxcbiAgICAgIH0sIGZhbHNlLCAnTGludGVyLm5hbWUgbXVzdCBiZSBhIHN0cmluZycsIDIpXG4gICAgICB2YWxpZGF0ZUxpbnRlcih7XG4gICAgICAgIG5hbWU6IDUsXG4gICAgICB9LCBmYWxzZSwgJ0xpbnRlci5uYW1lIG11c3QgYmUgYSBzdHJpbmcnLCAyKVxuICAgIH0pXG4gICAgaXQoJ2NyaWVzIGlmIGxpbnRlci5zY29wZSBpcyBub3QgdmFsaWQnLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhbGlkYXRlTGludGVyKHtcbiAgICAgICAgbmFtZTogJ0xpbnRlcicsXG4gICAgICAgIHNjb3BlOiA1LFxuICAgICAgfSwgZmFsc2UsIFwiTGludGVyLnNjb3BlIG11c3QgYmUgZWl0aGVyICdmaWxlJyBvciAncHJvamVjdCdcIiwgMSlcbiAgICAgIHZhbGlkYXRlTGludGVyKHtcbiAgICAgICAgbmFtZTogJ0xpbnRlcicsXG4gICAgICAgIHNjb3BlOiBOYU4sXG4gICAgICB9LCBmYWxzZSwgXCJMaW50ZXIuc2NvcGUgbXVzdCBiZSBlaXRoZXIgJ2ZpbGUnIG9yICdwcm9qZWN0J1wiLCAxKVxuICAgICAgdmFsaWRhdGVMaW50ZXIoe1xuICAgICAgICBuYW1lOiAnTGludGVyJyxcbiAgICAgICAgc2NvcGU6IG51bGwsXG4gICAgICB9LCBmYWxzZSwgXCJMaW50ZXIuc2NvcGUgbXVzdCBiZSBlaXRoZXIgJ2ZpbGUnIG9yICdwcm9qZWN0J1wiLCAxKVxuICAgICAgdmFsaWRhdGVMaW50ZXIoe1xuICAgICAgICBuYW1lOiAnTGludGVyJyxcbiAgICAgICAgc2NvcGU6IHVuZGVmaW5lZCxcbiAgICAgIH0sIGZhbHNlLCBcIkxpbnRlci5zY29wZSBtdXN0IGJlIGVpdGhlciAnZmlsZScgb3IgJ3Byb2plY3QnXCIsIDEpXG4gICAgICB2YWxpZGF0ZUxpbnRlcih7XG4gICAgICAgIG5hbWU6ICdMaW50ZXInLFxuICAgICAgICBzY29wZTogJ3NvbWV0aGluZycsXG4gICAgICB9LCBmYWxzZSwgXCJMaW50ZXIuc2NvcGUgbXVzdCBiZSBlaXRoZXIgJ2ZpbGUnIG9yICdwcm9qZWN0J1wiLCAxKVxuICAgICAgdmFsaWRhdGVMaW50ZXIoe1xuICAgICAgICBuYW1lOiAnTGludGVyJyxcbiAgICAgICAgc2NvcGU6ICdmaWxlaXN0aWMnLFxuICAgICAgfSwgZmFsc2UsIFwiTGludGVyLnNjb3BlIG11c3QgYmUgZWl0aGVyICdmaWxlJyBvciAncHJvamVjdCdcIiwgMSlcbiAgICB9KVxuICAgIGl0KCdjcmllcyBpZiB2IGlzIDEgYW5kIGxpbnRlci5saW50T25GbHkgaXMgbm90IGJvb2xlYW4nLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhbGlkYXRlTGludGVyKHtcbiAgICAgICAgbmFtZTogJ0xpbnRlcicsXG4gICAgICAgIHNjb3BlOiAnZmlsZScsXG4gICAgICAgIGxpbnRPbkZseToge30sXG4gICAgICB9LCBmYWxzZSwgJ0xpbnRlci5saW50T25GbHkgbXVzdCBiZSBhIGJvb2xlYW4nLCAxKVxuICAgICAgdmFsaWRhdGVMaW50ZXIoe1xuICAgICAgICBuYW1lOiAnTGludGVyJyxcbiAgICAgICAgc2NvcGU6ICdmaWxlJyxcbiAgICAgICAgbGludE9uRmx5OiBbXSxcbiAgICAgIH0sIGZhbHNlLCAnTGludGVyLmxpbnRPbkZseSBtdXN0IGJlIGEgYm9vbGVhbicsIDEpXG4gICAgICB2YWxpZGF0ZUxpbnRlcih7XG4gICAgICAgIG5hbWU6ICdMaW50ZXInLFxuICAgICAgICBzY29wZTogJ2ZpbGUnLFxuICAgICAgICBsaW50T25GbHk6ICcnLFxuICAgICAgfSwgZmFsc2UsICdMaW50ZXIubGludE9uRmx5IG11c3QgYmUgYSBib29sZWFuJywgMSlcbiAgICAgIHZhbGlkYXRlTGludGVyKHtcbiAgICAgICAgbmFtZTogJ0xpbnRlcicsXG4gICAgICAgIHNjb3BlOiAnZmlsZScsXG4gICAgICAgIGxpbnRPbkZseSgpIHt9LFxuICAgICAgfSwgZmFsc2UsICdMaW50ZXIubGludE9uRmx5IG11c3QgYmUgYSBib29sZWFuJywgMSlcbiAgICB9KVxuICAgIGl0KCdjcmllcyBpZiB2IGlzIDIgYW5kIGxpbnRlci5saW50c09uQ2hhbmdlIGlzIG5vdCBib29sZWFuJywgZnVuY3Rpb24oKSB7XG4gICAgICB2YWxpZGF0ZUxpbnRlcih7XG4gICAgICAgIG5hbWU6ICdMaW50ZXInLFxuICAgICAgICBzY29wZTogJ2ZpbGUnLFxuICAgICAgICBsaW50c09uQ2hhbmdlOiB7fSxcbiAgICAgIH0sIGZhbHNlLCAnTGludGVyLmxpbnRzT25DaGFuZ2UgbXVzdCBiZSBhIGJvb2xlYW4nLCAyKVxuICAgICAgdmFsaWRhdGVMaW50ZXIoe1xuICAgICAgICBuYW1lOiAnTGludGVyJyxcbiAgICAgICAgc2NvcGU6ICdmaWxlJyxcbiAgICAgICAgbGludHNPbkNoYW5nZTogW10sXG4gICAgICB9LCBmYWxzZSwgJ0xpbnRlci5saW50c09uQ2hhbmdlIG11c3QgYmUgYSBib29sZWFuJywgMilcbiAgICAgIHZhbGlkYXRlTGludGVyKHtcbiAgICAgICAgbmFtZTogJ0xpbnRlcicsXG4gICAgICAgIHNjb3BlOiAnZmlsZScsXG4gICAgICAgIGxpbnRzT25DaGFuZ2U6ICcnLFxuICAgICAgfSwgZmFsc2UsICdMaW50ZXIubGludHNPbkNoYW5nZSBtdXN0IGJlIGEgYm9vbGVhbicsIDIpXG4gICAgICB2YWxpZGF0ZUxpbnRlcih7XG4gICAgICAgIG5hbWU6ICdMaW50ZXInLFxuICAgICAgICBzY29wZTogJ2ZpbGUnLFxuICAgICAgICBsaW50c09uQ2hhbmdlKCkge30sXG4gICAgICB9LCBmYWxzZSwgJ0xpbnRlci5saW50c09uQ2hhbmdlIG11c3QgYmUgYSBib29sZWFuJywgMilcbiAgICB9KVxuICAgIGl0KCdjcmllcyBpZiBsaW50ZXIuZ3JhbW1hclNjb3BlcyBpcyBub3QgYW4gYXJyYXknLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhbGlkYXRlTGludGVyKHtcbiAgICAgICAgbmFtZTogJ0xpbnRlcicsXG4gICAgICAgIHNjb3BlOiAnZmlsZScsXG4gICAgICAgIGxpbnRPbkZseTogZmFsc2UsXG4gICAgICAgIGdyYW1tYXJTY29wZXM6IHVuZGVmaW5lZCxcbiAgICAgIH0sIGZhbHNlLCAnTGludGVyLmdyYW1tYXJTY29wZXMgbXVzdCBiZSBhbiBBcnJheScsIDEpXG4gICAgICB2YWxpZGF0ZUxpbnRlcih7XG4gICAgICAgIG5hbWU6ICdMaW50ZXInLFxuICAgICAgICBzY29wZTogJ2ZpbGUnLFxuICAgICAgICBsaW50T25GbHk6IGZhbHNlLFxuICAgICAgICBncmFtbWFyU2NvcGVzOiBudWxsLFxuICAgICAgfSwgZmFsc2UsICdMaW50ZXIuZ3JhbW1hclNjb3BlcyBtdXN0IGJlIGFuIEFycmF5JywgMSlcbiAgICAgIHZhbGlkYXRlTGludGVyKHtcbiAgICAgICAgbmFtZTogJ0xpbnRlcicsXG4gICAgICAgIHNjb3BlOiAnZmlsZScsXG4gICAgICAgIGxpbnRPbkZseTogZmFsc2UsXG4gICAgICAgIGdyYW1tYXJTY29wZXM6IDUsXG4gICAgICB9LCBmYWxzZSwgJ0xpbnRlci5ncmFtbWFyU2NvcGVzIG11c3QgYmUgYW4gQXJyYXknLCAxKVxuICAgICAgdmFsaWRhdGVMaW50ZXIoe1xuICAgICAgICBuYW1lOiAnTGludGVyJyxcbiAgICAgICAgc2NvcGU6ICdmaWxlJyxcbiAgICAgICAgbGludE9uRmx5OiBmYWxzZSxcbiAgICAgICAgZ3JhbW1hclNjb3BlczogTmFOLFxuICAgICAgfSwgZmFsc2UsICdMaW50ZXIuZ3JhbW1hclNjb3BlcyBtdXN0IGJlIGFuIEFycmF5JywgMSlcbiAgICAgIHZhbGlkYXRlTGludGVyKHtcbiAgICAgICAgbmFtZTogJ0xpbnRlcicsXG4gICAgICAgIHNjb3BlOiAnZmlsZScsXG4gICAgICAgIGxpbnRPbkZseTogZmFsc2UsXG4gICAgICAgIGdyYW1tYXJTY29wZXM6IHt9LFxuICAgICAgfSwgZmFsc2UsICdMaW50ZXIuZ3JhbW1hclNjb3BlcyBtdXN0IGJlIGFuIEFycmF5JywgMSlcbiAgICB9KVxuICAgIGl0KCdjcmllcyBpZiBsaW50ZXIubGludCBpcyBub3QgYSBmdW5jdGlvbicsIGZ1bmN0aW9uKCkge1xuICAgICAgdmFsaWRhdGVMaW50ZXIoe1xuICAgICAgICBuYW1lOiAnTGludGVyJyxcbiAgICAgICAgc2NvcGU6ICdmaWxlJyxcbiAgICAgICAgbGludE9uRmx5OiBmYWxzZSxcbiAgICAgICAgZ3JhbW1hclNjb3BlczogWydzb3VyY2UuanMnXSxcbiAgICAgICAgbGludDogdW5kZWZpbmVkLFxuICAgICAgfSwgZmFsc2UsICdMaW50ZXIubGludCBtdXN0IGJlIGEgZnVuY3Rpb24nLCAxKVxuICAgICAgdmFsaWRhdGVMaW50ZXIoe1xuICAgICAgICBuYW1lOiAnTGludGVyJyxcbiAgICAgICAgc2NvcGU6ICdmaWxlJyxcbiAgICAgICAgbGludE9uRmx5OiBmYWxzZSxcbiAgICAgICAgZ3JhbW1hclNjb3BlczogWydzb3VyY2UuanMnXSxcbiAgICAgICAgbGludDogNSxcbiAgICAgIH0sIGZhbHNlLCAnTGludGVyLmxpbnQgbXVzdCBiZSBhIGZ1bmN0aW9uJywgMSlcbiAgICAgIHZhbGlkYXRlTGludGVyKHtcbiAgICAgICAgbmFtZTogJ0xpbnRlcicsXG4gICAgICAgIHNjb3BlOiAnZmlsZScsXG4gICAgICAgIGxpbnRPbkZseTogZmFsc2UsXG4gICAgICAgIGdyYW1tYXJTY29wZXM6IFsnc291cmNlLmpzJ10sXG4gICAgICAgIGxpbnQ6IE5hTixcbiAgICAgIH0sIGZhbHNlLCAnTGludGVyLmxpbnQgbXVzdCBiZSBhIGZ1bmN0aW9uJywgMSlcbiAgICAgIHZhbGlkYXRlTGludGVyKHtcbiAgICAgICAgbmFtZTogJ0xpbnRlcicsXG4gICAgICAgIHNjb3BlOiAnZmlsZScsXG4gICAgICAgIGxpbnRPbkZseTogZmFsc2UsXG4gICAgICAgIGdyYW1tYXJTY29wZXM6IFsnc291cmNlLmpzJ10sXG4gICAgICAgIGxpbnQ6IHt9LFxuICAgICAgfSwgZmFsc2UsICdMaW50ZXIubGludCBtdXN0IGJlIGEgZnVuY3Rpb24nLCAxKVxuICAgICAgdmFsaWRhdGVMaW50ZXIoe1xuICAgICAgICBuYW1lOiAnTGludGVyJyxcbiAgICAgICAgc2NvcGU6ICdmaWxlJyxcbiAgICAgICAgbGludE9uRmx5OiBmYWxzZSxcbiAgICAgICAgZ3JhbW1hclNjb3BlczogWydzb3VyY2UuanMnXSxcbiAgICAgICAgbGludDogJ3NvbWV0aGluZycsXG4gICAgICB9LCBmYWxzZSwgJ0xpbnRlci5saW50IG11c3QgYmUgYSBmdW5jdGlvbicsIDEpXG4gICAgfSlcbiAgICBpdCgnZG9lcyBub3QgY3J5IGlmIGV2ZXJ5dGhpbmcgaXMgdmFsaWQnLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhbGlkYXRlTGludGVyKHtcbiAgICAgICAgbmFtZTogJ0xpbnRlcicsXG4gICAgICAgIHNjb3BlOiAnZmlsZScsXG4gICAgICAgIGxpbnRPbkZseTogZmFsc2UsXG4gICAgICAgIGdyYW1tYXJTY29wZXM6IFsnc291cmNlLmpzJ10sXG4gICAgICAgIGxpbnQoKSB7IH0sXG4gICAgICB9LCB0cnVlLCAnJywgMSlcbiAgICAgIHZhbGlkYXRlTGludGVyKHtcbiAgICAgICAgbmFtZTogJ0xpbnRlcicsXG4gICAgICAgIHNjb3BlOiAnZmlsZScsXG4gICAgICAgIGxpbnRzT25DaGFuZ2U6IGZhbHNlLFxuICAgICAgICBncmFtbWFyU2NvcGVzOiBbJ3NvdXJjZS5qcyddLFxuICAgICAgICBsaW50KCkgeyB9LFxuICAgICAgfSwgdHJ1ZSwgJycsIDIpXG4gICAgfSlcbiAgfSlcbiAgZGVzY3JpYmUoJzo6aW5kaWUnLCBmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiB2YWxpZGF0ZUluZGllKGxpbnRlcjogYW55LCBleHBlY3RlZFZhbHVlOiBib29sZWFuLCBtZXNzYWdlOiBzdHJpbmcgPSAnJykge1xuICAgICAgZXhwZWN0KFZhbGlkYXRlLmluZGllKGxpbnRlcikpLnRvQmUoZXhwZWN0ZWRWYWx1ZSlcbiAgICAgIGlmICghZXhwZWN0ZWRWYWx1ZSkge1xuICAgICAgICBleHBlY3ROb3RpZmljYXRpb24obWVzc2FnZSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpdCgnY3JpZXMgaWYgcGFyYW1zIGlzIG5vdCBhbiBvYmplY3QnLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhbGlkYXRlSW5kaWUobnVsbCwgZmFsc2UsICdJbmRpZSBtdXN0IGJlIGFuIG9iamVjdCcpXG4gICAgICB2YWxpZGF0ZUluZGllKDUsIGZhbHNlLCAnSW5kaWUgbXVzdCBiZSBhbiBvYmplY3QnKVxuICAgICAgdmFsaWRhdGVJbmRpZShOYU4sIGZhbHNlLCAnSW5kaWUgbXVzdCBiZSBhbiBvYmplY3QnKVxuICAgICAgdmFsaWRhdGVJbmRpZSh1bmRlZmluZWQsIGZhbHNlLCAnSW5kaWUgbXVzdCBiZSBhbiBvYmplY3QnKVxuICAgIH0pXG4gICAgaXQoJ2NyaWVzIGlmIGluZGllLm5hbWUgaXMgbm90IGEgc3RyaW5nJywgZnVuY3Rpb24oKSB7XG4gICAgICB2YWxpZGF0ZUluZGllKHtcbiAgICAgICAgbmFtZTogdW5kZWZpbmVkLFxuICAgICAgfSwgZmFsc2UsICdJbmRpZS5uYW1lIG11c3QgYmUgYSBzdHJpbmcnKVxuICAgICAgdmFsaWRhdGVJbmRpZSh7XG4gICAgICAgIG5hbWU6IDUsXG4gICAgICB9LCBmYWxzZSwgJ0luZGllLm5hbWUgbXVzdCBiZSBhIHN0cmluZycpXG4gICAgICB2YWxpZGF0ZUluZGllKHtcbiAgICAgICAgbmFtZToge30sXG4gICAgICB9LCBmYWxzZSwgJ0luZGllLm5hbWUgbXVzdCBiZSBhIHN0cmluZycpXG4gICAgICB2YWxpZGF0ZUluZGllKHtcbiAgICAgICAgbmFtZTogTmFOLFxuICAgICAgfSwgZmFsc2UsICdJbmRpZS5uYW1lIG11c3QgYmUgYSBzdHJpbmcnKVxuICAgIH0pXG4gICAgaXQoJ2RvZXMgbm90IGNyeSBpZiBldmVyeXRoaW5nIGlzIHZhbGlkJywgZnVuY3Rpb24oKSB7XG4gICAgICB2YWxpZGF0ZUluZGllKHtcbiAgICAgICAgbmFtZTogJ0luZGllJyxcbiAgICAgIH0sIHRydWUpXG4gICAgfSlcbiAgfSlcbiAgZGVzY3JpYmUoJzo6bWVzc2FnZXMnLCBmdW5jdGlvbigpIHtcbiAgICBmdW5jdGlvbiB2YWxpZGF0ZU1lc3NhZ2VzKGxpbnRlcjogYW55LCBleHBlY3RlZFZhbHVlOiBib29sZWFuLCBtZXNzYWdlOiBzdHJpbmcgPSAnJykge1xuICAgICAgZXhwZWN0KFZhbGlkYXRlLm1lc3NhZ2VzKCdTb21lIExpbnRlcicsIGxpbnRlcikpLnRvQmUoZXhwZWN0ZWRWYWx1ZSlcbiAgICAgIGlmICghZXhwZWN0ZWRWYWx1ZSkge1xuICAgICAgICBleHBlY3ROb3RpZmljYXRpb24obWVzc2FnZSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpdCgnY3JpZXMgaWYgcmVzdWx0cyBhcmUgbm90IGFycmF5JywgZnVuY3Rpb24oKSB7XG4gICAgICB2YWxpZGF0ZU1lc3NhZ2VzKHVuZGVmaW5lZCwgZmFsc2UsICdMaW50ZXIgUmVzdWx0IG11c3QgYmUgYW4gQXJyYXknKVxuICAgICAgdmFsaWRhdGVNZXNzYWdlcyh7fSwgZmFsc2UsICdMaW50ZXIgUmVzdWx0IG11c3QgYmUgYW4gQXJyYXknKVxuICAgICAgdmFsaWRhdGVNZXNzYWdlcyg1LCBmYWxzZSwgJ0xpbnRlciBSZXN1bHQgbXVzdCBiZSBhbiBBcnJheScpXG4gICAgICB2YWxpZGF0ZU1lc3NhZ2VzKE5hTiwgZmFsc2UsICdMaW50ZXIgUmVzdWx0IG11c3QgYmUgYW4gQXJyYXknKVxuICAgIH0pXG4gICAgaXQoJ2NyaWVzIGlmIG1lc3NhZ2UuaWNvbiBpcyBwcmVzZW50IGFuZCBpbnZhbGlkJywgZnVuY3Rpb24oKSB7XG4gICAgICB2YWxpZGF0ZU1lc3NhZ2VzKFt7XG4gICAgICAgIGljb246IDUsXG4gICAgICB9XSwgZmFsc2UsICdNZXNzYWdlLmljb24gbXVzdCBiZSBhIHN0cmluZycpXG4gICAgICB2YWxpZGF0ZU1lc3NhZ2VzKFt7XG4gICAgICAgIGljb246IHt9LFxuICAgICAgfV0sIGZhbHNlLCAnTWVzc2FnZS5pY29uIG11c3QgYmUgYSBzdHJpbmcnKVxuICAgICAgdmFsaWRhdGVNZXNzYWdlcyhbe1xuICAgICAgICBpY29uKCkge30sXG4gICAgICB9XSwgZmFsc2UsICdNZXNzYWdlLmljb24gbXVzdCBiZSBhIHN0cmluZycpXG4gICAgfSlcbiAgICBpdCgnY3JpZXMgaWYgbWVzc2FnZS5sb2NhdGlvbiBpcyBpbnZhbGlkJywgZnVuY3Rpb24oKSB7XG4gICAgICB2YWxpZGF0ZU1lc3NhZ2VzKFt7XG4gICAgICAgIGxvY2F0aW9uOiA1LFxuICAgICAgfV0sIGZhbHNlLCAnTWVzc2FnZS5sb2NhdGlvbiBtdXN0IGJlIHZhbGlkJylcbiAgICAgIHZhbGlkYXRlTWVzc2FnZXMoW3tcbiAgICAgICAgbG9jYXRpb246IE5hTixcbiAgICAgIH1dLCBmYWxzZSwgJ01lc3NhZ2UubG9jYXRpb24gbXVzdCBiZSB2YWxpZCcpXG4gICAgICB2YWxpZGF0ZU1lc3NhZ2VzKFt7XG4gICAgICAgIGxvY2F0aW9uOiB7fSxcbiAgICAgIH1dLCBmYWxzZSwgJ01lc3NhZ2UubG9jYXRpb24gbXVzdCBiZSB2YWxpZCcpXG4gICAgICB2YWxpZGF0ZU1lc3NhZ2VzKFt7XG4gICAgICAgIGxvY2F0aW9uOiB7IGZpbGU6IF9fZmlsZW5hbWUgfSxcbiAgICAgIH1dLCBmYWxzZSwgJ01lc3NhZ2UubG9jYXRpb24gbXVzdCBiZSB2YWxpZCcpXG4gICAgICB2YWxpZGF0ZU1lc3NhZ2VzKFt7XG4gICAgICAgIGxvY2F0aW9uOiB7IGZpbGU6IF9fZmlsZW5hbWUsIHBvc2l0aW9uOiA1IH0sXG4gICAgICB9XSwgZmFsc2UsICdNZXNzYWdlLmxvY2F0aW9uIG11c3QgYmUgdmFsaWQnKVxuICAgICAgdmFsaWRhdGVNZXNzYWdlcyhbe1xuICAgICAgICBsb2NhdGlvbjogeyBmaWxlOiBfX2ZpbGVuYW1lLCBwb3NpdGlvbjogbnVsbCB9LFxuICAgICAgfV0sIGZhbHNlLCAnTWVzc2FnZS5sb2NhdGlvbiBtdXN0IGJlIHZhbGlkJylcbiAgICAgIHZhbGlkYXRlTWVzc2FnZXMoW3tcbiAgICAgICAgbG9jYXRpb246IHsgZmlsZTogX19maWxlbmFtZSwgcG9zaXRpb246ICcnIH0sXG4gICAgICB9XSwgZmFsc2UsICdNZXNzYWdlLmxvY2F0aW9uIG11c3QgYmUgdmFsaWQnKVxuICAgICAgdmFsaWRhdGVNZXNzYWdlcyhbe1xuICAgICAgICBsb2NhdGlvbjogeyBmaWxlOiBfX2ZpbGVuYW1lLCBwb3NpdGlvbjogTmFOIH0sXG4gICAgICB9XSwgZmFsc2UsICdNZXNzYWdlLmxvY2F0aW9uIG11c3QgYmUgdmFsaWQnKVxuICAgIH0pXG4gICAgaXQoJ2NyaWVzIGlmIG1lc3NhZ2UubG9jYXRpb24gY29udGFpbnMgTmFOJywgZnVuY3Rpb24oKSB7XG4gICAgICB2YWxpZGF0ZU1lc3NhZ2VzKFt7XG4gICAgICAgIGxvY2F0aW9uOiB7IGZpbGU6IF9fZmlsZW5hbWUsIHBvc2l0aW9uOiBbW05hTiwgTmFOXSwgW05hTiwgTmFOXV0gfSxcbiAgICAgIH1dLCBmYWxzZSwgJ01lc3NhZ2UubG9jYXRpb24ucG9zaXRpb24gc2hvdWxkIG5vdCBjb250YWluIE5hTiBjb29yZGluYXRlcycpXG4gICAgICB2YWxpZGF0ZU1lc3NhZ2VzKFt7XG4gICAgICAgIGxvY2F0aW9uOiB7IGZpbGU6IF9fZmlsZW5hbWUsIHBvc2l0aW9uOiBbWzAsIDBdLCBbMCwgTmFOXV0gfSxcbiAgICAgIH1dLCBmYWxzZSwgJ01lc3NhZ2UubG9jYXRpb24ucG9zaXRpb24gc2hvdWxkIG5vdCBjb250YWluIE5hTiBjb29yZGluYXRlcycpXG4gICAgICB2YWxpZGF0ZU1lc3NhZ2VzKFt7XG4gICAgICAgIGxvY2F0aW9uOiB7IGZpbGU6IF9fZmlsZW5hbWUsIHBvc2l0aW9uOiBbWzAsIDBdLCBbTmFOLCAwXV0gfSxcbiAgICAgIH1dLCBmYWxzZSwgJ01lc3NhZ2UubG9jYXRpb24ucG9zaXRpb24gc2hvdWxkIG5vdCBjb250YWluIE5hTiBjb29yZGluYXRlcycpXG4gICAgICB2YWxpZGF0ZU1lc3NhZ2VzKFt7XG4gICAgICAgIGxvY2F0aW9uOiB7IGZpbGU6IF9fZmlsZW5hbWUsIHBvc2l0aW9uOiBbWzAsIE5hTl0sIFswLCAwXV0gfSxcbiAgICAgIH1dLCBmYWxzZSwgJ01lc3NhZ2UubG9jYXRpb24ucG9zaXRpb24gc2hvdWxkIG5vdCBjb250YWluIE5hTiBjb29yZGluYXRlcycpXG4gICAgICB2YWxpZGF0ZU1lc3NhZ2VzKFt7XG4gICAgICAgIGxvY2F0aW9uOiB7IGZpbGU6IF9fZmlsZW5hbWUsIHBvc2l0aW9uOiBbW05hTiwgMF0sIFswLCAwXV0gfSxcbiAgICAgIH1dLCBmYWxzZSwgJ01lc3NhZ2UubG9jYXRpb24ucG9zaXRpb24gc2hvdWxkIG5vdCBjb250YWluIE5hTiBjb29yZGluYXRlcycpXG4gICAgfSlcbiAgICBpdCgnY3JpZXMgaWYgbWVzc2FnZS5zb2x1dGlvbnMgaXMgcHJlc2VudCBhbmQgaXMgbm90IGFycmF5JywgZnVuY3Rpb24oKSB7XG4gICAgICB2YWxpZGF0ZU1lc3NhZ2VzKFt7XG4gICAgICAgIGxvY2F0aW9uOiB7IGZpbGU6IF9fZmlsZW5hbWUsIHBvc2l0aW9uOiBbWzAsIDBdLCBbMCwgMF1dIH0sXG4gICAgICAgIHNvbHV0aW9uczoge30sXG4gICAgICB9XSwgZmFsc2UsICdNZXNzYWdlLnNvbHV0aW9ucyBtdXN0IGJlIHZhbGlkJylcbiAgICAgIHZhbGlkYXRlTWVzc2FnZXMoW3tcbiAgICAgICAgbG9jYXRpb246IHsgZmlsZTogX19maWxlbmFtZSwgcG9zaXRpb246IFtbMCwgMF0sIFswLCAwXV0gfSxcbiAgICAgICAgc29sdXRpb25zOiAnYXNkc2FkJyxcbiAgICAgIH1dLCBmYWxzZSwgJ01lc3NhZ2Uuc29sdXRpb25zIG11c3QgYmUgdmFsaWQnKVxuICAgICAgdmFsaWRhdGVNZXNzYWdlcyhbe1xuICAgICAgICBsb2NhdGlvbjogeyBmaWxlOiBfX2ZpbGVuYW1lLCBwb3NpdGlvbjogW1swLCAwXSwgWzAsIDBdXSB9LFxuICAgICAgICBzb2x1dGlvbnM6IDUsXG4gICAgICB9XSwgZmFsc2UsICdNZXNzYWdlLnNvbHV0aW9ucyBtdXN0IGJlIHZhbGlkJylcbiAgICB9KVxuICAgIGl0KCdjcmllcyBpZiBtZXNzYWdlLnJlZmVyZW5jZSBpcyBwcmVzZW50IGFuZCBpbnZhbGlkJywgZnVuY3Rpb24oKSB7XG4gICAgICB2YWxpZGF0ZU1lc3NhZ2VzKFt7XG4gICAgICAgIGxvY2F0aW9uOiB7IGZpbGU6IF9fZmlsZW5hbWUsIHBvc2l0aW9uOiBbWzAsIDBdLCBbMCwgMF1dIH0sXG4gICAgICAgIHJlZmVyZW5jZTogNSxcbiAgICAgIH1dLCBmYWxzZSwgJ01lc3NhZ2UucmVmZXJlbmNlIG11c3QgYmUgdmFsaWQnKVxuICAgICAgdmFsaWRhdGVNZXNzYWdlcyhbe1xuICAgICAgICBsb2NhdGlvbjogeyBmaWxlOiBfX2ZpbGVuYW1lLCBwb3NpdGlvbjogW1swLCAwXSwgWzAsIDBdXSB9LFxuICAgICAgICByZWZlcmVuY2U6IHt9LFxuICAgICAgfV0sIGZhbHNlLCAnTWVzc2FnZS5yZWZlcmVuY2UgbXVzdCBiZSB2YWxpZCcpXG4gICAgICB2YWxpZGF0ZU1lc3NhZ2VzKFt7XG4gICAgICAgIGxvY2F0aW9uOiB7IGZpbGU6IF9fZmlsZW5hbWUsIHBvc2l0aW9uOiBbWzAsIDBdLCBbMCwgMF1dIH0sXG4gICAgICAgIHJlZmVyZW5jZTogJ2FzZGFzZCcsXG4gICAgICB9XSwgZmFsc2UsICdNZXNzYWdlLnJlZmVyZW5jZSBtdXN0IGJlIHZhbGlkJylcbiAgICAgIHZhbGlkYXRlTWVzc2FnZXMoW3tcbiAgICAgICAgbG9jYXRpb246IHsgZmlsZTogX19maWxlbmFtZSwgcG9zaXRpb246IFtbMCwgMF0sIFswLCAwXV0gfSxcbiAgICAgICAgcmVmZXJlbmNlOiB7IGZpbGU6IF9fZmlsZW5hbWUgfSxcbiAgICAgIH1dLCBmYWxzZSwgJ01lc3NhZ2UucmVmZXJlbmNlIG11c3QgYmUgdmFsaWQnKVxuICAgICAgdmFsaWRhdGVNZXNzYWdlcyhbe1xuICAgICAgICBsb2NhdGlvbjogeyBmaWxlOiBfX2ZpbGVuYW1lLCBwb3NpdGlvbjogW1swLCAwXSwgWzAsIDBdXSB9LFxuICAgICAgICByZWZlcmVuY2U6IHsgZmlsZTogX19maWxlbmFtZSwgcG9zaXRpb246IDUgfSxcbiAgICAgIH1dLCBmYWxzZSwgJ01lc3NhZ2UucmVmZXJlbmNlIG11c3QgYmUgdmFsaWQnKVxuICAgICAgdmFsaWRhdGVNZXNzYWdlcyhbe1xuICAgICAgICBsb2NhdGlvbjogeyBmaWxlOiBfX2ZpbGVuYW1lLCBwb3NpdGlvbjogW1swLCAwXSwgWzAsIDBdXSB9LFxuICAgICAgICByZWZlcmVuY2U6IHsgZmlsZTogX19maWxlbmFtZSwgcG9zaXRpb246IE5hTiB9LFxuICAgICAgfV0sIGZhbHNlLCAnTWVzc2FnZS5yZWZlcmVuY2UgbXVzdCBiZSB2YWxpZCcpXG4gICAgICB2YWxpZGF0ZU1lc3NhZ2VzKFt7XG4gICAgICAgIGxvY2F0aW9uOiB7IGZpbGU6IF9fZmlsZW5hbWUsIHBvc2l0aW9uOiBbWzAsIDBdLCBbMCwgMF1dIH0sXG4gICAgICAgIHJlZmVyZW5jZTogeyBmaWxlOiBfX2ZpbGVuYW1lLCBwb3NpdGlvbjogbnVsbCB9LFxuICAgICAgfV0sIGZhbHNlLCAnTWVzc2FnZS5yZWZlcmVuY2UgbXVzdCBiZSB2YWxpZCcpXG4gICAgfSlcbiAgICBpdCgnY3JpZXMgaWYgbWVzc2FnZS5yZWZlcmVuY2UgY29udGFpbnMgTmFOJywgZnVuY3Rpb24oKSB7XG4gICAgICB2YWxpZGF0ZU1lc3NhZ2VzKFt7XG4gICAgICAgIGxvY2F0aW9uOiB7IGZpbGU6IF9fZmlsZW5hbWUsIHBvc2l0aW9uOiBbWzAsIDBdLCBbMCwgMF1dIH0sXG4gICAgICAgIHJlZmVyZW5jZTogeyBmaWxlOiBfX2ZpbGVuYW1lLCBwb3NpdGlvbjogW05hTiwgNV0gfSxcbiAgICAgIH1dLCBmYWxzZSwgJ01lc3NhZ2UucmVmZXJlbmNlLnBvc2l0aW9uIHNob3VsZCBub3QgY29udGFpbiBOYU4gY29vcmRpbmF0ZXMnKVxuICAgICAgdmFsaWRhdGVNZXNzYWdlcyhbe1xuICAgICAgICBsb2NhdGlvbjogeyBmaWxlOiBfX2ZpbGVuYW1lLCBwb3NpdGlvbjogW1swLCAwXSwgWzAsIDBdXSB9LFxuICAgICAgICByZWZlcmVuY2U6IHsgZmlsZTogX19maWxlbmFtZSwgcG9zaXRpb246IFs1LCBOYU5dIH0sXG4gICAgICB9XSwgZmFsc2UsICdNZXNzYWdlLnJlZmVyZW5jZS5wb3NpdGlvbiBzaG91bGQgbm90IGNvbnRhaW4gTmFOIGNvb3JkaW5hdGVzJylcbiAgICAgIHZhbGlkYXRlTWVzc2FnZXMoW3tcbiAgICAgICAgbG9jYXRpb246IHsgZmlsZTogX19maWxlbmFtZSwgcG9zaXRpb246IFtbMCwgMF0sIFswLCAwXV0gfSxcbiAgICAgICAgcmVmZXJlbmNlOiB7IGZpbGU6IF9fZmlsZW5hbWUsIHBvc2l0aW9uOiBbTmFOLCBOYU5dIH0sXG4gICAgICB9XSwgZmFsc2UsICdNZXNzYWdlLnJlZmVyZW5jZS5wb3NpdGlvbiBzaG91bGQgbm90IGNvbnRhaW4gTmFOIGNvb3JkaW5hdGVzJylcbiAgICB9KVxuICAgIGl0KCdjcmllcyBpZiBtZXNzYWdlLmV4Y2VycHQgaXMgbm90IHN0cmluZycsIGZ1bmN0aW9uKCkge1xuICAgICAgdmFsaWRhdGVNZXNzYWdlcyhbe1xuICAgICAgICBsb2NhdGlvbjogeyBmaWxlOiBfX2ZpbGVuYW1lLCBwb3NpdGlvbjogW1swLCAwXSwgWzAsIDBdXSB9LFxuICAgICAgICBleGNlcnB0OiB1bmRlZmluZWQsXG4gICAgICB9XSwgZmFsc2UsICdNZXNzYWdlLmV4Y2VycHQgbXVzdCBiZSBhIHN0cmluZycpXG4gICAgICB2YWxpZGF0ZU1lc3NhZ2VzKFt7XG4gICAgICAgIGxvY2F0aW9uOiB7IGZpbGU6IF9fZmlsZW5hbWUsIHBvc2l0aW9uOiBbWzAsIDBdLCBbMCwgMF1dIH0sXG4gICAgICAgIGV4Y2VycHQ6IHt9LFxuICAgICAgfV0sIGZhbHNlLCAnTWVzc2FnZS5leGNlcnB0IG11c3QgYmUgYSBzdHJpbmcnKVxuICAgICAgdmFsaWRhdGVNZXNzYWdlcyhbe1xuICAgICAgICBsb2NhdGlvbjogeyBmaWxlOiBfX2ZpbGVuYW1lLCBwb3NpdGlvbjogW1swLCAwXSwgWzAsIDBdXSB9LFxuICAgICAgICBleGNlcnB0OiBudWxsLFxuICAgICAgfV0sIGZhbHNlLCAnTWVzc2FnZS5leGNlcnB0IG11c3QgYmUgYSBzdHJpbmcnKVxuICAgICAgdmFsaWRhdGVNZXNzYWdlcyhbe1xuICAgICAgICBsb2NhdGlvbjogeyBmaWxlOiBfX2ZpbGVuYW1lLCBwb3NpdGlvbjogW1swLCAwXSwgWzAsIDBdXSB9LFxuICAgICAgICBleGNlcnB0OiBOYU4sXG4gICAgICB9XSwgZmFsc2UsICdNZXNzYWdlLmV4Y2VycHQgbXVzdCBiZSBhIHN0cmluZycpXG4gICAgICB2YWxpZGF0ZU1lc3NhZ2VzKFt7XG4gICAgICAgIGxvY2F0aW9uOiB7IGZpbGU6IF9fZmlsZW5hbWUsIHBvc2l0aW9uOiBbWzAsIDBdLCBbMCwgMF1dIH0sXG4gICAgICAgIGV4Y2VycHQ6IDUsXG4gICAgICB9XSwgZmFsc2UsICdNZXNzYWdlLmV4Y2VycHQgbXVzdCBiZSBhIHN0cmluZycpXG4gICAgfSlcbiAgICBpdCgnY3JpZXMgaWYgbWVzc2FnZS5zZXZlcml0eSBpcyBpbnZhbGlkJywgZnVuY3Rpb24oKSB7XG4gICAgICB2YWxpZGF0ZU1lc3NhZ2VzKFt7XG4gICAgICAgIGxvY2F0aW9uOiB7IGZpbGU6IF9fZmlsZW5hbWUsIHBvc2l0aW9uOiBbWzAsIDBdLCBbMCwgMF1dIH0sXG4gICAgICAgIGV4Y2VycHQ6ICcnLFxuICAgICAgICBzZXZlcml0eTogJycsXG4gICAgICB9XSwgZmFsc2UsIFwiTWVzc2FnZS5zZXZlcml0eSBtdXN0IGJlICdlcnJvcicsICd3YXJuaW5nJyBvciAnaW5mbydcIilcbiAgICAgIHZhbGlkYXRlTWVzc2FnZXMoW3tcbiAgICAgICAgbG9jYXRpb246IHsgZmlsZTogX19maWxlbmFtZSwgcG9zaXRpb246IFtbMCwgMF0sIFswLCAwXV0gfSxcbiAgICAgICAgZXhjZXJwdDogJycsXG4gICAgICAgIHNldmVyaXR5OiBOYU4sXG4gICAgICB9XSwgZmFsc2UsIFwiTWVzc2FnZS5zZXZlcml0eSBtdXN0IGJlICdlcnJvcicsICd3YXJuaW5nJyBvciAnaW5mbydcIilcbiAgICAgIHZhbGlkYXRlTWVzc2FnZXMoW3tcbiAgICAgICAgbG9jYXRpb246IHsgZmlsZTogX19maWxlbmFtZSwgcG9zaXRpb246IFtbMCwgMF0sIFswLCAwXV0gfSxcbiAgICAgICAgZXhjZXJwdDogJycsXG4gICAgICAgIHNldmVyaXR5OiA1LFxuICAgICAgfV0sIGZhbHNlLCBcIk1lc3NhZ2Uuc2V2ZXJpdHkgbXVzdCBiZSAnZXJyb3InLCAnd2FybmluZycgb3IgJ2luZm8nXCIpXG4gICAgICB2YWxpZGF0ZU1lc3NhZ2VzKFt7XG4gICAgICAgIGxvY2F0aW9uOiB7IGZpbGU6IF9fZmlsZW5hbWUsIHBvc2l0aW9uOiBbWzAsIDBdLCBbMCwgMF1dIH0sXG4gICAgICAgIGV4Y2VycHQ6ICcnLFxuICAgICAgICBzZXZlcml0eToge30sXG4gICAgICB9XSwgZmFsc2UsIFwiTWVzc2FnZS5zZXZlcml0eSBtdXN0IGJlICdlcnJvcicsICd3YXJuaW5nJyBvciAnaW5mbydcIilcbiAgICAgIHZhbGlkYXRlTWVzc2FnZXMoW3tcbiAgICAgICAgbG9jYXRpb246IHsgZmlsZTogX19maWxlbmFtZSwgcG9zaXRpb246IFtbMCwgMF0sIFswLCAwXV0gfSxcbiAgICAgICAgZXhjZXJwdDogJycsXG4gICAgICAgIHNldmVyaXR5OiAnZXJyb3Jpc2gnLFxuICAgICAgfV0sIGZhbHNlLCBcIk1lc3NhZ2Uuc2V2ZXJpdHkgbXVzdCBiZSAnZXJyb3InLCAnd2FybmluZycgb3IgJ2luZm8nXCIpXG4gICAgICB2YWxpZGF0ZU1lc3NhZ2VzKFt7XG4gICAgICAgIGxvY2F0aW9uOiB7IGZpbGU6IF9fZmlsZW5hbWUsIHBvc2l0aW9uOiBbWzAsIDBdLCBbMCwgMF1dIH0sXG4gICAgICAgIGV4Y2VycHQ6ICcnLFxuICAgICAgICBzZXZlcml0eTogJ3dhcm5pbmdpc2gnLFxuICAgICAgfV0sIGZhbHNlLCBcIk1lc3NhZ2Uuc2V2ZXJpdHkgbXVzdCBiZSAnZXJyb3InLCAnd2FybmluZycgb3IgJ2luZm8nXCIpXG4gICAgfSlcbiAgICBpdCgnY3JpZXMgaWYgbWVzc2FnZS51cmwgaXMgcHJlc2VudCBhbmQgaXMgbm90IHN0cmluZycsIGZ1bmN0aW9uKCkge1xuICAgICAgdmFsaWRhdGVNZXNzYWdlcyhbe1xuICAgICAgICBsb2NhdGlvbjogeyBmaWxlOiBfX2ZpbGVuYW1lLCBwb3NpdGlvbjogW1swLCAwXSwgWzAsIDBdXSB9LFxuICAgICAgICBleGNlcnB0OiAnJyxcbiAgICAgICAgc2V2ZXJpdHk6ICdlcnJvcicsXG4gICAgICAgIHVybDogNSxcbiAgICAgIH1dLCBmYWxzZSwgJ01lc3NhZ2UudXJsIG11c3QgYmUgYSBzdHJpbmcnKVxuICAgICAgdmFsaWRhdGVNZXNzYWdlcyhbe1xuICAgICAgICBsb2NhdGlvbjogeyBmaWxlOiBfX2ZpbGVuYW1lLCBwb3NpdGlvbjogW1swLCAwXSwgWzAsIDBdXSB9LFxuICAgICAgICBleGNlcnB0OiAnJyxcbiAgICAgICAgc2V2ZXJpdHk6ICdlcnJvcicsXG4gICAgICAgIHVybDoge30sXG4gICAgICB9XSwgZmFsc2UsICdNZXNzYWdlLnVybCBtdXN0IGJlIGEgc3RyaW5nJylcbiAgICB9KVxuICAgIGl0KCdjcmllcyBpZiBtZXNzYWdlLmRlc2NyaXB0aW9uIGlzIHByZXNlbnQgYW5kIGlzIGludmFsaWQnLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhbGlkYXRlTWVzc2FnZXMoW3tcbiAgICAgICAgbG9jYXRpb246IHsgZmlsZTogX19maWxlbmFtZSwgcG9zaXRpb246IFtbMCwgMF0sIFswLCAwXV0gfSxcbiAgICAgICAgZXhjZXJwdDogJycsXG4gICAgICAgIHNldmVyaXR5OiAnZXJyb3InLFxuICAgICAgICBkZXNjcmlwdGlvbjogNSxcbiAgICAgIH1dLCBmYWxzZSwgJ01lc3NhZ2UuZGVzY3JpcHRpb24gbXVzdCBiZSBhIGZ1bmN0aW9uIG9yIHN0cmluZycpXG4gICAgICB2YWxpZGF0ZU1lc3NhZ2VzKFt7XG4gICAgICAgIGxvY2F0aW9uOiB7IGZpbGU6IF9fZmlsZW5hbWUsIHBvc2l0aW9uOiBbWzAsIDBdLCBbMCwgMF1dIH0sXG4gICAgICAgIGV4Y2VycHQ6ICcnLFxuICAgICAgICBzZXZlcml0eTogJ2Vycm9yJyxcbiAgICAgICAgZGVzY3JpcHRpb246IHt9LFxuICAgICAgfV0sIGZhbHNlLCAnTWVzc2FnZS5kZXNjcmlwdGlvbiBtdXN0IGJlIGEgZnVuY3Rpb24gb3Igc3RyaW5nJylcbiAgICB9KVxuICAgIGl0KCdkb2VzIG5vdCBjcnkgaWYgcHJvdmlkZWQgd2l0aCB2YWxpZCB2YWx1ZXMnLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhbGlkYXRlTWVzc2FnZXMoW3tcbiAgICAgICAgbG9jYXRpb246IHsgZmlsZTogX19maWxlbmFtZSwgcG9zaXRpb246IFtbMCwgMF0sIFswLCAwXV0gfSxcbiAgICAgICAgZXhjZXJwdDogJycsXG4gICAgICAgIHNldmVyaXR5OiAnZXJyb3InLFxuICAgICAgfV0sIHRydWUpXG4gICAgICB2YWxpZGF0ZU1lc3NhZ2VzKFt7XG4gICAgICAgIGxvY2F0aW9uOiB7IGZpbGU6IF9fZmlsZW5hbWUsIHBvc2l0aW9uOiBbWzAsIDBdLCBbMCwgMF1dIH0sXG4gICAgICAgIGV4Y2VycHQ6ICcnLFxuICAgICAgICBzZXZlcml0eTogJ2Vycm9yJyxcbiAgICAgICAgc29sdXRpb25zOiBbXSxcbiAgICAgIH1dLCB0cnVlKVxuICAgICAgdmFsaWRhdGVNZXNzYWdlcyhbe1xuICAgICAgICBsb2NhdGlvbjogeyBmaWxlOiBfX2ZpbGVuYW1lLCBwb3NpdGlvbjogW1swLCAwXSwgWzAsIDBdXSB9LFxuICAgICAgICByZWZlcmVuY2U6IHsgZmlsZTogX19maWxlbmFtZSwgcG9zaXRpb246IFswLCAwXSB9LFxuICAgICAgICBleGNlcnB0OiAnJyxcbiAgICAgICAgc2V2ZXJpdHk6ICd3YXJuaW5nJyxcbiAgICAgIH1dLCB0cnVlKVxuICAgICAgdmFsaWRhdGVNZXNzYWdlcyhbe1xuICAgICAgICBsb2NhdGlvbjogeyBmaWxlOiBfX2ZpbGVuYW1lLCBwb3NpdGlvbjogW1swLCAwXSwgWzAsIDBdXSB9LFxuICAgICAgICBleGNlcnB0OiAnJyxcbiAgICAgICAgdXJsOiAnc29tZXRoaW5nJyxcbiAgICAgICAgc2V2ZXJpdHk6ICdpbmZvJyxcbiAgICAgIH1dLCB0cnVlKVxuICAgICAgdmFsaWRhdGVNZXNzYWdlcyhbe1xuICAgICAgICBsb2NhdGlvbjogeyBmaWxlOiBfX2ZpbGVuYW1lLCBwb3NpdGlvbjogW1swLCAwXSwgWzAsIDBdXSB9LFxuICAgICAgICBleGNlcnB0OiAnJyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdzb21ldGhpbmcnLFxuICAgICAgICBzZXZlcml0eTogJ3dhcm5pbmcnLFxuICAgICAgfV0sIHRydWUpXG4gICAgICB2YWxpZGF0ZU1lc3NhZ2VzKFt7XG4gICAgICAgIGxvY2F0aW9uOiB7IGZpbGU6IF9fZmlsZW5hbWUsIHBvc2l0aW9uOiBbWzAsIDBdLCBbMCwgMF1dIH0sXG4gICAgICAgIGV4Y2VycHQ6ICcnLFxuICAgICAgICBkZXNjcmlwdGlvbigpIHsgfSxcbiAgICAgICAgc2V2ZXJpdHk6ICd3YXJuaW5nJyxcbiAgICAgIH1dLCB0cnVlKVxuICAgIH0pXG4gICAgaXQoJ2NyaWVzIGlmIG1lc3NhZ2UubGludGVyTmFtZSBpcyBwcmVzZW50IGFuZCBpcyBpbnZhbGlkJywgZnVuY3Rpb24oKSB7XG4gICAgICB2YWxpZGF0ZU1lc3NhZ2VzKFt7XG4gICAgICAgIGxvY2F0aW9uOiB7IGZpbGU6IF9fZmlsZW5hbWUsIHBvc2l0aW9uOiBbWzAsIDBdLCBbMCwgMF1dIH0sXG4gICAgICAgIGV4Y2VycHQ6ICcnLFxuICAgICAgICBzZXZlcml0eTogJ2Vycm9yJyxcbiAgICAgICAgZGVzY3JpcHRpb246ICcnLFxuICAgICAgICBsaW50ZXJOYW1lOiAxLFxuICAgICAgfV0sIGZhbHNlLCAnTWVzc2FnZS5saW50ZXJOYW1lIG11c3QgYmUgYSBzdHJpbmcnKVxuICAgIH0pXG4gIH0pXG4gIGRlc2NyaWJlKCc6Om1lc3NhZ2VzTGVnYWN5JywgZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gdmFsaWRhdGVNZXNzYWdlc0xlZ2FjeShsaW50ZXI6IGFueSwgZXhwZWN0ZWRWYWx1ZTogYm9vbGVhbiwgbWVzc2FnZTogc3RyaW5nID0gJycpIHtcbiAgICAgIGV4cGVjdChWYWxpZGF0ZS5tZXNzYWdlc0xlZ2FjeSgnU29tZSBMaW50ZXInLCBsaW50ZXIpKS50b0JlKGV4cGVjdGVkVmFsdWUpXG4gICAgICBpZiAoIWV4cGVjdGVkVmFsdWUpIHtcbiAgICAgICAgZXhwZWN0Tm90aWZpY2F0aW9uKG1lc3NhZ2UpXG4gICAgICB9XG4gICAgfVxuXG4gICAgaXQoJ2NyaWVzIGlmIHJlc3VsdHMgYXJlIG5vdCBhcnJheScsIGZ1bmN0aW9uKCkge1xuICAgICAgdmFsaWRhdGVNZXNzYWdlc0xlZ2FjeSh1bmRlZmluZWQsIGZhbHNlLCAnTGludGVyIFJlc3VsdCBtdXN0IGJlIGFuIEFycmF5JylcbiAgICAgIHZhbGlkYXRlTWVzc2FnZXNMZWdhY3koe30sIGZhbHNlLCAnTGludGVyIFJlc3VsdCBtdXN0IGJlIGFuIEFycmF5JylcbiAgICAgIHZhbGlkYXRlTWVzc2FnZXNMZWdhY3koNSwgZmFsc2UsICdMaW50ZXIgUmVzdWx0IG11c3QgYmUgYW4gQXJyYXknKVxuICAgICAgdmFsaWRhdGVNZXNzYWdlc0xlZ2FjeShOYU4sIGZhbHNlLCAnTGludGVyIFJlc3VsdCBtdXN0IGJlIGFuIEFycmF5JylcbiAgICB9KVxuICAgIGl0KCdjcmllcyBpZiBtZXNzYWdlLnR5cGUgaXMgaW52YWxpZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgdmFsaWRhdGVNZXNzYWdlc0xlZ2FjeShbe1xuICAgICAgICB0eXBlOiB1bmRlZmluZWQsXG4gICAgICB9XSwgZmFsc2UsICdNZXNzYWdlLnR5cGUgbXVzdCBiZSBhIHN0cmluZycpXG4gICAgICB2YWxpZGF0ZU1lc3NhZ2VzTGVnYWN5KFt7XG4gICAgICAgIHR5cGU6IE5hTixcbiAgICAgIH1dLCBmYWxzZSwgJ01lc3NhZ2UudHlwZSBtdXN0IGJlIGEgc3RyaW5nJylcbiAgICAgIHZhbGlkYXRlTWVzc2FnZXNMZWdhY3koW3tcbiAgICAgICAgdHlwZTogNSxcbiAgICAgIH1dLCBmYWxzZSwgJ01lc3NhZ2UudHlwZSBtdXN0IGJlIGEgc3RyaW5nJylcbiAgICAgIHZhbGlkYXRlTWVzc2FnZXNMZWdhY3koW3tcbiAgICAgICAgdHlwZTogbnVsbCxcbiAgICAgIH1dLCBmYWxzZSwgJ01lc3NhZ2UudHlwZSBtdXN0IGJlIGEgc3RyaW5nJylcbiAgICB9KVxuICAgIGl0KCdjcmllcyBpZiBtZXNzYWdlLnRleHQgYW5kIG1lc3NhZ2UuaHRtbCBhcmUgaW52YWxpZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgdmFsaWRhdGVNZXNzYWdlc0xlZ2FjeShbe1xuICAgICAgICB0eXBlOiAnRXJyb3InLFxuICAgICAgfV0sIGZhbHNlLCAnTWVzc2FnZS50ZXh0IG9yIE1lc3NhZ2UuaHRtbCBtdXN0IGhhdmUgYSB2YWxpZCB2YWx1ZScpXG4gICAgICB2YWxpZGF0ZU1lc3NhZ2VzTGVnYWN5KFt7XG4gICAgICAgIHR5cGU6ICdFcnJvcicsXG4gICAgICAgIGh0bWw6IHt9LFxuICAgICAgfV0sIGZhbHNlLCAnTWVzc2FnZS50ZXh0IG9yIE1lc3NhZ2UuaHRtbCBtdXN0IGhhdmUgYSB2YWxpZCB2YWx1ZScpXG4gICAgICB2YWxpZGF0ZU1lc3NhZ2VzTGVnYWN5KFt7XG4gICAgICAgIHR5cGU6ICdFcnJvcicsXG4gICAgICAgIGh0bWw6IDUsXG4gICAgICB9XSwgZmFsc2UsICdNZXNzYWdlLnRleHQgb3IgTWVzc2FnZS5odG1sIG11c3QgaGF2ZSBhIHZhbGlkIHZhbHVlJylcbiAgICAgIHZhbGlkYXRlTWVzc2FnZXNMZWdhY3koW3tcbiAgICAgICAgdHlwZTogJ0Vycm9yJyxcbiAgICAgICAgaHRtbDogTmFOLFxuICAgICAgfV0sIGZhbHNlLCAnTWVzc2FnZS50ZXh0IG9yIE1lc3NhZ2UuaHRtbCBtdXN0IGhhdmUgYSB2YWxpZCB2YWx1ZScpXG4gICAgICB2YWxpZGF0ZU1lc3NhZ2VzTGVnYWN5KFt7XG4gICAgICAgIHR5cGU6ICdFcnJvcicsXG4gICAgICAgIHRleHQ6IDUsXG4gICAgICB9XSwgZmFsc2UsICdNZXNzYWdlLnRleHQgb3IgTWVzc2FnZS5odG1sIG11c3QgaGF2ZSBhIHZhbGlkIHZhbHVlJylcbiAgICAgIHZhbGlkYXRlTWVzc2FnZXNMZWdhY3koW3tcbiAgICAgICAgdHlwZTogJ0Vycm9yJyxcbiAgICAgICAgdGV4dDoge30sXG4gICAgICB9XSwgZmFsc2UsICdNZXNzYWdlLnRleHQgb3IgTWVzc2FnZS5odG1sIG11c3QgaGF2ZSBhIHZhbGlkIHZhbHVlJylcbiAgICAgIHZhbGlkYXRlTWVzc2FnZXNMZWdhY3koW3tcbiAgICAgICAgdHlwZTogJ0Vycm9yJyxcbiAgICAgICAgdGV4dDogTmFOLFxuICAgICAgfV0sIGZhbHNlLCAnTWVzc2FnZS50ZXh0IG9yIE1lc3NhZ2UuaHRtbCBtdXN0IGhhdmUgYSB2YWxpZCB2YWx1ZScpXG4gICAgfSlcbiAgICBpdCgnY3JpZXMgaWYgbWVzc2FnZS5maWxlUGF0aCBpcyBwcmVzZW50IGFuZCBpbnZhbGlkJywgZnVuY3Rpb24oKSB7XG4gICAgICB2YWxpZGF0ZU1lc3NhZ2VzTGVnYWN5KFt7XG4gICAgICAgIHR5cGU6ICdFcnJvcicsXG4gICAgICAgIHRleHQ6ICdzb21lJyxcbiAgICAgICAgZmlsZVBhdGg6IDUsXG4gICAgICB9XSwgZmFsc2UsICdNZXNzYWdlLmZpbGVQYXRoIG11c3QgYmUgYSBzdHJpbmcnKVxuICAgICAgdmFsaWRhdGVNZXNzYWdlc0xlZ2FjeShbe1xuICAgICAgICB0eXBlOiAnRXJyb3InLFxuICAgICAgICB0ZXh0OiAnc29tZScsXG4gICAgICAgIGZpbGVQYXRoOiB7fSxcbiAgICAgIH1dLCBmYWxzZSwgJ01lc3NhZ2UuZmlsZVBhdGggbXVzdCBiZSBhIHN0cmluZycpXG4gICAgICB2YWxpZGF0ZU1lc3NhZ2VzTGVnYWN5KFt7XG4gICAgICAgIHR5cGU6ICdFcnJvcicsXG4gICAgICAgIHRleHQ6ICdzb21lJyxcbiAgICAgICAgZmlsZVBhdGgoKSB7IH0sXG4gICAgICB9XSwgZmFsc2UsICdNZXNzYWdlLmZpbGVQYXRoIG11c3QgYmUgYSBzdHJpbmcnKVxuICAgIH0pXG4gICAgaXQoJ2NyaWVzIGlmIG1lc3NhZ2UucmFuZ2UgaXMgcHJlc2VudCBhbmQgaW52YWxpZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgdmFsaWRhdGVNZXNzYWdlc0xlZ2FjeShbe1xuICAgICAgICB0eXBlOiAnRXJyb3InLFxuICAgICAgICB0ZXh0OiAnc29tZScsXG4gICAgICAgIHJhbmdlOiAnc29tZScsXG4gICAgICB9XSwgZmFsc2UsICdNZXNzYWdlLnJhbmdlIG11c3QgYmUgYW4gb2JqZWN0JylcbiAgICAgIHZhbGlkYXRlTWVzc2FnZXNMZWdhY3koW3tcbiAgICAgICAgdHlwZTogJ0Vycm9yJyxcbiAgICAgICAgdGV4dDogJ3NvbWUnLFxuICAgICAgICByYW5nZTogNSxcbiAgICAgIH1dLCBmYWxzZSwgJ01lc3NhZ2UucmFuZ2UgbXVzdCBiZSBhbiBvYmplY3QnKVxuICAgICAgdmFsaWRhdGVNZXNzYWdlc0xlZ2FjeShbe1xuICAgICAgICB0eXBlOiAnRXJyb3InLFxuICAgICAgICB0ZXh0OiAnc29tZScsXG4gICAgICAgIHJhbmdlKCkge30sXG4gICAgICB9XSwgZmFsc2UsICdNZXNzYWdlLnJhbmdlIG11c3QgYmUgYW4gb2JqZWN0JylcbiAgICB9KVxuICAgIGl0KCdjcmllcyBpZiBtZXNzYWdlLnJhbmdlIGhhcyBOYU4gdmFsdWVzJywgZnVuY3Rpb24oKSB7XG4gICAgICB2YWxpZGF0ZU1lc3NhZ2VzTGVnYWN5KFt7XG4gICAgICAgIHR5cGU6ICdFcnJvcicsXG4gICAgICAgIHRleHQ6ICdzb21lJyxcbiAgICAgICAgcmFuZ2U6IFtbTmFOLCBOYU5dLCBbTmFOLCBOYU5dXSxcbiAgICAgIH1dLCBmYWxzZSwgJ01lc3NhZ2UucmFuZ2Ugc2hvdWxkIG5vdCBjb250YWluIE5hTiBjb29yZGluYXRlcycpXG4gICAgICB2YWxpZGF0ZU1lc3NhZ2VzTGVnYWN5KFt7XG4gICAgICAgIHR5cGU6ICdFcnJvcicsXG4gICAgICAgIHRleHQ6ICdzb21lJyxcbiAgICAgICAgcmFuZ2U6IFtbTmFOLCAwXSwgWzAsIDBdXSxcbiAgICAgIH1dLCBmYWxzZSwgJ01lc3NhZ2UucmFuZ2Ugc2hvdWxkIG5vdCBjb250YWluIE5hTiBjb29yZGluYXRlcycpXG4gICAgICB2YWxpZGF0ZU1lc3NhZ2VzTGVnYWN5KFt7XG4gICAgICAgIHR5cGU6ICdFcnJvcicsXG4gICAgICAgIHRleHQ6ICdzb21lJyxcbiAgICAgICAgcmFuZ2U6IFtbMCwgTmFOXSwgWzAsIDBdXSxcbiAgICAgIH1dLCBmYWxzZSwgJ01lc3NhZ2UucmFuZ2Ugc2hvdWxkIG5vdCBjb250YWluIE5hTiBjb29yZGluYXRlcycpXG4gICAgICB2YWxpZGF0ZU1lc3NhZ2VzTGVnYWN5KFt7XG4gICAgICAgIHR5cGU6ICdFcnJvcicsXG4gICAgICAgIHRleHQ6ICdzb21lJyxcbiAgICAgICAgcmFuZ2U6IFtbMCwgMF0sIFtOYU4sIDBdXSxcbiAgICAgIH1dLCBmYWxzZSwgJ01lc3NhZ2UucmFuZ2Ugc2hvdWxkIG5vdCBjb250YWluIE5hTiBjb29yZGluYXRlcycpXG4gICAgICB2YWxpZGF0ZU1lc3NhZ2VzTGVnYWN5KFt7XG4gICAgICAgIHR5cGU6ICdFcnJvcicsXG4gICAgICAgIHRleHQ6ICdzb21lJyxcbiAgICAgICAgcmFuZ2U6IFtbMCwgMF0sIFswLCBOYU5dXSxcbiAgICAgIH1dLCBmYWxzZSwgJ01lc3NhZ2UucmFuZ2Ugc2hvdWxkIG5vdCBjb250YWluIE5hTiBjb29yZGluYXRlcycpXG4gICAgfSlcbiAgICBpdCgnY3JpZXMgaWYgbWVzc2FnZS5jbGFzcyBpcyBwcmVzZW50IGFuZCBpbnZhbGlkJywgZnVuY3Rpb24oKSB7XG4gICAgICB2YWxpZGF0ZU1lc3NhZ2VzTGVnYWN5KFt7XG4gICAgICAgIHR5cGU6ICdFcnJvcicsXG4gICAgICAgIHRleHQ6ICdzb21lJyxcbiAgICAgICAgY2xhc3M6IDUsXG4gICAgICB9XSwgZmFsc2UsICdNZXNzYWdlLmNsYXNzIG11c3QgYmUgYSBzdHJpbmcnKVxuICAgICAgdmFsaWRhdGVNZXNzYWdlc0xlZ2FjeShbe1xuICAgICAgICB0eXBlOiAnRXJyb3InLFxuICAgICAgICB0ZXh0OiAnc29tZScsXG4gICAgICAgIGNsYXNzOiB7fSxcbiAgICAgIH1dLCBmYWxzZSwgJ01lc3NhZ2UuY2xhc3MgbXVzdCBiZSBhIHN0cmluZycpXG4gICAgICB2YWxpZGF0ZU1lc3NhZ2VzTGVnYWN5KFt7XG4gICAgICAgIHR5cGU6ICdFcnJvcicsXG4gICAgICAgIHRleHQ6ICdzb21lJyxcbiAgICAgICAgY2xhc3MoKSB7fSxcbiAgICAgIH1dLCBmYWxzZSwgJ01lc3NhZ2UuY2xhc3MgbXVzdCBiZSBhIHN0cmluZycpXG4gICAgfSlcbiAgICBpdCgnY3JpZXMgaWYgbWVzc2FnZS5zZXZlcml0eSBpcyBwcmVzZW50IGFuZCBpbnZhbGlkJywgZnVuY3Rpb24oKSB7XG4gICAgICB2YWxpZGF0ZU1lc3NhZ2VzTGVnYWN5KFt7XG4gICAgICAgIHR5cGU6ICdFcnJvcicsXG4gICAgICAgIHRleHQ6ICdzb21lJyxcbiAgICAgICAgc2V2ZXJpdHk6IHt9LFxuICAgICAgfV0sIGZhbHNlLCBcIk1lc3NhZ2Uuc2V2ZXJpdHkgbXVzdCBiZSAnZXJyb3InLCAnd2FybmluZycgb3IgJ2luZm8nXCIpXG4gICAgICB2YWxpZGF0ZU1lc3NhZ2VzTGVnYWN5KFt7XG4gICAgICAgIHR5cGU6ICdFcnJvcicsXG4gICAgICAgIHRleHQ6ICdzb21lJyxcbiAgICAgICAgc2V2ZXJpdHk6IFtdLFxuICAgICAgfV0sIGZhbHNlLCBcIk1lc3NhZ2Uuc2V2ZXJpdHkgbXVzdCBiZSAnZXJyb3InLCAnd2FybmluZycgb3IgJ2luZm8nXCIpXG4gICAgICB2YWxpZGF0ZU1lc3NhZ2VzTGVnYWN5KFt7XG4gICAgICAgIHR5cGU6ICdFcnJvcicsXG4gICAgICAgIHRleHQ6ICdzb21lJyxcbiAgICAgICAgc2V2ZXJpdHkoKSB7fSxcbiAgICAgIH1dLCBmYWxzZSwgXCJNZXNzYWdlLnNldmVyaXR5IG11c3QgYmUgJ2Vycm9yJywgJ3dhcm5pbmcnIG9yICdpbmZvJ1wiKVxuICAgICAgdmFsaWRhdGVNZXNzYWdlc0xlZ2FjeShbe1xuICAgICAgICB0eXBlOiAnRXJyb3InLFxuICAgICAgICB0ZXh0OiAnc29tZScsXG4gICAgICAgIHNldmVyaXR5OiAnZXJyb3ItaXNoJyxcbiAgICAgIH1dLCBmYWxzZSwgXCJNZXNzYWdlLnNldmVyaXR5IG11c3QgYmUgJ2Vycm9yJywgJ3dhcm5pbmcnIG9yICdpbmZvJ1wiKVxuICAgIH0pXG4gICAgaXQoJ2NyaWVzIGlmIG1lc3NhZ2UudHJhY2UgaXMgcHJlc2VudCBhbmQgaW52YWxpZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgdmFsaWRhdGVNZXNzYWdlc0xlZ2FjeShbe1xuICAgICAgICB0eXBlOiAnRXJyb3InLFxuICAgICAgICB0ZXh0OiAnc29tZScsXG4gICAgICAgIHRyYWNlOiB7fSxcbiAgICAgIH1dLCBmYWxzZSwgJ01lc3NhZ2UudHJhY2UgbXVzdCBiZSBhbiBBcnJheScpXG4gICAgICB2YWxpZGF0ZU1lc3NhZ2VzTGVnYWN5KFt7XG4gICAgICAgIHR5cGU6ICdFcnJvcicsXG4gICAgICAgIHRleHQ6ICdzb21lJyxcbiAgICAgICAgdHJhY2UoKSB7fSxcbiAgICAgIH1dLCBmYWxzZSwgJ01lc3NhZ2UudHJhY2UgbXVzdCBiZSBhbiBBcnJheScpXG4gICAgICB2YWxpZGF0ZU1lc3NhZ2VzTGVnYWN5KFt7XG4gICAgICAgIHR5cGU6ICdFcnJvcicsXG4gICAgICAgIHRleHQ6ICdzb21lJyxcbiAgICAgICAgdHJhY2U6IDUsXG4gICAgICB9XSwgZmFsc2UsICdNZXNzYWdlLnRyYWNlIG11c3QgYmUgYW4gQXJyYXknKVxuICAgIH0pXG4gICAgaXQoJ2NyaWVzIGlmIG1lc3NhZ2UuZml4IGlzIHByZXNlbnQgYW5kIGludmFsaWQnLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhbGlkYXRlTWVzc2FnZXNMZWdhY3koW3tcbiAgICAgICAgdHlwZTogJ0Vycm9yJyxcbiAgICAgICAgdGV4dDogJ3NvbWUnLFxuICAgICAgICBmaXg6IHt9LFxuICAgICAgfV0sIGZhbHNlLCAnTWVzc2FnZS5maXggbXVzdCBiZSB2YWxpZCcpXG4gICAgICB2YWxpZGF0ZU1lc3NhZ2VzTGVnYWN5KFt7XG4gICAgICAgIHR5cGU6ICdFcnJvcicsXG4gICAgICAgIHRleHQ6ICdzb21lJyxcbiAgICAgICAgZml4OiA1LFxuICAgICAgfV0sIGZhbHNlLCAnTWVzc2FnZS5maXggbXVzdCBiZSB2YWxpZCcpXG4gICAgICB2YWxpZGF0ZU1lc3NhZ2VzTGVnYWN5KFt7XG4gICAgICAgIHR5cGU6ICdFcnJvcicsXG4gICAgICAgIHRleHQ6ICdzb21lJyxcbiAgICAgICAgZml4KCkge30sXG4gICAgICB9XSwgZmFsc2UsICdNZXNzYWdlLmZpeCBtdXN0IGJlIHZhbGlkJylcbiAgICAgIHZhbGlkYXRlTWVzc2FnZXNMZWdhY3koW3tcbiAgICAgICAgdHlwZTogJ0Vycm9yJyxcbiAgICAgICAgdGV4dDogJ3NvbWUnLFxuICAgICAgICBmaXg6IHsgcmFuZ2U6IDUsIG5ld1RleHQ6ICdzb21lJywgb2xkVGV4dDogJ3NvbWUnIH0sXG4gICAgICB9XSwgZmFsc2UsICdNZXNzYWdlLmZpeCBtdXN0IGJlIHZhbGlkJylcbiAgICAgIHZhbGlkYXRlTWVzc2FnZXNMZWdhY3koW3tcbiAgICAgICAgdHlwZTogJ0Vycm9yJyxcbiAgICAgICAgdGV4dDogJ3NvbWUnLFxuICAgICAgICBmaXg6IHsgcmFuZ2U6IE5hTiwgbmV3VGV4dDogJ3NvbWUnLCBvbGRUZXh0OiAnc29tZScgfSxcbiAgICAgIH1dLCBmYWxzZSwgJ01lc3NhZ2UuZml4IG11c3QgYmUgdmFsaWQnKVxuICAgICAgdmFsaWRhdGVNZXNzYWdlc0xlZ2FjeShbe1xuICAgICAgICB0eXBlOiAnRXJyb3InLFxuICAgICAgICB0ZXh0OiAnc29tZScsXG4gICAgICAgIGZpeDogeyByYW5nZTogdW5kZWZpbmVkLCBuZXdUZXh0OiAnc29tZScsIG9sZFRleHQ6ICdzb21lJyB9LFxuICAgICAgfV0sIGZhbHNlLCAnTWVzc2FnZS5maXggbXVzdCBiZSB2YWxpZCcpXG4gICAgICB2YWxpZGF0ZU1lc3NhZ2VzTGVnYWN5KFt7XG4gICAgICAgIHR5cGU6ICdFcnJvcicsXG4gICAgICAgIHRleHQ6ICdzb21lJyxcbiAgICAgICAgZml4OiB7IHJhbmdlOiBbWzAsIDBdLCBbMCwgMF1dLCBuZXdUZXh0OiA1LCBvbGRUZXh0OiAnc29tZScgfSxcbiAgICAgIH1dLCBmYWxzZSwgJ01lc3NhZ2UuZml4IG11c3QgYmUgdmFsaWQnKVxuICAgICAgdmFsaWRhdGVNZXNzYWdlc0xlZ2FjeShbe1xuICAgICAgICB0eXBlOiAnRXJyb3InLFxuICAgICAgICB0ZXh0OiAnc29tZScsXG4gICAgICAgIGZpeDogeyByYW5nZTogW1swLCAwXSwgWzAsIDBdXSwgbmV3VGV4dDoge30sIG9sZFRleHQ6ICdzb21lJyB9LFxuICAgICAgfV0sIGZhbHNlLCAnTWVzc2FnZS5maXggbXVzdCBiZSB2YWxpZCcpXG4gICAgICB2YWxpZGF0ZU1lc3NhZ2VzTGVnYWN5KFt7XG4gICAgICAgIHR5cGU6ICdFcnJvcicsXG4gICAgICAgIHRleHQ6ICdzb21lJyxcbiAgICAgICAgZml4OiB7IHJhbmdlOiBbWzAsIDBdLCBbMCwgMF1dLCBuZXdUZXh0KCkgeyB9LCBvbGRUZXh0OiAnc29tZScgfSxcbiAgICAgIH1dLCBmYWxzZSwgJ01lc3NhZ2UuZml4IG11c3QgYmUgdmFsaWQnKVxuICAgICAgdmFsaWRhdGVNZXNzYWdlc0xlZ2FjeShbe1xuICAgICAgICB0eXBlOiAnRXJyb3InLFxuICAgICAgICB0ZXh0OiAnc29tZScsXG4gICAgICAgIGZpeDogeyByYW5nZTogW1swLCAwXSwgWzAsIDBdXSwgbmV3VGV4dDogJ3NvbWUnLCBvbGRUZXh0OiA1IH0sXG4gICAgICB9XSwgZmFsc2UsICdNZXNzYWdlLmZpeCBtdXN0IGJlIHZhbGlkJylcbiAgICAgIHZhbGlkYXRlTWVzc2FnZXNMZWdhY3koW3tcbiAgICAgICAgdHlwZTogJ0Vycm9yJyxcbiAgICAgICAgdGV4dDogJ3NvbWUnLFxuICAgICAgICBmaXg6IHsgcmFuZ2U6IFtbMCwgMF0sIFswLCAwXV0sIG5ld1RleHQ6ICdzb21lJywgb2xkVGV4dDoge30gfSxcbiAgICAgIH1dLCBmYWxzZSwgJ01lc3NhZ2UuZml4IG11c3QgYmUgdmFsaWQnKVxuICAgICAgdmFsaWRhdGVNZXNzYWdlc0xlZ2FjeShbe1xuICAgICAgICB0eXBlOiAnRXJyb3InLFxuICAgICAgICB0ZXh0OiAnc29tZScsXG4gICAgICAgIGZpeDogeyByYW5nZTogW1swLCAwXSwgWzAsIDBdXSwgbmV3VGV4dDogJ3NvbWUnLCBvbGRUZXh0KCkge30gfSxcbiAgICAgIH1dLCBmYWxzZSwgJ01lc3NhZ2UuZml4IG11c3QgYmUgdmFsaWQnKVxuICAgIH0pXG4gICAgaXQoJ2RvZXMgbm90IGNyeSBpZiB0aGUgb2JqZWN0IGlzIHZhbGlkJywgZnVuY3Rpb24oKSB7XG4gICAgICB2YWxpZGF0ZU1lc3NhZ2VzTGVnYWN5KFt7XG4gICAgICAgIHR5cGU6ICdFcnJvcicsXG4gICAgICAgIHRleHQ6ICdzb21lJyxcbiAgICAgIH1dLCB0cnVlKVxuICAgICAgdmFsaWRhdGVNZXNzYWdlc0xlZ2FjeShbe1xuICAgICAgICB0eXBlOiAnRXJyb3InLFxuICAgICAgICB0ZXh0OiAnc29tZScsXG4gICAgICAgIGZpbGVQYXRoOiAnc29tZScsXG4gICAgICB9XSwgdHJ1ZSlcbiAgICAgIHZhbGlkYXRlTWVzc2FnZXNMZWdhY3koW3tcbiAgICAgICAgdHlwZTogJ0Vycm9yJyxcbiAgICAgICAgdGV4dDogJ3NvbWUnLFxuICAgICAgfV0sIHRydWUpXG4gICAgICB2YWxpZGF0ZU1lc3NhZ2VzTGVnYWN5KFt7XG4gICAgICAgIHR5cGU6ICdFcnJvcicsXG4gICAgICAgIGh0bWw6ICdTb21lJyxcbiAgICAgIH1dLCB0cnVlKVxuICAgICAgdmFsaWRhdGVNZXNzYWdlc0xlZ2FjeShbe1xuICAgICAgICB0eXBlOiAnRXJyb3InLFxuICAgICAgICBodG1sOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSxcbiAgICAgIH1dLCB0cnVlKVxuICAgICAgdmFsaWRhdGVNZXNzYWdlc0xlZ2FjeShbe1xuICAgICAgICB0eXBlOiAnRXJyb3InLFxuICAgICAgICB0ZXh0OiAnc29tZScsXG4gICAgICAgIHJhbmdlOiBbWzAsIDBdLCBbMCwgMF1dLFxuICAgICAgfV0sIHRydWUpXG4gICAgICB2YWxpZGF0ZU1lc3NhZ2VzTGVnYWN5KFt7XG4gICAgICAgIHR5cGU6ICdFcnJvcicsXG4gICAgICAgIHRleHQ6ICdzb21lJyxcbiAgICAgICAgY2xhc3M6ICdzb21lJyxcbiAgICAgIH1dLCB0cnVlKVxuICAgICAgdmFsaWRhdGVNZXNzYWdlc0xlZ2FjeShbe1xuICAgICAgICB0eXBlOiAnRXJyb3InLFxuICAgICAgICB0ZXh0OiAnc29tZScsXG4gICAgICAgIHNldmVyaXR5OiAnZXJyb3InLFxuICAgICAgfV0sIHRydWUpXG4gICAgICB2YWxpZGF0ZU1lc3NhZ2VzTGVnYWN5KFt7XG4gICAgICAgIHR5cGU6ICdFcnJvcicsXG4gICAgICAgIHRleHQ6ICdzb21lJyxcbiAgICAgICAgc2V2ZXJpdHk6ICdpbmZvJyxcbiAgICAgIH1dLCB0cnVlKVxuICAgICAgdmFsaWRhdGVNZXNzYWdlc0xlZ2FjeShbe1xuICAgICAgICB0eXBlOiAnRXJyb3InLFxuICAgICAgICB0ZXh0OiAnc29tZScsXG4gICAgICAgIHNldmVyaXR5OiAnd2FybmluZycsXG4gICAgICB9XSwgdHJ1ZSlcbiAgICAgIHZhbGlkYXRlTWVzc2FnZXNMZWdhY3koW3tcbiAgICAgICAgdHlwZTogJ0Vycm9yJyxcbiAgICAgICAgdGV4dDogJ3NvbWUnLFxuICAgICAgICB0cmFjZTogW10sXG4gICAgICB9XSwgdHJ1ZSlcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==