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
      atom.workspaceView.command('todo-show:find-in-project', (function(_this) {
        return function() {
          return _this.show();
        };
      })(this));
      return atom.workspace.registerOpener(function(uriToOpen) {
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBS0E7QUFBQSxNQUFBLGtDQUFBOztBQUFBLEVBQUEsV0FBQSxHQUFjLE9BQUEsQ0FBUSxhQUFSLENBQWQsQ0FBQTs7QUFBQSxFQUNBLEdBQUEsR0FBTSxPQUFBLENBQVEsS0FBUixDQUROLENBQUE7O0FBQUEsRUFFQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVIsQ0FGTCxDQUFBOztBQUFBLEVBS0EsWUFBQSxHQUFlLE9BQUEsQ0FBUSxrQkFBUixDQUxmLENBQUE7O0FBQUEsRUFRQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxZQUFBLEVBQWMsSUFBZDtBQUFBLElBQ0EsY0FBQSxFQUNFO0FBQUEsTUFBQSxnQkFBQSxFQUFrQixDQUNoQixRQURnQixFQUVoQixpQkFGZ0IsRUFHaEIsT0FIZ0IsRUFJaEIsZ0JBSmdCLEVBS2hCLFVBTGdCLEVBTWhCLG1CQU5nQixFQU9oQixNQVBnQixFQVFoQixlQVJnQixDQUFsQjtBQUFBLE1BVUEsZ0JBQUEsRUFBa0IsQ0FDaEIsZ0JBRGdCLEVBRWhCLFVBRmdCLENBVmxCO0tBRkY7QUFBQSxJQWlCQSxRQUFBLEVBQVUsU0FBQyxLQUFELEdBQUE7QUFDUixNQUFBLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBbkIsQ0FBMkIsMkJBQTNCLEVBQXdELENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQ3RELEtBQUMsQ0FBQSxJQUFELENBQUEsRUFEc0Q7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF4RCxDQUFBLENBQUE7YUFNQSxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWYsQ0FBOEIsU0FBQyxTQUFELEdBQUE7QUFFNUIsWUFBQSx3QkFBQTtBQUFBLFFBQUEsT0FBdUIsR0FBRyxDQUFDLEtBQUosQ0FBVSxTQUFWLENBQXZCLEVBQUMsZ0JBQUEsUUFBRCxFQUFXLGdCQUFBLFFBQVgsQ0FBQTtBQUNBLFFBQUEsSUFBNkMsUUFBN0M7QUFBQSxVQUFBLFFBQUEsR0FBVyxXQUFXLENBQUMsUUFBWixDQUFxQixRQUFyQixDQUFYLENBQUE7U0FEQTtBQUVBLFFBQUEsSUFBYyxRQUFBLEtBQVksbUJBQTFCO0FBQUEsZ0JBQUEsQ0FBQTtTQUZBO2VBSUksSUFBQSxZQUFBLENBQWEsUUFBYixFQU53QjtNQUFBLENBQTlCLEVBUFE7SUFBQSxDQWpCVjtBQUFBLElBcUNBLFVBQUEsRUFBWSxTQUFBLEdBQUE7YUFDVixJQUFDLENBQUEsWUFBWSxDQUFDLE9BQWQsQ0FBQSxFQURVO0lBQUEsQ0FyQ1o7QUFBQSxJQXlDQSxTQUFBLEVBQVcsU0FBQSxHQUFBO2FBQ1Q7QUFBQSxRQUFBLGlCQUFBLEVBQW1CLElBQUMsQ0FBQSxZQUFZLENBQUMsU0FBZCxDQUFBLENBQW5CO1FBRFM7SUFBQSxDQXpDWDtBQUFBLElBNENBLElBQUEsRUFBTSxTQUFDLFdBQUQsR0FBQTtBQVlKLFVBQUEsdUJBQUE7QUFBQSxNQUFBLGtCQUFBLEdBQXFCLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBZixDQUFBLENBQXJCLENBQUE7QUFBQSxNQUNBLEdBQUEsR0FBTSwwQkFETixDQUFBO2FBRUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLEdBQXBCLEVBQXlCO0FBQUEsUUFBQSxLQUFBLEVBQU8sT0FBUDtBQUFBLFFBQWdCLGNBQUEsRUFBZ0IsSUFBaEM7T0FBekIsQ0FBOEQsQ0FBQyxJQUEvRCxDQUFvRSxTQUFDLFlBQUQsR0FBQTtBQUdsRSxRQUFBLFNBQVUsQ0FBQSxDQUFBLENBQUUsQ0FBQyxTQUFiLEdBQXlCLGlCQUF6QixDQUFBO0FBQ0EsUUFBQSxJQUFHLFlBQUEsWUFBd0IsWUFBM0I7QUFDRSxVQUFBLFlBQVksQ0FBQyxXQUFiLENBQUEsQ0FBQSxDQURGO1NBREE7ZUFHQSxrQkFBa0IsQ0FBQyxRQUFuQixDQUFBLEVBTmtFO01BQUEsQ0FBcEUsRUFkSTtJQUFBLENBNUNOO0dBVEYsQ0FBQTtBQUFBIgp9
//# sourceURL=/Users/ah/.atom/packages/todo-show/lib/show-todo.coffee