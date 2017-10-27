(function() {
  var TableHeaderView, TodoEmptyView, TodoView, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  View = require('atom-space-pen-views').View;

  TableHeaderView = (function(_super) {
    __extends(TableHeaderView, _super);

    function TableHeaderView() {
      return TableHeaderView.__super__.constructor.apply(this, arguments);
    }

    TableHeaderView.content = function(showInTable, _arg) {
      var sortAsc, sortBy;
      if (showInTable == null) {
        showInTable = [];
      }
      sortBy = _arg.sortBy, sortAsc = _arg.sortAsc;
      return this.tr((function(_this) {
        return function() {
          var item, _i, _len, _results;
          _results = [];
          for (_i = 0, _len = showInTable.length; _i < _len; _i++) {
            item = showInTable[_i];
            _results.push(_this.th(item, function() {
              if (item === sortBy && sortAsc) {
                _this.div({
                  "class": 'sort-asc icon-triangle-down active'
                });
              } else {
                _this.div({
                  "class": 'sort-asc icon-triangle-down'
                });
              }
              if (item === sortBy && !sortAsc) {
                return _this.div({
                  "class": 'sort-desc icon-triangle-up active'
                });
              } else {
                return _this.div({
                  "class": 'sort-desc icon-triangle-up'
                });
              }
            }));
          }
          return _results;
        };
      })(this));
    };

    return TableHeaderView;

  })(View);

  TodoView = (function(_super) {
    __extends(TodoView, _super);

    function TodoView() {
      this.openPath = __bind(this.openPath, this);
      return TodoView.__super__.constructor.apply(this, arguments);
    }

    TodoView.content = function(showInTable, todo) {
      if (showInTable == null) {
        showInTable = [];
      }
      return this.tr((function(_this) {
        return function() {
          var item, _i, _len, _results;
          _results = [];
          for (_i = 0, _len = showInTable.length; _i < _len; _i++) {
            item = showInTable[_i];
            _results.push(_this.td(function() {
              switch (item) {
                case 'All':
                  return _this.span(todo.all);
                case 'Text':
                  return _this.span(todo.text);
                case 'Type':
                  return _this.i(todo.type);
                case 'Range':
                  return _this.i(todo.range);
                case 'Line':
                  return _this.i(todo.line);
                case 'Regex':
                  return _this.code(todo.regex);
                case 'File':
                  return _this.a(todo.file);
                case 'Tags':
                  return _this.i(todo.tags);
              }
            }));
          }
          return _results;
        };
      })(this));
    };

    TodoView.prototype.initialize = function(showInTable, todo) {
      this.todo = todo;
      return this.handleEvents();
    };

    TodoView.prototype.destroy = function() {
      return this.detach();
    };

    TodoView.prototype.handleEvents = function() {
      return this.on('click', 'td', this.openPath);
    };

    TodoView.prototype.openPath = function() {
      var todo;
      if (!(todo = this.todo)) {
        return;
      }
      return atom.workspace.open(todo.path, {
        split: 'left'
      }).then(function() {
        var position, textEditor;
        if (textEditor = atom.workspace.getActiveTextEditor()) {
          position = [todo.position[0][0], todo.position[0][1]];
          textEditor.setCursorBufferPosition(position, {
            autoscroll: false
          });
          return textEditor.scrollToCursorPosition({
            center: true
          });
        }
      });
    };

    return TodoView;

  })(View);

  TodoEmptyView = (function(_super) {
    __extends(TodoEmptyView, _super);

    function TodoEmptyView() {
      return TodoEmptyView.__super__.constructor.apply(this, arguments);
    }

    TodoEmptyView.content = function(showInTable) {
      if (showInTable == null) {
        showInTable = [];
      }
      return this.tr((function(_this) {
        return function() {
          return _this.td({
            colspan: showInTable.length
          }, function() {
            return _this.p("No results...");
          });
        };
      })(this));
    };

    return TodoEmptyView;

  })(View);

  module.exports = {
    TableHeaderView: TableHeaderView,
    TodoView: TodoView,
    TodoEmptyView: TodoEmptyView
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RvZG8tc2hvdy9saWIvdG9kby1pdGVtLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDhDQUFBO0lBQUE7O3NGQUFBOztBQUFBLEVBQUMsT0FBUSxPQUFBLENBQVEsc0JBQVIsRUFBUixJQUFELENBQUE7O0FBQUEsRUFFTTtBQUNKLHNDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLGVBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQyxXQUFELEVBQW1CLElBQW5CLEdBQUE7QUFDUixVQUFBLGVBQUE7O1FBRFMsY0FBYztPQUN2QjtBQUFBLE1BRDRCLGNBQUEsUUFBUSxlQUFBLE9BQ3BDLENBQUE7YUFBQSxJQUFDLENBQUEsRUFBRCxDQUFJLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDRixjQUFBLHdCQUFBO0FBQUE7ZUFBQSxrREFBQTttQ0FBQTtBQUNFLDBCQUFBLEtBQUMsQ0FBQSxFQUFELENBQUksSUFBSixFQUFVLFNBQUEsR0FBQTtBQUNSLGNBQUEsSUFBRyxJQUFBLEtBQVEsTUFBUixJQUFtQixPQUF0QjtBQUNFLGdCQUFBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxrQkFBQSxPQUFBLEVBQU8sb0NBQVA7aUJBQUwsQ0FBQSxDQURGO2VBQUEsTUFBQTtBQUdFLGdCQUFBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxrQkFBQSxPQUFBLEVBQU8sNkJBQVA7aUJBQUwsQ0FBQSxDQUhGO2VBQUE7QUFJQSxjQUFBLElBQUcsSUFBQSxLQUFRLE1BQVIsSUFBbUIsQ0FBQSxPQUF0Qjt1QkFDRSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsa0JBQUEsT0FBQSxFQUFPLG1DQUFQO2lCQUFMLEVBREY7ZUFBQSxNQUFBO3VCQUdFLEtBQUMsQ0FB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

//# sourceURL=/Users/ah/.atom/packages/todo-show/lib/todo-item-view.coffee
