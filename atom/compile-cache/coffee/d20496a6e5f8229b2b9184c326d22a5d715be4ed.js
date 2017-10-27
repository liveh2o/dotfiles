(function() {
  var CompositeDisposable, Whitespace,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = Whitespace = (function() {
    function Whitespace() {
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          return _this.handleEvents(editor);
        };
      })(this)));
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'whitespace:remove-trailing-whitespace': (function(_this) {
          return function() {
            var editor;
            if (editor = atom.workspace.getActiveTextEditor()) {
              return _this.removeTrailingWhitespace(editor, editor.getGrammar().scopeName);
            }
          };
        })(this),
        'whitespace:save-with-trailing-whitespace': (function(_this) {
          return function() {
            var editor;
            if (editor = atom.workspace.getActiveTextEditor()) {
              _this.ignore = true;
              editor.save();
              return _this.ignore = false;
            }
          };
        })(this),
        'whitespace:save-without-trailing-whitespace': (function(_this) {
          return function() {
            var editor;
            if (editor = atom.workspace.getActiveTextEditor()) {
              _this.removeTrailingWhitespace(editor, editor.getGrammar().scopeName);
              return editor.save();
            }
          };
        })(this),
        'whitespace:convert-tabs-to-spaces': (function(_this) {
          return function() {
            var editor;
            if (editor = atom.workspace.getActiveTextEditor()) {
              return _this.convertTabsToSpaces(editor);
            }
          };
        })(this),
        'whitespace:convert-spaces-to-tabs': (function(_this) {
          return function() {
            var editor;
            if (editor = atom.workspace.getActiveTextEditor()) {
              return _this.convertSpacesToTabs(editor);
            }
          };
        })(this),
        'whitespace:convert-all-tabs-to-spaces': (function(_this) {
          return function() {
            var editor;
            if (editor = atom.workspace.getActiveTextEditor()) {
              return _this.convertTabsToSpaces(editor, true);
            }
          };
        })(this)
      }));
    }

    Whitespace.prototype.destroy = function() {
      return this.subscriptions.dispose();
    };

    Whitespace.prototype.handleEvents = function(editor) {
      var buffer, bufferSavedSubscription, editorDestroyedSubscription, editorTextInsertedSubscription;
      buffer = editor.getBuffer();
      bufferSavedSubscription = buffer.onWillSave((function(_this) {
        return function() {
          return buffer.transact(function() {
            var scopeDescriptor;
            scopeDescriptor = editor.getRootScopeDescriptor();
            if (atom.config.get('whitespace.removeTrailingWhitespace', {
              scope: scopeDescriptor
            }) && !_this.ignore) {
              _this.removeTrailingWhitespace(editor, editor.getGrammar().scopeName);
            }
            if (atom.config.get('whitespace.ensureSingleTrailingNewline', {
              scope: scopeDescriptor
            })) {
              return _this.ensureSingleTrailingNewline(editor);
            }
          });
        };
      })(this));
      editorTextInsertedSubscription = editor.onDidInsertText(function(event) {
        var scopeDescriptor;
        if (event.text !== '\n') {
          return;
        }
        if (!buffer.isRowBlank(event.range.start.row)) {
          return;
        }
        scopeDescriptor = editor.getRootScopeDescriptor();
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
      editorDestroyedSubscription = editor.onDidDestroy((function(_this) {
        return function() {
          bufferSavedSubscription.dispose();
          editorTextInsertedSubscription.dispose();
          editorDestroyedSubscription.dispose();
          _this.subscriptions.remove(bufferSavedSubscription);
          _this.subscriptions.remove(editorTextInsertedSubscription);
          return _this.subscriptions.remove(editorDestroyedSubscription);
        };
      })(this));
      this.subscriptions.add(bufferSavedSubscription);
      this.subscriptions.add(editorTextInsertedSubscription);
      return this.subscriptions.add(editorDestroyedSubscription);
    };

    Whitespace.prototype.removeTrailingWhitespace = function(editor, grammarScopeName) {
      var buffer, ignoreCurrentLine, ignoreWhitespaceOnlyLines, scopeDescriptor;
      buffer = editor.getBuffer();
      scopeDescriptor = editor.getRootScopeDescriptor();
      ignoreCurrentLine = atom.config.get('whitespace.ignoreWhitespaceOnCurrentLine', {
        scope: scopeDescriptor
      });
      ignoreWhitespaceOnlyLines = atom.config.get('whitespace.ignoreWhitespaceOnlyLines', {
        scope: scopeDescriptor
      });
      return buffer.backwardsScan(/[ \t]+$/g, function(_arg) {
        var cursor, cursorRows, lineText, match, replace, whitespace, whitespaceRow;
        lineText = _arg.lineText, match = _arg.match, replace = _arg.replace;
        whitespaceRow = buffer.positionForCharacterIndex(match.index).row;
        cursorRows = (function() {
          var _i, _len, _ref, _results;
          _ref = editor.getCursors();
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            cursor = _ref[_i];
            _results.push(cursor.getBufferRow());
          }
          return _results;
        })();
        if (ignoreCurrentLine && __indexOf.call(cursorRows, whitespaceRow) >= 0) {
          return;
        }
        whitespace = match[0];
        if (ignoreWhitespaceOnlyLines && whitespace === lineText) {
          return;
        }
        if (grammarScopeName === 'source.gfm' && atom.config.get('whitespace.keepMarkdownLineBreakWhitespace')) {
          if (!(whitespace.length >= 2 && whitespace !== lineText)) {
            return replace('');
          }
        } else {
          return replace('');
        }
      });
    };

    Whitespace.prototype.ensureSingleTrailingNewline = function(editor) {
      var buffer, lastRow, row, selectedBufferRanges, _results;
      buffer = editor.getBuffer();
      lastRow = buffer.getLastRow();
      if (buffer.lineForRow(lastRow) === '') {
        row = lastRow - 1;
        _results = [];
        while (row && buffer.lineForRow(row) === '') {
          _results.push(buffer.deleteRow(row--));
        }
        return _results;
      } else {
        selectedBufferRanges = editor.getSelectedBufferRanges();
        buffer.append('\n');
        return editor.setSelectedBufferRanges(selectedBufferRanges);
      }
    };

    Whitespace.prototype.convertTabsToSpaces = function(editor, convertAllTabs) {
      var buffer, regex, spacesText;
      buffer = editor.getBuffer();
      spacesText = new Array(editor.getTabLength() + 1).join(' ');
      regex = convertAllTabs ? /\t/g : /^\t+/g;
      buffer.transact(function() {
        return buffer.scan(regex, function(_arg) {
          var replace;
          replace = _arg.replace;
          return replace(spacesText);
        });
      });
      return editor.setSoftTabs(true);
    };

    Whitespace.prototype.convertSpacesToTabs = function(editor) {
      var buffer, fileTabSize, regex, scope, userTabSize;
      buffer = editor.getBuffer();
      scope = editor.getRootScopeDescriptor();
      fileTabSize = editor.getTabLength();
      userTabSize = atom.config.get('editor.tabLength', {
        scope: scope
      });
      regex = new RegExp(' '.repeat(fileTabSize), 'g');
      buffer.transact(function() {
        return buffer.scan(/^[ \t]+/g, function(_arg) {
          var matchText, replace;
          matchText = _arg.matchText, replace = _arg.replace;
          return replace(matchText.replace(regex, "\t").replace(/[ ]+\t/g, "\t"));
        });
      });
      editor.setSoftTabs(false);
      if (fileTabSize !== userTabSize) {
        return editor.setTabLength(userTabSize);
      }
    };

    return Whitespace;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3doaXRlc3BhY2UvbGliL3doaXRlc3BhY2UuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLCtCQUFBO0lBQUEscUpBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDUyxJQUFBLG9CQUFBLEdBQUE7QUFDWCxNQUFBLElBQUMsQ0FBQSxhQUFELEdBQWlCLEdBQUEsQ0FBQSxtQkFBakIsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWYsQ0FBa0MsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsTUFBRCxHQUFBO2lCQUNuRCxLQUFDLENBQUEsWUFBRCxDQUFjLE1BQWQsRUFEbUQ7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFsQyxDQUFuQixDQURBLENBQUE7QUFBQSxNQUlBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQ2pCO0FBQUEsUUFBQSx1Q0FBQSxFQUF5QyxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTtBQUN2QyxnQkFBQSxNQUFBO0FBQUEsWUFBQSxJQUFHLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBWjtxQkFDRSxLQUFDLENBQUEsd0JBQUQsQ0FBMEIsTUFBMUIsRUFBa0MsTUFBTSxDQUFDLFVBQVAsQ0FBQSxDQUFtQixDQUFDLFNBQXRELEVBREY7YUFEdUM7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEs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

//# sourceURL=/Users/ah/.atom/packages/whitespace/lib/whitespace.coffee
