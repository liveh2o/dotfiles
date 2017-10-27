(function() {
  var Emitter, TodosModel;

  Emitter = require('atom').Emitter;

  module.exports = TodosModel = (function() {
    TodosModel.prototype.maxLength = 120;

    function TodosModel() {
      this.emitter = new Emitter;
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
      var key, sortAsc, sortBy;
      sortBy = _arg.sortBy, sortAsc = _arg.sortAsc;
      if (!(key = this.getKeyForItem(sortBy))) {
        return;
      }
      this.todos = this.todos.sort(function(a, b) {
        var aItem, bItem;
        if (!(aItem = a[key])) {
          return -1;
        }
        if (!(bItem = b[key])) {
          return 1;
        }
        if (aItem === bItem) {
          aItem = a.matchText;
          bItem = b.matchText;
        }
        if (sortAsc) {
          return aItem.localeCompare(bItem);
        } else {
          return bItem.localeCompare(aItem);
        }
      });
      return this.emitter.emit('did-sort-todos', this.todos);
    };

    TodosModel.prototype.getKeyForItem = function(item) {
      switch (item) {
        case 'All':
          return 'lineText';
        case 'Text':
          return 'matchText';
        case 'Type':
          return 'title';
        case 'Range':
          return 'rangeString';
        case 'Line':
          return 'line';
        case 'Regex':
          return 'regex';
        case 'File':
          return 'relativePath';
      }
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
        regexStr = '';
      }
      pattern = (_ref = regexStr.match(/\/(.+)\//)) != null ? _ref[1] : void 0;
      flags = (_ref1 = regexStr.match(/\/(\w+$)/)) != null ? _ref1[1] : void 0;
      if (pattern) {
        return new RegExp(pattern, flags);
      } else {
        this.emitter.emit('did-fail-search', "Invalid regex: " + (regexStr || 'empty'));
        return false;
      }
    };

    TodosModel.prototype.handleScanMatch = function(match, regex) {
      var matchText, _match;
      matchText = match.matchText;
      while ((_match = regex != null ? regex.exec(matchText) : void 0)) {
        matchText = _match.pop();
      }
      matchText = matchText.replace(/(\*\/|\?>|-->|#>|-}|\]\])\s*$/, '').trim();
      if (matchText.length >= this.maxLength) {
        matchText = "" + (matchText.substring(0, this.maxLength - 3)) + "...";
      }
      match.matchText = matchText || 'No details';
      if (match.range.serialize) {
        match.rangeString = match.range.serialize().toString();
      } else {
        match.rangeString = match.range.toString();
      }
      match.relativePath = atom.project.relativize(match.path);
      match.line = (match.range[0][0] + 1).toString();
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
            match.title = regexLookup.title;
            match.regex = regexLookup.regex;
            match.path = result.filePath;
            _results.push(_this.addTodo(_this.handleScanMatch(match, regex)));
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
          return function(result, error) {
            var match;
            if (error) {
              console.debug(error.message);
            }
            if (!result) {
              return;
            }
            match = {
              title: regexLookup.title,
              regex: regexLookup.regex,
              path: editor.getPath(),
              matchText: result.matchText,
              lineText: result.matchText,
              range: [[result.computedRange.start.row, result.computedRange.start.column], [result.computedRange.end.row, result.computedRange.end.column]]
            };
            return _this.addTodo(_this.handleScanMatch(match, regex));
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
      var item, key, out, showInTableKeys, todo;
      showInTableKeys = (function() {
        var _i, _len, _ref, _results;
        _ref = atom.config.get('todo-show.showInTable');
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          _results.push(this.getKeyForItem(item));
        }
        return _results;
      }).call(this);
      return ((function() {
        var _i, _j, _len, _len1, _ref, _results;
        _ref = this.getTodos();
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          todo = _ref[_i];
          out = '-';
          for (_j = 0, _len1 = showInTableKeys.length; _j < _len1; _j++) {
            key = showInTableKeys[_j];
            if (item = todo[key]) {
              out += (function() {
                switch (key) {
                  case 'matchText':
                    return " " + item;
                  case 'lineText':
                    return " " + item;
                  case 'title':
                    return " __" + item + "__";
                  case 'rangeString':
                    return " _:" + item + "_";
                  case 'line':
                    return " _:" + item + "_";
                  case 'regex':
                    return " _" + item + "_";
                  case 'relativePath':
                    return " `" + item + "`";
                }
              })();
            }
          }
          if (out === '-') {
            out = "- No details";
          }
          _results.push("" + out + "\n");
        }
        return _results;
      }).call(this)).join('');
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RvZG8tc2hvdy9saWIvdG9kb3MtbW9kZWwuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1CQUFBOztBQUFBLEVBQUMsVUFBVyxPQUFBLENBQVEsTUFBUixFQUFYLE9BQUQsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSix5QkFBQSxTQUFBLEdBQVcsR0FBWCxDQUFBOztBQUVhLElBQUEsb0JBQUEsR0FBQTtBQUNYLE1BQUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxHQUFBLENBQUEsT0FBWCxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsS0FBRCxHQUFTLEVBRFQsQ0FEVztJQUFBLENBRmI7O0FBQUEseUJBTUEsWUFBQSxHQUFjLFNBQUMsRUFBRCxHQUFBO2FBQVEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxFQUFULENBQVksY0FBWixFQUE0QixFQUE1QixFQUFSO0lBQUEsQ0FOZCxDQUFBOztBQUFBLHlCQU9BLGVBQUEsR0FBaUIsU0FBQyxFQUFELEdBQUE7YUFBUSxJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSxpQkFBWixFQUErQixFQUEvQixFQUFSO0lBQUEsQ0FQakIsQ0FBQTs7QUFBQSx5QkFRQSxVQUFBLEdBQVksU0FBQyxFQUFELEdBQUE7YUFBUSxJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSxpQkFBWixFQUErQixFQUEvQixFQUFSO0lBQUEsQ0FSWixDQUFBOztBQUFBLHlCQVNBLGdCQUFBLEdBQWtCLFNBQUMsRUFBRCxHQUFBO2FBQVEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxFQUFULENBQVksa0JBQVosRUFBZ0MsRUFBaEMsRUFBUjtJQUFBLENBVGxCLENBQUE7O0FBQUEseUJBVUEsZ0JBQUEsR0FBa0IsU0FBQyxFQUFELEdBQUE7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

//# sourceURL=/Users/ah/.atom/packages/todo-show/lib/todos-model.coffee
