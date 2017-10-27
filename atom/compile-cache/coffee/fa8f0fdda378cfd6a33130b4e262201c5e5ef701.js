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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNCQUFBO0lBQUEscUpBQUE7O0FBQUEsRUFBQyxhQUFjLE9BQUEsQ0FBUSxVQUFSLEVBQWQsVUFBRCxDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLElBQUEsVUFBVSxDQUFDLFdBQVgsQ0FBdUIsVUFBdkIsQ0FBQSxDQUFBOztBQUVhLElBQUEsb0JBQUEsR0FBQTtBQUNYLE1BQUEsSUFBQyxDQUFBLFNBQUQsQ0FBVyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQWYsQ0FBMEIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsTUFBRCxHQUFBO2lCQUNuQyxLQUFDLENBQUEsWUFBRCxDQUFjLE1BQWQsRUFEbUM7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUExQixDQUFYLENBQUEsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLGtCQUFELENBQW9CLElBQUksQ0FBQyxhQUF6QixFQUF3Qyx1Q0FBeEMsRUFBaUYsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUMvRSxjQUFBLE1BQUE7QUFBQSxVQUFBLElBQUcsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsZUFBZixDQUFBLENBQVo7bUJBQ0UsS0FBQyxDQUFBLHdCQUFELENBQTBCLE1BQTFCLEVBQWtDLE1BQU0sQ0FBQyxVQUFQLENBQUEsQ0FBbUIsQ0FBQyxTQUF0RCxFQURGO1dBRCtFO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBakYsQ0FIQSxDQUFBO0FBQUEsTUFPQSxJQUFDLENBQUEsa0JBQUQsQ0FBb0IsSUFBSSxDQUFDLGFBQXpCLEVBQXdDLG1DQUF4QyxFQUE2RSxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFB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
//# sourceURL=/Users/ah/.atom/packages/whitespace/lib/whitespace.coffee