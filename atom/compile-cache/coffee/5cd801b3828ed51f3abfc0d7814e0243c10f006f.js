(function() {
  var Task;

  Task = require('atom').Task;

  module.exports = {
    startTask: function(callback) {
      var ignoreVcsIgnores, ignoredNames, projectPaths, task, taskPath, traverseIntoSymlinkDirectories, _ref, _ref1;
      projectPaths = [];
      taskPath = require.resolve('./load-paths-handler');
      traverseIntoSymlinkDirectories = atom.config.get('fuzzy-finder.traverseIntoSymlinkDirectories');
      ignoredNames = (_ref = atom.config.get('fuzzy-finder.ignoredNames')) != null ? _ref : [];
      ignoredNames = ignoredNames.concat((_ref1 = atom.config.get('core.ignoredNames')) != null ? _ref1 : []);
      ignoreVcsIgnores = atom.config.get('core.excludeVcsIgnoredPaths');
      task = Task.once(taskPath, atom.project.getPaths(), traverseIntoSymlinkDirectories, ignoreVcsIgnores, ignoredNames, function() {
        return callback(projectPaths);
      });
      task.on('load-paths:paths-found', function(paths) {
        return projectPaths.push.apply(projectPaths, paths);
      });
      return task;
    }
  };

}).call(this);
