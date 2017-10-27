(function() {
  var CompositeDisposable, ReleaseNotesView, createReleaseNotesView, releaseNotesUri, subscriptions;

  CompositeDisposable = require('atom').CompositeDisposable;

  ReleaseNotesView = null;

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
      subscriptions = new CompositeDisposable();
      if (atom.isReleasedVersion()) {
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
    },
    consumeStatusBar: function(statusBar) {
      var ReleaseNoteStatusBar, previousVersion;
      if (!atom.isReleasedVersion()) {
        return;
      }
      previousVersion = localStorage.getItem('release-notes:previousVersion');
      localStorage.setItem('release-notes:previousVersion', atom.getVersion());
      ReleaseNoteStatusBar = require('./release-notes-status-bar');
      return new ReleaseNoteStatusBar(statusBar, previousVersion);
    }
  };

}).call(this);
