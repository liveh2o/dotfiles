(function() {
  var Emitter, TodoCollection, TodoModel, TodosMarkdown;

  Emitter = require('atom').Emitter;

  TodoModel = require('./todo-model');

  TodosMarkdown = require('./todo-markdown');

  module.exports = TodoCollection = (function() {
    function TodoCollection() {
      this.emitter = new Emitter;
      this.defaultKey = 'Text';
      this.scope = 'full';
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

    TodoCollection.prototype.getTodosCount = function() {
      return this.todos.length;
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

    TodoCollection.prototype.isSearching = function() {
      return this.searching;
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
          case 'full':
            return 'open';
          case 'open':
            return 'active';
          default:
            return 'full';
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

    TodoCollection.prototype.makeRegexObj = function(regexStr) {
      var flags, pattern, _ref, _ref1;
      if (regexStr == null) {
        regexStr = '';
      }
      pattern = (_ref = regexStr.match(/\/(.+)\//)) != null ? _ref[1] : void 0;
      flags = (_ref1 = regexStr.match(/\/(\w+$)/)) != null ? _ref1[1] : void 0;
      if (!pattern) {
        this.emitter.emit('did-fail-search', "Invalid regex: " + (regexStr || 'empty'));
        return false;
      }
      return new RegExp(pattern, flags);
    };

    TodoCollection.prototype.createRegex = function(regexStr, todoList) {
      if (!(Object.prototype.toString.call(todoList) === '[object Array]' && todoList.length > 0 && regexStr)) {
        this.emitter.emit('did-fail-search', "Invalid todo search regex");
        return false;
      }
      return this.makeRegexObj(regexStr.replace('${TODOS}', todoList.join('|')));
    };

    TodoCollection.prototype.fetchRegexItem = function(regexp, regex) {
      var options;
      if (regex == null) {
        regex = '';
      }
      options = {
        paths: this.getIgnorePaths(),
        onPathsSearched: (function(_this) {
          return function(nPaths) {
            if (_this.isSearching()) {
              return _this.emitter.emit('did-search-paths', nPaths);
            }
          };
        })(this)
      };
      return atom.workspace.scan(regexp, options, (function(_this) {
        return function(result, error) {
          var match, _i, _len, _ref, _results;
          if (error) {
            console.debug(error.message);
          }
          if (!result) {
            return;
          }
          _ref = result.matches;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            match = _ref[_i];
            _results.push(_this.addTodo(new TodoModel({
              all: match.lineText,
              text: match.matchText,
              path: result.filePath,
              position: match.range,
              regex: regex,
              regexp: regexp
            })));
          }
          return _results;
        };
      })(this));
    };

    TodoCollection.prototype.fetchOpenRegexItem = function(regexp, regex, activeEditorOnly) {
      var editor, editors, _i, _len, _ref;
      if (regex == null) {
        regex = '';
      }
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
        editor.scan(regexp, (function(_this) {
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
              path: editor.getPath(),
              position: range,
              regex: regex,
              regexp: regexp
            }));
          };
        })(this));
      }
      return Promise.resolve();
    };

    TodoCollection.prototype.search = function() {
      var regex, regexp;
      this.clear();
      this.searching = true;
      this.emitter.emit('did-start-search');
      if (!(regexp = this.createRegex(regex = atom.config.get('todo-show.findUsingRegex'), atom.config.get('todo-show.findTheseTodos')))) {
        return;
      }
      this.searchPromise = (function() {
        switch (this.scope) {
          case 'open':
            return this.fetchOpenRegexItem(regexp, regex, false);
          case 'active':
            return this.fetchOpenRegexItem(regexp, regex, true);
          default:
            return this.fetchRegexItem(regexp, regex);
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

    TodoCollection.prototype.getIgnorePaths = function() {
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RvZG8tc2hvdy9saWIvdG9kby1jb2xsZWN0aW9uLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxpREFBQTs7QUFBQSxFQUFDLFVBQVcsT0FBQSxDQUFRLE1BQVIsRUFBWCxPQUFELENBQUE7O0FBQUEsRUFFQSxTQUFBLEdBQVksT0FBQSxDQUFRLGNBQVIsQ0FGWixDQUFBOztBQUFBLEVBR0EsYUFBQSxHQUFnQixPQUFBLENBQVEsaUJBQVIsQ0FIaEIsQ0FBQTs7QUFBQSxFQUtBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDUyxJQUFBLHdCQUFBLEdBQUE7QUFDWCxNQUFBLElBQUMsQ0FBQSxPQUFELEdBQVcsR0FBQSxDQUFBLE9BQVgsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFVBQUQsR0FBYyxNQURkLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxLQUFELEdBQVMsTUFGVCxDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsS0FBRCxHQUFTLEVBSFQsQ0FEVztJQUFBLENBQWI7O0FBQUEsNkJBTUEsWUFBQSxHQUFjLFNBQUMsRUFBRCxHQUFBO2FBQVEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxFQUFULENBQVksY0FBWixFQUE0QixFQUE1QixFQUFSO0lBQUEsQ0FOZCxDQUFBOztBQUFBLDZCQU9BLGVBQUEsR0FBaUIsU0FBQyxFQUFELEdBQUE7YUFBUSxJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSxpQkFBWixFQUErQixFQUEvQixFQUFSO0lBQUEsQ0FQakIsQ0FBQTs7QUFBQSw2QkFRQSxVQUFBLEdBQVksU0FBQyxFQUFELEdBQUE7YUFBUSxJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSxpQkFBWixFQUErQixFQUEvQixFQUFSO0lBQUEsQ0FSWixDQUFBOztBQUFB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

//# sourceURL=/Users/ah/.atom/packages/todo-show/lib/todo-collection.coffee
