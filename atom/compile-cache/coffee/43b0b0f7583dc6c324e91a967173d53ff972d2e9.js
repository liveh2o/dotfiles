(function() {
  describe("sorting lines", function() {
    var activationPromise, editor, editorView, sortLineCaseInsensitive, sortLines, sortLinesNatural, sortLinesReversed, uniqueLines, _ref;
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
    sortLinesNatural = function(callback) {
      atom.commands.dispatch(editorView, "sort-lines:natural");
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
      it("uniques all lines but does not change order", function() {
        editor.setText("Hydrogen\nHydrogen\nHelium\nLithium\nHydrogen\nHydrogen\nHelium\nLithium\nHydrogen\nHydrogen\nHelium\nLithium\nHydrogen\nHydrogen\nHelium\nLithium");
        editor.setCursorBufferPosition([0, 0]);
        return uniqueLines(function() {
          return expect(editor.getText()).toBe("Hydrogen\nHelium\nLithium");
        });
      });
      return it("uniques all lines using CRLF line-endings", function() {
        editor.setText("Hydrogen\r\nHydrogen\r\nHelium\r\nLithium\r\nHydrogen\r\nHydrogen\r\nHelium\r\nLithium\r\nHydrogen\r\nHydrogen\r\nHelium\r\nLithium\r\nHydrogen\r\nHydrogen\r\nHelium\r\nLithium\r\n");
        editor.setCursorBufferPosition([0, 0]);
        return uniqueLines(function() {
          return expect(editor.getText()).toBe("Hydrogen\r\nHelium\r\nLithium\r\n");
        });
      });
    });
    describe("case-insensitive sorting", function() {
      return it("sorts all lines, ignoring case", function() {
        editor.setText("Hydrogen\nlithium\nhelium\nHelium\nLithium");
        editor.setCursorBufferPosition([0, 0]);
        return sortLineCaseInsensitive(function() {
          return expect(editor.getText()).toBe("helium\nHelium\nHydrogen\nlithium\nLithium");
        });
      });
    });
    return describe("natural sorting", function() {
      it("orders by leading numerals", function() {
        editor.setText("4a\n1a\n2a\n3a\n0a");
        editor.setCursorBufferPosition([0, 0]);
        return sortLinesNatural(function() {
          return expect(editor.getText()).toBe("0a\n1a\n2a\n3a\n4a");
        });
      });
      it("orders by word", function() {
        editor.setText("1Hydrogen1\n1Beryllium1\n1Carbon1");
        editor.setCursorBufferPosition([0, 0]);
        return sortLinesNatural(function() {
          return expect(editor.getText()).toBe("1Beryllium1\n1Carbon1\n1Hydrogen1");
        });
      });
      it("orders by trailing numeral", function() {
        editor.setText("a4\na0\na1\na2\na3");
        editor.setCursorBufferPosition([0, 0]);
        return sortLinesNatural(function() {
          return expect(editor.getText()).toBe("a0\na1\na2\na3\na4");
        });
      });
      it("orders by leading numeral before word", function() {
        editor.setText("4b\n2b\n3a\n1a");
        editor.setCursorBufferPosition([0, 0]);
        return sortLinesNatural(function() {
          return expect(editor.getText()).toBe("1a\n2b\n3a\n4b");
        });
      });
      it("orders by word before trailing number", function() {
        editor.setText("c2\na4\nd1\nb3");
        editor.setCursorBufferPosition([0, 0]);
        return sortLinesNatural(function() {
          return expect(editor.getText()).toBe("a4\nb3\nc2\nd1");
        });
      });
      return it("properly handles leading zeros", function() {
        editor.setText("a01\na001\na003\na002\na02");
        editor.setCursorBufferPosition([0, 0]);
        return sortLinesNatural(function() {
          return expect(editor.getText()).toBe("a001\na002\na003\na01\na02");
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3NvcnQtbGluZXMvc3BlYy9zb3J0LWxpbmVzLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQ0E7QUFBQSxFQUFBLFFBQUEsQ0FBUyxlQUFULEVBQTBCLFNBQUEsR0FBQTtBQUN4QixRQUFBLGlJQUFBO0FBQUEsSUFBQSxPQUEwQyxFQUExQyxFQUFDLDJCQUFELEVBQW9CLGdCQUFwQixFQUE0QixvQkFBNUIsQ0FBQTtBQUFBLElBRUEsU0FBQSxHQUFZLFNBQUMsUUFBRCxHQUFBO0FBQ1YsTUFBQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsVUFBdkIsRUFBbUMsaUJBQW5DLENBQUEsQ0FBQTtBQUFBLE1BQ0EsZUFBQSxDQUFnQixTQUFBLEdBQUE7ZUFBRyxrQkFBSDtNQUFBLENBQWhCLENBREEsQ0FBQTthQUVBLElBQUEsQ0FBSyxRQUFMLEVBSFU7SUFBQSxDQUZaLENBQUE7QUFBQSxJQU9BLGlCQUFBLEdBQW9CLFNBQUMsUUFBRCxHQUFBO0FBQ2xCLE1BQUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLFVBQXZCLEVBQW1DLHlCQUFuQyxDQUFBLENBQUE7QUFBQSxNQUNBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQUcsa0JBQUg7TUFBQSxDQUFoQixDQURBLENBQUE7YUFFQSxJQUFBLENBQUssUUFBTCxFQUhrQjtJQUFBLENBUHBCLENBQUE7QUFBQSxJQVlBLFdBQUEsR0FBYyxTQUFDLFFBQUQsR0FBQTtBQUNaLE1BQUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLFVBQXZCLEVBQW1DLG1CQUFuQyxDQUFBLENBQUE7QUFBQSxNQUNBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQUcsa0JBQUg7TUFBQSxDQUFoQixDQURBLENBQUE7YUFFQSxJQUFBLENB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

//# sourceURL=/Users/ah/.atom/packages/sort-lines/spec/sort-lines-spec.coffee
