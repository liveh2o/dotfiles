(function() {
  var $, TabBarView, TabView, View, addItemToPane, buildDragEvents, buildWheelEvent, buildWheelPlusShiftEvent, path, temp, triggerMouseEvent, _, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $ = _ref.$, View = _ref.View;

  _ = require('underscore-plus');

  path = require('path');

  temp = require('temp');

  TabBarView = require('../lib/tab-bar-view');

  TabView = require('../lib/tab-view');

  _ref1 = require("./event-helpers"), triggerMouseEvent = _ref1.triggerMouseEvent, buildDragEvents = _ref1.buildDragEvents, buildWheelEvent = _ref1.buildWheelEvent, buildWheelPlusShiftEvent = _ref1.buildWheelPlusShiftEvent;

  addItemToPane = function(pane, item, index) {
    if (pane.addItem.length === 2) {
      return pane.addItem(item, {
        index: index
      });
    } else if (pane.addItem.length === 3 || pane.addItem.length === 4) {
      return pane.addItem(item, index);
    } else {
      throw new Error("Unspoorted pane.addItem API");
    }
  };

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
    var TestView, deserializerDisposable, editor1, isPending, item1, item2, pane, tabBar, _ref2;
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

      TestView.prototype.initialize = function(title, longTitle, iconName, pathURI) {
        this.title = title;
        this.longTitle = longTitle;
        this.iconName = iconName;
        this.pathURI = pathURI;
      };

      TestView.prototype.getTitle = function() {
        return this.title;
      };

      TestView.prototype.getLongTitle = function() {
        return this.longTitle;
      };

      TestView.prototype.getURI = function() {
        return this.pathURI;
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
      item1 = new TestView('Item 1', void 0, "squirrel", "sample.js");
      item2 = new TestView('Item 2');
      waitsForPromise(function() {
        return atom.workspace.open('sample.js');
      });
      return runs(function() {
        editor1 = atom.workspace.getActiveTextEditor();
        pane = atom.workspace.getActivePane();
        addItemToPane(pane, item1, 0);
        addItemToPane(pane, item2, 2);
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
      it("adds the 'modified' class to the new tab if the item is initially modified", function() {
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
      describe("when addNewTabsAtEnd is set to true in package settings", function() {
        it("adds a tab for the new item at the end of the tab bar", function() {
          var item3;
          atom.config.set("tabs.addNewTabsAtEnd", true);
          item3 = new TestView('Item 3');
          pane.activateItem(item3);
          expect($(tabBar).find('.tab').length).toBe(4);
          return expect($(tabBar.tabAtIndex(3)).find('.title')).toHaveText('Item 3');
        });
        return it("puts the new tab at the last index of the pane's items", function() {
          var item3;
          atom.config.set("tabs.addNewTabsAtEnd", true);
          item3 = new TestView('Item 3');
          pane.activateItem(item1);
          pane.activateItem(item3);
          return expect(pane.getItems()[pane.getItems().length - 1]).toEqual(item3);
        });
      });
      return describe("when addNewTabsAtEnd is set to false in package settings", function() {
        return it("adds a tab for the new item at the same index as the item in the pane", function() {
          var item3;
          atom.config.set("tabs.addNewTabsAtEnd", false);
          pane.activateItem(item1);
          item3 = new TestView('Item 3');
          pane.activateItem(item3);
          expect($(tabBar).find('.tab').length).toBe(4);
          return expect($(tabBar.tabAtIndex(1)).find('.title')).toHaveText('Item 3');
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
      describe("when addNewTabsAtEnd is set to true in package settings", function() {
        return it("updates the order of the tabs to match the new item order", function() {
          atom.config.set("tabs.addNewTabsAtEnd", true);
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
      return describe("when addNewTabsAtEnd is set to false in package settings", function() {
        return it("updates the order of the tabs to match the new item order", function() {
          atom.config.set("tabs.addNewTabsAtEnd", false);
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
      describe("when tabs:split-right is fired", function() {
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
      return describe("when tabs:open-in-new-window is fired", function() {
        return it("opens new window, closes current tab", function() {
          triggerMouseEvent('mousedown', tabBar.tabForItem(item1), {
            which: 3
          });
          expect(atom.workspace.getPanes().length).toBe(1);
          spyOn(atom, 'open');
          atom.commands.dispatch(tabBar, 'tabs:open-in-new-window');
          expect(atom.open).toHaveBeenCalled();
          expect(pane.getItems().length).toBe(2);
          expect(tabBar.getTabs().length).toBe(2);
          expect($(tabBar).find('.tab:contains(Item 2)')).toExist();
          return expect($(tabBar).find('.tab:contains(Item 1)')).not.toExist();
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
    if ((atom.workspace.buildTextEditor().isPending != null) || (atom.workspace.getActivePane().getActiveItem != null)) {
      isPending = function(item) {
        if (item.isPending != null) {
          return item.isPending();
        } else {
          return atom.workspace.getActivePane().getPendingItem() === item;
        }
      };
      describe("when tab's pane item is pending", function() {
        beforeEach(function() {
          return pane.destroyItems();
        });
        describe("when opening a new tab", function() {
          return it("adds tab with class 'temp'", function() {
            editor1 = null;
            waitsForPromise(function() {
              return atom.workspace.open('sample.txt', {
                pending: true
              }).then(function(o) {
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
        describe("when tabs:keep-pending-tab is triggered on the pane", function() {
          return it("terminates pending state on the tab's item", function() {
            editor1 = null;
            waitsForPromise(function() {
              return atom.workspace.open('sample.txt', {
                pending: true
              }).then(function(o) {
                return editor1 = o;
              });
            });
            return runs(function() {
              pane.activateItem(editor1);
              expect(isPending(editor1)).toBe(true);
              atom.commands.dispatch(atom.views.getView(atom.workspace.getActivePane()), 'tabs:keep-pending-tab');
              return expect(isPending(editor1)).toBe(false);
            });
          });
        });
        describe("when there is a temp tab already", function() {
          it("it will replace an existing temporary tab", function() {
            var editor2;
            editor1 = null;
            editor2 = null;
            waitsForPromise(function() {
              return atom.workspace.open('sample.txt', {
                pending: true
              }).then(function(o) {
                editor1 = o;
                return atom.workspace.open('sample2.txt', {
                  pending: true
                }).then(function(o) {
                  return editor2 = o;
                });
              });
            });
            return runs(function() {
              expect(editor1.isDestroyed()).toBe(true);
              expect(tabBar.tabForItem(editor1)).not.toExist();
              return expect($(tabBar.tabForItem(editor2)).find('.title')).toHaveClass('temp');
            });
          });
          return it("makes the tab permanent when double-clicking the tab", function() {
            var editor2;
            editor2 = null;
            waitsForPromise(function() {
              return atom.workspace.open('sample.txt', {
                pending: true
              }).then(function(o) {
                return editor2 = o;
              });
            });
            return runs(function() {
              pane.activateItem(editor2);
              expect($(tabBar.tabForItem(editor2)).find('.title')).toHaveClass('temp');
              triggerMouseEvent('dblclick', tabBar.tabForItem(editor2), {
                which: 1
              });
              return expect($(tabBar.tabForItem(editor2)).find('.title')).not.toHaveClass('temp');
            });
          });
        });
        describe("when editing a file in pending state", function() {
          return it("makes the item and tab permanent", function() {
            editor1 = null;
            waitsForPromise(function() {
              return atom.workspace.open('sample.txt', {
                pending: true
              }).then(function(o) {
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
        describe("when saving a file", function() {
          return it("makes the tab permanent", function() {
            editor1 = null;
            waitsForPromise(function() {
              return atom.workspace.open(path.join(temp.mkdirSync('tabs-'), 'sample.txt'), {
                pending: true
              }).then(function(o) {
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
        describe("when splitting a pending tab", function() {
          editor1 = null;
          beforeEach(function() {
            return waitsForPromise(function() {
              return atom.workspace.open('sample.txt', {
                pending: true
              }).then(function(o) {
                return editor1 = o;
              });
            });
          });
          it("makes the tab permanent in the new pane", function() {
            var newEditor, pane2, tabBar2;
            pane.activateItem(editor1);
            pane2 = pane.splitRight({
              copyActiveItem: true
            });
            tabBar2 = new TabBarView;
            tabBar2.initialize(pane2);
            newEditor = pane2.getActiveItem();
            expect(isPending(newEditor)).toBe(false);
            return expect($(tabBar2.tabForItem(newEditor)).find('.title')).not.toHaveClass('temp');
          });
          return it("keeps the pending tab in the old pane", function() {
            expect(isPending(editor1)).toBe(true);
            return expect($(tabBar.tabForItem(editor1)).find('.title')).toHaveClass('temp');
          });
        });
        return describe("when dragging a pending tab to a different pane", function() {
          return it("makes the tab permanent in the other pane", function() {
            editor1 = null;
            waitsForPromise(function() {
              return atom.workspace.open('sample.txt', {
                pending: true
              }).then(function(o) {
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
      });
    }
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RhYnMvc3BlYy90YWJzLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNKQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxPQUFhLE9BQUEsQ0FBUSxzQkFBUixDQUFiLEVBQUMsU0FBQSxDQUFELEVBQUksWUFBQSxJQUFKLENBQUE7O0FBQUEsRUFDQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBREosQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUZQLENBQUE7O0FBQUEsRUFHQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FIUCxDQUFBOztBQUFBLEVBSUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxxQkFBUixDQUpiLENBQUE7O0FBQUEsRUFLQSxPQUFBLEdBQVUsT0FBQSxDQUFRLGlCQUFSLENBTFYsQ0FBQTs7QUFBQSxFQU1BLFFBQWtGLE9BQUEsQ0FBUSxpQkFBUixDQUFsRixFQUFDLDBCQUFBLGlCQUFELEVBQW9CLHdCQUFBLGVBQXBCLEVBQXFDLHdCQUFBLGVBQXJDLEVBQXNELGlDQUFBLHdCQU50RCxDQUFBOztBQUFBLEVBUUEsYUFBQSxHQUFnQixTQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsS0FBYixHQUFBO0FBR2QsSUFBQSxJQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBYixLQUF1QixDQUExQjthQUNFLElBQUksQ0FBQyxPQUFMLENBQWEsSUFBYixFQUFtQjtBQUFBLFFBQUEsS0FBQSxFQUFPLEtBQVA7T0FBbkIsRUFERjtLQUFBLE1BRUssSUFBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQWIsS0FBdUIsQ0FBdkIsSUFBNEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFiLEtBQXVCLENBQXREO2FBQ0gsSUFBSSxD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

//# sourceURL=/Users/ah/.atom/packages/tabs/spec/tabs-spec.coffee
