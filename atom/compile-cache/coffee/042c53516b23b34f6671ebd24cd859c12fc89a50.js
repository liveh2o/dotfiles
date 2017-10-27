(function() {
  var Git, asyncCallDone, asyncCallStarting, asyncCallsInProgress, callback, fs, ignoredNames, isIgnored, loadFolder, loadPath, path, pathLoaded, paths, pathsChunkSize, repo, _;

  fs = require('fs');

  path = require('path');

  _ = require('underscore-plus');

  Git = require('atom').Git;

  asyncCallsInProgress = 0;

  pathsChunkSize = 100;

  paths = [];

  repo = null;

  ignoredNames = null;

  callback = null;

  isIgnored = function(loadedPath) {
    return (repo != null ? repo.isPathIgnored(loadedPath) : void 0) || _.indexOf(ignoredNames, path.basename(loadedPath), true) !== -1;
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

  module.exports = function(rootPath, ignoreVcsIgnores, ignore) {
    ignoredNames = ignore;
    callback = this.async();
    if (ignoreVcsIgnores) {
      repo = Git.open(rootPath, {
        refreshOnWindowFocus: false
      });
    }
    ignoredNames.sort();
    return loadFolder(rootPath);
  };

}).call(this);
