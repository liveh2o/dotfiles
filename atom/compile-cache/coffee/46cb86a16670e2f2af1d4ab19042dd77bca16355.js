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
      this.filter = filter;
      return this.emitter.emit('did-filter-todos', this.getFilteredTodos());
    };

    TodoCollection.prototype.getFilteredTodos = function() {
      var filter;
      if (!(filter = this.filter)) {
        return this.todos;
      }
      return this.todos.filter(function(todo) {
        return todo.contains(filter);
      });
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

    TodoCollection.prototype.getCustomPath = function() {
      return this.customPath;
    };

    TodoCollection.prototype.setCustomPath = function(customPath) {
      this.customPath = customPath;
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
      if (this.scope === 'custom') {
        return [this.getCustomPath()];
      }
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
      return todosMarkdown.markdown(this.getFilteredTodos());
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RvZG8tc2hvdy9saWIvdG9kby1jb2xsZWN0aW9uLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNOLFVBQVcsT0FBQSxDQUFRLE1BQVI7O0VBRVosU0FBQSxHQUFZLE9BQUEsQ0FBUSxjQUFSOztFQUNaLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLGlCQUFSOztFQUNoQixTQUFBLEdBQVksT0FBQSxDQUFRLGNBQVI7O0VBRVosTUFBTSxDQUFDLE9BQVAsR0FDTTtJQUNTLHdCQUFBO01BQ1gsSUFBQyxDQUFBLE9BQUQsR0FBVyxJQUFJO01BQ2YsSUFBQyxDQUFBLFVBQUQsR0FBYztNQUNkLElBQUMsQ0FBQSxLQUFELEdBQVM7TUFDVCxJQUFDLENBQUEsS0FBRCxHQUFTO0lBSkU7OzZCQU1iLFlBQUEsR0FBYyxTQUFDLEVBQUQ7YUFBUSxJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSxjQUFaLEVBQTRCLEVBQTVCO0lBQVI7OzZCQUNkLGVBQUEsR0FBaUIsU0FBQyxFQUFEO2FBQVEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxFQUFULENBQVksaUJBQVosRUFBK0IsRUFBL0I7SUFBUjs7NkJBQ2pCLFVBQUEsR0FBWSxTQUFDLEVBQUQ7YUFBUSxJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSxpQkFBWixFQUErQixFQUEvQjtJQUFSOzs2QkFDWixnQkFBQSxHQUFrQixTQUFDLEVBQUQ7YUFBUSxJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSxrQkFBWixFQUFnQyxFQUFoQztJQUFSOzs2QkFDbEIsZ0JBQUEsR0FBa0IsU0FBQyxFQUFEO2FBQVEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxFQUFULENBQVksa0JBQVosRUFBZ0MsRUFBaEM7SUFBUjs7NkJBQ2xCLGlCQUFBLEdB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QjtBQUFBLGVBQUE7O01BQ0EsSUFBVyxPQUFBLEdBQVUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFiLENBQTRCLFFBQTVCLENBQXNDLENBQUEsQ0FBQSxDQUEzRDtlQUFBLFFBQUE7O0lBRmM7OzZCQUloQixXQUFBLEdBQWEsU0FBQTtBQUNYLFVBQUE7TUFBQSxhQUFBLEdBQWdCLElBQUk7YUFDcEIsYUFBYSxDQUFDLFFBQWQsQ0FBdUIsSUFBQyxDQUFBLGdCQUFELENBQUEsQ0FBdkI7SUFGVzs7NkJBSWIsWUFBQSxHQUFjLFNBQUE7QUFDWixVQUFBO3dGQUFjLENBQUU7SUFESjs7NkJBSWQsaUJBQUEsR0FBbUIsU0FBQTtBQUNqQixVQUFBO2FBQUEsTUFBQSxHQUFTLFlBQVksQ0FBQyxPQUFiLENBQXFCLDJCQUFyQjtJQURROzs2QkFHbkIsaUJBQUEsR0FBbUIsU0FBQyxNQUFEO2FBQ2pCLFlBQVksQ0FBQyxPQUFiLENBQXFCLDJCQUFyQixFQUFrRCxNQUFsRDtJQURpQjs7Ozs7QUE1UHJCIiwic291cmNlc0NvbnRlbnQiOlsicGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG57RW1pdHRlcn0gPSByZXF1aXJlICdhdG9tJ1xuXG5Ub2RvTW9kZWwgPSByZXF1aXJlICcuL3RvZG8tbW9kZWwnXG5Ub2Rvc01hcmtkb3duID0gcmVxdWlyZSAnLi90b2RvLW1hcmtkb3duJ1xuVG9kb1JlZ2V4ID0gcmVxdWlyZSAnLi90b2RvLXJlZ2V4J1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBUb2RvQ29sbGVjdGlvblxuICBjb25zdHJ1Y3RvcjogLT5cbiAgICBAZW1pdHRlciA9IG5ldyBFbWl0dGVyXG4gICAgQGRlZmF1bHRLZXkgPSAnVGV4dCdcbiAgICBAc2NvcGUgPSAnd29ya3NwYWNlJ1xuICAgIEB0b2RvcyA9IFtdXG5cbiAgb25EaWRBZGRUb2RvOiAoY2IpIC0+IEBlbWl0dGVyLm9uICdkaWQtYWRkLXRvZG8nLCBjYlxuICBvbkRpZFJlbW92ZVRvZG86IChjYikgLT4gQGVtaXR0ZXIub24gJ2RpZC1yZW1vdmUtdG9kbycsIGNiXG4gIG9uRGlkQ2xlYXI6IChjYikgLT4gQGVtaXR0ZXIub24gJ2RpZC1jbGVhci10b2RvcycsIGNiXG4gIG9uRGlkU3RhcnRTZWFyY2g6IChjYikgLT4gQGVtaXR0ZXIub24gJ2RpZC1zdGFydC1zZWFyY2gnLCBjYlxuICBvbkRpZFNlYXJjaFBhdGhzOiAoY2IpIC0+IEBlbWl0dGVyLm9uICdkaWQtc2VhcmNoLXBhdGhzJywgY2JcbiAgb25EaWRGaW5pc2hTZWFyY2g6IChjYikgLT4gQGVtaXR0ZXIub24gJ2RpZC1maW5pc2gtc2VhcmNoJywgY2JcbiAgb25EaWRDYW5jZWxTZWFyY2g6IChjYikgLT4gQGVtaXR0ZXIub24gJ2RpZC1jYW5jZWwtc2VhcmNoJywgY2JcbiAgb25EaWRGYWlsU2VhcmNoOiAoY2IpIC0+IEBlbWl0dGVyLm9uICdkaWQtZmFpbC1zZWFyY2gnLCBjYlxuICBvbkRpZFNvcnRUb2RvczogKGNiKSAtPiBAZW1pdHRlci5vbiAnZGlkLXNvcnQtdG9kb3MnLCBjYlxuICBvbkRpZEZpbHRlclRvZG9zOiAoY2IpIC0+IEBlbWl0dGVyLm9uICdkaWQtZmlsdGVyLXRvZG9zJywgY2JcbiAgb25EaWRDaGFuZ2VTZWFyY2hTY29wZTogKGNiKSAtPiBAZW1pdHRlci5vbiAnZGlkLWNoYW5nZS1zY29wZScsIGNiXG5cbiAgY2xlYXI6IC0+XG4gICAgQGNhbmNlbFNlYXJjaCgpXG4gICAgQHRvZG9zID0gW11cbiAgICBAZW1pdHRlci5lbWl0ICdkaWQtY2xlYXItdG9kb3MnXG5cbiAgYWRkVG9kbzogKHRvZG8pIC0+XG4gICAgcmV0dXJuIGlmIEBhbHJlYWR5RXhpc3RzKHRvZG8pXG4gICAgQHRvZG9zLnB1c2godG9kbylcbiAgICBAZW1pdHRlci5lbWl0ICdkaWQtYWRkLXRvZG8nLCB0b2RvXG5cbiAgZ2V0VG9kb3M6IC0+IEB0b2Rvc1xuICBnZXRUb2Rvc0NvdW50OiAtPiBAdG9kb3MubGVuZ3RoXG4gIGdldFN0YXRlOiAtPiBAc2VhcmNoaW5nXG5cbiAgc29ydFRvZG9zOiAoe3NvcnRCeSwgc29ydEFzY30gPSB7fSkgLT5cbiAgICBzb3J0QnkgPz0gQGRlZmF1bHRLZXlcblxuICAgICMgU2F2ZSBoaXN0b3J5IG9mIG5ldyBzb3J0IGVsZW1lbnRzXG4gICAgaWYgQHNlYXJjaGVzP1tAc2VhcmNoZXMubGVuZ3RoIC0gMV0uc29ydEJ5IGlzbnQgc29ydEJ5XG4gICAgICBAc2VhcmNoZXMgPz0gW11cbiAgICAgIEBzZWFyY2hlcy5wdXNoIHtzb3J0QnksIHNvcnRBc2N9XG4gICAgZWxzZVxuICAgICAgQHNlYXJjaGVzW0BzZWFyY2hlcy5sZW5ndGggLSAxXSA9IHtzb3J0QnksIHNvcnRBc2N9XG5cbiAgICBAdG9kb3MgPSBAdG9kb3Muc29ydCgodG9kb0EsIHRvZG9CKSA9PlxuICAgICAgQHRvZG9Tb3J0ZXIodG9kb0EsIHRvZG9CLCBzb3J0QnksIHNvcnRBc2MpXG4gICAgKVxuXG4gICAgcmV0dXJuIEBmaWx0ZXJUb2RvcyhAZmlsdGVyKSBpZiBAZmlsdGVyXG4gICAgQGVtaXR0ZXIuZW1pdCAnZGlkLXNvcnQtdG9kb3MnLCBAdG9kb3NcblxuICB0b2RvU29ydGVyOiAodG9kb0EsIHRvZG9CLCBzb3J0QnksIHNvcnRBc2MpIC0+XG4gICAgW3NvcnRCeTIsIHNvcnRBc2MyXSA9IFtzb3J0QnksIHNvcnRBc2NdXG5cbiAgICBhVmFsID0gdG9kb0EuZ2V0KHNvcnRCeTIpXG4gICAgYlZhbCA9IHRvZG9CLmdldChzb3J0QnkyKVxuXG4gICAgaWYgYVZhbCBpcyBiVmFsXG4gICAgICAjIFVzZSBwcmV2aW91cyBzb3J0cyB0byBtYWtlIGEgMi1sZXZlbCBzdGFibGUgc29ydFxuICAgICAgaWYgc2VhcmNoID0gQHNlYXJjaGVzP1tAc2VhcmNoZXMubGVuZ3RoIC0gMl1cbiAgICAgICAgW3NvcnRCeTIsIHNvcnRBc2MyXSA9IFtzZWFyY2guc29ydEJ5LCBzZWFyY2guc29ydEFzY11cbiAgICAgIGVsc2VcbiAgICAgICAgc29ydEJ5MiA9IEBkZWZhdWx0S2V5XG5cbiAgICAgIFthVmFsLCBiVmFsXSA9IFt0b2RvQS5nZXQoc29ydEJ5MiksIHRvZG9CLmdldChzb3J0QnkyKV1cblxuICAgICMgU29ydCB0eXBlIGluIHRoZSBkZWZpbmVkIG9yZGVyLCBhcyBudW1iZXIgb3Igbm9ybWFsIHN0cmluZyBzb3J0XG4gICAgaWYgc29ydEJ5MiBpcyAnVHlwZSdcbiAgICAgIGZpbmRUaGVzZVRvZG9zID0gYXRvbS5jb25maWcuZ2V0KCd0b2RvLXNob3cuZmluZFRoZXNlVG9kb3MnKVxuICAgICAgY29tcCA9IGZpbmRUaGVzZVRvZG9zLmluZGV4T2YoYVZhbCkgLSBmaW5kVGhlc2VUb2Rvcy5pbmRleE9mKGJWYWwpXG4gICAgZWxzZSBpZiB0b2RvQS5rZXlJc051bWJlcihzb3J0QnkyKVxuICAgICAgY29tcCA9IHBhcnNlSW50KGFWYWwpIC0gcGFyc2VJbnQoYlZhbClcbiAgICBlbHNlXG4gICAgICBjb21wID0gYVZhbC5sb2NhbGVDb21wYXJlKGJWYWwpXG4gICAgaWYgc29ydEFzYzIgdGhlbiBjb21wIGVsc2UgLWNvbXBcblxuICBmaWx0ZXJUb2RvczogKGZpbHRlcikgLT5cbiAgICBAZmlsdGVyID0gZmlsdGVyXG4gICAgQGVtaXR0ZXIuZW1pdCAnZGlkLWZpbHRlci10b2RvcycsIEBnZXRGaWx0ZXJlZFRvZG9zKClcblxuICBnZXRGaWx0ZXJlZFRvZG9zOiAtPlxuICAgIHJldHVybiBAdG9kb3MgdW5sZXNzIGZpbHRlciA9IEBmaWx0ZXJcbiAgICBAdG9kb3MuZmlsdGVyICh0b2RvKSAtPlxuICAgICAgdG9kby5jb250YWlucyhmaWx0ZXIpXG5cbiAgZ2V0QXZhaWxhYmxlVGFibGVJdGVtczogLT4gQGF2YWlsYWJsZUl0ZW1zXG4gIHNldEF2YWlsYWJsZVRhYmxlSXRlbXM6IChAYXZhaWxhYmxlSXRlbXMpIC0+XG5cbiAgZ2V0U2VhcmNoU2NvcGU6IC0+IEBzY29wZVxuICBzZXRTZWFyY2hTY29wZTogKHNjb3BlKSAtPlxuICAgIEBlbWl0dGVyLmVtaXQgJ2RpZC1jaGFuZ2Utc2NvcGUnLCBAc2NvcGUgPSBzY29wZVxuXG4gIHRvZ2dsZVNlYXJjaFNjb3BlOiAtPlxuICAgIHNjb3BlID0gc3dpdGNoIEBzY29wZVxuICAgICAgd2hlbiAnd29ya3NwYWNlJyB0aGVuICdwcm9qZWN0J1xuICAgICAgd2hlbiAncHJvamVjdCcgdGhlbiAnb3BlbidcbiAgICAgIHdoZW4gJ29wZW4nIHRoZW4gJ2FjdGl2ZSdcbiAgICAgIGVsc2UgJ3dvcmtzcGFjZSdcbiAgICBAc2V0U2VhcmNoU2NvcGUoc2NvcGUpXG4gICAgc2NvcGVcblxuICBnZXRDdXN0b21QYXRoOiAtPiBAY3VzdG9tUGF0aFxuICBzZXRDdXN0b21QYXRoOiAoQGN1c3RvbVBhdGgpIC0+XG5cbiAgYWxyZWFkeUV4aXN0czogKG5ld1RvZG8pIC0+XG4gICAgcHJvcGVydGllcyA9IFsncmFuZ2UnLCAncGF0aCddXG4gICAgQHRvZG9zLnNvbWUgKHRvZG8pIC0+XG4gICAgICBwcm9wZXJ0aWVzLmV2ZXJ5IChwcm9wKSAtPlxuICAgICAgICB0cnVlIGlmIHRvZG9bcHJvcF0gaXMgbmV3VG9kb1twcm9wXVxuXG4gICMgU2NhbiBwcm9qZWN0IHdvcmtzcGFjZSBmb3IgdGhlIFRvZG9SZWdleCBvYmplY3RcbiAgIyByZXR1cm5zIGEgcHJvbWlzZSB0aGF0IHRoZSBzY2FuIGdlbmVyYXRlc1xuICBmZXRjaFJlZ2V4SXRlbTogKHRvZG9SZWdleCwgYWN0aXZlUHJvamVjdE9ubHkpIC0+XG4gICAgb3B0aW9ucyA9XG4gICAgICBwYXRoczogQGdldFNlYXJjaFBhdGhzKClcbiAgICAgIG9uUGF0aHNTZWFyY2hlZDogKG5QYXRocykgPT5cbiAgICAgICAgQGVtaXR0ZXIuZW1pdCAnZGlkLXNlYXJjaC1wYXRocycsIG5QYXRocyBpZiBAc2VhcmNoaW5nXG5cbiAgICBhdG9tLndvcmtzcGFjZS5zY2FuIHRvZG9SZWdleC5yZWdleHAsIG9wdGlvbnMsIChyZXN1bHQsIGVycm9yKSA9PlxuICAgICAgY29uc29sZS5kZWJ1ZyBlcnJvci5tZXNzYWdlIGlmIGVycm9yXG4gICAgICByZXR1cm4gdW5sZXNzIHJlc3VsdFxuXG4gICAgICByZXR1cm4gaWYgYWN0aXZlUHJvamVjdE9ubHkgYW5kIG5vdCBAYWN0aXZlUHJvamVjdEhhcyhyZXN1bHQuZmlsZVBhdGgpXG5cbiAgICAgIGZvciBtYXRjaCBpbiByZXN1bHQubWF0Y2hlc1xuICAgICAgICBAYWRkVG9kbyBuZXcgVG9kb01vZGVsKFxuICAgICAgICAgIGFsbDogbWF0Y2gubGluZVRleHRcbiAgICAgICAgICB0ZXh0OiBtYXRjaC5tYXRjaFRleHRcbiAgICAgICAgICBsb2M6IHJlc3VsdC5maWxlUGF0aFxuICAgICAgICAgIHBvc2l0aW9uOiBtYXRjaC5yYW5nZVxuICAgICAgICAgIHJlZ2V4OiB0b2RvUmVnZXgucmVnZXhcbiAgICAgICAgICByZWdleHA6IHRvZG9SZWdleC5yZWdleHBcbiAgICAgICAgKVxuXG4gICMgU2NhbiBvcGVuIGZpbGVzIGZvciB0aGUgVG9kb1JlZ2V4IG9iamVjdFxuICBmZXRjaE9wZW5SZWdleEl0ZW06ICh0b2RvUmVnZXgsIGFjdGl2ZUVkaXRvck9ubHkpIC0+XG4gICAgZWRpdG9ycyA9IFtdXG4gICAgaWYgYWN0aXZlRWRpdG9yT25seVxuICAgICAgaWYgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0UGFuZXMoKVswXT8uZ2V0QWN0aXZlRWRpdG9yKClcbiAgICAgICAgZWRpdG9ycyA9IFtlZGl0b3JdXG4gICAgZWxzZVxuICAgICAgZWRpdG9ycyA9IGF0b20ud29ya3NwYWNlLmdldFRleHRFZGl0b3JzKClcblxuICAgIGZvciBlZGl0b3IgaW4gZWRpdG9yc1xuICAgICAgZWRpdG9yLnNjYW4gdG9kb1JlZ2V4LnJlZ2V4cCwgKG1hdGNoLCBlcnJvcikgPT5cbiAgICAgICAgY29uc29sZS5kZWJ1ZyBlcnJvci5tZXNzYWdlIGlmIGVycm9yXG4gICAgICAgIHJldHVybiB1bmxlc3MgbWF0Y2hcblxuICAgICAgICByYW5nZSA9IFtcbiAgICAgICAgICBbbWF0Y2gucmFuZ2Uuc3RhcnQucm93LCBtYXRjaC5yYW5nZS5zdGFydC5jb2x1bW5dXG4gICAgICAgICAgW21hdGNoLnJhbmdlLmVuZC5yb3csIG1hdGNoLnJhbmdlLmVuZC5jb2x1bW5dXG4gICAgICAgIF1cblxuICAgICAgICBAYWRkVG9kbyBuZXcgVG9kb01vZGVsKFxuICAgICAgICAgIGFsbDogbWF0Y2gubGluZVRleHRcbiAgICAgICAgICB0ZXh0OiBtYXRjaC5tYXRjaFRleHRcbiAgICAgICAgICBsb2M6IGVkaXRvci5nZXRQYXRoKClcbiAgICAgICAgICBwb3NpdGlvbjogcmFuZ2VcbiAgICAgICAgICByZWdleDogdG9kb1JlZ2V4LnJlZ2V4XG4gICAgICAgICAgcmVnZXhwOiB0b2RvUmVnZXgucmVnZXhwXG4gICAgICAgIClcblxuICAgICMgTm8gYXN5bmMgb3BlcmF0aW9ucywgc28ganVzdCByZXR1cm4gYSByZXNvbHZlZCBwcm9taXNlXG4gICAgUHJvbWlzZS5yZXNvbHZlKClcblxuICBzZWFyY2g6IC0+XG4gICAgQGNsZWFyKClcbiAgICBAc2VhcmNoaW5nID0gdHJ1ZVxuICAgIEBlbWl0dGVyLmVtaXQgJ2RpZC1zdGFydC1zZWFyY2gnXG5cbiAgICB0b2RvUmVnZXggPSBuZXcgVG9kb1JlZ2V4KFxuICAgICAgYXRvbS5jb25maWcuZ2V0KCd0b2RvLXNob3cuZmluZFVzaW5nUmVnZXgnKVxuICAgICAgYXRvbS5jb25maWcuZ2V0KCd0b2RvLXNob3cuZmluZFRoZXNlVG9kb3MnKVxuICAgIClcblxuICAgIGlmIHRvZG9SZWdleC5lcnJvclxuICAgICAgQGVtaXR0ZXIuZW1pdCAnZGlkLWZhaWwtc2VhcmNoJywgXCJJbnZhbGlkIHRvZG8gc2VhcmNoIHJlZ2V4XCJcbiAgICAgIHJldHVyblxuXG4gICAgQHNlYXJjaFByb21pc2UgPSBzd2l0Y2ggQHNjb3BlXG4gICAgICB3aGVuICdvcGVuJyB0aGVuIEBmZXRjaE9wZW5SZWdleEl0ZW0odG9kb1JlZ2V4LCBmYWxzZSlcbiAgICAgIHdoZW4gJ2FjdGl2ZScgdGhlbiBAZmV0Y2hPcGVuUmVnZXhJdGVtKHRvZG9SZWdleCwgdHJ1ZSlcbiAgICAgIHdoZW4gJ3Byb2plY3QnIHRoZW4gQGZldGNoUmVnZXhJdGVtKHRvZG9SZWdleCwgdHJ1ZSlcbiAgICAgIGVsc2UgQGZldGNoUmVnZXhJdGVtKHRvZG9SZWdleClcblxuICAgIEBzZWFyY2hQcm9taXNlLnRoZW4gKHJlc3VsdCkgPT5cbiAgICAgIEBzZWFyY2hpbmcgPSBmYWxzZVxuICAgICAgaWYgcmVzdWx0IGlzICdjYW5jZWxsZWQnXG4gICAgICAgIEBlbWl0dGVyLmVtaXQgJ2RpZC1jYW5jZWwtc2VhcmNoJ1xuICAgICAgZWxzZVxuICAgICAgICBAZW1pdHRlci5lbWl0ICdkaWQtZmluaXNoLXNlYXJjaCdcbiAgICAuY2F0Y2ggKHJlYXNvbikgPT5cbiAgICAgIEBzZWFyY2hpbmcgPSBmYWxzZVxuICAgICAgQGVtaXR0ZXIuZW1pdCAnZGlkLWZhaWwtc2VhcmNoJywgcmVhc29uXG5cbiAgZ2V0U2VhcmNoUGF0aHM6IC0+XG4gICAgcmV0dXJuIFtAZ2V0Q3VzdG9tUGF0aCgpXSBpZiBAc2NvcGUgaXMgJ2N1c3RvbSdcblxuICAgIGlnbm9yZXMgPSBhdG9tLmNvbmZpZy5nZXQoJ3RvZG8tc2hvdy5pZ25vcmVUaGVzZVBhdGhzJylcbiAgICByZXR1cm4gWycqJ10gdW5sZXNzIGlnbm9yZXM/XG4gICAgaWYgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGlnbm9yZXMpIGlzbnQgJ1tvYmplY3QgQXJyYXldJ1xuICAgICAgQGVtaXR0ZXIuZW1pdCAnZGlkLWZhaWwtc2VhcmNoJywgXCJpZ25vcmVUaGVzZVBhdGhzIG11c3QgYmUgYW4gYXJyYXlcIlxuICAgICAgcmV0dXJuIFsnKiddXG4gICAgXCIhI3tpZ25vcmV9XCIgZm9yIGlnbm9yZSBpbiBpZ25vcmVzXG5cbiAgYWN0aXZlUHJvamVjdEhhczogKGZpbGVQYXRoID0gJycpIC0+XG4gICAgcmV0dXJuIHVubGVzcyBwcm9qZWN0ID0gQGdldEFjdGl2ZVByb2plY3QoKVxuICAgIGZpbGVQYXRoLmluZGV4T2YocHJvamVjdCkgaXMgMFxuXG4gIGdldEFjdGl2ZVByb2plY3Q6IC0+XG4gICAgcmV0dXJuIEBhY3RpdmVQcm9qZWN0IGlmIEBhY3RpdmVQcm9qZWN0XG4gICAgQGFjdGl2ZVByb2plY3QgPSBwcm9qZWN0IGlmIHByb2plY3QgPSBAZ2V0RmFsbGJhY2tQcm9qZWN0KClcblxuICBnZXRGYWxsYmFja1Byb2plY3Q6IC0+XG4gICAgZm9yIGl0ZW0gaW4gYXRvbS53b3Jrc3BhY2UuZ2V0UGFuZUl0ZW1zKClcbiAgICAgIGlmIHByb2plY3QgPSBAcHJvamVjdEZvckZpbGUoaXRlbS5nZXRQYXRoPygpKVxuICAgICAgICByZXR1cm4gcHJvamVjdFxuICAgIHByb2plY3QgaWYgcHJvamVjdCA9IGF0b20ucHJvamVjdC5nZXRQYXRocygpWzBdXG5cbiAgZ2V0QWN0aXZlUHJvamVjdE5hbWU6IC0+XG4gICAgcmV0dXJuICdubyBhY3RpdmUgcHJvamVjdCcgdW5sZXNzIHByb2plY3QgPSBAZ2V0QWN0aXZlUHJvamVjdCgpXG4gICAgcHJvamVjdE5hbWUgPSBwYXRoLmJhc2VuYW1lKHByb2plY3QpXG4gICAgaWYgcHJvamVjdE5hbWUgaXMgJ3VuZGVmaW5lZCcgdGhlbiBcIm5vIGFjdGl2ZSBwcm9qZWN0XCIgZWxzZSBwcm9qZWN0TmFtZVxuXG4gIHNldEFjdGl2ZVByb2plY3Q6IChmaWxlUGF0aCkgLT5cbiAgICBsYXN0UHJvamVjdCA9IEBhY3RpdmVQcm9qZWN0XG4gICAgQGFjdGl2ZVByb2plY3QgPSBwcm9qZWN0IGlmIHByb2plY3QgPSBAcHJvamVjdEZvckZpbGUoZmlsZVBhdGgpXG4gICAgcmV0dXJuIGZhbHNlIHVubGVzcyBsYXN0UHJvamVjdFxuICAgIGxhc3RQcm9qZWN0IGlzbnQgQGFjdGl2ZVByb2plY3RcblxuICBwcm9qZWN0Rm9yRmlsZTogKGZpbGVQYXRoKSAtPlxuICAgIHJldHVybiBpZiB0eXBlb2YgZmlsZVBhdGggaXNudCAnc3RyaW5nJ1xuICAgIHByb2plY3QgaWYgcHJvamVjdCA9IGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aChmaWxlUGF0aClbMF1cblxuICBnZXRNYXJrZG93bjogLT5cbiAgICB0b2Rvc01hcmtkb3duID0gbmV3IFRvZG9zTWFya2Rvd25cbiAgICB0b2Rvc01hcmtkb3duLm1hcmtkb3duIEBnZXRGaWx0ZXJlZFRvZG9zKClcblxuICBjYW5jZWxTZWFyY2g6IC0+XG4gICAgQHNlYXJjaFByb21pc2U/LmNhbmNlbD8oKVxuXG4gICMgVE9ETzogUHJldmlvdXMgc2VhcmNoZXMgYXJlIG5vdCBzYXZlZCB5ZXQhXG4gIGdldFByZXZpb3VzU2VhcmNoOiAtPlxuICAgIHNvcnRCeSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtICd0b2RvLXNob3cucHJldmlvdXMtc29ydEJ5J1xuXG4gIHNldFByZXZpb3VzU2VhcmNoOiAoc2VhcmNoKSAtPlxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtICd0b2RvLXNob3cucHJldmlvdXMtc2VhcmNoJywgc2VhcmNoXG4iXX0=
