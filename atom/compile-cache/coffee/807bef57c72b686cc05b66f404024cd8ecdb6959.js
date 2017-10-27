(function() {
  var CompositeDisposable, ShowTodoView, TodosModel;

  CompositeDisposable = require('atom').CompositeDisposable;

  ShowTodoView = require('./show-todo-view');

  TodosModel = require('./todos-model');

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
        "default": ['**/node_modules/', '**/vendor/', '**/bower_components/'],
        items: {
          type: 'string'
        }
      },
      showInTable: {
        type: 'array',
        "default": ['Text', 'Type', 'File']
      },
      sortBy: {
        type: 'string',
        "default": 'Text',
        "enum": ['All', 'Text', 'Type', 'Range', 'Line', 'Regex', 'File']
      },
      sortAscending: {
        type: 'boolean',
        "default": true
      },
      openListInDirection: {
        type: 'string',
        "default": 'right',
        "enum": ['up', 'right', 'down', 'left', 'ontop']
      },
      rememberViewSize: {
        type: 'boolean',
        "default": true
      }
    },
    URI: {
      full: 'atom://todo-show/todos',
      open: 'atom://todo-show/open-todos',
      active: 'atom://todo-show/active-todos'
    },
    activate: function() {
      var model;
      model = new TodosModel;
      model.setAvailableTableItems(this.config.sortBy["enum"]);
      this.disposables = new CompositeDisposable;
      this.disposables.add(atom.commands.add('atom-workspace', {
        'todo-show:find-in-project': (function(_this) {
          return function() {
            return _this.show(_this.URI.full);
          };
        })(this),
        'todo-show:find-in-open-files': (function(_this) {
          return function() {
            return _this.show(_this.URI.open);
          };
        })(this)
      }));
      return this.disposables.add(atom.workspace.addOpener((function(_this) {
        return function(uriToOpen) {
          var scope;
          scope = (function() {
            switch (uriToOpen) {
              case this.URI.full:
                return 'full';
              case this.URI.open:
                return 'open';
              case this.URI.active:
                return 'active';
            }
          }).call(_this);
          if (scope) {
            model.setSearchScope(scope);
            return new ShowTodoView(model, uriToOpen);
          }
        };
      })(this)));
    },
    deactivate: function() {
      var _ref;
      return (_ref = this.disposables) != null ? _ref.dispose() : void 0;
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
      }).then((function(_this) {
        return function(showTodoView) {
          _this.showTodoView = showTodoView;
          return prevPane.activate();
        };
      })(this));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RvZG8tc2hvdy9saWIvc2hvdy10b2RvLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw2Q0FBQTs7QUFBQSxFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFBRCxDQUFBOztBQUFBLEVBRUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSxrQkFBUixDQUZmLENBQUE7O0FBQUEsRUFHQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGVBQVIsQ0FIYixDQUFBOztBQUFBLEVBS0EsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsTUFBQSxFQUNFO0FBQUEsTUFBQSxnQkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sT0FBTjtBQUFBLFFBR0EsU0FBQSxFQUFTLENBQ1AsUUFETyxFQUVQLDZCQUZPLEVBR1AsT0FITyxFQUlQLDRCQUpPLEVBS1AsVUFMTyxFQU1QLCtCQU5PLEVBT1AsTUFQTyxFQVFQLDJCQVJPLEVBU1AsT0FUTyxFQVVQLDRCQVZPLEVBV1AsT0FYTyxFQVlQLDRCQVpPLEVBYVAsT0FiTyxFQWNQLDRCQWRPLEVBZVAsU0FmTyxFQWdCUCw4QkFoQk8sQ0FIVDtBQUFBLFFBcUJBLEtBQUEsRUFDRTtBQUFBLFVBQUEsSUFBQSxFQUFNLFFBQU47U0F0QkY7T0FERjtBQUFBLE1Bd0JBLGdCQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxPQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsQ0FDUCxrQkFETyxFQUVQLFlBRk8sRUFHUCxzQkFITyxDQURUO0FBQUEsUUFNQSxLQUFBLEVBQ0U7QUFBQSxVQUFBLElBQUEsRUFBTSxRQUFOO1NBUEY7T0F6QkY7QUFBQSxNQWlDQSxXQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxPQUFOO0FBQUEsUUFDQSxTQUFBLEVB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

//# sourceURL=/Users/ah/.atom/packages/todo-show/lib/show-todo.coffee
