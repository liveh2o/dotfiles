(function() {
  var DefaultFileIcons, FileIcons;

  DefaultFileIcons = require('../lib/default-file-icons');

  FileIcons = require('../lib/file-icons');

  describe('file icon handling', function() {
    var workspaceElement;
    workspaceElement = null;
    beforeEach(function() {
      workspaceElement = atom.workspace.getElement();
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RhYnMvc3BlYy9maWxlLWljb25zLXNwZWMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxnQkFBQSxHQUFtQixPQUFBLENBQVEsMkJBQVI7O0VBQ25CLFNBQUEsR0FBWSxPQUFBLENBQVEsbUJBQVI7O0VBRVosUUFBQSxDQUFTLG9CQUFULEVBQStCLFNBQUE7QUFDN0IsUUFBQTtJQUFBLGdCQUFBLEdBQW1CO0lBRW5CLFVBQUEsQ0FBVyxTQUFBO01BQ1QsZ0JBQUEsR0FBbUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFmLENBQUE7TUFFbkIsZUFBQSxDQUFnQixTQUFBO2VBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLFdBQXBCO01BRGMsQ0FBaEI7YUFHQSxlQUFBLENBQWdCLFNBQUE7ZUFDZCxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsTUFBOUI7TUFEYyxDQUFoQjtJQU5TLENBQVg7SUFTQSxFQUFBLENBQUcsNENBQUgsRUFBaUQsU0FBQTtBQUMvQyxVQUFBO01BQUEsbUJBQUEsR0FBc0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsT0FBekIsQ0FBaUMsaUJBQWpDLEVBQW9ELE9BQXBELEVBQTZEO1FBQ2pGLGdCQUFBLEVBQWtCLFNBQUMsSUFBRCxFQUFPLE9BQVA7VUFDaEIsTUFBQSxDQUFPLE9BQVAsQ0FBZSxDQUFDLElBQWhCLENBQXFCLE1BQXJCO2lCQUNBO1FBRmdCLENBRCtEO09BQTdEO01BTXRCLEdBQUEsR0FBTSxnQkFBZ0IsQ0FBQyxhQUFqQixDQUErQixNQUEvQjtNQUNOLE1BQUEsQ0FBTyxHQUFHLENBQUMsU0FBUyxDQUFDLFNBQXJCLENBQStCLENBQUMsSUFBaEMsQ0FBcUMsK0NBQXJDO01BRUEsbUJBQW1CLENBQUMsT0FBcEIsQ0FBQTthQUNBLE1BQUEsQ0FBTyxHQUFHLENBQUMsU0FBUyxDQUFDLFNBQXJCLENBQStCLENBQUMsSUFBaEMsQ0FBcUMsT0FBckM7SUFYK0MsQ0FBakQ7V0FhQSxFQUFBLENBQUcsNERBQUgsRUFBaUUsU0FBQTtBQUMvRCxVQUFBO01BQUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsT0FBekIsQ0FBaUMsaUJBQWpDLEVBQW9ELE9BQXBELEVBQTZEO1FBQzNELGdCQUFBLEVBQWtCLFNBQUMsSUFBRDtpQkFBVSxDQUFDLGtCQUFELEVBQXFCLG1CQUFyQjtRQUFWLENBRHlDO09BQTdEO01BSUEsR0FBQSxHQUFNLGdCQUFnQixDQUFDLGFBQWpCLENBQStCLE1BQS9CO2FBQ04sTUFBQSxDQUFPLEdBQUcsQ0FBQyxTQUFTLENBQUMsU0FBckIsQ0FBK0IsQ0FBQyxJQUFoQyxDQUFxQywrQ0FBckM7SUFOK0QsQ0FBakU7RUF6QjZCLENBQS9CO0FBSEEiLCJzb3VyY2VzQ29udGVudCI6WyJEZWZhdWx0RmlsZUljb25zID0gcmVxdWlyZSAnLi4vbGliL2RlZmF1bHQtZmlsZS1pY29ucydcbkZpbGVJY29ucyA9IHJlcXVpcmUgJy4uL2xpYi9maWxlLWljb25zJ1xuXG5kZXNjcmliZSAnZmlsZSBpY29uIGhhbmRsaW5nJywgLT5cbiAgd29ya3NwYWNlRWxlbWVudCA9IG51bGxcblxuICBiZWZvcmVFYWNoIC0+XG4gICAgd29ya3NwYWNlRWxlbWVudCA9IGF0b20ud29ya3NwYWNlLmdldEVsZW1lbnQoKVxuXG4gICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKCdzYW1wbGUuanMnKVxuXG4gICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICBhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZSgndGFicycpXG5cbiAgaXQgJ2FsbG93cyB0aGUgc2VydmljZSB0byBwcm92aWRlIGljb24gY2xhc3NlcycsIC0+XG4gICAgZmlsZUljb25zRGlzcG9zYWJsZSA9IGF0b20ucGFja2FnZXMuc2VydmljZUh1Yi5wcm92aWRlICdhdG9tLmZpbGUtaWNvbnMnLCAnMS4wLjAnLCB7XG4gICAgICBpY29uQ2xhc3NGb3JQYXRoOiAocGF0aCwgY29udGV4dCkgLT5cbiAgICAgICAgZXhwZWN0KGNvbnRleHQpLnRvQmUoJ3RhYnMnKVxuICAgICAgICAnZmlyc3QtaWNvbi1jbGFzcyBzZWNvbmQtaWNvbi1jbGFzcydcbiAgICB9XG5cbiAgICB0YWIgPSB3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy50YWInKVxuICAgIGV4cGVjdCh0YWIuaXRlbVRpdGxlLmNsYXNzTmFtZSkudG9CZSgndGl0bGUgaWNvbiBmaXJzdC1pY29uLWNsYXNzIHNlY29uZC1pY29uLWNsYXNzJylcblxuICAgIGZpbGVJY29uc0Rpc3Bvc2FibGUuZGlzcG9zZSgpXG4gICAgZXhwZWN0KHRhYi5pdGVtVGl0bGUuY2xhc3NOYW1lKS50b0JlKCd0aXRsZScpXG5cbiAgaXQgJ2FsbG93cyB0aGUgc2VydmljZSB0byBwcm92aWRlIG11bHRpcGxlIGNsYXNzZXMgYXMgYW4gYXJyYXknLCAtPlxuICAgIGF0b20ucGFja2FnZXMuc2VydmljZUh1Yi5wcm92aWRlICdhdG9tLmZpbGUtaWNvbnMnLCAnMS4wLjAnLCB7XG4gICAgICBpY29uQ2xhc3NGb3JQYXRoOiAocGF0aCkgLT4gWydmaXJzdC1pY29uLWNsYXNzJywgJ3NlY29uZC1pY29uLWNsYXNzJ11cbiAgICB9XG5cbiAgICB0YWIgPSB3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy50YWInKVxuICAgIGV4cGVjdCh0YWIuaXRlbVRpdGxlLmNsYXNzTmFtZSkudG9CZSgndGl0bGUgaWNvbiBmaXJzdC1pY29uLWNsYXNzIHNlY29uZC1pY29uLWNsYXNzJylcbiJdfQ==
