(function() {
  var TodoCollection, TodoModel, path;

  path = require('path');

  TodoCollection = require('../lib/todo-collection');

  TodoModel = require('../lib/todo-model');

  describe('Todo Collection', function() {
    var addTestTodos, collection, defaultRegex, defaultRegexStr, defaultShowInTable, defaultTodoList, _ref;
    _ref = [], collection = _ref[0], defaultRegexStr = _ref[1], defaultRegex = _ref[2], defaultTodoList = _ref[3], defaultShowInTable = _ref[4];
    addTestTodos = function() {
      collection.addTodo(new TodoModel({
        all: '#FIXME: fixme 1',
        path: 'file1.txt',
        position: [[3, 6], [3, 10]],
        regex: defaultRegexStr,
        regexp: defaultRegex
      }));
      collection.addTodo(new TodoModel({
        all: '#TODO: todo 1',
        path: 'file1.txt',
        position: [[4, 5], [4, 9]],
        regex: defaultRegexStr,
        regexp: defaultRegex
      }));
      return collection.addTodo(new TodoModel({
        all: '#FIXME: fixme 2',
        path: 'file2.txt',
        position: [[5, 7], [5, 11]],
        regex: defaultRegexStr,
        regexp: defaultRegex
      }));
    };
    beforeEach(function() {
      defaultTodoList = ['FIXME', 'TODO'];
      defaultRegexStr = '/\\b(${TODOS}):?\\d*($|\\s.*$)/g';
      defaultRegex = /\b(FIXME|TODO):?\d*($|\s.*$)/g;
      defaultShowInTable = ['Text', 'Type', 'File'];
      collection = new TodoCollection;
      return atom.project.setPaths([path.join(__dirname, 'fixtures/sample1')]);
    });
    describe('createRegex(regexStr, todoList)', function() {
      it('returns a regular expression', function() {
        var regex;
        regex = collection.createRegex(defaultRegexStr, defaultTodoList);
        expect(typeof regex.test).toBe('function');
        expect(typeof regex.exec).toBe('function');
        return expect(regex).toEqual(defaultRegex);
      });
      it('returns false and notifies on invalid input', function() {
        var notification, notificationSpy, regex, regexStr;
        collection.onDidFailSearch(notificationSpy = jasmine.createSpy());
        regexStr = 'arstastTODO:.+$)/g';
        regex = collection.createRegex(regexStr, defaultTodoList);
        expect(regex).toBe(false);
        notification = notificationSpy.mostRecentCall.args[0];
        expect(notificationSpy).toHaveBeenCalled();
        expect(notification.indexOf('Invalid regex')).not.toBe(-1);
        regex = collection.createRegex(defaultRegexStr, 'a string');
        expect(regex).toBe(false);
        regex = collection.createRegex(defaultRegexStr, []);
        expect(regex).toBe(false);
        notification = notificationSpy.mostRecentCall.args[0];
        expect(notificationSpy).toHaveBeenCalled();
        return expect(notification.indexOf('Invalid todo search regex')).not.toBe(-1);
      });
      return it('handles empty input', function() {
        var regex;
        regex = collection.createRegex();
        expect(regex).toBe(false);
        regex = collection.createRegex('', defaultTodoList);
        return expect(regex).toBe(false);
      });
    });
    describe('fetchRegexItem(lookupObj)', function() {
      it('should scan the workspace for the regex that is passed and fill lookup results', function() {
        waitsForPromise(function() {
          return collection.fetchRegexItem(defaultRegex, defaultRegexStr);
        });
        return runs(function() {
          expect(collection.todos).toHaveLength(4);
          expect(collection.todos[0].text).toBe('Comment in C');
          expect(collection.todos[1].text).toBe('This is the first todo');
          expect(collection.todos[2].text).toBe('This is the second todo');
          return expect(collection.todos[3].text).toBe('Add more annnotations :)');
        });
      });
      it('should handle other regexes', function() {
        waitsForPromise(function() {
          return collection.fetchRegexItem(/#include(.+)/g);
        });
        return runs(function() {
          expect(collection.todos).toHaveLength(1);
          return expect(collection.todos[0].text).toBe('<stdio.h>');
        });
      });
      it('should handle special character regexes', function() {
        waitsForPromise(function() {
          return collection.fetchRegexItem(/This is the (?:first|second) todo/g);
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
          regex: ''
        };
        waitsForPromise(function() {
          return collection.fetchRegexItem(/[\w\s]+code[\w\s]*/g);
        });
        return runs(function() {
          expect(collection.todos).toHaveLength(1);
          return expect(collection.todos[0].text).toBe('Sample quicksort code');
        });
      });
      it('should handle post-annotations with special regex', function() {
        waitsForPromise(function() {
          return collection.fetchRegexItem(/(.+).{3}DEBUG\s*$/g);
        });
        return runs(function() {
          expect(collection.todos).toHaveLength(1);
          return expect(collection.todos[0].text).toBe('return sort(Array.apply(this, arguments));');
        });
      });
      it('should handle post-annotations with non-capturing group', function() {
        waitsForPromise(function() {
          return collection.fetchRegexItem(/(.+?(?=.{3}DEBUG\s*$))/);
        });
        return runs(function() {
          expect(collection.todos).toHaveLength(1);
          return expect(collection.todos[0].text).toBe('return sort(Array.apply(this, arguments));');
        });
      });
      it('should truncate todos longer than the defined max length of 120', function() {
        waitsForPromise(function() {
          return collection.fetchRegexItem(/LOONG:?(.+$)/g);
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
          return collection.fetchRegexItem(defaultRegex, defaultRegexStr);
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
          return collection.fetchRegexItem(defaultRegex);
        });
        return runs(function() {
          return expect(collection.todos).toHaveLength(4);
        });
      });
      it('must be an array', function() {
        var notificationSpy;
        collection.onDidFailSearch(notificationSpy = jasmine.createSpy());
        atom.config.set('todo-show.ignoreThesePaths', '123');
        waitsForPromise(function() {
          return collection.fetchRegexItem(defaultRegex);
        });
        return runs(function() {
          var notification;
          expect(collection.todos).toHaveLength(4);
          notification = notificationSpy.mostRecentCall.args[0];
          expect(notificationSpy).toHaveBeenCalled();
          return expect(notification.indexOf('ignoreThesePaths')).not.toBe(-1);
        });
      });
      it('respects ignored files', function() {
        atom.config.set('todo-show.ignoreThesePaths', ['sample.js']);
        waitsForPromise(function() {
          return collection.fetchRegexItem(defaultRegex);
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
          return collection.fetchRegexItem(defaultRegex);
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
          return collection.fetchRegexItem(defaultRegex);
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
          return collection.fetchRegexItem(defaultRegex);
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
          return collection.fetchOpenRegexItem(defaultRegex);
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
            return collection.fetchOpenRegexItem(defaultRegex);
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
          return collection.fetchOpenRegexItem(defaultRegex, defaultRegexStr);
        });
        return runs(function() {
          expect(collection.todos).toHaveLength(1);
          expect(collection.todos[0].type).toBe('TODO');
          return expect(collection.todos[0].text).toBe('New todo');
        });
      });
      it('respects imdone syntax (https://github.com/imdone/imdone-atom)', function() {
        editor.setText('TODO:10 todo1\nTODO:0 todo2');
        waitsForPromise(function() {
          return collection.fetchOpenRegexItem(defaultRegex);
        });
        return runs(function() {
          expect(collection.todos).toHaveLength(2);
          expect(collection.todos[0].type).toBe('TODO');
          expect(collection.todos[0].text).toBe('todo1');
          return expect(collection.todos[1].text).toBe('todo2');
        });
      });
      it('handles number in todo (as long as its not without space)', function() {
        editor.setText("Line 1 //TODO: 1 2 3\nLine 1 // TODO:1 2 3");
        waitsForPromise(function() {
          return collection.fetchOpenRegexItem(defaultRegex);
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
          return collection.fetchOpenRegexItem(defaultRegex);
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
          return collection.fetchOpenRegexItem(defaultRegex);
        });
        return runs(function() {
          expect(collection.todos).toHaveLength(2);
          expect(collection.todos[0].text).toBe('No details');
          return expect(collection.todos[1].text).toBe('No details');
        });
      });
      it('handles todos with @ in front', function() {
        editor.setText("Line 1 // @TODO: text 1\nLine 2 //@TODO: text 2\nLine 3 @TODO: text 3");
        waitsForPromise(function() {
          return collection.fetchOpenRegexItem(defaultRegex);
        });
        return runs(function() {
          expect(collection.todos).toHaveLength(3);
          expect(collection.todos[0].text).toBe('text 1');
          expect(collection.todos[1].text).toBe('text 2');
          return expect(collection.todos[2].text).toBe('text 3');
        });
      });
      it('handles tabs in todos', function() {
        editor.setText('Line //TODO:\ttext');
        waitsForPromise(function() {
          return collection.fetchOpenRegexItem(defaultRegex);
        });
        return runs(function() {
          return expect(collection.todos[0].text).toBe('text');
        });
      });
      it('handles todo without semicolon', function() {
        editor.setText('A line // TODO text');
        waitsForPromise(function() {
          return collection.fetchOpenRegexItem(defaultRegex);
        });
        return runs(function() {
          return expect(collection.todos[0].text).toBe('text');
        });
      });
      it('ignores todos without leading space', function() {
        editor.setText('A line // TODO:text');
        waitsForPromise(function() {
          return collection.fetchOpenRegexItem(defaultRegex);
        });
        return runs(function() {
          return expect(collection.todos).toHaveLength(0);
        });
      });
      it('ignores todo if unwanted chars are present', function() {
        editor.setText('define("_JS_TODO_ALERT_", "js:alert(&quot;TODO&quot;);");');
        waitsForPromise(function() {
          return collection.fetchOpenRegexItem(defaultRegex);
        });
        return runs(function() {
          return expect(collection.todos).toHaveLength(0);
        });
      });
      it('ignores binary data', function() {
        editor.setText('// TODOe�d��RPPP0�');
        waitsForPromise(function() {
          return collection.fetchOpenRegexItem(defaultRegex);
        });
        return runs(function() {
          return expect(collection.todos).toHaveLength(0);
        });
      });
      return it('does not add duplicates', function() {
        addTestTodos();
        expect(collection.todos).toHaveLength(3);
        addTestTodos();
        return expect(collection.todos).toHaveLength(3);
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
      it('sort by other values', function() {
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
      return it('sort line as number', function() {
        collection.addTodo(new TodoModel({
          all: '#FIXME: fixme 3',
          path: 'file3.txt',
          position: [[12, 14], [12, 16]],
          regex: defaultRegexStr,
          regexp: defaultRegex
        }));
        collection.sortTodos({
          sortBy: 'Line',
          sortAsc: true
        });
        expect(collection.todos[0].line).toBe('4');
        expect(collection.todos[1].line).toBe('5');
        expect(collection.todos[2].line).toBe('6');
        expect(collection.todos[3].line).toBe('13');
        collection.sortTodos({
          sortBy: 'Range',
          sortAsc: true
        });
        expect(collection.todos[0].range).toBe('3,6,3,10');
        expect(collection.todos[1].range).toBe('4,5,4,9');
        expect(collection.todos[2].range).toBe('5,7,5,11');
        return expect(collection.todos[3].range).toBe('12,14,12,16');
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
        collection.filterTodos('TODO');
        expect(filterSpy.callCount).toBe(1);
        return expect(filterSpy.calls[0].args[0]).toHaveLength(1);
      });
      it('can filter todos with multiple results', function() {
        collection.filterTodos('file1');
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
        atom.config.set('todo-show.findTheseTodos', defaultTodoList);
        return atom.config.set('todo-show.showInTable', defaultShowInTable);
      });
      it('creates a markdown string from regexes', function() {
        addTestTodos();
        return expect(collection.getMarkdown()).toEqual("- fixme 1 __FIXME__ [file1.txt](file1.txt)\n- todo 1 __TODO__ [file1.txt](file1.txt)\n- fixme 2 __FIXME__ [file2.txt](file2.txt)\n");
      });
      it('creates markdown with sorting', function() {
        addTestTodos();
        collection.sortTodos({
          sortBy: 'Text',
          sortAsc: true
        });
        return expect(collection.getMarkdown()).toEqual("- fixme 1 __FIXME__ [file1.txt](file1.txt)\n- fixme 2 __FIXME__ [file2.txt](file2.txt)\n- todo 1 __TODO__ [file1.txt](file1.txt)\n");
      });
      it('creates markdown with inverse sorting', function() {
        addTestTodos();
        collection.sortTodos({
          sortBy: 'Text',
          sortAsc: false
        });
        return expect(collection.getMarkdown()).toEqual("- todo 1 __TODO__ [file1.txt](file1.txt)\n- fixme 2 __FIXME__ [file2.txt](file2.txt)\n- fixme 1 __FIXME__ [file1.txt](file1.txt)\n");
      });
      it('creates markdown with different items', function() {
        addTestTodos();
        atom.config.set('todo-show.showInTable', ['Type', 'File', 'Range']);
        return expect(collection.getMarkdown()).toEqual("- __FIXME__ [file1.txt](file1.txt) _:3,6,3,10_\n- __TODO__ [file1.txt](file1.txt) _:4,5,4,9_\n- __FIXME__ [file2.txt](file2.txt) _:5,7,5,11_\n");
      });
      it('creates markdown as table', function() {
        addTestTodos();
        atom.config.set('todo-show.saveOutputAs', 'Table');
        return expect(collection.getMarkdown()).toEqual("| Text | Type | File |\n|--------------------|\n| fixme 1 | __FIXME__ | [file1.txt](file1.txt) |\n| todo 1 | __TODO__ | [file1.txt](file1.txt) |\n| fixme 2 | __FIXME__ | [file2.txt](file2.txt) |\n");
      });
      it('creates markdown as table with different items', function() {
        addTestTodos();
        atom.config.set('todo-show.saveOutputAs', 'Table');
        atom.config.set('todo-show.showInTable', ['Type', 'File', 'Range']);
        return expect(collection.getMarkdown()).toEqual("| Type | File | Range |\n|---------------------|\n| __FIXME__ | [file1.txt](file1.txt) | _:3,6,3,10_ |\n| __TODO__ | [file1.txt](file1.txt) | _:4,5,4,9_ |\n| __FIXME__ | [file2.txt](file2.txt) | _:5,7,5,11_ |\n");
      });
      it('accepts missing ranges and paths in regexes', function() {
        var markdown;
        collection.addTodo(new TodoModel({
          text: 'fixme 1',
          type: 'FIXME'
        }, {
          plain: true
        }));
        expect(collection.getMarkdown()).toEqual("- fixme 1 __FIXME__\n");
        atom.config.set('todo-show.showInTable', ['Type', 'File', 'Range', 'Text']);
        markdown = '\n## Unknown File\n\n- fixme 1 `FIXMEs`\n';
        return expect(collection.getMarkdown()).toEqual("- __FIXME__ fixme 1\n");
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
          type: 'FIXME'
        }, {
          plain: true
        }));
        atom.config.set('todo-show.saveOutputAs', 'Table');
        expect(collection.getMarkdown()).toEqual("| Text | Type | File |\n|--------------------|\n| fixme 1 | __FIXME__ | |\n");
        atom.config.set('todo-show.showInTable', ['Line']);
        return expect(collection.getMarkdown()).toEqual("| Line |\n|------|\n| |\n");
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RvZG8tc2hvdy9zcGVjL3RvZG8tY29sbGVjdGlvbi1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwrQkFBQTs7QUFBQSxFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUFQLENBQUE7O0FBQUEsRUFFQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSx3QkFBUixDQUZqQixDQUFBOztBQUFBLEVBR0EsU0FBQSxHQUFZLE9BQUEsQ0FBUSxtQkFBUixDQUhaLENBQUE7O0FBQUEsRUFLQSxRQUFBLENBQVMsaUJBQVQsRUFBNEIsU0FBQSxHQUFBO0FBQzFCLFFBQUEsa0dBQUE7QUFBQSxJQUFBLE9BQW1GLEVBQW5GLEVBQUMsb0JBQUQsRUFBYSx5QkFBYixFQUE4QixzQkFBOUIsRUFBNEMseUJBQTVDLEVBQTZELDRCQUE3RCxDQUFBO0FBQUEsSUFFQSxZQUFBLEdBQWUsU0FBQSxHQUFBO0FBQ2IsTUFBQSxVQUFVLENBQUMsT0FBWCxDQUNNLElBQUEsU0FBQSxDQUNGO0FBQUEsUUFBQSxHQUFBLEVBQUssaUJBQUw7QUFBQSxRQUNBLElBQUEsRUFBTSxXQUROO0FBQUEsUUFFQSxRQUFBLEVBQVUsQ0FBQyxDQUFDLENBQUQsRUFBRyxDQUFILENBQUQsRUFBUSxDQUFDLENBQUQsRUFBRyxFQUFILENBQVIsQ0FGVjtBQUFBLFFBR0EsS0FBQSxFQUFPLGVBSFA7QUFBQSxRQUlBLE1BQUEsRUFBUSxZQUpSO09BREUsQ0FETixDQUFBLENBQUE7QUFBQSxNQVNBLFVBQVUsQ0FBQyxPQUFYLENBQ00sSUFBQSxTQUFBLENBQ0Y7QUFBQSxRQUFBLEdBQUEsRUFBSyxlQUFMO0FBQUEsUUFDQSxJQUFBLEVBQU0sV0FETjtBQUFBLFFBRUEsUUFBQSxFQUFVLENBQUMsQ0FBQyxDQUFELEVB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

//# sourceURL=/Users/ah/.atom/packages/todo-show/spec/todo-collection-spec.coffee
