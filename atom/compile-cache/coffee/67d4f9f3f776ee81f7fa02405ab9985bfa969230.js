(function() {
  var $, convertMarkdown, createErrorNotes, createReleaseNotes, downloadReleaseNotes, saveReleaseNotes;

  $ = require('atom-space-pen-views').$;

  module.exports = {
    fetch: function(version, callback) {
      return downloadReleaseNotes(version, callback);
    }
  };

  downloadReleaseNotes = function(version, callback) {
    return $.ajax({
      url: 'https://api.github.com/repos/atom/atom/releases',
      dataType: 'json',
      error: function() {
        var errorNotes;
        errorNotes = createErrorNotes(version);
        return typeof callback === "function" ? callback(errorNotes) : void 0;
      },
      success: function(releases) {
        return createReleaseNotes(version, releases, function(releaseNotes) {
          return typeof callback === "function" ? callback(releaseNotes) : void 0;
        });
      }
    });
  };

  createErrorNotes = function(version) {
    var errorNotes;
    errorNotes = [
      {
        version: version,
        notes: 'The release notes failed to download.',
        error: true
      }
    ];
    saveReleaseNotes(errorNotes);
    return errorNotes;
  };

  saveReleaseNotes = function(releaseNotes) {
    return localStorage.setItem('release-notes:releaseNotes', JSON.stringify(releaseNotes));
  };

  createReleaseNotes = function(version, releases, callback) {
    var releaseNotes;
    if (!Array.isArray(releases)) {
      releases = [];
    }
    version = version.replace(/-[a-fA-F0-9]{6}$/, '');
    while ((releases[0] != null) && releases[0].tag_name !== ("v" + version)) {
      releases.shift();
    }
    releaseNotes = releases.map(function(_arg) {
      var body, published_at, tag_name;
      body = _arg.body, published_at = _arg.published_at, tag_name = _arg.tag_name;
      return {
        date: published_at,
        notes: body,
        version: tag_name.substring(1)
      };
    });
    return convertMarkdown(releaseNotes, function() {
      saveReleaseNotes(releaseNotes);
      return callback(releaseNotes);
    });
  };

  convertMarkdown = function(releases, callback) {
    var convert, options, roaster;
    releases = releases.slice();
    roaster = require('roaster');
    options = {
      sanitize: true,
      breaks: true
    };
    convert = function(release) {
      if (release == null) {
        return callback();
      }
      return roaster(release.notes, options, (function(_this) {
        return function(error, html) {
          if (error == null) {
            release.notes = html;
          }
          return convert(releases.pop());
        };
      })(this));
    };
    return convert(releases.pop());
  };

}).call(this);
