(function() {
  var findFile, fs, path;

  path = require('path');

  fs = require('fs');

  findFile = function(startDir, name, parent, limit, aux_dirs) {
    var climb, dir, item, n, nameType, target, _i, _j, _len, _len1;
    if (parent == null) {
      parent = false;
    }
    if (limit == null) {
      limit = null;
    }
    if (aux_dirs == null) {
      aux_dirs = [];
    }
    climb = startDir.split(path.sep);
    for (_i = 0, _len = climb.length; _i < _len; _i++) {
      item = climb[_i];
      dir = climb.join(path.sep) + path.sep;
      nameType = {}.toString.call(name);
      if (nameType === '[object Array]') {
        for (_j = 0, _len1 = name.length; _j < _len1; _j++) {
          n = name[_j];
          target = path.join(dir, n);
          if (fs.existsSync(target)) {
            if (parent) {
              return dir;
            }
            return target;
          }
        }
      }
      if (nameType === '[object String]') {
        target = path.join(dir, name);
        if (fs.existsSync(target)) {
          if (parent) {
            return dir;
          }
          return target;
        }
      }
      climb.splice(-1, 1);
    }
  };

  module.exports = findFile;

}).call(this);
