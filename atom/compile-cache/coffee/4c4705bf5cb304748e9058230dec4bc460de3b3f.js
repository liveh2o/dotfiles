(function() {
  var $, TabBarView, TabView, View, buildDragEvents, buildWheelEvent, buildWheelPlusShiftEvent, path, temp, triggerMouseEvent, _, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $ = _ref.$, View = _ref.View;

  _ = require('underscore-plus');

  path = require('path');

  temp = require('temp');

  TabBarView = require('../lib/tab-bar-view');

  TabView = require('../lib/tab-view');

  _ref1 = require("./event-helpers"), triggerMouseEvent = _ref1.triggerMouseEvent, buildDragEvents = _ref1.buildDragEvents, buildWheelEvent = _ref1.buildWheelEvent, buildWheelPlusShiftEvent = _ref1.buildWheelPlusShiftEvent;

  describe("Tabs package main", function() {
    var workspaceElement;
    workspaceElement = null;
    beforeEach(function() {
      workspaceElement = atom.views.getView(atom.workspace);
      waitsForPromise(function() {
        return atom.workspace.open('sample.js');
      });
      return waitsForPromise(function() {
        return atom.packages.activatePackage("tabs");
      });
    });
    describe(".activate()", function() {
      return it("appends a tab bar all existing and new panes", function() {
        var pane;
        expect(workspaceElement.querySelectorAll('.pane').length).toBe(1);
        expect(workspaceElement.querySelectorAll('.pane > .tab-bar').length).toBe(1);
        pane = atom.workspace.getActivePane();
        pane.splitRight();
        expect(workspaceElement.querySelectorAll('.pane').length).toBe(2);
        return expect(workspaceElement.querySelectorAll('.pane > .tab-bar').length).toBe(2);
      });
    });
    return describe(".deactivate()", function() {
      it("removes all tab bar views and stops adding them to new panes", function() {
        var pane;
        pane = atom.workspace.getActivePane();
        pane.splitRight();
        expect(workspaceElement.querySelectorAll('.pane').length).toBe(2);
        expect(workspaceElement.querySelectorAll('.pane > .tab-bar').length).toBe(2);
        atom.packages.deactivatePackage('tabs');
        expect(workspaceElement.querySelectorAll('.pane').length).toBe(2);
        expect(workspaceElement.querySelectorAll('.pane > .tab-bar').length).toBe(0);
        pane.splitRight();
        expect(workspaceElement.querySelectorAll('.pane').length).toBe(3);
        return expect(workspaceElement.querySelectorAll('.pane > .tab-bar').length).toBe(0);
      });
      return it("serializes preview tab state", function() {
        atom.config.set('tabs.usePreviewTabs', true);
        waitsForPromise(function() {
          return atom.workspace.open('sample.txt');
        });
        runs(function() {
          var _ref2;
          expect(workspaceElement.querySelectorAll('.tab.preview-tab .title').length).toBe(1);
          expect((_ref2 = workspaceElement.querySelector('.tab.preview-tab .title')) != null ? _ref2.textContent : void 0).toBe('sample.txt');
          atom.packages.deactivatePackage('tabs');
          return expect(workspaceElement.querySelectorAll('.tab.preview-tab .title').length).toBe(0);
        });
        waitsForPromise(function() {
          return atom.packages.activatePackage('tabs');
        });
        return runs(function() {
          var _ref2;
          expect(workspaceElement.querySelectorAll('.tab.preview-tab .title').length).toBe(1);
          return expect((_ref2 = workspaceElement.querySelector('.tab.preview-tab .title')) != null ? _ref2.textContent : void 0).toBe('sample.txt');
        });
      });
    });
  });

  describe("TabBarView", function() {
    var TestView, deserializerDisposable, editor1, item1, item2, pane, tabBar, _ref2;
    _ref2 = [], deserializerDisposable = _ref2[0], item1 = _ref2[1], item2 = _ref2[2], editor1 = _ref2[3], pane = _ref2[4], tabBar = _ref2[5];
    TestView = (function(_super) {
      __extends(TestView, _super);

      function TestView() {
        return TestView.__super__.constructor.apply(this, arguments);
      }

      TestView.deserialize = function(_arg) {
        var iconName, longTitle, title;
        title = _arg.title, longTitle = _arg.longTitle, iconName = _arg.iconName;
        return new TestView(title, longTitle, iconName);
      };

      TestView.content = function(title) {
        return this.div(title);
      };

      TestView.prototype.initialize = function(title, longTitle, iconName) {
        this.title = title;
        this.longTitle = longTitle;
        this.iconName = iconName;
      };

      TestView.prototype.getTitle = function() {
        return this.title;
      };

      TestView.prototype.getLongTitle = function() {
        return this.longTitle;
      };

      TestView.prototype.getIconName = function() {
        return this.iconName;
      };

      TestView.prototype.serialize = function() {
        return {
          deserializer: 'TestView',
          title: this.title,
          longTitle: this.longTitle,
          iconName: this.iconName
        };
      };

      TestView.prototype.onDidChangeTitle = function(callback) {
        if (this.titleCallbacks == null) {
          this.titleCallbacks = [];
        }
        this.titleCallbacks.push(callback);
        return {
          dispose: (function(_this) {
            return function() {
              return _.remove(_this.titleCallbacks, callback);
            };
          })(this)
        };
      };

      TestView.prototype.emitTitleChanged = function() {
        var callback, _i, _len, _ref3, _ref4, _results;
        _ref4 = (_ref3 = this.titleCallbacks) != null ? _ref3 : [];
        _results = [];
        for (_i = 0, _len = _ref4.length; _i < _len; _i++) {
          callback = _ref4[_i];
          _results.push(callback());
        }
        return _results;
      };

      TestView.prototype.onDidChangeIcon = function(callback) {
        if (this.iconCallbacks == null) {
          this.iconCallbacks = [];
        }
        this.iconCallbacks.push(callback);
        return {
          dispose: (function(_this) {
            return function() {
              return _.remove(_this.iconCallbacks, callback);
            };
          })(this)
        };
      };

      TestView.prototype.emitIconChanged = function() {
        var callback, _i, _len, _ref3, _ref4, _results;
        _ref4 = (_ref3 = this.iconCallbacks) != null ? _ref3 : [];
        _results = [];
        for (_i = 0, _len = _ref4.length; _i < _len; _i++) {
          callback = _ref4[_i];
          _results.push(callback());
        }
        return _results;
      };

      TestView.prototype.onDidChangeModified = function() {
        return {
          dispose: function() {}
        };
      };

      return TestView;

    })(View);
    beforeEach(function() {
      deserializerDisposable = atom.deserializers.add(TestView);
      item1 = new TestView('Item 1', void 0, "squirrel");
      item2 = new TestView('Item 2');
      waitsForPromise(function() {
        return atom.workspace.open('sample.js');
      });
      return runs(function() {
        editor1 = atom.workspace.getActiveTextEditor();
        pane = atom.workspace.getActivePane();
        pane.addItem(item1, 0);
        pane.addItem(item2, 2);
        pane.activateItem(item2);
        tabBar = new TabBarView;
        return tabBar.initialize(pane);
      });
    });
    afterEach(function() {
      return deserializerDisposable.dispose();
    });
    describe(".initialize(pane)", function() {
      it("creates a tab for each item on the tab bar's parent pane", function() {
        expect(pane.getItems().length).toBe(3);
        expect($(tabBar).find('.tab').length).toBe(3);
        expect($(tabBar).find('.tab:eq(0) .title').text()).toBe(item1.getTitle());
        expect($(tabBar).find('.tab:eq(0) .title')).not.toHaveAttr('data-name');
        expect($(tabBar).find('.tab:eq(0) .title')).not.toHaveAttr('data-path');
        expect($(tabBar).find('.tab:eq(0)')).toHaveAttr('data-type', 'TestView');
        expect($(tabBar).find('.tab:eq(1) .title').text()).toBe(editor1.getTitle());
        expect($(tabBar).find('.tab:eq(1) .title')).toHaveAttr('data-name', path.basename(editor1.getPath()));
        expect($(tabBar).find('.tab:eq(1) .title')).toHaveAttr('data-path', editor1.getPath());
        expect($(tabBar).find('.tab:eq(1)')).toHaveAttr('data-type', 'TextEditor');
        expect($(tabBar).find('.tab:eq(2) .title').text()).toBe(item2.getTitle());
        expect($(tabBar).find('.tab:eq(2) .title')).not.toHaveAttr('data-name');
        expect($(tabBar).find('.tab:eq(2) .title')).not.toHaveAttr('data-path');
        return expect($(tabBar).find('.tab:eq(2)')).toHaveAttr('data-type', 'TestView');
      });
      it("highlights the tab for the active pane item", function() {
        return expect($(tabBar).find('.tab:eq(2)')).toHaveClass('active');
      });
      return it("emits a warning when ::onDid... functions are not valid Disposables", function() {
        var BadView, badItem, warnings;
        BadView = (function(_super) {
          __extends(BadView, _super);

          function BadView() {
            return BadView.__super__.constructor.apply(this, arguments);
          }

          BadView.content = function(title) {
            return this.div(title);
          };

          BadView.prototype.getTitle = function() {
            return "Anything";
          };

          BadView.prototype.onDidChangeTitle = function() {};

          BadView.prototype.onDidChangeIcon = function() {};

          BadView.prototype.onDidChangeModified = function() {};

          BadView.prototype.onDidSave = function() {};

          return BadView;

        })(View);
        warnings = [];
        spyOn(console, "warn").andCallFake(function(message, object) {
          return warnings.push({
            message: message,
            object: object
          });
        });
        badItem = new BadView('Item 3');
        pane.addItem(badItem);
        expect(warnings[0].message).toContain("onDidChangeTitle");
        expect(warnings[0].object).toBe(badItem);
        expect(warnings[1].message).toContain("onDidChangeIcon");
        expect(warnings[1].object).toBe(badItem);
        expect(warnings[2].message).toContain("onDidChangeModified");
        expect(warnings[2].object).toBe(badItem);
        expect(warnings[3].message).toContain("onDidSave");
        return expect(warnings[3].object).toBe(badItem);
      });
    });
    describe("when the active pane item changes", function() {
      return it("highlights the tab for the new active pane item", function() {
        pane.activateItem(item1);
        expect($(tabBar).find('.active').length).toBe(1);
        expect($(tabBar).find('.tab:eq(0)')).toHaveClass('active');
        pane.activateItem(item2);
        expect($(tabBar).find('.active').length).toBe(1);
        return expect($(tabBar).find('.tab:eq(2)')).toHaveClass('active');
      });
    });
    describe("when a new item is added to the pane", function() {
      it("adds a tab for the new item at the same index as the item in the pane", function() {
        var item3;
        pane.activateItem(item1);
        item3 = new TestView('Item 3');
        pane.activateItem(item3);
        expect($(tabBar).find('.tab').length).toBe(4);
        return expect($(tabBar.tabAtIndex(1)).find('.title')).toHaveText('Item 3');
      });
      return it("adds the 'modified' class to the new tab if the item is initially modified", function() {
        var editor2;
        editor2 = null;
        waitsForPromise(function() {
          var opener;
          opener = atom.workspace.buildTextEditor != null ? atom.workspace.open('sample.txt', {
            activateItem: false
          }) : atom.project.open('sample.txt');
          return opener.then(function(o) {
            return editor2 = o;
          });
        });
        return runs(function() {
          editor2.insertText('x');
          pane.activateItem(editor2);
          return expect(tabBar.tabForItem(editor2)).toHaveClass('modified');
        });
      });
    });
    describe("when an item is removed from the pane", function() {
      it("removes the item's tab from the tab bar", function() {
        pane.destroyItem(item2);
        expect(tabBar.getTabs().length).toBe(2);
        return expect($(tabBar).find('.tab:contains(Item 2)')).not.toExist();
      });
      return it("updates the titles of the remaining tabs", function() {
        var item2a;
        expect(tabBar.tabForItem(item2)).toHaveText('Item 2');
        item2.longTitle = '2';
        item2a = new TestView('Item 2');
        item2a.longTitle = '2a';
        pane.activateItem(item2a);
        expect(tabBar.tabForItem(item2)).toHaveText('2');
        expect(tabBar.tabForItem(item2a)).toHaveText('2a');
        pane.destroyItem(item2a);
        return expect(tabBar.tabForItem(item2)).toHaveText('Item 2');
      });
    });
    describe("when a tab is clicked", function() {
      it("shows the associated item on the pane and focuses the pane", function() {
        var event;
        jasmine.attachToDOM(tabBar);
        spyOn(pane, 'activate');
        event = triggerMouseEvent('mousedown', tabBar.tabAtIndex(0), {
          which: 1
        });
        expect(pane.getActiveItem()).toBe(pane.getItems()[0]);
        expect(event.preventDefault).not.toHaveBeenCalled();
        event = triggerMouseEvent('mousedown', tabBar.tabAtIndex(2), {
          which: 1
        });
        expect(pane.getActiveItem()).toBe(pane.getItems()[2]);
        expect(event.preventDefault).not.toHaveBeenCalled();
        waits(1);
        return runs(function() {
          return expect(pane.activate.callCount).toBe(2);
        });
      });
      it("closes the tab when middle clicked", function() {
        var event;
        jasmine.attachToDOM(tabBar);
        event = triggerMouseEvent('mousedown', tabBar.tabForItem(editor1), {
          which: 2
        });
        expect(pane.getItems().length).toBe(2);
        expect(pane.getItems().indexOf(editor1)).toBe(-1);
        expect(editor1.destroyed).toBeTruthy();
        expect(tabBar.getTabs().length).toBe(2);
        expect($(tabBar).find('.tab:contains(sample.js)')).not.toExist();
        return expect(event.preventDefault).toHaveBeenCalled();
      });
      return it("doesn't switch tab when right (or ctrl-left) clicked", function() {
        var event;
        jasmine.attachToDOM(tabBar);
        spyOn(pane, 'activate');
        event = triggerMouseEvent('mousedown', tabBar.tabAtIndex(0), {
          which: 3
        });
        expect(pane.getActiveItem()).not.toBe(pane.getItems()[0]);
        expect(event.preventDefault).toHaveBeenCalled();
        event = triggerMouseEvent('mousedown', tabBar.tabAtIndex(0), {
          which: 1,
          ctrlKey: true
        });
        expect(pane.getActiveItem()).not.toBe(pane.getItems()[0]);
        expect(event.preventDefault).toHaveBeenCalled();
        return expect(pane.activate).not.toHaveBeenCalled();
      });
    });
    describe("when a tab's close icon is clicked", function() {
      return it("destroys the tab's item on the pane", function() {
        jasmine.attachToDOM(tabBar);
        $(tabBar.tabForItem(editor1)).find('.close-icon').click();
        expect(pane.getItems().length).toBe(2);
        expect(pane.getItems().indexOf(editor1)).toBe(-1);
        expect(editor1.destroyed).toBeTruthy();
        expect(tabBar.getTabs().length).toBe(2);
        return expect($(tabBar).find('.tab:contains(sample.js)')).not.toExist();
      });
    });
    describe("when a tab item's title changes", function() {
      return it("updates the title of the item's tab", function() {
        editor1.buffer.setPath('/this/is-a/test.txt');
        return expect(tabBar.tabForItem(editor1)).toHaveText('test.txt');
      });
    });
    describe("when two tabs have the same title", function() {
      return it("displays the long title on the tab if it's available from the item", function() {
        item1.title = "Old Man";
        item1.longTitle = "Grumpy Old Man";
        item1.emitTitleChanged();
        item2.title = "Old Man";
        item2.longTitle = "Jolly Old Man";
        item2.emitTitleChanged();
        expect(tabBar.tabForItem(item1)).toHaveText("Grumpy Old Man");
        expect(tabBar.tabForItem(item2)).toHaveText("Jolly Old Man");
        item2.longTitle = void 0;
        item2.emitTitleChanged();
        expect(tabBar.tabForItem(item1)).toHaveText("Grumpy Old Man");
        return expect(tabBar.tabForItem(item2)).toHaveText("Old Man");
      });
    });
    describe("when an item has an icon defined", function() {
      it("displays the icon on the tab", function() {
        expect($(tabBar).find('.tab:eq(0) .title')).toHaveClass("icon");
        return expect($(tabBar).find('.tab:eq(0) .title')).toHaveClass("icon-squirrel");
      });
      it("hides the icon from the tab if the icon is removed", function() {
        item1.getIconName = null;
        item1.emitIconChanged();
        expect($(tabBar).find('.tab:eq(0) .title')).not.toHaveClass("icon");
        return expect($(tabBar).find('.tab:eq(0) .title')).not.toHaveClass("icon-squirrel");
      });
      it("updates the icon on the tab if the icon is changed", function() {
        item1.getIconName = function() {
          return "zap";
        };
        item1.emitIconChanged();
        expect($(tabBar).find('.tab:eq(0) .title')).toHaveClass("icon");
        return expect($(tabBar).find('.tab:eq(0) .title')).toHaveClass("icon-zap");
      });
      describe("when showIcon is set to true in package settings", function() {
        beforeEach(function() {
          spyOn(tabBar.tabForItem(item1), 'updateIconVisibility').andCallThrough();
          atom.config.set("tabs.showIcons", true);
          waitsFor(function() {
            return tabBar.tabForItem(item1).updateIconVisibility.callCount > 0;
          });
          return runs(function() {
            return tabBar.tabForItem(item1).updateIconVisibility.reset();
          });
        });
        it("doesn't hide the icon", function() {
          return expect($(tabBar).find('.tab:eq(0) .title')).not.toHaveClass("hide-icon");
        });
        return it("hides the icon from the tab when showIcon is changed to false", function() {
          atom.config.set("tabs.showIcons", false);
          waitsFor(function() {
            return tabBar.tabForItem(item1).updateIconVisibility.callCount > 0;
          });
          return runs(function() {
            return expect($(tabBar).find('.tab:eq(0) .title')).toHaveClass("hide-icon");
          });
        });
      });
      return describe("when showIcon is set to false in package settings", function() {
        beforeEach(function() {
          spyOn(tabBar.tabForItem(item1), 'updateIconVisibility').andCallThrough();
          atom.config.set("tabs.showIcons", false);
          waitsFor(function() {
            return tabBar.tabForItem(item1).updateIconVisibility.callCount > 0;
          });
          return runs(function() {
            return tabBar.tabForItem(item1).updateIconVisibility.reset();
          });
        });
        it("hides the icon", function() {
          return expect($(tabBar).find('.tab:eq(0) .title')).toHaveClass("hide-icon");
        });
        return it("shows the icon on the tab when showIcon is changed to true", function() {
          atom.config.set("tabs.showIcons", true);
          waitsFor(function() {
            return tabBar.tabForItem(item1).updateIconVisibility.callCount > 0;
          });
          return expect($(tabBar).find('.tab:eq(0) .title')).not.toHaveClass("hide-icon");
        });
      });
    });
    describe("when the item doesn't have an icon defined", function() {
      it("doesn't display an icon on the tab", function() {
        expect($(tabBar).find('.tab:eq(2) .title')).not.toHaveClass("icon");
        return expect($(tabBar).find('.tab:eq(2) .title')).not.toHaveClass("icon-squirrel");
      });
      return it("shows the icon on the tab if an icon is defined", function() {
        item2.getIconName = function() {
          return "squirrel";
        };
        item2.emitIconChanged();
        expect($(tabBar).find('.tab:eq(2) .title')).toHaveClass("icon");
        return expect($(tabBar).find('.tab:eq(2) .title')).toHaveClass("icon-squirrel");
      });
    });
    describe("when a tab item's modified status changes", function() {
      return it("adds or removes the 'modified' class to the tab based on the status", function() {
        var tab;
        tab = tabBar.tabForItem(editor1);
        expect(editor1.isModified()).toBeFalsy();
        expect(tab).not.toHaveClass('modified');
        editor1.insertText('x');
        advanceClock(editor1.buffer.stoppedChangingDelay);
        expect(editor1.isModified()).toBeTruthy();
        expect(tab).toHaveClass('modified');
        editor1.undo();
        advanceClock(editor1.buffer.stoppedChangingDelay);
        expect(editor1.isModified()).toBeFalsy();
        return expect(tab).not.toHaveClass('modified');
      });
    });
    describe("when a pane item moves to a new index", function() {
      return it("updates the order of the tabs to match the new item order", function() {
        expect(tabBar.getTabs().map(function(tab) {
          return tab.textContent;
        })).toEqual(["Item 1", "sample.js", "Item 2"]);
        pane.moveItem(item2, 1);
        expect(tabBar.getTabs().map(function(tab) {
          return tab.textContent;
        })).toEqual(["Item 1", "Item 2", "sample.js"]);
        pane.moveItem(editor1, 0);
        expect(tabBar.getTabs().map(function(tab) {
          return tab.textContent;
        })).toEqual(["sample.js", "Item 1", "Item 2"]);
        pane.moveItem(item1, 2);
        return expect(tabBar.getTabs().map(function(tab) {
          return tab.textContent;
        })).toEqual(["sample.js", "Item 2", "Item 1"]);
      });
    });
    describe("context menu commands", function() {
      beforeEach(function() {
        var paneElement;
        paneElement = atom.views.getView(pane);
        paneElement.insertBefore(tabBar, paneElement.firstChild);
        return jasmine.attachToDOM(paneElement);
      });
      describe("when tabs:close-tab is fired", function() {
        return it("closes the active tab", function() {
          triggerMouseEvent('mousedown', tabBar.tabForItem(item2), {
            which: 3
          });
          atom.commands.dispatch(tabBar, 'tabs:close-tab');
          expect(pane.getItems().length).toBe(2);
          expect(pane.getItems().indexOf(item2)).toBe(-1);
          expect(tabBar.getTabs().length).toBe(2);
          return expect($(tabBar).find('.tab:contains(Item 2)')).not.toExist();
        });
      });
      describe("when tabs:close-other-tabs is fired", function() {
        return it("closes all other tabs except the active tab", function() {
          triggerMouseEvent('mousedown', tabBar.tabForItem(item2), {
            which: 3
          });
          atom.commands.dispatch(tabBar, 'tabs:close-other-tabs');
          expect(pane.getItems().length).toBe(1);
          expect(tabBar.getTabs().length).toBe(1);
          expect($(tabBar).find('.tab:contains(sample.js)')).not.toExist();
          return expect($(tabBar).find('.tab:contains(Item 2)')).toExist();
        });
      });
      describe("when tabs:close-tabs-to-right is fired", function() {
        return it("closes only the tabs to the right of the active tab", function() {
          pane.activateItem(editor1);
          triggerMouseEvent('mousedown', tabBar.tabForItem(editor1), {
            which: 3
          });
          atom.commands.dispatch(tabBar, 'tabs:close-tabs-to-right');
          expect(pane.getItems().length).toBe(2);
          expect(tabBar.getTabs().length).toBe(2);
          expect($(tabBar).find('.tab:contains(Item 2)')).not.toExist();
          return expect($(tabBar).find('.tab:contains(Item 1)')).toExist();
        });
      });
      describe("when tabs:close-all-tabs is fired", function() {
        return it("closes all the tabs", function() {
          expect(pane.getItems().length).toBeGreaterThan(0);
          atom.commands.dispatch(tabBar, 'tabs:close-all-tabs');
          return expect(pane.getItems().length).toBe(0);
        });
      });
      describe("when tabs:close-saved-tabs is fired", function() {
        return it("closes all the saved tabs", function() {
          item1.isModified = function() {
            return true;
          };
          atom.commands.dispatch(tabBar, 'tabs:close-saved-tabs');
          expect(pane.getItems().length).toBe(1);
          return expect(pane.getItems()[0]).toBe(item1);
        });
      });
      describe("when tabs:split-up is fired", function() {
        return it("splits the selected tab up", function() {
          triggerMouseEvent('mousedown', tabBar.tabForItem(item2), {
            which: 3
          });
          expect(atom.workspace.getPanes().length).toBe(1);
          atom.commands.dispatch(tabBar, 'tabs:split-up');
          expect(atom.workspace.getPanes().length).toBe(2);
          expect(atom.workspace.getPanes()[1]).toBe(pane);
          return expect(atom.workspace.getPanes()[0].getItems()[0].getTitle()).toBe(item2.getTitle());
        });
      });
      describe("when tabs:split-down is fired", function() {
        return it("splits the selected tab down", function() {
          triggerMouseEvent('mousedown', tabBar.tabForItem(item2), {
            which: 3
          });
          expect(atom.workspace.getPanes().length).toBe(1);
          atom.commands.dispatch(tabBar, 'tabs:split-down');
          expect(atom.workspace.getPanes().length).toBe(2);
          expect(atom.workspace.getPanes()[0]).toBe(pane);
          return expect(atom.workspace.getPanes()[1].getItems()[0].getTitle()).toBe(item2.getTitle());
        });
      });
      describe("when tabs:split-left is fired", function() {
        return it("splits the selected tab to the left", function() {
          triggerMouseEvent('mousedown', tabBar.tabForItem(item2), {
            which: 3
          });
          expect(atom.workspace.getPanes().length).toBe(1);
          atom.commands.dispatch(tabBar, 'tabs:split-left');
          expect(atom.workspace.getPanes().length).toBe(2);
          expect(atom.workspace.getPanes()[1]).toBe(pane);
          return expect(atom.workspace.getPanes()[0].getItems()[0].getTitle()).toBe(item2.getTitle());
        });
      });
      return describe("when tabs:split-right is fired", function() {
        return it("splits the selected tab to the right", function() {
          triggerMouseEvent('mousedown', tabBar.tabForItem(item2), {
            which: 3
          });
          expect(atom.workspace.getPanes().length).toBe(1);
          atom.commands.dispatch(tabBar, 'tabs:split-right');
          expect(atom.workspace.getPanes().length).toBe(2);
          expect(atom.workspace.getPanes()[0]).toBe(pane);
          return expect(atom.workspace.getPanes()[1].getItems()[0].getTitle()).toBe(item2.getTitle());
        });
      });
    });
    describe("command palette commands", function() {
      var paneElement;
      paneElement = null;
      beforeEach(function() {
        return paneElement = atom.views.getView(pane);
      });
      describe("when tabs:close-tab is fired", function() {
        it("closes the active tab", function() {
          atom.commands.dispatch(paneElement, 'tabs:close-tab');
          expect(pane.getItems().length).toBe(2);
          expect(pane.getItems().indexOf(item2)).toBe(-1);
          expect(tabBar.getTabs().length).toBe(2);
          return expect($(tabBar).find('.tab:contains(Item 2)')).not.toExist();
        });
        return it("does nothing if no tabs are open", function() {
          atom.commands.dispatch(paneElement, 'tabs:close-tab');
          atom.commands.dispatch(paneElement, 'tabs:close-tab');
          atom.commands.dispatch(paneElement, 'tabs:close-tab');
          expect(pane.getItems().length).toBe(0);
          return expect(tabBar.getTabs().length).toBe(0);
        });
      });
      describe("when tabs:close-other-tabs is fired", function() {
        return it("closes all other tabs except the active tab", function() {
          atom.commands.dispatch(paneElement, 'tabs:close-other-tabs');
          expect(pane.getItems().length).toBe(1);
          expect(tabBar.getTabs().length).toBe(1);
          expect($(tabBar).find('.tab:contains(sample.js)')).not.toExist();
          return expect($(tabBar).find('.tab:contains(Item 2)')).toExist();
        });
      });
      describe("when tabs:close-tabs-to-right is fired", function() {
        return it("closes only the tabs to the right of the active tab", function() {
          pane.activateItem(editor1);
          atom.commands.dispatch(paneElement, 'tabs:close-tabs-to-right');
          expect(pane.getItems().length).toBe(2);
          expect(tabBar.getTabs().length).toBe(2);
          expect($(tabBar).find('.tab:contains(Item 2)')).not.toExist();
          return expect($(tabBar).find('.tab:contains(Item 1)')).toExist();
        });
      });
      describe("when tabs:close-all-tabs is fired", function() {
        return it("closes all the tabs", function() {
          expect(pane.getItems().length).toBeGreaterThan(0);
          atom.commands.dispatch(paneElement, 'tabs:close-all-tabs');
          return expect(pane.getItems().length).toBe(0);
        });
      });
      return describe("when tabs:close-saved-tabs is fired", function() {
        return it("closes all the saved tabs", function() {
          item1.isModified = function() {
            return true;
          };
          atom.commands.dispatch(paneElement, 'tabs:close-saved-tabs');
          expect(pane.getItems().length).toBe(1);
          return expect(pane.getItems()[0]).toBe(item1);
        });
      });
    });
    describe("dragging and dropping tabs", function() {
      describe("when a tab is dragged within the same pane", function() {
        describe("when it is dropped on tab that's later in the list", function() {
          return it("moves the tab and its item, shows the tab's item, and focuses the pane", function() {
            var dragStartEvent, dropEvent, tabToDrag, _ref3;
            expect(tabBar.getTabs().map(function(tab) {
              return tab.textContent;
            })).toEqual(["Item 1", "sample.js", "Item 2"]);
            expect(pane.getItems()).toEqual([item1, editor1, item2]);
            expect(pane.getActiveItem()).toBe(item2);
            spyOn(pane, 'activate');
            tabToDrag = tabBar.tabAtIndex(0);
            spyOn(tabToDrag, 'destroyTooltip');
            spyOn(tabToDrag, 'updateTooltip');
            _ref3 = buildDragEvents(tabToDrag, tabBar.tabAtIndex(1)), dragStartEvent = _ref3[0], dropEvent = _ref3[1];
            tabBar.onDragStart(dragStartEvent);
            expect(tabToDrag.destroyTooltip).toHaveBeenCalled();
            expect(tabToDrag.updateTooltip).not.toHaveBeenCalled();
            tabBar.onDrop(dropEvent);
            expect(tabToDrag.updateTooltip).toHaveBeenCalled();
            expect(tabBar.getTabs().map(function(tab) {
              return tab.textContent;
            })).toEqual(["sample.js", "Item 1", "Item 2"]);
            expect(pane.getItems()).toEqual([editor1, item1, item2]);
            expect(pane.getActiveItem()).toBe(item1);
            return expect(pane.activate).toHaveBeenCalled();
          });
        });
        describe("when it is dropped on a tab that's earlier in the list", function() {
          return it("moves the tab and its item, shows the tab's item, and focuses the pane", function() {
            var dragStartEvent, dropEvent, _ref3;
            expect(tabBar.getTabs().map(function(tab) {
              return tab.textContent;
            })).toEqual(["Item 1", "sample.js", "Item 2"]);
            expect(pane.getItems()).toEqual([item1, editor1, item2]);
            expect(pane.getActiveItem()).toBe(item2);
            spyOn(pane, 'activate');
            _ref3 = buildDragEvents(tabBar.tabAtIndex(2), tabBar.tabAtIndex(0)), dragStartEvent = _ref3[0], dropEvent = _ref3[1];
            tabBar.onDragStart(dragStartEvent);
            tabBar.onDrop(dropEvent);
            expect(tabBar.getTabs().map(function(tab) {
              return tab.textContent;
            })).toEqual(["Item 1", "Item 2", "sample.js"]);
            expect(pane.getItems()).toEqual([item1, item2, editor1]);
            expect(pane.getActiveItem()).toBe(item2);
            return expect(pane.activate).toHaveBeenCalled();
          });
        });
        describe("when it is dropped on itself", function() {
          return it("doesn't move the tab or item, but does make it the active item and focuses the pane", function() {
            var dragStartEvent, dropEvent, _ref3;
            expect(tabBar.getTabs().map(function(tab) {
              return tab.textContent;
            })).toEqual(["Item 1", "sample.js", "Item 2"]);
            expect(pane.getItems()).toEqual([item1, editor1, item2]);
            expect(pane.getActiveItem()).toBe(item2);
            spyOn(pane, 'activate');
            _ref3 = buildDragEvents(tabBar.tabAtIndex(0), tabBar.tabAtIndex(0)), dragStartEvent = _ref3[0], dropEvent = _ref3[1];
            tabBar.onDragStart(dragStartEvent);
            tabBar.onDrop(dropEvent);
            expect(tabBar.getTabs().map(function(tab) {
              return tab.textContent;
            })).toEqual(["Item 1", "sample.js", "Item 2"]);
            expect(pane.getItems()).toEqual([item1, editor1, item2]);
            expect(pane.getActiveItem()).toBe(item1);
            return expect(pane.activate).toHaveBeenCalled();
          });
        });
        return describe("when it is dropped on the tab bar", function() {
          return it("moves the tab and its item to the end", function() {
            var dragStartEvent, dropEvent, _ref3;
            expect(tabBar.getTabs().map(function(tab) {
              return tab.textContent;
            })).toEqual(["Item 1", "sample.js", "Item 2"]);
            expect(pane.getItems()).toEqual([item1, editor1, item2]);
            expect(pane.getActiveItem()).toBe(item2);
            spyOn(pane, 'activate');
            _ref3 = buildDragEvents(tabBar.tabAtIndex(0), tabBar), dragStartEvent = _ref3[0], dropEvent = _ref3[1];
            tabBar.onDragStart(dragStartEvent);
            tabBar.onDrop(dropEvent);
            expect(tabBar.getTabs().map(function(tab) {
              return tab.textContent;
            })).toEqual(["sample.js", "Item 2", "Item 1"]);
            return expect(pane.getItems()).toEqual([editor1, item2, item1]);
          });
        });
      });
      describe("when a tab is dragged to a different pane", function() {
        var item2b, pane2, tabBar2, _ref3;
        _ref3 = [], pane2 = _ref3[0], tabBar2 = _ref3[1], item2b = _ref3[2];
        beforeEach(function() {
          pane2 = pane.splitRight({
            copyActiveItem: true
          });
          item2b = pane2.getItems()[0];
          tabBar2 = new TabBarView;
          return tabBar2.initialize(pane2);
        });
        it("removes the tab and item from their original pane and moves them to the target pane", function() {
          var dragStartEvent, dropEvent, _ref4;
          expect(tabBar.getTabs().map(function(tab) {
            return tab.textContent;
          })).toEqual(["Item 1", "sample.js", "Item 2"]);
          expect(pane.getItems()).toEqual([item1, editor1, item2]);
          expect(pane.getActiveItem()).toBe(item2);
          expect(tabBar2.getTabs().map(function(tab) {
            return tab.textContent;
          })).toEqual(["Item 2"]);
          expect(pane2.getItems()).toEqual([item2b]);
          expect(pane2.activeItem).toBe(item2b);
          spyOn(pane2, 'activate');
          _ref4 = buildDragEvents(tabBar.tabAtIndex(0), tabBar2.tabAtIndex(0)), dragStartEvent = _ref4[0], dropEvent = _ref4[1];
          tabBar.onDragStart(dragStartEvent);
          tabBar2.onDrop(dropEvent);
          expect(tabBar.getTabs().map(function(tab) {
            return tab.textContent;
          })).toEqual(["sample.js", "Item 2"]);
          expect(pane.getItems()).toEqual([editor1, item2]);
          expect(pane.getActiveItem()).toBe(item2);
          expect(tabBar2.getTabs().map(function(tab) {
            return tab.textContent;
          })).toEqual(["Item 2", "Item 1"]);
          expect(pane2.getItems()).toEqual([item2b, item1]);
          expect(pane2.activeItem).toBe(item1);
          return expect(pane2.activate).toHaveBeenCalled();
        });
        return describe("when the tab is dragged to an empty pane", function() {
          return it("removes the tab and item from their original pane and moves them to the target pane", function() {
            var dragStartEvent, dropEvent, _ref4;
            pane2.destroyItems();
            expect(tabBar.getTabs().map(function(tab) {
              return tab.textContent;
            })).toEqual(["Item 1", "sample.js", "Item 2"]);
            expect(pane.getItems()).toEqual([item1, editor1, item2]);
            expect(pane.getActiveItem()).toBe(item2);
            expect(tabBar2.getTabs().map(function(tab) {
              return tab.textContent;
            })).toEqual([]);
            expect(pane2.getItems()).toEqual([]);
            expect(pane2.activeItem).toBeUndefined();
            spyOn(pane2, 'activate');
            _ref4 = buildDragEvents(tabBar.tabAtIndex(0), tabBar2), dragStartEvent = _ref4[0], dropEvent = _ref4[1];
            tabBar.onDragStart(dragStartEvent);
            tabBar2.onDragOver(dropEvent);
            tabBar2.onDrop(dropEvent);
            expect(tabBar.getTabs().map(function(tab) {
              return tab.textContent;
            })).toEqual(["sample.js", "Item 2"]);
            expect(pane.getItems()).toEqual([editor1, item2]);
            expect(pane.getActiveItem()).toBe(item2);
            expect(tabBar2.getTabs().map(function(tab) {
              return tab.textContent;
            })).toEqual(["Item 1"]);
            expect(pane2.getItems()).toEqual([item1]);
            expect(pane2.activeItem).toBe(item1);
            return expect(pane2.activate).toHaveBeenCalled();
          });
        });
      });
      describe("when a non-tab is dragged to pane", function() {
        return it("has no effect", function() {
          var dragStartEvent, dropEvent, _ref3;
          expect(tabBar.getTabs().map(function(tab) {
            return tab.textContent;
          })).toEqual(["Item 1", "sample.js", "Item 2"]);
          expect(pane.getItems()).toEqual([item1, editor1, item2]);
          expect(pane.getActiveItem()).toBe(item2);
          spyOn(pane, 'activate');
          _ref3 = buildDragEvents(tabBar.tabAtIndex(0), tabBar.tabAtIndex(0)), dragStartEvent = _ref3[0], dropEvent = _ref3[1];
          tabBar.onDrop(dropEvent);
          expect(tabBar.getTabs().map(function(tab) {
            return tab.textContent;
          })).toEqual(["Item 1", "sample.js", "Item 2"]);
          expect(pane.getItems()).toEqual([item1, editor1, item2]);
          expect(pane.getActiveItem()).toBe(item2);
          return expect(pane.activate).not.toHaveBeenCalled();
        });
      });
      describe("when a tab is dragged out of application", function() {
        return it("should carry the file's information", function() {
          var dragStartEvent, dropEvent, _ref3;
          _ref3 = buildDragEvents(tabBar.tabAtIndex(1), tabBar.tabAtIndex(1)), dragStartEvent = _ref3[0], dropEvent = _ref3[1];
          tabBar.onDragStart(dragStartEvent);
          expect(dragStartEvent.dataTransfer.getData("text/plain")).toEqual(editor1.getPath());
          if (process.platform === 'darwin') {
            return expect(dragStartEvent.dataTransfer.getData("text/uri-list")).toEqual("file://" + (editor1.getPath()));
          }
        });
      });
      return describe("when a tab is dragged to another Atom window", function() {
        it("closes the tab in the first window and opens the tab in the second window", function() {
          var dragStartEvent, dropEvent, _ref3;
          _ref3 = buildDragEvents(tabBar.tabAtIndex(1), tabBar.tabAtIndex(0)), dragStartEvent = _ref3[0], dropEvent = _ref3[1];
          tabBar.onDragStart(dragStartEvent);
          tabBar.onDropOnOtherWindow(pane.id, 1);
          expect(pane.getItems()).toEqual([item1, item2]);
          expect(pane.getActiveItem()).toBe(item2);
          dropEvent.dataTransfer.setData('from-window-id', tabBar.getWindowId() + 1);
          spyOn(tabBar, 'moveItemBetweenPanes').andCallThrough();
          tabBar.onDrop(dropEvent);
          waitsFor(function() {
            return tabBar.moveItemBetweenPanes.callCount > 0;
          });
          return runs(function() {
            var editor;
            editor = atom.workspace.getActiveTextEditor();
            expect(editor.getPath()).toBe(editor1.getPath());
            return expect(pane.getItems()).toEqual([item1, editor, item2]);
          });
        });
        it("transfers the text of the editor when it is modified", function() {
          var dragStartEvent, dropEvent, _ref3;
          editor1.setText('I came from another window');
          _ref3 = buildDragEvents(tabBar.tabAtIndex(1), tabBar.tabAtIndex(0)), dragStartEvent = _ref3[0], dropEvent = _ref3[1];
          tabBar.onDragStart(dragStartEvent);
          tabBar.onDropOnOtherWindow(pane.id, 1);
          dropEvent.dataTransfer.setData('from-window-id', tabBar.getWindowId() + 1);
          spyOn(tabBar, 'moveItemBetweenPanes').andCallThrough();
          tabBar.onDrop(dropEvent);
          waitsFor(function() {
            return tabBar.moveItemBetweenPanes.callCount > 0;
          });
          return runs(function() {
            return expect(atom.workspace.getActiveTextEditor().getText()).toBe('I came from another window');
          });
        });
        return it("allows untitled editors to be moved between windows", function() {
          var dragStartEvent, dropEvent, _ref3;
          editor1.getBuffer().setPath(null);
          editor1.setText('I have no path');
          _ref3 = buildDragEvents(tabBar.tabAtIndex(1), tabBar.tabAtIndex(0)), dragStartEvent = _ref3[0], dropEvent = _ref3[1];
          tabBar.onDragStart(dragStartEvent);
          tabBar.onDropOnOtherWindow(pane.id, 1);
          dropEvent.dataTransfer.setData('from-window-id', tabBar.getWindowId() + 1);
          spyOn(tabBar, 'moveItemBetweenPanes').andCallThrough();
          tabBar.onDrop(dropEvent);
          waitsFor(function() {
            return tabBar.moveItemBetweenPanes.callCount > 0;
          });
          return runs(function() {
            expect(atom.workspace.getActiveTextEditor().getText()).toBe('I have no path');
            return expect(atom.workspace.getActiveTextEditor().getPath()).toBeUndefined();
          });
        });
      });
    });
    describe("when the tab bar is double clicked", function() {
      return it("opens a new empty editor", function() {
        var newFileHandler;
        newFileHandler = jasmine.createSpy('newFileHandler');
        atom.commands.add(tabBar, 'application:new-file', newFileHandler);
        triggerMouseEvent("dblclick", tabBar.getTabs()[0]);
        expect(newFileHandler.callCount).toBe(0);
        triggerMouseEvent("dblclick", tabBar);
        return expect(newFileHandler.callCount).toBe(1);
      });
    });
    describe("when the mouse wheel is used on the tab bar", function() {
      describe("when tabScrolling is true in package settings", function() {
        beforeEach(function() {
          atom.config.set("tabs.tabScrolling", true);
          return atom.config.set("tabs.tabScrollingThreshold", 120);
        });
        describe("when the mouse wheel scrolls up", function() {
          it("changes the active tab to the previous tab", function() {
            expect(pane.getActiveItem()).toBe(item2);
            tabBar.dispatchEvent(buildWheelEvent(120));
            return expect(pane.getActiveItem()).toBe(editor1);
          });
          return it("changes the active tab to the previous tab only after the wheelDelta crosses the threshold", function() {
            expect(pane.getActiveItem()).toBe(item2);
            tabBar.dispatchEvent(buildWheelEvent(50));
            expect(pane.getActiveItem()).toBe(item2);
            tabBar.dispatchEvent(buildWheelEvent(50));
            expect(pane.getActiveItem()).toBe(item2);
            tabBar.dispatchEvent(buildWheelEvent(50));
            return expect(pane.getActiveItem()).toBe(editor1);
          });
        });
        describe("when the mouse wheel scrolls down", function() {
          return it("changes the active tab to the previous tab", function() {
            expect(pane.getActiveItem()).toBe(item2);
            tabBar.dispatchEvent(buildWheelEvent(-120));
            return expect(pane.getActiveItem()).toBe(item1);
          });
        });
        describe("when the mouse wheel scrolls up and shift key is pressed", function() {
          return it("does not change the active tab", function() {
            expect(pane.getActiveItem()).toBe(item2);
            tabBar.dispatchEvent(buildWheelPlusShiftEvent(120));
            return expect(pane.getActiveItem()).toBe(item2);
          });
        });
        return describe("when the mouse wheel scrolls down and shift key is pressed", function() {
          return it("does not change the active tab", function() {
            expect(pane.getActiveItem()).toBe(item2);
            tabBar.dispatchEvent(buildWheelPlusShiftEvent(-120));
            return expect(pane.getActiveItem()).toBe(item2);
          });
        });
      });
      return describe("when tabScrolling is false in package settings", function() {
        beforeEach(function() {
          return atom.config.set("tabs.tabScrolling", false);
        });
        describe("when the mouse wheel scrolls up one unit", function() {
          return it("does not change the active tab", function() {
            expect(pane.getActiveItem()).toBe(item2);
            tabBar.dispatchEvent(buildWheelEvent(120));
            return expect(pane.getActiveItem()).toBe(item2);
          });
        });
        return describe("when the mouse wheel scrolls down one unit", function() {
          return it("does not change the active tab", function() {
            expect(pane.getActiveItem()).toBe(item2);
            tabBar.dispatchEvent(buildWheelEvent(-120));
            return expect(pane.getActiveItem()).toBe(item2);
          });
        });
      });
    });
    describe("when alwaysShowTabBar is true in package settings", function() {
      beforeEach(function() {
        return atom.config.set("tabs.alwaysShowTabBar", true);
      });
      describe("when 2 tabs are open", function() {
        return it("shows the tab bar", function() {
          expect(pane.getItems().length).toBe(3);
          return expect(tabBar).not.toHaveClass('hidden');
        });
      });
      return describe("when 1 tab is open", function() {
        return it("shows the tab bar", function() {
          expect(pane.getItems().length).toBe(3);
          pane.destroyItem(item1);
          pane.destroyItem(item2);
          expect(pane.getItems().length).toBe(1);
          return expect(tabBar).not.toHaveClass('hidden');
        });
      });
    });
    describe("when alwaysShowTabBar is false in package settings", function() {
      beforeEach(function() {
        return atom.config.set("tabs.alwaysShowTabBar", false);
      });
      describe("when 2 tabs are open", function() {
        return it("shows the tab bar", function() {
          expect(pane.getItems().length).toBe(3);
          return expect(tabBar).not.toHaveClass('hidden');
        });
      });
      return describe("when 1 tab is open", function() {
        return it("hides the tab bar", function() {
          expect(pane.getItems().length).toBe(3);
          pane.destroyItem(item1);
          pane.destroyItem(item2);
          expect(pane.getItems().length).toBe(1);
          return expect(tabBar).toHaveClass('hidden');
        });
      });
    });
    describe("when usePreviewTabs is true in package settings", function() {
      beforeEach(function() {
        atom.config.set("tabs.usePreviewTabs", true);
        return pane.destroyItems();
      });
      describe("when opening a new tab", function() {
        return it("adds tab with class 'temp'", function() {
          editor1 = null;
          waitsForPromise(function() {
            return atom.workspace.open('sample.txt').then(function(o) {
              return editor1 = o;
            });
          });
          return runs(function() {
            pane.activateItem(editor1);
            expect($(tabBar).find('.tab .temp').length).toBe(1);
            return expect($(tabBar).find('.tab:eq(0) .title')).toHaveClass('temp');
          });
        });
      });
      describe("when tabs:keep-preview-tab is trigger on the pane", function() {
        return it("removes the 'temp' class", function() {
          editor1 = null;
          waitsForPromise(function() {
            return atom.workspace.open('sample.txt').then(function(o) {
              return editor1 = o;
            });
          });
          return runs(function() {
            pane.activateItem(editor1);
            expect($(tabBar).find('.tab .temp').length).toBe(1);
            atom.commands.dispatch(atom.views.getView(atom.workspace.getActivePane()), 'tabs:keep-preview-tab');
            return expect($(tabBar).find('.tab .temp').length).toBe(0);
          });
        });
      });
      describe("when there is a temp tab already", function() {
        it("it will replace an existing temporary tab", function() {
          var editor2;
          editor1 = null;
          editor2 = null;
          waitsForPromise(function() {
            return atom.workspace.open('sample.txt').then(function(o) {
              editor1 = o;
              pane.activateItem(editor1);
              return atom.workspace.open('sample2.txt').then(function(o) {
                editor2 = o;
                return pane.activateItem(editor2);
              });
            });
          });
          return runs(function() {
            expect(editor1.isDestroyed()).toBe(true);
            expect(editor2.isDestroyed()).toBe(false);
            expect(tabBar.tabForItem(editor1)).not.toExist();
            return expect($(tabBar.tabForItem(editor2)).find('.title')).toHaveClass('temp');
          });
        });
        return it('makes the tab permanent when double clicking the tab', function() {
          var editor2;
          editor2 = null;
          waitsForPromise(function() {
            return atom.workspace.open('sample.txt').then(function(o) {
              return editor2 = o;
            });
          });
          return runs(function() {
            var dbclickEvt;
            pane.activateItem(editor2);
            dbclickEvt = document.createEvent('MouseEvents');
            dbclickEvt.initEvent('dblclick');
            tabBar.tabForItem(editor2).dispatchEvent(dbclickEvt);
            return expect($(tabBar.tabForItem(editor2)).find('.title')).not.toHaveClass('temp');
          });
        });
      });
      describe('when opening views that do not have file paths', function() {
        var editor2, settingsView;
        editor2 = null;
        settingsView = null;
        beforeEach(function() {
          waitsForPromise(function() {
            return atom.workspace.open('sample.txt').then(function(o) {
              editor2 = o;
              return pane.activateItem(editor2);
            });
          });
          return waitsForPromise(function() {
            return atom.packages.activatePackage('settings-view').then(function() {
              return atom.workspace.open('atom://config').then(function(o) {
                settingsView = o;
                return pane.activateItem(settingsView);
              });
            });
          });
        });
        it('creates a permanent tab', function() {
          expect(tabBar.tabForItem(settingsView)).toExist();
          return expect($(tabBar.tabForItem(settingsView)).find('.title')).not.toHaveClass('temp');
        });
        return it('keeps an existing temp tab', function() {
          expect(tabBar.tabForItem(editor2)).toExist();
          return expect($(tabBar.tabForItem(editor2)).find('.title')).toHaveClass('temp');
        });
      });
      describe('when editing a file', function() {
        return it('makes the tab permanent', function() {
          editor1 = null;
          waitsForPromise(function() {
            return atom.workspace.open('sample.txt').then(function(o) {
              editor1 = o;
              pane.activateItem(editor1);
              editor1.insertText('x');
              return advanceClock(editor1.buffer.stoppedChangingDelay);
            });
          });
          return runs(function() {
            return expect($(tabBar.tabForItem(editor1)).find('.title')).not.toHaveClass('temp');
          });
        });
      });
      describe('when saving a file', function() {
        return it('makes the tab permanent', function() {
          editor1 = null;
          waitsForPromise(function() {
            return atom.workspace.open(path.join(temp.mkdirSync('tabs-'), 'sample.txt')).then(function(o) {
              editor1 = o;
              pane.activateItem(editor1);
              return editor1.save();
            });
          });
          return runs(function() {
            return expect($(tabBar.tabForItem(editor1)).find('.title')).not.toHaveClass('temp');
          });
        });
      });
      describe('when switching from a preview tab to a permanent tab', function() {
        return it("keeps the preview tab open", function() {
          var editor2;
          atom.config.set("tabs.usePreviewTabs", false);
          editor1 = null;
          editor2 = null;
          waitsForPromise(function() {
            return atom.workspace.open('sample.txt').then(function(o) {
              editor1 = o;
              return pane.activateItem(editor1);
            });
          });
          runs(function() {
            return atom.config.set("tabs.usePreviewTabs", true);
          });
          waitsForPromise(function() {
            return atom.workspace.open('sample2.txt').then(function(o) {
              editor2 = o;
              return pane.activateItem(editor2);
            });
          });
          return runs(function() {
            pane.activateItem(editor1);
            expect(pane.getItems().length).toBe(2);
            expect($(tabBar.tabForItem(editor1)).find('.title')).not.toHaveClass('temp');
            return expect($(tabBar.tabForItem(editor2)).find('.title')).toHaveClass('temp');
          });
        });
      });
      describe("when splitting a preview tab", function() {
        return it("makes the tab permanent in the new pane", function() {
          editor1 = null;
          waitsForPromise(function() {
            return atom.workspace.open('sample.txt').then(function(o) {
              return editor1 = o;
            });
          });
          return runs(function() {
            var pane2, tabBar2;
            pane.activateItem(editor1);
            pane2 = pane.splitRight({
              copyActiveItem: true
            });
            tabBar2 = new TabBarView;
            tabBar2.initialize(pane2);
            return expect($(tabBar2.tabForItem(pane2.getActiveItem())).find('.title')).not.toHaveClass('temp');
          });
        });
      });
      describe("when dragging a preview tab to a different pane", function() {
        return it("makes the tab permanent in the other pane", function() {
          editor1 = null;
          waitsForPromise(function() {
            return atom.workspace.open('sample.txt').then(function(o) {
              return editor1 = o;
            });
          });
          return runs(function() {
            var pane2, tabBar2;
            pane.activateItem(editor1);
            pane2 = pane.splitRight();
            tabBar2 = new TabBarView;
            tabBar2.initialize(pane2);
            tabBar2.moveItemBetweenPanes(pane, 0, pane2, 1, editor1);
            return expect($(tabBar2.tabForItem(pane2.getActiveItem())).find('.title')).not.toHaveClass('temp');
          });
        });
      });
      describe("when a non-text file is opened", function() {
        return it("opens a preview tab", function() {
          var imageView;
          imageView = null;
          waitsForPromise(function() {
            return atom.workspace.open('sample.png').then(function(o) {
              imageView = o;
              return pane.activateItem(imageView);
            });
          });
          return runs(function() {
            expect(tabBar.tabForItem(imageView)).toExist();
            return expect($(tabBar.tabForItem(imageView)).find('.title')).toHaveClass('temp');
          });
        });
      });
      return describe("when double clicking a file in the tree view", function() {
        return it("makes the tab for that file permanent", function() {
          var workspaceElement;
          editor1 = null;
          workspaceElement = atom.views.getView(atom.workspace);
          jasmine.attachToDOM(workspaceElement);
          waitsForPromise(function() {
            return atom.packages.activatePackage('tree-view');
          });
          runs(function() {
            return atom.commands.dispatch(workspaceElement, 'tree-view:show');
          });
          waitsFor(function() {
            return workspaceElement.querySelector('.tree-view');
          });
          waitsForPromise(function() {
            return atom.workspace.open('sample.js').then(function(o) {
              return editor1 = o;
            });
          });
          return runs(function() {
            var fileNode;
            pane.activateItem(editor1);
            expect($(tabBar.tabForItem(editor1)).find('.title')).toHaveClass('temp');
            fileNode = workspaceElement.querySelector(".tree-view [data-path=\"" + (path.join(__dirname, 'fixtures', 'sample.js')) + "\"]");
            fileNode.dispatchEvent(new MouseEvent('click', {
              detail: 1,
              bubbles: true,
              cancelable: true
            }));
            fileNode.dispatchEvent(new MouseEvent('click', {
              detail: 2,
              bubbles: true,
              cancelable: true
            }));
            fileNode.dispatchEvent(new MouseEvent('dblclick', {
              detail: 2,
              bubbles: true,
              cancelable: true
            }));
            return expect($(tabBar.tabForItem(editor1)).find('.title')).not.toHaveClass('temp');
          });
        });
      });
    });
    return describe("integration with version control systems", function() {
      var repository, tab, tab1, _ref3;
      _ref3 = [], repository = _ref3[0], tab = _ref3[1], tab1 = _ref3[2];
      beforeEach(function() {
        tab = tabBar.tabForItem(editor1);
        spyOn(tab, 'setupVcsStatus').andCallThrough();
        spyOn(tab, 'updateVcsStatus').andCallThrough();
        tab1 = tabBar.tabForItem(item1);
        tab1.path = '/some/path/outside/the/repository';
        spyOn(tab1, 'updateVcsStatus').andCallThrough();
        repository = jasmine.createSpyObj('repo', ['isPathIgnored', 'getCachedPathStatus', 'isStatusNew', 'isStatusModified']);
        repository.isStatusNew.andCallFake(function(status) {
          return status === 'new';
        });
        repository.isStatusModified.andCallFake(function(status) {
          return status === 'modified';
        });
        repository.onDidChangeStatus = function(callback) {
          if (this.changeStatusCallbacks == null) {
            this.changeStatusCallbacks = [];
          }
          this.changeStatusCallbacks.push(callback);
          return {
            dispose: (function(_this) {
              return function() {
                return _.remove(_this.changeStatusCallbacks, callback);
              };
            })(this)
          };
        };
        repository.emitDidChangeStatus = function(event) {
          var callback, _i, _len, _ref4, _ref5, _results;
          _ref5 = (_ref4 = this.changeStatusCallbacks) != null ? _ref4 : [];
          _results = [];
          for (_i = 0, _len = _ref5.length; _i < _len; _i++) {
            callback = _ref5[_i];
            _results.push(callback(event));
          }
          return _results;
        };
        repository.onDidChangeStatuses = function(callback) {
          if (this.changeStatusesCallbacks == null) {
            this.changeStatusesCallbacks = [];
          }
          this.changeStatusesCallbacks.push(callback);
          return {
            dispose: (function(_this) {
              return function() {
                return _.remove(_this.changeStatusesCallbacks, callback);
              };
            })(this)
          };
        };
        repository.emitDidChangeStatuses = function(event) {
          var callback, _i, _len, _ref4, _ref5, _results;
          _ref5 = (_ref4 = this.changeStatusesCallbacks) != null ? _ref4 : [];
          _results = [];
          for (_i = 0, _len = _ref5.length; _i < _len; _i++) {
            callback = _ref5[_i];
            _results.push(callback(event));
          }
          return _results;
        };
        spyOn(atom.project, 'repositoryForDirectory').andReturn(Promise.resolve(repository));
        atom.config.set("tabs.enableVcsColoring", true);
        return waitsFor(function() {
          var _ref4;
          return ((_ref4 = repository.changeStatusCallbacks) != null ? _ref4.length : void 0) > 0;
        });
      });
      describe("when working inside a VCS repository", function() {
        it("adds custom style for new items", function() {
          repository.getCachedPathStatus.andReturn('new');
          tab.updateVcsStatus(repository);
          return expect($(tabBar).find('.tab:eq(1) .title')).toHaveClass("status-added");
        });
        it("adds custom style for modified items", function() {
          repository.getCachedPathStatus.andReturn('modified');
          tab.updateVcsStatus(repository);
          return expect($(tabBar).find('.tab:eq(1) .title')).toHaveClass("status-modified");
        });
        it("adds custom style for ignored items", function() {
          repository.isPathIgnored.andReturn(true);
          tab.updateVcsStatus(repository);
          return expect($(tabBar).find('.tab:eq(1) .title')).toHaveClass("status-ignored");
        });
        return it("does not add any styles for items not in the repository", function() {
          expect($(tabBar).find('.tab:eq(0) .title')).not.toHaveClass("status-added");
          expect($(tabBar).find('.tab:eq(0) .title')).not.toHaveClass("status-modified");
          return expect($(tabBar).find('.tab:eq(0) .title')).not.toHaveClass("status-ignored");
        });
      });
      describe("when changes in item statuses are notified", function() {
        it("updates status for items in the repository", function() {
          tab.updateVcsStatus.reset();
          repository.emitDidChangeStatuses();
          return expect(tab.updateVcsStatus.calls.length).toEqual(1);
        });
        it("updates the status of an item if it has changed", function() {
          repository.getCachedPathStatus.reset();
          expect($(tabBar).find('.tab:eq(1) .title')).not.toHaveClass("status-modified");
          repository.emitDidChangeStatus({
            path: tab.path,
            pathStatus: "modified"
          });
          expect($(tabBar).find('.tab:eq(1) .title')).toHaveClass("status-modified");
          return expect(repository.getCachedPathStatus.calls.length).toBe(0);
        });
        return it("does not update status for items not in the repository", function() {
          tab1.updateVcsStatus.reset();
          repository.emitDidChangeStatuses();
          return expect(tab1.updateVcsStatus.calls.length).toEqual(0);
        });
      });
      describe("when an item is saved", function() {
        it("does not update VCS subscription if the item's path remains the same", function() {
          tab.setupVcsStatus.reset();
          tab.item.buffer.emitter.emit('did-save', {
            path: tab.path
          });
          return expect(tab.setupVcsStatus.calls.length).toBe(0);
        });
        return it("updates VCS subscription if the item's path has changed", function() {
          tab.setupVcsStatus.reset();
          tab.item.buffer.emitter.emit('did-save', {
            path: '/some/other/path'
          });
          return expect(tab.setupVcsStatus.calls.length).toBe(1);
        });
      });
      return describe("when enableVcsColoring changes in package settings", function() {
        it("removes status from the tab if enableVcsColoring is set to false", function() {
          repository.emitDidChangeStatus({
            path: tab.path,
            pathStatus: 'new'
          });
          expect($(tabBar).find('.tab:eq(1) .title')).toHaveClass("status-added");
          atom.config.set("tabs.enableVcsColoring", false);
          return expect($(tabBar).find('.tab:eq(1) .title')).not.toHaveClass("status-added");
        });
        return it("adds status to the tab if enableVcsColoring is set to true", function() {
          atom.config.set("tabs.enableVcsColoring", false);
          repository.getCachedPathStatus.andReturn('modified');
          expect($(tabBar).find('.tab:eq(1) .title')).not.toHaveClass("status-modified");
          atom.config.set("tabs.enableVcsColoring", true);
          waitsFor(function() {
            var _ref4;
            return ((_ref4 = repository.changeStatusCallbacks) != null ? _ref4.length : void 0) > 0;
          });
          return runs(function() {
            return expect($(tabBar).find('.tab:eq(1) .title')).toHaveClass("status-modified");
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RhYnMvc3BlYy90YWJzLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHVJQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxPQUFhLE9BQUEsQ0FBUSxzQkFBUixDQUFiLEVBQUMsU0FBQSxDQUFELEVBQUksWUFBQSxJQUFKLENBQUE7O0FBQUEsRUFDQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBREosQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUZQLENBQUE7O0FBQUEsRUFHQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FIUCxDQUFBOztBQUFBLEVBSUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxxQkFBUixDQUpiLENBQUE7O0FBQUEsRUFLQSxPQUFBLEdBQVUsT0FBQSxDQUFRLGlCQUFSLENBTFYsQ0FBQTs7QUFBQSxFQU1BLFFBQWtGLE9BQUEsQ0FBUSxpQkFBUixDQUFsRixFQUFDLDBCQUFBLGlCQUFELEVBQW9CLHdCQUFBLGVBQXBCLEVBQXFDLHdCQUFBLGVBQXJDLEVBQXNELGlDQUFBLHdCQU50RCxDQUFBOztBQUFBLEVBUUEsUUFBQSxDQUFTLG1CQUFULEVBQThCLFNBQUEsR0FBQTtBQUM1QixRQUFBLGdCQUFBO0FBQUEsSUFBQSxnQkFBQSxHQUFtQixJQUFuQixDQUFBO0FBQUEsSUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsTUFBQSxnQkFBQSxHQUFtQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBSSxDQUFDLFNBQXhCLENBQW5CLENBQUE7QUFBQSxNQUVBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLFdBQXBCLEVBRGM7TUFBQSxD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

//# sourceURL=/Users/ah/.atom/packages/tabs/spec/tabs-spec.coffee
