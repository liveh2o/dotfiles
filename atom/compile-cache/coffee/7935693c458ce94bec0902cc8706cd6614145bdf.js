(function() {
  describe("sorting lines", function() {
    var activationPromise, editor, editorView, sortLineCaseInsensitive, sortLines, sortLinesReversed, uniqueLines, _ref;
    _ref = [], activationPromise = _ref[0], editor = _ref[1], editorView = _ref[2];
    sortLines = function(callback) {
      atom.commands.dispatch(editorView, "sort-lines:sort");
      waitsForPromise(function() {
        return activationPromise;
      });
      return runs(callback);
    };
    sortLinesReversed = function(callback) {
      atom.commands.dispatch(editorView, "sort-lines:reverse-sort");
      waitsForPromise(function() {
        return activationPromise;
      });
      return runs(callback);
    };
    uniqueLines = function(callback) {
      atom.commands.dispatch(editorView, "sort-lines:unique");
      waitsForPromise(function() {
        return activationPromise;
      });
      return runs(callback);
    };
    sortLineCaseInsensitive = function(callback) {
      atom.commands.dispatch(editorView, "sort-lines:case-insensitive-sort");
      waitsForPromise(function() {
        return activationPromise;
      });
      return runs(callback);
    };
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.workspace.open();
      });
      return runs(function() {
        editor = atom.workspace.getActiveTextEditor();
        editorView = atom.views.getView(editor);
        return activationPromise = atom.packages.activatePackage('sort-lines');
      });
    });
    describe("when no lines are selected", function() {
      it("sorts all lines", function() {
        editor.setText("Hydrogen\nHelium\nLithium");
        editor.setCursorBufferPosition([0, 0]);
        return sortLines(function() {
          return expect(editor.getText()).toBe("Helium\nHydrogen\nLithium");
        });
      });
      return it("sorts all lines, ignoring the trailing new line", function() {
        editor.setText("Hydrogen\nHelium\nLithium\n");
        editor.setCursorBufferPosition([0, 0]);
        return sortLines(function() {
          return expect(editor.getText()).toBe("Helium\nHydrogen\nLithium\n");
        });
      });
    });
    describe("when entire lines are selected", function() {
      return it("sorts the selected lines", function() {
        editor.setText("Hydrogen\nHelium\nLithium\nBeryllium\nBoron");
        editor.setSelectedBufferRange([[1, 0], [4, 0]]);
        return sortLines(function() {
          return expect(editor.getText()).toBe("Hydrogen\nBeryllium\nHelium\nLithium\nBoron");
        });
      });
    });
    describe("when partial lines are selected", function() {
      return it("sorts the selected lines", function() {
        editor.setText("Hydrogen\nHelium\nLithium\nBeryllium\nBoron");
        editor.setSelectedBufferRange([[1, 3], [3, 2]]);
        return sortLines(function() {
          return expect(editor.getText()).toBe("Hydrogen\nBeryllium\nHelium\nLithium\nBoron");
        });
      });
    });
    describe("when there are multiple selection ranges", function() {
      return it("sorts the lines in each selection range", function() {
        editor.setText("Hydrogen\nHelium    # selection 1\nBeryllium # selection 1\nCarbon\nFluorine  # selection 2\nAluminum  # selection 2\nGallium\nEuropium");
        editor.addSelectionForBufferRange([[1, 0], [3, 0]]);
        editor.addSelectionForBufferRange([[4, 0], [6, 0]]);
        return sortLines(function() {
          return expect(editor.getText()).toBe("Hydrogen\nBeryllium # selection 1\nHelium    # selection 1\nCarbon\nAluminum  # selection 2\nFluorine  # selection 2\nGallium\nEuropium");
        });
      });
    });
    describe("reversed sorting", function() {
      return it("sorts all lines in reverse order", function() {
        editor.setText("Hydrogen\nHelium\nLithium");
        editor.setCursorBufferPosition([0, 0]);
        return sortLinesReversed(function() {
          return expect(editor.getText()).toBe("Lithium\nHydrogen\nHelium");
        });
      });
    });
    describe("uniqueing", function() {
      return it("uniques all lines but does not change order", function() {
        editor.setText("Hydrogen\nHydrogen\nHelium\nLithium\nHydrogen\nHydrogen\nHelium\nLithium\nHydrogen\nHydrogen\nHelium\nLithium\nHydrogen\nHydrogen\nHelium\nLithium");
        editor.setCursorBufferPosition([0, 0]);
        return uniqueLines(function() {
          return expect(editor.getText()).toBe("Hydrogen\nHelium\nLithium");
        });
      });
    });
    return describe("case-insensitive sorting", function() {
      return it("sorts all lines, ignoring case", function() {
        editor.setText("Hydrogen\nlithium\nhelium\nHelium\nLithium");
        editor.setCursorBufferPosition([0, 0]);
        return sortLineCaseInsensitive(function() {
          return expect(editor.getText()).toBe("helium\nHelium\nHydrogen\nlithium\nLithium");
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3NvcnQtbGluZXMvc3BlYy9zb3J0LWxpbmVzLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQ0E7QUFBQSxFQUFBLFFBQUEsQ0FBUyxlQUFULEVBQTBCLFNBQUEsR0FBQTtBQUN4QixRQUFBLCtHQUFBO0FBQUEsSUFBQSxPQUEwQyxFQUExQyxFQUFDLDJCQUFELEVBQW9CLGdCQUFwQixFQUE0QixvQkFBNUIsQ0FBQTtBQUFBLElBRUEsU0FBQSxHQUFZLFNBQUMsUUFBRCxHQUFBO0FBQ1YsTUFBQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsVUFBdkIsRUFBbUMsaUJBQW5DLENBQUEsQ0FBQTtBQUFBLE1BQ0EsZUFBQSxDQUFnQixTQUFBLEdBQUE7ZUFBRyxrQkFBSDtNQUFBLENBQWhCLENBREEsQ0FBQTthQUVBLElBQUEsQ0FBSyxRQUFMLEVBSFU7SUFBQSxDQUZaLENBQUE7QUFBQSxJQU9BLGlCQUFBLEdBQW9CLFNBQUMsUUFBRCxHQUFBO0FBQ2xCLE1BQUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLFVBQXZCLEVBQW1DLHlCQUFuQyxDQUFBLENBQUE7QUFBQSxNQUNBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQUcsa0JBQUg7TUFBQSxDQUFoQixDQURBLENBQUE7YUFFQSxJQUFBLENBQUssUUFBTCxFQUhrQjtJQUFBLENBUHBCLENBQUE7QUFBQSxJQVlBLFdBQUEsR0FBYyxTQUFDLFFBQUQsR0FBQTtBQUNaLE1BQUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLFVBQXZCLEVBQW1DLG1CQUFuQyxDQUFBLENBQUE7QUFBQSxNQUNBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQUcsa0JBQUg7TUFBQSxDQUFoQixDQURBLENBQUE7YUFFQSxJQUFBLENBQUssUUFBTCxFQUhZO0lBQUEsQ0FaZCxDQUFBO0FBQUEsSUFpQkEsdUJBQUEsR0FBMEIsU0FBQyxRQUFELEdBQUE7QUFDeEIsTUFBQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsVUFBdkIsRUFBbUMsa0NBQW5DLENBQUEsQ0FBQTtBQUFBLE1BQ0EsZUFBQSxDQUFnQixTQUFBLEdBQUE7ZUFBRyxrQkFBSDtNQUFBLENBQWhCLENBREEsQ0FBQTthQUVBLElBQUEsQ0FBSyxRQUFMLEVBSHdCO0lBQUEsQ0FqQjFCLENBQUE7QUFBQSxJQXNCQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsTUFBQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUNkLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFBLEVBRGM7TUFBQSxDQUFoQixDQUFBLENBQUE7YUFHQSxJQUFBLENBQUssU0FBQSxHQUFBO0FBQ0gsUUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBQVQsQ0FBQTtBQUFBLFFBQ0EsVUFBQSxHQUFhLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixNQUFuQixDQURiLENBQUE7ZUFHQSxpQkFBQSxHQUFvQixJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsWUFBOUIsRUFKakI7TUFBQSxDQUFMLEVBSlM7SUFBQSxDQUFYLENBdEJBLENBQUE7QUFBQSxJQWdDQSxRQUFBLENBQVMsNEJBQVQsRUFBdUMsU0FBQSxHQUFBO0FBQ3JDLE1BQUEsRUFBQSxDQUFHLGlCQUFILEVBQXNCLFNBQUEsR0FBQTtBQUNwQixRQUFBLE1BQU0sQ0FBQyxPQUFQLENBQWUsMkJBQWYsQ0FBQSxDQUFBO0FBQUEsUUFLQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQixDQUxBLENBQUE7ZUFPQSxTQUFBLENBQVUsU0FBQSxHQUFBO2lCQUNSLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QiwyQkFBOUIsRUFEUTtRQUFBLENBQVYsRUFSb0I7TUFBQSxDQUF0QixDQUFBLENBQUE7YUFlQSxFQUFBLENBQUcsaURBQUgsRUFBc0QsU0FBQSxHQUFBO0FBQ3BELFFBQUEsTUFBTSxDQUFDLE9BQVAsQ0FBZSw2QkFBZixDQUFBLENBQUE7QUFBQSxRQU1BLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CLENBTkEsQ0FBQTtlQVFBLFNBQUEsQ0FBVSxTQUFBLEdBQUE7aUJBQ1IsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLDZCQUE5QixFQURRO1FBQUEsQ0FBVixFQVRvRDtNQUFBLENBQXRELEVBaEJxQztJQUFBLENBQXZDLENBaENBLENBQUE7QUFBQSxJQWlFQSxRQUFBLENBQVMsZ0NBQVQsRUFBMkMsU0FBQSxHQUFBO2FBQ3pDLEVBQUEsQ0FBRywwQkFBSCxFQUErQixTQUFBLEdBQUE7QUFDN0IsUUFBQSxNQUFNLENBQUMsT0FBUCxDQUFlLDZDQUFmLENBQUEsQ0FBQTtBQUFBLFFBT0EsTUFBTSxDQUFDLHNCQUFQLENBQThCLENBQUMsQ0FBQyxDQUFELEVBQUcsQ0FBSCxDQUFELEVBQVEsQ0FBQyxDQUFELEVBQUcsQ0FBSCxDQUFSLENBQTlCLENBUEEsQ0FBQTtlQVNBLFNBQUEsQ0FBVSxTQUFBLEdBQUE7aUJBQ1IsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLDZDQUE5QixFQURRO1FBQUEsQ0FBVixFQVY2QjtNQUFBLENBQS9CLEVBRHlDO0lBQUEsQ0FBM0MsQ0FqRUEsQ0FBQTtBQUFBLElBcUZBLFFBQUEsQ0FBUyxpQ0FBVCxFQUE0QyxTQUFBLEdBQUE7YUFDMUMsRUFBQSxDQUFHLDBCQUFILEVBQStCLFNBQUEsR0FBQTtBQUM3QixRQUFBLE1BQU0sQ0FBQyxPQUFQLENBQWUsNkNBQWYsQ0FBQSxDQUFBO0FBQUEsUUFPQSxNQUFNLENBQUMsc0JBQVAsQ0FBOEIsQ0FBQyxDQUFDLENBQUQsRUFBRyxDQUFILENBQUQsRUFBUSxDQUFDLENBQUQsRUFBRyxDQUFILENBQVIsQ0FBOUIsQ0FQQSxDQUFBO2VBU0EsU0FBQSxDQUFVLFNBQUEsR0FBQTtpQkFDUixNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsNkNBQTlCLEVBRFE7UUFBQSxDQUFWLEVBVjZCO01BQUEsQ0FBL0IsRUFEMEM7SUFBQSxDQUE1QyxDQXJGQSxDQUFBO0FBQUEsSUF5R0EsUUFBQSxDQUFTLDBDQUFULEVBQXFELFNBQUEsR0FBQTthQUNuRCxFQUFBLENBQUcseUNBQUgsRUFBOEMsU0FBQSxHQUFBO0FBQzVDLFFBQUEsTUFBTSxDQUFDLE9BQVAsQ0FBZSx5SUFBZixDQUFBLENBQUE7QUFBQSxRQVVBLE1BQU0sQ0FBQywwQkFBUCxDQUFrQyxDQUFDLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBRCxFQUFTLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBVCxDQUFsQyxDQVZBLENBQUE7QUFBQSxRQVdBLE1BQU0sQ0FBQywwQkFBUCxDQUFrQyxDQUFDLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBRCxFQUFTLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBVCxDQUFsQyxDQVhBLENBQUE7ZUFhQSxTQUFBLENBQVUsU0FBQSxHQUFBO2lCQUNSLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4Qix5SUFBOUIsRUFEUTtRQUFBLENBQVYsRUFkNEM7TUFBQSxDQUE5QyxFQURtRDtJQUFBLENBQXJELENBekdBLENBQUE7QUFBQSxJQW9JQSxRQUFBLENBQVMsa0JBQVQsRUFBNkIsU0FBQSxHQUFBO2FBQzNCLEVBQUEsQ0FBRyxrQ0FBSCxFQUF1QyxTQUFBLEdBQUE7QUFDckMsUUFBQSxNQUFNLENBQUMsT0FBUCxDQUFlLDJCQUFmLENBQUEsQ0FBQTtBQUFBLFFBTUEsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0IsQ0FOQSxDQUFBO2VBUUEsaUJBQUEsQ0FBa0IsU0FBQSxHQUFBO2lCQUNoQixNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsMkJBQTlCLEVBRGdCO1FBQUEsQ0FBbEIsRUFUcUM7TUFBQSxDQUF2QyxFQUQyQjtJQUFBLENBQTdCLENBcElBLENBQUE7QUFBQSxJQXFKQSxRQUFBLENBQVMsV0FBVCxFQUFzQixTQUFBLEdBQUE7YUFDcEIsRUFBQSxDQUFHLDZDQUFILEVBQWtELFNBQUEsR0FBQTtBQUNoRCxRQUFBLE1BQU0sQ0FBQyxPQUFQLENBQWUsb0pBQWYsQ0FBQSxDQUFBO0FBQUEsUUFtQkEsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBL0IsQ0FuQkEsQ0FBQTtlQXFCQSxXQUFBLENBQVksU0FBQSxHQUFBO2lCQUNWLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QiwyQkFBOUIsRUFEVTtRQUFBLENBQVosRUF0QmdEO01BQUEsQ0FBbEQsRUFEb0I7SUFBQSxDQUF0QixDQXJKQSxDQUFBO1dBbUxBLFFBQUEsQ0FBUywwQkFBVCxFQUFxQyxTQUFBLEdBQUE7YUFDbkMsRUFBQSxDQUFHLGdDQUFILEVBQXFDLFNBQUEsR0FBQTtBQUNuQyxRQUFBLE1BQU0sQ0FBQyxPQUFQLENBQWUsNENBQWYsQ0FBQSxDQUFBO0FBQUEsUUFRQSxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQixDQVJBLENBQUE7ZUFVQSx1QkFBQSxDQUF3QixTQUFBLEdBQUE7aUJBQ3RCLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4Qiw0Q0FBOUIsRUFEc0I7UUFBQSxDQUF4QixFQVhtQztNQUFBLENBQXJDLEVBRG1DO0lBQUEsQ0FBckMsRUFwTHdCO0VBQUEsQ0FBMUIsQ0FBQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/ah/.atom/packages/sort-lines/spec/sort-lines-spec.coffee
