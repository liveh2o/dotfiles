(function() {
  var GitRepository, Minimatch, PathLoader, PathsChunkSize, async, fs, path, _;

  async = require('async');

  fs = require('fs');

  path = require('path');

  _ = require('underscore-plus');

  GitRepository = require('atom').GitRepository;

  Minimatch = require('minimatch').Minimatch;

  PathsChunkSize = 100;

  PathLoader = (function() {
    function PathLoader(rootPath, ignoreVcsIgnores, traverseSymlinkDirectories, ignoredNames) {
      var repo;
      this.rootPath = rootPath;
      this.traverseSymlinkDirectories = traverseSymlinkDirectories;
      this.ignoredNames = ignoredNames;
      this.paths = [];
      this.repo = null;
      if (ignoreVcsIgnores) {
        repo = GitRepository.open(this.rootPath, {
          refreshOnWindowFocus: false
        });
        if ((repo != null ? repo.getWorkingDirectory() : void 0) === this.rootPath) {
          this.repo = repo;
        }
      }
    }

    PathLoader.prototype.load = function(done) {
      return this.loadPath(this.rootPath, (function(_this) {
        return function() {
          var _ref;
          _this.flushPaths();
          if ((_ref = _this.repo) != null) {
            _ref.destroy();
          }
          return done();
        };
      })(this));
    };

    PathLoader.prototype.isIgnored = function(loadedPath) {
      var ignoredName, _i, _len, _ref, _ref1;
      if ((_ref = this.repo) != null ? _ref.isPathIgnored(loadedPath) : void 0) {
        return true;
      } else {
        _ref1 = this.ignoredNames;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          ignoredName = _ref1[_i];
          if (ignoredName.match(loadedPath)) {
            return true;
          }
        }
      }
    };

    PathLoader.prototype.pathLoaded = function(loadedPath, done) {
      if (!this.isIgnored(loadedPath)) {
        this.paths.push(loadedPath);
      }
      if (this.paths.length === PathsChunkSize) {
        this.flushPaths();
      }
      return done();
    };

    PathLoader.prototype.flushPaths = function() {
      emit('load-paths:paths-found', this.paths);
      return this.paths = [];
    };

    PathLoader.prototype.loadPath = function(pathToLoad, done) {
      if (this.isIgnored(pathToLoad)) {
        return done();
      }
      return fs.lstat(pathToLoad, (function(_this) {
        return function(error, stats) {
          if (error != null) {
            return done();
          }
          if (stats.isSymbolicLink()) {
            return fs.stat(pathToLoad, function(error, stats) {
              if (error != null) {
                return done();
              }
              if (stats.isFile()) {
                return _this.pathLoaded(pathToLoad, done);
              } else if (stats.isDirectory()) {
                if (_this.traverseSymlinkDirectories) {
                  return _this.loadFolder(pathToLoad, done);
                } else {
                  return done();
                }
              }
            });
          } else if (stats.isDirectory()) {
            return _this.loadFolder(pathToLoad, done);
          } else if (stats.isFile()) {
            return _this.pathLoaded(pathToLoad, done);
          } else {
            return done();
          }
        };
      })(this));
    };

    PathLoader.prototype.loadFolder = function(folderPath, done) {
      return fs.readdir(folderPath, (function(_this) {
        return function(error, children) {
          if (children == null) {
            children = [];
          }
          return async.each(children, function(childName, next) {
            return _this.loadPath(path.join(folderPath, childName), next);
          }, done);
        };
      })(this));
    };

    return PathLoader;

  })();

  module.exports = function(rootPaths, traverseIntoSymlinkDirectories, ignoreVcsIgnores, ignores) {
    var error, ignore, ignoredNames, _i, _len;
    if (ignores == null) {
      ignores = [];
    }
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
    return async.each(rootPaths, function(rootPath, next) {
      return new PathLoader(rootPath, ignoreVcsIgnores, traverseIntoSymlinkDirectories, ignoredNames).load(next);
    }, this.async());
  };

}).call(this);
