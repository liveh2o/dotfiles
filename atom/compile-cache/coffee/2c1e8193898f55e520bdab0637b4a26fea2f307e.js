(function() {
  var TimecopView, ViewURI;

  TimecopView = null;

  ViewURI = 'atom://timecop';

  module.exports = {
    activate: function() {
      atom.workspace.addOpener((function(_this) {
        return function(filePath) {
          if (filePath === ViewURI) {
            return _this.createTimecopView({
              uri: ViewURI
            });
          }
        };
      })(this));
      return atom.commands.add('atom-workspace', 'timecop:view', function() {
        return atom.workspace.open(ViewURI);
      });
    },
    createTimecopView: function(state) {
      if (TimecopView == null) {
        TimecopView = require('./timecop-view');
      }
      return new TimecopView(state);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RpbWVjb3AvbGliL21haW4uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxXQUFBLEdBQWM7O0VBQ2QsT0FBQSxHQUFVOztFQUVWLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxRQUFBLEVBQVUsU0FBQTtNQUNSLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBZixDQUF5QixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsUUFBRDtVQUN2QixJQUFvQyxRQUFBLEtBQVksT0FBaEQ7bUJBQUEsS0FBQyxDQUFBLGlCQUFELENBQW1CO2NBQUEsR0FBQSxFQUFLLE9BQUw7YUFBbkIsRUFBQTs7UUFEdUI7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXpCO2FBR0EsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUFvQyxjQUFwQyxFQUFvRCxTQUFBO2VBQ2xELElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixPQUFwQjtNQURrRCxDQUFwRDtJQUpRLENBQVY7SUFPQSxpQkFBQSxFQUFtQixTQUFDLEtBQUQ7O1FBQ2pCLGNBQWUsT0FBQSxDQUFRLGdCQUFSOzthQUNYLElBQUEsV0FBQSxDQUFZLEtBQVo7SUFGYSxDQVBuQjs7QUFKRiIsInNvdXJjZXNDb250ZW50IjpbIlRpbWVjb3BWaWV3ID0gbnVsbFxuVmlld1VSSSA9ICdhdG9tOi8vdGltZWNvcCdcblxubW9kdWxlLmV4cG9ydHMgPVxuICBhY3RpdmF0ZTogLT5cbiAgICBhdG9tLndvcmtzcGFjZS5hZGRPcGVuZXIgKGZpbGVQYXRoKSA9PlxuICAgICAgQGNyZWF0ZVRpbWVjb3BWaWV3KHVyaTogVmlld1VSSSkgaWYgZmlsZVBhdGggaXMgVmlld1VSSVxuXG4gICAgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJywgJ3RpbWVjb3A6dmlldycsIC0+XG4gICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKFZpZXdVUkkpXG5cbiAgY3JlYXRlVGltZWNvcFZpZXc6IChzdGF0ZSkgLT5cbiAgICBUaW1lY29wVmlldyA/PSByZXF1aXJlICcuL3RpbWVjb3AtdmlldydcbiAgICBuZXcgVGltZWNvcFZpZXcoc3RhdGUpXG4iXX0=
