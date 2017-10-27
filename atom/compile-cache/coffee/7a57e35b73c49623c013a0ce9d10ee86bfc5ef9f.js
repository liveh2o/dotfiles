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
      var filePath, paths, status, workingDirectory, _ref;
      paths = [];
      workingDirectory = atom.project.getRepo().getWorkingDirectory();
      _ref = atom.project.getRepo().statuses;
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHdDQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBUCxDQUFBOztBQUFBLEVBQ0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSLENBREwsQ0FBQTs7QUFBQSxFQUVBLGVBQUEsR0FBa0IsT0FBQSxDQUFRLHFCQUFSLENBRmxCLENBQUE7O0FBQUEsRUFJQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osb0NBQUEsQ0FBQTs7OztLQUFBOztBQUFBLDRCQUFBLE1BQUEsR0FBUSxTQUFBLEdBQUE7QUFDTixNQUFBLElBQUcsSUFBQyxDQUFBLFNBQUQsQ0FBQSxDQUFIO2VBQ0UsSUFBQyxDQUFBLE1BQUQsQ0FBQSxFQURGO09BQUEsTUFFSyxJQUFHLDhCQUFIO0FBQ0gsUUFBQSxJQUFDLENBQUEsUUFBRCxDQUFBLENBQUEsQ0FBQTtlQUNBLElBQUMsQ0FBQSxNQUFELENBQUEsRUFGRztPQUhDO0lBQUEsQ0FBUixDQUFBOztBQUFBLDRCQU9BLGVBQUEsR0FBaUIsU0FBQyxTQUFELEdBQUE7QUFDZixNQUFBLElBQUcsU0FBQSxLQUFhLENBQWhCO2VBQ0UsNkNBREY7T0FBQSxNQUFBO2VBR0Usb0RBQUEsU0FBQSxFQUhGO09BRGU7SUFBQSxDQVBqQixDQUFBOztBQUFBLDRCQWFBLFFBQUEsR0FBVSxTQUFBLEdBQUE7QUFDUixVQUFBLCtDQUFBO0FBQUEsTUFBQSxLQUFBLEdBQVEsRUFBUixDQUFBO0FBQUEsTUFDQSxnQkFBQSxHQUFtQixJQUFJLENBQUMsT0FBTyxDQUFDLE9BQWIsQ0FBQSxDQUFzQixDQUFDLG1CQUF2QixDQUFBLENBRG5CLENBQUE7QUFFQTtBQUFBLFdBQUEsZ0JBQUE7Z0NBQUE7QUFDRSxRQUFBLFFBQUEsR0FBVyxJQUFJLENBQUMsSUFBTCxDQUFVLGdCQUFWLEVBQTRCLFFBQTVCLENBQVgsQ0FBQTtBQUNBLFFBQUEsSUFBd0IsRUFBRSxDQUFDLFVBQUgsQ0FBYyxRQUFkLENBQXhCO0FBQUEsVUFBQSxLQUFLLENBQUMsSUFBTixDQUFXLFFBQVgsQ0FBQSxDQUFBO1NBRkY7QUFBQSxPQUZBO2FBTUEsSUFBQyxDQUFBLFFBQUQsQ0FBVSxLQUFWLEVBUFE7SUFBQSxDQWJWLENBQUE7O3lCQUFBOztLQUQwQixnQkFMNUIsQ0FBQTtBQUFBIgp9
//# sourceURL=/Users/ah/.atom/packages/fuzzy-finder/lib/git-status-view.coffee