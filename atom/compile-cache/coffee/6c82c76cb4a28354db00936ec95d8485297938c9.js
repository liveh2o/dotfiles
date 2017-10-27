(function() {
  var ShowTodo;

  ShowTodo = require('../lib/show-todo');

  describe('ShowTodo', function() {
    var activationPromise, executeCommand, workspaceElement, _ref;
    _ref = [], workspaceElement = _ref[0], activationPromise = _ref[1];
    executeCommand = function(callback) {
      atom.commands.dispatch(workspaceElement, 'todo-show:find-in-project');
      waitsForPromise(function() {
        return activationPromise;
      });
      return runs(callback);
    };
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      return activationPromise = atom.packages.activatePackage('todo-show');
    });
    describe('when the show-todo:find-in-project event is triggered', function() {
      return it('attaches and then detaches the pane view', function() {
        expect(atom.packages.loadedPackages["todo-show"]).toBeDefined();
        expect(workspaceElement.querySelector('.show-todo-preview')).not.toExist();
        return executeCommand(function() {
          expect(workspaceElement.querySelector('.show-todo-preview')).toExist();
          return executeCommand(function() {
            return expect(workspaceElement.querySelector('.show-todo-preview')).not.toExist();
          });
        });
      });
    });
    return describe('when config changes', function() {
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
  });

}).call(this);
