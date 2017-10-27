(function() {
  var fs, path, temp;

  path = require('path');

  fs = require('fs-plus');

  temp = require('temp');

  describe('ShowTodo opening panes and executing commands', function() {
    var activationPromise, executeCommand, showTodoModule, showTodoPane, workspaceElement, _ref;
    _ref = [], workspaceElement = _ref[0], activationPromise = _ref[1], showTodoModule = _ref[2], showTodoPane = _ref[3];
    executeCommand = function(callback) {
      var wasVisible;
      wasVisible = showTodoModule != null ? showTodoModule.showTodoView.isVisible() : void 0;
      atom.commands.dispatch(workspaceElement, 'todo-show:find-in-workspace');
      waitsForPromise(function() {
        return activationPromise;
      });
      return runs(function() {
        waitsFor(function() {
          if (wasVisible) {
            return !showTodoModule.showTodoView.isVisible();
          }
          return !showTodoModule.showTodoView.isSearching() && showTodoModule.showTodoView.isVisible();
        });
        return runs(function() {
          showTodoPane = atom.workspace.paneForItem(showTodoModule.showTodoView);
          return callback();
        });
      });
    };
    beforeEach(function() {
      atom.project.setPaths([path.join(__dirname, 'fixtures/sample1')]);
      workspaceElement = atom.views.getView(atom.workspace);
      jasmine.attachToDOM(workspaceElement);
      return activationPromise = atom.packages.activatePackage('todo-show').then(function(opts) {
        return showTodoModule = opts.mainModule;
      });
    });
    describe('when the show-todo:find-in-workspace event is triggered', function() {
      it('attaches and then detaches the pane view', function() {
        expect(atom.packages.loadedPackages['todo-show']).toBeDefined();
        expect(workspaceElement.querySelector('.show-todo-preview')).not.toExist();
        return executeCommand(function() {
          expect(workspaceElement.querySelector('.show-todo-preview')).toExist();
          expect(showTodoPane.parent.orientation).toBe('horizontal');
          return executeCommand(function() {
            return expect(workspaceElement.querySelector('.show-todo-preview')).not.toExist();
          });
        });
      });
      it('can open in vertical split', function() {
        atom.config.set('todo-show.openListInDirection', 'down');
        return executeCommand(function() {
          expect(workspaceElement.querySelector('.show-todo-preview')).toExist();
          return expect(showTodoPane.parent.orientation).toBe('vertical');
        });
      });
      it('can open ontop of current view', function() {
        atom.config.set('todo-show.openListInDirection', 'ontop');
        return executeCommand(function() {
          expect(workspaceElement.querySelector('.show-todo-preview')).toExist();
          return expect(showTodoPane.parent.orientation).not.toExist();
        });
      });
      it('has visible elements in view', function() {
        return executeCommand(function() {
          var element;
          element = showTodoModule.showTodoView.find('td').last();
          expect(element.text()).toEqual('sample.js');
          return expect(element.isVisible()).toBe(true);
        });
      });
      it('persists pane width', function() {
        return executeCommand(function() {
          var newFlex, originalFlex;
          originalFlex = showTodoPane.getFlexScale();
          newFlex = originalFlex * 1.1;
          expect(typeof originalFlex).toEqual("number");
          expect(showTodoModule.showTodoView).toBeVisible();
          showTodoPane.setFlexScale(newFlex);
          return executeCommand(function() {
            expect(showTodoPane).not.toExist();
            expect(showTodoModule.showTodoView).not.toBeVisible();
            return executeCommand(function() {
              expect(showTodoPane.getFlexScale()).toEqual(newFlex);
              return showTodoPane.setFlexScale(originalFlex);
            });
          });
        });
      });
      it('does not persist pane width if asked not to', function() {
        atom.config.set('todo-show.rememberViewSize', false);
        return executeCommand(function() {
          var newFlex, originalFlex;
          originalFlex = showTodoPane.getFlexScale();
          newFlex = originalFlex * 1.1;
          expect(typeof originalFlex).toEqual("number");
          showTodoPane.setFlexScale(newFlex);
          return executeCommand(function() {
            return executeCommand(function() {
              expect(showTodoPane.getFlexScale()).not.toEqual(newFlex);
              return expect(showTodoPane.getFlexScale()).toEqual(originalFlex);
            });
          });
        });
      });
      return it('persists horizontal pane height', function() {
        atom.config.set('todo-show.openListInDirection', 'down');
        return executeCommand(function() {
          var newFlex, originalFlex;
          originalFlex = showTodoPane.getFlexScale();
          newFlex = originalFlex * 1.1;
          expect(typeof originalFlex).toEqual("number");
          showTodoPane.setFlexScale(newFlex);
          return executeCommand(function() {
            expect(showTodoPane).not.toExist();
            return executeCommand(function() {
              expect(showTodoPane.getFlexScale()).toEqual(newFlex);
              return showTodoPane.setFlexScale(originalFlex);
            });
          });
        });
      });
    });
    describe('when the show-todo:find-in-workspace event is triggered', function() {
      return it('activates', function() {
        expect(atom.packages.loadedPackages['todo-show']).toBeDefined();
        return expect(workspaceElement.querySelector('.show-todo-preview')).not.toExist();
      });
    });
    describe('when todo item is clicked', function() {
      it('opens the file', function() {
        return executeCommand(function() {
          var element, item;
          element = showTodoModule.showTodoView.find('td').last();
          item = atom.workspace.getActivePaneItem();
          expect(item).not.toBeDefined();
          element.click();
          waitsFor(function() {
            return item = atom.workspace.getActivePaneItem();
          });
          return runs(function() {
            return expect(item.getTitle()).toBe('sample.js');
          });
        });
      });
      return it('opens file other project', function() {
        atom.project.addPath(path.join(__dirname, 'fixtures/sample2'));
        return executeCommand(function() {
          var element, item;
          element = showTodoModule.showTodoView.find('td')[3];
          item = atom.workspace.getActivePaneItem();
          expect(item).not.toBeDefined();
          element.click();
          waitsFor(function() {
            return item = atom.workspace.getActivePaneItem();
          });
          return runs(function() {
            return expect(item.getTitle()).toBe('sample.txt');
          });
        });
      });
    });
    describe('when save-as button is clicked', function() {
      it('saves the list in markdown and opens it', function() {
        var expectedFilePath, expectedOutput, outputPath;
        outputPath = temp.path({
          suffix: '.md'
        });
        expectedFilePath = atom.project.getDirectories()[0].resolve('../saved-output.md');
        expectedOutput = fs.readFileSync(expectedFilePath).toString();
        atom.config.set('todo-show.sortBy', 'Type');
        expect(fs.isFileSync(outputPath)).toBe(false);
        executeCommand(function() {
          spyOn(atom, 'showSaveDialogSync').andReturn(outputPath);
          return showTodoModule.showTodoView.saveAs();
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
      return it('saves another list sorted differently in markdown', function() {
        var outputPath;
        outputPath = temp.path({
          suffix: '.md'
        });
        atom.config.set('todo-show.findTheseTodos', ['TODO']);
        atom.config.set('todo-show.showInTable', ['Text', 'Type', 'File', 'Line']);
        atom.config.set('todo-show.sortBy', 'File');
        expect(fs.isFileSync(outputPath)).toBe(false);
        executeCommand(function() {
          spyOn(atom, 'showSaveDialogSync').andReturn(outputPath);
          return showTodoModule.showTodoView.saveAs();
        });
        waitsFor(function() {
          var _ref1;
          return fs.existsSync(outputPath) && ((_ref1 = atom.workspace.getActiveTextEditor()) != null ? _ref1.getPath() : void 0) === fs.realpathSync(outputPath);
        });
        return runs(function() {
          expect(fs.isFileSync(outputPath)).toBe(true);
          return expect(atom.workspace.getActiveTextEditor().getText()).toBe("- Comment in C __TODO__ [sample.c](sample.c) _:5_\n- This is the first todo __TODO__ [sample.js](sample.js) _:3_\n- This is the second todo __TODO__ [sample.js](sample.js) _:20_\n");
        });
      });
    });
    describe('when core:refresh is triggered', function() {
      return it('refreshes the list', function() {
        return executeCommand(function() {
          atom.commands.dispatch(workspaceElement.querySelector('.show-todo-preview'), 'core:refresh');
          expect(showTodoModule.showTodoView.isSearching()).toBe(true);
          expect(showTodoModule.showTodoView.find('.markdown-spinner')).toBeVisible();
          waitsFor(function() {
            return !showTodoModule.showTodoView.isSearching();
          });
          return runs(function() {
            expect(showTodoModule.showTodoView.find('.markdown-spinner')).not.toBeVisible();
            return expect(showTodoModule.showTodoView.isSearching()).toBe(false);
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
          return waitsFor(function() {
            return !showTodoModule.showTodoView.isSearching() && showTodoModule.showTodoView.isVisible();
          });
        });
      });
      it('does not show any results with no open files', function() {
        var element;
        element = showTodoModule.showTodoView.find('p').last();
        expect(showTodoModule.showTodoView.getTodos()).toHaveLength(0);
        expect(element.text()).toContain('No results...');
        return expect(element.isVisible()).toBe(true);
      });
      return it('only shows todos from open files', function() {
        waitsForPromise(function() {
          return atom.workspace.open('sample.c');
        });
        waitsFor(function() {
          return !showTodoModule.showTodoView.isSearching();
        });
        return runs(function() {
          var todos;
          todos = showTodoModule.showTodoView.getTodos();
          expect(todos).toHaveLength(1);
          expect(todos[0].type).toBe('TODO');
          expect(todos[0].text).toBe('Comment in C');
          return expect(todos[0].file).toBe('sample.c');
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RvZG8tc2hvdy9zcGVjL3Nob3ctdG9kby1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxjQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUNBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUixDQURMLENBQUE7O0FBQUEsRUFFQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FGUCxDQUFBOztBQUFBLEVBSUEsUUFBQSxDQUFTLCtDQUFULEVBQTBELFNBQUEsR0FBQTtBQUN4RCxRQUFBLHVGQUFBO0FBQUEsSUFBQSxPQUFzRSxFQUF0RSxFQUFDLDBCQUFELEVBQW1CLDJCQUFuQixFQUFzQyx3QkFBdEMsRUFBc0Qsc0JBQXRELENBQUE7QUFBQSxJQUlBLGNBQUEsR0FBaUIsU0FBQyxRQUFELEdBQUE7QUFDZixVQUFBLFVBQUE7QUFBQSxNQUFBLFVBQUEsNEJBQWEsY0FBYyxDQUFFLFlBQVksQ0FBQyxTQUE3QixDQUFBLFVBQWIsQ0FBQTtBQUFBLE1BQ0EsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLGdCQUF2QixFQUF5Qyw2QkFBekMsQ0FEQSxDQUFBO0FBQUEsTUFFQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUFHLGtCQUFIO01BQUEsQ0FBaEIsQ0FGQSxDQUFBO2FBR0EsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUNILFFBQUEsUUFBQSxDQUFTLFNBQUEsR0FBQTtBQUNQLFVBQUEsSUFBbUQsVUFBbkQ7QUFBQSxtQkFBTyxDQUFBLGNBQWUsQ0FBQyxZQUFZLENBQUMsU0FBNUIsQ0FBQSxDQUFSLENBQUE7V0FBQTtpQkFDQSxDQUFBLGNBQWUsQ0FBQyxZQUFZLENBQUMsV0FBNUIsQ0FBQSxDQUFELElB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

//# sourceURL=/Users/ah/.atom/packages/todo-show/spec/show-todo-spec.coffee
