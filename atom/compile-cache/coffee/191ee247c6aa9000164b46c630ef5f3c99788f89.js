(function() {
  var ShowTodoView, url;

  url = require('url');

  ShowTodoView = require('./show-todo-view');

  module.exports = {
    config: {
      findTheseRegexes: {
        type: 'array',
        "default": ['FIXMEs', '/\\b@?FIXME:?(.+$)/g', 'TODOs', '/\\b@?TODO:?(.+$)/g', 'CHANGEDs', '/\\b@?CHANGED:?(.+$)/g', 'XXXs', '/\\b@?XXX:?(.+$)/g', 'IDEAs', '/\\b@?IDEA:?(.+$)/g', 'HACKs', '/\\b@?HACK:?(.+$)/g', 'NOTEs', '/\\b@?NOTE:?(.+$)/g', 'REVIEWs', '/\\b@?REVIEW:?(.+$)/g'],
        items: {
          type: 'string'
        }
      },
      ignoreThesePaths: {
        type: 'array',
        "default": ['*/node_modules/', '*/vendor/', '*/bower_components/'],
        items: {
          type: 'string'
        }
      },
      openListInDirection: {
        type: 'string',
        "default": 'right',
        "enum": ['up', 'right', 'down', 'left', 'ontop']
      }
    },
    activate: function() {
      atom.commands.add('atom-workspace', {
        'todo-show:find-in-project': (function(_this) {
          return function() {
            return _this.show();
          };
        })(this)
      });
      return atom.workspace.addOpener(function(uriToOpen) {
        var host, pathname, protocol, _ref;
        _ref = url.parse(uriToOpen), protocol = _ref.protocol, host = _ref.host, pathname = _ref.pathname;
        if (pathname) {
          pathname = decodeURI(pathname);
        }
        if (protocol !== 'todolist-preview:') {
          return;
        }
        return new ShowTodoView({
          filePath: pathname
        }).renderTodos();
      });
    },
    show: function() {
      var direction, pane, prevPane, uri;
      uri = "todolist-preview://TODOs";
      prevPane = atom.workspace.getActivePane();
      pane = atom.workspace.paneForItem(this.showTodoView);
      direction = atom.config.get('todo-show.openListInDirection');
      if (pane) {
        pane.destroyItem(this.showTodoView);
        if (pane.getItems().length === 0) {
          pane.destroy();
        }
        return;
      }
      if (direction === 'down') {
        if (prevPane.parent.orientation !== 'vertical') {
          prevPane.splitDown();
        }
      } else if (direction === 'up') {
        if (prevPane.parent.orientation !== 'vertical') {
          prevPane.splitUp();
        }
      }
      return atom.workspace.open(uri, {
        split: direction
      }).done((function(_this) {
        return function(showTodoView) {
          _this.showTodoView = showTodoView;
          return prevPane.activate();
        };
      })(this));
    }
  };

}).call(this);
