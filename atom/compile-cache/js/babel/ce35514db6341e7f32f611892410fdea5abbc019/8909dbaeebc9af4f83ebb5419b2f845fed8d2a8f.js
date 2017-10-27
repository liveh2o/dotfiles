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
        if (!editorElement.component || !(0, _helpers2.hasParent)(e.target, 'div.scroll-view')) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvZWRpdG9yL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7MEJBRXFCLGFBQWE7Ozs7K0JBQ04sa0JBQWtCOzs7O29CQUN4QixNQUFNOzswQkFDNkIsY0FBYzs7dUJBR25ELFlBQVk7Ozs7dUJBQ3FCLFlBQVk7O3dCQUNrQixXQUFXOztJQUd6RSxNQUFNO0FBY2QsV0FkUSxNQUFNLENBY2IsVUFBc0IsRUFBRTs7OzBCQWRqQixNQUFNOztBQWV2QixRQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQTtBQUNuQixRQUFJLENBQUMsT0FBTyxHQUFHLHlCQUFhLENBQUE7QUFDNUIsUUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBO0FBQ3hCLFFBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTtBQUN6QixRQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQTtBQUM1QixRQUFJLENBQUMsYUFBYSxHQUFHLHFDQUF5QixDQUFBOztBQUU5QyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7QUFDcEMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsK0JBQStCLEVBQUUsVUFBQyxXQUFXLEVBQUs7QUFDM0YsWUFBSyxXQUFXLEdBQUcsV0FBVyxDQUFBO0tBQy9CLENBQUMsQ0FBQyxDQUFBO0FBQ0gsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsb0NBQW9DLEVBQUUsVUFBQyxnQkFBZ0IsRUFBSztBQUNyRyxZQUFLLGdCQUFnQixHQUFHLGdCQUFnQixDQUFBO0tBQ3pDLENBQUMsQ0FBQyxDQUFBO0FBQ0gsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsbUNBQW1DLEVBQUUsVUFBQyxlQUFlLEVBQUs7QUFDbkcsVUFBTSxVQUFVLEdBQUcsT0FBTyxNQUFLLGVBQWUsS0FBSyxXQUFXLENBQUE7QUFDOUQsWUFBSyxlQUFlLEdBQUcsZUFBZSxDQUFBO0FBQ3RDLFVBQUksVUFBVSxFQUFFO0FBQ2QsY0FBSyxZQUFZLEVBQUUsQ0FBQTtPQUNwQjtLQUNGLENBQUMsQ0FBQyxDQUFBO0FBQ0gsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsa0NBQWtDLEVBQUUsVUFBQyxjQUFjLEVBQUs7QUFDakcsVUFBTSxVQUFVLEdBQUcsT0FBTyxNQUFLLGNBQWMsS0FBSyxXQUFXLENBQUE7QUFDN0QsWUFBSyxjQUFjLEdBQUcsY0FBYyxDQUFBO0FBQ3BDLFVBQUksVUFBVSxFQUFFO0FBQ2QsY0FBSyxZQUFZLEVBQUUsQ0FBQTtPQUNwQjtLQUNGLENBQUMsQ0FBQyxDQUFBO0FBQ0gsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxZQUFNO0FBQ25ELFlBQUssT0FBTyxFQUFFLENBQUE7S0FDZixDQUFDLENBQUMsQ0FBQTs7QUFFSCxRQUFJLG1CQUFtQixZQUFBLENBQUE7QUFDdkIsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsa0NBQWtDLEVBQUUsVUFBQyxjQUFjLEVBQUs7QUFDakcsVUFBSSxtQkFBbUIsRUFBRTtBQUN2QiwyQkFBbUIsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtPQUM5QjtBQUNELHlCQUFtQixHQUFHLGNBQWMsS0FBSyxPQUFPLEdBQUcsTUFBSyxzQkFBc0IsRUFBRSxHQUFHLE1BQUsseUJBQXlCLEVBQUUsQ0FBQTtBQUNuSCxZQUFLLGFBQWEsRUFBRSxDQUFBO0tBQ3JCLENBQUMsQ0FBQyxDQUFBO0FBQ0gsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsWUFBVztBQUNoQyx5QkFBbUIsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtLQUM5QixDQUFDLENBQUE7QUFDRixRQUFJLENBQUMsWUFBWSxFQUFFLENBQUE7QUFDbkIsUUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUE7R0FDNUI7O2VBNURrQixNQUFNOztXQTZETCxnQ0FBRzs7O0FBQ3JCLFVBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLFVBQUMsTUFBTSxFQUFLO0FBQ2hFLFlBQUksTUFBTSxZQUFBLENBQUE7QUFDVixZQUFJLFNBQVMsWUFBQSxDQUFBO0FBQ2IsWUFBSSxTQUFTLFlBQUEsQ0FBQTtBQUNiLFlBQU0sb0JBQW9CLEdBQUcsU0FBdkIsb0JBQW9CLENBQUksSUFBYyxFQUFLO2NBQWpCLEtBQUssR0FBUCxJQUFjLENBQVosS0FBSztjQUFFLEdBQUcsR0FBWixJQUFjLENBQUwsR0FBRzs7QUFDeEMsY0FBTSxNQUFNLEdBQUcsT0FBSyxNQUFNLENBQUE7QUFDMUIsY0FBSSxDQUFDLE1BQU0sRUFBRSxPQUFNOzs7O0FBSW5CLGNBQU0sWUFBWSxHQUFHLFlBQU0sVUFBVSxDQUFDLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUE7QUFDbkQsY0FBTSxVQUFVLEdBQUcsWUFBTSxVQUFVLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUMxRSxjQUFNLFlBQVksR0FBRyxZQUFZLENBQUMsT0FBTyxFQUFFLENBQUE7OztBQUczQyxjQUFJLEtBQUssQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUFDLEdBQUcsSUFBSSxZQUFZLENBQUMsR0FBRyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7QUFDMUQsc0JBQVUsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUE7V0FDckI7QUFDRCxjQUFJLFNBQVMsSUFBSSxTQUFTLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLFlBQVksS0FBSyxTQUFTLEVBQUUsT0FBTTtBQUNwRixjQUFJLE1BQU0sRUFBRSxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDNUIsbUJBQVMsR0FBRyxVQUFVLENBQUE7QUFDdEIsbUJBQVMsR0FBRyxZQUFZLENBQUE7O0FBRXhCLGdCQUFNLEdBQUcsT0FBSyxVQUFVLENBQUMsZUFBZSxDQUFDLFVBQVUsRUFBRTtBQUNuRCxzQkFBVSxFQUFFLE9BQU87V0FDcEIsQ0FBQyxDQUFBO0FBQ0YsY0FBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUMzQyxjQUFJLENBQUMsU0FBUyxvREFBaUQsWUFBWSxHQUFHLDBCQUEwQixHQUFHLEVBQUUsQ0FBQSxBQUFFLENBQUE7QUFDL0csZ0JBQU0sQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFO0FBQzVCLGdCQUFJLEVBQUosSUFBSTtBQUNKLHFCQUFPLFlBQVk7V0FDcEIsQ0FBQyxDQUFBO1NBQ0gsQ0FBQTs7QUFFRCxZQUFNLFlBQVksR0FBRyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUE7QUFDdkMsWUFBTSxhQUFhLEdBQUcscUNBQXlCLENBQUE7QUFDL0MscUJBQWEsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxVQUFDLEtBQWdELEVBQUs7Y0FBbkQscUJBQXFCLEdBQXZCLEtBQWdELENBQTlDLHFCQUFxQjtjQUFFLHFCQUFxQixHQUE5QyxLQUFnRCxDQUF2QixxQkFBcUI7O0FBQ3hGLDhCQUFvQixDQUFDLEVBQUUsS0FBSyxFQUFFLHFCQUFxQixFQUFFLEdBQUcsRUFBRSxxQkFBcUIsRUFBRSxDQUFDLENBQUE7U0FDbkYsQ0FBQyxDQUFDLENBQUE7QUFDSCxxQkFBYSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLFlBQU07QUFDMUMsaUJBQUssYUFBYSxVQUFPLENBQUMsYUFBYSxDQUFDLENBQUE7QUFDeEMsdUJBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtTQUN4QixDQUFDLENBQUMsQ0FBQTtBQUNILHFCQUFhLENBQUMsR0FBRyxDQUFDLFlBQVc7QUFDM0IsY0FBSSxNQUFNLEVBQUUsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFBO1NBQzdCLENBQUMsQ0FBQTtBQUNGLGVBQUssYUFBYSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQTtBQUNyQyw0QkFBb0IsQ0FBQyxZQUFZLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQTtPQUNwRCxDQUFDLENBQUMsQ0FBQTtLQUNKOzs7V0FDcUIsa0NBQUc7OztBQUN2QixVQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUE7QUFDekQsYUFBTyxrQ0FBZ0IsYUFBYSxFQUFFLFdBQVcsRUFBRSw2QkFBUyxVQUFDLENBQUMsRUFBSztBQUNqRSxZQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsSUFBSSxDQUFDLHlCQUFVLENBQUMsQ0FBQyxNQUFNLEVBQUUsaUJBQWlCLENBQUMsRUFBRTtBQUN2RSxpQkFBTTtTQUNQO0FBQ0QsWUFBTSxPQUFPLEdBQUcsT0FBSyxPQUFPLENBQUE7QUFDNUIsWUFBSSxPQUFPLElBQUksc0NBQXVCLENBQUMsRUFBRSxhQUFhLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxzQkFBc0IsRUFBRSxFQUFFLE9BQU8sQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLE9BQU8sQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLEVBQUU7QUFDM0osaUJBQU07U0FDUDs7QUFFRCxZQUFJLE9BQUssVUFBVSxDQUFDLGFBQWEsRUFBRTtBQUNqQyxpQkFBSyxhQUFhLEVBQUUsQ0FBQTtBQUNwQixpQkFBTTtTQUNQO0FBQ0QsWUFBTSxjQUFjLEdBQUcsK0NBQWdDLENBQUMsRUFBRSxPQUFLLFVBQVUsRUFBRSxhQUFhLENBQUMsQ0FBQTtBQUN6RixlQUFLLGNBQWMsR0FBRyxjQUFjLENBQUE7QUFDcEMsWUFBSSxjQUFjLEVBQUU7QUFDbEIsaUJBQUssYUFBYSxDQUFDLE9BQUssY0FBYyxDQUFDLENBQUE7U0FDeEMsTUFBTTtBQUNMLGlCQUFLLGFBQWEsRUFBRSxDQUFBO1NBQ3JCO09BQ0YsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQTtLQUNmOzs7V0FDd0IscUNBQUc7OztBQUMxQixhQUFPLElBQUksQ0FBQyxVQUFVLENBQUMseUJBQXlCLENBQUMsNkJBQVMsVUFBQyxLQUFxQixFQUFLO1lBQXhCLGlCQUFpQixHQUFuQixLQUFxQixDQUFuQixpQkFBaUI7O0FBQzVFLGVBQUssY0FBYyxHQUFHLGlCQUFpQixDQUFBO0FBQ3ZDLGVBQUssYUFBYSxDQUFDLGlCQUFpQixDQUFDLENBQUE7T0FDdEMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFBO0tBQ1I7OztXQUNXLHdCQUFHOzs7QUFDYixVQUFJLENBQUMsWUFBWSxFQUFFLENBQUE7QUFDbkIsVUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUU7QUFDekIsWUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUE7QUFDbEIsZUFBTTtPQUNQO0FBQ0QsVUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLGNBQWMsS0FBSyxNQUFNLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFBO0FBQzVELFVBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUM7QUFDdEMsWUFBSSxFQUFFLG1CQUFtQjtBQUN6QixnQkFBUSxFQUFSLFFBQVE7T0FDVCxDQUFDLENBQUE7QUFDRixVQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUs7QUFDeEMsZUFBSyxjQUFjLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQTtPQUMvQyxDQUFDLENBQUE7S0FDSDs7O1dBQ1csd0JBQUc7QUFDYixVQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7QUFDZixZQUFJO0FBQ0YsY0FBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQTtTQUN0QixDQUFDLE9BQU8sQ0FBQyxFQUFFOztTQUVYO09BQ0Y7S0FDRjs7O1dBQ1ksdUJBQUMsUUFBZ0IsRUFBRTs7O0FBQzlCLFVBQUksQ0FBQyxRQUFRLElBQUssSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxBQUFDLEVBQUU7QUFDaEYsZUFBTTtPQUNQO0FBQ0QsVUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFBO0FBQ3BCLFVBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFO0FBQ3JCLGVBQU07T0FDUDs7QUFFRCxVQUFNLFFBQVEsR0FBRywyQ0FBNkIsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFBO0FBQ2pHLFVBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFO0FBQ3BCLGVBQU07T0FDUDs7QUFFRCxVQUFJLENBQUMsT0FBTyxHQUFHLHlCQUFZLFFBQVEsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFBO0FBQy9ELFVBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLFlBQU07QUFDOUIsZUFBSyxPQUFPLEdBQUcsSUFBSSxDQUFBO09BQ3BCLENBQUMsQ0FBQTtLQUNIOzs7V0FDWSx5QkFBRztBQUNkLFVBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtBQUNoQixZQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQTtPQUM5QjtLQUNGOzs7V0FDSSxlQUFDLEtBQTJCLEVBQUUsT0FBNkIsRUFBRTs7O0FBQ2hFLFVBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLENBQUE7O0FBRTlDLFdBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLE9BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxPQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDeEQsWUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQzFCLFlBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQ3hDLFlBQUksTUFBTSxFQUFFO0FBQ1YsZ0JBQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQTtTQUNqQjtBQUNELFlBQUksQ0FBQyxRQUFRLFVBQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUM3QixZQUFJLENBQUMsT0FBTyxVQUFPLENBQUMsT0FBTyxDQUFDLENBQUE7T0FDN0I7OzRCQUVRLENBQUMsRUFBTSxRQUFNO0FBQ3BCLFlBQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUN4QixZQUFNLFdBQVcsR0FBRyxxQkFBTyxPQUFPLENBQUMsQ0FBQTtBQUNuQyxZQUFJLENBQUMsV0FBVyxFQUFFOztBQUVoQiw0QkFBUTtTQUNUO0FBQ0QsWUFBTSxNQUFNLEdBQUcsVUFBVSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUU7QUFDL0Msb0JBQVUsRUFBRSxPQUFPO1NBQ3BCLENBQUMsQ0FBQTtBQUNGLGVBQUssT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUE7QUFDakMsZUFBSyxRQUFRLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQzFCLGNBQU0sQ0FBQyxXQUFXLENBQUMsVUFBQyxLQUE2QyxFQUFLO2NBQWhELGVBQWUsR0FBakIsS0FBNkMsQ0FBM0MsZUFBZTtjQUFFLGVBQWUsR0FBbEMsS0FBNkMsQ0FBMUIsZUFBZTtjQUFFLE9BQU8sR0FBM0MsS0FBNkMsQ0FBVCxPQUFPOztBQUM3RCxjQUFJLENBQUMsT0FBTyxJQUFLLGVBQWUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxJQUFJLGVBQWUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxBQUFDLEVBQUU7QUFDeEUsbUJBQU07V0FDUDtBQUNELGNBQUksT0FBTyxDQUFDLE9BQU8sS0FBSyxDQUFDLEVBQUU7QUFDekIsbUJBQU8sQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLGtCQUFrQixDQUFDLEtBQUssQ0FBQTtXQUNoRCxNQUFNO0FBQ0wsbUJBQU8sQ0FBQyxRQUFRLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLENBQUE7V0FDNUQ7U0FDRixDQUFDLENBQUE7QUFDRixlQUFLLGNBQWMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUE7OztBQXRCdEMsV0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsUUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLFFBQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTt5QkFBL0MsQ0FBQyxFQUFNLFFBQU07O2lDQUtsQixTQUFRO09Ba0JYOztBQUVELFVBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFBO0tBQ3hDOzs7V0FDYSx3QkFBQyxPQUFzQixFQUFFLE1BQWMsRUFBZ0Q7VUFBOUMsS0FBbUMseURBQUcsTUFBTTs7QUFDakcsVUFBSSxLQUFLLEtBQUssTUFBTSxJQUFJLEtBQUssS0FBSyxRQUFRLEVBQUU7QUFDMUMsWUFBSSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFO0FBQ3JDLGNBQUksRUFBRSxXQUFXO0FBQ2pCLGdEQUFrQyxPQUFPLENBQUMsUUFBUSxBQUFFO1NBQ3JELENBQUMsQ0FBQTtPQUNIOztBQUVELFVBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUE7QUFDMUIsVUFBSSxNQUFNLEtBQUssS0FBSyxLQUFLLE1BQU0sSUFBSSxLQUFLLEtBQUssUUFBUSxDQUFBLEFBQUMsRUFBRTtBQUN0RCxZQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBQzlDLGVBQU8sQ0FBQyxTQUFTLDhDQUE0QyxPQUFPLENBQUMsUUFBUSxvQkFBYyxPQUFPLENBQUMsSUFBSSxJQUFJLGVBQWUsQ0FBQSxBQUFFLENBQUE7QUFDNUgsY0FBTSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUU7QUFDNUIsbUJBQU8sWUFBWTtBQUNuQixjQUFJLEVBQUUsT0FBTztTQUNkLENBQUMsQ0FBQTtPQUNIO0tBQ0Y7OztXQUNXLHNCQUFDLFFBQWtCLEVBQWM7QUFDM0MsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsUUFBUSxDQUFDLENBQUE7S0FDaEQ7OztXQUNNLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUE7QUFDaEMsVUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUM1QixVQUFJLENBQUMsWUFBWSxFQUFFLENBQUE7QUFDbkIsVUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFBO0tBQ3JCOzs7U0FoUWtCLE1BQU07OztxQkFBTixNQUFNIiwiZmlsZSI6Ii9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvZWRpdG9yL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IGRlYm91bmNlIGZyb20gJ3NiLWRlYm91bmNlJ1xuaW1wb3J0IGRpc3Bvc2FibGVFdmVudCBmcm9tICdkaXNwb3NhYmxlLWV2ZW50J1xuaW1wb3J0IHsgUmFuZ2UgfSBmcm9tICdhdG9tJ1xuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSwgRW1pdHRlciwgRGlzcG9zYWJsZSB9IGZyb20gJ3NiLWV2ZW50LWtpdCdcbmltcG9ydCB0eXBlIHsgVGV4dEVkaXRvciwgQnVmZmVyTWFya2VyLCBUZXh0RWRpdG9yR3V0dGVyLCBQb2ludCB9IGZyb20gJ2F0b20nXG5cbmltcG9ydCBUb29sdGlwIGZyb20gJy4uL3Rvb2x0aXAnXG5pbXBvcnQgeyAkcmFuZ2UsIGZpbHRlck1lc3NhZ2VzQnlSYW5nZU9yUG9pbnQgfSBmcm9tICcuLi9oZWxwZXJzJ1xuaW1wb3J0IHsgaGFzUGFyZW50LCBtb3VzZUV2ZW50TmVhclBvc2l0aW9uLCBnZXRCdWZmZXJQb3NpdGlvbkZyb21Nb3VzZUV2ZW50IH0gZnJvbSAnLi9oZWxwZXJzJ1xuaW1wb3J0IHR5cGUgeyBMaW50ZXJNZXNzYWdlIH0gZnJvbSAnLi4vdHlwZXMnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVkaXRvciB7XG4gIGd1dHRlcjogP1RleHRFZGl0b3JHdXR0ZXI7XG4gIHRvb2x0aXA6ID9Ub29sdGlwO1xuICBlbWl0dGVyOiBFbWl0dGVyO1xuICBtYXJrZXJzOiBNYXA8TGludGVyTWVzc2FnZSwgQnVmZmVyTWFya2VyPjtcbiAgbWVzc2FnZXM6IFNldDxMaW50ZXJNZXNzYWdlPjtcbiAgdGV4dEVkaXRvcjogVGV4dEVkaXRvcjtcbiAgc2hvd1Rvb2x0aXA6IGJvb2xlYW47XG4gIHN1YnNjcmlwdGlvbnM6IENvbXBvc2l0ZURpc3Bvc2FibGU7XG4gIGN1cnNvclBvc2l0aW9uOiA/UG9pbnQ7XG4gIGd1dHRlclBvc2l0aW9uOiBib29sZWFuO1xuICBzaG93RGVjb3JhdGlvbnM6IGJvb2xlYW47XG4gIHNob3dQcm92aWRlck5hbWU6IGJvb2xlYW47XG5cbiAgY29uc3RydWN0b3IodGV4dEVkaXRvcjogVGV4dEVkaXRvcikge1xuICAgIHRoaXMudG9vbHRpcCA9IG51bGxcbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpXG4gICAgdGhpcy5tYXJrZXJzID0gbmV3IE1hcCgpXG4gICAgdGhpcy5tZXNzYWdlcyA9IG5ldyBTZXQoKVxuICAgIHRoaXMudGV4dEVkaXRvciA9IHRleHRFZGl0b3JcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuZW1pdHRlcilcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci11aS1kZWZhdWx0LnNob3dUb29sdGlwJywgKHNob3dUb29sdGlwKSA9PiB7XG4gICAgICB0aGlzLnNob3dUb29sdGlwID0gc2hvd1Rvb2x0aXBcbiAgICB9KSlcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci11aS1kZWZhdWx0LnNob3dQcm92aWRlck5hbWUnLCAoc2hvd1Byb3ZpZGVyTmFtZSkgPT4ge1xuICAgICAgdGhpcy5zaG93UHJvdmlkZXJOYW1lID0gc2hvd1Byb3ZpZGVyTmFtZVxuICAgIH0pKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLXVpLWRlZmF1bHQuc2hvd0RlY29yYXRpb25zJywgKHNob3dEZWNvcmF0aW9ucykgPT4ge1xuICAgICAgY29uc3Qgbm90SW5pdGlhbCA9IHR5cGVvZiB0aGlzLnNob3dEZWNvcmF0aW9ucyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAgIHRoaXMuc2hvd0RlY29yYXRpb25zID0gc2hvd0RlY29yYXRpb25zXG4gICAgICBpZiAobm90SW5pdGlhbCkge1xuICAgICAgICB0aGlzLnVwZGF0ZUd1dHRlcigpXG4gICAgICB9XG4gICAgfSkpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItdWktZGVmYXVsdC5ndXR0ZXJQb3NpdGlvbicsIChndXR0ZXJQb3NpdGlvbikgPT4ge1xuICAgICAgY29uc3Qgbm90SW5pdGlhbCA9IHR5cGVvZiB0aGlzLmd1dHRlclBvc2l0aW9uICE9PSAndW5kZWZpbmVkJ1xuICAgICAgdGhpcy5ndXR0ZXJQb3NpdGlvbiA9IGd1dHRlclBvc2l0aW9uXG4gICAgICBpZiAobm90SW5pdGlhbCkge1xuICAgICAgICB0aGlzLnVwZGF0ZUd1dHRlcigpXG4gICAgICB9XG4gICAgfSkpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0ZXh0RWRpdG9yLm9uRGlkRGVzdHJveSgoKSA9PiB7XG4gICAgICB0aGlzLmRpc3Bvc2UoKVxuICAgIH0pKVxuXG4gICAgbGV0IHRvb2x0aXBTdWJzY3JpcHRpb25cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci11aS1kZWZhdWx0LnRvb2x0aXBGb2xsb3dzJywgKHRvb2x0aXBGb2xsb3dzKSA9PiB7XG4gICAgICBpZiAodG9vbHRpcFN1YnNjcmlwdGlvbikge1xuICAgICAgICB0b29sdGlwU3Vic2NyaXB0aW9uLmRpc3Bvc2UoKVxuICAgICAgfVxuICAgICAgdG9vbHRpcFN1YnNjcmlwdGlvbiA9IHRvb2x0aXBGb2xsb3dzID09PSAnTW91c2UnID8gdGhpcy5saXN0ZW5Gb3JNb3VzZU1vdmVtZW50KCkgOiB0aGlzLmxpc3RlbkZvcktleWJvYXJkTW92ZW1lbnQoKVxuICAgICAgdGhpcy5yZW1vdmVUb29sdGlwKClcbiAgICB9KSlcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGZ1bmN0aW9uKCkge1xuICAgICAgdG9vbHRpcFN1YnNjcmlwdGlvbi5kaXNwb3NlKClcbiAgICB9KVxuICAgIHRoaXMudXBkYXRlR3V0dGVyKClcbiAgICB0aGlzLmxpc3RlbkZvckN1cnJlbnRMaW5lKClcbiAgfVxuICBsaXN0ZW5Gb3JDdXJyZW50TGluZSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMudGV4dEVkaXRvci5vYnNlcnZlQ3Vyc29ycygoY3Vyc29yKSA9PiB7XG4gICAgICBsZXQgbWFya2VyXG4gICAgICBsZXQgbGFzdFJhbmdlXG4gICAgICBsZXQgbGFzdEVtcHR5XG4gICAgICBjb25zdCBoYW5kbGVQb3NpdGlvbkNoYW5nZSA9ICh7IHN0YXJ0LCBlbmQgfSkgPT4ge1xuICAgICAgICBjb25zdCBndXR0ZXIgPSB0aGlzLmd1dHRlclxuICAgICAgICBpZiAoIWd1dHRlcikgcmV0dXJuXG4gICAgICAgIC8vIFdlIG5lZWQgdGhhdCBSYW5nZS5mcm9tT2JqZWN0IGhhY2sgYmVsb3cgYmVjYXVzZSB3aGVuIHdlIGZvY3VzIGluZGV4IDAgb24gbXVsdGktbGluZSBzZWxlY3Rpb25cbiAgICAgICAgLy8gZW5kLmNvbHVtbiBpcyB0aGUgY29sdW1uIG9mIHRoZSBsYXN0IGxpbmUgYnV0IG1ha2luZyBhIHJhbmdlIG91dCBvZiB0d28gYW5kIHRoZW4gYWNjZXNpbmdcbiAgICAgICAgLy8gdGhlIGVuZCBzZWVtcyB0byBmaXggaXQgKGJsYWNrIG1hZ2ljPylcbiAgICAgICAgY29uc3QgY3VycmVudFJhbmdlID0gUmFuZ2UuZnJvbU9iamVjdChbc3RhcnQsIGVuZF0pXG4gICAgICAgIGNvbnN0IGxpbmVzUmFuZ2UgPSBSYW5nZS5mcm9tT2JqZWN0KFtbc3RhcnQucm93LCAwXSwgW2VuZC5yb3csIEluZmluaXR5XV0pXG4gICAgICAgIGNvbnN0IGN1cnJlbnRFbXB0eSA9IGN1cnJlbnRSYW5nZS5pc0VtcHR5KClcblxuICAgICAgICAvLyBOT1RFOiBBdG9tIGRvZXMgbm90IHBhaW50IGd1dHRlciBpZiBtdWx0aS1saW5lIGFuZCBsYXN0IGxpbmUgaGFzIHplcm8gaW5kZXhcbiAgICAgICAgaWYgKHN0YXJ0LnJvdyAhPT0gZW5kLnJvdyAmJiBjdXJyZW50UmFuZ2UuZW5kLmNvbHVtbiA9PT0gMCkge1xuICAgICAgICAgIGxpbmVzUmFuZ2UuZW5kLnJvdy0tXG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxhc3RSYW5nZSAmJiBsYXN0UmFuZ2UuaXNFcXVhbChsaW5lc1JhbmdlKSAmJiBjdXJyZW50RW1wdHkgPT09IGxhc3RFbXB0eSkgcmV0dXJuXG4gICAgICAgIGlmIChtYXJrZXIpIG1hcmtlci5kZXN0cm95KClcbiAgICAgICAgbGFzdFJhbmdlID0gbGluZXNSYW5nZVxuICAgICAgICBsYXN0RW1wdHkgPSBjdXJyZW50RW1wdHlcblxuICAgICAgICBtYXJrZXIgPSB0aGlzLnRleHRFZGl0b3IubWFya0J1ZmZlclJhbmdlKGxpbmVzUmFuZ2UsIHtcbiAgICAgICAgICBpbnZhbGlkYXRlOiAnbmV2ZXInLFxuICAgICAgICB9KVxuICAgICAgICBjb25zdCBpdGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXG4gICAgICAgIGl0ZW0uY2xhc3NOYW1lID0gYGxpbmUtbnVtYmVyIGN1cnNvci1saW5lIGxpbnRlci1jdXJzb3ItbGluZSAke2N1cnJlbnRFbXB0eSA/ICdjdXJzb3ItbGluZS1uby1zZWxlY3Rpb24nIDogJyd9YFxuICAgICAgICBndXR0ZXIuZGVjb3JhdGVNYXJrZXIobWFya2VyLCB7XG4gICAgICAgICAgaXRlbSxcbiAgICAgICAgICBjbGFzczogJ2xpbnRlci1yb3cnLFxuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICBjb25zdCBjdXJzb3JNYXJrZXIgPSBjdXJzb3IuZ2V0TWFya2VyKClcbiAgICAgIGNvbnN0IHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgICBzdWJzY3JpcHRpb25zLmFkZChjdXJzb3JNYXJrZXIub25EaWRDaGFuZ2UoKHsgbmV3SGVhZEJ1ZmZlclBvc2l0aW9uLCBuZXdUYWlsQnVmZmVyUG9zaXRpb24gfSkgPT4ge1xuICAgICAgICBoYW5kbGVQb3NpdGlvbkNoYW5nZSh7IHN0YXJ0OiBuZXdIZWFkQnVmZmVyUG9zaXRpb24sIGVuZDogbmV3VGFpbEJ1ZmZlclBvc2l0aW9uIH0pXG4gICAgICB9KSlcbiAgICAgIHN1YnNjcmlwdGlvbnMuYWRkKGN1cnNvci5vbkRpZERlc3Ryb3koKCkgPT4ge1xuICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGVsZXRlKHN1YnNjcmlwdGlvbnMpXG4gICAgICAgIHN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgICB9KSlcbiAgICAgIHN1YnNjcmlwdGlvbnMuYWRkKGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAobWFya2VyKSBtYXJrZXIuZGVzdHJveSgpXG4gICAgICB9KVxuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChzdWJzY3JpcHRpb25zKVxuICAgICAgaGFuZGxlUG9zaXRpb25DaGFuZ2UoY3Vyc29yTWFya2VyLmdldEJ1ZmZlclJhbmdlKCkpXG4gICAgfSkpXG4gIH1cbiAgbGlzdGVuRm9yTW91c2VNb3ZlbWVudCgpIHtcbiAgICBjb25zdCBlZGl0b3JFbGVtZW50ID0gYXRvbS52aWV3cy5nZXRWaWV3KHRoaXMudGV4dEVkaXRvcilcbiAgICByZXR1cm4gZGlzcG9zYWJsZUV2ZW50KGVkaXRvckVsZW1lbnQsICdtb3VzZW1vdmUnLCBkZWJvdW5jZSgoZSkgPT4ge1xuICAgICAgaWYgKCFlZGl0b3JFbGVtZW50LmNvbXBvbmVudCB8fCAhaGFzUGFyZW50KGUudGFyZ2V0LCAnZGl2LnNjcm9sbC12aWV3JykpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICBjb25zdCB0b29sdGlwID0gdGhpcy50b29sdGlwXG4gICAgICBpZiAodG9vbHRpcCAmJiBtb3VzZUV2ZW50TmVhclBvc2l0aW9uKGUsIGVkaXRvckVsZW1lbnQsIHRvb2x0aXAubWFya2VyLmdldFN0YXJ0U2NyZWVuUG9zaXRpb24oKSwgdG9vbHRpcC5lbGVtZW50Lm9mZnNldFdpZHRoLCB0b29sdGlwLmVsZW1lbnQub2Zmc2V0SGVpZ2h0KSkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIC8vIE5PVEU6IElnbm9yZSBpZiBmaWxlIGlzIHRvbyBiaWdcbiAgICAgIGlmICh0aGlzLnRleHRFZGl0b3IubGFyZ2VGaWxlTW9kZSkge1xuICAgICAgICB0aGlzLnJlbW92ZVRvb2x0aXAoKVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIGNvbnN0IGN1cnNvclBvc2l0aW9uID0gZ2V0QnVmZmVyUG9zaXRpb25Gcm9tTW91c2VFdmVudChlLCB0aGlzLnRleHRFZGl0b3IsIGVkaXRvckVsZW1lbnQpXG4gICAgICB0aGlzLmN1cnNvclBvc2l0aW9uID0gY3Vyc29yUG9zaXRpb25cbiAgICAgIGlmIChjdXJzb3JQb3NpdGlvbikge1xuICAgICAgICB0aGlzLnVwZGF0ZVRvb2x0aXAodGhpcy5jdXJzb3JQb3NpdGlvbilcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucmVtb3ZlVG9vbHRpcCgpXG4gICAgICB9XG4gICAgfSwgMjAwLCB0cnVlKSlcbiAgfVxuICBsaXN0ZW5Gb3JLZXlib2FyZE1vdmVtZW50KCkge1xuICAgIHJldHVybiB0aGlzLnRleHRFZGl0b3Iub25EaWRDaGFuZ2VDdXJzb3JQb3NpdGlvbihkZWJvdW5jZSgoeyBuZXdCdWZmZXJQb3NpdGlvbiB9KSA9PiB7XG4gICAgICB0aGlzLmN1cnNvclBvc2l0aW9uID0gbmV3QnVmZmVyUG9zaXRpb25cbiAgICAgIHRoaXMudXBkYXRlVG9vbHRpcChuZXdCdWZmZXJQb3NpdGlvbilcbiAgICB9LCA2MCkpXG4gIH1cbiAgdXBkYXRlR3V0dGVyKCkge1xuICAgIHRoaXMucmVtb3ZlR3V0dGVyKClcbiAgICBpZiAoIXRoaXMuc2hvd0RlY29yYXRpb25zKSB7XG4gICAgICB0aGlzLmd1dHRlciA9IG51bGxcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBjb25zdCBwcmlvcml0eSA9IHRoaXMuZ3V0dGVyUG9zaXRpb24gPT09ICdMZWZ0JyA/IC0xMDAgOiAxMDBcbiAgICB0aGlzLmd1dHRlciA9IHRoaXMudGV4dEVkaXRvci5hZGRHdXR0ZXIoe1xuICAgICAgbmFtZTogJ2xpbnRlci11aS1kZWZhdWx0JyxcbiAgICAgIHByaW9yaXR5LFxuICAgIH0pXG4gICAgdGhpcy5tYXJrZXJzLmZvckVhY2goKG1hcmtlciwgbWVzc2FnZSkgPT4ge1xuICAgICAgdGhpcy5kZWNvcmF0ZU1hcmtlcihtZXNzYWdlLCBtYXJrZXIsICdndXR0ZXInKVxuICAgIH0pXG4gIH1cbiAgcmVtb3ZlR3V0dGVyKCkge1xuICAgIGlmICh0aGlzLmd1dHRlcikge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdGhpcy5ndXR0ZXIuZGVzdHJveSgpXG4gICAgICB9IGNhdGNoIChfKSB7XG4gICAgICAgIC8qIFRoaXMgdGhyb3dzIHdoZW4gdGhlIHRleHQgZWRpdG9yIGlzIGRpc3Bvc2VkICovXG4gICAgICB9XG4gICAgfVxuICB9XG4gIHVwZGF0ZVRvb2x0aXAocG9zaXRpb246ID9Qb2ludCkge1xuICAgIGlmICghcG9zaXRpb24gfHwgKHRoaXMudG9vbHRpcCAmJiB0aGlzLnRvb2x0aXAuaXNWYWxpZChwb3NpdGlvbiwgdGhpcy5tZXNzYWdlcykpKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgdGhpcy5yZW1vdmVUb29sdGlwKClcbiAgICBpZiAoIXRoaXMuc2hvd1Rvb2x0aXApIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGNvbnN0IG1lc3NhZ2VzID0gZmlsdGVyTWVzc2FnZXNCeVJhbmdlT3JQb2ludCh0aGlzLm1lc3NhZ2VzLCB0aGlzLnRleHRFZGl0b3IuZ2V0UGF0aCgpLCBwb3NpdGlvbilcbiAgICBpZiAoIW1lc3NhZ2VzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgdGhpcy50b29sdGlwID0gbmV3IFRvb2x0aXAobWVzc2FnZXMsIHBvc2l0aW9uLCB0aGlzLnRleHRFZGl0b3IpXG4gICAgdGhpcy50b29sdGlwLm9uRGlkRGVzdHJveSgoKSA9PiB7XG4gICAgICB0aGlzLnRvb2x0aXAgPSBudWxsXG4gICAgfSlcbiAgfVxuICByZW1vdmVUb29sdGlwKCkge1xuICAgIGlmICh0aGlzLnRvb2x0aXApIHtcbiAgICAgIHRoaXMudG9vbHRpcC5tYXJrZXIuZGVzdHJveSgpXG4gICAgfVxuICB9XG4gIGFwcGx5KGFkZGVkOiBBcnJheTxMaW50ZXJNZXNzYWdlPiwgcmVtb3ZlZDogQXJyYXk8TGludGVyTWVzc2FnZT4pIHtcbiAgICBjb25zdCB0ZXh0QnVmZmVyID0gdGhpcy50ZXh0RWRpdG9yLmdldEJ1ZmZlcigpXG5cbiAgICBmb3IgKGxldCBpID0gMCwgbGVuZ3RoID0gcmVtb3ZlZC5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgbWVzc2FnZSA9IHJlbW92ZWRbaV1cbiAgICAgIGNvbnN0IG1hcmtlciA9IHRoaXMubWFya2Vycy5nZXQobWVzc2FnZSlcbiAgICAgIGlmIChtYXJrZXIpIHtcbiAgICAgICAgbWFya2VyLmRlc3Ryb3koKVxuICAgICAgfVxuICAgICAgdGhpcy5tZXNzYWdlcy5kZWxldGUobWVzc2FnZSlcbiAgICAgIHRoaXMubWFya2Vycy5kZWxldGUobWVzc2FnZSlcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMCwgbGVuZ3RoID0gYWRkZWQubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSBhZGRlZFtpXVxuICAgICAgY29uc3QgbWFya2VyUmFuZ2UgPSAkcmFuZ2UobWVzc2FnZSlcbiAgICAgIGlmICghbWFya2VyUmFuZ2UpIHtcbiAgICAgICAgLy8gT25seSBmb3IgYmFja3dhcmQgY29tcGF0aWJpbGl0eVxuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuICAgICAgY29uc3QgbWFya2VyID0gdGV4dEJ1ZmZlci5tYXJrUmFuZ2UobWFya2VyUmFuZ2UsIHtcbiAgICAgICAgaW52YWxpZGF0ZTogJ25ldmVyJyxcbiAgICAgIH0pXG4gICAgICB0aGlzLm1hcmtlcnMuc2V0KG1lc3NhZ2UsIG1hcmtlcilcbiAgICAgIHRoaXMubWVzc2FnZXMuYWRkKG1lc3NhZ2UpXG4gICAgICBtYXJrZXIub25EaWRDaGFuZ2UoKHsgb2xkSGVhZFBvc2l0aW9uLCBuZXdIZWFkUG9zaXRpb24sIGlzVmFsaWQgfSkgPT4ge1xuICAgICAgICBpZiAoIWlzVmFsaWQgfHwgKG5ld0hlYWRQb3NpdGlvbi5yb3cgPT09IDAgJiYgb2xkSGVhZFBvc2l0aW9uLnJvdyAhPT0gMCkpIHtcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICBpZiAobWVzc2FnZS52ZXJzaW9uID09PSAxKSB7XG4gICAgICAgICAgbWVzc2FnZS5yYW5nZSA9IG1hcmtlci5wcmV2aW91c0V2ZW50U3RhdGUucmFuZ2VcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtZXNzYWdlLmxvY2F0aW9uLnBvc2l0aW9uID0gbWFya2VyLnByZXZpb3VzRXZlbnRTdGF0ZS5yYW5nZVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgdGhpcy5kZWNvcmF0ZU1hcmtlcihtZXNzYWdlLCBtYXJrZXIpXG4gICAgfVxuXG4gICAgdGhpcy51cGRhdGVUb29sdGlwKHRoaXMuY3Vyc29yUG9zaXRpb24pXG4gIH1cbiAgZGVjb3JhdGVNYXJrZXIobWVzc2FnZTogTGludGVyTWVzc2FnZSwgbWFya2VyOiBPYmplY3QsIHBhaW50OiAnZ3V0dGVyJyB8ICdlZGl0b3InIHwgJ2JvdGgnID0gJ2JvdGgnKSB7XG4gICAgaWYgKHBhaW50ID09PSAnYm90aCcgfHwgcGFpbnQgPT09ICdlZGl0b3InKSB7XG4gICAgICB0aGlzLnRleHRFZGl0b3IuZGVjb3JhdGVNYXJrZXIobWFya2VyLCB7XG4gICAgICAgIHR5cGU6ICdoaWdobGlnaHQnLFxuICAgICAgICBjbGFzczogYGxpbnRlci1oaWdobGlnaHQgbGludGVyLSR7bWVzc2FnZS5zZXZlcml0eX1gLFxuICAgICAgfSlcbiAgICB9XG5cbiAgICBjb25zdCBndXR0ZXIgPSB0aGlzLmd1dHRlclxuICAgIGlmIChndXR0ZXIgJiYgKHBhaW50ID09PSAnYm90aCcgfHwgcGFpbnQgPT09ICdndXR0ZXInKSkge1xuICAgICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxuICAgICAgZWxlbWVudC5jbGFzc05hbWUgPSBgbGludGVyLWd1dHRlciBsaW50ZXItaGlnaGxpZ2h0IGxpbnRlci0ke21lc3NhZ2Uuc2V2ZXJpdHl9IGljb24gaWNvbi0ke21lc3NhZ2UuaWNvbiB8fCAncHJpbWl0aXZlLWRvdCd9YFxuICAgICAgZ3V0dGVyLmRlY29yYXRlTWFya2VyKG1hcmtlciwge1xuICAgICAgICBjbGFzczogJ2xpbnRlci1yb3cnLFxuICAgICAgICBpdGVtOiBlbGVtZW50LFxuICAgICAgfSlcbiAgICB9XG4gIH1cbiAgb25EaWREZXN0cm95KGNhbGxiYWNrOiBGdW5jdGlvbik6IERpc3Bvc2FibGUge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC1kZXN0cm95JywgY2FsbGJhY2spXG4gIH1cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWRlc3Ryb3knKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICB0aGlzLnJlbW92ZUd1dHRlcigpXG4gICAgdGhpcy5yZW1vdmVUb29sdGlwKClcbiAgfVxufVxuIl19