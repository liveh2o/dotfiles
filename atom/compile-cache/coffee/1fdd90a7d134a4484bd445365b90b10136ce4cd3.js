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
        })(this),
        'todo-show:find-in-active-file': (function(_this) {
          return function() {
            return _this.show(_this.URI.active);
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
      var ref;
      this.destroyTodoIndicator();
      return (ref = this.disposables) != null ? ref.dispose() : void 0;
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
      var ref, ref1;
      if ((ref = this.todoIndicatorView) != null) {
        ref.destroy();
      }
      this.todoIndicatorView = null;
      if ((ref1 = this.statusBarTile) != null) {
        ref1.destroy();
      }
      return this.statusBarTile = null;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RvZG8tc2hvdy9saWIvc2hvdy10b2RvLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUV4QixZQUFBLEdBQWUsT0FBQSxDQUFRLGFBQVI7O0VBQ2YsY0FBQSxHQUFpQixPQUFBLENBQVEsbUJBQVI7O0VBQ2pCLGlCQUFBLEdBQW9COztFQUVwQixNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsTUFBQSxFQUNFO01BQUEsY0FBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLE9BQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLENBQ1AsT0FETyxFQUVQLE1BRk8sRUFHUCxTQUhPLEVBSVAsS0FKTyxFQUtQLE1BTE8sRUFNUCxNQU5PLEVBT1AsTUFQTyxFQVFQLFFBUk8sQ0FEVDtRQVdBLEtBQUEsRUFDRTtVQUFBLElBQUEsRUFBTSxRQUFOO1NBWkY7T0FERjtNQWNBLGNBQUEsRUFDRTtRQUFBLFdBQUEsRUFBYSwwRkFBYjtRQUNBLElBQUEsRUFBTSxRQUROO1FBRUEsQ0FBQSxPQUFBLENBQUEsRUFBUyw4Q0FGVDtPQWZGO01Ba0JBLGdCQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sT0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsQ0FDUCxrQkFETyxFQUVQLFlBRk8sRUFHUCxzQkFITyxDQURUO1FBTUEsS0FBQSxFQUNFO1VBQUEsSUFBQSxFQUFNLFFBQU47U0FQRjtPQW5CRjtNQTJCQSxXQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sT0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsQ0FBQyxNQUFELEVBQVMsTUFBVCxFQUFpQixNQUFqQixDQURUO09BNUJGO01BOEJBLE1BQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxRQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxNQURUO1FBRUEsQ0FBQSxJQUFBLENBQUEsRUFBTSxDQUFDLEtBQUQsRUFBUSxNQUFSLEVBQWdCLE1BQWhCLEVBQXdCLE9BQXhCLEVBQWlDLE1BQWpDLEVBQXlDLE9BQXpDLEVBQWtELE1BQWxELEVBQTBELE1BQTFELEVBQWtFLE1BQWxFLEVBQTBFLElBQTFFLEVBQWdGLFNBQWhGLENBRk47T0EvQkY7TUFrQ0EsYUFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLElBRFQ7T0FuQ0Y7TUFxQ0EsbUJBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxRQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxPQURUO1FBRUEsQ0FBQSxJQUFBLENBQUEsRUFBTSxDQUFDLElBQUQsRUFBTyxPQUFQLEVBQWdCLE1BQWhCLEVBQXdCLE1BQXhCLEVBQWdDLE9BQWhDLENBRk47T0F0Q0Y7TUF5Q0EsZ0JBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQURUO09BMUNGO01BNENBLFlBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxRQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxNQURUO1FBRUEsQ0FBQSxJQUFBLENBQUEsRUFBTSxDQUFDLE1BQUQsRUFBUyxPQUFULENBRk47T0E3Q0Y7TUFnREEsa0JBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQURUO09BakRGO0tBREY7SUFxREEsR0FBQSxFQUNFO01BQUEsU0FBQSxFQUFXLHdCQUFYO01BQ0EsT0FBQSxFQUFTLGdDQURUO01BRUEsSUFBQSxFQUFNLDZCQUZOO01BR0EsTUFBQSxFQUFRLCtCQUhSO0tBdERGO0lBMkRBLFFBQUEsRUFBVSxTQUFBO01BQ1IsSUFBQyxDQUFBLFVBQUQsR0FBYyxJQUFJO01BQ2xCLElBQUMsQ0FBQSxVQUFVLENBQUMsc0JBQVosQ0FBbUMsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFNLEVBQUMsSUFBRCxFQUFqRDtNQUVBLElBQUMsQ0FBQSxXQUFELEdBQWUsSUFBSTtNQUNuQixJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUNmO1FBQUEsNkJBQUEsRUFBK0IsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTttQkFBRyxLQUFDLENBQUEsSUFBRCxDQUFNLEtBQUMsQ0FBQSxHQUFHLENBQUMsU0FBWDtVQUFIO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUEvQjtRQUNBLDJCQUFBLEVBQTZCLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQUcsS0FBQyxDQUFBLElBQUQsQ0FBTSxLQUFDLENBQUEsR0FBRyxDQUFDLE9BQVg7VUFBSDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FEN0I7UUFFQSw4QkFBQSxFQUFnQyxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUFHLEtBQUMsQ0FBQSxJQUFELENBQU0sS0FBQyxDQUFBLEdBQUcsQ0FBQyxJQUFYO1VBQUg7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRmhDO1FBR0EsK0JBQUEsRUFBaUMsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTttQkFBRyxLQUFDLENBQUEsSUFBRCxDQUFNLEtBQUMsQ0FBQSxHQUFHLENBQUMsTUFBWDtVQUFIO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUhqQztPQURlLENBQWpCO2FBT0EsSUFBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBZixDQUF5QixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsU0FBRDtBQUN4QyxjQUFBO1VBQUEsS0FBQTtBQUFRLG9CQUFPLFNBQVA7QUFBQSxtQkFDRCxJQUFDLENBQUEsR0FBRyxDQUFDLFNBREo7dUJBQ21CO0FBRG5CLG1CQUVELElBQUMsQ0FBQSxHQUFHLENBQUMsT0FGSjt1QkFFaUI7QUFGakIsbUJBR0QsSUFBQyxDQUFBLEdBQUcsQ0FBQyxJQUhKO3VCQUdjO0FBSGQsbUJBSUQsSUFBQyxDQUFBLEdBQUcsQ0FBQyxNQUpKO3VCQUlnQjtBQUpoQjs7VUFLUixJQUFHLEtBQUg7WUFDRSxLQUFDLENBQUEsVUFBVSxDQUFDLEtBQVosR0FBb0I7bUJBQ2hCLElBQUEsWUFBQSxDQUFhLEtBQUMsQ0FBQSxVQUFkLEVBQTBCLFNBQTFCLEVBRk47O1FBTndDO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF6QixDQUFqQjtJQVpRLENBM0RWO0lBaUZBLFVBQUEsRUFBWSxTQUFBO0FBQ1YsVUFBQTtNQUFBLElBQUMsQ0FBQSxvQkFBRCxDQUFBO21EQUNZLENBQUUsT0FBZCxDQUFBO0lBRlUsQ0FqRlo7SUFxRkEsZUFBQSxFQUFpQixTQUFBO0FBQ2YsVUFBQTtNQUFBLElBQUEsR0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQWYsQ0FBMkIsSUFBQyxDQUFBLFlBQTVCO01BQ1AsSUFBQSxDQUFvQixJQUFwQjtBQUFBLGVBQU8sTUFBUDs7TUFFQSxJQUFJLENBQUMsV0FBTCxDQUFpQixJQUFDLENBQUEsWUFBbEI7TUFFQSxJQUFrQixJQUFJLENBQUMsUUFBTCxDQUFBLENBQWUsQ0FBQyxNQUFoQixLQUEwQixDQUE1QztRQUFBLElBQUksQ0FBQyxPQUFMLENBQUEsRUFBQTs7QUFDQSxhQUFPO0lBUFEsQ0FyRmpCO0lBOEZBLElBQUEsRUFBTSxTQUFDLEdBQUQ7QUFDSixVQUFBO01BQUEsUUFBQSxHQUFXLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBZixDQUFBO01BQ1gsU0FBQSxHQUFZLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiwrQkFBaEI7TUFFWixJQUFVLElBQUMsQ0FBQSxlQUFELENBQUEsQ0FBVjtBQUFBLGVBQUE7O0FBRUEsY0FBTyxTQUFQO0FBQUEsYUFDTyxNQURQO1VBRUksSUFBd0IsUUFBUSxDQUFDLE1BQU0sQ0FBQyxXQUFoQixLQUFpQyxVQUF6RDtZQUFBLFFBQVEsQ0FBQyxTQUFULENBQUEsRUFBQTs7QUFERztBQURQLGFBR08sSUFIUDtVQUlJLElBQXNCLFFBQVEsQ0FBQyxNQUFNLENBQUMsV0FBaEIsS0FBaUMsVUFBdkQ7WUFBQSxRQUFRLENBQUMsT0FBVCxDQUFBLEVBQUE7O0FBREc7QUFIUCxhQUtPLE1BTFA7VUFNSSxJQUF3QixRQUFRLENBQUMsTUFBTSxDQUFDLFdBQWhCLEtBQWlDLFlBQXpEO1lBQUEsUUFBUSxDQUFDLFNBQVQsQ0FBQSxFQUFBOztBQU5KO2FBUUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLEdBQXBCLEVBQXlCO1FBQUEsS0FBQSxFQUFPLFNBQVA7T0FBekIsQ0FBMEMsQ0FBQyxJQUEzQyxDQUFnRCxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsWUFBRDtVQUFDLEtBQUMsQ0FBQSxlQUFEO2lCQUMvQyxRQUFRLENBQUMsUUFBVCxDQUFBO1FBRDhDO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFoRDtJQWRJLENBOUZOO0lBK0dBLGdCQUFBLEVBQWtCLFNBQUMsU0FBRDthQUNoQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0IsOEJBQXBCLEVBQW9ELENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxRQUFEO1VBQ2xELElBQUcsUUFBSDs7Y0FDRSxvQkFBcUIsT0FBQSxDQUFRLHVCQUFSOzs7Y0FDckIsS0FBQyxDQUFBLG9CQUF5QixJQUFBLGlCQUFBLENBQWtCLEtBQUMsQ0FBQSxVQUFuQjs7bUJBQzFCLEtBQUMsQ0FBQSxhQUFELEdBQWlCLFNBQVMsQ0FBQyxXQUFWLENBQXNCO2NBQUEsSUFBQSxFQUFNLEtBQUMsQ0FBQSxpQkFBUDtjQUEwQixRQUFBLEVBQVUsR0FBcEM7YUFBdEIsRUFIbkI7V0FBQSxNQUFBO21CQUtFLEtBQUMsQ0FBQSxvQkFBRCxDQUFBLEVBTEY7O1FBRGtEO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFwRDtJQURnQixDQS9HbEI7SUF3SEEsb0JBQUEsRUFBc0IsU0FBQTtBQUNwQixVQUFBOztXQUFrQixDQUFFLE9BQXBCLENBQUE7O01BQ0EsSUFBQyxDQUFBLGlCQUFELEdBQXFCOztZQUNQLENBQUUsT0FBaEIsQ0FBQTs7YUFDQSxJQUFDLENBQUEsYUFBRCxHQUFpQjtJQUpHLENBeEh0Qjs7QUFQRiIsInNvdXJjZXNDb250ZW50IjpbIntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG5cblNob3dUb2RvVmlldyA9IHJlcXVpcmUgJy4vdG9kby12aWV3J1xuVG9kb0NvbGxlY3Rpb24gPSByZXF1aXJlICcuL3RvZG8tY29sbGVjdGlvbidcblRvZG9JbmRpY2F0b3JWaWV3ID0gbnVsbFxuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIGNvbmZpZzpcbiAgICBmaW5kVGhlc2VUb2RvczpcbiAgICAgIHR5cGU6ICdhcnJheSdcbiAgICAgIGRlZmF1bHQ6IFtcbiAgICAgICAgJ0ZJWE1FJ1xuICAgICAgICAnVE9ETydcbiAgICAgICAgJ0NIQU5HRUQnXG4gICAgICAgICdYWFgnXG4gICAgICAgICdJREVBJ1xuICAgICAgICAnSEFDSydcbiAgICAgICAgJ05PVEUnXG4gICAgICAgICdSRVZJRVcnXG4gICAgICBdXG4gICAgICBpdGVtczpcbiAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICBmaW5kVXNpbmdSZWdleDpcbiAgICAgIGRlc2NyaXB0aW9uOiAnU2luZ2xlIHJlZ2V4IHVzZWQgdG8gZmluZCBhbGwgdG9kb3MuICR7VE9ET1N9IGlzIHJlcGxhY2VkIHdpdGggdGhlIGZpbmRUaGVzZVRvZG9zIGFycmF5LidcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiAnL1xcXFxiKCR7VE9ET1N9KVs6Oy4sXT9cXFxcZCooJHxcXFxccy4qJHxcXFxcKC4qJCkvZydcbiAgICBpZ25vcmVUaGVzZVBhdGhzOlxuICAgICAgdHlwZTogJ2FycmF5J1xuICAgICAgZGVmYXVsdDogW1xuICAgICAgICAnKiovbm9kZV9tb2R1bGVzLydcbiAgICAgICAgJyoqL3ZlbmRvci8nXG4gICAgICAgICcqKi9ib3dlcl9jb21wb25lbnRzLydcbiAgICAgIF1cbiAgICAgIGl0ZW1zOlxuICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgIHNob3dJblRhYmxlOlxuICAgICAgdHlwZTogJ2FycmF5J1xuICAgICAgZGVmYXVsdDogWydUZXh0JywgJ1R5cGUnLCAnUGF0aCddXG4gICAgc29ydEJ5OlxuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6ICdUZXh0J1xuICAgICAgZW51bTogWydBbGwnLCAnVGV4dCcsICdUeXBlJywgJ1JhbmdlJywgJ0xpbmUnLCAnUmVnZXgnLCAnUGF0aCcsICdGaWxlJywgJ1RhZ3MnLCAnSWQnLCAnUHJvamVjdCddXG4gICAgc29ydEFzY2VuZGluZzpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgIG9wZW5MaXN0SW5EaXJlY3Rpb246XG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogJ3JpZ2h0J1xuICAgICAgZW51bTogWyd1cCcsICdyaWdodCcsICdkb3duJywgJ2xlZnQnLCAnb250b3AnXVxuICAgIHJlbWVtYmVyVmlld1NpemU6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICBzYXZlT3V0cHV0QXM6XG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogJ0xpc3QnXG4gICAgICBlbnVtOiBbJ0xpc3QnLCAnVGFibGUnXVxuICAgIHN0YXR1c0JhckluZGljYXRvcjpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogZmFsc2VcblxuICBVUkk6XG4gICAgd29ya3NwYWNlOiAnYXRvbTovL3RvZG8tc2hvdy90b2RvcydcbiAgICBwcm9qZWN0OiAnYXRvbTovL3RvZG8tc2hvdy9wcm9qZWN0LXRvZG9zJ1xuICAgIG9wZW46ICdhdG9tOi8vdG9kby1zaG93L29wZW4tdG9kb3MnXG4gICAgYWN0aXZlOiAnYXRvbTovL3RvZG8tc2hvdy9hY3RpdmUtdG9kb3MnXG5cbiAgYWN0aXZhdGU6IC0+XG4gICAgQGNvbGxlY3Rpb24gPSBuZXcgVG9kb0NvbGxlY3Rpb25cbiAgICBAY29sbGVjdGlvbi5zZXRBdmFpbGFibGVUYWJsZUl0ZW1zKEBjb25maWcuc29ydEJ5LmVudW0pXG5cbiAgICBAZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIEBkaXNwb3NhYmxlcy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJyxcbiAgICAgICd0b2RvLXNob3c6ZmluZC1pbi13b3Jrc3BhY2UnOiA9PiBAc2hvdyhAVVJJLndvcmtzcGFjZSlcbiAgICAgICd0b2RvLXNob3c6ZmluZC1pbi1wcm9qZWN0JzogPT4gQHNob3coQFVSSS5wcm9qZWN0KVxuICAgICAgJ3RvZG8tc2hvdzpmaW5kLWluLW9wZW4tZmlsZXMnOiA9PiBAc2hvdyhAVVJJLm9wZW4pXG4gICAgICAndG9kby1zaG93OmZpbmQtaW4tYWN0aXZlLWZpbGUnOiA9PiBAc2hvdyhAVVJJLmFjdGl2ZSlcblxuICAgICMgUmVnaXN0ZXIgdGhlIHRvZG9saXN0IFVSSSwgd2hpY2ggd2lsbCB0aGVuIG9wZW4gb3VyIGN1c3RvbSB2aWV3XG4gICAgQGRpc3Bvc2FibGVzLmFkZCBhdG9tLndvcmtzcGFjZS5hZGRPcGVuZXIgKHVyaVRvT3BlbikgPT5cbiAgICAgIHNjb3BlID0gc3dpdGNoIHVyaVRvT3BlblxuICAgICAgICB3aGVuIEBVUkkud29ya3NwYWNlIHRoZW4gJ3dvcmtzcGFjZSdcbiAgICAgICAgd2hlbiBAVVJJLnByb2plY3QgdGhlbiAncHJvamVjdCdcbiAgICAgICAgd2hlbiBAVVJJLm9wZW4gdGhlbiAnb3BlbidcbiAgICAgICAgd2hlbiBAVVJJLmFjdGl2ZSB0aGVuICdhY3RpdmUnXG4gICAgICBpZiBzY29wZVxuICAgICAgICBAY29sbGVjdGlvbi5zY29wZSA9IHNjb3BlXG4gICAgICAgIG5ldyBTaG93VG9kb1ZpZXcoQGNvbGxlY3Rpb24sIHVyaVRvT3BlbilcblxuICBkZWFjdGl2YXRlOiAtPlxuICAgIEBkZXN0cm95VG9kb0luZGljYXRvcigpXG4gICAgQGRpc3Bvc2FibGVzPy5kaXNwb3NlKClcblxuICBkZXN0cm95UGFuZUl0ZW06IC0+XG4gICAgcGFuZSA9IGF0b20ud29ya3NwYWNlLnBhbmVGb3JJdGVtKEBzaG93VG9kb1ZpZXcpXG4gICAgcmV0dXJuIGZhbHNlIHVubGVzcyBwYW5lXG5cbiAgICBwYW5lLmRlc3Ryb3lJdGVtKEBzaG93VG9kb1ZpZXcpXG4gICAgIyBJZ25vcmUgY29yZS5kZXN0cm95RW1wdHlQYW5lcyBhbmQgY2xvc2UgZW1wdHkgcGFuZVxuICAgIHBhbmUuZGVzdHJveSgpIGlmIHBhbmUuZ2V0SXRlbXMoKS5sZW5ndGggaXMgMFxuICAgIHJldHVybiB0cnVlXG5cbiAgc2hvdzogKHVyaSkgLT5cbiAgICBwcmV2UGFuZSA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKVxuICAgIGRpcmVjdGlvbiA9IGF0b20uY29uZmlnLmdldCgndG9kby1zaG93Lm9wZW5MaXN0SW5EaXJlY3Rpb24nKVxuXG4gICAgcmV0dXJuIGlmIEBkZXN0cm95UGFuZUl0ZW0oKVxuXG4gICAgc3dpdGNoIGRpcmVjdGlvblxuICAgICAgd2hlbiAnZG93bidcbiAgICAgICAgcHJldlBhbmUuc3BsaXREb3duKCkgaWYgcHJldlBhbmUucGFyZW50Lm9yaWVudGF0aW9uIGlzbnQgJ3ZlcnRpY2FsJ1xuICAgICAgd2hlbiAndXAnXG4gICAgICAgIHByZXZQYW5lLnNwbGl0VXAoKSBpZiBwcmV2UGFuZS5wYXJlbnQub3JpZW50YXRpb24gaXNudCAndmVydGljYWwnXG4gICAgICB3aGVuICdsZWZ0J1xuICAgICAgICBwcmV2UGFuZS5zcGxpdExlZnQoKSBpZiBwcmV2UGFuZS5wYXJlbnQub3JpZW50YXRpb24gaXNudCAnaG9yaXpvbnRhbCdcblxuICAgIGF0b20ud29ya3NwYWNlLm9wZW4odXJpLCBzcGxpdDogZGlyZWN0aW9uKS50aGVuIChAc2hvd1RvZG9WaWV3KSA9PlxuICAgICAgcHJldlBhbmUuYWN0aXZhdGUoKVxuXG4gIGNvbnN1bWVTdGF0dXNCYXI6IChzdGF0dXNCYXIpIC0+XG4gICAgYXRvbS5jb25maWcub2JzZXJ2ZSAndG9kby1zaG93LnN0YXR1c0JhckluZGljYXRvcicsIChuZXdWYWx1ZSkgPT5cbiAgICAgIGlmIG5ld1ZhbHVlXG4gICAgICAgIFRvZG9JbmRpY2F0b3JWaWV3ID89IHJlcXVpcmUgJy4vdG9kby1pbmRpY2F0b3ItdmlldydcbiAgICAgICAgQHRvZG9JbmRpY2F0b3JWaWV3ID89IG5ldyBUb2RvSW5kaWNhdG9yVmlldyhAY29sbGVjdGlvbilcbiAgICAgICAgQHN0YXR1c0JhclRpbGUgPSBzdGF0dXNCYXIuYWRkTGVmdFRpbGUoaXRlbTogQHRvZG9JbmRpY2F0b3JWaWV3LCBwcmlvcml0eTogMjAwKVxuICAgICAgZWxzZVxuICAgICAgICBAZGVzdHJveVRvZG9JbmRpY2F0b3IoKVxuXG4gIGRlc3Ryb3lUb2RvSW5kaWNhdG9yOiAtPlxuICAgIEB0b2RvSW5kaWNhdG9yVmlldz8uZGVzdHJveSgpXG4gICAgQHRvZG9JbmRpY2F0b3JWaWV3ID0gbnVsbFxuICAgIEBzdGF0dXNCYXJUaWxlPy5kZXN0cm95KClcbiAgICBAc3RhdHVzQmFyVGlsZSA9IG51bGxcbiJdfQ==
