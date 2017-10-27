(function() {
  var ShowTodo, TodoRegex;

  TodoRegex = require('../lib/todo-regex');

  ShowTodo = require('../lib/show-todo');

  describe('Todo Regex', function() {
    var defaultRegexStr, defaultTodoList, _ref;
    _ref = [], defaultRegexStr = _ref[0], defaultTodoList = _ref[1];
    beforeEach(function() {
      defaultRegexStr = ShowTodo.config.findUsingRegex["default"];
      return defaultTodoList = ShowTodo.config.findTheseTodos["default"];
    });
    return describe('create regexp', function() {
      it('includes a regular expression', function() {
        var todoRegex;
        todoRegex = new TodoRegex(defaultRegexStr, defaultTodoList);
        expect(typeof todoRegex.regexp.test).toBe('function');
        expect(typeof todoRegex.regexp.exec).toBe('function');
        expect(todoRegex.regex).toBe(defaultRegexStr);
        return expect(todoRegex.error).toBe(false);
      });
      it('sets error on invalid input', function() {
        var todoRegex;
        todoRegex = new TodoRegex('arstastTODO:.+$)/g', defaultTodoList);
        expect(todoRegex.error).toBe(true);
        todoRegex = new TodoRegex(defaultRegexStr, 'a string');
        expect(todoRegex.error).toBe(true);
        todoRegex = new TodoRegex(defaultRegexStr, []);
        return expect(todoRegex.error).toBe(true);
      });
      return it('handles empty input', function() {
        var todoRegex;
        todoRegex = new TodoRegex();
        expect(todoRegex.error).toBe(true);
        todoRegex = new TodoRegex('', defaultTodoList);
        return expect(todoRegex.error).toBe(true);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RvZG8tc2hvdy9zcGVjL3RvZG8tcmVnZXgtc3BlYy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsbUJBQUE7O0FBQUEsRUFBQSxTQUFBLEdBQVksT0FBQSxDQUFRLG1CQUFSLENBQVosQ0FBQTs7QUFBQSxFQUNBLFFBQUEsR0FBVyxPQUFBLENBQVEsa0JBQVIsQ0FEWCxDQUFBOztBQUFBLEVBR0EsUUFBQSxDQUFTLFlBQVQsRUFBdUIsU0FBQSxHQUFBO0FBQ3JCLFFBQUEsc0NBQUE7QUFBQSxJQUFBLE9BQXFDLEVBQXJDLEVBQUMseUJBQUQsRUFBa0IseUJBQWxCLENBQUE7QUFBQSxJQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxNQUFBLGVBQUEsR0FBa0IsUUFBUSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsU0FBRCxDQUFoRCxDQUFBO2FBQ0EsZUFBQSxHQUFrQixRQUFRLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxTQUFELEVBRnZDO0lBQUEsQ0FBWCxDQUZBLENBQUE7V0FNQSxRQUFBLENBQVMsZUFBVCxFQUEwQixTQUFBLEdBQUE7QUFDeEIsTUFBQSxFQUFBLENBQUcsK0JBQUgsRUFBb0MsU0FBQSxHQUFBO0FBQ2xDLFlBQUEsU0FBQTtBQUFBLFFBQUEsU0FBQSxHQUFnQixJQUFBLFNBQUEsQ0FBVSxlQUFWLEVBQTJCLGVBQTNCLENBQWhCLENBQUE7QUFBQSxRQUNBLE1BQUEsQ0FBTyxNQUFBLENBQUEsU0FBZ0IsQ0FBQyxNQUFNLENBQUMsSUFBL0IsQ0FBb0MsQ0FBQyxJQUFyQyxDQUEwQyxVQUExQyxDQURBLENBQUE7QUFBQSxRQUVBLE1BQUEsQ0FBTyxNQUFBLENBQUEsU0FBZ0IsQ0FBQyxNQUFNLENBQUMsSUFBL0IsQ0FBb0MsQ0FBQyxJQUFyQyxDQUEwQyxVQUExQyxDQUZBLENBQUE7QUFBQSxRQUdBLE1BQUEsQ0FBTyxTQUFTLENBQUMsS0FBakIsQ0FBdUIsQ0FBQyxJQUF4QixDQUE2QixlQUE3QixDQUhBLENBQUE7ZUFJQSxNQUFBLENBQU8sU0FBUyxDQUFDLEtBQWpCLENBQXVCLENBQUMsSUFBeEIsQ0FBNkIsS0FBN0IsRUFMa0M7TUFBQSxDQUFwQyxDQUFBLENBQUE7QUFBQSxNQU9BLEVBQUEsQ0FBRyw2QkFBSCxFQUFrQyxTQUFBLEdBQUE7QUFDaEMsWUFBQSxTQUFBO0FBQUEsUUFBQSxTQUFBLEdBQWdCLElBQUEsU0FBQSxDQUFVLG9CQUFWLEVBQWdDLGVBQWhDLENBQWhCLENBQUE7QUFBQSxRQUNBLE1BQUEsQ0FBTyxTQUFTLENBQUMsS0FBakIsQ0FBdUIsQ0FBQyxJQUF4QixDQUE2QixJQUE3QixDQURBLENBQUE7QUFBQSxRQUdBLFNBQUEsR0FBZ0IsSUFBQSxTQUFBLENBQVUsZUFBVixFQUEyQixVQUEzQixDQUhoQixDQUFBO0FBQUEsUUFJQSxNQUFBLENBQU8sU0FBUyxDQUFDLEtBQWpCLENBQXVCLENBQUMsSUFBeEIsQ0FBNkIsSUFBN0IsQ0FKQSxDQUFBO0FBQUEsUUFNQSxTQUFBLEdBQWdCLElBQUEsU0FBQSxDQUFVLGVBQVYsRUFBMkIsRUFBM0IsQ0FOaEIsQ0FBQTtlQU9BLE1BQUEsQ0FBTyxTQUFTLENBQUMsS0FBakIsQ0FBdUIsQ0FBQyxJQUF4QixDQUE2QixJQUE3QixFQVJnQztNQUFBLENBQWxDLENBUEEsQ0FBQTthQWlCQSxFQUFBLENBQUcscUJBQUgsRUFBMEIsU0FBQSxHQUFBO0FBQ3hCLFlBQUEsU0FBQTtBQUFBLFFBQUEsU0FBQSxHQUFnQixJQUFBLFNBQUEsQ0FBQSxDQUFoQixDQUFBO0FBQUEsUUFDQSxNQUFBLENBQU8sU0FBUyxDQUFDLEtBQWpCLENBQXVCLENBQUMsSUFBeEIsQ0FBNkIsSUFBN0IsQ0FEQSxDQUFBO0FBQUEsUUFHQSxTQUFBLEdBQWdCLElBQUEsU0FBQSxDQUFVLEVBQVYsRUFBYyxlQUFkLENBSGhCLENBQUE7ZUFJQSxNQUFBLENBQU8sU0FBUyxDQUFDLEtBQWpCLENBQXVCLENBQUMsSUFBeEIsQ0FBNkIsSUFBN0IsRUFMd0I7TUFBQSxDQUExQixFQWxCd0I7SUFBQSxDQUExQixFQVBxQjtFQUFBLENBQXZCLENBSEEsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/ah/.atom/packages/todo-show/spec/todo-regex-spec.coffee
