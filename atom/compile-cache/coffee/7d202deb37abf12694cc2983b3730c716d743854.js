(function() {
  var ShowTodoView, fs, querystring, url;

  querystring = require('querystring');

  url = require('url');

  fs = require('fs-plus');

  ShowTodoView = require('./show-todo-view');

  module.exports = {
    showTodoView: null,
    config: {
      findTheseRegexes: {
        type: 'array',
        "default": ['FIXMEs', '/FIXME:?(.+$)/g', 'TODOs', '/TODO:?(.+$)/g', 'CHANGEDs', '/CHANGED:?(.+$)/g', 'XXXs', '/XXX:?(.+$)/g'],
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
      }
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
      var _ref;
      return (_ref = this.showTodoView) != null ? _ref.destroy() : void 0;
    },
    serialize: function() {
      var _ref;
      return {
        showTodoViewState: (_ref = this.showTodoView) != null ? _ref.serialize() : void 0
      };
    },
    show: function() {
      var pane, previousActivePane, uri;
      previousActivePane = atom.workspace.getActivePane();
      uri = "todolist-preview://TODOs";
      pane = atom.workspace.paneForItem(this.showTodoView);
      if (pane) {
        pane.destroyItem(this.showTodoView);
        if (pane.getItems().length === 0) {
          return pane.destroy();
        }
      } else {
        return atom.workspace.open(uri, {
          split: 'right',
          searchAllPanes: true
        }).done((function(_this) {
          return function(textEditorView) {
            _this.showTodoView = textEditorView;
            arguments[0].innerHTML = "WE HAVE LIFTOFF";
            if (_this.showTodoView instanceof ShowTodoView) {
              _this.showTodoView.renderTodos();
            }
            return previousActivePane.activate();
          };
        })(this));
      }
    }
  };

}).call(this);
