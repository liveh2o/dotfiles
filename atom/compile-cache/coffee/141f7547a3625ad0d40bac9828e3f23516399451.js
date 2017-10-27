(function() {
  var TodoCollection, TodoModel, TodoRegex, fixturesPath, getConfigSchema, path, sample1Path, sample2Path;

  path = require('path');

  TodoCollection = require('../lib/todo-collection');

  TodoModel = require('../lib/todo-model');

  TodoRegex = require('../lib/todo-regex');

  getConfigSchema = require('./helpers').getConfigSchema;

  sample1Path = path.join(__dirname, 'fixtures/sample1');

  sample2Path = path.join(__dirname, 'fixtures/sample2');

  fixturesPath = path.join(__dirname, 'fixtures');

  describe('Todo Collection', function() {
    var addTestTodos, collection, defaultConfig, defaultShowInTable, ref, todoRegex;
    ref = [], collection = ref[0], todoRegex = ref[1], defaultShowInTable = ref[2], defaultConfig = ref[3];
    addTestTodos = function() {
      collection.addTodo(new TodoModel({
        all: '#FIXME: fixme 1',
        loc: 'file1.txt',
        position: [[3, 6], [3, 10]],
        regex: todoRegex.regex,
        regexp: todoRegex.regexp
      }));
      collection.addTodo(new TodoModel({
        all: '#TODO: todo 1',
        loc: 'file1.txt',
        position: [[4, 5], [4, 9]],
        regex: todoRegex.regex,
        regexp: todoRegex.regexp
      }));
      return collection.addTodo(new TodoModel({
        all: '#FIXME: fixme 2',
        loc: 'file2.txt',
        position: [[5, 7], [5, 11]],
        regex: todoRegex.regex,
        regexp: todoRegex.regexp
      }));
    };
    beforeEach(function() {
      getConfigSchema(function(configSchema) {
        todoRegex = new TodoRegex(configSchema.findUsingRegex["default"], ['FIXME', 'TODO']);
        defaultShowInTable = ['Text', 'Type', 'File'];
        collection = new TodoCollection;
        return atom.project.setPaths([sample1Path]);
      });
      return waitsFor(function() {
        return todoRegex !== void 0;
      });
    });
    describe('fetchRegexItem(todoRegex)', function() {
      it('scans project for regex', function() {
        waitsForPromise(function() {
          return collection.fetchRegexItem(todoRegex);
        });
        return runs(function() {
          expect(collection.todos).toHaveLength(4);
          expect(collection.todos[0].text).toBe('Comment in C');
          expect(collection.todos[1].text).toBe('This is the first todo');
          expect(collection.todos[2].text).toBe('This is the second todo');
          return expect(collection.todos[3].text).toBe('Add more annnotations :)');
        });
      });
      it('scans full workspace', function() {
        atom.project.addPath(sample2Path);
        waitsForPromise(function() {
          return collection.fetchRegexItem(todoRegex);
        });
        return runs(function() {
          return expect(collection.todos).toHaveLength(10);
        });
      });
      it('should handle other regexes', function() {
        waitsForPromise(function() {
          todoRegex.regexp = /#include(.+)/g;
          return collection.fetchRegexItem(todoRegex);
        });
        return runs(function() {
          expect(collection.todos).toHaveLength(1);
          return expect(collection.todos[0].text).toBe('<stdio.h>');
        });
      });
      it('should handle special character regexes', function() {
        waitsForPromise(function() {
          todoRegex.regexp = /This is the (?:first|second) todo/g;
          return collection.fetchRegexItem(todoRegex);
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
          todoRegex.regexp = /[\w\s]+code[\w\s]*/g;
          return collection.fetchRegexItem(todoRegex);
        });
        return runs(function() {
          expect(collection.todos).toHaveLength(1);
          return expect(collection.todos[0].text).toBe('Sample quicksort code');
        });
      });
      it('should handle post-annotations with special regex', function() {
        waitsForPromise(function() {
          todoRegex.regexp = /(.+).{3}DEBUG\s*$/g;
          return collection.fetchRegexItem(todoRegex);
        });
        return runs(function() {
          expect(collection.todos).toHaveLength(1);
          return expect(collection.todos[0].text).toBe('return sort(Array.apply(this, arguments));');
        });
      });
      it('should handle post-annotations with non-capturing group', function() {
        waitsForPromise(function() {
          todoRegex.regexp = /(.+?(?=.{3}DEBUG\s*$))/;
          return collection.fetchRegexItem(todoRegex);
        });
        return runs(function() {
          expect(collection.todos).toHaveLength(1);
          return expect(collection.todos[0].text).toBe('return sort(Array.apply(this, arguments));');
        });
      });
      it('should truncate todos longer than the defined max length of 120', function() {
        waitsForPromise(function() {
          todoRegex.regexp = /LOONG:?(.+$)/g;
          return collection.fetchRegexItem(todoRegex);
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
        atom.project.setPaths([sample2Path]);
        waitsForPromise(function() {
          return collection.fetchRegexItem(todoRegex);
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
    describe('fetchRegexItem(todoRegex, activeProjectOnly)', function() {
      beforeEach(function() {
        return atom.project.addPath(sample2Path);
      });
      it('scans active project for regex', function() {
        collection.setActiveProject(sample1Path);
        waitsForPromise(function() {
          return collection.fetchRegexItem(todoRegex, true);
        });
        return runs(function() {
          expect(collection.todos).toHaveLength(4);
          expect(collection.todos[0].text).toBe('Comment in C');
          expect(collection.todos[1].text).toBe('This is the first todo');
          expect(collection.todos[2].text).toBe('This is the second todo');
          return expect(collection.todos[3].text).toBe('Add more annnotations :)');
        });
      });
      it('changes active project', function() {
        collection.setActiveProject(sample2Path);
        waitsForPromise(function() {
          return collection.fetchRegexItem(todoRegex, true);
        });
        return runs(function() {
          expect(collection.todos).toHaveLength(6);
          collection.clear();
          collection.setActiveProject(sample1Path);
          waitsForPromise(function() {
            return collection.fetchRegexItem(todoRegex, true);
          });
          return runs(function() {
            return expect(collection.todos).toHaveLength(4);
          });
        });
      });
      it('still respects ignored paths', function() {
        atom.config.set('todo-show.ignoreThesePaths', ['sample.js']);
        waitsForPromise(function() {
          return collection.fetchRegexItem(todoRegex, true);
        });
        return runs(function() {
          expect(collection.todos).toHaveLength(1);
          return expect(collection.todos[0].text).toBe('Comment in C');
        });
      });
      return it('handles no project situations', function() {
        expect(collection.activeProject).not.toBeDefined();
        expect(path.basename(collection.getActiveProject())).toBe('sample1');
        atom.project.setPaths([]);
        collection.activeProject = void 0;
        waitsForPromise(function() {
          return collection.fetchRegexItem(todoRegex, true);
        });
        return runs(function() {
          return expect(collection.todos).toHaveLength(0);
        });
      });
    });
    describe('ignore path rules', function() {
      it('works with no paths added', function() {
        atom.config.set('todo-show.ignoreThesePaths', []);
        waitsForPromise(function() {
          return collection.fetchRegexItem(todoRegex);
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
          return collection.fetchRegexItem(todoRegex);
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
          return collection.fetchRegexItem(todoRegex);
        });
        return runs(function() {
          expect(collection.todos).toHaveLength(1);
          return expect(collection.todos[0].text).toBe('Comment in C');
        });
      });
      it('respects ignored directories and filetypes', function() {
        atom.project.setPaths([fixturesPath]);
        atom.config.set('todo-show.ignoreThesePaths', ['sample1', '*.md']);
        waitsForPromise(function() {
          return collection.fetchRegexItem(todoRegex);
        });
        return runs(function() {
          expect(collection.todos).toHaveLength(6);
          return expect(collection.todos[0].text).toBe('C block comment');
        });
      });
      it('respects ignored wildcard directories', function() {
        atom.project.setPaths([fixturesPath]);
        atom.config.set('todo-show.ignoreThesePaths', ['**/sample.js', '**/sample.txt', '*.md']);
        waitsForPromise(function() {
          return collection.fetchRegexItem(todoRegex);
        });
        return runs(function() {
          expect(collection.todos).toHaveLength(1);
          return expect(collection.todos[0].text).toBe('Comment in C');
        });
      });
      return it('respects more advanced ignores', function() {
        atom.project.setPaths([fixturesPath]);
        atom.config.set('todo-show.ignoreThesePaths', ['output(-grouped)?\\.*', '*1/**']);
        waitsForPromise(function() {
          return collection.fetchRegexItem(todoRegex);
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
          return collection.fetchOpenRegexItem(todoRegex);
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
            return collection.fetchOpenRegexItem(todoRegex);
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
          return collection.fetchOpenRegexItem(todoRegex);
        });
        return runs(function() {
          expect(collection.todos).toHaveLength(1);
          expect(collection.todos[0].type).toBe('TODO');
          return expect(collection.todos[0].text).toBe('New todo');
        });
      });
      it('ignores todo without leading space', function() {
        editor.setText('A line // TODO:text');
        waitsForPromise(function() {
          return collection.fetchOpenRegexItem(todoRegex);
        });
        return runs(function() {
          return expect(collection.todos).toHaveLength(0);
        });
      });
      it('ignores todo with unwanted characters', function() {
        editor.setText('define("_JS_TODO_ALERT_", "js:alert(&quot;TODO&quot;);");');
        waitsForPromise(function() {
          return collection.fetchOpenRegexItem(todoRegex);
        });
        return runs(function() {
          return expect(collection.todos).toHaveLength(0);
        });
      });
      it('ignores binary data', function() {
        editor.setText('// TODOe�d��RPPP0�');
        waitsForPromise(function() {
          return collection.fetchOpenRegexItem(todoRegex);
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
    describe('getActiveProject', function() {
      beforeEach(function() {
        return atom.project.addPath(sample2Path);
      });
      it('returns active project', function() {
        collection.activeProject = sample2Path;
        return expect(collection.getActiveProject()).toBe(sample2Path);
      });
      it('falls back to first project', function() {
        return expect(collection.getActiveProject()).toBe(sample1Path);
      });
      it('falls back to first open item', function() {
        waitsForPromise(function() {
          return atom.workspace.open(path.join(sample2Path, 'sample.txt'));
        });
        return runs(function() {
          return expect(collection.getActiveProject()).toBe(sample2Path);
        });
      });
      return it('handles no project paths', function() {
        atom.project.setPaths([]);
        expect(collection.getActiveProject()).toBeFalsy();
        return expect(collection.activeProject).not.toBeDefined();
      });
    });
    describe('setActiveProject', function() {
      it('sets active project from file path and returns true if changed', function() {
        var res;
        atom.project.addPath(sample2Path);
        expect(collection.getActiveProject()).toBe(sample1Path);
        res = collection.setActiveProject(path.join(sample2Path, 'sample.txt'));
        expect(res).toBe(true);
        expect(collection.getActiveProject()).toBe(sample2Path);
        res = collection.setActiveProject(path.join(sample2Path, 'sample.txt'));
        return expect(res).toBe(false);
      });
      it('ignores if file is not in project', function() {
        var res;
        res = collection.setActiveProject(path.join(sample2Path, 'sample.txt'));
        expect(res).toBe(false);
        return expect(collection.getActiveProject()).toBe(sample1Path);
      });
      return it('handles invalid arguments', function() {
        expect(collection.setActiveProject()).toBe(false);
        expect(collection.activeProject).not.toBeDefined();
        expect(collection.setActiveProject(false)).toBe(false);
        expect(collection.activeProject).not.toBeDefined();
        expect(collection.setActiveProject({})).toBe(false);
        return expect(collection.activeProject).not.toBeDefined();
      });
    });
    describe('Sort todos', function() {
      var sortSpy;
      sortSpy = [].sortSpy;
      beforeEach(function() {
        addTestTodos();
        collection.addTodo(new TodoModel({
          all: '#FIXME: fixme 3',
          loc: 'file1.txt',
          position: [[12, 14], [12, 16]],
          regex: todoRegex.regex,
          regexp: todoRegex.regexp
        }));
        atom.config.set('todo-show.findTheseTodos', ['FIXME', 'TODO']);
        sortSpy = jasmine.createSpy();
        return collection.onDidSortTodos(sortSpy);
      });
      it('can sort simple todos', function() {
        collection.sortTodos({
          sortBy: 'Text',
          sortAsc: false
        });
        expect(collection.todos[0].text).toBe('todo 1');
        expect(collection.todos[3].text).toBe('fixme 1');
        collection.sortTodos({
          sortBy: 'Text',
          sortAsc: true
        });
        expect(collection.todos[0].text).toBe('fixme 1');
        expect(collection.todos[3].text).toBe('todo 1');
        collection.sortTodos({
          sortBy: 'Text'
        });
        expect(collection.todos[0].text).toBe('todo 1');
        expect(collection.todos[3].text).toBe('fixme 1');
        collection.sortTodos({
          sortAsc: true
        });
        expect(collection.todos[0].text).toBe('fixme 1');
        expect(collection.todos[3].text).toBe('todo 1');
        collection.sortTodos();
        expect(collection.todos[0].text).toBe('todo 1');
        return expect(collection.todos[3].text).toBe('fixme 1');
      });
      it('sort by other values', function() {
        collection.sortTodos({
          sortBy: 'Range',
          sortAsc: true
        });
        expect(collection.todos[0].range).toBe('3,6,3,10');
        expect(collection.todos[2].range).toBe('5,7,5,11');
        expect(collection.todos[3].range).toBe('12,14,12,16');
        collection.sortTodos({
          sortBy: 'File',
          sortAsc: false
        });
        expect(collection.todos[0].path).toBe('file2.txt');
        return expect(collection.todos[3].path).toBe('file1.txt');
      });
      it('sort line as number', function() {
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
      it('performs a stable sort', function() {
        collection.sortTodos({
          sortBy: 'File',
          sortAsc: true
        });
        expect(collection.todos[0].text).toBe('fixme 1');
        expect(collection.todos[1].text).toBe('fixme 3');
        expect(collection.todos[2].text).toBe('todo 1');
        expect(collection.todos[3].text).toBe('fixme 2');
        collection.sortTodos({
          sortBy: 'Text',
          sortAsc: false
        });
        expect(collection.todos[0].text).toBe('todo 1');
        expect(collection.todos[1].text).toBe('fixme 3');
        expect(collection.todos[2].text).toBe('fixme 2');
        expect(collection.todos[3].text).toBe('fixme 1');
        collection.sortTodos({
          sortBy: 'File',
          sortAsc: true
        });
        expect(collection.todos[0].text).toBe('todo 1');
        expect(collection.todos[1].text).toBe('fixme 3');
        expect(collection.todos[2].text).toBe('fixme 1');
        expect(collection.todos[3].text).toBe('fixme 2');
        collection.sortTodos({
          sortBy: 'Type',
          sortAsc: true
        });
        expect(collection.todos[0].text).toBe('fixme 3');
        expect(collection.todos[1].text).toBe('fixme 1');
        expect(collection.todos[2].text).toBe('fixme 2');
        return expect(collection.todos[3].text).toBe('todo 1');
      });
      return it('sorts type in the defined order', function() {
        collection.sortTodos({
          sortBy: 'Type',
          sortAsc: true
        });
        expect(collection.todos[0].text).toBe('fixme 1');
        expect(collection.todos[1].text).toBe('fixme 2');
        expect(collection.todos[2].text).toBe('fixme 3');
        expect(collection.todos[3].text).toBe('todo 1');
        atom.config.set('todo-show.findTheseTodos', ['TODO', 'FIXME']);
        collection.sortTodos({
          sortBy: 'Type',
          sortAsc: true
        });
        expect(collection.todos[0].text).toBe('todo 1');
        expect(collection.todos[1].text).toBe('fixme 1');
        expect(collection.todos[2].text).toBe('fixme 2');
        expect(collection.todos[3].text).toBe('fixme 3');
        collection.sortTodos({
          sortBy: 'Type',
          sortAsc: false
        });
        expect(collection.todos[0].text).toBe('fixme 3');
        expect(collection.todos[1].text).toBe('fixme 2');
        expect(collection.todos[2].text).toBe('fixme 1');
        return expect(collection.todos[3].text).toBe('todo 1');
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
      it('handles empty filter', function() {
        collection.filterTodos('');
        expect(filterSpy.callCount).toBe(1);
        return expect(filterSpy.calls[0].args[0]).toHaveLength(3);
      });
      return it('case insensitive filter', function() {
        var result;
        collection.addTodo(new TodoModel({
          all: '#FIXME: THIS IS WITH CAPS',
          loc: 'file2.txt',
          position: [[6, 7], [6, 11]],
          regex: todoRegex.regex,
          regexp: todoRegex.regexp
        }));
        collection.filterTodos('FIXME 1');
        result = filterSpy.calls[0].args[0];
        expect(filterSpy.callCount).toBe(1);
        expect(result).toHaveLength(1);
        expect(result[0].text).toBe('fixme 1');
        collection.filterTodos('caps');
        result = filterSpy.calls[1].args[0];
        expect(filterSpy.callCount).toBe(2);
        expect(result).toHaveLength(1);
        expect(result[0].text).toBe('THIS IS WITH CAPS');
        collection.filterTodos('NONEXISTING');
        result = filterSpy.calls[2].args[0];
        expect(filterSpy.callCount).toBe(3);
        return expect(result).toHaveLength(0);
      });
    });
    return describe('Markdown', function() {
      beforeEach(function() {
        atom.config.set('todo-show.findTheseTodos', ['FIXME', 'TODO']);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RvZG8tc2hvdy9zcGVjL3RvZG8tY29sbGVjdGlvbi1zcGVjLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUVQLGNBQUEsR0FBaUIsT0FBQSxDQUFRLHdCQUFSOztFQUNqQixTQUFBLEdBQVksT0FBQSxDQUFRLG1CQUFSOztFQUNaLFNBQUEsR0FBWSxPQUFBLENBQVEsbUJBQVI7O0VBQ1gsa0JBQW1CLE9BQUEsQ0FBUSxXQUFSOztFQUVwQixXQUFBLEdBQWMsSUFBSSxDQUFDLElBQUwsQ0FBVSxTQUFWLEVBQXFCLGtCQUFyQjs7RUFDZCxXQUFBLEdBQWMsSUFBSSxDQUFDLElBQUwsQ0FBVSxTQUFWLEVBQXFCLGtCQUFyQjs7RUFDZCxZQUFBLEdBQWUsSUFBSSxDQUFDLElBQUwsQ0FBVSxTQUFWLEVBQXFCLFVBQXJCOztFQUVmLFFBQUEsQ0FBUyxpQkFBVCxFQUE0QixTQUFBO0FBQzFCLFFBQUE7SUFBQSxNQUE2RCxFQUE3RCxFQUFDLG1CQUFELEVBQWEsa0JBQWIsRUFBd0IsMkJBQXhCLEVBQTRDO0lBRTVDLFlBQUEsR0FBZSxTQUFBO01BQ2IsVUFBVSxDQUFDLE9BQVgsQ0FDTSxJQUFBLFNBQUEsQ0FDRjtRQUFBLEdBQUEsRUFBSyxpQkFBTDtRQUNBLEdBQUEsRUFBSyxXQURMO1FBRUEsUUFBQSxFQUFVLENBQUMsQ0FBQyxDQUFELEVBQUcsQ0FBSCxDQUFELEVBQVEsQ0FBQyxDQUFELEVBQUcsRUFBSCxDQUFSLENBRlY7UUFHQSxLQUFBLEVBQU8sU0FBUyxDQUFDLEtBSGpCO1FBSUEsTUFBQSxFQUFRLFNBQVMsQ0FBQyxNQUpsQjtPQURFLENBRE47TUFTQSxVQUFVLENBQUMsT0FBWCxDQUNNLElBQUEsU0FBQSxDQUNGO1FBQUEsR0FBQSxFQUFLLGVBQUw7UUFDQSxH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QUgsRUFBNEMsU0FBQTtRQUMxQyxVQUFVLENBQUMsT0FBWCxDQUNNLElBQUEsU0FBQSxDQUNGO1VBQUEsSUFBQSxFQUFNLFNBQU47VUFDQSxJQUFBLEVBQU0sT0FETjtTQURFLEVBR0Y7VUFBQSxLQUFBLEVBQU8sSUFBUDtTQUhFLENBRE47UUFNQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isd0JBQWhCLEVBQTBDLE9BQTFDO1FBQ0EsTUFBQSxDQUFPLFVBQVUsQ0FBQyxXQUFYLENBQUEsQ0FBUCxDQUFnQyxDQUFDLE9BQWpDLENBQXlDLDZFQUF6QztRQU1BLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix1QkFBaEIsRUFBeUMsQ0FBQyxNQUFELENBQXpDO2VBQ0EsTUFBQSxDQUFPLFVBQVUsQ0FBQyxXQUFYLENBQUEsQ0FBUCxDQUFnQyxDQUFDLE9BQWpDLENBQXlDLDJCQUF6QztNQWYwQyxDQUE1QztJQWhHbUIsQ0FBckI7RUE5Z0IwQixDQUE1QjtBQVhBIiwic291cmNlc0NvbnRlbnQiOlsicGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG5cblRvZG9Db2xsZWN0aW9uID0gcmVxdWlyZSAnLi4vbGliL3RvZG8tY29sbGVjdGlvbidcblRvZG9Nb2RlbCA9IHJlcXVpcmUgJy4uL2xpYi90b2RvLW1vZGVsJ1xuVG9kb1JlZ2V4ID0gcmVxdWlyZSAnLi4vbGliL3RvZG8tcmVnZXgnXG57Z2V0Q29uZmlnU2NoZW1hfSA9IHJlcXVpcmUgJy4vaGVscGVycydcblxuc2FtcGxlMVBhdGggPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZml4dHVyZXMvc2FtcGxlMScpXG5zYW1wbGUyUGF0aCA9IHBhdGguam9pbihfX2Rpcm5hbWUsICdmaXh0dXJlcy9zYW1wbGUyJylcbmZpeHR1cmVzUGF0aCA9IHBhdGguam9pbihfX2Rpcm5hbWUsICdmaXh0dXJlcycpXG5cbmRlc2NyaWJlICdUb2RvIENvbGxlY3Rpb24nLCAtPlxuICBbY29sbGVjdGlvbiwgdG9kb1JlZ2V4LCBkZWZhdWx0U2hvd0luVGFibGUsIGRlZmF1bHRDb25maWddID0gW11cblxuICBhZGRUZXN0VG9kb3MgPSAtPlxuICAgIGNvbGxlY3Rpb24uYWRkVG9kbyhcbiAgICAgIG5ldyBUb2RvTW9kZWwoXG4gICAgICAgIGFsbDogJyNGSVhNRTogZml4bWUgMSdcbiAgICAgICAgbG9jOiAnZmlsZTEudHh0J1xuICAgICAgICBwb3NpdGlvbjogW1szLDZdLCBbMywxMF1dXG4gICAgICAgIHJlZ2V4OiB0b2RvUmVnZXgucmVnZXhcbiAgICAgICAgcmVnZXhwOiB0b2RvUmVnZXgucmVnZXhwXG4gICAgICApXG4gICAgKVxuICAgIGNvbGxlY3Rpb24uYWRkVG9kbyhcbiAgICAgIG5ldyBUb2RvTW9kZWwoXG4gICAgICAgIGFsbDogJyNUT0RPOiB0b2RvIDEnXG4gICAgICAgIGxvYzogJ2ZpbGUxLnR4dCdcbiAgICAgICAgcG9zaXRpb246IFtbNCw1XSwgWzQsOV1dXG4gICAgICAgIHJlZ2V4OiB0b2RvUmVnZXgucmVnZXhcbiAgICAgICAgcmVnZXhwOiB0b2RvUmVnZXgucmVnZXhwXG4gICAgICApXG4gICAgKVxuICAgIGNvbGxlY3Rpb24uYWRkVG9kbyhcbiAgICAgIG5ldyBUb2RvTW9kZWwoXG4gICAgICAgIGFsbDogJyNGSVhNRTogZml4bWUgMidcbiAgICAgICAgbG9jOiAnZmlsZTIudHh0J1xuICAgICAgICBwb3NpdGlvbjogW1s1LDddLCBbNSwxMV1dXG4gICAgICAgIHJlZ2V4OiB0b2RvUmVnZXgucmVnZXhcbiAgICAgICAgcmVnZXhwOiB0b2RvUmVnZXgucmVnZXhwXG4gICAgICApXG4gICAgKVxuXG4gIGJlZm9yZUVhY2ggLT5cbiAgICBnZXRDb25maWdTY2hlbWEgKGNvbmZpZ1NjaGVtYSkgLT5cbiAgICAgIHRvZG9SZWdleCA9IG5ldyBUb2RvUmVnZXgoXG4gICAgICAgIGNvbmZpZ1NjaGVtYS5maW5kVXNpbmdSZWdleC5kZWZhdWx0XG4gICAgICAgIFsnRklYTUUnLCAnVE9ETyddXG4gICAgICApXG4gICAgICBkZWZhdWx0U2hvd0luVGFibGUgPSBbJ1RleHQnLCAnVHlwZScsICdGaWxlJ11cblxuICAgICAgY29sbGVjdGlvbiA9IG5ldyBUb2RvQ29sbGVjdGlvblxuICAgICAgYXRvbS5wcm9qZWN0LnNldFBhdGhzIFtzYW1wbGUxUGF0aF1cbiAgICB3YWl0c0ZvciAtPiB0b2RvUmVnZXggaXNudCB1bmRlZmluZWRcblxuICBkZXNjcmliZSAnZmV0Y2hSZWdleEl0ZW0odG9kb1JlZ2V4KScsIC0+XG4gICAgaXQgJ3NjYW5zIHByb2plY3QgZm9yIHJlZ2V4JywgLT5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICBjb2xsZWN0aW9uLmZldGNoUmVnZXhJdGVtKHRvZG9SZWdleClcblxuICAgICAgcnVucyAtPlxuICAgICAgICBleHBlY3QoY29sbGVjdGlvbi50b2RvcykudG9IYXZlTGVuZ3RoIDRcbiAgICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9kb3NbMF0udGV4dCkudG9CZSAnQ29tbWVudCBpbiBDJ1xuICAgICAgICBleHBlY3QoY29sbGVjdGlvbi50b2Rvc1sxXS50ZXh0KS50b0JlICdUaGlzIGlzIHRoZSBmaXJzdCB0b2RvJ1xuICAgICAgICBleHBlY3QoY29sbGVjdGlvbi50b2Rvc1syXS50ZXh0KS50b0JlICdUaGlzIGlzIHRoZSBzZWNvbmQgdG9kbydcbiAgICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9kb3NbM10udGV4dCkudG9CZSAnQWRkIG1vcmUgYW5ubm90YXRpb25zIDopJ1xuXG4gICAgaXQgJ3NjYW5zIGZ1bGwgd29ya3NwYWNlJywgLT5cbiAgICAgIGF0b20ucHJvamVjdC5hZGRQYXRoIHNhbXBsZTJQYXRoXG4gICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgY29sbGVjdGlvbi5mZXRjaFJlZ2V4SXRlbSh0b2RvUmVnZXgpXG4gICAgICBydW5zIC0+XG4gICAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZG9zKS50b0hhdmVMZW5ndGggMTBcblxuICAgIGl0ICdzaG91bGQgaGFuZGxlIG90aGVyIHJlZ2V4ZXMnLCAtPlxuICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgIHRvZG9SZWdleC5yZWdleHAgPSAvI2luY2x1ZGUoLispL2dcbiAgICAgICAgY29sbGVjdGlvbi5mZXRjaFJlZ2V4SXRlbSh0b2RvUmVnZXgpXG4gICAgICBydW5zIC0+XG4gICAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZG9zKS50b0hhdmVMZW5ndGggMVxuICAgICAgICBleHBlY3QoY29sbGVjdGlvbi50b2Rvc1swXS50ZXh0KS50b0JlICc8c3RkaW8uaD4nXG5cbiAgICBpdCAnc2hvdWxkIGhhbmRsZSBzcGVjaWFsIGNoYXJhY3RlciByZWdleGVzJywgLT5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICB0b2RvUmVnZXgucmVnZXhwID0gL1RoaXMgaXMgdGhlICg/OmZpcnN0fHNlY29uZCkgdG9kby9nXG4gICAgICAgIGNvbGxlY3Rpb24uZmV0Y2hSZWdleEl0ZW0odG9kb1JlZ2V4KVxuICAgICAgcnVucyAtPlxuICAgICAgICBleHBlY3QoY29sbGVjdGlvbi50b2RvcykudG9IYXZlTGVuZ3RoIDJcbiAgICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9kb3NbMF0udGV4dCkudG9CZSAnVGhpcyBpcyB0aGUgZmlyc3QgdG9kbydcbiAgICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9kb3NbMV0udGV4dCkudG9CZSAnVGhpcyBpcyB0aGUgc2Vjb25kIHRvZG8nXG5cbiAgICBpdCAnc2hvdWxkIGhhbmRsZSByZWdleCB3aXRob3V0IGNhcHR1cmUgZ3JvdXAnLCAtPlxuICAgICAgbG9va3VwID1cbiAgICAgICAgdGl0bGU6ICdUaGlzIGlzIENvZGUnXG4gICAgICAgIHJlZ2V4OiAnJ1xuXG4gICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgdG9kb1JlZ2V4LnJlZ2V4cCA9IC9bXFx3XFxzXStjb2RlW1xcd1xcc10qL2dcbiAgICAgICAgY29sbGVjdGlvbi5mZXRjaFJlZ2V4SXRlbSh0b2RvUmVnZXgpXG4gICAgICBydW5zIC0+XG4gICAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZG9zKS50b0hhdmVMZW5ndGggMVxuICAgICAgICBleHBlY3QoY29sbGVjdGlvbi50b2Rvc1swXS50ZXh0KS50b0JlICdTYW1wbGUgcXVpY2tzb3J0IGNvZGUnXG5cbiAgICBpdCAnc2hvdWxkIGhhbmRsZSBwb3N0LWFubm90YXRpb25zIHdpdGggc3BlY2lhbCByZWdleCcsIC0+XG4gICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgdG9kb1JlZ2V4LnJlZ2V4cCA9IC8oLispLnszfURFQlVHXFxzKiQvZ1xuICAgICAgICBjb2xsZWN0aW9uLmZldGNoUmVnZXhJdGVtKHRvZG9SZWdleClcbiAgICAgIHJ1bnMgLT5cbiAgICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9kb3MpLnRvSGF2ZUxlbmd0aCAxXG4gICAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZG9zWzBdLnRleHQpLnRvQmUgJ3JldHVybiBzb3J0KEFycmF5LmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpOydcblxuICAgIGl0ICdzaG91bGQgaGFuZGxlIHBvc3QtYW5ub3RhdGlvbnMgd2l0aCBub24tY2FwdHVyaW5nIGdyb3VwJywgLT5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICB0b2RvUmVnZXgucmVnZXhwID0gLyguKz8oPz0uezN9REVCVUdcXHMqJCkpL1xuICAgICAgICBjb2xsZWN0aW9uLmZldGNoUmVnZXhJdGVtKHRvZG9SZWdleClcbiAgICAgIHJ1bnMgLT5cbiAgICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9kb3MpLnRvSGF2ZUxlbmd0aCAxXG4gICAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZG9zWzBdLnRleHQpLnRvQmUgJ3JldHVybiBzb3J0KEFycmF5LmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpOydcblxuICAgIGl0ICdzaG91bGQgdHJ1bmNhdGUgdG9kb3MgbG9uZ2VyIHRoYW4gdGhlIGRlZmluZWQgbWF4IGxlbmd0aCBvZiAxMjAnLCAtPlxuICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgIHRvZG9SZWdleC5yZWdleHAgPSAvTE9PTkc6PyguKyQpL2dcbiAgICAgICAgY29sbGVjdGlvbi5mZXRjaFJlZ2V4SXRlbSh0b2RvUmVnZXgpXG4gICAgICBydW5zIC0+XG4gICAgICAgIHRleHQgPSAnTG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQsIGRhcGlidXMgcmhvbmN1cy4gU2NlbGVyaXNxdWUgcXVhbSwnXG4gICAgICAgIHRleHQgKz0gJyBpZCBhbnRlIG1vbGVzdGlhcywgaXBzdW0gbG9yZW0gbWFnbmlzIGV0LiBBIGVsZWlmZW5kIGkuLi4nXG5cbiAgICAgICAgdGV4dDIgPSAnX1NwZ0xFODRNczFLNERTdW10SkRvTm44WkVDWkxMK1ZSMERvR3lkeTU0dlVvU3BnTEU4NE1zMUs0RFN1bSdcbiAgICAgICAgdGV4dDIgKz0gJ3RKRG9ObjhaRUNaTExWUjBEb0d5ZHk1NHZVb25SQ2xYd0xiRmhYMmdNd1pnangyNTBheStWMGxGLi4uJ1xuXG4gICAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZG9zWzBdLnRleHQpLnRvSGF2ZUxlbmd0aCAxMjBcbiAgICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9kb3NbMF0udGV4dCkudG9CZSB0ZXh0XG5cbiAgICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9kb3NbMV0udGV4dCkudG9IYXZlTGVuZ3RoIDEyMFxuICAgICAgICBleHBlY3QoY29sbGVjdGlvbi50b2Rvc1sxXS50ZXh0KS50b0JlIHRleHQyXG5cbiAgICBpdCAnc2hvdWxkIHN0cmlwIGNvbW1vbiBibG9jayBjb21tZW50IGVuZGluZ3MnLCAtPlxuICAgICAgYXRvbS5wcm9qZWN0LnNldFBhdGhzIFtzYW1wbGUyUGF0aF1cblxuICAgICAgd2FpdHNGb3JQcm9taXNlIC0+IGNvbGxlY3Rpb24uZmV0Y2hSZWdleEl0ZW0odG9kb1JlZ2V4KVxuICAgICAgcnVucyAtPlxuICAgICAgICBleHBlY3QoY29sbGVjdGlvbi50b2RvcykudG9IYXZlTGVuZ3RoIDZcbiAgICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9kb3NbMF0udGV4dCkudG9CZSAnQyBibG9jayBjb21tZW50J1xuICAgICAgICBleHBlY3QoY29sbGVjdGlvbi50b2Rvc1sxXS50ZXh0KS50b0JlICdIVE1MIGNvbW1lbnQnXG4gICAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZG9zWzJdLnRleHQpLnRvQmUgJ1Bvd2VyU2hlbGwgY29tbWVudCdcbiAgICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9kb3NbM10udGV4dCkudG9CZSAnSGFza2VsbCBjb21tZW50J1xuICAgICAgICBleHBlY3QoY29sbGVjdGlvbi50b2Rvc1s0XS50ZXh0KS50b0JlICdMdWEgY29tbWVudCdcbiAgICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9kb3NbNV0udGV4dCkudG9CZSAnUEhQIGNvbW1lbnQnXG5cbiAgZGVzY3JpYmUgJ2ZldGNoUmVnZXhJdGVtKHRvZG9SZWdleCwgYWN0aXZlUHJvamVjdE9ubHkpJywgLT5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBhdG9tLnByb2plY3QuYWRkUGF0aCBzYW1wbGUyUGF0aFxuXG4gICAgaXQgJ3NjYW5zIGFjdGl2ZSBwcm9qZWN0IGZvciByZWdleCcsIC0+XG4gICAgICBjb2xsZWN0aW9uLnNldEFjdGl2ZVByb2plY3Qoc2FtcGxlMVBhdGgpXG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBjb2xsZWN0aW9uLmZldGNoUmVnZXhJdGVtKHRvZG9SZWdleCwgdHJ1ZSlcbiAgICAgIHJ1bnMgLT5cbiAgICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9kb3MpLnRvSGF2ZUxlbmd0aCA0XG4gICAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZG9zWzBdLnRleHQpLnRvQmUgJ0NvbW1lbnQgaW4gQydcbiAgICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9kb3NbMV0udGV4dCkudG9CZSAnVGhpcyBpcyB0aGUgZmlyc3QgdG9kbydcbiAgICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9kb3NbMl0udGV4dCkudG9CZSAnVGhpcyBpcyB0aGUgc2Vjb25kIHRvZG8nXG4gICAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZG9zWzNdLnRleHQpLnRvQmUgJ0FkZCBtb3JlIGFubm5vdGF0aW9ucyA6KSdcblxuICAgIGl0ICdjaGFuZ2VzIGFjdGl2ZSBwcm9qZWN0JywgLT5cbiAgICAgIGNvbGxlY3Rpb24uc2V0QWN0aXZlUHJvamVjdChzYW1wbGUyUGF0aClcblxuICAgICAgd2FpdHNGb3JQcm9taXNlIC0+IGNvbGxlY3Rpb24uZmV0Y2hSZWdleEl0ZW0odG9kb1JlZ2V4LCB0cnVlKVxuICAgICAgcnVucyAtPlxuICAgICAgICBleHBlY3QoY29sbGVjdGlvbi50b2RvcykudG9IYXZlTGVuZ3RoIDZcbiAgICAgICAgY29sbGVjdGlvbi5jbGVhcigpXG4gICAgICAgIGNvbGxlY3Rpb24uc2V0QWN0aXZlUHJvamVjdChzYW1wbGUxUGF0aClcblxuICAgICAgICB3YWl0c0ZvclByb21pc2UgLT4gY29sbGVjdGlvbi5mZXRjaFJlZ2V4SXRlbSh0b2RvUmVnZXgsIHRydWUpXG4gICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICBleHBlY3QoY29sbGVjdGlvbi50b2RvcykudG9IYXZlTGVuZ3RoIDRcblxuICAgIGl0ICdzdGlsbCByZXNwZWN0cyBpZ25vcmVkIHBhdGhzJywgLT5cbiAgICAgIGF0b20uY29uZmlnLnNldCgndG9kby1zaG93Lmlnbm9yZVRoZXNlUGF0aHMnLCBbJ3NhbXBsZS5qcyddKVxuICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgIGNvbGxlY3Rpb24uZmV0Y2hSZWdleEl0ZW0odG9kb1JlZ2V4LCB0cnVlKVxuICAgICAgcnVucyAtPlxuICAgICAgICBleHBlY3QoY29sbGVjdGlvbi50b2RvcykudG9IYXZlTGVuZ3RoIDFcbiAgICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9kb3NbMF0udGV4dCkudG9CZSAnQ29tbWVudCBpbiBDJ1xuXG4gICAgaXQgJ2hhbmRsZXMgbm8gcHJvamVjdCBzaXR1YXRpb25zJywgLT5cbiAgICAgIGV4cGVjdChjb2xsZWN0aW9uLmFjdGl2ZVByb2plY3QpLm5vdC50b0JlRGVmaW5lZCgpXG4gICAgICBleHBlY3QocGF0aC5iYXNlbmFtZShjb2xsZWN0aW9uLmdldEFjdGl2ZVByb2plY3QoKSkpLnRvQmUgJ3NhbXBsZTEnXG5cbiAgICAgIGF0b20ucHJvamVjdC5zZXRQYXRocyBbXVxuICAgICAgY29sbGVjdGlvbi5hY3RpdmVQcm9qZWN0ID0gdW5kZWZpbmVkXG4gICAgICB3YWl0c0ZvclByb21pc2UgLT4gY29sbGVjdGlvbi5mZXRjaFJlZ2V4SXRlbSh0b2RvUmVnZXgsIHRydWUpXG4gICAgICBydW5zIC0+XG4gICAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZG9zKS50b0hhdmVMZW5ndGggMFxuXG4gIGRlc2NyaWJlICdpZ25vcmUgcGF0aCBydWxlcycsIC0+XG4gICAgaXQgJ3dvcmtzIHdpdGggbm8gcGF0aHMgYWRkZWQnLCAtPlxuICAgICAgYXRvbS5jb25maWcuc2V0KCd0b2RvLXNob3cuaWdub3JlVGhlc2VQYXRocycsIFtdKVxuICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgIGNvbGxlY3Rpb24uZmV0Y2hSZWdleEl0ZW0odG9kb1JlZ2V4KVxuICAgICAgcnVucyAtPlxuICAgICAgICBleHBlY3QoY29sbGVjdGlvbi50b2RvcykudG9IYXZlTGVuZ3RoIDRcblxuICAgIGl0ICdtdXN0IGJlIGFuIGFycmF5JywgLT5cbiAgICAgIGNvbGxlY3Rpb24ub25EaWRGYWlsU2VhcmNoIG5vdGlmaWNhdGlvblNweSA9IGphc21pbmUuY3JlYXRlU3B5KClcblxuICAgICAgYXRvbS5jb25maWcuc2V0KCd0b2RvLXNob3cuaWdub3JlVGhlc2VQYXRocycsICcxMjMnKVxuICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgIGNvbGxlY3Rpb24uZmV0Y2hSZWdleEl0ZW0odG9kb1JlZ2V4KVxuICAgICAgcnVucyAtPlxuICAgICAgICBleHBlY3QoY29sbGVjdGlvbi50b2RvcykudG9IYXZlTGVuZ3RoIDRcblxuICAgICAgICBub3RpZmljYXRpb24gPSBub3RpZmljYXRpb25TcHkubW9zdFJlY2VudENhbGwuYXJnc1swXVxuICAgICAgICBleHBlY3Qobm90aWZpY2F0aW9uU3B5KS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgICAgZXhwZWN0KG5vdGlmaWNhdGlvbi5pbmRleE9mKCdpZ25vcmVUaGVzZVBhdGhzJykpLm5vdC50b0JlIC0xXG5cbiAgICBpdCAncmVzcGVjdHMgaWdub3JlZCBmaWxlcycsIC0+XG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ3RvZG8tc2hvdy5pZ25vcmVUaGVzZVBhdGhzJywgWydzYW1wbGUuanMnXSlcbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICBjb2xsZWN0aW9uLmZldGNoUmVnZXhJdGVtKHRvZG9SZWdleClcbiAgICAgIHJ1bnMgLT5cbiAgICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9kb3MpLnRvSGF2ZUxlbmd0aCAxXG4gICAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZG9zWzBdLnRleHQpLnRvQmUgJ0NvbW1lbnQgaW4gQydcblxuICAgIGl0ICdyZXNwZWN0cyBpZ25vcmVkIGRpcmVjdG9yaWVzIGFuZCBmaWxldHlwZXMnLCAtPlxuICAgICAgYXRvbS5wcm9qZWN0LnNldFBhdGhzIFtmaXh0dXJlc1BhdGhdXG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ3RvZG8tc2hvdy5pZ25vcmVUaGVzZVBhdGhzJywgWydzYW1wbGUxJywgJyoubWQnXSlcblxuICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgIGNvbGxlY3Rpb24uZmV0Y2hSZWdleEl0ZW0odG9kb1JlZ2V4KVxuICAgICAgcnVucyAtPlxuICAgICAgICBleHBlY3QoY29sbGVjdGlvbi50b2RvcykudG9IYXZlTGVuZ3RoIDZcbiAgICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9kb3NbMF0udGV4dCkudG9CZSAnQyBibG9jayBjb21tZW50J1xuXG4gICAgaXQgJ3Jlc3BlY3RzIGlnbm9yZWQgd2lsZGNhcmQgZGlyZWN0b3JpZXMnLCAtPlxuICAgICAgYXRvbS5wcm9qZWN0LnNldFBhdGhzIFtmaXh0dXJlc1BhdGhdXG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ3RvZG8tc2hvdy5pZ25vcmVUaGVzZVBhdGhzJywgWycqKi9zYW1wbGUuanMnLCAnKiovc2FtcGxlLnR4dCcsICcqLm1kJ10pXG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICBjb2xsZWN0aW9uLmZldGNoUmVnZXhJdGVtKHRvZG9SZWdleClcbiAgICAgIHJ1bnMgLT5cbiAgICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9kb3MpLnRvSGF2ZUxlbmd0aCAxXG4gICAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZG9zWzBdLnRleHQpLnRvQmUgJ0NvbW1lbnQgaW4gQydcblxuICAgIGl0ICdyZXNwZWN0cyBtb3JlIGFkdmFuY2VkIGlnbm9yZXMnLCAtPlxuICAgICAgYXRvbS5wcm9qZWN0LnNldFBhdGhzIFtmaXh0dXJlc1BhdGhdXG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ3RvZG8tc2hvdy5pZ25vcmVUaGVzZVBhdGhzJywgWydvdXRwdXQoLWdyb3VwZWQpP1xcXFwuKicsICcqMS8qKiddKVxuXG4gICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgY29sbGVjdGlvbi5mZXRjaFJlZ2V4SXRlbSh0b2RvUmVnZXgpXG4gICAgICBydW5zIC0+XG4gICAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZG9zKS50b0hhdmVMZW5ndGggNlxuICAgICAgICBleHBlY3QoY29sbGVjdGlvbi50b2Rvc1swXS50ZXh0KS50b0JlICdDIGJsb2NrIGNvbW1lbnQnXG5cbiAgZGVzY3JpYmUgJ2ZldGNoT3BlblJlZ2V4SXRlbShsb29rdXBPYmopJywgLT5cbiAgICBlZGl0b3IgPSBudWxsXG5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbiAnc2FtcGxlLmMnXG4gICAgICBydW5zIC0+XG4gICAgICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuXG4gICAgaXQgJ3NjYW5zIG9wZW4gZmlsZXMgZm9yIHRoZSByZWdleCB0aGF0IGlzIHBhc3NlZCBhbmQgZmlsbCBsb29rdXAgcmVzdWx0cycsIC0+XG4gICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgY29sbGVjdGlvbi5mZXRjaE9wZW5SZWdleEl0ZW0odG9kb1JlZ2V4KVxuXG4gICAgICBydW5zIC0+XG4gICAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZG9zKS50b0hhdmVMZW5ndGggMVxuICAgICAgICBleHBlY3QoY29sbGVjdGlvbi50b2Rvcy5sZW5ndGgpLnRvQmUgMVxuICAgICAgICBleHBlY3QoY29sbGVjdGlvbi50b2Rvc1swXS50ZXh0KS50b0JlICdDb21tZW50IGluIEMnXG5cbiAgICBpdCAnd29ya3Mgd2l0aCBmaWxlcyBvdXRzaWRlIG9mIHdvcmtzcGFjZScsIC0+XG4gICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbiAnLi4vc2FtcGxlMi9zYW1wbGUudHh0J1xuXG4gICAgICBydW5zIC0+XG4gICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICAgIGNvbGxlY3Rpb24uZmV0Y2hPcGVuUmVnZXhJdGVtKHRvZG9SZWdleClcblxuICAgICAgICBydW5zIC0+XG4gICAgICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9kb3MpLnRvSGF2ZUxlbmd0aCA3XG4gICAgICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9kb3NbMF0udGV4dCkudG9CZSAnQ29tbWVudCBpbiBDJ1xuICAgICAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZG9zWzFdLnRleHQpLnRvQmUgJ0MgYmxvY2sgY29tbWVudCdcbiAgICAgICAgICBleHBlY3QoY29sbGVjdGlvbi50b2Rvc1s2XS50ZXh0KS50b0JlICdQSFAgY29tbWVudCdcblxuICAgIGl0ICdoYW5kbGVzIHVuc2F2ZWQgZG9jdW1lbnRzJywgLT5cbiAgICAgIGVkaXRvci5zZXRUZXh0ICdUT0RPOiBOZXcgdG9kbydcblxuICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgIGNvbGxlY3Rpb24uZmV0Y2hPcGVuUmVnZXhJdGVtKHRvZG9SZWdleClcbiAgICAgIHJ1bnMgLT5cbiAgICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9kb3MpLnRvSGF2ZUxlbmd0aCAxXG4gICAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZG9zWzBdLnR5cGUpLnRvQmUgJ1RPRE8nXG4gICAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZG9zWzBdLnRleHQpLnRvQmUgJ05ldyB0b2RvJ1xuXG4gICAgaXQgJ2lnbm9yZXMgdG9kbyB3aXRob3V0IGxlYWRpbmcgc3BhY2UnLCAtPlxuICAgICAgZWRpdG9yLnNldFRleHQgJ0EgbGluZSAvLyBUT0RPOnRleHQnXG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICBjb2xsZWN0aW9uLmZldGNoT3BlblJlZ2V4SXRlbSh0b2RvUmVnZXgpXG4gICAgICBydW5zIC0+XG4gICAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZG9zKS50b0hhdmVMZW5ndGggMFxuXG4gICAgaXQgJ2lnbm9yZXMgdG9kbyB3aXRoIHVud2FudGVkIGNoYXJhY3RlcnMnLCAtPlxuICAgICAgZWRpdG9yLnNldFRleHQgJ2RlZmluZShcIl9KU19UT0RPX0FMRVJUX1wiLCBcImpzOmFsZXJ0KCZxdW90O1RPRE8mcXVvdDspO1wiKTsnXG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICBjb2xsZWN0aW9uLmZldGNoT3BlblJlZ2V4SXRlbSh0b2RvUmVnZXgpXG4gICAgICBydW5zIC0+XG4gICAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZG9zKS50b0hhdmVMZW5ndGggMFxuXG4gICAgaXQgJ2lnbm9yZXMgYmluYXJ5IGRhdGEnLCAtPlxuICAgICAgZWRpdG9yLnNldFRleHQgJy8vIFRPRE9l77+9ZO+/ve+/vVJQUFAwXHUwMDA277+9XHUwMDBmJ1xuXG4gICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgY29sbGVjdGlvbi5mZXRjaE9wZW5SZWdleEl0ZW0odG9kb1JlZ2V4KVxuICAgICAgcnVucyAtPlxuICAgICAgICBleHBlY3QoY29sbGVjdGlvbi50b2RvcykudG9IYXZlTGVuZ3RoIDBcblxuICAgIGl0ICdkb2VzIG5vdCBhZGQgZHVwbGljYXRlcycsIC0+XG4gICAgICBhZGRUZXN0VG9kb3MoKVxuICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9kb3MpLnRvSGF2ZUxlbmd0aCAzXG4gICAgICBhZGRUZXN0VG9kb3MoKVxuICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9kb3MpLnRvSGF2ZUxlbmd0aCAzXG5cbiAgZGVzY3JpYmUgJ2dldEFjdGl2ZVByb2plY3QnLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIGF0b20ucHJvamVjdC5hZGRQYXRoIHNhbXBsZTJQYXRoXG5cbiAgICBpdCAncmV0dXJucyBhY3RpdmUgcHJvamVjdCcsIC0+XG4gICAgICBjb2xsZWN0aW9uLmFjdGl2ZVByb2plY3QgPSBzYW1wbGUyUGF0aFxuICAgICAgZXhwZWN0KGNvbGxlY3Rpb24uZ2V0QWN0aXZlUHJvamVjdCgpKS50b0JlIHNhbXBsZTJQYXRoXG5cbiAgICBpdCAnZmFsbHMgYmFjayB0byBmaXJzdCBwcm9qZWN0JywgLT5cbiAgICAgIGV4cGVjdChjb2xsZWN0aW9uLmdldEFjdGl2ZVByb2plY3QoKSkudG9CZSBzYW1wbGUxUGF0aFxuXG4gICAgaXQgJ2ZhbGxzIGJhY2sgdG8gZmlyc3Qgb3BlbiBpdGVtJywgLT5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuIHBhdGguam9pbihzYW1wbGUyUGF0aCwgJ3NhbXBsZS50eHQnKVxuICAgICAgcnVucyAtPlxuICAgICAgICBleHBlY3QoY29sbGVjdGlvbi5nZXRBY3RpdmVQcm9qZWN0KCkpLnRvQmUgc2FtcGxlMlBhdGhcblxuICAgIGl0ICdoYW5kbGVzIG5vIHByb2plY3QgcGF0aHMnLCAtPlxuICAgICAgYXRvbS5wcm9qZWN0LnNldFBhdGhzIFtdXG4gICAgICBleHBlY3QoY29sbGVjdGlvbi5nZXRBY3RpdmVQcm9qZWN0KCkpLnRvQmVGYWxzeSgpXG4gICAgICBleHBlY3QoY29sbGVjdGlvbi5hY3RpdmVQcm9qZWN0KS5ub3QudG9CZURlZmluZWQoKVxuXG4gIGRlc2NyaWJlICdzZXRBY3RpdmVQcm9qZWN0JywgLT5cbiAgICBpdCAnc2V0cyBhY3RpdmUgcHJvamVjdCBmcm9tIGZpbGUgcGF0aCBhbmQgcmV0dXJucyB0cnVlIGlmIGNoYW5nZWQnLCAtPlxuICAgICAgYXRvbS5wcm9qZWN0LmFkZFBhdGggc2FtcGxlMlBhdGhcbiAgICAgIGV4cGVjdChjb2xsZWN0aW9uLmdldEFjdGl2ZVByb2plY3QoKSkudG9CZSBzYW1wbGUxUGF0aFxuICAgICAgcmVzID0gY29sbGVjdGlvbi5zZXRBY3RpdmVQcm9qZWN0IHBhdGguam9pbihzYW1wbGUyUGF0aCwgJ3NhbXBsZS50eHQnKVxuICAgICAgZXhwZWN0KHJlcykudG9CZSB0cnVlXG4gICAgICBleHBlY3QoY29sbGVjdGlvbi5nZXRBY3RpdmVQcm9qZWN0KCkpLnRvQmUgc2FtcGxlMlBhdGhcbiAgICAgIHJlcyA9IGNvbGxlY3Rpb24uc2V0QWN0aXZlUHJvamVjdCBwYXRoLmpvaW4oc2FtcGxlMlBhdGgsICdzYW1wbGUudHh0JylcbiAgICAgIGV4cGVjdChyZXMpLnRvQmUgZmFsc2VcblxuICAgIGl0ICdpZ25vcmVzIGlmIGZpbGUgaXMgbm90IGluIHByb2plY3QnLCAtPlxuICAgICAgcmVzID0gY29sbGVjdGlvbi5zZXRBY3RpdmVQcm9qZWN0IHBhdGguam9pbihzYW1wbGUyUGF0aCwgJ3NhbXBsZS50eHQnKVxuICAgICAgZXhwZWN0KHJlcykudG9CZSBmYWxzZVxuICAgICAgZXhwZWN0KGNvbGxlY3Rpb24uZ2V0QWN0aXZlUHJvamVjdCgpKS50b0JlIHNhbXBsZTFQYXRoXG5cbiAgICBpdCAnaGFuZGxlcyBpbnZhbGlkIGFyZ3VtZW50cycsIC0+XG4gICAgICBleHBlY3QoY29sbGVjdGlvbi5zZXRBY3RpdmVQcm9qZWN0KCkpLnRvQmUgZmFsc2VcbiAgICAgIGV4cGVjdChjb2xsZWN0aW9uLmFjdGl2ZVByb2plY3QpLm5vdC50b0JlRGVmaW5lZCgpXG5cbiAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnNldEFjdGl2ZVByb2plY3QoZmFsc2UpKS50b0JlIGZhbHNlXG4gICAgICBleHBlY3QoY29sbGVjdGlvbi5hY3RpdmVQcm9qZWN0KS5ub3QudG9CZURlZmluZWQoKVxuXG4gICAgICBleHBlY3QoY29sbGVjdGlvbi5zZXRBY3RpdmVQcm9qZWN0KHt9KSkudG9CZSBmYWxzZVxuICAgICAgZXhwZWN0KGNvbGxlY3Rpb24uYWN0aXZlUHJvamVjdCkubm90LnRvQmVEZWZpbmVkKClcblxuICBkZXNjcmliZSAnU29ydCB0b2RvcycsIC0+XG4gICAge3NvcnRTcHl9ID0gW11cblxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIGFkZFRlc3RUb2RvcygpXG4gICAgICBjb2xsZWN0aW9uLmFkZFRvZG8oXG4gICAgICAgIG5ldyBUb2RvTW9kZWwoXG4gICAgICAgICAgYWxsOiAnI0ZJWE1FOiBmaXhtZSAzJ1xuICAgICAgICAgIGxvYzogJ2ZpbGUxLnR4dCdcbiAgICAgICAgICBwb3NpdGlvbjogW1sxMiwxNF0sIFsxMiwxNl1dXG4gICAgICAgICAgcmVnZXg6IHRvZG9SZWdleC5yZWdleFxuICAgICAgICAgIHJlZ2V4cDogdG9kb1JlZ2V4LnJlZ2V4cFxuICAgICAgICApXG4gICAgICApXG4gICAgICBhdG9tLmNvbmZpZy5zZXQgJ3RvZG8tc2hvdy5maW5kVGhlc2VUb2RvcycsIFsnRklYTUUnLCAnVE9ETyddXG4gICAgICBzb3J0U3B5ID0gamFzbWluZS5jcmVhdGVTcHkoKVxuICAgICAgY29sbGVjdGlvbi5vbkRpZFNvcnRUb2RvcyBzb3J0U3B5XG5cbiAgICBpdCAnY2FuIHNvcnQgc2ltcGxlIHRvZG9zJywgLT5cbiAgICAgIGNvbGxlY3Rpb24uc29ydFRvZG9zKHNvcnRCeTogJ1RleHQnLCBzb3J0QXNjOiBmYWxzZSlcbiAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZG9zWzBdLnRleHQpLnRvQmUgJ3RvZG8gMSdcbiAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZG9zWzNdLnRleHQpLnRvQmUgJ2ZpeG1lIDEnXG5cbiAgICAgIGNvbGxlY3Rpb24uc29ydFRvZG9zKHNvcnRCeTogJ1RleHQnLCBzb3J0QXNjOiB0cnVlKVxuICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9kb3NbMF0udGV4dCkudG9CZSAnZml4bWUgMSdcbiAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZG9zWzNdLnRleHQpLnRvQmUgJ3RvZG8gMSdcblxuICAgICAgY29sbGVjdGlvbi5zb3J0VG9kb3Moc29ydEJ5OiAnVGV4dCcpXG4gICAgICBleHBlY3QoY29sbGVjdGlvbi50b2Rvc1swXS50ZXh0KS50b0JlICd0b2RvIDEnXG4gICAgICBleHBlY3QoY29sbGVjdGlvbi50b2Rvc1szXS50ZXh0KS50b0JlICdmaXhtZSAxJ1xuXG4gICAgICBjb2xsZWN0aW9uLnNvcnRUb2Rvcyhzb3J0QXNjOiB0cnVlKVxuICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9kb3NbMF0udGV4dCkudG9CZSAnZml4bWUgMSdcbiAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZG9zWzNdLnRleHQpLnRvQmUgJ3RvZG8gMSdcblxuICAgICAgY29sbGVjdGlvbi5zb3J0VG9kb3MoKVxuICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9kb3NbMF0udGV4dCkudG9CZSAndG9kbyAxJ1xuICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9kb3NbM10udGV4dCkudG9CZSAnZml4bWUgMSdcblxuICAgIGl0ICdzb3J0IGJ5IG90aGVyIHZhbHVlcycsIC0+XG4gICAgICBjb2xsZWN0aW9uLnNvcnRUb2Rvcyhzb3J0Qnk6ICdSYW5nZScsIHNvcnRBc2M6IHRydWUpXG4gICAgICBleHBlY3QoY29sbGVjdGlvbi50b2Rvc1swXS5yYW5nZSkudG9CZSAnMyw2LDMsMTAnXG4gICAgICBleHBlY3QoY29sbGVjdGlvbi50b2Rvc1syXS5yYW5nZSkudG9CZSAnNSw3LDUsMTEnXG4gICAgICBleHBlY3QoY29sbGVjdGlvbi50b2Rvc1szXS5yYW5nZSkudG9CZSAnMTIsMTQsMTIsMTYnXG5cbiAgICAgIGNvbGxlY3Rpb24uc29ydFRvZG9zKHNvcnRCeTogJ0ZpbGUnLCBzb3J0QXNjOiBmYWxzZSlcbiAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZG9zWzBdLnBhdGgpLnRvQmUgJ2ZpbGUyLnR4dCdcbiAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZG9zWzNdLnBhdGgpLnRvQmUgJ2ZpbGUxLnR4dCdcblxuICAgIGl0ICdzb3J0IGxpbmUgYXMgbnVtYmVyJywgLT5cbiAgICAgIGNvbGxlY3Rpb24uc29ydFRvZG9zKHNvcnRCeTogJ0xpbmUnLCBzb3J0QXNjOiB0cnVlKVxuICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9kb3NbMF0ubGluZSkudG9CZSAnNCdcbiAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZG9zWzFdLmxpbmUpLnRvQmUgJzUnXG4gICAgICBleHBlY3QoY29sbGVjdGlvbi50b2Rvc1syXS5saW5lKS50b0JlICc2J1xuICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9kb3NbM10ubGluZSkudG9CZSAnMTMnXG5cbiAgICAgIGNvbGxlY3Rpb24uc29ydFRvZG9zKHNvcnRCeTogJ1JhbmdlJywgc29ydEFzYzogdHJ1ZSlcbiAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZG9zWzBdLnJhbmdlKS50b0JlICczLDYsMywxMCdcbiAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZG9zWzFdLnJhbmdlKS50b0JlICc0LDUsNCw5J1xuICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9kb3NbMl0ucmFuZ2UpLnRvQmUgJzUsNyw1LDExJ1xuICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9kb3NbM10ucmFuZ2UpLnRvQmUgJzEyLDE0LDEyLDE2J1xuXG4gICAgaXQgJ3BlcmZvcm1zIGEgc3RhYmxlIHNvcnQnLCAtPlxuICAgICAgY29sbGVjdGlvbi5zb3J0VG9kb3Moc29ydEJ5OiAnRmlsZScsIHNvcnRBc2M6IHRydWUpXG4gICAgICBleHBlY3QoY29sbGVjdGlvbi50b2Rvc1swXS50ZXh0KS50b0JlICdmaXhtZSAxJ1xuICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9kb3NbMV0udGV4dCkudG9CZSAnZml4bWUgMydcbiAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZG9zWzJdLnRleHQpLnRvQmUgJ3RvZG8gMSdcbiAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZG9zWzNdLnRleHQpLnRvQmUgJ2ZpeG1lIDInXG5cbiAgICAgIGNvbGxlY3Rpb24uc29ydFRvZG9zKHNvcnRCeTogJ1RleHQnLCBzb3J0QXNjOiBmYWxzZSlcbiAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZG9zWzBdLnRleHQpLnRvQmUgJ3RvZG8gMSdcbiAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZG9zWzFdLnRleHQpLnRvQmUgJ2ZpeG1lIDMnXG4gICAgICBleHBlY3QoY29sbGVjdGlvbi50b2Rvc1syXS50ZXh0KS50b0JlICdmaXhtZSAyJ1xuICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9kb3NbM10udGV4dCkudG9CZSAnZml4bWUgMSdcblxuICAgICAgY29sbGVjdGlvbi5zb3J0VG9kb3Moc29ydEJ5OiAnRmlsZScsIHNvcnRBc2M6IHRydWUpXG4gICAgICBleHBlY3QoY29sbGVjdGlvbi50b2Rvc1swXS50ZXh0KS50b0JlICd0b2RvIDEnXG4gICAgICBleHBlY3QoY29sbGVjdGlvbi50b2Rvc1sxXS50ZXh0KS50b0JlICdmaXhtZSAzJ1xuICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9kb3NbMl0udGV4dCkudG9CZSAnZml4bWUgMSdcbiAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZG9zWzNdLnRleHQpLnRvQmUgJ2ZpeG1lIDInXG5cbiAgICAgIGNvbGxlY3Rpb24uc29ydFRvZG9zKHNvcnRCeTogJ1R5cGUnLCBzb3J0QXNjOiB0cnVlKVxuICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9kb3NbMF0udGV4dCkudG9CZSAnZml4bWUgMydcbiAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZG9zWzFdLnRleHQpLnRvQmUgJ2ZpeG1lIDEnXG4gICAgICBleHBlY3QoY29sbGVjdGlvbi50b2Rvc1syXS50ZXh0KS50b0JlICdmaXhtZSAyJ1xuICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9kb3NbM10udGV4dCkudG9CZSAndG9kbyAxJ1xuXG4gICAgaXQgJ3NvcnRzIHR5cGUgaW4gdGhlIGRlZmluZWQgb3JkZXInLCAtPlxuICAgICAgY29sbGVjdGlvbi5zb3J0VG9kb3Moc29ydEJ5OiAnVHlwZScsIHNvcnRBc2M6IHRydWUpXG4gICAgICBleHBlY3QoY29sbGVjdGlvbi50b2Rvc1swXS50ZXh0KS50b0JlICdmaXhtZSAxJ1xuICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9kb3NbMV0udGV4dCkudG9CZSAnZml4bWUgMidcbiAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZG9zWzJdLnRleHQpLnRvQmUgJ2ZpeG1lIDMnXG4gICAgICBleHBlY3QoY29sbGVjdGlvbi50b2Rvc1szXS50ZXh0KS50b0JlICd0b2RvIDEnXG5cbiAgICAgIGF0b20uY29uZmlnLnNldCAndG9kby1zaG93LmZpbmRUaGVzZVRvZG9zJywgWydUT0RPJywgJ0ZJWE1FJ11cbiAgICAgIGNvbGxlY3Rpb24uc29ydFRvZG9zKHNvcnRCeTogJ1R5cGUnLCBzb3J0QXNjOiB0cnVlKVxuICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9kb3NbMF0udGV4dCkudG9CZSAndG9kbyAxJ1xuICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9kb3NbMV0udGV4dCkudG9CZSAnZml4bWUgMSdcbiAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZG9zWzJdLnRleHQpLnRvQmUgJ2ZpeG1lIDInXG4gICAgICBleHBlY3QoY29sbGVjdGlvbi50b2Rvc1szXS50ZXh0KS50b0JlICdmaXhtZSAzJ1xuXG4gICAgICBjb2xsZWN0aW9uLnNvcnRUb2Rvcyhzb3J0Qnk6ICdUeXBlJywgc29ydEFzYzogZmFsc2UpXG4gICAgICBleHBlY3QoY29sbGVjdGlvbi50b2Rvc1swXS50ZXh0KS50b0JlICdmaXhtZSAzJ1xuICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9kb3NbMV0udGV4dCkudG9CZSAnZml4bWUgMidcbiAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZG9zWzJdLnRleHQpLnRvQmUgJ2ZpeG1lIDEnXG4gICAgICBleHBlY3QoY29sbGVjdGlvbi50b2Rvc1szXS50ZXh0KS50b0JlICd0b2RvIDEnXG5cbiAgZGVzY3JpYmUgJ0ZpbHRlciB0b2RvcycsIC0+XG4gICAge2ZpbHRlclNweX0gPSBbXVxuXG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgYXRvbS5jb25maWcuc2V0ICd0b2RvLXNob3cuc2hvd0luVGFibGUnLCBkZWZhdWx0U2hvd0luVGFibGVcbiAgICAgIGFkZFRlc3RUb2RvcygpXG4gICAgICBmaWx0ZXJTcHkgPSBqYXNtaW5lLmNyZWF0ZVNweSgpXG4gICAgICBjb2xsZWN0aW9uLm9uRGlkRmlsdGVyVG9kb3MgZmlsdGVyU3B5XG5cbiAgICBpdCAnY2FuIGZpbHRlciBzaW1wbGUgdG9kb3MnLCAtPlxuICAgICAgY29sbGVjdGlvbi5maWx0ZXJUb2RvcygnVE9ETycpXG4gICAgICBleHBlY3QoZmlsdGVyU3B5LmNhbGxDb3VudCkudG9CZSAxXG4gICAgICBleHBlY3QoZmlsdGVyU3B5LmNhbGxzWzBdLmFyZ3NbMF0pLnRvSGF2ZUxlbmd0aCAxXG5cbiAgICBpdCAnY2FuIGZpbHRlciB0b2RvcyB3aXRoIG11bHRpcGxlIHJlc3VsdHMnLCAtPlxuICAgICAgY29sbGVjdGlvbi5maWx0ZXJUb2RvcygnZmlsZTEnKVxuICAgICAgZXhwZWN0KGZpbHRlclNweS5jYWxsQ291bnQpLnRvQmUgMVxuICAgICAgZXhwZWN0KGZpbHRlclNweS5jYWxsc1swXS5hcmdzWzBdKS50b0hhdmVMZW5ndGggMlxuXG4gICAgaXQgJ2hhbmRsZXMgbm8gcmVzdWx0cycsIC0+XG4gICAgICBjb2xsZWN0aW9uLmZpbHRlclRvZG9zKCdYWVonKVxuICAgICAgZXhwZWN0KGZpbHRlclNweS5jYWxsQ291bnQpLnRvQmUgMVxuICAgICAgZXhwZWN0KGZpbHRlclNweS5jYWxsc1swXS5hcmdzWzBdKS50b0hhdmVMZW5ndGggMFxuXG4gICAgaXQgJ2hhbmRsZXMgZW1wdHkgZmlsdGVyJywgLT5cbiAgICAgIGNvbGxlY3Rpb24uZmlsdGVyVG9kb3MoJycpXG4gICAgICBleHBlY3QoZmlsdGVyU3B5LmNhbGxDb3VudCkudG9CZSAxXG4gICAgICBleHBlY3QoZmlsdGVyU3B5LmNhbGxzWzBdLmFyZ3NbMF0pLnRvSGF2ZUxlbmd0aCAzXG5cbiAgICBpdCAnY2FzZSBpbnNlbnNpdGl2ZSBmaWx0ZXInLCAtPlxuICAgICAgY29sbGVjdGlvbi5hZGRUb2RvKFxuICAgICAgICBuZXcgVG9kb01vZGVsKFxuICAgICAgICAgIGFsbDogJyNGSVhNRTogVEhJUyBJUyBXSVRIIENBUFMnXG4gICAgICAgICAgbG9jOiAnZmlsZTIudHh0J1xuICAgICAgICAgIHBvc2l0aW9uOiBbWzYsN10sIFs2LDExXV1cbiAgICAgICAgICByZWdleDogdG9kb1JlZ2V4LnJlZ2V4XG4gICAgICAgICAgcmVnZXhwOiB0b2RvUmVnZXgucmVnZXhwXG4gICAgICAgIClcbiAgICAgIClcblxuICAgICAgY29sbGVjdGlvbi5maWx0ZXJUb2RvcygnRklYTUUgMScpXG4gICAgICByZXN1bHQgPSBmaWx0ZXJTcHkuY2FsbHNbMF0uYXJnc1swXVxuICAgICAgZXhwZWN0KGZpbHRlclNweS5jYWxsQ291bnQpLnRvQmUgMVxuICAgICAgZXhwZWN0KHJlc3VsdCkudG9IYXZlTGVuZ3RoIDFcbiAgICAgIGV4cGVjdChyZXN1bHRbMF0udGV4dCkudG9CZSAnZml4bWUgMSdcblxuICAgICAgY29sbGVjdGlvbi5maWx0ZXJUb2RvcygnY2FwcycpXG4gICAgICByZXN1bHQgPSBmaWx0ZXJTcHkuY2FsbHNbMV0uYXJnc1swXVxuICAgICAgZXhwZWN0KGZpbHRlclNweS5jYWxsQ291bnQpLnRvQmUgMlxuICAgICAgZXhwZWN0KHJlc3VsdCkudG9IYXZlTGVuZ3RoIDFcbiAgICAgIGV4cGVjdChyZXN1bHRbMF0udGV4dCkudG9CZSAnVEhJUyBJUyBXSVRIIENBUFMnXG5cbiAgICAgIGNvbGxlY3Rpb24uZmlsdGVyVG9kb3MoJ05PTkVYSVNUSU5HJylcbiAgICAgIHJlc3VsdCA9IGZpbHRlclNweS5jYWxsc1syXS5hcmdzWzBdXG4gICAgICBleHBlY3QoZmlsdGVyU3B5LmNhbGxDb3VudCkudG9CZSAzXG4gICAgICBleHBlY3QocmVzdWx0KS50b0hhdmVMZW5ndGggMFxuXG4gIGRlc2NyaWJlICdNYXJrZG93bicsIC0+XG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgYXRvbS5jb25maWcuc2V0ICd0b2RvLXNob3cuZmluZFRoZXNlVG9kb3MnLCBbJ0ZJWE1FJywgJ1RPRE8nXVxuICAgICAgYXRvbS5jb25maWcuc2V0ICd0b2RvLXNob3cuc2hvd0luVGFibGUnLCBkZWZhdWx0U2hvd0luVGFibGVcblxuICAgIGl0ICdjcmVhdGVzIGEgbWFya2Rvd24gc3RyaW5nIGZyb20gcmVnZXhlcycsIC0+XG4gICAgICBhZGRUZXN0VG9kb3MoKVxuICAgICAgZXhwZWN0KGNvbGxlY3Rpb24uZ2V0TWFya2Rvd24oKSkudG9FcXVhbCBcIlwiXCJcbiAgICAgICAgLSBmaXhtZSAxIF9fRklYTUVfXyBbZmlsZTEudHh0XShmaWxlMS50eHQpXG4gICAgICAgIC0gdG9kbyAxIF9fVE9ET19fIFtmaWxlMS50eHRdKGZpbGUxLnR4dClcbiAgICAgICAgLSBmaXhtZSAyIF9fRklYTUVfXyBbZmlsZTIudHh0XShmaWxlMi50eHQpXFxuXG4gICAgICBcIlwiXCJcblxuICAgIGl0ICdjcmVhdGVzIG1hcmtkb3duIHdpdGggc29ydGluZycsIC0+XG4gICAgICBhZGRUZXN0VG9kb3MoKVxuICAgICAgY29sbGVjdGlvbi5zb3J0VG9kb3Moc29ydEJ5OiAnVGV4dCcsIHNvcnRBc2M6IHRydWUpXG4gICAgICBleHBlY3QoY29sbGVjdGlvbi5nZXRNYXJrZG93bigpKS50b0VxdWFsIFwiXCJcIlxuICAgICAgICAtIGZpeG1lIDEgX19GSVhNRV9fIFtmaWxlMS50eHRdKGZpbGUxLnR4dClcbiAgICAgICAgLSBmaXhtZSAyIF9fRklYTUVfXyBbZmlsZTIudHh0XShmaWxlMi50eHQpXG4gICAgICAgIC0gdG9kbyAxIF9fVE9ET19fIFtmaWxlMS50eHRdKGZpbGUxLnR4dClcXG5cbiAgICAgIFwiXCJcIlxuXG4gICAgaXQgJ2NyZWF0ZXMgbWFya2Rvd24gd2l0aCBpbnZlcnNlIHNvcnRpbmcnLCAtPlxuICAgICAgYWRkVGVzdFRvZG9zKClcbiAgICAgIGNvbGxlY3Rpb24uc29ydFRvZG9zKHNvcnRCeTogJ1RleHQnLCBzb3J0QXNjOiBmYWxzZSlcbiAgICAgIGV4cGVjdChjb2xsZWN0aW9uLmdldE1hcmtkb3duKCkpLnRvRXF1YWwgXCJcIlwiXG4gICAgICAgIC0gdG9kbyAxIF9fVE9ET19fIFtmaWxlMS50eHRdKGZpbGUxLnR4dClcbiAgICAgICAgLSBmaXhtZSAyIF9fRklYTUVfXyBbZmlsZTIudHh0XShmaWxlMi50eHQpXG4gICAgICAgIC0gZml4bWUgMSBfX0ZJWE1FX18gW2ZpbGUxLnR4dF0oZmlsZTEudHh0KVxcblxuICAgICAgXCJcIlwiXG5cbiAgICBpdCAnY3JlYXRlcyBtYXJrZG93biB3aXRoIGRpZmZlcmVudCBpdGVtcycsIC0+XG4gICAgICBhZGRUZXN0VG9kb3MoKVxuICAgICAgYXRvbS5jb25maWcuc2V0ICd0b2RvLXNob3cuc2hvd0luVGFibGUnLCBbJ1R5cGUnLCAnRmlsZScsICdSYW5nZSddXG4gICAgICBleHBlY3QoY29sbGVjdGlvbi5nZXRNYXJrZG93bigpKS50b0VxdWFsIFwiXCJcIlxuICAgICAgICAtIF9fRklYTUVfXyBbZmlsZTEudHh0XShmaWxlMS50eHQpIF86Myw2LDMsMTBfXG4gICAgICAgIC0gX19UT0RPX18gW2ZpbGUxLnR4dF0oZmlsZTEudHh0KSBfOjQsNSw0LDlfXG4gICAgICAgIC0gX19GSVhNRV9fIFtmaWxlMi50eHRdKGZpbGUyLnR4dCkgXzo1LDcsNSwxMV9cXG5cbiAgICAgIFwiXCJcIlxuXG4gICAgaXQgJ2NyZWF0ZXMgbWFya2Rvd24gYXMgdGFibGUnLCAtPlxuICAgICAgYWRkVGVzdFRvZG9zKClcbiAgICAgIGF0b20uY29uZmlnLnNldCAndG9kby1zaG93LnNhdmVPdXRwdXRBcycsICdUYWJsZSdcbiAgICAgIGV4cGVjdChjb2xsZWN0aW9uLmdldE1hcmtkb3duKCkpLnRvRXF1YWwgXCJcIlwiXG4gICAgICAgIHwgVGV4dCB8IFR5cGUgfCBGaWxlIHxcbiAgICAgICAgfC0tLS0tLS0tLS0tLS0tLS0tLS0tfFxuICAgICAgICB8IGZpeG1lIDEgfCBfX0ZJWE1FX18gfCBbZmlsZTEudHh0XShmaWxlMS50eHQpIHxcbiAgICAgICAgfCB0b2RvIDEgfCBfX1RPRE9fXyB8IFtmaWxlMS50eHRdKGZpbGUxLnR4dCkgfFxuICAgICAgICB8IGZpeG1lIDIgfCBfX0ZJWE1FX18gfCBbZmlsZTIudHh0XShmaWxlMi50eHQpIHxcXG5cbiAgICAgIFwiXCJcIlxuXG4gICAgaXQgJ2NyZWF0ZXMgbWFya2Rvd24gYXMgdGFibGUgd2l0aCBkaWZmZXJlbnQgaXRlbXMnLCAtPlxuICAgICAgYWRkVGVzdFRvZG9zKClcbiAgICAgIGF0b20uY29uZmlnLnNldCAndG9kby1zaG93LnNhdmVPdXRwdXRBcycsICdUYWJsZSdcbiAgICAgIGF0b20uY29uZmlnLnNldCAndG9kby1zaG93LnNob3dJblRhYmxlJywgWydUeXBlJywgJ0ZpbGUnLCAnUmFuZ2UnXVxuICAgICAgZXhwZWN0KGNvbGxlY3Rpb24uZ2V0TWFya2Rvd24oKSkudG9FcXVhbCBcIlwiXCJcbiAgICAgICAgfCBUeXBlIHwgRmlsZSB8IFJhbmdlIHxcbiAgICAgICAgfC0tLS0tLS0tLS0tLS0tLS0tLS0tLXxcbiAgICAgICAgfCBfX0ZJWE1FX18gfCBbZmlsZTEudHh0XShmaWxlMS50eHQpIHwgXzozLDYsMywxMF8gfFxuICAgICAgICB8IF9fVE9ET19fIHwgW2ZpbGUxLnR4dF0oZmlsZTEudHh0KSB8IF86NCw1LDQsOV8gfFxuICAgICAgICB8IF9fRklYTUVfXyB8IFtmaWxlMi50eHRdKGZpbGUyLnR4dCkgfCBfOjUsNyw1LDExXyB8XFxuXG4gICAgICBcIlwiXCJcblxuICAgIGl0ICdhY2NlcHRzIG1pc3NpbmcgcmFuZ2VzIGFuZCBwYXRocyBpbiByZWdleGVzJywgLT5cbiAgICAgIGNvbGxlY3Rpb24uYWRkVG9kbyhcbiAgICAgICAgbmV3IFRvZG9Nb2RlbChcbiAgICAgICAgICB0ZXh0OiAnZml4bWUgMSdcbiAgICAgICAgICB0eXBlOiAnRklYTUUnXG4gICAgICAgICwgcGxhaW46IHRydWUpXG4gICAgICApXG4gICAgICBleHBlY3QoY29sbGVjdGlvbi5nZXRNYXJrZG93bigpKS50b0VxdWFsIFwiXCJcIlxuICAgICAgICAtIGZpeG1lIDEgX19GSVhNRV9fXFxuXG4gICAgICBcIlwiXCJcblxuICAgICAgYXRvbS5jb25maWcuc2V0ICd0b2RvLXNob3cuc2hvd0luVGFibGUnLCBbJ1R5cGUnLCAnRmlsZScsICdSYW5nZScsICdUZXh0J11cbiAgICAgIG1hcmtkb3duID0gJ1xcbiMjIFVua25vd24gRmlsZVxcblxcbi0gZml4bWUgMSBgRklYTUVzYFxcbidcbiAgICAgIGV4cGVjdChjb2xsZWN0aW9uLmdldE1hcmtkb3duKCkpLnRvRXF1YWwgXCJcIlwiXG4gICAgICAgIC0gX19GSVhNRV9fIGZpeG1lIDFcXG5cbiAgICAgIFwiXCJcIlxuXG4gICAgaXQgJ2FjY2VwdHMgbWlzc2luZyB0aXRsZSBpbiByZWdleGVzJywgLT5cbiAgICAgIGNvbGxlY3Rpb24uYWRkVG9kbyhcbiAgICAgICAgbmV3IFRvZG9Nb2RlbChcbiAgICAgICAgICB0ZXh0OiAnZml4bWUgMSdcbiAgICAgICAgICBmaWxlOiAnZmlsZTEudHh0J1xuICAgICAgICAsIHBsYWluOiB0cnVlKVxuICAgICAgKVxuICAgICAgZXhwZWN0KGNvbGxlY3Rpb24uZ2V0TWFya2Rvd24oKSkudG9FcXVhbCBcIlwiXCJcbiAgICAgICAgLSBmaXhtZSAxIFtmaWxlMS50eHRdKGZpbGUxLnR4dClcXG5cbiAgICAgIFwiXCJcIlxuXG4gICAgICBhdG9tLmNvbmZpZy5zZXQgJ3RvZG8tc2hvdy5zaG93SW5UYWJsZScsIFsnVGl0bGUnXVxuICAgICAgZXhwZWN0KGNvbGxlY3Rpb24uZ2V0TWFya2Rvd24oKSkudG9FcXVhbCBcIlwiXCJcbiAgICAgICAgLSBObyBkZXRhaWxzXFxuXG4gICAgICBcIlwiXCJcblxuICAgIGl0ICdhY2NlcHRzIG1pc3NpbmcgaXRlbXMgaW4gdGFibGUgb3V0cHV0JywgLT5cbiAgICAgIGNvbGxlY3Rpb24uYWRkVG9kbyhcbiAgICAgICAgbmV3IFRvZG9Nb2RlbChcbiAgICAgICAgICB0ZXh0OiAnZml4bWUgMSdcbiAgICAgICAgICB0eXBlOiAnRklYTUUnXG4gICAgICAgICwgcGxhaW46IHRydWUpXG4gICAgICApXG4gICAgICBhdG9tLmNvbmZpZy5zZXQgJ3RvZG8tc2hvdy5zYXZlT3V0cHV0QXMnLCAnVGFibGUnXG4gICAgICBleHBlY3QoY29sbGVjdGlvbi5nZXRNYXJrZG93bigpKS50b0VxdWFsIFwiXCJcIlxuICAgICAgICB8IFRleHQgfCBUeXBlIHwgRmlsZSB8XG4gICAgICAgIHwtLS0tLS0tLS0tLS0tLS0tLS0tLXxcbiAgICAgICAgfCBmaXhtZSAxIHwgX19GSVhNRV9fIHwgfFxcblxuICAgICAgXCJcIlwiXG5cbiAgICAgIGF0b20uY29uZmlnLnNldCAndG9kby1zaG93LnNob3dJblRhYmxlJywgWydMaW5lJ11cbiAgICAgIGV4cGVjdChjb2xsZWN0aW9uLmdldE1hcmtkb3duKCkpLnRvRXF1YWwgXCJcIlwiXG4gICAgICAgIHwgTGluZSB8XG4gICAgICAgIHwtLS0tLS18XG4gICAgICAgIHwgfFxcblxuICAgICAgXCJcIlwiXG4iXX0=
