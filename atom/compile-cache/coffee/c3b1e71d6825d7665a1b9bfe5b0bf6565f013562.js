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

    TodoCollection.prototype.sortTodos = function(_arg) {
      var sortAsc, sortBy, _ref;
      _ref = _arg != null ? _arg : {}, sortBy = _ref.sortBy, sortAsc = _ref.sortAsc;
      if (sortBy == null) {
        sortBy = this.defaultKey;
      }
      this.todos = this.todos.sort(function(a, b) {
        var aVal, bVal, comp, _ref1;
        aVal = a.get(sortBy);
        bVal = b.get(sortBy);
        if (aVal === bVal) {
          _ref1 = [a.get(this.defaultKey), b.get(this.defaultKey)], aVal = _ref1[0], bVal = _ref1[1];
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
      this.filter = filter;
      if (filter) {
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
          var match, _i, _len, _ref, _results;
          if (error) {
            console.debug(error.message);
          }
          if (!result) {
            return;
          }
          if (activeProjectOnly && !_this.activeProjectHas(result.filePath)) {
            return;
          }
          _ref = result.matches;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            match = _ref[_i];
            _results.push(_this.addTodo(new TodoModel({
              all: match.lineText,
              text: match.matchText,
              loc: result.filePath,
              position: match.range,
              regex: todoRegex.regex,
              regexp: todoRegex.regexp
            })));
          }
          return _results;
        };
      })(this));
    };

    TodoCollection.prototype.fetchOpenRegexItem = function(todoRegex, activeEditorOnly) {
      var editor, editors, _i, _len, _ref;
      editors = [];
      if (activeEditorOnly) {
        if (editor = (_ref = atom.workspace.getPanes()[0]) != null ? _ref.getActiveEditor() : void 0) {
          editors = [editor];
        }
      } else {
        editors = atom.workspace.getTextEditors();
      }
      for (_i = 0, _len = editors.length; _i < _len; _i++) {
        editor = editors[_i];
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
      var ignore, ignores, _i, _len, _results;
      ignores = atom.config.get('todo-show.ignoreThesePaths');
      if (ignores == null) {
        return ['*'];
      }
      if (Object.prototype.toString.call(ignores) !== '[object Array]') {
        this.emitter.emit('did-fail-search', "ignoreThesePaths must be an array");
        return ['*'];
      }
      _results = [];
      for (_i = 0, _len = ignores.length; _i < _len; _i++) {
        ignore = ignores[_i];
        _results.push("!" + ignore);
      }
      return _results;
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
      var item, project, _i, _len, _ref;
      _ref = atom.workspace.getPaneItems();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
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
      var _ref;
      return (_ref = this.searchPromise) != null ? typeof _ref.cancel === "function" ? _ref.cancel() : void 0 : void 0;
    };

    return TodoCollection;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RvZG8tc2hvdy9saWIvdG9kby1jb2xsZWN0aW9uLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxrRUFBQTs7QUFBQSxFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUFQLENBQUE7O0FBQUEsRUFDQyxVQUFXLE9BQUEsQ0FBUSxNQUFSLEVBQVgsT0FERCxDQUFBOztBQUFBLEVBR0EsU0FBQSxHQUFZLE9BQUEsQ0FBUSxjQUFSLENBSFosQ0FBQTs7QUFBQSxFQUlBLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLGlCQUFSLENBSmhCLENBQUE7O0FBQUEsRUFLQSxTQUFBLEdBQVksT0FBQSxDQUFRLGNBQVIsQ0FMWixDQUFBOztBQUFBLEVBT0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNTLElBQUEsd0JBQUEsR0FBQTtBQUNYLE1BQUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxHQUFBLENBQUEsT0FBWCxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsVUFBRCxHQUFjLE1BRGQsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLEtBQUQsR0FBUyxXQUZULENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxLQUFELEdBQVMsRUFIVCxDQURXO0lBQUEsQ0FBYjs7QUFBQSw2QkFNQSxZQUFBLEdBQWMsU0FBQyxFQUFELEdBQUE7YUFBUSxJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSxjQUFaLEVBQTRCLEVBQTVCLEVBQVI7SUFBQSxDQU5kLENBQUE7O0FBQUEsNkJBT0EsZUFBQSxHQUFpQixTQUFDLEVBQUQsR0FBQTthQUFRLElBQUMsQ0FBQSxPQUFPLENBQUMsRUFBVCxDQUFZLGlCQUFaLEVBQStCLEVBQS9CLEVBQVI7SUFBQSxDQVBqQixDQUFBOztBQUFBLDZCQVFBLFVBQUEsR0FBWSxT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

//# sourceURL=/Users/ah/.atom/packages/todo-show/lib/todo-collection.coffee
