(function() {
  var Task;

  Task = require('atom').Task;

  module.exports = {
    startTask: function(callback) {
      var ignoreVcsIgnores, ignoredNames, projectPaths, task, taskPath, _ref, _ref1, _ref2, _ref3;
      projectPaths = [];
      taskPath = require.resolve('./load-paths-handler');
      ignoredNames = (_ref = atom.config.get('fuzzy-finder.ignoredNames')) != null ? _ref : [];
      ignoredNames = ignoredNames.concat((_ref1 = atom.config.get('core.ignoredNames')) != null ? _ref1 : []);
      ignoreVcsIgnores = atom.config.get('core.excludeVcsIgnoredPaths') && ((_ref2 = atom.project) != null ? (_ref3 = _ref2.getRepo()) != null ? _ref3.isProjectAtRoot() : void 0 : void 0);
      task = Task.once(taskPath, atom.project.getPath(), ignoreVcsIgnores, ignoredNames, function() {
        return callback(projectPaths);
      });
      task.on('load-paths:paths-found', function(paths) {
        return projectPaths.push.apply(projectPaths, paths);
      });
      return task;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLElBQUE7O0FBQUEsRUFBQyxPQUFRLE9BQUEsQ0FBUSxNQUFSLEVBQVIsSUFBRCxDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsU0FBQSxFQUFXLFNBQUMsUUFBRCxHQUFBO0FBQ1QsVUFBQSx1RkFBQTtBQUFBLE1BQUEsWUFBQSxHQUFlLEVBQWYsQ0FBQTtBQUFBLE1BQ0EsUUFBQSxHQUFXLE9BQU8sQ0FBQyxPQUFSLENBQWdCLHNCQUFoQixDQURYLENBQUE7QUFBQSxNQUVBLFlBQUEsMEVBQThELEVBRjlELENBQUE7QUFBQSxNQUdBLFlBQUEsR0FBZSxZQUFZLENBQUMsTUFBYixrRUFBMkQsRUFBM0QsQ0FIZixDQUFBO0FBQUEsTUFJQSxnQkFBQSxHQUFtQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsNkJBQWhCLENBQUEsK0VBQTBFLENBQUUsZUFBekIsQ0FBQSxvQkFKdEUsQ0FBQTtBQUFBLE1BTUEsSUFBQSxHQUFPLElBQUksQ0FBQyxJQUFMLENBQVUsUUFBVixFQUFvQixJQUFJLENBQUMsT0FBTyxDQUFDLE9BQWIsQ0FBQSxDQUFwQixFQUE0QyxnQkFBNUMsRUFBOEQsWUFBOUQsRUFBNEUsU0FBQSxHQUFBO2VBQ2pGLFFBQUEsQ0FBUyxZQUFULEVBRGlGO01BQUEsQ0FBNUUsQ0FOUCxDQUFBO0FBQUEsTUFTQSxJQUFJLENBQUMsRUFBTCxDQUFRLHdCQUFSLEVBQWtDLFNBQUMsS0FBRCxHQUFBO2VBQ2hDLFlBQVksQ0FBQyxJQUFiLHFCQUFrQixLQUFsQixFQURnQztNQUFBLENBQWxDLENBVEEsQ0FBQTthQVlBLEtBYlM7SUFBQSxDQUFYO0dBSEYsQ0FBQTtBQUFBIgp9
//# sourceURL=/Users/ah/.atom/packages/fuzzy-finder/lib/path-loader.coffee