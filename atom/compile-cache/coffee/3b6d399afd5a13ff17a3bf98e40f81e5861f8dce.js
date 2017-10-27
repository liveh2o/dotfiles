(function() {
  var ShowTodoView, TodosCollection, path, sample1Path, sample2Path, showTodoUri;

  path = require('path');

  ShowTodoView = require('../lib/todo-view');

  TodosCollection = require('../lib/todo-collection');

  sample1Path = path.join(__dirname, 'fixtures/sample1');

  sample2Path = path.join(__dirname, 'fixtures/sample2');

  showTodoUri = 'atom://todo-show';

  describe("Show Todo View", function() {
    var collection, ref, showTodoView;
    ref = [], showTodoView = ref[0], collection = ref[1], showTodoUri = ref[2];
    beforeEach(function() {
      atom.config.set('todo-show.findTheseTodos', ['TODO']);
      atom.config.set('todo-show.findUsingRegex', '/\\b(${TODOS}):?\\d*($|\\s.*$)/g');
      atom.project.setPaths([sample1Path]);
      collection = new TodosCollection;
      collection.setSearchScope('workspace');
      showTodoView = new ShowTodoView(collection, showTodoUri);
      showTodoView.onlySearchWhenVisible = false;
      showTodoView.search(true);
      return waitsFor(function() {
        return !showTodoView.isSearching();
      });
    });
    describe("View properties", function() {
      it("has a title, uri, etc.", function() {
        expect(showTodoView.getIconName()).toEqual('checklist');
        expect(showTodoView.getURI()).toEqual(showTodoUri);
        return expect(showTodoView.find('.btn-group')).toExist();
      });
      it("updates view info", function() {
        var count, getInfo;
        getInfo = function() {
          return showTodoView.todoInfo.text();
        };
        count = showTodoView.getTodosCount();
        expect(getInfo()).toBe("Found " + count + " results in workspace");
        showTodoView.collection.search();
        expect(getInfo()).toBe("Found ... results in workspace");
        waitsFor(function() {
          return !showTodoView.isSearching();
        });
        return runs(function() {
          expect(getInfo()).toBe("Found " + count + " results in workspace");
          showTodoView.collection.todos = ['a single todo'];
          showTodoView.updateInfo();
          return expect(getInfo()).toBe("Found 1 result in workspace");
        });
      });
      return it("updates view info details", function() {
        var getInfo;
        getInfo = function() {
          return showTodoView.todoInfo.text();
        };
        collection.setSearchScope('project');
        waitsFor(function() {
          return !showTodoView.isSearching();
        });
        return runs(function() {
          expect(getInfo()).toBe("Found 3 results in project sample1");
          collection.setSearchScope('open');
          waitsFor(function() {
            return !showTodoView.isSearching();
          });
          return runs(function() {
            return expect(getInfo()).toBe("Found 0 results in open files");
          });
        });
      });
    });
    return describe("Automatic update of todos", function() {
      it("refreshes on save", function() {
        expect(showTodoView.getTodos()).toHaveLength(3);
        waitsForPromise(function() {
          return atom.workspace.open('temp.txt');
        });
        return runs(function() {
          var editor;
          editor = atom.workspace.getActiveTextEditor();
          editor.setText("# TODO: Test");
          waitsForPromise(function() {
            return editor.save();
          });
          return runs(function() {
            waitsFor(function() {
              return !showTodoView.isSearching();
            });
            return runs(function() {
              expect(showTodoView.getTodos()).toHaveLength(4);
              editor.setText("");
              waitsForPromise(function() {
                return editor.save();
              });
              return runs(function() {
                waitsFor(function() {
                  return !showTodoView.isSearching();
                });
                return runs(function() {
                  return expect(showTodoView.getTodos()).toHaveLength(3);
                });
              });
            });
          });
        });
      });
      it("updates on search scope change", function() {
        expect(showTodoView.isSearching()).toBe(false);
        expect(collection.getSearchScope()).toBe('workspace');
        expect(showTodoView.getTodos()).toHaveLength(3);
        expect(collection.toggleSearchScope()).toBe('project');
        expect(showTodoView.isSearching()).toBe(true);
        waitsFor(function() {
          return !showTodoView.isSearching();
        });
        return runs(function() {
          expect(showTodoView.getTodos()).toHaveLength(3);
          expect(collection.toggleSearchScope()).toBe('open');
          expect(showTodoView.isSearching()).toBe(true);
          waitsFor(function() {
            return !showTodoView.isSearching();
          });
          return runs(function() {
            expect(showTodoView.getTodos()).toHaveLength(0);
            expect(collection.toggleSearchScope()).toBe('active');
            expect(showTodoView.isSearching()).toBe(true);
            waitsFor(function() {
              return !showTodoView.isSearching();
            });
            return runs(function() {
              expect(showTodoView.getTodos()).toHaveLength(0);
              expect(collection.toggleSearchScope()).toBe('workspace');
              return expect(showTodoView.isSearching()).toBe(true);
            });
          });
        });
      });
      it("handles search scope 'project'", function() {
        atom.project.addPath(sample2Path);
        waitsForPromise(function() {
          return atom.workspace.open(path.join(sample2Path, 'sample.txt'));
        });
        return runs(function() {
          collection.setSearchScope('workspace');
          waitsFor(function() {
            return !showTodoView.isSearching();
          });
          return runs(function() {
            expect(showTodoView.getTodos()).toHaveLength(9);
            collection.setSearchScope('project');
            expect(showTodoView.isSearching()).toBe(true);
            waitsFor(function() {
              return !showTodoView.isSearching();
            });
            return runs(function() {
              expect(showTodoView.getTodos()).toHaveLength(6);
              waitsForPromise(function() {
                return atom.workspace.open(path.join(sample1Path, 'sample.c'));
              });
              waitsFor(function() {
                return !showTodoView.isSearching();
              });
              return runs(function() {
                return expect(showTodoView.getTodos()).toHaveLength(3);
              });
            });
          });
        });
      });
      it("handles search scope 'open'", function() {
        waitsForPromise(function() {
          return atom.workspace.open('sample.c');
        });
        waitsFor(function() {
          return !showTodoView.isSearching();
        });
        return runs(function() {
          expect(showTodoView.getTodos()).toHaveLength(3);
          collection.setSearchScope('open');
          expect(showTodoView.isSearching()).toBe(true);
          waitsFor(function() {
            return !showTodoView.isSearching();
          });
          return runs(function() {
            expect(showTodoView.getTodos()).toHaveLength(1);
            waitsForPromise(function() {
              return atom.workspace.open('sample.js');
            });
            waitsFor(function() {
              return !showTodoView.isSearching();
            });
            return runs(function() {
              expect(showTodoView.getTodos()).toHaveLength(3);
              atom.workspace.getActivePane().itemAtIndex(0).destroy();
              waitsFor(function() {
                return !showTodoView.isSearching();
              });
              return runs(function() {
                return expect(showTodoView.getTodos()).toHaveLength(2);
              });
            });
          });
        });
      });
      return it("handles search scope 'active'", function() {
        waitsForPromise(function() {
          return atom.workspace.open('sample.c');
        });
        waitsForPromise(function() {
          return atom.workspace.open('sample.js');
        });
        waitsFor(function() {
          return !showTodoView.isSearching();
        });
        return runs(function() {
          expect(showTodoView.getTodos()).toHaveLength(3);
          collection.setSearchScope('active');
          expect(showTodoView.isSearching()).toBe(true);
          waitsFor(function() {
            return !showTodoView.isSearching();
          });
          return runs(function() {
            expect(showTodoView.getTodos()).toHaveLength(2);
            atom.workspace.getActivePane().activateItemAtIndex(0);
            waitsFor(function() {
              return !showTodoView.isSearching();
            });
            return runs(function() {
              return expect(showTodoView.getTodos()).toHaveLength(1);
            });
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RvZG8tc2hvdy9zcGVjL3RvZG8tdmlldy1zcGVjLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUVQLFlBQUEsR0FBZSxPQUFBLENBQVEsa0JBQVI7O0VBQ2YsZUFBQSxHQUFrQixPQUFBLENBQVEsd0JBQVI7O0VBRWxCLFdBQUEsR0FBYyxJQUFJLENBQUMsSUFBTCxDQUFVLFNBQVYsRUFBcUIsa0JBQXJCOztFQUNkLFdBQUEsR0FBYyxJQUFJLENBQUMsSUFBTCxDQUFVLFNBQVYsRUFBcUIsa0JBQXJCOztFQUNkLFdBQUEsR0FBYzs7RUFFZCxRQUFBLENBQVMsZ0JBQVQsRUFBMkIsU0FBQTtBQUN6QixRQUFBO0lBQUEsTUFBMEMsRUFBMUMsRUFBQyxxQkFBRCxFQUFlLG1CQUFmLEVBQTJCO0lBRTNCLFVBQUEsQ0FBVyxTQUFBO01BQ1QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDBCQUFoQixFQUE0QyxDQUFDLE1BQUQsQ0FBNUM7TUFDQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsMEJBQWhCLEVBQTRDLGtDQUE1QztNQUVBLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFzQixDQUFDLFdBQUQsQ0FBdEI7TUFDQSxVQUFBLEdBQWEsSUFBSTtNQUNqQixVQUFVLENBQUMsY0FBWCxDQUEwQixXQUExQjtNQUNBLFlBQUEsR0FBbUIsSUFBQSxZQUFBLENBQWEsVUFBYixFQUF5QixXQUF6QjtNQUNuQixZQUFZLENBQUMscUJBQWIsR0FBcUM7TUFDckMsWUFBWSxDQUFDLE1BQWIsQ0FBb0IsSUFBcEI7YUFDQSxRQUFBLENBQVMsU0FBQTtlQUFHLENBQUMsWUFBWSxDQUFDLFdBQWIsQ0FBQTtNQUFKLENBQVQ7SUFWUyxDQUFYO0lBWUEsUUFBQSxD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Q0FBTyxZQUFZLENBQUMsUUFBYixDQUFBLENBQVAsQ0FBK0IsQ0FBQyxZQUFoQyxDQUE2QyxDQUE3QztZQURHLENBQUw7VUFMRyxDQUFMO1FBTkcsQ0FBTDtNQUprQyxDQUFwQztJQTNGb0MsQ0FBdEM7RUFqRHlCLENBQTNCO0FBVEEiLCJzb3VyY2VzQ29udGVudCI6WyJwYXRoID0gcmVxdWlyZSAncGF0aCdcblxuU2hvd1RvZG9WaWV3ID0gcmVxdWlyZSAnLi4vbGliL3RvZG8tdmlldydcblRvZG9zQ29sbGVjdGlvbiA9IHJlcXVpcmUgJy4uL2xpYi90b2RvLWNvbGxlY3Rpb24nXG5cbnNhbXBsZTFQYXRoID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ2ZpeHR1cmVzL3NhbXBsZTEnKVxuc2FtcGxlMlBhdGggPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZml4dHVyZXMvc2FtcGxlMicpXG5zaG93VG9kb1VyaSA9ICdhdG9tOi8vdG9kby1zaG93J1xuXG5kZXNjcmliZSBcIlNob3cgVG9kbyBWaWV3XCIsIC0+XG4gIFtzaG93VG9kb1ZpZXcsIGNvbGxlY3Rpb24sIHNob3dUb2RvVXJpXSA9IFtdXG5cbiAgYmVmb3JlRWFjaCAtPlxuICAgIGF0b20uY29uZmlnLnNldCAndG9kby1zaG93LmZpbmRUaGVzZVRvZG9zJywgWydUT0RPJ11cbiAgICBhdG9tLmNvbmZpZy5zZXQgJ3RvZG8tc2hvdy5maW5kVXNpbmdSZWdleCcsICcvXFxcXGIoJHtUT0RPU30pOj9cXFxcZCooJHxcXFxccy4qJCkvZydcblxuICAgIGF0b20ucHJvamVjdC5zZXRQYXRocyBbc2FtcGxlMVBhdGhdXG4gICAgY29sbGVjdGlvbiA9IG5ldyBUb2Rvc0NvbGxlY3Rpb25cbiAgICBjb2xsZWN0aW9uLnNldFNlYXJjaFNjb3BlICd3b3Jrc3BhY2UnXG4gICAgc2hvd1RvZG9WaWV3ID0gbmV3IFNob3dUb2RvVmlldyhjb2xsZWN0aW9uLCBzaG93VG9kb1VyaSlcbiAgICBzaG93VG9kb1ZpZXcub25seVNlYXJjaFdoZW5WaXNpYmxlID0gZmFsc2VcbiAgICBzaG93VG9kb1ZpZXcuc2VhcmNoKHRydWUpXG4gICAgd2FpdHNGb3IgLT4gIXNob3dUb2RvVmlldy5pc1NlYXJjaGluZygpXG5cbiAgZGVzY3JpYmUgXCJWaWV3IHByb3BlcnRpZXNcIiwgLT5cbiAgICBpdCBcImhhcyBhIHRpdGxlLCB1cmksIGV0Yy5cIiwgLT5cbiAgICAgIGV4cGVjdChzaG93VG9kb1ZpZXcuZ2V0SWNvbk5hbWUoKSkudG9FcXVhbCAnY2hlY2tsaXN0J1xuICAgICAgZXhwZWN0KHNob3dUb2RvVmlldy5nZXRVUkkoKSkudG9FcXVhbCBzaG93VG9kb1VyaVxuICAgICAgZXhwZWN0KHNob3dUb2RvVmlldy5maW5kKCcuYnRuLWdyb3VwJykpLnRvRXhpc3QoKVxuXG4gICAgaXQgXCJ1cGRhdGVzIHZpZXcgaW5mb1wiLCAtPlxuICAgICAgZ2V0SW5mbyA9IC0+IHNob3dUb2RvVmlldy50b2RvSW5mby50ZXh0KClcblxuICAgICAgY291bnQgPSBzaG93VG9kb1ZpZXcuZ2V0VG9kb3NDb3VudCgpXG4gICAgICBleHBlY3QoZ2V0SW5mbygpKS50b0JlIFwiRm91bmQgI3tjb3VudH0gcmVzdWx0cyBpbiB3b3Jrc3BhY2VcIlxuICAgICAgc2hvd1RvZG9WaWV3LmNvbGxlY3Rpb24uc2VhcmNoKClcbiAgICAgIGV4cGVjdChnZXRJbmZvKCkpLnRvQmUgXCJGb3VuZCAuLi4gcmVzdWx0cyBpbiB3b3Jrc3BhY2VcIlxuXG4gICAgICB3YWl0c0ZvciAtPiAhc2hvd1RvZG9WaWV3LmlzU2VhcmNoaW5nKClcbiAgICAgIHJ1bnMgLT5cbiAgICAgICAgZXhwZWN0KGdldEluZm8oKSkudG9CZSBcIkZvdW5kICN7Y291bnR9IHJlc3VsdHMgaW4gd29ya3NwYWNlXCJcbiAgICAgICAgc2hvd1RvZG9WaWV3LmNvbGxlY3Rpb24udG9kb3MgPSBbJ2Egc2luZ2xlIHRvZG8nXVxuICAgICAgICBzaG93VG9kb1ZpZXcudXBkYXRlSW5mbygpXG4gICAgICAgIGV4cGVjdChnZXRJbmZvKCkpLnRvQmUgXCJGb3VuZCAxIHJlc3VsdCBpbiB3b3Jrc3BhY2VcIlxuXG4gICAgaXQgXCJ1cGRhdGVzIHZpZXcgaW5mbyBkZXRhaWxzXCIsIC0+XG4gICAgICBnZXRJbmZvID0gLT4gc2hvd1RvZG9WaWV3LnRvZG9JbmZvLnRleHQoKVxuXG4gICAgICBjb2xsZWN0aW9uLnNldFNlYXJjaFNjb3BlICdwcm9qZWN0J1xuICAgICAgd2FpdHNGb3IgLT4gIXNob3dUb2RvVmlldy5pc1NlYXJjaGluZygpXG4gICAgICBydW5zIC0+XG4gICAgICAgIGV4cGVjdChnZXRJbmZvKCkpLnRvQmUgXCJGb3VuZCAzIHJlc3VsdHMgaW4gcHJvamVjdCBzYW1wbGUxXCJcblxuICAgICAgICBjb2xsZWN0aW9uLnNldFNlYXJjaFNjb3BlKCdvcGVuJylcbiAgICAgICAgd2FpdHNGb3IgLT4gIXNob3dUb2RvVmlldy5pc1NlYXJjaGluZygpXG4gICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICBleHBlY3QoZ2V0SW5mbygpKS50b0JlIFwiRm91bmQgMCByZXN1bHRzIGluIG9wZW4gZmlsZXNcIlxuXG4gIGRlc2NyaWJlIFwiQXV0b21hdGljIHVwZGF0ZSBvZiB0b2Rvc1wiLCAtPlxuICAgIGl0IFwicmVmcmVzaGVzIG9uIHNhdmVcIiwgLT5cbiAgICAgIGV4cGVjdChzaG93VG9kb1ZpZXcuZ2V0VG9kb3MoKSkudG9IYXZlTGVuZ3RoIDNcblxuICAgICAgd2FpdHNGb3JQcm9taXNlIC0+IGF0b20ud29ya3NwYWNlLm9wZW4gJ3RlbXAudHh0J1xuICAgICAgcnVucyAtPlxuICAgICAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgICAgZWRpdG9yLnNldFRleHQoXCIjIFRPRE86IFRlc3RcIilcbiAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+IGVkaXRvci5zYXZlKClcbiAgICAgICAgcnVucyAtPlxuICAgICAgICAgIHdhaXRzRm9yIC0+ICFzaG93VG9kb1ZpZXcuaXNTZWFyY2hpbmcoKVxuICAgICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICAgIGV4cGVjdChzaG93VG9kb1ZpZXcuZ2V0VG9kb3MoKSkudG9IYXZlTGVuZ3RoIDRcbiAgICAgICAgICAgIGVkaXRvci5zZXRUZXh0KFwiXCIpXG4gICAgICAgICAgICB3YWl0c0ZvclByb21pc2UgLT4gZWRpdG9yLnNhdmUoKVxuICAgICAgICAgICAgcnVucyAtPlxuICAgICAgICAgICAgICB3YWl0c0ZvciAtPiAhc2hvd1RvZG9WaWV3LmlzU2VhcmNoaW5nKClcbiAgICAgICAgICAgICAgcnVucyAtPlxuICAgICAgICAgICAgICAgIGV4cGVjdChzaG93VG9kb1ZpZXcuZ2V0VG9kb3MoKSkudG9IYXZlTGVuZ3RoIDNcblxuICAgIGl0IFwidXBkYXRlcyBvbiBzZWFyY2ggc2NvcGUgY2hhbmdlXCIsIC0+XG4gICAgICBleHBlY3Qoc2hvd1RvZG9WaWV3LmlzU2VhcmNoaW5nKCkpLnRvQmUgZmFsc2VcbiAgICAgIGV4cGVjdChjb2xsZWN0aW9uLmdldFNlYXJjaFNjb3BlKCkpLnRvQmUgJ3dvcmtzcGFjZSdcbiAgICAgIGV4cGVjdChzaG93VG9kb1ZpZXcuZ2V0VG9kb3MoKSkudG9IYXZlTGVuZ3RoIDNcbiAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZ2dsZVNlYXJjaFNjb3BlKCkpLnRvQmUgJ3Byb2plY3QnXG4gICAgICBleHBlY3Qoc2hvd1RvZG9WaWV3LmlzU2VhcmNoaW5nKCkpLnRvQmUgdHJ1ZVxuXG4gICAgICB3YWl0c0ZvciAtPiAhc2hvd1RvZG9WaWV3LmlzU2VhcmNoaW5nKClcbiAgICAgIHJ1bnMgLT5cbiAgICAgICAgZXhwZWN0KHNob3dUb2RvVmlldy5nZXRUb2RvcygpKS50b0hhdmVMZW5ndGggM1xuICAgICAgICBleHBlY3QoY29sbGVjdGlvbi50b2dnbGVTZWFyY2hTY29wZSgpKS50b0JlICdvcGVuJ1xuICAgICAgICBleHBlY3Qoc2hvd1RvZG9WaWV3LmlzU2VhcmNoaW5nKCkpLnRvQmUgdHJ1ZVxuXG4gICAgICAgIHdhaXRzRm9yIC0+ICFzaG93VG9kb1ZpZXcuaXNTZWFyY2hpbmcoKVxuICAgICAgICBydW5zIC0+XG4gICAgICAgICAgZXhwZWN0KHNob3dUb2RvVmlldy5nZXRUb2RvcygpKS50b0hhdmVMZW5ndGggMFxuICAgICAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZ2dsZVNlYXJjaFNjb3BlKCkpLnRvQmUgJ2FjdGl2ZSdcbiAgICAgICAgICBleHBlY3Qoc2hvd1RvZG9WaWV3LmlzU2VhcmNoaW5nKCkpLnRvQmUgdHJ1ZVxuXG4gICAgICAgICAgd2FpdHNGb3IgLT4gIXNob3dUb2RvVmlldy5pc1NlYXJjaGluZygpXG4gICAgICAgICAgcnVucyAtPlxuICAgICAgICAgICAgZXhwZWN0KHNob3dUb2RvVmlldy5nZXRUb2RvcygpKS50b0hhdmVMZW5ndGggMFxuICAgICAgICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9nZ2xlU2VhcmNoU2NvcGUoKSkudG9CZSAnd29ya3NwYWNlJ1xuICAgICAgICAgICAgZXhwZWN0KHNob3dUb2RvVmlldy5pc1NlYXJjaGluZygpKS50b0JlIHRydWVcblxuICAgIGl0IFwiaGFuZGxlcyBzZWFyY2ggc2NvcGUgJ3Byb2plY3QnXCIsIC0+XG4gICAgICBhdG9tLnByb2plY3QuYWRkUGF0aCBzYW1wbGUyUGF0aFxuXG4gICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbiBwYXRoLmpvaW4oc2FtcGxlMlBhdGgsICdzYW1wbGUudHh0JylcbiAgICAgIHJ1bnMgLT5cbiAgICAgICAgY29sbGVjdGlvbi5zZXRTZWFyY2hTY29wZSAnd29ya3NwYWNlJ1xuXG4gICAgICAgIHdhaXRzRm9yIC0+ICFzaG93VG9kb1ZpZXcuaXNTZWFyY2hpbmcoKVxuICAgICAgICBydW5zIC0+XG4gICAgICAgICAgZXhwZWN0KHNob3dUb2RvVmlldy5nZXRUb2RvcygpKS50b0hhdmVMZW5ndGggOVxuICAgICAgICAgIGNvbGxlY3Rpb24uc2V0U2VhcmNoU2NvcGUgJ3Byb2plY3QnXG4gICAgICAgICAgZXhwZWN0KHNob3dUb2RvVmlldy5pc1NlYXJjaGluZygpKS50b0JlIHRydWVcblxuICAgICAgICAgIHdhaXRzRm9yIC0+ICFzaG93VG9kb1ZpZXcuaXNTZWFyY2hpbmcoKVxuICAgICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICAgIGV4cGVjdChzaG93VG9kb1ZpZXcuZ2V0VG9kb3MoKSkudG9IYXZlTGVuZ3RoIDZcblxuICAgICAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4gcGF0aC5qb2luKHNhbXBsZTFQYXRoLCAnc2FtcGxlLmMnKVxuICAgICAgICAgICAgd2FpdHNGb3IgLT4gIXNob3dUb2RvVmlldy5pc1NlYXJjaGluZygpXG4gICAgICAgICAgICBydW5zIC0+XG4gICAgICAgICAgICAgIGV4cGVjdChzaG93VG9kb1ZpZXcuZ2V0VG9kb3MoKSkudG9IYXZlTGVuZ3RoIDNcblxuICAgIGl0IFwiaGFuZGxlcyBzZWFyY2ggc2NvcGUgJ29wZW4nXCIsIC0+XG4gICAgICB3YWl0c0ZvclByb21pc2UgLT4gYXRvbS53b3Jrc3BhY2Uub3BlbiAnc2FtcGxlLmMnXG4gICAgICB3YWl0c0ZvciAtPiAhc2hvd1RvZG9WaWV3LmlzU2VhcmNoaW5nKClcbiAgICAgIHJ1bnMgLT5cbiAgICAgICAgZXhwZWN0KHNob3dUb2RvVmlldy5nZXRUb2RvcygpKS50b0hhdmVMZW5ndGggM1xuICAgICAgICBjb2xsZWN0aW9uLnNldFNlYXJjaFNjb3BlICdvcGVuJ1xuICAgICAgICBleHBlY3Qoc2hvd1RvZG9WaWV3LmlzU2VhcmNoaW5nKCkpLnRvQmUgdHJ1ZVxuXG4gICAgICAgIHdhaXRzRm9yIC0+ICFzaG93VG9kb1ZpZXcuaXNTZWFyY2hpbmcoKVxuICAgICAgICBydW5zIC0+XG4gICAgICAgICAgZXhwZWN0KHNob3dUb2RvVmlldy5nZXRUb2RvcygpKS50b0hhdmVMZW5ndGggMVxuXG4gICAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+IGF0b20ud29ya3NwYWNlLm9wZW4gJ3NhbXBsZS5qcydcbiAgICAgICAgICB3YWl0c0ZvciAtPiAhc2hvd1RvZG9WaWV3LmlzU2VhcmNoaW5nKClcbiAgICAgICAgICBydW5zIC0+XG4gICAgICAgICAgICBleHBlY3Qoc2hvd1RvZG9WaWV3LmdldFRvZG9zKCkpLnRvSGF2ZUxlbmd0aCAzXG4gICAgICAgICAgICBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKCkuaXRlbUF0SW5kZXgoMCkuZGVzdHJveSgpXG5cbiAgICAgICAgICAgIHdhaXRzRm9yIC0+ICFzaG93VG9kb1ZpZXcuaXNTZWFyY2hpbmcoKVxuICAgICAgICAgICAgcnVucyAtPlxuICAgICAgICAgICAgICBleHBlY3Qoc2hvd1RvZG9WaWV3LmdldFRvZG9zKCkpLnRvSGF2ZUxlbmd0aCAyXG5cbiAgICBpdCBcImhhbmRsZXMgc2VhcmNoIHNjb3BlICdhY3RpdmUnXCIsIC0+XG4gICAgICB3YWl0c0ZvclByb21pc2UgLT4gYXRvbS53b3Jrc3BhY2Uub3BlbiAnc2FtcGxlLmMnXG4gICAgICB3YWl0c0ZvclByb21pc2UgLT4gYXRvbS53b3Jrc3BhY2Uub3BlbiAnc2FtcGxlLmpzJ1xuICAgICAgd2FpdHNGb3IgLT4gIXNob3dUb2RvVmlldy5pc1NlYXJjaGluZygpXG4gICAgICBydW5zIC0+XG4gICAgICAgIGV4cGVjdChzaG93VG9kb1ZpZXcuZ2V0VG9kb3MoKSkudG9IYXZlTGVuZ3RoIDNcbiAgICAgICAgY29sbGVjdGlvbi5zZXRTZWFyY2hTY29wZSAnYWN0aXZlJ1xuICAgICAgICBleHBlY3Qoc2hvd1RvZG9WaWV3LmlzU2VhcmNoaW5nKCkpLnRvQmUgdHJ1ZVxuXG4gICAgICAgIHdhaXRzRm9yIC0+ICFzaG93VG9kb1ZpZXcuaXNTZWFyY2hpbmcoKVxuICAgICAgICBydW5zIC0+XG4gICAgICAgICAgZXhwZWN0KHNob3dUb2RvVmlldy5nZXRUb2RvcygpKS50b0hhdmVMZW5ndGggMlxuICAgICAgICAgIGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKS5hY3RpdmF0ZUl0ZW1BdEluZGV4IDBcblxuICAgICAgICAgIHdhaXRzRm9yIC0+ICFzaG93VG9kb1ZpZXcuaXNTZWFyY2hpbmcoKVxuICAgICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICAgIGV4cGVjdChzaG93VG9kb1ZpZXcuZ2V0VG9kb3MoKSkudG9IYXZlTGVuZ3RoIDFcbiJdfQ==
