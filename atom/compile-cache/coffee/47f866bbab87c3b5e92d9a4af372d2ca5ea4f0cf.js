(function() {
  var ReleaseNoteStatusBar, ReleaseNotesView, createReleaseNotesView, deserializer, releaseNotesUri, shell;

  shell = require('shell');

  ReleaseNotesView = null;

  ReleaseNoteStatusBar = require('./release-notes-status-bar');

  releaseNotesUri = 'atom://release-notes';

  createReleaseNotesView = function(uri, version, releaseNotes) {
    if (ReleaseNotesView == null) {
      ReleaseNotesView = require('./release-notes-view');
    }
    return new ReleaseNotesView(uri, version, releaseNotes);
  };

  deserializer = {
    name: 'ReleaseNotesView',
    deserialize: function(_arg) {
      var releaseNotes, releaseVersion, uri;
      uri = _arg.uri, releaseVersion = _arg.releaseVersion, releaseNotes = _arg.releaseNotes;
      return createReleaseNotesView(uri, releaseVersion, releaseNotes);
    }
  };

  atom.deserializers.add(deserializer);

  module.exports = {
    activate: function() {
      var createStatusEntry, previousVersion;
      if (atom.isReleasedVersion()) {
        previousVersion = localStorage.getItem('release-notes:previousVersion');
        localStorage.setItem('release-notes:previousVersion', atom.getVersion());
        atom.workspaceView.on('window:update-available', function(event, version, releaseNotes) {
          localStorage.setItem("release-notes:version", version);
          return localStorage.setItem("release-notes:releaseNotes", releaseNotes);
        });
        atom.workspace.registerOpener(function(filePath) {
          var releaseNotes, version;
          if (filePath !== releaseNotesUri) {
            return;
          }
          version = localStorage.getItem("release-notes:version");
          releaseNotes = localStorage.getItem("release-notes:releaseNotes");
          return createReleaseNotesView(filePath, version, releaseNotes);
        });
        createStatusEntry = function() {
          return new ReleaseNoteStatusBar(previousVersion);
        };
        if (atom.workspaceView.statusBar != null) {
          createStatusEntry();
        } else {
          atom.packages.once('activated', function() {
            if (atom.workspaceView.statusBar != null) {
              return createStatusEntry();
            }
          });
        }
      }
      return atom.workspaceView.command('release-notes:show', function() {
        if (atom.isReleasedVersion()) {
          return atom.workspaceView.open(releaseNotesUri);
        } else {
          return shell.openExternal('https://atom.io/releases');
        }
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG9HQUFBOztBQUFBLEVBQUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxPQUFSLENBQVIsQ0FBQTs7QUFBQSxFQUNBLGdCQUFBLEdBQW1CLElBRG5CLENBQUE7O0FBQUEsRUFFQSxvQkFBQSxHQUF1QixPQUFBLENBQVMsNEJBQVQsQ0FGdkIsQ0FBQTs7QUFBQSxFQUlBLGVBQUEsR0FBa0Isc0JBSmxCLENBQUE7O0FBQUEsRUFNQSxzQkFBQSxHQUF5QixTQUFDLEdBQUQsRUFBTSxPQUFOLEVBQWUsWUFBZixHQUFBOztNQUN2QixtQkFBb0IsT0FBQSxDQUFRLHNCQUFSO0tBQXBCO1dBQ0ksSUFBQSxnQkFBQSxDQUFpQixHQUFqQixFQUFzQixPQUF0QixFQUErQixZQUEvQixFQUZtQjtFQUFBLENBTnpCLENBQUE7O0FBQUEsRUFVQSxZQUFBLEdBQ0U7QUFBQSxJQUFBLElBQUEsRUFBTSxrQkFBTjtBQUFBLElBQ0EsV0FBQSxFQUFhLFNBQUMsSUFBRCxHQUFBO0FBQ1gsVUFBQSxpQ0FBQTtBQUFBLE1BRGEsV0FBQSxLQUFLLHNCQUFBLGdCQUFnQixvQkFBQSxZQUNsQyxDQUFBO2FBQUEsc0JBQUEsQ0FBdUIsR0FBdkIsRUFBNEIsY0FBNUIsRUFBNEMsWUFBNUMsRUFEVztJQUFBLENBRGI7R0FYRixDQUFBOztBQUFBLEVBY0EsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFuQixDQUF1QixZQUF2QixDQWRBLENBQUE7O0FBQUEsRUFnQkEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsUUFBQSxFQUFVLFNBQUEsR0FBQTtBQUNSLFVBQUEsa0NBQUE7QUFBQSxNQUFBLElBQUcsSUFBSSxDQUFDLGlCQUFMLENBQUEsQ0FBSDtBQUNFLFFBQUEsZUFBQSxHQUFrQixZQUFZLENBQUMsT0FBYixDQUFxQiwrQkFBckIsQ0FBbEIsQ0FBQTtBQUFBLFFBQ0EsWUFBWSxDQUFDLE9BQWIsQ0FBcUIsK0JBQXJCLEVBQXNELElBQUksQ0FBQyxVQUFMLENBQUEsQ0FBdEQsQ0FEQSxDQUFBO0FBQUEsUUFHQSxJQUFJLENBQUMsYUFBYSxDQUFDLEVBQW5CLENBQXNCLHlCQUF0QixFQUFpRCxTQUFDLEtBQUQsRUFBUSxPQUFSLEVBQWlCLFlBQWpCLEdBQUE7QUFDL0MsVUFBQSxZQUFZLENBQUMsT0FBYixDQUFxQix1QkFBckIsRUFBOEMsT0FBOUMsQ0FBQSxDQUFBO2lCQUNBLFlBQVksQ0FBQyxPQUFiLENBQXFCLDRCQUFyQixFQUFtRCxZQUFuRCxFQUYrQztRQUFBLENBQWpELENBSEEsQ0FBQTtBQUFBLFFBT0EsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFmLENBQThCLFNBQUMsUUFBRCxHQUFBO0FBQzVCLGNBQUEscUJBQUE7QUFBQSxVQUFBLElBQWMsUUFBQSxLQUFZLGVBQTFCO0FBQUEsa0JBQUEsQ0FBQTtXQUFBO0FBQUEsVUFFQSxPQUFBLEdBQVUsWUFBWSxDQUFDLE9BQWIsQ0FBcUIsdUJBQXJCLENBRlYsQ0FBQTtBQUFBLFVBR0EsWUFBQSxHQUFlLFlBQVksQ0FBQyxPQUFiLENBQXFCLDRCQUFyQixDQUhmLENBQUE7aUJBSUEsc0JBQUEsQ0FBdUIsUUFBdkIsRUFBaUMsT0FBakMsRUFBMEMsWUFBMUMsRUFMNEI7UUFBQSxDQUE5QixDQVBBLENBQUE7QUFBQSxRQWNBLGlCQUFBLEdBQW9CLFNBQUEsR0FBQTtpQkFBTyxJQUFBLG9CQUFBLENBQXFCLGVBQXJCLEVBQVA7UUFBQSxDQWRwQixDQUFBO0FBZ0JBLFFBQUEsSUFBRyxvQ0FBSDtBQUNFLFVBQUEsaUJBQUEsQ0FBQSxDQUFBLENBREY7U0FBQSxNQUFBO0FBR0UsVUFBQSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQWQsQ0FBbUIsV0FBbkIsRUFBZ0MsU0FBQSxHQUFBO0FBQzlCLFlBQUEsSUFBdUIsb0NBQXZCO3FCQUFBLGlCQUFBLENBQUEsRUFBQTthQUQ4QjtVQUFBLENBQWhDLENBQUEsQ0FIRjtTQWpCRjtPQUFBO2FBdUJBLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBbkIsQ0FBMkIsb0JBQTNCLEVBQWlELFNBQUEsR0FBQTtBQUMvQyxRQUFBLElBQUcsSUFBSSxDQUFDLGlCQUFMLENBQUEsQ0FBSDtpQkFDRSxJQUFJLENBQUMsYUFBYSxDQUFDLElBQW5CLENBQXdCLGVBQXhCLEVBREY7U0FBQSxNQUFBO2lCQUdFLEtBQUssQ0FBQyxZQUFOLENBQW1CLDBCQUFuQixFQUhGO1NBRCtDO01BQUEsQ0FBakQsRUF4QlE7SUFBQSxDQUFWO0dBakJGLENBQUE7QUFBQSIKfQ==
//# sourceURL=/Users/ah/.atom/packages/release-notes/lib/release-notes.coffee