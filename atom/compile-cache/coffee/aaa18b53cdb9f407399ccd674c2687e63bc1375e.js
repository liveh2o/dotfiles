(function() {
  describe('IndieRegistry', function() {
    var IndieRegistry, indieRegistry;
    IndieRegistry = require('../lib/indie-registry');
    indieRegistry = null;
    beforeEach(function() {
      if (indieRegistry != null) {
        indieRegistry.dispose();
      }
      return indieRegistry = new IndieRegistry();
    });
    describe('register', function() {
      return it('validates the args', function() {
        expect(function() {
          return indieRegistry.register({
            name: 2
          });
        }).toThrow();
        indieRegistry.register({});
        return indieRegistry.register({
          name: 'wow'
        });
      });
    });
    return describe('all of it', function() {
      return it('works', function() {
        var indie, listener, messages, observeListener;
        indie = indieRegistry.register({
          name: 'Wow'
        });
        expect(indieRegistry.has(indie)).toBe(false);
        expect(indieRegistry.has(0)).toBe(false);
        listener = jasmine.createSpy('linter.indie.messaging');
        observeListener = jasmine.createSpy('linter.indie.observe');
        messages = [{}];
        indieRegistry.onDidUpdateMessages(listener);
        indieRegistry.observe(observeListener);
        indie.setMessages(messages);
        expect(observeListener).toHaveBeenCalled();
        expect(observeListener).toHaveBeenCalledWith(indie);
        expect(listener).toHaveBeenCalled();
        expect(listener.mostRecentCall.args[0].linter.toBe(indie));
        expect(listener.mostRecentCall.args[0].messages.toBe(messages));
        indie.dispose();
        return expect(indieRegistry.has(indie)).toBe(false);
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9zcGVjL2luZGllLXJlZ2lzdHJ5LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsRUFBQSxRQUFBLENBQVMsZUFBVCxFQUEwQixTQUFBLEdBQUE7QUFDeEIsUUFBQSw0QkFBQTtBQUFBLElBQUEsYUFBQSxHQUFnQixPQUFBLENBQVEsdUJBQVIsQ0FBaEIsQ0FBQTtBQUFBLElBQ0EsYUFBQSxHQUFnQixJQURoQixDQUFBO0FBQUEsSUFHQSxVQUFBLENBQVcsU0FBQSxHQUFBOztRQUNULGFBQWEsQ0FBRSxPQUFmLENBQUE7T0FBQTthQUNBLGFBQUEsR0FBb0IsSUFBQSxhQUFBLENBQUEsRUFGWDtJQUFBLENBQVgsQ0FIQSxDQUFBO0FBQUEsSUFPQSxRQUFBLENBQVMsVUFBVCxFQUFxQixTQUFBLEdBQUE7YUFDbkIsRUFBQSxDQUFHLG9CQUFILEVBQXlCLFNBQUEsR0FBQTtBQUN2QixRQUFBLE1BQUEsQ0FBTyxTQUFBLEdBQUE7aUJBQ0wsYUFBYSxDQUFDLFFBQWQsQ0FBdUI7QUFBQSxZQUFDLElBQUEsRUFBTSxDQUFQO1dBQXZCLEVBREs7UUFBQSxDQUFQLENBRUEsQ0FBQyxPQUZELENBQUEsQ0FBQSxDQUFBO0FBQUEsUUFHQSxhQUFhLENBQUMsUUFBZCxDQUF1QixFQUF2QixDQUhBLENBQUE7ZUFJQSxhQUFhLENBQUMsUUFBZCxDQUF1QjtBQUFBLFVBQUMsSUFBQSxFQUFNLEtBQVA7U0FBdkIsRUFMdUI7TUFBQSxDQUF6QixFQURtQjtJQUFBLENBQXJCLENBUEEsQ0FBQTtXQWVBLFFBQUEsQ0FBUyxXQUFULEVBQXNCLFNBQUEsR0FBQTthQUNwQixFQUFBLENBQUcsT0FBSCxFQUFZLFNBQUEsR0FBQTtBQUNWLFlBQUEsMENBQUE7QUFBQSxRQUFBLEtBQUEsR0FBUSxhQUFhLENBQUMsUUFBZCxDQUF1QjtBQUFBLFVBQUMsSUFBQSxFQUFNLEtBQVA7U0FBdkIsQ0FBUixDQUFBO0FBQUEsUUFDQSxNQUFBLENBQU8sYUFBYSxDQUFDLEdBQWQsQ0FBa0IsS0FBbEIsQ0FBUCxDQUFnQyxDQUFDLElBQWpDLENBQXNDLEtBQXRDLENBREEsQ0FBQTtBQUFBLFFBRUEsTUFBQSxDQUFPLGFBQWEsQ0FBQyxHQUFkLENBQWtCLENBQWxCLENBQVAsQ0FBNEIsQ0FBQyxJQUE3QixDQUFrQyxLQUFsQyxDQUZBLENBQUE7QUFBQSxRQUlBLFFBQUEsR0FBVyxPQUFPLENBQUMsU0FBUixDQUFrQix3QkFBbEIsQ0FKWCxDQUFBO0FBQUEsUUFLQSxlQUFBLEdBQWtCLE9BQU8sQ0FBQyxTQUFSLENBQWtCLHNCQUFsQixDQUxsQixDQUFBO0FBQUEsUUFNQSxRQUFBLEdBQVcsQ0FBQyxFQUFELENBTlgsQ0FBQTtBQUFBLFFBT0EsYUFBYSxDQUFDLG1CQUFkLENBQWtDLFFBQWxDLENBUEEsQ0FBQTtBQUFBLFFBUUEsYUFBYSxDQUFDLE9BQWQsQ0FBc0IsZUFBdEIsQ0FSQSxDQUFBO0FBQUEsUUFTQSxLQUFLLENBQUMsV0FBTixDQUFrQixRQUFsQixDQVRBLENBQUE7QUFBQSxRQVVBLE1BQUEsQ0FBTyxlQUFQLENBQXVCLENBQUMsZ0JBQXhCLENBQUEsQ0FWQSxDQUFBO0FBQUEsUUFXQSxNQUFBLENBQU8sZUFBUCxDQUF1QixDQUFDLG9CQUF4QixDQUE2QyxLQUE3QyxDQVhBLENBQUE7QUFBQSxRQVlBLE1BQUEsQ0FBTyxRQUFQLENBQWdCLENBQUMsZ0JBQWpCLENBQUEsQ0FaQSxDQUFBO0FBQUEsUUFhQSxNQUFBLENBQU8sUUFBUSxDQUFDLGNBQWMsQ0FBQyxJQUFLLENBQUEsQ0FBQSxDQUFFLENBQUMsTUFBTSxDQUFDLElBQXZDLENBQTRDLEtBQTVDLENBQVAsQ0FiQSxDQUFBO0FBQUEsUUFjQSxNQUFBLENBQU8sUUFBUSxDQUFDLGNBQWMsQ0FBQyxJQUFLLENBQUEsQ0FBQSxDQUFFLENBQUMsUUFBUSxDQUFDLElBQXpDLENBQThDLFFBQTlDLENBQVAsQ0FkQSxDQUFBO0FBQUEsUUFlQSxLQUFLLENBQUMsT0FBTixDQUFBLENBZkEsQ0FBQTtlQWdCQSxNQUFBLENBQU8sYUFBYSxDQUFDLEdBQWQsQ0FBa0IsS0FBbEIsQ0FBUCxDQUFnQyxDQUFDLElBQWpDLENBQXNDLEtBQXRDLEVBakJVO01BQUEsQ0FBWixFQURvQjtJQUFBLENBQXRCLEVBaEJ3QjtFQUFBLENBQTFCLENBQUEsQ0FBQTtBQUFBIgp9

//# sourceURL=/Users/ah/.atom/packages/linter/spec/indie-registry.coffee
