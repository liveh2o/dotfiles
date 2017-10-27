Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _sbEventKit = require('sb-event-kit');

var _helpers = require('../helpers');

var PanelDelegate = (function () {
  function PanelDelegate(panel) {
    var _this = this;

    _classCallCheck(this, PanelDelegate);

    this.panel = panel;
    this.emitter = new _sbEventKit.Emitter();
    this.messages = [];
    this.subscriptions = new _sbEventKit.CompositeDisposable();

    this.subscriptions.add(atom.config.observe('linter-ui-default.panelRepresents', function (panelRepresents) {
      var notInitial = typeof _this.panelRepresents !== 'undefined';
      _this.panelRepresents = panelRepresents;
      if (notInitial) {
        _this.update();
      }
    }));
    this.subscriptions.add(atom.config.observe('linter-ui-default.panelHeight', function (panelHeight) {
      var notInitial = typeof _this.panelHeight !== 'undefined';
      _this.panelHeight = panelHeight;
      if (notInitial) {
        _this.emitter.emit('observe-panel-config');
      }
    }));
    this.subscriptions.add(atom.config.observe('linter-ui-default.panelTakesMinimumHeight', function (panelTakesMinimumHeight) {
      var notInitial = typeof _this.panelTakesMinimumHeight !== 'undefined';
      _this.panelTakesMinimumHeight = panelTakesMinimumHeight;
      if (notInitial) {
        _this.emitter.emit('observe-panel-config');
      }
    }));

    var changeSubscription = undefined;
    this.subscriptions.add(atom.workspace.observeActivePaneItem(function (paneItem) {
      if (changeSubscription) {
        changeSubscription.dispose();
        changeSubscription = null;
      }
      _this.visibility = atom.workspace.isTextEditor(paneItem);
      _this.emitter.emit('observe-visibility', _this.visibility);
      if (_this.visibility) {
        (function () {
          if (_this.panelRepresents !== 'Entire Project') {
            _this.update();
          }
          var oldRow = -1;
          changeSubscription = paneItem.onDidChangeCursorPosition(function (_ref) {
            var newBufferPosition = _ref.newBufferPosition;

            if (oldRow !== newBufferPosition.row && _this.panelRepresents === 'Current Line') {
              oldRow = newBufferPosition.row;
              _this.update();
            }
          });
        })();
      }
      var shouldUpdate = typeof _this.visibility !== 'undefined' && _this.panelRepresents !== 'Entire Project';

      if (_this.visibility && shouldUpdate) {
        _this.update();
      }
    }));
    this.subscriptions.add(function () {
      if (changeSubscription) {
        changeSubscription.dispose();
      }
    });
  }

  _createClass(PanelDelegate, [{
    key: 'update',
    value: function update() {
      var messages = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      if (Array.isArray(messages)) {
        this.messages = messages;
      }
      this.emitter.emit('observe-messages', this.filteredMessages);
    }
  }, {
    key: 'updatePanelHeight',
    value: function updatePanelHeight(panelHeight) {
      atom.config.set('linter-ui-default.panelHeight', panelHeight);
    }
  }, {
    key: 'onDidChangeMessages',
    value: function onDidChangeMessages(callback) {
      return this.emitter.on('observe-messages', callback);
    }
  }, {
    key: 'onDidChangeVisibility',
    value: function onDidChangeVisibility(callback) {
      return this.emitter.on('observe-visibility', callback);
    }
  }, {
    key: 'onDidChangePanelConfig',
    value: function onDidChangePanelConfig(callback) {
      return this.emitter.on('observe-panel-config', callback);
    }
  }, {
    key: 'setPanelVisibility',
    value: function setPanelVisibility(visibility) {
      if (visibility && !this.panel.isVisible()) {
        this.panel.show();
      } else if (!visibility && this.panel.isVisible()) {
        this.panel.hide();
      }
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
    }
  }, {
    key: 'filteredMessages',
    get: function get() {
      var filteredMessages = [];
      if (this.panelRepresents === 'Entire Project') {
        filteredMessages = this.messages;
      } else if (this.panelRepresents === 'Current File') {
        var activeEditor = atom.workspace.getActiveTextEditor();
        if (!activeEditor) return [];
        filteredMessages = (0, _helpers.filterMessages)(this.messages, activeEditor.getPath());
      } else if (this.panelRepresents === 'Current Line') {
        var activeEditor = atom.workspace.getActiveTextEditor();
        if (!activeEditor) return [];
        var activeLine = activeEditor.getCursors()[0].getBufferRow();
        filteredMessages = (0, _helpers.filterMessagesByRangeOrPoint)(this.messages, activeEditor.getPath(), _atom.Range.fromObject([[activeLine, 0], [activeLine, Infinity]]));
      }
      return filteredMessages;
    }
  }]);

  return PanelDelegate;
})();

exports['default'] = PanelDelegate;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvcGFuZWwvZGVsZWdhdGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7b0JBRXNCLE1BQU07OzBCQUNpQixjQUFjOzt1QkFJRSxZQUFZOztJQUdwRCxhQUFhO0FBVXJCLFdBVlEsYUFBYSxDQVVwQixLQUFZLEVBQUU7OzswQkFWUCxhQUFhOztBQVc5QixRQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQTtBQUNsQixRQUFJLENBQUMsT0FBTyxHQUFHLHlCQUFhLENBQUE7QUFDNUIsUUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUE7QUFDbEIsUUFBSSxDQUFDLGFBQWEsR0FBRyxxQ0FBeUIsQ0FBQTs7QUFFOUMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsbUNBQW1DLEVBQUUsVUFBQyxlQUFlLEVBQUs7QUFDbkcsVUFBTSxVQUFVLEdBQUcsT0FBTyxNQUFLLGVBQWUsS0FBSyxXQUFXLENBQUE7QUFDOUQsWUFBSyxlQUFlLEdBQUcsZUFBZSxDQUFBO0FBQ3RDLFVBQUksVUFBVSxFQUFFO0FBQ2QsY0FBSyxNQUFNLEVBQUUsQ0FBQTtPQUNkO0tBQ0YsQ0FBQyxDQUFDLENBQUE7QUFDSCxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQywrQkFBK0IsRUFBRSxVQUFDLFdBQVcsRUFBSztBQUMzRixVQUFNLFVBQVUsR0FBRyxPQUFPLE1BQUssV0FBVyxLQUFLLFdBQVcsQ0FBQTtBQUMxRCxZQUFLLFdBQVcsR0FBRyxXQUFXLENBQUE7QUFDOUIsVUFBSSxVQUFVLEVBQUU7QUFDZCxjQUFLLE9BQU8sQ0FBQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsQ0FBQTtPQUMxQztLQUNGLENBQUMsQ0FBQyxDQUFBO0FBQ0gsUUFBSSxDQUFDLGFBQWEs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QUFVLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLEVBQUUsQ0FBQTtBQUM5RCx3QkFBZ0IsR0FBRywyQ0FBNkIsSUFBSSxDQUFDLFFBQVEsRUFBRSxZQUFZLENBQUMsT0FBTyxFQUFFLEVBQUUsWUFBTSxVQUFVLENBQUMsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtPQUNwSjtBQUNELGFBQU8sZ0JBQWdCLENBQUE7S0FDeEI7OztTQXJGa0IsYUFBYTs7O3FCQUFiLGFBQWEiLCJmaWxlIjoiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2xpbnRlci11aS1kZWZhdWx0L2xpYi9wYW5lbC9kZWxlZ2F0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCB7IFJhbmdlIH0gZnJvbSAnYXRvbSdcbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUsIEVtaXR0ZXIgfSBmcm9tICdzYi1ldmVudC1raXQnXG5pbXBvcnQgdHlwZSB7IFBhbmVsIH0gZnJvbSAnYXRvbSdcbmltcG9ydCB0eXBlIHsgRGlzcG9zYWJsZSB9IGZyb20gJ3NiLWV2ZW50LWtpdCdcblxuaW1wb3J0IHsgZmlsdGVyTWVzc2FnZXMsIGZpbHRlck1lc3NhZ2VzQnlSYW5nZU9yUG9pbnQgfSBmcm9tICcuLi9oZWxwZXJzJ1xuaW1wb3J0IHR5cGUgeyBMaW50ZXJNZXNzYWdlIH0gZnJvbSAnLi4vdHlwZXMnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBhbmVsRGVsZWdhdGUge1xuICBwYW5lbDogUGFuZWw7XG4gIGVtaXR0ZXI6IEVtaXR0ZXI7XG4gIG1lc3NhZ2VzOiBBcnJheTxMaW50ZXJNZXNzYWdlPjtcbiAgdmlzaWJpbGl0eTogYm9vbGVhbjtcbiAgcGFuZWxIZWlnaHQ6IG51bWJlcjtcbiAgc3Vic2NyaXB0aW9uczogQ29tcG9zaXRlRGlzcG9zYWJsZTtcbiAgcGFuZWxSZXByZXNlbnRzOiAnRW50aXJlIFByb2plY3QnIHwgJ0N1cnJlbnQgRmlsZScgfCAnQ3VycmVudCBMaW5lJztcbiAgcGFuZWxUYWtlc01pbmltdW1IZWlnaHQ6IGJvb2xlYW47XG5cbiAgY29uc3RydWN0b3IocGFuZWw6IFBhbmVsKSB7XG4gICAgdGhpcy5wYW5lbCA9IHBhbmVsXG4gICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXIoKVxuICAgIHRoaXMubWVzc2FnZXMgPSBbXVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLXVpLWRlZmF1bHQucGFuZWxSZXByZXNlbnRzJywgKHBhbmVsUmVwcmVzZW50cykgPT4ge1xuICAgICAgY29uc3Qgbm90SW5pdGlhbCA9IHR5cGVvZiB0aGlzLnBhbmVsUmVwcmVzZW50cyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAgIHRoaXMucGFuZWxSZXByZXNlbnRzID0gcGFuZWxSZXByZXNlbnRzXG4gICAgICBpZiAobm90SW5pdGlhbCkge1xuICAgICAgICB0aGlzLnVwZGF0ZSgpXG4gICAgICB9XG4gICAgfSkpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItdWktZGVmYXVsdC5wYW5lbEhlaWdodCcsIChwYW5lbEhlaWdodCkgPT4ge1xuICAgICAgY29uc3Qgbm90SW5pdGlhbCA9IHR5cGVvZiB0aGlzLnBhbmVsSGVpZ2h0ICE9PSAndW5kZWZpbmVkJ1xuICAgICAgdGhpcy5wYW5lbEhlaWdodCA9IHBhbmVsSGVpZ2h0XG4gICAgICBpZiAobm90SW5pdGlhbCkge1xuICAgICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnb2JzZXJ2ZS1wYW5lbC1jb25maWcnKVxuICAgICAgfVxuICAgIH0pKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLXVpLWRlZmF1bHQucGFuZWxUYWtlc01pbmltdW1IZWlnaHQnLCAocGFuZWxUYWtlc01pbmltdW1IZWlnaHQpID0+IHtcbiAgICAgIGNvbnN0IG5vdEluaXRpYWwgPSB0eXBlb2YgdGhpcy5wYW5lbFRha2VzTWluaW11bUhlaWdodCAhPT0gJ3VuZGVmaW5lZCdcbiAgICAgIHRoaXMucGFuZWxUYWtlc01pbmltdW1IZWlnaHQgPSBwYW5lbFRha2VzTWluaW11bUhlaWdodFxuICAgICAgaWYgKG5vdEluaXRpYWwpIHtcbiAgICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ29ic2VydmUtcGFuZWwtY29uZmlnJylcbiAgICAgIH1cbiAgICB9KSlcblxuICAgIGxldCBjaGFuZ2VTdWJzY3JpcHRpb25cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20ud29ya3NwYWNlLm9ic2VydmVBY3RpdmVQYW5lSXRlbSgocGFuZUl0ZW0pID0+IHtcbiAgICAgIGlmIChjaGFuZ2VTdWJzY3JpcHRpb24pIHtcbiAgICAgICAgY2hhbmdlU3Vic2NyaXB0aW9uLmRpc3Bvc2UoKVxuICAgICAgICBjaGFuZ2VTdWJzY3JpcHRpb24gPSBudWxsXG4gICAgICB9XG4gICAgICB0aGlzLnZpc2liaWxpdHkgPSBhdG9tLndvcmtzcGFjZS5pc1RleHRFZGl0b3IocGFuZUl0ZW0pXG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnb2JzZXJ2ZS12aXNpYmlsaXR5JywgdGhpcy52aXNpYmlsaXR5KVxuICAgICAgaWYgKHRoaXMudmlzaWJpbGl0eSkge1xuICAgICAgICBpZiAodGhpcy5wYW5lbFJlcHJlc2VudHMgIT09ICdFbnRpcmUgUHJvamVjdCcpIHtcbiAgICAgICAgICB0aGlzLnVwZGF0ZSgpXG4gICAgICAgIH1cbiAgICAgICAgbGV0IG9sZFJvdyA9IC0xXG4gICAgICAgIGNoYW5nZVN1YnNjcmlwdGlvbiA9IHBhbmVJdGVtLm9uRGlkQ2hhbmdlQ3Vyc29yUG9zaXRpb24oKHsgbmV3QnVmZmVyUG9zaXRpb24gfSkgPT4ge1xuICAgICAgICAgIGlmIChvbGRSb3cgIT09IG5ld0J1ZmZlclBvc2l0aW9uLnJvdyAmJiB0aGlzLnBhbmVsUmVwcmVzZW50cyA9PT0gJ0N1cnJlbnQgTGluZScpIHtcbiAgICAgICAgICAgIG9sZFJvdyA9IG5ld0J1ZmZlclBvc2l0aW9uLnJvd1xuICAgICAgICAgICAgdGhpcy51cGRhdGUoKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICAgIGNvbnN0IHNob3VsZFVwZGF0ZSA9IHR5cGVvZiB0aGlzLnZpc2liaWxpdHkgIT09ICd1bmRlZmluZWQnICYmIHRoaXMucGFuZWxSZXByZXNlbnRzICE9PSAnRW50aXJlIFByb2plY3QnXG5cbiAgICAgIGlmICh0aGlzLnZpc2liaWxpdHkgJiYgc2hvdWxkVXBkYXRlKSB7XG4gICAgICAgIHRoaXMudXBkYXRlKClcbiAgICAgIH1cbiAgICB9KSlcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKGNoYW5nZVN1YnNjcmlwdGlvbikge1xuICAgICAgICBjaGFuZ2VTdWJzY3JpcHRpb24uZGlzcG9zZSgpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuICBnZXQgZmlsdGVyZWRNZXNzYWdlcygpOiBBcnJheTxMaW50ZXJNZXNzYWdlPiB7XG4gICAgbGV0IGZpbHRlcmVkTWVzc2FnZXMgPSBbXVxuICAgIGlmICh0aGlzLnBhbmVsUmVwcmVzZW50cyA9PT0gJ0VudGlyZSBQcm9qZWN0Jykge1xuICAgICAgZmlsdGVyZWRNZXNzYWdlcyA9IHRoaXMubWVzc2FnZXNcbiAgICB9IGVsc2UgaWYgKHRoaXMucGFuZWxSZXByZXNlbnRzID09PSAnQ3VycmVudCBGaWxlJykge1xuICAgICAgY29uc3QgYWN0aXZlRWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICBpZiAoIWFjdGl2ZUVkaXRvcikgcmV0dXJuIFtdXG4gICAgICBmaWx0ZXJlZE1lc3NhZ2VzID0gZmlsdGVyTWVzc2FnZXModGhpcy5tZXNzYWdlcywgYWN0aXZlRWRpdG9yLmdldFBhdGgoKSlcbiAgICB9IGVsc2UgaWYgKHRoaXMucGFuZWxSZXByZXNlbnRzID09PSAnQ3VycmVudCBMaW5lJykge1xuICAgICAgY29uc3QgYWN0aXZlRWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICBpZiAoIWFjdGl2ZUVkaXRvcikgcmV0dXJuIFtdXG4gICAgICBjb25zdCBhY3RpdmVMaW5lID0gYWN0aXZlRWRpdG9yLmdldEN1cnNvcnMoKVswXS5nZXRCdWZmZXJSb3coKVxuICAgICAgZmlsdGVyZWRNZXNzYWdlcyA9IGZpbHRlck1lc3NhZ2VzQnlSYW5nZU9yUG9pbnQodGhpcy5tZXNzYWdlcywgYWN0aXZlRWRpdG9yLmdldFBhdGgoKSwgUmFuZ2UuZnJvbU9iamVjdChbW2FjdGl2ZUxpbmUsIDBdLCBbYWN0aXZlTGluZSwgSW5maW5pdHldXSkpXG4gICAgfVxuICAgIHJldHVybiBmaWx0ZXJlZE1lc3NhZ2VzXG4gIH1cbiAgdXBkYXRlKG1lc3NhZ2VzOiA/QXJyYXk8TGludGVyTWVzc2FnZT4gPSBudWxsKTogdm9pZCB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkobWVzc2FnZXMpKSB7XG4gICAgICB0aGlzLm1lc3NhZ2VzID0gbWVzc2FnZXNcbiAgICB9XG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ29ic2VydmUtbWVzc2FnZXMnLCB0aGlzLmZpbHRlcmVkTWVzc2FnZXMpXG4gIH1cbiAgdXBkYXRlUGFuZWxIZWlnaHQocGFuZWxIZWlnaHQ6IG51bWJlcik6IHZvaWQge1xuICAgIGF0b20uY29uZmlnLnNldCgnbGludGVyLXVpLWRlZmF1bHQucGFuZWxIZWlnaHQnLCBwYW5lbEhlaWdodClcbiAgfVxuICBvbkRpZENoYW5nZU1lc3NhZ2VzKGNhbGxiYWNrOiAoKG1lc3NhZ2VzOiBBcnJheTxMaW50ZXJNZXNzYWdlPikgPT4gYW55KSk6IERpc3Bvc2FibGUge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ29ic2VydmUtbWVzc2FnZXMnLCBjYWxsYmFjaylcbiAgfVxuICBvbkRpZENoYW5nZVZpc2liaWxpdHkoY2FsbGJhY2s6ICgodmlzaWJpbGl0eTogYm9vbGVhbikgPT4gYW55KSk6IERpc3Bvc2FibGUge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ29ic2VydmUtdmlzaWJpbGl0eScsIGNhbGxiYWNrKVxuICB9XG4gIG9uRGlkQ2hhbmdlUGFuZWxDb25maWcoY2FsbGJhY2s6ICgoKSA9PiBhbnkpKTogRGlzcG9zYWJsZSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignb2JzZXJ2ZS1wYW5lbC1jb25maWcnLCBjYWxsYmFjaylcbiAgfVxuICBzZXRQYW5lbFZpc2liaWxpdHkodmlzaWJpbGl0eTogYm9vbGVhbik6IHZvaWQge1xuICAgIGlmICh2aXNpYmlsaXR5ICYmICF0aGlzLnBhbmVsLmlzVmlzaWJsZSgpKSB7XG4gICAgICB0aGlzLnBhbmVsLnNob3coKVxuICAgIH0gZWxzZSBpZiAoIXZpc2liaWxpdHkgJiYgdGhpcy5wYW5lbC5pc1Zpc2libGUoKSkge1xuICAgICAgdGhpcy5wYW5lbC5oaWRlKClcbiAgICB9XG4gIH1cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gIH1cbn1cbiJdfQ==