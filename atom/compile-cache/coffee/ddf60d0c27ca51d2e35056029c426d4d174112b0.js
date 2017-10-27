(function() {
  var Task, fs;

  fs = require('fs-plus');

  Task = require('atom').Task;

  module.exports = {
    startTask: function(callback) {
      var followSymlinks, ignoreVcsIgnores, ignoredNames, projectPaths, results, task, taskPath, _ref, _ref1;
      results = [];
      taskPath = require.resolve('./load-paths-handler');
      followSymlinks = atom.config.get('core.followSymlinks');
      ignoredNames = (_ref = atom.config.get('fuzzy-finder.ignoredNames')) != null ? _ref : [];
      ignoredNames = ignoredNames.concat((_ref1 = atom.config.get('core.ignoredNames')) != null ? _ref1 : []);
      ignoreVcsIgnores = atom.config.get('core.excludeVcsIgnoredPaths');
      projectPaths = atom.project.getPaths().map((function(_this) {
        return function(path) {
          return fs.realpathSync(path);
        };
      })(this));
      task = Task.once(taskPath, projectPaths, followSymlinks, ignoreVcsIgnores, ignoredNames, function() {
        return callback(results);
      });
      task.on('load-paths:paths-found', function(paths) {
        return results.push.apply(results, paths);
      });
      return task;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2Z1enp5LWZpbmRlci9saWIvcGF0aC1sb2FkZXIuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFFBQUE7O0FBQUEsRUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVIsQ0FBTCxDQUFBOztBQUFBLEVBQ0MsT0FBUSxPQUFBLENBQVEsTUFBUixFQUFSLElBREQsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLFNBQUEsRUFBVyxTQUFDLFFBQUQsR0FBQTtBQUNULFVBQUEsa0dBQUE7QUFBQSxNQUFBLE9BQUEsR0FBVSxFQUFWLENBQUE7QUFBQSxNQUNBLFFBQUEsR0FBVyxPQUFPLENBQUMsT0FBUixDQUFnQixzQkFBaEIsQ0FEWCxDQUFBO0FBQUEsTUFFQSxjQUFBLEdBQWlCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixxQkFBaEIsQ0FGakIsQ0FBQTtBQUFBLE1BR0EsWUFBQSwwRUFBOEQsRUFIOUQsQ0FBQTtBQUFBLE1BSUEsWUFBQSxHQUFlLFlBQVksQ0FBQyxNQUFiLGtFQUEyRCxFQUEzRCxDQUpmLENBQUE7QUFBQSxNQUtBLGdCQUFBLEdBQW1CLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiw2QkFBaEIsQ0FMbkIsQ0FBQTtBQUFBLE1BTUEsWUFBQSxHQUFlLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFBLENBQXVCLENBQUMsR0FBeEIsQ0FBNEIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsSUFBRCxHQUFBO2lCQUFVLEVBQUUsQ0FBQyxZQUFILENBQWdCLElBQWhCLEVBQVY7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE1QixDQU5mLENBQUE7QUFBQSxNQVFBLElBQUEsR0FBTyxJQUFJLENBQUMsSUFBTCxDQUNMLFFBREssRUFFTCxZQUZLLEVBR0wsY0FISyxFQUlMLGdCQUpLLEVBS0wsWUFMSyxFQUtTLFNBQUEsR0FBQTtlQUNaLFFBQUEsQ0FBUyxPQUFULEVBRFk7TUFBQSxDQUxULENBUlAsQ0FBQTtBQUFBLE1BaUJBLElBQUksQ0FBQyxFQUFMLENBQVEsd0JBQVIsRUFBa0MsU0FBQyxLQUFELEdBQUE7ZUFDaEMsT0FBTyxDQUFDLElBQVIsZ0JBQWEsS0FBYixFQURnQztNQUFBLENBQWxDLENBakJBLENBQUE7YUFvQkEsS0FyQlM7SUFBQSxDQUFYO0dBSkYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/ah/.atom/packages/fuzzy-finder/lib/path-loader.coffee
