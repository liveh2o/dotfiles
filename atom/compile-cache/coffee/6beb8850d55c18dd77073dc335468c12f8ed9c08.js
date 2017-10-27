(function() {
  var findFile, log, warn,
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

  module.exports = {
    log: log,
    warn: warn,
    findFile: findFile
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1CQUFBO0lBQUEsa0JBQUE7O0FBQUEsRUFBQSxRQUFBLEdBQVcsT0FBQSxDQUFRLFFBQVIsQ0FBWCxDQUFBOztBQUFBLEVBRUEsR0FBQSxHQUFNLFNBQUEsR0FBQTtBQUNKLFFBQUEsSUFBQTtBQUFBLElBREssOERBQ0wsQ0FBQTtBQUFBLElBQUEsSUFBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isa0JBQWhCLENBQUg7YUFDRSxPQUFPLENBQUMsR0FBUixnQkFBWSxJQUFaLEVBREY7S0FESTtFQUFBLENBRk4sQ0FBQTs7QUFBQSxFQU1BLElBQUEsR0FBTyxTQUFBLEdBQUE7QUFDTCxRQUFBLElBQUE7QUFBQSxJQURNLDhEQUNOLENBQUE7QUFBQSxJQUFBLElBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGtCQUFoQixDQUFIO2FBQ0UsT0FBTyxDQUFDLElBQVIsZ0JBQWEsSUFBYixFQURGO0tBREs7RUFBQSxDQU5QLENBQUE7O0FBQUEsRUFVQSxNQUFNLENBQUMsT0FBUCxHQUFpQjtBQUFBLElBQUMsS0FBQSxHQUFEO0FBQUEsSUFBTSxNQUFBLElBQU47QUFBQSxJQUFZLFVBQUEsUUFBWjtHQVZqQixDQUFBO0FBQUEiCn0=
//# sourceURL=/Users/ah/.atom/packages/linter/lib/utils.coffee