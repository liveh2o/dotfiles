(function() {
  var CompositeDisposable, Emitter, LinterView, fs, log, path, rimraf, temp, warn, _, _ref, _ref1,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ = require('lodash');

  fs = require('fs');

  temp = require('temp');

  path = require('path');

  rimraf = require('rimraf');

  _ref = require('event-kit'), CompositeDisposable = _ref.CompositeDisposable, Emitter = _ref.Emitter;

  _ref1 = require('./utils'), log = _ref1.log, warn = _ref1.warn;

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
          var throttleInterval;
          throttleInterval = parseInt(lintOnModifiedDelayMS);
          if (isNaN(throttleInterval)) {
            throttleInterval = 1000;
          }
          return _this.throttledLint = (_.throttle(_this.lint, throttleInterval)).bind(_this);
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
      return this.subscriptions.add(atom.config.observe('linter.showInfoMessages', (function(_this) {
        return function(showInfoMessages) {
          _this.showInfoMessages = showInfoMessages;
          return _this.display();
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
            return _this.throttledLint();
          }
        };
      })(this);
      this.subscriptions.add(this.editor.getBuffer().onDidReload(maybeLintOnSave));
      this.subscriptions.add(this.editor.onDidSave(maybeLintOnSave));
      this.subscriptions.add(this.editor.onDidStopChanging((function(_this) {
        return function() {
          if (_this.lintOnModified) {
            return _this.throttledLint();
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
              _this.throttledLint();
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
          return _this.moveToNextMessage();
        };
      })(this)));
      return this.subscriptions.add(atom.commands.add("atom-text-editor", "linter:previous-message", (function(_this) {
        return function() {
          return _this.moveToPreviousMessage();
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
          type: 'gutter',
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
      this.statusBarSummaryView.render(this.messages);
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

    LinterView.prototype.moveToNextMessage = function() {
      var cursorLine, firstLine, line, nextLine, _i, _len, _ref2, _ref3;
      cursorLine = this.editor.getCursorBufferPosition().row + 1;
      nextLine = null;
      firstLine = null;
      _ref3 = (_ref2 = this.messages) != null ? _ref2 : [];
      for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
        line = _ref3[_i].line;
        if (line > cursorLine) {
          if (nextLine == null) {
            nextLine = line - 1;
          }
          nextLine = Math.min(line - 1, nextLine);
        }
        if (firstLine == null) {
          firstLine = line - 1;
        }
        firstLine = Math.min(line - 1, firstLine);
      }
      if (nextLine == null) {
        nextLine = firstLine;
      }
      return this.moveToLine(nextLine);
    };

    LinterView.prototype.moveToPreviousMessage = function() {
      var cursorLine, lastLine, line, previousLine, _i, _len, _ref2, _ref3;
      cursorLine = this.editor.getCursorBufferPosition().row + 1;
      previousLine = -1;
      lastLine = -1;
      _ref3 = (_ref2 = this.messages) != null ? _ref2 : [];
      for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
        line = _ref3[_i].line;
        if (line < cursorLine) {
          previousLine = Math.max(line - 1, previousLine);
        }
        lastLine = Math.max(line - 1, lastLine);
      }
      if (previousLine === -1) {
        previousLine = lastLine;
      }
      return this.moveToLine(previousLine);
    };

    LinterView.prototype.moveToLine = function(n) {
      if (n == null) {
        n = -1;
      }
      if (n >= 0) {
        this.editor.setCursorBufferPosition([n, 0]);
        return this.editor.moveToFirstCharacterOfLine();
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDJGQUFBO0lBQUE7eUpBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVIsQ0FBSixDQUFBOztBQUFBLEVBQ0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBREwsQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUZQLENBQUE7O0FBQUEsRUFHQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FIUCxDQUFBOztBQUFBLEVBSUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxRQUFSLENBSlQsQ0FBQTs7QUFBQSxFQUtBLE9BQWlDLE9BQUEsQ0FBUSxXQUFSLENBQWpDLEVBQUMsMkJBQUEsbUJBQUQsRUFBc0IsZUFBQSxPQUx0QixDQUFBOztBQUFBLEVBT0EsUUFBYyxPQUFBLENBQVEsU0FBUixDQUFkLEVBQUMsWUFBQSxHQUFELEVBQU0sYUFBQSxJQVBOLENBQUE7O0FBQUEsRUFVQSxJQUFJLENBQUMsS0FBTCxDQUFBLENBVkEsQ0FBQTs7QUFBQSxFQWFNO0FBRUoseUJBQUEsT0FBQSxHQUFTLEVBQVQsQ0FBQTs7QUFBQSx5QkFDQSxjQUFBLEdBQWdCLENBRGhCLENBQUE7O0FBQUEseUJBRUEsUUFBQSxHQUFVLEVBRlYsQ0FBQTs7QUFBQSx5QkFHQSxRQUFBLEdBQVUsRUFIVixDQUFBOztBQVVhLElBQUEsb0JBQUUsTUFBRixFQUFXLGFBQVgsRUFBMkIsb0JBQTNCLEVBQWtELFVBQWxELEVBQStELFVBQS9ELEdBQUE7QUFDWCxNQURZLElBQUMsQ0FBQSxTQUFBLE1BQ2IsQ0FBQTtBQUFBLE1BRHFCLElBQUMsQ0FBQSxnQkFBQSxhQUN0QixDQUFBO0FBQUEsTUFEcUMsSUFBQyxDQUFBLHVCQUFBLG9CQUN0QyxDQUFBO0FBQUEsTUFENEQsSUFB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
//# sourceURL=/Users/ah/.atom/packages/linter/lib/linter-view.coffee