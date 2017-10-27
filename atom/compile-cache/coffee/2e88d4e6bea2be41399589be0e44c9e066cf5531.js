(function() {
  describe('Commands', function() {
    var linter;
    linter = null;
    beforeEach(function() {
      return waitsForPromise(function() {
        return atom.packages.activatePackage('linter').then(function() {
          return linter = atom.packages.getActivePackage('linter').mainModule.instance;
        });
      });
    });
    describe('linter:togglePanel', function() {
      return it('toggles the panel visibility', function() {
        var visibility;
        visibility = linter.views.panel.getVisibility();
        linter.commands.togglePanel();
        expect(linter.views.panel.getVisibility()).toBe(!visibility);
        linter.commands.togglePanel();
        return expect(linter.views.panel.getVisibility()).toBe(visibility);
      });
    });
    return describe('linter:toggle', function() {
      return it('relint when enabled', function() {
        return waitsForPromise(function() {
          return atom.workspace.open(__dirname + '/fixtures/file.txt').then(function() {
            spyOn(linter.commands, 'lint');
            linter.commands.toggleLinter();
            linter.commands.toggleLinter();
            return expect(linter.commands.lint).toHaveBeenCalled();
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9zcGVjL2NvbW1hbmRzLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLFFBQUEsQ0FBUyxVQUFULEVBQXFCLFNBQUEsR0FBQTtBQUNuQixRQUFBLE1BQUE7QUFBQSxJQUFBLE1BQUEsR0FBUyxJQUFULENBQUE7QUFBQSxJQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7YUFDVCxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUNkLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixRQUE5QixDQUF1QyxDQUFDLElBQXhDLENBQTZDLFNBQUEsR0FBQTtpQkFDM0MsTUFBQSxHQUFTLElBQUksQ0FBQyxRQUFRLENBQUMsZ0JBQWQsQ0FBK0IsUUFBL0IsQ0FBd0MsQ0FBQyxVQUFVLENBQUMsU0FEbEI7UUFBQSxDQUE3QyxFQURjO01BQUEsQ0FBaEIsRUFEUztJQUFBLENBQVgsQ0FGQSxDQUFBO0FBQUEsSUFPQSxRQUFBLENBQVMsb0JBQVQsRUFBK0IsU0FBQSxHQUFBO2FBQzdCLEVBQUEsQ0FBRyw4QkFBSCxFQUFtQyxTQUFBLEdBQUE7QUFDakMsWUFBQSxVQUFBO0FBQUEsUUFBQSxVQUFBLEdBQWEsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsYUFBbkIsQ0FBQSxDQUFiLENBQUE7QUFBQSxRQUNBLE1BQU0sQ0FBQyxRQUFRLENBQUMsV0FBaEIsQ0FBQSxDQURBLENBQUE7QUFBQSxRQUVBLE1BQUEsQ0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxhQUFuQixDQUFBLENBQVAsQ0FBMEMsQ0FBQyxJQUEzQyxDQUFnRCxDQUFBLFVBQWhELENBRkEsQ0FBQTtBQUFBLFFBR0EsTUFBTSxDQUFDLFFBQVEsQ0FBQyxXQUFoQixDQUFBLENBSEEsQ0FBQTtlQUlBLE1BQUEsQ0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxhQUFuQixDQUFBLENBQVAsQ0FBMEMsQ0FBQyxJQUEzQyxDQUFnRCxVQUFoRCxFQUxpQztNQUFBLENBQW5DLEVBRDZCO0lBQUEsQ0FBL0IsQ0FQQSxDQUFBO1dBZUEsUUFBQSxDQUFTLGVBQVQsRUFBMEIsU0FBQSxHQUFBO2FBQ3hCLEVBQUEsQ0FBRyxxQkFBSCxFQUEwQixTQUFBLEdBQUE7ZUFDeEIsZUFBQSxDQUFnQixTQUFBLEdBQUE7aUJBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLFNBQUEsR0FBWSxvQkFBaEMsQ0FBcUQsQ0FBQyxJQUF0RCxDQUEyRCxTQUFBLEdBQUE7QUFDekQsWUFBQSxLQUFBLENBQU0sTUFBTSxDQUFDLFFBQWIsRUFBdUIsTUFBdkIsQ0FBQSxDQUFBO0FBQUEsWUFDQSxNQUFNLENBQUMsUUFBUSxDQUFDLFlBQWhCLENBQUEsQ0FEQSxDQUFBO0FBQUEsWUFFQSxNQUFNLENBQUMsUUFBUSxDQUFDLFlBQWhCLENBQUEsQ0FGQSxDQUFBO21CQUdBLE1BQUEsQ0FBTyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQXZCLENBQTRCLENBQUMsZ0JBQTdCLENBQUEsRUFKeUQ7VUFBQSxDQUEzRCxFQURjO1FBQUEsQ0FBaEIsRUFEd0I7TUFBQSxDQUExQixFQUR3QjtJQUFBLENBQTFCLEVBaEJtQjtFQUFBLENBQXJCLENBQUEsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/ah/.atom/packages/linter/spec/commands-spec.coffee
