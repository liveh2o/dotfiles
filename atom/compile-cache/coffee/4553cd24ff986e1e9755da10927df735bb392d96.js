(function() {
  var CodeView, CompositeDisposable, ItemView, RegexView, ShowTodoView, View,
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

  RegexView = (function(_super) {
    __extends(RegexView, _super);

    function RegexView() {
      return RegexView.__super__.constructor.apply(this, arguments);
    }

    RegexView.content = function(title, regex) {
      return this.div((function(_this) {
        return function() {
          _this.span("" + title + ": ");
          return _this.code(regex);
        };
      })(this));
    };

    return RegexView;

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
            _this.h2('Regexes');
            return _this.div({
              "class": 'regex',
              outlet: 'regexString'
            });
          });
          _this.div({
            "class": 'option'
          }, function() {
            _this.h2('Ignore Paths');
            return _this.div({
              "class": 'ignores',
              outlet: 'ignoresString'
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

    ShowTodoView.prototype.initialize = function(model) {
      this.model = model;
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
      var Sortable, i, item, path, regex, regexes, tableItems, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _results;
      tableItems = atom.config.get('todo-show.showInTable');
      _ref = this.model.getAvailableTableItems();
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
      regexes = atom.config.get('todo-show.findTheseRegexes');
      for (i = _j = 0, _len1 = regexes.length; _j < _len1; i = _j += 2) {
        regex = regexes[i];
        this.regexString.append(new RegexView(regex, regexes[i + 1]));
      }
      _ref1 = atom.config.get('todo-show.ignoreThesePaths');
      _results = [];
      for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
        path = _ref1[_k];
        _results.push(this.ignoresString.append(new CodeView(path)));
      }
      return _results;
    };

    return ShowTodoView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RvZG8tc2hvdy9saWIvc2hvdy10b2RvLW9wdGlvbnMtdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsc0VBQUE7SUFBQTs7c0ZBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUNDLE9BQVEsT0FBQSxDQUFRLHNCQUFSLEVBQVIsSUFERCxDQUFBOztBQUFBLEVBR007QUFDSiwrQkFBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSxRQUFDLENBQUEsT0FBRCxHQUFVLFNBQUMsSUFBRCxHQUFBO2FBQ1IsSUFBQyxDQUFBLElBQUQsQ0FBTTtBQUFBLFFBQUEsT0FBQSxFQUFPLG1CQUFQO0FBQUEsUUFBNEIsU0FBQSxFQUFXLElBQXZDO09BQU4sRUFBbUQsSUFBbkQsRUFEUTtJQUFBLENBQVYsQ0FBQTs7b0JBQUE7O0tBRHFCLEtBSHZCLENBQUE7O0FBQUEsRUFPTTtBQUNKLCtCQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLFFBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQyxJQUFELEdBQUE7YUFDUixJQUFDLENBQUEsSUFBRCxDQUFNLElBQU4sRUFEUTtJQUFBLENBQVYsQ0FBQTs7b0JBQUE7O0tBRHFCLEtBUHZCLENBQUE7O0FBQUEsRUFXTTtBQUNKLGdDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLFNBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQyxLQUFELEVBQVEsS0FBUixHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ0gsVUFBQSxLQUFDLENBQUEsSUFBRCxDQUFNLEVBQUEsR0FBRyxLQUFILEdBQVMsSUFBZixDQUFBLENBQUE7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

//# sourceURL=/Users/ah/.atom/packages/todo-show/lib/show-todo-options-view.coffee
