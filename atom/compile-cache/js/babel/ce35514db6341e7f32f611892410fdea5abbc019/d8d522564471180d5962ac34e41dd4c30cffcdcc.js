var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _sbDebounce = require('sb-debounce');

var _sbDebounce2 = _interopRequireDefault(_sbDebounce);

var _disposableEvent = require('disposable-event');

var _disposableEvent2 = _interopRequireDefault(_disposableEvent);

var _atom = require('atom');

var _tooltip = require('../tooltip');

var _tooltip2 = _interopRequireDefault(_tooltip);

var _helpers = require('../helpers');

var _helpers2 = require('./helpers');

var Editor = (function () {
  function Editor(textEditor) {
    var _this = this;

    _classCallCheck(this, Editor);

    this.tooltip = null;
    this.emitter = new _atom.Emitter();
    this.markers = new Map();
    this.messages = new Set();
    this.textEditor = textEditor;
    this.subscriptions = new _atom.CompositeDisposable();

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
    this.subscriptions.add(new _atom.Disposable(function () {
      tooltipSubscription.dispose();
    }));
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

          marker = _this2.textEditor.markScreenRange(linesRange, {
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
        var subscriptions = new _atom.CompositeDisposable();
        subscriptions.add(cursorMarker.onDidChange(function (_ref2) {
          var newHeadScreenPosition = _ref2.newHeadScreenPosition;
          var newTailScreenPosition = _ref2.newTailScreenPosition;

          handlePositionChange({ start: newHeadScreenPosition, end: newTailScreenPosition });
        }));
        subscriptions.add(cursor.onDidDestroy(function () {
          _this2.subscriptions.remove(subscriptions);
          subscriptions.dispose();
        }));
        subscriptions.add(new _atom.Disposable(function () {
          if (marker) marker.destroy();
        }));
        _this2.subscriptions.add(subscriptions);
        handlePositionChange(cursorMarker.getScreenRange());
      }));
    }
  }, {
    key: 'listenForMouseMovement',
    value: function listenForMouseMovement() {
      var _this3 = this;

      var editorElement = atom.views.getView(this.textEditor);

      return (0, _disposableEvent2['default'])(editorElement, 'mousemove', (0, _sbDebounce2['default'])(function (event) {
        if (!editorElement.component || !(0, _helpers2.hasParent)(event.target, 'div.scroll-view')) {
          return;
        }
        var tooltip = _this3.tooltip;
        if (tooltip && (0, _helpers2.mouseEventNearPosition)({
          event: event,
          editor: _this3.textEditor,
          editorElement: editorElement,
          tooltipElement: tooltip.element,
          screenPosition: tooltip.marker.getStartScreenPosition()
        })) {
          return;
        }

        _this3.cursorPosition = (0, _helpers2.getBufferPositionFromMouseEvent)(event, _this3.textEditor, editorElement);
        if (_this3.textEditor.largeFileMode) {
          // NOTE: Ignore if file is too large
          _this3.cursorPosition = null;
        }
        if (_this3.cursorPosition) {
          _this3.updateTooltip(_this3.cursorPosition);
        } else {
          _this3.removeTooltip();
        }
      }, 300, true));
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

module.exports = Editor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvZWRpdG9yL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OzswQkFFcUIsYUFBYTs7OzsrQkFDTixrQkFBa0I7Ozs7b0JBQ2tCLE1BQU07O3VCQUdsRCxZQUFZOzs7O3VCQUNxQixZQUFZOzt3QkFDa0IsV0FBVzs7SUFHeEYsTUFBTTtBQWNDLFdBZFAsTUFBTSxDQWNFLFVBQXNCLEVBQUU7OzswQkFkaEMsTUFBTTs7QUFlUixRQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQTtBQUNuQixRQUFJLENBQUMsT0FBTyxHQUFHLG1CQUFhLENBQUE7QUFDNUIsUUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBO0FBQ3hCLFFBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTtBQUN6QixRQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQTtBQUM1QixRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFBOztBQUU5QyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7QUFDcEMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsK0JBQStCLEVBQUUsVUFBQyxXQUFXLEVBQUs7QUFDM0YsWUFBSyxXQUFXLEdBQUcsV0FBVyxDQUFBO0tBQy9CLENBQUMsQ0FBQyxDQUFBO0FBQ0gsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsb0NBQW9DLEVBQUUsVUFBQyxnQkFBZ0IsRUFBSztBQUNyRyxZQUFLLGdCQUFnQixHQUFHLGdCQUFnQixDQUFBO0tBQ3pDLENBQUMsQ0FBQyxDQUFBO0FBQ0gsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFD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LG9CQUFjLE9BQU8sQ0FBQyxJQUFJLElBQUksZUFBZSxDQUFBLEFBQUUsQ0FBQTtBQUM1SCxjQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRTtBQUM1QixtQkFBTyxZQUFZO0FBQ25CLGNBQUksRUFBRSxPQUFPO1NBQ2QsQ0FBQyxDQUFBO09BQ0g7S0FDRjs7O1dBQ1csc0JBQUMsUUFBa0IsRUFBYztBQUMzQyxhQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxRQUFRLENBQUMsQ0FBQTtLQUNoRDs7O1dBQ00sbUJBQUc7QUFDUixVQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQTtBQUNoQyxVQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQzVCLFVBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQTtBQUNuQixVQUFJLENBQUMsYUFBYSxFQUFFLENBQUE7S0FDckI7OztTQXRRRyxNQUFNOzs7QUF5UVosTUFBTSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUEiLCJmaWxlIjoiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2xpbnRlci11aS1kZWZhdWx0L2xpYi9lZGl0b3IvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgZGVib3VuY2UgZnJvbSAnc2ItZGVib3VuY2UnXG5pbXBvcnQgZGlzcG9zYWJsZUV2ZW50IGZyb20gJ2Rpc3Bvc2FibGUtZXZlbnQnXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlLCBEaXNwb3NhYmxlLCBFbWl0dGVyLCBSYW5nZSB9IGZyb20gJ2F0b20nXG5pbXBvcnQgdHlwZSB7IFRleHRFZGl0b3IsIEJ1ZmZlck1hcmtlciwgVGV4dEVkaXRvckd1dHRlciwgUG9pbnQgfSBmcm9tICdhdG9tJ1xuXG5pbXBvcnQgVG9vbHRpcCBmcm9tICcuLi90b29sdGlwJ1xuaW1wb3J0IHsgJHJhbmdlLCBmaWx0ZXJNZXNzYWdlc0J5UmFuZ2VPclBvaW50IH0gZnJvbSAnLi4vaGVscGVycydcbmltcG9ydCB7IGhhc1BhcmVudCwgbW91c2VFdmVudE5lYXJQb3NpdGlvbiwgZ2V0QnVmZmVyUG9zaXRpb25Gcm9tTW91c2VFdmVudCB9IGZyb20gJy4vaGVscGVycydcbmltcG9ydCB0eXBlIHsgTGludGVyTWVzc2FnZSB9IGZyb20gJy4uL3R5cGVzJ1xuXG5jbGFzcyBFZGl0b3Ige1xuICBndXR0ZXI6ID9UZXh0RWRpdG9yR3V0dGVyO1xuICB0b29sdGlwOiA/VG9vbHRpcDtcbiAgZW1pdHRlcjogRW1pdHRlcjtcbiAgbWFya2VyczogTWFwPExpbnRlck1lc3NhZ2UsIEJ1ZmZlck1hcmtlcj47XG4gIG1lc3NhZ2VzOiBTZXQ8TGludGVyTWVzc2FnZT47XG4gIHRleHRFZGl0b3I6IFRleHRFZGl0b3I7XG4gIHNob3dUb29sdGlwOiBib29sZWFuO1xuICBzdWJzY3JpcHRpb25zOiBDb21wb3NpdGVEaXNwb3NhYmxlO1xuICBjdXJzb3JQb3NpdGlvbjogP1BvaW50O1xuICBndXR0ZXJQb3NpdGlvbjogYm9vbGVhbjtcbiAgc2hvd0RlY29yYXRpb25zOiBib29sZWFuO1xuICBzaG93UHJvdmlkZXJOYW1lOiBib29sZWFuO1xuXG4gIGNvbnN0cnVjdG9yKHRleHRFZGl0b3I6IFRleHRFZGl0b3IpIHtcbiAgICB0aGlzLnRvb2x0aXAgPSBudWxsXG4gICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXIoKVxuICAgIHRoaXMubWFya2VycyA9IG5ldyBNYXAoKVxuICAgIHRoaXMubWVzc2FnZXMgPSBuZXcgU2V0KClcbiAgICB0aGlzLnRleHRFZGl0b3IgPSB0ZXh0RWRpdG9yXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLmVtaXR0ZXIpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItdWktZGVmYXVsdC5zaG93VG9vbHRpcCcsIChzaG93VG9vbHRpcCkgPT4ge1xuICAgICAgdGhpcy5zaG93VG9vbHRpcCA9IHNob3dUb29sdGlwXG4gICAgfSkpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItdWktZGVmYXVsdC5zaG93UHJvdmlkZXJOYW1lJywgKHNob3dQcm92aWRlck5hbWUpID0+IHtcbiAgICAgIHRoaXMuc2hvd1Byb3ZpZGVyTmFtZSA9IHNob3dQcm92aWRlck5hbWVcbiAgICB9KSlcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci11aS1kZWZhdWx0LnNob3dEZWNvcmF0aW9ucycsIChzaG93RGVjb3JhdGlvbnMpID0+IHtcbiAgICAgIGNvbnN0IG5vdEluaXRpYWwgPSB0eXBlb2YgdGhpcy5zaG93RGVjb3JhdGlvbnMgIT09ICd1bmRlZmluZWQnXG4gICAgICB0aGlzLnNob3dEZWNvcmF0aW9ucyA9IHNob3dEZWNvcmF0aW9uc1xuICAgICAgaWYgKG5vdEluaXRpYWwpIHtcbiAgICAgICAgdGhpcy51cGRhdGVHdXR0ZXIoKVxuICAgICAgfVxuICAgIH0pKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLXVpLWRlZmF1bHQuZ3V0dGVyUG9zaXRpb24nLCAoZ3V0dGVyUG9zaXRpb24pID0+IHtcbiAgICAgIGNvbnN0IG5vdEluaXRpYWwgPSB0eXBlb2YgdGhpcy5ndXR0ZXJQb3NpdGlvbiAhPT0gJ3VuZGVmaW5lZCdcbiAgICAgIHRoaXMuZ3V0dGVyUG9zaXRpb24gPSBndXR0ZXJQb3NpdGlvblxuICAgICAgaWYgKG5vdEluaXRpYWwpIHtcbiAgICAgICAgdGhpcy51cGRhdGVHdXR0ZXIoKVxuICAgICAgfVxuICAgIH0pKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGV4dEVkaXRvci5vbkRpZERlc3Ryb3koKCkgPT4ge1xuICAgICAgdGhpcy5kaXNwb3NlKClcbiAgICB9KSlcblxuICAgIGxldCB0b29sdGlwU3Vic2NyaXB0aW9uXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItdWktZGVmYXVsdC50b29sdGlwRm9sbG93cycsICh0b29sdGlwRm9sbG93cykgPT4ge1xuICAgICAgaWYgKHRvb2x0aXBTdWJzY3JpcHRpb24pIHtcbiAgICAgICAgdG9vbHRpcFN1YnNjcmlwdGlvbi5kaXNwb3NlKClcbiAgICAgIH1cbiAgICAgIHRvb2x0aXBTdWJzY3JpcHRpb24gPSB0b29sdGlwRm9sbG93cyA9PT0gJ01vdXNlJyA/IHRoaXMubGlzdGVuRm9yTW91c2VNb3ZlbWVudCgpIDogdGhpcy5saXN0ZW5Gb3JLZXlib2FyZE1vdmVtZW50KClcbiAgICAgIHRoaXMucmVtb3ZlVG9vbHRpcCgpXG4gICAgfSkpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChuZXcgRGlzcG9zYWJsZShmdW5jdGlvbigpIHtcbiAgICAgIHRvb2x0aXBTdWJzY3JpcHRpb24uZGlzcG9zZSgpXG4gICAgfSkpXG4gICAgdGhpcy51cGRhdGVHdXR0ZXIoKVxuICAgIHRoaXMubGlzdGVuRm9yQ3VycmVudExpbmUoKVxuICB9XG4gIGxpc3RlbkZvckN1cnJlbnRMaW5lKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy50ZXh0RWRpdG9yLm9ic2VydmVDdXJzb3JzKChjdXJzb3IpID0+IHtcbiAgICAgIGxldCBtYXJrZXJcbiAgICAgIGxldCBsYXN0UmFuZ2VcbiAgICAgIGxldCBsYXN0RW1wdHlcbiAgICAgIGNvbnN0IGhhbmRsZVBvc2l0aW9uQ2hhbmdlID0gKHsgc3RhcnQsIGVuZCB9KSA9PiB7XG4gICAgICAgIGNvbnN0IGd1dHRlciA9IHRoaXMuZ3V0dGVyXG4gICAgICAgIGlmICghZ3V0dGVyKSByZXR1cm5cbiAgICAgICAgLy8gV2UgbmVlZCB0aGF0IFJhbmdlLmZyb21PYmplY3QgaGFjayBiZWxvdyBiZWNhdXNlIHdoZW4gd2UgZm9jdXMgaW5kZXggMCBvbiBtdWx0aS1saW5lIHNlbGVjdGlvblxuICAgICAgICAvLyBlbmQuY29sdW1uIGlzIHRoZSBjb2x1bW4gb2YgdGhlIGxhc3QgbGluZSBidXQgbWFraW5nIGEgcmFuZ2Ugb3V0IG9mIHR3byBhbmQgdGhlbiBhY2Nlc2luZ1xuICAgICAgICAvLyB0aGUgZW5kIHNlZW1zIHRvIGZpeCBpdCAoYmxhY2sgbWFnaWM/KVxuICAgICAgICBjb25zdCBjdXJyZW50UmFuZ2UgPSBSYW5nZS5mcm9tT2JqZWN0KFtzdGFydCwgZW5kXSlcbiAgICAgICAgY29uc3QgbGluZXNSYW5nZSA9IFJhbmdlLmZyb21PYmplY3QoW1tzdGFydC5yb3csIDBdLCBbZW5kLnJvdywgSW5maW5pdHldXSlcbiAgICAgICAgY29uc3QgY3VycmVudEVtcHR5ID0gY3VycmVudFJhbmdlLmlzRW1wdHkoKVxuXG4gICAgICAgIC8vIE5PVEU6IEF0b20gZG9lcyBub3QgcGFpbnQgZ3V0dGVyIGlmIG11bHRpLWxpbmUgYW5kIGxhc3QgbGluZSBoYXMgemVybyBpbmRleFxuICAgICAgICBpZiAoc3RhcnQucm93ICE9PSBlbmQucm93ICYmIGN1cnJlbnRSYW5nZS5lbmQuY29sdW1uID09PSAwKSB7XG4gICAgICAgICAgbGluZXNSYW5nZS5lbmQucm93LS1cbiAgICAgICAgfVxuICAgICAgICBpZiAobGFzdFJhbmdlICYmIGxhc3RSYW5nZS5pc0VxdWFsKGxpbmVzUmFuZ2UpICYmIGN1cnJlbnRFbXB0eSA9PT0gbGFzdEVtcHR5KSByZXR1cm5cbiAgICAgICAgaWYgKG1hcmtlcikgbWFya2VyLmRlc3Ryb3koKVxuICAgICAgICBsYXN0UmFuZ2UgPSBsaW5lc1JhbmdlXG4gICAgICAgIGxhc3RFbXB0eSA9IGN1cnJlbnRFbXB0eVxuXG4gICAgICAgIG1hcmtlciA9IHRoaXMudGV4dEVkaXRvci5tYXJrU2NyZWVuUmFuZ2UobGluZXNSYW5nZSwge1xuICAgICAgICAgIGludmFsaWRhdGU6ICduZXZlcicsXG4gICAgICAgIH0pXG4gICAgICAgIGNvbnN0IGl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgICAgICAgaXRlbS5jbGFzc05hbWUgPSBgbGluZS1udW1iZXIgY3Vyc29yLWxpbmUgbGludGVyLWN1cnNvci1saW5lICR7Y3VycmVudEVtcHR5ID8gJ2N1cnNvci1saW5lLW5vLXNlbGVjdGlvbicgOiAnJ31gXG4gICAgICAgIGd1dHRlci5kZWNvcmF0ZU1hcmtlcihtYXJrZXIsIHtcbiAgICAgICAgICBpdGVtLFxuICAgICAgICAgIGNsYXNzOiAnbGludGVyLXJvdycsXG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGN1cnNvck1hcmtlciA9IGN1cnNvci5nZXRNYXJrZXIoKVxuICAgICAgY29uc3Qgc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICAgIHN1YnNjcmlwdGlvbnMuYWRkKGN1cnNvck1hcmtlci5vbkRpZENoYW5nZSgoeyBuZXdIZWFkU2NyZWVuUG9zaXRpb24sIG5ld1RhaWxTY3JlZW5Qb3NpdGlvbiB9KSA9PiB7XG4gICAgICAgIGhhbmRsZVBvc2l0aW9uQ2hhbmdlKHsgc3RhcnQ6IG5ld0hlYWRTY3JlZW5Qb3NpdGlvbiwgZW5kOiBuZXdUYWlsU2NyZWVuUG9zaXRpb24gfSlcbiAgICAgIH0pKVxuICAgICAgc3Vic2NyaXB0aW9ucy5hZGQoY3Vyc29yLm9uRGlkRGVzdHJveSgoKSA9PiB7XG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5yZW1vdmUoc3Vic2NyaXB0aW9ucylcbiAgICAgICAgc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICAgIH0pKVxuICAgICAgc3Vic2NyaXB0aW9ucy5hZGQobmV3IERpc3Bvc2FibGUoZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChtYXJrZXIpIG1hcmtlci5kZXN0cm95KClcbiAgICAgIH0pKVxuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChzdWJzY3JpcHRpb25zKVxuICAgICAgaGFuZGxlUG9zaXRpb25DaGFuZ2UoY3Vyc29yTWFya2VyLmdldFNjcmVlblJhbmdlKCkpXG4gICAgfSkpXG4gIH1cbiAgbGlzdGVuRm9yTW91c2VNb3ZlbWVudCgpIHtcbiAgICBjb25zdCBlZGl0b3JFbGVtZW50ID0gYXRvbS52aWV3cy5nZXRWaWV3KHRoaXMudGV4dEVkaXRvcilcblxuICAgIHJldHVybiBkaXNwb3NhYmxlRXZlbnQoZWRpdG9yRWxlbWVudCwgJ21vdXNlbW92ZScsIGRlYm91bmNlKChldmVudCkgPT4ge1xuICAgICAgaWYgKCFlZGl0b3JFbGVtZW50LmNvbXBvbmVudCB8fCAhaGFzUGFyZW50KGV2ZW50LnRhcmdldCwgJ2Rpdi5zY3JvbGwtdmlldycpKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgY29uc3QgdG9vbHRpcCA9IHRoaXMudG9vbHRpcFxuICAgICAgaWYgKHRvb2x0aXAgJiYgbW91c2VFdmVudE5lYXJQb3NpdGlvbih7XG4gICAgICAgIGV2ZW50LFxuICAgICAgICBlZGl0b3I6IHRoaXMudGV4dEVkaXRvcixcbiAgICAgICAgZWRpdG9yRWxlbWVudCxcbiAgICAgICAgdG9vbHRpcEVsZW1lbnQ6IHRvb2x0aXAuZWxlbWVudCxcbiAgICAgICAgc2NyZWVuUG9zaXRpb246IHRvb2x0aXAubWFya2VyLmdldFN0YXJ0U2NyZWVuUG9zaXRpb24oKSxcbiAgICAgIH0pKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICB0aGlzLmN1cnNvclBvc2l0aW9uID0gZ2V0QnVmZmVyUG9zaXRpb25Gcm9tTW91c2VFdmVudChldmVudCwgdGhpcy50ZXh0RWRpdG9yLCBlZGl0b3JFbGVtZW50KVxuICAgICAgaWYgKHRoaXMudGV4dEVkaXRvci5sYXJnZUZpbGVNb2RlKSB7XG4gICAgICAgIC8vIE5PVEU6IElnbm9yZSBpZiBmaWxlIGlzIHRvbyBsYXJnZVxuICAgICAgICB0aGlzLmN1cnNvclBvc2l0aW9uID0gbnVsbFxuICAgICAgfVxuICAgICAgaWYgKHRoaXMuY3Vyc29yUG9zaXRpb24pIHtcbiAgICAgICAgdGhpcy51cGRhdGVUb29sdGlwKHRoaXMuY3Vyc29yUG9zaXRpb24pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnJlbW92ZVRvb2x0aXAoKVxuICAgICAgfVxuICAgIH0sIDMwMCwgdHJ1ZSkpXG4gIH1cbiAgbGlzdGVuRm9yS2V5Ym9hcmRNb3ZlbWVudCgpIHtcbiAgICByZXR1cm4gdGhpcy50ZXh0RWRpdG9yLm9uRGlkQ2hhbmdlQ3Vyc29yUG9zaXRpb24oZGVib3VuY2UoKHsgbmV3QnVmZmVyUG9zaXRpb24gfSkgPT4ge1xuICAgICAgdGhpcy5jdXJzb3JQb3NpdGlvbiA9IG5ld0J1ZmZlclBvc2l0aW9uXG4gICAgICB0aGlzLnVwZGF0ZVRvb2x0aXAobmV3QnVmZmVyUG9zaXRpb24pXG4gICAgfSwgNjApKVxuICB9XG4gIHVwZGF0ZUd1dHRlcigpIHtcbiAgICB0aGlzLnJlbW92ZUd1dHRlcigpXG4gICAgaWYgKCF0aGlzLnNob3dEZWNvcmF0aW9ucykge1xuICAgICAgdGhpcy5ndXR0ZXIgPSBudWxsXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgY29uc3QgcHJpb3JpdHkgPSB0aGlzLmd1dHRlclBvc2l0aW9uID09PSAnTGVmdCcgPyAtMTAwIDogMTAwXG4gICAgdGhpcy5ndXR0ZXIgPSB0aGlzLnRleHRFZGl0b3IuYWRkR3V0dGVyKHtcbiAgICAgIG5hbWU6ICdsaW50ZXItdWktZGVmYXVsdCcsXG4gICAgICBwcmlvcml0eSxcbiAgICB9KVxuICAgIHRoaXMubWFya2Vycy5mb3JFYWNoKChtYXJrZXIsIG1lc3NhZ2UpID0+IHtcbiAgICAgIHRoaXMuZGVjb3JhdGVNYXJrZXIobWVzc2FnZSwgbWFya2VyLCAnZ3V0dGVyJylcbiAgICB9KVxuICB9XG4gIHJlbW92ZUd1dHRlcigpIHtcbiAgICBpZiAodGhpcy5ndXR0ZXIpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHRoaXMuZ3V0dGVyLmRlc3Ryb3koKVxuICAgICAgfSBjYXRjaCAoXykge1xuICAgICAgICAvKiBUaGlzIHRocm93cyB3aGVuIHRoZSB0ZXh0IGVkaXRvciBpcyBkaXNwb3NlZCAqL1xuICAgICAgfVxuICAgIH1cbiAgfVxuICB1cGRhdGVUb29sdGlwKHBvc2l0aW9uOiA/UG9pbnQpIHtcbiAgICBpZiAoIXBvc2l0aW9uIHx8ICh0aGlzLnRvb2x0aXAgJiYgdGhpcy50b29sdGlwLmlzVmFsaWQocG9zaXRpb24sIHRoaXMubWVzc2FnZXMpKSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIHRoaXMucmVtb3ZlVG9vbHRpcCgpXG4gICAgaWYgKCF0aGlzLnNob3dUb29sdGlwKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBjb25zdCBtZXNzYWdlcyA9IGZpbHRlck1lc3NhZ2VzQnlSYW5nZU9yUG9pbnQodGhpcy5tZXNzYWdlcywgdGhpcy50ZXh0RWRpdG9yLmdldFBhdGgoKSwgcG9zaXRpb24pXG4gICAgaWYgKCFtZXNzYWdlcy5sZW5ndGgpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIHRoaXMudG9vbHRpcCA9IG5ldyBUb29sdGlwKG1lc3NhZ2VzLCBwb3NpdGlvbiwgdGhpcy50ZXh0RWRpdG9yKVxuICAgIHRoaXMudG9vbHRpcC5vbkRpZERlc3Ryb3koKCkgPT4ge1xuICAgICAgdGhpcy50b29sdGlwID0gbnVsbFxuICAgIH0pXG4gIH1cbiAgcmVtb3ZlVG9vbHRpcCgpIHtcbiAgICBpZiAodGhpcy50b29sdGlwKSB7XG4gICAgICB0aGlzLnRvb2x0aXAubWFya2VyLmRlc3Ryb3koKVxuICAgIH1cbiAgfVxuICBhcHBseShhZGRlZDogQXJyYXk8TGludGVyTWVzc2FnZT4sIHJlbW92ZWQ6IEFycmF5PExpbnRlck1lc3NhZ2U+KSB7XG4gICAgY29uc3QgdGV4dEJ1ZmZlciA9IHRoaXMudGV4dEVkaXRvci5nZXRCdWZmZXIoKVxuXG4gICAgZm9yIChsZXQgaSA9IDAsIGxlbmd0aCA9IHJlbW92ZWQubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSByZW1vdmVkW2ldXG4gICAgICBjb25zdCBtYXJrZXIgPSB0aGlzLm1hcmtlcnMuZ2V0KG1lc3NhZ2UpXG4gICAgICBpZiAobWFya2VyKSB7XG4gICAgICAgIG1hcmtlci5kZXN0cm95KClcbiAgICAgIH1cbiAgICAgIHRoaXMubWVzc2FnZXMuZGVsZXRlKG1lc3NhZ2UpXG4gICAgICB0aGlzLm1hcmtlcnMuZGVsZXRlKG1lc3NhZ2UpXG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IDAsIGxlbmd0aCA9IGFkZGVkLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBtZXNzYWdlID0gYWRkZWRbaV1cbiAgICAgIGNvbnN0IG1hcmtlclJhbmdlID0gJHJhbmdlKG1lc3NhZ2UpXG4gICAgICBpZiAoIW1hcmtlclJhbmdlKSB7XG4gICAgICAgIC8vIE9ubHkgZm9yIGJhY2t3YXJkIGNvbXBhdGliaWxpdHlcbiAgICAgICAgY29udGludWVcbiAgICAgIH1cbiAgICAgIGNvbnN0IG1hcmtlciA9IHRleHRCdWZmZXIubWFya1JhbmdlKG1hcmtlclJhbmdlLCB7XG4gICAgICAgIGludmFsaWRhdGU6ICduZXZlcicsXG4gICAgICB9KVxuICAgICAgdGhpcy5tYXJrZXJzLnNldChtZXNzYWdlLCBtYXJrZXIpXG4gICAgICB0aGlzLm1lc3NhZ2VzLmFkZChtZXNzYWdlKVxuICAgICAgbWFya2VyLm9uRGlkQ2hhbmdlKCh7IG9sZEhlYWRQb3NpdGlvbiwgbmV3SGVhZFBvc2l0aW9uLCBpc1ZhbGlkIH0pID0+IHtcbiAgICAgICAgaWYgKCFpc1ZhbGlkIHx8IChuZXdIZWFkUG9zaXRpb24ucm93ID09PSAwICYmIG9sZEhlYWRQb3NpdGlvbi5yb3cgIT09IDApKSB7XG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1lc3NhZ2UudmVyc2lvbiA9PT0gMSkge1xuICAgICAgICAgIG1lc3NhZ2UucmFuZ2UgPSBtYXJrZXIucHJldmlvdXNFdmVudFN0YXRlLnJhbmdlXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbWVzc2FnZS5sb2NhdGlvbi5wb3NpdGlvbiA9IG1hcmtlci5wcmV2aW91c0V2ZW50U3RhdGUucmFuZ2VcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIHRoaXMuZGVjb3JhdGVNYXJrZXIobWVzc2FnZSwgbWFya2VyKVxuICAgIH1cblxuICAgIHRoaXMudXBkYXRlVG9vbHRpcCh0aGlzLmN1cnNvclBvc2l0aW9uKVxuICB9XG4gIGRlY29yYXRlTWFya2VyKG1lc3NhZ2U6IExpbnRlck1lc3NhZ2UsIG1hcmtlcjogT2JqZWN0LCBwYWludDogJ2d1dHRlcicgfCAnZWRpdG9yJyB8ICdib3RoJyA9ICdib3RoJykge1xuICAgIGlmIChwYWludCA9PT0gJ2JvdGgnIHx8IHBhaW50ID09PSAnZWRpdG9yJykge1xuICAgICAgdGhpcy50ZXh0RWRpdG9yLmRlY29yYXRlTWFya2VyKG1hcmtlciwge1xuICAgICAgICB0eXBlOiAnaGlnaGxpZ2h0JyxcbiAgICAgICAgY2xhc3M6IGBsaW50ZXItaGlnaGxpZ2h0IGxpbnRlci0ke21lc3NhZ2Uuc2V2ZXJpdHl9YCxcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgY29uc3QgZ3V0dGVyID0gdGhpcy5ndXR0ZXJcbiAgICBpZiAoZ3V0dGVyICYmIChwYWludCA9PT0gJ2JvdGgnIHx8IHBhaW50ID09PSAnZ3V0dGVyJykpIHtcbiAgICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgICAgIGVsZW1lbnQuY2xhc3NOYW1lID0gYGxpbnRlci1ndXR0ZXIgbGludGVyLWhpZ2hsaWdodCBsaW50ZXItJHttZXNzYWdlLnNldmVyaXR5fSBpY29uIGljb24tJHttZXNzYWdlLmljb24gfHwgJ3ByaW1pdGl2ZS1kb3QnfWBcbiAgICAgIGd1dHRlci5kZWNvcmF0ZU1hcmtlcihtYXJrZXIsIHtcbiAgICAgICAgY2xhc3M6ICdsaW50ZXItcm93JyxcbiAgICAgICAgaXRlbTogZWxlbWVudCxcbiAgICAgIH0pXG4gICAgfVxuICB9XG4gIG9uRGlkRGVzdHJveShjYWxsYmFjazogRnVuY3Rpb24pOiBEaXNwb3NhYmxlIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtZGVzdHJveScsIGNhbGxiYWNrKVxuICB9XG4gIGRpc3Bvc2UoKSB7XG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1kZXN0cm95JylcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgdGhpcy5yZW1vdmVHdXR0ZXIoKVxuICAgIHRoaXMucmVtb3ZlVG9vbHRpcCgpXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBFZGl0b3JcbiJdfQ==