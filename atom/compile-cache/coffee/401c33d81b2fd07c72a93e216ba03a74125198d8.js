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
        'move-to-next-sentence': (function(_this) {
          return function() {
            return new Motions.MoveToNextSentence(_this.editor, _this);
          };
        })(this),
        'move-to-previous-sentence': (function(_this) {
          return function() {
            return new Motions.MoveToPreviousSentence(_this.editor, _this);
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
