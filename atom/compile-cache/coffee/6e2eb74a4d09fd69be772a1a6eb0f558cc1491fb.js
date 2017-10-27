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
      var buffer, bufferSavedSubscription, editorDestroyedSubscription;
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
      editorDestroyedSubscription = editor.onDidDestroy((function(_this) {
        return function() {
          bufferSavedSubscription.dispose();
          editorDestroyedSubscription.dispose();
          _this.subscriptions.remove(bufferSavedSubscription);
          return _this.subscriptions.remove(editorDestroyedSubscription);
        };
      })(this));
      this.subscriptions.add(bufferSavedSubscription);
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
