(function() {
  var $, $$, Marker, Motions, Operators, Panes, Point, Prefixes, Range, Scroll, TextObjects, Utils, VimState, _, _ref;

  _ = require('underscore-plus');

  $ = require('atom').$;

  Operators = require('./operators/index');

  Prefixes = require('./prefixes');

  Motions = require('./motions/index');

  TextObjects = require('./text-objects');

  Utils = require('./utils');

  Panes = require('./panes');

  Scroll = require('./scroll');

  _ref = require('atom'), $$ = _ref.$$, Point = _ref.Point, Range = _ref.Range;

  Marker = require('atom');

  module.exports = VimState = (function() {
    VimState.prototype.editor = null;

    VimState.prototype.opStack = null;

    VimState.prototype.mode = null;

    VimState.prototype.submode = null;

    function VimState(editorView) {
      var params, _base;
      this.editorView = editorView;
      this.editor = this.editorView.editor;
      this.opStack = [];
      this.history = [];
      this.marks = {};
      this.desiredCursorColumn = null;
      params = {};
      params.manager = this;
      params.id = 0;
      this.setupCommandMode();
      if (typeof (_base = this.editorView).setInputEnabled === "function") {
        _base.setInputEnabled(false);
      }
      this.registerInsertIntercept();
      this.registerInsertTransactionResets();
      this.registerUndoIntercept();
      if (atom.config.get('vim-mode.startInInsertMode')) {
        this.activateInsertMode();
      } else {
        this.activateCommandMode();
      }
    }

    VimState.prototype.registerInsertIntercept = function() {
      return this.editorView.preempt('textInput', (function(_this) {
        return function(e) {
          if ($(e.currentTarget).hasClass('mini')) {
            return;
          }
          if (_this.mode === 'insert') {
            return true;
          } else {
            _this.clearOpStack();
            return false;
          }
        };
      })(this));
    };

    VimState.prototype.registerUndoIntercept = function() {
      return this.editorView.preempt('core:undo', (function(_this) {
        return function(e) {
          if (_this.mode !== 'insert') {
            return true;
          }
          _this.activateCommandMode();
          return true;
        };
      })(this));
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
      var _ref1;
      if (!(this.mode === 'insert' && ((_ref1 = this.history[0]) != null ? typeof _ref1.inputOperator === "function" ? _ref1.inputOperator() : void 0 : void 0))) {
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
      if (this.mode !== 'insert') {
        return;
      }
      if (typeof (_base = this.editorView).setInputEnabled === "function") {
        _base.setInputEnabled(false);
      }
      this.editor.commitTransaction();
      transaction = _.last(this.editor.buffer.history.undoStack);
      item = this.inputOperator(this.history[0]);
      if ((item != null) && (transaction != null)) {
        return item.confirmTransaction(transaction);
      }
    };

    VimState.prototype.inputOperator = function(item) {
      var _ref1;
      if (item == null) {
        return item;
      }
      if (typeof item.inputOperator === "function" ? item.inputOperator() : void 0) {
        return item;
      }
      if ((_ref1 = item.composedObject) != null ? typeof _ref1.inputOperator === "function" ? _ref1.inputOperator() : void 0 : void 0) {
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
      var mode, _i, _len, _ref1, _results;
      _ref1 = ['command-mode', 'insert-mode', 'visual-mode', 'operator-pending-mode'];
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        mode = _ref1[_i];
        if (mode === targetMode) {
          _results.push(this.editorView.addClass(mode));
        } else {
          _results.push(this.editorView.removeClass(mode));
        }
      }
      return _results;
    };

    VimState.prototype.resetCommandMode = function() {
      return this.activateCommandMode();
    };

    VimState.prototype.registerPrefix = function(e) {
      var keyboardEvent, name, _ref1, _ref2;
      keyboardEvent = (_ref1 = (_ref2 = e.originalEvent) != null ? _ref2.originalEvent : void 0) != null ? _ref1 : e.originalEvent;
      name = atom.keymap.keystrokeForKeyboardEvent(keyboardEvent);
      return new Prefixes.Register(name);
    };

    VimState.prototype.repeatPrefix = function(e) {
      var keyboardEvent, num, _ref1, _ref2;
      keyboardEvent = (_ref1 = (_ref2 = e.originalEvent) != null ? _ref2.originalEvent : void 0) != null ? _ref1 : e.originalEvent;
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
      var op, _i, _len, _ref1;
      if (constructor != null) {
        _ref1 = this.opStack;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          op = _ref1[_i];
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
          var _ref1;
          if (!$('#status-bar-vim-mode').length) {
            if ((_ref1 = atom.workspaceView.statusBar) != null) {
              _ref1.prependRight("<div id='status-bar-vim-mode' class='inline-block'>Command</div>");
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLCtHQUFBOztBQUFBLEVBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQUFKLENBQUE7O0FBQUEsRUFDQyxJQUFLLE9BQUEsQ0FBUSxNQUFSLEVBQUwsQ0FERCxDQUFBOztBQUFBLEVBR0EsU0FBQSxHQUFZLE9BQUEsQ0FBUSxtQkFBUixDQUhaLENBQUE7O0FBQUEsRUFJQSxRQUFBLEdBQVcsT0FBQSxDQUFRLFlBQVIsQ0FKWCxDQUFBOztBQUFBLEVBS0EsT0FBQSxHQUFVLE9BQUEsQ0FBUSxpQkFBUixDQUxWLENBQUE7O0FBQUEsRUFPQSxXQUFBLEdBQWMsT0FBQSxDQUFRLGdCQUFSLENBUGQsQ0FBQTs7QUFBQSxFQVFBLEtBQUEsR0FBUSxPQUFBLENBQVEsU0FBUixDQVJSLENBQUE7O0FBQUEsRUFTQSxLQUFBLEdBQVEsT0FBQSxDQUFRLFNBQVIsQ0FUUixDQUFBOztBQUFBLEVBVUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxVQUFSLENBVlQsQ0FBQTs7QUFBQSxFQVdBLE9BQXFCLE9BQUEsQ0FBUSxNQUFSLENBQXJCLEVBQUMsVUFBQSxFQUFELEVBQUssYUFBQSxLQUFMLEVBQVksYUFBQSxLQVhaLENBQUE7O0FBQUEsRUFZQSxNQUFBLEdBQVMsT0FBQSxDQUFRLE1BQVIsQ0FaVCxDQUFBOztBQUFBLEVBY0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLHVCQUFBLE1BQUEsR0FBUSxJQUFSLENBQUE7O0FBQUEsdUJBQ0EsT0FBQSxHQUFTLElBRFQsQ0FBQTs7QUFBQSx1QkFFQSxJQUFBLEdBQU0sSUFGTixDQUFBOztBQUFBLHVCQUdBLE9BQUEsR0FBUyxJQUhULENBQUE7O0FBS2EsSUFBQSxrQkFBRSxVQUFGLEdBQUE7QUFDWCxVQUFBLGFBQUE7QUFBQSxNQURZLElBQUMsQ0FB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
//# sourceURL=/Users/ah/.atom/packages/vim-mode/lib/vim-state.coffee