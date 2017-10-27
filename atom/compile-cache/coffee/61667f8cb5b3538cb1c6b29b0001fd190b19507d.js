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
      return pane.setFlexScale(parseFloat(flex));
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
      match.matchText = matchText;
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
