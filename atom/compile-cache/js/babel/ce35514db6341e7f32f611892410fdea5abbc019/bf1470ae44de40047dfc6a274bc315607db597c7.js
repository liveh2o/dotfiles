Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _sbConfigFile = require('sb-config-file');

var _sbConfigFile2 = _interopRequireDefault(_sbConfigFile);

var _atomSelectList = require('atom-select-list');

var _atomSelectList2 = _interopRequireDefault(_atomSelectList);

var _atom = require('atom');

var _helpers = require('./helpers');

var ToggleProviders = (function () {
  function ToggleProviders(action, providers) {
    _classCallCheck(this, ToggleProviders);

    this.action = action;
    this.config = null;
    this.emitter = new _atom.Emitter();
    this.providers = providers;
    this.subscriptions = new _atom.CompositeDisposable();

    this.subscriptions.add(this.emitter);
  }

  _createClass(ToggleProviders, [{
    key: 'getConfig',
    value: _asyncToGenerator(function* () {
      if (!this.config) {
        this.config = yield (0, _helpers.getConfigFile)();
      }
      return this.config;
    })
  }, {
    key: 'getItems',
    value: _asyncToGenerator(function* () {
      var disabled = yield (yield this.getConfig()).get('disabled');
      if (this.action === 'disable') {
        return this.providers.filter(function (name) {
          return !disabled.includes(name);
        });
      }
      return disabled;
    })
  }, {
    key: 'process',
    value: _asyncToGenerator(function* (name) {
      var config = yield this.getConfig();
      var disabled = yield config.get('disabled');
      if (this.action === 'disable') {
        disabled.push(name);
        this.emitter.emit('did-disable', name);
      } else {
        var index = disabled.indexOf(name);
        if (index !== -1) {
          disabled.splice(index, 1);
        }
      }
      yield this.config.set('disabled', disabled);
    })
  }, {
    key: 'show',
    value: _asyncToGenerator(function* () {
      var _this = this;

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
          _this.process(item)['catch'](function (e) {
            return console.error('[Linter] Unable to process toggle:', e);
          }).then(function () {
            return _this.dispose();
          });
        },
        didCancelSelection: function didCancelSelection() {
          _this.dispose();
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

exports['default'] = ToggleProviders;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL3RvZ2dsZS12aWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs0QkFFdUIsZ0JBQWdCOzs7OzhCQUNaLGtCQUFrQjs7OztvQkFDWSxNQUFNOzt1QkFDakMsV0FBVzs7SUFJcEIsZUFBZTtBQU92QixXQVBRLGVBQWUsQ0FPdEIsTUFBb0IsRUFBRSxTQUF3QixFQUFFOzBCQVB6QyxlQUFlOztBQVFoQyxRQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQTtBQUNwQixRQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQTtBQUNsQixRQUFJLENBQUMsT0FBTyxHQUFHLG1CQUFhLENBQUE7QUFDNUIsUUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUE7QUFDMUIsUUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQTs7QUFFOUMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0dBQ3JDOztlQWZrQixlQUFlOzs2QkFnQm5CLGFBQXdCO0FBQ3JDLFVBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQ2hCLFlBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSw2QkFBZSxDQUFBO09BQ3BDO0FBQ0QsYUFBTyxJQUFJLENBQUMsTUFBTSxDQUFBO0tBQ25COzs7NkJBQ2EsYUFBMkI7QUFDdkMsVUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLE1BQU0sSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFBLENBQUUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFBO0FBQy9ELFVBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxTQUFTLEVBQUU7QUFDN0IsZUFBTyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxVQUFBLElBQUk7aUJBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztTQUFBLENBQUMsQ0FBQTtPQUMvRDtBQUNELGFBQU8sUUFBUSxDQUFBO0tBQ2hCOzs7NkJBQ1ksV0FBQyxJQUFZLEVBQWlCO0FBQ3pDLFVBQU0sTUFBTSxHQUFHLE1BQU0sSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFBO0FBQ3JDLFVBQU0sUUFBdUIsR0FBRyxNQUFNLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUE7QUFDNUQsVUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLFNBQVMsRUFBRTtBQUM3QixnQkFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtBQUNuQixZQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLENBQUE7T0FDdkMsTUFBTTtBQUNMLFlBQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDcEMsWUFBSSxLQUFLLEtBQUssQ0FBQyxDQUFDLEVBQUU7QUFDaEIsa0JBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFBO1NBQzFCO09BQ0Y7QUFDRCxZQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQTtLQUM1Qzs7OzZCQUNTLGFBQUc7OztBQUNYLFVBQU0sY0FBYyxHQUFHLGdDQUFtQjtBQUN4QyxhQUFLLEVBQUUsTUFBTSxJQUFJLENBQUMsUUFBUSxFQUFFO0FBQzVCLG9CQUFZLEVBQUUsa0JBQWtCO0FBQ2hDLHdCQUFnQixFQUFFLDBCQUFBLElBQUk7aUJBQUksSUFBSTtTQUFBO0FBQzlCLHNCQUFjLEVBQUUsd0JBQUMsSUFBSSxFQUFLO0FBQ3hCLGNBQU0sRUFBRSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDdkMsWUFBRSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUE7QUFDckIsaUJBQU8sRUFBRSxDQUFBO1NBQ1Y7QUFDRCwyQkFBbUIsRUFBRSw2QkFBQyxJQUFJLEVBQUs7QUFDN0IsZ0JBQUssT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFNLENBQUMsVUFBQSxDQUFDO21CQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUMsb0NBQW9DLEVBQUUsQ0FBQyxDQUFDO1dBQUEsQ0FBQyxDQUFDLElBQUksQ0FBQzttQkFBTSxNQUFLLE9BQU8sRUFBRTtXQUFBLENBQUMsQ0FBQTtTQUNqSDtBQUNELDBCQUFrQixFQUFFLDhCQUFNO0FBQ3hCLGdCQUFLLE9BQU8sRUFBRSxDQUFBO1NBQ2Y7T0FDRixDQUFDLENBQUE7QUFDRixVQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsQ0FBQyxDQUFBOztBQUVwRSxvQkFBYyxDQUFDLEtBQUssRUFBRSxDQUFBO0FBQ3RCLFVBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLHFCQUFlLFlBQVc7QUFDL0MsYUFBSyxDQUFDLE9BQU8sRUFBRSxDQUFBO09BQ2hCLENBQUMsQ0FBQyxDQUFBO0tBQ0o7OztXQUNXLHNCQUFDLFFBQXFCLEVBQWM7QUFDOUMsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsUUFBUSxDQUFDLENBQUE7S0FDaEQ7OztXQUNXLHNCQUFDLFFBQWlDLEVBQWM7QUFDMUQsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsUUFBUSxDQUFDLENBQUE7S0FDaEQ7OztXQUNNLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUE7QUFDaEMsVUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtLQUM3Qjs7O1NBNUVrQixlQUFlOzs7cUJBQWYsZUFBZSIsImZpbGUiOiIvVXNlcnMvYWgvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi90b2dnbGUtdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCBDb25maWdGaWxlIGZyb20gJ3NiLWNvbmZpZy1maWxlJ1xuaW1wb3J0IFNlbGVjdExpc3RWaWV3IGZyb20gJ2F0b20tc2VsZWN0LWxpc3QnXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlLCBFbWl0dGVyLCBEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcbmltcG9ydCB7IGdldENvbmZpZ0ZpbGUgfSBmcm9tICcuL2hlbHBlcnMnXG5cbnR5cGUgVG9nZ2xlQWN0aW9uID0gJ2VuYWJsZScgfCAnZGlzYWJsZSdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVG9nZ2xlUHJvdmlkZXJzIHtcbiAgYWN0aW9uOiBUb2dnbGVBY3Rpb247XG4gIGNvbmZpZzogQ29uZmlnRmlsZTtcbiAgZW1pdHRlcjogRW1pdHRlcjtcbiAgcHJvdmlkZXJzOiBBcnJheTxzdHJpbmc+O1xuICBzdWJzY3JpcHRpb25zOiBDb21wb3NpdGVEaXNwb3NhYmxlO1xuXG4gIGNvbnN0cnVjdG9yKGFjdGlvbjogVG9nZ2xlQWN0aW9uLCBwcm92aWRlcnM6IEFycmF5PHN0cmluZz4pIHtcbiAgICB0aGlzLmFjdGlvbiA9IGFjdGlvblxuICAgIHRoaXMuY29uZmlnID0gbnVsbFxuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKClcbiAgICB0aGlzLnByb3ZpZGVycyA9IHByb3ZpZGVyc1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5lbWl0dGVyKVxuICB9XG4gIGFzeW5jIGdldENvbmZpZygpOiBQcm9taXNlPENvbmZpZ0ZpbGU+IHtcbiAgICBpZiAoIXRoaXMuY29uZmlnKSB7XG4gICAgICB0aGlzLmNvbmZpZyA9IGF3YWl0IGdldENvbmZpZ0ZpbGUoKVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5jb25maWdcbiAgfVxuICBhc3luYyBnZXRJdGVtcygpOiBQcm9taXNlPEFycmF5PHN0cmluZz4+IHtcbiAgICBjb25zdCBkaXNhYmxlZCA9IGF3YWl0IChhd2FpdCB0aGlzLmdldENvbmZpZygpKS5nZXQoJ2Rpc2FibGVkJylcbiAgICBpZiAodGhpcy5hY3Rpb24gPT09ICdkaXNhYmxlJykge1xuICAgICAgcmV0dXJuIHRoaXMucHJvdmlkZXJzLmZpbHRlcihuYW1lID0+ICFkaXNhYmxlZC5pbmNsdWRlcyhuYW1lKSlcbiAgICB9XG4gICAgcmV0dXJuIGRpc2FibGVkXG4gIH1cbiAgYXN5bmMgcHJvY2VzcyhuYW1lOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBjb25maWcgPSBhd2FpdCB0aGlzLmdldENvbmZpZygpXG4gICAgY29uc3QgZGlzYWJsZWQ6IEFycmF5PHN0cmluZz4gPSBhd2FpdCBjb25maWcuZ2V0KCdkaXNhYmxlZCcpXG4gICAgaWYgKHRoaXMuYWN0aW9uID09PSAnZGlzYWJsZScpIHtcbiAgICAgIGRpc2FibGVkLnB1c2gobmFtZSlcbiAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtZGlzYWJsZScsIG5hbWUpXG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGluZGV4ID0gZGlzYWJsZWQuaW5kZXhPZihuYW1lKVxuICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICBkaXNhYmxlZC5zcGxpY2UoaW5kZXgsIDEpXG4gICAgICB9XG4gICAgfVxuICAgIGF3YWl0IHRoaXMuY29uZmlnLnNldCgnZGlzYWJsZWQnLCBkaXNhYmxlZClcbiAgfVxuICBhc3luYyBzaG93KCkge1xuICAgIGNvbnN0IHNlbGVjdExpc3RWaWV3ID0gbmV3IFNlbGVjdExpc3RWaWV3KHtcbiAgICAgIGl0ZW1zOiBhd2FpdCB0aGlzLmdldEl0ZW1zKCksXG4gICAgICBlbXB0eU1lc3NhZ2U6ICdObyBtYXRjaGVzIGZvdW5kJyxcbiAgICAgIGZpbHRlcktleUZvckl0ZW06IGl0ZW0gPT4gaXRlbSxcbiAgICAgIGVsZW1lbnRGb3JJdGVtOiAoaXRlbSkgPT4ge1xuICAgICAgICBjb25zdCBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJylcbiAgICAgICAgbGkudGV4dENvbnRlbnQgPSBpdGVtXG4gICAgICAgIHJldHVybiBsaVxuICAgICAgfSxcbiAgICAgIGRpZENvbmZpcm1TZWxlY3Rpb246IChpdGVtKSA9PiB7XG4gICAgICAgIHRoaXMucHJvY2VzcyhpdGVtKS5jYXRjaChlID0+IGNvbnNvbGUuZXJyb3IoJ1tMaW50ZXJdIFVuYWJsZSB0byBwcm9jZXNzIHRvZ2dsZTonLCBlKSkudGhlbigoKSA9PiB0aGlzLmRpc3Bvc2UoKSlcbiAgICAgIH0sXG4gICAgICBkaWRDYW5jZWxTZWxlY3Rpb246ICgpID0+IHtcbiAgICAgICAgdGhpcy5kaXNwb3NlKClcbiAgICAgIH0sXG4gICAgfSlcbiAgICBjb25zdCBwYW5lbCA9IGF0b20ud29ya3NwYWNlLmFkZE1vZGFsUGFuZWwoeyBpdGVtOiBzZWxlY3RMaXN0VmlldyB9KVxuXG4gICAgc2VsZWN0TGlzdFZpZXcuZm9jdXMoKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQobmV3IERpc3Bvc2FibGUoZnVuY3Rpb24oKSB7XG4gICAgICBwYW5lbC5kZXN0cm95KClcbiAgICB9KSlcbiAgfVxuICBvbkRpZERpc3Bvc2UoY2FsbGJhY2s6ICgoKSA9PiBhbnkpKTogRGlzcG9zYWJsZSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLWRpc3Bvc2UnLCBjYWxsYmFjaylcbiAgfVxuICBvbkRpZERpc2FibGUoY2FsbGJhY2s6ICgobmFtZTogc3RyaW5nKSA9PiBhbnkpKTogRGlzcG9zYWJsZSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLWRpc2FibGUnLCBjYWxsYmFjaylcbiAgfVxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtZGlzcG9zZScpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICB9XG59XG4iXX0=