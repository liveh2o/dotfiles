(function() {
  var CompositeDisposable, ScrollView, ShowTodoView, TextBuffer, TextEditorView, TodoOptions, TodoTable, deprecatedTextEditor, fs, path, ref, ref1,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ref = require('atom'), CompositeDisposable = ref.CompositeDisposable, TextBuffer = ref.TextBuffer;

  ref1 = require('atom-space-pen-views'), ScrollView = ref1.ScrollView, TextEditorView = ref1.TextEditorView;

  path = require('path');

  fs = require('fs-plus');

  TodoTable = require('./todo-table-view');

  TodoOptions = require('./todo-options-view');

  deprecatedTextEditor = function(params) {
    var TextEditor;
    if (atom.workspace.buildTextEditor != null) {
      return atom.workspace.buildTextEditor(params);
    } else {
      TextEditor = require('atom').TextEditor;
      return new TextEditor(params);
    }
  };

  module.exports = ShowTodoView = (function(superClass) {
    extend(ShowTodoView, superClass);

    ShowTodoView.content = function(collection, filterBuffer) {
      var filterEditor;
      filterEditor = deprecatedTextEditor({
        mini: true,
        tabLength: 2,
        softTabs: true,
        softWrapped: false,
        buffer: filterBuffer,
        placeholderText: 'Search Todos'
      });
      return this.div({
        "class": 'show-todo-preview',
        tabindex: -1
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'input-block'
          }, function() {
            _this.div({
              "class": 'input-block-item input-block-item--flex'
            }, function() {
              return _this.subview('filterEditorView', new TextEditorView({
                editor: filterEditor
              }));
            });
            return _this.div({
              "class": 'input-block-item'
            }, function() {
              return _this.div({
                "class": 'btn-group'
              }, function() {
                _this.button({
                  outlet: 'scopeButton',
                  "class": 'btn'
                });
                _this.button({
                  outlet: 'optionsButton',
                  "class": 'btn icon-gear'
                });
                _this.button({
                  outlet: 'saveAsButton',
                  "class": 'btn icon-cloud-download'
                });
                return _this.button({
                  outlet: 'refreshButton',
                  "class": 'btn icon-sync'
                });
              });
            });
          });
          _this.div({
            "class": 'input-block todo-info-block'
          }, function() {
            return _this.div({
              "class": 'input-block-item'
            }, function() {
              return _this.span({
                outlet: 'todoInfo'
              });
            });
          });
          _this.div({
            outlet: 'optionsView'
          });
          _this.div({
            outlet: 'todoLoading',
            "class": 'todo-loading'
          }, function() {
            _this.div({
              "class": 'markdown-spinner'
            });
            return _this.h5({
              outlet: 'searchCount',
              "class": 'text-center'
            }, "Loading Todos...");
          });
          return _this.subview('todoTable', new TodoTable(collection));
        };
      })(this));
    };

    function ShowTodoView(collection1, uri) {
      this.collection = collection1;
      this.uri = uri;
      this.toggleOptions = bind(this.toggleOptions, this);
      this.setScopeButtonState = bind(this.setScopeButtonState, this);
      this.toggleSearchScope = bind(this.toggleSearchScope, this);
      this.saveAs = bind(this.saveAs, this);
      this.stopLoading = bind(this.stopLoading, this);
      this.startLoading = bind(this.startLoading, this);
      ShowTodoView.__super__.constructor.call(this, this.collection, this.filterBuffer = new TextBuffer);
    }

    ShowTodoView.prototype.initialize = function() {
      this.disposables = new CompositeDisposable;
      this.handleEvents();
      this.setScopeButtonState(this.collection.getSearchScope());
      this.onlySearchWhenVisible = true;
      this.notificationOptions = {
        detail: 'Atom todo-show package',
        dismissable: true,
        icon: this.getIconName()
      };
      this.checkDeprecation();
      this.disposables.add(atom.tooltips.add(this.scopeButton, {
        title: "What to Search"
      }));
      this.disposables.add(atom.tooltips.add(this.optionsButton, {
        title: "Show Todo Options"
      }));
      this.disposables.add(atom.tooltips.add(this.saveAsButton, {
        title: "Save Todos to File"
      }));
      return this.disposables.add(atom.tooltips.add(this.refreshButton, {
        title: "Refresh Todos"
      }));
    };

    ShowTodoView.prototype.handleEvents = function() {
      this.disposables.add(atom.commands.add(this.element, {
        'core:save-as': (function(_this) {
          return function(event) {
            event.stopPropagation();
            return _this.saveAs();
          };
        })(this),
        'core:refresh': (function(_this) {
          return function(event) {
            event.stopPropagation();
            return _this.search();
          };
        })(this)
      }));
      this.disposables.add(this.collection.onDidStartSearch(this.startLoading));
      this.disposables.add(this.collection.onDidFinishSearch(this.stopLoading));
      this.disposables.add(this.collection.onDidFailSearch((function(_this) {
        return function(err) {
          _this.searchCount.text("Search Failed");
          if (err) {
            console.error(err);
          }
          if (err) {
            return _this.showError(err);
          }
        };
      })(this)));
      this.disposables.add(this.collection.onDidChangeSearchScope((function(_this) {
        return function(scope) {
          _this.setScopeButtonState(scope);
          return _this.search();
        };
      })(this)));
      this.disposables.add(this.collection.onDidSearchPaths((function(_this) {
        return function(nPaths) {
          return _this.searchCount.text(nPaths + " paths searched...");
        };
      })(this)));
      this.disposables.add(atom.workspace.onDidChangeActivePaneItem((function(_this) {
        return function(item) {
          if (_this.collection.setActiveProject(item != null ? typeof item.getPath === "function" ? item.getPath() : void 0 : void 0) || ((item != null ? item.constructor.name : void 0) === 'TextEditor' && _this.collection.scope === 'active')) {
            return _this.search();
          }
        };
      })(this)));
      this.disposables.add(atom.workspace.onDidAddTextEditor((function(_this) {
        return function(arg) {
          var textEditor;
          textEditor = arg.textEditor;
          if (_this.collection.scope === 'open' && atom.config.get('todo-show.autoRefresh')) {
            return _this.search();
          }
        };
      })(this)));
      this.disposables.add(atom.workspace.onDidDestroyPaneItem((function(_this) {
        return function(arg) {
          var item;
          item = arg.item;
          if (_this.collection.scope === 'open' && atom.config.get('todo-show.autoRefresh')) {
            return _this.search();
          }
        };
      })(this)));
      this.disposables.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          return _this.disposables.add(editor.onDidSave(function() {
            if (atom.config.get('todo-show.autoRefresh')) {
              return _this.search();
            }
          }));
        };
      })(this)));
      this.filterEditorView.getModel().onDidStopChanging((function(_this) {
        return function() {
          if (_this.firstTimeFilter) {
            _this.filter();
          }
          return _this.firstTimeFilter = true;
        };
      })(this));
      this.scopeButton.on('click', this.toggleSearchScope);
      this.optionsButton.on('click', this.toggleOptions);
      this.saveAsButton.on('click', this.saveAs);
      return this.refreshButton.on('click', (function(_this) {
        return function() {
          return _this.search();
        };
      })(this));
    };

    ShowTodoView.prototype.destroy = function() {
      this.collection.cancelSearch();
      this.disposables.dispose();
      return this.detach();
    };

    ShowTodoView.prototype.serialize = function() {
      return {
        deserializer: 'todo-show/todo-view',
        scope: this.collection.scope,
        customPath: this.collection.getCustomPath()
      };
    };

    ShowTodoView.prototype.getTitle = function() {
      return "Todo Show";
    };

    ShowTodoView.prototype.getIconName = function() {
      return "checklist";
    };

    ShowTodoView.prototype.getURI = function() {
      return this.uri;
    };

    ShowTodoView.prototype.getDefaultLocation = function() {
      return 'right';
    };

    ShowTodoView.prototype.getAllowedLocations = function() {
      return ['left', 'right', 'bottom'];
    };

    ShowTodoView.prototype.getProjectName = function() {
      return this.collection.getActiveProjectName();
    };

    ShowTodoView.prototype.getProjectPath = function() {
      return this.collection.getActiveProject();
    };

    ShowTodoView.prototype.getTodos = function() {
      return this.collection.getTodos();
    };

    ShowTodoView.prototype.getTodosCount = function() {
      return this.collection.getTodosCount();
    };

    ShowTodoView.prototype.isSearching = function() {
      return this.collection.getState();
    };

    ShowTodoView.prototype.search = function() {
      var ref2;
      if (this.onlySearchWhenVisible) {
        if (!((ref2 = atom.workspace.paneContainerForItem(this)) != null ? ref2.isVisible() : void 0)) {
          return;
        }
      }
      return this.collection.search();
    };

    ShowTodoView.prototype.startLoading = function() {
      this.todoLoading.show();
      return this.updateInfo();
    };

    ShowTodoView.prototype.stopLoading = function() {
      this.todoLoading.hide();
      return this.updateInfo();
    };

    ShowTodoView.prototype.updateInfo = function() {
      return this.todoInfo.html((this.getInfoText()) + " " + (this.getScopeText()));
    };

    ShowTodoView.prototype.getInfoText = function() {
      var count;
      if (this.isSearching()) {
        return "Found ... results";
      }
      switch (count = this.getTodosCount()) {
        case 1:
          return "Found " + count + " result";
        default:
          return "Found " + count + " results";
      }
    };

    ShowTodoView.prototype.getScopeText = function() {
      switch (this.collection.scope) {
        case 'active':
          return "in active file";
        case 'open':
          return "in open files";
        case 'project':
          return "in project <code>" + (this.getProjectName()) + "</code>";
        case 'custom':
          return "in <code>" + this.collection.customPath + "</code>";
        default:
          return "in workspace";
      }
    };

    ShowTodoView.prototype.showError = function(message) {
      if (message == null) {
        message = '';
      }
      return atom.notifications.addError(message.toString(), this.notificationOptions);
    };

    ShowTodoView.prototype.showWarning = function(message) {
      if (message == null) {
        message = '';
      }
      return atom.notifications.addWarning(message.toString(), this.notificationOptions);
    };

    ShowTodoView.prototype.saveAs = function() {
      var filePath, outputFilePath, projectPath;
      if (this.isSearching()) {
        return;
      }
      filePath = (this.getProjectName() || 'todos') + ".md";
      if (projectPath = this.getProjectPath()) {
        filePath = path.join(projectPath, filePath);
      }
      if (outputFilePath = atom.showSaveDialogSync(filePath.toLowerCase())) {
        fs.writeFileSync(outputFilePath, this.collection.getMarkdown());
        return atom.workspace.open(outputFilePath);
      }
    };

    ShowTodoView.prototype.toggleSearchScope = function() {
      var scope;
      scope = this.collection.toggleSearchScope();
      return this.setScopeButtonState(scope);
    };

    ShowTodoView.prototype.setScopeButtonState = function(state) {
      switch (state) {
        case 'project':
          return this.scopeButton.text('Project');
        case 'open':
          return this.scopeButton.text('Open Files');
        case 'active':
          return this.scopeButton.text('Active File');
        case 'custom':
          return this.scopeButton.text('Custom');
        default:
          return this.scopeButton.text('Workspace');
      }
    };

    ShowTodoView.prototype.toggleOptions = function() {
      if (!this.todoOptions) {
        this.optionsView.hide();
        this.todoOptions = new TodoOptions(this.collection);
        this.optionsView.html(this.todoOptions);
      }
      return this.optionsView.slideToggle();
    };

    ShowTodoView.prototype.filter = function() {
      return this.collection.filterTodos(this.filterBuffer.getText());
    };

    ShowTodoView.prototype.checkDeprecation = function() {
      if (atom.config.get('todo-show.findTheseRegexes')) {
        return this.showWarning('Deprecation Warning:\n\n`findTheseRegexes` config is deprecated, please use `findTheseTodos` and `findUsingRegex` for custom behaviour.\nSee https://github.com/mrodalgaard/atom-todo-show#config for more information.');
      }
    };

    return ShowTodoView;

  })(ScrollView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RvZG8tc2hvdy9saWIvdG9kby12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsNElBQUE7SUFBQTs7OztFQUFBLE1BQW9DLE9BQUEsQ0FBUSxNQUFSLENBQXBDLEVBQUMsNkNBQUQsRUFBc0I7O0VBQ3RCLE9BQStCLE9BQUEsQ0FBUSxzQkFBUixDQUEvQixFQUFDLDRCQUFELEVBQWE7O0VBQ2IsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNQLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUjs7RUFFTCxTQUFBLEdBQVksT0FBQSxDQUFRLG1CQUFSOztFQUNaLFdBQUEsR0FBYyxPQUFBLENBQVEscUJBQVI7O0VBRWQsb0JBQUEsR0FBdUIsU0FBQyxNQUFEO0FBQ3JCLFFBQUE7SUFBQSxJQUFHLHNDQUFIO2FBQ0UsSUFBSSxDQUFDLFNBQVMsQ0FBQyxlQUFmLENBQStCLE1BQS9CLEVBREY7S0FBQSxNQUFBO01BR0UsVUFBQSxHQUFhLE9BQUEsQ0FBUSxNQUFSLENBQWUsQ0FBQzthQUN6QixJQUFBLFVBQUEsQ0FBVyxNQUFYLEVBSk47O0VBRHFCOztFQU92QixNQUFNLENBQUMsT0FBUCxHQUNNOzs7SUFDSixZQUFDLENBQUEsT0FBRCxHQUFVLFNBQUMsVUFBRCxFQUFhLFlBQWI7QUFDUixVQUFBO01BQUEsWUFBQSxHQUFlLG9CQUFBLENBQ2I7UUFBQSxJQUFBLEVBQU0sSUFBTjtRQUNBLFNBQUEsRUFBVyxDQURYO1FBRUEsUUFBQSxFQUFVLElBRlY7UUFHQSxXQUFBLEVBQWEsS0FIYjtRQUlBLE1BQUEsRUFBUSxZQUpSO1FBS0EsZUFBQSxFQUFpQixjQUxqQjtPQURhO2FBU2YsSUFBQyxDQUFBLEdBQUQsQ0FBSztRQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sbUJBQVA7UUFBNEIsUUFBQSxFQUFVLENBQUMsQ0FBdkM7T0FBTCxFQUErQyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7VUFDN0MsS0FBQyxDQUFBLEdBQUQsQ0FBSztZQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sYUFBUDtXQUFMLEVBQTJCLFNBQUE7WUFDekIsS0FBQyxDQUFBLEdBQUQsQ0FBSztjQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8seUNBQVA7YUFBTCxFQUF1RCxTQUFBO3FCQUNyRCxLQUFDLENBQUEsT0FBRCxDQUFTLGtCQUFULEVBQWlDLElBQUEsY0FBQSxDQUFlO2dCQUFBLE1BQUEsRUFBUSxZQUFSO2VBQWYsQ0FBakM7WUFEcUQsQ0FBdkQ7bUJBRUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztjQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sa0JBQVA7YUFBTCxFQUFnQyxTQUFBO3FCQUM5QixLQUFDLENBQUEsR0FBRCxDQUFLO2dCQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sV0FBUDtlQUFMLEVBQXlCLFNBQUE7Z0JBQ3ZCLEtBQUMsQ0FBQSxNQUFELENBQVE7a0JBQUEsTUFBQSxFQUFRLGFBQVI7a0JBQXVCLENBQUEsS0FBQSxDQUFBLEVBQU8sS0FBOUI7aUJBQVI7Z0JBQ0EsS0FBQyxDQUFBLE1BQUQsQ0FBUTtrQkFBQSxNQUFBLEVBQVEsZUFBUjtrQkFBeUIsQ0FBQSxLQUFBLENBQUEsRUFBTyxlQUFoQztpQkFBUjtnQkFDQSxLQUFDLENBQUEsTUFBRCxDQUFRO2tCQUFBLE1BQUEsRUFBUSxjQUFSO2tCQUF3QixDQUFBLEtBQUEsQ0FBQSxFQUFPLHlCQUEvQjtpQkFBUjt1QkFDQSxLQUFDLENBQUEsTUFBRCxDQUFRO2tCQUFBLE1BQUEsRUFBUSxlQUFSO2tCQUF5QixDQUFBLEtBQUEsQ0FBQSxFQUFPLGVBQWhDO2lCQUFSO2NBSnVCLENBQXpCO1lBRDhCLENBQWhDO1VBSHlCLENBQTNCO1VBVUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztZQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sNkJBQVA7V0FBTCxFQUEyQyxTQUFBO21CQUN6QyxLQUFDLENBQUEsR0FBRCxDQUFLO2NBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxrQkFBUDthQUFMLEVBQWdDLFNBQUE7cUJBQzlCLEtBQUMsQ0FBQSxJQUFELENBQU07Z0JBQUEsTUFBQSxFQUFRLFVBQVI7ZUFBTjtZQUQ4QixDQUFoQztVQUR5QyxDQUEzQztVQUlBLEtBQUMsQ0FBQSxHQUFELENBQUs7WUFBQSxNQUFBLEVBQVEsYUFBUjtXQUFMO1VBRUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztZQUFBLE1BQUEsRUFBUSxhQUFSO1lBQXVCLENBQUEsS0FBQSxDQUFBLEVBQU8sY0FBOUI7V0FBTCxFQUFtRCxTQUFBO1lBQ2pELEtBQUMsQ0FBQSxHQUFELENBQUs7Y0FBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLGtCQUFQO2FBQUw7bUJBQ0EsS0FBQyxDQUFBLEVBQUQsQ0FBSTtjQUFBLE1BQUEsRUFBUSxhQUFSO2NBQXVCLENBQUEsS0FBQSxDQUFBLEVBQU8sYUFBOUI7YUFBSixFQUFpRCxrQkFBakQ7VUFGaUQsQ0FBbkQ7aUJBSUEsS0FBQyxDQUFBLE9BQUQsQ0FBUyxXQUFULEVBQTBCLElBQUEsU0FBQSxDQUFVLFVBQVYsQ0FBMUI7UUFyQjZDO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUEvQztJQVZROztJQWlDRyxzQkFBQyxXQUFELEVBQWMsR0FBZDtNQUFDLElBQUMsQ0FBQSxhQUFEO01BQWEsSUFBQyxDQUFBLE1BQUQ7Ozs7Ozs7TUFDekIsOENBQU0sSUFBQyxDQUFBLFVBQVAsRUFBbUIsSUFBQyxDQUFBLFlBQUQsR0FBZ0IsSUFBSSxVQUF2QztJQURXOzsyQkFHYixVQUFBLEdBQVksU0FBQTtNQUNWLElBQUMsQ0FBQSxXQUFELEdBQWUsSUFBSTtNQUNuQixJQUFDLENBQUEsWUFBRCxDQUFBO01BQ0EsSUFBQyxDQUFBLG1CQUFELENBQXFCLElBQUMsQ0FBQSxVQUFVLENBQUMsY0FBWixDQUFBLENBQXJCO01BRUEsSUFBQyxDQUFBLHFCQUFELEdBQXlCO01BQ3pCLElBQUMsQ0FBQSxtQkFBRCxHQUNFO1FBQUEsTUFBQSxFQUFRLHdCQUFSO1FBQ0EsV0FBQSxFQUFhLElBRGI7UUFFQSxJQUFBLEVBQU0sSUFBQyxDQUFBLFdBQUQsQ0FBQSxDQUZOOztNQUlGLElBQUMsQ0FBQSxnQkFBRCxDQUFBO01BRUEsSUFBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixJQUFDLENBQUEsV0FBbkIsRUFBZ0M7UUFBQSxLQUFBLEVBQU8sZ0JBQVA7T0FBaEMsQ0FBakI7TUFDQSxJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLElBQUMsQ0FBQSxhQUFuQixFQUFrQztRQUFBLEtBQUEsRUFBTyxtQkFBUDtPQUFsQyxDQUFqQjtNQUNBLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsSUFBQyxDQUFBLFlBQW5CLEVBQWlDO1FBQUEsS0FBQSxFQUFPLG9CQUFQO09BQWpDLENBQWpCO2FBQ0EsSUFBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixJQUFDLENBQUEsYUFBbkIsRUFBa0M7UUFBQSxLQUFBLEVBQU8sZUFBUDtPQUFsQyxDQUFqQjtJQWhCVTs7MkJBa0JaLFlBQUEsR0FBYyxTQUFBO01BQ1osSUFBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixJQUFDLENBQUEsT0FBbkIsRUFDZjtRQUFBLGNBQUEsRUFBZ0IsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQyxLQUFEO1lBQ2QsS0FBSyxDQUFDLGVBQU4sQ0FBQTttQkFDQSxLQUFDLENBQUEsTUFBRCxDQUFBO1VBRmM7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWhCO1FBR0EsY0FBQSxFQUFnQixDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFDLEtBQUQ7WUFDZCxLQUFLLENBQUMsZUFBTixDQUFBO21CQUNBLEtBQUMsQ0FBQSxNQUFELENBQUE7VUFGYztRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FIaEI7T0FEZSxDQUFqQjtNQVFBLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQixJQUFDLENBQUEsVUFBVSxDQUFDLGdCQUFaLENBQTZCLElBQUMsQ0FBQSxZQUE5QixDQUFqQjtNQUNBLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQixJQUFDLENBQUEsVUFBVSxDQUFDLGlCQUFaLENBQThCLElBQUMsQ0FBQSxXQUEvQixDQUFqQjtNQUNBLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQixJQUFDLENBQUEsVUFBVSxDQUFDLGVBQVosQ0FBNEIsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLEdBQUQ7VUFDM0MsS0FBQyxDQUFBLFdBQVcsQ0FBQyxJQUFiLENBQWtCLGVBQWxCO1VBQ0EsSUFBcUIsR0FBckI7WUFBQSxPQUFPLENBQUMsS0FBUixDQUFjLEdBQWQsRUFBQTs7VUFDQSxJQUFrQixHQUFsQjttQkFBQSxLQUFDLENBQUEsU0FBRCxDQUFXLEdBQVgsRUFBQTs7UUFIMkM7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTVCLENBQWpCO01BS0EsSUFBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCLElBQUMsQ0FBQSxVQUFVLENBQUMsc0JBQVosQ0FBbUMsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLEtBQUQ7VUFDbEQsS0FBQyxDQUFBLG1CQUFELENBQXFCLEtBQXJCO2lCQUNBLEtBQUMsQ0FBQSxNQUFELENBQUE7UUFGa0Q7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQW5DLENBQWpCO01BSUEsSUFBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCLElBQUMsQ0FBQSxVQUFVLENBQUMsZ0JBQVosQ0FBNkIsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLE1BQUQ7aUJBQzVDLEtBQUMsQ0FBQSxXQUFXLENBQUMsSUFBYixDQUFxQixNQUFELEdBQVEsb0JBQTVCO1FBRDRDO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE3QixDQUFqQjtNQUdBLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQixJQUFJLENBQUMsU0FBUyxDQUFDLHlCQUFmLENBQXlDLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxJQUFEO1VBQ3hELElBQUcsS0FBQyxDQUFBLFVBQVUsQ0FBQyxnQkFBWixxREFBNkIsSUFBSSxDQUFFLDJCQUFuQyxDQUFBLElBQ0gsaUJBQUMsSUFBSSxDQUFFLFdBQVcsQ0FBQyxjQUFsQixLQUEwQixZQUExQixJQUEyQyxLQUFDLENBQUEsVUFBVSxDQUFDLEtBQVosS0FBcUIsUUFBakUsQ0FEQTttQkFFRSxLQUFDLENBQUEsTUFBRCxDQUFBLEVBRkY7O1FBRHdEO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF6QyxDQUFqQjtNQUtBLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQixJQUFJLENBQUMsU0FBUyxDQUFDLGtCQUFmLENBQWtDLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxHQUFEO0FBQ2pELGNBQUE7VUFEbUQsYUFBRDtVQUNsRCxJQUFHLEtBQUMsQ0FBQSxVQUFVLENBQUMsS0FBWixLQUFxQixNQUFyQixJQUFnQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsdUJBQWhCLENBQW5DO21CQUNFLEtBQUMsQ0FBQSxNQUFELENBQUEsRUFERjs7UUFEaUQ7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWxDLENBQWpCO01BSUEsSUFBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCLElBQUksQ0FBQyxTQUFTLENBQUMsb0JBQWYsQ0FBb0MsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLEdBQUQ7QUFDbkQsY0FBQTtVQURxRCxPQUFEO1VBQ3BELElBQUcsS0FBQyxDQUFBLFVBQVUsQ0FBQyxLQUFaLEtBQXFCLE1BQXJCLElBQWdDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix1QkFBaEIsQ0FBbkM7bUJBQ0UsS0FBQyxDQUFBLE1BQUQsQ0FBQSxFQURGOztRQURtRDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBcEMsQ0FBakI7TUFJQSxJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBZixDQUFrQyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsTUFBRDtpQkFDakQsS0FBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCLE1BQU0sQ0FBQyxTQUFQLENBQWlCLFNBQUE7WUFDaEMsSUFBYSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsdUJBQWhCLENBQWI7cUJBQUEsS0FBQyxDQUFBLE1BQUQsQ0FBQSxFQUFBOztVQURnQyxDQUFqQixDQUFqQjtRQURpRDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEMsQ0FBakI7TUFJQSxJQUFDLENBQUEsZ0JBQWdCLENBQUMsUUFBbEIsQ0FBQSxDQUE0QixDQUFDLGlCQUE3QixDQUErQyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7VUFDN0MsSUFBYSxLQUFDLENBQUEsZUFBZDtZQUFBLEtBQUMsQ0FBQSxNQUFELENBQUEsRUFBQTs7aUJBQ0EsS0FBQyxDQUFBLGVBQUQsR0FBbUI7UUFGMEI7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQS9DO01BSUEsSUFBQyxDQUFBLFdBQVcsQ0FBQyxFQUFiLENBQWdCLE9BQWhCLEVBQXlCLElBQUMsQ0FBQSxpQkFBMUI7TUFDQSxJQUFDLENBQUEsYUFBYSxDQUFDLEVBQWYsQ0FBa0IsT0FBbEIsRUFBMkIsSUFBQyxDQUFBLGFBQTVCO01BQ0EsSUFBQyxDQUFBLFlBQVksQ0FBQyxFQUFkLENBQWlCLE9BQWpCLEVBQTBCLElBQUMsQ0FBQSxNQUEzQjthQUNBLElBQUMsQ0FBQSxhQUFhLENBQUMsRUFBZixDQUFrQixPQUFsQixFQUEyQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQUcsS0FBQyxDQUFBLE1BQUQsQ0FBQTtRQUFIO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUEzQjtJQS9DWTs7MkJBaURkLE9BQUEsR0FBUyxTQUFBO01BQ1AsSUFBQyxDQUFBLFVBQVUsQ0FBQyxZQUFaLENBQUE7TUFDQSxJQUFDLENBQUEsV0FBVyxDQUFDLE9BQWIsQ0FBQTthQUNBLElBQUMsQ0FBQSxNQUFELENBQUE7SUFITzs7MkJBS1QsU0FBQSxHQUFXLFNBQUE7YUFDVDtRQUFBLFlBQUEsRUFBYyxxQkFBZDtRQUNBLEtBQUEsRUFBTyxJQUFDLENBQUEsVUFBVSxDQUFDLEtBRG5CO1FBRUEsVUFBQSxFQUFZLElBQUMsQ0FBQSxVQUFVLENBQUMsYUFBWixDQUFBLENBRlo7O0lBRFM7OzJCQUtYLFFBQUEsR0FBVSxTQUFBO2FBQUc7SUFBSDs7MkJBQ1YsV0FBQSxHQUFhLFNBQUE7YUFBRztJQUFIOzsyQkFDYixNQUFBLEdBQVEsU0FBQTthQUFHLElBQUMsQ0FBQTtJQUFKOzsyQkFDUixrQkFBQSxHQUFvQixTQUFBO2FBQUc7SUFBSDs7MkJBQ3BCLG1CQUFBLEdBQXFCLFNBQUE7YUFBRyxDQUFDLE1BQUQsRUFBUyxPQUFULEVBQWtCLFFBQWxCO0lBQUg7OzJCQUNyQixjQUFBLEdBQWdCLFNBQUE7YUFBRyxJQUFDLENBQUEsVUFBVSxDQUFDLG9CQUFaLENBQUE7SUFBSDs7MkJBQ2hCLGNBQUEsR0FBZ0IsU0FBQTthQUFHLElBQUMsQ0FBQSxVQUFVLENBQUMsZ0JBQVosQ0FBQTtJQUFIOzsyQkFFaEIsUUFBQSxHQUFVLFNBQUE7YUFBRyxJQUFDLENBQUEsVUFBVSxDQUFDLFFBQVosQ0FBQTtJQUFIOzsyQkFDVixhQUFBLEdBQWUsU0FBQTthQUFHLElBQUMsQ0FBQSxVQUFVLENBQUMsYUFBWixDQUFBO0lBQUg7OzJCQUNmLFdBQUEsR0FBYSxTQUFBO2FBQUcsSUFBQyxDQUFBLFVBQVUsQ0FBQyxRQUFaLENBQUE7SUFBSDs7MkJBQ2IsTUFBQSxHQUFRLFNBQUE7QUFDTixVQUFBO01BQUEsSUFBRyxJQUFDLENBQUEscUJBQUo7UUFDRSxJQUFBLG1FQUF1RCxDQUFFLFNBQTNDLENBQUEsV0FBZDtBQUFBLGlCQUFBO1NBREY7O2FBRUEsSUFBQyxDQUFBLFVBQVUsQ0FBQyxNQUFaLENBQUE7SUFITTs7MkJBS1IsWUFBQSxHQUFjLFNBQUE7TUFDWixJQUFDLENBQUEsV0FBVyxDQUFDLElBQWIsQ0FBQTthQUNBLElBQUMsQ0FBQSxVQUFELENBQUE7SUFGWTs7MkJBSWQsV0FBQSxHQUFhLFNBQUE7TUFDWCxJQUFDLENBQUEsV0FBVyxDQUFDLElBQWIsQ0FBQTthQUNBLElBQUMsQ0FBQSxVQUFELENBQUE7SUFGVzs7MkJBSWIsVUFBQSxHQUFZLFNBQUE7YUFDVixJQUFDLENBQUEsUUFBUSxDQUFDLElBQVYsQ0FBaUIsQ0FBQyxJQUFDLENBQUEsV0FBRCxDQUFBLENBQUQsQ0FBQSxHQUFnQixHQUFoQixHQUFrQixDQUFDLElBQUMsQ0FBQSxZQUFELENBQUEsQ0FBRCxDQUFuQztJQURVOzsyQkFHWixXQUFBLEdBQWEsU0FBQTtBQUNYLFVBQUE7TUFBQSxJQUE4QixJQUFDLENBQUEsV0FBRCxDQUFBLENBQTlCO0FBQUEsZUFBTyxvQkFBUDs7QUFDQSxjQUFPLEtBQUEsR0FBUSxJQUFDLENBQUEsYUFBRCxDQUFBLENBQWY7QUFBQSxhQUNPLENBRFA7aUJBQ2MsUUFBQSxHQUFTLEtBQVQsR0FBZTtBQUQ3QjtpQkFFTyxRQUFBLEdBQVMsS0FBVCxHQUFlO0FBRnRCO0lBRlc7OzJCQU1iLFlBQUEsR0FBYyxTQUFBO0FBR1osY0FBTyxJQUFDLENBQUEsVUFBVSxDQUFDLEtBQW5CO0FBQUEsYUFDTyxRQURQO2lCQUVJO0FBRkosYUFHTyxNQUhQO2lCQUlJO0FBSkosYUFLTyxTQUxQO2lCQU1JLG1CQUFBLEdBQW1CLENBQUMsSUFBQyxDQUFBLGNBQUQsQ0FBQSxDQUFELENBQW5CLEdBQXNDO0FBTjFDLGFBT08sUUFQUDtpQkFRSSxXQUFBLEdBQVksSUFBQyxDQUFBLFVBQVUsQ0FBQyxVQUF4QixHQUFtQztBQVJ2QztpQkFVSTtBQVZKO0lBSFk7OzJCQWVkLFNBQUEsR0FBVyxTQUFDLE9BQUQ7O1FBQUMsVUFBVTs7YUFDcEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFuQixDQUE0QixPQUFPLENBQUMsUUFBUixDQUFBLENBQTVCLEVBQWdELElBQUMsQ0FBQSxtQkFBakQ7SUFEUzs7MkJBR1gsV0FBQSxHQUFhLFNBQUMsT0FBRDs7UUFBQyxVQUFVOzthQUN0QixJQUFJLENBQUMsYUFBYSxDQUFDLFVBQW5CLENBQThCLE9BQU8sQ0FBQyxRQUFSLENBQUEsQ0FBOUIsRUFBa0QsSUFBQyxDQUFBLG1CQUFuRDtJQURXOzsyQkFHYixNQUFBLEdBQVEsU0FBQTtBQUNOLFVBQUE7TUFBQSxJQUFVLElBQUMsQ0FBQSxXQUFELENBQUEsQ0FBVjtBQUFBLGVBQUE7O01BRUEsUUFBQSxHQUFhLENBQUMsSUFBQyxDQUFBLGNBQUQsQ0FBQSxDQUFBLElBQXFCLE9BQXRCLENBQUEsR0FBOEI7TUFDM0MsSUFBRyxXQUFBLEdBQWMsSUFBQyxDQUFBLGNBQUQsQ0FBQSxDQUFqQjtRQUNFLFFBQUEsR0FBVyxJQUFJLENBQUMsSUFBTCxDQUFVLFdBQVYsRUFBdUIsUUFBdkIsRUFEYjs7TUFHQSxJQUFHLGNBQUEsR0FBaUIsSUFBSSxDQUFDLGtCQUFMLENBQXdCLFFBQVEsQ0FBQyxXQUFULENBQUEsQ0FBeEIsQ0FBcEI7UUFDRSxFQUFFLENBQUMsYUFBSCxDQUFpQixjQUFqQixFQUFpQyxJQUFDLENBQUEsVUFBVSxDQUFDLFdBQVosQ0FBQSxDQUFqQztlQUNBLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixjQUFwQixFQUZGOztJQVBNOzsyQkFXUixpQkFBQSxHQUFtQixTQUFBO0FBQ2pCLFVBQUE7TUFBQSxLQUFBLEdBQVEsSUFBQyxDQUFBLFVBQVUsQ0FBQyxpQkFBWixDQUFBO2FBQ1IsSUFBQyxDQUFBLG1CQUFELENBQXFCLEtBQXJCO0lBRmlCOzsyQkFJbkIsbUJBQUEsR0FBcUIsU0FBQyxLQUFEO0FBQ25CLGNBQU8sS0FBUDtBQUFBLGFBQ08sU0FEUDtpQkFDc0IsSUFBQyxDQUFBLFdBQVcsQ0FBQyxJQUFiLENBQWtCLFNBQWxCO0FBRHRCLGFBRU8sTUFGUDtpQkFFbUIsSUFBQyxDQUFBLFdBQVcsQ0FBQyxJQUFiLENBQWtCLFlBQWxCO0FBRm5CLGFBR08sUUFIUDtpQkFHcUIsSUFBQyxDQUFBLFdBQVcsQ0FBQyxJQUFiLENBQWtCLGFBQWxCO0FBSHJCLGFBSU8sUUFKUDtpQkFJcUIsSUFBQyxDQUFBLFdBQVcsQ0FBQyxJQUFiLENBQWtCLFFBQWxCO0FBSnJCO2lCQUtPLElBQUMsQ0FBQSxXQUFXLENBQUMsSUFBYixDQUFrQixXQUFsQjtBQUxQO0lBRG1COzsyQkFRckIsYUFBQSxHQUFlLFNBQUE7TUFDYixJQUFBLENBQU8sSUFBQyxDQUFBLFdBQVI7UUFDRSxJQUFDLENBQUEsV0FBVyxDQUFDLElBQWIsQ0FBQTtRQUNBLElBQUMsQ0FBQSxXQUFELEdBQW1CLElBQUEsV0FBQSxDQUFZLElBQUMsQ0FBQSxVQUFiO1FBQ25CLElBQUMsQ0FBQSxXQUFXLENBQUMsSUFBYixDQUFrQixJQUFDLENBQUEsV0FBbkIsRUFIRjs7YUFJQSxJQUFDLENBQUEsV0FBVyxDQUFDLFdBQWIsQ0FBQTtJQUxhOzsyQkFPZixNQUFBLEdBQVEsU0FBQTthQUNOLElBQUMsQ0FBQSxVQUFVLENBQUMsV0FBWixDQUF3QixJQUFDLENBQUEsWUFBWSxDQUFDLE9BQWQsQ0FBQSxDQUF4QjtJQURNOzsyQkFHUixnQkFBQSxHQUFrQixTQUFBO01BQ2hCLElBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDRCQUFoQixDQUFIO2VBQ0UsSUFBQyxDQUFBLFdBQUQsQ0FBYSx5TkFBYixFQURGOztJQURnQjs7OztLQXpNTztBQWhCM0IiLCJzb3VyY2VzQ29udGVudCI6WyJ7Q29tcG9zaXRlRGlzcG9zYWJsZSwgVGV4dEJ1ZmZlcn0gPSByZXF1aXJlICdhdG9tJ1xue1Njcm9sbFZpZXcsIFRleHRFZGl0b3JWaWV3fSA9IHJlcXVpcmUgJ2F0b20tc3BhY2UtcGVuLXZpZXdzJ1xucGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG5mcyA9IHJlcXVpcmUgJ2ZzLXBsdXMnXG5cblRvZG9UYWJsZSA9IHJlcXVpcmUgJy4vdG9kby10YWJsZS12aWV3J1xuVG9kb09wdGlvbnMgPSByZXF1aXJlICcuL3RvZG8tb3B0aW9ucy12aWV3J1xuXG5kZXByZWNhdGVkVGV4dEVkaXRvciA9IChwYXJhbXMpIC0+XG4gIGlmIGF0b20ud29ya3NwYWNlLmJ1aWxkVGV4dEVkaXRvcj9cbiAgICBhdG9tLndvcmtzcGFjZS5idWlsZFRleHRFZGl0b3IocGFyYW1zKVxuICBlbHNlXG4gICAgVGV4dEVkaXRvciA9IHJlcXVpcmUoJ2F0b20nKS5UZXh0RWRpdG9yXG4gICAgbmV3IFRleHRFZGl0b3IocGFyYW1zKVxuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBTaG93VG9kb1ZpZXcgZXh0ZW5kcyBTY3JvbGxWaWV3XG4gIEBjb250ZW50OiAoY29sbGVjdGlvbiwgZmlsdGVyQnVmZmVyKSAtPlxuICAgIGZpbHRlckVkaXRvciA9IGRlcHJlY2F0ZWRUZXh0RWRpdG9yKFxuICAgICAgbWluaTogdHJ1ZVxuICAgICAgdGFiTGVuZ3RoOiAyXG4gICAgICBzb2Z0VGFiczogdHJ1ZVxuICAgICAgc29mdFdyYXBwZWQ6IGZhbHNlXG4gICAgICBidWZmZXI6IGZpbHRlckJ1ZmZlclxuICAgICAgcGxhY2Vob2xkZXJUZXh0OiAnU2VhcmNoIFRvZG9zJ1xuICAgIClcblxuICAgIEBkaXYgY2xhc3M6ICdzaG93LXRvZG8tcHJldmlldycsIHRhYmluZGV4OiAtMSwgPT5cbiAgICAgIEBkaXYgY2xhc3M6ICdpbnB1dC1ibG9jaycsID0+XG4gICAgICAgIEBkaXYgY2xhc3M6ICdpbnB1dC1ibG9jay1pdGVtIGlucHV0LWJsb2NrLWl0ZW0tLWZsZXgnLCA9PlxuICAgICAgICAgIEBzdWJ2aWV3ICdmaWx0ZXJFZGl0b3JWaWV3JywgbmV3IFRleHRFZGl0b3JWaWV3KGVkaXRvcjogZmlsdGVyRWRpdG9yKVxuICAgICAgICBAZGl2IGNsYXNzOiAnaW5wdXQtYmxvY2staXRlbScsID0+XG4gICAgICAgICAgQGRpdiBjbGFzczogJ2J0bi1ncm91cCcsID0+XG4gICAgICAgICAgICBAYnV0dG9uIG91dGxldDogJ3Njb3BlQnV0dG9uJywgY2xhc3M6ICdidG4nXG4gICAgICAgICAgICBAYnV0dG9uIG91dGxldDogJ29wdGlvbnNCdXR0b24nLCBjbGFzczogJ2J0biBpY29uLWdlYXInXG4gICAgICAgICAgICBAYnV0dG9uIG91dGxldDogJ3NhdmVBc0J1dHRvbicsIGNsYXNzOiAnYnRuIGljb24tY2xvdWQtZG93bmxvYWQnXG4gICAgICAgICAgICBAYnV0dG9uIG91dGxldDogJ3JlZnJlc2hCdXR0b24nLCBjbGFzczogJ2J0biBpY29uLXN5bmMnXG5cbiAgICAgIEBkaXYgY2xhc3M6ICdpbnB1dC1ibG9jayB0b2RvLWluZm8tYmxvY2snLCA9PlxuICAgICAgICBAZGl2IGNsYXNzOiAnaW5wdXQtYmxvY2staXRlbScsID0+XG4gICAgICAgICAgQHNwYW4gb3V0bGV0OiAndG9kb0luZm8nXG5cbiAgICAgIEBkaXYgb3V0bGV0OiAnb3B0aW9uc1ZpZXcnXG5cbiAgICAgIEBkaXYgb3V0bGV0OiAndG9kb0xvYWRpbmcnLCBjbGFzczogJ3RvZG8tbG9hZGluZycsID0+XG4gICAgICAgIEBkaXYgY2xhc3M6ICdtYXJrZG93bi1zcGlubmVyJ1xuICAgICAgICBAaDUgb3V0bGV0OiAnc2VhcmNoQ291bnQnLCBjbGFzczogJ3RleHQtY2VudGVyJywgXCJMb2FkaW5nIFRvZG9zLi4uXCJcblxuICAgICAgQHN1YnZpZXcgJ3RvZG9UYWJsZScsIG5ldyBUb2RvVGFibGUoY29sbGVjdGlvbilcblxuICBjb25zdHJ1Y3RvcjogKEBjb2xsZWN0aW9uLCBAdXJpKSAtPlxuICAgIHN1cGVyIEBjb2xsZWN0aW9uLCBAZmlsdGVyQnVmZmVyID0gbmV3IFRleHRCdWZmZXJcblxuICBpbml0aWFsaXplOiAtPlxuICAgIEBkaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgQGhhbmRsZUV2ZW50cygpXG4gICAgQHNldFNjb3BlQnV0dG9uU3RhdGUoQGNvbGxlY3Rpb24uZ2V0U2VhcmNoU2NvcGUoKSlcblxuICAgIEBvbmx5U2VhcmNoV2hlblZpc2libGUgPSB0cnVlXG4gICAgQG5vdGlmaWNhdGlvbk9wdGlvbnMgPVxuICAgICAgZGV0YWlsOiAnQXRvbSB0b2RvLXNob3cgcGFja2FnZSdcbiAgICAgIGRpc21pc3NhYmxlOiB0cnVlXG4gICAgICBpY29uOiBAZ2V0SWNvbk5hbWUoKVxuXG4gICAgQGNoZWNrRGVwcmVjYXRpb24oKVxuXG4gICAgQGRpc3Bvc2FibGVzLmFkZCBhdG9tLnRvb2x0aXBzLmFkZCBAc2NvcGVCdXR0b24sIHRpdGxlOiBcIldoYXQgdG8gU2VhcmNoXCJcbiAgICBAZGlzcG9zYWJsZXMuYWRkIGF0b20udG9vbHRpcHMuYWRkIEBvcHRpb25zQnV0dG9uLCB0aXRsZTogXCJTaG93IFRvZG8gT3B0aW9uc1wiXG4gICAgQGRpc3Bvc2FibGVzLmFkZCBhdG9tLnRvb2x0aXBzLmFkZCBAc2F2ZUFzQnV0dG9uLCB0aXRsZTogXCJTYXZlIFRvZG9zIHRvIEZpbGVcIlxuICAgIEBkaXNwb3NhYmxlcy5hZGQgYXRvbS50b29sdGlwcy5hZGQgQHJlZnJlc2hCdXR0b24sIHRpdGxlOiBcIlJlZnJlc2ggVG9kb3NcIlxuXG4gIGhhbmRsZUV2ZW50czogLT5cbiAgICBAZGlzcG9zYWJsZXMuYWRkIGF0b20uY29tbWFuZHMuYWRkIEBlbGVtZW50LFxuICAgICAgJ2NvcmU6c2F2ZS1hcyc6IChldmVudCkgPT5cbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgQHNhdmVBcygpXG4gICAgICAnY29yZTpyZWZyZXNoJzogKGV2ZW50KSA9PlxuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICBAc2VhcmNoKClcblxuICAgIEBkaXNwb3NhYmxlcy5hZGQgQGNvbGxlY3Rpb24ub25EaWRTdGFydFNlYXJjaCBAc3RhcnRMb2FkaW5nXG4gICAgQGRpc3Bvc2FibGVzLmFkZCBAY29sbGVjdGlvbi5vbkRpZEZpbmlzaFNlYXJjaCBAc3RvcExvYWRpbmdcbiAgICBAZGlzcG9zYWJsZXMuYWRkIEBjb2xsZWN0aW9uLm9uRGlkRmFpbFNlYXJjaCAoZXJyKSA9PlxuICAgICAgQHNlYXJjaENvdW50LnRleHQgXCJTZWFyY2ggRmFpbGVkXCJcbiAgICAgIGNvbnNvbGUuZXJyb3IgZXJyIGlmIGVyclxuICAgICAgQHNob3dFcnJvciBlcnIgaWYgZXJyXG5cbiAgICBAZGlzcG9zYWJsZXMuYWRkIEBjb2xsZWN0aW9uLm9uRGlkQ2hhbmdlU2VhcmNoU2NvcGUgKHNjb3BlKSA9PlxuICAgICAgQHNldFNjb3BlQnV0dG9uU3RhdGUoc2NvcGUpXG4gICAgICBAc2VhcmNoKClcblxuICAgIEBkaXNwb3NhYmxlcy5hZGQgQGNvbGxlY3Rpb24ub25EaWRTZWFyY2hQYXRocyAoblBhdGhzKSA9PlxuICAgICAgQHNlYXJjaENvdW50LnRleHQgXCIje25QYXRoc30gcGF0aHMgc2VhcmNoZWQuLi5cIlxuXG4gICAgQGRpc3Bvc2FibGVzLmFkZCBhdG9tLndvcmtzcGFjZS5vbkRpZENoYW5nZUFjdGl2ZVBhbmVJdGVtIChpdGVtKSA9PlxuICAgICAgaWYgQGNvbGxlY3Rpb24uc2V0QWN0aXZlUHJvamVjdChpdGVtPy5nZXRQYXRoPygpKSBvclxuICAgICAgKGl0ZW0/LmNvbnN0cnVjdG9yLm5hbWUgaXMgJ1RleHRFZGl0b3InIGFuZCBAY29sbGVjdGlvbi5zY29wZSBpcyAnYWN0aXZlJylcbiAgICAgICAgQHNlYXJjaCgpXG5cbiAgICBAZGlzcG9zYWJsZXMuYWRkIGF0b20ud29ya3NwYWNlLm9uRGlkQWRkVGV4dEVkaXRvciAoe3RleHRFZGl0b3J9KSA9PlxuICAgICAgaWYgQGNvbGxlY3Rpb24uc2NvcGUgaXMgJ29wZW4nIGFuZCBhdG9tLmNvbmZpZy5nZXQgJ3RvZG8tc2hvdy5hdXRvUmVmcmVzaCdcbiAgICAgICAgQHNlYXJjaCgpXG5cbiAgICBAZGlzcG9zYWJsZXMuYWRkIGF0b20ud29ya3NwYWNlLm9uRGlkRGVzdHJveVBhbmVJdGVtICh7aXRlbX0pID0+XG4gICAgICBpZiBAY29sbGVjdGlvbi5zY29wZSBpcyAnb3BlbicgYW5kIGF0b20uY29uZmlnLmdldCAndG9kby1zaG93LmF1dG9SZWZyZXNoJ1xuICAgICAgICBAc2VhcmNoKClcblxuICAgIEBkaXNwb3NhYmxlcy5hZGQgYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzIChlZGl0b3IpID0+XG4gICAgICBAZGlzcG9zYWJsZXMuYWRkIGVkaXRvci5vbkRpZFNhdmUgPT5cbiAgICAgICAgQHNlYXJjaCgpIGlmIGF0b20uY29uZmlnLmdldCAndG9kby1zaG93LmF1dG9SZWZyZXNoJ1xuXG4gICAgQGZpbHRlckVkaXRvclZpZXcuZ2V0TW9kZWwoKS5vbkRpZFN0b3BDaGFuZ2luZyA9PlxuICAgICAgQGZpbHRlcigpIGlmIEBmaXJzdFRpbWVGaWx0ZXJcbiAgICAgIEBmaXJzdFRpbWVGaWx0ZXIgPSB0cnVlXG5cbiAgICBAc2NvcGVCdXR0b24ub24gJ2NsaWNrJywgQHRvZ2dsZVNlYXJjaFNjb3BlXG4gICAgQG9wdGlvbnNCdXR0b24ub24gJ2NsaWNrJywgQHRvZ2dsZU9wdGlvbnNcbiAgICBAc2F2ZUFzQnV0dG9uLm9uICdjbGljaycsIEBzYXZlQXNcbiAgICBAcmVmcmVzaEJ1dHRvbi5vbiAnY2xpY2snLCA9PiBAc2VhcmNoKClcblxuICBkZXN0cm95OiAtPlxuICAgIEBjb2xsZWN0aW9uLmNhbmNlbFNlYXJjaCgpXG4gICAgQGRpc3Bvc2FibGVzLmRpc3Bvc2UoKVxuICAgIEBkZXRhY2goKVxuXG4gIHNlcmlhbGl6ZTogLT5cbiAgICBkZXNlcmlhbGl6ZXI6ICd0b2RvLXNob3cvdG9kby12aWV3J1xuICAgIHNjb3BlOiBAY29sbGVjdGlvbi5zY29wZVxuICAgIGN1c3RvbVBhdGg6IEBjb2xsZWN0aW9uLmdldEN1c3RvbVBhdGgoKVxuXG4gIGdldFRpdGxlOiAtPiBcIlRvZG8gU2hvd1wiXG4gIGdldEljb25OYW1lOiAtPiBcImNoZWNrbGlzdFwiXG4gIGdldFVSSTogLT4gQHVyaVxuICBnZXREZWZhdWx0TG9jYXRpb246IC0+ICdyaWdodCdcbiAgZ2V0QWxsb3dlZExvY2F0aW9uczogLT4gWydsZWZ0JywgJ3JpZ2h0JywgJ2JvdHRvbSddXG4gIGdldFByb2plY3ROYW1lOiAtPiBAY29sbGVjdGlvbi5nZXRBY3RpdmVQcm9qZWN0TmFtZSgpXG4gIGdldFByb2plY3RQYXRoOiAtPiBAY29sbGVjdGlvbi5nZXRBY3RpdmVQcm9qZWN0KClcblxuICBnZXRUb2RvczogLT4gQGNvbGxlY3Rpb24uZ2V0VG9kb3MoKVxuICBnZXRUb2Rvc0NvdW50OiAtPiBAY29sbGVjdGlvbi5nZXRUb2Rvc0NvdW50KClcbiAgaXNTZWFyY2hpbmc6IC0+IEBjb2xsZWN0aW9uLmdldFN0YXRlKClcbiAgc2VhcmNoOiAtPlxuICAgIGlmIEBvbmx5U2VhcmNoV2hlblZpc2libGVcbiAgICAgIHJldHVybiB1bmxlc3MgYXRvbS53b3Jrc3BhY2UucGFuZUNvbnRhaW5lckZvckl0ZW0odGhpcyk/LmlzVmlzaWJsZSgpXG4gICAgQGNvbGxlY3Rpb24uc2VhcmNoKClcblxuICBzdGFydExvYWRpbmc6ID0+XG4gICAgQHRvZG9Mb2FkaW5nLnNob3coKVxuICAgIEB1cGRhdGVJbmZvKClcblxuICBzdG9wTG9hZGluZzogPT5cbiAgICBAdG9kb0xvYWRpbmcuaGlkZSgpXG4gICAgQHVwZGF0ZUluZm8oKVxuXG4gIHVwZGF0ZUluZm86IC0+XG4gICAgQHRvZG9JbmZvLmh0bWwoXCIje0BnZXRJbmZvVGV4dCgpfSAje0BnZXRTY29wZVRleHQoKX1cIilcblxuICBnZXRJbmZvVGV4dDogLT5cbiAgICByZXR1cm4gXCJGb3VuZCAuLi4gcmVzdWx0c1wiIGlmIEBpc1NlYXJjaGluZygpXG4gICAgc3dpdGNoIGNvdW50ID0gQGdldFRvZG9zQ291bnQoKVxuICAgICAgd2hlbiAxIHRoZW4gXCJGb3VuZCAje2NvdW50fSByZXN1bHRcIlxuICAgICAgZWxzZSBcIkZvdW5kICN7Y291bnR9IHJlc3VsdHNcIlxuXG4gIGdldFNjb3BlVGV4dDogLT5cbiAgICAjIFRPRE86IEFsc28gc2hvdyBudW1iZXIgb2YgZmlsZXNcblxuICAgIHN3aXRjaCBAY29sbGVjdGlvbi5zY29wZVxuICAgICAgd2hlbiAnYWN0aXZlJ1xuICAgICAgICBcImluIGFjdGl2ZSBmaWxlXCJcbiAgICAgIHdoZW4gJ29wZW4nXG4gICAgICAgIFwiaW4gb3BlbiBmaWxlc1wiXG4gICAgICB3aGVuICdwcm9qZWN0J1xuICAgICAgICBcImluIHByb2plY3QgPGNvZGU+I3tAZ2V0UHJvamVjdE5hbWUoKX08L2NvZGU+XCJcbiAgICAgIHdoZW4gJ2N1c3RvbSdcbiAgICAgICAgXCJpbiA8Y29kZT4je0Bjb2xsZWN0aW9uLmN1c3RvbVBhdGh9PC9jb2RlPlwiXG4gICAgICBlbHNlXG4gICAgICAgIFwiaW4gd29ya3NwYWNlXCJcblxuICBzaG93RXJyb3I6IChtZXNzYWdlID0gJycpIC0+XG4gICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yIG1lc3NhZ2UudG9TdHJpbmcoKSwgQG5vdGlmaWNhdGlvbk9wdGlvbnNcblxuICBzaG93V2FybmluZzogKG1lc3NhZ2UgPSAnJykgLT5cbiAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkV2FybmluZyBtZXNzYWdlLnRvU3RyaW5nKCksIEBub3RpZmljYXRpb25PcHRpb25zXG5cbiAgc2F2ZUFzOiA9PlxuICAgIHJldHVybiBpZiBAaXNTZWFyY2hpbmcoKVxuXG4gICAgZmlsZVBhdGggPSBcIiN7QGdldFByb2plY3ROYW1lKCkgb3IgJ3RvZG9zJ30ubWRcIlxuICAgIGlmIHByb2plY3RQYXRoID0gQGdldFByb2plY3RQYXRoKClcbiAgICAgIGZpbGVQYXRoID0gcGF0aC5qb2luKHByb2plY3RQYXRoLCBmaWxlUGF0aClcblxuICAgIGlmIG91dHB1dEZpbGVQYXRoID0gYXRvbS5zaG93U2F2ZURpYWxvZ1N5bmMoZmlsZVBhdGgudG9Mb3dlckNhc2UoKSlcbiAgICAgIGZzLndyaXRlRmlsZVN5bmMob3V0cHV0RmlsZVBhdGgsIEBjb2xsZWN0aW9uLmdldE1hcmtkb3duKCkpXG4gICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKG91dHB1dEZpbGVQYXRoKVxuXG4gIHRvZ2dsZVNlYXJjaFNjb3BlOiA9PlxuICAgIHNjb3BlID0gQGNvbGxlY3Rpb24udG9nZ2xlU2VhcmNoU2NvcGUoKVxuICAgIEBzZXRTY29wZUJ1dHRvblN0YXRlKHNjb3BlKVxuXG4gIHNldFNjb3BlQnV0dG9uU3RhdGU6IChzdGF0ZSkgPT5cbiAgICBzd2l0Y2ggc3RhdGVcbiAgICAgIHdoZW4gJ3Byb2plY3QnIHRoZW4gQHNjb3BlQnV0dG9uLnRleHQgJ1Byb2plY3QnXG4gICAgICB3aGVuICdvcGVuJyB0aGVuIEBzY29wZUJ1dHRvbi50ZXh0ICdPcGVuIEZpbGVzJ1xuICAgICAgd2hlbiAnYWN0aXZlJyB0aGVuIEBzY29wZUJ1dHRvbi50ZXh0ICdBY3RpdmUgRmlsZSdcbiAgICAgIHdoZW4gJ2N1c3RvbScgdGhlbiBAc2NvcGVCdXR0b24udGV4dCAnQ3VzdG9tJ1xuICAgICAgZWxzZSBAc2NvcGVCdXR0b24udGV4dCAnV29ya3NwYWNlJ1xuXG4gIHRvZ2dsZU9wdGlvbnM6ID0+XG4gICAgdW5sZXNzIEB0b2RvT3B0aW9uc1xuICAgICAgQG9wdGlvbnNWaWV3LmhpZGUoKVxuICAgICAgQHRvZG9PcHRpb25zID0gbmV3IFRvZG9PcHRpb25zKEBjb2xsZWN0aW9uKVxuICAgICAgQG9wdGlvbnNWaWV3Lmh0bWwgQHRvZG9PcHRpb25zXG4gICAgQG9wdGlvbnNWaWV3LnNsaWRlVG9nZ2xlKClcblxuICBmaWx0ZXI6IC0+XG4gICAgQGNvbGxlY3Rpb24uZmlsdGVyVG9kb3MgQGZpbHRlckJ1ZmZlci5nZXRUZXh0KClcblxuICBjaGVja0RlcHJlY2F0aW9uOiAtPlxuICAgIGlmIGF0b20uY29uZmlnLmdldCgndG9kby1zaG93LmZpbmRUaGVzZVJlZ2V4ZXMnKVxuICAgICAgQHNob3dXYXJuaW5nICcnJ1xuICAgICAgRGVwcmVjYXRpb24gV2FybmluZzpcXG5cbiAgICAgIGBmaW5kVGhlc2VSZWdleGVzYCBjb25maWcgaXMgZGVwcmVjYXRlZCwgcGxlYXNlIHVzZSBgZmluZFRoZXNlVG9kb3NgIGFuZCBgZmluZFVzaW5nUmVnZXhgIGZvciBjdXN0b20gYmVoYXZpb3VyLlxuICAgICAgU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9tcm9kYWxnYWFyZC9hdG9tLXRvZG8tc2hvdyNjb25maWcgZm9yIG1vcmUgaW5mb3JtYXRpb24uXG4gICAgICAnJydcbiJdfQ==
