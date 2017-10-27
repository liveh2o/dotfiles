(function() {
  var CompositeDisposable, Q, ScrollView, ShowTodoView, TodoEmptyView, TodoFileView, TodoNoneView, TodoRegexView, fs, ignore, path, slash, _, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CompositeDisposable = require('atom').CompositeDisposable;

  ScrollView = require('atom-space-pen-views').ScrollView;

  path = require('path');

  fs = require('fs-plus');

  _ = require('underscore-plus');

  Q = require('q');

  slash = require('slash');

  ignore = require('ignore');

  _ref = require('./todo-item-view'), TodoRegexView = _ref.TodoRegexView, TodoFileView = _ref.TodoFileView, TodoNoneView = _ref.TodoNoneView, TodoEmptyView = _ref.TodoEmptyView;

  module.exports = ShowTodoView = (function(_super) {
    __extends(ShowTodoView, _super);

    ShowTodoView.prototype.maxLength = 120;

    ShowTodoView.prototype.matches = [];

    ShowTodoView.content = function() {
      return this.div({
        "class": 'show-todo-preview native-key-bindings',
        tabindex: -1
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'todo-action-items pull-right'
          }, function() {
            _this.a({
              outlet: 'saveAsButton',
              "class": 'icon icon-cloud-download'
            });
            return _this.a({
              outlet: 'refreshButton',
              "class": 'icon icon-sync'
            });
          });
          _this.div({
            outlet: 'todoLoading'
          }, function() {
            _this.div({
              "class": 'markdown-spinner'
            });
            return _this.h5({
              outlet: 'searchCount',
              "class": 'text-center'
            }, "Loading Todos...");
          });
          return _this.div({
            outlet: 'todoList'
          });
        };
      })(this));
    };

    function ShowTodoView(_arg) {
      this.filePath = _arg.filePath;
      ShowTodoView.__super__.constructor.apply(this, arguments);
      this.disposables = new CompositeDisposable;
      this.handleEvents();
      this.searchWorkspace = this.filePath !== '/Open-TODOs';
    }

    ShowTodoView.prototype.handleEvents = function() {
      var pane;
      this.disposables.add(atom.commands.add(this.element, {
        'core:save-as': (function(_this) {
          return function(event) {
            event.stopPropagation();
            return _this.saveAs();
          };
        })(this),
        'core:refresh': (function(_this) {
          return function(event) {
            event.stopPropagation();
            return _this.getTodos();
          };
        })(this)
      }));
      pane = atom.workspace.getActivePane();
      if (atom.config.get('todo-show.rememberViewSize')) {
        this.restorePaneFlex(pane);
      }
      this.disposables.add(pane.observeFlexScale((function(_this) {
        return function(flexScale) {
          return _this.savePaneFlex(flexScale);
        };
      })(this)));
      this.saveAsButton.on('click', (function(_this) {
        return function() {
          return _this.saveAs();
        };
      })(this));
      return this.refreshButton.on('click', (function(_this) {
        return function() {
          return _this.getTodos();
        };
      })(this));
    };

    ShowTodoView.prototype.destroy = function() {
      var _ref1;
      this.cancelScan();
      if ((_ref1 = this.disposables) != null) {
        _ref1.dispose();
      }
      return this.detach();
    };

    ShowTodoView.prototype.savePaneFlex = function(flex) {
      return localStorage.setItem('todo-show.flex', flex);
    };

    ShowTodoView.prototype.restorePaneFlex = function(pane) {
      var flex;
      flex = localStorage.getItem('todo-show.flex');
      if (flex) {
        return pane.setFlexScale(parseFloat(flex));
      }
    };

    ShowTodoView.prototype.getTitle = function() {
      if (this.searchWorkspace) {
        return "Todo-Show Results";
      } else {
        return "Todo-Show Open Files";
      }
    };

    ShowTodoView.prototype.getURI = function() {
      return "todolist-preview:///" + (this.getPath());
    };

    ShowTodoView.prototype.getPath = function() {
      return this.filePath;
    };

    ShowTodoView.prototype.getProjectPath = function() {
      return atom.project.getPaths()[0];
    };

    ShowTodoView.prototype.startLoading = function() {
      this.loading = true;
      this.matches = [];
      this.todoList.empty();
      return this.todoLoading.show();
    };

    ShowTodoView.prototype.stopLoading = function() {
      this.loading = false;
      return this.todoLoading.hide();
    };

    ShowTodoView.prototype.buildRegexLookups = function(settingsRegexes) {
      var i, regex, _i, _len, _results;
      _results = [];
      for (i = _i = 0, _len = settingsRegexes.length; _i < _len; i = _i += 2) {
        regex = settingsRegexes[i];
        _results.push({
          'title': regex,
          'regex': settingsRegexes[i + 1]
        });
      }
      return _results;
    };

    ShowTodoView.prototype.makeRegexObj = function(regexStr) {
      var flags, pattern, _ref1, _ref2;
      pattern = (_ref1 = regexStr.match(/\/(.+)\//)) != null ? _ref1[1] : void 0;
      flags = (_ref2 = regexStr.match(/\/(\w+$)/)) != null ? _ref2[1] : void 0;
      if (!pattern) {
        return false;
      }
      return new RegExp(pattern, flags);
    };

    ShowTodoView.prototype.handleScanMatch = function(match, regex) {
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
      return match;
    };

    ShowTodoView.prototype.fetchRegexItem = function(regexLookup) {
      var hasIgnores, ignoreRules, ignoresFromSettings, onPathsSearched, options, regex;
      regex = this.makeRegexObj(regexLookup.regex);
      if (!regex) {
        return false;
      }
      ignoresFromSettings = atom.config.get('todo-show.ignoreThesePaths');
      hasIgnores = (ignoresFromSettings != null ? ignoresFromSettings.length : void 0) > 0;
      ignoreRules = ignore({
        ignore: ignoresFromSettings
      });
      options = {};
      if (!this.firstRegex) {
        this.firstRegex = true;
        onPathsSearched = (function(_this) {
          return function(nPaths) {
            if (_this.loading) {
              return _this.searchCount.text("" + nPaths + " paths searched...");
            }
          };
        })(this);
        options = {
          paths: '*',
          onPathsSearched: onPathsSearched
        };
      }
      return atom.workspace.scan(regex, options, (function(_this) {
        return function(result, error) {
          var match, pathToTest, _i, _len, _ref1, _results;
          if (error) {
            console.debug(error.message);
          }
          if (!result) {
            return;
          }
          pathToTest = slash(result.filePath.substring(atom.project.getPaths()[0].length));
          if (hasIgnores && ignoreRules.filter([pathToTest]).length === 0) {
            return;
          }
          _ref1 = result.matches;
          _results = [];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            match = _ref1[_i];
            match.title = regexLookup.title;
            match.regex = regexLookup.regex;
            match.path = result.filePath;
            _results.push(_this.matches.push(_this.handleScanMatch(match, regex)));
          }
          return _results;
        };
      })(this));
    };

    ShowTodoView.prototype.fetchOpenRegexItem = function(regexLookup) {
      var deferred, editor, regex, _i, _len, _ref1;
      regex = this.makeRegexObj(regexLookup.regex);
      if (!regex) {
        return false;
      }
      deferred = Q.defer();
      _ref1 = atom.workspace.getTextEditors();
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        editor = _ref1[_i];
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
            return _this.matches.push(_this.handleScanMatch(match, regex));
          };
        })(this));
      }
      deferred.resolve();
      return deferred.promise;
    };

    ShowTodoView.prototype.getTodos = function() {
      var promise, regexObj, regexes, _i, _len;
      this.startLoading();
      regexes = this.buildRegexLookups(atom.config.get('todo-show.findTheseRegexes'));
      this.searchPromises = [];
      for (_i = 0, _len = regexes.length; _i < _len; _i++) {
        regexObj = regexes[_i];
        if (this.searchWorkspace) {
          promise = this.fetchRegexItem(regexObj);
        } else {
          promise = this.fetchOpenRegexItem(regexObj);
        }
        this.searchPromises.push(promise);
      }
      Q.all(this.searchPromises).then((function(_this) {
        return function() {
          _this.stopLoading();
          return _this.renderTodos(_this.matches);
        };
      })(this));
      return this;
    };

    ShowTodoView.prototype.groupMatches = function(matches, cb) {
      var group, groupBy, iteratee, key, regexes, sortedMatches, _ref1, _results;
      regexes = atom.config.get('todo-show.findTheseRegexes');
      groupBy = atom.config.get('todo-show.groupMatchesBy');
      switch (groupBy) {
        case 'file':
          iteratee = 'relativePath';
          sortedMatches = _.sortBy(matches, iteratee);
          break;
        case 'none':
          sortedMatches = _.sortBy(matches, 'matchText');
          return cb(sortedMatches, groupBy);
        default:
          iteratee = 'title';
          sortedMatches = _.sortBy(matches, function(match) {
            return regexes.indexOf(match[iteratee]);
          });
      }
      _ref1 = _.groupBy(sortedMatches, iteratee);
      _results = [];
      for (key in _ref1) {
        if (!__hasProp.call(_ref1, key)) continue;
        group = _ref1[key];
        _results.push(cb(group, groupBy));
      }
      return _results;
    };

    ShowTodoView.prototype.renderTodos = function(matches) {
      if (!matches.length) {
        return this.todoList.append(new TodoEmptyView);
      }
      return this.groupMatches(matches, (function(_this) {
        return function(group, groupBy) {
          switch (groupBy) {
            case 'file':
              return _this.todoList.append(new TodoFileView(group));
            case 'none':
              return _this.todoList.append(new TodoNoneView(group));
            default:
              return _this.todoList.append(new TodoRegexView(group));
          }
        };
      })(this));
    };

    ShowTodoView.prototype.cancelScan = function() {
      var promise, _i, _len, _ref1, _results;
      _ref1 = this.searchPromises;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        promise = _ref1[_i];
        if (promise) {
          _results.push(promise.cancel());
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    ShowTodoView.prototype.getMarkdown = function(matches) {
      var markdown;
      markdown = [];
      this.groupMatches(matches, function(group, groupBy) {
        var match, out, _i, _j, _k, _len, _len1, _len2;
        switch (groupBy) {
          case 'file':
            out = "\n## " + (group[0].relativePath || 'Unknown File') + "\n\n";
            for (_i = 0, _len = group.length; _i < _len; _i++) {
              match = group[_i];
              out += "- " + (match.matchText || 'empty');
              if (match.title) {
                out += " `" + match.title + "`";
              }
              out += "\n";
            }
            break;
          case 'none':
            out = "\n## All Matches\n\n";
            for (_j = 0, _len1 = group.length; _j < _len1; _j++) {
              match = group[_j];
              out += "- " + (match.matchText || 'empty');
              if (match.title) {
                out += " _(" + match.title + ")_";
              }
              if (match.relativePath) {
                out += " `" + match.relativePath + "`";
              }
              if (match.range && match.range[0]) {
                out += " `:" + (match.range[0][0] + 1) + "`";
              }
              out += "\n";
            }
            break;
          default:
            out = "\n## " + (group[0].title || 'No Title') + "\n\n";
            for (_k = 0, _len2 = group.length; _k < _len2; _k++) {
              match = group[_k];
              out += "- " + (match.matchText || 'empty');
              if (match.relativePath) {
                out += " `" + match.relativePath + "`";
              }
              if (match.range && match.range[0]) {
                out += " `:" + (match.range[0][0] + 1) + "`";
              }
              out += "\n";
            }
        }
        return markdown.push(out);
      });
      return markdown.join('');
    };

    ShowTodoView.prototype.saveAs = function() {
      var filePath, outputFilePath;
      if (this.loading) {
        return;
      }
      filePath = "" + (path.parse(this.getPath()).name) + ".md";
      if (this.getProjectPath()) {
        filePath = path.join(this.getProjectPath(), filePath);
      }
      if (outputFilePath = atom.showSaveDialogSync(filePath.toLowerCase())) {
        fs.writeFileSync(outputFilePath, this.getMarkdown(this.matches));
        return atom.workspace.open(outputFilePath);
      }
    };

    return ShowTodoView;

  })(ScrollView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RvZG8tc2hvdy9saWIvc2hvdy10b2RvLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDRJQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUNDLGFBQWMsT0FBQSxDQUFRLHNCQUFSLEVBQWQsVUFERCxDQUFBOztBQUFBLEVBRUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRlAsQ0FBQTs7QUFBQSxFQUdBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQUhMLENBQUE7O0FBQUEsRUFJQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBSkosQ0FBQTs7QUFBQSxFQU1BLENBQUEsR0FBSSxPQUFBLENBQVEsR0FBUixDQU5KLENBQUE7O0FBQUEsRUFPQSxLQUFBLEdBQVEsT0FBQSxDQUFRLE9BQVIsQ0FQUixDQUFBOztBQUFBLEVBUUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxRQUFSLENBUlQsQ0FBQTs7QUFBQSxFQVVBLE9BQTZELE9BQUEsQ0FBUSxrQkFBUixDQUE3RCxFQUFDLHFCQUFBLGFBQUQsRUFBZ0Isb0JBQUEsWUFBaEIsRUFBOEIsb0JBQUEsWUFBOUIsRUFBNEMscUJBQUEsYUFWNUMsQ0FBQTs7QUFBQSxFQVlBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixtQ0FBQSxDQUFBOztBQUFBLDJCQUFBLFNBQUEsR0FBVyxHQUFYLENBQUE7O0FBQUEsMkJBQ0EsT0FBQSxHQUFTLEVBRFQsQ0FBQTs7QUFBQSxJQUdBLFlBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLHVDQUFQO0FBQUEsUUFB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

//# sourceURL=/Users/ah/.atom/packages/todo-show/lib/show-todo-view.coffee
