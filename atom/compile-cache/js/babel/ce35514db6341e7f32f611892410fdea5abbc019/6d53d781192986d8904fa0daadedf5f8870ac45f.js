Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _humanizeTime = require('humanize-time');

var _humanizeTime2 = _interopRequireDefault(_humanizeTime);

var _atom = require('atom');

var _provider = require('./provider');

var _provider2 = _interopRequireDefault(_provider);

var Registry = (function () {
  function Registry() {
    var _this = this;

    _classCallCheck(this, Registry);

    this.emitter = new _atom.Emitter();
    this.providers = new Set();
    this.itemsActive = [];
    this.itemsHistory = [];
    this.subscriptions = new _atom.CompositeDisposable();

    this.subscriptions.add(this.emitter);
    this.subscriptions.add(atom.config.observe('busy-signal.itemsToShowInHistory', function (itemsToShowInHistory) {
      var previousValue = _this.itemsToShowInHistory;
      _this.itemsToShowInHistory = parseInt(itemsToShowInHistory, 10);
      if (typeof previousValue === 'number') {
        _this.emitter.emit('did-update');
      }
    }));
  }

  // Public method

  _createClass(Registry, [{
    key: 'create',
    value: function create() {
      var _this2 = this;

      var provider = new _provider2['default']();
      provider.onDidAdd(function (status) {
        _this2.statusAdd(provider, status);
      });
      provider.onDidRemove(function (title) {
        _this2.statusRemove(provider, title);
      });
      provider.onDidClear(function () {
        _this2.statusClear(provider);
      });
      provider.onDidDispose(function () {
        _this2.statusClear(provider);
        _this2.providers['delete'](provider);
      });
      this.providers.add(provider);
      return provider;
    }
  }, {
    key: 'statusAdd',
    value: function statusAdd(provider, status) {
      for (var i = 0; i < this.itemsActive.length; i++) {
        var entry = this.itemsActive[i];
        if (entry.title === status.title && entry.provider === provider) {
          // Item already exists, ignore
          break;
        }
      }

      this.itemsActive.push({
        title: status.title,
        priority: status.priority,
        provider: provider,
        timeAdded: Date.now(),
        timeRemoved: null
      });
      this.emitter.emit('did-update');
    }
  }, {
    key: 'statusRemove',
    value: function statusRemove(provider, title) {
      for (var i = 0; i < this.itemsActive.length; i++) {
        var entry = this.itemsActive[i];
        if (entry.provider === provider && entry.title === title) {
          this.pushIntoHistory(i, entry);
          this.emitter.emit('did-update');
          break;
        }
      }
    }
  }, {
    key: 'statusClear',
    value: function statusClear(provider) {
      var triggerUpdate = false;
      for (var i = 0; i < this.itemsActive.length; i++) {
        var entry = this.itemsActive[i];
        if (entry.provider === provider) {
          this.pushIntoHistory(i, entry);
          triggerUpdate = true;
          i--;
        }
      }
      if (triggerUpdate) {
        this.emitter.emit('did-update');
      }
    }
  }, {
    key: 'pushIntoHistory',
    value: function pushIntoHistory(index, item) {
      item.timeRemoved = Date.now();
      this.itemsActive.splice(index, 1);
      this.itemsHistory = this.itemsHistory.concat([item]).slice(-1000);
    }
  }, {
    key: 'getActiveTitles',
    value: function getActiveTitles() {
      return this.itemsActive.slice().sort(function (a, b) {
        return a.priority - b.priority;
      }).map(function (i) {
        return i.title;
      });
    }
  }, {
    key: 'getOldTitles',
    value: function getOldTitles() {
      var toReturn = [];
      var history = this.itemsHistory;
      var activeTitles = this.getActiveTitles();
      var mergedTogether = history.map(function (i) {
        return i.title;
      }).concat(activeTitles);

      for (var i = 0, _length = history.length; i < _length; i++) {
        var item = history[i];
        if (mergedTogether.lastIndexOf(item.title) === i) {
          toReturn.push({
            title: item.title,
            duration: (0, _humanizeTime2['default'])(item.timeRemoved && item.timeRemoved - item.timeAdded)
          });
        }
      }

      return toReturn.slice(-1 * this.itemsToShowInHistory);
    }
  }, {
    key: 'onDidUpdate',
    value: function onDidUpdate(callback) {
      return this.emitter.on('did-update', callback);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
      for (var provider of this.providers) {
        provider.dispose();
      }
    }
  }]);

  return Registry;
})();

exports['default'] = Registry;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9idXN5LXNpZ25hbC9saWIvcmVnaXN0cnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs0QkFFeUIsZUFBZTs7OztvQkFDSyxNQUFNOzt3QkFHOUIsWUFBWTs7OztJQUdaLFFBQVE7QUFRaEIsV0FSUSxRQUFRLEdBUWI7OzswQkFSSyxRQUFROztBQVN6QixRQUFJLENBQUMsT0FBTyxHQUFHLG1CQUFhLENBQUE7QUFDNUIsUUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBO0FBQzFCLFFBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFBO0FBQ3JCLFFBQUksQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFBO0FBQ3RCLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7O0FBRTlDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUNwQyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxrQ0FBa0MsRUFBRSxVQUFDLG9CQUFvQixFQUFLO0FBQ3ZHLFVBQU0sYUFBYSxHQUFHLE1BQUssb0JBQW9CLENBQUE7QUFDL0MsWUFBSyxvQkFBb0IsR0FBRyxRQUFRLENBQUMsb0JBQW9CLEVBQUUsRUFBRSxDQUFDLENBQUE7QUFDOUQsVUFBSSxPQUFPLGFBQWEsS0FBSyxRQUFRLEVBQUU7QUFDckMsY0FBSyxPQUFPLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFBO09BQ2hDO0tBQ0YsQ0FBQyxDQUFDLENBQUE7R0FDSjs7OztlQXZCa0IsUUFBUTs7V0F5QnJCLGtCQUFhOzs7QUFDakIsVUFBTSxRQUFRLEdBQUcsMkJBQWMsQ0FBQTtBQUMvQixjQUFRLENBQUMsUUFBUSxDQUFDLFVBQUMsTUFBTSxFQUFLO0FBQzVCLGVBQUssU0FBUyxDQUFDLFFBQVEsRUFBRSxNQUFN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RUFBRTtBQUNoRCxrQkFBUSxDQUFDLElBQUksQ0FBQztBQUNaLGlCQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUs7QUFDakIsb0JBQVEsRUFBRSwrQkFBYSxJQUFJLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztXQUM5RSxDQUFDLENBQUE7U0FDSDtPQUNGOztBQUVELGFBQU8sUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQTtLQUN0RDs7O1dBQ1UscUJBQUMsUUFBa0IsRUFBYztBQUMxQyxhQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxRQUFRLENBQUMsQ0FBQTtLQUMvQzs7O1dBQ00sbUJBQUc7QUFDUixVQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQzVCLFdBQUssSUFBTSxRQUFRLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtBQUNyQyxnQkFBUSxDQUFDLE9BQU8sRUFBRSxDQUFBO09BQ25CO0tBQ0Y7OztTQXpIa0IsUUFBUTs7O3FCQUFSLFFBQVEiLCJmaWxlIjoiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2J1c3ktc2lnbmFsL2xpYi9yZWdpc3RyeS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCBodW1hbml6ZVRpbWUgZnJvbSAnaHVtYW5pemUtdGltZSdcbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUsIEVtaXR0ZXIgfSBmcm9tICdhdG9tJ1xuaW1wb3J0IHR5cGUgeyBEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcblxuaW1wb3J0IFByb3ZpZGVyIGZyb20gJy4vcHJvdmlkZXInXG5pbXBvcnQgdHlwZSB7IFNpZ25hbCB9IGZyb20gJy4vdHlwZXMnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlZ2lzdHJ5IHtcbiAgZW1pdHRlcjogRW1pdHRlclxuICBwcm92aWRlcnM6IFNldDxQcm92aWRlcj5cbiAgaXRlbXNBY3RpdmU6IEFycmF5PFNpZ25hbD5cbiAgaXRlbXNIaXN0b3J5OiBBcnJheTxTaWduYWw+XG4gIHN1YnNjcmlwdGlvbnM6IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgaXRlbXNUb1Nob3dJbkhpc3Rvcnk6IG51bWJlclxuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKClcbiAgICB0aGlzLnByb3ZpZGVycyA9IG5ldyBTZXQoKVxuICAgIHRoaXMuaXRlbXNBY3RpdmUgPSBbXVxuICAgIHRoaXMuaXRlbXNIaXN0b3J5ID0gW11cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuZW1pdHRlcilcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2J1c3ktc2lnbmFsLml0ZW1zVG9TaG93SW5IaXN0b3J5JywgKGl0ZW1zVG9TaG93SW5IaXN0b3J5KSA9PiB7XG4gICAgICBjb25zdCBwcmV2aW91c1ZhbHVlID0gdGhpcy5pdGVtc1RvU2hvd0luSGlzdG9yeVxuICAgICAgdGhpcy5pdGVtc1RvU2hvd0luSGlzdG9yeSA9IHBhcnNlSW50KGl0ZW1zVG9TaG93SW5IaXN0b3J5LCAxMClcbiAgICAgIGlmICh0eXBlb2YgcHJldmlvdXNWYWx1ZSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC11cGRhdGUnKVxuICAgICAgfVxuICAgIH0pKVxuICB9XG4gIC8vIFB1YmxpYyBtZXRob2RcbiAgY3JlYXRlKCk6IFByb3ZpZGVyIHtcbiAgICBjb25zdCBwcm92aWRlciA9IG5ldyBQcm92aWRlcigpXG4gICAgcHJvdmlkZXIub25EaWRBZGQoKHN0YXR1cykgPT4ge1xuICAgICAgdGhpcy5zdGF0dXNBZGQocHJvdmlkZXIsIHN0YXR1cylcbiAgICB9KVxuICAgIHByb3ZpZGVyLm9uRGlkUmVtb3ZlKCh0aXRsZSkgPT4ge1xuICAgICAgdGhpcy5zdGF0dXNSZW1vdmUocHJvdmlkZXIsIHRpdGxlKVxuICAgIH0pXG4gICAgcHJvdmlkZXIub25EaWRDbGVhcigoKSA9PiB7XG4gICAgICB0aGlzLnN0YXR1c0NsZWFyKHByb3ZpZGVyKVxuICAgIH0pXG4gICAgcHJvdmlkZXIub25EaWREaXNwb3NlKCgpID0+IHtcbiAgICAgIHRoaXMuc3RhdHVzQ2xlYXIocHJvdmlkZXIpXG4gICAgICB0aGlzLnByb3ZpZGVycy5kZWxldGUocHJvdmlkZXIpXG4gICAgfSlcbiAgICB0aGlzLnByb3ZpZGVycy5hZGQocHJvdmlkZXIpXG4gICAgcmV0dXJuIHByb3ZpZGVyXG4gIH1cbiAgc3RhdHVzQWRkKHByb3ZpZGVyOiBQcm92aWRlciwgc3RhdHVzOiB7IHRpdGxlOiBzdHJpbmcsIHByaW9yaXR5OiBudW1iZXIgfSk6IHZvaWQge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5pdGVtc0FjdGl2ZS5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgZW50cnkgPSB0aGlzLml0ZW1zQWN0aXZlW2ldXG4gICAgICBpZiAoZW50cnkudGl0bGUgPT09IHN0YXR1cy50aXRsZSAmJiBlbnRyeS5wcm92aWRlciA9PT0gcHJvdmlkZXIpIHtcbiAgICAgICAgLy8gSXRlbSBhbHJlYWR5IGV4aXN0cywgaWdub3JlXG4gICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5pdGVtc0FjdGl2ZS5wdXNoKHtcbiAgICAgIHRpdGxlOiBzdGF0dXMudGl0bGUsXG4gICAgICBwcmlvcml0eTogc3RhdHVzLnByaW9yaXR5LFxuICAgICAgcHJvdmlkZXIsXG4gICAgICB0aW1lQWRkZWQ6IERhdGUubm93KCksXG4gICAgICB0aW1lUmVtb3ZlZDogbnVsbCxcbiAgICB9KVxuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtdXBkYXRlJylcbiAgfVxuICBzdGF0dXNSZW1vdmUocHJvdmlkZXI6IFByb3ZpZGVyLCB0aXRsZTogc3RyaW5nKTogdm9pZCB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLml0ZW1zQWN0aXZlLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBlbnRyeSA9IHRoaXMuaXRlbXNBY3RpdmVbaV1cbiAgICAgIGlmIChlbnRyeS5wcm92aWRlciA9PT0gcHJvdmlkZXIgJiYgZW50cnkudGl0bGUgPT09IHRpdGxlKSB7XG4gICAgICAgIHRoaXMucHVzaEludG9IaXN0b3J5KGksIGVudHJ5KVxuICAgICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLXVwZGF0ZScpXG4gICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgfVxuICB9XG4gIHN0YXR1c0NsZWFyKHByb3ZpZGVyOiBQcm92aWRlcik6IHZvaWQge1xuICAgIGxldCB0cmlnZ2VyVXBkYXRlID0gZmFsc2VcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaXRlbXNBY3RpdmUubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGVudHJ5ID0gdGhpcy5pdGVtc0FjdGl2ZVtpXVxuICAgICAgaWYgKGVudHJ5LnByb3ZpZGVyID09PSBwcm92aWRlcikge1xuICAgICAgICB0aGlzLnB1c2hJbnRvSGlzdG9yeShpLCBlbnRyeSlcbiAgICAgICAgdHJpZ2dlclVwZGF0ZSA9IHRydWVcbiAgICAgICAgaS0tXG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0cmlnZ2VyVXBkYXRlKSB7XG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLXVwZGF0ZScpXG4gICAgfVxuICB9XG4gIHB1c2hJbnRvSGlzdG9yeShpbmRleDogbnVtYmVyLCBpdGVtOiBTaWduYWwpOiB2b2lkIHtcbiAgICBpdGVtLnRpbWVSZW1vdmVkID0gRGF0ZS5ub3coKVxuICAgIHRoaXMuaXRlbXNBY3RpdmUuc3BsaWNlKGluZGV4LCAxKVxuICAgIHRoaXMuaXRlbXNIaXN0b3J5ID0gdGhpcy5pdGVtc0hpc3RvcnkuY29uY2F0KFtpdGVtXSkuc2xpY2UoLTEwMDApXG4gIH1cbiAgZ2V0QWN0aXZlVGl0bGVzKCk6IEFycmF5PHN0cmluZz4ge1xuICAgIHJldHVybiB0aGlzLml0ZW1zQWN0aXZlLnNsaWNlKCkuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgICByZXR1cm4gYS5wcmlvcml0eSAtIGIucHJpb3JpdHlcbiAgICB9KS5tYXAoaSA9PiBpLnRpdGxlKVxuICB9XG4gIGdldE9sZFRpdGxlcygpOiBBcnJheTx7IHRpdGxlOiBzdHJpbmcsIGR1cmF0aW9uOiBzdHJpbmcgfT4ge1xuICAgIGNvbnN0IHRvUmV0dXJuID0gW11cbiAgICBjb25zdCBoaXN0b3J5ID0gdGhpcy5pdGVtc0hpc3RvcnlcbiAgICBjb25zdCBhY3RpdmVUaXRsZXMgPSB0aGlzLmdldEFjdGl2ZVRpdGxlcygpXG4gICAgY29uc3QgbWVyZ2VkVG9nZXRoZXIgPSBoaXN0b3J5Lm1hcChpID0+IGkudGl0bGUpLmNvbmNhdChhY3RpdmVUaXRsZXMpXG5cbiAgICBmb3IgKGxldCBpID0gMCwgbGVuZ3RoID0gaGlzdG9yeS5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgaXRlbSA9IGhpc3RvcnlbaV1cbiAgICAgIGlmIChtZXJnZWRUb2dldGhlci5sYXN0SW5kZXhPZihpdGVtLnRpdGxlKSA9PT0gaSkge1xuICAgICAgICB0b1JldHVybi5wdXNoKHtcbiAgICAgICAgICB0aXRsZTogaXRlbS50aXRsZSxcbiAgICAgICAgICBkdXJhdGlvbjogaHVtYW5pemVUaW1lKGl0ZW0udGltZVJlbW92ZWQgJiYgaXRlbS50aW1lUmVtb3ZlZCAtIGl0ZW0udGltZUFkZGVkKSxcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdG9SZXR1cm4uc2xpY2UoLTEgKiB0aGlzLml0ZW1zVG9TaG93SW5IaXN0b3J5KVxuICB9XG4gIG9uRGlkVXBkYXRlKGNhbGxiYWNrOiBGdW5jdGlvbik6IERpc3Bvc2FibGUge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC11cGRhdGUnLCBjYWxsYmFjaylcbiAgfVxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICBmb3IgKGNvbnN0IHByb3ZpZGVyIG9mIHRoaXMucHJvdmlkZXJzKSB7XG4gICAgICBwcm92aWRlci5kaXNwb3NlKClcbiAgICB9XG4gIH1cbn1cbiJdfQ==