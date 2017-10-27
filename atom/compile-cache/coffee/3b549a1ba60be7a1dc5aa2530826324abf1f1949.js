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
            })) {
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

    Whitespace.prototype.convertTabsToSpaces = function(editor) {
      var buffer, spacesText;
      buffer = editor.getBuffer();
      spacesText = new Array(editor.getTabLength() + 1).join(' ');
      return buffer.transact(function() {
        return buffer.scan(/\t/g, function(_arg) {
          var replace;
          replace = _arg.replace;
          return replace(spacesText);
        });
      });
    };

    Whitespace.prototype.convertSpacesToTabs = function(editor) {
      var buffer, spacesText;
      buffer = editor.getBuffer();
      spacesText = new Array(editor.getTabLength() + 1).join(' ');
      return buffer.transact(function() {
        return buffer.scan(new RegExp(spacesText, 'g'), function(_arg) {
          var replace;
          replace = _arg.replace;
          return replace('\t');
        });
      });
    };

    return Whitespace;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3doaXRlc3BhY2UvbGliL3doaXRlc3BhY2UuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLCtCQUFBO0lBQUEscUpBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDUyxJQUFBLG9CQUFBLEdBQUE7QUFDWCxNQUFBLElBQUMsQ0FBQSxhQUFELEdBQWlCLEdBQUEsQ0FBQSxtQkFBakIsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWYsQ0FBa0MsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsTUFBRCxHQUFBO2lCQUNuRCxLQUFDLENBQUEsWUFBRCxDQUFjLE1BQWQsRUFEbUQ7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFsQyxDQUFuQixDQURBLENBQUE7QUFBQSxNQUlBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQ2pCO0FBQUEsUUFBQSx1Q0FBQSxFQUF5QyxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTtBQUN2QyxnQkFBQSxNQUFBO0FBQUEsWUFBQSxJQUFHLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBWjtxQkFDRSxLQUFDLENBQUEsd0JBQUQsQ0FBMEIsTUFBMUIsRUFBa0MsTUFBTSxDQUFDLFVBQVAsQ0FBQSxDQUFtQixDQUFDLFNBQXRELEVBREY7YUFEdUM7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEs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

//# sourceURL=/Users/ah/.atom/packages/whitespace/lib/whitespace.coffee
