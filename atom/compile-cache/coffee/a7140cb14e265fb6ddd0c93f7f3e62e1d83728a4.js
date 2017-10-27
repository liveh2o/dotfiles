(function() {
  var $, CompositeDisposable, ShowTodoView, TableHeaderView, TodoEmptyView, TodoView, View, _ref, _ref1,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CompositeDisposable = require('atom').CompositeDisposable;

  _ref = require('atom-space-pen-views'), View = _ref.View, $ = _ref.$;

  _ref1 = require('./todo-item-view'), TableHeaderView = _ref1.TableHeaderView, TodoView = _ref1.TodoView, TodoEmptyView = _ref1.TodoEmptyView;

  module.exports = ShowTodoView = (function(_super) {
    __extends(ShowTodoView, _super);

    function ShowTodoView() {
      this.renderTable = __bind(this.renderTable, this);
      this.clearTodos = __bind(this.clearTodos, this);
      this.renderTodo = __bind(this.renderTodo, this);
      this.tableHeaderClicked = __bind(this.tableHeaderClicked, this);
      this.initTable = __bind(this.initTable, this);
      return ShowTodoView.__super__.constructor.apply(this, arguments);
    }

    ShowTodoView.content = function() {
      return this.div({
        "class": 'todo-table',
        tabindex: -1
      }, (function(_this) {
        return function() {
          return _this.table({
            outlet: 'table',
            "class": 'todo-table'
          });
        };
      })(this));
    };

    ShowTodoView.prototype.initialize = function(model) {
      this.model = model;
      this.disposables = new CompositeDisposable;
      this.disposables.add(atom.config.onDidChange('todo-show.showInTable', (function(_this) {
        return function(_arg) {
          var newValue, oldValue;
          newValue = _arg.newValue, oldValue = _arg.oldValue;
          _this.showInTable = newValue;
          return _this.renderTable();
        };
      })(this)));
      this.disposables.add(atom.config.onDidChange('todo-show.sortBy', (function(_this) {
        return function(_arg) {
          var newValue, oldValue;
          newValue = _arg.newValue, oldValue = _arg.oldValue;
          return _this.sort(_this.sortBy = newValue, _this.sortAsc);
        };
      })(this)));
      this.disposables.add(atom.config.onDidChange('todo-show.sortAscending', (function(_this) {
        return function(_arg) {
          var newValue, oldValue;
          newValue = _arg.newValue, oldValue = _arg.oldValue;
          return _this.sort(_this.sortBy, _this.sortAsc = newValue);
        };
      })(this)));
      return this.handleEvents();
    };

    ShowTodoView.prototype.handleEvents = function() {
      this.disposables.add(this.model.onDidFinishSearch(this.initTable));
      this.disposables.add(this.model.onDidRemoveTodo(this.removeTodo));
      this.disposables.add(this.model.onDidClear(this.clearTodos));
      this.disposables.add(this.model.onDidSortTodos(this.renderTable));
      this.disposables.add(this.model.onDidChangeSearchScope((function(_this) {
        return function() {
          return _this.model.search();
        };
      })(this)));
      return this.on('click', 'th', this.tableHeaderClicked);
    };

    ShowTodoView.prototype.detached = function() {
      this.disposables.dispose();
      return this.empty();
    };

    ShowTodoView.prototype.initTable = function() {
      this.showInTable = atom.config.get('todo-show.showInTable');
      this.sortBy = atom.config.get('todo-show.sortBy');
      this.sortAsc = atom.config.get('todo-show.sortAscending');
      return this.sort(this.sortBy, this.sortAsc);
    };

    ShowTodoView.prototype.renderTableHeader = function() {
      return this.table.append(new TableHeaderView(this.showInTable, {
        sortBy: this.sortBy,
        sortAsc: this.sortAsc
      }));
    };

    ShowTodoView.prototype.tableHeaderClicked = function(e) {
      var item, sortAsc;
      item = e.target.innerText;
      sortAsc = this.sortBy === item ? !this.sortAsc : true;
      atom.config.set('todo-show.sortBy', item);
      return atom.config.set('todo-show.sortAscending', sortAsc);
    };

    ShowTodoView.prototype.renderTodo = function(todo) {
      return this.table.append(new TodoView(this.showInTable, todo));
    };

    ShowTodoView.prototype.removeTodo = function(todo) {
      return console.log('removeTodo');
    };

    ShowTodoView.prototype.clearTodos = function() {
      return this.table.empty();
    };

    ShowTodoView.prototype.renderTable = function() {
      var todo, todos, _i, _len, _ref2;
      this.clearTodos();
      this.renderTableHeader();
      _ref2 = todos = this.model.getTodos();
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        todo = _ref2[_i];
        this.renderTodo(todo);
      }
      if (!todos.length) {
        return this.table.append(new TodoEmptyView(this.showInTable));
      }
    };

    ShowTodoView.prototype.sort = function(sortBy, sortAsc) {
      return this.model.sortTodos({
        sortBy: sortBy,
        sortAsc: sortAsc
      });
    };

    return ShowTodoView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RvZG8tc2hvdy9saWIvc2hvdy10b2RvLXRhYmxlLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlHQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFDQSxPQUFZLE9BQUEsQ0FBUSxzQkFBUixDQUFaLEVBQUMsWUFBQSxJQUFELEVBQU8sU0FBQSxDQURQLENBQUE7O0FBQUEsRUFHQSxRQUE2QyxPQUFBLENBQVEsa0JBQVIsQ0FBN0MsRUFBQyx3QkFBQSxlQUFELEVBQWtCLGlCQUFBLFFBQWxCLEVBQTRCLHNCQUFBLGFBSDVCLENBQUE7O0FBQUEsRUFLQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osbUNBQUEsQ0FBQTs7Ozs7Ozs7O0tBQUE7O0FBQUEsSUFBQSxZQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE9BQUEsRUFBTyxZQUFQO0FBQUEsUUFBcUIsUUFBQSxFQUFVLENBQUEsQ0FBL0I7T0FBTCxFQUF3QyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUN0QyxLQUFDLENBQUEsS0FBRCxDQUFPO0FBQUEsWUFBQSxNQUFBLEVBQVEsT0FBUjtBQUFBLFlBQWlCLE9BQUEsRUFBTyxZQUF4QjtXQUFQLEVBRHNDO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBeEMsRUFEUTtJQUFBLENBQVYsQ0FBQTs7QUFBQSwyQkFJQSxVQUFBLEdBQVksU0FBRSxLQUFGLEdBQUE7QUFDVixNQURXLElBQUMsQ0FBQSxRQUFBLEtBQ1osQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLFdB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

//# sourceURL=/Users/ah/.atom/packages/todo-show/lib/show-todo-table-view.coffee
