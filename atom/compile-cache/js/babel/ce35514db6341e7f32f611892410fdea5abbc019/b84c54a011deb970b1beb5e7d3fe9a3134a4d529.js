Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/** @babel */

var _atom = require('atom');

var TRAILING_WHITESPACE_REGEX = /[ \t]+$/g;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy93aGl0ZXNwYWNlL2xpYi93aGl0ZXNwYWNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7b0JBRWdELE1BQU07O0FBRXRELElBQU0seUJBQXlCLEdBQUcsVUFBVSxDQUFBOztJQUV2QixVQUFVO0FBQ2pCLFdBRE8sVUFBVSxHQUNkOzs7MEJBREksVUFBVTs7QUFFM0IsUUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQTs7QUFFOUMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxVQUFBLE1BQU0sRUFBSTtBQUNqRSxhQUFPLE1BQUssWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0tBQ2pDLENBQUMsQ0FBQyxDQUFBOztBQUVILFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFO0FBQ3pELDZDQUF1QyxFQUFFLDhDQUFNO0FBQzdDLFlBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQW1CLEVBQUUsQ0FBQTs7QUFFakQsWUFBSSxNQUFNLEVBQUU7QUFDVixnQkFBSyx3QkFBd0IsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFBO1NBQ3JFO09BQ0Y7O0FBRUQsZ0RBQTBDLEVBQUUsZ0RBQU07QUFDaEQsWUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsRUFBRSxDQUFBOztBQUVqRCxZQUFJLE1BQU0sRUFBRTtBQUNWLGdCQUFLLE1BQU0sR0FBRyxJQUFJLENBQUE7QUFDbEIsZ0JBQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQTtBQUNiLGdCQUFLLE1BQU0sR0FBRyxLQUFLLENBQUE7U0FDcEI7T0FDRjs7QUFFRCxtREFBNkMsRUFBRSxtREFBTTtBQUNuRCxZQUFJ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VyxDQUFDLElBQUksQ0FBQyxDQUFBO0tBQ2hDOzs7V0FFbUIsNkJBQUMsTUFBTSxFQUFFO0FBQzNCLFVBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQTtBQUMvQixVQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsc0JBQXNCLEVBQUUsQ0FBQTtBQUMzQyxVQUFJLFdBQVcsR0FBRyxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUE7O0FBRXZDLFVBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGtCQUFrQixFQUFFO0FBQ3BELGFBQUssRUFBRSxLQUFLO09BQ2IsQ0FBQyxDQUFBOztBQUVGLFVBQUksS0FBSyxHQUFHLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUE7O0FBRXBELFlBQU0sQ0FBQyxRQUFRLENBQUMsWUFBWTtBQUMxQixlQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLFVBQVUsS0FBb0IsRUFBRTtjQUFyQixTQUFTLEdBQVYsS0FBb0IsQ0FBbkIsU0FBUztjQUFFLE9BQU8sR0FBbkIsS0FBb0IsQ0FBUixPQUFPOztBQUMxRCxpQkFBTyxPQUFPLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFBO1NBQ3hFLENBQUMsQ0FBQTtPQUNILENBQUMsQ0FBQTs7QUFFRixZQUFNLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFBOztBQUV6QixVQUFJLFdBQVcsS0FBSyxXQUFXLEVBQUU7QUFDL0IsZUFBTyxNQUFNLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFBO09BQ3hDO0tBQ0Y7OztTQXBPa0IsVUFBVTs7O3FCQUFWLFVBQVUiLCJmaWxlIjoiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3doaXRlc3BhY2UvbGliL3doaXRlc3BhY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGJhYmVsICovXG5cbmltcG9ydCB7Q29tcG9zaXRlRGlzcG9zYWJsZSwgUG9pbnQsIFJhbmdlfSBmcm9tICdhdG9tJ1xuXG5jb25zdCBUUkFJTElOR19XSElURVNQQUNFX1JFR0VYID0gL1sgXFx0XSskL2dcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2hpdGVzcGFjZSB7XG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20ud29ya3NwYWNlLm9ic2VydmVUZXh0RWRpdG9ycyhlZGl0b3IgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlRXZlbnRzKGVkaXRvcilcbiAgICB9KSlcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywge1xuICAgICAgJ3doaXRlc3BhY2U6cmVtb3ZlLXRyYWlsaW5nLXdoaXRlc3BhY2UnOiAoKSA9PiB7XG4gICAgICAgIGxldCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcblxuICAgICAgICBpZiAoZWRpdG9yKSB7XG4gICAgICAgICAgdGhpcy5yZW1vdmVUcmFpbGluZ1doaXRlc3BhY2UoZWRpdG9yLCBlZGl0b3IuZ2V0R3JhbW1hcigpLnNjb3BlTmFtZSlcbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgJ3doaXRlc3BhY2U6c2F2ZS13aXRoLXRyYWlsaW5nLXdoaXRlc3BhY2UnOiAoKSA9PiB7XG4gICAgICAgIGxldCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcblxuICAgICAgICBpZiAoZWRpdG9yKSB7XG4gICAgICAgICAgdGhpcy5pZ25vcmUgPSB0cnVlXG4gICAgICAgICAgZWRpdG9yLnNhdmUoKVxuICAgICAgICAgIHRoaXMuaWdub3JlID0gZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgJ3doaXRlc3BhY2U6c2F2ZS13aXRob3V0LXRyYWlsaW5nLXdoaXRlc3BhY2UnOiAoKSA9PiB7XG4gICAgICAgIGxldCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcblxuICAgICAgICBpZiAoZWRpdG9yKSB7XG4gICAgICAgICAgdGhpcy5yZW1vdmVUcmFpbGluZ1doaXRlc3BhY2UoZWRpdG9yLCBlZGl0b3IuZ2V0R3JhbW1hcigpLnNjb3BlTmFtZSlcbiAgICAgICAgICBlZGl0b3Iuc2F2ZSgpXG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgICd3aGl0ZXNwYWNlOmNvbnZlcnQtdGFicy10by1zcGFjZXMnOiAoKSA9PiB7XG4gICAgICAgIGxldCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcblxuICAgICAgICBpZiAoZWRpdG9yKSB7XG4gICAgICAgICAgdGhpcy5jb252ZXJ0VGFic1RvU3BhY2VzKGVkaXRvcilcbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgJ3doaXRlc3BhY2U6Y29udmVydC1zcGFjZXMtdG8tdGFicyc6ICgpID0+IHtcbiAgICAgICAgbGV0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuXG4gICAgICAgIGlmIChlZGl0b3IpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5jb252ZXJ0U3BhY2VzVG9UYWJzKGVkaXRvcilcbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgJ3doaXRlc3BhY2U6Y29udmVydC1hbGwtdGFicy10by1zcGFjZXMnOiAoKSA9PiB7XG4gICAgICAgIGxldCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcblxuICAgICAgICBpZiAoZWRpdG9yKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuY29udmVydFRhYnNUb1NwYWNlcyhlZGl0b3IsIHRydWUpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KSlcbiAgfVxuXG4gIGRlc3Ryb3kgKCkge1xuICAgIHJldHVybiB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gIH1cblxuICBoYW5kbGVFdmVudHMgKGVkaXRvcikge1xuICAgIGxldCBidWZmZXIgPSBlZGl0b3IuZ2V0QnVmZmVyKClcblxuICAgIGxldCBidWZmZXJTYXZlZFN1YnNjcmlwdGlvbiA9IGJ1ZmZlci5vbldpbGxTYXZlKCgpID0+IHtcbiAgICAgIHJldHVybiBidWZmZXIudHJhbnNhY3QoKCkgPT4ge1xuICAgICAgICBsZXQgc2NvcGVEZXNjcmlwdG9yID0gZWRpdG9yLmdldFJvb3RTY29wZURlc2NyaXB0b3IoKVxuXG4gICAgICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoJ3doaXRlc3BhY2UucmVtb3ZlVHJhaWxpbmdXaGl0ZXNwYWNlJywge1xuICAgICAgICAgIHNjb3BlOiBzY29wZURlc2NyaXB0b3JcbiAgICAgICAgfSkgJiYgIXRoaXMuaWdub3JlKSB7XG4gICAgICAgICAgdGhpcy5yZW1vdmVUcmFpbGluZ1doaXRlc3BhY2UoZWRpdG9yLCBlZGl0b3IuZ2V0R3JhbW1hcigpLnNjb3BlTmFtZSlcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoJ3doaXRlc3BhY2UuZW5zdXJlU2luZ2xlVHJhaWxpbmdOZXdsaW5lJywge3Njb3BlOiBzY29wZURlc2NyaXB0b3J9KSkge1xuICAgICAgICAgIHJldHVybiB0aGlzLmVuc3VyZVNpbmdsZVRyYWlsaW5nTmV3bGluZShlZGl0b3IpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGxldCBlZGl0b3JUZXh0SW5zZXJ0ZWRTdWJzY3JpcHRpb24gPSBlZGl0b3Iub25EaWRJbnNlcnRUZXh0KGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgaWYgKGV2ZW50LnRleHQgIT09ICdcXG4nKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBpZiAoIWJ1ZmZlci5pc1Jvd0JsYW5rKGV2ZW50LnJhbmdlLnN0YXJ0LnJvdykpIHtcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGxldCBzY29wZURlc2NyaXB0b3IgPSBlZGl0b3IuZ2V0Um9vdFNjb3BlRGVzY3JpcHRvcigpXG5cbiAgICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoJ3doaXRlc3BhY2UucmVtb3ZlVHJhaWxpbmdXaGl0ZXNwYWNlJywge1xuICAgICAgICBzY29wZTogc2NvcGVEZXNjcmlwdG9yXG4gICAgICB9KSkge1xuICAgICAgICBpZiAoIWF0b20uY29uZmlnLmdldCgnd2hpdGVzcGFjZS5pZ25vcmVXaGl0ZXNwYWNlT25seUxpbmVzJywge1xuICAgICAgICAgIHNjb3BlOiBzY29wZURlc2NyaXB0b3JcbiAgICAgICAgfSkpIHtcbiAgICAgICAgICByZXR1cm4gZWRpdG9yLnNldEluZGVudGF0aW9uRm9yQnVmZmVyUm93KGV2ZW50LnJhbmdlLnN0YXJ0LnJvdywgMClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBsZXQgZWRpdG9yRGVzdHJveWVkU3Vic2NyaXB0aW9uID0gZWRpdG9yLm9uRGlkRGVzdHJveSgoKSA9PiB7XG4gICAgICBidWZmZXJTYXZlZFN1YnNjcmlwdGlvbi5kaXNwb3NlKClcbiAgICAgIGVkaXRvclRleHRJbnNlcnRlZFN1YnNjcmlwdGlvbi5kaXNwb3NlKClcbiAgICAgIGVkaXRvckRlc3Ryb3llZFN1YnNjcmlwdGlvbi5kaXNwb3NlKClcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5yZW1vdmUoYnVmZmVyU2F2ZWRTdWJzY3JpcHRpb24pXG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbnMucmVtb3ZlKGVkaXRvclRleHRJbnNlcnRlZFN1YnNjcmlwdGlvbilcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5yZW1vdmUoZWRpdG9yRGVzdHJveWVkU3Vic2NyaXB0aW9uKVxuICAgIH0pXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGJ1ZmZlclNhdmVkU3Vic2NyaXB0aW9uKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoZWRpdG9yVGV4dEluc2VydGVkU3Vic2NyaXB0aW9uKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoZWRpdG9yRGVzdHJveWVkU3Vic2NyaXB0aW9uKVxuICB9XG5cbiAgcmVtb3ZlVHJhaWxpbmdXaGl0ZXNwYWNlIChlZGl0b3IsIGdyYW1tYXJTY29wZU5hbWUpIHtcbiAgICBjb25zdCBidWZmZXIgPSBlZGl0b3IuZ2V0QnVmZmVyKClcbiAgICBjb25zdCBzY29wZURlc2NyaXB0b3IgPSBlZGl0b3IuZ2V0Um9vdFNjb3BlRGVzY3JpcHRvcigpXG4gICAgY29uc3QgY3Vyc29yUm93cyA9IG5ldyBTZXQoZWRpdG9yLmdldEN1cnNvcnMoKS5tYXAoY3Vyc29yID0+IGN1cnNvci5nZXRCdWZmZXJSb3coKSkpXG5cbiAgICBjb25zdCBpZ25vcmVDdXJyZW50TGluZSA9IGF0b20uY29uZmlnLmdldCgnd2hpdGVzcGFjZS5pZ25vcmVXaGl0ZXNwYWNlT25DdXJyZW50TGluZScsIHtcbiAgICAgIHNjb3BlOiBzY29wZURlc2NyaXB0b3JcbiAgICB9KVxuXG4gICAgY29uc3QgaWdub3JlV2hpdGVzcGFjZU9ubHlMaW5lcyA9IGF0b20uY29uZmlnLmdldCgnd2hpdGVzcGFjZS5pZ25vcmVXaGl0ZXNwYWNlT25seUxpbmVzJywge1xuICAgICAgc2NvcGU6IHNjb3BlRGVzY3JpcHRvclxuICAgIH0pXG5cbiAgICBjb25zdCBrZWVwTWFya2Rvd25MaW5lQnJlYWtXaGl0ZXNwYWNlID1cbiAgICAgIGdyYW1tYXJTY29wZU5hbWUgPT09ICdzb3VyY2UuZ2ZtJyAmJlxuICAgICAgYXRvbS5jb25maWcuZ2V0KCd3aGl0ZXNwYWNlLmtlZXBNYXJrZG93bkxpbmVCcmVha1doaXRlc3BhY2UnKVxuXG4gICAgYnVmZmVyLnRyYW5zYWN0KCgpID0+IHtcbiAgICAgIC8vIFRPRE8gLSByZW1vdmUgdGhpcyBjb25kaXRpb25hbCBhZnRlciBBdG9tIDEuMTkgc3RhYmxlIGlzIHJlbGVhc2VkLlxuICAgICAgaWYgKGJ1ZmZlci5maW5kQWxsU3luYykge1xuICAgICAgICBjb25zdCByYW5nZXMgPSBidWZmZXIuZmluZEFsbFN5bmMoVFJBSUxJTkdfV0hJVEVTUEFDRV9SRUdFWClcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIG4gPSByYW5nZXMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgY29uc3QgcmFuZ2UgPSByYW5nZXNbaV1cbiAgICAgICAgICBjb25zdCByb3cgPSByYW5nZS5zdGFydC5yb3dcbiAgICAgICAgICBjb25zdCB0cmFpbGluZ1doaXRlc3BhY2VTdGFydCA9IHJhbmdlc1tpXS5zdGFydC5jb2x1bW5cbiAgICAgICAgICBpZiAoaWdub3JlQ3VycmVudExpbmUgJiYgY3Vyc29yUm93cy5oYXMocm93KSkgY29udGludWVcbiAgICAgICAgICBpZiAoaWdub3JlV2hpdGVzcGFjZU9ubHlMaW5lcyAmJiB0cmFpbGluZ1doaXRlc3BhY2VTdGFydCA9PT0gMCkgY29udGludWVcbiAgICAgICAgICBpZiAoa2VlcE1hcmtkb3duTGluZUJyZWFrV2hpdGVzcGFjZSkge1xuICAgICAgICAgICAgY29uc3Qgd2hpdGVzcGFjZUxlbmd0aCA9IHJhbmdlLmVuZC5jb2x1bW4gLSByYW5nZS5zdGFydC5jb2x1bW5cbiAgICAgICAgICAgIGlmICh0cmFpbGluZ1doaXRlc3BhY2VTdGFydCA+IDAgJiYgd2hpdGVzcGFjZUxlbmd0aCA+PSAyKSBjb250aW51ZVxuICAgICAgICAgIH1cbiAgICAgICAgICBidWZmZXIuZGVsZXRlKHJhbmdlc1tpXSlcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9yIChsZXQgcm93ID0gMCwgbGluZUNvdW50ID0gYnVmZmVyLmdldExpbmVDb3VudCgpOyByb3cgPCBsaW5lQ291bnQ7IHJvdysrKSB7XG4gICAgICAgICAgY29uc3QgbGluZSA9IGJ1ZmZlci5saW5lRm9yUm93KHJvdylcbiAgICAgICAgICBjb25zdCBsYXN0Q2hhcmFjdGVyID0gbGluZVtsaW5lLmxlbmd0aCAtIDFdXG4gICAgICAgICAgaWYgKGxhc3RDaGFyYWN0ZXIgPT09ICcgJyB8fCBsYXN0Q2hhcmFjdGVyID09PSAnXFx0Jykge1xuICAgICAgICAgICAgY29uc3QgdHJhaWxpbmdXaGl0ZXNwYWNlU3RhcnQgPSBsaW5lLnNlYXJjaChUUkFJTElOR19XSElURVNQQUNFX1JFR0VYKVxuICAgICAgICAgICAgaWYgKGlnbm9yZUN1cnJlbnRMaW5lICYmIGN1cnNvclJvd3MuaGFzKHJvdykpIGNvbnRpbnVlXG4gICAgICAgICAgICBpZiAoaWdub3JlV2hpdGVzcGFjZU9ubHlMaW5lcyAmJiB0cmFpbGluZ1doaXRlc3BhY2VTdGFydCA9PT0gMCkgY29udGludWVcbiAgICAgICAgICAgIGlmIChrZWVwTWFya2Rvd25MaW5lQnJlYWtXaGl0ZXNwYWNlKSB7XG4gICAgICAgICAgICAgIGNvbnN0IHdoaXRlc3BhY2VMZW5ndGggPSBsaW5lLmxlbmd0aCAtIHRyYWlsaW5nV2hpdGVzcGFjZVN0YXJ0XG4gICAgICAgICAgICAgIGlmICh0cmFpbGluZ1doaXRlc3BhY2VTdGFydCA+IDAgJiYgd2hpdGVzcGFjZUxlbmd0aCA+PSAyKSBjb250aW51ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnVmZmVyLmRlbGV0ZShSYW5nZShQb2ludChyb3csIHRyYWlsaW5nV2hpdGVzcGFjZVN0YXJ0KSwgUG9pbnQocm93LCBsaW5lLmxlbmd0aCkpKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBlbnN1cmVTaW5nbGVUcmFpbGluZ05ld2xpbmUgKGVkaXRvcikge1xuICAgIGxldCBzZWxlY3RlZEJ1ZmZlclJhbmdlc1xuICAgIGxldCByb3dcbiAgICBsZXQgYnVmZmVyID0gZWRpdG9yLmdldEJ1ZmZlcigpXG4gICAgbGV0IGxhc3RSb3cgPSBidWZmZXIuZ2V0TGFzdFJvdygpXG5cbiAgICBpZiAoYnVmZmVyLmxpbmVGb3JSb3cobGFzdFJvdykgPT09ICcnKSB7XG4gICAgICByb3cgPSBsYXN0Um93IC0gMVxuXG4gICAgICB3aGlsZSAocm93ICYmIGJ1ZmZlci5saW5lRm9yUm93KHJvdykgPT09ICcnKSB7XG4gICAgICAgIGJ1ZmZlci5kZWxldGVSb3cocm93LS0pXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHNlbGVjdGVkQnVmZmVyUmFuZ2VzID0gZWRpdG9yLmdldFNlbGVjdGVkQnVmZmVyUmFuZ2VzKClcbiAgICAgIGJ1ZmZlci5hcHBlbmQoJ1xcbicpXG4gICAgICBlZGl0b3Iuc2V0U2VsZWN0ZWRCdWZmZXJSYW5nZXMoc2VsZWN0ZWRCdWZmZXJSYW5nZXMpXG4gICAgfVxuICB9XG5cbiAgY29udmVydFRhYnNUb1NwYWNlcyAoZWRpdG9yLCBjb252ZXJ0QWxsVGFicykge1xuICAgIGxldCBidWZmZXIgPSBlZGl0b3IuZ2V0QnVmZmVyKClcbiAgICBsZXQgc3BhY2VzVGV4dCA9IG5ldyBBcnJheShlZGl0b3IuZ2V0VGFiTGVuZ3RoKCkgKyAxKS5qb2luKCcgJylcbiAgICBsZXQgcmVnZXggPSAoY29udmVydEFsbFRhYnMgPyAvXFx0L2cgOiAvXlxcdCsvZylcblxuICAgIGJ1ZmZlci50cmFuc2FjdChmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gYnVmZmVyLnNjYW4ocmVnZXgsIGZ1bmN0aW9uICh7cmVwbGFjZX0pIHtcbiAgICAgICAgcmV0dXJuIHJlcGxhY2Uoc3BhY2VzVGV4dClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIHJldHVybiBlZGl0b3Iuc2V0U29mdFRhYnModHJ1ZSlcbiAgfVxuXG4gIGNvbnZlcnRTcGFjZXNUb1RhYnMgKGVkaXRvcikge1xuICAgIGxldCBidWZmZXIgPSBlZGl0b3IuZ2V0QnVmZmVyKClcbiAgICBsZXQgc2NvcGUgPSBlZGl0b3IuZ2V0Um9vdFNjb3BlRGVzY3JpcHRvcigpXG4gICAgbGV0IGZpbGVUYWJTaXplID0gZWRpdG9yLmdldFRhYkxlbmd0aCgpXG5cbiAgICBsZXQgdXNlclRhYlNpemUgPSBhdG9tLmNvbmZpZy5nZXQoJ2VkaXRvci50YWJMZW5ndGgnLCB7XG4gICAgICBzY29wZTogc2NvcGVcbiAgICB9KVxuXG4gICAgbGV0IHJlZ2V4ID0gbmV3IFJlZ0V4cCgnICcucmVwZWF0KGZpbGVUYWJTaXplKSwgJ2cnKVxuXG4gICAgYnVmZmVyLnRyYW5zYWN0KGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBidWZmZXIuc2NhbigvXlsgXFx0XSsvZywgZnVuY3Rpb24gKHttYXRjaFRleHQsIHJlcGxhY2V9KSB7XG4gICAgICAgIHJldHVybiByZXBsYWNlKG1hdGNoVGV4dC5yZXBsYWNlKHJlZ2V4LCAnXFx0JykucmVwbGFjZSgvWyBdK1xcdC9nLCAnXFx0JykpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBlZGl0b3Iuc2V0U29mdFRhYnMoZmFsc2UpXG5cbiAgICBpZiAoZmlsZVRhYlNpemUgIT09IHVzZXJUYWJTaXplKSB7XG4gICAgICByZXR1cm4gZWRpdG9yLnNldFRhYkxlbmd0aCh1c2VyVGFiU2l6ZSlcbiAgICB9XG4gIH1cbn1cbiJdfQ==