var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var BusySignal = (function () {
  function BusySignal() {
    var _this = this;

    _classCallCheck(this, BusySignal);

    this.executing = new Set();
    this.subscriptions = new _atom.CompositeDisposable();

    this.subscriptions.add(atom.config.observe('linter-ui-default.useBusySignal', function (useBusySignal) {
      _this.useBusySignal = useBusySignal;
    }));
  }

  _createClass(BusySignal, [{
    key: 'attach',
    value: function attach(registry) {
      this.provider = registry.create();
      this.update();
    }
  }, {
    key: 'update',
    value: function update() {
      var provider = this.provider;
      if (!provider) return;
      provider.clear();
      if (!this.useBusySignal) return;
      var fileMap = new Map();

      for (var _ref2 of this.executing) {
        var _filePath = _ref2.filePath;
        var _linter = _ref2.linter;

        var names = fileMap.get(_filePath);
        if (!names) {
          fileMap.set(_filePath, names = []);
        }
        names.push(_linter.name);
      }

      for (var _ref33 of fileMap) {
        var _ref32 = _slicedToArray(_ref33, 2);

        var _filePath2 = _ref32[0];
        var names = _ref32[1];

        var path = _filePath2 ? ' on ' + atom.project.relativizePath(_filePath2)[1] : '';
        provider.add('' + names.join(', ') + path);
      }
      fileMap.clear();
    }
  }, {
    key: 'getExecuting',
    value: function getExecuting(linter, filePath) {
      for (var entry of this.executing) {
        if (entry.linter === linter && entry.filePath === filePath) {
          return entry;
        }
      }
      return null;
    }
  }, {
    key: 'didBeginLinting',
    value: function didBeginLinting(linter, filePath) {
      if (this.getExecuting(linter, filePath)) {
        return;
      }
      this.executing.add({ linter: linter, filePath: filePath });
      this.update();
    }
  }, {
    key: 'didFinishLinting',
    value: function didFinishLinting(linter, filePath) {
      var entry = this.getExecuting(linter, filePath);
      if (entry) {
        this.executing['delete'](entry);
        this.update();
      }
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      if (this.provider) {
        this.provider.clear();
      }
      this.executing.clear();
      this.subscriptions.dispose();
    }
  }]);

  return BusySignal;
})();

module.exports = BusySignal;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvYnVzeS1zaWduYWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O29CQUVvQyxNQUFNOztJQUdwQyxVQUFVO0FBU0gsV0FUUCxVQUFVLEdBU0E7OzswQkFUVixVQUFVOztBQVVaLFFBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTtBQUMxQixRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFBOztBQUU5QyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxpQ0FBaUMsRUFBRSxVQUFDLGFBQWEsRUFBSztBQUMvRixZQUFLLGFBQWEsR0FBRyxhQUFhLENBQUE7S0FDbkMsQ0FBQyxDQUFDLENBQUE7R0FDSjs7ZUFoQkcsVUFBVTs7V0FpQlIsZ0JBQUMsUUFBZ0IsRUFBRTtBQUN2QixVQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQTtBQUNqQyxVQUFJLENBQUMsTUFBTSxFQUFFLENBQUE7S0FDZDs7O1dBQ0ssa0JBQUc7QUFDUCxVQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFBO0FBQzlCLFVBQUksQ0FBQyxRQUFRLEVBQUUsT0FBTTtBQUNyQixjQUFRLENBQUMsS0FBSyxFQUFFLENBQUE7QUFDaEIsVUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsT0FBTTtBQUMvQixVQUFNLE9BQW9DLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTs7QUFFdEQsd0JBQW1DLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFBdEMsU0FBUSxTQUFSLFFBQVE7WUFBRSxPQUFNLFNBQU4sTUFBTTs7QUFDM0IsWUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFRLENBQUMsQ0FBQTtBQUNqQyxZQUFJLENBQUMsS0FBSyxFQUFFO0FBQ1YsaUJBQU8sQ0FBQyxHQUFHLENBQUMsU0FBUSxFQUFFLEtBQUssR0FBRyxFQUFFLENBQUMsQ0FBQTtTQUNsQztBQUNELGFBQUssQ0FBQyxJQUFJLENBQUMsT0FBTSxDQUFDLElBQUksQ0FBQyxDQUFBO09BQ3hCOztBQUVELHlCQUFnQyxPQUFPLEVBQUU7OztZQUE3QixVQUFRO1lBQUUsS0FBSzs7QUFDekIsWUFBTSxJQUFJLEdBQUcsVUFBUSxZQUFVLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLFVBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFLLEVBQUUsQ0FBQTtBQUM5RSxnQkFBUSxDQUFDLEdBQUcsTUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBRyxDQUFBO09BQzNDO0FBQ0QsYUFBTyxDQUFDLEtBQUssRUFBRSxDQUFBO0tBQ2hCOzs7V0FDVyxzQkFBQyxNQUFjLEVBQUUsUUFBaUIsRUFBVztBQUN2RCxXQUFLLElBQU0sS0FBSyxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7QUFDbEMsWUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLE1BQU0sSUFBSSxLQUFLLENBQUMsUUFBUSxLQUFLLFFBQVEsRUFBRTtBQUMxRCxpQkFBTyxLQUFLLENBQUE7U0FDYjtPQUNGO0FBQ0QsYUFBTyxJQUFJLENBQUE7S0FDWjs7O1dBQ2MseUJBQUMsTUFBYyxFQUFFLFFBQWlCLEVBQUU7QUFDakQsVUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsRUFBRTtBQUN2QyxlQUFNO09BQ1A7QUFDRCxVQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUFFLE1BQU0sRUFBTixNQUFNLEVBQUUsUUFBUSxFQUFSLFFBQVEsRUFBRSxDQUFDLENBQUE7QUFDeEMsVUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFBO0tBQ2Q7OztXQUNlLDBCQUFDLE1BQWMsRUFBRSxRQUFpQixFQUFFO0FBQ2xELFVBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFBO0FBQ2pELFVBQUksS0FBSyxFQUFFO0FBQ1QsWUFBSSxDQUFDLFNBQVMsVUFBTyxDQUFDLEtBQUssQ0FBQyxDQUFBO0FBQzVCLFlBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQTtPQUNkO0tBQ0Y7OztXQUNNLG1CQUFHO0FBQ1IsVUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO0FBQ2pCLFlBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUE7T0FDdEI7QUFDRCxVQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFBO0FBQ3RCLFVBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUE7S0FDN0I7OztTQXRFRyxVQUFVOzs7QUF5RWhCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBVSxDQUFBIiwiZmlsZSI6Ii9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvYnVzeS1zaWduYWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcbmltcG9ydCB0eXBlIHsgTGludGVyIH0gZnJvbSAnLi90eXBlcydcblxuY2xhc3MgQnVzeVNpZ25hbCB7XG4gIHByb3ZpZGVyOiA/T2JqZWN0O1xuICBleGVjdXRpbmc6IFNldDx7XG4gICAgbGludGVyOiBMaW50ZXIsXG4gICAgZmlsZVBhdGg6ID9zdHJpbmcsXG4gIH0+O1xuICB1c2VCdXN5U2lnbmFsOiBib29sZWFuO1xuICBzdWJzY3JpcHRpb25zOiBDb21wb3NpdGVEaXNwb3NhYmxlO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuZXhlY3V0aW5nID0gbmV3IFNldCgpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItdWktZGVmYXVsdC51c2VCdXN5U2lnbmFsJywgKHVzZUJ1c3lTaWduYWwpID0+IHtcbiAgICAgIHRoaXMudXNlQnVzeVNpZ25hbCA9IHVzZUJ1c3lTaWduYWxcbiAgICB9KSlcbiAgfVxuICBhdHRhY2gocmVnaXN0cnk6IE9iamVjdCkge1xuICAgIHRoaXMucHJvdmlkZXIgPSByZWdpc3RyeS5jcmVhdGUoKVxuICAgIHRoaXMudXBkYXRlKClcbiAgfVxuICB1cGRhdGUoKSB7XG4gICAgY29uc3QgcHJvdmlkZXIgPSB0aGlzLnByb3ZpZGVyXG4gICAgaWYgKCFwcm92aWRlcikgcmV0dXJuXG4gICAgcHJvdmlkZXIuY2xlYXIoKVxuICAgIGlmICghdGhpcy51c2VCdXN5U2lnbmFsKSByZXR1cm5cbiAgICBjb25zdCBmaWxlTWFwOiBNYXA8P3N0cmluZywgQXJyYXk8c3RyaW5nPj4gPSBuZXcgTWFwKClcblxuICAgIGZvciAoY29uc3QgeyBmaWxlUGF0aCwgbGludGVyIH0gb2YgdGhpcy5leGVjdXRpbmcpIHtcbiAgICAgIGxldCBuYW1lcyA9IGZpbGVNYXAuZ2V0KGZpbGVQYXRoKVxuICAgICAgaWYgKCFuYW1lcykge1xuICAgICAgICBmaWxlTWFwLnNldChmaWxlUGF0aCwgbmFtZXMgPSBbXSlcbiAgICAgIH1cbiAgICAgIG5hbWVzLnB1c2gobGludGVyLm5hbWUpXG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBbZmlsZVBhdGgsIG5hbWVzXSBvZiBmaWxlTWFwKSB7XG4gICAgICBjb25zdCBwYXRoID0gZmlsZVBhdGggPyBgIG9uICR7YXRvbS5wcm9qZWN0LnJlbGF0aXZpemVQYXRoKGZpbGVQYXRoKVsxXX1gIDogJydcbiAgICAgIHByb3ZpZGVyLmFkZChgJHtuYW1lcy5qb2luKCcsICcpfSR7cGF0aH1gKVxuICAgIH1cbiAgICBmaWxlTWFwLmNsZWFyKClcbiAgfVxuICBnZXRFeGVjdXRpbmcobGludGVyOiBMaW50ZXIsIGZpbGVQYXRoOiA/c3RyaW5nKTogP09iamVjdCB7XG4gICAgZm9yIChjb25zdCBlbnRyeSBvZiB0aGlzLmV4ZWN1dGluZykge1xuICAgICAgaWYgKGVudHJ5LmxpbnRlciA9PT0gbGludGVyICYmIGVudHJ5LmZpbGVQYXRoID09PSBmaWxlUGF0aCkge1xuICAgICAgICByZXR1cm4gZW50cnlcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGxcbiAgfVxuICBkaWRCZWdpbkxpbnRpbmcobGludGVyOiBMaW50ZXIsIGZpbGVQYXRoOiA/c3RyaW5nKSB7XG4gICAgaWYgKHRoaXMuZ2V0RXhlY3V0aW5nKGxpbnRlciwgZmlsZVBhdGgpKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgdGhpcy5leGVjdXRpbmcuYWRkKHsgbGludGVyLCBmaWxlUGF0aCB9KVxuICAgIHRoaXMudXBkYXRlKClcbiAgfVxuICBkaWRGaW5pc2hMaW50aW5nKGxpbnRlcjogTGludGVyLCBmaWxlUGF0aDogP3N0cmluZykge1xuICAgIGNvbnN0IGVudHJ5ID0gdGhpcy5nZXRFeGVjdXRpbmcobGludGVyLCBmaWxlUGF0aClcbiAgICBpZiAoZW50cnkpIHtcbiAgICAgIHRoaXMuZXhlY3V0aW5nLmRlbGV0ZShlbnRyeSlcbiAgICAgIHRoaXMudXBkYXRlKClcbiAgICB9XG4gIH1cbiAgZGlzcG9zZSgpIHtcbiAgICBpZiAodGhpcy5wcm92aWRlcikge1xuICAgICAgdGhpcy5wcm92aWRlci5jbGVhcigpXG4gICAgfVxuICAgIHRoaXMuZXhlY3V0aW5nLmNsZWFyKClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBCdXN5U2lnbmFsXG4iXX0=