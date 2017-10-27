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
      return this.tr((function(_this) {
        return function() {
          var item, _i, _len, _results;
          _results = [];
          for (_i = 0, _len = showInTable.length; _i < _len; _i++) {
            item = showInTable[_i];
            _results.push(_this.td(function() {
              switch (item) {
                case 'All':
                  return _this.span(todo.lineText);
                case 'Text':
                  return _this.span(todo.matchText);
                case 'Type':
                  return _this.i(todo.title);
                case 'Range':
                  return _this.i(todo.rangeString);
                case 'Line':
                  return _this.i(todo.line);
                case 'Regex':
                  return _this.code(todo.regex);
                case 'File':
                  return _this.a(todo.relativePath);
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
          position = [todo.range[0][0], todo.range[0][1]];
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RvZG8tc2hvdy9saWIvdG9kby1pdGVtLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDhDQUFBO0lBQUE7O3NGQUFBOztBQUFBLEVBQUMsT0FBUSxPQUFBLENBQVEsc0JBQVIsRUFBUixJQUFELENBQUE7O0FBQUEsRUFFTTtBQUNKLHNDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLGVBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQyxXQUFELEVBQWMsSUFBZCxHQUFBO0FBQ1IsVUFBQSxlQUFBO0FBQUEsTUFEdUIsY0FBQSxRQUFRLGVBQUEsT0FDL0IsQ0FBQTthQUFBLElBQUMsQ0FBQSxFQUFELENBQUksQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUNGLGNBQUEsd0JBQUE7QUFBQTtlQUFBLGtEQUFBO21DQUFBO0FBQ0UsMEJBQUEsS0FBQyxDQUFBLEVBQUQsQ0FBSSxJQUFKLEVBQVUsU0FBQSxHQUFBO0FBQ1IsY0FBQSxJQUFHLElBQUEsS0FBUSxNQUFSLElBQW1CLE9BQXRCO0FBQ0UsZ0JBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLGtCQUFBLE9BQUEsRUFBTyxvQ0FBUDtpQkFBTCxDQUFBLENBREY7ZUFBQSxNQUFBO0FBR0UsZ0JBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLGtCQUFBLE9BQUEsRUFBTyw2QkFBUDtpQkFBTCxDQUFBLENBSEY7ZUFBQTtBQUlBLGNBQUEsSUFBRyxJQUFBLEtBQVEsTUFBUixJQUFtQixDQUFBLE9BQXRCO3VCQUNFLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxrQkFBQSxPQUFBLEVBQU8sbUNBQVA7aUJBQUwsRUFERjtlQUFBLE1BQUE7dUJBR0UsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLGtC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

//# sourceURL=/Users/ah/.atom/packages/todo-show/lib/todo-item-view.coffee
