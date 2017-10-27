(function() {
  var DefaultFileIcons, FileIcons;

  DefaultFileIcons = require('../lib/default-file-icons');

  FileIcons = require('../lib/file-icons');

  describe('FileIcons', function() {
    afterEach(function() {
      return FileIcons.setService(new DefaultFileIcons);
    });
    it('provides a default', function() {
      expect(FileIcons.getService()).toBeDefined();
      return expect(FileIcons.getService()).not.toBeNull();
    });
    it('allows the default to be overridden', function() {
      var service;
      service = new Object;
      FileIcons.setService(service);
      return expect(FileIcons.getService()).toBe(service);
    });
    it('allows the service to be reset to the default easily', function() {
      var service;
      service = new Object;
      FileIcons.setService(service);
      FileIcons.resetService();
      return expect(FileIcons.getService()).not.toBe(service);
    });
    return describe('Class handling', function() {
      var workspaceElement;
      workspaceElement = null;
      beforeEach(function() {
        workspaceElement = atom.views.getView(atom.workspace);
        waitsForPromise(function() {
          return atom.workspace.open('sample.js');
        });
        return waitsForPromise(function() {
          return atom.packages.activatePackage('tabs');
        });
      });
      it('allows multiple classes to be passed', function() {
        var service, tab;
        service = {
          iconClassForPath: function(path) {
            return 'first second';
          }
        };
        FileIcons.setService(service);
        tab = workspaceElement.querySelector('.tab');
        tab.updateIcon();
        return expect(tab.itemTitle.className).toBe('title icon first second');
      });
      it('allows an array of classes to be passed', function() {
        var service, tab;
        service = {
          iconClassForPath: function(path) {
            return ['first', 'second'];
          }
        };
        FileIcons.setService(service);
        tab = workspaceElement.querySelector('.tab');
        tab.updateIcon();
        return expect(tab.itemTitle.className).toBe('title icon first second');
      });
      return it('passes a TabView reference as iconClassForPath\'s second argument', function() {
        var tab;
        FileIcons.setService({
          iconClassForPath: function(path, tab) {
            return tab.constructor.name;
          }
        });
        tab = workspaceElement.querySelector('.tab');
        tab.updateIcon();
        return expect(tab.itemTitle.className).toBe('title icon tabs-tab');
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RhYnMvc3BlYy9maWxlLWljb25zLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDJCQUFBOztBQUFBLEVBQUEsZ0JBQUEsR0FBbUIsT0FBQSxDQUFRLDJCQUFSLENBQW5CLENBQUE7O0FBQUEsRUFDQSxTQUFBLEdBQVksT0FBQSxDQUFRLG1CQUFSLENBRFosQ0FBQTs7QUFBQSxFQUdBLFFBQUEsQ0FBUyxXQUFULEVBQXNCLFNBQUEsR0FBQTtBQUNwQixJQUFBLFNBQUEsQ0FBVSxTQUFBLEdBQUE7YUFDUixTQUFTLENBQUMsVUFBVixDQUFxQixHQUFBLENBQUEsZ0JBQXJCLEVBRFE7SUFBQSxDQUFWLENBQUEsQ0FBQTtBQUFBLElBR0EsRUFBQSxDQUFHLG9CQUFILEVBQXlCLFNBQUEsR0FBQTtBQUN2QixNQUFBLE1BQUEsQ0FBTyxTQUFTLENBQUMsVUFBVixDQUFBLENBQVAsQ0FBOEIsQ0FBQyxXQUEvQixDQUFBLENBQUEsQ0FBQTthQUNBLE1BQUEsQ0FBTyxTQUFTLENBQUMsVUFBVixDQUFBLENBQVAsQ0FBOEIsQ0FBQyxHQUFHLENBQUMsUUFBbkMsQ0FBQSxFQUZ1QjtJQUFBLENBQXpCLENBSEEsQ0FBQTtBQUFBLElBT0EsRUFBQSxDQUFHLHFDQUFILEVBQTBDLFNBQUEsR0FBQTtBQUN4QyxVQUFBLE9BQUE7QUFBQSxNQUFBLE9BQUEsR0FBVSxHQUFBLENBQUEsTUFBVixDQUFBO0FBQUEsTUFDQSxTQUFTLENBQUMsVUFBVixDQUFxQixPQUFyQixDQURBLENBQUE7YUFHQSxNQUFBLENBQU8sU0FBUyxDQUFDLFVBQVYsQ0FBQSxDQUFQLENBQThCLENBQUMsSUFBL0IsQ0FBb0MsT0FBcEMsRUFKd0M7SUFBQSxDQUExQyxDQVBBLENBQUE7QUFBQSxJQWFBLEVBQUEs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

//# sourceURL=/Users/ah/.atom/packages/tabs/spec/file-icons-spec.coffee
