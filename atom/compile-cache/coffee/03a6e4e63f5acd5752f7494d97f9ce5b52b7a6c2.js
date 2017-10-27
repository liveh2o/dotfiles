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
          return _this.searchCount.text(nPaths + " paths searched...");
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
        return function(arg) {
          var textEditor;
          textEditor = arg.textEditor;
          if (_this.collection.scope === 'open') {
            return _this.collection.search();
          }
        };
      })(this)));
      this.disposables.add(atom.workspace.onDidDestroyPaneItem((function(_this) {
        return function(arg) {
          var item;
          item = arg.item;
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RvZG8tc2hvdy9saWIvdG9kby12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsNElBQUE7SUFBQTs7OztFQUFBLE1BQW9DLE9BQUEsQ0FBUSxNQUFSLENBQXBDLEVBQUMsNkNBQUQsRUFBc0I7O0VBQ3RCLE9BQStCLE9BQUEsQ0FBUSxzQkFBUixDQUEvQixFQUFDLDRCQUFELEVBQWE7O0VBQ2IsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNQLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUjs7RUFFTCxTQUFBLEdBQVksT0FBQSxDQUFRLG1CQUFSOztFQUNaLFdBQUEsR0FBYyxPQUFBLENBQVEscUJBQVI7O0VBRWQsb0JBQUEsR0FBdUIsU0FBQyxNQUFEO0FBQ3JCLFFBQUE7SUFBQSxJQUFHLHNDQUFIO2FBQ0UsSUFBSSxDQUFDLFNBQVMsQ0FBQyxlQUFmLENBQStCLE1BQS9CLEVBREY7S0FBQSxNQUFBO01BR0UsVUFBQSxHQUFhLE9BQUEsQ0FBUSxNQUFSLENBQWUsQ0FBQzthQUN6QixJQUFBLFVBQUEsQ0FBVyxNQUFYLEVBSk47O0VBRHFCOztFQU92QixNQUFNLENBQUMsT0FBUCxHQUNNOzs7SUFDSixZQUFDLENBQUEsT0FBRCxHQUFVLFNBQUMsVUFBRCxFQUFhLFlBQWI7QUFDUixVQUFBO01BQUEsWUFBQSxHQUFlLG9CQUFBLENBQ2I7UUFBQSxJQUFBLEVBQU0sSUFBTjtRQUNBLFNBQUEsRUFBVyxDQURYO1FBRUEsUUFBQSxFQUFVLElBRlY7UUFHQSxXQUFBLEVBQWEsS0FIYjtRQUlBLE1BQUEsRUFBUSxZQUpSO1FBS0EsZUFBQSxFQUFpQixjQUxqQjtPQURhO2FBU2YsSUFBQyxDQUFBLEdBQUQsQ0FBSztRQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sbUJBQVA7UUFBNEIsUUFBQSxFQUFVLENBQUMsQ0FBdkM7T0FB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bEI7QUFEeEIsYUFFTyxTQUZQO2lCQUVzQixJQUFDLENBQUEsV0FBVyxDQUFDLElBQWIsQ0FBa0IsU0FBbEI7QUFGdEIsYUFHTyxNQUhQO2lCQUdtQixJQUFDLENBQUEsV0FBVyxDQUFDLElBQWIsQ0FBa0IsWUFBbEI7QUFIbkIsYUFJTyxRQUpQO2lCQUlxQixJQUFDLENBQUEsV0FBVyxDQUFDLElBQWIsQ0FBa0IsYUFBbEI7QUFKckI7SUFEbUI7OzJCQU9yQixhQUFBLEdBQWUsU0FBQTtNQUNiLElBQUEsQ0FBTyxJQUFDLENBQUEsV0FBUjtRQUNFLElBQUMsQ0FBQSxXQUFXLENBQUMsSUFBYixDQUFBO1FBQ0EsSUFBQyxDQUFBLFdBQUQsR0FBbUIsSUFBQSxXQUFBLENBQVksSUFBQyxDQUFBLFVBQWI7UUFDbkIsSUFBQyxDQUFBLFdBQVcsQ0FBQyxJQUFiLENBQWtCLElBQUMsQ0FBQSxXQUFuQixFQUhGOzthQUlBLElBQUMsQ0FBQSxXQUFXLENBQUMsV0FBYixDQUFBO0lBTGE7OzJCQU9mLE1BQUEsR0FBUSxTQUFBO2FBQ04sSUFBQyxDQUFBLFVBQVUsQ0FBQyxXQUFaLENBQXdCLElBQUMsQ0FBQSxZQUFZLENBQUMsT0FBZCxDQUFBLENBQXhCO0lBRE07OzJCQUdSLGdCQUFBLEdBQWtCLFNBQUE7TUFDaEIsSUFBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsNEJBQWhCLENBQUg7ZUFDRSxJQUFDLENBQUEsV0FBRCxDQUFhLHlOQUFiLEVBREY7O0lBRGdCOzs7O0tBcE1PO0FBaEIzQiIsInNvdXJjZXNDb250ZW50IjpbIntDb21wb3NpdGVEaXNwb3NhYmxlLCBUZXh0QnVmZmVyfSA9IHJlcXVpcmUgJ2F0b20nXG57U2Nyb2xsVmlldywgVGV4dEVkaXRvclZpZXd9ID0gcmVxdWlyZSAnYXRvbS1zcGFjZS1wZW4tdmlld3MnXG5wYXRoID0gcmVxdWlyZSAncGF0aCdcbmZzID0gcmVxdWlyZSAnZnMtcGx1cydcblxuVG9kb1RhYmxlID0gcmVxdWlyZSAnLi90b2RvLXRhYmxlLXZpZXcnXG5Ub2RvT3B0aW9ucyA9IHJlcXVpcmUgJy4vdG9kby1vcHRpb25zLXZpZXcnXG5cbmRlcHJlY2F0ZWRUZXh0RWRpdG9yID0gKHBhcmFtcykgLT5cbiAgaWYgYXRvbS53b3Jrc3BhY2UuYnVpbGRUZXh0RWRpdG9yP1xuICAgIGF0b20ud29ya3NwYWNlLmJ1aWxkVGV4dEVkaXRvcihwYXJhbXMpXG4gIGVsc2VcbiAgICBUZXh0RWRpdG9yID0gcmVxdWlyZSgnYXRvbScpLlRleHRFZGl0b3JcbiAgICBuZXcgVGV4dEVkaXRvcihwYXJhbXMpXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIFNob3dUb2RvVmlldyBleHRlbmRzIFNjcm9sbFZpZXdcbiAgQGNvbnRlbnQ6IChjb2xsZWN0aW9uLCBmaWx0ZXJCdWZmZXIpIC0+XG4gICAgZmlsdGVyRWRpdG9yID0gZGVwcmVjYXRlZFRleHRFZGl0b3IoXG4gICAgICBtaW5pOiB0cnVlXG4gICAgICB0YWJMZW5ndGg6IDJcbiAgICAgIHNvZnRUYWJzOiB0cnVlXG4gICAgICBzb2Z0V3JhcHBlZDogZmFsc2VcbiAgICAgIGJ1ZmZlcjogZmlsdGVyQnVmZmVyXG4gICAgICBwbGFjZWhvbGRlclRleHQ6ICdTZWFyY2ggVG9kb3MnXG4gICAgKVxuXG4gICAgQGRpdiBjbGFzczogJ3Nob3ctdG9kby1wcmV2aWV3JywgdGFiaW5kZXg6IC0xLCA9PlxuICAgICAgQGRpdiBjbGFzczogJ2lucHV0LWJsb2NrJywgPT5cbiAgICAgICAgQGRpdiBjbGFzczogJ2lucHV0LWJsb2NrLWl0ZW0gaW5wdXQtYmxvY2staXRlbS0tZmxleCcsID0+XG4gICAgICAgICAgQHN1YnZpZXcgJ2ZpbHRlckVkaXRvclZpZXcnLCBuZXcgVGV4dEVkaXRvclZpZXcoZWRpdG9yOiBmaWx0ZXJFZGl0b3IpXG4gICAgICAgIEBkaXYgY2xhc3M6ICdpbnB1dC1ibG9jay1pdGVtJywgPT5cbiAgICAgICAgICBAZGl2IGNsYXNzOiAnYnRuLWdyb3VwJywgPT5cbiAgICAgICAgICAgIEBidXR0b24gb3V0bGV0OiAnc2NvcGVCdXR0b24nLCBjbGFzczogJ2J0bidcbiAgICAgICAgICAgIEBidXR0b24gb3V0bGV0OiAnb3B0aW9uc0J1dHRvbicsIGNsYXNzOiAnYnRuIGljb24tZ2VhcidcbiAgICAgICAgICAgIEBidXR0b24gb3V0bGV0OiAnc2F2ZUFzQnV0dG9uJywgY2xhc3M6ICdidG4gaWNvbi1jbG91ZC1kb3dubG9hZCdcbiAgICAgICAgICAgIEBidXR0b24gb3V0bGV0OiAncmVmcmVzaEJ1dHRvbicsIGNsYXNzOiAnYnRuIGljb24tc3luYydcblxuICAgICAgQGRpdiBjbGFzczogJ2lucHV0LWJsb2NrIHRvZG8taW5mby1ibG9jaycsID0+XG4gICAgICAgIEBkaXYgY2xhc3M6ICdpbnB1dC1ibG9jay1pdGVtJywgPT5cbiAgICAgICAgICBAc3BhbiBvdXRsZXQ6ICd0b2RvSW5mbydcblxuICAgICAgQGRpdiBvdXRsZXQ6ICdvcHRpb25zVmlldydcblxuICAgICAgQGRpdiBvdXRsZXQ6ICd0b2RvTG9hZGluZycsIGNsYXNzOiAndG9kby1sb2FkaW5nJywgPT5cbiAgICAgICAgQGRpdiBjbGFzczogJ21hcmtkb3duLXNwaW5uZXInXG4gICAgICAgIEBoNSBvdXRsZXQ6ICdzZWFyY2hDb3VudCcsIGNsYXNzOiAndGV4dC1jZW50ZXInLCBcIkxvYWRpbmcgVG9kb3MuLi5cIlxuXG4gICAgICBAc3VidmlldyAndG9kb1RhYmxlJywgbmV3IFRvZG9UYWJsZShjb2xsZWN0aW9uKVxuXG4gIGNvbnN0cnVjdG9yOiAoQGNvbGxlY3Rpb24sIEB1cmkpIC0+XG4gICAgc3VwZXIgQGNvbGxlY3Rpb24sIEBmaWx0ZXJCdWZmZXIgPSBuZXcgVGV4dEJ1ZmZlclxuXG4gIGluaXRpYWxpemU6IC0+XG4gICAgQGRpc3Bvc2FibGVzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICBAaGFuZGxlRXZlbnRzKClcbiAgICBAY29sbGVjdGlvbi5zZWFyY2goKVxuICAgIEBzZXRTY29wZUJ1dHRvblN0YXRlKEBjb2xsZWN0aW9uLmdldFNlYXJjaFNjb3BlKCkpXG5cbiAgICBAbm90aWZpY2F0aW9uT3B0aW9ucyA9XG4gICAgICBkZXRhaWw6ICdBdG9tIHRvZG8tc2hvdyBwYWNrYWdlJ1xuICAgICAgZGlzbWlzc2FibGU6IHRydWVcbiAgICAgIGljb246IEBnZXRJY29uTmFtZSgpXG5cbiAgICBAY2hlY2tEZXByZWNhdGlvbigpXG5cbiAgICBAZGlzcG9zYWJsZXMuYWRkIGF0b20udG9vbHRpcHMuYWRkIEBzY29wZUJ1dHRvbiwgdGl0bGU6IFwiV2hhdCB0byBTZWFyY2hcIlxuICAgIEBkaXNwb3NhYmxlcy5hZGQgYXRvbS50b29sdGlwcy5hZGQgQG9wdGlvbnNCdXR0b24sIHRpdGxlOiBcIlNob3cgVG9kbyBPcHRpb25zXCJcbiAgICBAZGlzcG9zYWJsZXMuYWRkIGF0b20udG9vbHRpcHMuYWRkIEBzYXZlQXNCdXR0b24sIHRpdGxlOiBcIlNhdmUgVG9kb3MgdG8gRmlsZVwiXG4gICAgQGRpc3Bvc2FibGVzLmFkZCBhdG9tLnRvb2x0aXBzLmFkZCBAcmVmcmVzaEJ1dHRvbiwgdGl0bGU6IFwiUmVmcmVzaCBUb2Rvc1wiXG5cbiAgaGFuZGxlRXZlbnRzOiAtPlxuICAgIEBkaXNwb3NhYmxlcy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgQGVsZW1lbnQsXG4gICAgICAnY29yZTpzYXZlLWFzJzogKGV2ZW50KSA9PlxuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICBAc2F2ZUFzKClcbiAgICAgICdjb3JlOnJlZnJlc2gnOiAoZXZlbnQpID0+XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgIEBjb2xsZWN0aW9uLnNlYXJjaCgpXG5cbiAgICAjIFBlcnNpc3QgcGFuZSBzaXplIGJ5IHNhdmluZyB0byBsb2NhbCBzdG9yYWdlXG4gICAgcGFuZSA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKVxuICAgIEByZXN0b3JlUGFuZUZsZXgocGFuZSkgaWYgYXRvbS5jb25maWcuZ2V0KCd0b2RvLXNob3cucmVtZW1iZXJWaWV3U2l6ZScpXG4gICAgQGRpc3Bvc2FibGVzLmFkZCBwYW5lLm9ic2VydmVGbGV4U2NhbGUgKGZsZXhTY2FsZSkgPT5cbiAgICAgIEBzYXZlUGFuZUZsZXgoZmxleFNjYWxlKVxuXG4gICAgQGRpc3Bvc2FibGVzLmFkZCBAY29sbGVjdGlvbi5vbkRpZFN0YXJ0U2VhcmNoIEBzdGFydExvYWRpbmdcbiAgICBAZGlzcG9zYWJsZXMuYWRkIEBjb2xsZWN0aW9uLm9uRGlkRmluaXNoU2VhcmNoIEBzdG9wTG9hZGluZ1xuICAgIEBkaXNwb3NhYmxlcy5hZGQgQGNvbGxlY3Rpb24ub25EaWRGYWlsU2VhcmNoIChlcnIpID0+XG4gICAgICBAc2VhcmNoQ291bnQudGV4dCBcIlNlYXJjaCBGYWlsZWRcIlxuICAgICAgY29uc29sZS5lcnJvciBlcnIgaWYgZXJyXG4gICAgICBAc2hvd0Vycm9yIGVyciBpZiBlcnJcblxuICAgIEBkaXNwb3NhYmxlcy5hZGQgQGNvbGxlY3Rpb24ub25EaWRDaGFuZ2VTZWFyY2hTY29wZSAoc2NvcGUpID0+XG4gICAgICBAc2V0U2NvcGVCdXR0b25TdGF0ZShzY29wZSlcbiAgICAgIEBjb2xsZWN0aW9uLnNlYXJjaCgpXG5cbiAgICBAZGlzcG9zYWJsZXMuYWRkIEBjb2xsZWN0aW9uLm9uRGlkU2VhcmNoUGF0aHMgKG5QYXRocykgPT5cbiAgICAgIEBzZWFyY2hDb3VudC50ZXh0IFwiI3tuUGF0aHN9IHBhdGhzIHNlYXJjaGVkLi4uXCJcblxuICAgIEBkaXNwb3NhYmxlcy5hZGQgYXRvbS53b3Jrc3BhY2Uub25EaWRDaGFuZ2VBY3RpdmVQYW5lSXRlbSAoaXRlbSkgPT5cbiAgICAgIGlmIEBjb2xsZWN0aW9uLnNldEFjdGl2ZVByb2plY3QoaXRlbT8uZ2V0UGF0aD8oKSkgb3JcbiAgICAgIChpdGVtPy5jb25zdHJ1Y3Rvci5uYW1lIGlzICdUZXh0RWRpdG9yJyBhbmQgQGNvbGxlY3Rpb24uc2NvcGUgaXMgJ2FjdGl2ZScpXG4gICAgICAgIEBjb2xsZWN0aW9uLnNlYXJjaCgpXG5cbiAgICBAZGlzcG9zYWJsZXMuYWRkIGF0b20ud29ya3NwYWNlLm9uRGlkQWRkVGV4dEVkaXRvciAoe3RleHRFZGl0b3J9KSA9PlxuICAgICAgQGNvbGxlY3Rpb24uc2VhcmNoKCkgaWYgQGNvbGxlY3Rpb24uc2NvcGUgaXMgJ29wZW4nXG5cbiAgICBAZGlzcG9zYWJsZXMuYWRkIGF0b20ud29ya3NwYWNlLm9uRGlkRGVzdHJveVBhbmVJdGVtICh7aXRlbX0pID0+XG4gICAgICBAY29sbGVjdGlvbi5zZWFyY2goKSBpZiBAY29sbGVjdGlvbi5zY29wZSBpcyAnb3BlbidcblxuICAgIEBkaXNwb3NhYmxlcy5hZGQgYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzIChlZGl0b3IpID0+XG4gICAgICBAZGlzcG9zYWJsZXMuYWRkIGVkaXRvci5vbkRpZFNhdmUgPT4gQGNvbGxlY3Rpb24uc2VhcmNoKClcblxuICAgIEBmaWx0ZXJFZGl0b3JWaWV3LmdldE1vZGVsKCkub25EaWRTdG9wQ2hhbmdpbmcgPT5cbiAgICAgIEBmaWx0ZXIoKSBpZiBAZmlyc3RUaW1lRmlsdGVyXG4gICAgICBAZmlyc3RUaW1lRmlsdGVyID0gdHJ1ZVxuXG4gICAgQHNjb3BlQnV0dG9uLm9uICdjbGljaycsIEB0b2dnbGVTZWFyY2hTY29wZVxuICAgIEBvcHRpb25zQnV0dG9uLm9uICdjbGljaycsIEB0b2dnbGVPcHRpb25zXG4gICAgQHNhdmVBc0J1dHRvbi5vbiAnY2xpY2snLCBAc2F2ZUFzXG4gICAgQHJlZnJlc2hCdXR0b24ub24gJ2NsaWNrJywgPT4gQGNvbGxlY3Rpb24uc2VhcmNoKClcblxuICBkZXN0cm95OiAtPlxuICAgIEBjb2xsZWN0aW9uLmNhbmNlbFNlYXJjaCgpXG4gICAgQGRpc3Bvc2FibGVzLmRpc3Bvc2UoKVxuICAgIEBkZXRhY2goKVxuXG4gIHNhdmVQYW5lRmxleDogKGZsZXgpIC0+XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0gJ3RvZG8tc2hvdy5mbGV4JywgZmxleFxuXG4gIHJlc3RvcmVQYW5lRmxleDogKHBhbmUpIC0+XG4gICAgZmxleCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtICd0b2RvLXNob3cuZmxleCdcbiAgICBwYW5lLnNldEZsZXhTY2FsZSBwYXJzZUZsb2F0KGZsZXgpIGlmIGZsZXhcblxuICBnZXRUaXRsZTogLT4gXCJUb2RvIFNob3dcIlxuICBnZXRJY29uTmFtZTogLT4gXCJjaGVja2xpc3RcIlxuICBnZXRVUkk6IC0+IEB1cmlcbiAgZ2V0UHJvamVjdE5hbWU6IC0+IEBjb2xsZWN0aW9uLmdldEFjdGl2ZVByb2plY3ROYW1lKClcbiAgZ2V0UHJvamVjdFBhdGg6IC0+IEBjb2xsZWN0aW9uLmdldEFjdGl2ZVByb2plY3QoKVxuICBnZXRUb2RvczogLT4gQGNvbGxlY3Rpb24uZ2V0VG9kb3MoKVxuICBnZXRUb2Rvc0NvdW50OiAtPiBAY29sbGVjdGlvbi5nZXRUb2Rvc0NvdW50KClcbiAgaXNTZWFyY2hpbmc6IC0+IEBjb2xsZWN0aW9uLmdldFN0YXRlKClcblxuICBzdGFydExvYWRpbmc6ID0+XG4gICAgQHRvZG9Mb2FkaW5nLnNob3coKVxuICAgIEB1cGRhdGVJbmZvKClcblxuICBzdG9wTG9hZGluZzogPT5cbiAgICBAdG9kb0xvYWRpbmcuaGlkZSgpXG4gICAgQHVwZGF0ZUluZm8oKVxuXG4gIHVwZGF0ZUluZm86IC0+XG4gICAgQHRvZG9JbmZvLmh0bWwoXCIje0BnZXRJbmZvVGV4dCgpfSAje0BnZXRTY29wZVRleHQoKX1cIilcblxuICBnZXRJbmZvVGV4dDogLT5cbiAgICByZXR1cm4gXCJGb3VuZCAuLi4gcmVzdWx0c1wiIGlmIEBpc1NlYXJjaGluZygpXG4gICAgc3dpdGNoIGNvdW50ID0gQGdldFRvZG9zQ291bnQoKVxuICAgICAgd2hlbiAxIHRoZW4gXCJGb3VuZCAje2NvdW50fSByZXN1bHRcIlxuICAgICAgZWxzZSBcIkZvdW5kICN7Y291bnR9IHJlc3VsdHNcIlxuXG4gIGdldFNjb3BlVGV4dDogLT5cbiAgICAjIFRPRE86IEFsc28gc2hvdyBudW1iZXIgb2YgZmlsZXNcblxuICAgIHN3aXRjaCBAY29sbGVjdGlvbi5zY29wZVxuICAgICAgd2hlbiAnYWN0aXZlJ1xuICAgICAgICBcImluIGFjdGl2ZSBmaWxlXCJcbiAgICAgIHdoZW4gJ29wZW4nXG4gICAgICAgIFwiaW4gb3BlbiBmaWxlc1wiXG4gICAgICB3aGVuICdwcm9qZWN0J1xuICAgICAgICBcImluIHByb2plY3QgPGNvZGU+I3tAZ2V0UHJvamVjdE5hbWUoKX08L2NvZGU+XCJcbiAgICAgIGVsc2VcbiAgICAgICAgXCJpbiB3b3Jrc3BhY2VcIlxuXG4gIHNob3dFcnJvcjogKG1lc3NhZ2UgPSAnJykgLT5cbiAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IgbWVzc2FnZS50b1N0cmluZygpLCBAbm90aWZpY2F0aW9uT3B0aW9uc1xuXG4gIHNob3dXYXJuaW5nOiAobWVzc2FnZSA9ICcnKSAtPlxuICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRXYXJuaW5nIG1lc3NhZ2UudG9TdHJpbmcoKSwgQG5vdGlmaWNhdGlvbk9wdGlvbnNcblxuICBzYXZlQXM6ID0+XG4gICAgcmV0dXJuIGlmIEBpc1NlYXJjaGluZygpXG5cbiAgICBmaWxlUGF0aCA9IFwiI3tAZ2V0UHJvamVjdE5hbWUoKSBvciAndG9kb3MnfS5tZFwiXG4gICAgaWYgcHJvamVjdFBhdGggPSBAZ2V0UHJvamVjdFBhdGgoKVxuICAgICAgZmlsZVBhdGggPSBwYXRoLmpvaW4ocHJvamVjdFBhdGgsIGZpbGVQYXRoKVxuXG4gICAgaWYgb3V0cHV0RmlsZVBhdGggPSBhdG9tLnNob3dTYXZlRGlhbG9nU3luYyhmaWxlUGF0aC50b0xvd2VyQ2FzZSgpKVxuICAgICAgZnMud3JpdGVGaWxlU3luYyhvdXRwdXRGaWxlUGF0aCwgQGNvbGxlY3Rpb24uZ2V0TWFya2Rvd24oKSlcbiAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4ob3V0cHV0RmlsZVBhdGgpXG5cbiAgdG9nZ2xlU2VhcmNoU2NvcGU6ID0+XG4gICAgc2NvcGUgPSBAY29sbGVjdGlvbi50b2dnbGVTZWFyY2hTY29wZSgpXG4gICAgQHNldFNjb3BlQnV0dG9uU3RhdGUoc2NvcGUpXG5cbiAgc2V0U2NvcGVCdXR0b25TdGF0ZTogKHN0YXRlKSA9PlxuICAgIHN3aXRjaCBzdGF0ZVxuICAgICAgd2hlbiAnd29ya3NwYWNlJyB0aGVuIEBzY29wZUJ1dHRvbi50ZXh0ICdXb3Jrc3BhY2UnXG4gICAgICB3aGVuICdwcm9qZWN0JyB0aGVuIEBzY29wZUJ1dHRvbi50ZXh0ICdQcm9qZWN0J1xuICAgICAgd2hlbiAnb3BlbicgdGhlbiBAc2NvcGVCdXR0b24udGV4dCAnT3BlbiBGaWxlcydcbiAgICAgIHdoZW4gJ2FjdGl2ZScgdGhlbiBAc2NvcGVCdXR0b24udGV4dCAnQWN0aXZlIEZpbGUnXG5cbiAgdG9nZ2xlT3B0aW9uczogPT5cbiAgICB1bmxlc3MgQHRvZG9PcHRpb25zXG4gICAgICBAb3B0aW9uc1ZpZXcuaGlkZSgpXG4gICAgICBAdG9kb09wdGlvbnMgPSBuZXcgVG9kb09wdGlvbnMoQGNvbGxlY3Rpb24pXG4gICAgICBAb3B0aW9uc1ZpZXcuaHRtbCBAdG9kb09wdGlvbnNcbiAgICBAb3B0aW9uc1ZpZXcuc2xpZGVUb2dnbGUoKVxuXG4gIGZpbHRlcjogLT5cbiAgICBAY29sbGVjdGlvbi5maWx0ZXJUb2RvcyBAZmlsdGVyQnVmZmVyLmdldFRleHQoKVxuXG4gIGNoZWNrRGVwcmVjYXRpb246IC0+XG4gICAgaWYgYXRvbS5jb25maWcuZ2V0KCd0b2RvLXNob3cuZmluZFRoZXNlUmVnZXhlcycpXG4gICAgICBAc2hvd1dhcm5pbmcgJycnXG4gICAgICBEZXByZWNhdGlvbiBXYXJuaW5nOlxcblxuICAgICAgYGZpbmRUaGVzZVJlZ2V4ZXNgIGNvbmZpZyBpcyBkZXByZWNhdGVkLCBwbGVhc2UgdXNlIGBmaW5kVGhlc2VUb2Rvc2AgYW5kIGBmaW5kVXNpbmdSZWdleGAgZm9yIGN1c3RvbSBiZWhhdmlvdXIuXG4gICAgICBTZWUgaHR0cHM6Ly9naXRodWIuY29tL21yb2RhbGdhYXJkL2F0b20tdG9kby1zaG93I2NvbmZpZyBmb3IgbW9yZSBpbmZvcm1hdGlvbi5cbiAgICAgICcnJ1xuIl19
