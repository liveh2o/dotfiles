(function() {
  var $, CompositeDisposable, ShowTodoView, TableHeaderView, TodoEmptyView, TodoView, View, ref, ref1,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  CompositeDisposable = require('atom').CompositeDisposable;

  ref = require('atom-space-pen-views'), View = ref.View, $ = ref.$;

  ref1 = require('./todo-item-view'), TableHeaderView = ref1.TableHeaderView, TodoView = ref1.TodoView, TodoEmptyView = ref1.TodoEmptyView;

  module.exports = ShowTodoView = (function(superClass) {
    extend(ShowTodoView, superClass);

    function ShowTodoView() {
      this.renderTable = bind(this.renderTable, this);
      this.clearTodos = bind(this.clearTodos, this);
      this.renderTodo = bind(this.renderTodo, this);
      this.tableHeaderClicked = bind(this.tableHeaderClicked, this);
      this.initTable = bind(this.initTable, this);
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
        return function(arg) {
          var newValue, oldValue;
          newValue = arg.newValue, oldValue = arg.oldValue;
          _this.showInTable = newValue;
          return _this.renderTable(_this.collection.getTodos());
        };
      })(this)));
      this.disposables.add(atom.config.onDidChange('todo-show.sortBy', (function(_this) {
        return function(arg) {
          var newValue, oldValue;
          newValue = arg.newValue, oldValue = arg.oldValue;
          return _this.sort(_this.sortBy = newValue, _this.sortAsc);
        };
      })(this)));
      return this.disposables.add(atom.config.onDidChange('todo-show.sortAscending', (function(_this) {
        return function(arg) {
          var newValue, oldValue;
          newValue = arg.newValue, oldValue = arg.oldValue;
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
      sortAsc = this.sortBy === item ? !this.sortAsc : this.sortAsc;
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
      var i, len, ref2, todo;
      this.clearTodos();
      this.renderTableHeader();
      ref2 = todos = todos;
      for (i = 0, len = ref2.length; i < len; i++) {
        todo = ref2[i];
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RvZG8tc2hvdy9saWIvdG9kby10YWJsZS12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsK0ZBQUE7SUFBQTs7OztFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUjs7RUFDeEIsTUFBWSxPQUFBLENBQVEsc0JBQVIsQ0FBWixFQUFDLGVBQUQsRUFBTzs7RUFFUCxPQUE2QyxPQUFBLENBQVEsa0JBQVIsQ0FBN0MsRUFBQyxzQ0FBRCxFQUFrQix3QkFBbEIsRUFBNEI7O0VBRTVCLE1BQU0sQ0FBQyxPQUFQLEdBQ007Ozs7Ozs7Ozs7OztJQUNKLFlBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7UUFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLFlBQVA7UUFBcUIsUUFBQSxFQUFVLENBQUMsQ0FBaEM7T0FBTCxFQUF3QyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQ3RDLEtBQUMsQ0FBQSxLQUFELENBQU87WUFBQSxNQUFBLEVBQVEsT0FBUjtXQUFQO1FBRHNDO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF4QztJQURROzsyQkFJVixVQUFBLEdBQVksU0FBQyxVQUFEO01BQUMsSUFBQyxDQUFBLGFBQUQ7TUFDWCxJQUFDLENBQUEsV0FBRCxHQUFlLElBQUk7TUFDbkIsSUFBQyxDQUFBLG1CQUFELENBQUE7YUFDQSxJQUFDLENBQUEsWUFBRCxDQUFBO0lBSFU7OzJCQUtaLFlBQUEsR0FBYyxTQUFBO01BRVosSUFBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCLElBQUMsQ0FBQSxVQUFVLENBQUMsaUJBQVosQ0FBOEIsSUFBQyxDQUFBLFNBQS9CLENBQWpCO01BQ0EsSUFBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCLElBQUMsQ0FBQSxVQUFVLENBQUMsZUFBWixDQUE0QixJQUFDLENBQUEsVUFBN0IsQ0FBakI7TUFDQSxJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsSUFBQyxDQUFBLFVBQVUsQ0FBQyxVQUFaLENBQXVCLElBQUMsQ0FBQSxVQUF4QixDQUFqQjtNQUNBLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQixJQUFDLENBQUEsVUFBVSxDQUFDLGNBQVosQ0FBMkIsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLEtBQUQ7aUJBQVcsS0FBQyxDQUFBLFdBQUQsQ0FBYSxLQUFiO1FBQVg7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTNCLENBQWpCO01BQ0EsSUFBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCLElBQUMsQ0FBQSxVQUFVLENBQUMsZ0JBQVosQ0FBNkIsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLEtBQUQ7aUJBQVcsS0FBQyxDQUFBLFdBQUQsQ0FBYSxLQUFiO1FBQVg7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTdCLENBQWpCO2FBRUEsSUFBQyxDQUFBLEVBQUQsQ0FBSSxPQUFKLEVBQWEsSUFBYixFQUFtQixJQUFDLENBQUEsa0JBQXBCO0lBUlk7OzJCQVVkLG1CQUFBLEdBQXFCLFNBQUE7TUFDbkIsSUFBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBWixDQUF3Qix1QkFBeEIsRUFBaUQsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLEdBQUQ7QUFDaEUsY0FBQTtVQURrRSx5QkFBVTtVQUM1RSxLQUFDLENBQUEsV0FBRCxHQUFlO2lCQUNmLEtBQUMsQ0FBQSxXQUFELENBQWEsS0FBQyxDQUFBLFVBQVUsQ0FBQyxRQUFaLENBQUEsQ0FBYjtRQUZnRTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBakQsQ0FBakI7TUFJQSxJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFaLENBQXdCLGtCQUF4QixFQUE0QyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsR0FBRDtBQUMzRCxjQUFBO1VBRDZELHlCQUFVO2lCQUN2RSxLQUFDLENBQUEsSUFBRCxDQUFNLEtBQUMsQ0FBQSxNQUFELEdBQVUsUUFBaEIsRUFBMEIsS0FBQyxDQUFBLE9BQTNCO1FBRDJEO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE1QyxDQUFqQjthQUdBLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQixJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVosQ0FBd0IseUJBQXhCLEVBQW1ELENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxHQUFEO0FBQ2xFLGNBQUE7VUFEb0UseUJBQVU7aUJBQzlFLEtBQUMsQ0FBQSxJQUFELENBQU0sS0FBQyxDQUFBLE1BQVAsRUFBZSxLQUFDLENBQUEsT0FBRCxHQUFXLFFBQTFCO1FBRGtFO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFuRCxDQUFqQjtJQVJtQjs7MkJBV3JCLE9BQUEsR0FBUyxTQUFBO01BQ1AsSUFBQyxDQUFBLFdBQVcsQ0FBQyxPQUFiLENBQUE7YUFDQSxJQUFDLENBQUEsS0FBRCxDQUFBO0lBRk87OzJCQUlULFNBQUEsR0FBVyxTQUFBO01BQ1QsSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsdUJBQWhCO01BQ2YsSUFBQyxDQUFBLE1BQUQsR0FBVSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isa0JBQWhCO01BQ1YsSUFBQyxDQUFBLE9BQUQsR0FBVyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IseUJBQWhCO2FBQ1gsSUFBQyxDQUFBLElBQUQsQ0FBTSxJQUFDLENBQUEsTUFBUCxFQUFlLElBQUMsQ0FBQSxPQUFoQjtJQUpTOzsyQkFNWCxpQkFBQSxHQUFtQixTQUFBO2FBQ2pCLElBQUMsQ0FBQSxLQUFLLENBQUMsTUFBUCxDQUFrQixJQUFBLGVBQUEsQ0FBZ0IsSUFBQyxDQUFBLFdBQWpCLEVBQThCO1FBQUUsUUFBRCxJQUFDLENBQUEsTUFBRjtRQUFXLFNBQUQsSUFBQyxDQUFBLE9BQVg7T0FBOUIsQ0FBbEI7SUFEaUI7OzJCQUduQixrQkFBQSxHQUFvQixTQUFDLENBQUQ7QUFDbEIsVUFBQTtNQUFBLElBQUEsR0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDO01BQ2hCLE9BQUEsR0FBYSxJQUFDLENBQUEsTUFBRCxLQUFXLElBQWQsR0FBd0IsQ0FBQyxJQUFDLENBQUEsT0FBMUIsR0FBdUMsSUFBQyxDQUFBO01BRWxELElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixrQkFBaEIsRUFBb0MsSUFBcEM7YUFDQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IseUJBQWhCLEVBQTJDLE9BQTNDO0lBTGtCOzsyQkFPcEIsVUFBQSxHQUFZLFNBQUMsSUFBRDthQUNWLElBQUMsQ0FBQSxLQUFLLENBQUMsTUFBUCxDQUFrQixJQUFBLFFBQUEsQ0FBUyxJQUFDLENBQUEsV0FBVixFQUF1QixJQUF2QixDQUFsQjtJQURVOzsyQkFHWixVQUFBLEdBQVksU0FBQyxJQUFEO2FBQ1YsT0FBTyxDQUFDLEdBQVIsQ0FBWSxZQUFaO0lBRFU7OzJCQUdaLFVBQUEsR0FBWSxTQUFBO2FBQ1YsSUFBQyxDQUFBLEtBQUssQ0FBQyxLQUFQLENBQUE7SUFEVTs7MkJBR1osV0FBQSxHQUFhLFNBQUMsS0FBRDtBQUNYLFVBQUE7TUFBQSxJQUFDLENBQUEsVUFBRCxDQUFBO01BQ0EsSUFBQyxDQUFBLGlCQUFELENBQUE7QUFFQTtBQUFBLFdBQUEsc0NBQUE7O1FBQ0UsSUFBQyxDQUFBLFVBQUQsQ0FBWSxJQUFaO0FBREY7TUFFQSxJQUFBLENBQXFELEtBQUssQ0FBQyxNQUEzRDtlQUFBLElBQUMsQ0FBQSxLQUFLLENBQUMsTUFBUCxDQUFrQixJQUFBLGFBQUEsQ0FBYyxJQUFDLENBQUEsV0FBZixDQUFsQixFQUFBOztJQU5XOzsyQkFRYixJQUFBLEdBQU0sU0FBQyxNQUFELEVBQVMsT0FBVDthQUNKLElBQUMsQ0FBQSxVQUFVLENBQUMsU0FBWixDQUFzQjtRQUFBLE1BQUEsRUFBUSxNQUFSO1FBQWdCLE9BQUEsRUFBUyxPQUF6QjtPQUF0QjtJQURJOzs7O0tBcEVtQjtBQU4zQiIsInNvdXJjZXNDb250ZW50IjpbIntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG57VmlldywgJH0gPSByZXF1aXJlICdhdG9tLXNwYWNlLXBlbi12aWV3cydcblxue1RhYmxlSGVhZGVyVmlldywgVG9kb1ZpZXcsIFRvZG9FbXB0eVZpZXd9ID0gcmVxdWlyZSAnLi90b2RvLWl0ZW0tdmlldydcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgU2hvd1RvZG9WaWV3IGV4dGVuZHMgVmlld1xuICBAY29udGVudDogLT5cbiAgICBAZGl2IGNsYXNzOiAndG9kby10YWJsZScsIHRhYmluZGV4OiAtMSwgPT5cbiAgICAgIEB0YWJsZSBvdXRsZXQ6ICd0YWJsZSdcblxuICBpbml0aWFsaXplOiAoQGNvbGxlY3Rpb24pIC0+XG4gICAgQGRpc3Bvc2FibGVzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICBAaGFuZGxlQ29uZmlnQ2hhbmdlcygpXG4gICAgQGhhbmRsZUV2ZW50cygpXG5cbiAgaGFuZGxlRXZlbnRzOiAtPlxuICAgICMgQGRpc3Bvc2FibGVzLmFkZCBAY29sbGVjdGlvbi5vbkRpZEFkZFRvZG8gQHJlbmRlclRvZG9cbiAgICBAZGlzcG9zYWJsZXMuYWRkIEBjb2xsZWN0aW9uLm9uRGlkRmluaXNoU2VhcmNoIEBpbml0VGFibGVcbiAgICBAZGlzcG9zYWJsZXMuYWRkIEBjb2xsZWN0aW9uLm9uRGlkUmVtb3ZlVG9kbyBAcmVtb3ZlVG9kb1xuICAgIEBkaXNwb3NhYmxlcy5hZGQgQGNvbGxlY3Rpb24ub25EaWRDbGVhciBAY2xlYXJUb2Rvc1xuICAgIEBkaXNwb3NhYmxlcy5hZGQgQGNvbGxlY3Rpb24ub25EaWRTb3J0VG9kb3MgKHRvZG9zKSA9PiBAcmVuZGVyVGFibGUgdG9kb3NcbiAgICBAZGlzcG9zYWJsZXMuYWRkIEBjb2xsZWN0aW9uLm9uRGlkRmlsdGVyVG9kb3MgKHRvZG9zKSA9PiBAcmVuZGVyVGFibGUgdG9kb3NcblxuICAgIEBvbiAnY2xpY2snLCAndGgnLCBAdGFibGVIZWFkZXJDbGlja2VkXG5cbiAgaGFuZGxlQ29uZmlnQ2hhbmdlczogLT5cbiAgICBAZGlzcG9zYWJsZXMuYWRkIGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlICd0b2RvLXNob3cuc2hvd0luVGFibGUnLCAoe25ld1ZhbHVlLCBvbGRWYWx1ZX0pID0+XG4gICAgICBAc2hvd0luVGFibGUgPSBuZXdWYWx1ZVxuICAgICAgQHJlbmRlclRhYmxlIEBjb2xsZWN0aW9uLmdldFRvZG9zKClcblxuICAgIEBkaXNwb3NhYmxlcy5hZGQgYXRvbS5jb25maWcub25EaWRDaGFuZ2UgJ3RvZG8tc2hvdy5zb3J0QnknLCAoe25ld1ZhbHVlLCBvbGRWYWx1ZX0pID0+XG4gICAgICBAc29ydChAc29ydEJ5ID0gbmV3VmFsdWUsIEBzb3J0QXNjKVxuXG4gICAgQGRpc3Bvc2FibGVzLmFkZCBhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSAndG9kby1zaG93LnNvcnRBc2NlbmRpbmcnLCAoe25ld1ZhbHVlLCBvbGRWYWx1ZX0pID0+XG4gICAgICBAc29ydChAc29ydEJ5LCBAc29ydEFzYyA9IG5ld1ZhbHVlKVxuXG4gIGRlc3Ryb3k6IC0+XG4gICAgQGRpc3Bvc2FibGVzLmRpc3Bvc2UoKVxuICAgIEBlbXB0eSgpXG5cbiAgaW5pdFRhYmxlOiA9PlxuICAgIEBzaG93SW5UYWJsZSA9IGF0b20uY29uZmlnLmdldCgndG9kby1zaG93LnNob3dJblRhYmxlJylcbiAgICBAc29ydEJ5ID0gYXRvbS5jb25maWcuZ2V0KCd0b2RvLXNob3cuc29ydEJ5JylcbiAgICBAc29ydEFzYyA9IGF0b20uY29uZmlnLmdldCgndG9kby1zaG93LnNvcnRBc2NlbmRpbmcnKVxuICAgIEBzb3J0KEBzb3J0QnksIEBzb3J0QXNjKVxuXG4gIHJlbmRlclRhYmxlSGVhZGVyOiAtPlxuICAgIEB0YWJsZS5hcHBlbmQgbmV3IFRhYmxlSGVhZGVyVmlldyhAc2hvd0luVGFibGUsIHtAc29ydEJ5LCBAc29ydEFzY30pXG5cbiAgdGFibGVIZWFkZXJDbGlja2VkOiAoZSkgPT5cbiAgICBpdGVtID0gZS50YXJnZXQuaW5uZXJUZXh0XG4gICAgc29ydEFzYyA9IGlmIEBzb3J0QnkgaXMgaXRlbSB0aGVuICFAc29ydEFzYyBlbHNlIEBzb3J0QXNjXG5cbiAgICBhdG9tLmNvbmZpZy5zZXQoJ3RvZG8tc2hvdy5zb3J0QnknLCBpdGVtKVxuICAgIGF0b20uY29uZmlnLnNldCgndG9kby1zaG93LnNvcnRBc2NlbmRpbmcnLCBzb3J0QXNjKVxuXG4gIHJlbmRlclRvZG86ICh0b2RvKSA9PlxuICAgIEB0YWJsZS5hcHBlbmQgbmV3IFRvZG9WaWV3KEBzaG93SW5UYWJsZSwgdG9kbylcblxuICByZW1vdmVUb2RvOiAodG9kbykgLT5cbiAgICBjb25zb2xlLmxvZyAncmVtb3ZlVG9kbydcblxuICBjbGVhclRvZG9zOiA9PlxuICAgIEB0YWJsZS5lbXB0eSgpXG5cbiAgcmVuZGVyVGFibGU6ICh0b2RvcykgPT5cbiAgICBAY2xlYXJUb2RvcygpXG4gICAgQHJlbmRlclRhYmxlSGVhZGVyKClcblxuICAgIGZvciB0b2RvIGluIHRvZG9zID0gdG9kb3NcbiAgICAgIEByZW5kZXJUb2RvKHRvZG8pXG4gICAgQHRhYmxlLmFwcGVuZCBuZXcgVG9kb0VtcHR5VmlldyhAc2hvd0luVGFibGUpIHVubGVzcyB0b2Rvcy5sZW5ndGhcblxuICBzb3J0OiAoc29ydEJ5LCBzb3J0QXNjKSAtPlxuICAgIEBjb2xsZWN0aW9uLnNvcnRUb2Rvcyhzb3J0Qnk6IHNvcnRCeSwgc29ydEFzYzogc29ydEFzYylcbiJdfQ==
