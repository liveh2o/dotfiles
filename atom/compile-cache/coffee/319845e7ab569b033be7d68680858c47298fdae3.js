(function() {
  var CompositeDisposable, TabNumbersView, View,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom-space-pen-views').View;

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = TabNumbersView = (function(_super) {
    __extends(TabNumbersView, _super);

    function TabNumbersView() {
      this.update = __bind(this.update, this);
      return TabNumbersView.__super__.constructor.apply(this, arguments);
    }

    TabNumbersView.prototype.nTodos = 0;

    TabNumbersView.content = function() {
      return this.div({
        "class": 'todo-status-bar-indicator inline-block',
        tabindex: -1
      }, (function(_this) {
        return function() {
          return _this.a({
            "class": 'inline-block'
          }, function() {
            _this.span({
              "class": 'icon icon-checklist'
            });
            return _this.span({
              outlet: 'todoCount'
            });
          });
        };
      })(this));
    };

    TabNumbersView.prototype.initialize = function(collection) {
      this.collection = collection;
      this.disposables = new CompositeDisposable;
      this.on('click', this.element, this.activateTodoPackage);
      this.update();
      return this.disposables.add(this.collection.onDidFinishSearch(this.update));
    };

    TabNumbersView.prototype.destroy = function() {
      this.disposables.dispose();
      return this.detach();
    };

    TabNumbersView.prototype.update = function() {
      var _ref;
      this.nTodos = this.collection.getTodosCount();
      this.todoCount.text(this.nTodos);
      if ((_ref = this.toolTipDisposable) != null) {
        _ref.dispose();
      }
      return this.toolTipDisposable = atom.tooltips.add(this.element, {
        title: "" + this.nTodos + " TODOs"
      });
    };

    TabNumbersView.prototype.activateTodoPackage = function() {
      return atom.commands.dispatch(this, 'todo-show:find-in-workspace');
    };

    return TabNumbersView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RvZG8tc2hvdy9saWIvdG9kby1pbmRpY2F0b3Itdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEseUNBQUE7SUFBQTs7bVNBQUE7O0FBQUEsRUFBQyxPQUFRLE9BQUEsQ0FBUSxzQkFBUixFQUFSLElBQUQsQ0FBQTs7QUFBQSxFQUNDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFERCxDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLHFDQUFBLENBQUE7Ozs7O0tBQUE7O0FBQUEsNkJBQUEsTUFBQSxHQUFRLENBQVIsQ0FBQTs7QUFBQSxJQUVBLGNBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLHdDQUFQO0FBQUEsUUFBaUQsUUFBQSxFQUFVLENBQUEsQ0FBM0Q7T0FBTCxFQUFvRSxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUNsRSxLQUFDLENBQUEsQ0FBRCxDQUFHO0FBQUEsWUFBQSxPQUFBLEVBQU8sY0FBUDtXQUFILEVBQTBCLFNBQUEsR0FBQTtBQUN4QixZQUFBLEtBQUMsQ0FBQSxJQUFELENBQU07QUFBQSxjQUFBLE9BQUEsRUFBTyxxQkFBUDthQUFOLENBQUEsQ0FBQTttQkFDQSxLQUFDLENBQUEsSUFBRCxDQUFNO0FBQUEsY0FBQSxNQUFBLEVBQVEsV0FBUjthQUFOLEVBRndCO1VBQUEsQ0FBMUIsRUFEa0U7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFwRSxFQURRO0lBQUEsQ0FGVixDQUFBOztBQUFBLDZCQVFBLFVBQUEsR0FBWSxTQUFFLFVBQUYsR0FBQTtBQUNWLE1BRFcsSUFBQyxDQUFBLGFBQUEsVUFDWixDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsV0FBRCxHQUFlLEdBQUEsQ0FBQSxtQkFBZixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsRUFBRCxDQUFJLE9BQUosRUFBYSxJQUFJLENBQUMsT0FBbEIsRUFBMkIsSUFBQyxDQUFBLG1CQUE1QixDQURBLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxNQUFELENBQUEsQ0FIQSxDQUFBO2FBSUEsSUFBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCLElBQUMsQ0FBQSxVQUFVLENBQUMsaUJBQVosQ0FBOEIsSUFBQyxDQUFBLE1BQS9CLENBQWpCLEVBTFU7SUFBQSxDQVJaLENBQUE7O0FBQUEsNkJBZUEsT0FBQSxHQUFTLFNBQUEsR0FBQTtBQUNQLE1BQUEsSUFBQyxDQUFBLFdBQVcsQ0FBQyxPQUFiLENBQUEsQ0FBQSxDQUFBO2FBQ0EsSUFBQyxDQUFBLE1BQUQsQ0FBQSxFQUZPO0lBQUEsQ0FmVCxDQUFBOztBQUFBLDZCQW1CQSxNQUFBLEdBQVEsU0FBQSxHQUFBO0FBQ04sVUFBQSxJQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsTUFBRCxHQUFVLElBQUMsQ0FBQSxVQUFVLENBQUMsYUFBWixDQUFBLENBQVYsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFNBQVMsQ0FBQyxJQUFYLENBQWdCLElBQUMsQ0FBQSxNQUFqQixDQURBLENBQUE7O1lBR2tCLENBQUUsT0FBcEIsQ0FBQTtPQUhBO2FBSUEsSUFBQyxDQUFBLGlCQUFELEdBQXFCLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixJQUFDLENBQUEsT0FBbkIsRUFBNEI7QUFBQSxRQUFBLEtBQUEsRUFBTyxFQUFBLEdBQUcsSUFBQyxDQUFBLE1BQUosR0FBVyxRQUFsQjtPQUE1QixFQUxmO0lBQUEsQ0FuQlIsQ0FBQTs7QUFBQSw2QkEwQkEsbUJBQUEsR0FBcUIsU0FBQSxHQUFBO2FBQ25CLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixJQUF2QixFQUE2Qiw2QkFBN0IsRUFEbUI7SUFBQSxDQTFCckIsQ0FBQTs7MEJBQUE7O0tBRDJCLEtBSjdCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/ah/.atom/packages/todo-show/lib/todo-indicator-view.coffee
