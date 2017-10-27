(function() {
  describe('Linter Behavior', function() {
    var bottomContainer, getLinter, getMessage, linter, linterState, trigger;
    linter = null;
    linterState = null;
    bottomContainer = null;
    trigger = function(el, name) {
      var event;
      event = document.createEvent('HTMLEvents');
      event.initEvent(name, true, false);
      return el.dispatchEvent(event);
    };
    getLinter = function() {
      return {
        grammarScopes: ['*'],
        lintOnFly: false,
        modifiesBuffer: false,
        scope: 'project',
        lint: function() {}
      };
    };
    getMessage = function(type, filePath) {
      return {
        type: type,
        text: "Some Message",
        filePath: filePath,
        range: [[0, 0], [1, 1]]
      };
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
    describe('Bottom Tabs', function() {
      it('defaults to file tab', function() {
        return expect(linterState.scope).toBe('File');
      });
      it('changes tab on click', function() {
        trigger(bottomContainer.getTab('Project'), 'click');
        return expect(linterState.scope).toBe('Project');
      });
      it('toggles panel visibility on click', function() {
        expect(linter.views.panel.getVisibility()).toBe(true);
        trigger(bottomContainer.getTab('File'), 'click');
        expect(linter.views.panel.getVisibility()).toBe(false);
        trigger(bottomContainer.getTab('File'), 'click');
        return expect(linter.views.panel.getVisibility()).toBe(true);
      });
      it('re-enables panel when another tab is clicked', function() {
        expect(linter.views.panel.getVisibility()).toBe(true);
        trigger(bottomContainer.getTab('File'), 'click');
        expect(linter.views.panel.getVisibility()).toBe(false);
        trigger(bottomContainer.getTab('Project'), 'click');
        return expect(linter.views.panel.getVisibility()).toBe(true);
      });
      return it('updates count on pane change', function() {
        var messages, provider;
        provider = getLinter();
        expect(bottomContainer.getTab('File').count).toBe(0);
        messages = [getMessage('Error', __dirname + '/fixtures/file.txt')];
        linter.setMessages(provider, messages);
        linter.messages.updatePublic();
        return waitsForPromise(function() {
          return atom.workspace.open('file.txt').then(function() {
            expect(bottomContainer.getTab('File').count).toBe(1);
            return atom.workspace.open('/tmp/non-existing-file');
          }).then(function() {
            return expect(bottomContainer.getTab('File').count).toBe(0);
          });
        });
      });
    });
    return describe('Markers', function() {
      return it('automatically marks files when they are opened if they have any markers', function() {
        var messages, provider;
        provider = getLinter();
        messages = [getMessage('Error', '/etc/passwd')];
        linter.setMessages(provider, messages);
        linter.messages.updatePublic();
        return waitsForPromise(function() {
          return atom.workspace.open('/etc/passwd').then(function() {
            var activeEditor;
            activeEditor = atom.workspace.getActiveTextEditor();
            return expect(activeEditor.getMarkers().length > 0).toBe(true);
          });
        });
      });
    });
  });

}).call(this);
