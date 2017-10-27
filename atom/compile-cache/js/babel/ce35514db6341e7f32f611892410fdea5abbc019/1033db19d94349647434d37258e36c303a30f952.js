Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _ms = require('ms');

var _ms2 = _interopRequireDefault(_ms);

var _atom = require('atom');

var _provider = require('./provider');

var _provider2 = _interopRequireDefault(_provider);

var Registry = (function () {
  function Registry() {
    _classCallCheck(this, Registry);

    this.emitter = new _atom.Emitter();
    this.providers = new Set();
    this.subscriptions = new _atom.CompositeDisposable();
    this.subscriptions.add(this.emitter);

    this.statuses = new Map();
    this.statusHistory = [];
  }

  // Public method

  _createClass(Registry, [{
    key: 'create',
    value: function create() {
      var _this = this;

      var provider = new _provider2['default']();
      provider.onDidAdd(function (status) {
        _this.statusAdd(provider, status);
      });
      provider.onDidRemove(function (title) {
        _this.statusRemove(provider, title);
      });
      provider.onDidClear(function () {
        _this.statusClear(provider);
      });
      provider.onDidDispose(function () {
        _this.statusClear(provider);
        _this.providers['delete'](provider);
      });
      this.providers.add(provider);
      return provider;
    }
  }, {
    key: 'statusAdd',
    value: function statusAdd(provider, title) {
      var key = provider.id + '::' + title;
      if (this.statuses.has(key)) {
        // This will help catch bugs in providers
        throw new Error('Status \'' + title + '\' is already set');
      }

      var entry = {
        key: key,
        title: title,
        provider: provider,
        timeStarted: Date.now(),
        timeStopped: null
      };
      this.statuses.set(entry.key, entry);
      this.emitter.emit('did-update');
    }
  }, {
    key: 'statusRemove',
    value: function statusRemove(provider, title) {
      var key = provider.id + '::' + title;
      var value = this.statuses.get(key);
      if (value) {
        this.pushIntoHistory(value);
        this.statuses['delete'](key);
        this.emitter.emit('did-update');
      }
    }
  }, {
    key: 'statusClear',
    value: function statusClear(provider) {
      var _this2 = this;

      var triggerUpdate = false;
      this.statuses.forEach(function (value) {
        if (value.provider === provider) {
          triggerUpdate = true;
          _this2.pushIntoHistory(value);
          _this2.statuses['delete'](value.key);
        }
      });
      if (triggerUpdate) {
        this.emitter.emit('did-update');
      }
    }
  }, {
    key: 'pushIntoHistory',
    value: function pushIntoHistory(status) {
      status.timeStopped = Date.now();
      var i = this.statusHistory.length;
      while (i--) {
        if (this.statusHistory[i].key === status.key) {
          this.statusHistory.splice(i, 1);
          break;
        }
      }
      this.statusHistory.push(status);
      this.statusHistory = this.statusHistory.slice(-10);
    }
  }, {
    key: 'getTilesActive',
    value: function getTilesActive() {
      return Array.from(this.statuses.values()).sort(function (a, b) {
        return b.timeStarted - a.timeStarted;
      }).map(function (a) {
        return a.title;
      });
    }
  }, {
    key: 'getTilesOld',
    value: function getTilesOld() {
      var _this3 = this;

      var oldTiles = [];

      this.statusHistory.forEach(function (entry) {
        if (_this3.statuses.has(entry.key)) return;
        oldTiles.push({
          title: entry.title,
          duration: (0, _ms2['default'])((entry.timeStopped || 0) - entry.timeStarted)
        });
      });

      return oldTiles;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9idXN5LXNpZ25hbC9saWIvcmVnaXN0cnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztrQkFFZSxJQUFJOzs7O29CQUMwQixNQUFNOzt3QkFHOUIsWUFBWTs7OztJQUdaLFFBQVE7QUFRaEIsV0FSUSxRQUFRLEdBUWI7MEJBUkssUUFBUTs7QUFTekIsUUFBSSxDQUFDLE9BQU8sR0FBRyxtQkFBYSxDQUFBO0FBQzVCLFFBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTtBQUMxQixRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFBO0FBQzlDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTs7QUFFcEMsUUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBO0FBQ3pCLFFBQUksQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFBO0dBQ3hCOzs7O2VBaEJrQixRQUFROztXQWtCckIsa0JBQWE7OztBQUNqQixVQUFNLFFBQVEsR0FBRywyQkFBYyxDQUFBO0FBQy9CLGNBQVEsQ0FBQyxRQUFRLENBQUMsVUFBQyxNQUFNLEVBQUs7QUFDNUIsY0FBSyxTQUFTLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFBO09BQ2pDLENBQUMsQ0FBQTtBQUNGLGNBQVEsQ0FBQyxXQUFXLENBQUMsVUFBQyxLQUFLLEVBQUs7QUFDOUIsY0FBSyxZQUFZLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFBO09BQ25DLENBQUMsQ0FBQTtBQUNGLGNBQVEsQ0FBQyxVQUFVLENBQUMsWUFBTTtBQUN4QixjQUFLLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQTtPQUMzQixDQUFDLENBQUE7QUFDRixjQUFRLENBQUMsWUFBWSxDQUFDLFlBQU07QUFDMUIsY0FBSyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUE7QUFDMUIsY0FBSyxTQUFT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QUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLENBQUMsRUFBRSxDQUFDO2VBQUssQ0FBQyxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsV0FBVztPQUFBLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDO2VBQUksQ0FBQyxDQUFDLEtBQUs7T0FBQSxDQUFDLENBQUE7S0FDMUc7OztXQUNVLHVCQUErQzs7O0FBQ3hELFVBQU0sUUFBUSxHQUFHLEVBQUUsQ0FBQTs7QUFFbkIsVUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFLLEVBQUs7QUFDcEMsWUFBSSxPQUFLLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLE9BQU07QUFDeEMsZ0JBQVEsQ0FBQyxJQUFJLENBQUM7QUFDWixlQUFLLEVBQUUsS0FBSyxDQUFDLEtBQUs7QUFDbEIsa0JBQVEsRUFBRSxxQkFBRyxDQUFDLEtBQUssQ0FBQyxXQUFXLElBQUksQ0FBQyxDQUFBLEdBQUksS0FBSyxDQUFDLFdBQVcsQ0FBQztTQUMzRCxDQUFDLENBQUE7T0FDSCxDQUFDLENBQUE7O0FBRUYsYUFBTyxRQUFRLENBQUE7S0FDaEI7OztXQUNVLHFCQUFDLFFBQWtCLEVBQWM7QUFDMUMsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsUUFBUSxDQUFDLENBQUE7S0FDL0M7OztXQUNNLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUM1QixXQUFLLElBQU0sUUFBUSxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7QUFDckMsZ0JBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtPQUNuQjtLQUNGOzs7U0EvR2tCLFFBQVE7OztxQkFBUixRQUFRIiwiZmlsZSI6Ii9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9idXN5LXNpZ25hbC9saWIvcmVnaXN0cnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgbXMgZnJvbSAnbXMnXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlLCBFbWl0dGVyIH0gZnJvbSAnYXRvbSdcbmltcG9ydCB0eXBlIHsgRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nXG5cbmltcG9ydCBQcm92aWRlciBmcm9tICcuL3Byb3ZpZGVyJ1xuaW1wb3J0IHR5cGUgeyBTaWduYWxJbnRlcm5hbCB9IGZyb20gJy4vdHlwZXMnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlZ2lzdHJ5IHtcbiAgZW1pdHRlcjogRW1pdHRlclxuICBwcm92aWRlcnM6IFNldDxQcm92aWRlcj5cbiAgc3Vic2NyaXB0aW9uczogQ29tcG9zaXRlRGlzcG9zYWJsZVxuXG4gIHN0YXR1c2VzOiBNYXA8c3RyaW5nLCBTaWduYWxJbnRlcm5hbD5cbiAgc3RhdHVzSGlzdG9yeTogQXJyYXk8U2lnbmFsSW50ZXJuYWw+XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXIoKVxuICAgIHRoaXMucHJvdmlkZXJzID0gbmV3IFNldCgpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5lbWl0dGVyKVxuXG4gICAgdGhpcy5zdGF0dXNlcyA9IG5ldyBNYXAoKVxuICAgIHRoaXMuc3RhdHVzSGlzdG9yeSA9IFtdXG4gIH1cbiAgLy8gUHVibGljIG1ldGhvZFxuICBjcmVhdGUoKTogUHJvdmlkZXIge1xuICAgIGNvbnN0IHByb3ZpZGVyID0gbmV3IFByb3ZpZGVyKClcbiAgICBwcm92aWRlci5vbkRpZEFkZCgoc3RhdHVzKSA9PiB7XG4gICAgICB0aGlzLnN0YXR1c0FkZChwcm92aWRlciwgc3RhdHVzKVxuICAgIH0pXG4gICAgcHJvdmlkZXIub25EaWRSZW1vdmUoKHRpdGxlKSA9PiB7XG4gICAgICB0aGlzLnN0YXR1c1JlbW92ZShwcm92aWRlciwgdGl0bGUpXG4gICAgfSlcbiAgICBwcm92aWRlci5vbkRpZENsZWFyKCgpID0+IHtcbiAgICAgIHRoaXMuc3RhdHVzQ2xlYXIocHJvdmlkZXIpXG4gICAgfSlcbiAgICBwcm92aWRlci5vbkRpZERpc3Bvc2UoKCkgPT4ge1xuICAgICAgdGhpcy5zdGF0dXNDbGVhcihwcm92aWRlcilcbiAgICAgIHRoaXMucHJvdmlkZXJzLmRlbGV0ZShwcm92aWRlcilcbiAgICB9KVxuICAgIHRoaXMucHJvdmlkZXJzLmFkZChwcm92aWRlcilcbiAgICByZXR1cm4gcHJvdmlkZXJcbiAgfVxuICBzdGF0dXNBZGQocHJvdmlkZXI6IFByb3ZpZGVyLCB0aXRsZTogc3RyaW5nKTogdm9pZCB7XG4gICAgY29uc3Qga2V5ID0gYCR7cHJvdmlkZXIuaWR9Ojoke3RpdGxlfWBcbiAgICBpZiAodGhpcy5zdGF0dXNlcy5oYXMoa2V5KSkge1xuICAgICAgLy8gVGhpcyB3aWxsIGhlbHAgY2F0Y2ggYnVncyBpbiBwcm92aWRlcnNcbiAgICAgIHRocm93IG5ldyBFcnJvcihgU3RhdHVzICcke3RpdGxlfScgaXMgYWxyZWFkeSBzZXRgKVxuICAgIH1cblxuICAgIGNvbnN0IGVudHJ5ID0ge1xuICAgICAga2V5LFxuICAgICAgdGl0bGUsXG4gICAgICBwcm92aWRlcixcbiAgICAgIHRpbWVTdGFydGVkOiBEYXRlLm5vdygpLFxuICAgICAgdGltZVN0b3BwZWQ6IG51bGwsXG4gICAgfVxuICAgIHRoaXMuc3RhdHVzZXMuc2V0KGVudHJ5LmtleSwgZW50cnkpXG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC11cGRhdGUnKVxuICB9XG4gIHN0YXR1c1JlbW92ZShwcm92aWRlcjogUHJvdmlkZXIsIHRpdGxlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBjb25zdCBrZXkgPSBgJHtwcm92aWRlci5pZH06OiR7dGl0bGV9YFxuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5zdGF0dXNlcy5nZXQoa2V5KVxuICAgIGlmICh2YWx1ZSkge1xuICAgICAgdGhpcy5wdXNoSW50b0hpc3RvcnkodmFsdWUpXG4gICAgICB0aGlzLnN0YXR1c2VzLmRlbGV0ZShrZXkpXG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLXVwZGF0ZScpXG4gICAgfVxuICB9XG4gIHN0YXR1c0NsZWFyKHByb3ZpZGVyOiBQcm92aWRlcik6IHZvaWQge1xuICAgIGxldCB0cmlnZ2VyVXBkYXRlID0gZmFsc2VcbiAgICB0aGlzLnN0YXR1c2VzLmZvckVhY2goKHZhbHVlKSA9PiB7XG4gICAgICBpZiAodmFsdWUucHJvdmlkZXIgPT09IHByb3ZpZGVyKSB7XG4gICAgICAgIHRyaWdnZXJVcGRhdGUgPSB0cnVlXG4gICAgICAgIHRoaXMucHVzaEludG9IaXN0b3J5KHZhbHVlKVxuICAgICAgICB0aGlzLnN0YXR1c2VzLmRlbGV0ZSh2YWx1ZS5rZXkpXG4gICAgICB9XG4gICAgfSlcbiAgICBpZiAodHJpZ2dlclVwZGF0ZSkge1xuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC11cGRhdGUnKVxuICAgIH1cbiAgfVxuICBwdXNoSW50b0hpc3Rvcnkoc3RhdHVzOiBTaWduYWxJbnRlcm5hbCk6IHZvaWQge1xuICAgIHN0YXR1cy50aW1lU3RvcHBlZCA9IERhdGUubm93KClcbiAgICBsZXQgaSA9IHRoaXMuc3RhdHVzSGlzdG9yeS5sZW5ndGhcbiAgICB3aGlsZSAoaS0tKSB7XG4gICAgICBpZiAodGhpcy5zdGF0dXNIaXN0b3J5W2ldLmtleSA9PT0gc3RhdHVzLmtleSkge1xuICAgICAgICB0aGlzLnN0YXR1c0hpc3Rvcnkuc3BsaWNlKGksIDEpXG4gICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuc3RhdHVzSGlzdG9yeS5wdXNoKHN0YXR1cylcbiAgICB0aGlzLnN0YXR1c0hpc3RvcnkgPSB0aGlzLnN0YXR1c0hpc3Rvcnkuc2xpY2UoLTEwKVxuICB9XG4gIGdldFRpbGVzQWN0aXZlKCk6IEFycmF5PHN0cmluZz4ge1xuICAgIHJldHVybiBBcnJheS5mcm9tKHRoaXMuc3RhdHVzZXMudmFsdWVzKCkpLnNvcnQoKGEsIGIpID0+IGIudGltZVN0YXJ0ZWQgLSBhLnRpbWVTdGFydGVkKS5tYXAoYSA9PiBhLnRpdGxlKVxuICB9XG4gIGdldFRpbGVzT2xkKCk6IEFycmF5PHsgdGl0bGU6IHN0cmluZywgZHVyYXRpb246IHN0cmluZyB9PiB7XG4gICAgY29uc3Qgb2xkVGlsZXMgPSBbXVxuXG4gICAgdGhpcy5zdGF0dXNIaXN0b3J5LmZvckVhY2goKGVudHJ5KSA9PiB7XG4gICAgICBpZiAodGhpcy5zdGF0dXNlcy5oYXMoZW50cnkua2V5KSkgcmV0dXJuXG4gICAgICBvbGRUaWxlcy5wdXNoKHtcbiAgICAgICAgdGl0bGU6IGVudHJ5LnRpdGxlLFxuICAgICAgICBkdXJhdGlvbjogbXMoKGVudHJ5LnRpbWVTdG9wcGVkIHx8IDApIC0gZW50cnkudGltZVN0YXJ0ZWQpLFxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgcmV0dXJuIG9sZFRpbGVzXG4gIH1cbiAgb25EaWRVcGRhdGUoY2FsbGJhY2s6IEZ1bmN0aW9uKTogRGlzcG9zYWJsZSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLXVwZGF0ZScsIGNhbGxiYWNrKVxuICB9XG4gIGRpc3Bvc2UoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgIGZvciAoY29uc3QgcHJvdmlkZXIgb2YgdGhpcy5wcm92aWRlcnMpIHtcbiAgICAgIHByb3ZpZGVyLmRpc3Bvc2UoKVxuICAgIH1cbiAgfVxufVxuIl19