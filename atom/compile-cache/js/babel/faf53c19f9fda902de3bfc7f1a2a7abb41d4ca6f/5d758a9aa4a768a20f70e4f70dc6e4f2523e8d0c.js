Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _validate = require('./validate');

var _validate2 = _interopRequireDefault(_validate);

var _helpers = require('./helpers');

var _helpers2 = _interopRequireDefault(_helpers);

'use babel';

var LinterRegistry = (function () {
  function LinterRegistry() {
    _classCallCheck(this, LinterRegistry);

    this.linters = new Set();
    this.locks = {
      Regular: new WeakSet(),
      Fly: new WeakSet()
    };

    this.subscriptions = new _atom.CompositeDisposable();
    this.emitter = new _atom.Emitter();
    this.subscriptions.add(this.emitter);
  }

  _createClass(LinterRegistry, [{
    key: 'getLinters',
    value: function getLinters() {
      return this.linters;
    }
  }, {
    key: 'hasLinter',
    value: function hasLinter(linter) {
      return this.linters.has(linter);
    }
  }, {
    key: 'addLinter',
    value: function addLinter(linter) {
      try {
        _validate2['default'].linter(linter);
        linter.deactivated = false;
        this.linters.add(linter);
      } catch (err) {
        _helpers2['default'].error(err);
      }
    }
  }, {
    key: 'deleteLinter',
    value: function deleteLinter(linter) {
      if (this.linters.has(linter)) {
        linter.deactivated = true;
        this.linters['delete'](linter);
      }
    }
  }, {
    key: 'lint',
    value: function lint(_ref) {
      var _this = this;

      var onChange = _ref.onChange;
      var editorLinter = _ref.editorLinter;

      var editor = editorLinter.editor;
      var lockKey = onChange ? 'Fly' : 'Regular';

      if (onChange && !atom.config.get('linter.lintOnFly') || // Lint-on-fly mismatch
      !editor.getPath() || // Not saved anywhere yet
      editor !== atom.workspace.getActiveTextEditor() || // Not active
      this.locks[lockKey].has(editorLinter) || // Already linting
      atom.config.get('linter.ignoreVCSIgnoredFiles') && _helpers2['default'].isPathIgnored(editor.getPath()) // Ignored by VCS
      ) {
          return;
        }

      this.locks[lockKey].add(editorLinter);
      var scopes = editor.scopeDescriptorForBufferPosition(editor.getCursorBufferPosition()).scopes;
      scopes.push('*');

      var promises = [];
      this.linters.forEach(function (linter) {
        if (_helpers2['default'].shouldTriggerLinter(linter, onChange, scopes)) {
          promises.push(new Promise(function (resolve) {
            resolve(linter.lint(editor));
          }).then(function (results) {
            if (results) {
              _this.emitter.emit('did-update-messages', { linter: linter, messages: results, editor: editor });
            }
          }, _helpers2['default'].error));
        }
      });
      return Promise.all(promises).then(function () {
        return _this.locks[lockKey]['delete'](editorLinter);
      });
    }
  }, {
    key: 'onDidUpdateMessages',
    value: function onDidUpdateMessages(callback) {
      return this.emitter.on('did-update-messages', callback);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.linters.clear();
      this.subscriptions.dispose();
    }
  }]);

  return LinterRegistry;
})();

exports['default'] = LinterRegistry;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL2xpbnRlci1yZWdpc3RyeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O29CQUUyQyxNQUFNOzt3QkFDNUIsWUFBWTs7Ozt1QkFDYixXQUFXOzs7O0FBSi9CLFdBQVcsQ0FBQTs7SUFNVSxjQUFjO0FBQ3RCLFdBRFEsY0FBYyxHQUNuQjswQkFESyxjQUFjOztBQUUvQixRQUFJLENBQUMsT0FBTyxHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7QUFDeEIsUUFBSSxDQUFDLEtBQUssR0FBRztBQUNYLGFBQU8sRUFBRSxJQUFJLE9BQU8sRUFBRTtBQUN0QixTQUFHLEVBQUUsSUFBSSxPQUFPLEVBQUU7S0FDbkIsQ0FBQTs7QUFFRCxRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFBO0FBQzlDLFFBQUksQ0FBQyxPQUFPLEdBQUcsbUJBQWEsQ0FBQTtBQUM1QixRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7R0FDckM7O2VBWGtCLGNBQWM7O1dBWXZCLHNCQUFHO0FBQ1gsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFBO0tBQ3BCOzs7V0FDUSxtQkFBQyxNQUFNLEVBQUU7QUFDaEIsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQTtLQUNoQzs7O1dBQ1EsbUJBQUMsTUFBTSxFQUFFO0FBQ2hCLFVBQUk7QUFDRiw4QkFBUyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDdkIsY0FBTSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUE7QUFDMUIsWUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUE7T0FDekIsQ0FBQyxPQUFPLEdBQUcsRUFBRTtBQUNaLDZCQUFRLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQTtPQUNuQjtLQUNGOzs7V0FDVyxzQkFBQyxNQUFNLEVBQUU7QUFDbkIsVUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRTtBQUM1QixjQUFNLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQTtBQUN6QixZQUFJLENBQUMsT0FBTyxVQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7T0FDNUI7S0FDRjs7O1dBQ0csY0FBQyxJQUF3QixFQUFFOzs7VUFBekIsUUFBUSxHQUFULElBQXdCLENBQXZCLFFBQVE7VUFBRSxZQUFZLEdBQXZCLElBQXdCLENBQWIsWUFBWTs7QUFDMUIsVUFBTSxNQUFNLEdBQUcsWUFBWSxDQUFDLE1BQU0sQ0FBQTtBQUNsQyxVQUFNLE9BQU8sR0FBRyxRQUFRLEdBQUcsS0FBSyxHQUFHLFNBQVMsQ0FBQTs7QUFFNUMsVUFDRSxBQUFDLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDO0FBQ2pELE9BQUMsTUFBTSxDQUFDLE9BQU8sRUFBRTtBQUNqQixZQUFNLEtBQUssSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsRUFBRTtBQUMvQyxVQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUM7QUFDcEMsVUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsOEJBQThCLENBQUMsSUFDOUMscUJBQVEsYUFBYSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxBQUFDO1FBQzFDO0FBQ0EsaUJBQU07U0FDUDs7QUFFRCxVQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQTtBQUNyQyxVQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsZ0NBQWdDLENBQUMsTUFBTSxDQUFDLHVCQUF1QixFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUE7QUFDL0YsWUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTs7QUFFaEIsVUFBTSxRQUFRLEdBQUcsRUFBRSxDQUFBO0FBQ25CLFVBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFVBQUEsTUFBTSxFQUFJO0FBQzdCLFlBQUkscUJBQVEsbUJBQW1CLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtBQUN6RCxrQkFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLE9BQU8sQ0FBQyxVQUFTLE9BQU8sRUFBRTtBQUMxQyxtQkFBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQTtXQUM3QixDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsT0FBTyxFQUFJO0FBQ2pCLGdCQUFJLE9BQU8sRUFBRTtBQUNYLG9CQUFLLE9BQU8sQ0FBQyxJQUFJLENBQUMscUJBQXFCLEVBQUUsRUFBQyxNQUFNLEVBQU4sTUFBTSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFOLE1BQU0sRUFBQyxDQUFDLENBQUE7YUFDOUU7V0FDRixFQUFFLHFCQUFRLEtBQUssQ0FBQyxDQUFDLENBQUE7U0FDbkI7T0FDRixDQUFDLENBQUE7QUFDRixhQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDO2VBQ2hDLE1BQUssS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFPLENBQUMsWUFBWSxDQUFDO09BQUEsQ0FDekMsQ0FBQTtLQUNGOzs7V0FDa0IsNkJBQUMsUUFBUSxFQUFFO0FBQzVCLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMscUJBQXFCLEVBQUUsUUFBUSxDQUFDLENBQUE7S0FDeEQ7OztXQUNNLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQTtBQUNwQixVQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFBO0tBQzdCOzs7U0ExRWtCLGNBQWM7OztxQkFBZCxjQUFjIiwiZmlsZSI6Ii9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL2xpbnRlci1yZWdpc3RyeS5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCB7RW1pdHRlciwgQ29tcG9zaXRlRGlzcG9zYWJsZX0gZnJvbSAnYXRvbSdcbmltcG9ydCBWYWxpZGF0ZSBmcm9tICcuL3ZhbGlkYXRlJ1xuaW1wb3J0IEhlbHBlcnMgZnJvbSAnLi9oZWxwZXJzJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMaW50ZXJSZWdpc3RyeSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMubGludGVycyA9IG5ldyBTZXQoKVxuICAgIHRoaXMubG9ja3MgPSB7XG4gICAgICBSZWd1bGFyOiBuZXcgV2Vha1NldCgpLFxuICAgICAgRmx5OiBuZXcgV2Vha1NldCgpXG4gICAgfVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuZW1pdHRlcilcbiAgfVxuICBnZXRMaW50ZXJzKCkge1xuICAgIHJldHVybiB0aGlzLmxpbnRlcnNcbiAgfVxuICBoYXNMaW50ZXIobGludGVyKSB7XG4gICAgcmV0dXJuIHRoaXMubGludGVycy5oYXMobGludGVyKVxuICB9XG4gIGFkZExpbnRlcihsaW50ZXIpIHtcbiAgICB0cnkge1xuICAgICAgVmFsaWRhdGUubGludGVyKGxpbnRlcilcbiAgICAgIGxpbnRlci5kZWFjdGl2YXRlZCA9IGZhbHNlXG4gICAgICB0aGlzLmxpbnRlcnMuYWRkKGxpbnRlcilcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIEhlbHBlcnMuZXJyb3IoZXJyKVxuICAgIH1cbiAgfVxuICBkZWxldGVMaW50ZXIobGludGVyKSB7XG4gICAgaWYgKHRoaXMubGludGVycy5oYXMobGludGVyKSkge1xuICAgICAgbGludGVyLmRlYWN0aXZhdGVkID0gdHJ1ZVxuICAgICAgdGhpcy5saW50ZXJzLmRlbGV0ZShsaW50ZXIpXG4gICAgfVxuICB9XG4gIGxpbnQoe29uQ2hhbmdlLCBlZGl0b3JMaW50ZXJ9KSB7XG4gICAgY29uc3QgZWRpdG9yID0gZWRpdG9yTGludGVyLmVkaXRvclxuICAgIGNvbnN0IGxvY2tLZXkgPSBvbkNoYW5nZSA/ICdGbHknIDogJ1JlZ3VsYXInXG5cbiAgICBpZiAoXG4gICAgICAob25DaGFuZ2UgJiYgIWF0b20uY29uZmlnLmdldCgnbGludGVyLmxpbnRPbkZseScpKSB8fCAvLyBMaW50LW9uLWZseSBtaXNtYXRjaFxuICAgICAgIWVkaXRvci5nZXRQYXRoKCkgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfHwgLy8gTm90IHNhdmVkIGFueXdoZXJlIHlldFxuICAgICAgZWRpdG9yICE9PSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCkgICAgfHwgLy8gTm90IGFjdGl2ZVxuICAgICAgdGhpcy5sb2Nrc1tsb2NrS2V5XS5oYXMoZWRpdG9yTGludGVyKSAgICAgICAgICAgICAgfHwgLy8gQWxyZWFkeSBsaW50aW5nXG4gICAgICAoYXRvbS5jb25maWcuZ2V0KCdsaW50ZXIuaWdub3JlVkNTSWdub3JlZEZpbGVzJykgJiZcbiAgICAgICAgSGVscGVycy5pc1BhdGhJZ25vcmVkKGVkaXRvci5nZXRQYXRoKCkpKSAgICAgICAgICAgIC8vIElnbm9yZWQgYnkgVkNTXG4gICAgKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICB0aGlzLmxvY2tzW2xvY2tLZXldLmFkZChlZGl0b3JMaW50ZXIpXG4gICAgY29uc3Qgc2NvcGVzID0gZWRpdG9yLnNjb3BlRGVzY3JpcHRvckZvckJ1ZmZlclBvc2l0aW9uKGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpKS5zY29wZXNcbiAgICBzY29wZXMucHVzaCgnKicpXG5cbiAgICBjb25zdCBwcm9taXNlcyA9IFtdXG4gICAgdGhpcy5saW50ZXJzLmZvckVhY2gobGludGVyID0+IHtcbiAgICAgIGlmIChIZWxwZXJzLnNob3VsZFRyaWdnZXJMaW50ZXIobGludGVyLCBvbkNoYW5nZSwgc2NvcGVzKSkge1xuICAgICAgICBwcm9taXNlcy5wdXNoKG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpIHtcbiAgICAgICAgICByZXNvbHZlKGxpbnRlci5saW50KGVkaXRvcikpXG4gICAgICAgIH0pLnRoZW4ocmVzdWx0cyA9PiB7XG4gICAgICAgICAgaWYgKHJlc3VsdHMpIHtcbiAgICAgICAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtdXBkYXRlLW1lc3NhZ2VzJywge2xpbnRlciwgbWVzc2FnZXM6IHJlc3VsdHMsIGVkaXRvcn0pXG4gICAgICAgICAgfVxuICAgICAgICB9LCBIZWxwZXJzLmVycm9yKSlcbiAgICAgIH1cbiAgICB9KVxuICAgIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcykudGhlbigoKSA9PlxuICAgICAgdGhpcy5sb2Nrc1tsb2NrS2V5XS5kZWxldGUoZWRpdG9yTGludGVyKVxuICAgIClcbiAgfVxuICBvbkRpZFVwZGF0ZU1lc3NhZ2VzKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLXVwZGF0ZS1tZXNzYWdlcycsIGNhbGxiYWNrKVxuICB9XG4gIGRpc3Bvc2UoKSB7XG4gICAgdGhpcy5saW50ZXJzLmNsZWFyKClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gIH1cbn1cbiJdfQ==
//# sourceURL=/Users/ah/.atom/packages/linter/lib/linter-registry.js
