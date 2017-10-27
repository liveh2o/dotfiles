(function() {
  var ShowTodoView, fs, querystring, url;

  querystring = require('querystring');

  url = require('url');

  fs = require('fs-plus');

  ShowTodoView = require('./show-todo-view');

  module.exports = {
    showTodoView: null,
    configDefaults: {
      findTheseRegexes: ['FIXMEs', '/FIXME:?(.+$)/g', 'TODOs', '/TODO:?(.+$)/g', 'CHANGEDs', '/CHANGED:?(.+$)/g', 'XXXs', '/XXX:?(.+$)/g'],
      ignoreThesePaths: ['/node_modules/', '/vendor/']
    },
    activate: function(state) {
      atom.commands.add('atom-workspace', {
        'todo-show:find-in-project': (function(_this) {
          return function() {
            return _this.show();
          };
        })(this)
      });
      return atom.workspace.addOpener(function(uriToOpen) {
        var pathname, protocol, _ref;
        _ref = url.parse(uriToOpen), protocol = _ref.protocol, pathname = _ref.pathname;
        if (pathname) {
          pathname = querystring.unescape(pathname);
        }
        if (protocol !== 'todolist-preview:') {
          return;
        }
        return new ShowTodoView(pathname);
      });
    },
    deactivate: function() {
      return this.showTodoView.destroy();
    },
    serialize: function() {
      return {
        showTodoViewState: this.showTodoView.serialize()
      };
    },
    show: function(todoContent) {
      var previousActivePane, uri;
      previousActivePane = atom.workspace.getActivePane();
      uri = "todolist-preview://TODOs";
      return atom.workspace.open(uri, {
        split: 'right',
        searchAllPanes: true
      }).done(function(showTodoView) {
        arguments[0].innerHTML = "WE HAVE LIFTOFF";
        if (showTodoView instanceof ShowTodoView) {
          showTodoView.renderTodos();
        }
        return previousActivePane.activate();
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBS0E7QUFBQSxNQUFBLGtDQUFBOztBQUFBLEVBQUEsV0FBQSxHQUFjLE9BQUEsQ0FBUSxhQUFSLENBQWQsQ0FBQTs7QUFBQSxFQUNBLEdBQUEsR0FBTSxPQUFBLENBQVEsS0FBUixDQUROLENBQUE7O0FBQUEsRUFFQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVIsQ0FGTCxDQUFBOztBQUFBLEVBS0EsWUFBQSxHQUFlLE9BQUEsQ0FBUSxrQkFBUixDQUxmLENBQUE7O0FBQUEsRUFRQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxZQUFBLEVBQWMsSUFBZDtBQUFBLElBQ0EsY0FBQSxFQUNFO0FBQUEsTUFBQSxnQkFBQSxFQUFrQixDQUNoQixRQURnQixFQUVoQixpQkFGZ0IsRUFHaEIsT0FIZ0IsRUFJaEIsZ0JBSmdCLEVBS2hCLFVBTGdCLEVBTWhCLG1CQU5nQixFQU9oQixNQVBnQixFQVFoQixlQVJnQixDQUFsQjtBQUFBLE1BVUEsZ0JBQUEsRUFBa0IsQ0FDaEIsZ0JBRGdCLEVBRWhCLFVBRmdCLENBVmxCO0tBRkY7QUFBQSxJQWlCQSxRQUFBLEVBQVUsU0FBQyxLQUFELEdBQUE7QUFFUixNQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0M7QUFBQSxRQUFBLDJCQUFBLEVBQTZCLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO21CQUUvRCxLQUFDLENBQUEsSUFBRCxDQUFBLEVBRitEO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBN0I7T0FBcEMsQ0FBQSxDQUFBO2FBT0EsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFmLENBQXlCLFNBQUMsU0FBRCxHQUFBO0FBRXZCLFlBQUEsd0JBQUE7QUFBQSxRQUFBLE9BQXVCLEdBQUcsQ0FBQyxLQUFKLENBQVUsU0FBVixDQUF2QixFQUFDLGdCQUFBLFFBQUQsRUFBVyxnQkFBQSxRQUFYLENBQUE7QUFDQSxRQUFBLElBQTZDLFFBQTdDO0FBQUEsVUFBQSxRQUFBLEdBQVcsV0FBVyxDQUFDLFFBQVosQ0FBcUIsUUFBckIsQ0FBWCxDQUFBO1NBREE7QUFFQSxRQUFBLElBQWMsUUFBQSxLQUFZLG1CQUExQjtBQUFBLGdCQUFBLENBQUE7U0FGQTtlQUlJLElBQUEsWUFBQSxDQUFhLFFBQWIsRUFObUI7TUFBQSxDQUF6QixFQVRRO0lBQUEsQ0FqQlY7QUFBQSxJQXVDQSxVQUFBLEVBQVksU0FBQSxHQUFBO2FBQ1YsSUFBQyxDQUFBLFlBQVksQ0FBQyxPQUFkLENBQUEsRUFEVTtJQUFBLENBdkNaO0FBQUEsSUEyQ0EsU0FBQSxFQUFXLFNBQUEsR0FBQTthQUNUO0FBQUEsUUFBQSxpQkFBQSxFQUFtQixJQUFDLENBQUEsWUFBWSxDQUFDLFNBQWQsQ0FBQSxDQUFuQjtRQURTO0lBQUEsQ0EzQ1g7QUFBQSxJQThDQSxJQUFBLEVBQU0sU0FBQyxXQUFELEdBQUE7QUFZSixVQUFBLHVCQUFBO0FBQUEsTUFBQSxrQkFBQSxHQUFxQixJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBQSxDQUFyQixDQUFBO0FBQUEsTUFDQSxHQUFBLEdBQU0sMEJBRE4sQ0FBQTthQUVBLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixHQUFwQixFQUF5QjtBQUFBLFFBQUEsS0FBQSxFQUFPLE9BQVA7QUFBQSxRQUFnQixjQUFBLEVBQWdCLElBQWhDO09BQXpCLENBQThELENBQUMsSUFBL0QsQ0FBb0UsU0FBQyxZQUFELEdBQUE7QUFHbEUsUUFBQSxTQUFVLENBQUEsQ0FBQSxDQUFFLENBQUMsU0FBYixHQUF5QixpQkFBekIsQ0FBQTtBQUNBLFFBQUEsSUFBRyxZQUFBLFlBQXdCLFlBQTNCO0FBQ0UsVUFBQSxZQUFZLENBQUMsV0FBYixDQUFBLENBQUEsQ0FERjtTQURBO2VBR0Esa0JBQWtCLENBQUMsUUFBbkIsQ0FBQSxFQU5rRTtNQUFBLENBQXBFLEVBZEk7SUFBQSxDQTlDTjtHQVRGLENBQUE7QUFBQSIKfQ==
//# sourceURL=/Users/ah/.atom/packages/todo-show/lib/show-todo.coffee