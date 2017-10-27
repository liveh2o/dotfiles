(function() {
  var DefaultFileIcons, PathLoader, _, etch, fs, getCenter, getOrScheduleUpdatePromise, net, path, rmrf, temp, wrench;

  net = require("net");

  path = require('path');

  _ = require('underscore-plus');

  etch = require('etch');

  fs = require('fs-plus');

  temp = require('temp');

  wrench = require('wrench');

  PathLoader = require('../lib/path-loader');

  DefaultFileIcons = require('../lib/default-file-icons');

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

  getCenter = function() {
    var base, ref;
    return (ref = typeof (base = atom.workspace).getCenter === "function" ? base.getCenter() : void 0) != null ? ref : atom.workspace;
  };

  getOrScheduleUpdatePromise = function() {
    return new Promise(function(resolve) {
      return etch.getScheduler().updateDocument(resolve);
    });
  };

  describe('FuzzyFinder', function() {
    var bufferView, dispatchCommand, eachFilePath, fixturesPath, fuzzyFinder, gitStatusView, projectView, ref, ref1, rootDir1, rootDir2, waitForPathsToDisplay, workspaceElement;
    ref = [], rootDir1 = ref[0], rootDir2 = ref[1];
    ref1 = [], fuzzyFinder = ref1[0], projectView = ref1[1], bufferView = ref1[2], gitStatusView = ref1[3], workspaceElement = ref1[4], fixturesPath = ref1[5];
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
        return fuzzyFinderView.element.querySelectorAll("li").length > 0;
      });
    };
    eachFilePath = function(dirPaths, fn) {
      var dirPath, filePath, findings, fullPath, i, len, results;
      results = [];
      for (i = 0, len = dirPaths.length; i < len; i++) {
        dirPath = dirPaths[i];
        findings = (function() {
          var j, len1, ref2, results1;
          ref2 = wrench.readdirSyncRecursive(dirPath);
          results1 = [];
          for (j = 0, len1 = ref2.length; j < len1; j++) {
            filePath = ref2[j];
            fullPath = path.join(dirPath, filePath);
            if (fs.isFileSync(fullPath)) {
              fn(filePath);
              results1.push(true);
            } else {
              results1.push(void 0);
            }
          }
          return results1;
        })();
        results.push(expect(findings).toContain(true));
      }
      return results;
    };
    describe("file-finder behavior", function() {
      beforeEach(function() {
        return waitsFor(function() {
          return projectView.selectListView.update({
            maxResults: null
          });
        });
      });
      describe("toggling", function() {
        describe("when the project has multiple paths", function() {
          it("shows or hides the fuzzy-finder and returns focus to the active editor if it is already showing", function() {
            var editor1, editor2, ref2;
            jasmine.attachToDOM(workspaceElement);
            expect(atom.workspace.panelForItem(projectView)).toBeNull();
            atom.workspace.getActivePane().splitRight({
              copyActiveItem: true
            });
            ref2 = atom.workspace.getTextEditors(), editor1 = ref2[0], editor2 = ref2[1];
            waitsForPromise(function() {
              return projectView.toggle();
            });
            runs(function() {
              expect(atom.workspace.panelForItem(projectView).isVisible()).toBe(true);
              expect(projectView.selectListView.refs.queryEditor.element).toHaveFocus();
              return projectView.selectListView.refs.queryEditor.insertText('this should not show up next time we toggle');
            });
            waitsForPromise(function() {
              return projectView.toggle();
            });
            runs(function() {
              expect(atom.views.getView(editor1)).not.toHaveFocus();
              expect(atom.views.getView(editor2)).toHaveFocus();
              return expect(atom.workspace.panelForItem(projectView).isVisible()).toBe(false);
            });
            waitsForPromise(function() {
              return projectView.toggle();
            });
            return runs(function() {
              return expect(projectView.selectListView.refs.queryEditor.getText()).toBe('');
            });
          });
          it("shows all files for the current project and selects the first", function() {
            jasmine.attachToDOM(workspaceElement);
            waitsForPromise(function() {
              return projectView.toggle();
            });
            runs(function() {
              expect(projectView.element.querySelector(".loading").textContent.length).toBeGreaterThan(0);
              return waitForPathsToDisplay(projectView);
            });
            return runs(function() {
              eachFilePath([rootDir1, rootDir2], function(filePath) {
                var item, nameDiv;
                item = Array.from(projectView.element.querySelectorAll('li')).find(function(a) {
                  return a.textContent.includes(filePath);
                });
                expect(item).toExist();
                nameDiv = item.querySelector("div:first-child");
                expect(nameDiv.dataset.name).toBe(path.basename(filePath));
                return expect(nameDiv.textContent).toBe(path.basename(filePath));
              });
              return expect(projectView.element.querySelector(".loading")).not.toBeVisible();
            });
          });
          it("shows each file's path, including which root directory it's in", function() {
            waitsForPromise(function() {
              return projectView.toggle();
            });
            waitForPathsToDisplay(projectView);
            return runs(function() {
              eachFilePath([rootDir1], function(filePath) {
                var item;
                item = Array.from(projectView.element.querySelectorAll('li')).find(function(a) {
                  return a.textContent.includes(filePath);
                });
                expect(item).toExist();
                return expect(item.querySelectorAll("div")[1].textContent).toBe(path.join(path.basename(rootDir1), filePath));
              });
              return eachFilePath([rootDir2], function(filePath) {
                var item;
                item = Array.from(projectView.element.querySelectorAll('li')).find(function(a) {
                  return a.textContent.includes(filePath);
                });
                expect(item).toExist();
                return expect(item.querySelectorAll("div")[1].textContent).toBe(path.join(path.basename(rootDir2), filePath));
              });
            });
          });
          it("only creates a single path loader task", function() {
            spyOn(PathLoader, 'startTask').andCallThrough();
            waitsForPromise(function() {
              return projectView.toggle();
            });
            waitsForPromise(function() {
              return projectView.toggle();
            });
            waitsForPromise(function() {
              return projectView.toggle();
            });
            return runs(function() {
              return expect(PathLoader.startTask.callCount).toBe(1);
            });
          });
          it("puts the last opened path first", function() {
            waitsForPromise(function() {
              return atom.workspace.open('sample.txt');
            });
            waitsForPromise(function() {
              return atom.workspace.open('sample.js');
            });
            waitsForPromise(function() {
              return projectView.toggle();
            });
            runs(function() {
              return waitForPathsToDisplay(projectView);
            });
            return runs(function() {
              expect(projectView.element.querySelectorAll('li')[0].textContent).toContain('sample.txt');
              return expect(projectView.element.querySelectorAll('li')[1].textContent).toContain('sample.html');
            });
          });
          it("displays paths correctly if the last-opened path is not part of the project (regression)", function() {
            waitsForPromise(function() {
              return atom.workspace.open('foo.txt');
            });
            waitsForPromise(function() {
              return atom.workspace.open('sample.js');
            });
            waitsForPromise(function() {
              return projectView.toggle();
            });
            return runs(function() {
              return waitForPathsToDisplay(projectView);
            });
          });
          describe("symlinks on #darwin or #linux", function() {
            var junkDirPath, junkFilePath, ref2;
            ref2 = [], junkDirPath = ref2[0], junkFilePath = ref2[1];
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
              waitsForPromise(function() {
                return projectView.toggle();
              });
              runs(function() {});
              waitForPathsToDisplay(projectView);
              return runs(function() {
                return expect(Array.from(projectView.element.querySelectorAll('li')).find(function(a) {
                  return a.textContent.includes("sample.txt");
                })).toBeDefined();
              });
            });
            it("includes symlinked file paths", function() {
              waitsForPromise(function() {
                return projectView.toggle();
              });
              runs(function() {});
              waitForPathsToDisplay(projectView);
              return runs(function() {
                expect(Array.from(projectView.element.querySelectorAll('li')).find(function(a) {
                  return a.textContent.includes("symlink-to-file");
                })).toBeDefined();
                return expect(Array.from(projectView.element.querySelectorAll('li')).find(function(a) {
                  return a.textContent.includes("symlink-to-internal-file");
                })).not.toBeDefined();
              });
            });
            it("excludes symlinked folder paths if followSymlinks is false", function() {
              atom.config.set('core.followSymlinks', false);
              waitsForPromise(function() {
                return projectView.toggle();
              });
              runs(function() {});
              waitForPathsToDisplay(projectView);
              return runs(function() {
                expect(Array.from(projectView.element.querySelectorAll('li')).find(function(a) {
                  return a.textContent.includes("symlink-to-dir");
                })).not.toBeDefined();
                expect(Array.from(projectView.element.querySelectorAll('li')).find(function(a) {
                  return a.textContent.includes("symlink-to-dir/a");
                })).not.toBeDefined();
                expect(Array.from(projectView.element.querySelectorAll('li')).find(function(a) {
                  return a.textContent.includes("symlink-to-internal-dir");
                })).not.toBeDefined();
                return expect(Array.from(projectView.element.querySelectorAll('li')).find(function(a) {
                  return a.textContent.includes("symlink-to-internal-dir/a");
                })).not.toBeDefined();
              });
            });
            return it("includes symlinked folder paths if followSymlinks is true", function() {
              atom.config.set('core.followSymlinks', true);
              waitsForPromise(function() {
                return projectView.toggle();
              });
              runs(function() {});
              waitForPathsToDisplay(projectView);
              return runs(function() {
                expect(Array.from(projectView.element.querySelectorAll('li')).find(function(a) {
                  return a.textContent.includes("symlink-to-dir/a");
                })).toBeDefined();
                return expect(Array.from(projectView.element.querySelectorAll('li')).find(function(a) {
                  return a.textContent.includes("symlink-to-internal-dir/a");
                })).not.toBeDefined();
              });
            });
          });
          describe("socket files on #darwin or #linux", function() {
            var ref2, socketPath, socketServer;
            ref2 = [], socketServer = ref2[0], socketPath = ref2[1];
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
              waitsForPromise(function() {
                return projectView.toggle();
              });
              runs(function() {});
              waitForPathsToDisplay(projectView);
              return expect(Array.from(projectView.element.querySelectorAll('li')).find(function(a) {
                return a.textContent.includes("some.sock");
              })).not.toBeDefined();
            });
          });
          it("ignores paths that match entries in config.fuzzy-finder.ignoredNames", function() {
            atom.config.set("fuzzy-finder.ignoredNames", ["sample.js", "*.txt"]);
            waitsForPromise(function() {
              return projectView.toggle();
            });
            runs(function() {});
            waitForPathsToDisplay(projectView);
            return runs(function() {
              expect(Array.from(projectView.element.querySelectorAll('li')).find(function(a) {
                return a.textContent.includes("sample.js");
              })).not.toBeDefined();
              expect(Array.from(projectView.element.querySelectorAll('li')).find(function(a) {
                return a.textContent.includes("sample.txt");
              })).not.toBeDefined();
              return expect(Array.from(projectView.element.querySelectorAll('li')).find(function(a) {
                return a.textContent.includes("a");
              })).toBeDefined();
            });
          });
          return it("only shows a given path once, even if it's within multiple root folders", function() {
            var childDir1, childFile1;
            childDir1 = path.join(rootDir1, 'a-child');
            childFile1 = path.join(childDir1, 'child-file.txt');
            fs.mkdirSync(childDir1);
            fs.writeFileSync(childFile1, 'stuff');
            atom.project.addPath(childDir1);
            waitsForPromise(function() {
              return projectView.toggle();
            });
            runs(function() {});
            waitForPathsToDisplay(projectView);
            return runs(function() {
              return expect(Array.from(projectView.element.querySelectorAll('li')).filter(function(a) {
                return a.textContent.includes("child-file.txt");
              }).length).toBe(1);
            });
          });
        });
        describe("when the project only has one path", function() {
          beforeEach(function() {
            return atom.project.setPaths([rootDir1]);
          });
          return it("doesn't show the name of each file's root directory", function() {
            waitsForPromise(function() {
              return projectView.toggle();
            });
            runs(function() {});
            waitForPathsToDisplay(projectView);
            return runs(function() {
              var items;
              items = Array.from(projectView.element.querySelectorAll('li'));
              return eachFilePath([rootDir1], function(filePath) {
                var item;
                item = items.find(function(a) {
                  return a.textContent.includes(filePath);
                });
                expect(item).toExist();
                return expect(item).not.toHaveText(path.basename(rootDir1));
              });
            });
          });
        });
        return describe("when the project has no path", function() {
          beforeEach(function() {
            jasmine.attachToDOM(workspaceElement);
            return atom.project.setPaths([]);
          });
          return it("shows an empty message with no files in the list", function() {
            waitsForPromise(function() {
              return projectView.toggle();
            });
            return runs(function() {
              expect(projectView.selectListView.refs.emptyMessage).toBeVisible();
              expect(projectView.selectListView.refs.emptyMessage.textContent).toBe('Project is empty');
              return expect(projectView.element.querySelectorAll('li').length).toBe(0);
            });
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
          waitsForPromise(function() {
            return projectView.toggle();
          });
          runs(function() {});
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
          expectedPath = atom.project.getDirectories()[0].resolve('dir/a');
          waitsForPromise(function() {
            return projectView.toggle();
          });
          runs(function() {
            return projectView.confirm({
              filePath: expectedPath
            });
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
            waitsForPromise(function() {
              return projectView.toggle();
            });
            runs(function() {});
            projectView.confirm({
              filePath: atom.project.getDirectories()[0].resolve('dir')
            });
            expect(projectView.element.parentElement).toBeDefined();
            expect(atom.workspace.getActiveTextEditor().getPath()).toBe(editorPath);
            waitsFor(function() {
              return projectView.selectListView.refs.errorMessage;
            });
            runs(function() {
              return advanceClock(2000);
            });
            return waitsFor(function() {
              return !projectView.selectListView.refs.errorMessage;
            });
          });
        });
      });
    });
    describe("buffer-finder behavior", function() {
      describe("toggling", function() {
        describe("when there are pane items with paths", function() {
          beforeEach(function() {
            jasmine.useRealClock();
            jasmine.attachToDOM(workspaceElement);
            return waitsForPromise(function() {
              return atom.workspace.open('sample.txt');
            });
          });
          it("shows the FuzzyFinder if it isn't showing, or hides it and returns focus to the active editor", function() {
            var editor1, editor2, editor3, ref2;
            expect(atom.workspace.panelForItem(bufferView)).toBeNull();
            atom.workspace.getActivePane().splitRight({
              copyActiveItem: true
            });
            ref2 = atom.workspace.getTextEditors(), editor1 = ref2[0], editor2 = ref2[1], editor3 = ref2[2];
            expect(atom.workspace.getActivePaneItem()).toBe(editor3);
            expect(atom.views.getView(editor3)).toHaveFocus();
            waitsForPromise(function() {
              return bufferView.toggle();
            });
            runs(function() {
              expect(atom.workspace.panelForItem(bufferView).isVisible()).toBe(true);
              expect(workspaceElement.querySelector('.fuzzy-finder')).toHaveFocus();
              return bufferView.selectListView.refs.queryEditor.insertText('this should not show up next time we toggle');
            });
            waitsForPromise(function() {
              return bufferView.toggle();
            });
            runs(function() {
              expect(atom.views.getView(editor3)).toHaveFocus();
              return expect(atom.workspace.panelForItem(bufferView).isVisible()).toBe(false);
            });
            waitsForPromise(function() {
              return bufferView.toggle();
            });
            return runs(function() {
              return expect(bufferView.selectListView.refs.queryEditor.getText()).toBe('');
            });
          });
          it("lists the paths of the current items, sorted by most recently opened but with the current item last", function() {
            waitsForPromise(function() {
              return atom.workspace.open('sample-with-tabs.coffee');
            });
            waitsForPromise(function() {
              return bufferView.toggle();
            });
            runs(function() {
              expect(atom.workspace.panelForItem(bufferView).isVisible()).toBe(true);
              return expect(Array.from(bufferView.element.querySelectorAll('li > div.file')).map(function(e) {
                return e.textContent;
              })).toEqual(['sample.txt', 'sample.js', 'sample-with-tabs.coffee']);
            });
            waitsForPromise(function() {
              return bufferView.toggle();
            });
            runs(function() {
              return expect(atom.workspace.panelForItem(bufferView).isVisible()).toBe(false);
            });
            waitsForPromise(function() {
              return atom.workspace.open('sample.txt');
            });
            waitsForPromise(function() {
              return bufferView.toggle();
            });
            return runs(function() {
              expect(atom.workspace.panelForItem(bufferView).isVisible()).toBe(true);
              expect(Array.from(bufferView.element.querySelectorAll('li > div.file')).map(function(e) {
                return e.textContent;
              })).toEqual(['sample-with-tabs.coffee', 'sample.js', 'sample.txt']);
              return expect(bufferView.element.querySelector('li')).toHaveClass('selected');
            });
          });
          return it("serializes the list of paths and their last opened time", function() {
            waitsForPromise(function() {
              return atom.workspace.open('sample-with-tabs.coffee');
            });
            waitsForPromise(function() {
              return bufferView.toggle();
            });
            waitsForPromise(function() {
              return atom.workspace.open('sample.js');
            });
            waitsForPromise(function() {
              return bufferView.toggle();
            });
            waitsForPromise(function() {
              return atom.workspace.open();
            });
            return runs(function() {
              var bufferPath, i, len, paths, ref2, results, states, time;
              atom.packages.deactivatePackage('fuzzy-finder');
              states = _.map(atom.packages.getPackageState('fuzzy-finder'), function(path, time) {
                return [path, time];
              });
              expect(states.length).toBe(3);
              states = _.sortBy(states, function(path, time) {
                return -time;
              });
              paths = ['sample-with-tabs.coffee', 'sample.txt', 'sample.js'];
              results = [];
              for (i = 0, len = states.length; i < len; i++) {
                ref2 = states[i], time = ref2[0], bufferPath = ref2[1];
                expect(_.last(bufferPath.split(path.sep))).toBe(paths.shift());
                results.push(expect(time).toBeGreaterThan(50000));
              }
              return results;
            });
          });
        });
        describe("when there are only panes with anonymous items", function() {
          return it("does not open", function() {
            atom.workspace.getActivePane().destroy();
            waitsForPromise(function() {
              return atom.workspace.open();
            });
            waitsForPromise(function() {
              return bufferView.toggle();
            });
            return runs(function() {
              return expect(atom.workspace.panelForItem(bufferView)).toBeNull();
            });
          });
        });
        describe("when there are no pane items", function() {
          return it("does not open", function() {
            atom.workspace.getActivePane().destroy();
            waitsForPromise(function() {
              return bufferView.toggle();
            });
            return runs(function() {
              return expect(atom.workspace.panelForItem(bufferView)).toBeNull();
            });
          });
        });
        return describe("when multiple sessions are opened on the same path", function() {
          return it("does not display duplicates for that path in the list", function() {
            waitsForPromise(function() {
              return atom.workspace.open('sample.js');
            });
            runs(function() {
              return atom.workspace.getActivePane().splitRight({
                copyActiveItem: true
              });
            });
            waitsForPromise(function() {
              return bufferView.toggle();
            });
            return runs(function() {
              return expect(Array.from(bufferView.element.querySelectorAll('li > div.file')).map(function(e) {
                return e.textContent;
              })).toEqual(['sample.js']);
            });
          });
        });
      });
      return describe("when a path selection is confirmed", function() {
        var editor1, editor2, editor3, ref2;
        ref2 = [], editor1 = ref2[0], editor2 = ref2[1], editor3 = ref2[2];
        beforeEach(function() {
          jasmine.attachToDOM(workspaceElement);
          atom.workspace.getActivePane().splitRight({
            copyActiveItem: true
          });
          waitsForPromise(function() {
            return atom.workspace.open('sample.txt');
          });
          runs(function() {
            var ref3;
            ref3 = atom.workspace.getTextEditors(), editor1 = ref3[0], editor2 = ref3[1], editor3 = ref3[2];
            expect(atom.workspace.getActiveTextEditor()).toBe(editor3);
            return atom.commands.dispatch(atom.views.getView(editor2), 'pane:show-previous-item');
          });
          return waitsForPromise(function() {
            return bufferView.toggle();
          });
        });
        describe("when the active pane has an item for the selected path", function() {
          return it("switches to the item for the selected path", function() {
            var expectedPath;
            expectedPath = atom.project.getDirectories()[0].resolve('sample.txt');
            bufferView.confirm({
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
            expectedPath = atom.project.getDirectories()[0].resolve('sample.txt');
            waitsForPromise(function() {
              return bufferView.toggle();
            });
            runs(function() {
              return atom.views.getView(editor1).focus();
            });
            waitsForPromise(function() {
              return bufferView.toggle();
            });
            runs(function() {
              expect(atom.workspace.getActiveTextEditor()).toBe(editor1);
              return bufferView.confirm({
                filePath: expectedPath
              }, atom.config.get('fuzzy-finder.searchAllPanes'));
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
        return describe("when the active pane does not have an item for the selected path and fuzzy-finder.searchAllPanes is true", function() {
          beforeEach(function() {
            return atom.config.set("fuzzy-finder.searchAllPanes", true);
          });
          return it("switches to the pane with the item for the selected path", function() {
            var expectedPath, originalPane;
            expectedPath = atom.project.getDirectories()[0].resolve('sample.txt');
            originalPane = null;
            waitsForPromise(function() {
              return bufferView.toggle();
            });
            runs(function() {
              atom.views.getView(editor1).focus();
              return originalPane = atom.workspace.getActivePane();
            });
            waitsForPromise(function() {
              return bufferView.toggle();
            });
            runs(function() {
              expect(atom.workspace.getActiveTextEditor()).toBe(editor1);
              return bufferView.confirm({
                filePath: expectedPath
              }, {
                searchAllPanes: atom.config.get('fuzzy-finder.searchAllPanes')
              });
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
            waitsForPromise(function() {
              return projectView.toggle();
            });
            return runs(function() {
              expect(projectView.element.parentElement).toBeDefined();
              expect(projectView.selectListView.refs.queryEditor.element).toHaveFocus();
              projectView.cancel();
              expect(atom.workspace.panelForItem(projectView).isVisible()).toBe(false);
              return expect(atom.views.getView(activeEditor)).toHaveFocus();
            });
          });
        });
        return describe("when no editors are open", function() {
          return it("detaches the finder and focuses the previously focused element", function() {
            var inputView;
            jasmine.attachToDOM(workspaceElement);
            atom.workspace.getActivePane().destroy();
            inputView = document.createElement('input');
            workspaceElement.appendChild(inputView);
            inputView.focus();
            waitsForPromise(function() {
              return projectView.toggle();
            });
            return runs(function() {
              expect(projectView.element.parentElement).toBeDefined();
              expect(projectView.selectListView.refs.queryEditor.element).toHaveFocus();
              projectView.cancel();
              expect(atom.workspace.panelForItem(projectView).isVisible()).toBe(false);
              return expect(inputView).toHaveFocus();
            });
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
        waitsForPromise(function() {
          return projectView.toggle();
        });
        runs(function() {
          return waitForPathsToDisplay(projectView);
        });
        runs(function() {
          expect(PathLoader.startTask).toHaveBeenCalled();
          return PathLoader.startTask.reset();
        });
        waitsForPromise(function() {
          return projectView.toggle();
        });
        waitsForPromise(function() {
          return projectView.toggle();
        });
        runs(function() {
          return waitForPathsToDisplay(projectView);
        });
        return runs(function() {
          return expect(PathLoader.startTask).not.toHaveBeenCalled();
        });
      });
      it("doesn't cache buffer paths", function() {
        waitsForPromise(function() {
          return bufferView.toggle();
        });
        runs(function() {
          return waitForPathsToDisplay(bufferView);
        });
        runs(function() {
          expect(atom.workspace.getTextEditors).toHaveBeenCalled();
          return atom.workspace.getTextEditors.reset();
        });
        waitsForPromise(function() {
          return bufferView.toggle();
        });
        waitsForPromise(function() {
          return bufferView.toggle();
        });
        runs(function() {
          return waitForPathsToDisplay(bufferView);
        });
        return runs(function() {
          return expect(atom.workspace.getTextEditors).toHaveBeenCalled();
        });
      });
      it("busts the cache when the window gains focus", function() {
        waitsForPromise(function() {
          return projectView.toggle();
        });
        runs(function() {
          return waitForPathsToDisplay(projectView);
        });
        runs(function() {
          expect(PathLoader.startTask).toHaveBeenCalled();
          PathLoader.startTask.reset();
          window.dispatchEvent(new CustomEvent('focus'));
          return waitsForPromise(function() {
            return projectView.toggle();
          });
        });
        waitsForPromise(function() {
          return projectView.toggle();
        });
        return runs(function() {
          return expect(PathLoader.startTask).toHaveBeenCalled();
        });
      });
      it("busts the cache when the project path changes", function() {
        waitsForPromise(function() {
          return projectView.toggle();
        });
        runs(function() {
          return waitForPathsToDisplay(projectView);
        });
        runs(function() {
          expect(PathLoader.startTask).toHaveBeenCalled();
          PathLoader.startTask.reset();
          return atom.project.setPaths([temp.mkdirSync('atom')]);
        });
        waitsForPromise(function() {
          return projectView.toggle();
        });
        waitsForPromise(function() {
          return projectView.toggle();
        });
        return runs(function() {
          expect(PathLoader.startTask).toHaveBeenCalled();
          return expect(projectView.element.querySelectorAll('li').length).toBe(0);
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
        expect(getCenter().getPanes().length).toBe(1);
        pane = atom.workspace.getActivePane();
        filePath = null;
        waitsForPromise(function() {
          return bufferView.toggle();
        });
        runs(function() {
          filePath = bufferView.selectListView.getSelectedItem().filePath;
          return atom.commands.dispatch(bufferView.element, 'pane:split-left');
        });
        waitsFor(function() {
          return getCenter().getPanes().length === 2;
        });
        waitsFor(function() {
          return atom.workspace.getActiveTextEditor();
        });
        return runs(function() {
          var leftPane, ref2, rightPane;
          ref2 = getCenter().getPanes(), leftPane = ref2[0], rightPane = ref2[1];
          expect(atom.workspace.getActivePane()).toBe(leftPane);
          return expect(atom.workspace.getActiveTextEditor().getPath()).toBe(atom.project.getDirectories()[0].resolve(filePath));
        });
      });
      it("opens the path by splitting the active editor right", function() {
        var filePath, pane;
        expect(getCenter().getPanes().length).toBe(1);
        pane = atom.workspace.getActivePane();
        filePath = null;
        waitsForPromise(function() {
          return bufferView.toggle();
        });
        runs(function() {
          filePath = bufferView.selectListView.getSelectedItem().filePath;
          return atom.commands.dispatch(bufferView.element, 'pane:split-right');
        });
        waitsFor(function() {
          return getCenter().getPanes().length === 2;
        });
        waitsFor(function() {
          return atom.workspace.getActiveTextEditor();
        });
        return runs(function() {
          var leftPane, ref2, rightPane;
          ref2 = getCenter().getPanes(), leftPane = ref2[0], rightPane = ref2[1];
          expect(atom.workspace.getActivePane()).toBe(rightPane);
          return expect(atom.workspace.getActiveTextEditor().getPath()).toBe(atom.project.getDirectories()[0].resolve(filePath));
        });
      });
      it("opens the path by splitting the active editor up", function() {
        var filePath, pane;
        expect(getCenter().getPanes().length).toBe(1);
        pane = atom.workspace.getActivePane();
        filePath = null;
        waitsForPromise(function() {
          return bufferView.toggle();
        });
        runs(function() {
          filePath = bufferView.selectListView.getSelectedItem().filePath;
          return atom.commands.dispatch(bufferView.element, 'pane:split-up');
        });
        waitsFor(function() {
          return getCenter().getPanes().length === 2;
        });
        waitsFor(function() {
          return atom.workspace.getActiveTextEditor();
        });
        return runs(function() {
          var bottomPane, ref2, topPane;
          ref2 = getCenter().getPanes(), topPane = ref2[0], bottomPane = ref2[1];
          expect(atom.workspace.getActivePane()).toBe(topPane);
          return expect(atom.workspace.getActiveTextEditor().getPath()).toBe(atom.project.getDirectories()[0].resolve(filePath));
        });
      });
      return it("opens the path by splitting the active editor down", function() {
        var filePath, pane;
        expect(getCenter().getPanes().length).toBe(1);
        pane = atom.workspace.getActivePane();
        filePath = null;
        waitsForPromise(function() {
          return bufferView.toggle();
        });
        runs(function() {
          filePath = bufferView.selectListView.getSelectedItem().filePath;
          return atom.commands.dispatch(bufferView.element, 'pane:split-down');
        });
        waitsFor(function() {
          return getCenter().getPanes().length === 2;
        });
        waitsFor(function() {
          return atom.workspace.getActiveTextEditor();
        });
        return runs(function() {
          var bottomPane, ref2, topPane;
          ref2 = getCenter().getPanes(), topPane = ref2[0], bottomPane = ref2[1];
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
          var editor1, editor2, ref2;
          ref2 = atom.workspace.getTextEditors(), editor1 = ref2[0], editor2 = ref2[1];
          expect(atom.workspace.getActiveTextEditor()).toBe(editor2);
          return expect(editor1.getCursorBufferPosition()).toEqual([0, 0]);
        });
      });
      return describe("when the filter text has a file path", function() {
        return it("opens the selected path to that line number", function() {
          var editor1, editor2, ref2;
          ref2 = atom.workspace.getTextEditors(), editor1 = ref2[0], editor2 = ref2[1];
          waitsForPromise(function() {
            return bufferView.toggle();
          });
          runs(function() {
            expect(atom.workspace.panelForItem(bufferView).isVisible()).toBe(true);
            return bufferView.selectListView.refs.queryEditor.setText('sample.js:4');
          });
          waitsForPromise(function() {
            return getOrScheduleUpdatePromise();
          });
          runs(function() {
            var filePath;
            filePath = bufferView.selectListView.getSelectedItem().filePath;
            expect(atom.project.getDirectories()[0].resolve(filePath)).toBe(editor1.getPath());
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
    });
    describe("match highlighting", function() {
      beforeEach(function() {
        jasmine.attachToDOM(workspaceElement);
        return waitsForPromise(function() {
          return bufferView.toggle();
        });
      });
      it("highlights an exact match", function() {
        bufferView.selectListView.refs.queryEditor.setText('sample.js');
        waitsForPromise(function() {
          return getOrScheduleUpdatePromise();
        });
        return runs(function() {
          var primaryMatches, resultView, secondaryMatches;
          resultView = bufferView.element.querySelector('li');
          primaryMatches = resultView.querySelectorAll('.primary-line .character-match');
          secondaryMatches = resultView.querySelectorAll('.secondary-line .character-match');
          expect(primaryMatches.length).toBe(1);
          expect(primaryMatches[primaryMatches.length - 1].textContent).toBe('sample.js');
          expect(secondaryMatches.length).toBeGreaterThan(0);
          return expect(secondaryMatches[secondaryMatches.length - 1].textContent).toBe('sample.js');
        });
      });
      it("highlights a partial match", function() {
        bufferView.selectListView.refs.queryEditor.setText('sample');
        waitsForPromise(function() {
          return getOrScheduleUpdatePromise();
        });
        return runs(function() {
          var primaryMatches, resultView, secondaryMatches;
          resultView = bufferView.element.querySelector('li');
          primaryMatches = resultView.querySelectorAll('.primary-line .character-match');
          secondaryMatches = resultView.querySelectorAll('.secondary-line .character-match');
          expect(primaryMatches.length).toBe(1);
          expect(primaryMatches[primaryMatches.length - 1].textContent).toBe('sample');
          expect(secondaryMatches.length).toBeGreaterThan(0);
          return expect(secondaryMatches[secondaryMatches.length - 1].textContent).toBe('sample');
        });
      });
      it("highlights multiple matches in the file name", function() {
        bufferView.selectListView.refs.queryEditor.setText('samplejs');
        waitsForPromise(function() {
          return getOrScheduleUpdatePromise();
        });
        return runs(function() {
          var primaryMatches, resultView, secondaryMatches;
          resultView = bufferView.element.querySelector('li');
          primaryMatches = resultView.querySelectorAll('.primary-line .character-match');
          secondaryMatches = resultView.querySelectorAll('.secondary-line .character-match');
          expect(primaryMatches.length).toBe(2);
          expect(primaryMatches[0].textContent).toBe('sample');
          expect(primaryMatches[primaryMatches.length - 1].textContent).toBe('js');
          expect(secondaryMatches.length).toBeGreaterThan(1);
          return expect(secondaryMatches[secondaryMatches.length - 1].textContent).toBe('js');
        });
      });
      it("highlights matches in the directory and file name", function() {
        spyOn(bufferView, "projectRelativePathsForFilePaths").andCallFake(function(paths) {
          return paths;
        });
        bufferView.selectListView.refs.queryEditor.setText('root-dirsample');
        waitsForPromise(function() {
          return bufferView.setItems([
            {
              filePath: '/test/root-dir1/sample.js',
              projectRelativePath: 'root-dir1/sample.js'
            }
          ]);
        });
        return runs(function() {
          var primaryMatches, resultView, secondaryMatches;
          resultView = bufferView.element.querySelector('li');
          primaryMatches = resultView.querySelectorAll('.primary-line .character-match');
          secondaryMatches = resultView.querySelectorAll('.secondary-line .character-match');
          expect(primaryMatches.length).toBe(1);
          expect(primaryMatches[primaryMatches.length - 1].textContent).toBe('sample');
          expect(secondaryMatches.length).toBe(2);
          expect(secondaryMatches[0].textContent).toBe('root-dir');
          return expect(secondaryMatches[secondaryMatches.length - 1].textContent).toBe('sample');
        });
      });
      describe("when the filter text doesn't have a file path", function() {
        return it("moves the cursor in the active editor to that line number", function() {
          var editor1, editor2, ref2;
          ref2 = atom.workspace.getTextEditors(), editor1 = ref2[0], editor2 = ref2[1];
          waitsForPromise(function() {
            return atom.workspace.open('sample.js');
          });
          runs(function() {
            return expect(atom.workspace.getActiveTextEditor()).toBe(editor1);
          });
          waitsForPromise(function() {
            return bufferView.toggle();
          });
          runs(function() {
            expect(atom.workspace.panelForItem(bufferView).isVisible()).toBe(true);
            return bufferView.selectListView.refs.queryEditor.insertText(':4');
          });
          waitsForPromise(function() {
            return getOrScheduleUpdatePromise();
          });
          runs(function() {
            expect(bufferView.element.querySelectorAll('li').length).toBe(0);
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
          var editor1, editor2, ref2;
          ref2 = atom.workspace.getTextEditors(), editor1 = ref2[0], editor2 = ref2[1];
          waitsForPromise(function() {
            return atom.workspace.open('sample.js');
          });
          runs(function() {
            return expect(atom.workspace.getActiveTextEditor()).toBe(editor1);
          });
          waitsForPromise(function() {
            return bufferView.toggle();
          });
          runs(function() {
            expect(atom.workspace.panelForItem(bufferView).isVisible()).toBe(true);
            return bufferView.selectListView.refs.queryEditor.insertText(':4');
          });
          waitsForPromise(function() {
            return getOrScheduleUpdatePromise();
          });
          runs(function() {
            expect(bufferView.element.querySelectorAll('li').length).toBe(0);
            spyOn(bufferView, 'moveToLine').andCallThrough();
            return atom.commands.dispatch(bufferView.element, 'pane:split-left');
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
        waitsForPromise(function() {
          return projectView.toggle();
        });
        runs(function() {
          expect(atom.workspace.panelForItem(projectView).isVisible()).toBe(true);
          return bufferView.selectListView.refs.queryEditor.insertText('this should not show up next time we open finder');
        });
        waitsForPromise(function() {
          return projectView.toggle();
        });
        runs(function() {
          return expect(atom.workspace.panelForItem(projectView).isVisible()).toBe(false);
        });
        waitsForPromise(function() {
          return projectView.toggle();
        });
        return runs(function() {
          expect(atom.workspace.panelForItem(projectView).isVisible()).toBe(true);
          return expect(projectView.selectListView.getQuery()).toBe('');
        });
      });
      return it("preserves last search when the config is set", function() {
        atom.config.set("fuzzy-finder.preserveLastSearch", true);
        waitsForPromise(function() {
          return projectView.toggle();
        });
        runs(function() {
          expect(atom.workspace.panelForItem(projectView).isVisible()).toBe(true);
          return projectView.selectListView.refs.queryEditor.insertText('this should show up next time we open finder');
        });
        waitsForPromise(function() {
          return projectView.toggle();
        });
        runs(function() {
          return expect(atom.workspace.panelForItem(projectView).isVisible()).toBe(false);
        });
        waitsForPromise(function() {
          return projectView.toggle();
        });
        return runs(function() {
          expect(atom.workspace.panelForItem(projectView).isVisible()).toBe(true);
          expect(projectView.selectListView.getQuery()).toBe('this should show up next time we open finder');
          return expect(projectView.selectListView.refs.queryEditor.getSelectedText()).toBe('this should show up next time we open finder');
        });
      });
    });
    describe("file icons", function() {
      var fileIcons;
      fileIcons = new DefaultFileIcons;
      it("defaults to text", function() {
        waitsForPromise(function() {
          return atom.workspace.open('sample.js');
        });
        waitsForPromise(function() {
          return bufferView.toggle();
        });
        runs(function() {
          expect(atom.workspace.panelForItem(bufferView).isVisible()).toBe(true);
          return bufferView.selectListView.refs.queryEditor.insertText('js');
        });
        waitsForPromise(function() {
          return getOrScheduleUpdatePromise();
        });
        return runs(function() {
          var firstResult;
          firstResult = bufferView.element.querySelector('li .primary-line');
          return expect(fileIcons.iconClassForPath(firstResult.dataset.path)).toBe('icon-file-text');
        });
      });
      return it("shows image icons", function() {
        waitsForPromise(function() {
          return atom.workspace.open('sample.gif');
        });
        waitsForPromise(function() {
          return bufferView.toggle();
        });
        runs(function() {
          expect(atom.workspace.panelForItem(bufferView).isVisible()).toBe(true);
          return bufferView.selectListView.refs.queryEditor.insertText('gif');
        });
        waitsForPromise(function() {
          return getOrScheduleUpdatePromise();
        });
        return runs(function() {
          var firstResult;
          firstResult = bufferView.element.querySelector('li .primary-line');
          return expect(fileIcons.iconClassForPath(firstResult.dataset.path)).toBe('icon-file-media');
        });
      });
    });
    return describe("Git integration", function() {
      var gitDirectory, gitRepository, projectPath, ref2;
      ref2 = [], projectPath = ref2[0], gitRepository = ref2[1], gitDirectory = ref2[2];
      beforeEach(function() {
        projectPath = atom.project.getDirectories()[0].resolve('git/working-dir');
        fs.moveSync(path.join(projectPath, 'git.git'), path.join(projectPath, '.git'));
        atom.project.setPaths([rootDir2, projectPath]);
        gitDirectory = atom.project.getDirectories()[1];
        return gitRepository = atom.project.getRepositories()[1];
      });
      describe("git-status-finder behavior", function() {
        var newPath, originalPath, originalText, ref3;
        ref3 = [], originalText = ref3[0], originalPath = ref3[1], newPath = ref3[2];
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
          waitsForPromise(function() {
            return gitStatusView.toggle();
          });
          return runs(function() {
            expect(atom.workspace.panelForItem(gitStatusView).isVisible()).toBe(true);
            expect(gitStatusView.element.querySelectorAll('.file').length).toBe(2);
            expect(gitStatusView.element.querySelectorAll('.status.status-modified').length).toBe(1);
            return expect(gitStatusView.element.querySelectorAll('.status.status-added').length).toBe(1);
          });
        });
      });
      describe("status decorations", function() {
        var editor, newPath, originalPath, originalText, ref3;
        ref3 = [], originalText = ref3[0], originalPath = ref3[1], editor = ref3[2], newPath = ref3[3];
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
            fs.writeFileSync(newPath, '');
            return fs.writeFileSync(originalPath, 'a change');
          });
        });
        describe("when a modified file is shown in the list", function() {
          return it("displays the modified icon", function() {
            gitRepository.getPathStatus(editor.getPath());
            waitsForPromise(function() {
              return bufferView.toggle();
            });
            return runs(function() {
              expect(bufferView.element.querySelectorAll('.status.status-modified').length).toBe(1);
              return expect(bufferView.element.querySelector('.status.status-modified').closest('li').querySelector('.file').textContent).toBe('a.txt');
            });
          });
        });
        return describe("when a new file is shown in the list", function() {
          return it("displays the new icon", function() {
            waitsForPromise(function() {
              return atom.workspace.open(path.join(projectPath, 'newsample.js'));
            });
            runs(function() {
              return gitRepository.getPathStatus(editor.getPath());
            });
            waitsForPromise(function() {
              return bufferView.toggle();
            });
            return runs(function() {
              expect(bufferView.element.querySelectorAll('.status.status-added').length).toBe(1);
              return expect(bufferView.element.querySelector('.status.status-added').closest('li').querySelector('.file').textContent).toBe('newsample.js');
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
            waitsForPromise(function() {
              return projectView.toggle();
            });
            runs(function() {
              return waitForPathsToDisplay(projectView);
            });
            return runs(function() {
              return expect(Array.from(projectView.element.querySelectorAll('li')).find(function(a) {
                return a.textContent.includes("ignored.txt");
              })).not.toBeDefined();
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
            waitsForPromise(function() {
              return projectView.toggle();
            });
            runs(function() {
              return waitForPathsToDisplay(projectView);
            });
            return runs(function() {
              return expect(Array.from(projectView.element.querySelectorAll('li')).find(function(a) {
                return a.textContent.includes("b.txt");
              })).toBeDefined();
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
            waitsForPromise(function() {
              return projectView.toggle();
            });
            runs(function() {
              return waitForPathsToDisplay(projectView);
            });
            return runs(function() {
              return expect(Array.from(projectView.element.querySelectorAll('li')).find(function(a) {
                return a.textContent.includes("file.txt");
              })).toBeDefined();
            });
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2Z1enp5LWZpbmRlci9zcGVjL2Z1enp5LWZpbmRlci1zcGVjLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxLQUFSOztFQUNOLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFDUCxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSOztFQUNKLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFDUCxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVI7O0VBQ0wsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNQLE1BQUEsR0FBUyxPQUFBLENBQVEsUUFBUjs7RUFFVCxVQUFBLEdBQWEsT0FBQSxDQUFRLG9CQUFSOztFQUNiLGdCQUFBLEdBQW1CLE9BQUEsQ0FBUSwyQkFBUjs7RUFFbkIsSUFBQSxHQUFPLFNBQUMsS0FBRDtJQUNMLElBQUcsRUFBRSxDQUFDLFFBQUgsQ0FBWSxLQUFaLENBQWtCLENBQUMsV0FBbkIsQ0FBQSxDQUFIO01BQ0UsQ0FBQyxDQUFDLElBQUYsQ0FBTyxFQUFFLENBQUMsV0FBSCxDQUFlLEtBQWYsQ0FBUCxFQUE4QixTQUFDLEtBQUQ7ZUFDNUIsSUFBQSxDQUFLLElBQUksQ0FBQyxJQUFMLENBQVUsS0FBVixFQUFpQixLQUFqQixDQUFMO01BRDRCLENBQTlCO2FBR0EsRUFBRSxDQUFDLFNBQUgsQ0FBYSxLQUFiLEVBSkY7S0FBQSxNQUFBO2FBTUUsRUFBRSxDQUFDLFVBQUgsQ0FBYyxLQUFkLEVBTkY7O0VBREs7O0VBVVAsU0FBQSxHQUFZLFNBQUE7QUFBRyxRQUFBO3VIQUE4QixJQUFJLENBQUM7RUFBdEM7O0VBRVosMEJBQUEsR0FBNkIsU0FBQTtXQUN2QixJQUFBLE9BQUEsQ0FBUSxTQUFDLE9BQUQ7YUFBYSxJQUFJLENBQUMsWUFBTCxDQUFBLENBQW1CLENB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LENBQXpGO2VBZ0JBLFFBQUEsQ0FBUyxrRUFBVCxFQUE2RSxTQUFBO1VBQzNFLFVBQUEsQ0FBVyxTQUFBO0FBQ1QsZ0JBQUE7WUFBQSxVQUFBLEdBQWEsSUFBSSxDQUFDLElBQUwsQ0FBVSxXQUFWLEVBQXVCLFlBQXZCO21CQUNiLEVBQUUsQ0FBQyxhQUFILENBQWlCLFVBQWpCLEVBQTZCLElBQUksQ0FBQyxRQUFMLENBQWMsV0FBZCxDQUE3QjtVQUZTLENBQVg7aUJBSUEsRUFBQSxDQUFHLCtFQUFILEVBQW9GLFNBQUE7WUFDbEYsZUFBQSxDQUFnQixTQUFBO3FCQUNkLFdBQVcsQ0FBQyxNQUFaLENBQUE7WUFEYyxDQUFoQjtZQUdBLElBQUEsQ0FBSyxTQUFBO3FCQUNILHFCQUFBLENBQXNCLFdBQXRCO1lBREcsQ0FBTDttQkFHQSxJQUFBLENBQUssU0FBQTtxQkFDSCxNQUFBLENBQU8sS0FBSyxDQUFDLElBQU4sQ0FBVyxXQUFXLENBQUMsT0FBTyxDQUFDLGdCQUFwQixDQUFxQyxJQUFyQyxDQUFYLENBQXNELENBQUMsSUFBdkQsQ0FBNEQsU0FBQyxDQUFEO3VCQUFPLENBQUMsQ0FBQyxXQUFXLENBQUMsUUFBZCxDQUF1QixVQUF2QjtjQUFQLENBQTVELENBQVAsQ0FBOEcsQ0FBQyxXQUEvRyxDQUFBO1lBREcsQ0FBTDtVQVBrRixDQUFwRjtRQUwyRSxDQUE3RTtNQXRDMEQsQ0FBNUQ7SUFyRjBCLENBQTVCO0VBaG5Dc0IsQ0FBeEI7QUExQkEiLCJzb3VyY2VzQ29udGVudCI6WyJuZXQgPSByZXF1aXJlIFwibmV0XCJcbnBhdGggPSByZXF1aXJlICdwYXRoJ1xuXyA9IHJlcXVpcmUgJ3VuZGVyc2NvcmUtcGx1cydcbmV0Y2ggPSByZXF1aXJlICdldGNoJ1xuZnMgPSByZXF1aXJlICdmcy1wbHVzJ1xudGVtcCA9IHJlcXVpcmUgJ3RlbXAnXG53cmVuY2ggPSByZXF1aXJlICd3cmVuY2gnXG5cblBhdGhMb2FkZXIgPSByZXF1aXJlICcuLi9saWIvcGF0aC1sb2FkZXInXG5EZWZhdWx0RmlsZUljb25zID0gcmVxdWlyZSAnLi4vbGliL2RlZmF1bHQtZmlsZS1pY29ucydcblxucm1yZiA9IChfcGF0aCkgLT5cbiAgaWYgZnMuc3RhdFN5bmMoX3BhdGgpLmlzRGlyZWN0b3J5KClcbiAgICBfLmVhY2goZnMucmVhZGRpclN5bmMoX3BhdGgpLCAoY2hpbGQpIC0+XG4gICAgICBybXJmKHBhdGguam9pbihfcGF0aCwgY2hpbGQpKVxuICAgICAgKVxuICAgIGZzLnJtZGlyU3luYyhfcGF0aClcbiAgZWxzZVxuICAgIGZzLnVubGlua1N5bmMoX3BhdGgpXG5cbiMgVE9ETzogUmVtb3ZlIHRoaXMgYWZ0ZXIgYXRvbS9hdG9tIzEzOTc3IGxhbmRzIGluIGZhdm9yIG9mIHVuZ3VhcmRlZCBgZ2V0Q2VudGVyKClgIGNhbGxzXG5nZXRDZW50ZXIgPSAtPiBhdG9tLndvcmtzcGFjZS5nZXRDZW50ZXI/KCkgPyBhdG9tLndvcmtzcGFjZVxuXG5nZXRPclNjaGVkdWxlVXBkYXRlUHJvbWlzZSA9IC0+XG4gIG5ldyBQcm9taXNlKChyZXNvbHZlKSAtPiBldGNoLmdldFNjaGVkdWxlcigpLnVwZGF0ZURvY3VtZW50KHJlc29sdmUpKVxuXG5kZXNjcmliZSAnRnV6enlGaW5kZXInLCAtPlxuICBbcm9vdERpcjEsIHJvb3REaXIyXSA9IFtdXG4gIFtmdXp6eUZpbmRlciwgcHJvamVjdFZpZXcsIGJ1ZmZlclZpZXcsIGdpdFN0YXR1c1ZpZXcsIHdvcmtzcGFjZUVsZW1lbnQsIGZpeHR1cmVzUGF0aF0gPSBbXVxuXG4gIGJlZm9yZUVhY2ggLT5cbiAgICByb290RGlyMSA9IGZzLnJlYWxwYXRoU3luYyh0ZW1wLm1rZGlyU3luYygncm9vdC1kaXIxJykpXG4gICAgcm9vdERpcjIgPSBmcy5yZWFscGF0aFN5bmModGVtcC5ta2RpclN5bmMoJ3Jvb3QtZGlyMicpKVxuXG4gICAgZml4dHVyZXNQYXRoID0gYXRvbS5wcm9qZWN0LmdldFBhdGhzKClbMF1cblxuICAgIHdyZW5jaC5jb3B5RGlyU3luY1JlY3Vyc2l2ZShcbiAgICAgIHBhdGguam9pbihmaXh0dXJlc1BhdGgsIFwicm9vdC1kaXIxXCIpLFxuICAgICAgcm9vdERpcjEsXG4gICAgICBmb3JjZURlbGV0ZTogdHJ1ZVxuICAgIClcblxuICAgIHdyZW5jaC5jb3B5RGlyU3luY1JlY3Vyc2l2ZShcbiAgICAgIHBhdGguam9pbihmaXh0dXJlc1BhdGgsIFwicm9vdC1kaXIyXCIpLFxuICAgICAgcm9vdERpcjIsXG4gICAgICBmb3JjZURlbGV0ZTogdHJ1ZVxuICAgIClcblxuICAgIGF0b20ucHJvamVjdC5zZXRQYXRocyhbcm9vdERpcjEsIHJvb3REaXIyXSlcblxuICAgIHdvcmtzcGFjZUVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpXG5cbiAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4ocGF0aC5qb2luKHJvb3REaXIxLCAnc2FtcGxlLmpzJykpXG5cbiAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgIGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdmdXp6eS1maW5kZXInKS50aGVuIChwYWNrKSAtPlxuICAgICAgICBmdXp6eUZpbmRlciA9IHBhY2subWFpbk1vZHVsZVxuICAgICAgICBwcm9qZWN0VmlldyA9IGZ1enp5RmluZGVyLmNyZWF0ZVByb2plY3RWaWV3KClcbiAgICAgICAgYnVmZmVyVmlldyA9IGZ1enp5RmluZGVyLmNyZWF0ZUJ1ZmZlclZpZXcoKVxuICAgICAgICBnaXRTdGF0dXNWaWV3ID0gZnV6enlGaW5kZXIuY3JlYXRlR2l0U3RhdHVzVmlldygpXG5cbiAgZGlzcGF0Y2hDb21tYW5kID0gKGNvbW1hbmQpIC0+XG4gICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh3b3Jrc3BhY2VFbGVtZW50LCBcImZ1enp5LWZpbmRlcjoje2NvbW1hbmR9XCIpXG5cbiAgd2FpdEZvclBhdGhzVG9EaXNwbGF5ID0gKGZ1enp5RmluZGVyVmlldykgLT5cbiAgICB3YWl0c0ZvciBcInBhdGhzIHRvIGRpc3BsYXlcIiwgNTAwMCwgLT5cbiAgICAgIGZ1enp5RmluZGVyVmlldy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJsaVwiKS5sZW5ndGggPiAwXG5cbiAgZWFjaEZpbGVQYXRoID0gKGRpclBhdGhzLCBmbikgLT5cbiAgICBmb3IgZGlyUGF0aCBpbiBkaXJQYXRoc1xuICAgICAgZmluZGluZ3MgPSBmb3IgZmlsZVBhdGggaW4gd3JlbmNoLnJlYWRkaXJTeW5jUmVjdXJzaXZlKGRpclBhdGgpXG4gICAgICAgIGZ1bGxQYXRoID0gcGF0aC5qb2luKGRpclBhdGgsIGZpbGVQYXRoKVxuICAgICAgICBpZiBmcy5pc0ZpbGVTeW5jKGZ1bGxQYXRoKVxuICAgICAgICAgIGZuKGZpbGVQYXRoKVxuICAgICAgICAgIHRydWVcbiAgICAgIGV4cGVjdChmaW5kaW5ncykudG9Db250YWluKHRydWUpXG5cbiAgZGVzY3JpYmUgXCJmaWxlLWZpbmRlciBiZWhhdmlvclwiLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIHdhaXRzRm9yIC0+IHByb2plY3RWaWV3LnNlbGVjdExpc3RWaWV3LnVwZGF0ZSh7bWF4UmVzdWx0czogbnVsbH0pXG5cbiAgICBkZXNjcmliZSBcInRvZ2dsaW5nXCIsIC0+XG4gICAgICBkZXNjcmliZSBcIndoZW4gdGhlIHByb2plY3QgaGFzIG11bHRpcGxlIHBhdGhzXCIsIC0+XG4gICAgICAgIGl0IFwic2hvd3Mgb3IgaGlkZXMgdGhlIGZ1enp5LWZpbmRlciBhbmQgcmV0dXJucyBmb2N1cyB0byB0aGUgYWN0aXZlIGVkaXRvciBpZiBpdCBpcyBhbHJlYWR5IHNob3dpbmdcIiwgLT5cbiAgICAgICAgICBqYXNtaW5lLmF0dGFjaFRvRE9NKHdvcmtzcGFjZUVsZW1lbnQpXG5cbiAgICAgICAgICBleHBlY3QoYXRvbS53b3Jrc3BhY2UucGFuZWxGb3JJdGVtKHByb2plY3RWaWV3KSkudG9CZU51bGwoKVxuICAgICAgICAgIGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKS5zcGxpdFJpZ2h0KGNvcHlBY3RpdmVJdGVtOiB0cnVlKVxuICAgICAgICAgIFtlZGl0b3IxLCBlZGl0b3IyXSA9IGF0b20ud29ya3NwYWNlLmdldFRleHRFZGl0b3JzKClcblxuICAgICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICAgICAgcHJvamVjdFZpZXcudG9nZ2xlKClcblxuICAgICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICAgIGV4cGVjdChhdG9tLndvcmtzcGFjZS5wYW5lbEZvckl0ZW0ocHJvamVjdFZpZXcpLmlzVmlzaWJsZSgpKS50b0JlIHRydWVcbiAgICAgICAgICAgIGV4cGVjdChwcm9qZWN0Vmlldy5zZWxlY3RMaXN0Vmlldy5yZWZzLnF1ZXJ5RWRpdG9yLmVsZW1lbnQpLnRvSGF2ZUZvY3VzKClcbiAgICAgICAgICAgIHByb2plY3RWaWV3LnNlbGVjdExpc3RWaWV3LnJlZnMucXVlcnlFZGl0b3IuaW5zZXJ0VGV4dCgndGhpcyBzaG91bGQgbm90IHNob3cgdXAgbmV4dCB0aW1lIHdlIHRvZ2dsZScpXG5cbiAgICAgICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgICAgIHByb2plY3RWaWV3LnRvZ2dsZSgpXG5cbiAgICAgICAgICBydW5zIC0+XG4gICAgICAgICAgICBleHBlY3QoYXRvbS52aWV3cy5nZXRWaWV3KGVkaXRvcjEpKS5ub3QudG9IYXZlRm9jdXMoKVxuICAgICAgICAgICAgZXhwZWN0KGF0b20udmlld3MuZ2V0VmlldyhlZGl0b3IyKSkudG9IYXZlRm9jdXMoKVxuICAgICAgICAgICAgZXhwZWN0KGF0b20ud29ya3NwYWNlLnBhbmVsRm9ySXRlbShwcm9qZWN0VmlldykuaXNWaXNpYmxlKCkpLnRvQmUgZmFsc2VcblxuICAgICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICAgICAgcHJvamVjdFZpZXcudG9nZ2xlKClcblxuICAgICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICAgIGV4cGVjdChwcm9qZWN0Vmlldy5zZWxlY3RMaXN0Vmlldy5yZWZzLnF1ZXJ5RWRpdG9yLmdldFRleHQoKSkudG9CZSAnJ1xuXG4gICAgICAgIGl0IFwic2hvd3MgYWxsIGZpbGVzIGZvciB0aGUgY3VycmVudCBwcm9qZWN0IGFuZCBzZWxlY3RzIHRoZSBmaXJzdFwiLCAtPlxuICAgICAgICAgIGphc21pbmUuYXR0YWNoVG9ET00od29ya3NwYWNlRWxlbWVudClcblxuICAgICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICAgICAgcHJvamVjdFZpZXcudG9nZ2xlKClcblxuICAgICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICAgIGV4cGVjdChwcm9qZWN0Vmlldy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubG9hZGluZ1wiKS50ZXh0Q29udGVudC5sZW5ndGgpLnRvQmVHcmVhdGVyVGhhbiAwXG4gICAgICAgICAgICB3YWl0Rm9yUGF0aHNUb0Rpc3BsYXkocHJvamVjdFZpZXcpXG5cbiAgICAgICAgICBydW5zIC0+XG4gICAgICAgICAgICBlYWNoRmlsZVBhdGggW3Jvb3REaXIxLCByb290RGlyMl0sIChmaWxlUGF0aCkgLT5cbiAgICAgICAgICAgICAgaXRlbSA9IEFycmF5LmZyb20ocHJvamVjdFZpZXcuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdsaScpKS5maW5kKChhKSAtPiBhLnRleHRDb250ZW50LmluY2x1ZGVzKGZpbGVQYXRoKSlcbiAgICAgICAgICAgICAgZXhwZWN0KGl0ZW0pLnRvRXhpc3QoKVxuICAgICAgICAgICAgICBuYW1lRGl2ID0gaXRlbS5xdWVyeVNlbGVjdG9yKFwiZGl2OmZpcnN0LWNoaWxkXCIpXG4gICAgICAgICAgICAgIGV4cGVjdChuYW1lRGl2LmRhdGFzZXQubmFtZSkudG9CZShwYXRoLmJhc2VuYW1lKGZpbGVQYXRoKSlcbiAgICAgICAgICAgICAgZXhwZWN0KG5hbWVEaXYudGV4dENvbnRlbnQpLnRvQmUocGF0aC5iYXNlbmFtZShmaWxlUGF0aCkpXG5cbiAgICAgICAgICAgIGV4cGVjdChwcm9qZWN0Vmlldy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubG9hZGluZ1wiKSkubm90LnRvQmVWaXNpYmxlKClcblxuICAgICAgICBpdCBcInNob3dzIGVhY2ggZmlsZSdzIHBhdGgsIGluY2x1ZGluZyB3aGljaCByb290IGRpcmVjdG9yeSBpdCdzIGluXCIsIC0+XG4gICAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgICAgICBwcm9qZWN0Vmlldy50b2dnbGUoKVxuXG4gICAgICAgICAgd2FpdEZvclBhdGhzVG9EaXNwbGF5KHByb2plY3RWaWV3KVxuXG4gICAgICAgICAgcnVucyAtPlxuICAgICAgICAgICAgZWFjaEZpbGVQYXRoIFtyb290RGlyMV0sIChmaWxlUGF0aCkgLT5cbiAgICAgICAgICAgICAgaXRlbSA9IEFycmF5LmZyb20ocHJvamVjdFZpZXcuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdsaScpKS5maW5kKChhKSAtPiBhLnRleHRDb250ZW50LmluY2x1ZGVzKGZpbGVQYXRoKSlcbiAgICAgICAgICAgICAgZXhwZWN0KGl0ZW0pLnRvRXhpc3QoKVxuICAgICAgICAgICAgICBleHBlY3QoaXRlbS5xdWVyeVNlbGVjdG9yQWxsKFwiZGl2XCIpWzFdLnRleHRDb250ZW50KS50b0JlKHBhdGguam9pbihwYXRoLmJhc2VuYW1lKHJvb3REaXIxKSwgZmlsZVBhdGgpKVxuXG4gICAgICAgICAgICBlYWNoRmlsZVBhdGggW3Jvb3REaXIyXSwgKGZpbGVQYXRoKSAtPlxuICAgICAgICAgICAgICBpdGVtID0gQXJyYXkuZnJvbShwcm9qZWN0Vmlldy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpJykpLmZpbmQoKGEpIC0+IGEudGV4dENvbnRlbnQuaW5jbHVkZXMoZmlsZVBhdGgpKVxuICAgICAgICAgICAgICBleHBlY3QoaXRlbSkudG9FeGlzdCgpXG4gICAgICAgICAgICAgIGV4cGVjdChpdGVtLnF1ZXJ5U2VsZWN0b3JBbGwoXCJkaXZcIilbMV0udGV4dENvbnRlbnQpLnRvQmUocGF0aC5qb2luKHBhdGguYmFzZW5hbWUocm9vdERpcjIpLCBmaWxlUGF0aCkpXG5cbiAgICAgICAgaXQgXCJvbmx5IGNyZWF0ZXMgYSBzaW5nbGUgcGF0aCBsb2FkZXIgdGFza1wiLCAtPlxuICAgICAgICAgIHNweU9uKFBhdGhMb2FkZXIsICdzdGFydFRhc2snKS5hbmRDYWxsVGhyb3VnaCgpXG5cbiAgICAgICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgICAgIHByb2plY3RWaWV3LnRvZ2dsZSgpICMgU2hvd1xuXG4gICAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgICAgICBwcm9qZWN0Vmlldy50b2dnbGUoKSAjIEhpZGVcblxuICAgICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICAgICAgcHJvamVjdFZpZXcudG9nZ2xlKCkgIyBTaG93IGFnYWluXG5cbiAgICAgICAgICBydW5zIC0+XG4gICAgICAgICAgICBleHBlY3QoUGF0aExvYWRlci5zdGFydFRhc2suY2FsbENvdW50KS50b0JlIDFcblxuICAgICAgICBpdCBcInB1dHMgdGhlIGxhc3Qgb3BlbmVkIHBhdGggZmlyc3RcIiwgLT5cbiAgICAgICAgICB3YWl0c0ZvclByb21pc2UgLT4gYXRvbS53b3Jrc3BhY2Uub3BlbiAnc2FtcGxlLnR4dCdcbiAgICAgICAgICB3YWl0c0ZvclByb21pc2UgLT4gYXRvbS53b3Jrc3BhY2Uub3BlbiAnc2FtcGxlLmpzJ1xuXG4gICAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgICAgICBwcm9qZWN0Vmlldy50b2dnbGUoKVxuXG4gICAgICAgICAgcnVucyAtPlxuICAgICAgICAgICAgd2FpdEZvclBhdGhzVG9EaXNwbGF5KHByb2plY3RWaWV3KVxuXG4gICAgICAgICAgcnVucyAtPlxuICAgICAgICAgICAgZXhwZWN0KHByb2plY3RWaWV3LmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnbGknKVswXS50ZXh0Q29udGVudCkudG9Db250YWluKCdzYW1wbGUudHh0JylcbiAgICAgICAgICAgIGV4cGVjdChwcm9qZWN0Vmlldy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpJylbMV0udGV4dENvbnRlbnQpLnRvQ29udGFpbignc2FtcGxlLmh0bWwnKVxuXG4gICAgICAgIGl0IFwiZGlzcGxheXMgcGF0aHMgY29ycmVjdGx5IGlmIHRoZSBsYXN0LW9wZW5lZCBwYXRoIGlzIG5vdCBwYXJ0IG9mIHRoZSBwcm9qZWN0IChyZWdyZXNzaW9uKVwiLCAtPlxuICAgICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBhdG9tLndvcmtzcGFjZS5vcGVuICdmb28udHh0J1xuICAgICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBhdG9tLndvcmtzcGFjZS5vcGVuICdzYW1wbGUuanMnXG5cbiAgICAgICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgICAgIHByb2plY3RWaWV3LnRvZ2dsZSgpXG5cbiAgICAgICAgICBydW5zIC0+XG4gICAgICAgICAgICB3YWl0Rm9yUGF0aHNUb0Rpc3BsYXkocHJvamVjdFZpZXcpXG5cbiAgICAgICAgZGVzY3JpYmUgXCJzeW1saW5rcyBvbiAjZGFyd2luIG9yICNsaW51eFwiLCAtPlxuICAgICAgICAgIFtqdW5rRGlyUGF0aCwganVua0ZpbGVQYXRoXSA9IFtdXG5cbiAgICAgICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgICAgICBqdW5rRGlyUGF0aCA9IGZzLnJlYWxwYXRoU3luYyh0ZW1wLm1rZGlyU3luYygnanVuay0xJykpXG4gICAgICAgICAgICBqdW5rRmlsZVBhdGggPSBwYXRoLmpvaW4oanVua0RpclBhdGgsICdmaWxlLnR4dCcpXG4gICAgICAgICAgICBmcy53cml0ZUZpbGVTeW5jKGp1bmtGaWxlUGF0aCwgJ3R4dCcpXG4gICAgICAgICAgICBmcy53cml0ZUZpbGVTeW5jKHBhdGguam9pbihqdW5rRGlyUGF0aCwgJ2EnKSwgJ3R4dCcpXG5cbiAgICAgICAgICAgIGJyb2tlbkZpbGVQYXRoID0gcGF0aC5qb2luKGp1bmtEaXJQYXRoLCAnZGVsZXRlLnR4dCcpXG4gICAgICAgICAgICBmcy53cml0ZUZpbGVTeW5jKGJyb2tlbkZpbGVQYXRoLCAnZGVsZXRlLW1lJylcblxuICAgICAgICAgICAgZnMuc3ltbGlua1N5bmMoanVua0ZpbGVQYXRoLCBhdG9tLnByb2plY3QuZ2V0RGlyZWN0b3JpZXMoKVswXS5yZXNvbHZlKCdzeW1saW5rLXRvLWZpbGUnKSlcbiAgICAgICAgICAgIGZzLnN5bWxpbmtTeW5jKGp1bmtEaXJQYXRoLCBhdG9tLnByb2plY3QuZ2V0RGlyZWN0b3JpZXMoKVswXS5yZXNvbHZlKCdzeW1saW5rLXRvLWRpcicpKVxuICAgICAgICAgICAgZnMuc3ltbGlua1N5bmMoYnJva2VuRmlsZVBhdGgsIGF0b20ucHJvamVjdC5nZXREaXJlY3RvcmllcygpWzBdLnJlc29sdmUoJ2Jyb2tlbi1zeW1saW5rJykpXG5cbiAgICAgICAgICAgIGZzLnN5bWxpbmtTeW5jKGF0b20ucHJvamVjdC5nZXREaXJlY3RvcmllcygpWzBdLnJlc29sdmUoJ3NhbXBsZS50eHQnKSwgYXRvbS5wcm9qZWN0LmdldERpcmVjdG9yaWVzKClbMF0ucmVzb2x2ZSgnc3ltbGluay10by1pbnRlcm5hbC1maWxlJykpXG4gICAgICAgICAgICBmcy5zeW1saW5rU3luYyhhdG9tLnByb2plY3QuZ2V0RGlyZWN0b3JpZXMoKVswXS5yZXNvbHZlKCdkaXInKSwgYXRvbS5wcm9qZWN0LmdldERpcmVjdG9yaWVzKClbMF0ucmVzb2x2ZSgnc3ltbGluay10by1pbnRlcm5hbC1kaXInKSlcblxuICAgICAgICAgICAgZnMudW5saW5rU3luYyhicm9rZW5GaWxlUGF0aClcblxuICAgICAgICAgIGl0IFwiaW5kZXhlcyBwcm9qZWN0IHBhdGhzIHRoYXQgYXJlIHN5bWxpbmtzXCIsIC0+XG4gICAgICAgICAgICBzeW1saW5rUHJvamVjdFBhdGggPSBwYXRoLmpvaW4oanVua0RpclBhdGgsICdyb290LWRpci1zeW1saW5rJylcbiAgICAgICAgICAgIGZzLnN5bWxpbmtTeW5jKGF0b20ucHJvamVjdC5nZXRQYXRocygpWzBdLCBzeW1saW5rUHJvamVjdFBhdGgpXG5cbiAgICAgICAgICAgIGF0b20ucHJvamVjdC5zZXRQYXRocyhbc3ltbGlua1Byb2plY3RQYXRoXSlcblxuICAgICAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgICAgICAgIHByb2plY3RWaWV3LnRvZ2dsZSgpXG5cbiAgICAgICAgICAgIHJ1bnMgLT5cblxuICAgICAgICAgICAgd2FpdEZvclBhdGhzVG9EaXNwbGF5KHByb2plY3RWaWV3KVxuXG4gICAgICAgICAgICBydW5zIC0+XG4gICAgICAgICAgICAgIGV4cGVjdChBcnJheS5mcm9tKHByb2plY3RWaWV3LmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnbGknKSkuZmluZCgoYSkgLT4gYS50ZXh0Q29udGVudC5pbmNsdWRlcyhcInNhbXBsZS50eHRcIikpKS50b0JlRGVmaW5lZCgpXG5cbiAgICAgICAgICBpdCBcImluY2x1ZGVzIHN5bWxpbmtlZCBmaWxlIHBhdGhzXCIsIC0+XG4gICAgICAgICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgICAgICAgcHJvamVjdFZpZXcudG9nZ2xlKClcblxuICAgICAgICAgICAgcnVucyAtPlxuXG4gICAgICAgICAgICB3YWl0Rm9yUGF0aHNUb0Rpc3BsYXkocHJvamVjdFZpZXcpXG5cbiAgICAgICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICAgICAgZXhwZWN0KEFycmF5LmZyb20ocHJvamVjdFZpZXcuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdsaScpKS5maW5kKChhKSAtPiBhLnRleHRDb250ZW50LmluY2x1ZGVzKFwic3ltbGluay10by1maWxlXCIpKSkudG9CZURlZmluZWQoKVxuICAgICAgICAgICAgICBleHBlY3QoQXJyYXkuZnJvbShwcm9qZWN0Vmlldy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpJykpLmZpbmQoKGEpIC0+IGEudGV4dENvbnRlbnQuaW5jbHVkZXMoXCJzeW1saW5rLXRvLWludGVybmFsLWZpbGVcIikpKS5ub3QudG9CZURlZmluZWQoKVxuXG4gICAgICAgICAgaXQgXCJleGNsdWRlcyBzeW1saW5rZWQgZm9sZGVyIHBhdGhzIGlmIGZvbGxvd1N5bWxpbmtzIGlzIGZhbHNlXCIsIC0+XG4gICAgICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ2NvcmUuZm9sbG93U3ltbGlua3MnLCBmYWxzZSlcblxuICAgICAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgICAgICAgIHByb2plY3RWaWV3LnRvZ2dsZSgpXG5cbiAgICAgICAgICAgIHJ1bnMgLT5cblxuICAgICAgICAgICAgd2FpdEZvclBhdGhzVG9EaXNwbGF5KHByb2plY3RWaWV3KVxuXG4gICAgICAgICAgICBydW5zIC0+XG4gICAgICAgICAgICAgIGV4cGVjdChBcnJheS5mcm9tKHByb2plY3RWaWV3LmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnbGknKSkuZmluZCgoYSkgLT4gYS50ZXh0Q29udGVudC5pbmNsdWRlcyhcInN5bWxpbmstdG8tZGlyXCIpKSkubm90LnRvQmVEZWZpbmVkKClcbiAgICAgICAgICAgICAgZXhwZWN0KEFycmF5LmZyb20ocHJvamVjdFZpZXcuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdsaScpKS5maW5kKChhKSAtPiBhLnRleHRDb250ZW50LmluY2x1ZGVzKFwic3ltbGluay10by1kaXIvYVwiKSkpLm5vdC50b0JlRGVmaW5lZCgpXG5cbiAgICAgICAgICAgICAgZXhwZWN0KEFycmF5LmZyb20ocHJvamVjdFZpZXcuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdsaScpKS5maW5kKChhKSAtPiBhLnRleHRDb250ZW50LmluY2x1ZGVzKFwic3ltbGluay10by1pbnRlcm5hbC1kaXJcIikpKS5ub3QudG9CZURlZmluZWQoKVxuICAgICAgICAgICAgICBleHBlY3QoQXJyYXkuZnJvbShwcm9qZWN0Vmlldy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpJykpLmZpbmQoKGEpIC0+IGEudGV4dENvbnRlbnQuaW5jbHVkZXMoXCJzeW1saW5rLXRvLWludGVybmFsLWRpci9hXCIpKSkubm90LnRvQmVEZWZpbmVkKClcblxuICAgICAgICAgIGl0IFwiaW5jbHVkZXMgc3ltbGlua2VkIGZvbGRlciBwYXRocyBpZiBmb2xsb3dTeW1saW5rcyBpcyB0cnVlXCIsIC0+XG4gICAgICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ2NvcmUuZm9sbG93U3ltbGlua3MnLCB0cnVlKVxuXG4gICAgICAgICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgICAgICAgcHJvamVjdFZpZXcudG9nZ2xlKClcblxuICAgICAgICAgICAgcnVucyAtPlxuXG4gICAgICAgICAgICB3YWl0Rm9yUGF0aHNUb0Rpc3BsYXkocHJvamVjdFZpZXcpXG5cbiAgICAgICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICAgICAgZXhwZWN0KEFycmF5LmZyb20ocHJvamVjdFZpZXcuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdsaScpKS5maW5kKChhKSAtPiBhLnRleHRDb250ZW50LmluY2x1ZGVzKFwic3ltbGluay10by1kaXIvYVwiKSkpLnRvQmVEZWZpbmVkKClcbiAgICAgICAgICAgICAgZXhwZWN0KEFycmF5LmZyb20ocHJvamVjdFZpZXcuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdsaScpKS5maW5kKChhKSAtPiBhLnRleHRDb250ZW50LmluY2x1ZGVzKFwic3ltbGluay10by1pbnRlcm5hbC1kaXIvYVwiKSkpLm5vdC50b0JlRGVmaW5lZCgpXG5cbiAgICAgICAgZGVzY3JpYmUgXCJzb2NrZXQgZmlsZXMgb24gI2RhcndpbiBvciAjbGludXhcIiwgLT5cbiAgICAgICAgICBbc29ja2V0U2VydmVyLCBzb2NrZXRQYXRoXSA9IFtdXG5cbiAgICAgICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgICAgICBzb2NrZXRTZXJ2ZXIgPSBuZXQuY3JlYXRlU2VydmVyIC0+XG4gICAgICAgICAgICBzb2NrZXRQYXRoID0gcGF0aC5qb2luKHJvb3REaXIxLCBcInNvbWUuc29ja1wiKVxuICAgICAgICAgICAgd2FpdHNGb3IgKGRvbmUpIC0+IHNvY2tldFNlcnZlci5saXN0ZW4oc29ja2V0UGF0aCwgZG9uZSlcblxuICAgICAgICAgIGFmdGVyRWFjaCAtPlxuICAgICAgICAgICAgd2FpdHNGb3IgKGRvbmUpIC0+IHNvY2tldFNlcnZlci5jbG9zZShkb25lKVxuXG4gICAgICAgICAgaXQgXCJpZ25vcmVzIHRoZW1cIiwgLT5cbiAgICAgICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICAgICAgICBwcm9qZWN0Vmlldy50b2dnbGUoKVxuXG4gICAgICAgICAgICBydW5zIC0+XG4gICAgICAgICAgICB3YWl0Rm9yUGF0aHNUb0Rpc3BsYXkocHJvamVjdFZpZXcpXG4gICAgICAgICAgICBleHBlY3QoQXJyYXkuZnJvbShwcm9qZWN0Vmlldy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpJykpLmZpbmQoKGEpIC0+IGEudGV4dENvbnRlbnQuaW5jbHVkZXMoXCJzb21lLnNvY2tcIikpKS5ub3QudG9CZURlZmluZWQoKVxuXG4gICAgICAgIGl0IFwiaWdub3JlcyBwYXRocyB0aGF0IG1hdGNoIGVudHJpZXMgaW4gY29uZmlnLmZ1enp5LWZpbmRlci5pZ25vcmVkTmFtZXNcIiwgLT5cbiAgICAgICAgICBhdG9tLmNvbmZpZy5zZXQoXCJmdXp6eS1maW5kZXIuaWdub3JlZE5hbWVzXCIsIFtcInNhbXBsZS5qc1wiLCBcIioudHh0XCJdKVxuXG4gICAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgICAgICBwcm9qZWN0Vmlldy50b2dnbGUoKVxuXG4gICAgICAgICAgcnVucyAtPlxuXG4gICAgICAgICAgd2FpdEZvclBhdGhzVG9EaXNwbGF5KHByb2plY3RWaWV3KVxuXG4gICAgICAgICAgcnVucyAtPlxuICAgICAgICAgICAgZXhwZWN0KEFycmF5LmZyb20ocHJvamVjdFZpZXcuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdsaScpKS5maW5kKChhKSAtPiBhLnRleHRDb250ZW50LmluY2x1ZGVzKFwic2FtcGxlLmpzXCIpKSkubm90LnRvQmVEZWZpbmVkKClcbiAgICAgICAgICAgIGV4cGVjdChBcnJheS5mcm9tKHByb2plY3RWaWV3LmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnbGknKSkuZmluZCgoYSkgLT4gYS50ZXh0Q29udGVudC5pbmNsdWRlcyhcInNhbXBsZS50eHRcIikpKS5ub3QudG9CZURlZmluZWQoKVxuICAgICAgICAgICAgZXhwZWN0KEFycmF5LmZyb20ocHJvamVjdFZpZXcuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdsaScpKS5maW5kKChhKSAtPiBhLnRleHRDb250ZW50LmluY2x1ZGVzKFwiYVwiKSkpLnRvQmVEZWZpbmVkKClcblxuICAgICAgICBpdCBcIm9ubHkgc2hvd3MgYSBnaXZlbiBwYXRoIG9uY2UsIGV2ZW4gaWYgaXQncyB3aXRoaW4gbXVsdGlwbGUgcm9vdCBmb2xkZXJzXCIsIC0+XG4gICAgICAgICAgY2hpbGREaXIxID0gcGF0aC5qb2luKHJvb3REaXIxLCAnYS1jaGlsZCcpXG4gICAgICAgICAgY2hpbGRGaWxlMSA9IHBhdGguam9pbihjaGlsZERpcjEsICdjaGlsZC1maWxlLnR4dCcpXG4gICAgICAgICAgZnMubWtkaXJTeW5jKGNoaWxkRGlyMSlcbiAgICAgICAgICBmcy53cml0ZUZpbGVTeW5jKGNoaWxkRmlsZTEsICdzdHVmZicpXG4gICAgICAgICAgYXRvbS5wcm9qZWN0LmFkZFBhdGgoY2hpbGREaXIxKVxuXG4gICAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgICAgICBwcm9qZWN0Vmlldy50b2dnbGUoKVxuXG4gICAgICAgICAgcnVucyAtPlxuICAgICAgICAgIHdhaXRGb3JQYXRoc1RvRGlzcGxheShwcm9qZWN0VmlldylcblxuICAgICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICAgIGV4cGVjdChBcnJheS5mcm9tKHByb2plY3RWaWV3LmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnbGknKSkuZmlsdGVyKChhKSAtPiBhLnRleHRDb250ZW50LmluY2x1ZGVzKFwiY2hpbGQtZmlsZS50eHRcIikpLmxlbmd0aCkudG9CZSgxKVxuXG4gICAgICBkZXNjcmliZSBcIndoZW4gdGhlIHByb2plY3Qgb25seSBoYXMgb25lIHBhdGhcIiwgLT5cbiAgICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICAgIGF0b20ucHJvamVjdC5zZXRQYXRocyhbcm9vdERpcjFdKVxuXG4gICAgICAgIGl0IFwiZG9lc24ndCBzaG93IHRoZSBuYW1lIG9mIGVhY2ggZmlsZSdzIHJvb3QgZGlyZWN0b3J5XCIsIC0+XG4gICAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgICAgICBwcm9qZWN0Vmlldy50b2dnbGUoKVxuXG4gICAgICAgICAgcnVucyAtPlxuXG4gICAgICAgICAgd2FpdEZvclBhdGhzVG9EaXNwbGF5KHByb2plY3RWaWV3KVxuXG4gICAgICAgICAgcnVucyAtPlxuICAgICAgICAgICAgaXRlbXMgPSBBcnJheS5mcm9tKHByb2plY3RWaWV3LmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnbGknKSlcbiAgICAgICAgICAgIGVhY2hGaWxlUGF0aCBbcm9vdERpcjFdLCAoZmlsZVBhdGgpIC0+XG4gICAgICAgICAgICAgIGl0ZW0gPSBpdGVtcy5maW5kKChhKSAtPiBhLnRleHRDb250ZW50LmluY2x1ZGVzKGZpbGVQYXRoKSlcbiAgICAgICAgICAgICAgZXhwZWN0KGl0ZW0pLnRvRXhpc3QoKVxuICAgICAgICAgICAgICBleHBlY3QoaXRlbSkubm90LnRvSGF2ZVRleHQocGF0aC5iYXNlbmFtZShyb290RGlyMSkpXG5cbiAgICAgIGRlc2NyaWJlIFwid2hlbiB0aGUgcHJvamVjdCBoYXMgbm8gcGF0aFwiLCAtPlxuICAgICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgICAgamFzbWluZS5hdHRhY2hUb0RPTSh3b3Jrc3BhY2VFbGVtZW50KVxuICAgICAgICAgIGF0b20ucHJvamVjdC5zZXRQYXRocyhbXSlcblxuICAgICAgICBpdCBcInNob3dzIGFuIGVtcHR5IG1lc3NhZ2Ugd2l0aCBubyBmaWxlcyBpbiB0aGUgbGlzdFwiLCAtPlxuICAgICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICAgICAgcHJvamVjdFZpZXcudG9nZ2xlKClcblxuICAgICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICAgIGV4cGVjdChwcm9qZWN0Vmlldy5zZWxlY3RMaXN0Vmlldy5yZWZzLmVtcHR5TWVzc2FnZSkudG9CZVZpc2libGUoKVxuICAgICAgICAgICAgZXhwZWN0KHByb2plY3RWaWV3LnNlbGVjdExpc3RWaWV3LnJlZnMuZW1wdHlNZXNzYWdlLnRleHRDb250ZW50KS50b0JlICdQcm9qZWN0IGlzIGVtcHR5J1xuICAgICAgICAgICAgZXhwZWN0KHByb2plY3RWaWV3LmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnbGknKS5sZW5ndGgpLnRvQmUgMFxuXG4gICAgZGVzY3JpYmUgXCJ3aGVuIGEgcHJvamVjdCdzIHJvb3QgcGF0aCBpcyB1bmxpbmtlZFwiLCAtPlxuICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICBybXJmKHJvb3REaXIxKSBpZiBmcy5leGlzdHNTeW5jKHJvb3REaXIxKVxuICAgICAgICBybXJmKHJvb3REaXIyKSBpZiBmcy5leGlzdHNTeW5jKHJvb3REaXIyKVxuXG4gICAgICBpdCBcInBvc3RzIGFuIGVycm9yIG5vdGlmaWNhdGlvblwiLCAtPlxuICAgICAgICBzcHlPbihhdG9tLm5vdGlmaWNhdGlvbnMsICdhZGRFcnJvcicpXG4gICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICAgIHByb2plY3RWaWV3LnRvZ2dsZSgpXG5cbiAgICAgICAgcnVucyAtPlxuICAgICAgICB3YWl0c0ZvciAtPlxuICAgICAgICAgIGF0b20ud29ya3NwYWNlLnBhbmVsRm9ySXRlbShwcm9qZWN0VmlldykuaXNWaXNpYmxlKClcbiAgICAgICAgcnVucyAtPlxuICAgICAgICAgIGV4cGVjdChhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuXG5cblxuICAgIGRlc2NyaWJlIFwid2hlbiBhIHBhdGggc2VsZWN0aW9uIGlzIGNvbmZpcm1lZFwiLCAtPlxuICAgICAgaXQgXCJvcGVucyB0aGUgZmlsZSBhc3NvY2lhdGVkIHdpdGggdGhhdCBwYXRoIGluIHRoYXQgc3BsaXRcIiwgLT5cbiAgICAgICAgamFzbWluZS5hdHRhY2hUb0RPTSh3b3Jrc3BhY2VFbGVtZW50KVxuICAgICAgICBlZGl0b3IxID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICAgIGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKS5zcGxpdFJpZ2h0KGNvcHlBY3RpdmVJdGVtOiB0cnVlKVxuICAgICAgICBlZGl0b3IyID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICAgIGV4cGVjdGVkUGF0aCA9IGF0b20ucHJvamVjdC5nZXREaXJlY3RvcmllcygpWzBdLnJlc29sdmUoJ2Rpci9hJylcblxuICAgICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgICBwcm9qZWN0Vmlldy50b2dnbGUoKVxuXG4gICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICBwcm9qZWN0Vmlldy5jb25maXJtKHtmaWxlUGF0aDogZXhwZWN0ZWRQYXRofSlcblxuICAgICAgICB3YWl0c0ZvciAtPlxuICAgICAgICAgIGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKS5nZXRJdGVtcygpLmxlbmd0aCBpcyAyXG5cbiAgICAgICAgcnVucyAtPlxuICAgICAgICAgIGVkaXRvcjMgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgICAgICBleHBlY3QoYXRvbS53b3Jrc3BhY2UucGFuZWxGb3JJdGVtKHByb2plY3RWaWV3KS5pc1Zpc2libGUoKSkudG9CZSBmYWxzZVxuICAgICAgICAgIGV4cGVjdChlZGl0b3IxLmdldFBhdGgoKSkubm90LnRvQmUgZXhwZWN0ZWRQYXRoXG4gICAgICAgICAgZXhwZWN0KGVkaXRvcjIuZ2V0UGF0aCgpKS5ub3QudG9CZSBleHBlY3RlZFBhdGhcbiAgICAgICAgICBleHBlY3QoZWRpdG9yMy5nZXRQYXRoKCkpLnRvQmUgZXhwZWN0ZWRQYXRoXG4gICAgICAgICAgZXhwZWN0KGF0b20udmlld3MuZ2V0VmlldyhlZGl0b3IzKSkudG9IYXZlRm9jdXMoKVxuXG4gICAgICBkZXNjcmliZSBcIndoZW4gdGhlIHNlbGVjdGVkIHBhdGggaXMgYSBkaXJlY3RvcnlcIiwgLT5cbiAgICAgICAgaXQgXCJsZWF2ZXMgdGhlIHRoZSB0cmVlIHZpZXcgb3BlbiwgZG9lc24ndCBvcGVuIHRoZSBwYXRoIGluIHRoZSBlZGl0b3IsIGFuZCBkaXNwbGF5cyBhbiBlcnJvclwiLCAtPlxuICAgICAgICAgIGphc21pbmUuYXR0YWNoVG9ET00od29ya3NwYWNlRWxlbWVudClcbiAgICAgICAgICBlZGl0b3JQYXRoID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpLmdldFBhdGgoKVxuICAgICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICAgICAgcHJvamVjdFZpZXcudG9nZ2xlKClcblxuICAgICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICBwcm9qZWN0Vmlldy5jb25maXJtKHtmaWxlUGF0aDogYXRvbS5wcm9qZWN0LmdldERpcmVjdG9yaWVzKClbMF0ucmVzb2x2ZSgnZGlyJyl9KVxuICAgICAgICAgIGV4cGVjdChwcm9qZWN0Vmlldy5lbGVtZW50LnBhcmVudEVsZW1lbnQpLnRvQmVEZWZpbmVkKClcbiAgICAgICAgICBleHBlY3QoYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpLmdldFBhdGgoKSkudG9CZSBlZGl0b3JQYXRoXG5cbiAgICAgICAgICB3YWl0c0ZvciAtPlxuICAgICAgICAgICAgcHJvamVjdFZpZXcuc2VsZWN0TGlzdFZpZXcucmVmcy5lcnJvck1lc3NhZ2VcblxuICAgICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICAgIGFkdmFuY2VDbG9jaygyMDAwKVxuXG4gICAgICAgICAgd2FpdHNGb3IgLT5cbiAgICAgICAgICAgIG5vdCBwcm9qZWN0Vmlldy5zZWxlY3RMaXN0Vmlldy5yZWZzLmVycm9yTWVzc2FnZVxuXG4gIGRlc2NyaWJlIFwiYnVmZmVyLWZpbmRlciBiZWhhdmlvclwiLCAtPlxuICAgIGRlc2NyaWJlIFwidG9nZ2xpbmdcIiwgLT5cbiAgICAgIGRlc2NyaWJlIFwid2hlbiB0aGVyZSBhcmUgcGFuZSBpdGVtcyB3aXRoIHBhdGhzXCIsIC0+XG4gICAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgICBqYXNtaW5lLnVzZVJlYWxDbG9jaygpXG4gICAgICAgICAgamFzbWluZS5hdHRhY2hUb0RPTSh3b3Jrc3BhY2VFbGVtZW50KVxuXG4gICAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKCdzYW1wbGUudHh0JylcblxuICAgICAgICBpdCBcInNob3dzIHRoZSBGdXp6eUZpbmRlciBpZiBpdCBpc24ndCBzaG93aW5nLCBvciBoaWRlcyBpdCBhbmQgcmV0dXJucyBmb2N1cyB0byB0aGUgYWN0aXZlIGVkaXRvclwiLCAtPlxuICAgICAgICAgIGV4cGVjdChhdG9tLndvcmtzcGFjZS5wYW5lbEZvckl0ZW0oYnVmZmVyVmlldykpLnRvQmVOdWxsKClcbiAgICAgICAgICBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKCkuc3BsaXRSaWdodChjb3B5QWN0aXZlSXRlbTogdHJ1ZSlcbiAgICAgICAgICBbZWRpdG9yMSwgZWRpdG9yMiwgZWRpdG9yM10gPSBhdG9tLndvcmtzcGFjZS5nZXRUZXh0RWRpdG9ycygpXG4gICAgICAgICAgZXhwZWN0KGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmVJdGVtKCkpLnRvQmUgZWRpdG9yM1xuXG4gICAgICAgICAgZXhwZWN0KGF0b20udmlld3MuZ2V0VmlldyhlZGl0b3IzKSkudG9IYXZlRm9jdXMoKVxuXG4gICAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgICAgICBidWZmZXJWaWV3LnRvZ2dsZSgpXG5cbiAgICAgICAgICBydW5zIC0+XG4gICAgICAgICAgICBleHBlY3QoYXRvbS53b3Jrc3BhY2UucGFuZWxGb3JJdGVtKGJ1ZmZlclZpZXcpLmlzVmlzaWJsZSgpKS50b0JlIHRydWVcbiAgICAgICAgICAgIGV4cGVjdCh3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mdXp6eS1maW5kZXInKSkudG9IYXZlRm9jdXMoKVxuICAgICAgICAgICAgYnVmZmVyVmlldy5zZWxlY3RMaXN0Vmlldy5yZWZzLnF1ZXJ5RWRpdG9yLmluc2VydFRleHQoJ3RoaXMgc2hvdWxkIG5vdCBzaG93IHVwIG5leHQgdGltZSB3ZSB0b2dnbGUnKVxuXG4gICAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgICAgICBidWZmZXJWaWV3LnRvZ2dsZSgpXG5cbiAgICAgICAgICBydW5zIC0+XG4gICAgICAgICAgICBleHBlY3QoYXRvbS52aWV3cy5nZXRWaWV3KGVkaXRvcjMpKS50b0hhdmVGb2N1cygpXG4gICAgICAgICAgICBleHBlY3QoYXRvbS53b3Jrc3BhY2UucGFuZWxGb3JJdGVtKGJ1ZmZlclZpZXcpLmlzVmlzaWJsZSgpKS50b0JlIGZhbHNlXG5cbiAgICAgICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgICAgIGJ1ZmZlclZpZXcudG9nZ2xlKClcblxuICAgICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICAgIGV4cGVjdChidWZmZXJWaWV3LnNlbGVjdExpc3RWaWV3LnJlZnMucXVlcnlFZGl0b3IuZ2V0VGV4dCgpKS50b0JlICcnXG5cbiAgICAgICAgaXQgXCJsaXN0cyB0aGUgcGF0aHMgb2YgdGhlIGN1cnJlbnQgaXRlbXMsIHNvcnRlZCBieSBtb3N0IHJlY2VudGx5IG9wZW5lZCBidXQgd2l0aCB0aGUgY3VycmVudCBpdGVtIGxhc3RcIiwgLT5cbiAgICAgICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4gJ3NhbXBsZS13aXRoLXRhYnMuY29mZmVlJ1xuXG4gICAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgICAgICBidWZmZXJWaWV3LnRvZ2dsZSgpXG5cbiAgICAgICAgICBydW5zIC0+XG4gICAgICAgICAgICBleHBlY3QoYXRvbS53b3Jrc3BhY2UucGFuZWxGb3JJdGVtKGJ1ZmZlclZpZXcpLmlzVmlzaWJsZSgpKS50b0JlIHRydWVcbiAgICAgICAgICAgIGV4cGVjdChBcnJheS5mcm9tKGJ1ZmZlclZpZXcuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdsaSA+IGRpdi5maWxlJykpLm1hcCgoZSkgLT4gZS50ZXh0Q29udGVudCkpLnRvRXF1YWwgWydzYW1wbGUudHh0JywgJ3NhbXBsZS5qcycsICdzYW1wbGUtd2l0aC10YWJzLmNvZmZlZSddXG5cbiAgICAgICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgICAgIGJ1ZmZlclZpZXcudG9nZ2xlKClcblxuICAgICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICAgIGV4cGVjdChhdG9tLndvcmtzcGFjZS5wYW5lbEZvckl0ZW0oYnVmZmVyVmlldykuaXNWaXNpYmxlKCkpLnRvQmUgZmFsc2VcblxuICAgICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbiAnc2FtcGxlLnR4dCdcblxuICAgICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICAgICAgYnVmZmVyVmlldy50b2dnbGUoKVxuXG4gICAgICAgICAgcnVucyAtPlxuICAgICAgICAgICAgZXhwZWN0KGF0b20ud29ya3NwYWNlLnBhbmVsRm9ySXRlbShidWZmZXJWaWV3KS5pc1Zpc2libGUoKSkudG9CZSB0cnVlXG4gICAgICAgICAgICBleHBlY3QoQXJyYXkuZnJvbShidWZmZXJWaWV3LmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnbGkgPiBkaXYuZmlsZScpKS5tYXAoKGUpIC0+IGUudGV4dENvbnRlbnQpKS50b0VxdWFsIFsnc2FtcGxlLXdpdGgtdGFicy5jb2ZmZWUnLCAnc2FtcGxlLmpzJywgJ3NhbXBsZS50eHQnXVxuICAgICAgICAgICAgZXhwZWN0KGJ1ZmZlclZpZXcuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdsaScpKS50b0hhdmVDbGFzcyAnc2VsZWN0ZWQnXG5cbiAgICAgICAgaXQgXCJzZXJpYWxpemVzIHRoZSBsaXN0IG9mIHBhdGhzIGFuZCB0aGVpciBsYXN0IG9wZW5lZCB0aW1lXCIsIC0+XG4gICAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuICdzYW1wbGUtd2l0aC10YWJzLmNvZmZlZSdcblxuICAgICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICAgICAgYnVmZmVyVmlldy50b2dnbGUoKVxuXG4gICAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuICdzYW1wbGUuanMnXG5cbiAgICAgICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgICAgIGJ1ZmZlclZpZXcudG9nZ2xlKClcblxuICAgICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbigpXG5cbiAgICAgICAgICBydW5zIC0+XG4gICAgICAgICAgICBhdG9tLnBhY2thZ2VzLmRlYWN0aXZhdGVQYWNrYWdlKCdmdXp6eS1maW5kZXInKVxuICAgICAgICAgICAgc3RhdGVzID0gXy5tYXAgYXRvbS5wYWNrYWdlcy5nZXRQYWNrYWdlU3RhdGUoJ2Z1enp5LWZpbmRlcicpLCAocGF0aCwgdGltZSkgLT4gWyBwYXRoLCB0aW1lIF1cbiAgICAgICAgICAgIGV4cGVjdChzdGF0ZXMubGVuZ3RoKS50b0JlIDNcbiAgICAgICAgICAgIHN0YXRlcyA9IF8uc29ydEJ5IHN0YXRlcywgKHBhdGgsIHRpbWUpIC0+IC10aW1lXG5cbiAgICAgICAgICAgIHBhdGhzID0gWyAnc2FtcGxlLXdpdGgtdGFicy5jb2ZmZWUnLCAnc2FtcGxlLnR4dCcsICdzYW1wbGUuanMnIF1cblxuICAgICAgICAgICAgZm9yIFt0aW1lLCBidWZmZXJQYXRoXSBpbiBzdGF0ZXNcbiAgICAgICAgICAgICAgZXhwZWN0KF8ubGFzdCBidWZmZXJQYXRoLnNwbGl0IHBhdGguc2VwKS50b0JlIHBhdGhzLnNoaWZ0KClcbiAgICAgICAgICAgICAgZXhwZWN0KHRpbWUpLnRvQmVHcmVhdGVyVGhhbiA1MDAwMFxuXG4gICAgICBkZXNjcmliZSBcIndoZW4gdGhlcmUgYXJlIG9ubHkgcGFuZXMgd2l0aCBhbm9ueW1vdXMgaXRlbXNcIiwgLT5cbiAgICAgICAgaXQgXCJkb2VzIG5vdCBvcGVuXCIsIC0+XG4gICAgICAgICAgYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpLmRlc3Ryb3koKVxuICAgICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbigpXG5cbiAgICAgICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgICAgIGJ1ZmZlclZpZXcudG9nZ2xlKClcblxuICAgICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICAgIGV4cGVjdChhdG9tLndvcmtzcGFjZS5wYW5lbEZvckl0ZW0oYnVmZmVyVmlldykpLnRvQmVOdWxsKClcblxuICAgICAgZGVzY3JpYmUgXCJ3aGVuIHRoZXJlIGFyZSBubyBwYW5lIGl0ZW1zXCIsIC0+XG4gICAgICAgIGl0IFwiZG9lcyBub3Qgb3BlblwiLCAtPlxuICAgICAgICAgIGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKS5kZXN0cm95KClcbiAgICAgICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgICAgIGJ1ZmZlclZpZXcudG9nZ2xlKClcblxuICAgICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICAgIGV4cGVjdChhdG9tLndvcmtzcGFjZS5wYW5lbEZvckl0ZW0oYnVmZmVyVmlldykpLnRvQmVOdWxsKClcblxuICAgICAgZGVzY3JpYmUgXCJ3aGVuIG11bHRpcGxlIHNlc3Npb25zIGFyZSBvcGVuZWQgb24gdGhlIHNhbWUgcGF0aFwiLCAtPlxuICAgICAgICBpdCBcImRvZXMgbm90IGRpc3BsYXkgZHVwbGljYXRlcyBmb3IgdGhhdCBwYXRoIGluIHRoZSBsaXN0XCIsIC0+XG4gICAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuICdzYW1wbGUuanMnXG5cbiAgICAgICAgICBydW5zIC0+XG4gICAgICAgICAgICBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKCkuc3BsaXRSaWdodChjb3B5QWN0aXZlSXRlbTogdHJ1ZSlcblxuICAgICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICAgICAgYnVmZmVyVmlldy50b2dnbGUoKVxuXG4gICAgICAgICAgcnVucyAtPlxuICAgICAgICAgICAgZXhwZWN0KEFycmF5LmZyb20oYnVmZmVyVmlldy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpID4gZGl2LmZpbGUnKSkubWFwKChlKSAtPiBlLnRleHRDb250ZW50KSkudG9FcXVhbCBbJ3NhbXBsZS5qcyddXG5cbiAgICBkZXNjcmliZSBcIndoZW4gYSBwYXRoIHNlbGVjdGlvbiBpcyBjb25maXJtZWRcIiwgLT5cbiAgICAgIFtlZGl0b3IxLCBlZGl0b3IyLCBlZGl0b3IzXSA9IFtdXG5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgamFzbWluZS5hdHRhY2hUb0RPTSh3b3Jrc3BhY2VFbGVtZW50KVxuICAgICAgICBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKCkuc3BsaXRSaWdodChjb3B5QWN0aXZlSXRlbTogdHJ1ZSlcblxuICAgICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKCdzYW1wbGUudHh0JylcblxuICAgICAgICBydW5zIC0+XG4gICAgICAgICAgW2VkaXRvcjEsIGVkaXRvcjIsIGVkaXRvcjNdID0gYXRvbS53b3Jrc3BhY2UuZ2V0VGV4dEVkaXRvcnMoKVxuXG4gICAgICAgICAgZXhwZWN0KGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKSkudG9CZSBlZGl0b3IzXG5cbiAgICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoIGF0b20udmlld3MuZ2V0VmlldyhlZGl0b3IyKSwgJ3BhbmU6c2hvdy1wcmV2aW91cy1pdGVtJ1xuXG4gICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICAgIGJ1ZmZlclZpZXcudG9nZ2xlKClcblxuICAgICAgZGVzY3JpYmUgXCJ3aGVuIHRoZSBhY3RpdmUgcGFuZSBoYXMgYW4gaXRlbSBmb3IgdGhlIHNlbGVjdGVkIHBhdGhcIiwgLT5cbiAgICAgICAgaXQgXCJzd2l0Y2hlcyB0byB0aGUgaXRlbSBmb3IgdGhlIHNlbGVjdGVkIHBhdGhcIiwgLT5cbiAgICAgICAgICBleHBlY3RlZFBhdGggPSBhdG9tLnByb2plY3QuZ2V0RGlyZWN0b3JpZXMoKVswXS5yZXNvbHZlKCdzYW1wbGUudHh0JylcbiAgICAgICAgICBidWZmZXJWaWV3LmNvbmZpcm0oe2ZpbGVQYXRoOiBleHBlY3RlZFBhdGh9KVxuXG4gICAgICAgICAgd2FpdHNGb3IgLT5cbiAgICAgICAgICAgIGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKS5nZXRQYXRoKCkgaXMgZXhwZWN0ZWRQYXRoXG5cbiAgICAgICAgICBydW5zIC0+XG4gICAgICAgICAgICBleHBlY3QoYXRvbS53b3Jrc3BhY2UucGFuZWxGb3JJdGVtKGJ1ZmZlclZpZXcpLmlzVmlzaWJsZSgpKS50b0JlIGZhbHNlXG4gICAgICAgICAgICBleHBlY3QoZWRpdG9yMS5nZXRQYXRoKCkpLm5vdC50b0JlIGV4cGVjdGVkUGF0aFxuICAgICAgICAgICAgZXhwZWN0KGVkaXRvcjIuZ2V0UGF0aCgpKS5ub3QudG9CZSBleHBlY3RlZFBhdGhcbiAgICAgICAgICAgIGV4cGVjdChlZGl0b3IzLmdldFBhdGgoKSkudG9CZSBleHBlY3RlZFBhdGhcbiAgICAgICAgICAgIGV4cGVjdChhdG9tLnZpZXdzLmdldFZpZXcoZWRpdG9yMykpLnRvSGF2ZUZvY3VzKClcblxuICAgICAgZGVzY3JpYmUgXCJ3aGVuIHRoZSBhY3RpdmUgcGFuZSBkb2VzIG5vdCBoYXZlIGFuIGl0ZW0gZm9yIHRoZSBzZWxlY3RlZCBwYXRoIGFuZCBmdXp6eS1maW5kZXIuc2VhcmNoQWxsUGFuZXMgaXMgZmFsc2VcIiwgLT5cbiAgICAgICAgaXQgXCJhZGRzIGEgbmV3IGl0ZW0gdG8gdGhlIGFjdGl2ZSBwYW5lIGZvciB0aGUgc2VsZWN0ZWQgcGF0aFwiLCAtPlxuICAgICAgICAgIGV4cGVjdGVkUGF0aCA9IGF0b20ucHJvamVjdC5nZXREaXJlY3RvcmllcygpWzBdLnJlc29sdmUoJ3NhbXBsZS50eHQnKVxuXG4gICAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgICAgICBidWZmZXJWaWV3LnRvZ2dsZSgpXG5cbiAgICAgICAgICBydW5zIC0+XG4gICAgICAgICAgICBhdG9tLnZpZXdzLmdldFZpZXcoZWRpdG9yMSkuZm9jdXMoKVxuXG4gICAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgICAgICBidWZmZXJWaWV3LnRvZ2dsZSgpXG5cbiAgICAgICAgICBydW5zIC0+XG4gICAgICAgICAgICBleHBlY3QoYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpKS50b0JlIGVkaXRvcjFcbiAgICAgICAgICAgIGJ1ZmZlclZpZXcuY29uZmlybSh7ZmlsZVBhdGg6IGV4cGVjdGVkUGF0aH0sIGF0b20uY29uZmlnLmdldCAnZnV6enktZmluZGVyLnNlYXJjaEFsbFBhbmVzJylcblxuICAgICAgICAgIHdhaXRzRm9yIC0+XG4gICAgICAgICAgICBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKCkuZ2V0SXRlbXMoKS5sZW5ndGggaXMgMlxuXG4gICAgICAgICAgcnVucyAtPlxuICAgICAgICAgICAgZWRpdG9yNCA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuXG4gICAgICAgICAgICBleHBlY3QoYXRvbS53b3Jrc3BhY2UucGFuZWxGb3JJdGVtKGJ1ZmZlclZpZXcpLmlzVmlzaWJsZSgpKS50b0JlIGZhbHNlXG5cbiAgICAgICAgICAgIGV4cGVjdChlZGl0b3I0KS5ub3QudG9CZSBlZGl0b3IxXG4gICAgICAgICAgICBleHBlY3QoZWRpdG9yNCkubm90LnRvQmUgZWRpdG9yMlxuICAgICAgICAgICAgZXhwZWN0KGVkaXRvcjQpLm5vdC50b0JlIGVkaXRvcjNcblxuICAgICAgICAgICAgZXhwZWN0KGVkaXRvcjQuZ2V0UGF0aCgpKS50b0JlIGV4cGVjdGVkUGF0aFxuICAgICAgICAgICAgZXhwZWN0KGF0b20udmlld3MuZ2V0VmlldyhlZGl0b3I0KSkudG9IYXZlRm9jdXMoKVxuXG4gICAgICBkZXNjcmliZSBcIndoZW4gdGhlIGFjdGl2ZSBwYW5lIGRvZXMgbm90IGhhdmUgYW4gaXRlbSBmb3IgdGhlIHNlbGVjdGVkIHBhdGggYW5kIGZ1enp5LWZpbmRlci5zZWFyY2hBbGxQYW5lcyBpcyB0cnVlXCIsIC0+XG4gICAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgICBhdG9tLmNvbmZpZy5zZXQoXCJmdXp6eS1maW5kZXIuc2VhcmNoQWxsUGFuZXNcIiwgdHJ1ZSlcblxuICAgICAgICBpdCBcInN3aXRjaGVzIHRvIHRoZSBwYW5lIHdpdGggdGhlIGl0ZW0gZm9yIHRoZSBzZWxlY3RlZCBwYXRoXCIsIC0+XG4gICAgICAgICAgZXhwZWN0ZWRQYXRoID0gYXRvbS5wcm9qZWN0LmdldERpcmVjdG9yaWVzKClbMF0ucmVzb2x2ZSgnc2FtcGxlLnR4dCcpXG4gICAgICAgICAgb3JpZ2luYWxQYW5lID0gbnVsbFxuXG4gICAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgICAgICBidWZmZXJWaWV3LnRvZ2dsZSgpXG5cbiAgICAgICAgICBydW5zIC0+XG4gICAgICAgICAgICBhdG9tLnZpZXdzLmdldFZpZXcoZWRpdG9yMSkuZm9jdXMoKVxuICAgICAgICAgICAgb3JpZ2luYWxQYW5lID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpXG5cbiAgICAgICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgICAgIGJ1ZmZlclZpZXcudG9nZ2xlKClcblxuICAgICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICAgIGV4cGVjdChhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCkpLnRvQmUgZWRpdG9yMVxuICAgICAgICAgICAgYnVmZmVyVmlldy5jb25maXJtKHtmaWxlUGF0aDogZXhwZWN0ZWRQYXRofSwgc2VhcmNoQWxsUGFuZXM6IGF0b20uY29uZmlnLmdldCgnZnV6enktZmluZGVyLnNlYXJjaEFsbFBhbmVzJykpXG5cbiAgICAgICAgICB3YWl0c0ZvciAtPlxuICAgICAgICAgICAgYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpLmdldFBhdGgoKSBpcyBleHBlY3RlZFBhdGhcblxuICAgICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICAgIGV4cGVjdChhdG9tLndvcmtzcGFjZS5wYW5lbEZvckl0ZW0oYnVmZmVyVmlldykuaXNWaXNpYmxlKCkpLnRvQmUgZmFsc2VcbiAgICAgICAgICAgIGV4cGVjdChhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKCkpLm5vdC50b0JlIG9yaWdpbmFsUGFuZVxuICAgICAgICAgICAgZXhwZWN0KGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKSkudG9CZSBlZGl0b3IzXG4gICAgICAgICAgICBleHBlY3QoYXRvbS53b3Jrc3BhY2UuZ2V0UGFuZUl0ZW1zKCkubGVuZ3RoKS50b0JlIDNcblxuICBkZXNjcmliZSBcImNvbW1vbiBiZWhhdmlvciBiZXR3ZWVuIGZpbGUgYW5kIGJ1ZmZlciBmaW5kZXJcIiwgLT5cbiAgICBkZXNjcmliZSBcIndoZW4gdGhlIGZ1enp5IGZpbmRlciBpcyBjYW5jZWxsZWRcIiwgLT5cbiAgICAgIGRlc2NyaWJlIFwid2hlbiBhbiBlZGl0b3IgaXMgb3BlblwiLCAtPlxuICAgICAgICBpdCBcImRldGFjaGVzIHRoZSBmaW5kZXIgYW5kIGZvY3VzZXMgdGhlIHByZXZpb3VzbHkgZm9jdXNlZCBlbGVtZW50XCIsIC0+XG4gICAgICAgICAgamFzbWluZS5hdHRhY2hUb0RPTSh3b3Jrc3BhY2VFbGVtZW50KVxuICAgICAgICAgIGFjdGl2ZUVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuXG4gICAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgICAgICBwcm9qZWN0Vmlldy50b2dnbGUoKVxuXG4gICAgICAgICAgcnVucyAtPlxuICAgICAgICAgICAgZXhwZWN0KHByb2plY3RWaWV3LmVsZW1lbnQucGFyZW50RWxlbWVudCkudG9CZURlZmluZWQoKVxuICAgICAgICAgICAgZXhwZWN0KHByb2plY3RWaWV3LnNlbGVjdExpc3RWaWV3LnJlZnMucXVlcnlFZGl0b3IuZWxlbWVudCkudG9IYXZlRm9jdXMoKVxuXG4gICAgICAgICAgICBwcm9qZWN0Vmlldy5jYW5jZWwoKVxuXG4gICAgICAgICAgICBleHBlY3QoYXRvbS53b3Jrc3BhY2UucGFuZWxGb3JJdGVtKHByb2plY3RWaWV3KS5pc1Zpc2libGUoKSkudG9CZSBmYWxzZVxuICAgICAgICAgICAgZXhwZWN0KGF0b20udmlld3MuZ2V0VmlldyhhY3RpdmVFZGl0b3IpKS50b0hhdmVGb2N1cygpXG5cbiAgICAgIGRlc2NyaWJlIFwid2hlbiBubyBlZGl0b3JzIGFyZSBvcGVuXCIsIC0+XG4gICAgICAgIGl0IFwiZGV0YWNoZXMgdGhlIGZpbmRlciBhbmQgZm9jdXNlcyB0aGUgcHJldmlvdXNseSBmb2N1c2VkIGVsZW1lbnRcIiwgLT5cbiAgICAgICAgICBqYXNtaW5lLmF0dGFjaFRvRE9NKHdvcmtzcGFjZUVsZW1lbnQpXG4gICAgICAgICAgYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpLmRlc3Ryb3koKVxuXG4gICAgICAgICAgaW5wdXRWaWV3ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKVxuICAgICAgICAgIHdvcmtzcGFjZUVsZW1lbnQuYXBwZW5kQ2hpbGQoaW5wdXRWaWV3KVxuICAgICAgICAgIGlucHV0Vmlldy5mb2N1cygpXG5cbiAgICAgICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgICAgIHByb2plY3RWaWV3LnRvZ2dsZSgpXG5cbiAgICAgICAgICBydW5zIC0+XG4gICAgICAgICAgICBleHBlY3QocHJvamVjdFZpZXcuZWxlbWVudC5wYXJlbnRFbGVtZW50KS50b0JlRGVmaW5lZCgpXG4gICAgICAgICAgICBleHBlY3QocHJvamVjdFZpZXcuc2VsZWN0TGlzdFZpZXcucmVmcy5xdWVyeUVkaXRvci5lbGVtZW50KS50b0hhdmVGb2N1cygpXG4gICAgICAgICAgICBwcm9qZWN0Vmlldy5jYW5jZWwoKVxuICAgICAgICAgICAgZXhwZWN0KGF0b20ud29ya3NwYWNlLnBhbmVsRm9ySXRlbShwcm9qZWN0VmlldykuaXNWaXNpYmxlKCkpLnRvQmUgZmFsc2VcbiAgICAgICAgICAgIGV4cGVjdChpbnB1dFZpZXcpLnRvSGF2ZUZvY3VzKClcblxuICBkZXNjcmliZSBcImNhY2hlZCBmaWxlIHBhdGhzXCIsIC0+XG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgc3B5T24oUGF0aExvYWRlciwgXCJzdGFydFRhc2tcIikuYW5kQ2FsbFRocm91Z2goKVxuICAgICAgc3B5T24oYXRvbS53b3Jrc3BhY2UsIFwiZ2V0VGV4dEVkaXRvcnNcIikuYW5kQ2FsbFRocm91Z2goKVxuXG4gICAgaXQgXCJjYWNoZXMgZmlsZSBwYXRocyBhZnRlciBmaXJzdCB0aW1lXCIsIC0+XG4gICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgcHJvamVjdFZpZXcudG9nZ2xlKClcblxuICAgICAgcnVucyAtPlxuICAgICAgICB3YWl0Rm9yUGF0aHNUb0Rpc3BsYXkocHJvamVjdFZpZXcpXG5cbiAgICAgIHJ1bnMgLT5cbiAgICAgICAgZXhwZWN0KFBhdGhMb2FkZXIuc3RhcnRUYXNrKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgICAgUGF0aExvYWRlci5zdGFydFRhc2sucmVzZXQoKVxuXG4gICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgcHJvamVjdFZpZXcudG9nZ2xlKClcblxuICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgIHByb2plY3RWaWV3LnRvZ2dsZSgpXG5cbiAgICAgIHJ1bnMgLT5cbiAgICAgICAgd2FpdEZvclBhdGhzVG9EaXNwbGF5KHByb2plY3RWaWV3KVxuXG4gICAgICBydW5zIC0+XG4gICAgICAgIGV4cGVjdChQYXRoTG9hZGVyLnN0YXJ0VGFzaykubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuXG4gICAgaXQgXCJkb2Vzbid0IGNhY2hlIGJ1ZmZlciBwYXRoc1wiLCAtPlxuICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgIGJ1ZmZlclZpZXcudG9nZ2xlKClcblxuICAgICAgcnVucyAtPlxuICAgICAgICB3YWl0Rm9yUGF0aHNUb0Rpc3BsYXkoYnVmZmVyVmlldylcblxuICAgICAgcnVucyAtPlxuICAgICAgICBleHBlY3QoYXRvbS53b3Jrc3BhY2UuZ2V0VGV4dEVkaXRvcnMpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgICBhdG9tLndvcmtzcGFjZS5nZXRUZXh0RWRpdG9ycy5yZXNldCgpXG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICBidWZmZXJWaWV3LnRvZ2dsZSgpXG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICBidWZmZXJWaWV3LnRvZ2dsZSgpXG5cbiAgICAgIHJ1bnMgLT5cbiAgICAgICAgd2FpdEZvclBhdGhzVG9EaXNwbGF5KGJ1ZmZlclZpZXcpXG5cbiAgICAgIHJ1bnMgLT5cbiAgICAgICAgZXhwZWN0KGF0b20ud29ya3NwYWNlLmdldFRleHRFZGl0b3JzKS50b0hhdmVCZWVuQ2FsbGVkKClcblxuICAgIGl0IFwiYnVzdHMgdGhlIGNhY2hlIHdoZW4gdGhlIHdpbmRvdyBnYWlucyBmb2N1c1wiLCAtPlxuICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgIHByb2plY3RWaWV3LnRvZ2dsZSgpXG5cbiAgICAgIHJ1bnMgLT5cbiAgICAgICAgd2FpdEZvclBhdGhzVG9EaXNwbGF5KHByb2plY3RWaWV3KVxuXG4gICAgICBydW5zIC0+XG4gICAgICAgIGV4cGVjdChQYXRoTG9hZGVyLnN0YXJ0VGFzaykudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICAgIFBhdGhMb2FkZXIuc3RhcnRUYXNrLnJlc2V0KClcbiAgICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQgbmV3IEN1c3RvbUV2ZW50KCdmb2N1cycpXG4gICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICAgIHByb2plY3RWaWV3LnRvZ2dsZSgpXG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICBwcm9qZWN0Vmlldy50b2dnbGUoKVxuXG4gICAgICBydW5zIC0+XG4gICAgICAgIGV4cGVjdChQYXRoTG9hZGVyLnN0YXJ0VGFzaykudG9IYXZlQmVlbkNhbGxlZCgpXG5cbiAgICBpdCBcImJ1c3RzIHRoZSBjYWNoZSB3aGVuIHRoZSBwcm9qZWN0IHBhdGggY2hhbmdlc1wiLCAtPlxuICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgIHByb2plY3RWaWV3LnRvZ2dsZSgpXG5cbiAgICAgIHJ1bnMgLT5cbiAgICAgICAgd2FpdEZvclBhdGhzVG9EaXNwbGF5KHByb2plY3RWaWV3KVxuXG4gICAgICBydW5zIC0+XG4gICAgICAgIGV4cGVjdChQYXRoTG9hZGVyLnN0YXJ0VGFzaykudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICAgIFBhdGhMb2FkZXIuc3RhcnRUYXNrLnJlc2V0KClcbiAgICAgICAgYXRvbS5wcm9qZWN0LnNldFBhdGhzKFt0ZW1wLm1rZGlyU3luYygnYXRvbScpXSlcblxuICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgIHByb2plY3RWaWV3LnRvZ2dsZSgpXG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICBwcm9qZWN0Vmlldy50b2dnbGUoKVxuXG4gICAgICBydW5zIC0+XG4gICAgICAgIGV4cGVjdChQYXRoTG9hZGVyLnN0YXJ0VGFzaykudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICAgIGV4cGVjdChwcm9qZWN0Vmlldy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpJykubGVuZ3RoKS50b0JlIDBcblxuICAgIGRlc2NyaWJlIFwidGhlIGluaXRpYWwgbG9hZCBwYXRocyB0YXNrIHN0YXJ0ZWQgZHVyaW5nIHBhY2thZ2UgYWN0aXZhdGlvblwiLCAtPlxuICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICBmdXp6eUZpbmRlci5wcm9qZWN0Vmlldy5kZXN0cm95KClcbiAgICAgICAgZnV6enlGaW5kZXIucHJvamVjdFZpZXcgPSBudWxsXG4gICAgICAgIGZ1enp5RmluZGVyLnN0YXJ0TG9hZFBhdGhzVGFzaygpXG5cbiAgICAgICAgd2FpdHNGb3IgLT5cbiAgICAgICAgICBmdXp6eUZpbmRlci5wcm9qZWN0UGF0aHNcblxuICAgICAgaXQgXCJwYXNzZXMgdGhlIGluZGV4ZWQgcGF0aHMgaW50byB0aGUgcHJvamVjdCB2aWV3IHdoZW4gaXQgaXMgY3JlYXRlZFwiLCAtPlxuICAgICAgICB7cHJvamVjdFBhdGhzfSA9IGZ1enp5RmluZGVyXG4gICAgICAgIGV4cGVjdChwcm9qZWN0UGF0aHMubGVuZ3RoKS50b0JlIDE5XG4gICAgICAgIHByb2plY3RWaWV3ID0gZnV6enlGaW5kZXIuY3JlYXRlUHJvamVjdFZpZXcoKVxuICAgICAgICBleHBlY3QocHJvamVjdFZpZXcucGF0aHMpLnRvQmUgcHJvamVjdFBhdGhzXG4gICAgICAgIGV4cGVjdChwcm9qZWN0Vmlldy5yZWxvYWRQYXRocykudG9CZSBmYWxzZVxuXG4gICAgICBpdCBcImJ1c3RzIHRoZSBjYWNoZWQgcGF0aHMgd2hlbiB0aGUgcHJvamVjdCBwYXRocyBjaGFuZ2VcIiwgLT5cbiAgICAgICAgYXRvbS5wcm9qZWN0LnNldFBhdGhzKFtdKVxuXG4gICAgICAgIHtwcm9qZWN0UGF0aHN9ID0gZnV6enlGaW5kZXJcbiAgICAgICAgZXhwZWN0KHByb2plY3RQYXRocykudG9CZSBudWxsXG5cbiAgICAgICAgcHJvamVjdFZpZXcgPSBmdXp6eUZpbmRlci5jcmVhdGVQcm9qZWN0VmlldygpXG4gICAgICAgIGV4cGVjdChwcm9qZWN0Vmlldy5wYXRocykudG9CZSBudWxsXG4gICAgICAgIGV4cGVjdChwcm9qZWN0Vmlldy5yZWxvYWRQYXRocykudG9CZSB0cnVlXG5cbiAgZGVzY3JpYmUgXCJvcGVuaW5nIGEgcGF0aCBpbnRvIGEgc3BsaXRcIiwgLT5cbiAgICBpdCBcIm9wZW5zIHRoZSBwYXRoIGJ5IHNwbGl0dGluZyB0aGUgYWN0aXZlIGVkaXRvciBsZWZ0XCIsIC0+XG4gICAgICBleHBlY3QoZ2V0Q2VudGVyKCkuZ2V0UGFuZXMoKS5sZW5ndGgpLnRvQmUgMVxuICAgICAgcGFuZSA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKVxuICAgICAgZmlsZVBhdGggPSBudWxsXG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICBidWZmZXJWaWV3LnRvZ2dsZSgpXG5cbiAgICAgIHJ1bnMgLT5cbiAgICAgICAge2ZpbGVQYXRofSA9IGJ1ZmZlclZpZXcuc2VsZWN0TGlzdFZpZXcuZ2V0U2VsZWN0ZWRJdGVtKClcbiAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCBidWZmZXJWaWV3LmVsZW1lbnQsICdwYW5lOnNwbGl0LWxlZnQnXG5cbiAgICAgIHdhaXRzRm9yIC0+XG4gICAgICAgIGdldENlbnRlcigpLmdldFBhbmVzKCkubGVuZ3RoIGlzIDJcblxuICAgICAgd2FpdHNGb3IgLT5cbiAgICAgICAgYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG5cbiAgICAgIHJ1bnMgLT5cbiAgICAgICAgW2xlZnRQYW5lLCByaWdodFBhbmVdID0gZ2V0Q2VudGVyKCkuZ2V0UGFuZXMoKVxuICAgICAgICBleHBlY3QoYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpKS50b0JlIGxlZnRQYW5lXG4gICAgICAgIGV4cGVjdChhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCkuZ2V0UGF0aCgpKS50b0JlIGF0b20ucHJvamVjdC5nZXREaXJlY3RvcmllcygpWzBdLnJlc29sdmUoZmlsZVBhdGgpXG5cbiAgICBpdCBcIm9wZW5zIHRoZSBwYXRoIGJ5IHNwbGl0dGluZyB0aGUgYWN0aXZlIGVkaXRvciByaWdodFwiLCAtPlxuICAgICAgZXhwZWN0KGdldENlbnRlcigpLmdldFBhbmVzKCkubGVuZ3RoKS50b0JlIDFcbiAgICAgIHBhbmUgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKClcbiAgICAgIGZpbGVQYXRoID0gbnVsbFxuXG4gICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgYnVmZmVyVmlldy50b2dnbGUoKVxuXG4gICAgICBydW5zIC0+XG4gICAgICAgIHtmaWxlUGF0aH0gPSBidWZmZXJWaWV3LnNlbGVjdExpc3RWaWV3LmdldFNlbGVjdGVkSXRlbSgpXG4gICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2ggYnVmZmVyVmlldy5lbGVtZW50LCAncGFuZTpzcGxpdC1yaWdodCdcblxuICAgICAgd2FpdHNGb3IgLT5cbiAgICAgICAgZ2V0Q2VudGVyKCkuZ2V0UGFuZXMoKS5sZW5ndGggaXMgMlxuXG4gICAgICB3YWl0c0ZvciAtPlxuICAgICAgICBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcblxuICAgICAgcnVucyAtPlxuICAgICAgICBbbGVmdFBhbmUsIHJpZ2h0UGFuZV0gPSBnZXRDZW50ZXIoKS5nZXRQYW5lcygpXG4gICAgICAgIGV4cGVjdChhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKCkpLnRvQmUgcmlnaHRQYW5lXG4gICAgICAgIGV4cGVjdChhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCkuZ2V0UGF0aCgpKS50b0JlIGF0b20ucHJvamVjdC5nZXREaXJlY3RvcmllcygpWzBdLnJlc29sdmUoZmlsZVBhdGgpXG5cbiAgICBpdCBcIm9wZW5zIHRoZSBwYXRoIGJ5IHNwbGl0dGluZyB0aGUgYWN0aXZlIGVkaXRvciB1cFwiLCAtPlxuICAgICAgZXhwZWN0KGdldENlbnRlcigpLmdldFBhbmVzKCkubGVuZ3RoKS50b0JlIDFcbiAgICAgIHBhbmUgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKClcbiAgICAgIGZpbGVQYXRoID0gbnVsbFxuXG4gICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgYnVmZmVyVmlldy50b2dnbGUoKVxuXG4gICAgICBydW5zIC0+XG4gICAgICAgIHtmaWxlUGF0aH0gPSBidWZmZXJWaWV3LnNlbGVjdExpc3RWaWV3LmdldFNlbGVjdGVkSXRlbSgpXG4gICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2ggYnVmZmVyVmlldy5lbGVtZW50LCAncGFuZTpzcGxpdC11cCdcblxuICAgICAgd2FpdHNGb3IgLT5cbiAgICAgICAgZ2V0Q2VudGVyKCkuZ2V0UGFuZXMoKS5sZW5ndGggaXMgMlxuXG4gICAgICB3YWl0c0ZvciAtPlxuICAgICAgICBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcblxuICAgICAgcnVucyAtPlxuICAgICAgICBbdG9wUGFuZSwgYm90dG9tUGFuZV0gPSBnZXRDZW50ZXIoKS5nZXRQYW5lcygpXG4gICAgICAgIGV4cGVjdChhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKCkpLnRvQmUgdG9wUGFuZVxuICAgICAgICBleHBlY3QoYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpLmdldFBhdGgoKSkudG9CZSBhdG9tLnByb2plY3QuZ2V0RGlyZWN0b3JpZXMoKVswXS5yZXNvbHZlKGZpbGVQYXRoKVxuXG4gICAgaXQgXCJvcGVucyB0aGUgcGF0aCBieSBzcGxpdHRpbmcgdGhlIGFjdGl2ZSBlZGl0b3IgZG93blwiLCAtPlxuICAgICAgZXhwZWN0KGdldENlbnRlcigpLmdldFBhbmVzKCkubGVuZ3RoKS50b0JlIDFcbiAgICAgIHBhbmUgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKClcbiAgICAgIGZpbGVQYXRoID0gbnVsbFxuXG4gICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgYnVmZmVyVmlldy50b2dnbGUoKVxuXG4gICAgICBydW5zIC0+XG4gICAgICAgIHtmaWxlUGF0aH0gPSBidWZmZXJWaWV3LnNlbGVjdExpc3RWaWV3LmdldFNlbGVjdGVkSXRlbSgpXG4gICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2ggYnVmZmVyVmlldy5lbGVtZW50LCAncGFuZTpzcGxpdC1kb3duJ1xuXG4gICAgICB3YWl0c0ZvciAtPlxuICAgICAgICBnZXRDZW50ZXIoKS5nZXRQYW5lcygpLmxlbmd0aCBpcyAyXG5cbiAgICAgIHdhaXRzRm9yIC0+XG4gICAgICAgIGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuXG4gICAgICBydW5zIC0+XG4gICAgICAgIFt0b3BQYW5lLCBib3R0b21QYW5lXSA9IGdldENlbnRlcigpLmdldFBhbmVzKClcbiAgICAgICAgZXhwZWN0KGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKSkudG9CZSBib3R0b21QYW5lXG4gICAgICAgIGV4cGVjdChhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCkuZ2V0UGF0aCgpKS50b0JlIGF0b20ucHJvamVjdC5nZXREaXJlY3RvcmllcygpWzBdLnJlc29sdmUoZmlsZVBhdGgpXG5cbiAgZGVzY3JpYmUgXCJ3aGVuIHRoZSBmaWx0ZXIgdGV4dCBjb250YWlucyBhIGNvbG9uIGZvbGxvd2VkIGJ5IGEgbnVtYmVyXCIsIC0+XG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgamFzbWluZS5hdHRhY2hUb0RPTSh3b3Jrc3BhY2VFbGVtZW50KVxuICAgICAgZXhwZWN0KGF0b20ud29ya3NwYWNlLnBhbmVsRm9ySXRlbShwcm9qZWN0VmlldykpLnRvQmVOdWxsKClcblxuICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oJ3NhbXBsZS50eHQnKVxuXG4gICAgICBydW5zIC0+XG4gICAgICAgIFtlZGl0b3IxLCBlZGl0b3IyXSA9IGF0b20ud29ya3NwYWNlLmdldFRleHRFZGl0b3JzKClcbiAgICAgICAgZXhwZWN0KGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKSkudG9CZSBlZGl0b3IyXG4gICAgICAgIGV4cGVjdChlZGl0b3IxLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKCkpLnRvRXF1YWwgWzAsIDBdXG5cbiAgICBkZXNjcmliZSBcIndoZW4gdGhlIGZpbHRlciB0ZXh0IGhhcyBhIGZpbGUgcGF0aFwiLCAtPlxuICAgICAgaXQgXCJvcGVucyB0aGUgc2VsZWN0ZWQgcGF0aCB0byB0aGF0IGxpbmUgbnVtYmVyXCIsIC0+XG4gICAgICAgIFtlZGl0b3IxLCBlZGl0b3IyXSA9IGF0b20ud29ya3NwYWNlLmdldFRleHRFZGl0b3JzKClcblxuICAgICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgICBidWZmZXJWaWV3LnRvZ2dsZSgpXG5cbiAgICAgICAgcnVucyAtPlxuICAgICAgICAgIGV4cGVjdChhdG9tLndvcmtzcGFjZS5wYW5lbEZvckl0ZW0oYnVmZmVyVmlldykuaXNWaXNpYmxlKCkpLnRvQmUodHJ1ZSlcbiAgICAgICAgICBidWZmZXJWaWV3LnNlbGVjdExpc3RWaWV3LnJlZnMucXVlcnlFZGl0b3Iuc2V0VGV4dCgnc2FtcGxlLmpzOjQnKVxuXG4gICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICAgIGdldE9yU2NoZWR1bGVVcGRhdGVQcm9taXNlKClcblxuICAgICAgICBydW5zIC0+XG4gICAgICAgICAge2ZpbGVQYXRofSA9IGJ1ZmZlclZpZXcuc2VsZWN0TGlzdFZpZXcuZ2V0U2VsZWN0ZWRJdGVtKClcbiAgICAgICAgICBleHBlY3QoYXRvbS5wcm9qZWN0LmdldERpcmVjdG9yaWVzKClbMF0ucmVzb2x2ZShmaWxlUGF0aCkpLnRvQmUgZWRpdG9yMS5nZXRQYXRoKClcblxuICAgICAgICAgIHNweU9uKGJ1ZmZlclZpZXcsICdtb3ZlVG9MaW5lJykuYW5kQ2FsbFRocm91Z2goKVxuICAgICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2ggYnVmZmVyVmlldy5lbGVtZW50LCAnY29yZTpjb25maXJtJ1xuXG4gICAgICAgIHdhaXRzRm9yIC0+XG4gICAgICAgICAgYnVmZmVyVmlldy5tb3ZlVG9MaW5lLmNhbGxDb3VudCA+IDBcblxuICAgICAgICBydW5zIC0+XG4gICAgICAgICAgZXhwZWN0KGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKSkudG9CZSBlZGl0b3IxXG4gICAgICAgICAgZXhwZWN0KGVkaXRvcjEuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKSkudG9FcXVhbCBbMywgNF1cblxuICBkZXNjcmliZSBcIm1hdGNoIGhpZ2hsaWdodGluZ1wiLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIGphc21pbmUuYXR0YWNoVG9ET00od29ya3NwYWNlRWxlbWVudClcbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICBidWZmZXJWaWV3LnRvZ2dsZSgpXG5cbiAgICBpdCBcImhpZ2hsaWdodHMgYW4gZXhhY3QgbWF0Y2hcIiwgLT5cbiAgICAgIGJ1ZmZlclZpZXcuc2VsZWN0TGlzdFZpZXcucmVmcy5xdWVyeUVkaXRvci5zZXRUZXh0KCdzYW1wbGUuanMnKVxuXG4gICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgZ2V0T3JTY2hlZHVsZVVwZGF0ZVByb21pc2UoKVxuXG4gICAgICBydW5zIC0+XG4gICAgICAgIHJlc3VsdFZpZXcgPSBidWZmZXJWaWV3LmVsZW1lbnQucXVlcnlTZWxlY3RvcignbGknKVxuICAgICAgICBwcmltYXJ5TWF0Y2hlcyA9IHJlc3VsdFZpZXcucXVlcnlTZWxlY3RvckFsbCgnLnByaW1hcnktbGluZSAuY2hhcmFjdGVyLW1hdGNoJylcbiAgICAgICAgc2Vjb25kYXJ5TWF0Y2hlcyA9IHJlc3VsdFZpZXcucXVlcnlTZWxlY3RvckFsbCgnLnNlY29uZGFyeS1saW5lIC5jaGFyYWN0ZXItbWF0Y2gnKVxuICAgICAgICBleHBlY3QocHJpbWFyeU1hdGNoZXMubGVuZ3RoKS50b0JlIDFcbiAgICAgICAgZXhwZWN0KHByaW1hcnlNYXRjaGVzW3ByaW1hcnlNYXRjaGVzLmxlbmd0aCAtIDFdLnRleHRDb250ZW50KS50b0JlICdzYW1wbGUuanMnXG4gICAgICAgICMgVXNlIGB0b0JlR3JlYXRlclRoYW5gIGJlY2F1c2UgZGlyIG1heSBoYXZlIHNvbWUgY2hhcmFjdGVycyBpbiBpdFxuICAgICAgICBleHBlY3Qoc2Vjb25kYXJ5TWF0Y2hlcy5sZW5ndGgpLnRvQmVHcmVhdGVyVGhhbiAwXG4gICAgICAgIGV4cGVjdChzZWNvbmRhcnlNYXRjaGVzW3NlY29uZGFyeU1hdGNoZXMubGVuZ3RoIC0gMV0udGV4dENvbnRlbnQpLnRvQmUgJ3NhbXBsZS5qcydcblxuICAgIGl0IFwiaGlnaGxpZ2h0cyBhIHBhcnRpYWwgbWF0Y2hcIiwgLT5cbiAgICAgIGJ1ZmZlclZpZXcuc2VsZWN0TGlzdFZpZXcucmVmcy5xdWVyeUVkaXRvci5zZXRUZXh0KCdzYW1wbGUnKVxuXG4gICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgZ2V0T3JTY2hlZHVsZVVwZGF0ZVByb21pc2UoKVxuXG4gICAgICBydW5zIC0+XG4gICAgICAgIHJlc3VsdFZpZXcgPSBidWZmZXJWaWV3LmVsZW1lbnQucXVlcnlTZWxlY3RvcignbGknKVxuICAgICAgICBwcmltYXJ5TWF0Y2hlcyA9IHJlc3VsdFZpZXcucXVlcnlTZWxlY3RvckFsbCgnLnByaW1hcnktbGluZSAuY2hhcmFjdGVyLW1hdGNoJylcbiAgICAgICAgc2Vjb25kYXJ5TWF0Y2hlcyA9IHJlc3VsdFZpZXcucXVlcnlTZWxlY3RvckFsbCgnLnNlY29uZGFyeS1saW5lIC5jaGFyYWN0ZXItbWF0Y2gnKVxuICAgICAgICBleHBlY3QocHJpbWFyeU1hdGNoZXMubGVuZ3RoKS50b0JlIDFcbiAgICAgICAgZXhwZWN0KHByaW1hcnlNYXRjaGVzW3ByaW1hcnlNYXRjaGVzLmxlbmd0aCAtIDFdLnRleHRDb250ZW50KS50b0JlICdzYW1wbGUnXG4gICAgICAgICMgVXNlIGB0b0JlR3JlYXRlclRoYW5gIGJlY2F1c2UgZGlyIG1heSBoYXZlIHNvbWUgY2hhcmFjdGVycyBpbiBpdFxuICAgICAgICBleHBlY3Qoc2Vjb25kYXJ5TWF0Y2hlcy5sZW5ndGgpLnRvQmVHcmVhdGVyVGhhbiAwXG4gICAgICAgIGV4cGVjdChzZWNvbmRhcnlNYXRjaGVzW3NlY29uZGFyeU1hdGNoZXMubGVuZ3RoIC0gMV0udGV4dENvbnRlbnQpLnRvQmUgJ3NhbXBsZSdcblxuICAgIGl0IFwiaGlnaGxpZ2h0cyBtdWx0aXBsZSBtYXRjaGVzIGluIHRoZSBmaWxlIG5hbWVcIiwgLT5cbiAgICAgIGJ1ZmZlclZpZXcuc2VsZWN0TGlzdFZpZXcucmVmcy5xdWVyeUVkaXRvci5zZXRUZXh0KCdzYW1wbGVqcycpXG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICBnZXRPclNjaGVkdWxlVXBkYXRlUHJvbWlzZSgpXG5cbiAgICAgIHJ1bnMgLT5cbiAgICAgICAgcmVzdWx0VmlldyA9IGJ1ZmZlclZpZXcuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdsaScpXG4gICAgICAgIHByaW1hcnlNYXRjaGVzID0gcmVzdWx0Vmlldy5xdWVyeVNlbGVjdG9yQWxsKCcucHJpbWFyeS1saW5lIC5jaGFyYWN0ZXItbWF0Y2gnKVxuICAgICAgICBzZWNvbmRhcnlNYXRjaGVzID0gcmVzdWx0Vmlldy5xdWVyeVNlbGVjdG9yQWxsKCcuc2Vjb25kYXJ5LWxpbmUgLmNoYXJhY3Rlci1tYXRjaCcpXG4gICAgICAgIGV4cGVjdChwcmltYXJ5TWF0Y2hlcy5sZW5ndGgpLnRvQmUgMlxuICAgICAgICBleHBlY3QocHJpbWFyeU1hdGNoZXNbMF0udGV4dENvbnRlbnQpLnRvQmUgJ3NhbXBsZSdcbiAgICAgICAgZXhwZWN0KHByaW1hcnlNYXRjaGVzW3ByaW1hcnlNYXRjaGVzLmxlbmd0aCAtIDFdLnRleHRDb250ZW50KS50b0JlICdqcydcbiAgICAgICAgIyBVc2UgYHRvQmVHcmVhdGVyVGhhbmAgYmVjYXVzZSBkaXIgbWF5IGhhdmUgc29tZSBjaGFyYWN0ZXJzIGluIGl0XG4gICAgICAgIGV4cGVjdChzZWNvbmRhcnlNYXRjaGVzLmxlbmd0aCkudG9CZUdyZWF0ZXJUaGFuIDFcbiAgICAgICAgZXhwZWN0KHNlY29uZGFyeU1hdGNoZXNbc2Vjb25kYXJ5TWF0Y2hlcy5sZW5ndGggLSAxXS50ZXh0Q29udGVudCkudG9CZSAnanMnXG5cbiAgICBpdCBcImhpZ2hsaWdodHMgbWF0Y2hlcyBpbiB0aGUgZGlyZWN0b3J5IGFuZCBmaWxlIG5hbWVcIiwgLT5cbiAgICAgIHNweU9uKGJ1ZmZlclZpZXcsIFwicHJvamVjdFJlbGF0aXZlUGF0aHNGb3JGaWxlUGF0aHNcIikuYW5kQ2FsbEZha2UgKHBhdGhzKSAtPiBwYXRoc1xuICAgICAgYnVmZmVyVmlldy5zZWxlY3RMaXN0Vmlldy5yZWZzLnF1ZXJ5RWRpdG9yLnNldFRleHQoJ3Jvb3QtZGlyc2FtcGxlJylcblxuICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgIGJ1ZmZlclZpZXcuc2V0SXRlbXMoW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGZpbGVQYXRoOiAnL3Rlc3Qvcm9vdC1kaXIxL3NhbXBsZS5qcydcbiAgICAgICAgICAgIHByb2plY3RSZWxhdGl2ZVBhdGg6ICdyb290LWRpcjEvc2FtcGxlLmpzJ1xuICAgICAgICAgIH1cbiAgICAgICAgXSlcblxuICAgICAgcnVucyAtPlxuICAgICAgICByZXN1bHRWaWV3ID0gYnVmZmVyVmlldy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2xpJylcbiAgICAgICAgcHJpbWFyeU1hdGNoZXMgPSByZXN1bHRWaWV3LnF1ZXJ5U2VsZWN0b3JBbGwoJy5wcmltYXJ5LWxpbmUgLmNoYXJhY3Rlci1tYXRjaCcpXG4gICAgICAgIHNlY29uZGFyeU1hdGNoZXMgPSByZXN1bHRWaWV3LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zZWNvbmRhcnktbGluZSAuY2hhcmFjdGVyLW1hdGNoJylcbiAgICAgICAgZXhwZWN0KHByaW1hcnlNYXRjaGVzLmxlbmd0aCkudG9CZSAxXG4gICAgICAgIGV4cGVjdChwcmltYXJ5TWF0Y2hlc1twcmltYXJ5TWF0Y2hlcy5sZW5ndGggLSAxXS50ZXh0Q29udGVudCkudG9CZSAnc2FtcGxlJ1xuICAgICAgICBleHBlY3Qoc2Vjb25kYXJ5TWF0Y2hlcy5sZW5ndGgpLnRvQmUgMlxuICAgICAgICBleHBlY3Qoc2Vjb25kYXJ5TWF0Y2hlc1swXS50ZXh0Q29udGVudCkudG9CZSAncm9vdC1kaXInXG4gICAgICAgIGV4cGVjdChzZWNvbmRhcnlNYXRjaGVzW3NlY29uZGFyeU1hdGNoZXMubGVuZ3RoIC0gMV0udGV4dENvbnRlbnQpLnRvQmUgJ3NhbXBsZSdcblxuICAgIGRlc2NyaWJlIFwid2hlbiB0aGUgZmlsdGVyIHRleHQgZG9lc24ndCBoYXZlIGEgZmlsZSBwYXRoXCIsIC0+XG4gICAgICBpdCBcIm1vdmVzIHRoZSBjdXJzb3IgaW4gdGhlIGFjdGl2ZSBlZGl0b3IgdG8gdGhhdCBsaW5lIG51bWJlclwiLCAtPlxuICAgICAgICBbZWRpdG9yMSwgZWRpdG9yMl0gPSBhdG9tLndvcmtzcGFjZS5nZXRUZXh0RWRpdG9ycygpXG5cbiAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3Blbignc2FtcGxlLmpzJylcblxuICAgICAgICBydW5zIC0+XG4gICAgICAgICAgZXhwZWN0KGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKSkudG9CZSBlZGl0b3IxXG5cbiAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgICAgYnVmZmVyVmlldy50b2dnbGUoKVxuXG4gICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICBleHBlY3QoYXRvbS53b3Jrc3BhY2UucGFuZWxGb3JJdGVtKGJ1ZmZlclZpZXcpLmlzVmlzaWJsZSgpKS50b0JlIHRydWVcbiAgICAgICAgICBidWZmZXJWaWV3LnNlbGVjdExpc3RWaWV3LnJlZnMucXVlcnlFZGl0b3IuaW5zZXJ0VGV4dCgnOjQnKVxuXG4gICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICAgIGdldE9yU2NoZWR1bGVVcGRhdGVQcm9taXNlKClcblxuICAgICAgICBydW5zIC0+XG4gICAgICAgICAgZXhwZWN0KGJ1ZmZlclZpZXcuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdsaScpLmxlbmd0aCkudG9CZSAwXG4gICAgICAgICAgc3B5T24oYnVmZmVyVmlldywgJ21vdmVUb0xpbmUnKS5hbmRDYWxsVGhyb3VnaCgpXG4gICAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCBidWZmZXJWaWV3LmVsZW1lbnQsICdjb3JlOmNvbmZpcm0nXG5cbiAgICAgICAgd2FpdHNGb3IgLT5cbiAgICAgICAgICBidWZmZXJWaWV3Lm1vdmVUb0xpbmUuY2FsbENvdW50ID4gMFxuXG4gICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICBleHBlY3QoYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpKS50b0JlIGVkaXRvcjFcbiAgICAgICAgICBleHBlY3QoZWRpdG9yMS5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpKS50b0VxdWFsIFszLCA0XVxuXG4gICAgZGVzY3JpYmUgXCJ3aGVuIHNwbGl0dGluZyBwYW5lc1wiLCAtPlxuICAgICAgaXQgXCJvcGVucyB0aGUgc2VsZWN0ZWQgcGF0aCB0byB0aGF0IGxpbmUgbnVtYmVyIGluIGEgbmV3IHBhbmVcIiwgLT5cbiAgICAgICAgW2VkaXRvcjEsIGVkaXRvcjJdID0gYXRvbS53b3Jrc3BhY2UuZ2V0VGV4dEVkaXRvcnMoKVxuXG4gICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oJ3NhbXBsZS5qcycpXG5cbiAgICAgICAgcnVucyAtPlxuICAgICAgICAgIGV4cGVjdChhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCkpLnRvQmUgZWRpdG9yMVxuXG4gICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICAgIGJ1ZmZlclZpZXcudG9nZ2xlKClcblxuICAgICAgICBydW5zIC0+XG4gICAgICAgICAgZXhwZWN0KGF0b20ud29ya3NwYWNlLnBhbmVsRm9ySXRlbShidWZmZXJWaWV3KS5pc1Zpc2libGUoKSkudG9CZSB0cnVlXG4gICAgICAgICAgYnVmZmVyVmlldy5zZWxlY3RMaXN0Vmlldy5yZWZzLnF1ZXJ5RWRpdG9yLmluc2VydFRleHQoJzo0JylcblxuICAgICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgICBnZXRPclNjaGVkdWxlVXBkYXRlUHJvbWlzZSgpXG5cbiAgICAgICAgcnVucyAtPlxuICAgICAgICAgIGV4cGVjdChidWZmZXJWaWV3LmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnbGknKS5sZW5ndGgpLnRvQmUgMFxuICAgICAgICAgIHNweU9uKGJ1ZmZlclZpZXcsICdtb3ZlVG9MaW5lJykuYW5kQ2FsbFRocm91Z2goKVxuICAgICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2ggYnVmZmVyVmlldy5lbGVtZW50LCAncGFuZTpzcGxpdC1sZWZ0J1xuXG4gICAgICAgIHdhaXRzRm9yIC0+XG4gICAgICAgICAgYnVmZmVyVmlldy5tb3ZlVG9MaW5lLmNhbGxDb3VudCA+IDBcblxuICAgICAgICBydW5zIC0+XG4gICAgICAgICAgZXhwZWN0KGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKSkubm90LnRvQmUgZWRpdG9yMVxuICAgICAgICAgIGV4cGVjdChhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCkuZ2V0UGF0aCgpKS50b0JlIGVkaXRvcjEuZ2V0UGF0aCgpXG4gICAgICAgICAgZXhwZWN0KGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKS5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpKS50b0VxdWFsIFszLCA0XVxuXG4gIGRlc2NyaWJlIFwicHJlc2VydmUgbGFzdCBzZWFyY2hcIiwgLT5cbiAgICBpdCBcImRvZXMgbm90IHByZXNlcnZlIGxhc3Qgc2VhcmNoIGJ5IGRlZmF1bHRcIiwgLT5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICBwcm9qZWN0Vmlldy50b2dnbGUoKVxuXG4gICAgICBydW5zIC0+XG4gICAgICAgIGV4cGVjdChhdG9tLndvcmtzcGFjZS5wYW5lbEZvckl0ZW0ocHJvamVjdFZpZXcpLmlzVmlzaWJsZSgpKS50b0JlIHRydWVcbiAgICAgICAgYnVmZmVyVmlldy5zZWxlY3RMaXN0Vmlldy5yZWZzLnF1ZXJ5RWRpdG9yLmluc2VydFRleHQoJ3RoaXMgc2hvdWxkIG5vdCBzaG93IHVwIG5leHQgdGltZSB3ZSBvcGVuIGZpbmRlcicpXG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICBwcm9qZWN0Vmlldy50b2dnbGUoKVxuXG4gICAgICBydW5zIC0+XG4gICAgICAgIGV4cGVjdChhdG9tLndvcmtzcGFjZS5wYW5lbEZvckl0ZW0ocHJvamVjdFZpZXcpLmlzVmlzaWJsZSgpKS50b0JlIGZhbHNlXG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICBwcm9qZWN0Vmlldy50b2dnbGUoKVxuXG4gICAgICBydW5zIC0+XG4gICAgICAgIGV4cGVjdChhdG9tLndvcmtzcGFjZS5wYW5lbEZvckl0ZW0ocHJvamVjdFZpZXcpLmlzVmlzaWJsZSgpKS50b0JlIHRydWVcbiAgICAgICAgZXhwZWN0KHByb2plY3RWaWV3LnNlbGVjdExpc3RWaWV3LmdldFF1ZXJ5KCkpLnRvQmUgJydcblxuICAgIGl0IFwicHJlc2VydmVzIGxhc3Qgc2VhcmNoIHdoZW4gdGhlIGNvbmZpZyBpcyBzZXRcIiwgLT5cbiAgICAgIGF0b20uY29uZmlnLnNldChcImZ1enp5LWZpbmRlci5wcmVzZXJ2ZUxhc3RTZWFyY2hcIiwgdHJ1ZSlcblxuICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgIHByb2plY3RWaWV3LnRvZ2dsZSgpXG5cbiAgICAgIHJ1bnMgLT5cbiAgICAgICAgZXhwZWN0KGF0b20ud29ya3NwYWNlLnBhbmVsRm9ySXRlbShwcm9qZWN0VmlldykuaXNWaXNpYmxlKCkpLnRvQmUgdHJ1ZVxuICAgICAgICBwcm9qZWN0Vmlldy5zZWxlY3RMaXN0Vmlldy5yZWZzLnF1ZXJ5RWRpdG9yLmluc2VydFRleHQoJ3RoaXMgc2hvdWxkIHNob3cgdXAgbmV4dCB0aW1lIHdlIG9wZW4gZmluZGVyJylcblxuICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgIHByb2plY3RWaWV3LnRvZ2dsZSgpXG5cbiAgICAgIHJ1bnMgLT5cbiAgICAgICAgZXhwZWN0KGF0b20ud29ya3NwYWNlLnBhbmVsRm9ySXRlbShwcm9qZWN0VmlldykuaXNWaXNpYmxlKCkpLnRvQmUgZmFsc2VcblxuICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgIHByb2plY3RWaWV3LnRvZ2dsZSgpXG5cbiAgICAgIHJ1bnMgLT5cbiAgICAgICAgZXhwZWN0KGF0b20ud29ya3NwYWNlLnBhbmVsRm9ySXRlbShwcm9qZWN0VmlldykuaXNWaXNpYmxlKCkpLnRvQmUgdHJ1ZVxuICAgICAgICBleHBlY3QocHJvamVjdFZpZXcuc2VsZWN0TGlzdFZpZXcuZ2V0UXVlcnkoKSkudG9CZSAndGhpcyBzaG91bGQgc2hvdyB1cCBuZXh0IHRpbWUgd2Ugb3BlbiBmaW5kZXInXG4gICAgICAgIGV4cGVjdChwcm9qZWN0Vmlldy5zZWxlY3RMaXN0Vmlldy5yZWZzLnF1ZXJ5RWRpdG9yLmdldFNlbGVjdGVkVGV4dCgpKS50b0JlICd0aGlzIHNob3VsZCBzaG93IHVwIG5leHQgdGltZSB3ZSBvcGVuIGZpbmRlcidcblxuICBkZXNjcmliZSBcImZpbGUgaWNvbnNcIiwgLT5cbiAgICBmaWxlSWNvbnMgPSBuZXcgRGVmYXVsdEZpbGVJY29uc1xuXG4gICAgaXQgXCJkZWZhdWx0cyB0byB0ZXh0XCIsIC0+XG4gICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3Blbignc2FtcGxlLmpzJylcblxuICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgIGJ1ZmZlclZpZXcudG9nZ2xlKClcblxuICAgICAgcnVucyAtPlxuICAgICAgICBleHBlY3QoYXRvbS53b3Jrc3BhY2UucGFuZWxGb3JJdGVtKGJ1ZmZlclZpZXcpLmlzVmlzaWJsZSgpKS50b0JlIHRydWVcbiAgICAgICAgYnVmZmVyVmlldy5zZWxlY3RMaXN0Vmlldy5yZWZzLnF1ZXJ5RWRpdG9yLmluc2VydFRleHQoJ2pzJylcblxuICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgIGdldE9yU2NoZWR1bGVVcGRhdGVQcm9taXNlKClcblxuICAgICAgcnVucyAtPlxuICAgICAgICBmaXJzdFJlc3VsdCA9IGJ1ZmZlclZpZXcuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdsaSAucHJpbWFyeS1saW5lJylcbiAgICAgICAgZXhwZWN0KGZpbGVJY29ucy5pY29uQ2xhc3NGb3JQYXRoKGZpcnN0UmVzdWx0LmRhdGFzZXQucGF0aCkpLnRvQmUgJ2ljb24tZmlsZS10ZXh0J1xuXG4gICAgaXQgXCJzaG93cyBpbWFnZSBpY29uc1wiLCAtPlxuICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oJ3NhbXBsZS5naWYnKVxuXG4gICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgYnVmZmVyVmlldy50b2dnbGUoKVxuXG4gICAgICBydW5zIC0+XG4gICAgICAgIGV4cGVjdChhdG9tLndvcmtzcGFjZS5wYW5lbEZvckl0ZW0oYnVmZmVyVmlldykuaXNWaXNpYmxlKCkpLnRvQmUgdHJ1ZVxuICAgICAgICBidWZmZXJWaWV3LnNlbGVjdExpc3RWaWV3LnJlZnMucXVlcnlFZGl0b3IuaW5zZXJ0VGV4dCgnZ2lmJylcblxuICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgIGdldE9yU2NoZWR1bGVVcGRhdGVQcm9taXNlKClcblxuICAgICAgcnVucyAtPlxuICAgICAgICBmaXJzdFJlc3VsdCA9IGJ1ZmZlclZpZXcuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCdsaSAucHJpbWFyeS1saW5lJylcbiAgICAgICAgZXhwZWN0KGZpbGVJY29ucy5pY29uQ2xhc3NGb3JQYXRoKGZpcnN0UmVzdWx0LmRhdGFzZXQucGF0aCkpLnRvQmUgJ2ljb24tZmlsZS1tZWRpYSdcblxuICBkZXNjcmliZSBcIkdpdCBpbnRlZ3JhdGlvblwiLCAtPlxuICAgIFtwcm9qZWN0UGF0aCwgZ2l0UmVwb3NpdG9yeSwgZ2l0RGlyZWN0b3J5XSA9IFtdXG5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBwcm9qZWN0UGF0aCA9IGF0b20ucHJvamVjdC5nZXREaXJlY3RvcmllcygpWzBdLnJlc29sdmUoJ2dpdC93b3JraW5nLWRpcicpXG4gICAgICBmcy5tb3ZlU3luYyhwYXRoLmpvaW4ocHJvamVjdFBhdGgsICdnaXQuZ2l0JyksIHBhdGguam9pbihwcm9qZWN0UGF0aCwgJy5naXQnKSlcbiAgICAgIGF0b20ucHJvamVjdC5zZXRQYXRocyhbcm9vdERpcjIsIHByb2plY3RQYXRoXSlcblxuICAgICAgZ2l0RGlyZWN0b3J5ID0gYXRvbS5wcm9qZWN0LmdldERpcmVjdG9yaWVzKClbMV1cbiAgICAgIGdpdFJlcG9zaXRvcnkgPSBhdG9tLnByb2plY3QuZ2V0UmVwb3NpdG9yaWVzKClbMV1cblxuICAgIGRlc2NyaWJlIFwiZ2l0LXN0YXR1cy1maW5kZXIgYmVoYXZpb3JcIiwgLT5cbiAgICAgIFtvcmlnaW5hbFRleHQsIG9yaWdpbmFsUGF0aCwgbmV3UGF0aF0gPSBbXVxuXG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIGphc21pbmUuYXR0YWNoVG9ET00od29ya3NwYWNlRWxlbWVudClcblxuICAgICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKHBhdGguam9pbihwcm9qZWN0UGF0aCwgJ2EudHh0JykpXG5cbiAgICAgICAgcnVucyAtPlxuICAgICAgICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgICAgICAgIG9yaWdpbmFsVGV4dCA9IGVkaXRvci5nZXRUZXh0KClcbiAgICAgICAgICBvcmlnaW5hbFBhdGggPSBlZGl0b3IuZ2V0UGF0aCgpXG4gICAgICAgICAgZnMud3JpdGVGaWxlU3luYyhvcmlnaW5hbFBhdGgsICdtYWtpbmcgYSBjaGFuZ2UgZm9yIHRoZSBiZXR0ZXInKVxuICAgICAgICAgIGdpdFJlcG9zaXRvcnkuZ2V0UGF0aFN0YXR1cyhvcmlnaW5hbFBhdGgpXG5cbiAgICAgICAgICBuZXdQYXRoID0gYXRvbS5wcm9qZWN0LmdldERpcmVjdG9yaWVzKClbMV0ucmVzb2x2ZSgnbmV3c2FtcGxlLmpzJylcbiAgICAgICAgICBmcy53cml0ZUZpbGVTeW5jKG5ld1BhdGgsICcnKVxuICAgICAgICAgIGdpdFJlcG9zaXRvcnkuZ2V0UGF0aFN0YXR1cyhuZXdQYXRoKVxuXG4gICAgICBpdCBcImRpc3BsYXlzIGFsbCBuZXcgYW5kIG1vZGlmaWVkIHBhdGhzXCIsIC0+XG4gICAgICAgIGV4cGVjdChhdG9tLndvcmtzcGFjZS5wYW5lbEZvckl0ZW0oZ2l0U3RhdHVzVmlldykpLnRvQmVOdWxsKClcbiAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgICAgZ2l0U3RhdHVzVmlldy50b2dnbGUoKVxuXG4gICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICBleHBlY3QoYXRvbS53b3Jrc3BhY2UucGFuZWxGb3JJdGVtKGdpdFN0YXR1c1ZpZXcpLmlzVmlzaWJsZSgpKS50b0JlIHRydWVcbiAgICAgICAgICBleHBlY3QoZ2l0U3RhdHVzVmlldy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5maWxlJykubGVuZ3RoKS50b0JlIDJcbiAgICAgICAgICBleHBlY3QoZ2l0U3RhdHVzVmlldy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zdGF0dXMuc3RhdHVzLW1vZGlmaWVkJykubGVuZ3RoKS50b0JlIDFcbiAgICAgICAgICBleHBlY3QoZ2l0U3RhdHVzVmlldy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zdGF0dXMuc3RhdHVzLWFkZGVkJykubGVuZ3RoKS50b0JlIDFcblxuICAgIGRlc2NyaWJlIFwic3RhdHVzIGRlY29yYXRpb25zXCIsIC0+XG4gICAgICBbb3JpZ2luYWxUZXh0LCBvcmlnaW5hbFBhdGgsIGVkaXRvciwgbmV3UGF0aF0gPSBbXVxuXG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIGphc21pbmUuYXR0YWNoVG9ET00od29ya3NwYWNlRWxlbWVudClcblxuICAgICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKHBhdGguam9pbihwcm9qZWN0UGF0aCwgJ2EudHh0JykpXG5cbiAgICAgICAgcnVucyAtPlxuICAgICAgICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgICAgICAgIG9yaWdpbmFsVGV4dCA9IGVkaXRvci5nZXRUZXh0KClcbiAgICAgICAgICBvcmlnaW5hbFBhdGggPSBlZGl0b3IuZ2V0UGF0aCgpXG4gICAgICAgICAgbmV3UGF0aCA9IGdpdERpcmVjdG9yeS5yZXNvbHZlKCduZXdzYW1wbGUuanMnKVxuICAgICAgICAgIGZzLndyaXRlRmlsZVN5bmMobmV3UGF0aCwgJycpXG4gICAgICAgICAgZnMud3JpdGVGaWxlU3luYyhvcmlnaW5hbFBhdGgsICdhIGNoYW5nZScpXG5cbiAgICAgIGRlc2NyaWJlIFwid2hlbiBhIG1vZGlmaWVkIGZpbGUgaXMgc2hvd24gaW4gdGhlIGxpc3RcIiwgLT5cbiAgICAgICAgaXQgXCJkaXNwbGF5cyB0aGUgbW9kaWZpZWQgaWNvblwiLCAtPlxuICAgICAgICAgIGdpdFJlcG9zaXRvcnkuZ2V0UGF0aFN0YXR1cyhlZGl0b3IuZ2V0UGF0aCgpKVxuXG4gICAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgICAgICBidWZmZXJWaWV3LnRvZ2dsZSgpXG5cbiAgICAgICAgICBydW5zIC0+XG4gICAgICAgICAgICBleHBlY3QoYnVmZmVyVmlldy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zdGF0dXMuc3RhdHVzLW1vZGlmaWVkJykubGVuZ3RoKS50b0JlIDFcbiAgICAgICAgICAgIGV4cGVjdChidWZmZXJWaWV3LmVsZW1lbnQucXVlcnlTZWxlY3RvcignLnN0YXR1cy5zdGF0dXMtbW9kaWZpZWQnKS5jbG9zZXN0KCdsaScpLnF1ZXJ5U2VsZWN0b3IoJy5maWxlJykudGV4dENvbnRlbnQpLnRvQmUgJ2EudHh0J1xuXG4gICAgICBkZXNjcmliZSBcIndoZW4gYSBuZXcgZmlsZSBpcyBzaG93biBpbiB0aGUgbGlzdFwiLCAtPlxuICAgICAgICBpdCBcImRpc3BsYXlzIHRoZSBuZXcgaWNvblwiLCAtPlxuICAgICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbihwYXRoLmpvaW4ocHJvamVjdFBhdGgsICduZXdzYW1wbGUuanMnKSlcblxuICAgICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICAgIGdpdFJlcG9zaXRvcnkuZ2V0UGF0aFN0YXR1cyhlZGl0b3IuZ2V0UGF0aCgpKVxuXG4gICAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgICAgICBidWZmZXJWaWV3LnRvZ2dsZSgpXG5cbiAgICAgICAgICBydW5zIC0+XG4gICAgICAgICAgICBleHBlY3QoYnVmZmVyVmlldy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zdGF0dXMuc3RhdHVzLWFkZGVkJykubGVuZ3RoKS50b0JlIDFcbiAgICAgICAgICAgIGV4cGVjdChidWZmZXJWaWV3LmVsZW1lbnQucXVlcnlTZWxlY3RvcignLnN0YXR1cy5zdGF0dXMtYWRkZWQnKS5jbG9zZXN0KCdsaScpLnF1ZXJ5U2VsZWN0b3IoJy5maWxlJykudGV4dENvbnRlbnQpLnRvQmUgJ25ld3NhbXBsZS5qcydcblxuICAgIGRlc2NyaWJlIFwid2hlbiBjb3JlLmV4Y2x1ZGVWY3NJZ25vcmVkUGF0aHMgaXMgc2V0IHRvIHRydWVcIiwgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgYXRvbS5jb25maWcuc2V0KFwiY29yZS5leGNsdWRlVmNzSWdub3JlZFBhdGhzXCIsIHRydWUpXG5cbiAgICAgIGRlc2NyaWJlIFwid2hlbiB0aGUgcHJvamVjdCdzIHBhdGggaXMgdGhlIHJlcG9zaXRvcnkncyB3b3JraW5nIGRpcmVjdG9yeVwiLCAtPlxuICAgICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgICAgaWdub3JlRmlsZSA9IHBhdGguam9pbihwcm9qZWN0UGF0aCwgJy5naXRpZ25vcmUnKVxuICAgICAgICAgIGZzLndyaXRlRmlsZVN5bmMoaWdub3JlRmlsZSwgJ2lnbm9yZWQudHh0JylcblxuICAgICAgICAgIGlnbm9yZWRGaWxlID0gcGF0aC5qb2luKHByb2plY3RQYXRoLCAnaWdub3JlZC50eHQnKVxuICAgICAgICAgIGZzLndyaXRlRmlsZVN5bmMoaWdub3JlZEZpbGUsICdpZ25vcmVkIHRleHQnKVxuXG4gICAgICAgIGl0IFwiZXhjbHVkZXMgcGF0aHMgdGhhdCBhcmUgZ2l0IGlnbm9yZWRcIiwgLT5cbiAgICAgICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgICAgIHByb2plY3RWaWV3LnRvZ2dsZSgpXG5cbiAgICAgICAgICBydW5zIC0+XG4gICAgICAgICAgICB3YWl0Rm9yUGF0aHNUb0Rpc3BsYXkocHJvamVjdFZpZXcpXG5cbiAgICAgICAgICBydW5zIC0+XG4gICAgICAgICAgICBleHBlY3QoQXJyYXkuZnJvbShwcm9qZWN0Vmlldy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2xpJykpLmZpbmQoKGEpIC0+IGEudGV4dENvbnRlbnQuaW5jbHVkZXMoXCJpZ25vcmVkLnR4dFwiKSkpLm5vdC50b0JlRGVmaW5lZCgpXG5cbiAgICAgIGRlc2NyaWJlIFwid2hlbiB0aGUgcHJvamVjdCdzIHBhdGggaXMgYSBzdWJmb2xkZXIgb2YgdGhlIHJlcG9zaXRvcnkncyB3b3JraW5nIGRpcmVjdG9yeVwiLCAtPlxuICAgICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgICAgYXRvbS5wcm9qZWN0LnNldFBhdGhzKFtnaXREaXJlY3RvcnkucmVzb2x2ZSgnZGlyJyldKVxuICAgICAgICAgIGlnbm9yZUZpbGUgPSBwYXRoLmpvaW4ocHJvamVjdFBhdGgsICcuZ2l0aWdub3JlJylcbiAgICAgICAgICBmcy53cml0ZUZpbGVTeW5jKGlnbm9yZUZpbGUsICdiLnR4dCcpXG5cbiAgICAgICAgaXQgXCJkb2VzIG5vdCBleGNsdWRlIHBhdGhzIHRoYXQgYXJlIGdpdCBpZ25vcmVkXCIsIC0+XG4gICAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgICAgICBwcm9qZWN0Vmlldy50b2dnbGUoKVxuXG4gICAgICAgICAgcnVucyAtPlxuICAgICAgICAgICAgd2FpdEZvclBhdGhzVG9EaXNwbGF5KHByb2plY3RWaWV3KVxuXG4gICAgICAgICAgcnVucyAtPlxuICAgICAgICAgICAgZXhwZWN0KEFycmF5LmZyb20ocHJvamVjdFZpZXcuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdsaScpKS5maW5kKChhKSAtPiBhLnRleHRDb250ZW50LmluY2x1ZGVzKFwiYi50eHRcIikpKS50b0JlRGVmaW5lZCgpXG5cbiAgICAgIGRlc2NyaWJlIFwid2hlbiB0aGUgLmdpdGlnbm9yZSBtYXRjaGVzIHBhcnRzIG9mIHRoZSBwYXRoIHRvIHRoZSByb290IGZvbGRlclwiLCAtPlxuICAgICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgICAgaWdub3JlRmlsZSA9IHBhdGguam9pbihwcm9qZWN0UGF0aCwgJy5naXRpZ25vcmUnKVxuICAgICAgICAgIGZzLndyaXRlRmlsZVN5bmMoaWdub3JlRmlsZSwgcGF0aC5iYXNlbmFtZShwcm9qZWN0UGF0aCkpXG5cbiAgICAgICAgaXQgXCJvbmx5IGFwcGxpZXMgdGhlIC5naXRpZ25vcmUgcGF0dGVybnMgdG8gcmVsYXRpdmUgcGF0aHMgd2l0aGluIHRoZSByb290IGZvbGRlclwiLCAtPlxuICAgICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICAgICAgcHJvamVjdFZpZXcudG9nZ2xlKClcblxuICAgICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICAgIHdhaXRGb3JQYXRoc1RvRGlzcGxheShwcm9qZWN0VmlldylcblxuICAgICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICAgIGV4cGVjdChBcnJheS5mcm9tKHByb2plY3RWaWV3LmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnbGknKSkuZmluZCgoYSkgLT4gYS50ZXh0Q29udGVudC5pbmNsdWRlcyhcImZpbGUudHh0XCIpKSkudG9CZURlZmluZWQoKVxuIl19
