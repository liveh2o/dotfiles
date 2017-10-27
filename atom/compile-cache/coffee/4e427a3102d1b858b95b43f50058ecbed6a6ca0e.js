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
      this.subscribeToCommand(atom.workspaceView, 'whitespace:remove-trailing-whitespace', (function(_this) {
        return function() {
          var editor;
          if (editor = atom.workspace.getActiveEditor()) {
            return _this.removeTrailingWhitespace(editor, editor.getGrammar().scopeName);
          }
        };
      })(this));
      this.subscribeToCommand(atom.workspaceView, 'whitespace:convert-tabs-to-spaces', (function(_this) {
        return function() {
          var editor;
          if (editor = atom.workspace.getActiveEditor()) {
            return _this.convertTabsToSpaces(editor);
          }
        };
      })(this));
      this.subscribeToCommand(atom.workspaceView, 'whitespace:convert-spaces-to-tabs', (function(_this) {
        return function() {
          var editor;
          if (editor = atom.workspace.getActiveEditor()) {
            return _this.convertSpacesToTabs(editor);
          }
        };
      })(this));
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNCQUFBO0lBQUEscUpBQUE7O0FBQUEsRUFBQyxhQUFjLE9BQUEsQ0FBUSxVQUFSLEVBQWQsVUFBRCxDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLElBQUEsVUFBVSxDQUFDLFdBQVgsQ0FBdUIsVUFBdkIsQ0FBQSxDQUFBOztBQUVhLElBQUEsb0JBQUEsR0FBQTtBQUNYLE1BQUEsSUFBQyxDQUFBLFNBQUQsQ0FBVyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQWYsQ0FBMEIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsTUFBRCxHQUFBO2lCQUNuQyxLQUFDLENBQUEsWUFBRCxDQUFjLE1BQWQsRUFEbUM7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUExQixDQUFYLENBQUEsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLGtCQUFELENBQW9CLElBQUksQ0FBQyxhQUF6QixFQUF3Qyx1Q0FBeEMsRUFBaUYsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUMvRSxjQUFBLE1BQUE7QUFBQSxVQUFBLElBQUcsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsZUFBZixDQUFBLENBQVo7bUJBQ0UsS0FBQyxDQUFBLHdCQUFELENBQTBCLE1BQTFCLEVBQWtDLE1BQU0sQ0FBQyxVQUFQLENBQUEsQ0FBbUIsQ0FBQyxTQUF0RCxFQURGO1dBRCtFO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBakYsQ0FIQSxDQUFBO0FBQUEsTUFPQSxJQUFDLENBQUEsa0JBQUQsQ0FBb0IsSUFBSSxDQUFDLGFBQXpCLEVBQXdDLG1DQUF4QyxFQUE2RSxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFB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
//# sourceURL=/Users/ah/.atom/packages/whitespace/lib/whitespace.coffee