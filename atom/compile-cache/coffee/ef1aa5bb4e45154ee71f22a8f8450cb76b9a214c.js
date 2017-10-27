(function() {
  var $, $$, DefaultFileIcons, PathLoader, escapeSelector, fs, net, path, rmrf, temp, wrench, _, _ref;

  net = require("net");

  path = require('path');

  _ = require('underscore-plus');

  _ref = require('atom-space-pen-views'), $ = _ref.$, $$ = _ref.$$;

  fs = require('fs-plus');

  temp = require('temp');

  wrench = require('wrench');

  PathLoader = require('../lib/path-loader');

  DefaultFileIcons = require('../lib/default-file-icons');

  escapeSelector = function(_selector) {
    return _selector.replace(/\\/g, '\\\\');
  };

  rmrf = function(_path) {
    if (fs.statSync(_path).isDirectory()) {
      _.each(fs.readdirSync(_path), function(child) {
        return rmrf(path.join(_path, child));
      });
      return fs.rmdirSync(_path);
    } else {
      return fs.unlinkSync(_path);
    }
  };

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
                item = projectView.list.find("li:contains(" + (escapeSelector(filePath)) + ")").eq(0);
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
                item = projectView.list.find("li:contains(" + (escapeSelector(filePath)) + ")").eq(0);
                expect(item).toExist();
                return expect(item.find("div").eq(1)).toHaveText(path.join(path.basename(rootDir1), filePath));
              });
              return eachFilePath([rootDir2], function(filePath) {
                var item;
                item = projectView.list.find("li:contains(" + (escapeSelector(filePath)) + ")").eq(0);
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
          it("puts the last opened path first", function() {
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
          it("displays paths correctly if the last-opened path is not part of the project (regression)", function() {
            waitsForPromise(function() {
              return atom.workspace.open('foo.txt');
            });
            waitsForPromise(function() {
              return atom.workspace.open('sample.js');
            });
            runs(function() {
              return dispatchCommand('toggle-file-finder');
            });
            return waitForPathsToDisplay(projectView);
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
            it("indexes project paths that are symlinks", function() {
              var symlinkProjectPath;
              symlinkProjectPath = path.join(junkDirPath, 'root-dir-symlink');
              fs.symlinkSync(atom.project.getPaths()[0], symlinkProjectPath);
              atom.project.setPaths([symlinkProjectPath]);
              dispatchCommand('toggle-file-finder');
              waitForPathsToDisplay(projectView);
              return runs(function() {
                return expect(projectView.list.find("li:contains(sample.txt)")).toExist();
              });
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
                item = projectView.list.find("li:contains(" + (escapeSelector(filePath)) + ")").eq(0);
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
      describe("when a project's root path is unlinked", function() {
        beforeEach(function() {
          if (fs.existsSync(rootDir1)) {
            rmrf(rootDir1);
          }
          if (fs.existsSync(rootDir2)) {
            return rmrf(rootDir2);
          }
        });
        return it("posts an error notification", function() {
          spyOn(atom.notifications, 'addError');
          dispatchCommand('toggle-file-finder');
          waitsFor(function() {
            return atom.workspace.panelForItem(projectView).isVisible();
          });
          return runs(function() {
            return expect(atom.notifications.addError).toHaveBeenCalled();
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
          expect(projectPaths.length).toBe(19);
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
    describe("file icons", function() {
      var fileIcons;
      fileIcons = new DefaultFileIcons;
      it("defaults to text", function() {
        waitsForPromise(function() {
          return atom.workspace.open('sample.js');
        });
        return runs(function() {
          var firstResult;
          dispatchCommand('toggle-buffer-finder');
          expect(atom.workspace.panelForItem(bufferView).isVisible()).toBe(true);
          bufferView.filterEditorView.getModel().insertText('js');
          bufferView.populateList();
          firstResult = bufferView.list.children('li').find('.primary-line');
          return expect(fileIcons.iconClassForPath(firstResult[0].dataset.path)).toBe('icon-file-text');
        });
      });
      return it("shows image icons", function() {
        waitsForPromise(function() {
          return atom.workspace.open('sample.gif');
        });
        return runs(function() {
          var firstResult;
          dispatchCommand('toggle-buffer-finder');
          expect(atom.workspace.panelForItem(bufferView).isVisible()).toBe(true);
          bufferView.filterEditorView.getModel().insertText('gif');
          bufferView.populateList();
          firstResult = bufferView.list.children('li').find('.primary-line');
          return expect(fileIcons.iconClassForPath(firstResult[0].dataset.path)).toBe('icon-file-media');
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
          jasmine.attachToDOM(workspaceElement);
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2Z1enp5LWZpbmRlci9zcGVjL2Z1enp5LWZpbmRlci1zcGVjLmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSwrRkFBQTs7QUFBQSxFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsS0FBUixDQUFOLENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FEUCxDQUFBOztBQUFBLEVBRUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQUZKLENBQUE7O0FBQUEsRUFHQSxPQUFVLE9BQUEsQ0FBUSxzQkFBUixDQUFWLEVBQUMsU0FBQSxDQUFELEVBQUksVUFBQSxFQUhKLENBQUE7O0FBQUEsRUFJQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVIsQ0FKTCxDQUFBOztBQUFBLEVBS0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBTFAsQ0FBQTs7QUFBQSxFQU1BLE1BQUEsR0FBUyxPQUFBLENBQVEsUUFBUixDQU5ULENBQUE7O0FBQUEsRUFRQSxVQUFBLEdBQWEsT0FBQSxDQUFRLG9CQUFSLENBUmIsQ0FBQTs7QUFBQSxFQVNBLGdCQUFBLEdBQW1CLE9BQUEsQ0FBUSwyQkFBUixDQVRuQixDQUFBOztBQUFBLEVBV0EsY0FBQSxHQUFpQixTQUFDLFNBQUQsR0FBQTtXQUNmLFNBQVMsQ0FBQyxPQUFWLENBQWtCLEtBQWxCLEVBQXlCLE1BQXpCLEVBRGU7RUFBQSxDQVhqQixDQUFBOztBQUFBLEVBY0EsSUFBQSxHQUFPLFNBQUMsS0FBRCxHQUFBO0FBQ0wsSUFBQSxJQUFHLEVBQUUsQ0FBQyxRQUFILENBQVksS0FBWixDQUFrQixDQUFDLFdBQW5CLENBQUEsQ0FBSDtBQUNFLE1BQUEsQ0FBQyxDQUFDLElBQUYsQ0FBTyxFQUFFLENBQUMsV0FBSCxDQUFlLEtB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

//# sourceURL=/Users/ah/.atom/packages/fuzzy-finder/spec/fuzzy-finder-spec.coffee
