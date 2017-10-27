(function() {
  var CodeView, CompositeDisposable, ItemView, ShowTodoView, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  CompositeDisposable = require('atom').CompositeDisposable;

  View = require('atom-space-pen-views').View;

  ItemView = (function(_super) {
    __extends(ItemView, _super);

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

  CodeView = (function(_super) {
    __extends(CodeView, _super);

    function CodeView() {
      return CodeView.__super__.constructor.apply(this, arguments);
    }

    CodeView.content = function(item) {
      return this.code(item);
    };

    return CodeView;

  })(View);

  module.exports = ShowTodoView = (function(_super) {
    __extends(ShowTodoView, _super);

    function ShowTodoView() {
      this.updateShowInTable = __bind(this.updateShowInTable, this);
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
          return _this.div({
            "class": 'option'
          }, function() {
            _this.h2('');
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
      return this.closeButton.on('click', (function(_this) {
        return function() {
          return _this.parent().slideToggle();
        };
      })(this));
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
      var Sortable, item, path, regex, tableItems, todo, todos, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _results;
      tableItems = atom.config.get('todo-show.showInTable');
      _ref = this.collection.getAvailableTableItems();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
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
      _ref1 = todos = atom.config.get('todo-show.findTheseTodos');
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        todo = _ref1[_j];
        this.findTodoDiv.append(new CodeView(todo));
      }
      regex = atom.config.get('todo-show.findUsingRegex');
      this.findRegexDiv.append(new CodeView(regex.replace('${TODOS}', todos.join('|'))));
      _ref2 = atom.config.get('todo-show.ignoreThesePaths');
      _results = [];
      for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
        path = _ref2[_k];
        _results.push(this.ignorePathDiv.append(new CodeView(path)));
      }
      return _results;
    };

    return ShowTodoView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RvZG8tc2hvdy9saWIvdG9kby1vcHRpb25zLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDJEQUFBO0lBQUE7O3NGQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFDQyxPQUFRLE9BQUEsQ0FBUSxzQkFBUixFQUFSLElBREQsQ0FBQTs7QUFBQSxFQUdNO0FBQ0osK0JBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsUUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFDLElBQUQsR0FBQTthQUNSLElBQUMsQ0FBQSxJQUFELENBQU07QUFBQSxRQUFBLE9BQUEsRUFBTyxtQkFBUDtBQUFBLFFBQTRCLFNBQUEsRUFBVyxJQUF2QztPQUFOLEVBQW1ELElBQW5ELEVBRFE7SUFBQSxDQUFWLENBQUE7O29CQUFBOztLQURxQixLQUh2QixDQUFBOztBQUFBLEVBT007QUFDSiwrQkFBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSxRQUFDLENBQUEsT0FBRCxHQUFVLFNBQUMsSUFBRCxHQUFBO2FBQ1IsSUFBQyxDQUFBLElBQUQsQ0FBTSxJQUFOLEVBRFE7SUFBQSxDQUFWLENBQUE7O29CQUFBOztLQURxQixLQVB2QixDQUFBOztBQUFBLEVBV0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLG1DQUFBLENBQUE7Ozs7O0tBQUE7O0FBQUEsSUFBQSxZQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE1BQUEsRUFBUSxhQUFSO0FBQUEsUUFBdUIsT0FBQSxFQUFPLGNBQTlCO09BQUwsRUFBbUQsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtB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

//# sourceURL=/Users/ah/.atom/packages/todo-show/lib/todo-options-view.coffee
