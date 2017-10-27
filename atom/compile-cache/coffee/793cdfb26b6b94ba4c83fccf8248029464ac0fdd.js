(function() {
  var DefaultFileIcons, FileIcons;

  DefaultFileIcons = require('./default-file-icons');

  FileIcons = (function() {
    function FileIcons() {
      this.service = new DefaultFileIcons;
    }

    FileIcons.prototype.getService = function() {
      return this.service;
    };

    FileIcons.prototype.resetService = function() {
      return this.service = new DefaultFileIcons;
    };

    FileIcons.prototype.setService = function(service) {
      this.service = service;
    };

    return FileIcons;

  })();

  module.exports = new FileIcons;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RhYnMvbGliL2ZpbGUtaWNvbnMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDJCQUFBOztBQUFBLEVBQUEsZ0JBQUEsR0FBbUIsT0FBQSxDQUFRLHNCQUFSLENBQW5CLENBQUE7O0FBQUEsRUFFTTtBQUNTLElBQUEsbUJBQUEsR0FBQTtBQUNYLE1BQUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxHQUFBLENBQUEsZ0JBQVgsQ0FEVztJQUFBLENBQWI7O0FBQUEsd0JBR0EsVUFBQSxHQUFZLFNBQUEsR0FBQTthQUNWLElBQUMsQ0FBQSxRQURTO0lBQUEsQ0FIWixDQUFBOztBQUFBLHdCQU1BLFlBQUEsR0FBYyxTQUFBLEdBQUE7YUFDWixJQUFDLENBQUEsT0FBRCxHQUFXLEdBQUEsQ0FBQSxpQkFEQztJQUFBLENBTmQsQ0FBQTs7QUFBQSx3QkFTQSxVQUFBLEdBQVksU0FBRSxPQUFGLEdBQUE7QUFBWSxNQUFYLElBQUMsQ0FBQSxVQUFBLE9BQVUsQ0FBWjtJQUFBLENBVFosQ0FBQTs7cUJBQUE7O01BSEYsQ0FBQTs7QUFBQSxFQWNBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLEdBQUEsQ0FBQSxTQWRqQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/ah/.atom/packages/tabs/lib/file-icons.coffee
