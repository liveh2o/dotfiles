(function() {
  var CompositeDisposable, ScrollView, ShowTodoView, TextBuffer, TextEditorView, TodoOptions, TodoTable, fs, path, _ref, _ref1,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, TextBuffer = _ref.TextBuffer;

  _ref1 = require('atom-space-pen-views'), ScrollView = _ref1.ScrollView, TextEditorView = _ref1.TextEditorView;

  path = require('path');

  fs = require('fs-plus');

  TodoTable = require('./todo-table-view');

  TodoOptions = require('./todo-options-view');

  module.exports = ShowTodoView = (function(_super) {
    __extends(ShowTodoView, _super);

    ShowTodoView.content = function(collection, filterBuffer) {
      var filterEditor;
      filterEditor = atom.workspace.buildTextEditor({
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
          if ((item != null ? item.constructor.name : void 0) === 'TextEditor' && _this.collection.scope === 'active') {
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
      return "Todo-Show Results";
    };

    ShowTodoView.prototype.getIconName = function() {
      return "checklist";
    };

    ShowTodoView.prototype.getURI = function() {
      return this.uri;
    };

    ShowTodoView.prototype.getProjectPath = function() {
      return atom.project.getPaths()[0];
    };

    ShowTodoView.prototype.getProjectName = function() {
      var _ref2;
      return (_ref2 = atom.project.getDirectories()[0]) != null ? _ref2.getBaseName() : void 0;
    };

    ShowTodoView.prototype.startLoading = function() {
      this.loading = true;
      return this.todoLoading.show();
    };

    ShowTodoView.prototype.stopLoading = function() {
      this.loading = false;
      return this.todoLoading.hide();
    };

    ShowTodoView.prototype.getTodos = function() {
      return this.collection.getTodos();
    };

    ShowTodoView.prototype.showError = function(message) {
      return atom.notifications.addError('todo-show', {
        detail: message,
        dismissable: true
      });
    };

    ShowTodoView.prototype.saveAs = function() {
      var filePath, outputFilePath, projectPath;
      if (this.collection.isSearching()) {
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
        case 'full':
          return this.scopeButton.text('Workspace');
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

    return ShowTodoView;

  })(ScrollView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RvZG8tc2hvdy9saWIvdG9kby12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx3SEFBQTtJQUFBOzttU0FBQTs7QUFBQSxFQUFBLE9BQW9DLE9BQUEsQ0FBUSxNQUFSLENBQXBDLEVBQUMsMkJBQUEsbUJBQUQsRUFBc0Isa0JBQUEsVUFBdEIsQ0FBQTs7QUFBQSxFQUNBLFFBQStCLE9BQUEsQ0FBUSxzQkFBUixDQUEvQixFQUFDLG1CQUFBLFVBQUQsRUFBYSx1QkFBQSxjQURiLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FGUCxDQUFBOztBQUFBLEVBR0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSLENBSEwsQ0FBQTs7QUFBQSxFQUtBLFNBQUEsR0FBWSxPQUFBLENBQVEsbUJBQVIsQ0FMWixDQUFBOztBQUFBLEVBTUEsV0FBQSxHQUFjLE9BQUEsQ0FBUSxxQkFBUixDQU5kLENBQUE7O0FBQUEsRUFRQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osbUNBQUEsQ0FBQTs7QUFBQSxJQUFBLFlBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQyxVQUFELEVBQWEsWUFBYixHQUFBO0FBQ1IsVUFBQSxZQUFBO0FBQUEsTUFBQSxZQUFBLEdBQWUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxlQUFmLENBQ2I7QUFBQSxRQUFBLElBQUEsRUFBTSxJQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVcsQ0FEWDtBQUFBLFFBRUEsUUFBQSxFQUFVLElBRlY7QUFBQSxRQUdBLFdBQUEsRUFBYSxLQUhiO0FBQUEsUUFJQSxNQUFBLEVBQVEsWUFKUjtBQUFBLFFBS0EsZUFBQSxFQUFpQixjQUxqQjtPQURhLENBQWYsQ0FBQTthQVNBLElBQUMsQ0FBQSxHQUFELENBQUs7QUFB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

//# sourceURL=/Users/ah/.atom/packages/todo-show/lib/todo-view.coffee
