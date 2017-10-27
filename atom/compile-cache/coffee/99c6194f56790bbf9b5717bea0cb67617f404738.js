(function() {
  describe('Linter Behavior', function() {
    var bottomContainer, linter, linterState, trigger;
    linter = null;
    linterState = null;
    bottomContainer = null;
    trigger = function(el, name) {
      var event;
      event = document.createEvent('HTMLEvents');
      event.initEvent(name, true, false);
      return el.dispatchEvent(event);
    };
    beforeEach(function() {
      return waitsForPromise(function() {
        return atom.packages.activatePackage('linter').then(function() {
          linter = atom.packages.getActivePackage('linter').mainModule.instance;
          linterState = linter.state;
          return bottomContainer = linter.views.bottomContainer;
        });
      });
    });
    return describe('Bottom Tabs', function() {
      it('defaults to file tab', function() {
        return expect(linterState.scope).toBe('File');
      });
      it('changes tab on click', function() {
        trigger(bottomContainer.getTab('Project'), 'click');
        return expect(linterState.scope).toBe('Project');
      });
      return it('toggles panel visibility on click', function() {
        expect(linter.views.panel.panelVisibility).toBe(true);
        trigger(bottomContainer.getTab('File'), 'click');
        expect(linter.views.panel.panelVisibility).toBe(false);
        trigger(bottomContainer.getTab('File'), 'click');
        return expect(linter.views.panel.panelVisibility).toBe(true);
      });
    });
  });

}).call(this);
