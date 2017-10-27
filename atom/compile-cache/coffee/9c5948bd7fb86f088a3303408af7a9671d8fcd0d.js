(function() {
  var TodosMarkdown;

  module.exports = TodosMarkdown = (function() {
    function TodosMarkdown() {
      this.showInTable = atom.config.get('todo-show.showInTable');
    }

    TodosMarkdown.prototype.getTable = function(todos) {
      var key, md, out, todo;
      md = "| " + (((function() {
        var _i, _len, _ref, _results;
        _ref = this.showInTable;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          key = _ref[_i];
          _results.push(key);
        }
        return _results;
      }).call(this)).join(' | ')) + " |\n";
      md += "|" + (Array(md.length - 2).join('-')) + "|\n";
      return md + ((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = todos.length; _i < _len; _i++) {
          todo = todos[_i];
          out = '|' + todo.getMarkdownArray(this.showInTable).join(' |');
          _results.push("" + out + " |\n");
        }
        return _results;
      }).call(this)).join('');
    };

    TodosMarkdown.prototype.getList = function(todos) {
      var out, todo;
      return ((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = todos.length; _i < _len; _i++) {
          todo = todos[_i];
          out = '-' + todo.getMarkdownArray(this.showInTable).join('');
          if (out === '-') {
            out = "- No details";
          }
          _results.push("" + out + "\n");
        }
        return _results;
      }).call(this)).join('');
    };

    TodosMarkdown.prototype.markdown = function(todos) {
      if (atom.config.get('todo-show.saveOutputAs') === 'Table') {
        return this.getTable(todos);
      } else {
        return this.getList(todos);
      }
    };

    return TodosMarkdown;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RvZG8tc2hvdy9saWIvdG9kby1tYXJrZG93bi5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsYUFBQTs7QUFBQSxFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDUyxJQUFBLHVCQUFBLEdBQUE7QUFDWCxNQUFBLElBQUMsQ0FBQSxXQUFELEdBQWUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHVCQUFoQixDQUFmLENBRFc7SUFBQSxDQUFiOztBQUFBLDRCQUdBLFFBQUEsR0FBVSxTQUFDLEtBQUQsR0FBQTtBQUNSLFVBQUEsa0JBQUE7QUFBQSxNQUFBLEVBQUEsR0FBTyxJQUFBLEdBQUcsQ0FBQzs7QUFBQztBQUFBO2FBQUEsMkNBQUE7eUJBQUE7QUFBNkIsd0JBQUEsSUFBQSxDQUE3QjtBQUFBOzttQkFBRCxDQUFrQyxDQUFDLElBQW5DLENBQXdDLEtBQXhDLENBQUQsQ0FBSCxHQUFtRCxNQUExRCxDQUFBO0FBQUEsTUFDQSxFQUFBLElBQU8sR0FBQSxHQUFFLENBQUMsS0FBQSxDQUFNLEVBQUUsQ0FBQyxNQUFILEdBQVUsQ0FBaEIsQ0FBa0IsQ0FBQyxJQUFuQixDQUF3QixHQUF4QixDQUFELENBQUYsR0FBZ0MsS0FEdkMsQ0FBQTthQUVBLEVBQUEsR0FBSzs7QUFBQzthQUFBLDRDQUFBOzJCQUFBO0FBQ0osVUFBQSxHQUFBLEdBQU0sR0FBQSxHQUFNLElBQUksQ0FBQyxnQkFBTCxDQUFzQixJQUFDLENBQUEsV0FBdkIsQ0FBbUMsQ0FBQyxJQUFwQyxDQUF5QyxJQUF6QyxDQUFaLENBQUE7QUFBQSx3QkFDQSxFQUFBLEdBQUcsR0FBSCxHQUFPLE9BRFAsQ0FESTtBQUFBOzttQkFBRCxDQUdKLENBQUMsSUFIRyxDQUdFLEVBSEYsRUFIRztJQUFBLENBSFYsQ0FBQTs7QUFBQSw0QkFXQSxPQUFBLEdBQVMsU0FBQyxLQUFELEdBQUE7QUFDUCxVQUFBLFNBQUE7YUFBQTs7QUFBQzthQUFBLDRDQUFBOzJCQUFBO0FBQ0MsVUFBQSxHQUFBLEdBQU0sR0FBQSxHQUFNLElBQUksQ0FBQyxnQkFBTCxDQUFzQixJQUFDLENBQUEsV0FBdkIsQ0FBbUMsQ0FBQyxJQUFwQyxDQUF5QyxFQUF6QyxDQUFaLENBQUE7QUFDQSxVQUFBLElBQXdCLEdBQUEsS0FBTyxHQUEvQjtBQUFBLFlBQUEsR0FBQSxHQUFNLGNBQU4sQ0FBQTtXQURBO0FBQUEsd0JBRUEsRUFBQSxHQUFHLEdBQUgsR0FBTyxLQUZQLENBREQ7QUFBQTs7bUJBQUQsQ0FJQyxDQUFDLElBSkYsQ0FJTyxFQUpQLEVBRE87SUFBQSxDQVhULENBQUE7O0FBQUEsNEJBa0JBLFFBQUEsR0FBVSxTQUFDLEtBQUQsR0FBQTtBQUNSLE1BQUEsSUFBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isd0JBQWhCLENBQUEsS0FBNkMsT0FBaEQ7ZUFDRSxJQUFDLENBQUEsUUFBRCxDQUFVLEtBQVYsRUFERjtPQUFBLE1BQUE7ZUFHRSxJQUFDLENBQUEsT0FBRCxDQUFTLEtBQVQsRUFIRjtPQURRO0lBQUEsQ0FsQlYsQ0FBQTs7eUJBQUE7O01BRkYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/ah/.atom/packages/todo-show/lib/todo-markdown.coffee
