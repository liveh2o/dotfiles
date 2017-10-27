(function() {
  var FakePackage;

  describe("Timecop", function() {
    var workspaceElement;
    workspaceElement = null;
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      return waitsForPromise(function() {
        return atom.packages.activatePackage('timecop');
      });
    });
    return describe("the timecop:view command", function() {
      var timecopView;
      timecopView = null;
      beforeEach(function() {
        var packages;
        packages = [
          new FakePackage({
            name: 'slow-activating-package-1',
            activateTime: 500,
            loadTime: 5
          }), new FakePackage({
            name: 'slow-activating-package-2',
            activateTime: 500,
            loadTime: 5
          }), new FakePackage({
            name: 'slow-loading-package',
            activateTime: 5,
            loadTime: 500
          }), new FakePackage({
            name: 'fast-package',
            activateTime: 2,
            loadTime: 3
          })
        ];
        spyOn(atom.packages, 'getLoadedPackages').andReturn(packages);
        spyOn(atom.packages, 'getActivePackages').andReturn(packages);
        atom.commands.dispatch(workspaceElement, 'timecop:view');
        return waitsFor(function() {
          return timecopView = atom.workspace.getActivePaneItem();
        });
      });
      afterEach(function() {
        return jasmine.unspy(atom.packages, 'getLoadedPackages');
      });
      it("shows the packages that loaded slowly", function() {
        var loadingPanel;
        loadingPanel = timecopView.find(".package-panel:contains(Package Loading)");
        expect(loadingPanel.text()).toMatch(/1 package took longer than 5ms to load/);
        expect(loadingPanel.text()).toMatch(/slow-loading-package/);
        expect(loadingPanel.text()).not.toMatch(/slow-activating-package/);
        return expect(loadingPanel.text()).not.toMatch(/fast-package/);
      });
      return it("shows the packages that activated slowly", function() {
        var loadingPanel;
        loadingPanel = timecopView.find(".package-panel:contains(Package Activation)");
        expect(loadingPanel.text()).toMatch(/2 packages took longer than 5ms to activate/);
        expect(loadingPanel.text()).toMatch(/slow-activating-package-1/);
        expect(loadingPanel.text()).toMatch(/slow-activating-package-2/);
        expect(loadingPanel.text()).not.toMatch(/slow-loading-package/);
        return expect(loadingPanel.text()).not.toMatch(/fast-package/);
      });
    });
  });

  FakePackage = (function() {
    function FakePackage(_arg) {
      this.name = _arg.name, this.activateTime = _arg.activateTime, this.loadTime = _arg.loadTime;
    }

    FakePackage.prototype.getType = function() {
      return 'package';
    };

    FakePackage.prototype.isTheme = function() {
      return false;
    };

    return FakePackage;

  })();

}).call(this);
