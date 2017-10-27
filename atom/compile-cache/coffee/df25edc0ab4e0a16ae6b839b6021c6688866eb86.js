(function() {
  var EditorLinter, LinterRegistry;

  LinterRegistry = require('../lib/linter-registry');

  EditorLinter = require('../lib/editor-linter');

  module.exports = {
    getLinter: function() {
      return {
        grammarScopes: ['*'],
        lintOnFly: false,
        modifiesBuffer: false,
        scope: 'project',
        lint: function() {}
      };
    },
    getMessage: function(type, filePath) {
      return {
        type: type,
        text: "Some Message",
        filePath: filePath
      };
    },
    getLinterRegistry: function() {
      var editorLinter, linter, linterRegistry;
      linterRegistry = new LinterRegistry;
      editorLinter = new EditorLinter(atom.workspace.getActiveTextEditor());
      linter = {
        grammarScopes: ['*'],
        lintOnFly: false,
        modifiesBuffer: false,
        scope: 'project',
        lint: function() {
          return [
            {
              type: "Error",
              text: "Something"
            }
          ];
        }
      };
      linterRegistry.addLinter(linter);
      return {
        linterRegistry: linterRegistry,
        editorLinter: editorLinter,
        linter: linter
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9zcGVjL2NvbW1vbi5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsNEJBQUE7O0FBQUEsRUFBQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSx3QkFBUixDQUFqQixDQUFBOztBQUFBLEVBQ0EsWUFBQSxHQUFlLE9BQUEsQ0FBUSxzQkFBUixDQURmLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxTQUFBLEVBQVcsU0FBQSxHQUFBO0FBQ1QsYUFBTztBQUFBLFFBQUMsYUFBQSxFQUFlLENBQUMsR0FBRCxDQUFoQjtBQUFBLFFBQXVCLFNBQUEsRUFBVyxLQUFsQztBQUFBLFFBQXlDLGNBQUEsRUFBZ0IsS0FBekQ7QUFBQSxRQUFnRSxLQUFBLEVBQU8sU0FBdkU7QUFBQSxRQUFrRixJQUFBLEVBQU0sU0FBQSxHQUFBLENBQXhGO09BQVAsQ0FEUztJQUFBLENBQVg7QUFBQSxJQUVBLFVBQUEsRUFBWSxTQUFDLElBQUQsRUFBTyxRQUFQLEdBQUE7QUFDVixhQUFPO0FBQUEsUUFBQyxNQUFBLElBQUQ7QUFBQSxRQUFPLElBQUEsRUFBTSxjQUFiO0FBQUEsUUFBNkIsVUFBQSxRQUE3QjtPQUFQLENBRFU7SUFBQSxDQUZaO0FBQUEsSUFJQSxpQkFBQSxFQUFtQixTQUFBLEdBQUE7QUFDakIsVUFBQSxvQ0FBQTtBQUFBLE1BQUEsY0FBQSxHQUFpQixHQUFBLENBQUEsY0FBakIsQ0FBQTtBQUFBLE1BQ0EsWUFBQSxHQUFtQixJQUFBLFlBQUEsQ0FBYSxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBYixDQURuQixDQUFBO0FBQUEsTUFFQSxNQUFBLEdBQVM7QUFBQSxRQUNQLGFBQUEsRUFBZSxDQUFDLEdBQUQsQ0FEUjtBQUFBLFFBRVAsU0FBQSxFQUFXLEtBRko7QUFBQSxRQUdQLGNBQUEsRUFBZ0IsS0FIVDtBQUFBLFFBSVAsS0FBQSxFQUFPLFNBSkE7QUFBQSxRQUtQLElBQUEsRUFBTSxTQUFBLEdBQUE7QUFBRyxpQkFBTztZQUFDO0FBQUEsY0FBQyxJQUFBLEVBQU0sT0FBUDtBQUFBLGNBQWdCLElBQUEsRUFBTSxXQUF0QjthQUFEO1dBQVAsQ0FBSDtRQUFBLENBTEM7T0FGVCxDQUFBO0FBQUEsTUFTQSxjQUFjLENBQUMsU0FBZixDQUF5QixNQUF6QixDQVRBLENBQUE7QUFVQSxhQUFPO0FBQUEsUUFBQyxnQkFBQSxjQUFEO0FBQUEsUUFBaUIsY0FBQSxZQUFqQjtBQUFBLFFBQStCLFFBQUEsTUFBL0I7T0FBUCxDQVhpQjtJQUFBLENBSm5CO0dBSkYsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/ah/.atom/packages/linter/spec/common.coffee
