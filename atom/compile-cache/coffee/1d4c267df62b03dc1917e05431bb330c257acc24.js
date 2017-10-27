(function() {
  var Emitter, TodoCollection, TodoModel, TodoRegex, TodosMarkdown, path;

  path = require('path');

  Emitter = require('atom').Emitter;

  TodoModel = require('./todo-model');

  TodosMarkdown = require('./todo-markdown');

  TodoRegex = require('./todo-regex');

  module.exports = TodoCollection = (function() {
    function TodoCollection() {
      this.emitter = new Emitter;
      this.defaultKey = 'Text';
      this.scope = 'workspace';
      this.todos = [];
    }

    TodoCollection.prototype.onDidAddTodo = function(cb) {
      return this.emitter.on('did-add-todo', cb);
    };

    TodoCollection.prototype.onDidRemoveTodo = function(cb) {
      return this.emitter.on('did-remove-todo', cb);
    };

    TodoCollection.prototype.onDidClear = function(cb) {
      return this.emitter.on('did-clear-todos', cb);
    };

    TodoCollection.prototype.onDidStartSearch = function(cb) {
      return this.emitter.on('did-start-search', cb);
    };

    TodoCollection.prototype.onDidSearchPaths = function(cb) {
      return this.emitter.on('did-search-paths', cb);
    };

    TodoCollection.prototype.onDidFinishSearch = function(cb) {
      return this.emitter.on('did-finish-search', cb);
    };

    TodoCollection.prototype.onDidCancelSearch = function(cb) {
      return this.emitter.on('did-cancel-search', cb);
    };

    TodoCollection.prototype.onDidFailSearch = function(cb) {
      return this.emitter.on('did-fail-search', cb);
    };

    TodoCollection.prototype.onDidSortTodos = function(cb) {
      return this.emitter.on('did-sort-todos', cb);
    };

    TodoCollection.prototype.onDidFilterTodos = function(cb) {
      return this.emitter.on('did-filter-todos', cb);
    };

    TodoCollection.prototype.onDidChangeSearchScope = function(cb) {
      return this.emitter.on('did-change-scope', cb);
    };

    TodoCollection.prototype.clear = function() {
      this.cancelSearch();
      this.todos = [];
      return this.emitter.emit('did-clear-todos');
    };

    TodoCollection.prototype.addTodo = function(todo) {
      if (this.alreadyExists(todo)) {
        return;
      }
      this.todos.push(todo);
      return this.emitter.emit('did-add-todo', todo);
    };

    TodoCollection.prototype.getTodos = function() {
      return this.todos;
    };

    TodoCollection.prototype.getTodosCount = function() {
      return this.todos.length;
    };

    TodoCollection.prototype.getState = function() {
      return this.searching;
    };

    TodoCollection.prototype.sortTodos = function(arg) {
      var ref, ref1, sortAsc, sortBy;
      ref = arg != null ? arg : {}, sortBy = ref.sortBy, sortAsc = ref.sortAsc;
      if (sortBy == null) {
        sortBy = this.defaultKey;
      }
      if (((ref1 = this.searches) != null ? ref1[this.searches.length - 1].sortBy : void 0) !== sortBy) {
        if (this.searches == null) {
          this.searches = [];
        }
        this.searches.push({
          sortBy: sortBy,
          sortAsc: sortAsc
        });
      } else {
        this.searches[this.searches.length - 1] = {
          sortBy: sortBy,
          sortAsc: sortAsc
        };
      }
      this.todos = this.todos.sort((function(_this) {
        return function(todoA, todoB) {
          return _this.todoSorter(todoA, todoB, sortBy, sortAsc);
        };
      })(this));
      if (this.filter) {
        return this.filterTodos(this.filter);
      }
      return this.emitter.emit('did-sort-todos', this.todos);
    };

    TodoCollection.prototype.todoSorter = function(todoA, todoB, sortBy, sortAsc) {
      var aVal, bVal, comp, findTheseTodos, ref, ref1, ref2, ref3, search, sortAsc2, sortBy2;
      ref = [sortBy, sortAsc], sortBy2 = ref[0], sortAsc2 = ref[1];
      aVal = todoA.get(sortBy2);
      bVal = todoB.get(sortBy2);
      if (aVal === bVal) {
        if (search = (ref1 = this.searches) != null ? ref1[this.searches.length - 2] : void 0) {
          ref2 = [search.sortBy, search.sortAsc], sortBy2 = ref2[0], sortAsc2 = ref2[1];
        } else {
          sortBy2 = this.defaultKey;
        }
        ref3 = [todoA.get(sortBy2), todoB.get(sortBy2)], aVal = ref3[0], bVal = ref3[1];
      }
      if (sortBy2 === 'Type') {
        findTheseTodos = atom.config.get('todo-show.findTheseTodos');
        comp = findTheseTodos.indexOf(aVal) - findTheseTodos.indexOf(bVal);
      } else if (todoA.keyIsNumber(sortBy2)) {
        comp = parseInt(aVal) - parseInt(bVal);
      } else {
        comp = aVal.localeCompare(bVal);
      }
      if (sortAsc2) {
        return comp;
      } else {
        return -comp;
      }
    };

    TodoCollection.prototype.filterTodos = function(filter) {
      var result;
      if (this.filter = filter) {
        result = this.todos.filter(function(todo) {
          return todo.contains(filter);
        });
      } else {
        result = this.todos;
      }
      return this.emitter.emit('did-filter-todos', result);
    };

    TodoCollection.prototype.getAvailableTableItems = function() {
      return this.availableItems;
    };

    TodoCollection.prototype.setAvailableTableItems = function(availableItems) {
      this.availableItems = availableItems;
    };

    TodoCollection.prototype.getSearchScope = function() {
      return this.scope;
    };

    TodoCollection.prototype.setSearchScope = function(scope) {
      return this.emitter.emit('did-change-scope', this.scope = scope);
    };

    TodoCollection.prototype.toggleSearchScope = function() {
      var scope;
      scope = (function() {
        switch (this.scope) {
          case 'workspace':
            return 'project';
          case 'project':
            return 'open';
          case 'open':
            return 'active';
          default:
            return 'workspace';
        }
      }).call(this);
      this.setSearchScope(scope);
      return scope;
    };

    TodoCollection.prototype.alreadyExists = function(newTodo) {
      var properties;
      properties = ['range', 'path'];
      return this.todos.some(function(todo) {
        return properties.every(function(prop) {
          if (todo[prop] === newTodo[prop]) {
            return true;
          }
        });
      });
    };

    TodoCollection.prototype.fetchRegexItem = function(todoRegex, activeProjectOnly) {
      var options;
      options = {
        paths: this.getSearchPaths(),
        onPathsSearched: (function(_this) {
          return function(nPaths) {
            if (_this.searching) {
              return _this.emitter.emit('did-search-paths', nPaths);
            }
          };
        })(this)
      };
      return atom.workspace.scan(todoRegex.regexp, options, (function(_this) {
        return function(result, error) {
          var i, len, match, ref, results;
          if (error) {
            console.debug(error.message);
          }
          if (!result) {
            return;
          }
          if (activeProjectOnly && !_this.activeProjectHas(result.filePath)) {
            return;
          }
          ref = result.matches;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            match = ref[i];
            results.push(_this.addTodo(new TodoModel({
              all: match.lineText,
              text: match.matchText,
              loc: result.filePath,
              position: match.range,
              regex: todoRegex.regex,
              regexp: todoRegex.regexp
            })));
          }
          return results;
        };
      })(this));
    };

    TodoCollection.prototype.fetchOpenRegexItem = function(todoRegex, activeEditorOnly) {
      var editor, editors, i, len, ref;
      editors = [];
      if (activeEditorOnly) {
        if (editor = (ref = atom.workspace.getPanes()[0]) != null ? ref.getActiveEditor() : void 0) {
          editors = [editor];
        }
      } else {
        editors = atom.workspace.getTextEditors();
      }
      for (i = 0, len = editors.length; i < len; i++) {
        editor = editors[i];
        editor.scan(todoRegex.regexp, (function(_this) {
          return function(match, error) {
            var range;
            if (error) {
              console.debug(error.message);
            }
            if (!match) {
              return;
            }
            range = [[match.computedRange.start.row, match.computedRange.start.column], [match.computedRange.end.row, match.computedRange.end.column]];
            return _this.addTodo(new TodoModel({
              all: match.lineText,
              text: match.matchText,
              loc: editor.getPath(),
              position: range,
              regex: todoRegex.regex,
              regexp: todoRegex.regexp
            }));
          };
        })(this));
      }
      return Promise.resolve();
    };

    TodoCollection.prototype.search = function() {
      var todoRegex;
      this.clear();
      this.searching = true;
      this.emitter.emit('did-start-search');
      todoRegex = new TodoRegex(atom.config.get('todo-show.findUsingRegex'), atom.config.get('todo-show.findTheseTodos'));
      if (todoRegex.error) {
        this.emitter.emit('did-fail-search', "Invalid todo search regex");
        return;
      }
      this.searchPromise = (function() {
        switch (this.scope) {
          case 'open':
            return this.fetchOpenRegexItem(todoRegex, false);
          case 'active':
            return this.fetchOpenRegexItem(todoRegex, true);
          case 'project':
            return this.fetchRegexItem(todoRegex, true);
          default:
            return this.fetchRegexItem(todoRegex);
        }
      }).call(this);
      return this.searchPromise.then((function(_this) {
        return function(result) {
          _this.searching = false;
          if (result === 'cancelled') {
            return _this.emitter.emit('did-cancel-search');
          } else {
            return _this.emitter.emit('did-finish-search');
          }
        };
      })(this))["catch"]((function(_this) {
        return function(reason) {
          _this.searching = false;
          return _this.emitter.emit('did-fail-search', reason);
        };
      })(this));
    };

    TodoCollection.prototype.getSearchPaths = function() {
      var i, ignore, ignores, len, results;
      ignores = atom.config.get('todo-show.ignoreThesePaths');
      if (ignores == null) {
        return ['*'];
      }
      if (Object.prototype.toString.call(ignores) !== '[object Array]') {
        this.emitter.emit('did-fail-search', "ignoreThesePaths must be an array");
        return ['*'];
      }
      results = [];
      for (i = 0, len = ignores.length; i < len; i++) {
        ignore = ignores[i];
        results.push("!" + ignore);
      }
      return results;
    };

    TodoCollection.prototype.activeProjectHas = function(filePath) {
      var project;
      if (filePath == null) {
        filePath = '';
      }
      if (!(project = this.getActiveProject())) {
        return;
      }
      return filePath.indexOf(project) === 0;
    };

    TodoCollection.prototype.getActiveProject = function() {
      var project;
      if (this.activeProject) {
        return this.activeProject;
      }
      if (project = this.getFallbackProject()) {
        return this.activeProject = project;
      }
    };

    TodoCollection.prototype.getFallbackProject = function() {
      var i, item, len, project, ref;
      ref = atom.workspace.getPaneItems();
      for (i = 0, len = ref.length; i < len; i++) {
        item = ref[i];
        if (project = this.projectForFile(typeof item.getPath === "function" ? item.getPath() : void 0)) {
          return project;
        }
      }
      if (project = atom.project.getPaths()[0]) {
        return project;
      }
    };

    TodoCollection.prototype.getActiveProjectName = function() {
      var projectName;
      projectName = path.basename(this.getActiveProject());
      if (projectName === 'undefined') {
        return "no active project";
      } else {
        return projectName;
      }
    };

    TodoCollection.prototype.setActiveProject = function(filePath) {
      var lastProject, project;
      lastProject = this.activeProject;
      if (project = this.projectForFile(filePath)) {
        this.activeProject = project;
      }
      if (!lastProject) {
        return false;
      }
      return lastProject !== this.activeProject;
    };

    TodoCollection.prototype.projectForFile = function(filePath) {
      var project;
      if (typeof filePath !== 'string') {
        return;
      }
      if (project = atom.project.relativizePath(filePath)[0]) {
        return project;
      }
    };

    TodoCollection.prototype.getMarkdown = function() {
      var todosMarkdown;
      todosMarkdown = new TodosMarkdown;
      return todosMarkdown.markdown(this.getTodos());
    };

    TodoCollection.prototype.cancelSearch = function() {
      var ref;
      return (ref = this.searchPromise) != null ? typeof ref.cancel === "function" ? ref.cancel() : void 0 : void 0;
    };

    TodoCollection.prototype.getPreviousSearch = function() {
      var sortBy;
      return sortBy = localStorage.getItem('todo-show.previous-sortBy');
    };

    TodoCollection.prototype.setPreviousSearch = function(search) {
      return localStorage.setItem('todo-show.previous-search', search);
    };

    return TodoCollection;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RvZG8tc2hvdy9saWIvdG9kby1jb2xsZWN0aW9uLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNOLFVBQVcsT0FBQSxDQUFRLE1BQVI7O0VBRVosU0FBQSxHQUFZLE9BQUEsQ0FBUSxjQUFSOztFQUNaLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLGlCQUFSOztFQUNoQixTQUFBLEdBQVksT0FBQSxDQUFRLGNBQVI7O0VBRVosTUFBTSxDQUFDLE9BQVAsR0FDTTtJQUNTLHdCQUFBO01BQ1gsSUFBQyxDQUFBLE9BQUQsR0FBVyxJQUFJO01BQ2YsSUFBQyxDQUFBLFVBQUQsR0FBYztNQUNkLElBQUMsQ0FBQSxLQUFELEdBQVM7TUFDVCxJQUFDLENBQUEsS0FBRCxHQUFTO0lBSkU7OzZCQU1iLFlBQUEsR0FBYyxTQUFDLEVBQUQ7YUFBUSxJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSxjQUFaLEVBQTRCLEVBQTVCO0lBQVI7OzZCQUNkLGVBQUEsR0FBaUIsU0FBQyxFQUFEO2FBQVEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxFQUFULENBQVksaUJBQVosRUFBK0IsRUFBL0I7SUFBUjs7NkJBQ2pCLFVBQUEsR0FBWSxTQUFDLEVBQUQ7YUFBUSxJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSxpQkFBWixFQUErQixFQUEvQjtJQUFSOzs2QkFDWixnQkFBQSxHQUFrQixTQUFDLEVBQUQ7YUFBUSxJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSxrQkFBWixFQUFnQyxFQUFoQztJQUFSOzs2QkFDbEIsZ0JBQUEsR0FBa0IsU0FBQyxFQUFEO2FBQVEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxFQUFULENBQVksa0JBQVosRUFBZ0MsRUFBaEM7SUFBUjs7NkJBQ2xCLGlCQUFBLEdB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VUFBQTthQUFBLE1BQUEsR0FBUyxZQUFZLENBQUMsT0FBYixDQUFxQiwyQkFBckI7SUFEUTs7NkJBR25CLGlCQUFBLEdBQW1CLFNBQUMsTUFBRDthQUNqQixZQUFZLENBQUMsT0FBYixDQUFxQiwyQkFBckIsRUFBa0QsTUFBbEQ7SUFEaUI7Ozs7O0FBdFByQiIsInNvdXJjZXNDb250ZW50IjpbInBhdGggPSByZXF1aXJlICdwYXRoJ1xue0VtaXR0ZXJ9ID0gcmVxdWlyZSAnYXRvbSdcblxuVG9kb01vZGVsID0gcmVxdWlyZSAnLi90b2RvLW1vZGVsJ1xuVG9kb3NNYXJrZG93biA9IHJlcXVpcmUgJy4vdG9kby1tYXJrZG93bidcblRvZG9SZWdleCA9IHJlcXVpcmUgJy4vdG9kby1yZWdleCdcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgVG9kb0NvbGxlY3Rpb25cbiAgY29uc3RydWN0b3I6IC0+XG4gICAgQGVtaXR0ZXIgPSBuZXcgRW1pdHRlclxuICAgIEBkZWZhdWx0S2V5ID0gJ1RleHQnXG4gICAgQHNjb3BlID0gJ3dvcmtzcGFjZSdcbiAgICBAdG9kb3MgPSBbXVxuXG4gIG9uRGlkQWRkVG9kbzogKGNiKSAtPiBAZW1pdHRlci5vbiAnZGlkLWFkZC10b2RvJywgY2JcbiAgb25EaWRSZW1vdmVUb2RvOiAoY2IpIC0+IEBlbWl0dGVyLm9uICdkaWQtcmVtb3ZlLXRvZG8nLCBjYlxuICBvbkRpZENsZWFyOiAoY2IpIC0+IEBlbWl0dGVyLm9uICdkaWQtY2xlYXItdG9kb3MnLCBjYlxuICBvbkRpZFN0YXJ0U2VhcmNoOiAoY2IpIC0+IEBlbWl0dGVyLm9uICdkaWQtc3RhcnQtc2VhcmNoJywgY2JcbiAgb25EaWRTZWFyY2hQYXRoczogKGNiKSAtPiBAZW1pdHRlci5vbiAnZGlkLXNlYXJjaC1wYXRocycsIGNiXG4gIG9uRGlkRmluaXNoU2VhcmNoOiAoY2IpIC0+IEBlbWl0dGVyLm9uICdkaWQtZmluaXNoLXNlYXJjaCcsIGNiXG4gIG9uRGlkQ2FuY2VsU2VhcmNoOiAoY2IpIC0+IEBlbWl0dGVyLm9uICdkaWQtY2FuY2VsLXNlYXJjaCcsIGNiXG4gIG9uRGlkRmFpbFNlYXJjaDogKGNiKSAtPiBAZW1pdHRlci5vbiAnZGlkLWZhaWwtc2VhcmNoJywgY2JcbiAgb25EaWRTb3J0VG9kb3M6IChjYikgLT4gQGVtaXR0ZXIub24gJ2RpZC1zb3J0LXRvZG9zJywgY2JcbiAgb25EaWRGaWx0ZXJUb2RvczogKGNiKSAtPiBAZW1pdHRlci5vbiAnZGlkLWZpbHRlci10b2RvcycsIGNiXG4gIG9uRGlkQ2hhbmdlU2VhcmNoU2NvcGU6IChjYikgLT4gQGVtaXR0ZXIub24gJ2RpZC1jaGFuZ2Utc2NvcGUnLCBjYlxuXG4gIGNsZWFyOiAtPlxuICAgIEBjYW5jZWxTZWFyY2goKVxuICAgIEB0b2RvcyA9IFtdXG4gICAgQGVtaXR0ZXIuZW1pdCAnZGlkLWNsZWFyLXRvZG9zJ1xuXG4gIGFkZFRvZG86ICh0b2RvKSAtPlxuICAgIHJldHVybiBpZiBAYWxyZWFkeUV4aXN0cyh0b2RvKVxuICAgIEB0b2Rvcy5wdXNoKHRvZG8pXG4gICAgQGVtaXR0ZXIuZW1pdCAnZGlkLWFkZC10b2RvJywgdG9kb1xuXG4gIGdldFRvZG9zOiAtPiBAdG9kb3NcbiAgZ2V0VG9kb3NDb3VudDogLT4gQHRvZG9zLmxlbmd0aFxuICBnZXRTdGF0ZTogLT4gQHNlYXJjaGluZ1xuXG4gIHNvcnRUb2RvczogKHtzb3J0QnksIHNvcnRBc2N9ID0ge30pIC0+XG4gICAgc29ydEJ5ID89IEBkZWZhdWx0S2V5XG5cbiAgICAjIFNhdmUgaGlzdG9yeSBvZiBuZXcgc29ydCBlbGVtZW50c1xuICAgIGlmIEBzZWFyY2hlcz9bQHNlYXJjaGVzLmxlbmd0aCAtIDFdLnNvcnRCeSBpc250IHNvcnRCeVxuICAgICAgQHNlYXJjaGVzID89IFtdXG4gICAgICBAc2VhcmNoZXMucHVzaCB7c29ydEJ5LCBzb3J0QXNjfVxuICAgIGVsc2VcbiAgICAgIEBzZWFyY2hlc1tAc2VhcmNoZXMubGVuZ3RoIC0gMV0gPSB7c29ydEJ5LCBzb3J0QXNjfVxuXG4gICAgQHRvZG9zID0gQHRvZG9zLnNvcnQoKHRvZG9BLCB0b2RvQikgPT5cbiAgICAgIEB0b2RvU29ydGVyKHRvZG9BLCB0b2RvQiwgc29ydEJ5LCBzb3J0QXNjKVxuICAgIClcblxuICAgIHJldHVybiBAZmlsdGVyVG9kb3MoQGZpbHRlcikgaWYgQGZpbHRlclxuICAgIEBlbWl0dGVyLmVtaXQgJ2RpZC1zb3J0LXRvZG9zJywgQHRvZG9zXG5cbiAgdG9kb1NvcnRlcjogKHRvZG9BLCB0b2RvQiwgc29ydEJ5LCBzb3J0QXNjKSAtPlxuICAgIFtzb3J0QnkyLCBzb3J0QXNjMl0gPSBbc29ydEJ5LCBzb3J0QXNjXVxuXG4gICAgYVZhbCA9IHRvZG9BLmdldChzb3J0QnkyKVxuICAgIGJWYWwgPSB0b2RvQi5nZXQoc29ydEJ5MilcblxuICAgIGlmIGFWYWwgaXMgYlZhbFxuICAgICAgIyBVc2UgcHJldmlvdXMgc29ydHMgdG8gbWFrZSBhIDItbGV2ZWwgc3RhYmxlIHNvcnRcbiAgICAgIGlmIHNlYXJjaCA9IEBzZWFyY2hlcz9bQHNlYXJjaGVzLmxlbmd0aCAtIDJdXG4gICAgICAgIFtzb3J0QnkyLCBzb3J0QXNjMl0gPSBbc2VhcmNoLnNvcnRCeSwgc2VhcmNoLnNvcnRBc2NdXG4gICAgICBlbHNlXG4gICAgICAgIHNvcnRCeTIgPSBAZGVmYXVsdEtleVxuXG4gICAgICBbYVZhbCwgYlZhbF0gPSBbdG9kb0EuZ2V0KHNvcnRCeTIpLCB0b2RvQi5nZXQoc29ydEJ5MildXG5cbiAgICAjIFNvcnQgdHlwZSBpbiB0aGUgZGVmaW5lZCBvcmRlciwgYXMgbnVtYmVyIG9yIG5vcm1hbCBzdHJpbmcgc29ydFxuICAgIGlmIHNvcnRCeTIgaXMgJ1R5cGUnXG4gICAgICBmaW5kVGhlc2VUb2RvcyA9IGF0b20uY29uZmlnLmdldCgndG9kby1zaG93LmZpbmRUaGVzZVRvZG9zJylcbiAgICAgIGNvbXAgPSBmaW5kVGhlc2VUb2Rvcy5pbmRleE9mKGFWYWwpIC0gZmluZFRoZXNlVG9kb3MuaW5kZXhPZihiVmFsKVxuICAgIGVsc2UgaWYgdG9kb0Eua2V5SXNOdW1iZXIoc29ydEJ5MilcbiAgICAgIGNvbXAgPSBwYXJzZUludChhVmFsKSAtIHBhcnNlSW50KGJWYWwpXG4gICAgZWxzZVxuICAgICAgY29tcCA9IGFWYWwubG9jYWxlQ29tcGFyZShiVmFsKVxuICAgIGlmIHNvcnRBc2MyIHRoZW4gY29tcCBlbHNlIC1jb21wXG5cbiAgZmlsdGVyVG9kb3M6IChmaWx0ZXIpIC0+XG4gICAgaWYgQGZpbHRlciA9IGZpbHRlclxuICAgICAgcmVzdWx0ID0gQHRvZG9zLmZpbHRlciAodG9kbykgLT5cbiAgICAgICAgdG9kby5jb250YWlucyhmaWx0ZXIpXG4gICAgZWxzZVxuICAgICAgcmVzdWx0ID0gQHRvZG9zXG5cbiAgICBAZW1pdHRlci5lbWl0ICdkaWQtZmlsdGVyLXRvZG9zJywgcmVzdWx0XG5cbiAgZ2V0QXZhaWxhYmxlVGFibGVJdGVtczogLT4gQGF2YWlsYWJsZUl0ZW1zXG4gIHNldEF2YWlsYWJsZVRhYmxlSXRlbXM6IChAYXZhaWxhYmxlSXRlbXMpIC0+XG5cbiAgZ2V0U2VhcmNoU2NvcGU6IC0+IEBzY29wZVxuICBzZXRTZWFyY2hTY29wZTogKHNjb3BlKSAtPlxuICAgIEBlbWl0dGVyLmVtaXQgJ2RpZC1jaGFuZ2Utc2NvcGUnLCBAc2NvcGUgPSBzY29wZVxuXG4gIHRvZ2dsZVNlYXJjaFNjb3BlOiAtPlxuICAgIHNjb3BlID0gc3dpdGNoIEBzY29wZVxuICAgICAgd2hlbiAnd29ya3NwYWNlJyB0aGVuICdwcm9qZWN0J1xuICAgICAgd2hlbiAncHJvamVjdCcgdGhlbiAnb3BlbidcbiAgICAgIHdoZW4gJ29wZW4nIHRoZW4gJ2FjdGl2ZSdcbiAgICAgIGVsc2UgJ3dvcmtzcGFjZSdcbiAgICBAc2V0U2VhcmNoU2NvcGUoc2NvcGUpXG4gICAgc2NvcGVcblxuICBhbHJlYWR5RXhpc3RzOiAobmV3VG9kbykgLT5cbiAgICBwcm9wZXJ0aWVzID0gWydyYW5nZScsICdwYXRoJ11cbiAgICBAdG9kb3Muc29tZSAodG9kbykgLT5cbiAgICAgIHByb3BlcnRpZXMuZXZlcnkgKHByb3ApIC0+XG4gICAgICAgIHRydWUgaWYgdG9kb1twcm9wXSBpcyBuZXdUb2RvW3Byb3BdXG5cbiAgIyBTY2FuIHByb2plY3Qgd29ya3NwYWNlIGZvciB0aGUgVG9kb1JlZ2V4IG9iamVjdFxuICAjIHJldHVybnMgYSBwcm9taXNlIHRoYXQgdGhlIHNjYW4gZ2VuZXJhdGVzXG4gIGZldGNoUmVnZXhJdGVtOiAodG9kb1JlZ2V4LCBhY3RpdmVQcm9qZWN0T25seSkgLT5cbiAgICBvcHRpb25zID1cbiAgICAgIHBhdGhzOiBAZ2V0U2VhcmNoUGF0aHMoKVxuICAgICAgb25QYXRoc1NlYXJjaGVkOiAoblBhdGhzKSA9PlxuICAgICAgICBAZW1pdHRlci5lbWl0ICdkaWQtc2VhcmNoLXBhdGhzJywgblBhdGhzIGlmIEBzZWFyY2hpbmdcblxuICAgIGF0b20ud29ya3NwYWNlLnNjYW4gdG9kb1JlZ2V4LnJlZ2V4cCwgb3B0aW9ucywgKHJlc3VsdCwgZXJyb3IpID0+XG4gICAgICBjb25zb2xlLmRlYnVnIGVycm9yLm1lc3NhZ2UgaWYgZXJyb3JcbiAgICAgIHJldHVybiB1bmxlc3MgcmVzdWx0XG5cbiAgICAgIHJldHVybiBpZiBhY3RpdmVQcm9qZWN0T25seSBhbmQgbm90IEBhY3RpdmVQcm9qZWN0SGFzKHJlc3VsdC5maWxlUGF0aClcblxuICAgICAgZm9yIG1hdGNoIGluIHJlc3VsdC5tYXRjaGVzXG4gICAgICAgIEBhZGRUb2RvIG5ldyBUb2RvTW9kZWwoXG4gICAgICAgICAgYWxsOiBtYXRjaC5saW5lVGV4dFxuICAgICAgICAgIHRleHQ6IG1hdGNoLm1hdGNoVGV4dFxuICAgICAgICAgIGxvYzogcmVzdWx0LmZpbGVQYXRoXG4gICAgICAgICAgcG9zaXRpb246IG1hdGNoLnJhbmdlXG4gICAgICAgICAgcmVnZXg6IHRvZG9SZWdleC5yZWdleFxuICAgICAgICAgIHJlZ2V4cDogdG9kb1JlZ2V4LnJlZ2V4cFxuICAgICAgICApXG5cbiAgIyBTY2FuIG9wZW4gZmlsZXMgZm9yIHRoZSBUb2RvUmVnZXggb2JqZWN0XG4gIGZldGNoT3BlblJlZ2V4SXRlbTogKHRvZG9SZWdleCwgYWN0aXZlRWRpdG9yT25seSkgLT5cbiAgICBlZGl0b3JzID0gW11cbiAgICBpZiBhY3RpdmVFZGl0b3JPbmx5XG4gICAgICBpZiBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRQYW5lcygpWzBdPy5nZXRBY3RpdmVFZGl0b3IoKVxuICAgICAgICBlZGl0b3JzID0gW2VkaXRvcl1cbiAgICBlbHNlXG4gICAgICBlZGl0b3JzID0gYXRvbS53b3Jrc3BhY2UuZ2V0VGV4dEVkaXRvcnMoKVxuXG4gICAgZm9yIGVkaXRvciBpbiBlZGl0b3JzXG4gICAgICBlZGl0b3Iuc2NhbiB0b2RvUmVnZXgucmVnZXhwLCAobWF0Y2gsIGVycm9yKSA9PlxuICAgICAgICBjb25zb2xlLmRlYnVnIGVycm9yLm1lc3NhZ2UgaWYgZXJyb3JcbiAgICAgICAgcmV0dXJuIHVubGVzcyBtYXRjaFxuXG4gICAgICAgIHJhbmdlID0gW1xuICAgICAgICAgIFttYXRjaC5jb21wdXRlZFJhbmdlLnN0YXJ0LnJvdywgbWF0Y2guY29tcHV0ZWRSYW5nZS5zdGFydC5jb2x1bW5dXG4gICAgICAgICAgW21hdGNoLmNvbXB1dGVkUmFuZ2UuZW5kLnJvdywgbWF0Y2guY29tcHV0ZWRSYW5nZS5lbmQuY29sdW1uXVxuICAgICAgICBdXG5cbiAgICAgICAgQGFkZFRvZG8gbmV3IFRvZG9Nb2RlbChcbiAgICAgICAgICBhbGw6IG1hdGNoLmxpbmVUZXh0XG4gICAgICAgICAgdGV4dDogbWF0Y2gubWF0Y2hUZXh0XG4gICAgICAgICAgbG9jOiBlZGl0b3IuZ2V0UGF0aCgpXG4gICAgICAgICAgcG9zaXRpb246IHJhbmdlXG4gICAgICAgICAgcmVnZXg6IHRvZG9SZWdleC5yZWdleFxuICAgICAgICAgIHJlZ2V4cDogdG9kb1JlZ2V4LnJlZ2V4cFxuICAgICAgICApXG5cbiAgICAjIE5vIGFzeW5jIG9wZXJhdGlvbnMsIHNvIGp1c3QgcmV0dXJuIGEgcmVzb2x2ZWQgcHJvbWlzZVxuICAgIFByb21pc2UucmVzb2x2ZSgpXG5cbiAgc2VhcmNoOiAtPlxuICAgIEBjbGVhcigpXG4gICAgQHNlYXJjaGluZyA9IHRydWVcbiAgICBAZW1pdHRlci5lbWl0ICdkaWQtc3RhcnQtc2VhcmNoJ1xuXG4gICAgdG9kb1JlZ2V4ID0gbmV3IFRvZG9SZWdleChcbiAgICAgIGF0b20uY29uZmlnLmdldCgndG9kby1zaG93LmZpbmRVc2luZ1JlZ2V4JylcbiAgICAgIGF0b20uY29uZmlnLmdldCgndG9kby1zaG93LmZpbmRUaGVzZVRvZG9zJylcbiAgICApXG5cbiAgICBpZiB0b2RvUmVnZXguZXJyb3JcbiAgICAgIEBlbWl0dGVyLmVtaXQgJ2RpZC1mYWlsLXNlYXJjaCcsIFwiSW52YWxpZCB0b2RvIHNlYXJjaCByZWdleFwiXG4gICAgICByZXR1cm5cblxuICAgIEBzZWFyY2hQcm9taXNlID0gc3dpdGNoIEBzY29wZVxuICAgICAgd2hlbiAnb3BlbicgdGhlbiBAZmV0Y2hPcGVuUmVnZXhJdGVtKHRvZG9SZWdleCwgZmFsc2UpXG4gICAgICB3aGVuICdhY3RpdmUnIHRoZW4gQGZldGNoT3BlblJlZ2V4SXRlbSh0b2RvUmVnZXgsIHRydWUpXG4gICAgICB3aGVuICdwcm9qZWN0JyB0aGVuIEBmZXRjaFJlZ2V4SXRlbSh0b2RvUmVnZXgsIHRydWUpXG4gICAgICBlbHNlIEBmZXRjaFJlZ2V4SXRlbSh0b2RvUmVnZXgpXG5cbiAgICBAc2VhcmNoUHJvbWlzZS50aGVuIChyZXN1bHQpID0+XG4gICAgICBAc2VhcmNoaW5nID0gZmFsc2VcbiAgICAgIGlmIHJlc3VsdCBpcyAnY2FuY2VsbGVkJ1xuICAgICAgICBAZW1pdHRlci5lbWl0ICdkaWQtY2FuY2VsLXNlYXJjaCdcbiAgICAgIGVsc2VcbiAgICAgICAgQGVtaXR0ZXIuZW1pdCAnZGlkLWZpbmlzaC1zZWFyY2gnXG4gICAgLmNhdGNoIChyZWFzb24pID0+XG4gICAgICBAc2VhcmNoaW5nID0gZmFsc2VcbiAgICAgIEBlbWl0dGVyLmVtaXQgJ2RpZC1mYWlsLXNlYXJjaCcsIHJlYXNvblxuXG4gIGdldFNlYXJjaFBhdGhzOiAtPlxuICAgIGlnbm9yZXMgPSBhdG9tLmNvbmZpZy5nZXQoJ3RvZG8tc2hvdy5pZ25vcmVUaGVzZVBhdGhzJylcbiAgICByZXR1cm4gWycqJ10gdW5sZXNzIGlnbm9yZXM/XG4gICAgaWYgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGlnbm9yZXMpIGlzbnQgJ1tvYmplY3QgQXJyYXldJ1xuICAgICAgQGVtaXR0ZXIuZW1pdCAnZGlkLWZhaWwtc2VhcmNoJywgXCJpZ25vcmVUaGVzZVBhdGhzIG11c3QgYmUgYW4gYXJyYXlcIlxuICAgICAgcmV0dXJuIFsnKiddXG4gICAgXCIhI3tpZ25vcmV9XCIgZm9yIGlnbm9yZSBpbiBpZ25vcmVzXG5cbiAgYWN0aXZlUHJvamVjdEhhczogKGZpbGVQYXRoID0gJycpIC0+XG4gICAgcmV0dXJuIHVubGVzcyBwcm9qZWN0ID0gQGdldEFjdGl2ZVByb2plY3QoKVxuICAgIGZpbGVQYXRoLmluZGV4T2YocHJvamVjdCkgaXMgMFxuXG4gIGdldEFjdGl2ZVByb2plY3Q6IC0+XG4gICAgcmV0dXJuIEBhY3RpdmVQcm9qZWN0IGlmIEBhY3RpdmVQcm9qZWN0XG4gICAgQGFjdGl2ZVByb2plY3QgPSBwcm9qZWN0IGlmIHByb2plY3QgPSBAZ2V0RmFsbGJhY2tQcm9qZWN0KClcblxuICBnZXRGYWxsYmFja1Byb2plY3Q6IC0+XG4gICAgZm9yIGl0ZW0gaW4gYXRvbS53b3Jrc3BhY2UuZ2V0UGFuZUl0ZW1zKClcbiAgICAgIGlmIHByb2plY3QgPSBAcHJvamVjdEZvckZpbGUoaXRlbS5nZXRQYXRoPygpKVxuICAgICAgICByZXR1cm4gcHJvamVjdFxuICAgIHByb2plY3QgaWYgcHJvamVjdCA9IGF0b20ucHJvamVjdC5nZXRQYXRocygpWzBdXG5cbiAgZ2V0QWN0aXZlUHJvamVjdE5hbWU6IC0+XG4gICAgcHJvamVjdE5hbWUgPSBwYXRoLmJhc2VuYW1lKEBnZXRBY3RpdmVQcm9qZWN0KCkpXG4gICAgaWYgcHJvamVjdE5hbWUgaXMgJ3VuZGVmaW5lZCcgdGhlbiBcIm5vIGFjdGl2ZSBwcm9qZWN0XCIgZWxzZSBwcm9qZWN0TmFtZVxuXG4gIHNldEFjdGl2ZVByb2plY3Q6IChmaWxlUGF0aCkgLT5cbiAgICBsYXN0UHJvamVjdCA9IEBhY3RpdmVQcm9qZWN0XG4gICAgQGFjdGl2ZVByb2plY3QgPSBwcm9qZWN0IGlmIHByb2plY3QgPSBAcHJvamVjdEZvckZpbGUoZmlsZVBhdGgpXG4gICAgcmV0dXJuIGZhbHNlIHVubGVzcyBsYXN0UHJvamVjdFxuICAgIGxhc3RQcm9qZWN0IGlzbnQgQGFjdGl2ZVByb2plY3RcblxuICBwcm9qZWN0Rm9yRmlsZTogKGZpbGVQYXRoKSAtPlxuICAgIHJldHVybiBpZiB0eXBlb2YgZmlsZVBhdGggaXNudCAnc3RyaW5nJ1xuICAgIHByb2plY3QgaWYgcHJvamVjdCA9IGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aChmaWxlUGF0aClbMF1cblxuICBnZXRNYXJrZG93bjogLT5cbiAgICB0b2Rvc01hcmtkb3duID0gbmV3IFRvZG9zTWFya2Rvd25cbiAgICB0b2Rvc01hcmtkb3duLm1hcmtkb3duIEBnZXRUb2RvcygpXG5cbiAgY2FuY2VsU2VhcmNoOiAtPlxuICAgIEBzZWFyY2hQcm9taXNlPy5jYW5jZWw/KClcblxuICAjIFRPRE86IFByZXZpb3VzIHNlYXJjaGVzIGFyZSBub3Qgc2F2ZWQgeWV0IVxuICBnZXRQcmV2aW91c1NlYXJjaDogLT5cbiAgICBzb3J0QnkgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSAndG9kby1zaG93LnByZXZpb3VzLXNvcnRCeSdcblxuICBzZXRQcmV2aW91c1NlYXJjaDogKHNlYXJjaCkgLT5cbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSAndG9kby1zaG93LnByZXZpb3VzLXNlYXJjaCcsIHNlYXJjaFxuIl19
