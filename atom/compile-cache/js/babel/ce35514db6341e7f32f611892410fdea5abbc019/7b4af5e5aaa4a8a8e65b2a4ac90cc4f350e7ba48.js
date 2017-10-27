Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _underscore = require('underscore');

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _blameFormatter = require('./blameFormatter');

/**
 * @module GitCommander
 *
 * Utility for executing git commands on a repo in a given working directory.
 */
'use babel';

var GitCommander = (function () {
  function GitCommander(path) {
    _classCallCheck(this, GitCommander);

    this.workingDirectory = path;
  }

  /**
   * Spawns a process to execute a git command in the GitCommander instances
   * working directory.
   *
   * @param {array|string} args - arguments to call `git` with on the command line
   * @param {function} callback - node callback for error and command output
   */

  _createClass(GitCommander, [{
    key: 'exec',
    value: function exec(args, callback) {
      if (!(0, _underscore.isArray)(args) || !(0, _underscore.isFunction)(callback)) {
        return;
      }

      var child = _child_process2['default'].spawn('git', args, { cwd: this.workingDirectory });
      var stdout = '';
      var stderr = '';
      var processError = undefined;

      child.stdout.on('data', function (data) {
        stdout += data;
      });

      child.stderr.on('data', function (data) {
        stderr += data;
      });

      child.on('error', function (error) {
        processError = error;
      });

      child.on('close', function (errorCode) {
        if (processError) {
          return callback(processError);
        }

        if (errorCode) {
          var error = new Error(stderr);
          error.code = errorCode;
          return callback(error);
        }

        return callback(null, stdout.trimRight());
      });
    }

    /**
     * Executes git blame on the input file in the instances working directory
     *
     * @param {string} fileName - name of file to blame, relative to the repos
     *   working directory
     * @param {function} callback - callback funtion to call with results or error
     */
  }, {
    key: 'blame',
    value: function blame(fileName, callback) {
      var args = ['blame', '--line-porcelain'];

      // ignore white space based on config
      if (atom.config.get('git-blame.ignoreWhiteSpaceDiffs')) {
        args.push('-w');
      }

      args.push(fileName);

      // Execute blame command and parse
      this.exec(args, function (err, blameStdOut) {
        if (err) {
          return callback(err, blameStdOut);
        }

        return callback(null, (0, _blameFormatter.parseBlame)(blameStdOut));
      });
    }
  }]);

  return GitCommander;
})();

exports['default'] = GitCommander;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9naXQtYmxhbWUvbGliL3V0aWwvR2l0Q29tbWFuZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7MEJBRW9DLFlBQVk7OzZCQUN0QixlQUFlOzs7OzhCQUVkLGtCQUFrQjs7Ozs7OztBQUw3QyxXQUFXLENBQUM7O0lBWVMsWUFBWTtBQUVwQixXQUZRLFlBQVksQ0FFbkIsSUFBSSxFQUFFOzBCQUZDLFlBQVk7O0FBRzdCLFFBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7R0FDOUI7Ozs7Ozs7Ozs7ZUFKa0IsWUFBWTs7V0FhM0IsY0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFO0FBQ25CLFVBQUksQ0FBQyx5QkFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLDRCQUFXLFFBQVEsQ0FBQyxFQUFFO0FBQzNDLGVBQU87T0FDUjs7QUFFRCxVQUFNLEtBQUssR0FBRywyQkFBYyxLQUFLLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsZ0JBQWdCLEVBQUMsQ0FBQyxDQUFDO0FBQzdFLFVBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUNoQixVQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDaEIsVUFBSSxZQUFZLFlBQUEsQ0FBQzs7QUFFakIsV0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLFVBQVMsSUFBSSxFQUFFO0FBQ3JDLGNBQU0sSUFBSSxJQUFJLENBQUM7T0FDaEIsQ0FBQyxDQUFDOztBQUVILFdBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxVQUFTLElBQUksRUFBRTtBQUNyQyxjQUFNLElBQUksSUFBSSxDQUFDO09BQ2hCLENBQUMsQ0FBQzs7QUFFSCxXQUFLLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxVQUFTLEtBQUssRUFBRTtBQUNoQyxvQkFBWSxHQUFHLEtBQUssQ0FBQztPQUN0QixDQUFDLENBQUM7O0FBRUgsV0FBSyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsVUFBUyxTQUFTLEVBQUU7QUFDcEMsWUFBSSxZQUFZLEVBQUU7QUFDaEIsaUJBQU8sUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDO1NBQy9COztBQUVELFlBQUksU0FBUyxFQUFFO0FBQ2IsY0FBTSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDaEMsZUFBSyxDQUFDLElBQUksR0FBRyxTQUFTLENBQUM7QUFDdkIsaUJBQU8sUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ3hCOztBQUVELGVBQU8sUUFBUSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQztPQUMzQyxDQUFDLENBQUM7S0FDSjs7Ozs7Ozs7Ozs7V0FTSSxlQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUU7QUFDeEIsVUFBTSxJQUFJLEdBQUcsQ0FBQyxPQUFPLEVBQUUsa0JBQWtCLENBQUMsQ0FBQzs7O0FBRzNDLFVBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsaUNBQWlDLENBQUMsRUFBRTtBQUN0RCxZQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO09BQ2pCOztBQUVELFVBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7OztBQUdwQixVQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxVQUFTLEdBQUcsRUFBRSxXQUFXLEVBQUU7QUFDekMsWUFBSSxHQUFHLEVBQUU7QUFDUCxpQkFBTyxRQUFRLENBQUMsR0FBRyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1NBQ25DOztBQUVELGVBQU8sUUFBUSxDQUFDLElBQUksRUFBRSxnQ0FBVyxXQUFXLENBQUMsQ0FBQyxDQUFDO09BQ2hELENBQUMsQ0FBQztLQUNKOzs7U0EzRWtCLFlBQVk7OztxQkFBWixZQUFZIiwiZmlsZSI6Ii9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9naXQtYmxhbWUvbGliL3V0aWwvR2l0Q29tbWFuZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCB7IGlzQXJyYXksIGlzRnVuY3Rpb24gfSBmcm9tICd1bmRlcnNjb3JlJztcbmltcG9ydCBjaGlsZF9wcm9jZXNzIGZyb20gJ2NoaWxkX3Byb2Nlc3MnO1xuXG5pbXBvcnQgeyBwYXJzZUJsYW1lIH0gZnJvbSAnLi9ibGFtZUZvcm1hdHRlcic7XG5cbi8qKlxuICogQG1vZHVsZSBHaXRDb21tYW5kZXJcbiAqXG4gKiBVdGlsaXR5IGZvciBleGVjdXRpbmcgZ2l0IGNvbW1hbmRzIG9uIGEgcmVwbyBpbiBhIGdpdmVuIHdvcmtpbmcgZGlyZWN0b3J5LlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHaXRDb21tYW5kZXIge1xuXG4gIGNvbnN0cnVjdG9yKHBhdGgpIHtcbiAgICB0aGlzLndvcmtpbmdEaXJlY3RvcnkgPSBwYXRoO1xuICB9XG5cbiAgLyoqXG4gICAqIFNwYXducyBhIHByb2Nlc3MgdG8gZXhlY3V0ZSBhIGdpdCBjb21tYW5kIGluIHRoZSBHaXRDb21tYW5kZXIgaW5zdGFuY2VzXG4gICAqIHdvcmtpbmcgZGlyZWN0b3J5LlxuICAgKlxuICAgKiBAcGFyYW0ge2FycmF5fHN0cmluZ30gYXJncyAtIGFyZ3VtZW50cyB0byBjYWxsIGBnaXRgIHdpdGggb24gdGhlIGNvbW1hbmQgbGluZVxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayAtIG5vZGUgY2FsbGJhY2sgZm9yIGVycm9yIGFuZCBjb21tYW5kIG91dHB1dFxuICAgKi9cbiAgZXhlYyhhcmdzLCBjYWxsYmFjaykge1xuICAgIGlmICghaXNBcnJheShhcmdzKSB8fCAhaXNGdW5jdGlvbihjYWxsYmFjaykpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBjaGlsZCA9IGNoaWxkX3Byb2Nlc3Muc3Bhd24oJ2dpdCcsIGFyZ3MsIHtjd2Q6IHRoaXMud29ya2luZ0RpcmVjdG9yeX0pO1xuICAgIGxldCBzdGRvdXQgPSAnJztcbiAgICBsZXQgc3RkZXJyID0gJyc7XG4gICAgbGV0IHByb2Nlc3NFcnJvcjtcblxuICAgIGNoaWxkLnN0ZG91dC5vbignZGF0YScsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHN0ZG91dCArPSBkYXRhO1xuICAgIH0pO1xuXG4gICAgY2hpbGQuc3RkZXJyLm9uKCdkYXRhJywgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgc3RkZXJyICs9IGRhdGE7XG4gICAgfSk7XG5cbiAgICBjaGlsZC5vbignZXJyb3InLCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgcHJvY2Vzc0Vycm9yID0gZXJyb3I7XG4gICAgfSk7XG5cbiAgICBjaGlsZC5vbignY2xvc2UnLCBmdW5jdGlvbihlcnJvckNvZGUpIHtcbiAgICAgIGlmIChwcm9jZXNzRXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrKHByb2Nlc3NFcnJvcik7XG4gICAgICB9XG5cbiAgICAgIGlmIChlcnJvckNvZGUpIHtcbiAgICAgICAgY29uc3QgZXJyb3IgPSBuZXcgRXJyb3Ioc3RkZXJyKTtcbiAgICAgICAgZXJyb3IuY29kZSA9IGVycm9yQ29kZTtcbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVycm9yKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGNhbGxiYWNrKG51bGwsIHN0ZG91dC50cmltUmlnaHQoKSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogRXhlY3V0ZXMgZ2l0IGJsYW1lIG9uIHRoZSBpbnB1dCBmaWxlIGluIHRoZSBpbnN0YW5jZXMgd29ya2luZyBkaXJlY3RvcnlcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGZpbGVOYW1lIC0gbmFtZSBvZiBmaWxlIHRvIGJsYW1lLCByZWxhdGl2ZSB0byB0aGUgcmVwb3NcbiAgICogICB3b3JraW5nIGRpcmVjdG9yeVxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayAtIGNhbGxiYWNrIGZ1bnRpb24gdG8gY2FsbCB3aXRoIHJlc3VsdHMgb3IgZXJyb3JcbiAgICovXG4gIGJsYW1lKGZpbGVOYW1lLCBjYWxsYmFjaykge1xuICAgIGNvbnN0IGFyZ3MgPSBbJ2JsYW1lJywgJy0tbGluZS1wb3JjZWxhaW4nXTtcblxuICAgIC8vIGlnbm9yZSB3aGl0ZSBzcGFjZSBiYXNlZCBvbiBjb25maWdcbiAgICBpZiAoYXRvbS5jb25maWcuZ2V0KCdnaXQtYmxhbWUuaWdub3JlV2hpdGVTcGFjZURpZmZzJykpIHtcbiAgICAgIGFyZ3MucHVzaCgnLXcnKTtcbiAgICB9XG5cbiAgICBhcmdzLnB1c2goZmlsZU5hbWUpO1xuXG4gICAgLy8gRXhlY3V0ZSBibGFtZSBjb21tYW5kIGFuZCBwYXJzZVxuICAgIHRoaXMuZXhlYyhhcmdzLCBmdW5jdGlvbihlcnIsIGJsYW1lU3RkT3V0KSB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIsIGJsYW1lU3RkT3V0KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGNhbGxiYWNrKG51bGwsIHBhcnNlQmxhbWUoYmxhbWVTdGRPdXQpKTtcbiAgICB9KTtcbiAgfVxuXG59XG4iXX0=