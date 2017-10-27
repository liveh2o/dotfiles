(function() {
  var CompositeDisposable, TabNumbersView, View,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  View = require('atom-space-pen-views').View;

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = TabNumbersView = (function(superClass) {
    extend(TabNumbersView, superClass);

    function TabNumbersView() {
      this.update = bind(this.update, this);
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
      var ref;
      this.nTodos = this.collection.getTodosCount();
      this.todoCount.text(this.nTodos);
      if ((ref = this.toolTipDisposable) != null) {
        ref.dispose();
      }
      return this.toolTipDisposable = atom.tooltips.add(this.element, {
        title: this.nTodos + " TODOs"
      });
    };

    TabNumbersView.prototype.activateTodoPackage = function() {
      return atom.commands.dispatch(this, 'todo-show:toggle');
    };

    return TabNumbersView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RvZG8tc2hvdy9saWIvdG9kby1pbmRpY2F0b3Itdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLHlDQUFBO0lBQUE7Ozs7RUFBQyxPQUFRLE9BQUEsQ0FBUSxzQkFBUjs7RUFDUixzQkFBdUIsT0FBQSxDQUFRLE1BQVI7O0VBRXhCLE1BQU0sQ0FBQyxPQUFQLEdBQ007Ozs7Ozs7OzZCQUNKLE1BQUEsR0FBUTs7SUFFUixjQUFDLENBQUEsT0FBRCxHQUFVLFNBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO1FBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyx3Q0FBUDtRQUFpRCxRQUFBLEVBQVUsQ0FBQyxDQUE1RDtPQUFMLEVBQW9FLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFDbEUsS0FBQyxDQUFBLENBQUQsQ0FBRztZQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sY0FBUDtXQUFILEVBQTBCLFNBQUE7WUFDeEIsS0FBQyxDQUFBLElBQUQsQ0FBTTtjQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8scUJBQVA7YUFBTjttQkFDQSxLQUFDLENBQUEsSUFBRCxDQUFNO2NBQUEsTUFBQSxFQUFRLFdBQVI7YUFBTjtVQUZ3QixDQUExQjtRQURrRTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBcEU7SUFEUTs7NkJBTVYsVUFBQSxHQUFZLFNBQUMsVUFBRDtNQUFDLElBQUMsQ0FBQSxhQUFEO01BQ1gsSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFJO01BQ25CLElBQUMsQ0FBQSxFQUFELENBQUksT0FBSixFQUFhLElBQUksQ0FBQyxPQUFsQixFQUEyQixJQUFDLENBQUEsbUJBQTVCO01BRUEsSUFBQyxDQUFBLE1BQUQsQ0FBQTthQUNBLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQixJQUFDLENBQUEsVUFBVSxDQUFDLGlCQUFaLENBQThCLElBQUMsQ0FBQSxNQUEvQixDQUFqQjtJQUxVOzs2QkFPWixPQUFBLEdBQVMsU0FBQTtNQUNQLElBQUMsQ0FBQSxXQUFXLENBQUMsT0FBYixDQUFBO2FBQ0EsSUFBQyxDQUFBLE1BQUQsQ0FBQTtJQUZPOzs2QkFJVCxNQUFBLEdBQVEsU0FBQTtBQUNOLFVBQUE7TUFBQSxJQUFDLENBQUEsTUFBRCxHQUFVLElBQUMsQ0FBQSxVQUFVLENBQUMsYUFBWixDQUFBO01BQ1YsSUFBQyxDQUFBLFNBQVMsQ0FBQyxJQUFYLENBQWdCLElBQUMsQ0FBQSxNQUFqQjs7V0FFa0IsQ0FBRSxPQUFwQixDQUFBOzthQUNBLElBQUMsQ0FBQSxpQkFBRCxHQUFxQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsSUFBQyxDQUFBLE9BQW5CLEVBQTRCO1FBQUEsS0FBQSxFQUFVLElBQUMsQ0FBQSxNQUFGLEdBQVMsUUFBbEI7T0FBNUI7SUFMZjs7NkJBT1IsbUJBQUEsR0FBcUIsU0FBQTthQUNuQixJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsSUFBdkIsRUFBNkIsa0JBQTdCO0lBRG1COzs7O0tBM0JNO0FBSjdCIiwic291cmNlc0NvbnRlbnQiOlsie1ZpZXd9ID0gcmVxdWlyZSAnYXRvbS1zcGFjZS1wZW4tdmlld3MnXG57Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBUYWJOdW1iZXJzVmlldyBleHRlbmRzIFZpZXdcbiAgblRvZG9zOiAwXG5cbiAgQGNvbnRlbnQ6IC0+XG4gICAgQGRpdiBjbGFzczogJ3RvZG8tc3RhdHVzLWJhci1pbmRpY2F0b3IgaW5saW5lLWJsb2NrJywgdGFiaW5kZXg6IC0xLCA9PlxuICAgICAgQGEgY2xhc3M6ICdpbmxpbmUtYmxvY2snLCA9PlxuICAgICAgICBAc3BhbiBjbGFzczogJ2ljb24gaWNvbi1jaGVja2xpc3QnXG4gICAgICAgIEBzcGFuIG91dGxldDogJ3RvZG9Db3VudCdcblxuICBpbml0aWFsaXplOiAoQGNvbGxlY3Rpb24pIC0+XG4gICAgQGRpc3Bvc2FibGVzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICBAb24gJ2NsaWNrJywgdGhpcy5lbGVtZW50LCBAYWN0aXZhdGVUb2RvUGFja2FnZVxuXG4gICAgQHVwZGF0ZSgpXG4gICAgQGRpc3Bvc2FibGVzLmFkZCBAY29sbGVjdGlvbi5vbkRpZEZpbmlzaFNlYXJjaCBAdXBkYXRlXG5cbiAgZGVzdHJveTogLT5cbiAgICBAZGlzcG9zYWJsZXMuZGlzcG9zZSgpXG4gICAgQGRldGFjaCgpXG5cbiAgdXBkYXRlOiA9PlxuICAgIEBuVG9kb3MgPSBAY29sbGVjdGlvbi5nZXRUb2Rvc0NvdW50KClcbiAgICBAdG9kb0NvdW50LnRleHQoQG5Ub2RvcylcblxuICAgIEB0b29sVGlwRGlzcG9zYWJsZT8uZGlzcG9zZSgpXG4gICAgQHRvb2xUaXBEaXNwb3NhYmxlID0gYXRvbS50b29sdGlwcy5hZGQgQGVsZW1lbnQsIHRpdGxlOiBcIiN7QG5Ub2Rvc30gVE9ET3NcIlxuXG4gIGFjdGl2YXRlVG9kb1BhY2thZ2U6IC0+XG4gICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh0aGlzLCAndG9kby1zaG93OnRvZ2dsZScpXG4iXX0=
