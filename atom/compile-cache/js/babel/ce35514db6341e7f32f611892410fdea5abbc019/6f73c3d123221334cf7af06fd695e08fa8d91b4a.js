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
      if (!_this.showTooltip && _this.tooltip) {
        _this.removeTooltip();
      }
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
      _this.tooltipFollows = tooltipFollows;
      if (tooltipSubscription) {
        tooltipSubscription.dispose();
      }
      tooltipSubscription = tooltipFollows === 'Mouse' ? _this.listenForMouseMovement() : _this.listenForKeyboardMovement();
      _this.removeTooltip();
    }));
    this.subscriptions.add(new _atom.Disposable(function () {
      tooltipSubscription.dispose();
    }));
    // NOTE: The reason we are watching cursor position and not some text change event is that
    // Some programs like gofmt setText all the time, so text changes but because they set about
    // the same text as before so cursor position doesn't change, unless the cursor is in changed
    // text area in which case it changes, that's why we remove the tooltip then
    this.subscriptions.add(textEditor.onDidChangeCursorPosition(function () {
      if (_this.tooltipFollows === 'Mouse') {
        _this.removeTooltip();
      }
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
      }, 16));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvZWRpdG9yL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OzswQkFFcUIsYUFBYTs7OzsrQkFDTixrQkFBa0I7Ozs7b0JBQ2tCLE1BQU07O3VCQUdsRCxZQUFZOzs7O3VCQUNxQixZQUFZOzt3QkFDa0IsV0FBVzs7SUFHeEYsTUFBTTtBQWVDLFdBZlAsTUFBTSxDQWVFLFVBQXNCLEVBQUU7OzswQkFmaEMsTUFBTTs7QUFnQlIsUUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUE7QUFDbkIsUUFBSSxDQUFDLE9BQU8sR0FBRyxtQkFBYSxDQUFBO0FBQzVCLFFBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTtBQUN4QixRQUFJLENBQUMsUUFBUSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7QUFDekIsUUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUE7QUFDNUIsUUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQTs7QUFFOUMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQ3BDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLCtCQUErQixFQUFFLFVBQUMsV0FBVyxFQUFLO0FBQzNGLFlBQUssV0FBVyxHQUFHLFdBQVcsQ0FBQTtBQUM5QixVQUFJLENBQUMsTUFBSyxXQUFXLElBQUksTUFBSyxPQUFPLEVBQUU7QUFDckMsY0FBSyxhQUFhLEVBQUUsQ0FBQTtPQUNyQjtLQUNGLENBQUMsQ0FBQyxDQUFBO0FBQ0gsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsb0NBQW9DLEVBQUUsVUFBQyxnQkFBZ0IsRUFBSztBQUNyRyxZQUFLLGdCQUFnQixHQUFH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QUNqQixnREFBa0MsT0FBTyxDQUFDLFFBQVEsQUFBRTtTQUNyRCxDQUFDLENBQUE7T0FDSDs7QUFFRCxVQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFBO0FBQzFCLFVBQUksTUFBTSxLQUFLLEtBQUssS0FBSyxNQUFNLElBQUksS0FBSyxLQUFLLFFBQVEsQ0FBQSxBQUFDLEVBQUU7QUFDdEQsWUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUM5QyxlQUFPLENBQUMsU0FBUyw4Q0FBNEMsT0FBTyxDQUFDLFFBQVEsb0JBQWMsT0FBTyxDQUFDLElBQUksSUFBSSxlQUFlLENBQUEsQUFBRSxDQUFBO0FBQzVILGNBQU0sQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFO0FBQzVCLG1CQUFPLFlBQVk7QUFDbkIsY0FBSSxFQUFFLE9BQU87U0FDZCxDQUFDLENBQUE7T0FDSDtLQUNGOzs7V0FDVyxzQkFBQyxRQUFrQixFQUFjO0FBQzNDLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLFFBQVEsQ0FBQyxDQUFBO0tBQ2hEOzs7V0FDTSxtQkFBRztBQUNSLFVBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFBO0FBQ2hDLFVBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDNUIsVUFBSSxDQUFDLFlBQVksRUFBRSxDQUFBO0FBQ25CLFVBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQTtLQUNyQjs7O1NBcFJHLE1BQU07OztBQXVSWixNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQSIsImZpbGUiOiIvVXNlcnMvYWgvLmF0b20vcGFja2FnZXMvbGludGVyLXVpLWRlZmF1bHQvbGliL2VkaXRvci9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCBkZWJvdW5jZSBmcm9tICdzYi1kZWJvdW5jZSdcbmltcG9ydCBkaXNwb3NhYmxlRXZlbnQgZnJvbSAnZGlzcG9zYWJsZS1ldmVudCdcbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUsIERpc3Bvc2FibGUsIEVtaXR0ZXIsIFJhbmdlIH0gZnJvbSAnYXRvbSdcbmltcG9ydCB0eXBlIHsgVGV4dEVkaXRvciwgQnVmZmVyTWFya2VyLCBUZXh0RWRpdG9yR3V0dGVyLCBQb2ludCB9IGZyb20gJ2F0b20nXG5cbmltcG9ydCBUb29sdGlwIGZyb20gJy4uL3Rvb2x0aXAnXG5pbXBvcnQgeyAkcmFuZ2UsIGZpbHRlck1lc3NhZ2VzQnlSYW5nZU9yUG9pbnQgfSBmcm9tICcuLi9oZWxwZXJzJ1xuaW1wb3J0IHsgaGFzUGFyZW50LCBtb3VzZUV2ZW50TmVhclBvc2l0aW9uLCBnZXRCdWZmZXJQb3NpdGlvbkZyb21Nb3VzZUV2ZW50IH0gZnJvbSAnLi9oZWxwZXJzJ1xuaW1wb3J0IHR5cGUgeyBMaW50ZXJNZXNzYWdlIH0gZnJvbSAnLi4vdHlwZXMnXG5cbmNsYXNzIEVkaXRvciB7XG4gIGd1dHRlcjogP1RleHRFZGl0b3JHdXR0ZXI7XG4gIHRvb2x0aXA6ID9Ub29sdGlwO1xuICBlbWl0dGVyOiBFbWl0dGVyO1xuICBtYXJrZXJzOiBNYXA8TGludGVyTWVzc2FnZSwgQnVmZmVyTWFya2VyPjtcbiAgbWVzc2FnZXM6IFNldDxMaW50ZXJNZXNzYWdlPjtcbiAgdGV4dEVkaXRvcjogVGV4dEVkaXRvcjtcbiAgc2hvd1Rvb2x0aXA6IGJvb2xlYW47XG4gIHN1YnNjcmlwdGlvbnM6IENvbXBvc2l0ZURpc3Bvc2FibGU7XG4gIGN1cnNvclBvc2l0aW9uOiA/UG9pbnQ7XG4gIGd1dHRlclBvc2l0aW9uOiBib29sZWFuO1xuICB0b29sdGlwRm9sbG93czogc3RyaW5nO1xuICBzaG93RGVjb3JhdGlvbnM6IGJvb2xlYW47XG4gIHNob3dQcm92aWRlck5hbWU6IGJvb2xlYW47XG5cbiAgY29uc3RydWN0b3IodGV4dEVkaXRvcjogVGV4dEVkaXRvcikge1xuICAgIHRoaXMudG9vbHRpcCA9IG51bGxcbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpXG4gICAgdGhpcy5tYXJrZXJzID0gbmV3IE1hcCgpXG4gICAgdGhpcy5tZXNzYWdlcyA9IG5ldyBTZXQoKVxuICAgIHRoaXMudGV4dEVkaXRvciA9IHRleHRFZGl0b3JcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuZW1pdHRlcilcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci11aS1kZWZhdWx0LnNob3dUb29sdGlwJywgKHNob3dUb29sdGlwKSA9PiB7XG4gICAgICB0aGlzLnNob3dUb29sdGlwID0gc2hvd1Rvb2x0aXBcbiAgICAgIGlmICghdGhpcy5zaG93VG9vbHRpcCAmJiB0aGlzLnRvb2x0aXApIHtcbiAgICAgICAgdGhpcy5yZW1vdmVUb29sdGlwKClcbiAgICAgIH1cbiAgICB9KSlcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci11aS1kZWZhdWx0LnNob3dQcm92aWRlck5hbWUnLCAoc2hvd1Byb3ZpZGVyTmFtZSkgPT4ge1xuICAgICAgdGhpcy5zaG93UHJvdmlkZXJOYW1lID0gc2hvd1Byb3ZpZGVyTmFtZVxuICAgIH0pKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLXVpLWRlZmF1bHQuc2hvd0RlY29yYXRpb25zJywgKHNob3dEZWNvcmF0aW9ucykgPT4ge1xuICAgICAgY29uc3Qgbm90SW5pdGlhbCA9IHR5cGVvZiB0aGlzLnNob3dEZWNvcmF0aW9ucyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAgIHRoaXMuc2hvd0RlY29yYXRpb25zID0gc2hvd0RlY29yYXRpb25zXG4gICAgICBpZiAobm90SW5pdGlhbCkge1xuICAgICAgICB0aGlzLnVwZGF0ZUd1dHRlcigpXG4gICAgICB9XG4gICAgfSkpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItdWktZGVmYXVsdC5ndXR0ZXJQb3NpdGlvbicsIChndXR0ZXJQb3NpdGlvbikgPT4ge1xuICAgICAgY29uc3Qgbm90SW5pdGlhbCA9IHR5cGVvZiB0aGlzLmd1dHRlclBvc2l0aW9uICE9PSAndW5kZWZpbmVkJ1xuICAgICAgdGhpcy5ndXR0ZXJQb3NpdGlvbiA9IGd1dHRlclBvc2l0aW9uXG4gICAgICBpZiAobm90SW5pdGlhbCkge1xuICAgICAgICB0aGlzLnVwZGF0ZUd1dHRlcigpXG4gICAgICB9XG4gICAgfSkpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0ZXh0RWRpdG9yLm9uRGlkRGVzdHJveSgoKSA9PiB7XG4gICAgICB0aGlzLmRpc3Bvc2UoKVxuICAgIH0pKVxuXG4gICAgbGV0IHRvb2x0aXBTdWJzY3JpcHRpb25cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci11aS1kZWZhdWx0LnRvb2x0aXBGb2xsb3dzJywgKHRvb2x0aXBGb2xsb3dzKSA9PiB7XG4gICAgICB0aGlzLnRvb2x0aXBGb2xsb3dzID0gdG9vbHRpcEZvbGxvd3NcbiAgICAgIGlmICh0b29sdGlwU3Vic2NyaXB0aW9uKSB7XG4gICAgICAgIHRvb2x0aXBTdWJzY3JpcHRpb24uZGlzcG9zZSgpXG4gICAgICB9XG4gICAgICB0b29sdGlwU3Vic2NyaXB0aW9uID0gdG9vbHRpcEZvbGxvd3MgPT09ICdNb3VzZScgPyB0aGlzLmxpc3RlbkZvck1vdXNlTW92ZW1lbnQoKSA6IHRoaXMubGlzdGVuRm9yS2V5Ym9hcmRNb3ZlbWVudCgpXG4gICAgICB0aGlzLnJlbW92ZVRvb2x0aXAoKVxuICAgIH0pKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQobmV3IERpc3Bvc2FibGUoZnVuY3Rpb24oKSB7XG4gICAgICB0b29sdGlwU3Vic2NyaXB0aW9uLmRpc3Bvc2UoKVxuICAgIH0pKVxuICAgIC8vIE5PVEU6IFRoZSByZWFzb24gd2UgYXJlIHdhdGNoaW5nIGN1cnNvciBwb3NpdGlvbiBhbmQgbm90IHNvbWUgdGV4dCBjaGFuZ2UgZXZlbnQgaXMgdGhhdFxuICAgIC8vIFNvbWUgcHJvZ3JhbXMgbGlrZSBnb2ZtdCBzZXRUZXh0IGFsbCB0aGUgdGltZSwgc28gdGV4dCBjaGFuZ2VzIGJ1dCBiZWNhdXNlIHRoZXkgc2V0IGFib3V0XG4gICAgLy8gdGhlIHNhbWUgdGV4dCBhcyBiZWZvcmUgc28gY3Vyc29yIHBvc2l0aW9uIGRvZXNuJ3QgY2hhbmdlLCB1bmxlc3MgdGhlIGN1cnNvciBpcyBpbiBjaGFuZ2VkXG4gICAgLy8gdGV4dCBhcmVhIGluIHdoaWNoIGNhc2UgaXQgY2hhbmdlcywgdGhhdCdzIHdoeSB3ZSByZW1vdmUgdGhlIHRvb2x0aXAgdGhlblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGV4dEVkaXRvci5vbkRpZENoYW5nZUN1cnNvclBvc2l0aW9uKCgpID0+IHtcbiAgICAgIGlmICh0aGlzLnRvb2x0aXBGb2xsb3dzID09PSAnTW91c2UnKSB7XG4gICAgICAgIHRoaXMucmVtb3ZlVG9vbHRpcCgpXG4gICAgICB9XG4gICAgfSkpXG4gICAgdGhpcy51cGRhdGVHdXR0ZXIoKVxuICAgIHRoaXMubGlzdGVuRm9yQ3VycmVudExpbmUoKVxuICB9XG4gIGxpc3RlbkZvckN1cnJlbnRMaW5lKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy50ZXh0RWRpdG9yLm9ic2VydmVDdXJzb3JzKChjdXJzb3IpID0+IHtcbiAgICAgIGxldCBtYXJrZXJcbiAgICAgIGxldCBsYXN0UmFuZ2VcbiAgICAgIGxldCBsYXN0RW1wdHlcbiAgICAgIGNvbnN0IGhhbmRsZVBvc2l0aW9uQ2hhbmdlID0gKHsgc3RhcnQsIGVuZCB9KSA9PiB7XG4gICAgICAgIGNvbnN0IGd1dHRlciA9IHRoaXMuZ3V0dGVyXG4gICAgICAgIGlmICghZ3V0dGVyKSByZXR1cm5cbiAgICAgICAgLy8gV2UgbmVlZCB0aGF0IFJhbmdlLmZyb21PYmplY3QgaGFjayBiZWxvdyBiZWNhdXNlIHdoZW4gd2UgZm9jdXMgaW5kZXggMCBvbiBtdWx0aS1saW5lIHNlbGVjdGlvblxuICAgICAgICAvLyBlbmQuY29sdW1uIGlzIHRoZSBjb2x1bW4gb2YgdGhlIGxhc3QgbGluZSBidXQgbWFraW5nIGEgcmFuZ2Ugb3V0IG9mIHR3byBhbmQgdGhlbiBhY2Nlc2luZ1xuICAgICAgICAvLyB0aGUgZW5kIHNlZW1zIHRvIGZpeCBpdCAoYmxhY2sgbWFnaWM/KVxuICAgICAgICBjb25zdCBjdXJyZW50UmFuZ2UgPSBSYW5nZS5mcm9tT2JqZWN0KFtzdGFydCwgZW5kXSlcbiAgICAgICAgY29uc3QgbGluZXNSYW5nZSA9IFJhbmdlLmZyb21PYmplY3QoW1tzdGFydC5yb3csIDBdLCBbZW5kLnJvdywgSW5maW5pdHldXSlcbiAgICAgICAgY29uc3QgY3VycmVudEVtcHR5ID0gY3VycmVudFJhbmdlLmlzRW1wdHkoKVxuXG4gICAgICAgIC8vIE5PVEU6IEF0b20gZG9lcyBub3QgcGFpbnQgZ3V0dGVyIGlmIG11bHRpLWxpbmUgYW5kIGxhc3QgbGluZSBoYXMgemVybyBpbmRleFxuICAgICAgICBpZiAoc3RhcnQucm93ICE9PSBlbmQucm93ICYmIGN1cnJlbnRSYW5nZS5lbmQuY29sdW1uID09PSAwKSB7XG4gICAgICAgICAgbGluZXNSYW5nZS5lbmQucm93LS1cbiAgICAgICAgfVxuICAgICAgICBpZiAobGFzdFJhbmdlICYmIGxhc3RSYW5nZS5pc0VxdWFsKGxpbmVzUmFuZ2UpICYmIGN1cnJlbnRFbXB0eSA9PT0gbGFzdEVtcHR5KSByZXR1cm5cbiAgICAgICAgaWYgKG1hcmtlcikgbWFya2VyLmRlc3Ryb3koKVxuICAgICAgICBsYXN0UmFuZ2UgPSBsaW5lc1JhbmdlXG4gICAgICAgIGxhc3RFbXB0eSA9IGN1cnJlbnRFbXB0eVxuXG4gICAgICAgIG1hcmtlciA9IHRoaXMudGV4dEVkaXRvci5tYXJrU2NyZWVuUmFuZ2UobGluZXNSYW5nZSwge1xuICAgICAgICAgIGludmFsaWRhdGU6ICduZXZlcicsXG4gICAgICAgIH0pXG4gICAgICAgIGNvbnN0IGl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgICAgICAgaXRlbS5jbGFzc05hbWUgPSBgbGluZS1udW1iZXIgY3Vyc29yLWxpbmUgbGludGVyLWN1cnNvci1saW5lICR7Y3VycmVudEVtcHR5ID8gJ2N1cnNvci1saW5lLW5vLXNlbGVjdGlvbicgOiAnJ31gXG4gICAgICAgIGd1dHRlci5kZWNvcmF0ZU1hcmtlcihtYXJrZXIsIHtcbiAgICAgICAgICBpdGVtLFxuICAgICAgICAgIGNsYXNzOiAnbGludGVyLXJvdycsXG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGN1cnNvck1hcmtlciA9IGN1cnNvci5nZXRNYXJrZXIoKVxuICAgICAgY29uc3Qgc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICAgIHN1YnNjcmlwdGlvbnMuYWRkKGN1cnNvck1hcmtlci5vbkRpZENoYW5nZSgoeyBuZXdIZWFkU2NyZWVuUG9zaXRpb24sIG5ld1RhaWxTY3JlZW5Qb3NpdGlvbiB9KSA9PiB7XG4gICAgICAgIGhhbmRsZVBvc2l0aW9uQ2hhbmdlKHsgc3RhcnQ6IG5ld0hlYWRTY3JlZW5Qb3NpdGlvbiwgZW5kOiBuZXdUYWlsU2NyZWVuUG9zaXRpb24gfSlcbiAgICAgIH0pKVxuICAgICAgc3Vic2NyaXB0aW9ucy5hZGQoY3Vyc29yLm9uRGlkRGVzdHJveSgoKSA9PiB7XG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5yZW1vdmUoc3Vic2NyaXB0aW9ucylcbiAgICAgICAgc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICAgIH0pKVxuICAgICAgc3Vic2NyaXB0aW9ucy5hZGQobmV3IERpc3Bvc2FibGUoZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChtYXJrZXIpIG1hcmtlci5kZXN0cm95KClcbiAgICAgIH0pKVxuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChzdWJzY3JpcHRpb25zKVxuICAgICAgaGFuZGxlUG9zaXRpb25DaGFuZ2UoY3Vyc29yTWFya2VyLmdldFNjcmVlblJhbmdlKCkpXG4gICAgfSkpXG4gIH1cbiAgbGlzdGVuRm9yTW91c2VNb3ZlbWVudCgpIHtcbiAgICBjb25zdCBlZGl0b3JFbGVtZW50ID0gYXRvbS52aWV3cy5nZXRWaWV3KHRoaXMudGV4dEVkaXRvcilcblxuICAgIHJldHVybiBkaXNwb3NhYmxlRXZlbnQoZWRpdG9yRWxlbWVudCwgJ21vdXNlbW92ZScsIGRlYm91bmNlKChldmVudCkgPT4ge1xuICAgICAgaWYgKCFlZGl0b3JFbGVtZW50LmNvbXBvbmVudCB8fCAhaGFzUGFyZW50KGV2ZW50LnRhcmdldCwgJ2Rpdi5zY3JvbGwtdmlldycpKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgY29uc3QgdG9vbHRpcCA9IHRoaXMudG9vbHRpcFxuICAgICAgaWYgKHRvb2x0aXAgJiYgbW91c2VFdmVudE5lYXJQb3NpdGlvbih7XG4gICAgICAgIGV2ZW50LFxuICAgICAgICBlZGl0b3I6IHRoaXMudGV4dEVkaXRvcixcbiAgICAgICAgZWRpdG9yRWxlbWVudCxcbiAgICAgICAgdG9vbHRpcEVsZW1lbnQ6IHRvb2x0aXAuZWxlbWVudCxcbiAgICAgICAgc2NyZWVuUG9zaXRpb246IHRvb2x0aXAubWFya2VyLmdldFN0YXJ0U2NyZWVuUG9zaXRpb24oKSxcbiAgICAgIH0pKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICB0aGlzLmN1cnNvclBvc2l0aW9uID0gZ2V0QnVmZmVyUG9zaXRpb25Gcm9tTW91c2VFdmVudChldmVudCwgdGhpcy50ZXh0RWRpdG9yLCBlZGl0b3JFbGVtZW50KVxuICAgICAgaWYgKHRoaXMudGV4dEVkaXRvci5sYXJnZUZpbGVNb2RlKSB7XG4gICAgICAgIC8vIE5PVEU6IElnbm9yZSBpZiBmaWxlIGlzIHRvbyBsYXJnZVxuICAgICAgICB0aGlzLmN1cnNvclBvc2l0aW9uID0gbnVsbFxuICAgICAgfVxuICAgICAgaWYgKHRoaXMuY3Vyc29yUG9zaXRpb24pIHtcbiAgICAgICAgdGhpcy51cGRhdGVUb29sdGlwKHRoaXMuY3Vyc29yUG9zaXRpb24pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnJlbW92ZVRvb2x0aXAoKVxuICAgICAgfVxuICAgIH0sIDMwMCwgdHJ1ZSkpXG4gIH1cbiAgbGlzdGVuRm9yS2V5Ym9hcmRNb3ZlbWVudCgpIHtcbiAgICByZXR1cm4gdGhpcy50ZXh0RWRpdG9yLm9uRGlkQ2hhbmdlQ3Vyc29yUG9zaXRpb24oZGVib3VuY2UoKHsgbmV3QnVmZmVyUG9zaXRpb24gfSkgPT4ge1xuICAgICAgdGhpcy5jdXJzb3JQb3NpdGlvbiA9IG5ld0J1ZmZlclBvc2l0aW9uXG4gICAgICB0aGlzLnVwZGF0ZVRvb2x0aXAobmV3QnVmZmVyUG9zaXRpb24pXG4gICAgfSwgMTYpKVxuICB9XG4gIHVwZGF0ZUd1dHRlcigpIHtcbiAgICB0aGlzLnJlbW92ZUd1dHRlcigpXG4gICAgaWYgKCF0aGlzLnNob3dEZWNvcmF0aW9ucykge1xuICAgICAgdGhpcy5ndXR0ZXIgPSBudWxsXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgY29uc3QgcHJpb3JpdHkgPSB0aGlzLmd1dHRlclBvc2l0aW9uID09PSAnTGVmdCcgPyAtMTAwIDogMTAwXG4gICAgdGhpcy5ndXR0ZXIgPSB0aGlzLnRleHRFZGl0b3IuYWRkR3V0dGVyKHtcbiAgICAgIG5hbWU6ICdsaW50ZXItdWktZGVmYXVsdCcsXG4gICAgICBwcmlvcml0eSxcbiAgICB9KVxuICAgIHRoaXMubWFya2Vycy5mb3JFYWNoKChtYXJrZXIsIG1lc3NhZ2UpID0+IHtcbiAgICAgIHRoaXMuZGVjb3JhdGVNYXJrZXIobWVzc2FnZSwgbWFya2VyLCAnZ3V0dGVyJylcbiAgICB9KVxuICB9XG4gIHJlbW92ZUd1dHRlcigpIHtcbiAgICBpZiAodGhpcy5ndXR0ZXIpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHRoaXMuZ3V0dGVyLmRlc3Ryb3koKVxuICAgICAgfSBjYXRjaCAoXykge1xuICAgICAgICAvKiBUaGlzIHRocm93cyB3aGVuIHRoZSB0ZXh0IGVkaXRvciBpcyBkaXNwb3NlZCAqL1xuICAgICAgfVxuICAgIH1cbiAgfVxuICB1cGRhdGVUb29sdGlwKHBvc2l0aW9uOiA/UG9pbnQpIHtcbiAgICBpZiAoIXBvc2l0aW9uIHx8ICh0aGlzLnRvb2x0aXAgJiYgdGhpcy50b29sdGlwLmlzVmFsaWQocG9zaXRpb24sIHRoaXMubWVzc2FnZXMpKSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIHRoaXMucmVtb3ZlVG9vbHRpcCgpXG4gICAgaWYgKCF0aGlzLnNob3dUb29sdGlwKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBjb25zdCBtZXNzYWdlcyA9IGZpbHRlck1lc3NhZ2VzQnlSYW5nZU9yUG9pbnQodGhpcy5tZXNzYWdlcywgdGhpcy50ZXh0RWRpdG9yLmdldFBhdGgoKSwgcG9zaXRpb24pXG4gICAgaWYgKCFtZXNzYWdlcy5sZW5ndGgpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIHRoaXMudG9vbHRpcCA9IG5ldyBUb29sdGlwKG1lc3NhZ2VzLCBwb3NpdGlvbiwgdGhpcy50ZXh0RWRpdG9yKVxuICAgIHRoaXMudG9vbHRpcC5vbkRpZERlc3Ryb3koKCkgPT4ge1xuICAgICAgdGhpcy50b29sdGlwID0gbnVsbFxuICAgIH0pXG4gIH1cbiAgcmVtb3ZlVG9vbHRpcCgpIHtcbiAgICBpZiAodGhpcy50b29sdGlwKSB7XG4gICAgICB0aGlzLnRvb2x0aXAubWFya2VyLmRlc3Ryb3koKVxuICAgIH1cbiAgfVxuICBhcHBseShhZGRlZDogQXJyYXk8TGludGVyTWVzc2FnZT4sIHJlbW92ZWQ6IEFycmF5PExpbnRlck1lc3NhZ2U+KSB7XG4gICAgY29uc3QgdGV4dEJ1ZmZlciA9IHRoaXMudGV4dEVkaXRvci5nZXRCdWZmZXIoKVxuXG4gICAgZm9yIChsZXQgaSA9IDAsIGxlbmd0aCA9IHJlbW92ZWQubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSByZW1vdmVkW2ldXG4gICAgICBjb25zdCBtYXJrZXIgPSB0aGlzLm1hcmtlcnMuZ2V0KG1lc3NhZ2UpXG4gICAgICBpZiAobWFya2VyKSB7XG4gICAgICAgIG1hcmtlci5kZXN0cm95KClcbiAgICAgIH1cbiAgICAgIHRoaXMubWVzc2FnZXMuZGVsZXRlKG1lc3NhZ2UpXG4gICAgICB0aGlzLm1hcmtlcnMuZGVsZXRlKG1lc3NhZ2UpXG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IDAsIGxlbmd0aCA9IGFkZGVkLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBtZXNzYWdlID0gYWRkZWRbaV1cbiAgICAgIGNvbnN0IG1hcmtlclJhbmdlID0gJHJhbmdlKG1lc3NhZ2UpXG4gICAgICBpZiAoIW1hcmtlclJhbmdlKSB7XG4gICAgICAgIC8vIE9ubHkgZm9yIGJhY2t3YXJkIGNvbXBhdGliaWxpdHlcbiAgICAgICAgY29udGludWVcbiAgICAgIH1cbiAgICAgIGNvbnN0IG1hcmtlciA9IHRleHRCdWZmZXIubWFya1JhbmdlKG1hcmtlclJhbmdlLCB7XG4gICAgICAgIGludmFsaWRhdGU6ICduZXZlcicsXG4gICAgICB9KVxuICAgICAgdGhpcy5tYXJrZXJzLnNldChtZXNzYWdlLCBtYXJrZXIpXG4gICAgICB0aGlzLm1lc3NhZ2VzLmFkZChtZXNzYWdlKVxuICAgICAgbWFya2VyLm9uRGlkQ2hhbmdlKCh7IG9sZEhlYWRQb3NpdGlvbiwgbmV3SGVhZFBvc2l0aW9uLCBpc1ZhbGlkIH0pID0+IHtcbiAgICAgICAgaWYgKCFpc1ZhbGlkIHx8IChuZXdIZWFkUG9zaXRpb24ucm93ID09PSAwICYmIG9sZEhlYWRQb3NpdGlvbi5yb3cgIT09IDApKSB7XG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1lc3NhZ2UudmVyc2lvbiA9PT0gMSkge1xuICAgICAgICAgIG1lc3NhZ2UucmFuZ2UgPSBtYXJrZXIucHJldmlvdXNFdmVudFN0YXRlLnJhbmdlXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbWVzc2FnZS5sb2NhdGlvbi5wb3NpdGlvbiA9IG1hcmtlci5wcmV2aW91c0V2ZW50U3RhdGUucmFuZ2VcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIHRoaXMuZGVjb3JhdGVNYXJrZXIobWVzc2FnZSwgbWFya2VyKVxuICAgIH1cblxuICAgIHRoaXMudXBkYXRlVG9vbHRpcCh0aGlzLmN1cnNvclBvc2l0aW9uKVxuICB9XG4gIGRlY29yYXRlTWFya2VyKG1lc3NhZ2U6IExpbnRlck1lc3NhZ2UsIG1hcmtlcjogT2JqZWN0LCBwYWludDogJ2d1dHRlcicgfCAnZWRpdG9yJyB8ICdib3RoJyA9ICdib3RoJykge1xuICAgIGlmIChwYWludCA9PT0gJ2JvdGgnIHx8IHBhaW50ID09PSAnZWRpdG9yJykge1xuICAgICAgdGhpcy50ZXh0RWRpdG9yLmRlY29yYXRlTWFya2VyKG1hcmtlciwge1xuICAgICAgICB0eXBlOiAnaGlnaGxpZ2h0JyxcbiAgICAgICAgY2xhc3M6IGBsaW50ZXItaGlnaGxpZ2h0IGxpbnRlci0ke21lc3NhZ2Uuc2V2ZXJpdHl9YCxcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgY29uc3QgZ3V0dGVyID0gdGhpcy5ndXR0ZXJcbiAgICBpZiAoZ3V0dGVyICYmIChwYWludCA9PT0gJ2JvdGgnIHx8IHBhaW50ID09PSAnZ3V0dGVyJykpIHtcbiAgICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgICAgIGVsZW1lbnQuY2xhc3NOYW1lID0gYGxpbnRlci1ndXR0ZXIgbGludGVyLWhpZ2hsaWdodCBsaW50ZXItJHttZXNzYWdlLnNldmVyaXR5fSBpY29uIGljb24tJHttZXNzYWdlLmljb24gfHwgJ3ByaW1pdGl2ZS1kb3QnfWBcbiAgICAgIGd1dHRlci5kZWNvcmF0ZU1hcmtlcihtYXJrZXIsIHtcbiAgICAgICAgY2xhc3M6ICdsaW50ZXItcm93JyxcbiAgICAgICAgaXRlbTogZWxlbWVudCxcbiAgICAgIH0pXG4gICAgfVxuICB9XG4gIG9uRGlkRGVzdHJveShjYWxsYmFjazogRnVuY3Rpb24pOiBEaXNwb3NhYmxlIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtZGVzdHJveScsIGNhbGxiYWNrKVxuICB9XG4gIGRpc3Bvc2UoKSB7XG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1kZXN0cm95JylcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgdGhpcy5yZW1vdmVHdXR0ZXIoKVxuICAgIHRoaXMucmVtb3ZlVG9vbHRpcCgpXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBFZGl0b3JcbiJdfQ==