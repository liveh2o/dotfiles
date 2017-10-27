(function() {
  var CodeView, CompositeDisposable, ItemView, ShowTodoView, View,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  CompositeDisposable = require('atom').CompositeDisposable;

  View = require('atom-space-pen-views').View;

  ItemView = (function(superClass) {
    extend(ItemView, superClass);

    function ItemView() {
      return ItemView.__super__.constructor.apply(this, arguments);
    }

    ItemView.content = function(item) {
      return this.span({
        "class": 'badge badge-large',
        'data-id': item
      }, item);
    };

    return ItemView;

  })(View);

  CodeView = (function(superClass) {
    extend(CodeView, superClass);

    function CodeView() {
      return CodeView.__super__.constructor.apply(this, arguments);
    }

    CodeView.content = function(item) {
      return this.code(item);
    };

    return CodeView;

  })(View);

  module.exports = ShowTodoView = (function(superClass) {
    extend(ShowTodoView, superClass);

    function ShowTodoView() {
      this.updateShowInTable = bind(this.updateShowInTable, this);
      return ShowTodoView.__super__.constructor.apply(this, arguments);
    }

    ShowTodoView.content = function() {
      return this.div({
        outlet: 'todoOptions',
        "class": 'todo-options'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'option'
          }, function() {
            _this.h2('On Table');
            return _this.div({
              outlet: 'itemsOnTable',
              "class": 'block items-on-table'
            });
          });
          _this.div({
            "class": 'option'
          }, function() {
            _this.h2('Off Table');
            return _this.div({
              outlet: 'itemsOffTable',
              "class": 'block items-off-table'
            });
          });
          _this.div({
            "class": 'option'
          }, function() {
            _this.h2('Find Todos');
            return _this.div({
              outlet: 'findTodoDiv'
            });
          });
          _this.div({
            "class": 'option'
          }, function() {
            _this.h2('Find Regex');
            return _this.div({
              outlet: 'findRegexDiv'
            });
          });
          _this.div({
            "class": 'option'
          }, function() {
            _this.h2('Ignore Paths');
            return _this.div({
              outlet: 'ignorePathDiv'
            });
          });
          _this.div({
            "class": 'option'
          }, function() {
            _this.h2('Auto Refresh');
            return _this.div({
              "class": 'checkbox'
            }, function() {
              return _this.label(function() {
                return _this.input({
                  outlet: 'autoRefreshCheckbox',
                  "class": 'input-checkbox',
                  type: 'checkbox'
                });
              });
            });
          });
          return _this.div({
            "class": 'option'
          }, function() {
            return _this.div({
              "class": 'btn-group'
            }, function() {
              _this.button({
                outlet: 'configButton',
                "class": 'btn'
              }, "Go to Config");
              return _this.button({
                outlet: 'closeButton',
                "class": 'btn'
              }, "Close Options");
            });
          });
        };
      })(this));
    };

    ShowTodoView.prototype.initialize = function(collection) {
      this.collection = collection;
      this.disposables = new CompositeDisposable;
      this.handleEvents();
      return this.updateUI();
    };

    ShowTodoView.prototype.handleEvents = function() {
      this.configButton.on('click', function() {
        return atom.workspace.open('atom://config/packages/todo-show');
      });
      this.closeButton.on('click', (function(_this) {
        return function() {
          return _this.parent().slideToggle();
        };
      })(this));
      this.autoRefreshCheckbox.on('click', (function(_this) {
        return function(event) {
          return _this.autoRefreshChange(event.target.checked);
        };
      })(this));
      return this.disposables.add(atom.config.observe('todo-show.autoRefresh', (function(_this) {
        return function(newValue) {
          var ref;
          return (ref = _this.autoRefreshCheckbox.context) != null ? ref.checked = newValue : void 0;
        };
      })(this)));
    };

    ShowTodoView.prototype.detach = function() {
      return this.disposables.dispose();
    };

    ShowTodoView.prototype.updateShowInTable = function() {
      var showInTable;
      showInTable = this.sortable.toArray();
      return atom.config.set('todo-show.showInTable', showInTable);
    };

    ShowTodoView.prototype.updateUI = function() {
      var Sortable, i, item, j, k, len, len1, len2, path, ref, ref1, ref2, regex, results, tableItems, todo, todos;
      tableItems = atom.config.get('todo-show.showInTable');
      ref = this.collection.getAvailableTableItems();
      for (i = 0, len = ref.length; i < len; i++) {
        item = ref[i];
        if (tableItems.indexOf(item) === -1) {
          this.itemsOffTable.append(new ItemView(item));
        } else {
          this.itemsOnTable.append(new ItemView(item));
        }
      }
      Sortable = require('sortablejs');
      this.sortable = Sortable.create(this.itemsOnTable.context, {
        group: 'tableItems',
        ghostClass: 'ghost',
        onSort: this.updateShowInTable
      });
      Sortable.create(this.itemsOffTable.context, {
        group: 'tableItems',
        ghostClass: 'ghost'
      });
      ref1 = todos = atom.config.get('todo-show.findTheseTodos');
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        todo = ref1[j];
        this.findTodoDiv.append(new CodeView(todo));
      }
      regex = atom.config.get('todo-show.findUsingRegex');
      this.findRegexDiv.append(new CodeView(regex.replace('${TODOS}', todos.join('|'))));
      ref2 = atom.config.get('todo-show.ignoreThesePaths');
      results = [];
      for (k = 0, len2 = ref2.length; k < len2; k++) {
        path = ref2[k];
        results.push(this.ignorePathDiv.append(new CodeView(path)));
      }
      return results;
    };

    ShowTodoView.prototype.autoRefreshChange = function(state) {
      return atom.config.set('todo-show.autoRefresh', state);
    };

    return ShowTodoView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RvZG8tc2hvdy9saWIvdG9kby1vcHRpb25zLXZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSwyREFBQTtJQUFBOzs7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUN2QixPQUFRLE9BQUEsQ0FBUSxzQkFBUjs7RUFFSDs7Ozs7OztJQUNKLFFBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQyxJQUFEO2FBQ1IsSUFBQyxDQUFBLElBQUQsQ0FBTTtRQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sbUJBQVA7UUFBNEIsU0FBQSxFQUFXLElBQXZDO09BQU4sRUFBbUQsSUFBbkQ7SUFEUTs7OztLQURXOztFQUlqQjs7Ozs7OztJQUNKLFFBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQyxJQUFEO2FBQ1IsSUFBQyxDQUFBLElBQUQsQ0FBTSxJQUFOO0lBRFE7Ozs7S0FEVzs7RUFJdkIsTUFBTSxDQUFDLE9BQVAsR0FDTTs7Ozs7Ozs7SUFDSixZQUFDLENBQUEsT0FBRCxHQUFVLFNBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO1FBQUEsTUFBQSxFQUFRLGFBQVI7UUFBdUIsQ0FBQSxLQUFBLENBQUEsRUFBTyxjQUE5QjtPQUFMLEVBQW1ELENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtVQUNqRCxLQUFDLENBQUEsR0FBRCxDQUFLO1lBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxRQUFQO1dBQUwsRUFBc0IsU0FBQTtZQUNwQixLQUFDLENBQUEsRUFBRCxDQUFJLFVBQUo7bUJBQ0EsS0FBQyxDQUFBLEdBQUQsQ0FBSztjQUFBLE1BQUEsRUFBUSxjQUFSO2NBQXdCLENBQUEsS0FBQSxDQUFBLEVBQU8sc0JBQS9CO2FBQUw7VUFGb0IsQ0FBdEI7VUFJQSxLQUFDLENBQUEsR0FBRCxDQUFLO1lBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxRQUFQ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QURGO01BTUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxZQUFSO01BRVgsSUFBQyxDQUFBLFFBQUQsR0FBWSxRQUFRLENBQUMsTUFBVCxDQUNWLElBQUMsQ0FBQSxZQUFZLENBQUMsT0FESixFQUVWO1FBQUEsS0FBQSxFQUFPLFlBQVA7UUFDQSxVQUFBLEVBQVksT0FEWjtRQUVBLE1BQUEsRUFBUSxJQUFDLENBQUEsaUJBRlQ7T0FGVTtNQU9aLFFBQVEsQ0FBQyxNQUFULENBQ0UsSUFBQyxDQUFBLGFBQWEsQ0FBQyxPQURqQixFQUVFO1FBQUEsS0FBQSxFQUFPLFlBQVA7UUFDQSxVQUFBLEVBQVksT0FEWjtPQUZGO0FBTUE7QUFBQSxXQUFBLHdDQUFBOztRQUNFLElBQUMsQ0FBQSxXQUFXLENBQUMsTUFBYixDQUF3QixJQUFBLFFBQUEsQ0FBUyxJQUFULENBQXhCO0FBREY7TUFHQSxLQUFBLEdBQVEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDBCQUFoQjtNQUNSLElBQUMsQ0FBQSxZQUFZLENBQUMsTUFBZCxDQUF5QixJQUFBLFFBQUEsQ0FBUyxLQUFLLENBQUMsT0FBTixDQUFjLFVBQWQsRUFBMEIsS0FBSyxDQUFDLElBQU4sQ0FBVyxHQUFYLENBQTFCLENBQVQsQ0FBekI7QUFFQTtBQUFBO1dBQUEsd0NBQUE7O3FCQUNFLElBQUMsQ0FBQSxhQUFhLENBQUMsTUFBZixDQUEwQixJQUFBLFFBQUEsQ0FBUyxJQUFULENBQTFCO0FBREY7O0lBN0JROzsyQkFnQ1YsaUJBQUEsR0FBbUIsU0FBQyxLQUFEO2FBQ2pCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix1QkFBaEIsRUFBeUMsS0FBekM7SUFEaUI7Ozs7S0F6Rk07QUFaM0IiLCJzb3VyY2VzQ29udGVudCI6WyJ7Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xue1ZpZXd9ID0gcmVxdWlyZSAnYXRvbS1zcGFjZS1wZW4tdmlld3MnXG5cbmNsYXNzIEl0ZW1WaWV3IGV4dGVuZHMgVmlld1xuICBAY29udGVudDogKGl0ZW0pIC0+XG4gICAgQHNwYW4gY2xhc3M6ICdiYWRnZSBiYWRnZS1sYXJnZScsICdkYXRhLWlkJzogaXRlbSwgaXRlbVxuXG5jbGFzcyBDb2RlVmlldyBleHRlbmRzIFZpZXdcbiAgQGNvbnRlbnQ6IChpdGVtKSAtPlxuICAgIEBjb2RlIGl0ZW1cblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgU2hvd1RvZG9WaWV3IGV4dGVuZHMgVmlld1xuICBAY29udGVudDogLT5cbiAgICBAZGl2IG91dGxldDogJ3RvZG9PcHRpb25zJywgY2xhc3M6ICd0b2RvLW9wdGlvbnMnLCA9PlxuICAgICAgQGRpdiBjbGFzczogJ29wdGlvbicsID0+XG4gICAgICAgIEBoMiAnT24gVGFibGUnXG4gICAgICAgIEBkaXYgb3V0bGV0OiAnaXRlbXNPblRhYmxlJywgY2xhc3M6ICdibG9jayBpdGVtcy1vbi10YWJsZSdcblxuICAgICAgQGRpdiBjbGFzczogJ29wdGlvbicsID0+XG4gICAgICAgIEBoMiAnT2ZmIFRhYmxlJ1xuICAgICAgICBAZGl2IG91dGxldDogJ2l0ZW1zT2ZmVGFibGUnLCBjbGFzczogJ2Jsb2NrIGl0ZW1zLW9mZi10YWJsZSdcblxuICAgICAgQGRpdiBjbGFzczogJ29wdGlvbicsID0+XG4gICAgICAgIEBoMiAnRmluZCBUb2RvcydcbiAgICAgICAgQGRpdiBvdXRsZXQ6ICdmaW5kVG9kb0RpdidcblxuICAgICAgQGRpdiBjbGFzczogJ29wdGlvbicsID0+XG4gICAgICAgIEBoMiAnRmluZCBSZWdleCdcbiAgICAgICAgQGRpdiBvdXRsZXQ6ICdmaW5kUmVnZXhEaXYnXG5cbiAgICAgIEBkaXYgY2xhc3M6ICdvcHRpb24nLCA9PlxuICAgICAgICBAaDIgJ0lnbm9yZSBQYXRocydcbiAgICAgICAgQGRpdiBvdXRsZXQ6ICdpZ25vcmVQYXRoRGl2J1xuXG4gICAgICBAZGl2IGNsYXNzOiAnb3B0aW9uJywgPT5cbiAgICAgICAgQGgyICdBdXRvIFJlZnJlc2gnXG4gICAgICAgIEBkaXYgY2xhc3M6ICdjaGVja2JveCcsID0+XG4gICAgICAgICAgQGxhYmVsID0+XG4gICAgICAgICAgICBAaW5wdXQgb3V0bGV0OiAnYXV0b1JlZnJlc2hDaGVja2JveCcsIGNsYXNzOiAnaW5wdXQtY2hlY2tib3gnLCB0eXBlOiAnY2hlY2tib3gnXG5cbiAgICAgIEBkaXYgY2xhc3M6ICdvcHRpb24nLCA9PlxuICAgICAgICBAZGl2IGNsYXNzOiAnYnRuLWdyb3VwJywgPT5cbiAgICAgICAgICBAYnV0dG9uIG91dGxldDogJ2NvbmZpZ0J1dHRvbicsIGNsYXNzOiAnYnRuJywgXCJHbyB0byBDb25maWdcIlxuICAgICAgICAgIEBidXR0b24gb3V0bGV0OiAnY2xvc2VCdXR0b24nLCBjbGFzczogJ2J0bicsIFwiQ2xvc2UgT3B0aW9uc1wiXG5cbiAgaW5pdGlhbGl6ZTogKEBjb2xsZWN0aW9uKSAtPlxuICAgIEBkaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgQGhhbmRsZUV2ZW50cygpXG4gICAgQHVwZGF0ZVVJKClcblxuICBoYW5kbGVFdmVudHM6IC0+XG4gICAgQGNvbmZpZ0J1dHRvbi5vbiAnY2xpY2snLCAtPlxuICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbiAnYXRvbTovL2NvbmZpZy9wYWNrYWdlcy90b2RvLXNob3cnXG4gICAgQGNsb3NlQnV0dG9uLm9uICdjbGljaycsID0+XG4gICAgICBAcGFyZW50KCkuc2xpZGVUb2dnbGUoKVxuICAgIEBhdXRvUmVmcmVzaENoZWNrYm94Lm9uICdjbGljaycsIChldmVudCkgPT5cbiAgICAgIEBhdXRvUmVmcmVzaENoYW5nZShldmVudC50YXJnZXQuY2hlY2tlZClcblxuICAgIEBkaXNwb3NhYmxlcy5hZGQgYXRvbS5jb25maWcub2JzZXJ2ZSAndG9kby1zaG93LmF1dG9SZWZyZXNoJywgKG5ld1ZhbHVlKSA9PlxuICAgICAgQGF1dG9SZWZyZXNoQ2hlY2tib3guY29udGV4dD8uY2hlY2tlZCA9IG5ld1ZhbHVlXG5cbiAgZGV0YWNoOiAtPlxuICAgIEBkaXNwb3NhYmxlcy5kaXNwb3NlKClcblxuICB1cGRhdGVTaG93SW5UYWJsZTogPT5cbiAgICBzaG93SW5UYWJsZSA9IEBzb3J0YWJsZS50b0FycmF5KClcbiAgICBhdG9tLmNvbmZpZy5zZXQoJ3RvZG8tc2hvdy5zaG93SW5UYWJsZScsIHNob3dJblRhYmxlKVxuXG4gIHVwZGF0ZVVJOiAtPlxuICAgIHRhYmxlSXRlbXMgPSBhdG9tLmNvbmZpZy5nZXQoJ3RvZG8tc2hvdy5zaG93SW5UYWJsZScpXG4gICAgZm9yIGl0ZW0gaW4gQGNvbGxlY3Rpb24uZ2V0QXZhaWxhYmxlVGFibGVJdGVtcygpXG4gICAgICBpZiB0YWJsZUl0ZW1zLmluZGV4T2YoaXRlbSkgaXMgLTFcbiAgICAgICAgQGl0ZW1zT2ZmVGFibGUuYXBwZW5kIG5ldyBJdGVtVmlldyhpdGVtKVxuICAgICAgZWxzZVxuICAgICAgICBAaXRlbXNPblRhYmxlLmFwcGVuZCBuZXcgSXRlbVZpZXcoaXRlbSlcblxuICAgIFNvcnRhYmxlID0gcmVxdWlyZSAnc29ydGFibGVqcydcblxuICAgIEBzb3J0YWJsZSA9IFNvcnRhYmxlLmNyZWF0ZShcbiAgICAgIEBpdGVtc09uVGFibGUuY29udGV4dFxuICAgICAgZ3JvdXA6ICd0YWJsZUl0ZW1zJ1xuICAgICAgZ2hvc3RDbGFzczogJ2dob3N0J1xuICAgICAgb25Tb3J0OiBAdXBkYXRlU2hvd0luVGFibGVcbiAgICApXG5cbiAgICBTb3J0YWJsZS5jcmVhdGUoXG4gICAgICBAaXRlbXNPZmZUYWJsZS5jb250ZXh0XG4gICAgICBncm91cDogJ3RhYmxlSXRlbXMnXG4gICAgICBnaG9zdENsYXNzOiAnZ2hvc3QnXG4gICAgKVxuXG4gICAgZm9yIHRvZG8gaW4gdG9kb3MgPSBhdG9tLmNvbmZpZy5nZXQoJ3RvZG8tc2hvdy5maW5kVGhlc2VUb2RvcycpXG4gICAgICBAZmluZFRvZG9EaXYuYXBwZW5kIG5ldyBDb2RlVmlldyh0b2RvKVxuXG4gICAgcmVnZXggPSBhdG9tLmNvbmZpZy5nZXQoJ3RvZG8tc2hvdy5maW5kVXNpbmdSZWdleCcpXG4gICAgQGZpbmRSZWdleERpdi5hcHBlbmQgbmV3IENvZGVWaWV3KHJlZ2V4LnJlcGxhY2UoJyR7VE9ET1N9JywgdG9kb3Muam9pbignfCcpKSlcblxuICAgIGZvciBwYXRoIGluIGF0b20uY29uZmlnLmdldCgndG9kby1zaG93Lmlnbm9yZVRoZXNlUGF0aHMnKVxuICAgICAgQGlnbm9yZVBhdGhEaXYuYXBwZW5kIG5ldyBDb2RlVmlldyhwYXRoKVxuXG4gIGF1dG9SZWZyZXNoQ2hhbmdlOiAoc3RhdGUpIC0+XG4gICAgYXRvbS5jb25maWcuc2V0KCd0b2RvLXNob3cuYXV0b1JlZnJlc2gnLCBzdGF0ZSlcbiJdfQ==
