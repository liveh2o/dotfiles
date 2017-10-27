(function() {
  var Linter, Point, Range, sinon, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Linter = require("../lib/linter.coffee");

  sinon = require("sinon");

  _ref = require('atom'), Range = _ref.Range, Point = _ref.Point;

  describe("Linter::computeRange", function() {
    var lineLengthForRow, linter, rangeForScopeAtPosition, scopesForPosition, _ref1;
    _ref1 = [], linter = _ref1[0], scopesForPosition = _ref1[1], rangeForScopeAtPosition = _ref1[2], lineLengthForRow = _ref1[3];
    beforeEach(function() {
      linter = new Linter({
        getPath: function() {
          return "path";
        },
        getLineCount: function() {
          return 10;
        }
      });
      scopesForPosition = sinon.stub(linter, "getEditorScopesForPosition");
      rangeForScopeAtPosition = sinon.stub(linter, "getGetRangeForScopeAtPosition");
      return lineLengthForRow = sinon.stub(linter, "lineLengthForRow");
    });
    it("should return a complete range if all parameters provided, switched to zero index", function() {
      var range;
      range = linter.computeRange({
        colStart: "1",
        colEnd: "3",
        lineStart: "1",
        lineEnd: "2"
      });
      return expect(range.serialize()).toEqual([[0, 0], [1, 2]]);
    });
    it("should support only getting a line number", function() {
      var range;
      range = linter.computeRange({
        colStart: "1",
        colEnd: "3",
        line: "1"
      });
      return expect(range.serialize()).toEqual([[0, 0], [0, 2]]);
    });
    it("should support only getting a col number and retrieve range based on scope", function() {
      var range;
      scopesForPosition.returns(["scope.function"]);
      rangeForScopeAtPosition.returns(new Range([0, 3], [2, 3]));
      range = linter.computeRange({
        col: "1",
        line: "1"
      });
      sinon.assert.calledWith(rangeForScopeAtPosition, "scope.function");
      return expect(range.serialize()).toEqual([[0, 3], [2, 3]]);
    });
    it("should support only getting a col number and use full line when no scope is found", function() {
      var range;
      scopesForPosition.returns([]);
      lineLengthForRow.returns(20);
      range = linter.computeRange({
        col: "1",
        line: "1"
      });
      sinon.assert.notCalled(rangeForScopeAtPosition);
      sinon.assert.calledWith(lineLengthForRow, 0);
      return expect(range.serialize()).toEqual([[0, 0], [0, 20]]);
    });
    return it("should ensure a range off the end of a line is visible", function() {
      var range;
      lineLengthForRow.returns(20);
      range = linter.computeRange({
        colStart: "21",
        line: "1"
      });
      return expect(range.serialize()).toEqual([[0, 19], [0, 20]]);
    });
  });

  describe("Linter:lintFile", function() {
    var CatFileLinter, linter;
    linter = [][0];
    CatFileLinter = (function(_super) {
      __extends(CatFileLinter, _super);

      CatFileLinter.prototype.cmd = 'cat';

      CatFileLinter.prototype.regex = '(?<line>[0-9]+):(?<message>.+)';

      function CatFileLinter(editor) {
        CatFileLinter.__super__.constructor.call(this, editor);
      }

      return CatFileLinter;

    })(Linter);
    beforeEach(function() {
      return waitsForPromise(function() {
        return atom.workspace.open('linter-spec.coffee').then(function(editor) {
          return linter = new CatFileLinter(editor);
        });
      });
    });
    it("lints file whose name is without space", function() {
      var flag;
      flag = false;
      runs(function() {
        return linter.lintFile("fixture/messages.txt", function(messages) {
          console.log(messages);
          expect(messages.length).toBe(2);
          return flag = true;
        });
      });
      return waitsFor(function() {
        return flag;
      }, "lint file finished");
    });
    it("lints file whose name is with space", function() {
      var flag;
      flag = false;
      runs(function() {
        return linter.lintFile("fixture/messages with space.txt", function(messages) {
          console.log(messages);
          expect(messages.length).toBe(2);
          return flag = true;
        });
      });
      return waitsFor(function() {
        return flag;
      }, "lint file finished");
    });
    it("lints when command is an array", function() {
      var flag;
      flag = false;
      runs(function() {
        linter.cmd = ['cat'];
        return linter.lintFile("fixture/messages.txt", function(messages) {
          console.log(messages);
          expect(messages.length).toBe(2);
          return flag = true;
        });
      });
      return waitsFor(function() {
        return flag;
      }, "lint file finished");
    });
    it("lints when command is an array with arguments containing spaces", function() {
      var flag;
      flag = false;
      runs(function() {
        linter.cmd = ['cat', 'fixture/messages with space.txt'];
        return linter.lintFile("fixture/messages.txt", function(messages) {
          console.log(messages);
          expect(messages.length).toBe(4);
          return flag = true;
        });
      });
      return waitsFor(function() {
        return flag;
      }, "lint file finished");
    });
    it("lints when executablePath is a directory", function() {
      var flag;
      flag = false;
      linter.cmd = ['cat'];
      linter.executablePath = '/bin';
      runs(function() {
        return linter.lintFile("fixture/messages.txt", function() {
          return flag = true;
        });
      });
      return waitsFor(function() {
        return flag;
      }, "lint file finished");
    });
    return it("lints when executablePath is an executable", function() {
      var flag;
      flag = false;
      linter.cmd = ['notcat'];
      linter.executablePath = '/bin/cat';
      runs(function() {
        return linter.lintFile("fixture/messages.txt", function() {
          return flag = true;
        });
      });
      return waitsFor(function() {
        return flag;
      }, "lint file finished");
    });
  });

}).call(this);
