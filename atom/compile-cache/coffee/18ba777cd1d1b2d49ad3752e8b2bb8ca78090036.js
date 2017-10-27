(function() {
  var Grim, WrapGuideElement;

  Grim = require('grim');

  WrapGuideElement = require('./wrap-guide-element');

  module.exports = {
    activate: function() {
      this.updateConfiguration();
      return atom.workspace.observeTextEditors(function(editor) {
        var editorElement, wrapGuideElement;
        editorElement = atom.views.getView(editor);
        return wrapGuideElement = new WrapGuideElement(editor, editorElement);
      });
    },
    updateConfiguration: function() {
      var column, customColumn, customColumns, i, len, newColumns, pattern, scope;
      customColumns = atom.config.get('wrap-guide.columns');
      if (!customColumns) {
        return;
      }
      newColumns = [];
      for (i = 0, len = customColumns.length; i < len; i++) {
        customColumn = customColumns[i];
        if (!(typeof customColumn === 'object')) {
          continue;
        }
        pattern = customColumn.pattern, scope = customColumn.scope, column = customColumn.column;
        if (Grim.includeDeprecatedAPIs && pattern) {
          Grim.deprecate("The Wrap Guide package uses Atom's new language-specific configuration.\nUse of file name matching patterns for Wrap Guide configuration is deprecated.\nSee the README for details: https://github.com/atom/wrap-guide.");
          newColumns.push(customColumn);
        } else if (scope) {
          if (column === -1) {
            atom.config.set('wrap-guide.enabled', false, {
              scopeSelector: "." + scope
            });
          } else {
            atom.config.set('editor.preferredLineLength', column, {
              scopeSelector: "." + scope
            });
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3dyYXAtZ3VpZGUvbGliL21haW4uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBRVAsZ0JBQUEsR0FBbUIsT0FBQSxDQUFRLHNCQUFSOztFQUVuQixNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsUUFBQSxFQUFVLFNBQUE7TUFDUixJQUFDLENBQUEsbUJBQUQsQ0FBQTthQUVBLElBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWYsQ0FBa0MsU0FBQyxNQUFEO0FBQ2hDLFlBQUE7UUFBQSxhQUFBLEdBQWdCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixNQUFuQjtlQUNoQixnQkFBQSxHQUF1QixJQUFBLGdCQUFBLENBQWlCLE1BQWpCLEVBQXlCLGFBQXpCO01BRlMsQ0FBbEM7SUFIUSxDQUFWO0lBT0EsbUJBQUEsRUFBcUIsU0FBQTtBQUNuQixVQUFBO01BQUEsYUFBQSxHQUFnQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isb0JBQWhCO01BQ2hCLElBQUEsQ0FBYyxhQUFkO0FBQUEsZUFBQTs7TUFFQSxVQUFBLEdBQWE7QUFDYixXQUFBLCtDQUFBOztjQUF1QyxPQUFPLFlBQVAsS0FBdUI7OztRQUMzRCw4QkFBRCxFQUFVLDBCQUFWLEVBQWlCO1FBQ2pCLElBQUcsSUFBSSxDQUFDLHFCQUFMLElBQStCLE9BQWxDO1VBQ0UsSUFBSSxDQUFDLFNBQUwsQ0FBZSwwTkFBZjtVQUtBLFVBQVUsQ0FBQyxJQUFYLENBQWdCLFlBQWhCLEVBTkY7U0FBQSxNQU9LLElBQUcsS0FBSDtVQUNILElBQUcsTUFBQSxLQUFVLENBQUMsQ0FBZDtZQUNFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixvQkFBaEIsRUFBc0MsS0FBdEMsRUFBNkM7Y0FBQSxhQUFBLEVBQWUsR0FBQSxHQUFJLEtBQW5CO2FBQTdDLEVBREY7V0FBQSxNQUFBO1lBR0UsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDRCQUFoQixFQUE4QyxNQUE5QyxFQUFzRDtjQUFBLGFBQUEsRUFBZSxHQUFBLEdBQUksS0FBbkI7YUFBdEQsRUFIRjtXQURHOztBQVRQO01BZUEsSUFBMEIsVUFBVSxDQUFDLE1BQVgsS0FBcUIsQ0FBL0M7UUFBQSxVQUFBLEdBQWEsT0FBYjs7YUFDQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isb0JBQWhCLEVBQXNDLFVBQXRDO0lBckJtQixDQVByQjs7QUFMRiIsInNvdXJjZXNDb250ZW50IjpbIkdyaW0gPSByZXF1aXJlICdncmltJ1xuXG5XcmFwR3VpZGVFbGVtZW50ID0gcmVxdWlyZSAnLi93cmFwLWd1aWRlLWVsZW1lbnQnXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgYWN0aXZhdGU6IC0+XG4gICAgQHVwZGF0ZUNvbmZpZ3VyYXRpb24oKVxuXG4gICAgYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzIChlZGl0b3IpIC0+XG4gICAgICBlZGl0b3JFbGVtZW50ID0gYXRvbS52aWV3cy5nZXRWaWV3KGVkaXRvcilcbiAgICAgIHdyYXBHdWlkZUVsZW1lbnQgPSBuZXcgV3JhcEd1aWRlRWxlbWVudChlZGl0b3IsIGVkaXRvckVsZW1lbnQpXG5cbiAgdXBkYXRlQ29uZmlndXJhdGlvbjogLT5cbiAgICBjdXN0b21Db2x1bW5zID0gYXRvbS5jb25maWcuZ2V0KCd3cmFwLWd1aWRlLmNvbHVtbnMnKVxuICAgIHJldHVybiB1bmxlc3MgY3VzdG9tQ29sdW1uc1xuXG4gICAgbmV3Q29sdW1ucyA9IFtdXG4gICAgZm9yIGN1c3RvbUNvbHVtbiBpbiBjdXN0b21Db2x1bW5zIHdoZW4gdHlwZW9mIGN1c3RvbUNvbHVtbiBpcyAnb2JqZWN0J1xuICAgICAge3BhdHRlcm4sIHNjb3BlLCBjb2x1bW59ID0gY3VzdG9tQ29sdW1uXG4gICAgICBpZiBHcmltLmluY2x1ZGVEZXByZWNhdGVkQVBJcyBhbmQgcGF0dGVyblxuICAgICAgICBHcmltLmRlcHJlY2F0ZSBcIlwiXCJcbiAgICAgICAgICBUaGUgV3JhcCBHdWlkZSBwYWNrYWdlIHVzZXMgQXRvbSdzIG5ldyBsYW5ndWFnZS1zcGVjaWZpYyBjb25maWd1cmF0aW9uLlxuICAgICAgICAgIFVzZSBvZiBmaWxlIG5hbWUgbWF0Y2hpbmcgcGF0dGVybnMgZm9yIFdyYXAgR3VpZGUgY29uZmlndXJhdGlvbiBpcyBkZXByZWNhdGVkLlxuICAgICAgICAgIFNlZSB0aGUgUkVBRE1FIGZvciBkZXRhaWxzOiBodHRwczovL2dpdGh1Yi5jb20vYXRvbS93cmFwLWd1aWRlLlxuICAgICAgICBcIlwiXCJcbiAgICAgICAgbmV3Q29sdW1ucy5wdXNoKGN1c3RvbUNvbHVtbilcbiAgICAgIGVsc2UgaWYgc2NvcGVcbiAgICAgICAgaWYgY29sdW1uIGlzIC0xXG4gICAgICAgICAgYXRvbS5jb25maWcuc2V0KCd3cmFwLWd1aWRlLmVuYWJsZWQnLCBmYWxzZSwgc2NvcGVTZWxlY3RvcjogXCIuI3tzY29wZX1cIilcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGF0b20uY29uZmlnLnNldCgnZWRpdG9yLnByZWZlcnJlZExpbmVMZW5ndGgnLCBjb2x1bW4sIHNjb3BlU2VsZWN0b3I6IFwiLiN7c2NvcGV9XCIpXG5cbiAgICBuZXdDb2x1bW5zID0gdW5kZWZpbmVkIGlmIG5ld0NvbHVtbnMubGVuZ3RoIGlzIDBcbiAgICBhdG9tLmNvbmZpZy5zZXQoJ3dyYXAtZ3VpZGUuY29sdW1ucycsIG5ld0NvbHVtbnMpXG4iXX0=
