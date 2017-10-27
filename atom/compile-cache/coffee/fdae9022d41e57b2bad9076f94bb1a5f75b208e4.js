(function() {
  var CompositeDisposable, ShowTodoView, TodoCollection, TodoIndicatorView;

  CompositeDisposable = require('atom').CompositeDisposable;

  ShowTodoView = require('./todo-view');

  TodoCollection = require('./todo-collection');

  TodoIndicatorView = null;

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
      },
      statusBarIndicator: {
        type: 'boolean',
        "default": false
      }
    },
    URI: {
      workspace: 'atom://todo-show/todos',
      project: 'atom://todo-show/project-todos',
      open: 'atom://todo-show/open-todos',
      active: 'atom://todo-show/active-todos'
    },
    activate: function() {
      this.collection = new TodoCollection;
      this.collection.setAvailableTableItems(this.config.sortBy["enum"]);
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
            _this.collection.scope = scope;
            return new ShowTodoView(_this.collection, uriToOpen);
          }
        };
      })(this)));
    },
    deactivate: function() {
      var _ref;
      this.destroyTodoIndicator();
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
    },
    consumeStatusBar: function(statusBar) {
      return atom.config.observe('todo-show.statusBarIndicator', (function(_this) {
        return function(newValue) {
          if (newValue) {
            if (TodoIndicatorView == null) {
              TodoIndicatorView = require('./todo-indicator-view');
            }
            if (_this.todoIndicatorView == null) {
              _this.todoIndicatorView = new TodoIndicatorView(_this.collection);
            }
            return _this.statusBarTile = statusBar.addLeftTile({
              item: _this.todoIndicatorView,
              priority: 200
            });
          } else {
            return _this.destroyTodoIndicator();
          }
        };
      })(this));
    },
    destroyTodoIndicator: function() {
      var _ref, _ref1;
      if ((_ref = this.todoIndicatorView) != null) {
        _ref.destroy();
      }
      this.todoIndicatorView = null;
      if ((_ref1 = this.statusBarTile) != null) {
        _ref1.destroy();
      }
      return this.statusBarTile = null;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RvZG8tc2hvdy9saWIvc2hvdy10b2RvLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxvRUFBQTs7QUFBQSxFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFBRCxDQUFBOztBQUFBLEVBRUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSxhQUFSLENBRmYsQ0FBQTs7QUFBQSxFQUdBLGNBQUEsR0FBaUIsT0FBQSxDQUFRLG1CQUFSLENBSGpCLENBQUE7O0FBQUEsRUFJQSxpQkFBQSxHQUFvQixJQUpwQixDQUFBOztBQUFBLEVBTUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsTUFBQSxFQUNFO0FBQUEsTUFBQSxjQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxPQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsQ0FDUCxPQURPLEVBRVAsTUFGTyxFQUdQLFNBSE8sRUFJUCxLQUpPLEVBS1AsTUFMTyxFQU1QLE1BTk8sRUFPUCxNQVBPLEVBUVAsUUFSTyxDQURUO0FBQUEsUUFXQSxLQUFBLEVBQ0U7QUFBQSxVQUFBLElBQUEsRUFBTSxRQUFOO1NBWkY7T0FERjtBQUFBLE1BY0EsY0FBQSxFQUNFO0FBQUEsUUFBQSxXQUFBLEVBQWEsMEZBQWI7QUFBQSxRQUNBLElBQUEsRUFBTSxRQUROO0FBQUEsUUFFQSxTQUFBLEVBQVMsOENBRlQ7T0FmRjtBQUFBLE1Ba0JBLGdCQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxPQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsQ0FDUCxrQkFETyxFQUVQLFlBRk8sRUFHUCxzQkFITyxDQURUO0FBQUEsUUFNQSxLQUFBLEVBQ0U7QUFBQSxVQUFBLElBQUEsRUFBTSxRQUFOO1NBUEY7T0FuQkY7QUFBQSxNQTJCQSxXQUFBLEVB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

//# sourceURL=/Users/ah/.atom/packages/todo-show/lib/show-todo.coffee
