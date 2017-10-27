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

    return Whitespace;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNCQUFBO0lBQUEscUpBQUE7O0FBQUEsRUFBQyxhQUFjLE9BQUEsQ0FBUSxVQUFSLEVBQWQsVUFBRCxDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLElBQUEsVUFBVSxDQUFDLFdBQVgsQ0FBdUIsVUFBdkIsQ0FBQSxDQUFBOztBQUVhLElBQUEsb0JBQUEsR0FBQTtBQUNYLE1BQUEsSUFBQyxDQUFBLFNBQUQsQ0FBVyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQWYsQ0FBMEIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsTUFBRCxHQUFBO2lCQUNuQyxLQUFDLENBQUEsWUFBRCxDQUFjLE1BQWQsRUFEbUM7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUExQixDQUFYLENBQUEsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLFNBQUQsQ0FBVyxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQW5CLENBQTJCLHVDQUEzQixFQUFvRSxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQzdFLGNBQUEsTUFBQTtBQUFBLFVBQUEsSUFBRyxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxlQUFmLENBQUEsQ0FBWjttQkFDRSxLQUFDLENBQUEsd0JBQUQsQ0FBMEIsTUFBMUIsRUFBa0MsTUFBTSxDQUFDLFVBQVAsQ0FBQSxDQUFtQixDQUFDLFNBQXRELEVBREY7V0FENkU7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFwRSxDQUFYLENBSEEsQ0FEVztJQUFBLENBRmI7O0FBQUEseUJBVUEsT0FBQSxHQUFTLFNBQUEsR0FBQTthQUNQLElBQUMsQ0FBQSxXQUFELENBQUEsRUFETztJQUFBLENBVlQsQ0FBQTs7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
//# sourceURL=/Users/ah/.atom/packages/whitespace/lib/whitespace.coffee