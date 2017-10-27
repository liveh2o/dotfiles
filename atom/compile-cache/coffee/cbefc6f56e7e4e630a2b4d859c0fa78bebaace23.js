(function() {
  var $;

  $ = require('atom-space-pen-views').$;

  describe("ReleaseNotesView", function() {
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
      return waitsForPromise(function() {
        return atom.packages.activatePackage('release-notes');
      });
    });
    return describe("when in release mode", function() {
      it("renders the release notes for the current and previous releases", function() {
        spyOn($, 'ajax').andCallFake(function(_arg) {
          var success;
          success = _arg.success;
          return success([
            {
              tag_name: 'v0.3.0',
              body: 'a release'
            }
          ]);
        });
        atom.commands.dispatch(atom.views.getView(atom.workspace), 'window:update-available', ['0.3.0']);
        waitsForPromise(function() {
          return atom.workspace.open('atom://release-notes');
        });
        return runs(function() {
          var releaseNotes;
          releaseNotes = $(atom.views.getView(atom.workspace)).find('.release-notes');
          expect(releaseNotes.find('h1').text()).toBe('0.3.0');
          return expect(releaseNotes.find('.description').text()).toContain("a release");
        });
      });
      describe("when window:update-available is triggered without release details", function() {
        return it("ignores the event", function() {
          spyOn($, 'ajax').andCallFake(function(_arg) {
            var success;
            success = _arg.success;
            return success([
              {
                tag_name: 'v0.3.0',
                body: 'a release'
              }
            ]);
          });
          atom.commands.dispatch(atom.views.getView(atom.workspace), 'window:update-available', ['0.3.0']);
          atom.commands.dispatch(atom.views.getView(atom.workspace), 'window:update-available');
          waitsForPromise(function() {
            return atom.workspace.open('atom://release-notes');
          });
          return runs(function() {
            var releaseNotes;
            releaseNotes = $(atom.views.getView(atom.workspace)).find('.release-notes');
            return expect(releaseNotes.find('h1').text()).toBe('0.3.0');
          });
        });
      });
      it("displays an error when downloading the release notes fails and tries to redownload them", function() {
        spyOn($, 'ajax').andCallFake(function(_arg) {
          var error, success;
          error = _arg.error, success = _arg.success;
          if ($.ajax.callCount === 1) {
            return error(new Error());
          } else {
            return success([
              {
                tag_name: 'v0.3.0',
                body: 'a release'
              }
            ]);
          }
        });
        atom.commands.dispatch(atom.views.getView(atom.workspace), 'window:update-available', ['0.3.0']);
        waitsForPromise(function() {
          return atom.workspace.open('atom://release-notes');
        });
        runs(function() {
          var releaseNotes, releaseNotesView;
          releaseNotes = $(atom.views.getView(atom.workspace)).find('.release-notes');
          releaseNotesView = releaseNotes.view();
          expect(releaseNotes.find('h1').text()).toBe('0.3.0');
          return expect(releaseNotes.find('.description').text().length).toBeGreaterThan(0);
        });
        waitsFor(function() {
          return $.ajax.callCount === 2;
        });
        return runs(function() {
          var releaseNotes, releaseNotesView;
          releaseNotes = $(atom.views.getView(atom.workspace)).find('.release-notes');
          releaseNotesView = releaseNotes.view();
          expect(releaseNotes.find('h1').text()).toBe('0.3.0');
          return expect(releaseNotes.find('.description').text()).toContain("a release");
        });
      });
      it("tries to redownload them if they were previously empty", function() {
        spyOn($, 'ajax').andCallFake(function(_arg) {
          var error, success;
          error = _arg.error, success = _arg.success;
          if ($.ajax.callCount === 1) {
            return success([]);
          } else {
            return success([
              {
                tag_name: 'v0.3.0',
                body: 'a release'
              }
            ]);
          }
        });
        atom.commands.dispatch(atom.views.getView(atom.workspace), 'window:update-available', ['0.3.0']);
        waitsForPromise(function() {
          return atom.workspace.open('atom://release-notes');
        });
        runs(function() {
          var releaseNotes, releaseNotesView;
          releaseNotes = $(atom.views.getView(atom.workspace)).find('.release-notes');
          releaseNotesView = releaseNotes.view();
          expect(releaseNotes.find('h1').text()).toBe('0.3.0');
          return expect(releaseNotes.find('.description').text().length).toBeGreaterThan(0);
        });
        waitsFor(function() {
          return $.ajax.callCount === 2;
        });
        return runs(function() {
          var releaseNotes, releaseNotesView;
          releaseNotes = $(atom.views.getView(atom.workspace)).find('.release-notes');
          releaseNotesView = releaseNotes.view();
          expect(releaseNotes.find('h1').text()).toBe('0.3.0');
          return expect(releaseNotes.find('.description').text()).toContain("a release");
        });
      });
      return describe("when scrolling with core:page-up and core:page-down", function() {
        var releaseNotesView;
        releaseNotesView = null;
        beforeEach(function() {
          spyOn($, 'ajax').andCallFake(function(_arg) {
            var success;
            success = _arg.success;
            return success([
              {
                tag_name: 'v0.3.0',
                body: 'a release'
              }
            ]);
          });
          atom.commands.dispatch(atom.views.getView(atom.workspace), 'window:update-available', ['0.3.0']);
          waitsForPromise(function() {
            return atom.workspace.open('atom://release-notes');
          });
          return runs(function() {
            var releaseNotes;
            releaseNotes = $(atom.views.getView(atom.workspace)).find('.release-notes');
            return releaseNotesView = releaseNotes.view();
          });
        });
        it("handles core:page-down", function() {
          spyOn(releaseNotesView, 'pageDown');
          atom.commands.dispatch(releaseNotesView.element, 'core:page-down');
          return expect(releaseNotesView.pageDown).toHaveBeenCalled();
        });
        return it("handles core:page-up", function() {
          spyOn(releaseNotesView, 'pageUp');
          atom.commands.dispatch(releaseNotesView.element, 'core:page-up');
          return expect(releaseNotesView.pageUp).toHaveBeenCalled();
        });
      });
    });
  });

}).call(this);
