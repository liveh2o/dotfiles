Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/* eslint-disable import/no-duplicates */

var _sbConfigFile = require('sb-config-file');

var _sbConfigFile2 = _interopRequireDefault(_sbConfigFile);

var _atom = require('atom');

var _helpers = require('./helpers');

var Helpers = _interopRequireWildcard(_helpers);

var _validate = require('./validate');

var Validate = _interopRequireWildcard(_validate);

var LinterRegistry = (function () {
  function LinterRegistry() {
    var _this = this;

    _classCallCheck(this, LinterRegistry);

    this.config = null;
    this.emitter = new _atom.Emitter();
    this.linters = new Set();
    this.subscriptions = new _atom.CompositeDisposable();

    this.subscriptions.add(atom.config.observe('linter.lintOnChange', function (lintOnChange) {
      _this.lintOnChange = lintOnChange;
    }));
    this.subscriptions.add(atom.config.observe('core.excludeVcsIgnoredPaths', function (ignoreVCS) {
      _this.ignoreVCS = ignoreVCS;
    }));
    this.subscriptions.add(atom.config.observe('linter.ignoreGlob', function (ignoreGlob) {
      _this.ignoreGlob = ignoreGlob;
    }));
    this.subscriptions.add(atom.config.observe('linter.lintPreviewTabs', function (lintPreviewTabs) {
      _this.lintPreviewTabs = lintPreviewTabs;
    }));
    this.subscriptions.add(this.emitter);
  }

  _createClass(LinterRegistry, [{
    key: 'hasLinter',
    value: function hasLinter(linter) {
      return this.linters.has(linter);
    }
  }, {
    key: 'addLinter',
    value: function addLinter(linter) {
      var legacy = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

      var version = legacy ? 1 : 2;
      if (!Validate.linter(linter, version)) {
        return;
      }
      linter[_helpers.$activated] = true;
      if (typeof linter[_helpers.$requestLatest] === 'undefined') {
        linter[_helpers.$requestLatest] = 0;
      }
      if (typeof linter[_helpers.$requestLastReceived] === 'undefined') {
        linter[_helpers.$requestLastReceived] = 0;
      }
      linter[_helpers.$version] = version;
      this.linters.add(linter);
    }
  }, {
    key: 'getLinters',
    value: function getLinters() {
      return Array.from(this.linters);
    }
  }, {
    key: 'deleteLinter',
    value: function deleteLinter(linter) {
      if (!this.linters.has(linter)) {
        return;
      }
      linter[_helpers.$activated] = false;
      this.linters['delete'](linter);
    }
  }, {
    key: 'getConfig',
    value: _asyncToGenerator(function* () {
      if (!this.config) {
        this.config = yield (0, _helpers.getConfigFile)();
      }
      return this.config;
    })
  }, {
    key: 'lint',
    value: _asyncToGenerator(function* (_ref) {
      var onChange = _ref.onChange;
      var editor = _ref.editor;
      return yield* (function* () {
        var _this2 = this;

        var filePath = editor.getPath();

        if (onChange && !this.lintOnChange || // Lint-on-change mismatch
        !filePath || // Not saved anywhere yet
        Helpers.isPathIgnored(editor.getPath(), this.ignoreGlob, this.ignoreVCS) || // Ignored by VCS or Glob
        !this.lintPreviewTabs && atom.workspace.getActivePane().getPendingItem() === editor // Ignore Preview tabs
        ) {
            return false;
          }

        var scopes = Helpers.getEditorCursorScopes(editor);
        var config = yield this.getConfig();
        var disabled = yield config.get('disabled');

        var promises = [];

        var _loop = function (linter) {
          if (!Helpers.shouldTriggerLinter(linter, onChange, scopes)) {
            return 'continue';
          }
          if (disabled.includes(linter.name)) {
            return 'continue';
          }
          var number = ++linter[_helpers.$requestLatest];
          var statusBuffer = linter.scope === 'file' ? editor.getBuffer() : null;
          var statusFilePath = linter.scope === 'file' ? filePath : null;

          _this2.emitter.emit('did-begin-linting', { number: number, linter: linter, filePath: statusFilePath });
          promises.push(new Promise(function (resolve) {
            // $FlowIgnore: Type too complex, duh
            resolve(linter.lint(editor));
          }).then(function (messages) {
            _this2.emitter.emit('did-finish-linting', { number: number, linter: linter, filePath: statusFilePath });
            if (linter[_helpers.$requestLastReceived] >= number || !linter[_helpers.$activated] || statusBuffer && !statusBuffer.isAlive()) {
              return;
            }
            linter[_helpers.$requestLastReceived] = number;
            if (statusBuffer && !statusBuffer.isAlive()) {
              return;
            }

            if (messages === null) {
              // NOTE: Do NOT update the messages when providers return null
              return;
            }

            var validity = true;
            // NOTE: We are calling it when results are not an array to show a nice notification
            if (atom.inDevMode() || !Array.isArray(messages)) {
              validity = linter[_helpers.$version] === 2 ? Validate.messages(linter.name, messages) : Validate.messagesLegacy(linter.name, messages);
            }
            if (!validity) {
              return;
            }

            if (linter[_helpers.$version] === 2) {
              Helpers.normalizeMessages(linter.name, messages);
            } else {
              Helpers.normalizeMessagesLegacy(linter.name, messages);
            }
            _this2.emitter.emit('did-update-messages', { messages: messages, linter: linter, buffer: statusBuffer });
          }, function (error) {
            _this2.emitter.emit('did-finish-linting', { number: number, linter: linter, filePath: statusFilePath });
            atom.notifications.addError('[Linter] Error running ' + linter.name, {
              detail: 'See console for more info'
            });
            console.error('[Linter] Error running ' + linter.name, error);
          }));
        };

        for (var linter of this.linters) {
          var _ret = _loop(linter);

          if (_ret === 'continue') continue;
        }

        yield Promise.all(promises);
        return true;
      }).apply(this, arguments);
    })
  }, {
    key: 'onDidUpdateMessages',
    value: function onDidUpdateMessages(callback) {
      return this.emitter.on('did-update-messages', callback);
    }
  }, {
    key: 'onDidBeginLinting',
    value: function onDidBeginLinting(callback) {
      return this.emitter.on('did-begin-linting', callback);
    }
  }, {
    key: 'onDidFinishLinting',
    value: function onDidFinishLinting(callback) {
      return this.emitter.on('did-finish-linting', callback);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL2xpbnRlci1yZWdpc3RyeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OzRCQUd1QixnQkFBZ0I7Ozs7b0JBQ00sTUFBTTs7dUJBRzFCLFdBQVc7O0lBQXhCLE9BQU87O3dCQUNPLFlBQVk7O0lBQTFCLFFBQVE7O0lBSUMsY0FBYztBQVV0QixXQVZRLGNBQWMsR0FVbkI7OzswQkFWSyxjQUFjOztBQVcvQixRQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQTtBQUNsQixRQUFJLENBQUMsT0FBTyxHQUFHLG1CQUFhLENBQUE7QUFDNUIsUUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBO0FBQ3hCLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7O0FBRTlDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLHFCQUFxQixFQUFFLFVBQUMsWUFBWSxFQUFLO0FBQ2xGLFlBQUssWUFBWSxHQUFHLFlBQVksQ0FBQTtLQUNqQyxDQUFDLENBQUMsQ0FBQTtBQUNILFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLDZCQUE2QixFQUFFLFVBQUMsU0FBUyxFQUFLO0FBQ3ZGLFlBQUssU0FBUyxHQUFHLFNBQVMsQ0FBQTtLQUMzQixDQUFDLENBQUMsQ0FBQTtBQUNILFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLG1CQUFtQixFQUFFLFVBQUMsVUFBVSxFQUFLO0FBQzlFLFlBQUssVUFBVSxHQUFHLFVBQVUsQ0FBQTtLQUM3QixDQUFDLENBQUMsQ0FBQTtBQUNILFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFD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QUMsQ0FBQTtBQUNGLG1CQUFPLENBQUMsS0FBSyw2QkFBMkIsTUFBTSxDQUFDLElBQUksRUFBSSxLQUFLLENBQUMsQ0FBQTtXQUM5RCxDQUFDLENBQUMsQ0FBQTs7O0FBbkRMLGFBQUssSUFBTSxNQUFNLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTsyQkFBeEIsTUFBTTs7bUNBS2IsU0FBUTtTQStDWDs7QUFFRCxjQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUE7QUFDM0IsZUFBTyxJQUFJLENBQUE7T0FDWjtLQUFBOzs7V0FDa0IsNkJBQUMsUUFBa0IsRUFBYztBQUNsRCxhQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLHFCQUFxQixFQUFFLFFBQVEsQ0FBQyxDQUFBO0tBQ3hEOzs7V0FDZ0IsMkJBQUMsUUFBa0IsRUFBYztBQUNoRCxhQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLG1CQUFtQixFQUFFLFFBQVEsQ0FBQyxDQUFBO0tBQ3REOzs7V0FDaUIsNEJBQUMsUUFBa0IsRUFBYztBQUNqRCxhQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLG9CQUFvQixFQUFFLFFBQVEsQ0FBQyxDQUFBO0tBQ3ZEOzs7V0FDTSxtQkFBRztBQUNSLFVBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUE7QUFDcEIsVUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtLQUM3Qjs7O1NBdEprQixjQUFjOzs7cUJBQWQsY0FBYyIsImZpbGUiOiIvVXNlcnMvYWgvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi9saW50ZXItcmVnaXN0cnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuLyogZXNsaW50LWRpc2FibGUgaW1wb3J0L25vLWR1cGxpY2F0ZXMgKi9cblxuaW1wb3J0IENvbmZpZ0ZpbGUgZnJvbSAnc2ItY29uZmlnLWZpbGUnXG5pbXBvcnQgeyBFbWl0dGVyLCBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcbmltcG9ydCB0eXBlIHsgVGV4dEVkaXRvciwgRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nXG5cbmltcG9ydCAqIGFzIEhlbHBlcnMgZnJvbSAnLi9oZWxwZXJzJ1xuaW1wb3J0ICogYXMgVmFsaWRhdGUgZnJvbSAnLi92YWxpZGF0ZSdcbmltcG9ydCB7ICR2ZXJzaW9uLCAkYWN0aXZhdGVkLCAkcmVxdWVzdExhdGVzdCwgJHJlcXVlc3RMYXN0UmVjZWl2ZWQsIGdldENvbmZpZ0ZpbGUgfSBmcm9tICcuL2hlbHBlcnMnXG5pbXBvcnQgdHlwZSB7IExpbnRlciB9IGZyb20gJy4vdHlwZXMnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExpbnRlclJlZ2lzdHJ5IHtcbiAgY29uZmlnOiA/Q29uZmlnRmlsZTtcbiAgZW1pdHRlcjogRW1pdHRlcjtcbiAgbGludGVyczogU2V0PExpbnRlcj47XG4gIGxpbnRPbkNoYW5nZTogYm9vbGVhbjtcbiAgaWdub3JlVkNTOiBib29sZWFuO1xuICBpZ25vcmVHbG9iOiBzdHJpbmc7XG4gIGxpbnRQcmV2aWV3VGFiczogYm9vbGVhbjtcbiAgc3Vic2NyaXB0aW9uczogQ29tcG9zaXRlRGlzcG9zYWJsZTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmNvbmZpZyA9IG51bGxcbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpXG4gICAgdGhpcy5saW50ZXJzID0gbmV3IFNldCgpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXIubGludE9uQ2hhbmdlJywgKGxpbnRPbkNoYW5nZSkgPT4ge1xuICAgICAgdGhpcy5saW50T25DaGFuZ2UgPSBsaW50T25DaGFuZ2VcbiAgICB9KSlcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2NvcmUuZXhjbHVkZVZjc0lnbm9yZWRQYXRocycsIChpZ25vcmVWQ1MpID0+IHtcbiAgICAgIHRoaXMuaWdub3JlVkNTID0gaWdub3JlVkNTXG4gICAgfSkpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXIuaWdub3JlR2xvYicsIChpZ25vcmVHbG9iKSA9PiB7XG4gICAgICB0aGlzLmlnbm9yZUdsb2IgPSBpZ25vcmVHbG9iXG4gICAgfSkpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXIubGludFByZXZpZXdUYWJzJywgKGxpbnRQcmV2aWV3VGFicykgPT4ge1xuICAgICAgdGhpcy5saW50UHJldmlld1RhYnMgPSBsaW50UHJldmlld1RhYnNcbiAgICB9KSlcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuZW1pdHRlcilcbiAgfVxuICBoYXNMaW50ZXIobGludGVyOiBMaW50ZXIpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5saW50ZXJzLmhhcyhsaW50ZXIpXG4gIH1cbiAgYWRkTGludGVyKGxpbnRlcjogTGludGVyLCBsZWdhY3k6IGJvb2xlYW4gPSBmYWxzZSkge1xuICAgIGNvbnN0IHZlcnNpb24gPSBsZWdhY3kgPyAxIDogMlxuICAgIGlmICghVmFsaWRhdGUubGludGVyKGxpbnRlciwgdmVyc2lvbikpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBsaW50ZXJbJGFjdGl2YXRlZF0gPSB0cnVlXG4gICAgaWYgKHR5cGVvZiBsaW50ZXJbJHJlcXVlc3RMYXRlc3RdID09PSAndW5kZWZpbmVkJykge1xuICAgICAgbGludGVyWyRyZXF1ZXN0TGF0ZXN0XSA9IDBcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBsaW50ZXJbJHJlcXVlc3RMYXN0UmVjZWl2ZWRdID09PSAndW5kZWZpbmVkJykge1xuICAgICAgbGludGVyWyRyZXF1ZXN0TGFzdFJlY2VpdmVkXSA9IDBcbiAgICB9XG4gICAgbGludGVyWyR2ZXJzaW9uXSA9IHZlcnNpb25cbiAgICB0aGlzLmxpbnRlcnMuYWRkKGxpbnRlcilcbiAgfVxuICBnZXRMaW50ZXJzKCk6IEFycmF5PExpbnRlcj4ge1xuICAgIHJldHVybiBBcnJheS5mcm9tKHRoaXMubGludGVycylcbiAgfVxuICBkZWxldGVMaW50ZXIobGludGVyOiBMaW50ZXIpIHtcbiAgICBpZiAoIXRoaXMubGludGVycy5oYXMobGludGVyKSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGxpbnRlclskYWN0aXZhdGVkXSA9IGZhbHNlXG4gICAgdGhpcy5saW50ZXJzLmRlbGV0ZShsaW50ZXIpXG4gIH1cbiAgYXN5bmMgZ2V0Q29uZmlnKCk6IFByb21pc2U8Q29uZmlnRmlsZT4ge1xuICAgIGlmICghdGhpcy5jb25maWcpIHtcbiAgICAgIHRoaXMuY29uZmlnID0gYXdhaXQgZ2V0Q29uZmlnRmlsZSgpXG4gICAgfVxuICAgIHJldHVybiB0aGlzLmNvbmZpZ1xuICB9XG4gIGFzeW5jIGxpbnQoeyBvbkNoYW5nZSwgZWRpdG9yIH0gOiB7IG9uQ2hhbmdlOiBib29sZWFuLCBlZGl0b3I6IFRleHRFZGl0b3IgfSk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGNvbnN0IGZpbGVQYXRoID0gZWRpdG9yLmdldFBhdGgoKVxuXG4gICAgaWYgKFxuICAgICAgKG9uQ2hhbmdlICYmICF0aGlzLmxpbnRPbkNoYW5nZSkgfHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTGludC1vbi1jaGFuZ2UgbWlzbWF0Y2hcbiAgICAgICFmaWxlUGF0aCB8fCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE5vdCBzYXZlZCBhbnl3aGVyZSB5ZXRcbiAgICAgIEhlbHBlcnMuaXNQYXRoSWdub3JlZChlZGl0b3IuZ2V0UGF0aCgpLCB0aGlzLmlnbm9yZUdsb2IsIHRoaXMuaWdub3JlVkNTKSB8fCAgICAgICAgICAgICAgIC8vIElnbm9yZWQgYnkgVkNTIG9yIEdsb2JcbiAgICAgICghdGhpcy5saW50UHJldmlld1RhYnMgJiYgYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpLmdldFBlbmRpbmdJdGVtKCkgPT09IGVkaXRvcikgICAgIC8vIElnbm9yZSBQcmV2aWV3IHRhYnNcbiAgICApIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cblxuICAgIGNvbnN0IHNjb3BlcyA9IEhlbHBlcnMuZ2V0RWRpdG9yQ3Vyc29yU2NvcGVzKGVkaXRvcilcbiAgICBjb25zdCBjb25maWcgPSBhd2FpdCB0aGlzLmdldENvbmZpZygpXG4gICAgY29uc3QgZGlzYWJsZWQgPSBhd2FpdCBjb25maWcuZ2V0KCdkaXNhYmxlZCcpXG5cbiAgICBjb25zdCBwcm9taXNlcyA9IFtdXG4gICAgZm9yIChjb25zdCBsaW50ZXIgb2YgdGhpcy5saW50ZXJzKSB7XG4gICAgICBpZiAoIUhlbHBlcnMuc2hvdWxkVHJpZ2dlckxpbnRlcihsaW50ZXIsIG9uQ2hhbmdlLCBzY29wZXMpKSB7XG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG4gICAgICBpZiAoZGlzYWJsZWQuaW5jbHVkZXMobGludGVyLm5hbWUpKSB7XG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG4gICAgICBjb25zdCBudW1iZXIgPSArK2xpbnRlclskcmVxdWVzdExhdGVzdF1cbiAgICAgIGNvbnN0IHN0YXR1c0J1ZmZlciA9IGxpbnRlci5zY29wZSA9PT0gJ2ZpbGUnID8gZWRpdG9yLmdldEJ1ZmZlcigpIDogbnVsbFxuICAgICAgY29uc3Qgc3RhdHVzRmlsZVBhdGggPSBsaW50ZXIuc2NvcGUgPT09ICdmaWxlJyA/IGZpbGVQYXRoIDogbnVsbFxuXG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWJlZ2luLWxpbnRpbmcnLCB7IG51bWJlciwgbGludGVyLCBmaWxlUGF0aDogc3RhdHVzRmlsZVBhdGggfSlcbiAgICAgIHByb21pc2VzLnB1c2gobmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xuICAgICAgICAvLyAkRmxvd0lnbm9yZTogVHlwZSB0b28gY29tcGxleCwgZHVoXG4gICAgICAgIHJlc29sdmUobGludGVyLmxpbnQoZWRpdG9yKSlcbiAgICAgIH0pLnRoZW4oKG1lc3NhZ2VzKSA9PiB7XG4gICAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtZmluaXNoLWxpbnRpbmcnLCB7IG51bWJlciwgbGludGVyLCBmaWxlUGF0aDogc3RhdHVzRmlsZVBhdGggfSlcbiAgICAgICAgaWYgKGxpbnRlclskcmVxdWVzdExhc3RSZWNlaXZlZF0gPj0gbnVtYmVyIHx8ICFsaW50ZXJbJGFjdGl2YXRlZF0gfHwgKHN0YXR1c0J1ZmZlciAmJiAhc3RhdHVzQnVmZmVyLmlzQWxpdmUoKSkpIHtcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICBsaW50ZXJbJHJlcXVlc3RMYXN0UmVjZWl2ZWRdID0gbnVtYmVyXG4gICAgICAgIGlmIChzdGF0dXNCdWZmZXIgJiYgIXN0YXR1c0J1ZmZlci5pc0FsaXZlKCkpIHtcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtZXNzYWdlcyA9PT0gbnVsbCkge1xuICAgICAgICAgIC8vIE5PVEU6IERvIE5PVCB1cGRhdGUgdGhlIG1lc3NhZ2VzIHdoZW4gcHJvdmlkZXJzIHJldHVybiBudWxsXG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBsZXQgdmFsaWRpdHkgPSB0cnVlXG4gICAgICAgIC8vIE5PVEU6IFdlIGFyZSBjYWxsaW5nIGl0IHdoZW4gcmVzdWx0cyBhcmUgbm90IGFuIGFycmF5IHRvIHNob3cgYSBuaWNlIG5vdGlmaWNhdGlvblxuICAgICAgICBpZiAoYXRvbS5pbkRldk1vZGUoKSB8fCAhQXJyYXkuaXNBcnJheShtZXNzYWdlcykpIHtcbiAgICAgICAgICB2YWxpZGl0eSA9IGxpbnRlclskdmVyc2lvbl0gPT09IDIgPyBWYWxpZGF0ZS5tZXNzYWdlcyhsaW50ZXIubmFtZSwgbWVzc2FnZXMpIDogVmFsaWRhdGUubWVzc2FnZXNMZWdhY3kobGludGVyLm5hbWUsIG1lc3NhZ2VzKVxuICAgICAgICB9XG4gICAgICAgIGlmICghdmFsaWRpdHkpIHtcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChsaW50ZXJbJHZlcnNpb25dID09PSAyKSB7XG4gICAgICAgICAgSGVscGVycy5ub3JtYWxpemVNZXNzYWdlcyhsaW50ZXIubmFtZSwgbWVzc2FnZXMpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgSGVscGVycy5ub3JtYWxpemVNZXNzYWdlc0xlZ2FjeShsaW50ZXIubmFtZSwgbWVzc2FnZXMpXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC11cGRhdGUtbWVzc2FnZXMnLCB7IG1lc3NhZ2VzLCBsaW50ZXIsIGJ1ZmZlcjogc3RhdHVzQnVmZmVyIH0pXG4gICAgICB9LCAoZXJyb3IpID0+IHtcbiAgICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1maW5pc2gtbGludGluZycsIHsgbnVtYmVyLCBsaW50ZXIsIGZpbGVQYXRoOiBzdGF0dXNGaWxlUGF0aCB9KVxuICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoYFtMaW50ZXJdIEVycm9yIHJ1bm5pbmcgJHtsaW50ZXIubmFtZX1gLCB7XG4gICAgICAgICAgZGV0YWlsOiAnU2VlIGNvbnNvbGUgZm9yIG1vcmUgaW5mbycsXG4gICAgICAgIH0pXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoYFtMaW50ZXJdIEVycm9yIHJ1bm5pbmcgJHtsaW50ZXIubmFtZX1gLCBlcnJvcilcbiAgICAgIH0pKVxuICAgIH1cblxuICAgIGF3YWl0IFByb21pc2UuYWxsKHByb21pc2VzKVxuICAgIHJldHVybiB0cnVlXG4gIH1cbiAgb25EaWRVcGRhdGVNZXNzYWdlcyhjYWxsYmFjazogRnVuY3Rpb24pOiBEaXNwb3NhYmxlIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtdXBkYXRlLW1lc3NhZ2VzJywgY2FsbGJhY2spXG4gIH1cbiAgb25EaWRCZWdpbkxpbnRpbmcoY2FsbGJhY2s6IEZ1bmN0aW9uKTogRGlzcG9zYWJsZSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLWJlZ2luLWxpbnRpbmcnLCBjYWxsYmFjaylcbiAgfVxuICBvbkRpZEZpbmlzaExpbnRpbmcoY2FsbGJhY2s6IEZ1bmN0aW9uKTogRGlzcG9zYWJsZSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLWZpbmlzaC1saW50aW5nJywgY2FsbGJhY2spXG4gIH1cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLmxpbnRlcnMuY2xlYXIoKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgfVxufVxuIl19