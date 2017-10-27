(function() {
  var AnyBracket, BracketMatchingMotion, CloseBrackets, Input, MotionWithInput, OpenBrackets, Point, Range, RepeatSearch, Search, SearchBase, SearchCurrentWord, SearchViewModel, settings, _, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('underscore-plus');

  MotionWithInput = require('./general-motions').MotionWithInput;

  SearchViewModel = require('../view-models/search-view-model');

  Input = require('../view-models/view-model').Input;

  _ref = require('atom'), Point = _ref.Point, Range = _ref.Range;

  settings = require('../settings');

  SearchBase = (function(_super) {
    __extends(SearchBase, _super);

    function SearchBase(editor, vimState, options) {
      this.editor = editor;
      this.vimState = vimState;
      if (options == null) {
        options = {};
      }
      this.reversed = __bind(this.reversed, this);
      SearchBase.__super__.constructor.call(this, this.editor, this.vimState);
      this.reverse = this.initiallyReversed = false;
      if (!options.dontUpdateCurrentSearch) {
        this.updateCurrentSearch();
      }
    }

    SearchBase.prototype.reversed = function() {
      this.initiallyReversed = this.reverse = true;
      this.updateCurrentSearch();
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
      if (this.input.characters === "") {
        return [];
      }
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
      if (!term.match('[A-Z]') && settings.useSmartcaseForSearch()) {
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

    SearchBase.prototype.updateCurrentSearch = function() {
      this.vimState.globalVimState.currentSearch.reverse = this.reverse;
      return this.vimState.globalVimState.currentSearch.initiallyReversed = this.initiallyReversed;
    };

    SearchBase.prototype.replicateCurrentSearch = function() {
      this.reverse = this.vimState.globalVimState.currentSearch.reverse;
      return this.initiallyReversed = this.vimState.globalVimState.currentSearch.initiallyReversed;
    };

    return SearchBase;

  })(MotionWithInput);

  Search = (function(_super) {
    __extends(Search, _super);

    function Search(editor, vimState) {
      this.editor = editor;
      this.vimState = vimState;
      this.reversed = __bind(this.reversed, this);
      Search.__super__.constructor.call(this, this.editor, this.vimState);
      this.viewModel = new SearchViewModel(this);
      this.updateViewModel();
    }

    Search.prototype.reversed = function() {
      this.initiallyReversed = this.reverse = true;
      this.updateCurrentSearch();
      this.updateViewModel();
      return this;
    };

    Search.prototype.updateViewModel = function() {
      return this.viewModel.update(this.initiallyReversed);
    };

    return Search;

  })(SearchBase);

  SearchCurrentWord = (function(_super) {
    __extends(SearchCurrentWord, _super);

    SearchCurrentWord.keywordRegex = null;

    function SearchCurrentWord(editor, vimState) {
      var defaultIsKeyword, searchString, userIsKeyword;
      this.editor = editor;
      this.vimState = vimState;
      SearchCurrentWord.__super__.constructor.call(this, this.editor, this.vimState);
      defaultIsKeyword = "[@a-zA-Z0-9_\-]+";
      userIsKeyword = atom.config.get('vim-mode.iskeyword');
      this.keywordRegex = new RegExp(userIsKeyword || defaultIsKeyword);
      searchString = this.getCurrentWordMatch();
      this.input = new Input(searchString);
      if (searchString !== this.vimState.getSearchHistoryItem()) {
        this.vimState.pushSearchHistory(searchString);
      }
    }

    SearchCurrentWord.prototype.getCurrentWord = function() {
      var cursor, cursorPosition, wordEnd, wordStart;
      cursor = this.editor.getLastCursor();
      wordStart = cursor.getBeginningOfCurrentWordBufferPosition({
        wordRegex: this.keywordRegex,
        allowPrevious: false
      });
      wordEnd = cursor.getEndOfCurrentWordBufferPosition({
        wordRegex: this.keywordRegex,
        allowNext: false
      });
      cursorPosition = cursor.getBufferPosition();
      if (wordEnd.column === cursorPosition.column) {
        wordEnd = cursor.getEndOfCurrentWordBufferPosition({
          wordRegex: this.keywordRegex,
          allowNext: true
        });
        if (wordEnd.row !== cursorPosition.row) {
          return "";
        }
        cursor.setBufferPosition(wordEnd);
        wordStart = cursor.getBeginningOfCurrentWordBufferPosition({
          wordRegex: this.keywordRegex,
          allowPrevious: false
        });
      }
      cursor.setBufferPosition(wordStart);
      return this.editor.getTextInBufferRange([wordStart, wordEnd]);
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

    function BracketMatchingMotion() {
      return BracketMatchingMotion.__super__.constructor.apply(this, arguments);
    }

    BracketMatchingMotion.prototype.operatesInclusively = true;

    BracketMatchingMotion.prototype.isComplete = function() {
      return true;
    };

    BracketMatchingMotion.prototype.searchForMatch = function(startPosition, reverse, inCharacter, outCharacter) {
      var character, depth, eofPosition, increment, lineLength, point;
      depth = 0;
      point = startPosition.copy();
      lineLength = this.editor.lineTextForBufferRow(point.row).length;
      eofPosition = this.editor.getEofBufferPosition().translate([0, 1]);
      increment = reverse ? -1 : 1;
      while (true) {
        character = this.characterAt(point);
        if (character === inCharacter) {
          depth++;
        }
        if (character === outCharacter) {
          depth--;
        }
        if (depth === 0) {
          return point;
        }
        point.column += increment;
        if (depth < 0) {
          return null;
        }
        if (point.isEqual([0, -1])) {
          return null;
        }
        if (point.isEqual(eofPosition)) {
          return null;
        }
        if (point.column < 0) {
          point.row--;
          lineLength = this.editor.lineTextForBufferRow(point.row).length;
          point.column = lineLength - 1;
        } else if (point.column >= lineLength) {
          point.row++;
          lineLength = this.editor.lineTextForBufferRow(point.row).length;
          point.column = 0;
        }
      }
    };

    BracketMatchingMotion.prototype.characterAt = function(position) {
      return this.editor.getTextInBufferRange([position, position.translate([0, 1])]);
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
      if (matchPosition = this.searchForMatch(startPosition, reverse, inCharacter, outCharacter)) {
        return cursor.setBufferPosition(matchPosition);
      }
    };

    return BracketMatchingMotion;

  })(SearchBase);

  RepeatSearch = (function(_super) {
    __extends(RepeatSearch, _super);

    function RepeatSearch(editor, vimState) {
      var _ref1;
      this.editor = editor;
      this.vimState = vimState;
      RepeatSearch.__super__.constructor.call(this, this.editor, this.vimState, {
        dontUpdateCurrentSearch: true
      });
      this.input = new Input((_ref1 = this.vimState.getSearchHistoryItem(0)) != null ? _ref1 : "");
      this.replicateCurrentSearch();
    }

    RepeatSearch.prototype.isComplete = function() {
      return true;
    };

    RepeatSearch.prototype.reversed = function() {
      this.reverse = !this.initiallyReversed;
      return this;
    };

    return RepeatSearch;

  })(SearchBase);

  module.exports = {
    Search: Search,
    SearchCurrentWord: SearchCurrentWord,
    BracketMatchingMotion: BracketMatchingMotion,
    RepeatSearch: RepeatSearch
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3ZpbS1tb2RlL2xpYi9tb3Rpb25zL3NlYXJjaC1tb3Rpb24uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZMQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQUFKLENBQUE7O0FBQUEsRUFDQyxrQkFBbUIsT0FBQSxDQUFRLG1CQUFSLEVBQW5CLGVBREQsQ0FBQTs7QUFBQSxFQUVBLGVBQUEsR0FBa0IsT0FBQSxDQUFRLGtDQUFSLENBRmxCLENBQUE7O0FBQUEsRUFHQyxRQUFTLE9BQUEsQ0FBUSwyQkFBUixFQUFULEtBSEQsQ0FBQTs7QUFBQSxFQUlBLE9BQWlCLE9BQUEsQ0FBUSxNQUFSLENBQWpCLEVBQUMsYUFBQSxLQUFELEVBQVEsYUFBQSxLQUpSLENBQUE7O0FBQUEsRUFLQSxRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVIsQ0FMWCxDQUFBOztBQUFBLEVBT007QUFDSixpQ0FBQSxDQUFBOztBQUFhLElBQUEsb0JBQUUsTUFBRixFQUFXLFFBQVgsRUFBcUIsT0FBckIsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLFNBQUEsTUFDYixDQUFBO0FBQUEsTUFEcUIsSUFBQyxDQUFBLFdBQUEsUUFDdEIsQ0FBQTs7UUFEZ0MsVUFBVTtPQUMxQztBQUFBLGlEQUFBLENBQUE7QUFBQSxNQUFBLDRDQUFNLElBQUMsQ0FBQSxNQUFQLEVBQWUsSUFBQyxDQUFBLFFBQWhCLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLE9BQUQsR0FBVyxJQUFDLENBQUEsaUJBQUQsR0FBcUIsS0FEaEMsQ0FBQTtBQUVBLE1BQUEsSUFBQSxDQUFBLE9BQXFDLENBQUMsdUJBQXRDO0FBQUEsUUFBQSxJQUFDLENBQUEsbUJBQUQsQ0FBQSxDQUFB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

//# sourceURL=/Users/ah/.atom/packages/vim-mode/lib/motions/search-motion.coffee
