(function() {
  var copyCharacterFromAbove, copyCharacterFromBelow;

  copyCharacterFromAbove = function(editor, vimState) {
    return editor.transact(function() {
      var column, cursor, range, row, _i, _len, _ref, _ref1, _results;
      _ref = editor.getCursors();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        cursor = _ref[_i];
        _ref1 = cursor.getScreenPosition(), row = _ref1.row, column = _ref1.column;
        if (row === 0) {
          continue;
        }
        range = [[row - 1, column], [row - 1, column + 1]];
        _results.push(cursor.selection.insertText(editor.getTextInBufferRange(editor.bufferRangeForScreenRange(range))));
      }
      return _results;
    });
  };

  copyCharacterFromBelow = function(editor, vimState) {
    return editor.transact(function() {
      var column, cursor, range, row, _i, _len, _ref, _ref1, _results;
      _ref = editor.getCursors();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        cursor = _ref[_i];
        _ref1 = cursor.getScreenPosition(), row = _ref1.row, column = _ref1.column;
        range = [[row + 1, column], [row + 1, column + 1]];
        _results.push(cursor.selection.insertText(editor.getTextInBufferRange(editor.bufferRangeForScreenRange(range))));
      }
      return _results;
    });
  };

  module.exports = {
    copyCharacterFromAbove: copyCharacterFromAbove,
    copyCharacterFromBelow: copyCharacterFromBelow
  };

}).call(this);
