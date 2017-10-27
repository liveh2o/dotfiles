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
        "default": '/\\b(${TODOS})[:;.,]?\\d*($|\\s.*$|\\(.*$)/g'
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
        "default": ['Text', 'Type', 'Path']
      },
      sortBy: {
        type: 'string',
        "default": 'Text',
        "enum": ['All', 'Text', 'Type', 'Range', 'Line', 'Regex', 'Path', 'File', 'Tags', 'Id', 'Project']
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
      workspace: 'atom://todo-show/todos',
      project: 'atom://todo-show/project-todos',
      open: 'atom://todo-show/open-todos',
      active: 'atom://todo-show/active-todos'
    },
    activate: function() {
      var collection;
      collection = new TodoCollection;
      collection.setAvailableTableItems(this.config.sortBy["enum"]);
      this.disposables = new CompositeDisposable;
      this.disposables.add(atom.commands.add('atom-workspace', {
        'todo-show:find-in-workspace': (function(_this) {
          return function() {
            return _this.show(_this.URI.workspace);
          };
        })(this),
        'todo-show:find-in-project': (function(_this) {
          return function() {
            return _this.show(_this.URI.project);
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
              case this.URI.workspace:
                return 'workspace';
              case this.URI.project:
                return 'project';
              case this.URI.open:
                return 'open';
              case this.URI.active:
                return 'active';
            }
          }).call(_this);
          if (scope) {
            collection.scope = scope;
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
      switch (direction) {
        case 'down':
          if (prevPane.parent.orientation !== 'vertical') {
            prevPane.splitDown();
          }
          break;
        case 'up':
          if (prevPane.parent.orientation !== 'vertical') {
            prevPane.splitUp();
          }
          break;
        case 'left':
          if (prevPane.parent.orientation !== 'horizontal') {
            prevPane.splitLeft();
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RvZG8tc2hvdy9saWIvc2hvdy10b2RvLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxpREFBQTs7QUFBQSxFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFBRCxDQUFBOztBQUFBLEVBRUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSxhQUFSLENBRmYsQ0FBQTs7QUFBQSxFQUdBLGNBQUEsR0FBaUIsT0FBQSxDQUFRLG1CQUFSLENBSGpCLENBQUE7O0FBQUEsRUFLQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxNQUFBLEVBQ0U7QUFBQSxNQUFBLGNBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLE9BQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxDQUNQLE9BRE8sRUFFUCxNQUZPLEVBR1AsU0FITyxFQUlQLEtBSk8sRUFLUCxNQUxPLEVBTVAsTUFOTyxFQU9QLE1BUE8sRUFRUCxRQVJPLENBRFQ7QUFBQSxRQVdBLEtBQUEsRUFDRTtBQUFBLFVBQUEsSUFBQSxFQUFNLFFBQU47U0FaRjtPQURGO0FBQUEsTUFjQSxjQUFBLEVBQ0U7QUFBQSxRQUFBLFdBQUEsRUFBYSwwRkFBYjtBQUFBLFFBQ0EsSUFBQSxFQUFNLFFBRE47QUFBQSxRQUVBLFNBQUEsRUFBUyw4Q0FGVDtPQWZGO0FBQUEsTUFrQkEsZ0JBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLE9BQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxDQUNQLGtCQURPLEVBRVAsWUFGTyxFQUdQLHNCQUhPLENBRFQ7QUFBQSxRQU1BLEtBQUEsRUFDRTtBQUFBLFVBQUEsSUFBQSxFQUFNLFFBQU47U0FQRjtPQW5CRjtBQUFBLE1BMkJBLFdBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLE9BQU47QUFBQSxR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

//# sourceURL=/Users/ah/.atom/packages/todo-show/lib/show-todo.coffee
