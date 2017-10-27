(function() {
  var CompositeDisposable, ShowTodoView, url;

  CompositeDisposable = require('atom').CompositeDisposable;

  url = require('url');

  ShowTodoView = require('./show-todo-view');

  module.exports = {
    config: {
      findTheseRegexes: {
        type: 'array',
        "default": ['FIXMEs', '/\\bFIXME:?\\d*($|\\s.*$)/g', 'TODOs', '/\\bTODO:?\\d*($|\\s.*$)/g', 'CHANGEDs', '/\\bCHANGED:?\\d*($|\\s.*$)/g', 'XXXs', '/\\bXXX:?\\d*($|\\s.*$)/g', 'IDEAs', '/\\bIDEA:?\\d*($|\\s.*$)/g', 'HACKs', '/\\bHACK:?\\d*($|\\s.*$)/g', 'NOTEs', '/\\bNOTE:?\\d*($|\\s.*$)/g', 'REVIEWs', '/\\bREVIEW:?\\d*($|\\s.*$)/g'],
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
      return this.disposables.add(atom.workspace.addOpener(function(uriToOpen) {
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
      }));
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RvZG8tc2hvdy9saWIvc2hvdy10b2RvLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxzQ0FBQTs7QUFBQSxFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFBRCxDQUFBOztBQUFBLEVBQ0EsR0FBQSxHQUFNLE9BQUEsQ0FBUSxLQUFSLENBRE4sQ0FBQTs7QUFBQSxFQUdBLFlBQUEsR0FBZSxPQUFBLENBQVEsa0JBQVIsQ0FIZixDQUFBOztBQUFBLEVBS0EsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsTUFBQSxFQUVFO0FBQUEsTUFBQSxnQkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sT0FBTjtBQUFBLFFBRUEsU0FBQSxFQUFTLENBQ1AsUUFETyxFQUVQLDZCQUZPLEVBR1AsT0FITyxFQUlQLDRCQUpPLEVBS1AsVUFMTyxFQU1QLCtCQU5PLEVBT1AsTUFQTyxFQVFQLDJCQVJPLEVBU1AsT0FUTyxFQVVQLDRCQVZPLEVBV1AsT0FYTyxFQVlQLDRCQVpPLEVBYVAsT0FiTyxFQWNQLDRCQWRPLEVBZVAsU0FmTyxFQWdCUCw4QkFoQk8sQ0FGVDtBQUFBLFFBb0JBLEtBQUEsRUFDRTtBQUFBLFVBQUEsSUFBQSxFQUFNLFFBQU47U0FyQkY7T0FERjtBQUFBLE1Bd0JBLGdCQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxPQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsQ0FDUCxpQkFETyxFQUVQLFdBRk8sRUFHUCxxQkFITyxDQURUO0FBQUEsUUFNQSxLQUFBLEVBQ0U7QUFBQSxVQUFBLElBQUEsRUFBTSxRQUFOO1NBUEY7T0F6QkY7QUFBQSxNQWtDQSxtQkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLFFBQ0EsU0FBQSxF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

//# sourceURL=/Users/ah/.atom/packages/todo-show/lib/show-todo.coffee
