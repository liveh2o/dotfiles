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
        return function() {
          _this.searching = false;
          return _this.emitter.emit('did-finish-search');
        };
      })(this))["catch"]((function(_this) {
        return function(err) {
          _this.searching = false;
          return _this.emitter.emit('did-fail-search', err);
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
