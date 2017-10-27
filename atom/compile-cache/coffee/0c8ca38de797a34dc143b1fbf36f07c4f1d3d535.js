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
          _this.div({
            "class": 'block'
          }, function() {
            return _this.h2({
              "class": 'inline-block',
              outlet: 'chocolateyText'
            }, function() {
              _this.span('Run ');
              _this.code('cup Atom');
              return _this.span(' to install the latest Atom release.');
            });
          });
          return _this.div({
            "class": 'block'
          }, function() {
            _this.button({
              "class": 'inline-block update-instructions btn btn-success',
              outlet: 'updateButton'
            }, 'Restart and update');
            _this.button({
              "class": 'inline-block download-instructions btn btn-success',
              outlet: 'downloadButton'
            }, 'Download new version');
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

    ReleaseNotesView.prototype.isChocolateyBuild = function() {
      return /chocolatey/i.test(atom.getLoadSettings().resourcePath);
    };

    ReleaseNotesView.prototype.initialize = function(uri, releaseVersion, releaseNotes) {
      this.uri = uri;
      this.releaseVersion = releaseVersion;
      this.releaseNotes = releaseNotes;
      this.updateButton.hide();
      this.downloadButton.hide();
      this.chocolateyText.hide();
      if ((this.releaseNotes != null) && (this.releaseVersion != null)) {
        this.description.html(this.releaseNotes);
        this.version.text(this.releaseVersion);
        if (this.releaseVersion !== atom.getVersion()) {
          if (process.platform === 'win32') {
            if (this.isChocolateyBuild()) {
              this.chocolateyText.show();
            } else {
              this.downloadButton.show();
            }
          } else {
            this.updateButton.show();
          }
        }
      }
      this.subscribe(this.updateButton, 'click', function() {
        return atom.workspaceView.trigger('application:install-update');
      });
      this.subscribe(this.viewReleaseNotesButton, 'click', function() {
        return shell.openExternal('https://atom.io/releases');
      });
      return this.subscribe(this.downloadButton, 'click', function() {
        return shell.openExternal('https://atom.io/download/windows');
      });
    };

    return ReleaseNotesView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxLQUFBLEdBQVEsT0FBQSxDQUFRLE9BQVIsQ0FBUixDQUFBOztBQUFBLEVBQ0MsT0FBUSxPQUFBLENBQVEsTUFBUixFQUFSLElBREQsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSix1Q0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSxnQkFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sb0RBQVA7QUFBQSxRQUE2RCxRQUFBLEVBQVUsQ0FBQSxDQUF2RTtPQUFMLEVBQWdGLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDOUUsVUFBQSxLQUFDLENBQUEsRUFBRCxDQUFJO0FBQUEsWUFBQSxPQUFBLEVBQU8saUJBQVA7QUFBQSxZQUEwQixNQUFBLEVBQVEsU0FBbEM7V0FBSixDQUFBLENBQUE7QUFBQSxVQUNBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE9BQUEsRUFBTyxhQUFQO0FBQUEsWUFBc0IsTUFBQSxFQUFRLGFBQTlCO1dBQUwsQ0FEQSxDQUFBO0FBQUEsVUFHQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxPQUFBLEVBQU8sT0FBUDtXQUFMLEVBQXFCLFNBQUEsR0FBQTttQkFDbkIsS0FBQyxDQUFBLEVBQUQsQ0FBSTtBQUFBLGNBQUEsT0FBQSxFQUFPLGNBQVA7QUFBQSxjQUF1QixNQUFBLEVBQVEsZ0JBQS9CO2FBQUosRUFBcUQsU0FBQSxHQUFBO0FBQ25ELGNBQUEsS0FBQyxDQUFBLElBQUQsQ0FBTSxNQUFOLENBQUEsQ0FBQTtBQUFBLGNBQ0EsS0FBQyxDQUFBLElBQUQsQ0FBTSxVQUFOLENBREEsQ0FBQTtxQkFFQSxLQUFDLENBQUEsSUFBRCxDQUFNLHNDQUFOLEVBSG1EO1lBQUEsQ0FBckQsRUFEbUI7VUFBQSxDQUFyQixDQUhBLENBQUE7aUJBU0EsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFPLE9BQVA7V0FBTCxFQUFxQixTQUFBLEdBQUE7QUFDbkIsWUFBQSxLQUFDLENBQUEsTUFBRCxDQUFRO0FBQUEsY0FBQSxPQUFBLEVBQU8sa0RBQVA7QUFBQSxjQUEyRCxNQUFBLEVBQVEsY0FBbkU7YUFBUixFQUEyRixvQkFBM0YsQ0FBQSxDQUFBO0FBQUEsWUFDQSxLQUFDLENBQUEsTUFBRCxDQUFRO0FBQUEsY0FBQSxPQUFBLEVBQU8sb0RBQVA7QUFBQSxjQUE2RCxNQUFBLEVBQVEsZ0JBQXJFO2FBQVIsRUFBK0Ysc0JBQS9GLENBREEsQ0FBQTttQkFFQSxLQUFDLENBQUEsTUFBRCxDQUFRO0FBQUEsY0FBQSxPQUFBLEVBQU8sa0JBQVA7QUFBQSxjQUEyQixNQUFBLEVBQVEsd0JBQW5DO2FBQVIsRUFBcUUseUJBQXJFLEVBSG1CO1VBQUEsQ0FBckIsRUFWOEU7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFoRixFQURRO0lBQUEsQ0FBVixDQUFBOztBQUFBLCtCQWdCQSxRQUFBLEdBQVUsU0FBQSxHQUFBO2FBQ1IsZ0JBRFE7SUFBQSxDQWhCVixDQUFBOztBQUFBLCtCQW1CQSxXQUFBLEdBQWEsU0FBQSxHQUFBO2FBQ1gsV0FEVztJQUFBLENBbkJiLENBQUE7O0FBQUEsK0JBc0JBLE1BQUEsR0FBUSxTQUFBLEdBQUE7YUFDTixJQUFDLENBQUEsSUFESztJQUFBLENBdEJSLENBQUE7O0FBQUEsK0JBeUJBLFNBQUEsR0FBVyxTQUFBLEdBQUE7YUFDVDtBQUFBLFFBQUEsWUFBQSxFQUFjLElBQUMsQ0FBQSxXQUFXLENBQUMsSUFBM0I7QUFBQSxRQUNBLEdBQUEsRUFBSyxJQUFDLENBQUEsR0FETjtBQUFBLFFBRUEsWUFBQSxFQUFjLElBQUMsQ0FBQSxZQUZmO0FBQUEsUUFHQSxjQUFBLEVBQWdCLElBQUMsQ0FBQSxjQUhqQjtRQURTO0lBQUEsQ0F6QlgsQ0FBQTs7QUFBQSwrQkErQkEsaUJBQUEsR0FBbUIsU0FBQSxHQUFBO2FBQ2pCLGFBQWEsQ0FBQyxJQUFkLENBQW1CLElBQUksQ0FBQyxlQUFMLENBQUEsQ0FBc0IsQ0FBQyxZQUExQyxFQURpQjtJQUFBLENBL0JuQixDQUFBOztBQUFBLCtCQWtDQSxVQUFBLEdBQVksU0FBRSxHQUFGLEVBQVEsY0FBUixFQUF5QixZQUF6QixHQUFBO0FBQ1YsTUFEVyxJQUFDLENBQUEsTUFBQSxHQUNaLENBQUE7QUFBQSxNQURpQixJQUFDLENBQUEsaUJBQUEsY0FDbEIsQ0FBQTtBQUFBLE1BRGtDLElBQUMsQ0FBQSxlQUFBLFlBQ25DLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxZQUFZLENBQUMsSUFBZCxDQUFBLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLGNBQWMsQ0FBQyxJQUFoQixDQUFBLENBREEsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLGNBQWMsQ0FBQyxJQUFoQixDQUFBLENBRkEsQ0FBQTtBQUlBLE1BQUEsSUFBRywyQkFBQSxJQUFtQiw2QkFBdEI7QUFDRSxRQUFBLElBQUMsQ0FBQSxXQUFXLENBQUMsSUFBYixDQUFrQixJQUFDLENBQUEsWUFBbkIsQ0FBQSxDQUFBO0FBQUEsUUFDQSxJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyxJQUFDLENBQUEsY0FBZixDQURBLENBQUE7QUFHQSxRQUFBLElBQUcsSUFBQyxDQUFBLGNBQUQsS0FBbUIsSUFBSSxDQUFDLFVBQUwsQ0FBQSxDQUF0QjtBQUNFLFVBQUEsSUFBRyxPQUFPLENBQUMsUUFBUixLQUFvQixPQUF2QjtBQUNFLFlBQUEsSUFBRyxJQUFDLENBQUEsaUJBQUQsQ0FBQSxDQUFIO0FBQ0UsY0FBQSxJQUFDLENBQUEsY0FBYyxDQUFDLElBQWhCLENBQUEsQ0FBQSxDQURGO2FBQUEsTUFBQTtBQUdFLGNBQUEsSUFBQyxDQUFBLGNBQWMsQ0FBQyxJQUFoQixDQUFBLENBQUEsQ0FIRjthQURGO1dBQUEsTUFBQTtBQU1FLFlBQUEsSUFBQyxDQUFBLFlBQVksQ0FBQyxJQUFkLENBQUEsQ0FBQSxDQU5GO1dBREY7U0FKRjtPQUpBO0FBQUEsTUFpQkEsSUFBQyxDQUFBLFNBQUQsQ0FBVyxJQUFDLENBQUEsWUFBWixFQUEwQixPQUExQixFQUFtQyxTQUFBLEdBQUE7ZUFDakMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFuQixDQUEyQiw0QkFBM0IsRUFEaUM7TUFBQSxDQUFuQyxDQWpCQSxDQUFBO0FBQUEsTUFvQkEsSUFBQyxDQUFBLFNBQUQsQ0FBVyxJQUFDLENBQUEsc0JBQVosRUFBb0MsT0FBcEMsRUFBNkMsU0FBQSxHQUFBO2VBQzNDLEtBQUssQ0FBQyxZQUFOLENBQW1CLDBCQUFuQixFQUQyQztNQUFBLENBQTdDLENBcEJBLENBQUE7YUF1QkEsSUFBQyxDQUFBLFNBQUQsQ0FBVyxJQUFDLENBQUEsY0FBWixFQUE0QixPQUE1QixFQUFxQyxTQUFBLEdBQUE7ZUFDbkMsS0FBSyxDQUFDLFlBQU4sQ0FBbUIsa0NBQW5CLEVBRG1DO01BQUEsQ0FBckMsRUF4QlU7SUFBQSxDQWxDWixDQUFBOzs0QkFBQTs7S0FENkIsS0FKL0IsQ0FBQTtBQUFBIgp9
//# sourceURL=/Users/ah/.atom/packages/release-notes/lib/release-notes-view.coffee