(function() {
  describe('SoftWrapIndicator', function() {
    var softWrapIndicator;
    softWrapIndicator = [][0];
    beforeEach(function() {
      var workspaceElement;
      workspaceElement = atom.views.getView(atom.workspace);
      jasmine.attachToDOM(workspaceElement);
      waitsForPromise(function() {
        return atom.packages.activatePackage('status-bar');
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('language-javascript');
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('language-gfm');
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('soft-wrap-indicator');
      });
      return runs(function() {
        softWrapIndicator = document.querySelector('soft-wrap-indicator');
        return expect(softWrapIndicator).toExist();
      });
    });
    it('has the text "Wrap"', function() {
      return expect(softWrapIndicator.wrapLink.textContent).toBe('Wrap');
    });
    it('hides the indicator when there is no open editor', function() {
      return expect(softWrapIndicator).toBeHidden();
    });
    describe('when an editor is open', function() {
      var editor;
      editor = [][0];
      beforeEach(function() {
        waitsForPromise(function() {
          return atom.workspace.open('sample.js');
        });
        return runs(function() {
          return editor = atom.workspace.getActiveTextEditor();
        });
      });
      it('shows the indicator', function() {
        return expect(softWrapIndicator).not.toBeHidden();
      });
      it('is not lit when the grammar is not soft wrapped', function() {
        return expect(softWrapIndicator.wrapLink.classList.contains('lit')).toBeFalsy();
      });
      it('is lit when the grammar is soft wrapped', function() {
        waitsForPromise(function() {
          return atom.workspace.open('sample.md');
        });
        return runs(function() {
          return expect(softWrapIndicator.wrapLink.classList.contains('lit')).toBeTruthy();
        });
      });
      it('is lit when the soft wrap setting is changed', function() {
        editor.toggleSoftWrapped();
        return expect(softWrapIndicator.wrapLink.classList.contains('lit')).toBeTruthy();
      });
      it('is lit when the grammar is changed to a soft wrapped grammar', function() {
        var grammar;
        grammar = atom.grammars.grammarForScopeName('source.gfm');
        editor.setGrammar(grammar);
        return expect(softWrapIndicator.wrapLink.classList.contains('lit')).toBeTruthy();
      });
      return describe('when clicked', function() {
        return it('toggles the soft wrap value', function() {
          spyOn(editor, 'toggleSoftWrapped');
          softWrapIndicator.click();
          return expect(editor.toggleSoftWrapped).toHaveBeenCalled();
        });
      });
    });
    return describe('when the package is deactivated', function() {
      return it('removes the indicator', function() {
        atom.packages.deactivatePackage('soft-wrap-indicator');
        return expect(softWrapIndicator.parentElement).toBeNull();
      });
    });
  });

}).call(this);
