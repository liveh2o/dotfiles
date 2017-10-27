(function() {
  var FuzzyFinderView, GitStatusView, fs,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  fs = require('fs-plus');

  FuzzyFinderView = require('./fuzzy-finder-view');

  module.exports = GitStatusView = (function(_super) {
    __extends(GitStatusView, _super);

    function GitStatusView() {
      return GitStatusView.__super__.constructor.apply(this, arguments);
    }

    GitStatusView.prototype.toggle = function() {
      if (this.hasParent()) {
        return this.cancel();
      } else if (atom.project.getRepo() != null) {
        this.populate();
        return this.attach();
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
      var filePath, paths, status, _ref;
      paths = [];
      _ref = atom.project.getRepo().statuses;
      for (filePath in _ref) {
        status = _ref[filePath];
        if (fs.isFileSync(filePath)) {
          paths.push(filePath);
        }
      }
      return this.setItems(paths);
    };

    return GitStatusView;

  })(FuzzyFinderView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtDQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVIsQ0FBTCxDQUFBOztBQUFBLEVBQ0EsZUFBQSxHQUFrQixPQUFBLENBQVEscUJBQVIsQ0FEbEIsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixvQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsNEJBQUEsTUFBQSxHQUFRLFNBQUEsR0FBQTtBQUNOLE1BQUEsSUFBRyxJQUFDLENBQUEsU0FBRCxDQUFBLENBQUg7ZUFDRSxJQUFDLENBQUEsTUFBRCxDQUFBLEVBREY7T0FBQSxNQUVLLElBQUcsOEJBQUg7QUFDSCxRQUFBLElBQUMsQ0FBQSxRQUFELENBQUEsQ0FBQSxDQUFBO2VBQ0EsSUFBQyxDQUFBLE1BQUQsQ0FBQSxFQUZHO09BSEM7SUFBQSxDQUFSLENBQUE7O0FBQUEsNEJBT0EsZUFBQSxHQUFpQixTQUFDLFNBQUQsR0FBQTtBQUNmLE1BQUEsSUFBRyxTQUFBLEtBQWEsQ0FBaEI7ZUFDRSw2Q0FERjtPQUFBLE1BQUE7ZUFHRSxvREFBQSxTQUFBLEVBSEY7T0FEZTtJQUFBLENBUGpCLENBQUE7O0FBQUEsNEJBYUEsUUFBQSxHQUFVLFNBQUEsR0FBQTtBQUNSLFVBQUEsNkJBQUE7QUFBQSxNQUFBLEtBQUEsR0FBUSxFQUFSLENBQUE7QUFDQTtBQUFBLFdBQUEsZ0JBQUE7Z0NBQUE7QUFDRSxRQUFBLElBQXdCLEVBQUUsQ0FBQyxVQUFILENBQWMsUUFBZCxDQUF4QjtBQUFBLFVBQUEsS0FBSyxDQUFDLElBQU4sQ0FBVyxRQUFYLENBQUEsQ0FBQTtTQURGO0FBQUEsT0FEQTthQUlBLElBQUMsQ0FBQSxRQUFELENBQVUsS0FBVixFQUxRO0lBQUEsQ0FiVixDQUFBOzt5QkFBQTs7S0FEMEIsZ0JBSjVCLENBQUE7QUFBQSIKfQ==
//# sourceURL=/Users/ah/.atom/packages/fuzzy-finder/lib/git-status-view.coffee