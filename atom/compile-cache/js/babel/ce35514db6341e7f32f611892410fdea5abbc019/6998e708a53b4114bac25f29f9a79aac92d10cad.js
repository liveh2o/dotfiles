Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _disposableEvent = require('disposable-event');

var _disposableEvent2 = _interopRequireDefault(_disposableEvent);

var _sbEventKit = require('sb-event-kit');

var _helpers = require('./helpers');

// NOTE:
// We don't *need* to add the intentions:hide command
// But we're doing it anyway because it helps us keep the code clean
// And can also be used by any other package to fully control this package

// List of core commands we allow during the list, everything else closes it
var CORE_COMMANDS = new Set(['core:move-up', 'core:move-down', 'core:page-up', 'core:page-down', 'core:move-to-top', 'core:move-to-bottom']);

var Commands = (function () {
  function Commands() {
    _classCallCheck(this, Commands);

    this.active = null;
    this.emitter = new _sbEventKit.Emitter();
    this.subscriptions = new _sbEventKit.CompositeDisposable();

    this.subscriptions.add(this.emitter);
  }

  _createClass(Commands, [{
    key: 'activate',
    value: function activate() {
      var _this = this;

      this.subscriptions.add(atom.commands.add('atom-text-editor:not([mini])', {
        'intentions:show': function intentionsShow(e) {
          if (_this.active && _this.active.type === 'list') {
            return;
          }
          _this.processListShow();

          if (!e.originalEvent || e.originalEvent.type !== 'keydown') {
            return;
          }

          setImmediate(function () {
            var matched = true;
            var subscriptions = new _sbEventKit.CompositeDisposable();

            subscriptions.add(atom.keymaps.onDidMatchBinding(function (_ref) {
              var binding = _ref.binding;

              matched = matched && CORE_COMMANDS.has(binding.command);
            }));
            subscriptions.add((0, _disposableEvent2['default'])(document.body, 'keyup', function () {
              if (matched) {
                return;
              }
              subscriptions.dispose();
              _this.subscriptions.remove(subscriptions);
              _this.processListHide();
            }));
            _this.subscriptions.add(subscriptions);
          });
        },
        'intentions:hide': function intentionsHide() {
          _this.processListHide();
        },
        'intentions:highlight': function intentionsHighlight(e) {
          if (_this.active && _this.active.type === 'highlight') {
            return;
          }
          _this.processHighlightsShow();

          if (!e.originalEvent || e.originalEvent.type !== 'keydown') {
            return;
          }
          var keyCode = e.originalEvent.keyCode;
          var subscriptions = (0, _disposableEvent2['default'])(document.body, 'keyup', function (upE) {
            if (upE.keyCode !== keyCode) {
              return;
            }
            subscriptions.dispose();
            _this.subscriptions.remove(subscriptions);
            _this.processHighlightsHide();
          });
          _this.subscriptions.add(subscriptions);
        }
      }));
      this.subscriptions.add(atom.commands.add('atom-text-editor.intentions-list:not([mini])', {
        'intentions:confirm': (0, _helpers.stoppingEvent)(function () {
          _this.processListConfirm();
        }),
        'core:move-up': (0, _helpers.stoppingEvent)(function () {
          _this.processListMove('up');
        }),
        'core:move-down': (0, _helpers.stoppingEvent)(function () {
          _this.processListMove('down');
        }),
        'core:page-up': (0, _helpers.stoppingEvent)(function () {
          _this.processListMove('page-up');
        }),
        'core:page-down': (0, _helpers.stoppingEvent)(function () {
          _this.processListMove('page-down');
        }),
        'core:move-to-top': (0, _helpers.stoppingEvent)(function () {
          _this.processListMove('move-to-top');
        }),
        'core:move-to-bottom': (0, _helpers.stoppingEvent)(function () {
          _this.processListMove('move-to-bottom');
        })
      }));
    }
  }, {
    key: 'processListShow',
    value: _asyncToGenerator(function* () {
      var _this2 = this;

      if (this.active) {
        switch (this.active.type) {
          case 'list':
            throw new Error('Already active');
          case 'highlight':
            this.processHighlightsHide();
            break;
          default:
        }
      }
      var editor = atom.workspace.getActiveTextEditor();
      var editorElement = atom.views.getView(editor);
      var subscriptions = new _sbEventKit.CompositeDisposable();

      if (!(yield this.shouldListShow(editor))) {
        return;
      }
      this.active = { type: 'list', subscriptions: subscriptions };
      subscriptions.add(new _sbEventKit.Disposable(function () {
        if (_this2.active && _this2.active.type === 'list' && _this2.active.subscriptions === subscriptions) {
          _this2.processListHide();
          _this2.active = null;
        }
        editorElement.classList.remove('intentions-list');
      }));
      subscriptions.add((0, _disposableEvent2['default'])(document.body, 'mouseup', function () {
        subscriptions.dispose();
      }));
      editorElement.classList.add('intentions-list');
    })
  }, {
    key: 'processListHide',
    value: function processListHide() {
      if (!this.active || this.active.type !== 'list') {
        return;
      }
      var subscriptions = this.active.subscriptions;
      this.active = null;
      subscriptions.dispose();
      this.emitter.emit('list-hide');
    }
  }, {
    key: 'processListMove',
    value: function processListMove(movement) {
      if (!this.active || this.active.type !== 'list') {
        return;
      }
      this.emitter.emit('list-move', movement);
    }
  }, {
    key: 'processListConfirm',
    value: function processListConfirm() {
      if (!this.active || this.active.type !== 'list') {
        return;
      }
      this.emitter.emit('list-confirm');
    }
  }, {
    key: 'processHighlightsShow',
    value: _asyncToGenerator(function* () {
      var _this3 = this;

      if (this.active) {
        switch (this.active.type) {
          case 'highlight':
            throw new Error('Already active');
          case 'list':
            this.processListHide();
            break;
          default:
        }
      }
      var editor = atom.workspace.getActiveTextEditor();
      var editorElement = atom.views.getView(editor);
      var subscriptions = new _sbEventKit.CompositeDisposable();
      var shouldProcess = yield this.shouldHighlightsShow(editor);

      if (!shouldProcess) {
        return;
      }
      this.active = { type: 'highlight', subscriptions: subscriptions };
      subscriptions.add(new _sbEventKit.Disposable(function () {
        if (_this3.active && _this3.active.type === 'highlight' && _this3.active.subscriptions === subscriptions) {
          _this3.processHighlightsHide();
        }
        editorElement.classList.remove('intentions-highlights');
      }));
      editorElement.classList.add('intentions-highlights');
    })
  }, {
    key: 'processHighlightsHide',
    value: function processHighlightsHide() {
      if (!this.active || this.active.type !== 'highlight') {
        return;
      }
      var subscriptions = this.active.subscriptions;
      this.active = null;
      subscriptions.dispose();
      this.emitter.emit('highlights-hide');
    }
  }, {
    key: 'shouldListShow',
    value: _asyncToGenerator(function* (editor) {
      var event = { show: false, editor: editor };
      yield this.emitter.emit('list-show', event);
      return event.show;
    })
  }, {
    key: 'shouldHighlightsShow',
    value: _asyncToGenerator(function* (editor) {
      var event = { show: false, editor: editor };
      yield this.emitter.emit('highlights-show', event);
      return event.show;
    })
  }, {
    key: 'onListShow',
    value: function onListShow(callback) {
      return this.emitter.on('list-show', function (event) {
        return callback(event.editor).then(function (result) {
          event.show = !!result;
        });
      });
    }
  }, {
    key: 'onListHide',
    value: function onListHide(callback) {
      return this.emitter.on('list-hide', callback);
    }
  }, {
    key: 'onListMove',
    value: function onListMove(callback) {
      return this.emitter.on('list-move', callback);
    }
  }, {
    key: 'onListConfirm',
    value: function onListConfirm(callback) {
      return this.emitter.on('list-confirm', callback);
    }
  }, {
    key: 'onHighlightsShow',
    value: function onHighlightsShow(callback) {
      return this.emitter.on('highlights-show', function (event) {
        return callback(event.editor).then(function (result) {
          event.show = !!result;
        });
      });
    }
  }, {
    key: 'onHighlightsHide',
    value: function onHighlightsHide(callback) {
      return this.emitter.on('highlights-hide', callback);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
      if (this.active) {
        this.active.subscriptions.dispose();
      }
    }
  }]);

  return Commands;
})();

exports['default'] = Commands;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9pbnRlbnRpb25zL2xpYi9jb21tYW5kcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7K0JBRTRCLGtCQUFrQjs7OzswQkFDVyxjQUFjOzt1QkFHekMsV0FBVzs7Ozs7Ozs7QUFTekMsSUFBTSxhQUFhLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxjQUFjLEVBQUUsZ0JBQWdCLEVBQUUsY0FBYyxFQUFFLGdCQUFnQixFQUFFLGtCQUFrQixFQUFFLHFCQUFxQixDQUFDLENBQUMsQ0FBQTs7SUFFekgsUUFBUTtBQVFoQixXQVJRLFFBQVEsR0FRYjswQkFSSyxRQUFROztBQVN6QixRQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQTtBQUNsQixRQUFJLENBQUMsT0FBTyxHQUFHLHlCQUFhLENBQUE7QUFDNUIsUUFBSSxDQUFDLGFBQWEsR0FBRyxxQ0FBeUIsQ0FBQTs7QUFFOUMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0dBQ3JDOztlQWRrQixRQUFROztXQWVuQixvQkFBRzs7O0FBQ1QsVUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsOEJBQThCLEVBQUU7QUFDdkUseUJBQWlCLEVBQUUsd0JBQUMsQ0FBQyxFQUFLO0FBQ3hCLGNBQUksTUFBSyxNQUFNLElBQUksTUFBSyxNQUFNLENBQUMsSUFBSSxLQUFLLE1BQU0sRUFBRTtBQUM5QyxtQkFBTTtXQUNQO0FBQ0QsZ0JBQUssZUFBZSxFQUFFLENBQUE7O0FBRXRCLGNBQUksQ0FBQyxDQUFDLENBQUMsYUFBYSxJQUFJLENBQUMsQ0FBQyxhQUFhLENBQUMsSUFBSSxLQUFLLFNBQVMsRUFBRTtBQUMxRCxtQkFBTTtXQUNQOztBQUVELHNCQUFZLENBQUMsWUFBTTtBQUNqQixnQkFBSSxPQUFPLEdBQUcsSUFBSSxDQUFBO0FBQ2xC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LFdBQVcsRUFBRSxRQUFRLENBQUMsQ0FBQTtLQUM5Qzs7O1dBQ1ksdUJBQUMsUUFBcUIsRUFBRTtBQUNuQyxhQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLGNBQWMsRUFBRSxRQUFRLENBQUMsQ0FBQTtLQUNqRDs7O1dBQ2UsMEJBQUMsUUFBb0QsRUFBRTtBQUNyRSxhQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLGlCQUFpQixFQUFFLFVBQVMsS0FBSyxFQUFFO0FBQ3hELGVBQU8sUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBUyxNQUFNLEVBQUU7QUFDbEQsZUFBSyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFBO1NBQ3RCLENBQUMsQ0FBQTtPQUNILENBQUMsQ0FBQTtLQUNIOzs7V0FDZSwwQkFBQyxRQUFxQixFQUFFO0FBQ3RDLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsaUJBQWlCLEVBQUUsUUFBUSxDQUFDLENBQUE7S0FDcEQ7OztXQUNNLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUM1QixVQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7QUFDZixZQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtPQUNwQztLQUNGOzs7U0EvTmtCLFFBQVE7OztxQkFBUixRQUFRIiwiZmlsZSI6Ii9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9pbnRlbnRpb25zL2xpYi9jb21tYW5kcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCBkaXNwb3NhYmxlRXZlbnQgZnJvbSAnZGlzcG9zYWJsZS1ldmVudCdcbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUsIERpc3Bvc2FibGUsIEVtaXR0ZXIgfSBmcm9tICdzYi1ldmVudC1raXQnXG5pbXBvcnQgdHlwZSB7IFRleHRFZGl0b3IgfSBmcm9tICdhdG9tJ1xuXG5pbXBvcnQgeyBzdG9wcGluZ0V2ZW50IH0gZnJvbSAnLi9oZWxwZXJzJ1xuaW1wb3J0IHR5cGUgeyBMaXN0TW92ZW1lbnQgfSBmcm9tICcuL3R5cGVzJ1xuXG4vLyBOT1RFOlxuLy8gV2UgZG9uJ3QgKm5lZWQqIHRvIGFkZCB0aGUgaW50ZW50aW9uczpoaWRlIGNvbW1hbmRcbi8vIEJ1dCB3ZSdyZSBkb2luZyBpdCBhbnl3YXkgYmVjYXVzZSBpdCBoZWxwcyB1cyBrZWVwIHRoZSBjb2RlIGNsZWFuXG4vLyBBbmQgY2FuIGFsc28gYmUgdXNlZCBieSBhbnkgb3RoZXIgcGFja2FnZSB0byBmdWxseSBjb250cm9sIHRoaXMgcGFja2FnZVxuXG4vLyBMaXN0IG9mIGNvcmUgY29tbWFuZHMgd2UgYWxsb3cgZHVyaW5nIHRoZSBsaXN0LCBldmVyeXRoaW5nIGVsc2UgY2xvc2VzIGl0XG5jb25zdCBDT1JFX0NPTU1BTkRTID0gbmV3IFNldChbJ2NvcmU6bW92ZS11cCcsICdjb3JlOm1vdmUtZG93bicsICdjb3JlOnBhZ2UtdXAnLCAnY29yZTpwYWdlLWRvd24nLCAnY29yZTptb3ZlLXRvLXRvcCcsICdjb3JlOm1vdmUtdG8tYm90dG9tJ10pXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbW1hbmRzIHtcbiAgYWN0aXZlOiA/e1xuICAgIHR5cGU6ICdsaXN0JyB8ICdoaWdobGlnaHQnLFxuICAgIHN1YnNjcmlwdGlvbnM6IENvbXBvc2l0ZURpc3Bvc2FibGUsXG4gIH07XG4gIGVtaXR0ZXI6IEVtaXR0ZXI7XG4gIHN1YnNjcmlwdGlvbnM6IENvbXBvc2l0ZURpc3Bvc2FibGU7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5hY3RpdmUgPSBudWxsXG4gICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXIoKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5lbWl0dGVyKVxuICB9XG4gIGFjdGl2YXRlKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20tdGV4dC1lZGl0b3I6bm90KFttaW5pXSknLCB7XG4gICAgICAnaW50ZW50aW9uczpzaG93JzogKGUpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuYWN0aXZlICYmIHRoaXMuYWN0aXZlLnR5cGUgPT09ICdsaXN0Jykge1xuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIHRoaXMucHJvY2Vzc0xpc3RTaG93KClcblxuICAgICAgICBpZiAoIWUub3JpZ2luYWxFdmVudCB8fCBlLm9yaWdpbmFsRXZlbnQudHlwZSAhPT0gJ2tleWRvd24nKSB7XG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cblxuICAgICAgICBzZXRJbW1lZGlhdGUoKCkgPT4ge1xuICAgICAgICAgIGxldCBtYXRjaGVkID0gdHJ1ZVxuICAgICAgICAgIGNvbnN0IHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgICAgICAgICBzdWJzY3JpcHRpb25zLmFkZChhdG9tLmtleW1hcHMub25EaWRNYXRjaEJpbmRpbmcoZnVuY3Rpb24oeyBiaW5kaW5nIH0pIHtcbiAgICAgICAgICAgIG1hdGNoZWQgPSBtYXRjaGVkICYmIENPUkVfQ09NTUFORFMuaGFzKGJpbmRpbmcuY29tbWFuZClcbiAgICAgICAgICB9KSlcbiAgICAgICAgICBzdWJzY3JpcHRpb25zLmFkZChkaXNwb3NhYmxlRXZlbnQoZG9jdW1lbnQuYm9keSwgJ2tleXVwJywgKCkgPT4ge1xuICAgICAgICAgICAgaWYgKG1hdGNoZWQpIHtcbiAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgICAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLnJlbW92ZShzdWJzY3JpcHRpb25zKVxuICAgICAgICAgICAgdGhpcy5wcm9jZXNzTGlzdEhpZGUoKVxuICAgICAgICAgIH0pKVxuICAgICAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoc3Vic2NyaXB0aW9ucylcbiAgICAgICAgfSlcbiAgICAgIH0sXG4gICAgICAnaW50ZW50aW9uczpoaWRlJzogKCkgPT4ge1xuICAgICAgICB0aGlzLnByb2Nlc3NMaXN0SGlkZSgpXG4gICAgICB9LFxuICAgICAgJ2ludGVudGlvbnM6aGlnaGxpZ2h0JzogKGUpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuYWN0aXZlICYmIHRoaXMuYWN0aXZlLnR5cGUgPT09ICdoaWdobGlnaHQnKSB7XG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wcm9jZXNzSGlnaGxpZ2h0c1Nob3coKVxuXG4gICAgICAgIGlmICghZS5vcmlnaW5hbEV2ZW50IHx8IGUub3JpZ2luYWxFdmVudC50eXBlICE9PSAna2V5ZG93bicpIHtcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICBjb25zdCBrZXlDb2RlID0gZS5vcmlnaW5hbEV2ZW50LmtleUNvZGVcbiAgICAgICAgY29uc3Qgc3Vic2NyaXB0aW9ucyA9IGRpc3Bvc2FibGVFdmVudChkb2N1bWVudC5ib2R5LCAna2V5dXAnLCB1cEUgPT4ge1xuICAgICAgICAgIGlmICh1cEUua2V5Q29kZSAhPT0ga2V5Q29kZSkge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgfVxuICAgICAgICAgIHN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLnJlbW92ZShzdWJzY3JpcHRpb25zKVxuICAgICAgICAgIHRoaXMucHJvY2Vzc0hpZ2hsaWdodHNIaWRlKClcbiAgICAgICAgfSlcbiAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChzdWJzY3JpcHRpb25zKVxuICAgICAgfSxcbiAgICB9KSlcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXRleHQtZWRpdG9yLmludGVudGlvbnMtbGlzdDpub3QoW21pbmldKScsIHtcbiAgICAgICdpbnRlbnRpb25zOmNvbmZpcm0nOiBzdG9wcGluZ0V2ZW50KCgpID0+IHtcbiAgICAgICAgdGhpcy5wcm9jZXNzTGlzdENvbmZpcm0oKVxuICAgICAgfSksXG4gICAgICAnY29yZTptb3ZlLXVwJzogc3RvcHBpbmdFdmVudCgoKSA9PiB7XG4gICAgICAgIHRoaXMucHJvY2Vzc0xpc3RNb3ZlKCd1cCcpXG4gICAgICB9KSxcbiAgICAgICdjb3JlOm1vdmUtZG93bic6IHN0b3BwaW5nRXZlbnQoKCkgPT4ge1xuICAgICAgICB0aGlzLnByb2Nlc3NMaXN0TW92ZSgnZG93bicpXG4gICAgICB9KSxcbiAgICAgICdjb3JlOnBhZ2UtdXAnOiBzdG9wcGluZ0V2ZW50KCgpID0+IHtcbiAgICAgICAgdGhpcy5wcm9jZXNzTGlzdE1vdmUoJ3BhZ2UtdXAnKVxuICAgICAgfSksXG4gICAgICAnY29yZTpwYWdlLWRvd24nOiBzdG9wcGluZ0V2ZW50KCgpID0+IHtcbiAgICAgICAgdGhpcy5wcm9jZXNzTGlzdE1vdmUoJ3BhZ2UtZG93bicpXG4gICAgICB9KSxcbiAgICAgICdjb3JlOm1vdmUtdG8tdG9wJzogc3RvcHBpbmdFdmVudCgoKSA9PiB7XG4gICAgICAgIHRoaXMucHJvY2Vzc0xpc3RNb3ZlKCdtb3ZlLXRvLXRvcCcpXG4gICAgICB9KSxcbiAgICAgICdjb3JlOm1vdmUtdG8tYm90dG9tJzogc3RvcHBpbmdFdmVudCgoKSA9PiB7XG4gICAgICAgIHRoaXMucHJvY2Vzc0xpc3RNb3ZlKCdtb3ZlLXRvLWJvdHRvbScpXG4gICAgICB9KSxcbiAgICB9KSlcbiAgfVxuICBhc3luYyBwcm9jZXNzTGlzdFNob3coKSB7XG4gICAgaWYgKHRoaXMuYWN0aXZlKSB7XG4gICAgICBzd2l0Y2ggKHRoaXMuYWN0aXZlLnR5cGUpIHtcbiAgICAgICAgY2FzZSAnbGlzdCc6XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBbHJlYWR5IGFjdGl2ZScpXG4gICAgICAgIGNhc2UgJ2hpZ2hsaWdodCc6XG4gICAgICAgICAgdGhpcy5wcm9jZXNzSGlnaGxpZ2h0c0hpZGUoKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIGNvbnN0IGVkaXRvckVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcoZWRpdG9yKVxuICAgIGNvbnN0IHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgICBpZiAoIWF3YWl0IHRoaXMuc2hvdWxkTGlzdFNob3coZWRpdG9yKSkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIHRoaXMuYWN0aXZlID0geyB0eXBlOiAnbGlzdCcsIHN1YnNjcmlwdGlvbnMgfVxuICAgIHN1YnNjcmlwdGlvbnMuYWRkKG5ldyBEaXNwb3NhYmxlKCgpID0+IHtcbiAgICAgIGlmICh0aGlzLmFjdGl2ZSAmJiB0aGlzLmFjdGl2ZS50eXBlID09PSAnbGlzdCcgJiYgdGhpcy5hY3RpdmUuc3Vic2NyaXB0aW9ucyA9PT0gc3Vic2NyaXB0aW9ucykge1xuICAgICAgICB0aGlzLnByb2Nlc3NMaXN0SGlkZSgpXG4gICAgICAgIHRoaXMuYWN0aXZlID0gbnVsbFxuICAgICAgfVxuICAgICAgZWRpdG9yRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdpbnRlbnRpb25zLWxpc3QnKVxuICAgIH0pKVxuICAgIHN1YnNjcmlwdGlvbnMuYWRkKGRpc3Bvc2FibGVFdmVudChkb2N1bWVudC5ib2R5LCAnbW91c2V1cCcsIGZ1bmN0aW9uKCkge1xuICAgICAgc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICB9KSlcbiAgICBlZGl0b3JFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2ludGVudGlvbnMtbGlzdCcpXG4gIH1cbiAgcHJvY2Vzc0xpc3RIaWRlKCkge1xuICAgIGlmICghdGhpcy5hY3RpdmUgfHwgdGhpcy5hY3RpdmUudHlwZSAhPT0gJ2xpc3QnKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgY29uc3Qgc3Vic2NyaXB0aW9ucyA9IHRoaXMuYWN0aXZlLnN1YnNjcmlwdGlvbnNcbiAgICB0aGlzLmFjdGl2ZSA9IG51bGxcbiAgICBzdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdsaXN0LWhpZGUnKVxuICB9XG4gIHByb2Nlc3NMaXN0TW92ZShtb3ZlbWVudDogTGlzdE1vdmVtZW50KSB7XG4gICAgaWYgKCF0aGlzLmFjdGl2ZSB8fCB0aGlzLmFjdGl2ZS50eXBlICE9PSAnbGlzdCcpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnbGlzdC1tb3ZlJywgbW92ZW1lbnQpXG4gIH1cbiAgcHJvY2Vzc0xpc3RDb25maXJtKCkge1xuICAgIGlmICghdGhpcy5hY3RpdmUgfHwgdGhpcy5hY3RpdmUudHlwZSAhPT0gJ2xpc3QnKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2xpc3QtY29uZmlybScpXG4gIH1cbiAgYXN5bmMgcHJvY2Vzc0hpZ2hsaWdodHNTaG93KCkge1xuICAgIGlmICh0aGlzLmFjdGl2ZSkge1xuICAgICAgc3dpdGNoICh0aGlzLmFjdGl2ZS50eXBlKSB7XG4gICAgICAgIGNhc2UgJ2hpZ2hsaWdodCc6XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBbHJlYWR5IGFjdGl2ZScpXG4gICAgICAgIGNhc2UgJ2xpc3QnOlxuICAgICAgICAgIHRoaXMucHJvY2Vzc0xpc3RIaWRlKClcbiAgICAgICAgICBicmVha1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBjb25zdCBlZGl0b3JFbGVtZW50ID0gYXRvbS52aWV3cy5nZXRWaWV3KGVkaXRvcilcbiAgICBjb25zdCBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgIGNvbnN0IHNob3VsZFByb2Nlc3MgPSBhd2FpdCB0aGlzLnNob3VsZEhpZ2hsaWdodHNTaG93KGVkaXRvcilcblxuICAgIGlmICghc2hvdWxkUHJvY2Vzcykge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIHRoaXMuYWN0aXZlID0geyB0eXBlOiAnaGlnaGxpZ2h0Jywgc3Vic2NyaXB0aW9ucyB9XG4gICAgc3Vic2NyaXB0aW9ucy5hZGQobmV3IERpc3Bvc2FibGUoKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuYWN0aXZlICYmIHRoaXMuYWN0aXZlLnR5cGUgPT09ICdoaWdobGlnaHQnICYmIHRoaXMuYWN0aXZlLnN1YnNjcmlwdGlvbnMgPT09IHN1YnNjcmlwdGlvbnMpIHtcbiAgICAgICAgdGhpcy5wcm9jZXNzSGlnaGxpZ2h0c0hpZGUoKVxuICAgICAgfVxuICAgICAgZWRpdG9yRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdpbnRlbnRpb25zLWhpZ2hsaWdodHMnKVxuICAgIH0pKVxuICAgIGVkaXRvckVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnaW50ZW50aW9ucy1oaWdobGlnaHRzJylcbiAgfVxuICBwcm9jZXNzSGlnaGxpZ2h0c0hpZGUoKSB7XG4gICAgaWYgKCF0aGlzLmFjdGl2ZSB8fCB0aGlzLmFjdGl2ZS50eXBlICE9PSAnaGlnaGxpZ2h0Jykge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGNvbnN0IHN1YnNjcmlwdGlvbnMgPSB0aGlzLmFjdGl2ZS5zdWJzY3JpcHRpb25zXG4gICAgdGhpcy5hY3RpdmUgPSBudWxsXG4gICAgc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnaGlnaGxpZ2h0cy1oaWRlJylcbiAgfVxuICBhc3luYyBzaG91bGRMaXN0U2hvdyhlZGl0b3I6IFRleHRFZGl0b3IpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zdCBldmVudCA9IHsgc2hvdzogZmFsc2UsIGVkaXRvciB9XG4gICAgYXdhaXQgdGhpcy5lbWl0dGVyLmVtaXQoJ2xpc3Qtc2hvdycsIGV2ZW50KVxuICAgIHJldHVybiBldmVudC5zaG93XG4gIH1cbiAgYXN5bmMgc2hvdWxkSGlnaGxpZ2h0c1Nob3coZWRpdG9yOiBUZXh0RWRpdG9yKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgZXZlbnQgPSB7IHNob3c6IGZhbHNlLCBlZGl0b3IgfVxuICAgIGF3YWl0IHRoaXMuZW1pdHRlci5lbWl0KCdoaWdobGlnaHRzLXNob3cnLCBldmVudClcbiAgICByZXR1cm4gZXZlbnQuc2hvd1xuICB9XG4gIG9uTGlzdFNob3coY2FsbGJhY2s6ICgoZWRpdG9yOiBUZXh0RWRpdG9yKSA9PiBQcm9taXNlPGJvb2xlYW4+KSkge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2xpc3Qtc2hvdycsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICByZXR1cm4gY2FsbGJhY2soZXZlbnQuZWRpdG9yKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICBldmVudC5zaG93ID0gISFyZXN1bHRcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuICBvbkxpc3RIaWRlKGNhbGxiYWNrOiAoKCkgPT4gYW55KSkge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2xpc3QtaGlkZScsIGNhbGxiYWNrKVxuICB9XG4gIG9uTGlzdE1vdmUoY2FsbGJhY2s6ICgobW92ZW1lbnQ6IExpc3RNb3ZlbWVudCkgPT4gYW55KSkge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2xpc3QtbW92ZScsIGNhbGxiYWNrKVxuICB9XG4gIG9uTGlzdENvbmZpcm0oY2FsbGJhY2s6ICgoKSA9PiBhbnkpKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignbGlzdC1jb25maXJtJywgY2FsbGJhY2spXG4gIH1cbiAgb25IaWdobGlnaHRzU2hvdyhjYWxsYmFjazogKChlZGl0b3I6IFRleHRFZGl0b3IpID0+IFByb21pc2U8Ym9vbGVhbj4pKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignaGlnaGxpZ2h0cy1zaG93JywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgIHJldHVybiBjYWxsYmFjayhldmVudC5lZGl0b3IpLnRoZW4oZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgIGV2ZW50LnNob3cgPSAhIXJlc3VsdFxuICAgICAgfSlcbiAgICB9KVxuICB9XG4gIG9uSGlnaGxpZ2h0c0hpZGUoY2FsbGJhY2s6ICgoKSA9PiBhbnkpKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignaGlnaGxpZ2h0cy1oaWRlJywgY2FsbGJhY2spXG4gIH1cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgaWYgKHRoaXMuYWN0aXZlKSB7XG4gICAgICB0aGlzLmFjdGl2ZS5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgIH1cbiAgfVxufVxuIl19