(function() {
  var TodosModel, path;

  path = require('path');

  TodosModel = require('../lib/todos-model');

  describe('Todos Model', function() {
    var defaultLookup, defaultRegexes, defaultShowInTable, model, testTodos, _ref;
    _ref = [], model = _ref[0], defaultRegexes = _ref[1], defaultLookup = _ref[2], defaultShowInTable = _ref[3], testTodos = _ref[4];
    beforeEach(function() {
      defaultRegexes = ['FIXMEs', '/\\bFIXME:?\\d*($|\\s.*$)/g', 'TODOs', '/\\bTODO:?\\d*($|\\s.*$)/g'];
      defaultLookup = {
        title: defaultRegexes[2],
        regex: defaultRegexes[3]
      };
      defaultShowInTable = ['Text', 'Type', 'File'];
      testTodos = [
        {
          text: 'fixme #1',
          file: 'file1.txt',
          type: 'FIXMEs',
          range: '3,6,3,10',
          position: [[3, 6], [3, 10]]
        }, {
          text: 'todo #1',
          file: 'file1.txt',
          type: 'TODOs',
          range: '4,5,4,9',
          position: [[4, 5], [4, 9]]
        }, {
          text: 'fixme #2',
          file: 'file2.txt',
          type: 'FIXMEs',
          range: '5,7,5,11',
          position: [[5, 7], [5, 11]]
        }
      ];
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
      var match;
      match = [].match;
      beforeEach(function() {
        return match = {
          path: "" + (atom.project.getPaths()[0]) + "/sample.c",
          all: ' TODO: Comment in C ',
          regexp: /\b@?TODO:?\d*($|\s.*$)/g,
          position: [[0, 1], [0, 20]]
        };
      });
      it('should handle results from workspace scan (also tested in fetchRegexItem)', function() {
        var output;
        delete match.regexp;
        output = model.handleScanMatch(match);
        return expect(output.text).toEqual('TODO: Comment in C');
      });
      it('should remove regex part', function() {
        var output;
        output = model.handleScanMatch(match);
        return expect(output.text).toEqual('Comment in C');
      });
      it('should serialize range and relativize path', function() {
        var output;
        output = model.handleScanMatch(match);
        expect(output.file).toEqual('sample.c');
        return expect(output.range).toEqual('0,1,0,20');
      });
      it('should handle invalid match position', function() {
        var output;
        delete match.position;
        output = model.handleScanMatch(match);
        expect(output.range).toEqual('0,0');
        expect(output.position).toEqual([[0, 0]]);
        match.position = [];
        output = model.handleScanMatch(match);
        expect(output.range).toEqual('0,0');
        expect(output.position).toEqual([[0, 0]]);
        match.position = [[0, 1]];
        output = model.handleScanMatch(match);
        expect(output.range).toEqual('0,1');
        expect(output.position).toEqual([[0, 1]]);
        match.position = [[0, 1], [2, 3]];
        output = model.handleScanMatch(match);
        expect(output.range).toEqual('0,1,2,3');
        return expect(output.position).toEqual([[0, 1], [2, 3]]);
      });
      it('should extract todo tags', function() {
        var output;
        match.text = "test #TODO: 123 #tag1";
        output = model.handleScanMatch(match);
        expect(output.tags).toBe('tag1');
        expect(output.text).toBe('123');
        match.text = "#TODO: 123 #tag1.";
        return expect(model.handleScanMatch(match).tags).toBe('tag1');
      });
      it('should extract multiple todo tags', function() {
        var output;
        match.text = "TODO: 123 #tag1 #tag2 #tag3";
        output = model.handleScanMatch(match);
        expect(output.tags).toBe('tag1, tag2, tag3');
        expect(output.text).toBe('123');
        match.text = "test #TODO: 123 #tag1, #tag2";
        expect(model.handleScanMatch(match).tags).toBe('tag1, tag2');
        match.text = "TODO: #123 #tag1";
        output = model.handleScanMatch(match);
        expect(output.tags).toBe('123, tag1');
        return expect(output.text).toBe('No details');
      });
      return it('should handle invalid tags', function() {
        match.text = "#TODO: 123 #tag1 X";
        expect(model.handleScanMatch(match).tags).toBe('');
        match.text = "#TODO: 123 #tag1#";
        expect(model.handleScanMatch(match).tags).toBe('');
        match.text = "#TODO: #tag1 todo";
        expect(model.handleScanMatch(match).tags).toBe('');
        match.text = "#TODO: #tag.123";
        expect(model.handleScanMatch(match).tags).toBe('');
        match.text = "#TODO: #tag1 #tag2@";
        expect(model.handleScanMatch(match).tags).toBe('');
        match.text = "#TODO: #tag1, #tag2$, #tag3";
        return expect(model.handleScanMatch(match).tags).toBe('tag3');
      });
    });
    describe('fetchRegexItem(lookupObj)', function() {
      it('should scan the workspace for the regex that is passed and fill lookup results', function() {
        waitsForPromise(function() {
          return model.fetchRegexItem(defaultLookup);
        });
        return runs(function() {
          expect(model.todos).toHaveLength(3);
          expect(model.todos[0].text).toBe('Comment in C');
          expect(model.todos[1].text).toBe('This is the first todo');
          return expect(model.todos[2].text).toBe('This is the second todo');
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
          return expect(model.todos[0].text).toBe('<stdio.h>');
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
          expect(model.todos[0].text).toBe('This is the first todo');
          return expect(model.todos[1].text).toBe('This is the second todo');
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
          return expect(model.todos[0].text).toBe('Sample quicksort code');
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
          return expect(model.todos[0].text).toBe('return sort(Array.apply(this, arguments));');
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
          return expect(model.todos[0].text).toBe('return sort(Array.apply(this, arguments));');
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
          var text, text2;
          text = 'Lorem ipsum dolor sit amet, dapibus rhoncus. Scelerisque quam,';
          text += ' id ante molestias, ipsum lorem magnis et. A eleifend i...';
          text2 = '_SpgLE84Ms1K4DSumtJDoNn8ZECZLL+VR0DoGydy54vUoSpgLE84Ms1K4DSum';
          text2 += 'tJDoNn8ZECZLLVR0DoGydy54vUonRClXwLbFhX2gMwZgjx250ay+V0lF...';
          expect(model.todos[0].text).toHaveLength(120);
          expect(model.todos[0].text).toBe(text);
          expect(model.todos[1].text).toHaveLength(120);
          return expect(model.todos[1].text).toBe(text2);
        });
      });
      return it('should strip common block comment endings', function() {
        atom.project.setPaths([path.join(__dirname, 'fixtures/sample2')]);
        waitsForPromise(function() {
          return model.fetchRegexItem(defaultLookup);
        });
        return runs(function() {
          expect(model.todos).toHaveLength(6);
          expect(model.todos[0].text).toBe('C block comment');
          expect(model.todos[1].text).toBe('HTML comment');
          expect(model.todos[2].text).toBe('PowerShell comment');
          expect(model.todos[3].text).toBe('Haskell comment');
          expect(model.todos[4].text).toBe('Lua comment');
          return expect(model.todos[5].text).toBe('PHP comment');
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
          return expect(model.todos[0].text).toBe('Comment in C');
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
          return expect(model.todos[0].text).toBe('C block comment');
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
          return expect(model.todos[0].text).toBe('Comment in C');
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
          return expect(model.todos[0].text).toBe('C block comment');
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
          return expect(model.todos[0].text).toBe('Comment in C');
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
            expect(model.todos[0].text).toBe('Comment in C');
            expect(model.todos[1].text).toBe('C block comment');
            return expect(model.todos[6].text).toBe('PHP comment');
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
          expect(model.todos[0].type).toBe('TODOs');
          return expect(model.todos[0].text).toBe('New todo');
        });
      });
      it('respects imdone syntax (https://github.com/imdone/imdone-atom)', function() {
        editor.setText('TODO:10 todo1\nTODO:0 todo2');
        waitsForPromise(function() {
          return model.fetchOpenRegexItem(defaultLookup);
        });
        return runs(function() {
          expect(model.todos).toHaveLength(2);
          expect(model.todos[0].type).toBe('TODOs');
          expect(model.todos[0].text).toBe('todo1');
          return expect(model.todos[1].text).toBe('todo2');
        });
      });
      it('handles number in todo (as long as its not without space)', function() {
        editor.setText("Line 1 //TODO: 1 2 3\nLine 1 // TODO:1 2 3");
        waitsForPromise(function() {
          return model.fetchOpenRegexItem(defaultLookup);
        });
        return runs(function() {
          expect(model.todos).toHaveLength(2);
          expect(model.todos[0].text).toBe('1 2 3');
          return expect(model.todos[1].text).toBe('2 3');
        });
      });
      it('handles empty todos', function() {
        editor.setText("Line 1 // TODO\nLine 2 //TODO");
        waitsForPromise(function() {
          return model.fetchOpenRegexItem(defaultLookup);
        });
        return runs(function() {
          expect(model.todos).toHaveLength(2);
          expect(model.todos[0].text).toBe('No details');
          return expect(model.todos[1].text).toBe('No details');
        });
      });
      it('handles empty block todos', function() {
        editor.setText("/* TODO */\nLine 2 /* TODO */");
        waitsForPromise(function() {
          return model.fetchOpenRegexItem(defaultLookup);
        });
        return runs(function() {
          expect(model.todos).toHaveLength(2);
          expect(model.todos[0].text).toBe('No details');
          return expect(model.todos[1].text).toBe('No details');
        });
      });
      it('handles todos with @ in front', function() {
        editor.setText("Line 1 //@TODO: text\nLine 2 //@TODO: text\nLine 3 @TODO: text");
        waitsForPromise(function() {
          return model.fetchOpenRegexItem(defaultLookup);
        });
        return runs(function() {
          expect(model.todos).toHaveLength(3);
          expect(model.todos[0].text).toBe('text');
          expect(model.todos[1].text).toBe('text');
          return expect(model.todos[2].text).toBe('text');
        });
      });
      it('handles tabs in todos', function() {
        editor.setText('Line //TODO:\ttext');
        waitsForPromise(function() {
          return model.fetchOpenRegexItem(defaultLookup);
        });
        return runs(function() {
          return expect(model.todos[0].text).toBe('text');
        });
      });
      it('handles todo without semicolon', function() {
        editor.setText('A line // TODO text');
        waitsForPromise(function() {
          return model.fetchOpenRegexItem(defaultLookup);
        });
        return runs(function() {
          return expect(model.todos[0].text).toBe('text');
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
    describe('filterTodos()', function() {
      var filterSpy;
      filterSpy = [].filterSpy;
      beforeEach(function() {
        atom.config.set('todo-show.showInTable', defaultShowInTable);
        model.todos = testTodos;
        filterSpy = jasmine.createSpy();
        return model.onDidFilterTodos(filterSpy);
      });
      it('can filter simple todos', function() {
        model.filterTodos('#2');
        expect(filterSpy.callCount).toBe(1);
        return expect(filterSpy.calls[0].args[0]).toHaveLength(1);
      });
      it('can filter todos with multiple results', function() {
        model.filterTodos('FIXME');
        expect(filterSpy.callCount).toBe(1);
        return expect(filterSpy.calls[0].args[0]).toHaveLength(2);
      });
      it('handles no results', function() {
        model.filterTodos('XYZ');
        expect(filterSpy.callCount).toBe(1);
        return expect(filterSpy.calls[0].args[0]).toHaveLength(0);
      });
      return it('handles empty filter', function() {
        model.filterTodos('');
        expect(filterSpy.callCount).toBe(1);
        return expect(filterSpy.calls[0].args[0]).toHaveLength(3);
      });
    });
    return describe('getMarkdown()', function() {
      beforeEach(function() {
        atom.config.set('todo-show.findTheseRegexes', defaultRegexes);
        atom.config.set('todo-show.showInTable', defaultShowInTable);
        return model.todos = testTodos;
      });
      it('creates a markdown string from regexes', function() {
        return expect(model.getMarkdown()).toEqual("- fixme #1 __FIXMEs__ [file1.txt](file1.txt)\n- todo #1 __TODOs__ [file1.txt](file1.txt)\n- fixme #2 __FIXMEs__ [file2.txt](file2.txt)\n");
      });
      it('creates markdown with sorting', function() {
        model.sortTodos({
          sortBy: 'Text',
          sortAsc: true
        });
        return expect(model.getMarkdown()).toEqual("- fixme #1 __FIXMEs__ [file1.txt](file1.txt)\n- fixme #2 __FIXMEs__ [file2.txt](file2.txt)\n- todo #1 __TODOs__ [file1.txt](file1.txt)\n");
      });
      it('creates markdown with inverse sorting', function() {
        model.sortTodos({
          sortBy: 'Text',
          sortAsc: false
        });
        return expect(model.getMarkdown()).toEqual("- todo #1 __TODOs__ [file1.txt](file1.txt)\n- fixme #2 __FIXMEs__ [file2.txt](file2.txt)\n- fixme #1 __FIXMEs__ [file1.txt](file1.txt)\n");
      });
      it('creates markdown with different items', function() {
        atom.config.set('todo-show.showInTable', ['Type', 'File', 'Range']);
        return expect(model.getMarkdown()).toEqual("- __FIXMEs__ [file1.txt](file1.txt) _:3,6,3,10_\n- __TODOs__ [file1.txt](file1.txt) _:4,5,4,9_\n- __FIXMEs__ [file2.txt](file2.txt) _:5,7,5,11_\n");
      });
      it('creates markdown as table', function() {
        atom.config.set('todo-show.saveOutputAs', 'Table');
        return expect(model.getMarkdown()).toEqual("| Text | Type | File |\n|--------------------|\n| fixme #1 | __FIXMEs__ | [file1.txt](file1.txt) |\n| todo #1 | __TODOs__ | [file1.txt](file1.txt) |\n| fixme #2 | __FIXMEs__ | [file2.txt](file2.txt) |\n");
      });
      it('creates markdown as table with different items', function() {
        atom.config.set('todo-show.saveOutputAs', 'Table');
        atom.config.set('todo-show.showInTable', ['Type', 'File', 'Range']);
        return expect(model.getMarkdown()).toEqual("| Type | File | Range |\n|---------------------|\n| __FIXMEs__ | [file1.txt](file1.txt) | _:3,6,3,10_ |\n| __TODOs__ | [file1.txt](file1.txt) | _:4,5,4,9_ |\n| __FIXMEs__ | [file2.txt](file2.txt) | _:5,7,5,11_ |\n");
      });
      it('accepts missing ranges and paths in regexes', function() {
        var markdown;
        model.todos = [
          {
            text: 'fixme #1',
            type: 'FIXMEs'
          }
        ];
        expect(model.getMarkdown()).toEqual("- fixme #1 __FIXMEs__\n");
        atom.config.set('todo-show.showInTable', ['Type', 'File', 'Range', 'Text']);
        markdown = '\n## Unknown File\n\n- fixme #1 `FIXMEs`\n';
        return expect(model.getMarkdown()).toEqual("- __FIXMEs__ fixme #1\n");
      });
      it('accepts missing title in regexes', function() {
        model.todos = [
          {
            text: 'fixme #1',
            file: 'file1.txt'
          }
        ];
        expect(model.getMarkdown()).toEqual("- fixme #1 [file1.txt](file1.txt)\n");
        atom.config.set('todo-show.showInTable', ['Title']);
        return expect(model.getMarkdown()).toEqual("- No details\n");
      });
      return it('accepts missing items in table output', function() {
        model.todos = [
          {
            text: 'fixme #1',
            type: 'FIXMEs'
          }
        ];
        atom.config.set('todo-show.saveOutputAs', 'Table');
        expect(model.getMarkdown()).toEqual("| Text | Type | File |\n|--------------------|\n| fixme #1 | __FIXMEs__ | |\n");
        atom.config.set('todo-show.showInTable', ['Line']);
        return expect(model.getMarkdown()).toEqual("| Line |\n|------|\n| |\n");
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RvZG8tc2hvdy9zcGVjL3RvZG9zLW1vZGVsLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdCQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUNBLFVBQUEsR0FBYSxPQUFBLENBQVEsb0JBQVIsQ0FEYixDQUFBOztBQUFBLEVBR0EsUUFBQSxDQUFTLGFBQVQsRUFBd0IsU0FBQSxHQUFBO0FBQ3RCLFFBQUEseUVBQUE7QUFBQSxJQUFBLE9BQXdFLEVBQXhFLEVBQUMsZUFBRCxFQUFRLHdCQUFSLEVBQXdCLHVCQUF4QixFQUF1Qyw0QkFBdkMsRUFBMkQsbUJBQTNELENBQUE7QUFBQSxJQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxNQUFBLGNBQUEsR0FBaUIsQ0FDZixRQURlLEVBRWYsNkJBRmUsRUFHZixPQUhlLEVBSWYsNEJBSmUsQ0FBakIsQ0FBQTtBQUFBLE1BTUEsYUFBQSxHQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8sY0FBZSxDQUFBLENBQUEsQ0FBdEI7QUFBQSxRQUNBLEtBQUEsRUFBTyxjQUFlLENBQUEsQ0FBQSxDQUR0QjtPQVBGLENBQUE7QUFBQSxNQVNBLGtCQUFBLEdBQXFCLENBQUMsTUFBRCxFQUFTLE1BQVQsRUFBaUIsTUFBakIsQ0FUckIsQ0FBQTtBQUFBLE1BV0EsU0FBQSxHQUFZO1FBQ1Y7QUFBQSxVQUNFLElBQUEsRUFBTSxVQURSO0FBQUEsVUFFRSxJQUFBLEVBQU0sV0FGUjtBQUFBLFVBR0UsSUFBQSxFQUFNLFFBSFI7QUFBQSxVQUlFLEtBQUEsRUFBTyxVQUpUO0FBQUEsVUFLRSxRQUFBLEVBQVUsQ0FBQyxDQUFDLENBQUQsRUFBRyxDQUFILENBQUQsRUFBUSxDQUFDLENB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

//# sourceURL=/Users/ah/.atom/packages/todo-show/spec/todos-model-spec.coffee
