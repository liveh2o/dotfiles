(function() {
  var $, $$, PathLoader, fs, net, path, temp, wrench, _, _ref;

  net = require("net");

  path = require('path');

  _ = require('underscore-plus');

  _ref = require('atom-space-pen-views'), $ = _ref.$, $$ = _ref.$$;

  fs = require('fs-plus');

  temp = require('temp');

  wrench = require('wrench');

  PathLoader = require('../lib/path-loader');

  describe('FuzzyFinder', function() {
    var bufferView, dispatchCommand, eachFilePath, gitStatusView, projectView, rootDir1, rootDir2, waitForPathsToDisplay, workspaceElement, _ref1, _ref2;
    _ref1 = [], rootDir1 = _ref1[0], rootDir2 = _ref1[1];
    _ref2 = [], projectView = _ref2[0], bufferView = _ref2[1], gitStatusView = _ref2[2], workspaceElement = _ref2[3];
    beforeEach(function() {
      var fixturesPath;
      rootDir1 = fs.realpathSync(temp.mkdirSync('root-dir1'));
      rootDir2 = fs.realpathSync(temp.mkdirSync('root-dir2'));
      fixturesPath = atom.project.getPaths()[0];
      wrench.copyDirSyncRecursive(path.join(fixturesPath, "root-dir1"), rootDir1, {
        forceDelete: true
      });
      wrench.copyDirSyncRecursive(path.join(fixturesPath, "root-dir2"), rootDir2, {
        forceDelete: true
      });
      atom.project.setPaths([rootDir1, rootDir2]);
      workspaceElement = atom.views.getView(atom.workspace);
      waitsForPromise(function() {
        return atom.workspace.open(path.join(rootDir1, 'sample.js'));
      });
      return waitsForPromise(function() {
        return atom.packages.activatePackage('fuzzy-finder').then(function(pack) {
          var fuzzyFinder;
          fuzzyFinder = pack.mainModule;
          projectView = fuzzyFinder.createProjectView();
          bufferView = fuzzyFinder.createBufferView();
          return gitStatusView = fuzzyFinder.createGitStatusView();
        });
      });
    });
    dispatchCommand = function(command) {
      return atom.commands.dispatch(workspaceElement, "fuzzy-finder:" + command);
    };
    waitForPathsToDisplay = function(fuzzyFinderView) {
      return waitsFor("paths to display", 5000, function() {
        return fuzzyFinderView.list.children("li").length > 0;
      });
    };
    eachFilePath = function(dirPaths, fn) {
      var dirPath, filePath, findings, fullPath, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = dirPaths.length; _i < _len; _i++) {
        dirPath = dirPaths[_i];
        findings = (function() {
          var _j, _len1, _ref3, _results1;
          _ref3 = wrench.readdirSyncRecursive(dirPath);
          _results1 = [];
          for (_j = 0, _len1 = _ref3.length; _j < _len1; _j++) {
            filePath = _ref3[_j];
            fullPath = path.join(dirPath, filePath);
            if (fs.isFileSync(fullPath)) {
              fn(filePath);
              _results1.push(true);
            } else {
              _results1.push(void 0);
            }
          }
          return _results1;
        })();
        _results.push(expect(findings).toContain(true));
      }
      return _results;
    };
    describe("file-finder behavior", function() {
      beforeEach(function() {
        return projectView.setMaxItems(Infinity);
      });
      describe("toggling", function() {
        describe("when the project has multiple paths", function() {
          it("shows or hides the fuzzy-finder and returns focus to the active editor if it is already showing", function() {
            var editor1, editor2, _ref3;
            jasmine.attachToDOM(workspaceElement);
            expect(atom.workspace.panelForItem(projectView)).toBeNull();
            atom.workspace.getActivePane().splitRight({
              copyActiveItem: true
            });
            _ref3 = atom.workspace.getTextEditors(), editor1 = _ref3[0], editor2 = _ref3[1];
            dispatchCommand('toggle-file-finder');
            expect(atom.workspace.panelForItem(projectView).isVisible()).toBe(true);
            expect(projectView.filterEditorView).toHaveFocus();
            projectView.filterEditorView.getModel().insertText('this should not show up next time we toggle');
            dispatchCommand('toggle-file-finder');
            expect(atom.views.getView(editor1)).not.toHaveFocus();
            expect(atom.views.getView(editor2)).toHaveFocus();
            expect(atom.workspace.panelForItem(projectView).isVisible()).toBe(false);
            dispatchCommand('toggle-file-finder');
            return expect(projectView.filterEditorView.getText()).toBe('');
          });
          it("shows all files for the current project and selects the first", function() {
            jasmine.attachToDOM(workspaceElement);
            dispatchCommand('toggle-file-finder');
            expect(projectView.find(".loading")).toBeVisible();
            expect(projectView.find(".loading").text().length).toBeGreaterThan(0);
            waitForPathsToDisplay(projectView);
            return runs(function() {
              eachFilePath([rootDir1, rootDir2], function(filePath) {
                var item, nameDiv;
                item = projectView.list.find("li:contains(" + filePath + ")").eq(0);
                expect(item).toExist();
                nameDiv = item.find("div:first-child");
                expect(nameDiv).toHaveAttr("data-name", path.basename(filePath));
                return expect(nameDiv).toHaveText(path.basename(filePath));
              });
              return expect(projectView.find(".loading")).not.toBeVisible();
            });
          });
          it("shows each file's path, including which root directory it's in", function() {
            dispatchCommand('toggle-file-finder');
            waitForPathsToDisplay(projectView);
            return runs(function() {
              eachFilePath([rootDir1], function(filePath) {
                var item;
                item = projectView.list.find("li:contains(" + filePath + ")").eq(0);
                expect(item).toExist();
                return expect(item.find("div").eq(1)).toHaveText(path.join(path.basename(rootDir1), filePath));
              });
              return eachFilePath([rootDir2], function(filePath) {
                var item;
                item = projectView.list.find("li:contains(" + filePath + ")").eq(0);
                expect(item).toExist();
                return expect(item.find("div").eq(1)).toHaveText(path.join(path.basename(rootDir2), filePath));
              });
            });
          });
          it("only creates a single path loader task", function() {
            spyOn(PathLoader, 'startTask').andCallThrough();
            dispatchCommand('toggle-file-finder');
            dispatchCommand('toggle-file-finder');
            dispatchCommand('toggle-file-finder');
            return expect(PathLoader.startTask.callCount).toBe(1);
          });
          it("puts the last active path first", function() {
            waitsForPromise(function() {
              return atom.workspace.open('sample.txt');
            });
            waitsForPromise(function() {
              return atom.workspace.open('sample.js');
            });
            runs(function() {
              return dispatchCommand('toggle-file-finder');
            });
            waitForPathsToDisplay(projectView);
            return runs(function() {
              expect(projectView.list.find("li:eq(0)").text()).toContain('sample.txt');
              return expect(projectView.list.find("li:eq(1)").text()).toContain('sample.html');
            });
          });
          describe("symlinks on #darwin or #linux", function() {
            beforeEach(function() {
              fs.symlinkSync(atom.project.getDirectories()[0].resolve('sample.txt'), atom.project.getDirectories()[0].resolve('symlink-to-file'));
              return fs.symlinkSync(atom.project.getDirectories()[0].resolve('dir'), atom.project.getDirectories()[0].resolve('symlink-to-dir'));
            });
            it("includes symlinked file paths", function() {
              dispatchCommand('toggle-file-finder');
              waitForPathsToDisplay(projectView);
              return runs(function() {
                return expect(projectView.list.find("li:contains(symlink-to-file)")).toExist();
              });
            });
            it("excludes symlinked folder paths if traverseIntoSymlinkDirectories is false", function() {
              atom.config.set('fuzzy-finder.traverseIntoSymlinkDirectories', false);
              dispatchCommand('toggle-file-finder');
              waitForPathsToDisplay(projectView);
              return runs(function() {
                expect(projectView.list.find("li:contains(symlink-to-dir)")).not.toExist();
                return expect(projectView.list.find("li:contains(symlink-to-dir/a)")).not.toExist();
              });
            });
            return it("includes symlinked folder paths if traverseIntoSymlinkDirectories is true", function() {
              atom.config.set('fuzzy-finder.traverseIntoSymlinkDirectories', true);
              dispatchCommand('toggle-file-finder');
              waitForPathsToDisplay(projectView);
              return runs(function() {
                return expect(projectView.list.find("li:contains(symlink-to-dir/a)")).toExist();
              });
            });
          });
          describe("socket files on #darwin or #linux", function() {
            var socketPath, socketServer, _ref3;
            _ref3 = [], socketServer = _ref3[0], socketPath = _ref3[1];
            beforeEach(function() {
              socketServer = net.createServer(function() {});
              socketPath = path.join(rootDir1, "some.sock");
              return waitsFor(function(done) {
                return socketServer.listen(socketPath, done);
              });
            });
            afterEach(function() {
              return waitsFor(function(done) {
                return socketServer.close(done);
              });
            });
            return it("ignores them", function() {
              dispatchCommand('toggle-file-finder');
              waitForPathsToDisplay(projectView);
              return expect(projectView.list.find("li:contains(some.sock)")).not.toExist();
            });
          });
          return it("ignores paths that match entries in config.fuzzy-finder.ignoredNames", function() {
            atom.config.set("fuzzy-finder.ignoredNames", ["sample.js", "*.txt"]);
            dispatchCommand('toggle-file-finder');
            waitForPathsToDisplay(projectView);
            return runs(function() {
              expect(projectView.list.find("li:contains(sample.js)")).not.toExist();
              expect(projectView.list.find("li:contains(sample.txt)")).not.toExist();
              return expect(projectView.list.find("li:contains(a)")).toExist();
            });
          });
        });
        describe("when the project only has one path", function() {
          beforeEach(function() {
            return atom.project.setPaths([rootDir1]);
          });
          return it("doesn't show the name of each file's root directory", function() {
            dispatchCommand('toggle-file-finder');
            waitForPathsToDisplay(projectView);
            return runs(function() {
              return eachFilePath([rootDir1], function(filePath) {
                var item;
                console.log('filePath', filePath);
                item = projectView.list.find("li:contains(" + filePath + ")").eq(0);
                expect(item).toExist();
                return expect(item).not.toHaveText(path.basename(rootDir1));
              });
            });
          });
        });
        return describe("when the project has no path", function() {
          beforeEach(function() {
            return atom.project.setPaths([]);
          });
          return it("shows an empty message with no files in the list", function() {
            dispatchCommand('toggle-file-finder');
            expect(projectView.error.text()).toBe('Project is empty');
            return expect(projectView.list.children('li').length).toBe(0);
          });
        });
      });
      return describe("when a path selection is confirmed", function() {
        it("opens the file associated with that path in that split", function() {
          var editor1, editor2, expectedPath;
          jasmine.attachToDOM(workspaceElement);
          editor1 = atom.workspace.getActiveTextEditor();
          atom.workspace.getActivePane().splitRight({
            copyActiveItem: true
          });
          editor2 = atom.workspace.getActiveTextEditor();
          dispatchCommand('toggle-file-finder');
          expectedPath = atom.project.getDirectories()[0].resolve('dir/a');
          projectView.confirmed({
            filePath: expectedPath
          });
          waitsFor(function() {
            return atom.workspace.getActivePane().getItems().length === 2;
          });
          return runs(function() {
            var editor3;
            editor3 = atom.workspace.getActiveTextEditor();
            expect(atom.workspace.panelForItem(projectView).isVisible()).toBe(false);
            expect(editor1.getPath()).not.toBe(expectedPath);
            expect(editor2.getPath()).not.toBe(expectedPath);
            expect(editor3.getPath()).toBe(expectedPath);
            return expect(atom.views.getView(editor3)).toHaveFocus();
          });
        });
        return describe("when the selected path is a directory", function() {
          return it("leaves the the tree view open, doesn't open the path in the editor, and displays an error", function() {
            var editorPath;
            jasmine.attachToDOM(workspaceElement);
            editorPath = atom.workspace.getActiveTextEditor().getPath();
            dispatchCommand('toggle-file-finder');
            projectView.confirmed({
              filePath: atom.project.getDirectories()[0].resolve('dir')
            });
            expect(projectView.hasParent()).toBeTruthy();
            expect(atom.workspace.getActiveTextEditor().getPath()).toBe(editorPath);
            expect(projectView.error.text().length).toBeGreaterThan(0);
            advanceClock(2000);
            return expect(projectView.error.text().length).toBe(0);
          });
        });
      });
    });
    describe("buffer-finder behavior", function() {
      describe("toggling", function() {
        describe("when there are pane items with paths", function() {
          beforeEach(function() {
            jasmine.attachToDOM(workspaceElement);
            return waitsForPromise(function() {
              return atom.workspace.open('sample.txt');
            });
          });
          it("shows the FuzzyFinder if it isn't showing, or hides it and returns focus to the active editor", function() {
            var editor1, editor2, editor3, _ref3;
            expect(atom.workspace.panelForItem(bufferView)).toBeNull();
            atom.workspace.getActivePane().splitRight({
              copyActiveItem: true
            });
            _ref3 = atom.workspace.getTextEditors(), editor1 = _ref3[0], editor2 = _ref3[1], editor3 = _ref3[2];
            expect(atom.workspace.getActivePaneItem()).toBe(editor3);
            expect(atom.views.getView(editor3)).toHaveFocus();
            dispatchCommand('toggle-buffer-finder');
            expect(atom.workspace.panelForItem(bufferView).isVisible()).toBe(true);
            expect(workspaceElement.querySelector('.fuzzy-finder')).toHaveFocus();
            bufferView.filterEditorView.getModel().insertText('this should not show up next time we toggle');
            dispatchCommand('toggle-buffer-finder');
            expect(atom.views.getView(editor3)).toHaveFocus();
            expect(atom.workspace.panelForItem(bufferView).isVisible()).toBe(false);
            dispatchCommand('toggle-buffer-finder');
            return expect(bufferView.filterEditorView.getText()).toBe('');
          });
          it("lists the paths of the current items, sorted by most recently opened but with the current item last", function() {
            waitsForPromise(function() {
              return atom.workspace.open('sample-with-tabs.coffee');
            });
            runs(function() {
              dispatchCommand('toggle-buffer-finder');
              expect(atom.workspace.panelForItem(bufferView).isVisible()).toBe(true);
              expect(_.pluck(bufferView.list.find('li > div.file'), 'outerText')).toEqual(['sample.txt', 'sample.js', 'sample-with-tabs.coffee']);
              dispatchCommand('toggle-buffer-finder');
              return expect(atom.workspace.panelForItem(bufferView).isVisible()).toBe(false);
            });
            waitsForPromise(function() {
              return atom.workspace.open('sample.txt');
            });
            return runs(function() {
              dispatchCommand('toggle-buffer-finder');
              expect(atom.workspace.panelForItem(bufferView).isVisible()).toBe(true);
              expect(_.pluck(bufferView.list.find('li > div.file'), 'outerText')).toEqual(['sample-with-tabs.coffee', 'sample.js', 'sample.txt']);
              return expect(bufferView.list.children().first()).toHaveClass('selected');
            });
          });
          return it("serializes the list of paths and their last opened time", function() {
            waitsForPromise(function() {
              return atom.workspace.open('sample-with-tabs.coffee');
            });
            runs(function() {
              return dispatchCommand('toggle-buffer-finder');
            });
            waitsForPromise(function() {
              return atom.workspace.open('sample.js');
            });
            runs(function() {
              return dispatchCommand('toggle-buffer-finder');
            });
            waitsForPromise(function() {
              return atom.workspace.open();
            });
            return runs(function() {
              var bufferPath, paths, states, time, _i, _len, _ref3, _results;
              atom.packages.deactivatePackage('fuzzy-finder');
              states = _.map(atom.packages.getPackageState('fuzzy-finder'), function(path, time) {
                return [path, time];
              });
              expect(states.length).toBe(3);
              states = _.sortBy(states, function(path, time) {
                return -time;
              });
              paths = ['sample-with-tabs.coffee', 'sample.txt', 'sample.js'];
              _results = [];
              for (_i = 0, _len = states.length; _i < _len; _i++) {
                _ref3 = states[_i], time = _ref3[0], bufferPath = _ref3[1];
                expect(_.last(bufferPath.split(path.sep))).toBe(paths.shift());
                _results.push(expect(time).toBeGreaterThan(50000));
              }
              return _results;
            });
          });
        });
        describe("when there are only panes with anonymous items", function() {
          return it("does not open", function() {
            atom.workspace.getActivePane().destroy();
            waitsForPromise(function() {
              return atom.workspace.open();
            });
            return runs(function() {
              dispatchCommand('toggle-buffer-finder');
              return expect(atom.workspace.panelForItem(bufferView)).toBeNull();
            });
          });
        });
        describe("when there are no pane items", function() {
          return it("does not open", function() {
            atom.workspace.getActivePane().destroy();
            dispatchCommand('toggle-buffer-finder');
            return expect(atom.workspace.panelForItem(bufferView)).toBeNull();
          });
        });
        return describe("when multiple sessions are opened on the same path", function() {
          return it("does not display duplicates for that path in the list", function() {
            waitsForPromise(function() {
              return atom.workspace.open('sample.js');
            });
            return runs(function() {
              atom.workspace.getActivePane().splitRight({
                copyActiveItem: true
              });
              dispatchCommand('toggle-buffer-finder');
              return expect(_.pluck(bufferView.list.find('li > div.file'), 'outerText')).toEqual(['sample.js']);
            });
          });
        });
      });
      return describe("when a path selection is confirmed", function() {
        var editor1, editor2, editor3, _ref3;
        _ref3 = [], editor1 = _ref3[0], editor2 = _ref3[1], editor3 = _ref3[2];
        beforeEach(function() {
          jasmine.attachToDOM(workspaceElement);
          atom.workspace.getActivePane().splitRight({
            copyActiveItem: true
          });
          waitsForPromise(function() {
            return atom.workspace.open('sample.txt');
          });
          return runs(function() {
            var _ref4;
            _ref4 = atom.workspace.getTextEditors(), editor1 = _ref4[0], editor2 = _ref4[1], editor3 = _ref4[2];
            expect(atom.workspace.getActiveTextEditor()).toBe(editor3);
            atom.commands.dispatch(atom.views.getView(editor2), 'pane:show-previous-item');
            return dispatchCommand('toggle-buffer-finder');
          });
        });
        describe("when the active pane has an item for the selected path", function() {
          return it("switches to the item for the selected path", function() {
            var expectedPath;
            expectedPath = atom.project.getDirectories()[0].resolve('sample.txt');
            bufferView.confirmed({
              filePath: expectedPath
            });
            waitsFor(function() {
              return atom.workspace.getActiveTextEditor().getPath() === expectedPath;
            });
            return runs(function() {
              expect(atom.workspace.panelForItem(bufferView).isVisible()).toBe(false);
              expect(editor1.getPath()).not.toBe(expectedPath);
              expect(editor2.getPath()).not.toBe(expectedPath);
              expect(editor3.getPath()).toBe(expectedPath);
              return expect(atom.views.getView(editor3)).toHaveFocus();
            });
          });
        });
        return describe("when the active pane does not have an item for the selected path", function() {
          return it("adds a new item to the active pane for the selcted path", function() {
            var expectedPath;
            dispatchCommand('toggle-buffer-finder');
            atom.views.getView(editor1).focus();
            dispatchCommand('toggle-buffer-finder');
            expect(atom.workspace.getActiveTextEditor()).toBe(editor1);
            expectedPath = atom.project.getDirectories()[0].resolve('sample.txt');
            bufferView.confirmed({
              filePath: expectedPath
            });
            waitsFor(function() {
              return atom.workspace.getActivePane().getItems().length === 2;
            });
            return runs(function() {
              var editor4;
              editor4 = atom.workspace.getActiveTextEditor();
              expect(atom.workspace.panelForItem(bufferView).isVisible()).toBe(false);
              expect(editor4).not.toBe(editor1);
              expect(editor4).not.toBe(editor2);
              expect(editor4).not.toBe(editor3);
              expect(editor4.getPath()).toBe(expectedPath);
              return expect(atom.views.getView(editor4)).toHaveFocus();
            });
          });
        });
      });
    });
    describe("common behavior between file and buffer finder", function() {
      return describe("when the fuzzy finder is cancelled", function() {
        describe("when an editor is open", function() {
          return it("detaches the finder and focuses the previously focused element", function() {
            var activeEditor;
            jasmine.attachToDOM(workspaceElement);
            activeEditor = atom.workspace.getActiveTextEditor();
            dispatchCommand('toggle-file-finder');
            expect(projectView.hasParent()).toBeTruthy();
            expect(projectView.filterEditorView).toHaveFocus();
            projectView.cancel();
            expect(atom.workspace.panelForItem(projectView).isVisible()).toBe(false);
            return expect(atom.views.getView(activeEditor)).toHaveFocus();
          });
        });
        return describe("when no editors are open", function() {
          return it("detaches the finder and focuses the previously focused element", function() {
            var inputView;
            jasmine.attachToDOM(workspaceElement);
            atom.workspace.getActivePane().destroy();
            inputView = $$(function() {
              return this.input();
            });
            workspaceElement.appendChild(inputView[0]);
            inputView.focus();
            dispatchCommand('toggle-file-finder');
            expect(projectView.hasParent()).toBeTruthy();
            expect(projectView.filterEditorView).toHaveFocus();
            projectView.cancel();
            expect(atom.workspace.panelForItem(projectView).isVisible()).toBe(false);
            return expect(inputView).toHaveFocus();
          });
        });
      });
    });
    describe("cached file paths", function() {
      beforeEach(function() {
        spyOn(PathLoader, "startTask").andCallThrough();
        return spyOn(atom.workspace, "getTextEditors").andCallThrough();
      });
      it("caches file paths after first time", function() {
        dispatchCommand('toggle-file-finder');
        waitForPathsToDisplay(projectView);
        runs(function() {
          expect(PathLoader.startTask).toHaveBeenCalled();
          PathLoader.startTask.reset();
          dispatchCommand('toggle-file-finder');
          return dispatchCommand('toggle-file-finder');
        });
        waitForPathsToDisplay(projectView);
        return runs(function() {
          return expect(PathLoader.startTask).not.toHaveBeenCalled();
        });
      });
      it("doesn't cache buffer paths", function() {
        dispatchCommand('toggle-buffer-finder');
        waitForPathsToDisplay(bufferView);
        runs(function() {
          expect(atom.workspace.getTextEditors).toHaveBeenCalled();
          atom.workspace.getTextEditors.reset();
          dispatchCommand('toggle-buffer-finder');
          return dispatchCommand('toggle-buffer-finder');
        });
        waitForPathsToDisplay(bufferView);
        return runs(function() {
          return expect(atom.workspace.getTextEditors).toHaveBeenCalled();
        });
      });
      it("busts the cache when the window gains focus", function() {
        dispatchCommand('toggle-file-finder');
        waitForPathsToDisplay(projectView);
        return runs(function() {
          expect(PathLoader.startTask).toHaveBeenCalled();
          PathLoader.startTask.reset();
          window.dispatchEvent(new CustomEvent('focus'));
          dispatchCommand('toggle-file-finder');
          dispatchCommand('toggle-file-finder');
          return expect(PathLoader.startTask).toHaveBeenCalled();
        });
      });
      return it("busts the cache when the project path changes", function() {
        dispatchCommand('toggle-file-finder');
        waitForPathsToDisplay(projectView);
        return runs(function() {
          expect(PathLoader.startTask).toHaveBeenCalled();
          PathLoader.startTask.reset();
          atom.project.setPaths([temp.mkdirSync('atom')]);
          dispatchCommand('toggle-file-finder');
          dispatchCommand('toggle-file-finder');
          expect(PathLoader.startTask).toHaveBeenCalled();
          return expect(projectView.list.children('li').length).toBe(0);
        });
      });
    });
    describe("opening a path into a split", function() {
      it("opens the path by splitting the active editor left", function() {
        var filePath, pane;
        expect(atom.workspace.getPanes().length).toBe(1);
        pane = atom.workspace.getActivePane();
        dispatchCommand('toggle-buffer-finder');
        filePath = bufferView.getSelectedItem().filePath;
        atom.commands.dispatch(bufferView.filterEditorView.element, 'pane:split-left');
        waitsFor(function() {
          return atom.workspace.getPanes().length === 2;
        });
        return runs(function() {
          var leftPane, rightPane, _ref3;
          _ref3 = atom.workspace.getPanes(), leftPane = _ref3[0], rightPane = _ref3[1];
          expect(atom.workspace.getActivePane()).toBe(leftPane);
          return expect(atom.workspace.getActiveTextEditor().getPath()).toBe(atom.project.getDirectories()[0].resolve(filePath));
        });
      });
      it("opens the path by splitting the active editor right", function() {
        var filePath, pane;
        expect(atom.workspace.getPanes().length).toBe(1);
        pane = atom.workspace.getActivePane();
        dispatchCommand('toggle-buffer-finder');
        filePath = bufferView.getSelectedItem().filePath;
        atom.commands.dispatch(bufferView.filterEditorView.element, 'pane:split-right');
        waitsFor(function() {
          return atom.workspace.getPanes().length === 2;
        });
        return runs(function() {
          var leftPane, rightPane, _ref3;
          _ref3 = atom.workspace.getPanes(), leftPane = _ref3[0], rightPane = _ref3[1];
          expect(atom.workspace.getActivePane()).toBe(rightPane);
          return expect(atom.workspace.getActiveTextEditor().getPath()).toBe(atom.project.getDirectories()[0].resolve(filePath));
        });
      });
      it("opens the path by splitting the active editor up", function() {
        var filePath, pane;
        expect(atom.workspace.getPanes().length).toBe(1);
        pane = atom.workspace.getActivePane();
        dispatchCommand('toggle-buffer-finder');
        filePath = bufferView.getSelectedItem().filePath;
        atom.commands.dispatch(bufferView.filterEditorView.element, 'pane:split-up');
        waitsFor(function() {
          return atom.workspace.getPanes().length === 2;
        });
        return runs(function() {
          var bottomPane, topPane, _ref3;
          _ref3 = atom.workspace.getPanes(), topPane = _ref3[0], bottomPane = _ref3[1];
          expect(atom.workspace.getActivePane()).toBe(topPane);
          return expect(atom.workspace.getActiveTextEditor().getPath()).toBe(atom.project.getDirectories()[0].resolve(filePath));
        });
      });
      return it("opens the path by splitting the active editor down", function() {
        var filePath, pane;
        expect(atom.workspace.getPanes().length).toBe(1);
        pane = atom.workspace.getActivePane();
        dispatchCommand('toggle-buffer-finder');
        filePath = bufferView.getSelectedItem().filePath;
        atom.commands.dispatch(bufferView.filterEditorView.element, 'pane:split-down');
        waitsFor(function() {
          return atom.workspace.getPanes().length === 2;
        });
        return runs(function() {
          var bottomPane, topPane, _ref3;
          _ref3 = atom.workspace.getPanes(), topPane = _ref3[0], bottomPane = _ref3[1];
          expect(atom.workspace.getActivePane()).toBe(bottomPane);
          return expect(atom.workspace.getActiveTextEditor().getPath()).toBe(atom.project.getDirectories()[0].resolve(filePath));
        });
      });
    });
    describe("when the filter text contains a colon followed by a number", function() {
      beforeEach(function() {
        jasmine.attachToDOM(workspaceElement);
        expect(atom.workspace.panelForItem(projectView)).toBeNull();
        waitsForPromise(function() {
          return atom.workspace.open('sample.txt');
        });
        return runs(function() {
          var editor1, editor2, _ref3;
          _ref3 = atom.workspace.getTextEditors(), editor1 = _ref3[0], editor2 = _ref3[1];
          expect(atom.workspace.getActiveTextEditor()).toBe(editor2);
          return expect(editor1.getCursorBufferPosition()).toEqual([0, 0]);
        });
      });
      describe("when the filter text has a file path", function() {
        return it("opens the selected path to that line number", function() {
          var editor1, editor2, filePath, _ref3;
          _ref3 = atom.workspace.getTextEditors(), editor1 = _ref3[0], editor2 = _ref3[1];
          dispatchCommand('toggle-buffer-finder');
          expect(atom.workspace.panelForItem(bufferView).isVisible()).toBe(true);
          bufferView.filterEditorView.getModel().setText('sample.js:4');
          bufferView.populateList();
          filePath = bufferView.getSelectedItem().filePath;
          expect(atom.project.getDirectories()[0].resolve(filePath)).toBe(editor1.getPath());
          spyOn(bufferView, 'moveToLine').andCallThrough();
          atom.commands.dispatch(bufferView.element, 'core:confirm');
          waitsFor(function() {
            return bufferView.moveToLine.callCount > 0;
          });
          return runs(function() {
            expect(atom.workspace.getActiveTextEditor()).toBe(editor1);
            return expect(editor1.getCursorBufferPosition()).toEqual([3, 4]);
          });
        });
      });
      describe("when the filter text doesn't have a file path", function() {
        return it("moves the cursor in the active editor to that line number", function() {
          var editor1, editor2, _ref3;
          _ref3 = atom.workspace.getTextEditors(), editor1 = _ref3[0], editor2 = _ref3[1];
          waitsForPromise(function() {
            return atom.workspace.open('sample.js');
          });
          runs(function() {
            expect(atom.workspace.getActiveTextEditor()).toBe(editor1);
            dispatchCommand('toggle-buffer-finder');
            expect(atom.workspace.panelForItem(bufferView).isVisible()).toBe(true);
            bufferView.filterEditorView.getModel().insertText(':4');
            bufferView.populateList();
            expect(bufferView.list.children('li').length).toBe(0);
            spyOn(bufferView, 'moveToLine').andCallThrough();
            return atom.commands.dispatch(bufferView.element, 'core:confirm');
          });
          waitsFor(function() {
            return bufferView.moveToLine.callCount > 0;
          });
          return runs(function() {
            expect(atom.workspace.getActiveTextEditor()).toBe(editor1);
            return expect(editor1.getCursorBufferPosition()).toEqual([3, 4]);
          });
        });
      });
      return describe("when splitting panes", function() {
        return it("opens the selected path to that line number in a new pane", function() {
          var editor1, editor2, _ref3;
          _ref3 = atom.workspace.getTextEditors(), editor1 = _ref3[0], editor2 = _ref3[1];
          waitsForPromise(function() {
            return atom.workspace.open('sample.js');
          });
          runs(function() {
            expect(atom.workspace.getActiveTextEditor()).toBe(editor1);
            dispatchCommand('toggle-buffer-finder');
            expect(atom.workspace.panelForItem(bufferView).isVisible()).toBe(true);
            bufferView.filterEditorView.getModel().insertText(':4');
            bufferView.populateList();
            expect(bufferView.list.children('li').length).toBe(0);
            spyOn(bufferView, 'moveToLine').andCallThrough();
            return atom.commands.dispatch(bufferView.filterEditorView.element, 'pane:split-left');
          });
          waitsFor(function() {
            return bufferView.moveToLine.callCount > 0;
          });
          return runs(function() {
            expect(atom.workspace.getActiveTextEditor()).not.toBe(editor1);
            expect(atom.workspace.getActiveTextEditor().getPath()).toBe(editor1.getPath());
            return expect(atom.workspace.getActiveTextEditor().getCursorBufferPosition()).toEqual([3, 4]);
          });
        });
      });
    });
    return describe("Git integration", function() {
      var gitDirectory, gitRepository, projectPath, _ref3;
      _ref3 = [], projectPath = _ref3[0], gitRepository = _ref3[1], gitDirectory = _ref3[2];
      beforeEach(function() {
        projectPath = atom.project.getDirectories()[0].resolve('git/working-dir');
        fs.moveSync(path.join(projectPath, 'git.git'), path.join(projectPath, '.git'));
        atom.project.setPaths([rootDir2, projectPath]);
        gitDirectory = atom.project.getDirectories()[1];
        return gitRepository = atom.project.getRepositories()[1];
      });
      describe("git-status-finder behavior", function() {
        var newPath, originalPath, originalText, _ref4;
        _ref4 = [], originalText = _ref4[0], originalPath = _ref4[1], newPath = _ref4[2];
        beforeEach(function() {
          waitsForPromise(function() {
            return atom.workspace.open(path.join(projectPath, 'a.txt'));
          });
          return runs(function() {
            var editor;
            editor = atom.workspace.getActiveTextEditor();
            originalText = editor.getText();
            originalPath = editor.getPath();
            fs.writeFileSync(originalPath, 'making a change for the better');
            gitRepository.getPathStatus(originalPath);
            newPath = atom.project.getDirectories()[1].resolve('newsample.js');
            fs.writeFileSync(newPath, '');
            return gitRepository.getPathStatus(newPath);
          });
        });
        return it("displays all new and modified paths", function() {
          expect(atom.workspace.panelForItem(gitStatusView)).toBeNull();
          dispatchCommand('toggle-git-status-finder');
          expect(atom.workspace.panelForItem(gitStatusView).isVisible()).toBe(true);
          expect(gitStatusView.find('.file').length).toBe(2);
          expect(gitStatusView.find('.status.status-modified').length).toBe(1);
          return expect(gitStatusView.find('.status.status-added').length).toBe(1);
        });
      });
      describe("status decorations", function() {
        var editor, newPath, originalPath, originalText, _ref4;
        _ref4 = [], originalText = _ref4[0], originalPath = _ref4[1], editor = _ref4[2], newPath = _ref4[3];
        beforeEach(function() {
          jasmine.attachToDOM(workspaceElement);
          waitsForPromise(function() {
            return atom.workspace.open(path.join(projectPath, 'a.txt'));
          });
          return runs(function() {
            editor = atom.workspace.getActiveTextEditor();
            originalText = editor.getText();
            originalPath = editor.getPath();
            newPath = gitDirectory.resolve('newsample.js');
            return fs.writeFileSync(newPath, '');
          });
        });
        describe("when a modified file is shown in the list", function() {
          return it("displays the modified icon", function() {
            editor.setText('modified');
            editor.save();
            gitRepository.getPathStatus(editor.getPath());
            dispatchCommand('toggle-buffer-finder');
            expect(bufferView.find('.status.status-modified').length).toBe(1);
            return expect(bufferView.find('.status.status-modified').closest('li').find('.file').text()).toBe('a.txt');
          });
        });
        return describe("when a new file is shown in the list", function() {
          return it("displays the new icon", function() {
            waitsForPromise(function() {
              return atom.workspace.open(path.join(projectPath, 'newsample.js'));
            });
            return runs(function() {
              gitRepository.getPathStatus(editor.getPath());
              dispatchCommand('toggle-buffer-finder');
              expect(bufferView.find('.status.status-added').length).toBe(1);
              return expect(bufferView.find('.status.status-added').closest('li').find('.file').text()).toBe('newsample.js');
            });
          });
        });
      });
      return describe("when core.excludeVcsIgnoredPaths is set to true", function() {
        beforeEach(function() {
          return atom.config.set("core.excludeVcsIgnoredPaths", true);
        });
        describe("when the project's path is the repository's working directory", function() {
          var ignoreFile, ignoredFile, _ref4;
          _ref4 = [], ignoreFile = _ref4[0], ignoredFile = _ref4[1];
          beforeEach(function() {
            ignoreFile = path.join(projectPath, '.gitignore');
            fs.writeFileSync(ignoreFile, 'ignored.txt');
            ignoredFile = path.join(projectPath, 'ignored.txt');
            fs.writeFileSync(ignoredFile, 'ignored text');
            return atom.config.set("core.excludeVcsIgnoredPaths", true);
          });
          return it("excludes paths that are git ignored", function() {
            dispatchCommand('toggle-file-finder');
            projectView.setMaxItems(Infinity);
            waitForPathsToDisplay(projectView);
            return runs(function() {
              return expect(projectView.list.find("li:contains(ignored.txt)")).not.toExist();
            });
          });
        });
        return describe("when the project's path is a subfolder of the repository's working directory", function() {
          var ignoreFile;
          ignoreFile = [][0];
          beforeEach(function() {
            atom.project.setPaths([gitDirectory.resolve('dir')]);
            ignoreFile = path.join(projectPath, '.gitignore');
            return fs.writeFileSync(ignoreFile, 'b.txt');
          });
          return it("does not exclude paths that are git ignored", function() {
            dispatchCommand('toggle-file-finder');
            projectView.setMaxItems(Infinity);
            waitForPathsToDisplay(projectView);
            return runs(function() {
              return expect(projectView.list.find("li:contains(b.txt)")).toExist();
            });
          });
        });
      });
    });
  });

}).call(this);
