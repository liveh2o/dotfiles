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
      this.disposables.add(this.collection.onDidChangeSearchScope((function(_this) {
        return function() {
          return _this.collection.search();
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
