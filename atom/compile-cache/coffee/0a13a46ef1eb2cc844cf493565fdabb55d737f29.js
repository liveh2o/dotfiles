(function() {
  var TodosMarkdown;

  module.exports = TodosMarkdown = (function() {
    function TodosMarkdown() {
      this.showInTable = atom.config.get('todo-show.showInTable');
    }

    TodosMarkdown.prototype.getItemOutput = function(todo, key) {
      var item;
      if (item = todo[key.toLowerCase()]) {
        switch (key) {
          case 'All':
            return " " + item;
          case 'Text':
            return " " + item;
          case 'Type':
            return " __" + item + "__";
          case 'Range':
            return " _:" + item + "_";
          case 'Line':
            return " _:" + item + "_";
          case 'Regex':
            return " _'" + item + "'_";
          case 'File':
            return " [" + item + "](" + item + ")";
          case 'Tags':
            return " _" + item + "_";
        }
      }
    };

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
          out = '|' + ((function() {
            var _j, _len1, _ref, _results1;
            _ref = this.showInTable;
            _results1 = [];
            for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
              key = _ref[_j];
              _results1.push(this.getItemOutput(todo, key));
            }
            return _results1;
          }).call(this)).join(' |');
          _results.push("" + out + " |\n");
        }
        return _results;
      }).call(this)).join('');
    };

    TodosMarkdown.prototype.getList = function(todos) {
      var key, out, todo;
      return ((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = todos.length; _i < _len; _i++) {
          todo = todos[_i];
          out = '-' + ((function() {
            var _j, _len1, _ref, _results1;
            _ref = this.showInTable;
            _results1 = [];
            for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
              key = _ref[_j];
              _results1.push(this.getItemOutput(todo, key));
            }
            return _results1;
          }).call(this)).join('');
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RvZG8tc2hvdy9saWIvdG9kb3MtbWFya2Rvd24uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGFBQUE7O0FBQUEsRUFBQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ1MsSUFBQSx1QkFBQSxHQUFBO0FBQ1gsTUFBQSxJQUFDLENBQUEsV0FBRCxHQUFlLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix1QkFBaEIsQ0FBZixDQURXO0lBQUEsQ0FBYjs7QUFBQSw0QkFHQSxhQUFBLEdBQWUsU0FBQyxJQUFELEVBQU8sR0FBUCxHQUFBO0FBQ2IsVUFBQSxJQUFBO0FBQUEsTUFBQSxJQUFHLElBQUEsR0FBTyxJQUFLLENBQUEsR0FBRyxDQUFDLFdBQUosQ0FBQSxDQUFBLENBQWY7QUFDRSxnQkFBTyxHQUFQO0FBQUEsZUFDTyxLQURQO21CQUNtQixHQUFBLEdBQUcsS0FEdEI7QUFBQSxlQUVPLE1BRlA7bUJBRW9CLEdBQUEsR0FBRyxLQUZ2QjtBQUFBLGVBR08sTUFIUDttQkFHb0IsS0FBQSxHQUFLLElBQUwsR0FBVSxLQUg5QjtBQUFBLGVBSU8sT0FKUDttQkFJcUIsS0FBQSxHQUFLLElBQUwsR0FBVSxJQUovQjtBQUFBLGVBS08sTUFMUDttQkFLb0IsS0FBQSxHQUFLLElBQUwsR0FBVSxJQUw5QjtBQUFBLGVBTU8sT0FOUDttQkFNcUIsS0FBQSxHQUFLLElBQUwsR0FBVSxLQU4vQjtBQUFBLGVBT08sTUFQUDttQkFPb0IsSUFBQSxHQUFJLElBQUosR0FBUyxJQUFULEdBQWEsSUFBYixHQUFrQixJQVB0QztBQUFBLGVBUU8sTUFSUDttQkFRb0IsSUFBQSxHQUFJLElBQUosR0FBUyxJQVI3QjtBQUFBLFNBREY7T0FEYTtJQUFBLENBSGYsQ0FBQTs7QUFBQSw0QkFlQSxRQUFBLEdBQVUsU0FBQyxLQUFELEdBQUE7QUFDUixVQUFBLGtCQUFBO0FBQUEsTUFBQSxFQUFBLEdBQU8sSUFBQSxHQUFHLENBQUM7O0FBQUM7QUFBQTthQUFBLDJDQUFBO3lCQUFBO0FBQTZCLHdCQUFBLElBQUEsQ0FBN0I7QUFBQTs7bUJBQUQsQ0FBa0MsQ0FBQyxJQUFuQyxDQUF3QyxLQUF4QyxDQUFELENBQUgsR0FBbUQsTUFBMUQsQ0FBQTtBQUFBLE1BQ0EsRUFBQSxJQUFPLEdBQUEsR0FBRSxDQUFDLEtBQUEsQ0FBTSxFQUFFLENBQUMsTUFBSCxHQUFVLENBQWhCLENBQWtCLENBQUMsSUFBbkIsQ0FBd0IsR0FBeEIsQ0FBRCxDQUFGLEdBQWdDLEtBRHZDLENBQUE7YUFFQSxFQUFBLEdBQUs7O0FBQUM7YUFBQSw0Q0FBQTsyQkFBQTtBQUNKLFVBQUEsR0FBQSxHQUFNLEdBQUEsR0FBTTs7QUFBQztBQUFBO2lCQUFBLDZDQUFBOzZCQUFBO0FBQ1gsNkJBQUEsSUFBQyxDQUFBLGFBQUQsQ0FBZSxJQUFmLEVBQXFCLEdBQXJCLEVBQUEsQ0FEVztBQUFBOzt1QkFBRCxDQUVYLENBQUMsSUFGVSxDQUVMLElBRkssQ0FBWixDQUFBO0FBQUEsd0JBR0EsRUFBQSxHQUFHLEdBQUgsR0FBTyxPQUhQLENBREk7QUFBQTs7bUJBQUQsQ0FLSixDQUFDLElBTEcsQ0FLRSxFQUxGLEVBSEc7SUFBQSxDQWZWLENBQUE7O0FBQUEsNEJBeUJBLE9BQUEsR0FBUyxTQUFDLEtBQUQsR0FBQTtBQUNQLFVBQUEsY0FBQTthQUFBOztBQUFDO2FBQUEsNENBQUE7MkJBQUE7QUFDQyxVQUFBLEdBQUEsR0FBTSxHQUFBLEdBQU07O0FBQUM7QUFBQTtpQkFBQSw2Q0FBQTs2QkFBQTtBQUNYLDZCQUFBLElBQUMsQ0FBQSxhQUFELENBQWUsSUFBZixFQUFxQixHQUFyQixFQUFBLENBRFc7QUFBQTs7dUJBQUQsQ0FFWCxDQUFDLElBRlUsQ0FFTCxFQUZLLENBQVosQ0FBQTtBQUdBLFVBQUEsSUFBd0IsR0FBQSxLQUFPLEdBQS9CO0FBQUEsWUFBQSxHQUFBLEdBQU0sY0FBTixDQUFBO1dBSEE7QUFBQSx3QkFJQSxFQUFBLEdBQUcsR0FBSCxHQUFPLEtBSlAsQ0FERDtBQUFBOzttQkFBRCxDQU1DLENBQUMsSUFORixDQU1PLEVBTlAsRUFETztJQUFBLENBekJULENBQUE7O0FBQUEsNEJBa0NBLFFBQUEsR0FBVSxTQUFDLEtBQUQsR0FBQTtBQUNSLE1BQUEsSUFBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isd0JBQWhCLENBQUEsS0FBNkMsT0FBaEQ7ZUFDRSxJQUFDLENBQUEsUUFBRCxDQUFVLEtBQVYsRUFERjtPQUFBLE1BQUE7ZUFHRSxJQUFDLENBQUEsT0FBRCxDQUFTLEtBQVQsRUFIRjtPQURRO0lBQUEsQ0FsQ1YsQ0FBQTs7eUJBQUE7O01BRkYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/ah/.atom/packages/todo-show/lib/todos-markdown.coffee
