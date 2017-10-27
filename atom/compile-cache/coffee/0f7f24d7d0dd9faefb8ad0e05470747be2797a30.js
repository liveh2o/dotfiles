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
                case 'Path':
                  return _this.a(todo.path);
                case 'File':
                  return _this.a(todo.file);
                case 'Tags':
                  return _this.i(todo.tags);
                case 'Id':
                  return _this.i(todo.id);
                case 'Project':
                  return _this.a(todo.project);
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
      var pending, position;
      if (!(this.todo && this.todo.loc)) {
        return;
      }
      position = [this.todo.position[0][0], this.todo.position[0][1]];
      pending = atom.config.get('core.allowPendingPaneItems') || false;
      return atom.workspace.open(this.todo.loc, {
        split: 'left',
        pending: pending
      }).then(function() {
        var textEditor;
        if (textEditor = atom.workspace.getActiveTextEditor()) {
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
