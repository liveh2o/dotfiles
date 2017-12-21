Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodash = require('lodash');

var _GitCommander = require('./GitCommander');

var _GitCommander2 = _interopRequireDefault(_GitCommander);

'use babel';

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
      var _this = this;

      this.tools = {};
      this.tools.root = new _GitCommander2['default'](this.repo.getWorkingDirectory());

      var submodules = this.repo.submodules;
      if (submodules) {
        (0, _lodash.each)(submodules, function (submodulePath) {
          _this.tools[submodulePath] = new _GitCommander2['default'](_this.repo.getWorkingDirectory() + '/' + submodulePath);
        });
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
      var cleanedFilePath = this.repo.relativize(filePath);
      var repoUtil = this.repoUtilForPath(cleanedFilePath);

      // Ensure that if this file is in a submodule, we remove the submodule dir
      // from the path
      cleanedFilePath = this.removeSubmodulePrefix(cleanedFilePath);

      if (!(0, _lodash.isFunction)(callback)) {
        throw new Error('Must be called with a callback function');
      }

      // Make the async blame call on the git repo
      repoUtil.blame(cleanedFilePath, function (err, blame) {
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
      var _this2 = this;

      var submodules = this.repo.submodules;

      // By default, we return the root GitCommander repository.
      var repoUtil = this.tools.root;

      // if we have submodules, loop through them and see if the given file path
      // belongs inside one of the repositories. If so, we return the GitCommander repo
      // for that submodule.
      if (submodules) {
        (0, _lodash.each)(submodules, function (submodulePath) {
          var submoduleRegex = new RegExp('^' + submodulePath);
          if (submoduleRegex.test(filePath)) {
            repoUtil = _this2.tools[submodulePath];
          }
        });
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
      var trimmedFilePath = filePath;
      var submodules = this.repo.submodules;
      if (submodules) {
        (0, _lodash.each)(submodules, function (submodulePath) {
          var submoduleRegex = new RegExp('^' + submodulePath);
          if (submoduleRegex.test(trimmedFilePath)) {
            trimmedFilePath = filePath.replace(submoduleRegex, '');
          }
        });
      }

      // remove leading '/' if there is one before returning
      return trimmedFilePath.replace(/^\//, '');
    }
  }]);

  return Blamer;
})();

exports['default'] = Blamer;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy90ZXN0Ly5kb3RmaWxlcy9hdG9tL3BhY2thZ2VzL2dpdC1ibGFtZS9saWIvdXRpbC9CbGFtZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztzQkFFaUMsUUFBUTs7NEJBQ2hCLGdCQUFnQjs7OztBQUh6QyxXQUFXLENBQUM7O0lBS1MsTUFBTTtBQUVkLFdBRlEsTUFBTSxDQUViLElBQUksRUFBRTswQkFGQyxNQUFNOztBQUd2QixRQUFJLENBQUMsSUFBSSxFQUFFO0FBQ1QsWUFBTSxJQUFJLEtBQUssQ0FBQyw4Q0FBOEMsQ0FBQyxDQUFDO0tBQ2pFO0FBQ0QsUUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7QUFDakIsUUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0dBQ25COzs7Ozs7O2VBUmtCLE1BQU07O1dBY2Ysc0JBQUc7OztBQUNYLFVBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO0FBQ2hCLFVBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLDhCQUFpQixJQUFJLENBQUMsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUMsQ0FBQzs7QUFFcEUsVUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7QUFDeEMsVUFBSSxVQUFVLEVBQUU7QUFDZCwwQkFBSyxVQUFVLEVBQUUsVUFBQyxhQUFhLEVBQUs7QUFDbEMsZ0JBQUssS0FBSyxDQUFDLGFBQWEsQ0FBQyxHQUFHLDhCQUFvQixNQUFLLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxTQUFJLGFBQWEsQ0FBRyxDQUFDO1NBQ3JHLENBQUMsQ0FBQztPQUNKO0tBQ0Y7Ozs7Ozs7Ozs7V0FRSSxlQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUU7O0FBRXhCLFVBQUksZUFBZSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3JELFVBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsZUFBZSxDQUFDLENBQUM7Ozs7QUFJdkQscUJBQWUsR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUMsZUFBZSxDQUFDLENBQUM7O0FBRTlELFVBQUksQ0FBQyx3QkFBVyxRQUFRLENBQUMsRUFBRTtBQUN6QixjQUFNLElBQUksS0FBSyxDQUFDLHlDQUF5QyxDQUFDLENBQUM7T0FDNUQ7OztBQUdELGNBQVEsQ0FBQyxLQUFLLENBQUMsZUFBZSxFQUFFLFVBQVUsR0FBRyxFQUFFLEtBQUssRUFBRTtBQUNwRCxnQkFBUSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztPQUN0QixDQUFDLENBQUM7S0FDSjs7Ozs7Ozs7Ozs7V0FTYyx5QkFBQyxRQUFRLEVBQUU7OztBQUN4QixVQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQzs7O0FBR3hDLFVBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDOzs7OztBQUsvQixVQUFJLFVBQVUsRUFBRTtBQUNkLDBCQUFLLFVBQVUsRUFBRSxVQUFDLGFBQWEsRUFBSztBQUNsQyxjQUFNLGNBQWMsR0FBRyxJQUFJLE1BQU0sT0FBSyxhQUFhLENBQUcsQ0FBQztBQUN2RCxjQUFJLGNBQWMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUU7QUFDakMsb0JBQVEsR0FBRyxPQUFLLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQztXQUN0QztTQUNGLENBQUMsQ0FBQztPQUNKOztBQUVELGFBQU8sUUFBUSxDQUFDO0tBQ2pCOzs7Ozs7Ozs7OztXQVNvQiwrQkFBQyxRQUFRLEVBQUU7QUFDOUIsVUFBSSxlQUFlLEdBQUcsUUFBUSxDQUFDO0FBQy9CLFVBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO0FBQ3hDLFVBQUksVUFBVSxFQUFFO0FBQ2QsMEJBQUssVUFBVSxFQUFFLFVBQUMsYUFBYSxFQUFLO0FBQ2xDLGNBQU0sY0FBYyxHQUFHLElBQUksTUFBTSxPQUFLLGFBQWEsQ0FBRyxDQUFDO0FBQ3ZELGNBQUksY0FBYyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsRUFBRTtBQUN4QywyQkFBZSxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1dBQ3hEO1NBQ0YsQ0FBQyxDQUFDO09BQ0o7OztBQUdELGFBQU8sZUFBZSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7S0FDM0M7OztTQXBHa0IsTUFBTTs7O3FCQUFOLE1BQU0iLCJmaWxlIjoiL1VzZXJzL3Rlc3QvLmRvdGZpbGVzL2F0b20vcGFja2FnZXMvZ2l0LWJsYW1lL2xpYi91dGlsL0JsYW1lci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgeyBpc0Z1bmN0aW9uLCBlYWNoIH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBHaXRDb21tYW5kZXIgZnJvbSAnLi9HaXRDb21tYW5kZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCbGFtZXIge1xuXG4gIGNvbnN0cnVjdG9yKHJlcG8pIHtcbiAgICBpZiAoIXJlcG8pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGNyZWF0ZSBhIEJsYW1lciB3aXRob3V0IGEgcmVwb3NpdG9yeS4nKTtcbiAgICB9XG4gICAgdGhpcy5yZXBvID0gcmVwbztcbiAgICB0aGlzLmluaXRpYWxpemUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplcyB0aGlzIEJsYW1lciBpbnN0YW5jZSwgYnkgY3JlYXRpbmcgZ2l0LXRvb2xzIHJlcG9zIGZvciB0aGUgcm9vdFxuICAgKiByZXBvc2l0b3J5IGFuZCBzdWJtb2R1bGVzLlxuICAgKi9cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICB0aGlzLnRvb2xzID0ge307XG4gICAgdGhpcy50b29scy5yb290ID0gbmV3IEdpdENvbW1hbmRlcih0aGlzLnJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpKTtcblxuICAgIGNvbnN0IHN1Ym1vZHVsZXMgPSB0aGlzLnJlcG8uc3VibW9kdWxlcztcbiAgICBpZiAoc3VibW9kdWxlcykge1xuICAgICAgZWFjaChzdWJtb2R1bGVzLCAoc3VibW9kdWxlUGF0aCkgPT4ge1xuICAgICAgICB0aGlzLnRvb2xzW3N1Ym1vZHVsZVBhdGhdID0gbmV3IEdpdENvbW1hbmRlcihgJHt0aGlzLnJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpfS8ke3N1Ym1vZHVsZVBhdGh9YCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQmxhbWVzIHRoZSBnaXZlbiBmaWxlUGF0aCBhbmQgY2FsbHMgY2FsbGJhY2sgd2l0aCBibGFtZSBsaW5lcyBvciBlcnJvci5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGZpbGVQYXRoIC0gZmlsZVBhdGggdG8gYmxhbWVcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgLSBjYWxsYmFjayB0byBjYWxsIGJhY2sgd2l0aCBibGFtZSBkYXRhXG4gICAqL1xuICBibGFtZShmaWxlUGF0aCwgY2FsbGJhY2spIHtcbiAgICAvLyBFbnN1cmUgZmlsZSBwYXRoIGlzIHJlbGF0aXZlIHRvIHJvb3QgcmVwb1xuICAgIGxldCBjbGVhbmVkRmlsZVBhdGggPSB0aGlzLnJlcG8ucmVsYXRpdml6ZShmaWxlUGF0aCk7XG4gICAgY29uc3QgcmVwb1V0aWwgPSB0aGlzLnJlcG9VdGlsRm9yUGF0aChjbGVhbmVkRmlsZVBhdGgpO1xuXG4gICAgLy8gRW5zdXJlIHRoYXQgaWYgdGhpcyBmaWxlIGlzIGluIGEgc3VibW9kdWxlLCB3ZSByZW1vdmUgdGhlIHN1Ym1vZHVsZSBkaXJcbiAgICAvLyBmcm9tIHRoZSBwYXRoXG4gICAgY2xlYW5lZEZpbGVQYXRoID0gdGhpcy5yZW1vdmVTdWJtb2R1bGVQcmVmaXgoY2xlYW5lZEZpbGVQYXRoKTtcblxuICAgIGlmICghaXNGdW5jdGlvbihjYWxsYmFjaykpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTXVzdCBiZSBjYWxsZWQgd2l0aCBhIGNhbGxiYWNrIGZ1bmN0aW9uJyk7XG4gICAgfVxuXG4gICAgLy8gTWFrZSB0aGUgYXN5bmMgYmxhbWUgY2FsbCBvbiB0aGUgZ2l0IHJlcG9cbiAgICByZXBvVXRpbC5ibGFtZShjbGVhbmVkRmlsZVBhdGgsIGZ1bmN0aW9uIChlcnIsIGJsYW1lKSB7XG4gICAgICBjYWxsYmFjayhlcnIsIGJsYW1lKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVdGlsaXR5IHRvIGdldCB0aGUgR2l0Q29tbWFuZGVyIHJlcG9zaXRvcnkgZm9yIHRoZSBnaXZlbiBmaWxlUGF0aC4gVGFrZXMgaW50b1xuICAgKiBhY2NvdW50IHdoZXRoZXIgdGhlIGZpbGUgaXMgcGFydCBvZiBhIHN1Ym1vZHVsZSBhbmQgcmV0dXJucyB0aGF0IHJlcG9zaXRvcnlcbiAgICogaWYgbmVjZXNzYXJ5LlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZmlsZVBhdGggLSB0aGUgcGF0aCB0byB0aGUgZmlsZSBpbiBxdWVzdGlvbi5cbiAgICovXG4gIHJlcG9VdGlsRm9yUGF0aChmaWxlUGF0aCkge1xuICAgIGNvbnN0IHN1Ym1vZHVsZXMgPSB0aGlzLnJlcG8uc3VibW9kdWxlcztcblxuICAgIC8vIEJ5IGRlZmF1bHQsIHdlIHJldHVybiB0aGUgcm9vdCBHaXRDb21tYW5kZXIgcmVwb3NpdG9yeS5cbiAgICBsZXQgcmVwb1V0aWwgPSB0aGlzLnRvb2xzLnJvb3Q7XG5cbiAgICAvLyBpZiB3ZSBoYXZlIHN1Ym1vZHVsZXMsIGxvb3AgdGhyb3VnaCB0aGVtIGFuZCBzZWUgaWYgdGhlIGdpdmVuIGZpbGUgcGF0aFxuICAgIC8vIGJlbG9uZ3MgaW5zaWRlIG9uZSBvZiB0aGUgcmVwb3NpdG9yaWVzLiBJZiBzbywgd2UgcmV0dXJuIHRoZSBHaXRDb21tYW5kZXIgcmVwb1xuICAgIC8vIGZvciB0aGF0IHN1Ym1vZHVsZS5cbiAgICBpZiAoc3VibW9kdWxlcykge1xuICAgICAgZWFjaChzdWJtb2R1bGVzLCAoc3VibW9kdWxlUGF0aCkgPT4ge1xuICAgICAgICBjb25zdCBzdWJtb2R1bGVSZWdleCA9IG5ldyBSZWdFeHAoYF4ke3N1Ym1vZHVsZVBhdGh9YCk7XG4gICAgICAgIGlmIChzdWJtb2R1bGVSZWdleC50ZXN0KGZpbGVQYXRoKSkge1xuICAgICAgICAgIHJlcG9VdGlsID0gdGhpcy50b29sc1tzdWJtb2R1bGVQYXRoXTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlcG9VdGlsO1xuICB9XG5cbiAgLyoqXG4gICAqIElmIHRoZSBmaWxlIHBhdGggZ2l2ZW4gaXMgaW5zaWRlIGEgc3VibW9kdWxlLCByZW1vdmVzIHRoZSBzdWJtb2R1bGVcbiAgICogZGlyZWN0b3J5IHByZWZpeC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGZpbGVQYXRoIC0gcGF0aCB0byBmaWxlIHRvIHJlbGF0aXZpemVcbiAgICogQHBhcmFtIHtSZXBvfSB0b29sc1JlcG8gLSBnaXQtdG9vbHMgUmVwb1xuICAgKi9cbiAgcmVtb3ZlU3VibW9kdWxlUHJlZml4KGZpbGVQYXRoKSB7XG4gICAgbGV0IHRyaW1tZWRGaWxlUGF0aCA9IGZpbGVQYXRoO1xuICAgIGNvbnN0IHN1Ym1vZHVsZXMgPSB0aGlzLnJlcG8uc3VibW9kdWxlcztcbiAgICBpZiAoc3VibW9kdWxlcykge1xuICAgICAgZWFjaChzdWJtb2R1bGVzLCAoc3VibW9kdWxlUGF0aCkgPT4ge1xuICAgICAgICBjb25zdCBzdWJtb2R1bGVSZWdleCA9IG5ldyBSZWdFeHAoYF4ke3N1Ym1vZHVsZVBhdGh9YCk7XG4gICAgICAgIGlmIChzdWJtb2R1bGVSZWdleC50ZXN0KHRyaW1tZWRGaWxlUGF0aCkpIHtcbiAgICAgICAgICB0cmltbWVkRmlsZVBhdGggPSBmaWxlUGF0aC5yZXBsYWNlKHN1Ym1vZHVsZVJlZ2V4LCAnJyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIHJlbW92ZSBsZWFkaW5nICcvJyBpZiB0aGVyZSBpcyBvbmUgYmVmb3JlIHJldHVybmluZ1xuICAgIHJldHVybiB0cmltbWVkRmlsZVBhdGgucmVwbGFjZSgvXlxcLy8sICcnKTtcbiAgfVxuXG59XG4iXX0=