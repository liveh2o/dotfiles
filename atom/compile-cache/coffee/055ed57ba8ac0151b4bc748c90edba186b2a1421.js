(function() {
  var $$$, CompositeDisposable, Disposable, Emitter, Point, Q, ScrollView, ShowTodoView, fs, ignore, path, slash, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  path = require('path');

  fs = require('fs-plus');

  _ref = require('atom'), Emitter = _ref.Emitter, Disposable = _ref.Disposable, CompositeDisposable = _ref.CompositeDisposable, Point = _ref.Point;

  _ref1 = require('atom-space-pen-views'), $$$ = _ref1.$$$, ScrollView = _ref1.ScrollView;

  Q = require('q');

  slash = require('slash');

  ignore = require('ignore');

  module.exports = ShowTodoView = (function(_super) {
    __extends(ShowTodoView, _super);

    ShowTodoView.prototype.maxLength = 120;

    ShowTodoView.content = function() {
      return this.div({
        "class": 'show-todo-preview native-key-bindings',
        tabindex: -1
      });
    };

    function ShowTodoView(_arg) {
      this.filePath = _arg.filePath;
      ShowTodoView.__super__.constructor.apply(this, arguments);
      this.handleEvents();
      this.emitter = new Emitter;
      this.disposables = new CompositeDisposable;
    }

    ShowTodoView.prototype.destroy = function() {
      this.cancelScan();
      this.detach();
      return this.disposables.dispose();
    };

    ShowTodoView.prototype.getTitle = function() {
      return "Todo-Show Results";
    };

    ShowTodoView.prototype.getURI = function() {
      return "todolist-preview://" + (this.getPath());
    };

    ShowTodoView.prototype.getPath = function() {
      return "TODOs";
    };

    ShowTodoView.prototype.getProjectPath = function() {
      return atom.project.getPaths()[0];
    };

    ShowTodoView.prototype.onDidChangeTitle = function() {
      return new Disposable();
    };

    ShowTodoView.prototype.onDidChangeModified = function() {
      return new Disposable();
    };

    ShowTodoView.prototype.showLoading = function() {
      this.loading = true;
      return this.html($$$(function() {
        this.div({
          "class": 'markdown-spinner'
        });
        return this.h5({
          "class": 'text-center searched-count'
        }, 'Loading Todos...');
      }));
    };

    ShowTodoView.prototype.showTodos = function(regexes) {
      this.html($$$(function() {
        var regex, _i, _len, _results;
        this.div({
          "class": 'todo-action-items pull-right'
        }, (function(_this) {
          return function() {
            _this.a({
              "class": 'todo-save-as'
            }, function() {
              return _this.span({
                "class": 'icon icon-cloud-download'
              });
            });
            return _this.a({
              "class": 'todo-refresh'
            }, function() {
              return _this.span({
                "class": 'icon icon-sync'
              });
            });
          };
        })(this));
        _results = [];
        for (_i = 0, _len = regexes.length; _i < _len; _i++) {
          regex = regexes[_i];
          _results.push(this.section((function(_this) {
            return function() {
              _this.h1(function() {
                _this.span(regex.title + ' ');
                return _this.span({
                  "class": 'regex'
                }, regex.regex);
              });
              return _this.table(function() {
                var match, relativePath, result, _j, _len1, _ref2, _results1;
                _ref2 = regex.results;
                _results1 = [];
                for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
                  result = _ref2[_j];
                  relativePath = atom.project.relativize(result.filePath);
                  _results1.push((function() {
                    var _k, _len2, _ref3, _results2;
                    _ref3 = result.matches;
                    _results2 = [];
                    for (_k = 0, _len2 = _ref3.length; _k < _len2; _k++) {
                      match = _ref3[_k];
                      _results2.push(this.tr((function(_this) {
                        return function() {
                          _this.td(match.matchText);
                          return _this.td(function() {
                            var range;
                            range = match.range.toString();
                            if (match.range.serialize) {
                              range = match.range.serialize().toString();
                            }
                            return _this.a({
                              "class": 'todo-url',
                              'data-uri': result.filePath,
                              'data-coords': range
                            }, relativePath);
                          });
                        };
                      })(this)));
                    }
                    return _results2;
                  }).call(_this));
                }
                return _results1;
              });
            };
          })(this)));
        }
        return _results;
      }));
      return this.loading = false;
    };

    ShowTodoView.prototype.buildRegexLookups = function(settingsRegexes) {
      var i, regex, _i, _len, _results;
      _results = [];
      for (i = _i = 0, _len = settingsRegexes.length; _i < _len; i = _i += 2) {
        regex = settingsRegexes[i];
        _results.push({
          'title': regex,
          'regex': settingsRegexes[i + 1],
          'results': []
        });
      }
      return _results;
    };

    ShowTodoView.prototype.makeRegexObj = function(regexStr) {
      var flags, pattern, _ref2, _ref3;
      pattern = (_ref2 = regexStr.match(/\/(.+)\//)) != null ? _ref2[1] : void 0;
      flags = (_ref3 = regexStr.match(/\/(\w+$)/)) != null ? _ref3[1] : void 0;
      if (!pattern) {
        return false;
      }
      return new RegExp(pattern, flags);
    };

    ShowTodoView.prototype.handleScanResult = function(result, regex) {
      var match, matchText, regExMatch, _i, _len, _ref2;
      _ref2 = result.matches;
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        regExMatch = _ref2[_i];
        matchText = regExMatch.matchText;
        while ((match = regex != null ? regex.exec(matchText) : void 0)) {
          matchText = match.pop();
        }
        matchText = matchText.replace(/(\*\/|-->|#>|-}|\]\])\s*$/, '').trim();
        if (matchText.length >= this.maxLength) {
          matchText = matchText.substring(0, this.maxLength - 3) + '...';
        }
        regExMatch.matchText = matchText;
      }
      return result;
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
              return _this.find('.searched-count').text("" + nPaths + " paths searched...");
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
          var pathToTest;
          if (error) {
            console.debug(error.message);
          }
          if (result) {
            pathToTest = slash(result.filePath.substring(atom.project.getPaths()[0].length));
            if (hasIgnores && ignoreRules.filter([pathToTest]).length === 0) {
              return;
            }
            return regexLookup.results.push(_this.handleScanResult(result, regex));
          }
        };
      })(this));
    };

    ShowTodoView.prototype.renderTodos = function() {
      var promise, regexObj, regexes, _i, _len;
      this.showLoading();
      regexes = this.buildRegexLookups(atom.config.get('todo-show.findTheseRegexes'));
      this.searchPromises = [];
      for (_i = 0, _len = regexes.length; _i < _len; _i++) {
        regexObj = regexes[_i];
        promise = this.fetchRegexItem(regexObj);
        this.searchPromises.push(promise);
      }
      Q.all(this.searchPromises).then((function(_this) {
        return function() {
          return _this.showTodos(_this.regexes = regexes);
        };
      })(this));
      return this;
    };

    ShowTodoView.prototype.cancelScan = function() {
      var promise, _i, _len, _ref2, _results;
      _ref2 = this.searchPromises;
      _results = [];
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        promise = _ref2[_i];
        if (promise) {
          _results.push(promise.cancel());
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    ShowTodoView.prototype.handleEvents = function() {
      atom.commands.add(this.element, {
        'core:save-as': (function(_this) {
          return function(event) {
            event.stopPropagation();
            return _this.saveAs();
          };
        })(this),
        'core:refresh': (function(_this) {
          return function(event) {
            event.stopPropagation();
            return _this.renderTodos();
          };
        })(this)
      });
      this.on('click', '.todo-url', (function(_this) {
        return function(e) {
          var link;
          link = e.target;
          return _this.openPath(link.dataset.uri, link.dataset.coords.split(','));
        };
      })(this));
      this.on('click', '.todo-save-as', (function(_this) {
        return function() {
          return _this.saveAs();
        };
      })(this));
      return this.on('click', '.todo-refresh', (function(_this) {
        return function() {
          return _this.renderTodos();
        };
      })(this));
    };

    ShowTodoView.prototype.openPath = function(filePath, cursorCoords) {
      if (!filePath) {
        return;
      }
      return atom.workspace.open(filePath, {
        split: 'left'
      }).done((function(_this) {
        return function() {
          return _this.moveCursorTo(cursorCoords);
        };
      })(this));
    };

    ShowTodoView.prototype.moveCursorTo = function(cursorCoords) {
      var charNumber, lineNumber, position, textEditor;
      lineNumber = parseInt(cursorCoords[0]);
      charNumber = parseInt(cursorCoords[1]);
      if (textEditor = atom.workspace.getActiveTextEditor()) {
        position = [lineNumber, charNumber];
        textEditor.setCursorBufferPosition(position, {
          autoscroll: false
        });
        return textEditor.scrollToCursorPosition({
          center: true
        });
      }
    };

    ShowTodoView.prototype.getMarkdown = function() {
      return this.regexes.map(function(regex) {
        var out, _ref2;
        if (!regex.results.length) {
          return;
        }
        out = '\n## ' + regex.title + '\n\n';
        if ((_ref2 = regex.results) != null) {
          _ref2.map(function(result) {
            var _ref3;
            return (_ref3 = result.matches) != null ? _ref3.map(function(match) {
              out += '- ' + match.matchText;
              return out += ' _(' + atom.project.relativize(result.filePath) + ')_\n';
            }) : void 0;
          });
        }
        return out;
      }).join("");
    };

    ShowTodoView.prototype.saveAs = function() {
      var filePath, outputFilePath;
      if (this.loading) {
        return;
      }
      filePath = path.parse(this.getPath()).name + '.txt';
      if (this.getProjectPath()) {
        filePath = path.join(this.getProjectPath(), filePath);
      }
      if (outputFilePath = atom.showSaveDialogSync(filePath)) {
        fs.writeFileSync(outputFilePath, this.getMarkdown());
        return atom.workspace.open(outputFilePath);
      }
    };

    return ShowTodoView;

  })(ScrollView);

}).call(this);
