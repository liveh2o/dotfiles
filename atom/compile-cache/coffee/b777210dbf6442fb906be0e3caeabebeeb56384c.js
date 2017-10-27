(function() {
  var ReleaseNoteStatusBar, ReleaseNotesView, createReleaseNotesView, deserializer, releaseNotesUri;

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
      var releaseNotes, uri, version;
      uri = _arg.uri, version = _arg.version, releaseNotes = _arg.releaseNotes;
      return createReleaseNotesView(uri, version, releaseNotes);
    }
  };

  atom.deserializers.add(deserializer);

  module.exports = {
    activate: function() {
      var createStatusEntry, previousVersion;
      previousVersion = atom.config.get('release-notes.viewedVersion');
      atom.config.set('release-notes.viewedVersion', atom.getVersion());
      atom.workspaceView.on('window:update-available', (function(_this) {
        return function(event, version, releaseNotes) {
          localStorage["release-notes:version"] = version;
          return localStorage["release-notes:releaseNotes"] = releaseNotes;
        };
      })(this));
      atom.project.registerOpener(function(filePath) {
        var releaseNotes, version;
        if (filePath !== releaseNotesUri) {
          return;
        }
        version = localStorage["release-notes:version"];
        releaseNotes = localStorage["release-notes:releaseNotes"];
        return createReleaseNotesView(filePath, version, releaseNotes);
      });
      atom.workspaceView.command('release-notes:show', function() {
        return atom.workspaceView.open('atom://release-notes');
      });
      createStatusEntry = function() {
        return new ReleaseNoteStatusBar(previousVersion);
      };
      if (atom.workspaceView.statusBar) {
        return createStatusEntry();
      } else {
        return atom.packages.once('activated', function() {
          return createStatusEntry();
        });
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZGQUFBOztBQUFBLEVBQUEsZ0JBQUEsR0FBbUIsSUFBbkIsQ0FBQTs7QUFBQSxFQUNBLG9CQUFBLEdBQXVCLE9BQUEsQ0FBUyw0QkFBVCxDQUR2QixDQUFBOztBQUFBLEVBR0EsZUFBQSxHQUFrQixzQkFIbEIsQ0FBQTs7QUFBQSxFQUtBLHNCQUFBLEdBQXlCLFNBQUMsR0FBRCxFQUFNLE9BQU4sRUFBZSxZQUFmLEdBQUE7O01BQ3ZCLG1CQUFvQixPQUFBLENBQVEsc0JBQVI7S0FBcEI7V0FDSSxJQUFBLGdCQUFBLENBQWlCLEdBQWpCLEVBQXNCLE9BQXRCLEVBQStCLFlBQS9CLEVBRm1CO0VBQUEsQ0FMekIsQ0FBQTs7QUFBQSxFQVNBLFlBQUEsR0FDRTtBQUFBLElBQUEsSUFBQSxFQUFNLGtCQUFOO0FBQUEsSUFDQSxXQUFBLEVBQWEsU0FBQyxJQUFELEdBQUE7QUFDWCxVQUFBLDBCQUFBO0FBQUEsTUFEYSxXQUFBLEtBQUssZUFBQSxTQUFTLG9CQUFBLFlBQzNCLENBQUE7YUFBQSxzQkFBQSxDQUF1QixHQUF2QixFQUE0QixPQUE1QixFQUFxQyxZQUFyQyxFQURXO0lBQUEsQ0FEYjtHQVZGLENBQUE7O0FBQUEsRUFhQSxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQW5CLENBQXVCLFlBQXZCLENBYkEsQ0FBQTs7QUFBQSxFQWVBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLFFBQUEsRUFBVSxTQUFBLEdBQUE7QUFDUixVQUFBLGtDQUFBO0FBQUEsTUFBQSxlQUFBLEdBQWtCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiw2QkFBaEIsQ0FBbEIsQ0FBQTtBQUFBLE1BQ0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDZCQUFoQixFQUErQyxJQUFJLENBQUMsVUFBTCxDQUFBLENBQS9DLENBREEsQ0FBQTtBQUFBLE1BR0EsSUFBSSxDQUFDLGFBQWEsQ0FBQyxFQUFuQixDQUFzQix5QkFBdEIsRUFBaUQsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsS0FBRCxFQUFRLE9BQVIsRUFBaUIsWUFBakIsR0FBQTtBQUMvQyxVQUFBLFlBQWEsQ0FBQSx1QkFBQSxDQUFiLEdBQXdDLE9BQXhDLENBQUE7aUJBQ0EsWUFBYSxDQUFBLDRCQUFBLENBQWIsR0FBNkMsYUFGRTtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWpELENBSEEsQ0FBQTtBQUFBLE1BT0EsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFiLENBQTRCLFNBQUMsUUFBRCxHQUFBO0FBQzFCLFlBQUEscUJBQUE7QUFBQSxRQUFBLElBQWMsUUFBQSxLQUFZLGVBQTFCO0FBQUEsZ0JBQUEsQ0FBQTtTQUFBO0FBQUEsUUFFQSxPQUFBLEdBQVUsWUFBYSxDQUFBLHVCQUFBLENBRnZCLENBQUE7QUFBQSxRQUdBLFlBQUEsR0FBZSxZQUFhLENBQUEsNEJBQUEsQ0FINUIsQ0FBQTtlQUlBLHNCQUFBLENBQXVCLFFBQXZCLEVBQWlDLE9BQWpDLEVBQTBDLFlBQTFDLEVBTDBCO01BQUEsQ0FBNUIsQ0FQQSxDQUFBO0FBQUEsTUFjQSxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQW5CLENBQTJCLG9CQUEzQixFQUFpRCxTQUFBLEdBQUE7ZUFDL0MsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFuQixDQUF3QixzQkFBeEIsRUFEK0M7TUFBQSxDQUFqRCxDQWRBLENBQUE7QUFBQSxNQWlCQSxpQkFBQSxHQUFvQixTQUFBLEdBQUE7ZUFDZCxJQUFBLG9CQUFBLENBQXFCLGVBQXJCLEVBRGM7TUFBQSxDQWpCcEIsQ0FBQTtBQW9CQSxNQUFBLElBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUF0QjtlQUNFLGlCQUFBLENBQUEsRUFERjtPQUFBLE1BQUE7ZUFHRSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQWQsQ0FBbUIsV0FBbkIsRUFBZ0MsU0FBQSxHQUFBO2lCQUM5QixpQkFBQSxDQUFBLEVBRDhCO1FBQUEsQ0FBaEMsRUFIRjtPQXJCUTtJQUFBLENBQVY7R0FoQkYsQ0FBQTtBQUFBIgp9
//# sourceURL=/Users/ah/.atom/packages/release-notes/lib/release-notes.coffee