(function() {
  var $, TabBarView, TabView, View, buildDragEvents, buildWheelEvent, buildWheelPlusShiftEvent, path, temp, triggerMouseDownEvent, _, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $ = _ref.$, View = _ref.View;

  _ = require('underscore-plus');

  path = require('path');

  temp = require('temp');

  TabBarView = require('../lib/tab-bar-view');

  TabView = require('../lib/tab-view');

  _ref1 = require("./event-helpers"), triggerMouseDownEvent = _ref1.triggerMouseDownEvent, buildDragEvents = _ref1.buildDragEvents, buildWheelEvent = _ref1.buildWheelEvent, buildWheelPlusShiftEvent = _ref1.buildWheelPlusShiftEvent;

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
        return tabBar = new TabBarView(pane);
      });
    });
    afterEach(function() {
      return deserializerDisposable.dispose();
    });
    describe(".initialize(pane)", function() {
      it("creates a tab for each item on the tab bar's parent pane", function() {
        expect(pane.getItems().length).toBe(3);
        expect(tabBar.find('.tab').length).toBe(3);
        expect(tabBar.find('.tab:eq(0) .title').text()).toBe(item1.getTitle());
        expect(tabBar.find('.tab:eq(0) .title')).not.toHaveAttr('data-name');
        expect(tabBar.find('.tab:eq(0) .title')).not.toHaveAttr('data-path');
        expect(tabBar.find('.tab:eq(0)')).toHaveAttr('data-type', 'TestView');
        expect(tabBar.find('.tab:eq(1) .title').text()).toBe(editor1.getTitle());
        expect(tabBar.find('.tab:eq(1) .title')).toHaveAttr('data-name', path.basename(editor1.getPath()));
        expect(tabBar.find('.tab:eq(1) .title')).toHaveAttr('data-path', editor1.getPath());
        expect(tabBar.find('.tab:eq(1)')).toHaveAttr('data-type', 'TextEditor');
        expect(tabBar.find('.tab:eq(2) .title').text()).toBe(item2.getTitle());
        expect(tabBar.find('.tab:eq(2) .title')).not.toHaveAttr('data-name');
        expect(tabBar.find('.tab:eq(2) .title')).not.toHaveAttr('data-path');
        return expect(tabBar.find('.tab:eq(2)')).toHaveAttr('data-type', 'TestView');
      });
      it("highlights the tab for the active pane item", function() {
        return expect(tabBar.find('.tab:eq(2)')).toHaveClass('active');
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
        expect(tabBar.find('.active').length).toBe(1);
        expect(tabBar.find('.tab:eq(0)')).toHaveClass('active');
        pane.activateItem(item2);
        expect(tabBar.find('.active').length).toBe(1);
        return expect(tabBar.find('.tab:eq(2)')).toHaveClass('active');
      });
    });
    describe("when a new item is added to the pane", function() {
      it("adds a tab for the new item at the same index as the item in the pane", function() {
        var item3;
        pane.activateItem(item1);
        item3 = new TestView('Item 3');
        pane.activateItem(item3);
        expect(tabBar.find('.tab').length).toBe(4);
        return expect($(tabBar.tabAtIndex(1)).find('.title')).toHaveText('Item 3');
      });
      return it("adds the 'modified' class to the new tab if the item is initially modified", function() {
        var editor2;
        editor2 = null;
        waitsForPromise(function() {
          return atom.project.open('sample.txt').then(function(o) {
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
        return expect(tabBar.find('.tab:contains(Item 2)')).not.toExist();
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
        spyOn(pane, 'activate');
        event = triggerMouseDownEvent(tabBar.tabAtIndex(0), {
          which: 1
        });
        expect(pane.getActiveItem()).toBe(pane.getItems()[0]);
        expect(event.preventDefault).not.toHaveBeenCalled();
        event = triggerMouseDownEvent(tabBar.tabAtIndex(2), {
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
        event = triggerMouseDownEvent(tabBar.tabForItem(editor1), {
          which: 2
        });
        expect(pane.getItems().length).toBe(2);
        expect(pane.getItems().indexOf(editor1)).toBe(-1);
        expect(editor1.destroyed).toBeTruthy();
        expect(tabBar.getTabs().length).toBe(2);
        expect(tabBar.find('.tab:contains(sample.js)')).not.toExist();
        return expect(event.preventDefault).toHaveBeenCalled();
      });
      return it("doesn't switch tab when right (or ctrl-left) clicked", function() {
        var event;
        spyOn(pane, 'activate');
        event = triggerMouseDownEvent(tabBar.tabAtIndex(0), {
          which: 3
        });
        expect(pane.getActiveItem()).not.toBe(pane.getItems()[0]);
        expect(event.preventDefault).toHaveBeenCalled();
        event = triggerMouseDownEvent(tabBar.tabAtIndex(0), {
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
        $(tabBar.tabForItem(editor1)).find('.close-icon').click();
        expect(pane.getItems().length).toBe(2);
        expect(pane.getItems().indexOf(editor1)).toBe(-1);
        expect(editor1.destroyed).toBeTruthy();
        expect(tabBar.getTabs().length).toBe(2);
        return expect(tabBar.find('.tab:contains(sample.js)')).not.toExist();
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
        expect(tabBar.find('.tab:eq(0) .title')).toHaveClass("icon");
        return expect(tabBar.find('.tab:eq(0) .title')).toHaveClass("icon-squirrel");
      });
      it("hides the icon from the tab if the icon is removed", function() {
        item1.getIconName = null;
        item1.emitIconChanged();
        expect(tabBar.find('.tab:eq(0) .title')).not.toHaveClass("icon");
        return expect(tabBar.find('.tab:eq(0) .title')).not.toHaveClass("icon-squirrel");
      });
      it("updates the icon on the tab if the icon is changed", function() {
        item1.getIconName = function() {
          return "zap";
        };
        item1.emitIconChanged();
        expect(tabBar.find('.tab:eq(0) .title')).toHaveClass("icon");
        return expect(tabBar.find('.tab:eq(0) .title')).toHaveClass("icon-zap");
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
          return expect(tabBar.find('.tab:eq(0) .title')).not.toHaveClass("hide-icon");
        });
        return it("hides the icon from the tab when showIcon is changed to false", function() {
          atom.config.set("tabs.showIcons", false);
          waitsFor(function() {
            return tabBar.tabForItem(item1).updateIconVisibility.callCount > 0;
          });
          return runs(function() {
            return expect(tabBar.find('.tab:eq(0) .title')).toHaveClass("hide-icon");
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
          return expect(tabBar.find('.tab:eq(0) .title')).toHaveClass("hide-icon");
        });
        return it("shows the icon on the tab when showIcon is changed to true", function() {
          atom.config.set("tabs.showIcons", true);
          waitsFor(function() {
            return tabBar.tabForItem(item1).updateIconVisibility.callCount > 0;
          });
          return expect(tabBar.find('.tab:eq(0) .title')).not.toHaveClass("hide-icon");
        });
      });
    });
    describe("when the item doesn't have an icon defined", function() {
      it("doesn't display an icon on the tab", function() {
        expect(tabBar.find('.tab:eq(2) .title')).not.toHaveClass("icon");
        return expect(tabBar.find('.tab:eq(2) .title')).not.toHaveClass("icon-squirrel");
      });
      return it("shows the icon on the tab if an icon is defined", function() {
        item2.getIconName = function() {
          return "squirrel";
        };
        item2.emitIconChanged();
        expect(tabBar.find('.tab:eq(2) .title')).toHaveClass("icon");
        return expect(tabBar.find('.tab:eq(2) .title')).toHaveClass("icon-squirrel");
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
        return paneElement.insertBefore(tabBar.element, paneElement.firstChild);
      });
      describe("when tabs:close-tab is fired", function() {
        return it("closes the active tab", function() {
          triggerMouseDownEvent(tabBar.tabForItem(item2), {
            which: 3
          });
          atom.commands.dispatch(tabBar.element, 'tabs:close-tab');
          expect(pane.getItems().length).toBe(2);
          expect(pane.getItems().indexOf(item2)).toBe(-1);
          expect(tabBar.getTabs().length).toBe(2);
          return expect(tabBar.find('.tab:contains(Item 2)')).not.toExist();
        });
      });
      describe("when tabs:close-other-tabs is fired", function() {
        return it("closes all other tabs except the active tab", function() {
          triggerMouseDownEvent(tabBar.tabForItem(item2), {
            which: 3
          });
          atom.commands.dispatch(tabBar.element, 'tabs:close-other-tabs');
          expect(pane.getItems().length).toBe(1);
          expect(tabBar.getTabs().length).toBe(1);
          expect(tabBar.find('.tab:contains(sample.js)')).not.toExist();
          return expect(tabBar.find('.tab:contains(Item 2)')).toExist();
        });
      });
      describe("when tabs:close-tabs-to-right is fired", function() {
        return it("closes only the tabs to the right of the active tab", function() {
          pane.activateItem(editor1);
          triggerMouseDownEvent(tabBar.tabForItem(editor1), {
            which: 3
          });
          atom.commands.dispatch(tabBar.element, 'tabs:close-tabs-to-right');
          expect(pane.getItems().length).toBe(2);
          expect(tabBar.getTabs().length).toBe(2);
          expect(tabBar.find('.tab:contains(Item 2)')).not.toExist();
          return expect(tabBar.find('.tab:contains(Item 1)')).toExist();
        });
      });
      describe("when tabs:close-all-tabs is fired", function() {
        return it("closes all the tabs", function() {
          expect(pane.getItems().length).toBeGreaterThan(0);
          atom.commands.dispatch(tabBar.element, 'tabs:close-all-tabs');
          return expect(pane.getItems().length).toBe(0);
        });
      });
      describe("when tabs:close-saved-tabs is fired", function() {
        return it("closes all the saved tabs", function() {
          item1.isModified = function() {
            return true;
          };
          atom.commands.dispatch(tabBar.element, 'tabs:close-saved-tabs');
          expect(pane.getItems().length).toBe(1);
          return expect(pane.getItems()[0]).toBe(item1);
        });
      });
      describe("when tabs:split-up is fired", function() {
        return it("splits the selected tab up", function() {
          triggerMouseDownEvent(tabBar.tabForItem(item2), {
            which: 3
          });
          expect(atom.workspace.getPanes().length).toBe(1);
          atom.commands.dispatch(tabBar.element, 'tabs:split-up');
          expect(atom.workspace.getPanes().length).toBe(2);
          expect(atom.workspace.getPanes()[1]).toBe(pane);
          return expect(atom.workspace.getPanes()[0].getItems()[0].getTitle()).toBe(item2.getTitle());
        });
      });
      describe("when tabs:split-down is fired", function() {
        return it("splits the selected tab down", function() {
          triggerMouseDownEvent(tabBar.tabForItem(item2), {
            which: 3
          });
          expect(atom.workspace.getPanes().length).toBe(1);
          atom.commands.dispatch(tabBar.element, 'tabs:split-down');
          expect(atom.workspace.getPanes().length).toBe(2);
          expect(atom.workspace.getPanes()[0]).toBe(pane);
          return expect(atom.workspace.getPanes()[1].getItems()[0].getTitle()).toBe(item2.getTitle());
        });
      });
      describe("when tabs:split-left is fired", function() {
        return it("splits the selected tab to the left", function() {
          triggerMouseDownEvent(tabBar.tabForItem(item2), {
            which: 3
          });
          expect(atom.workspace.getPanes().length).toBe(1);
          atom.commands.dispatch(tabBar.element, 'tabs:split-left');
          expect(atom.workspace.getPanes().length).toBe(2);
          expect(atom.workspace.getPanes()[1]).toBe(pane);
          return expect(atom.workspace.getPanes()[0].getItems()[0].getTitle()).toBe(item2.getTitle());
        });
      });
      return describe("when tabs:split-right is fired", function() {
        return it("splits the selected tab to the right", function() {
          triggerMouseDownEvent(tabBar.tabForItem(item2), {
            which: 3
          });
          expect(atom.workspace.getPanes().length).toBe(1);
          atom.commands.dispatch(tabBar.element, 'tabs:split-right');
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
          return expect(tabBar.find('.tab:contains(Item 2)')).not.toExist();
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
          expect(tabBar.find('.tab:contains(sample.js)')).not.toExist();
          return expect(tabBar.find('.tab:contains(Item 2)')).toExist();
        });
      });
      describe("when tabs:close-tabs-to-right is fired", function() {
        return it("closes only the tabs to the right of the active tab", function() {
          pane.activateItem(editor1);
          atom.commands.dispatch(paneElement, 'tabs:close-tabs-to-right');
          expect(pane.getItems().length).toBe(2);
          expect(tabBar.getTabs().length).toBe(2);
          expect(tabBar.find('.tab:contains(Item 2)')).not.toExist();
          return expect(tabBar.find('.tab:contains(Item 1)')).toExist();
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
          return tabBar2 = new TabBarView(pane2);
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
          expect(dragStartEvent.originalEvent.dataTransfer.getData("text/plain")).toEqual(editor1.getPath());
          if (process.platform === 'darwin') {
            return expect(dragStartEvent.originalEvent.dataTransfer.getData("text/uri-list")).toEqual("file://" + (editor1.getPath()));
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
          dropEvent.originalEvent.dataTransfer.setData('from-window-id', tabBar.getWindowId() + 1);
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
          dropEvent.originalEvent.dataTransfer.setData('from-window-id', tabBar.getWindowId() + 1);
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
          dropEvent.originalEvent.dataTransfer.setData('from-window-id', tabBar.getWindowId() + 1);
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
        atom.commands.add(tabBar.element, 'application:new-file', newFileHandler);
        $(tabBar.getTabs()[0]).dblclick();
        expect(newFileHandler.callCount).toBe(0);
        tabBar.dblclick();
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
            tabBar.trigger(buildWheelEvent(120));
            return expect(pane.getActiveItem()).toBe(editor1);
          });
          return it("changes the active tab to the previous tab only after the wheelDelta crosses the threshold", function() {
            expect(pane.getActiveItem()).toBe(item2);
            tabBar.trigger(buildWheelEvent(50));
            expect(pane.getActiveItem()).toBe(item2);
            tabBar.trigger(buildWheelEvent(50));
            expect(pane.getActiveItem()).toBe(item2);
            tabBar.trigger(buildWheelEvent(50));
            return expect(pane.getActiveItem()).toBe(editor1);
          });
        });
        describe("when the mouse wheel scrolls down", function() {
          return it("changes the active tab to the previous tab", function() {
            expect(pane.getActiveItem()).toBe(item2);
            tabBar.trigger(buildWheelEvent(-120));
            return expect(pane.getActiveItem()).toBe(item1);
          });
        });
        describe("when the mouse wheel scrolls up and shift key is pressed", function() {
          return it("does not change the active tab", function() {
            expect(pane.getActiveItem()).toBe(item2);
            tabBar.trigger(buildWheelPlusShiftEvent(120));
            return expect(pane.getActiveItem()).toBe(item2);
          });
        });
        return describe("when the mouse wheel scrolls down and shift key is pressed", function() {
          return it("does not change the active tab", function() {
            expect(pane.getActiveItem()).toBe(item2);
            tabBar.trigger(buildWheelPlusShiftEvent(-120));
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
            tabBar.trigger(buildWheelEvent(120));
            return expect(pane.getActiveItem()).toBe(item2);
          });
        });
        return describe("when the mouse wheel scrolls down one unit", function() {
          return it("does not change the active tab", function() {
            expect(pane.getActiveItem()).toBe(item2);
            tabBar.trigger(buildWheelEvent(-120));
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
          return expect(tabBar.element).not.toHaveClass('hidden');
        });
      });
      return describe("when 1 tab is open", function() {
        return it("shows the tab bar", function() {
          expect(pane.getItems().length).toBe(3);
          pane.destroyItem(item1);
          pane.destroyItem(item2);
          expect(pane.getItems().length).toBe(1);
          return expect(tabBar.element).not.toHaveClass('hidden');
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
          return expect(tabBar.element).not.toHaveClass('hidden');
        });
      });
      return describe("when 1 tab is open", function() {
        return it("hides the tab bar", function() {
          expect(pane.getItems().length).toBe(3);
          pane.destroyItem(item1);
          pane.destroyItem(item2);
          expect(pane.getItems().length).toBe(1);
          return expect(tabBar.element).toHaveClass('hidden');
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
            return atom.project.open('sample.txt').then(function(o) {
              return editor1 = o;
            });
          });
          return runs(function() {
            pane.activateItem(editor1);
            expect(tabBar.find('.tab .temp').length).toBe(1);
            return expect(tabBar.find('.tab:eq(0) .title')).toHaveClass('temp');
          });
        });
      });
      describe("when tabs:keep-preview-tab is trigger on the pane", function() {
        return it("removes the 'temp' class", function() {
          editor1 = null;
          waitsForPromise(function() {
            return atom.project.open('sample.txt').then(function(o) {
              return editor1 = o;
            });
          });
          return runs(function() {
            pane.activateItem(editor1);
            expect(tabBar.find('.tab .temp').length).toBe(1);
            atom.commands.dispatch(atom.views.getView(atom.workspace.getActivePane()), 'tabs:keep-preview-tab');
            return expect(tabBar.find('.tab .temp').length).toBe(0);
          });
        });
      });
      describe("when there is a temp tab already", function() {
        it("it will replace an existing temporary tab", function() {
          var editor2;
          editor1 = null;
          editor2 = null;
          waitsForPromise(function() {
            return atom.project.open('sample.txt').then(function(o) {
              editor1 = o;
              pane.activateItem(editor1);
              return atom.project.open('sample2.txt').then(function(o) {
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
            return atom.project.open('sample.txt').then(function(o) {
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
            return atom.project.open('sample.txt').then(function(o) {
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
            return atom.project.open('sample.txt').then(function(o) {
              return editor1 = o;
            });
          });
          return runs(function() {
            var pane2, tabBar2;
            pane.activateItem(editor1);
            pane2 = pane.splitRight({
              copyActiveItem: true
            });
            tabBar2 = new TabBarView(pane2);
            return expect($(tabBar2.tabForItem(pane2.getActiveItem())).find('.title')).not.toHaveClass('temp');
          });
        });
      });
      describe("when dragging a preview tab to a different pane", function() {
        return it("makes the tab permanent in the other pane", function() {
          editor1 = null;
          waitsForPromise(function() {
            return atom.project.open('sample.txt').then(function(o) {
              return editor1 = o;
            });
          });
          return runs(function() {
            var pane2, tabBar2;
            pane.activateItem(editor1);
            pane2 = pane.splitRight();
            tabBar2 = new TabBarView(pane2);
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
            return atom.project.open('sample.js').then(function(o) {
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
          return expect(tabBar.find('.tab:eq(1) .title')).toHaveClass("status-added");
        });
        it("adds custom style for modified items", function() {
          repository.getCachedPathStatus.andReturn('modified');
          tab.updateVcsStatus(repository);
          return expect(tabBar.find('.tab:eq(1) .title')).toHaveClass("status-modified");
        });
        it("adds custom style for ignored items", function() {
          repository.isPathIgnored.andReturn(true);
          tab.updateVcsStatus(repository);
          return expect(tabBar.find('.tab:eq(1) .title')).toHaveClass("status-ignored");
        });
        return it("does not add any styles for items not in the repository", function() {
          expect(tabBar.find('.tab:eq(0) .title')).not.toHaveClass("status-added");
          expect(tabBar.find('.tab:eq(0) .title')).not.toHaveClass("status-modified");
          return expect(tabBar.find('.tab:eq(0) .title')).not.toHaveClass("status-ignored");
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
          expect(tabBar.find('.tab:eq(1) .title')).not.toHaveClass("status-modified");
          repository.emitDidChangeStatus({
            path: tab.path,
            pathStatus: "modified"
          });
          expect(tabBar.find('.tab:eq(1) .title')).toHaveClass("status-modified");
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
          expect(tabBar.find('.tab:eq(1) .title')).toHaveClass("status-added");
          atom.config.set("tabs.enableVcsColoring", false);
          return expect(tabBar.find('.tab:eq(1) .title')).not.toHaveClass("status-added");
        });
        return it("adds status to the tab if enableVcsColoring is set to true", function() {
          atom.config.set("tabs.enableVcsColoring", false);
          repository.getCachedPathStatus.andReturn('modified');
          expect(tabBar.find('.tab:eq(1) .title')).not.toHaveClass("status-modified");
          atom.config.set("tabs.enableVcsColoring", true);
          waitsFor(function() {
            var _ref4;
            return ((_ref4 = repository.changeStatusCallbacks) != null ? _ref4.length : void 0) > 0;
          });
          return runs(function() {
            return expect(tabBar.find('.tab:eq(1) .title')).toHaveClass("status-modified");
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RhYnMvc3BlYy90YWJzLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDJJQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxPQUFhLE9BQUEsQ0FBUSxzQkFBUixDQUFiLEVBQUMsU0FBQSxDQUFELEVBQUksWUFBQSxJQUFKLENBQUE7O0FBQUEsRUFDQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBREosQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUZQLENBQUE7O0FBQUEsRUFHQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FIUCxDQUFBOztBQUFBLEVBSUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxxQkFBUixDQUpiLENBQUE7O0FBQUEsRUFLQSxPQUFBLEdBQVUsT0FBQSxDQUFRLGlCQUFSLENBTFYsQ0FBQTs7QUFBQSxFQU1BLFFBQXNGLE9BQUEsQ0FBUSxpQkFBUixDQUF0RixFQUFDLDhCQUFBLHFCQUFELEVBQXdCLHdCQUFBLGVBQXhCLEVBQXlDLHdCQUFBLGVBQXpDLEVBQTBELGlDQUFBLHdCQU4xRCxDQUFBOztBQUFBLEVBUUEsUUFBQSxDQUFTLG1CQUFULEVBQThCLFNBQUEsR0FBQTtBQUM1QixRQUFBLGdCQUFBO0FBQUEsSUFBQSxnQkFBQSxHQUFtQixJQUFuQixDQUFBO0FBQUEsSUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsTUFBQSxnQkFBQSxHQUFtQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBSSxDQUFDLFNBQXhCLENBQW5CLENBQUE7QUFBQSxNQUVBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLFdBQXBCLEVBRGM7TUFBQSxD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

//# sourceURL=/Users/ah/.atom/packages/tabs/spec/tabs-spec.coffee
