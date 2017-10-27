(function() {
  var CompositeDisposable, ScrollView, ShowTodoView, TodoOptions, TodoTable, fs, path,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  CompositeDisposable = require('atom').CompositeDisposable;

  ScrollView = require('atom-space-pen-views').ScrollView;

  path = require('path');

  fs = require('fs-plus');

  TodoTable = require('./show-todo-table-view');

  TodoOptions = require('./show-todo-options-view');

  module.exports = ShowTodoView = (function(_super) {
    __extends(ShowTodoView, _super);

    function ShowTodoView() {
      this.toggleOptions = __bind(this.toggleOptions, this);
      this.setScopeButtonState = __bind(this.setScopeButtonState, this);
      this.toggleSearchScope = __bind(this.toggleSearchScope, this);
      this.saveAs = __bind(this.saveAs, this);
      this.stopLoading = __bind(this.stopLoading, this);
      this.startLoading = __bind(this.startLoading, this);
      return ShowTodoView.__super__.constructor.apply(this, arguments);
    }

    ShowTodoView.content = function(model) {
      this.model = model;
      return this.div({
        "class": 'show-todo-preview native-key-bindings',
        tabindex: -1
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'text-right'
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
          _this.div({
            outlet: 'optionsView'
          });
          _this.div({
            outlet: 'todoLoading'
          }, function() {
            _this.div({
              "class": 'markdown-spinner'
            });
            return _this.h5({
              outlet: 'searchCount',
              "class": 'text-center'
            }, "Loading Todos...");
          });
          return _this.subview('todoTable', new TodoTable(_this.model));
        };
      })(this));
    };

    ShowTodoView.prototype.initialize = function(model, uri) {
      this.model = model;
      this.uri = uri;
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
      var _ref;
      return (_ref = atom.project.getDirectories()[0]) != null ? _ref.getBaseName() : void 0;
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

    return ShowTodoView;

  })(ScrollView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RvZG8tc2hvdy9saWIvc2hvdy10b2RvLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLCtFQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFDQyxhQUFjLE9BQUEsQ0FBUSxzQkFBUixFQUFkLFVBREQsQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUZQLENBQUE7O0FBQUEsRUFHQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVIsQ0FITCxDQUFBOztBQUFBLEVBS0EsU0FBQSxHQUFZLE9BQUEsQ0FBUSx3QkFBUixDQUxaLENBQUE7O0FBQUEsRUFNQSxXQUFBLEdBQWMsT0FBQSxDQUFRLDBCQUFSLENBTmQsQ0FBQTs7QUFBQSxFQVFBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixtQ0FBQSxDQUFBOzs7Ozs7Ozs7O0tBQUE7O0FBQUEsSUFBQSxZQUFDLENBQUEsT0FBRCxHQUFVLFNBQUUsS0FBRixHQUFBO0FBQ1IsTUFEUyxJQUFDLENBQUEsUUFBQSxLQUNWLENBQUE7YUFBQSxJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sdUNBQVA7QUFBQSxRQUFnRCxRQUFBLEVBQVUsQ0FBQSxDQUExRDtPQUFMLEVBQW1FLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDakUsVUFBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxPQUFBLEVBQU8sWUFBUDtXQUFMLEVBQTBCLFNBQUEsR0FBQTttQkFDeEIsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLGNBQUEsT0FBQSxFQUFPLFdBQVA7YUFBTCxFQUF5QixTQUFB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

//# sourceURL=/Users/ah/.atom/packages/todo-show/lib/show-todo-view.coffee
