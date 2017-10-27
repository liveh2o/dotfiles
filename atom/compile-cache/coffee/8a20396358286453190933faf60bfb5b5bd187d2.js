(function() {
  var CompositeDisposable, ShowTodoView, TodoCollection, TodoIndicatorView;

  CompositeDisposable = require('atom').CompositeDisposable;

  ShowTodoView = require('./todo-view');

  TodoCollection = require('./todo-collection');

  TodoIndicatorView = null;

  module.exports = {
    config: {
      findTheseTodos: {
        description: 'An array of todo types used by the search regex.',
        type: 'array',
        "default": ['TODO', 'FIXME', 'CHANGED', 'XXX', 'IDEA', 'HACK', 'NOTE', 'REVIEW', 'NB', 'BUG', 'QUESTION', 'COMBAK', 'TEMP'],
        items: {
          type: 'string'
        }
      },
      findUsingRegex: {
        description: 'Regex string used to find all your todos. `${TODOS}` is replaced with `FindTheseTodos` from above.',
        type: 'string',
        "default": '/\\b(${TODOS})[:;.,]?\\d*($|\\s.*$|\\(.*$)/g'
      },
      ignoreThesePaths: {
        description: 'Similar to `.gitignore` (remember to use `/` on Mac/Linux and `\\` on Windows for subdirectories).',
        type: 'array',
        "default": ['node_modules', 'vendor', 'bower_components'],
        items: {
          type: 'string'
        }
      },
      showInTable: {
        description: 'An array of properties to show for each todo in table.',
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
        description: 'Defines where the todo list is shown when opened.',
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RvZG8tc2hvdy9saWIvc2hvdy10b2RvLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUV4QixZQUFBLEdBQWUsT0FBQSxDQUFRLGFBQVI7O0VBQ2YsY0FBQSxHQUFpQixPQUFBLENBQVEsbUJBQVI7O0VBQ2pCLGlCQUFBLEdBQW9COztFQUVwQixNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsTUFBQSxFQUNFO01BQUEsY0FBQSxFQUNFO1FBQUEsV0FBQSxFQUFhLGtEQUFiO1FBQ0EsSUFBQSxFQUFNLE9BRE47UUFFQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLENBQ1AsTUFETyxFQUVQLE9BRk8sRUFHUCxTQUhPLEVBSVAsS0FKTyxFQUtQLE1BTE8sRUFNUCxNQU5PLEVBT1AsTUFQTyxFQVFQLFFBUk8sRUFTUCxJQVRPLEVBVVAsS0FWTyxFQVdQLFVBWE8sRUFZUCxRQVpPLEVBYVAsTUFiTyxDQUZUO1FBaUJBLEtBQUEsRUFDRTtVQUFBLElBQUEsRUFBTSxRQUFOO1NBbEJGO09BREY7TUFvQkEsY0FBQSxFQUNFO1FBQUEsV0FBQSxFQUFhLG9HQUFiO1FBQ0EsSUFBQSxFQUFNLFFBRE47UUFFQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLDhDQUZUO09BckJGO01Bd0JBLGdCQUFBLEVBQ0U7UUFBQSxXQUFBLEVBQWEsb0dBQWI7UUFDQSxJQUFBLEVBQU0sT0FETjtRQUVBLENBQUEsT0FBQSxDQUFBLEVBQVMsQ0FDUCxjQURPLEVBRVAsUUFGTyxFQUdQLGtCQUhPLENBRlQ7UUFPQSxLQUFBLEVBQ0U7VUFBQSxJQUFBLEVBQU0sUUFBTjtTQVJGO09BekJGO01Ba0NBLFdBQUEsRUFDRTtRQUFBLFdBQUEsRUFBYSx3REFBYjtRQUNBLElBQUEsRUFBTSxPQUROO1FBRUEsQ0FBQSxPQUFBLENBQUEs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QUFELENBQUEsRUFMRjs7UUFEa0Q7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXBEO0lBRGdCLENBeEhsQjtJQWlJQSxvQkFBQSxFQUFzQixTQUFBO0FBQ3BCLFVBQUE7O1dBQWtCLENBQUUsT0FBcEIsQ0FBQTs7TUFDQSxJQUFDLENBQUEsaUJBQUQsR0FBcUI7O1lBQ1AsQ0FBRSxPQUFoQixDQUFBOzthQUNBLElBQUMsQ0FBQSxhQUFELEdBQWlCO0lBSkcsQ0FqSXRCOztBQVBGIiwic291cmNlc0NvbnRlbnQiOlsie0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSAnYXRvbSdcblxuU2hvd1RvZG9WaWV3ID0gcmVxdWlyZSAnLi90b2RvLXZpZXcnXG5Ub2RvQ29sbGVjdGlvbiA9IHJlcXVpcmUgJy4vdG9kby1jb2xsZWN0aW9uJ1xuVG9kb0luZGljYXRvclZpZXcgPSBudWxsXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgY29uZmlnOlxuICAgIGZpbmRUaGVzZVRvZG9zOlxuICAgICAgZGVzY3JpcHRpb246ICdBbiBhcnJheSBvZiB0b2RvIHR5cGVzIHVzZWQgYnkgdGhlIHNlYXJjaCByZWdleC4nXG4gICAgICB0eXBlOiAnYXJyYXknXG4gICAgICBkZWZhdWx0OiBbXG4gICAgICAgICdUT0RPJ1xuICAgICAgICAnRklYTUUnXG4gICAgICAgICdDSEFOR0VEJ1xuICAgICAgICAnWFhYJ1xuICAgICAgICAnSURFQSdcbiAgICAgICAgJ0hBQ0snXG4gICAgICAgICdOT1RFJ1xuICAgICAgICAnUkVWSUVXJ1xuICAgICAgICAnTkInXG4gICAgICAgICdCVUcnXG4gICAgICAgICdRVUVTVElPTidcbiAgICAgICAgJ0NPTUJBSydcbiAgICAgICAgJ1RFTVAnXG4gICAgICBdXG4gICAgICBpdGVtczpcbiAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICBmaW5kVXNpbmdSZWdleDpcbiAgICAgIGRlc2NyaXB0aW9uOiAnUmVnZXggc3RyaW5nIHVzZWQgdG8gZmluZCBhbGwgeW91ciB0b2Rvcy4gYCR7VE9ET1N9YCBpcyByZXBsYWNlZCB3aXRoIGBGaW5kVGhlc2VUb2Rvc2AgZnJvbSBhYm92ZS4nXG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogJy9cXFxcYigke1RPRE9TfSlbOjsuLF0/XFxcXGQqKCR8XFxcXHMuKiR8XFxcXCguKiQpL2cnXG4gICAgaWdub3JlVGhlc2VQYXRoczpcbiAgICAgIGRlc2NyaXB0aW9uOiAnU2ltaWxhciB0byBgLmdpdGlnbm9yZWAgKHJlbWVtYmVyIHRvIHVzZSBgL2Agb24gTWFjL0xpbnV4IGFuZCBgXFxcXGAgb24gV2luZG93cyBmb3Igc3ViZGlyZWN0b3JpZXMpLidcbiAgICAgIHR5cGU6ICdhcnJheSdcbiAgICAgIGRlZmF1bHQ6IFtcbiAgICAgICAgJ25vZGVfbW9kdWxlcydcbiAgICAgICAgJ3ZlbmRvcidcbiAgICAgICAgJ2Jvd2VyX2NvbXBvbmVudHMnXG4gICAgICBdXG4gICAgICBpdGVtczpcbiAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICBzaG93SW5UYWJsZTpcbiAgICAgIGRlc2NyaXB0aW9uOiAnQW4gYXJyYXkgb2YgcHJvcGVydGllcyB0byBzaG93IGZvciBlYWNoIHRvZG8gaW4gdGFibGUuJ1xuICAgICAgdHlwZTogJ2FycmF5J1xuICAgICAgZGVmYXVsdDogWydUZXh0JywgJ1R5cGUnLCAnUGF0aCddXG4gICAgc29ydEJ5OlxuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6ICdUZXh0J1xuICAgICAgZW51bTogWydBbGwnLCAnVGV4dCcsICdUeXBlJywgJ1JhbmdlJywgJ0xpbmUnLCAnUmVnZXgnLCAnUGF0aCcsICdGaWxlJywgJ1RhZ3MnLCAnSWQnLCAnUHJvamVjdCddXG4gICAgc29ydEFzY2VuZGluZzpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgIG9wZW5MaXN0SW5EaXJlY3Rpb246XG4gICAgICBkZXNjcmlwdGlvbjogJ0RlZmluZXMgd2hlcmUgdGhlIHRvZG8gbGlzdCBpcyBzaG93biB3aGVuIG9wZW5lZC4nXG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogJ3JpZ2h0J1xuICAgICAgZW51bTogWyd1cCcsICdyaWdodCcsICdkb3duJywgJ2xlZnQnLCAnb250b3AnXVxuICAgIHJlbWVtYmVyVmlld1NpemU6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICBzYXZlT3V0cHV0QXM6XG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogJ0xpc3QnXG4gICAgICBlbnVtOiBbJ0xpc3QnLCAnVGFibGUnXVxuICAgIHN0YXR1c0JhckluZGljYXRvcjpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogZmFsc2VcblxuICBVUkk6XG4gICAgd29ya3NwYWNlOiAnYXRvbTovL3RvZG8tc2hvdy90b2RvcydcbiAgICBwcm9qZWN0OiAnYXRvbTovL3RvZG8tc2hvdy9wcm9qZWN0LXRvZG9zJ1xuICAgIG9wZW46ICdhdG9tOi8vdG9kby1zaG93L29wZW4tdG9kb3MnXG4gICAgYWN0aXZlOiAnYXRvbTovL3RvZG8tc2hvdy9hY3RpdmUtdG9kb3MnXG5cbiAgYWN0aXZhdGU6IC0+XG4gICAgQGNvbGxlY3Rpb24gPSBuZXcgVG9kb0NvbGxlY3Rpb25cbiAgICBAY29sbGVjdGlvbi5zZXRBdmFpbGFibGVUYWJsZUl0ZW1zKEBjb25maWcuc29ydEJ5LmVudW0pXG5cbiAgICBAZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIEBkaXNwb3NhYmxlcy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJyxcbiAgICAgICd0b2RvLXNob3c6ZmluZC1pbi13b3Jrc3BhY2UnOiA9PiBAc2hvdyhAVVJJLndvcmtzcGFjZSlcbiAgICAgICd0b2RvLXNob3c6ZmluZC1pbi1wcm9qZWN0JzogPT4gQHNob3coQFVSSS5wcm9qZWN0KVxuICAgICAgJ3RvZG8tc2hvdzpmaW5kLWluLW9wZW4tZmlsZXMnOiA9PiBAc2hvdyhAVVJJLm9wZW4pXG4gICAgICAndG9kby1zaG93OmZpbmQtaW4tYWN0aXZlLWZpbGUnOiA9PiBAc2hvdyhAVVJJLmFjdGl2ZSlcblxuICAgICMgUmVnaXN0ZXIgdGhlIHRvZG9saXN0IFVSSSwgd2hpY2ggd2lsbCB0aGVuIG9wZW4gb3VyIGN1c3RvbSB2aWV3XG4gICAgQGRpc3Bvc2FibGVzLmFkZCBhdG9tLndvcmtzcGFjZS5hZGRPcGVuZXIgKHVyaVRvT3BlbikgPT5cbiAgICAgIHNjb3BlID0gc3dpdGNoIHVyaVRvT3BlblxuICAgICAgICB3aGVuIEBVUkkud29ya3NwYWNlIHRoZW4gJ3dvcmtzcGFjZSdcbiAgICAgICAgd2hlbiBAVVJJLnByb2plY3QgdGhlbiAncHJvamVjdCdcbiAgICAgICAgd2hlbiBAVVJJLm9wZW4gdGhlbiAnb3BlbidcbiAgICAgICAgd2hlbiBAVVJJLmFjdGl2ZSB0aGVuICdhY3RpdmUnXG4gICAgICBpZiBzY29wZVxuICAgICAgICBAY29sbGVjdGlvbi5zY29wZSA9IHNjb3BlXG4gICAgICAgIG5ldyBTaG93VG9kb1ZpZXcoQGNvbGxlY3Rpb24sIHVyaVRvT3BlbilcblxuICBkZWFjdGl2YXRlOiAtPlxuICAgIEBkZXN0cm95VG9kb0luZGljYXRvcigpXG4gICAgQGRpc3Bvc2FibGVzPy5kaXNwb3NlKClcblxuICBkZXN0cm95UGFuZUl0ZW06IC0+XG4gICAgcGFuZSA9IGF0b20ud29ya3NwYWNlLnBhbmVGb3JJdGVtKEBzaG93VG9kb1ZpZXcpXG4gICAgcmV0dXJuIGZhbHNlIHVubGVzcyBwYW5lXG5cbiAgICBwYW5lLmRlc3Ryb3lJdGVtKEBzaG93VG9kb1ZpZXcpXG4gICAgIyBJZ25vcmUgY29yZS5kZXN0cm95RW1wdHlQYW5lcyBhbmQgY2xvc2UgZW1wdHkgcGFuZVxuICAgIHBhbmUuZGVzdHJveSgpIGlmIHBhbmUuZ2V0SXRlbXMoKS5sZW5ndGggaXMgMFxuICAgIHJldHVybiB0cnVlXG5cbiAgc2hvdzogKHVyaSkgLT5cbiAgICBwcmV2UGFuZSA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKVxuICAgIGRpcmVjdGlvbiA9IGF0b20uY29uZmlnLmdldCgndG9kby1zaG93Lm9wZW5MaXN0SW5EaXJlY3Rpb24nKVxuXG4gICAgcmV0dXJuIGlmIEBkZXN0cm95UGFuZUl0ZW0oKVxuXG4gICAgc3dpdGNoIGRpcmVjdGlvblxuICAgICAgd2hlbiAnZG93bidcbiAgICAgICAgcHJldlBhbmUuc3BsaXREb3duKCkgaWYgcHJldlBhbmUucGFyZW50Lm9yaWVudGF0aW9uIGlzbnQgJ3ZlcnRpY2FsJ1xuICAgICAgd2hlbiAndXAnXG4gICAgICAgIHByZXZQYW5lLnNwbGl0VXAoKSBpZiBwcmV2UGFuZS5wYXJlbnQub3JpZW50YXRpb24gaXNudCAndmVydGljYWwnXG4gICAgICB3aGVuICdsZWZ0J1xuICAgICAgICBwcmV2UGFuZS5zcGxpdExlZnQoKSBpZiBwcmV2UGFuZS5wYXJlbnQub3JpZW50YXRpb24gaXNudCAnaG9yaXpvbnRhbCdcblxuICAgIGF0b20ud29ya3NwYWNlLm9wZW4odXJpLCBzcGxpdDogZGlyZWN0aW9uKS50aGVuIChAc2hvd1RvZG9WaWV3KSA9PlxuICAgICAgcHJldlBhbmUuYWN0aXZhdGUoKVxuXG4gIGNvbnN1bWVTdGF0dXNCYXI6IChzdGF0dXNCYXIpIC0+XG4gICAgYXRvbS5jb25maWcub2JzZXJ2ZSAndG9kby1zaG93LnN0YXR1c0JhckluZGljYXRvcicsIChuZXdWYWx1ZSkgPT5cbiAgICAgIGlmIG5ld1ZhbHVlXG4gICAgICAgIFRvZG9JbmRpY2F0b3JWaWV3ID89IHJlcXVpcmUgJy4vdG9kby1pbmRpY2F0b3ItdmlldydcbiAgICAgICAgQHRvZG9JbmRpY2F0b3JWaWV3ID89IG5ldyBUb2RvSW5kaWNhdG9yVmlldyhAY29sbGVjdGlvbilcbiAgICAgICAgQHN0YXR1c0JhclRpbGUgPSBzdGF0dXNCYXIuYWRkTGVmdFRpbGUoaXRlbTogQHRvZG9JbmRpY2F0b3JWaWV3LCBwcmlvcml0eTogMjAwKVxuICAgICAgZWxzZVxuICAgICAgICBAZGVzdHJveVRvZG9JbmRpY2F0b3IoKVxuXG4gIGRlc3Ryb3lUb2RvSW5kaWNhdG9yOiAtPlxuICAgIEB0b2RvSW5kaWNhdG9yVmlldz8uZGVzdHJveSgpXG4gICAgQHRvZG9JbmRpY2F0b3JWaWV3ID0gbnVsbFxuICAgIEBzdGF0dXNCYXJUaWxlPy5kZXN0cm95KClcbiAgICBAc3RhdHVzQmFyVGlsZSA9IG51bGxcbiJdfQ==
