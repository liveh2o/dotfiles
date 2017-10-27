(function() {
  var CompositeDisposable, ReleaseNoteStatusBar, ReleaseNotesView, createReleaseNotesView, releaseNotesUri, subscriptions;

  CompositeDisposable = require('atom').CompositeDisposable;

  ReleaseNotesView = null;

  ReleaseNoteStatusBar = require('./release-notes-status-bar');

  releaseNotesUri = 'atom://release-notes';

  createReleaseNotesView = function(uri, version, releaseNotes) {
    if (ReleaseNotesView == null) {
      ReleaseNotesView = require('./release-notes-view');
    }
    return new ReleaseNotesView(uri, version, releaseNotes);
  };

  atom.deserializers.add({
    name: 'ReleaseNotesView',
    deserialize: function(_arg) {
      var releaseNotes, releaseVersion, uri;
      uri = _arg.uri, releaseVersion = _arg.releaseVersion, releaseNotes = _arg.releaseNotes;
      return createReleaseNotesView(uri, releaseVersion, releaseNotes);
    }
  });

  subscriptions = null;

  module.exports = {
    activate: function() {
      var createStatusEntry, previousVersion;
      subscriptions = new CompositeDisposable();
      if (atom.isReleasedVersion()) {
        previousVersion = localStorage.getItem('release-notes:previousVersion');
        localStorage.setItem('release-notes:previousVersion', atom.getVersion());
        subscriptions.add(atom.commands.add('atom-workspace', 'window:update-available', function(event) {
          var version;
          if (!Array.isArray(event != null ? event.detail : void 0)) {
            return;
          }
          version = event.detail[0];
          if (version) {
            localStorage.setItem('release-notes:version', version);
            return require('./release-notes').fetch(version);
          }
        }));
        subscriptions.add(atom.workspace.addOpener(function(uriToOpen) {
          var error, releaseNotes, version, _ref;
          if (uriToOpen !== releaseNotesUri) {
            return;
          }
          version = localStorage.getItem('release-notes:version');
          try {
            releaseNotes = (_ref = JSON.parse(localStorage.getItem('release-notes:releaseNotes'))) != null ? _ref : [];
          } catch (_error) {
            error = _error;
            releaseNotes = [];
          }
          return createReleaseNotesView(releaseNotesUri, version, releaseNotes);
        }));
        createStatusEntry = function() {
          return new ReleaseNoteStatusBar(previousVersion);
        };
        if (document.querySelector('status-bar')) {
          createStatusEntry();
        } else {
          subscriptions.add(atom.packages.onDidActivateAll(function() {
            if (document.querySelector('status-bar')) {
              return createStatusEntry();
            }
          }));
        }
      }
      return subscriptions.add(atom.commands.add('atom-workspace', 'release-notes:show', function() {
        if (atom.isReleasedVersion()) {
          return atom.workspace.open(releaseNotesUri);
        } else {
          return require('shell').openExternal('https://atom.io/releases');
        }
      }));
    },
    deactivate: function() {
      return subscriptions.dispose();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1IQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFDQSxnQkFBQSxHQUFtQixJQURuQixDQUFBOztBQUFBLEVBRUEsb0JBQUEsR0FBdUIsT0FBQSxDQUFTLDRCQUFULENBRnZCLENBQUE7O0FBQUEsRUFJQSxlQUFBLEdBQWtCLHNCQUpsQixDQUFBOztBQUFBLEVBTUEsc0JBQUEsR0FBeUIsU0FBQyxHQUFELEVBQU0sT0FBTixFQUFlLFlBQWYsR0FBQTs7TUFDdkIsbUJBQW9CLE9BQUEsQ0FBUSxzQkFBUjtLQUFwQjtXQUNJLElBQUEsZ0JBQUEsQ0FBaUIsR0FBakIsRUFBc0IsT0FBdEIsRUFBK0IsWUFBL0IsRUFGbUI7RUFBQSxDQU56QixDQUFBOztBQUFBLEVBVUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFuQixDQUNFO0FBQUEsSUFBQSxJQUFBLEVBQU0sa0JBQU47QUFBQSxJQUNBLFdBQUEsRUFBYSxTQUFDLElBQUQsR0FBQTtBQUNYLFVBQUEsaUNBQUE7QUFBQSxNQURhLFdBQUEsS0FBSyxzQkFBQSxnQkFBZ0Isb0JBQUEsWUFDbEMsQ0FBQTthQUFBLHNCQUFBLENBQXVCLEdBQXZCLEVBQTRCLGNBQTVCLEVBQTRDLFlBQTVDLEVBRFc7SUFBQSxDQURiO0dBREYsQ0FWQSxDQUFBOztBQUFBLEVBZUEsYUFBQSxHQUFnQixJQWZoQixDQUFBOztBQUFBLEVBaUJBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLFFBQUEsRUFBVSxTQUFBLEdBQUE7QUFDUixVQUFBLGtDQUFBO0FBQUEsTUFBQSxhQUFBLEdBQW9CLElBQUEsbUJBQUEsQ0FBQSxDQUFwQixDQUFBO0FBRUEsTUFBQSxJQUFHLElBQUksQ0FBQyxpQkFB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
//# sourceURL=/Users/ah/.atom/packages/release-notes/lib/main.coffee