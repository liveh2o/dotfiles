(function() {
  var Grim, WrapGuideElement;

  Grim = require('grim');

  WrapGuideElement = require('./wrap-guide-element');

  module.exports = {
    activate: function() {
      this.updateConfiguration();
      return atom.workspace.observeTextEditors(function(editor) {
        var editorElement, wrapGuideElement, _ref;
        editorElement = atom.views.getView(editor);
        wrapGuideElement = new WrapGuideElement().initialize(editor, editorElement);
        return (_ref = editorElement.querySelector(".underlayer")) != null ? _ref.appendChild(wrapGuideElement) : void 0;
      });
    },
    updateConfiguration: function() {
      var column, customColumn, customColumns, newColumns, pattern, scope, _i, _len;
      customColumns = atom.config.get('wrap-guide.columns');
      if (!customColumns) {
        return;
      }
      newColumns = [];
      for (_i = 0, _len = customColumns.length; _i < _len; _i++) {
        customColumn = customColumns[_i];
        if (!(typeof customColumn === 'object')) {
          continue;
        }
        pattern = customColumn.pattern, scope = customColumn.scope, column = customColumn.column;
        if (pattern) {
          Grim.deprecate("The Wrap Guide package uses Atom's new language-specific configuration.\nUse of file name matching patterns for Wrap Guide configuration is deprecated.\nSee the README for details: https://github.com/atom/wrap-guide.");
          newColumns.push(customColumn);
        } else if (scope) {
          if (column === -1) {
            atom.config.set("." + scope, 'wrap-guide.enabled', false);
          } else {
            atom.config.set("." + scope, 'editor.preferredLineLength', column);
          }
        }
      }
      if (newColumns.length === 0) {
        newColumns = void 0;
      }
      return atom.config.set('wrap-guide.columns', newColumns);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNCQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUVBLGdCQUFBLEdBQW1CLE9BQUEsQ0FBUSxzQkFBUixDQUZuQixDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsUUFBQSxFQUFVLFNBQUEsR0FBQTtBQUNSLE1BQUEsSUFBQyxDQUFBLG1CQUFELENBQUEsQ0FBQSxDQUFBO2FBRUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBZixDQUFrQyxTQUFDLE1BQUQsR0FBQTtBQUNoQyxZQUFBLHFDQUFBO0FBQUEsUUFBQSxhQUFBLEdBQWdCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixNQUFuQixDQUFoQixDQUFBO0FBQUEsUUFDQSxnQkFBQSxHQUF1QixJQUFBLGdCQUFBLENBQUEsQ0FBa0IsQ0FBQyxVQUFuQixDQUE4QixNQUE5QixFQUFzQyxhQUF0QyxDQUR2QixDQUFBO2lGQUUwQyxDQUFFLFdBQTVDLENBQXdELGdCQUF4RCxXQUhnQztNQUFBLENBQWxDLEVBSFE7SUFBQSxDQUFWO0FBQUEsSUFRQSxtQkFBQSxFQUFxQixTQUFBLEdBQUE7QUFDbkIsVUFBQSx5RUFBQTtBQUFBLE1BQUEsYUFBQSxHQUFnQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isb0JBQWhCLENBQWhCLENBQUE7QUFDQSxNQUFBLElBQUEsQ0FBQSxhQUFBO0FBQUEsY0FBQSxDQUFBO09BREE7QUFBQSxNQUdBLFVBQUEsR0FBYSxFQUhiLENBQUE7QUFJQSxXQUFBLG9EQUFBO3lDQUFBO2NBQXVDLE1BQUEsQ0FBQSxZQUFBLEtBQXVCOztTQUM1RDtBQUFBLFFBQUMsdUJBQUEsT0FBRCxFQUFVLHFCQUFBLEtBQVYsRUFBaUIsc0JBQUEsTUFBakIsQ0FBQTtBQUNBLFFBQUEsSUFBRyxPQUFIO0FBQ0UsVUFBQSxJQUFJLENBQUMsU0FBTCxDQUFlLDBOQUFmLENBQUEsQ0FBQTtBQUFBLFVBS0EsVUFBVSxDQUFDLElBQVgsQ0FBZ0IsWUFBaEIsQ0FMQSxDQURGO1NBQUEsTUFPSyxJQUFHLEtBQUg7QUFDSCxVQUFBLElBQUcsTUFBQSxLQUFVLENBQUEsQ0FBYjtBQUNFLFlBQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWlCLEdBQUEsR0FBRSxLQUFuQixFQUE2QixvQkFBN0IsRUFBbUQsS0FBbkQsQ0FBQSxDQURGO1dBQUEsTUFBQTtBQUdFLFlBQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWlCLEdBQUEsR0FBRSxLQUFuQixFQUE2Qiw0QkFBN0IsRUFBMkQsTUFBM0QsQ0FBQSxDQUhGO1dBREc7U0FUUDtBQUFBLE9BSkE7QUFtQkEsTUFBQSxJQUEwQixVQUFVLENBQUMsTUFBWCxLQUFxQixDQUEvQztBQUFBLFFBQUEsVUFBQSxHQUFhLE1BQWIsQ0FBQTtPQW5CQTthQW9CQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isb0JBQWhCLEVBQXNDLFVBQXRDLEVBckJtQjtJQUFBLENBUnJCO0dBTEYsQ0FBQTtBQUFBIgp9
//# sourceURL=/Users/ah/.atom/packages/wrap-guide/lib/main.coffee