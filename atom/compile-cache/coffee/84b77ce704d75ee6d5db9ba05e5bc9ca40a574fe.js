(function() {
  var LineJumper;

  LineJumper = require('../lib/line-jumper');

  describe("LineJumper", function() {
    var editor, workspaceElement, _ref;
    _ref = [], editor = _ref[0], workspaceElement = _ref[1];
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      return waitsForPromise(function() {
        return Promise.all([
          atom.packages.activatePackage("line-jumper"), atom.workspace.open('sample.js').then(function(e) {
            return editor = e;
          })
        ]);
      });
    });
    describe("moving and selecting down", function() {
      it("moves down", function() {
        var pos;
        atom.commands.dispatch(workspaceElement, 'line-jumper:move-down');
        pos = editor.getCursorBufferPosition();
        return expect(pos).toEqual([10, 0]);
      });
      return it("selects down", function() {
        var bufferRange;
        atom.commands.dispatch(workspaceElement, 'line-jumper:select-down');
        bufferRange = editor.getSelectedBufferRange();
        return expect(bufferRange).toEqual([[0, 0], [10, 0]]);
      });
    });
    describe("moving and selecting up", function() {
      beforeEach(function() {
        var pos;
        return pos = editor.setCursorBufferPosition([12, 0]);
      });
      it("moves up", function() {
        var pos;
        atom.commands.dispatch(workspaceElement, 'line-jumper:move-up');
        pos = editor.getCursorBufferPosition();
        return expect(pos).toEqual([2, 0]);
      });
      return it("selects down", function() {
        var bufferRange;
        atom.commands.dispatch(workspaceElement, 'line-jumper:select-up');
        bufferRange = editor.getSelectedBufferRange();
        return expect(bufferRange).toEqual([[2, 0], [12, 0]]);
      });
    });
    return describe("when the line-jumper.numberOfLines config is set", function() {
      return it("jumps by the configured number of lines", function() {
        atom.config.set('line-jumper.numberOfLines', 5);
        atom.commands.dispatch(workspaceElement, 'line-jumper:move-down');
        expect(editor.getCursorBufferPosition()).toEqual([5, 0]);
        atom.config.set('line-jumper.numberOfLines', 2);
        atom.commands.dispatch(workspaceElement, 'line-jumper:move-down');
        expect(editor.getCursorBufferPosition()).toEqual([7, 0]);
        atom.config.set('line-jumper.numberOfLines', -1);
        atom.commands.dispatch(workspaceElement, 'line-jumper:move-down');
        return expect(editor.getCursorBufferPosition()).toEqual([8, 0]);
      });
    });
  });

}).call(this);
