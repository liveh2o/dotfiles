(function() {
  var $, TabBarView, TabView, View, buildDragEvents, buildWheelEvent, path, triggerMouseDownEvent, _, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $ = _ref.$, View = _ref.View;

  _ = require('underscore-plus');

  path = require('path');

  TabBarView = require('../lib/tab-bar-view');

  TabView = require('../lib/tab-view');

  _ref1 = require("./event-helpers"), triggerMouseDownEvent = _ref1.triggerMouseDownEvent, buildDragEvents = _ref1.buildDragEvents, buildWheelEvent = _ref1.buildWheelEvent;

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
      return it("removes all tab bar views and stops adding them to new panes", function() {
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
      return it("highlights the tab for the active pane item", function() {
        return expect(tabBar.find('.tab:eq(2)')).toHaveClass('active');
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
        return expect(pane.activate.callCount).toBe(2);
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
          dropEvent.originalEvent.dataTransfer.setData('from-process-id', tabBar.getProcessId() + 1);
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
          dropEvent.originalEvent.dataTransfer.setData('from-process-id', tabBar.getProcessId() + 1);
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
          dropEvent.originalEvent.dataTransfer.setData('from-process-id', tabBar.getProcessId() + 1);
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
        return describe("when the mouse wheel scrolls down", function() {
          return it("changes the active tab to the previous tab", function() {
            expect(pane.getActiveItem()).toBe(item2);
            tabBar.trigger(buildWheelEvent(-120));
            return expect(pane.getActiveItem()).toBe(item1);
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
    return describe("when alwaysShowTabBar is false in package settings", function() {
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
  });

}).call(this);
