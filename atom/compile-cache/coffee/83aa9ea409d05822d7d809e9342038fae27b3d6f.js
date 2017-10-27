(function() {
  var ShowTodoView, scan_mock;

  ShowTodoView = require('../lib/show-todo-view');

  describe('ShowTodoView fetching logic and data handling', function() {
    var showTodoView;
    showTodoView = null;
    beforeEach(function() {
      var pathname;
      pathname = 'dummyData';
      showTodoView = new ShowTodoView(pathname);
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
            regex: '/TODO:?(.+$)/g',
            results: []
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
            regex: '/FIXME:?(.+$)/g',
            results: []
          }, {
            title: 'TODOs',
            regex: '/TODO:?(.+$)/g',
            results: []
          }, {
            title: 'CHANGEDs',
            regex: '/CHANGED:?(.+$)/g',
            results: []
          }, {
            title: 'XXXs',
            regex: '/XXX:?(.+$)/g',
            results: []
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
    return describe('fetchRegexItem: (lookupObj)', function() {
      var todoLookup;
      todoLookup = [];
      beforeEach(function() {
        return todoLookup = {
          title: 'TODOs',
          regex: '/TODO:?(.+$)/g',
          results: []
        };
      });
      it('should scan the workspace for the regex that is passed and fill lookups results', function() {
        waitsForPromise(function() {
          return showTodoView.fetchRegexItem(todoLookup);
        });
        return runs(function() {
          expect(todoLookup.results.length).toBe(2);
          expect(todoLookup.results[0].matches[0].matchText).toBe('Comment in C');
          expect(todoLookup.results[1].matches[0].matchText).toBe('This is the first todo');
          return expect(todoLookup.results[1].matches[1].matchText).toBe('This is the second todo');
        });
      });
      it('should respect ignored paths', function() {
        atom.config.set('todo-show.ignoreThesePaths', '*/sample.js');
        waitsForPromise(function() {
          return showTodoView.fetchRegexItem(todoLookup);
        });
        return runs(function() {
          expect(todoLookup.results.length).toBe(1);
          return expect(todoLookup.results[0].matches[0].matchText).toBe('Comment in C');
        });
      });
      it('should handle other regexes', function() {
        var lookup;
        lookup = {
          title: 'Includes',
          regex: '/#include(.+)/g',
          results: []
        };
        waitsForPromise(function() {
          return showTodoView.fetchRegexItem(lookup);
        });
        return runs(function() {
          return expect(lookup.results[0].matches[0].matchText).toBe('<stdio.h>');
        });
      });
      it('should handle specieal character regexes', function() {
        var lookup;
        lookup = {
          title: 'Todos',
          regex: '/ This is the (?:first|second) todo/g',
          results: []
        };
        waitsForPromise(function() {
          return showTodoView.fetchRegexItem(lookup);
        });
        return runs(function() {
          expect(lookup.results[0].matches[0].matchText).toBe('This is the first todo');
          return expect(lookup.results[0].matches[1].matchText).toBe('This is the second todo');
        });
      });
      it('should handle regex without capture group', function() {
        var lookup;
        lookup = {
          title: 'This is Code',
          regex: '/[\\w\\s]+code[\\w\\s]*/g',
          results: []
        };
        waitsForPromise(function() {
          return showTodoView.fetchRegexItem(lookup);
        });
        return runs(function() {
          return expect(lookup.results[0].matches[0].matchText).toBe('Sample quicksort code');
        });
      });
      it('should handle post-annotations with special regex', function() {
        var lookup;
        lookup = {
          title: 'Pre-DEBUG',
          regex: '/(.+).{3}DEBUG\\s*$/g',
          results: []
        };
        waitsForPromise(function() {
          return showTodoView.fetchRegexItem(lookup);
        });
        return runs(function() {
          return expect(lookup.results[0].matches[0].matchText).toBe('return sort(Array.apply(this, arguments));');
        });
      });
      it('should handle post-annotations with non-capturing group', function() {
        var lookup;
        lookup = {
          title: 'Pre-DEBUG',
          regex: '/(.+?(?=.{3}DEBUG\\s*$))/',
          results: []
        };
        waitsForPromise(function() {
          return showTodoView.fetchRegexItem(lookup);
        });
        return runs(function() {
          return expect(lookup.results[0].matches[0].matchText).toBe('return sort(Array.apply(this, arguments));');
        });
      });
      it('should truncate matches longer than the defined max length of 120', function() {
        var lookup;
        lookup = {
          title: 'Long Annotation',
          regex: '/LOONG:?(.+$)/g',
          results: []
        };
        waitsForPromise(function() {
          return showTodoView.fetchRegexItem(lookup);
        });
        return runs(function() {
          var matchText;
          matchText = 'Lorem ipsum dolor sit amet, dapibus rhoncus. Scelerisque quam,';
          matchText += ' id ante molestias, ipsum lorem magnis et. A eleifend i...';
          expect(lookup.results[0].matches[0].matchText.length).toBe(120);
          return expect(lookup.results[0].matches[0].matchText).toBe(matchText);
        });
      });
      return it('should strip common block comment endings', function() {
        atom.project.setPaths([path.join(__dirname, 'fixtures/sample2')]);
        waitsForPromise(function() {
          return showTodoView.fetchRegexItem(todoLookup);
        });
        return runs(function() {
          expect(todoLookup.results[0].matches.length).toBe(5);
          expect(todoLookup.results[0].matches[0].matchText).toBe('C block comment');
          expect(todoLookup.results[0].matches[1].matchText).toBe('HTML comment');
          expect(todoLookup.results[0].matches[2].matchText).toBe('PowerShell comment');
          expect(todoLookup.results[0].matches[3].matchText).toBe('Haskell comment');
          return expect(todoLookup.results[0].matches[4].matchText).toBe('Lua comment');
        });
      });
    });
  });

  scan_mock = require('./fixtures/atom_scan_mock_result.json');

}).call(this);
