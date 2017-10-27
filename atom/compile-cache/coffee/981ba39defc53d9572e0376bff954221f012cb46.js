(function() {
  var Subscriber, Whitespace,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Subscriber = require('emissary').Subscriber;

  module.exports = Whitespace = (function() {
    Subscriber.includeInto(Whitespace);

    function Whitespace() {
      atom.workspace.eachEditor((function(_this) {
        return function(editor) {
          return _this.handleBufferEvents(editor);
        };
      })(this));
    }

    Whitespace.prototype.destroy = function() {
      return this.unsubscribe();
    };

    Whitespace.prototype.handleBufferEvents = function(editor) {
      var buffer;
      buffer = editor.getBuffer();
      this.subscribe(buffer, 'will-be-saved', (function(_this) {
        return function() {
          return buffer.transact(function() {
            if (atom.config.get('whitespace.removeTrailingWhitespace')) {
              _this.removeTrailingWhitespace(editor, editor.getGrammar().scopeName);
            }
            if (atom.config.get('whitespace.ensureSingleTrailingNewline')) {
              return _this.ensureSingleTrailingNewline(buffer);
            }
          });
        };
      })(this));
      return this.subscribe(buffer, 'destroyed', (function(_this) {
        return function() {
          return _this.unsubscribe(buffer);
        };
      })(this));
    };

    Whitespace.prototype.removeTrailingWhitespace = function(editor, grammarScopeName) {
      var buffer, ignoreCurrentLine;
      buffer = editor.getBuffer();
      ignoreCurrentLine = atom.config.get('whitespace.ignoreWhitespaceOnCurrentLine');
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
        if (grammarScopeName === 'source.gfm') {
          whitespace = match[0];
          if (!(whitespace === '  ' && whitespace !== lineText)) {
            return replace('');
          }
        } else {
          return replace('');
        }
      });
    };

    Whitespace.prototype.ensureSingleTrailingNewline = function(buffer) {
      var lastRow, row, _results;
      lastRow = buffer.getLastRow();
      if (buffer.lineForRow(lastRow) === '') {
        row = lastRow - 1;
        _results = [];
        while (row && buffer.lineForRow(row) === '') {
          _results.push(buffer.deleteRow(row--));
        }
        return _results;
      } else {
        return buffer.append('\n');
      }
    };

    return Whitespace;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNCQUFBO0lBQUEscUpBQUE7O0FBQUEsRUFBQyxhQUFjLE9BQUEsQ0FBUSxVQUFSLEVBQWQsVUFBRCxDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLElBQUEsVUFBVSxDQUFDLFdBQVgsQ0FBdUIsVUFBdkIsQ0FBQSxDQUFBOztBQUVhLElBQUEsb0JBQUEsR0FBQTtBQUNYLE1BQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFmLENBQTBCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLE1BQUQsR0FBQTtpQkFDeEIsS0FBQyxDQUFBLGtCQUFELENBQW9CLE1BQXBCLEVBRHdCO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBMUIsQ0FBQSxDQURXO0lBQUEsQ0FGYjs7QUFBQSx5QkFNQSxPQUFBLEdBQVMsU0FBQSxHQUFBO2FBQ1AsSUFBQyxDQUFBLFdBQUQsQ0FBQSxFQURPO0lBQUEsQ0FOVCxDQUFBOztBQUFBLHlCQVNBLGtCQUFBLEdBQW9CLFNBQUMsTUFBRCxHQUFBO0FBQ2xCLFVBQUEsTUFBQTtBQUFBLE1BQUEsTUFBQSxHQUFTLE1BQU0sQ0FBQyxTQUFQLENBQUEsQ0FBVCxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsU0FBRCxDQUFXLE1BQVgsRUFBbUIsZUFBbkIsRUFBb0MsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDbEMsTUFBTSxDQUFDLFFBQVAsQ0FBZ0IsU0FBQSxHQUFBO0FBQ2QsWUFBQSxJQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixxQ0FBaEIsQ0FBSDtBQUNFLGNBQUEsS0FBQyxDQUFBLHdCQUFELENBQTBCLE1BQTFCLEVBQWtDLE1BQU0sQ0FBQyxVQUFQLENBQUEs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
//# sourceURL=/Users/ah/.atom/packages/whitespace/lib/whitespace.coffee