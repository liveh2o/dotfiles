(function() {
  var CompositeDisposable, Disposable, Emitter, Grim, InsertMode, Motions, Operators, Point, Prefixes, Range, Scroll, TextObjects, Utils, VimState, getChangesSinceCheckpoint, settings, _, _ref, _ref1,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Grim = require('grim');

  _ = require('underscore-plus');

  _ref = require('atom'), Point = _ref.Point, Range = _ref.Range;

  _ref1 = require('event-kit'), Emitter = _ref1.Emitter, Disposable = _ref1.Disposable, CompositeDisposable = _ref1.CompositeDisposable;

  settings = require('./settings');

  Operators = require('./operators/index');

  Prefixes = require('./prefixes');

  Motions = require('./motions/index');

  InsertMode = require('./insert-mode');

  TextObjects = require('./text-objects');

  Utils = require('./utils');

  Scroll = require('./scroll');

  module.exports = VimState = (function() {
    VimState.prototype.editor = null;

    VimState.prototype.opStack = null;

    VimState.prototype.mode = null;

    VimState.prototype.submode = null;

    VimState.prototype.destroyed = false;

    VimState.prototype.replaceModeListener = null;

    function VimState(editorElement, statusBarManager, globalVimState) {
      this.editorElement = editorElement;
      this.statusBarManager = statusBarManager;
      this.globalVimState = globalVimState;
      this.ensureCursorsWithinLine = __bind(this.ensureCursorsWithinLine, this);
      this.checkSelections = __bind(this.checkSelections, this);
      this.replaceModeUndoHandler = __bind(this.replaceModeUndoHandler, this);
      this.replaceModeInsertHandler = __bind(this.replaceModeInsertHandler, this);
      this.emitter = new Emitter;
      this.subscriptions = new CompositeDisposable;
      this.editor = this.editorElement.getModel();
      this.opStack = [];
      this.history = [];
      this.marks = {};
      this.subscriptions.add(this.editor.onDidDestroy((function(_this) {
        return function() {
          return _this.destroy();
        };
      })(this)));
      this.editorElement.addEventListener('mouseup', this.checkSelections);
      if (atom.commands.onDidDispatch != null) {
        this.subscriptions.add(atom.commands.onDidDispatch((function(_this) {
          return function(e) {
            if (e.target === _this.editorElement) {
              return _this.checkSelections();
            }
          };
        })(this)));
      }
      this.editorElement.classList.add("vim-mode");
      this.setupNormalMode();
      if (settings.startInInsertMode()) {
        this.activateInsertMode();
      } else {
        this.activateNormalMode();
      }
    }

    VimState.prototype.destroy = function() {
      var _ref2;
      if (!this.destroyed) {
        this.destroyed = true;
        this.subscriptions.dispose();
        if (this.editor.isAlive()) {
          this.deactivateInsertMode();
          if ((_ref2 = this.editorElement.component) != null) {
            _ref2.setInputEnabled(true);
          }
          this.editorElement.classList.remove("vim-mode");
          this.editorElement.classList.remove("normal-mode");
        }
        this.editorElement.removeEventListener('mouseup', this.checkSelections);
        this.editor = null;
        this.editorElement = null;
        return this.emitter.emit('did-destroy');
      }
    };

    VimState.prototype.setupNormalMode = function() {
      this.registerCommands({
        'activate-normal-mode': (function(_this) {
          return function() {
            return _this.activateNormalMode();
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
        'reset-normal-mode': (function(_this) {
          return function() {
            return _this.resetNormalMode();
          };
        })(this),
        'repeat-prefix': (function(_this) {
          return function(e) {
            return _this.repeatPrefix(e);
          };
        })(this),
        'reverse-selections': (function(_this) {
          return function(e) {
            return _this.reverseSelections(e);
          };
        })(this),
        'undo': (function(_this) {
          return function(e) {
            return _this.undo(e);
          };
        })(this),
        'replace-mode-backspace': (function(_this) {
          return function() {
            return _this.replaceModeUndo();
          };
        })(this),
        'insert-mode-put': (function(_this) {
          return function(e) {
            return _this.insertRegister(_this.registerName(e));
          };
        })(this),
        'copy-from-line-above': (function(_this) {
          return function() {
            return InsertMode.copyCharacterFromAbove(_this.editor, _this);
          };
        })(this),
        'copy-from-line-below': (function(_this) {
          return function() {
            return InsertMode.copyCharacterFromBelow(_this.editor, _this);
          };
        })(this)
      });
      return this.registerOperationCommands({
        'activate-insert-mode': (function(_this) {
          return function() {
            return new Operators.Insert(_this.editor, _this);
          };
        })(this),
        'activate-replace-mode': (function(_this) {
          return function() {
            return new Operators.ReplaceMode(_this.editor, _this);
          };
        })(this),
        'substitute': (function(_this) {
          return function() {
            return [new Operators.Change(_this.editor, _this), new Motions.MoveRight(_this.editor, _this)];
          };
        })(this),
        'substitute-line': (function(_this) {
          return function() {
            return [new Operators.Change(_this.editor, _this), new Motions.MoveToRelativeLine(_this.editor, _this)];
          };
        })(this),
        'insert-after': (function(_this) {
          return function() {
            return new Operators.InsertAfter(_this.editor, _this);
          };
        })(this),
        'insert-after-end-of-line': (function(_this) {
          return function() {
            return new Operators.InsertAfterEndOfLine(_this.editor, _this);
          };
        })(this),
        'insert-at-beginning-of-line': (function(_this) {
          return function() {
            return new Operators.InsertAtBeginningOfLine(_this.editor, _this);
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
        'upper-case': (function(_this) {
          return function() {
            return new Operators.UpperCase(_this.editor, _this);
          };
        })(this),
        'lower-case': (function(_this) {
          return function() {
            return new Operators.LowerCase(_this.editor, _this);
          };
        })(this),
        'toggle-case-now': (function(_this) {
          return function() {
            return new Operators.ToggleCase(_this.editor, _this, {
              complete: true
            });
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
        'increase': (function(_this) {
          return function() {
            return new Operators.Increase(_this.editor, _this);
          };
        })(this),
        'decrease': (function(_this) {
          return function() {
            return new Operators.Decrease(_this.editor, _this);
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
        'move-to-first-character-of-line-and-down': (function(_this) {
          return function() {
            return new Motions.MoveToFirstCharacterOfLineAndDown(_this.editor, _this);
          };
        })(this),
        'move-to-last-character-of-line': (function(_this) {
          return function() {
            return new Motions.MoveToLastCharacterOfLine(_this.editor, _this);
          };
        })(this),
        'move-to-last-nonblank-character-of-line-and-down': (function(_this) {
          return function() {
            return new Motions.MoveToLastNonblankCharacterOfLineAndDown(_this.editor, _this);
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
            return new Motions.MoveToAbsoluteLine(_this.editor, _this);
          };
        })(this),
        'move-to-top-of-screen': (function(_this) {
          return function() {
            return new Motions.MoveToTopOfScreen(_this.editorElement, _this);
          };
        })(this),
        'move-to-bottom-of-screen': (function(_this) {
          return function() {
            return new Motions.MoveToBottomOfScreen(_this.editorElement, _this);
          };
        })(this),
        'move-to-middle-of-screen': (function(_this) {
          return function() {
            return new Motions.MoveToMiddleOfScreen(_this.editorElement, _this);
          };
        })(this),
        'scroll-down': (function(_this) {
          return function() {
            return new Scroll.ScrollDown(_this.editorElement);
          };
        })(this),
        'scroll-up': (function(_this) {
          return function() {
            return new Scroll.ScrollUp(_this.editorElement);
          };
        })(this),
        'scroll-cursor-to-top': (function(_this) {
          return function() {
            return new Scroll.ScrollCursorToTop(_this.editorElement);
          };
        })(this),
        'scroll-cursor-to-top-leave': (function(_this) {
          return function() {
            return new Scroll.ScrollCursorToTop(_this.editorElement, {
              leaveCursor: true
            });
          };
        })(this),
        'scroll-cursor-to-middle': (function(_this) {
          return function() {
            return new Scroll.ScrollCursorToMiddle(_this.editorElement);
          };
        })(this),
        'scroll-cursor-to-middle-leave': (function(_this) {
          return function() {
            return new Scroll.ScrollCursorToMiddle(_this.editorElement, {
              leaveCursor: true
            });
          };
        })(this),
        'scroll-cursor-to-bottom': (function(_this) {
          return function() {
            return new Scroll.ScrollCursorToBottom(_this.editorElement);
          };
        })(this),
        'scroll-cursor-to-bottom-leave': (function(_this) {
          return function() {
            return new Scroll.ScrollCursorToBottom(_this.editorElement, {
              leaveCursor: true
            });
          };
        })(this),
        'scroll-half-screen-up': (function(_this) {
          return function() {
            return new Motions.ScrollHalfUpKeepCursor(_this.editorElement, _this);
          };
        })(this),
        'scroll-full-screen-up': (function(_this) {
          return function() {
            return new Motions.ScrollFullUpKeepCursor(_this.editorElement, _this);
          };
        })(this),
        'scroll-half-screen-down': (function(_this) {
          return function() {
            return new Motions.ScrollHalfDownKeepCursor(_this.editorElement, _this);
          };
        })(this),
        'scroll-full-screen-down': (function(_this) {
          return function() {
            return new Motions.ScrollFullDownKeepCursor(_this.editorElement, _this);
          };
        })(this),
        'scroll-cursor-to-left': (function(_this) {
          return function() {
            return new Scroll.ScrollCursorToLeft(_this.editorElement);
          };
        })(this),
        'scroll-cursor-to-right': (function(_this) {
          return function() {
            return new Scroll.ScrollCursorToRight(_this.editorElement);
          };
        })(this),
        'select-inside-word': (function(_this) {
          return function() {
            return new TextObjects.SelectInsideWord(_this.editor);
          };
        })(this),
        'select-inside-whole-word': (function(_this) {
          return function() {
            return new TextObjects.SelectInsideWholeWord(_this.editor);
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
        'select-inside-tags': (function(_this) {
          return function() {
            return new TextObjects.SelectInsideBrackets(_this.editor, '>', '<', false);
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
        'select-inside-paragraph': (function(_this) {
          return function() {
            return new TextObjects.SelectInsideParagraph(_this.editor, false);
          };
        })(this),
        'select-a-word': (function(_this) {
          return function() {
            return new TextObjects.SelectAWord(_this.editor);
          };
        })(this),
        'select-a-whole-word': (function(_this) {
          return function() {
            return new TextObjects.SelectAWholeWord(_this.editor);
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
        'select-around-paragraph': (function(_this) {
          return function() {
            return new TextObjects.SelectAParagraph(_this.editor, true);
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
            return new Motions.RepeatSearch(_this.editor, _this);
          };
        })(this),
        'repeat-search-backwards': (function(_this) {
          return function(e) {
            return new Motions.RepeatSearch(_this.editor, _this).reversed();
          };
        })(this),
        'move-to-mark': (function(_this) {
          return function(e) {
            return new Motions.MoveToMark(_this.editor, _this);
          };
        })(this),
        'move-to-mark-literal': (function(_this) {
          return function(e) {
            return new Motions.MoveToMark(_this.editor, _this, false);
          };
        })(this),
        'mark': (function(_this) {
          return function(e) {
            return new Operators.Mark(_this.editor, _this);
          };
        })(this),
        'find': (function(_this) {
          return function(e) {
            return new Motions.Find(_this.editor, _this);
          };
        })(this),
        'find-backwards': (function(_this) {
          return function(e) {
            return new Motions.Find(_this.editor, _this).reverse();
          };
        })(this),
        'till': (function(_this) {
          return function(e) {
            return new Motions.Till(_this.editor, _this);
          };
        })(this),
        'till-backwards': (function(_this) {
          return function(e) {
            return new Motions.Till(_this.editor, _this).reverse();
          };
        })(this),
        'repeat-find': (function(_this) {
          return function(e) {
            if (_this.globalVimState.currentFind) {
              return new _this.globalVimState.currentFind.constructor(_this.editor, _this, {
                repeated: true
              });
            }
          };
        })(this),
        'repeat-find-reverse': (function(_this) {
          return function(e) {
            if (_this.globalVimState.currentFind) {
              return new _this.globalVimState.currentFind.constructor(_this.editor, _this, {
                repeated: true,
                reverse: true
              });
            }
          };
        })(this),
        'replace': (function(_this) {
          return function(e) {
            return new Operators.Replace(_this.editor, _this);
          };
        })(this),
        'search': (function(_this) {
          return function(e) {
            return new Motions.Search(_this.editor, _this);
          };
        })(this),
        'reverse-search': (function(_this) {
          return function(e) {
            return (new Motions.Search(_this.editor, _this)).reversed();
          };
        })(this),
        'search-current-word': (function(_this) {
          return function(e) {
            return new Motions.SearchCurrentWord(_this.editor, _this);
          };
        })(this),
        'bracket-matching-motion': (function(_this) {
          return function(e) {
            return new Motions.BracketMatchingMotion(_this.editor, _this);
          };
        })(this),
        'reverse-search-current-word': (function(_this) {
          return function(e) {
            return (new Motions.SearchCurrentWord(_this.editor, _this)).reversed();
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
            return _this.subscriptions.add(atom.commands.add(_this.editorElement, "vim-mode:" + commandName, fn));
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
          this.resetNormalMode();
          this.emitter.emit('failed-to-compose');
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

    VimState.prototype.onDidFailToCompose = function(fn) {
      return this.emitter.on('failed-to-compose', fn);
    };

    VimState.prototype.onDidDestroy = function(fn) {
      return this.emitter.on('did-destroy', fn);
    };

    VimState.prototype.clearOpStack = function() {
      return this.opStack = [];
    };

    VimState.prototype.undo = function() {
      this.editor.undo();
      return this.activateNormalMode();
    };

    VimState.prototype.processOpStack = function() {
      var e, poppedOperation;
      if (!(this.opStack.length > 0)) {
        return;
      }
      if (!this.topOperation().isComplete()) {
        if (this.mode === 'normal' && this.topOperation() instanceof Operators.Operator) {
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
            return this.resetNormalMode();
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
      if (name === '"') {
        name = settings.defaultRegister();
      }
      if (name === '*' || name === '+') {
        text = atom.clipboard.read();
        type = Utils.copyType(text);
        return {
          text: text,
          type: type
        };
      } else if (name === '%') {
        text = this.editor.getURI();
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
        return this.globalVimState.registers[name.toLowerCase()];
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
      if (name === '"') {
        name = settings.defaultRegister();
      }
      if (name === '*' || name === '+') {
        return atom.clipboard.write(value.text);
      } else if (name === '_') {

      } else if (/^[A-Z]$/.test(name)) {
        return this.appendRegister(name.toLowerCase(), value);
      } else {
        return this.globalVimState.registers[name] = value;
      }
    };

    VimState.prototype.appendRegister = function(name, value) {
      var register, _base;
      register = (_base = this.globalVimState.registers)[name] != null ? _base[name] : _base[name] = {
        type: 'character',
        text: ""
      };
      if (register.type === 'linewise' && value.type !== 'linewise') {
        return register.text += value.text + '\n';
      } else if (register.type !== 'linewise' && value.type === 'linewise') {
        register.text += '\n' + value.text;
        return register.type = 'linewise';
      } else {
        return register.text += value.text;
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
      return this.globalVimState.searchHistory.unshift(search);
    };

    VimState.prototype.getSearchHistoryItem = function(index) {
      if (index == null) {
        index = 0;
      }
      return this.globalVimState.searchHistory[index];
    };

    VimState.prototype.activateNormalMode = function() {
      var selection, _i, _len, _ref2;
      this.deactivateInsertMode();
      this.deactivateVisualMode();
      this.mode = 'normal';
      this.submode = null;
      this.changeModeClass('normal-mode');
      this.clearOpStack();
      _ref2 = this.editor.getSelections();
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        selection = _ref2[_i];
        selection.clear({
          autoscroll: false
        });
      }
      this.ensureCursorsWithinLine();
      return this.updateStatusBar();
    };

    VimState.prototype.activateCommandMode = function() {
      Grim.deprecate("Use ::activateNormalMode instead");
      return this.activateNormalMode();
    };

    VimState.prototype.activateInsertMode = function(subtype) {
      if (subtype == null) {
        subtype = null;
      }
      this.mode = 'insert';
      this.editorElement.component.setInputEnabled(true);
      this.setInsertionCheckpoint();
      this.submode = subtype;
      this.changeModeClass('insert-mode');
      return this.updateStatusBar();
    };

    VimState.prototype.activateReplaceMode = function() {
      this.activateInsertMode('replace');
      this.replaceModeCounter = 0;
      this.editorElement.classList.add('replace-mode');
      this.subscriptions.add(this.replaceModeListener = this.editor.onWillInsertText(this.replaceModeInsertHandler));
      return this.subscriptions.add(this.replaceModeUndoListener = this.editor.onDidInsertText(this.replaceModeUndoHandler));
    };

    VimState.prototype.replaceModeInsertHandler = function(event) {
      var char, chars, selection, selections, _i, _j, _len, _len1, _ref2;
      chars = ((_ref2 = event.text) != null ? _ref2.split('') : void 0) || [];
      selections = this.editor.getSelections();
      for (_i = 0, _len = chars.length; _i < _len; _i++) {
        char = chars[_i];
        if (char === '\n') {
          continue;
        }
        for (_j = 0, _len1 = selections.length; _j < _len1; _j++) {
          selection = selections[_j];
          if (!selection.cursor.isAtEndOfLine()) {
            selection["delete"]();
          }
        }
      }
    };

    VimState.prototype.replaceModeUndoHandler = function(event) {
      return this.replaceModeCounter++;
    };

    VimState.prototype.replaceModeUndo = function() {
      if (this.replaceModeCounter > 0) {
        this.editor.undo();
        this.editor.undo();
        this.editor.moveLeft();
        return this.replaceModeCounter--;
      }
    };

    VimState.prototype.setInsertionCheckpoint = function() {
      if (this.insertionCheckpoint == null) {
        return this.insertionCheckpoint = this.editor.createCheckpoint();
      }
    };

    VimState.prototype.deactivateInsertMode = function() {
      var changes, cursor, item, _i, _len, _ref2, _ref3;
      if ((_ref2 = this.mode) !== null && _ref2 !== 'insert') {
        return;
      }
      this.editorElement.component.setInputEnabled(false);
      this.editorElement.classList.remove('replace-mode');
      this.editor.groupChangesSinceCheckpoint(this.insertionCheckpoint);
      changes = getChangesSinceCheckpoint(this.editor.buffer, this.insertionCheckpoint);
      item = this.inputOperator(this.history[0]);
      this.insertionCheckpoint = null;
      if (item != null) {
        item.confirmChanges(changes);
      }
      _ref3 = this.editor.getCursors();
      for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
        cursor = _ref3[_i];
        if (!cursor.isAtBeginningOfLine()) {
          cursor.moveLeft();
        }
      }
      if (this.replaceModeListener != null) {
        this.replaceModeListener.dispose();
        this.subscriptions.remove(this.replaceModeListener);
        this.replaceModeListener = null;
        this.replaceModeUndoListener.dispose();
        this.subscriptions.remove(this.replaceModeUndoListener);
        return this.replaceModeUndoListener = null;
      }
    };

    VimState.prototype.deactivateVisualMode = function() {
      var selection, _i, _len, _ref2, _results;
      if (this.mode !== 'visual') {
        return;
      }
      _ref2 = this.editor.getSelections();
      _results = [];
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        selection = _ref2[_i];
        if (!(selection.isEmpty() || selection.isReversed())) {
          _results.push(selection.cursor.moveLeft());
        } else {
          _results.push(void 0);
        }
      }
      return _results;
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
      var end, endRow, originalRange, row, selection, start, startRow, _i, _j, _k, _len, _len1, _ref2, _ref3, _ref4, _ref5, _ref6;
      if (this.mode === 'visual') {
        if (this.submode === type) {
          this.activateNormalMode();
          return;
        }
        this.submode = type;
        if (this.submode === 'linewise') {
          _ref2 = this.editor.getSelections();
          for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
            selection = _ref2[_i];
            originalRange = selection.getBufferRange();
            selection.marker.setProperties({
              originalRange: originalRange
            });
            _ref3 = selection.getBufferRowRange(), start = _ref3[0], end = _ref3[1];
            for (row = _j = start; start <= end ? _j <= end : _j >= end; row = start <= end ? ++_j : --_j) {
              selection.selectLine(row);
            }
          }
        } else if ((_ref4 = this.submode) === 'characterwise' || _ref4 === 'blockwise') {
          _ref5 = this.editor.getSelections();
          for (_k = 0, _len1 = _ref5.length; _k < _len1; _k++) {
            selection = _ref5[_k];
            originalRange = selection.marker.getProperties().originalRange;
            if (originalRange) {
              _ref6 = selection.getBufferRowRange(), startRow = _ref6[0], endRow = _ref6[1];
              originalRange.start.row = startRow;
              originalRange.end.row = endRow;
              selection.setBufferRange(originalRange);
            }
          }
        }
      } else {
        this.deactivateInsertMode();
        this.mode = 'visual';
        this.submode = type;
        this.changeModeClass('visual-mode');
        if (this.submode === 'linewise') {
          this.editor.selectLinesContainingCursors();
        } else if (this.editor.getSelectedText() === '') {
          this.editor.selectRight();
        }
      }
      return this.updateStatusBar();
    };

    VimState.prototype.resetVisualMode = function() {
      return this.activateVisualMode(this.submode);
    };

    VimState.prototype.activateOperatorPendingMode = function() {
      this.deactivateInsertMode();
      this.mode = 'operator-pending';
      this.submode = null;
      this.changeModeClass('operator-pending-mode');
      return this.updateStatusBar();
    };

    VimState.prototype.changeModeClass = function(targetMode) {
      var mode, _i, _len, _ref2, _results;
      _ref2 = ['normal-mode', 'insert-mode', 'visual-mode', 'operator-pending-mode'];
      _results = [];
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        mode = _ref2[_i];
        if (mode === targetMode) {
          _results.push(this.editorElement.classList.add(mode));
        } else {
          _results.push(this.editorElement.classList.remove(mode));
        }
      }
      return _results;
    };

    VimState.prototype.resetNormalMode = function() {
      this.clearOpStack();
      this.editor.clearSelections();
      return this.activateNormalMode();
    };

    VimState.prototype.registerPrefix = function(e) {
      return new Prefixes.Register(this.registerName(e));
    };

    VimState.prototype.registerName = function(e) {
      var keyboardEvent, name, _ref2, _ref3;
      keyboardEvent = (_ref2 = (_ref3 = e.originalEvent) != null ? _ref3.originalEvent : void 0) != null ? _ref2 : e.originalEvent;
      name = atom.keymaps.keystrokeForKeyboardEvent(keyboardEvent);
      if (name.lastIndexOf('shift-', 0) === 0) {
        name = name.slice(6);
      }
      return name;
    };

    VimState.prototype.repeatPrefix = function(e) {
      var keyboardEvent, num, _ref2, _ref3;
      keyboardEvent = (_ref2 = (_ref3 = e.originalEvent) != null ? _ref3.originalEvent : void 0) != null ? _ref2 : e.originalEvent;
      num = parseInt(atom.keymaps.keystrokeForKeyboardEvent(keyboardEvent));
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

    VimState.prototype.reverseSelections = function() {
      var reversed, selection, _i, _len, _ref2, _results;
      reversed = !this.editor.getLastSelection().isReversed();
      _ref2 = this.editor.getSelections();
      _results = [];
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        selection = _ref2[_i];
        _results.push(selection.setBufferRange(selection.getBufferRange(), {
          reversed: reversed
        }));
      }
      return _results;
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
      return this.statusBarManager.update(this.mode, this.submode);
    };

    VimState.prototype.insertRegister = function(name) {
      var text, _ref2;
      text = (_ref2 = this.getRegister(name)) != null ? _ref2.text : void 0;
      if (text != null) {
        return this.editor.insertText(text);
      }
    };

    VimState.prototype.checkSelections = function() {
      if (this.editor == null) {
        return;
      }
      if (this.editor.getSelections().every(function(selection) {
        return selection.isEmpty();
      })) {
        if (this.mode === 'normal') {
          this.ensureCursorsWithinLine();
        }
        if (this.mode === 'visual') {
          return this.activateNormalMode();
        }
      } else {
        if (this.mode === 'normal') {
          return this.activateVisualMode('characterwise');
        }
      }
    };

    VimState.prototype.ensureCursorsWithinLine = function() {
      var cursor, goalColumn, _i, _len, _ref2;
      _ref2 = this.editor.getCursors();
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        cursor = _ref2[_i];
        goalColumn = cursor.goalColumn;
        if (cursor.isAtEndOfLine() && !cursor.isAtBeginningOfLine()) {
          cursor.moveLeft();
        }
        cursor.goalColumn = goalColumn;
      }
      return this.editor.mergeCursors();
    };

    return VimState;

  })();

  getChangesSinceCheckpoint = function(buffer, checkpoint) {
    var history, index;
    history = buffer.history;
    if ((index = history.getCheckpointIndex(checkpoint)) != null) {
      return history.undoStack.slice(index);
    } else {
      return [];
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3ZpbS1tb2RlL2xpYi92aW0tc3RhdGUuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlNQUFBO0lBQUEsa0ZBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQVEsT0FBQSxDQUFRLE1BQVIsQ0FBUixDQUFBOztBQUFBLEVBQ0EsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQURKLENBQUE7O0FBQUEsRUFFQSxPQUFpQixPQUFBLENBQVEsTUFBUixDQUFqQixFQUFDLGFBQUEsS0FBRCxFQUFRLGFBQUEsS0FGUixDQUFBOztBQUFBLEVBR0EsUUFBNkMsT0FBQSxDQUFRLFdBQVIsQ0FBN0MsRUFBQyxnQkFBQSxPQUFELEVBQVUsbUJBQUEsVUFBVixFQUFzQiw0QkFBQSxtQkFIdEIsQ0FBQTs7QUFBQSxFQUlBLFFBQUEsR0FBVyxPQUFBLENBQVEsWUFBUixDQUpYLENBQUE7O0FBQUEsRUFNQSxTQUFBLEdBQVksT0FBQSxDQUFRLG1CQUFSLENBTlosQ0FBQTs7QUFBQSxFQU9BLFFBQUEsR0FBVyxPQUFBLENBQVEsWUFBUixDQVBYLENBQUE7O0FBQUEsRUFRQSxPQUFBLEdBQVUsT0FBQSxDQUFRLGlCQUFSLENBUlYsQ0FBQTs7QUFBQSxFQVNBLFVBQUEsR0FBYSxPQUFBLENBQVEsZUFBUixDQVRiLENBQUE7O0FBQUEsRUFXQSxXQUFBLEdBQWMsT0FBQSxDQUFRLGdCQUFSLENBWGQsQ0FBQTs7QUFBQSxFQVlBLEtBQUEsR0FBUSxPQUFBLENBQVEsU0FBUixDQVpSLENBQUE7O0FBQUEsRUFhQSxNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVIsQ0FiVCxDQUFBOztBQUFBLEVBZUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLHVCQUFBLE1BQUEsR0FBUSxJQUFSLENBQUE7O0FBQUEsdUJBQ0Es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

//# sourceURL=/Users/ah/.atom/packages/vim-mode/lib/vim-state.coffee
