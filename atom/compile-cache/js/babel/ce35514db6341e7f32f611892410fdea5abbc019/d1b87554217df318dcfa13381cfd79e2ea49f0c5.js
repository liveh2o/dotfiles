var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atomSelectList = require('atom-select-list');

var _atomSelectList2 = _interopRequireDefault(_atomSelectList);

var _atom = require('atom');

var ToggleProviders = (function () {
  function ToggleProviders(action, providers) {
    var _this = this;

    _classCallCheck(this, ToggleProviders);

    this.action = action;
    this.emitter = new _atom.Emitter();
    this.providers = providers;
    this.subscriptions = new _atom.CompositeDisposable();

    this.subscriptions.add(this.emitter);
    this.subscriptions.add(atom.config.observe('linter.disabledProviders', function (disabledProviders) {
      _this.disabledProviders = disabledProviders;
    }));
  }

  _createClass(ToggleProviders, [{
    key: 'getItems',
    value: _asyncToGenerator(function* () {
      var _this2 = this;

      if (this.action === 'disable') {
        return this.providers.filter(function (name) {
          return !_this2.disabledProviders.includes(name);
        });
      }
      return this.disabledProviders;
    })
  }, {
    key: 'process',
    value: _asyncToGenerator(function* (name) {
      if (this.action === 'disable') {
        this.disabledProviders.push(name);
        this.emitter.emit('did-disable', name);
      } else {
        var index = this.disabledProviders.indexOf(name);
        if (index !== -1) {
          this.disabledProviders.splice(index, 1);
        }
      }
      atom.config.set('linter.disabledProviders', this.disabledProviders);
    })
  }, {
    key: 'show',
    value: _asyncToGenerator(function* () {
      var _this3 = this;

      var selectListView = new _atomSelectList2['default']({
        items: yield this.getItems(),
        emptyMessage: 'No matches found',
        filterKeyForItem: function filterKeyForItem(item) {
          return item;
        },
        elementForItem: function elementForItem(item) {
          var li = document.createElement('li');
          li.textContent = item;
          return li;
        },
        didConfirmSelection: function didConfirmSelection(item) {
          _this3.process(item)['catch'](function (e) {
            return console.error('[Linter] Unable to process toggle:', e);
          }).then(function () {
            return _this3.dispose();
          });
        },
        didCancelSelection: function didCancelSelection() {
          _this3.dispose();
        }
      });
      var panel = atom.workspace.addModalPanel({ item: selectListView });

      selectListView.focus();
      this.subscriptions.add(new _atom.Disposable(function () {
        panel.destroy();
      }));
    })
  }, {
    key: 'onDidDispose',
    value: function onDidDispose(callback) {
      return this.emitter.on('did-dispose', callback);
    }
  }, {
    key: 'onDidDisable',
    value: function onDidDisable(callback) {
      return this.emitter.on('did-disable', callback);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.emitter.emit('did-dispose');
      this.subscriptions.dispose();
    }
  }]);

  return ToggleProviders;
})();

module.exports = ToggleProviders;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL3RvZ2dsZS12aWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OzhCQUUyQixrQkFBa0I7Ozs7b0JBQ1ksTUFBTTs7SUFJekQsZUFBZTtBQU9SLFdBUFAsZUFBZSxDQU9QLE1BQW9CLEVBQUUsU0FBd0IsRUFBRTs7OzBCQVB4RCxlQUFlOztBQVFqQixRQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQTtBQUNwQixRQUFJLENBQUMsT0FBTyxHQUFHLG1CQUFhLENBQUE7QUFDNUIsUUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUE7QUFDMUIsUUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQTs7QUFFOUMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQ3BDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLDBCQUEwQixFQUFFLFVBQUMsaUJBQWlCLEVBQUs7QUFDNUYsWUFBSyxpQkFBaUIsR0FBRyxpQkFBaUIsQ0FBQTtLQUMzQyxDQUFDLENBQUMsQ0FBQTtHQUNKOztlQWpCRyxlQUFlOzs2QkFrQkwsYUFBMkI7OztBQUN2QyxVQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssU0FBUyxFQUFFO0FBQzdCLGVBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsVUFBQSxJQUFJO2lCQUFJLENBQUMsT0FBSyxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO1NBQUEsQ0FBQyxDQUFBO09BQzdFO0FBQ0QsYUFBTyxJQUFJLENBQUMsaUJBQWlCLENBQUE7S0FDOUI7Ozs2QkFDWSxXQUFDLElBQVksRUFBaUI7QUFDekMsVUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLFNBQVMsRUFBRTtBQUM3QixZQUFJLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQ2pDLFlBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsQ0FBQTtPQUN2QyxNQUFNO0FBQ0wsWUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtBQUNsRCxZQUFJLEtBQUssS0FBSyxDQUFDLENBQUMsRUFBRTtBQUNoQixjQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQTtTQUN4QztPQUNGO0FBQ0QsVUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsMEJBQTBCLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUE7S0FDcEU7Ozs2QkFDUyxhQUFHOzs7QUFDWCxVQUFNLGNBQWMsR0FBRyxnQ0FBbUI7QUFDeEMsYUFBSyxFQUFFLE1BQU0sSUFBSSxDQUFDLFFBQVEsRUFBRTtBQUM1QixvQkFBWSxFQUFFLGtCQUFrQjtBQUNoQyx3QkFBZ0IsRUFBRSwwQkFBQSxJQUFJO2lCQUFJLElBQUk7U0FBQTtBQUM5QixzQkFBYyxFQUFFLHdCQUFDLElBQUksRUFBSztBQUN4QixjQUFNLEVBQUUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQ3ZDLFlBQUUsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFBO0FBQ3JCLGlCQUFPLEVBQUUsQ0FBQTtTQUNWO0FBQ0QsMkJBQW1CLEVBQUUsNkJBQUMsSUFBSSxFQUFLO0FBQzdCLGlCQUFLLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBTSxDQUFDLFVBQUEsQ0FBQzttQkFBSSxPQUFPLENBQUMsS0FBSyxDQUFDLG9DQUFvQyxFQUFFLENBQUMsQ0FBQztXQUFBLENBQUMsQ0FBQyxJQUFJLENBQUM7bUJBQU0sT0FBSyxPQUFPLEVBQUU7V0FBQSxDQUFDLENBQUE7U0FDakg7QUFDRCwwQkFBa0IsRUFBRSw4QkFBTTtBQUN4QixpQkFBSyxPQUFPLEVBQUUsQ0FBQTtTQUNmO09BQ0YsQ0FBQyxDQUFBO0FBQ0YsVUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFFLENBQUMsQ0FBQTs7QUFFcEUsb0JBQWMsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtBQUN0QixVQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxxQkFBZSxZQUFXO0FBQy9DLGFBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQTtPQUNoQixDQUFDLENBQUMsQ0FBQTtLQUNKOzs7V0FDVyxzQkFBQyxRQUFxQixFQUFjO0FBQzlDLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLFFBQVEsQ0FBQyxDQUFBO0tBQ2hEOzs7V0FDVyxzQkFBQyxRQUFpQyxFQUFjO0FBQzFELGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLFFBQVEsQ0FBQyxDQUFBO0tBQ2hEOzs7V0FDTSxtQkFBRztBQUNSLFVBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFBO0FBQ2hDLFVBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUE7S0FDN0I7OztTQXJFRyxlQUFlOzs7QUF3RXJCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsZUFBZSxDQUFBIiwiZmlsZSI6Ii9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL3RvZ2dsZS12aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IFNlbGVjdExpc3RWaWV3IGZyb20gJ2F0b20tc2VsZWN0LWxpc3QnXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlLCBFbWl0dGVyLCBEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcblxudHlwZSBUb2dnbGVBY3Rpb24gPSAnZW5hYmxlJyB8ICdkaXNhYmxlJ1xuXG5jbGFzcyBUb2dnbGVQcm92aWRlcnMge1xuICBhY3Rpb246IFRvZ2dsZUFjdGlvbjtcbiAgZW1pdHRlcjogRW1pdHRlcjtcbiAgcHJvdmlkZXJzOiBBcnJheTxzdHJpbmc+O1xuICBzdWJzY3JpcHRpb25zOiBDb21wb3NpdGVEaXNwb3NhYmxlO1xuICBkaXNhYmxlZFByb3ZpZGVyczogQXJyYXk8c3RyaW5nPjtcblxuICBjb25zdHJ1Y3RvcihhY3Rpb246IFRvZ2dsZUFjdGlvbiwgcHJvdmlkZXJzOiBBcnJheTxzdHJpbmc+KSB7XG4gICAgdGhpcy5hY3Rpb24gPSBhY3Rpb25cbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpXG4gICAgdGhpcy5wcm92aWRlcnMgPSBwcm92aWRlcnNcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuZW1pdHRlcilcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci5kaXNhYmxlZFByb3ZpZGVycycsIChkaXNhYmxlZFByb3ZpZGVycykgPT4ge1xuICAgICAgdGhpcy5kaXNhYmxlZFByb3ZpZGVycyA9IGRpc2FibGVkUHJvdmlkZXJzXG4gICAgfSkpXG4gIH1cbiAgYXN5bmMgZ2V0SXRlbXMoKTogUHJvbWlzZTxBcnJheTxzdHJpbmc+PiB7XG4gICAgaWYgKHRoaXMuYWN0aW9uID09PSAnZGlzYWJsZScpIHtcbiAgICAgIHJldHVybiB0aGlzLnByb3ZpZGVycy5maWx0ZXIobmFtZSA9PiAhdGhpcy5kaXNhYmxlZFByb3ZpZGVycy5pbmNsdWRlcyhuYW1lKSlcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZGlzYWJsZWRQcm92aWRlcnNcbiAgfVxuICBhc3luYyBwcm9jZXNzKG5hbWU6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICh0aGlzLmFjdGlvbiA9PT0gJ2Rpc2FibGUnKSB7XG4gICAgICB0aGlzLmRpc2FibGVkUHJvdmlkZXJzLnB1c2gobmFtZSlcbiAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtZGlzYWJsZScsIG5hbWUpXG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5kaXNhYmxlZFByb3ZpZGVycy5pbmRleE9mKG5hbWUpXG4gICAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICAgIHRoaXMuZGlzYWJsZWRQcm92aWRlcnMuc3BsaWNlKGluZGV4LCAxKVxuICAgICAgfVxuICAgIH1cbiAgICBhdG9tLmNvbmZpZy5zZXQoJ2xpbnRlci5kaXNhYmxlZFByb3ZpZGVycycsIHRoaXMuZGlzYWJsZWRQcm92aWRlcnMpXG4gIH1cbiAgYXN5bmMgc2hvdygpIHtcbiAgICBjb25zdCBzZWxlY3RMaXN0VmlldyA9IG5ldyBTZWxlY3RMaXN0Vmlldyh7XG4gICAgICBpdGVtczogYXdhaXQgdGhpcy5nZXRJdGVtcygpLFxuICAgICAgZW1wdHlNZXNzYWdlOiAnTm8gbWF0Y2hlcyBmb3VuZCcsXG4gICAgICBmaWx0ZXJLZXlGb3JJdGVtOiBpdGVtID0+IGl0ZW0sXG4gICAgICBlbGVtZW50Rm9ySXRlbTogKGl0ZW0pID0+IHtcbiAgICAgICAgY29uc3QgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpXG4gICAgICAgIGxpLnRleHRDb250ZW50ID0gaXRlbVxuICAgICAgICByZXR1cm4gbGlcbiAgICAgIH0sXG4gICAgICBkaWRDb25maXJtU2VsZWN0aW9uOiAoaXRlbSkgPT4ge1xuICAgICAgICB0aGlzLnByb2Nlc3MoaXRlbSkuY2F0Y2goZSA9PiBjb25zb2xlLmVycm9yKCdbTGludGVyXSBVbmFibGUgdG8gcHJvY2VzcyB0b2dnbGU6JywgZSkpLnRoZW4oKCkgPT4gdGhpcy5kaXNwb3NlKCkpXG4gICAgICB9LFxuICAgICAgZGlkQ2FuY2VsU2VsZWN0aW9uOiAoKSA9PiB7XG4gICAgICAgIHRoaXMuZGlzcG9zZSgpXG4gICAgICB9LFxuICAgIH0pXG4gICAgY29uc3QgcGFuZWwgPSBhdG9tLndvcmtzcGFjZS5hZGRNb2RhbFBhbmVsKHsgaXRlbTogc2VsZWN0TGlzdFZpZXcgfSlcblxuICAgIHNlbGVjdExpc3RWaWV3LmZvY3VzKClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKG5ldyBEaXNwb3NhYmxlKGZ1bmN0aW9uKCkge1xuICAgICAgcGFuZWwuZGVzdHJveSgpXG4gICAgfSkpXG4gIH1cbiAgb25EaWREaXNwb3NlKGNhbGxiYWNrOiAoKCkgPT4gYW55KSk6IERpc3Bvc2FibGUge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC1kaXNwb3NlJywgY2FsbGJhY2spXG4gIH1cbiAgb25EaWREaXNhYmxlKGNhbGxiYWNrOiAoKG5hbWU6IHN0cmluZykgPT4gYW55KSk6IERpc3Bvc2FibGUge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC1kaXNhYmxlJywgY2FsbGJhY2spXG4gIH1cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWRpc3Bvc2UnKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRvZ2dsZVByb3ZpZGVyc1xuIl19