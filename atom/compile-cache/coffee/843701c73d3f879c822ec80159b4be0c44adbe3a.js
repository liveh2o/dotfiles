(function() {
  var Subscriber, Whitespace,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Subscriber = require('emissary').Subscriber;

  module.exports = Whitespace = (function() {
    Subscriber.includeInto(Whitespace);

    function Whitespace() {
      this.subscribe(atom.workspace.eachEditor((function(_this) {
        return function(editor) {
          return _this.handleEvents(editor);
        };
      })(this)));
      this.subscribe(atom.workspaceView.command('whitespace:remove-trailing-whitespace', (function(_this) {
        return function() {
          var editor;
          if (editor = atom.workspace.getActiveEditor()) {
            return _this.removeTrailingWhitespace(editor, editor.getGrammar().scopeName);
          }
        };
      })(this)));
      this.subscribe(atom.workspaceView.command('whitespace:convert-tabs-to-spaces', (function(_this) {
        return function() {
          var editor;
          if (editor = atom.workspace.getActiveEditor()) {
            return _this.convertTabsToSpaces(editor);
          }
        };
      })(this)));
    }

    Whitespace.prototype.destroy = function() {
      return this.unsubscribe();
    };

    Whitespace.prototype.handleEvents = function(editor) {
      var buffer, bufferSavedSubscription;
      buffer = editor.getBuffer();
      bufferSavedSubscription = this.subscribe(buffer, 'will-be-saved', (function(_this) {
        return function() {
          return buffer.transact(function() {
            if (atom.config.get('whitespace.removeTrailingWhitespace')) {
              _this.removeTrailingWhitespace(editor, editor.getGrammar().scopeName);
            }
            if (atom.config.get('whitespace.ensureSingleTrailingNewline')) {
              return _this.ensureSingleTrailingNewline(editor);
            }
          });
        };
      })(this));
      this.subscribe(editor, 'destroyed', (function(_this) {
        return function() {
          bufferSavedSubscription.off();
          return _this.unsubscribe(editor);
        };
      })(this));
      return this.subscribe(buffer, 'destroyed', (function(_this) {
        return function() {
          return _this.unsubscribe(buffer);
        };
      })(this));
    };

    Whitespace.prototype.removeTrailingWhitespace = function(editor, grammarScopeName) {
      var buffer, ignoreCurrentLine, ignoreWhitespaceOnlyLines;
      buffer = editor.getBuffer();
      ignoreCurrentLine = atom.config.get('whitespace.ignoreWhitespaceOnCurrentLine');
      ignoreWhitespaceOnlyLines = atom.config.get('whitespace.ignoreWhitespaceOnlyLines');
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

    return Whitespace;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNCQUFBO0lBQUEscUpBQUE7O0FBQUEsRUFBQyxhQUFjLE9BQUEsQ0FBUSxVQUFSLEVBQWQsVUFBRCxDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLElBQUEsVUFBVSxDQUFDLFdBQVgsQ0FBdUIsVUFBdkIsQ0FBQSxDQUFBOztBQUVhLElBQUEsb0JBQUEsR0FBQTtBQUNYLE1BQUEsSUFBQyxDQUFBLFNBQUQsQ0FBVyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQWYsQ0FBMEIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsTUFBRCxHQUFBO2lCQUNuQyxLQUFDLENBQUEsWUFBRCxDQUFjLE1BQWQsRUFEbUM7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUExQixDQUFYLENBQUEsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLFNBQUQsQ0FBVyxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQW5CLENBQTJCLHVDQUEzQixFQUFvRSxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQzdFLGNBQUEsTUFBQTtBQUFBLFVBQUEsSUFBRyxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxlQUFmLENBQUEsQ0FBWjttQkFDRSxLQUFDLENBQUEsd0JBQUQsQ0FBMEIsTUFBMUIsRUFBa0MsTUFBTSxDQUFDLFVBQVAsQ0FBQSxDQUFtQixDQUFDLFNBQXRELEVBREY7V0FENkU7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFwRSxDQUFYLENBSEEsQ0FBQTtBQUFBLE1BT0EsSUFBQyxDQUFBLFNBQUQsQ0FBVyxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQW5CLENBQTJCLG1DQUEzQixFQUFnRSxDQUFBLFNBQUEsS0FB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
//# sourceURL=/Users/ah/.atom/packages/whitespace/lib/whitespace.coffee