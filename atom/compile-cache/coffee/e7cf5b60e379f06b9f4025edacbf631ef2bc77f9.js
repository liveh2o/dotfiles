(function() {
  var Path, Rails, fs, specAppPathsReg, specLibPathsReg, supportedPathsReg;

  fs = require('fs');

  Path = require('path');

  supportedPathsReg = function(paths) {
    return new RegExp("^\/(app|lib|" + (paths.join('|')) + ")\/", 'i');
  };

  specLibPathsReg = function(paths) {
    return new RegExp("^\/(" + (paths.join('|')) + ")\/lib\/", 'i');
  };

  specAppPathsReg = function(paths) {
    return new RegExp("^\/(" + (paths.join('|')) + ")\/", 'i');
  };

  module.exports = Rails = (function() {
    function Rails(root, specPaths, specDefault) {
      this.root = root;
      this.specPaths = specPaths;
      this.specDefault = specDefault;
    }

    Rails.prototype.toggleSpecFile = function(file) {
      var relativePath;
      relativePath = file.substring(this.root.length);
      if (!relativePath.match(supportedPathsReg(this.specPaths))) {
        return null;
      }
      if (relativePath.match(/_spec\.rb$/)) {
        return this.getRubyFile(relativePath);
      } else {
        return this.findSpecFile(relativePath);
      }
    };

    Rails.prototype.getRubyFile = function(path) {
      if (path.match(/^\/spec\/views/i)) {
        path = path.replace(/_spec\.rb$/, '');
      } else {
        path = path.replace(/_spec\.rb$/, '.rb');
      }
      path = path.replace(specLibPathsReg(this.specPaths), '/lib/');
      path = path.replace(specAppPathsReg(this.specPaths), '/app/');
      return Path.join(this.root, path);
    };

    Rails.prototype.findSpecFile = function(path) {
      var file, specPath, _i, _len, _ref;
      _ref = this.specPaths;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        specPath = _ref[_i];
        file = this.getSpecFile(path, specPath);
        if (fs.existsSync(file)) {
          return file;
        }
      }
      return this.getSpecFile(path, this.specDefault);
    };

    Rails.prototype.getSpecFile = function(path, specPath) {
      var newPath;
      if (path.match(/\.rb$/)) {
        path = path.replace(/\.rb$/, '_spec.rb');
      } else {
        path = path + '_spec.rb';
      }
      if (path.match(/^\/app\//)) {
        newPath = path.replace(/^\/app\//, "/" + specPath + "/");
      } else {
        newPath = path.replace(/^\/lib\//, "/" + specPath + "/lib/");
      }
      return Path.join(this.root, newPath);
    };

    return Rails;

  })();

}).call(this);
