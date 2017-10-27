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
          if (_this.collection.scope === 'open') {
            return _this.search();
          }
        };
      })(this)));
      this.disposables.add(atom.workspace.onDidDestroyPaneItem((function(_this) {
        return function(arg) {
          var item;
          item = arg.item;
          if (_this.collection.scope === 'open') {
            return _this.search();
          }
        };
      })(this)));
      this.disposables.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          return _this.disposables.add(editor.onDidSave(function() {
            return _this.search();
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
        scope: this.collection.scope
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RvZG8tc2hvdy9saWIvdG9kby12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsNElBQUE7SUFBQTs7OztFQUFBLE1BQW9DLE9BQUEsQ0FBUSxNQUFSLENBQXBDLEVBQUMsNkNBQUQsRUFBc0I7O0VBQ3RCLE9BQStCLE9BQUEsQ0FBUSxzQkFBUixDQUEvQixFQUFDLDRCQUFELEVBQWE7O0VBQ2IsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNQLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUjs7RUFFTCxTQUFBLEdBQVksT0FBQSxDQUFRLG1CQUFSOztFQUNaLFdBQUEsR0FBYyxPQUFBLENBQVEscUJBQVI7O0VBRWQsb0JBQUEsR0FBdUIsU0FBQyxNQUFEO0FBQ3JCLFFBQUE7SUFBQSxJQUFHLHNDQUFIO2FBQ0UsSUFBSSxDQUFDLFNBQVMsQ0FBQyxlQUFmLENBQStCLE1BQS9CLEVBREY7S0FBQSxNQUFBO01BR0UsVUFBQSxHQUFhLE9BQUEsQ0FBUSxNQUFSLENBQWUsQ0FBQzthQUN6QixJQUFBLFVBQUEsQ0FBVyxNQUFYLEVBSk47O0VBRHFCOztFQU92QixNQUFNLENBQUMsT0FBUCxHQUNNOzs7SUFDSixZQUFDLENBQUEsT0FBRCxHQUFVLFNBQUMsVUFBRCxFQUFhLFlBQWI7QUFDUixVQUFBO01BQUEsWUFBQSxHQUFlLG9CQUFBLENBQ2I7UUFBQSxJQUFBLEVBQU0sSUFBTjtRQUNBLFNBQUEsRUFBVyxDQURYO1FBRUEsUUFBQSxFQUFVLElBRlY7UUFHQSxXQUFBLEVBQWEsS0FIYjtRQUlBLE1BQUEsRUFBUSxZQUpSO1FBS0EsZUFBQSxFQUFpQixjQUxqQjtPQURhO2FBU2YsSUFBQyxDQUFBLEdBQUQsQ0FBSztRQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sbUJBQVA7UUFBNEIsUUFBQSxFQUFVLENBQUMsQ0FBdkM7T0FB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QUFiLENBQUE7UUFDQSxJQUFDLENBQUEsV0FBRCxHQUFtQixJQUFBLFdBQUEsQ0FBWSxJQUFDLENBQUEsVUFBYjtRQUNuQixJQUFDLENBQUEsV0FBVyxDQUFDLElBQWIsQ0FBa0IsSUFBQyxDQUFBLFdBQW5CLEVBSEY7O2FBSUEsSUFBQyxDQUFBLFdBQVcsQ0FBQyxXQUFiLENBQUE7SUFMYTs7MkJBT2YsTUFBQSxHQUFRLFNBQUE7YUFDTixJQUFDLENBQUEsVUFBVSxDQUFDLFdBQVosQ0FBd0IsSUFBQyxDQUFBLFlBQVksQ0FBQyxPQUFkLENBQUEsQ0FBeEI7SUFETTs7MkJBR1IsZ0JBQUEsR0FBa0IsU0FBQTtNQUNoQixJQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiw0QkFBaEIsQ0FBSDtlQUNFLElBQUMsQ0FBQSxXQUFELENBQWEseU5BQWIsRUFERjs7SUFEZ0I7Ozs7S0FsTU87QUFoQjNCIiwic291cmNlc0NvbnRlbnQiOlsie0NvbXBvc2l0ZURpc3Bvc2FibGUsIFRleHRCdWZmZXJ9ID0gcmVxdWlyZSAnYXRvbSdcbntTY3JvbGxWaWV3LCBUZXh0RWRpdG9yVmlld30gPSByZXF1aXJlICdhdG9tLXNwYWNlLXBlbi12aWV3cydcbnBhdGggPSByZXF1aXJlICdwYXRoJ1xuZnMgPSByZXF1aXJlICdmcy1wbHVzJ1xuXG5Ub2RvVGFibGUgPSByZXF1aXJlICcuL3RvZG8tdGFibGUtdmlldydcblRvZG9PcHRpb25zID0gcmVxdWlyZSAnLi90b2RvLW9wdGlvbnMtdmlldydcblxuZGVwcmVjYXRlZFRleHRFZGl0b3IgPSAocGFyYW1zKSAtPlxuICBpZiBhdG9tLndvcmtzcGFjZS5idWlsZFRleHRFZGl0b3I/XG4gICAgYXRvbS53b3Jrc3BhY2UuYnVpbGRUZXh0RWRpdG9yKHBhcmFtcylcbiAgZWxzZVxuICAgIFRleHRFZGl0b3IgPSByZXF1aXJlKCdhdG9tJykuVGV4dEVkaXRvclxuICAgIG5ldyBUZXh0RWRpdG9yKHBhcmFtcylcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgU2hvd1RvZG9WaWV3IGV4dGVuZHMgU2Nyb2xsVmlld1xuICBAY29udGVudDogKGNvbGxlY3Rpb24sIGZpbHRlckJ1ZmZlcikgLT5cbiAgICBmaWx0ZXJFZGl0b3IgPSBkZXByZWNhdGVkVGV4dEVkaXRvcihcbiAgICAgIG1pbmk6IHRydWVcbiAgICAgIHRhYkxlbmd0aDogMlxuICAgICAgc29mdFRhYnM6IHRydWVcbiAgICAgIHNvZnRXcmFwcGVkOiBmYWxzZVxuICAgICAgYnVmZmVyOiBmaWx0ZXJCdWZmZXJcbiAgICAgIHBsYWNlaG9sZGVyVGV4dDogJ1NlYXJjaCBUb2RvcydcbiAgICApXG5cbiAgICBAZGl2IGNsYXNzOiAnc2hvdy10b2RvLXByZXZpZXcnLCB0YWJpbmRleDogLTEsID0+XG4gICAgICBAZGl2IGNsYXNzOiAnaW5wdXQtYmxvY2snLCA9PlxuICAgICAgICBAZGl2IGNsYXNzOiAnaW5wdXQtYmxvY2staXRlbSBpbnB1dC1ibG9jay1pdGVtLS1mbGV4JywgPT5cbiAgICAgICAgICBAc3VidmlldyAnZmlsdGVyRWRpdG9yVmlldycsIG5ldyBUZXh0RWRpdG9yVmlldyhlZGl0b3I6IGZpbHRlckVkaXRvcilcbiAgICAgICAgQGRpdiBjbGFzczogJ2lucHV0LWJsb2NrLWl0ZW0nLCA9PlxuICAgICAgICAgIEBkaXYgY2xhc3M6ICdidG4tZ3JvdXAnLCA9PlxuICAgICAgICAgICAgQGJ1dHRvbiBvdXRsZXQ6ICdzY29wZUJ1dHRvbicsIGNsYXNzOiAnYnRuJ1xuICAgICAgICAgICAgQGJ1dHRvbiBvdXRsZXQ6ICdvcHRpb25zQnV0dG9uJywgY2xhc3M6ICdidG4gaWNvbi1nZWFyJ1xuICAgICAgICAgICAgQGJ1dHRvbiBvdXRsZXQ6ICdzYXZlQXNCdXR0b24nLCBjbGFzczogJ2J0biBpY29uLWNsb3VkLWRvd25sb2FkJ1xuICAgICAgICAgICAgQGJ1dHRvbiBvdXRsZXQ6ICdyZWZyZXNoQnV0dG9uJywgY2xhc3M6ICdidG4gaWNvbi1zeW5jJ1xuXG4gICAgICBAZGl2IGNsYXNzOiAnaW5wdXQtYmxvY2sgdG9kby1pbmZvLWJsb2NrJywgPT5cbiAgICAgICAgQGRpdiBjbGFzczogJ2lucHV0LWJsb2NrLWl0ZW0nLCA9PlxuICAgICAgICAgIEBzcGFuIG91dGxldDogJ3RvZG9JbmZvJ1xuXG4gICAgICBAZGl2IG91dGxldDogJ29wdGlvbnNWaWV3J1xuXG4gICAgICBAZGl2IG91dGxldDogJ3RvZG9Mb2FkaW5nJywgY2xhc3M6ICd0b2RvLWxvYWRpbmcnLCA9PlxuICAgICAgICBAZGl2IGNsYXNzOiAnbWFya2Rvd24tc3Bpbm5lcidcbiAgICAgICAgQGg1IG91dGxldDogJ3NlYXJjaENvdW50JywgY2xhc3M6ICd0ZXh0LWNlbnRlcicsIFwiTG9hZGluZyBUb2Rvcy4uLlwiXG5cbiAgICAgIEBzdWJ2aWV3ICd0b2RvVGFibGUnLCBuZXcgVG9kb1RhYmxlKGNvbGxlY3Rpb24pXG5cbiAgY29uc3RydWN0b3I6IChAY29sbGVjdGlvbiwgQHVyaSkgLT5cbiAgICBzdXBlciBAY29sbGVjdGlvbiwgQGZpbHRlckJ1ZmZlciA9IG5ldyBUZXh0QnVmZmVyXG5cbiAgaW5pdGlhbGl6ZTogLT5cbiAgICBAZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIEBoYW5kbGVFdmVudHMoKVxuICAgIEBzZXRTY29wZUJ1dHRvblN0YXRlKEBjb2xsZWN0aW9uLmdldFNlYXJjaFNjb3BlKCkpXG5cbiAgICBAb25seVNlYXJjaFdoZW5WaXNpYmxlID0gdHJ1ZVxuICAgIEBub3RpZmljYXRpb25PcHRpb25zID1cbiAgICAgIGRldGFpbDogJ0F0b20gdG9kby1zaG93IHBhY2thZ2UnXG4gICAgICBkaXNtaXNzYWJsZTogdHJ1ZVxuICAgICAgaWNvbjogQGdldEljb25OYW1lKClcblxuICAgIEBjaGVja0RlcHJlY2F0aW9uKClcblxuICAgIEBkaXNwb3NhYmxlcy5hZGQgYXRvbS50b29sdGlwcy5hZGQgQHNjb3BlQnV0dG9uLCB0aXRsZTogXCJXaGF0IHRvIFNlYXJjaFwiXG4gICAgQGRpc3Bvc2FibGVzLmFkZCBhdG9tLnRvb2x0aXBzLmFkZCBAb3B0aW9uc0J1dHRvbiwgdGl0bGU6IFwiU2hvdyBUb2RvIE9wdGlvbnNcIlxuICAgIEBkaXNwb3NhYmxlcy5hZGQgYXRvbS50b29sdGlwcy5hZGQgQHNhdmVBc0J1dHRvbiwgdGl0bGU6IFwiU2F2ZSBUb2RvcyB0byBGaWxlXCJcbiAgICBAZGlzcG9zYWJsZXMuYWRkIGF0b20udG9vbHRpcHMuYWRkIEByZWZyZXNoQnV0dG9uLCB0aXRsZTogXCJSZWZyZXNoIFRvZG9zXCJcblxuICBoYW5kbGVFdmVudHM6IC0+XG4gICAgQGRpc3Bvc2FibGVzLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCBAZWxlbWVudCxcbiAgICAgICdjb3JlOnNhdmUtYXMnOiAoZXZlbnQpID0+XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgIEBzYXZlQXMoKVxuICAgICAgJ2NvcmU6cmVmcmVzaCc6IChldmVudCkgPT5cbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgQHNlYXJjaCgpXG5cbiAgICBAZGlzcG9zYWJsZXMuYWRkIEBjb2xsZWN0aW9uLm9uRGlkU3RhcnRTZWFyY2ggQHN0YXJ0TG9hZGluZ1xuICAgIEBkaXNwb3NhYmxlcy5hZGQgQGNvbGxlY3Rpb24ub25EaWRGaW5pc2hTZWFyY2ggQHN0b3BMb2FkaW5nXG4gICAgQGRpc3Bvc2FibGVzLmFkZCBAY29sbGVjdGlvbi5vbkRpZEZhaWxTZWFyY2ggKGVycikgPT5cbiAgICAgIEBzZWFyY2hDb3VudC50ZXh0IFwiU2VhcmNoIEZhaWxlZFwiXG4gICAgICBjb25zb2xlLmVycm9yIGVyciBpZiBlcnJcbiAgICAgIEBzaG93RXJyb3IgZXJyIGlmIGVyclxuXG4gICAgQGRpc3Bvc2FibGVzLmFkZCBAY29sbGVjdGlvbi5vbkRpZENoYW5nZVNlYXJjaFNjb3BlIChzY29wZSkgPT5cbiAgICAgIEBzZXRTY29wZUJ1dHRvblN0YXRlKHNjb3BlKVxuICAgICAgQHNlYXJjaCgpXG5cbiAgICBAZGlzcG9zYWJsZXMuYWRkIEBjb2xsZWN0aW9uLm9uRGlkU2VhcmNoUGF0aHMgKG5QYXRocykgPT5cbiAgICAgIEBzZWFyY2hDb3VudC50ZXh0IFwiI3tuUGF0aHN9IHBhdGhzIHNlYXJjaGVkLi4uXCJcblxuICAgIEBkaXNwb3NhYmxlcy5hZGQgYXRvbS53b3Jrc3BhY2Uub25EaWRDaGFuZ2VBY3RpdmVQYW5lSXRlbSAoaXRlbSkgPT5cbiAgICAgIGlmIEBjb2xsZWN0aW9uLnNldEFjdGl2ZVByb2plY3QoaXRlbT8uZ2V0UGF0aD8oKSkgb3JcbiAgICAgIChpdGVtPy5jb25zdHJ1Y3Rvci5uYW1lIGlzICdUZXh0RWRpdG9yJyBhbmQgQGNvbGxlY3Rpb24uc2NvcGUgaXMgJ2FjdGl2ZScpXG4gICAgICAgIEBzZWFyY2goKVxuXG4gICAgQGRpc3Bvc2FibGVzLmFkZCBhdG9tLndvcmtzcGFjZS5vbkRpZEFkZFRleHRFZGl0b3IgKHt0ZXh0RWRpdG9yfSkgPT5cbiAgICAgIEBzZWFyY2goKSBpZiBAY29sbGVjdGlvbi5zY29wZSBpcyAnb3BlbidcblxuICAgIEBkaXNwb3NhYmxlcy5hZGQgYXRvbS53b3Jrc3BhY2Uub25EaWREZXN0cm95UGFuZUl0ZW0gKHtpdGVtfSkgPT5cbiAgICAgIEBzZWFyY2goKSBpZiBAY29sbGVjdGlvbi5zY29wZSBpcyAnb3BlbidcblxuICAgIEBkaXNwb3NhYmxlcy5hZGQgYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzIChlZGl0b3IpID0+XG4gICAgICBAZGlzcG9zYWJsZXMuYWRkIGVkaXRvci5vbkRpZFNhdmUgPT4gQHNlYXJjaCgpXG5cbiAgICBAZmlsdGVyRWRpdG9yVmlldy5nZXRNb2RlbCgpLm9uRGlkU3RvcENoYW5naW5nID0+XG4gICAgICBAZmlsdGVyKCkgaWYgQGZpcnN0VGltZUZpbHRlclxuICAgICAgQGZpcnN0VGltZUZpbHRlciA9IHRydWVcblxuICAgIEBzY29wZUJ1dHRvbi5vbiAnY2xpY2snLCBAdG9nZ2xlU2VhcmNoU2NvcGVcbiAgICBAb3B0aW9uc0J1dHRvbi5vbiAnY2xpY2snLCBAdG9nZ2xlT3B0aW9uc1xuICAgIEBzYXZlQXNCdXR0b24ub24gJ2NsaWNrJywgQHNhdmVBc1xuICAgIEByZWZyZXNoQnV0dG9uLm9uICdjbGljaycsID0+IEBzZWFyY2goKVxuXG4gIGRlc3Ryb3k6IC0+XG4gICAgQGNvbGxlY3Rpb24uY2FuY2VsU2VhcmNoKClcbiAgICBAZGlzcG9zYWJsZXMuZGlzcG9zZSgpXG4gICAgQGRldGFjaCgpXG5cbiAgc2VyaWFsaXplOiAtPlxuICAgIGRlc2VyaWFsaXplcjogJ3RvZG8tc2hvdy90b2RvLXZpZXcnXG4gICAgc2NvcGU6IEBjb2xsZWN0aW9uLnNjb3BlXG5cbiAgZ2V0VGl0bGU6IC0+IFwiVG9kbyBTaG93XCJcbiAgZ2V0SWNvbk5hbWU6IC0+IFwiY2hlY2tsaXN0XCJcbiAgZ2V0VVJJOiAtPiBAdXJpXG4gIGdldERlZmF1bHRMb2NhdGlvbjogLT4gJ3JpZ2h0J1xuICBnZXRBbGxvd2VkTG9jYXRpb25zOiAtPiBbJ2xlZnQnLCAncmlnaHQnLCAnYm90dG9tJ11cbiAgZ2V0UHJvamVjdE5hbWU6IC0+IEBjb2xsZWN0aW9uLmdldEFjdGl2ZVByb2plY3ROYW1lKClcbiAgZ2V0UHJvamVjdFBhdGg6IC0+IEBjb2xsZWN0aW9uLmdldEFjdGl2ZVByb2plY3QoKVxuXG4gIGdldFRvZG9zOiAtPiBAY29sbGVjdGlvbi5nZXRUb2RvcygpXG4gIGdldFRvZG9zQ291bnQ6IC0+IEBjb2xsZWN0aW9uLmdldFRvZG9zQ291bnQoKVxuICBpc1NlYXJjaGluZzogLT4gQGNvbGxlY3Rpb24uZ2V0U3RhdGUoKVxuICBzZWFyY2g6IC0+XG4gICAgaWYgQG9ubHlTZWFyY2hXaGVuVmlzaWJsZVxuICAgICAgcmV0dXJuIHVubGVzcyBhdG9tLndvcmtzcGFjZS5wYW5lQ29udGFpbmVyRm9ySXRlbSh0aGlzKT8uaXNWaXNpYmxlKClcbiAgICBAY29sbGVjdGlvbi5zZWFyY2goKVxuXG4gIHN0YXJ0TG9hZGluZzogPT5cbiAgICBAdG9kb0xvYWRpbmcuc2hvdygpXG4gICAgQHVwZGF0ZUluZm8oKVxuXG4gIHN0b3BMb2FkaW5nOiA9PlxuICAgIEB0b2RvTG9hZGluZy5oaWRlKClcbiAgICBAdXBkYXRlSW5mbygpXG5cbiAgdXBkYXRlSW5mbzogLT5cbiAgICBAdG9kb0luZm8uaHRtbChcIiN7QGdldEluZm9UZXh0KCl9ICN7QGdldFNjb3BlVGV4dCgpfVwiKVxuXG4gIGdldEluZm9UZXh0OiAtPlxuICAgIHJldHVybiBcIkZvdW5kIC4uLiByZXN1bHRzXCIgaWYgQGlzU2VhcmNoaW5nKClcbiAgICBzd2l0Y2ggY291bnQgPSBAZ2V0VG9kb3NDb3VudCgpXG4gICAgICB3aGVuIDEgdGhlbiBcIkZvdW5kICN7Y291bnR9IHJlc3VsdFwiXG4gICAgICBlbHNlIFwiRm91bmQgI3tjb3VudH0gcmVzdWx0c1wiXG5cbiAgZ2V0U2NvcGVUZXh0OiAtPlxuICAgICMgVE9ETzogQWxzbyBzaG93IG51bWJlciBvZiBmaWxlc1xuXG4gICAgc3dpdGNoIEBjb2xsZWN0aW9uLnNjb3BlXG4gICAgICB3aGVuICdhY3RpdmUnXG4gICAgICAgIFwiaW4gYWN0aXZlIGZpbGVcIlxuICAgICAgd2hlbiAnb3BlbidcbiAgICAgICAgXCJpbiBvcGVuIGZpbGVzXCJcbiAgICAgIHdoZW4gJ3Byb2plY3QnXG4gICAgICAgIFwiaW4gcHJvamVjdCA8Y29kZT4je0BnZXRQcm9qZWN0TmFtZSgpfTwvY29kZT5cIlxuICAgICAgZWxzZVxuICAgICAgICBcImluIHdvcmtzcGFjZVwiXG5cbiAgc2hvd0Vycm9yOiAobWVzc2FnZSA9ICcnKSAtPlxuICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvciBtZXNzYWdlLnRvU3RyaW5nKCksIEBub3RpZmljYXRpb25PcHRpb25zXG5cbiAgc2hvd1dhcm5pbmc6IChtZXNzYWdlID0gJycpIC0+XG4gICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFdhcm5pbmcgbWVzc2FnZS50b1N0cmluZygpLCBAbm90aWZpY2F0aW9uT3B0aW9uc1xuXG4gIHNhdmVBczogPT5cbiAgICByZXR1cm4gaWYgQGlzU2VhcmNoaW5nKClcblxuICAgIGZpbGVQYXRoID0gXCIje0BnZXRQcm9qZWN0TmFtZSgpIG9yICd0b2Rvcyd9Lm1kXCJcbiAgICBpZiBwcm9qZWN0UGF0aCA9IEBnZXRQcm9qZWN0UGF0aCgpXG4gICAgICBmaWxlUGF0aCA9IHBhdGguam9pbihwcm9qZWN0UGF0aCwgZmlsZVBhdGgpXG5cbiAgICBpZiBvdXRwdXRGaWxlUGF0aCA9IGF0b20uc2hvd1NhdmVEaWFsb2dTeW5jKGZpbGVQYXRoLnRvTG93ZXJDYXNlKCkpXG4gICAgICBmcy53cml0ZUZpbGVTeW5jKG91dHB1dEZpbGVQYXRoLCBAY29sbGVjdGlvbi5nZXRNYXJrZG93bigpKVxuICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbihvdXRwdXRGaWxlUGF0aClcblxuICB0b2dnbGVTZWFyY2hTY29wZTogPT5cbiAgICBzY29wZSA9IEBjb2xsZWN0aW9uLnRvZ2dsZVNlYXJjaFNjb3BlKClcbiAgICBAc2V0U2NvcGVCdXR0b25TdGF0ZShzY29wZSlcblxuICBzZXRTY29wZUJ1dHRvblN0YXRlOiAoc3RhdGUpID0+XG4gICAgc3dpdGNoIHN0YXRlXG4gICAgICB3aGVuICd3b3Jrc3BhY2UnIHRoZW4gQHNjb3BlQnV0dG9uLnRleHQgJ1dvcmtzcGFjZSdcbiAgICAgIHdoZW4gJ3Byb2plY3QnIHRoZW4gQHNjb3BlQnV0dG9uLnRleHQgJ1Byb2plY3QnXG4gICAgICB3aGVuICdvcGVuJyB0aGVuIEBzY29wZUJ1dHRvbi50ZXh0ICdPcGVuIEZpbGVzJ1xuICAgICAgd2hlbiAnYWN0aXZlJyB0aGVuIEBzY29wZUJ1dHRvbi50ZXh0ICdBY3RpdmUgRmlsZSdcblxuICB0b2dnbGVPcHRpb25zOiA9PlxuICAgIHVubGVzcyBAdG9kb09wdGlvbnNcbiAgICAgIEBvcHRpb25zVmlldy5oaWRlKClcbiAgICAgIEB0b2RvT3B0aW9ucyA9IG5ldyBUb2RvT3B0aW9ucyhAY29sbGVjdGlvbilcbiAgICAgIEBvcHRpb25zVmlldy5odG1sIEB0b2RvT3B0aW9uc1xuICAgIEBvcHRpb25zVmlldy5zbGlkZVRvZ2dsZSgpXG5cbiAgZmlsdGVyOiAtPlxuICAgIEBjb2xsZWN0aW9uLmZpbHRlclRvZG9zIEBmaWx0ZXJCdWZmZXIuZ2V0VGV4dCgpXG5cbiAgY2hlY2tEZXByZWNhdGlvbjogLT5cbiAgICBpZiBhdG9tLmNvbmZpZy5nZXQoJ3RvZG8tc2hvdy5maW5kVGhlc2VSZWdleGVzJylcbiAgICAgIEBzaG93V2FybmluZyAnJydcbiAgICAgIERlcHJlY2F0aW9uIFdhcm5pbmc6XFxuXG4gICAgICBgZmluZFRoZXNlUmVnZXhlc2AgY29uZmlnIGlzIGRlcHJlY2F0ZWQsIHBsZWFzZSB1c2UgYGZpbmRUaGVzZVRvZG9zYCBhbmQgYGZpbmRVc2luZ1JlZ2V4YCBmb3IgY3VzdG9tIGJlaGF2aW91ci5cbiAgICAgIFNlZSBodHRwczovL2dpdGh1Yi5jb20vbXJvZGFsZ2FhcmQvYXRvbS10b2RvLXNob3cjY29uZmlnIGZvciBtb3JlIGluZm9ybWF0aW9uLlxuICAgICAgJycnXG4iXX0=
