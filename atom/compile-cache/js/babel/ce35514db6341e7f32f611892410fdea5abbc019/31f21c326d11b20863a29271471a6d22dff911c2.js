var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _atom = require('atom');

var _helpers = require('./helpers');

var Commands = (function () {
  function Commands() {
    var _this = this;

    _classCallCheck(this, Commands);

    this.messages = [];
    this.subscriptions = new _atom.CompositeDisposable();

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'linter-ui-default:next': function linterUiDefaultNext() {
        return _this.move(true, true);
      },
      'linter-ui-default:previous': function linterUiDefaultPrevious() {
        return _this.move(false, true);
      },
      'linter-ui-default:next-error': function linterUiDefaultNextError() {
        return _this.move(true, true, 'error');
      },
      'linter-ui-default:previous-error': function linterUiDefaultPreviousError() {
        return _this.move(false, true, 'error');
      },
      'linter-ui-default:next-warning': function linterUiDefaultNextWarning() {
        return _this.move(true, true, 'warning');
      },
      'linter-ui-default:previous-warning': function linterUiDefaultPreviousWarning() {
        return _this.move(false, true, 'warning');
      },
      'linter-ui-default:next-info': function linterUiDefaultNextInfo() {
        return _this.move(true, true, 'info');
      },
      'linter-ui-default:previous-info': function linterUiDefaultPreviousInfo() {
        return _this.move(false, true, 'info');
      },

      'linter-ui-default:next-in-current-file': function linterUiDefaultNextInCurrentFile() {
        return _this.move(true, false);
      },
      'linter-ui-default:previous-in-current-file': function linterUiDefaultPreviousInCurrentFile() {
        return _this.move(false, false);
      },
      'linter-ui-default:next-error-in-current-file': function linterUiDefaultNextErrorInCurrentFile() {
        return _this.move(true, false, 'error');
      },
      'linter-ui-default:previous-error-in-current-file': function linterUiDefaultPreviousErrorInCurrentFile() {
        return _this.move(false, false, 'error');
      },
      'linter-ui-default:next-warning-in-current-file': function linterUiDefaultNextWarningInCurrentFile() {
        return _this.move(true, false, 'warning');
      },
      'linter-ui-default:previous-warning-in-current-file': function linterUiDefaultPreviousWarningInCurrentFile() {
        return _this.move(false, false, 'warning');
      },
      'linter-ui-default:next-info-in-current-file': function linterUiDefaultNextInfoInCurrentFile() {
        return _this.move(true, false, 'info');
      },
      'linter-ui-default:previous-info-in-current-file': function linterUiDefaultPreviousInfoInCurrentFile() {
        return _this.move(false, false, 'info');
      },

      'linter-ui-default:toggle-panel': function linterUiDefaultTogglePanel() {
        return _this.togglePanel();
      },

      // NOTE: Add no-ops here so they are recognized by commands registry
      // Real commands are registered when tooltip is shown inside tooltip's delegate
      'linter-ui-default:expand-tooltip': function linterUiDefaultExpandTooltip() {},
      'linter-ui-default:collapse-tooltip': function linterUiDefaultCollapseTooltip() {}
    }));
    this.subscriptions.add(atom.commands.add('atom-text-editor:not([mini])', {
      'linter-ui-default:apply-all-solutions': function linterUiDefaultApplyAllSolutions() {
        return _this.applyAllSolutions();
      }
    }));
    this.subscriptions.add(atom.commands.add('#linter-panel', {
      'core:copy': function coreCopy() {
        var selection = document.getSelection();
        if (selection) {
          atom.clipboard.write(selection.toString());
        }
      }
    }));
  }

  _createClass(Commands, [{
    key: 'togglePanel',
    value: function togglePanel() {
      atom.config.set('linter-ui-default.showPanel', !atom.config.get('linter-ui-default.showPanel'));
    }

    // NOTE: Apply solutions from bottom to top, so they don't invalidate each other
  }, {
    key: 'applyAllSolutions',
    value: function applyAllSolutions() {
      var textEditor = (0, _helpers.getActiveTextEditor)();
      (0, _assert2['default'])(textEditor, 'textEditor was null on a command supposed to run on text-editors only');
      var messages = (0, _helpers.sortMessages)([{ column: 'line', type: 'desc' }], (0, _helpers.filterMessages)(this.messages, textEditor.getPath()));
      messages.forEach(function (message) {
        if (message.version === 1 && message.fix) {
          (0, _helpers.applySolution)(textEditor, 1, message.fix);
        } else if (message.version === 2 && message.solutions && message.solutions.length) {
          (0, _helpers.applySolution)(textEditor, 2, (0, _helpers.sortSolutions)(message.solutions)[0]);
        }
      });
    }
  }, {
    key: 'move',
    value: function move(forward, globally) {
      var severity = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

      var currentEditor = (0, _helpers.getActiveTextEditor)();
      var currentFile = currentEditor && currentEditor.getPath() || NaN;
      // NOTE: ^ Setting default to NaN so it won't match empty file paths in messages
      var messages = (0, _helpers.sortMessages)([{ column: 'file', type: 'asc' }, { column: 'line', type: 'asc' }], (0, _helpers.filterMessages)(this.messages, globally ? null : currentFile, severity));
      var expectedValue = forward ? -1 : 1;

      if (!currentEditor) {
        var message = forward ? messages[0] : messages[messages.length - 1];
        if (message) {
          (0, _helpers.visitMessage)(message);
        }
        return;
      }
      var currentPosition = currentEditor.getCursorBufferPosition();

      // NOTE: Iterate bottom to top to find the previous message
      // Because if we search top to bottom when sorted, first item will always
      // be the smallest
      if (!forward) {
        messages.reverse();
      }

      var found = undefined;
      var currentFileEncountered = false;
      for (var i = 0, _length = messages.length; i < _length; i++) {
        var message = messages[i];
        var messageFile = (0, _helpers.$file)(message);
        var messageRange = (0, _helpers.$range)(message);

        if (!currentFileEncountered && messageFile === currentFile) {
          currentFileEncountered = true;
        }
        if (messageFile && messageRange) {
          if (currentFileEncountered && messageFile !== currentFile) {
            found = message;
            break;
          } else if (messageFile === currentFile && currentPosition.compare(messageRange.start) === expectedValue) {
            found = message;
            break;
          }
        }
      }

      if (!found && messages.length) {
        // Reset back to first or last depending on direction
        found = messages[0];
      }

      if (found) {
        (0, _helpers.visitMessage)(found);
      }
    }
  }, {
    key: 'update',
    value: function update(messages) {
      this.messages = messages;
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
    }
  }]);

  return Commands;
})();

module.exports = Commands;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvY29tbWFuZHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O3NCQUVzQixRQUFROzs7O29CQUNNLE1BQU07O3VCQUVtRixXQUFXOztJQUdsSSxRQUFRO0FBSUQsV0FKUCxRQUFRLEdBSUU7OzswQkFKVixRQUFROztBQUtWLFFBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFBO0FBQ2xCLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7O0FBRTlDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFO0FBQ3pELDhCQUF3QixFQUFFO2VBQU0sTUFBSyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztPQUFBO0FBQ3JELGtDQUE0QixFQUFFO2VBQU0sTUFBSyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQztPQUFBO0FBQzFELG9DQUE4QixFQUFFO2VBQU0sTUFBSyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxPQUFPLENBQUM7T0FBQTtBQUNwRSx3Q0FBa0MsRUFBRTtlQUFNLE1BQUssSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDO09BQUE7QUFDekUsc0NBQWdDLEVBQUU7ZUFBTSxNQUFLLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLFNBQVMsQ0FBQztPQUFBO0FBQ3hFLDBDQUFvQyxFQUFFO2VBQU0sTUFBSyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxTQUFTLENBQUM7T0FBQTtBQUM3RSxtQ0FBNkIsRUFBRTtlQUFNLE1BQUssSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDO09BQUE7QUFDbEUsdUNBQWlDLEVBQUU7ZUFBTSxNQUFLLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFF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dC9saWIvY29tbWFuZHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuXG5pbXBvcnQgaW52YXJpYW50IGZyb20gJ2Fzc2VydCdcbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdhdG9tJ1xuXG5pbXBvcnQgeyAkZmlsZSwgJHJhbmdlLCBnZXRBY3RpdmVUZXh0RWRpdG9yLCB2aXNpdE1lc3NhZ2UsIHNvcnRNZXNzYWdlcywgc29ydFNvbHV0aW9ucywgZmlsdGVyTWVzc2FnZXMsIGFwcGx5U29sdXRpb24gfSBmcm9tICcuL2hlbHBlcnMnXG5pbXBvcnQgdHlwZSB7IExpbnRlck1lc3NhZ2UgfSBmcm9tICcuL3R5cGVzJ1xuXG5jbGFzcyBDb21tYW5kcyB7XG4gIG1lc3NhZ2VzOiBBcnJheTxMaW50ZXJNZXNzYWdlPjtcbiAgc3Vic2NyaXB0aW9uczogQ29tcG9zaXRlRGlzcG9zYWJsZTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLm1lc3NhZ2VzID0gW11cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsIHtcbiAgICAgICdsaW50ZXItdWktZGVmYXVsdDpuZXh0JzogKCkgPT4gdGhpcy5tb3ZlKHRydWUsIHRydWUpLFxuICAgICAgJ2xpbnRlci11aS1kZWZhdWx0OnByZXZpb3VzJzogKCkgPT4gdGhpcy5tb3ZlKGZhbHNlLCB0cnVlKSxcbiAgICAgICdsaW50ZXItdWktZGVmYXVsdDpuZXh0LWVycm9yJzogKCkgPT4gdGhpcy5tb3ZlKHRydWUsIHRydWUsICdlcnJvcicpLFxuICAgICAgJ2xpbnRlci11aS1kZWZhdWx0OnByZXZpb3VzLWVycm9yJzogKCkgPT4gdGhpcy5tb3ZlKGZhbHNlLCB0cnVlLCAnZXJyb3InKSxcbiAgICAgICdsaW50ZXItdWktZGVmYXVsdDpuZXh0LXdhcm5pbmcnOiAoKSA9PiB0aGlzLm1vdmUodHJ1ZSwgdHJ1ZSwgJ3dhcm5pbmcnKSxcbiAgICAgICdsaW50ZXItdWktZGVmYXVsdDpwcmV2aW91cy13YXJuaW5nJzogKCkgPT4gdGhpcy5tb3ZlKGZhbHNlLCB0cnVlLCAnd2FybmluZycpLFxuICAgICAgJ2xpbnRlci11aS1kZWZhdWx0Om5leHQtaW5mbyc6ICgpID0+IHRoaXMubW92ZSh0cnVlLCB0cnVlLCAnaW5mbycpLFxuICAgICAgJ2xpbnRlci11aS1kZWZhdWx0OnByZXZpb3VzLWluZm8nOiAoKSA9PiB0aGlzLm1vdmUoZmFsc2UsIHRydWUsICdpbmZvJyksXG5cbiAgICAgICdsaW50ZXItdWktZGVmYXVsdDpuZXh0LWluLWN1cnJlbnQtZmlsZSc6ICgpID0+IHRoaXMubW92ZSh0cnVlLCBmYWxzZSksXG4gICAgICAnbGludGVyLXVpLWRlZmF1bHQ6cHJldmlvdXMtaW4tY3VycmVudC1maWxlJzogKCkgPT4gdGhpcy5tb3ZlKGZhbHNlLCBmYWxzZSksXG4gICAgICAnbGludGVyLXVpLWRlZmF1bHQ6bmV4dC1lcnJvci1pbi1jdXJyZW50LWZpbGUnOiAoKSA9PiB0aGlzLm1vdmUodHJ1ZSwgZmFsc2UsICdlcnJvcicpLFxuICAgICAgJ2xpbnRlci11aS1kZWZhdWx0OnByZXZpb3VzLWVycm9yLWluLWN1cnJlbnQtZmlsZSc6ICgpID0+IHRoaXMubW92ZShmYWxzZSwgZmFsc2UsICdlcnJvcicpLFxuICAgICAgJ2xpbnRlci11aS1kZWZhdWx0Om5leHQtd2FybmluZy1pbi1jdXJyZW50LWZpbGUnOiAoKSA9PiB0aGlzLm1vdmUodHJ1ZSwgZmFsc2UsICd3YXJuaW5nJyksXG4gICAgICAnbGludGVyLXVpLWRlZmF1bHQ6cHJldmlvdXMtd2FybmluZy1pbi1jdXJyZW50LWZpbGUnOiAoKSA9PiB0aGlzLm1vdmUoZmFsc2UsIGZhbHNlLCAnd2FybmluZycpLFxuICAgICAgJ2xpbnRlci11aS1kZWZhdWx0Om5leHQtaW5mby1pbi1jdXJyZW50LWZpbGUnOiAoKSA9PiB0aGlzLm1vdmUodHJ1ZSwgZmFsc2UsICdpbmZvJyksXG4gICAgICAnbGludGVyLXVpLWRlZmF1bHQ6cHJldmlvdXMtaW5mby1pbi1jdXJyZW50LWZpbGUnOiAoKSA9PiB0aGlzLm1vdmUoZmFsc2UsIGZhbHNlLCAnaW5mbycpLFxuXG4gICAgICAnbGludGVyLXVpLWRlZmF1bHQ6dG9nZ2xlLXBhbmVsJzogKCkgPT4gdGhpcy50b2dnbGVQYW5lbCgpLFxuXG4gICAgICAvLyBOT1RFOiBBZGQgbm8tb3BzIGhlcmUgc28gdGhleSBhcmUgcmVjb2duaXplZCBieSBjb21tYW5kcyByZWdpc3RyeVxuICAgICAgLy8gUmVhbCBjb21tYW5kcyBhcmUgcmVnaXN0ZXJlZCB3aGVuIHRvb2x0aXAgaXMgc2hvd24gaW5zaWRlIHRvb2x0aXAncyBkZWxlZ2F0ZVxuICAgICAgJ2xpbnRlci11aS1kZWZhdWx0OmV4cGFuZC10b29sdGlwJzogZnVuY3Rpb24oKSB7IH0sXG4gICAgICAnbGludGVyLXVpLWRlZmF1bHQ6Y29sbGFwc2UtdG9vbHRpcCc6IGZ1bmN0aW9uKCkgeyB9LFxuICAgIH0pKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20tdGV4dC1lZGl0b3I6bm90KFttaW5pXSknLCB7XG4gICAgICAnbGludGVyLXVpLWRlZmF1bHQ6YXBwbHktYWxsLXNvbHV0aW9ucyc6ICgpID0+IHRoaXMuYXBwbHlBbGxTb2x1dGlvbnMoKSxcbiAgICB9KSlcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29tbWFuZHMuYWRkKCcjbGludGVyLXBhbmVsJywge1xuICAgICAgJ2NvcmU6Y29weSc6ICgpID0+IHtcbiAgICAgICAgY29uc3Qgc2VsZWN0aW9uID0gZG9jdW1lbnQuZ2V0U2VsZWN0aW9uKClcbiAgICAgICAgaWYgKHNlbGVjdGlvbikge1xuICAgICAgICAgIGF0b20uY2xpcGJvYXJkLndyaXRlKHNlbGVjdGlvbi50b1N0cmluZygpKVxuICAgICAgICB9XG4gICAgICB9LFxuICAgIH0pKVxuICB9XG4gIHRvZ2dsZVBhbmVsKCk6IHZvaWQge1xuICAgIGF0b20uY29uZmlnLnNldCgnbGludGVyLXVpLWRlZmF1bHQuc2hvd1BhbmVsJywgIWF0b20uY29uZmlnLmdldCgnbGludGVyLXVpLWRlZmF1bHQuc2hvd1BhbmVsJykpXG4gIH1cbiAgLy8gTk9URTogQXBwbHkgc29sdXRpb25zIGZyb20gYm90dG9tIHRvIHRvcCwgc28gdGhleSBkb24ndCBpbnZhbGlkYXRlIGVhY2ggb3RoZXJcbiAgYXBwbHlBbGxTb2x1dGlvbnMoKTogdm9pZCB7XG4gICAgY29uc3QgdGV4dEVkaXRvciA9IGdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIGludmFyaWFudCh0ZXh0RWRpdG9yLCAndGV4dEVkaXRvciB3YXMgbnVsbCBvbiBhIGNvbW1hbmQgc3VwcG9zZWQgdG8gcnVuIG9uIHRleHQtZWRpdG9ycyBvbmx5JylcbiAgICBjb25zdCBtZXNzYWdlcyA9IHNvcnRNZXNzYWdlcyhbeyBjb2x1bW46ICdsaW5lJywgdHlwZTogJ2Rlc2MnIH1dLCBmaWx0ZXJNZXNzYWdlcyh0aGlzLm1lc3NhZ2VzLCB0ZXh0RWRpdG9yLmdldFBhdGgoKSkpXG4gICAgbWVzc2FnZXMuZm9yRWFjaChmdW5jdGlvbihtZXNzYWdlKSB7XG4gICAgICBpZiAobWVzc2FnZS52ZXJzaW9uID09PSAxICYmIG1lc3NhZ2UuZml4KSB7XG4gICAgICAgIGFwcGx5U29sdXRpb24odGV4dEVkaXRvciwgMSwgbWVzc2FnZS5maXgpXG4gICAgICB9IGVsc2UgaWYgKG1lc3NhZ2UudmVyc2lvbiA9PT0gMiAmJiBtZXNzYWdlLnNvbHV0aW9ucyAmJiBtZXNzYWdlLnNvbHV0aW9ucy5sZW5ndGgpIHtcbiAgICAgICAgYXBwbHlTb2x1dGlvbih0ZXh0RWRpdG9yLCAyLCBzb3J0U29sdXRpb25zKG1lc3NhZ2Uuc29sdXRpb25zKVswXSlcbiAgICAgIH1cbiAgICB9KVxuICB9XG4gIG1vdmUoZm9yd2FyZDogYm9vbGVhbiwgZ2xvYmFsbHk6IGJvb2xlYW4sIHNldmVyaXR5OiA/c3RyaW5nID0gbnVsbCk6IHZvaWQge1xuICAgIGNvbnN0IGN1cnJlbnRFZGl0b3IgPSBnZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBjb25zdCBjdXJyZW50RmlsZTogYW55ID0gKGN1cnJlbnRFZGl0b3IgJiYgY3VycmVudEVkaXRvci5nZXRQYXRoKCkpIHx8IE5hTlxuICAgIC8vIE5PVEU6IF4gU2V0dGluZyBkZWZhdWx0IHRvIE5hTiBzbyBpdCB3b24ndCBtYXRjaCBlbXB0eSBmaWxlIHBhdGhzIGluIG1lc3NhZ2VzXG4gICAgY29uc3QgbWVzc2FnZXMgPSBzb3J0TWVzc2FnZXMoW3sgY29sdW1uOiAnZmlsZScsIHR5cGU6ICdhc2MnIH0sIHsgY29sdW1uOiAnbGluZScsIHR5cGU6ICdhc2MnIH1dLCBmaWx0ZXJNZXNzYWdlcyh0aGlzLm1lc3NhZ2VzLCBnbG9iYWxseSA/IG51bGwgOiBjdXJyZW50RmlsZSwgc2V2ZXJpdHkpKVxuICAgIGNvbnN0IGV4cGVjdGVkVmFsdWUgPSBmb3J3YXJkID8gLTEgOiAxXG5cbiAgICBpZiAoIWN1cnJlbnRFZGl0b3IpIHtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSBmb3J3YXJkID8gbWVzc2FnZXNbMF0gOiBtZXNzYWdlc1ttZXNzYWdlcy5sZW5ndGggLSAxXVxuICAgICAgaWYgKG1lc3NhZ2UpIHtcbiAgICAgICAgdmlzaXRNZXNzYWdlKG1lc3NhZ2UpXG4gICAgICB9XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgY29uc3QgY3VycmVudFBvc2l0aW9uID0gY3VycmVudEVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpXG5cbiAgICAvLyBOT1RFOiBJdGVyYXRlIGJvdHRvbSB0byB0b3AgdG8gZmluZCB0aGUgcHJldmlvdXMgbWVzc2FnZVxuICAgIC8vIEJlY2F1c2UgaWYgd2Ugc2VhcmNoIHRvcCB0byBib3R0b20gd2hlbiBzb3J0ZWQsIGZpcnN0IGl0ZW0gd2lsbCBhbHdheXNcbiAgICAvLyBiZSB0aGUgc21hbGxlc3RcbiAgICBpZiAoIWZvcndhcmQpIHtcbiAgICAgIG1lc3NhZ2VzLnJldmVyc2UoKVxuICAgIH1cblxuICAgIGxldCBmb3VuZFxuICAgIGxldCBjdXJyZW50RmlsZUVuY291bnRlcmVkID0gZmFsc2VcbiAgICBmb3IgKGxldCBpID0gMCwgbGVuZ3RoID0gbWVzc2FnZXMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSBtZXNzYWdlc1tpXVxuICAgICAgY29uc3QgbWVzc2FnZUZpbGUgPSAkZmlsZShtZXNzYWdlKVxuICAgICAgY29uc3QgbWVzc2FnZVJhbmdlID0gJHJhbmdlKG1lc3NhZ2UpXG5cbiAgICAgIGlmICghY3VycmVudEZpbGVFbmNvdW50ZXJlZCAmJiBtZXNzYWdlRmlsZSA9PT0gY3VycmVudEZpbGUpIHtcbiAgICAgICAgY3VycmVudEZpbGVFbmNvdW50ZXJlZCA9IHRydWVcbiAgICAgIH1cbiAgICAgIGlmIChtZXNzYWdlRmlsZSAmJiBtZXNzYWdlUmFuZ2UpIHtcbiAgICAgICAgaWYgKGN1cnJlbnRGaWxlRW5jb3VudGVyZWQgJiYgbWVzc2FnZUZpbGUgIT09IGN1cnJlbnRGaWxlKSB7XG4gICAgICAgICAgZm91bmQgPSBtZXNzYWdlXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgfSBlbHNlIGlmIChtZXNzYWdlRmlsZSA9PT0gY3VycmVudEZpbGUgJiYgY3VycmVudFBvc2l0aW9uLmNvbXBhcmUobWVzc2FnZVJhbmdlLnN0YXJ0KSA9PT0gZXhwZWN0ZWRWYWx1ZSkge1xuICAgICAgICAgIGZvdW5kID0gbWVzc2FnZVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIWZvdW5kICYmIG1lc3NhZ2VzLmxlbmd0aCkge1xuICAgICAgLy8gUmVzZXQgYmFjayB0byBmaXJzdCBvciBsYXN0IGRlcGVuZGluZyBvbiBkaXJlY3Rpb25cbiAgICAgIGZvdW5kID0gbWVzc2FnZXNbMF1cbiAgICB9XG5cbiAgICBpZiAoZm91bmQpIHtcbiAgICAgIHZpc2l0TWVzc2FnZShmb3VuZClcbiAgICB9XG4gIH1cbiAgdXBkYXRlKG1lc3NhZ2VzOiBBcnJheTxMaW50ZXJNZXNzYWdlPikge1xuICAgIHRoaXMubWVzc2FnZXMgPSBtZXNzYWdlc1xuICB9XG4gIGRpc3Bvc2UoKTogdm9pZCB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ29tbWFuZHNcbiJdfQ==