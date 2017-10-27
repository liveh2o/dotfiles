(function() {
  var ShowTodo, TodoCollection, TodoModel, TodoRegex, fixturesPath, path, sample1Path, sample2Path;

  path = require('path');

  TodoCollection = require('../lib/todo-collection');

  ShowTodo = require('../lib/show-todo');

  TodoModel = require('../lib/todo-model');

  TodoRegex = require('../lib/todo-regex');

  sample1Path = path.join(__dirname, 'fixtures/sample1');

  sample2Path = path.join(__dirname, 'fixtures/sample2');

  fixturesPath = path.join(__dirname, 'fixtures');

  describe('Todo Collection', function() {
    var addTestTodos, collection, defaultShowInTable, todoRegex, _ref;
    _ref = [], collection = _ref[0], todoRegex = _ref[1], defaultShowInTable = _ref[2];
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
      todoRegex = new TodoRegex(ShowTodo.config.findUsingRegex["default"], ['FIXME', 'TODO']);
      defaultShowInTable = ['Text', 'Type', 'File'];
      collection = new TodoCollection;
      return atom.project.setPaths([sample1Path]);
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
        expect(collection.todos[0].path).toBe('file2.txt');
        return expect(collection.todos[2].path).toBe('file1.txt');
      });
      return it('sort line as number', function() {
        collection.addTodo(new TodoModel({
          all: '#FIXME: fixme 3',
          loc: 'file3.txt',
          position: [[12, 14], [12, 16]],
          regex: todoRegex.regex,
          regexp: todoRegex.regexp
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RvZG8tc2hvdy9zcGVjL3RvZG8tY29sbGVjdGlvbi1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw0RkFBQTs7QUFBQSxFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUFQLENBQUE7O0FBQUEsRUFFQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSx3QkFBUixDQUZqQixDQUFBOztBQUFBLEVBR0EsUUFBQSxHQUFXLE9BQUEsQ0FBUSxrQkFBUixDQUhYLENBQUE7O0FBQUEsRUFJQSxTQUFBLEdBQVksT0FBQSxDQUFRLG1CQUFSLENBSlosQ0FBQTs7QUFBQSxFQUtBLFNBQUEsR0FBWSxPQUFBLENBQVEsbUJBQVIsQ0FMWixDQUFBOztBQUFBLEVBT0EsV0FBQSxHQUFjLElBQUksQ0FBQyxJQUFMLENBQVUsU0FBVixFQUFxQixrQkFBckIsQ0FQZCxDQUFBOztBQUFBLEVBUUEsV0FBQSxHQUFjLElBQUksQ0FBQyxJQUFMLENBQVUsU0FBVixFQUFxQixrQkFBckIsQ0FSZCxDQUFBOztBQUFBLEVBU0EsWUFBQSxHQUFlLElBQUksQ0FBQyxJQUFMLENBQVUsU0FBVixFQUFxQixVQUFyQixDQVRmLENBQUE7O0FBQUEsRUFXQSxRQUFBLENBQVMsaUJBQVQsRUFBNEIsU0FBQSxHQUFBO0FBQzFCLFFBQUEsNkRBQUE7QUFBQSxJQUFBLE9BQThDLEVBQTlDLEVBQUMsb0JBQUQsRUFBYSxtQkFBYixFQUF3Qiw0QkFBeEIsQ0FBQTtBQUFBLElBRUEsWUFBQSxHQUFlLFNBQUEsR0FBQTtBQUNiLE1BQUEsVUFBVSxDQUFDLE9BQVgsQ0FDTSxJQUFBLFNBQUEsQ0FDRjtBQUFBLFFBQUEsR0FBQSxFQUFLLGlCQUFMO0FBQUEsUUFDQSxHQUFBLEVBQUssV0FETDtBQUFBLFFBRUEsUUFB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

//# sourceURL=/Users/ah/.atom/packages/todo-show/spec/todo-collection-spec.coffee
