(function() {
  var BaseView, TodoEmptyView, TodoFileView, TodoNoneView, TodoRegexView, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom-space-pen-views').View;

  BaseView = (function(_super) {
    __extends(BaseView, _super);

    function BaseView() {
      return BaseView.__super__.constructor.apply(this, arguments);
    }

    BaseView.prototype.initialize = function() {
      return this.handleEvents();
    };

    BaseView.prototype.destroy = function() {
      return this.detach();
    };

    BaseView.prototype.moveCursorTo = function(cursorCoords) {
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

    BaseView.prototype.openPath = function(filePath, cursorCoords) {
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

    BaseView.prototype.handleEvents = function() {
      return this.on('click', '.todo-url', (function(_this) {
        return function(e) {
          var link;
          link = e.target;
          return _this.openPath(link.dataset.uri, link.dataset.coords.split(','));
        };
      })(this));
    };

    return BaseView;

  })(View);

  TodoRegexView = (function(_super) {
    __extends(TodoRegexView, _super);

    function TodoRegexView() {
      return TodoRegexView.__super__.constructor.apply(this, arguments);
    }

    TodoRegexView.content = function(matches) {
      return this.section((function(_this) {
        return function() {
          _this.h1(function() {
            _this.span("" + matches[0].title + " ");
            return _this.span({
              "class": 'regex'
            }, matches[0].regex);
          });
          return _this.table(function() {
            var match, _i, _len, _results;
            _results = [];
            for (_i = 0, _len = matches.length; _i < _len; _i++) {
              match = matches[_i];
              _results.push(_this.tr(function() {
                _this.td(match.matchText);
                return _this.td(function() {
                  return _this.a({
                    "class": 'todo-url',
                    'data-uri': match.path,
                    'data-coords': match.rangeString
                  }, match.relativePath);
                });
              }));
            }
            return _results;
          });
        };
      })(this));
    };

    return TodoRegexView;

  })(BaseView);

  TodoFileView = (function(_super) {
    __extends(TodoFileView, _super);

    function TodoFileView() {
      return TodoFileView.__super__.constructor.apply(this, arguments);
    }

    TodoFileView.content = function(matches) {
      return this.section((function(_this) {
        return function() {
          _this.h1(function() {
            return _this.span("" + matches[0].relativePath);
          });
          return _this.table(function() {
            var match, _i, _len, _results;
            _results = [];
            for (_i = 0, _len = matches.length; _i < _len; _i++) {
              match = matches[_i];
              _results.push(_this.tr(function() {
                _this.td(match.matchText);
                return _this.td(function() {
                  return _this.a({
                    "class": 'todo-url',
                    'data-uri': match.path,
                    'data-coords': match.rangeString
                  }, match.title);
                });
              }));
            }
            return _results;
          });
        };
      })(this));
    };

    return TodoFileView;

  })(BaseView);

  TodoNoneView = (function(_super) {
    __extends(TodoNoneView, _super);

    function TodoNoneView() {
      return TodoNoneView.__super__.constructor.apply(this, arguments);
    }

    TodoNoneView.content = function(matches) {
      return this.section((function(_this) {
        return function() {
          _this.h1("All Matches");
          return _this.table(function() {
            var match, _i, _len, _results;
            _results = [];
            for (_i = 0, _len = matches.length; _i < _len; _i++) {
              match = matches[_i];
              _results.push(_this.tr(function() {
                _this.td(function() {
                  _this.span("" + match.matchText + " ");
                  return _this.i("(" + match.title + ")");
                });
                return _this.td(function() {
                  return _this.a({
                    "class": 'todo-url',
                    'data-uri': match.path,
                    'data-coords': match.rangeString
                  }, match.relativePath);
                });
              }));
            }
            return _results;
          });
        };
      })(this));
    };

    return TodoNoneView;

  })(BaseView);

  TodoEmptyView = (function(_super) {
    __extends(TodoEmptyView, _super);

    function TodoEmptyView() {
      return TodoEmptyView.__super__.constructor.apply(this, arguments);
    }

    TodoEmptyView.content = function() {
      return this.section((function(_this) {
        return function() {
          _this.h1("No results");
          return _this.table(function() {
            return _this.tr(function() {
              return _this.td(function() {
                _this.h5("Did not find any todos. Searched for:");
                _this.ul(function() {
                  var regex, _i, _len, _ref, _results;
                  _ref = atom.config.get('todo-show.findTheseRegexes');
                  _results = [];
                  for (_i = 0, _len = _ref.length; _i < _len; _i += 2) {
                    regex = _ref[_i];
                    _results.push(_this.li(regex));
                  }
                  return _results;
                });
                return _this.h5("Use your configuration to add more patterns.");
              });
            });
          });
        };
      })(this));
    };

    return TodoEmptyView;

  })(View);

  module.exports = {
    TodoRegexView: TodoRegexView,
    TodoFileView: TodoFileView,
    TodoNoneView: TodoNoneView,
    TodoEmptyView: TodoEmptyView
  };

}).call(this);
