(function() {
  var ShowTodoView, path;

  path = require('path');

  ShowTodoView = require('../lib/show-todo-view');

  describe('ShowTodoView fetching logic and data handling', function() {
    var defaultLookup, defaultRegexes, showTodoView, _ref;
    _ref = [], showTodoView = _ref[0], defaultRegexes = _ref[1], defaultLookup = _ref[2];
    beforeEach(function() {
      defaultRegexes = ['FIXMEs', '/\\bFIXME:?\\d*($|\\s.*$)/g', 'TODOs', '/\\bTODO:?\\d*($|\\s.*$)/g'];
      defaultLookup = {
        title: defaultRegexes[2],
        regex: defaultRegexes[3]
      };
      showTodoView = new ShowTodoView('dummyPath');
      return atom.project.setPaths([path.join(__dirname, 'fixtures/sample1')]);
    });
    describe('buildRegexLookups(regexes)', function() {
      it('returns an array of lookup objects when passed an array of regexes', function() {
        var lookups1, lookups2;
        lookups1 = showTodoView.buildRegexLookups(defaultRegexes);
        lookups2 = [
          {
            title: defaultRegexes[0],
            regex: defaultRegexes[1]
          }, {
            title: defaultRegexes[2],
            regex: defaultRegexes[3]
          }
        ];
        return expect(lookups1).toEqual(lookups2);
      });
      return it('handles invalid input', function() {
        var lookups, notification, notificationSpy, regexes;
        atom.notifications.onDidAddNotification(notificationSpy = jasmine.createSpy());
        regexes = ['TODO'];
        lookups = showTodoView.buildRegexLookups(regexes);
        expect(lookups).toHaveLength(0);
        notification = notificationSpy.mostRecentCall.args[0];
        expect(notificationSpy).toHaveBeenCalled();
        return expect(notification.getType()).toBe('error');
      });
    });
    describe('makeRegexObj(regexStr)', function() {
      it('returns a RegExp obj when passed a regex literal (string)', function() {
        var regexObj, regexStr;
        regexStr = defaultLookup.regex;
        regexObj = showTodoView.makeRegexObj(regexStr);
        expect(typeof regexObj.test).toBe('function');
        return expect(typeof regexObj.exec).toBe('function');
      });
      it('returns false and shows notification on invalid input', function() {
        var notification, notificationSpy, regexObj, regexStr;
        atom.notifications.onDidAddNotification(notificationSpy = jasmine.createSpy());
        regexStr = 'arstastTODO:.+$)/g';
        regexObj = showTodoView.makeRegexObj(regexStr);
        expect(regexObj).toBe(false);
        notification = notificationSpy.mostRecentCall.args[0];
        expect(notificationSpy).toHaveBeenCalled();
        return expect(notification.getType()).toBe('error');
      });
      return it('handles empty input', function() {
        var regexObj;
        regexObj = showTodoView.makeRegexObj();
        return expect(regexObj).toBe(false);
      });
    });
    describe('handleScanMatch(match, regex)', function() {
      var match, regex, _ref1;
      _ref1 = [], match = _ref1.match, regex = _ref1.regex;
      beforeEach(function() {
        regex = /\b@?TODO:?\d*($|\s.*$)/g;
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
      it('should scan the workspace for the regex that is passed and fill lookup results', function() {
        waitsForPromise(function() {
          return showTodoView.fetchRegexItem(defaultLookup);
        });
        return runs(function() {
          expect(showTodoView.matches).toHaveLength(3);
          expect(showTodoView.matches[0].matchText).toBe('Comment in C');
          expect(showTodoView.matches[1].matchText).toBe('This is the first todo');
          return expect(showTodoView.matches[2].matchText).toBe('This is the second todo');
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
          return showTodoView.fetchRegexItem(defaultLookup);
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
    describe('ignore path rules', function() {
      it('works with no paths added', function() {
        atom.config.set('todo-show.ignoreThesePaths', []);
        waitsForPromise(function() {
          return showTodoView.fetchRegexItem(defaultLookup);
        });
        return runs(function() {
          return expect(showTodoView.matches).toHaveLength(3);
        });
      });
      it('must be an array', function() {
        var notificationSpy;
        atom.notifications.onDidAddNotification(notificationSpy = jasmine.createSpy());
        atom.config.set('todo-show.ignoreThesePaths', '123');
        waitsForPromise(function() {
          return showTodoView.fetchRegexItem(defaultLookup);
        });
        return runs(function() {
          var notification;
          expect(showTodoView.matches).toHaveLength(3);
          notification = notificationSpy.mostRecentCall.args[0];
          expect(notificationSpy).toHaveBeenCalled();
          return expect(notification.getType()).toBe('error');
        });
      });
      it('respects ignored files', function() {
        atom.config.set('todo-show.ignoreThesePaths', ['sample.js']);
        waitsForPromise(function() {
          return showTodoView.fetchRegexItem(defaultLookup);
        });
        return runs(function() {
          expect(showTodoView.matches).toHaveLength(1);
          return expect(showTodoView.matches[0].matchText).toBe('Comment in C');
        });
      });
      it('respects ignored directories and filetypes', function() {
        atom.project.setPaths([path.join(__dirname, 'fixtures')]);
        atom.config.set('todo-show.ignoreThesePaths', ['sample1', '*.md']);
        waitsForPromise(function() {
          return showTodoView.fetchRegexItem(defaultLookup);
        });
        return runs(function() {
          expect(showTodoView.matches).toHaveLength(6);
          return expect(showTodoView.matches[0].matchText).toBe('C block comment');
        });
      });
      it('respects ignored wildcard directories', function() {
        atom.project.setPaths([path.join(__dirname, 'fixtures')]);
        atom.config.set('todo-show.ignoreThesePaths', ['**/sample.js', '**/sample.txt', '*.md']);
        waitsForPromise(function() {
          return showTodoView.fetchRegexItem(defaultLookup);
        });
        return runs(function() {
          expect(showTodoView.matches).toHaveLength(1);
          return expect(showTodoView.matches[0].matchText).toBe('Comment in C');
        });
      });
      return it('respects more advanced ignores', function() {
        atom.project.setPaths([path.join(__dirname, 'fixtures')]);
        atom.config.set('todo-show.ignoreThesePaths', ['output(-grouped)?\\.*', '*1/**']);
        waitsForPromise(function() {
          return showTodoView.fetchRegexItem(defaultLookup);
        });
        return runs(function() {
          expect(showTodoView.matches).toHaveLength(6);
          return expect(showTodoView.matches[0].matchText).toBe('C block comment');
        });
      });
    });
    describe('fetchOpenRegexItem(lookupObj)', function() {
      var editor;
      editor = null;
      beforeEach(function() {
        waitsForPromise(function() {
          return atom.workspace.open('sample.c');
        });
        return runs(function() {
          return editor = atom.workspace.getActiveTextEditor();
        });
      });
      it('scans open files for the regex that is passed and fill lookup results', function() {
        waitsForPromise(function() {
          return showTodoView.fetchOpenRegexItem(defaultLookup);
        });
        return runs(function() {
          expect(showTodoView.matches).toHaveLength(1);
          expect(showTodoView.matches.length).toBe(1);
          return expect(showTodoView.matches[0].matchText).toBe('Comment in C');
        });
      });
      it('works with files outside of workspace', function() {
        waitsForPromise(function() {
          return atom.workspace.open('../sample2/sample.txt');
        });
        return runs(function() {
          waitsForPromise(function() {
            return showTodoView.fetchOpenRegexItem(defaultLookup);
          });
          return runs(function() {
            expect(showTodoView.matches).toHaveLength(7);
            expect(showTodoView.matches[0].matchText).toBe('Comment in C');
            expect(showTodoView.matches[1].matchText).toBe('C block comment');
            return expect(showTodoView.matches[6].matchText).toBe('PHP comment');
          });
        });
      });
      it('handles unsaved documents', function() {
        editor.setText('TODO: New todo');
        waitsForPromise(function() {
          return showTodoView.fetchOpenRegexItem(defaultLookup);
        });
        return runs(function() {
          expect(showTodoView.matches).toHaveLength(1);
          expect(showTodoView.matches[0].title).toBe('TODOs');
          return expect(showTodoView.matches[0].matchText).toBe('New todo');
        });
      });
      it('respects imdone syntax (https://github.com/imdone/imdone-atom)', function() {
        editor.setText('TODO:10 todo1\nTODO:0 todo2');
        waitsForPromise(function() {
          return showTodoView.fetchOpenRegexItem(defaultLookup);
        });
        return runs(function() {
          expect(showTodoView.matches).toHaveLength(2);
          expect(showTodoView.matches[0].title).toBe('TODOs');
          expect(showTodoView.matches[0].matchText).toBe('todo1');
          return expect(showTodoView.matches[1].matchText).toBe('todo2');
        });
      });
      it('handles number in todo (as long as its not without space)', function() {
        editor.setText("Line 1 //TODO: 1 2 3\nLine 1 // TODO:1 2 3");
        waitsForPromise(function() {
          return showTodoView.fetchOpenRegexItem(defaultLookup);
        });
        return runs(function() {
          expect(showTodoView.matches).toHaveLength(2);
          expect(showTodoView.matches[0].matchText).toBe('1 2 3');
          return expect(showTodoView.matches[1].matchText).toBe('2 3');
        });
      });
      it('handles empty todos', function() {
        editor.setText("Line 1 // TODO\nLine 2 //TODO");
        waitsForPromise(function() {
          return showTodoView.fetchOpenRegexItem(defaultLookup);
        });
        return runs(function() {
          expect(showTodoView.matches).toHaveLength(2);
          expect(showTodoView.matches[0].matchText).toBe('No details');
          return expect(showTodoView.matches[1].matchText).toBe('No details');
        });
      });
      it('handles empty block todos', function() {
        editor.setText("/* TODO */\nLine 2 /* TODO */");
        waitsForPromise(function() {
          return showTodoView.fetchOpenRegexItem(defaultLookup);
        });
        return runs(function() {
          expect(showTodoView.matches).toHaveLength(2);
          expect(showTodoView.matches[0].matchText).toBe('No details');
          return expect(showTodoView.matches[1].matchText).toBe('No details');
        });
      });
      it('handles todos with @ in front', function() {
        editor.setText("Line 1 //@TODO: text\nLine 2 //@TODO: text\nLine 3 @TODO: text");
        waitsForPromise(function() {
          return showTodoView.fetchOpenRegexItem(defaultLookup);
        });
        return runs(function() {
          expect(showTodoView.matches).toHaveLength(3);
          expect(showTodoView.matches[0].matchText).toBe('text');
          expect(showTodoView.matches[1].matchText).toBe('text');
          return expect(showTodoView.matches[2].matchText).toBe('text');
        });
      });
      it('handles tabs in todos', function() {
        editor.setText('Line //TODO:\ttext');
        waitsForPromise(function() {
          return showTodoView.fetchOpenRegexItem(defaultLookup);
        });
        return runs(function() {
          return expect(showTodoView.matches[0].matchText).toBe('text');
        });
      });
      it('handles todo without semicolon', function() {
        editor.setText('A line // TODO text');
        waitsForPromise(function() {
          return showTodoView.fetchOpenRegexItem(defaultLookup);
        });
        return runs(function() {
          return expect(showTodoView.matches[0].matchText).toBe('text');
        });
      });
      it('ignores todos without leading space', function() {
        editor.setText('A line // TODO:text');
        waitsForPromise(function() {
          return showTodoView.fetchOpenRegexItem(defaultLookup);
        });
        return runs(function() {
          return expect(showTodoView.matches).toHaveLength(0);
        });
      });
      it('ignores todo if unwanted chars are present', function() {
        editor.setText('define("_JS_TODO_ALERT_", "js:alert(&quot;TODO&quot;);");');
        waitsForPromise(function() {
          return showTodoView.fetchOpenRegexItem(defaultLookup);
        });
        return runs(function() {
          return expect(showTodoView.matches).toHaveLength(0);
        });
      });
      return it('ignores binary data', function() {
        editor.setText('// TODOe�d��RPPP0�');
        waitsForPromise(function() {
          return showTodoView.fetchOpenRegexItem(defaultLookup);
        });
        return runs(function() {
          return expect(showTodoView.matches).toHaveLength(0);
        });
      });
    });
    return describe('getMarkdown()', function() {
      var matches;
      matches = [];
      beforeEach(function() {
        atom.config.set('todo-show.findTheseRegexes', defaultRegexes);
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RvZG8tc2hvdy9zcGVjL3Nob3ctdG9kby12aWV3LXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtCQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUNBLFlBQUEsR0FBZSxPQUFBLENBQVEsdUJBQVIsQ0FEZixDQUFBOztBQUFBLEVBR0EsUUFBQSxDQUFTLCtDQUFULEVBQTBELFNBQUEsR0FBQTtBQUN4RCxRQUFBLGlEQUFBO0FBQUEsSUFBQSxPQUFnRCxFQUFoRCxFQUFDLHNCQUFELEVBQWUsd0JBQWYsRUFBK0IsdUJBQS9CLENBQUE7QUFBQSxJQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxNQUFBLGNBQUEsR0FBaUIsQ0FDZixRQURlLEVBRWYsNkJBRmUsRUFHZixPQUhlLEVBSWYsNEJBSmUsQ0FBakIsQ0FBQTtBQUFBLE1BTUEsYUFBQSxHQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8sY0FBZSxDQUFBLENBQUEsQ0FBdEI7QUFBQSxRQUNBLEtBQUEsRUFBTyxjQUFlLENBQUEsQ0FBQSxDQUR0QjtPQVBGLENBQUE7QUFBQSxNQVVBLFlBQUEsR0FBbUIsSUFBQSxZQUFBLENBQWEsV0FBYixDQVZuQixDQUFBO2FBV0EsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQXNCLENBQUMsSUFBSSxDQUFDLElBQUwsQ0FBVSxTQUFWLEVBQXFCLGtCQUFyQixDQUFELENBQXRCLEVBWlM7SUFBQSxDQUFYLENBRkEsQ0FBQTtBQUFBLElBZ0JBLFFBQUEsQ0FBUyw0QkFBVCxFQUF1QyxTQUFBLEdBQUE7QUFDckMsTUFBQSxFQUFBLENBQUcsb0VBQUgsRUFBeUUsU0FBQSxHQUFBO0FBQ3ZFLFlBQUEsa0JBQUE7QUFB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

//# sourceURL=/Users/ah/.atom/packages/todo-show/spec/show-todo-view-spec.coffee
