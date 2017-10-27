var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var BusySignal = (function () {
  function BusySignal() {
    var _this = this;

    _classCallCheck(this, BusySignal);

    this.executing = new Set();
    this.providerTitles = new Set();
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
      var _this2 = this;

      var provider = this.provider;
      if (!provider) return;
      if (!this.useBusySignal) return;
      var fileMap = new Map();
      var currentTitles = new Set();

      for (var _ref2 of this.executing) {
        var _filePath = _ref2.filePath;
        var _linter = _ref2.linter;

        var names = fileMap.get(_filePath);
        if (!names) {
          fileMap.set(_filePath, names = []);
        }
        names.push(_linter.name);
      }

      var _loop = function (_ref3) {
        _ref32 = _slicedToArray(_ref3, 2);
        var filePath = _ref32[0];
        var names = _ref32[1];

        var path = filePath ? ' on ' + atom.project.relativizePath(filePath)[1] : '';
        names.forEach(function (name) {
          var title = '' + name + path;
          currentTitles.add(title);
          if (!_this2.providerTitles.has(title)) {
            // Add the title since it hasn't been seen before
            _this2.providerTitles.add(title);
            provider.add(title);
          }
        });
      };

      for (var _ref3 of fileMap) {
        var _ref32;

        _loop(_ref3);
      }

      // Remove any titles no longer active
      this.providerTitles.forEach(function (title) {
        if (!currentTitles.has(title)) {
          provider.remove(title);
          _this2.providerTitles['delete'](title);
        }
      });

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
      this.providerTitles.clear();
      this.executing.clear();
      this.subscriptions.dispose();
    }
  }]);

  return BusySignal;
})();

module.exports = BusySignal;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvYnVzeS1zaWduYWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O29CQUVvQyxNQUFNOztJQUdwQyxVQUFVO0FBVUgsV0FWUCxVQUFVLEdBVUE7OzswQkFWVixVQUFVOztBQVdaLFFBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTtBQUMxQixRQUFJLENBQUMsY0FBYyxHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7QUFDL0IsUUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQTs7QUFFOUMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsaUNBQWlDLEVBQUUsVUFBQyxhQUFhLEVBQUs7QUFDL0YsWUFBSyxhQUFhLEdBQUcsYUFBYSxDQUFBO0tBQ25DLENBQUMsQ0FBQyxDQUFBO0dBQ0o7O2VBbEJHLFVBQVU7O1dBbUJSLGdCQUFDLFFBQWdCLEVBQUU7QUFDdkIsVUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUE7QUFDakMsVUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFBO0tBQ2Q7OztXQUNLLGtCQUFHOzs7QUFDUCxVQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFBO0FBQzlCLFVBQUksQ0FBQyxRQUFRLEVBQUUsT0FBTTtBQUNyQixVQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxPQUFNO0FBQy9CLFVBQU0sT0FBb0MsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBO0FBQ3RELFVBQU0sYUFBYSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7O0FBRS9CLHdCQUFtQyxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQXRDLFNBQVEsU0FBUixRQUFRO1lBQUUsT0FBTSxTQUFOLE1BQU07O0FBQzNCLFlBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxHQUFH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cy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvYnVzeS1zaWduYWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcbmltcG9ydCB0eXBlIHsgTGludGVyIH0gZnJvbSAnLi90eXBlcydcblxuY2xhc3MgQnVzeVNpZ25hbCB7XG4gIHByb3ZpZGVyOiA/T2JqZWN0O1xuICBleGVjdXRpbmc6IFNldDx7XG4gICAgbGludGVyOiBMaW50ZXIsXG4gICAgZmlsZVBhdGg6ID9zdHJpbmcsXG4gIH0+O1xuICBwcm92aWRlclRpdGxlczogU2V0PHN0cmluZz47XG4gIHVzZUJ1c3lTaWduYWw6IGJvb2xlYW47XG4gIHN1YnNjcmlwdGlvbnM6IENvbXBvc2l0ZURpc3Bvc2FibGU7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5leGVjdXRpbmcgPSBuZXcgU2V0KClcbiAgICB0aGlzLnByb3ZpZGVyVGl0bGVzID0gbmV3IFNldCgpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItdWktZGVmYXVsdC51c2VCdXN5U2lnbmFsJywgKHVzZUJ1c3lTaWduYWwpID0+IHtcbiAgICAgIHRoaXMudXNlQnVzeVNpZ25hbCA9IHVzZUJ1c3lTaWduYWxcbiAgICB9KSlcbiAgfVxuICBhdHRhY2gocmVnaXN0cnk6IE9iamVjdCkge1xuICAgIHRoaXMucHJvdmlkZXIgPSByZWdpc3RyeS5jcmVhdGUoKVxuICAgIHRoaXMudXBkYXRlKClcbiAgfVxuICB1cGRhdGUoKSB7XG4gICAgY29uc3QgcHJvdmlkZXIgPSB0aGlzLnByb3ZpZGVyXG4gICAgaWYgKCFwcm92aWRlcikgcmV0dXJuXG4gICAgaWYgKCF0aGlzLnVzZUJ1c3lTaWduYWwpIHJldHVyblxuICAgIGNvbnN0IGZpbGVNYXA6IE1hcDw/c3RyaW5nLCBBcnJheTxzdHJpbmc+PiA9IG5ldyBNYXAoKVxuICAgIGNvbnN0IGN1cnJlbnRUaXRsZXMgPSBuZXcgU2V0KClcblxuICAgIGZvciAoY29uc3QgeyBmaWxlUGF0aCwgbGludGVyIH0gb2YgdGhpcy5leGVjdXRpbmcpIHtcbiAgICAgIGxldCBuYW1lcyA9IGZpbGVNYXAuZ2V0KGZpbGVQYXRoKVxuICAgICAgaWYgKCFuYW1lcykge1xuICAgICAgICBmaWxlTWFwLnNldChmaWxlUGF0aCwgbmFtZXMgPSBbXSlcbiAgICAgIH1cbiAgICAgIG5hbWVzLnB1c2gobGludGVyLm5hbWUpXG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBbZmlsZVBhdGgsIG5hbWVzXSBvZiBmaWxlTWFwKSB7XG4gICAgICBjb25zdCBwYXRoID0gZmlsZVBhdGggPyBgIG9uICR7YXRvbS5wcm9qZWN0LnJlbGF0aXZpemVQYXRoKGZpbGVQYXRoKVsxXX1gIDogJydcbiAgICAgIG5hbWVzLmZvckVhY2goKG5hbWUpID0+IHtcbiAgICAgICAgY29uc3QgdGl0bGUgPSBgJHtuYW1lfSR7cGF0aH1gXG4gICAgICAgIGN1cnJlbnRUaXRsZXMuYWRkKHRpdGxlKVxuICAgICAgICBpZiAoIXRoaXMucHJvdmlkZXJUaXRsZXMuaGFzKHRpdGxlKSkge1xuICAgICAgICAgIC8vIEFkZCB0aGUgdGl0bGUgc2luY2UgaXQgaGFzbid0IGJlZW4gc2VlbiBiZWZvcmVcbiAgICAgICAgICB0aGlzLnByb3ZpZGVyVGl0bGVzLmFkZCh0aXRsZSlcbiAgICAgICAgICBwcm92aWRlci5hZGQodGl0bGUpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgLy8gUmVtb3ZlIGFueSB0aXRsZXMgbm8gbG9uZ2VyIGFjdGl2ZVxuICAgIHRoaXMucHJvdmlkZXJUaXRsZXMuZm9yRWFjaCgodGl0bGUpID0+IHtcbiAgICAgIGlmICghY3VycmVudFRpdGxlcy5oYXModGl0bGUpKSB7XG4gICAgICAgIHByb3ZpZGVyLnJlbW92ZSh0aXRsZSlcbiAgICAgICAgdGhpcy5wcm92aWRlclRpdGxlcy5kZWxldGUodGl0bGUpXG4gICAgICB9XG4gICAgfSlcblxuICAgIGZpbGVNYXAuY2xlYXIoKVxuICB9XG4gIGdldEV4ZWN1dGluZyhsaW50ZXI6IExpbnRlciwgZmlsZVBhdGg6ID9zdHJpbmcpOiA/T2JqZWN0IHtcbiAgICBmb3IgKGNvbnN0IGVudHJ5IG9mIHRoaXMuZXhlY3V0aW5nKSB7XG4gICAgICBpZiAoZW50cnkubGludGVyID09PSBsaW50ZXIgJiYgZW50cnkuZmlsZVBhdGggPT09IGZpbGVQYXRoKSB7XG4gICAgICAgIHJldHVybiBlbnRyeVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbFxuICB9XG4gIGRpZEJlZ2luTGludGluZyhsaW50ZXI6IExpbnRlciwgZmlsZVBhdGg6ID9zdHJpbmcpIHtcbiAgICBpZiAodGhpcy5nZXRFeGVjdXRpbmcobGludGVyLCBmaWxlUGF0aCkpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICB0aGlzLmV4ZWN1dGluZy5hZGQoeyBsaW50ZXIsIGZpbGVQYXRoIH0pXG4gICAgdGhpcy51cGRhdGUoKVxuICB9XG4gIGRpZEZpbmlzaExpbnRpbmcobGludGVyOiBMaW50ZXIsIGZpbGVQYXRoOiA/c3RyaW5nKSB7XG4gICAgY29uc3QgZW50cnkgPSB0aGlzLmdldEV4ZWN1dGluZyhsaW50ZXIsIGZpbGVQYXRoKVxuICAgIGlmIChlbnRyeSkge1xuICAgICAgdGhpcy5leGVjdXRpbmcuZGVsZXRlKGVudHJ5KVxuICAgICAgdGhpcy51cGRhdGUoKVxuICAgIH1cbiAgfVxuICBkaXNwb3NlKCkge1xuICAgIGlmICh0aGlzLnByb3ZpZGVyKSB7XG4gICAgICB0aGlzLnByb3ZpZGVyLmNsZWFyKClcbiAgICB9XG4gICAgdGhpcy5wcm92aWRlclRpdGxlcy5jbGVhcigpXG4gICAgdGhpcy5leGVjdXRpbmcuY2xlYXIoKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEJ1c3lTaWduYWxcbiJdfQ==