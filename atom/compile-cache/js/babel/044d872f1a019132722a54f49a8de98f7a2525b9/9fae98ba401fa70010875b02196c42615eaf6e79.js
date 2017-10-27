'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NewLine = /\r?\n/;

var Message = (function (_HTMLElement) {
  _inherits(Message, _HTMLElement);

  function Message() {
    _classCallCheck(this, Message);

    _get(Object.getPrototypeOf(Message.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Message, [{
    key: 'initialize',
    value: function initialize(message) {
      this.message = message;
      return this;
    }
  }, {
    key: 'updateVisibility',
    value: function updateVisibility(scope) {
      var status = true;
      if (scope === 'Line') status = this.message.currentLine;else if (scope === 'File') status = this.message.currentFile;

      if (this.children.length && this.message.filePath) if (scope === 'Project') this.children[this.children.length - 1].children[0].removeAttribute('hidden');else this.children[this.children.length - 1].children[0].setAttribute('hidden', true);

      if (status) this.removeAttribute('hidden');else this.setAttribute('hidden', true);
    }
  }, {
    key: 'attachedCallback',
    value: function attachedCallback() {
      this.appendChild(Message.getRibbon(this.message));
      this.appendChild(Message.getMessage(this.message));

      if (this.message.filePath) {
        this.appendChild(Message.getLink(this.message));
      }
    }
  }], [{
    key: 'getLink',
    value: function getLink(message) {
      var el = document.createElement('a');
      var pathEl = document.createElement('span');
      var displayFile = message.filePath;

      el.className = 'linter-message-item';

      for (var path of atom.project.getPaths()) {
        if (displayFile.indexOf(path) === 0) {
          displayFile = displayFile.substr(path.length + 1); // Path + Path Separator
          break;
        }
      }if (message.range) {
        el.textContent = 'at line ' + (message.range.start.row + 1) + ' col ' + (message.range.start.column + 1);
      }
      pathEl.textContent = ' in ' + displayFile;
      el.appendChild(pathEl);
      el.addEventListener('click', function () {
        atom.workspace.open(message.filePath).then(function () {
          if (message.range) {
            atom.workspace.getActiveTextEditor().setCursorBufferPosition(message.range.start);
          }
        });
      });
      return el;
    }
  }, {
    key: 'getMessage',
    value: function getMessage(message) {
      var el = document.createElement('span');
      el.className = 'linter-message-item';
      if (message.html && typeof message.html !== 'string') {
        el.appendChild(message.html.cloneNode(true));
      } else if (message.multiline || message.html && message.html.match(NewLine) || message.text && message.text.match(NewLine)) {
        return Message.getMultiLineMessage(message.html || message.text);
      } else {
        if (message.html) {
          el.innerHTML = message.html;
        } else if (message.text) {
          el.textContent = message.text;
        }
      }
      return el;
    }
  }, {
    key: 'getMultiLineMessage',
    value: function getMultiLineMessage(message) {
      var container = document.createElement('linter-multiline-message');
      for (var line of message.split(NewLine)) {
        if (!line) continue;
        var el = document.createElement('linter-message-line');
        el.textContent = line;
        container.appendChild(el);
      }
      return container;
    }
  }, {
    key: 'getRibbon',
    value: function getRibbon(message) {
      var el = document.createElement('span');
      el.className = 'linter-message-item badge badge-flexible linter-highlight ' + message['class'];
      el.textContent = message.type;
      return el;
    }
  }, {
    key: 'fromMessage',
    value: function fromMessage(message) {
      return new MessageElement().initialize(message);
    }
  }]);

  return Message;
})(HTMLElement);

exports.Message = Message;
var MessageElement = document.registerElement('linter-message', {
  prototype: Message.prototype
});
exports.MessageElement = MessageElement;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL3VpL21lc3NhZ2UtZWxlbWVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUE7Ozs7Ozs7Ozs7Ozs7O0FBRVgsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFBOztJQUVWLE9BQU87WUFBUCxPQUFPOztXQUFQLE9BQU87MEJBQVAsT0FBTzs7K0JBQVAsT0FBTzs7O2VBQVAsT0FBTzs7V0FDUixvQkFBQyxPQUFPLEVBQUU7QUFDbEIsVUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUE7QUFDdEIsYUFBTyxJQUFJLENBQUE7S0FDWjs7O1dBQ2UsMEJBQUMsS0FBSyxFQUFFO0FBQ3RCLFVBQUksTUFBTSxHQUFHLElBQUksQ0FBQTtBQUNqQixVQUFJLEtBQUssS0FBSyxNQUFNLEVBQ2xCLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQSxLQUM5QixJQUFJLEtBQUssS0FBSyxNQUFNLEVBQ3ZCLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQTs7QUFFbkMsVUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFDL0MsSUFBSSxLQUFLLEtBQUssU0FBUyxFQUNyQixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUEsS0FDMUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQTs7QUFFdkYsVUFBSSxNQUFNLEVBQ1IsSUFBSSxDQUFDLGVBQWUsQ0FB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Q2hEOzs7U0EvRlUsT0FBTztHQUFTLFdBQVc7OztBQWtHakMsSUFBTSxjQUFjLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxnQkFBZ0IsRUFBRTtBQUN2RSxXQUFTLEVBQUUsT0FBTyxDQUFDLFNBQVM7Q0FDN0IsQ0FBQyxDQUFBIiwiZmlsZSI6Ii9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL3VpL21lc3NhZ2UtZWxlbWVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmNvbnN0IE5ld0xpbmUgPSAvXFxyP1xcbi9cblxuZXhwb3J0IGNsYXNzIE1lc3NhZ2UgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG4gIGluaXRpYWxpemUobWVzc2FnZSkge1xuICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2VcbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIHVwZGF0ZVZpc2liaWxpdHkoc2NvcGUpIHtcbiAgICBsZXQgc3RhdHVzID0gdHJ1ZVxuICAgIGlmIChzY29wZSA9PT0gJ0xpbmUnKVxuICAgICAgc3RhdHVzID0gdGhpcy5tZXNzYWdlLmN1cnJlbnRMaW5lXG4gICAgZWxzZSBpZiAoc2NvcGUgPT09ICdGaWxlJylcbiAgICAgIHN0YXR1cyA9IHRoaXMubWVzc2FnZS5jdXJyZW50RmlsZVxuXG4gICAgaWYgKHRoaXMuY2hpbGRyZW4ubGVuZ3RoICYmIHRoaXMubWVzc2FnZS5maWxlUGF0aClcbiAgICAgIGlmIChzY29wZSA9PT0gJ1Byb2plY3QnKVxuICAgICAgICB0aGlzLmNoaWxkcmVuW3RoaXMuY2hpbGRyZW4ubGVuZ3RoIC0gMV0uY2hpbGRyZW5bMF0ucmVtb3ZlQXR0cmlidXRlKCdoaWRkZW4nKVxuICAgICAgZWxzZSB0aGlzLmNoaWxkcmVuW3RoaXMuY2hpbGRyZW4ubGVuZ3RoIC0gMV0uY2hpbGRyZW5bMF0uc2V0QXR0cmlidXRlKCdoaWRkZW4nLCB0cnVlKVxuXG4gICAgaWYgKHN0YXR1cylcbiAgICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKCdoaWRkZW4nKVxuICAgIGVsc2VcbiAgICAgIHRoaXMuc2V0QXR0cmlidXRlKCdoaWRkZW4nLCB0cnVlKVxuICB9XG4gIGF0dGFjaGVkQ2FsbGJhY2soKSB7XG4gICAgdGhpcy5hcHBlbmRDaGlsZChNZXNzYWdlLmdldFJpYmJvbih0aGlzLm1lc3NhZ2UpKVxuICAgIHRoaXMuYXBwZW5kQ2hpbGQoTWVzc2FnZS5nZXRNZXNzYWdlKHRoaXMubWVzc2FnZSkpXG5cbiAgICBpZiAodGhpcy5tZXNzYWdlLmZpbGVQYXRoKSB7XG4gICAgICB0aGlzLmFwcGVuZENoaWxkKE1lc3NhZ2UuZ2V0TGluayh0aGlzLm1lc3NhZ2UpKVxuICAgIH1cbiAgfVxuICBzdGF0aWMgZ2V0TGluayhtZXNzYWdlKSB7XG4gICAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJylcbiAgICBjb25zdCBwYXRoRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgICBsZXQgZGlzcGxheUZpbGUgPSBtZXNzYWdlLmZpbGVQYXRoXG5cbiAgICBlbC5jbGFzc05hbWUgPSAnbGludGVyLW1lc3NhZ2UtaXRlbSdcblxuICAgIGZvciAobGV0IHBhdGggb2YgYXRvbS5wcm9qZWN0LmdldFBhdGhzKCkpXG4gICAgICBpZiAoZGlzcGxheUZpbGUuaW5kZXhPZihwYXRoKSA9PT0gMCkge1xuICAgICAgICBkaXNwbGF5RmlsZSA9IGRpc3BsYXlGaWxlLnN1YnN0cihwYXRoLmxlbmd0aCArIDEpIC8vIFBhdGggKyBQYXRoIFNlcGFyYXRvclxuICAgICAgICBicmVha1xuICAgICAgfVxuXG4gICAgaWYgKG1lc3NhZ2UucmFuZ2UpIHtcbiAgICAgIGVsLnRleHRDb250ZW50ID0gYGF0IGxpbmUgJHttZXNzYWdlLnJhbmdlLnN0YXJ0LnJvdyArIDF9IGNvbCAke21lc3NhZ2UucmFuZ2Uuc3RhcnQuY29sdW1uICsgMX1gXG4gICAgfVxuICAgIHBhdGhFbC50ZXh0Q29udGVudCA9ICcgaW4gJyArIGRpc3BsYXlGaWxlXG4gICAgZWwuYXBwZW5kQ2hpbGQocGF0aEVsKVxuICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKG1lc3NhZ2UuZmlsZVBhdGgpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChtZXNzYWdlLnJhbmdlKSB7XG4gICAgICAgICAgYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKG1lc3NhZ2UucmFuZ2Uuc3RhcnQpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSlcbiAgICByZXR1cm4gZWxcbiAgfVxuICBzdGF0aWMgZ2V0TWVzc2FnZShtZXNzYWdlKSB7XG4gICAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgICBlbC5jbGFzc05hbWUgPSAnbGludGVyLW1lc3NhZ2UtaXRlbSdcbiAgICBpZiAobWVzc2FnZS5odG1sICYmIHR5cGVvZiBtZXNzYWdlLmh0bWwgIT09ICdzdHJpbmcnKSB7XG4gICAgICBlbC5hcHBlbmRDaGlsZChtZXNzYWdlLmh0bWwuY2xvbmVOb2RlKHRydWUpKVxuICAgIH0gZWxzZSBpZiAoXG4gICAgICBtZXNzYWdlLm11bHRpbGluZSB8fFxuICAgICAgKG1lc3NhZ2UuaHRtbCAmJiBtZXNzYWdlLmh0bWwubWF0Y2goTmV3TGluZSkpIHx8XG4gICAgICAobWVzc2FnZS50ZXh0ICYmIG1lc3NhZ2UudGV4dC5tYXRjaChOZXdMaW5lKSlcbiAgICApIHtcbiAgICAgIHJldHVybiBNZXNzYWdlLmdldE11bHRpTGluZU1lc3NhZ2UobWVzc2FnZS5odG1sIHx8IG1lc3NhZ2UudGV4dClcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKG1lc3NhZ2UuaHRtbCkge1xuICAgICAgICBlbC5pbm5lckhUTUwgPSBtZXNzYWdlLmh0bWxcbiAgICAgIH0gZWxzZSBpZiAobWVzc2FnZS50ZXh0KSB7XG4gICAgICAgIGVsLnRleHRDb250ZW50ID0gbWVzc2FnZS50ZXh0XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBlbFxuICB9XG4gIHN0YXRpYyBnZXRNdWx0aUxpbmVNZXNzYWdlKG1lc3NhZ2UpIHtcbiAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaW50ZXItbXVsdGlsaW5lLW1lc3NhZ2UnKVxuICAgIGZvciAobGV0IGxpbmUgb2YgbWVzc2FnZS5zcGxpdChOZXdMaW5lKSkge1xuICAgICAgaWYgKCFsaW5lKSBjb250aW51ZVxuICAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaW50ZXItbWVzc2FnZS1saW5lJylcbiAgICAgIGVsLnRleHRDb250ZW50ID0gbGluZVxuICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGVsKVxuICAgIH1cbiAgICByZXR1cm4gY29udGFpbmVyXG4gIH1cbiAgc3RhdGljIGdldFJpYmJvbihtZXNzYWdlKSB7XG4gICAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgICBlbC5jbGFzc05hbWUgPSBgbGludGVyLW1lc3NhZ2UtaXRlbSBiYWRnZSBiYWRnZS1mbGV4aWJsZSBsaW50ZXItaGlnaGxpZ2h0ICR7bWVzc2FnZS5jbGFzc31gXG4gICAgZWwudGV4dENvbnRlbnQgPSBtZXNzYWdlLnR5cGVcbiAgICByZXR1cm4gZWxcbiAgfVxuICBzdGF0aWMgZnJvbU1lc3NhZ2UobWVzc2FnZSkge1xuICAgIHJldHVybiBuZXcgTWVzc2FnZUVsZW1lbnQoKS5pbml0aWFsaXplKG1lc3NhZ2UpXG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IE1lc3NhZ2VFbGVtZW50ID0gZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KCdsaW50ZXItbWVzc2FnZScsIHtcbiAgcHJvdG90eXBlOiBNZXNzYWdlLnByb3RvdHlwZVxufSlcbiJdfQ==
//# sourceURL=/Users/ah/.atom/packages/linter/lib/ui/message-element.js
