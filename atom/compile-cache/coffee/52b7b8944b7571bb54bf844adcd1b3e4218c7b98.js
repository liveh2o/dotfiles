(function() {
  var getEditor, getLinesToJump;

  getEditor = function() {
    return atom.workspace.getActiveTextEditor();
  };

  getLinesToJump = function() {
    return atom.config.get('line-jumper.numberOfLines');
  };

  module.exports = {
    config: {
      numberOfLines: {
        type: 'integer',
        "default": 10,
        minimum: 1
      }
    },
    activate: function() {
      atom.commands.add('atom-workspace', 'line-jumper:move-up', function() {
        var _ref;
        return (_ref = getEditor()) != null ? _ref.moveUp(getLinesToJump()) : void 0;
      });
      atom.commands.add('atom-workspace', 'line-jumper:move-down', function() {
        var _ref;
        return (_ref = getEditor()) != null ? _ref.moveDown(getLinesToJump()) : void 0;
      });
      atom.commands.add('atom-workspace', 'line-jumper:select-up', function() {
        var _ref;
        return (_ref = getEditor()) != null ? _ref.selectUp(getLinesToJump()) : void 0;
      });
      return atom.commands.add('atom-workspace', 'line-jumper:select-down', function() {
        var _ref;
        return (_ref = getEditor()) != null ? _ref.selectDown(getLinesToJump()) : void 0;
      });
    }
  };

}).call(this);
