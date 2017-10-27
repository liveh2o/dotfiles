(function() {
  var DefaultFileIcons, fs, path;

  fs = require('fs-plus');

  path = require('path');

  DefaultFileIcons = (function() {
    function DefaultFileIcons() {}

    DefaultFileIcons.prototype.iconClassForPath = function(filePath, caller) {
      var extension;
      if (caller !== 'tabs-mru-switcher') {
        return '';
      }
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RhYnMvbGliL2RlZmF1bHQtZmlsZS1pY29ucy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUjs7RUFDTCxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBRUQ7OzsrQkFDSixnQkFBQSxHQUFrQixTQUFDLFFBQUQsRUFBVyxNQUFYO0FBQ2hCLFVBQUE7TUFBQSxJQUFpQixNQUFBLEtBQVUsbUJBQTNCO0FBQUEsZUFBTyxHQUFQOztNQUVBLFNBQUEsR0FBWSxJQUFJLENBQUMsT0FBTCxDQUFhLFFBQWI7TUFFWixJQUFHLEVBQUUsQ0FBQyxrQkFBSCxDQUFzQixRQUF0QixDQUFIO2VBQ0UseUJBREY7T0FBQSxNQUVLLElBQUcsRUFBRSxDQUFDLFlBQUgsQ0FBZ0IsUUFBaEIsQ0FBSDtlQUNILFlBREc7T0FBQSxNQUVBLElBQUcsRUFBRSxDQUFDLHFCQUFILENBQXlCLFNBQXpCLENBQUg7ZUFDSCxnQkFERztPQUFBLE1BRUEsSUFBRyxFQUFFLENBQUMsZ0JBQUgsQ0FBb0IsU0FBcEIsQ0FBSDtlQUNILGtCQURHO09BQUEsTUFFQSxJQUFHLEVBQUUsQ0FBQyxjQUFILENBQWtCLFNBQWxCLENBQUg7ZUFDSCxnQkFERztPQUFBLE1BRUEsSUFBRyxFQUFFLENBQUMsaUJBQUgsQ0FBcUIsU0FBckIsQ0FBSDtlQUNILG1CQURHO09BQUEsTUFBQTtlQUdILGlCQUhHOztJQWZXOzs7Ozs7RUFvQnBCLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0FBeEJqQiIsInNvdXJjZXNDb250ZW50IjpbImZzID0gcmVxdWlyZSAnZnMtcGx1cydcbnBhdGggPSByZXF1aXJlICdwYXRoJ1xuXG5jbGFzcyBEZWZhdWx0RmlsZUljb25zXG4gIGljb25DbGFzc0ZvclBhdGg6IChmaWxlUGF0aCwgY2FsbGVyKSAtPlxuICAgIHJldHVybiAnJyB1bmxlc3MgY2FsbGVyIGlzICd0YWJzLW1ydS1zd2l0Y2hlcidcblxuICAgIGV4dGVuc2lvbiA9IHBhdGguZXh0bmFtZShmaWxlUGF0aClcblxuICAgIGlmIGZzLmlzU3ltYm9saWNMaW5rU3luYyhmaWxlUGF0aClcbiAgICAgICdpY29uLWZpbGUtc3ltbGluay1maWxlJ1xuICAgIGVsc2UgaWYgZnMuaXNSZWFkbWVQYXRoKGZpbGVQYXRoKVxuICAgICAgJ2ljb24tYm9vaydcbiAgICBlbHNlIGlmIGZzLmlzQ29tcHJlc3NlZEV4dGVuc2lvbihleHRlbnNpb24pXG4gICAgICAnaWNvbi1maWxlLXppcCdcbiAgICBlbHNlIGlmIGZzLmlzSW1hZ2VFeHRlbnNpb24oZXh0ZW5zaW9uKVxuICAgICAgJ2ljb24tZmlsZS1tZWRpYSdcbiAgICBlbHNlIGlmIGZzLmlzUGRmRXh0ZW5zaW9uKGV4dGVuc2lvbilcbiAgICAgICdpY29uLWZpbGUtcGRmJ1xuICAgIGVsc2UgaWYgZnMuaXNCaW5hcnlFeHRlbnNpb24oZXh0ZW5zaW9uKVxuICAgICAgJ2ljb24tZmlsZS1iaW5hcnknXG4gICAgZWxzZVxuICAgICAgJ2ljb24tZmlsZS10ZXh0J1xuXG5tb2R1bGUuZXhwb3J0cyA9IERlZmF1bHRGaWxlSWNvbnNcbiJdfQ==
