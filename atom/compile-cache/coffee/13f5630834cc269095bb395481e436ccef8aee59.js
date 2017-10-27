(function() {
  var fs, path, temp;

  fs = require('fs-plus');

  path = require('path');

  temp = require('temp').track();

  describe('MRU List', function() {
    var workspaceElement;
    workspaceElement = null;
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      waitsForPromise(function() {
        return atom.workspace.open('sample.js');
      });
      return waitsForPromise(function() {
        return atom.packages.activatePackage("tabs");
      });
    });
    describe(".activate()", function() {
      var initialPaneCount;
      initialPaneCount = atom.workspace.getPanes().length;
      it("has exactly one modal panel per pane", function() {
        var pane;
        expect(workspaceElement.querySelectorAll('.tabs-mru-switcher').length).toBe(initialPaneCount);
        pane = atom.workspace.getActivePane();
        pane.splitRight();
        expect(workspaceElement.querySelectorAll('.tabs-mru-switcher').length).toBe(initialPaneCount + 1);
        pane = atom.workspace.getActivePane();
        pane.splitDown();
        expect(workspaceElement.querySelectorAll('.tabs-mru-switcher').length).toBe(initialPaneCount + 2);
        waitsForPromise(function() {
          pane = atom.workspace.getActivePane();
          return Promise.resolve(pane.close());
        });
        runs(function() {
          return expect(workspaceElement.querySelectorAll('.tabs-mru-switcher').length).toBe(initialPaneCount + 1);
        });
        waitsForPromise(function() {
          pane = atom.workspace.getActivePane();
          return Promise.resolve(pane.close());
        });
        return runs(function() {
          return expect(workspaceElement.querySelectorAll('.tabs-mru-switcher').length).toBe(initialPaneCount);
        });
      });
      it("Doesn't build list until activated for the first time", function() {
        expect(workspaceElement.querySelectorAll('.tabs-mru-switcher').length).toBe(initialPaneCount);
        return expect(workspaceElement.querySelectorAll('.tabs-mru-switcher li').length).toBe(0);
      });
      return it("Doesn't activate when a single pane item is open", function() {
        var pane;
        pane = atom.workspace.getActivePane();
        atom.commands.dispatch(pane, 'pane:show-next-recently-used-item');
        return expect(workspaceElement.querySelectorAll('.tabs-mru-switcher li').length).toBe(0);
      });
    });
    describe("contents", function() {
      var pane;
      pane = null;
      beforeEach(function() {
        waitsForPromise(function() {
          return atom.workspace.open("sample.png");
        });
        return pane = atom.workspace.getActivePane();
      });
      it("has one item per tab", function() {
        if (pane.onChooseNextMRUItem != null) {
          expect(pane.getItems().length).toBe(2);
          atom.commands.dispatch(workspaceElement, 'pane:show-next-recently-used-item');
          return expect(workspaceElement.querySelectorAll('.tabs-mru-switcher li').length).toBe(2);
        }
      });
      return it("switches between two items", function() {
        var firstActiveItem, fourthActiveItem, secondActiveItem, thirdActiveItem;
        firstActiveItem = pane.getActiveItem();
        atom.commands.dispatch(workspaceElement, 'pane:show-next-recently-used-item');
        secondActiveItem = pane.getActiveItem();
        expect(secondActiveItem).toNotBe(firstActiveItem);
        atom.commands.dispatch(workspaceElement, 'pane:move-active-item-to-top-of-stack');
        thirdActiveItem = pane.getActiveItem();
        expect(thirdActiveItem).toBe(secondActiveItem);
        atom.commands.dispatch(workspaceElement, 'pane:show-next-recently-used-item');
        atom.commands.dispatch(workspaceElement, 'pane:move-active-item-to-top-of-stack');
        fourthActiveItem = pane.getActiveItem();
        return expect(fourthActiveItem).toBe(firstActiveItem);
      });
    });
    return describe("config", function() {
      var configKey, dotAtomPath;
      configKey = 'tabs.enableMruTabSwitching';
      dotAtomPath = null;
      beforeEach(function() {
        dotAtomPath = temp.path('tabs-spec-mru-config');
        atom.config.configDirPath = dotAtomPath;
        atom.config.configFilePath = path.join(atom.config.configDirPath, "atom.config.cson");
        return atom.keymaps.configDirPath = dotAtomPath;
      });
      afterEach(function() {
        return fs.removeSync(dotAtomPath);
      });
      it("defaults on", function() {
        var bindings;
        expect(atom.config.get(configKey)).toBe(true);
        bindings = atom.keymaps.findKeyBindings({
          target: document.body,
          keystrokes: 'ctrl-tab'
        });
        expect(bindings.length).toBe(1);
        expect(bindings[0].command).toBe('pane:show-next-recently-used-item');
        bindings = atom.keymaps.findKeyBindings({
          target: document.body,
          keystrokes: 'ctrl-tab ^ctrl'
        });
        expect(bindings.length).toBe(1);
        expect(bindings[0].command).toBe('pane:move-active-item-to-top-of-stack');
        bindings = atom.keymaps.findKeyBindings({
          target: document.body,
          keystrokes: 'ctrl-shift-tab'
        });
        expect(bindings.length).toBe(1);
        expect(bindings[0].command).toBe('pane:show-previous-recently-used-item');
        bindings = atom.keymaps.findKeyBindings({
          target: document.body,
          keystrokes: 'ctrl-shift-tab ^ctrl'
        });
        expect(bindings.length).toBe(1);
        return expect(bindings[0].command).toBe('pane:move-active-item-to-top-of-stack');
      });
      return it("alters keybindings when disabled", function() {
        var bindings;
        atom.config.set(configKey, false);
        bindings = atom.keymaps.findKeyBindings({
          target: document.body,
          keystrokes: 'ctrl-tab'
        });
        expect(bindings.length).toBe(2);
        expect(bindings[0].command).toBe('pane:show-next-item');
        bindings = atom.keymaps.findKeyBindings({
          target: document.body,
          keystrokes: 'ctrl-tab ^ctrl'
        });
        expect(bindings.length).toBe(2);
        expect(bindings[0].command).toBe('unset!');
        bindings = atom.keymaps.findKeyBindings({
          target: document.body,
          keystrokes: 'ctrl-shift-tab'
        });
        expect(bindings.length).toBe(2);
        expect(bindings[0].command).toBe('pane:show-previous-item');
        bindings = atom.keymaps.findKeyBindings({
          target: document.body,
          keystrokes: 'ctrl-shift-tab ^ctrl'
        });
        expect(bindings.length).toBe(2);
        return expect(bindings[0].command).toBe('unset!');
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RhYnMvc3BlYy9tcnUtbGlzdC1zcGVjLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSOztFQUNMLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFDUCxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBZSxDQUFDLEtBQWhCLENBQUE7O0VBRVAsUUFBQSxDQUFTLFVBQVQsRUFBcUIsU0FBQTtBQUNuQixRQUFBO0lBQUEsZ0JBQUEsR0FBbUI7SUFFbkIsVUFBQSxDQUFXLFNBQUE7TUFDVCxnQkFBQSxHQUFtQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBSSxDQUFDLFNBQXhCO01BRW5CLGVBQUEsQ0FBZ0IsU0FBQTtlQUNkLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixXQUFwQjtNQURjLENBQWhCO2FBR0EsZUFBQSxDQUFnQixTQUFBO2VBQ2QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLE1BQTlCO01BRGMsQ0FBaEI7SUFOUyxDQUFYO0lBU0EsUUFBQSxDQUFTLGFBQVQsRUFBd0IsU0FBQTtBQUN0QixVQUFBO01BQUEsZ0JBQUEsR0FBbUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFmLENBQUEsQ0FBeUIsQ0FBQztNQUU3QyxFQUFBLENBQUcsc0NBQUgsRUFBMkMsU0FBQTtBQUN6QyxZQUFBO1FBQUEsTUFBQSxDQUFPLGdCQUFnQixDQUFDLGdCQUFqQixDQUFrQyxvQkFBbEMsQ0FBdUQsQ0FBQyxNQUEvRCxDQUFzRSxDQUFDLElBQXZFLENBQTRFLGdCQUE1RTtRQUVBLElBQUEsR0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBQTtRQUNQLElBQUksQ0FBQyxVQUFMLENBQUE7UUFDQSxNQUFBLENBQU8sZ0JBQWdCLENBQUMs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LEVBQVksZ0JBRFo7U0FEUztRQUdYLE1BQUEsQ0FBTyxRQUFRLENBQUMsTUFBaEIsQ0FBdUIsQ0FBQyxJQUF4QixDQUE2QixDQUE3QjtRQUNBLE1BQUEsQ0FBTyxRQUFTLENBQUEsQ0FBQSxDQUFFLENBQUMsT0FBbkIsQ0FBMkIsQ0FBQyxJQUE1QixDQUFpQyx5QkFBakM7UUFFQSxRQUFBLEdBQVcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxlQUFiLENBQ1Q7VUFBQSxNQUFBLEVBQVEsUUFBUSxDQUFDLElBQWpCO1VBQ0EsVUFBQSxFQUFZLHNCQURaO1NBRFM7UUFHWCxNQUFBLENBQU8sUUFBUSxDQUFDLE1BQWhCLENBQXVCLENBQUMsSUFBeEIsQ0FBNkIsQ0FBN0I7ZUFDQSxNQUFBLENBQU8sUUFBUyxDQUFBLENBQUEsQ0FBRSxDQUFDLE9BQW5CLENBQTJCLENBQUMsSUFBNUIsQ0FBaUMsUUFBakM7TUF4QnFDLENBQXZDO0lBeENpQixDQUFuQjtFQTVFbUIsQ0FBckI7QUFKQSIsInNvdXJjZXNDb250ZW50IjpbImZzID0gcmVxdWlyZSAnZnMtcGx1cydcbnBhdGggPSByZXF1aXJlICdwYXRoJ1xudGVtcCA9IHJlcXVpcmUoJ3RlbXAnKS50cmFjaygpXG5cbmRlc2NyaWJlICdNUlUgTGlzdCcsIC0+XG4gIHdvcmtzcGFjZUVsZW1lbnQgPSBudWxsXG5cbiAgYmVmb3JlRWFjaCAtPlxuICAgIHdvcmtzcGFjZUVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpXG5cbiAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oJ3NhbXBsZS5qcycpXG5cbiAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgIGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKFwidGFic1wiKVxuXG4gIGRlc2NyaWJlIFwiLmFjdGl2YXRlKClcIiwgLT5cbiAgICBpbml0aWFsUGFuZUNvdW50ID0gYXRvbS53b3Jrc3BhY2UuZ2V0UGFuZXMoKS5sZW5ndGhcblxuICAgIGl0IFwiaGFzIGV4YWN0bHkgb25lIG1vZGFsIHBhbmVsIHBlciBwYW5lXCIsIC0+XG4gICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudGFicy1tcnUtc3dpdGNoZXInKS5sZW5ndGgpLnRvQmUgaW5pdGlhbFBhbmVDb3VudFxuXG4gICAgICBwYW5lID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpXG4gICAgICBwYW5lLnNwbGl0UmlnaHQoKVxuICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRhYnMtbXJ1LXN3aXRjaGVyJykubGVuZ3RoKS50b0JlIGluaXRpYWxQYW5lQ291bnQgKyAxXG5cbiAgICAgIHBhbmUgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKClcbiAgICAgIHBhbmUuc3BsaXREb3duKClcbiAgICAgIGV4cGVjdCh3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWJzLW1ydS1zd2l0Y2hlcicpLmxlbmd0aCkudG9CZSBpbml0aWFsUGFuZUNvdW50ICsgMlxuXG4gICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgcGFuZSA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKVxuICAgICAgICBQcm9taXNlLnJlc29sdmUocGFuZS5jbG9zZSgpKVxuXG4gICAgICBydW5zIC0+XG4gICAgICAgIGV4cGVjdCh3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWJzLW1ydS1zd2l0Y2hlcicpLmxlbmd0aCkudG9CZSBpbml0aWFsUGFuZUNvdW50ICsgMVxuXG4gICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgcGFuZSA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKVxuICAgICAgICBQcm9taXNlLnJlc29sdmUocGFuZS5jbG9zZSgpKVxuXG4gICAgICBydW5zIC0+XG4gICAgICAgIGV4cGVjdCh3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWJzLW1ydS1zd2l0Y2hlcicpLmxlbmd0aCkudG9CZSBpbml0aWFsUGFuZUNvdW50XG5cbiAgICBpdCBcIkRvZXNuJ3QgYnVpbGQgbGlzdCB1bnRpbCBhY3RpdmF0ZWQgZm9yIHRoZSBmaXJzdCB0aW1lXCIsIC0+XG4gICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudGFicy1tcnUtc3dpdGNoZXInKS5sZW5ndGgpLnRvQmUgaW5pdGlhbFBhbmVDb3VudFxuICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRhYnMtbXJ1LXN3aXRjaGVyIGxpJykubGVuZ3RoKS50b0JlIDBcblxuICAgIGl0IFwiRG9lc24ndCBhY3RpdmF0ZSB3aGVuIGEgc2luZ2xlIHBhbmUgaXRlbSBpcyBvcGVuXCIsIC0+XG4gICAgICBwYW5lID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpXG4gICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHBhbmUsICdwYW5lOnNob3ctbmV4dC1yZWNlbnRseS11c2VkLWl0ZW0nKVxuICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRhYnMtbXJ1LXN3aXRjaGVyIGxpJykubGVuZ3RoKS50b0JlIDBcblxuICBkZXNjcmliZSBcImNvbnRlbnRzXCIsIC0+XG4gICAgcGFuZSA9IG51bGxcblxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKFwic2FtcGxlLnBuZ1wiKVxuICAgICAgcGFuZSA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKVxuXG4gICAgaXQgXCJoYXMgb25lIGl0ZW0gcGVyIHRhYlwiLCAtPlxuICAgICAgaWYgcGFuZS5vbkNob29zZU5leHRNUlVJdGVtP1xuICAgICAgICBleHBlY3QocGFuZS5nZXRJdGVtcygpLmxlbmd0aCkudG9CZSAyXG4gICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2god29ya3NwYWNlRWxlbWVudCwgJ3BhbmU6c2hvdy1uZXh0LXJlY2VudGx5LXVzZWQtaXRlbScpXG4gICAgICAgIGV4cGVjdCh3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWJzLW1ydS1zd2l0Y2hlciBsaScpLmxlbmd0aCkudG9CZSAyXG5cbiAgICBpdCBcInN3aXRjaGVzIGJldHdlZW4gdHdvIGl0ZW1zXCIsIC0+XG4gICAgICBmaXJzdEFjdGl2ZUl0ZW0gPSBwYW5lLmdldEFjdGl2ZUl0ZW0oKVxuICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh3b3Jrc3BhY2VFbGVtZW50LCAncGFuZTpzaG93LW5leHQtcmVjZW50bHktdXNlZC1pdGVtJylcbiAgICAgIHNlY29uZEFjdGl2ZUl0ZW0gPSBwYW5lLmdldEFjdGl2ZUl0ZW0oKVxuICAgICAgZXhwZWN0KHNlY29uZEFjdGl2ZUl0ZW0pLnRvTm90QmUoZmlyc3RBY3RpdmVJdGVtKVxuICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh3b3Jrc3BhY2VFbGVtZW50LCAncGFuZTptb3ZlLWFjdGl2ZS1pdGVtLXRvLXRvcC1vZi1zdGFjaycpXG4gICAgICB0aGlyZEFjdGl2ZUl0ZW0gPSBwYW5lLmdldEFjdGl2ZUl0ZW0oKVxuICAgICAgZXhwZWN0KHRoaXJkQWN0aXZlSXRlbSkudG9CZShzZWNvbmRBY3RpdmVJdGVtKVxuICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh3b3Jrc3BhY2VFbGVtZW50LCAncGFuZTpzaG93LW5leHQtcmVjZW50bHktdXNlZC1pdGVtJylcbiAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2god29ya3NwYWNlRWxlbWVudCwgJ3BhbmU6bW92ZS1hY3RpdmUtaXRlbS10by10b3Atb2Ytc3RhY2snKVxuICAgICAgZm91cnRoQWN0aXZlSXRlbSA9IHBhbmUuZ2V0QWN0aXZlSXRlbSgpXG4gICAgICBleHBlY3QoZm91cnRoQWN0aXZlSXRlbSkudG9CZShmaXJzdEFjdGl2ZUl0ZW0pXG5cbiAgZGVzY3JpYmUgXCJjb25maWdcIiwgLT5cbiAgICBjb25maWdLZXkgPSAndGFicy5lbmFibGVNcnVUYWJTd2l0Y2hpbmcnXG4gICAgZG90QXRvbVBhdGggPSBudWxsXG5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBkb3RBdG9tUGF0aCA9IHRlbXAucGF0aCgndGFicy1zcGVjLW1ydS1jb25maWcnKVxuICAgICAgYXRvbS5jb25maWcuY29uZmlnRGlyUGF0aCA9IGRvdEF0b21QYXRoXG4gICAgICBhdG9tLmNvbmZpZy5jb25maWdGaWxlUGF0aCA9IHBhdGguam9pbihhdG9tLmNvbmZpZy5jb25maWdEaXJQYXRoLCBcImF0b20uY29uZmlnLmNzb25cIilcbiAgICAgIGF0b20ua2V5bWFwcy5jb25maWdEaXJQYXRoID0gZG90QXRvbVBhdGhcblxuICAgIGFmdGVyRWFjaCAtPlxuICAgICAgZnMucmVtb3ZlU3luYyhkb3RBdG9tUGF0aClcblxuICAgIGl0IFwiZGVmYXVsdHMgb25cIiwgLT5cbiAgICAgIGV4cGVjdChhdG9tLmNvbmZpZy5nZXQoY29uZmlnS2V5KSkudG9CZSh0cnVlKVxuXG4gICAgICBiaW5kaW5ncyA9IGF0b20ua2V5bWFwcy5maW5kS2V5QmluZGluZ3MoXG4gICAgICAgIHRhcmdldDogZG9jdW1lbnQuYm9keSxcbiAgICAgICAga2V5c3Ryb2tlczogJ2N0cmwtdGFiJylcbiAgICAgIGV4cGVjdChiaW5kaW5ncy5sZW5ndGgpLnRvQmUoMSlcbiAgICAgIGV4cGVjdChiaW5kaW5nc1swXS5jb21tYW5kKS50b0JlKCdwYW5lOnNob3ctbmV4dC1yZWNlbnRseS11c2VkLWl0ZW0nKVxuXG4gICAgICBiaW5kaW5ncyA9IGF0b20ua2V5bWFwcy5maW5kS2V5QmluZGluZ3MoXG4gICAgICAgIHRhcmdldDogZG9jdW1lbnQuYm9keSxcbiAgICAgICAga2V5c3Ryb2tlczogJ2N0cmwtdGFiIF5jdHJsJylcbiAgICAgIGV4cGVjdChiaW5kaW5ncy5sZW5ndGgpLnRvQmUoMSlcbiAgICAgIGV4cGVjdChiaW5kaW5nc1swXS5jb21tYW5kKS50b0JlKCdwYW5lOm1vdmUtYWN0aXZlLWl0ZW0tdG8tdG9wLW9mLXN0YWNrJylcblxuICAgICAgYmluZGluZ3MgPSBhdG9tLmtleW1hcHMuZmluZEtleUJpbmRpbmdzKFxuICAgICAgICB0YXJnZXQ6IGRvY3VtZW50LmJvZHksXG4gICAgICAgIGtleXN0cm9rZXM6ICdjdHJsLXNoaWZ0LXRhYicpXG4gICAgICBleHBlY3QoYmluZGluZ3MubGVuZ3RoKS50b0JlKDEpXG4gICAgICBleHBlY3QoYmluZGluZ3NbMF0uY29tbWFuZCkudG9CZSgncGFuZTpzaG93LXByZXZpb3VzLXJlY2VudGx5LXVzZWQtaXRlbScpXG5cbiAgICAgIGJpbmRpbmdzID0gYXRvbS5rZXltYXBzLmZpbmRLZXlCaW5kaW5ncyhcbiAgICAgICAgdGFyZ2V0OiBkb2N1bWVudC5ib2R5LFxuICAgICAgICBrZXlzdHJva2VzOiAnY3RybC1zaGlmdC10YWIgXmN0cmwnKVxuICAgICAgZXhwZWN0KGJpbmRpbmdzLmxlbmd0aCkudG9CZSgxKVxuICAgICAgZXhwZWN0KGJpbmRpbmdzWzBdLmNvbW1hbmQpLnRvQmUoJ3BhbmU6bW92ZS1hY3RpdmUtaXRlbS10by10b3Atb2Ytc3RhY2snKVxuXG4gICAgaXQgXCJhbHRlcnMga2V5YmluZGluZ3Mgd2hlbiBkaXNhYmxlZFwiLCAtPlxuICAgICAgYXRvbS5jb25maWcuc2V0KGNvbmZpZ0tleSwgZmFsc2UpXG4gICAgICBiaW5kaW5ncyA9IGF0b20ua2V5bWFwcy5maW5kS2V5QmluZGluZ3MoXG4gICAgICAgIHRhcmdldDogZG9jdW1lbnQuYm9keSxcbiAgICAgICAga2V5c3Ryb2tlczogJ2N0cmwtdGFiJylcbiAgICAgIGV4cGVjdChiaW5kaW5ncy5sZW5ndGgpLnRvQmUoMilcbiAgICAgIGV4cGVjdChiaW5kaW5nc1swXS5jb21tYW5kKS50b0JlKCdwYW5lOnNob3ctbmV4dC1pdGVtJylcblxuICAgICAgYmluZGluZ3MgPSBhdG9tLmtleW1hcHMuZmluZEtleUJpbmRpbmdzKFxuICAgICAgICB0YXJnZXQ6IGRvY3VtZW50LmJvZHksXG4gICAgICAgIGtleXN0cm9rZXM6ICdjdHJsLXRhYiBeY3RybCcpXG4gICAgICBleHBlY3QoYmluZGluZ3MubGVuZ3RoKS50b0JlKDIpXG4gICAgICBleHBlY3QoYmluZGluZ3NbMF0uY29tbWFuZCkudG9CZSgndW5zZXQhJylcblxuICAgICAgYmluZGluZ3MgPSBhdG9tLmtleW1hcHMuZmluZEtleUJpbmRpbmdzKFxuICAgICAgICB0YXJnZXQ6IGRvY3VtZW50LmJvZHksXG4gICAgICAgIGtleXN0cm9rZXM6ICdjdHJsLXNoaWZ0LXRhYicpXG4gICAgICBleHBlY3QoYmluZGluZ3MubGVuZ3RoKS50b0JlKDIpXG4gICAgICBleHBlY3QoYmluZGluZ3NbMF0uY29tbWFuZCkudG9CZSgncGFuZTpzaG93LXByZXZpb3VzLWl0ZW0nKVxuXG4gICAgICBiaW5kaW5ncyA9IGF0b20ua2V5bWFwcy5maW5kS2V5QmluZGluZ3MoXG4gICAgICAgIHRhcmdldDogZG9jdW1lbnQuYm9keSxcbiAgICAgICAga2V5c3Ryb2tlczogJ2N0cmwtc2hpZnQtdGFiIF5jdHJsJylcbiAgICAgIGV4cGVjdChiaW5kaW5ncy5sZW5ndGgpLnRvQmUoMilcbiAgICAgIGV4cGVjdChiaW5kaW5nc1swXS5jb21tYW5kKS50b0JlKCd1bnNldCEnKVxuIl19
