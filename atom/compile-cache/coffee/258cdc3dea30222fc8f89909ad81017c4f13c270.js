(function() {
  var path;

  path = require("path");

  module.exports = {
    splitProjectPath: function(filePath) {
      var projectPath, _i, _len, _ref;
      _ref = atom.project.getPaths();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        projectPath = _ref[_i];
        if (filePath === projectPath || filePath.startsWith(projectPath + path.sep)) {
          return [projectPath, path.relative(projectPath, filePath)];
        }
      }
      return [null, filePath];
    },
    repositoryForPath: function(filePath) {
      var i, projectPath, _i, _len, _ref;
      _ref = atom.project.getPaths();
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        projectPath = _ref[i];
        if (filePath === projectPath || filePath.startsWith(projectPath + path.sep)) {
          return atom.project.getRepositories()[i];
        }
      }
      return null;
    }
  };

}).call(this);
