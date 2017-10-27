(function() {
  var CompositeDisposable, ShowTodoView;

  CompositeDisposable = require('atom').CompositeDisposable;

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
        "default": ['**/node_modules/', '**/vendor/', '**/bower_components/'],
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
            return _this.show(ShowTodoView.URI);
          };
        })(this),
        'todo-show:find-in-open-files': (function(_this) {
          return function() {
            return _this.show(ShowTodoView.URIopen);
          };
        })(this)
      }));
      return this.disposables.add(atom.workspace.addOpener(function(uriToOpen) {
        switch (uriToOpen) {
          case ShowTodoView.URI:
            return new ShowTodoView(true).getTodos();
          case ShowTodoView.URIopen:
            return new ShowTodoView(false).getTodos();
        }
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RvZG8tc2hvdy9saWIvc2hvdy10b2RvLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxpQ0FBQTs7QUFBQSxFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFBRCxDQUFBOztBQUFBLEVBRUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSxrQkFBUixDQUZmLENBQUE7O0FBQUEsRUFJQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxNQUFBLEVBRUU7QUFBQSxNQUFBLGdCQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxPQUFOO0FBQUEsUUFFQSxTQUFBLEVBQVMsQ0FDUCxRQURPLEVBRVAsNkJBRk8sRUFHUCxPQUhPLEVBSVAsNEJBSk8sRUFLUCxVQUxPLEVBTVAsK0JBTk8sRUFPUCxNQVBPLEVBUVAsMkJBUk8sRUFTUCxPQVRPLEVBVVAsNEJBVk8sRUFXUCxPQVhPLEVBWVAsNEJBWk8sRUFhUCxPQWJPLEVBY1AsNEJBZE8sRUFlUCxTQWZPLEVBZ0JQLDhCQWhCTyxDQUZUO0FBQUEsUUFvQkEsS0FBQSxFQUNFO0FBQUEsVUFBQSxJQUFBLEVBQU0sUUFBTjtTQXJCRjtPQURGO0FBQUEsTUF3QkEsZ0JBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLE9BQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxDQUNQLGtCQURPLEVBRVAsWUFGTyxFQUdQLHNCQUhPLENBRFQ7QUFBQSxRQU1BLEtBQUEsRUFDRTtBQUFBLFVBQUEsSUFBQSxFQUFNLFFBQU47U0FQRjtPQXpCRjtBQUFBLE1Ba0NBLG1CQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsT0FEVDtBQUFBLFFBRUEsTUFBQSxFQUFNLENBQUMsSUFBRCxFQUFPLE9B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

//# sourceURL=/Users/ah/.atom/packages/todo-show/lib/show-todo.coffee
