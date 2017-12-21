Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _loophole = require('loophole');

var _loophole2 = _interopRequireDefault(_loophole);

var _controllersErrorController = require('../controllers/errorController');

'use babel';

var GITHUB_TEMPLATE = 'https://github.com/<%- project %>/<%- repo %>/commit/<%- revision %>';
var BITBUCKET_TEMPLATE = 'https://bitbucket.org/<%- project %>/<%- repo %>/commits/<%- revision %>';
var GITLAB_TEMPLATE = 'https://gitlab.com/<%- project %>/<%- repo %>/commit/<%- revision %>';

function safeTemplate(templateString) {
  return _loophole2['default'].allowUnsafeNewFunction(function () {
    return _lodash2['default'].template(templateString);
  });
}

var RemoteRevision = (function () {
  function RemoteRevision(remote) {
    _classCallCheck(this, RemoteRevision);

    this.remote = remote;
    this.initialize();
  }

  _createClass(RemoteRevision, [{
    key: 'initialize',
    value: function initialize() {
      var data = this.parseProjectAndRepo();
      if (data.project && data.repo) {
        this.project = data.project;
        this.repo = data.repo;
      } else {
        // we were unable to parse data from the remote...
        (0, _controllersErrorController.showError)('error-problem-parsing-data-from-remote');
      }
    }

    /**
     * Generates a URL for the given revision/commit identifier based on the parsed
     * remote data and the template.
     */
  }, {
    key: 'url',
    value: function url(revision) {
      var template = this.getTemplate();
      if (!template) {
        // this should be impossible, so throw
        throw new Error('No template present in RemoteRevision');
      }

      // we were unable to parse upon initialization...so return empty url
      if (!this.project || !this.repo || !revision) {
        return '';
      }

      // create data object used to render template string
      var data = {
        revision: revision,
        project: this.project,
        repo: this.repo
      };

      // return a rendered url
      return template(data);
    }

    /**
     * Parses project and repo from this.remote.
     *
     * @returns Object containing the project and repo.
     */
  }, {
    key: 'parseProjectAndRepo',
    value: function parseProjectAndRepo() {
      // strip off .git if its there
      var strippedRemoteUrl = this.remote.replace(/(\.git)$/, '');

      var pattern = /[:/]([.\w-]*)?\/?([.\w-]*)$/;
      var matches = strippedRemoteUrl.match(pattern);

      // if we have no matches just return empty object. caller should validate
      // data before using it.
      if (!matches) {
        return {};
      }

      // if no project is matched, project and repo are the same.
      return {
        project: matches[1],
        repo: matches[2] || matches[1]
      };
    }

    /**
     * Creates a template function using default GitHub / Bitbucket / GitLab
     * url templates or a custom url template strings specified in the configs.
     */
  }, {
    key: 'getTemplate',
    value: function getTemplate() {
      if (this.isGitHub()) {
        return safeTemplate(GITHUB_TEMPLATE);
      }

      if (this.isBitbucket()) {
        return safeTemplate(BITBUCKET_TEMPLATE);
      }

      if (this.isGitLab()) {
        return safeTemplate(GITLAB_TEMPLATE);
      }

      if (atom.config.get('git-blame.useCustomUrlTemplateIfStandardRemotesFail')) {
        var customUrlTemplate = atom.config.get('git-blame.customCommitUrlTemplateString');

        // if the user hasnt entered a template string, return nothing
        if (/^Example/.test(customUrlTemplate)) {
          return;
        }

        return safeTemplate(customUrlTemplate);
      }
    }

    /**
     * Returns true if this RemoteRevision represents a GitHub repository.
     */
  }, {
    key: 'isGitHub',
    value: function isGitHub() {
      return (/github.com/.test(this.remote)
      );
    }

    /**
     * Returns true if this RemoteRevision represents a Bitbucket repository.
     */
  }, {
    key: 'isBitbucket',
    value: function isBitbucket() {
      return (/bitbucket.org/.test(this.remote)
      );
    }

    /**
     * Returns true if this RemoteRevision represents a GitLab repository.
     */
  }, {
    key: 'isGitLab',
    value: function isGitLab() {
      return (/gitlab.com/.test(this.remote)
      );
    }
  }], [{
    key: 'create',
    value: function create(remoteUrl) {
      var rr = new RemoteRevision(remoteUrl);
      if (!rr.getTemplate()) {
        throw new Error('Cannot create RemoteRevision with invalid template');
      }
      return rr;
    }
  }]);

  return RemoteRevision;
})();

exports['default'] = RemoteRevision;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy90ZXN0Ly5kb3RmaWxlcy9hdG9tL3BhY2thZ2VzL2dpdC1ibGFtZS9saWIvdXRpbC9SZW1vdGVSZXZpc2lvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O3NCQUVjLFFBQVE7Ozs7d0JBQ0QsVUFBVTs7OzswQ0FDTCxnQ0FBZ0M7O0FBSjFELFdBQVcsQ0FBQzs7QUFNWixJQUFNLGVBQWUsR0FBRyxzRUFBc0UsQ0FBQztBQUMvRixJQUFNLGtCQUFrQixHQUFHLDBFQUEwRSxDQUFDO0FBQ3RHLElBQU0sZUFBZSxHQUFHLHNFQUFzRSxDQUFDOztBQUUvRixTQUFTLFlBQVksQ0FBQyxjQUFjLEVBQUU7QUFDcEMsU0FBTyxzQkFBUyxzQkFBc0IsQ0FBQyxZQUFZO0FBQ2pELFdBQU8sb0JBQUUsUUFBUSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0dBQ25DLENBQUMsQ0FBQztDQUNKOztJQUVvQixjQUFjO0FBRXRCLFdBRlEsY0FBYyxDQUVyQixNQUFNLEVBQUU7MEJBRkQsY0FBYzs7QUFHL0IsUUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7QUFDckIsUUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0dBQ25COztlQUxrQixjQUFjOztXQWV2QixzQkFBRztBQUNYLFVBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO0FBQ3hDLFVBQUksSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO0FBQzdCLFlBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztBQUM1QixZQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7T0FDdkIsTUFBTTs7QUFFTCxtREFBVSx3Q0FBd0MsQ0FBQyxDQUFDO09BQ3JEO0tBQ0Y7Ozs7Ozs7O1dBTUUsYUFBQyxRQUFRLEVBQUU7QUFDWixVQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7QUFDcEMsVUFBSSxDQUFDLFFBQVEsRUFBRTs7QUFFYixjQUFNLElBQUksS0FBSyxDQUFDLHVDQUF1QyxDQUFDLENBQUM7T0FDMUQ7OztBQUdELFVBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtBQUM1QyxlQUFPLEVBQUUsQ0FBQztPQUNYOzs7QUFHRCxVQUFNLElBQUksR0FBRztBQUNYLGdCQUFRLEVBQUUsUUFBUTtBQUNsQixlQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87QUFDckIsWUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO09BQ2hCLENBQUM7OztBQUdGLGFBQU8sUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ3ZCOzs7Ozs7Ozs7V0FPa0IsK0JBQUc7O0FBRXBCLFVBQU0saUJBQWlCLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxDQUFDOztBQUU5RCxVQUFNLE9BQU8sR0FBRyw2QkFBNkIsQ0FBQztBQUM5QyxVQUFNLE9BQU8sR0FBRyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7Ozs7QUFJakQsVUFBSSxDQUFDLE9BQU8sRUFBRTtBQUNaLGVBQU8sRUFBRSxDQUFDO09BQ1g7OztBQUdELGFBQU87QUFDTCxlQUFPLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztBQUNuQixZQUFJLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUM7T0FDL0IsQ0FBQztLQUNIOzs7Ozs7OztXQU1VLHVCQUFHO0FBQ1osVUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFLEVBQUU7QUFDbkIsZUFBTyxZQUFZLENBQUMsZUFBZSxDQUFDLENBQUM7T0FDdEM7O0FBRUQsVUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFLEVBQUU7QUFDdEIsZUFBTyxZQUFZLENBQUMsa0JBQWtCLENBQUMsQ0FBQztPQUN6Qzs7QUFFRCxVQUFJLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBRTtBQUNuQixlQUFPLFlBQVksQ0FBQyxlQUFlLENBQUMsQ0FBQztPQUN0Qzs7QUFFRCxVQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHFEQUFxRCxDQUFDLEVBQUU7QUFDMUUsWUFBTSxpQkFBaUIsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyx5Q0FBeUMsQ0FBQyxDQUFDOzs7QUFHckYsWUFBSSxVQUFVLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEVBQUU7QUFDdEMsaUJBQU87U0FDUjs7QUFFRCxlQUFPLFlBQVksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO09BQ3hDO0tBQ0Y7Ozs7Ozs7V0FLTyxvQkFBRztBQUNULGFBQU8sYUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQUM7S0FDdkM7Ozs7Ozs7V0FLVSx1QkFBRztBQUNaLGFBQU8sZ0JBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUFDO0tBQzFDOzs7Ozs7O1dBS08sb0JBQUc7QUFDVCxhQUFPLGFBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUFDO0tBQ3ZDOzs7V0F2SFksZ0JBQUMsU0FBUyxFQUFFO0FBQ3ZCLFVBQU0sRUFBRSxHQUFHLElBQUksY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ3pDLFVBQUksQ0FBQyxFQUFFLENBQUMsV0FBVyxFQUFFLEVBQUU7QUFDckIsY0FBTSxJQUFJLEtBQUssQ0FBQyxvREFBb0QsQ0FBQyxDQUFDO09BQ3ZFO0FBQ0QsYUFBTyxFQUFFLENBQUM7S0FDWDs7O1NBYmtCLGNBQWM7OztxQkFBZCxjQUFjIiwiZmlsZSI6Ii9Vc2Vycy90ZXN0Ly5kb3RmaWxlcy9hdG9tL3BhY2thZ2VzL2dpdC1ibGFtZS9saWIvdXRpbC9SZW1vdGVSZXZpc2lvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IGxvb3Bob2xlIGZyb20gJ2xvb3Bob2xlJztcbmltcG9ydCB7IHNob3dFcnJvciB9IGZyb20gJy4uL2NvbnRyb2xsZXJzL2Vycm9yQ29udHJvbGxlcic7XG5cbmNvbnN0IEdJVEhVQl9URU1QTEFURSA9ICdodHRwczovL2dpdGh1Yi5jb20vPCUtIHByb2plY3QgJT4vPCUtIHJlcG8gJT4vY29tbWl0LzwlLSByZXZpc2lvbiAlPic7XG5jb25zdCBCSVRCVUNLRVRfVEVNUExBVEUgPSAnaHR0cHM6Ly9iaXRidWNrZXQub3JnLzwlLSBwcm9qZWN0ICU+LzwlLSByZXBvICU+L2NvbW1pdHMvPCUtIHJldmlzaW9uICU+JztcbmNvbnN0IEdJVExBQl9URU1QTEFURSA9ICdodHRwczovL2dpdGxhYi5jb20vPCUtIHByb2plY3QgJT4vPCUtIHJlcG8gJT4vY29tbWl0LzwlLSByZXZpc2lvbiAlPic7XG5cbmZ1bmN0aW9uIHNhZmVUZW1wbGF0ZSh0ZW1wbGF0ZVN0cmluZykge1xuICByZXR1cm4gbG9vcGhvbGUuYWxsb3dVbnNhZmVOZXdGdW5jdGlvbihmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIF8udGVtcGxhdGUodGVtcGxhdGVTdHJpbmcpO1xuICB9KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVtb3RlUmV2aXNpb24ge1xuXG4gIGNvbnN0cnVjdG9yKHJlbW90ZSkge1xuICAgIHRoaXMucmVtb3RlID0gcmVtb3RlO1xuICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgc3RhdGljIGNyZWF0ZShyZW1vdGVVcmwpIHtcbiAgICBjb25zdCByciA9IG5ldyBSZW1vdGVSZXZpc2lvbihyZW1vdGVVcmwpO1xuICAgIGlmICghcnIuZ2V0VGVtcGxhdGUoKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgY3JlYXRlIFJlbW90ZVJldmlzaW9uIHdpdGggaW52YWxpZCB0ZW1wbGF0ZScpO1xuICAgIH1cbiAgICByZXR1cm4gcnI7XG4gIH1cblxuICBpbml0aWFsaXplKCkge1xuICAgIGNvbnN0IGRhdGEgPSB0aGlzLnBhcnNlUHJvamVjdEFuZFJlcG8oKTtcbiAgICBpZiAoZGF0YS5wcm9qZWN0ICYmIGRhdGEucmVwbykge1xuICAgICAgdGhpcy5wcm9qZWN0ID0gZGF0YS5wcm9qZWN0O1xuICAgICAgdGhpcy5yZXBvID0gZGF0YS5yZXBvO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyB3ZSB3ZXJlIHVuYWJsZSB0byBwYXJzZSBkYXRhIGZyb20gdGhlIHJlbW90ZS4uLlxuICAgICAgc2hvd0Vycm9yKCdlcnJvci1wcm9ibGVtLXBhcnNpbmctZGF0YS1mcm9tLXJlbW90ZScpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZW5lcmF0ZXMgYSBVUkwgZm9yIHRoZSBnaXZlbiByZXZpc2lvbi9jb21taXQgaWRlbnRpZmllciBiYXNlZCBvbiB0aGUgcGFyc2VkXG4gICAqIHJlbW90ZSBkYXRhIGFuZCB0aGUgdGVtcGxhdGUuXG4gICAqL1xuICB1cmwocmV2aXNpb24pIHtcbiAgICBjb25zdCB0ZW1wbGF0ZSA9IHRoaXMuZ2V0VGVtcGxhdGUoKTtcbiAgICBpZiAoIXRlbXBsYXRlKSB7XG4gICAgICAvLyB0aGlzIHNob3VsZCBiZSBpbXBvc3NpYmxlLCBzbyB0aHJvd1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyB0ZW1wbGF0ZSBwcmVzZW50IGluIFJlbW90ZVJldmlzaW9uJyk7XG4gICAgfVxuXG4gICAgLy8gd2Ugd2VyZSB1bmFibGUgdG8gcGFyc2UgdXBvbiBpbml0aWFsaXphdGlvbi4uLnNvIHJldHVybiBlbXB0eSB1cmxcbiAgICBpZiAoIXRoaXMucHJvamVjdCB8fCAhdGhpcy5yZXBvIHx8ICFyZXZpc2lvbikge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cblxuICAgIC8vIGNyZWF0ZSBkYXRhIG9iamVjdCB1c2VkIHRvIHJlbmRlciB0ZW1wbGF0ZSBzdHJpbmdcbiAgICBjb25zdCBkYXRhID0ge1xuICAgICAgcmV2aXNpb246IHJldmlzaW9uLFxuICAgICAgcHJvamVjdDogdGhpcy5wcm9qZWN0LFxuICAgICAgcmVwbzogdGhpcy5yZXBvLFxuICAgIH07XG5cbiAgICAvLyByZXR1cm4gYSByZW5kZXJlZCB1cmxcbiAgICByZXR1cm4gdGVtcGxhdGUoZGF0YSk7XG4gIH1cblxuICAvKipcbiAgICogUGFyc2VzIHByb2plY3QgYW5kIHJlcG8gZnJvbSB0aGlzLnJlbW90ZS5cbiAgICpcbiAgICogQHJldHVybnMgT2JqZWN0IGNvbnRhaW5pbmcgdGhlIHByb2plY3QgYW5kIHJlcG8uXG4gICAqL1xuICBwYXJzZVByb2plY3RBbmRSZXBvKCkge1xuICAgIC8vIHN0cmlwIG9mZiAuZ2l0IGlmIGl0cyB0aGVyZVxuICAgIGNvbnN0IHN0cmlwcGVkUmVtb3RlVXJsID0gdGhpcy5yZW1vdGUucmVwbGFjZSgvKFxcLmdpdCkkLywgJycpO1xuXG4gICAgY29uc3QgcGF0dGVybiA9IC9bOi9dKFsuXFx3LV0qKT9cXC8/KFsuXFx3LV0qKSQvO1xuICAgIGNvbnN0IG1hdGNoZXMgPSBzdHJpcHBlZFJlbW90ZVVybC5tYXRjaChwYXR0ZXJuKTtcblxuICAgIC8vIGlmIHdlIGhhdmUgbm8gbWF0Y2hlcyBqdXN0IHJldHVybiBlbXB0eSBvYmplY3QuIGNhbGxlciBzaG91bGQgdmFsaWRhdGVcbiAgICAvLyBkYXRhIGJlZm9yZSB1c2luZyBpdC5cbiAgICBpZiAoIW1hdGNoZXMpIHtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG5cbiAgICAvLyBpZiBubyBwcm9qZWN0IGlzIG1hdGNoZWQsIHByb2plY3QgYW5kIHJlcG8gYXJlIHRoZSBzYW1lLlxuICAgIHJldHVybiB7XG4gICAgICBwcm9qZWN0OiBtYXRjaGVzWzFdLFxuICAgICAgcmVwbzogbWF0Y2hlc1syXSB8fCBtYXRjaGVzWzFdLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIHRlbXBsYXRlIGZ1bmN0aW9uIHVzaW5nIGRlZmF1bHQgR2l0SHViIC8gQml0YnVja2V0IC8gR2l0TGFiXG4gICAqIHVybCB0ZW1wbGF0ZXMgb3IgYSBjdXN0b20gdXJsIHRlbXBsYXRlIHN0cmluZ3Mgc3BlY2lmaWVkIGluIHRoZSBjb25maWdzLlxuICAgKi9cbiAgZ2V0VGVtcGxhdGUoKSB7XG4gICAgaWYgKHRoaXMuaXNHaXRIdWIoKSkge1xuICAgICAgcmV0dXJuIHNhZmVUZW1wbGF0ZShHSVRIVUJfVEVNUExBVEUpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmlzQml0YnVja2V0KCkpIHtcbiAgICAgIHJldHVybiBzYWZlVGVtcGxhdGUoQklUQlVDS0VUX1RFTVBMQVRFKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5pc0dpdExhYigpKSB7XG4gICAgICByZXR1cm4gc2FmZVRlbXBsYXRlKEdJVExBQl9URU1QTEFURSk7XG4gICAgfVxuXG4gICAgaWYgKGF0b20uY29uZmlnLmdldCgnZ2l0LWJsYW1lLnVzZUN1c3RvbVVybFRlbXBsYXRlSWZTdGFuZGFyZFJlbW90ZXNGYWlsJykpIHtcbiAgICAgIGNvbnN0IGN1c3RvbVVybFRlbXBsYXRlID0gYXRvbS5jb25maWcuZ2V0KCdnaXQtYmxhbWUuY3VzdG9tQ29tbWl0VXJsVGVtcGxhdGVTdHJpbmcnKTtcblxuICAgICAgLy8gaWYgdGhlIHVzZXIgaGFzbnQgZW50ZXJlZCBhIHRlbXBsYXRlIHN0cmluZywgcmV0dXJuIG5vdGhpbmdcbiAgICAgIGlmICgvXkV4YW1wbGUvLnRlc3QoY3VzdG9tVXJsVGVtcGxhdGUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHNhZmVUZW1wbGF0ZShjdXN0b21VcmxUZW1wbGF0ZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdHJ1ZSBpZiB0aGlzIFJlbW90ZVJldmlzaW9uIHJlcHJlc2VudHMgYSBHaXRIdWIgcmVwb3NpdG9yeS5cbiAgICovXG4gIGlzR2l0SHViKCkge1xuICAgIHJldHVybiAvZ2l0aHViLmNvbS8udGVzdCh0aGlzLnJlbW90ZSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0cnVlIGlmIHRoaXMgUmVtb3RlUmV2aXNpb24gcmVwcmVzZW50cyBhIEJpdGJ1Y2tldCByZXBvc2l0b3J5LlxuICAgKi9cbiAgaXNCaXRidWNrZXQoKSB7XG4gICAgcmV0dXJuIC9iaXRidWNrZXQub3JnLy50ZXN0KHRoaXMucmVtb3RlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRydWUgaWYgdGhpcyBSZW1vdGVSZXZpc2lvbiByZXByZXNlbnRzIGEgR2l0TGFiIHJlcG9zaXRvcnkuXG4gICAqL1xuICBpc0dpdExhYigpIHtcbiAgICByZXR1cm4gL2dpdGxhYi5jb20vLnRlc3QodGhpcy5yZW1vdGUpO1xuICB9XG5cbn1cbiJdfQ==