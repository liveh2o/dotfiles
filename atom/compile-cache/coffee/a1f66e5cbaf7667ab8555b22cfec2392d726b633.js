(function() {
  var $, Reporter;

  $ = require('atom-space-pen-views').$;

  Reporter = require('../lib/reporter');

  describe("Welcome", function() {
    var editor;
    editor = null;
    beforeEach(function() {
      spyOn(atom.workspace, 'open').andCallThrough();
      waitsForPromise(function() {
        return atom.packages.activatePackage("welcome");
      });
      return waitsFor(function() {
        return atom.workspace.open.calls.length === 2;
      });
    });
    describe("when activated for the first time", function() {
      return it("shows the welcome panes", function() {
        var panes;
        panes = atom.workspace.getPanes();
        expect(panes).toHaveLength(2);
        expect(panes[0].getItems()[0].getTitle()).toBe('Welcome');
        return expect(panes[1].getItems()[0].getTitle()).toBe('Welcome Guide');
      });
    });
    describe("when activated again", function() {
      beforeEach(function() {
        atom.workspace.getPanes().map(function(pane) {
          return pane.destroy();
        });
        atom.packages.deactivatePackage("welcome");
        atom.workspace.open.reset();
        waitsForPromise(function() {
          return atom.packages.activatePackage("welcome");
        });
        return waits(1);
      });
      return it("doesn't show the welcome buffer", function() {
        return expect(atom.workspace.open).not.toHaveBeenCalled();
      });
    });
    describe("the welcome:show command", function() {
      var workspaceElement;
      workspaceElement = null;
      beforeEach(function() {
        return workspaceElement = atom.views.getView(atom.workspace);
      });
      return it("shows the welcome buffer", function() {
        atom.workspace.getPanes().map(function(pane) {
          return pane.destroy();
        });
        expect(atom.workspace.getActivePaneItem()).toBeUndefined();
        atom.commands.dispatch(workspaceElement, 'welcome:show');
        waitsFor(function() {
          return atom.workspace.getActivePaneItem();
        });
        return runs(function() {
          var panes;
          panes = atom.workspace.getPanes();
          expect(panes).toHaveLength(2);
          return expect(panes[0].getItems()[0].getTitle()).toBe('Welcome');
        });
      });
    });
    describe("deserializing the pane items", function() {
      var guideView, panes, welcomeView, _ref;
      _ref = [], panes = _ref[0], guideView = _ref[1], welcomeView = _ref[2];
      beforeEach(function() {
        panes = atom.workspace.getPanes();
        welcomeView = panes[0].getItems()[0];
        return guideView = panes[1].getItems()[0];
      });
      return describe("when GuideView is deserialized", function() {
        it("deserializes with no state", function() {
          var deserializer, newGuideView, uri, _ref1;
          _ref1 = guideView.serialize(), deserializer = _ref1.deserializer, uri = _ref1.uri;
          return newGuideView = atom.deserializers.deserialize({
            deserializer: deserializer,
            uri: uri
          });
        });
        return it("remembers open sections", function() {
          var newGuideView, serialized;
          guideView.find("details[data-section=\"snippets\"]").attr('open', 'open');
          guideView.find("details[data-section=\"init-script\"]").attr('open', 'open');
          serialized = guideView.serialize();
          expect(serialized.openSections).toEqual(['init-script', 'snippets']);
          newGuideView = atom.deserializers.deserialize(serialized);
          expect(newGuideView.find("details[data-section=\"packages\"]")).not.toHaveAttr('open');
          expect(newGuideView.find("details[data-section=\"snippets\"]")).toHaveAttr('open');
          return expect(newGuideView.find("details[data-section=\"init-script\"]")).toHaveAttr('open');
        });
      });
    });
    describe("reporting events", function() {
      var guideView, panes, welcomeView, _ref;
      _ref = [], panes = _ref[0], guideView = _ref[1], welcomeView = _ref[2];
      beforeEach(function() {
        panes = atom.workspace.getPanes();
        welcomeView = panes[0].getItems()[0];
        guideView = panes[1].getItems()[0];
        return spyOn(Reporter, 'sendEvent');
      });
      return describe("GuideView events", function() {
        it("captures expand and collapse events", function() {
          expect(Reporter.sendEvent).not.toHaveBeenCalled();
          guideView.find("details[data-section=\"packages\"] summary").click();
          expect(Reporter.sendEvent).toHaveBeenCalledWith('expand-packages-section');
          expect(Reporter.sendEvent).not.toHaveBeenCalledWith('collapse-packages-section');
          guideView.find("details[data-section=\"packages\"]").attr('open', true);
          guideView.find("details[data-section=\"packages\"] summary").click();
          return expect(Reporter.sendEvent).toHaveBeenCalledWith('collapse-packages-section');
        });
        return it("captures button events", function() {
          var detailElement, eventName, primaryButton, sectionName, _i, _len, _ref1, _results;
          spyOn(atom.commands, 'dispatch');
          _ref1 = guideView.find('details');
          _results = [];
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            detailElement = _ref1[_i];
            detailElement = $(detailElement);
            sectionName = detailElement.attr('data-section');
            eventName = "clicked-" + sectionName + "-cta";
            primaryButton = detailElement.find('.btn-primary');
            if (primaryButton.length) {
              expect(Reporter.sendEvent).not.toHaveBeenCalledWith(eventName);
              primaryButton.click();
              _results.push(expect(Reporter.sendEvent).toHaveBeenCalledWith(eventName));
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        });
      });
    });
    return describe("when the reporter changes", function() {
      return it("sends all queued events", function() {
        var reporter1, reporter2;
        reporter1 = {
          sendEvent: jasmine.createSpy('sendEvent')
        };
        reporter2 = {
          sendEvent: jasmine.createSpy('sendEvent')
        };
        Reporter.sendEvent('foo', 'bar', 'baz');
        Reporter.sendEvent('foo2', 'bar2', 'baz2');
        Reporter.setReporter(reporter1);
        expect(reporter1.sendEvent).toHaveBeenCalledWith('welcome-v1', 'foo', 'bar', 'baz');
        expect(reporter1.sendEvent).toHaveBeenCalledWith('welcome-v1', 'foo2', 'bar2', 'baz2');
        Reporter.setReporter(reporter2);
        return expect(reporter2.sendEvent.callCount).toBe(0);
      });
    });
  });

}).call(this);
