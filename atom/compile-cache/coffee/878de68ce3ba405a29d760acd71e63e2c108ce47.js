(function() {
  var Git, Minimatch, asyncCallDone, asyncCallStarting, asyncCallsInProgress, callback, fs, ignoredNames, isIgnored, loadFolder, loadPath, path, pathLoaded, paths, pathsChunkSize, repo, traverseSymlinkDirectories, _;

  fs = require('fs');

  path = require('path');

  _ = require('underscore-plus');

  Git = require('atom').Git;

  Minimatch = require('minimatch').Minimatch;

  asyncCallsInProgress = 0;

  pathsChunkSize = 100;

  paths = [];

  repo = null;

  ignoredNames = null;

  traverseSymlinkDirectories = false;

  callback = null;

  isIgnored = function(loadedPath) {
    var ignoredName, _i, _len;
    if (repo != null ? repo.isPathIgnored(loadedPath) : void 0) {
      return true;
    } else {
      for (_i = 0, _len = ignoredNames.length; _i < _len; _i++) {
        ignoredName = ignoredNames[_i];
        if (ignoredName.match(loadedPath)) {
          return true;
        }
      }
    }
  };

  asyncCallStarting = function() {
    return asyncCallsInProgress++;
  };

  asyncCallDone = function() {
    if (--asyncCallsInProgress === 0) {
      if (repo != null) {
        repo.destroy();
      }
      emit('load-paths:paths-found', paths);
      return callback();
    }
  };

  pathLoaded = function(path) {
    if (!isIgnored(path)) {
      paths.push(path);
    }
    if (paths.length === pathsChunkSize) {
      emit('load-paths:paths-found', paths);
      return paths = [];
    }
  };

  loadPath = function(path) {
    asyncCallStarting();
    return fs.lstat(path, function(error, stats) {
      if (error == null) {
        if (stats.isSymbolicLink()) {
          asyncCallStarting();
          fs.stat(path, function(error, stats) {
            if (error == null) {
              if (stats.isFile()) {
                pathLoaded(path);
              } else if (stats.isDirectory() && traverseSymlinkDirectories) {
                if (!isIgnored(path)) {
                  loadFolder(path);
                }
              }
            }
            return asyncCallDone();
          });
        } else if (stats.isDirectory()) {
          if (!isIgnored(path)) {
            loadFolder(path);
          }
        } else if (stats.isFile()) {
          pathLoaded(path);
        }
      }
      return asyncCallDone();
    });
  };

  loadFolder = function(folderPath) {
    asyncCallStarting();
    return fs.readdir(folderPath, function(error, children) {
      var childName, _i, _len;
      if (children == null) {
        children = [];
      }
      for (_i = 0, _len = children.length; _i < _len; _i++) {
        childName = children[_i];
        loadPath(path.join(folderPath, childName));
      }
      return asyncCallDone();
    });
  };

  module.exports = function(rootPath, traverseIntoSymlinkDirectories, ignoreVcsIgnores, ignores) {
    var error, ignore, _i, _len;
    if (ignores == null) {
      ignores = [];
    }
    traverseSymlinkDirectories = traverseIntoSymlinkDirectories;
    ignoredNames = [];
    for (_i = 0, _len = ignores.length; _i < _len; _i++) {
      ignore = ignores[_i];
      if (ignore) {
        try {
          ignoredNames.push(new Minimatch(ignore, {
            matchBase: true,
            dot: true
          }));
        } catch (_error) {
          error = _error;
          console.warn("Error parsing ignore pattern (" + ignore + "): " + error.message);
        }
      }
    }
    callback = this.async();
    if (ignoreVcsIgnores) {
      repo = Git.open(rootPath, {
        refreshOnWindowFocus: false
      });
    }
    return loadFolder(rootPath);
  };

}).call(this);
