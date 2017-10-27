(function() {
  var CompositeDisposable, ScrollView, ShowTodoView, TextBuffer, TextEditorView, TodoOptions, TodoTable, deprecatedTextEditor, fs, path, _ref, _ref1,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, TextBuffer = _ref.TextBuffer;

  _ref1 = require('atom-space-pen-views'), ScrollView = _ref1.ScrollView, TextEditorView = _ref1.TextEditorView;

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

  module.exports = ShowTodoView = (function(_super) {
    __extends(ShowTodoView, _super);

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

    function ShowTodoView(collection, uri) {
      this.collection = collection;
      this.uri = uri;
      this.toggleOptions = __bind(this.toggleOptions, this);
      this.setScopeButtonState = __bind(this.setScopeButtonState, this);
      this.toggleSearchScope = __bind(this.toggleSearchScope, this);
      this.saveAs = __bind(this.saveAs, this);
      this.stopLoading = __bind(this.stopLoading, this);
      this.startLoading = __bind(this.startLoading, this);
      ShowTodoView.__super__.constructor.call(this, this.collection, this.filterBuffer = new TextBuffer);
    }

    ShowTodoView.prototype.initialize = function() {
      this.disposables = new CompositeDisposable;
      this.handleEvents();
      this.collection.search();
      this.setScopeButtonState(this.collection.getSearchScope());
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
      var pane;
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
            return _this.collection.search();
          };
        })(this)
      }));
      pane = atom.workspace.getActivePane();
      if (atom.config.get('todo-show.rememberViewSize')) {
        this.restorePaneFlex(pane);
      }
      this.disposables.add(pane.observeFlexScale((function(_this) {
        return function(flexScale) {
          return _this.savePaneFlex(flexScale);
        };
      })(this)));
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
          return _this.collection.search();
        };
      })(this)));
      this.disposables.add(this.collection.onDidSearchPaths((function(_this) {
        return function(nPaths) {
          return _this.searchCount.text("" + nPaths + " paths searched...");
        };
      })(this)));
      this.disposables.add(atom.workspace.onDidChangeActivePaneItem((function(_this) {
        return function(item) {
          if (_this.collection.setActiveProject(item != null ? typeof item.getPath === "function" ? item.getPath() : void 0 : void 0) || ((item != null ? item.constructor.name : void 0) === 'TextEditor' && _this.collection.scope === 'active')) {
            return _this.collection.search();
          }
        };
      })(this)));
      this.disposables.add(atom.workspace.onDidAddTextEditor((function(_this) {
        return function(_arg) {
          var textEditor;
          textEditor = _arg.textEditor;
          if (_this.collection.scope === 'open') {
            return _this.collection.search();
          }
        };
      })(this)));
      this.disposables.add(atom.workspace.onDidDestroyPaneItem((function(_this) {
        return function(_arg) {
          var item;
          item = _arg.item;
          if (_this.collection.scope === 'open') {
            return _this.collection.search();
          }
        };
      })(this)));
      this.disposables.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          return _this.disposables.add(editor.onDidSave(function() {
            return _this.collection.search();
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
          return _this.collection.search();
        };
      })(this));
    };

    ShowTodoView.prototype.destroy = function() {
      this.collection.cancelSearch();
      this.disposables.dispose();
      return this.detach();
    };

    ShowTodoView.prototype.savePaneFlex = function(flex) {
      return localStorage.setItem('todo-show.flex', flex);
    };

    ShowTodoView.prototype.restorePaneFlex = function(pane) {
      var flex;
      flex = localStorage.getItem('todo-show.flex');
      if (flex) {
        return pane.setFlexScale(parseFloat(flex));
      }
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

    ShowTodoView.prototype.startLoading = function() {
      this.todoLoading.show();
      return this.updateInfo();
    };

    ShowTodoView.prototype.stopLoading = function() {
      this.todoLoading.hide();
      return this.updateInfo();
    };

    ShowTodoView.prototype.updateInfo = function() {
      return this.todoInfo.html("" + (this.getInfoText()) + " " + (this.getScopeText()));
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
        default:
          return "in workspace";
      }
    };

    ShowTodoView.prototype.showError = function(message) {
      if (message == null) {
        message = '';
      }
      return atom.notifications.addError(message, this.notificationOptions);
    };

    ShowTodoView.prototype.showWarning = function(message) {
      if (message == null) {
        message = '';
      }
      return atom.notifications.addWarning(message, this.notificationOptions);
    };

    ShowTodoView.prototype.saveAs = function() {
      var filePath, outputFilePath, projectPath;
      if (this.isSearching()) {
        return;
      }
      filePath = "" + (this.getProjectName() || 'todos') + ".md";
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
        case 'workspace':
          return this.scopeButton.text('Workspace');
        case 'project':
          return this.scopeButton.text('Project');
        case 'open':
          return this.scopeButton.text('Open Files');
        case 'active':
          return this.scopeButton.text('Active File');
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RvZG8tc2hvdy9saWIvdG9kby12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw4SUFBQTtJQUFBOzttU0FBQTs7QUFBQSxFQUFBLE9BQW9DLE9BQUEsQ0FBUSxNQUFSLENBQXBDLEVBQUMsMkJBQUEsbUJBQUQsRUFBc0Isa0JBQUEsVUFBdEIsQ0FBQTs7QUFBQSxFQUNBLFFBQStCLE9BQUEsQ0FBUSxzQkFBUixDQUEvQixFQUFDLG1CQUFBLFVBQUQsRUFBYSx1QkFBQSxjQURiLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FGUCxDQUFBOztBQUFBLEVBR0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSLENBSEwsQ0FBQTs7QUFBQSxFQUtBLFNBQUEsR0FBWSxPQUFBLENBQVEsbUJBQVIsQ0FMWixDQUFBOztBQUFBLEVBTUEsV0FBQSxHQUFjLE9BQUEsQ0FBUSxxQkFBUixDQU5kLENBQUE7O0FBQUEsRUFRQSxvQkFBQSxHQUF1QixTQUFDLE1BQUQsR0FBQTtBQUNyQixRQUFBLFVBQUE7QUFBQSxJQUFBLElBQUcsc0NBQUg7YUFDRSxJQUFJLENBQUMsU0FBUyxDQUFDLGVBQWYsQ0FBK0IsTUFBL0IsRUFERjtLQUFBLE1BQUE7QUFHRSxNQUFBLFVBQUEsR0FBYSxPQUFBLENBQVEsTUFBUixDQUFlLENBQUMsVUFBN0IsQ0FBQTthQUNJLElBQUEsVUFBQSxDQUFXLE1BQVgsRUFKTjtLQURxQjtFQUFBLENBUnZCLENBQUE7O0FBQUEsRUFlQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osbUNBQUEsQ0FBQTs7QUFBQSxJQUFBLFlBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQyxVQUFELEVBQWEsWUFBYixHQUFBO0FBQ1IsVUFBQSxZQUFBO0FBQUEsTUFBQSxZQUFBLEdBQWUsb0JBQUEsQ0FDYjtBQUFBLFFBQUEsSUFBQSxFQUFNLElBQU47QUFBQSxRQUNBLFNBQUEsRUFBVyxDQURYO0FBQUEsUUFFQSxRQUFBLEVBQVUsSUFGVjtBQUFBLFFBR0EsV0FBQSxFQUFhLEtBSGI7QUFBQSxRQUlBLE1BQUEsRUFBUSxZQUpSO0FBQUEsUUFLQSxlQUFBLEVBQWlCLGNBTGpCO09BRGEsQ0FBZixDQUFBO2FBU0EsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLG1CQUFQO0FBQUEsUUFBNEIsUUFBQSxFQUFVLENBQUEsQ0FBdEM7T0FBTCxFQUErQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQzdDLFVBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFPLGFBQVA7V0FBTCxFQUEyQixTQUFBLEdBQUE7QUFDekIsWUFBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsY0FBQSxPQUFBLEVBQU8seUNBQVA7YUFBTCxFQUF1RCxTQUFBLEdBQUE7cUJBQ3JELEtBQUMsQ0FBQSxPQUFELENBQVMsa0JBQVQsRUFBaUMsSUFBQSxjQUFBLENBQWU7QUFBQSxnQkFBQSxNQUFBLEVBQVEsWUFBUjtlQUFmLENBQWpDLEVBRHFEO1lBQUEsQ0FBdkQsQ0FBQSxDQUFBO21CQUVBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxjQUFBLE9BQUEsRUFBTyxrQkFBUDthQUFMLEVBQWdDLFNBQUEsR0FBQTtxQkFDOUIsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLGdCQUFBLE9BQUEsRUFBTyxXQUFQO2VBQUwsRUFBeUIsU0FBQSxHQUFBO0FBQ3ZCLGdCQUFBLEtBQUMsQ0FBQSxNQUFELENBQVE7QUFBQSxrQkFBQSxNQUFBLEVBQVEsYUFBUjtBQUFBLGtCQUF1QixPQUFBLEVBQU8sS0FBOUI7aUJBQVIsQ0FBQSxDQUFBO0FBQUEsZ0JBQ0EsS0FBQyxDQUFBLE1BQUQsQ0FBUTtBQUFBLGtCQUFBLE1BQUEsRUFBUSxlQUFSO0FBQUEsa0JBQXlCLE9BQUEsRUFBTyxlQUFoQztpQkFBUixDQURBLENBQUE7QUFBQSxnQkFFQSxLQUFDLENBQUEsTUFBRCxDQUFRO0FBQUEsa0JBQUEsTUFBQSxFQUFRLGNBQVI7QUFBQSxrQkFBd0IsT0FBQSxFQUFPLHlCQUEvQjtpQkFBUixDQUZBLENBQUE7dUJBR0EsS0FBQyxDQUFBLE1BQUQsQ0FBUTtBQUFBLGtCQUFBLE1BQUEsRUFBUSxlQUFSO0FBQUEsa0JBQXlCLE9BQUEsRUFBTyxlQUFoQztpQkFBUixFQUp1QjtjQUFBLENBQXpCLEVBRDhCO1lBQUEsQ0FBaEMsRUFIeUI7VUFBQSxDQUEzQixDQUFBLENBQUE7QUFBQSxVQVVBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE9BQUEsRUFBTyw2QkFBUDtXQUFMLEVBQTJDLFNBQUEsR0FBQTttQkFDekMsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLGNBQUEsT0FBQSxFQUFPLGtCQUFQO2FBQUwsRUFBZ0MsU0FBQSxHQUFBO3FCQUM5QixLQUFDLENBQUEsSUFBRCxDQUFNO0FBQUEsZ0JBQUEsTUFBQSxFQUFRLFVBQVI7ZUFBTixFQUQ4QjtZQUFBLENBQWhDLEVBRHlDO1VBQUEsQ0FBM0MsQ0FWQSxDQUFBO0FBQUEsVUFjQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxNQUFBLEVBQVEsYUFBUjtXQUFMLENBZEEsQ0FBQTtBQUFBLFVBZ0JBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE1BQUEsRUFBUSxhQUFSO0FBQUEsWUFBdUIsT0FBQSxFQUFPLGNBQTlCO1dBQUwsRUFBbUQsU0FBQSxHQUFBO0FBQ2pELFlBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLGNBQUEsT0FBQSxFQUFPLGtCQUFQO2FBQUwsQ0FBQSxDQUFBO21CQUNBLEtBQUMsQ0FBQSxFQUFELENBQUk7QUFBQSxjQUFBLE1BQUEsRUFBUSxhQUFSO0FBQUEsY0FBdUIsT0FBQSxFQUFPLGFBQTlCO2FBQUosRUFBaUQsa0JBQWpELEVBRmlEO1VBQUEsQ0FBbkQsQ0FoQkEsQ0FBQTtpQkFvQkEsS0FBQyxDQUFBLE9BQUQsQ0FBUyxXQUFULEVBQTBCLElBQUEsU0FBQSxDQUFVLFVBQVYsQ0FBMUIsRUFyQjZDO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBL0MsRUFWUTtJQUFBLENBQVYsQ0FBQTs7QUFpQ2EsSUFBQSxzQkFBRSxVQUFGLEVBQWUsR0FBZixHQUFBO0FBQ1gsTUFEWSxJQUFDLENBQUEsYUFBQSxVQUNiLENBQUE7QUFBQSxNQUR5QixJQUFDLENBQUEsTUFBQSxHQUMxQixDQUFBO0FBQUEsMkRBQUEsQ0FBQTtBQUFBLHVFQUFBLENBQUE7QUFBQSxtRUFBQSxDQUFBO0FBQUEsNkNBQUEsQ0FBQTtBQUFBLHVEQUFBLENBQUE7QUFBQSx5REFBQSxDQUFBO0FBQUEsTUFBQSw4Q0FBTSxJQUFDLENBQUEsVUFBUCxFQUFtQixJQUFDLENBQUEsWUFBRCxHQUFnQixHQUFBLENBQUEsVUFBbkMsQ0FBQSxDQURXO0lBQUEsQ0FqQ2I7O0FBQUEsMkJBb0NBLFVBQUEsR0FBWSxTQUFBLEdBQUE7QUFDVixNQUFBLElBQUMsQ0FBQSxXQUFELEdBQWUsR0FBQSxDQUFBLG1CQUFmLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxZQUFELENBQUEsQ0FEQSxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsVUFBVSxDQUFDLE1BQVosQ0FBQSxDQUZBLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxtQkFBRCxDQUFxQixJQUFDLENBQUEsVUFBVSxDQUFDLGNBQVosQ0FBQSxDQUFyQixDQUhBLENBQUE7QUFBQSxNQUtBLElBQUMsQ0FBQSxtQkFBRCxHQUNFO0FBQUEsUUFBQSxNQUFBLEVBQVEsd0JBQVI7QUFBQSxRQUNBLFdBQUEsRUFBYSxJQURiO0FBQUEsUUFFQSxJQUFBLEVBQU0sSUFBQyxDQUFBLFdBQUQsQ0FBQSxDQUZOO09BTkYsQ0FBQTtBQUFBLE1BVUEsSUFBQyxDQUFBLGdCQUFELENBQUEsQ0FWQSxDQUFBO0FBQUEsTUFZQSxJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLElBQUMsQ0FBQSxXQUFuQixFQUFnQztBQUFBLFFBQUEsS0FBQSxFQUFPLGdCQUFQO09BQWhDLENBQWpCLENBWkEsQ0FBQTtBQUFBLE1BYUEsSUFBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixJQUFDLENBQUEsYUFBbkIsRUFBa0M7QUFBQSxRQUFBLEtBQUEsRUFBTyxtQkFBUDtPQUFsQyxDQUFqQixDQWJBLENBQUE7QUFBQSxNQWNBLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsSUFBQyxDQUFBLFlBQW5CLEVBQWlDO0FBQUEsUUFBQSxLQUFBLEVBQU8sb0JBQVA7T0FBakMsQ0FBakIsQ0FkQSxDQUFBO2FBZUEsSUFBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixJQUFDLENBQUEsYUFBbkIsRUFBa0M7QUFBQSxRQUFBLEtBQUEsRUFBTyxlQUFQO09BQWxDLENBQWpCLEVBaEJVO0lBQUEsQ0FwQ1osQ0FBQTs7QUFBQSwyQkFzREEsWUFBQSxHQUFjLFNBQUEsR0FBQTtBQUNaLFVBQUEsSUFBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixJQUFDLENBQUEsT0FBbkIsRUFDZjtBQUFBLFFBQUEsY0FBQSxFQUFnQixDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUMsS0FBRCxHQUFBO0FBQ2QsWUFBQSxLQUFLLENBQUMsZUFBTixDQUFBLENBQUEsQ0FBQTttQkFDQSxLQUFDLENBQUEsTUFBRCxDQUFBLEVBRmM7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFoQjtBQUFBLFFBR0EsY0FBQSxFQUFnQixDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUMsS0FBRCxHQUFBO0FBQ2QsWUFBQSxLQUFLLENBQUMsZUFBTixDQUFBLENBQUEsQ0FBQTttQkFDQSxLQUFDLENBQUEsVUFBVSxDQUFDLE1BQVosQ0FBQSxFQUZjO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FIaEI7T0FEZSxDQUFqQixDQUFBLENBQUE7QUFBQSxNQVNBLElBQUEsR0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBQSxDQVRQLENBQUE7QUFVQSxNQUFBLElBQTBCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiw0QkFBaEIsQ0FBMUI7QUFBQSxRQUFBLElBQUMsQ0FBQSxlQUFELENBQWlCLElBQWpCLENBQUEsQ0FBQTtPQVZBO0FBQUEsTUFXQSxJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsSUFBSSxDQUFDLGdCQUFMLENBQXNCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLFNBQUQsR0FBQTtpQkFDckMsS0FBQyxDQUFBLFlBQUQsQ0FBYyxTQUFkLEVBRHFDO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBdEIsQ0FBakIsQ0FYQSxDQUFBO0FBQUEsTUFjQSxJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsSUFBQyxDQUFBLFVBQVUsQ0FBQyxnQkFBWixDQUE2QixJQUFDLENBQUEsWUFBOUIsQ0FBakIsQ0FkQSxDQUFBO0FBQUEsTUFlQSxJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsSUFBQyxDQUFBLFVBQVUsQ0FBQyxpQkFBWixDQUE4QixJQUFDLENBQUEsV0FBL0IsQ0FBakIsQ0FmQSxDQUFBO0FBQUEsTUFnQkEsSUFBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCLElBQUMsQ0FBQSxVQUFVLENBQUMsZUFBWixDQUE0QixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxHQUFELEdBQUE7QUFDM0MsVUFBQSxLQUFDLENBQUEsV0FBVyxDQUFDLElBQWIsQ0FBa0IsZUFBbEIsQ0FBQSxDQUFBO0FBQ0EsVUFBQSxJQUFxQixHQUFyQjtBQUFBLFlBQUEsT0FBTyxDQUFDLEtBQVIsQ0FBYyxHQUFkLENBQUEsQ0FBQTtXQURBO0FBRUEsVUFBQSxJQUFrQixHQUFsQjttQkFBQSxLQUFDLENBQUEsU0FBRCxDQUFXLEdBQVgsRUFBQTtXQUgyQztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTVCLENBQWpCLENBaEJBLENBQUE7QUFBQSxNQXFCQSxJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsSUFBQyxDQUFBLFVBQVUsQ0FBQyxzQkFBWixDQUFtQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxLQUFELEdBQUE7QUFDbEQsVUFBQSxLQUFDLENBQUEsbUJBQUQsQ0FBcUIsS0FBckIsQ0FBQSxDQUFBO2lCQUNBLEtBQUMsQ0FBQSxVQUFVLENBQUMsTUFBWixDQUFBLEVBRmtEO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbkMsQ0FBakIsQ0FyQkEsQ0FBQTtBQUFBLE1BeUJBLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQixJQUFDLENBQUEsVUFBVSxDQUFDLGdCQUFaLENBQTZCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLE1BQUQsR0FBQTtpQkFDNUMsS0FBQyxDQUFBLFdBQVcsQ0FBQyxJQUFiLENBQWtCLEVBQUEsR0FBRyxNQUFILEdBQVUsb0JBQTVCLEVBRDRDO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBN0IsQ0FBakIsQ0F6QkEsQ0FBQTtBQUFBLE1BNEJBLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQixJQUFJLENBQUMsU0FBUyxDQUFDLHlCQUFmLENBQXlDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLElBQUQsR0FBQTtBQUN4RCxVQUFBLElBQUcsS0FBQyxDQUFBLFVBQVUsQ0FBQyxnQkFBWixxREFBNkIsSUFBSSxDQUFFLDJCQUFuQyxDQUFBLElBQ0gsaUJBQUMsSUFBSSxDQUFFLFdBQVcsQ0FBQyxjQUFsQixLQUEwQixZQUExQixJQUEyQyxLQUFDLENBQUEsVUFBVSxDQUFDLEtBQVosS0FBcUIsUUFBakUsQ0FEQTttQkFFRSxLQUFDLENBQUEsVUFBVSxDQUFDLE1BQVosQ0FBQSxFQUZGO1dBRHdEO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBekMsQ0FBakIsQ0E1QkEsQ0FBQTtBQUFBLE1BaUNBLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQixJQUFJLENBQUMsU0FBUyxDQUFDLGtCQUFmLENBQWtDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLElBQUQsR0FBQTtBQUNqRCxjQUFBLFVBQUE7QUFBQSxVQURtRCxhQUFELEtBQUMsVUFDbkQsQ0FBQTtBQUFBLFVBQUEsSUFBd0IsS0FBQyxDQUFBLFVBQVUsQ0FBQyxLQUFaLEtBQXFCLE1BQTdDO21CQUFBLEtBQUMsQ0FBQSxVQUFVLENBQUMsTUFBWixDQUFBLEVBQUE7V0FEaUQ7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFsQyxDQUFqQixDQWpDQSxDQUFBO0FBQUEsTUFvQ0EsSUFBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCLElBQUksQ0FBQyxTQUFTLENBQUMsb0JBQWYsQ0FBb0MsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsSUFBRCxHQUFBO0FBQ25ELGNBQUEsSUFBQTtBQUFBLFVBRHFELE9BQUQsS0FBQyxJQUNyRCxDQUFBO0FBQUEsVUFBQSxJQUF3QixLQUFDLENBQUEsVUFBVSxDQUFDLEtBQVosS0FBcUIsTUFBN0M7bUJBQUEsS0FBQyxDQUFBLFVBQVUsQ0FBQyxNQUFaLENBQUEsRUFBQTtXQURtRDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXBDLENBQWpCLENBcENBLENBQUE7QUFBQSxNQXVDQSxJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBZixDQUFrQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxNQUFELEdBQUE7aUJBQ2pELEtBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQixNQUFNLENBQUMsU0FBUCxDQUFpQixTQUFBLEdBQUE7bUJBQUcsS0FBQyxDQUFBLFVBQVUsQ0FBQyxNQUFaLENBQUEsRUFBSDtVQUFBLENBQWpCLENBQWpCLEVBRGlEO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEMsQ0FBakIsQ0F2Q0EsQ0FBQTtBQUFBLE1BMENBLElBQUMsQ0FBQSxnQkFBZ0IsQ0FBQyxRQUFsQixDQUFBLENBQTRCLENBQUMsaUJBQTdCLENBQStDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDN0MsVUFBQSxJQUFhLEtBQUMsQ0FBQSxlQUFkO0FBQUEsWUFBQSxLQUFDLENBQUEsTUFBRCxDQUFBLENBQUEsQ0FBQTtXQUFBO2lCQUNBLEtBQUMsQ0FBQSxlQUFELEdBQW1CLEtBRjBCO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBL0MsQ0ExQ0EsQ0FBQTtBQUFBLE1BOENBLElBQUMsQ0FBQSxXQUFXLENBQUMsRUFBYixDQUFnQixPQUFoQixFQUF5QixJQUFDLENBQUEsaUJBQTFCLENBOUNBLENBQUE7QUFBQSxNQStDQSxJQUFDLENBQUEsYUFBYSxDQUFDLEVBQWYsQ0FBa0IsT0FBbEIsRUFBMkIsSUFBQyxDQUFBLGFBQTVCLENBL0NBLENBQUE7QUFBQSxNQWdEQSxJQUFDLENBQUEsWUFBWSxDQUFDLEVBQWQsQ0FBaUIsT0FBakIsRUFBMEIsSUFBQyxDQUFBLE1BQTNCLENBaERBLENBQUE7YUFpREEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxFQUFmLENBQWtCLE9BQWxCLEVBQTJCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQUcsS0FBQyxDQUFBLFVBQVUsQ0FBQyxNQUFaLENBQUEsRUFBSDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTNCLEVBbERZO0lBQUEsQ0F0RGQsQ0FBQTs7QUFBQSwyQkEwR0EsT0FBQSxHQUFTLFNBQUEsR0FBQTtBQUNQLE1BQUEsSUFBQyxDQUFBLFVBQVUsQ0FBQyxZQUFaLENBQUEsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsV0FBVyxDQUFDLE9BQWIsQ0FBQSxDQURBLENBQUE7YUFFQSxJQUFDLENBQUEsTUFBRCxDQUFBLEVBSE87SUFBQSxDQTFHVCxDQUFBOztBQUFBLDJCQStHQSxZQUFBLEdBQWMsU0FBQyxJQUFELEdBQUE7YUFDWixZQUFZLENBQUMsT0FBYixDQUFxQixnQkFBckIsRUFBdUMsSUFBdkMsRUFEWTtJQUFBLENBL0dkLENBQUE7O0FBQUEsMkJBa0hBLGVBQUEsR0FBaUIsU0FBQyxJQUFELEdBQUE7QUFDZixVQUFBLElBQUE7QUFBQSxNQUFBLElBQUEsR0FBTyxZQUFZLENBQUMsT0FBYixDQUFxQixnQkFBckIsQ0FBUCxDQUFBO0FBQ0EsTUFBQSxJQUFzQyxJQUF0QztlQUFBLElBQUksQ0FBQyxZQUFMLENBQWtCLFVBQUEsQ0FBVyxJQUFYLENBQWxCLEVBQUE7T0FGZTtJQUFBLENBbEhqQixDQUFBOztBQUFBLDJCQXNIQSxRQUFBLEdBQVUsU0FBQSxHQUFBO2FBQUcsWUFBSDtJQUFBLENBdEhWLENBQUE7O0FBQUEsMkJBdUhBLFdBQUEsR0FBYSxTQUFBLEdBQUE7YUFBRyxZQUFIO0lBQUEsQ0F2SGIsQ0FBQTs7QUFBQSwyQkF3SEEsTUFBQSxHQUFRLFNBQUEsR0FBQTthQUFHLElBQUMsQ0FBQSxJQUFKO0lBQUEsQ0F4SFIsQ0FBQTs7QUFBQSwyQkF5SEEsY0FBQSxHQUFnQixTQUFBLEdBQUE7YUFBRyxJQUFDLENBQUEsVUFBVSxDQUFDLG9CQUFaLENBQUEsRUFBSDtJQUFBLENBekhoQixDQUFBOztBQUFBLDJCQTBIQSxjQUFBLEdBQWdCLFNBQUEsR0FBQTthQUFHLElBQUMsQ0FBQSxVQUFVLENBQUMsZ0JBQVosQ0FBQSxFQUFIO0lBQUEsQ0ExSGhCLENBQUE7O0FBQUEsMkJBMkhBLFFBQUEsR0FBVSxTQUFBLEdBQUE7YUFBRyxJQUFDLENBQUEsVUFBVSxDQUFDLFFBQVosQ0FBQSxFQUFIO0lBQUEsQ0EzSFYsQ0FBQTs7QUFBQSwyQkE0SEEsYUFBQSxHQUFlLFNBQUEsR0FBQTthQUFHLElBQUMsQ0FBQSxVQUFVLENBQUMsYUFBWixDQUFBLEVBQUg7SUFBQSxDQTVIZixDQUFBOztBQUFBLDJCQTZIQSxXQUFBLEdBQWEsU0FBQSxHQUFBO2FBQUcsSUFBQyxDQUFBLFVBQVUsQ0FBQyxRQUFaLENBQUEsRUFBSDtJQUFBLENBN0hiLENBQUE7O0FBQUEsMkJBK0hBLFlBQUEsR0FBYyxTQUFBLEdBQUE7QUFDWixNQUFBLElBQUMsQ0FBQSxXQUFXLENBQUMsSUFBYixDQUFBLENBQUEsQ0FBQTthQUNBLElBQUMsQ0FBQSxVQUFELENBQUEsRUFGWTtJQUFBLENBL0hkLENBQUE7O0FBQUEsMkJBbUlBLFdBQUEsR0FBYSxTQUFBLEdBQUE7QUFDWCxNQUFBLElBQUMsQ0FBQSxXQUFXLENBQUMsSUFBYixDQUFBLENBQUEsQ0FBQTthQUNBLElBQUMsQ0FBQSxVQUFELENBQUEsRUFGVztJQUFBLENBbkliLENBQUE7O0FBQUEsMkJBdUlBLFVBQUEsR0FBWSxTQUFBLEdBQUE7YUFDVixJQUFDLENBQUEsUUFBUSxDQUFDLElBQVYsQ0FBZSxFQUFBLEdBQUUsQ0FBQyxJQUFDLENBQUEsV0FBRCxDQUFBLENBQUQsQ0FBRixHQUFrQixHQUFsQixHQUFvQixDQUFDLElBQUMsQ0FBQSxZQUFELENBQUEsQ0FBRCxDQUFuQyxFQURVO0lBQUEsQ0F2SVosQ0FBQTs7QUFBQSwyQkEwSUEsV0FBQSxHQUFhLFNBQUEsR0FBQTtBQUNYLFVBQUEsS0FBQTtBQUFBLE1BQUEsSUFBOEIsSUFBQyxDQUFBLFdBQUQsQ0FBQSxDQUE5QjtBQUFBLGVBQU8sbUJBQVAsQ0FBQTtPQUFBO0FBQ0EsY0FBTyxLQUFBLEdBQVEsSUFBQyxDQUFBLGFBQUQsQ0FBQSxDQUFmO0FBQUEsYUFDTyxDQURQO2lCQUNlLFFBQUEsR0FBUSxLQUFSLEdBQWMsVUFEN0I7QUFBQTtpQkFFUSxRQUFBLEdBQVEsS0FBUixHQUFjLFdBRnRCO0FBQUEsT0FGVztJQUFBLENBMUliLENBQUE7O0FBQUEsMkJBZ0pBLFlBQUEsR0FBYyxTQUFBLEdBQUE7QUFHWixjQUFPLElBQUMsQ0FBQSxVQUFVLENBQUMsS0FBbkI7QUFBQSxhQUNPLFFBRFA7aUJBRUksaUJBRko7QUFBQSxhQUdPLE1BSFA7aUJBSUksZ0JBSko7QUFBQSxhQUtPLFNBTFA7aUJBTUssbUJBQUEsR0FBa0IsQ0FBQyxJQUFDLENBQUEsY0FBRCxDQUFBLENBQUQsQ0FBbEIsR0FBcUMsVUFOMUM7QUFBQTtpQkFRSSxlQVJKO0FBQUEsT0FIWTtJQUFBLENBaEpkLENBQUE7O0FBQUEsMkJBNkpBLFNBQUEsR0FBVyxTQUFDLE9BQUQsR0FBQTs7UUFBQyxVQUFVO09BQ3BCO2FBQUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFuQixDQUE0QixPQUE1QixFQUFxQyxJQUFDLENBQUEsbUJBQXRDLEVBRFM7SUFBQSxDQTdKWCxDQUFBOztBQUFBLDJCQWdLQSxXQUFBLEdBQWEsU0FBQyxPQUFELEdBQUE7O1FBQUMsVUFBVTtPQUN0QjthQUFBLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBbkIsQ0FBOEIsT0FBOUIsRUFBdUMsSUFBQyxDQUFBLG1CQUF4QyxFQURXO0lBQUEsQ0FoS2IsQ0FBQTs7QUFBQSwyQkFtS0EsTUFBQSxHQUFRLFNBQUEsR0FBQTtBQUNOLFVBQUEscUNBQUE7QUFBQSxNQUFBLElBQVUsSUFBQyxDQUFBLFdBQUQsQ0FBQSxDQUFWO0FBQUEsY0FBQSxDQUFBO09BQUE7QUFBQSxNQUVBLFFBQUEsR0FBVyxFQUFBLEdBQUUsQ0FBQyxJQUFDLENBQUEsY0FBRCxDQUFBLENBQUEsSUFBcUIsT0FBdEIsQ0FBRixHQUFnQyxLQUYzQyxDQUFBO0FBR0EsTUFBQSxJQUFHLFdBQUEsR0FBYyxJQUFDLENBQUEsY0FBRCxDQUFBLENBQWpCO0FBQ0UsUUFBQSxRQUFBLEdBQVcsSUFBSSxDQUFDLElBQUwsQ0FBVSxXQUFWLEVBQXVCLFFBQXZCLENBQVgsQ0FERjtPQUhBO0FBTUEsTUFBQSxJQUFHLGNBQUEsR0FBaUIsSUFBSSxDQUFDLGtCQUFMLENBQXdCLFFBQVEsQ0FBQyxXQUFULENBQUEsQ0FBeEIsQ0FBcEI7QUFDRSxRQUFBLEVBQUUsQ0FBQyxhQUFILENBQWlCLGNBQWpCLEVBQWlDLElBQUMsQ0FBQSxVQUFVLENBQUMsV0FBWixDQUFBLENBQWpDLENBQUEsQ0FBQTtlQUNBLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixjQUFwQixFQUZGO09BUE07SUFBQSxDQW5LUixDQUFBOztBQUFBLDJCQThLQSxpQkFBQSxHQUFtQixTQUFBLEdBQUE7QUFDakIsVUFBQSxLQUFBO0FBQUEsTUFBQSxLQUFBLEdBQVEsSUFBQyxDQUFBLFVBQVUsQ0FBQyxpQkFBWixDQUFBLENBQVIsQ0FBQTthQUNBLElBQUMsQ0FBQSxtQkFBRCxDQUFxQixLQUFyQixFQUZpQjtJQUFBLENBOUtuQixDQUFBOztBQUFBLDJCQWtMQSxtQkFBQSxHQUFxQixTQUFDLEtBQUQsR0FBQTtBQUNuQixjQUFPLEtBQVA7QUFBQSxhQUNPLFdBRFA7aUJBQ3dCLElBQUMsQ0FBQSxXQUFXLENBQUMsSUFBYixDQUFrQixXQUFsQixFQUR4QjtBQUFBLGFBRU8sU0FGUDtpQkFFc0IsSUFBQyxDQUFBLFdBQVcsQ0FBQyxJQUFiLENBQWtCLFNBQWxCLEVBRnRCO0FBQUEsYUFHTyxNQUhQO2lCQUdtQixJQUFDLENBQUEsV0FBVyxDQUFDLElBQWIsQ0FBa0IsWUFBbEIsRUFIbkI7QUFBQSxhQUlPLFFBSlA7aUJBSXFCLElBQUMsQ0FBQSxXQUFXLENBQUMsSUFBYixDQUFrQixhQUFsQixFQUpyQjtBQUFBLE9BRG1CO0lBQUEsQ0FsTHJCLENBQUE7O0FBQUEsMkJBeUxBLGFBQUEsR0FBZSxTQUFBLEdBQUE7QUFDYixNQUFBLElBQUEsQ0FBQSxJQUFRLENBQUEsV0FBUjtBQUNFLFFBQUEsSUFBQyxDQUFBLFdBQVcsQ0FBQyxJQUFiLENBQUEsQ0FBQSxDQUFBO0FBQUEsUUFDQSxJQUFDLENBQUEsV0FBRCxHQUFtQixJQUFBLFdBQUEsQ0FBWSxJQUFDLENBQUEsVUFBYixDQURuQixDQUFBO0FBQUEsUUFFQSxJQUFDLENBQUEsV0FBVyxDQUFDLElBQWIsQ0FBa0IsSUFBQyxDQUFBLFdBQW5CLENBRkEsQ0FERjtPQUFBO2FBSUEsSUFBQyxDQUFBLFdBQVcsQ0FBQyxXQUFiLENBQUEsRUFMYTtJQUFBLENBekxmLENBQUE7O0FBQUEsMkJBZ01BLE1BQUEsR0FBUSxTQUFBLEdBQUE7YUFDTixJQUFDLENBQUEsVUFBVSxDQUFDLFdBQVosQ0FBd0IsSUFBQyxDQUFBLFlBQVksQ0FBQyxPQUFkLENBQUEsQ0FBeEIsRUFETTtJQUFBLENBaE1SLENBQUE7O0FBQUEsMkJBbU1BLGdCQUFBLEdBQWtCLFNBQUEsR0FBQTtBQUNoQixNQUFBLElBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDRCQUFoQixDQUFIO2VBQ0UsSUFBQyxDQUFBLFdBQUQsQ0FBYSx5TkFBYixFQURGO09BRGdCO0lBQUEsQ0FuTWxCLENBQUE7O3dCQUFBOztLQUR5QixXQWhCM0IsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/ah/.atom/packages/todo-show/lib/todo-view.coffee
