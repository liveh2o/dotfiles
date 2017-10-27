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
    var bufferView, dispatchCommand, eachFilePath, fixturesPath, fuzzyFinder, gitStatusView, projectView, rootDir1, rootDir2, waitForPathsToDisplay, workspaceElement, _ref1, _ref2;
    _ref1 = [], rootDir1 = _ref1[0], rootDir2 = _ref1[1];
    _ref2 = [], fuzzyFinder = _ref2[0], projectView = _ref2[1], bufferView = _ref2[2], gitStatusView = _ref2[3], workspaceElement = _ref2[4], fixturesPath = _ref2[5];
    beforeEach(function() {
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
            var junkDirPath, junkFilePath, _ref3;
            _ref3 = [], junkDirPath = _ref3[0], junkFilePath = _ref3[1];
            beforeEach(function() {
              var brokenFilePath;
              junkDirPath = fs.realpathSync(temp.mkdirSync('junk-1'));
              junkFilePath = path.join(junkDirPath, 'file.txt');
              fs.writeFileSync(junkFilePath, 'txt');
              fs.writeFileSync(path.join(junkDirPath, 'a'), 'txt');
              brokenFilePath = path.join(junkDirPath, 'delete.txt');
              fs.writeFileSync(brokenFilePath, 'delete-me');
              fs.symlinkSync(junkFilePath, atom.project.getDirectories()[0].resolve('symlink-to-file'));
              fs.symlinkSync(junkDirPath, atom.project.getDirectories()[0].resolve('symlink-to-dir'));
              fs.symlinkSync(brokenFilePath, atom.project.getDirectories()[0].resolve('broken-symlink'));
              fs.symlinkSync(atom.project.getDirectories()[0].resolve('sample.txt'), atom.project.getDirectories()[0].resolve('symlink-to-internal-file'));
              fs.symlinkSync(atom.project.getDirectories()[0].resolve('dir'), atom.project.getDirectories()[0].resolve('symlink-to-internal-dir'));
              return fs.unlinkSync(brokenFilePath);
            });
            it("includes symlinked file paths", function() {
              dispatchCommand('toggle-file-finder');
              waitForPathsToDisplay(projectView);
              return runs(function() {
                expect(projectView.list.find("li:contains(symlink-to-file)")).toExist();
                return expect(projectView.list.find("li:contains(symlink-to-internal-file)")).not.toExist();
              });
            });
            it("excludes symlinked folder paths if followSymlinks is false", function() {
              atom.config.set('core.followSymlinks', false);
              dispatchCommand('toggle-file-finder');
              waitForPathsToDisplay(projectView);
              return runs(function() {
                expect(projectView.list.find("li:contains(symlink-to-dir)")).not.toExist();
                expect(projectView.list.find("li:contains(symlink-to-dir/a)")).not.toExist();
                expect(projectView.list.find("li:contains(symlink-to-internal-dir)")).not.toExist();
                return expect(projectView.list.find("li:contains(symlink-to-internal-dir/a)")).not.toExist();
              });
            });
            return it("includes symlinked folder paths if followSymlinks is true", function() {
              atom.config.set('core.followSymlinks', true);
              dispatchCommand('toggle-file-finder');
              waitForPathsToDisplay(projectView);
              return runs(function() {
                expect(projectView.list.find("li:contains(symlink-to-dir/a)")).toExist();
                return expect(projectView.list.find("li:contains(symlink-to-internal-dir/a)")).not.toExist();
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
          it("ignores paths that match entries in config.fuzzy-finder.ignoredNames", function() {
            atom.config.set("fuzzy-finder.ignoredNames", ["sample.js", "*.txt"]);
            dispatchCommand('toggle-file-finder');
            waitForPathsToDisplay(projectView);
            return runs(function() {
              expect(projectView.list.find("li:contains(sample.js)")).not.toExist();
              expect(projectView.list.find("li:contains(sample.txt)")).not.toExist();
              return expect(projectView.list.find("li:contains(a)")).toExist();
            });
          });
          return it("only shows a given path once, even if it's within multiple root folders", function() {
            var childDir1, childFile1;
            childDir1 = path.join(rootDir1, 'a-child');
            childFile1 = path.join(childDir1, 'child-file.txt');
            fs.mkdirSync(childDir1);
            fs.writeFileSync(childFile1, 'stuff');
            atom.project.addPath(childDir1);
            dispatchCommand('toggle-file-finder');
            waitForPathsToDisplay(projectView);
            return runs(function() {
              return expect(projectView.list.find("li:contains(child-file.txt)").length).toBe(1);
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
        describe("when the active pane does not have an item for the selected path and fuzzy-finder.searchAllPanes is false", function() {
          return it("adds a new item to the active pane for the selected path", function() {
            var expectedPath;
            dispatchCommand('toggle-buffer-finder');
            atom.views.getView(editor1).focus();
            dispatchCommand('toggle-buffer-finder');
            expect(atom.workspace.getActiveTextEditor()).toBe(editor1);
            expectedPath = atom.project.getDirectories()[0].resolve('sample.txt');
            bufferView.confirmed({
              filePath: expectedPath
            }, atom.config.get('fuzzy-finder.searchAllPanes'));
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
        return describe("when the active pane does not have an item for the selected path and fuzzy-finder.searchAllPanes is true", function() {
          beforeEach(function() {
            return atom.config.set("fuzzy-finder.searchAllPanes", true);
          });
          return it("switches to the pane with the item for the selected path", function() {
            var expectedPath, originalPane;
            dispatchCommand('toggle-buffer-finder');
            atom.views.getView(editor1).focus();
            dispatchCommand('toggle-buffer-finder');
            expect(atom.workspace.getActiveTextEditor()).toBe(editor1);
            originalPane = atom.workspace.getActivePane();
            expectedPath = atom.project.getDirectories()[0].resolve('sample.txt');
            bufferView.confirmed({
              filePath: expectedPath
            }, {
              searchAllPanes: atom.config.get('fuzzy-finder.searchAllPanes')
            });
            waitsFor(function() {
              return atom.workspace.getActiveTextEditor().getPath() === expectedPath;
            });
            return runs(function() {
              expect(atom.workspace.panelForItem(bufferView).isVisible()).toBe(false);
              expect(atom.workspace.getActivePane()).not.toBe(originalPane);
              expect(atom.workspace.getActiveTextEditor()).toBe(editor3);
              return expect(atom.workspace.getPaneItems().length).toBe(3);
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
      it("busts the cache when the project path changes", function() {
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
      return describe("the initial load paths task started during package activation", function() {
        beforeEach(function() {
          fuzzyFinder.projectView.destroy();
          fuzzyFinder.projectView = null;
          fuzzyFinder.startLoadPathsTask();
          return waitsFor(function() {
            return fuzzyFinder.projectPaths;
          });
        });
        it("passes the indexed paths into the project view when it is created", function() {
          var projectPaths;
          projectPaths = fuzzyFinder.projectPaths;
          expect(projectPaths.length).toBe(18);
          projectView = fuzzyFinder.createProjectView();
          expect(projectView.paths).toBe(projectPaths);
          return expect(projectView.reloadPaths).toBe(false);
        });
        return it("busts the cached paths when the project paths change", function() {
          var projectPaths;
          atom.project.setPaths([]);
          projectPaths = fuzzyFinder.projectPaths;
          expect(projectPaths).toBe(null);
          projectView = fuzzyFinder.createProjectView();
          expect(projectView.paths).toBe(null);
          return expect(projectView.reloadPaths).toBe(true);
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
        waitsFor(function() {
          return atom.workspace.getActiveTextEditor();
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
        waitsFor(function() {
          return atom.workspace.getActiveTextEditor();
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
        waitsFor(function() {
          return atom.workspace.getActiveTextEditor();
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
        waitsFor(function() {
          return atom.workspace.getActiveTextEditor();
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
      return describe("when the filter text has a file path", function() {
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
    });
    describe("match highlighting", function() {
      beforeEach(function() {
        jasmine.attachToDOM(workspaceElement);
        return dispatchCommand('toggle-buffer-finder');
      });
      it("highlights an exact match", function() {
        var primaryMatches, resultView, secondaryMatches;
        bufferView.filterEditorView.getModel().setText('sample.js');
        bufferView.populateList();
        resultView = bufferView.getSelectedItemView();
        primaryMatches = resultView.find('.primary-line .character-match');
        secondaryMatches = resultView.find('.secondary-line .character-match');
        expect(primaryMatches.length).toBe(1);
        expect(primaryMatches.last().text()).toBe('sample.js');
        expect(secondaryMatches.length).toBeGreaterThan(0);
        return expect(secondaryMatches.last().text()).toBe('sample.js');
      });
      it("highlights a partial match", function() {
        var primaryMatches, resultView, secondaryMatches;
        bufferView.filterEditorView.getModel().setText('sample');
        bufferView.populateList();
        resultView = bufferView.getSelectedItemView();
        primaryMatches = resultView.find('.primary-line .character-match');
        secondaryMatches = resultView.find('.secondary-line .character-match');
        expect(primaryMatches.length).toBe(1);
        expect(primaryMatches.last().text()).toBe('sample');
        expect(secondaryMatches.length).toBeGreaterThan(0);
        return expect(secondaryMatches.last().text()).toBe('sample');
      });
      it("highlights multiple matches in the file name", function() {
        var primaryMatches, resultView, secondaryMatches;
        bufferView.filterEditorView.getModel().setText('samplejs');
        bufferView.populateList();
        resultView = bufferView.getSelectedItemView();
        primaryMatches = resultView.find('.primary-line .character-match');
        secondaryMatches = resultView.find('.secondary-line .character-match');
        expect(primaryMatches.length).toBe(2);
        expect(primaryMatches.first().text()).toBe('sample');
        expect(primaryMatches.last().text()).toBe('js');
        expect(secondaryMatches.length).toBeGreaterThan(1);
        return expect(secondaryMatches.last().text()).toBe('js');
      });
      it("highlights matches in the directory and file name", function() {
        var primaryMatches, resultView, secondaryMatches;
        bufferView.items = [
          {
            filePath: '/test/root-dir1/sample.js',
            projectRelativePath: 'root-dir1/sample.js'
          }
        ];
        bufferView.filterEditorView.getModel().setText('root-dirsample');
        bufferView.populateList();
        resultView = bufferView.getSelectedItemView();
        primaryMatches = resultView.find('.primary-line .character-match');
        expect(primaryMatches.length).toBe(1);
        expect(primaryMatches.last().text()).toBe('sample');
        secondaryMatches = resultView.find('.secondary-line .character-match');
        expect(secondaryMatches.length).toBe(2);
        expect(secondaryMatches.first().text()).toBe('root-dir');
        return expect(secondaryMatches.last().text()).toBe('sample');
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
    describe("preserve last search", function() {
      it("does not preserve last search by default", function() {
        dispatchCommand('toggle-file-finder');
        expect(atom.workspace.panelForItem(projectView).isVisible()).toBe(true);
        projectView.filterEditorView.getModel().insertText('this should not show up next time we open finder');
        dispatchCommand('toggle-file-finder');
        expect(atom.workspace.panelForItem(projectView).isVisible()).toBe(false);
        dispatchCommand('toggle-file-finder');
        expect(atom.workspace.panelForItem(projectView).isVisible()).toBe(true);
        return expect(projectView.filterEditorView.getText()).toBe('');
      });
      return it("preserves last search when the config is set", function() {
        atom.config.set("fuzzy-finder.preserveLastSearch", true);
        dispatchCommand('toggle-file-finder');
        expect(atom.workspace.panelForItem(projectView).isVisible()).toBe(true);
        projectView.filterEditorView.getModel().insertText('this should show up next time we open finder');
        dispatchCommand('toggle-file-finder');
        expect(atom.workspace.panelForItem(projectView).isVisible()).toBe(false);
        dispatchCommand('toggle-file-finder');
        expect(atom.workspace.panelForItem(projectView).isVisible()).toBe(true);
        expect(projectView.filterEditorView.getText()).toBe('this should show up next time we open finder');
        return expect(projectView.filterEditorView.getModel().getSelectedText()).toBe('this should show up next time we open finder');
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
          beforeEach(function() {
            var ignoreFile, ignoredFile;
            ignoreFile = path.join(projectPath, '.gitignore');
            fs.writeFileSync(ignoreFile, 'ignored.txt');
            ignoredFile = path.join(projectPath, 'ignored.txt');
            return fs.writeFileSync(ignoredFile, 'ignored text');
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
        describe("when the project's path is a subfolder of the repository's working directory", function() {
          beforeEach(function() {
            var ignoreFile;
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
        return describe("when the .gitignore matches parts of the path to the root folder", function() {
          beforeEach(function() {
            var ignoreFile;
            ignoreFile = path.join(projectPath, '.gitignore');
            return fs.writeFileSync(ignoreFile, path.basename(projectPath));
          });
          return it("only applies the .gitignore patterns to relative paths within the root folder", function() {
            dispatchCommand('toggle-file-finder');
            projectView.setMaxItems(Infinity);
            waitForPathsToDisplay(projectView);
            return runs(function() {
              return expect(projectView.list.find("li:contains(file.txt)")).toExist();
            });
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2Z1enp5LWZpbmRlci9zcGVjL2Z1enp5LWZpbmRlci1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx1REFBQTs7QUFBQSxFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsS0FBUixDQUFOLENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FEUCxDQUFBOztBQUFBLEVBRUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQUZKLENBQUE7O0FBQUEsRUFHQSxPQUFVLE9BQUEsQ0FBUSxzQkFBUixDQUFWLEVBQUMsU0FBQSxDQUFELEVBQUksVUFBQSxFQUhKLENBQUE7O0FBQUEsRUFJQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVIsQ0FKTCxDQUFBOztBQUFBLEVBS0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBTFAsQ0FBQTs7QUFBQSxFQU1BLE1BQUEsR0FBUyxPQUFBLENBQVEsUUFBUixDQU5ULENBQUE7O0FBQUEsRUFRQSxVQUFBLEdBQWEsT0FBQSxDQUFRLG9CQUFSLENBUmIsQ0FBQTs7QUFBQSxFQVVBLFFBQUEsQ0FBUyxhQUFULEVBQXdCLFNBQUEsR0FBQTtBQUN0QixRQUFBLDJLQUFBO0FBQUEsSUFBQSxRQUF1QixFQUF2QixFQUFDLG1CQUFELEVBQVcsbUJBQVgsQ0FBQTtBQUFBLElBQ0EsUUFBd0YsRUFBeEYsRUFBQyxzQkFBRCxFQUFjLHNCQUFkLEVBQTJCLHFCQUEzQixFQUF1Qyx3QkFBdkMsRUFBc0QsMkJBQXRELEVBQXdFLHVCQUR4RSxDQUFBO0FBQUEsSUFHQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsTUFBQSxRQUFBLEdBQVcsRUFBRSxDQUFDLFlBQUgsQ0FBZ0IsSUFBSSxDQUFDLFNBQUwsQ0FBZSxXQUFmLENB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

//# sourceURL=/Users/ah/.atom/packages/fuzzy-finder/spec/fuzzy-finder-spec.coffee
