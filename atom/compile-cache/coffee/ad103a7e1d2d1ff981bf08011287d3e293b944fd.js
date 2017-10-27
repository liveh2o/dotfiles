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
          return expect(pane.parent.orientation).toBe('vertical');
        });
      });
      it('can open ontop of current view', function() {
        atom.config.set('todo-show.openListInDirection', 'ontop');
        return executeCommand(function() {
          var pane;
          pane = atom.workspace.paneForItem(showTodoModule.showTodoView);
          expect(workspaceElement.querySelector('.show-todo-preview')).toExist();
          return expect(pane.parent.orientation).not.toExist();
        });
      });
      it('has visible elements in view', function() {
        return executeCommand(function() {
          var element;
          element = showTodoModule.showTodoView.find('a').last();
          expect(element.text()).toEqual('sample.js');
          return expect(element.isVisible()).toBe(true);
        });
      });
      it('persists pane width', function() {
        return executeCommand(function() {
          var newFlex, originalFlex, pane;
          pane = atom.workspace.paneForItem(showTodoModule.showTodoView);
          originalFlex = pane.getFlexScale();
          newFlex = originalFlex * 1.1;
          expect(typeof originalFlex).toEqual("number");
          pane.setFlexScale(newFlex);
          return executeCommand(function() {
            pane = atom.workspace.paneForItem(showTodoModule.showTodoView);
            expect(pane).not.toExist();
            return executeCommand(function() {
              pane = atom.workspace.paneForItem(showTodoModule.showTodoView);
              expect(pane.getFlexScale()).toEqual(newFlex);
              return pane.setFlexScale(originalFlex);
            });
          });
        });
      });
      it('does not persist pane width if asked not to', function() {
        atom.config.set('todo-show.rememberViewSize', false);
        return executeCommand(function() {
          var newFlex, originalFlex, pane;
          pane = atom.workspace.paneForItem(showTodoModule.showTodoView);
          originalFlex = pane.getFlexScale();
          newFlex = originalFlex * 1.1;
          expect(typeof originalFlex).toEqual("number");
          pane.setFlexScale(newFlex);
          return executeCommand(function() {
            return executeCommand(function() {
              pane = atom.workspace.paneForItem(showTodoModule.showTodoView);
              expect(pane.getFlexScale()).not.toEqual(newFlex);
              return expect(pane.getFlexScale()).toEqual(originalFlex);
            });
          });
        });
      });
      it('persists horizontal pane height', function() {
        atom.config.set('todo-show.openListInDirection', 'down');
        return executeCommand(function() {
          var newFlex, originalFlex, pane;
          pane = atom.workspace.paneForItem(showTodoModule.showTodoView);
          originalFlex = pane.getFlexScale();
          newFlex = originalFlex * 1.1;
          expect(typeof originalFlex).toEqual("number");
          pane.setFlexScale(newFlex);
          return executeCommand(function() {
            pane = atom.workspace.paneForItem(showTodoModule.showTodoView);
            expect(pane).not.toExist();
            return executeCommand(function() {
              pane = atom.workspace.paneForItem(showTodoModule.showTodoView);
              expect(pane.getFlexScale()).toEqual(newFlex);
              return pane.setFlexScale(originalFlex);
            });
          });
        });
      });
      it('groups matches by regex titles', function() {
        return executeCommand(function() {
          var headers;
          headers = showTodoModule.showTodoView.find('h1');
          expect(headers).toHaveLength(8);
          expect(headers.eq(0).text().split(' ')[0]).toBe('FIXMEs');
          expect(headers.eq(1).text().split(' ')[0]).toBe('TODOs');
          return expect(headers.eq(7).text().split(' ')[0]).toBe('REVIEWs');
        });
      });
      it('can group matches by filename', function() {
        atom.config.set('todo-show.groupMatchesBy', 'file');
        return executeCommand(function() {
          var headers, t1, t2;
          headers = showTodoModule.showTodoView.find('h1');
          expect(headers).toHaveLength(2);
          expect(headers.eq(0).text().split(' ')[0]).toBe('sample.c');
          expect(headers.eq(1).text().split(' ')[0]).toBe('sample.js');
          t1 = showTodoModule.showTodoView.find('table').eq(0).find('td').first().text();
          t2 = showTodoModule.showTodoView.find('table').eq(1).find('td').first().text();
          expect(t1).toBe('Comment in C');
          return expect(t2).toBe('Add more annnotations :)');
        });
      });
      return it('can group matches by text (no grouping)', function() {
        atom.config.set('todo-show.groupMatchesBy', 'none');
        return executeCommand(function() {
          var t1, t2;
          expect(showTodoModule.showTodoView.find('h1')).toHaveLength(1);
          expect(showTodoModule.showTodoView.find('table')).toHaveLength(1);
          t1 = showTodoModule.showTodoView.find('td').eq(0).text();
          t2 = showTodoModule.showTodoView.find('td').eq(-2).text();
          expect(t1).toBe('Add more annnotations :) (FIXMEs)');
          return expect(t2.substring(0, 3)).toBe('two');
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
      return it('saves the list in markdown grouped by filename', function() {
        var expectedFilePath, expectedOutput, outputPath;
        outputPath = temp.path({
          suffix: '.md'
        });
        expectedFilePath = atom.project.getDirectories()[0].resolve('../saved-output-grouped.md');
        expectedOutput = fs.readFileSync(expectedFilePath).toString();
        atom.config.set('todo-show.findTheseRegexes', ['TODOs', '/\\b@?TODO:?\\s(.+$)/g']);
        atom.config.set('todo-show.groupMatchesBy', 'file');
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
        var element;
        element = showTodoModule.showTodoView.find('h1').last();
        expect(showTodoModule.showTodoView.matches.length).toBe(0);
        expect(element.text()).toContain('No results');
        return expect(element.isVisible()).toBe(true);
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
            var todoMatch;
            todoMatch = showTodoModule.showTodoView.matches[0];
            expect(showTodoModule.showTodoView.matches).toHaveLength(1);
            expect(todoMatch.title).toBe('TODOs');
            expect(todoMatch.matchText).toBe('Comment in C');
            return expect(todoMatch.relativePath).toBe('sample.c');
          });
        });
      });
    });
  });

}).call(this);
