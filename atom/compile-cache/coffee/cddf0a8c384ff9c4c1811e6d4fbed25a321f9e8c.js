(function() {
  var FuzzyFinderView, GitStatusView, fs, path,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  path = require('path');

  fs = require('fs-plus');

  FuzzyFinderView = require('./fuzzy-finder-view');

  module.exports = GitStatusView = (function(_super) {
    __extends(GitStatusView, _super);

    function GitStatusView() {
      return GitStatusView.__super__.constructor.apply(this, arguments);
    }

    GitStatusView.prototype.toggle = function() {
      var _ref;
      if ((_ref = this.panel) != null ? _ref.isVisible() : void 0) {
        return this.cancel();
      } else if (atom.project.getRepositories()[0] != null) {
        this.populate();
        return this.show();
      }
    };

    GitStatusView.prototype.getEmptyMessage = function(itemCount) {
      if (itemCount === 0) {
        return 'Nothing to commit, working directory clean';
      } else {
        return GitStatusView.__super__.getEmptyMessage.apply(this, arguments);
      }
    };

    GitStatusView.prototype.populate = function() {
      var filePath, paths, repo, status, workingDirectory, _ref;
      paths = [];
      repo = atom.project.getRepositories()[0];
      workingDirectory = repo.getWorkingDirectory();
      _ref = repo.statuses;
      for (filePath in _ref) {
        status = _ref[filePath];
        filePath = path.join(workingDirectory, filePath);
        if (fs.isFileSync(filePath)) {
          paths.push(filePath);
        }
      }
      return this.setItems(paths);
    };

    return GitStatusView;

  })(FuzzyFinderView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHdDQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBUCxDQUFBOztBQUFBLEVBQ0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSLENBREwsQ0FBQTs7QUFBQSxFQUVBLGVBQUEsR0FBa0IsT0FBQSxDQUFRLHFCQUFSLENBRmxCLENBQUE7O0FBQUEsRUFJQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osb0NBQUEsQ0FBQTs7OztLQUFBOztBQUFBLDRCQUFBLE1BQUEsR0FBUSxTQUFBLEdBQUE7QUFDTixVQUFBLElBQUE7QUFBQSxNQUFBLHNDQUFTLENBQUUsU0FBUixDQUFBLFVBQUg7ZUFDRSxJQUFDLENBQUEsTUFBRCxDQUFBLEVBREY7T0FBQSxNQUVLLElBQUcseUNBQUg7QUFDSCxRQUFBLElBQUMsQ0FBQSxRQUFELENBQUEsQ0FBQSxDQUFBO2VBQ0EsSUFBQyxDQUFBLElBQUQsQ0FBQSxFQUZHO09BSEM7SUFBQSxDQUFSLENBQUE7O0FBQUEsNEJBT0EsZUFBQSxHQUFpQixTQUFDLFNBQUQsR0FBQTtBQUNmLE1BQUEsSUFBRyxTQUFBLEtBQWEsQ0FBaEI7ZUFDRSw2Q0FERjtPQUFBLE1BQUE7ZUFHRSxvREFBQSxTQUFBLEVBSEY7T0FEZTtJQUFBLENBUGpCLENBQUE7O0FBQUEsNEJBYUEsUUFBQSxHQUFVLFNBQUEsR0FBQTtBQUNSLFVBQUEscURBQUE7QUFBQSxNQUFBLEtBQUEsR0FBUSxFQUFSLENBQUE7QUFBQSxNQUNDLE9BQVEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxlQUFiLENBQUEsSUFEVCxDQUFBO0FBQUEsTUFFQSxnQkFBQSxHQUFtQixJQUFJLENBQUMsbUJBQUwsQ0FBQSxDQUZuQixDQUFBO0FBR0E7QUFBQSxXQUFBLGdCQUFBO2dDQUFBO0FBQ0UsUUFBQSxRQUFBLEdBQVcsSUFBSSxDQUFDLElBQUwsQ0FBVSxnQkFBVixFQUE0QixRQUE1QixDQUFYLENBQUE7QUFDQSxRQUFBLElBQXdCLEVBQUUsQ0FBQyxVQUFILENBQWMsUUFBZCxDQUF4QjtBQUFBLFVBQUEsS0FBSyxDQUFDLElBQU4sQ0FBVyxRQUFYLENBQUEsQ0FBQTtTQUZGO0FBQUEsT0FIQTthQU9BLElBQUMsQ0FBQSxRQUFELENBQVUsS0FBVixFQVJRO0lBQUEsQ0FiVixDQUFBOzt5QkFBQTs7S0FEMEIsZ0JBTDVCLENBQUE7QUFBQSIKfQ==
//# sourceURL=/Users/ah/.atom/packages/fuzzy-finder/lib/git-status-view.coffee