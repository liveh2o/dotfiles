var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _delegate = require('./delegate');

var _delegate2 = _interopRequireDefault(_delegate);

var _dock = require('./dock');

var _dock2 = _interopRequireDefault(_dock);

var Panel = (function () {
  function Panel() {
    var _this = this;

    _classCallCheck(this, Panel);

    this.panel = null;
    this.element = document.createElement('div');
    this.delegate = new _delegate2['default']();
    this.messages = [];
    this.deactivating = false;
    this.subscriptions = new _atom.CompositeDisposable();
    this.showPanelStateMessages = false;

    this.subscriptions.add(this.delegate);
    this.subscriptions.add(atom.config.observe('linter-ui-default.hidePanelWhenEmpty', function (hidePanelWhenEmpty) {
      _this.hidePanelWhenEmpty = hidePanelWhenEmpty;
      _this.refresh();
    }));
    this.subscriptions.add(atom.workspace.onDidDestroyPaneItem(function (_ref) {
      var paneItem = _ref.item;

      if (paneItem instanceof _dock2['default'] && !_this.deactivating) {
        _this.panel = null;
        atom.config.set('linter-ui-default.showPanel', false);
      }
    }));
    this.subscriptions.add(atom.config.observe('linter-ui-default.showPanel', function (showPanel) {
      _this.showPanelConfig = showPanel;
      _this.refresh();
    }));
    this.subscriptions.add(atom.workspace.observeActivePaneItem(function () {
      _this.showPanelStateMessages = !!_this.delegate.filteredMessages.length;
      _this.refresh();
    }));
    this.activationTimer = window.requestIdleCallback(function () {
      _this.activate();
    });
  }

  _createClass(Panel, [{
    key: 'activate',
    value: _asyncToGenerator(function* () {
      if (this.panel) {
        return;
      }
      this.panel = new _dock2['default'](this.delegate);
      yield atom.workspace.open(this.panel, {
        activatePane: false,
        activateItem: false,
        searchAllPanes: true
      });
      this.update();
      this.refresh();
    })
  }, {
    key: 'update',
    value: function update() {
      var newMessages = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      if (newMessages) {
        this.messages = newMessages;
      }
      this.delegate.update(this.messages);
      this.showPanelStateMessages = !!this.delegate.filteredMessages.length;
      this.refresh();
    }
  }, {
    key: 'refresh',
    value: _asyncToGenerator(function* () {
      if (this.panel === null) {
        if (this.showPanelConfig) {
          yield this.activate();
        }
        return;
      }
      var paneContainer = atom.workspace.paneContainerForItem(this.panel);
      if (!paneContainer || paneContainer.location !== 'bottom' || paneContainer.getActivePaneItem() !== this.panel) {
        return;
      }
      if (this.showPanelConfig && (!this.hidePanelWhenEmpty || this.showPanelStateMessages)) {
        paneContainer.show();
      } else {
        paneContainer.hide();
      }
    })
  }, {
    key: 'dispose',
    value: function dispose() {
      this.deactivating = true;
      if (this.panel) {
        this.panel.dispose();
      }
      this.subscriptions.dispose();
      window.cancelIdleCallback(this.activationTimer);
    }
  }]);

  return Panel;
})();

module.exports = Panel;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvcGFuZWwvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7b0JBRW9DLE1BQU07O3dCQUNyQixZQUFZOzs7O29CQUNYLFFBQVE7Ozs7SUFHeEIsS0FBSztBQVdFLFdBWFAsS0FBSyxHQVdLOzs7MEJBWFYsS0FBSzs7QUFZUCxRQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQTtBQUNqQixRQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDNUMsUUFBSSxDQUFDLFFBQVEsR0FBRywyQkFBYyxDQUFBO0FBQzlCLFFBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFBO0FBQ2xCLFFBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFBO0FBQ3pCLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7QUFDOUMsUUFBSSxDQUFDLHNCQUFzQixHQUFHLEtBQUssQ0FBQTs7QUFFbkMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQ3JDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLHNDQUFzQyxFQUFFLFVBQUMsa0JBQWtCLEVBQUs7QUFDekcsWUFBSyxrQkFBa0IsR0FBRyxrQkFBa0IsQ0FBQTtBQUM1QyxZQUFLLE9BQU8sRUFBRSxDQUFBO0tBQ2YsQ0FBQyxDQUFDLENBQUE7QUFDSCxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLG9CQUFvQixDQUFDLFVBQUMsSUFBa0IsRUFBSztVQUFmLFFBQVEsR0FBaEIsSUFBa0IsQ0FBaEIsSUFBSTs7QUFDaEUsVUFBSSxRQUFRLDZCQUFxQixJQUFJLENBQUMsTUFBSyxZQUFZLEVBQUU7QUFDdkQsY0FB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QUFPLEVBQUUsQ0FBQTtPQUNyQjtBQUNELFVBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDNUIsWUFBTSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQTtLQUNoRDs7O1NBM0ZHLEtBQUs7OztBQThGWCxNQUFNLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQSIsImZpbGUiOiIvVXNlcnMvYWgvLmF0b20vcGFja2FnZXMvbGludGVyLXVpLWRlZmF1bHQvbGliL3BhbmVsL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nXG5pbXBvcnQgRGVsZWdhdGUgZnJvbSAnLi9kZWxlZ2F0ZSdcbmltcG9ydCBQYW5lbERvY2sgZnJvbSAnLi9kb2NrJ1xuaW1wb3J0IHR5cGUgeyBMaW50ZXJNZXNzYWdlIH0gZnJvbSAnLi4vdHlwZXMnXG5cbmNsYXNzIFBhbmVsIHtcbiAgcGFuZWw6ID9QYW5lbERvY2s7XG4gIGVsZW1lbnQ6IEhUTUxFbGVtZW50O1xuICBkZWxlZ2F0ZTogRGVsZWdhdGU7XG4gIG1lc3NhZ2VzOiBBcnJheTxMaW50ZXJNZXNzYWdlPjtcbiAgZGVhY3RpdmF0aW5nOiBib29sZWFuO1xuICBzdWJzY3JpcHRpb25zOiBDb21wb3NpdGVEaXNwb3NhYmxlO1xuICBzaG93UGFuZWxDb25maWc6IGJvb2xlYW47XG4gIGhpZGVQYW5lbFdoZW5FbXB0eTogYm9vbGVhbjtcbiAgc2hvd1BhbmVsU3RhdGVNZXNzYWdlczogYm9vbGVhbjtcbiAgYWN0aXZhdGlvblRpbWVyOiBudW1iZXI7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucGFuZWwgPSBudWxsXG4gICAgdGhpcy5lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICB0aGlzLmRlbGVnYXRlID0gbmV3IERlbGVnYXRlKClcbiAgICB0aGlzLm1lc3NhZ2VzID0gW11cbiAgICB0aGlzLmRlYWN0aXZhdGluZyA9IGZhbHNlXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgIHRoaXMuc2hvd1BhbmVsU3RhdGVNZXNzYWdlcyA9IGZhbHNlXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuZGVsZWdhdGUpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItdWktZGVmYXVsdC5oaWRlUGFuZWxXaGVuRW1wdHknLCAoaGlkZVBhbmVsV2hlbkVtcHR5KSA9PiB7XG4gICAgICB0aGlzLmhpZGVQYW5lbFdoZW5FbXB0eSA9IGhpZGVQYW5lbFdoZW5FbXB0eVxuICAgICAgdGhpcy5yZWZyZXNoKClcbiAgICB9KSlcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20ud29ya3NwYWNlLm9uRGlkRGVzdHJveVBhbmVJdGVtKCh7IGl0ZW06IHBhbmVJdGVtIH0pID0+IHtcbiAgICAgIGlmIChwYW5lSXRlbSBpbnN0YW5jZW9mIFBhbmVsRG9jayAmJiAhdGhpcy5kZWFjdGl2YXRpbmcpIHtcbiAgICAgICAgdGhpcy5wYW5lbCA9IG51bGxcbiAgICAgICAgYXRvbS5jb25maWcuc2V0KCdsaW50ZXItdWktZGVmYXVsdC5zaG93UGFuZWwnLCBmYWxzZSlcbiAgICAgIH1cbiAgICB9KSlcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci11aS1kZWZhdWx0LnNob3dQYW5lbCcsIChzaG93UGFuZWwpID0+IHtcbiAgICAgIHRoaXMuc2hvd1BhbmVsQ29uZmlnID0gc2hvd1BhbmVsXG4gICAgICB0aGlzLnJlZnJlc2goKVxuICAgIH0pKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZUFjdGl2ZVBhbmVJdGVtKCgpID0+IHtcbiAgICAgIHRoaXMuc2hvd1BhbmVsU3RhdGVNZXNzYWdlcyA9ICEhdGhpcy5kZWxlZ2F0ZS5maWx0ZXJlZE1lc3NhZ2VzLmxlbmd0aFxuICAgICAgdGhpcy5yZWZyZXNoKClcbiAgICB9KSlcbiAgICB0aGlzLmFjdGl2YXRpb25UaW1lciA9IHdpbmRvdy5yZXF1ZXN0SWRsZUNhbGxiYWNrKCgpID0+IHtcbiAgICAgIHRoaXMuYWN0aXZhdGUoKVxuICAgIH0pXG4gIH1cbiAgYXN5bmMgYWN0aXZhdGUoKSB7XG4gICAgaWYgKHRoaXMucGFuZWwpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICB0aGlzLnBhbmVsID0gbmV3IFBhbmVsRG9jayh0aGlzLmRlbGVnYXRlKVxuICAgIGF3YWl0IGF0b20ud29ya3NwYWNlLm9wZW4odGhpcy5wYW5lbCwge1xuICAgICAgYWN0aXZhdGVQYW5lOiBmYWxzZSxcbiAgICAgIGFjdGl2YXRlSXRlbTogZmFsc2UsXG4gICAgICBzZWFyY2hBbGxQYW5lczogdHJ1ZSxcbiAgICB9KVxuICAgIHRoaXMudXBkYXRlKClcbiAgICB0aGlzLnJlZnJlc2goKVxuICB9XG4gIHVwZGF0ZShuZXdNZXNzYWdlczogP0FycmF5PExpbnRlck1lc3NhZ2U+ID0gbnVsbCk6IHZvaWQge1xuICAgIGlmIChuZXdNZXNzYWdlcykge1xuICAgICAgdGhpcy5tZXNzYWdlcyA9IG5ld01lc3NhZ2VzXG4gICAgfVxuICAgIHRoaXMuZGVsZWdhdGUudXBkYXRlKHRoaXMubWVzc2FnZXMpXG4gICAgdGhpcy5zaG93UGFuZWxTdGF0ZU1lc3NhZ2VzID0gISF0aGlzLmRlbGVnYXRlLmZpbHRlcmVkTWVzc2FnZXMubGVuZ3RoXG4gICAgdGhpcy5yZWZyZXNoKClcbiAgfVxuICBhc3luYyByZWZyZXNoKCkge1xuICAgIGlmICh0aGlzLnBhbmVsID09PSBudWxsKSB7XG4gICAgICBpZiAodGhpcy5zaG93UGFuZWxDb25maWcpIHtcbiAgICAgICAgYXdhaXQgdGhpcy5hY3RpdmF0ZSgpXG4gICAgICB9XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgY29uc3QgcGFuZUNvbnRhaW5lciA9IGF0b20ud29ya3NwYWNlLnBhbmVDb250YWluZXJGb3JJdGVtKHRoaXMucGFuZWwpXG4gICAgaWYgKCFwYW5lQ29udGFpbmVyIHx8IHBhbmVDb250YWluZXIubG9jYXRpb24gIT09ICdib3R0b20nIHx8IHBhbmVDb250YWluZXIuZ2V0QWN0aXZlUGFuZUl0ZW0oKSAhPT0gdGhpcy5wYW5lbCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGlmIChcbiAgICAgICh0aGlzLnNob3dQYW5lbENvbmZpZykgJiZcbiAgICAgICghdGhpcy5oaWRlUGFuZWxXaGVuRW1wdHkgfHwgdGhpcy5zaG93UGFuZWxTdGF0ZU1lc3NhZ2VzKVxuICAgICkge1xuICAgICAgcGFuZUNvbnRhaW5lci5zaG93KClcbiAgICB9IGVsc2Uge1xuICAgICAgcGFuZUNvbnRhaW5lci5oaWRlKClcbiAgICB9XG4gIH1cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLmRlYWN0aXZhdGluZyA9IHRydWVcbiAgICBpZiAodGhpcy5wYW5lbCkge1xuICAgICAgdGhpcy5wYW5lbC5kaXNwb3NlKClcbiAgICB9XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgIHdpbmRvdy5jYW5jZWxJZGxlQ2FsbGJhY2sodGhpcy5hY3RpdmF0aW9uVGltZXIpXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBQYW5lbFxuIl19