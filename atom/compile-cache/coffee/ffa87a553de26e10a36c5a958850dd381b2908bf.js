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
      var ref, sortAsc, sortBy;
      ref = arg != null ? arg : {}, sortBy = ref.sortBy, sortAsc = ref.sortAsc;
      if (sortBy == null) {
        sortBy = this.defaultKey;
      }
      this.todos = this.todos.sort(function(a, b) {
        var aVal, bVal, comp, ref1;
        aVal = a.get(sortBy);
        bVal = b.get(sortBy);
        if (aVal === bVal) {
          ref1 = [a.get(this.defaultKey), b.get(this.defaultKey)], aVal = ref1[0], bVal = ref1[1];
        }
        if (a.keyIsNumber(sortBy)) {
          comp = parseInt(aVal) - parseInt(bVal);
        } else {
          comp = aVal.localeCompare(bVal);
        }
        if (sortAsc) {
          return comp;
        } else {
          return -comp;
        }
      });
      if (this.filter) {
        return this.filterTodos(this.filter);
      }
      return this.emitter.emit('did-sort-todos', this.todos);
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

    return TodoCollection;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RvZG8tc2hvdy9saWIvdG9kby1jb2xsZWN0aW9uLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNOLFVBQVcsT0FBQSxDQUFRLE1BQVI7O0VBRVosU0FBQSxHQUFZLE9BQUEsQ0FBUSxjQUFSOztFQUNaLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLGlCQUFSOztFQUNoQixTQUFBLEdBQVksT0FBQSxDQUFRLGNBQVI7O0VBRVosTUFBTSxDQUFDLE9BQVAsR0FDTTtJQUNTLHdCQUFBO01BQ1gsSUFBQyxDQUFBLE9BQUQsR0FBVyxJQUFJO01BQ2YsSUFBQyxDQUFBLFVBQUQsR0FBYztNQUNkLElBQUMsQ0FBQSxLQUFELEdBQVM7TUFDVCxJQUFDLENBQUEsS0FBRCxHQUFTO0lBSkU7OzZCQU1iLFlBQUEsR0FBYyxTQUFDLEVBQUQ7YUFBUSxJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSxjQUFaLEVBQTRCLEVBQTVCO0lBQVI7OzZCQUNkLGVBQUEsR0FBaUIsU0FBQyxFQUFEO2FBQVEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxFQUFULENBQVksaUJBQVosRUFBK0IsRUFBL0I7SUFBUjs7NkJBQ2pCLFVBQUEsR0FBWSxTQUFDLEVBQUQ7YUFBUSxJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSxpQkFBWixFQUErQixFQUEvQjtJQUFSOzs2QkFDWixnQkFBQSxHQUFrQixTQUFDLEVBQUQ7YUFBUSxJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSxrQkFBWixFQUFnQyxFQUFoQztJQUFSOzs2QkFDbEIsZ0JBQUEsR0FBa0IsU0FBQyxFQUFEO2FBQVEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxFQUFULENBQVksa0JBQVosRUFBZ0MsRUFBaEM7SUFBUjs7NkJBQ2xCLGlCQUFBLEdB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Ozs7QUF6TmhCIiwic291cmNlc0NvbnRlbnQiOlsicGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG57RW1pdHRlcn0gPSByZXF1aXJlICdhdG9tJ1xuXG5Ub2RvTW9kZWwgPSByZXF1aXJlICcuL3RvZG8tbW9kZWwnXG5Ub2Rvc01hcmtkb3duID0gcmVxdWlyZSAnLi90b2RvLW1hcmtkb3duJ1xuVG9kb1JlZ2V4ID0gcmVxdWlyZSAnLi90b2RvLXJlZ2V4J1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBUb2RvQ29sbGVjdGlvblxuICBjb25zdHJ1Y3RvcjogLT5cbiAgICBAZW1pdHRlciA9IG5ldyBFbWl0dGVyXG4gICAgQGRlZmF1bHRLZXkgPSAnVGV4dCdcbiAgICBAc2NvcGUgPSAnd29ya3NwYWNlJ1xuICAgIEB0b2RvcyA9IFtdXG5cbiAgb25EaWRBZGRUb2RvOiAoY2IpIC0+IEBlbWl0dGVyLm9uICdkaWQtYWRkLXRvZG8nLCBjYlxuICBvbkRpZFJlbW92ZVRvZG86IChjYikgLT4gQGVtaXR0ZXIub24gJ2RpZC1yZW1vdmUtdG9kbycsIGNiXG4gIG9uRGlkQ2xlYXI6IChjYikgLT4gQGVtaXR0ZXIub24gJ2RpZC1jbGVhci10b2RvcycsIGNiXG4gIG9uRGlkU3RhcnRTZWFyY2g6IChjYikgLT4gQGVtaXR0ZXIub24gJ2RpZC1zdGFydC1zZWFyY2gnLCBjYlxuICBvbkRpZFNlYXJjaFBhdGhzOiAoY2IpIC0+IEBlbWl0dGVyLm9uICdkaWQtc2VhcmNoLXBhdGhzJywgY2JcbiAgb25EaWRGaW5pc2hTZWFyY2g6IChjYikgLT4gQGVtaXR0ZXIub24gJ2RpZC1maW5pc2gtc2VhcmNoJywgY2JcbiAgb25EaWRDYW5jZWxTZWFyY2g6IChjYikgLT4gQGVtaXR0ZXIub24gJ2RpZC1jYW5jZWwtc2VhcmNoJywgY2JcbiAgb25EaWRGYWlsU2VhcmNoOiAoY2IpIC0+IEBlbWl0dGVyLm9uICdkaWQtZmFpbC1zZWFyY2gnLCBjYlxuICBvbkRpZFNvcnRUb2RvczogKGNiKSAtPiBAZW1pdHRlci5vbiAnZGlkLXNvcnQtdG9kb3MnLCBjYlxuICBvbkRpZEZpbHRlclRvZG9zOiAoY2IpIC0+IEBlbWl0dGVyLm9uICdkaWQtZmlsdGVyLXRvZG9zJywgY2JcbiAgb25EaWRDaGFuZ2VTZWFyY2hTY29wZTogKGNiKSAtPiBAZW1pdHRlci5vbiAnZGlkLWNoYW5nZS1zY29wZScsIGNiXG5cbiAgY2xlYXI6IC0+XG4gICAgQGNhbmNlbFNlYXJjaCgpXG4gICAgQHRvZG9zID0gW11cbiAgICBAZW1pdHRlci5lbWl0ICdkaWQtY2xlYXItdG9kb3MnXG5cbiAgYWRkVG9kbzogKHRvZG8pIC0+XG4gICAgcmV0dXJuIGlmIEBhbHJlYWR5RXhpc3RzKHRvZG8pXG4gICAgQHRvZG9zLnB1c2godG9kbylcbiAgICBAZW1pdHRlci5lbWl0ICdkaWQtYWRkLXRvZG8nLCB0b2RvXG5cbiAgZ2V0VG9kb3M6IC0+IEB0b2Rvc1xuICBnZXRUb2Rvc0NvdW50OiAtPiBAdG9kb3MubGVuZ3RoXG4gIGdldFN0YXRlOiAtPiBAc2VhcmNoaW5nXG5cbiAgc29ydFRvZG9zOiAoe3NvcnRCeSwgc29ydEFzY30gPSB7fSkgLT5cbiAgICBzb3J0QnkgPz0gQGRlZmF1bHRLZXlcblxuICAgIEB0b2RvcyA9IEB0b2Rvcy5zb3J0KChhLGIpIC0+XG4gICAgICBhVmFsID0gYS5nZXQoc29ydEJ5KVxuICAgICAgYlZhbCA9IGIuZ2V0KHNvcnRCeSlcblxuICAgICAgIyBGYWxsIGJhY2sgdG8gdGV4dCBpZiB2YWx1ZXMgYXJlIHRoZSBzYW1lXG4gICAgICBbYVZhbCwgYlZhbF0gPSBbYS5nZXQoQGRlZmF1bHRLZXkpLCBiLmdldChAZGVmYXVsdEtleSldIGlmIGFWYWwgaXMgYlZhbFxuXG4gICAgICBpZiBhLmtleUlzTnVtYmVyKHNvcnRCeSlcbiAgICAgICAgY29tcCA9IHBhcnNlSW50KGFWYWwpIC0gcGFyc2VJbnQoYlZhbClcbiAgICAgIGVsc2VcbiAgICAgICAgY29tcCA9IGFWYWwubG9jYWxlQ29tcGFyZShiVmFsKVxuICAgICAgaWYgc29ydEFzYyB0aGVuIGNvbXAgZWxzZSAtY29tcFxuICAgIClcblxuICAgIHJldHVybiBAZmlsdGVyVG9kb3MoQGZpbHRlcikgaWYgQGZpbHRlclxuICAgIEBlbWl0dGVyLmVtaXQgJ2RpZC1zb3J0LXRvZG9zJywgQHRvZG9zXG5cbiAgZmlsdGVyVG9kb3M6IChmaWx0ZXIpIC0+XG4gICAgaWYgQGZpbHRlciA9IGZpbHRlclxuICAgICAgcmVzdWx0ID0gQHRvZG9zLmZpbHRlciAodG9kbykgLT5cbiAgICAgICAgdG9kby5jb250YWlucyhmaWx0ZXIpXG4gICAgZWxzZVxuICAgICAgcmVzdWx0ID0gQHRvZG9zXG5cbiAgICBAZW1pdHRlci5lbWl0ICdkaWQtZmlsdGVyLXRvZG9zJywgcmVzdWx0XG5cbiAgZ2V0QXZhaWxhYmxlVGFibGVJdGVtczogLT4gQGF2YWlsYWJsZUl0ZW1zXG4gIHNldEF2YWlsYWJsZVRhYmxlSXRlbXM6IChAYXZhaWxhYmxlSXRlbXMpIC0+XG5cbiAgZ2V0U2VhcmNoU2NvcGU6IC0+IEBzY29wZVxuICBzZXRTZWFyY2hTY29wZTogKHNjb3BlKSAtPlxuICAgIEBlbWl0dGVyLmVtaXQgJ2RpZC1jaGFuZ2Utc2NvcGUnLCBAc2NvcGUgPSBzY29wZVxuXG4gIHRvZ2dsZVNlYXJjaFNjb3BlOiAtPlxuICAgIHNjb3BlID0gc3dpdGNoIEBzY29wZVxuICAgICAgd2hlbiAnd29ya3NwYWNlJyB0aGVuICdwcm9qZWN0J1xuICAgICAgd2hlbiAncHJvamVjdCcgdGhlbiAnb3BlbidcbiAgICAgIHdoZW4gJ29wZW4nIHRoZW4gJ2FjdGl2ZSdcbiAgICAgIGVsc2UgJ3dvcmtzcGFjZSdcbiAgICBAc2V0U2VhcmNoU2NvcGUoc2NvcGUpXG4gICAgc2NvcGVcblxuICBhbHJlYWR5RXhpc3RzOiAobmV3VG9kbykgLT5cbiAgICBwcm9wZXJ0aWVzID0gWydyYW5nZScsICdwYXRoJ11cbiAgICBAdG9kb3Muc29tZSAodG9kbykgLT5cbiAgICAgIHByb3BlcnRpZXMuZXZlcnkgKHByb3ApIC0+XG4gICAgICAgIHRydWUgaWYgdG9kb1twcm9wXSBpcyBuZXdUb2RvW3Byb3BdXG5cbiAgIyBTY2FuIHByb2plY3Qgd29ya3NwYWNlIGZvciB0aGUgVG9kb1JlZ2V4IG9iamVjdFxuICAjIHJldHVybnMgYSBwcm9taXNlIHRoYXQgdGhlIHNjYW4gZ2VuZXJhdGVzXG4gIGZldGNoUmVnZXhJdGVtOiAodG9kb1JlZ2V4LCBhY3RpdmVQcm9qZWN0T25seSkgLT5cbiAgICBvcHRpb25zID1cbiAgICAgIHBhdGhzOiBAZ2V0U2VhcmNoUGF0aHMoKVxuICAgICAgb25QYXRoc1NlYXJjaGVkOiAoblBhdGhzKSA9PlxuICAgICAgICBAZW1pdHRlci5lbWl0ICdkaWQtc2VhcmNoLXBhdGhzJywgblBhdGhzIGlmIEBzZWFyY2hpbmdcblxuICAgIGF0b20ud29ya3NwYWNlLnNjYW4gdG9kb1JlZ2V4LnJlZ2V4cCwgb3B0aW9ucywgKHJlc3VsdCwgZXJyb3IpID0+XG4gICAgICBjb25zb2xlLmRlYnVnIGVycm9yLm1lc3NhZ2UgaWYgZXJyb3JcbiAgICAgIHJldHVybiB1bmxlc3MgcmVzdWx0XG5cbiAgICAgIHJldHVybiBpZiBhY3RpdmVQcm9qZWN0T25seSBhbmQgbm90IEBhY3RpdmVQcm9qZWN0SGFzKHJlc3VsdC5maWxlUGF0aClcblxuICAgICAgZm9yIG1hdGNoIGluIHJlc3VsdC5tYXRjaGVzXG4gICAgICAgIEBhZGRUb2RvIG5ldyBUb2RvTW9kZWwoXG4gICAgICAgICAgYWxsOiBtYXRjaC5saW5lVGV4dFxuICAgICAgICAgIHRleHQ6IG1hdGNoLm1hdGNoVGV4dFxuICAgICAgICAgIGxvYzogcmVzdWx0LmZpbGVQYXRoXG4gICAgICAgICAgcG9zaXRpb246IG1hdGNoLnJhbmdlXG4gICAgICAgICAgcmVnZXg6IHRvZG9SZWdleC5yZWdleFxuICAgICAgICAgIHJlZ2V4cDogdG9kb1JlZ2V4LnJlZ2V4cFxuICAgICAgICApXG5cbiAgIyBTY2FuIG9wZW4gZmlsZXMgZm9yIHRoZSBUb2RvUmVnZXggb2JqZWN0XG4gIGZldGNoT3BlblJlZ2V4SXRlbTogKHRvZG9SZWdleCwgYWN0aXZlRWRpdG9yT25seSkgLT5cbiAgICBlZGl0b3JzID0gW11cbiAgICBpZiBhY3RpdmVFZGl0b3JPbmx5XG4gICAgICBpZiBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRQYW5lcygpWzBdPy5nZXRBY3RpdmVFZGl0b3IoKVxuICAgICAgICBlZGl0b3JzID0gW2VkaXRvcl1cbiAgICBlbHNlXG4gICAgICBlZGl0b3JzID0gYXRvbS53b3Jrc3BhY2UuZ2V0VGV4dEVkaXRvcnMoKVxuXG4gICAgZm9yIGVkaXRvciBpbiBlZGl0b3JzXG4gICAgICBlZGl0b3Iuc2NhbiB0b2RvUmVnZXgucmVnZXhwLCAobWF0Y2gsIGVycm9yKSA9PlxuICAgICAgICBjb25zb2xlLmRlYnVnIGVycm9yLm1lc3NhZ2UgaWYgZXJyb3JcbiAgICAgICAgcmV0dXJuIHVubGVzcyBtYXRjaFxuXG4gICAgICAgIHJhbmdlID0gW1xuICAgICAgICAgIFttYXRjaC5jb21wdXRlZFJhbmdlLnN0YXJ0LnJvdywgbWF0Y2guY29tcHV0ZWRSYW5nZS5zdGFydC5jb2x1bW5dXG4gICAgICAgICAgW21hdGNoLmNvbXB1dGVkUmFuZ2UuZW5kLnJvdywgbWF0Y2guY29tcHV0ZWRSYW5nZS5lbmQuY29sdW1uXVxuICAgICAgICBdXG5cbiAgICAgICAgQGFkZFRvZG8gbmV3IFRvZG9Nb2RlbChcbiAgICAgICAgICBhbGw6IG1hdGNoLmxpbmVUZXh0XG4gICAgICAgICAgdGV4dDogbWF0Y2gubWF0Y2hUZXh0XG4gICAgICAgICAgbG9jOiBlZGl0b3IuZ2V0UGF0aCgpXG4gICAgICAgICAgcG9zaXRpb246IHJhbmdlXG4gICAgICAgICAgcmVnZXg6IHRvZG9SZWdleC5yZWdleFxuICAgICAgICAgIHJlZ2V4cDogdG9kb1JlZ2V4LnJlZ2V4cFxuICAgICAgICApXG5cbiAgICAjIE5vIGFzeW5jIG9wZXJhdGlvbnMsIHNvIGp1c3QgcmV0dXJuIGEgcmVzb2x2ZWQgcHJvbWlzZVxuICAgIFByb21pc2UucmVzb2x2ZSgpXG5cbiAgc2VhcmNoOiAtPlxuICAgIEBjbGVhcigpXG4gICAgQHNlYXJjaGluZyA9IHRydWVcbiAgICBAZW1pdHRlci5lbWl0ICdkaWQtc3RhcnQtc2VhcmNoJ1xuXG4gICAgdG9kb1JlZ2V4ID0gbmV3IFRvZG9SZWdleChcbiAgICAgIGF0b20uY29uZmlnLmdldCgndG9kby1zaG93LmZpbmRVc2luZ1JlZ2V4JylcbiAgICAgIGF0b20uY29uZmlnLmdldCgndG9kby1zaG93LmZpbmRUaGVzZVRvZG9zJylcbiAgICApXG5cbiAgICBpZiB0b2RvUmVnZXguZXJyb3JcbiAgICAgIEBlbWl0dGVyLmVtaXQgJ2RpZC1mYWlsLXNlYXJjaCcsIFwiSW52YWxpZCB0b2RvIHNlYXJjaCByZWdleFwiXG4gICAgICByZXR1cm5cblxuICAgIEBzZWFyY2hQcm9taXNlID0gc3dpdGNoIEBzY29wZVxuICAgICAgd2hlbiAnb3BlbicgdGhlbiBAZmV0Y2hPcGVuUmVnZXhJdGVtKHRvZG9SZWdleCwgZmFsc2UpXG4gICAgICB3aGVuICdhY3RpdmUnIHRoZW4gQGZldGNoT3BlblJlZ2V4SXRlbSh0b2RvUmVnZXgsIHRydWUpXG4gICAgICB3aGVuICdwcm9qZWN0JyB0aGVuIEBmZXRjaFJlZ2V4SXRlbSh0b2RvUmVnZXgsIHRydWUpXG4gICAgICBlbHNlIEBmZXRjaFJlZ2V4SXRlbSh0b2RvUmVnZXgpXG5cbiAgICBAc2VhcmNoUHJvbWlzZS50aGVuIChyZXN1bHQpID0+XG4gICAgICBAc2VhcmNoaW5nID0gZmFsc2VcbiAgICAgIGlmIHJlc3VsdCBpcyAnY2FuY2VsbGVkJ1xuICAgICAgICBAZW1pdHRlci5lbWl0ICdkaWQtY2FuY2VsLXNlYXJjaCdcbiAgICAgIGVsc2VcbiAgICAgICAgQGVtaXR0ZXIuZW1pdCAnZGlkLWZpbmlzaC1zZWFyY2gnXG4gICAgLmNhdGNoIChyZWFzb24pID0+XG4gICAgICBAc2VhcmNoaW5nID0gZmFsc2VcbiAgICAgIEBlbWl0dGVyLmVtaXQgJ2RpZC1mYWlsLXNlYXJjaCcsIHJlYXNvblxuXG4gIGdldFNlYXJjaFBhdGhzOiAtPlxuICAgIGlnbm9yZXMgPSBhdG9tLmNvbmZpZy5nZXQoJ3RvZG8tc2hvdy5pZ25vcmVUaGVzZVBhdGhzJylcbiAgICByZXR1cm4gWycqJ10gdW5sZXNzIGlnbm9yZXM/XG4gICAgaWYgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGlnbm9yZXMpIGlzbnQgJ1tvYmplY3QgQXJyYXldJ1xuICAgICAgQGVtaXR0ZXIuZW1pdCAnZGlkLWZhaWwtc2VhcmNoJywgXCJpZ25vcmVUaGVzZVBhdGhzIG11c3QgYmUgYW4gYXJyYXlcIlxuICAgICAgcmV0dXJuIFsnKiddXG4gICAgXCIhI3tpZ25vcmV9XCIgZm9yIGlnbm9yZSBpbiBpZ25vcmVzXG5cbiAgYWN0aXZlUHJvamVjdEhhczogKGZpbGVQYXRoID0gJycpIC0+XG4gICAgcmV0dXJuIHVubGVzcyBwcm9qZWN0ID0gQGdldEFjdGl2ZVByb2plY3QoKVxuICAgIGZpbGVQYXRoLmluZGV4T2YocHJvamVjdCkgaXMgMFxuXG4gIGdldEFjdGl2ZVByb2plY3Q6IC0+XG4gICAgcmV0dXJuIEBhY3RpdmVQcm9qZWN0IGlmIEBhY3RpdmVQcm9qZWN0XG4gICAgQGFjdGl2ZVByb2plY3QgPSBwcm9qZWN0IGlmIHByb2plY3QgPSBAZ2V0RmFsbGJhY2tQcm9qZWN0KClcblxuICBnZXRGYWxsYmFja1Byb2plY3Q6IC0+XG4gICAgZm9yIGl0ZW0gaW4gYXRvbS53b3Jrc3BhY2UuZ2V0UGFuZUl0ZW1zKClcbiAgICAgIGlmIHByb2plY3QgPSBAcHJvamVjdEZvckZpbGUoaXRlbS5nZXRQYXRoPygpKVxuICAgICAgICByZXR1cm4gcHJvamVjdFxuICAgIHByb2plY3QgaWYgcHJvamVjdCA9IGF0b20ucHJvamVjdC5nZXRQYXRocygpWzBdXG5cbiAgZ2V0QWN0aXZlUHJvamVjdE5hbWU6IC0+XG4gICAgcHJvamVjdE5hbWUgPSBwYXRoLmJhc2VuYW1lKEBnZXRBY3RpdmVQcm9qZWN0KCkpXG4gICAgaWYgcHJvamVjdE5hbWUgaXMgJ3VuZGVmaW5lZCcgdGhlbiBcIm5vIGFjdGl2ZSBwcm9qZWN0XCIgZWxzZSBwcm9qZWN0TmFtZVxuXG4gIHNldEFjdGl2ZVByb2plY3Q6IChmaWxlUGF0aCkgLT5cbiAgICBsYXN0UHJvamVjdCA9IEBhY3RpdmVQcm9qZWN0XG4gICAgQGFjdGl2ZVByb2plY3QgPSBwcm9qZWN0IGlmIHByb2plY3QgPSBAcHJvamVjdEZvckZpbGUoZmlsZVBhdGgpXG4gICAgcmV0dXJuIGZhbHNlIHVubGVzcyBsYXN0UHJvamVjdFxuICAgIGxhc3RQcm9qZWN0IGlzbnQgQGFjdGl2ZVByb2plY3RcblxuICBwcm9qZWN0Rm9yRmlsZTogKGZpbGVQYXRoKSAtPlxuICAgIHJldHVybiBpZiB0eXBlb2YgZmlsZVBhdGggaXNudCAnc3RyaW5nJ1xuICAgIHByb2plY3QgaWYgcHJvamVjdCA9IGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aChmaWxlUGF0aClbMF1cblxuICBnZXRNYXJrZG93bjogLT5cbiAgICB0b2Rvc01hcmtkb3duID0gbmV3IFRvZG9zTWFya2Rvd25cbiAgICB0b2Rvc01hcmtkb3duLm1hcmtkb3duIEBnZXRUb2RvcygpXG5cbiAgY2FuY2VsU2VhcmNoOiAtPlxuICAgIEBzZWFyY2hQcm9taXNlPy5jYW5jZWw/KClcbiJdfQ==
