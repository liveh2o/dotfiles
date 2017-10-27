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
      } else if (atom.project.getRepositories().some(function(repo) {
        return repo != null;
      })) {
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
      var filePath, paths, repo, workingDirectory, _i, _len, _ref;
      paths = [];
      _ref = atom.project.getRepositories();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        repo = _ref[_i];
        if (!(repo != null)) {
          continue;
        }
        workingDirectory = repo.getWorkingDirectory();
        for (filePath in repo.statuses) {
          filePath = path.join(workingDirectory, filePath);
          if (fs.isFileSync(filePath)) {
            paths.push(filePath);
          }
        }
      }
      return this.setItems(paths);
    };

    return GitStatusView;

  })(FuzzyFinderView);

}).call(this);
