(function() {
  var TimecopView, createView, viewUri;

  TimecopView = null;

  viewUri = 'atom://timecop';

  createView = function(state) {
    if (TimecopView == null) {
      TimecopView = require('./timecop-view');
    }
    return new TimecopView(state);
  };

  atom.deserializers.add({
    name: 'TimecopView',
    deserialize: function(state) {
      return createView(state);
    }
  });

  module.exports = {
    activate: function() {
      atom.project.registerOpener(function(filePath) {
        if (filePath === viewUri) {
          return createView({
            uri: viewUri
          });
        }
      });
      return atom.workspaceView.command('timecop:view', function() {
        return atom.workspaceView.open(viewUri);
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdDQUFBOztBQUFBLEVBQUEsV0FBQSxHQUFjLElBQWQsQ0FBQTs7QUFBQSxFQUVBLE9BQUEsR0FBVSxnQkFGVixDQUFBOztBQUFBLEVBR0EsVUFBQSxHQUFhLFNBQUMsS0FBRCxHQUFBOztNQUNYLGNBQWUsT0FBQSxDQUFRLGdCQUFSO0tBQWY7V0FDSSxJQUFBLFdBQUEsQ0FBWSxLQUFaLEVBRk87RUFBQSxDQUhiLENBQUE7O0FBQUEsRUFPQSxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQW5CLENBQ0U7QUFBQSxJQUFBLElBQUEsRUFBTSxhQUFOO0FBQUEsSUFDQSxXQUFBLEVBQWEsU0FBQyxLQUFELEdBQUE7YUFBVyxVQUFBLENBQVcsS0FBWCxFQUFYO0lBQUEsQ0FEYjtHQURGLENBUEEsQ0FBQTs7QUFBQSxFQVdBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLFFBQUEsRUFBVSxTQUFBLEdBQUE7QUFDUixNQUFBLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYixDQUE0QixTQUFDLFFBQUQsR0FBQTtBQUMxQixRQUFBLElBQTRCLFFBQUEsS0FBWSxPQUF4QztpQkFBQSxVQUFBLENBQVc7QUFBQSxZQUFBLEdBQUEsRUFBSyxPQUFMO1dBQVgsRUFBQTtTQUQwQjtNQUFBLENBQTVCLENBQUEsQ0FBQTthQUdBLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBbkIsQ0FBMkIsY0FBM0IsRUFBMkMsU0FBQSxHQUFBO2VBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFuQixDQUF3QixPQUF4QixFQUFIO01BQUEsQ0FBM0MsRUFKUTtJQUFBLENBQVY7R0FaRixDQUFBO0FBQUEiCn0=
//# sourceURL=/Users/ah/.atom/packages/timecop/lib/timecop.coffee