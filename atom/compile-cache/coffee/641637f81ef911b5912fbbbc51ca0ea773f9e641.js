(function() {
  var BlameViewController, GitBlame, configProject, fs, path, temp;

  path = require('path');

  temp = require('temp');

  fs = require('fs-plus');

  GitBlame = require('../lib/git-blame');

  BlameViewController = require('../lib/controllers/blameViewController');

  configProject = function(projectPath) {
    var tempPath;
    tempPath = temp.mkdirSync(path.basename(projectPath));
    fs.copySync(projectPath, tempPath);
    if (fs.existsSync(path.join(tempPath, 'git.git'))) {
      fs.renameSync(path.join(tempPath, 'git.git'), path.join(tempPath, '.git'));
    }
    return tempPath;
  };

  describe("git-blame", function() {
    beforeEach(function() {
      atom.packages.activatePackage('git-blame');
      return spyOn(BlameViewController, 'toggleBlame');
    });
    describe("when a single git root folder is loaded", function() {
      return it('should toggle blame with the associated git repo', function() {
        var projectPath, tempPath;
        projectPath = path.join(__dirname, 'fixtures', 'repo1');
        tempPath = configProject(projectPath);
        atom.project.setPaths([tempPath]);
        waitsForPromise(function() {
          return atom.project.open(path.join(tempPath, 'a.txt')).then(function(o) {
            var pane;
            pane = atom.workspace.getActivePane();
            return pane.activateItem(o);
          });
        });
        return runs(function() {
          var workspaceElement;
          workspaceElement = atom.views.getView(atom.workspace);
          waitsForPromise(function() {
            return GitBlame.toggleBlame();
          });
          return runs(function() {
            var blamer, expectedGitPath;
            expect(BlameViewController.toggleBlame).toHaveBeenCalled();
            blamer = BlameViewController.toggleBlame.calls[0].args[0];
            expectedGitPath = fs.realpathSync(path.join(tempPath, '.git'));
            return expect(blamer.repo.path).toEqual(expectedGitPath);
          });
        });
      });
    });
    describe("when multiple git root folders are loaded", function() {
      return it('should toggle blame with the associated git repo', function() {
        var projectPath1, projectPath2, tempPath1, tempPath2;
        projectPath1 = path.join(__dirname, 'fixtures', 'repo1');
        tempPath1 = configProject(projectPath1);
        projectPath2 = path.join(__dirname, 'fixtures', 'repo2');
        tempPath2 = configProject(projectPath2);
        atom.project.setPaths([tempPath2, tempPath1]);
        waitsForPromise(function() {
          return atom.project.open(path.join(tempPath1, 'a.txt')).then(function(o) {
            var pane;
            pane = atom.workspace.getActivePane();
            return pane.activateItem(o);
          });
        });
        return runs(function() {
          var workspaceElement;
          workspaceElement = atom.views.getView(atom.workspace);
          waitsForPromise(function() {
            return GitBlame.toggleBlame();
          });
          return runs(function() {
            var blamer, expectedGitPath;
            expect(BlameViewController.toggleBlame).toHaveBeenCalled();
            blamer = BlameViewController.toggleBlame.calls[0].args[0];
            expectedGitPath = fs.realpathSync(path.join(tempPath1, '.git'));
            return expect(blamer.repo.path).toEqual(expectedGitPath);
          });
        });
      });
    });
    return describe("when zero git root folders are active", function() {
      return it('should not toggle blame', function() {
        var projectPath, tempPath;
        projectPath = path.join(__dirname, 'fixtures', 'non-git');
        tempPath = configProject(projectPath);
        atom.project.setPaths([tempPath]);
        waitsForPromise(function() {
          return atom.project.open(path.join(tempPath, 'test.txt')).then(function(o) {
            var pane;
            pane = atom.workspace.getActivePane();
            return pane.activateItem(o);
          });
        });
        return runs(function() {
          var workspaceElement;
          workspaceElement = atom.views.getView(atom.workspace);
          waitsForPromise(function() {
            return GitBlame.toggleBlame();
          });
          return runs(function() {
            return expect(BlameViewController.toggleBlame).not.toHaveBeenCalled();
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2dpdC1ibGFtZS9zcGVjL2dpdC1ibGFtZS1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSw0REFBQTs7QUFBQSxFQUFBLElBQUEsR0FBNEIsT0FBQSxDQUFRLE1BQVIsQ0FBNUIsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBNEIsT0FBQSxDQUFRLE1BQVIsQ0FENUIsQ0FBQTs7QUFBQSxFQUVBLEVBQUEsR0FBNEIsT0FBQSxDQUFRLFNBQVIsQ0FGNUIsQ0FBQTs7QUFBQSxFQUdBLFFBQUEsR0FBNEIsT0FBQSxDQUFRLGtCQUFSLENBSDVCLENBQUE7O0FBQUEsRUFJQSxtQkFBQSxHQUE0QixPQUFBLENBQVEsd0NBQVIsQ0FKNUIsQ0FBQTs7QUFBQSxFQU9BLGFBQUEsR0FBZ0IsU0FBQyxXQUFELEdBQUE7QUFDWixRQUFBLFFBQUE7QUFBQSxJQUFBLFFBQUEsR0FBVyxJQUFJLENBQUMsU0FBTCxDQUFlLElBQUksQ0FBQyxRQUFMLENBQWMsV0FBZCxDQUFmLENBQVgsQ0FBQTtBQUFBLElBQ0EsRUFBRSxDQUFDLFFBQUgsQ0FBWSxXQUFaLEVBQXlCLFFBQXpCLENBREEsQ0FBQTtBQUdBLElBQUEsSUFBRyxFQUFFLENBQUMsVUFBSCxDQUFjLElBQUksQ0FBQyxJQUFMLENBQVUsUUFBVixFQUFvQixTQUFwQixDQUFkLENBQUg7QUFDRSxNQUFBLEVBQUUsQ0FBQyxVQUFILENBQWMsSUFBSSxDQUFDLElBQUwsQ0FBVSxRQUFWLEVBQW9CLFNBQXBCLENBQWQsRUFBOEMsSUFBSSxDQUFDLElBQUwsQ0FBVSxRQUFWLEVBQW9CLE1BQXBCLENBQTlDLENBQUEsQ0FERjtLQUhBO0FBTUEsV0FBTyxRQUFQLENBUFk7RUFBQSxDQVBoQixDQUFBOztBQUFBLEVBZ0JBLFFBQUEsQ0FBUyxX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

//# sourceURL=/Users/ah/.atom/packages/git-blame/spec/git-blame-spec.coffee
