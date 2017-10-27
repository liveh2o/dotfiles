(function() {
  var ShowTodoView, TodosModel, path;

  path = require('path');

  ShowTodoView = require('../lib/show-todo-view');

  TodosModel = require('../lib/todos-model');

  describe("Show Todo View", function() {
    var model, showTodoView, _ref;
    _ref = [], showTodoView = _ref[0], model = _ref[1];
    beforeEach(function() {
      var uri;
      model = new TodosModel;
      uri = 'atom://todo-show/todos';
      showTodoView = new ShowTodoView(model, uri);
      return atom.project.setPaths([path.join(__dirname, 'fixtures/sample1')]);
    });
    return describe("Basic view properties", function() {
      return it("has a title, uri, etc.", function() {
        expect(showTodoView.getTitle()).toEqual('Todo-Show Results');
        expect(showTodoView.getIconName()).toEqual('checklist');
        expect(showTodoView.getURI()).toEqual('atom://todo-show/todos');
        return expect(showTodoView.find('.btn-group')).toExist();
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RvZG8tc2hvdy9zcGVjL3Nob3ctdG9kby12aWV3LXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDhCQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUVBLFlBQUEsR0FBZSxPQUFBLENBQVEsdUJBQVIsQ0FGZixDQUFBOztBQUFBLEVBR0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxvQkFBUixDQUhiLENBQUE7O0FBQUEsRUFLQSxRQUFBLENBQVMsZ0JBQVQsRUFBMkIsU0FBQSxHQUFBO0FBQ3pCLFFBQUEseUJBQUE7QUFBQSxJQUFBLE9BQXdCLEVBQXhCLEVBQUMsc0JBQUQsRUFBZSxlQUFmLENBQUE7QUFBQSxJQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxVQUFBLEdBQUE7QUFBQSxNQUFBLEtBQUEsR0FBUSxHQUFBLENBQUEsVUFBUixDQUFBO0FBQUEsTUFDQSxHQUFBLEdBQU0sd0JBRE4sQ0FBQTtBQUFBLE1BRUEsWUFBQSxHQUFtQixJQUFBLFlBQUEsQ0FBYSxLQUFiLEVBQW9CLEdBQXBCLENBRm5CLENBQUE7YUFHQSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBc0IsQ0FBQyxJQUFJLENBQUMsSUFBTCxDQUFVLFNBQVYsRUFBcUIsa0JBQXJCLENBQUQsQ0FBdEIsRUFKUztJQUFBLENBQVgsQ0FGQSxDQUFBO1dBUUEsUUFBQSxDQUFTLHVCQUFULEVBQWtDLFNBQUEsR0FBQTthQUNoQyxFQUFBLENBQUcsd0JBQUgsRUFBNkIsU0FBQSxHQUFBO0FBQzNCLFFBQUEsTUFBQSxDQUFPLFlBQVksQ0FBQyxRQUFiLENBQUEsQ0FBUCxDQUErQixDQUFDLE9BQWhDLENBQXdDLG1CQUF4QyxDQUFBLENBQUE7QUFBQSxRQUNBLE1BQUEsQ0FBTyxZQUFZLENBQUMsV0FBYixDQUFBLENBQVAsQ0FBa0MsQ0FBQyxPQUFuQyxDQUEyQyxXQUEzQyxDQURBLENBQUE7QUFBQSxRQUVBLE1BQUEsQ0FBTyxZQUFZLENBQUMsTUFBYixDQUFBLENBQVAsQ0FBNkIsQ0FBQyxPQUE5QixDQUFzQyx3QkFBdEMsQ0FGQSxDQUFBO2VBR0EsTUFBQSxDQUFPLFlBQVksQ0FBQyxJQUFiLENBQWtCLFlBQWxCLENBQVAsQ0FBdUMsQ0FBQyxPQUF4QyxDQUFBLEVBSjJCO01BQUEsQ0FBN0IsRUFEZ0M7SUFBQSxDQUFsQyxFQVR5QjtFQUFBLENBQTNCLENBTEEsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/ah/.atom/packages/todo-show/spec/show-todo-view-spec.coffee
