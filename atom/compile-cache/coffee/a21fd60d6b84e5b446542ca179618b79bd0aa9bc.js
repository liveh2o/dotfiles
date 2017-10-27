(function() {
  var fs, path, temp;

  path = require('path');

  fs = require('fs-plus');

  temp = require('temp');

  describe('ShowTodo opening panes and executing commands', function() {
    var activationPromise, executeCommand, showTodoModule, workspaceElement, _ref;
    _ref = [], workspaceElement = _ref[0], activationPromise = _ref[1], showTodoModule = _ref[2];
    executeCommand = function(callback) {
      atom.commands.dispatch(workspaceElement, 'todo-show:find-in-project');
      waitsForPromise(function() {
        return activationPromise;
      });
      return runs(function() {
        showTodoModule = atom.packages.loadedPackages['todo-show'].mainModule;
        waitsFor(function() {
          return !showTodoModule.showTodoView.loading;
        });
        return runs(callback);
      });
    };
    beforeEach(function() {
      atom.project.setPaths([path.join(__dirname, 'fixtures/sample1')]);
      workspaceElement = atom.views.getView(atom.workspace);
      jasmine.attachToDOM(workspaceElement);
      return activationPromise = atom.packages.activatePackage('todo-show');
    });
    describe('when the show-todo:find-in-project event is triggered', function() {
      it('attaches and then detaches the pane view', function() {
        expect(atom.packages.loadedPackages['todo-show']).toBeDefined();
        expect(workspaceElement.querySelector('.show-todo-preview')).not.toExist();
        return executeCommand(function() {
          var pane;
          pane = atom.workspace.paneForItem(showTodoModule.showTodoView);
          expect(workspaceElement.querySelector('.show-todo-preview')).toExist();
          expect(pane.parent.orientation).toBe('horizontal');
          return executeCommand(function() {
            return expect(workspaceElement.querySelector('.show-todo-preview')).not.toExist();
          });
        });
      });
      it('can open in vertical split', function() {
        atom.config.set('todo-show.openListInDirection', 'down');
        return executeCommand(function() {
          var pane;
          pane = atom.workspace.paneForItem(showTodoModule.showTodoView);
          expect(workspaceElement.querySelector('.show-todo-preview')).toExist();
          expect(pane.parent.orientation).toBe('vertical');
          return executeCommand(function() {
            return expect(workspaceElement.querySelector('.show-todo-preview')).not.toExist();
          });
        });
      });
      return it('can open ontop of current view', function() {
        atom.config.set('todo-show.openListInDirection', 'ontop');
        return executeCommand(function() {
          var pane;
          pane = atom.workspace.paneForItem(showTodoModule.showTodoView);
          expect(workspaceElement.querySelector('.show-todo-preview')).toExist();
          return expect(pane.parent.orientation).not.toExist();
        });
      });
    });
    describe('when config changes', function() {
      var configPaths, configRegexes;
      configRegexes = 'todo-show.findTheseRegexes';
      configPaths = 'todo-show.ignoreThesePaths';
      beforeEach(function() {
        return executeCommand(function() {});
      });
      it('has default configs set', function() {
        var defaultPaths, defaultRegexes;
        defaultRegexes = atom.config.get(configRegexes);
        expect(defaultRegexes).toBeDefined();
        expect(defaultRegexes.length).toBeGreaterThan(3);
        defaultPaths = atom.config.get(configPaths);
        expect(defaultPaths).toBeDefined();
        return expect(defaultPaths.length).toBeGreaterThan(2);
      });
      return it('should be able to override defaults', function() {
        var newPaths, newRegexes;
        newRegexes = ['New Regex', '/ReGeX/g'];
        atom.config.set(configRegexes, newRegexes);
        expect(atom.config.get(configRegexes)).toEqual(newRegexes);
        newPaths = ['/foobar/'];
        atom.config.set(configPaths, newPaths);
        return expect(atom.config.get(configPaths)).toEqual(newPaths);
      });
    });
    describe('when save-as button is clicked', function() {
      return it('saves the list in markdown and opens it', function() {
        var expectedFilePath, expectedOutput, outputPath;
        outputPath = temp.path({
          suffix: '.md'
        });
        expectedFilePath = atom.project.getDirectories()[0].resolve('../saved-output.md');
        expectedOutput = fs.readFileSync(expectedFilePath).toString();
        expect(fs.isFileSync(outputPath)).toBe(false);
        executeCommand(function() {
          spyOn(atom, 'showSaveDialogSync').andReturn(outputPath);
          return workspaceElement.querySelector('.show-todo-preview .todo-save-as').click();
        });
        waitsFor(function() {
          var _ref1;
          return fs.existsSync(outputPath) && ((_ref1 = atom.workspace.getActiveTextEditor()) != null ? _ref1.getPath() : void 0) === fs.realpathSync(outputPath);
        });
        return runs(function() {
          expect(fs.isFileSync(outputPath)).toBe(true);
          return expect(atom.workspace.getActiveTextEditor().getText()).toBe(expectedOutput);
        });
      });
    });
    describe('when core:refresh is triggered', function() {
      return it('refreshes the list', function() {
        return executeCommand(function() {
          atom.commands.dispatch(workspaceElement.querySelector('.show-todo-preview'), 'core:refresh');
          expect(showTodoModule.showTodoView.loading).toBe(true);
          waitsFor(function() {
            return !showTodoModule.showTodoView.loading;
          });
          return runs(function() {
            return expect(showTodoModule.showTodoView.loading).toBe(false);
          });
        });
      });
    });
    return describe('when the show-todo:find-in-open-files event is triggered', function() {
      beforeEach(function() {
        atom.commands.dispatch(workspaceElement, 'todo-show:find-in-open-files');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          showTodoModule = atom.packages.loadedPackages['todo-show'].mainModule;
          return waitsFor(function() {
            return !showTodoModule.showTodoView.loading;
          });
        });
      });
      it('does not show any results with no open files', function() {
        return expect(showTodoModule.showTodoView.regexes.length).toBe(0);
      });
      return it('only shows todos from open files', function() {
        waitsForPromise(function() {
          return atom.workspace.open('sample.c');
        });
        return runs(function() {
          atom.commands.dispatch(workspaceElement.querySelector('.show-todo-preview'), 'core:refresh');
          waitsFor(function() {
            return !showTodoModule.showTodoView.loading;
          });
          return runs(function() {
            var todoRegex;
            todoRegex = showTodoModule.showTodoView.regexes[0];
            expect(todoRegex.title).toBe('TODOs');
            expect(todoRegex.results.length).toBe(1);
            expect(todoRegex.results[0].matches.length).toBe(1);
            return expect(todoRegex.results[0].matches[0].matchText).toBe('Comment in C');
          });
        });
      });
    });
  });

}).call(this);
