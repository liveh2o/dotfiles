(function() {
  var $, convertMarkdown, createErrorNotes, createReleaseNotes, downloadReleaseNotes, saveReleaseNotes;

  $ = require('space-pen').$;

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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdHQUFBOztBQUFBLEVBQUMsSUFBSyxPQUFBLENBQVEsV0FBUixFQUFMLENBQUQsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLEtBQUEsRUFBTyxTQUFDLE9BQUQsRUFBVSxRQUFWLEdBQUE7YUFBdUIsb0JBQUEsQ0FBcUIsT0FBckIsRUFBOEIsUUFBOUIsRUFBdkI7SUFBQSxDQUFQO0dBSEYsQ0FBQTs7QUFBQSxFQUtBLG9CQUFBLEdBQXVCLFNBQUMsT0FBRCxFQUFVLFFBQVYsR0FBQTtXQUNyQixDQUFDLENBQUMsSUFBRixDQUNFO0FBQUEsTUFBQSxHQUFBLEVBQUssaURBQUw7QUFBQSxNQUNBLFFBQUEsRUFBVSxNQURWO0FBQUEsTUFFQSxLQUFBLEVBQU8sU0FBQSxHQUFBO0FBQ0wsWUFBQSxVQUFBO0FBQUEsUUFBQSxVQUFBLEdBQWEsZ0JBQUEsQ0FBaUIsT0FBakIsQ0FBYixDQUFBO2dEQUNBLFNBQVUscUJBRkw7TUFBQSxDQUZQO0FBQUEsTUFLQSxPQUFBLEVBQVMsU0FBQyxRQUFELEdBQUE7ZUFDUCxrQkFBQSxDQUFtQixPQUFuQixFQUE0QixRQUE1QixFQUFzQyxTQUFDLFlBQUQsR0FBQTtrREFDcEMsU0FBVSx1QkFEMEI7UUFBQSxDQUF0QyxFQURPO01BQUEsQ0FMVDtLQURGLEVBRHFCO0VBQUEsQ0FMdkIsQ0FBQTs7QUFBQSxFQWdCQSxnQkFBQSxHQUFtQixTQUFDLE9BQUQsR0FBQTtBQUNqQixRQUFBLFVBQUE7QUFBQSxJQUFBLFVBQUEsR0FBYTtNQUFDO0FBQUEsUUFBQyxTQUFBLE9BQUQ7QUFBQSxRQUFVLEtBQUEsRUFBTyx1Q0FBakI7QUFBQSxRQUEwRCxLQUFBLEVBQU8sSUFBakU7T0FBRDtLQUFiLENBQUE7QUFBQSxJQUNB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
//# sourceURL=/Users/ah/.atom/packages/release-notes/lib/release-notes.coffee