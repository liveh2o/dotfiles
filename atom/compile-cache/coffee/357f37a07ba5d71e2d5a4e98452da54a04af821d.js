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
      var count;
      if (this.loading) {
        return "Todo Show: ...";
      }
      switch (count = this.collection.getTodosCount()) {
        case 1:
          return "Todo Show: " + count + " result";
        default:
          return "Todo Show: " + count + " results";
      }
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
      this.todoLoading.show();
      return this.updateTabTitle();
    };

    ShowTodoView.prototype.stopLoading = function() {
      this.loading = false;
      this.todoLoading.hide();
      return this.updateTabTitle();
    };

    ShowTodoView.prototype.updateTabTitle = function() {
      var tab, view, _i, _len, _ref2, _ref3, _results;
      view = atom.views.getView(this);
      if (!(view && ((_ref2 = view.parentElement) != null ? _ref2.parentElement : void 0))) {
        return;
      }
      _ref3 = view.parentElement.parentElement.querySelectorAll('.tab');
      _results = [];
      for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
        tab = _ref3[_i];
        _results.push(typeof tab.updateTitle === "function" ? tab.updateTitle() : void 0);
      }
      return _results;
    };

    ShowTodoView.prototype.getTodos = function() {
      return this.collection.getTodos();
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

    ShowTodoView.prototype.checkDeprecation = function() {
      if (atom.config.get('todo-show.findTheseRegexes')) {
        return this.showWarning('Deprecation Warning:\n\n`findTheseRegexes` config is deprecated, please use `findTheseTodos` and `findUsingRegex` for custom behaviour.\nSee https://github.com/mrodalgaard/atom-todo-show#config for more information.');
      }
    };

    return ShowTodoView;

  })(ScrollView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RvZG8tc2hvdy9saWIvdG9kby12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx3SEFBQTtJQUFBOzttU0FBQTs7QUFBQSxFQUFBLE9BQW9DLE9BQUEsQ0FBUSxNQUFSLENBQXBDLEVBQUMsMkJBQUEsbUJBQUQsRUFBc0Isa0JBQUEsVUFBdEIsQ0FBQTs7QUFBQSxFQUNBLFFBQStCLE9BQUEsQ0FBUSxzQkFBUixDQUEvQixFQUFDLG1CQUFBLFVBQUQsRUFBYSx1QkFBQSxjQURiLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FGUCxDQUFBOztBQUFBLEVBR0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSLENBSEwsQ0FBQTs7QUFBQSxFQUtBLFNBQUEsR0FBWSxPQUFBLENBQVEsbUJBQVIsQ0FMWixDQUFBOztBQUFBLEVBTUEsV0FBQSxHQUFjLE9BQUEsQ0FBUSxxQkFBUixDQU5kLENBQUE7O0FBQUEsRUFRQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osbUNBQUEsQ0FBQTs7QUFBQSxJQUFBLFlBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQyxVQUFELEVBQWEsWUFBYixHQUFBO0FBQ1IsVUFBQSxZQUFBO0FBQUEsTUFBQSxZQUFBLEdBQWUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxlQUFmLENBQ2I7QUFBQSxRQUFBLElBQUEsRUFBTSxJQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVcsQ0FEWDtBQUFBLFFBRUEsUUFBQSxFQUFVLElBRlY7QUFBQSxRQUdBLFdBQUEsRUFBYSxLQUhiO0FBQUEsUUFJQSxNQUFBLEVBQVEsWUFKUjtBQUFBLFFBS0EsZUFBQSxFQUFpQixjQUxqQjtPQURhLENBQWYsQ0FBQTthQVNBLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE9BQUEsRUFBTyxtQkFBUDtBQUFBLFFBQTRCLFFBQUEsRUFBVSxDQUFBLENBQXRDO09BQUwsRUFBK0MsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUM3QyxVQUFBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE9BQUEsRUFBTyxhQUFQO1dBQUwsRUFBMkIsU0FBQSxHQUFBO0FBQ3pCLFlBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLGNBQUEsT0FBQSxFQUFPLHlDQUFQO2FBQUwsRUFBdUQsU0FBQSxHQUFBO3FCQUNyRCxLQUFDLENBQUEsT0FBRCxDQUFTLGtCQUFULEVBQWlDLElBQUEsY0FBQSxDQUFlO0FBQUEsZ0JBQUEsTUFBQSxFQUFRLFlBQVI7ZUFBZixDQUFqQyxFQURxRDtZQUFBLENBQXZELENBQUEsQ0FBQTttQkFHQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsY0FBQSxPQUFBLEVBQU8sa0JBQVA7YUFBTCxFQUFnQyxTQUFBLEdBQUE7cUJBQzlCLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxnQkFBQSxPQUFBLEVBQU8sV0FBUDtlQUFMLEVBQXlCLFNBQUEsR0FBQTtBQUN2QixnQkFBQSxLQUFDLENBQUEsTUFBRCxDQUFRO0FBQUEsa0JBQUEsTUFBQSxFQUFRLGFBQVI7QUFBQSxrQkFBdUIsT0FBQSxFQUFPLEtBQTlCO2lCQUFSLENBQUEsQ0FBQTtBQUFBLGdCQUNBLEtBQUMsQ0FBQSxNQUFELENBQVE7QUFBQSxrQkFBQSxNQUFBLEVBQVEsZUFBUjtBQUFBLGtCQUF5QixPQUFBLEVBQU8sZUFBaEM7aUJBQVIsQ0FEQSxDQUFBO0FBQUEsZ0JBRUEsS0FBQyxDQUFBLE1BQUQsQ0FBUTtBQUFBLGtCQUFBLE1BQUEsRUFBUSxjQUFSO0FBQUEsa0JBQXdCLE9BQUEsRUFBTyx5QkFBL0I7aUJBQVIsQ0FGQSxDQUFBO3VCQUdBLEtBQUMsQ0FBQSxNQUFELENBQVE7QUFBQSxrQkFBQSxNQUFBLEVBQVEsZUFBUjtBQUFBLGtCQUF5QixPQUFBLEVBQU8sZUFBaEM7aUJBQVIsRUFKdUI7Y0FBQSxDQUF6QixFQUQ4QjtZQUFBLENBQWhDLEVBSnlCO1VBQUEsQ0FBM0IsQ0FBQSxDQUFBO0FBQUEsVUFXQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxNQUFBLEVBQVEsYUFBUjtXQUFMLENBWEEsQ0FBQTtBQUFBLFVBYUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsTUFBQSxFQUFRLGFBQVI7QUFBQSxZQUF1QixPQUFBLEVBQU8sY0FBOUI7V0FBTCxFQUFtRCxTQUFBLEdBQUE7QUFDakQsWUFBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsY0FBQSxPQUFBLEVBQU8sa0JBQVA7YUFBTCxDQUFBLENBQUE7bUJBQ0EsS0FBQyxDQUFBLEVBQUQsQ0FBSTtBQUFBLGNBQUEsTUFBQSxFQUFRLGFBQVI7QUFBQSxjQUF1QixPQUFBLEVBQU8sYUFBOUI7YUFBSixFQUFpRCxrQkFBakQsRUFGaUQ7VUFBQSxDQUFuRCxDQWJBLENBQUE7aUJBaUJBLEtBQUMsQ0FBQSxPQUFELENBQVMsV0FBVCxFQUEwQixJQUFBLFNBQUEsQ0FBVSxVQUFWLENBQTFCLEVBbEI2QztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQS9DLEVBVlE7SUFBQSxDQUFWLENBQUE7O0FBOEJhLElBQUEsc0JBQUUsVUFBRixFQUFlLEdBQWYsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLGFBQUEsVUFDYixDQUFBO0FBQUEsTUFEeUIsSUFBQyxDQUFBLE1BQUEsR0FDMUIsQ0FBQTtBQUFBLDJEQUFBLENBQUE7QUFBQSx1RUFBQSxDQUFBO0FBQUEsbUVBQUEsQ0FBQTtBQUFBLDZDQUFBLENBQUE7QUFBQSx1REFBQSxDQUFBO0FBQUEseURBQUEsQ0FBQTtBQUFBLE1BQUEsOENBQU0sSUFBQyxDQUFBLFVBQVAsRUFBbUIsSUFBQyxDQUFBLFlBQUQsR0FBZ0IsR0FBQSxDQUFBLFVBQW5DLENBQUEsQ0FEVztJQUFBLENBOUJiOztBQUFBLDJCQWlDQSxVQUFBLEdBQVksU0FBQSxHQUFBO0FBQ1YsTUFBQSxJQUFDLENBQUEsV0FBRCxHQUFlLEdBQUEsQ0FBQSxtQkFBZixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsWUFBRCxDQUFBLENBREEsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLFVBQVUsQ0FBQyxNQUFaLENBQUEsQ0FGQSxDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsbUJBQUQsQ0FBcUIsSUFBQyxDQUFBLFVBQVUsQ0FBQyxjQUFaLENBQUEsQ0FBckIsQ0FIQSxDQUFBO0FBQUEsTUFLQSxJQUFDLENBQUEsbUJBQUQsR0FDRTtBQUFBLFFBQUEsTUFBQSxFQUFRLHdCQUFSO0FBQUEsUUFDQSxXQUFBLEVBQWEsSUFEYjtBQUFBLFFBRUEsSUFBQSxFQUFNLElBQUMsQ0FBQSxXQUFELENBQUEsQ0FGTjtPQU5GLENBQUE7QUFBQSxNQVVBLElBQUMsQ0FBQSxnQkFBRCxDQUFBLENBVkEsQ0FBQTtBQUFBLE1BWUEsSUFBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixJQUFDLENBQUEsV0FBbkIsRUFBZ0M7QUFBQSxRQUFBLEtBQUEsRUFBTyxnQkFBUDtPQUFoQyxDQUFqQixDQVpBLENBQUE7QUFBQSxNQWFBLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsSUFBQyxDQUFBLGFBQW5CLEVBQWtDO0FBQUEsUUFBQSxLQUFBLEVBQU8sbUJBQVA7T0FBbEMsQ0FBakIsQ0FiQSxDQUFBO0FBQUEsTUFjQSxJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLElBQUMsQ0FBQSxZQUFuQixFQUFpQztBQUFBLFFBQUEsS0FBQSxFQUFPLG9CQUFQO09BQWpDLENBQWpCLENBZEEsQ0FBQTthQWVBLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsSUFBQyxDQUFBLGFBQW5CLEVBQWtDO0FBQUEsUUFBQSxLQUFBLEVBQU8sZUFBUDtPQUFsQyxDQUFqQixFQWhCVTtJQUFBLENBakNaLENBQUE7O0FBQUEsMkJBbURBLFlBQUEsR0FBYyxTQUFBLEdBQUE7QUFDWixVQUFBLElBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsSUFBQyxDQUFBLE9BQW5CLEVBQ2Y7QUFBQSxRQUFBLGNBQUEsRUFBZ0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFDLEtBQUQsR0FBQTtBQUNkLFlBQUEsS0FBSyxDQUFDLGVBQU4sQ0FBQSxDQUFBLENBQUE7bUJBQ0EsS0FBQyxDQUFBLE1BQUQsQ0FBQSxFQUZjO1VBQUEsRUFBQTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBaEI7QUFBQSxRQUdBLGNBQUEsRUFBZ0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFDLEtBQUQsR0FBQTtBQUNkLFlBQUEsS0FBSyxDQUFDLGVBQU4sQ0FBQSxDQUFBLENBQUE7bUJBQ0EsS0FBQyxDQUFBLFVBQVUsQ0FBQyxNQUFaLENBQUEsRUFGYztVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBSGhCO09BRGUsQ0FBakIsQ0FBQSxDQUFBO0FBQUEsTUFTQSxJQUFBLEdBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQUEsQ0FUUCxDQUFBO0FBVUEsTUFBQSxJQUEwQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsNEJBQWhCLENBQTFCO0FBQUEsUUFBQSxJQUFDLENBQUEsZUFBRCxDQUFpQixJQUFqQixDQUFBLENBQUE7T0FWQTtBQUFBLE1BV0EsSUFBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCLElBQUksQ0FBQyxnQkFBTCxDQUFzQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxTQUFELEdBQUE7aUJBQ3JDLEtBQUMsQ0FBQSxZQUFELENBQWMsU0FBZCxFQURxQztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXRCLENBQWpCLENBWEEsQ0FBQTtBQUFBLE1BY0EsSUFBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCLElBQUMsQ0FBQSxVQUFVLENBQUMsc0JBQVosQ0FBbUMsSUFBQyxDQUFBLG1CQUFwQyxDQUFqQixDQWRBLENBQUE7QUFBQSxNQWVBLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQixJQUFDLENBQUEsVUFBVSxDQUFDLGdCQUFaLENBQTZCLElBQUMsQ0FBQSxZQUE5QixDQUFqQixDQWZBLENBQUE7QUFBQSxNQWdCQSxJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsSUFBQyxDQUFBLFVBQVUsQ0FBQyxpQkFBWixDQUE4QixJQUFDLENBQUEsV0FBL0IsQ0FBakIsQ0FoQkEsQ0FBQTtBQUFBLE1BaUJBLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQixJQUFDLENBQUEsVUFBVSxDQUFDLGVBQVosQ0FBNEIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsR0FBRCxHQUFBO0FBQzNDLFVBQUEsS0FBQyxDQUFBLFdBQVcsQ0FBQyxJQUFiLENBQWtCLGVBQWxCLENBQUEsQ0FBQTtBQUNBLFVBQUEsSUFBcUIsR0FBckI7QUFBQSxZQUFBLE9BQU8sQ0FBQyxLQUFSLENBQWMsR0FBZCxDQUFBLENBQUE7V0FEQTtBQUVBLFVBQUEsSUFBa0IsR0FBbEI7bUJBQUEsS0FBQyxDQUFBLFNBQUQsQ0FBVyxHQUFYLEVBQUE7V0FIMkM7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE1QixDQUFqQixDQWpCQSxDQUFBO0FBQUEsTUFzQkEsSUFBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCLElBQUMsQ0FBQSxVQUFVLENBQUMsZ0JBQVosQ0FBNkIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsTUFBRCxHQUFBO2lCQUM1QyxLQUFDLENBQUEsV0FBVyxDQUFDLElBQWIsQ0FBa0IsRUFBQSxHQUFHLE1BQUgsR0FBVSxvQkFBNUIsRUFENEM7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE3QixDQUFqQixDQXRCQSxDQUFBO0FBQUEsTUF5QkEsSUFBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCLElBQUksQ0FBQyxTQUFTLENBQUMseUJBQWYsQ0FBeUMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsSUFBRCxHQUFBO0FBQ3hELFVBQUEsb0JBQUcsSUFBSSxDQUFFLFdBQVcsQ0FBQyxjQUFsQixLQUEwQixZQUExQixJQUEyQyxLQUFDLENBQUEsVUFBVSxDQUFDLEtBQVosS0FBcUIsUUFBbkU7bUJBQ0UsS0FBQyxDQUFBLFVBQVUsQ0FBQyxNQUFaLENBQUEsRUFERjtXQUR3RDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXpDLENBQWpCLENBekJBLENBQUE7QUFBQSxNQTZCQSxJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBZixDQUFrQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxJQUFELEdBQUE7QUFDakQsY0FBQSxVQUFBO0FBQUEsVUFEbUQsYUFBRCxLQUFDLFVBQ25ELENBQUE7QUFBQSxVQUFBLElBQXdCLEtBQUMsQ0FBQSxVQUFVLENBQUMsS0FBWixLQUFxQixNQUE3QzttQkFBQSxLQUFDLENBQUEsVUFBVSxDQUFDLE1BQVosQ0FBQSxFQUFBO1dBRGlEO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEMsQ0FBakIsQ0E3QkEsQ0FBQTtBQUFBLE1BZ0NBLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQixJQUFJLENBQUMsU0FBUyxDQUFDLG9CQUFmLENBQW9DLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLElBQUQsR0FBQTtBQUNuRCxjQUFBLElBQUE7QUFBQSxVQURxRCxPQUFELEtBQUMsSUFDckQsQ0FBQTtBQUFBLFVBQUEsSUFBd0IsS0FBQyxDQUFBLFVBQVUsQ0FBQyxLQUFaLEtBQXFCLE1BQTdDO21CQUFBLEtBQUMsQ0FBQSxVQUFVLENBQUMsTUFBWixDQUFBLEVBQUE7V0FEbUQ7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFwQyxDQUFqQixDQWhDQSxDQUFBO0FBQUEsTUFtQ0EsSUFBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCLElBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWYsQ0FBa0MsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsTUFBRCxHQUFBO2lCQUNqRCxLQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsTUFBTSxDQUFDLFNBQVAsQ0FBaUIsU0FBQSxHQUFBO21CQUFHLEtBQUMsQ0FBQSxVQUFVLENBQUMsTUFBWixDQUFBLEVBQUg7VUFBQSxDQUFqQixDQUFqQixFQURpRDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWxDLENBQWpCLENBbkNBLENBQUE7QUFBQSxNQXNDQSxJQUFDLENBQUEsZ0JBQWdCLENBQUMsUUFBbEIsQ0FBQSxDQUE0QixDQUFDLGlCQUE3QixDQUErQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQzdDLFVBQUEsSUFBYSxLQUFDLENBQUEsZUFBZDtBQUFBLFlBQUEsS0FBQyxDQUFBLE1BQUQsQ0FBQSxDQUFBLENBQUE7V0FBQTtpQkFDQSxLQUFDLENBQUEsZUFBRCxHQUFtQixLQUYwQjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQS9DLENBdENBLENBQUE7QUFBQSxNQTBDQSxJQUFDLENBQUEsV0FBVyxDQUFDLEVBQWIsQ0FBZ0IsT0FBaEIsRUFBeUIsSUFBQyxDQUFBLGlCQUExQixDQTFDQSxDQUFBO0FBQUEsTUEyQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxFQUFmLENBQWtCLE9BQWxCLEVBQTJCLElBQUMsQ0FBQSxhQUE1QixDQTNDQSxDQUFBO0FBQUEsTUE0Q0EsSUFBQyxDQUFBLFlBQVksQ0FBQyxFQUFkLENBQWlCLE9BQWpCLEVBQTBCLElBQUMsQ0FBQSxNQUEzQixDQTVDQSxDQUFBO2FBNkNBLElBQUMsQ0FBQSxhQUFhLENBQUMsRUFBZixDQUFrQixPQUFsQixFQUEyQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUFHLEtBQUMsQ0FBQSxVQUFVLENBQUMsTUFBWixDQUFBLEVBQUg7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUEzQixFQTlDWTtJQUFBLENBbkRkLENBQUE7O0FBQUEsMkJBbUdBLE9BQUEsR0FBUyxTQUFBLEdBQUE7QUFDUCxNQUFBLElBQUMsQ0FBQSxVQUFVLENBQUMsWUFBWixDQUFBLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFdBQVcsQ0FBQyxPQUFiLENBQUEsQ0FEQSxDQUFBO2FBRUEsSUFBQyxDQUFBLE1BQUQsQ0FBQSxFQUhPO0lBQUEsQ0FuR1QsQ0FBQTs7QUFBQSwyQkF3R0EsWUFBQSxHQUFjLFNBQUMsSUFBRCxHQUFBO2FBQ1osWUFBWSxDQUFDLE9BQWIsQ0FBcUIsZ0JBQXJCLEVBQXVDLElBQXZDLEVBRFk7SUFBQSxDQXhHZCxDQUFBOztBQUFBLDJCQTJHQSxlQUFBLEdBQWlCLFNBQUMsSUFBRCxHQUFBO0FBQ2YsVUFBQSxJQUFBO0FBQUEsTUFBQSxJQUFBLEdBQU8sWUFBWSxDQUFDLE9BQWIsQ0FBcUIsZ0JBQXJCLENBQVAsQ0FBQTtBQUNBLE1BQUEsSUFBc0MsSUFBdEM7ZUFBQSxJQUFJLENBQUMsWUFBTCxDQUFrQixVQUFBLENBQVcsSUFBWCxDQUFsQixFQUFBO09BRmU7SUFBQSxDQTNHakIsQ0FBQTs7QUFBQSwyQkErR0EsUUFBQSxHQUFVLFNBQUEsR0FBQTtBQUNSLFVBQUEsS0FBQTtBQUFBLE1BQUEsSUFBMkIsSUFBQyxDQUFBLE9BQTVCO0FBQUEsZUFBTyxnQkFBUCxDQUFBO09BQUE7QUFDQSxjQUFPLEtBQUEsR0FBUSxJQUFDLENBQUEsVUFBVSxDQUFDLGFBQVosQ0FBQSxDQUFmO0FBQUEsYUFDTyxDQURQO2lCQUNlLGFBQUEsR0FBYSxLQUFiLEdBQW1CLFVBRGxDO0FBQUE7aUJBRVEsYUFBQSxHQUFhLEtBQWIsR0FBbUIsV0FGM0I7QUFBQSxPQUZRO0lBQUEsQ0EvR1YsQ0FBQTs7QUFBQSwyQkFxSEEsV0FBQSxHQUFhLFNBQUEsR0FBQTthQUNYLFlBRFc7SUFBQSxDQXJIYixDQUFBOztBQUFBLDJCQXdIQSxNQUFBLEdBQVEsU0FBQSxHQUFBO2FBQ04sSUFBQyxDQUFBLElBREs7SUFBQSxDQXhIUixDQUFBOztBQUFBLDJCQTJIQSxjQUFBLEdBQWdCLFNBQUEsR0FBQTthQUNkLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFBLENBQXdCLENBQUEsQ0FBQSxFQURWO0lBQUEsQ0EzSGhCLENBQUE7O0FBQUEsMkJBOEhBLGNBQUEsR0FBZ0IsU0FBQSxHQUFBO0FBQ2QsVUFBQSxLQUFBO3VFQUFnQyxDQUFFLFdBQWxDLENBQUEsV0FEYztJQUFBLENBOUhoQixDQUFBOztBQUFBLDJCQWlJQSxZQUFBLEdBQWMsU0FBQSxHQUFBO0FBQ1osTUFBQSxJQUFDLENBQUEsT0FBRCxHQUFXLElBQVgsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFdBQVcsQ0FBQyxJQUFiLENBQUEsQ0FEQSxDQUFBO2FBRUEsSUFBQyxDQUFBLGNBQUQsQ0FBQSxFQUhZO0lBQUEsQ0FqSWQsQ0FBQTs7QUFBQSwyQkFzSUEsV0FBQSxHQUFhLFNBQUEsR0FBQTtBQUNYLE1BQUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxLQUFYLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxXQUFXLENBQUMsSUFBYixDQUFBLENBREEsQ0FBQTthQUVBLElBQUMsQ0FBQSxjQUFELENBQUEsRUFIVztJQUFBLENBdEliLENBQUE7O0FBQUEsMkJBMklBLGNBQUEsR0FBZ0IsU0FBQSxHQUFBO0FBQ2QsVUFBQSwyQ0FBQTtBQUFBLE1BQUEsSUFBQSxHQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixJQUFuQixDQUFQLENBQUE7QUFDQSxNQUFBLElBQUEsQ0FBQSxDQUFjLElBQUEsaURBQTJCLENBQUUsdUJBQTNDLENBQUE7QUFBQSxjQUFBLENBQUE7T0FEQTtBQUVBO0FBQUE7V0FBQSw0Q0FBQTt3QkFBQTtBQUNFLDhEQUFBLEdBQUcsQ0FBQyx1QkFBSixDQURGO0FBQUE7c0JBSGM7SUFBQSxDQTNJaEIsQ0FBQTs7QUFBQSwyQkFpSkEsUUFBQSxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxVQUFVLENBQUMsUUFBWixDQUFBLEVBRFE7SUFBQSxDQWpKVixDQUFBOztBQUFBLDJCQW9KQSxTQUFBLEdBQVcsU0FBQyxPQUFELEdBQUE7O1FBQUMsVUFBVTtPQUNwQjthQUFBLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBbkIsQ0FBNEIsT0FBNUIsRUFBcUMsSUFBQyxDQUFBLG1CQUF0QyxFQURTO0lBQUEsQ0FwSlgsQ0FBQTs7QUFBQSwyQkF1SkEsV0FBQSxHQUFhLFNBQUMsT0FBRCxHQUFBOztRQUFDLFVBQVU7T0FDdEI7YUFBQSxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQW5CLENBQThCLE9BQTlCLEVBQXVDLElBQUMsQ0FBQSxtQkFBeEMsRUFEVztJQUFBLENBdkpiLENBQUE7O0FBQUEsMkJBMEpBLE1BQUEsR0FBUSxTQUFBLEdBQUE7QUFDTixVQUFBLHFDQUFBO0FBQUEsTUFBQSxJQUFVLElBQUMsQ0FBQSxVQUFVLENBQUMsV0FBWixDQUFBLENBQVY7QUFBQSxjQUFBLENBQUE7T0FBQTtBQUFBLE1BRUEsUUFBQSxHQUFXLEVBQUEsR0FBRSxDQUFDLElBQUMsQ0FBQSxjQUFELENBQUEsQ0FBQSxJQUFxQixPQUF0QixDQUFGLEdBQWdDLEtBRjNDLENBQUE7QUFHQSxNQUFBLElBQUcsV0FBQSxHQUFjLElBQUMsQ0FBQSxjQUFELENBQUEsQ0FBakI7QUFDRSxRQUFBLFFBQUEsR0FBVyxJQUFJLENBQUMsSUFBTCxDQUFVLFdBQVYsRUFBdUIsUUFBdkIsQ0FBWCxDQURGO09BSEE7QUFNQSxNQUFBLElBQUcsY0FBQSxHQUFpQixJQUFJLENBQUMsa0JBQUwsQ0FBd0IsUUFBUSxDQUFDLFdBQVQsQ0FBQSxDQUF4QixDQUFwQjtBQUNFLFFBQUEsRUFBRSxDQUFDLGFBQUgsQ0FBaUIsY0FBakIsRUFBaUMsSUFBQyxDQUFBLFVBQVUsQ0FBQyxXQUFaLENBQUEsQ0FBakMsQ0FBQSxDQUFBO2VBQ0EsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLGNBQXBCLEVBRkY7T0FQTTtJQUFBLENBMUpSLENBQUE7O0FBQUEsMkJBcUtBLGlCQUFBLEdBQW1CLFNBQUEsR0FBQTtBQUNqQixVQUFBLEtBQUE7QUFBQSxNQUFBLEtBQUEsR0FBUSxJQUFDLENBQUEsVUFBVSxDQUFDLGlCQUFaLENBQUEsQ0FBUixDQUFBO2FBQ0EsSUFBQyxDQUFBLG1CQUFELENBQXFCLEtBQXJCLEVBRmlCO0lBQUEsQ0FyS25CLENBQUE7O0FBQUEsMkJBeUtBLG1CQUFBLEdBQXFCLFNBQUMsS0FBRCxHQUFBO0FBQ25CLGNBQU8sS0FBUDtBQUFBLGFBQ08sTUFEUDtpQkFDbUIsSUFBQyxDQUFBLFdBQVcsQ0FBQyxJQUFiLENBQWtCLFdBQWxCLEVBRG5CO0FBQUEsYUFFTyxNQUZQO2lCQUVtQixJQUFDLENBQUEsV0FBVyxDQUFDLElBQWIsQ0FBa0IsWUFBbEIsRUFGbkI7QUFBQSxhQUdPLFFBSFA7aUJBR3FCLElBQUMsQ0FBQSxXQUFXLENBQUMsSUFBYixDQUFrQixhQUFsQixFQUhyQjtBQUFBLE9BRG1CO0lBQUEsQ0F6S3JCLENBQUE7O0FBQUEsMkJBK0tBLGFBQUEsR0FBZSxTQUFBLEdBQUE7QUFDYixNQUFBLElBQUEsQ0FBQSxJQUFRLENBQUEsV0FBUjtBQUNFLFFBQUEsSUFBQyxDQUFBLFdBQVcsQ0FBQyxJQUFiLENBQUEsQ0FBQSxDQUFBO0FBQUEsUUFDQSxJQUFDLENBQUEsV0FBRCxHQUFtQixJQUFBLFdBQUEsQ0FBWSxJQUFDLENBQUEsVUFBYixDQURuQixDQUFBO0FBQUEsUUFFQSxJQUFDLENBQUEsV0FBVyxDQUFDLElBQWIsQ0FBa0IsSUFBQyxDQUFBLFdBQW5CLENBRkEsQ0FERjtPQUFBO2FBSUEsSUFBQyxDQUFBLFdBQVcsQ0FBQyxXQUFiLENBQUEsRUFMYTtJQUFBLENBL0tmLENBQUE7O0FBQUEsMkJBc0xBLE1BQUEsR0FBUSxTQUFBLEdBQUE7YUFDTixJQUFDLENBQUEsVUFBVSxDQUFDLFdBQVosQ0FBd0IsSUFBQyxDQUFBLFlBQVksQ0FBQyxPQUFkLENBQUEsQ0FBeEIsRUFETTtJQUFBLENBdExSLENBQUE7O0FBQUEsMkJBeUxBLGdCQUFBLEdBQWtCLFNBQUEsR0FBQTtBQUNoQixNQUFBLElBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDRCQUFoQixDQUFIO2VBQ0UsSUFBQyxDQUFBLFdBQUQsQ0FBYSx5TkFBYixFQURGO09BRGdCO0lBQUEsQ0F6TGxCLENBQUE7O3dCQUFBOztLQUR5QixXQVQzQixDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/ah/.atom/packages/todo-show/lib/todo-view.coffee
