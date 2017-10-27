(function() {
  var DefaultFileIcons, FileIcons;

  DefaultFileIcons = require('../lib/default-file-icons');

  FileIcons = require('../lib/file-icons');

  describe('file icon handling', function() {
    var workspaceElement;
    workspaceElement = null;
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      waitsForPromise(function() {
        return atom.workspace.open('sample.js');
      });
      return waitsForPromise(function() {
        return atom.packages.activatePackage('tabs');
      });
    });
    it('allows the service to provide icon classes', function() {
      var fileIconsDisposable, tab;
      fileIconsDisposable = atom.packages.serviceHub.provide('atom.file-icons', '1.0.0', {
        iconClassForPath: function(path, context) {
          expect(context).toBe('tabs');
          return 'first-icon-class second-icon-class';
        }
      });
      tab = workspaceElement.querySelector('.tab');
      expect(tab.itemTitle.className).toBe('title icon first-icon-class second-icon-class');
      fileIconsDisposable.dispose();
      return expect(tab.itemTitle.className).toBe('title');
    });
    return it('allows the service to provide multiple classes as an array', function() {
      var tab;
      atom.packages.serviceHub.provide('atom.file-icons', '1.0.0', {
        iconClassForPath: function(path) {
          return ['first-icon-class', 'second-icon-class'];
        }
      });
      tab = workspaceElement.querySelector('.tab');
      return expect(tab.itemTitle.className).toBe('title icon first-icon-class second-icon-class');
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RhYnMvc3BlYy9maWxlLWljb25zLXNwZWMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxnQkFBQSxHQUFtQixPQUFBLENBQVEsMkJBQVI7O0VBQ25CLFNBQUEsR0FBWSxPQUFBLENBQVEsbUJBQVI7O0VBRVosUUFBQSxDQUFTLG9CQUFULEVBQStCLFNBQUE7QUFDN0IsUUFBQTtJQUFBLGdCQUFBLEdBQW1CO0lBRW5CLFVBQUEsQ0FBVyxTQUFBO01BQ1QsZ0JBQUEsR0FBbUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLElBQUksQ0FBQyxTQUF4QjtNQUVuQixlQUFBLENBQWdCLFNBQUE7ZUFDZCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsV0FBcEI7TUFEYyxDQUFoQjthQUdBLGVBQUEsQ0FBZ0IsU0FBQTtlQUNkLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixNQUE5QjtNQURjLENBQWhCO0lBTlMsQ0FBWDtJQVNBLEVBQUEsQ0FBRyw0Q0FBSCxFQUFpRCxTQUFBO0FBQy9DLFVBQUE7TUFBQSxtQkFBQSxHQUFzQixJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxPQUF6QixDQUFpQyxpQkFBakMsRUFBb0QsT0FBcEQsRUFBNkQ7UUFDakYsZ0JBQUEsRUFBa0IsU0FBQyxJQUFELEVBQU8sT0FBUDtVQUNoQixNQUFBLENBQU8sT0FBUCxDQUFlLENBQUMsSUFBaEIsQ0FBcUIsTUFBckI7aUJBQ0E7UUFGZ0IsQ0FEK0Q7T0FBN0Q7TUFNdEIsR0FBQSxHQUFNLGdCQUFnQixDQUFDLGFBQWpCLENBQStCLE1BQS9CO01BQ04sTUFBQSxDQUFPLEdBQUcsQ0FBQyxTQUFTLENBQUMsU0FBckIsQ0FBK0IsQ0FBQyxJQUFoQyxDQUFxQywrQ0FBckM7TUFFQSxtQkFBbUIsQ0FBQyxPQUFwQixDQUFBO2FBQ0EsTUFBQSxDQUFPLEdBQUcsQ0FBQyxTQUFTLENBQUMsU0FBckIsQ0FBK0IsQ0FBQyxJQUFoQyxDQUFxQyxPQUFyQztJQVgrQyxDQUFqRDtXQWFBLEVBQUEsQ0FBRyw0REFBSCxFQUFpRSxTQUFBO0FBQy9ELFVBQUE7TUFBQSxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxPQUF6QixDQUFpQyxpQkFBakMsRUFBb0QsT0FBcEQsRUFBNkQ7UUFDM0QsZ0JBQUEsRUFBa0IsU0FBQyxJQUFEO2lCQUFVLENBQUMsa0JBQUQsRUFBcUIsbUJBQXJCO1FBQVYsQ0FEeUM7T0FBN0Q7TUFJQSxHQUFBLEdBQU0sZ0JBQWdCLENBQUMsYUFBakIsQ0FBK0IsTUFBL0I7YUFDTixNQUFBLENBQU8sR0FBRyxDQUFDLFNBQVMsQ0FBQyxTQUFyQixDQUErQixDQUFDLElBQWhDLENBQXFDLCtDQUFyQztJQU4rRCxDQUFqRTtFQXpCNkIsQ0FBL0I7QUFIQSIsInNvdXJjZXNDb250ZW50IjpbIkRlZmF1bHRGaWxlSWNvbnMgPSByZXF1aXJlICcuLi9saWIvZGVmYXVsdC1maWxlLWljb25zJ1xuRmlsZUljb25zID0gcmVxdWlyZSAnLi4vbGliL2ZpbGUtaWNvbnMnXG5cbmRlc2NyaWJlICdmaWxlIGljb24gaGFuZGxpbmcnLCAtPlxuICB3b3Jrc3BhY2VFbGVtZW50ID0gbnVsbFxuXG4gIGJlZm9yZUVhY2ggLT5cbiAgICB3b3Jrc3BhY2VFbGVtZW50ID0gYXRvbS52aWV3cy5nZXRWaWV3KGF0b20ud29ya3NwYWNlKVxuXG4gICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKCdzYW1wbGUuanMnKVxuXG4gICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICBhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZSgndGFicycpXG5cbiAgaXQgJ2FsbG93cyB0aGUgc2VydmljZSB0byBwcm92aWRlIGljb24gY2xhc3NlcycsIC0+XG4gICAgZmlsZUljb25zRGlzcG9zYWJsZSA9IGF0b20ucGFja2FnZXMuc2VydmljZUh1Yi5wcm92aWRlICdhdG9tLmZpbGUtaWNvbnMnLCAnMS4wLjAnLCB7XG4gICAgICBpY29uQ2xhc3NGb3JQYXRoOiAocGF0aCwgY29udGV4dCkgLT5cbiAgICAgICAgZXhwZWN0KGNvbnRleHQpLnRvQmUoJ3RhYnMnKVxuICAgICAgICAnZmlyc3QtaWNvbi1jbGFzcyBzZWNvbmQtaWNvbi1jbGFzcydcbiAgICB9XG5cbiAgICB0YWIgPSB3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy50YWInKVxuICAgIGV4cGVjdCh0YWIuaXRlbVRpdGxlLmNsYXNzTmFtZSkudG9CZSgndGl0bGUgaWNvbiBmaXJzdC1pY29uLWNsYXNzIHNlY29uZC1pY29uLWNsYXNzJylcblxuICAgIGZpbGVJY29uc0Rpc3Bvc2FibGUuZGlzcG9zZSgpXG4gICAgZXhwZWN0KHRhYi5pdGVtVGl0bGUuY2xhc3NOYW1lKS50b0JlKCd0aXRsZScpXG5cbiAgaXQgJ2FsbG93cyB0aGUgc2VydmljZSB0byBwcm92aWRlIG11bHRpcGxlIGNsYXNzZXMgYXMgYW4gYXJyYXknLCAtPlxuICAgIGF0b20ucGFja2FnZXMuc2VydmljZUh1Yi5wcm92aWRlICdhdG9tLmZpbGUtaWNvbnMnLCAnMS4wLjAnLCB7XG4gICAgICBpY29uQ2xhc3NGb3JQYXRoOiAocGF0aCkgLT4gWydmaXJzdC1pY29uLWNsYXNzJywgJ3NlY29uZC1pY29uLWNsYXNzJ11cbiAgICB9XG5cbiAgICB0YWIgPSB3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy50YWInKVxuICAgIGV4cGVjdCh0YWIuaXRlbVRpdGxlLmNsYXNzTmFtZSkudG9CZSgndGl0bGUgaWNvbiBmaXJzdC1pY29uLWNsYXNzIHNlY29uZC1pY29uLWNsYXNzJylcbiJdfQ==
