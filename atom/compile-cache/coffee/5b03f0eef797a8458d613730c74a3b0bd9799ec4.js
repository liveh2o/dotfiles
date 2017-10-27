(function() {
  var EditorLinter, LinterRegistry, Validators;

  LinterRegistry = require('../lib/linter-registry');

  EditorLinter = require('../lib/editor-linter');

  Validators = require('../lib/validate');

  module.exports = {
    wait: function(timeout) {
      return new Promise(function(resolve) {
        return setTimeout(resolve, timeout);
      });
    },
    getLinter: function() {
      return {
        grammarScopes: ['*'],
        lintOnFly: false,
        scope: 'project',
        lint: function() {}
      };
    },
    getMessage: function(type, filePath, range) {
      var message;
      message = {
        type: type,
        text: 'Some Message',
        filePath: filePath,
        range: range
      };
      Validators.messages([message], {
        name: 'Some Linter'
      });
      return message;
    },
    getLinterRegistry: function() {
      var editorLinter, linter, linterRegistry;
      linterRegistry = new LinterRegistry;
      editorLinter = new EditorLinter(atom.workspace.getActiveTextEditor());
      linter = {
        grammarScopes: ['*'],
        lintOnFly: false,
        scope: 'project',
        lint: function() {
          return [
            {
              type: 'Error',
              text: 'Something'
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
    },
    trigger: function(el, name) {
      var event;
      event = document.createEvent('HTMLEvents');
      event.initEvent(name, true, false);
      return el.dispatchEvent(event);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9zcGVjL2NvbW1vbi5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsd0NBQUE7O0FBQUEsRUFBQSxjQUFBLEdBQWlCLE9BQUEsQ0FBUSx3QkFBUixDQUFqQixDQUFBOztBQUFBLEVBQ0EsWUFBQSxHQUFlLE9BQUEsQ0FBUSxzQkFBUixDQURmLENBQUE7O0FBQUEsRUFFQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGlCQUFSLENBRmIsQ0FBQTs7QUFBQSxFQUlBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLElBQUEsRUFBTSxTQUFDLE9BQUQsR0FBQTtBQUNKLGFBQVcsSUFBQSxPQUFBLENBQVEsU0FBQyxPQUFELEdBQUE7ZUFDakIsVUFBQSxDQUFXLE9BQVgsRUFBb0IsT0FBcEIsRUFEaUI7TUFBQSxDQUFSLENBQVgsQ0FESTtJQUFBLENBQU47QUFBQSxJQUdBLFNBQUEsRUFBVyxTQUFBLEdBQUE7QUFDVCxhQUFPO0FBQUEsUUFBQyxhQUFBLEVBQWUsQ0FBQyxHQUFELENBQWhCO0FBQUEsUUFBdUIsU0FBQSxFQUFXLEtBQWxDO0FBQUEsUUFBeUMsS0FBQSxFQUFPLFNBQWhEO0FBQUEsUUFBMkQsSUFBQSxFQUFNLFNBQUEsR0FBQSxDQUFqRTtPQUFQLENBRFM7SUFBQSxDQUhYO0FBQUEsSUFLQSxVQUFBLEVBQVksU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixLQUFqQixHQUFBO0FBQ1YsVUFBQSxPQUFBO0FBQUEsTUFBQSxPQUFBLEdBQVU7QUFBQSxRQUFDLE1BQUEsSUFBRDtBQUFBLFFBQU8sSUFBQSxFQUFNLGNBQWI7QUFBQSxRQUE2QixVQUFBLFFBQTdCO0FBQUEsUUFBdUMsT0FBQSxLQUF2QztPQUFWLENBQUE7QUFBQSxNQUNBLFVBQVUsQ0FBQyxRQUFYLENBQW9CLENBQUMsT0FBRCxDQUFwQixFQUErQjtBQUFBLFFBQUMsSUFBQSxFQUFNLGFBQVA7T0FBL0IsQ0FEQSxDQUFBO0FBRUEsYUFBTyxPQUFQLENBSFU7SUFBQSxDQUxaO0FBQUEsSUFTQSxpQkFBQSxFQUFtQixTQUFBLEdBQUE7QUFDakIsVUFBQSxvQ0FBQTtBQUFBLE1BQUEsY0FBQSxHQUFpQixHQUFBLENBQUEsY0FBakIsQ0FBQTtBQUFBLE1BQ0EsWUFBQSxHQUFtQixJQUFBLFlBQUEsQ0FBYSxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBYixDQURuQixDQUFBO0FBQUEsTUFFQSxNQUFBLEdBQVM7QUFBQSxRQUNQLGFBQUEsRUFBZSxDQUFDLEdBQUQsQ0FEUjtBQUFBLFFBRVAsU0FBQSxFQUFXLEtBRko7QUFBQSxRQUdQLEtBQUEsRUFBTyxTQUhBO0FBQUEsUUFJUCxJQUFBLEVBQU0sU0FBQSxHQUFBO0FBQUcsaUJBQU87WUFBQztBQUFBLGNBQUMsSUFBQSxFQUFNLE9BQVA7QUFBQSxjQUFnQixJQUFBLEVBQU0sV0FBdEI7YUFBRDtXQUFQLENBQUg7UUFBQSxDQUpDO09BRlQsQ0FBQTtBQUFBLE1BUUEsY0FBYyxDQUFDLFNBQWYsQ0FBeUIsTUFBekIsQ0FSQSxDQUFBO0FBU0EsYUFBTztBQUFBLFFBQUMsZ0JBQUEsY0FBRDtBQUFBLFFBQWlCLGNBQUEsWUFBakI7QUFBQSxRQUErQixRQUFBLE1BQS9CO09BQVAsQ0FWaUI7SUFBQSxDQVRuQjtBQUFBLElBb0JBLE9BQUEsRUFBUyxTQUFDLEVBQUQsRUFBSyxJQUFMLEdBQUE7QUFDUCxVQUFBLEtBQUE7QUFBQSxNQUFBLEtBQUEsR0FBUSxRQUFRLENBQUMsV0FBVCxDQUFxQixZQUFyQixDQUFSLENBQUE7QUFBQSxNQUNBLEtBQUssQ0FBQyxTQUFOLENBQWdCLElBQWhCLEVBQXNCLElBQXRCLEVBQTRCLEtBQTVCLENBREEsQ0FBQTthQUVBLEVBQUUsQ0FBQyxhQUFILENBQWlCLEtBQWpCLEVBSE87SUFBQSxDQXBCVDtHQUxGLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/ah/.atom/packages/linter/spec/common.coffee
