Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/** @babel */

var _atom = require('atom');

var TRAILING_WHITESPACE_REGEX = /[ \t]+(?=\r?$)/g;

var Whitespace = (function () {
  function Whitespace() {
    var _this = this;

    _classCallCheck(this, Whitespace);

    this.subscriptions = new _atom.CompositeDisposable();

    this.subscriptions.add(atom.workspace.observeTextEditors(function (editor) {
      return _this.handleEvents(editor);
    }));

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'whitespace:remove-trailing-whitespace': function whitespaceRemoveTrailingWhitespace() {
        var editor = atom.workspace.getActiveTextEditor();

        if (editor) {
          _this.removeTrailingWhitespace(editor, editor.getGrammar().scopeName);
        }
      },

      'whitespace:save-with-trailing-whitespace': function whitespaceSaveWithTrailingWhitespace() {
        var editor = atom.workspace.getActiveTextEditor();

        if (editor) {
          _this.ignore = true;
          editor.save();
          _this.ignore = false;
        }
      },

      'whitespace:save-without-trailing-whitespace': function whitespaceSaveWithoutTrailingWhitespace() {
        var editor = atom.workspace.getActiveTextEditor();

        if (editor) {
          _this.removeTrailingWhitespace(editor, editor.getGrammar().scopeName);
          editor.save();
        }
      },

      'whitespace:convert-tabs-to-spaces': function whitespaceConvertTabsToSpaces() {
        var editor = atom.workspace.getActiveTextEditor();

        if (editor) {
          _this.convertTabsToSpaces(editor);
        }
      },

      'whitespace:convert-spaces-to-tabs': function whitespaceConvertSpacesToTabs() {
        var editor = atom.workspace.getActiveTextEditor();

        if (editor) {
          return _this.convertSpacesToTabs(editor);
        }
      },

      'whitespace:convert-all-tabs-to-spaces': function whitespaceConvertAllTabsToSpaces() {
        var editor = atom.workspace.getActiveTextEditor();

        if (editor) {
          return _this.convertTabsToSpaces(editor, true);
        }
      }
    }));
  }

  _createClass(Whitespace, [{
    key: 'destroy',
    value: function destroy() {
      return this.subscriptions.dispose();
    }
  }, {
    key: 'handleEvents',
    value: function handleEvents(editor) {
      var _this2 = this;

      var buffer = editor.getBuffer();

      var bufferSavedSubscription = buffer.onWillSave(function () {
        return buffer.transact(function () {
          var scopeDescriptor = editor.getRootScopeDescriptor();

          if (atom.config.get('whitespace.removeTrailingWhitespace', {
            scope: scopeDescriptor
          }) && !_this2.ignore) {
            _this2.removeTrailingWhitespace(editor, editor.getGrammar().scopeName);
          }

          if (atom.config.get('whitespace.ensureSingleTrailingNewline', { scope: scopeDescriptor })) {
            return _this2.ensureSingleTrailingNewline(editor);
          }
        });
      });

      var editorTextInsertedSubscription = editor.onDidInsertText(function (event) {
        if (event.text !== '\n') {
          return;
        }

        if (!buffer.isRowBlank(event.range.start.row)) {
          return;
        }

        var scopeDescriptor = editor.getRootScopeDescriptor();

        if (atom.config.get('whitespace.removeTrailingWhitespace', {
          scope: scopeDescriptor
        })) {
          if (!atom.config.get('whitespace.ignoreWhitespaceOnlyLines', {
            scope: scopeDescriptor
          })) {
            return editor.setIndentationForBufferRow(event.range.start.row, 0);
          }
        }
      });

      var editorDestroyedSubscription = editor.onDidDestroy(function () {
        bufferSavedSubscription.dispose();
        editorTextInsertedSubscription.dispose();
        editorDestroyedSubscription.dispose();
        _this2.subscriptions.remove(bufferSavedSubscription);
        _this2.subscriptions.remove(editorTextInsertedSubscription);
        _this2.subscriptions.remove(editorDestroyedSubscription);
      });

      this.subscriptions.add(bufferSavedSubscription);
      this.subscriptions.add(editorTextInsertedSubscription);
      this.subscriptions.add(editorDestroyedSubscription);
    }
  }, {
    key: 'removeTrailingWhitespace',
    value: function removeTrailingWhitespace(editor, grammarScopeName) {
      var buffer = editor.getBuffer();
      var scopeDescriptor = editor.getRootScopeDescriptor();
      var cursorRows = new Set(editor.getCursors().map(function (cursor) {
        return cursor.getBufferRow();
      }));

      var ignoreCurrentLine = atom.config.get('whitespace.ignoreWhitespaceOnCurrentLine', {
        scope: scopeDescriptor
      });

      var ignoreWhitespaceOnlyLines = atom.config.get('whitespace.ignoreWhitespaceOnlyLines', {
        scope: scopeDescriptor
      });

      var keepMarkdownLineBreakWhitespace = grammarScopeName === 'source.gfm' && atom.config.get('whitespace.keepMarkdownLineBreakWhitespace');

      buffer.transact(function () {
        // TODO - remove this conditional after Atom 1.19 stable is released.
        if (buffer.findAllSync) {
          var ranges = buffer.findAllSync(TRAILING_WHITESPACE_REGEX);
          for (var i = 0, n = ranges.length; i < n; i++) {
            var range = ranges[i];
            var row = range.start.row;
            var trailingWhitespaceStart = ranges[i].start.column;
            if (ignoreCurrentLine && cursorRows.has(row)) continue;
            if (ignoreWhitespaceOnlyLines && trailingWhitespaceStart === 0) continue;
            if (keepMarkdownLineBreakWhitespace) {
              var whitespaceLength = range.end.column - range.start.column;
              if (trailingWhitespaceStart > 0 && whitespaceLength >= 2) continue;
            }
            buffer['delete'](ranges[i]);
          }
        } else {
          for (var row = 0, lineCount = buffer.getLineCount(); row < lineCount; row++) {
            var line = buffer.lineForRow(row);
            var lastCharacter = line[line.length - 1];
            if (lastCharacter === ' ' || lastCharacter === '\t') {
              var trailingWhitespaceStart = line.search(TRAILING_WHITESPACE_REGEX);
              if (ignoreCurrentLine && cursorRows.has(row)) continue;
              if (ignoreWhitespaceOnlyLines && trailingWhitespaceStart === 0) continue;
              if (keepMarkdownLineBreakWhitespace) {
                var whitespaceLength = line.length - trailingWhitespaceStart;
                if (trailingWhitespaceStart > 0 && whitespaceLength >= 2) continue;
              }
              buffer['delete']((0, _atom.Range)((0, _atom.Point)(row, trailingWhitespaceStart), (0, _atom.Point)(row, line.length)));
            }
          }
        }
      });
    }
  }, {
    key: 'ensureSingleTrailingNewline',
    value: function ensureSingleTrailingNewline(editor) {
      var selectedBufferRanges = undefined;
      var row = undefined;
      var buffer = editor.getBuffer();
      var lastRow = buffer.getLastRow();

      if (buffer.lineForRow(lastRow) === '') {
        row = lastRow - 1;

        while (row && buffer.lineForRow(row) === '') {
          buffer.deleteRow(row--);
        }
      } else {
        selectedBufferRanges = editor.getSelectedBufferRanges();
        buffer.append('\n');
        editor.setSelectedBufferRanges(selectedBufferRanges);
      }
    }
  }, {
    key: 'convertTabsToSpaces',
    value: function convertTabsToSpaces(editor, convertAllTabs) {
      var buffer = editor.getBuffer();
      var spacesText = new Array(editor.getTabLength() + 1).join(' ');
      var regex = convertAllTabs ? /\t/g : /^\t+/g;

      buffer.transact(function () {
        return buffer.scan(regex, function (_ref) {
          var replace = _ref.replace;

          return replace(spacesText);
        });
      });

      return editor.setSoftTabs(true);
    }
  }, {
    key: 'convertSpacesToTabs',
    value: function convertSpacesToTabs(editor) {
      var buffer = editor.getBuffer();
      var scope = editor.getRootScopeDescriptor();
      var fileTabSize = editor.getTabLength();

      var userTabSize = atom.config.get('editor.tabLength', {
        scope: scope
      });

      var regex = new RegExp(' '.repeat(fileTabSize), 'g');

      buffer.transact(function () {
        return buffer.scan(/^[ \t]+/g, function (_ref2) {
          var matchText = _ref2.matchText;
          var replace = _ref2.replace;

          return replace(matchText.replace(regex, '\t').replace(/[ ]+\t/g, '\t'));
        });
      });

      editor.setSoftTabs(false);

      if (fileTabSize !== userTabSize) {
        return editor.setTabLength(userTabSize);
      }
    }
  }]);

  return Whitespace;
})();

exports['default'] = Whitespace;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy93aGl0ZXNwYWNlL2xpYi93aGl0ZXNwYWNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7b0JBRWdELE1BQU07O0FBRXRELElBQU0seUJBQXlCLEdBQUcsaUJBQWlCLENBQUE7O0lBRTlCLFVBQVU7QUFDakIsV0FETyxVQUFVLEdBQ2Q7OzswQkFESSxVQUFVOztBQUUzQixRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFBOztBQUU5QyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLFVBQUEsTUFBTSxFQUFJO0FBQ2pFLGFBQU8sTUFBSyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUE7S0FDakMsQ0FBQyxDQUFDLENBQUE7O0FBRUgsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUU7QUFDekQsNkNBQXVDLEVBQUUsOENBQU07QUFDN0MsWUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsRUFBRSxDQUFBOztBQUVqRCxZQUFJLE1BQU0sRUFBRTtBQUNWLGdCQUFLLHdCQUF3QixDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUE7U0FDckU7T0FDRjs7QUFFRCxnREFBMEMsRUFBRSxnREFBTTtBQUNoRCxZQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFtQixFQUFFLENBQUE7O0FBRWpELFlBQUksTUFBTSxFQUFFO0FBQ1YsZ0JBQUssTUFBTSxHQUFHLElBQUksQ0FBQTtBQUNsQixnQkFBTSxDQUFDLElBQUksRUFBRSxDQUFBO0FBQ2IsZ0JBQUssTUFBTSxHQUFHLEtBQUssQ0FBQTtTQUNwQjtPQUNGOztBQUVELG1EQUE2QyxFQUFFLG1EQUFNO0FBQ25ELFlB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QUFXLENBQUMsSUFBSSxDQUFDLENBQUE7S0FDaEM7OztXQUVtQiw2QkFBQyxNQUFNLEVBQUU7QUFDM0IsVUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFBO0FBQy9CLFVBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxzQkFBc0IsRUFBRSxDQUFBO0FBQzNDLFVBQUksV0FBVyxHQUFHLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQTs7QUFFdkMsVUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEVBQUU7QUFDcEQsYUFBSyxFQUFFLEtBQUs7T0FDYixDQUFDLENBQUE7O0FBRUYsVUFBSSxLQUFLLEdBQUcsSUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQTs7QUFFcEQsWUFBTSxDQUFDLFFBQVEsQ0FBQyxZQUFZO0FBQzFCLGVBQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsVUFBVSxLQUFvQixFQUFFO2NBQXJCLFNBQVMsR0FBVixLQUFvQixDQUFuQixTQUFTO2NBQUUsT0FBTyxHQUFuQixLQUFvQixDQUFSLE9BQU87O0FBQzFELGlCQUFPLE9BQU8sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUE7U0FDeEUsQ0FBQyxDQUFBO09BQ0gsQ0FBQyxDQUFBOztBQUVGLFlBQU0sQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUE7O0FBRXpCLFVBQUksV0FBVyxLQUFLLFdBQVcsRUFBRTtBQUMvQixlQUFPLE1BQU0sQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLENBQUE7T0FDeEM7S0FDRjs7O1NBcE9rQixVQUFVOzs7cUJBQVYsVUFBVSIsImZpbGUiOiIvVXNlcnMvYWgvLmF0b20vcGFja2FnZXMvd2hpdGVzcGFjZS9saWIvd2hpdGVzcGFjZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cblxuaW1wb3J0IHtDb21wb3NpdGVEaXNwb3NhYmxlLCBQb2ludCwgUmFuZ2V9IGZyb20gJ2F0b20nXG5cbmNvbnN0IFRSQUlMSU5HX1dISVRFU1BBQ0VfUkVHRVggPSAvWyBcXHRdKyg/PVxccj8kKS9nXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdoaXRlc3BhY2Uge1xuICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLndvcmtzcGFjZS5vYnNlcnZlVGV4dEVkaXRvcnMoZWRpdG9yID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmhhbmRsZUV2ZW50cyhlZGl0b3IpXG4gICAgfSkpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsIHtcbiAgICAgICd3aGl0ZXNwYWNlOnJlbW92ZS10cmFpbGluZy13aGl0ZXNwYWNlJzogKCkgPT4ge1xuICAgICAgICBsZXQgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG5cbiAgICAgICAgaWYgKGVkaXRvcikge1xuICAgICAgICAgIHRoaXMucmVtb3ZlVHJhaWxpbmdXaGl0ZXNwYWNlKGVkaXRvciwgZWRpdG9yLmdldEdyYW1tYXIoKS5zY29wZU5hbWUpXG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgICd3aGl0ZXNwYWNlOnNhdmUtd2l0aC10cmFpbGluZy13aGl0ZXNwYWNlJzogKCkgPT4ge1xuICAgICAgICBsZXQgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG5cbiAgICAgICAgaWYgKGVkaXRvcikge1xuICAgICAgICAgIHRoaXMuaWdub3JlID0gdHJ1ZVxuICAgICAgICAgIGVkaXRvci5zYXZlKClcbiAgICAgICAgICB0aGlzLmlnbm9yZSA9IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgICd3aGl0ZXNwYWNlOnNhdmUtd2l0aG91dC10cmFpbGluZy13aGl0ZXNwYWNlJzogKCkgPT4ge1xuICAgICAgICBsZXQgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG5cbiAgICAgICAgaWYgKGVkaXRvcikge1xuICAgICAgICAgIHRoaXMucmVtb3ZlVHJhaWxpbmdXaGl0ZXNwYWNlKGVkaXRvciwgZWRpdG9yLmdldEdyYW1tYXIoKS5zY29wZU5hbWUpXG4gICAgICAgICAgZWRpdG9yLnNhdmUoKVxuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICAnd2hpdGVzcGFjZTpjb252ZXJ0LXRhYnMtdG8tc3BhY2VzJzogKCkgPT4ge1xuICAgICAgICBsZXQgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG5cbiAgICAgICAgaWYgKGVkaXRvcikge1xuICAgICAgICAgIHRoaXMuY29udmVydFRhYnNUb1NwYWNlcyhlZGl0b3IpXG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgICd3aGl0ZXNwYWNlOmNvbnZlcnQtc3BhY2VzLXRvLXRhYnMnOiAoKSA9PiB7XG4gICAgICAgIGxldCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcblxuICAgICAgICBpZiAoZWRpdG9yKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuY29udmVydFNwYWNlc1RvVGFicyhlZGl0b3IpXG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgICd3aGl0ZXNwYWNlOmNvbnZlcnQtYWxsLXRhYnMtdG8tc3BhY2VzJzogKCkgPT4ge1xuICAgICAgICBsZXQgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG5cbiAgICAgICAgaWYgKGVkaXRvcikge1xuICAgICAgICAgIHJldHVybiB0aGlzLmNvbnZlcnRUYWJzVG9TcGFjZXMoZWRpdG9yLCB0cnVlKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSkpXG4gIH1cblxuICBkZXN0cm95ICgpIHtcbiAgICByZXR1cm4gdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICB9XG5cbiAgaGFuZGxlRXZlbnRzIChlZGl0b3IpIHtcbiAgICBsZXQgYnVmZmVyID0gZWRpdG9yLmdldEJ1ZmZlcigpXG5cbiAgICBsZXQgYnVmZmVyU2F2ZWRTdWJzY3JpcHRpb24gPSBidWZmZXIub25XaWxsU2F2ZSgoKSA9PiB7XG4gICAgICByZXR1cm4gYnVmZmVyLnRyYW5zYWN0KCgpID0+IHtcbiAgICAgICAgbGV0IHNjb3BlRGVzY3JpcHRvciA9IGVkaXRvci5nZXRSb290U2NvcGVEZXNjcmlwdG9yKClcblxuICAgICAgICBpZiAoYXRvbS5jb25maWcuZ2V0KCd3aGl0ZXNwYWNlLnJlbW92ZVRyYWlsaW5nV2hpdGVzcGFjZScsIHtcbiAgICAgICAgICBzY29wZTogc2NvcGVEZXNjcmlwdG9yXG4gICAgICAgIH0pICYmICF0aGlzLmlnbm9yZSkge1xuICAgICAgICAgIHRoaXMucmVtb3ZlVHJhaWxpbmdXaGl0ZXNwYWNlKGVkaXRvciwgZWRpdG9yLmdldEdyYW1tYXIoKS5zY29wZU5hbWUpXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYXRvbS5jb25maWcuZ2V0KCd3aGl0ZXNwYWNlLmVuc3VyZVNpbmdsZVRyYWlsaW5nTmV3bGluZScsIHtzY29wZTogc2NvcGVEZXNjcmlwdG9yfSkpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5lbnN1cmVTaW5nbGVUcmFpbGluZ05ld2xpbmUoZWRpdG9yKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBsZXQgZWRpdG9yVGV4dEluc2VydGVkU3Vic2NyaXB0aW9uID0gZWRpdG9yLm9uRGlkSW5zZXJ0VGV4dChmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIGlmIChldmVudC50ZXh0ICE9PSAnXFxuJykge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgaWYgKCFidWZmZXIuaXNSb3dCbGFuayhldmVudC5yYW5nZS5zdGFydC5yb3cpKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBsZXQgc2NvcGVEZXNjcmlwdG9yID0gZWRpdG9yLmdldFJvb3RTY29wZURlc2NyaXB0b3IoKVxuXG4gICAgICBpZiAoYXRvbS5jb25maWcuZ2V0KCd3aGl0ZXNwYWNlLnJlbW92ZVRyYWlsaW5nV2hpdGVzcGFjZScsIHtcbiAgICAgICAgc2NvcGU6IHNjb3BlRGVzY3JpcHRvclxuICAgICAgfSkpIHtcbiAgICAgICAgaWYgKCFhdG9tLmNvbmZpZy5nZXQoJ3doaXRlc3BhY2UuaWdub3JlV2hpdGVzcGFjZU9ubHlMaW5lcycsIHtcbiAgICAgICAgICBzY29wZTogc2NvcGVEZXNjcmlwdG9yXG4gICAgICAgIH0pKSB7XG4gICAgICAgICAgcmV0dXJuIGVkaXRvci5zZXRJbmRlbnRhdGlvbkZvckJ1ZmZlclJvdyhldmVudC5yYW5nZS5zdGFydC5yb3csIDApXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuXG4gICAgbGV0IGVkaXRvckRlc3Ryb3llZFN1YnNjcmlwdGlvbiA9IGVkaXRvci5vbkRpZERlc3Ryb3koKCkgPT4ge1xuICAgICAgYnVmZmVyU2F2ZWRTdWJzY3JpcHRpb24uZGlzcG9zZSgpXG4gICAgICBlZGl0b3JUZXh0SW5zZXJ0ZWRTdWJzY3JpcHRpb24uZGlzcG9zZSgpXG4gICAgICBlZGl0b3JEZXN0cm95ZWRTdWJzY3JpcHRpb24uZGlzcG9zZSgpXG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbnMucmVtb3ZlKGJ1ZmZlclNhdmVkU3Vic2NyaXB0aW9uKVxuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLnJlbW92ZShlZGl0b3JUZXh0SW5zZXJ0ZWRTdWJzY3JpcHRpb24pXG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbnMucmVtb3ZlKGVkaXRvckRlc3Ryb3llZFN1YnNjcmlwdGlvbilcbiAgICB9KVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChidWZmZXJTYXZlZFN1YnNjcmlwdGlvbilcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGVkaXRvclRleHRJbnNlcnRlZFN1YnNjcmlwdGlvbilcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGVkaXRvckRlc3Ryb3llZFN1YnNjcmlwdGlvbilcbiAgfVxuXG4gIHJlbW92ZVRyYWlsaW5nV2hpdGVzcGFjZSAoZWRpdG9yLCBncmFtbWFyU2NvcGVOYW1lKSB7XG4gICAgY29uc3QgYnVmZmVyID0gZWRpdG9yLmdldEJ1ZmZlcigpXG4gICAgY29uc3Qgc2NvcGVEZXNjcmlwdG9yID0gZWRpdG9yLmdldFJvb3RTY29wZURlc2NyaXB0b3IoKVxuICAgIGNvbnN0IGN1cnNvclJvd3MgPSBuZXcgU2V0KGVkaXRvci5nZXRDdXJzb3JzKCkubWFwKGN1cnNvciA9PiBjdXJzb3IuZ2V0QnVmZmVyUm93KCkpKVxuXG4gICAgY29uc3QgaWdub3JlQ3VycmVudExpbmUgPSBhdG9tLmNvbmZpZy5nZXQoJ3doaXRlc3BhY2UuaWdub3JlV2hpdGVzcGFjZU9uQ3VycmVudExpbmUnLCB7XG4gICAgICBzY29wZTogc2NvcGVEZXNjcmlwdG9yXG4gICAgfSlcblxuICAgIGNvbnN0IGlnbm9yZVdoaXRlc3BhY2VPbmx5TGluZXMgPSBhdG9tLmNvbmZpZy5nZXQoJ3doaXRlc3BhY2UuaWdub3JlV2hpdGVzcGFjZU9ubHlMaW5lcycsIHtcbiAgICAgIHNjb3BlOiBzY29wZURlc2NyaXB0b3JcbiAgICB9KVxuXG4gICAgY29uc3Qga2VlcE1hcmtkb3duTGluZUJyZWFrV2hpdGVzcGFjZSA9XG4gICAgICBncmFtbWFyU2NvcGVOYW1lID09PSAnc291cmNlLmdmbScgJiZcbiAgICAgIGF0b20uY29uZmlnLmdldCgnd2hpdGVzcGFjZS5rZWVwTWFya2Rvd25MaW5lQnJlYWtXaGl0ZXNwYWNlJylcblxuICAgIGJ1ZmZlci50cmFuc2FjdCgoKSA9PiB7XG4gICAgICAvLyBUT0RPIC0gcmVtb3ZlIHRoaXMgY29uZGl0aW9uYWwgYWZ0ZXIgQXRvbSAxLjE5IHN0YWJsZSBpcyByZWxlYXNlZC5cbiAgICAgIGlmIChidWZmZXIuZmluZEFsbFN5bmMpIHtcbiAgICAgICAgY29uc3QgcmFuZ2VzID0gYnVmZmVyLmZpbmRBbGxTeW5jKFRSQUlMSU5HX1dISVRFU1BBQ0VfUkVHRVgpXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBuID0gcmFuZ2VzLmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgICAgIGNvbnN0IHJhbmdlID0gcmFuZ2VzW2ldXG4gICAgICAgICAgY29uc3Qgcm93ID0gcmFuZ2Uuc3RhcnQucm93XG4gICAgICAgICAgY29uc3QgdHJhaWxpbmdXaGl0ZXNwYWNlU3RhcnQgPSByYW5nZXNbaV0uc3RhcnQuY29sdW1uXG4gICAgICAgICAgaWYgKGlnbm9yZUN1cnJlbnRMaW5lICYmIGN1cnNvclJvd3MuaGFzKHJvdykpIGNvbnRpbnVlXG4gICAgICAgICAgaWYgKGlnbm9yZVdoaXRlc3BhY2VPbmx5TGluZXMgJiYgdHJhaWxpbmdXaGl0ZXNwYWNlU3RhcnQgPT09IDApIGNvbnRpbnVlXG4gICAgICAgICAgaWYgKGtlZXBNYXJrZG93bkxpbmVCcmVha1doaXRlc3BhY2UpIHtcbiAgICAgICAgICAgIGNvbnN0IHdoaXRlc3BhY2VMZW5ndGggPSByYW5nZS5lbmQuY29sdW1uIC0gcmFuZ2Uuc3RhcnQuY29sdW1uXG4gICAgICAgICAgICBpZiAodHJhaWxpbmdXaGl0ZXNwYWNlU3RhcnQgPiAwICYmIHdoaXRlc3BhY2VMZW5ndGggPj0gMikgY29udGludWVcbiAgICAgICAgICB9XG4gICAgICAgICAgYnVmZmVyLmRlbGV0ZShyYW5nZXNbaV0pXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvciAobGV0IHJvdyA9IDAsIGxpbmVDb3VudCA9IGJ1ZmZlci5nZXRMaW5lQ291bnQoKTsgcm93IDwgbGluZUNvdW50OyByb3crKykge1xuICAgICAgICAgIGNvbnN0IGxpbmUgPSBidWZmZXIubGluZUZvclJvdyhyb3cpXG4gICAgICAgICAgY29uc3QgbGFzdENoYXJhY3RlciA9IGxpbmVbbGluZS5sZW5ndGggLSAxXVxuICAgICAgICAgIGlmIChsYXN0Q2hhcmFjdGVyID09PSAnICcgfHwgbGFzdENoYXJhY3RlciA9PT0gJ1xcdCcpIHtcbiAgICAgICAgICAgIGNvbnN0IHRyYWlsaW5nV2hpdGVzcGFjZVN0YXJ0ID0gbGluZS5zZWFyY2goVFJBSUxJTkdfV0hJVEVTUEFDRV9SRUdFWClcbiAgICAgICAgICAgIGlmIChpZ25vcmVDdXJyZW50TGluZSAmJiBjdXJzb3JSb3dzLmhhcyhyb3cpKSBjb250aW51ZVxuICAgICAgICAgICAgaWYgKGlnbm9yZVdoaXRlc3BhY2VPbmx5TGluZXMgJiYgdHJhaWxpbmdXaGl0ZXNwYWNlU3RhcnQgPT09IDApIGNvbnRpbnVlXG4gICAgICAgICAgICBpZiAoa2VlcE1hcmtkb3duTGluZUJyZWFrV2hpdGVzcGFjZSkge1xuICAgICAgICAgICAgICBjb25zdCB3aGl0ZXNwYWNlTGVuZ3RoID0gbGluZS5sZW5ndGggLSB0cmFpbGluZ1doaXRlc3BhY2VTdGFydFxuICAgICAgICAgICAgICBpZiAodHJhaWxpbmdXaGl0ZXNwYWNlU3RhcnQgPiAwICYmIHdoaXRlc3BhY2VMZW5ndGggPj0gMikgY29udGludWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJ1ZmZlci5kZWxldGUoUmFuZ2UoUG9pbnQocm93LCB0cmFpbGluZ1doaXRlc3BhY2VTdGFydCksIFBvaW50KHJvdywgbGluZS5sZW5ndGgpKSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgZW5zdXJlU2luZ2xlVHJhaWxpbmdOZXdsaW5lIChlZGl0b3IpIHtcbiAgICBsZXQgc2VsZWN0ZWRCdWZmZXJSYW5nZXNcbiAgICBsZXQgcm93XG4gICAgbGV0IGJ1ZmZlciA9IGVkaXRvci5nZXRCdWZmZXIoKVxuICAgIGxldCBsYXN0Um93ID0gYnVmZmVyLmdldExhc3RSb3coKVxuXG4gICAgaWYgKGJ1ZmZlci5saW5lRm9yUm93KGxhc3RSb3cpID09PSAnJykge1xuICAgICAgcm93ID0gbGFzdFJvdyAtIDFcblxuICAgICAgd2hpbGUgKHJvdyAmJiBidWZmZXIubGluZUZvclJvdyhyb3cpID09PSAnJykge1xuICAgICAgICBidWZmZXIuZGVsZXRlUm93KHJvdy0tKVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzZWxlY3RlZEJ1ZmZlclJhbmdlcyA9IGVkaXRvci5nZXRTZWxlY3RlZEJ1ZmZlclJhbmdlcygpXG4gICAgICBidWZmZXIuYXBwZW5kKCdcXG4nKVxuICAgICAgZWRpdG9yLnNldFNlbGVjdGVkQnVmZmVyUmFuZ2VzKHNlbGVjdGVkQnVmZmVyUmFuZ2VzKVxuICAgIH1cbiAgfVxuXG4gIGNvbnZlcnRUYWJzVG9TcGFjZXMgKGVkaXRvciwgY29udmVydEFsbFRhYnMpIHtcbiAgICBsZXQgYnVmZmVyID0gZWRpdG9yLmdldEJ1ZmZlcigpXG4gICAgbGV0IHNwYWNlc1RleHQgPSBuZXcgQXJyYXkoZWRpdG9yLmdldFRhYkxlbmd0aCgpICsgMSkuam9pbignICcpXG4gICAgbGV0IHJlZ2V4ID0gKGNvbnZlcnRBbGxUYWJzID8gL1xcdC9nIDogL15cXHQrL2cpXG5cbiAgICBidWZmZXIudHJhbnNhY3QoZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGJ1ZmZlci5zY2FuKHJlZ2V4LCBmdW5jdGlvbiAoe3JlcGxhY2V9KSB7XG4gICAgICAgIHJldHVybiByZXBsYWNlKHNwYWNlc1RleHQpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICByZXR1cm4gZWRpdG9yLnNldFNvZnRUYWJzKHRydWUpXG4gIH1cblxuICBjb252ZXJ0U3BhY2VzVG9UYWJzIChlZGl0b3IpIHtcbiAgICBsZXQgYnVmZmVyID0gZWRpdG9yLmdldEJ1ZmZlcigpXG4gICAgbGV0IHNjb3BlID0gZWRpdG9yLmdldFJvb3RTY29wZURlc2NyaXB0b3IoKVxuICAgIGxldCBmaWxlVGFiU2l6ZSA9IGVkaXRvci5nZXRUYWJMZW5ndGgoKVxuXG4gICAgbGV0IHVzZXJUYWJTaXplID0gYXRvbS5jb25maWcuZ2V0KCdlZGl0b3IudGFiTGVuZ3RoJywge1xuICAgICAgc2NvcGU6IHNjb3BlXG4gICAgfSlcblxuICAgIGxldCByZWdleCA9IG5ldyBSZWdFeHAoJyAnLnJlcGVhdChmaWxlVGFiU2l6ZSksICdnJylcblxuICAgIGJ1ZmZlci50cmFuc2FjdChmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gYnVmZmVyLnNjYW4oL15bIFxcdF0rL2csIGZ1bmN0aW9uICh7bWF0Y2hUZXh0LCByZXBsYWNlfSkge1xuICAgICAgICByZXR1cm4gcmVwbGFjZShtYXRjaFRleHQucmVwbGFjZShyZWdleCwgJ1xcdCcpLnJlcGxhY2UoL1sgXStcXHQvZywgJ1xcdCcpKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZWRpdG9yLnNldFNvZnRUYWJzKGZhbHNlKVxuXG4gICAgaWYgKGZpbGVUYWJTaXplICE9PSB1c2VyVGFiU2l6ZSkge1xuICAgICAgcmV0dXJuIGVkaXRvci5zZXRUYWJMZW5ndGgodXNlclRhYlNpemUpXG4gICAgfVxuICB9XG59XG4iXX0=