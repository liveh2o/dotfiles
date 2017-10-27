(function() {
  var BufferedProcess, CompositeDisposable, Linter, Point, Range, XRegExp, deprecate, fs, log, path, warn, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  fs = require('fs');

  path = require('path');

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Range = _ref.Range, Point = _ref.Point, BufferedProcess = _ref.BufferedProcess;

  XRegExp = null;

  deprecate = require('grim').deprecate;

  log = function() {
    return void 0;
  };

  warn = function() {
    return void 0;
  };

  Linter = (function() {
    Linter.syntax = '';

    Linter.prototype.cmd = '';

    Linter.prototype.regex = '';

    Linter.prototype.regexFlags = '';

    Linter.prototype.cwd = null;

    Linter.prototype.defaultLevel = 'error';

    Linter.prototype.linterName = null;

    Linter.prototype.executablePath = null;

    Linter.prototype.isNodeExecutable = false;

    Linter.prototype.errorStream = 'stdout';

    Linter.prototype.baseOptions = ['executionTimeout'];

    Linter.prototype.options = [];

    function Linter(editor) {
      var option, _i, _j, _len, _len1, _ref1, _ref2;
      this.editor = editor;
      this.updateOption = __bind(this.updateOption, this);
      deprecate('AtomLinter v0.X.Y API has been deprecated. Please refer to the Linter docs to update and the latest API: https://github.com/AtomLinter/Linter/wiki/Migrating-to-the-new-API');
      this.cwd = path.dirname(this.editor.getPath());
      this.subscriptions = new CompositeDisposable;
      _ref1 = this.baseOptions;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        option = _ref1[_i];
        this.observeOption('linter', option);
      }
      _ref2 = this.options;
      for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
        option = _ref2[_j];
        this.observeOption("linter-" + this.linterName, option);
      }
      this._statCache = new Map();
    }

    Linter.prototype.observeOption = function(prefix, option) {
      var callback;
      callback = this.updateOption.bind(this, prefix, option);
      return this.subscriptions.add(atom.config.observe("" + prefix + "." + option, callback));
    };

    Linter.prototype.updateOption = function(prefix, option) {
      this[option] = atom.config.get("" + prefix + "." + option);
      return log("Updating `" + prefix + "` " + option + " to " + this[option]);
    };

    Linter.prototype.destroy = function() {
      return this.subscriptions.dispose();
    };

    Linter.prototype._cachedStatSync = function(path) {
      var stat;
      stat = this._statCache.get(path);
      if (!stat) {
        stat = fs.statSync(path);
        this._statCache.set(path, stat);
      }
      return stat;
    };

    Linter.prototype.getCmdAndArgs = function(filePath) {
      var cmd, cmd_list, stats;
      cmd = this.cmd;
      cmd_list = Array.isArray(cmd) ? cmd.slice() : cmd.split(' ');
      cmd_list.push(filePath);
      if (this.executablePath) {
        stats = this._cachedStatSync(this.executablePath);
        if (stats.isDirectory()) {
          cmd_list[0] = path.join(this.executablePath, cmd_list[0]);
        } else {
          cmd_list[0] = this.executablePath;
        }
      }
      if (this.isNodeExecutable) {
        cmd_list.unshift(this.getNodeExecutablePath());
      }
      cmd_list = cmd_list.map(function(cmd_item) {
        if (/@filename/i.test(cmd_item)) {
          return cmd_item.replace(/@filename/gi, filePath);
        }
        if (/@tempdir/i.test(cmd_item)) {
          return cmd_item.replace(/@tempdir/gi, path.dirname(filePath));
        } else {
          return cmd_item;
        }
      });
      log('command and arguments', cmd_list);
      return {
        command: cmd_list[0],
        args: cmd_list.slice(1)
      };
    };

    Linter.prototype.getReportFilePath = function(filePath) {
      return path.join(path.dirname(filePath), this.reportFilePath);
    };

    Linter.prototype.getNodeExecutablePath = function() {
      return path.join(atom.packages.getApmPath(), '..', 'node');
    };

    Linter.prototype.linterNotFound = function() {
      var notFoundMessage;
      notFoundMessage = "Linting has been halted. Please install the linter binary or disable the linter plugin depending on it. Make sure to reload Atom to detect changes";
      return atom.notifications.addError("The linter binary '" + this.linterName + "' cannot be found.", {
        detail: notFoundMessage,
        dismissable: true
      });
    };

    Linter.prototype.lintFile = function(filePath, callback) {
      var SpawnedProcess, args, command, dataStderr, dataStdout, exit, exited, options, stderr, stdout, _ref1, _ref2;
      _ref1 = this.getCmdAndArgs(filePath), command = _ref1.command, args = _ref1.args;
      log('is node executable: ' + this.isNodeExecutable);
      options = {
        cwd: this.cwd
      };
      dataStdout = [];
      dataStderr = [];
      exited = false;
      stdout = function(output) {
        log('stdout', output);
        return dataStdout.push(output);
      };
      stderr = function(output) {
        warn('stderr', output);
        return dataStderr.push(output);
      };
      exit = (function(_this) {
        return function(exitCode) {
          var data, reportFilePath;
          exited = true;
          if (exitCode === 8) {
            return _this.linterNotFound();
          }
          switch (_this.errorStream) {
            case 'file':
              reportFilePath = _this.getReportFilePath(filePath);
              if (fs.existsSync(reportFilePath)) {
                data = fs.readFileSync(reportFilePath);
              }
              break;
            case 'stdout':
              data = dataStdout.join('');
              break;
            default:
              data = dataStderr.join('');
          }
          return _this.processMessage(data, callback);
        };
      })(this);
      _ref2 = this.beforeSpawnProcess(command, args, options), command = _ref2.command, args = _ref2.args, options = _ref2.options;
      log("beforeSpawnProcess:", command, args, options);
      SpawnedProcess = new BufferedProcess({
        command: command,
        args: args,
        options: options,
        stdout: stdout,
        stderr: stderr,
        exit: exit
      });
      SpawnedProcess.onWillThrowError((function(_this) {
        return function(err) {
          if (err == null) {
            return;
          }
          if (err.error.code === 'ENOENT') {
            return _this.linterNotFound();
          }
        };
      })(this));
      if (this.executionTimeout > 0) {
        return setTimeout((function(_this) {
          return function() {
            if (exited) {
              return;
            }
            SpawnedProcess.kill();
            return warn("command `" + command + "` timed out after " + _this.executionTimeout + " ms");
          };
        })(this), this.executionTimeout);
      }
    };

    Linter.prototype.beforeSpawnProcess = function(command, args, options) {
      return {
        command: command,
        args: args,
        options: options
      };
    };

    Linter.prototype.processMessage = function(message, callback) {
      var messages;
      messages = [];
      if (XRegExp == null) {
        XRegExp = require('xregexp').XRegExp;
      }
      if (this.MessageRegexp == null) {
        this.MessageRegexp = XRegExp(this.regex, this.regexFlags);
      }
      XRegExp.forEach(message, this.MessageRegexp, (function(_this) {
        return function(match, i) {
          var msg;
          msg = _this.createMessage(match);
          if (msg.range != null) {
            return messages.push(msg);
          }
        };
      })(this), this);
      return callback(messages);
    };

    Linter.prototype.createMessage = function(match) {
      var level;
      if (match.error) {
        level = 'error';
      } else if (match.warning) {
        level = 'warning';
      } else if (match.info) {
        level = 'info';
      } else {
        level = match.level || this.defaultLevel;
      }
      if (match.line == null) {
        match.line = 0;
      }
      if (match.col == null) {
        match.col = 0;
      }
      return {
        line: match.line,
        col: match.col,
        level: level,
        message: this.formatMessage(match),
        linter: this.linterName,
        range: this.computeRange(match)
      };
    };

    Linter.prototype.formatMessage = function(match) {
      return match.message;
    };

    Linter.prototype.lineLengthForRow = function(row) {
      var text;
      text = this.editor.lineTextForBufferRow(row);
      return (text != null ? text.length : void 0) || 0;
    };

    Linter.prototype.getEditorScopesForPosition = function(position) {
      try {
        return this.editor.displayBuffer.tokenizedBuffer.scopesForPosition(position).slice();
      } catch (_error) {
        return [];
      }
    };

    Linter.prototype.getGetRangeForScopeAtPosition = function(innerMostScope, position) {
      return this.editor.displayBuffer.tokenizedBuffer.bufferRangeForScopeAtPosition(innerMostScope, position);
    };

    Linter.prototype.computeRange = function(match) {
      var colEnd, colStart, decrementParse, innerMostScope, position, range, rowEnd, rowStart, scopes, _ref1, _ref2, _ref3;
      decrementParse = function(x) {
        return Math.max(0, parseInt(x) - 1);
      };
      rowStart = decrementParse((_ref1 = match.lineStart) != null ? _ref1 : match.line);
      rowEnd = decrementParse((_ref2 = (_ref3 = match.lineEnd) != null ? _ref3 : match.line) != null ? _ref2 : rowStart);
      if (rowEnd >= this.editor.getLineCount()) {
        log("ignoring " + match + " - it's longer than the buffer");
        return null;
      }
      if (!match.colStart) {
        position = new Point(rowStart, match.col);
        scopes = this.getEditorScopesForPosition(position);
        while (innerMostScope = scopes.pop()) {
          range = this.getGetRangeForScopeAtPosition(innerMostScope, position);
          if (range != null) {
            return range;
          }
        }
      }
      if (match.colStart == null) {
        match.colStart = match.col;
      }
      colStart = decrementParse(match.colStart);
      colEnd = match.colEnd != null ? decrementParse(match.colEnd) : parseInt(this.lineLengthForRow(rowEnd));
      if (colStart === colEnd) {
        colStart = decrementParse(colStart);
      }
      return new Range([rowStart, colStart], [rowEnd, colEnd]);
    };

    return Linter;

  })();

  module.exports = Linter;

}).call(this);
