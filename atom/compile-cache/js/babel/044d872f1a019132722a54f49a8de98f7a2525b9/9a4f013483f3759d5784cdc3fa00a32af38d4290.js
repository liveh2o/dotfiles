'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

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
      var includeLink = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

      this.message = message;
      this.includeLink = includeLink;
      this.scope = 'Project';
      return this;
    }
  }, {
    key: 'updateVisibility',
    value: function updateVisibility(scope) {
      var visibility = scope === 'Line' ? Boolean(this.message.currentLine && this.message.currentFile) : true;
      if (this.scope !== scope) {
        var link = this.querySelector('.linter-message-link span');
        if (link) {
          if (scope === 'Project') {
            link.removeAttribute('hidden');
          } else link.setAttribute('hidden', true);
        }
        this.scope = scope;
      }
      if (visibility !== this.visibility) {
        if (visibility) {
          this.removeAttribute('hidden');
        } else this.setAttribute('hidden', true);
        this.visibility = visibility;
      }
      return this;
    }
  }, {
    key: 'attachedCallback',
    value: function attachedCallback() {
      if (!this.childNodes.length) {
        if (atom.config.get('linter.showProviderName') && this.message.linter) {
          this.appendChild(Message.getName(this.message));
        }
        this.appendChild(Message.getRibbon(this.message));
        this.appendChild(Message.getMessage(this.message, this.includeLink));
      }
    }
  }], [{
    key: 'getLink',
    value: function getLink(message) {
      var el = document.createElement('a');
      var pathEl = document.createElement('span');

      el.className = 'linter-message-link';
      if (message.range) {
        el.textContent = 'at line ' + (message.range.start.row + 1) + ' col ' + (message.range.start.column + 1);
      }
      pathEl.textContent = ' in ' + atom.project.relativizePath(message.filePath)[1];
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
    value: function getMessage(message, includeLink) {
      if (message.multiline || NewLine.test(message.text)) {
        return Message.getMultiLineMessage(message, includeLink);
      }

      var el = document.createElement('span');
      var messageEl = document.createElement('linter-message-line');

      el.className = 'linter-message-item';

      el.appendChild(messageEl);

      if (includeLink && message.filePath) {
        el.appendChild(Message.getLink(message));
      }

      if (message.html && typeof message.html !== 'string') {
        messageEl.appendChild(message.html.cloneNode(true));
      } else if (message.html) {
        messageEl.innerHTML = message.html;
      } else if (message.text) {
        messageEl.textContent = message.text;
      }

      return el;
    }
  }, {
    key: 'getMultiLineMessage',
    value: function getMultiLineMessage(message, includeLink) {
      var container = document.createElement('span');
      var messageEl = document.createElement('linter-multiline-message');

      container.className = 'linter-message-item';
      messageEl.setAttribute('title', message.text);

      message.text.split(NewLine).forEach(function (line, index) {
        if (!line) return;

        var el = document.createElement('linter-message-line');
        el.textContent = line;
        messageEl.appendChild(el);

        // Render the link in the "title" line.
        if (index === 0 && includeLink && message.filePath) {
          messageEl.appendChild(Message.getLink(message));
        }
      });

      container.appendChild(messageEl);

      messageEl.addEventListener('click', function (e) {
        // Avoid opening the message contents when we click the link.
        var link = e.target.tagName === 'A' ? e.target : e.target.parentNode;

        if (!link.classList.contains('linter-message-link')) {
          messageEl.classList.toggle('expanded');
        }
      });

      return container;
    }
  }, {
    key: 'getName',
    value: function getName(message) {
      var el = document.createElement('span');
      el.className = 'linter-message-item badge badge-flexible linter-highlight';
      el.textContent = message.linter;
      return el;
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
    value: function fromMessage(message, includeLink) {
      return new MessageElement().initialize(message, includeLink);
    }
  }]);

  return Message;
})(HTMLElement);

exports.Message = Message;
var MessageElement = document.registerElement('linter-message', {
  prototype: Message.prototype
});
exports.MessageElement = MessageElement;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL3VpL21lc3NhZ2UtZWxlbWVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUE7Ozs7Ozs7Ozs7Ozs7O0FBRVgsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFBOztJQUVWLE9BQU87WUFBUCxPQUFPOztXQUFQLE9BQU87MEJBQVAsT0FBTzs7K0JBQVAsT0FBTzs7O2VBQVAsT0FBTzs7V0FDUixvQkFBQyxPQUFPLEVBQXNCO1VBQXBCLFdBQVcseURBQUcsSUFBSTs7QUFDcEMsVUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUE7QUFDdEIsVUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUE7QUFDOUIsVUFBSSxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUE7QUFDdEIsYUFBTyxJQUFJLENBQUE7S0FDWjs7O1dBQ2UsMEJBQUMsS0FBSyxFQUFFO0FBQ3RCLFVBQU0sVUFBVSxHQUFHLEtBQUssS0FBSyxNQUFNLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLEdBQUcsSUFBSSxDQUFBO0FBQzFHLFVBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxLQUFLLEVBQUU7QUFDeEIsWUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQywyQkFBMkIsQ0FBQyxDQUFBO0FBQzVELFlBQUksSUFBSSxFQUFFO0FBQ1IsY0FBSSxLQUFLLEtBQUssU0FBUyxFQUFFO0FBQ3ZCLGdCQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFBO1dBQy9CLE1BQU0sSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUE7U0FDekM7QUFDRCxZQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQTtPQUNuQjtBQUNELFVBQUksVUFBVSxLQUFLLElBQUksQ0FBQyxVQUFVLEVBQUU7QUFD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QUFBO0FBQzdCLGFBQU8sRUFBRSxDQUFBO0tBQ1Y7OztXQUNpQixxQkFBQyxPQUFPLEVBQUUsV0FBVyxFQUFFO0FBQ3ZDLGFBQU8sSUFBSSxjQUFjLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLFdBQVcsQ0FBQyxDQUFBO0tBQzdEOzs7U0EvSFUsT0FBTztHQUFTLFdBQVc7OztBQWtJakMsSUFBTSxjQUFjLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxnQkFBZ0IsRUFBRTtBQUN2RSxXQUFTLEVBQUUsT0FBTyxDQUFDLFNBQVM7Q0FDN0IsQ0FBQyxDQUFBIiwiZmlsZSI6Ii9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL3VpL21lc3NhZ2UtZWxlbWVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmNvbnN0IE5ld0xpbmUgPSAvXFxyP1xcbi9cblxuZXhwb3J0IGNsYXNzIE1lc3NhZ2UgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG4gIGluaXRpYWxpemUobWVzc2FnZSwgaW5jbHVkZUxpbmsgPSB0cnVlKSB7XG4gICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZVxuICAgIHRoaXMuaW5jbHVkZUxpbmsgPSBpbmNsdWRlTGlua1xuICAgIHRoaXMuc2NvcGUgPSAnUHJvamVjdCdcbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIHVwZGF0ZVZpc2liaWxpdHkoc2NvcGUpIHtcbiAgICBjb25zdCB2aXNpYmlsaXR5ID0gc2NvcGUgPT09ICdMaW5lJyA/IEJvb2xlYW4odGhpcy5tZXNzYWdlLmN1cnJlbnRMaW5lICYmIHRoaXMubWVzc2FnZS5jdXJyZW50RmlsZSkgOiB0cnVlXG4gICAgaWYgKHRoaXMuc2NvcGUgIT09IHNjb3BlKSB7XG4gICAgICBjb25zdCBsaW5rID0gdGhpcy5xdWVyeVNlbGVjdG9yKCcubGludGVyLW1lc3NhZ2UtbGluayBzcGFuJylcbiAgICAgIGlmIChsaW5rKSB7XG4gICAgICAgIGlmIChzY29wZSA9PT0gJ1Byb2plY3QnKSB7XG4gICAgICAgICAgbGluay5yZW1vdmVBdHRyaWJ1dGUoJ2hpZGRlbicpXG4gICAgICAgIH0gZWxzZSBsaW5rLnNldEF0dHJpYnV0ZSgnaGlkZGVuJywgdHJ1ZSlcbiAgICAgIH1cbiAgICAgIHRoaXMuc2NvcGUgPSBzY29wZVxuICAgIH1cbiAgICBpZiAodmlzaWJpbGl0eSAhPT0gdGhpcy52aXNpYmlsaXR5KSB7XG4gICAgICBpZiAodmlzaWJpbGl0eSkge1xuICAgICAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZSgnaGlkZGVuJylcbiAgICAgIH0gZWxzZSB0aGlzLnNldEF0dHJpYnV0ZSgnaGlkZGVuJywgdHJ1ZSlcbiAgICAgIHRoaXMudmlzaWJpbGl0eSA9IHZpc2liaWxpdHlcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBhdHRhY2hlZENhbGxiYWNrKCkge1xuICAgIGlmICghdGhpcy5jaGlsZE5vZGVzLmxlbmd0aCkge1xuICAgICAgaWYgKGF0b20uY29uZmlnLmdldCgnbGludGVyLnNob3dQcm92aWRlck5hbWUnKSAmJiB0aGlzLm1lc3NhZ2UubGludGVyKSB7XG4gICAgICAgIHRoaXMuYXBwZW5kQ2hpbGQoTWVzc2FnZS5nZXROYW1lKHRoaXMubWVzc2FnZSkpXG4gICAgICB9XG4gICAgICB0aGlzLmFwcGVuZENoaWxkKE1lc3NhZ2UuZ2V0UmliYm9uKHRoaXMubWVzc2FnZSkpXG4gICAgICB0aGlzLmFwcGVuZENoaWxkKE1lc3NhZ2UuZ2V0TWVzc2FnZSh0aGlzLm1lc3NhZ2UsIHRoaXMuaW5jbHVkZUxpbmspKVxuICAgIH1cbiAgfVxuICBzdGF0aWMgZ2V0TGluayhtZXNzYWdlKSB7XG4gICAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJylcbiAgICBjb25zdCBwYXRoRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcblxuICAgIGVsLmNsYXNzTmFtZSA9ICdsaW50ZXItbWVzc2FnZS1saW5rJ1xuICAgIGlmIChtZXNzYWdlLnJhbmdlKSB7XG4gICAgICBlbC50ZXh0Q29udGVudCA9IGBhdCBsaW5lICR7bWVzc2FnZS5yYW5nZS5zdGFydC5yb3cgKyAxfSBjb2wgJHttZXNzYWdlLnJhbmdlLnN0YXJ0LmNvbHVtbiArIDF9YFxuICAgIH1cbiAgICBwYXRoRWwudGV4dENvbnRlbnQgPSAnIGluICcgKyBhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgobWVzc2FnZS5maWxlUGF0aClbMV1cbiAgICBlbC5hcHBlbmRDaGlsZChwYXRoRWwpXG4gICAgZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4obWVzc2FnZS5maWxlUGF0aCkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKG1lc3NhZ2UucmFuZ2UpIHtcbiAgICAgICAgICBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCkuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24obWVzc2FnZS5yYW5nZS5zdGFydClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9KVxuICAgIHJldHVybiBlbFxuICB9XG4gIHN0YXRpYyBnZXRNZXNzYWdlKG1lc3NhZ2UsIGluY2x1ZGVMaW5rKSB7XG4gICAgaWYgKG1lc3NhZ2UubXVsdGlsaW5lIHx8IE5ld0xpbmUudGVzdChtZXNzYWdlLnRleHQpKSB7XG4gICAgICByZXR1cm4gTWVzc2FnZS5nZXRNdWx0aUxpbmVNZXNzYWdlKG1lc3NhZ2UsIGluY2x1ZGVMaW5rKVxuICAgIH1cblxuICAgIGNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXG4gICAgY29uc3QgbWVzc2FnZUVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGludGVyLW1lc3NhZ2UtbGluZScpXG5cbiAgICBlbC5jbGFzc05hbWUgPSAnbGludGVyLW1lc3NhZ2UtaXRlbSdcblxuICAgIGVsLmFwcGVuZENoaWxkKG1lc3NhZ2VFbClcblxuICAgIGlmIChpbmNsdWRlTGluayAmJiBtZXNzYWdlLmZpbGVQYXRoKSB7XG4gICAgICBlbC5hcHBlbmRDaGlsZChNZXNzYWdlLmdldExpbmsobWVzc2FnZSkpXG4gICAgfVxuXG4gICAgaWYgKG1lc3NhZ2UuaHRtbCAmJiB0eXBlb2YgbWVzc2FnZS5odG1sICE9PSAnc3RyaW5nJykge1xuICAgICAgbWVzc2FnZUVsLmFwcGVuZENoaWxkKG1lc3NhZ2UuaHRtbC5jbG9uZU5vZGUodHJ1ZSkpXG4gICAgfSBlbHNlIGlmIChtZXNzYWdlLmh0bWwpIHtcbiAgICAgIG1lc3NhZ2VFbC5pbm5lckhUTUwgPSBtZXNzYWdlLmh0bWxcbiAgICB9IGVsc2UgaWYgKG1lc3NhZ2UudGV4dCkge1xuICAgICAgbWVzc2FnZUVsLnRleHRDb250ZW50ID0gbWVzc2FnZS50ZXh0XG4gICAgfVxuXG4gICAgcmV0dXJuIGVsXG4gIH1cbiAgc3RhdGljIGdldE11bHRpTGluZU1lc3NhZ2UobWVzc2FnZSwgaW5jbHVkZUxpbmspIHtcbiAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgICBjb25zdCBtZXNzYWdlRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaW50ZXItbXVsdGlsaW5lLW1lc3NhZ2UnKVxuXG4gICAgY29udGFpbmVyLmNsYXNzTmFtZSA9ICdsaW50ZXItbWVzc2FnZS1pdGVtJ1xuICAgIG1lc3NhZ2VFbC5zZXRBdHRyaWJ1dGUoJ3RpdGxlJywgbWVzc2FnZS50ZXh0KVxuXG4gICAgbWVzc2FnZS50ZXh0LnNwbGl0KE5ld0xpbmUpLmZvckVhY2goZnVuY3Rpb24obGluZSwgaW5kZXgpIHtcbiAgICAgIGlmICghbGluZSkgcmV0dXJuXG5cbiAgICAgIGNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGludGVyLW1lc3NhZ2UtbGluZScpXG4gICAgICBlbC50ZXh0Q29udGVudCA9IGxpbmVcbiAgICAgIG1lc3NhZ2VFbC5hcHBlbmRDaGlsZChlbClcblxuICAgICAgLy8gUmVuZGVyIHRoZSBsaW5rIGluIHRoZSBcInRpdGxlXCIgbGluZS5cbiAgICAgIGlmIChpbmRleCA9PT0gMCAmJiBpbmNsdWRlTGluayAmJiBtZXNzYWdlLmZpbGVQYXRoKSB7XG4gICAgICAgIG1lc3NhZ2VFbC5hcHBlbmRDaGlsZChNZXNzYWdlLmdldExpbmsobWVzc2FnZSkpXG4gICAgICB9XG4gICAgfSlcblxuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChtZXNzYWdlRWwpXG5cbiAgICBtZXNzYWdlRWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgICAvLyBBdm9pZCBvcGVuaW5nIHRoZSBtZXNzYWdlIGNvbnRlbnRzIHdoZW4gd2UgY2xpY2sgdGhlIGxpbmsuXG4gICAgICB2YXIgbGluayA9IGUudGFyZ2V0LnRhZ05hbWUgPT09ICdBJyA/IGUudGFyZ2V0IDogZS50YXJnZXQucGFyZW50Tm9kZVxuXG4gICAgICBpZiAoIWxpbmsuY2xhc3NMaXN0LmNvbnRhaW5zKCdsaW50ZXItbWVzc2FnZS1saW5rJykpIHtcbiAgICAgICAgbWVzc2FnZUVsLmNsYXNzTGlzdC50b2dnbGUoJ2V4cGFuZGVkJylcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgcmV0dXJuIGNvbnRhaW5lclxuICB9XG4gIHN0YXRpYyBnZXROYW1lKG1lc3NhZ2UpIHtcbiAgICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxuICAgIGVsLmNsYXNzTmFtZSA9ICdsaW50ZXItbWVzc2FnZS1pdGVtIGJhZGdlIGJhZGdlLWZsZXhpYmxlIGxpbnRlci1oaWdobGlnaHQnXG4gICAgZWwudGV4dENvbnRlbnQgPSBtZXNzYWdlLmxpbnRlclxuICAgIHJldHVybiBlbFxuICB9XG4gIHN0YXRpYyBnZXRSaWJib24obWVzc2FnZSkge1xuICAgIGNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXG4gICAgZWwuY2xhc3NOYW1lID0gYGxpbnRlci1tZXNzYWdlLWl0ZW0gYmFkZ2UgYmFkZ2UtZmxleGlibGUgbGludGVyLWhpZ2hsaWdodCAke21lc3NhZ2UuY2xhc3N9YFxuICAgIGVsLnRleHRDb250ZW50ID0gbWVzc2FnZS50eXBlXG4gICAgcmV0dXJuIGVsXG4gIH1cbiAgc3RhdGljIGZyb21NZXNzYWdlKG1lc3NhZ2UsIGluY2x1ZGVMaW5rKSB7XG4gICAgcmV0dXJuIG5ldyBNZXNzYWdlRWxlbWVudCgpLmluaXRpYWxpemUobWVzc2FnZSwgaW5jbHVkZUxpbmspXG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IE1lc3NhZ2VFbGVtZW50ID0gZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KCdsaW50ZXItbWVzc2FnZScsIHtcbiAgcHJvdG90eXBlOiBNZXNzYWdlLnByb3RvdHlwZVxufSlcbiJdfQ==
//# sourceURL=/Users/ah/.atom/packages/linter/lib/ui/message-element.js
