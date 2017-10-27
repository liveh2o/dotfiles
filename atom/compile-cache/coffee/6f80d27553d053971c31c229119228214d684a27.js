(function() {
  var BottomTab;

  BottomTab = require('../../lib/views/bottom-tab');

  describe("The Status Icon Configuration Option", function() {
    var configString, dummyView, statusBar, workspaceElement, _ref;
    _ref = [], statusBar = _ref[0], workspaceElement = _ref[1], dummyView = _ref[2];
    configString = "linter.statusIconPosition";
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      dummyView = document.createElement("div");
      statusBar = null;
      waitsForPromise(function() {
        return atom.packages.activatePackage('linter');
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('status-bar');
      });
      return runs(function() {
        return statusBar = workspaceElement.querySelector("status-bar");
      });
    });
    it("is 'Left' by default.", function() {
      return expect(atom.config.get(configString)).toEqual("Left");
    });
    describe("when set to 'Left'", function() {
      beforeEach(function() {
        return atom.config.set(configString, 'Left');
      });
      it("is set to 'Left.'", function() {
        return expect(atom.config.get(configString)).toEqual("Left");
      });
      return it("is on the left side of the Status Bar.", function() {
        var linterHighlight;
        jasmine.attachToDOM(workspaceElement);
        linterHighlight = statusBar.getLeftTiles().map(function(tile) {
          return tile.getItem();
        })[0];
        expect(linterHighlight).toBeDefined;
        linterHighlight = statusBar.getRightTiles().map(function(tile) {
          return tile.getItem();
        })[0];
        return expect(linterHighlight).not.toBeDefined;
      });
    });
    return describe("when set to 'Right'", function() {
      beforeEach(function() {
        return atom.config.set(configString, 'Right');
      });
      it("is set to 'Right.'", function() {
        return expect(atom.config.get(configString)).toEqual("Right");
      });
      return it("is on the right side of the Status Bar.", function() {
        var linterHighlight;
        jasmine.attachToDOM(workspaceElement);
        linterHighlight = statusBar.getRightTiles().map(function(tile) {
          return tile.getItem();
        })[0];
        expect(linterHighlight).toBeDefined;
        linterHighlight = statusBar.getRightTiles().map(function(tile) {
          return tile.getItem();
        })[0];
        return expect(linterHighlight).not.toBeDefined;
      });
    });
  });

}).call(this);
