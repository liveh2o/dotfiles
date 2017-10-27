(function() {
  var $, triggerUpdate;

  $ = require('atom-space-pen-views').$;

  triggerUpdate = function() {
    return atom.commands.dispatch(atom.views.getView(atom.workspace), 'window:update-available', ['v22.0.0']);
  };

  describe("ReleaseNotesStatusBar", function() {
    beforeEach(function() {
      var storage;
      spyOn(atom, 'isReleasedVersion').andReturn(true);
      storage = {};
      spyOn(localStorage, 'setItem').andCallFake(function(key, value) {
        return storage[key] = value;
      });
      spyOn(localStorage, 'getItem').andCallFake(function(key) {
        return storage[key];
      });
      jasmine.attachToDOM(atom.views.getView(atom.workspace));
      waitsForPromise(function() {
        return atom.packages.activatePackage('status-bar');
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('release-notes');
      });
      return waitsForPromise(function() {
        return atom.workspace.open('sample.js');
      });
    });
    describe("with no update", function() {
      return it("does not show the view", function() {
        return expect(atom.views.getView(atom.workspace)).not.toContain('.release-notes-status');
      });
    });
    return describe("with an update", function() {
      it("shows the view when the update is made available", function() {
        triggerUpdate();
        return expect(atom.views.getView(atom.workspace)).toContain('.release-notes-status');
      });
      return describe("clicking on the status", function() {
        return it("opens the release notes view", function() {
          var workspaceOpen;
          workspaceOpen = spyOn(atom.workspace, 'open');
          triggerUpdate();
          $(atom.views.getView(atom.workspace)).find('.release-notes-status').trigger('click');
          return expect(workspaceOpen.mostRecentCall.args[0]).toBe('atom://release-notes');
        });
      });
    });
  });

}).call(this);
