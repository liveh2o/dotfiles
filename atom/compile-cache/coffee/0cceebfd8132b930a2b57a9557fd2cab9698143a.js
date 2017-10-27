(function() {
  var BufferedProcess, CompositeDisposable, Linter, MessagePanelView, Point, Range, XRegExp, fs, log, path, warn, _, _ref, _ref1,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  fs = require('fs');

  path = require('path');

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Range = _ref.Range, Point = _ref.Point, BufferedProcess = _ref.BufferedProcess;

  _ = null;

  XRegExp = null;

  MessagePanelView = require('atom-message-panel').MessagePanelView;

  _ref1 = require('./utils'), log = _ref1.log, warn = _ref1.warn;

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

    function Linter(editor) {
      this.editor = editor;
      this.beforeSpawnProcess = __bind(this.beforeSpawnProcess, this);
      this.cwd = path.dirname(this.editor.getPath());
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.config.observe('linter.executionTimeout', (function(_this) {
        return function(x) {
          return _this.executionTimeout = x;
        };
      })(this)));
      this._statCache = new Map();
    }

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

    Linter.prototype.lintFile = function(filePath, callback) {
      var args, command, dataStderr, dataStdout, exit, exited, options, process, stderr, stdout, _ref2, _ref3;
      _ref2 = this.getCmdAndArgs(filePath), command = _ref2.command, args = _ref2.args;
      log('is node executable: ' + this.isNodeExecutable);
      options = {
        cwd: this.cwd
      };
      dataStdout = [];
      dataStderr = [];
      exited = false;
      stdout = function(output) {
        log('stdout', output);
        return dataStdout += output;
      };
      stderr = function(output) {
        warn('stderr', output);
        return dataStderr += output;
      };
      exit = (function(_this) {
        return function() {
          var data, reportFilePath;
          exited = true;
          switch (_this.errorStream) {
            case 'file':
              reportFilePath = _this.getReportFilePath(filePath);
              if (fs.existsSync(reportFilePath)) {
                data = fs.readFileSync(reportFilePath);
              }
              break;
            case 'stdout':
              data = dataStdout;
              break;
            default:
              data = dataStderr;
          }
          return _this.processMessage(data, callback);
        };
      })(this);
      _ref3 = this.beforeSpawnProcess(command, args, options), command = _ref3.command, args = _ref3.args, options = _ref3.options;
      log("beforeSpawnProcess:", command, args, options);
      process = new BufferedProcess({
        command: command,
        args: args,
        options: options,
        stdout: stdout,
        stderr: stderr,
        exit: exit
      });
      process.onWillThrowError((function(_this) {
        return function(err) {
          var ignored, message, subtle, warningMessageTitle, _ref4, _ref5;
          if (err == null) {
            return;
          }
          if (err.error.code === 'ENOENT') {
            ignored = atom.config.get('linter.ignoredLinterErrors');
            subtle = atom.config.get('linter.subtleLinterErrors');
            warningMessageTitle = "The linter binary '" + _this.linterName + "' cannot be found.";
            if (_ref4 = _this.linterName, __indexOf.call(subtle, _ref4) >= 0) {
              message = new MessagePanelView({
                title: warningMessageTitle
              });
              message.attach();
              message.toggle();
            } else if (_ref5 = _this.linterName, __indexOf.call(ignored, _ref5) < 0) {
              atom.confirm({
                message: warningMessageTitle,
                detailedMessage: 'Is it on your path? Please follow the installation guide for your linter. Would you like further notifications to be fully or partially suppressed? You can change this later in the linter package settings.',
                buttons: {
                  Fully: function() {
                    ignored.push(_this.linterName);
                    return atom.config.set('linter.ignoredLinterErrors', ignored);
                  },
                  Partially: function() {
                    subtle.push(_this.linterName);
                    return atom.config.set('linter.subtleLinterErrors', subtle);
                  }
                }
              });
            } else {
              console.log(warningMessageTitle);
            }
            return err.handle();
          }
        };
      })(this));
      if (this.executionTimeout > 0) {
        return setTimeout((function(_this) {
          return function() {
            if (exited) {
              return;
            }
            process.kill();
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
      var messages, regex;
      messages = [];
      if (XRegExp == null) {
        XRegExp = require('xregexp').XRegExp;
      }
      regex = XRegExp(this.regex, this.regexFlags);
      XRegExp.forEach(message, regex, (function(_this) {
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
        level = this.defaultLevel;
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
      if (_ == null) {
        _ = require('lodash');
      }
      try {
        return _.clone(this.editor.displayBuffer.tokenizedBuffer.scopesForPosition(position));
      } catch (_error) {
        return [];
      }
    };

    Linter.prototype.getGetRangeForScopeAtPosition = function(innerMostScope, position) {
      return this.editor.displayBuffer.tokenizedBuffer.bufferRangeForScopeAtPosition(innerMostScope, position);
    };

    Linter.prototype.computeRange = function(match) {
      var colEnd, colStart, decrementParse, innerMostScope, position, range, rowEnd, rowStart, scopes, _ref2, _ref3, _ref4;
      decrementParse = function(x) {
        return Math.max(0, parseInt(x) - 1);
      };
      rowStart = decrementParse((_ref2 = match.lineStart) != null ? _ref2 : match.line);
      rowEnd = decrementParse((_ref3 = (_ref4 = match.lineEnd) != null ? _ref4 : match.line) != null ? _ref3 : rowStart);
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
