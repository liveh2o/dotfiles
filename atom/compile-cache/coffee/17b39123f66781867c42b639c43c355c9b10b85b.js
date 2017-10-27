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
      var Sortable, i, item, path, regex, regexes, tableItems, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _results;
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RvZG8tc2hvdy9saWIvdG9kby1vcHRpb25zLXZpZXcuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNFQUFBO0lBQUE7O3NGQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFDQyxPQUFRLE9BQUEsQ0FBUSxzQkFBUixFQUFSLElBREQsQ0FBQTs7QUFBQSxFQUdNO0FBQ0osK0JBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsUUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFDLElBQUQsR0FBQTthQUNSLElBQUMsQ0FBQSxJQUFELENBQU07QUFBQSxRQUFBLE9BQUEsRUFBTyxtQkFBUDtBQUFBLFFBQTRCLFNBQUEsRUFBVyxJQUF2QztPQUFOLEVBQW1ELElBQW5ELEVBRFE7SUFBQSxDQUFWLENBQUE7O29CQUFBOztLQURxQixLQUh2QixDQUFBOztBQUFBLEVBT007QUFDSiwrQkFBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSxRQUFDLENBQUEsT0FBRCxHQUFVLFNBQUMsSUFBRCxHQUFBO2FBQ1IsSUFBQyxDQUFBLElBQUQsQ0FBTSxJQUFOLEVBRFE7SUFBQSxDQUFWLENBQUE7O29CQUFBOztLQURxQixLQVB2QixDQUFBOztBQUFBLEVBV007QUFDSixnQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSxTQUFDLENBQUEsT0FBRCxHQUFVLFNBQUMsS0FBRCxFQUFRLEtBQVIsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUssQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUNILFVBQUEsS0FBQyxDQUFBLElBQUQsQ0FBTSxFQUFBLEdBQUcsS0FBSCxHQUFTLElBQWYsQ0FBQSxDQUFBO2lCQUNB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

//# sourceURL=/Users/ah/.atom/packages/todo-show/lib/todo-options-view.coffee
