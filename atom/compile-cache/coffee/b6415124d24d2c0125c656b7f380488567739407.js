(function() {
  var GitRepository, Minimatch, PathLoader, PathsChunkSize, async, emittedPaths, fs, path, _;

  async = require('async');

  fs = require('fs');

  path = require('path');

  _ = require('underscore-plus');

  GitRepository = require('atom').GitRepository;

  Minimatch = require('minimatch').Minimatch;

  PathsChunkSize = 100;

  emittedPaths = new Set;

  PathLoader = (function() {
    function PathLoader(rootPath, ignoreVcsIgnores, traverseSymlinkDirectories, ignoredNames) {
      var repo;
      this.rootPath = rootPath;
      this.traverseSymlinkDirectories = traverseSymlinkDirectories;
      this.ignoredNames = ignoredNames;
      this.paths = [];
      this.realPathCache = {};
      this.repo = null;
      if (ignoreVcsIgnores) {
        repo = GitRepository.open(this.rootPath, {
          refreshOnWindowFocus: false
        });
        if ((repo != null ? repo.relativize(path.join(this.rootPath, 'test')) : void 0) === 'test') {
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
      var ignoredName, relativePath, _i, _len, _ref, _ref1;
      relativePath = path.relative(this.rootPath, loadedPath);
      if ((_ref = this.repo) != null ? _ref.isPathIgnored(relativePath) : void 0) {
        return true;
      } else {
        _ref1 = this.ignoredNames;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          ignoredName = _ref1[_i];
          if (ignoredName.match(relativePath)) {
            return true;
          }
        }
      }
    };

    PathLoader.prototype.pathLoaded = function(loadedPath, done) {
      if (!(this.isIgnored(loadedPath) || emittedPaths.has(loadedPath))) {
        this.paths.push(loadedPath);
        emittedPaths.add(loadedPath);
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
            return _this.isInternalSymlink(pathToLoad, function(isInternal) {
              if (isInternal) {
                return done();
              }
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
                } else {
                  return done();
                }
              });
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

    PathLoader.prototype.isInternalSymlink = function(pathToLoad, done) {
      return fs.realpath(pathToLoad, this.realPathCache, (function(_this) {
        return function(err, realPath) {
          if (err) {
            return done(false);
          } else {
            return done(realPath.search(_this.rootPath) === 0);
          }
        };
      })(this));
    };

    return PathLoader;

  })();

  module.exports = function(rootPaths, followSymlinks, ignoreVcsIgnores, ignores) {
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
      return new PathLoader(rootPath, ignoreVcsIgnores, followSymlinks, ignoredNames).load(next);
    }, this.async());
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2Z1enp5LWZpbmRlci9saWIvbG9hZC1wYXRocy1oYW5kbGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxzRkFBQTs7QUFBQSxFQUFBLEtBQUEsR0FBUSxPQUFBLENBQVEsT0FBUixDQUFSLENBQUE7O0FBQUEsRUFDQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FETCxDQUFBOztBQUFBLEVBRUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRlAsQ0FBQTs7QUFBQSxFQUdBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVIsQ0FISixDQUFBOztBQUFBLEVBSUMsZ0JBQWlCLE9BQUEsQ0FBUSxNQUFSLEVBQWpCLGFBSkQsQ0FBQTs7QUFBQSxFQUtDLFlBQWEsT0FBQSxDQUFRLFdBQVIsRUFBYixTQUxELENBQUE7O0FBQUEsRUFPQSxjQUFBLEdBQWlCLEdBUGpCLENBQUE7O0FBQUEsRUFTQSxZQUFBLEdBQWUsR0FBQSxDQUFBLEdBVGYsQ0FBQTs7QUFBQSxFQVdNO0FBQ1MsSUFBQSxvQkFBRSxRQUFGLEVBQVksZ0JBQVosRUFBK0IsMEJBQS9CLEVBQTRELFlBQTVELEdBQUE7QUFDWCxVQUFBLElBQUE7QUFBQSxNQURZLElBQUMsQ0FBQSxXQUFBLFFBQ2IsQ0FBQTtBQUFBLE1BRHlDLElBQUMsQ0FBQSw2QkFBQSwwQkFDMUMsQ0FBQTtBQUFBLE1BRHNFLElBQUMsQ0FBQSxlQUFBLFlBQ3ZFLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxLQUFELEdBQVMsRUFBVCxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsYUFBRCxHQUFpQixFQURqQixDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsSUFBRCxHQUFRLElBRlIsQ0FBQTtBQUdBLE1BQUEsSUFBRyxnQkFBSDtBQUNFLFFB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

//# sourceURL=/Users/ah/.atom/packages/fuzzy-finder/lib/load-paths-handler.coffee
