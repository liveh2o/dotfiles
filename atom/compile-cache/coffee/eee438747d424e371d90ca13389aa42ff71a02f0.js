(function() {
  var fs, nTodos, path, temp;

  path = require('path');

  fs = require('fs-plus');

  temp = require('temp');

  nTodos = 28;

  describe('ShowTodo opening panes and executing commands', function() {
    var activationPromise, executeCommand, ref, showTodoModule, showTodoPane, workspaceElement;
    ref = [], workspaceElement = ref[0], activationPromise = ref[1], showTodoModule = ref[2], showTodoPane = ref[3];
    executeCommand = function(callback) {
      var ref1, wasVisible;
      wasVisible = showTodoModule != null ? (ref1 = showTodoModule.showTodoView) != null ? ref1.isVisible() : void 0 : void 0;
      atom.commands.dispatch(workspaceElement, 'todo-show:find-in-workspace');
      waitsForPromise(function() {
        return activationPromise;
      });
      return runs(function() {
        waitsFor(function() {
          var ref2;
          if (wasVisible) {
            return !((ref2 = showTodoModule.showTodoView) != null ? ref2.isVisible() : void 0);
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
    describe('when the todo-show:find-in-workspace event is triggered', function() {
      it('attaches and toggles the pane view in dock', function() {
        var dock;
        dock = atom.workspace.getRightDock();
        expect(atom.packages.loadedPackages['todo-show']).toBeDefined();
        expect(workspaceElement.querySelector('.show-todo-preview')).not.toExist();
        expect(dock.isVisible()).toBe(false);
        return executeCommand(function() {
          expect(workspaceElement.querySelector('.show-todo-preview')).toExist();
          expect(dock.isVisible()).toBe(true);
          expect(dock.getActivePaneItem()).toBe(showTodoModule != null ? showTodoModule.showTodoView : void 0);
          return executeCommand(function() {
            return expect(dock.isVisible()).toBe(false);
          });
        });
      });
      it('activates', function() {
        expect(atom.packages.loadedPackages['todo-show']).toBeDefined();
        return expect(workspaceElement.querySelector('.show-todo-preview')).not.toExist();
      });
      return it('does not search when not visible', function() {
        var dock;
        dock = atom.workspace.getRightDock();
        return executeCommand(function() {
          waitsFor(function() {
            return showTodoModule.collection.getTodosCount() > 0;
          });
          return runs(function() {
            var editor;
            expect(dock.isVisible()).toBe(true);
            expect(showTodoModule.collection.getTodosCount()).toBe(nTodos);
            editor = void 0;
            atom.workspace.open('sample.js');
            waitsFor(function() {
              return editor = atom.workspace.getActiveTextEditor();
            });
            return runs(function() {
              var prevText;
              prevText = editor.getText();
              editor.insertText('TODO: This is an inserted todo');
              waitsForPromise(function() {
                return editor.save();
              });
              return runs(function() {
                expect(showTodoModule.showTodoView.isSearching()).toBe(true);
                waitsFor(function() {
                  return showTodoModule.collection.getTodosCount() > 0;
                });
                return runs(function() {
                  expect(showTodoModule.collection.getTodosCount()).toBe(nTodos + 1);
                  return executeCommand(function() {
                    editor.setText(prevText);
                    waitsForPromise(function() {
                      return editor.save();
                    });
                    return runs(function() {
                      expect(showTodoModule.showTodoView).not.toBeDefined();
                      expect(showTodoModule.collection.getTodosCount()).toBe(nTodos + 1);
                      dock.show();
                      waitsForPromise(function() {
                        return editor.save();
                      });
                      return runs(function() {
                        waitsFor(function() {
                          return showTodoModule.collection.getTodosCount() > 0;
                        });
                        return runs(function() {
                          return expect(showTodoModule.collection.getTodosCount()).toBe(nTodos);
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
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
          var ref1;
          return fs.existsSync(outputPath) && ((ref1 = atom.workspace.getActiveTextEditor()) != null ? ref1.getPath() : void 0) === outputPath;
        });
        return runs(function() {
          return expect(fs.isFileSync(outputPath)).toBe(true);
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
          var ref1;
          return fs.existsSync(outputPath) && ((ref1 = atom.workspace.getActiveTextEditor()) != null ? ref1.getPath() : void 0) === outputPath;
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
    describe('when the todo-show:find-in-open-files event is triggered', function() {
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
    describe('when the tree view context menu is selected', function() {
      beforeEach(function() {
        atom.commands.dispatch(workspaceElement, 'todo-show:find-in-workspace');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          return waitsFor(function() {
            return !showTodoModule.showTodoView.isSearching() && showTodoModule.showTodoView.isVisible();
          });
        });
      });
      it('searches for todos in the selected folder', function() {
        var event;
        expect(showTodoModule.collection.getTodosCount()).toBe(nTodos);
        event = {
          target: {
            getAttribute: function() {
              return path.join(__dirname, 'fixtures/sample1/sample.c');
            }
          }
        };
        showTodoModule.show(void 0, event);
        waitsFor(function() {
          return !showTodoModule.showTodoView.isSearching();
        });
        return runs(function() {
          expect(showTodoModule.collection.getCustomPath()).toBe('sample.c');
          expect(showTodoModule.collection.scope).toBe('custom');
          return expect(showTodoModule.collection.getTodosCount()).toBe(1);
        });
      });
      return it('handles missing path in event argument', function() {
        var event;
        event = {
          target: {
            getAttribute: function() {
              return void 0;
            }
          }
        };
        showTodoModule.show(void 0, event);
        waitsFor(function() {
          return !showTodoModule.showTodoView.isSearching();
        });
        return runs(function() {
          return expect(showTodoModule.collection.getTodosCount()).toBe(nTodos);
        });
      });
    });
    return describe('status bar indicator', function() {
      var todoIndicatorClass;
      todoIndicatorClass = '.status-bar .todo-status-bar-indicator';
      return it('shows the current number of todos', function() {
        atom.packages.activatePackage('status-bar');
        return executeCommand(function() {
          var indicatorElement;
          expect(workspaceElement.querySelector(todoIndicatorClass)).not.toExist();
          atom.config.set('todo-show.statusBarIndicator', true);
          expect(workspaceElement.querySelector(todoIndicatorClass)).toExist();
          nTodos = showTodoModule.showTodoView.getTodosCount();
          expect(nTodos).not.toBe(0);
          indicatorElement = workspaceElement.querySelector(todoIndicatorClass);
          return expect(indicatorElement.innerText).toBe(nTodos.toString());
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RvZG8tc2hvdy9zcGVjL3RvZG8tc2hvdy1zcGVjLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNQLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUjs7RUFDTCxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBRVAsTUFBQSxHQUFTOztFQUVULFFBQUEsQ0FBUywrQ0FBVCxFQUEwRCxTQUFBO0FBQ3hELFFBQUE7SUFBQSxNQUFzRSxFQUF0RSxFQUFDLHlCQUFELEVBQW1CLDBCQUFuQixFQUFzQyx1QkFBdEMsRUFBc0Q7SUFJdEQsY0FBQSxHQUFpQixTQUFDLFFBQUQ7QUFDZixVQUFBO01BQUEsVUFBQSwrRUFBeUMsQ0FBRSxTQUE5QixDQUFBO01BQ2IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLGdCQUF2QixFQUF5Qyw2QkFBekM7TUFDQSxlQUFBLENBQWdCLFNBQUE7ZUFBRztNQUFILENBQWhCO2FBQ0EsSUFBQSxDQUFLLFNBQUE7UUFDSCxRQUFBLENBQVMsU0FBQTtBQUNQLGNBQUE7VUFBQSxJQUFvRCxVQUFwRDtBQUFBLG1CQUFPLHFEQUE0QixDQUFFLFNBQTdCLENBQUEsWUFBUjs7aUJBQ0EsQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLFdBQTVCLENBQUEsQ0FBRCxJQUErQyxjQUFjLENBQUMsWUFBWSxDQUFDLFNBQTVCLENBQUE7UUFGeEMsQ0FBVDtlQUdBLElBQUEsQ0FBSyxTQUFBO1VBQ0gsWUFBQSxHQUFlLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBZixDQUEyQixjQUFjLENBQUMsWUFBMUM7aUJBQ2YsUUFBQSxDQUFBO1FBRkcsQ0FBTDtNQUpHLENBQUw7SUFKZTtJQVlqQixVQUFBLENBQVcsU0FBQTtNQUNULElBQUksQ0FBQyxPQUFPLENBQUMs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QkFBaEIsRUFBZ0QsSUFBaEQ7VUFDQSxNQUFBLENBQU8sZ0JBQWdCLENBQUMsYUFBakIsQ0FBK0Isa0JBQS9CLENBQVAsQ0FBMEQsQ0FBQyxPQUEzRCxDQUFBO1VBRUEsTUFBQSxHQUFTLGNBQWMsQ0FBQyxZQUFZLENBQUMsYUFBNUIsQ0FBQTtVQUNULE1BQUEsQ0FBTyxNQUFQLENBQWMsQ0FBQyxHQUFHLENBQUMsSUFBbkIsQ0FBd0IsQ0FBeEI7VUFDQSxnQkFBQSxHQUFtQixnQkFBZ0IsQ0FBQyxhQUFqQixDQUErQixrQkFBL0I7aUJBQ25CLE1BQUEsQ0FBTyxnQkFBZ0IsQ0FBQyxTQUF4QixDQUFrQyxDQUFDLElBQW5DLENBQXdDLE1BQU0sQ0FBQyxRQUFQLENBQUEsQ0FBeEM7UUFSYSxDQUFmO01BSHNDLENBQXhDO0lBSCtCLENBQWpDO0VBN053RCxDQUExRDtBQU5BIiwic291cmNlc0NvbnRlbnQiOlsicGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG5mcyA9IHJlcXVpcmUgJ2ZzLXBsdXMnXG50ZW1wID0gcmVxdWlyZSAndGVtcCdcblxublRvZG9zID0gMjhcblxuZGVzY3JpYmUgJ1Nob3dUb2RvIG9wZW5pbmcgcGFuZXMgYW5kIGV4ZWN1dGluZyBjb21tYW5kcycsIC0+XG4gIFt3b3Jrc3BhY2VFbGVtZW50LCBhY3RpdmF0aW9uUHJvbWlzZSwgc2hvd1RvZG9Nb2R1bGUsIHNob3dUb2RvUGFuZV0gPSBbXVxuXG4gICMgTmVlZGVkIHRvIGFjdGl2YXRlIHBhY2thZ2VzIHRoYXQgYXJlIHVzaW5nIGFjdGl2YXRpb25Db21tYW5kc1xuICAjIGFuZCB3YWl0IGZvciBsb2FkaW5nIHRvIHN0b3BcbiAgZXhlY3V0ZUNvbW1hbmQgPSAoY2FsbGJhY2spIC0+XG4gICAgd2FzVmlzaWJsZSA9IHNob3dUb2RvTW9kdWxlPy5zaG93VG9kb1ZpZXc/LmlzVmlzaWJsZSgpXG4gICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh3b3Jrc3BhY2VFbGVtZW50LCAndG9kby1zaG93OmZpbmQtaW4td29ya3NwYWNlJylcbiAgICB3YWl0c0ZvclByb21pc2UgLT4gYWN0aXZhdGlvblByb21pc2VcbiAgICBydW5zIC0+XG4gICAgICB3YWl0c0ZvciAtPlxuICAgICAgICByZXR1cm4gIXNob3dUb2RvTW9kdWxlLnNob3dUb2RvVmlldz8uaXNWaXNpYmxlKCkgaWYgd2FzVmlzaWJsZVxuICAgICAgICAhc2hvd1RvZG9Nb2R1bGUuc2hvd1RvZG9WaWV3LmlzU2VhcmNoaW5nKCkgYW5kIHNob3dUb2RvTW9kdWxlLnNob3dUb2RvVmlldy5pc1Zpc2libGUoKVxuICAgICAgcnVucyAtPlxuICAgICAgICBzaG93VG9kb1BhbmUgPSBhdG9tLndvcmtzcGFjZS5wYW5lRm9ySXRlbShzaG93VG9kb01vZHVsZS5zaG93VG9kb1ZpZXcpXG4gICAgICAgIGNhbGxiYWNrKClcblxuICBiZWZvcmVFYWNoIC0+XG4gICAgYXRvbS5wcm9qZWN0LnNldFBhdGhzIFtwYXRoLmpvaW4oX19kaXJuYW1lLCAnZml4dHVyZXMvc2FtcGxlMScpXVxuICAgIHdvcmtzcGFjZUVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpXG4gICAgamFzbWluZS5hdHRhY2hUb0RPTSh3b3Jrc3BhY2VFbGVtZW50KVxuICAgIGFjdGl2YXRpb25Qcm9taXNlID0gYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoJ3RvZG8tc2hvdycpLnRoZW4gKG9wdHMpIC0+XG4gICAgICBzaG93VG9kb01vZHVsZSA9IG9wdHMubWFpbk1vZHVsZVxuXG4gIGRlc2NyaWJlICd3aGVuIHRoZSB0b2RvLXNob3c6ZmluZC1pbi13b3Jrc3BhY2UgZXZlbnQgaXMgdHJpZ2dlcmVkJywgLT5cbiAgICBpdCAnYXR0YWNoZXMgYW5kIHRvZ2dsZXMgdGhlIHBhbmUgdmlldyBpbiBkb2NrJywgLT5cbiAgICAgIGRvY2sgPSBhdG9tLndvcmtzcGFjZS5nZXRSaWdodERvY2soKVxuICAgICAgZXhwZWN0KGF0b20ucGFja2FnZXMubG9hZGVkUGFja2FnZXNbJ3RvZG8tc2hvdyddKS50b0JlRGVmaW5lZCgpXG4gICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuc2hvdy10b2RvLXByZXZpZXcnKSkubm90LnRvRXhpc3QoKVxuICAgICAgZXhwZWN0KGRvY2suaXNWaXNpYmxlKCkpLnRvQmUgZmFsc2VcblxuICAgICAgIyBvcGVuIHRvZG8tc2hvd1xuICAgICAgZXhlY3V0ZUNvbW1hbmQgLT5cbiAgICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLnNob3ctdG9kby1wcmV2aWV3JykpLnRvRXhpc3QoKVxuICAgICAgICBleHBlY3QoZG9jay5pc1Zpc2libGUoKSkudG9CZSB0cnVlXG4gICAgICAgIGV4cGVjdChkb2NrLmdldEFjdGl2ZVBhbmVJdGVtKCkpLnRvQmUgc2hvd1RvZG9Nb2R1bGU/LnNob3dUb2RvVmlld1xuXG4gICAgICAgICMgY2xvc2UgdG9kby1zaG93IGFnYWluXG4gICAgICAgIGV4ZWN1dGVDb21tYW5kIC0+XG4gICAgICAgICAgZXhwZWN0KGRvY2suaXNWaXNpYmxlKCkpLnRvQmUgZmFsc2VcblxuICAgIGl0ICdhY3RpdmF0ZXMnLCAtPlxuICAgICAgZXhwZWN0KGF0b20ucGFja2FnZXMubG9hZGVkUGFja2FnZXNbJ3RvZG8tc2hvdyddKS50b0JlRGVmaW5lZCgpXG4gICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuc2hvdy10b2RvLXByZXZpZXcnKSkubm90LnRvRXhpc3QoKVxuXG4gICAgaXQgJ2RvZXMgbm90IHNlYXJjaCB3aGVuIG5vdCB2aXNpYmxlJywgLT5cbiAgICAgIGRvY2sgPSBhdG9tLndvcmtzcGFjZS5nZXRSaWdodERvY2soKVxuICAgICAgZXhlY3V0ZUNvbW1hbmQgLT5cbiAgICAgICAgd2FpdHNGb3IgLT4gc2hvd1RvZG9Nb2R1bGUuY29sbGVjdGlvbi5nZXRUb2Rvc0NvdW50KCkgPiAwXG4gICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICBleHBlY3QoZG9jay5pc1Zpc2libGUoKSkudG9CZSB0cnVlXG4gICAgICAgICAgZXhwZWN0KHNob3dUb2RvTW9kdWxlLmNvbGxlY3Rpb24uZ2V0VG9kb3NDb3VudCgpKS50b0JlIG5Ub2Rvc1xuXG4gICAgICAgICAgZWRpdG9yID0gdW5kZWZpbmVkXG4gICAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3Blbignc2FtcGxlLmpzJylcbiAgICAgICAgICB3YWl0c0ZvciAtPiBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgICAgICBydW5zIC0+XG4gICAgICAgICAgICBwcmV2VGV4dCA9IGVkaXRvci5nZXRUZXh0KClcbiAgICAgICAgICAgIGVkaXRvci5pbnNlcnRUZXh0ICdUT0RPOiBUaGlzIGlzIGFuIGluc2VydGVkIHRvZG8nXG4gICAgICAgICAgICB3YWl0c0ZvclByb21pc2UgLT4gZWRpdG9yLnNhdmUoKVxuICAgICAgICAgICAgcnVucyAtPlxuICAgICAgICAgICAgICBleHBlY3Qoc2hvd1RvZG9Nb2R1bGUuc2hvd1RvZG9WaWV3LmlzU2VhcmNoaW5nKCkpLnRvQmUgdHJ1ZVxuXG4gICAgICAgICAgICAgIHdhaXRzRm9yIC0+IHNob3dUb2RvTW9kdWxlLmNvbGxlY3Rpb24uZ2V0VG9kb3NDb3VudCgpID4gMFxuICAgICAgICAgICAgICBydW5zIC0+XG4gICAgICAgICAgICAgICAgZXhwZWN0KHNob3dUb2RvTW9kdWxlLmNvbGxlY3Rpb24uZ2V0VG9kb3NDb3VudCgpKS50b0JlKG5Ub2RvcyArIDEpXG5cbiAgICAgICAgICAgICAgICBleGVjdXRlQ29tbWFuZCAtPlxuICAgICAgICAgICAgICAgICAgZWRpdG9yLnNldFRleHQgcHJldlRleHRcbiAgICAgICAgICAgICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBlZGl0b3Iuc2F2ZSgpXG4gICAgICAgICAgICAgICAgICBydW5zIC0+XG4gICAgICAgICAgICAgICAgICAgIGV4cGVjdChzaG93VG9kb01vZHVsZS5zaG93VG9kb1ZpZXcpLm5vdC50b0JlRGVmaW5lZCgpXG4gICAgICAgICAgICAgICAgICAgIGV4cGVjdChzaG93VG9kb01vZHVsZS5jb2xsZWN0aW9uLmdldFRvZG9zQ291bnQoKSkudG9CZShuVG9kb3MgKyAxKVxuXG4gICAgICAgICAgICAgICAgICAgIGRvY2suc2hvdygpXG4gICAgICAgICAgICAgICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBlZGl0b3Iuc2F2ZSgpXG4gICAgICAgICAgICAgICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICAgICAgICAgICAgICB3YWl0c0ZvciAtPiBzaG93VG9kb01vZHVsZS5jb2xsZWN0aW9uLmdldFRvZG9zQ291bnQoKSA+IDBcbiAgICAgICAgICAgICAgICAgICAgICBydW5zIC0+XG4gICAgICAgICAgICAgICAgICAgICAgICBleHBlY3Qoc2hvd1RvZG9Nb2R1bGUuY29sbGVjdGlvbi5nZXRUb2Rvc0NvdW50KCkpLnRvQmUgblRvZG9zXG5cbiAgZGVzY3JpYmUgJ3doZW4gdG9kbyBpdGVtIGlzIGNsaWNrZWQnLCAtPlxuICAgIGl0ICdvcGVucyB0aGUgZmlsZScsIC0+XG4gICAgICBleGVjdXRlQ29tbWFuZCAtPlxuICAgICAgICBlbGVtZW50ID0gc2hvd1RvZG9Nb2R1bGUuc2hvd1RvZG9WaWV3LmZpbmQoJ3RkJykubGFzdCgpXG4gICAgICAgIGl0ZW0gPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lSXRlbSgpXG4gICAgICAgIGV4cGVjdChpdGVtKS5ub3QudG9CZURlZmluZWQoKVxuICAgICAgICBlbGVtZW50LmNsaWNrKClcblxuICAgICAgICB3YWl0c0ZvciAtPiBpdGVtID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZUl0ZW0oKVxuICAgICAgICBydW5zIC0+IGV4cGVjdChpdGVtLmdldFRpdGxlKCkpLnRvQmUgJ3NhbXBsZS5qcydcblxuICAgIGl0ICdvcGVucyBmaWxlIG90aGVyIHByb2plY3QnLCAtPlxuICAgICAgYXRvbS5wcm9qZWN0LmFkZFBhdGggcGF0aC5qb2luKF9fZGlybmFtZSwgJ2ZpeHR1cmVzL3NhbXBsZTInKVxuXG4gICAgICBleGVjdXRlQ29tbWFuZCAtPlxuICAgICAgICBlbGVtZW50ID0gc2hvd1RvZG9Nb2R1bGUuc2hvd1RvZG9WaWV3LmZpbmQoJ3RkJylbM11cbiAgICAgICAgaXRlbSA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmVJdGVtKClcbiAgICAgICAgZXhwZWN0KGl0ZW0pLm5vdC50b0JlRGVmaW5lZCgpXG4gICAgICAgIGVsZW1lbnQuY2xpY2soKVxuXG4gICAgICAgIHdhaXRzRm9yIC0+IGl0ZW0gPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lSXRlbSgpXG4gICAgICAgIHJ1bnMgLT4gZXhwZWN0KGl0ZW0uZ2V0VGl0bGUoKSkudG9CZSAnc2FtcGxlLnR4dCdcblxuICBkZXNjcmliZSAnd2hlbiBzYXZlLWFzIGJ1dHRvbiBpcyBjbGlja2VkJywgLT5cbiAgICBpdCAnc2F2ZXMgdGhlIGxpc3QgaW4gbWFya2Rvd24gYW5kIG9wZW5zIGl0JywgLT5cbiAgICAgIG91dHB1dFBhdGggPSB0ZW1wLnBhdGgoc3VmZml4OiAnLm1kJylcbiAgICAgIGV4cGVjdGVkRmlsZVBhdGggPSBhdG9tLnByb2plY3QuZ2V0RGlyZWN0b3JpZXMoKVswXS5yZXNvbHZlKCcuLi9zYXZlZC1vdXRwdXQubWQnKVxuICAgICAgZXhwZWN0ZWRPdXRwdXQgPSBmcy5yZWFkRmlsZVN5bmMoZXhwZWN0ZWRGaWxlUGF0aCkudG9TdHJpbmcoKVxuICAgICAgYXRvbS5jb25maWcuc2V0ICd0b2RvLXNob3cuc29ydEJ5JywgJ1R5cGUnXG5cbiAgICAgIGV4cGVjdChmcy5pc0ZpbGVTeW5jKG91dHB1dFBhdGgpKS50b0JlIGZhbHNlXG5cbiAgICAgIGV4ZWN1dGVDb21tYW5kIC0+XG4gICAgICAgIHNweU9uKGF0b20sICdzaG93U2F2ZURpYWxvZ1N5bmMnKS5hbmRSZXR1cm4ob3V0cHV0UGF0aClcbiAgICAgICAgc2hvd1RvZG9Nb2R1bGUuc2hvd1RvZG9WaWV3LnNhdmVBcygpXG5cbiAgICAgIHdhaXRzRm9yIC0+XG4gICAgICAgIGZzLmV4aXN0c1N5bmMob3V0cHV0UGF0aCkgJiYgYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpPy5nZXRQYXRoKCkgaXMgb3V0cHV0UGF0aFxuXG4gICAgICBydW5zIC0+XG4gICAgICAgIGV4cGVjdChmcy5pc0ZpbGVTeW5jKG91dHB1dFBhdGgpKS50b0JlIHRydWVcbiAgICAgICAgIyBOb3Qgd29ya2luZyBpbiBUcmF2aXMgQ0lcbiAgICAgICAgIyBleHBlY3QoYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpLmdldFRleHQoKSkudG9CZSBleHBlY3RlZE91dHB1dFxuXG4gICAgaXQgJ3NhdmVzIGFub3RoZXIgbGlzdCBzb3J0ZWQgZGlmZmVyZW50bHkgaW4gbWFya2Rvd24nLCAtPlxuICAgICAgb3V0cHV0UGF0aCA9IHRlbXAucGF0aChzdWZmaXg6ICcubWQnKVxuICAgICAgYXRvbS5jb25maWcuc2V0ICd0b2RvLXNob3cuZmluZFRoZXNlVG9kb3MnLCBbJ1RPRE8nXVxuICAgICAgYXRvbS5jb25maWcuc2V0ICd0b2RvLXNob3cuc2hvd0luVGFibGUnLCBbJ1RleHQnLCAnVHlwZScsICdGaWxlJywgJ0xpbmUnXVxuICAgICAgYXRvbS5jb25maWcuc2V0ICd0b2RvLXNob3cuc29ydEJ5JywgJ0ZpbGUnXG4gICAgICBleHBlY3QoZnMuaXNGaWxlU3luYyhvdXRwdXRQYXRoKSkudG9CZSBmYWxzZVxuXG4gICAgICBleGVjdXRlQ29tbWFuZCAtPlxuICAgICAgICBzcHlPbihhdG9tLCAnc2hvd1NhdmVEaWFsb2dTeW5jJykuYW5kUmV0dXJuKG91dHB1dFBhdGgpXG4gICAgICAgIHNob3dUb2RvTW9kdWxlLnNob3dUb2RvVmlldy5zYXZlQXMoKVxuXG4gICAgICB3YWl0c0ZvciAtPlxuICAgICAgICBmcy5leGlzdHNTeW5jKG91dHB1dFBhdGgpICYmIGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKT8uZ2V0UGF0aCgpIGlzIG91dHB1dFBhdGhcblxuICAgICAgcnVucyAtPlxuICAgICAgICBleHBlY3QoZnMuaXNGaWxlU3luYyhvdXRwdXRQYXRoKSkudG9CZSB0cnVlXG4gICAgICAgIGV4cGVjdChhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCkuZ2V0VGV4dCgpKS50b0JlIFwiXCJcIlxuICAgICAgICAgIC0gQ29tbWVudCBpbiBDIF9fVE9ET19fIFtzYW1wbGUuY10oc2FtcGxlLmMpIF86NV9cbiAgICAgICAgICAtIFRoaXMgaXMgdGhlIGZpcnN0IHRvZG8gX19UT0RPX18gW3NhbXBsZS5qc10oc2FtcGxlLmpzKSBfOjNfXG4gICAgICAgICAgLSBUaGlzIGlzIHRoZSBzZWNvbmQgdG9kbyBfX1RPRE9fXyBbc2FtcGxlLmpzXShzYW1wbGUuanMpIF86MjBfXFxuXG4gICAgICAgIFwiXCJcIlxuXG4gIGRlc2NyaWJlICd3aGVuIGNvcmU6cmVmcmVzaCBpcyB0cmlnZ2VyZWQnLCAtPlxuICAgIGl0ICdyZWZyZXNoZXMgdGhlIGxpc3QnLCAtPlxuICAgICAgZXhlY3V0ZUNvbW1hbmQgLT5cbiAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCB3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zaG93LXRvZG8tcHJldmlldycpLCAnY29yZTpyZWZyZXNoJ1xuXG4gICAgICAgIGV4cGVjdChzaG93VG9kb01vZHVsZS5zaG93VG9kb1ZpZXcuaXNTZWFyY2hpbmcoKSkudG9CZSB0cnVlXG4gICAgICAgIGV4cGVjdChzaG93VG9kb01vZHVsZS5zaG93VG9kb1ZpZXcuZmluZCgnLm1hcmtkb3duLXNwaW5uZXInKSkudG9CZVZpc2libGUoKVxuXG4gICAgICAgIHdhaXRzRm9yIC0+ICFzaG93VG9kb01vZHVsZS5zaG93VG9kb1ZpZXcuaXNTZWFyY2hpbmcoKVxuICAgICAgICBydW5zIC0+XG4gICAgICAgICAgZXhwZWN0KHNob3dUb2RvTW9kdWxlLnNob3dUb2RvVmlldy5maW5kKCcubWFya2Rvd24tc3Bpbm5lcicpKS5ub3QudG9CZVZpc2libGUoKVxuICAgICAgICAgIGV4cGVjdChzaG93VG9kb01vZHVsZS5zaG93VG9kb1ZpZXcuaXNTZWFyY2hpbmcoKSkudG9CZSBmYWxzZVxuXG4gIGRlc2NyaWJlICd3aGVuIHRoZSB0b2RvLXNob3c6ZmluZC1pbi1vcGVuLWZpbGVzIGV2ZW50IGlzIHRyaWdnZXJlZCcsIC0+XG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh3b3Jrc3BhY2VFbGVtZW50LCAndG9kby1zaG93OmZpbmQtaW4tb3Blbi1maWxlcycpXG4gICAgICB3YWl0c0ZvclByb21pc2UgLT4gYWN0aXZhdGlvblByb21pc2VcbiAgICAgIHJ1bnMgLT5cbiAgICAgICAgd2FpdHNGb3IgLT5cbiAgICAgICAgICAhc2hvd1RvZG9Nb2R1bGUuc2hvd1RvZG9WaWV3LmlzU2VhcmNoaW5nKCkgYW5kIHNob3dUb2RvTW9kdWxlLnNob3dUb2RvVmlldy5pc1Zpc2libGUoKVxuXG4gICAgaXQgJ2RvZXMgbm90IHNob3cgYW55IHJlc3VsdHMgd2l0aCBubyBvcGVuIGZpbGVzJywgLT5cbiAgICAgIGVsZW1lbnQgPSBzaG93VG9kb01vZHVsZS5zaG93VG9kb1ZpZXcuZmluZCgncCcpLmxhc3QoKVxuXG4gICAgICBleHBlY3Qoc2hvd1RvZG9Nb2R1bGUuc2hvd1RvZG9WaWV3LmdldFRvZG9zKCkpLnRvSGF2ZUxlbmd0aCAwXG4gICAgICBleHBlY3QoZWxlbWVudC50ZXh0KCkpLnRvQ29udGFpbiAnTm8gcmVzdWx0cy4uLidcbiAgICAgIGV4cGVjdChlbGVtZW50LmlzVmlzaWJsZSgpKS50b0JlIHRydWVcblxuICAgIGl0ICdvbmx5IHNob3dzIHRvZG9zIGZyb20gb3BlbiBmaWxlcycsIC0+XG4gICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbiAnc2FtcGxlLmMnXG5cbiAgICAgIHdhaXRzRm9yIC0+ICFzaG93VG9kb01vZHVsZS5zaG93VG9kb1ZpZXcuaXNTZWFyY2hpbmcoKVxuICAgICAgcnVucyAtPlxuICAgICAgICB0b2RvcyA9IHNob3dUb2RvTW9kdWxlLnNob3dUb2RvVmlldy5nZXRUb2RvcygpXG4gICAgICAgIGV4cGVjdCh0b2RvcykudG9IYXZlTGVuZ3RoIDFcbiAgICAgICAgZXhwZWN0KHRvZG9zWzBdLnR5cGUpLnRvQmUgJ1RPRE8nXG4gICAgICAgIGV4cGVjdCh0b2Rvc1swXS50ZXh0KS50b0JlICdDb21tZW50IGluIEMnXG4gICAgICAgIGV4cGVjdCh0b2Rvc1swXS5maWxlKS50b0JlICdzYW1wbGUuYydcblxuICBkZXNjcmliZSAnd2hlbiB0aGUgdHJlZSB2aWV3IGNvbnRleHQgbWVudSBpcyBzZWxlY3RlZCcsIC0+XG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh3b3Jrc3BhY2VFbGVtZW50LCAndG9kby1zaG93OmZpbmQtaW4td29ya3NwYWNlJylcbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBhY3RpdmF0aW9uUHJvbWlzZVxuICAgICAgcnVucyAtPlxuICAgICAgICB3YWl0c0ZvciAtPlxuICAgICAgICAgICFzaG93VG9kb01vZHVsZS5zaG93VG9kb1ZpZXcuaXNTZWFyY2hpbmcoKSBhbmQgc2hvd1RvZG9Nb2R1bGUuc2hvd1RvZG9WaWV3LmlzVmlzaWJsZSgpXG5cbiAgICBpdCAnc2VhcmNoZXMgZm9yIHRvZG9zIGluIHRoZSBzZWxlY3RlZCBmb2xkZXInLCAtPlxuICAgICAgZXhwZWN0KHNob3dUb2RvTW9kdWxlLmNvbGxlY3Rpb24uZ2V0VG9kb3NDb3VudCgpKS50b0JlIG5Ub2Rvc1xuXG4gICAgICBldmVudCA9XG4gICAgICAgIHRhcmdldDpcbiAgICAgICAgICBnZXRBdHRyaWJ1dGU6IC0+XG4gICAgICAgICAgICBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZml4dHVyZXMvc2FtcGxlMS9zYW1wbGUuYycpXG4gICAgICBzaG93VG9kb01vZHVsZS5zaG93KHVuZGVmaW5lZCwgZXZlbnQpXG5cbiAgICAgIHdhaXRzRm9yIC0+ICFzaG93VG9kb01vZHVsZS5zaG93VG9kb1ZpZXcuaXNTZWFyY2hpbmcoKVxuICAgICAgcnVucyAtPlxuICAgICAgICBleHBlY3Qoc2hvd1RvZG9Nb2R1bGUuY29sbGVjdGlvbi5nZXRDdXN0b21QYXRoKCkpLnRvQmUgJ3NhbXBsZS5jJ1xuICAgICAgICBleHBlY3Qoc2hvd1RvZG9Nb2R1bGUuY29sbGVjdGlvbi5zY29wZSkudG9CZSAnY3VzdG9tJ1xuICAgICAgICBleHBlY3Qoc2hvd1RvZG9Nb2R1bGUuY29sbGVjdGlvbi5nZXRUb2Rvc0NvdW50KCkpLnRvQmUgMVxuXG4gICAgaXQgJ2hhbmRsZXMgbWlzc2luZyBwYXRoIGluIGV2ZW50IGFyZ3VtZW50JywgLT5cbiAgICAgIGV2ZW50ID1cbiAgICAgICAgdGFyZ2V0OlxuICAgICAgICAgIGdldEF0dHJpYnV0ZTogLT5cbiAgICAgICAgICAgIHVuZGVmaW5lZFxuICAgICAgc2hvd1RvZG9Nb2R1bGUuc2hvdyh1bmRlZmluZWQsIGV2ZW50KVxuXG4gICAgICB3YWl0c0ZvciAtPiAhc2hvd1RvZG9Nb2R1bGUuc2hvd1RvZG9WaWV3LmlzU2VhcmNoaW5nKClcbiAgICAgIHJ1bnMgLT5cbiAgICAgICAgZXhwZWN0KHNob3dUb2RvTW9kdWxlLmNvbGxlY3Rpb24uZ2V0VG9kb3NDb3VudCgpKS50b0JlIG5Ub2Rvc1xuXG4gIGRlc2NyaWJlICdzdGF0dXMgYmFyIGluZGljYXRvcicsIC0+XG4gICAgdG9kb0luZGljYXRvckNsYXNzID0gJy5zdGF0dXMtYmFyIC50b2RvLXN0YXR1cy1iYXItaW5kaWNhdG9yJ1xuXG4gICAgaXQgJ3Nob3dzIHRoZSBjdXJyZW50IG51bWJlciBvZiB0b2RvcycsIC0+XG4gICAgICBhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZSAnc3RhdHVzLWJhcidcblxuICAgICAgZXhlY3V0ZUNvbW1hbmQgLT5cbiAgICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3Rvcih0b2RvSW5kaWNhdG9yQ2xhc3MpKS5ub3QudG9FeGlzdCgpXG4gICAgICAgIGF0b20uY29uZmlnLnNldCgndG9kby1zaG93LnN0YXR1c0JhckluZGljYXRvcicsIHRydWUpXG4gICAgICAgIGV4cGVjdCh3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IodG9kb0luZGljYXRvckNsYXNzKSkudG9FeGlzdCgpXG5cbiAgICAgICAgblRvZG9zID0gc2hvd1RvZG9Nb2R1bGUuc2hvd1RvZG9WaWV3LmdldFRvZG9zQ291bnQoKVxuICAgICAgICBleHBlY3QoblRvZG9zKS5ub3QudG9CZSAwXG4gICAgICAgIGluZGljYXRvckVsZW1lbnQgPSB3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IodG9kb0luZGljYXRvckNsYXNzKVxuICAgICAgICBleHBlY3QoaW5kaWNhdG9yRWxlbWVudC5pbm5lclRleHQpLnRvQmUgblRvZG9zLnRvU3RyaW5nKClcbiJdfQ==
