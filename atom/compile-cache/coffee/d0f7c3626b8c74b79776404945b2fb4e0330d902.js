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
        "default": ['TODO', 'FIXME', 'CHANGED', 'XXX', 'IDEA', 'HACK', 'NOTE', 'REVIEW', 'NB', 'BUG', 'QUESTION', 'COMBAK', 'TEMP'],
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RvZG8tc2hvdy9saWIvc2hvdy10b2RvLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUV4QixZQUFBLEdBQWUsT0FBQSxDQUFRLGFBQVI7O0VBQ2YsY0FBQSxHQUFpQixPQUFBLENBQVEsbUJBQVI7O0VBQ2pCLGlCQUFBLEdBQW9COztFQUVwQixNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsTUFBQSxFQUNFO01BQUEsY0FBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLE9BQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLENBQ1AsTUFETyxFQUVQLE9BRk8sRUFHUCxTQUhPLEVBSVAsS0FKTyxFQUtQLE1BTE8sRUFNUCxNQU5PLEVBT1AsTUFQTyxFQVFQLFFBUk8sRUFTUCxJQVRPLEVBVVAsS0FWTyxFQVdQLFVBWE8sRUFZUCxRQVpPLEVBYVAsTUFiTyxDQURUO1FBZ0JBLEtBQUEsRUFDRTtVQUFBLElBQUEsRUFBTSxRQUFOO1NBakJGO09BREY7TUFtQkEsY0FBQSxFQUNFO1FBQUEsV0FBQSxFQUFhLDBGQUFiO1FBQ0EsSUFBQSxFQUFNLFFBRE47UUFFQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLDhDQUZUO09BcEJGO01BdUJBLGdCQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sT0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsQ0FDUCxrQkFETyxFQUVQLFlBRk8sRUFHUCxzQkFITyxDQURUO1FBTUEsS0FBQSxFQUNFO1VBQUEsSUFBQSxFQUFNLFFBQU47U0FQRjtPQXhCRjtNQWdDQSxXQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sT0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsQ0FBQyxNQUFELEVBQVMsTUFBVCxFQUFpQixNQUFqQixDQURUO09BakNGO01BbUNBLE1BQUEsRUFD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U0FBQTtBQUNwQixVQUFBOztXQUFrQixDQUFFLE9BQXBCLENBQUE7O01BQ0EsSUFBQyxDQUFBLGlCQUFELEdBQXFCOztZQUNQLENBQUUsT0FBaEIsQ0FBQTs7YUFDQSxJQUFDLENBQUEsYUFBRCxHQUFpQjtJQUpHLENBN0h0Qjs7QUFQRiIsInNvdXJjZXNDb250ZW50IjpbIntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG5cblNob3dUb2RvVmlldyA9IHJlcXVpcmUgJy4vdG9kby12aWV3J1xuVG9kb0NvbGxlY3Rpb24gPSByZXF1aXJlICcuL3RvZG8tY29sbGVjdGlvbidcblRvZG9JbmRpY2F0b3JWaWV3ID0gbnVsbFxuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIGNvbmZpZzpcbiAgICBmaW5kVGhlc2VUb2RvczpcbiAgICAgIHR5cGU6ICdhcnJheSdcbiAgICAgIGRlZmF1bHQ6IFtcbiAgICAgICAgJ1RPRE8nXG4gICAgICAgICdGSVhNRSdcbiAgICAgICAgJ0NIQU5HRUQnXG4gICAgICAgICdYWFgnXG4gICAgICAgICdJREVBJ1xuICAgICAgICAnSEFDSydcbiAgICAgICAgJ05PVEUnXG4gICAgICAgICdSRVZJRVcnXG4gICAgICAgICdOQidcbiAgICAgICAgJ0JVRydcbiAgICAgICAgJ1FVRVNUSU9OJ1xuICAgICAgICAnQ09NQkFLJ1xuICAgICAgICAnVEVNUCdcbiAgICAgIF1cbiAgICAgIGl0ZW1zOlxuICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgIGZpbmRVc2luZ1JlZ2V4OlxuICAgICAgZGVzY3JpcHRpb246ICdTaW5nbGUgcmVnZXggdXNlZCB0byBmaW5kIGFsbCB0b2Rvcy4gJHtUT0RPU30gaXMgcmVwbGFjZWQgd2l0aCB0aGUgZmluZFRoZXNlVG9kb3MgYXJyYXkuJ1xuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6ICcvXFxcXGIoJHtUT0RPU30pWzo7LixdP1xcXFxkKigkfFxcXFxzLiokfFxcXFwoLiokKS9nJ1xuICAgIGlnbm9yZVRoZXNlUGF0aHM6XG4gICAgICB0eXBlOiAnYXJyYXknXG4gICAgICBkZWZhdWx0OiBbXG4gICAgICAgICcqKi9ub2RlX21vZHVsZXMvJ1xuICAgICAgICAnKiovdmVuZG9yLydcbiAgICAgICAgJyoqL2Jvd2VyX2NvbXBvbmVudHMvJ1xuICAgICAgXVxuICAgICAgaXRlbXM6XG4gICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgc2hvd0luVGFibGU6XG4gICAgICB0eXBlOiAnYXJyYXknXG4gICAgICBkZWZhdWx0OiBbJ1RleHQnLCAnVHlwZScsICdQYXRoJ11cbiAgICBzb3J0Qnk6XG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogJ1RleHQnXG4gICAgICBlbnVtOiBbJ0FsbCcsICdUZXh0JywgJ1R5cGUnLCAnUmFuZ2UnLCAnTGluZScsICdSZWdleCcsICdQYXRoJywgJ0ZpbGUnLCAnVGFncycsICdJZCcsICdQcm9qZWN0J11cbiAgICBzb3J0QXNjZW5kaW5nOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiB0cnVlXG4gICAgb3Blbkxpc3RJbkRpcmVjdGlvbjpcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiAncmlnaHQnXG4gICAgICBlbnVtOiBbJ3VwJywgJ3JpZ2h0JywgJ2Rvd24nLCAnbGVmdCcsICdvbnRvcCddXG4gICAgcmVtZW1iZXJWaWV3U2l6ZTpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgIHNhdmVPdXRwdXRBczpcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiAnTGlzdCdcbiAgICAgIGVudW06IFsnTGlzdCcsICdUYWJsZSddXG4gICAgc3RhdHVzQmFySW5kaWNhdG9yOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuXG4gIFVSSTpcbiAgICB3b3Jrc3BhY2U6ICdhdG9tOi8vdG9kby1zaG93L3RvZG9zJ1xuICAgIHByb2plY3Q6ICdhdG9tOi8vdG9kby1zaG93L3Byb2plY3QtdG9kb3MnXG4gICAgb3BlbjogJ2F0b206Ly90b2RvLXNob3cvb3Blbi10b2RvcydcbiAgICBhY3RpdmU6ICdhdG9tOi8vdG9kby1zaG93L2FjdGl2ZS10b2RvcydcblxuICBhY3RpdmF0ZTogLT5cbiAgICBAY29sbGVjdGlvbiA9IG5ldyBUb2RvQ29sbGVjdGlvblxuICAgIEBjb2xsZWN0aW9uLnNldEF2YWlsYWJsZVRhYmxlSXRlbXMoQGNvbmZpZy5zb3J0QnkuZW51bSlcblxuICAgIEBkaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgQGRpc3Bvc2FibGVzLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLFxuICAgICAgJ3RvZG8tc2hvdzpmaW5kLWluLXdvcmtzcGFjZSc6ID0+IEBzaG93KEBVUkkud29ya3NwYWNlKVxuICAgICAgJ3RvZG8tc2hvdzpmaW5kLWluLXByb2plY3QnOiA9PiBAc2hvdyhAVVJJLnByb2plY3QpXG4gICAgICAndG9kby1zaG93OmZpbmQtaW4tb3Blbi1maWxlcyc6ID0+IEBzaG93KEBVUkkub3BlbilcbiAgICAgICd0b2RvLXNob3c6ZmluZC1pbi1hY3RpdmUtZmlsZSc6ID0+IEBzaG93KEBVUkkuYWN0aXZlKVxuXG4gICAgIyBSZWdpc3RlciB0aGUgdG9kb2xpc3QgVVJJLCB3aGljaCB3aWxsIHRoZW4gb3BlbiBvdXIgY3VzdG9tIHZpZXdcbiAgICBAZGlzcG9zYWJsZXMuYWRkIGF0b20ud29ya3NwYWNlLmFkZE9wZW5lciAodXJpVG9PcGVuKSA9PlxuICAgICAgc2NvcGUgPSBzd2l0Y2ggdXJpVG9PcGVuXG4gICAgICAgIHdoZW4gQFVSSS53b3Jrc3BhY2UgdGhlbiAnd29ya3NwYWNlJ1xuICAgICAgICB3aGVuIEBVUkkucHJvamVjdCB0aGVuICdwcm9qZWN0J1xuICAgICAgICB3aGVuIEBVUkkub3BlbiB0aGVuICdvcGVuJ1xuICAgICAgICB3aGVuIEBVUkkuYWN0aXZlIHRoZW4gJ2FjdGl2ZSdcbiAgICAgIGlmIHNjb3BlXG4gICAgICAgIEBjb2xsZWN0aW9uLnNjb3BlID0gc2NvcGVcbiAgICAgICAgbmV3IFNob3dUb2RvVmlldyhAY29sbGVjdGlvbiwgdXJpVG9PcGVuKVxuXG4gIGRlYWN0aXZhdGU6IC0+XG4gICAgQGRlc3Ryb3lUb2RvSW5kaWNhdG9yKClcbiAgICBAZGlzcG9zYWJsZXM/LmRpc3Bvc2UoKVxuXG4gIGRlc3Ryb3lQYW5lSXRlbTogLT5cbiAgICBwYW5lID0gYXRvbS53b3Jrc3BhY2UucGFuZUZvckl0ZW0oQHNob3dUb2RvVmlldylcbiAgICByZXR1cm4gZmFsc2UgdW5sZXNzIHBhbmVcblxuICAgIHBhbmUuZGVzdHJveUl0ZW0oQHNob3dUb2RvVmlldylcbiAgICAjIElnbm9yZSBjb3JlLmRlc3Ryb3lFbXB0eVBhbmVzIGFuZCBjbG9zZSBlbXB0eSBwYW5lXG4gICAgcGFuZS5kZXN0cm95KCkgaWYgcGFuZS5nZXRJdGVtcygpLmxlbmd0aCBpcyAwXG4gICAgcmV0dXJuIHRydWVcblxuICBzaG93OiAodXJpKSAtPlxuICAgIHByZXZQYW5lID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpXG4gICAgZGlyZWN0aW9uID0gYXRvbS5jb25maWcuZ2V0KCd0b2RvLXNob3cub3Blbkxpc3RJbkRpcmVjdGlvbicpXG5cbiAgICByZXR1cm4gaWYgQGRlc3Ryb3lQYW5lSXRlbSgpXG5cbiAgICBzd2l0Y2ggZGlyZWN0aW9uXG4gICAgICB3aGVuICdkb3duJ1xuICAgICAgICBwcmV2UGFuZS5zcGxpdERvd24oKSBpZiBwcmV2UGFuZS5wYXJlbnQub3JpZW50YXRpb24gaXNudCAndmVydGljYWwnXG4gICAgICB3aGVuICd1cCdcbiAgICAgICAgcHJldlBhbmUuc3BsaXRVcCgpIGlmIHByZXZQYW5lLnBhcmVudC5vcmllbnRhdGlvbiBpc250ICd2ZXJ0aWNhbCdcbiAgICAgIHdoZW4gJ2xlZnQnXG4gICAgICAgIHByZXZQYW5lLnNwbGl0TGVmdCgpIGlmIHByZXZQYW5lLnBhcmVudC5vcmllbnRhdGlvbiBpc250ICdob3Jpem9udGFsJ1xuXG4gICAgYXRvbS53b3Jrc3BhY2Uub3Blbih1cmksIHNwbGl0OiBkaXJlY3Rpb24pLnRoZW4gKEBzaG93VG9kb1ZpZXcpID0+XG4gICAgICBwcmV2UGFuZS5hY3RpdmF0ZSgpXG5cbiAgY29uc3VtZVN0YXR1c0JhcjogKHN0YXR1c0JhcikgLT5cbiAgICBhdG9tLmNvbmZpZy5vYnNlcnZlICd0b2RvLXNob3cuc3RhdHVzQmFySW5kaWNhdG9yJywgKG5ld1ZhbHVlKSA9PlxuICAgICAgaWYgbmV3VmFsdWVcbiAgICAgICAgVG9kb0luZGljYXRvclZpZXcgPz0gcmVxdWlyZSAnLi90b2RvLWluZGljYXRvci12aWV3J1xuICAgICAgICBAdG9kb0luZGljYXRvclZpZXcgPz0gbmV3IFRvZG9JbmRpY2F0b3JWaWV3KEBjb2xsZWN0aW9uKVxuICAgICAgICBAc3RhdHVzQmFyVGlsZSA9IHN0YXR1c0Jhci5hZGRMZWZ0VGlsZShpdGVtOiBAdG9kb0luZGljYXRvclZpZXcsIHByaW9yaXR5OiAyMDApXG4gICAgICBlbHNlXG4gICAgICAgIEBkZXN0cm95VG9kb0luZGljYXRvcigpXG5cbiAgZGVzdHJveVRvZG9JbmRpY2F0b3I6IC0+XG4gICAgQHRvZG9JbmRpY2F0b3JWaWV3Py5kZXN0cm95KClcbiAgICBAdG9kb0luZGljYXRvclZpZXcgPSBudWxsXG4gICAgQHN0YXR1c0JhclRpbGU/LmRlc3Ryb3koKVxuICAgIEBzdGF0dXNCYXJUaWxlID0gbnVsbFxuIl19
