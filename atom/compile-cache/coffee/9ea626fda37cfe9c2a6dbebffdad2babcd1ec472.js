(function() {
  var ShowTodoView, path;

  path = require('path');

  ShowTodoView = require('../lib/show-todo-view');

  describe('ShowTodoView fetching logic and data handling', function() {
    var showTodoView;
    showTodoView = null;
    beforeEach(function() {
      var pathname;
      pathname = 'dummyData';
      showTodoView = new ShowTodoView(pathname);
      showTodoView.matches = [];
      return atom.project.setPaths([path.join(__dirname, 'fixtures/sample1')]);
    });
    describe('buildRegexLookups(regexes)', function() {
      it('should return an array of objects (title, regex, results) when passed an array of regexes (and titles)', function() {
        var findTheseRegexes, lookups, regexes;
        findTheseRegexes = ['TODOs', '/TODO:?(.+$)/g'];
        regexes = showTodoView.buildRegexLookups(findTheseRegexes);
        lookups = [
          {
            title: 'TODOs',
            regex: '/TODO:?(.+$)/g'
          }
        ];
        return expect(regexes).toEqual(lookups);
      });
      return it('should work with a lot of regexes', function() {
        var findTheseRegexes, lookups, regexes;
        findTheseRegexes = ['FIXMEs', '/FIXME:?(.+$)/g', 'TODOs', '/TODO:?(.+$)/g', 'CHANGEDs', '/CHANGED:?(.+$)/g', 'XXXs', '/XXX:?(.+$)/g'];
        regexes = showTodoView.buildRegexLookups(findTheseRegexes);
        lookups = [
          {
            title: 'FIXMEs',
            regex: '/FIXME:?(.+$)/g'
          }, {
            title: 'TODOs',
            regex: '/TODO:?(.+$)/g'
          }, {
            title: 'CHANGEDs',
            regex: '/CHANGED:?(.+$)/g'
          }, {
            title: 'XXXs',
            regex: '/XXX:?(.+$)/g'
          }
        ];
        return expect(regexes).toEqual(lookups);
      });
    });
    describe('makeRegexObj(regexStr)', function() {
      it('should return a RegExp obj when passed a regex literal (string)', function() {
        var regexObj, regexStr;
        regexStr = '/TODO:?(.+$)/g';
        regexObj = showTodoView.makeRegexObj(regexStr);
        expect(typeof regexObj.test).toBe('function');
        return expect(typeof regexObj.exec).toBe('function');
      });
      return it('should return false bool when passed an invalid regex literal (string)', function() {
        var regexObj, regexStr;
        regexStr = 'arstastTODO:.+$)/g';
        regexObj = showTodoView.makeRegexObj(regexStr);
        return expect(regexObj).toBe(false);
      });
    });
    describe('handleScanMatch(match, regex)', function() {
      var match, regex, _ref;
      _ref = [], match = _ref.match, regex = _ref.regex;
      beforeEach(function() {
        regex = /\b@?TODO:?\s(.+$)/g;
        return match = {
          path: "" + (atom.project.getPaths()[0]) + "/sample.c",
          matchText: ' TODO: Comment in C ',
          range: [[0, 1], [0, 20]]
        };
      });
      it('should handle results from workspace scan (also tested in fetchRegexItem)', function() {
        var output;
        output = showTodoView.handleScanMatch(match);
        return expect(output.matchText).toEqual('TODO: Comment in C');
      });
      it('should remove regex part', function() {
        var output;
        output = showTodoView.handleScanMatch(match, regex);
        return expect(output.matchText).toEqual('Comment in C');
      });
      return it('should serialize range and relativize path', function() {
        var output;
        output = showTodoView.handleScanMatch(match, regex);
        expect(output.relativePath).toEqual('sample.c');
        return expect(output.rangeString).toEqual('0,1,0,20');
      });
    });
    describe('fetchRegexItem(lookupObj)', function() {
      var todoLookup;
      todoLookup = [];
      beforeEach(function() {
        return todoLookup = {
          title: 'TODOs',
          regex: '/\\b@?TODO:?\\s(.+$)/g'
        };
      });
      it('should scan the workspace for the regex that is passed and fill lookup results', function() {
        waitsForPromise(function() {
          return showTodoView.fetchRegexItem(todoLookup);
        });
        return runs(function() {
          expect(showTodoView.matches).toHaveLength(3);
          expect(showTodoView.matches[0].matchText).toBe('Comment in C');
          expect(showTodoView.matches[1].matchText).toBe('This is the first todo');
          return expect(showTodoView.matches[2].matchText).toBe('This is the second todo');
        });
      });
      it('should respect ignored paths', function() {
        atom.config.set('todo-show.ignoreThesePaths', '*/sample.js');
        waitsForPromise(function() {
          return showTodoView.fetchRegexItem(todoLookup);
        });
        return runs(function() {
          expect(showTodoView.matches).toHaveLength(1);
          return expect(showTodoView.matches[0].matchText).toBe('Comment in C');
        });
      });
      it('should handle other regexes', function() {
        var lookup;
        lookup = {
          title: 'Includes',
          regex: '/#include(.+)/g'
        };
        waitsForPromise(function() {
          return showTodoView.fetchRegexItem(lookup);
        });
        return runs(function() {
          expect(showTodoView.matches).toHaveLength(1);
          return expect(showTodoView.matches[0].matchText).toBe('<stdio.h>');
        });
      });
      it('should handle special character regexes', function() {
        var lookup;
        lookup = {
          title: 'Todos',
          regex: '/ This is the (?:first|second) todo/g'
        };
        waitsForPromise(function() {
          return showTodoView.fetchRegexItem(lookup);
        });
        return runs(function() {
          expect(showTodoView.matches).toHaveLength(2);
          expect(showTodoView.matches[0].matchText).toBe('This is the first todo');
          return expect(showTodoView.matches[1].matchText).toBe('This is the second todo');
        });
      });
      it('should handle regex without capture group', function() {
        var lookup;
        lookup = {
          title: 'This is Code',
          regex: '/[\\w\\s]+code[\\w\\s]*/g'
        };
        waitsForPromise(function() {
          return showTodoView.fetchRegexItem(lookup);
        });
        return runs(function() {
          expect(showTodoView.matches).toHaveLength(1);
          return expect(showTodoView.matches[0].matchText).toBe('Sample quicksort code');
        });
      });
      it('should handle post-annotations with special regex', function() {
        var lookup;
        lookup = {
          title: 'Pre-DEBUG',
          regex: '/(.+).{3}DEBUG\\s*$/g'
        };
        waitsForPromise(function() {
          return showTodoView.fetchRegexItem(lookup);
        });
        return runs(function() {
          expect(showTodoView.matches).toHaveLength(1);
          return expect(showTodoView.matches[0].matchText).toBe('return sort(Array.apply(this, arguments));');
        });
      });
      it('should handle post-annotations with non-capturing group', function() {
        var lookup;
        lookup = {
          title: 'Pre-DEBUG',
          regex: '/(.+?(?=.{3}DEBUG\\s*$))/'
        };
        waitsForPromise(function() {
          return showTodoView.fetchRegexItem(lookup);
        });
        return runs(function() {
          expect(showTodoView.matches).toHaveLength(1);
          return expect(showTodoView.matches[0].matchText).toBe('return sort(Array.apply(this, arguments));');
        });
      });
      it('should truncate matches longer than the defined max length of 120', function() {
        var lookup;
        lookup = {
          title: 'Long Annotation',
          regex: '/LOONG:?(.+$)/g'
        };
        waitsForPromise(function() {
          return showTodoView.fetchRegexItem(lookup);
        });
        return runs(function() {
          var matchText, matchText2;
          matchText = 'Lorem ipsum dolor sit amet, dapibus rhoncus. Scelerisque quam,';
          matchText += ' id ante molestias, ipsum lorem magnis et. A eleifend i...';
          matchText2 = '_SpgLE84Ms1K4DSumtJDoNn8ZECZLL+VR0DoGydy54vUoSpgLE84Ms1K4DSum';
          matchText2 += 'tJDoNn8ZECZLLVR0DoGydy54vUonRClXwLbFhX2gMwZgjx250ay+V0lF...';
          expect(showTodoView.matches[0].matchText).toHaveLength(120);
          expect(showTodoView.matches[0].matchText).toBe(matchText);
          expect(showTodoView.matches[1].matchText).toHaveLength(120);
          return expect(showTodoView.matches[1].matchText).toBe(matchText2);
        });
      });
      return it('should strip common block comment endings', function() {
        atom.project.setPaths([path.join(__dirname, 'fixtures/sample2')]);
        waitsForPromise(function() {
          return showTodoView.fetchRegexItem(todoLookup);
        });
        return runs(function() {
          expect(showTodoView.matches).toHaveLength(6);
          expect(showTodoView.matches[0].matchText).toBe('C block comment');
          expect(showTodoView.matches[1].matchText).toBe('HTML comment');
          expect(showTodoView.matches[2].matchText).toBe('PowerShell comment');
          expect(showTodoView.matches[3].matchText).toBe('Haskell comment');
          expect(showTodoView.matches[4].matchText).toBe('Lua comment');
          return expect(showTodoView.matches[5].matchText).toBe('PHP comment');
        });
      });
    });
    describe('fetchOpenRegexItem(lookupObj)', function() {
      var todoLookup;
      todoLookup = [];
      beforeEach(function() {
        todoLookup = {
          title: 'TODOs',
          regex: '/\\b@?TODO:?\\s(.+$)/g'
        };
        return waitsForPromise(function() {
          return atom.workspace.open('sample.c');
        });
      });
      it('should scan open files for the regex that is passed and fill lookup results', function() {
        waitsForPromise(function() {
          return showTodoView.fetchOpenRegexItem(todoLookup);
        });
        return runs(function() {
          expect(showTodoView.matches).toHaveLength(1);
          expect(showTodoView.matches.length).toBe(1);
          return expect(showTodoView.matches[0].matchText).toBe('Comment in C');
        });
      });
      return it('should work with files outside of workspace', function() {
        waitsForPromise(function() {
          return atom.workspace.open('../sample2/sample.txt');
        });
        return runs(function() {
          waitsForPromise(function() {
            return showTodoView.fetchOpenRegexItem(todoLookup);
          });
          return runs(function() {
            expect(showTodoView.matches).toHaveLength(7);
            expect(showTodoView.matches[0].matchText).toBe('Comment in C');
            expect(showTodoView.matches[1].matchText).toBe('C block comment');
            return expect(showTodoView.matches[6].matchText).toBe('PHP comment');
          });
        });
      });
    });
    return describe('getMarkdown()', function() {
      var matches;
      matches = [];
      beforeEach(function() {
        atom.config.set('todo-show.findTheseRegexes', ['FIXMEs', '/\\b@?FIXME:?\\s(.+$)/g', 'TODOs', '/\\b@?TODO:?\\s(.+$)/g']);
        return matches = [
          {
            matchText: 'fixme #1',
            relativePath: 'file1.txt',
            title: 'FIXMEs',
            range: [[3, 6], [3, 10]]
          }, {
            matchText: 'todo #1',
            relativePath: 'file1.txt',
            title: 'TODOs',
            range: [[4, 5], [4, 9]]
          }, {
            matchText: 'fixme #2',
            relativePath: 'file2.txt',
            title: 'FIXMEs',
            range: [[5, 7], [5, 11]]
          }
        ];
      });
      it('creates a markdown string from regexes', function() {
        var markdown;
        markdown = '\n## FIXMEs\n\n- fixme #1 `file1.txt` `:4`\n- fixme #2 `file2.txt` `:6`\n';
        markdown += '\n## TODOs\n\n- todo #1 `file1.txt` `:5`\n';
        return expect(showTodoView.getMarkdown(matches)).toEqual(markdown);
      });
      it('creates markdown with file grouping', function() {
        var markdown;
        atom.config.set('todo-show.groupMatchesBy', 'file');
        markdown = '\n## file1.txt\n\n- fixme #1 `FIXMEs`\n- todo #1 `TODOs`\n';
        markdown += '\n## file2.txt\n\n- fixme #2 `FIXMEs`\n';
        return expect(showTodoView.getMarkdown(matches)).toEqual(markdown);
      });
      it('creates markdown with non grouping', function() {
        var markdown;
        atom.config.set('todo-show.groupMatchesBy', 'none');
        markdown = '\n## All Matches\n\n- fixme #1 _(FIXMEs)_ `file1.txt` `:4`';
        markdown += '\n- fixme #2 _(FIXMEs)_ `file2.txt` `:6`\n- todo #1 _(TODOs)_ `file1.txt` `:5`\n';
        return expect(showTodoView.getMarkdown(matches)).toEqual(markdown);
      });
      it('accepts missing ranges and paths in regexes', function() {
        var markdown;
        matches = [
          {
            matchText: 'fixme #1',
            title: 'FIXMEs'
          }
        ];
        markdown = '\n## FIXMEs\n\n- fixme #1\n';
        expect(showTodoView.getMarkdown(matches)).toEqual(markdown);
        atom.config.set('todo-show.groupMatchesBy', 'file');
        markdown = '\n## Unknown File\n\n- fixme #1 `FIXMEs`\n';
        expect(showTodoView.getMarkdown(matches)).toEqual(markdown);
        atom.config.set('todo-show.groupMatchesBy', 'none');
        markdown = '\n## All Matches\n\n- fixme #1 _(FIXMEs)_\n';
        return expect(showTodoView.getMarkdown(matches)).toEqual(markdown);
      });
      return it('accepts missing title in regexes', function() {
        var markdown;
        matches = [
          {
            matchText: 'fixme #1',
            relativePath: 'file1.txt'
          }
        ];
        markdown = '\n## No Title\n\n- fixme #1 `file1.txt`\n';
        expect(showTodoView.getMarkdown(matches)).toEqual(markdown);
        atom.config.set('todo-show.groupMatchesBy', 'file');
        markdown = '\n## file1.txt\n\n- fixme #1\n';
        expect(showTodoView.getMarkdown(matches)).toEqual(markdown);
        atom.config.set('todo-show.groupMatchesBy', 'none');
        markdown = '\n## All Matches\n\n- fixme #1 `file1.txt`\n';
        return expect(showTodoView.getMarkdown(matches)).toEqual(markdown);
      });
    });
  });

}).call(this);
