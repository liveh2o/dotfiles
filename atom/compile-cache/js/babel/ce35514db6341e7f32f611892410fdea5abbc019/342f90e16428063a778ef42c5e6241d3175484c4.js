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
              detail: 'See Console for more info. (Open View -> Developer -> Toogle Developer Tools)'
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL2xpbnRlci1yZWdpc3RyeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O29CQUc2QyxNQUFNOzt1QkFHMUIsV0FBVzs7SUFBeEIsT0FBTzs7d0JBQ08sWUFBWTs7SUFBMUIsUUFBUTs7SUFJZCxjQUFjO0FBVVAsV0FWUCxjQUFjLEdBVUo7OzswQkFWVixjQUFjOztBQVdoQixRQUFJLENBQUMsT0FBTyxHQUFHLG1CQUFhLENBQUE7QUFDNUIsUUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBO0FBQ3hCLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7O0FBRTlDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLHFCQUFxQixFQUFFLFVBQUMsWUFBWSxFQUFLO0FBQ2xGLFlBQUssWUFBWSxHQUFHLFlBQVksQ0FBQTtLQUNqQyxDQUFDLENBQUMsQ0FBQTtBQUNILFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLDZCQUE2QixFQUFFLFVBQUMsU0FBUyxFQUFLO0FBQ3ZGLFlBQUssU0FBUyxHQUFHLFNBQVMsQ0FBQTtLQUMzQixDQUFDLENBQUMsQ0FBQTtBQUNILFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLG1CQUFtQixFQUFFLFVBQUMsVUFBVSxFQUFLO0FBQzlFLFlBQUssVUFBVSxHQUFHLFVBQVUsQ0FBQTtLQUM3QixDQUFDLENBQUMsQ0FBQTtBQUNILFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLHdCQUF3QixFQUFFLFVBQUMsZUFBZSxFQUFLO0FBQ3hGLFlBQUssZUFBZSxHQUFHLGVBQWUsQ0FBQTtL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OzttQ0FLYixTQUFRO1NBK0NYOztBQUVELGNBQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUMzQixlQUFPLElBQUksQ0FBQTtPQUNaO0tBQUE7OztXQUNrQiw2QkFBQyxRQUFrQixFQUFjO0FBQ2xELGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMscUJBQXFCLEVBQUUsUUFBUSxDQUFDLENBQUE7S0FDeEQ7OztXQUNnQiwyQkFBQyxRQUFrQixFQUFjO0FBQ2hELGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsbUJBQW1CLEVBQUUsUUFBUSxDQUFDLENBQUE7S0FDdEQ7OztXQUNpQiw0QkFBQyxRQUFrQixFQUFjO0FBQ2pELGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsb0JBQW9CLEVBQUUsUUFBUSxDQUFDLENBQUE7S0FDdkQ7OztXQUNNLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQTtBQUNwQixVQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFBO0tBQzdCOzs7U0FoSkcsY0FBYzs7O0FBbUpwQixNQUFNLENBQUMsT0FBTyxHQUFHLGNBQWMsQ0FBQSIsImZpbGUiOiIvVXNlcnMvYWgvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi9saW50ZXItcmVnaXN0cnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuLyogZXNsaW50LWRpc2FibGUgaW1wb3J0L25vLWR1cGxpY2F0ZXMgKi9cblxuaW1wb3J0IHsgRW1pdHRlciwgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nXG5pbXBvcnQgdHlwZSB7IFRleHRFZGl0b3IsIERpc3Bvc2FibGUgfSBmcm9tICdhdG9tJ1xuXG5pbXBvcnQgKiBhcyBIZWxwZXJzIGZyb20gJy4vaGVscGVycydcbmltcG9ydCAqIGFzIFZhbGlkYXRlIGZyb20gJy4vdmFsaWRhdGUnXG5pbXBvcnQgeyAkdmVyc2lvbiwgJGFjdGl2YXRlZCwgJHJlcXVlc3RMYXRlc3QsICRyZXF1ZXN0TGFzdFJlY2VpdmVkIH0gZnJvbSAnLi9oZWxwZXJzJ1xuaW1wb3J0IHR5cGUgeyBMaW50ZXIgfSBmcm9tICcuL3R5cGVzJ1xuXG5jbGFzcyBMaW50ZXJSZWdpc3RyeSB7XG4gIGVtaXR0ZXI6IEVtaXR0ZXI7XG4gIGxpbnRlcnM6IFNldDxMaW50ZXI+O1xuICBsaW50T25DaGFuZ2U6IGJvb2xlYW47XG4gIGlnbm9yZVZDUzogYm9vbGVhbjtcbiAgaWdub3JlR2xvYjogc3RyaW5nO1xuICBsaW50UHJldmlld1RhYnM6IGJvb2xlYW47XG4gIHN1YnNjcmlwdGlvbnM6IENvbXBvc2l0ZURpc3Bvc2FibGU7XG4gIGRpc2FibGVkUHJvdmlkZXJzOiBBcnJheTxzdHJpbmc+O1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKClcbiAgICB0aGlzLmxpbnRlcnMgPSBuZXcgU2V0KClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci5saW50T25DaGFuZ2UnLCAobGludE9uQ2hhbmdlKSA9PiB7XG4gICAgICB0aGlzLmxpbnRPbkNoYW5nZSA9IGxpbnRPbkNoYW5nZVxuICAgIH0pKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnY29yZS5leGNsdWRlVmNzSWdub3JlZFBhdGhzJywgKGlnbm9yZVZDUykgPT4ge1xuICAgICAgdGhpcy5pZ25vcmVWQ1MgPSBpZ25vcmVWQ1NcbiAgICB9KSlcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci5pZ25vcmVHbG9iJywgKGlnbm9yZUdsb2IpID0+IHtcbiAgICAgIHRoaXMuaWdub3JlR2xvYiA9IGlnbm9yZUdsb2JcbiAgICB9KSlcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci5saW50UHJldmlld1RhYnMnLCAobGludFByZXZpZXdUYWJzKSA9PiB7XG4gICAgICB0aGlzLmxpbnRQcmV2aWV3VGFicyA9IGxpbnRQcmV2aWV3VGFic1xuICAgIH0pKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLmRpc2FibGVkUHJvdmlkZXJzJywgKGRpc2FibGVkUHJvdmlkZXJzKSA9PiB7XG4gICAgICB0aGlzLmRpc2FibGVkUHJvdmlkZXJzID0gZGlzYWJsZWRQcm92aWRlcnNcbiAgICB9KSlcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuZW1pdHRlcilcbiAgfVxuICBoYXNMaW50ZXIobGludGVyOiBMaW50ZXIpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5saW50ZXJzLmhhcyhsaW50ZXIpXG4gIH1cbiAgYWRkTGludGVyKGxpbnRlcjogTGludGVyLCBsZWdhY3k6IGJvb2xlYW4gPSBmYWxzZSkge1xuICAgIGNvbnN0IHZlcnNpb24gPSBsZWdhY3kgPyAxIDogMlxuICAgIGlmICghVmFsaWRhdGUubGludGVyKGxpbnRlciwgdmVyc2lvbikpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBsaW50ZXJbJGFjdGl2YXRlZF0gPSB0cnVlXG4gICAgaWYgKHR5cGVvZiBsaW50ZXJbJHJlcXVlc3RMYXRlc3RdID09PSAndW5kZWZpbmVkJykge1xuICAgICAgbGludGVyWyRyZXF1ZXN0TGF0ZXN0XSA9IDBcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBsaW50ZXJbJHJlcXVlc3RMYXN0UmVjZWl2ZWRdID09PSAndW5kZWZpbmVkJykge1xuICAgICAgbGludGVyWyRyZXF1ZXN0TGFzdFJlY2VpdmVkXSA9IDBcbiAgICB9XG4gICAgbGludGVyWyR2ZXJzaW9uXSA9IHZlcnNpb25cbiAgICB0aGlzLmxpbnRlcnMuYWRkKGxpbnRlcilcbiAgfVxuICBnZXRMaW50ZXJzKCk6IEFycmF5PExpbnRlcj4ge1xuICAgIHJldHVybiBBcnJheS5mcm9tKHRoaXMubGludGVycylcbiAgfVxuICBkZWxldGVMaW50ZXIobGludGVyOiBMaW50ZXIpIHtcbiAgICBpZiAoIXRoaXMubGludGVycy5oYXMobGludGVyKSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGxpbnRlclskYWN0aXZhdGVkXSA9IGZhbHNlXG4gICAgdGhpcy5saW50ZXJzLmRlbGV0ZShsaW50ZXIpXG4gIH1cbiAgYXN5bmMgbGludCh7IG9uQ2hhbmdlLCBlZGl0b3IgfSA6IHsgb25DaGFuZ2U6IGJvb2xlYW4sIGVkaXRvcjogVGV4dEVkaXRvciB9KTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgZmlsZVBhdGggPSBlZGl0b3IuZ2V0UGF0aCgpXG5cbiAgICBpZiAoXG4gICAgICAob25DaGFuZ2UgJiYgIXRoaXMubGludE9uQ2hhbmdlKSB8fCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBMaW50LW9uLWNoYW5nZSBtaXNtYXRjaFxuICAgICAgIWZpbGVQYXRoIHx8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTm90IHNhdmVkIGFueXdoZXJlIHlldFxuICAgICAgSGVscGVycy5pc1BhdGhJZ25vcmVkKGVkaXRvci5nZXRQYXRoKCksIHRoaXMuaWdub3JlR2xvYiwgdGhpcy5pZ25vcmVWQ1MpIHx8ICAgICAgICAgICAgICAgLy8gSWdub3JlZCBieSBWQ1Mgb3IgR2xvYlxuICAgICAgKCF0aGlzLmxpbnRQcmV2aWV3VGFicyAmJiBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKCkuZ2V0UGVuZGluZ0l0ZW0oKSA9PT0gZWRpdG9yKSAgICAgLy8gSWdub3JlIFByZXZpZXcgdGFic1xuICAgICkge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG4gICAgY29uc3Qgc2NvcGVzID0gSGVscGVycy5nZXRFZGl0b3JDdXJzb3JTY29wZXMoZWRpdG9yKVxuXG4gICAgY29uc3QgcHJvbWlzZXMgPSBbXVxuICAgIGZvciAoY29uc3QgbGludGVyIG9mIHRoaXMubGludGVycykge1xuICAgICAgaWYgKCFIZWxwZXJzLnNob3VsZFRyaWdnZXJMaW50ZXIobGludGVyLCBvbkNoYW5nZSwgc2NvcGVzKSkge1xuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuICAgICAgaWYgKHRoaXMuZGlzYWJsZWRQcm92aWRlcnMuaW5jbHVkZXMobGludGVyLm5hbWUpKSB7XG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG4gICAgICBjb25zdCBudW1iZXIgPSArK2xpbnRlclskcmVxdWVzdExhdGVzdF1cbiAgICAgIGNvbnN0IHN0YXR1c0J1ZmZlciA9IGxpbnRlci5zY29wZSA9PT0gJ2ZpbGUnID8gZWRpdG9yLmdldEJ1ZmZlcigpIDogbnVsbFxuICAgICAgY29uc3Qgc3RhdHVzRmlsZVBhdGggPSBsaW50ZXIuc2NvcGUgPT09ICdmaWxlJyA/IGZpbGVQYXRoIDogbnVsbFxuXG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWJlZ2luLWxpbnRpbmcnLCB7IG51bWJlciwgbGludGVyLCBmaWxlUGF0aDogc3RhdHVzRmlsZVBhdGggfSlcbiAgICAgIHByb21pc2VzLnB1c2gobmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xuICAgICAgICAvLyAkRmxvd0lnbm9yZTogVHlwZSB0b28gY29tcGxleCwgZHVoXG4gICAgICAgIHJlc29sdmUobGludGVyLmxpbnQoZWRpdG9yKSlcbiAgICAgIH0pLnRoZW4oKG1lc3NhZ2VzKSA9PiB7XG4gICAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtZmluaXNoLWxpbnRpbmcnLCB7IG51bWJlciwgbGludGVyLCBmaWxlUGF0aDogc3RhdHVzRmlsZVBhdGggfSlcbiAgICAgICAgaWYgKGxpbnRlclskcmVxdWVzdExhc3RSZWNlaXZlZF0gPj0gbnVtYmVyIHx8ICFsaW50ZXJbJGFjdGl2YXRlZF0gfHwgKHN0YXR1c0J1ZmZlciAmJiAhc3RhdHVzQnVmZmVyLmlzQWxpdmUoKSkpIHtcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICBsaW50ZXJbJHJlcXVlc3RMYXN0UmVjZWl2ZWRdID0gbnVtYmVyXG4gICAgICAgIGlmIChzdGF0dXNCdWZmZXIgJiYgIXN0YXR1c0J1ZmZlci5pc0FsaXZlKCkpIHtcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtZXNzYWdlcyA9PT0gbnVsbCkge1xuICAgICAgICAgIC8vIE5PVEU6IERvIE5PVCB1cGRhdGUgdGhlIG1lc3NhZ2VzIHdoZW4gcHJvdmlkZXJzIHJldHVybiBudWxsXG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBsZXQgdmFsaWRpdHkgPSB0cnVlXG4gICAgICAgIC8vIE5PVEU6IFdlIGFyZSBjYWxsaW5nIGl0IHdoZW4gcmVzdWx0cyBhcmUgbm90IGFuIGFycmF5IHRvIHNob3cgYSBuaWNlIG5vdGlmaWNhdGlvblxuICAgICAgICBpZiAoYXRvbS5pbkRldk1vZGUoKSB8fCAhQXJyYXkuaXNBcnJheShtZXNzYWdlcykpIHtcbiAgICAgICAgICB2YWxpZGl0eSA9IGxpbnRlclskdmVyc2lvbl0gPT09IDIgPyBWYWxpZGF0ZS5tZXNzYWdlcyhsaW50ZXIubmFtZSwgbWVzc2FnZXMpIDogVmFsaWRhdGUubWVzc2FnZXNMZWdhY3kobGludGVyLm5hbWUsIG1lc3NhZ2VzKVxuICAgICAgICB9XG4gICAgICAgIGlmICghdmFsaWRpdHkpIHtcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChsaW50ZXJbJHZlcnNpb25dID09PSAyKSB7XG4gICAgICAgICAgSGVscGVycy5ub3JtYWxpemVNZXNzYWdlcyhsaW50ZXIubmFtZSwgbWVzc2FnZXMpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgSGVscGVycy5ub3JtYWxpemVNZXNzYWdlc0xlZ2FjeShsaW50ZXIubmFtZSwgbWVzc2FnZXMpXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC11cGRhdGUtbWVzc2FnZXMnLCB7IG1lc3NhZ2VzLCBsaW50ZXIsIGJ1ZmZlcjogc3RhdHVzQnVmZmVyIH0pXG4gICAgICB9LCAoZXJyb3IpID0+IHtcbiAgICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1maW5pc2gtbGludGluZycsIHsgbnVtYmVyLCBsaW50ZXIsIGZpbGVQYXRoOiBzdGF0dXNGaWxlUGF0aCB9KVxuICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoYFtMaW50ZXJdIEVycm9yIHJ1bm5pbmcgJHtsaW50ZXIubmFtZX1gLCB7XG4gICAgICAgICAgZGV0YWlsOiAnU2VlIENvbnNvbGUgZm9yIG1vcmUgaW5mby4gKE9wZW4gVmlldyAtPiBEZXZlbG9wZXIgLT4gVG9vZ2xlIERldmVsb3BlciBUb29scyknLFxuICAgICAgICB9KVxuICAgICAgICBjb25zb2xlLmVycm9yKGBbTGludGVyXSBFcnJvciBydW5uaW5nICR7bGludGVyLm5hbWV9YCwgZXJyb3IpXG4gICAgICB9KSlcbiAgICB9XG5cbiAgICBhd2FpdCBQcm9taXNlLmFsbChwcm9taXNlcylcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG4gIG9uRGlkVXBkYXRlTWVzc2FnZXMoY2FsbGJhY2s6IEZ1bmN0aW9uKTogRGlzcG9zYWJsZSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLXVwZGF0ZS1tZXNzYWdlcycsIGNhbGxiYWNrKVxuICB9XG4gIG9uRGlkQmVnaW5MaW50aW5nKGNhbGxiYWNrOiBGdW5jdGlvbik6IERpc3Bvc2FibGUge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC1iZWdpbi1saW50aW5nJywgY2FsbGJhY2spXG4gIH1cbiAgb25EaWRGaW5pc2hMaW50aW5nKGNhbGxiYWNrOiBGdW5jdGlvbik6IERpc3Bvc2FibGUge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC1maW5pc2gtbGludGluZycsIGNhbGxiYWNrKVxuICB9XG4gIGRpc3Bvc2UoKSB7XG4gICAgdGhpcy5saW50ZXJzLmNsZWFyKClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBMaW50ZXJSZWdpc3RyeVxuIl19