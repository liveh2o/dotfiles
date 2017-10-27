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
      this.todos.push(todo);
      return this.emitter.emit('did-add-todo', todo);
    };

    TodoCollection.prototype.getTodos = function() {
      return this.todos;
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
        comp = aVal.localeCompare(bVal);
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

    TodoCollection.prototype.buildRegexLookups = function(regexes) {
      var i, regex, _i, _len, _results;
      if (regexes.length % 2) {
        this.emitter.emit('did-fail-search', "Invalid number of regexes: " + regexes.length);
        return [];
      }
      _results = [];
      for (i = _i = 0, _len = regexes.length; _i < _len; i = _i += 2) {
        regex = regexes[i];
        _results.push({
          'title': regex,
          'regex': regexes[i + 1]
        });
      }
      return _results;
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

    TodoCollection.prototype.fetchRegexItem = function(regexLookup) {
      var options, regex;
      regex = this.makeRegexObj(regexLookup.regex);
      if (!regex) {
        return false;
      }
      options = {
        paths: this.getIgnorePaths()
      };
      if (!this.firstRegex) {
        this.firstRegex = true;
        options.onPathsSearched = (function(_this) {
          return function(nPaths) {
            if (_this.isSearching()) {
              return _this.emitter.emit('did-search-paths', nPaths);
            }
          };
        })(this);
      }
      return atom.workspace.scan(regex, options, (function(_this) {
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
              type: regexLookup.title,
              regex: regexLookup.regex,
              regexp: regex
            })));
          }
          return _results;
        };
      })(this));
    };

    TodoCollection.prototype.fetchOpenRegexItem = function(regexLookup, activeEditorOnly) {
      var editor, editors, regex, _i, _len, _ref;
      regex = this.makeRegexObj(regexLookup.regex);
      if (!regex) {
        return false;
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
        editor.scan(regex, (function(_this) {
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
              type: regexLookup.title,
              regex: regexLookup.regex,
              regexp: regex
            }));
          };
        })(this));
      }
      return Promise.resolve();
    };

    TodoCollection.prototype.search = function() {
      var findTheseRegexes, promise, regexObj, regexes, _i, _len;
      this.clear();
      this.searching = true;
      this.emitter.emit('did-start-search');
      if (!(findTheseRegexes = atom.config.get('todo-show.findTheseRegexes'))) {
        return;
      }
      regexes = this.buildRegexLookups(findTheseRegexes);
      for (_i = 0, _len = regexes.length; _i < _len; _i++) {
        regexObj = regexes[_i];
        promise = (function() {
          switch (this.scope) {
            case 'open':
              return this.fetchOpenRegexItem(regexObj, false);
            case 'active':
              return this.fetchOpenRegexItem(regexObj, true);
            default:
              return this.fetchRegexItem(regexObj);
          }
        }).call(this);
        this.searchPromises.push(promise);
      }
      return Promise.all(this.searchPromises).then((function(_this) {
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
      var promise, _i, _len, _ref, _results;
      if (this.searchPromises == null) {
        this.searchPromises = [];
      }
      _ref = this.searchPromises;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        promise = _ref[_i];
        if (promise) {
          _results.push(typeof promise.cancel === "function" ? promise.cancel() : void 0);
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    return TodoCollection;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RvZG8tc2hvdy9saWIvdG9kby1jb2xsZWN0aW9uLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxpREFBQTs7QUFBQSxFQUFDLFVBQVcsT0FBQSxDQUFRLE1BQVIsRUFBWCxPQUFELENBQUE7O0FBQUEsRUFFQSxTQUFBLEdBQVksT0FBQSxDQUFRLGNBQVIsQ0FGWixDQUFBOztBQUFBLEVBR0EsYUFBQSxHQUFnQixPQUFBLENBQVEsaUJBQVIsQ0FIaEIsQ0FBQTs7QUFBQSxFQUtBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDUyxJQUFBLHdCQUFBLEdBQUE7QUFDWCxNQUFBLElBQUMsQ0FBQSxPQUFELEdBQVcsR0FBQSxDQUFBLE9BQVgsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFVBQUQsR0FBYyxNQURkLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxLQUFELEdBQVMsTUFGVCxDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsS0FBRCxHQUFTLEVBSFQsQ0FEVztJQUFBLENBQWI7O0FBQUEsNkJBTUEsWUFBQSxHQUFjLFNBQUMsRUFBRCxHQUFBO2FBQVEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxFQUFULENBQVksY0FBWixFQUE0QixFQUE1QixFQUFSO0lBQUEsQ0FOZCxDQUFBOztBQUFBLDZCQU9BLGVBQUEsR0FBaUIsU0FBQyxFQUFELEdBQUE7YUFBUSxJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSxpQkFBWixFQUErQixFQUEvQixFQUFSO0lBQUEsQ0FQakIsQ0FBQTs7QUFBQSw2QkFRQSxVQUFBLEdBQVksU0FBQyxFQUFELEdBQUE7YUFBUSxJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSxpQkFBWixFQUErQixFQUEvQixFQUFSO0lBQUEsQ0FSWixDQUFBOztBQUFB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

//# sourceURL=/Users/ah/.atom/packages/todo-show/lib/todo-collection.coffee
