(function() {
  var CompositeDisposable, ShowTodoView, TodoCollection;

  CompositeDisposable = require('atom').CompositeDisposable;

  ShowTodoView = require('./todo-view');

  TodoCollection = require('./todo-collection');

  module.exports = {
    config: {
      findTheseTodos: {
        type: 'array',
        "default": ['FIXME', 'TODO', 'CHANGED', 'XXX', 'IDEA', 'HACK', 'NOTE', 'REVIEW'],
        items: {
          type: 'string'
        }
      },
      findUsingRegex: {
        description: 'Single regex used to find all todos. ${TODOS} is replaced with the findTheseTodos array.',
        type: 'string',
        "default": '/\\b(${TODOS}):?\\d*($|\\s.*$)/g'
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
      var collection;
      collection = new TodoCollection;
      collection.setAvailableTableItems(this.config.sortBy["enum"]);
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
            collection.setSearchScope(scope);
            return new ShowTodoView(collection, uriToOpen);
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RvZG8tc2hvdy9saWIvc2hvdy10b2RvLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxpREFBQTs7QUFBQSxFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFBRCxDQUFBOztBQUFBLEVBRUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSxhQUFSLENBRmYsQ0FBQTs7QUFBQSxFQUdBLGNBQUEsR0FBaUIsT0FBQSxDQUFRLG1CQUFSLENBSGpCLENBQUE7O0FBQUEsRUFLQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxNQUFBLEVBQ0U7QUFBQSxNQUFBLGNBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLE9BQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxDQUNQLE9BRE8sRUFFUCxNQUZPLEVBR1AsU0FITyxFQUlQLEtBSk8sRUFLUCxNQUxPLEVBTVAsTUFOTyxFQU9QLE1BUE8sRUFRUCxRQVJPLENBRFQ7QUFBQSxRQVdBLEtBQUEsRUFDRTtBQUFBLFVBQUEsSUFBQSxFQUFNLFFBQU47U0FaRjtPQURGO0FBQUEsTUFjQSxjQUFBLEVBQ0U7QUFBQSxRQUFBLFdBQUEsRUFBYSwwRkFBYjtBQUFBLFFBQ0EsSUFBQSxFQUFNLFFBRE47QUFBQSxRQUVBLFNBQUEsRUFBUyxrQ0FGVDtPQWZGO0FBQUEsTUFrQkEsZ0JBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLE9BQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxDQUNQLGtCQURPLEVBRVAsWUFGTyxFQUdQLHNCQUhPLENBRFQ7QUFBQSxRQU1BLEtBQUEsRUFDRTtBQUFBLFVBQUEsSUFBQSxFQUFNLFFBQU47U0FQRjtPQW5CRjtBQUFBLE1BMkJBLFdBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLE9BQU47QUFBQSxR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

//# sourceURL=/Users/ah/.atom/packages/todo-show/lib/show-todo.coffee
