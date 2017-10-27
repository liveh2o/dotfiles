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
            range = [[match.range.start.row, match.range.start.column], [match.range.end.row, match.range.end.column]];
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
      var project, projectName;
      if (!(project = this.getActiveProject())) {
        return 'no active project';
      }
      projectName = path.basename(project);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RvZG8tc2hvdy9saWIvdG9kby1jb2xsZWN0aW9uLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNOLFVBQVcsT0FBQSxDQUFRLE1BQVI7O0VBRVosU0FBQSxHQUFZLE9BQUEsQ0FBUSxjQUFSOztFQUNaLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLGlCQUFSOztFQUNoQixTQUFBLEdBQVksT0FBQSxDQUFRLGNBQVI7O0VBRVosTUFBTSxDQUFDLE9BQVAsR0FDTTtJQUNTLHdCQUFBO01BQ1gsSUFBQyxDQUFBLE9BQUQsR0FBVyxJQUFJO01BQ2YsSUFBQyxDQUFBLFVBQUQsR0FBYztNQUNkLElBQUMsQ0FBQSxLQUFELEdBQVM7TUFDVCxJQUFDLENBQUEsS0FBRCxHQUFTO0lBSkU7OzZCQU1iLFlBQUEsR0FBYyxTQUFDLEVBQUQ7YUFBUSxJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSxjQUFaLEVBQTRCLEVBQTVCO0lBQVI7OzZCQUNkLGVBQUEsR0FBaUIsU0FBQyxFQUFEO2FBQVEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxFQUFULENBQVksaUJBQVosRUFBK0IsRUFBL0I7SUFBUjs7NkJBQ2pCLFVBQUEsR0FBWSxTQUFDLEVBQUQ7YUFBUSxJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSxpQkFBWixFQUErQixFQUEvQjtJQUFSOzs2QkFDWixnQkFBQSxHQUFrQixTQUFDLEVBQUQ7YUFBUSxJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSxrQkFBWixFQUFnQyxFQUFoQztJQUFSOzs2QkFDbEIsZ0JBQUEsR0FBa0IsU0FBQyxFQUFEO2FBQVEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxFQUFULENBQVksa0JBQVosRUFBZ0MsRUFBaEM7SUFBUjs7NkJBQ2xCLGlCQUFBLEdB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QUE7QUFDWixVQUFBO3dGQUFjLENBQUU7SUFESjs7NkJBSWQsaUJBQUEsR0FBbUIsU0FBQTtBQUNqQixVQUFBO2FBQUEsTUFBQSxHQUFTLFlBQVksQ0FBQyxPQUFiLENBQXFCLDJCQUFyQjtJQURROzs2QkFHbkIsaUJBQUEsR0FBbUIsU0FBQyxNQUFEO2FBQ2pCLFlBQVksQ0FBQyxPQUFiLENBQXFCLDJCQUFyQixFQUFrRCxNQUFsRDtJQURpQjs7Ozs7QUF2UHJCIiwic291cmNlc0NvbnRlbnQiOlsicGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG57RW1pdHRlcn0gPSByZXF1aXJlICdhdG9tJ1xuXG5Ub2RvTW9kZWwgPSByZXF1aXJlICcuL3RvZG8tbW9kZWwnXG5Ub2Rvc01hcmtkb3duID0gcmVxdWlyZSAnLi90b2RvLW1hcmtkb3duJ1xuVG9kb1JlZ2V4ID0gcmVxdWlyZSAnLi90b2RvLXJlZ2V4J1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBUb2RvQ29sbGVjdGlvblxuICBjb25zdHJ1Y3RvcjogLT5cbiAgICBAZW1pdHRlciA9IG5ldyBFbWl0dGVyXG4gICAgQGRlZmF1bHRLZXkgPSAnVGV4dCdcbiAgICBAc2NvcGUgPSAnd29ya3NwYWNlJ1xuICAgIEB0b2RvcyA9IFtdXG5cbiAgb25EaWRBZGRUb2RvOiAoY2IpIC0+IEBlbWl0dGVyLm9uICdkaWQtYWRkLXRvZG8nLCBjYlxuICBvbkRpZFJlbW92ZVRvZG86IChjYikgLT4gQGVtaXR0ZXIub24gJ2RpZC1yZW1vdmUtdG9kbycsIGNiXG4gIG9uRGlkQ2xlYXI6IChjYikgLT4gQGVtaXR0ZXIub24gJ2RpZC1jbGVhci10b2RvcycsIGNiXG4gIG9uRGlkU3RhcnRTZWFyY2g6IChjYikgLT4gQGVtaXR0ZXIub24gJ2RpZC1zdGFydC1zZWFyY2gnLCBjYlxuICBvbkRpZFNlYXJjaFBhdGhzOiAoY2IpIC0+IEBlbWl0dGVyLm9uICdkaWQtc2VhcmNoLXBhdGhzJywgY2JcbiAgb25EaWRGaW5pc2hTZWFyY2g6IChjYikgLT4gQGVtaXR0ZXIub24gJ2RpZC1maW5pc2gtc2VhcmNoJywgY2JcbiAgb25EaWRDYW5jZWxTZWFyY2g6IChjYikgLT4gQGVtaXR0ZXIub24gJ2RpZC1jYW5jZWwtc2VhcmNoJywgY2JcbiAgb25EaWRGYWlsU2VhcmNoOiAoY2IpIC0+IEBlbWl0dGVyLm9uICdkaWQtZmFpbC1zZWFyY2gnLCBjYlxuICBvbkRpZFNvcnRUb2RvczogKGNiKSAtPiBAZW1pdHRlci5vbiAnZGlkLXNvcnQtdG9kb3MnLCBjYlxuICBvbkRpZEZpbHRlclRvZG9zOiAoY2IpIC0+IEBlbWl0dGVyLm9uICdkaWQtZmlsdGVyLXRvZG9zJywgY2JcbiAgb25EaWRDaGFuZ2VTZWFyY2hTY29wZTogKGNiKSAtPiBAZW1pdHRlci5vbiAnZGlkLWNoYW5nZS1zY29wZScsIGNiXG5cbiAgY2xlYXI6IC0+XG4gICAgQGNhbmNlbFNlYXJjaCgpXG4gICAgQHRvZG9zID0gW11cbiAgICBAZW1pdHRlci5lbWl0ICdkaWQtY2xlYXItdG9kb3MnXG5cbiAgYWRkVG9kbzogKHRvZG8pIC0+XG4gICAgcmV0dXJuIGlmIEBhbHJlYWR5RXhpc3RzKHRvZG8pXG4gICAgQHRvZG9zLnB1c2godG9kbylcbiAgICBAZW1pdHRlci5lbWl0ICdkaWQtYWRkLXRvZG8nLCB0b2RvXG5cbiAgZ2V0VG9kb3M6IC0+IEB0b2Rvc1xuICBnZXRUb2Rvc0NvdW50OiAtPiBAdG9kb3MubGVuZ3RoXG4gIGdldFN0YXRlOiAtPiBAc2VhcmNoaW5nXG5cbiAgc29ydFRvZG9zOiAoe3NvcnRCeSwgc29ydEFzY30gPSB7fSkgLT5cbiAgICBzb3J0QnkgPz0gQGRlZmF1bHRLZXlcblxuICAgICMgU2F2ZSBoaXN0b3J5IG9mIG5ldyBzb3J0IGVsZW1lbnRzXG4gICAgaWYgQHNlYXJjaGVzP1tAc2VhcmNoZXMubGVuZ3RoIC0gMV0uc29ydEJ5IGlzbnQgc29ydEJ5XG4gICAgICBAc2VhcmNoZXMgPz0gW11cbiAgICAgIEBzZWFyY2hlcy5wdXNoIHtzb3J0QnksIHNvcnRBc2N9XG4gICAgZWxzZVxuICAgICAgQHNlYXJjaGVzW0BzZWFyY2hlcy5sZW5ndGggLSAxXSA9IHtzb3J0QnksIHNvcnRBc2N9XG5cbiAgICBAdG9kb3MgPSBAdG9kb3Muc29ydCgodG9kb0EsIHRvZG9CKSA9PlxuICAgICAgQHRvZG9Tb3J0ZXIodG9kb0EsIHRvZG9CLCBzb3J0QnksIHNvcnRBc2MpXG4gICAgKVxuXG4gICAgcmV0dXJuIEBmaWx0ZXJUb2RvcyhAZmlsdGVyKSBpZiBAZmlsdGVyXG4gICAgQGVtaXR0ZXIuZW1pdCAnZGlkLXNvcnQtdG9kb3MnLCBAdG9kb3NcblxuICB0b2RvU29ydGVyOiAodG9kb0EsIHRvZG9CLCBzb3J0QnksIHNvcnRBc2MpIC0+XG4gICAgW3NvcnRCeTIsIHNvcnRBc2MyXSA9IFtzb3J0QnksIHNvcnRBc2NdXG5cbiAgICBhVmFsID0gdG9kb0EuZ2V0KHNvcnRCeTIpXG4gICAgYlZhbCA9IHRvZG9CLmdldChzb3J0QnkyKVxuXG4gICAgaWYgYVZhbCBpcyBiVmFsXG4gICAgICAjIFVzZSBwcmV2aW91cyBzb3J0cyB0byBtYWtlIGEgMi1sZXZlbCBzdGFibGUgc29ydFxuICAgICAgaWYgc2VhcmNoID0gQHNlYXJjaGVzP1tAc2VhcmNoZXMubGVuZ3RoIC0gMl1cbiAgICAgICAgW3NvcnRCeTIsIHNvcnRBc2MyXSA9IFtzZWFyY2guc29ydEJ5LCBzZWFyY2guc29ydEFzY11cbiAgICAgIGVsc2VcbiAgICAgICAgc29ydEJ5MiA9IEBkZWZhdWx0S2V5XG5cbiAgICAgIFthVmFsLCBiVmFsXSA9IFt0b2RvQS5nZXQoc29ydEJ5MiksIHRvZG9CLmdldChzb3J0QnkyKV1cblxuICAgICMgU29ydCB0eXBlIGluIHRoZSBkZWZpbmVkIG9yZGVyLCBhcyBudW1iZXIgb3Igbm9ybWFsIHN0cmluZyBzb3J0XG4gICAgaWYgc29ydEJ5MiBpcyAnVHlwZSdcbiAgICAgIGZpbmRUaGVzZVRvZG9zID0gYXRvbS5jb25maWcuZ2V0KCd0b2RvLXNob3cuZmluZFRoZXNlVG9kb3MnKVxuICAgICAgY29tcCA9IGZpbmRUaGVzZVRvZG9zLmluZGV4T2YoYVZhbCkgLSBmaW5kVGhlc2VUb2Rvcy5pbmRleE9mKGJWYWwpXG4gICAgZWxzZSBpZiB0b2RvQS5rZXlJc051bWJlcihzb3J0QnkyKVxuICAgICAgY29tcCA9IHBhcnNlSW50KGFWYWwpIC0gcGFyc2VJbnQoYlZhbClcbiAgICBlbHNlXG4gICAgICBjb21wID0gYVZhbC5sb2NhbGVDb21wYXJlKGJWYWwpXG4gICAgaWYgc29ydEFzYzIgdGhlbiBjb21wIGVsc2UgLWNvbXBcblxuICBmaWx0ZXJUb2RvczogKGZpbHRlcikgLT5cbiAgICBpZiBAZmlsdGVyID0gZmlsdGVyXG4gICAgICByZXN1bHQgPSBAdG9kb3MuZmlsdGVyICh0b2RvKSAtPlxuICAgICAgICB0b2RvLmNvbnRhaW5zKGZpbHRlcilcbiAgICBlbHNlXG4gICAgICByZXN1bHQgPSBAdG9kb3NcblxuICAgIEBlbWl0dGVyLmVtaXQgJ2RpZC1maWx0ZXItdG9kb3MnLCByZXN1bHRcblxuICBnZXRBdmFpbGFibGVUYWJsZUl0ZW1zOiAtPiBAYXZhaWxhYmxlSXRlbXNcbiAgc2V0QXZhaWxhYmxlVGFibGVJdGVtczogKEBhdmFpbGFibGVJdGVtcykgLT5cblxuICBnZXRTZWFyY2hTY29wZTogLT4gQHNjb3BlXG4gIHNldFNlYXJjaFNjb3BlOiAoc2NvcGUpIC0+XG4gICAgQGVtaXR0ZXIuZW1pdCAnZGlkLWNoYW5nZS1zY29wZScsIEBzY29wZSA9IHNjb3BlXG5cbiAgdG9nZ2xlU2VhcmNoU2NvcGU6IC0+XG4gICAgc2NvcGUgPSBzd2l0Y2ggQHNjb3BlXG4gICAgICB3aGVuICd3b3Jrc3BhY2UnIHRoZW4gJ3Byb2plY3QnXG4gICAgICB3aGVuICdwcm9qZWN0JyB0aGVuICdvcGVuJ1xuICAgICAgd2hlbiAnb3BlbicgdGhlbiAnYWN0aXZlJ1xuICAgICAgZWxzZSAnd29ya3NwYWNlJ1xuICAgIEBzZXRTZWFyY2hTY29wZShzY29wZSlcbiAgICBzY29wZVxuXG4gIGFscmVhZHlFeGlzdHM6IChuZXdUb2RvKSAtPlxuICAgIHByb3BlcnRpZXMgPSBbJ3JhbmdlJywgJ3BhdGgnXVxuICAgIEB0b2Rvcy5zb21lICh0b2RvKSAtPlxuICAgICAgcHJvcGVydGllcy5ldmVyeSAocHJvcCkgLT5cbiAgICAgICAgdHJ1ZSBpZiB0b2RvW3Byb3BdIGlzIG5ld1RvZG9bcHJvcF1cblxuICAjIFNjYW4gcHJvamVjdCB3b3Jrc3BhY2UgZm9yIHRoZSBUb2RvUmVnZXggb2JqZWN0XG4gICMgcmV0dXJucyBhIHByb21pc2UgdGhhdCB0aGUgc2NhbiBnZW5lcmF0ZXNcbiAgZmV0Y2hSZWdleEl0ZW06ICh0b2RvUmVnZXgsIGFjdGl2ZVByb2plY3RPbmx5KSAtPlxuICAgIG9wdGlvbnMgPVxuICAgICAgcGF0aHM6IEBnZXRTZWFyY2hQYXRocygpXG4gICAgICBvblBhdGhzU2VhcmNoZWQ6IChuUGF0aHMpID0+XG4gICAgICAgIEBlbWl0dGVyLmVtaXQgJ2RpZC1zZWFyY2gtcGF0aHMnLCBuUGF0aHMgaWYgQHNlYXJjaGluZ1xuXG4gICAgYXRvbS53b3Jrc3BhY2Uuc2NhbiB0b2RvUmVnZXgucmVnZXhwLCBvcHRpb25zLCAocmVzdWx0LCBlcnJvcikgPT5cbiAgICAgIGNvbnNvbGUuZGVidWcgZXJyb3IubWVzc2FnZSBpZiBlcnJvclxuICAgICAgcmV0dXJuIHVubGVzcyByZXN1bHRcblxuICAgICAgcmV0dXJuIGlmIGFjdGl2ZVByb2plY3RPbmx5IGFuZCBub3QgQGFjdGl2ZVByb2plY3RIYXMocmVzdWx0LmZpbGVQYXRoKVxuXG4gICAgICBmb3IgbWF0Y2ggaW4gcmVzdWx0Lm1hdGNoZXNcbiAgICAgICAgQGFkZFRvZG8gbmV3IFRvZG9Nb2RlbChcbiAgICAgICAgICBhbGw6IG1hdGNoLmxpbmVUZXh0XG4gICAgICAgICAgdGV4dDogbWF0Y2gubWF0Y2hUZXh0XG4gICAgICAgICAgbG9jOiByZXN1bHQuZmlsZVBhdGhcbiAgICAgICAgICBwb3NpdGlvbjogbWF0Y2gucmFuZ2VcbiAgICAgICAgICByZWdleDogdG9kb1JlZ2V4LnJlZ2V4XG4gICAgICAgICAgcmVnZXhwOiB0b2RvUmVnZXgucmVnZXhwXG4gICAgICAgIClcblxuICAjIFNjYW4gb3BlbiBmaWxlcyBmb3IgdGhlIFRvZG9SZWdleCBvYmplY3RcbiAgZmV0Y2hPcGVuUmVnZXhJdGVtOiAodG9kb1JlZ2V4LCBhY3RpdmVFZGl0b3JPbmx5KSAtPlxuICAgIGVkaXRvcnMgPSBbXVxuICAgIGlmIGFjdGl2ZUVkaXRvck9ubHlcbiAgICAgIGlmIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldFBhbmVzKClbMF0/LmdldEFjdGl2ZUVkaXRvcigpXG4gICAgICAgIGVkaXRvcnMgPSBbZWRpdG9yXVxuICAgIGVsc2VcbiAgICAgIGVkaXRvcnMgPSBhdG9tLndvcmtzcGFjZS5nZXRUZXh0RWRpdG9ycygpXG5cbiAgICBmb3IgZWRpdG9yIGluIGVkaXRvcnNcbiAgICAgIGVkaXRvci5zY2FuIHRvZG9SZWdleC5yZWdleHAsIChtYXRjaCwgZXJyb3IpID0+XG4gICAgICAgIGNvbnNvbGUuZGVidWcgZXJyb3IubWVzc2FnZSBpZiBlcnJvclxuICAgICAgICByZXR1cm4gdW5sZXNzIG1hdGNoXG5cbiAgICAgICAgcmFuZ2UgPSBbXG4gICAgICAgICAgW21hdGNoLnJhbmdlLnN0YXJ0LnJvdywgbWF0Y2gucmFuZ2Uuc3RhcnQuY29sdW1uXVxuICAgICAgICAgIFttYXRjaC5yYW5nZS5lbmQucm93LCBtYXRjaC5yYW5nZS5lbmQuY29sdW1uXVxuICAgICAgICBdXG5cbiAgICAgICAgQGFkZFRvZG8gbmV3IFRvZG9Nb2RlbChcbiAgICAgICAgICBhbGw6IG1hdGNoLmxpbmVUZXh0XG4gICAgICAgICAgdGV4dDogbWF0Y2gubWF0Y2hUZXh0XG4gICAgICAgICAgbG9jOiBlZGl0b3IuZ2V0UGF0aCgpXG4gICAgICAgICAgcG9zaXRpb246IHJhbmdlXG4gICAgICAgICAgcmVnZXg6IHRvZG9SZWdleC5yZWdleFxuICAgICAgICAgIHJlZ2V4cDogdG9kb1JlZ2V4LnJlZ2V4cFxuICAgICAgICApXG5cbiAgICAjIE5vIGFzeW5jIG9wZXJhdGlvbnMsIHNvIGp1c3QgcmV0dXJuIGEgcmVzb2x2ZWQgcHJvbWlzZVxuICAgIFByb21pc2UucmVzb2x2ZSgpXG5cbiAgc2VhcmNoOiAtPlxuICAgIEBjbGVhcigpXG4gICAgQHNlYXJjaGluZyA9IHRydWVcbiAgICBAZW1pdHRlci5lbWl0ICdkaWQtc3RhcnQtc2VhcmNoJ1xuXG4gICAgdG9kb1JlZ2V4ID0gbmV3IFRvZG9SZWdleChcbiAgICAgIGF0b20uY29uZmlnLmdldCgndG9kby1zaG93LmZpbmRVc2luZ1JlZ2V4JylcbiAgICAgIGF0b20uY29uZmlnLmdldCgndG9kby1zaG93LmZpbmRUaGVzZVRvZG9zJylcbiAgICApXG5cbiAgICBpZiB0b2RvUmVnZXguZXJyb3JcbiAgICAgIEBlbWl0dGVyLmVtaXQgJ2RpZC1mYWlsLXNlYXJjaCcsIFwiSW52YWxpZCB0b2RvIHNlYXJjaCByZWdleFwiXG4gICAgICByZXR1cm5cblxuICAgIEBzZWFyY2hQcm9taXNlID0gc3dpdGNoIEBzY29wZVxuICAgICAgd2hlbiAnb3BlbicgdGhlbiBAZmV0Y2hPcGVuUmVnZXhJdGVtKHRvZG9SZWdleCwgZmFsc2UpXG4gICAgICB3aGVuICdhY3RpdmUnIHRoZW4gQGZldGNoT3BlblJlZ2V4SXRlbSh0b2RvUmVnZXgsIHRydWUpXG4gICAgICB3aGVuICdwcm9qZWN0JyB0aGVuIEBmZXRjaFJlZ2V4SXRlbSh0b2RvUmVnZXgsIHRydWUpXG4gICAgICBlbHNlIEBmZXRjaFJlZ2V4SXRlbSh0b2RvUmVnZXgpXG5cbiAgICBAc2VhcmNoUHJvbWlzZS50aGVuIChyZXN1bHQpID0+XG4gICAgICBAc2VhcmNoaW5nID0gZmFsc2VcbiAgICAgIGlmIHJlc3VsdCBpcyAnY2FuY2VsbGVkJ1xuICAgICAgICBAZW1pdHRlci5lbWl0ICdkaWQtY2FuY2VsLXNlYXJjaCdcbiAgICAgIGVsc2VcbiAgICAgICAgQGVtaXR0ZXIuZW1pdCAnZGlkLWZpbmlzaC1zZWFyY2gnXG4gICAgLmNhdGNoIChyZWFzb24pID0+XG4gICAgICBAc2VhcmNoaW5nID0gZmFsc2VcbiAgICAgIEBlbWl0dGVyLmVtaXQgJ2RpZC1mYWlsLXNlYXJjaCcsIHJlYXNvblxuXG4gIGdldFNlYXJjaFBhdGhzOiAtPlxuICAgIGlnbm9yZXMgPSBhdG9tLmNvbmZpZy5nZXQoJ3RvZG8tc2hvdy5pZ25vcmVUaGVzZVBhdGhzJylcbiAgICByZXR1cm4gWycqJ10gdW5sZXNzIGlnbm9yZXM/XG4gICAgaWYgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGlnbm9yZXMpIGlzbnQgJ1tvYmplY3QgQXJyYXldJ1xuICAgICAgQGVtaXR0ZXIuZW1pdCAnZGlkLWZhaWwtc2VhcmNoJywgXCJpZ25vcmVUaGVzZVBhdGhzIG11c3QgYmUgYW4gYXJyYXlcIlxuICAgICAgcmV0dXJuIFsnKiddXG4gICAgXCIhI3tpZ25vcmV9XCIgZm9yIGlnbm9yZSBpbiBpZ25vcmVzXG5cbiAgYWN0aXZlUHJvamVjdEhhczogKGZpbGVQYXRoID0gJycpIC0+XG4gICAgcmV0dXJuIHVubGVzcyBwcm9qZWN0ID0gQGdldEFjdGl2ZVByb2plY3QoKVxuICAgIGZpbGVQYXRoLmluZGV4T2YocHJvamVjdCkgaXMgMFxuXG4gIGdldEFjdGl2ZVByb2plY3Q6IC0+XG4gICAgcmV0dXJuIEBhY3RpdmVQcm9qZWN0IGlmIEBhY3RpdmVQcm9qZWN0XG4gICAgQGFjdGl2ZVByb2plY3QgPSBwcm9qZWN0IGlmIHByb2plY3QgPSBAZ2V0RmFsbGJhY2tQcm9qZWN0KClcblxuICBnZXRGYWxsYmFja1Byb2plY3Q6IC0+XG4gICAgZm9yIGl0ZW0gaW4gYXRvbS53b3Jrc3BhY2UuZ2V0UGFuZUl0ZW1zKClcbiAgICAgIGlmIHByb2plY3QgPSBAcHJvamVjdEZvckZpbGUoaXRlbS5nZXRQYXRoPygpKVxuICAgICAgICByZXR1cm4gcHJvamVjdFxuICAgIHByb2plY3QgaWYgcHJvamVjdCA9IGF0b20ucHJvamVjdC5nZXRQYXRocygpWzBdXG5cbiAgZ2V0QWN0aXZlUHJvamVjdE5hbWU6IC0+XG4gICAgcmV0dXJuICdubyBhY3RpdmUgcHJvamVjdCcgdW5sZXNzIHByb2plY3QgPSBAZ2V0QWN0aXZlUHJvamVjdCgpXG4gICAgcHJvamVjdE5hbWUgPSBwYXRoLmJhc2VuYW1lKHByb2plY3QpXG4gICAgaWYgcHJvamVjdE5hbWUgaXMgJ3VuZGVmaW5lZCcgdGhlbiBcIm5vIGFjdGl2ZSBwcm9qZWN0XCIgZWxzZSBwcm9qZWN0TmFtZVxuXG4gIHNldEFjdGl2ZVByb2plY3Q6IChmaWxlUGF0aCkgLT5cbiAgICBsYXN0UHJvamVjdCA9IEBhY3RpdmVQcm9qZWN0XG4gICAgQGFjdGl2ZVByb2plY3QgPSBwcm9qZWN0IGlmIHByb2plY3QgPSBAcHJvamVjdEZvckZpbGUoZmlsZVBhdGgpXG4gICAgcmV0dXJuIGZhbHNlIHVubGVzcyBsYXN0UHJvamVjdFxuICAgIGxhc3RQcm9qZWN0IGlzbnQgQGFjdGl2ZVByb2plY3RcblxuICBwcm9qZWN0Rm9yRmlsZTogKGZpbGVQYXRoKSAtPlxuICAgIHJldHVybiBpZiB0eXBlb2YgZmlsZVBhdGggaXNudCAnc3RyaW5nJ1xuICAgIHByb2plY3QgaWYgcHJvamVjdCA9IGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aChmaWxlUGF0aClbMF1cblxuICBnZXRNYXJrZG93bjogLT5cbiAgICB0b2Rvc01hcmtkb3duID0gbmV3IFRvZG9zTWFya2Rvd25cbiAgICB0b2Rvc01hcmtkb3duLm1hcmtkb3duIEBnZXRUb2RvcygpXG5cbiAgY2FuY2VsU2VhcmNoOiAtPlxuICAgIEBzZWFyY2hQcm9taXNlPy5jYW5jZWw/KClcblxuICAjIFRPRE86IFByZXZpb3VzIHNlYXJjaGVzIGFyZSBub3Qgc2F2ZWQgeWV0IVxuICBnZXRQcmV2aW91c1NlYXJjaDogLT5cbiAgICBzb3J0QnkgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSAndG9kby1zaG93LnByZXZpb3VzLXNvcnRCeSdcblxuICBzZXRQcmV2aW91c1NlYXJjaDogKHNlYXJjaCkgLT5cbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSAndG9kby1zaG93LnByZXZpb3VzLXNlYXJjaCcsIHNlYXJjaFxuIl19
