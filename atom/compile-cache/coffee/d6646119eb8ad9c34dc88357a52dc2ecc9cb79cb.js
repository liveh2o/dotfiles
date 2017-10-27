(function() {
  var TodosModel, path;

  path = require('path');

  TodosModel = require('../lib/todos-model');

  describe('Todos Model', function() {
    var defaultLookup, defaultRegexes, defaultShowInTable, model, _ref;
    _ref = [], model = _ref[0], defaultRegexes = _ref[1], defaultLookup = _ref[2], defaultShowInTable = _ref[3];
    beforeEach(function() {
      defaultRegexes = ['FIXMEs', '/\\bFIXME:?\\d*($|\\s.*$)/g', 'TODOs', '/\\bTODO:?\\d*($|\\s.*$)/g'];
      defaultLookup = {
        title: defaultRegexes[2],
        regex: defaultRegexes[3]
      };
      defaultShowInTable = ['Text', 'Type', 'File'];
      model = new TodosModel;
      return atom.project.setPaths([path.join(__dirname, 'fixtures/sample1')]);
    });
    describe('buildRegexLookups(regexes)', function() {
      it('returns an array of lookup objects when passed an array of regexes', function() {
        var lookups1, lookups2;
        lookups1 = model.buildRegexLookups(defaultRegexes);
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
        model.onDidFailSearch(notificationSpy = jasmine.createSpy());
        regexes = ['TODO'];
        lookups = model.buildRegexLookups(regexes);
        expect(lookups).toHaveLength(0);
        notification = notificationSpy.mostRecentCall.args[0];
        expect(notificationSpy).toHaveBeenCalled();
        return expect(notification.indexOf('Invalid')).not.toBe(-1);
      });
    });
    describe('makeRegexObj(regexStr)', function() {
      it('returns a RegExp obj when passed a regex literal (string)', function() {
        var regexObj, regexStr;
        regexStr = defaultLookup.regex;
        regexObj = model.makeRegexObj(regexStr);
        expect(typeof regexObj.test).toBe('function');
        return expect(typeof regexObj.exec).toBe('function');
      });
      it('returns false and notifies on invalid input', function() {
        var notification, notificationSpy, regexObj, regexStr;
        model.onDidFailSearch(notificationSpy = jasmine.createSpy());
        regexStr = 'arstastTODO:.+$)/g';
        regexObj = model.makeRegexObj(regexStr);
        expect(regexObj).toBe(false);
        notification = notificationSpy.mostRecentCall.args[0];
        expect(notificationSpy).toHaveBeenCalled();
        return expect(notification.indexOf('Invalid')).not.toBe(-1);
      });
      return it('handles empty input', function() {
        var regexObj;
        regexObj = model.makeRegexObj();
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
        output = model.handleScanMatch(match);
        return expect(output.matchText).toEqual('TODO: Comment in C');
      });
      it('should remove regex part', function() {
        var output;
        output = model.handleScanMatch(match, regex);
        return expect(output.matchText).toEqual('Comment in C');
      });
      return it('should serialize range and relativize path', function() {
        var output;
        output = model.handleScanMatch(match, regex);
        expect(output.relativePath).toEqual('sample.c');
        return expect(output.rangeString).toEqual('0,1,0,20');
      });
    });
    describe('fetchRegexItem(lookupObj)', function() {
      it('should scan the workspace for the regex that is passed and fill lookup results', function() {
        waitsForPromise(function() {
          return model.fetchRegexItem(defaultLookup);
        });
        return runs(function() {
          expect(model.todos).toHaveLength(3);
          expect(model.todos[0].matchText).toBe('Comment in C');
          expect(model.todos[1].matchText).toBe('This is the first todo');
          return expect(model.todos[2].matchText).toBe('This is the second todo');
        });
      });
      it('should handle other regexes', function() {
        var lookup;
        lookup = {
          title: 'Includes',
          regex: '/#include(.+)/g'
        };
        waitsForPromise(function() {
          return model.fetchRegexItem(lookup);
        });
        return runs(function() {
          expect(model.todos).toHaveLength(1);
          return expect(model.todos[0].matchText).toBe('<stdio.h>');
        });
      });
      it('should handle special character regexes', function() {
        var lookup;
        lookup = {
          title: 'Todos',
          regex: '/ This is the (?:first|second) todo/g'
        };
        waitsForPromise(function() {
          return model.fetchRegexItem(lookup);
        });
        return runs(function() {
          expect(model.todos).toHaveLength(2);
          expect(model.todos[0].matchText).toBe('This is the first todo');
          return expect(model.todos[1].matchText).toBe('This is the second todo');
        });
      });
      it('should handle regex without capture group', function() {
        var lookup;
        lookup = {
          title: 'This is Code',
          regex: '/[\\w\\s]+code[\\w\\s]*/g'
        };
        waitsForPromise(function() {
          return model.fetchRegexItem(lookup);
        });
        return runs(function() {
          expect(model.todos).toHaveLength(1);
          return expect(model.todos[0].matchText).toBe('Sample quicksort code');
        });
      });
      it('should handle post-annotations with special regex', function() {
        var lookup;
        lookup = {
          title: 'Pre-DEBUG',
          regex: '/(.+).{3}DEBUG\\s*$/g'
        };
        waitsForPromise(function() {
          return model.fetchRegexItem(lookup);
        });
        return runs(function() {
          expect(model.todos).toHaveLength(1);
          return expect(model.todos[0].matchText).toBe('return sort(Array.apply(this, arguments));');
        });
      });
      it('should handle post-annotations with non-capturing group', function() {
        var lookup;
        lookup = {
          title: 'Pre-DEBUG',
          regex: '/(.+?(?=.{3}DEBUG\\s*$))/'
        };
        waitsForPromise(function() {
          return model.fetchRegexItem(lookup);
        });
        return runs(function() {
          expect(model.todos).toHaveLength(1);
          return expect(model.todos[0].matchText).toBe('return sort(Array.apply(this, arguments));');
        });
      });
      it('should truncate todos longer than the defined max length of 120', function() {
        var lookup;
        lookup = {
          title: 'Long Annotation',
          regex: '/LOONG:?(.+$)/g'
        };
        waitsForPromise(function() {
          return model.fetchRegexItem(lookup);
        });
        return runs(function() {
          var matchText, matchText2;
          matchText = 'Lorem ipsum dolor sit amet, dapibus rhoncus. Scelerisque quam,';
          matchText += ' id ante molestias, ipsum lorem magnis et. A eleifend i...';
          matchText2 = '_SpgLE84Ms1K4DSumtJDoNn8ZECZLL+VR0DoGydy54vUoSpgLE84Ms1K4DSum';
          matchText2 += 'tJDoNn8ZECZLLVR0DoGydy54vUonRClXwLbFhX2gMwZgjx250ay+V0lF...';
          expect(model.todos[0].matchText).toHaveLength(120);
          expect(model.todos[0].matchText).toBe(matchText);
          expect(model.todos[1].matchText).toHaveLength(120);
          return expect(model.todos[1].matchText).toBe(matchText2);
        });
      });
      return it('should strip common block comment endings', function() {
        atom.project.setPaths([path.join(__dirname, 'fixtures/sample2')]);
        waitsForPromise(function() {
          return model.fetchRegexItem(defaultLookup);
        });
        return runs(function() {
          expect(model.todos).toHaveLength(6);
          expect(model.todos[0].matchText).toBe('C block comment');
          expect(model.todos[1].matchText).toBe('HTML comment');
          expect(model.todos[2].matchText).toBe('PowerShell comment');
          expect(model.todos[3].matchText).toBe('Haskell comment');
          expect(model.todos[4].matchText).toBe('Lua comment');
          return expect(model.todos[5].matchText).toBe('PHP comment');
        });
      });
    });
    describe('ignore path rules', function() {
      it('works with no paths added', function() {
        atom.config.set('todo-show.ignoreThesePaths', []);
        waitsForPromise(function() {
          return model.fetchRegexItem(defaultLookup);
        });
        return runs(function() {
          return expect(model.todos).toHaveLength(3);
        });
      });
      it('must be an array', function() {
        var notificationSpy;
        model.onDidFailSearch(notificationSpy = jasmine.createSpy());
        atom.config.set('todo-show.ignoreThesePaths', '123');
        waitsForPromise(function() {
          return model.fetchRegexItem(defaultLookup);
        });
        return runs(function() {
          var notification;
          expect(model.todos).toHaveLength(3);
          notification = notificationSpy.mostRecentCall.args[0];
          expect(notificationSpy).toHaveBeenCalled();
          return expect(notification.indexOf('ignoreThesePaths')).not.toBe(-1);
        });
      });
      it('respects ignored files', function() {
        atom.config.set('todo-show.ignoreThesePaths', ['sample.js']);
        waitsForPromise(function() {
          return model.fetchRegexItem(defaultLookup);
        });
        return runs(function() {
          expect(model.todos).toHaveLength(1);
          return expect(model.todos[0].matchText).toBe('Comment in C');
        });
      });
      it('respects ignored directories and filetypes', function() {
        atom.project.setPaths([path.join(__dirname, 'fixtures')]);
        atom.config.set('todo-show.ignoreThesePaths', ['sample1', '*.md']);
        waitsForPromise(function() {
          return model.fetchRegexItem(defaultLookup);
        });
        return runs(function() {
          expect(model.todos).toHaveLength(6);
          return expect(model.todos[0].matchText).toBe('C block comment');
        });
      });
      it('respects ignored wildcard directories', function() {
        atom.project.setPaths([path.join(__dirname, 'fixtures')]);
        atom.config.set('todo-show.ignoreThesePaths', ['**/sample.js', '**/sample.txt', '*.md']);
        waitsForPromise(function() {
          return model.fetchRegexItem(defaultLookup);
        });
        return runs(function() {
          expect(model.todos).toHaveLength(1);
          return expect(model.todos[0].matchText).toBe('Comment in C');
        });
      });
      return it('respects more advanced ignores', function() {
        atom.project.setPaths([path.join(__dirname, 'fixtures')]);
        atom.config.set('todo-show.ignoreThesePaths', ['output(-grouped)?\\.*', '*1/**']);
        waitsForPromise(function() {
          return model.fetchRegexItem(defaultLookup);
        });
        return runs(function() {
          expect(model.todos).toHaveLength(6);
          return expect(model.todos[0].matchText).toBe('C block comment');
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
          return model.fetchOpenRegexItem(defaultLookup);
        });
        return runs(function() {
          expect(model.todos).toHaveLength(1);
          expect(model.todos.length).toBe(1);
          return expect(model.todos[0].matchText).toBe('Comment in C');
        });
      });
      it('works with files outside of workspace', function() {
        waitsForPromise(function() {
          return atom.workspace.open('../sample2/sample.txt');
        });
        return runs(function() {
          waitsForPromise(function() {
            return model.fetchOpenRegexItem(defaultLookup);
          });
          return runs(function() {
            expect(model.todos).toHaveLength(7);
            expect(model.todos[0].matchText).toBe('Comment in C');
            expect(model.todos[1].matchText).toBe('C block comment');
            return expect(model.todos[6].matchText).toBe('PHP comment');
          });
        });
      });
      it('handles unsaved documents', function() {
        editor.setText('TODO: New todo');
        waitsForPromise(function() {
          return model.fetchOpenRegexItem(defaultLookup);
        });
        return runs(function() {
          expect(model.todos).toHaveLength(1);
          expect(model.todos[0].title).toBe('TODOs');
          return expect(model.todos[0].matchText).toBe('New todo');
        });
      });
      it('respects imdone syntax (https://github.com/imdone/imdone-atom)', function() {
        editor.setText('TODO:10 todo1\nTODO:0 todo2');
        waitsForPromise(function() {
          return model.fetchOpenRegexItem(defaultLookup);
        });
        return runs(function() {
          expect(model.todos).toHaveLength(2);
          expect(model.todos[0].title).toBe('TODOs');
          expect(model.todos[0].matchText).toBe('todo1');
          return expect(model.todos[1].matchText).toBe('todo2');
        });
      });
      it('handles number in todo (as long as its not without space)', function() {
        editor.setText("Line 1 //TODO: 1 2 3\nLine 1 // TODO:1 2 3");
        waitsForPromise(function() {
          return model.fetchOpenRegexItem(defaultLookup);
        });
        return runs(function() {
          expect(model.todos).toHaveLength(2);
          expect(model.todos[0].matchText).toBe('1 2 3');
          return expect(model.todos[1].matchText).toBe('2 3');
        });
      });
      it('handles empty todos', function() {
        editor.setText("Line 1 // TODO\nLine 2 //TODO");
        waitsForPromise(function() {
          return model.fetchOpenRegexItem(defaultLookup);
        });
        return runs(function() {
          expect(model.todos).toHaveLength(2);
          expect(model.todos[0].matchText).toBe('No details');
          return expect(model.todos[1].matchText).toBe('No details');
        });
      });
      it('handles empty block todos', function() {
        editor.setText("/* TODO */\nLine 2 /* TODO */");
        waitsForPromise(function() {
          return model.fetchOpenRegexItem(defaultLookup);
        });
        return runs(function() {
          expect(model.todos).toHaveLength(2);
          expect(model.todos[0].matchText).toBe('No details');
          return expect(model.todos[1].matchText).toBe('No details');
        });
      });
      it('handles todos with @ in front', function() {
        editor.setText("Line 1 //@TODO: text\nLine 2 //@TODO: text\nLine 3 @TODO: text");
        waitsForPromise(function() {
          return model.fetchOpenRegexItem(defaultLookup);
        });
        return runs(function() {
          expect(model.todos).toHaveLength(3);
          expect(model.todos[0].matchText).toBe('text');
          expect(model.todos[1].matchText).toBe('text');
          return expect(model.todos[2].matchText).toBe('text');
        });
      });
      it('handles tabs in todos', function() {
        editor.setText('Line //TODO:\ttext');
        waitsForPromise(function() {
          return model.fetchOpenRegexItem(defaultLookup);
        });
        return runs(function() {
          return expect(model.todos[0].matchText).toBe('text');
        });
      });
      it('handles todo without semicolon', function() {
        editor.setText('A line // TODO text');
        waitsForPromise(function() {
          return model.fetchOpenRegexItem(defaultLookup);
        });
        return runs(function() {
          return expect(model.todos[0].matchText).toBe('text');
        });
      });
      it('ignores todos without leading space', function() {
        editor.setText('A line // TODO:text');
        waitsForPromise(function() {
          return model.fetchOpenRegexItem(defaultLookup);
        });
        return runs(function() {
          return expect(model.todos).toHaveLength(0);
        });
      });
      it('ignores todo if unwanted chars are present', function() {
        editor.setText('define("_JS_TODO_ALERT_", "js:alert(&quot;TODO&quot;);");');
        waitsForPromise(function() {
          return model.fetchOpenRegexItem(defaultLookup);
        });
        return runs(function() {
          return expect(model.todos).toHaveLength(0);
        });
      });
      return it('ignores binary data', function() {
        editor.setText('// TODOe�d��RPPP0�');
        waitsForPromise(function() {
          return model.fetchOpenRegexItem(defaultLookup);
        });
        return runs(function() {
          return expect(model.todos).toHaveLength(0);
        });
      });
    });
    return describe('getMarkdown()', function() {
      beforeEach(function() {
        atom.config.set('todo-show.findTheseRegexes', defaultRegexes);
        atom.config.set('todo-show.showInTable', defaultShowInTable);
        return model.todos = [
          {
            matchText: 'fixme #1',
            relativePath: 'file1.txt',
            title: 'FIXMEs',
            range: [[3, 6], [3, 10]],
            rangeString: '3,6,3,10'
          }, {
            matchText: 'todo #1',
            relativePath: 'file1.txt',
            title: 'TODOs',
            range: [[4, 5], [4, 9]],
            rangeString: '4,5,4,9'
          }, {
            matchText: 'fixme #2',
            relativePath: 'file2.txt',
            title: 'FIXMEs',
            range: [[5, 7], [5, 11]],
            rangeString: '5,7,5,11'
          }
        ];
      });
      it('creates a markdown string from regexes', function() {
        return expect(model.getMarkdown()).toEqual("- fixme #1 __FIXMEs__ `file1.txt`\n- todo #1 __TODOs__ `file1.txt`\n- fixme #2 __FIXMEs__ `file2.txt`\n");
      });
      it('creates markdown with sorting', function() {
        model.sortTodos({
          sortBy: 'Text',
          sortAsc: true
        });
        return expect(model.getMarkdown()).toEqual("- fixme #1 __FIXMEs__ `file1.txt`\n- fixme #2 __FIXMEs__ `file2.txt`\n- todo #1 __TODOs__ `file1.txt`\n");
      });
      it('creates markdown with inverse sorting', function() {
        model.sortTodos({
          sortBy: 'Text',
          sortAsc: false
        });
        return expect(model.getMarkdown()).toEqual("- todo #1 __TODOs__ `file1.txt`\n- fixme #2 __FIXMEs__ `file2.txt`\n- fixme #1 __FIXMEs__ `file1.txt`\n");
      });
      it('creates markdown different items', function() {
        atom.config.set('todo-show.showInTable', ['Type', 'File', 'Range']);
        return expect(model.getMarkdown()).toEqual("- __FIXMEs__ `file1.txt` _:3,6,3,10_\n- __TODOs__ `file1.txt` _:4,5,4,9_\n- __FIXMEs__ `file2.txt` _:5,7,5,11_\n");
      });
      it('accepts missing ranges and paths in regexes', function() {
        var markdown;
        model.todos = [
          {
            matchText: 'fixme #1',
            title: 'FIXMEs'
          }
        ];
        expect(model.getMarkdown()).toEqual("- fixme #1 __FIXMEs__\n");
        atom.config.set('todo-show.showInTable', ['Type', 'File', 'Range', 'Text']);
        markdown = '\n## Unknown File\n\n- fixme #1 `FIXMEs`\n';
        return expect(model.getMarkdown()).toEqual("- __FIXMEs__ fixme #1\n");
      });
      return it('accepts missing title in regexes', function() {
        model.todos = [
          {
            matchText: 'fixme #1',
            relativePath: 'file1.txt'
          }
        ];
        expect(model.getMarkdown()).toEqual("- fixme #1 `file1.txt`\n");
        atom.config.set('todo-show.showInTable', ['Title']);
        return expect(model.getMarkdown()).toEqual("- No details\n");
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RvZG8tc2hvdy9zcGVjL3RvZG9zLW1vZGVsLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdCQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUNBLFVBQUEsR0FBYSxPQUFBLENBQVEsb0JBQVIsQ0FEYixDQUFBOztBQUFBLEVBR0EsUUFBQSxDQUFTLGFBQVQsRUFBd0IsU0FBQSxHQUFBO0FBQ3RCLFFBQUEsOERBQUE7QUFBQSxJQUFBLE9BQTZELEVBQTdELEVBQUMsZUFBRCxFQUFRLHdCQUFSLEVBQXdCLHVCQUF4QixFQUF1Qyw0QkFBdkMsQ0FBQTtBQUFBLElBRUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsY0FBQSxHQUFpQixDQUNmLFFBRGUsRUFFZiw2QkFGZSxFQUdmLE9BSGUsRUFJZiw0QkFKZSxDQUFqQixDQUFBO0FBQUEsTUFNQSxhQUFBLEdBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTyxjQUFlLENBQUEsQ0FBQSxDQUF0QjtBQUFBLFFBQ0EsS0FBQSxFQUFPLGNBQWUsQ0FBQSxDQUFBLENBRHRCO09BUEYsQ0FBQTtBQUFBLE1BU0Esa0JBQUEsR0FBcUIsQ0FBQyxNQUFELEVBQVMsTUFBVCxFQUFpQixNQUFqQixDQVRyQixDQUFBO0FBQUEsTUFXQSxLQUFBLEdBQVEsR0FBQSxDQUFBLFVBWFIsQ0FBQTthQWFBLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFzQixDQUFDLElBQUksQ0FBQyxJQUFMLENBQVUsU0FBVixFQUFxQixrQkFBckIsQ0FBRCxDQUF0QixFQWRTO0lBQUEsQ0FBWCxDQUZBLENBQUE7QUFBQSxJQWtCQSxRQUFBLENBQVMsNEJBQVQsRUFBdUMsU0FBQSxHQUFBO0FB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

//# sourceURL=/Users/ah/.atom/packages/todo-show/spec/todos-model-spec.coffee
