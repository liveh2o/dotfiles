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
      this.disposables.add(this.collection.onDidChangeSearchScope(this.setScopeButtonState));
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
      switch (count = this.getTodos().length) {
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RvZG8tc2hvdy9saWIvdG9kby12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw4SUFBQTtJQUFBOzttU0FBQTs7QUFBQSxFQUFBLE9BQW9DLE9BQUEsQ0FBUSxNQUFSLENBQXBDLEVBQUMsMkJBQUEsbUJBQUQsRUFBc0Isa0JBQUEsVUFBdEIsQ0FBQTs7QUFBQSxFQUNBLFFBQStCLE9BQUEsQ0FBUSxzQkFBUixDQUEvQixFQUFDLG1CQUFBLFVBQUQsRUFBYSx1QkFBQSxjQURiLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FGUCxDQUFBOztBQUFBLEVBR0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSLENBSEwsQ0FBQTs7QUFBQSxFQUtBLFNBQUEsR0FBWSxPQUFBLENBQVEsbUJBQVIsQ0FMWixDQUFBOztBQUFBLEVBTUEsV0FBQSxHQUFjLE9BQUEsQ0FBUSxxQkFBUixDQU5kLENBQUE7O0FBQUEsRUFRQSxvQkFBQSxHQUF1QixTQUFDLE1BQUQsR0FBQTtBQUNyQixRQUFBLFVBQUE7QUFBQSxJQUFBLElBQUcsc0NBQUg7YUFDRSxJQUFJLENBQUMsU0FBUyxDQUFDLGVBQWYsQ0FBK0IsTUFBL0IsRUFERjtLQUFBLE1BQUE7QUFHRSxNQUFBLFVBQUEsR0FBYSxPQUFBLENBQVEsTUFBUixDQUFlLENBQUMsVUFBN0IsQ0FBQTthQUNJLElBQUEsVUFBQSxDQUFXLE1BQVgsRUFKTjtLQURxQjtFQUFBLENBUnZCLENBQUE7O0FBQUEsRUFlQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osbUNBQUEsQ0FBQTs7QUFBQSxJQUFBLFlBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQyxVQUFELEVBQWEsWUFBYixHQUFBO0FBQ1IsVUFBQSxZQUFBO0FBQUEs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

//# sourceURL=/Users/ah/.atom/packages/todo-show/lib/todo-view.coffee
