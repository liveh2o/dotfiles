(function() {
  var ReleaseNotesView, View, shell,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  shell = require('shell');

  View = require('atom').View;

  module.exports = ReleaseNotesView = (function(_super) {
    __extends(ReleaseNotesView, _super);

    function ReleaseNotesView() {
      return ReleaseNotesView.__super__.constructor.apply(this, arguments);
    }

    ReleaseNotesView.content = function() {
      return this.div({
        "class": 'release-notes padded pane-item native-key-bindings',
        tabindex: -1
      }, (function(_this) {
        return function() {
          _this.h1({
            "class": 'section-heading',
            outlet: 'version'
          });
          _this.div({
            "class": 'description',
            outlet: 'description'
          });
          return _this.div({
            "class": 'block'
          }, function() {
            _this.button({
              "class": 'inline-block update-instructions btn btn-success',
              outlet: 'updateButton'
            }, 'Restart and update');
            return _this.button({
              "class": 'inline-block btn',
              outlet: 'viewReleaseNotesButton'
            }, 'View past release notes');
          });
        };
      })(this));
    };

    ReleaseNotesView.prototype.getTitle = function() {
      return 'Release Notes';
    };

    ReleaseNotesView.prototype.getIconName = function() {
      return 'squirrel';
    };

    ReleaseNotesView.prototype.getUri = function() {
      return this.uri;
    };

    ReleaseNotesView.prototype.serialize = function() {
      return {
        deserializer: this.constructor.name,
        uri: this.uri,
        releaseNotes: this.releaseNotes,
        releaseVersion: this.releaseVersion
      };
    };

    ReleaseNotesView.prototype.initialize = function(uri, releaseVersion, releaseNotes) {
      this.uri = uri;
      this.releaseVersion = releaseVersion;
      this.releaseNotes = releaseNotes;
      if ((this.releaseNotes != null) && (this.releaseVersion != null)) {
        this.description.html(this.releaseNotes);
        this.version.text(this.releaseVersion);
        if (this.releaseVersion !== atom.getVersion()) {
          this.updateButton.show();
          this.subscribe(this.updateButton, 'click', function() {
            return atom.workspaceView.trigger('application:install-update');
          });
        }
      }
      return this.subscribe(this.viewReleaseNotesButton, 'click', function() {
        return shell.openExternal('https://atom.io/releases');
      });
    };

    return ReleaseNotesView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxLQUFBLEdBQVEsT0FBQSxDQUFRLE9BQVIsQ0FBUixDQUFBOztBQUFBLEVBQ0MsT0FBUSxPQUFBLENBQVEsTUFBUixFQUFSLElBREQsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSix1Q0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSxnQkFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sb0RBQVA7QUFBQSxRQUE2RCxRQUFBLEVBQVUsQ0FBQSxDQUF2RTtPQUFMLEVBQWdGLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDOUUsVUFBQSxLQUFDLENBQUEsRUFBRCxDQUFJO0FBQUEsWUFBQSxPQUFBLEVBQU8saUJBQVA7QUFBQSxZQUEwQixNQUFBLEVBQVEsU0FBbEM7V0FBSixDQUFBLENBQUE7QUFBQSxVQUNBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE9BQUEsRUFBTyxhQUFQO0FBQUEsWUFBc0IsTUFBQSxFQUFRLGFBQTlCO1dBQUwsQ0FEQSxDQUFBO2lCQUVBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE9BQUEsRUFBTyxPQUFQO1dBQUwsRUFBcUIsU0FBQSxHQUFBO0FBQ25CLFlBQUEsS0FBQyxDQUFBLE1BQUQsQ0FBUTtBQUFBLGNBQUEsT0FBQSxFQUFPLGtEQUFQO0FBQUEsY0FBMkQsTUFBQSxFQUFRLGNBQW5FO2FBQVIsRUFBMkYsb0JBQTNGLENBQUEsQ0FBQTttQkFDQSxLQUFDLENBQUEsTUFBRCxDQUFRO0FBQUEsY0FBQSxPQUFBLEVBQU8sa0JBQVA7QUFBQSxjQUEyQixNQUFBLEVBQVEsd0JBQW5DO2FBQVIsRUFBcUUseUJBQXJFLEVBRm1CO1VBQUEsQ0FBckIsRUFIOEU7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFoRixFQURRO0lBQUEsQ0FBVixDQUFBOztBQUFBLCtCQVFBLFFBQUEsR0FBVSxTQUFBLEdBQUE7YUFDUixnQkFEUTtJQUFBLENBUlYsQ0FBQTs7QUFBQSwrQkFXQSxXQUFBLEdBQWEsU0FBQSxHQUFBO2FBQ1gsV0FEVztJQUFBLENBWGIsQ0FBQTs7QUFBQSwrQkFjQSxNQUFBLEdBQVEsU0FBQSxHQUFBO2FBQ04sSUFBQyxDQUFBLElBREs7SUFBQSxDQWRSLENBQUE7O0FBQUEsK0JBaUJBLFNBQUEsR0FBVyxTQUFBLEdBQUE7YUFDVDtBQUFBLFFBQUEsWUFBQSxFQUFjLElBQUMsQ0FBQSxXQUFXLENBQUMsSUFBM0I7QUFBQSxRQUNBLEdBQUEsRUFBSyxJQUFDLENBQUEsR0FETjtBQUFBLFFBRUEsWUFBQSxFQUFjLElBQUMsQ0FBQSxZQUZmO0FBQUEsUUFHQSxjQUFBLEVBQWdCLElBQUMsQ0FBQSxjQUhqQjtRQURTO0lBQUEsQ0FqQlgsQ0FBQTs7QUFBQSwrQkF1QkEsVUFBQSxHQUFZLFNBQUUsR0FBRixFQUFRLGNBQVIsRUFBeUIsWUFBekIsR0FBQTtBQUNWLE1BRFcsSUFBQyxDQUFBLE1BQUEsR0FDWixDQUFBO0FBQUEsTUFEaUIsSUFBQyxDQUFBLGlCQUFBLGNBQ2xCLENBQUE7QUFBQSxNQURrQyxJQUFDLENBQUEsZUFBQSxZQUNuQyxDQUFBO0FBQUEsTUFBQSxJQUFHLDJCQUFBLElBQW1CLDZCQUF0QjtBQUNFLFFBQUEsSUFBQyxDQUFBLFdBQVcsQ0FBQyxJQUFiLENBQWtCLElBQUMsQ0FBQSxZQUFuQixDQUFBLENBQUE7QUFBQSxRQUNBLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjLElBQUMsQ0FBQSxjQUFmLENBREEsQ0FBQTtBQUdBLFFBQUEsSUFBRyxJQUFDLENBQUEsY0FBRCxLQUFtQixJQUFJLENBQUMsVUFBTCxDQUFBLENBQXRCO0FBQ0UsVUFBQSxJQUFDLENBQUEsWUFBWSxDQUFDLElBQWQsQ0FBQSxDQUFBLENBQUE7QUFBQSxVQUNBLElBQUMsQ0FBQSxTQUFELENBQVcsSUFBQyxDQUFBLFlBQVosRUFBMEIsT0FBMUIsRUFBbUMsU0FBQSxHQUFBO21CQUNqQyxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQW5CLENBQTJCLDRCQUEzQixFQURpQztVQUFBLENBQW5DLENBREEsQ0FERjtTQUpGO09BQUE7YUFTQSxJQUFDLENBQUEsU0FBRCxDQUFXLElBQUMsQ0FBQSxzQkFBWixFQUFvQyxPQUFwQyxFQUE2QyxTQUFBLEdBQUE7ZUFDM0MsS0FBSyxDQUFDLFlBQU4sQ0FBbUIsMEJBQW5CLEVBRDJDO01BQUEsQ0FBN0MsRUFWVTtJQUFBLENBdkJaLENBQUE7OzRCQUFBOztLQUQ2QixLQUovQixDQUFBO0FBQUEiCn0=
//# sourceURL=/Users/ah/.atom/packages/release-notes/lib/release-notes-view.coffee