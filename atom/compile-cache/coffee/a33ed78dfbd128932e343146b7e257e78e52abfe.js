(function() {
  var findFile, log, moveToLine, moveToNextMessage, moveToPreviousMessage, warn,
    __slice = [].slice;

  findFile = require('./util');

  log = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    if (atom.config.get('linter.lintDebug')) {
      return console.log.apply(console, args);
    }
  };

  warn = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    if (atom.config.get('linter.lintDebug')) {
      return console.warn.apply(console, args);
    }
  };

  moveToPreviousMessage = function(messages, editor) {
    var cursorLine, lastLine, line, previousLine, _i, _len, _ref;
    cursorLine = editor.getCursorBufferPosition().row + 1;
    previousLine = -1;
    lastLine = -1;
    _ref = messages != null ? messages : [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      line = _ref[_i].line;
      if (line < cursorLine) {
        previousLine = Math.max(line - 1, previousLine);
      }
      lastLine = Math.max(line - 1, lastLine);
    }
    if (previousLine === -1) {
      previousLine = lastLine;
    }
    return moveToLine(editor, previousLine);
  };

  moveToNextMessage = function(messages, editor) {
    var cursorLine, firstLine, line, nextLine, _i, _len, _ref;
    cursorLine = editor.getCursorBufferPosition().row + 1;
    nextLine = null;
    firstLine = null;
    _ref = messages != null ? messages : [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      line = _ref[_i].line;
      if (line > cursorLine) {
        if (nextLine == null) {
          nextLine = line - 1;
        }
        nextLine = Math.min(line - 1, nextLine);
      }
      if (firstLine == null) {
        firstLine = line - 1;
      }
      firstLine = Math.min(line - 1, firstLine);
    }
    if (nextLine == null) {
      nextLine = firstLine;
    }
    return moveToLine(editor, nextLine);
  };

  moveToLine = function(editor, n) {
    if (n == null) {
      n = -1;
    }
    if (n >= 0) {
      editor.setCursorBufferPosition([n, 0]);
      return editor.moveToFirstCharacterOfLine();
    }
  };

  module.exports = {
    log: log,
    warn: warn,
    findFile: findFile,
    moveToPreviousMessage: moveToPreviousMessage,
    moveToNextMessage: moveToNextMessage
  };

}).call(this);
