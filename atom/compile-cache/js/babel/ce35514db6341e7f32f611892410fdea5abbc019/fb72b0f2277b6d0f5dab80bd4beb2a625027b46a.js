var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _helpers = require('../helpers');

var PanelDelegate = (function () {
  function PanelDelegate() {
    var _this = this;

    _classCallCheck(this, PanelDelegate);

    this.emitter = new _atom.Emitter();
    this.messages = [];
    this.filteredMessages = [];
    this.subscriptions = new _atom.CompositeDisposable();

    this.subscriptions.add(atom.config.observe('linter-ui-default.panelRepresents', function (panelRepresents) {
      var notInitial = typeof _this.panelRepresents !== 'undefined';
      _this.panelRepresents = panelRepresents;
      if (notInitial) {
        _this.update();
      }
    }));
    var changeSubscription = undefined;
    this.subscriptions.add(atom.workspace.getCenter().observeActivePaneItem(function () {
      if (changeSubscription) {
        changeSubscription.dispose();
        changeSubscription = null;
      }
      var textEditor = (0, _helpers.getActiveTextEditor)();
      if (textEditor) {
        (function () {
          if (_this.panelRepresents !== 'Entire Project') {
            _this.update();
          }
          var oldRow = -1;
          changeSubscription = textEditor.onDidChangeCursorPosition(function (_ref) {
            var newBufferPosition = _ref.newBufferPosition;

            if (oldRow !== newBufferPosition.row && _this.panelRepresents === 'Current Line') {
              oldRow = newBufferPosition.row;
              _this.update();
            }
          });
        })();
      }

      if (_this.panelRepresents !== 'Entire Project' || textEditor) {
        _this.update();
      }
    }));
    this.subscriptions.add(new _atom.Disposable(function () {
      if (changeSubscription) {
        changeSubscription.dispose();
      }
    }));
  }

  _createClass(PanelDelegate, [{
    key: 'getFilteredMessages',
    value: function getFilteredMessages() {
      var filteredMessages = [];
      if (this.panelRepresents === 'Entire Project') {
        filteredMessages = this.messages;
      } else if (this.panelRepresents === 'Current File') {
        var activeEditor = (0, _helpers.getActiveTextEditor)();
        if (!activeEditor) return [];
        filteredMessages = (0, _helpers.filterMessages)(this.messages, activeEditor.getPath());
      } else if (this.panelRepresents === 'Current Line') {
        var activeEditor = (0, _helpers.getActiveTextEditor)();
        if (!activeEditor) return [];
        var activeLine = activeEditor.getCursors()[0].getBufferRow();
        filteredMessages = (0, _helpers.filterMessagesByRangeOrPoint)(this.messages, activeEditor.getPath(), _atom.Range.fromObject([[activeLine, 0], [activeLine, Infinity]]));
      }
      return filteredMessages;
    }
  }, {
    key: 'update',
    value: function update() {
      var messages = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      if (Array.isArray(messages)) {
        this.messages = messages;
      }
      this.filteredMessages = this.getFilteredMessages();
      this.emitter.emit('observe-messages', this.filteredMessages);
    }
  }, {
    key: 'onDidChangeMessages',
    value: function onDidChangeMessages(callback) {
      return this.emitter.on('observe-messages', callback);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
    }
  }]);

  return PanelDelegate;
})();

module.exports = PanelDelegate;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvcGFuZWwvZGVsZWdhdGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztvQkFFZ0UsTUFBTTs7dUJBRVksWUFBWTs7SUFHeEYsYUFBYTtBQU9OLFdBUFAsYUFBYSxHQU9IOzs7MEJBUFYsYUFBYTs7QUFRZixRQUFJLENBQUMsT0FBTyxHQUFHLG1CQUFhLENBQUE7QUFDNUIsUUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUE7QUFDbEIsUUFBSSxDQUFDLGdCQUFnQixHQUFHLEVBQUUsQ0FBQTtBQUMxQixRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFBOztBQUU5QyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxtQ0FBbUMsRUFBRSxVQUFDLGVBQWUsRUFBSztBQUNuRyxVQUFNLFVBQVUsR0FBRyxPQUFPLE1BQUssZUFBZSxLQUFLLFdBQVcsQ0FBQTtBQUM5RCxZQUFLLGVBQWUsR0FBRyxlQUFlLENBQUE7QUFDdEMsVUFBSSxVQUFVLEVBQUU7QUFDZCxjQUFLLE1BQU0sRUFBRSxDQUFBO09BQ2Q7S0FDRixDQUFDLENBQUMsQ0FBQTtBQUNILFFBQUksa0JBQWtCLFlBQUEsQ0FBQTtBQUN0QixRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRSxDQUFDLHFCQUFxQixDQUFDLFlBQU07QUFDNUUsVUFBSSxrQkFBa0IsRUFBRTtBQUN0QiwwQkFBa0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUM1QiwwQkFBa0IsR0FBRyxJQUFJLENBQUE7T0FDMUI7QUFDRCxVQUFNLFVBQVUsR0FBRyxtQ0FBcUIsQ0FBQTtBQUN4QyxVQUFJLFVBQVUsRUFBRTs7QUFDZCxjQUFJLE1BQUssZUFBZSxLQUFLLGdCQUFnQixFQUFFO0FBQzdDLGtCQUFLLE1BQU0sRUFB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ZWdhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlLCBEaXNwb3NhYmxlLCBFbWl0dGVyLCBSYW5nZSB9IGZyb20gJ2F0b20nXG5cbmltcG9ydCB7IGdldEFjdGl2ZVRleHRFZGl0b3IsIGZpbHRlck1lc3NhZ2VzLCBmaWx0ZXJNZXNzYWdlc0J5UmFuZ2VPclBvaW50IH0gZnJvbSAnLi4vaGVscGVycydcbmltcG9ydCB0eXBlIHsgTGludGVyTWVzc2FnZSB9IGZyb20gJy4uL3R5cGVzJ1xuXG5jbGFzcyBQYW5lbERlbGVnYXRlIHtcbiAgZW1pdHRlcjogRW1pdHRlcjtcbiAgbWVzc2FnZXM6IEFycmF5PExpbnRlck1lc3NhZ2U+O1xuICBmaWx0ZXJlZE1lc3NhZ2VzOiBBcnJheTxMaW50ZXJNZXNzYWdlPjtcbiAgc3Vic2NyaXB0aW9uczogQ29tcG9zaXRlRGlzcG9zYWJsZTtcbiAgcGFuZWxSZXByZXNlbnRzOiAnRW50aXJlIFByb2plY3QnIHwgJ0N1cnJlbnQgRmlsZScgfCAnQ3VycmVudCBMaW5lJztcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpXG4gICAgdGhpcy5tZXNzYWdlcyA9IFtdXG4gICAgdGhpcy5maWx0ZXJlZE1lc3NhZ2VzID0gW11cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci11aS1kZWZhdWx0LnBhbmVsUmVwcmVzZW50cycsIChwYW5lbFJlcHJlc2VudHMpID0+IHtcbiAgICAgIGNvbnN0IG5vdEluaXRpYWwgPSB0eXBlb2YgdGhpcy5wYW5lbFJlcHJlc2VudHMgIT09ICd1bmRlZmluZWQnXG4gICAgICB0aGlzLnBhbmVsUmVwcmVzZW50cyA9IHBhbmVsUmVwcmVzZW50c1xuICAgICAgaWYgKG5vdEluaXRpYWwpIHtcbiAgICAgICAgdGhpcy51cGRhdGUoKVxuICAgICAgfVxuICAgIH0pKVxuICAgIGxldCBjaGFuZ2VTdWJzY3JpcHRpb25cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20ud29ya3NwYWNlLmdldENlbnRlcigpLm9ic2VydmVBY3RpdmVQYW5lSXRlbSgoKSA9PiB7XG4gICAgICBpZiAoY2hhbmdlU3Vic2NyaXB0aW9uKSB7XG4gICAgICAgIGNoYW5nZVN1YnNjcmlwdGlvbi5kaXNwb3NlKClcbiAgICAgICAgY2hhbmdlU3Vic2NyaXB0aW9uID0gbnVsbFxuICAgICAgfVxuICAgICAgY29uc3QgdGV4dEVkaXRvciA9IGdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgICAgaWYgKHRleHRFZGl0b3IpIHtcbiAgICAgICAgaWYgKHRoaXMucGFuZWxSZXByZXNlbnRzICE9PSAnRW50aXJlIFByb2plY3QnKSB7XG4gICAgICAgICAgdGhpcy51cGRhdGUoKVxuICAgICAgICB9XG4gICAgICAgIGxldCBvbGRSb3cgPSAtMVxuICAgICAgICBjaGFuZ2VTdWJzY3JpcHRpb24gPSB0ZXh0RWRpdG9yLm9uRGlkQ2hhbmdlQ3Vyc29yUG9zaXRpb24oKHsgbmV3QnVmZmVyUG9zaXRpb24gfSkgPT4ge1xuICAgICAgICAgIGlmIChvbGRSb3cgIT09IG5ld0J1ZmZlclBvc2l0aW9uLnJvdyAmJiB0aGlzLnBhbmVsUmVwcmVzZW50cyA9PT0gJ0N1cnJlbnQgTGluZScpIHtcbiAgICAgICAgICAgIG9sZFJvdyA9IG5ld0J1ZmZlclBvc2l0aW9uLnJvd1xuICAgICAgICAgICAgdGhpcy51cGRhdGUoKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMucGFuZWxSZXByZXNlbnRzICE9PSAnRW50aXJlIFByb2plY3QnIHx8IHRleHRFZGl0b3IpIHtcbiAgICAgICAgdGhpcy51cGRhdGUoKVxuICAgICAgfVxuICAgIH0pKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQobmV3IERpc3Bvc2FibGUoZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoY2hhbmdlU3Vic2NyaXB0aW9uKSB7XG4gICAgICAgIGNoYW5nZVN1YnNjcmlwdGlvbi5kaXNwb3NlKClcbiAgICAgIH1cbiAgICB9KSlcbiAgfVxuICBnZXRGaWx0ZXJlZE1lc3NhZ2VzKCk6IEFycmF5PExpbnRlck1lc3NhZ2U+IHtcbiAgICBsZXQgZmlsdGVyZWRNZXNzYWdlcyA9IFtdXG4gICAgaWYgKHRoaXMucGFuZWxSZXByZXNlbnRzID09PSAnRW50aXJlIFByb2plY3QnKSB7XG4gICAgICBmaWx0ZXJlZE1lc3NhZ2VzID0gdGhpcy5tZXNzYWdlc1xuICAgIH0gZWxzZSBpZiAodGhpcy5wYW5lbFJlcHJlc2VudHMgPT09ICdDdXJyZW50IEZpbGUnKSB7XG4gICAgICBjb25zdCBhY3RpdmVFZGl0b3IgPSBnZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgIGlmICghYWN0aXZlRWRpdG9yKSByZXR1cm4gW11cbiAgICAgIGZpbHRlcmVkTWVzc2FnZXMgPSBmaWx0ZXJNZXNzYWdlcyh0aGlzLm1lc3NhZ2VzLCBhY3RpdmVFZGl0b3IuZ2V0UGF0aCgpKVxuICAgIH0gZWxzZSBpZiAodGhpcy5wYW5lbFJlcHJlc2VudHMgPT09ICdDdXJyZW50IExpbmUnKSB7XG4gICAgICBjb25zdCBhY3RpdmVFZGl0b3IgPSBnZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgIGlmICghYWN0aXZlRWRpdG9yKSByZXR1cm4gW11cbiAgICAgIGNvbnN0IGFjdGl2ZUxpbmUgPSBhY3RpdmVFZGl0b3IuZ2V0Q3Vyc29ycygpWzBdLmdldEJ1ZmZlclJvdygpXG4gICAgICBmaWx0ZXJlZE1lc3NhZ2VzID0gZmlsdGVyTWVzc2FnZXNCeVJhbmdlT3JQb2ludCh0aGlzLm1lc3NhZ2VzLCBhY3RpdmVFZGl0b3IuZ2V0UGF0aCgpLCBSYW5nZS5mcm9tT2JqZWN0KFtbYWN0aXZlTGluZSwgMF0sIFthY3RpdmVMaW5lLCBJbmZpbml0eV1dKSlcbiAgICB9XG4gICAgcmV0dXJuIGZpbHRlcmVkTWVzc2FnZXNcbiAgfVxuICB1cGRhdGUobWVzc2FnZXM6ID9BcnJheTxMaW50ZXJNZXNzYWdlPiA9IG51bGwpOiB2b2lkIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShtZXNzYWdlcykpIHtcbiAgICAgIHRoaXMubWVzc2FnZXMgPSBtZXNzYWdlc1xuICAgIH1cbiAgICB0aGlzLmZpbHRlcmVkTWVzc2FnZXMgPSB0aGlzLmdldEZpbHRlcmVkTWVzc2FnZXMoKVxuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdvYnNlcnZlLW1lc3NhZ2VzJywgdGhpcy5maWx0ZXJlZE1lc3NhZ2VzKVxuICB9XG4gIG9uRGlkQ2hhbmdlTWVzc2FnZXMoY2FsbGJhY2s6ICgobWVzc2FnZXM6IEFycmF5PExpbnRlck1lc3NhZ2U+KSA9PiBhbnkpKTogRGlzcG9zYWJsZSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignb2JzZXJ2ZS1tZXNzYWdlcycsIGNhbGxiYWNrKVxuICB9XG4gIGRpc3Bvc2UoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUGFuZWxEZWxlZ2F0ZVxuIl19