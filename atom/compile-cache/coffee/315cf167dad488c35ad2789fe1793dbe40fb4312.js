(function() {
  var CompositeDisposable, Emitter, LinterView, fs, log, moveToNextMessage, moveToPreviousMessage, path, rimraf, temp, warn, _, _ref, _ref1,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ = require('lodash');

  fs = require('fs');

  temp = require('temp');

  path = require('path');

  rimraf = require('rimraf');

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, Emitter = _ref.Emitter;

  _ref1 = require('./utils'), log = _ref1.log, warn = _ref1.warn, moveToPreviousMessage = _ref1.moveToPreviousMessage, moveToNextMessage = _ref1.moveToNextMessage;

  temp.track();

  LinterView = (function() {
    LinterView.prototype.linters = [];

    LinterView.prototype.totalProcessed = 0;

    LinterView.prototype.tempFile = '';

    LinterView.prototype.messages = [];

    function LinterView(editor, statusBarView, statusBarSummaryView, inlineView, allLinters) {
      this.editor = editor;
      this.statusBarView = statusBarView;
      this.statusBarSummaryView = statusBarSummaryView;
      this.inlineView = inlineView;
      this.allLinters = allLinters != null ? allLinters : [];
      this.processMessage = __bind(this.processMessage, this);
      this.handleEditorEvents = __bind(this.handleEditorEvents, this);
      this.emitter = new Emitter;
      this.subscriptions = new CompositeDisposable;
      if (this.editor == null) {
        warn("No editor instance on this editor");
      }
      this.markers = null;
      this.initLinters();
      this.handleEditorEvents();
      this.handleConfigChanges();
      this.subscriptions.add(this.editor.onDidChangeCursorPosition((function(_this) {
        return function() {
          return _this.updateViews();
        };
      })(this)));
    }

    LinterView.prototype.initLinters = function() {
      var grammarName, linter, _i, _len, _ref2, _results;
      this.linters = [];
      grammarName = this.editor.getGrammar().scopeName;
      _ref2 = this.allLinters;
      _results = [];
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        linter = _ref2[_i];
        if (_.isArray(linter.syntax) && __indexOf.call(linter.syntax, grammarName) >= 0 || _.isString(linter.syntax) && grammarName === linter.syntax || linter.syntax instanceof RegExp && linter.syntax.test(grammarName)) {
          _results.push(this.linters.push(new linter(this.editor)));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    LinterView.prototype.handleConfigChanges = function() {
      this.subscriptions.add(atom.config.observe('linter.lintOnSave', (function(_this) {
        return function(lintOnSave) {
          return _this.lintOnSave = lintOnSave;
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('linter.lintOnChangeInterval', (function(_this) {
        return function(lintOnModifiedDelayMS) {
          var delay, intervalMethod;
          delay = parseInt(lintOnModifiedDelayMS);
          if (isNaN(delay)) {
            delay = 1000;
          }
          intervalMethod = atom.config.get('linter.lintOnChangeMethod');
          log("IntervalMethod: " + intervalMethod);
          if (intervalMethod === 'debounce') {
            return _this.boundedLint = (_.debounce(_this.lint, delay)).bind(_this);
          } else {
            return _this.boundedLint = (_.throttle(_this.lint, delay)).bind(_this);
          }
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('linter.lintOnChange', (function(_this) {
        return function(lintOnModified) {
          return _this.lintOnModified = lintOnModified;
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('linter.lintOnEditorFocus', (function(_this) {
        return function(lintOnEditorFocus) {
          return _this.lintOnEditorFocus = lintOnEditorFocus;
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('linter.showGutters', (function(_this) {
        return function(showGutters) {
          _this.showGutters = showGutters;
          return _this.display();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('linter.statusBar', (function(_this) {
        return function(statusBar) {
          _this.showMessagesAroundCursor = statusBar !== 'None';
          return _this.updateViews();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('linter.showErrorInline', (function(_this) {
        return function(showErrorInline) {
          _this.showErrorInline = showErrorInline;
          return _this.updateViews();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('linter.showHighlighting', (function(_this) {
        return function(showHighlighting) {
          _this.showHighlighting = showHighlighting;
          return _this.display();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('linter.showInfoMessages', (function(_this) {
        return function(showInfoMessages) {
          _this.showInfoMessages = showInfoMessages;
          return _this.display();
        };
      })(this)));
      return this.subscriptions.add(atom.config.observe('linter.clearOnChange', (function(_this) {
        return function(clearOnChange) {
          return _this.clearOnChange = clearOnChange;
        };
      })(this)));
    };

    LinterView.prototype.handleEditorEvents = function() {
      var maybeLintOnSave;
      this.editor.onDidChangeGrammar((function(_this) {
        return function() {
          _this.initLinters();
          return _this.lint();
        };
      })(this));
      maybeLintOnSave = (function(_this) {
        return function() {
          if (_this.lintOnSave) {
            return _this.boundedLint();
          }
        };
      })(this);
      this.subscriptions.add(this.editor.getBuffer().onDidReload(maybeLintOnSave));
      this.subscriptions.add(this.editor.onDidSave(maybeLintOnSave));
      this.subscriptions.add(this.editor.onDidStopChanging((function(_this) {
        return function() {
          if (_this.lintOnModified) {
            return _this.boundedLint();
          } else if (_this.clearOnChange && _this.messages.length > 0) {
            _this.messages = [];
            _this.updateViews();
            return _this.destroyMarkers();
          }
        };
      })(this)));
      this.subscriptions.add(this.editor.onDidDestroy((function(_this) {
        return function() {
          return _this.remove();
        };
      })(this)));
      this.subscriptions.add(atom.workspace.observeActivePaneItem((function(_this) {
        return function() {
          var _ref2;
          if (_this.editor.id === ((_ref2 = atom.workspace.getActiveTextEditor()) != null ? _ref2.id : void 0)) {
            if (_this.lintOnEditorFocus) {
              _this.boundedLint();
            }
            return _this.updateViews();
          } else {
            _this.statusBarView.hide();
            _this.statusBarSummaryView.remove();
            return _this.inlineView.remove();
          }
        };
      })(this)));
      this.subscriptions.add(atom.commands.add("atom-text-editor", "linter:lint", (function(_this) {
        return function() {
          return _this.lint();
        };
      })(this)));
      this.subscriptions.add(atom.commands.add("atom-text-editor", "linter:next-message", (function(_this) {
        return function() {
          return moveToNextMessage(_this.messages, _this.editor);
        };
      })(this)));
      return this.subscriptions.add(atom.commands.add("atom-text-editor", "linter:previous-message", (function(_this) {
        return function() {
          return moveToPreviousMessage(_this.messages, _this.editor);
        };
      })(this)));
    };

    LinterView.prototype.lint = function() {
      if (this.linters.length === 0) {
        return;
      }
      this.totalProcessed = 0;
      this.messages = [];
      this.destroyMarkers();
      return temp.mkdir({
        prefix: 'AtomLinter',
        suffix: this.editor.getGrammar().scopeName
      }, (function(_this) {
        return function(err, tmpDir) {
          var fileName, tempFileInfo;
          if (err != null) {
            throw err;
          }
          fileName = path.basename(_this.editor.getPath());
          tempFileInfo = {
            completedLinters: 0,
            path: path.join(tmpDir, fileName)
          };
          return fs.writeFile(tempFileInfo.path, _this.editor.getText(), function(err) {
            if (err != null) {
              throw err;
            }
            _this.linters.forEach(function(linter) {
              return linter.lintFile(tempFileInfo.path, function(messages) {
                return _this.processMessage(messages, tempFileInfo, linter);
              });
            });
          });
        };
      })(this));
    };

    LinterView.prototype.processMessage = function(messages, tempFileInfo, linter) {
      log("" + linter.linterName + " returned", linter, messages);
      this.messages = this.messages.concat(messages);
      tempFileInfo.completedLinters++;
      if (tempFileInfo.completedLinters === this.linters.length) {
        this.display(this.messages);
        return rimraf(tempFileInfo.path, function(err) {
          if (err != null) {
            throw err;
          }
        });
      }
    };

    LinterView.prototype.destroyMarkers = function() {
      var m, _i, _len, _ref2;
      if (this.markers == null) {
        return;
      }
      _ref2 = this.markers;
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        m = _ref2[_i];
        m.destroy();
      }
      return this.markers = null;
    };

    LinterView.prototype.createMarker = function(message) {
      var klass, marker;
      marker = this.editor.markBufferRange(message.range, {
        invalidate: 'never'
      });
      klass = 'linter-' + message.level;
      if (this.showGutters) {
        this.editor.decorateMarker(marker, {
          type: 'line-number',
          "class": klass
        });
      }
      if (this.showHighlighting) {
        this.editor.decorateMarker(marker, {
          type: 'highlight',
          "class": klass
        });
      }
      return marker;
    };

    LinterView.prototype.sortMessagesByLine = function(messages) {
      var lNum, levels, line, lines, message, msgLevel, _i, _len;
      lines = {};
      levels = ['warning', 'error'];
      if (this.showInfoMessages) {
        levels.unshift('info');
      }
      for (_i = 0, _len = messages.length; _i < _len; _i++) {
        message = messages[_i];
        lNum = message.line;
        line = lines[lNum] || {
          'level': -1
        };
        msgLevel = levels.indexOf(message.level);
        if (!(msgLevel > line.level)) {
          continue;
        }
        line.level = msgLevel;
        line.msg = message;
        lines[lNum] = line;
      }
      return lines;
    };

    LinterView.prototype.display = function(messages) {
      var lNum, line, marker, _ref2;
      if (messages == null) {
        messages = [];
      }
      this.destroyMarkers();
      if (!this.editor.isAlive()) {
        return;
      }
      if (!(this.showGutters || this.showHighlighting)) {
        this.updateViews();
        return;
      }
      if (this.markers == null) {
        this.markers = [];
      }
      _ref2 = this.sortMessagesByLine(messages);
      for (lNum in _ref2) {
        line = _ref2[lNum];
        marker = this.createMarker(line.msg);
        this.markers.push(marker);
      }
      return this.updateViews();
    };

    LinterView.prototype.updateViews = function() {
      this.statusBarSummaryView.render(this.messages, this.editor);
      if (this.showMessagesAroundCursor) {
        this.statusBarView.render(this.messages, this.editor);
      } else {
        this.statusBarView.render([], this.editor);
      }
      if (this.showErrorInline) {
        return this.inlineView.render(this.messages, this.editor);
      } else {
        return this.inlineView.render([], this.editor);
      }
    };

    LinterView.prototype.remove = function() {
      var l, _i, _len, _ref2;
      this.statusBarView.hide();
      this.statusBarSummaryView.remove();
      this.inlineView.remove();
      this.subscriptions.dispose();
      _ref2 = this.linters;
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        l = _ref2[_i];
        l.destroy();
      }
      return this.emitter.emit('did-destroy');
    };

    LinterView.prototype.onDidDestroy = function(callback) {
      return this.emitter.on('did-destroy', callback);
    };

    return LinterView;

  })();

  module.exports = LinterView;

}).call(this);
