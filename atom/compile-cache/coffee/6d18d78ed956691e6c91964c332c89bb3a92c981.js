(function() {
  describe('Linter Indie API', function() {
    var Remote, linter, wait;
    linter = null;
    wait = require('./common').wait;
    Remote = require('remote');
    beforeEach(function() {
      global.setTimeout = Remote.getGlobal('setTimeout');
      global.setInterval = Remote.getGlobal('setInterval');
      return waitsForPromise(function() {
        return atom.packages.activate('linter').then(function() {
          return linter = atom.packages.getActivePackage(linter);
        });
      });
    });
    return describe('it works', function() {
      var indieLinter;
      indieLinter = linter.indieLinter.register({
        name: 'Wow'
      });
      indieLinter.setMessages([
        {
          type: 'Error',
          text: 'Hey!'
        }
      ]);
      return waitsForPromise(function() {
        return wait(100).then(function() {
          expect(linter.messages.publicMessages.length).toBe(1);
          indieLinter.deleteMessages();
          return wait(100);
        }).then(function() {
          return expect(linter.messages.publicMessages.length).toBe(0);
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9zcGVjL2xpbnRlci1pbmRpZS1hcGkuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxFQUFBLFFBQUEsQ0FBUyxrQkFBVCxFQUE2QixTQUFBLEdBQUE7QUFFM0IsUUFBQSxvQkFBQTtBQUFBLElBQUEsTUFBQSxHQUFTLElBQVQsQ0FBQTtBQUFBLElBQ0MsT0FBUSxPQUFBLENBQVEsVUFBUixFQUFSLElBREQsQ0FBQTtBQUFBLElBRUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxRQUFSLENBRlQsQ0FBQTtBQUFBLElBSUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsTUFBTSxDQUFDLFVBQVAsR0FBb0IsTUFBTSxDQUFDLFNBQVAsQ0FBaUIsWUFBakIsQ0FBcEIsQ0FBQTtBQUFBLE1BQ0EsTUFBTSxDQUFDLFdBQVAsR0FBcUIsTUFBTSxDQUFDLFNBQVAsQ0FBaUIsYUFBakIsQ0FEckIsQ0FBQTthQUVBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQ2QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLFFBQXZCLENBQWdDLENBQUMsSUFBakMsQ0FBc0MsU0FBQSxHQUFBO2lCQUNwQyxNQUFBLEdBQVMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZCxDQUErQixNQUEvQixFQUQyQjtRQUFBLENBQXRDLEVBRGM7TUFBQSxDQUFoQixFQUhTO0lBQUEsQ0FBWCxDQUpBLENBQUE7V0FXQSxRQUFBLENBQVMsVUFBVCxFQUFxQixTQUFBLEdBQUE7QUFDbkIsVUFBQSxXQUFBO0FBQUEsTUFBQSxXQUFBLEdBQWMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxRQUFuQixDQUE0QjtBQUFBLFFBQUMsSUFBQSxFQUFNLEtBQVA7T0FBNUIsQ0FBZCxDQUFBO0FBQUEsTUFDQSxXQUFXLENBQUMsV0FBWixDQUF3QjtRQUFDO0FBQUEsVUFBQyxJQUFBLEVBQU0sT0FBUDtBQUFBLFVBQWdCLElBQUEsRUFBTSxNQUF0QjtTQUFEO09BQXhCLENBREEsQ0FBQTthQUVBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQ2QsSUFBQSxDQUFLLEdBQUwsQ0FBUyxDQUFDLElBQVYsQ0FBZSxTQUFBLEdBQUE7QUFDYixVQUFBLE1BQUEsQ0FBTyxNQUFNLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxNQUF0QyxDQUE2QyxDQUFDLElBQTlDLENBQW1ELENBQW5ELENBQUEsQ0FBQTtBQUFBLFVBQ0EsV0FBVyxDQUFDLGNBQVosQ0FBQSxDQURBLENBQUE7aUJBRUEsSUFBQSxDQUFLLEdBQUwsRUFIYTtRQUFBLENBQWYsQ0FJQSxDQUFDLElBSkQsQ0FJTSxTQUFBLEdBQUE7aUJBQ0osTUFBQSxDQUFPLE1BQU0sQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLE1BQXRDLENBQTZDLENBQUMsSUFBOUMsQ0FBbUQsQ0FBbkQsRUFESTtRQUFBLENBSk4sRUFEYztNQUFBLENBQWhCLEVBSG1CO0lBQUEsQ0FBckIsRUFiMkI7RUFBQSxDQUE3QixDQUFBLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/ah/.atom/packages/linter/spec/linter-indie-api.coffee
