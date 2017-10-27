(function() {
  var TodoCollection, TodoModel, path;

  path = require('path');

  TodoCollection = require('../lib/todo-collection');

  TodoModel = require('../lib/todo-model');

  describe('Todo Collection', function() {
    var addTestTodos, collection, defaultLookup, defaultRegexes, defaultShowInTable, _ref;
    _ref = [], collection = _ref[0], defaultRegexes = _ref[1], defaultLookup = _ref[2], defaultShowInTable = _ref[3];
    addTestTodos = function() {
      collection.addTodo(new TodoModel({
        all: 'fixme 1',
        file: 'file1.txt',
        type: 'FIXMEs',
        range: '3,6,3,10',
        position: [[3, 6], [3, 10]]
      }));
      collection.addTodo(new TodoModel({
        all: 'todo 1',
        file: 'file1.txt',
        type: 'TODOs',
        range: '4,5,4,9',
        position: [[4, 5], [4, 9]]
      }));
      return collection.addTodo(new TodoModel({
        all: 'fixme 2',
        file: 'file2.txt',
        type: 'FIXMEs',
        range: '5,7,5,11',
        position: [[5, 7], [5, 11]]
      }));
    };
    beforeEach(function() {
      defaultRegexes = ['FIXMEs', '/\\bFIXME:?\\d*($|\\s.*$)/g', 'TODOs', '/\\bTODO:?\\d*($|\\s.*$)/g'];
      defaultLookup = {
        title: defaultRegexes[2],
        regex: defaultRegexes[3]
      };
      defaultShowInTable = ['Text', 'Type', 'File'];
      collection = new TodoCollection;
      return atom.project.setPaths([path.join(__dirname, 'fixtures/sample1')]);
    });
    describe('buildRegexLookups(regexes)', function() {
      it('returns an array of lookup objects when passed an array of regexes', function() {
        var lookups1, lookups2;
        lookups1 = collection.buildRegexLookups(defaultRegexes);
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
        collection.onDidFailSearch(notificationSpy = jasmine.createSpy());
        regexes = ['TODO'];
        lookups = collection.buildRegexLookups(regexes);
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
        regexObj = collection.makeRegexObj(regexStr);
        expect(typeof regexObj.test).toBe('function');
        return expect(typeof regexObj.exec).toBe('function');
      });
      it('returns false and notifies on invalid input', function() {
        var notification, notificationSpy, regexObj, regexStr;
        collection.onDidFailSearch(notificationSpy = jasmine.createSpy());
        regexStr = 'arstastTODO:.+$)/g';
        regexObj = collection.makeRegexObj(regexStr);
        expect(regexObj).toBe(false);
        notification = notificationSpy.mostRecentCall.args[0];
        expect(notificationSpy).toHaveBeenCalled();
        return expect(notification.indexOf('Invalid')).not.toBe(-1);
      });
      return it('handles empty input', function() {
        var regexObj;
        regexObj = collection.makeRegexObj();
        return expect(regexObj).toBe(false);
      });
    });
    describe('fetchRegexItem(lookupObj)', function() {
      it('should scan the workspace for the regex that is passed and fill lookup results', function() {
        waitsForPromise(function() {
          return collection.fetchRegexItem(defaultLookup);
        });
        return runs(function() {
          expect(collection.todos).toHaveLength(3);
          expect(collection.todos[0].text).toBe('Comment in C');
          expect(collection.todos[1].text).toBe('This is the first todo');
          return expect(collection.todos[2].text).toBe('This is the second todo');
        });
      });
      it('should handle other regexes', function() {
        var lookup;
        lookup = {
          title: 'Includes',
          regex: '/#include(.+)/g'
        };
        waitsForPromise(function() {
          return collection.fetchRegexItem(lookup);
        });
        return runs(function() {
          expect(collection.todos).toHaveLength(1);
          return expect(collection.todos[0].text).toBe('<stdio.h>');
        });
      });
      it('should handle special character regexes', function() {
        var lookup;
        lookup = {
          title: 'Todos',
          regex: '/ This is the (?:first|second) todo/g'
        };
        waitsForPromise(function() {
          return collection.fetchRegexItem(lookup);
        });
        return runs(function() {
          expect(collection.todos).toHaveLength(2);
          expect(collection.todos[0].text).toBe('This is the first todo');
          return expect(collection.todos[1].text).toBe('This is the second todo');
        });
      });
      it('should handle regex without capture group', function() {
        var lookup;
        lookup = {
          title: 'This is Code',
          regex: '/[\\w\\s]+code[\\w\\s]*/g'
        };
        waitsForPromise(function() {
          return collection.fetchRegexItem(lookup);
        });
        return runs(function() {
          expect(collection.todos).toHaveLength(1);
          return expect(collection.todos[0].text).toBe('Sample quicksort code');
        });
      });
      it('should handle post-annotations with special regex', function() {
        var lookup;
        lookup = {
          title: 'Pre-DEBUG',
          regex: '/(.+).{3}DEBUG\\s*$/g'
        };
        waitsForPromise(function() {
          return collection.fetchRegexItem(lookup);
        });
        return runs(function() {
          expect(collection.todos).toHaveLength(1);
          return expect(collection.todos[0].text).toBe('return sort(Array.apply(this, arguments));');
        });
      });
      it('should handle post-annotations with non-capturing group', function() {
        var lookup;
        lookup = {
          title: 'Pre-DEBUG',
          regex: '/(.+?(?=.{3}DEBUG\\s*$))/'
        };
        waitsForPromise(function() {
          return collection.fetchRegexItem(lookup);
        });
        return runs(function() {
          expect(collection.todos).toHaveLength(1);
          return expect(collection.todos[0].text).toBe('return sort(Array.apply(this, arguments));');
        });
      });
      it('should truncate todos longer than the defined max length of 120', function() {
        var lookup;
        lookup = {
          title: 'Long Annotation',
          regex: '/LOONG:?(.+$)/g'
        };
        waitsForPromise(function() {
          return collection.fetchRegexItem(lookup);
        });
        return runs(function() {
          var text, text2;
          text = 'Lorem ipsum dolor sit amet, dapibus rhoncus. Scelerisque quam,';
          text += ' id ante molestias, ipsum lorem magnis et. A eleifend i...';
          text2 = '_SpgLE84Ms1K4DSumtJDoNn8ZECZLL+VR0DoGydy54vUoSpgLE84Ms1K4DSum';
          text2 += 'tJDoNn8ZECZLLVR0DoGydy54vUonRClXwLbFhX2gMwZgjx250ay+V0lF...';
          expect(collection.todos[0].text).toHaveLength(120);
          expect(collection.todos[0].text).toBe(text);
          expect(collection.todos[1].text).toHaveLength(120);
          return expect(collection.todos[1].text).toBe(text2);
        });
      });
      return it('should strip common block comment endings', function() {
        atom.project.setPaths([path.join(__dirname, 'fixtures/sample2')]);
        waitsForPromise(function() {
          return collection.fetchRegexItem(defaultLookup);
        });
        return runs(function() {
          expect(collection.todos).toHaveLength(6);
          expect(collection.todos[0].text).toBe('C block comment');
          expect(collection.todos[1].text).toBe('HTML comment');
          expect(collection.todos[2].text).toBe('PowerShell comment');
          expect(collection.todos[3].text).toBe('Haskell comment');
          expect(collection.todos[4].text).toBe('Lua comment');
          return expect(collection.todos[5].text).toBe('PHP comment');
        });
      });
    });
    describe('ignore path rules', function() {
      it('works with no paths added', function() {
        atom.config.set('todo-show.ignoreThesePaths', []);
        waitsForPromise(function() {
          return collection.fetchRegexItem(defaultLookup);
        });
        return runs(function() {
          return expect(collection.todos).toHaveLength(3);
        });
      });
      it('must be an array', function() {
        var notificationSpy;
        collection.onDidFailSearch(notificationSpy = jasmine.createSpy());
        atom.config.set('todo-show.ignoreThesePaths', '123');
        waitsForPromise(function() {
          return collection.fetchRegexItem(defaultLookup);
        });
        return runs(function() {
          var notification;
          expect(collection.todos).toHaveLength(3);
          notification = notificationSpy.mostRecentCall.args[0];
          expect(notificationSpy).toHaveBeenCalled();
          return expect(notification.indexOf('ignoreThesePaths')).not.toBe(-1);
        });
      });
      it('respects ignored files', function() {
        atom.config.set('todo-show.ignoreThesePaths', ['sample.js']);
        waitsForPromise(function() {
          return collection.fetchRegexItem(defaultLookup);
        });
        return runs(function() {
          expect(collection.todos).toHaveLength(1);
          return expect(collection.todos[0].text).toBe('Comment in C');
        });
      });
      it('respects ignored directories and filetypes', function() {
        atom.project.setPaths([path.join(__dirname, 'fixtures')]);
        atom.config.set('todo-show.ignoreThesePaths', ['sample1', '*.md']);
        waitsForPromise(function() {
          return collection.fetchRegexItem(defaultLookup);
        });
        return runs(function() {
          expect(collection.todos).toHaveLength(6);
          return expect(collection.todos[0].text).toBe('C block comment');
        });
      });
      it('respects ignored wildcard directories', function() {
        atom.project.setPaths([path.join(__dirname, 'fixtures')]);
        atom.config.set('todo-show.ignoreThesePaths', ['**/sample.js', '**/sample.txt', '*.md']);
        waitsForPromise(function() {
          return collection.fetchRegexItem(defaultLookup);
        });
        return runs(function() {
          expect(collection.todos).toHaveLength(1);
          return expect(collection.todos[0].text).toBe('Comment in C');
        });
      });
      return it('respects more advanced ignores', function() {
        atom.project.setPaths([path.join(__dirname, 'fixtures')]);
        atom.config.set('todo-show.ignoreThesePaths', ['output(-grouped)?\\.*', '*1/**']);
        waitsForPromise(function() {
          return collection.fetchRegexItem(defaultLookup);
        });
        return runs(function() {
          expect(collection.todos).toHaveLength(6);
          return expect(collection.todos[0].text).toBe('C block comment');
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
          return collection.fetchOpenRegexItem(defaultLookup);
        });
        return runs(function() {
          expect(collection.todos).toHaveLength(1);
          expect(collection.todos.length).toBe(1);
          return expect(collection.todos[0].text).toBe('Comment in C');
        });
      });
      it('works with files outside of workspace', function() {
        waitsForPromise(function() {
          return atom.workspace.open('../sample2/sample.txt');
        });
        return runs(function() {
          waitsForPromise(function() {
            return collection.fetchOpenRegexItem(defaultLookup);
          });
          return runs(function() {
            expect(collection.todos).toHaveLength(7);
            expect(collection.todos[0].text).toBe('Comment in C');
            expect(collection.todos[1].text).toBe('C block comment');
            return expect(collection.todos[6].text).toBe('PHP comment');
          });
        });
      });
      it('handles unsaved documents', function() {
        editor.setText('TODO: New todo');
        waitsForPromise(function() {
          return collection.fetchOpenRegexItem(defaultLookup);
        });
        return runs(function() {
          expect(collection.todos).toHaveLength(1);
          expect(collection.todos[0].type).toBe('TODOs');
          return expect(collection.todos[0].text).toBe('New todo');
        });
      });
      it('respects imdone syntax (https://github.com/imdone/imdone-atom)', function() {
        editor.setText('TODO:10 todo1\nTODO:0 todo2');
        waitsForPromise(function() {
          return collection.fetchOpenRegexItem(defaultLookup);
        });
        return runs(function() {
          expect(collection.todos).toHaveLength(2);
          expect(collection.todos[0].type).toBe('TODOs');
          expect(collection.todos[0].text).toBe('todo1');
          return expect(collection.todos[1].text).toBe('todo2');
        });
      });
      it('handles number in todo (as long as its not without space)', function() {
        editor.setText("Line 1 //TODO: 1 2 3\nLine 1 // TODO:1 2 3");
        waitsForPromise(function() {
          return collection.fetchOpenRegexItem(defaultLookup);
        });
        return runs(function() {
          expect(collection.todos).toHaveLength(2);
          expect(collection.todos[0].text).toBe('1 2 3');
          return expect(collection.todos[1].text).toBe('2 3');
        });
      });
      it('handles empty todos', function() {
        editor.setText("Line 1 // TODO\nLine 2 //TODO");
        waitsForPromise(function() {
          return collection.fetchOpenRegexItem(defaultLookup);
        });
        return runs(function() {
          expect(collection.todos).toHaveLength(2);
          expect(collection.todos[0].text).toBe('No details');
          return expect(collection.todos[1].text).toBe('No details');
        });
      });
      it('handles empty block todos', function() {
        editor.setText("/* TODO */\nLine 2 /* TODO */");
        waitsForPromise(function() {
          return collection.fetchOpenRegexItem(defaultLookup);
        });
        return runs(function() {
          expect(collection.todos).toHaveLength(2);
          expect(collection.todos[0].text).toBe('No details');
          return expect(collection.todos[1].text).toBe('No details');
        });
      });
      it('handles todos with @ in front', function() {
        editor.setText("Line 1 //@TODO: text\nLine 2 //@TODO: text\nLine 3 @TODO: text");
        waitsForPromise(function() {
          return collection.fetchOpenRegexItem(defaultLookup);
        });
        return runs(function() {
          expect(collection.todos).toHaveLength(3);
          expect(collection.todos[0].text).toBe('text');
          expect(collection.todos[1].text).toBe('text');
          return expect(collection.todos[2].text).toBe('text');
        });
      });
      it('handles tabs in todos', function() {
        editor.setText('Line //TODO:\ttext');
        waitsForPromise(function() {
          return collection.fetchOpenRegexItem(defaultLookup);
        });
        return runs(function() {
          return expect(collection.todos[0].text).toBe('text');
        });
      });
      it('handles todo without semicolon', function() {
        editor.setText('A line // TODO text');
        waitsForPromise(function() {
          return collection.fetchOpenRegexItem(defaultLookup);
        });
        return runs(function() {
          return expect(collection.todos[0].text).toBe('text');
        });
      });
      it('ignores todos without leading space', function() {
        editor.setText('A line // TODO:text');
        waitsForPromise(function() {
          return collection.fetchOpenRegexItem(defaultLookup);
        });
        return runs(function() {
          return expect(collection.todos).toHaveLength(0);
        });
      });
      it('ignores todo if unwanted chars are present', function() {
        editor.setText('define("_JS_TODO_ALERT_", "js:alert(&quot;TODO&quot;);");');
        waitsForPromise(function() {
          return collection.fetchOpenRegexItem(defaultLookup);
        });
        return runs(function() {
          return expect(collection.todos).toHaveLength(0);
        });
      });
      return it('ignores binary data', function() {
        editor.setText('// TODOe�d��RPPP0�');
        waitsForPromise(function() {
          return collection.fetchOpenRegexItem(defaultLookup);
        });
        return runs(function() {
          return expect(collection.todos).toHaveLength(0);
        });
      });
    });
    describe('Sort todos', function() {
      var sortSpy;
      sortSpy = [].sortSpy;
      beforeEach(function() {
        addTestTodos();
        sortSpy = jasmine.createSpy();
        return collection.onDidSortTodos(sortSpy);
      });
      it('can sort simple todos', function() {
        collection.sortTodos({
          sortBy: 'Text',
          sortAsc: false
        });
        expect(collection.todos[0].text).toBe('todo 1');
        expect(collection.todos[2].text).toBe('fixme 1');
        collection.sortTodos({
          sortBy: 'Text',
          sortAsc: true
        });
        expect(collection.todos[0].text).toBe('fixme 1');
        expect(collection.todos[2].text).toBe('todo 1');
        collection.sortTodos({
          sortBy: 'Text'
        });
        expect(collection.todos[0].text).toBe('todo 1');
        expect(collection.todos[2].text).toBe('fixme 1');
        collection.sortTodos({
          sortAsc: true
        });
        expect(collection.todos[0].text).toBe('fixme 1');
        expect(collection.todos[2].text).toBe('todo 1');
        collection.sortTodos();
        expect(collection.todos[0].text).toBe('todo 1');
        return expect(collection.todos[2].text).toBe('fixme 1');
      });
      return it('sort by other values', function() {
        collection.sortTodos({
          sortBy: 'Range',
          sortAsc: true
        });
        expect(collection.todos[0].range).toBe('3,6,3,10');
        expect(collection.todos[2].range).toBe('5,7,5,11');
        collection.sortTodos({
          sortBy: 'File',
          sortAsc: false
        });
        expect(collection.todos[0].file).toBe('file2.txt');
        return expect(collection.todos[2].file).toBe('file1.txt');
      });
    });
    describe('Filter todos', function() {
      var filterSpy;
      filterSpy = [].filterSpy;
      beforeEach(function() {
        atom.config.set('todo-show.showInTable', defaultShowInTable);
        addTestTodos();
        filterSpy = jasmine.createSpy();
        return collection.onDidFilterTodos(filterSpy);
      });
      it('can filter simple todos', function() {
        collection.filterTodos('todo');
        expect(filterSpy.callCount).toBe(1);
        return expect(filterSpy.calls[0].args[0]).toHaveLength(1);
      });
      it('can filter todos with multiple results', function() {
        collection.filterTodos('FIXME');
        expect(filterSpy.callCount).toBe(1);
        return expect(filterSpy.calls[0].args[0]).toHaveLength(2);
      });
      it('handles no results', function() {
        collection.filterTodos('XYZ');
        expect(filterSpy.callCount).toBe(1);
        return expect(filterSpy.calls[0].args[0]).toHaveLength(0);
      });
      return it('handles empty filter', function() {
        collection.filterTodos('');
        expect(filterSpy.callCount).toBe(1);
        return expect(filterSpy.calls[0].args[0]).toHaveLength(3);
      });
    });
    return describe('Markdown', function() {
      beforeEach(function() {
        atom.config.set('todo-show.findTheseRegexes', defaultRegexes);
        return atom.config.set('todo-show.showInTable', defaultShowInTable);
      });
      it('creates a markdown string from regexes', function() {
        addTestTodos();
        return expect(collection.getMarkdown()).toEqual("- fixme 1 __FIXMEs__ [file1.txt](file1.txt)\n- todo 1 __TODOs__ [file1.txt](file1.txt)\n- fixme 2 __FIXMEs__ [file2.txt](file2.txt)\n");
      });
      it('creates markdown with sorting', function() {
        addTestTodos();
        collection.sortTodos({
          sortBy: 'Text',
          sortAsc: true
        });
        return expect(collection.getMarkdown()).toEqual("- fixme 1 __FIXMEs__ [file1.txt](file1.txt)\n- fixme 2 __FIXMEs__ [file2.txt](file2.txt)\n- todo 1 __TODOs__ [file1.txt](file1.txt)\n");
      });
      it('creates markdown with inverse sorting', function() {
        addTestTodos();
        collection.sortTodos({
          sortBy: 'Text',
          sortAsc: false
        });
        return expect(collection.getMarkdown()).toEqual("- todo 1 __TODOs__ [file1.txt](file1.txt)\n- fixme 2 __FIXMEs__ [file2.txt](file2.txt)\n- fixme 1 __FIXMEs__ [file1.txt](file1.txt)\n");
      });
      it('creates markdown with different items', function() {
        addTestTodos();
        atom.config.set('todo-show.showInTable', ['Type', 'File', 'Range']);
        return expect(collection.getMarkdown()).toEqual("- __FIXMEs__ [file1.txt](file1.txt) _:3,6,3,10_\n- __TODOs__ [file1.txt](file1.txt) _:4,5,4,9_\n- __FIXMEs__ [file2.txt](file2.txt) _:5,7,5,11_\n");
      });
      it('creates markdown as table', function() {
        addTestTodos();
        atom.config.set('todo-show.saveOutputAs', 'Table');
        return expect(collection.getMarkdown()).toEqual("| Text | Type | File |\n|--------------------|\n| fixme 1 | __FIXMEs__ | [file1.txt](file1.txt) |\n| todo 1 | __TODOs__ | [file1.txt](file1.txt) |\n| fixme 2 | __FIXMEs__ | [file2.txt](file2.txt) |\n");
      });
      it('creates markdown as table with different items', function() {
        addTestTodos();
        atom.config.set('todo-show.saveOutputAs', 'Table');
        atom.config.set('todo-show.showInTable', ['Type', 'File', 'Range']);
        return expect(collection.getMarkdown()).toEqual("| Type | File | Range |\n|---------------------|\n| __FIXMEs__ | [file1.txt](file1.txt) | _:3,6,3,10_ |\n| __TODOs__ | [file1.txt](file1.txt) | _:4,5,4,9_ |\n| __FIXMEs__ | [file2.txt](file2.txt) | _:5,7,5,11_ |\n");
      });
      it('accepts missing ranges and paths in regexes', function() {
        var markdown;
        collection.addTodo(new TodoModel({
          text: 'fixme 1',
          type: 'FIXMEs'
        }, {
          plain: true
        }));
        expect(collection.getMarkdown()).toEqual("- fixme 1 __FIXMEs__\n");
        atom.config.set('todo-show.showInTable', ['Type', 'File', 'Range', 'Text']);
        markdown = '\n## Unknown File\n\n- fixme 1 `FIXMEs`\n';
        return expect(collection.getMarkdown()).toEqual("- __FIXMEs__ fixme 1\n");
      });
      it('accepts missing title in regexes', function() {
        collection.addTodo(new TodoModel({
          text: 'fixme 1',
          file: 'file1.txt'
        }, {
          plain: true
        }));
        expect(collection.getMarkdown()).toEqual("- fixme 1 [file1.txt](file1.txt)\n");
        atom.config.set('todo-show.showInTable', ['Title']);
        return expect(collection.getMarkdown()).toEqual("- No details\n");
      });
      return it('accepts missing items in table output', function() {
        collection.addTodo(new TodoModel({
          text: 'fixme 1',
          type: 'FIXMEs'
        }, {
          plain: true
        }));
        atom.config.set('todo-show.saveOutputAs', 'Table');
        expect(collection.getMarkdown()).toEqual("| Text | Type | File |\n|--------------------|\n| fixme 1 | __FIXMEs__ | |\n");
        atom.config.set('todo-show.showInTable', ['Line']);
        return expect(collection.getMarkdown()).toEqual("| Line |\n|------|\n| |\n");
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RvZG8tc2hvdy9zcGVjL3RvZG8tY29sbGVjdGlvbi1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwrQkFBQTs7QUFBQSxFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUFQLENBQUE7O0FBQUEsRUFFQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSx3QkFBUixDQUZqQixDQUFBOztBQUFBLEVBR0EsU0FBQSxHQUFZLE9BQUEsQ0FBUSxtQkFBUixDQUhaLENBQUE7O0FBQUEsRUFLQSxRQUFBLENBQVMsaUJBQVQsRUFBNEIsU0FBQSxHQUFBO0FBQzFCLFFBQUEsaUZBQUE7QUFBQSxJQUFBLE9BQWtFLEVBQWxFLEVBQUMsb0JBQUQsRUFBYSx3QkFBYixFQUE2Qix1QkFBN0IsRUFBNEMsNEJBQTVDLENBQUE7QUFBQSxJQUVBLFlBQUEsR0FBZSxTQUFBLEdBQUE7QUFDYixNQUFBLFVBQVUsQ0FBQyxPQUFYLENBQ00sSUFBQSxTQUFBLENBQ0Y7QUFBQSxRQUFBLEdBQUEsRUFBSyxTQUFMO0FBQUEsUUFDQSxJQUFBLEVBQU0sV0FETjtBQUFBLFFBRUEsSUFBQSxFQUFNLFFBRk47QUFBQSxRQUdBLEtBQUEsRUFBTyxVQUhQO0FBQUEsUUFJQSxRQUFBLEVBQVUsQ0FBQyxDQUFDLENBQUQsRUFBRyxDQUFILENBQUQsRUFBUSxDQUFDLENBQUQsRUFBRyxFQUFILENBQVIsQ0FKVjtPQURFLENBRE4sQ0FBQSxDQUFBO0FBQUEsTUFTQSxVQUFVLENBQUMsT0FBWCxDQUNNLElBQUEsU0FBQSxDQUNGO0FBQUEsUUFBQSxHQUFBLEVBQUssUUFBTDtBQUFBLFFBQ0EsSUFBQSxFQUFNLFdBRE47QUFBQSxRQUVBLElBQUEsRUFBTSxPQUZOO0FBQUEsUUFHQSxLQUFBLEVBQU8sU0FIUDtB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

//# sourceURL=/Users/ah/.atom/packages/todo-show/spec/todo-collection-spec.coffee
