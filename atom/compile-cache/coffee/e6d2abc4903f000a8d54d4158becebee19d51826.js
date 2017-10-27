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
            if (atom.config.get(scopeDescriptor, 'whitespace.removeTrailingWhitespace')) {
              _this.removeTrailingWhitespace(editor, editor.getGrammar().scopeName);
            }
            if (atom.config.get(scopeDescriptor, 'whitespace.ensureSingleTrailingNewline')) {
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
      ignoreCurrentLine = atom.config.get(scopeDescriptor, 'whitespace.ignoreWhitespaceOnCurrentLine');
      ignoreWhitespaceOnlyLines = atom.config.get(scopeDescriptor, 'whitespace.ignoreWhitespaceOnlyLines');
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