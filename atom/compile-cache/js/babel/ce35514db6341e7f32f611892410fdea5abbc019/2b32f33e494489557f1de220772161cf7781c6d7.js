Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _sbDebounce = require('sb-debounce');

var _sbDebounce2 = _interopRequireDefault(_sbDebounce);

var _disposableEvent = require('disposable-event');

var _disposableEvent2 = _interopRequireDefault(_disposableEvent);

var _atom = require('atom');

var _sbEventKit = require('sb-event-kit');

var _tooltip = require('../tooltip');

var _tooltip2 = _interopRequireDefault(_tooltip);

var _helpers = require('../helpers');

var _helpers2 = require('./helpers');

var Editor = (function () {
  function Editor(textEditor) {
    var _this = this;

    _classCallCheck(this, Editor);

    this.tooltip = null;
    this.emitter = new _sbEventKit.Emitter();
    this.markers = new Map();
    this.messages = new Set();
    this.textEditor = textEditor;
    this.subscriptions = new _sbEventKit.CompositeDisposable();

    this.subscriptions.add(this.emitter);
    this.subscriptions.add(atom.config.observe('linter-ui-default.showTooltip', function (showTooltip) {
      _this.showTooltip = showTooltip;
    }));
    this.subscriptions.add(atom.config.observe('linter-ui-default.showProviderName', function (showProviderName) {
      _this.showProviderName = showProviderName;
    }));
    this.subscriptions.add(atom.config.observe('linter-ui-default.showDecorations', function (showDecorations) {
      var notInitial = typeof _this.showDecorations !== 'undefined';
      _this.showDecorations = showDecorations;
      if (notInitial) {
        _this.updateGutter();
      }
    }));
    this.subscriptions.add(atom.config.observe('linter-ui-default.gutterPosition', function (gutterPosition) {
      var notInitial = typeof _this.gutterPosition !== 'undefined';
      _this.gutterPosition = gutterPosition;
      if (notInitial) {
        _this.updateGutter();
      }
    }));
    this.subscriptions.add(textEditor.onDidDestroy(function () {
      _this.dispose();
    }));

    var tooltipSubscription = undefined;
    this.subscriptions.add(atom.config.observe('linter-ui-default.tooltipFollows', function (tooltipFollows) {
      if (tooltipSubscription) {
        tooltipSubscription.dispose();
      }
      tooltipSubscription = tooltipFollows === 'Mouse' ? _this.listenForMouseMovement() : _this.listenForKeyboardMovement();
      _this.removeTooltip();
    }));
    this.subscriptions.add(function () {
      tooltipSubscription.dispose();
    });
    this.updateGutter();
    this.listenForCurrentLine();
  }

  _createClass(Editor, [{
    key: 'listenForCurrentLine',
    value: function listenForCurrentLine() {
      var _this2 = this;

      this.subscriptions.add(this.textEditor.observeCursors(function (cursor) {
        var marker = undefined;
        var lastRange = undefined;
        var lastEmpty = undefined;
        var handlePositionChange = function handlePositionChange(_ref) {
          var start = _ref.start;
          var end = _ref.end;

          var gutter = _this2.gutter;
          if (!gutter) return;
          // We need that Range.fromObject hack below because when we focus index 0 on multi-line selection
          // end.column is the column of the last line but making a range out of two and then accesing
          // the end seems to fix it (black magic?)
          var currentRange = _atom.Range.fromObject([start, end]);
          var linesRange = _atom.Range.fromObject([[start.row, 0], [end.row, Infinity]]);
          var currentEmpty = currentRange.isEmpty();

          // NOTE: Atom does not paint gutter if multi-line and last line has zero index
          if (start.row !== end.row && currentRange.end.column === 0) {
            linesRange.end.row--;
          }
          if (lastRange && lastRange.isEqual(linesRange) && currentEmpty === lastEmpty) return;
          if (marker) marker.destroy();
          lastRange = linesRange;
          lastEmpty = currentEmpty;

          marker = _this2.textEditor.markBufferRange(linesRange, {
            invalidate: 'never'
          });
          var item = document.createElement('span');
          item.className = 'line-number cursor-line linter-cursor-line ' + (currentEmpty ? 'cursor-line-no-selection' : '');
          gutter.decorateMarker(marker, {
            item: item,
            'class': 'linter-row'
          });
        };

        var cursorMarker = cursor.getMarker();
        var subscriptions = new _sbEventKit.CompositeDisposable();
        subscriptions.add(cursorMarker.onDidChange(function (_ref2) {
          var newHeadBufferPosition = _ref2.newHeadBufferPosition;
          var newTailBufferPosition = _ref2.newTailBufferPosition;

          handlePositionChange({ start: newHeadBufferPosition, end: newTailBufferPosition });
        }));
        subscriptions.add(cursor.onDidDestroy(function () {
          _this2.subscriptions['delete'](subscriptions);
          subscriptions.dispose();
        }));
        subscriptions.add(function () {
          if (marker) marker.destroy();
        });
        _this2.subscriptions.add(subscriptions);
        handlePositionChange(cursorMarker.getBufferRange());
      }));
    }
  }, {
    key: 'listenForMouseMovement',
    value: function listenForMouseMovement() {
      var _this3 = this;

      var editorElement = atom.views.getView(this.textEditor);
      return (0, _disposableEvent2['default'])(editorElement, 'mousemove', (0, _sbDebounce2['default'])(function (e) {
        if (!editorElement.component || !(0, _helpers2.hasParent)(e.target, 'div.line')) {
          return;
        }
        var tooltip = _this3.tooltip;
        if (tooltip && (0, _helpers2.mouseEventNearPosition)(e, editorElement, tooltip.marker.getStartScreenPosition(), tooltip.element.offsetWidth, tooltip.element.offsetHeight)) {
          return;
        }
        // NOTE: Ignore if file is too big
        if (_this3.textEditor.largeFileMode) {
          _this3.removeTooltip();
          return;
        }
        var cursorPosition = (0, _helpers2.getBufferPositionFromMouseEvent)(e, _this3.textEditor, editorElement);
        _this3.cursorPosition = cursorPosition;
        if (cursorPosition) {
          _this3.updateTooltip(_this3.cursorPosition);
        } else {
          _this3.removeTooltip();
        }
      }, 200, true));
    }
  }, {
    key: 'listenForKeyboardMovement',
    value: function listenForKeyboardMovement() {
      var _this4 = this;

      return this.textEditor.onDidChangeCursorPosition((0, _sbDebounce2['default'])(function (_ref3) {
        var newBufferPosition = _ref3.newBufferPosition;

        _this4.cursorPosition = newBufferPosition;
        _this4.updateTooltip(newBufferPosition);
      }, 60));
    }
  }, {
    key: 'updateGutter',
    value: function updateGutter() {
      var _this5 = this;

      this.removeGutter();
      if (!this.showDecorations) {
        this.gutter = null;
        return;
      }
      var priority = this.gutterPosition === 'Left' ? -100 : 100;
      this.gutter = this.textEditor.addGutter({
        name: 'linter-ui-default',
        priority: priority
      });
      this.markers.forEach(function (marker, message) {
        _this5.decorateMarker(message, marker, 'gutter');
      });
    }
  }, {
    key: 'removeGutter',
    value: function removeGutter() {
      if (this.gutter) {
        try {
          this.gutter.destroy();
        } catch (_) {
          /* This throws when the text editor is disposed */
        }
      }
    }
  }, {
    key: 'updateTooltip',
    value: function updateTooltip(position) {
      var _this6 = this;

      if (!position || this.tooltip && this.tooltip.isValid(position, this.messages)) {
        return;
      }
      this.removeTooltip();
      if (!this.showTooltip) {
        return;
      }

      var messages = (0, _helpers.filterMessagesByRangeOrPoint)(this.messages, this.textEditor.getPath(), position);
      if (!messages.length) {
        return;
      }

      this.tooltip = new _tooltip2['default'](messages, position, this.textEditor);
      this.tooltip.onDidDestroy(function () {
        _this6.tooltip = null;
      });
    }
  }, {
    key: 'removeTooltip',
    value: function removeTooltip() {
      if (this.tooltip) {
        this.tooltip.marker.destroy();
      }
    }
  }, {
    key: 'apply',
    value: function apply(added, removed) {
      var _this7 = this;

      var textBuffer = this.textEditor.getBuffer();

      for (var i = 0, _length = removed.length; i < _length; i++) {
        var message = removed[i];
        var marker = this.markers.get(message);
        if (marker) {
          marker.destroy();
        }
        this.messages['delete'](message);
        this.markers['delete'](message);
      }

      var _loop = function (i, _length2) {
        var message = added[i];
        var markerRange = (0, _helpers.$range)(message);
        if (!markerRange) {
          // Only for backward compatibility
          return 'continue';
        }
        var marker = textBuffer.markRange(markerRange, {
          invalidate: 'never'
        });
        _this7.markers.set(message, marker);
        _this7.messages.add(message);
        marker.onDidChange(function (_ref4) {
          var oldHeadPosition = _ref4.oldHeadPosition;
          var newHeadPosition = _ref4.newHeadPosition;
          var isValid = _ref4.isValid;

          if (!isValid || newHeadPosition.row === 0 && oldHeadPosition.row !== 0) {
            return;
          }
          if (message.version === 1) {
            message.range = marker.previousEventState.range;
          } else {
            message.location.position = marker.previousEventState.range;
          }
        });
        _this7.decorateMarker(message, marker);
      };

      for (var i = 0, _length2 = added.length; i < _length2; i++) {
        var _ret = _loop(i, _length2);

        if (_ret === 'continue') continue;
      }

      this.updateTooltip(this.cursorPosition);
    }
  }, {
    key: 'decorateMarker',
    value: function decorateMarker(message, marker) {
      var paint = arguments.length <= 2 || arguments[2] === undefined ? 'both' : arguments[2];

      if (paint === 'both' || paint === 'editor') {
        this.textEditor.decorateMarker(marker, {
          type: 'highlight',
          'class': 'linter-highlight linter-' + message.severity
        });
      }

      var gutter = this.gutter;
      if (gutter && (paint === 'both' || paint === 'gutter')) {
        var element = document.createElement('span');
        element.className = 'linter-gutter linter-highlight linter-' + message.severity + ' icon icon-' + (message.icon || 'primitive-dot');
        gutter.decorateMarker(marker, {
          'class': 'linter-row',
          item: element
        });
      }
    }
  }, {
    key: 'onDidDestroy',
    value: function onDidDestroy(callback) {
      return this.emitter.on('did-destroy', callback);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.emitter.emit('did-destroy');
      this.subscriptions.dispose();
      this.removeGutter();
      this.removeTooltip();
    }
  }]);

  return Editor;
})();

exports['default'] = Editor;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvZWRpdG9yL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7MEJBRXFCLGFBQWE7Ozs7K0JBQ04sa0JBQWtCOzs7O29CQUN4QixNQUFNOzswQkFDNkIsY0FBYzs7dUJBR25ELFlBQVk7Ozs7dUJBQ3FCLFlBQVk7O3dCQUNrQixXQUFXOztJQUd6RSxNQUFNO0FBY2QsV0FkUSxNQUFNLENBY2IsVUFBc0IsRUFBRTs7OzBCQWRqQixNQUFNOztBQWV2QixRQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQTtBQUNuQixRQUFJLENBQUMsT0FBTyxHQUFHLHlCQUFhLENBQUE7QUFDNUIsUUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBO0FBQ3hCLFFBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTtBQUN6QixRQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQTtBQUM1QixRQUFJLENBQUMsYUFBYSxHQUFHLHFDQUF5QixDQUFBOztBQUU5QyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7QUFDcEMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsK0JBQStCLEVBQUUsVUFBQyxXQUFXLEVBQUs7QUFDM0YsWUFBSyxXQUFXLEdBQUcsV0FBVyxDQUFBO0tBQy9CLENBQUMsQ0FBQyxDQUFBO0FBQ0gsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsb0NBQW9DLEVBQUUsVUFBQyxnQkFBZ0IsRUFBSztBQUNyRyxZQUFLLGdCQUFnQixHQUFHLGdCQUFnQixDQUFBO0tBQ3pDLENBQUMsQ0FBQyxDQUFBO0FBQ0gsUUFBSSxDQUFDLGFBQWEsQ0FBQyxH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SUFBSSxlQUFlLENBQUEsQUFBRSxDQUFBO0FBQzVILGNBQU0sQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFO0FBQzVCLG1CQUFPLFlBQVk7QUFDbkIsY0FBSSxFQUFFLE9BQU87U0FDZCxDQUFDLENBQUE7T0FDSDtLQUNGOzs7V0FDVyxzQkFBQyxRQUFrQixFQUFjO0FBQzNDLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLFFBQVEsQ0FBQyxDQUFBO0tBQ2hEOzs7V0FDTSxtQkFBRztBQUNSLFVBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFBO0FBQ2hDLFVBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDNUIsVUFBSSxDQUFDLFlBQVksRUFBRSxDQUFBO0FBQ25CLFVBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQTtLQUNyQjs7O1NBaFFrQixNQUFNOzs7cUJBQU4sTUFBTSIsImZpbGUiOiIvVXNlcnMvYWgvLmF0b20vcGFja2FnZXMvbGludGVyLXVpLWRlZmF1bHQvbGliL2VkaXRvci9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCBkZWJvdW5jZSBmcm9tICdzYi1kZWJvdW5jZSdcbmltcG9ydCBkaXNwb3NhYmxlRXZlbnQgZnJvbSAnZGlzcG9zYWJsZS1ldmVudCdcbmltcG9ydCB7IFJhbmdlIH0gZnJvbSAnYXRvbSdcbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUsIEVtaXR0ZXIsIERpc3Bvc2FibGUgfSBmcm9tICdzYi1ldmVudC1raXQnXG5pbXBvcnQgdHlwZSB7IFRleHRFZGl0b3IsIEJ1ZmZlck1hcmtlciwgVGV4dEVkaXRvckd1dHRlciwgUG9pbnQgfSBmcm9tICdhdG9tJ1xuXG5pbXBvcnQgVG9vbHRpcCBmcm9tICcuLi90b29sdGlwJ1xuaW1wb3J0IHsgJHJhbmdlLCBmaWx0ZXJNZXNzYWdlc0J5UmFuZ2VPclBvaW50IH0gZnJvbSAnLi4vaGVscGVycydcbmltcG9ydCB7IGhhc1BhcmVudCwgbW91c2VFdmVudE5lYXJQb3NpdGlvbiwgZ2V0QnVmZmVyUG9zaXRpb25Gcm9tTW91c2VFdmVudCB9IGZyb20gJy4vaGVscGVycydcbmltcG9ydCB0eXBlIHsgTGludGVyTWVzc2FnZSB9IGZyb20gJy4uL3R5cGVzJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFZGl0b3Ige1xuICBndXR0ZXI6ID9UZXh0RWRpdG9yR3V0dGVyO1xuICB0b29sdGlwOiA/VG9vbHRpcDtcbiAgZW1pdHRlcjogRW1pdHRlcjtcbiAgbWFya2VyczogTWFwPExpbnRlck1lc3NhZ2UsIEJ1ZmZlck1hcmtlcj47XG4gIG1lc3NhZ2VzOiBTZXQ8TGludGVyTWVzc2FnZT47XG4gIHRleHRFZGl0b3I6IFRleHRFZGl0b3I7XG4gIHNob3dUb29sdGlwOiBib29sZWFuO1xuICBzdWJzY3JpcHRpb25zOiBDb21wb3NpdGVEaXNwb3NhYmxlO1xuICBjdXJzb3JQb3NpdGlvbjogP1BvaW50O1xuICBndXR0ZXJQb3NpdGlvbjogYm9vbGVhbjtcbiAgc2hvd0RlY29yYXRpb25zOiBib29sZWFuO1xuICBzaG93UHJvdmlkZXJOYW1lOiBib29sZWFuO1xuXG4gIGNvbnN0cnVjdG9yKHRleHRFZGl0b3I6IFRleHRFZGl0b3IpIHtcbiAgICB0aGlzLnRvb2x0aXAgPSBudWxsXG4gICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXIoKVxuICAgIHRoaXMubWFya2VycyA9IG5ldyBNYXAoKVxuICAgIHRoaXMubWVzc2FnZXMgPSBuZXcgU2V0KClcbiAgICB0aGlzLnRleHRFZGl0b3IgPSB0ZXh0RWRpdG9yXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLmVtaXR0ZXIpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItdWktZGVmYXVsdC5zaG93VG9vbHRpcCcsIChzaG93VG9vbHRpcCkgPT4ge1xuICAgICAgdGhpcy5zaG93VG9vbHRpcCA9IHNob3dUb29sdGlwXG4gICAgfSkpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItdWktZGVmYXVsdC5zaG93UHJvdmlkZXJOYW1lJywgKHNob3dQcm92aWRlck5hbWUpID0+IHtcbiAgICAgIHRoaXMuc2hvd1Byb3ZpZGVyTmFtZSA9IHNob3dQcm92aWRlck5hbWVcbiAgICB9KSlcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci11aS1kZWZhdWx0LnNob3dEZWNvcmF0aW9ucycsIChzaG93RGVjb3JhdGlvbnMpID0+IHtcbiAgICAgIGNvbnN0IG5vdEluaXRpYWwgPSB0eXBlb2YgdGhpcy5zaG93RGVjb3JhdGlvbnMgIT09ICd1bmRlZmluZWQnXG4gICAgICB0aGlzLnNob3dEZWNvcmF0aW9ucyA9IHNob3dEZWNvcmF0aW9uc1xuICAgICAgaWYgKG5vdEluaXRpYWwpIHtcbiAgICAgICAgdGhpcy51cGRhdGVHdXR0ZXIoKVxuICAgICAgfVxuICAgIH0pKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLXVpLWRlZmF1bHQuZ3V0dGVyUG9zaXRpb24nLCAoZ3V0dGVyUG9zaXRpb24pID0+IHtcbiAgICAgIGNvbnN0IG5vdEluaXRpYWwgPSB0eXBlb2YgdGhpcy5ndXR0ZXJQb3NpdGlvbiAhPT0gJ3VuZGVmaW5lZCdcbiAgICAgIHRoaXMuZ3V0dGVyUG9zaXRpb24gPSBndXR0ZXJQb3NpdGlvblxuICAgICAgaWYgKG5vdEluaXRpYWwpIHtcbiAgICAgICAgdGhpcy51cGRhdGVHdXR0ZXIoKVxuICAgICAgfVxuICAgIH0pKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGV4dEVkaXRvci5vbkRpZERlc3Ryb3koKCkgPT4ge1xuICAgICAgdGhpcy5kaXNwb3NlKClcbiAgICB9KSlcblxuICAgIGxldCB0b29sdGlwU3Vic2NyaXB0aW9uXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItdWktZGVmYXVsdC50b29sdGlwRm9sbG93cycsICh0b29sdGlwRm9sbG93cykgPT4ge1xuICAgICAgaWYgKHRvb2x0aXBTdWJzY3JpcHRpb24pIHtcbiAgICAgICAgdG9vbHRpcFN1YnNjcmlwdGlvbi5kaXNwb3NlKClcbiAgICAgIH1cbiAgICAgIHRvb2x0aXBTdWJzY3JpcHRpb24gPSB0b29sdGlwRm9sbG93cyA9PT0gJ01vdXNlJyA/IHRoaXMubGlzdGVuRm9yTW91c2VNb3ZlbWVudCgpIDogdGhpcy5saXN0ZW5Gb3JLZXlib2FyZE1vdmVtZW50KClcbiAgICAgIHRoaXMucmVtb3ZlVG9vbHRpcCgpXG4gICAgfSkpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChmdW5jdGlvbigpIHtcbiAgICAgIHRvb2x0aXBTdWJzY3JpcHRpb24uZGlzcG9zZSgpXG4gICAgfSlcbiAgICB0aGlzLnVwZGF0ZUd1dHRlcigpXG4gICAgdGhpcy5saXN0ZW5Gb3JDdXJyZW50TGluZSgpXG4gIH1cbiAgbGlzdGVuRm9yQ3VycmVudExpbmUoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLnRleHRFZGl0b3Iub2JzZXJ2ZUN1cnNvcnMoKGN1cnNvcikgPT4ge1xuICAgICAgbGV0IG1hcmtlclxuICAgICAgbGV0IGxhc3RSYW5nZVxuICAgICAgbGV0IGxhc3RFbXB0eVxuICAgICAgY29uc3QgaGFuZGxlUG9zaXRpb25DaGFuZ2UgPSAoeyBzdGFydCwgZW5kIH0pID0+IHtcbiAgICAgICAgY29uc3QgZ3V0dGVyID0gdGhpcy5ndXR0ZXJcbiAgICAgICAgaWYgKCFndXR0ZXIpIHJldHVyblxuICAgICAgICAvLyBXZSBuZWVkIHRoYXQgUmFuZ2UuZnJvbU9iamVjdCBoYWNrIGJlbG93IGJlY2F1c2Ugd2hlbiB3ZSBmb2N1cyBpbmRleCAwIG9uIG11bHRpLWxpbmUgc2VsZWN0aW9uXG4gICAgICAgIC8vIGVuZC5jb2x1bW4gaXMgdGhlIGNvbHVtbiBvZiB0aGUgbGFzdCBsaW5lIGJ1dCBtYWtpbmcgYSByYW5nZSBvdXQgb2YgdHdvIGFuZCB0aGVuIGFjY2VzaW5nXG4gICAgICAgIC8vIHRoZSBlbmQgc2VlbXMgdG8gZml4IGl0IChibGFjayBtYWdpYz8pXG4gICAgICAgIGNvbnN0IGN1cnJlbnRSYW5nZSA9IFJhbmdlLmZyb21PYmplY3QoW3N0YXJ0LCBlbmRdKVxuICAgICAgICBjb25zdCBsaW5lc1JhbmdlID0gUmFuZ2UuZnJvbU9iamVjdChbW3N0YXJ0LnJvdywgMF0sIFtlbmQucm93LCBJbmZpbml0eV1dKVxuICAgICAgICBjb25zdCBjdXJyZW50RW1wdHkgPSBjdXJyZW50UmFuZ2UuaXNFbXB0eSgpXG5cbiAgICAgICAgLy8gTk9URTogQXRvbSBkb2VzIG5vdCBwYWludCBndXR0ZXIgaWYgbXVsdGktbGluZSBhbmQgbGFzdCBsaW5lIGhhcyB6ZXJvIGluZGV4XG4gICAgICAgIGlmIChzdGFydC5yb3cgIT09IGVuZC5yb3cgJiYgY3VycmVudFJhbmdlLmVuZC5jb2x1bW4gPT09IDApIHtcbiAgICAgICAgICBsaW5lc1JhbmdlLmVuZC5yb3ctLVxuICAgICAgICB9XG4gICAgICAgIGlmIChsYXN0UmFuZ2UgJiYgbGFzdFJhbmdlLmlzRXF1YWwobGluZXNSYW5nZSkgJiYgY3VycmVudEVtcHR5ID09PSBsYXN0RW1wdHkpIHJldHVyblxuICAgICAgICBpZiAobWFya2VyKSBtYXJrZXIuZGVzdHJveSgpXG4gICAgICAgIGxhc3RSYW5nZSA9IGxpbmVzUmFuZ2VcbiAgICAgICAgbGFzdEVtcHR5ID0gY3VycmVudEVtcHR5XG5cbiAgICAgICAgbWFya2VyID0gdGhpcy50ZXh0RWRpdG9yLm1hcmtCdWZmZXJSYW5nZShsaW5lc1JhbmdlLCB7XG4gICAgICAgICAgaW52YWxpZGF0ZTogJ25ldmVyJyxcbiAgICAgICAgfSlcbiAgICAgICAgY29uc3QgaXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxuICAgICAgICBpdGVtLmNsYXNzTmFtZSA9IGBsaW5lLW51bWJlciBjdXJzb3ItbGluZSBsaW50ZXItY3Vyc29yLWxpbmUgJHtjdXJyZW50RW1wdHkgPyAnY3Vyc29yLWxpbmUtbm8tc2VsZWN0aW9uJyA6ICcnfWBcbiAgICAgICAgZ3V0dGVyLmRlY29yYXRlTWFya2VyKG1hcmtlciwge1xuICAgICAgICAgIGl0ZW0sXG4gICAgICAgICAgY2xhc3M6ICdsaW50ZXItcm93JyxcbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgY29uc3QgY3Vyc29yTWFya2VyID0gY3Vyc29yLmdldE1hcmtlcigpXG4gICAgICBjb25zdCBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgICAgc3Vic2NyaXB0aW9ucy5hZGQoY3Vyc29yTWFya2VyLm9uRGlkQ2hhbmdlKCh7IG5ld0hlYWRCdWZmZXJQb3NpdGlvbiwgbmV3VGFpbEJ1ZmZlclBvc2l0aW9uIH0pID0+IHtcbiAgICAgICAgaGFuZGxlUG9zaXRpb25DaGFuZ2UoeyBzdGFydDogbmV3SGVhZEJ1ZmZlclBvc2l0aW9uLCBlbmQ6IG5ld1RhaWxCdWZmZXJQb3NpdGlvbiB9KVxuICAgICAgfSkpXG4gICAgICBzdWJzY3JpcHRpb25zLmFkZChjdXJzb3Iub25EaWREZXN0cm95KCgpID0+IHtcbiAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLmRlbGV0ZShzdWJzY3JpcHRpb25zKVxuICAgICAgICBzdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgICAgfSkpXG4gICAgICBzdWJzY3JpcHRpb25zLmFkZChmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKG1hcmtlcikgbWFya2VyLmRlc3Ryb3koKVxuICAgICAgfSlcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoc3Vic2NyaXB0aW9ucylcbiAgICAgIGhhbmRsZVBvc2l0aW9uQ2hhbmdlKGN1cnNvck1hcmtlci5nZXRCdWZmZXJSYW5nZSgpKVxuICAgIH0pKVxuICB9XG4gIGxpc3RlbkZvck1vdXNlTW92ZW1lbnQoKSB7XG4gICAgY29uc3QgZWRpdG9yRWxlbWVudCA9IGF0b20udmlld3MuZ2V0Vmlldyh0aGlzLnRleHRFZGl0b3IpXG4gICAgcmV0dXJuIGRpc3Bvc2FibGVFdmVudChlZGl0b3JFbGVtZW50LCAnbW91c2Vtb3ZlJywgZGVib3VuY2UoKGUpID0+IHtcbiAgICAgIGlmICghZWRpdG9yRWxlbWVudC5jb21wb25lbnQgfHwgIWhhc1BhcmVudChlLnRhcmdldCwgJ2Rpdi5saW5lJykpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICBjb25zdCB0b29sdGlwID0gdGhpcy50b29sdGlwXG4gICAgICBpZiAodG9vbHRpcCAmJiBtb3VzZUV2ZW50TmVhclBvc2l0aW9uKGUsIGVkaXRvckVsZW1lbnQsIHRvb2x0aXAubWFya2VyLmdldFN0YXJ0U2NyZWVuUG9zaXRpb24oKSwgdG9vbHRpcC5lbGVtZW50Lm9mZnNldFdpZHRoLCB0b29sdGlwLmVsZW1lbnQub2Zmc2V0SGVpZ2h0KSkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIC8vIE5PVEU6IElnbm9yZSBpZiBmaWxlIGlzIHRvbyBiaWdcbiAgICAgIGlmICh0aGlzLnRleHRFZGl0b3IubGFyZ2VGaWxlTW9kZSkge1xuICAgICAgICB0aGlzLnJlbW92ZVRvb2x0aXAoKVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIGNvbnN0IGN1cnNvclBvc2l0aW9uID0gZ2V0QnVmZmVyUG9zaXRpb25Gcm9tTW91c2VFdmVudChlLCB0aGlzLnRleHRFZGl0b3IsIGVkaXRvckVsZW1lbnQpXG4gICAgICB0aGlzLmN1cnNvclBvc2l0aW9uID0gY3Vyc29yUG9zaXRpb25cbiAgICAgIGlmIChjdXJzb3JQb3NpdGlvbikge1xuICAgICAgICB0aGlzLnVwZGF0ZVRvb2x0aXAodGhpcy5jdXJzb3JQb3NpdGlvbilcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucmVtb3ZlVG9vbHRpcCgpXG4gICAgICB9XG4gICAgfSwgMjAwLCB0cnVlKSlcbiAgfVxuICBsaXN0ZW5Gb3JLZXlib2FyZE1vdmVtZW50KCkge1xuICAgIHJldHVybiB0aGlzLnRleHRFZGl0b3Iub25EaWRDaGFuZ2VDdXJzb3JQb3NpdGlvbihkZWJvdW5jZSgoeyBuZXdCdWZmZXJQb3NpdGlvbiB9KSA9PiB7XG4gICAgICB0aGlzLmN1cnNvclBvc2l0aW9uID0gbmV3QnVmZmVyUG9zaXRpb25cbiAgICAgIHRoaXMudXBkYXRlVG9vbHRpcChuZXdCdWZmZXJQb3NpdGlvbilcbiAgICB9LCA2MCkpXG4gIH1cbiAgdXBkYXRlR3V0dGVyKCkge1xuICAgIHRoaXMucmVtb3ZlR3V0dGVyKClcbiAgICBpZiAoIXRoaXMuc2hvd0RlY29yYXRpb25zKSB7XG4gICAgICB0aGlzLmd1dHRlciA9IG51bGxcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBjb25zdCBwcmlvcml0eSA9IHRoaXMuZ3V0dGVyUG9zaXRpb24gPT09ICdMZWZ0JyA/IC0xMDAgOiAxMDBcbiAgICB0aGlzLmd1dHRlciA9IHRoaXMudGV4dEVkaXRvci5hZGRHdXR0ZXIoe1xuICAgICAgbmFtZTogJ2xpbnRlci11aS1kZWZhdWx0JyxcbiAgICAgIHByaW9yaXR5LFxuICAgIH0pXG4gICAgdGhpcy5tYXJrZXJzLmZvckVhY2goKG1hcmtlciwgbWVzc2FnZSkgPT4ge1xuICAgICAgdGhpcy5kZWNvcmF0ZU1hcmtlcihtZXNzYWdlLCBtYXJrZXIsICdndXR0ZXInKVxuICAgIH0pXG4gIH1cbiAgcmVtb3ZlR3V0dGVyKCkge1xuICAgIGlmICh0aGlzLmd1dHRlcikge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdGhpcy5ndXR0ZXIuZGVzdHJveSgpXG4gICAgICB9IGNhdGNoIChfKSB7XG4gICAgICAgIC8qIFRoaXMgdGhyb3dzIHdoZW4gdGhlIHRleHQgZWRpdG9yIGlzIGRpc3Bvc2VkICovXG4gICAgICB9XG4gICAgfVxuICB9XG4gIHVwZGF0ZVRvb2x0aXAocG9zaXRpb246ID9Qb2ludCkge1xuICAgIGlmICghcG9zaXRpb24gfHwgKHRoaXMudG9vbHRpcCAmJiB0aGlzLnRvb2x0aXAuaXNWYWxpZChwb3NpdGlvbiwgdGhpcy5tZXNzYWdlcykpKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgdGhpcy5yZW1vdmVUb29sdGlwKClcbiAgICBpZiAoIXRoaXMuc2hvd1Rvb2x0aXApIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNvbnN0IG1lc3NhZ2VzID0gZmlsdGVyTWVzc2FnZXNCeVJhbmdlT3JQb2ludCh0aGlzLm1lc3NhZ2VzLCB0aGlzLnRleHRFZGl0b3IuZ2V0UGF0aCgpLCBwb3NpdGlvbilcbiAgICBpZiAoIW1lc3NhZ2VzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgdGhpcy50b29sdGlwID0gbmV3IFRvb2x0aXAobWVzc2FnZXMsIHBvc2l0aW9uLCB0aGlzLnRleHRFZGl0b3IpXG4gICAgdGhpcy50b29sdGlwLm9uRGlkRGVzdHJveSgoKSA9PiB7XG4gICAgICB0aGlzLnRvb2x0aXAgPSBudWxsXG4gICAgfSlcbiAgfVxuICByZW1vdmVUb29sdGlwKCkge1xuICAgIGlmICh0aGlzLnRvb2x0aXApIHtcbiAgICAgIHRoaXMudG9vbHRpcC5tYXJrZXIuZGVzdHJveSgpXG4gICAgfVxuICB9XG4gIGFwcGx5KGFkZGVkOiBBcnJheTxMaW50ZXJNZXNzYWdlPiwgcmVtb3ZlZDogQXJyYXk8TGludGVyTWVzc2FnZT4pIHtcbiAgICBjb25zdCB0ZXh0QnVmZmVyID0gdGhpcy50ZXh0RWRpdG9yLmdldEJ1ZmZlcigpXG5cbiAgICBmb3IgKGxldCBpID0gMCwgbGVuZ3RoID0gcmVtb3ZlZC5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgbWVzc2FnZSA9IHJlbW92ZWRbaV1cbiAgICAgIGNvbnN0IG1hcmtlciA9IHRoaXMubWFya2Vycy5nZXQobWVzc2FnZSlcbiAgICAgIGlmIChtYXJrZXIpIHtcbiAgICAgICAgbWFya2VyLmRlc3Ryb3koKVxuICAgICAgfVxuICAgICAgdGhpcy5tZXNzYWdlcy5kZWxldGUobWVzc2FnZSlcbiAgICAgIHRoaXMubWFya2Vycy5kZWxldGUobWVzc2FnZSlcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMCwgbGVuZ3RoID0gYWRkZWQubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSBhZGRlZFtpXVxuICAgICAgY29uc3QgbWFya2VyUmFuZ2UgPSAkcmFuZ2UobWVzc2FnZSlcbiAgICAgIGlmICghbWFya2VyUmFuZ2UpIHtcbiAgICAgICAgLy8gT25seSBmb3IgYmFja3dhcmQgY29tcGF0aWJpbGl0eVxuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuICAgICAgY29uc3QgbWFya2VyID0gdGV4dEJ1ZmZlci5tYXJrUmFuZ2UobWFya2VyUmFuZ2UsIHtcbiAgICAgICAgaW52YWxpZGF0ZTogJ25ldmVyJyxcbiAgICAgIH0pXG4gICAgICB0aGlzLm1hcmtlcnMuc2V0KG1lc3NhZ2UsIG1hcmtlcilcbiAgICAgIHRoaXMubWVzc2FnZXMuYWRkKG1lc3NhZ2UpXG4gICAgICBtYXJrZXIub25EaWRDaGFuZ2UoKHsgb2xkSGVhZFBvc2l0aW9uLCBuZXdIZWFkUG9zaXRpb24sIGlzVmFsaWQgfSkgPT4ge1xuICAgICAgICBpZiAoIWlzVmFsaWQgfHwgKG5ld0hlYWRQb3NpdGlvbi5yb3cgPT09IDAgJiYgb2xkSGVhZFBvc2l0aW9uLnJvdyAhPT0gMCkpIHtcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICBpZiAobWVzc2FnZS52ZXJzaW9uID09PSAxKSB7XG4gICAgICAgICAgbWVzc2FnZS5yYW5nZSA9IG1hcmtlci5wcmV2aW91c0V2ZW50U3RhdGUucmFuZ2VcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtZXNzYWdlLmxvY2F0aW9uLnBvc2l0aW9uID0gbWFya2VyLnByZXZpb3VzRXZlbnRTdGF0ZS5yYW5nZVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgdGhpcy5kZWNvcmF0ZU1hcmtlcihtZXNzYWdlLCBtYXJrZXIpXG4gICAgfVxuXG4gICAgdGhpcy51cGRhdGVUb29sdGlwKHRoaXMuY3Vyc29yUG9zaXRpb24pXG4gIH1cbiAgZGVjb3JhdGVNYXJrZXIobWVzc2FnZTogTGludGVyTWVzc2FnZSwgbWFya2VyOiBPYmplY3QsIHBhaW50OiAnZ3V0dGVyJyB8ICdlZGl0b3InIHwgJ2JvdGgnID0gJ2JvdGgnKSB7XG4gICAgaWYgKHBhaW50ID09PSAnYm90aCcgfHwgcGFpbnQgPT09ICdlZGl0b3InKSB7XG4gICAgICB0aGlzLnRleHRFZGl0b3IuZGVjb3JhdGVNYXJrZXIobWFya2VyLCB7XG4gICAgICAgIHR5cGU6ICdoaWdobGlnaHQnLFxuICAgICAgICBjbGFzczogYGxpbnRlci1oaWdobGlnaHQgbGludGVyLSR7bWVzc2FnZS5zZXZlcml0eX1gLFxuICAgICAgfSlcbiAgICB9XG5cbiAgICBjb25zdCBndXR0ZXIgPSB0aGlzLmd1dHRlclxuICAgIGlmIChndXR0ZXIgJiYgKHBhaW50ID09PSAnYm90aCcgfHwgcGFpbnQgPT09ICdndXR0ZXInKSkge1xuICAgICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxuICAgICAgZWxlbWVudC5jbGFzc05hbWUgPSBgbGludGVyLWd1dHRlciBsaW50ZXItaGlnaGxpZ2h0IGxpbnRlci0ke21lc3NhZ2Uuc2V2ZXJpdHl9IGljb24gaWNvbi0ke21lc3NhZ2UuaWNvbiB8fCAncHJpbWl0aXZlLWRvdCd9YFxuICAgICAgZ3V0dGVyLmRlY29yYXRlTWFya2VyKG1hcmtlciwge1xuICAgICAgICBjbGFzczogJ2xpbnRlci1yb3cnLFxuICAgICAgICBpdGVtOiBlbGVtZW50LFxuICAgICAgfSlcbiAgICB9XG4gIH1cbiAgb25EaWREZXN0cm95KGNhbGxiYWNrOiBGdW5jdGlvbik6IERpc3Bvc2FibGUge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC1kZXN0cm95JywgY2FsbGJhY2spXG4gIH1cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWRlc3Ryb3knKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICB0aGlzLnJlbW92ZUd1dHRlcigpXG4gICAgdGhpcy5yZW1vdmVUb29sdGlwKClcbiAgfVxufVxuIl19