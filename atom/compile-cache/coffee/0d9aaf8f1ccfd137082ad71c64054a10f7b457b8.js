(function() {
  var CompositeDisposable, ShowTodoView, url;

  CompositeDisposable = require('atom').CompositeDisposable;

  url = require('url');

  ShowTodoView = require('./show-todo-view');

  module.exports = {
    config: {
      findTheseRegexes: {
        type: 'array',
        "default": ['FIXMEs', '/\\b@?FIXME:?\\s(.+$)/g', 'TODOs', '/\\b@?TODO:?\\s(.+$)/g', 'CHANGEDs', '/\\b@?CHANGED:?\\s(.+$)/g', 'XXXs', '/\\b@?XXX:?\\s(.+$)/g', 'IDEAs', '/\\b@?IDEA:?\\s(.+$)/g', 'HACKs', '/\\b@?HACK:?\\s(.+$)/g', 'NOTEs', '/\\b@?NOTE:?\\s(.+$)/g', 'REVIEWs', '/\\b@?REVIEW:?\\s(.+$)/g'],
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
      },
      groupMatchesBy: {
        type: 'string',
        "default": 'regex',
        "enum": ['regex', 'file', 'none']
      },
      rememberViewSize: {
        type: 'boolean',
        "default": true
      }
    },
    activate: function() {
      this.disposables = new CompositeDisposable;
      this.disposables.add(atom.commands.add('atom-workspace', {
        'todo-show:find-in-project': (function(_this) {
          return function() {
            return _this.show('todolist-preview:///TODOs');
          };
        })(this),
        'todo-show:find-in-open-files': (function(_this) {
          return function() {
            return _this.show('todolist-preview:///Open-TODOs');
          };
        })(this)
      }));
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
        }).getTodos();
      });
    },
    deactivate: function() {
      var _ref, _ref1;
      if ((_ref = this.paneDisposables) != null) {
        _ref.dispose();
      }
      return (_ref1 = this.disposables) != null ? _ref1.dispose() : void 0;
    },
    destroyPaneItem: function() {
      var pane;
      pane = atom.workspace.paneForItem(this.showTodoView);
      if (!pane) {
        return false;
      }
      pane.destroyItem(this.showTodoView);
      if (pane.getItems().length === 0) {
        pane.destroy();
      }
      return true;
    },
    show: function(uri) {
      var direction, prevPane;
      prevPane = atom.workspace.getActivePane();
      direction = atom.config.get('todo-show.openListInDirection');
      if (this.destroyPaneItem()) {
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
