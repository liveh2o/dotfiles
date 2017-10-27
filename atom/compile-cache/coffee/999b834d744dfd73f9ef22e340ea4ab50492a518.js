(function() {
  var AnyBracket, BracketMatchingMotion, CloseBrackets, Input, MotionWithInput, OpenBrackets, Point, Range, Search, SearchBase, SearchCurrentWord, SearchViewModel, _, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('underscore-plus');

  MotionWithInput = require('./general-motions').MotionWithInput;

  SearchViewModel = require('../view-models/search-view-model');

  Input = require('../view-models/view-model').Input;

  _ref = require('atom'), Point = _ref.Point, Range = _ref.Range;

  SearchBase = (function(_super) {
    __extends(SearchBase, _super);

    SearchBase.prototype.operatesInclusively = false;

    SearchBase.currentSearch = null;

    function SearchBase(editor, vimState) {
      this.editor = editor;
      this.vimState = vimState;
      this.reversed = __bind(this.reversed, this);
      this.repeat = __bind(this.repeat, this);
      SearchBase.__super__.constructor.call(this, this.editor, this.vimState);
      Search.currentSearch = this;
      this.reverse = this.initiallyReversed = false;
    }

    SearchBase.prototype.repeat = function(opts) {
      var reverse;
      if (opts == null) {
        opts = {};
      }
      reverse = opts.backwards;
      if (this.initiallyReversed && reverse) {
        this.reverse = false;
      } else {
        this.reverse = reverse || this.initiallyReversed;
      }
      return this;
    };

    SearchBase.prototype.reversed = function() {
      this.initiallyReversed = this.reverse = true;
      return this;
    };

    SearchBase.prototype.moveCursor = function(cursor, count) {
      var range, ranges;
      if (count == null) {
        count = 1;
      }
      ranges = this.scan(cursor);
      if (ranges.length > 0) {
        range = ranges[(count - 1) % ranges.length];
        return cursor.setBufferPosition(range.start);
      } else {
        return atom.beep();
      }
    };

    SearchBase.prototype.scan = function(cursor) {
      var currentPosition, rangesAfter, rangesBefore, _ref1;
      currentPosition = cursor.getBufferPosition();
      _ref1 = [[], []], rangesBefore = _ref1[0], rangesAfter = _ref1[1];
      this.editor.scan(this.getSearchTerm(this.input.characters), (function(_this) {
        return function(_arg) {
          var isBefore, range;
          range = _arg.range;
          isBefore = _this.reverse ? range.start.compare(currentPosition) < 0 : range.start.compare(currentPosition) <= 0;
          if (isBefore) {
            return rangesBefore.push(range);
          } else {
            return rangesAfter.push(range);
          }
        };
      })(this));
      if (this.reverse) {
        return rangesAfter.concat(rangesBefore).reverse();
      } else {
        return rangesAfter.concat(rangesBefore);
      }
    };

    SearchBase.prototype.getSearchTerm = function(term) {
      var modFlags, modifiers;
      modifiers = {
        'g': true
      };
      if (!term.match('[A-Z]') && atom.config.get('vim-mode.useSmartcaseForSearch')) {
        modifiers['i'] = true;
      }
      if (term.indexOf('\\c') >= 0) {
        term = term.replace('\\c', '');
        modifiers['i'] = true;
      }
      modFlags = Object.keys(modifiers).join('');
      try {
        return new RegExp(term, modFlags);
      } catch (_error) {
        return new RegExp(_.escapeRegExp(term), modFlags);
      }
    };

    return SearchBase;

  })(MotionWithInput);

  Search = (function(_super) {
    __extends(Search, _super);

    function Search(editor, vimState) {
      this.editor = editor;
      this.vimState = vimState;
      Search.__super__.constructor.call(this, this.editor, this.vimState);
      this.viewModel = new SearchViewModel(this);
      Search.currentSearch = this;
      this.reverse = this.initiallyReversed = false;
    }

    Search.prototype.compose = function(input) {
      Search.__super__.compose.call(this, input);
      return this.viewModel.value = this.input.characters;
    };

    return Search;

  })(SearchBase);

  SearchCurrentWord = (function(_super) {
    __extends(SearchCurrentWord, _super);

    SearchCurrentWord.keywordRegex = null;

    function SearchCurrentWord(editor, vimState) {
      var defaultIsKeyword, userIsKeyword;
      this.editor = editor;
      this.vimState = vimState;
      SearchCurrentWord.__super__.constructor.call(this, this.editor, this.vimState);
      Search.currentSearch = this;
      this.reverse = this.initiallyReversed = false;
      defaultIsKeyword = "[@a-zA-Z0-9_\-]+";
      userIsKeyword = atom.config.get('vim-mode.iskeyword');
      this.keywordRegex = new RegExp(userIsKeyword || defaultIsKeyword);
      this.input = new Input(this.getCurrentWordMatch());
    }

    SearchCurrentWord.prototype.getCurrentWord = function(onRecursion) {
      var characters, cursor, wordRange;
      if (onRecursion == null) {
        onRecursion = false;
      }
      cursor = this.editor.getLastCursor();
      wordRange = cursor.getCurrentWordBufferRange({
        wordRegex: this.keywordRegex
      });
      characters = this.editor.getTextInBufferRange(wordRange);
      if (characters.length === 0 && !onRecursion) {
        if (this.cursorIsOnEOF(cursor)) {
          return "";
        } else {
          cursor.moveToNextWordBoundary({
            wordRegex: this.keywordRegex
          });
          return this.getCurrentWord(true);
        }
      } else {
        return characters;
      }
    };

    SearchCurrentWord.prototype.cursorIsOnEOF = function(cursor) {
      var eofPos, pos;
      pos = cursor.getNextWordBoundaryBufferPosition({
        wordRegex: this.keywordRegex
      });
      eofPos = this.editor.getEofBufferPosition();
      return pos.row === eofPos.row && pos.column === eofPos.column;
    };

    SearchCurrentWord.prototype.getCurrentWordMatch = function() {
      var characters;
      characters = this.getCurrentWord();
      if (characters.length > 0) {
        if (/\W/.test(characters)) {
          return "" + characters + "\\b";
        } else {
          return "\\b" + characters + "\\b";
        }
      } else {
        return characters;
      }
    };

    SearchCurrentWord.prototype.isComplete = function() {
      return true;
    };

    SearchCurrentWord.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      if (this.input.characters.length > 0) {
        return SearchCurrentWord.__super__.execute.call(this, count);
      }
    };

    return SearchCurrentWord;

  })(SearchBase);

  OpenBrackets = ['(', '{', '['];

  CloseBrackets = [')', '}', ']'];

  AnyBracket = new RegExp(OpenBrackets.concat(CloseBrackets).map(_.escapeRegExp).join("|"));

  BracketMatchingMotion = (function(_super) {
    __extends(BracketMatchingMotion, _super);

    BracketMatchingMotion.prototype.operatesInclusively = true;

    BracketMatchingMotion.keywordRegex = null;

    function BracketMatchingMotion(editor, vimState) {
      this.editor = editor;
      this.vimState = vimState;
      BracketMatchingMotion.__super__.constructor.call(this, this.editor, this.vimState);
      Search.currentSearch = this;
      this.reverse = this.initiallyReversed = false;
    }

    BracketMatchingMotion.prototype.isComplete = function() {
      return true;
    };

    BracketMatchingMotion.prototype.searchOnLine = function(startPosition, reverse, inCharacter, outCharacter) {
      var character, column, depth, endColumn, increment, point, row;
      if (reverse) {
        endColumn = 0;
        increment = -1;
      } else {
        endColumn = this.editor.lineLengthForBufferRow(startPosition.row);
        increment = 1;
      }
      depth = 0;
      row = startPosition.row, column = startPosition.column;
      while (true) {
        point = new Point(row, column);
        character = this.characterAt(new Point(row, column));
        if (character === inCharacter) {
          depth++;
        }
        if (character === outCharacter) {
          depth--;
        }
        if (depth === 0) {
          return point;
        }
        if (column === endColumn) {
          return null;
        }
        column += increment;
      }
    };

    BracketMatchingMotion.prototype.characterAt = function(position) {
      return this.editor.getTextInBufferRange([position, position.add([0, 1])]);
    };

    BracketMatchingMotion.prototype.getSearchData = function(position) {
      var character, index;
      character = this.characterAt(position);
      if ((index = OpenBrackets.indexOf(character)) >= 0) {
        return [character, CloseBrackets[index], false];
      } else if ((index = CloseBrackets.indexOf(character)) >= 0) {
        return [character, OpenBrackets[index], true];
      } else {
        return [];
      }
    };

    BracketMatchingMotion.prototype.moveCursor = function(cursor) {
      var inCharacter, matchPosition, outCharacter, restOfLine, reverse, startPosition, _ref1, _ref2;
      startPosition = cursor.getBufferPosition();
      _ref1 = this.getSearchData(startPosition), inCharacter = _ref1[0], outCharacter = _ref1[1], reverse = _ref1[2];
      if (inCharacter == null) {
        restOfLine = [startPosition, [startPosition.row, Infinity]];
        this.editor.scanInBufferRange(AnyBracket, restOfLine, function(_arg) {
          var range, stop;
          range = _arg.range, stop = _arg.stop;
          startPosition = range.start;
          return stop();
        });
      }
      _ref2 = this.getSearchData(startPosition), inCharacter = _ref2[0], outCharacter = _ref2[1], reverse = _ref2[2];
      if (inCharacter == null) {
        return;
      }
      if (matchPosition = this.searchOnLine(startPosition, reverse, inCharacter, outCharacter)) {
        return cursor.setBufferPosition(matchPosition);
      }
    };

    return BracketMatchingMotion;

  })(SearchBase);

  module.exports = {
    Search: Search,
    SearchCurrentWord: SearchCurrentWord,
    BracketMatchingMotion: BracketMatchingMotion
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHFLQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQUFKLENBQUE7O0FBQUEsRUFDQyxrQkFBbUIsT0FBQSxDQUFRLG1CQUFSLEVBQW5CLGVBREQsQ0FBQTs7QUFBQSxFQUVBLGVBQUEsR0FBa0IsT0FBQSxDQUFRLGtDQUFSLENBRmxCLENBQUE7O0FBQUEsRUFHQyxRQUFTLE9BQUEsQ0FBUSwyQkFBUixFQUFULEtBSEQsQ0FBQTs7QUFBQSxFQUlBLE9BQWlCLE9BQUEsQ0FBUSxNQUFSLENBQWpCLEVBQUMsYUFBQSxLQUFELEVBQVEsYUFBQSxLQUpSLENBQUE7O0FBQUEsRUFNTTtBQUNKLGlDQUFBLENBQUE7O0FBQUEseUJBQUEsbUJBQUEsR0FBcUIsS0FBckIsQ0FBQTs7QUFBQSxJQUNBLFVBQUMsQ0FBQSxhQUFELEdBQWdCLElBRGhCLENBQUE7O0FBR2EsSUFBQSxvQkFBRSxNQUFGLEVBQVcsUUFBWCxHQUFBO0FBQ1gsTUFEWSxJQUFDLENBQUEsU0FBQSxNQUNiLENBQUE7QUFBQSxNQURxQixJQUFDLENBQUEsV0FBQSxRQUN0QixDQUFBO0FBQUEsaURBQUEsQ0FBQTtBQUFBLDZDQUFBLENBQUE7QUFBQSxNQUFBLDRDQUFNLElBQUMsQ0FBQSxNQUFQLEVBQWUsSUFBQyxDQUFBLFFBQWhCLENBQUEsQ0FBQTtBQUFBLE1BQ0EsTUFBTSxDQUFDLGFBQVAsR0FBdUIsSUFEdkIsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxJQUFDLENBQUEsaUJBQUQsR0FBcUIsS0FGaEMsQ0FEVztJQUFBLENBSGI7O0FBQUEseUJBUUEsTUFBQSxHQUFRLFNBQUMsSUFBRCxHQUFBO0FBQ04sVUFBQSxPQUFBOztRQURPLE9BQU87T0FDZDtB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
//# sourceURL=/Users/ah/.atom/packages/vim-mode/lib/motions/search-motion.coffee