(function() {
  var $, TabBarView, TabView, View, addItemToPane, buildDragEvents, buildWheelEvent, buildWheelPlusShiftEvent, layout, path, temp, triggerMouseEvent, _, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $ = _ref.$, View = _ref.View;

  _ = require('underscore-plus');

  path = require('path');

  temp = require('temp');

  TabBarView = require('../lib/tab-bar-view');

  TabView = require('../lib/tab-view');

  layout = require('../lib/layout');

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
    describe("when the mouse is moved over the tab bar", function() {
      return it("fixes the width on every tab", function() {
        var event, initialWidth1, initialWidth2;
        jasmine.attachToDOM(tabBar);
        event = triggerMouseEvent('mouseenter', tabBar);
        initialWidth1 = tabBar.tabAtIndex(0).getBoundingClientRect().width.toFixed(0);
        initialWidth2 = tabBar.tabAtIndex(2).getBoundingClientRect().width.toFixed(0);
        expect(parseFloat(tabBar.tabAtIndex(0).style.maxWidth.replace('px', '')).toFixed(0)).toBe(initialWidth1);
        return expect(parseFloat(tabBar.tabAtIndex(2).style.maxWidth.replace('px', '')).toFixed(0)).toBe(initialWidth2);
      });
    });
    describe("when the mouse is moved away from the tab bar", function() {
      return it("resets the width on every tab", function() {
        var event;
        jasmine.attachToDOM(tabBar);
        event = triggerMouseEvent('mouseenter', tabBar);
        event = triggerMouseEvent('mouseleave', tabBar);
        expect(tabBar.tabAtIndex(0).style.maxWidth).toBe('');
        return expect(tabBar.tabAtIndex(1).style.maxWidth).toBe('');
      });
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

          BadView.prototype.onDidChangePath = function() {};

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
        expect(warnings[1].message).toContain("onDidChangePath");
        expect(warnings[1].object).toBe(badItem);
        expect(warnings[2].message).toContain("onDidChangeIcon");
        expect(warnings[2].object).toBe(badItem);
        expect(warnings[3].message).toContain("onDidChangeModified");
        expect(warnings[3].object).toBe(badItem);
        expect(warnings[4].message).toContain("onDidSave");
        return expect(warnings[4].object).toBe(badItem);
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
        return paneElement.insertBefore(tabBar, paneElement.firstChild);
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
      describe("when tabs:close-tabs-to-left is fired", function() {
        return it("closes only the tabs to the left of the active tab", function() {
          pane.activateItem(editor1);
          triggerMouseEvent('mousedown', tabBar.tabForItem(editor1), {
            which: 3
          });
          atom.commands.dispatch(tabBar, 'tabs:close-tabs-to-left');
          expect(pane.getItems().length).toBe(2);
          expect(tabBar.getTabs().length).toBe(2);
          expect($(tabBar).find('.tab:contains(Item 2)')).toExist();
          return expect($(tabBar).find('.tab:contains(Item 1)')).not.toExist();
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
        describe("by right-clicking on a tab", function() {
          beforeEach(function() {
            triggerMouseEvent('mousedown', tabBar.tabForItem(item1), {
              which: 3
            });
            return expect(atom.workspace.getPanes().length).toBe(1);
          });
          return it("opens new window, closes current tab", function() {
            spyOn(atom, 'open');
            atom.commands.dispatch(tabBar, 'tabs:open-in-new-window');
            expect(atom.open).toHaveBeenCalled();
            expect(pane.getItems().length).toBe(2);
            expect(tabBar.getTabs().length).toBe(2);
            expect($(tabBar).find('.tab:contains(Item 2)')).toExist();
            return expect($(tabBar).find('.tab:contains(Item 1)')).not.toExist();
          });
        });
        return describe("from the command palette", function() {
          return it("does nothing", function() {
            spyOn(atom, 'open');
            atom.commands.dispatch(tabBar, 'tabs:open-in-new-window');
            return expect(atom.open).not.toHaveBeenCalled();
          });
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
        describe("when the tab is dragged to an empty pane", function() {
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
        return describe("when addNewTabsAtEnd is set to true in package settings", function() {
          return it("moves the dragged tab to the desired index in the new pane", function() {
            var dragStartEvent, dropEvent, _ref4;
            atom.config.set("tabs.addNewTabsAtEnd", true);
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
            _ref4 = buildDragEvents(tabBar2.tabAtIndex(0), tabBar.tabAtIndex(0)), dragStartEvent = _ref4[0], dropEvent = _ref4[1];
            tabBar2.onDragStart(dragStartEvent);
            tabBar.onDrop(dropEvent);
            expect(tabBar.getTabs().map(function(tab) {
              return tab.textContent;
            })).toEqual(["Item 1", "Item 2", "sample.js", "Item 2"]);
            expect(pane.getItems()).toEqual([item1, item2b, editor1, item2]);
            expect(pane.getActiveItem()).toBe(item2b);
            return atom.config.set("tabs.addNewTabsAtEnd", false);
          });
        });
      });
      describe("when a tab is dragged over a pane item", function() {
        it("draws an overlay over the item", function() {
          var tab;
          expect(tabBar.getTabs().map(function(tab) {
            return tab.textContent;
          })).toEqual(["Item 1", "sample.js", "Item 2"]);
          tab = tabBar.tabAtIndex(2);
          layout.test = {
            pane: pane,
            itemView: atom.views.getView(pane).querySelector('.item-views'),
            rect: {
              top: 0,
              left: 0,
              width: 100,
              height: 100
            }
          };
          expect(layout.view.classList.contains('visible')).toBe(false);
          tab.ondrag({
            target: tab,
            clientX: 50,
            clientY: 50
          });
          expect(layout.view.classList.contains('visible')).toBe(true);
          expect(layout.view.style.height).toBe("100px");
          expect(layout.view.style.width).toBe("100px");
          delete layout.test.pane;
          tab.ondrag({
            target: tab,
            clientX: 200,
            clientY: 200
          });
          return expect(layout.view.classList.contains('visible')).toBe(false);
        });
        it("cleaves the pane in twain", function() {
          var tab;
          expect(tabBar.getTabs().map(function(tab) {
            return tab.textContent;
          })).toEqual(["Item 1", "sample.js", "Item 2"]);
          tab = tabBar.tabAtIndex(2);
          layout.test = {
            pane: pane,
            itemView: atom.views.getView(pane).querySelector('.item-views'),
            rect: {
              top: 0,
              left: 0,
              width: 100,
              height: 100
            }
          };
          tab.ondrag({
            target: tab,
            clientX: 80,
            clientY: 50
          });
          tab.ondragend({
            target: tab,
            clientX: 80,
            clientY: 50
          });
          expect(atom.workspace.getPanes().length).toEqual(2);
          expect(tabBar.getTabs().map(function(tab) {
            return tab.textContent;
          })).toEqual(["Item 1", "sample.js"]);
          return expect(atom.workspace.getActivePane().getItems().length).toEqual(1);
        });
        describe("when the dragged tab is the only one in the pane", function() {
          return it("does nothing", function() {
            var tab;
            tabBar.getTabs()[0].querySelector('.close-icon').click();
            tabBar.getTabs()[1].querySelector('.close-icon').click();
            expect(tabBar.getTabs().map(function(tab) {
              return tab.textContent;
            })).toEqual(["sample.js"]);
            tab = tabBar.tabAtIndex(0);
            layout.test = {
              pane: pane,
              itemView: atom.views.getView(pane).querySelector('.item-views'),
              rect: {
                top: 0,
                left: 0,
                width: 100,
                height: 100
              }
            };
            tab.ondrag({
              target: tab,
              clientX: 80,
              clientY: 50
            });
            tab.ondragend({
              target: tab,
              clientX: 80,
              clientY: 50
            });
            expect(atom.workspace.getPanes().length).toEqual(1);
            return expect(tabBar.getTabs().map(function(tab) {
              return tab.textContent;
            })).toEqual(["sample.js"]);
          });
        });
        return describe("when the pane is empty", function() {
          return it("moves the tab to the target pane", function() {
            var tab, toPane;
            toPane = pane.splitDown();
            expect(tabBar.getTabs().map(function(tab) {
              return tab.textContent;
            })).toEqual(["Item 1", "sample.js", "Item 2"]);
            expect(toPane.getItems().length).toBe(0);
            tab = tabBar.tabAtIndex(2);
            layout.test = {
              pane: toPane,
              itemView: atom.views.getView(toPane).querySelector('.item-views'),
              rect: {
                top: 0,
                left: 0,
                width: 100,
                height: 100
              }
            };
            tab.ondrag({
              target: tab,
              clientX: 80,
              clientY: 50
            });
            tab.ondragend({
              target: tab,
              clientX: 80,
              clientY: 50
            });
            expect(atom.workspace.getPanes().length).toEqual(2);
            expect(tabBar.getTabs().map(function(tab) {
              return tab.textContent;
            })).toEqual(["Item 1", "sample.js"]);
            return expect(atom.workspace.getActivePane().getItems().length).toEqual(1);
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RhYnMvc3BlYy90YWJzLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDhKQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxPQUFhLE9BQUEsQ0FBUSxzQkFBUixDQUFiLEVBQUMsU0FBQSxDQUFELEVBQUksWUFBQSxJQUFKLENBQUE7O0FBQUEsRUFDQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBREosQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUZQLENBQUE7O0FBQUEsRUFHQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FIUCxDQUFBOztBQUFBLEVBSUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxxQkFBUixDQUpiLENBQUE7O0FBQUEsRUFLQSxPQUFBLEdBQVUsT0FBQSxDQUFRLGlCQUFSLENBTFYsQ0FBQTs7QUFBQSxFQU1BLE1BQUEsR0FBUyxPQUFBLENBQVEsZUFBUixDQU5ULENBQUE7O0FBQUEsRUFPQSxRQUFrRixPQUFBLENBQVEsaUJBQVIsQ0FBbEYsRUFBQywwQkFBQSxpQkFBRCxFQUFvQix3QkFBQSxlQUFwQixFQUFxQyx3QkFBQSxlQUFyQyxFQUFzRCxpQ0FBQSx3QkFQdEQsQ0FBQTs7QUFBQSxFQVNBLGFBQUEsR0FBZ0IsU0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLEtBQWIsR0FBQTtBQUdkLElBQUEsSUFBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQWIsS0FBdUIsQ0FBMUI7YUFDRSxJQUFJLENBQUMsT0FBTCxDQUFhLElBQWIsRUFBbUI7QUFBQSxRQUFBLEtBQUEsRUFBTyxLQUFQO09BQW5CLEVBREY7S0FBQSxNQUVLLElBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFiLEtBQXVCLENBQXZCLElBQTRCLElB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

//# sourceURL=/Users/ah/.atom/packages/tabs/spec/tabs-spec.coffee
