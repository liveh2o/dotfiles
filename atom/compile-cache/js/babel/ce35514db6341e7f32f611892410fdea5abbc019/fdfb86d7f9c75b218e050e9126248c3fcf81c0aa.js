var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _sbDebounce = require('sb-debounce');

var _sbDebounce2 = _interopRequireDefault(_sbDebounce);

var _disposableEvent = require('disposable-event');

var _disposableEvent2 = _interopRequireDefault(_disposableEvent);

var _helpers = require('./helpers');

var TreeView = (function () {
  function TreeView() {
    var _this = this;

    _classCallCheck(this, TreeView);

    this.emitter = new _atom.Emitter();
    this.messages = [];
    this.decorations = {};
    this.subscriptions = new _atom.CompositeDisposable();

    this.subscriptions.add(this.emitter);
    this.subscriptions.add(atom.config.observe('linter-ui-default.decorateOnTreeView', function (decorateOnTreeView) {
      if (typeof _this.decorateOnTreeView === 'undefined') {
        _this.decorateOnTreeView = decorateOnTreeView;
      } else if (decorateOnTreeView === 'None') {
        _this.update([]);
        _this.decorateOnTreeView = decorateOnTreeView;
      } else {
        var messages = _this.messages;
        _this.decorateOnTreeView = decorateOnTreeView;
        _this.update(messages);
      }
    }));

    setTimeout(function () {
      var element = TreeView.getElement();
      if (!element) {
        return;
      }
      // Subscription is only added if the CompositeDisposable hasn't been disposed
      _this.subscriptions.add((0, _disposableEvent2['default'])(element, 'click', (0, _sbDebounce2['default'])(function () {
        _this.update();
      })));
    }, 100);
  }

  _createClass(TreeView, [{
    key: 'update',
    value: function update() {
      var givenMessages = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      if (Array.isArray(givenMessages)) {
        this.messages = givenMessages;
      }
      var messages = this.messages;

      var element = TreeView.getElement();
      var decorateOnTreeView = this.decorateOnTreeView;
      if (!element || decorateOnTreeView === 'None') {
        return;
      }

      this.applyDecorations((0, _helpers.calculateDecorations)(decorateOnTreeView, messages));
    }
  }, {
    key: 'applyDecorations',
    value: function applyDecorations(decorations) {
      var treeViewElement = TreeView.getElement();
      if (!treeViewElement) {
        return;
      }

      var elementCache = {};
      var appliedDecorations = {};

      for (var filePath in this.decorations) {
        if (!({}).hasOwnProperty.call(this.decorations, filePath)) {
          continue;
        }
        if (!decorations[filePath]) {
          // Removed
          var element = elementCache[filePath] || (elementCache[filePath] = TreeView.getElementByPath(treeViewElement, filePath));
          if (element) {
            this.removeDecoration(element);
          }
        }
      }

      for (var filePath in decorations) {
        if (!({}).hasOwnProperty.call(decorations, filePath)) {
          continue;
        }
        var element = elementCache[filePath] || (elementCache[filePath] = TreeView.getElementByPath(treeViewElement, filePath));
        if (element) {
          this.handleDecoration(element, !!this.decorations[filePath], decorations[filePath]);
          appliedDecorations[filePath] = decorations[filePath];
        }
      }
      this.decorations = appliedDecorations;
    }
  }, {
    key: 'handleDecoration',
    value: function handleDecoration(element, update, highlights) {
      if (update === undefined) update = false;

      var decoration = undefined;
      if (update) {
        decoration = element.querySelector('linter-decoration');
      }
      if (decoration) {
        decoration.className = '';
      } else {
        decoration = document.createElement('linter-decoration');
        element.appendChild(decoration);
      }
      if (highlights.error) {
        decoration.classList.add('linter-error');
      } else if (highlights.warning) {
        decoration.classList.add('linter-warning');
      } else if (highlights.info) {
        decoration.classList.add('linter-info');
      }
    }
  }, {
    key: 'removeDecoration',
    value: function removeDecoration(element) {
      var decoration = element.querySelector('linter-decoration');
      if (decoration) {
        decoration.remove();
      }
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
    }
  }], [{
    key: 'getElement',
    value: function getElement() {
      return document.querySelector('.tree-view');
    }
  }, {
    key: 'getElementByPath',
    value: function getElementByPath(parent, filePath) {
      return parent.querySelector('[data-path=' + CSS.escape(filePath) + ']');
    }
  }]);

  return TreeView;
})();

module.exports = TreeView;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvdHJlZS12aWV3L2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztvQkFFNkMsTUFBTTs7MEJBQzlCLGFBQWE7Ozs7K0JBQ04sa0JBQWtCOzs7O3VCQUNULFdBQVc7O0lBRzFDLFFBQVE7QUFPRCxXQVBQLFFBQVEsR0FPRTs7OzBCQVBWLFFBQVE7O0FBUVYsUUFBSSxDQUFDLE9BQU8sR0FBRyxtQkFBYSxDQUFBO0FBQzVCLFFBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFBO0FBQ2xCLFFBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFBO0FBQ3JCLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7O0FBRTlDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUNwQyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxzQ0FBc0MsRUFBRSxVQUFDLGtCQUFrQixFQUFLO0FBQ3pHLFVBQUksT0FBTyxNQUFLLGtCQUFrQixLQUFLLFdBQVcsRUFBRTtBQUNsRCxjQUFLLGtCQUFrQixHQUFHLGtCQUFrQixDQUFBO09BQzdDLE1BQU0sSUFBSSxrQkFBa0IsS0FBSyxNQUFNLEVBQUU7QUFDeEMsY0FBSyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUE7QUFDZixjQUFLLGtCQUFrQixHQUFHLGtCQUFrQixDQUFBO09BQzdDLE1BQU07QUFDTCxZQUFNLFFBQVEsR0FBRyxNQUFLLFFBQVEsQ0FBQTtBQUM5QixjQUFLLGtCQUFrQixHQUFHLGtCQUFrQixDQUFBO0FBQzVDLGNBQUssTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFBO09BQ3RCO0tBQ0YsQ0FBQyxDQUFDLENBQUE7O0FBRUgsY0FBVSxDQUFDLFlBQU07QUFDZixVQUFNLE9BQU8sR0FBRyxRQUFR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OztTQXZIRyxRQUFROzs7QUEwSGQsTUFBTSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUEiLCJmaWxlIjoiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2xpbnRlci11aS1kZWZhdWx0L2xpYi90cmVlLXZpZXcvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlLCBFbWl0dGVyIH0gZnJvbSAnYXRvbSdcbmltcG9ydCBkZWJvdW5jZSBmcm9tICdzYi1kZWJvdW5jZSdcbmltcG9ydCBkaXNwb3NhYmxlRXZlbnQgZnJvbSAnZGlzcG9zYWJsZS1ldmVudCdcbmltcG9ydCB7IGNhbGN1bGF0ZURlY29yYXRpb25zIH0gZnJvbSAnLi9oZWxwZXJzJ1xuaW1wb3J0IHR5cGUgeyBMaW50ZXJNZXNzYWdlLCBUcmVlVmlld0hpZ2hsaWdodCB9IGZyb20gJy4uL3R5cGVzJ1xuXG5jbGFzcyBUcmVlVmlldyB7XG4gIGVtaXR0ZXI6IEVtaXR0ZXI7XG4gIG1lc3NhZ2VzOiBBcnJheTxMaW50ZXJNZXNzYWdlPjtcbiAgZGVjb3JhdGlvbnM6IE9iamVjdDtcbiAgc3Vic2NyaXB0aW9uczogQ29tcG9zaXRlRGlzcG9zYWJsZTtcbiAgZGVjb3JhdGVPblRyZWVWaWV3OiAnRmlsZXMgYW5kIERpcmVjdG9yaWVzJyB8ICdGaWxlcycgfCAnTm9uZSc7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXIoKVxuICAgIHRoaXMubWVzc2FnZXMgPSBbXVxuICAgIHRoaXMuZGVjb3JhdGlvbnMgPSB7fVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5lbWl0dGVyKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLXVpLWRlZmF1bHQuZGVjb3JhdGVPblRyZWVWaWV3JywgKGRlY29yYXRlT25UcmVlVmlldykgPT4ge1xuICAgICAgaWYgKHR5cGVvZiB0aGlzLmRlY29yYXRlT25UcmVlVmlldyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgdGhpcy5kZWNvcmF0ZU9uVHJlZVZpZXcgPSBkZWNvcmF0ZU9uVHJlZVZpZXdcbiAgICAgIH0gZWxzZSBpZiAoZGVjb3JhdGVPblRyZWVWaWV3ID09PSAnTm9uZScpIHtcbiAgICAgICAgdGhpcy51cGRhdGUoW10pXG4gICAgICAgIHRoaXMuZGVjb3JhdGVPblRyZWVWaWV3ID0gZGVjb3JhdGVPblRyZWVWaWV3XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBtZXNzYWdlcyA9IHRoaXMubWVzc2FnZXNcbiAgICAgICAgdGhpcy5kZWNvcmF0ZU9uVHJlZVZpZXcgPSBkZWNvcmF0ZU9uVHJlZVZpZXdcbiAgICAgICAgdGhpcy51cGRhdGUobWVzc2FnZXMpXG4gICAgICB9XG4gICAgfSkpXG5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGNvbnN0IGVsZW1lbnQgPSBUcmVlVmlldy5nZXRFbGVtZW50KClcbiAgICAgIGlmICghZWxlbWVudCkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIC8vIFN1YnNjcmlwdGlvbiBpcyBvbmx5IGFkZGVkIGlmIHRoZSBDb21wb3NpdGVEaXNwb3NhYmxlIGhhc24ndCBiZWVuIGRpc3Bvc2VkXG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGRpc3Bvc2FibGVFdmVudChlbGVtZW50LCAnY2xpY2snLCBkZWJvdW5jZSgoKSA9PiB7XG4gICAgICAgIHRoaXMudXBkYXRlKClcbiAgICAgIH0pKSlcbiAgICB9LCAxMDApXG4gIH1cbiAgdXBkYXRlKGdpdmVuTWVzc2FnZXM6ID9BcnJheTxMaW50ZXJNZXNzYWdlPiA9IG51bGwpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShnaXZlbk1lc3NhZ2VzKSkge1xuICAgICAgdGhpcy5tZXNzYWdlcyA9IGdpdmVuTWVzc2FnZXNcbiAgICB9XG4gICAgY29uc3QgbWVzc2FnZXMgPSB0aGlzLm1lc3NhZ2VzXG5cbiAgICBjb25zdCBlbGVtZW50ID0gVHJlZVZpZXcuZ2V0RWxlbWVudCgpXG4gICAgY29uc3QgZGVjb3JhdGVPblRyZWVWaWV3ID0gdGhpcy5kZWNvcmF0ZU9uVHJlZVZpZXdcbiAgICBpZiAoIWVsZW1lbnQgfHwgZGVjb3JhdGVPblRyZWVWaWV3ID09PSAnTm9uZScpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIHRoaXMuYXBwbHlEZWNvcmF0aW9ucyhjYWxjdWxhdGVEZWNvcmF0aW9ucyhkZWNvcmF0ZU9uVHJlZVZpZXcsIG1lc3NhZ2VzKSlcbiAgfVxuICBhcHBseURlY29yYXRpb25zKGRlY29yYXRpb25zOiBPYmplY3QpIHtcbiAgICBjb25zdCB0cmVlVmlld0VsZW1lbnQgPSBUcmVlVmlldy5nZXRFbGVtZW50KClcbiAgICBpZiAoIXRyZWVWaWV3RWxlbWVudCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgY29uc3QgZWxlbWVudENhY2hlID0ge31cbiAgICBjb25zdCBhcHBsaWVkRGVjb3JhdGlvbnMgPSB7fVxuXG4gICAgZm9yIChjb25zdCBmaWxlUGF0aCBpbiB0aGlzLmRlY29yYXRpb25zKSB7XG4gICAgICBpZiAoIXt9Lmhhc093blByb3BlcnR5LmNhbGwodGhpcy5kZWNvcmF0aW9ucywgZmlsZVBhdGgpKSB7XG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG4gICAgICBpZiAoIWRlY29yYXRpb25zW2ZpbGVQYXRoXSkge1xuICAgICAgICAvLyBSZW1vdmVkXG4gICAgICAgIGNvbnN0IGVsZW1lbnQgPSBlbGVtZW50Q2FjaGVbZmlsZVBhdGhdIHx8IChlbGVtZW50Q2FjaGVbZmlsZVBhdGhdID0gVHJlZVZpZXcuZ2V0RWxlbWVudEJ5UGF0aCh0cmVlVmlld0VsZW1lbnQsIGZpbGVQYXRoKSlcbiAgICAgICAgaWYgKGVsZW1lbnQpIHtcbiAgICAgICAgICB0aGlzLnJlbW92ZURlY29yYXRpb24oZWxlbWVudClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAoY29uc3QgZmlsZVBhdGggaW4gZGVjb3JhdGlvbnMpIHtcbiAgICAgIGlmICghe30uaGFzT3duUHJvcGVydHkuY2FsbChkZWNvcmF0aW9ucywgZmlsZVBhdGgpKSB7XG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG4gICAgICBjb25zdCBlbGVtZW50ID0gZWxlbWVudENhY2hlW2ZpbGVQYXRoXSB8fCAoZWxlbWVudENhY2hlW2ZpbGVQYXRoXSA9IFRyZWVWaWV3LmdldEVsZW1lbnRCeVBhdGgodHJlZVZpZXdFbGVtZW50LCBmaWxlUGF0aCkpXG4gICAgICBpZiAoZWxlbWVudCkge1xuICAgICAgICB0aGlzLmhhbmRsZURlY29yYXRpb24oZWxlbWVudCwgISF0aGlzLmRlY29yYXRpb25zW2ZpbGVQYXRoXSwgZGVjb3JhdGlvbnNbZmlsZVBhdGhdKVxuICAgICAgICBhcHBsaWVkRGVjb3JhdGlvbnNbZmlsZVBhdGhdID0gZGVjb3JhdGlvbnNbZmlsZVBhdGhdXG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuZGVjb3JhdGlvbnMgPSBhcHBsaWVkRGVjb3JhdGlvbnNcbiAgfVxuICBoYW5kbGVEZWNvcmF0aW9uKGVsZW1lbnQ6IEhUTUxFbGVtZW50LCB1cGRhdGU6IGJvb2xlYW4gPSBmYWxzZSwgaGlnaGxpZ2h0czogVHJlZVZpZXdIaWdobGlnaHQpIHtcbiAgICBsZXQgZGVjb3JhdGlvblxuICAgIGlmICh1cGRhdGUpIHtcbiAgICAgIGRlY29yYXRpb24gPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2xpbnRlci1kZWNvcmF0aW9uJylcbiAgICB9XG4gICAgaWYgKGRlY29yYXRpb24pIHtcbiAgICAgIGRlY29yYXRpb24uY2xhc3NOYW1lID0gJydcbiAgICB9IGVsc2Uge1xuICAgICAgZGVjb3JhdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpbnRlci1kZWNvcmF0aW9uJylcbiAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoZGVjb3JhdGlvbilcbiAgICB9XG4gICAgaWYgKGhpZ2hsaWdodHMuZXJyb3IpIHtcbiAgICAgIGRlY29yYXRpb24uY2xhc3NMaXN0LmFkZCgnbGludGVyLWVycm9yJylcbiAgICB9IGVsc2UgaWYgKGhpZ2hsaWdodHMud2FybmluZykge1xuICAgICAgZGVjb3JhdGlvbi5jbGFzc0xpc3QuYWRkKCdsaW50ZXItd2FybmluZycpXG4gICAgfSBlbHNlIGlmIChoaWdobGlnaHRzLmluZm8pIHtcbiAgICAgIGRlY29yYXRpb24uY2xhc3NMaXN0LmFkZCgnbGludGVyLWluZm8nKVxuICAgIH1cbiAgfVxuICByZW1vdmVEZWNvcmF0aW9uKGVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XG4gICAgY29uc3QgZGVjb3JhdGlvbiA9IGVsZW1lbnQucXVlcnlTZWxlY3RvcignbGludGVyLWRlY29yYXRpb24nKVxuICAgIGlmIChkZWNvcmF0aW9uKSB7XG4gICAgICBkZWNvcmF0aW9uLnJlbW92ZSgpXG4gICAgfVxuICB9XG4gIGRpc3Bvc2UoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICB9XG4gIHN0YXRpYyBnZXRFbGVtZW50KCkge1xuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudHJlZS12aWV3JylcbiAgfVxuICBzdGF0aWMgZ2V0RWxlbWVudEJ5UGF0aChwYXJlbnQ6IEhUTUxFbGVtZW50LCBmaWxlUGF0aCk6ID9IVE1MRWxlbWVudCB7XG4gICAgcmV0dXJuIHBhcmVudC5xdWVyeVNlbGVjdG9yKGBbZGF0YS1wYXRoPSR7Q1NTLmVzY2FwZShmaWxlUGF0aCl9XWApXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBUcmVlVmlld1xuIl19