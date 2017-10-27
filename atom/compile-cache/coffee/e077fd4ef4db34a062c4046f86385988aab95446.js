(function() {
  var path;

  path = require("path");

  module.exports = {
    repositoryForPath: function(filePath) {
      var i, projectPath, _i, _len, _ref, _ref1;
      _ref = atom.project.getPaths();
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        projectPath = _ref[i];
        if (filePath === projectPath || filePath.startsWith(projectPath + path.sep)) {
          return (_ref1 = atom.project.getRepositories()[i]) != null ? _ref1.async : void 0;
        }
      }
      return null;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2Z1enp5LWZpbmRlci9saWIvaGVscGVycy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsSUFBQTs7QUFBQSxFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUFQLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxpQkFBQSxFQUFtQixTQUFDLFFBQUQsR0FBQTtBQUNqQixVQUFBLHFDQUFBO0FBQUE7QUFBQSxXQUFBLG1EQUFBOzhCQUFBO0FBQ0UsUUFBQSxJQUFHLFFBQUEsS0FBWSxXQUFaLElBQTJCLFFBQVEsQ0FBQyxVQUFULENBQW9CLFdBQUEsR0FBYyxJQUFJLENBQUMsR0FBdkMsQ0FBOUI7QUFDRSw0RUFBd0MsQ0FBRSxjQUExQyxDQURGO1NBREY7QUFBQSxPQUFBO0FBR0EsYUFBTyxJQUFQLENBSmlCO0lBQUEsQ0FBbkI7R0FIRixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/ah/.atom/packages/fuzzy-finder/lib/helpers.coffee
