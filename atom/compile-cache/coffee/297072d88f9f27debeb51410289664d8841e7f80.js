(function() {
  describe("sorting lines", function() {
    var activationPromise, editor, editorView, ref, sortLineCaseInsensitive, sortLines, sortLinesNatural, sortLinesReversed, uniqueLines;
    ref = [], activationPromise = ref[0], editor = ref[1], editorView = ref[2];
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
      it("sorts all lines, ignoring the trailing new line", function() {
        editor.setText("Hydrogen\nHelium\nLithium\n");
        editor.setCursorBufferPosition([0, 0]);
        return sortLines(function() {
          return expect(editor.getText()).toBe("Helium\nHydrogen\nLithium\n");
        });
      });
      return it("gracefully handles attempt to sort an empty editor", function() {
        editor.setText("");
        editor.setCursorBufferPosition([0, 0]);
        return sortLines(function() {
          return expect(editor.getText()).toBe("");
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
        editor.setText("4a\n1a\n2a\n12a\n3a\n0a");
        editor.setCursorBufferPosition([0, 0]);
        return sortLinesNatural(function() {
          return expect(editor.getText()).toBe("0a\n1a\n2a\n3a\n4a\n12a");
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
        editor.setText("a4\na0\na12\na1\na2\na3");
        editor.setCursorBufferPosition([0, 0]);
        return sortLinesNatural(function() {
          return expect(editor.getText()).toBe("a0\na1\na2\na3\na4\na12");
        });
      });
      it("orders by leading numeral before word", function() {
        editor.setText("4b\n3a\n2b\n1a");
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
      it("properly handles leading zeros", function() {
        editor.setText("a01\na001\na003\na002\na02");
        editor.setCursorBufferPosition([0, 0]);
        return sortLinesNatural(function() {
          return expect(editor.getText()).toBe("a001\na002\na003\na01\na02");
        });
      });
      it("properly handles simple numerics", function() {
        editor.setText("10\n9\n2\n1\n4");
        editor.setCursorBufferPosition([0, 0]);
        return sortLinesNatural(function() {
          return expect(editor.getText()).toBe("1\n2\n4\n9\n10");
        });
      });
      it("properly handles floats", function() {
        editor.setText("10.0401\n10.022\n10.042\n10.021999");
        editor.setCursorBufferPosition([0, 0]);
        return sortLinesNatural(function() {
          return expect(editor.getText()).toBe("10.021999\n10.022\n10.0401\n10.042");
        });
      });
      it("properly handles float & decimal notation", function() {
        editor.setText("10.04f\n10.039F\n10.038d\n10.037D");
        editor.setCursorBufferPosition([0, 0]);
        return sortLinesNatural(function() {
          return expect(editor.getText()).toBe("10.037D\n10.038d\n10.039F\n10.04f");
        });
      });
      it("properly handles scientific notation", function() {
        editor.setText("1.528535048e5\n1.528535047e7\n1.528535049e3");
        editor.setCursorBufferPosition([0, 0]);
        return sortLinesNatural(function() {
          return expect(editor.getText()).toBe("1.528535049e3\n1.528535048e5\n1.528535047e7");
        });
      });
      it("properly handles ip addresses", function() {
        editor.setText("192.168.0.100\n192.168.0.1\n192.168.1.1");
        editor.setCursorBufferPosition([0, 0]);
        return sortLinesNatural(function() {
          return expect(editor.getText()).toBe("192.168.0.1\n192.168.0.100\n192.168.1.1");
        });
      });
      it("properly handles filenames", function() {
        editor.setText("car.mov\n01alpha.sgi\n001alpha.sgi\nmy.string_41299.tif");
        editor.setCursorBufferPosition([0, 0]);
        return sortLinesNatural(function() {
          return expect(editor.getText()).toBe("001alpha.sgi\n01alpha.sgi\ncar.mov\nmy.string_41299.tif");
        });
      });
      it("properly handles dates", function() {
        editor.setText("10/12/2008\n10/11/2008\n10/11/2007\n10/12/2007");
        editor.setCursorBufferPosition([0, 0]);
        return sortLinesNatural(function() {
          return expect(editor.getText()).toBe("10/11/2007\n10/12/2007\n10/11/2008\n10/12/2008");
        });
      });
      return it("properly handles money", function() {
        editor.setText("$10002.00\n$10001.02\n$10001.01");
        editor.setCursorBufferPosition([0, 0]);
        return sortLinesNatural(function() {
          return expect(editor.getText()).toBe("$10001.01\n$10001.02\n$10002.00");
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3NvcnQtbGluZXMvc3BlYy9zb3J0LWxpbmVzLXNwZWMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBO0VBQUEsUUFBQSxDQUFTLGVBQVQsRUFBMEIsU0FBQTtBQUN4QixRQUFBO0lBQUEsTUFBMEMsRUFBMUMsRUFBQywwQkFBRCxFQUFvQixlQUFwQixFQUE0QjtJQUU1QixTQUFBLEdBQVksU0FBQyxRQUFEO01BQ1YsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLFVBQXZCLEVBQW1DLGlCQUFuQztNQUNBLGVBQUEsQ0FBZ0IsU0FBQTtlQUFHO01BQUgsQ0FBaEI7YUFDQSxJQUFBLENBQUssUUFBTDtJQUhVO0lBS1osaUJBQUEsR0FBb0IsU0FBQyxRQUFEO01BQ2xCLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixVQUF2QixFQUFtQyx5QkFBbkM7TUFDQSxlQUFBLENBQWdCLFNBQUE7ZUFBRztNQUFILENBQWhCO2FBQ0EsSUFBQSxDQUFLLFFBQUw7SUFIa0I7SUFLcEIsV0FBQSxHQUFjLFNBQUMsUUFBRDtNQUNaLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixVQUF2QixFQUFtQyxtQkFBbkM7TUFDQSxlQUFBLENBQWdCLFNBQUE7ZUFBRztNQUFILENBQWhCO2FBQ0EsSUFBQSxDQUFLLFFBQUw7SUFIWTtJQUtkLHVCQUFBLEdBQTBCLFNBQUMsUUFBRDtNQUN4QixJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsVUFBdkIsRUFBbUMsa0NBQW5DO01BQ0EsZUFBQSxDQUFnQixTQUFBO2VBQUc7TUFBSCxDQUFoQjthQUNBLElBQUEsQ0FBSyxRQUFMO0lBSHdCO0lBSzFCLGdCQUFBLEdBQW1CLFNBQUMsUUFBRDtNQUNqQixJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsVUFBdkIsRUFBbUMsb0JBQW5DO01BQ0Es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TUFBTSxDQUFDLE9BQVAsQ0FBZSxpQ0FBZjtRQU1BLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBSSxDQUFKLENBQS9CO2VBRUEsZ0JBQUEsQ0FBaUIsU0FBQTtpQkFDZixNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFQLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsaUNBQTlCO1FBRGUsQ0FBakI7TUFUMkIsQ0FBN0I7SUFqUDBCLENBQTVCO0VBNU53QixDQUExQjtBQUFBIiwic291cmNlc0NvbnRlbnQiOlsiXG5kZXNjcmliZSBcInNvcnRpbmcgbGluZXNcIiwgLT5cbiAgW2FjdGl2YXRpb25Qcm9taXNlLCBlZGl0b3IsIGVkaXRvclZpZXddID0gW11cblxuICBzb3J0TGluZXMgPSAoY2FsbGJhY2spIC0+XG4gICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCBlZGl0b3JWaWV3LCBcInNvcnQtbGluZXM6c29ydFwiXG4gICAgd2FpdHNGb3JQcm9taXNlIC0+IGFjdGl2YXRpb25Qcm9taXNlXG4gICAgcnVucyhjYWxsYmFjaylcblxuICBzb3J0TGluZXNSZXZlcnNlZCA9IChjYWxsYmFjaykgLT5cbiAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoIGVkaXRvclZpZXcsIFwic29ydC1saW5lczpyZXZlcnNlLXNvcnRcIlxuICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBhY3RpdmF0aW9uUHJvbWlzZVxuICAgIHJ1bnMoY2FsbGJhY2spXG5cbiAgdW5pcXVlTGluZXMgPSAoY2FsbGJhY2spIC0+XG4gICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCBlZGl0b3JWaWV3LCBcInNvcnQtbGluZXM6dW5pcXVlXCJcbiAgICB3YWl0c0ZvclByb21pc2UgLT4gYWN0aXZhdGlvblByb21pc2VcbiAgICBydW5zKGNhbGxiYWNrKVxuXG4gIHNvcnRMaW5lQ2FzZUluc2Vuc2l0aXZlID0gKGNhbGxiYWNrKSAtPlxuICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2ggZWRpdG9yVmlldywgXCJzb3J0LWxpbmVzOmNhc2UtaW5zZW5zaXRpdmUtc29ydFwiXG4gICAgd2FpdHNGb3JQcm9taXNlIC0+IGFjdGl2YXRpb25Qcm9taXNlXG4gICAgcnVucyhjYWxsYmFjaylcblxuICBzb3J0TGluZXNOYXR1cmFsID0gKGNhbGxiYWNrKSAtPlxuICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2ggZWRpdG9yVmlldywgXCJzb3J0LWxpbmVzOm5hdHVyYWxcIlxuICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBhY3RpdmF0aW9uUHJvbWlzZVxuICAgIHJ1bnMoY2FsbGJhY2spXG5cbiAgYmVmb3JlRWFjaCAtPlxuICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbigpXG5cbiAgICBydW5zIC0+XG4gICAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgIGVkaXRvclZpZXcgPSBhdG9tLnZpZXdzLmdldFZpZXcoZWRpdG9yKVxuXG4gICAgICBhY3RpdmF0aW9uUHJvbWlzZSA9IGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdzb3J0LWxpbmVzJylcblxuICBkZXNjcmliZSBcIndoZW4gbm8gbGluZXMgYXJlIHNlbGVjdGVkXCIsIC0+XG4gICAgaXQgXCJzb3J0cyBhbGwgbGluZXNcIiwgLT5cbiAgICAgIGVkaXRvci5zZXRUZXh0IFwiXCJcIlxuICAgICAgICBIeWRyb2dlblxuICAgICAgICBIZWxpdW1cbiAgICAgICAgTGl0aGl1bVxuICAgICAgXCJcIlwiXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzAsIDBdKVxuXG4gICAgICBzb3J0TGluZXMgLT5cbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCJcIlwiXG4gICAgICAgICAgSGVsaXVtXG4gICAgICAgICAgSHlkcm9nZW5cbiAgICAgICAgICBMaXRoaXVtXG4gICAgICAgIFwiXCJcIlxuXG4gICAgaXQgXCJzb3J0cyBhbGwgbGluZXMsIGlnbm9yaW5nIHRoZSB0cmFpbGluZyBuZXcgbGluZVwiLCAtPlxuICAgICAgZWRpdG9yLnNldFRleHQgXCJcIlwiXG4gICAgICAgIEh5ZHJvZ2VuXG4gICAgICAgIEhlbGl1bVxuICAgICAgICBMaXRoaXVtXG5cbiAgICAgIFwiXCJcIlxuICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFswLCAwXSlcblxuICAgICAgc29ydExpbmVzIC0+XG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiXCJcIlxuICAgICAgICAgIEhlbGl1bVxuICAgICAgICAgIEh5ZHJvZ2VuXG4gICAgICAgICAgTGl0aGl1bVxuXG4gICAgICAgIFwiXCJcIlxuXG4gICAgaXQgXCJncmFjZWZ1bGx5IGhhbmRsZXMgYXR0ZW1wdCB0byBzb3J0IGFuIGVtcHR5IGVkaXRvclwiLCAtPlxuICAgICAgZWRpdG9yLnNldFRleHQgXCJcIlxuICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFswLCAwXSlcblxuICAgICAgc29ydExpbmVzIC0+IGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiXCJcblxuICBkZXNjcmliZSBcIndoZW4gZW50aXJlIGxpbmVzIGFyZSBzZWxlY3RlZFwiLCAtPlxuICAgIGl0IFwic29ydHMgdGhlIHNlbGVjdGVkIGxpbmVzXCIsIC0+XG4gICAgICBlZGl0b3Iuc2V0VGV4dCBcIlwiXCJcbiAgICAgICAgSHlkcm9nZW5cbiAgICAgICAgSGVsaXVtXG4gICAgICAgIExpdGhpdW1cbiAgICAgICAgQmVyeWxsaXVtXG4gICAgICAgIEJvcm9uXG4gICAgICBcIlwiXCJcbiAgICAgIGVkaXRvci5zZXRTZWxlY3RlZEJ1ZmZlclJhbmdlKFtbMSwwXSwgWzQsMF1dKVxuXG4gICAgICBzb3J0TGluZXMgLT5cbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCJcIlwiXG4gICAgICAgICAgSHlkcm9nZW5cbiAgICAgICAgICBCZXJ5bGxpdW1cbiAgICAgICAgICBIZWxpdW1cbiAgICAgICAgICBMaXRoaXVtXG4gICAgICAgICAgQm9yb25cbiAgICAgICAgXCJcIlwiXG5cbiAgZGVzY3JpYmUgXCJ3aGVuIHBhcnRpYWwgbGluZXMgYXJlIHNlbGVjdGVkXCIsIC0+XG4gICAgaXQgXCJzb3J0cyB0aGUgc2VsZWN0ZWQgbGluZXNcIiwgLT5cbiAgICAgIGVkaXRvci5zZXRUZXh0IFwiXCJcIlxuICAgICAgICBIeWRyb2dlblxuICAgICAgICBIZWxpdW1cbiAgICAgICAgTGl0aGl1bVxuICAgICAgICBCZXJ5bGxpdW1cbiAgICAgICAgQm9yb25cbiAgICAgIFwiXCJcIlxuICAgICAgZWRpdG9yLnNldFNlbGVjdGVkQnVmZmVyUmFuZ2UoW1sxLDNdLCBbMywyXV0pXG5cbiAgICAgIHNvcnRMaW5lcyAtPlxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSBcIlwiXCJcbiAgICAgICAgICBIeWRyb2dlblxuICAgICAgICAgIEJlcnlsbGl1bVxuICAgICAgICAgIEhlbGl1bVxuICAgICAgICAgIExpdGhpdW1cbiAgICAgICAgICBCb3JvblxuICAgICAgICBcIlwiXCJcblxuICBkZXNjcmliZSBcIndoZW4gdGhlcmUgYXJlIG11bHRpcGxlIHNlbGVjdGlvbiByYW5nZXNcIiwgLT5cbiAgICBpdCBcInNvcnRzIHRoZSBsaW5lcyBpbiBlYWNoIHNlbGVjdGlvbiByYW5nZVwiLCAtPlxuICAgICAgZWRpdG9yLnNldFRleHQgXCJcIlwiXG4gICAgICAgIEh5ZHJvZ2VuXG4gICAgICAgIEhlbGl1bSAgICAjIHNlbGVjdGlvbiAxXG4gICAgICAgIEJlcnlsbGl1bSAjIHNlbGVjdGlvbiAxXG4gICAgICAgIENhcmJvblxuICAgICAgICBGbHVvcmluZSAgIyBzZWxlY3Rpb24gMlxuICAgICAgICBBbHVtaW51bSAgIyBzZWxlY3Rpb24gMlxuICAgICAgICBHYWxsaXVtXG4gICAgICAgIEV1cm9waXVtXG4gICAgICBcIlwiXCJcbiAgICAgIGVkaXRvci5hZGRTZWxlY3Rpb25Gb3JCdWZmZXJSYW5nZShbWzEsIDBdLCBbMywgMF1dKVxuICAgICAgZWRpdG9yLmFkZFNlbGVjdGlvbkZvckJ1ZmZlclJhbmdlKFtbNCwgMF0sIFs2LCAwXV0pXG5cbiAgICAgIHNvcnRMaW5lcyAtPlxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSBcIlwiXCJcbiAgICAgICAgICBIeWRyb2dlblxuICAgICAgICAgIEJlcnlsbGl1bSAjIHNlbGVjdGlvbiAxXG4gICAgICAgICAgSGVsaXVtICAgICMgc2VsZWN0aW9uIDFcbiAgICAgICAgICBDYXJib25cbiAgICAgICAgICBBbHVtaW51bSAgIyBzZWxlY3Rpb24gMlxuICAgICAgICAgIEZsdW9yaW5lICAjIHNlbGVjdGlvbiAyXG4gICAgICAgICAgR2FsbGl1bVxuICAgICAgICAgIEV1cm9waXVtXG4gICAgICAgIFwiXCJcIlxuXG4gIGRlc2NyaWJlIFwicmV2ZXJzZWQgc29ydGluZ1wiLCAtPlxuICAgIGl0IFwic29ydHMgYWxsIGxpbmVzIGluIHJldmVyc2Ugb3JkZXJcIiwgLT5cbiAgICAgIGVkaXRvci5zZXRUZXh0IFwiXCJcIlxuICAgICAgICBIeWRyb2dlblxuICAgICAgICBIZWxpdW1cbiAgICAgICAgTGl0aGl1bVxuICAgICAgXCJcIlwiXG5cbiAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbMCwgMF0pXG5cbiAgICAgIHNvcnRMaW5lc1JldmVyc2VkIC0+XG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiXCJcIlxuICAgICAgICAgIExpdGhpdW1cbiAgICAgICAgICBIeWRyb2dlblxuICAgICAgICAgIEhlbGl1bVxuICAgICAgICBcIlwiXCJcblxuICBkZXNjcmliZSBcInVuaXF1ZWluZ1wiLCAtPlxuICAgIGl0IFwidW5pcXVlcyBhbGwgbGluZXMgYnV0IGRvZXMgbm90IGNoYW5nZSBvcmRlclwiLCAtPlxuICAgICAgZWRpdG9yLnNldFRleHQgXCJcIlwiXG4gICAgICAgIEh5ZHJvZ2VuXG4gICAgICAgIEh5ZHJvZ2VuXG4gICAgICAgIEhlbGl1bVxuICAgICAgICBMaXRoaXVtXG4gICAgICAgIEh5ZHJvZ2VuXG4gICAgICAgIEh5ZHJvZ2VuXG4gICAgICAgIEhlbGl1bVxuICAgICAgICBMaXRoaXVtXG4gICAgICAgIEh5ZHJvZ2VuXG4gICAgICAgIEh5ZHJvZ2VuXG4gICAgICAgIEhlbGl1bVxuICAgICAgICBMaXRoaXVtXG4gICAgICAgIEh5ZHJvZ2VuXG4gICAgICAgIEh5ZHJvZ2VuXG4gICAgICAgIEhlbGl1bVxuICAgICAgICBMaXRoaXVtXG4gICAgICBcIlwiXCJcblxuICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFswLCAwXSlcblxuICAgICAgdW5pcXVlTGluZXMgLT5cbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCJcIlwiXG4gICAgICAgICAgSHlkcm9nZW5cbiAgICAgICAgICBIZWxpdW1cbiAgICAgICAgICBMaXRoaXVtXG4gICAgICAgIFwiXCJcIlxuXG4gICAgaXQgXCJ1bmlxdWVzIGFsbCBsaW5lcyB1c2luZyBDUkxGIGxpbmUtZW5kaW5nc1wiLCAtPlxuICAgICAgZWRpdG9yLnNldFRleHQgXCJIeWRyb2dlblxcclxcbkh5ZHJvZ2VuXFxyXFxuSGVsaXVtXFxyXFxuTGl0aGl1bVxcclxcbkh5ZHJvZ2VuXFxyXFxuSHlkcm9nZW5cXHJcXG5IZWxpdW1cXHJcXG5MaXRoaXVtXFxyXFxuSHlkcm9nZW5cXHJcXG5IeWRyb2dlblxcclxcbkhlbGl1bVxcclxcbkxpdGhpdW1cXHJcXG5IeWRyb2dlblxcclxcbkh5ZHJvZ2VuXFxyXFxuSGVsaXVtXFxyXFxuTGl0aGl1bVxcclxcblwiXG5cbiAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbMCwwXSlcblxuICAgICAgdW5pcXVlTGluZXMgLT5cbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCJIeWRyb2dlblxcclxcbkhlbGl1bVxcclxcbkxpdGhpdW1cXHJcXG5cIlxuXG4gIGRlc2NyaWJlIFwiY2FzZS1pbnNlbnNpdGl2ZSBzb3J0aW5nXCIsIC0+XG4gICAgaXQgXCJzb3J0cyBhbGwgbGluZXMsIGlnbm9yaW5nIGNhc2VcIiwgLT5cbiAgICAgIGVkaXRvci5zZXRUZXh0IFwiXCJcIlxuICAgICAgICBIeWRyb2dlblxuICAgICAgICBsaXRoaXVtXG4gICAgICAgIGhlbGl1bVxuICAgICAgICBIZWxpdW1cbiAgICAgICAgTGl0aGl1bVxuICAgICAgXCJcIlwiXG5cbiAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbMCwgMF0pXG5cbiAgICAgIHNvcnRMaW5lQ2FzZUluc2Vuc2l0aXZlIC0+XG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiXCJcIlxuICAgICAgICAgIGhlbGl1bVxuICAgICAgICAgIEhlbGl1bVxuICAgICAgICAgIEh5ZHJvZ2VuXG4gICAgICAgICAgbGl0aGl1bVxuICAgICAgICAgIExpdGhpdW1cbiAgICAgICAgXCJcIlwiXG5cbiAgZGVzY3JpYmUgXCJuYXR1cmFsIHNvcnRpbmdcIiwgLT5cbiAgICBpdCBcIm9yZGVycyBieSBsZWFkaW5nIG51bWVyYWxzXCIsIC0+XG4gICAgICBlZGl0b3Iuc2V0VGV4dCBcIlwiXCJcbiAgICAgICAgNGFcbiAgICAgICAgMWFcbiAgICAgICAgMmFcbiAgICAgICAgMTJhXG4gICAgICAgIDNhXG4gICAgICAgIDBhXG4gICAgICBcIlwiXCJcblxuICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFswLCAwXSlcblxuICAgICAgc29ydExpbmVzTmF0dXJhbCAtPlxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSBcIlwiXCJcbiAgICAgICAgICAwYVxuICAgICAgICAgIDFhXG4gICAgICAgICAgMmFcbiAgICAgICAgICAzYVxuICAgICAgICAgIDRhXG4gICAgICAgICAgMTJhXG4gICAgICAgIFwiXCJcIlxuXG4gICAgaXQgXCJvcmRlcnMgYnkgd29yZFwiLCAtPlxuICAgICAgZWRpdG9yLnNldFRleHQgXCJcIlwiXG4gICAgICAgIDFIeWRyb2dlbjFcbiAgICAgICAgMUJlcnlsbGl1bTFcbiAgICAgICAgMUNhcmJvbjFcbiAgICAgIFwiXCJcIlxuXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzAsIDBdKVxuXG4gICAgICBzb3J0TGluZXNOYXR1cmFsIC0+XG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiXCJcIlxuICAgICAgICAgIDFCZXJ5bGxpdW0xXG4gICAgICAgICAgMUNhcmJvbjFcbiAgICAgICAgICAxSHlkcm9nZW4xXG4gICAgICAgIFwiXCJcIlxuXG4gICAgaXQgXCJvcmRlcnMgYnkgdHJhaWxpbmcgbnVtZXJhbFwiLCAtPlxuICAgICAgZWRpdG9yLnNldFRleHQgXCJcIlwiXG4gICAgICAgIGE0XG4gICAgICAgIGEwXG4gICAgICAgIGExMlxuICAgICAgICBhMVxuICAgICAgICBhMlxuICAgICAgICBhM1xuICAgICAgXCJcIlwiXG5cbiAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbMCwgMF0pXG5cbiAgICAgIHNvcnRMaW5lc05hdHVyYWwgLT5cbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCJcIlwiXG4gICAgICAgICAgYTBcbiAgICAgICAgICBhMVxuICAgICAgICAgIGEyXG4gICAgICAgICAgYTNcbiAgICAgICAgICBhNFxuICAgICAgICAgIGExMlxuICAgICAgICBcIlwiXCJcblxuICAgIGl0IFwib3JkZXJzIGJ5IGxlYWRpbmcgbnVtZXJhbCBiZWZvcmUgd29yZFwiLCAtPlxuICAgICAgZWRpdG9yLnNldFRleHQgXCJcIlwiXG4gICAgICAgIDRiXG4gICAgICAgIDNhXG4gICAgICAgIDJiXG4gICAgICAgIDFhXG4gICAgICBcIlwiXCJcblxuICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFswLCAwXSlcblxuICAgICAgc29ydExpbmVzTmF0dXJhbCAtPlxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSBcIlwiXCJcbiAgICAgICAgICAxYVxuICAgICAgICAgIDJiXG4gICAgICAgICAgM2FcbiAgICAgICAgICA0YlxuICAgICAgICBcIlwiXCJcblxuICAgIGl0IFwib3JkZXJzIGJ5IHdvcmQgYmVmb3JlIHRyYWlsaW5nIG51bWJlclwiLCAtPlxuICAgICAgZWRpdG9yLnNldFRleHQgXCJcIlwiXG4gICAgICAgIGMyXG4gICAgICAgIGE0XG4gICAgICAgIGQxXG4gICAgICAgIGIzXG4gICAgICBcIlwiXCJcblxuICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFswLCAwXSlcblxuICAgICAgc29ydExpbmVzTmF0dXJhbCAtPlxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSBcIlwiXCJcbiAgICAgICAgICBhNFxuICAgICAgICAgIGIzXG4gICAgICAgICAgYzJcbiAgICAgICAgICBkMVxuICAgICAgICBcIlwiXCJcblxuICAgIGl0IFwicHJvcGVybHkgaGFuZGxlcyBsZWFkaW5nIHplcm9zXCIsIC0+XG4gICAgICBlZGl0b3Iuc2V0VGV4dCBcIlwiXCJcbiAgICAgICAgYTAxXG4gICAgICAgIGEwMDFcbiAgICAgICAgYTAwM1xuICAgICAgICBhMDAyXG4gICAgICAgIGEwMlxuICAgICAgXCJcIlwiXG5cbiAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbMCwgMF0pXG5cbiAgICAgIHNvcnRMaW5lc05hdHVyYWwgLT5cbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCJcIlwiXG4gICAgICAgICAgYTAwMVxuICAgICAgICAgIGEwMDJcbiAgICAgICAgICBhMDAzXG4gICAgICAgICAgYTAxXG4gICAgICAgICAgYTAyXG4gICAgICAgIFwiXCJcIlxuXG4gICAgaXQgXCJwcm9wZXJseSBoYW5kbGVzIHNpbXBsZSBudW1lcmljc1wiLCAtPlxuICAgICAgZWRpdG9yLnNldFRleHQgXCJcIlwiXG4gICAgICAgIDEwXG4gICAgICAgIDlcbiAgICAgICAgMlxuICAgICAgICAxXG4gICAgICAgIDRcbiAgICAgIFwiXCJcIlxuXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzAsIDBdKVxuXG4gICAgICBzb3J0TGluZXNOYXR1cmFsIC0+XG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiXCJcIlxuICAgICAgICAgIDFcbiAgICAgICAgICAyXG4gICAgICAgICAgNFxuICAgICAgICAgIDlcbiAgICAgICAgICAxMFxuICAgICAgICBcIlwiXCJcblxuICAgIGl0IFwicHJvcGVybHkgaGFuZGxlcyBmbG9hdHNcIiwgLT5cbiAgICAgIGVkaXRvci5zZXRUZXh0IFwiXCJcIlxuICAgICAgICAxMC4wNDAxXG4gICAgICAgIDEwLjAyMlxuICAgICAgICAxMC4wNDJcbiAgICAgICAgMTAuMDIxOTk5XG4gICAgICBcIlwiXCJcblxuICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFswLCAwXSlcblxuICAgICAgc29ydExpbmVzTmF0dXJhbCAtPlxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSBcIlwiXCJcbiAgICAgICAgICAxMC4wMjE5OTlcbiAgICAgICAgICAxMC4wMjJcbiAgICAgICAgICAxMC4wNDAxXG4gICAgICAgICAgMTAuMDQyXG4gICAgICAgIFwiXCJcIlxuXG4gICAgaXQgXCJwcm9wZXJseSBoYW5kbGVzIGZsb2F0ICYgZGVjaW1hbCBub3RhdGlvblwiLCAtPlxuICAgICAgZWRpdG9yLnNldFRleHQgXCJcIlwiXG4gICAgICAgIDEwLjA0ZlxuICAgICAgICAxMC4wMzlGXG4gICAgICAgIDEwLjAzOGRcbiAgICAgICAgMTAuMDM3RFxuICAgICAgXCJcIlwiXG5cbiAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbMCwgMF0pXG5cbiAgICAgIHNvcnRMaW5lc05hdHVyYWwgLT5cbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCJcIlwiXG4gICAgICAgICAgMTAuMDM3RFxuICAgICAgICAgIDEwLjAzOGRcbiAgICAgICAgICAxMC4wMzlGXG4gICAgICAgICAgMTAuMDRmXG4gICAgICAgIFwiXCJcIlxuXG4gICAgaXQgXCJwcm9wZXJseSBoYW5kbGVzIHNjaWVudGlmaWMgbm90YXRpb25cIiwgLT5cbiAgICAgIGVkaXRvci5zZXRUZXh0IFwiXCJcIlxuICAgICAgICAxLjUyODUzNTA0OGU1XG4gICAgICAgIDEuNTI4NTM1MDQ3ZTdcbiAgICAgICAgMS41Mjg1MzUwNDllM1xuICAgICAgXCJcIlwiXG5cbiAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbMCwgMF0pXG5cbiAgICAgIHNvcnRMaW5lc05hdHVyYWwgLT5cbiAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUgXCJcIlwiXG4gICAgICAgICAgMS41Mjg1MzUwNDllM1xuICAgICAgICAgIDEuNTI4NTM1MDQ4ZTVcbiAgICAgICAgICAxLjUyODUzNTA0N2U3XG4gICAgICAgIFwiXCJcIlxuXG4gICAgaXQgXCJwcm9wZXJseSBoYW5kbGVzIGlwIGFkZHJlc3Nlc1wiLCAtPlxuICAgICAgZWRpdG9yLnNldFRleHQgXCJcIlwiXG4gICAgICAgIDE5Mi4xNjguMC4xMDBcbiAgICAgICAgMTkyLjE2OC4wLjFcbiAgICAgICAgMTkyLjE2OC4xLjFcbiAgICAgIFwiXCJcIlxuXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzAsIDBdKVxuXG4gICAgICBzb3J0TGluZXNOYXR1cmFsIC0+XG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiXCJcIlxuICAgICAgICAgIDE5Mi4xNjguMC4xXG4gICAgICAgICAgMTkyLjE2OC4wLjEwMFxuICAgICAgICAgIDE5Mi4xNjguMS4xXG4gICAgICAgIFwiXCJcIlxuXG4gICAgaXQgXCJwcm9wZXJseSBoYW5kbGVzIGZpbGVuYW1lc1wiLCAtPlxuICAgICAgZWRpdG9yLnNldFRleHQgXCJcIlwiXG4gICAgICAgIGNhci5tb3ZcbiAgICAgICAgMDFhbHBoYS5zZ2lcbiAgICAgICAgMDAxYWxwaGEuc2dpXG4gICAgICAgIG15LnN0cmluZ180MTI5OS50aWZcbiAgICAgIFwiXCJcIlxuXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzAsIDBdKVxuXG4gICAgICBzb3J0TGluZXNOYXR1cmFsIC0+XG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiXCJcIlxuICAgICAgICAgIDAwMWFscGhhLnNnaVxuICAgICAgICAgIDAxYWxwaGEuc2dpXG4gICAgICAgICAgY2FyLm1vdlxuICAgICAgICAgIG15LnN0cmluZ180MTI5OS50aWZcbiAgICAgICAgXCJcIlwiXG5cbiAgICBpdCBcInByb3Blcmx5IGhhbmRsZXMgZGF0ZXNcIiwgLT5cbiAgICAgIGVkaXRvci5zZXRUZXh0IFwiXCJcIlxuICAgICAgICAxMC8xMi8yMDA4XG4gICAgICAgIDEwLzExLzIwMDhcbiAgICAgICAgMTAvMTEvMjAwN1xuICAgICAgICAxMC8xMi8yMDA3XG4gICAgICBcIlwiXCJcblxuICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFswLCAwXSlcblxuICAgICAgc29ydExpbmVzTmF0dXJhbCAtPlxuICAgICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSBcIlwiXCJcbiAgICAgICAgICAxMC8xMS8yMDA3XG4gICAgICAgICAgMTAvMTIvMjAwN1xuICAgICAgICAgIDEwLzExLzIwMDhcbiAgICAgICAgICAxMC8xMi8yMDA4XG4gICAgICAgIFwiXCJcIlxuXG4gICAgaXQgXCJwcm9wZXJseSBoYW5kbGVzIG1vbmV5XCIsIC0+XG4gICAgICBlZGl0b3Iuc2V0VGV4dCBcIlwiXCJcbiAgICAgICAgJDEwMDAyLjAwXG4gICAgICAgICQxMDAwMS4wMlxuICAgICAgICAkMTAwMDEuMDFcbiAgICAgIFwiXCJcIlxuXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzAsIDBdKVxuXG4gICAgICBzb3J0TGluZXNOYXR1cmFsIC0+XG4gICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIFwiXCJcIlxuICAgICAgICAgICQxMDAwMS4wMVxuICAgICAgICAgICQxMDAwMS4wMlxuICAgICAgICAgICQxMDAwMi4wMFxuICAgICAgICBcIlwiXCJcbiJdfQ==
