(function() {
  var Emitter, TodosMarkdown, TodosModel;

  Emitter = require('atom').Emitter;

  TodosMarkdown = require('./todos-markdown');

  module.exports = TodosModel = (function() {
    function TodosModel() {
      this.emitter = new Emitter;
      this.maxLength = 120;
      this.scope = 'full';
      this.todos = [];
    }

    TodosModel.prototype.onDidAddTodo = function(cb) {
      return this.emitter.on('did-add-todo', cb);
    };

    TodosModel.prototype.onDidRemoveTodo = function(cb) {
      return this.emitter.on('did-remove-todo', cb);
    };

    TodosModel.prototype.onDidClear = function(cb) {
      return this.emitter.on('did-clear-todos', cb);
    };

    TodosModel.prototype.onDidStartSearch = function(cb) {
      return this.emitter.on('did-start-search', cb);
    };

    TodosModel.prototype.onDidSearchPaths = function(cb) {
      return this.emitter.on('did-search-paths', cb);
    };

    TodosModel.prototype.onDidFinishSearch = function(cb) {
      return this.emitter.on('did-finish-search', cb);
    };

    TodosModel.prototype.onDidFailSearch = function(cb) {
      return this.emitter.on('did-fail-search', cb);
    };

    TodosModel.prototype.onDidSortTodos = function(cb) {
      return this.emitter.on('did-sort-todos', cb);
    };

    TodosModel.prototype.onDidFilterTodos = function(cb) {
      return this.emitter.on('did-filter-todos', cb);
    };

    TodosModel.prototype.onDidChangeSearchScope = function(cb) {
      return this.emitter.on('did-change-scope', cb);
    };

    TodosModel.prototype.clear = function() {
      this.cancelSearch();
      this.todos = [];
      return this.emitter.emit('did-clear-todos');
    };

    TodosModel.prototype.addTodo = function(todo) {
      this.todos.push(todo);
      return this.emitter.emit('did-add-todo', todo);
    };

    TodosModel.prototype.getTodos = function() {
      return this.todos;
    };

    TodosModel.prototype.sortTodos = function(_arg) {
      var sortAsc, sortBy;
      sortBy = _arg.sortBy, sortAsc = _arg.sortAsc;
      if (!sortBy) {
        return;
      }
      this.todos = this.todos.sort(function(a, b) {
        var aItem, bItem;
        if (!(aItem = a[sortBy.toLowerCase()])) {
          return -1;
        }
        if (!(bItem = b[sortBy.toLowerCase()])) {
          return 1;
        }
        if (aItem === bItem) {
          aItem = a.text;
          bItem = b.text;
        }
        if (sortAsc) {
          return aItem.localeCompare(bItem);
        } else {
          return bItem.localeCompare(aItem);
        }
      });
      if (this.filter) {
        return this.filterTodos(this.filter);
      }
      return this.emitter.emit('did-sort-todos', this.todos);
    };

    TodosModel.prototype.filterTodos = function(filter) {
      var item, key, result, todo, _i, _j, _len, _len1, _ref, _ref1;
      this.filter = filter;
      if (filter) {
        result = [];
        _ref = this.todos;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          todo = _ref[_i];
          _ref1 = atom.config.get('todo-show.showInTable');
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            key = _ref1[_j];
            item = todo[key.toLowerCase()];
            if (item && item.indexOf(filter) !== -1) {
              result.push(todo);
              break;
            }
          }
        }
      } else {
        result = this.todos;
      }
      return this.emitter.emit('did-filter-todos', result);
    };

    TodosModel.prototype.getAvailableTableItems = function() {
      return this.availableItems;
    };

    TodosModel.prototype.setAvailableTableItems = function(availableItems) {
      this.availableItems = availableItems;
    };

    TodosModel.prototype.isSearching = function() {
      return this.searching;
    };

    TodosModel.prototype.getSearchScope = function() {
      return this.scope;
    };

    TodosModel.prototype.setSearchScope = function(scope) {
      return this.emitter.emit('did-change-scope', this.scope = scope);
    };

    TodosModel.prototype.toggleSearchScope = function() {
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

    TodosModel.prototype.buildRegexLookups = function(regexes) {
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

    TodosModel.prototype.makeRegexObj = function(regexStr) {
      var flags, pattern, _ref, _ref1;
      if (regexStr == null) {
        regexStr = "";
      }
      pattern = (_ref = regexStr.match(/\/(.+)\//)) != null ? _ref[1] : void 0;
      flags = (_ref1 = regexStr.match(/\/(\w+$)/)) != null ? _ref1[1] : void 0;
      if (!pattern) {
        this.emitter.emit('did-fail-search', "Invalid regex: " + (regexStr || 'empty'));
        return false;
      }
      return new RegExp(pattern, flags);
    };

    TodosModel.prototype.handleScanMatch = function(match) {
      var matchText, tag, _matchText, _ref;
      matchText = match.text || match.all;
      while ((_matchText = (_ref = match.regexp) != null ? _ref.exec(matchText) : void 0)) {
        matchText = _matchText.pop();
      }
      match.tags = ((function() {
        var _results;
        _results = [];
        while ((tag = /\s#(\w+)[,.]?$/.exec(matchText))) {
          if (tag.length !== 2) {
            break;
          }
          matchText = matchText.slice(0, tag.shift().length * -1);
          _results.push(tag.shift());
        }
        return _results;
      })()).sort().join(', ');
      matchText = matchText.replace(/(\*\/|\?>|-->|#>|-}|\]\])\s*$/, '').trim();
      if (matchText.length >= this.maxLength) {
        matchText = "" + (matchText.substr(0, this.maxLength - 3)) + "...";
      }
      if (!(match.position && match.position.length > 0)) {
        match.position = [[0, 0]];
      }
      if (match.position.serialize) {
        match.range = match.position.serialize().toString();
      } else {
        match.range = match.position.toString();
      }
      match.text = matchText || "No details";
      match.file = atom.project.relativize(match.path);
      match.line = parseInt(match.range.split(',')[0]) + 1;
      return match;
    };

    TodosModel.prototype.fetchRegexItem = function(regexLookup) {
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
            if (_this.searching) {
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
            _results.push(_this.addTodo(_this.handleScanMatch({
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

    TodosModel.prototype.fetchOpenRegexItem = function(regexLookup, activeEditorOnly) {
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
            return _this.addTodo(_this.handleScanMatch({
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

    TodosModel.prototype.search = function() {
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

    TodosModel.prototype.getIgnorePaths = function() {
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

    TodosModel.prototype.getMarkdown = function() {
      var todosMarkdown;
      todosMarkdown = new TodosMarkdown;
      return todosMarkdown.markdown(this.getTodos());
    };

    TodosModel.prototype.cancelSearch = function() {
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

    return TodosModel;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RvZG8tc2hvdy9saWIvdG9kb3MtbW9kZWwuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtDQUFBOztBQUFBLEVBQUMsVUFBVyxPQUFBLENBQVEsTUFBUixFQUFYLE9BQUQsQ0FBQTs7QUFBQSxFQUNBLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLGtCQUFSLENBRGhCLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ1MsSUFBQSxvQkFBQSxHQUFBO0FBQ1gsTUFBQSxJQUFDLENBQUEsT0FBRCxHQUFXLEdBQUEsQ0FBQSxPQUFYLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxTQUFELEdBQWEsR0FEYixDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsS0FBRCxHQUFTLE1BRlQsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLEtBQUQsR0FBUyxFQUhULENBRFc7SUFBQSxDQUFiOztBQUFBLHlCQU1BLFlBQUEsR0FBYyxTQUFDLEVBQUQsR0FBQTthQUFRLElBQUMsQ0FBQSxPQUFPLENBQUMsRUFBVCxDQUFZLGNBQVosRUFBNEIsRUFBNUIsRUFBUjtJQUFBLENBTmQsQ0FBQTs7QUFBQSx5QkFPQSxlQUFBLEdBQWlCLFNBQUMsRUFBRCxHQUFBO2FBQVEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxFQUFULENBQVksaUJBQVosRUFBK0IsRUFBL0IsRUFBUjtJQUFBLENBUGpCLENBQUE7O0FBQUEseUJBUUEsVUFBQSxHQUFZLFNBQUMsRUFBRCxHQUFBO2FBQVEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxFQUFULENBQVksaUJBQVosRUFBK0IsRUFBL0IsRUFBUjtJQUFBLENBUlosQ0FBQTs7QUFBQSx5QkFTQSxnQkFBQSxHQUFrQixTQUFDLEVBQUQsR0FBQTthQUFRLElBQUMsQ0FBQSxP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

//# sourceURL=/Users/ah/.atom/packages/todo-show/lib/todos-model.coffee
