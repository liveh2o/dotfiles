'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _ = require('underscore');
var GitCommander = require('./GitCommander');

var Blamer = (function () {
  function Blamer(repo) {
    _classCallCheck(this, Blamer);

    if (!repo) {
      throw new Error('Cannot create a Blamer without a repository.');
    }
    this.repo = repo;
    this.initialize();
  }

  /**
   * Initializes this Blamer instance, by creating git-tools repos for the root
   * repository and submodules.
   */

  _createClass(Blamer, [{
    key: 'initialize',
    value: function initialize() {
      this.tools = {};
      this.tools.root = new GitCommander(this.repo.getWorkingDirectory());

      var submodules = this.repo.submodules;
      if (submodules) {
        for (var submodulePath in submodules) {
          this.tools[submodulePath] = new GitCommander(this.repo.getWorkingDirectory() + '/' + submodulePath);
        }
      }
    }

    /**
     * Blames the given filePath and calls callback with blame lines or error.
     *
     * @param {string} filePath - filePath to blame
     * @param {function} callback - callback to call back with blame data
     */
  }, {
    key: 'blame',
    value: function blame(filePath, callback) {
      // Ensure file path is relative to root repo
      filePath = this.repo.relativize(filePath);
      var repoUtil = this.repoUtilForPath(filePath);

      // Ensure that if this file is in a submodule, we remove the submodule dir
      // from the path
      filePath = this.removeSubmodulePrefix(filePath);

      if (!_.isFunction(callback)) {
        throw new Error('Must be called with a callback function');
      }

      // Make the async blame call on the git repo
      repoUtil.blame(filePath, function (err, blame) {
        callback(err, blame);
      });
    }

    /**
     * Utility to get the GitCommander repository for the given filePath. Takes into
     * account whether the file is part of a submodule and returns that repository
     * if necessary.
     *
     * @param {string} filePath - the path to the file in question.
     */
  }, {
    key: 'repoUtilForPath',
    value: function repoUtilForPath(filePath) {
      var submodules = this.repo.submodules;

      // By default, we return the root GitCommander repository.
      var repoUtil = this.tools.root;

      // if we have submodules, loop through them and see if the given file path
      // belongs inside one of the repositories. If so, we return the GitCommander repo
      // for that submodule.
      if (submodules) {
        for (var submodulePath in submodules) {
          var submoduleRegex = new RegExp('^' + submodulePath);
          if (submoduleRegex.test(filePath)) {
            repoUtil = this.tools[submodulePath];
          }
        }
      }

      return repoUtil;
    }

    /**
     * If the file path given is inside a submodule, removes the submodule
     * directory prefix.
     *
     * @param {string} filePath - path to file to relativize
     * @param {Repo} toolsRepo - git-tools Repo
     */
  }, {
    key: 'removeSubmodulePrefix',
    value: function removeSubmodulePrefix(filePath) {
      var submodules = this.repo.submodules;
      if (submodules) {
        for (var submodulePath in submodules) {
          var submoduleRegex = new RegExp('^' + submodulePath);
          if (submoduleRegex.test(filePath)) {
            filePath = filePath.replace(submoduleRegex, '');
          }
        }
      }

      // remove leading '/' if there is one before returning
      filePath = filePath.replace(/^\//, '');
      return filePath;
    }
  }]);

  return Blamer;
})();

exports['default'] = Blamer;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9naXQtYmxhbWUvbGliL3V0aWwvYmxhbWVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQzs7Ozs7Ozs7OztBQUVaLElBQU0sQ0FBQyxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUNoQyxJQUFNLFlBQVksR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQzs7SUFHMUIsTUFBTTtBQUVkLFdBRlEsTUFBTSxDQUViLElBQUksRUFBRTswQkFGQyxNQUFNOztBQUd2QixRQUFJLENBQUMsSUFBSSxFQUFFO0FBQ1QsWUFBTSxJQUFJLEtBQUssQ0FBQyw4Q0FBOEMsQ0FBQyxDQUFDO0tBQ2pFO0FBQ0QsUUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7QUFDakIsUUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0dBQ25COzs7Ozs7O2VBUmtCLE1BQU07O1dBY2Ysc0JBQUc7QUFDWCxVQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztBQUNoQixVQUFJLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxJQUFJLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUMsQ0FBQzs7QUFFcEUsVUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7QUFDdEMsVUFBSSxVQUFVLEVBQUU7QUFDZCxhQUFLLElBQUksYUFBYSxJQUFJLFVBQVUsRUFBRTtBQUNwQyxjQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxHQUFHLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsR0FBRyxHQUFHLEdBQUcsYUFBYSxDQUFDLENBQUM7U0FDckc7T0FDRjtLQUNGOzs7Ozs7Ozs7O1dBUUksZUFBQyxRQUFRLEVBQUUsUUFBUSxFQUFFOztBQUV4QixjQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDMUMsVUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQzs7OztBQUk5QyxjQUFRLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixDQUFDLFFBQVEsQ0FBQyxDQUFDOztBQUVoRCxVQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsRUFBRTtBQUMzQixjQUFNLElBQUksS0FBSyxDQUFDLHlDQUF5QyxDQUFDLENBQUM7T0FDNUQ7OztBQUdELGNBQVEsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLFVBQVMsR0FBRyxFQUFFLEtBQUssRUFBRTtBQUM1QyxnQkFBUSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztPQUN0QixDQUFDLENBQUM7S0FDSjs7Ozs7Ozs7Ozs7V0FTYyx5QkFBQyxRQUFRLEVBQUU7QUFDeEIsVUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7OztBQUd0QyxVQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQzs7Ozs7QUFLL0IsVUFBSSxVQUFVLEVBQUU7QUFDZCxhQUFLLElBQUksYUFBYSxJQUFJLFVBQVUsRUFBRTtBQUNwQyxjQUFJLGNBQWMsR0FBRyxJQUFJLE1BQU0sQ0FBQyxHQUFHLEdBQUcsYUFBYSxDQUFDLENBQUM7QUFDckQsY0FBSSxjQUFjLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFO0FBQ2pDLG9CQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQztXQUN0QztTQUNGO09BQ0Y7O0FBRUQsYUFBTyxRQUFRLENBQUM7S0FDakI7Ozs7Ozs7Ozs7O1dBU29CLCtCQUFDLFFBQVEsRUFBRTtBQUM5QixVQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztBQUN0QyxVQUFJLFVBQVUsRUFBRTtBQUNkLGFBQUssSUFBSSxhQUFhLElBQUksVUFBVSxFQUFFO0FBQ3BDLGNBQUksY0FBYyxHQUFHLElBQUksTUFBTSxDQUFDLEdBQUcsR0FBRyxhQUFhLENBQUMsQ0FBQztBQUNyRCxjQUFJLGNBQWMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUU7QUFDakMsb0JBQVEsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxFQUFFLENBQUMsQ0FBQztXQUNqRDtTQUNGO09BQ0Y7OztBQUdELGNBQVEsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztBQUN2QyxhQUFPLFFBQVEsQ0FBQztLQUNqQjs7O1NBcEdrQixNQUFNOzs7cUJBQU4sTUFBTSIsImZpbGUiOiIvVXNlcnMvYWgvLmF0b20vcGFja2FnZXMvZ2l0LWJsYW1lL2xpYi91dGlsL2JsYW1lci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5jb25zdCBfID0gcmVxdWlyZSgndW5kZXJzY29yZScpO1xuY29uc3QgR2l0Q29tbWFuZGVyID0gcmVxdWlyZSgnLi9HaXRDb21tYW5kZXInKTtcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCbGFtZXIge1xuXG4gIGNvbnN0cnVjdG9yKHJlcG8pIHtcbiAgICBpZiAoIXJlcG8pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGNyZWF0ZSBhIEJsYW1lciB3aXRob3V0IGEgcmVwb3NpdG9yeS4nKTtcbiAgICB9XG4gICAgdGhpcy5yZXBvID0gcmVwbztcbiAgICB0aGlzLmluaXRpYWxpemUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplcyB0aGlzIEJsYW1lciBpbnN0YW5jZSwgYnkgY3JlYXRpbmcgZ2l0LXRvb2xzIHJlcG9zIGZvciB0aGUgcm9vdFxuICAgKiByZXBvc2l0b3J5IGFuZCBzdWJtb2R1bGVzLlxuICAgKi9cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICB0aGlzLnRvb2xzID0ge307XG4gICAgdGhpcy50b29scy5yb290ID0gbmV3IEdpdENvbW1hbmRlcih0aGlzLnJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpKTtcblxuICAgIHZhciBzdWJtb2R1bGVzID0gdGhpcy5yZXBvLnN1Ym1vZHVsZXM7XG4gICAgaWYgKHN1Ym1vZHVsZXMpIHtcbiAgICAgIGZvciAodmFyIHN1Ym1vZHVsZVBhdGggaW4gc3VibW9kdWxlcykge1xuICAgICAgICB0aGlzLnRvb2xzW3N1Ym1vZHVsZVBhdGhdID0gbmV3IEdpdENvbW1hbmRlcih0aGlzLnJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpICsgJy8nICsgc3VibW9kdWxlUGF0aCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEJsYW1lcyB0aGUgZ2l2ZW4gZmlsZVBhdGggYW5kIGNhbGxzIGNhbGxiYWNrIHdpdGggYmxhbWUgbGluZXMgb3IgZXJyb3IuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlUGF0aCAtIGZpbGVQYXRoIHRvIGJsYW1lXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIC0gY2FsbGJhY2sgdG8gY2FsbCBiYWNrIHdpdGggYmxhbWUgZGF0YVxuICAgKi9cbiAgYmxhbWUoZmlsZVBhdGgsIGNhbGxiYWNrKSB7XG4gICAgLy8gRW5zdXJlIGZpbGUgcGF0aCBpcyByZWxhdGl2ZSB0byByb290IHJlcG9cbiAgICBmaWxlUGF0aCA9IHRoaXMucmVwby5yZWxhdGl2aXplKGZpbGVQYXRoKTtcbiAgICB2YXIgcmVwb1V0aWwgPSB0aGlzLnJlcG9VdGlsRm9yUGF0aChmaWxlUGF0aCk7XG5cbiAgICAvLyBFbnN1cmUgdGhhdCBpZiB0aGlzIGZpbGUgaXMgaW4gYSBzdWJtb2R1bGUsIHdlIHJlbW92ZSB0aGUgc3VibW9kdWxlIGRpclxuICAgIC8vIGZyb20gdGhlIHBhdGhcbiAgICBmaWxlUGF0aCA9IHRoaXMucmVtb3ZlU3VibW9kdWxlUHJlZml4KGZpbGVQYXRoKTtcblxuICAgIGlmICghXy5pc0Z1bmN0aW9uKGNhbGxiYWNrKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdNdXN0IGJlIGNhbGxlZCB3aXRoIGEgY2FsbGJhY2sgZnVuY3Rpb24nKTtcbiAgICB9XG5cbiAgICAvLyBNYWtlIHRoZSBhc3luYyBibGFtZSBjYWxsIG9uIHRoZSBnaXQgcmVwb1xuICAgIHJlcG9VdGlsLmJsYW1lKGZpbGVQYXRoLCBmdW5jdGlvbihlcnIsIGJsYW1lKSB7XG4gICAgICBjYWxsYmFjayhlcnIsIGJsYW1lKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVdGlsaXR5IHRvIGdldCB0aGUgR2l0Q29tbWFuZGVyIHJlcG9zaXRvcnkgZm9yIHRoZSBnaXZlbiBmaWxlUGF0aC4gVGFrZXMgaW50b1xuICAgKiBhY2NvdW50IHdoZXRoZXIgdGhlIGZpbGUgaXMgcGFydCBvZiBhIHN1Ym1vZHVsZSBhbmQgcmV0dXJucyB0aGF0IHJlcG9zaXRvcnlcbiAgICogaWYgbmVjZXNzYXJ5LlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZmlsZVBhdGggLSB0aGUgcGF0aCB0byB0aGUgZmlsZSBpbiBxdWVzdGlvbi5cbiAgICovXG4gIHJlcG9VdGlsRm9yUGF0aChmaWxlUGF0aCkge1xuICAgIHZhciBzdWJtb2R1bGVzID0gdGhpcy5yZXBvLnN1Ym1vZHVsZXM7XG5cbiAgICAvLyBCeSBkZWZhdWx0LCB3ZSByZXR1cm4gdGhlIHJvb3QgR2l0Q29tbWFuZGVyIHJlcG9zaXRvcnkuXG4gICAgdmFyIHJlcG9VdGlsID0gdGhpcy50b29scy5yb290O1xuXG4gICAgLy8gaWYgd2UgaGF2ZSBzdWJtb2R1bGVzLCBsb29wIHRocm91Z2ggdGhlbSBhbmQgc2VlIGlmIHRoZSBnaXZlbiBmaWxlIHBhdGhcbiAgICAvLyBiZWxvbmdzIGluc2lkZSBvbmUgb2YgdGhlIHJlcG9zaXRvcmllcy4gSWYgc28sIHdlIHJldHVybiB0aGUgR2l0Q29tbWFuZGVyIHJlcG9cbiAgICAvLyBmb3IgdGhhdCBzdWJtb2R1bGUuXG4gICAgaWYgKHN1Ym1vZHVsZXMpIHtcbiAgICAgIGZvciAodmFyIHN1Ym1vZHVsZVBhdGggaW4gc3VibW9kdWxlcykge1xuICAgICAgICB2YXIgc3VibW9kdWxlUmVnZXggPSBuZXcgUmVnRXhwKCdeJyArIHN1Ym1vZHVsZVBhdGgpO1xuICAgICAgICBpZiAoc3VibW9kdWxlUmVnZXgudGVzdChmaWxlUGF0aCkpIHtcbiAgICAgICAgICByZXBvVXRpbCA9IHRoaXMudG9vbHNbc3VibW9kdWxlUGF0aF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVwb1V0aWw7XG4gIH1cblxuICAvKipcbiAgICogSWYgdGhlIGZpbGUgcGF0aCBnaXZlbiBpcyBpbnNpZGUgYSBzdWJtb2R1bGUsIHJlbW92ZXMgdGhlIHN1Ym1vZHVsZVxuICAgKiBkaXJlY3RvcnkgcHJlZml4LlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZmlsZVBhdGggLSBwYXRoIHRvIGZpbGUgdG8gcmVsYXRpdml6ZVxuICAgKiBAcGFyYW0ge1JlcG99IHRvb2xzUmVwbyAtIGdpdC10b29scyBSZXBvXG4gICAqL1xuICByZW1vdmVTdWJtb2R1bGVQcmVmaXgoZmlsZVBhdGgpIHtcbiAgICB2YXIgc3VibW9kdWxlcyA9IHRoaXMucmVwby5zdWJtb2R1bGVzO1xuICAgIGlmIChzdWJtb2R1bGVzKSB7XG4gICAgICBmb3IgKHZhciBzdWJtb2R1bGVQYXRoIGluIHN1Ym1vZHVsZXMpIHtcbiAgICAgICAgdmFyIHN1Ym1vZHVsZVJlZ2V4ID0gbmV3IFJlZ0V4cCgnXicgKyBzdWJtb2R1bGVQYXRoKTtcbiAgICAgICAgaWYgKHN1Ym1vZHVsZVJlZ2V4LnRlc3QoZmlsZVBhdGgpKSB7XG4gICAgICAgICAgZmlsZVBhdGggPSBmaWxlUGF0aC5yZXBsYWNlKHN1Ym1vZHVsZVJlZ2V4LCAnJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyByZW1vdmUgbGVhZGluZyAnLycgaWYgdGhlcmUgaXMgb25lIGJlZm9yZSByZXR1cm5pbmdcbiAgICBmaWxlUGF0aCA9IGZpbGVQYXRoLnJlcGxhY2UoL15cXC8vLCAnJyk7XG4gICAgcmV0dXJuIGZpbGVQYXRoO1xuICB9XG5cbn1cbiJdfQ==