(function() {
  var CompositeDisposable, ScrollView, ShowTodoView, TextBuffer, TextEditorView, TodoOptions, TodoTable, fs, path, _ref, _ref1,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom'), CompositeDisposable = _ref.CompositeDisposable, TextBuffer = _ref.TextBuffer;

  _ref1 = require('atom-space-pen-views'), ScrollView = _ref1.ScrollView, TextEditorView = _ref1.TextEditorView;

  path = require('path');

  fs = require('fs-plus');

  TodoTable = require('./show-todo-table-view');

  TodoOptions = require('./show-todo-options-view');

  module.exports = ShowTodoView = (function(_super) {
    __extends(ShowTodoView, _super);

    ShowTodoView.content = function(model, filterBuffer) {
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
          return _this.subview('todoTable', new TodoTable(model));
        };
      })(this));
    };

    function ShowTodoView(model, uri) {
      this.model = model;
      this.uri = uri;
      this.toggleOptions = __bind(this.toggleOptions, this);
      this.setScopeButtonState = __bind(this.setScopeButtonState, this);
      this.toggleSearchScope = __bind(this.toggleSearchScope, this);
      this.saveAs = __bind(this.saveAs, this);
      this.stopLoading = __bind(this.stopLoading, this);
      this.startLoading = __bind(this.startLoading, this);
      ShowTodoView.__super__.constructor.call(this, this.model, this.filterBuffer = new TextBuffer);
    }

    ShowTodoView.prototype.initialize = function() {
      this.disposables = new CompositeDisposable;
      this.handleEvents();
      this.model.search();
      this.setScopeButtonState(this.model.getSearchScope());
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
            return _this.model.search();
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
      this.disposables.add(this.model.onDidChangeSearchScope(this.setScopeButtonState));
      this.disposables.add(this.model.onDidStartSearch(this.startLoading));
      this.disposables.add(this.model.onDidFinishSearch(this.stopLoading));
      this.disposables.add(this.model.onDidFailSearch((function(_this) {
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
      this.disposables.add(this.model.onDidSearchPaths((function(_this) {
        return function(nPaths) {
          return _this.searchCount.text("" + nPaths + " paths searched...");
        };
      })(this)));
      this.disposables.add(atom.workspace.onDidChangeActivePaneItem((function(_this) {
        return function(item) {
          if ((item != null ? item.constructor.name : void 0) === 'TextEditor' && _this.model.scope === 'active') {
            return _this.model.search();
          }
        };
      })(this)));
      this.disposables.add(atom.workspace.onDidAddTextEditor((function(_this) {
        return function(_arg) {
          var textEditor;
          textEditor = _arg.textEditor;
          if (_this.model.scope === 'open') {
            return _this.model.search();
          }
        };
      })(this)));
      this.disposables.add(atom.workspace.onDidDestroyPaneItem((function(_this) {
        return function(_arg) {
          var item;
          item = _arg.item;
          if (_this.model.scope === 'open') {
            return _this.model.search();
          }
        };
      })(this)));
      this.disposables.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          return _this.disposables.add(editor.onDidSave(function() {
            return _this.model.search();
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
          return _this.model.search();
        };
      })(this));
    };

    ShowTodoView.prototype.destroy = function() {
      this.model.cancelSearch();
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
      return this.model.getTodos();
    };

    ShowTodoView.prototype.showError = function(message) {
      return atom.notifications.addError('todo-show', {
        detail: message,
        dismissable: true
      });
    };

    ShowTodoView.prototype.saveAs = function() {
      var filePath, outputFilePath, projectPath;
      if (this.model.isSearching()) {
        return;
      }
      filePath = "" + (this.getProjectName() || 'todos') + ".md";
      if (projectPath = this.getProjectPath()) {
        filePath = path.join(projectPath, filePath);
      }
      if (outputFilePath = atom.showSaveDialogSync(filePath.toLowerCase())) {
        fs.writeFileSync(outputFilePath, this.model.getMarkdown());
        return atom.workspace.open(outputFilePath);
      }
    };

    ShowTodoView.prototype.toggleSearchScope = function() {
      var scope;
      scope = this.model.toggleSearchScope();
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
        this.todoOptions = new TodoOptions(this.model);
        this.optionsView.html(this.todoOptions);
      }
      return this.optionsView.slideToggle();
    };

    ShowTodoView.prototype.filter = function() {
      return this.model.filterTodos(this.filterBuffer.getText());
    };

    return ShowTodoView;

  })(ScrollView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RvZG8tc2hvdy9saWIvc2hvdy10b2RvLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHdIQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUEsT0FBb0MsT0FBQSxDQUFRLE1BQVIsQ0FBcEMsRUFBQywyQkFBQSxtQkFBRCxFQUFzQixrQkFBQSxVQUF0QixDQUFBOztBQUFBLEVBQ0EsUUFBK0IsT0FBQSxDQUFRLHNCQUFSLENBQS9CLEVBQUMsbUJBQUEsVUFBRCxFQUFhLHVCQUFBLGNBRGIsQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUZQLENBQUE7O0FBQUEsRUFHQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVIsQ0FITCxDQUFBOztBQUFBLEVBS0EsU0FBQSxHQUFZLE9BQUEsQ0FBUSx3QkFBUixDQUxaLENBQUE7O0FBQUEsRUFNQSxXQUFBLEdBQWMsT0FBQSxDQUFRLDBCQUFSLENBTmQsQ0FBQTs7QUFBQSxFQVFBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixtQ0FBQSxDQUFBOztBQUFBLElBQUEsWUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFDLEtBQUQsRUFBUSxZQUFSLEdBQUE7QUFDUixVQUFBLFlBQUE7QUFBQSxNQUFBLFlBQUEsR0FBZSxJQUFJLENBQUMsU0FBUyxDQUFDLGVBQWYsQ0FDYjtBQUFBLFFBQUEsSUFBQSxFQUFNLElBQU47QUFBQSxRQUNBLFNBQUEsRUFBVyxDQURYO0FBQUEsUUFFQSxRQUFBLEVBQVUsSUFGVjtBQUFBLFFBR0EsV0FBQSxFQUFhLEtBSGI7QUFBQSxRQUlBLE1BQUEsRUFBUSxZQUpSO0FBQUEsUUFLQSxlQUFBLEVBQWlCLGNBTGpCO09BRGEsQ0FBZixDQUFBO2FBU0EsSUFBQyxDQUFBLEdBQUQsQ0FB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

//# sourceURL=/Users/ah/.atom/packages/todo-show/lib/show-todo-view.coffee
