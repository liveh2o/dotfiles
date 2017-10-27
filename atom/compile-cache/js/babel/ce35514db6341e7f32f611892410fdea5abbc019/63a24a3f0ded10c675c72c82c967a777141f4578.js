var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _helpers = require('../helpers');

var _delegate = require('./delegate');

var _delegate2 = _interopRequireDefault(_delegate);

var PanelDock = undefined;

var Panel = (function () {
  function Panel() {
    var _this = this;

    _classCallCheck(this, Panel);

    this.panel = null;
    this.element = document.createElement('div');
    this.delegate = new _delegate2['default']();
    this.deactivating = false;
    this.initializing = true;
    this.subscriptions = new _atom.CompositeDisposable();
    this.showPanelStateMessages = false;
    this.showPanelStatePane = atom.workspace.isTextEditor(atom.workspace.getActivePaneItem());

    this.subscriptions.add(this.delegate);
    this.subscriptions.add(atom.config.observe('linter-ui-default.hidePanelWhenEmpty', function (hidePanelWhenEmpty) {
      _this.hidePanelWhenEmpty = hidePanelWhenEmpty;
      _this.refresh();
    }));
    this.subscriptions.add(atom.config.observe('linter-ui-default.hidePanelUnlessTextEditor', function (hidePanelUnlessTextEditor) {
      _this.hidePanelUnlessTextEditor = hidePanelUnlessTextEditor;
      _this.refresh();
    }));
    this.subscriptions.add(atom.workspace.addOpener(function (uri) {
      if (uri === _helpers.WORKSPACE_URI) {
        var _ret = (function () {
          if (_this.panel) {
            _this.deactivate();
          }
          if (!PanelDock) {
            PanelDock = require('./dock');
          }
          var oldPaneItem = atom.workspace.getActivePaneItem();
          _this.panel = new PanelDock(_this.delegate);
          // NOTE: Atom has no API to not focus on the newly opened dock item
          setTimeout(function () {
            if (oldPaneItem && oldPaneItem.element) {
              oldPaneItem.element.focus();
            }
          }, 200);
          return {
            v: _this.panel
          };
        })();

        if (typeof _ret === 'object') return _ret.v;
      }
      return null;
    }));
    this.subscriptions.add(atom.workspace.onDidDestroyPaneItem(function (_ref) {
      var paneItem = _ref.item;

      var uri = paneItem && paneItem.getURI ? paneItem.getURI() : null;
      if (uri === _helpers.WORKSPACE_URI && !_this.deactivating) {
        atom.config.set('linter-ui-default.showPanel', false);
      }
    }));
    this.subscriptions.add(atom.workspace.onDidStopChangingActivePaneItem(function (paneItem) {
      if (PanelDock && paneItem instanceof PanelDock) {
        return;
      }
      _this.showPanelStatePane = atom.workspace.isTextEditor(paneItem);
      _this.refresh();
    }));
    this.subscriptions.add(atom.config.observe('linter-ui-default.showPanel', function (showPanel) {
      _this.showPanelConfig = showPanel;
      _this.refresh();
    }));
    this.initializing = false;
    this.refresh();
  }

  _createClass(Panel, [{
    key: 'update',
    value: function update(messages) {
      this.delegate.update(messages);
      this.showPanelStateMessages = !!this.delegate.filteredMessages.length;
      this.refresh();
    }
  }, {
    key: 'refresh',
    value: _asyncToGenerator(function* () {
      if (this.initializing) {
        return;
      }
      if (this.showPanelConfig && (!this.hidePanelUnlessTextEditor || this.showPanelStatePane) && (!this.hidePanelWhenEmpty || this.showPanelStateMessages)) {
        yield this.activate();
      } else {
        this.deactivate();
      }
    })
  }, {
    key: 'activate',
    value: _asyncToGenerator(function* () {
      if (this.panel) {
        return;
      }
      yield atom.workspace.open(_helpers.WORKSPACE_URI);
    })
  }, {
    key: 'deactivate',
    value: function deactivate() {
      if (!this.panel) {
        return;
      }
      this.deactivating = true;
      this.panel.dispose();
      this.deactivating = false;
      this.panel = null;
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.deactivate();
      this.subscriptions.dispose();
    }
  }]);

  return Panel;
})();

module.exports = Panel;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvcGFuZWwvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7b0JBRW9DLE1BQU07O3VCQUNaLFlBQVk7O3dCQUNyQixZQUFZOzs7O0FBR2pDLElBQUksU0FBUyxZQUFBLENBQUE7O0lBRVAsS0FBSztBQVlFLFdBWlAsS0FBSyxHQVlLOzs7MEJBWlYsS0FBSzs7QUFhUCxRQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQTtBQUNqQixRQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDNUMsUUFBSSxDQUFDLFFBQVEsR0FBRywyQkFBYyxDQUFBO0FBQzlCLFFBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFBO0FBQ3pCLFFBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFBO0FBQ3hCLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7QUFDOUMsUUFBSSxDQUFDLHNCQUFzQixHQUFHLEtBQUssQ0FBQTtBQUNuQyxRQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLENBQUE7O0FBRXpGLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUNyQyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxzQ0FBc0MsRUFBRSxVQUFDLGtCQUFrQixFQUFLO0FBQ3pHLFlBQUssa0JBQWtCLEdBQUcsa0JBQWtCLENBQUE7QUFDNUMsWUFBSyxPQUFPLEVBQUUsQ0FBQTtLQUNmLENBQUMsQ0FBQyxDQUFBO0FBQ0gsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0s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QUFJLENBQUMsZUFBZSxLQUNwQixDQUFDLElBQUksQ0FBQyx5QkFBeUIsSUFBSSxJQUFJLENBQUMsa0JBQWtCLENBQUEsQUFBQyxLQUMzRCxDQUFDLElBQUksQ0FBQyxrQkFBa0IsSUFBSSxJQUFJLENBQUMsc0JBQXNCLENBQUEsQUFBQyxFQUN6RDtBQUNBLGNBQU0sSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFBO09BQ3RCLE1BQU07QUFDTCxZQUFJLENBQUMsVUFBVSxFQUFFLENBQUE7T0FDbEI7S0FDRjs7OzZCQUNhLGFBQUc7QUFDZixVQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7QUFDZCxlQUFNO09BQ1A7QUFDRCxZQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSx3QkFBZSxDQUFBO0tBQ3pDOzs7V0FDUyxzQkFBRztBQUNYLFVBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO0FBQ2YsZUFBTTtPQUNQO0FBQ0QsVUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUE7QUFDeEIsVUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUNwQixVQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQTtBQUN6QixVQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQTtLQUNsQjs7O1dBQ00sbUJBQUc7QUFDUixVQUFJLENBQUMsVUFBVSxFQUFFLENBQUE7QUFDakIsVUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtLQUM3Qjs7O1NBNUdHLEtBQUs7OztBQStHWCxNQUFNLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQSIsImZpbGUiOiIvVXNlcnMvYWgvLmF0b20vcGFja2FnZXMvbGludGVyLXVpLWRlZmF1bHQvbGliL3BhbmVsL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nXG5pbXBvcnQgeyBXT1JLU1BBQ0VfVVJJIH0gZnJvbSAnLi4vaGVscGVycydcbmltcG9ydCBEZWxlZ2F0ZSBmcm9tICcuL2RlbGVnYXRlJ1xuaW1wb3J0IHR5cGUgeyBMaW50ZXJNZXNzYWdlIH0gZnJvbSAnLi4vdHlwZXMnXG5cbmxldCBQYW5lbERvY2tcblxuY2xhc3MgUGFuZWwge1xuICBwYW5lbDogP1BhbmVsRG9jaztcbiAgZWxlbWVudDogSFRNTEVsZW1lbnQ7XG4gIGRlbGVnYXRlOiBEZWxlZ2F0ZTtcbiAgZGVhY3RpdmF0aW5nOiBib29sZWFuO1xuICBpbml0aWFsaXppbmc6IGJvb2xlYW47XG4gIHN1YnNjcmlwdGlvbnM6IENvbXBvc2l0ZURpc3Bvc2FibGU7XG4gIHNob3dQYW5lbENvbmZpZzogYm9vbGVhbjtcbiAgaGlkZVBhbmVsV2hlbkVtcHR5OiBib29sZWFuO1xuICBoaWRlUGFuZWxVbmxlc3NUZXh0RWRpdG9yOiBib29sZWFuO1xuICBzaG93UGFuZWxTdGF0ZVBhbmU6IGJvb2xlYW47XG4gIHNob3dQYW5lbFN0YXRlTWVzc2FnZXM6IGJvb2xlYW47XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucGFuZWwgPSBudWxsXG4gICAgdGhpcy5lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICB0aGlzLmRlbGVnYXRlID0gbmV3IERlbGVnYXRlKClcbiAgICB0aGlzLmRlYWN0aXZhdGluZyA9IGZhbHNlXG4gICAgdGhpcy5pbml0aWFsaXppbmcgPSB0cnVlXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgIHRoaXMuc2hvd1BhbmVsU3RhdGVNZXNzYWdlcyA9IGZhbHNlXG4gICAgdGhpcy5zaG93UGFuZWxTdGF0ZVBhbmUgPSBhdG9tLndvcmtzcGFjZS5pc1RleHRFZGl0b3IoYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZUl0ZW0oKSlcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5kZWxlZ2F0ZSlcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci11aS1kZWZhdWx0LmhpZGVQYW5lbFdoZW5FbXB0eScsIChoaWRlUGFuZWxXaGVuRW1wdHkpID0+IHtcbiAgICAgIHRoaXMuaGlkZVBhbmVsV2hlbkVtcHR5ID0gaGlkZVBhbmVsV2hlbkVtcHR5XG4gICAgICB0aGlzLnJlZnJlc2goKVxuICAgIH0pKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLXVpLWRlZmF1bHQuaGlkZVBhbmVsVW5sZXNzVGV4dEVkaXRvcicsIChoaWRlUGFuZWxVbmxlc3NUZXh0RWRpdG9yKSA9PiB7XG4gICAgICB0aGlzLmhpZGVQYW5lbFVubGVzc1RleHRFZGl0b3IgPSBoaWRlUGFuZWxVbmxlc3NUZXh0RWRpdG9yXG4gICAgICB0aGlzLnJlZnJlc2goKVxuICAgIH0pKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS53b3Jrc3BhY2UuYWRkT3BlbmVyKCh1cmkpID0+IHtcbiAgICAgIGlmICh1cmkgPT09IFdPUktTUEFDRV9VUkkpIHtcbiAgICAgICAgaWYgKHRoaXMucGFuZWwpIHtcbiAgICAgICAgICB0aGlzLmRlYWN0aXZhdGUoKVxuICAgICAgICB9XG4gICAgICAgIGlmICghUGFuZWxEb2NrKSB7XG4gICAgICAgICAgUGFuZWxEb2NrID0gcmVxdWlyZSgnLi9kb2NrJylcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBvbGRQYW5lSXRlbSA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmVJdGVtKClcbiAgICAgICAgdGhpcy5wYW5lbCA9IG5ldyBQYW5lbERvY2sodGhpcy5kZWxlZ2F0ZSlcbiAgICAgICAgLy8gTk9URTogQXRvbSBoYXMgbm8gQVBJIHRvIG5vdCBmb2N1cyBvbiB0aGUgbmV3bHkgb3BlbmVkIGRvY2sgaXRlbVxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGlmIChvbGRQYW5lSXRlbSAmJiBvbGRQYW5lSXRlbS5lbGVtZW50KSB7XG4gICAgICAgICAgICBvbGRQYW5lSXRlbS5lbGVtZW50LmZvY3VzKClcbiAgICAgICAgICB9XG4gICAgICAgIH0sIDIwMClcbiAgICAgICAgcmV0dXJuIHRoaXMucGFuZWxcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsXG4gICAgfSkpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLndvcmtzcGFjZS5vbkRpZERlc3Ryb3lQYW5lSXRlbSgoeyBpdGVtOiBwYW5lSXRlbSB9KSA9PiB7XG4gICAgICBjb25zdCB1cmkgPSBwYW5lSXRlbSAmJiBwYW5lSXRlbS5nZXRVUkkgPyBwYW5lSXRlbS5nZXRVUkkoKSA6IG51bGxcbiAgICAgIGlmICh1cmkgPT09IFdPUktTUEFDRV9VUkkgJiYgIXRoaXMuZGVhY3RpdmF0aW5nKSB7XG4gICAgICAgIGF0b20uY29uZmlnLnNldCgnbGludGVyLXVpLWRlZmF1bHQuc2hvd1BhbmVsJywgZmFsc2UpXG4gICAgICB9XG4gICAgfSkpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLndvcmtzcGFjZS5vbkRpZFN0b3BDaGFuZ2luZ0FjdGl2ZVBhbmVJdGVtKChwYW5lSXRlbSkgPT4ge1xuICAgICAgaWYgKFBhbmVsRG9jayAmJiBwYW5lSXRlbSBpbnN0YW5jZW9mIFBhbmVsRG9jaykge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIHRoaXMuc2hvd1BhbmVsU3RhdGVQYW5lID0gYXRvbS53b3Jrc3BhY2UuaXNUZXh0RWRpdG9yKHBhbmVJdGVtKVxuICAgICAgdGhpcy5yZWZyZXNoKClcbiAgICB9KSlcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci11aS1kZWZhdWx0LnNob3dQYW5lbCcsIChzaG93UGFuZWwpID0+IHtcbiAgICAgIHRoaXMuc2hvd1BhbmVsQ29uZmlnID0gc2hvd1BhbmVsXG4gICAgICB0aGlzLnJlZnJlc2goKVxuICAgIH0pKVxuICAgIHRoaXMuaW5pdGlhbGl6aW5nID0gZmFsc2VcbiAgICB0aGlzLnJlZnJlc2goKVxuICB9XG4gIHVwZGF0ZShtZXNzYWdlczogQXJyYXk8TGludGVyTWVzc2FnZT4pOiB2b2lkIHtcbiAgICB0aGlzLmRlbGVnYXRlLnVwZGF0ZShtZXNzYWdlcylcbiAgICB0aGlzLnNob3dQYW5lbFN0YXRlTWVzc2FnZXMgPSAhIXRoaXMuZGVsZWdhdGUuZmlsdGVyZWRNZXNzYWdlcy5sZW5ndGhcbiAgICB0aGlzLnJlZnJlc2goKVxuICB9XG4gIGFzeW5jIHJlZnJlc2goKSB7XG4gICAgaWYgKHRoaXMuaW5pdGlhbGl6aW5nKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgaWYgKFxuICAgICAgKHRoaXMuc2hvd1BhbmVsQ29uZmlnKSAmJlxuICAgICAgKCF0aGlzLmhpZGVQYW5lbFVubGVzc1RleHRFZGl0b3IgfHwgdGhpcy5zaG93UGFuZWxTdGF0ZVBhbmUpICYmXG4gICAgICAoIXRoaXMuaGlkZVBhbmVsV2hlbkVtcHR5IHx8IHRoaXMuc2hvd1BhbmVsU3RhdGVNZXNzYWdlcylcbiAgICApIHtcbiAgICAgIGF3YWl0IHRoaXMuYWN0aXZhdGUoKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRlYWN0aXZhdGUoKVxuICAgIH1cbiAgfVxuICBhc3luYyBhY3RpdmF0ZSgpIHtcbiAgICBpZiAodGhpcy5wYW5lbCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGF3YWl0IGF0b20ud29ya3NwYWNlLm9wZW4oV09SS1NQQUNFX1VSSSlcbiAgfVxuICBkZWFjdGl2YXRlKCkge1xuICAgIGlmICghdGhpcy5wYW5lbCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIHRoaXMuZGVhY3RpdmF0aW5nID0gdHJ1ZVxuICAgIHRoaXMucGFuZWwuZGlzcG9zZSgpXG4gICAgdGhpcy5kZWFjdGl2YXRpbmcgPSBmYWxzZVxuICAgIHRoaXMucGFuZWwgPSBudWxsXG4gIH1cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLmRlYWN0aXZhdGUoKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFBhbmVsXG4iXX0=