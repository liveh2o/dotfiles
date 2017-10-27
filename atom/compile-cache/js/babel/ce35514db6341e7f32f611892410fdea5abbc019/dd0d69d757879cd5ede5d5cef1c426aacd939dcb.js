Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _sbEventKit = require('sb-event-kit');

var _sbDebounce = require('sb-debounce');

var _sbDebounce2 = _interopRequireDefault(_sbDebounce);

var _disposableEvent = require('disposable-event');

var _disposableEvent2 = _interopRequireDefault(_disposableEvent);

var _helpers = require('./helpers');

var TreeView = (function () {
  function TreeView() {
    var _this = this;

    _classCallCheck(this, TreeView);

    this.emitter = new _sbEventKit.Emitter();
    this.messages = [];
    this.decorations = {};
    this.subscriptions = new _sbEventKit.CompositeDisposable();

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
      if (_this.subscriptions.disposed || !element) {
        return;
      }
      _this.subscriptions.add((0, _disposableEvent2['default'])(element, 'click', (0, _sbDebounce2['default'])(function () {
        _this.update();
      })));
    }, 100);
  }

  _createClass(TreeView, [{
    key: 'update',
    value: function update() {
      var givenMessages = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      var messages = undefined;
      if (Array.isArray(givenMessages)) {
        messages = this.messages = givenMessages;
      } else {
        messages = this.messages;
      }

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

exports['default'] = TreeView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvdHJlZS12aWV3L2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7MEJBRTZDLGNBQWM7OzBCQUN0QyxhQUFhOzs7OytCQUNOLGtCQUFrQjs7Ozt1QkFDVCxXQUFXOztJQUczQixRQUFRO0FBT2hCLFdBUFEsUUFBUSxHQU9iOzs7MEJBUEssUUFBUTs7QUFRekIsUUFBSSxDQUFDLE9BQU8sR0FBRyx5QkFBYSxDQUFBO0FBQzVCLFFBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFBO0FBQ2xCLFFBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFBO0FBQ3JCLFFBQUksQ0FBQyxhQUFhLEdBQUcscUNBQXlCLENBQUE7O0FBRTlDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUNwQyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxzQ0FBc0MsRUFBRSxVQUFDLGtCQUFrQixFQUFLO0FBQ3pHLFVBQUksT0FBTyxNQUFLLGtCQUFrQixLQUFLLFdBQVcsRUFBRTtBQUNsRCxjQUFLLGtCQUFrQixHQUFHLGtCQUFrQixDQUFBO09BQzdDLE1BQU0sSUFBSSxrQkFBa0IsS0FBSyxNQUFNLEVBQUU7QUFDeEMsY0FBSyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUE7QUFDZixjQUFLLGtCQUFrQixHQUFHLGtCQUFrQixDQUFBO09BQzdDLE1BQU07QUFDTCxZQUFNLFFBQVEsR0FBRyxNQUFLLFFBQVEsQ0FBQTtBQUM5QixjQUFLLGtCQUFrQixHQUFHLGtCQUFrQixDQUFBO0FBQzVDLGNBQUssTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFBO09BQ3RCO0tBQ0YsQ0FBQyxDQUFDLENBQUE7O0FBRUgsY0FBVSxDQUFDLFlBQU07QUFDZixVQUFNLE9BQU8sR0FB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bkUsYUFBTyxNQUFNLENBQUMsYUFBYSxpQkFBZSxHQUFHLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFJLENBQUE7S0FDbkU7OztTQXhIa0IsUUFBUTs7O3FCQUFSLFFBQVEiLCJmaWxlIjoiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2xpbnRlci11aS1kZWZhdWx0L2xpYi90cmVlLXZpZXcvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlLCBFbWl0dGVyIH0gZnJvbSAnc2ItZXZlbnQta2l0J1xuaW1wb3J0IGRlYm91bmNlIGZyb20gJ3NiLWRlYm91bmNlJ1xuaW1wb3J0IGRpc3Bvc2FibGVFdmVudCBmcm9tICdkaXNwb3NhYmxlLWV2ZW50J1xuaW1wb3J0IHsgY2FsY3VsYXRlRGVjb3JhdGlvbnMgfSBmcm9tICcuL2hlbHBlcnMnXG5pbXBvcnQgdHlwZSB7IExpbnRlck1lc3NhZ2UsIFRyZWVWaWV3SGlnaGxpZ2h0IH0gZnJvbSAnLi4vdHlwZXMnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRyZWVWaWV3IHtcbiAgZW1pdHRlcjogRW1pdHRlcjtcbiAgbWVzc2FnZXM6IEFycmF5PExpbnRlck1lc3NhZ2U+O1xuICBkZWNvcmF0aW9uczogT2JqZWN0O1xuICBzdWJzY3JpcHRpb25zOiBDb21wb3NpdGVEaXNwb3NhYmxlO1xuICBkZWNvcmF0ZU9uVHJlZVZpZXc6ICdGaWxlcyBhbmQgRGlyZWN0b3JpZXMnIHwgJ0ZpbGVzJyB8ICdOb25lJztcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpXG4gICAgdGhpcy5tZXNzYWdlcyA9IFtdXG4gICAgdGhpcy5kZWNvcmF0aW9ucyA9IHt9XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLmVtaXR0ZXIpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItdWktZGVmYXVsdC5kZWNvcmF0ZU9uVHJlZVZpZXcnLCAoZGVjb3JhdGVPblRyZWVWaWV3KSA9PiB7XG4gICAgICBpZiAodHlwZW9mIHRoaXMuZGVjb3JhdGVPblRyZWVWaWV3ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICB0aGlzLmRlY29yYXRlT25UcmVlVmlldyA9IGRlY29yYXRlT25UcmVlVmlld1xuICAgICAgfSBlbHNlIGlmIChkZWNvcmF0ZU9uVHJlZVZpZXcgPT09ICdOb25lJykge1xuICAgICAgICB0aGlzLnVwZGF0ZShbXSlcbiAgICAgICAgdGhpcy5kZWNvcmF0ZU9uVHJlZVZpZXcgPSBkZWNvcmF0ZU9uVHJlZVZpZXdcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IG1lc3NhZ2VzID0gdGhpcy5tZXNzYWdlc1xuICAgICAgICB0aGlzLmRlY29yYXRlT25UcmVlVmlldyA9IGRlY29yYXRlT25UcmVlVmlld1xuICAgICAgICB0aGlzLnVwZGF0ZShtZXNzYWdlcylcbiAgICAgIH1cbiAgICB9KSlcblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgY29uc3QgZWxlbWVudCA9IFRyZWVWaWV3LmdldEVsZW1lbnQoKVxuICAgICAgaWYgKHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlZCB8fCAhZWxlbWVudCkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoZGlzcG9zYWJsZUV2ZW50KGVsZW1lbnQsICdjbGljaycsIGRlYm91bmNlKCgpID0+IHtcbiAgICAgICAgdGhpcy51cGRhdGUoKVxuICAgICAgfSkpKVxuICAgIH0sIDEwMClcbiAgfVxuICB1cGRhdGUoZ2l2ZW5NZXNzYWdlczogP0FycmF5PExpbnRlck1lc3NhZ2U+ID0gbnVsbCkge1xuICAgIGxldCBtZXNzYWdlc1xuICAgIGlmIChBcnJheS5pc0FycmF5KGdpdmVuTWVzc2FnZXMpKSB7XG4gICAgICBtZXNzYWdlcyA9IHRoaXMubWVzc2FnZXMgPSBnaXZlbk1lc3NhZ2VzXG4gICAgfSBlbHNlIHtcbiAgICAgIG1lc3NhZ2VzID0gdGhpcy5tZXNzYWdlc1xuICAgIH1cblxuICAgIGNvbnN0IGVsZW1lbnQgPSBUcmVlVmlldy5nZXRFbGVtZW50KClcbiAgICBjb25zdCBkZWNvcmF0ZU9uVHJlZVZpZXcgPSB0aGlzLmRlY29yYXRlT25UcmVlVmlld1xuICAgIGlmICghZWxlbWVudCB8fCBkZWNvcmF0ZU9uVHJlZVZpZXcgPT09ICdOb25lJykge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgdGhpcy5hcHBseURlY29yYXRpb25zKGNhbGN1bGF0ZURlY29yYXRpb25zKGRlY29yYXRlT25UcmVlVmlldywgbWVzc2FnZXMpKVxuICB9XG4gIGFwcGx5RGVjb3JhdGlvbnMoZGVjb3JhdGlvbnM6IE9iamVjdCkge1xuICAgIGNvbnN0IHRyZWVWaWV3RWxlbWVudCA9IFRyZWVWaWV3LmdldEVsZW1lbnQoKVxuICAgIGlmICghdHJlZVZpZXdFbGVtZW50KSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBjb25zdCBlbGVtZW50Q2FjaGUgPSB7fVxuICAgIGNvbnN0IGFwcGxpZWREZWNvcmF0aW9ucyA9IHt9XG5cbiAgICBmb3IgKGNvbnN0IGZpbGVQYXRoIGluIHRoaXMuZGVjb3JhdGlvbnMpIHtcbiAgICAgIGlmICghe30uaGFzT3duUHJvcGVydHkuY2FsbCh0aGlzLmRlY29yYXRpb25zLCBmaWxlUGF0aCkpIHtcbiAgICAgICAgY29udGludWVcbiAgICAgIH1cbiAgICAgIGlmICghZGVjb3JhdGlvbnNbZmlsZVBhdGhdKSB7XG4gICAgICAgIC8vIFJlbW92ZWRcbiAgICAgICAgY29uc3QgZWxlbWVudCA9IGVsZW1lbnRDYWNoZVtmaWxlUGF0aF0gfHwgKGVsZW1lbnRDYWNoZVtmaWxlUGF0aF0gPSBUcmVlVmlldy5nZXRFbGVtZW50QnlQYXRoKHRyZWVWaWV3RWxlbWVudCwgZmlsZVBhdGgpKVxuICAgICAgICBpZiAoZWxlbWVudCkge1xuICAgICAgICAgIHRoaXMucmVtb3ZlRGVjb3JhdGlvbihlbGVtZW50KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBmaWxlUGF0aCBpbiBkZWNvcmF0aW9ucykge1xuICAgICAgaWYgKCF7fS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGRlY29yYXRpb25zLCBmaWxlUGF0aCkpIHtcbiAgICAgICAgY29udGludWVcbiAgICAgIH1cbiAgICAgIGNvbnN0IGVsZW1lbnQgPSBlbGVtZW50Q2FjaGVbZmlsZVBhdGhdIHx8IChlbGVtZW50Q2FjaGVbZmlsZVBhdGhdID0gVHJlZVZpZXcuZ2V0RWxlbWVudEJ5UGF0aCh0cmVlVmlld0VsZW1lbnQsIGZpbGVQYXRoKSlcbiAgICAgIGlmIChlbGVtZW50KSB7XG4gICAgICAgIHRoaXMuaGFuZGxlRGVjb3JhdGlvbihlbGVtZW50LCAhIXRoaXMuZGVjb3JhdGlvbnNbZmlsZVBhdGhdLCBkZWNvcmF0aW9uc1tmaWxlUGF0aF0pXG4gICAgICAgIGFwcGxpZWREZWNvcmF0aW9uc1tmaWxlUGF0aF0gPSBkZWNvcmF0aW9uc1tmaWxlUGF0aF1cbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5kZWNvcmF0aW9ucyA9IGFwcGxpZWREZWNvcmF0aW9uc1xuICB9XG4gIGhhbmRsZURlY29yYXRpb24oZWxlbWVudDogSFRNTEVsZW1lbnQsIHVwZGF0ZTogYm9vbGVhbiA9IGZhbHNlLCBoaWdobGlnaHRzOiBUcmVlVmlld0hpZ2hsaWdodCkge1xuICAgIGxldCBkZWNvcmF0aW9uXG4gICAgaWYgKHVwZGF0ZSkge1xuICAgICAgZGVjb3JhdGlvbiA9IGVsZW1lbnQucXVlcnlTZWxlY3RvcignbGludGVyLWRlY29yYXRpb24nKVxuICAgIH1cbiAgICBpZiAoZGVjb3JhdGlvbikge1xuICAgICAgZGVjb3JhdGlvbi5jbGFzc05hbWUgPSAnJ1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWNvcmF0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGludGVyLWRlY29yYXRpb24nKVxuICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZChkZWNvcmF0aW9uKVxuICAgIH1cbiAgICBpZiAoaGlnaGxpZ2h0cy5lcnJvcikge1xuICAgICAgZGVjb3JhdGlvbi5jbGFzc0xpc3QuYWRkKCdsaW50ZXItZXJyb3InKVxuICAgIH0gZWxzZSBpZiAoaGlnaGxpZ2h0cy53YXJuaW5nKSB7XG4gICAgICBkZWNvcmF0aW9uLmNsYXNzTGlzdC5hZGQoJ2xpbnRlci13YXJuaW5nJylcbiAgICB9IGVsc2UgaWYgKGhpZ2hsaWdodHMuaW5mbykge1xuICAgICAgZGVjb3JhdGlvbi5jbGFzc0xpc3QuYWRkKCdsaW50ZXItaW5mbycpXG4gICAgfVxuICB9XG4gIHJlbW92ZURlY29yYXRpb24oZWxlbWVudDogSFRNTEVsZW1lbnQpIHtcbiAgICBjb25zdCBkZWNvcmF0aW9uID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdsaW50ZXItZGVjb3JhdGlvbicpXG4gICAgaWYgKGRlY29yYXRpb24pIHtcbiAgICAgIGRlY29yYXRpb24ucmVtb3ZlKClcbiAgICB9XG4gIH1cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gIH1cbiAgc3RhdGljIGdldEVsZW1lbnQoKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50cmVlLXZpZXcnKVxuICB9XG4gIHN0YXRpYyBnZXRFbGVtZW50QnlQYXRoKHBhcmVudDogSFRNTEVsZW1lbnQsIGZpbGVQYXRoKTogP0hUTUxFbGVtZW50IHtcbiAgICByZXR1cm4gcGFyZW50LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLXBhdGg9JHtDU1MuZXNjYXBlKGZpbGVQYXRoKX1dYClcbiAgfVxufVxuIl19