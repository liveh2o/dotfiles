(function() {
  var $$, BracketMatchingMotion, Input, MotionWithInput, Point, Range, Search, SearchBase, SearchCurrentWord, SearchViewModel, _, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('underscore-plus');

  MotionWithInput = require('./general-motions').MotionWithInput;

  SearchViewModel = require('../view-models/search-view-model');

  Input = require('../view-models/view-model').Input;

  _ref = require('atom'), $$ = _ref.$$, Point = _ref.Point, Range = _ref.Range;

  SearchBase = (function(_super) {
    __extends(SearchBase, _super);

    SearchBase.currentSearch = null;

    function SearchBase(editorView, vimState) {
      this.editorView = editorView;
      this.vimState = vimState;
      this.reversed = __bind(this.reversed, this);
      this.repeat = __bind(this.repeat, this);
      SearchBase.__super__.constructor.call(this, this.editorView, this.vimState);
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

    SearchBase.prototype.execute = function(count) {
      if (count == null) {
        count = 1;
      }
      this.scan();
      return this.match(count, (function(_this) {
        return function(pos) {
          return _this.editor.setCursorBufferPosition(pos.range.start);
        };
      })(this));
    };

    SearchBase.prototype.select = function(count) {
      var selectionStart;
      if (count == null) {
        count = 1;
      }
      this.scan();
      selectionStart = this.getSelectionStart();
      this.match(count, (function(_this) {
        return function(pos) {
          var reversed;
          reversed = selectionStart.compare(pos.range.start) > 0;
          return _this.editor.setSelectedBufferRange([selectionStart, pos.range.start], {
            reversed: reversed
          });
        };
      })(this));
      return [true];
    };

    SearchBase.prototype.getSelectionStart = function() {
      var cur, end, start, _ref1;
      cur = this.editor.getCursorBufferPosition();
      _ref1 = this.editor.getSelectedBufferRange(), start = _ref1.start, end = _ref1.end;
      if (start.compare(cur) === 0) {
        return end;
      } else {
        return start;
      }
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

    SearchBase.prototype.scan = function() {
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
      cur = this.editor.getCursorBufferPosition();
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

    function Search(editorView, vimState) {
      this.editorView = editorView;
      this.vimState = vimState;
      Search.__super__.constructor.call(this, this.editorView, this.vimState);
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

    function SearchCurrentWord(editorView, vimState) {
      var defaultIsKeyword, userIsKeyword;
      this.editorView = editorView;
      this.vimState = vimState;
      SearchCurrentWord.__super__.constructor.call(this, this.editorView, this.vimState);
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
        if (this.cursorIsOnEOF()) {
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

    SearchCurrentWord.prototype.cursorIsOnEOF = function() {
      var cursor, eofPos, pos;
      cursor = this.editor.getLastCursor();
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

    BracketMatchingMotion.keywordRegex = null;

    function BracketMatchingMotion(editorView, vimState) {
      this.editorView = editorView;
      this.vimState = vimState;
      BracketMatchingMotion.__super__.constructor.call(this, this.editorView, this.vimState);
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

    BracketMatchingMotion.prototype.searchFor = function(character) {
      var after, cur, iterator, matchPoints, matches, previous, regexp, term;
      term = character;
      regexp = new RegExp(_.escapeRegExp(term), 'g');
      cur = this.editor.getCursorBufferPosition();
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

    BracketMatchingMotion.prototype.select = function(count) {
      var cur;
      if (count == null) {
        count = 1;
      }
      this.scan();
      cur = this.startUp ? this.startUpPos : this.editor.getCursorBufferPosition();
      this.match(count, (function(_this) {
        return function(pos) {
          var tempPoint;
          if (_this.reverse) {
            tempPoint = cur.toArray();
            return _this.editor.setSelectedBufferRange([pos.range.start, new Point(tempPoint[0], tempPoint[1] + 1)], {
              reversed: true
            });
          } else {
            tempPoint = pos.range.start.toArray();
            return _this.editor.setSelectedBufferRange([cur, new Point(tempPoint[0], tempPoint[1] + 1)], {
              reversed: true
            });
          }
        };
      })(this));
      return [true];
    };

    BracketMatchingMotion.prototype.scan = function() {
      var charIndex, compVal, counter, dst, i, iwin, line, matchIndex, matchesCharacter, matchesMatching, min, retVal, winner, _i, _ref1;
      if (this.startUp) {
        this.startUpPos = this.editor.getCursorBufferPosition();
        min = -1;
        iwin = -1;
        for (i = _i = 0, _ref1 = this.characters.length - 1; 0 <= _ref1 ? _i <= _ref1 : _i >= _ref1; i = 0 <= _ref1 ? ++_i : --_i) {
          matchesCharacter = this.searchFor(this.characters[i]);
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
          this.editor.setCursorBufferPosition(new Point(line, min));
          this.character = this.characters[iwin];
          this.matching = this.charactersMatching[iwin];
          this.reverse = this.reverseSearch[iwin];
        }
      }
      matchesCharacter = this.searchFor(this.character);
      matchesMatching = this.searchFor(this.matching);
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
        return this.editor.setCursorBufferPosition(this.startUpPos);
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdJQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQUFKLENBQUE7O0FBQUEsRUFDQyxrQkFBbUIsT0FBQSxDQUFRLG1CQUFSLEVBQW5CLGVBREQsQ0FBQTs7QUFBQSxFQUVBLGVBQUEsR0FBa0IsT0FBQSxDQUFRLGtDQUFSLENBRmxCLENBQUE7O0FBQUEsRUFHQyxRQUFTLE9BQUEsQ0FBUSwyQkFBUixFQUFULEtBSEQsQ0FBQTs7QUFBQSxFQUlBLE9BQXFCLE9BQUEsQ0FBUSxNQUFSLENBQXJCLEVBQUMsVUFBQSxFQUFELEVBQUssYUFBQSxLQUFMLEVBQVksYUFBQSxLQUpaLENBQUE7O0FBQUEsRUFNTTtBQUNKLGlDQUFBLENBQUE7O0FBQUEsSUFBQSxVQUFDLENBQUEsYUFBRCxHQUFnQixJQUFoQixDQUFBOztBQUNhLElBQUEsb0JBQUUsVUFBRixFQUFlLFFBQWYsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLGFBQUEsVUFDYixDQUFBO0FBQUEsTUFEeUIsSUFBQyxDQUFBLFdBQUEsUUFDMUIsQ0FBQTtBQUFBLGlEQUFBLENBQUE7QUFBQSw2Q0FBQSxDQUFBO0FBQUEsTUFBQSw0Q0FBTSxJQUFDLENBQUEsVUFBUCxFQUFtQixJQUFDLENBQUEsUUFBcEIsQ0FBQSxDQUFBO0FBQUEsTUFDQSxNQUFNLENBQUMsYUFBUCxHQUF1QixJQUR2QixDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsT0FBRCxHQUFXLElBQUMsQ0FBQSxpQkFBRCxHQUFxQixLQUZoQyxDQURXO0lBQUEsQ0FEYjs7QUFBQSx5QkFNQSxNQUFBLEdBQVEsU0FBQyxJQUFELEdBQUE7QUFDTixVQUFBLE9BQUE7O1FBRE8sT0FBTztPQUNkO0FBQUEsTUFBQSxPQUFBLEdBQVUsSUFBSSxDQUFDLFNBQWYsQ0FBQTtBQUNBLE1BQUEsSUFBRyxJQUFDLENBQUEsaUJBQUQsSUFBdUIsT0FBMUI7QUFDRSxRQUFBLElBQUMsQ0FBQSxPQUFELEdBQVcsS0FBWCxDQURGO09BQUEsTUFBQTtBQUdFLFFBQUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxPQUFBLElBQVcsSUFBQyxDQUFBLGlCQUF2QixDQUhGO09BREE7YUFLQSxLQU5NO0lBQUEsQ0FOUixDQUFBOztBQUFBLHlCQWNBLFFBQUEsR0FBVSxTQUFBLEdBQUE7QUFDUixNQUFBLElBQUMsQ0FBQSxpQkFBRCxHQUFxQixJQUFDLENBQUEsT0FBRCxHQUFXLElBQWhDLENBQUE7YUFDQSxLQUZRO0lBQUEsQ0FkVixDQUFBOztBQUFBLHlCQWtCQSxPQUFBLEdBQVMsU0FBQyxLQUFELEdBQUE7O1FBQUMsUUFBTTtPQUNkO0FBQUEsTUFBQSxJQUFDLENBQUEsSUFBRCxDQUFBLENBQUEsQ0FBQTthQUNBLElBQUMsQ0FBQSxLQUFELENBQU8sS0FBUCxFQUFjLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLEdBQUQsR0FBQTtpQkFDWixLQUFDLENBQUEsTUFBTSxDQUFDLHVCQUFSLENBQWdDLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBMUMsRUFEWTtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWQsRUFGTztJQUFBLENBbEJULENBQUE7O0FBQUEseUJBdUJBLE1BQUEsR0FBUSxTQUFDLEtBQUQsR0FBQTtBQUNOLFVBQUEsY0FBQTs7UUFETyxRQUFNO09BQ2I7QUFBQSxNQUFBLElBQUMsQ0FBQSxJQUFELENBQUEsQ0FBQSxDQUFBO0FBQUEsTUFDQSxjQUFBLEdBQWlCLElBQUMsQ0FBQSxpQkFBRCxDQUFBLENBRGpCLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxLQUFELENBQU8sS0FBUCxFQUFjLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLEdBQUQsR0FBQTtBQUNaLGNBQUEsUUFBQTtBQUFBLFVBQUEsUUFBQSxHQUFXLGNBQWMsQ0FBQyxPQUFmLENBQXVCLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBakMsQ0FBQSxHQUEwQyxDQUFyRCxDQUFBO2lCQUNBLEtBQUMsQ0FBQSxNQUFNLENBQUMsc0JBQVIsQ0FBK0IsQ0FBQyxjQUFELEVBQWlCLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBM0IsQ0FBL0IsRUFBa0U7QUFBQSxZQUFDLFVBQUEsUUFBRDtXQUFsRSxFQUZZO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBZCxDQUZBLENBQUE7YUFLQSxDQUFDLElBQUQsRUFOTTtJQUFBLENBdkJSLENBQUE7O0FBQUEseUJBK0JBLGlCQUFBLEdBQW1CLFNBQUEsR0FBQTtBQUNqQixVQUFBLHNCQUFBO0FBQUEsTUFBQSxHQUFBLEdBQU0sSUFBQyxDQUFBLE1BQU0sQ0FBQyx1QkFBUixDQUFBLENBQU4sQ0FBQTtBQUFBLE1BQ0EsUUFBZSxJQUFDLENBQUEsTUFBTSxDQUFDLHNCQUFSLENBQUEsQ0FBZixFQUFDLGNBQUEsS0FBRCxFQUFRLFlBQUEsR0FEUixDQUFBO0FBRUEsTUFBQSxJQUFHLEtBQUssQ0FBQyxPQUFOLENBQWMsR0FBZCxDQUFBLEtBQXNCLENBQXpCO2VBQWdDLElBQWhDO09BQUEsTUFBQTtlQUF5QyxNQUF6QztPQUhpQjtJQUFBLENBL0JuQixDQUFBOztBQUFBLHlCQW9DQSxLQUFBLEdBQU8sU0FBQyxLQUFELEVBQVEsUUFBUixHQUFBO0FBQ0wsVUFBQSxHQUFBO0FBQUEsTUFBQSxHQUFBLEdBQU0sSUFBQyxDQUFBLE9BQVEsQ0FBQSxDQUFDLEtBQUEsR0FBUSxDQUFULENBQUEsR0FBYyxJQUFDLENBQUEsT0FBTyxDQUFDLE1BQXZCLENBQWYsQ0FBQTtBQUNBLE1BQUEsSUFBRyxXQUFIO2VBQ0UsUUFBQSxDQUFTLEdBQVQsRUFERjtPQUFBLE1BQUE7ZUFHRSxJQUFJLENBQUMsSUFBTCxDQUFBLEVBSEY7T0FGSztJQUFBLENBcENQLENBQUE7O0FBQUEseUJBMkNBLElBQUEsR0FBTSxTQUFBLEdBQUE7QUFDSixVQUFBLHdGQUFBO0FBQUEsTUFBQSxRQUFBLEdBQVcsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsUUFBRCxHQUFBO0FBQ1QsVUFBQSxJQUFHLEdBQUcsQ0FBQyxPQUFKLENBQVksUUFBWixDQUFBLEtBQXlCLENBQUEsQ0FBNUI7QUFDRSxtQkFBTyxHQUFBLElBQU8sUUFBZCxDQURGO1dBQUEsTUFBQTtBQUFBO1dBRFM7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFYLENBQUE7QUFBQSxNQUlBLElBQUEsR0FBTyxJQUFDLENBQUEsS0FBSyxDQUFDLFVBSmQsQ0FBQTtBQUFBLE1BS0EsR0FBQSxHQUFNLEVBTE4sQ0FBQTtBQUFBLE1BTUEsUUFBQSxDQUFTLEdBQVQsQ0FOQSxDQUFBO0FBQUEsTUFPQSxjQUFBLEdBQWlCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixnQ0FBaEIsQ0FQakIsQ0FBQTtBQVFBLE1BQUEsSUFBRyxjQUFBLElBQWtCLENBQUEsSUFBSyxDQUFDLEtBQUwsQ0FBVyxPQUFYLENBQXRCO0FBQ0UsUUFBQSxRQUFBLENBQVMsR0FBVCxDQUFBLENBREY7T0FSQTtBQVVBLE1BQUEsSUFBRyxJQUFJLENBQUMsT0FBTCxDQUFhLEtBQWIsQ0FBQSxLQUF1QixDQUFBLENBQTFCO0FBQ0UsUUFBQSxJQUFBLEdBQU8sSUFBSSxDQUFDLE9BQUwsQ0FBYSxLQUFiLEVBQW1CLEVBQW5CLENBQVAsQ0FBQTtBQUFBLFFBQ0EsUUFBQSxDQUFTLEdBQVQsQ0FEQSxDQURGO09BVkE7QUFBQSxNQWFBLE1BQUE7QUFDRTtpQkFDTSxJQUFBLE1BQUEsQ0FBTyxJQUFQLEVBQWEsR0FBYixFQUROO1NBQUEsY0FBQTtpQkFHTSxJQUFBLE1BQUEsQ0FBTyxDQUFDLENBQUMsWUFBRixDQUFlLElBQWYsQ0FBUCxFQUE2QixHQUE3QixFQUhOOztVQWRGLENBQUE7QUFBQSxNQW1CQSxHQUFBLEdBQU0sSUFBQyxDQUFBLE1BQU0sQ0FBQyx1QkFBUixDQUFBLENBbkJOLENBQUE7QUFBQSxNQW9CQSxXQUFBLEdBQWMsRUFwQmQsQ0FBQTtBQUFBLE1BcUJBLFFBQUEsR0FBVyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxJQUFELEdBQUE7QUFDVCxjQUFBLGNBQUE7QUFBQSxVQUFBLGNBQUEsR0FDRTtBQUFBLFlBQUEsS0FBQSxFQUFPLElBQUksQ0FBQyxLQUFaO1dBREYsQ0FBQTtpQkFFQSxXQUFXLENBQUMsSUFBWixDQUFpQixjQUFqQixFQUhTO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FyQlgsQ0FBQTtBQUFBLE1BMEJBLElBQUMsQ0FBQSxNQUFNLENBQUMsSUFBUixDQUFhLE1BQWIsRUFBcUIsUUFBckIsQ0ExQkEsQ0FBQTtBQUFBLE1BNEJBLFFBQUEsR0FBVyxDQUFDLENBQUMsTUFBRixDQUFTLFdBQVQsRUFBc0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsS0FBRCxHQUFBO0FBQy9CLFVBQUEsSUFBRyxLQUFDLENBQUEsT0FBSjttQkFDRSxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFsQixDQUEwQixHQUExQixDQUFBLEdBQWlDLEVBRG5DO1dBQUEsTUFBQTttQkFHRSxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFsQixDQUEwQixHQUExQixDQUFBLElBQWtDLEVBSHBDO1dBRCtCO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBdEIsQ0E1QlgsQ0FBQTtBQUFBLE1Ba0NBLEtBQUEsR0FBUSxDQUFDLENBQUMsVUFBRixDQUFhLFdBQWIsRUFBMEIsUUFBMUIsQ0FsQ1IsQ0FBQTtBQUFBLE1BbUNBLEtBQUssQ0FBQyxJQUFOLGNBQVcsUUFBWCxDQW5DQSxDQUFBO0FBb0NBLE1BQUEsSUFBMkIsSUFBQyxDQUFBLE9BQTVCO0FBQUEsUUFBQSxLQUFBLEdBQVEsS0FBSyxDQUFDLE9BQU4sQ0FBQSxDQUFSLENBQUE7T0FwQ0E7YUFzQ0EsSUFBQyxDQUFBLE9BQUQsR0FBVyxNQXZDUDtJQUFBLENBM0NOLENBQUE7O3NCQUFBOztLQUR1QixnQkFOekIsQ0FBQTs7QUFBQSxFQTJGTTtBQUNKLDZCQUFBLENBQUE7O0FBQWEsSUFBQSxnQkFBRSxVQUFGLEVBQWUsUUFBZixHQUFBO0FBQ1gsTUFEWSxJQUFDLENBQUEsYUFBQSxVQUNiLENBQUE7QUFBQSxNQUR5QixJQUFDLENBQUEsV0FBQSxRQUMxQixDQUFBO0FBQUEsTUFBQSx3Q0FBTSxJQUFDLENBQUEsVUFBUCxFQUFtQixJQUFDLENBQUEsUUFBcEIsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsU0FBRCxHQUFpQixJQUFBLGVBQUEsQ0FBZ0IsSUFBaEIsQ0FEakIsQ0FBQTtBQUFBLE1BRUEsTUFBTSxDQUFDLGFBQVAsR0FBdUIsSUFGdkIsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLE9BQUQsR0FBVyxJQUFDLENBQUEsaUJBQUQsR0FBcUIsS0FIaEMsQ0FEVztJQUFBLENBQWI7O0FBQUEscUJBTUEsT0FBQSxHQUFTLFNBQUMsS0FBRCxHQUFBO0FBQ1AsTUFBQSxvQ0FBTSxLQUFOLENBQUEsQ0FBQTthQUNBLElBQUMsQ0FBQSxTQUFTLENBQUMsS0FBWCxHQUFtQixJQUFDLENBQUEsS0FBSyxDQUFDLFdBRm5CO0lBQUEsQ0FOVCxDQUFBOztrQkFBQTs7S0FEbUIsV0EzRnJCLENBQUE7O0FBQUEsRUFzR007QUFDSix3Q0FBQSxDQUFBOztBQUFBLElBQUEsaUJBQUMsQ0FBQSxZQUFELEdBQWUsSUFBZixDQUFBOztBQUNhLElBQUEsMkJBQUUsVUFBRixFQUFlLFFBQWYsR0FBQTtBQUNYLFVBQUEsK0JBQUE7QUFBQSxNQURZLElBQUMsQ0FBQSxhQUFBLFVBQ2IsQ0FBQTtBQUFBLE1BRHlCLElBQUMsQ0FBQSxXQUFBLFFBQzFCLENBQUE7QUFBQSxNQUFBLG1EQUFNLElBQUMsQ0FBQSxVQUFQLEVBQW1CLElBQUMsQ0FBQSxRQUFwQixDQUFBLENBQUE7QUFBQSxNQUNBLE1BQU0sQ0FBQyxhQUFQLEdBQXVCLElBRHZCLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxPQUFELEdBQVcsSUFBQyxDQUFBLGlCQUFELEdBQXFCLEtBRmhDLENBQUE7QUFBQSxNQUtBLGdCQUFBLEdBQW1CLGtCQUxuQixDQUFBO0FBQUEsTUFNQSxhQUFBLEdBQWdCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixvQkFBaEIsQ0FOaEIsQ0FBQTtBQUFBLE1BT0EsSUFBQyxDQUFBLFlBQUQsR0FBb0IsSUFBQSxNQUFBLENBQU8sYUFBQSxJQUFpQixnQkFBeEIsQ0FQcEIsQ0FBQTtBQUFBLE1BU0EsSUFBQyxDQUFBLEtBQUQsR0FBYSxJQUFBLEtBQUEsQ0FBTSxJQUFDLENBQUEsbUJBQUQsQ0FBQSxDQUFOLENBVGIsQ0FEVztJQUFBLENBRGI7O0FBQUEsZ0NBYUEsY0FBQSxHQUFnQixTQUFDLFdBQUQsR0FBQTtBQUNkLFVBQUEsNkJBQUE7O1FBRGUsY0FBWTtPQUMzQjtBQUFBLE1BQUEsTUFBQSxHQUFTLElBQUMsQ0FBQSxNQUFNLENBQUMsYUFBUixDQUFBLENBQVQsQ0FBQTtBQUFBLE1BQ0EsU0FBQSxHQUFhLE1BQU0sQ0FBQyx5QkFBUCxDQUFpQztBQUFBLFFBQUEsU0FBQSxFQUFXLElBQUMsQ0FBQSxZQUFaO09BQWpDLENBRGIsQ0FBQTtBQUFBLE1BRUEsVUFBQSxHQUFhLElBQUMsQ0FBQSxNQUFNLENBQUMsb0JBQVIsQ0FBNkIsU0FBN0IsQ0FGYixDQUFBO0FBTUEsTUFBQSxJQUFHLFVBQVUsQ0FBQyxNQUFYLEtBQXFCLENBQXJCLElBQTJCLENBQUEsV0FBOUI7QUFDRSxRQUFBLElBQUcsSUFBQyxDQUFBLGFBQUQsQ0FBQSxDQUFIO2lCQUNFLEdBREY7U0FBQSxNQUFBO0FBR0UsVUFBQSxNQUFNLENBQUMsc0JBQVAsQ0FBOEI7QUFBQSxZQUFBLFNBQUEsRUFBVyxJQUFDLENBQUEsWUFBWjtXQUE5QixDQUFBLENBQUE7aUJBQ0EsSUFBQyxDQUFBLGNBQUQsQ0FBZ0IsSUFBaEIsRUFKRjtTQURGO09BQUEsTUFBQTtlQU9FLFdBUEY7T0FQYztJQUFBLENBYmhCLENBQUE7O0FBQUEsZ0NBNkJBLGFBQUEsR0FBZSxTQUFBLEdBQUE7QUFDYixVQUFBLG1CQUFBO0FBQUEsTUFBQSxNQUFBLEdBQVMsSUFBQyxDQUFBLE1BQU0sQ0FBQyxhQUFSLENBQUEsQ0FBVCxDQUFBO0FBQUEsTUFDQSxHQUFBLEdBQU0sTUFBTSxDQUFDLGlDQUFQLENBQXlDO0FBQUEsUUFBQSxTQUFBLEVBQVcsSUFBQyxDQUFBLFlBQVo7T0FBekMsQ0FETixDQUFBO0FBQUEsTUFFQSxNQUFBLEdBQVMsSUFBQyxDQUFBLE1BQU0sQ0FBQyxvQkFBUixDQUFBLENBRlQsQ0FBQTthQUdBLEdBQUcsQ0FBQyxHQUFKLEtBQVcsTUFBTSxDQUFDLEdBQWxCLElBQXlCLEdBQUcsQ0FBQyxNQUFKLEtBQWMsTUFBTSxDQUFDLE9BSmpDO0lBQUEsQ0E3QmYsQ0FBQTs7QUFBQSxnQ0FtQ0EsbUJBQUEsR0FBcUIsU0FBQSxHQUFBO0FBQ25CLFVBQUEsVUFBQTtBQUFBLE1BQUEsVUFBQSxHQUFhLElBQUMsQ0FBQSxjQUFELENBQUEsQ0FBYixDQUFBO0FBQ0EsTUFBQSxJQUFHLFVBQVUsQ0FBQyxNQUFYLEdBQW9CLENBQXZCO0FBQ0UsUUFBQSxJQUFHLElBQUksQ0FBQyxJQUFMLENBQVUsVUFBVixDQUFIO2lCQUE4QixFQUFBLEdBQUUsVUFBRixHQUFjLE1BQTVDO1NBQUEsTUFBQTtpQkFBdUQsS0FBQSxHQUFJLFVBQUosR0FBZ0IsTUFBdkU7U0FERjtPQUFBLE1BQUE7ZUFHRSxXQUhGO09BRm1CO0lBQUEsQ0FuQ3JCLENBQUE7O0FBQUEsZ0NBMENBLFVBQUEsR0FBWSxTQUFBLEdBQUE7YUFBRyxLQUFIO0lBQUEsQ0ExQ1osQ0FBQTs7QUFBQSxnQ0E0Q0EsT0FBQSxHQUFTLFNBQUMsS0FBRCxHQUFBOztRQUFDLFFBQU07T0FDZDtBQUFBLE1BQUEsSUFBZ0IsSUFBQyxDQUFBLEtBQUssQ0FBQyxVQUFVLENBQUMsTUFBbEIsR0FBMkIsQ0FBM0M7ZUFBQSwrQ0FBTSxLQUFOLEVBQUE7T0FETztJQUFBLENBNUNULENBQUE7OzZCQUFBOztLQUQ4QixXQXRHaEMsQ0FBQTs7QUFBQSxFQXVKTTtBQUNKLDRDQUFBLENBQUE7O0FBQUEsSUFBQSxxQkFBQyxDQUFBLFlBQUQsR0FBZSxJQUFmLENBQUE7O0FBQ2EsSUFBQSwrQkFBRSxVQUFGLEVBQWUsUUFBZixHQUFBO0FBQ1gsTUFEWSxJQUFDLENBQUEsYUFBQSxVQUNiLENBQUE7QUFBQSxNQUR5QixJQUFDLENBQUEsV0FBQSxRQUMxQixDQUFBO0FBQUEsTUFBQSx1REFBTSxJQUFDLENBQUEsVUFBUCxFQUFtQixJQUFDLENBQUEsUUFBcEIsQ0FBQSxDQUFBO0FBQUEsTUFDQSxNQUFNLENBQUMsYUFBUCxHQUF1QixJQUR2QixDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsT0FBRCxHQUFXLElBQUMsQ0FBQSxpQkFBRCxHQUFxQixLQUZoQyxDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsVUFBRCxHQUFzQixDQUFDLEdBQUQsRUFBSyxHQUFMLEVBQVMsR0FBVCxFQUFhLEdBQWIsRUFBaUIsR0FBakIsRUFBcUIsR0FBckIsQ0FIdEIsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLGtCQUFELEdBQXNCLENBQUMsR0FBRCxFQUFLLEdBQUwsRUFBUyxHQUFULEVBQWEsR0FBYixFQUFpQixHQUFqQixFQUFxQixHQUFyQixDQUp0QixDQUFBO0FBQUEsTUFLQSxJQUFDLENBQUEsYUFBRCxHQUFzQixDQUFDLElBQUQsRUFBTSxLQUFOLEVBQVksSUFBWixFQUFpQixLQUFqQixFQUF1QixJQUF2QixFQUE0QixLQUE1QixDQUx0QixDQUFBO0FBQUEsTUFRQSxJQUFDLENBQUEsS0FBRCxHQUFhLElBQUEsS0FBQSxDQUFNLElBQUMsQ0FBQSxtQkFBRCxDQUFBLENBQU4sQ0FSYixDQURXO0lBQUEsQ0FEYjs7QUFBQSxvQ0FZQSxjQUFBLEdBQWdCLFNBQUMsV0FBRCxHQUFBO0FBQ2QsVUFBQSx3QkFBQTs7UUFEZSxjQUFZO09BQzNCO0FBQUEsTUFBQSxNQUFBLEdBQVMsSUFBQyxDQUFBLE1BQU0sQ0FBQyxhQUFSLENBQUEsQ0FBVCxDQUFBO0FBQUEsTUFDQSxTQUFBLEdBQVksTUFBTSxDQUFDLGlCQUFQLENBQUEsQ0FBMEIsQ0FBQyxPQUEzQixDQUFBLENBRFosQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLFNBQUQsR0FBYSxJQUFDLENBQUEsTUFBTSxDQUFDLG9CQUFSLENBQTZCLENBQUMsTUFBTSxDQUFDLGlCQUFQLENBQUEsQ0FBRCxFQUFnQyxJQUFBLEtBQUEsQ0FBTSxTQUFVLENBQUEsQ0FBQSxDQUFoQixFQUFtQixTQUFVLENBQUEsQ0FBQSxDQUFWLEdBQWUsQ0FBbEMsQ0FBaEMsQ0FBN0IsQ0FGYixDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsT0FBRCxHQUFXLEtBSFgsQ0FBQTtBQUFBLE1BSUEsS0FBQSxHQUFRLElBQUMsQ0FBQSxVQUFVLENBQUMsT0FBWixDQUFvQixJQUFDLENBQUEsU0FBckIsQ0FKUixDQUFBO0FBS0EsTUFBQSxJQUFHLEtBQUEsSUFBUyxDQUFaO0FBQ0UsUUFBQSxJQUFDLENBQUEsUUFBRCxHQUFZLElBQUMsQ0FBQSxrQkFBbUIsQ0FBQSxLQUFBLENBQWhDLENBQUE7QUFBQSxRQUNBLElBQUMsQ0FBQSxPQUFELEdBQVcsSUFBQyxDQUFBLGFBQWMsQ0FBQSxLQUFBLENBRDFCLENBREY7T0FBQSxNQUFBO0FBSUUsUUFBQSxJQUFDLENBQUEsT0FBRCxHQUFXLElBQVgsQ0FKRjtPQUxBO2FBV0EsSUFBQyxDQUFBLFVBWmE7SUFBQSxDQVpoQixDQUFBOztBQUFBLG9DQTBCQSxtQkFBQSxHQUFxQixTQUFBLEdBQUE7QUFDbkIsVUFBQSxVQUFBO0FBQUEsTUFBQSxVQUFBLEdBQWEsSUFBQyxDQUFBLGNBQUQsQ0FBQSxDQUFiLENBQUE7YUFDQSxXQUZtQjtJQUFBLENBMUJyQixDQUFBOztBQUFBLG9DQThCQSxVQUFBLEdBQVksU0FBQSxHQUFBO2FBQUcsS0FBSDtJQUFBLENBOUJaLENBQUE7O0FBQUEsb0NBZ0NBLFNBQUEsR0FBVSxTQUFDLFNBQUQsR0FBQTtBQUNSLFVBQUEsa0VBQUE7QUFBQSxNQUFBLElBQUEsR0FBTyxTQUFQLENBQUE7QUFBQSxNQUNBLE1BQUEsR0FDUSxJQUFBLE1BQUEsQ0FBTyxDQUFDLENBQUMsWUFBRixDQUFlLElBQWYsQ0FBUCxFQUE2QixHQUE3QixDQUZSLENBQUE7QUFBQSxNQUlBLEdBQUEsR0FBTSxJQUFDLENBQUEsTUFBTSxDQUFDLHVCQUFSLENBQUEsQ0FKTixDQUFBO0FBQUEsTUFLQSxXQUFBLEdBQWMsRUFMZCxDQUFBO0FBQUEsTUFNQSxRQUFBLEdBQVcsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsSUFBRCxHQUFBO0FBQ1QsY0FBQSxjQUFBO0FBQUEsVUFBQSxjQUFBLEdBQ0U7QUFBQSxZQUFBLEtBQUEsRUFBTyxJQUFJLENBQUMsS0FBWjtXQURGLENBQUE7aUJBRUEsV0FBVyxDQUFDLElBQVosQ0FBaUIsY0FBakIsRUFIUztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBTlgsQ0FBQTtBQUFBLE1BV0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxJQUFSLENBQWEsTUFBYixFQUFxQixRQUFyQixDQVhBLENBQUE7QUFBQSxNQWFBLFFBQUEsR0FBVyxDQUFDLENBQUMsTUFBRixDQUFTLFdBQVQsRUFBc0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsS0FBRCxHQUFBO0FBQy9CLFVBQUEsSUFBRyxLQUFDLENBQUEsT0FBSjttQkFDRSxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFsQixDQUEwQixHQUExQixDQUFBLEdBQWlDLEVBRG5DO1dBQUEsTUFBQTttQkFHRSxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFsQixDQUEwQixHQUExQixDQUFBLElBQWtDLEVBSHBDO1dBRCtCO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBdEIsQ0FiWCxDQUFBO0FBbUJBLE1BQUEsSUFBRyxJQUFDLENBQUEsT0FBSjtBQUNFLFFBQUEsS0FBQSxHQUFRLEVBQVIsQ0FBQTtBQUFBLFFBQ0EsS0FBSyxDQUFDLElBQU4sY0FBVyxRQUFYLENBREEsQ0FBQTtBQUFBLFFBRUEsS0FBQSxHQUFRLEtBQUssQ0FBQyxPQUFOLENBQUEsQ0FGUixDQURGO09BQUEsTUFBQTtBQUtFLFFBQUEsS0FBQSxHQUFRLENBQUMsQ0FBQyxVQUFGLENBQWEsV0FBYixFQUEwQixRQUExQixDQUFSLENBTEY7T0FuQkE7QUFBQSxNQTBCQSxPQUFBLEdBQVUsS0ExQlYsQ0FBQTthQTJCQSxRQTVCUTtJQUFBLENBaENWLENBQUE7O0FBQUEsb0NBOERBLE1BQUEsR0FBUSxTQUFDLEtBQUQsR0FBQTtBQUNOLFVBQUEsR0FBQTs7UUFETyxRQUFNO09BQ2I7QUFBQSxNQUFBLElBQUMsQ0FBQSxJQUFELENBQUEsQ0FBQSxDQUFBO0FBQUEsTUFFQSxHQUFBLEdBQVMsSUFBQyxDQUFBLE9BQUosR0FBaUIsSUFBQyxDQUFBLFVBQWxCLEdBQWtDLElBQUMsQ0FBQSxNQUFNLENBQUMsdUJBQVIsQ0FBQSxDQUZ4QyxDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsS0FBRCxDQUFPLEtBQVAsRUFBYyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxHQUFELEdBQUE7QUFDWixjQUFBLFNBQUE7QUFBQSxVQUFBLElBQUcsS0FBQyxDQUFBLE9BQUo7QUFDRSxZQUFBLFNBQUEsR0FBWSxHQUFHLENBQUMsT0FBSixDQUFBLENBQVosQ0FBQTttQkFDQSxLQUFDLENBQUEsTUFBTSxDQUFDLHNCQUFSLENBQStCLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFYLEVBQXNCLElBQUEsS0FBQSxDQUFNLFNBQVUsQ0FBQSxDQUFBLENBQWhCLEVBQW1CLFNBQVUsQ0FBQSxDQUFBLENBQVYsR0FBZSxDQUFsQyxDQUF0QixDQUEvQixFQUE0RjtBQUFBLGNBQUMsUUFBQSxFQUFVLElBQVg7YUFBNUYsRUFGRjtXQUFBLE1BQUE7QUFJRSxZQUFBLFNBQUEsR0FBWSxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFoQixDQUFBLENBQVosQ0FBQTttQkFDQSxLQUFDLENBQUEsTUFBTSxDQUFDLHNCQUFSLENBQStCLENBQUUsR0FBRixFQUFXLElBQUEsS0FBQSxDQUFNLFNBQVUsQ0FBQSxDQUFBLENBQWhCLEVBQW1CLFNBQVUsQ0FBQSxDQUFBLENBQVYsR0FBZSxDQUFsQyxDQUFYLENBQS9CLEVBQWlGO0FBQUEsY0FBQyxRQUFBLEVBQVUsSUFBWDthQUFqRixFQUxGO1dBRFk7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFkLENBSkEsQ0FBQTthQVdBLENBQUMsSUFBRCxFQVpNO0lBQUEsQ0E5RFIsQ0FBQTs7QUFBQSxvQ0E0RUEsSUFBQSxHQUFNLFNBQUEsR0FBQTtBQUNKLFVBQUEsOEhBQUE7QUFBQSxNQUFBLElBQUcsSUFBQyxDQUFBLE9BQUo7QUFDRSxRQUFBLElBQUMsQ0FBQSxVQUFELEdBQWMsSUFBQyxDQUFBLE1BQU0sQ0FBQyx1QkFBUixDQUFBLENBQWQsQ0FBQTtBQUFBLFFBQ0EsR0FBQSxHQUFNLENBQUEsQ0FETixDQUFBO0FBQUEsUUFFQSxJQUFBLEdBQU8sQ0FBQSxDQUZQLENBQUE7QUFHQSxhQUFTLG9IQUFULEdBQUE7QUFDRSxVQUFBLGdCQUFBLEdBQW1CLElBQUMsQ0FBQSxTQUFELENBQVcsSUFBQyxDQUFBLFVBQVcsQ0FBQSxDQUFBLENBQXZCLENBQW5CLENBQUE7QUFDQSxVQUFBLElBQUcsZ0JBQWdCLENBQUMsTUFBakIsR0FBMEIsQ0FBN0I7QUFDRSxZQUFBLEdBQUEsR0FBTSxnQkFBaUIsQ0FBQSxDQUFBLENBQUUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQWhDLENBQUEsQ0FBTixDQUFBO0FBQ0EsWUFBQSxJQUFHLElBQUMsQ0FBQSxVQUFVLENBQUMsT0FBWixDQUFBLENBQXNCLENBQUEsQ0FBQSxDQUF0QixLQUE0QixHQUFJLENBQUEsQ0FBQSxDQUFoQyxJQUF1QyxJQUFDLENBQUEsVUFBVSxDQUFDLE9BQVosQ0FBQSxDQUFzQixDQUFBLENBQUEsQ0FBdEIsR0FBMkIsR0FBSSxDQUFBLENBQUEsQ0FBekU7QUFDRSxjQUFBLElBQUcsR0FBSSxDQUFBLENBQUEsQ0FBSixHQUFTLEdBQVQsSUFBZ0IsR0FBQSxLQUFPLENBQUEsQ0FBMUI7QUFDRSxnQkFBQSxJQUFBLEdBQU8sR0FBSSxDQUFBLENBQUEsQ0FBWCxDQUFBO0FBQUEsZ0JBQ0EsR0FBQSxHQUFNLEdBQUksQ0FBQSxDQUFBLENBRFYsQ0FBQTtBQUFBLGdCQUVBLElBQUEsR0FBTyxDQUZQLENBREY7ZUFERjthQUZGO1dBRkY7QUFBQSxTQUhBO0FBWUEsUUFBQSxJQUFHLElBQUEsS0FBUSxDQUFBLENBQVg7QUFDRSxVQUFBLElBQUMsQ0FBQSxNQUFNLENBQUMsdUJBQVIsQ0FBb0MsSUFBQSxLQUFBLENBQU0sSUFBTixFQUFXLEdBQVgsQ0FBcEMsQ0FBQSxDQUFBO0FBQUEsVUFDQSxJQUFDLENBQUEsU0FBRCxHQUFhLElBQUMsQ0FBQSxVQUFXLENBQUEsSUFBQSxDQUR6QixDQUFBO0FBQUEsVUFFQSxJQUFDLENBQUEsUUFBRCxHQUFZLElBQUMsQ0FBQSxrQkFBbUIsQ0FBQSxJQUFBLENBRmhDLENBQUE7QUFBQSxVQUdBLElBQUMsQ0FBQSxPQUFELEdBQVcsSUFBQyxDQUFBLGFBQWMsQ0FBQSxJQUFBLENBSDFCLENBREY7U0FiRjtPQUFBO0FBQUEsTUFtQkEsZ0JBQUEsR0FBbUIsSUFBQyxDQUFBLFNBQUQsQ0FBVyxJQUFDLENBQUEsU0FBWixDQW5CbkIsQ0FBQTtBQUFBLE1Bb0JBLGVBQUEsR0FBa0IsSUFBQyxDQUFBLFNBQUQsQ0FBVyxJQUFDLENBQUEsUUFBWixDQXBCbEIsQ0FBQTtBQXFCQSxNQUFBLElBQUcsZUFBZSxDQUFDLE1BQWhCLEtBQTBCLENBQTdCO0FBQ0UsUUFBQSxJQUFDLENBQUEsT0FBRCxHQUFXLEVBQVgsQ0FERjtPQUFBLE1BQUE7QUFHRSxRQUFBLFNBQUEsR0FBWSxDQUFaLENBQUE7QUFBQSxRQUNBLFVBQUEsR0FBYSxDQURiLENBQUE7QUFBQSxRQUVBLE9BQUEsR0FBVSxDQUZWLENBQUE7QUFBQSxRQUdBLE1BQUEsR0FBUyxDQUFBLENBSFQsQ0FBQTtBQUlBLFFBQUEsSUFBRyxJQUFDLENBQUEsT0FBSjtBQUNFLFVBQUEsT0FBQSxHQUFVLENBQVYsQ0FERjtTQUFBLE1BQUE7QUFHRSxVQUFBLE9BQUEsR0FBVSxDQUFBLENBQVYsQ0FIRjtTQUpBO0FBUUEsZUFBTSxPQUFBLEdBQVUsQ0FBaEIsR0FBQTtBQUNFLFVBQUEsSUFBRyxVQUFBLEdBQWEsZUFBZSxDQUFDLE1BQTdCLElBQXdDLFNBQUEsR0FBWSxnQkFBZ0IsQ0FBQyxNQUF4RTtBQUNFLFlBQUEsSUFBRyxnQkFBaUIsQ0FBQSxTQUFBLENBQVUsQ0FBQyxLQUFLLENBQUMsT0FBbEMsQ0FBMEMsZUFBZ0IsQ0FBQSxVQUFBLENBQVcsQ0FBQyxLQUF0RSxDQUFBLEtBQWdGLE9BQW5GO0FBQ0UsY0FBQSxPQUFBLEdBQVUsT0FBQSxHQUFVLENBQXBCLENBQUE7QUFBQSxjQUNBLFNBQUEsR0FBWSxTQUFBLEdBQVksQ0FEeEIsQ0FERjthQUFBLE1BQUE7QUFJRSxjQUFBLE9BQUEsR0FBVSxPQUFBLEdBQVUsQ0FBcEIsQ0FBQTtBQUFBLGNBQ0EsTUFBQSxHQUFTLFVBRFQsQ0FBQTtBQUFBLGNBRUEsVUFBQSxHQUFhLFVBQUEsR0FBYSxDQUYxQixDQUpGO2FBREY7V0FBQSxNQVFLLElBQUcsVUFBQSxHQUFhLGVBQWUsQ0FBQyxNQUFoQztBQUNILFlBQUEsT0FBQSxHQUFVLE9BQUEsR0FBVSxDQUFwQixDQUFBO0FBQUEsWUFDQSxNQUFBLEdBQVMsVUFEVCxDQUFBO0FBQUEsWUFFQSxVQUFBLEdBQWEsVUFBQSxHQUFhLENBRjFCLENBREc7V0FBQSxNQUFBO0FBS0gsa0JBTEc7V0FUUDtRQUFBLENBUkE7QUFBQSxRQXdCQSxNQUFBLEdBQVMsRUF4QlQsQ0FBQTtBQXlCQSxRQUFBLElBQUcsT0FBQSxLQUFXLENBQWQ7QUFDRSxVQUFBLE1BQU0sQ0FBQyxJQUFQLENBQVksZUFBZ0IsQ0FBQSxNQUFBLENBQTVCLENBQUEsQ0FERjtTQXpCQTtBQUFBLFFBMkJBLElBQUMsQ0FBQSxPQUFELEdBQVcsTUEzQlgsQ0FIRjtPQXJCQTtBQXFEQSxNQUFBLElBQUcsSUFBQyxDQUFBLE9BQU8sQ0FBQyxNQUFULEtBQW1CLENBQW5CLElBQXlCLElBQUMsQ0FBQSxPQUE3QjtlQUNFLElBQUMsQ0FBQSxNQUFNLENBQUMsdUJBQVIsQ0FBZ0MsSUFBQyxDQUFBLFVBQWpDLEVBREY7T0F0REk7SUFBQSxDQTVFTixDQUFBOztBQUFBLG9DQXVJQSxPQUFBLEdBQVMsU0FBQyxLQUFELEdBQUE7O1FBQUMsUUFBTTtPQUNkO0FBQUEsTUFBQSxJQUFnQixJQUFDLENBQUEsS0FBSyxDQUFDLFVBQVUsQ0FBQyxNQUFsQixHQUEyQixDQUEzQztlQUFBLG1EQUFNLEtBQU4sRUFBQTtPQURPO0lBQUEsQ0F2SVQsQ0FBQTs7aUNBQUE7O0tBRGtDLFdBdkpwQyxDQUFBOztBQUFBLEVBa1NBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0FBQUEsSUFBQyxRQUFBLE1BQUQ7QUFBQSxJQUFTLG1CQUFBLGlCQUFUO0FBQUEsSUFBMkIsdUJBQUEscUJBQTNCO0dBbFNqQixDQUFBO0FBQUEiCn0=
//# sourceURL=/Users/ah/.atom/packages/vim-mode/lib/motions/search-motion.coffee