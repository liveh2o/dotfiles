(function() {
  var $, FuzzyFinderView, PathLoader, ProjectView, humanize,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  $ = require('atom').$;

  humanize = require('humanize-plus');

  FuzzyFinderView = require('./fuzzy-finder-view');

  PathLoader = require('./path-loader');

  module.exports = ProjectView = (function(_super) {
    __extends(ProjectView, _super);

    function ProjectView() {
      return ProjectView.__super__.constructor.apply(this, arguments);
    }

    ProjectView.prototype.paths = null;

    ProjectView.prototype.reloadPaths = true;

    ProjectView.prototype.initialize = function(paths) {
      var _ref;
      this.paths = paths;
      ProjectView.__super__.initialize.apply(this, arguments);
      if (((_ref = this.paths) != null ? _ref.length : void 0) > 0) {
        this.reloadPaths = false;
      }
      this.subscribe($(window), 'focus', (function(_this) {
        return function() {
          return _this.reloadPaths = true;
        };
      })(this));
      return this.subscribe(atom.config.observe('fuzzy-finder.ignoredNames', {
        callNow: false
      }, (function(_this) {
        return function() {
          return _this.reloadPaths = true;
        };
      })(this)));
    };

    ProjectView.prototype.toggle = function() {
      if (this.hasParent()) {
        return this.cancel();
      } else if (atom.project.getPath() != null) {
        this.populate();
        return this.attach();
      }
    };

    ProjectView.prototype.getEmptyMessage = function(itemCount) {
      if (itemCount === 0) {
        return 'Project is empty';
      } else {
        return ProjectView.__super__.getEmptyMessage.apply(this, arguments);
      }
    };

    ProjectView.prototype.populate = function() {
      var pathsFound, _ref;
      if (this.paths != null) {
        this.setItems(this.paths);
      }
      if (this.reloadPaths) {
        this.reloadPaths = false;
        if ((_ref = this.loadPathsTask) != null) {
          _ref.terminate();
        }
        this.loadPathsTask = PathLoader.startTask((function(_this) {
          return function(paths) {
            _this.paths = paths;
            return _this.populate();
          };
        })(this));
        if (this.paths != null) {
          return this.setLoading("Reindexing project\u2026");
        } else {
          this.setLoading("Indexing project\u2026");
          this.loadingBadge.text('0');
          pathsFound = 0;
          return this.loadPathsTask.on('load-paths:paths-found', (function(_this) {
            return function(paths) {
              pathsFound += paths.length;
              return _this.loadingBadge.text(humanize.intComma(pathsFound));
            };
          })(this));
        }
      }
    };

    ProjectView.prototype.beforeRemove = function() {
      var _ref;
      return (_ref = this.loadPathsTask) != null ? _ref.terminate() : void 0;
    };

    return ProjectView;

  })(FuzzyFinderView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHFEQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxJQUFLLE9BQUEsQ0FBUSxNQUFSLEVBQUwsQ0FBRCxDQUFBOztBQUFBLEVBQ0EsUUFBQSxHQUFXLE9BQUEsQ0FBUSxlQUFSLENBRFgsQ0FBQTs7QUFBQSxFQUdBLGVBQUEsR0FBa0IsT0FBQSxDQUFRLHFCQUFSLENBSGxCLENBQUE7O0FBQUEsRUFJQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGVBQVIsQ0FKYixDQUFBOztBQUFBLEVBTUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLGtDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSwwQkFBQSxLQUFBLEdBQU8sSUFBUCxDQUFBOztBQUFBLDBCQUNBLFdBQUEsR0FBYSxJQURiLENBQUE7O0FBQUEsMEJBR0EsVUFBQSxHQUFZLFNBQUUsS0FBRixHQUFBO0FBQ1YsVUFBQSxJQUFBO0FBQUEsTUFEVyxJQUFDLENBQUEsUUFBQSxLQUNaLENBQUE7QUFBQSxNQUFBLDZDQUFBLFNBQUEsQ0FBQSxDQUFBO0FBRUEsTUFBQSx1Q0FBOEIsQ0FBRSxnQkFBUixHQUFpQixDQUF6QztBQUFBLFFBQUEsSUFBQyxDQUFBLFdBQUQsR0FBZSxLQUFmLENBQUE7T0FGQTtBQUFBLE1BSUEsSUFBQyxDQUFBLFNBQUQsQ0FBVyxDQUFBLENBQUUsTUFBRixDQUFYLEVBQXNCLE9BQXRCLEVBQStCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQzdCLEtBQUMsQ0FBQSxXQUFELEdBQWUsS0FEYztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQS9CLENBSkEsQ0FBQTthQU1BLElBQUMsQ0FBQSxTQUFELENBQVcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQW9CLDJCQUFwQixF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
//# sourceURL=/Users/ah/.atom/packages/fuzzy-finder/lib/project-view.coffee