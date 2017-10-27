(function() {
  var DefaultFileIcons, fs, path;

  fs = require('fs-plus');

  path = require('path');

  DefaultFileIcons = (function() {
    function DefaultFileIcons() {}

    DefaultFileIcons.prototype.iconClassForPath = function(filePath) {
      var extension;
      extension = path.extname(filePath);
      if (fs.isSymbolicLinkSync(filePath)) {
        return 'icon-file-symlink-file';
      } else if (fs.isReadmePath(filePath)) {
        return 'icon-book';
      } else if (fs.isCompressedExtension(extension)) {
        return 'icon-file-zip';
      } else if (fs.isImageExtension(extension)) {
        return 'icon-file-media';
      } else if (fs.isPdfExtension(extension)) {
        return 'icon-file-pdf';
      } else if (fs.isBinaryExtension(extension)) {
        return 'icon-file-binary';
      } else {
        return 'icon-file-text';
      }
    };

    return DefaultFileIcons;

  })();

  module.exports = DefaultFileIcons;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2Z1enp5LWZpbmRlci9saWIvZGVmYXVsdC1maWxlLWljb25zLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwwQkFBQTs7QUFBQSxFQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQUFMLENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FEUCxDQUFBOztBQUFBLEVBR007a0NBQ0o7O0FBQUEsK0JBQUEsZ0JBQUEsR0FBa0IsU0FBQyxRQUFELEdBQUE7QUFDaEIsVUFBQSxTQUFBO0FBQUEsTUFBQSxTQUFBLEdBQVksSUFBSSxDQUFDLE9BQUwsQ0FBYSxRQUFiLENBQVosQ0FBQTtBQUVBLE1BQUEsSUFBRyxFQUFFLENBQUMsa0JBQUgsQ0FBc0IsUUFBdEIsQ0FBSDtlQUNFLHlCQURGO09BQUEsTUFFSyxJQUFHLEVBQUUsQ0FBQyxZQUFILENBQWdCLFFBQWhCLENBQUg7ZUFDSCxZQURHO09BQUEsTUFFQSxJQUFHLEVBQUUsQ0FBQyxxQkFBSCxDQUF5QixTQUF6QixDQUFIO2VBQ0gsZ0JBREc7T0FBQSxNQUVBLElBQUcsRUFBRSxDQUFDLGdCQUFILENBQW9CLFNBQXBCLENBQUg7ZUFDSCxrQkFERztPQUFBLE1BRUEsSUFBRyxFQUFFLENBQUMsY0FBSCxDQUFrQixTQUFsQixDQUFIO2VBQ0gsZ0JBREc7T0FBQSxNQUVBLElBQUcsRUFBRSxDQUFDLGlCQUFILENBQXFCLFNBQXJCLENBQUg7ZUFDSCxtQkFERztPQUFBLE1BQUE7ZUFHSCxpQkFIRztPQWJXO0lBQUEsQ0FBbEIsQ0FBQTs7NEJBQUE7O01BSkYsQ0FBQTs7QUFBQSxFQXNCQSxNQUFNLENBQUMsT0FBUCxHQUFpQixnQkF0QmpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/ah/.atom/packages/fuzzy-finder/lib/default-file-icons.coffee
