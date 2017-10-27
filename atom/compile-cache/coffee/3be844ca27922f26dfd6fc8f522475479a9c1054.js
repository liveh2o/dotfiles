(function() {
  var Editor, Linter, LinterView, chai, expect, sinon,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  sinon = require("sinon");

  chai = require('chai');

  Editor = require(atom.config.resourcePath + "/src/text-editor");

  LinterView = require("../lib/linter-view.coffee");

  Linter = require("../lib/linter.coffee");

  expect = chai.expect;

  describe("LinterView:lint", function() {
    var CatFileLinter;
    CatFileLinter = (function(_super) {
      __extends(CatFileLinter, _super);

      CatFileLinter.syntax = 'text.plain.null-grammar';

      CatFileLinter.prototype.cmd = 'cat';

      CatFileLinter.prototype.regex = '(?<line>[0-9]+):(?<message>.+)';

      function CatFileLinter(editor) {
        CatFileLinter.__super__.constructor.call(this, editor);
      }

      return CatFileLinter;

    })(Linter);
    return it("calls lintFile on each linter", function() {
      var calls, linterClasses, linterView;
      linterClasses = [CatFileLinter, CatFileLinter];
      linterView = null;
      waitsForPromise(function() {
        return atom.workspace.open('./fixture/messages.txt').then(function(editor) {
          var inlineView, statusBarSummaryView, statusBarView;
          statusBarView = {
            render: sinon.stub(),
            hide: sinon.stub()
          };
          statusBarSummaryView = {
            render: sinon.stub(),
            remove: sinon.stub()
          };
          inlineView = {
            render: sinon.stub(),
            remove: sinon.stub()
          };
          return linterView = new LinterView(editor, statusBarView, statusBarSummaryView, inlineView, linterClasses);
        });
      });
      calls = 0;
      runs(function() {
        var linter, _i, _len, _ref;
        _ref = linterView.linters;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          linter = _ref[_i];
          linter.lintFile = function() {
            return calls += 1;
          };
        }
        return linterView.lint();
      });
      return waitsFor(function() {
        return calls === linterClasses.length;
      }, "lint file finished");
    });
  });

  describe("LinterView", function() {
    var lv, messages, stub_editor;
    lv = null;
    stub_editor = sinon.createStubInstance(Editor);
    stub_editor.isAlive.returns(true);
    messages = [
      {
        line: 1,
        level: "info"
      }, {
        line: 1,
        level: "error"
      }, {
        line: 1,
        level: "warning"
      }, {
        line: 9,
        level: "warning"
      }, {
        line: 9,
        level: "info"
      }, {
        line: 3,
        level: "info"
      }, {
        line: 20,
        level: "nonsense"
      }
    ];
    beforeEach(function() {
      sinon.stub(LinterView.prototype, 'initLinters');
      sinon.stub(LinterView.prototype, 'handleConfigChanges');
      sinon.stub(LinterView.prototype, 'handleEditorEvents');
      sinon.stub(LinterView.prototype, 'updateViews');
      lv = new LinterView(stub_editor);
      lv.showGutters = lv.showHighlighting = true;
      return lv.showInfoMessages = false;
    });
    afterEach(function() {
      LinterView.prototype.initLinters.restore();
      LinterView.prototype.handleConfigChanges.restore();
      LinterView.prototype.handleEditorEvents.restore();
      return LinterView.prototype.updateViews.restore();
    });
    describe("message sorting", function() {
      it("selects the most severe message for each line", function() {
        var lines;
        lines = lv.sortMessagesByLine(messages);
        expect(lines['1'].msg.level).to.equal('error');
        return expect(lines['9'].msg.level).to.equal('warning');
      });
      it("consults config concerning info messages", function() {
        var lines;
        lv.showInfoMessages = true;
        lines = lv.sortMessagesByLine(messages);
        expect(lines['1'].msg.level).to.equal('error');
        expect(lines['3'].msg.level).to.equal('info');
        return expect(lines['9'].msg.level).to.equal('warning');
      });
      return it("ignores messages of unrecognized levels", function() {
        var lines;
        lines = lv.sortMessagesByLine(messages);
        return expect(lines).to.not.have.property('20');
      });
    });
    return describe("message display", function() {
      it("bails if gutters and highlighting is turned off", function() {
        lv.showGutters = lv.showHighlighting = false;
        lv.display(messages);
        return expect(lv.markers).to.not.exist;
      });
      it("creates markers for each line with an error or warning", function() {
        lv.display(messages);
        return expect(lv.markers).to.have.length(2);
      });
      return it("will show info markers when configured to do so", function() {
        lv.showInfoMessages = true;
        lv.display(messages);
        return expect(lv.markers).to.have.length(3);
      });
    });
  });

}).call(this);
