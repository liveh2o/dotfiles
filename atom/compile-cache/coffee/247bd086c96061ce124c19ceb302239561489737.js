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

  if (parseFloat(atom.getVersion()) < 1.7) {
    atom.deserializers.add({
      name: 'TimecopView',
      deserialize: module.exports.createTimecopView.bind(module.exports)
    });
  }

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RpbWVjb3AvbGliL21haW4uY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG9CQUFBOztBQUFBLEVBQUEsV0FBQSxHQUFjLElBQWQsQ0FBQTs7QUFBQSxFQUNBLE9BQUEsR0FBVSxnQkFEVixDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsUUFBQSxFQUFVLFNBQUEsR0FBQTtBQUNSLE1BQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFmLENBQXlCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLFFBQUQsR0FBQTtBQUN2QixVQUFBLElBQW9DLFFBQUEsS0FBWSxPQUFoRDttQkFBQSxLQUFDLENBQUEsaUJBQUQsQ0FBbUI7QUFBQSxjQUFBLEdBQUEsRUFBSyxPQUFMO2FBQW5CLEVBQUE7V0FEdUI7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF6QixDQUFBLENBQUE7YUFHQSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQW9DLGNBQXBDLEVBQW9ELFNBQUEsR0FBQTtlQUNsRCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsT0FBcEIsRUFEa0Q7TUFBQSxDQUFwRCxFQUpRO0lBQUEsQ0FBVjtBQUFBLElBT0EsaUJBQUEsRUFBbUIsU0FBQyxLQUFELEdBQUE7O1FBQ2pCLGNBQWUsT0FBQSxDQUFRLGdCQUFSO09BQWY7YUFDSSxJQUFBLFdBQUEsQ0FBWSxLQUFaLEVBRmE7SUFBQSxDQVBuQjtHQUpGLENBQUE7O0FBZUEsRUFBQSxJQUFHLFVBQUEsQ0FBVyxJQUFJLENBQUMsVUFBTCxDQUFBLENBQVgsQ0FBQSxHQUFnQyxHQUFuQztBQUNFLElBQUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFuQixDQUNFO0FBQUEsTUFBQSxJQUFBLEVBQU0sYUFBTjtBQUFBLE1BQ0EsV0FBQSxFQUFhLE1BQU0sQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsSUFBakMsQ0FBc0MsTUFBTSxDQUFDLE9BQTdDLENBRGI7S0FERixDQUFBLENBREY7R0FmQTtBQUFBIgp9

//# sourceURL=/Users/ah/.atom/packages/timecop/lib/main.coffee
