Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodash = require('lodash');

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
      if (!(0, _lodash.isArray)(args) || !(0, _lodash.isFunction)(callback)) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy90ZXN0Ly5kb3RmaWxlcy9hdG9tL3BhY2thZ2VzL2dpdC1ibGFtZS9saWIvdXRpbC9HaXRDb21tYW5kZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztzQkFFb0MsUUFBUTs7NkJBQ25CLGVBQWU7Ozs7OEJBRWIsa0JBQWtCOzs7Ozs7O0FBTDdDLFdBQVcsQ0FBQzs7SUFZUyxZQUFZO0FBRXBCLFdBRlEsWUFBWSxDQUVuQixJQUFJLEVBQUU7MEJBRkMsWUFBWTs7QUFHN0IsUUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQztHQUM5Qjs7Ozs7Ozs7OztlQUprQixZQUFZOztXQWEzQixjQUFDLElBQUksRUFBRSxRQUFRLEVBQUU7QUFDbkIsVUFBSSxDQUFDLHFCQUFRLElBQUksQ0FBQyxJQUFJLENBQUMsd0JBQVcsUUFBUSxDQUFDLEVBQUU7QUFDM0MsZUFBTztPQUNSOztBQUVELFVBQU0sS0FBSyxHQUFHLDJCQUFhLEtBQUssQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsRUFBQyxDQUFDLENBQUM7QUFDNUUsVUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO0FBQ2hCLFVBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUNoQixVQUFJLFlBQVksWUFBQSxDQUFDOztBQUVqQixXQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsVUFBVSxJQUFJLEVBQUU7QUFDdEMsY0FBTSxJQUFJLElBQUksQ0FBQztPQUNoQixDQUFDLENBQUM7O0FBRUgsV0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLFVBQVUsSUFBSSxFQUFFO0FBQ3RDLGNBQU0sSUFBSSxJQUFJLENBQUM7T0FDaEIsQ0FBQyxDQUFDOztBQUVILFdBQUssQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLFVBQVUsS0FBSyxFQUFFO0FBQ2pDLG9CQUFZLEdBQUcsS0FBSyxDQUFDO09BQ3RCLENBQUMsQ0FBQzs7QUFFSCxXQUFLLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxVQUFVLFNBQVMsRUFBRTtBQUNyQyxZQUFJLFlBQVksRUFBRTtBQUNoQixpQkFBTyxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUM7U0FDL0I7O0FBRUQsWUFBSSxTQUFTLEVBQUU7QUFDYixjQUFNLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNoQyxlQUFLLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQztBQUN2QixpQkFBTyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDeEI7O0FBRUQsZUFBTyxRQUFRLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDO09BQzNDLENBQUMsQ0FBQztLQUNKOzs7Ozs7Ozs7OztXQVNJLGVBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRTtBQUN4QixVQUFNLElBQUksR0FBRyxDQUFDLE9BQU8sRUFBRSxrQkFBa0IsQ0FBQyxDQUFDOzs7QUFHM0MsVUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxpQ0FBaUMsQ0FBQyxFQUFFO0FBQ3RELFlBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7T0FDakI7O0FBRUQsVUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQzs7O0FBR3BCLFVBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFVBQVUsR0FBRyxFQUFFLFdBQVcsRUFBRTtBQUMxQyxZQUFJLEdBQUcsRUFBRTtBQUNQLGlCQUFPLFFBQVEsQ0FBQyxHQUFHLEVBQUUsV0FBVyxDQUFDLENBQUM7U0FDbkM7O0FBRUQsZUFBTyxRQUFRLENBQUMsSUFBSSxFQUFFLGdDQUFXLFdBQVcsQ0FBQyxDQUFDLENBQUM7T0FDaEQsQ0FBQyxDQUFDO0tBQ0o7OztTQTNFa0IsWUFBWTs7O3FCQUFaLFlBQVkiLCJmaWxlIjoiL1VzZXJzL3Rlc3QvLmRvdGZpbGVzL2F0b20vcGFja2FnZXMvZ2l0LWJsYW1lL2xpYi91dGlsL0dpdENvbW1hbmRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgeyBpc0FycmF5LCBpc0Z1bmN0aW9uIH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBjaGlsZFByb2Nlc3MgZnJvbSAnY2hpbGRfcHJvY2Vzcyc7XG5cbmltcG9ydCB7IHBhcnNlQmxhbWUgfSBmcm9tICcuL2JsYW1lRm9ybWF0dGVyJztcblxuLyoqXG4gKiBAbW9kdWxlIEdpdENvbW1hbmRlclxuICpcbiAqIFV0aWxpdHkgZm9yIGV4ZWN1dGluZyBnaXQgY29tbWFuZHMgb24gYSByZXBvIGluIGEgZ2l2ZW4gd29ya2luZyBkaXJlY3RvcnkuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdpdENvbW1hbmRlciB7XG5cbiAgY29uc3RydWN0b3IocGF0aCkge1xuICAgIHRoaXMud29ya2luZ0RpcmVjdG9yeSA9IHBhdGg7XG4gIH1cblxuICAvKipcbiAgICogU3Bhd25zIGEgcHJvY2VzcyB0byBleGVjdXRlIGEgZ2l0IGNvbW1hbmQgaW4gdGhlIEdpdENvbW1hbmRlciBpbnN0YW5jZXNcbiAgICogd29ya2luZyBkaXJlY3RvcnkuXG4gICAqXG4gICAqIEBwYXJhbSB7YXJyYXl8c3RyaW5nfSBhcmdzIC0gYXJndW1lbnRzIHRvIGNhbGwgYGdpdGAgd2l0aCBvbiB0aGUgY29tbWFuZCBsaW5lXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIC0gbm9kZSBjYWxsYmFjayBmb3IgZXJyb3IgYW5kIGNvbW1hbmQgb3V0cHV0XG4gICAqL1xuICBleGVjKGFyZ3MsIGNhbGxiYWNrKSB7XG4gICAgaWYgKCFpc0FycmF5KGFyZ3MpIHx8ICFpc0Z1bmN0aW9uKGNhbGxiYWNrKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGNoaWxkID0gY2hpbGRQcm9jZXNzLnNwYXduKCdnaXQnLCBhcmdzLCB7Y3dkOiB0aGlzLndvcmtpbmdEaXJlY3Rvcnl9KTtcbiAgICBsZXQgc3Rkb3V0ID0gJyc7XG4gICAgbGV0IHN0ZGVyciA9ICcnO1xuICAgIGxldCBwcm9jZXNzRXJyb3I7XG5cbiAgICBjaGlsZC5zdGRvdXQub24oJ2RhdGEnLCBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgc3Rkb3V0ICs9IGRhdGE7XG4gICAgfSk7XG5cbiAgICBjaGlsZC5zdGRlcnIub24oJ2RhdGEnLCBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgc3RkZXJyICs9IGRhdGE7XG4gICAgfSk7XG5cbiAgICBjaGlsZC5vbignZXJyb3InLCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgIHByb2Nlc3NFcnJvciA9IGVycm9yO1xuICAgIH0pO1xuXG4gICAgY2hpbGQub24oJ2Nsb3NlJywgZnVuY3Rpb24gKGVycm9yQ29kZSkge1xuICAgICAgaWYgKHByb2Nlc3NFcnJvcikge1xuICAgICAgICByZXR1cm4gY2FsbGJhY2socHJvY2Vzc0Vycm9yKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGVycm9yQ29kZSkge1xuICAgICAgICBjb25zdCBlcnJvciA9IG5ldyBFcnJvcihzdGRlcnIpO1xuICAgICAgICBlcnJvci5jb2RlID0gZXJyb3JDb2RlO1xuICAgICAgICByZXR1cm4gY2FsbGJhY2soZXJyb3IpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gY2FsbGJhY2sobnVsbCwgc3Rkb3V0LnRyaW1SaWdodCgpKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFeGVjdXRlcyBnaXQgYmxhbWUgb24gdGhlIGlucHV0IGZpbGUgaW4gdGhlIGluc3RhbmNlcyB3b3JraW5nIGRpcmVjdG9yeVxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZmlsZU5hbWUgLSBuYW1lIG9mIGZpbGUgdG8gYmxhbWUsIHJlbGF0aXZlIHRvIHRoZSByZXBvc1xuICAgKiAgIHdvcmtpbmcgZGlyZWN0b3J5XG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIC0gY2FsbGJhY2sgZnVudGlvbiB0byBjYWxsIHdpdGggcmVzdWx0cyBvciBlcnJvclxuICAgKi9cbiAgYmxhbWUoZmlsZU5hbWUsIGNhbGxiYWNrKSB7XG4gICAgY29uc3QgYXJncyA9IFsnYmxhbWUnLCAnLS1saW5lLXBvcmNlbGFpbiddO1xuXG4gICAgLy8gaWdub3JlIHdoaXRlIHNwYWNlIGJhc2VkIG9uIGNvbmZpZ1xuICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoJ2dpdC1ibGFtZS5pZ25vcmVXaGl0ZVNwYWNlRGlmZnMnKSkge1xuICAgICAgYXJncy5wdXNoKCctdycpO1xuICAgIH1cblxuICAgIGFyZ3MucHVzaChmaWxlTmFtZSk7XG5cbiAgICAvLyBFeGVjdXRlIGJsYW1lIGNvbW1hbmQgYW5kIHBhcnNlXG4gICAgdGhpcy5leGVjKGFyZ3MsIGZ1bmN0aW9uIChlcnIsIGJsYW1lU3RkT3V0KSB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIsIGJsYW1lU3RkT3V0KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGNhbGxiYWNrKG51bGwsIHBhcnNlQmxhbWUoYmxhbWVTdGRPdXQpKTtcbiAgICB9KTtcbiAgfVxuXG59XG4iXX0=