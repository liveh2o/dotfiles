(function() {
  var ShowTodoView, TodosCollection, numberOfTodos, path, sample1Path, sample2Path, showTodoUri;

  path = require('path');

  ShowTodoView = require('../lib/todo-view');

  TodosCollection = require('../lib/todo-collection');

  sample1Path = path.join(__dirname, 'fixtures/sample1');

  sample2Path = path.join(__dirname, 'fixtures/sample2');

  showTodoUri = 'atom://todo-show';

  numberOfTodos = 3;

  describe("Show Todo View", function() {
    var collection, ref, showTodoView;
    ref = [], showTodoView = ref[0], collection = ref[1], showTodoUri = ref[2];
    beforeEach(function() {
      atom.config.set('todo-show.findTheseTodos', ['TODO']);
      atom.config.set('todo-show.findUsingRegex', '/\\b(${TODOS}):?\\d*($|\\s.*$)/g');
      atom.config.set('todo-show.autoRefresh', true);
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
          expect(getInfo()).toBe("Found " + numberOfTodos + " results in project sample1");
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
        expect(showTodoView.getTodos()).toHaveLength(numberOfTodos);
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
                  return expect(showTodoView.getTodos()).toHaveLength(numberOfTodos);
                });
              });
            });
          });
        });
      });
      it("can stop auto refreshing", function() {
        atom.config.set('todo-show.autoRefresh', false);
        expect(showTodoView.getTodos()).toHaveLength(numberOfTodos);
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
              expect(showTodoView.getTodos()).toHaveLength(numberOfTodos);
              editor.setText("");
              return waitsForPromise(function() {
                return editor.save();
              });
            });
          });
        });
      });
      it("updates on search scope change", function() {
        expect(showTodoView.isSearching()).toBe(false);
        expect(collection.getSearchScope()).toBe('workspace');
        expect(showTodoView.getTodos()).toHaveLength(numberOfTodos);
        expect(collection.toggleSearchScope()).toBe('project');
        expect(showTodoView.isSearching()).toBe(true);
        waitsFor(function() {
          return !showTodoView.isSearching();
        });
        return runs(function() {
          expect(showTodoView.getTodos()).toHaveLength(numberOfTodos);
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
                return expect(showTodoView.getTodos()).toHaveLength(numberOfTodos);
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
          expect(showTodoView.getTodos()).toHaveLength(numberOfTodos);
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
              expect(showTodoView.getTodos()).toHaveLength(numberOfTodos);
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
          expect(showTodoView.getTodos()).toHaveLength(numberOfTodos);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RvZG8tc2hvdy9zcGVjL3RvZG8tdmlldy1zcGVjLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUVQLFlBQUEsR0FBZSxPQUFBLENBQVEsa0JBQVI7O0VBQ2YsZUFBQSxHQUFrQixPQUFBLENBQVEsd0JBQVI7O0VBRWxCLFdBQUEsR0FBYyxJQUFJLENBQUMsSUFBTCxDQUFVLFNBQVYsRUFBcUIsa0JBQXJCOztFQUNkLFdBQUEsR0FBYyxJQUFJLENBQUMsSUFBTCxDQUFVLFNBQVYsRUFBcUIsa0JBQXJCOztFQUNkLFdBQUEsR0FBYzs7RUFDZCxhQUFBLEdBQWdCOztFQUVoQixRQUFBLENBQVMsZ0JBQVQsRUFBMkIsU0FBQTtBQUN6QixRQUFBO0lBQUEsTUFBMEMsRUFBMUMsRUFBQyxxQkFBRCxFQUFlLG1CQUFmLEVBQTJCO0lBRTNCLFVBQUEsQ0FBVyxTQUFBO01BQ1QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDBCQUFoQixFQUE0QyxDQUFDLE1BQUQsQ0FBNUM7TUFDQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsMEJBQWhCLEVBQTRDLGtDQUE1QztNQUNBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix1QkFBaEIsRUFBeUMsSUFBekM7TUFFQSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBc0IsQ0FBQyxXQUFELENBQXRCO01BQ0EsVUFBQSxHQUFhLElBQUk7TUFDakIsVUFBVSxDQUFDLGNBQVgsQ0FBMEIsV0FBMUI7TUFDQSxZQUFBLEdBQW1CLElBQUEsWUFBQSxDQUFhLFVBQWIsRUFBeUIsV0FBekI7TUFDbkIsWUFBWSxDQUFDLHFCQUFiLEdBQXFDO01BQ3JDLFlBQVksQ0FBQyxNQUFiLENBQW9CLElBQXBCO2FBQ0EsUUFB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QyxDQUF0QztFQWxEeUIsQ0FBM0I7QUFWQSIsInNvdXJjZXNDb250ZW50IjpbInBhdGggPSByZXF1aXJlICdwYXRoJ1xuXG5TaG93VG9kb1ZpZXcgPSByZXF1aXJlICcuLi9saWIvdG9kby12aWV3J1xuVG9kb3NDb2xsZWN0aW9uID0gcmVxdWlyZSAnLi4vbGliL3RvZG8tY29sbGVjdGlvbidcblxuc2FtcGxlMVBhdGggPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZml4dHVyZXMvc2FtcGxlMScpXG5zYW1wbGUyUGF0aCA9IHBhdGguam9pbihfX2Rpcm5hbWUsICdmaXh0dXJlcy9zYW1wbGUyJylcbnNob3dUb2RvVXJpID0gJ2F0b206Ly90b2RvLXNob3cnXG5udW1iZXJPZlRvZG9zID0gM1xuXG5kZXNjcmliZSBcIlNob3cgVG9kbyBWaWV3XCIsIC0+XG4gIFtzaG93VG9kb1ZpZXcsIGNvbGxlY3Rpb24sIHNob3dUb2RvVXJpXSA9IFtdXG5cbiAgYmVmb3JlRWFjaCAtPlxuICAgIGF0b20uY29uZmlnLnNldCAndG9kby1zaG93LmZpbmRUaGVzZVRvZG9zJywgWydUT0RPJ11cbiAgICBhdG9tLmNvbmZpZy5zZXQgJ3RvZG8tc2hvdy5maW5kVXNpbmdSZWdleCcsICcvXFxcXGIoJHtUT0RPU30pOj9cXFxcZCooJHxcXFxccy4qJCkvZydcbiAgICBhdG9tLmNvbmZpZy5zZXQgJ3RvZG8tc2hvdy5hdXRvUmVmcmVzaCcsIHRydWVcblxuICAgIGF0b20ucHJvamVjdC5zZXRQYXRocyBbc2FtcGxlMVBhdGhdXG4gICAgY29sbGVjdGlvbiA9IG5ldyBUb2Rvc0NvbGxlY3Rpb25cbiAgICBjb2xsZWN0aW9uLnNldFNlYXJjaFNjb3BlICd3b3Jrc3BhY2UnXG4gICAgc2hvd1RvZG9WaWV3ID0gbmV3IFNob3dUb2RvVmlldyhjb2xsZWN0aW9uLCBzaG93VG9kb1VyaSlcbiAgICBzaG93VG9kb1ZpZXcub25seVNlYXJjaFdoZW5WaXNpYmxlID0gZmFsc2VcbiAgICBzaG93VG9kb1ZpZXcuc2VhcmNoKHRydWUpXG4gICAgd2FpdHNGb3IgLT4gIXNob3dUb2RvVmlldy5pc1NlYXJjaGluZygpXG5cbiAgZGVzY3JpYmUgXCJWaWV3IHByb3BlcnRpZXNcIiwgLT5cbiAgICBpdCBcImhhcyBhIHRpdGxlLCB1cmksIGV0Yy5cIiwgLT5cbiAgICAgIGV4cGVjdChzaG93VG9kb1ZpZXcuZ2V0SWNvbk5hbWUoKSkudG9FcXVhbCAnY2hlY2tsaXN0J1xuICAgICAgZXhwZWN0KHNob3dUb2RvVmlldy5nZXRVUkkoKSkudG9FcXVhbCBzaG93VG9kb1VyaVxuICAgICAgZXhwZWN0KHNob3dUb2RvVmlldy5maW5kKCcuYnRuLWdyb3VwJykpLnRvRXhpc3QoKVxuXG4gICAgaXQgXCJ1cGRhdGVzIHZpZXcgaW5mb1wiLCAtPlxuICAgICAgZ2V0SW5mbyA9IC0+IHNob3dUb2RvVmlldy50b2RvSW5mby50ZXh0KClcblxuICAgICAgY291bnQgPSBzaG93VG9kb1ZpZXcuZ2V0VG9kb3NDb3VudCgpXG4gICAgICBleHBlY3QoZ2V0SW5mbygpKS50b0JlIFwiRm91bmQgI3tjb3VudH0gcmVzdWx0cyBpbiB3b3Jrc3BhY2VcIlxuICAgICAgc2hvd1RvZG9WaWV3LmNvbGxlY3Rpb24uc2VhcmNoKClcbiAgICAgIGV4cGVjdChnZXRJbmZvKCkpLnRvQmUgXCJGb3VuZCAuLi4gcmVzdWx0cyBpbiB3b3Jrc3BhY2VcIlxuXG4gICAgICB3YWl0c0ZvciAtPiAhc2hvd1RvZG9WaWV3LmlzU2VhcmNoaW5nKClcbiAgICAgIHJ1bnMgLT5cbiAgICAgICAgZXhwZWN0KGdldEluZm8oKSkudG9CZSBcIkZvdW5kICN7Y291bnR9IHJlc3VsdHMgaW4gd29ya3NwYWNlXCJcbiAgICAgICAgc2hvd1RvZG9WaWV3LmNvbGxlY3Rpb24udG9kb3MgPSBbJ2Egc2luZ2xlIHRvZG8nXVxuICAgICAgICBzaG93VG9kb1ZpZXcudXBkYXRlSW5mbygpXG4gICAgICAgIGV4cGVjdChnZXRJbmZvKCkpLnRvQmUgXCJGb3VuZCAxIHJlc3VsdCBpbiB3b3Jrc3BhY2VcIlxuXG4gICAgaXQgXCJ1cGRhdGVzIHZpZXcgaW5mbyBkZXRhaWxzXCIsIC0+XG4gICAgICBnZXRJbmZvID0gLT4gc2hvd1RvZG9WaWV3LnRvZG9JbmZvLnRleHQoKVxuXG4gICAgICBjb2xsZWN0aW9uLnNldFNlYXJjaFNjb3BlICdwcm9qZWN0J1xuICAgICAgd2FpdHNGb3IgLT4gIXNob3dUb2RvVmlldy5pc1NlYXJjaGluZygpXG4gICAgICBydW5zIC0+XG4gICAgICAgIGV4cGVjdChnZXRJbmZvKCkpLnRvQmUgXCJGb3VuZCAje251bWJlck9mVG9kb3N9IHJlc3VsdHMgaW4gcHJvamVjdCBzYW1wbGUxXCJcblxuICAgICAgICBjb2xsZWN0aW9uLnNldFNlYXJjaFNjb3BlKCdvcGVuJylcbiAgICAgICAgd2FpdHNGb3IgLT4gIXNob3dUb2RvVmlldy5pc1NlYXJjaGluZygpXG4gICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICBleHBlY3QoZ2V0SW5mbygpKS50b0JlIFwiRm91bmQgMCByZXN1bHRzIGluIG9wZW4gZmlsZXNcIlxuXG4gIGRlc2NyaWJlIFwiQXV0b21hdGljIHVwZGF0ZSBvZiB0b2Rvc1wiLCAtPlxuICAgIGl0IFwicmVmcmVzaGVzIG9uIHNhdmVcIiwgLT5cbiAgICAgIGV4cGVjdChzaG93VG9kb1ZpZXcuZ2V0VG9kb3MoKSkudG9IYXZlTGVuZ3RoIG51bWJlck9mVG9kb3NcblxuICAgICAgd2FpdHNGb3JQcm9taXNlIC0+IGF0b20ud29ya3NwYWNlLm9wZW4gJ3RlbXAudHh0J1xuICAgICAgcnVucyAtPlxuICAgICAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgICAgZWRpdG9yLnNldFRleHQoXCIjIFRPRE86IFRlc3RcIilcbiAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+IGVkaXRvci5zYXZlKClcbiAgICAgICAgcnVucyAtPlxuICAgICAgICAgIHdhaXRzRm9yIC0+ICFzaG93VG9kb1ZpZXcuaXNTZWFyY2hpbmcoKVxuICAgICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICAgIGV4cGVjdChzaG93VG9kb1ZpZXcuZ2V0VG9kb3MoKSkudG9IYXZlTGVuZ3RoIDRcbiAgICAgICAgICAgIGVkaXRvci5zZXRUZXh0KFwiXCIpXG4gICAgICAgICAgICB3YWl0c0ZvclByb21pc2UgLT4gZWRpdG9yLnNhdmUoKVxuICAgICAgICAgICAgcnVucyAtPlxuICAgICAgICAgICAgICB3YWl0c0ZvciAtPiAhc2hvd1RvZG9WaWV3LmlzU2VhcmNoaW5nKClcbiAgICAgICAgICAgICAgcnVucyAtPlxuICAgICAgICAgICAgICAgIGV4cGVjdChzaG93VG9kb1ZpZXcuZ2V0VG9kb3MoKSkudG9IYXZlTGVuZ3RoIG51bWJlck9mVG9kb3NcblxuICAgIGl0IFwiY2FuIHN0b3AgYXV0byByZWZyZXNoaW5nXCIsIC0+XG4gICAgICBhdG9tLmNvbmZpZy5zZXQgJ3RvZG8tc2hvdy5hdXRvUmVmcmVzaCcsIGZhbHNlXG5cbiAgICAgIGV4cGVjdChzaG93VG9kb1ZpZXcuZ2V0VG9kb3MoKSkudG9IYXZlTGVuZ3RoIG51bWJlck9mVG9kb3NcblxuICAgICAgd2FpdHNGb3JQcm9taXNlIC0+IGF0b20ud29ya3NwYWNlLm9wZW4gJ3RlbXAudHh0J1xuICAgICAgcnVucyAtPlxuICAgICAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgICAgZWRpdG9yLnNldFRleHQoXCIjIFRPRE86IFRlc3RcIilcbiAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+IGVkaXRvci5zYXZlKClcbiAgICAgICAgcnVucyAtPlxuICAgICAgICAgIHdhaXRzRm9yIC0+ICFzaG93VG9kb1ZpZXcuaXNTZWFyY2hpbmcoKVxuICAgICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICAgIGV4cGVjdChzaG93VG9kb1ZpZXcuZ2V0VG9kb3MoKSkudG9IYXZlTGVuZ3RoIG51bWJlck9mVG9kb3NcbiAgICAgICAgICAgIGVkaXRvci5zZXRUZXh0KFwiXCIpXG4gICAgICAgICAgICB3YWl0c0ZvclByb21pc2UgLT4gZWRpdG9yLnNhdmUoKVxuXG4gICAgaXQgXCJ1cGRhdGVzIG9uIHNlYXJjaCBzY29wZSBjaGFuZ2VcIiwgLT5cbiAgICAgIGV4cGVjdChzaG93VG9kb1ZpZXcuaXNTZWFyY2hpbmcoKSkudG9CZSBmYWxzZVxuICAgICAgZXhwZWN0KGNvbGxlY3Rpb24uZ2V0U2VhcmNoU2NvcGUoKSkudG9CZSAnd29ya3NwYWNlJ1xuICAgICAgZXhwZWN0KHNob3dUb2RvVmlldy5nZXRUb2RvcygpKS50b0hhdmVMZW5ndGggbnVtYmVyT2ZUb2Rvc1xuICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9nZ2xlU2VhcmNoU2NvcGUoKSkudG9CZSAncHJvamVjdCdcbiAgICAgIGV4cGVjdChzaG93VG9kb1ZpZXcuaXNTZWFyY2hpbmcoKSkudG9CZSB0cnVlXG5cbiAgICAgIHdhaXRzRm9yIC0+ICFzaG93VG9kb1ZpZXcuaXNTZWFyY2hpbmcoKVxuICAgICAgcnVucyAtPlxuICAgICAgICBleHBlY3Qoc2hvd1RvZG9WaWV3LmdldFRvZG9zKCkpLnRvSGF2ZUxlbmd0aCBudW1iZXJPZlRvZG9zXG4gICAgICAgIGV4cGVjdChjb2xsZWN0aW9uLnRvZ2dsZVNlYXJjaFNjb3BlKCkpLnRvQmUgJ29wZW4nXG4gICAgICAgIGV4cGVjdChzaG93VG9kb1ZpZXcuaXNTZWFyY2hpbmcoKSkudG9CZSB0cnVlXG5cbiAgICAgICAgd2FpdHNGb3IgLT4gIXNob3dUb2RvVmlldy5pc1NlYXJjaGluZygpXG4gICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICBleHBlY3Qoc2hvd1RvZG9WaWV3LmdldFRvZG9zKCkpLnRvSGF2ZUxlbmd0aCAwXG4gICAgICAgICAgZXhwZWN0KGNvbGxlY3Rpb24udG9nZ2xlU2VhcmNoU2NvcGUoKSkudG9CZSAnYWN0aXZlJ1xuICAgICAgICAgIGV4cGVjdChzaG93VG9kb1ZpZXcuaXNTZWFyY2hpbmcoKSkudG9CZSB0cnVlXG5cbiAgICAgICAgICB3YWl0c0ZvciAtPiAhc2hvd1RvZG9WaWV3LmlzU2VhcmNoaW5nKClcbiAgICAgICAgICBydW5zIC0+XG4gICAgICAgICAgICBleHBlY3Qoc2hvd1RvZG9WaWV3LmdldFRvZG9zKCkpLnRvSGF2ZUxlbmd0aCAwXG4gICAgICAgICAgICBleHBlY3QoY29sbGVjdGlvbi50b2dnbGVTZWFyY2hTY29wZSgpKS50b0JlICd3b3Jrc3BhY2UnXG4gICAgICAgICAgICBleHBlY3Qoc2hvd1RvZG9WaWV3LmlzU2VhcmNoaW5nKCkpLnRvQmUgdHJ1ZVxuXG4gICAgaXQgXCJoYW5kbGVzIHNlYXJjaCBzY29wZSAncHJvamVjdCdcIiwgLT5cbiAgICAgIGF0b20ucHJvamVjdC5hZGRQYXRoIHNhbXBsZTJQYXRoXG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuIHBhdGguam9pbihzYW1wbGUyUGF0aCwgJ3NhbXBsZS50eHQnKVxuICAgICAgcnVucyAtPlxuICAgICAgICBjb2xsZWN0aW9uLnNldFNlYXJjaFNjb3BlICd3b3Jrc3BhY2UnXG5cbiAgICAgICAgd2FpdHNGb3IgLT4gIXNob3dUb2RvVmlldy5pc1NlYXJjaGluZygpXG4gICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICBleHBlY3Qoc2hvd1RvZG9WaWV3LmdldFRvZG9zKCkpLnRvSGF2ZUxlbmd0aCA5XG4gICAgICAgICAgY29sbGVjdGlvbi5zZXRTZWFyY2hTY29wZSAncHJvamVjdCdcbiAgICAgICAgICBleHBlY3Qoc2hvd1RvZG9WaWV3LmlzU2VhcmNoaW5nKCkpLnRvQmUgdHJ1ZVxuXG4gICAgICAgICAgd2FpdHNGb3IgLT4gIXNob3dUb2RvVmlldy5pc1NlYXJjaGluZygpXG4gICAgICAgICAgcnVucyAtPlxuICAgICAgICAgICAgZXhwZWN0KHNob3dUb2RvVmlldy5nZXRUb2RvcygpKS50b0hhdmVMZW5ndGggNlxuXG4gICAgICAgICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbiBwYXRoLmpvaW4oc2FtcGxlMVBhdGgsICdzYW1wbGUuYycpXG4gICAgICAgICAgICB3YWl0c0ZvciAtPiAhc2hvd1RvZG9WaWV3LmlzU2VhcmNoaW5nKClcbiAgICAgICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICAgICAgZXhwZWN0KHNob3dUb2RvVmlldy5nZXRUb2RvcygpKS50b0hhdmVMZW5ndGggbnVtYmVyT2ZUb2Rvc1xuXG4gICAgaXQgXCJoYW5kbGVzIHNlYXJjaCBzY29wZSAnb3BlbidcIiwgLT5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBhdG9tLndvcmtzcGFjZS5vcGVuICdzYW1wbGUuYydcbiAgICAgIHdhaXRzRm9yIC0+ICFzaG93VG9kb1ZpZXcuaXNTZWFyY2hpbmcoKVxuICAgICAgcnVucyAtPlxuICAgICAgICBleHBlY3Qoc2hvd1RvZG9WaWV3LmdldFRvZG9zKCkpLnRvSGF2ZUxlbmd0aCBudW1iZXJPZlRvZG9zXG4gICAgICAgIGNvbGxlY3Rpb24uc2V0U2VhcmNoU2NvcGUgJ29wZW4nXG4gICAgICAgIGV4cGVjdChzaG93VG9kb1ZpZXcuaXNTZWFyY2hpbmcoKSkudG9CZSB0cnVlXG5cbiAgICAgICAgd2FpdHNGb3IgLT4gIXNob3dUb2RvVmlldy5pc1NlYXJjaGluZygpXG4gICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICBleHBlY3Qoc2hvd1RvZG9WaWV3LmdldFRvZG9zKCkpLnRvSGF2ZUxlbmd0aCAxXG5cbiAgICAgICAgICB3YWl0c0ZvclByb21pc2UgLT4gYXRvbS53b3Jrc3BhY2Uub3BlbiAnc2FtcGxlLmpzJ1xuICAgICAgICAgIHdhaXRzRm9yIC0+ICFzaG93VG9kb1ZpZXcuaXNTZWFyY2hpbmcoKVxuICAgICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICAgIGV4cGVjdChzaG93VG9kb1ZpZXcuZ2V0VG9kb3MoKSkudG9IYXZlTGVuZ3RoIG51bWJlck9mVG9kb3NcbiAgICAgICAgICAgIGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKS5pdGVtQXRJbmRleCgwKS5kZXN0cm95KClcblxuICAgICAgICAgICAgd2FpdHNGb3IgLT4gIXNob3dUb2RvVmlldy5pc1NlYXJjaGluZygpXG4gICAgICAgICAgICBydW5zIC0+XG4gICAgICAgICAgICAgIGV4cGVjdChzaG93VG9kb1ZpZXcuZ2V0VG9kb3MoKSkudG9IYXZlTGVuZ3RoIDJcblxuICAgIGl0IFwiaGFuZGxlcyBzZWFyY2ggc2NvcGUgJ2FjdGl2ZSdcIiwgLT5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBhdG9tLndvcmtzcGFjZS5vcGVuICdzYW1wbGUuYydcbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBhdG9tLndvcmtzcGFjZS5vcGVuICdzYW1wbGUuanMnXG4gICAgICB3YWl0c0ZvciAtPiAhc2hvd1RvZG9WaWV3LmlzU2VhcmNoaW5nKClcbiAgICAgIHJ1bnMgLT5cbiAgICAgICAgZXhwZWN0KHNob3dUb2RvVmlldy5nZXRUb2RvcygpKS50b0hhdmVMZW5ndGggbnVtYmVyT2ZUb2Rvc1xuICAgICAgICBjb2xsZWN0aW9uLnNldFNlYXJjaFNjb3BlICdhY3RpdmUnXG4gICAgICAgIGV4cGVjdChzaG93VG9kb1ZpZXcuaXNTZWFyY2hpbmcoKSkudG9CZSB0cnVlXG5cbiAgICAgICAgd2FpdHNGb3IgLT4gIXNob3dUb2RvVmlldy5pc1NlYXJjaGluZygpXG4gICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICBleHBlY3Qoc2hvd1RvZG9WaWV3LmdldFRvZG9zKCkpLnRvSGF2ZUxlbmd0aCAyXG4gICAgICAgICAgYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpLmFjdGl2YXRlSXRlbUF0SW5kZXggMFxuXG4gICAgICAgICAgd2FpdHNGb3IgLT4gIXNob3dUb2RvVmlldy5pc1NlYXJjaGluZygpXG4gICAgICAgICAgcnVucyAtPlxuICAgICAgICAgICAgZXhwZWN0KHNob3dUb2RvVmlldy5nZXRUb2RvcygpKS50b0hhdmVMZW5ndGggMVxuIl19
