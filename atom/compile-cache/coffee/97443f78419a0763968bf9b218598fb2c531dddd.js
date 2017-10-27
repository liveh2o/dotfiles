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
      return this.loadPath(this.rootPath, true, (function(_this) {
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

    PathLoader.prototype.loadPath = function(pathToLoad, root, done) {
      if (this.isIgnored(pathToLoad) && !root) {
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
            return _this.loadPath(path.join(folderPath, childName), false, next);
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2Z1enp5LWZpbmRlci9saWIvbG9hZC1wYXRocy1oYW5kbGVyLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxzRkFBQTs7QUFBQSxFQUFBLEtBQUEsR0FBUSxPQUFBLENBQVEsT0FBUixDQUFSLENBQUE7O0FBQUEsRUFDQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FETCxDQUFBOztBQUFBLEVBRUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRlAsQ0FBQTs7QUFBQSxFQUdBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVIsQ0FISixDQUFBOztBQUFBLEVBSUMsZ0JBQWlCLE9BQUEsQ0FBUSxNQUFSLEVBQWpCLGFBSkQsQ0FBQTs7QUFBQSxFQUtDLFlBQWEsT0FBQSxDQUFRLFdBQVIsRUFBYixTQUxELENBQUE7O0FBQUEsRUFPQSxjQUFBLEdBQWlCLEdBUGpCLENBQUE7O0FBQUEsRUFTQSxZQUFBLEdBQWUsR0FBQSxDQUFBLEdBVGYsQ0FBQTs7QUFBQSxFQVdNO0FBQ1MsSUFBQSxvQkFBRSxRQUFGLEVBQVksZ0JBQVosRUFBK0IsMEJBQS9CLEVBQTRELFlBQTVELEdBQUE7QUFDWCxVQUFBLElBQUE7QUFBQSxNQURZLElBQUMsQ0FBQSxXQUFBLFFBQ2IsQ0FBQTtBQUFBLE1BRHlDLElBQUMsQ0FBQSw2QkFBQSwwQkFDMUMsQ0FBQTtBQUFBLE1BRHNFLElBQUMsQ0FBQSxlQUFBLFlBQ3ZFLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxLQUFELEdBQVMsRUFBVCxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsYUFBRCxHQUFpQixFQURqQixDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsSUFBRCxHQUFRLElBRlIsQ0FBQTtBQUdBLE1BQUEsSUFBRyxnQkFBSDtBQUNFLFFBQUEsSUFBQSxHQUFPLGFBQWEsQ0FBQyxJQUFkLENBQW1CLElBQUMsQ0FBQSxRQUFwQixFQUE4QjtBQUFBLFVBQUEsb0JBQUEsRUFBc0IsS0FBdEI7U0FBOUIsQ0FBUCxDQUFBO0FBQ0EsUUFBQSxvQkFBZ0IsSUFBSSxDQUFFLFVBQU4sQ0FBaUIsSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFDLENBQUEsUUFBWCxFQUFxQixNQUFyQixDQUFqQixXQUFBLEtBQWtELE1BQWxFO0FBQUEsVUFBQSxJQUFDLENBQUEsSUFBRCxHQUFRLElBQVIsQ0FBQTtTQUZGO09BSlc7SUFBQSxDQUFiOztBQUFBLHlCQVFBLElBQUEsR0FBTSxTQUFDLElBQUQsR0FBQTthQUNKLElBQUMsQ0FBQSxRQUFELENBQVUsSUFBQyxDQUFBLFFBQVgsRUFBcUIsSUFBckIsRUFBMkIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUN6QixjQUFBLElBQUE7QUFBQSxVQUFBLEtBQUMsQ0FBQSxVQUFELENBQUEsQ0FBQSxDQUFBOztnQkFDSyxDQUFFLE9BQVAsQ0FBQTtXQURBO2lCQUVBLElBQUEsQ0FBQSxFQUh5QjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTNCLEVBREk7SUFBQSxDQVJOLENBQUE7O0FBQUEseUJBY0EsU0FBQSxHQUFXLFNBQUMsVUFBRCxHQUFBO0FBQ1QsVUFBQSxnREFBQTtBQUFBLE1BQUEsWUFBQSxHQUFlLElBQUksQ0FBQyxRQUFMLENBQWMsSUFBQyxDQUFBLFFBQWYsRUFBeUIsVUFBekIsQ0FBZixDQUFBO0FBQ0EsTUFBQSxxQ0FBUSxDQUFFLGFBQVAsQ0FBcUIsWUFBckIsVUFBSDtlQUNFLEtBREY7T0FBQSxNQUFBO0FBR0U7QUFBQSxhQUFBLDRDQUFBO2tDQUFBO0FBQ0UsVUFBQSxJQUFlLFdBQVcsQ0FBQyxLQUFaLENBQWtCLFlBQWxCLENBQWY7QUFBQSxtQkFBTyxJQUFQLENBQUE7V0FERjtBQUFBLFNBSEY7T0FGUztJQUFBLENBZFgsQ0FBQTs7QUFBQSx5QkFzQkEsVUFBQSxHQUFZLFNBQUMsVUFBRCxFQUFhLElBQWIsR0FBQTtBQUNWLE1BQUEsSUFBQSxDQUFBLENBQU8sSUFBQyxDQUFBLFNBQUQsQ0FBVyxVQUFYLENBQUEsSUFBMEIsWUFBWSxDQUFDLEdBQWIsQ0FBaUIsVUFBakIsQ0FBakMsQ0FBQTtBQUNFLFFBQUEsSUFBQyxDQUFBLEtBQUssQ0FBQyxJQUFQLENBQVksVUFBWixDQUFBLENBQUE7QUFBQSxRQUNBLFlBQVksQ0FBQyxHQUFiLENBQWlCLFVBQWpCLENBREEsQ0FERjtPQUFBO0FBSUEsTUFBQSxJQUFHLElBQUMsQ0FBQSxLQUFLLENBQUMsTUFBUCxLQUFpQixjQUFwQjtBQUNFLFFBQUEsSUFBQyxDQUFBLFVBQUQsQ0FBQSxDQUFBLENBREY7T0FKQTthQU1BLElBQUEsQ0FBQSxFQVBVO0lBQUEsQ0F0QlosQ0FBQTs7QUFBQSx5QkErQkEsVUFBQSxHQUFZLFNBQUEsR0FBQTtBQUNWLE1BQUEsSUFBQSxDQUFLLHdCQUFMLEVBQStCLElBQUMsQ0FBQSxLQUFoQyxDQUFBLENBQUE7YUFDQSxJQUFDLENBQUEsS0FBRCxHQUFTLEdBRkM7SUFBQSxDQS9CWixDQUFBOztBQUFBLHlCQW1DQSxRQUFBLEdBQVUsU0FBQyxVQUFELEVBQWEsSUFBYixFQUFtQixJQUFuQixHQUFBO0FBQ1IsTUFBQSxJQUFpQixJQUFDLENBQUEsU0FBRCxDQUFXLFVBQVgsQ0FBQSxJQUEyQixDQUFBLElBQTVDO0FBQUEsZUFBTyxJQUFBLENBQUEsQ0FBUCxDQUFBO09BQUE7YUFDQSxFQUFFLENBQUMsS0FBSCxDQUFTLFVBQVQsRUFBcUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsS0FBRCxFQUFRLEtBQVIsR0FBQTtBQUNuQixVQUFBLElBQWlCLGFBQWpCO0FBQUEsbUJBQU8sSUFBQSxDQUFBLENBQVAsQ0FBQTtXQUFBO0FBQ0EsVUFBQSxJQUFHLEtBQUssQ0FBQyxjQUFOLENBQUEsQ0FBSDttQkFDRSxLQUFDLENBQUEsaUJBQUQsQ0FBbUIsVUFBbkIsRUFBK0IsU0FBQyxVQUFELEdBQUE7QUFDN0IsY0FBQSxJQUFpQixVQUFqQjtBQUFBLHVCQUFPLElBQUEsQ0FBQSxDQUFQLENBQUE7ZUFBQTtxQkFDQSxFQUFFLENBQUMsSUFBSCxDQUFRLFVBQVIsRUFBb0IsU0FBQyxLQUFELEVBQVEsS0FBUixHQUFBO0FBQ2xCLGdCQUFBLElBQWlCLGFBQWpCO0FBQUEseUJBQU8sSUFBQSxDQUFBLENBQVAsQ0FBQTtpQkFBQTtBQUNBLGdCQUFBLElBQUcsS0FBSyxDQUFDLE1BQU4sQ0FBQSxDQUFIO3lCQUNFLEtBQUMsQ0FBQSxVQUFELENBQVksVUFBWixFQUF3QixJQUF4QixFQURGO2lCQUFBLE1BRUssSUFBRyxLQUFLLENBQUMsV0FBTixDQUFBLENBQUg7QUFDSCxrQkFBQSxJQUFHLEtBQUMsQ0FBQSwwQkFBSjsyQkFDRSxLQUFDLENBQUEsVUFBRCxDQUFZLFVBQVosRUFBd0IsSUFBeEIsRUFERjttQkFBQSxNQUFBOzJCQUdFLElBQUEsQ0FBQSxFQUhGO21CQURHO2lCQUFBLE1BQUE7eUJBTUgsSUFBQSxDQUFBLEVBTkc7aUJBSmE7Y0FBQSxDQUFwQixFQUY2QjtZQUFBLENBQS9CLEVBREY7V0FBQSxNQWNLLElBQUcsS0FBSyxDQUFDLFdBQU4sQ0FBQSxDQUFIO21CQUNILEtBQUMsQ0FBQSxVQUFELENBQVksVUFBWixFQUF3QixJQUF4QixFQURHO1dBQUEsTUFFQSxJQUFHLEtBQUssQ0FBQyxNQUFOLENBQUEsQ0FBSDttQkFDSCxLQUFDLENBQUEsVUFBRCxDQUFZLFVBQVosRUFBd0IsSUFBeEIsRUFERztXQUFBLE1BQUE7bUJBR0gsSUFBQSxDQUFBLEVBSEc7V0FsQmM7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFyQixFQUZRO0lBQUEsQ0FuQ1YsQ0FBQTs7QUFBQSx5QkE0REEsVUFBQSxHQUFZLFNBQUMsVUFBRCxFQUFhLElBQWIsR0FBQTthQUNWLEVBQUUsQ0FBQyxPQUFILENBQVcsVUFBWCxFQUF1QixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxLQUFELEVBQVEsUUFBUixHQUFBOztZQUFRLFdBQVM7V0FDdEM7aUJBQUEsS0FBSyxDQUFDLElBQU4sQ0FDRSxRQURGLEVBRUUsU0FBQyxTQUFELEVBQVksSUFBWixHQUFBO21CQUNFLEtBQUMsQ0FBQSxRQUFELENBQVUsSUFBSSxDQUFDLElBQUwsQ0FBVSxVQUFWLEVBQXNCLFNBQXRCLENBQVYsRUFBNEMsS0FBNUMsRUFBbUQsSUFBbkQsRUFERjtVQUFBLENBRkYsRUFJRSxJQUpGLEVBRHFCO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBdkIsRUFEVTtJQUFBLENBNURaLENBQUE7O0FBQUEseUJBcUVBLGlCQUFBLEdBQW1CLFNBQUMsVUFBRCxFQUFhLElBQWIsR0FBQTthQUNqQixFQUFFLENBQUMsUUFBSCxDQUFZLFVBQVosRUFBd0IsSUFBQyxDQUFBLGFBQXpCLEVBQXdDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLEdBQUQsRUFBTSxRQUFOLEdBQUE7QUFDdEMsVUFBQSxJQUFHLEdBQUg7bUJBQ0UsSUFBQSxDQUFLLEtBQUwsRUFERjtXQUFBLE1BQUE7bUJBR0UsSUFBQSxDQUFLLFFBQVEsQ0FBQyxNQUFULENBQWdCLEtBQUMsQ0FBQSxRQUFqQixDQUFBLEtBQThCLENBQW5DLEVBSEY7V0FEc0M7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF4QyxFQURpQjtJQUFBLENBckVuQixDQUFBOztzQkFBQTs7TUFaRixDQUFBOztBQUFBLEVBd0ZBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUMsU0FBRCxFQUFZLGNBQVosRUFBNEIsZ0JBQTVCLEVBQThDLE9BQTlDLEdBQUE7QUFDZixRQUFBLHFDQUFBOztNQUQ2RCxVQUFRO0tBQ3JFO0FBQUEsSUFBQSxZQUFBLEdBQWUsRUFBZixDQUFBO0FBQ0EsU0FBQSw4Q0FBQTsyQkFBQTtVQUEyQjtBQUN6QjtBQUNFLFVBQUEsWUFBWSxDQUFDLElBQWIsQ0FBc0IsSUFBQSxTQUFBLENBQVUsTUFBVixFQUFrQjtBQUFBLFlBQUEsU0FBQSxFQUFXLElBQVg7QUFBQSxZQUFpQixHQUFBLEVBQUssSUFBdEI7V0FBbEIsQ0FBdEIsQ0FBQSxDQURGO1NBQUEsY0FBQTtBQUdFLFVBREksY0FDSixDQUFBO0FBQUEsVUFBQSxPQUFPLENBQUMsSUFBUixDQUFjLGdDQUFBLEdBQWdDLE1BQWhDLEdBQXVDLEtBQXZDLEdBQTRDLEtBQUssQ0FBQyxPQUFoRSxDQUFBLENBSEY7O09BREY7QUFBQSxLQURBO1dBT0EsS0FBSyxDQUFDLElBQU4sQ0FDRSxTQURGLEVBRUUsU0FBQyxRQUFELEVBQVcsSUFBWCxHQUFBO2FBQ00sSUFBQSxVQUFBLENBQ0YsUUFERSxFQUVGLGdCQUZFLEVBR0YsY0FIRSxFQUlGLFlBSkUsQ0FLSCxDQUFDLElBTEUsQ0FLRyxJQUxILEVBRE47SUFBQSxDQUZGLEVBU0UsSUFBQyxDQUFBLEtBQUQsQ0FBQSxDQVRGLEVBUmU7RUFBQSxDQXhGakIsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/ah/.atom/packages/fuzzy-finder/lib/load-paths-handler.coffee
