(function() {
  var HighlightLine, Point, Range, path, _ref;

  path = require('path');

  _ref = require('atom'), Range = _ref.Range, Point = _ref.Point;

  HighlightLine = require('../lib/highlight-line');

  describe("Higlight line", function() {
    var activationPromise, editor, editorElement, highlightSelected, workspaceElement, _ref1;
    _ref1 = [], activationPromise = _ref1[0], workspaceElement = _ref1[1], editor = _ref1[2], editorElement = _ref1[3], highlightSelected = _ref1[4];
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      atom.project.setPaths([path.join(__dirname, 'fixtures')]);
      waitsForPromise(function() {
        return atom.workspace.open('sample.coffee');
      });
      runs(function() {
        jasmine.attachToDOM(workspaceElement);
        editor = atom.workspace.getActiveTextEditor();
        editorElement = atom.views.getView(editor);
        return activationPromise = atom.packages.activatePackage('highlight-line').then(function(_arg) {
          var highlightLine, mainModule;
          mainModule = _arg.mainModule;
          return highlightLine = mainModule.highlightLine, mainModule;
        });
      });
      return waitsForPromise(function() {
        return activationPromise;
      });
    });
    describe("when the view is loaded", function() {
      return it("attaches the view", function() {
        return expect(workspaceElement.querySelectorAll('.highlight-view')).toHaveLength(1);
      });
    });
    return describe("when the background color is enabled", function() {
      beforeEach(function() {
        return atom.config.set('highlight-line.enabledBackgroundColor', true);
      });
      describe("when there is only one cursor", function() {
        beforeEach(function() {
          var range;
          range = new Range(new Point(8, 2), new Point(8, 2));
          return editor.setSelectedBufferRange(range);
        });
        it("adds the background class to the cursor line", function() {
          return expect(editorElement.shadowRoot.querySelectorAll('.cursor-line.highlight-line')).toHaveLength(1);
        });
        return describe("when hide highlight on select is enabled", function() {
          beforeEach(function() {
            return atom.config.set('highlight-line.hideHighlightOnSelect', true);
          });
          it("will have a highlight when there is no text selected", function() {
            return expect(editorElement.shadowRoot.querySelectorAll('.cursor-line.highlight-line')).toHaveLength(1);
          });
          return it("won`t have a highlight when there is text selected", function() {
            var range;
            range = new Range(new Point(8, 2), new Point(8, 5));
            editor.setSelectedBufferRange(range);
            return expect(editorElement.shadowRoot.querySelectorAll('.cursor-line.highlight-line')).toHaveLength(0);
          });
        });
      });
      describe("when underline is enabled", function() {
        beforeEach(function() {
          return atom.config.set('highlight-line.enableUnderline', true);
        });
        describe("when solid settings has been set", function() {
          beforeEach(function() {
            var range;
            atom.config.set('highlight-line.underline', 'solid');
            range = new Range(new Point(8, 2), new Point(8, 2));
            return editor.setSelectedBufferRange(range);
          });
          it("adds an underline to the current line", function() {
            return expect(editorElement.shadowRoot.querySelectorAll('.cursor-line.highlight-line-multi-line-solid-bottom')).toHaveLength(1);
          });
          return describe("when hide highlight on select is enabled", function() {
            beforeEach(function() {
              return atom.config.set('highlight-line.hideHighlightOnSelect', true);
            });
            return it("will still have a line", function() {
              var range;
              range = new Range(new Point(8, 2), new Point(8, 5));
              editor.setSelectedBufferRange(range);
              return expect(editorElement.shadowRoot.querySelectorAll('.line.highlight-line-multi-line-solid-bottom')).toHaveLength(1);
            });
          });
        });
        describe("when dashed settings has been set", function() {
          beforeEach(function() {
            var range;
            atom.config.set('highlight-line.underline', 'dashed');
            range = new Range(new Point(8, 2), new Point(8, 2));
            return editor.setSelectedBufferRange(range);
          });
          return it("adds an underline to the current line", function() {
            return expect(editorElement.shadowRoot.querySelectorAll('.cursor-line.highlight-line-multi-line-dashed-bottom')).toHaveLength(1);
          });
        });
        return describe("when dotted settings has been set", function() {
          beforeEach(function() {
            var range;
            atom.config.set('highlight-line.underline', 'dotted');
            range = new Range(new Point(8, 2), new Point(8, 2));
            return editor.setSelectedBufferRange(range);
          });
          return it("adds an underline to the current line", function() {
            return expect(editorElement.shadowRoot.querySelectorAll('.cursor-line.highlight-line-multi-line-dotted-bottom')).toHaveLength(1);
          });
        });
      });
      describe("when there are two cursors", function() {
        beforeEach(function() {
          var range1, range2;
          range1 = new Range(new Point(8, 2), new Point(8, 2));
          range2 = new Range(new Point(10, 2), new Point(10, 2));
          return editor.setSelectedBufferRanges([range1, range2]);
        });
        return it('adds the background class to the cursor line', function() {
          return expect(editorElement.shadowRoot.querySelectorAll('.cursor-line.highlight-line')).toHaveLength(2);
        });
      });
      return describe("when there is a multi row selection", function() {
        beforeEach(function() {
          var range;
          range = new Range(new Point(8, 2), new Point(10, 8));
          return editor.setSelectedBufferRange(range);
        });
        it("won`t add a highlight line class", function() {
          return expect(editorElement.shadowRoot.querySelectorAll('.cursor-line.highlight-line')).toHaveLength(0);
        });
        return describe("when selection border is enabled", function() {
          beforeEach(function() {
            var range;
            atom.config.set('highlight-line.enableSelectionBorder', true);
            atom.config.set('highlight-line.underline', 'solid');
            range = new Range(new Point(8, 2), new Point(10, 8));
            return editor.setSelectedBufferRange(range);
          });
          return it("will add highlights to the top and bottom", function() {
            return expect(editorElement.shadowRoot.querySelectorAll('.cursor-line .highlight-line-multi-line-solid-top .highlight-line-multi-line-solid-bottom')).toHaveLength(0);
          });
        });
      });
    });
  });

}).call(this);
