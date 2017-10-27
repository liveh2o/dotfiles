var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/* eslint-disable import/no-duplicates */

var _atom = require('atom');

var _helpers = require('./helpers');

var Helpers = _interopRequireWildcard(_helpers);

var _validate = require('./validate');

var Validate = _interopRequireWildcard(_validate);

var LinterRegistry = (function () {
  function LinterRegistry() {
    var _this = this;

    _classCallCheck(this, LinterRegistry);

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
    this.subscriptions.add(atom.config.observe('linter.disabledProviders', function (disabledProviders) {
      _this.disabledProviders = disabledProviders;
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
    key: 'getProviders',
    value: function getProviders() {
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

        var promises = [];

        var _loop = function (linter) {
          if (!Helpers.shouldTriggerLinter(linter, onChange, scopes)) {
            return 'continue';
          }
          if (_this2.disabledProviders.includes(linter.name)) {
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
              detail: 'See Console for more info. (Open View -> Developer -> Toggle Developer Tools)'
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

module.exports = LinterRegistry;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL2xpbnRlci1yZWdpc3RyeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O29CQUc2QyxNQUFNOzt1QkFHMUIsV0FBVzs7SUFBeEIsT0FBTzs7d0JBQ08sWUFBWTs7SUFBMUIsUUFBUTs7SUFJZCxjQUFjO0FBVVAsV0FWUCxjQUFjLEdBVUo7OzswQkFWVixjQUFjOztBQVdoQixRQUFJLENBQUMsT0FBTyxHQUFHLG1CQUFhLENBQUE7QUFDNUIsUUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBO0FBQ3hCLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7O0FBRTlDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLHFCQUFxQixFQUFFLFVBQUMsWUFBWSxFQUFLO0FBQ2xGLFlBQUssWUFBWSxHQUFHLFlBQVksQ0FBQTtLQUNqQyxDQUFDLENBQUMsQ0FBQTtBQUNILFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLDZCQUE2QixFQUFFLFVBQUMsU0FBUyxFQUFLO0FBQ3ZGLFlBQUssU0FBUyxHQUFHLFNBQVMsQ0FBQTtLQUMzQixDQUFDLENBQUMsQ0FBQTtBQUNILFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLG1CQUFtQixFQUFFLFVBQUMsVUFBVSxFQUFLO0FBQzlFLFlBQUssVUFBVSxHQUFHLFVBQVUsQ0FBQTtLQUM3QixDQUFDLENBQUMsQ0FBQTtBQUNILFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLHdCQUF3QixFQUFFLFVBQUMsZUFBZSxFQUFLO0FBQ3hGLFlBQUssZUFBZSxHQUFHLGVBQWUsQ0FBQTtL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OzttQ0FLYixTQUFRO1NBK0NYOztBQUVELGNBQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUMzQixlQUFPLElBQUksQ0FBQTtPQUNaO0tBQUE7OztXQUNrQiw2QkFBQyxRQUFrQixFQUFjO0FBQ2xELGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMscUJBQXFCLEVBQUUsUUFBUSxDQUFDLENBQUE7S0FDeEQ7OztXQUNnQiwyQkFBQyxRQUFrQixFQUFjO0FBQ2hELGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsbUJBQW1CLEVBQUUsUUFBUSxDQUFDLENBQUE7S0FDdEQ7OztXQUNpQiw0QkFBQyxRQUFrQixFQUFjO0FBQ2pELGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsb0JBQW9CLEVBQUUsUUFBUSxDQUFDLENBQUE7S0FDdkQ7OztXQUNNLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQTtBQUNwQixVQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFBO0tBQzdCOzs7U0FoSkcsY0FBYzs7O0FBbUpwQixNQUFNLENBQUMsT0FBTyxHQUFHLGNBQWMsQ0FBQSIsImZpbGUiOiIvVXNlcnMvYWgvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi9saW50ZXItcmVnaXN0cnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuLyogZXNsaW50LWRpc2FibGUgaW1wb3J0L25vLWR1cGxpY2F0ZXMgKi9cblxuaW1wb3J0IHsgRW1pdHRlciwgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nXG5pbXBvcnQgdHlwZSB7IFRleHRFZGl0b3IsIERpc3Bvc2FibGUgfSBmcm9tICdhdG9tJ1xuXG5pbXBvcnQgKiBhcyBIZWxwZXJzIGZyb20gJy4vaGVscGVycydcbmltcG9ydCAqIGFzIFZhbGlkYXRlIGZyb20gJy4vdmFsaWRhdGUnXG5pbXBvcnQgeyAkdmVyc2lvbiwgJGFjdGl2YXRlZCwgJHJlcXVlc3RMYXRlc3QsICRyZXF1ZXN0TGFzdFJlY2VpdmVkIH0gZnJvbSAnLi9oZWxwZXJzJ1xuaW1wb3J0IHR5cGUgeyBMaW50ZXIgfSBmcm9tICcuL3R5cGVzJ1xuXG5jbGFzcyBMaW50ZXJSZWdpc3RyeSB7XG4gIGVtaXR0ZXI6IEVtaXR0ZXI7XG4gIGxpbnRlcnM6IFNldDxMaW50ZXI+O1xuICBsaW50T25DaGFuZ2U6IGJvb2xlYW47XG4gIGlnbm9yZVZDUzogYm9vbGVhbjtcbiAgaWdub3JlR2xvYjogc3RyaW5nO1xuICBsaW50UHJldmlld1RhYnM6IGJvb2xlYW47XG4gIHN1YnNjcmlwdGlvbnM6IENvbXBvc2l0ZURpc3Bvc2FibGU7XG4gIGRpc2FibGVkUHJvdmlkZXJzOiBBcnJheTxzdHJpbmc+O1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKClcbiAgICB0aGlzLmxpbnRlcnMgPSBuZXcgU2V0KClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci5saW50T25DaGFuZ2UnLCAobGludE9uQ2hhbmdlKSA9PiB7XG4gICAgICB0aGlzLmxpbnRPbkNoYW5nZSA9IGxpbnRPbkNoYW5nZVxuICAgIH0pKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnY29yZS5leGNsdWRlVmNzSWdub3JlZFBhdGhzJywgKGlnbm9yZVZDUykgPT4ge1xuICAgICAgdGhpcy5pZ25vcmVWQ1MgPSBpZ25vcmVWQ1NcbiAgICB9KSlcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci5pZ25vcmVHbG9iJywgKGlnbm9yZUdsb2IpID0+IHtcbiAgICAgIHRoaXMuaWdub3JlR2xvYiA9IGlnbm9yZUdsb2JcbiAgICB9KSlcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci5saW50UHJldmlld1RhYnMnLCAobGludFByZXZpZXdUYWJzKSA9PiB7XG4gICAgICB0aGlzLmxpbnRQcmV2aWV3VGFicyA9IGxpbnRQcmV2aWV3VGFic1xuICAgIH0pKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLmRpc2FibGVkUHJvdmlkZXJzJywgKGRpc2FibGVkUHJvdmlkZXJzKSA9PiB7XG4gICAgICB0aGlzLmRpc2FibGVkUHJvdmlkZXJzID0gZGlzYWJsZWRQcm92aWRlcnNcbiAgICB9KSlcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuZW1pdHRlcilcbiAgfVxuICBoYXNMaW50ZXIobGludGVyOiBMaW50ZXIpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5saW50ZXJzLmhhcyhsaW50ZXIpXG4gIH1cbiAgYWRkTGludGVyKGxpbnRlcjogTGludGVyLCBsZWdhY3k6IGJvb2xlYW4gPSBmYWxzZSkge1xuICAgIGNvbnN0IHZlcnNpb24gPSBsZWdhY3kgPyAxIDogMlxuICAgIGlmICghVmFsaWRhdGUubGludGVyKGxpbnRlciwgdmVyc2lvbikpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBsaW50ZXJbJGFjdGl2YXRlZF0gPSB0cnVlXG4gICAgaWYgKHR5cGVvZiBsaW50ZXJbJHJlcXVlc3RMYXRlc3RdID09PSAndW5kZWZpbmVkJykge1xuICAgICAgbGludGVyWyRyZXF1ZXN0TGF0ZXN0XSA9IDBcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBsaW50ZXJbJHJlcXVlc3RMYXN0UmVjZWl2ZWRdID09PSAndW5kZWZpbmVkJykge1xuICAgICAgbGludGVyWyRyZXF1ZXN0TGFzdFJlY2VpdmVkXSA9IDBcbiAgICB9XG4gICAgbGludGVyWyR2ZXJzaW9uXSA9IHZlcnNpb25cbiAgICB0aGlzLmxpbnRlcnMuYWRkKGxpbnRlcilcbiAgfVxuICBnZXRQcm92aWRlcnMoKTogQXJyYXk8TGludGVyPiB7XG4gICAgcmV0dXJuIEFycmF5LmZyb20odGhpcy5saW50ZXJzKVxuICB9XG4gIGRlbGV0ZUxpbnRlcihsaW50ZXI6IExpbnRlcikge1xuICAgIGlmICghdGhpcy5saW50ZXJzLmhhcyhsaW50ZXIpKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgbGludGVyWyRhY3RpdmF0ZWRdID0gZmFsc2VcbiAgICB0aGlzLmxpbnRlcnMuZGVsZXRlKGxpbnRlcilcbiAgfVxuICBhc3luYyBsaW50KHsgb25DaGFuZ2UsIGVkaXRvciB9IDogeyBvbkNoYW5nZTogYm9vbGVhbiwgZWRpdG9yOiBUZXh0RWRpdG9yIH0pOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zdCBmaWxlUGF0aCA9IGVkaXRvci5nZXRQYXRoKClcblxuICAgIGlmIChcbiAgICAgIChvbkNoYW5nZSAmJiAhdGhpcy5saW50T25DaGFuZ2UpIHx8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIExpbnQtb24tY2hhbmdlIG1pc21hdGNoXG4gICAgICAhZmlsZVBhdGggfHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBOb3Qgc2F2ZWQgYW55d2hlcmUgeWV0XG4gICAgICBIZWxwZXJzLmlzUGF0aElnbm9yZWQoZWRpdG9yLmdldFBhdGgoKSwgdGhpcy5pZ25vcmVHbG9iLCB0aGlzLmlnbm9yZVZDUykgfHwgICAgICAgICAgICAgICAvLyBJZ25vcmVkIGJ5IFZDUyBvciBHbG9iXG4gICAgICAoIXRoaXMubGludFByZXZpZXdUYWJzICYmIGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKS5nZXRQZW5kaW5nSXRlbSgpID09PSBlZGl0b3IpICAgICAvLyBJZ25vcmUgUHJldmlldyB0YWJzXG4gICAgKSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICBjb25zdCBzY29wZXMgPSBIZWxwZXJzLmdldEVkaXRvckN1cnNvclNjb3BlcyhlZGl0b3IpXG5cbiAgICBjb25zdCBwcm9taXNlcyA9IFtdXG4gICAgZm9yIChjb25zdCBsaW50ZXIgb2YgdGhpcy5saW50ZXJzKSB7XG4gICAgICBpZiAoIUhlbHBlcnMuc2hvdWxkVHJpZ2dlckxpbnRlcihsaW50ZXIsIG9uQ2hhbmdlLCBzY29wZXMpKSB7XG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG4gICAgICBpZiAodGhpcy5kaXNhYmxlZFByb3ZpZGVycy5pbmNsdWRlcyhsaW50ZXIubmFtZSkpIHtcbiAgICAgICAgY29udGludWVcbiAgICAgIH1cbiAgICAgIGNvbnN0IG51bWJlciA9ICsrbGludGVyWyRyZXF1ZXN0TGF0ZXN0XVxuICAgICAgY29uc3Qgc3RhdHVzQnVmZmVyID0gbGludGVyLnNjb3BlID09PSAnZmlsZScgPyBlZGl0b3IuZ2V0QnVmZmVyKCkgOiBudWxsXG4gICAgICBjb25zdCBzdGF0dXNGaWxlUGF0aCA9IGxpbnRlci5zY29wZSA9PT0gJ2ZpbGUnID8gZmlsZVBhdGggOiBudWxsXG5cbiAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtYmVnaW4tbGludGluZycsIHsgbnVtYmVyLCBsaW50ZXIsIGZpbGVQYXRoOiBzdGF0dXNGaWxlUGF0aCB9KVxuICAgICAgcHJvbWlzZXMucHVzaChuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlKSB7XG4gICAgICAgIC8vICRGbG93SWdub3JlOiBUeXBlIHRvbyBjb21wbGV4LCBkdWhcbiAgICAgICAgcmVzb2x2ZShsaW50ZXIubGludChlZGl0b3IpKVxuICAgICAgfSkudGhlbigobWVzc2FnZXMpID0+IHtcbiAgICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1maW5pc2gtbGludGluZycsIHsgbnVtYmVyLCBsaW50ZXIsIGZpbGVQYXRoOiBzdGF0dXNGaWxlUGF0aCB9KVxuICAgICAgICBpZiAobGludGVyWyRyZXF1ZXN0TGFzdFJlY2VpdmVkXSA+PSBudW1iZXIgfHwgIWxpbnRlclskYWN0aXZhdGVkXSB8fCAoc3RhdHVzQnVmZmVyICYmICFzdGF0dXNCdWZmZXIuaXNBbGl2ZSgpKSkge1xuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIGxpbnRlclskcmVxdWVzdExhc3RSZWNlaXZlZF0gPSBudW1iZXJcbiAgICAgICAgaWYgKHN0YXR1c0J1ZmZlciAmJiAhc3RhdHVzQnVmZmVyLmlzQWxpdmUoKSkge1xuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG1lc3NhZ2VzID09PSBudWxsKSB7XG4gICAgICAgICAgLy8gTk9URTogRG8gTk9UIHVwZGF0ZSB0aGUgbWVzc2FnZXMgd2hlbiBwcm92aWRlcnMgcmV0dXJuIG51bGxcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIGxldCB2YWxpZGl0eSA9IHRydWVcbiAgICAgICAgLy8gTk9URTogV2UgYXJlIGNhbGxpbmcgaXQgd2hlbiByZXN1bHRzIGFyZSBub3QgYW4gYXJyYXkgdG8gc2hvdyBhIG5pY2Ugbm90aWZpY2F0aW9uXG4gICAgICAgIGlmIChhdG9tLmluRGV2TW9kZSgpIHx8ICFBcnJheS5pc0FycmF5KG1lc3NhZ2VzKSkge1xuICAgICAgICAgIHZhbGlkaXR5ID0gbGludGVyWyR2ZXJzaW9uXSA9PT0gMiA/IFZhbGlkYXRlLm1lc3NhZ2VzKGxpbnRlci5uYW1lLCBtZXNzYWdlcykgOiBWYWxpZGF0ZS5tZXNzYWdlc0xlZ2FjeShsaW50ZXIubmFtZSwgbWVzc2FnZXMpXG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF2YWxpZGl0eSkge1xuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGxpbnRlclskdmVyc2lvbl0gPT09IDIpIHtcbiAgICAgICAgICBIZWxwZXJzLm5vcm1hbGl6ZU1lc3NhZ2VzKGxpbnRlci5uYW1lLCBtZXNzYWdlcylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBIZWxwZXJzLm5vcm1hbGl6ZU1lc3NhZ2VzTGVnYWN5KGxpbnRlci5uYW1lLCBtZXNzYWdlcylcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLXVwZGF0ZS1tZXNzYWdlcycsIHsgbWVzc2FnZXMsIGxpbnRlciwgYnVmZmVyOiBzdGF0dXNCdWZmZXIgfSlcbiAgICAgIH0sIChlcnJvcikgPT4ge1xuICAgICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWZpbmlzaC1saW50aW5nJywgeyBudW1iZXIsIGxpbnRlciwgZmlsZVBhdGg6IHN0YXR1c0ZpbGVQYXRoIH0pXG4gICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihgW0xpbnRlcl0gRXJyb3IgcnVubmluZyAke2xpbnRlci5uYW1lfWAsIHtcbiAgICAgICAgICBkZXRhaWw6ICdTZWUgQ29uc29sZSBmb3IgbW9yZSBpbmZvLiAoT3BlbiBWaWV3IC0+IERldmVsb3BlciAtPiBUb2dnbGUgRGV2ZWxvcGVyIFRvb2xzKScsXG4gICAgICAgIH0pXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoYFtMaW50ZXJdIEVycm9yIHJ1bm5pbmcgJHtsaW50ZXIubmFtZX1gLCBlcnJvcilcbiAgICAgIH0pKVxuICAgIH1cblxuICAgIGF3YWl0IFByb21pc2UuYWxsKHByb21pc2VzKVxuICAgIHJldHVybiB0cnVlXG4gIH1cbiAgb25EaWRVcGRhdGVNZXNzYWdlcyhjYWxsYmFjazogRnVuY3Rpb24pOiBEaXNwb3NhYmxlIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtdXBkYXRlLW1lc3NhZ2VzJywgY2FsbGJhY2spXG4gIH1cbiAgb25EaWRCZWdpbkxpbnRpbmcoY2FsbGJhY2s6IEZ1bmN0aW9uKTogRGlzcG9zYWJsZSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLWJlZ2luLWxpbnRpbmcnLCBjYWxsYmFjaylcbiAgfVxuICBvbkRpZEZpbmlzaExpbnRpbmcoY2FsbGJhY2s6IEZ1bmN0aW9uKTogRGlzcG9zYWJsZSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLWZpbmlzaC1saW50aW5nJywgY2FsbGJhY2spXG4gIH1cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLmxpbnRlcnMuY2xlYXIoKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IExpbnRlclJlZ2lzdHJ5XG4iXX0=