(function() {
  var GlobalVimState, StatusBarManager, VimMode, VimState, dispatchKeyboardEvent, dispatchTextEvent, getEditorElement, globalVimState, keydown, mockPlatform, statusBarManager, unmockPlatform, _ref,
    __slice = [].slice;

  VimState = require('../lib/vim-state');

  GlobalVimState = require('../lib/global-vim-state');

  VimMode = require('../lib/vim-mode');

  StatusBarManager = require('../lib/status-bar-manager');

  _ref = [], globalVimState = _ref[0], statusBarManager = _ref[1];

  beforeEach(function() {
    atom.workspace || (atom.workspace = {});
    statusBarManager = null;
    globalVimState = null;
    return spyOn(atom, 'beep');
  });

  getEditorElement = function(callback) {
    var textEditor;
    textEditor = null;
    waitsForPromise(function() {
      return atom.project.open().then(function(e) {
        return textEditor = e;
      });
    });
    return runs(function() {
      var element;
      element = document.createElement("atom-text-editor");
      element.setModel(textEditor);
      element.classList.add('vim-mode');
      if (statusBarManager == null) {
        statusBarManager = new StatusBarManager;
      }
      if (globalVimState == null) {
        globalVimState = new GlobalVimState;
      }
      element.vimState = new VimState(element, statusBarManager, globalVimState);
      element.addEventListener("keydown", function(e) {
        return atom.keymaps.handleKeyboardEvent(e);
      });
      document.createElement('html').appendChild(atom.views.getView(textEditor));
      return callback(element);
    });
  };

  mockPlatform = function(editorElement, platform) {
    var wrapper;
    wrapper = document.createElement('div');
    wrapper.className = platform;
    return wrapper.appendChild(editorElement);
  };

  unmockPlatform = function(editorElement) {
    return editorElement.parentNode.removeChild(editorElement);
  };

  dispatchKeyboardEvent = function() {
    var e, eventArgs, target;
    target = arguments[0], eventArgs = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    e = document.createEvent('KeyboardEvent');
    e.initKeyboardEvent.apply(e, eventArgs);
    if (e.keyCode === 0) {
      Object.defineProperty(e, 'keyCode', {
        get: function() {
          return void 0;
        }
      });
    }
    return target.dispatchEvent(e);
  };

  dispatchTextEvent = function() {
    var e, eventArgs, target;
    target = arguments[0], eventArgs = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    e = document.createEvent('TextEvent');
    e.initTextEvent.apply(e, eventArgs);
    return target.dispatchEvent(e);
  };

  keydown = function(key, _arg) {
    var alt, canceled, ctrl, element, eventArgs, meta, raw, shift, _ref1;
    _ref1 = _arg != null ? _arg : {}, element = _ref1.element, ctrl = _ref1.ctrl, shift = _ref1.shift, alt = _ref1.alt, meta = _ref1.meta, raw = _ref1.raw;
    if (!(key === 'escape' || (raw != null))) {
      key = "U+" + (key.charCodeAt(0).toString(16));
    }
    element || (element = document.activeElement);
    eventArgs = [true, true, null, key, 0, ctrl, alt, shift, meta];
    canceled = !dispatchKeyboardEvent.apply(null, [element, 'keydown'].concat(__slice.call(eventArgs)));
    dispatchKeyboardEvent.apply(null, [element, 'keypress'].concat(__slice.call(eventArgs)));
    if (!canceled) {
      if (dispatchTextEvent.apply(null, [element, 'textInput'].concat(__slice.call(eventArgs)))) {
        element.value += key;
      }
    }
    return dispatchKeyboardEvent.apply(null, [element, 'keyup'].concat(__slice.call(eventArgs)));
  };

  module.exports = {
    keydown: keydown,
    getEditorElement: getEditorElement,
    mockPlatform: mockPlatform,
    unmockPlatform: unmockPlatform
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3ZpbS1tb2RlL3NwZWMvc3BlYy1oZWxwZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDhMQUFBO0lBQUEsa0JBQUE7O0FBQUEsRUFBQSxRQUFBLEdBQVcsT0FBQSxDQUFRLGtCQUFSLENBQVgsQ0FBQTs7QUFBQSxFQUNBLGNBQUEsR0FBaUIsT0FBQSxDQUFRLHlCQUFSLENBRGpCLENBQUE7O0FBQUEsRUFFQSxPQUFBLEdBQVcsT0FBQSxDQUFRLGlCQUFSLENBRlgsQ0FBQTs7QUFBQSxFQUdBLGdCQUFBLEdBQW1CLE9BQUEsQ0FBUSwyQkFBUixDQUhuQixDQUFBOztBQUFBLEVBS0EsT0FBcUMsRUFBckMsRUFBQyx3QkFBRCxFQUFpQiwwQkFMakIsQ0FBQTs7QUFBQSxFQU9BLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxJQUFBLElBQUksQ0FBQyxjQUFMLElBQUksQ0FBQyxZQUFjLEdBQW5CLENBQUE7QUFBQSxJQUNBLGdCQUFBLEdBQW1CLElBRG5CLENBQUE7QUFBQSxJQUVBLGNBQUEsR0FBaUIsSUFGakIsQ0FBQTtXQUdBLEtBQUEsQ0FBTSxJQUFOLEVBQVksTUFBWixFQUpTO0VBQUEsQ0FBWCxDQVBBLENBQUE7O0FBQUEsRUFhQSxnQkFBQSxHQUFtQixTQUFDLFFBQUQsR0FBQTtBQUNqQixRQUFBLFVBQUE7QUFBQSxJQUFBLFVBQUEsR0FBYSxJQUFiLENBQUE7QUFBQSxJQUVBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2FBQ2QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFiLENBQUEsQ0FBbUIsQ0FBQyxJQUFwQixDQUF5QixTQUFDLENBQUQsR0FBQTtlQUN2QixVQUFBLEdBQWEsRUFEVTtNQUFBLENBQXpCLEVBRGM7SUFBQSxDQUFoQixDQUZBLENBQUE7V0FNQSxJQUFB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

//# sourceURL=/Users/ah/.atom/packages/vim-mode/spec/spec-helper.coffee
