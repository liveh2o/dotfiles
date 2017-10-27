(function() {
  var CompositeDisposable, Q, ScrollView, ShowTodoView, TodoEmptyView, TodoFileView, TodoNoneView, TodoRegexView, fs, path, _, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CompositeDisposable = require('atom').CompositeDisposable;

  ScrollView = require('atom-space-pen-views').ScrollView;

  path = require('path');

  fs = require('fs-plus');

  _ = require('underscore-plus');

  Q = require('q');

  _ref = require('./todo-item-view'), TodoRegexView = _ref.TodoRegexView, TodoFileView = _ref.TodoFileView, TodoNoneView = _ref.TodoNoneView, TodoEmptyView = _ref.TodoEmptyView;

  module.exports = ShowTodoView = (function(_super) {
    __extends(ShowTodoView, _super);

    ShowTodoView.URI = 'atom://todo-show/todos';

    ShowTodoView.URIopen = 'atom://todo-show/open-todos';

    ShowTodoView.prototype.maxLength = 120;

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

    function ShowTodoView(searchWorkspace) {
      this.searchWorkspace = searchWorkspace != null ? searchWorkspace : true;
      ShowTodoView.__super__.constructor.apply(this, arguments);
      this.disposables = new CompositeDisposable;
      this.matches = [];
      this.handleEvents();
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

    ShowTodoView.prototype.getIconName = function() {
      return "checklist";
    };

    ShowTodoView.prototype.getURI = function() {
      if (this.searchWorkspace) {
        return this.constructor.URI;
      } else {
        return this.constructor.URIopen;
      }
    };

    ShowTodoView.prototype.getProjectPath = function() {
      return atom.project.getPaths()[0];
    };

    ShowTodoView.prototype.getProjectName = function() {
      var _ref1;
      return (_ref1 = atom.project.getDirectories()[0]) != null ? _ref1.getBaseName() : void 0;
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

    ShowTodoView.prototype.showError = function(message) {
      return atom.notifications.addError('todo-show', {
        detail: message,
        dismissable: true
      });
    };

    ShowTodoView.prototype.buildRegexLookups = function(regexes) {
      var i, regex, _i, _len, _results;
      if (regexes.length % 2) {
        this.showError("Invalid number of regexes: " + regexes.length);
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

    ShowTodoView.prototype.makeRegexObj = function(regexStr) {
      var flags, pattern, _ref1, _ref2;
      if (regexStr == null) {
        regexStr = '';
      }
      pattern = (_ref1 = regexStr.match(/\/(.+)\//)) != null ? _ref1[1] : void 0;
      flags = (_ref2 = regexStr.match(/\/(\w+$)/)) != null ? _ref2[1] : void 0;
      if (pattern) {
        return new RegExp(pattern, flags);
      } else {
        this.showError("Invalid regex: " + (regexStr || 'empty'));
        return false;
      }
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
            if (_this.loading) {
              return _this.searchCount.text("" + nPaths + " paths searched...");
            }
          };
        })(this);
      }
      return atom.workspace.scan(regex, options, (function(_this) {
        return function(result, error) {
          var match, _i, _len, _ref1, _results;
          if (error) {
            console.debug(error.message);
          }
          if (!result) {
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

    ShowTodoView.prototype.getIgnorePaths = function() {
      var ignore, ignores, _i, _len, _results;
      ignores = atom.config.get('todo-show.ignoreThesePaths');
      if (ignores == null) {
        return ['*'];
      }
      if (Object.prototype.toString.call(ignores) !== '[object Array]') {
        this.showError('ignoreThesePaths must be an array');
        return ['*'];
      }
      _results = [];
      for (_i = 0, _len = ignores.length; _i < _len; _i++) {
        ignore = ignores[_i];
        _results.push("!" + ignore);
      }
      return _results;
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
      var filePath, outputFilePath, projectPath;
      if (this.loading) {
        return;
      }
      filePath = "" + (this.getProjectName() || 'todos') + ".md";
      if (projectPath = this.getProjectPath()) {
        filePath = path.join(projectPath, filePath);
      }
      if (outputFilePath = atom.showSaveDialogSync(filePath.toLowerCase())) {
        fs.writeFileSync(outputFilePath, this.getMarkdown(this.matches));
        return atom.workspace.open(outputFilePath);
      }
    };

    return ShowTodoView;

  })(ScrollView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RvZG8tc2hvdy9saWIvc2hvdy10b2RvLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZIQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUNDLGFBQWMsT0FBQSxDQUFRLHNCQUFSLEVBQWQsVUFERCxDQUFBOztBQUFBLEVBRUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRlAsQ0FBQTs7QUFBQSxFQUdBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQUhMLENBQUE7O0FBQUEsRUFJQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBSkosQ0FBQTs7QUFBQSxFQUtBLENBQUEsR0FBSSxPQUFBLENBQVEsR0FBUixDQUxKLENBQUE7O0FBQUEsRUFPQSxPQUE2RCxPQUFBLENBQVEsa0JBQVIsQ0FBN0QsRUFBQyxxQkFBQSxhQUFELEVBQWdCLG9CQUFBLFlBQWhCLEVBQThCLG9CQUFBLFlBQTlCLEVBQTRDLHFCQUFBLGFBUDVDLENBQUE7O0FBQUEsRUFTQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osbUNBQUEsQ0FBQTs7QUFBQSxJQUFBLFlBQUMsQ0FBQSxHQUFELEdBQU0sd0JBQU4sQ0FBQTs7QUFBQSxJQUNBLFlBQUMsQ0FBQSxPQUFELEdBQVUsNkJBRFYsQ0FBQTs7QUFBQSwyQkFFQSxTQUFBLEdBQVcsR0FGWCxDQUFBOztBQUFBLElBSUEsWUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sdUNBQVA7QUFBQSxRQUFnRCxRQUFBLEVBQVUsQ0FBQSxDQUExRDtPQUFMLEVBQW1FLENBQUEs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

//# sourceURL=/Users/ah/.atom/packages/todo-show/lib/show-todo-view.coffee
