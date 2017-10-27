(function() {
  var ShowTodoView, fs, querystring, url;

  querystring = require('querystring');

  url = require('url');

  fs = require('fs-plus');

  ShowTodoView = require('./show-todo-view');

  module.exports = {
    showTodoView: null,
    configDefaults: {
      findTheseRegexes: ['FIXMEs', '/FIXME:(.+$)/g', 'TODOs', '/TODO:(.+$)/g', 'CHANGEDs', '/CHANGED:(.+$)/g']
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQ0E7QUFBQSxNQUFBLGtDQUFBOztBQUFBLEVBQUEsV0FBQSxHQUFjLE9BQUEsQ0FBUSxhQUFSLENBQWQsQ0FBQTs7QUFBQSxFQUNBLEdBQUEsR0FBTSxPQUFBLENBQVEsS0FBUixDQUROLENBQUE7O0FBQUEsRUFFQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVIsQ0FGTCxDQUFBOztBQUFBLEVBS0EsWUFBQSxHQUFlLE9BQUEsQ0FBUSxrQkFBUixDQUxmLENBQUE7O0FBQUEsRUFRQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxZQUFBLEVBQWMsSUFBZDtBQUFBLElBQ0EsY0FBQSxFQUNFO0FBQUEsTUFBQSxnQkFBQSxFQUFrQixDQUNoQixRQURnQixFQUVoQixnQkFGZ0IsRUFHaEIsT0FIZ0IsRUFJaEIsZUFKZ0IsRUFLaEIsVUFMZ0IsRUFNaEIsa0JBTmdCLENBQWxCO0tBRkY7QUFBQSxJQVdBLFFBQUEsRUFBVSxTQUFDLEtBQUQsR0FBQTtBQUNSLE1BQUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFuQixDQUEyQiwyQkFBM0IsRUFBd0QsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDdEQsS0FBQyxDQUFBLElBQUQsQ0FBQSxFQURzRDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXhELENBQUEsQ0FBQTthQU1BLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBZixDQUE4QixTQUFDLFNBQUQsR0FBQTtBQUU1QixZQUFBLHdCQUFBO0FBQUEsUUFBQSxPQUF1QixHQUFHLENBQUMsS0FBSixDQUFVLFNBQVYsQ0FBdkIsRUFBQyxnQkFBQSxRQUFELEVBQVcsZ0JBQUEsUUFBWCxDQUFBO0FBQ0EsUUFBQSxJQUE2QyxRQUE3QztBQUFBLFVBQUEsUUFBQSxHQUFXLFdBQVcsQ0FBQyxRQUFaLENBQXFCLFFBQXJCLENBQVgsQ0FBQTtTQURBO0FBRUEsUUFBQSxJQUFjLFFBQUEsS0FBWSxtQkFBMUI7QUFBQSxnQkFBQSxDQUFBO1NBRkE7ZUFJSSxJQUFBLFlBQUEsQ0FBYSxRQUFiLEVBTndCO01BQUEsQ0FBOUIsRUFQUTtJQUFBLENBWFY7QUFBQSxJQStCQSxVQUFBLEVBQVksU0FBQSxHQUFBO2FBQ1YsSUFBQyxDQUFBLFlBQVksQ0FBQyxPQUFkLENBQUEsRUFEVTtJQUFBLENBL0JaO0FBQUEsSUFtQ0EsU0FBQSxFQUFXLFNBQUEsR0FBQTthQUNUO0FBQUEsUUFBQSxpQkFBQSxFQUFtQixJQUFDLENBQUEsWUFBWSxDQUFDLFNBQWQsQ0FBQSxDQUFuQjtRQURTO0lBQUEsQ0FuQ1g7QUFBQSxJQXNDQSxJQUFBLEVBQU0sU0FBQyxXQUFELEdBQUE7QUFZSixVQUFBLHVCQUFBO0FBQUEsTUFBQSxrQkFBQSxHQUFxQixJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBQSxDQUFyQixDQUFBO0FBQUEsTUFDQSxHQUFBLEdBQU0sMEJBRE4sQ0FBQTthQUVBLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixHQUFwQixFQUF5QjtBQUFBLFFBQUEsS0FBQSxFQUFPLE9BQVA7QUFBQSxRQUFnQixjQUFBLEVBQWdCLElBQWhDO09BQXpCLENBQThELENBQUMsSUFBL0QsQ0FBb0UsU0FBQyxZQUFELEdBQUE7QUFHbEUsUUFBQSxTQUFVLENBQUEsQ0FBQSxDQUFFLENBQUMsU0FBYixHQUF5QixpQkFBekIsQ0FBQTtBQUNBLFFBQUEsSUFBRyxZQUFBLFlBQXdCLFlBQTNCO0FBQ0UsVUFBQSxZQUFZLENBQUMsV0FBYixDQUFBLENBQUEsQ0FERjtTQURBO2VBR0Esa0JBQWtCLENBQUMsUUFBbkIsQ0FBQSxFQU5rRTtNQUFBLENBQXBFLEVBZEk7SUFBQSxDQXRDTjtHQVRGLENBQUE7QUFBQSIKfQ==
//# sourceURL=/Users/ah/.atom/packages/todo-show/lib/show-todo.coffee