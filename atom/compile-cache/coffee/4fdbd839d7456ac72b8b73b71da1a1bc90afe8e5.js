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
      var buffer, bufferDestroyedSubscription, bufferSavedSubscription, editorDestroyedSubscription;
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
      editorDestroyedSubscription = editor.onDidDestroy(function() {
        bufferSavedSubscription.dispose();
        return editorDestroyedSubscription.dispose();
      });
      bufferDestroyedSubscription = buffer.onDidDestroy(function() {
        bufferDestroyedSubscription.dispose();
        return bufferSavedSubscription.dispose();
      });
      this.subscriptions.add(bufferSavedSubscription);
      this.subscriptions.add(editorDestroyedSubscription);
      return this.subscriptions.add(bufferDestroyedSubscription);
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
        if (grammarScopeName === 'source.gfm') {
          if (!(whitespace === '  ' && whitespace !== lineText)) {
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLCtCQUFBO0lBQUEscUpBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDUyxJQUFBLG9CQUFBLEdBQUE7QUFDWCxNQUFBLElBQUMsQ0FBQSxhQUFELEdBQWlCLEdBQUEsQ0FBQSxtQkFBakIsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWYsQ0FBa0MsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsTUFBRCxHQUFBO2lCQUNuRCxLQUFDLENBQUEsWUFBRCxDQUFjLE1BQWQsRUFEbUQ7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFsQyxDQUFuQixDQURBLENBQUE7QUFBQSxNQUlBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQ2pCO0FBQUEsUUFBQSx1Q0FBQSxFQUF5QyxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTtBQUN2QyxnQkFBQSxNQUFBO0FBQUEsWUFBQSxJQUFHLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBWjtxQkFDRSxLQUFDLENBQUEsd0JBQUQsQ0FBMEIsTUFBMUIsRUFBa0MsTUFBTSxDQUFDLFVBQVAsQ0FBQSxDQUFtQixDQUFDLFNBQXRELEVBREY7YUFEdUM7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF6QztBQUFBLFFBR0EsbUNBQUEsRUFBcUMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFB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
//# sourceURL=/Users/ah/.atom/packages/whitespace/lib/whitespace.coffee