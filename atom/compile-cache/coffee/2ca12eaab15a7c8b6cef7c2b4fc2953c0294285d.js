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
    if (atom.workspace.buildTextEditor().isPending != null) {
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
              expect(editor1.isPending()).toBe(true);
              atom.commands.dispatch(atom.views.getView(atom.workspace.getActivePane()), 'tabs:keep-pending-tab');
              return expect(editor1.isPending()).toBe(false);
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
        describe("when switching from a pending tab to a permanent tab", function() {
          return it("keeps the pending tab open", function() {
            var editor2;
            editor1 = null;
            editor2 = null;
            waitsForPromise(function() {
              return atom.workspace.open('sample.txt').then(function(o) {
                return editor1 = o;
              });
            });
            waitsForPromise(function() {
              return atom.workspace.open('sample2.txt', {
                pending: true
              }).then(function(o) {
                return editor2 = o;
              });
            });
            return runs(function() {
              pane.activateItem(editor1);
              expect(pane.getItems().length).toBe(2);
              expect(pane.getItems()).toEqual([editor1, editor2]);
              return expect($(tabBar.tabForItem(editor2)).find('.title')).toHaveClass('temp');
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
            expect(newEditor.isPending()).toBe(false);
            return expect($(tabBar2.tabForItem(newEditor)).find('.title')).not.toHaveClass('temp');
          });
          return it("keeps the pending tab in the old pane", function() {
            expect(editor1.isPending()).toBe(true);
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RhYnMvc3BlYy90YWJzLXNwZWMuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHVJQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxPQUFhLE9BQUEsQ0FBUSxzQkFBUixDQUFiLEVBQUMsU0FBQSxDQUFELEVBQUksWUFBQSxJQUFKLENBQUE7O0FBQUEsRUFDQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBREosQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUZQLENBQUE7O0FBQUEsRUFHQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FIUCxDQUFBOztBQUFBLEVBSUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxxQkFBUixDQUpiLENBQUE7O0FBQUEsRUFLQSxPQUFBLEdBQVUsT0FBQSxDQUFRLGlCQUFSLENBTFYsQ0FBQTs7QUFBQSxFQU1BLFFBQWtGLE9BQUEsQ0FBUSxpQkFBUixDQUFsRixFQUFDLDBCQUFBLGlCQUFELEVBQW9CLHdCQUFBLGVBQXBCLEVBQXFDLHdCQUFBLGVBQXJDLEVBQXNELGlDQUFBLHdCQU50RCxDQUFBOztBQUFBLEVBUUEsUUFBQSxDQUFTLG1CQUFULEVBQThCLFNBQUEsR0FBQTtBQUM1QixRQUFBLGdCQUFBO0FBQUEsSUFBQSxnQkFBQSxHQUFtQixJQUFuQixDQUFBO0FBQUEsSUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsTUFBQSxnQkFBQSxHQUFtQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBSSxDQUFDLFNBQXhCLENBQW5CLENBQUE7QUFBQSxNQUVBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO2VBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLFdBQXBCLEVBRGM7TUFBQSxDQUFoQixDQUZBLENBQUE7YUFLQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtlQUNkLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixNQUE5QixFQURjO01BQUEsQ0FBaEIsRUFOUztJQUFBLENBQVgsQ0FGQSxDQUFBO0FBQUEsSUFXQSxRQUFBLENBQVMsYUFBVCxFQUF3QixTQUFBLEdBQUE7YUFDdEIsRUFBQSxDQUFHLDhDQUFILEVBQW1ELFNBQUEsR0FBQTtBQUNqRCxZQUFBLElBQUE7QUFBQSxRQUFBLE1BQUEsQ0FBTyxnQkFBZ0IsQ0FBQyxnQkFBakIsQ0FBa0MsT0FBbEMsQ0FBMEMsQ0FBQyxNQUFsRCxDQUF5RCxDQUFDLElBQTFELENBQStELENBQS9ELENBQUEsQ0FBQTtBQUFBLFFBQ0EsTUFBQSxDQUFPLGdCQUFnQixDQUFDLGdCQUFqQixDQUFrQyxrQkFBbEMsQ0FBcUQsQ0FBQyxNQUE3RCxDQUFvRSxDQUFDLElBQXJFLENBQTBFLENBQTFFLENBREEsQ0FBQTtBQUFBLFFBR0EsSUFBQSxHQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBZixDQUFBLENBSFAsQ0FBQTtBQUFBLFFBSUEsSUFBSSxDQUFDLFVBQUwsQ0FBQSxDQUpBLENBQUE7QUFBQSxRQU1BLE1BQUEsQ0FBTyxnQkFBZ0IsQ0FBQyxnQkFBakIsQ0FBa0MsT0FBbEMsQ0FBMEMsQ0FBQyxNQUFsRCxDQUF5RCxDQUFDLElBQTFELENBQStELENBQS9ELENBTkEsQ0FBQTtlQU9BLE1BQUEsQ0FBTyxnQkFBZ0IsQ0FBQyxnQkFBakIsQ0FBa0Msa0JBQWxDLENBQXFELENBQUMsTUFBN0QsQ0FBb0UsQ0FBQyxJQUFyRSxDQUEwRSxDQUExRSxFQVJpRDtNQUFBLENBQW5ELEVBRHNCO0lBQUEsQ0FBeEIsQ0FYQSxDQUFBO1dBc0JBLFFBQUEsQ0FBUyxlQUFULEVBQTBCLFNBQUEsR0FBQTthQUN4QixFQUFBLENBQUcsOERBQUgsRUFBbUUsU0FBQSxHQUFBO0FBQ2pFLFlBQUEsSUFBQTtBQUFBLFFBQUEsSUFBQSxHQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBZixDQUFBLENBQVAsQ0FBQTtBQUFBLFFBQ0EsSUFBSSxDQUFDLFVBQUwsQ0FBQSxDQURBLENBQUE7QUFBQSxRQUVBLE1BQUEsQ0FBTyxnQkFBZ0IsQ0FBQyxnQkFBakIsQ0FBa0MsT0FBbEMsQ0FBMEMsQ0FBQyxNQUFsRCxDQUF5RCxDQUFDLElBQTFELENBQStELENBQS9ELENBRkEsQ0FBQTtBQUFBLFFBR0EsTUFBQSxDQUFPLGdCQUFnQixDQUFDLGdCQUFqQixDQUFrQyxrQkFBbEMsQ0FBcUQsQ0FBQyxNQUE3RCxDQUFvRSxDQUFDLElBQXJFLENBQTBFLENBQTFFLENBSEEsQ0FBQTtBQUFBLFFBS0EsSUFBSSxDQUFDLFFBQVEsQ0FBQyxpQkFBZCxDQUFnQyxNQUFoQyxDQUxBLENBQUE7QUFBQSxRQU1BLE1BQUEsQ0FBTyxnQkFBZ0IsQ0FBQyxnQkFBakIsQ0FBa0MsT0FBbEMsQ0FBMEMsQ0FBQyxNQUFsRCxDQUF5RCxDQUFDLElBQTFELENBQStELENBQS9ELENBTkEsQ0FBQTtBQUFBLFFBT0EsTUFBQSxDQUFPLGdCQUFnQixDQUFDLGdCQUFqQixDQUFrQyxrQkFBbEMsQ0FBcUQsQ0FBQyxNQUE3RCxDQUFvRSxDQUFDLElBQXJFLENBQTBFLENBQTFFLENBUEEsQ0FBQTtBQUFBLFFBU0EsSUFBSSxDQUFDLFVBQUwsQ0FBQSxDQVRBLENBQUE7QUFBQSxRQVVBLE1BQUEsQ0FBTyxnQkFBZ0IsQ0FBQyxnQkFBakIsQ0FBa0MsT0FBbEMsQ0FBMEMsQ0FBQyxNQUFsRCxDQUF5RCxDQUFDLElBQTFELENBQStELENBQS9ELENBVkEsQ0FBQTtlQVdBLE1BQUEsQ0FBTyxnQkFBZ0IsQ0FBQyxnQkFBakIsQ0FBa0Msa0JBQWxDLENBQXFELENBQUMsTUFBN0QsQ0FBb0UsQ0FBQyxJQUFyRSxDQUEwRSxDQUExRSxFQVppRTtNQUFBLENBQW5FLEVBRHdCO0lBQUEsQ0FBMUIsRUF2QjRCO0VBQUEsQ0FBOUIsQ0FSQSxDQUFBOztBQUFBLEVBOENBLFFBQUEsQ0FBUyxZQUFULEVBQXVCLFNBQUEsR0FBQTtBQUNyQixRQUFBLDRFQUFBO0FBQUEsSUFBQSxRQUFnRSxFQUFoRSxFQUFDLGlDQUFELEVBQXlCLGdCQUF6QixFQUFnQyxnQkFBaEMsRUFBdUMsa0JBQXZDLEVBQWdELGVBQWhELEVBQXNELGlCQUF0RCxDQUFBO0FBQUEsSUFFTTtBQUNKLGlDQUFBLENBQUE7Ozs7T0FBQTs7QUFBQSxNQUFBLFFBQUMsQ0FBQSxXQUFELEdBQWMsU0FBQyxJQUFELEdBQUE7QUFBa0MsWUFBQSwwQkFBQTtBQUFBLFFBQWhDLGFBQUEsT0FBTyxpQkFBQSxXQUFXLGdCQUFBLFFBQWMsQ0FBQTtlQUFJLElBQUEsUUFBQSxDQUFTLEtBQVQsRUFBZ0IsU0FBaEIsRUFBMkIsUUFBM0IsRUFBdEM7TUFBQSxDQUFkLENBQUE7O0FBQUEsTUFDQSxRQUFDLENBQUEsT0FBRCxHQUFVLFNBQUMsS0FBRCxHQUFBO2VBQVcsSUFBQyxDQUFBLEdBQUQsQ0FBSyxLQUFMLEVBQVg7TUFBQSxDQURWLENBQUE7O0FBQUEseUJBRUEsVUFBQSxHQUFZLFNBQUUsS0FBRixFQUFVLFNBQVYsRUFBc0IsUUFBdEIsR0FBQTtBQUFpQyxRQUFoQyxJQUFDLENBQUEsUUFBQSxLQUErQixDQUFBO0FBQUEsUUFBeEIsSUFBQyxDQUFBLFlBQUEsU0FBdUIsQ0FBQTtBQUFBLFFBQVosSUFBQyxDQUFBLFdBQUEsUUFBVyxDQUFqQztNQUFBLENBRlosQ0FBQTs7QUFBQSx5QkFHQSxRQUFBLEdBQVUsU0FBQSxHQUFBO2VBQUcsSUFBQyxDQUFBLE1BQUo7TUFBQSxDQUhWLENBQUE7O0FBQUEseUJBSUEsWUFBQSxHQUFjLFNBQUEsR0FBQTtlQUFHLElBQUMsQ0FBQSxVQUFKO01BQUEsQ0FKZCxDQUFBOztBQUFBLHlCQUtBLFdBQUEsR0FBYSxTQUFBLEdBQUE7ZUFBRyxJQUFDLENBQUEsU0FBSjtNQUFBLENBTGIsQ0FBQTs7QUFBQSx5QkFNQSxTQUFBLEdBQVcsU0FBQSxHQUFBO2VBQUc7QUFBQSxVQUFDLFlBQUEsRUFBYyxVQUFmO0FBQUEsVUFBNEIsT0FBRCxJQUFDLENBQUEsS0FBNUI7QUFBQSxVQUFvQyxXQUFELElBQUMsQ0FBQSxTQUFwQztBQUFBLFVBQWdELFVBQUQsSUFBQyxDQUFBLFFBQWhEO1VBQUg7TUFBQSxDQU5YLENBQUE7O0FBQUEseUJBT0EsZ0JBQUEsR0FBa0IsU0FBQyxRQUFELEdBQUE7O1VBQ2hCLElBQUMsQ0FBQSxpQkFBa0I7U0FBbkI7QUFBQSxRQUNBLElBQUMsQ0FBQSxjQUFjLENBQUMsSUFBaEIsQ0FBcUIsUUFBckIsQ0FEQSxDQUFBO2VBRUE7QUFBQSxVQUFBLE9BQUEsRUFBUyxDQUFBLFNBQUEsS0FBQSxHQUFBO21CQUFBLFNBQUEsR0FBQTtxQkFBRyxDQUFDLENBQUMsTUFBRixDQUFTLEtBQUMsQ0FBQSxjQUFWLEVBQTBCLFFBQTFCLEVBQUg7WUFBQSxFQUFBO1VBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFUO1VBSGdCO01BQUEsQ0FQbEIsQ0FBQTs7QUFBQSx5QkFXQSxnQkFBQSxHQUFrQixTQUFBLEdBQUE7QUFDaEIsWUFBQSwwQ0FBQTtBQUFBO0FBQUE7YUFBQSw0Q0FBQTsrQkFBQTtBQUFBLHdCQUFBLFFBQUEsQ0FBQSxFQUFBLENBQUE7QUFBQTt3QkFEZ0I7TUFBQSxDQVhsQixDQUFBOztBQUFBLHlCQWFBLGVBQUEsR0FBaUIsU0FBQyxRQUFELEdBQUE7O1VBQ2YsSUFBQyxDQUFBLGdCQUFpQjtTQUFsQjtBQUFBLFFBQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxJQUFmLENBQW9CLFFBQXBCLENBREEsQ0FBQTtlQUVBO0FBQUEsVUFBQSxPQUFBLEVBQVMsQ0FBQSxTQUFBLEtBQUEsR0FBQTttQkFBQSxTQUFBLEdBQUE7cUJBQUcsQ0FBQyxDQUFDLE1BQUYsQ0FBUyxLQUFDLENBQUEsYUFBVixFQUF5QixRQUF6QixFQUFIO1lBQUEsRUFBQTtVQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBVDtVQUhlO01BQUEsQ0FiakIsQ0FBQTs7QUFBQSx5QkFpQkEsZUFBQSxHQUFpQixTQUFBLEdBQUE7QUFDZixZQUFBLDBDQUFBO0FBQUE7QUFBQTthQUFBLDRDQUFBOytCQUFBO0FBQUEsd0JBQUEsUUFBQSxDQUFBLEVBQUEsQ0FBQTtBQUFBO3dCQURlO01BQUEsQ0FqQmpCLENBQUE7O0FBQUEseUJBbUJBLG1CQUFBLEdBQXFCLFNBQUEsR0FBQTtlQUNuQjtBQUFBLFVBQUEsT0FBQSxFQUFTLFNBQUEsR0FBQSxDQUFUO1VBRG1CO01BQUEsQ0FuQnJCLENBQUE7O3NCQUFBOztPQURxQixLQUZ2QixDQUFBO0FBQUEsSUF5QkEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULE1BQUEsc0JBQUEsR0FBeUIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFuQixDQUF1QixRQUF2QixDQUF6QixDQUFBO0FBQUEsTUFDQSxLQUFBLEdBQVksSUFBQSxRQUFBLENBQVMsUUFBVCxFQUFtQixNQUFuQixFQUE4QixVQUE5QixDQURaLENBQUE7QUFBQSxNQUVBLEtBQUEsR0FBWSxJQUFBLFFBQUEsQ0FBUyxRQUFULENBRlosQ0FBQTtBQUFBLE1BSUEsZUFBQSxDQUFnQixTQUFBLEdBQUE7ZUFDZCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsV0FBcEIsRUFEYztNQUFBLENBQWhCLENBSkEsQ0FBQTthQU9BLElBQUEsQ0FBSyxTQUFBLEdBQUE7QUFDSCxRQUFBLE9BQUEsR0FBVSxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBVixDQUFBO0FBQUEsUUFDQSxJQUFBLEdBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQUEsQ0FEUCxDQUFBO0FBQUEsUUFFQSxJQUFJLENBQUMsT0FBTCxDQUFhLEtBQWIsRUFBb0IsQ0FBcEIsQ0FGQSxDQUFBO0FBQUEsUUFHQSxJQUFJLENBQUMsT0FBTCxDQUFhLEtBQWIsRUFBb0IsQ0FBcEIsQ0FIQSxDQUFBO0FBQUEsUUFJQSxJQUFJLENBQUMsWUFBTCxDQUFrQixLQUFsQixDQUpBLENBQUE7QUFBQSxRQUtBLE1BQUEsR0FBUyxHQUFBLENBQUEsVUFMVCxDQUFBO2VBTUEsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsSUFBbEIsRUFQRztNQUFBLENBQUwsRUFSUztJQUFBLENBQVgsQ0F6QkEsQ0FBQTtBQUFBLElBMENBLFNBQUEsQ0FBVSxTQUFBLEdBQUE7YUFDUixzQkFBc0IsQ0FBQyxPQUF2QixDQUFBLEVBRFE7SUFBQSxDQUFWLENBMUNBLENBQUE7QUFBQSxJQTZDQSxRQUFBLENBQVMsbUJBQVQsRUFBOEIsU0FBQSxHQUFBO0FBQzVCLE1BQUEsRUFBQSxDQUFHLDBEQUFILEVBQStELFNBQUEsR0FBQTtBQUM3RCxRQUFBLE1BQUEsQ0FBTyxJQUFJLENBQUMsUUFBTCxDQUFBLENBQWUsQ0FBQyxNQUF2QixDQUE4QixDQUFDLElBQS9CLENBQW9DLENBQXBDLENBQUEsQ0FBQTtBQUFBLFFBQ0EsTUFBQSxDQUFPLENBQUEsQ0FBRSxNQUFGLENBQVMsQ0FBQyxJQUFWLENBQWUsTUFBZixDQUFzQixDQUFDLE1BQTlCLENBQXFDLENBQUMsSUFBdEMsQ0FBMkMsQ0FBM0MsQ0FEQSxDQUFBO0FBQUEsUUFHQSxNQUFBLENBQU8sQ0FBQSxDQUFFLE1BQUYsQ0FBUyxDQUFDLElBQVYsQ0FBZSxtQkFBZixDQUFtQyxDQUFDLElBQXBDLENBQUEsQ0FBUCxDQUFrRCxDQUFDLElBQW5ELENBQXdELEtBQUssQ0FBQyxRQUFOLENBQUEsQ0FBeEQsQ0FIQSxDQUFBO0FBQUEsUUFJQSxNQUFBLENBQU8sQ0FBQSxDQUFFLE1BQUYsQ0FBUyxDQUFDLElBQVYsQ0FBZSxtQkFBZixDQUFQLENBQTJDLENBQUMsR0FBRyxDQUFDLFVBQWhELENBQTJELFdBQTNELENBSkEsQ0FBQTtBQUFBLFFBS0EsTUFBQSxDQUFPLENBQUEsQ0FBRSxNQUFGLENBQVMsQ0FBQyxJQUFWLENBQWUsbUJBQWYsQ0FBUCxDQUEyQyxDQUFDLEdBQUcsQ0FBQyxVQUFoRCxDQUEyRCxXQUEzRCxDQUxBLENBQUE7QUFBQSxRQU1BLE1BQUEsQ0FBTyxDQUFBLENBQUUsTUFBRixDQUFTLENBQUMsSUFBVixDQUFlLFlBQWYsQ0FBUCxDQUFvQyxDQUFDLFVBQXJDLENBQWdELFdBQWhELEVBQTZELFVBQTdELENBTkEsQ0FBQTtBQUFBLFFBUUEsTUFBQSxDQUFPLENBQUEsQ0FBRSxNQUFGLENBQVMsQ0FBQyxJQUFWLENBQWUsbUJBQWYsQ0FBbUMsQ0FBQyxJQUFwQyxDQUFBLENBQVAsQ0FBa0QsQ0FBQyxJQUFuRCxDQUF3RCxPQUFPLENBQUMsUUFBUixDQUFBLENBQXhELENBUkEsQ0FBQTtBQUFBLFFBU0EsTUFBQSxDQUFPLENBQUEsQ0FBRSxNQUFGLENBQVMsQ0FBQyxJQUFWLENBQWUsbUJBQWYsQ0FBUCxDQUEyQyxDQUFDLFVBQTVDLENBQXVELFdBQXZELEVBQW9FLElBQUksQ0FBQyxRQUFMLENBQWMsT0FBTyxDQUFDLE9BQVIsQ0FBQSxDQUFkLENBQXBFLENBVEEsQ0FBQTtBQUFBLFFBVUEsTUFBQSxDQUFPLENBQUEsQ0FBRSxNQUFGLENBQVMsQ0FBQyxJQUFWLENBQWUsbUJBQWYsQ0FBUCxDQUEyQyxDQUFDLFVBQTVDLENBQXVELFdBQXZELEVBQW9FLE9BQU8sQ0FBQyxPQUFSLENBQUEsQ0FBcEUsQ0FWQSxDQUFBO0FBQUEsUUFXQSxNQUFBLENBQU8sQ0FBQSxDQUFFLE1BQUYsQ0FBUyxDQUFDLElBQVYsQ0FBZSxZQUFmLENBQVAsQ0FBb0MsQ0FBQyxVQUFyQyxDQUFnRCxXQUFoRCxFQUE2RCxZQUE3RCxDQVhBLENBQUE7QUFBQSxRQWFBLE1BQUEsQ0FBTyxDQUFBLENBQUUsTUFBRixDQUFTLENBQUMsSUFBVixDQUFlLG1CQUFmLENBQW1DLENBQUMsSUFBcEMsQ0FBQSxDQUFQLENBQWtELENBQUMsSUFBbkQsQ0FBd0QsS0FBSyxDQUFDLFFBQU4sQ0FBQSxDQUF4RCxDQWJBLENBQUE7QUFBQSxRQWNBLE1BQUEsQ0FBTyxDQUFBLENBQUUsTUFBRixDQUFTLENBQUMsSUFBVixDQUFlLG1CQUFmLENBQVAsQ0FBMkMsQ0FBQyxHQUFHLENBQUMsVUFBaEQsQ0FBMkQsV0FBM0QsQ0FkQSxDQUFBO0FBQUEsUUFlQSxNQUFBLENBQU8sQ0FBQSxDQUFFLE1BQUYsQ0FBUyxDQUFDLElBQVYsQ0FBZSxtQkFBZixDQUFQLENBQTJDLENBQUMsR0FBRyxDQUFDLFVBQWhELENBQTJELFdBQTNELENBZkEsQ0FBQTtlQWdCQSxNQUFBLENBQU8sQ0FBQSxDQUFFLE1BQUYsQ0FBUyxDQUFDLElBQVYsQ0FBZSxZQUFmLENBQVAsQ0FBb0MsQ0FBQyxVQUFyQyxDQUFnRCxXQUFoRCxFQUE2RCxVQUE3RCxFQWpCNkQ7TUFBQSxDQUEvRCxDQUFBLENBQUE7QUFBQSxNQW1CQSxFQUFBLENBQUcsNkNBQUgsRUFBa0QsU0FBQSxHQUFBO2VBQ2hELE1BQUEsQ0FBTyxDQUFBLENBQUUsTUFBRixDQUFTLENBQUMsSUFBVixDQUFlLFlBQWYsQ0FBUCxDQUFvQyxDQUFDLFdBQXJDLENBQWlELFFBQWpELEVBRGdEO01BQUEsQ0FBbEQsQ0FuQkEsQ0FBQTthQXNCQSxFQUFBLENBQUcscUVBQUgsRUFBMEUsU0FBQSxHQUFBO0FBQ3hFLFlBQUEsMEJBQUE7QUFBQSxRQUFNO0FBQ0osb0NBQUEsQ0FBQTs7OztXQUFBOztBQUFBLFVBQUEsT0FBQyxDQUFBLE9BQUQsR0FBVSxTQUFDLEtBQUQsR0FBQTttQkFBVyxJQUFDLENBQUEsR0FBRCxDQUFLLEtBQUwsRUFBWDtVQUFBLENBQVYsQ0FBQTs7QUFBQSw0QkFDQSxRQUFBLEdBQVUsU0FBQSxHQUFBO21CQUFHLFdBQUg7VUFBQSxDQURWLENBQUE7O0FBQUEsNEJBRUEsZ0JBQUEsR0FBa0IsU0FBQSxHQUFBLENBRmxCLENBQUE7O0FBQUEsNEJBR0EsZUFBQSxHQUFpQixTQUFBLEdBQUEsQ0FIakIsQ0FBQTs7QUFBQSw0QkFJQSxtQkFBQSxHQUFxQixTQUFBLEdBQUEsQ0FKckIsQ0FBQTs7QUFBQSw0QkFLQSxTQUFBLEdBQVcsU0FBQSxHQUFBLENBTFgsQ0FBQTs7eUJBQUE7O1dBRG9CLEtBQXRCLENBQUE7QUFBQSxRQVFBLFFBQUEsR0FBVyxFQVJYLENBQUE7QUFBQSxRQVNBLEtBQUEsQ0FBTSxPQUFOLEVBQWUsTUFBZixDQUFzQixDQUFDLFdBQXZCLENBQW1DLFNBQUMsT0FBRCxFQUFVLE1BQVYsR0FBQTtpQkFDakMsUUFBUSxDQUFDLElBQVQsQ0FBYztBQUFBLFlBQUMsU0FBQSxPQUFEO0FBQUEsWUFBVSxRQUFBLE1BQVY7V0FBZCxFQURpQztRQUFBLENBQW5DLENBVEEsQ0FBQTtBQUFBLFFBWUEsT0FBQSxHQUFjLElBQUEsT0FBQSxDQUFRLFFBQVIsQ0FaZCxDQUFBO0FBQUEsUUFhQSxJQUFJLENBQUMsT0FBTCxDQUFhLE9BQWIsQ0FiQSxDQUFBO0FBQUEsUUFlQSxNQUFBLENBQU8sUUFBUyxDQUFBLENBQUEsQ0FBRSxDQUFDLE9BQW5CLENBQTJCLENBQUMsU0FBNUIsQ0FBc0Msa0JBQXRDLENBZkEsQ0FBQTtBQUFBLFFBZ0JBLE1BQUEsQ0FBTyxRQUFTLENBQUEsQ0FBQSxDQUFFLENBQUMsTUFBbkIsQ0FBMEIsQ0FBQyxJQUEzQixDQUFnQyxPQUFoQyxDQWhCQSxDQUFBO0FBQUEsUUFrQkEsTUFBQSxDQUFPLFFBQVMsQ0FBQSxDQUFBLENBQUUsQ0FBQyxPQUFuQixDQUEyQixDQUFDLFNBQTVCLENBQXNDLGlCQUF0QyxDQWxCQSxDQUFBO0FBQUEsUUFtQkEsTUFBQSxDQUFPLFFBQVMsQ0FBQSxDQUFBLENBQUUsQ0FBQyxNQUFuQixDQUEwQixDQUFDLElBQTNCLENBQWdDLE9BQWhDLENBbkJBLENBQUE7QUFBQSxRQXFCQSxNQUFBLENBQU8sUUFBUyxDQUFBLENBQUEsQ0FBRSxDQUFDLE9BQW5CLENBQTJCLENBQUMsU0FBNUIsQ0FBc0MscUJBQXRDLENBckJBLENBQUE7QUFBQSxRQXNCQSxNQUFBLENBQU8sUUFBUyxDQUFBLENBQUEsQ0FBRSxDQUFDLE1BQW5CLENBQTBCLENBQUMsSUFBM0IsQ0FBZ0MsT0FBaEMsQ0F0QkEsQ0FBQTtBQUFBLFFBd0JBLE1BQUEsQ0FBTyxRQUFTLENBQUEsQ0FBQSxDQUFFLENBQUMsT0FBbkIsQ0FBMkIsQ0FBQyxTQUE1QixDQUFzQyxXQUF0QyxDQXhCQSxDQUFBO2VBeUJBLE1BQUEsQ0FBTyxRQUFTLENBQUEsQ0FBQSxDQUFFLENBQUMsTUFBbkIsQ0FBMEIsQ0FBQyxJQUEzQixDQUFnQyxPQUFoQyxFQTFCd0U7TUFBQSxDQUExRSxFQXZCNEI7SUFBQSxDQUE5QixDQTdDQSxDQUFBO0FBQUEsSUFnR0EsUUFBQSxDQUFTLG1DQUFULEVBQThDLFNBQUEsR0FBQTthQUM1QyxFQUFBLENBQUcsaURBQUgsRUFBc0QsU0FBQSxHQUFBO0FBQ3BELFFBQUEsSUFBSSxDQUFDLFlBQUwsQ0FBa0IsS0FBbEIsQ0FBQSxDQUFBO0FBQUEsUUFDQSxNQUFBLENBQU8sQ0FBQSxDQUFFLE1BQUYsQ0FBUyxDQUFDLElBQVYsQ0FBZSxTQUFmLENBQXlCLENBQUMsTUFBakMsQ0FBd0MsQ0FBQyxJQUF6QyxDQUE4QyxDQUE5QyxDQURBLENBQUE7QUFBQSxRQUVBLE1BQUEsQ0FBTyxDQUFBLENBQUUsTUFBRixDQUFTLENBQUMsSUFBVixDQUFlLFlBQWYsQ0FBUCxDQUFvQyxDQUFDLFdBQXJDLENBQWlELFFBQWpELENBRkEsQ0FBQTtBQUFBLFFBSUEsSUFBSSxDQUFDLFlBQUwsQ0FBa0IsS0FBbEIsQ0FKQSxDQUFBO0FBQUEsUUFLQSxNQUFBLENBQU8sQ0FBQSxDQUFFLE1BQUYsQ0FBUyxDQUFDLElBQVYsQ0FBZSxTQUFmLENBQXlCLENBQUMsTUFBakMsQ0FBd0MsQ0FBQyxJQUF6QyxDQUE4QyxDQUE5QyxDQUxBLENBQUE7ZUFNQSxNQUFBLENBQU8sQ0FBQSxDQUFFLE1BQUYsQ0FBUyxDQUFDLElBQVYsQ0FBZSxZQUFmLENBQVAsQ0FBb0MsQ0FBQyxXQUFyQyxDQUFpRCxRQUFqRCxFQVBvRDtNQUFBLENBQXRELEVBRDRDO0lBQUEsQ0FBOUMsQ0FoR0EsQ0FBQTtBQUFBLElBMEdBLFFBQUEsQ0FBUyxzQ0FBVCxFQUFpRCxTQUFBLEdBQUE7QUFDL0MsTUFBQSxFQUFBLENBQUcsdUVBQUgsRUFBNEUsU0FBQSxHQUFBO0FBQzFFLFlBQUEsS0FBQTtBQUFBLFFBQUEsSUFBSSxDQUFDLFlBQUwsQ0FBa0IsS0FBbEIsQ0FBQSxDQUFBO0FBQUEsUUFDQSxLQUFBLEdBQVksSUFBQSxRQUFBLENBQVMsUUFBVCxDQURaLENBQUE7QUFBQSxRQUVBLElBQUksQ0FBQyxZQUFMLENBQWtCLEtBQWxCLENBRkEsQ0FBQTtBQUFBLFFBR0EsTUFBQSxDQUFPLENBQUEsQ0FBRSxNQUFGLENBQVMsQ0FBQyxJQUFWLENBQWUsTUFBZixDQUFzQixDQUFDLE1BQTlCLENBQXFDLENBQUMsSUFBdEMsQ0FBMkMsQ0FBM0MsQ0FIQSxDQUFBO2VBSUEsTUFBQSxDQUFPLENBQUEsQ0FBRSxNQUFNLENBQUMsVUFBUCxDQUFrQixDQUFsQixDQUFGLENBQXVCLENBQUMsSUFBeEIsQ0FBNkIsUUFBN0IsQ0FBUCxDQUE4QyxDQUFDLFVBQS9DLENBQTBELFFBQTFELEVBTDBFO01BQUEsQ0FBNUUsQ0FBQSxDQUFBO2FBT0EsRUFBQSxDQUFHLDRFQUFILEVBQWlGLFNBQUEsR0FBQTtBQUMvRSxZQUFBLE9BQUE7QUFBQSxRQUFBLE9BQUEsR0FBVSxJQUFWLENBQUE7QUFBQSxRQUVBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO0FBQ2QsY0FBQSxNQUFBO0FBQUEsVUFBQSxNQUFBLEdBQ0ssc0NBQUgsR0FDRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsWUFBcEIsRUFBa0M7QUFBQSxZQUFBLFlBQUEsRUFBYyxLQUFkO1dBQWxDLENBREYsR0FHRSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQWIsQ0FBa0IsWUFBbEIsQ0FKSixDQUFBO2lCQU1BLE1BQU0sQ0FBQyxJQUFQLENBQVksU0FBQyxDQUFELEdBQUE7bUJBQU8sT0FBQSxHQUFVLEVBQWpCO1VBQUEsQ0FBWixFQVBjO1FBQUEsQ0FBaEIsQ0FGQSxDQUFBO2VBV0EsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUNILFVBQUEsT0FBTyxDQUFDLFVBQVIsQ0FBbUIsR0FBbkIsQ0FBQSxDQUFBO0FBQUEsVUFDQSxJQUFJLENBQUMsWUFBTCxDQUFrQixPQUFsQixDQURBLENBQUE7aUJBRUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxVQUFQLENBQWtCLE9BQWxCLENBQVAsQ0FBa0MsQ0FBQyxXQUFuQyxDQUErQyxVQUEvQyxFQUhHO1FBQUEsQ0FBTCxFQVorRTtNQUFBLENBQWpGLEVBUitDO0lBQUEsQ0FBakQsQ0ExR0EsQ0FBQTtBQUFBLElBbUlBLFFBQUEsQ0FBUyx1Q0FBVCxFQUFrRCxTQUFBLEdBQUE7QUFDaEQsTUFBQSxFQUFBLENBQUcseUNBQUgsRUFBOEMsU0FBQSxHQUFBO0FBQzVDLFFBQUEsSUFBSSxDQUFDLFdBQUwsQ0FBaUIsS0FBakIsQ0FBQSxDQUFBO0FBQUEsUUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFnQixDQUFDLE1BQXhCLENBQStCLENBQUMsSUFBaEMsQ0FBcUMsQ0FBckMsQ0FEQSxDQUFBO2VBRUEsTUFBQSxDQUFPLENBQUEsQ0FBRSxNQUFGLENBQVMsQ0FBQyxJQUFWLENBQWUsdUJBQWYsQ0FBUCxDQUErQyxDQUFDLEdBQUcsQ0FBQyxPQUFwRCxDQUFBLEVBSDRDO01BQUEsQ0FBOUMsQ0FBQSxDQUFBO2FBS0EsRUFBQSxDQUFHLDBDQUFILEVBQStDLFNBQUEsR0FBQTtBQUM3QyxZQUFBLE1BQUE7QUFBQSxRQUFBLE1BQUEsQ0FBTyxNQUFNLENBQUMsVUFBUCxDQUFrQixLQUFsQixDQUFQLENBQWdDLENBQUMsVUFBakMsQ0FBNEMsUUFBNUMsQ0FBQSxDQUFBO0FBQUEsUUFDQSxLQUFLLENBQUMsU0FBTixHQUFrQixHQURsQixDQUFBO0FBQUEsUUFFQSxNQUFBLEdBQWEsSUFBQSxRQUFBLENBQVMsUUFBVCxDQUZiLENBQUE7QUFBQSxRQUdBLE1BQU0sQ0FBQyxTQUFQLEdBQW1CLElBSG5CLENBQUE7QUFBQSxRQUlBLElBQUksQ0FBQyxZQUFMLENBQWtCLE1BQWxCLENBSkEsQ0FBQTtBQUFBLFFBS0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxVQUFQLENBQWtCLEtBQWxCLENBQVAsQ0FBZ0MsQ0FBQyxVQUFqQyxDQUE0QyxHQUE1QyxDQUxBLENBQUE7QUFBQSxRQU1BLE1BQUEsQ0FBTyxNQUFNLENBQUMsVUFBUCxDQUFrQixNQUFsQixDQUFQLENBQWlDLENBQUMsVUFBbEMsQ0FBNkMsSUFBN0MsQ0FOQSxDQUFBO0FBQUEsUUFPQSxJQUFJLENBQUMsV0FBTCxDQUFpQixNQUFqQixDQVBBLENBQUE7ZUFRQSxNQUFBLENBQU8sTUFBTSxDQUFDLFVBQVAsQ0FBa0IsS0FBbEIsQ0FBUCxDQUFnQyxDQUFDLFVBQWpDLENBQTRDLFFBQTVDLEVBVDZDO01BQUEsQ0FBL0MsRUFOZ0Q7SUFBQSxDQUFsRCxDQW5JQSxDQUFBO0FBQUEsSUFvSkEsUUFBQSxDQUFTLHVCQUFULEVBQWtDLFNBQUEsR0FBQTtBQUNoQyxNQUFBLEVBQUEsQ0FBRyw0REFBSCxFQUFpRSxTQUFBLEdBQUE7QUFDL0QsWUFBQSxLQUFBO0FBQUEsUUFBQSxPQUFPLENBQUMsV0FBUixDQUFvQixNQUFwQixDQUFBLENBQUE7QUFBQSxRQUVBLEtBQUEsQ0FBTSxJQUFOLEVBQVksVUFBWixDQUZBLENBQUE7QUFBQSxRQUlBLEtBQUEsR0FBUSxpQkFBQSxDQUFrQixXQUFsQixFQUErQixNQUFNLENBQUMsVUFBUCxDQUFrQixDQUFsQixDQUEvQixFQUFxRDtBQUFBLFVBQUEsS0FBQSxFQUFPLENBQVA7U0FBckQsQ0FKUixDQUFBO0FBQUEsUUFLQSxNQUFBLENBQU8sSUFBSSxDQUFDLGFBQUwsQ0FBQSxDQUFQLENBQTRCLENBQUMsSUFBN0IsQ0FBa0MsSUFBSSxDQUFDLFFBQUwsQ0FBQSxDQUFnQixDQUFBLENBQUEsQ0FBbEQsQ0FMQSxDQUFBO0FBQUEsUUFNQSxNQUFBLENBQU8sS0FBSyxDQUFDLGNBQWIsQ0FBNEIsQ0FBQyxHQUFHLENBQUMsZ0JBQWpDLENBQUEsQ0FOQSxDQUFBO0FBQUEsUUFRQSxLQUFBLEdBQVEsaUJBQUEsQ0FBa0IsV0FBbEIsRUFBK0IsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsQ0FBbEIsQ0FBL0IsRUFBcUQ7QUFBQSxVQUFBLEtBQUEsRUFBTyxDQUFQO1NBQXJELENBUlIsQ0FBQTtBQUFBLFFBU0EsTUFBQSxDQUFPLElBQUksQ0FBQyxhQUFMLENBQUEsQ0FBUCxDQUE0QixDQUFDLElBQTdCLENBQWtDLElBQUksQ0FBQyxRQUFMLENBQUEsQ0FBZ0IsQ0FBQSxDQUFBLENBQWxELENBVEEsQ0FBQTtBQUFBLFFBVUEsTUFBQSxDQUFPLEtBQUssQ0FBQyxjQUFiLENBQTRCLENBQUMsR0FBRyxDQUFDLGdCQUFqQyxDQUFBLENBVkEsQ0FBQTtBQUFBLFFBZ0JBLEtBQUEsQ0FBTSxDQUFOLENBaEJBLENBQUE7ZUFpQkEsSUFBQSxDQUFLLFNBQUEsR0FBQTtpQkFBRyxNQUFBLENBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFyQixDQUErQixDQUFDLElBQWhDLENBQXFDLENBQXJDLEVBQUg7UUFBQSxDQUFMLEVBbEIrRDtNQUFBLENBQWpFLENBQUEsQ0FBQTtBQUFBLE1Bb0JBLEVBQUEsQ0FBRyxvQ0FBSCxFQUF5QyxTQUFBLEdBQUE7QUFDdkMsWUFBQSxLQUFBO0FBQUEsUUFBQSxPQUFPLENBQUMsV0FBUixDQUFvQixNQUFwQixDQUFBLENBQUE7QUFBQSxRQUVBLEtBQUEsR0FBUSxpQkFBQSxDQUFrQixXQUFsQixFQUErQixNQUFNLENBQUMsVUFBUCxDQUFrQixPQUFsQixDQUEvQixFQUEyRDtBQUFBLFVBQUEsS0FBQSxFQUFPLENBQVA7U0FBM0QsQ0FGUixDQUFBO0FBQUEsUUFJQSxNQUFBLENBQU8sSUFBSSxDQUFDLFFBQUwsQ0FBQSxDQUFlLENBQUMsTUFBdkIsQ0FBOEIsQ0FBQyxJQUEvQixDQUFvQyxDQUFwQyxDQUpBLENBQUE7QUFBQSxRQUtBLE1BQUEsQ0FBTyxJQUFJLENBQUMsUUFBTCxDQUFBLENBQWUsQ0FBQyxPQUFoQixDQUF3QixPQUF4QixDQUFQLENBQXdDLENBQUMsSUFBekMsQ0FBOEMsQ0FBQSxDQUE5QyxDQUxBLENBQUE7QUFBQSxRQU1BLE1BQUEsQ0FBTyxPQUFPLENBQUMsU0FBZixDQUF5QixDQUFDLFVBQTFCLENBQUEsQ0FOQSxDQUFBO0FBQUEsUUFPQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFnQixDQUFDLE1BQXhCLENBQStCLENBQUMsSUFBaEMsQ0FBcUMsQ0FBckMsQ0FQQSxDQUFBO0FBQUEsUUFRQSxNQUFBLENBQU8sQ0FBQSxDQUFFLE1BQUYsQ0FBUyxDQUFDLElBQVYsQ0FBZSwwQkFBZixDQUFQLENBQWtELENBQUMsR0FBRyxDQUFDLE9BQXZELENBQUEsQ0FSQSxDQUFBO2VBVUEsTUFBQSxDQUFPLEtBQUssQ0FBQyxjQUFiLENBQTRCLENBQUMsZ0JBQTdCLENBQUEsRUFYdUM7TUFBQSxDQUF6QyxDQXBCQSxDQUFBO2FBaUNBLEVBQUEsQ0FBRyxzREFBSCxFQUEyRCxTQUFBLEdBQUE7QUFDekQsWUFBQSxLQUFBO0FBQUEsUUFBQSxPQUFPLENBQUMsV0FBUixDQUFvQixNQUFwQixDQUFBLENBQUE7QUFBQSxRQUVBLEtBQUEsQ0FBTSxJQUFOLEVBQVksVUFBWixDQUZBLENBQUE7QUFBQSxRQUlBLEtBQUEsR0FBUSxpQkFBQSxDQUFrQixXQUFsQixFQUErQixNQUFNLENBQUMsVUFBUCxDQUFrQixDQUFsQixDQUEvQixFQUFxRDtBQUFBLFVBQUEsS0FBQSxFQUFPLENBQVA7U0FBckQsQ0FKUixDQUFBO0FBQUEsUUFLQSxNQUFBLENBQU8sSUFBSSxDQUFDLGFBQUwsQ0FBQSxDQUFQLENBQTRCLENBQUMsR0FBRyxDQUFDLElBQWpDLENBQXNDLElBQUksQ0FBQyxRQUFMLENBQUEsQ0FBZ0IsQ0FBQSxDQUFBLENBQXRELENBTEEsQ0FBQTtBQUFBLFFBTUEsTUFBQSxDQUFPLEtBQUssQ0FBQyxjQUFiLENBQTRCLENBQUMsZ0JBQTdCLENBQUEsQ0FOQSxDQUFBO0FBQUEsUUFRQSxLQUFBLEdBQVEsaUJBQUEsQ0FBa0IsV0FBbEIsRUFBK0IsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsQ0FBbEIsQ0FBL0IsRUFBcUQ7QUFBQSxVQUFBLEtBQUEsRUFBTyxDQUFQO0FBQUEsVUFBVSxPQUFBLEVBQVMsSUFBbkI7U0FBckQsQ0FSUixDQUFBO0FBQUEsUUFTQSxNQUFBLENBQU8sSUFBSSxDQUFDLGFBQUwsQ0FBQSxDQUFQLENBQTRCLENBQUMsR0FBRyxDQUFDLElBQWpDLENBQXNDLElBQUksQ0FBQyxRQUFMLENBQUEsQ0FBZ0IsQ0FBQSxDQUFBLENBQXRELENBVEEsQ0FBQTtBQUFBLFFBVUEsTUFBQSxDQUFPLEtBQUssQ0FBQyxjQUFiLENBQTRCLENBQUMsZ0JBQTdCLENBQUEsQ0FWQSxDQUFBO2VBWUEsTUFBQSxDQUFPLElBQUksQ0FBQyxRQUFaLENBQXFCLENBQUMsR0FBRyxDQUFDLGdCQUExQixDQUFBLEVBYnlEO01BQUEsQ0FBM0QsRUFsQ2dDO0lBQUEsQ0FBbEMsQ0FwSkEsQ0FBQTtBQUFBLElBcU1BLFFBQUEsQ0FBUyxvQ0FBVCxFQUErQyxTQUFBLEdBQUE7YUFDN0MsRUFBQSxDQUFHLHFDQUFILEVBQTBDLFNBQUEsR0FBQTtBQUN4QyxRQUFBLE9BQU8sQ0FBQyxXQUFSLENBQW9CLE1BQXBCLENBQUEsQ0FBQTtBQUFBLFFBRUEsQ0FBQSxDQUFFLE1BQU0sQ0FBQyxVQUFQLENBQWtCLE9BQWxCLENBQUYsQ0FBNkIsQ0FBQyxJQUE5QixDQUFtQyxhQUFuQyxDQUFpRCxDQUFDLEtBQWxELENBQUEsQ0FGQSxDQUFBO0FBQUEsUUFHQSxNQUFBLENBQU8sSUFBSSxDQUFDLFFBQUwsQ0FBQSxDQUFlLENBQUMsTUFBdkIsQ0FBOEIsQ0FBQyxJQUEvQixDQUFvQyxDQUFwQyxDQUhBLENBQUE7QUFBQSxRQUlBLE1BQUEsQ0FBTyxJQUFJLENBQUMsUUFBTCxDQUFBLENBQWUsQ0FBQyxPQUFoQixDQUF3QixPQUF4QixDQUFQLENBQXdDLENBQUMsSUFBekMsQ0FBOEMsQ0FBQSxDQUE5QyxDQUpBLENBQUE7QUFBQSxRQUtBLE1BQUEsQ0FBTyxPQUFPLENBQUMsU0FBZixDQUF5QixDQUFDLFVBQTFCLENBQUEsQ0FMQSxDQUFBO0FBQUEsUUFNQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFnQixDQUFDLE1BQXhCLENBQStCLENBQUMsSUFBaEMsQ0FBcUMsQ0FBckMsQ0FOQSxDQUFBO2VBT0EsTUFBQSxDQUFPLENBQUEsQ0FBRSxNQUFGLENBQVMsQ0FBQyxJQUFWLENBQWUsMEJBQWYsQ0FBUCxDQUFrRCxDQUFDLEdBQUcsQ0FBQyxPQUF2RCxDQUFBLEVBUndDO01BQUEsQ0FBMUMsRUFENkM7SUFBQSxDQUEvQyxDQXJNQSxDQUFBO0FBQUEsSUFnTkEsUUFBQSxDQUFTLGlDQUFULEVBQTRDLFNBQUEsR0FBQTthQUMxQyxFQUFBLENBQUcscUNBQUgsRUFBMEMsU0FBQSxHQUFBO0FBQ3hDLFFBQUEsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFmLENBQXVCLHFCQUF2QixDQUFBLENBQUE7ZUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLFVBQVAsQ0FBa0IsT0FBbEIsQ0FBUCxDQUFrQyxDQUFDLFVBQW5DLENBQThDLFVBQTlDLEVBRndDO01BQUEsQ0FBMUMsRUFEMEM7SUFBQSxDQUE1QyxDQWhOQSxDQUFBO0FBQUEsSUFxTkEsUUFBQSxDQUFTLG1DQUFULEVBQThDLFNBQUEsR0FBQTthQUM1QyxFQUFBLENBQUcsb0VBQUgsRUFBeUUsU0FBQSxHQUFBO0FBQ3ZFLFFBQUEsS0FBSyxDQUFDLEtBQU4sR0FBYyxTQUFkLENBQUE7QUFBQSxRQUNBLEtBQUssQ0FBQyxTQUFOLEdBQWtCLGdCQURsQixDQUFBO0FBQUEsUUFFQSxLQUFLLENBQUMsZ0JBQU4sQ0FBQSxDQUZBLENBQUE7QUFBQSxRQUdBLEtBQUssQ0FBQyxLQUFOLEdBQWMsU0FIZCxDQUFBO0FBQUEsUUFJQSxLQUFLLENBQUMsU0FBTixHQUFrQixlQUpsQixDQUFBO0FBQUEsUUFLQSxLQUFLLENBQUMsZ0JBQU4sQ0FBQSxDQUxBLENBQUE7QUFBQSxRQU9BLE1BQUEsQ0FBTyxNQUFNLENBQUMsVUFBUCxDQUFrQixLQUFsQixDQUFQLENBQWdDLENBQUMsVUFBakMsQ0FBNEMsZ0JBQTVDLENBUEEsQ0FBQTtBQUFBLFFBUUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxVQUFQLENBQWtCLEtBQWxCLENBQVAsQ0FBZ0MsQ0FBQyxVQUFqQyxDQUE0QyxlQUE1QyxDQVJBLENBQUE7QUFBQSxRQVVBLEtBQUssQ0FBQyxTQUFOLEdBQWtCLE1BVmxCLENBQUE7QUFBQSxRQVdBLEtBQUssQ0FBQyxnQkFBTixDQUFBLENBWEEsQ0FBQTtBQUFBLFFBYUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxVQUFQLENBQWtCLEtBQWxCLENBQVAsQ0FBZ0MsQ0FBQyxVQUFqQyxDQUE0QyxnQkFBNUMsQ0FiQSxDQUFBO2VBY0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxVQUFQLENBQWtCLEtBQWxCLENBQVAsQ0FBZ0MsQ0FBQyxVQUFqQyxDQUE0QyxTQUE1QyxFQWZ1RTtNQUFBLENBQXpFLEVBRDRDO0lBQUEsQ0FBOUMsQ0FyTkEsQ0FBQTtBQUFBLElBdU9BLFFBQUEsQ0FBUyxrQ0FBVCxFQUE2QyxTQUFBLEdBQUE7QUFDM0MsTUFBQSxFQUFBLENBQUcsOEJBQUgsRUFBbUMsU0FBQSxHQUFBO0FBQ2pDLFFBQUEsTUFBQSxDQUFPLENBQUEsQ0FBRSxNQUFGLENBQVMsQ0FBQyxJQUFWLENBQWUsbUJBQWYsQ0FBUCxDQUEyQyxDQUFDLFdBQTVDLENBQXdELE1BQXhELENBQUEsQ0FBQTtlQUNBLE1BQUEsQ0FBTyxDQUFBLENBQUUsTUFBRixDQUFTLENBQUMsSUFBVixDQUFlLG1CQUFmLENBQVAsQ0FBMkMsQ0FBQyxXQUE1QyxDQUF3RCxlQUF4RCxFQUZpQztNQUFBLENBQW5DLENBQUEsQ0FBQTtBQUFBLE1BSUEsRUFBQSxDQUFHLG9EQUFILEVBQXlELFNBQUEsR0FBQTtBQUN2RCxRQUFBLEtBQUssQ0FBQyxXQUFOLEdBQW9CLElBQXBCLENBQUE7QUFBQSxRQUNBLEtBQUssQ0FBQyxlQUFOLENBQUEsQ0FEQSxDQUFBO0FBQUEsUUFFQSxNQUFBLENBQU8sQ0FBQSxDQUFFLE1BQUYsQ0FBUyxDQUFDLElBQVYsQ0FBZSxtQkFBZixDQUFQLENBQTJDLENBQUMsR0FBRyxDQUFDLFdBQWhELENBQTRELE1BQTVELENBRkEsQ0FBQTtlQUdBLE1BQUEsQ0FBTyxDQUFBLENBQUUsTUFBRixDQUFTLENBQUMsSUFBVixDQUFlLG1CQUFmLENBQVAsQ0FBMkMsQ0FBQyxHQUFHLENBQUMsV0FBaEQsQ0FBNEQsZUFBNUQsRUFKdUQ7TUFBQSxDQUF6RCxDQUpBLENBQUE7QUFBQSxNQVVBLEVBQUEsQ0FBRyxvREFBSCxFQUF5RCxTQUFBLEdBQUE7QUFDdkQsUUFBQSxLQUFLLENBQUMsV0FBTixHQUFvQixTQUFBLEdBQUE7aUJBQUcsTUFBSDtRQUFBLENBQXBCLENBQUE7QUFBQSxRQUNBLEtBQUssQ0FBQyxlQUFOLENBQUEsQ0FEQSxDQUFBO0FBQUEsUUFFQSxNQUFBLENBQU8sQ0FBQSxDQUFFLE1BQUYsQ0FBUyxDQUFDLElBQVYsQ0FBZSxtQkFBZixDQUFQLENBQTJDLENBQUMsV0FBNUMsQ0FBd0QsTUFBeEQsQ0FGQSxDQUFBO2VBR0EsTUFBQSxDQUFPLENBQUEsQ0FBRSxNQUFGLENBQVMsQ0FBQyxJQUFWLENBQWUsbUJBQWYsQ0FBUCxDQUEyQyxDQUFDLFdBQTVDLENBQXdELFVBQXhELEVBSnVEO01BQUEsQ0FBekQsQ0FWQSxDQUFBO0FBQUEsTUFnQkEsUUFBQSxDQUFTLGtEQUFULEVBQTZELFNBQUEsR0FBQTtBQUMzRCxRQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxVQUFBLEtBQUEsQ0FBTSxNQUFNLENBQUMsVUFBUCxDQUFrQixLQUFsQixDQUFOLEVBQWdDLHNCQUFoQyxDQUF1RCxDQUFDLGNBQXhELENBQUEsQ0FBQSxDQUFBO0FBQUEsVUFFQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsZ0JBQWhCLEVBQWtDLElBQWxDLENBRkEsQ0FBQTtBQUFBLFVBSUEsUUFBQSxDQUFTLFNBQUEsR0FBQTttQkFDUCxNQUFNLENBQUMsVUFBUCxDQUFrQixLQUFsQixDQUF3QixDQUFDLG9CQUFvQixDQUFDLFNBQTlDLEdBQTBELEVBRG5EO1VBQUEsQ0FBVCxDQUpBLENBQUE7aUJBT0EsSUFBQSxDQUFLLFNBQUEsR0FBQTttQkFDSCxNQUFNLENBQUMsVUFBUCxDQUFrQixLQUFsQixDQUF3QixDQUFDLG9CQUFvQixDQUFDLEtBQTlDLENBQUEsRUFERztVQUFBLENBQUwsRUFSUztRQUFBLENBQVgsQ0FBQSxDQUFBO0FBQUEsUUFXQSxFQUFBLENBQUcsdUJBQUgsRUFBNEIsU0FBQSxHQUFBO2lCQUMxQixNQUFBLENBQU8sQ0FBQSxDQUFFLE1BQUYsQ0FBUyxDQUFDLElBQVYsQ0FBZSxtQkFBZixDQUFQLENBQTJDLENBQUMsR0FBRyxDQUFDLFdBQWhELENBQTRELFdBQTVELEVBRDBCO1FBQUEsQ0FBNUIsQ0FYQSxDQUFBO2VBY0EsRUFBQSxDQUFHLCtEQUFILEVBQW9FLFNBQUEsR0FBQTtBQUNsRSxVQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixnQkFBaEIsRUFBa0MsS0FBbEMsQ0FBQSxDQUFBO0FBQUEsVUFFQSxRQUFBLENBQVMsU0FBQSxHQUFBO21CQUNQLE1BQU0sQ0FBQyxVQUFQLENBQWtCLEtBQWxCLENBQXdCLENBQUMsb0JBQW9CLENBQUMsU0FBOUMsR0FBMEQsRUFEbkQ7VUFBQSxDQUFULENBRkEsQ0FBQTtpQkFLQSxJQUFBLENBQUssU0FBQSxHQUFBO21CQUNILE1BQUEsQ0FBTyxDQUFBLENBQUUsTUFBRixDQUFTLENBQUMsSUFBVixDQUFlLG1CQUFmLENBQVAsQ0FBMkMsQ0FBQyxXQUE1QyxDQUF3RCxXQUF4RCxFQURHO1VBQUEsQ0FBTCxFQU5rRTtRQUFBLENBQXBFLEVBZjJEO01BQUEsQ0FBN0QsQ0FoQkEsQ0FBQTthQXdDQSxRQUFBLENBQVMsbURBQVQsRUFBOEQsU0FBQSxHQUFBO0FBQzVELFFBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFVBQUEsS0FBQSxDQUFNLE1BQU0sQ0FBQyxVQUFQLENBQWtCLEtBQWxCLENBQU4sRUFBZ0Msc0JBQWhDLENBQXVELENBQUMsY0FBeEQsQ0FBQSxDQUFBLENBQUE7QUFBQSxVQUVBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixnQkFBaEIsRUFBa0MsS0FBbEMsQ0FGQSxDQUFBO0FBQUEsVUFJQSxRQUFBLENBQVMsU0FBQSxHQUFBO21CQUNQLE1BQU0sQ0FBQyxVQUFQLENBQWtCLEtBQWxCLENBQXdCLENBQUMsb0JBQW9CLENBQUMsU0FBOUMsR0FBMEQsRUFEbkQ7VUFBQSxDQUFULENBSkEsQ0FBQTtpQkFPQSxJQUFBLENBQUssU0FBQSxHQUFBO21CQUNILE1BQU0sQ0FBQyxVQUFQLENBQWtCLEtBQWxCLENBQXdCLENBQUMsb0JBQW9CLENBQUMsS0FBOUMsQ0FBQSxFQURHO1VBQUEsQ0FBTCxFQVJTO1FBQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxRQVdBLEVBQUEsQ0FBRyxnQkFBSCxFQUFxQixTQUFBLEdBQUE7aUJBQ25CLE1BQUEsQ0FBTyxDQUFBLENBQUUsTUFBRixDQUFTLENBQUMsSUFBVixDQUFlLG1CQUFmLENBQVAsQ0FBMkMsQ0FBQyxXQUE1QyxDQUF3RCxXQUF4RCxFQURtQjtRQUFBLENBQXJCLENBWEEsQ0FBQTtlQWNBLEVBQUEsQ0FBRyw0REFBSCxFQUFpRSxTQUFBLEdBQUE7QUFDL0QsVUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsZ0JBQWhCLEVBQWtDLElBQWxDLENBQUEsQ0FBQTtBQUFBLFVBRUEsUUFBQSxDQUFTLFNBQUEsR0FBQTttQkFDUCxNQUFNLENBQUMsVUFBUCxDQUFrQixLQUFsQixDQUF3QixDQUFDLG9CQUFvQixDQUFDLFNBQTlDLEdBQTBELEVBRG5EO1VBQUEsQ0FBVCxDQUZBLENBQUE7aUJBS0EsTUFBQSxDQUFPLENBQUEsQ0FBRSxNQUFGLENBQVMsQ0FBQyxJQUFWLENBQWUsbUJBQWYsQ0FBUCxDQUEyQyxDQUFDLEdBQUcsQ0FBQyxXQUFoRCxDQUE0RCxXQUE1RCxFQU4rRDtRQUFBLENBQWpFLEVBZjREO01BQUEsQ0FBOUQsRUF6QzJDO0lBQUEsQ0FBN0MsQ0F2T0EsQ0FBQTtBQUFBLElBdVNBLFFBQUEsQ0FBUyw0Q0FBVCxFQUF1RCxTQUFBLEdBQUE7QUFDckQsTUFBQSxFQUFBLENBQUcsb0NBQUgsRUFBeUMsU0FBQSxHQUFBO0FBQ3ZDLFFBQUEsTUFBQSxDQUFPLENBQUEsQ0FBRSxNQUFGLENBQVMsQ0FBQyxJQUFWLENBQWUsbUJBQWYsQ0FBUCxDQUEyQyxDQUFDLEdBQUcsQ0FBQyxXQUFoRCxDQUE0RCxNQUE1RCxDQUFBLENBQUE7ZUFDQSxNQUFBLENBQU8sQ0FBQSxDQUFFLE1BQUYsQ0FBUyxDQUFDLElBQVYsQ0FBZSxtQkFBZixDQUFQLENBQTJDLENBQUMsR0FBRyxDQUFDLFdBQWhELENBQTRELGVBQTVELEVBRnVDO01BQUEsQ0FBekMsQ0FBQSxDQUFBO2FBSUEsRUFBQSxDQUFHLGlEQUFILEVBQXNELFNBQUEsR0FBQTtBQUNwRCxRQUFBLEtBQUssQ0FBQyxXQUFOLEdBQW9CLFNBQUEsR0FBQTtpQkFBRyxXQUFIO1FBQUEsQ0FBcEIsQ0FBQTtBQUFBLFFBQ0EsS0FBSyxDQUFDLGVBQU4sQ0FBQSxDQURBLENBQUE7QUFBQSxRQUVBLE1BQUEsQ0FBTyxDQUFBLENBQUUsTUFBRixDQUFTLENBQUMsSUFBVixDQUFlLG1CQUFmLENBQVAsQ0FBMkMsQ0FBQyxXQUE1QyxDQUF3RCxNQUF4RCxDQUZBLENBQUE7ZUFHQSxNQUFBLENBQU8sQ0FBQSxDQUFFLE1BQUYsQ0FBUyxDQUFDLElBQVYsQ0FBZSxtQkFBZixDQUFQLENBQTJDLENBQUMsV0FBNUMsQ0FBd0QsZUFBeEQsRUFKb0Q7TUFBQSxDQUF0RCxFQUxxRDtJQUFBLENBQXZELENBdlNBLENBQUE7QUFBQSxJQWtUQSxRQUFBLENBQVMsMkNBQVQsRUFBc0QsU0FBQSxHQUFBO2FBQ3BELEVBQUEsQ0FBRyxxRUFBSCxFQUEwRSxTQUFBLEdBQUE7QUFDeEUsWUFBQSxHQUFBO0FBQUEsUUFBQSxHQUFBLEdBQU0sTUFBTSxDQUFDLFVBQVAsQ0FBa0IsT0FBbEIsQ0FBTixDQUFBO0FBQUEsUUFDQSxNQUFBLENBQU8sT0FBTyxDQUFDLFVBQVIsQ0FBQSxDQUFQLENBQTRCLENBQUMsU0FBN0IsQ0FBQSxDQURBLENBQUE7QUFBQSxRQUVBLE1BQUEsQ0FBTyxHQUFQLENBQVcsQ0FBQyxHQUFHLENBQUMsV0FBaEIsQ0FBNEIsVUFBNUIsQ0FGQSxDQUFBO0FBQUEsUUFJQSxPQUFPLENBQUMsVUFBUixDQUFtQixHQUFuQixDQUpBLENBQUE7QUFBQSxRQUtBLFlBQUEsQ0FBYSxPQUFPLENBQUMsTUFBTSxDQUFDLG9CQUE1QixDQUxBLENBQUE7QUFBQSxRQU1BLE1BQUEsQ0FBTyxPQUFPLENBQUMsVUFBUixDQUFBLENBQVAsQ0FBNEIsQ0FBQyxVQUE3QixDQUFBLENBTkEsQ0FBQTtBQUFBLFFBT0EsTUFBQSxDQUFPLEdBQVAsQ0FBVyxDQUFDLFdBQVosQ0FBd0IsVUFBeEIsQ0FQQSxDQUFBO0FBQUEsUUFTQSxPQUFPLENBQUMsSUFBUixDQUFBLENBVEEsQ0FBQTtBQUFBLFFBVUEsWUFBQSxDQUFhLE9BQU8sQ0FBQyxNQUFNLENBQUMsb0JBQTVCLENBVkEsQ0FBQTtBQUFBLFFBV0EsTUFBQSxDQUFPLE9BQU8sQ0FBQyxVQUFSLENBQUEsQ0FBUCxDQUE0QixDQUFDLFNBQTdCLENBQUEsQ0FYQSxDQUFBO2VBWUEsTUFBQSxDQUFPLEdBQVAsQ0FBVyxDQUFDLEdBQUcsQ0FBQyxXQUFoQixDQUE0QixVQUE1QixFQWJ3RTtNQUFBLENBQTFFLEVBRG9EO0lBQUEsQ0FBdEQsQ0FsVEEsQ0FBQTtBQUFBLElBa1VBLFFBQUEsQ0FBUyx1Q0FBVCxFQUFrRCxTQUFBLEdBQUE7YUFDaEQsRUFBQSxDQUFHLDJEQUFILEVBQWdFLFNBQUEsR0FBQTtBQUM5RCxRQUFBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQWdCLENBQUMsR0FBakIsQ0FBcUIsU0FBQyxHQUFELEdBQUE7aUJBQVMsR0FBRyxDQUFDLFlBQWI7UUFBQSxDQUFyQixDQUFQLENBQXFELENBQUMsT0FBdEQsQ0FBOEQsQ0FBQyxRQUFELEVBQVcsV0FBWCxFQUF3QixRQUF4QixDQUE5RCxDQUFBLENBQUE7QUFBQSxRQUNBLElBQUksQ0FBQyxRQUFMLENBQWMsS0FBZCxFQUFxQixDQUFyQixDQURBLENBQUE7QUFBQSxRQUVBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQWdCLENBQUMsR0FBakIsQ0FBcUIsU0FBQyxHQUFELEdBQUE7aUJBQVMsR0FBRyxDQUFDLFlBQWI7UUFBQSxDQUFyQixDQUFQLENBQXFELENBQUMsT0FBdEQsQ0FBOEQsQ0FBQyxRQUFELEVBQVcsUUFBWCxFQUFxQixXQUFyQixDQUE5RCxDQUZBLENBQUE7QUFBQSxRQUdBLElBQUksQ0FBQyxRQUFMLENBQWMsT0FBZCxFQUF1QixDQUF2QixDQUhBLENBQUE7QUFBQSxRQUlBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQWdCLENBQUMsR0FBakIsQ0FBcUIsU0FBQyxHQUFELEdBQUE7aUJBQVMsR0FBRyxDQUFDLFlBQWI7UUFBQSxDQUFyQixDQUFQLENBQXFELENBQUMsT0FBdEQsQ0FBOEQsQ0FBQyxXQUFELEVBQWMsUUFBZCxFQUF3QixRQUF4QixDQUE5RCxDQUpBLENBQUE7QUFBQSxRQUtBLElBQUksQ0FBQyxRQUFMLENBQWMsS0FBZCxFQUFxQixDQUFyQixDQUxBLENBQUE7ZUFNQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFnQixDQUFDLEdBQWpCLENBQXFCLFNBQUMsR0FBRCxHQUFBO2lCQUFTLEdBQUcsQ0FBQyxZQUFiO1FBQUEsQ0FBckIsQ0FBUCxDQUFxRCxDQUFDLE9BQXRELENBQThELENBQUMsV0FBRCxFQUFjLFFBQWQsRUFBd0IsUUFBeEIsQ0FBOUQsRUFQOEQ7TUFBQSxDQUFoRSxFQURnRDtJQUFBLENBQWxELENBbFVBLENBQUE7QUFBQSxJQTRVQSxRQUFBLENBQVMsdUJBQVQsRUFBa0MsU0FBQSxHQUFBO0FBQ2hDLE1BQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtBQUNULFlBQUEsV0FBQTtBQUFBLFFBQUEsV0FBQSxHQUFjLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixJQUFuQixDQUFkLENBQUE7QUFBQSxRQUNBLFdBQVcsQ0FBQyxZQUFaLENBQXlCLE1BQXpCLEVBQWlDLFdBQVcsQ0FBQyxVQUE3QyxDQURBLENBQUE7ZUFFQSxPQUFPLENBQUMsV0FBUixDQUFvQixXQUFwQixFQUhTO01BQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxNQUtBLFFBQUEsQ0FBUyw4QkFBVCxFQUF5QyxTQUFBLEdBQUE7ZUFDdkMsRUFBQSxDQUFHLHVCQUFILEVBQTRCLFNBQUEsR0FBQTtBQUMxQixVQUFBLGlCQUFBLENBQWtCLFdBQWxCLEVBQStCLE1BQU0sQ0FBQyxVQUFQLENBQWtCLEtBQWxCLENBQS9CLEVBQXlEO0FBQUEsWUFBQSxLQUFBLEVBQU8sQ0FBUDtXQUF6RCxDQUFBLENBQUE7QUFBQSxVQUNBLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixNQUF2QixFQUErQixnQkFBL0IsQ0FEQSxDQUFBO0FBQUEsVUFFQSxNQUFBLENBQU8sSUFBSSxDQUFDLFFBQUwsQ0FBQSxDQUFlLENBQUMsTUFBdkIsQ0FBOEIsQ0FBQyxJQUEvQixDQUFvQyxDQUFwQyxDQUZBLENBQUE7QUFBQSxVQUdBLE1BQUEsQ0FBTyxJQUFJLENBQUMsUUFBTCxDQUFBLENBQWUsQ0FBQyxPQUFoQixDQUF3QixLQUF4QixDQUFQLENBQXNDLENBQUMsSUFBdkMsQ0FBNEMsQ0FBQSxDQUE1QyxDQUhBLENBQUE7QUFBQSxVQUlBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQWdCLENBQUMsTUFBeEIsQ0FBK0IsQ0FBQyxJQUFoQyxDQUFxQyxDQUFyQyxDQUpBLENBQUE7aUJBS0EsTUFBQSxDQUFPLENBQUEsQ0FBRSxNQUFGLENBQVMsQ0FBQyxJQUFWLENBQWUsdUJBQWYsQ0FBUCxDQUErQyxDQUFDLEdBQUcsQ0FBQyxPQUFwRCxDQUFBLEVBTjBCO1FBQUEsQ0FBNUIsRUFEdUM7TUFBQSxDQUF6QyxDQUxBLENBQUE7QUFBQSxNQWNBLFFBQUEsQ0FBUyxxQ0FBVCxFQUFnRCxTQUFBLEdBQUE7ZUFDOUMsRUFBQSxDQUFHLDZDQUFILEVBQWtELFNBQUEsR0FBQTtBQUNoRCxVQUFBLGlCQUFBLENBQWtCLFdBQWxCLEVBQStCLE1BQU0sQ0FBQyxVQUFQLENBQWtCLEtBQWxCLENBQS9CLEVBQXlEO0FBQUEsWUFBQSxLQUFBLEVBQU8sQ0FBUDtXQUF6RCxDQUFBLENBQUE7QUFBQSxVQUNBLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixNQUF2QixFQUErQix1QkFBL0IsQ0FEQSxDQUFBO0FBQUEsVUFFQSxNQUFBLENBQU8sSUFBSSxDQUFDLFFBQUwsQ0FBQSxDQUFlLENBQUMsTUFBdkIsQ0FBOEIsQ0FBQyxJQUEvQixDQUFvQyxDQUFwQyxDQUZBLENBQUE7QUFBQSxVQUdBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQWdCLENBQUMsTUFBeEIsQ0FBK0IsQ0FBQyxJQUFoQyxDQUFxQyxDQUFyQyxDQUhBLENBQUE7QUFBQSxVQUlBLE1BQUEsQ0FBTyxDQUFBLENBQUUsTUFBRixDQUFTLENBQUMsSUFBVixDQUFlLDBCQUFmLENBQVAsQ0FBa0QsQ0FBQyxHQUFHLENBQUMsT0FBdkQsQ0FBQSxDQUpBLENBQUE7aUJBS0EsTUFBQSxDQUFPLENBQUEsQ0FBRSxNQUFGLENBQVMsQ0FBQyxJQUFWLENBQWUsdUJBQWYsQ0FBUCxDQUErQyxDQUFDLE9BQWhELENBQUEsRUFOZ0Q7UUFBQSxDQUFsRCxFQUQ4QztNQUFBLENBQWhELENBZEEsQ0FBQTtBQUFBLE1BdUJBLFFBQUEsQ0FBUyx3Q0FBVCxFQUFtRCxTQUFBLEdBQUE7ZUFDakQsRUFBQSxDQUFHLHFEQUFILEVBQTBELFNBQUEsR0FBQTtBQUN4RCxVQUFBLElBQUksQ0FBQyxZQUFMLENBQWtCLE9BQWxCLENBQUEsQ0FBQTtBQUFBLFVBQ0EsaUJBQUEsQ0FBa0IsV0FBbEIsRUFBK0IsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsT0FBbEIsQ0FBL0IsRUFBMkQ7QUFBQSxZQUFBLEtBQUEsRUFBTyxDQUFQO1dBQTNELENBREEsQ0FBQTtBQUFBLFVBRUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLE1BQXZCLEVBQStCLDBCQUEvQixDQUZBLENBQUE7QUFBQSxVQUdBLE1BQUEsQ0FBTyxJQUFJLENBQUMsUUFBTCxDQUFBLENBQWUsQ0FBQyxNQUF2QixDQUE4QixDQUFDLElBQS9CLENBQW9DLENBQXBDLENBSEEsQ0FBQTtBQUFBLFVBSUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBZ0IsQ0FBQyxNQUF4QixDQUErQixDQUFDLElBQWhDLENBQXFDLENBQXJDLENBSkEsQ0FBQTtBQUFBLFVBS0EsTUFBQSxDQUFPLENBQUEsQ0FBRSxNQUFGLENBQVMsQ0FBQyxJQUFWLENBQWUsdUJBQWYsQ0FBUCxDQUErQyxDQUFDLEdBQUcsQ0FBQyxPQUFwRCxDQUFBLENBTEEsQ0FBQTtpQkFNQSxNQUFBLENBQU8sQ0FBQSxDQUFFLE1BQUYsQ0FBUyxDQUFDLElBQVYsQ0FBZSx1QkFBZixDQUFQLENBQStDLENBQUMsT0FBaEQsQ0FBQSxFQVB3RDtRQUFBLENBQTFELEVBRGlEO01BQUEsQ0FBbkQsQ0F2QkEsQ0FBQTtBQUFBLE1BaUNBLFFBQUEsQ0FBUyxtQ0FBVCxFQUE4QyxTQUFBLEdBQUE7ZUFDNUMsRUFBQSxDQUFHLHFCQUFILEVBQTBCLFNBQUEsR0FBQTtBQUN4QixVQUFBLE1BQUEsQ0FBTyxJQUFJLENBQUMsUUFBTCxDQUFBLENBQWUsQ0FBQyxNQUF2QixDQUE4QixDQUFDLGVBQS9CLENBQStDLENBQS9DLENBQUEsQ0FBQTtBQUFBLFVBQ0EsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLE1BQXZCLEVBQStCLHFCQUEvQixDQURBLENBQUE7aUJBRUEsTUFBQSxDQUFPLElBQUksQ0FBQyxRQUFMLENBQUEsQ0FBZSxDQUFDLE1BQXZCLENBQThCLENBQUMsSUFBL0IsQ0FBb0MsQ0FBcEMsRUFId0I7UUFBQSxDQUExQixFQUQ0QztNQUFBLENBQTlDLENBakNBLENBQUE7QUFBQSxNQXVDQSxRQUFBLENBQVMscUNBQVQsRUFBZ0QsU0FBQSxHQUFBO2VBQzlDLEVBQUEsQ0FBRywyQkFBSCxFQUFnQyxTQUFBLEdBQUE7QUFDOUIsVUFBQSxLQUFLLENBQUMsVUFBTixHQUFtQixTQUFBLEdBQUE7bUJBQUcsS0FBSDtVQUFBLENBQW5CLENBQUE7QUFBQSxVQUNBLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixNQUF2QixFQUErQix1QkFBL0IsQ0FEQSxDQUFBO0FBQUEsVUFFQSxNQUFBLENBQU8sSUFBSSxDQUFDLFFBQUwsQ0FBQSxDQUFlLENBQUMsTUFBdkIsQ0FBOEIsQ0FBQyxJQUEvQixDQUFvQyxDQUFwQyxDQUZBLENBQUE7aUJBR0EsTUFBQSxDQUFPLElBQUksQ0FBQyxRQUFMLENBQUEsQ0FBZ0IsQ0FBQSxDQUFBLENBQXZCLENBQTBCLENBQUMsSUFBM0IsQ0FBZ0MsS0FBaEMsRUFKOEI7UUFBQSxDQUFoQyxFQUQ4QztNQUFBLENBQWhELENBdkNBLENBQUE7QUFBQSxNQThDQSxRQUFBLENBQVMsNkJBQVQsRUFBd0MsU0FBQSxHQUFBO2VBQ3RDLEVBQUEsQ0FBRyw0QkFBSCxFQUFpQyxTQUFBLEdBQUE7QUFDL0IsVUFBQSxpQkFBQSxDQUFrQixXQUFsQixFQUErQixNQUFNLENBQUMsVUFBUCxDQUFrQixLQUFsQixDQUEvQixFQUF5RDtBQUFBLFlBQUEsS0FBQSxFQUFPLENBQVA7V0FBekQsQ0FBQSxDQUFBO0FBQUEsVUFDQSxNQUFBLENBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFmLENBQUEsQ0FBeUIsQ0FBQyxNQUFqQyxDQUF3QyxDQUFDLElBQXpDLENBQThDLENBQTlDLENBREEsQ0FBQTtBQUFBLFVBR0EsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLE1BQXZCLEVBQStCLGVBQS9CLENBSEEsQ0FBQTtBQUFBLFVBSUEsTUFBQSxDQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBZixDQUFBLENBQXlCLENBQUMsTUFBakMsQ0FBd0MsQ0FBQyxJQUF6QyxDQUE4QyxDQUE5QyxDQUpBLENBQUE7QUFBQSxVQUtBLE1BQUEsQ0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQWYsQ0FBQSxDQUEwQixDQUFBLENBQUEsQ0FBakMsQ0FBb0MsQ0FBQyxJQUFyQyxDQUEwQyxJQUExQyxDQUxBLENBQUE7aUJBTUEsTUFBQSxDQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBZixDQUFBLENBQTBCLENBQUEsQ0FBQSxDQUFFLENBQUMsUUFBN0IsQ0FBQSxDQUF3QyxDQUFBLENBQUEsQ0FBRSxDQUFDLFFBQTNDLENBQUEsQ0FBUCxDQUE2RCxDQUFDLElBQTlELENBQW1FLEtBQUssQ0FBQyxRQUFOLENBQUEsQ0FBbkUsRUFQK0I7UUFBQSxDQUFqQyxFQURzQztNQUFBLENBQXhDLENBOUNBLENBQUE7QUFBQSxNQXdEQSxRQUFBLENBQVMsK0JBQVQsRUFBMEMsU0FBQSxHQUFBO2VBQ3hDLEVBQUEsQ0FBRyw4QkFBSCxFQUFtQyxTQUFBLEdBQUE7QUFDakMsVUFBQSxpQkFBQSxDQUFrQixXQUFsQixFQUErQixNQUFNLENBQUMsVUFBUCxDQUFrQixLQUFsQixDQUEvQixFQUF5RDtBQUFBLFlBQUEsS0FBQSxFQUFPLENBQVA7V0FBekQsQ0FBQSxDQUFBO0FBQUEsVUFDQSxNQUFBLENBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFmLENBQUEsQ0FBeUIsQ0FBQyxNQUFqQyxDQUF3QyxDQUFDLElBQXpDLENBQThDLENBQTlDLENBREEsQ0FBQTtBQUFBLFVBR0EsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLE1BQXZCLEVBQStCLGlCQUEvQixDQUhBLENBQUE7QUFBQSxVQUlBLE1BQUEsQ0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQWYsQ0FBQSxDQUF5QixDQUFDLE1BQWpDLENBQXdDLENBQUMsSUFBekMsQ0FBOEMsQ0FBOUMsQ0FKQSxDQUFBO0FBQUEsVUFLQSxNQUFBLENBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFmLENBQUEsQ0FBMEIsQ0FBQSxDQUFBLENBQWpDLENBQW9DLENBQUMsSUFBckMsQ0FBMEMsSUFBMUMsQ0FMQSxDQUFBO2lCQU1BLE1BQUEsQ0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQWYsQ0FBQSxDQUEwQixDQUFBLENBQUEsQ0FBRSxDQUFDLFFBQTdCLENBQUEsQ0FBd0MsQ0FBQSxDQUFBLENBQUUsQ0FBQyxRQUEzQyxDQUFBLENBQVAsQ0FBNkQsQ0FBQyxJQUE5RCxDQUFtRSxLQUFLLENBQUMsUUFBTixDQUFBLENBQW5FLEVBUGlDO1FBQUEsQ0FBbkMsRUFEd0M7TUFBQSxDQUExQyxDQXhEQSxDQUFBO0FBQUEsTUFrRUEsUUFBQSxDQUFTLCtCQUFULEVBQTBDLFNBQUEsR0FBQTtlQUN4QyxFQUFBLENBQUcscUNBQUgsRUFBMEMsU0FBQSxHQUFBO0FBQ3hDLFVBQUEsaUJBQUEsQ0FBa0IsV0FBbEIsRUFBK0IsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsS0FBbEIsQ0FBL0IsRUFBeUQ7QUFBQSxZQUFBLEtBQUEsRUFBTyxDQUFQO1dBQXpELENBQUEsQ0FBQTtBQUFBLFVBQ0EsTUFBQSxDQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBZixDQUFBLENBQXlCLENBQUMsTUFBakMsQ0FBd0MsQ0FBQyxJQUF6QyxDQUE4QyxDQUE5QyxDQURBLENBQUE7QUFBQSxVQUdBLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixNQUF2QixFQUErQixpQkFBL0IsQ0FIQSxDQUFBO0FBQUEsVUFJQSxNQUFBLENBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFmLENBQUEsQ0FBeUIsQ0FBQyxNQUFqQyxDQUF3QyxDQUFDLElBQXpDLENBQThDLENBQTlDLENBSkEsQ0FBQTtBQUFBLFVBS0EsTUFBQSxDQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBZixDQUFBLENBQTBCLENBQUEsQ0FBQSxDQUFqQyxDQUFvQyxDQUFDLElBQXJDLENBQTBDLElBQTFDLENBTEEsQ0FBQTtpQkFNQSxNQUFBLENBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFmLENBQUEsQ0FBMEIsQ0FBQSxDQUFBLENBQUUsQ0FBQyxRQUE3QixDQUFBLENBQXdDLENBQUEsQ0FBQSxDQUFFLENBQUMsUUFBM0MsQ0FBQSxDQUFQLENBQTZELENBQUMsSUFBOUQsQ0FBbUUsS0FBSyxDQUFDLFFBQU4sQ0FBQSxDQUFuRSxFQVB3QztRQUFBLENBQTFDLEVBRHdDO01BQUEsQ0FBMUMsQ0FsRUEsQ0FBQTthQTRFQSxRQUFBLENBQVMsZ0NBQVQsRUFBMkMsU0FBQSxHQUFBO2VBQ3pDLEVBQUEsQ0FBRyxzQ0FBSCxFQUEyQyxTQUFBLEdBQUE7QUFDekMsVUFBQSxpQkFBQSxDQUFrQixXQUFsQixFQUErQixNQUFNLENBQUMsVUFBUCxDQUFrQixLQUFsQixDQUEvQixFQUF5RDtBQUFBLFlBQUEsS0FBQSxFQUFPLENBQVA7V0FBekQsQ0FBQSxDQUFBO0FBQUEsVUFDQSxNQUFBLENBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFmLENBQUEsQ0FBeUIsQ0FBQyxNQUFqQyxDQUF3QyxDQUFDLElBQXpDLENBQThDLENBQTlDLENBREEsQ0FBQTtBQUFBLFVBR0EsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLE1BQXZCLEVBQStCLGtCQUEvQixDQUhBLENBQUE7QUFBQSxVQUlBLE1BQUEsQ0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQWYsQ0FBQSxDQUF5QixDQUFDLE1BQWpDLENBQXdDLENBQUMsSUFBekMsQ0FBOEMsQ0FBOUMsQ0FKQSxDQUFBO0FBQUEsVUFLQSxNQUFBLENBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFmLENBQUEsQ0FBMEIsQ0FBQSxDQUFBLENBQWpDLENBQW9DLENBQUMsSUFBckMsQ0FBMEMsSUFBMUMsQ0FMQSxDQUFBO2lCQU1BLE1BQUEsQ0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQWYsQ0FBQSxDQUEwQixDQUFBLENBQUEsQ0FBRSxDQUFDLFFBQTdCLENBQUEsQ0FBd0MsQ0FBQSxDQUFBLENBQUUsQ0FBQyxRQUEzQyxDQUFBLENBQVAsQ0FBNkQsQ0FBQyxJQUE5RCxDQUFtRSxLQUFLLENBQUMsUUFBTixDQUFBLENBQW5FLEVBUHlDO1FBQUEsQ0FBM0MsRUFEeUM7TUFBQSxDQUEzQyxFQTdFZ0M7SUFBQSxDQUFsQyxDQTVVQSxDQUFBO0FBQUEsSUFtYUEsUUFBQSxDQUFTLDBCQUFULEVBQXFDLFNBQUEsR0FBQTtBQUNuQyxVQUFBLFdBQUE7QUFBQSxNQUFBLFdBQUEsR0FBYyxJQUFkLENBQUE7QUFBQSxNQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7ZUFDVCxXQUFBLEdBQWMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLElBQW5CLEVBREw7TUFBQSxDQUFYLENBRkEsQ0FBQTtBQUFBLE1BS0EsUUFBQSxDQUFTLDhCQUFULEVBQXlDLFNBQUEsR0FBQTtBQUN2QyxRQUFBLEVBQUEsQ0FBRyx1QkFBSCxFQUE0QixTQUFBLEdBQUE7QUFDMUIsVUFBQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsV0FBdkIsRUFBb0MsZ0JBQXBDLENBQUEsQ0FBQTtBQUFBLFVBQ0EsTUFBQSxDQUFPLElBQUksQ0FBQyxRQUFMLENBQUEsQ0FBZSxDQUFDLE1BQXZCLENBQThCLENBQUMsSUFBL0IsQ0FBb0MsQ0FBcEMsQ0FEQSxDQUFBO0FBQUEsVUFFQSxNQUFBLENBQU8sSUFBSSxDQUFDLFFBQUwsQ0FBQSxDQUFlLENBQUMsT0FBaEIsQ0FBd0IsS0FBeEIsQ0FBUCxDQUFzQyxDQUFDLElBQXZDLENBQTRDLENBQUEsQ0FBNUMsQ0FGQSxDQUFBO0FBQUEsVUFHQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFnQixDQUFDLE1BQXhCLENBQStCLENBQUMsSUFBaEMsQ0FBcUMsQ0FBckMsQ0FIQSxDQUFBO2lCQUlBLE1BQUEsQ0FBTyxDQUFBLENBQUUsTUFBRixDQUFTLENBQUMsSUFBVixDQUFlLHVCQUFmLENBQVAsQ0FBK0MsQ0FBQyxHQUFHLENBQUMsT0FBcEQsQ0FBQSxFQUwwQjtRQUFBLENBQTVCLENBQUEsQ0FBQTtlQU9BLEVBQUEsQ0FBRyxrQ0FBSCxFQUF1QyxTQUFBLEdBQUE7QUFDckMsVUFBQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsV0FBdkIsRUFBb0MsZ0JBQXBDLENBQUEsQ0FBQTtBQUFBLFVBQ0EsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLFdBQXZCLEVBQW9DLGdCQUFwQyxDQURBLENBQUE7QUFBQSxVQUVBLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixXQUF2QixFQUFvQyxnQkFBcEMsQ0FGQSxDQUFBO0FBQUEsVUFHQSxNQUFBLENBQU8sSUFBSSxDQUFDLFFBQUwsQ0FBQSxDQUFlLENBQUMsTUFBdkIsQ0FBOEIsQ0FBQyxJQUEvQixDQUFvQyxDQUFwQyxDQUhBLENBQUE7aUJBSUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBZ0IsQ0FBQyxNQUF4QixDQUErQixDQUFDLElBQWhDLENBQXFDLENBQXJDLEVBTHFDO1FBQUEsQ0FBdkMsRUFSdUM7TUFBQSxDQUF6QyxDQUxBLENBQUE7QUFBQSxNQW9CQSxRQUFBLENBQVMscUNBQVQsRUFBZ0QsU0FBQSxHQUFBO2VBQzlDLEVBQUEsQ0FBRyw2Q0FBSCxFQUFrRCxTQUFBLEdBQUE7QUFDaEQsVUFBQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsV0FBdkIsRUFBb0MsdUJBQXBDLENBQUEsQ0FBQTtBQUFBLFVBQ0EsTUFBQSxDQUFPLElBQUksQ0FBQyxRQUFMLENBQUEsQ0FBZSxDQUFDLE1BQXZCLENBQThCLENBQUMsSUFBL0IsQ0FBb0MsQ0FBcEMsQ0FEQSxDQUFBO0FBQUEsVUFFQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFnQixDQUFDLE1BQXhCLENBQStCLENBQUMsSUFBaEMsQ0FBcUMsQ0FBckMsQ0FGQSxDQUFBO0FBQUEsVUFHQSxNQUFBLENBQU8sQ0FBQSxDQUFFLE1BQUYsQ0FBUyxDQUFDLElBQVYsQ0FBZSwwQkFBZixDQUFQLENBQWtELENBQUMsR0FBRyxDQUFDLE9BQXZELENBQUEsQ0FIQSxDQUFBO2lCQUlBLE1BQUEsQ0FBTyxDQUFBLENBQUUsTUFBRixDQUFTLENBQUMsSUFBVixDQUFlLHVCQUFmLENBQVAsQ0FBK0MsQ0FBQyxPQUFoRCxDQUFBLEVBTGdEO1FBQUEsQ0FBbEQsRUFEOEM7TUFBQSxDQUFoRCxDQXBCQSxDQUFBO0FBQUEsTUE0QkEsUUFBQSxDQUFTLHdDQUFULEVBQW1ELFNBQUEsR0FBQTtlQUNqRCxFQUFBLENBQUcscURBQUgsRUFBMEQsU0FBQSxHQUFBO0FBQ3hELFVBQUEsSUFBSSxDQUFDLFlBQUwsQ0FBa0IsT0FBbEIsQ0FBQSxDQUFBO0FBQUEsVUFDQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsV0FBdkIsRUFBb0MsMEJBQXBDLENBREEsQ0FBQTtBQUFBLFVBRUEsTUFBQSxDQUFPLElBQUksQ0FBQyxRQUFMLENBQUEsQ0FBZSxDQUFDLE1BQXZCLENBQThCLENBQUMsSUFBL0IsQ0FBb0MsQ0FBcEMsQ0FGQSxDQUFBO0FBQUEsVUFHQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFnQixDQUFDLE1BQXhCLENBQStCLENBQUMsSUFBaEMsQ0FBcUMsQ0FBckMsQ0FIQSxDQUFBO0FBQUEsVUFJQSxNQUFBLENBQU8sQ0FBQSxDQUFFLE1BQUYsQ0FBUyxDQUFDLElBQVYsQ0FBZSx1QkFBZixDQUFQLENBQStDLENBQUMsR0FBRyxDQUFDLE9BQXBELENBQUEsQ0FKQSxDQUFBO2lCQUtBLE1BQUEsQ0FBTyxDQUFBLENBQUUsTUFBRixDQUFTLENBQUMsSUFBVixDQUFlLHVCQUFmLENBQVAsQ0FBK0MsQ0FBQyxPQUFoRCxDQUFBLEVBTndEO1FBQUEsQ0FBMUQsRUFEaUQ7TUFBQSxDQUFuRCxDQTVCQSxDQUFBO0FBQUEsTUFxQ0EsUUFBQSxDQUFTLG1DQUFULEVBQThDLFNBQUEsR0FBQTtlQUM1QyxFQUFBLENBQUcscUJBQUgsRUFBMEIsU0FBQSxHQUFBO0FBQ3hCLFVBQUEsTUFBQSxDQUFPLElBQUksQ0FBQyxRQUFMLENBQUEsQ0FBZSxDQUFDLE1BQXZCLENBQThCLENBQUMsZUFBL0IsQ0FBK0MsQ0FBL0MsQ0FBQSxDQUFBO0FBQUEsVUFDQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsV0FBdkIsRUFBb0MscUJBQXBDLENBREEsQ0FBQTtpQkFFQSxNQUFBLENBQU8sSUFBSSxDQUFDLFFBQUwsQ0FBQSxDQUFlLENBQUMsTUFBdkIsQ0FBOEIsQ0FBQyxJQUEvQixDQUFvQyxDQUFwQyxFQUh3QjtRQUFBLENBQTFCLEVBRDRDO01BQUEsQ0FBOUMsQ0FyQ0EsQ0FBQTthQTJDQSxRQUFBLENBQVMscUNBQVQsRUFBZ0QsU0FBQSxHQUFBO2VBQzlDLEVBQUEsQ0FBRywyQkFBSCxFQUFnQyxTQUFBLEdBQUE7QUFDOUIsVUFBQSxLQUFLLENBQUMsVUFBTixHQUFtQixTQUFBLEdBQUE7bUJBQUcsS0FBSDtVQUFBLENBQW5CLENBQUE7QUFBQSxVQUNBLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixXQUF2QixFQUFvQyx1QkFBcEMsQ0FEQSxDQUFBO0FBQUEsVUFFQSxNQUFBLENBQU8sSUFBSSxDQUFDLFFBQUwsQ0FBQSxDQUFlLENBQUMsTUFBdkIsQ0FBOEIsQ0FBQyxJQUEvQixDQUFvQyxDQUFwQyxDQUZBLENBQUE7aUJBR0EsTUFBQSxDQUFPLElBQUksQ0FBQyxRQUFMLENBQUEsQ0FBZ0IsQ0FBQSxDQUFBLENBQXZCLENBQTBCLENBQUMsSUFBM0IsQ0FBZ0MsS0FBaEMsRUFKOEI7UUFBQSxDQUFoQyxFQUQ4QztNQUFBLENBQWhELEVBNUNtQztJQUFBLENBQXJDLENBbmFBLENBQUE7QUFBQSxJQXNkQSxRQUFBLENBQVMsNEJBQVQsRUFBdUMsU0FBQSxHQUFBO0FBQ3JDLE1BQUEsUUFBQSxDQUFTLDRDQUFULEVBQXVELFNBQUEsR0FBQTtBQUNyRCxRQUFBLFFBQUEsQ0FBUyxvREFBVCxFQUErRCxTQUFBLEdBQUE7aUJBQzdELEVBQUEsQ0FBRyx3RUFBSCxFQUE2RSxTQUFBLEdBQUE7QUFDM0UsZ0JBQUEsMkNBQUE7QUFBQSxZQUFBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQWdCLENBQUMsR0FBakIsQ0FBcUIsU0FBQyxHQUFELEdBQUE7cUJBQVMsR0FBRyxDQUFDLFlBQWI7WUFBQSxDQUFyQixDQUFQLENBQXFELENBQUMsT0FBdEQsQ0FBOEQsQ0FBQyxRQUFELEVBQVcsV0FBWCxFQUF3QixRQUF4QixDQUE5RCxDQUFBLENBQUE7QUFBQSxZQUNBLE1BQUEsQ0FBTyxJQUFJLENBQUMsUUFBTCxDQUFBLENBQVAsQ0FBdUIsQ0FBQyxPQUF4QixDQUFnQyxDQUFDLEtBQUQsRUFBUSxPQUFSLEVBQWlCLEtBQWpCLENBQWhDLENBREEsQ0FBQTtBQUFBLFlBRUEsTUFBQSxDQUFPLElBQUksQ0FBQyxhQUFMLENBQUEsQ0FBUCxDQUE0QixDQUFDLElBQTdCLENBQWtDLEtBQWxDLENBRkEsQ0FBQTtBQUFBLFlBR0EsS0FBQSxDQUFNLElBQU4sRUFBWSxVQUFaLENBSEEsQ0FBQTtBQUFBLFlBS0EsU0FBQSxHQUFZLE1BQU0sQ0FBQyxVQUFQLENBQWtCLENBQWxCLENBTFosQ0FBQTtBQUFBLFlBTUEsS0FBQSxDQUFNLFNBQU4sRUFBaUIsZ0JBQWpCLENBTkEsQ0FBQTtBQUFBLFlBT0EsS0FBQSxDQUFNLFNBQU4sRUFBaUIsZUFBakIsQ0FQQSxDQUFBO0FBQUEsWUFRQSxRQUE4QixlQUFBLENBQWdCLFNBQWhCLEVBQTJCLE1BQU0sQ0FBQyxVQUFQLENBQWtCLENBQWxCLENBQTNCLENBQTlCLEVBQUMseUJBQUQsRUFBaUIsb0JBUmpCLENBQUE7QUFBQSxZQVNBLE1BQU0sQ0FBQyxXQUFQLENBQW1CLGNBQW5CLENBVEEsQ0FBQTtBQUFBLFlBV0EsTUFBQSxDQUFPLFNBQVMsQ0FBQyxjQUFqQixDQUFnQyxDQUFDLGdCQUFqQyxDQUFBLENBWEEsQ0FBQTtBQUFBLFlBWUEsTUFBQSxDQUFPLFNBQVMsQ0FBQyxhQUFqQixDQUErQixDQUFDLEdBQUcsQ0FBQyxnQkFBcEMsQ0FBQSxDQVpBLENBQUE7QUFBQSxZQWNBLE1BQU0sQ0FBQyxNQUFQLENBQWMsU0FBZCxDQWRBLENBQUE7QUFBQSxZQWVBLE1BQUEsQ0FBTyxTQUFTLENBQUMsYUFBakIsQ0FBK0IsQ0FBQyxnQkFBaEMsQ0FBQSxDQWZBLENBQUE7QUFBQSxZQWlCQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFnQixDQUFDLEdBQWpCLENBQXFCLFNBQUMsR0FBRCxHQUFBO3FCQUFTLEdBQUcsQ0FBQyxZQUFiO1lBQUEsQ0FBckIsQ0FBUCxDQUFxRCxDQUFDLE9BQXRELENBQThELENBQUMsV0FBRCxFQUFjLFFBQWQsRUFBd0IsUUFBeEIsQ0FBOUQsQ0FqQkEsQ0FBQTtBQUFBLFlBa0JBLE1BQUEsQ0FBTyxJQUFJLENBQUMsUUFBTCxDQUFBLENBQVAsQ0FBdUIsQ0FBQyxPQUF4QixDQUFnQyxDQUFDLE9BQUQsRUFBVSxLQUFWLEVBQWlCLEtBQWpCLENBQWhDLENBbEJBLENBQUE7QUFBQSxZQW1CQSxNQUFBLENBQU8sSUFBSSxDQUFDLGFBQUwsQ0FBQSxDQUFQLENBQTRCLENBQUMsSUFBN0IsQ0FBa0MsS0FBbEMsQ0FuQkEsQ0FBQTttQkFvQkEsTUFBQSxDQUFPLElBQUksQ0FBQyxRQUFaLENBQXFCLENBQUMsZ0JBQXRCLENBQUEsRUFyQjJFO1VBQUEsQ0FBN0UsRUFENkQ7UUFBQSxDQUEvRCxDQUFBLENBQUE7QUFBQSxRQXdCQSxRQUFBLENBQVMsd0RBQVQsRUFBbUUsU0FBQSxHQUFBO2lCQUNqRSxFQUFBLENBQUcsd0VBQUgsRUFBNkUsU0FBQSxHQUFBO0FBQzNFLGdCQUFBLGdDQUFBO0FBQUEsWUFBQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFnQixDQUFDLEdBQWpCLENBQXFCLFNBQUMsR0FBRCxHQUFBO3FCQUFTLEdBQUcsQ0FBQyxZQUFiO1lBQUEsQ0FBckIsQ0FBUCxDQUFxRCxDQUFDLE9BQXRELENBQThELENBQUMsUUFBRCxFQUFXLFdBQVgsRUFBd0IsUUFBeEIsQ0FBOUQsQ0FBQSxDQUFBO0FBQUEsWUFDQSxNQUFBLENBQU8sSUFBSSxDQUFDLFFBQUwsQ0FBQSxDQUFQLENBQXVCLENBQUMsT0FBeEIsQ0FBZ0MsQ0FBQyxLQUFELEVBQVEsT0FBUixFQUFpQixLQUFqQixDQUFoQyxDQURBLENBQUE7QUFBQSxZQUVBLE1BQUEsQ0FBTyxJQUFJLENBQUMsYUFBTCxDQUFBLENBQVAsQ0FBNEIsQ0FBQyxJQUE3QixDQUFrQyxLQUFsQyxDQUZBLENBQUE7QUFBQSxZQUdBLEtBQUEsQ0FBTSxJQUFOLEVBQVksVUFBWixDQUhBLENBQUE7QUFBQSxZQUtBLFFBQThCLGVBQUEsQ0FBZ0IsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsQ0FBbEIsQ0FBaEIsRUFBc0MsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsQ0FBbEIsQ0FBdEMsQ0FBOUIsRUFBQyx5QkFBRCxFQUFpQixvQkFMakIsQ0FBQTtBQUFBLFlBTUEsTUFBTSxDQUFDLFdBQVAsQ0FBbUIsY0FBbkIsQ0FOQSxDQUFBO0FBQUEsWUFPQSxNQUFNLENBQUMsTUFBUCxDQUFjLFNBQWQsQ0FQQSxDQUFBO0FBQUEsWUFTQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFnQixDQUFDLEdBQWpCLENBQXFCLFNBQUMsR0FBRCxHQUFBO3FCQUFTLEdBQUcsQ0FBQyxZQUFiO1lBQUEsQ0FBckIsQ0FBUCxDQUFxRCxDQUFDLE9BQXRELENBQThELENBQUMsUUFBRCxFQUFXLFFBQVgsRUFBcUIsV0FBckIsQ0FBOUQsQ0FUQSxDQUFBO0FBQUEsWUFVQSxNQUFBLENBQU8sSUFBSSxDQUFDLFFBQUwsQ0FBQSxDQUFQLENBQXVCLENBQUMsT0FBeEIsQ0FBZ0MsQ0FBQyxLQUFELEVBQVEsS0FBUixFQUFlLE9BQWYsQ0FBaEMsQ0FWQSxDQUFBO0FBQUEsWUFXQSxNQUFBLENBQU8sSUFBSSxDQUFDLGFBQUwsQ0FBQSxDQUFQLENBQTRCLENBQUMsSUFBN0IsQ0FBa0MsS0FBbEMsQ0FYQSxDQUFBO21CQVlBLE1BQUEsQ0FBTyxJQUFJLENBQUMsUUFBWixDQUFxQixDQUFDLGdCQUF0QixDQUFBLEVBYjJFO1VBQUEsQ0FBN0UsRUFEaUU7UUFBQSxDQUFuRSxDQXhCQSxDQUFBO0FBQUEsUUF3Q0EsUUFBQSxDQUFTLDhCQUFULEVBQXlDLFNBQUEsR0FBQTtpQkFDdkMsRUFBQSxDQUFHLHFGQUFILEVBQTBGLFNBQUEsR0FBQTtBQUN4RixnQkFBQSxnQ0FBQTtBQUFBLFlBQUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBZ0IsQ0FBQyxHQUFqQixDQUFxQixTQUFDLEdBQUQsR0FBQTtxQkFBUyxHQUFHLENBQUMsWUFBYjtZQUFBLENBQXJCLENBQVAsQ0FBcUQsQ0FBQyxPQUF0RCxDQUE4RCxDQUFDLFFBQUQsRUFBVyxXQUFYLEVBQXdCLFFBQXhCLENBQTlELENBQUEsQ0FBQTtBQUFBLFlBQ0EsTUFBQSxDQUFPLElBQUksQ0FBQyxRQUFMLENBQUEsQ0FBUCxDQUF1QixDQUFDLE9BQXhCLENBQWdDLENBQUMsS0FBRCxFQUFRLE9BQVIsRUFBaUIsS0FBakIsQ0FBaEMsQ0FEQSxDQUFBO0FBQUEsWUFFQSxNQUFBLENBQU8sSUFBSSxDQUFDLGFBQUwsQ0FBQSxDQUFQLENBQTRCLENBQUMsSUFBN0IsQ0FBa0MsS0FBbEMsQ0FGQSxDQUFBO0FBQUEsWUFHQSxLQUFBLENBQU0sSUFBTixFQUFZLFVBQVosQ0FIQSxDQUFBO0FBQUEsWUFLQSxRQUE4QixlQUFBLENBQWdCLE1BQU0sQ0FBQyxVQUFQLENBQWtCLENBQWxCLENBQWhCLEVBQXNDLE1BQU0sQ0FBQyxVQUFQLENBQWtCLENBQWxCLENBQXRDLENBQTlCLEVBQUMseUJBQUQsRUFBaUIsb0JBTGpCLENBQUE7QUFBQSxZQU1BLE1BQU0sQ0FBQyxXQUFQLENBQW1CLGNBQW5CLENBTkEsQ0FBQTtBQUFBLFlBT0EsTUFBTSxDQUFDLE1BQVAsQ0FBYyxTQUFkLENBUEEsQ0FBQTtBQUFBLFlBU0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBZ0IsQ0FBQyxHQUFqQixDQUFxQixTQUFDLEdBQUQsR0FBQTtxQkFBUyxHQUFHLENBQUMsWUFBYjtZQUFBLENBQXJCLENBQVAsQ0FBcUQsQ0FBQyxPQUF0RCxDQUE4RCxDQUFDLFFBQUQsRUFBVyxXQUFYLEVBQXdCLFFBQXhCLENBQTlELENBVEEsQ0FBQTtBQUFBLFlBVUEsTUFBQSxDQUFPLElBQUksQ0FBQyxRQUFMLENBQUEsQ0FBUCxDQUF1QixDQUFDLE9BQXhCLENBQWdDLENBQUMsS0FBRCxFQUFRLE9BQVIsRUFBaUIsS0FBakIsQ0FBaEMsQ0FWQSxDQUFBO0FBQUEsWUFXQSxNQUFBLENBQU8sSUFBSSxDQUFDLGFBQUwsQ0FBQSxDQUFQLENBQTRCLENBQUMsSUFBN0IsQ0FBa0MsS0FBbEMsQ0FYQSxDQUFBO21CQVlBLE1BQUEsQ0FBTyxJQUFJLENBQUMsUUFBWixDQUFxQixDQUFDLGdCQUF0QixDQUFBLEVBYndGO1VBQUEsQ0FBMUYsRUFEdUM7UUFBQSxDQUF6QyxDQXhDQSxDQUFBO2VBd0RBLFFBQUEsQ0FBUyxtQ0FBVCxFQUE4QyxTQUFBLEdBQUE7aUJBQzVDLEVBQUEsQ0FBRyx1Q0FBSCxFQUE0QyxTQUFBLEdBQUE7QUFDMUMsZ0JBQUEsZ0NBQUE7QUFBQSxZQUFBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQWdCLENBQUMsR0FBakIsQ0FBcUIsU0FBQyxHQUFELEdBQUE7cUJBQVMsR0FBRyxDQUFDLFlBQWI7WUFBQSxDQUFyQixDQUFQLENBQXFELENBQUMsT0FBdEQsQ0FBOEQsQ0FBQyxRQUFELEVBQVcsV0FBWCxFQUF3QixRQUF4QixDQUE5RCxDQUFBLENBQUE7QUFBQSxZQUNBLE1BQUEsQ0FBTyxJQUFJLENBQUMsUUFBTCxDQUFBLENBQVAsQ0FBdUIsQ0FBQyxPQUF4QixDQUFnQyxDQUFDLEtBQUQsRUFBUSxPQUFSLEVBQWlCLEtBQWpCLENBQWhDLENBREEsQ0FBQTtBQUFBLFlBRUEsTUFBQSxDQUFPLElBQUksQ0FBQyxhQUFMLENBQUEsQ0FBUCxDQUE0QixDQUFDLElBQTdCLENBQWtDLEtBQWxDLENBRkEsQ0FBQTtBQUFBLFlBR0EsS0FBQSxDQUFNLElBQU4sRUFBWSxVQUFaLENBSEEsQ0FBQTtBQUFBLFlBS0EsUUFBOEIsZUFBQSxDQUFnQixNQUFNLENBQUMsVUFBUCxDQUFrQixDQUFsQixDQUFoQixFQUFzQyxNQUF0QyxDQUE5QixFQUFDLHlCQUFELEVBQWlCLG9CQUxqQixDQUFBO0FBQUEsWUFNQSxNQUFNLENBQUMsV0FBUCxDQUFtQixjQUFuQixDQU5BLENBQUE7QUFBQSxZQU9BLE1BQU0sQ0FBQyxNQUFQLENBQWMsU0FBZCxDQVBBLENBQUE7QUFBQSxZQVNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQWdCLENBQUMsR0FBakIsQ0FBcUIsU0FBQyxHQUFELEdBQUE7cUJBQVMsR0FBRyxDQUFDLFlBQWI7WUFBQSxDQUFyQixDQUFQLENBQXFELENBQUMsT0FBdEQsQ0FBOEQsQ0FBQyxXQUFELEVBQWMsUUFBZCxFQUF3QixRQUF4QixDQUE5RCxDQVRBLENBQUE7bUJBVUEsTUFBQSxDQUFPLElBQUksQ0FBQyxRQUFMLENBQUEsQ0FBUCxDQUF1QixDQUFDLE9BQXhCLENBQWdDLENBQUMsT0FBRCxFQUFVLEtBQVYsRUFBaUIsS0FBakIsQ0FBaEMsRUFYMEM7VUFBQSxDQUE1QyxFQUQ0QztRQUFBLENBQTlDLEVBekRxRDtNQUFBLENBQXZELENBQUEsQ0FBQTtBQUFBLE1BdUVBLFFBQUEsQ0FBUywyQ0FBVCxFQUFzRCxTQUFBLEdBQUE7QUFDcEQsWUFBQSw2QkFBQTtBQUFBLFFBQUEsUUFBMkIsRUFBM0IsRUFBQyxnQkFBRCxFQUFRLGtCQUFSLEVBQWlCLGlCQUFqQixDQUFBO0FBQUEsUUFFQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsVUFBQSxLQUFBLEdBQVEsSUFBSSxDQUFDLFVBQUwsQ0FBZ0I7QUFBQSxZQUFBLGNBQUEsRUFBZ0IsSUFBaEI7V0FBaEIsQ0FBUixDQUFBO0FBQUEsVUFDQyxTQUFVLEtBQUssQ0FBQyxRQUFOLENBQUEsSUFEWCxDQUFBO0FBQUEsVUFFQSxPQUFBLEdBQVUsR0FBQSxDQUFBLFVBRlYsQ0FBQTtpQkFHQSxPQUFPLENBQUMsVUFBUixDQUFtQixLQUFuQixFQUpTO1FBQUEsQ0FBWCxDQUZBLENBQUE7QUFBQSxRQVFBLEVBQUEsQ0FBRyxxRkFBSCxFQUEwRixTQUFBLEdBQUE7QUFDeEYsY0FBQSxnQ0FBQTtBQUFBLFVBQUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBZ0IsQ0FBQyxHQUFqQixDQUFxQixTQUFDLEdBQUQsR0FBQTttQkFBUyxHQUFHLENBQUMsWUFBYjtVQUFBLENBQXJCLENBQVAsQ0FBcUQsQ0FBQyxPQUF0RCxDQUE4RCxDQUFDLFFBQUQsRUFBVyxXQUFYLEVBQXdCLFFBQXhCLENBQTlELENBQUEsQ0FBQTtBQUFBLFVBQ0EsTUFBQSxDQUFPLElBQUksQ0FBQyxRQUFMLENBQUEsQ0FBUCxDQUF1QixDQUFDLE9BQXhCLENBQWdDLENBQUMsS0FBRCxFQUFRLE9BQVIsRUFBaUIsS0FBakIsQ0FBaEMsQ0FEQSxDQUFBO0FBQUEsVUFFQSxNQUFBLENBQU8sSUFBSSxDQUFDLGFBQUwsQ0FBQSxDQUFQLENBQTRCLENBQUMsSUFBN0IsQ0FBa0MsS0FBbEMsQ0FGQSxDQUFBO0FBQUEsVUFJQSxNQUFBLENBQU8sT0FBTyxDQUFDLE9BQVIsQ0FBQSxDQUFpQixDQUFDLEdBQWxCLENBQXNCLFNBQUMsR0FBRCxHQUFBO21CQUFTLEdBQUcsQ0FBQyxZQUFiO1VBQUEsQ0FBdEIsQ0FBUCxDQUFzRCxDQUFDLE9BQXZELENBQStELENBQUMsUUFBRCxDQUEvRCxDQUpBLENBQUE7QUFBQSxVQUtBLE1BQUEsQ0FBTyxLQUFLLENBQUMsUUFBTixDQUFBLENBQVAsQ0FBd0IsQ0FBQyxPQUF6QixDQUFpQyxDQUFDLE1BQUQsQ0FBakMsQ0FMQSxDQUFBO0FBQUEsVUFNQSxNQUFBLENBQU8sS0FBSyxDQUFDLFVBQWIsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixNQUE5QixDQU5BLENBQUE7QUFBQSxVQU9BLEtBQUEsQ0FBTSxLQUFOLEVBQWEsVUFBYixDQVBBLENBQUE7QUFBQSxVQVNBLFFBQThCLGVBQUEsQ0FBZ0IsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsQ0FBbEIsQ0FBaEIsRUFBc0MsT0FBTyxDQUFDLFVBQVIsQ0FBbUIsQ0FBbkIsQ0FBdEMsQ0FBOUIsRUFBQyx5QkFBRCxFQUFpQixvQkFUakIsQ0FBQTtBQUFBLFVBVUEsTUFBTSxDQUFDLFdBQVAsQ0FBbUIsY0FBbkIsQ0FWQSxDQUFBO0FBQUEsVUFXQSxPQUFPLENBQUMsTUFBUixDQUFlLFNBQWYsQ0FYQSxDQUFBO0FBQUEsVUFhQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFnQixDQUFDLEdBQWpCLENBQXFCLFNBQUMsR0FBRCxHQUFBO21CQUFTLEdBQUcsQ0FBQyxZQUFiO1VBQUEsQ0FBckIsQ0FBUCxDQUFxRCxDQUFDLE9BQXRELENBQThELENBQUMsV0FBRCxFQUFjLFFBQWQsQ0FBOUQsQ0FiQSxDQUFBO0FBQUEsVUFjQSxNQUFBLENBQU8sSUFBSSxDQUFDLFFBQUwsQ0FBQSxDQUFQLENBQXVCLENBQUMsT0FBeEIsQ0FBZ0MsQ0FBQyxPQUFELEVBQVUsS0FBVixDQUFoQyxDQWRBLENBQUE7QUFBQSxVQWVBLE1BQUEsQ0FBTyxJQUFJLENBQUMsYUFBTCxDQUFBLENBQVAsQ0FBNEIsQ0FBQyxJQUE3QixDQUFrQyxLQUFsQyxDQWZBLENBQUE7QUFBQSxVQWlCQSxNQUFBLENBQU8sT0FBTyxDQUFDLE9BQVIsQ0FBQSxDQUFpQixDQUFDLEdBQWxCLENBQXNCLFNBQUMsR0FBRCxHQUFBO21CQUFTLEdBQUcsQ0FBQyxZQUFiO1VBQUEsQ0FBdEIsQ0FBUCxDQUFzRCxDQUFDLE9BQXZELENBQStELENBQUMsUUFBRCxFQUFXLFFBQVgsQ0FBL0QsQ0FqQkEsQ0FBQTtBQUFBLFVBa0JBLE1BQUEsQ0FBTyxLQUFLLENBQUMsUUFBTixDQUFBLENBQVAsQ0FBd0IsQ0FBQyxPQUF6QixDQUFpQyxDQUFDLE1BQUQsRUFBUyxLQUFULENBQWpDLENBbEJBLENBQUE7QUFBQSxVQW1CQSxNQUFBLENBQU8sS0FBSyxDQUFDLFVBQWIsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixLQUE5QixDQW5CQSxDQUFBO2lCQW9CQSxNQUFBLENBQU8sS0FBSyxDQUFDLFFBQWIsQ0FBc0IsQ0FBQyxnQkFBdkIsQ0FBQSxFQXJCd0Y7UUFBQSxDQUExRixDQVJBLENBQUE7ZUErQkEsUUFBQSxDQUFTLDBDQUFULEVBQXFELFNBQUEsR0FBQTtpQkFDbkQsRUFBQSxDQUFHLHFGQUFILEVBQTBGLFNBQUEsR0FBQTtBQUN4RixnQkFBQSxnQ0FBQTtBQUFBLFlBQUEsS0FBSyxDQUFDLFlBQU4sQ0FBQSxDQUFBLENBQUE7QUFBQSxZQUVBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQWdCLENBQUMsR0FBakIsQ0FBcUIsU0FBQyxHQUFELEdBQUE7cUJBQVMsR0FBRyxDQUFDLFlBQWI7WUFBQSxDQUFyQixDQUFQLENBQXFELENBQUMsT0FBdEQsQ0FBOEQsQ0FBQyxRQUFELEVBQVcsV0FBWCxFQUF3QixRQUF4QixDQUE5RCxDQUZBLENBQUE7QUFBQSxZQUdBLE1BQUEsQ0FBTyxJQUFJLENBQUMsUUFBTCxDQUFBLENBQVAsQ0FBdUIsQ0FBQyxPQUF4QixDQUFnQyxDQUFDLEtBQUQsRUFBUSxPQUFSLEVBQWlCLEtBQWpCLENBQWhDLENBSEEsQ0FBQTtBQUFBLFlBSUEsTUFBQSxDQUFPLElBQUksQ0FBQyxhQUFMLENBQUEsQ0FBUCxDQUE0QixDQUFDLElBQTdCLENBQWtDLEtBQWxDLENBSkEsQ0FBQTtBQUFBLFlBTUEsTUFBQSxDQUFPLE9BQU8sQ0FBQyxPQUFSLENBQUEsQ0FBaUIsQ0FBQyxHQUFsQixDQUFzQixTQUFDLEdBQUQsR0FBQTtxQkFBUyxHQUFHLENBQUMsWUFBYjtZQUFBLENBQXRCLENBQVAsQ0FBc0QsQ0FBQyxPQUF2RCxDQUErRCxFQUEvRCxDQU5BLENBQUE7QUFBQSxZQU9BLE1BQUEsQ0FBTyxLQUFLLENBQUMsUUFBTixDQUFBLENBQVAsQ0FBd0IsQ0FBQyxPQUF6QixDQUFpQyxFQUFqQyxDQVBBLENBQUE7QUFBQSxZQVFBLE1BQUEsQ0FBTyxLQUFLLENBQUMsVUFBYixDQUF3QixDQUFDLGFBQXpCLENBQUEsQ0FSQSxDQUFBO0FBQUEsWUFTQSxLQUFBLENBQU0sS0FBTixFQUFhLFVBQWIsQ0FUQSxDQUFBO0FBQUEsWUFXQSxRQUE4QixlQUFBLENBQWdCLE1BQU0sQ0FBQyxVQUFQLENBQWtCLENBQWxCLENBQWhCLEVBQXNDLE9BQXRDLENBQTlCLEVBQUMseUJBQUQsRUFBaUIsb0JBWGpCLENBQUE7QUFBQSxZQVlBLE1BQU0sQ0FBQyxXQUFQLENBQW1CLGNBQW5CLENBWkEsQ0FBQTtBQUFBLFlBYUEsT0FBTyxDQUFDLFVBQVIsQ0FBbUIsU0FBbkIsQ0FiQSxDQUFBO0FBQUEsWUFjQSxPQUFPLENBQUMsTUFBUixDQUFlLFNBQWYsQ0FkQSxDQUFBO0FBQUEsWUFnQkEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBZ0IsQ0FBQyxHQUFqQixDQUFxQixTQUFDLEdBQUQsR0FBQTtxQkFBUyxHQUFHLENBQUMsWUFBYjtZQUFBLENBQXJCLENBQVAsQ0FBcUQsQ0FBQyxPQUF0RCxDQUE4RCxDQUFDLFdBQUQsRUFBYyxRQUFkLENBQTlELENBaEJBLENBQUE7QUFBQSxZQWlCQSxNQUFBLENBQU8sSUFBSSxDQUFDLFFBQUwsQ0FBQSxDQUFQLENBQXVCLENBQUMsT0FBeEIsQ0FBZ0MsQ0FBQyxPQUFELEVBQVUsS0FBVixDQUFoQyxDQWpCQSxDQUFBO0FBQUEsWUFrQkEsTUFBQSxDQUFPLElBQUksQ0FBQyxhQUFMLENBQUEsQ0FBUCxDQUE0QixDQUFDLElBQTdCLENBQWtDLEtBQWxDLENBbEJBLENBQUE7QUFBQSxZQW9CQSxNQUFBLENBQU8sT0FBTyxDQUFDLE9BQVIsQ0FBQSxDQUFpQixDQUFDLEdBQWxCLENBQXNCLFNBQUMsR0FBRCxHQUFBO3FCQUFTLEdBQUcsQ0FBQyxZQUFiO1lBQUEsQ0FBdEIsQ0FBUCxDQUFzRCxDQUFDLE9BQXZELENBQStELENBQUMsUUFBRCxDQUEvRCxDQXBCQSxDQUFBO0FBQUEsWUFxQkEsTUFBQSxDQUFPLEtBQUssQ0FBQyxRQUFOLENBQUEsQ0FBUCxDQUF3QixDQUFDLE9BQXpCLENBQWlDLENBQUMsS0FBRCxDQUFqQyxDQXJCQSxDQUFBO0FBQUEsWUFzQkEsTUFBQSxDQUFPLEtBQUssQ0FBQyxVQUFiLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsS0FBOUIsQ0F0QkEsQ0FBQTttQkF1QkEsTUFBQSxDQUFPLEtBQUssQ0FBQyxRQUFiLENBQXNCLENBQUMsZ0JBQXZCLENBQUEsRUF4QndGO1VBQUEsQ0FBMUYsRUFEbUQ7UUFBQSxDQUFyRCxFQWhDb0Q7TUFBQSxDQUF0RCxDQXZFQSxDQUFBO0FBQUEsTUFrSUEsUUFBQSxDQUFTLG1DQUFULEVBQThDLFNBQUEsR0FBQTtlQUM1QyxFQUFBLENBQUcsZUFBSCxFQUFvQixTQUFBLEdBQUE7QUFDbEIsY0FBQSxnQ0FBQTtBQUFBLFVBQUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBZ0IsQ0FBQyxHQUFqQixDQUFxQixTQUFDLEdBQUQsR0FBQTttQkFBUyxHQUFHLENBQUMsWUFBYjtVQUFBLENBQXJCLENBQVAsQ0FBcUQsQ0FBQyxPQUF0RCxDQUE4RCxDQUFDLFFBQUQsRUFBVyxXQUFYLEVBQXdCLFFBQXhCLENBQTlELENBQUEsQ0FBQTtBQUFBLFVBQ0EsTUFBQSxDQUFPLElBQUksQ0FBQyxRQUFMLENBQUEsQ0FBUCxDQUF1QixDQUFDLE9BQXhCLENBQWdDLENBQUMsS0FBRCxFQUFRLE9BQVIsRUFBaUIsS0FBakIsQ0FBaEMsQ0FEQSxDQUFBO0FBQUEsVUFFQSxNQUFBLENBQU8sSUFBSSxDQUFDLGFBQUwsQ0FBQSxDQUFQLENBQTRCLENBQUMsSUFBN0IsQ0FBa0MsS0FBbEMsQ0FGQSxDQUFBO0FBQUEsVUFHQSxLQUFBLENBQU0sSUFBTixFQUFZLFVBQVosQ0FIQSxDQUFBO0FBQUEsVUFLQSxRQUE4QixlQUFBLENBQWdCLE1BQU0sQ0FBQyxVQUFQLENBQWtCLENBQWxCLENBQWhCLEVBQXNDLE1BQU0sQ0FBQyxVQUFQLENBQWtCLENBQWxCLENBQXRDLENBQTlCLEVBQUMseUJBQUQsRUFBaUIsb0JBTGpCLENBQUE7QUFBQSxVQU1BLE1BQU0sQ0FBQyxNQUFQLENBQWMsU0FBZCxDQU5BLENBQUE7QUFBQSxVQVFBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQWdCLENBQUMsR0FBakIsQ0FBcUIsU0FBQyxHQUFELEdBQUE7bUJBQVMsR0FBRyxDQUFDLFlBQWI7VUFBQSxDQUFyQixDQUFQLENBQXFELENBQUMsT0FBdEQsQ0FBOEQsQ0FBQyxRQUFELEVBQVcsV0FBWCxFQUF3QixRQUF4QixDQUE5RCxDQVJBLENBQUE7QUFBQSxVQVNBLE1BQUEsQ0FBTyxJQUFJLENBQUMsUUFBTCxDQUFBLENBQVAsQ0FBdUIsQ0FBQyxPQUF4QixDQUFnQyxDQUFDLEtBQUQsRUFBUSxPQUFSLEVBQWlCLEtBQWpCLENBQWhDLENBVEEsQ0FBQTtBQUFBLFVBVUEsTUFBQSxDQUFPLElBQUksQ0FBQyxhQUFMLENBQUEsQ0FBUCxDQUE0QixDQUFDLElBQTdCLENBQWtDLEtBQWxDLENBVkEsQ0FBQTtpQkFXQSxNQUFBLENBQU8sSUFBSSxDQUFDLFFBQVosQ0FBcUIsQ0FBQyxHQUFHLENBQUMsZ0JBQTFCLENBQUEsRUFaa0I7UUFBQSxDQUFwQixFQUQ0QztNQUFBLENBQTlDLENBbElBLENBQUE7QUFBQSxNQWlKQSxRQUFBLENBQVMsMENBQVQsRUFBcUQsU0FBQSxHQUFBO2VBQ25ELEVBQUEsQ0FBRyxxQ0FBSCxFQUEwQyxTQUFBLEdBQUE7QUFDeEMsY0FBQSxnQ0FBQTtBQUFBLFVBQUEsUUFBOEIsZUFBQSxDQUFnQixNQUFNLENBQUMsVUFBUCxDQUFrQixDQUFsQixDQUFoQixFQUFzQyxNQUFNLENBQUMsVUFBUCxDQUFrQixDQUFsQixDQUF0QyxDQUE5QixFQUFDLHlCQUFELEVBQWlCLG9CQUFqQixDQUFBO0FBQUEsVUFDQSxNQUFNLENBQUMsV0FBUCxDQUFtQixjQUFuQixDQURBLENBQUE7QUFBQSxVQUdBLE1BQUEsQ0FBTyxjQUFjLENBQUMsWUFBWSxDQUFDLE9BQTVCLENBQW9DLFlBQXBDLENBQVAsQ0FBeUQsQ0FBQyxPQUExRCxDQUFrRSxPQUFPLENBQUMsT0FBUixDQUFBLENBQWxFLENBSEEsQ0FBQTtBQUlBLFVBQUEsSUFBRyxPQUFPLENBQUMsUUFBUixLQUFvQixRQUF2QjttQkFDRSxNQUFBLENBQU8sY0FBYyxDQUFDLFlBQVksQ0FBQyxPQUE1QixDQUFvQyxlQUFwQyxDQUFQLENBQTRELENBQUMsT0FBN0QsQ0FBc0UsU0FBQSxHQUFRLENBQUMsT0FBTyxDQUFDLE9BQVIsQ0FBQSxDQUFELENBQTlFLEVBREY7V0FMd0M7UUFBQSxDQUExQyxFQURtRDtNQUFBLENBQXJELENBakpBLENBQUE7YUEwSkEsUUFBQSxDQUFTLDhDQUFULEVBQXlELFNBQUEsR0FBQTtBQUN2RCxRQUFBLEVBQUEsQ0FBRywyRUFBSCxFQUFnRixTQUFBLEdBQUE7QUFDOUUsY0FBQSxnQ0FBQTtBQUFBLFVBQUEsUUFBOEIsZUFBQSxDQUFnQixNQUFNLENBQUMsVUFBUCxDQUFrQixDQUFsQixDQUFoQixFQUFzQyxNQUFNLENBQUMsVUFBUCxDQUFrQixDQUFsQixDQUF0QyxDQUE5QixFQUFDLHlCQUFELEVBQWlCLG9CQUFqQixDQUFBO0FBQUEsVUFDQSxNQUFNLENBQUMsV0FBUCxDQUFtQixjQUFuQixDQURBLENBQUE7QUFBQSxVQUVBLE1BQU0sQ0FBQyxtQkFBUCxDQUEyQixJQUFJLENBQUMsRUFBaEMsRUFBb0MsQ0FBcEMsQ0FGQSxDQUFBO0FBQUEsVUFJQSxNQUFBLENBQU8sSUFBSSxDQUFDLFFBQUwsQ0FBQSxDQUFQLENBQXVCLENBQUMsT0FBeEIsQ0FBZ0MsQ0FBQyxLQUFELEVBQVEsS0FBUixDQUFoQyxDQUpBLENBQUE7QUFBQSxVQUtBLE1BQUEsQ0FBTyxJQUFJLENBQUMsYUFBTCxDQUFBLENBQVAsQ0FBNEIsQ0FBQyxJQUE3QixDQUFrQyxLQUFsQyxDQUxBLENBQUE7QUFBQSxVQU9BLFNBQVMsQ0FBQyxZQUFZLENBQUMsT0FBdkIsQ0FBK0IsZ0JBQS9CLEVBQWlELE1BQU0sQ0FBQyxXQUFQLENBQUEsQ0FBQSxHQUF1QixDQUF4RSxDQVBBLENBQUE7QUFBQSxVQVNBLEtBQUEsQ0FBTSxNQUFOLEVBQWMsc0JBQWQsQ0FBcUMsQ0FBQyxjQUF0QyxDQUFBLENBVEEsQ0FBQTtBQUFBLFVBVUEsTUFBTSxDQUFDLE1BQVAsQ0FBYyxTQUFkLENBVkEsQ0FBQTtBQUFBLFVBWUEsUUFBQSxDQUFTLFNBQUEsR0FBQTttQkFDUCxNQUFNLENBQUMsb0JBQW9CLENBQUMsU0FBNUIsR0FBd0MsRUFEakM7VUFBQSxDQUFULENBWkEsQ0FBQTtpQkFlQSxJQUFBLENBQUssU0FBQSxHQUFBO0FBQ0gsZ0JBQUEsTUFBQTtBQUFBLFlBQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFULENBQUE7QUFBQSxZQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixPQUFPLENBQUMsT0FBUixDQUFBLENBQTlCLENBREEsQ0FBQTttQkFFQSxNQUFBLENBQU8sSUFBSSxDQUFDLFFBQUwsQ0FBQSxDQUFQLENBQXVCLENBQUMsT0FBeEIsQ0FBZ0MsQ0FBQyxLQUFELEVBQVEsTUFBUixFQUFnQixLQUFoQixDQUFoQyxFQUhHO1VBQUEsQ0FBTCxFQWhCOEU7UUFBQSxDQUFoRixDQUFBLENBQUE7QUFBQSxRQXFCQSxFQUFBLENBQUcsc0RBQUgsRUFBMkQsU0FBQSxHQUFBO0FBQ3pELGNBQUEsZ0NBQUE7QUFBQSxVQUFBLE9BQU8sQ0FBQyxPQUFSLENBQWdCLDRCQUFoQixDQUFBLENBQUE7QUFBQSxVQUNBLFFBQThCLGVBQUEsQ0FBZ0IsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsQ0FBbEIsQ0FBaEIsRUFBc0MsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsQ0FBbEIsQ0FBdEMsQ0FBOUIsRUFBQyx5QkFBRCxFQUFpQixvQkFEakIsQ0FBQTtBQUFBLFVBRUEsTUFBTSxDQUFDLFdBQVAsQ0FBbUIsY0FBbkIsQ0FGQSxDQUFBO0FBQUEsVUFHQSxNQUFNLENBQUMsbUJBQVAsQ0FBMkIsSUFBSSxDQUFDLEVBQWhDLEVBQW9DLENBQXBDLENBSEEsQ0FBQTtBQUFBLFVBS0EsU0FBUyxDQUFDLFlBQVksQ0FBQyxPQUF2QixDQUErQixnQkFBL0IsRUFBaUQsTUFBTSxDQUFDLFdBQVAsQ0FBQSxDQUFBLEdBQXVCLENBQXhFLENBTEEsQ0FBQTtBQUFBLFVBT0EsS0FBQSxDQUFNLE1BQU4sRUFBYyxzQkFBZCxDQUFxQyxDQUFDLGNBQXRDLENBQUEsQ0FQQSxDQUFBO0FBQUEsVUFRQSxNQUFNLENBQUMsTUFBUCxDQUFjLFNBQWQsQ0FSQSxDQUFBO0FBQUEsVUFVQSxRQUFBLENBQVMsU0FBQSxHQUFBO21CQUNQLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxTQUE1QixHQUF3QyxFQURqQztVQUFBLENBQVQsQ0FWQSxDQUFBO2lCQWFBLElBQUEsQ0FBSyxTQUFBLEdBQUE7bUJBQ0gsTUFBQSxDQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFvQyxDQUFDLE9BQXJDLENBQUEsQ0FBUCxDQUFzRCxDQUFDLElBQXZELENBQTRELDRCQUE1RCxFQURHO1VBQUEsQ0FBTCxFQWR5RDtRQUFBLENBQTNELENBckJBLENBQUE7ZUFzQ0EsRUFBQSxDQUFHLHFEQUFILEVBQTBELFNBQUEsR0FBQTtBQUN4RCxjQUFBLGdDQUFBO0FBQUEsVUFBQSxPQUFPLENBQUMsU0FBUixDQUFBLENBQW1CLENBQUMsT0FBcEIsQ0FBNEIsSUFBNUIsQ0FBQSxDQUFBO0FBQUEsVUFDQSxPQUFPLENBQUMsT0FBUixDQUFnQixnQkFBaEIsQ0FEQSxDQUFBO0FBQUEsVUFHQSxRQUE4QixlQUFBLENBQWdCLE1BQU0sQ0FBQyxVQUFQLENBQWtCLENBQWxCLENBQWhCLEVBQXNDLE1BQU0sQ0FBQyxVQUFQLENBQWtCLENBQWxCLENBQXRDLENBQTlCLEVBQUMseUJBQUQsRUFBaUIsb0JBSGpCLENBQUE7QUFBQSxVQUlBLE1BQU0sQ0FBQyxXQUFQLENBQW1CLGNBQW5CLENBSkEsQ0FBQTtBQUFBLFVBS0EsTUFBTSxDQUFDLG1CQUFQLENBQTJCLElBQUksQ0FBQyxFQUFoQyxFQUFvQyxDQUFwQyxDQUxBLENBQUE7QUFBQSxVQU9BLFNBQVMsQ0FBQyxZQUFZLENBQUMsT0FBdkIsQ0FBK0IsZ0JBQS9CLEVBQWlELE1BQU0sQ0FBQyxXQUFQLENBQUEsQ0FBQSxHQUF1QixDQUF4RSxDQVBBLENBQUE7QUFBQSxVQVNBLEtBQUEsQ0FBTSxNQUFOLEVBQWMsc0JBQWQsQ0FBcUMsQ0FBQyxjQUF0QyxDQUFBLENBVEEsQ0FBQTtBQUFBLFVBVUEsTUFBTSxDQUFDLE1BQVAsQ0FBYyxTQUFkLENBVkEsQ0FBQTtBQUFBLFVBWUEsUUFBQSxDQUFTLFNBQUEsR0FBQTttQkFDUCxNQUFNLENBQUMsb0JBQW9CLENBQUMsU0FBNUIsR0FBd0MsRUFEakM7VUFBQSxDQUFULENBWkEsQ0FBQTtpQkFlQSxJQUFBLENBQUssU0FBQSxHQUFBO0FBQ0gsWUFBQSxNQUFBLENBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBQW9DLENBQUMsT0FBckMsQ0FBQSxDQUFQLENBQXNELENBQUMsSUFBdkQsQ0FBNEQsZ0JBQTVELENBQUEsQ0FBQTttQkFDQSxNQUFBLENBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBQW9DLENBQUMsT0FBckMsQ0FBQSxDQUFQLENBQXNELENBQUMsYUFBdkQsQ0FBQSxFQUZHO1VBQUEsQ0FBTCxFQWhCd0Q7UUFBQSxDQUExRCxFQXZDdUQ7TUFBQSxDQUF6RCxFQTNKcUM7SUFBQSxDQUF2QyxDQXRkQSxDQUFBO0FBQUEsSUE0cUJBLFFBQUEsQ0FBUyxvQ0FBVCxFQUErQyxTQUFBLEdBQUE7YUFDN0MsRUFBQSxDQUFHLDBCQUFILEVBQStCLFNBQUEsR0FBQTtBQUM3QixZQUFBLGNBQUE7QUFBQSxRQUFBLGNBQUEsR0FBaUIsT0FBTyxDQUFDLFNBQVIsQ0FBa0IsZ0JBQWxCLENBQWpCLENBQUE7QUFBQSxRQUNBLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixNQUFsQixFQUEwQixzQkFBMUIsRUFBa0QsY0FBbEQsQ0FEQSxDQUFBO0FBQUEsUUFHQSxpQkFBQSxDQUFrQixVQUFsQixFQUE4QixNQUFNLENBQUMsT0FBUCxDQUFBLENBQWlCLENBQUEsQ0FBQSxDQUEvQyxDQUhBLENBQUE7QUFBQSxRQUlBLE1BQUEsQ0FBTyxjQUFjLENBQUMsU0FBdEIsQ0FBZ0MsQ0FBQyxJQUFqQyxDQUFzQyxDQUF0QyxDQUpBLENBQUE7QUFBQSxRQU1BLGlCQUFBLENBQWtCLFVBQWxCLEVBQThCLE1BQTlCLENBTkEsQ0FBQTtlQU9BLE1BQUEsQ0FBTyxjQUFjLENBQUMsU0FBdEIsQ0FBZ0MsQ0FBQyxJQUFqQyxDQUFzQyxDQUF0QyxFQVI2QjtNQUFBLENBQS9CLEVBRDZDO0lBQUEsQ0FBL0MsQ0E1cUJBLENBQUE7QUFBQSxJQXVyQkEsUUFBQSxDQUFTLDZDQUFULEVBQXdELFNBQUEsR0FBQTtBQUN0RCxNQUFBLFFBQUEsQ0FBUywrQ0FBVCxFQUEwRCxTQUFBLEdBQUE7QUFDeEQsUUFBQSxVQUFBLENBQVcsU0FBQSxHQUFBO0FBQ1QsVUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsbUJBQWhCLEVBQXFDLElBQXJDLENBQUEsQ0FBQTtpQkFDQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsNEJBQWhCLEVBQThDLEdBQTlDLEVBRlM7UUFBQSxDQUFYLENBQUEsQ0FBQTtBQUFBLFFBSUEsUUFBQSxDQUFTLGlDQUFULEVBQTRDLFNBQUEsR0FBQTtBQUMxQyxVQUFBLEVBQUEsQ0FBRyw0Q0FBSCxFQUFpRCxTQUFBLEdBQUE7QUFDL0MsWUFBQSxNQUFBLENBQU8sSUFBSSxDQUFDLGFBQUwsQ0FBQSxDQUFQLENBQTRCLENBQUMsSUFBN0IsQ0FBa0MsS0FBbEMsQ0FBQSxDQUFBO0FBQUEsWUFDQSxNQUFNLENBQUMsYUFBUCxDQUFxQixlQUFBLENBQWdCLEdBQWhCLENBQXJCLENBREEsQ0FBQTttQkFFQSxNQUFBLENBQU8sSUFBSSxDQUFDLGFBQUwsQ0FBQSxDQUFQLENBQTRCLENBQUMsSUFBN0IsQ0FBa0MsT0FBbEMsRUFIK0M7VUFBQSxDQUFqRCxDQUFBLENBQUE7aUJBS0EsRUFBQSxDQUFHLDRGQUFILEVBQWlHLFNBQUEsR0FBQTtBQUMvRixZQUFBLE1BQUEsQ0FBTyxJQUFJLENBQUMsYUFBTCxDQUFBLENBQVAsQ0FBNEIsQ0FBQyxJQUE3QixDQUFrQyxLQUFsQyxDQUFBLENBQUE7QUFBQSxZQUNBLE1BQU0sQ0FBQyxhQUFQLENBQXFCLGVBQUEsQ0FBZ0IsRUFBaEIsQ0FBckIsQ0FEQSxDQUFBO0FBQUEsWUFFQSxNQUFBLENBQU8sSUFBSSxDQUFDLGFBQUwsQ0FBQSxDQUFQLENBQTRCLENBQUMsSUFBN0IsQ0FBa0MsS0FBbEMsQ0FGQSxDQUFBO0FBQUEsWUFHQSxNQUFNLENBQUMsYUFBUCxDQUFxQixlQUFBLENBQWdCLEVBQWhCLENBQXJCLENBSEEsQ0FBQTtBQUFBLFlBSUEsTUFBQSxDQUFPLElBQUksQ0FBQyxhQUFMLENBQUEsQ0FBUCxDQUE0QixDQUFDLElBQTdCLENBQWtDLEtBQWxDLENBSkEsQ0FBQTtBQUFBLFlBS0EsTUFBTSxDQUFDLGFBQVAsQ0FBcUIsZUFBQSxDQUFnQixFQUFoQixDQUFyQixDQUxBLENBQUE7bUJBTUEsTUFBQSxDQUFPLElBQUksQ0FBQyxhQUFMLENBQUEsQ0FBUCxDQUE0QixDQUFDLElBQTdCLENBQWtDLE9BQWxDLEVBUCtGO1VBQUEsQ0FBakcsRUFOMEM7UUFBQSxDQUE1QyxDQUpBLENBQUE7QUFBQSxRQW1CQSxRQUFBLENBQVMsbUNBQVQsRUFBOEMsU0FBQSxHQUFBO2lCQUM1QyxFQUFBLENBQUcsNENBQUgsRUFBaUQsU0FBQSxHQUFBO0FBQy9DLFlBQUEsTUFBQSxDQUFPLElBQUksQ0FBQyxhQUFMLENBQUEsQ0FBUCxDQUE0QixDQUFDLElBQTdCLENBQWtDLEtBQWxDLENBQUEsQ0FBQTtBQUFBLFlBQ0EsTUFBTSxDQUFDLGFBQVAsQ0FBcUIsZUFBQSxDQUFnQixDQUFBLEdBQWhCLENBQXJCLENBREEsQ0FBQTttQkFFQSxNQUFBLENBQU8sSUFBSSxDQUFDLGFBQUwsQ0FBQSxDQUFQLENBQTRCLENBQUMsSUFBN0IsQ0FBa0MsS0FBbEMsRUFIK0M7VUFBQSxDQUFqRCxFQUQ0QztRQUFBLENBQTlDLENBbkJBLENBQUE7QUFBQSxRQXlCQSxRQUFBLENBQVMsMERBQVQsRUFBcUUsU0FBQSxHQUFBO2lCQUNuRSxFQUFBLENBQUcsZ0NBQUgsRUFBcUMsU0FBQSxHQUFBO0FBQ25DLFlBQUEsTUFBQSxDQUFPLElBQUksQ0FBQyxhQUFMLENBQUEsQ0FBUCxDQUE0QixDQUFDLElBQTdCLENBQWtDLEtBQWxDLENBQUEsQ0FBQTtBQUFBLFlBQ0EsTUFBTSxDQUFDLGFBQVAsQ0FBcUIsd0JBQUEsQ0FBeUIsR0FBekIsQ0FBckIsQ0FEQSxDQUFBO21CQUVBLE1BQUEsQ0FBTyxJQUFJLENBQUMsYUFBTCxDQUFBLENBQVAsQ0FBNEIsQ0FBQyxJQUE3QixDQUFrQyxLQUFsQyxFQUhtQztVQUFBLENBQXJDLEVBRG1FO1FBQUEsQ0FBckUsQ0F6QkEsQ0FBQTtlQStCQSxRQUFBLENBQVMsNERBQVQsRUFBdUUsU0FBQSxHQUFBO2lCQUNyRSxFQUFBLENBQUcsZ0NBQUgsRUFBcUMsU0FBQSxHQUFBO0FBQ25DLFlBQUEsTUFBQSxDQUFPLElBQUksQ0FBQyxhQUFMLENBQUEsQ0FBUCxDQUE0QixDQUFDLElBQTdCLENBQWtDLEtBQWxDLENBQUEsQ0FBQTtBQUFBLFlBQ0EsTUFBTSxDQUFDLGFBQVAsQ0FBcUIsd0JBQUEsQ0FBeUIsQ0FBQSxHQUF6QixDQUFyQixDQURBLENBQUE7bUJBRUEsTUFBQSxDQUFPLElBQUksQ0FBQyxhQUFMLENBQUEsQ0FBUCxDQUE0QixDQUFDLElBQTdCLENBQWtDLEtBQWxDLEVBSG1DO1VBQUEsQ0FBckMsRUFEcUU7UUFBQSxDQUF2RSxFQWhDd0Q7TUFBQSxDQUExRCxDQUFBLENBQUE7YUFzQ0EsUUFBQSxDQUFTLGdEQUFULEVBQTJELFNBQUEsR0FBQTtBQUN6RCxRQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7aUJBQ1QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLG1CQUFoQixFQUFxQyxLQUFyQyxFQURTO1FBQUEsQ0FBWCxDQUFBLENBQUE7QUFBQSxRQUdBLFFBQUEsQ0FBUywwQ0FBVCxFQUFxRCxTQUFBLEdBQUE7aUJBQ25ELEVBQUEsQ0FBRyxnQ0FBSCxFQUFxQyxTQUFBLEdBQUE7QUFDbkMsWUFBQSxNQUFBLENBQU8sSUFBSSxDQUFDLGFBQUwsQ0FBQSxDQUFQLENBQTRCLENBQUMsSUFBN0IsQ0FBa0MsS0FBbEMsQ0FBQSxDQUFBO0FBQUEsWUFDQSxNQUFNLENBQUMsYUFBUCxDQUFxQixlQUFBLENBQWdCLEdBQWhCLENBQXJCLENBREEsQ0FBQTttQkFFQSxNQUFBLENBQU8sSUFBSSxDQUFDLGFBQUwsQ0FBQSxDQUFQLENBQTRCLENBQUMsSUFBN0IsQ0FBa0MsS0FBbEMsRUFIbUM7VUFBQSxDQUFyQyxFQURtRDtRQUFBLENBQXJELENBSEEsQ0FBQTtlQVNBLFFBQUEsQ0FBUyw0Q0FBVCxFQUF1RCxTQUFBLEdBQUE7aUJBQ3JELEVBQUEsQ0FBRyxnQ0FBSCxFQUFxQyxTQUFBLEdBQUE7QUFDbkMsWUFBQSxNQUFBLENBQU8sSUFBSSxDQUFDLGFBQUwsQ0FBQSxDQUFQLENBQTRCLENBQUMsSUFBN0IsQ0FBa0MsS0FBbEMsQ0FBQSxDQUFBO0FBQUEsWUFDQSxNQUFNLENBQUMsYUFBUCxDQUFxQixlQUFBLENBQWdCLENBQUEsR0FBaEIsQ0FBckIsQ0FEQSxDQUFBO21CQUVBLE1BQUEsQ0FBTyxJQUFJLENBQUMsYUFBTCxDQUFBLENBQVAsQ0FBNEIsQ0FBQyxJQUE3QixDQUFrQyxLQUFsQyxFQUhtQztVQUFBLENBQXJDLEVBRHFEO1FBQUEsQ0FBdkQsRUFWeUQ7TUFBQSxDQUEzRCxFQXZDc0Q7SUFBQSxDQUF4RCxDQXZyQkEsQ0FBQTtBQUFBLElBOHVCQSxRQUFBLENBQVMsbURBQVQsRUFBOEQsU0FBQSxHQUFBO0FBQzVELE1BQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtlQUNULElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix1QkFBaEIsRUFBeUMsSUFBekMsRUFEUztNQUFBLENBQVgsQ0FBQSxDQUFBO0FBQUEsTUFHQSxRQUFBLENBQVMsc0JBQVQsRUFBaUMsU0FBQSxHQUFBO2VBQy9CLEVBQUEsQ0FBRyxtQkFBSCxFQUF3QixTQUFBLEdBQUE7QUFDdEIsVUFBQSxNQUFBLENBQU8sSUFBSSxDQUFDLFFBQUwsQ0FBQSxDQUFlLENBQUMsTUFBdkIsQ0FBOEIsQ0FBQyxJQUEvQixDQUFvQyxDQUFwQyxDQUFBLENBQUE7aUJBQ0EsTUFBQSxDQUFPLE1BQVAsQ0FBYyxDQUFDLEdBQUcsQ0FBQyxXQUFuQixDQUErQixRQUEvQixFQUZzQjtRQUFBLENBQXhCLEVBRCtCO01BQUEsQ0FBakMsQ0FIQSxDQUFBO2FBUUEsUUFBQSxDQUFTLG9CQUFULEVBQStCLFNBQUEsR0FBQTtlQUM3QixFQUFBLENBQUcsbUJBQUgsRUFBd0IsU0FBQSxHQUFBO0FBQ3RCLFVBQUEsTUFBQSxDQUFPLElBQUksQ0FBQyxRQUFMLENBQUEsQ0FBZSxDQUFDLE1BQXZCLENBQThCLENBQUMsSUFBL0IsQ0FBb0MsQ0FBcEMsQ0FBQSxDQUFBO0FBQUEsVUFDQSxJQUFJLENBQUMsV0FBTCxDQUFpQixLQUFqQixDQURBLENBQUE7QUFBQSxVQUVBLElBQUksQ0FBQyxXQUFMLENBQWlCLEtBQWpCLENBRkEsQ0FBQTtBQUFBLFVBR0EsTUFBQSxDQUFPLElBQUksQ0FBQyxRQUFMLENBQUEsQ0FBZSxDQUFDLE1BQXZCLENBQThCLENBQUMsSUFBL0IsQ0FBb0MsQ0FBcEMsQ0FIQSxDQUFBO2lCQUlBLE1BQUEsQ0FBTyxNQUFQLENBQWMsQ0FBQyxHQUFHLENBQUMsV0FBbkIsQ0FBK0IsUUFBL0IsRUFMc0I7UUFBQSxDQUF4QixFQUQ2QjtNQUFBLENBQS9CLEVBVDREO0lBQUEsQ0FBOUQsQ0E5dUJBLENBQUE7QUFBQSxJQSt2QkEsUUFBQSxDQUFTLG9EQUFULEVBQStELFNBQUEsR0FBQTtBQUM3RCxNQUFBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7ZUFDVCxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsdUJBQWhCLEVBQXlDLEtBQXpDLEVBRFM7TUFBQSxDQUFYLENBQUEsQ0FBQTtBQUFBLE1BR0EsUUFBQSxDQUFTLHNCQUFULEVBQWlDLFNBQUEsR0FBQTtlQUMvQixFQUFBLENBQUcsbUJBQUgsRUFBd0IsU0FBQSxHQUFBO0FBQ3RCLFVBQUEsTUFBQSxDQUFPLElBQUksQ0FBQyxRQUFMLENBQUEsQ0FBZSxDQUFDLE1BQXZCLENBQThCLENBQUMsSUFBL0IsQ0FBb0MsQ0FBcEMsQ0FBQSxDQUFBO2lCQUNBLE1BQUEsQ0FBTyxNQUFQLENBQWMsQ0FBQyxHQUFHLENBQUMsV0FBbkIsQ0FBK0IsUUFBL0IsRUFGc0I7UUFBQSxDQUF4QixFQUQrQjtNQUFBLENBQWpDLENBSEEsQ0FBQTthQVFBLFFBQUEsQ0FBUyxvQkFBVCxFQUErQixTQUFBLEdBQUE7ZUFDN0IsRUFBQSxDQUFHLG1CQUFILEVBQXdCLFNBQUEsR0FBQTtBQUN0QixVQUFBLE1BQUEsQ0FBTyxJQUFJLENBQUMsUUFBTCxDQUFBLENBQWUsQ0FBQyxNQUF2QixDQUE4QixDQUFDLElBQS9CLENBQW9DLENBQXBDLENBQUEsQ0FBQTtBQUFBLFVBQ0EsSUFBSSxDQUFDLFdBQUwsQ0FBaUIsS0FBakIsQ0FEQSxDQUFBO0FBQUEsVUFFQSxJQUFJLENBQUMsV0FBTCxDQUFpQixLQUFqQixDQUZBLENBQUE7QUFBQSxVQUdBLE1BQUEsQ0FBTyxJQUFJLENBQUMsUUFBTCxDQUFBLENBQWUsQ0FBQyxNQUF2QixDQUE4QixDQUFDLElBQS9CLENBQW9DLENBQXBDLENBSEEsQ0FBQTtpQkFJQSxNQUFBLENBQU8sTUFBUCxDQUFjLENBQUMsV0FBZixDQUEyQixRQUEzQixFQUxzQjtRQUFBLENBQXhCLEVBRDZCO01BQUEsQ0FBL0IsRUFUNkQ7SUFBQSxDQUEvRCxDQS92QkEsQ0FBQTtBQWd4QkEsSUFBQSxJQUFHLGtEQUFIO0FBQ0UsTUFBQSxRQUFBLENBQVMsaUNBQVQsRUFBNEMsU0FBQSxHQUFBO0FBQzFDLFFBQUEsVUFBQSxDQUFXLFNBQUEsR0FBQTtpQkFDVCxJQUFJLENBQUMsWUFBTCxDQUFBLEVBRFM7UUFBQSxDQUFYLENBQUEsQ0FBQTtBQUFBLFFBR0EsUUFBQSxDQUFTLHdCQUFULEVBQW1DLFNBQUEsR0FBQTtpQkFDakMsRUFBQSxDQUFHLDRCQUFILEVBQWlDLFNBQUEsR0FBQTtBQUMvQixZQUFBLE9BQUEsR0FBVSxJQUFWLENBQUE7QUFBQSxZQUNBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO3FCQUNkLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixZQUFwQixFQUFrQztBQUFBLGdCQUFBLE9BQUEsRUFBUyxJQUFUO2VBQWxDLENBQWdELENBQUMsSUFBakQsQ0FBc0QsU0FBQyxDQUFELEdBQUE7dUJBQU8sT0FBQSxHQUFVLEVBQWpCO2NBQUEsQ0FBdEQsRUFEYztZQUFBLENBQWhCLENBREEsQ0FBQTttQkFJQSxJQUFBLENBQUssU0FBQSxHQUFBO0FBQ0gsY0FBQSxJQUFJLENBQUMsWUFBTCxDQUFrQixPQUFsQixDQUFBLENBQUE7QUFBQSxjQUNBLE1BQUEsQ0FBTyxDQUFBLENBQUUsTUFBRixDQUFTLENBQUMsSUFBVixDQUFlLFlBQWYsQ0FBNEIsQ0FBQyxNQUFwQyxDQUEyQyxDQUFDLElBQTVDLENBQWlELENBQWpELENBREEsQ0FBQTtxQkFFQSxNQUFBLENBQU8sQ0FBQSxDQUFFLE1BQUYsQ0FBUyxDQUFDLElBQVYsQ0FBZSxtQkFBZixDQUFQLENBQTJDLENBQUMsV0FBNUMsQ0FBd0QsTUFBeEQsRUFIRztZQUFBLENBQUwsRUFMK0I7VUFBQSxDQUFqQyxFQURpQztRQUFBLENBQW5DLENBSEEsQ0FBQTtBQUFBLFFBY0EsUUFBQSxDQUFTLHFEQUFULEVBQWdFLFNBQUEsR0FBQTtpQkFDOUQsRUFBQSxDQUFHLDRDQUFILEVBQWlELFNBQUEsR0FBQTtBQUMvQyxZQUFBLE9BQUEsR0FBVSxJQUFWLENBQUE7QUFBQSxZQUNBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO3FCQUNkLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixZQUFwQixFQUFrQztBQUFBLGdCQUFBLE9BQUEsRUFBUyxJQUFUO2VBQWxDLENBQWdELENBQUMsSUFBakQsQ0FBc0QsU0FBQyxDQUFELEdBQUE7dUJBQU8sT0FBQSxHQUFVLEVBQWpCO2NBQUEsQ0FBdEQsRUFEYztZQUFBLENBQWhCLENBREEsQ0FBQTttQkFJQSxJQUFBLENBQUssU0FBQSxHQUFBO0FBQ0gsY0FBQSxJQUFJLENBQUMsWUFBTCxDQUFrQixPQUFsQixDQUFBLENBQUE7QUFBQSxjQUNBLE1BQUEsQ0FBTyxPQUFPLENBQUMsU0FBUixDQUFBLENBQVAsQ0FBMkIsQ0FBQyxJQUE1QixDQUFpQyxJQUFqQyxDQURBLENBQUE7QUFBQSxjQUVBLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQUEsQ0FBbkIsQ0FBdkIsRUFBMkUsdUJBQTNFLENBRkEsQ0FBQTtxQkFHQSxNQUFBLENBQU8sT0FBTyxDQUFDLFNBQVIsQ0FBQSxDQUFQLENBQTJCLENBQUMsSUFBNUIsQ0FBaUMsS0FBakMsRUFKRztZQUFBLENBQUwsRUFMK0M7VUFBQSxDQUFqRCxFQUQ4RDtRQUFBLENBQWhFLENBZEEsQ0FBQTtBQUFBLFFBMEJBLFFBQUEsQ0FBUyxrQ0FBVCxFQUE2QyxTQUFBLEdBQUE7QUFDM0MsVUFBQSxFQUFBLENBQUcsMkNBQUgsRUFBZ0QsU0FBQSxHQUFBO0FBQzlDLGdCQUFBLE9BQUE7QUFBQSxZQUFBLE9BQUEsR0FBVSxJQUFWLENBQUE7QUFBQSxZQUNBLE9BQUEsR0FBVSxJQURWLENBQUE7QUFBQSxZQUdBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO3FCQUNkLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixZQUFwQixFQUFrQztBQUFBLGdCQUFBLE9BQUEsRUFBUyxJQUFUO2VBQWxDLENBQWdELENBQUMsSUFBakQsQ0FBc0QsU0FBQyxDQUFELEdBQUE7QUFDcEQsZ0JBQUEsT0FBQSxHQUFVLENBQVYsQ0FBQTt1QkFDQSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsYUFBcEIsRUFBbUM7QUFBQSxrQkFBQSxPQUFBLEVBQVMsSUFBVDtpQkFBbkMsQ0FBaUQsQ0FBQyxJQUFsRCxDQUF1RCxTQUFDLENBQUQsR0FBQTt5QkFDckQsT0FBQSxHQUFVLEVBRDJDO2dCQUFBLENBQXZELEVBRm9EO2NBQUEsQ0FBdEQsRUFEYztZQUFBLENBQWhCLENBSEEsQ0FBQTttQkFTQSxJQUFBLENBQUssU0FBQSxHQUFBO0FBQ0gsY0FBQSxNQUFBLENBQU8sT0FBTyxDQUFDLFdBQVIsQ0FBQSxDQUFQLENBQTZCLENBQUMsSUFBOUIsQ0FBbUMsSUFBbkMsQ0FBQSxDQUFBO0FBQUEsY0FDQSxNQUFBLENBQU8sTUFBTSxDQUFDLFVBQVAsQ0FBa0IsT0FBbEIsQ0FBUCxDQUFrQyxDQUFDLEdBQUcsQ0FBQyxPQUF2QyxDQUFBLENBREEsQ0FBQTtxQkFFQSxNQUFBLENBQU8sQ0FBQSxDQUFFLE1BQU0sQ0FBQyxVQUFQLENBQWtCLE9BQWxCLENBQUYsQ0FBNkIsQ0FBQyxJQUE5QixDQUFtQyxRQUFuQyxDQUFQLENBQW9ELENBQUMsV0FBckQsQ0FBaUUsTUFBakUsRUFIRztZQUFBLENBQUwsRUFWOEM7VUFBQSxDQUFoRCxDQUFBLENBQUE7aUJBZUEsRUFBQSxDQUFHLHNEQUFILEVBQTJELFNBQUEsR0FBQTtBQUN6RCxnQkFBQSxPQUFBO0FBQUEsWUFBQSxPQUFBLEdBQVUsSUFBVixDQUFBO0FBQUEsWUFFQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtxQkFDZCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsWUFBcEIsRUFBa0M7QUFBQSxnQkFBQSxPQUFBLEVBQVMsSUFBVDtlQUFsQyxDQUFnRCxDQUFDLElBQWpELENBQXNELFNBQUMsQ0FBRCxHQUFBO3VCQUFPLE9BQUEsR0FBVSxFQUFqQjtjQUFBLENBQXRELEVBRGM7WUFBQSxDQUFoQixDQUZBLENBQUE7bUJBS0EsSUFBQSxDQUFLLFNBQUEsR0FBQTtBQUNILGNBQUEsSUFBSSxDQUFDLFlBQUwsQ0FBa0IsT0FBbEIsQ0FBQSxDQUFBO0FBQUEsY0FDQSxNQUFBLENBQU8sQ0FBQSxDQUFFLE1BQU0sQ0FBQyxVQUFQLENBQWtCLE9BQWxCLENBQUYsQ0FBNkIsQ0FBQyxJQUE5QixDQUFtQyxRQUFuQyxDQUFQLENBQW9ELENBQUMsV0FBckQsQ0FBaUUsTUFBakUsQ0FEQSxDQUFBO0FBQUEsY0FFQSxpQkFBQSxDQUFrQixVQUFsQixFQUE4QixNQUFNLENBQUMsVUFBUCxDQUFrQixPQUFsQixDQUE5QixFQUEwRDtBQUFBLGdCQUFBLEtBQUEsRUFBTyxDQUFQO2VBQTFELENBRkEsQ0FBQTtxQkFHQSxNQUFBLENBQU8sQ0FBQSxDQUFFLE1BQU0sQ0FBQyxVQUFQLENBQWtCLE9BQWxCLENBQUYsQ0FBNkIsQ0FBQyxJQUE5QixDQUFtQyxRQUFuQyxDQUFQLENBQW9ELENBQUMsR0FBRyxDQUFDLFdBQXpELENBQXFFLE1BQXJFLEVBSkc7WUFBQSxDQUFMLEVBTnlEO1VBQUEsQ0FBM0QsRUFoQjJDO1FBQUEsQ0FBN0MsQ0ExQkEsQ0FBQTtBQUFBLFFBc0RBLFFBQUEsQ0FBUyxzQ0FBVCxFQUFpRCxTQUFBLEdBQUE7aUJBQy9DLEVBQUEsQ0FBRyxrQ0FBSCxFQUF1QyxTQUFBLEdBQUE7QUFDckMsWUFBQSxPQUFBLEdBQVUsSUFBVixDQUFBO0FBQUEsWUFDQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtxQkFDZCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsWUFBcEIsRUFBa0M7QUFBQSxnQkFBQSxPQUFBLEVBQVMsSUFBVDtlQUFsQyxDQUFnRCxDQUFDLElBQWpELENBQXNELFNBQUMsQ0FBRCxHQUFBO0FBQ3BELGdCQUFBLE9BQUEsR0FBVSxDQUFWLENBQUE7QUFBQSxnQkFDQSxJQUFJLENBQUMsWUFBTCxDQUFrQixPQUFsQixDQURBLENBQUE7QUFBQSxnQkFFQSxPQUFPLENBQUMsVUFBUixDQUFtQixHQUFuQixDQUZBLENBQUE7dUJBR0EsWUFBQSxDQUFhLE9BQU8sQ0FBQyxNQUFNLENBQUMsb0JBQTVCLEVBSm9EO2NBQUEsQ0FBdEQsRUFEYztZQUFBLENBQWhCLENBREEsQ0FBQTttQkFRQSxJQUFBLENBQUssU0FBQSxHQUFBO3FCQUNILE1BQUEsQ0FBTyxDQUFBLENBQUUsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsT0FBbEIsQ0FBRixDQUE2QixDQUFDLElBQTlCLENBQW1DLFFBQW5DLENBQVAsQ0FBb0QsQ0FBQyxHQUFHLENBQUMsV0FBekQsQ0FBcUUsTUFBckUsRUFERztZQUFBLENBQUwsRUFUcUM7VUFBQSxDQUF2QyxFQUQrQztRQUFBLENBQWpELENBdERBLENBQUE7QUFBQSxRQW1FQSxRQUFBLENBQVMsb0JBQVQsRUFBK0IsU0FBQSxHQUFBO2lCQUM3QixFQUFBLENBQUcseUJBQUgsRUFBOEIsU0FBQSxHQUFBO0FBQzVCLFlBQUEsT0FBQSxHQUFVLElBQVYsQ0FBQTtBQUFBLFlBQ0EsZUFBQSxDQUFnQixTQUFBLEdBQUE7cUJBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLFNBQUwsQ0FBZSxPQUFmLENBQVYsRUFBbUMsWUFBbkMsQ0FBcEIsRUFBc0U7QUFBQSxnQkFBQSxPQUFBLEVBQVMsSUFBVDtlQUF0RSxDQUFvRixDQUFDLElBQXJGLENBQTBGLFNBQUMsQ0FBRCxHQUFBO0FBQ3hGLGdCQUFBLE9BQUEsR0FBVSxDQUFWLENBQUE7QUFBQSxnQkFDQSxJQUFJLENBQUMsWUFBTCxDQUFrQixPQUFsQixDQURBLENBQUE7dUJBRUEsT0FBTyxDQUFDLElBQVIsQ0FBQSxFQUh3RjtjQUFBLENBQTFGLEVBRGM7WUFBQSxDQUFoQixDQURBLENBQUE7bUJBT0EsSUFBQSxDQUFLLFNBQUEsR0FBQTtxQkFDSCxNQUFBLENBQU8sQ0FBQSxDQUFFLE1BQU0sQ0FBQyxVQUFQLENBQWtCLE9BQWxCLENBQUYsQ0FBNkIsQ0FBQyxJQUE5QixDQUFtQyxRQUFuQyxDQUFQLENBQW9ELENBQUMsR0FBRyxDQUFDLFdBQXpELENBQXFFLE1BQXJFLEVBREc7WUFBQSxDQUFMLEVBUjRCO1VBQUEsQ0FBOUIsRUFENkI7UUFBQSxDQUEvQixDQW5FQSxDQUFBO0FBQUEsUUErRUEsUUFBQSxDQUFTLHNEQUFULEVBQWlFLFNBQUEsR0FBQTtpQkFDL0QsRUFBQSxDQUFHLDRCQUFILEVBQWlDLFNBQUEsR0FBQTtBQUMvQixnQkFBQSxPQUFBO0FBQUEsWUFBQSxPQUFBLEdBQVUsSUFBVixDQUFBO0FBQUEsWUFDQSxPQUFBLEdBQVUsSUFEVixDQUFBO0FBQUEsWUFHQSxlQUFBLENBQWdCLFNBQUEsR0FBQTtxQkFDZCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsWUFBcEIsQ0FBaUMsQ0FBQyxJQUFsQyxDQUF1QyxTQUFDLENBQUQsR0FBQTt1QkFDckMsT0FBQSxHQUFVLEVBRDJCO2NBQUEsQ0FBdkMsRUFEYztZQUFBLENBQWhCLENBSEEsQ0FBQTtBQUFBLFlBT0EsZUFBQSxDQUFnQixTQUFBLEdBQUE7cUJBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLGFBQXBCLEVBQW1DO0FBQUEsZ0JBQUEsT0FBQSxFQUFTLElBQVQ7ZUFBbkMsQ0FBaUQsQ0FBQyxJQUFsRCxDQUF1RCxTQUFDLENBQUQsR0FBQTt1QkFDckQsT0FBQSxHQUFVLEVBRDJDO2NBQUEsQ0FBdkQsRUFEYztZQUFBLENBQWhCLENBUEEsQ0FBQTttQkFXQSxJQUFBLENBQUssU0FBQSxHQUFBO0FBQ0gsY0FBQSxJQUFJLENBQUMsWUFBTCxDQUFrQixPQUFsQixDQUFBLENBQUE7QUFBQSxjQUNBLE1BQUEsQ0FBTyxJQUFJLENBQUMsUUFBTCxDQUFBLENBQWUsQ0FBQyxNQUF2QixDQUE4QixDQUFDLElBQS9CLENBQW9DLENBQXBDLENBREEsQ0FBQTtBQUFBLGNBRUEsTUFBQSxDQUFPLElBQUksQ0FBQyxRQUFMLENBQUEsQ0FBUCxDQUF1QixDQUFDLE9BQXhCLENBQWdDLENBQUMsT0FBRCxFQUFVLE9BQVYsQ0FBaEMsQ0FGQSxDQUFBO3FCQUdBLE1BQUEsQ0FBTyxDQUFBLENBQUUsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsT0FBbEIsQ0FBRixDQUE2QixDQUFDLElBQTlCLENBQW1DLFFBQW5DLENBQVAsQ0FBb0QsQ0FBQyxXQUFyRCxDQUFpRSxNQUFqRSxFQUpHO1lBQUEsQ0FBTCxFQVorQjtVQUFBLENBQWpDLEVBRCtEO1FBQUEsQ0FBakUsQ0EvRUEsQ0FBQTtBQUFBLFFBa0dBLFFBQUEsQ0FBUyw4QkFBVCxFQUF5QyxTQUFBLEdBQUE7QUFDdkMsVUFBQSxPQUFBLEdBQVUsSUFBVixDQUFBO0FBQUEsVUFDQSxVQUFBLENBQVcsU0FBQSxHQUFBO21CQUNULGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO3FCQUNkLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixZQUFwQixFQUFrQztBQUFBLGdCQUFBLE9BQUEsRUFBUyxJQUFUO2VBQWxDLENBQWdELENBQUMsSUFBakQsQ0FBc0QsU0FBQyxDQUFELEdBQUE7dUJBQU8sT0FBQSxHQUFVLEVBQWpCO2NBQUEsQ0FBdEQsRUFEYztZQUFBLENBQWhCLEVBRFM7VUFBQSxDQUFYLENBREEsQ0FBQTtBQUFBLFVBS0EsRUFBQSxDQUFHLHlDQUFILEVBQThDLFNBQUEsR0FBQTtBQUM1QyxnQkFBQSx5QkFBQTtBQUFBLFlBQUEsSUFBSSxDQUFDLFlBQUwsQ0FBa0IsT0FBbEIsQ0FBQSxDQUFBO0FBQUEsWUFDQSxLQUFBLEdBQVEsSUFBSSxDQUFDLFVBQUwsQ0FBZ0I7QUFBQSxjQUFBLGNBQUEsRUFBZ0IsSUFBaEI7YUFBaEIsQ0FEUixDQUFBO0FBQUEsWUFFQSxPQUFBLEdBQVUsR0FBQSxDQUFBLFVBRlYsQ0FBQTtBQUFBLFlBR0EsT0FBTyxDQUFDLFVBQVIsQ0FBbUIsS0FBbkIsQ0FIQSxDQUFBO0FBQUEsWUFJQSxTQUFBLEdBQVksS0FBSyxDQUFDLGFBQU4sQ0FBQSxDQUpaLENBQUE7QUFBQSxZQUtBLE1BQUEsQ0FBTyxTQUFTLENBQUMsU0FBVixDQUFBLENBQVAsQ0FBNkIsQ0FBQyxJQUE5QixDQUFtQyxLQUFuQyxDQUxBLENBQUE7bUJBTUEsTUFBQSxDQUFPLENBQUEsQ0FBRSxPQUFPLENBQUMsVUFBUixDQUFtQixTQUFuQixDQUFGLENBQWdDLENBQUMsSUFBakMsQ0FBc0MsUUFBdEMsQ0FBUCxDQUF1RCxDQUFDLEdBQUcsQ0FBQyxXQUE1RCxDQUF3RSxNQUF4RSxFQVA0QztVQUFBLENBQTlDLENBTEEsQ0FBQTtpQkFjQSxFQUFBLENBQUcsdUNBQUgsRUFBNEMsU0FBQSxHQUFBO0FBQzFDLFlBQUEsTUFBQSxDQUFPLE9BQU8sQ0FBQyxTQUFSLENBQUEsQ0FBUCxDQUEyQixDQUFDLElBQTVCLENBQWlDLElBQWpDLENBQUEsQ0FBQTttQkFDQSxNQUFBLENBQU8sQ0FBQSxDQUFFLE1BQU0sQ0FBQyxVQUFQLENBQWtCLE9BQWxCLENBQUYsQ0FBNkIsQ0FBQyxJQUE5QixDQUFtQyxRQUFuQyxDQUFQLENBQW9ELENBQUMsV0FBckQsQ0FBaUUsTUFBakUsRUFGMEM7VUFBQSxDQUE1QyxFQWZ1QztRQUFBLENBQXpDLENBbEdBLENBQUE7ZUFxSEEsUUFBQSxDQUFTLGlEQUFULEVBQTRELFNBQUEsR0FBQTtpQkFDMUQsRUFBQSxDQUFHLDJDQUFILEVBQWdELFNBQUEsR0FBQTtBQUM5QyxZQUFBLE9BQUEsR0FBVSxJQUFWLENBQUE7QUFBQSxZQUNBLGVBQUEsQ0FBZ0IsU0FBQSxHQUFBO3FCQUNkLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixZQUFwQixFQUFrQztBQUFBLGdCQUFBLE9BQUEsRUFBUyxJQUFUO2VBQWxDLENBQWdELENBQUMsSUFBakQsQ0FBc0QsU0FBQyxDQUFELEdBQUE7dUJBQU8sT0FBQSxHQUFVLEVBQWpCO2NBQUEsQ0FBdEQsRUFEYztZQUFBLENBQWhCLENBREEsQ0FBQTttQkFJQSxJQUFBLENBQUssU0FBQSxHQUFBO0FBQ0gsa0JBQUEsY0FBQTtBQUFBLGNBQUEsSUFBSSxDQUFDLFlBQUwsQ0FBa0IsT0FBbEIsQ0FBQSxDQUFBO0FBQUEsY0FDQSxLQUFBLEdBQVEsSUFBSSxDQUFDLFVBQUwsQ0FBQSxDQURSLENBQUE7QUFBQSxjQUdBLE9BQUEsR0FBVSxHQUFBLENBQUEsVUFIVixDQUFBO0FBQUEsY0FJQSxPQUFPLENBQUMsVUFBUixDQUFtQixLQUFuQixDQUpBLENBQUE7QUFBQSxjQUtBLE9BQU8sQ0FBQyxvQkFBUixDQUE2QixJQUE3QixFQUFtQyxDQUFuQyxFQUFzQyxLQUF0QyxFQUE2QyxDQUE3QyxFQUFnRCxPQUFoRCxDQUxBLENBQUE7cUJBT0EsTUFBQSxDQUFPLENBQUEsQ0FBRSxPQUFPLENBQUMsVUFBUixDQUFtQixLQUFLLENBQUMsYUFBTixDQUFBLENBQW5CLENBQUYsQ0FBNEMsQ0FBQyxJQUE3QyxDQUFrRCxRQUFsRCxDQUFQLENBQW1FLENBQUMsR0FBRyxDQUFDLFdBQXhFLENBQW9GLE1BQXBGLEVBUkc7WUFBQSxDQUFMLEVBTDhDO1VBQUEsQ0FBaEQsRUFEMEQ7UUFBQSxDQUE1RCxFQXRIMEM7TUFBQSxDQUE1QyxDQUFBLENBREY7S0FoeEJBO1dBdTVCQSxRQUFBLENBQVMsMENBQVQsRUFBcUQsU0FBQSxHQUFBO0FBQ25ELFVBQUEsNEJBQUE7QUFBQSxNQUFBLFFBQTBCLEVBQTFCLEVBQUMscUJBQUQsRUFBYSxjQUFiLEVBQWtCLGVBQWxCLENBQUE7QUFBQSxNQUVBLFVBQUEsQ0FBVyxTQUFBLEdBQUE7QUFDVCxRQUFBLEdBQUEsR0FBTSxNQUFNLENBQUMsVUFBUCxDQUFrQixPQUFsQixDQUFOLENBQUE7QUFBQSxRQUNBLEtBQUEsQ0FBTSxHQUFOLEVBQVcsZ0JBQVgsQ0FBNEIsQ0FBQyxjQUE3QixDQUFBLENBREEsQ0FBQTtBQUFBLFFBRUEsS0FBQSxDQUFNLEdBQU4sRUFBVyxpQkFBWCxDQUE2QixDQUFDLGNBQTlCLENBQUEsQ0FGQSxDQUFBO0FBQUEsUUFJQSxJQUFBLEdBQU8sTUFBTSxDQUFDLFVBQVAsQ0FBa0IsS0FBbEIsQ0FKUCxDQUFBO0FBQUEsUUFLQSxJQUFJLENBQUMsSUFBTCxHQUFZLG1DQUxaLENBQUE7QUFBQSxRQU1BLEtBQUEsQ0FBTSxJQUFOLEVBQVksaUJBQVosQ0FBOEIsQ0FBQyxjQUEvQixDQUFBLENBTkEsQ0FBQTtBQUFBLFFBU0EsVUFBQSxHQUFhLE9BQU8sQ0FBQyxZQUFSLENBQXFCLE1BQXJCLEVBQTZCLENBQUMsZUFBRCxFQUFrQixxQkFBbEIsRUFBeUMsYUFBekMsRUFBd0Qsa0JBQXhELENBQTdCLENBVGIsQ0FBQTtBQUFBLFFBVUEsVUFBVSxDQUFDLFdBQVcsQ0FBQyxXQUF2QixDQUFtQyxTQUFDLE1BQUQsR0FBQTtpQkFBWSxNQUFBLEtBQVUsTUFBdEI7UUFBQSxDQUFuQyxDQVZBLENBQUE7QUFBQSxRQVdBLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxXQUE1QixDQUF3QyxTQUFDLE1BQUQsR0FBQTtpQkFBWSxNQUFBLEtBQVUsV0FBdEI7UUFBQSxDQUF4QyxDQVhBLENBQUE7QUFBQSxRQWFBLFVBQVUsQ0FBQyxpQkFBWCxHQUErQixTQUFDLFFBQUQsR0FBQTs7WUFDN0IsSUFBQyxDQUFBLHdCQUF5QjtXQUExQjtBQUFBLFVBQ0EsSUFBQyxDQUFBLHFCQUFxQixDQUFDLElBQXZCLENBQTRCLFFBQTVCLENBREEsQ0FBQTtpQkFFQTtBQUFBLFlBQUEsT0FBQSxFQUFTLENBQUEsU0FBQSxLQUFBLEdBQUE7cUJBQUEsU0FBQSxHQUFBO3VCQUFHLENBQUMsQ0FBQyxNQUFGLENBQVMsS0FBQyxDQUFBLHFCQUFWLEVBQWlDLFFBQWpDLEVBQUg7Y0FBQSxFQUFBO1lBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFUO1lBSDZCO1FBQUEsQ0FiL0IsQ0FBQTtBQUFBLFFBaUJBLFVBQVUsQ0FBQyxtQkFBWCxHQUFpQyxTQUFDLEtBQUQsR0FBQTtBQUMvQixjQUFBLDBDQUFBO0FBQUE7QUFBQTtlQUFBLDRDQUFBO2lDQUFBO0FBQUEsMEJBQUEsUUFBQSxDQUFTLEtBQVQsRUFBQSxDQUFBO0FBQUE7MEJBRCtCO1FBQUEsQ0FqQmpDLENBQUE7QUFBQSxRQW9CQSxVQUFVLENBQUMsbUJBQVgsR0FBaUMsU0FBQyxRQUFELEdBQUE7O1lBQy9CLElBQUMsQ0FBQSwwQkFBMkI7V0FBNUI7QUFBQSxVQUNBLElBQUMsQ0FBQSx1QkFBdUIsQ0FBQyxJQUF6QixDQUE4QixRQUE5QixDQURBLENBQUE7aUJBRUE7QUFBQSxZQUFBLE9BQUEsRUFBUyxDQUFBLFNBQUEsS0FBQSxHQUFBO3FCQUFBLFNBQUEsR0FBQTt1QkFBRyxDQUFDLENBQUMsTUFBRixDQUFTLEtBQUMsQ0FBQSx1QkFBVixFQUFtQyxRQUFuQyxFQUFIO2NBQUEsRUFBQTtZQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBVDtZQUgrQjtRQUFBLENBcEJqQyxDQUFBO0FBQUEsUUF3QkEsVUFBVSxDQUFDLHFCQUFYLEdBQW1DLFNBQUMsS0FBRCxHQUFBO0FBQ2pDLGNBQUEsMENBQUE7QUFBQTtBQUFBO2VBQUEsNENBQUE7aUNBQUE7QUFBQSwwQkFBQSxRQUFBLENBQVMsS0FBVCxFQUFBLENBQUE7QUFBQTswQkFEaUM7UUFBQSxDQXhCbkMsQ0FBQTtBQUFBLFFBNEJBLEtBQUEsQ0FBTSxJQUFJLENBQUMsT0FBWCxFQUFvQix3QkFBcEIsQ0FBNkMsQ0FBQyxTQUE5QyxDQUF3RCxPQUFPLENBQUMsT0FBUixDQUFnQixVQUFoQixDQUF4RCxDQTVCQSxDQUFBO0FBQUEsUUE4QkEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHdCQUFoQixFQUEwQyxJQUExQyxDQTlCQSxDQUFBO2VBZ0NBLFFBQUEsQ0FBUyxTQUFBLEdBQUE7QUFDUCxjQUFBLEtBQUE7NEVBQWdDLENBQUUsZ0JBQWxDLEdBQTJDLEVBRHBDO1FBQUEsQ0FBVCxFQWpDUztNQUFBLENBQVgsQ0FGQSxDQUFBO0FBQUEsTUFzQ0EsUUFBQSxDQUFTLHNDQUFULEVBQWlELFNBQUEsR0FBQTtBQUMvQyxRQUFBLEVBQUEsQ0FBRyxpQ0FBSCxFQUFzQyxTQUFBLEdBQUE7QUFDcEMsVUFBQSxVQUFVLENBQUMsbUJBQW1CLENBQUMsU0FBL0IsQ0FBeUMsS0FBekMsQ0FBQSxDQUFBO0FBQUEsVUFDQSxHQUFHLENBQUMsZUFBSixDQUFvQixVQUFwQixDQURBLENBQUE7aUJBRUEsTUFBQSxDQUFPLENBQUEsQ0FBRSxNQUFGLENBQVMsQ0FBQyxJQUFWLENBQWUsbUJBQWYsQ0FBUCxDQUEyQyxDQUFDLFdBQTVDLENBQXdELGNBQXhELEVBSG9DO1FBQUEsQ0FBdEMsQ0FBQSxDQUFBO0FBQUEsUUFLQSxFQUFBLENBQUcsc0NBQUgsRUFBMkMsU0FBQSxHQUFBO0FBQ3pDLFVBQUEsVUFBVSxDQUFDLG1CQUFtQixDQUFDLFNBQS9CLENBQXlDLFVBQXpDLENBQUEsQ0FBQTtBQUFBLFVBQ0EsR0FBRyxDQUFDLGVBQUosQ0FBb0IsVUFBcEIsQ0FEQSxDQUFBO2lCQUVBLE1BQUEsQ0FBTyxDQUFBLENBQUUsTUFBRixDQUFTLENBQUMsSUFBVixDQUFlLG1CQUFmLENBQVAsQ0FBMkMsQ0FBQyxXQUE1QyxDQUF3RCxpQkFBeEQsRUFIeUM7UUFBQSxDQUEzQyxDQUxBLENBQUE7QUFBQSxRQVVBLEVBQUEsQ0FBRyxxQ0FBSCxFQUEwQyxTQUFBLEdBQUE7QUFDeEMsVUFBQSxVQUFVLENBQUMsYUFBYSxDQUFDLFNBQXpCLENBQW1DLElBQW5DLENBQUEsQ0FBQTtBQUFBLFVBQ0EsR0FBRyxDQUFDLGVBQUosQ0FBb0IsVUFBcEIsQ0FEQSxDQUFBO2lCQUVBLE1BQUEsQ0FBTyxDQUFBLENBQUUsTUFBRixDQUFTLENBQUMsSUFBVixDQUFlLG1CQUFmLENBQVAsQ0FBMkMsQ0FBQyxXQUE1QyxDQUF3RCxnQkFBeEQsRUFId0M7UUFBQSxDQUExQyxDQVZBLENBQUE7ZUFlQSxFQUFBLENBQUcseURBQUgsRUFBOEQsU0FBQSxHQUFBO0FBQzVELFVBQUEsTUFBQSxDQUFPLENBQUEsQ0FBRSxNQUFGLENBQVMsQ0FBQyxJQUFWLENBQWUsbUJBQWYsQ0FBUCxDQUEyQyxDQUFDLEdBQUcsQ0FBQyxXQUFoRCxDQUE0RCxjQUE1RCxDQUFBLENBQUE7QUFBQSxVQUNBLE1BQUEsQ0FBTyxDQUFBLENBQUUsTUFBRixDQUFTLENBQUMsSUFBVixDQUFlLG1CQUFmLENBQVAsQ0FBMkMsQ0FBQyxHQUFHLENBQUMsV0FBaEQsQ0FBNEQsaUJBQTVELENBREEsQ0FBQTtpQkFFQSxNQUFBLENBQU8sQ0FBQSxDQUFFLE1BQUYsQ0FBUyxDQUFDLElBQVYsQ0FBZSxtQkFBZixDQUFQLENBQTJDLENBQUMsR0FBRyxDQUFDLFdBQWhELENBQTRELGdCQUE1RCxFQUg0RDtRQUFBLENBQTlELEVBaEIrQztNQUFBLENBQWpELENBdENBLENBQUE7QUFBQSxNQTJEQSxRQUFBLENBQVMsNENBQVQsRUFBdUQsU0FBQSxHQUFBO0FBQ3JELFFBQUEsRUFBQSxDQUFHLDRDQUFILEVBQWlELFNBQUEsR0FBQTtBQUMvQyxVQUFBLEdBQUcsQ0FBQyxlQUFlLENBQUMsS0FBcEIsQ0FBQSxDQUFBLENBQUE7QUFBQSxVQUNBLFVBQVUsQ0FBQyxxQkFBWCxDQUFBLENBREEsQ0FBQTtpQkFFQSxNQUFBLENBQU8sR0FBRyxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsTUFBakMsQ0FBd0MsQ0FBQyxPQUF6QyxDQUFpRCxDQUFqRCxFQUgrQztRQUFBLENBQWpELENBQUEsQ0FBQTtBQUFBLFFBS0EsRUFBQSxDQUFHLGlEQUFILEVBQXNELFNBQUEsR0FBQTtBQUNwRCxVQUFBLFVBQVUsQ0FBQyxtQkFBbUIsQ0FBQyxLQUEvQixDQUFBLENBQUEsQ0FBQTtBQUFBLFVBQ0EsTUFBQSxDQUFPLENBQUEsQ0FBRSxNQUFGLENBQVMsQ0FBQyxJQUFWLENBQWUsbUJBQWYsQ0FBUCxDQUEyQyxDQUFDLEdBQUcsQ0FBQyxXQUFoRCxDQUE0RCxpQkFBNUQsQ0FEQSxDQUFBO0FBQUEsVUFFQSxVQUFVLENBQUMsbUJBQVgsQ0FBK0I7QUFBQSxZQUFDLElBQUEsRUFBTSxHQUFHLENBQUMsSUFBWDtBQUFBLFlBQWlCLFVBQUEsRUFBWSxVQUE3QjtXQUEvQixDQUZBLENBQUE7QUFBQSxVQUdBLE1BQUEsQ0FBTyxDQUFBLENBQUUsTUFBRixDQUFTLENBQUMsSUFBVixDQUFlLG1CQUFmLENBQVAsQ0FBMkMsQ0FBQyxXQUE1QyxDQUF3RCxpQkFBeEQsQ0FIQSxDQUFBO2lCQUlBLE1BQUEsQ0FBTyxVQUFVLENBQUMsbUJBQW1CLENBQUMsS0FBSyxDQUFDLE1BQTVDLENBQW1ELENBQUMsSUFBcEQsQ0FBeUQsQ0FBekQsRUFMb0Q7UUFBQSxDQUF0RCxDQUxBLENBQUE7ZUFZQSxFQUFBLENBQUcsd0RBQUgsRUFBNkQsU0FBQSxHQUFBO0FBQzNELFVBQUEsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFyQixDQUFBLENBQUEsQ0FBQTtBQUFBLFVBQ0EsVUFBVSxDQUFDLHFCQUFYLENBQUEsQ0FEQSxDQUFBO2lCQUVBLE1BQUEsQ0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxNQUFsQyxDQUF5QyxDQUFDLE9BQTFDLENBQWtELENBQWxELEVBSDJEO1FBQUEsQ0FBN0QsRUFicUQ7TUFBQSxDQUF2RCxDQTNEQSxDQUFBO0FBQUEsTUE2RUEsUUFBQSxDQUFTLHVCQUFULEVBQWtDLFNBQUEsR0FBQTtBQUNoQyxRQUFBLEVBQUEsQ0FBRyxzRUFBSCxFQUEyRSxTQUFBLEdBQUE7QUFDekUsVUFBQSxHQUFHLENBQUMsY0FBYyxDQUFDLEtBQW5CLENBQUEsQ0FBQSxDQUFBO0FBQUEsVUFDQSxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBeEIsQ0FBNkIsVUFBN0IsRUFBeUM7QUFBQSxZQUFDLElBQUEsRUFBTSxHQUFHLENBQUMsSUFBWDtXQUF6QyxDQURBLENBQUE7aUJBRUEsTUFBQSxDQUFPLEdBQUcsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLE1BQWhDLENBQXVDLENBQUMsSUFBeEMsQ0FBNkMsQ0FBN0MsRUFIeUU7UUFBQSxDQUEzRSxDQUFBLENBQUE7ZUFLQSxFQUFBLENBQUcseURBQUgsRUFBOEQsU0FBQSxHQUFBO0FBQzVELFVBQUEsR0FBRyxDQUFDLGNBQWMsQ0FBQyxLQUFuQixDQUFBLENBQUEsQ0FBQTtBQUFBLFVBQ0EsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQXhCLENBQTZCLFVBQTdCLEVBQXlDO0FBQUEsWUFBQyxJQUFBLEVBQU0sa0JBQVA7V0FBekMsQ0FEQSxDQUFBO2lCQUVBLE1BQUEsQ0FBTyxHQUFHLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxNQUFoQyxDQUF1QyxDQUFDLElBQXhDLENBQTZDLENBQTdDLEVBSDREO1FBQUEsQ0FBOUQsRUFOZ0M7TUFBQSxDQUFsQyxDQTdFQSxDQUFBO2FBd0ZBLFFBQUEsQ0FBUyxvREFBVCxFQUErRCxTQUFBLEdBQUE7QUFDN0QsUUFBQSxFQUFBLENBQUcsa0VBQUgsRUFBdUUsU0FBQSxHQUFBO0FBQ3JFLFVBQUEsVUFBVSxDQUFDLG1CQUFYLENBQStCO0FBQUEsWUFBQyxJQUFBLEVBQU0sR0FBRyxDQUFDLElBQVg7QUFBQSxZQUFpQixVQUFBLEVBQVksS0FBN0I7V0FBL0IsQ0FBQSxDQUFBO0FBQUEsVUFFQSxNQUFBLENBQU8sQ0FBQSxDQUFFLE1BQUYsQ0FBUyxDQUFDLElBQVYsQ0FBZSxtQkFBZixDQUFQLENBQTJDLENBQUMsV0FBNUMsQ0FBd0QsY0FBeEQsQ0FGQSxDQUFBO0FBQUEsVUFHQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isd0JBQWhCLEVBQTBDLEtBQTFDLENBSEEsQ0FBQTtpQkFJQSxNQUFBLENBQU8sQ0FBQSxDQUFFLE1BQUYsQ0FBUyxDQUFDLElBQVYsQ0FBZSxtQkFBZixDQUFQLENBQTJDLENBQUMsR0FBRyxDQUFDLFdBQWhELENBQTRELGNBQTVELEVBTHFFO1FBQUEsQ0FBdkUsQ0FBQSxDQUFBO2VBT0EsRUFBQSxDQUFHLDREQUFILEVBQWlFLFNBQUEsR0FBQTtBQUMvRCxVQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix3QkFBaEIsRUFBMEMsS0FBMUMsQ0FBQSxDQUFBO0FBQUEsVUFDQSxVQUFVLENBQUMsbUJBQW1CLENBQUMsU0FBL0IsQ0FBeUMsVUFBekMsQ0FEQSxDQUFBO0FBQUEsVUFFQSxNQUFBLENBQU8sQ0FBQSxDQUFFLE1BQUYsQ0FBUyxDQUFDLElBQVYsQ0FBZSxtQkFBZixDQUFQLENBQTJDLENBQUMsR0FBRyxDQUFDLFdBQWhELENBQTRELGlCQUE1RCxDQUZBLENBQUE7QUFBQSxVQUdBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix3QkFBaEIsRUFBMEMsSUFBMUMsQ0FIQSxDQUFBO0FBQUEsVUFLQSxRQUFBLENBQVMsU0FBQSxHQUFBO0FBQ1AsZ0JBQUEsS0FBQTs4RUFBZ0MsQ0FBRSxnQkFBbEMsR0FBMkMsRUFEcEM7VUFBQSxDQUFULENBTEEsQ0FBQTtpQkFRQSxJQUFBLENBQUssU0FBQSxHQUFBO21CQUNILE1BQUEsQ0FBTyxDQUFBLENBQUUsTUFBRixDQUFTLENBQUMsSUFBVixDQUFlLG1CQUFmLENBQVAsQ0FBMkMsQ0FBQyxXQUE1QyxDQUF3RCxpQkFBeEQsRUFERztVQUFBLENBQUwsRUFUK0Q7UUFBQSxDQUFqRSxFQVI2RDtNQUFBLENBQS9ELEVBekZtRDtJQUFBLENBQXJELEVBeDVCcUI7RUFBQSxDQUF2QixDQTlDQSxDQUFBO0FBQUEiCn0=

//# sourceURL=/Users/ah/.atom/packages/tabs/spec/tabs-spec.coffee
