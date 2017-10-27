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
            outlet: 'table'
          });
        };
      })(this));
    };

    ShowTodoView.prototype.initialize = function(collection) {
      this.collection = collection;
      this.disposables = new CompositeDisposable;
      this.handleConfigChanges();
      return this.handleEvents();
    };

    ShowTodoView.prototype.handleEvents = function() {
      this.disposables.add(this.collection.onDidFinishSearch(this.initTable));
      this.disposables.add(this.collection.onDidRemoveTodo(this.removeTodo));
      this.disposables.add(this.collection.onDidClear(this.clearTodos));
      this.disposables.add(this.collection.onDidSortTodos((function(_this) {
        return function(todos) {
          return _this.renderTable(todos);
        };
      })(this)));
      this.disposables.add(this.collection.onDidFilterTodos((function(_this) {
        return function(todos) {
          return _this.renderTable(todos);
        };
      })(this)));
      return this.on('click', 'th', this.tableHeaderClicked);
    };

    ShowTodoView.prototype.handleConfigChanges = function() {
      this.disposables.add(atom.config.onDidChange('todo-show.showInTable', (function(_this) {
        return function(_arg) {
          var newValue, oldValue;
          newValue = _arg.newValue, oldValue = _arg.oldValue;
          _this.showInTable = newValue;
          return _this.renderTable(_this.collection.getTodos());
        };
      })(this)));
      this.disposables.add(atom.config.onDidChange('todo-show.sortBy', (function(_this) {
        return function(_arg) {
          var newValue, oldValue;
          newValue = _arg.newValue, oldValue = _arg.oldValue;
          return _this.sort(_this.sortBy = newValue, _this.sortAsc);
        };
      })(this)));
      return this.disposables.add(atom.config.onDidChange('todo-show.sortAscending', (function(_this) {
        return function(_arg) {
          var newValue, oldValue;
          newValue = _arg.newValue, oldValue = _arg.oldValue;
          return _this.sort(_this.sortBy, _this.sortAsc = newValue);
        };
      })(this)));
    };

    ShowTodoView.prototype.destroy = function() {
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

    ShowTodoView.prototype.renderTable = function(todos) {
      var todo, _i, _len, _ref2;
      this.clearTodos();
      this.renderTableHeader();
      _ref2 = todos = todos;
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        todo = _ref2[_i];
        this.renderTodo(todo);
      }
      if (!todos.length) {
        return this.table.append(new TodoEmptyView(this.showInTable));
      }
    };

    ShowTodoView.prototype.sort = function(sortBy, sortAsc) {
      return this.collection.sortTodos({
        sortBy: sortBy,
        sortAsc: sortAsc
      });
    };

    return ShowTodoView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RvZG8tc2hvdy9saWIvdG9kby10YWJsZS12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxpR0FBQTtJQUFBOzttU0FBQTs7QUFBQSxFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFBRCxDQUFBOztBQUFBLEVBQ0EsT0FBWSxPQUFBLENBQVEsc0JBQVIsQ0FBWixFQUFDLFlBQUEsSUFBRCxFQUFPLFNBQUEsQ0FEUCxDQUFBOztBQUFBLEVBR0EsUUFBNkMsT0FBQSxDQUFRLGtCQUFSLENBQTdDLEVBQUMsd0JBQUEsZUFBRCxFQUFrQixpQkFBQSxRQUFsQixFQUE0QixzQkFBQSxhQUg1QixDQUFBOztBQUFBLEVBS0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLG1DQUFBLENBQUE7Ozs7Ozs7OztLQUFBOztBQUFBLElBQUEsWUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sWUFBUDtBQUFBLFFBQXFCLFFBQUEsRUFBVSxDQUFBLENBQS9CO09BQUwsRUFBd0MsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDdEMsS0FBQyxDQUFBLEtBQUQsQ0FBTztBQUFBLFlBQUEsTUFBQSxFQUFRLE9BQVI7V0FBUCxFQURzQztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXhDLEVBRFE7SUFBQSxDQUFWLENBQUE7O0FBQUEsMkJBSUEsVUFBQSxHQUFZLFNBQUUsVUFBRixHQUFBO0FBQ1YsTUFEVyxJQUFDLENBQUEsYUFBQSxVQUNaLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxXQUFELEdBQWUsR0FBQSxDQUFBLG1CQUFmLENBQUE7QUFB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

//# sourceURL=/Users/ah/.atom/packages/todo-show/lib/todo-table-view.coffee
