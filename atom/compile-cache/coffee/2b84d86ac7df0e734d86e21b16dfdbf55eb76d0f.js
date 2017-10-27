(function() {
  var $, $$, CompositeDisposable, Disposable, Marker, Motions, Operators, Panes, Point, Prefixes, Range, Scroll, TextObjects, Utils, VimState, _, _ref, _ref1;

  _ = require('underscore-plus');

  $ = require('atom').$;

  _ref = require('event-kit'), Disposable = _ref.Disposable, CompositeDisposable = _ref.CompositeDisposable;

  Operators = require('./operators/index');

  Prefixes = require('./prefixes');

  Motions = require('./motions/index');

  TextObjects = require('./text-objects');

  Utils = require('./utils');

  Panes = require('./panes');

  Scroll = require('./scroll');

  _ref1 = require('atom'), $$ = _ref1.$$, Point = _ref1.Point, Range = _ref1.Range;

  Marker = require('atom');

  module.exports = VimState = (function() {
    VimState.prototype.editor = null;

    VimState.prototype.opStack = null;

    VimState.prototype.mode = null;

    VimState.prototype.submode = null;

    function VimState(editorView) {
      var params;
      this.editorView = editorView;
      this.subscriptions = new CompositeDisposable;
      this.editor = this.editorView.editor;
      this.opStack = [];
      this.history = [];
      this.marks = {};
      this.desiredCursorColumn = null;
      params = {};
      params.manager = this;
      params.id = 0;
      this.setupCommandMode();
      this.registerInsertTransactionResets();
      this.registerUndoIntercept();
      if (atom.config.get('vim-mode.startInInsertMode')) {
        this.activateInsertMode();
      } else {
        this.activateCommandMode();
      }
    }

    VimState.prototype.destroy = function() {
      this.subscriptions.dispose();
      this.deactivateInsertMode();
      this.editorView.setInputEnabled(true);
      this.editorView.removeClass("command-mode");
      return this.editorView.off('.vim-mode');
    };

    VimState.prototype.registerUndoIntercept = function() {
      var preempt;
      preempt = this.editorView.preempt('core:undo', (function(_this) {
        return function(e) {
          if (_this.mode !== 'insert') {
            return true;
          }
          _this.activateCommandMode();
          return true;
        };
      })(this));
      return this.subscriptions.add(new Disposable(function() {
        return preempt.off();
      }));
    };

    VimState.prototype.registerInsertTransactionResets = function() {
      var events;
      events = ['core:move-up', 'core:move-down', 'core:move-right', 'core:move-left'];
      return this.editorView.on(events.join(' '), (function(_this) {
        return function() {
          return _this.resetInputTransactions();
        };
      })(this));
    };

    VimState.prototype.setupCommandMode = function() {
      this.registerCommands({
        'activate-command-mode': (function(_this) {
          return function() {
            return _this.activateCommandMode();
          };
        })(this),
        'activate-linewise-visual-mode': (function(_this) {
          return function() {
            return _this.activateVisualMode('linewise');
          };
        })(this),
        'activate-characterwise-visual-mode': (function(_this) {
          return function() {
            return _this.activateVisualMode('characterwise');
          };
        })(this),
        'activate-blockwise-visual-mode': (function(_this) {
          return function() {
            return _this.activateVisualMode('blockwise');
          };
        })(this),
        'reset-command-mode': (function(_this) {
          return function() {
            return _this.resetCommandMode();
          };
        })(this),
        'repeat-prefix': (function(_this) {
          return function(e) {
            return _this.repeatPrefix(e);
          };
        })(this)
      });
      return this.registerOperationCommands({
        'activate-insert-mode': (function(_this) {
          return function() {
            return new Operators.Insert(_this.editor, _this);
          };
        })(this),
        'substitute': (function(_this) {
          return function() {
            return new Operators.Substitute(_this.editor, _this);
          };
        })(this),
        'substitute-line': (function(_this) {
          return function() {
            return new Operators.SubstituteLine(_this.editor, _this);
          };
        })(this),
        'insert-after': (function(_this) {
          return function() {
            return new Operators.InsertAfter(_this.editor, _this);
          };
        })(this),
        'insert-after-end-of-line': (function(_this) {
          return function() {
            return [new Motions.MoveToLastCharacterOfLine(_this.editor, _this), new Operators.InsertAfter(_this.editor, _this)];
          };
        })(this),
        'insert-at-beginning-of-line': (function(_this) {
          return function() {
            return [new Motions.MoveToFirstCharacterOfLine(_this.editor, _this), new Operators.Insert(_this.editor, _this)];
          };
        })(this),
        'insert-above-with-newline': (function(_this) {
          return function() {
            return new Operators.InsertAboveWithNewline(_this.editor, _this);
          };
        })(this),
        'insert-below-with-newline': (function(_this) {
          return function() {
            return new Operators.InsertBelowWithNewline(_this.editor, _this);
          };
        })(this),
        'delete': (function(_this) {
          return function() {
            return _this.linewiseAliasedOperator(Operators.Delete);
          };
        })(this),
        'change': (function(_this) {
          return function() {
            return _this.linewiseAliasedOperator(Operators.Change);
          };
        })(this),
        'change-to-last-character-of-line': (function(_this) {
          return function() {
            return [new Operators.Change(_this.editor, _this), new Motions.MoveToLastCharacterOfLine(_this.editor, _this)];
          };
        })(this),
        'delete-right': (function(_this) {
          return function() {
            return [new Operators.Delete(_this.editor, _this), new Motions.MoveRight(_this.editor, _this)];
          };
        })(this),
        'delete-left': (function(_this) {
          return function() {
            return [new Operators.Delete(_this.editor, _this), new Motions.MoveLeft(_this.editor, _this)];
          };
        })(this),
        'delete-to-last-character-of-line': (function(_this) {
          return function() {
            return [new Operators.Delete(_this.editor, _this), new Motions.MoveToLastCharacterOfLine(_this.editor, _this)];
          };
        })(this),
        'toggle-case': (function(_this) {
          return function() {
            return new Operators.ToggleCase(_this.editor, _this);
          };
        })(this),
        'yank': (function(_this) {
          return function() {
            return _this.linewiseAliasedOperator(Operators.Yank);
          };
        })(this),
        'yank-line': (function(_this) {
          return function() {
            return [new Operators.Yank(_this.editor, _this), new Motions.MoveToRelativeLine(_this.editor, _this)];
          };
        })(this),
        'put-before': (function(_this) {
          return function() {
            return new Operators.Put(_this.editor, _this, {
              location: 'before'
            });
          };
        })(this),
        'put-after': (function(_this) {
          return function() {
            return new Operators.Put(_this.editor, _this, {
              location: 'after'
            });
          };
        })(this),
        'join': (function(_this) {
          return function() {
            return new Operators.Join(_this.editor, _this);
          };
        })(this),
        'indent': (function(_this) {
          return function() {
            return _this.linewiseAliasedOperator(Operators.Indent);
          };
        })(this),
        'outdent': (function(_this) {
          return function() {
            return _this.linewiseAliasedOperator(Operators.Outdent);
          };
        })(this),
        'auto-indent': (function(_this) {
          return function() {
            return _this.linewiseAliasedOperator(Operators.Autoindent);
          };
        })(this),
        'move-left': (function(_this) {
          return function() {
            return new Motions.MoveLeft(_this.editor, _this);
          };
        })(this),
        'move-up': (function(_this) {
          return function() {
            return new Motions.MoveUp(_this.editor, _this);
          };
        })(this),
        'move-down': (function(_this) {
          return function() {
            return new Motions.MoveDown(_this.editor, _this);
          };
        })(this),
        'move-right': (function(_this) {
          return function() {
            return new Motions.MoveRight(_this.editor, _this);
          };
        })(this),
        'move-to-next-word': (function(_this) {
          return function() {
            return new Motions.MoveToNextWord(_this.editor, _this);
          };
        })(this),
        'move-to-next-whole-word': (function(_this) {
          return function() {
            return new Motions.MoveToNextWholeWord(_this.editor, _this);
          };
        })(this),
        'move-to-end-of-word': (function(_this) {
          return function() {
            return new Motions.MoveToEndOfWord(_this.editor, _this);
          };
        })(this),
        'move-to-end-of-whole-word': (function(_this) {
          return function() {
            return new Motions.MoveToEndOfWholeWord(_this.editor, _this);
          };
        })(this),
        'move-to-previous-word': (function(_this) {
          return function() {
            return new Motions.MoveToPreviousWord(_this.editor, _this);
          };
        })(this),
        'move-to-previous-whole-word': (function(_this) {
          return function() {
            return new Motions.MoveToPreviousWholeWord(_this.editor, _this);
          };
        })(this),
        'move-to-next-paragraph': (function(_this) {
          return function() {
            return new Motions.MoveToNextParagraph(_this.editor, _this);
          };
        })(this),
        'move-to-previous-paragraph': (function(_this) {
          return function() {
            return new Motions.MoveToPreviousParagraph(_this.editor, _this);
          };
        })(this),
        'move-to-first-character-of-line': (function(_this) {
          return function() {
            return new Motions.MoveToFirstCharacterOfLine(_this.editor, _this);
          };
        })(this),
        'move-to-last-character-of-line': (function(_this) {
          return function() {
            return new Motions.MoveToLastCharacterOfLine(_this.editor, _this);
          };
        })(this),
        'move-to-beginning-of-line': (function(_this) {
          return function(e) {
            return _this.moveOrRepeat(e);
          };
        })(this),
        'move-to-first-character-of-line-up': (function(_this) {
          return function() {
            return new Motions.MoveToFirstCharacterOfLineUp(_this.editor, _this);
          };
        })(this),
        'move-to-first-character-of-line-down': (function(_this) {
          return function() {
            return new Motions.MoveToFirstCharacterOfLineDown(_this.editor, _this);
          };
        })(this),
        'move-to-start-of-file': (function(_this) {
          return function() {
            return new Motions.MoveToStartOfFile(_this.editor, _this);
          };
        })(this),
        'move-to-line': (function(_this) {
          return function() {
            return new Motions.MoveToLine(_this.editor, _this);
          };
        })(this),
        'move-to-top-of-screen': (function(_this) {
          return function() {
            return new Motions.MoveToTopOfScreen(_this.editor, _this, _this.editorView);
          };
        })(this),
        'move-to-bottom-of-screen': (function(_this) {
          return function() {
            return new Motions.MoveToBottomOfScreen(_this.editor, _this, _this.editorView);
          };
        })(this),
        'move-to-middle-of-screen': (function(_this) {
          return function() {
            return new Motions.MoveToMiddleOfScreen(_this.editor, _this, _this.editorView);
          };
        })(this),
        'scroll-down': (function(_this) {
          return function() {
            return new Scroll.ScrollDown(_this.editorView, _this.editor);
          };
        })(this),
        'scroll-up': (function(_this) {
          return function() {
            return new Scroll.ScrollUp(_this.editorView, _this.editor);
          };
        })(this),
        'scroll-cursor-to-top': (function(_this) {
          return function() {
            return new Scroll.ScrollCursorToTop(_this.editorView, _this.editor);
          };
        })(this),
        'scroll-cursor-to-top-leave': (function(_this) {
          return function() {
            return new Scroll.ScrollCursorToTop(_this.editorView, _this.editor, {
              leaveCursor: true
            });
          };
        })(this),
        'scroll-cursor-to-middle': (function(_this) {
          return function() {
            return new Scroll.ScrollCursorToMiddle(_this.editorView, _this.editor);
          };
        })(this),
        'scroll-cursor-to-middle-leave': (function(_this) {
          return function() {
            return new Scroll.ScrollCursorToMiddle(_this.editorView, _this.editor, {
              leaveCursor: true
            });
          };
        })(this),
        'scroll-cursor-to-bottom': (function(_this) {
          return function() {
            return new Scroll.ScrollCursorToBottom(_this.editorView, _this.editor);
          };
        })(this),
        'scroll-cursor-to-bottom-leave': (function(_this) {
          return function() {
            return new Scroll.ScrollCursorToBottom(_this.editorView, _this.editor, {
              leaveCursor: true
            });
          };
        })(this),
        'select-inside-word': (function(_this) {
          return function() {
            return new TextObjects.SelectInsideWord(_this.editor);
          };
        })(this),
        'select-inside-double-quotes': (function(_this) {
          return function() {
            return new TextObjects.SelectInsideQuotes(_this.editor, '"', false);
          };
        })(this),
        'select-inside-single-quotes': (function(_this) {
          return function() {
            return new TextObjects.SelectInsideQuotes(_this.editor, '\'', false);
          };
        })(this),
        'select-inside-back-ticks': (function(_this) {
          return function() {
            return new TextObjects.SelectInsideQuotes(_this.editor, '`', false);
          };
        })(this),
        'select-inside-curly-brackets': (function(_this) {
          return function() {
            return new TextObjects.SelectInsideBrackets(_this.editor, '{', '}', false);
          };
        })(this),
        'select-inside-angle-brackets': (function(_this) {
          return function() {
            return new TextObjects.SelectInsideBrackets(_this.editor, '<', '>', false);
          };
        })(this),
        'select-inside-square-brackets': (function(_this) {
          return function() {
            return new TextObjects.SelectInsideBrackets(_this.editor, '[', ']', false);
          };
        })(this),
        'select-inside-parentheses': (function(_this) {
          return function() {
            return new TextObjects.SelectInsideBrackets(_this.editor, '(', ')', false);
          };
        })(this),
        'select-a-word': (function(_this) {
          return function() {
            return new TextObjects.SelectAWord(_this.editor);
          };
        })(this),
        'select-around-double-quotes': (function(_this) {
          return function() {
            return new TextObjects.SelectInsideQuotes(_this.editor, '"', true);
          };
        })(this),
        'select-around-single-quotes': (function(_this) {
          return function() {
            return new TextObjects.SelectInsideQuotes(_this.editor, '\'', true);
          };
        })(this),
        'select-around-back-ticks': (function(_this) {
          return function() {
            return new TextObjects.SelectInsideQuotes(_this.editor, '`', true);
          };
        })(this),
        'select-around-curly-brackets': (function(_this) {
          return function() {
            return new TextObjects.SelectInsideBrackets(_this.editor, '{', '}', true);
          };
        })(this),
        'select-around-angle-brackets': (function(_this) {
          return function() {
            return new TextObjects.SelectInsideBrackets(_this.editor, '<', '>', true);
          };
        })(this),
        'select-around-square-brackets': (function(_this) {
          return function() {
            return new TextObjects.SelectInsideBrackets(_this.editor, '[', ']', true);
          };
        })(this),
        'select-around-parentheses': (function(_this) {
          return function() {
            return new TextObjects.SelectInsideBrackets(_this.editor, '(', ')', true);
          };
        })(this),
        'register-prefix': (function(_this) {
          return function(e) {
            return _this.registerPrefix(e);
          };
        })(this),
        'repeat': (function(_this) {
          return function(e) {
            return new Operators.Repeat(_this.editor, _this);
          };
        })(this),
        'repeat-search': (function(_this) {
          return function(e) {
            var currentSearch;
            if ((currentSearch = Motions.Search.currentSearch) != null) {
              return currentSearch.repeat();
            }
          };
        })(this),
        'repeat-search-backwards': (function(_this) {
          return function(e) {
            var currentSearch;
            if ((currentSearch = Motions.Search.currentSearch) != null) {
              return currentSearch.repeat({
                backwards: true
              });
            }
          };
        })(this),
        'focus-pane-view-on-left': (function(_this) {
          return function() {
            return new Panes.FocusPaneViewOnLeft();
          };
        })(this),
        'focus-pane-view-on-right': (function(_this) {
          return function() {
            return new Panes.FocusPaneViewOnRight();
          };
        })(this),
        'focus-pane-view-above': (function(_this) {
          return function() {
            return new Panes.FocusPaneViewAbove();
          };
        })(this),
        'focus-pane-view-below': (function(_this) {
          return function() {
            return new Panes.FocusPaneViewBelow();
          };
        })(this),
        'focus-previous-pane-view': (function(_this) {
          return function() {
            return new Panes.FocusPreviousPaneView();
          };
        })(this),
        'move-to-mark': (function(_this) {
          return function(e) {
            return new Motions.MoveToMark(_this.editorView, _this);
          };
        })(this),
        'move-to-mark-literal': (function(_this) {
          return function(e) {
            return new Motions.MoveToMark(_this.editorView, _this, false);
          };
        })(this),
        'mark': (function(_this) {
          return function(e) {
            return new Operators.Mark(_this.editorView, _this);
          };
        })(this),
        'find': (function(_this) {
          return function(e) {
            return new Motions.Find(_this.editorView, _this);
          };
        })(this),
        'find-backwards': (function(_this) {
          return function(e) {
            return new Motions.Find(_this.editorView, _this).reverse();
          };
        })(this),
        'till': (function(_this) {
          return function(e) {
            return new Motions.Till(_this.editorView, _this);
          };
        })(this),
        'till-backwards': (function(_this) {
          return function(e) {
            return new Motions.Till(_this.editorView, _this).reverse();
          };
        })(this),
        'repeat-find': (function(_this) {
          return function(e) {
            if (_this.currentFind != null) {
              return _this.currentFind.repeat();
            }
          };
        })(this),
        'repeat-find-reverse': (function(_this) {
          return function(e) {
            if (_this.currentFind != null) {
              return _this.currentFind.repeat({
                reverse: true
              });
            }
          };
        })(this),
        'replace': (function(_this) {
          return function(e) {
            return new Operators.Replace(_this.editorView, _this);
          };
        })(this),
        'search': (function(_this) {
          return function(e) {
            return new Motions.Search(_this.editorView, _this);
          };
        })(this),
        'reverse-search': (function(_this) {
          return function(e) {
            return (new Motions.Search(_this.editorView, _this)).reversed();
          };
        })(this),
        'search-current-word': (function(_this) {
          return function(e) {
            return new Motions.SearchCurrentWord(_this.editorView, _this);
          };
        })(this),
        'bracket-matching-motion': (function(_this) {
          return function(e) {
            return new Motions.BracketMatchingMotion(_this.editorView, _this);
          };
        })(this),
        'reverse-search-current-word': (function(_this) {
          return function(e) {
            return (new Motions.SearchCurrentWord(_this.editorView, _this)).reversed();
          };
        })(this)
      });
    };

    VimState.prototype.registerCommands = function(commands) {
      var commandName, fn, _results;
      _results = [];
      for (commandName in commands) {
        fn = commands[commandName];
        _results.push((function(_this) {
          return function(fn) {
            return _this.editorView.command("vim-mode:" + commandName + ".vim-mode", fn);
          };
        })(this)(fn));
      }
      return _results;
    };

    VimState.prototype.registerOperationCommands = function(operationCommands) {
      var commandName, commands, operationFn, _fn;
      commands = {};
      _fn = (function(_this) {
        return function(operationFn) {
          return commands[commandName] = function(event) {
            return _this.pushOperations(operationFn(event));
          };
        };
      })(this);
      for (commandName in operationCommands) {
        operationFn = operationCommands[commandName];
        _fn(operationFn);
      }
      return this.registerCommands(commands);
    };

    VimState.prototype.pushOperations = function(operations) {
      var operation, topOp, _i, _len, _results;
      if (operations == null) {
        return;
      }
      if (!_.isArray(operations)) {
        operations = [operations];
      }
      _results = [];
      for (_i = 0, _len = operations.length; _i < _len; _i++) {
        operation = operations[_i];
        if (this.mode === 'visual' && (operation instanceof Motions.Motion || operation instanceof TextObjects.TextObject)) {
          operation.execute = operation.select;
        }
        if (((topOp = this.topOperation()) != null) && (topOp.canComposeWith != null) && !topOp.canComposeWith(operation)) {
          this.editorView.trigger('vim-mode:compose-failure');
          this.resetCommandMode();
          break;
        }
        this.opStack.push(operation);
        if (this.mode === 'visual' && operation instanceof Operators.Operator) {
          this.opStack.push(new Motions.CurrentSelection(this.editor, this));
        }
        _results.push(this.processOpStack());
      }
      return _results;
    };

    VimState.prototype.clearOpStack = function() {
      return this.opStack = [];
    };

    VimState.prototype.processOpStack = function() {
      var e, poppedOperation;
      if (!(this.opStack.length > 0)) {
        return;
      }
      if (!this.topOperation().isComplete()) {
        if (this.mode === 'command' && this.topOperation() instanceof Operators.Operator) {
          this.activateOperatorPendingMode();
        }
        return;
      }
      poppedOperation = this.opStack.pop();
      if (this.opStack.length) {
        try {
          this.topOperation().compose(poppedOperation);
          return this.processOpStack();
        } catch (_error) {
          e = _error;
          if ((e instanceof Operators.OperatorError) || (e instanceof Motions.MotionError)) {
            return this.resetCommandMode();
          } else {
            throw e;
          }
        }
      } else {
        if (poppedOperation.isRecordable()) {
          this.history.unshift(poppedOperation);
        }
        return poppedOperation.execute();
      }
    };

    VimState.prototype.topOperation = function() {
      return _.last(this.opStack);
    };

    VimState.prototype.getRegister = function(name) {
      var text, type;
      if (name === '*' || name === '+') {
        text = atom.clipboard.read();
        type = Utils.copyType(text);
        return {
          text: text,
          type: type
        };
      } else if (name === '%') {
        text = this.editor.getUri();
        type = Utils.copyType(text);
        return {
          text: text,
          type: type
        };
      } else if (name === "_") {
        text = '';
        type = Utils.copyType(text);
        return {
          text: text,
          type: type
        };
      } else {
        return atom.workspace.vimState.registers[name];
      }
    };

    VimState.prototype.getMark = function(name) {
      if (this.marks[name]) {
        return this.marks[name].getBufferRange().start;
      } else {
        return void 0;
      }
    };

    VimState.prototype.setRegister = function(name, value) {
      if (name === '*' || name === '+') {
        return atom.clipboard.write(value.text);
      } else if (name === '_') {

      } else {
        return atom.workspace.vimState.registers[name] = value;
      }
    };

    VimState.prototype.setMark = function(name, pos) {
      var charCode, marker;
      if ((charCode = name.charCodeAt(0)) >= 96 && charCode <= 122) {
        marker = this.editor.markBufferRange(new Range(pos, pos), {
          invalidate: 'never',
          persistent: false
        });
        return this.marks[name] = marker;
      }
    };

    VimState.prototype.pushSearchHistory = function(search) {
      return atom.workspace.vimState.searchHistory.unshift(search);
    };

    VimState.prototype.getSearchHistoryItem = function(index) {
      return atom.workspace.vimState.searchHistory[index];
    };

    VimState.prototype.resetInputTransactions = function() {
      var _ref2;
      if (!(this.mode === 'insert' && ((_ref2 = this.history[0]) != null ? typeof _ref2.inputOperator === "function" ? _ref2.inputOperator() : void 0 : void 0))) {
        return;
      }
      this.deactivateInsertMode();
      return this.activateInsertMode();
    };

    VimState.prototype.activateCommandMode = function() {
      var cursor;
      this.deactivateInsertMode();
      this.mode = 'command';
      this.submode = null;
      if (this.editorView.is(".insert-mode")) {
        cursor = this.editor.getLastCursor();
        if (!cursor.isAtBeginningOfLine()) {
          cursor.moveLeft();
        }
      }
      this.changeModeClass('command-mode');
      this.clearOpStack();
      this.editor.clearSelections();
      return this.updateStatusBar();
    };

    VimState.prototype.activateInsertMode = function(transactionStarted) {
      var _base;
      if (transactionStarted == null) {
        transactionStarted = false;
      }
      this.mode = 'insert';
      if (typeof (_base = this.editorView).setInputEnabled === "function") {
        _base.setInputEnabled(true);
      }
      if (!transactionStarted) {
        this.editor.beginTransaction();
      }
      this.submode = null;
      this.changeModeClass('insert-mode');
      return this.updateStatusBar();
    };

    VimState.prototype.deactivateInsertMode = function() {
      var item, transaction, _base;
      if (typeof (_base = this.editorView).setInputEnabled === "function") {
        _base.setInputEnabled(false);
      }
      if (this.mode !== 'insert') {
        return;
      }
      this.editor.commitTransaction();
      transaction = _.last(this.editor.buffer.history.undoStack);
      item = this.inputOperator(this.history[0]);
      if ((item != null) && (transaction != null)) {
        return item.confirmTransaction(transaction);
      }
    };

    VimState.prototype.inputOperator = function(item) {
      var _ref2;
      if (item == null) {
        return item;
      }
      if (typeof item.inputOperator === "function" ? item.inputOperator() : void 0) {
        return item;
      }
      if ((_ref2 = item.composedObject) != null ? typeof _ref2.inputOperator === "function" ? _ref2.inputOperator() : void 0 : void 0) {
        return item.composedObject;
      }
    };

    VimState.prototype.activateVisualMode = function(type) {
      this.deactivateInsertMode();
      this.mode = 'visual';
      this.submode = type;
      this.changeModeClass('visual-mode');
      if (this.submode === 'linewise') {
        this.editor.selectLinesContainingCursors();
      }
      return this.updateStatusBar();
    };

    VimState.prototype.activateOperatorPendingMode = function() {
      this.deactivateInsertMode();
      this.mode = 'operator-pending';
      this.submodule = null;
      this.changeModeClass('operator-pending-mode');
      return this.updateStatusBar();
    };

    VimState.prototype.changeModeClass = function(targetMode) {
      var mode, _i, _len, _ref2, _results;
      _ref2 = ['command-mode', 'insert-mode', 'visual-mode', 'operator-pending-mode'];
      _results = [];
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        mode = _ref2[_i];
        if (mode === targetMode) {
          _results.push(this.editorView.addClass(mode));
        } else {
          _results.push(this.editorView.removeClass(mode));
        }
      }
      return _results;
    };

    VimState.prototype.resetCommandMode = function() {
      this.clearOpStack();
      return this.activateCommandMode();
    };

    VimState.prototype.registerPrefix = function(e) {
      var keyboardEvent, name, _ref2, _ref3;
      keyboardEvent = (_ref2 = (_ref3 = e.originalEvent) != null ? _ref3.originalEvent : void 0) != null ? _ref2 : e.originalEvent;
      name = atom.keymap.keystrokeForKeyboardEvent(keyboardEvent);
      return new Prefixes.Register(name);
    };

    VimState.prototype.repeatPrefix = function(e) {
      var keyboardEvent, num, _ref2, _ref3;
      keyboardEvent = (_ref2 = (_ref3 = e.originalEvent) != null ? _ref3.originalEvent : void 0) != null ? _ref2 : e.originalEvent;
      num = parseInt(atom.keymap.keystrokeForKeyboardEvent(keyboardEvent));
      if (this.topOperation() instanceof Prefixes.Repeat) {
        return this.topOperation().addDigit(num);
      } else {
        if (num === 0) {
          return e.abortKeyBinding();
        } else {
          return this.pushOperations(new Prefixes.Repeat(num));
        }
      }
    };

    VimState.prototype.moveOrRepeat = function(e) {
      if (this.topOperation() instanceof Prefixes.Repeat) {
        this.repeatPrefix(e);
        return null;
      } else {
        return new Motions.MoveToBeginningOfLine(this.editor, this);
      }
    };

    VimState.prototype.linewiseAliasedOperator = function(constructor) {
      if (this.isOperatorPending(constructor)) {
        return new Motions.MoveToRelativeLine(this.editor, this);
      } else {
        return new constructor(this.editor, this);
      }
    };

    VimState.prototype.isOperatorPending = function(constructor) {
      var op, _i, _len, _ref2;
      if (constructor != null) {
        _ref2 = this.opStack;
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          op = _ref2[_i];
          if (op instanceof constructor) {
            return op;
          }
        }
        return false;
      } else {
        return this.opStack.length > 0;
      }
    };

    VimState.prototype.updateStatusBar = function() {
      atom.packages.onDidActivateAll((function(_this) {
        return function() {
          var _ref2;
          if (!$('#status-bar-vim-mode').length) {
            if ((_ref2 = atom.workspaceView.statusBar) != null) {
              _ref2.prependRight("<div id='status-bar-vim-mode' class='inline-block'>Command</div>");
            }
            return _this.updateStatusBar();
          }
        };
      })(this));
      this.removeStatusBarClass();
      switch (this.mode) {
        case 'insert':
          return $('#status-bar-vim-mode').addClass('status-bar-vim-mode-insert').html("Insert");
        case 'command':
          return $('#status-bar-vim-mode').addClass('status-bar-vim-mode-command').html("Command");
        case 'visual':
          return $('#status-bar-vim-mode').addClass('status-bar-vim-mode-visual').html("Visual");
      }
    };

    VimState.prototype.removeStatusBarClass = function() {
      return $('#status-bar-vim-mode').removeClass('status-bar-vim-mode-insert status-bar-vim-mode-command status-bar-vim-mode-visual');
    };

    return VimState;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHVKQUFBOztBQUFBLEVBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQUFKLENBQUE7O0FBQUEsRUFDQyxJQUFLLE9BQUEsQ0FBUSxNQUFSLEVBQUwsQ0FERCxDQUFBOztBQUFBLEVBRUEsT0FBb0MsT0FBQSxDQUFRLFdBQVIsQ0FBcEMsRUFBQyxrQkFBQSxVQUFELEVBQWEsMkJBQUEsbUJBRmIsQ0FBQTs7QUFBQSxFQUlBLFNBQUEsR0FBWSxPQUFBLENBQVEsbUJBQVIsQ0FKWixDQUFBOztBQUFBLEVBS0EsUUFBQSxHQUFXLE9BQUEsQ0FBUSxZQUFSLENBTFgsQ0FBQTs7QUFBQSxFQU1BLE9BQUEsR0FBVSxPQUFBLENBQVEsaUJBQVIsQ0FOVixDQUFBOztBQUFBLEVBUUEsV0FBQSxHQUFjLE9BQUEsQ0FBUSxnQkFBUixDQVJkLENBQUE7O0FBQUEsRUFTQSxLQUFBLEdBQVEsT0FBQSxDQUFRLFNBQVIsQ0FUUixDQUFBOztBQUFBLEVBVUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxTQUFSLENBVlIsQ0FBQTs7QUFBQSxFQVdBLE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUixDQVhULENBQUE7O0FBQUEsRUFZQSxRQUFxQixPQUFBLENBQVEsTUFBUixDQUFyQixFQUFDLFdBQUEsRUFBRCxFQUFLLGNBQUEsS0FBTCxFQUFZLGNBQUEsS0FaWixDQUFBOztBQUFBLEVBYUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxNQUFSLENBYlQsQ0FBQTs7QUFBQSxFQWVBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSix1QkFBQSxNQUFBLEdBQVEsSUFBUixDQUFBOztBQUFBLHVCQUNBLE9BQUEsR0FBUyxJQURULENBQUE7O0FBQUEsdUJBRUEsSUFBQSxHQUFNLElBRk4sQ0FBQTs7QUFBQSx1QkFHQSxPQUFB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
//# sourceURL=/Users/ah/.atom/packages/vim-mode/lib/vim-state.coffee