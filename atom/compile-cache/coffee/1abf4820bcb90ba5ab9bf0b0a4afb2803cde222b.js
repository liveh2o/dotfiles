(function() {
  var BracketMatchingMotion, Input, MotionWithInput, Point, Range, Search, SearchBase, SearchCurrentWord, SearchViewModel, _, _ref,
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
      if (count == null) {
        count = 1;
      }
      this.scan(cursor);
      return this.match(count, (function(_this) {
        return function(pos) {
          return cursor.setBufferPosition(pos.range.start);
        };
      })(this));
    };

    SearchBase.prototype.match = function(count, callback) {
      var pos;
      pos = this.matches[(count - 1) % this.matches.length];
      if (pos != null) {
        return callback(pos);
      } else {
        return atom.beep();
      }
    };

    SearchBase.prototype.scan = function(cursor) {
      var addToMod, after, cur, iterator, matchPoints, mod, previous, regexp, term, usingSmartcase;
      addToMod = (function(_this) {
        return function(modifier) {
          if (mod.indexOf(modifier) === -1) {
            return mod += modifier;
          } else {

          }
        };
      })(this);
      term = this.input.characters;
      mod = '';
      addToMod('g');
      usingSmartcase = atom.config.get('vim-mode.useSmartcaseForSearch');
      if (usingSmartcase && !term.match('[A-Z]')) {
        addToMod('i');
      }
      if (term.indexOf('\\c') !== -1) {
        term = term.replace('\\c', '');
        addToMod('i');
      }
      regexp = (function() {
        try {
          return new RegExp(term, mod);
        } catch (_error) {
          return new RegExp(_.escapeRegExp(term), mod);
        }
      })();
      cur = cursor.getBufferPosition();
      matchPoints = [];
      iterator = (function(_this) {
        return function(item) {
          var matchPointItem;
          matchPointItem = {
            range: item.range
          };
          return matchPoints.push(matchPointItem);
        };
      })(this);
      this.editor.scan(regexp, iterator);
      previous = _.filter(matchPoints, (function(_this) {
        return function(point) {
          if (_this.reverse) {
            return point.range.start.compare(cur) < 0;
          } else {
            return point.range.start.compare(cur) <= 0;
          }
        };
      })(this));
      after = _.difference(matchPoints, previous);
      after.push.apply(after, previous);
      if (this.reverse) {
        after = after.reverse();
      }
      return this.matches = after;
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
      this.characters = [')', '(', '}', '{', ']', '['];
      this.charactersMatching = ['(', ')', '{', '}', '[', ']'];
      this.reverseSearch = [true, false, true, false, true, false];
      this.input = new Input(this.getCurrentWordMatch());
    }

    BracketMatchingMotion.prototype.getCurrentWord = function(onRecursion) {
      var cursor, index, tempPoint;
      if (onRecursion == null) {
        onRecursion = false;
      }
      cursor = this.editor.getLastCursor();
      tempPoint = cursor.getBufferPosition().toArray();
      this.character = this.editor.getTextInBufferRange([cursor.getBufferPosition(), new Point(tempPoint[0], tempPoint[1] + 1)]);
      this.startUp = false;
      index = this.characters.indexOf(this.character);
      if (index >= 0) {
        this.matching = this.charactersMatching[index];
        this.reverse = this.reverseSearch[index];
      } else {
        this.startUp = true;
      }
      return this.character;
    };

    BracketMatchingMotion.prototype.getCurrentWordMatch = function() {
      var characters;
      characters = this.getCurrentWord();
      return characters;
    };

    BracketMatchingMotion.prototype.isComplete = function() {
      return true;
    };

    BracketMatchingMotion.prototype.searchFor = function(cursor, character) {
      var after, cur, iterator, matchPoints, matches, previous, regexp, term;
      term = character;
      regexp = new RegExp(_.escapeRegExp(term), 'g');
      cur = cursor.getBufferPosition();
      matchPoints = [];
      iterator = (function(_this) {
        return function(item) {
          var matchPointItem;
          matchPointItem = {
            range: item.range
          };
          return matchPoints.push(matchPointItem);
        };
      })(this);
      this.editor.scan(regexp, iterator);
      previous = _.filter(matchPoints, (function(_this) {
        return function(point) {
          if (_this.reverse) {
            return point.range.start.compare(cur) < 0;
          } else {
            return point.range.start.compare(cur) <= 0;
          }
        };
      })(this));
      if (this.reverse) {
        after = [];
        after.push.apply(after, previous);
        after = after.reverse();
      } else {
        after = _.difference(matchPoints, previous);
      }
      matches = after;
      return matches;
    };

    BracketMatchingMotion.prototype.scan = function(cursor) {
      var charIndex, compVal, counter, dst, i, iwin, line, matchIndex, matchesCharacter, matchesMatching, min, retVal, winner, _i, _ref1;
      if (this.startUp) {
        this.startUpPos = cursor.getBufferPosition();
        min = -1;
        iwin = -1;
        for (i = _i = 0, _ref1 = this.characters.length - 1; 0 <= _ref1 ? _i <= _ref1 : _i >= _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
          matchesCharacter = this.searchFor(cursor, this.characters[i]);
          if (matchesCharacter.length > 0) {
            dst = matchesCharacter[0].range.start.toArray();
            if (this.startUpPos.toArray()[0] === dst[0] && this.startUpPos.toArray()[1] < dst[1]) {
              if (dst[1] < min || min === -1) {
                line = dst[0];
                min = dst[1];
                iwin = i;
              }
            }
          }
        }
        if (iwin !== -1) {
          cursor.setBufferPosition(new Point(line, min));
          this.character = this.characters[iwin];
          this.matching = this.charactersMatching[iwin];
          this.reverse = this.reverseSearch[iwin];
        }
      }
      matchesCharacter = this.searchFor(cursor, this.character);
      matchesMatching = this.searchFor(cursor, this.matching);
      if (matchesMatching.length === 0) {
        this.matches = [];
      } else {
        charIndex = 0;
        matchIndex = 0;
        counter = 1;
        winner = -1;
        if (this.reverse) {
          compVal = 1;
        } else {
          compVal = -1;
        }
        while (counter > 0) {
          if (matchIndex < matchesMatching.length && charIndex < matchesCharacter.length) {
            if (matchesCharacter[charIndex].range.compare(matchesMatching[matchIndex].range) === compVal) {
              counter = counter + 1;
              charIndex = charIndex + 1;
            } else {
              counter = counter - 1;
              winner = matchIndex;
              matchIndex = matchIndex + 1;
            }
          } else if (matchIndex < matchesMatching.length) {
            counter = counter - 1;
            winner = matchIndex;
            matchIndex = matchIndex + 1;
          } else {
            break;
          }
        }
        retVal = [];
        if (counter === 0) {
          retVal.push(matchesMatching[winner]);
        }
        this.matches = retVal;
      }
      if (this.matches.length === 0 && this.startUp) {
        return cursor.setBufferPosition(this.startUpPos);
      }
    };

    BracketMatchingMotion.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      if (this.input.characters.length > 0) {
        return BracketMatchingMotion.__super__.execute.call(this, count);
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDRIQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQUFKLENBQUE7O0FBQUEsRUFDQyxrQkFBbUIsT0FBQSxDQUFRLG1CQUFSLEVBQW5CLGVBREQsQ0FBQTs7QUFBQSxFQUVBLGVBQUEsR0FBa0IsT0FBQSxDQUFRLGtDQUFSLENBRmxCLENBQUE7O0FBQUEsRUFHQyxRQUFTLE9BQUEsQ0FBUSwyQkFBUixFQUFULEtBSEQsQ0FBQTs7QUFBQSxFQUlBLE9BQWlCLE9BQUEsQ0FBUSxNQUFSLENBQWpCLEVBQUMsYUFBQSxLQUFELEVBQVEsYUFBQSxLQUpSLENBQUE7O0FBQUEsRUFNTTtBQUNKLGlDQUFBLENBQUE7O0FBQUEseUJBQUEsbUJBQUEsR0FBcUIsS0FBckIsQ0FBQTs7QUFBQSxJQUNBLFVBQUMsQ0FBQSxhQUFELEdBQWdCLElBRGhCLENBQUE7O0FBR2EsSUFBQSxvQkFBRSxNQUFGLEVBQVcsUUFBWCxHQUFBO0FBQ1gsTUFEWSxJQUFDLENBQUEsU0FBQSxNQUNiLENBQUE7QUFBQSxNQURxQixJQUFDLENBQUEsV0FBQSxRQUN0QixDQUFBO0FBQUEsaURBQUEsQ0FBQTtBQUFBLDZDQUFBLENBQUE7QUFBQSxNQUFBLDRDQUFNLElBQUMsQ0FBQSxNQUFQLEVBQWUsSUFBQyxDQUFBLFFBQWhCLENBQUEsQ0FBQTtBQUFBLE1BQ0EsTUFBTSxDQUFDLGFBQVAsR0FBdUIsSUFEdkIsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxJQUFDLENBQUEsaUJBQUQsR0FBcUIsS0FGaEMsQ0FEVztJQUFBLENBSGI7O0FBQUEseUJBUUEsTUFBQSxHQUFRLFNBQUMsSUFBRCxHQUFBO0FBQ04sVUFBQSxPQUFBOztRQURPLE9BQU87T0FDZDtB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
//# sourceURL=/Users/ah/.atom/packages/vim-mode/lib/motions/search-motion.coffee