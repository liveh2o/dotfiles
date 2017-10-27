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
        "enum": ['All', 'Text', 'Type', 'Range', 'Line', 'Regex', 'File', 'Tags']
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
      },
      saveOutputAs: {
        type: 'string',
        "default": 'List',
        "enum": ['List', 'Table']
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
