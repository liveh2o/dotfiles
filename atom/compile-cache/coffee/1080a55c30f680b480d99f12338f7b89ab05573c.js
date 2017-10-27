(function() {
  var TabBarView, _, addItemToPane, buildDragEvents, buildWheelEvent, buildWheelPlusShiftEvent, getCenter, layout, main, path, ref, temp, triggerMouseEvent;

  _ = require('underscore-plus');

  path = require('path');

  temp = require('temp');

  TabBarView = require('../lib/tab-bar-view');

  layout = require('../lib/layout');

  main = require('../lib/main');

  ref = require("./event-helpers"), triggerMouseEvent = ref.triggerMouseEvent, buildDragEvents = ref.buildDragEvents, buildWheelEvent = ref.buildWheelEvent, buildWheelPlusShiftEvent = ref.buildWheelPlusShiftEvent;

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

  getCenter = function() {
    var base, ref1;
    return (ref1 = typeof (base = atom.workspace).getCenter === "function" ? base.getCenter() : void 0) != null ? ref1 : atom.workspace;
  };

  describe("Tabs package main", function() {
    var centerElement;
    centerElement = null;
    beforeEach(function() {
      centerElement = getCenter().paneContainer.getElement();
      waitsForPromise(function() {
        return atom.workspace.open('sample.js');
      });
      return waitsForPromise(function() {
        return atom.packages.activatePackage("tabs");
      });
    });
    describe(".activate()", function() {
      return it("appends a tab bar all existing and new panes", function() {
        var pane, tabBars;
        expect(centerElement.querySelectorAll('.pane').length).toBe(1);
        expect(centerElement.querySelectorAll('.pane > .tab-bar').length).toBe(1);
        pane = atom.workspace.getActivePane();
        pane.splitRight();
        expect(centerElement.querySelectorAll('.pane').length).toBe(2);
        tabBars = centerElement.querySelectorAll('.pane > .tab-bar');
        expect(tabBars.length).toBe(2);
        return expect(tabBars[1].getAttribute('location')).toBe('center');
      });
    });
    return describe(".deactivate()", function() {
      return it("removes all tab bar views and stops adding them to new panes", function() {
        var pane;
        pane = atom.workspace.getActivePane();
        pane.splitRight();
        expect(centerElement.querySelectorAll('.pane').length).toBe(2);
        expect(centerElement.querySelectorAll('.pane > .tab-bar').length).toBe(2);
        atom.packages.deactivatePackage('tabs');
        expect(centerElement.querySelectorAll('.pane').length).toBe(2);
        expect(centerElement.querySelectorAll('.pane > .tab-bar').length).toBe(0);
        pane.splitRight();
        expect(centerElement.querySelectorAll('.pane').length).toBe(3);
        return expect(centerElement.querySelectorAll('.pane > .tab-bar').length).toBe(0);
      });
    });
  });

  describe("TabBarView", function() {
    var TestView, deserializerDisposable, editor1, isPending, item1, item2, pane, ref1, tabBar;
    ref1 = [], deserializerDisposable = ref1[0], item1 = ref1[1], item2 = ref1[2], editor1 = ref1[3], pane = ref1[4], tabBar = ref1[5];
    TestView = (function() {
      TestView.deserialize = function(arg) {
        var iconName, longTitle, title;
        title = arg.title, longTitle = arg.longTitle, iconName = arg.iconName;
        return new TestView(title, longTitle, iconName);
      };

      function TestView(title1, longTitle1, iconName1, pathURI, isPermanentDockItem) {
        this.title = title1;
        this.longTitle = longTitle1;
        this.iconName = iconName1;
        this.pathURI = pathURI;
        this._isPermanentDockItem = isPermanentDockItem;
        this.element = document.createElement('div');
        this.element.textContent = this.title;
        if (isPermanentDockItem != null) {
          this.isPermanentDockItem = function() {
            return isPermanentDockItem;
          };
        }
      }

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

      TestView.prototype.copy = function() {
        return new TestView(this.title, this.longTitle, this.iconName);
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
        var callback, i, len, ref2, ref3, results;
        ref3 = (ref2 = this.titleCallbacks) != null ? ref2 : [];
        results = [];
        for (i = 0, len = ref3.length; i < len; i++) {
          callback = ref3[i];
          results.push(callback());
        }
        return results;
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
        var callback, i, len, ref2, ref3, results;
        ref3 = (ref2 = this.iconCallbacks) != null ? ref2 : [];
        results = [];
        for (i = 0, len = ref3.length; i < len; i++) {
          callback = ref3[i];
          results.push(callback());
        }
        return results;
      };

      TestView.prototype.onDidChangeModified = function() {
        return {
          dispose: function() {}
        };
      };

      return TestView;

    })();
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
        return tabBar = new TabBarView(pane, 'center');
      });
    });
    afterEach(function() {
      return deserializerDisposable.dispose();
    });
    describe("when the mouse is moved over the tab bar", function() {
      return it("fixes the width on every tab", function() {
        var initialWidth1, initialWidth2;
        jasmine.attachToDOM(tabBar.element);
        triggerMouseEvent('mouseenter', tabBar.element);
        initialWidth1 = tabBar.tabAtIndex(0).element.getBoundingClientRect().width.toFixed(0);
        initialWidth2 = tabBar.tabAtIndex(2).element.getBoundingClientRect().width.toFixed(0);
        expect(parseFloat(tabBar.tabAtIndex(0).element.style.maxWidth.replace('px', '')).toFixed(0)).toBe(initialWidth1);
        return expect(parseFloat(tabBar.tabAtIndex(2).element.style.maxWidth.replace('px', '')).toFixed(0)).toBe(initialWidth2);
      });
    });
    describe("when the mouse is moved away from the tab bar", function() {
      return it("resets the width on every tab", function() {
        jasmine.attachToDOM(tabBar.element);
        triggerMouseEvent('mouseenter', tabBar.element);
        triggerMouseEvent('mouseleave', tabBar.element);
        expect(tabBar.tabAtIndex(0).element.style.maxWidth).toBe('');
        return expect(tabBar.tabAtIndex(1).element.style.maxWidth).toBe('');
      });
    });
    describe(".initialize(pane)", function() {
      it("creates a tab for each item on the tab bar's parent pane", function() {
        expect(pane.getItems().length).toBe(3);
        expect(tabBar.element.querySelectorAll('.tab').length).toBe(3);
        expect(tabBar.element.querySelectorAll('.tab')[0].querySelector('.title').textContent).toBe(item1.getTitle());
        expect(tabBar.element.querySelectorAll('.tab')[0].querySelector('.title').dataset.name).toBeUndefined();
        expect(tabBar.element.querySelectorAll('.tab')[0].querySelector('.title').dataset.path).toBeUndefined();
        expect(tabBar.element.querySelectorAll('.tab')[0].dataset.type).toBe('TestView');
        expect(tabBar.element.querySelectorAll('.tab')[1].querySelector('.title').textContent).toBe(editor1.getTitle());
        expect(tabBar.element.querySelectorAll('.tab')[1].querySelector('.title').dataset.name).toBe(path.basename(editor1.getPath()));
        expect(tabBar.element.querySelectorAll('.tab')[1].querySelector('.title').dataset.path).toBe(editor1.getPath());
        expect(tabBar.element.querySelectorAll('.tab')[1].dataset.type).toBe('TextEditor');
        expect(tabBar.element.querySelectorAll('.tab')[2].querySelector('.title').textContent).toBe(item2.getTitle());
        expect(tabBar.element.querySelectorAll('.tab')[2].querySelector('.title').dataset.name).toBeUndefined();
        expect(tabBar.element.querySelectorAll('.tab')[2].querySelector('.title').dataset.path).toBeUndefined();
        return expect(tabBar.element.querySelectorAll('.tab')[0].dataset.type).toBe('TestView');
      });
      it("highlights the tab for the active pane item", function() {
        return expect(tabBar.element.querySelectorAll('.tab')[2]).toHaveClass('active');
      });
      return it("emits a warning when ::onDid... functions are not valid Disposables", function() {
        var BadView, badItem, warnings;
        BadView = (function() {
          function BadView() {
            this.element = document.createElement('div');
          }

          BadView.prototype.getTitle = function() {
            return "Anything";
          };

          BadView.prototype.onDidChangeTitle = function() {};

          BadView.prototype.onDidChangeIcon = function() {};

          BadView.prototype.onDidChangeModified = function() {};

          BadView.prototype.onDidSave = function() {};

          BadView.prototype.onDidChangePath = function() {};

          return BadView;

        })();
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
        expect(tabBar.element.querySelectorAll('.active').length).toBe(1);
        expect(tabBar.element.querySelectorAll('.tab')[0]).toHaveClass('active');
        pane.activateItem(item2);
        expect(tabBar.element.querySelectorAll('.active').length).toBe(1);
        return expect(tabBar.element.querySelectorAll('.tab')[2]).toHaveClass('active');
      });
    });
    describe("when a new item is added to the pane", function() {
      it("adds the 'modified' class to the new tab if the item is initially modified", function() {
        var editor2;
        editor2 = null;
        waitsForPromise(function() {
          if (atom.workspace.createItemForURI != null) {
            return atom.workspace.createItemForURI('sample.txt').then(function(o) {
              return editor2 = o;
            });
          } else {
            return atom.workspace.open('sample.txt', {
              activateItem: false
            }).then(function(o) {
              return editor2 = o;
            });
          }
        });
        return runs(function() {
          editor2.insertText('x');
          pane.activateItem(editor2);
          return expect(tabBar.tabForItem(editor2).element).toHaveClass('modified');
        });
      });
      describe("when addNewTabsAtEnd is set to true in package settings", function() {
        it("adds a tab for the new item at the end of the tab bar", function() {
          var item3;
          atom.config.set("tabs.addNewTabsAtEnd", true);
          item3 = new TestView('Item 3');
          pane.activateItem(item3);
          expect(tabBar.element.querySelectorAll('.tab').length).toBe(4);
          return expect(tabBar.tabAtIndex(3).element.querySelector('.title').textContent).toMatch('Item 3');
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
          expect(tabBar.element.querySelectorAll('.tab').length).toBe(4);
          return expect(tabBar.tabAtIndex(1).element.querySelector('.title').textContent).toMatch('Item 3');
        });
      });
    });
    describe("when an item is removed from the pane", function() {
      it("removes the item's tab from the tab bar", function() {
        pane.destroyItem(item2);
        expect(tabBar.getTabs().length).toBe(2);
        return expect(tabBar.element.textContent).not.toMatch('Item 2');
      });
      return it("updates the titles of the remaining tabs", function() {
        var item2a;
        expect(tabBar.tabForItem(item2).element.textContent).toMatch('Item 2');
        item2.longTitle = '2';
        item2a = new TestView('Item 2');
        item2a.longTitle = '2a';
        pane.activateItem(item2a);
        expect(tabBar.tabForItem(item2).element.textContent).toMatch('2');
        expect(tabBar.tabForItem(item2a).element.textContent).toMatch('2a');
        pane.destroyItem(item2a);
        return expect(tabBar.tabForItem(item2).element.textContent).toMatch('Item 2');
      });
    });
    describe("when a tab is clicked", function() {
      it("shows the associated item on the pane and focuses the pane", function() {
        var event;
        jasmine.attachToDOM(tabBar.element);
        spyOn(pane, 'activate');
        event = triggerMouseEvent('mousedown', tabBar.tabAtIndex(0).element, {
          which: 1
        });
        expect(pane.getActiveItem()).not.toBe(pane.getItems()[0]);
        waitsFor(function() {
          return pane.getActiveItem() === pane.getItems()[0];
        });
        runs(function() {
          expect(event.preventDefault).not.toHaveBeenCalled();
          event = triggerMouseEvent('mousedown', tabBar.tabAtIndex(2).element, {
            which: 1
          });
          return expect(pane.getActiveItem()).not.toBe(pane.getItems()[2]);
        });
        waitsFor(function() {
          return pane.getActiveItem() === pane.getItems()[2];
        });
        return runs(function() {
          expect(event.preventDefault).not.toHaveBeenCalled();
          return expect(pane.activate.callCount).toBe(2);
        });
      });
      it("closes the tab when middle clicked", function() {
        var event;
        jasmine.attachToDOM(tabBar.element);
        event = triggerMouseEvent('mousedown', tabBar.tabForItem(editor1).element, {
          which: 2
        });
        expect(pane.getItems().length).toBe(2);
        expect(pane.getItems().indexOf(editor1)).toBe(-1);
        expect(editor1.destroyed).toBeTruthy();
        expect(tabBar.getTabs().length).toBe(2);
        expect(tabBar.element.textContent).not.toMatch('sample.js');
        return expect(event.preventDefault).toHaveBeenCalled();
      });
      return it("doesn't switch tab when right (or ctrl-left) clicked", function() {
        var event;
        jasmine.attachToDOM(tabBar.element);
        spyOn(pane, 'activate');
        event = triggerMouseEvent('mousedown', tabBar.tabAtIndex(0).element, {
          which: 3
        });
        expect(pane.getActiveItem()).not.toBe(pane.getItems()[0]);
        expect(event.preventDefault).toHaveBeenCalled();
        event = triggerMouseEvent('mousedown', tabBar.tabAtIndex(0).element, {
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
        jasmine.attachToDOM(tabBar.element);
        tabBar.tabForItem(editor1).element.querySelector('.close-icon').click();
        expect(pane.getItems().length).toBe(2);
        expect(pane.getItems().indexOf(editor1)).toBe(-1);
        expect(editor1.destroyed).toBeTruthy();
        expect(tabBar.getTabs().length).toBe(2);
        return expect(tabBar.element.textContent).not.toMatch('sample.js');
      });
    });
    describe("when an item is activated", function() {
      var item3;
      item3 = [][0];
      beforeEach(function() {
        var container;
        item3 = new TestView("Item 3");
        pane.activateItem(item3);
        tabBar.element.style.display = 'flex';
        tabBar.element.style.overflowX = 'scroll';
        tabBar.element.style.margin = '0';
        container = document.createElement('div');
        container.style.width = '150px';
        container.appendChild(tabBar.element);
        jasmine.attachToDOM(container);
        return expect(tabBar.element.scrollWidth).toBeGreaterThan(tabBar.element.clientWidth);
      });
      it("does not scroll to the item when it is visible", function() {
        pane.activateItem(item1);
        expect(tabBar.element.scrollLeft).toBe(0);
        pane.activateItem(editor1);
        expect(tabBar.element.scrollLeft).toBe(0);
        pane.activateItem(item2);
        expect(tabBar.element.scrollLeft).toBe(0);
        pane.activateItem(item3);
        return expect(tabBar.element.scrollLeft).not.toBe(0);
      });
      return it("scrolls to the item when it isn't completely visible", function() {
        tabBar.element.scrollLeft = 5;
        expect(tabBar.element.scrollLeft).toBe(5);
        pane.activateItem(item1);
        expect(tabBar.element.scrollLeft).toBe(0);
        pane.activateItem(item3);
        return expect(tabBar.element.scrollLeft).toBe(tabBar.element.scrollWidth - tabBar.element.clientWidth);
      });
    });
    describe("when a tab item's title changes", function() {
      return it("updates the title of the item's tab", function() {
        editor1.buffer.setPath('/this/is-a/test.txt');
        return expect(tabBar.tabForItem(editor1).element.textContent).toMatch('test.txt');
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
        expect(tabBar.tabForItem(item1).element.textContent).toMatch("Grumpy Old Man");
        expect(tabBar.tabForItem(item2).element.textContent).toMatch("Jolly Old Man");
        item2.longTitle = void 0;
        item2.emitTitleChanged();
        expect(tabBar.tabForItem(item1).element.textContent).toMatch("Grumpy Old Man");
        return expect(tabBar.tabForItem(item2).element.textContent).toMatch("Old Man");
      });
    });
    describe("the close button", function() {
      it("is present in the center, regardless of the value returned by isPermanentDockItem()", function() {
        var item3, item4, item5, tabs;
        item3 = new TestView('Item 3', void 0, "squirrel", "sample.js");
        expect(item3.isPermanentDockItem).toBeUndefined();
        item4 = new TestView('Item 4', void 0, "squirrel", "sample.js", true);
        expect(typeof item4.isPermanentDockItem).toBe('function');
        item5 = new TestView('Item 5', void 0, "squirrel", "sample.js", false);
        expect(typeof item5.isPermanentDockItem).toBe('function');
        pane.activateItem(item3);
        pane.activateItem(item4);
        pane.activateItem(item5);
        tabs = tabBar.element.querySelectorAll('.tab');
        expect(tabs[2].querySelector('.close-icon')).not.toEqual(null);
        expect(tabs[3].querySelector('.close-icon')).not.toEqual(null);
        return expect(tabs[4].querySelector('.close-icon')).not.toEqual(null);
      });
      if (atom.workspace.getRightDock == null) {
        return;
      }
      return describe("in docks", function() {
        beforeEach(function() {
          pane = atom.workspace.getRightDock().getActivePane();
          return tabBar = new TabBarView(pane, 'right');
        });
        it("isn't shown if the method returns true", function() {
          var tab;
          item1 = new TestView('Item 1', void 0, "squirrel", "sample.js", true);
          expect(typeof item1.isPermanentDockItem).toBe('function');
          pane.activateItem(item1);
          tab = tabBar.element.querySelector('.tab');
          return expect(tab.querySelector('.close-icon')).toEqual(null);
        });
        it("is shown if the method returns false", function() {
          var tab;
          item1 = new TestView('Item 1', void 0, "squirrel", "sample.js", false);
          expect(typeof item1.isPermanentDockItem).toBe('function');
          pane.activateItem(item1);
          tab = tabBar.element.querySelector('.tab');
          return expect(tab.querySelector('.close-icon')).not.toBeUndefined();
        });
        return it("is shown if the method doesn't exist", function() {
          var tab;
          item1 = new TestView('Item 1', void 0, "squirrel", "sample.js");
          expect(item1.isPermanentDockItem).toBeUndefined();
          pane.activateItem(item1);
          tab = tabBar.element.querySelector('.tab');
          return expect(tab.querySelector('.close-icon')).not.toEqual(null);
        });
      });
    });
    describe("when an item has an icon defined", function() {
      it("displays the icon on the tab", function() {
        expect(tabBar.element.querySelectorAll('.tab')[0].querySelector('.title')).toHaveClass("icon");
        return expect(tabBar.element.querySelectorAll('.tab')[0].querySelector('.title')).toHaveClass("icon-squirrel");
      });
      it("hides the icon from the tab if the icon is removed", function() {
        item1.getIconName = null;
        item1.emitIconChanged();
        expect(tabBar.element.querySelectorAll('.tab')[0].querySelector('.title')).not.toHaveClass("icon");
        return expect(tabBar.element.querySelectorAll('.tab')[0].querySelector('.title')).not.toHaveClass("icon-squirrel");
      });
      it("updates the icon on the tab if the icon is changed", function() {
        item1.getIconName = function() {
          return "zap";
        };
        item1.emitIconChanged();
        expect(tabBar.element.querySelectorAll('.tab')[0].querySelector('.title')).toHaveClass("icon");
        return expect(tabBar.element.querySelectorAll('.tab')[0].querySelector('.title')).toHaveClass("icon-zap");
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
          return expect(tabBar.element.querySelectorAll('.tab')[0].querySelector('.title')).not.toHaveClass("hide-icon");
        });
        return it("hides the icon from the tab when showIcon is changed to false", function() {
          atom.config.set("tabs.showIcons", false);
          waitsFor(function() {
            return tabBar.tabForItem(item1).updateIconVisibility.callCount > 0;
          });
          return runs(function() {
            return expect(tabBar.element.querySelectorAll('.tab')[0].querySelector('.title')).toHaveClass("hide-icon");
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
          return expect(tabBar.element.querySelectorAll('.tab')[0].querySelector('.title')).toHaveClass("hide-icon");
        });
        return it("shows the icon on the tab when showIcon is changed to true", function() {
          atom.config.set("tabs.showIcons", true);
          waitsFor(function() {
            return tabBar.tabForItem(item1).updateIconVisibility.callCount > 0;
          });
          return expect(tabBar.element.querySelectorAll('.tab')[0].querySelector('.title')).not.toHaveClass("hide-icon");
        });
      });
    });
    describe("when the item doesn't have an icon defined", function() {
      it("doesn't display an icon on the tab", function() {
        expect(tabBar.element.querySelectorAll('.tab')[2].querySelector('.title')).not.toHaveClass("icon");
        return expect(tabBar.element.querySelectorAll('.tab')[2].querySelector('.title')).not.toHaveClass("icon-squirrel");
      });
      return it("shows the icon on the tab if an icon is defined", function() {
        item2.getIconName = function() {
          return "squirrel";
        };
        item2.emitIconChanged();
        expect(tabBar.element.querySelectorAll('.tab')[2].querySelector('.title')).toHaveClass("icon");
        return expect(tabBar.element.querySelectorAll('.tab')[2].querySelector('.title')).toHaveClass("icon-squirrel");
      });
    });
    describe("when a tab item's modified status changes", function() {
      return it("adds or removes the 'modified' class to the tab based on the status", function() {
        var tab;
        tab = tabBar.tabForItem(editor1);
        expect(editor1.isModified()).toBeFalsy();
        expect(tab.element).not.toHaveClass('modified');
        editor1.insertText('x');
        advanceClock(editor1.buffer.stoppedChangingDelay);
        expect(editor1.isModified()).toBeTruthy();
        expect(tab.element).toHaveClass('modified');
        editor1.undo();
        advanceClock(editor1.buffer.stoppedChangingDelay);
        expect(editor1.isModified()).toBeFalsy();
        return expect(tab.element).not.toHaveClass('modified');
      });
    });
    describe("when a pane item moves to a new index", function() {
      describe("when addNewTabsAtEnd is set to true in package settings", function() {
        return it("updates the order of the tabs to match the new item order", function() {
          atom.config.set("tabs.addNewTabsAtEnd", true);
          expect(tabBar.getTabs().map(function(tab) {
            return tab.element.textContent;
          })).toEqual(["Item 1", "sample.js", "Item 2"]);
          pane.moveItem(item2, 1);
          expect(tabBar.getTabs().map(function(tab) {
            return tab.element.textContent;
          })).toEqual(["Item 1", "Item 2", "sample.js"]);
          pane.moveItem(editor1, 0);
          expect(tabBar.getTabs().map(function(tab) {
            return tab.element.textContent;
          })).toEqual(["sample.js", "Item 1", "Item 2"]);
          pane.moveItem(item1, 2);
          return expect(tabBar.getTabs().map(function(tab) {
            return tab.element.textContent;
          })).toEqual(["sample.js", "Item 2", "Item 1"]);
        });
      });
      return describe("when addNewTabsAtEnd is set to false in package settings", function() {
        return it("updates the order of the tabs to match the new item order", function() {
          atom.config.set("tabs.addNewTabsAtEnd", false);
          expect(tabBar.getTabs().map(function(tab) {
            return tab.element.textContent;
          })).toEqual(["Item 1", "sample.js", "Item 2"]);
          pane.moveItem(item2, 1);
          expect(tabBar.getTabs().map(function(tab) {
            return tab.element.textContent;
          })).toEqual(["Item 1", "Item 2", "sample.js"]);
          pane.moveItem(editor1, 0);
          expect(tabBar.getTabs().map(function(tab) {
            return tab.element.textContent;
          })).toEqual(["sample.js", "Item 1", "Item 2"]);
          pane.moveItem(item1, 2);
          return expect(tabBar.getTabs().map(function(tab) {
            return tab.element.textContent;
          })).toEqual(["sample.js", "Item 2", "Item 1"]);
        });
      });
    });
    describe("context menu commands", function() {
      beforeEach(function() {
        var paneElement;
        paneElement = pane.getElement();
        return paneElement.insertBefore(tabBar.element, paneElement.firstChild);
      });
      describe("when tabs:close-tab is fired", function() {
        return it("closes the active tab", function() {
          triggerMouseEvent('mousedown', tabBar.tabForItem(item2).element, {
            which: 3
          });
          atom.commands.dispatch(tabBar.element, 'tabs:close-tab');
          expect(pane.getItems().length).toBe(2);
          expect(pane.getItems().indexOf(item2)).toBe(-1);
          expect(tabBar.getTabs().length).toBe(2);
          return expect(tabBar.element.textContent).not.toMatch('Item 2');
        });
      });
      describe("when tabs:close-other-tabs is fired", function() {
        return it("closes all other tabs except the active tab", function() {
          triggerMouseEvent('mousedown', tabBar.tabForItem(item2).element, {
            which: 3
          });
          atom.commands.dispatch(tabBar.element, 'tabs:close-other-tabs');
          expect(pane.getItems().length).toBe(1);
          expect(tabBar.getTabs().length).toBe(1);
          expect(tabBar.element.textContent).not.toMatch('sample.js');
          return expect(tabBar.element.textContent).toMatch('Item 2');
        });
      });
      describe("when tabs:close-tabs-to-right is fired", function() {
        return it("closes only the tabs to the right of the active tab", function() {
          pane.activateItem(editor1);
          triggerMouseEvent('mousedown', tabBar.tabForItem(editor1).element, {
            which: 3
          });
          atom.commands.dispatch(tabBar.element, 'tabs:close-tabs-to-right');
          expect(pane.getItems().length).toBe(2);
          expect(tabBar.getTabs().length).toBe(2);
          expect(tabBar.element.textContent).not.toMatch('Item 2');
          return expect(tabBar.element.textContent).toMatch('Item 1');
        });
      });
      describe("when tabs:close-tabs-to-left is fired", function() {
        return it("closes only the tabs to the left of the active tab", function() {
          pane.activateItem(editor1);
          triggerMouseEvent('mousedown', tabBar.tabForItem(editor1).element, {
            which: 3
          });
          atom.commands.dispatch(tabBar.element, 'tabs:close-tabs-to-left');
          expect(pane.getItems().length).toBe(2);
          expect(tabBar.getTabs().length).toBe(2);
          expect(tabBar.element.textContent).toMatch('Item 2');
          return expect(tabBar.element.textContent).not.toMatch('Item 1');
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
          triggerMouseEvent('mousedown', tabBar.tabForItem(item2).element, {
            which: 3
          });
          expect(getCenter().getPanes().length).toBe(1);
          atom.commands.dispatch(tabBar.element, 'tabs:split-up');
          expect(getCenter().getPanes().length).toBe(2);
          expect(getCenter().getPanes()[1]).toBe(pane);
          return expect(getCenter().getPanes()[0].getItems()[0].getTitle()).toBe(item2.getTitle());
        });
      });
      describe("when tabs:split-down is fired", function() {
        return it("splits the selected tab down", function() {
          triggerMouseEvent('mousedown', tabBar.tabForItem(item2).element, {
            which: 3
          });
          expect(getCenter().getPanes().length).toBe(1);
          atom.commands.dispatch(tabBar.element, 'tabs:split-down');
          expect(getCenter().getPanes().length).toBe(2);
          expect(getCenter().getPanes()[0]).toBe(pane);
          return expect(getCenter().getPanes()[1].getItems()[0].getTitle()).toBe(item2.getTitle());
        });
      });
      describe("when tabs:split-left is fired", function() {
        return it("splits the selected tab to the left", function() {
          triggerMouseEvent('mousedown', tabBar.tabForItem(item2).element, {
            which: 3
          });
          expect(getCenter().getPanes().length).toBe(1);
          atom.commands.dispatch(tabBar.element, 'tabs:split-left');
          expect(getCenter().getPanes().length).toBe(2);
          expect(getCenter().getPanes()[1]).toBe(pane);
          return expect(getCenter().getPanes()[0].getItems()[0].getTitle()).toBe(item2.getTitle());
        });
      });
      describe("when tabs:split-right is fired", function() {
        return it("splits the selected tab to the right", function() {
          triggerMouseEvent('mousedown', tabBar.tabForItem(item2).element, {
            which: 3
          });
          expect(getCenter().getPanes().length).toBe(1);
          atom.commands.dispatch(tabBar.element, 'tabs:split-right');
          expect(getCenter().getPanes().length).toBe(2);
          expect(getCenter().getPanes()[0]).toBe(pane);
          return expect(getCenter().getPanes()[1].getItems()[0].getTitle()).toBe(item2.getTitle());
        });
      });
      return describe("when tabs:open-in-new-window is fired", function() {
        describe("by right-clicking on a tab", function() {
          beforeEach(function() {
            triggerMouseEvent('mousedown', tabBar.tabForItem(item1).element, {
              which: 3
            });
            return expect(getCenter().getPanes().length).toBe(1);
          });
          return it("opens new window, closes current tab", function() {
            spyOn(atom, 'open');
            atom.commands.dispatch(tabBar.element, 'tabs:open-in-new-window');
            expect(atom.open).toHaveBeenCalled();
            expect(pane.getItems().length).toBe(2);
            expect(tabBar.getTabs().length).toBe(2);
            expect(tabBar.element.textContent).toMatch('Item 2');
            return expect(tabBar.element.textContent).not.toMatch('Item 1');
          });
        });
        return describe("from the command palette", function() {
          return it("does nothing", function() {
            spyOn(atom, 'open');
            atom.commands.dispatch(tabBar.element, 'tabs:open-in-new-window');
            return expect(atom.open).not.toHaveBeenCalled();
          });
        });
      });
    });
    describe("command palette commands", function() {
      var paneElement;
      paneElement = null;
      beforeEach(function() {
        return paneElement = pane.getElement();
      });
      describe("when tabs:close-tab is fired", function() {
        it("closes the active tab", function() {
          atom.commands.dispatch(paneElement, 'tabs:close-tab');
          expect(pane.getItems().length).toBe(2);
          expect(pane.getItems().indexOf(item2)).toBe(-1);
          expect(tabBar.getTabs().length).toBe(2);
          return expect(tabBar.element.textContent).not.toMatch('Item 2');
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
          expect(tabBar.element.textContent).not.toMatch('sample.js');
          return expect(tabBar.element.textContent).toMatch('Item 2');
        });
      });
      describe("when tabs:close-tabs-to-right is fired", function() {
        return it("closes only the tabs to the right of the active tab", function() {
          pane.activateItem(editor1);
          atom.commands.dispatch(paneElement, 'tabs:close-tabs-to-right');
          expect(pane.getItems().length).toBe(2);
          expect(tabBar.getTabs().length).toBe(2);
          expect(tabBar.element.textContent).not.toMatch('Item 2');
          return expect(tabBar.element.textContent).toMatch('Item 1');
        });
      });
      describe("when tabs:close-all-tabs is fired", function() {
        return it("closes all the tabs", function() {
          expect(pane.getItems().length).toBeGreaterThan(0);
          atom.commands.dispatch(paneElement, 'tabs:close-all-tabs');
          return expect(pane.getItems().length).toBe(0);
        });
      });
      describe("when tabs:close-saved-tabs is fired", function() {
        return it("closes all the saved tabs", function() {
          item1.isModified = function() {
            return true;
          };
          atom.commands.dispatch(paneElement, 'tabs:close-saved-tabs');
          expect(pane.getItems().length).toBe(1);
          return expect(pane.getItems()[0]).toBe(item1);
        });
      });
      return describe("when pane:close is fired", function() {
        return it("destroys all the tabs within the pane", function() {
          var pane2, tab2, tabBar2;
          pane2 = pane.splitDown({
            copyActiveItem: true
          });
          tabBar2 = new TabBarView(pane2, 'center');
          tab2 = tabBar2.tabAtIndex(0);
          spyOn(tab2, 'destroy');
          return waitsForPromise(function() {
            return Promise.resolve(pane2.close()).then(function() {
              return expect(tab2.destroy).toHaveBeenCalled();
            });
          });
        });
      });
    });
    describe("dragging and dropping tabs", function() {
      describe("when a tab is dragged within the same pane", function() {
        describe("when it is dropped on tab that's later in the list", function() {
          return it("moves the tab and its item, shows the tab's item, and focuses the pane", function() {
            var dragStartEvent, dropEvent, ref2, tabToDrag;
            expect(tabBar.getTabs().map(function(tab) {
              return tab.element.textContent;
            })).toEqual(["Item 1", "sample.js", "Item 2"]);
            expect(pane.getItems()).toEqual([item1, editor1, item2]);
            expect(pane.getActiveItem()).toBe(item2);
            spyOn(pane, 'activate');
            tabToDrag = tabBar.tabAtIndex(0);
            spyOn(tabToDrag, 'destroyTooltip');
            spyOn(tabToDrag, 'updateTooltip');
            ref2 = buildDragEvents(tabToDrag.element, tabBar.tabAtIndex(1).element), dragStartEvent = ref2[0], dropEvent = ref2[1];
            tabBar.onDragStart(dragStartEvent);
            expect(tabToDrag.destroyTooltip).toHaveBeenCalled();
            expect(tabToDrag.updateTooltip).not.toHaveBeenCalled();
            tabBar.onDrop(dropEvent);
            expect(tabToDrag.updateTooltip).toHaveBeenCalled();
            expect(tabBar.getTabs().map(function(tab) {
              return tab.element.textContent;
            })).toEqual(["sample.js", "Item 1", "Item 2"]);
            expect(pane.getItems()).toEqual([editor1, item1, item2]);
            expect(pane.getActiveItem()).toBe(item1);
            return expect(pane.activate).toHaveBeenCalled();
          });
        });
        describe("when it is dropped on a tab that's earlier in the list", function() {
          return it("moves the tab and its item, shows the tab's item, and focuses the pane", function() {
            var dragStartEvent, dropEvent, ref2;
            expect(tabBar.getTabs().map(function(tab) {
              return tab.element.textContent;
            })).toEqual(["Item 1", "sample.js", "Item 2"]);
            expect(pane.getItems()).toEqual([item1, editor1, item2]);
            expect(pane.getActiveItem()).toBe(item2);
            spyOn(pane, 'activate');
            ref2 = buildDragEvents(tabBar.tabAtIndex(2).element, tabBar.tabAtIndex(0).element), dragStartEvent = ref2[0], dropEvent = ref2[1];
            tabBar.onDragStart(dragStartEvent);
            tabBar.onDrop(dropEvent);
            expect(tabBar.getTabs().map(function(tab) {
              return tab.element.textContent;
            })).toEqual(["Item 1", "Item 2", "sample.js"]);
            expect(pane.getItems()).toEqual([item1, item2, editor1]);
            expect(pane.getActiveItem()).toBe(item2);
            return expect(pane.activate).toHaveBeenCalled();
          });
        });
        describe("when it is dropped on itself", function() {
          return it("doesn't move the tab or item, but does make it the active item and focuses the pane", function() {
            var dragStartEvent, dropEvent, ref2;
            expect(tabBar.getTabs().map(function(tab) {
              return tab.element.textContent;
            })).toEqual(["Item 1", "sample.js", "Item 2"]);
            expect(pane.getItems()).toEqual([item1, editor1, item2]);
            expect(pane.getActiveItem()).toBe(item2);
            spyOn(pane, 'activate');
            ref2 = buildDragEvents(tabBar.tabAtIndex(0).element, tabBar.tabAtIndex(0).element), dragStartEvent = ref2[0], dropEvent = ref2[1];
            tabBar.onDragStart(dragStartEvent);
            tabBar.onDrop(dropEvent);
            expect(tabBar.getTabs().map(function(tab) {
              return tab.element.textContent;
            })).toEqual(["Item 1", "sample.js", "Item 2"]);
            expect(pane.getItems()).toEqual([item1, editor1, item2]);
            expect(pane.getActiveItem()).toBe(item1);
            return expect(pane.activate).toHaveBeenCalled();
          });
        });
        return describe("when it is dropped on the tab bar", function() {
          return it("moves the tab and its item to the end", function() {
            var dragStartEvent, dropEvent, ref2;
            expect(tabBar.getTabs().map(function(tab) {
              return tab.element.textContent;
            })).toEqual(["Item 1", "sample.js", "Item 2"]);
            expect(pane.getItems()).toEqual([item1, editor1, item2]);
            expect(pane.getActiveItem()).toBe(item2);
            spyOn(pane, 'activate');
            ref2 = buildDragEvents(tabBar.tabAtIndex(0).element, tabBar.element), dragStartEvent = ref2[0], dropEvent = ref2[1];
            tabBar.onDragStart(dragStartEvent);
            tabBar.onDrop(dropEvent);
            expect(tabBar.getTabs().map(function(tab) {
              return tab.element.textContent;
            })).toEqual(["sample.js", "Item 2", "Item 1"]);
            return expect(pane.getItems()).toEqual([editor1, item2, item1]);
          });
        });
      });
      describe("when a tab is dragged to a different pane", function() {
        var item2b, pane2, ref2, tabBar2;
        ref2 = [], pane2 = ref2[0], tabBar2 = ref2[1], item2b = ref2[2];
        beforeEach(function() {
          pane2 = pane.splitRight({
            copyActiveItem: true
          });
          item2b = pane2.getItems()[0];
          return tabBar2 = new TabBarView(pane2, 'center');
        });
        it("removes the tab and item from their original pane and moves them to the target pane", function() {
          var dragStartEvent, dropEvent, ref3;
          expect(tabBar.getTabs().map(function(tab) {
            return tab.element.textContent;
          })).toEqual(["Item 1", "sample.js", "Item 2"]);
          expect(pane.getItems()).toEqual([item1, editor1, item2]);
          expect(pane.getActiveItem()).toBe(item2);
          expect(tabBar2.getTabs().map(function(tab) {
            return tab.element.textContent;
          })).toEqual(["Item 2"]);
          expect(pane2.getItems()).toEqual([item2b]);
          expect(pane2.activeItem).toBe(item2b);
          spyOn(pane2, 'activate');
          ref3 = buildDragEvents(tabBar.tabAtIndex(0).element, tabBar2.tabAtIndex(0).element), dragStartEvent = ref3[0], dropEvent = ref3[1];
          tabBar.onDragStart(dragStartEvent);
          tabBar2.onDrop(dropEvent);
          expect(tabBar.getTabs().map(function(tab) {
            return tab.element.textContent;
          })).toEqual(["sample.js", "Item 2"]);
          expect(pane.getItems()).toEqual([editor1, item2]);
          expect(pane.getActiveItem()).toBe(item2);
          expect(tabBar2.getTabs().map(function(tab) {
            return tab.element.textContent;
          })).toEqual(["Item 2", "Item 1"]);
          expect(pane2.getItems()).toEqual([item2b, item1]);
          expect(pane2.activeItem).toBe(item1);
          return expect(pane2.activate).toHaveBeenCalled();
        });
        describe("when the tab is dragged to an empty pane", function() {
          return it("removes the tab and item from their original pane and moves them to the target pane", function() {
            var dragStartEvent, dropEvent, ref3;
            pane2.destroyItems();
            expect(tabBar.getTabs().map(function(tab) {
              return tab.element.textContent;
            })).toEqual(["Item 1", "sample.js", "Item 2"]);
            expect(pane.getItems()).toEqual([item1, editor1, item2]);
            expect(pane.getActiveItem()).toBe(item2);
            expect(tabBar2.getTabs().map(function(tab) {
              return tab.element.textContent;
            })).toEqual([]);
            expect(pane2.getItems()).toEqual([]);
            expect(pane2.activeItem).toBeUndefined();
            spyOn(pane2, 'activate');
            ref3 = buildDragEvents(tabBar.tabAtIndex(0).element, tabBar2.element), dragStartEvent = ref3[0], dropEvent = ref3[1];
            tabBar.onDragStart(dragStartEvent);
            tabBar2.onDragOver(dropEvent);
            tabBar2.onDrop(dropEvent);
            expect(tabBar.getTabs().map(function(tab) {
              return tab.element.textContent;
            })).toEqual(["sample.js", "Item 2"]);
            expect(pane.getItems()).toEqual([editor1, item2]);
            expect(pane.getActiveItem()).toBe(item2);
            expect(tabBar2.getTabs().map(function(tab) {
              return tab.element.textContent;
            })).toEqual(["Item 1"]);
            expect(pane2.getItems()).toEqual([item1]);
            expect(pane2.activeItem).toBe(item1);
            return expect(pane2.activate).toHaveBeenCalled();
          });
        });
        return describe("when addNewTabsAtEnd is set to true in package settings", function() {
          return it("moves the dragged tab to the desired index in the new pane", function() {
            var dragStartEvent, dropEvent, ref3;
            atom.config.set("tabs.addNewTabsAtEnd", true);
            expect(tabBar.getTabs().map(function(tab) {
              return tab.element.textContent;
            })).toEqual(["Item 1", "sample.js", "Item 2"]);
            expect(pane.getItems()).toEqual([item1, editor1, item2]);
            expect(pane.getActiveItem()).toBe(item2);
            expect(tabBar2.getTabs().map(function(tab) {
              return tab.element.textContent;
            })).toEqual(["Item 2"]);
            expect(pane2.getItems()).toEqual([item2b]);
            expect(pane2.activeItem).toBe(item2b);
            spyOn(pane2, 'activate');
            ref3 = buildDragEvents(tabBar2.tabAtIndex(0).element, tabBar.tabAtIndex(0).element), dragStartEvent = ref3[0], dropEvent = ref3[1];
            tabBar2.onDragStart(dragStartEvent);
            tabBar.onDrop(dropEvent);
            expect(tabBar.getTabs().map(function(tab) {
              return tab.element.textContent;
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
            return tab.element.textContent;
          })).toEqual(["Item 1", "sample.js", "Item 2"]);
          tab = tabBar.tabAtIndex(2).element;
          layout.test = {
            pane: pane,
            itemView: pane.getElement().querySelector('.item-views'),
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
            return tab.element.textContent;
          })).toEqual(["Item 1", "sample.js", "Item 2"]);
          tab = tabBar.tabAtIndex(2).element;
          layout.test = {
            pane: pane,
            itemView: pane.getElement().querySelector('.item-views'),
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
          expect(getCenter().getPanes().length).toEqual(2);
          expect(tabBar.getTabs().map(function(tab) {
            return tab.element.textContent;
          })).toEqual(["Item 1", "sample.js"]);
          return expect(atom.workspace.getActivePane().getItems().length).toEqual(1);
        });
        describe("when the dragged tab is the only one in the pane", function() {
          return it("does nothing", function() {
            var tab;
            tabBar.getTabs()[0].element.querySelector('.close-icon').click();
            tabBar.getTabs()[1].element.querySelector('.close-icon').click();
            expect(tabBar.getTabs().map(function(tab) {
              return tab.element.textContent;
            })).toEqual(["sample.js"]);
            tab = tabBar.tabAtIndex(0).element;
            layout.test = {
              pane: pane,
              itemView: pane.getElement().querySelector('.item-views'),
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
            expect(getCenter().getPanes().length).toEqual(1);
            return expect(tabBar.getTabs().map(function(tab) {
              return tab.element.textContent;
            })).toEqual(["sample.js"]);
          });
        });
        return describe("when the pane is empty", function() {
          return it("moves the tab to the target pane", function() {
            var tab, toPane;
            toPane = pane.splitDown();
            expect(tabBar.getTabs().map(function(tab) {
              return tab.element.textContent;
            })).toEqual(["Item 1", "sample.js", "Item 2"]);
            expect(toPane.getItems().length).toBe(0);
            tab = tabBar.tabAtIndex(2).element;
            layout.test = {
              pane: toPane,
              itemView: toPane.getElement().querySelector('.item-views'),
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
            expect(getCenter().getPanes().length).toEqual(2);
            expect(tabBar.getTabs().map(function(tab) {
              return tab.element.textContent;
            })).toEqual(["Item 1", "sample.js"]);
            return expect(atom.workspace.getActivePane().getItems().length).toEqual(1);
          });
        });
      });
      describe("when a non-tab is dragged to pane", function() {
        return it("has no effect", function() {
          var dragStartEvent, dropEvent, ref2;
          expect(tabBar.getTabs().map(function(tab) {
            return tab.element.textContent;
          })).toEqual(["Item 1", "sample.js", "Item 2"]);
          expect(pane.getItems()).toEqual([item1, editor1, item2]);
          expect(pane.getActiveItem()).toBe(item2);
          spyOn(pane, 'activate');
          ref2 = buildDragEvents(tabBar.tabAtIndex(0).element, tabBar.tabAtIndex(0).element), dragStartEvent = ref2[0], dropEvent = ref2[1];
          tabBar.onDrop(dropEvent);
          expect(tabBar.getTabs().map(function(tab) {
            return tab.element.textContent;
          })).toEqual(["Item 1", "sample.js", "Item 2"]);
          expect(pane.getItems()).toEqual([item1, editor1, item2]);
          expect(pane.getActiveItem()).toBe(item2);
          return expect(pane.activate).not.toHaveBeenCalled();
        });
      });
      describe("when a tab is dragged out of application", function() {
        return it("should carry the file's information", function() {
          var dragStartEvent, dropEvent, ref2;
          ref2 = buildDragEvents(tabBar.tabAtIndex(1).element, tabBar.tabAtIndex(1).element), dragStartEvent = ref2[0], dropEvent = ref2[1];
          tabBar.onDragStart(dragStartEvent);
          expect(dragStartEvent.dataTransfer.getData("text/plain")).toEqual(editor1.getPath());
          if (process.platform === 'darwin') {
            return expect(dragStartEvent.dataTransfer.getData("text/uri-list")).toEqual("file://" + (editor1.getPath()));
          }
        });
      });
      describe("when a tab is dragged to another Atom window", function() {
        it("closes the tab in the first window and opens the tab in the second window", function() {
          var dragStartEvent, dropEvent, ref2;
          ref2 = buildDragEvents(tabBar.tabAtIndex(1).element, tabBar.tabAtIndex(0).element), dragStartEvent = ref2[0], dropEvent = ref2[1];
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
          var dragStartEvent, dropEvent, ref2;
          editor1.setText('I came from another window');
          ref2 = buildDragEvents(tabBar.tabAtIndex(1).element, tabBar.tabAtIndex(0).element), dragStartEvent = ref2[0], dropEvent = ref2[1];
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
          var dragStartEvent, dropEvent, ref2;
          editor1.getBuffer().setPath(null);
          editor1.setText('I have no path');
          ref2 = buildDragEvents(tabBar.tabAtIndex(1).element, tabBar.tabAtIndex(0).element), dragStartEvent = ref2[0], dropEvent = ref2[1];
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
      if (atom.workspace.getLeftDock != null) {
        return describe("when a tab is dragged to another pane container", function() {
          var dockItem, pane2, ref2, tabBar2;
          ref2 = [], pane2 = ref2[0], tabBar2 = ref2[1], dockItem = ref2[2];
          beforeEach(function() {
            jasmine.attachToDOM(atom.workspace.getElement());
            pane = atom.workspace.getActivePane();
            pane2 = atom.workspace.getLeftDock().getActivePane();
            dockItem = new TestView('Dock Item');
            pane2.addItem(dockItem);
            return tabBar2 = new TabBarView(pane2, 'left');
          });
          it("removes the tab and item from their original pane and moves them to the target pane", function() {
            var dragStartEvent, dropEvent, ref3;
            expect(atom.workspace.getLeftDock().isVisible()).toBe(false);
            expect(tabBar.getTabs().map(function(tab) {
              return tab.element.textContent;
            })).toEqual(["Item 1", "sample.js", "Item 2"]);
            expect(pane.getItems()).toEqual([item1, editor1, item2]);
            expect(pane.getActiveItem()).toBe(item2);
            expect(tabBar2.getTabs().map(function(tab) {
              return tab.element.textContent;
            })).toEqual(["Dock Item"]);
            expect(pane2.getItems()).toEqual([dockItem]);
            expect(pane2.getActiveItem()).toBe(dockItem);
            ref3 = buildDragEvents(tabBar.tabAtIndex(0).element, tabBar2.element), dragStartEvent = ref3[0], dropEvent = ref3[1];
            tabBar.onDragStart(dragStartEvent);
            expect(tabBar2.element.querySelector('.placeholder')).toBeNull();
            tabBar2.onDragOver(dropEvent);
            expect(tabBar2.element.querySelector('.placeholder')).not.toBeNull();
            tabBar2.onDrop(dropEvent);
            expect(tabBar2.element.querySelector('.placeholder')).toBeNull();
            expect(tabBar.getTabs().map(function(tab) {
              return tab.element.textContent;
            })).toEqual(["sample.js", "Item 2"]);
            expect(pane.getItems()).toEqual([editor1, item2]);
            expect(pane.getActiveItem()).toBe(item2);
            expect(tabBar2.getTabs().map(function(tab) {
              return tab.element.textContent;
            })).toEqual(["Dock Item", "Item 1"]);
            expect(pane2.getItems()).toEqual([dockItem, item1]);
            expect(pane2.activeItem).toBe(item1);
            return expect(atom.workspace.getLeftDock().isVisible()).toBe(true);
          });
          return it("shows a placeholder and allows the tab be dropped only if the item supports the target pane container location", function() {
            var dragStartEvent, dropEvent, ref3, ref4;
            item1.getAllowedLocations = function() {
              return ['center', 'bottom'];
            };
            ref3 = buildDragEvents(tabBar.tabAtIndex(0).element, tabBar2.element), dragStartEvent = ref3[0], dropEvent = ref3[1];
            tabBar.onDragStart(dragStartEvent);
            expect(tabBar2.element.querySelector('.placeholder')).toBeNull();
            tabBar2.onDragOver(dropEvent);
            expect(tabBar2.element.querySelector('.placeholder')).toBeNull();
            tabBar2.onDrop(dropEvent);
            expect(tabBar2.element.querySelector('.placeholder')).toBeNull();
            expect(pane.getItems()).toEqual([item1, editor1, item2]);
            expect(pane2.getItems()).toEqual([dockItem]);
            item1.getAllowedLocations = function() {
              return ['left'];
            };
            ref4 = buildDragEvents(tabBar.tabAtIndex(0).element, tabBar2.element), dragStartEvent = ref4[0], dropEvent = ref4[1];
            tabBar.onDragStart(dragStartEvent);
            expect(tabBar2.element.querySelector('.placeholder')).toBeNull();
            tabBar2.onDragOver(dropEvent);
            expect(tabBar2.element.querySelector('.placeholder')).not.toBeNull();
            tabBar2.onDrop(dropEvent);
            expect(tabBar2.element.querySelector('.placeholder')).toBeNull();
            expect(pane.getItems()).toEqual([editor1, item2]);
            return expect(pane2.getItems()).toEqual([dockItem, item1]);
          });
        });
      }
    });
    describe("when the tab bar is double clicked", function() {
      return it("opens a new empty editor", function() {
        var newFileHandler;
        newFileHandler = jasmine.createSpy('newFileHandler');
        atom.commands.add(tabBar.element, 'application:new-file', newFileHandler);
        triggerMouseEvent("dblclick", tabBar.getTabs()[0].element);
        expect(newFileHandler.callCount).toBe(0);
        triggerMouseEvent("dblclick", tabBar.element);
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
            tabBar.element.dispatchEvent(buildWheelEvent(120));
            return expect(pane.getActiveItem()).toBe(editor1);
          });
          return it("changes the active tab to the previous tab only after the wheelDelta crosses the threshold", function() {
            expect(pane.getActiveItem()).toBe(item2);
            tabBar.element.dispatchEvent(buildWheelEvent(50));
            expect(pane.getActiveItem()).toBe(item2);
            tabBar.element.dispatchEvent(buildWheelEvent(50));
            expect(pane.getActiveItem()).toBe(item2);
            tabBar.element.dispatchEvent(buildWheelEvent(50));
            return expect(pane.getActiveItem()).toBe(editor1);
          });
        });
        describe("when the mouse wheel scrolls down", function() {
          return it("changes the active tab to the previous tab", function() {
            expect(pane.getActiveItem()).toBe(item2);
            tabBar.element.dispatchEvent(buildWheelEvent(-120));
            return expect(pane.getActiveItem()).toBe(item1);
          });
        });
        describe("when the mouse wheel scrolls up and shift key is pressed", function() {
          return it("does not change the active tab", function() {
            expect(pane.getActiveItem()).toBe(item2);
            tabBar.element.dispatchEvent(buildWheelPlusShiftEvent(120));
            return expect(pane.getActiveItem()).toBe(item2);
          });
        });
        return describe("when the mouse wheel scrolls down and shift key is pressed", function() {
          return it("does not change the active tab", function() {
            expect(pane.getActiveItem()).toBe(item2);
            tabBar.element.dispatchEvent(buildWheelPlusShiftEvent(-120));
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
            tabBar.element.dispatchEvent(buildWheelEvent(120));
            return expect(pane.getActiveItem()).toBe(item2);
          });
        });
        return describe("when the mouse wheel scrolls down one unit", function() {
          return it("does not change the active tab", function() {
            expect(pane.getActiveItem()).toBe(item2);
            tabBar.element.dispatchEvent(buildWheelEvent(-120));
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
          return expect(tabBar.element).toHaveClass('hidden');
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
              expect(tabBar.element.querySelectorAll('.tab .temp').length).toBe(1);
              return expect(tabBar.element.querySelectorAll('.tab')[0].querySelector('.title')).toHaveClass('temp');
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
              atom.commands.dispatch(atom.workspace.getActivePane().getElement(), 'tabs:keep-pending-tab');
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
              expect(tabBar.tabForItem(editor1)).toBeUndefined();
              return expect(tabBar.tabForItem(editor2).element.querySelector('.title')).toHaveClass('temp');
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
              expect(tabBar.tabForItem(editor2).element.querySelector('.title')).toHaveClass('temp');
              triggerMouseEvent('dblclick', tabBar.tabForItem(editor2).element, {
                which: 1
              });
              return expect(tabBar.tabForItem(editor2).element.querySelector('.title')).not.toHaveClass('temp');
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
              return expect(tabBar.tabForItem(editor1).element.querySelector('.title')).not.toHaveClass('temp');
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
              return expect(tabBar.tabForItem(editor1).element.querySelector('.title')).not.toHaveClass('temp');
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
            tabBar2 = new TabBarView(pane2, 'center');
            newEditor = pane2.getActiveItem();
            expect(isPending(newEditor)).toBe(false);
            return expect(tabBar2.tabForItem(newEditor).element.querySelector('.title')).not.toHaveClass('temp');
          });
          return it("keeps the pending tab in the old pane", function() {
            expect(isPending(editor1)).toBe(true);
            return expect(tabBar.tabForItem(editor1).element.querySelector('.title')).toHaveClass('temp');
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
              tabBar2 = new TabBarView(pane2, 'center');
              tabBar2.moveItemBetweenPanes(pane, 0, pane2, 1, editor1);
              return expect(tabBar2.tabForItem(pane2.getActiveItem()).element.querySelector('.title')).not.toHaveClass('temp');
            });
          });
        });
      });
    }
    return describe("integration with version control systems", function() {
      var ref2, repository, tab, tab1;
      ref2 = [], repository = ref2[0], tab = ref2[1], tab1 = ref2[2];
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
          var callback, i, len, ref3, ref4, results;
          ref4 = (ref3 = this.changeStatusCallbacks) != null ? ref3 : [];
          results = [];
          for (i = 0, len = ref4.length; i < len; i++) {
            callback = ref4[i];
            results.push(callback(event));
          }
          return results;
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
          var callback, i, len, ref3, ref4, results;
          ref4 = (ref3 = this.changeStatusesCallbacks) != null ? ref3 : [];
          results = [];
          for (i = 0, len = ref4.length; i < len; i++) {
            callback = ref4[i];
            results.push(callback(event));
          }
          return results;
        };
        spyOn(atom.project, 'repositoryForDirectory').andReturn(Promise.resolve(repository));
        atom.config.set("tabs.enableVcsColoring", true);
        return waitsFor(function() {
          var ref3;
          return ((ref3 = repository.changeStatusCallbacks) != null ? ref3.length : void 0) > 0;
        });
      });
      describe("when working inside a VCS repository", function() {
        it("adds custom style for new items", function() {
          repository.getCachedPathStatus.andReturn('new');
          tab.updateVcsStatus(repository);
          return expect(tabBar.element.querySelectorAll('.tab')[1].querySelector('.title')).toHaveClass("status-added");
        });
        it("adds custom style for modified items", function() {
          repository.getCachedPathStatus.andReturn('modified');
          tab.updateVcsStatus(repository);
          return expect(tabBar.element.querySelectorAll('.tab')[1].querySelector('.title')).toHaveClass("status-modified");
        });
        it("adds custom style for ignored items", function() {
          repository.isPathIgnored.andReturn(true);
          tab.updateVcsStatus(repository);
          return expect(tabBar.element.querySelectorAll('.tab')[1].querySelector('.title')).toHaveClass("status-ignored");
        });
        return it("does not add any styles for items not in the repository", function() {
          expect(tabBar.element.querySelectorAll('.tab')[0].querySelector('.title')).not.toHaveClass("status-added");
          expect(tabBar.element.querySelectorAll('.tab')[0].querySelector('.title')).not.toHaveClass("status-modified");
          return expect(tabBar.element.querySelectorAll('.tab')[0].querySelector('.title')).not.toHaveClass("status-ignored");
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
          expect(tabBar.element.querySelectorAll('.tab')[1].querySelector('.title')).not.toHaveClass("status-modified");
          repository.emitDidChangeStatus({
            path: tab.path,
            pathStatus: "modified"
          });
          expect(tabBar.element.querySelectorAll('.tab')[1].querySelector('.title')).toHaveClass("status-modified");
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
      describe("when enableVcsColoring changes in package settings", function() {
        it("removes status from the tab if enableVcsColoring is set to false", function() {
          repository.emitDidChangeStatus({
            path: tab.path,
            pathStatus: 'new'
          });
          expect(tabBar.element.querySelectorAll('.tab')[1].querySelector('.title')).toHaveClass("status-added");
          atom.config.set("tabs.enableVcsColoring", false);
          return expect(tabBar.element.querySelectorAll('.tab')[1].querySelector('.title')).not.toHaveClass("status-added");
        });
        return it("adds status to the tab if enableVcsColoring is set to true", function() {
          atom.config.set("tabs.enableVcsColoring", false);
          repository.getCachedPathStatus.andReturn('modified');
          expect(tabBar.element.querySelectorAll('.tab')[1].querySelector('.title')).not.toHaveClass("status-modified");
          atom.config.set("tabs.enableVcsColoring", true);
          waitsFor(function() {
            var ref3;
            return ((ref3 = repository.changeStatusCallbacks) != null ? ref3.length : void 0) > 0;
          });
          return runs(function() {
            return expect(tabBar.element.querySelectorAll('.tab')[1].querySelector('.title')).toHaveClass("status-modified");
          });
        });
      });
      if (atom.workspace.getLeftDock != null) {
        return describe("a pane in the dock", function() {
          beforeEach(function() {
            return main.activate();
          });
          afterEach(function() {
            return main.deactivate();
          });
          return it("gets decorated with tabs", function() {
            var dock, dockElement, item;
            dock = atom.workspace.getLeftDock();
            dockElement = dock.getElement();
            item = new TestView('Dock Item 1');
            expect(dockElement.querySelectorAll('.tab').length).toBe(0);
            pane = dock.getActivePane();
            pane.activateItem(item);
            expect(dockElement.querySelectorAll('.tab').length).toBe(1);
            pane.destroyItem(item);
            return expect(dockElement.querySelectorAll('.tab').length).toBe(0);
          });
        });
      }
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RhYnMvc3BlYy90YWJzLXNwZWMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSOztFQUNKLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFDUCxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsVUFBQSxHQUFhLE9BQUEsQ0FBUSxxQkFBUjs7RUFDYixNQUFBLEdBQVMsT0FBQSxDQUFRLGVBQVI7O0VBQ1QsSUFBQSxHQUFPLE9BQUEsQ0FBUSxhQUFSOztFQUNQLE1BQWtGLE9BQUEsQ0FBUSxpQkFBUixDQUFsRixFQUFDLHlDQUFELEVBQW9CLHFDQUFwQixFQUFxQyxxQ0FBckMsRUFBc0Q7O0VBRXRELGFBQUEsR0FBZ0IsU0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLEtBQWI7SUFHZCxJQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBYixLQUF1QixDQUExQjthQUNFLElBQUksQ0FBQyxPQUFMLENBQWEsSUFBYixFQUFtQjtRQUFBLEtBQUEsRUFBTyxLQUFQO09BQW5CLEVBREY7S0FBQSxNQUVLLElBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFiLEtBQXVCLENBQXZCLElBQTRCLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBYixLQUF1QixDQUF0RDthQUNILElBQUksQ0FBQyxPQUFMLENBQWEsSUFBYixFQUFtQixLQUFuQixFQURHO0tBQUEsTUFBQTtBQUdILFlBQVUsSUFBQSxLQUFBLENBQU0sNkJBQU4sRUFIUDs7RUFMUzs7RUFXaEIsU0FBQSxHQUFZLFNBQUE7QUFBRyxRQUFBO3lIQUE4QixJQUFJLENBQUM7RUFBdEM7O0VBRVosUUFBQSxDQUFTLG1CQUFULEVBQThCLFNBQUE7QUFDNUIsUUFBQTtJQUFBLGFBQUEsR0FBZ0I7SUFFaEIsVUFBQSxDQUFXLFNBQUE7TUFDVCxhQUFBLEdBQWdCLFNBQUEsQ0FBQSxDQUFXLENBQUMsYUFBYSxDQUFDLFVBQTFCLENBQUE7TUFFaEIsZUFBQSxDQUFnQixTQUFBO2VBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLFdBQXBCO01BRGMsQ0FBaEI7YUFHQSxlQUFBLENBQWdCLFNBQUE7ZUFDZCxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsTUFBOUI7TUFEYyxDQUFoQjtJQU5TLENBQVg7SUFTQSxRQUFBLENBQVMsYUFBVCxFQUF3QixTQUFBO2FBQ3RCLEVBQUEsQ0FBRyw4Q0FBSCxFQUFtRCxTQUFBO0FBQ2pELFlBQUE7UUFBQSxNQUFBLENBQU8sYUFBYSxDQUFDLGdCQUFkLENBQStCLE9BQS9CLENBQXVDLENBQUMsTUFBL0MsQ0FBc0QsQ0FBQyxJQUF2RCxDQUE0RCxDQUE1RDtRQUNBLE1BQUEsQ0FBTyxhQUFhLENBQUMsZ0JBQWQsQ0FBK0Isa0JBQS9CLENBQWtELENBQUMsTUFBMUQsQ0FBaUUsQ0FBQyxJQUFsRSxDQUF1RSxDQUF2RTtRQUVBLElBQUEsR0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBQTtRQUNQLElBQUksQ0FBQyxVQUFMLENBQUE7UUFFQSxNQUFBLENBQU8sYUFBYSxDQUFDLGdCQUFkLENBQStCLE9BQS9CLENBQXVDLENBQUMsTUFBL0MsQ0FBc0QsQ0FBQyxJQUF2RCxDQUE0RCxDQUE1RDtRQUNBLE9BQUEsR0FBVSxhQUFhLENBQUMsZ0JBQWQsQ0FBK0Isa0JBQS9CO1FBQ1YsTUFBQSxDQUFPLE9BQU8sQ0FBQyxNQUFmLENBQXNCLENBQUMsSUFBdkIsQ0FBNEIsQ0FBNUI7ZUFDQSxNQUFBLENBQU8sT0FBUSxDQUFBLENBQUEsQ0FBRSxDQUFDLFlBQVgsQ0FBd0IsVUFBeEIsQ0FBUCxDQUEyQyxDQUFDLElBQTVDLENBQWlELFFBQWpEO01BVmlELENBQW5EO0lBRHNCLENBQXhCO1dBYUEsUUFBQSxDQUFTLGVBQVQsRUFBMEIsU0FBQTthQUN4QixFQUFBLENBQUcsOERBQUgsRUFBbUUsU0FBQTtBQUNqRSxZQUFBO1FBQUEsSUFBQSxHQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBZixDQUFBO1FBQ1AsSUFBSSxDQUFDLFVBQUwsQ0FBQTtRQUNBLE1BQUEsQ0FBTyxhQUFhLENBQUMsZ0JBQWQsQ0FBK0IsT0FBL0IsQ0FBdUMsQ0FBQyxNQUEvQyxDQUFzRCxDQUFDLElBQXZELENBQTRELENBQTVEO1FBQ0EsTUFBQSxDQUFPLGFBQWEsQ0FBQyxnQkFBZCxDQUErQixrQkFBL0IsQ0FBa0QsQ0FBQyxNQUExRCxDQUFpRSxDQUFDLElBQWxFLENBQXVFLENBQXZFO1FBRUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxpQkFBZCxDQUFnQyxNQUFoQztRQUNBLE1BQUEsQ0FBTyxhQUFhLENBQUMsZ0JBQWQsQ0FBK0IsT0FBL0IsQ0FBdUMsQ0FBQyxNQUEvQyxDQUFzRCxDQUFDLElBQXZELENBQTRELENBQTVEO1FBQ0EsTUFBQSxDQUFPLGFBQWEsQ0FBQyxnQkFBZCxDQUErQixrQkFBL0IsQ0FBa0QsQ0FBQyxNQUExRCxDQUFpRSxDQUFDLElBQWxFLENBQXVFLENBQXZFO1FBRUEsSUFBSSxDQUFDLFVBQUwsQ0FBQTtRQUNBLE1BQUEsQ0FBTyxhQUFhLENBQUMsZ0JBQWQsQ0FBK0IsT0FBL0IsQ0FBdUMsQ0FBQyxNQUEvQyxDQUFzRCxDQUFDLElBQXZELENBQTRELENBQTVEO2VBQ0EsTUFBQSxDQUFPLGFBQWEsQ0FBQyxnQkFBZCxDQUErQixrQkFBL0IsQ0FBa0QsQ0FBQyxNQUExRCxDQUFpRSxDQUFDLElBQWxFLENBQXVFLENBQXZFO01BWmlFLENBQW5FO0lBRHdCLENBQTFCO0VBekI0QixDQUE5Qjs7RUF3Q0EsUUFBQSxDQUFTLFlBQVQsRUFBdUIsU0FBQTtBQUNyQixRQUFBO0lBQUEsT0FBZ0UsRUFBaEUsRUFBQyxnQ0FBRCxFQUF5QixlQUF6QixFQUFnQyxlQUFoQyxFQUF1QyxpQkFBdkMsRUFBZ0QsY0FBaEQsRUFBc0Q7SUFFaEQ7TUFDSixRQUFDLENBQUEsV0FBRCxHQUFjLFNBQUMsR0FBRDtBQUFrQyxZQUFBO1FBQWhDLG1CQUFPLDJCQUFXO2VBQWtCLElBQUEsUUFBQSxDQUFTLEtBQVQsRUFBZ0IsU0FBaEIsRUFBMkIsUUFBM0I7TUFBdEM7O01BQ0Qsa0JBQUMsTUFBRCxFQUFTLFVBQVQsRUFBcUIsU0FBckIsRUFBZ0MsT0FBaEMsRUFBMEMsbUJBQTFDO1FBQUMsSUFBQyxDQUFBLFFBQUQ7UUFBUSxJQUFDLENBQUEsWUFBRDtRQUFZLElBQUMsQ0FBQSxXQUFEO1FBQVcsSUFBQyxDQUFBLFVBQUQ7UUFDM0MsSUFBQyxDQUFBLG9CQUFELEdBQXdCO1FBQ3hCLElBQUMsQ0FBQSxPQUFELEdBQVcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkI7UUFDWCxJQUFDLENBQUEsT0FBTyxDQUFDLFdBQVQsR0FBdUIsSUFBQyxDQUFBO1FBQ3hCLElBQUcsMkJBQUg7VUFDRSxJQUFDLENBQUEsbUJBQUQsR0FBdUIsU0FBQTttQkFBRztVQUFILEVBRHpCOztNQUpXOzt5QkFNYixRQUFBLEdBQVUsU0FBQTtlQUFHLElBQUMsQ0FBQTtNQUFKOzt5QkFDVixZQUFBLEdBQWMsU0FBQTtlQUFHLElBQUMsQ0FBQTtNQUFKOzt5QkFDZCxNQUFBLEdBQVEsU0FBQTtlQUFHLElBQUMsQ0FBQTtNQUFKOzt5QkFDUixXQUFBLEdBQWEsU0FBQTtlQUFHLElBQUMsQ0FBQTtNQUFKOzt5QkFDYixTQUFBLEdBQVcsU0FBQTtlQUFHO1VBQUMsWUFBQSxFQUFjLFVBQWY7VUFBNEIsT0FBRCxJQUFDLENBQUEsS0FBNUI7VUFBb0MsV0FBRCxJQUFDLENBQUEsU0FBcEM7VUFBZ0QsVUFBRCxJQUFDLENBQUEsUUFBaEQ7O01BQUg7O3lCQUNYLElBQUEsR0FBTSxTQUFBO2VBQU8sSUFBQSxRQUFBLENBQVMsSUFBQyxDQUFBLEtBQVYsRUFBaUIsSUFBQyxDQUFBLFNBQWxCLEVBQTZCLElBQUMsQ0FBQSxRQUE5QjtNQUFQOzt5QkFDTixnQkFBQSxHQUFrQixTQUFDLFFBQUQ7O1VBQ2hCLElBQUMsQ0FBQSxpQkFBa0I7O1FBQ25CLElBQUMsQ0FBQSxjQUFjLENBQUMsSUFBaEIsQ0FBcUIsUUFBckI7ZUFDQTtVQUFBLE9BQUEsRUFBUyxDQUFBLFNBQUEsS0FBQTttQkFBQSxTQUFBO3FCQUFHLENBQUMsQ0FBQyxNQUFGLENBQVMsS0FBQyxDQUFBLGNBQVYsRUFBMEIsUUFBMUI7WUFBSDtVQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBVDs7TUFIZ0I7O3lCQUlsQixnQkFBQSxHQUFrQixTQUFBO0FBQ2hCLFlBQUE7QUFBQTtBQUFBO2FBQUEsc0NBQUE7O3VCQUFBLFFBQUEsQ0FBQTtBQUFBOztNQURnQjs7eUJBRWxCLGVBQUEsR0FBaUIsU0FBQyxRQUFEOztVQUNmLElBQUMsQ0FBQSxnQkFBaUI7O1FBQ2xCLElBQUMsQ0FBQSxhQUFhLENBQUMsSUFBZixDQUFvQixRQUFwQjtlQUNBO1VBQUEsT0FBQSxFQUFTLENBQUEsU0FBQSxLQUFBO21CQUFBLFNBQUE7cUJBQUcsQ0FBQyxDQUFDLE1BQUYsQ0FBUyxLQUFDLENBQUEsYUFBVixFQUF5QixRQUF6QjtZQUFIO1VBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFUOztNQUhlOzt5QkFJakIsZUFBQSxHQUFpQixTQUFBO0FBQ2YsWUFBQTtBQUFBO0FBQUE7YUFBQSxzQ0FBQTs7dUJBQUEsUUFBQSxDQUFBO0FBQUE7O01BRGU7O3lCQUVqQixtQkFBQSxHQUFxQixTQUFBO2VBQ25CO1VBQUEsT0FBQSxFQUFTLFNBQUEsR0FBQSxDQUFUOztNQURtQjs7Ozs7SUFHdkIsVUFBQSxDQUFXLFNBQUE7TUFDVCxzQkFBQSxHQUF5QixJQUFJLENBQUMsYUFBYSxDQUFDLEdBQW5CLENBQXVCLFFBQXZCO01BQ3pCLEtBQUEsR0FBWSxJQUFBLFFBQUEsQ0FBUyxRQUFULEVBQW1CLE1BQW5CLEVBQThCLFVBQTlCLEVBQTBDLFdBQTFDO01BQ1osS0FBQSxHQUFZLElBQUEsUUFBQSxDQUFTLFFBQVQ7TUFFWixlQUFBLENBQWdCLFNBQUE7ZUFDZCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsV0FBcEI7TUFEYyxDQUFoQjthQUdBLElBQUEsQ0FBSyxTQUFBO1FBQ0gsT0FBQSxHQUFVLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQTtRQUNWLElBQUEsR0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBQTtRQUNQLGFBQUEsQ0FBYyxJQUFkLEVBQW9CLEtBQXBCLEVBQTJCLENBQTNCO1FBQ0EsYUFBQSxDQUFjLElBQWQsRUFBb0IsS0FBcEIsRUFBMkIsQ0FBM0I7UUFDQSxJQUFJLENBQUMsWUFBTCxDQUFrQixLQUFsQjtlQUNBLE1BQUEsR0FBYSxJQUFBLFVBQUEsQ0FBVyxJQUFYLEVBQWlCLFFBQWpCO01BTlYsQ0FBTDtJQVJTLENBQVg7SUFnQkEsU0FBQSxDQUFVLFNBQUE7YUFDUixzQkFBc0IsQ0FBQyxPQUF2QixDQUFBO0lBRFEsQ0FBVjtJQUdBLFFBQUEsQ0FBUywwQ0FBVCxFQUFxRCxTQUFBO2FBQ25ELEVBQUEsQ0FBRyw4QkFBSCxFQUFtQyxTQUFBO0FBQ2pDLFlBQUE7UUFBQSxPQUFPLENBQUMsV0FBUixDQUFvQixNQUFNLENBQUMsT0FBM0I7UUFFQSxpQkFBQSxDQUFrQixZQUFsQixFQUFnQyxNQUFNLENBQUMsT0FBdkM7UUFFQSxhQUFBLEdBQWdCLE1BQU0sQ0FBQyxVQUFQLENBQWtCLENBQWxCLENBQW9CLENBQUMsT0FBTyxDQUFDLHFCQUE3QixDQUFBLENBQW9ELENBQUMsS0FBSyxDQUFDLE9BQTNELENBQW1FLENBQW5FO1FBQ2hCLGFBQUEsR0FBZ0IsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsQ0FBbEIsQ0FBb0IsQ0FBQyxPQUFPLENBQUMscUJBQTdCLENBQUEsQ0FBb0QsQ0FBQyxLQUFLLENBQUMsT0FBM0QsQ0FBbUUsQ0FBbkU7UUFHaEIsTUFBQSxDQUFPLFVBQUEsQ0FBVyxNQUFNLENBQUMsVUFBUCxDQUFrQixDQUFsQixDQUFvQixDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE9BQTVDLENBQW9ELElBQXBELEVBQTBELEVBQTFELENBQVgsQ0FBeUUsQ0FBQyxPQUExRSxDQUFrRixDQUFsRixDQUFQLENBQTRGLENBQUMsSUFBN0YsQ0FBa0csYUFBbEc7ZUFDQSxNQUFBLENBQU8sVUFBQSxDQUFXLE1BQU0sQ0FBQyxVQUFQLENBQWtCLENBQWxCLENBQW9CLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsT0FBNUMsQ0FBb0QsSUFBcEQsRUFBMEQsRUFBMUQsQ0FBWCxDQUF5RSxDQUFDLE9BQTFFLENBQWtGLENBQWxGLENBQVAsQ0FBNEYsQ0FBQyxJQUE3RixDQUFrRyxhQUFsRztNQVZpQyxDQUFuQztJQURtRCxDQUFyRDtJQWFBLFFBQUEsQ0FBUywrQ0FBVCxFQUEwRCxTQUFBO2FBQ3hELEVBQUEsQ0FBRywrQkFBSCxFQUFvQyxTQUFBO1FBQ2xDLE9BQU8sQ0FBQyxXQUFSLENBQW9CLE1BQU0sQ0FBQyxPQUEzQjtRQUVBLGlCQUFBLENBQWtCLFlBQWxCLEVBQWdDLE1BQU0sQ0FBQyxPQUF2QztRQUNBLGlCQUFBLENBQWtCLFlBQWxCLEVBQWdDLE1BQU0sQ0FBQyxPQUF2QztRQUVBLE1BQUEsQ0FBTyxNQUFNLENBQUMsVUFBUCxDQUFrQixDQUFsQixDQUFvQixDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsUUFBMUMsQ0FBbUQsQ0FBQyxJQUFwRCxDQUF5RCxFQUF6RDtlQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsVUFBUCxDQUFrQixDQUFsQixDQUFvQixDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsUUFBMUMsQ0FBbUQsQ0FBQyxJQUFwRCxDQUF5RCxFQUF6RDtNQVBrQyxDQUFwQztJQUR3RCxDQUExRDtJQVVBLFFBQUEsQ0FBUyxtQkFBVCxFQUE4QixTQUFBO01BQzVCLEVBQUEsQ0FBRywwREFBSCxFQUErRCxTQUFBO1FBQzdELE1BQUEsQ0FBTyxJQUFJLENBQUMsUUFBTCxDQUFBLENBQWUsQ0FBQyxNQUF2QixDQUE4QixDQUFDLElBQS9CLENBQW9DLENBQXBDO1FBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFPLENBQUMsZ0JBQWYsQ0FBZ0MsTUFBaEMsQ0FBdUMsQ0FBQyxNQUEvQyxDQUFzRCxDQUFDLElBQXZELENBQTRELENBQTVEO1FBRUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFPLENBQUMsZ0JBQWYsQ0FBZ0MsTUFBaEMsQ0FBd0MsQ0FBQSxDQUFBLENBQUUsQ0FBQyxhQUEzQyxDQUF5RCxRQUF6RCxDQUFrRSxDQUFDLFdBQTFFLENBQXNGLENBQUMsSUFBdkYsQ0FBNEYsS0FBSyxDQUFDLFFBQU4sQ0FBQSxDQUE1RjtRQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBTyxDQUFDLGdCQUFmLENBQWdDLE1BQWhDLENBQXdDLENBQUEsQ0FBQSxDQUFFLENBQUMsYUFBM0MsQ0FBeUQsUUFBekQsQ0FBa0UsQ0FBQyxPQUFPLENBQUMsSUFBbEYsQ0FBdUYsQ0FBQyxhQUF4RixDQUFBO1FBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFPLENBQUMsZ0JBQWYsQ0FBZ0MsTUFBaEMsQ0FBd0MsQ0FBQSxDQUFBLENBQUUsQ0FBQyxhQUEzQyxDQUF5RCxRQUF6RCxDQUFrRSxDQUFDLE9BQU8sQ0FBQyxJQUFsRixDQUF1RixDQUFDLGFBQXhGLENBQUE7UUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyxnQkFBZixDQUFnQyxNQUFoQyxDQUF3QyxDQUFBLENBQUEsQ0FBRSxDQUFDLE9BQU8sQ0FBQyxJQUExRCxDQUErRCxDQUFDLElBQWhFLENBQXFFLFVBQXJFO1FBRUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFPLENBQUMsZ0JBQWYsQ0FBZ0MsTUFBaEMsQ0FBd0MsQ0FBQSxDQUFBLENBQUUsQ0FBQyxhQUEzQyxDQUF5RCxRQUF6RCxDQUFrRSxDQUFDLFdBQTFFLENBQXNGLENBQUMsSUFBdkYsQ0FBNEYsT0FBTyxDQUFDLFFBQVIsQ0FBQSxDQUE1RjtRQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBTyxDQUFDLGdCQUFmLENBQWdDLE1BQWhDLENBQXdDLENBQUEsQ0FBQSxDQUFFLENBQUMsYUFBM0MsQ0FBeUQsUUFBekQsQ0FBa0UsQ0FBQyxPQUFPLENBQUMsSUFBbEYsQ0FBdUYsQ0FBQyxJQUF4RixDQUE2RixJQUFJLENBQUMsUUFBTCxDQUFjLE9BQU8sQ0FBQyxPQUFSLENBQUEsQ0FBZCxDQUE3RjtRQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBTyxDQUFDLGdCQUFmLENBQWdDLE1BQWhDLENBQXdDLENBQUEsQ0FBQSxDQUFFLENBQUMsYUFBM0MsQ0FBeUQsUUFBekQsQ0FBa0UsQ0FBQyxPQUFPLENBQUMsSUFBbEYsQ0FBdUYsQ0FBQyxJQUF4RixDQUE2RixPQUFPLENBQUMsT0FBUixDQUFBLENBQTdGO1FBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFPLENBQUMsZ0JBQWYsQ0FBZ0MsTUFBaEMsQ0FBd0MsQ0FBQSxDQUFBLENBQUUsQ0FBQyxPQUFPLENBQUMsSUFBMUQsQ0FBK0QsQ0FBQyxJQUFoRSxDQUFxRSxZQUFyRTtRQUVBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBTyxDQUFDLGdCQUFmLENBQWdDLE1BQWhDLENBQXdDLENBQUEsQ0FBQSxDQUFFLENBQUMsYUFBM0MsQ0FBeUQsUUFBekQsQ0FBa0UsQ0FBQyxXQUExRSxDQUFzRixDQUFDLElBQXZGLENBQTRGLEtBQUssQ0FBQyxRQUFOLENBQUEsQ0FBNUY7UUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyxnQkFBZixDQUFnQyxNQUFoQyxDQUF3QyxDQUFBLENBQUEsQ0FBRSxDQUFDLGFBQTNDLENBQXlELFFBQXpELENBQWtFLENBQUMsT0FBTyxDQUFDLElBQWxGLENBQXVGLENBQUMsYUFBeEYsQ0FBQTtRQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBTyxDQUFDLGdCQUFmLENBQWdDLE1BQWhDLENBQXdDLENBQUEsQ0FBQSxDQUFFLENBQUMsYUFBM0MsQ0FBeUQsUUFBekQsQ0FBa0UsQ0FBQyxPQUFPLENBQUMsSUFBbEYsQ0FBdUYsQ0FBQyxhQUF4RixDQUFBO2VBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFPLENBQUMsZ0JBQWYsQ0FBZ0MsTUFBaEMsQ0FBd0MsQ0FBQSxDQUFBLENBQUUsQ0FBQyxPQUFPLENBQUMsSUFBMUQsQ0FBK0QsQ0FBQyxJQUFoRSxDQUFxRSxVQUFyRTtNQWpCNkQsQ0FBL0Q7TUFtQkEsRUFBQSxDQUFHLDZDQUFILEVBQWtELFNBQUE7ZUFDaEQsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFPLENBQUMsZ0JBQWYsQ0FBZ0MsTUFBaEMsQ0FBd0MsQ0FBQSxDQUFBLENBQS9DLENBQWtELENBQUMsV0FBbkQsQ0FBK0QsUUFBL0Q7TUFEZ0QsQ0FBbEQ7YUFHQSxFQUFBLENBQUcscUVBQUgsRUFBMEUsU0FBQTtBQUN4RSxZQUFBO1FBQU07VUFDUyxpQkFBQTtZQUNYLElBQUMsQ0FBQSxPQUFELEdBQVcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkI7VUFEQTs7NEJBRWIsUUFBQSxHQUFVLFNBQUE7bUJBQUc7VUFBSDs7NEJBQ1YsZ0JBQUEsR0FBa0IsU0FBQSxHQUFBOzs0QkFDbEIsZUFBQSxHQUFpQixTQUFBLEdBQUE7OzRCQUNqQixtQkFBQSxHQUFxQixTQUFBLEdBQUE7OzRCQUNyQixTQUFBLEdBQVcsU0FBQSxHQUFBOzs0QkFDWCxlQUFBLEdBQWlCLFNBQUEsR0FBQTs7Ozs7UUFFbkIsUUFBQSxHQUFXO1FBQ1gsS0FBQSxDQUFNLE9BQU4sRUFBZSxNQUFmLENBQXNCLENBQUMsV0FBdkIsQ0FBbUMsU0FBQyxPQUFELEVBQVUsTUFBVjtpQkFDakMsUUFBUSxDQUFDLElBQVQsQ0FBYztZQUFDLFNBQUEsT0FBRDtZQUFVLFFBQUEsTUFBVjtXQUFkO1FBRGlDLENBQW5DO1FBR0EsT0FBQSxHQUFjLElBQUEsT0FBQSxDQUFRLFFBQVI7UUFDZCxJQUFJLENBQUMsT0FBTCxDQUFhLE9BQWI7UUFFQSxNQUFBLENBQU8sUUFBUyxDQUFBLENBQUEsQ0FBRSxDQUFDLE9BQW5CLENBQTJCLENBQUMsU0FBNUIsQ0FBc0Msa0JBQXRDO1FBQ0EsTUFBQSxDQUFPLFFBQVMsQ0FBQSxDQUFBLENBQUUsQ0FBQyxNQUFuQixDQUEwQixDQUFDLElBQTNCLENBQWdDLE9BQWhDO1FBRUEsTUFBQSxDQUFPLFFBQVMsQ0FBQSxDQUFBLENBQUUsQ0FBQyxPQUFuQixDQUEyQixDQUFDLFNBQTVCLENBQXNDLGlCQUF0QztRQUNBLE1BQUEsQ0FBTyxRQUFTLENBQUEsQ0FBQSxDQUFFLENBQUMsTUFBbkIsQ0FBMEIsQ0FBQyxJQUEzQixDQUFnQyxPQUFoQztRQUVBLE1BQUEsQ0FBTyxRQUFTLENBQUEsQ0FBQSxDQUFFLENBQUMsT0FBbkIsQ0FBMkIsQ0FBQyxTQUE1QixDQUFzQyxpQkFBdEM7UUFDQSxNQUFBLENBQU8sUUFBUyxDQUFBLENBQUEsQ0FBRSxDQUFDLE1BQW5CLENBQTBCLENBQUMsSUFBM0IsQ0FBZ0MsT0FBaEM7UUFFQSxNQUFBLENBQU8sUUFBUyxDQUFBLENBQUEsQ0FBRSxDQUFDLE9BQW5CLENBQTJCLENBQUMsU0FBNUIsQ0FBc0MscUJBQXRDO1FBQ0EsTUFBQSxDQUFPLFFBQVMsQ0FBQSxDQUFBLENBQUUsQ0FBQyxNQUFuQixDQUEwQixDQUFDLElBQTNCLENBQWdDLE9BQWhDO1FBRUEsTUFBQSxDQUFPLFFBQVMsQ0FBQSxDQUFBLENBQUUsQ0FBQyxPQUFuQixDQUEyQixDQUFDLFNBQTVCLENBQXNDLFdBQXRDO2VBQ0EsTUFBQSxDQUFPLFFBQVMsQ0FBQSxDQUFBLENBQUUsQ0FBQyxNQUFuQixDQUEwQixDQUFDLElBQTNCLENBQWdDLE9BQWhDO01BL0J3RSxDQUExRTtJQXZCNEIsQ0FBOUI7SUF3REEsUUFBQSxDQUFTLG1DQUFULEVBQThDLFNBQUE7YUFDNUMsRUFBQSxDQUFHLGlEQUFILEVBQXNELFNBQUE7UUFDcEQsSUFBSSxDQUFDLFlBQUwsQ0FBa0IsS0FBbEI7UUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyxnQkFBZixDQUFnQyxTQUFoQyxDQUEwQyxDQUFDLE1BQWxELENBQXlELENBQUMsSUFBMUQsQ0FBK0QsQ0FBL0Q7UUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyxnQkFBZixDQUFnQyxNQUFoQyxDQUF3QyxDQUFBLENBQUEsQ0FBL0MsQ0FBa0QsQ0FBQyxXQUFuRCxDQUErRCxRQUEvRDtRQUVBLElBQUksQ0FBQyxZQUFMLENBQWtCLEtBQWxCO1FBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFPLENBQUMsZ0JBQWYsQ0FBZ0MsU0FBaEMsQ0FBMEMsQ0FBQyxNQUFsRCxDQUF5RCxDQUFDLElBQTFELENBQStELENBQS9EO2VBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFPLENBQUMsZ0JBQWYsQ0FBZ0MsTUFBaEMsQ0FBd0MsQ0FBQSxDQUFBLENBQS9DLENBQWtELENBQUMsV0FBbkQsQ0FBK0QsUUFBL0Q7TUFQb0QsQ0FBdEQ7SUFENEMsQ0FBOUM7SUFVQSxRQUFBLENBQVMsc0NBQVQsRUFBaUQsU0FBQTtNQUMvQyxFQUFBLENBQUcsNEVBQUgsRUFBaUYsU0FBQTtBQUMvRSxZQUFBO1FBQUEsT0FBQSxHQUFVO1FBRVYsZUFBQSxDQUFnQixTQUFBO1VBQ2QsSUFBRyx1Q0FBSDttQkFDRSxJQUFJLENBQUMsU0FBUyxDQUFDLGdCQUFmLENBQWdDLFlBQWhDLENBQTZDLENBQUMsSUFBOUMsQ0FBbUQsU0FBQyxDQUFEO3FCQUFPLE9BQUEsR0FBVTtZQUFqQixDQUFuRCxFQURGO1dBQUEsTUFBQTttQkFHRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsWUFBcEIsRUFBa0M7Y0FBQyxZQUFBLEVBQWMsS0FBZjthQUFsQyxDQUF3RCxDQUFDLElBQXpELENBQThELFNBQUMsQ0FBRDtxQkFBTyxPQUFBLEdBQVU7WUFBakIsQ0FBOUQsRUFIRjs7UUFEYyxDQUFoQjtlQU1BLElBQUEsQ0FBSyxTQUFBO1VBQ0gsT0FBTyxDQUFDLFVBQVIsQ0FBbUIsR0FBbkI7VUFDQSxJQUFJLENBQUMsWUFBTCxDQUFrQixPQUFsQjtpQkFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLFVBQVAsQ0FBa0IsT0FBbEIsQ0FBMEIsQ0FBQyxPQUFsQyxDQUEwQyxDQUFDLFdBQTNDLENBQXVELFVBQXZEO1FBSEcsQ0FBTDtNQVQrRSxDQUFqRjtNQWNBLFFBQUEsQ0FBUyx5REFBVCxFQUFvRSxTQUFBO1FBQ2xFLEVBQUEsQ0FBRyx1REFBSCxFQUE0RCxTQUFBO0FBQzFELGNBQUE7VUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isc0JBQWhCLEVBQXdDLElBQXhDO1VBQ0EsS0FBQSxHQUFZLElBQUEsUUFBQSxDQUFTLFFBQVQ7VUFDWixJQUFJLENBQUMsWUFBTCxDQUFrQixLQUFsQjtVQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBTyxDQUFDLGdCQUFmLENBQWdDLE1BQWhDLENBQXVDLENBQUMsTUFBL0MsQ0FBc0QsQ0FBQyxJQUF2RCxDQUE0RCxDQUE1RDtpQkFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLFVBQVAsQ0FBa0IsQ0FBbEIsQ0FBb0IsQ0FBQyxPQUFPLENBQUMsYUFBN0IsQ0FBMkMsUUFBM0MsQ0FBb0QsQ0FBQyxXQUE1RCxDQUF3RSxDQUFDLE9BQXpFLENBQWlGLFFBQWpGO1FBTDBELENBQTVEO2VBT0EsRUFBQSxDQUFHLHdEQUFILEVBQTZELFNBQUE7QUFDM0QsY0FBQTtVQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixzQkFBaEIsRUFBd0MsSUFBeEM7VUFDQSxLQUFBLEdBQVksSUFBQSxRQUFBLENBQVMsUUFBVDtVQUVaLElBQUksQ0FBQyxZQUFMLENBQWtCLEtBQWxCO1VBQ0EsSUFBSSxDQUFDLFlBQUwsQ0FBa0IsS0FBbEI7aUJBQ0EsTUFBQSxDQUFPLElBQUksQ0FBQyxRQUFMLENBQUEsQ0FBZ0IsQ0FBQSxJQUFJLENBQUMsUUFBTCxDQUFBLENBQWUsQ0FBQyxNQUFoQixHQUF5QixDQUF6QixDQUF2QixDQUFtRCxDQUFDLE9BQXBELENBQTRELEtBQTVEO1FBTjJELENBQTdEO01BUmtFLENBQXBFO2FBZ0JBLFFBQUEsQ0FBUywwREFBVCxFQUFxRSxTQUFBO2VBQ25FLEVBQUEsQ0FBRyx1RUFBSCxFQUE0RSxTQUFBO0FBQzFFLGNBQUE7VUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isc0JBQWhCLEVBQXdDLEtBQXhDO1VBQ0EsSUFBSSxDQUFDLFlBQUwsQ0FBa0IsS0FBbEI7VUFDQSxLQUFBLEdBQVksSUFBQSxRQUFBLENBQVMsUUFBVDtVQUNaLElBQUksQ0FBQyxZQUFMLENBQWtCLEtBQWxCO1VBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFPLENBQUMsZ0JBQWYsQ0FBZ0MsTUFBaEMsQ0FBdUMsQ0FBQyxNQUEvQyxDQUFzRCxDQUFDLElBQXZELENBQTRELENBQTVEO2lCQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsVUFBUCxDQUFrQixDQUFsQixDQUFvQixDQUFDLE9BQU8sQ0FBQyxhQUE3QixDQUEyQyxRQUEzQyxDQUFvRCxDQUFDLFdBQTVELENBQXdFLENBQUMsT0FBekUsQ0FBaUYsUUFBakY7UUFOMEUsQ0FBNUU7TUFEbUUsQ0FBckU7SUEvQitDLENBQWpEO0lBd0NBLFFBQUEsQ0FBUyx1Q0FBVCxFQUFrRCxTQUFBO01BQ2hELEVBQUEsQ0FBRyx5Q0FBSCxFQUE4QyxTQUFBO1FBQzVDLElBQUksQ0FBQyxXQUFMLENBQWlCLEtBQWpCO1FBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBZ0IsQ0FBQyxNQUF4QixDQUErQixDQUFDLElBQWhDLENBQXFDLENBQXJDO2VBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBdEIsQ0FBa0MsQ0FBQyxHQUFHLENBQUMsT0FBdkMsQ0FBK0MsUUFBL0M7TUFINEMsQ0FBOUM7YUFLQSxFQUFBLENBQUcsMENBQUgsRUFBK0MsU0FBQTtBQUM3QyxZQUFBO1FBQUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxVQUFQLENBQWtCLEtBQWxCLENBQXdCLENBQUMsT0FBTyxDQUFDLFdBQXhDLENBQW9ELENBQUMsT0FBckQsQ0FBNkQsUUFBN0Q7UUFDQSxLQUFLLENBQUMsU0FBTixHQUFrQjtRQUNsQixNQUFBLEdBQWEsSUFBQSxRQUFBLENBQVMsUUFBVDtRQUNiLE1BQU0sQ0FBQyxTQUFQLEdBQW1CO1FBQ25CLElBQUksQ0FBQyxZQUFMLENBQWtCLE1BQWxCO1FBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxVQUFQLENBQWtCLEtBQWxCLENBQXdCLENBQUMsT0FBTyxDQUFDLFdBQXhDLENBQW9ELENBQUMsT0FBckQsQ0FBNkQsR0FBN0Q7UUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLFVBQVAsQ0FBa0IsTUFBbEIsQ0FBeUIsQ0FBQyxPQUFPLENBQUMsV0FBekMsQ0FBcUQsQ0FBQyxPQUF0RCxDQUE4RCxJQUE5RDtRQUNBLElBQUksQ0FBQyxXQUFMLENBQWlCLE1BQWpCO2VBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxVQUFQLENBQWtCLEtBQWxCLENBQXdCLENBQUMsT0FBTyxDQUFDLFdBQXhDLENBQW9ELENBQUMsT0FBckQsQ0FBNkQsUUFBN0Q7TUFUNkMsQ0FBL0M7SUFOZ0QsQ0FBbEQ7SUFpQkEsUUFBQSxDQUFTLHVCQUFULEVBQWtDLFNBQUE7TUFDaEMsRUFBQSxDQUFHLDREQUFILEVBQWlFLFNBQUE7QUFDL0QsWUFBQTtRQUFBLE9BQU8sQ0FBQyxXQUFSLENBQW9CLE1BQU0sQ0FBQyxPQUEzQjtRQUVBLEtBQUEsQ0FBTSxJQUFOLEVBQVksVUFBWjtRQUVBLEtBQUEsR0FBUSxpQkFBQSxDQUFrQixXQUFsQixFQUErQixNQUFNLENBQUMsVUFBUCxDQUFrQixDQUFsQixDQUFvQixDQUFDLE9BQXBELEVBQTZEO1VBQUEsS0FBQSxFQUFPLENBQVA7U0FBN0Q7UUFLUixNQUFBLENBQU8sSUFBSSxDQUFDLGFBQUwsQ0FBQSxDQUFQLENBQTRCLENBQUMsR0FBRyxDQUFDLElBQWpDLENBQXNDLElBQUksQ0FBQyxRQUFMLENBQUEsQ0FBZ0IsQ0FBQSxDQUFBLENBQXREO1FBQ0EsUUFBQSxDQUFTLFNBQUE7aUJBQ1AsSUFBSSxDQUFDLGFBQUwsQ0FBQSxDQUFBLEtBQXdCLElBQUksQ0FBQyxRQUFMLENBQUEsQ0FBZ0IsQ0FBQSxDQUFBO1FBRGpDLENBQVQ7UUFHQSxJQUFBLENBQUssU0FBQTtVQUNILE1BQUEsQ0FBTyxLQUFLLENBQUMsY0FBYixDQUE0QixDQUFDLEdBQUcsQ0FBQyxnQkFBakMsQ0FBQTtVQUNBLEtBQUEsR0FBUSxpQkFBQSxDQUFrQixXQUFsQixFQUErQixNQUFNLENBQUMsVUFBUCxDQUFrQixDQUFsQixDQUFvQixDQUFDLE9BQXBELEVBQTZEO1lBQUEsS0FBQSxFQUFPLENBQVA7V0FBN0Q7aUJBQ1IsTUFBQSxDQUFPLElBQUksQ0FBQyxhQUFMLENBQUEsQ0FBUCxDQUE0QixDQUFDLEdBQUcsQ0FBQyxJQUFqQyxDQUFzQyxJQUFJLENBQUMsUUFBTCxDQUFBLENBQWdCLENBQUEsQ0FBQSxDQUF0RDtRQUhHLENBQUw7UUFLQSxRQUFBLENBQVMsU0FBQTtpQkFDUCxJQUFJLENBQUMsYUFBTCxDQUFBLENBQUEsS0FBd0IsSUFBSSxDQUFDLFFBQUwsQ0FBQSxDQUFnQixDQUFBLENBQUE7UUFEakMsQ0FBVDtlQUdBLElBQUEsQ0FBSyxTQUFBO1VBQ0gsTUFBQSxDQUFPLEtBQUssQ0FBQyxjQUFiLENBQTRCLENBQUMsR0FBRyxDQUFDLGdCQUFqQyxDQUFBO2lCQUNBLE1BQUEsQ0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQXJCLENBQStCLENBQUMsSUFBaEMsQ0FBcUMsQ0FBckM7UUFGRyxDQUFMO01BdEIrRCxDQUFqRTtNQTBCQSxFQUFBLENBQUcsb0NBQUgsRUFBeUMsU0FBQTtBQUN2QyxZQUFBO1FBQUEsT0FBTyxDQUFDLFdBQVIsQ0FBb0IsTUFBTSxDQUFDLE9BQTNCO1FBRUEsS0FBQSxHQUFRLGlCQUFBLENBQWtCLFdBQWxCLEVBQStCLE1BQU0sQ0FBQyxVQUFQLENBQWtCLE9BQWxCLENBQTBCLENBQUMsT0FBMUQsRUFBbUU7VUFBQSxLQUFBLEVBQU8sQ0FBUDtTQUFuRTtRQUVSLE1BQUEsQ0FBTyxJQUFJLENBQUMsUUFBTCxDQUFBLENBQWUsQ0FBQyxNQUF2QixDQUE4QixDQUFDLElBQS9CLENBQW9DLENBQXBDO1FBQ0EsTUFBQSxDQUFPLElBQUksQ0FBQyxRQUFMLENBQUEsQ0FBZSxDQUFDLE9BQWhCLENBQXdCLE9BQXhCLENBQVAsQ0FBd0MsQ0FBQyxJQUF6QyxDQUE4QyxDQUFDLENBQS9DO1FBQ0EsTUFBQSxDQUFPLE9BQU8sQ0FBQyxTQUFmLENBQXlCLENBQUMsVUFBMUIsQ0FBQTtRQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQWdCLENBQUMsTUFBeEIsQ0FBK0IsQ0FBQyxJQUFoQyxDQUFxQyxDQUFyQztRQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQXRCLENBQWtDLENBQUMsR0FBRyxDQUFDLE9BQXZDLENBQStDLFdBQS9DO2VBRUEsTUFBQSxDQUFPLEtBQUssQ0FBQyxjQUFiLENBQTRCLENBQUMsZ0JBQTdCLENBQUE7TUFYdUMsQ0FBekM7YUFhQSxFQUFBLENBQUcsc0RBQUgsRUFBMkQsU0FBQTtBQUN6RCxZQUFBO1FBQUEsT0FBTyxDQUFDLFdBQVIsQ0FBb0IsTUFBTSxDQUFDLE9BQTNCO1FBRUEsS0FBQSxDQUFNLElBQU4sRUFBWSxVQUFaO1FBRUEsS0FBQSxHQUFRLGlCQUFBLENBQWtCLFdBQWxCLEVBQStCLE1BQU0sQ0FBQyxVQUFQLENBQWtCLENBQWxCLENBQW9CLENBQUMsT0FBcEQsRUFBNkQ7VUFBQSxLQUFBLEVBQU8sQ0FBUDtTQUE3RDtRQUNSLE1BQUEsQ0FBTyxJQUFJLENBQUMsYUFBTCxDQUFBLENBQVAsQ0FBNEIsQ0FBQyxHQUFHLENBQUMsSUFBakMsQ0FBc0MsSUFBSSxDQUFDLFFBQUwsQ0FBQSxDQUFnQixDQUFBLENBQUEsQ0FBdEQ7UUFDQSxNQUFBLENBQU8sS0FBSyxDQUFDLGNBQWIsQ0FBNEIsQ0FBQyxnQkFBN0IsQ0FBQTtRQUVBLEtBQUEsR0FBUSxpQkFBQSxDQUFrQixXQUFsQixFQUErQixNQUFNLENBQUMsVUFBUCxDQUFrQixDQUFsQixDQUFvQixDQUFDLE9BQXBELEVBQTZEO1VBQUEsS0FBQSxFQUFPLENBQVA7VUFBVSxPQUFBLEVBQVMsSUFBbkI7U0FBN0Q7UUFDUixNQUFBLENBQU8sSUFBSSxDQUFDLGFBQUwsQ0FBQSxDQUFQLENBQTRCLENBQUMsR0FBRyxDQUFDLElBQWpDLENBQXNDLElBQUksQ0FBQyxRQUFMLENBQUEsQ0FBZ0IsQ0FBQSxDQUFBLENBQXREO1FBQ0EsTUFBQSxDQUFPLEtBQUssQ0FBQyxjQUFiLENBQTRCLENBQUMsZ0JBQTdCLENBQUE7ZUFFQSxNQUFBLENBQU8sSUFBSSxDQUFDLFFBQVosQ0FBcUIsQ0FBQyxHQUFHLENBQUMsZ0JBQTFCLENBQUE7TUFieUQsQ0FBM0Q7SUF4Q2dDLENBQWxDO0lBdURBLFFBQUEsQ0FBUyxvQ0FBVCxFQUErQyxTQUFBO2FBQzdDLEVBQUEsQ0FBRyxxQ0FBSCxFQUEwQyxTQUFBO1FBQ3hDLE9BQU8sQ0FBQyxXQUFSLENBQW9CLE1BQU0sQ0FBQyxPQUEzQjtRQUVBLE1BQU0sQ0FBQyxVQUFQLENBQWtCLE9BQWxCLENBQTBCLENBQUMsT0FBTyxDQUFDLGFBQW5DLENBQWlELGFBQWpELENBQStELENBQUMsS0FBaEUsQ0FBQTtRQUNBLE1BQUEsQ0FBTyxJQUFJLENBQUMsUUFBTCxDQUFBLENBQWUsQ0FBQyxNQUF2QixDQUE4QixDQUFDLElBQS9CLENBQW9DLENBQXBDO1FBQ0EsTUFBQSxDQUFPLElBQUksQ0FBQyxRQUFMLENBQUEsQ0FBZSxDQUFDLE9BQWhCLENBQXdCLE9BQXhCLENBQVAsQ0FBd0MsQ0FBQyxJQUF6QyxDQUE4QyxDQUFDLENBQS9DO1FBQ0EsTUFBQSxDQUFPLE9BQU8sQ0FBQyxTQUFmLENBQXlCLENBQUMsVUFBMUIsQ0FBQTtRQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQWdCLENBQUMsTUFBeEIsQ0FBK0IsQ0FBQyxJQUFoQyxDQUFxQyxDQUFyQztlQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQXRCLENBQWtDLENBQUMsR0FBRyxDQUFDLE9BQXZDLENBQStDLFdBQS9DO01BUndDLENBQTFDO0lBRDZDLENBQS9DO0lBV0EsUUFBQSxDQUFTLDJCQUFULEVBQXNDLFNBQUE7QUFDcEMsVUFBQTtNQUFDLFFBQVM7TUFDVixVQUFBLENBQVcsU0FBQTtBQUNULFlBQUE7UUFBQSxLQUFBLEdBQVksSUFBQSxRQUFBLENBQVMsUUFBVDtRQUNaLElBQUksQ0FBQyxZQUFMLENBQWtCLEtBQWxCO1FBR0EsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBckIsR0FBK0I7UUFDL0IsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsU0FBckIsR0FBaUM7UUFDakMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBckIsR0FBOEI7UUFFOUIsU0FBQSxHQUFZLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCO1FBQ1osU0FBUyxDQUFDLEtBQUssQ0FBQyxLQUFoQixHQUF3QjtRQUN4QixTQUFTLENBQUMsV0FBVixDQUFzQixNQUFNLENBQUMsT0FBN0I7UUFDQSxPQUFPLENBQUMsV0FBUixDQUFvQixTQUFwQjtlQUdBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQXRCLENBQWtDLENBQUMsZUFBbkMsQ0FBbUQsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFsRTtNQWZTLENBQVg7TUFpQkEsRUFBQSxDQUFHLGdEQUFILEVBQXFELFNBQUE7UUFDbkQsSUFBSSxDQUFDLFlBQUwsQ0FBa0IsS0FBbEI7UUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUF0QixDQUFpQyxDQUFDLElBQWxDLENBQXVDLENBQXZDO1FBRUEsSUFBSSxDQUFDLFlBQUwsQ0FBa0IsT0FBbEI7UUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUF0QixDQUFpQyxDQUFDLElBQWxDLENBQXVDLENBQXZDO1FBRUEsSUFBSSxDQUFDLFlBQUwsQ0FBa0IsS0FBbEI7UUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUF0QixDQUFpQyxDQUFDLElBQWxDLENBQXVDLENBQXZDO1FBRUEsSUFBSSxDQUFDLFlBQUwsQ0FBa0IsS0FBbEI7ZUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUF0QixDQUFpQyxDQUFDLEdBQUcsQ0FBQyxJQUF0QyxDQUEyQyxDQUEzQztNQVhtRCxDQUFyRDthQWFBLEVBQUEsQ0FBRyxzREFBSCxFQUEyRCxTQUFBO1FBQ3pELE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBZixHQUE0QjtRQUM1QixNQUFBLENBQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUF0QixDQUFpQyxDQUFDLElBQWxDLENBQXVDLENBQXZDO1FBRUEsSUFBSSxDQUFDLFlBQUwsQ0FBa0IsS0FBbEI7UUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUF0QixDQUFpQyxDQUFDLElBQWxDLENBQXVDLENBQXZDO1FBRUEsSUFBSSxDQUFDLFlBQUwsQ0FBa0IsS0FBbEI7ZUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUF0QixDQUFpQyxDQUFDLElBQWxDLENBQXVDLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBZixHQUE2QixNQUFNLENBQUMsT0FBTyxDQUFDLFdBQW5GO01BUnlELENBQTNEO0lBaENvQyxDQUF0QztJQTBDQSxRQUFBLENBQVMsaUNBQVQsRUFBNEMsU0FBQTthQUMxQyxFQUFBLENBQUcscUNBQUgsRUFBMEMsU0FBQTtRQUN4QyxPQUFPLENBQUMsTUFBTSxDQUFDLE9BQWYsQ0FBdUIscUJBQXZCO2VBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxVQUFQLENBQWtCLE9BQWxCLENBQTBCLENBQUMsT0FBTyxDQUFDLFdBQTFDLENBQXNELENBQUMsT0FBdkQsQ0FBK0QsVUFBL0Q7TUFGd0MsQ0FBMUM7SUFEMEMsQ0FBNUM7SUFLQSxRQUFBLENBQVMsbUNBQVQsRUFBOEMsU0FBQTthQUM1QyxFQUFBLENBQUcsb0VBQUgsRUFBeUUsU0FBQTtRQUN2RSxLQUFLLENBQUMsS0FBTixHQUFjO1FBQ2QsS0FBSyxDQUFDLFNBQU4sR0FBa0I7UUFDbEIsS0FBSyxDQUFDLGdCQUFOLENBQUE7UUFDQSxLQUFLLENBQUMsS0FBTixHQUFjO1FBQ2QsS0FBSyxDQUFDLFNBQU4sR0FBa0I7UUFDbEIsS0FBSyxDQUFDLGdCQUFOLENBQUE7UUFFQSxNQUFBLENBQU8sTUFBTSxDQUFDLFVBQVAsQ0FBa0IsS0FBbEIsQ0FBd0IsQ0FBQyxPQUFPLENBQUMsV0FBeEMsQ0FBb0QsQ0FBQyxPQUFyRCxDQUE2RCxnQkFBN0Q7UUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLFVBQVAsQ0FBa0IsS0FBbEIsQ0FBd0IsQ0FBQyxPQUFPLENBQUMsV0FBeEMsQ0FBb0QsQ0FBQyxPQUFyRCxDQUE2RCxlQUE3RDtRQUVBLEtBQUssQ0FBQyxTQUFOLEdBQWtCO1FBQ2xCLEtBQUssQ0FBQyxnQkFBTixDQUFBO1FBRUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxVQUFQLENBQWtCLEtBQWxCLENBQXdCLENBQUMsT0FBTyxDQUFDLFdBQXhDLENBQW9ELENBQUMsT0FBckQsQ0FBNkQsZ0JBQTdEO2VBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxVQUFQLENBQWtCLEtBQWxCLENBQXdCLENBQUMsT0FBTyxDQUFDLFdBQXhDLENBQW9ELENBQUMsT0FBckQsQ0FBNkQsU0FBN0Q7TUFmdUUsQ0FBekU7SUFENEMsQ0FBOUM7SUFrQkEsUUFBQSxDQUFTLGtCQUFULEVBQTZCLFNBQUE7TUFDM0IsRUFBQSxDQUFHLHFGQUFILEVBQTBGLFNBQUE7QUFDeEYsWUFBQTtRQUFBLEtBQUEsR0FBWSxJQUFBLFFBQUEsQ0FBUyxRQUFULEVBQW1CLE1BQW5CLEVBQThCLFVBQTlCLEVBQTBDLFdBQTFDO1FBQ1osTUFBQSxDQUFPLEtBQUssQ0FBQyxtQkFBYixDQUFpQyxDQUFDLGFBQWxDLENBQUE7UUFDQSxLQUFBLEdBQVksSUFBQSxRQUFBLENBQVMsUUFBVCxFQUFtQixNQUFuQixFQUE4QixVQUE5QixFQUEwQyxXQUExQyxFQUF1RCxJQUF2RDtRQUNaLE1BQUEsQ0FBTyxPQUFPLEtBQUssQ0FBQyxtQkFBcEIsQ0FBd0MsQ0FBQyxJQUF6QyxDQUE4QyxVQUE5QztRQUNBLEtBQUEsR0FBWSxJQUFBLFFBQUEsQ0FBUyxRQUFULEVBQW1CLE1BQW5CLEVBQThCLFVBQTlCLEVBQTBDLFdBQTFDLEVBQXVELEtBQXZEO1FBQ1osTUFBQSxDQUFPLE9BQU8sS0FBSyxDQUFDLG1CQUFwQixDQUF3QyxDQUFDLElBQXpDLENBQThDLFVBQTlDO1FBQ0EsSUFBSSxDQUFDLFlBQUwsQ0FBa0IsS0FBbEI7UUFDQSxJQUFJLENBQUMsWUFBTCxDQUFrQixLQUFsQjtRQUNBLElBQUksQ0FBQyxZQUFMLENBQWtCLEtBQWxCO1FBQ0EsSUFBQSxHQUFPLE1BQU0sQ0FBQyxPQUFPLENBQUMsZ0JBQWYsQ0FBZ0MsTUFBaEM7UUFDUCxNQUFBLENBQU8sSUFBSyxDQUFBLENBQUEsQ0FBRSxDQUFDLGFBQVIsQ0FBc0IsYUFBdEIsQ0FBUCxDQUE0QyxDQUFDLEdBQUcsQ0FBQyxPQUFqRCxDQUF5RCxJQUF6RDtRQUNBLE1BQUEsQ0FBTyxJQUFLLENBQUEsQ0FBQSxDQUFFLENBQUMsYUFBUixDQUFzQixhQUF0QixDQUFQLENBQTRDLENBQUMsR0FBRyxDQUFDLE9BQWpELENBQXlELElBQXpEO2VBQ0EsTUFBQSxDQUFPLElBQUssQ0FBQSxDQUFBLENBQUUsQ0FBQyxhQUFSLENBQXNCLGFBQXRCLENBQVAsQ0FBNEMsQ0FBQyxHQUFHLENBQUMsT0FBakQsQ0FBeUQsSUFBekQ7TUFid0YsQ0FBMUY7TUFlQSxJQUFjLG1DQUFkO0FBQUEsZUFBQTs7YUFDQSxRQUFBLENBQVMsVUFBVCxFQUFxQixTQUFBO1FBQ25CLFVBQUEsQ0FBVyxTQUFBO1VBQ1QsSUFBQSxHQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBZixDQUFBLENBQTZCLENBQUMsYUFBOUIsQ0FBQTtpQkFDUCxNQUFBLEdBQWEsSUFBQSxVQUFBLENBQVcsSUFBWCxFQUFpQixPQUFqQjtRQUZKLENBQVg7UUFJQSxFQUFBLENBQUcsd0NBQUgsRUFBNkMsU0FBQTtBQUMzQyxjQUFBO1VBQUEsS0FBQSxHQUFZLElBQUEsUUFBQSxDQUFTLFFBQVQsRUFBbUIsTUFBbkIsRUFBOEIsVUFBOUIsRUFBMEMsV0FBMUMsRUFBdUQsSUFBdkQ7VUFDWixNQUFBLENBQU8sT0FBTyxLQUFLLENBQUMsbUJBQXBCLENBQXdDLENBQUMsSUFBekMsQ0FBOEMsVUFBOUM7VUFDQSxJQUFJLENBQUMsWUFBTCxDQUFrQixLQUFsQjtVQUNBLEdBQUEsR0FBTSxNQUFNLENBQUMsT0FBTyxDQUFDLGFBQWYsQ0FBNkIsTUFBN0I7aUJBQ04sTUFBQSxDQUFPLEdBQUcsQ0FBQyxhQUFKLENBQWtCLGFBQWxCLENBQVAsQ0FBd0MsQ0FBQyxPQUF6QyxDQUFpRCxJQUFqRDtRQUwyQyxDQUE3QztRQU9BLEVBQUEsQ0FBRyxzQ0FBSCxFQUEyQyxTQUFBO0FBQ3pDLGNBQUE7VUFBQSxLQUFBLEdBQVksSUFBQSxRQUFBLENBQVMsUUFBVCxFQUFtQixNQUFuQixFQUE4QixVQUE5QixFQUEwQyxXQUExQyxFQUF1RCxLQUF2RDtVQUNaLE1BQUEsQ0FBTyxPQUFPLEtBQUssQ0FBQyxtQkFBcEIsQ0FBd0MsQ0FBQyxJQUF6QyxDQUE4QyxVQUE5QztVQUNBLElBQUksQ0FBQyxZQUFMLENBQWtCLEtBQWxCO1VBQ0EsR0FBQSxHQUFNLE1BQU0sQ0FBQyxPQUFPLENBQUMsYUFBZixDQUE2QixNQUE3QjtpQkFDTixNQUFBLENBQU8sR0FBRyxDQUFDLGFBQUosQ0FBa0IsYUFBbEIsQ0FBUCxDQUF3QyxDQUFDLEdBQUcsQ0FBQyxhQUE3QyxDQUFBO1FBTHlDLENBQTNDO2VBT0EsRUFBQSxDQUFHLHNDQUFILEVBQTJDLFNBQUE7QUFDekMsY0FBQTtVQUFBLEtBQUEsR0FBWSxJQUFBLFFBQUEsQ0FBUyxRQUFULEVBQW1CLE1BQW5CLEVBQThCLFVBQTlCLEVBQTBDLFdBQTFDO1VBQ1osTUFBQSxDQUFPLEtBQUssQ0FBQyxtQkFBYixDQUFpQyxDQUFDLGFBQWxDLENBQUE7VUFDQSxJQUFJLENBQUMsWUFBTCxDQUFrQixLQUFsQjtVQUNBLEdBQUEsR0FBTSxNQUFNLENBQUMsT0FBTyxDQUFDLGFBQWYsQ0FBNkIsTUFBN0I7aUJBQ04sTUFBQSxDQUFPLEdBQUcsQ0FBQyxhQUFKLENBQWtCLGFBQWxCLENBQVAsQ0FBd0MsQ0FBQyxHQUFHLENBQUMsT0FBN0MsQ0FBcUQsSUFBckQ7UUFMeUMsQ0FBM0M7TUFuQm1CLENBQXJCO0lBakIyQixDQUE3QjtJQTJDQSxRQUFBLENBQVMsa0NBQVQsRUFBNkMsU0FBQTtNQUMzQyxFQUFBLENBQUcsOEJBQUgsRUFBbUMsU0FBQTtRQUNqQyxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyxnQkFBZixDQUFnQyxNQUFoQyxDQUF3QyxDQUFBLENBQUEsQ0FBRSxDQUFDLGFBQTNDLENBQXlELFFBQXpELENBQVAsQ0FBMEUsQ0FBQyxXQUEzRSxDQUF1RixNQUF2RjtlQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBTyxDQUFDLGdCQUFmLENBQWdDLE1BQWhDLENBQXdDLENBQUEsQ0FBQSxDQUFFLENBQUMsYUFBM0MsQ0FBeUQsUUFBekQsQ0FBUCxDQUEwRSxDQUFDLFdBQTNFLENBQXVGLGVBQXZGO01BRmlDLENBQW5DO01BSUEsRUFBQSxDQUFHLG9EQUFILEVBQXlELFNBQUE7UUFDdkQsS0FBSyxDQUFDLFdBQU4sR0FBb0I7UUFDcEIsS0FBSyxDQUFDLGVBQU4sQ0FBQTtRQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBTyxDQUFDLGdCQUFmLENBQWdDLE1BQWhDLENBQXdDLENBQUEsQ0FBQSxDQUFFLENBQUMsYUFBM0MsQ0FBeUQsUUFBekQsQ0FBUCxDQUEwRSxDQUFDLEdBQUcsQ0FBQyxXQUEvRSxDQUEyRixNQUEzRjtlQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBTyxDQUFDLGdCQUFmLENBQWdDLE1BQWhDLENBQXdDLENBQUEsQ0FBQSxDQUFFLENBQUMsYUFBM0MsQ0FBeUQsUUFBekQsQ0FBUCxDQUEwRSxDQUFDLEdBQUcsQ0FBQyxXQUEvRSxDQUEyRixlQUEzRjtNQUp1RCxDQUF6RDtNQU1BLEVBQUEsQ0FBRyxvREFBSCxFQUF5RCxTQUFBO1FBQ3ZELEtBQUssQ0FBQyxXQUFOLEdBQW9CLFNBQUE7aUJBQUc7UUFBSDtRQUNwQixLQUFLLENBQUMsZUFBTixDQUFBO1FBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFPLENBQUMsZ0JBQWYsQ0FBZ0MsTUFBaEMsQ0FBd0MsQ0FBQSxDQUFBLENBQUUsQ0FBQyxhQUEzQyxDQUF5RCxRQUF6RCxDQUFQLENBQTBFLENBQUMsV0FBM0UsQ0FBdUYsTUFBdkY7ZUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyxnQkFBZixDQUFnQyxNQUFoQyxDQUF3QyxDQUFBLENBQUEsQ0FBRSxDQUFDLGFBQTNDLENBQXlELFFBQXpELENBQVAsQ0FBMEUsQ0FBQyxXQUEzRSxDQUF1RixVQUF2RjtNQUp1RCxDQUF6RDtNQU1BLFFBQUEsQ0FBUyxrREFBVCxFQUE2RCxTQUFBO1FBQzNELFVBQUEsQ0FBVyxTQUFBO1VBQ1QsS0FBQSxDQUFNLE1BQU0sQ0FBQyxVQUFQLENBQWtCLEtBQWxCLENBQU4sRUFBZ0Msc0JBQWhDLENBQXVELENBQUMsY0FBeEQsQ0FBQTtVQUVBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixnQkFBaEIsRUFBa0MsSUFBbEM7VUFFQSxRQUFBLENBQVMsU0FBQTttQkFDUCxNQUFNLENBQUMsVUFBUCxDQUFrQixLQUFsQixDQUF3QixDQUFDLG9CQUFvQixDQUFDLFNBQTlDLEdBQTBEO1VBRG5ELENBQVQ7aUJBR0EsSUFBQSxDQUFLLFNBQUE7bUJBQ0gsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsS0FBbEIsQ0FBd0IsQ0FBQyxvQkFBb0IsQ0FBQyxLQUE5QyxDQUFBO1VBREcsQ0FBTDtRQVJTLENBQVg7UUFXQSxFQUFBLENBQUcsdUJBQUgsRUFBNEIsU0FBQTtpQkFDMUIsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFPLENBQUMsZ0JBQWYsQ0FBZ0MsTUFBaEMsQ0FBd0MsQ0FBQSxDQUFBLENBQUUsQ0FBQyxhQUEzQyxDQUF5RCxRQUF6RCxDQUFQLENBQTBFLENBQUMsR0FBRyxDQUFDLFdBQS9FLENBQTJGLFdBQTNGO1FBRDBCLENBQTVCO2VBR0EsRUFBQSxDQUFHLCtEQUFILEVBQW9FLFNBQUE7VUFDbEUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGdCQUFoQixFQUFrQyxLQUFsQztVQUVBLFFBQUEsQ0FBUyxTQUFBO21CQUNQLE1BQU0sQ0FBQyxVQUFQLENBQWtCLEtBQWxCLENBQXdCLENBQUMsb0JBQW9CLENBQUMsU0FBOUMsR0FBMEQ7VUFEbkQsQ0FBVDtpQkFHQSxJQUFBLENBQUssU0FBQTttQkFDSCxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyxnQkFBZixDQUFnQyxNQUFoQyxDQUF3QyxDQUFBLENBQUEsQ0FBRSxDQUFDLGFBQTNDLENBQXlELFFBQXpELENBQVAsQ0FBMEUsQ0FBQyxXQUEzRSxDQUF1RixXQUF2RjtVQURHLENBQUw7UUFOa0UsQ0FBcEU7TUFmMkQsQ0FBN0Q7YUF3QkEsUUFBQSxDQUFTLG1EQUFULEVBQThELFNBQUE7UUFDNUQsVUFBQSxDQUFXLFNBQUE7VUFDVCxLQUFBLENBQU0sTUFBTSxDQUFDLFVBQVAsQ0FBa0IsS0FBbEIsQ0FBTixFQUFnQyxzQkFBaEMsQ0FBdUQsQ0FBQyxjQUF4RCxDQUFBO1VBRUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGdCQUFoQixFQUFrQyxLQUFsQztVQUVBLFFBQUEsQ0FBUyxTQUFBO21CQUNQLE1BQU0sQ0FBQyxVQUFQLENBQWtCLEtBQWxCLENBQXdCLENBQUMsb0JBQW9CLENBQUMsU0FBOUMsR0FBMEQ7VUFEbkQsQ0FBVDtpQkFHQSxJQUFBLENBQUssU0FBQTttQkFDSCxNQUFNLENBQUMsVUFBUCxDQUFrQixLQUFsQixDQUF3QixDQUFDLG9CQUFvQixDQUFDLEtBQTlDLENBQUE7VUFERyxDQUFMO1FBUlMsQ0FBWDtRQVdBLEVBQUEsQ0FBRyxnQkFBSCxFQUFxQixTQUFBO2lCQUNuQixNQUFBLENBQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyxnQkFBZixDQUFnQyxNQUFoQyxDQUF3QyxDQUFBLENBQUEsQ0FBRSxDQUFDLGFBQTNDLENBQXlELFFBQXpELENBQVAsQ0FBMEUsQ0FBQyxXQUEzRSxDQUF1RixXQUF2RjtRQURtQixDQUFyQjtlQUdBLEVBQUEsQ0FBRyw0REFBSCxFQUFpRSxTQUFBO1VBQy9ELElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixnQkFBaEIsRUFBa0MsSUFBbEM7VUFFQSxRQUFBLENBQVMsU0FBQTttQkFDUCxNQUFNLENBQUMsVUFBUCxDQUFrQixLQUFsQixDQUF3QixDQUFDLG9CQUFvQixDQUFDLFNBQTlDLEdBQTBEO1VBRG5ELENBQVQ7aUJBR0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFPLENBQUMsZ0JBQWYsQ0FBZ0MsTUFBaEMsQ0FBd0MsQ0FBQSxDQUFBLENBQUUsQ0FBQyxhQUEzQyxDQUF5RCxRQUF6RCxDQUFQLENBQTBFLENBQUMsR0FBRyxDQUFDLFdBQS9FLENBQTJGLFdBQTNGO1FBTitELENBQWpFO01BZjRELENBQTlEO0lBekMyQyxDQUE3QztJQWdFQSxRQUFBLENBQVMsNENBQVQsRUFBdUQsU0FBQTtNQUNyRCxFQUFBLENBQUcsb0NBQUgsRUFBeUMsU0FBQTtRQUN2QyxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyxnQkFBZixDQUFnQyxNQUFoQyxDQUF3QyxDQUFBLENBQUEsQ0FBRSxDQUFDLGFBQTNDLENBQXlELFFBQXpELENBQVAsQ0FBMEUsQ0FBQyxHQUFHLENBQUMsV0FBL0UsQ0FBMkYsTUFBM0Y7ZUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyxnQkFBZixDQUFnQyxNQUFoQyxDQUF3QyxDQUFBLENBQUEsQ0FBRSxDQUFDLGFBQTNDLENBQXlELFFBQXpELENBQVAsQ0FBMEUsQ0FBQyxHQUFHLENBQUMsV0FBL0UsQ0FBMkYsZUFBM0Y7TUFGdUMsQ0FBekM7YUFJQSxFQUFBLENBQUcsaURBQUgsRUFBc0QsU0FBQTtRQUNwRCxLQUFLLENBQUMsV0FBTixHQUFvQixTQUFBO2lCQUFHO1FBQUg7UUFDcEIsS0FBSyxDQUFDLGVBQU4sQ0FBQTtRQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBTyxDQUFDLGdCQUFmLENBQWdDLE1BQWhDLENBQXdDLENBQUEsQ0FBQSxDQUFFLENBQUMsYUFBM0MsQ0FBeUQsUUFBekQsQ0FBUCxDQUEwRSxDQUFDLFdBQTNFLENBQXVGLE1BQXZGO2VBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFPLENBQUMsZ0JBQWYsQ0FBZ0MsTUFBaEMsQ0FBd0MsQ0FBQSxDQUFBLENBQUUsQ0FBQyxhQUEzQyxDQUF5RCxRQUF6RCxDQUFQLENBQTBFLENBQUMsV0FBM0UsQ0FBdUYsZUFBdkY7TUFKb0QsQ0FBdEQ7SUFMcUQsQ0FBdkQ7SUFXQSxRQUFBLENBQVMsMkNBQVQsRUFBc0QsU0FBQTthQUNwRCxFQUFBLENBQUcscUVBQUgsRUFBMEUsU0FBQTtBQUN4RSxZQUFBO1FBQUEsR0FBQSxHQUFNLE1BQU0sQ0FBQyxVQUFQLENBQWtCLE9BQWxCO1FBQ04sTUFBQSxDQUFPLE9BQU8sQ0FBQyxVQUFSLENBQUEsQ0FBUCxDQUE0QixDQUFDLFNBQTdCLENBQUE7UUFDQSxNQUFBLENBQU8sR0FBRyxDQUFDLE9BQVgsQ0FBbUIsQ0FBQyxHQUFHLENBQUMsV0FBeEIsQ0FBb0MsVUFBcEM7UUFFQSxPQUFPLENBQUMsVUFBUixDQUFtQixHQUFuQjtRQUNBLFlBQUEsQ0FBYSxPQUFPLENBQUMsTUFBTSxDQUFDLG9CQUE1QjtRQUNBLE1BQUEsQ0FBTyxPQUFPLENBQUMsVUFBUixDQUFBLENBQVAsQ0FBNEIsQ0FBQyxVQUE3QixDQUFBO1FBQ0EsTUFBQSxDQUFPLEdBQUcsQ0FBQyxPQUFYLENBQW1CLENBQUMsV0FBcEIsQ0FBZ0MsVUFBaEM7UUFFQSxPQUFPLENBQUMsSUFBUixDQUFBO1FBQ0EsWUFBQSxDQUFhLE9BQU8sQ0FBQyxNQUFNLENBQUMsb0JBQTVCO1FBQ0EsTUFBQSxDQUFPLE9BQU8sQ0FBQyxVQUFSLENBQUEsQ0FBUCxDQUE0QixDQUFDLFNBQTdCLENBQUE7ZUFDQSxNQUFBLENBQU8sR0FBRyxDQUFDLE9BQVgsQ0FBbUIsQ0FBQyxHQUFHLENBQUMsV0FBeEIsQ0FBb0MsVUFBcEM7TUFid0UsQ0FBMUU7SUFEb0QsQ0FBdEQ7SUFnQkEsUUFBQSxDQUFTLHVDQUFULEVBQWtELFNBQUE7TUFFaEQsUUFBQSxDQUFTLHlEQUFULEVBQW9FLFNBQUE7ZUFDbEUsRUFBQSxDQUFHLDJEQUFILEVBQWdFLFNBQUE7VUFDOUQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHNCQUFoQixFQUF3QyxJQUF4QztVQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQWdCLENBQUMsR0FBakIsQ0FBcUIsU0FBQyxHQUFEO21CQUFTLEdBQUcsQ0FBQyxPQUFPLENBQUM7VUFBckIsQ0FBckIsQ0FBUCxDQUE2RCxDQUFDLE9BQTlELENBQXNFLENBQUMsUUFBRCxFQUFXLFdBQVgsRUFBd0IsUUFBeEIsQ0FBdEU7VUFDQSxJQUFJLENBQUMsUUFBTCxDQUFjLEtBQWQsRUFBcUIsQ0FBckI7VUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFnQixDQUFDLEdBQWpCLENBQXFCLFNBQUMsR0FBRDttQkFBUyxHQUFHLENBQUMsT0FBTyxDQUFDO1VBQXJCLENBQXJCLENBQVAsQ0FBNkQsQ0FBQyxPQUE5RCxDQUFzRSxDQUFDLFFBQUQsRUFBVyxRQUFYLEVBQXFCLFdBQXJCLENBQXRFO1VBQ0EsSUFBSSxDQUFDLFFBQUwsQ0FBYyxPQUFkLEVBQXVCLENBQXZCO1VBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBZ0IsQ0FBQyxHQUFqQixDQUFxQixTQUFDLEdBQUQ7bUJBQVMsR0FBRyxDQUFDLE9BQU8sQ0FBQztVQUFyQixDQUFyQixDQUFQLENBQTZELENBQUMsT0FBOUQsQ0FBc0UsQ0FBQyxXQUFELEVBQWMsUUFBZCxFQUF3QixRQUF4QixDQUF0RTtVQUNBLElBQUksQ0FBQyxRQUFMLENBQWMsS0FBZCxFQUFxQixDQUFyQjtpQkFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFnQixDQUFDLEdBQWpCLENBQXFCLFNBQUMsR0FBRDttQkFBUyxHQUFHLENBQUMsT0FBTyxDQUFDO1VBQXJCLENBQXJCLENBQVAsQ0FBNkQsQ0FBQyxPQUE5RCxDQUFzRSxDQUFDLFdBQUQsRUFBYyxRQUFkLEVBQXdCLFFBQXhCLENBQXRFO1FBUjhELENBQWhFO01BRGtFLENBQXBFO2FBV0EsUUFBQSxDQUFTLDBEQUFULEVBQXFFLFNBQUE7ZUFDbkUsRUFBQSxDQUFHLDJEQUFILEVBQWdFLFNBQUE7VUFDOUQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHNCQUFoQixFQUF3QyxLQUF4QztVQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQWdCLENBQUMsR0FBakIsQ0FBcUIsU0FBQyxHQUFEO21CQUFTLEdBQUcsQ0FBQyxPQUFPLENBQUM7VUFBckIsQ0FBckIsQ0FBUCxDQUE2RCxDQUFDLE9BQTlELENBQXNFLENBQUMsUUFBRCxFQUFXLFdBQVgsRUFBd0IsUUFBeEIsQ0FBdEU7VUFDQSxJQUFJLENBQUMsUUFBTCxDQUFjLEtBQWQsRUFBcUIsQ0FBckI7VUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFnQixDQUFDLEdBQWpCLENBQXFCLFNBQUMsR0FBRDttQkFBUyxHQUFHLENBQUMsT0FBTyxDQUFDO1VBQXJCLENBQXJCLENBQVAsQ0FBNkQsQ0FBQyxPQUE5RCxDQUFzRSxDQUFDLFFBQUQsRUFBVyxRQUFYLEVBQXFCLFdBQXJCLENBQXRFO1VBQ0EsSUFBSSxDQUFDLFFBQUwsQ0FBYyxPQUFkLEVBQXVCLENBQXZCO1VBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBZ0IsQ0FBQyxHQUFqQixDQUFxQixTQUFDLEdBQUQ7bUJBQVMsR0FBRyxDQUFDLE9BQU8sQ0FBQztVQUFyQixDQUFyQixDQUFQLENBQTZELENBQUMsT0FBOUQsQ0FBc0UsQ0FBQyxXQUFELEVBQWMsUUFBZCxFQUF3QixRQUF4QixDQUF0RTtVQUNBLElBQUksQ0FBQyxRQUFMLENBQWMsS0FBZCxFQUFxQixDQUFyQjtpQkFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFnQixDQUFDLEdBQWpCLENBQXFCLFNBQUMsR0FBRDttQkFBUyxHQUFHLENBQUMsT0FBTyxDQUFDO1VBQXJCLENBQXJCLENBQVAsQ0FBNkQsQ0FBQyxPQUE5RCxDQUFzRSxDQUFDLFdBQUQsRUFBYyxRQUFkLEVBQXdCLFFBQXhCLENBQXRFO1FBUjhELENBQWhFO01BRG1FLENBQXJFO0lBYmdELENBQWxEO0lBd0JBLFFBQUEsQ0FBUyx1QkFBVCxFQUFrQyxTQUFBO01BQ2hDLFVBQUEsQ0FBVyxTQUFBO0FBQ1QsWUFBQTtRQUFBLFdBQUEsR0FBYyxJQUFJLENBQUMsVUFBTCxDQUFBO2VBQ2QsV0FBVyxDQUFDLFlBQVosQ0FBeUIsTUFBTSxDQUFDLE9BQWhDLEVBQXlDLFdBQVcsQ0FBQyxVQUFyRDtNQUZTLENBQVg7TUFJQSxRQUFBLENBQVMsOEJBQVQsRUFBeUMsU0FBQTtlQUN2QyxFQUFBLENBQUcsdUJBQUgsRUFBNEIsU0FBQTtVQUMxQixpQkFBQSxDQUFrQixXQUFsQixFQUErQixNQUFNLENBQUMsVUFBUCxDQUFrQixLQUFsQixDQUF3QixDQUFDLE9BQXhELEVBQWlFO1lBQUEsS0FBQSxFQUFPLENBQVA7V0FBakU7VUFDQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsTUFBTSxDQUFDLE9BQTlCLEVBQXVDLGdCQUF2QztVQUNBLE1BQUEsQ0FBTyxJQUFJLENBQUMsUUFBTCxDQUFBLENBQWUsQ0FBQyxNQUF2QixDQUE4QixDQUFDLElBQS9CLENBQW9DLENBQXBDO1VBQ0EsTUFBQSxDQUFPLElBQUksQ0FBQyxRQUFMLENBQUEsQ0FBZSxDQUFDLE9BQWhCLENBQXdCLEtBQXhCLENBQVAsQ0FBc0MsQ0FBQyxJQUF2QyxDQUE0QyxDQUFDLENBQTdDO1VBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBZ0IsQ0FBQyxNQUF4QixDQUErQixDQUFDLElBQWhDLENBQXFDLENBQXJDO2lCQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQXRCLENBQWtDLENBQUMsR0FBRyxDQUFDLE9BQXZDLENBQStDLFFBQS9DO1FBTjBCLENBQTVCO01BRHVDLENBQXpDO01BU0EsUUFBQSxDQUFTLHFDQUFULEVBQWdELFNBQUE7ZUFDOUMsRUFBQSxDQUFHLDZDQUFILEVBQWtELFNBQUE7VUFDaEQsaUJBQUEsQ0FBa0IsV0FBbEIsRUFBK0IsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsS0FBbEIsQ0FBd0IsQ0FBQyxPQUF4RCxFQUFpRTtZQUFBLEtBQUEsRUFBTyxDQUFQO1dBQWpFO1VBQ0EsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLE1BQU0sQ0FBQyxPQUE5QixFQUF1Qyx1QkFBdkM7VUFDQSxNQUFBLENBQU8sSUFBSSxDQUFDLFFBQUwsQ0FBQSxDQUFlLENBQUMsTUFBdkIsQ0FBOEIsQ0FBQyxJQUEvQixDQUFvQyxDQUFwQztVQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQWdCLENBQUMsTUFBeEIsQ0FBK0IsQ0FBQyxJQUFoQyxDQUFxQyxDQUFyQztVQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQXRCLENBQWtDLENBQUMsR0FBRyxDQUFDLE9BQXZDLENBQStDLFdBQS9DO2lCQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQXRCLENBQWtDLENBQUMsT0FBbkMsQ0FBMkMsUUFBM0M7UUFOZ0QsQ0FBbEQ7TUFEOEMsQ0FBaEQ7TUFTQSxRQUFBLENBQVMsd0NBQVQsRUFBbUQsU0FBQTtlQUNqRCxFQUFBLENBQUcscURBQUgsRUFBMEQsU0FBQTtVQUN4RCxJQUFJLENBQUMsWUFBTCxDQUFrQixPQUFsQjtVQUNBLGlCQUFBLENBQWtCLFdBQWxCLEVBQStCLE1BQU0sQ0FBQyxVQUFQLENBQWtCLE9BQWxCLENBQTBCLENBQUMsT0FBMUQsRUFBbUU7WUFBQSxLQUFBLEVBQU8sQ0FBUDtXQUFuRTtVQUNBLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixNQUFNLENBQUMsT0FBOUIsRUFBdUMsMEJBQXZDO1VBQ0EsTUFBQSxDQUFPLElBQUksQ0FBQyxRQUFMLENBQUEsQ0FBZSxDQUFDLE1BQXZCLENBQThCLENBQUMsSUFBL0IsQ0FBb0MsQ0FBcEM7VUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFnQixDQUFDLE1BQXhCLENBQStCLENBQUMsSUFBaEMsQ0FBcUMsQ0FBckM7VUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUF0QixDQUFrQyxDQUFDLEdBQUcsQ0FBQyxPQUF2QyxDQUErQyxRQUEvQztpQkFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUF0QixDQUFrQyxDQUFDLE9BQW5DLENBQTJDLFFBQTNDO1FBUHdELENBQTFEO01BRGlELENBQW5EO01BVUEsUUFBQSxDQUFTLHVDQUFULEVBQWtELFNBQUE7ZUFDaEQsRUFBQSxDQUFHLG9EQUFILEVBQXlELFNBQUE7VUFDdkQsSUFBSSxDQUFDLFlBQUwsQ0FBa0IsT0FBbEI7VUFDQSxpQkFBQSxDQUFrQixXQUFsQixFQUErQixNQUFNLENBQUMsVUFBUCxDQUFrQixPQUFsQixDQUEwQixDQUFDLE9BQTFELEVBQW1FO1lBQUEsS0FBQSxFQUFPLENBQVA7V0FBbkU7VUFDQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsTUFBTSxDQUFDLE9BQTlCLEVBQXVDLHlCQUF2QztVQUNBLE1BQUEsQ0FBTyxJQUFJLENBQUMsUUFBTCxDQUFBLENBQWUsQ0FBQyxNQUF2QixDQUE4QixDQUFDLElBQS9CLENBQW9DLENBQXBDO1VBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBZ0IsQ0FBQyxNQUF4QixDQUErQixDQUFDLElBQWhDLENBQXFDLENBQXJDO1VBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBdEIsQ0FBa0MsQ0FBQyxPQUFuQyxDQUEyQyxRQUEzQztpQkFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUF0QixDQUFrQyxDQUFDLEdBQUcsQ0FBQyxPQUF2QyxDQUErQyxRQUEvQztRQVB1RCxDQUF6RDtNQURnRCxDQUFsRDtNQVVBLFFBQUEsQ0FBUyxtQ0FBVCxFQUE4QyxTQUFBO2VBQzVDLEVBQUEsQ0FBRyxxQkFBSCxFQUEwQixTQUFBO1VBQ3hCLE1BQUEsQ0FBTyxJQUFJLENBQUMsUUFBTCxDQUFBLENBQWUsQ0FBQyxNQUF2QixDQUE4QixDQUFDLGVBQS9CLENBQStDLENBQS9DO1VBQ0EsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLE1BQU0sQ0FBQyxPQUE5QixFQUF1QyxxQkFBdkM7aUJBQ0EsTUFBQSxDQUFPLElBQUksQ0FBQyxRQUFMLENBQUEsQ0FBZSxDQUFDLE1BQXZCLENBQThCLENBQUMsSUFBL0IsQ0FBb0MsQ0FBcEM7UUFId0IsQ0FBMUI7TUFENEMsQ0FBOUM7TUFNQSxRQUFBLENBQVMscUNBQVQsRUFBZ0QsU0FBQTtlQUM5QyxFQUFBLENBQUcsMkJBQUgsRUFBZ0MsU0FBQTtVQUM5QixLQUFLLENBQUMsVUFBTixHQUFtQixTQUFBO21CQUFHO1VBQUg7VUFDbkIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLE1BQU0sQ0FBQyxPQUE5QixFQUF1Qyx1QkFBdkM7VUFDQSxNQUFBLENBQU8sSUFBSSxDQUFDLFFBQUwsQ0FBQSxDQUFlLENBQUMsTUFBdkIsQ0FBOEIsQ0FBQyxJQUEvQixDQUFvQyxDQUFwQztpQkFDQSxNQUFBLENBQU8sSUFBSSxDQUFDLFFBQUwsQ0FBQSxDQUFnQixDQUFBLENBQUEsQ0FBdkIsQ0FBMEIsQ0FBQyxJQUEzQixDQUFnQyxLQUFoQztRQUo4QixDQUFoQztNQUQ4QyxDQUFoRDtNQU9BLFFBQUEsQ0FBUyw2QkFBVCxFQUF3QyxTQUFBO2VBQ3RDLEVBQUEsQ0FBRyw0QkFBSCxFQUFpQyxTQUFBO1VBQy9CLGlCQUFBLENBQWtCLFdBQWxCLEVBQStCLE1BQU0sQ0FBQyxVQUFQLENBQWtCLEtBQWxCLENBQXdCLENBQUMsT0FBeEQsRUFBaUU7WUFBQSxLQUFBLEVBQU8sQ0FBUDtXQUFqRTtVQUNBLE1BQUEsQ0FBTyxTQUFBLENBQUEsQ0FBVyxDQUFDLFFBQVosQ0FBQSxDQUFzQixDQUFDLE1BQTlCLENBQXFDLENBQUMsSUFBdEMsQ0FBMkMsQ0FBM0M7VUFFQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsTUFBTSxDQUFDLE9BQTlCLEVBQXVDLGVBQXZDO1VBQ0EsTUFBQSxDQUFPLFNBQUEsQ0FBQSxDQUFXLENBQUMsUUFBWixDQUFBLENBQXNCLENBQUMsTUFBOUIsQ0FBcUMsQ0FBQyxJQUF0QyxDQUEyQyxDQUEzQztVQUNBLE1BQUEsQ0FBTyxTQUFBLENBQUEsQ0FBVyxDQUFDLFFBQVosQ0FBQSxDQUF1QixDQUFBLENBQUEsQ0FBOUIsQ0FBaUMsQ0FBQyxJQUFsQyxDQUF1QyxJQUF2QztpQkFDQSxNQUFBLENBQU8sU0FBQSxDQUFBLENBQVcsQ0FBQyxRQUFaLENBQUEsQ0FBdUIsQ0FBQSxDQUFBLENBQUUsQ0FBQyxRQUExQixDQUFBLENBQXFDLENBQUEsQ0FBQSxDQUFFLENBQUMsUUFBeEMsQ0FBQSxDQUFQLENBQTBELENBQUMsSUFBM0QsQ0FBZ0UsS0FBSyxDQUFDLFFBQU4sQ0FBQSxDQUFoRTtRQVArQixDQUFqQztNQURzQyxDQUF4QztNQVVBLFFBQUEsQ0FBUywrQkFBVCxFQUEwQyxTQUFBO2VBQ3hDLEVBQUEsQ0FBRyw4QkFBSCxFQUFtQyxTQUFBO1VBQ2pDLGlCQUFBLENBQWtCLFdBQWxCLEVBQStCLE1BQU0sQ0FBQyxVQUFQLENBQWtCLEtBQWxCLENBQXdCLENBQUMsT0FBeEQsRUFBaUU7WUFBQSxLQUFBLEVBQU8sQ0FBUDtXQUFqRTtVQUNBLE1BQUEsQ0FBTyxTQUFBLENBQUEsQ0FBVyxDQUFDLFFBQVosQ0FBQSxDQUFzQixDQUFDLE1BQTlCLENBQXFDLENBQUMsSUFBdEMsQ0FBMkMsQ0FBM0M7VUFFQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsTUFBTSxDQUFDLE9BQTlCLEVBQXVDLGlCQUF2QztVQUNBLE1BQUEsQ0FBTyxTQUFBLENBQUEsQ0FBVyxDQUFDLFFBQVosQ0FBQSxDQUFzQixDQUFDLE1BQTlCLENBQXFDLENBQUMsSUFBdEMsQ0FBMkMsQ0FBM0M7VUFDQSxNQUFBLENBQU8sU0FBQSxDQUFBLENBQVcsQ0FBQyxRQUFaLENBQUEsQ0FBdUIsQ0FBQSxDQUFBLENBQTlCLENBQWlDLENBQUMsSUFBbEMsQ0FBdUMsSUFBdkM7aUJBQ0EsTUFBQSxDQUFPLFNBQUEsQ0FBQSxDQUFXLENBQUMsUUFBWixDQUFBLENBQXVCLENBQUEsQ0FBQSxDQUFFLENBQUMsUUFBMUIsQ0FBQSxDQUFxQyxDQUFBLENBQUEsQ0FBRSxDQUFDLFFBQXhDLENBQUEsQ0FBUCxDQUEwRCxDQUFDLElBQTNELENBQWdFLEtBQUssQ0FBQyxRQUFOLENBQUEsQ0FBaEU7UUFQaUMsQ0FBbkM7TUFEd0MsQ0FBMUM7TUFVQSxRQUFBLENBQVMsK0JBQVQsRUFBMEMsU0FBQTtlQUN4QyxFQUFBLENBQUcscUNBQUgsRUFBMEMsU0FBQTtVQUN4QyxpQkFBQSxDQUFrQixXQUFsQixFQUErQixNQUFNLENBQUMsVUFBUCxDQUFrQixLQUFsQixDQUF3QixDQUFDLE9BQXhELEVBQWlFO1lBQUEsS0FBQSxFQUFPLENBQVA7V0FBakU7VUFDQSxNQUFBLENBQU8sU0FBQSxDQUFBLENBQVcsQ0FBQyxRQUFaLENBQUEsQ0FBc0IsQ0FBQyxNQUE5QixDQUFxQyxDQUFDLElBQXRDLENBQTJDLENBQTNDO1VBRUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLE1BQU0sQ0FBQyxPQUE5QixFQUF1QyxpQkFBdkM7VUFDQSxNQUFBLENBQU8sU0FBQSxDQUFBLENBQVcsQ0FBQyxRQUFaLENBQUEsQ0FBc0IsQ0FBQyxNQUE5QixDQUFxQyxDQUFDLElBQXRDLENBQTJDLENBQTNDO1VBQ0EsTUFBQSxDQUFPLFNBQUEsQ0FBQSxDQUFXLENBQUMsUUFBWixDQUFBLENBQXVCLENBQUEsQ0FBQSxDQUE5QixDQUFpQyxDQUFDLElBQWxDLENBQXVDLElBQXZDO2lCQUNBLE1BQUEsQ0FBTyxTQUFBLENBQUEsQ0FBVyxDQUFDLFFBQVosQ0FBQSxDQUF1QixDQUFBLENBQUEsQ0FBRSxDQUFDLFFBQTFCLENBQUEsQ0FBcUMsQ0FBQSxDQUFBLENBQUUsQ0FBQyxRQUF4QyxDQUFBLENBQVAsQ0FBMEQsQ0FBQyxJQUEzRCxDQUFnRSxLQUFLLENBQUMsUUFBTixDQUFBLENBQWhFO1FBUHdDLENBQTFDO01BRHdDLENBQTFDO01BVUEsUUFBQSxDQUFTLGdDQUFULEVBQTJDLFNBQUE7ZUFDekMsRUFBQSxDQUFHLHNDQUFILEVBQTJDLFNBQUE7VUFDekMsaUJBQUEsQ0FBa0IsV0FBbEIsRUFBK0IsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsS0FBbEIsQ0FBd0IsQ0FBQyxPQUF4RCxFQUFpRTtZQUFBLEtBQUEsRUFBTyxDQUFQO1dBQWpFO1VBQ0EsTUFBQSxDQUFPLFNBQUEsQ0FBQSxDQUFXLENBQUMsUUFBWixDQUFBLENBQXNCLENBQUMsTUFBOUIsQ0FBcUMsQ0FBQyxJQUF0QyxDQUEyQyxDQUEzQztVQUVBLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixNQUFNLENBQUMsT0FBOUIsRUFBdUMsa0JBQXZDO1VBQ0EsTUFBQSxDQUFPLFNBQUEsQ0FBQSxDQUFXLENBQUMsUUFBWixDQUFBLENBQXNCLENBQUMsTUFBOUIsQ0FBcUMsQ0FBQyxJQUF0QyxDQUEyQyxDQUEzQztVQUNBLE1BQUEsQ0FBTyxTQUFBLENBQUEsQ0FBVyxDQUFDLFFBQVosQ0FBQSxDQUF1QixDQUFBLENBQUEsQ0FBOUIsQ0FBaUMsQ0FBQyxJQUFsQyxDQUF1QyxJQUF2QztpQkFDQSxNQUFBLENBQU8sU0FBQSxDQUFBLENBQVcsQ0FBQyxRQUFaLENBQUEsQ0FBdUIsQ0FBQSxDQUFBLENBQUUsQ0FBQyxRQUExQixDQUFBLENBQXFDLENBQUEsQ0FBQSxDQUFFLENBQUMsUUFBeEMsQ0FBQSxDQUFQLENBQTBELENBQUMsSUFBM0QsQ0FBZ0UsS0FBSyxDQUFDLFFBQU4sQ0FBQSxDQUFoRTtRQVB5QyxDQUEzQztNQUR5QyxDQUEzQzthQVVBLFFBQUEsQ0FBUyx1Q0FBVCxFQUFrRCxTQUFBO1FBQ2hELFFBQUEsQ0FBUyw0QkFBVCxFQUF1QyxTQUFBO1VBQ3JDLFVBQUEsQ0FBVyxTQUFBO1lBQ1QsaUJBQUEsQ0FBa0IsV0FBbEIsRUFBK0IsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsS0FBbEIsQ0FBd0IsQ0FBQyxPQUF4RCxFQUFpRTtjQUFBLEtBQUEsRUFBTyxDQUFQO2FBQWpFO21CQUNBLE1BQUEsQ0FBTyxTQUFBLENBQUEsQ0FBVyxDQUFDLFFBQVosQ0FBQSxDQUFzQixDQUFDLE1BQTlCLENBQXFDLENBQUMsSUFBdEMsQ0FBMkMsQ0FBM0M7VUFGUyxDQUFYO2lCQUlBLEVBQUEsQ0FBRyxzQ0FBSCxFQUEyQyxTQUFBO1lBQ3pDLEtBQUEsQ0FBTSxJQUFOLEVBQVksTUFBWjtZQUNBLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixNQUFNLENBQUMsT0FBOUIsRUFBdUMseUJBQXZDO1lBQ0EsTUFBQSxDQUFPLElBQUksQ0FBQyxJQUFaLENBQWlCLENBQUMsZ0JBQWxCLENBQUE7WUFFQSxNQUFBLENBQU8sSUFBSSxDQUFDLFFBQUwsQ0FBQSxDQUFlLENBQUMsTUFBdkIsQ0FBOEIsQ0FBQyxJQUEvQixDQUFvQyxDQUFwQztZQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQWdCLENBQUMsTUFBeEIsQ0FBK0IsQ0FBQyxJQUFoQyxDQUFxQyxDQUFyQztZQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQXRCLENBQWtDLENBQUMsT0FBbkMsQ0FBMkMsUUFBM0M7bUJBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBdEIsQ0FBa0MsQ0FBQyxHQUFHLENBQUMsT0FBdkMsQ0FBK0MsUUFBL0M7VUFSeUMsQ0FBM0M7UUFMcUMsQ0FBdkM7ZUFlQSxRQUFBLENBQVMsMEJBQVQsRUFBcUMsU0FBQTtpQkFHbkMsRUFBQSxDQUFHLGNBQUgsRUFBbUIsU0FBQTtZQUNqQixLQUFBLENBQU0sSUFBTixFQUFZLE1BQVo7WUFDQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsTUFBTSxDQUFDLE9BQTlCLEVBQXVDLHlCQUF2QzttQkFDQSxNQUFBLENBQU8sSUFBSSxDQUFDLElBQVosQ0FBaUIsQ0FBQyxHQUFHLENBQUMsZ0JBQXRCLENBQUE7VUFIaUIsQ0FBbkI7UUFIbUMsQ0FBckM7TUFoQmdELENBQWxEO0lBaEdnQyxDQUFsQztJQXdIQSxRQUFBLENBQVMsMEJBQVQsRUFBcUMsU0FBQTtBQUNuQyxVQUFBO01BQUEsV0FBQSxHQUFjO01BRWQsVUFBQSxDQUFXLFNBQUE7ZUFDVCxXQUFBLEdBQWMsSUFBSSxDQUFDLFVBQUwsQ0FBQTtNQURMLENBQVg7TUFHQSxRQUFBLENBQVMsOEJBQVQsRUFBeUMsU0FBQTtRQUN2QyxFQUFBLENBQUcsdUJBQUgsRUFBNEIsU0FBQTtVQUMxQixJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsV0FBdkIsRUFBb0MsZ0JBQXBDO1VBQ0EsTUFBQSxDQUFPLElBQUksQ0FBQyxRQUFMLENBQUEsQ0FBZSxDQUFDLE1BQXZCLENBQThCLENBQUMsSUFBL0IsQ0FBb0MsQ0FBcEM7VUFDQSxNQUFBLENBQU8sSUFBSSxDQUFDLFFBQUwsQ0FBQSxDQUFlLENBQUMsT0FBaEIsQ0FBd0IsS0FBeEIsQ0FBUCxDQUFzQyxDQUFDLElBQXZDLENBQTRDLENBQUMsQ0FBN0M7VUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFnQixDQUFDLE1BQXhCLENBQStCLENBQUMsSUFBaEMsQ0FBcUMsQ0FBckM7aUJBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBdEIsQ0FBa0MsQ0FBQyxHQUFHLENBQUMsT0FBdkMsQ0FBK0MsUUFBL0M7UUFMMEIsQ0FBNUI7ZUFPQSxFQUFBLENBQUcsa0NBQUgsRUFBdUMsU0FBQTtVQUNyQyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsV0FBdkIsRUFBb0MsZ0JBQXBDO1VBQ0EsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLFdBQXZCLEVBQW9DLGdCQUFwQztVQUNBLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixXQUF2QixFQUFvQyxnQkFBcEM7VUFDQSxNQUFBLENBQU8sSUFBSSxDQUFDLFFBQUwsQ0FBQSxDQUFlLENBQUMsTUFBdkIsQ0FBOEIsQ0FBQyxJQUEvQixDQUFvQyxDQUFwQztpQkFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFnQixDQUFDLE1BQXhCLENBQStCLENBQUMsSUFBaEMsQ0FBcUMsQ0FBckM7UUFMcUMsQ0FBdkM7TUFSdUMsQ0FBekM7TUFlQSxRQUFBLENBQVMscUNBQVQsRUFBZ0QsU0FBQTtlQUM5QyxFQUFBLENBQUcsNkNBQUgsRUFBa0QsU0FBQTtVQUNoRCxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsV0FBdkIsRUFBb0MsdUJBQXBDO1VBQ0EsTUFBQSxDQUFPLElBQUksQ0FBQyxRQUFMLENBQUEsQ0FBZSxDQUFDLE1BQXZCLENBQThCLENBQUMsSUFBL0IsQ0FBb0MsQ0FBcEM7VUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFnQixDQUFDLE1BQXhCLENBQStCLENBQUMsSUFBaEMsQ0FBcUMsQ0FBckM7VUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUF0QixDQUFrQyxDQUFDLEdBQUcsQ0FBQyxPQUF2QyxDQUErQyxXQUEvQztpQkFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUF0QixDQUFrQyxDQUFDLE9BQW5DLENBQTJDLFFBQTNDO1FBTGdELENBQWxEO01BRDhDLENBQWhEO01BUUEsUUFBQSxDQUFTLHdDQUFULEVBQW1ELFNBQUE7ZUFDakQsRUFBQSxDQUFHLHFEQUFILEVBQTBELFNBQUE7VUFDeEQsSUFBSSxDQUFDLFlBQUwsQ0FBa0IsT0FBbEI7VUFDQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsV0FBdkIsRUFBb0MsMEJBQXBDO1VBQ0EsTUFBQSxDQUFPLElBQUksQ0FBQyxRQUFMLENBQUEsQ0FBZSxDQUFDLE1BQXZCLENBQThCLENBQUMsSUFBL0IsQ0FBb0MsQ0FBcEM7VUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFnQixDQUFDLE1BQXhCLENBQStCLENBQUMsSUFBaEMsQ0FBcUMsQ0FBckM7VUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUF0QixDQUFrQyxDQUFDLEdBQUcsQ0FBQyxPQUF2QyxDQUErQyxRQUEvQztpQkFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUF0QixDQUFrQyxDQUFDLE9BQW5DLENBQTJDLFFBQTNDO1FBTndELENBQTFEO01BRGlELENBQW5EO01BU0EsUUFBQSxDQUFTLG1DQUFULEVBQThDLFNBQUE7ZUFDNUMsRUFBQSxDQUFHLHFCQUFILEVBQTBCLFNBQUE7VUFDeEIsTUFBQSxDQUFPLElBQUksQ0FBQyxRQUFMLENBQUEsQ0FBZSxDQUFDLE1BQXZCLENBQThCLENBQUMsZUFBL0IsQ0FBK0MsQ0FBL0M7VUFDQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsV0FBdkIsRUFBb0MscUJBQXBDO2lCQUNBLE1BQUEsQ0FBTyxJQUFJLENBQUMsUUFBTCxDQUFBLENBQWUsQ0FBQyxNQUF2QixDQUE4QixDQUFDLElBQS9CLENBQW9DLENBQXBDO1FBSHdCLENBQTFCO01BRDRDLENBQTlDO01BTUEsUUFBQSxDQUFTLHFDQUFULEVBQWdELFNBQUE7ZUFDOUMsRUFBQSxDQUFHLDJCQUFILEVBQWdDLFNBQUE7VUFDOUIsS0FBSyxDQUFDLFVBQU4sR0FBbUIsU0FBQTttQkFBRztVQUFIO1VBQ25CLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBZCxDQUF1QixXQUF2QixFQUFvQyx1QkFBcEM7VUFDQSxNQUFBLENBQU8sSUFBSSxDQUFDLFFBQUwsQ0FBQSxDQUFlLENBQUMsTUFBdkIsQ0FBOEIsQ0FBQyxJQUEvQixDQUFvQyxDQUFwQztpQkFDQSxNQUFBLENBQU8sSUFBSSxDQUFDLFFBQUwsQ0FBQSxDQUFnQixDQUFBLENBQUEsQ0FBdkIsQ0FBMEIsQ0FBQyxJQUEzQixDQUFnQyxLQUFoQztRQUo4QixDQUFoQztNQUQ4QyxDQUFoRDthQU9BLFFBQUEsQ0FBUywwQkFBVCxFQUFxQyxTQUFBO2VBQ25DLEVBQUEsQ0FBRyx1Q0FBSCxFQUE0QyxTQUFBO0FBQzFDLGNBQUE7VUFBQSxLQUFBLEdBQVEsSUFBSSxDQUFDLFNBQUwsQ0FBZTtZQUFBLGNBQUEsRUFBZ0IsSUFBaEI7V0FBZjtVQUNSLE9BQUEsR0FBYyxJQUFBLFVBQUEsQ0FBVyxLQUFYLEVBQWtCLFFBQWxCO1VBQ2QsSUFBQSxHQUFPLE9BQU8sQ0FBQyxVQUFSLENBQW1CLENBQW5CO1VBQ1AsS0FBQSxDQUFNLElBQU4sRUFBWSxTQUFaO2lCQUVBLGVBQUEsQ0FBZ0IsU0FBQTttQkFDZCxPQUFPLENBQUMsT0FBUixDQUFnQixLQUFLLENBQUMsS0FBTixDQUFBLENBQWhCLENBQThCLENBQUMsSUFBL0IsQ0FBb0MsU0FBQTtxQkFDbEMsTUFBQSxDQUFPLElBQUksQ0FBQyxPQUFaLENBQW9CLENBQUMsZ0JBQXJCLENBQUE7WUFEa0MsQ0FBcEM7VUFEYyxDQUFoQjtRQU4wQyxDQUE1QztNQURtQyxDQUFyQztJQW5EbUMsQ0FBckM7SUE4REEsUUFBQSxDQUFTLDRCQUFULEVBQXVDLFNBQUE7TUFDckMsUUFBQSxDQUFTLDRDQUFULEVBQXVELFNBQUE7UUFDckQsUUFBQSxDQUFTLG9EQUFULEVBQStELFNBQUE7aUJBQzdELEVBQUEsQ0FBRyx3RUFBSCxFQUE2RSxTQUFBO0FBQzNFLGdCQUFBO1lBQUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBZ0IsQ0FBQyxHQUFqQixDQUFxQixTQUFDLEdBQUQ7cUJBQVMsR0FBRyxDQUFDLE9BQU8sQ0FBQztZQUFyQixDQUFyQixDQUFQLENBQTZELENBQUMsT0FBOUQsQ0FBc0UsQ0FBQyxRQUFELEVBQVcsV0FBWCxFQUF3QixRQUF4QixDQUF0RTtZQUNBLE1BQUEsQ0FBTyxJQUFJLENBQUMsUUFBTCxDQUFBLENBQVAsQ0FBdUIsQ0FBQyxPQUF4QixDQUFnQyxDQUFDLEtBQUQsRUFBUSxPQUFSLEVBQWlCLEtBQWpCLENBQWhDO1lBQ0EsTUFBQSxDQUFPLElBQUksQ0FBQyxhQUFMLENBQUEsQ0FBUCxDQUE0QixDQUFDLElBQTdCLENBQWtDLEtBQWxDO1lBQ0EsS0FBQSxDQUFNLElBQU4sRUFBWSxVQUFaO1lBRUEsU0FBQSxHQUFZLE1BQU0sQ0FBQyxVQUFQLENBQWtCLENBQWxCO1lBQ1osS0FBQSxDQUFNLFNBQU4sRUFBaUIsZ0JBQWpCO1lBQ0EsS0FBQSxDQUFNLFNBQU4sRUFBaUIsZUFBakI7WUFDQSxPQUE4QixlQUFBLENBQWdCLFNBQVMsQ0FBQyxPQUExQixFQUFtQyxNQUFNLENBQUMsVUFBUCxDQUFrQixDQUFsQixDQUFvQixDQUFDLE9BQXhELENBQTlCLEVBQUMsd0JBQUQsRUFBaUI7WUFDakIsTUFBTSxDQUFDLFdBQVAsQ0FBbUIsY0FBbkI7WUFFQSxNQUFBLENBQU8sU0FBUyxDQUFDLGNBQWpCLENBQWdDLENBQUMsZ0JBQWpDLENBQUE7WUFDQSxNQUFBLENBQU8sU0FBUyxDQUFDLGFBQWpCLENBQStCLENBQUMsR0FBRyxDQUFDLGdCQUFwQyxDQUFBO1lBRUEsTUFBTSxDQUFDLE1BQVAsQ0FBYyxTQUFkO1lBQ0EsTUFBQSxDQUFPLFNBQVMsQ0FBQyxhQUFqQixDQUErQixDQUFDLGdCQUFoQyxDQUFBO1lBRUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBZ0IsQ0FBQyxHQUFqQixDQUFxQixTQUFDLEdBQUQ7cUJBQVMsR0FBRyxDQUFDLE9BQU8sQ0FBQztZQUFyQixDQUFyQixDQUFQLENBQTZELENBQUMsT0FBOUQsQ0FBc0UsQ0FBQyxXQUFELEVBQWMsUUFBZCxFQUF3QixRQUF4QixDQUF0RTtZQUNBLE1BQUEsQ0FBTyxJQUFJLENBQUMsUUFBTCxDQUFBLENBQVAsQ0FBdUIsQ0FBQyxPQUF4QixDQUFnQyxDQUFDLE9BQUQsRUFBVSxLQUFWLEVBQWlCLEtBQWpCLENBQWhDO1lBQ0EsTUFBQSxDQUFPLElBQUksQ0FBQyxhQUFMLENBQUEsQ0FBUCxDQUE0QixDQUFDLElBQTdCLENBQWtDLEtBQWxDO21CQUNBLE1BQUEsQ0FBTyxJQUFJLENBQUMsUUFBWixDQUFxQixDQUFDLGdCQUF0QixDQUFBO1VBckIyRSxDQUE3RTtRQUQ2RCxDQUEvRDtRQXdCQSxRQUFBLENBQVMsd0RBQVQsRUFBbUUsU0FBQTtpQkFDakUsRUFBQSxDQUFHLHdFQUFILEVBQTZFLFNBQUE7QUFDM0UsZ0JBQUE7WUFBQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFnQixDQUFDLEdBQWpCLENBQXFCLFNBQUMsR0FBRDtxQkFBUyxHQUFHLENBQUMsT0FBTyxDQUFDO1lBQXJCLENBQXJCLENBQVAsQ0FBNkQsQ0FBQyxPQUE5RCxDQUFzRSxDQUFDLFFBQUQsRUFBVyxXQUFYLEVBQXdCLFFBQXhCLENBQXRFO1lBQ0EsTUFBQSxDQUFPLElBQUksQ0FBQyxRQUFMLENBQUEsQ0FBUCxDQUF1QixDQUFDLE9BQXhCLENBQWdDLENBQUMsS0FBRCxFQUFRLE9BQVIsRUFBaUIsS0FBakIsQ0FBaEM7WUFDQSxNQUFBLENBQU8sSUFBSSxDQUFDLGFBQUwsQ0FBQSxDQUFQLENBQTRCLENBQUMsSUFBN0IsQ0FBa0MsS0FBbEM7WUFDQSxLQUFBLENBQU0sSUFBTixFQUFZLFVBQVo7WUFFQSxPQUE4QixlQUFBLENBQWdCLE1BQU0sQ0FBQyxVQUFQLENBQWtCLENBQWxCLENBQW9CLENBQUMsT0FBckMsRUFBOEMsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsQ0FBbEIsQ0FBb0IsQ0FBQyxPQUFuRSxDQUE5QixFQUFDLHdCQUFELEVBQWlCO1lBQ2pCLE1BQU0sQ0FBQyxXQUFQLENBQW1CLGNBQW5CO1lBQ0EsTUFBTSxDQUFDLE1BQVAsQ0FBYyxTQUFkO1lBRUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBZ0IsQ0FBQyxHQUFqQixDQUFxQixTQUFDLEdBQUQ7cUJBQVMsR0FBRyxDQUFDLE9BQU8sQ0FBQztZQUFyQixDQUFyQixDQUFQLENBQTZELENBQUMsT0FBOUQsQ0FBc0UsQ0FBQyxRQUFELEVBQVcsUUFBWCxFQUFxQixXQUFyQixDQUF0RTtZQUNBLE1BQUEsQ0FBTyxJQUFJLENBQUMsUUFBTCxDQUFBLENBQVAsQ0FBdUIsQ0FBQyxPQUF4QixDQUFnQyxDQUFDLEtBQUQsRUFBUSxLQUFSLEVBQWUsT0FBZixDQUFoQztZQUNBLE1BQUEsQ0FBTyxJQUFJLENBQUMsYUFBTCxDQUFBLENBQVAsQ0FBNEIsQ0FBQyxJQUE3QixDQUFrQyxLQUFsQzttQkFDQSxNQUFBLENBQU8sSUFBSSxDQUFDLFFBQVosQ0FBcUIsQ0FBQyxnQkFBdEIsQ0FBQTtVQWIyRSxDQUE3RTtRQURpRSxDQUFuRTtRQWdCQSxRQUFBLENBQVMsOEJBQVQsRUFBeUMsU0FBQTtpQkFDdkMsRUFBQSxDQUFHLHFGQUFILEVBQTBGLFNBQUE7QUFDeEYsZ0JBQUE7WUFBQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFnQixDQUFDLEdBQWpCLENBQXFCLFNBQUMsR0FBRDtxQkFBUyxHQUFHLENBQUMsT0FBTyxDQUFDO1lBQXJCLENBQXJCLENBQVAsQ0FBNkQsQ0FBQyxPQUE5RCxDQUFzRSxDQUFDLFFBQUQsRUFBVyxXQUFYLEVBQXdCLFFBQXhCLENBQXRFO1lBQ0EsTUFBQSxDQUFPLElBQUksQ0FBQyxRQUFMLENBQUEsQ0FBUCxDQUF1QixDQUFDLE9BQXhCLENBQWdDLENBQUMsS0FBRCxFQUFRLE9BQVIsRUFBaUIsS0FBakIsQ0FBaEM7WUFDQSxNQUFBLENBQU8sSUFBSSxDQUFDLGFBQUwsQ0FBQSxDQUFQLENBQTRCLENBQUMsSUFBN0IsQ0FBa0MsS0FBbEM7WUFDQSxLQUFBLENBQU0sSUFBTixFQUFZLFVBQVo7WUFFQSxPQUE4QixlQUFBLENBQWdCLE1BQU0sQ0FBQyxVQUFQLENBQWtCLENBQWxCLENBQW9CLENBQUMsT0FBckMsRUFBOEMsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsQ0FBbEIsQ0FBb0IsQ0FBQyxPQUFuRSxDQUE5QixFQUFDLHdCQUFELEVBQWlCO1lBQ2pCLE1BQU0sQ0FBQyxXQUFQLENBQW1CLGNBQW5CO1lBQ0EsTUFBTSxDQUFDLE1BQVAsQ0FBYyxTQUFkO1lBRUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBZ0IsQ0FBQyxHQUFqQixDQUFxQixTQUFDLEdBQUQ7cUJBQVMsR0FBRyxDQUFDLE9BQU8sQ0FBQztZQUFyQixDQUFyQixDQUFQLENBQTZELENBQUMsT0FBOUQsQ0FBc0UsQ0FBQyxRQUFELEVBQVcsV0FBWCxFQUF3QixRQUF4QixDQUF0RTtZQUNBLE1BQUEsQ0FBTyxJQUFJLENBQUMsUUFBTCxDQUFBLENBQVAsQ0FBdUIsQ0FBQyxPQUF4QixDQUFnQyxDQUFDLEtBQUQsRUFBUSxPQUFSLEVBQWlCLEtBQWpCLENBQWhDO1lBQ0EsTUFBQSxDQUFPLElBQUksQ0FBQyxhQUFMLENBQUEsQ0FBUCxDQUE0QixDQUFDLElBQTdCLENBQWtDLEtBQWxDO21CQUNBLE1BQUEsQ0FBTyxJQUFJLENBQUMsUUFBWixDQUFxQixDQUFDLGdCQUF0QixDQUFBO1VBYndGLENBQTFGO1FBRHVDLENBQXpDO2VBZ0JBLFFBQUEsQ0FBUyxtQ0FBVCxFQUE4QyxTQUFBO2lCQUM1QyxFQUFBLENBQUcsdUNBQUgsRUFBNEMsU0FBQTtBQUMxQyxnQkFBQTtZQUFBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQWdCLENBQUMsR0FBakIsQ0FBcUIsU0FBQyxHQUFEO3FCQUFTLEdBQUcsQ0FBQyxPQUFPLENBQUM7WUFBckIsQ0FBckIsQ0FBUCxDQUE2RCxDQUFDLE9BQTlELENBQXNFLENBQUMsUUFBRCxFQUFXLFdBQVgsRUFBd0IsUUFBeEIsQ0FBdEU7WUFDQSxNQUFBLENBQU8sSUFBSSxDQUFDLFFBQUwsQ0FBQSxDQUFQLENBQXVCLENBQUMsT0FBeEIsQ0FBZ0MsQ0FBQyxLQUFELEVBQVEsT0FBUixFQUFpQixLQUFqQixDQUFoQztZQUNBLE1BQUEsQ0FBTyxJQUFJLENBQUMsYUFBTCxDQUFBLENBQVAsQ0FBNEIsQ0FBQyxJQUE3QixDQUFrQyxLQUFsQztZQUNBLEtBQUEsQ0FBTSxJQUFOLEVBQVksVUFBWjtZQUVBLE9BQThCLGVBQUEsQ0FBZ0IsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsQ0FBbEIsQ0FBb0IsQ0FBQyxPQUFyQyxFQUE4QyxNQUFNLENBQUMsT0FBckQsQ0FBOUIsRUFBQyx3QkFBRCxFQUFpQjtZQUNqQixNQUFNLENBQUMsV0FBUCxDQUFtQixjQUFuQjtZQUNBLE1BQU0sQ0FBQyxNQUFQLENBQWMsU0FBZDtZQUVBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQWdCLENBQUMsR0FBakIsQ0FBcUIsU0FBQyxHQUFEO3FCQUFTLEdBQUcsQ0FBQyxPQUFPLENBQUM7WUFBckIsQ0FBckIsQ0FBUCxDQUE2RCxDQUFDLE9BQTlELENBQXNFLENBQUMsV0FBRCxFQUFjLFFBQWQsRUFBd0IsUUFBeEIsQ0FBdEU7bUJBQ0EsTUFBQSxDQUFPLElBQUksQ0FBQyxRQUFMLENBQUEsQ0FBUCxDQUF1QixDQUFDLE9BQXhCLENBQWdDLENBQUMsT0FBRCxFQUFVLEtBQVYsRUFBaUIsS0FBakIsQ0FBaEM7VUFYMEMsQ0FBNUM7UUFENEMsQ0FBOUM7TUF6RHFELENBQXZEO01BdUVBLFFBQUEsQ0FBUywyQ0FBVCxFQUFzRCxTQUFBO0FBQ3BELFlBQUE7UUFBQSxPQUEyQixFQUEzQixFQUFDLGVBQUQsRUFBUSxpQkFBUixFQUFpQjtRQUVqQixVQUFBLENBQVcsU0FBQTtVQUNULEtBQUEsR0FBUSxJQUFJLENBQUMsVUFBTCxDQUFnQjtZQUFBLGNBQUEsRUFBZ0IsSUFBaEI7V0FBaEI7VUFDUCxTQUFVLEtBQUssQ0FBQyxRQUFOLENBQUE7aUJBQ1gsT0FBQSxHQUFjLElBQUEsVUFBQSxDQUFXLEtBQVgsRUFBa0IsUUFBbEI7UUFITCxDQUFYO1FBS0EsRUFBQSxDQUFHLHFGQUFILEVBQTBGLFNBQUE7QUFDeEYsY0FBQTtVQUFBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQWdCLENBQUMsR0FBakIsQ0FBcUIsU0FBQyxHQUFEO21CQUFTLEdBQUcsQ0FBQyxPQUFPLENBQUM7VUFBckIsQ0FBckIsQ0FBUCxDQUE2RCxDQUFDLE9BQTlELENBQXNFLENBQUMsUUFBRCxFQUFXLFdBQVgsRUFBd0IsUUFBeEIsQ0FBdEU7VUFDQSxNQUFBLENBQU8sSUFBSSxDQUFDLFFBQUwsQ0FBQSxDQUFQLENBQXVCLENBQUMsT0FBeEIsQ0FBZ0MsQ0FBQyxLQUFELEVBQVEsT0FBUixFQUFpQixLQUFqQixDQUFoQztVQUNBLE1BQUEsQ0FBTyxJQUFJLENBQUMsYUFBTCxDQUFBLENBQVAsQ0FBNEIsQ0FBQyxJQUE3QixDQUFrQyxLQUFsQztVQUVBLE1BQUEsQ0FBTyxPQUFPLENBQUMsT0FBUixDQUFBLENBQWlCLENBQUMsR0FBbEIsQ0FBc0IsU0FBQyxHQUFEO21CQUFTLEdBQUcsQ0FBQyxPQUFPLENBQUM7VUFBckIsQ0FBdEIsQ0FBUCxDQUE4RCxDQUFDLE9BQS9ELENBQXVFLENBQUMsUUFBRCxDQUF2RTtVQUNBLE1BQUEsQ0FBTyxLQUFLLENBQUMsUUFBTixDQUFBLENBQVAsQ0FBd0IsQ0FBQyxPQUF6QixDQUFpQyxDQUFDLE1BQUQsQ0FBakM7VUFDQSxNQUFBLENBQU8sS0FBSyxDQUFDLFVBQWIsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixNQUE5QjtVQUNBLEtBQUEsQ0FBTSxLQUFOLEVBQWEsVUFBYjtVQUVBLE9BQThCLGVBQUEsQ0FBZ0IsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsQ0FBbEIsQ0FBb0IsQ0FBQyxPQUFyQyxFQUE4QyxPQUFPLENBQUMsVUFBUixDQUFtQixDQUFuQixDQUFxQixDQUFDLE9BQXBFLENBQTlCLEVBQUMsd0JBQUQsRUFBaUI7VUFDakIsTUFBTSxDQUFDLFdBQVAsQ0FBbUIsY0FBbkI7VUFDQSxPQUFPLENBQUMsTUFBUixDQUFlLFNBQWY7VUFFQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFnQixDQUFDLEdBQWpCLENBQXFCLFNBQUMsR0FBRDttQkFBUyxHQUFHLENBQUMsT0FBTyxDQUFDO1VBQXJCLENBQXJCLENBQVAsQ0FBNkQsQ0FBQyxPQUE5RCxDQUFzRSxDQUFDLFdBQUQsRUFBYyxRQUFkLENBQXRFO1VBQ0EsTUFBQSxDQUFPLElBQUksQ0FBQyxRQUFMLENBQUEsQ0FBUCxDQUF1QixDQUFDLE9BQXhCLENBQWdDLENBQUMsT0FBRCxFQUFVLEtBQVYsQ0FBaEM7VUFDQSxNQUFBLENBQU8sSUFBSSxDQUFDLGFBQUwsQ0FBQSxDQUFQLENBQTRCLENBQUMsSUFBN0IsQ0FBa0MsS0FBbEM7VUFFQSxNQUFBLENBQU8sT0FBTyxDQUFDLE9BQVIsQ0FBQSxDQUFpQixDQUFDLEdBQWxCLENBQXNCLFNBQUMsR0FBRDttQkFBUyxHQUFHLENBQUMsT0FBTyxDQUFDO1VBQXJCLENBQXRCLENBQVAsQ0FBOEQsQ0FBQyxPQUEvRCxDQUF1RSxDQUFDLFFBQUQsRUFBVyxRQUFYLENBQXZFO1VBQ0EsTUFBQSxDQUFPLEtBQUssQ0FBQyxRQUFOLENBQUEsQ0FBUCxDQUF3QixDQUFDLE9BQXpCLENBQWlDLENBQUMsTUFBRCxFQUFTLEtBQVQsQ0FBakM7VUFDQSxNQUFBLENBQU8sS0FBSyxDQUFDLFVBQWIsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixLQUE5QjtpQkFDQSxNQUFBLENBQU8sS0FBSyxDQUFDLFFBQWIsQ0FBc0IsQ0FBQyxnQkFBdkIsQ0FBQTtRQXJCd0YsQ0FBMUY7UUF1QkEsUUFBQSxDQUFTLDBDQUFULEVBQXFELFNBQUE7aUJBQ25ELEVBQUEsQ0FBRyxxRkFBSCxFQUEwRixTQUFBO0FBQ3hGLGdCQUFBO1lBQUEsS0FBSyxDQUFDLFlBQU4sQ0FBQTtZQUVBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQWdCLENBQUMsR0FBakIsQ0FBcUIsU0FBQyxHQUFEO3FCQUFTLEdBQUcsQ0FBQyxPQUFPLENBQUM7WUFBckIsQ0FBckIsQ0FBUCxDQUE2RCxDQUFDLE9BQTlELENBQXNFLENBQUMsUUFBRCxFQUFXLFdBQVgsRUFBd0IsUUFBeEIsQ0FBdEU7WUFDQSxNQUFBLENBQU8sSUFBSSxDQUFDLFFBQUwsQ0FBQSxDQUFQLENBQXVCLENBQUMsT0FBeEIsQ0FBZ0MsQ0FBQyxLQUFELEVBQVEsT0FBUixFQUFpQixLQUFqQixDQUFoQztZQUNBLE1BQUEsQ0FBTyxJQUFJLENBQUMsYUFBTCxDQUFBLENBQVAsQ0FBNEIsQ0FBQyxJQUE3QixDQUFrQyxLQUFsQztZQUVBLE1BQUEsQ0FBTyxPQUFPLENBQUMsT0FBUixDQUFBLENBQWlCLENBQUMsR0FBbEIsQ0FBc0IsU0FBQyxHQUFEO3FCQUFTLEdBQUcsQ0FBQyxPQUFPLENBQUM7WUFBckIsQ0FBdEIsQ0FBUCxDQUE4RCxDQUFDLE9BQS9ELENBQXVFLEVBQXZFO1lBQ0EsTUFBQSxDQUFPLEtBQUssQ0FBQyxRQUFOLENBQUEsQ0FBUCxDQUF3QixDQUFDLE9BQXpCLENBQWlDLEVBQWpDO1lBQ0EsTUFBQSxDQUFPLEtBQUssQ0FBQyxVQUFiLENBQXdCLENBQUMsYUFBekIsQ0FBQTtZQUNBLEtBQUEsQ0FBTSxLQUFOLEVBQWEsVUFBYjtZQUVBLE9BQThCLGVBQUEsQ0FBZ0IsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsQ0FBbEIsQ0FBb0IsQ0FBQyxPQUFyQyxFQUE4QyxPQUFPLENBQUMsT0FBdEQsQ0FBOUIsRUFBQyx3QkFBRCxFQUFpQjtZQUNqQixNQUFNLENBQUMsV0FBUCxDQUFtQixjQUFuQjtZQUNBLE9BQU8sQ0FBQyxVQUFSLENBQW1CLFNBQW5CO1lBQ0EsT0FBTyxDQUFDLE1BQVIsQ0FBZSxTQUFmO1lBRUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBZ0IsQ0FBQyxHQUFqQixDQUFxQixTQUFDLEdBQUQ7cUJBQVMsR0FBRyxDQUFDLE9BQU8sQ0FBQztZQUFyQixDQUFyQixDQUFQLENBQTZELENBQUMsT0FBOUQsQ0FBc0UsQ0FBQyxXQUFELEVBQWMsUUFBZCxDQUF0RTtZQUNBLE1BQUEsQ0FBTyxJQUFJLENBQUMsUUFBTCxDQUFBLENBQVAsQ0FBdUIsQ0FBQyxPQUF4QixDQUFnQyxDQUFDLE9BQUQsRUFBVSxLQUFWLENBQWhDO1lBQ0EsTUFBQSxDQUFPLElBQUksQ0FBQyxhQUFMLENBQUEsQ0FBUCxDQUE0QixDQUFDLElBQTdCLENBQWtDLEtBQWxDO1lBRUEsTUFBQSxDQUFPLE9BQU8sQ0FBQyxPQUFSLENBQUEsQ0FBaUIsQ0FBQyxHQUFsQixDQUFzQixTQUFDLEdBQUQ7cUJBQVMsR0FBRyxDQUFDLE9BQU8sQ0FBQztZQUFyQixDQUF0QixDQUFQLENBQThELENBQUMsT0FBL0QsQ0FBdUUsQ0FBQyxRQUFELENBQXZFO1lBQ0EsTUFBQSxDQUFPLEtBQUssQ0FBQyxRQUFOLENBQUEsQ0FBUCxDQUF3QixDQUFDLE9BQXpCLENBQWlDLENBQUMsS0FBRCxDQUFqQztZQUNBLE1BQUEsQ0FBTyxLQUFLLENBQUMsVUFBYixDQUF3QixDQUFDLElBQXpCLENBQThCLEtBQTlCO21CQUNBLE1BQUEsQ0FBTyxLQUFLLENBQUMsUUFBYixDQUFzQixDQUFDLGdCQUF2QixDQUFBO1VBeEJ3RixDQUExRjtRQURtRCxDQUFyRDtlQTJCQSxRQUFBLENBQVMseURBQVQsRUFBb0UsU0FBQTtpQkFDbEUsRUFBQSxDQUFHLDREQUFILEVBQWlFLFNBQUE7QUFDL0QsZ0JBQUE7WUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isc0JBQWhCLEVBQXdDLElBQXhDO1lBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBZ0IsQ0FBQyxHQUFqQixDQUFxQixTQUFDLEdBQUQ7cUJBQVMsR0FBRyxDQUFDLE9BQU8sQ0FBQztZQUFyQixDQUFyQixDQUFQLENBQTZELENBQUMsT0FBOUQsQ0FBc0UsQ0FBQyxRQUFELEVBQVcsV0FBWCxFQUF3QixRQUF4QixDQUF0RTtZQUNBLE1BQUEsQ0FBTyxJQUFJLENBQUMsUUFBTCxDQUFBLENBQVAsQ0FBdUIsQ0FBQyxPQUF4QixDQUFnQyxDQUFDLEtBQUQsRUFBUSxPQUFSLEVBQWlCLEtBQWpCLENBQWhDO1lBQ0EsTUFBQSxDQUFPLElBQUksQ0FBQyxhQUFMLENBQUEsQ0FBUCxDQUE0QixDQUFDLElBQTdCLENBQWtDLEtBQWxDO1lBRUEsTUFBQSxDQUFPLE9BQU8sQ0FBQyxPQUFSLENBQUEsQ0FBaUIsQ0FBQyxHQUFsQixDQUFzQixTQUFDLEdBQUQ7cUJBQVMsR0FBRyxDQUFDLE9BQU8sQ0FBQztZQUFyQixDQUF0QixDQUFQLENBQThELENBQUMsT0FBL0QsQ0FBdUUsQ0FBQyxRQUFELENBQXZFO1lBQ0EsTUFBQSxDQUFPLEtBQUssQ0FBQyxRQUFOLENBQUEsQ0FBUCxDQUF3QixDQUFDLE9BQXpCLENBQWlDLENBQUMsTUFBRCxDQUFqQztZQUNBLE1BQUEsQ0FBTyxLQUFLLENBQUMsVUFBYixDQUF3QixDQUFDLElBQXpCLENBQThCLE1BQTlCO1lBQ0EsS0FBQSxDQUFNLEtBQU4sRUFBYSxVQUFiO1lBRUEsT0FBOEIsZUFBQSxDQUFnQixPQUFPLENBQUMsVUFBUixDQUFtQixDQUFuQixDQUFxQixDQUFDLE9BQXRDLEVBQStDLE1BQU0sQ0FBQyxVQUFQLENBQWtCLENBQWxCLENBQW9CLENBQUMsT0FBcEUsQ0FBOUIsRUFBQyx3QkFBRCxFQUFpQjtZQUNqQixPQUFPLENBQUMsV0FBUixDQUFvQixjQUFwQjtZQUNBLE1BQU0sQ0FBQyxNQUFQLENBQWMsU0FBZDtZQUVBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQWdCLENBQUMsR0FBakIsQ0FBcUIsU0FBQyxHQUFEO3FCQUFTLEdBQUcsQ0FBQyxPQUFPLENBQUM7WUFBckIsQ0FBckIsQ0FBUCxDQUE2RCxDQUFDLE9BQTlELENBQXNFLENBQUMsUUFBRCxFQUFXLFFBQVgsRUFBcUIsV0FBckIsRUFBa0MsUUFBbEMsQ0FBdEU7WUFDQSxNQUFBLENBQU8sSUFBSSxDQUFDLFFBQUwsQ0FBQSxDQUFQLENBQXVCLENBQUMsT0FBeEIsQ0FBZ0MsQ0FBQyxLQUFELEVBQVEsTUFBUixFQUFnQixPQUFoQixFQUF5QixLQUF6QixDQUFoQztZQUNBLE1BQUEsQ0FBTyxJQUFJLENBQUMsYUFBTCxDQUFBLENBQVAsQ0FBNEIsQ0FBQyxJQUE3QixDQUFrQyxNQUFsQzttQkFFQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isc0JBQWhCLEVBQXdDLEtBQXhDO1VBbkIrRCxDQUFqRTtRQURrRSxDQUFwRTtNQTFEb0QsQ0FBdEQ7TUFnRkEsUUFBQSxDQUFTLHdDQUFULEVBQW1ELFNBQUE7UUFDakQsRUFBQSxDQUFHLGdDQUFILEVBQXFDLFNBQUE7QUFDbkMsY0FBQTtVQUFBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQWdCLENBQUMsR0FBakIsQ0FBcUIsU0FBQyxHQUFEO21CQUFTLEdBQUcsQ0FBQyxPQUFPLENBQUM7VUFBckIsQ0FBckIsQ0FBUCxDQUE2RCxDQUFDLE9BQTlELENBQXNFLENBQUMsUUFBRCxFQUFXLFdBQVgsRUFBd0IsUUFBeEIsQ0FBdEU7VUFDQSxHQUFBLEdBQU0sTUFBTSxDQUFDLFVBQVAsQ0FBa0IsQ0FBbEIsQ0FBb0IsQ0FBQztVQUMzQixNQUFNLENBQUMsSUFBUCxHQUNFO1lBQUEsSUFBQSxFQUFNLElBQU47WUFDQSxRQUFBLEVBQVUsSUFBSSxDQUFDLFVBQUwsQ0FBQSxDQUFpQixDQUFDLGFBQWxCLENBQWdDLGFBQWhDLENBRFY7WUFFQSxJQUFBLEVBQU07Y0FBQyxHQUFBLEVBQUssQ0FBTjtjQUFTLElBQUEsRUFBTSxDQUFmO2NBQWtCLEtBQUEsRUFBTyxHQUF6QjtjQUE4QixNQUFBLEVBQVEsR0FBdEM7YUFGTjs7VUFJRixNQUFBLENBQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBdEIsQ0FBK0IsU0FBL0IsQ0FBUCxDQUFpRCxDQUFDLElBQWxELENBQXVELEtBQXZEO1VBRUEsR0FBRyxDQUFDLE1BQUosQ0FBVztZQUFBLE1BQUEsRUFBUSxHQUFSO1lBQWEsT0FBQSxFQUFTLEVBQXRCO1lBQTBCLE9BQUEsRUFBUyxFQUFuQztXQUFYO1VBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQXRCLENBQStCLFNBQS9CLENBQVAsQ0FBaUQsQ0FBQyxJQUFsRCxDQUF1RCxJQUF2RDtVQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUF6QixDQUFnQyxDQUFDLElBQWpDLENBQXNDLE9BQXRDO1VBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQXpCLENBQStCLENBQUMsSUFBaEMsQ0FBcUMsT0FBckM7VUFFQSxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUM7VUFDbkIsR0FBRyxDQUFDLE1BQUosQ0FBVztZQUFBLE1BQUEsRUFBUSxHQUFSO1lBQWEsT0FBQSxFQUFTLEdBQXRCO1lBQTJCLE9BQUEsRUFBUyxHQUFwQztXQUFYO2lCQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUF0QixDQUErQixTQUEvQixDQUFQLENBQWlELENBQUMsSUFBbEQsQ0FBdUQsS0FBdkQ7UUFqQm1DLENBQXJDO1FBbUJBLEVBQUEsQ0FBRywyQkFBSCxFQUFnQyxTQUFBO0FBQzlCLGNBQUE7VUFBQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFnQixDQUFDLEdBQWpCLENBQXFCLFNBQUMsR0FBRDttQkFBUyxHQUFHLENBQUMsT0FBTyxDQUFDO1VBQXJCLENBQXJCLENBQVAsQ0FBNkQsQ0FBQyxPQUE5RCxDQUFzRSxDQUFDLFFBQUQsRUFBVyxXQUFYLEVBQXdCLFFBQXhCLENBQXRFO1VBQ0EsR0FBQSxHQUFNLE1BQU0sQ0FBQyxVQUFQLENBQWtCLENBQWxCLENBQW9CLENBQUM7VUFDM0IsTUFBTSxDQUFDLElBQVAsR0FDRTtZQUFBLElBQUEsRUFBTSxJQUFOO1lBQ0EsUUFBQSxFQUFVLElBQUksQ0FBQyxVQUFMLENBQUEsQ0FBaUIsQ0FBQyxhQUFsQixDQUFnQyxhQUFoQyxDQURWO1lBRUEsSUFBQSxFQUFNO2NBQUMsR0FBQSxFQUFLLENBQU47Y0FBUyxJQUFBLEVBQU0sQ0FBZjtjQUFrQixLQUFBLEVBQU8sR0FBekI7Y0FBOEIsTUFBQSxFQUFRLEdBQXRDO2FBRk47O1VBSUYsR0FBRyxDQUFDLE1BQUosQ0FBVztZQUFBLE1BQUEsRUFBUSxHQUFSO1lBQWEsT0FBQSxFQUFTLEVBQXRCO1lBQTBCLE9BQUEsRUFBUyxFQUFuQztXQUFYO1VBQ0EsR0FBRyxDQUFDLFNBQUosQ0FBYztZQUFBLE1BQUEsRUFBUSxHQUFSO1lBQWEsT0FBQSxFQUFTLEVBQXRCO1lBQTBCLE9BQUEsRUFBUyxFQUFuQztXQUFkO1VBQ0EsTUFBQSxDQUFPLFNBQUEsQ0FBQSxDQUFXLENBQUMsUUFBWixDQUFBLENBQXNCLENBQUMsTUFBOUIsQ0FBcUMsQ0FBQyxPQUF0QyxDQUE4QyxDQUE5QztVQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQWdCLENBQUMsR0FBakIsQ0FBcUIsU0FBQyxHQUFEO21CQUFTLEdBQUcsQ0FBQyxPQUFPLENBQUM7VUFBckIsQ0FBckIsQ0FBUCxDQUE2RCxDQUFDLE9BQTlELENBQXNFLENBQUMsUUFBRCxFQUFXLFdBQVgsQ0FBdEU7aUJBQ0EsTUFBQSxDQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBZixDQUFBLENBQThCLENBQUMsUUFBL0IsQ0FBQSxDQUF5QyxDQUFDLE1BQWpELENBQXdELENBQUMsT0FBekQsQ0FBaUUsQ0FBakU7UUFaOEIsQ0FBaEM7UUFjQSxRQUFBLENBQVMsa0RBQVQsRUFBNkQsU0FBQTtpQkFDM0QsRUFBQSxDQUFHLGNBQUgsRUFBbUIsU0FBQTtBQUNqQixnQkFBQTtZQUFBLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBaUIsQ0FBQSxDQUFBLENBQUUsQ0FBQyxPQUFPLENBQUMsYUFBNUIsQ0FBMEMsYUFBMUMsQ0FBd0QsQ0FBQyxLQUF6RCxDQUFBO1lBQ0EsTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFpQixDQUFBLENBQUEsQ0FBRSxDQUFDLE9BQU8sQ0FBQyxhQUE1QixDQUEwQyxhQUExQyxDQUF3RCxDQUFDLEtBQXpELENBQUE7WUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFnQixDQUFDLEdBQWpCLENBQXFCLFNBQUMsR0FBRDtxQkFBUyxHQUFHLENBQUMsT0FBTyxDQUFDO1lBQXJCLENBQXJCLENBQVAsQ0FBNkQsQ0FBQyxPQUE5RCxDQUFzRSxDQUFDLFdBQUQsQ0FBdEU7WUFDQSxHQUFBLEdBQU0sTUFBTSxDQUFDLFVBQVAsQ0FBa0IsQ0FBbEIsQ0FBb0IsQ0FBQztZQUMzQixNQUFNLENBQUMsSUFBUCxHQUNFO2NBQUEsSUFBQSxFQUFNLElBQU47Y0FDQSxRQUFBLEVBQVUsSUFBSSxDQUFDLFVBQUwsQ0FBQSxDQUFpQixDQUFDLGFBQWxCLENBQWdDLGFBQWhDLENBRFY7Y0FFQSxJQUFBLEVBQU07Z0JBQUMsR0FBQSxFQUFLLENBQU47Z0JBQVMsSUFBQSxFQUFNLENBQWY7Z0JBQWtCLEtBQUEsRUFBTyxHQUF6QjtnQkFBOEIsTUFBQSxFQUFRLEdBQXRDO2VBRk47O1lBSUYsR0FBRyxDQUFDLE1BQUosQ0FBVztjQUFBLE1BQUEsRUFBUSxHQUFSO2NBQWEsT0FBQSxFQUFTLEVBQXRCO2NBQTBCLE9BQUEsRUFBUyxFQUFuQzthQUFYO1lBQ0EsR0FBRyxDQUFDLFNBQUosQ0FBYztjQUFBLE1BQUEsRUFBUSxHQUFSO2NBQWEsT0FBQSxFQUFTLEVBQXRCO2NBQTBCLE9BQUEsRUFBUyxFQUFuQzthQUFkO1lBQ0EsTUFBQSxDQUFPLFNBQUEsQ0FBQSxDQUFXLENBQUMsUUFBWixDQUFBLENBQXNCLENBQUMsTUFBOUIsQ0FBcUMsQ0FBQyxPQUF0QyxDQUE4QyxDQUE5QzttQkFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFnQixDQUFDLEdBQWpCLENBQXFCLFNBQUMsR0FBRDtxQkFBUyxHQUFHLENBQUMsT0FBTyxDQUFDO1lBQXJCLENBQXJCLENBQVAsQ0FBNkQsQ0FBQyxPQUE5RCxDQUFzRSxDQUFDLFdBQUQsQ0FBdEU7VUFiaUIsQ0FBbkI7UUFEMkQsQ0FBN0Q7ZUFnQkEsUUFBQSxDQUFTLHdCQUFULEVBQW1DLFNBQUE7aUJBQ2pDLEVBQUEsQ0FBRyxrQ0FBSCxFQUF1QyxTQUFBO0FBQ3JDLGdCQUFBO1lBQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFMLENBQUE7WUFDVCxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFnQixDQUFDLEdBQWpCLENBQXFCLFNBQUMsR0FBRDtxQkFBUyxHQUFHLENBQUMsT0FBTyxDQUFDO1lBQXJCLENBQXJCLENBQVAsQ0FBNkQsQ0FBQyxPQUE5RCxDQUFzRSxDQUFDLFFBQUQsRUFBVyxXQUFYLEVBQXdCLFFBQXhCLENBQXRFO1lBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxRQUFQLENBQUEsQ0FBaUIsQ0FBQyxNQUF6QixDQUFnQyxDQUFDLElBQWpDLENBQXNDLENBQXRDO1lBQ0EsR0FBQSxHQUFNLE1BQU0sQ0FBQyxVQUFQLENBQWtCLENBQWxCLENBQW9CLENBQUM7WUFDM0IsTUFBTSxDQUFDLElBQVAsR0FDRTtjQUFBLElBQUEsRUFBTSxNQUFOO2NBQ0EsUUFBQSxFQUFVLE1BQU0sQ0FBQyxVQUFQLENBQUEsQ0FBbUIsQ0FBQyxhQUFwQixDQUFrQyxhQUFsQyxDQURWO2NBRUEsSUFBQSxFQUFNO2dCQUFDLEdBQUEsRUFBSyxDQUFOO2dCQUFTLElBQUEsRUFBTSxDQUFmO2dCQUFrQixLQUFBLEVBQU8sR0FBekI7Z0JBQThCLE1BQUEsRUFBUSxHQUF0QztlQUZOOztZQUlGLEdBQUcsQ0FBQyxNQUFKLENBQVc7Y0FBQSxNQUFBLEVBQVEsR0FBUjtjQUFhLE9BQUEsRUFBUyxFQUF0QjtjQUEwQixPQUFBLEVBQVMsRUFBbkM7YUFBWDtZQUNBLEdBQUcsQ0FBQyxTQUFKLENBQWM7Y0FBQSxNQUFBLEVBQVEsR0FBUjtjQUFhLE9BQUEsRUFBUyxFQUF0QjtjQUEwQixPQUFBLEVBQVMsRUFBbkM7YUFBZDtZQUNBLE1BQUEsQ0FBTyxTQUFBLENBQUEsQ0FBVyxDQUFDLFFBQVosQ0FBQSxDQUFzQixDQUFDLE1BQTlCLENBQXFDLENBQUMsT0FBdEMsQ0FBOEMsQ0FBOUM7WUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFnQixDQUFDLEdBQWpCLENBQXFCLFNBQUMsR0FBRDtxQkFBUyxHQUFHLENBQUMsT0FBTyxDQUFDO1lBQXJCLENBQXJCLENBQVAsQ0FBNkQsQ0FBQyxPQUE5RCxDQUFzRSxDQUFDLFFBQUQsRUFBVyxXQUFYLENBQXRFO21CQUNBLE1BQUEsQ0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBQSxDQUE4QixDQUFDLFFBQS9CLENBQUEsQ0FBeUMsQ0FBQyxNQUFqRCxDQUF3RCxDQUFDLE9BQXpELENBQWlFLENBQWpFO1VBZHFDLENBQXZDO1FBRGlDLENBQW5DO01BbERpRCxDQUFuRDtNQW1FQSxRQUFBLENBQVMsbUNBQVQsRUFBOEMsU0FBQTtlQUM1QyxFQUFBLENBQUcsZUFBSCxFQUFvQixTQUFBO0FBQ2xCLGNBQUE7VUFBQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFnQixDQUFDLEdBQWpCLENBQXFCLFNBQUMsR0FBRDttQkFBUyxHQUFHLENBQUMsT0FBTyxDQUFDO1VBQXJCLENBQXJCLENBQVAsQ0FBNkQsQ0FBQyxPQUE5RCxDQUFzRSxDQUFDLFFBQUQsRUFBVyxXQUFYLEVBQXdCLFFBQXhCLENBQXRFO1VBQ0EsTUFBQSxDQUFPLElBQUksQ0FBQyxRQUFMLENBQUEsQ0FBUCxDQUF1QixDQUFDLE9BQXhCLENBQWdDLENBQUMsS0FBRCxFQUFRLE9BQVIsRUFBaUIsS0FBakIsQ0FBaEM7VUFDQSxNQUFBLENBQU8sSUFBSSxDQUFDLGFBQUwsQ0FBQSxDQUFQLENBQTRCLENBQUMsSUFBN0IsQ0FBa0MsS0FBbEM7VUFDQSxLQUFBLENBQU0sSUFBTixFQUFZLFVBQVo7VUFFQSxPQUE4QixlQUFBLENBQWdCLE1BQU0sQ0FBQyxVQUFQLENBQWtCLENBQWxCLENBQW9CLENBQUMsT0FBckMsRUFBOEMsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsQ0FBbEIsQ0FBb0IsQ0FBQyxPQUFuRSxDQUE5QixFQUFDLHdCQUFELEVBQWlCO1VBQ2pCLE1BQU0sQ0FBQyxNQUFQLENBQWMsU0FBZDtVQUVBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQWdCLENBQUMsR0FBakIsQ0FBcUIsU0FBQyxHQUFEO21CQUFTLEdBQUcsQ0FBQyxPQUFPLENBQUM7VUFBckIsQ0FBckIsQ0FBUCxDQUE2RCxDQUFDLE9BQTlELENBQXNFLENBQUMsUUFBRCxFQUFXLFdBQVgsRUFBd0IsUUFBeEIsQ0FBdEU7VUFDQSxNQUFBLENBQU8sSUFBSSxDQUFDLFFBQUwsQ0FBQSxDQUFQLENBQXVCLENBQUMsT0FBeEIsQ0FBZ0MsQ0FBQyxLQUFELEVBQVEsT0FBUixFQUFpQixLQUFqQixDQUFoQztVQUNBLE1BQUEsQ0FBTyxJQUFJLENBQUMsYUFBTCxDQUFBLENBQVAsQ0FBNEIsQ0FBQyxJQUE3QixDQUFrQyxLQUFsQztpQkFDQSxNQUFBLENBQU8sSUFBSSxDQUFDLFFBQVosQ0FBcUIsQ0FBQyxHQUFHLENBQUMsZ0JBQTFCLENBQUE7UUFaa0IsQ0FBcEI7TUFENEMsQ0FBOUM7TUFlQSxRQUFBLENBQVMsMENBQVQsRUFBcUQsU0FBQTtlQUNuRCxFQUFBLENBQUcscUNBQUgsRUFBMEMsU0FBQTtBQUN4QyxjQUFBO1VBQUEsT0FBOEIsZUFBQSxDQUFnQixNQUFNLENBQUMsVUFBUCxDQUFrQixDQUFsQixDQUFvQixDQUFDLE9BQXJDLEVBQThDLE1BQU0sQ0FBQyxVQUFQLENBQWtCLENBQWxCLENBQW9CLENBQUMsT0FBbkUsQ0FBOUIsRUFBQyx3QkFBRCxFQUFpQjtVQUNqQixNQUFNLENBQUMsV0FBUCxDQUFtQixjQUFuQjtVQUVBLE1BQUEsQ0FBTyxjQUFjLENBQUMsWUFBWSxDQUFDLE9BQTVCLENBQW9DLFlBQXBDLENBQVAsQ0FBeUQsQ0FBQyxPQUExRCxDQUFrRSxPQUFPLENBQUMsT0FBUixDQUFBLENBQWxFO1VBQ0EsSUFBRyxPQUFPLENBQUMsUUFBUixLQUFvQixRQUF2QjttQkFDRSxNQUFBLENBQU8sY0FBYyxDQUFDLFlBQVksQ0FBQyxPQUE1QixDQUFvQyxlQUFwQyxDQUFQLENBQTRELENBQUMsT0FBN0QsQ0FBcUUsU0FBQSxHQUFTLENBQUMsT0FBTyxDQUFDLE9BQVIsQ0FBQSxDQUFELENBQTlFLEVBREY7O1FBTHdDLENBQTFDO01BRG1ELENBQXJEO01BU0EsUUFBQSxDQUFTLDhDQUFULEVBQXlELFNBQUE7UUFDdkQsRUFBQSxDQUFHLDJFQUFILEVBQWdGLFNBQUE7QUFDOUUsY0FBQTtVQUFBLE9BQThCLGVBQUEsQ0FBZ0IsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsQ0FBbEIsQ0FBb0IsQ0FBQyxPQUFyQyxFQUE4QyxNQUFNLENBQUMsVUFBUCxDQUFrQixDQUFsQixDQUFvQixDQUFDLE9BQW5FLENBQTlCLEVBQUMsd0JBQUQsRUFBaUI7VUFDakIsTUFBTSxDQUFDLFdBQVAsQ0FBbUIsY0FBbkI7VUFDQSxNQUFNLENBQUMsbUJBQVAsQ0FBMkIsSUFBSSxDQUFDLEVBQWhDLEVBQW9DLENBQXBDO1VBRUEsTUFBQSxDQUFPLElBQUksQ0FBQyxRQUFMLENBQUEsQ0FBUCxDQUF1QixDQUFDLE9BQXhCLENBQWdDLENBQUMsS0FBRCxFQUFRLEtBQVIsQ0FBaEM7VUFDQSxNQUFBLENBQU8sSUFBSSxDQUFDLGFBQUwsQ0FBQSxDQUFQLENBQTRCLENBQUMsSUFBN0IsQ0FBa0MsS0FBbEM7VUFFQSxTQUFTLENBQUMsWUFBWSxDQUFDLE9BQXZCLENBQStCLGdCQUEvQixFQUFpRCxNQUFNLENBQUMsV0FBUCxDQUFBLENBQUEsR0FBdUIsQ0FBeEU7VUFFQSxLQUFBLENBQU0sTUFBTixFQUFjLHNCQUFkLENBQXFDLENBQUMsY0FBdEMsQ0FBQTtVQUNBLE1BQU0sQ0FBQyxNQUFQLENBQWMsU0FBZDtVQUVBLFFBQUEsQ0FBUyxTQUFBO21CQUNQLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxTQUE1QixHQUF3QztVQURqQyxDQUFUO2lCQUdBLElBQUEsQ0FBSyxTQUFBO0FBQ0gsZ0JBQUE7WUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBO1lBQ1QsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLE9BQU8sQ0FBQyxPQUFSLENBQUEsQ0FBOUI7bUJBQ0EsTUFBQSxDQUFPLElBQUksQ0FBQyxRQUFMLENBQUEsQ0FBUCxDQUF1QixDQUFDLE9BQXhCLENBQWdDLENBQUMsS0FBRCxFQUFRLE1BQVIsRUFBZ0IsS0FBaEIsQ0FBaEM7VUFIRyxDQUFMO1FBaEI4RSxDQUFoRjtRQXFCQSxFQUFBLENBQUcsc0RBQUgsRUFBMkQsU0FBQTtBQUN6RCxjQUFBO1VBQUEsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsNEJBQWhCO1VBQ0EsT0FBOEIsZUFBQSxDQUFnQixNQUFNLENBQUMsVUFBUCxDQUFrQixDQUFsQixDQUFvQixDQUFDLE9BQXJDLEVBQThDLE1BQU0sQ0FBQyxVQUFQLENBQWtCLENBQWxCLENBQW9CLENBQUMsT0FBbkUsQ0FBOUIsRUFBQyx3QkFBRCxFQUFpQjtVQUNqQixNQUFNLENBQUMsV0FBUCxDQUFtQixjQUFuQjtVQUNBLE1BQU0sQ0FBQyxtQkFBUCxDQUEyQixJQUFJLENBQUMsRUFBaEMsRUFBb0MsQ0FBcEM7VUFFQSxTQUFTLENBQUMsWUFBWSxDQUFDLE9BQXZCLENBQStCLGdCQUEvQixFQUFpRCxNQUFNLENBQUMsV0FBUCxDQUFBLENBQUEsR0FBdUIsQ0FBeEU7VUFFQSxLQUFBLENBQU0sTUFBTixFQUFjLHNCQUFkLENBQXFDLENBQUMsY0FBdEMsQ0FBQTtVQUNBLE1BQU0sQ0FBQyxNQUFQLENBQWMsU0FBZDtVQUVBLFFBQUEsQ0FBUyxTQUFBO21CQUNQLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxTQUE1QixHQUF3QztVQURqQyxDQUFUO2lCQUdBLElBQUEsQ0FBSyxTQUFBO21CQUNILE1BQUEsQ0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBb0MsQ0FBQyxPQUFyQyxDQUFBLENBQVAsQ0FBc0QsQ0FBQyxJQUF2RCxDQUE0RCw0QkFBNUQ7VUFERyxDQUFMO1FBZHlELENBQTNEO2VBaUJBLEVBQUEsQ0FBRyxxREFBSCxFQUEwRCxTQUFBO0FBQ3hELGNBQUE7VUFBQSxPQUFPLENBQUMsU0FBUixDQUFBLENBQW1CLENBQUMsT0FBcEIsQ0FBNEIsSUFBNUI7VUFDQSxPQUFPLENBQUMsT0FBUixDQUFnQixnQkFBaEI7VUFFQSxPQUE4QixlQUFBLENBQWdCLE1BQU0sQ0FBQyxVQUFQLENBQWtCLENBQWxCLENBQW9CLENBQUMsT0FBckMsRUFBOEMsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsQ0FBbEIsQ0FBb0IsQ0FBQyxPQUFuRSxDQUE5QixFQUFDLHdCQUFELEVBQWlCO1VBQ2pCLE1BQU0sQ0FBQyxXQUFQLENBQW1CLGNBQW5CO1VBQ0EsTUFBTSxDQUFDLG1CQUFQLENBQTJCLElBQUksQ0FBQyxFQUFoQyxFQUFvQyxDQUFwQztVQUVBLFNBQVMsQ0FBQyxZQUFZLENBQUMsT0FBdkIsQ0FBK0IsZ0JBQS9CLEVBQWlELE1BQU0sQ0FBQyxXQUFQLENBQUEsQ0FBQSxHQUF1QixDQUF4RTtVQUVBLEtBQUEsQ0FBTSxNQUFOLEVBQWMsc0JBQWQsQ0FBcUMsQ0FBQyxjQUF0QyxDQUFBO1VBQ0EsTUFBTSxDQUFDLE1BQVAsQ0FBYyxTQUFkO1VBRUEsUUFBQSxDQUFTLFNBQUE7bUJBQ1AsTUFBTSxDQUFDLG9CQUFvQixDQUFDLFNBQTVCLEdBQXdDO1VBRGpDLENBQVQ7aUJBR0EsSUFBQSxDQUFLLFNBQUE7WUFDSCxNQUFBLENBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBQW9DLENBQUMsT0FBckMsQ0FBQSxDQUFQLENBQXNELENBQUMsSUFBdkQsQ0FBNEQsZ0JBQTVEO21CQUNBLE1BQUEsQ0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBb0MsQ0FBQyxPQUFyQyxDQUFBLENBQVAsQ0FBc0QsQ0FBQyxhQUF2RCxDQUFBO1VBRkcsQ0FBTDtRQWhCd0QsQ0FBMUQ7TUF2Q3VELENBQXpEO01BMkRBLElBQUcsa0NBQUg7ZUFDRSxRQUFBLENBQVMsaURBQVQsRUFBNEQsU0FBQTtBQUMxRCxjQUFBO1VBQUEsT0FBNkIsRUFBN0IsRUFBQyxlQUFELEVBQVEsaUJBQVIsRUFBaUI7VUFFakIsVUFBQSxDQUFXLFNBQUE7WUFDVCxPQUFPLENBQUMsV0FBUixDQUFvQixJQUFJLENBQUMsU0FBUyxDQUFDLFVBQWYsQ0FBQSxDQUFwQjtZQUNBLElBQUEsR0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBQTtZQUNQLEtBQUEsR0FBUSxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQWYsQ0FBQSxDQUE0QixDQUFDLGFBQTdCLENBQUE7WUFDUixRQUFBLEdBQWUsSUFBQSxRQUFBLENBQVMsV0FBVDtZQUNmLEtBQUssQ0FBQyxPQUFOLENBQWMsUUFBZDttQkFDQSxPQUFBLEdBQWMsSUFBQSxVQUFBLENBQVcsS0FBWCxFQUFrQixNQUFsQjtVQU5MLENBQVg7VUFRQSxFQUFBLENBQUcscUZBQUgsRUFBMEYsU0FBQTtBQUN4RixnQkFBQTtZQUFBLE1BQUEsQ0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQWYsQ0FBQSxDQUE0QixDQUFDLFNBQTdCLENBQUEsQ0FBUCxDQUFnRCxDQUFDLElBQWpELENBQXNELEtBQXREO1lBRUEsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBZ0IsQ0FBQyxHQUFqQixDQUFxQixTQUFDLEdBQUQ7cUJBQVMsR0FBRyxDQUFDLE9BQU8sQ0FBQztZQUFyQixDQUFyQixDQUFQLENBQTZELENBQUMsT0FBOUQsQ0FBc0UsQ0FBQyxRQUFELEVBQVcsV0FBWCxFQUF3QixRQUF4QixDQUF0RTtZQUNBLE1BQUEsQ0FBTyxJQUFJLENBQUMsUUFBTCxDQUFBLENBQVAsQ0FBdUIsQ0FBQyxPQUF4QixDQUFnQyxDQUFDLEtBQUQsRUFBUSxPQUFSLEVBQWlCLEtBQWpCLENBQWhDO1lBQ0EsTUFBQSxDQUFPLElBQUksQ0FBQyxhQUFMLENBQUEsQ0FBUCxDQUE0QixDQUFDLElBQTdCLENBQWtDLEtBQWxDO1lBRUEsTUFBQSxDQUFPLE9BQU8sQ0FBQyxPQUFSLENBQUEsQ0FBaUIsQ0FBQyxHQUFsQixDQUFzQixTQUFDLEdBQUQ7cUJBQVMsR0FBRyxDQUFDLE9BQU8sQ0FBQztZQUFyQixDQUF0QixDQUFQLENBQThELENBQUMsT0FBL0QsQ0FBdUUsQ0FBQyxXQUFELENBQXZFO1lBQ0EsTUFBQSxDQUFPLEtBQUssQ0FBQyxRQUFOLENBQUEsQ0FBUCxDQUF3QixDQUFDLE9BQXpCLENBQWlDLENBQUMsUUFBRCxDQUFqQztZQUNBLE1BQUEsQ0FBTyxLQUFLLENBQUMsYUFBTixDQUFBLENBQVAsQ0FBNkIsQ0FBQyxJQUE5QixDQUFtQyxRQUFuQztZQUVBLE9BQThCLGVBQUEsQ0FBZ0IsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsQ0FBbEIsQ0FBb0IsQ0FBQyxPQUFyQyxFQUE4QyxPQUFPLENBQUMsT0FBdEQsQ0FBOUIsRUFBQyx3QkFBRCxFQUFpQjtZQUNqQixNQUFNLENBQUMsV0FBUCxDQUFtQixjQUFuQjtZQUNBLE1BQUEsQ0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLGFBQWhCLENBQThCLGNBQTlCLENBQVAsQ0FBcUQsQ0FBQyxRQUF0RCxDQUFBO1lBQ0EsT0FBTyxDQUFDLFVBQVIsQ0FBbUIsU0FBbkI7WUFDQSxNQUFBLENBQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxhQUFoQixDQUE4QixjQUE5QixDQUFQLENBQXFELENBQUMsR0FBRyxDQUFDLFFBQTFELENBQUE7WUFDQSxPQUFPLENBQUMsTUFBUixDQUFlLFNBQWY7WUFDQSxNQUFBLENBQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxhQUFoQixDQUE4QixjQUE5QixDQUFQLENBQXFELENBQUMsUUFBdEQsQ0FBQTtZQUVBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQWdCLENBQUMsR0FBakIsQ0FBcUIsU0FBQyxHQUFEO3FCQUFTLEdBQUcsQ0FBQyxPQUFPLENBQUM7WUFBckIsQ0FBckIsQ0FBUCxDQUE2RCxDQUFDLE9BQTlELENBQXNFLENBQUMsV0FBRCxFQUFjLFFBQWQsQ0FBdEU7WUFDQSxNQUFBLENBQU8sSUFBSSxDQUFDLFFBQUwsQ0FBQSxDQUFQLENBQXVCLENBQUMsT0FBeEIsQ0FBZ0MsQ0FBQyxPQUFELEVBQVUsS0FBVixDQUFoQztZQUNBLE1BQUEsQ0FBTyxJQUFJLENBQUMsYUFBTCxDQUFBLENBQVAsQ0FBNEIsQ0FBQyxJQUE3QixDQUFrQyxLQUFsQztZQUVBLE1BQUEsQ0FBTyxPQUFPLENBQUMsT0FBUixDQUFBLENBQWlCLENBQUMsR0FBbEIsQ0FBc0IsU0FBQyxHQUFEO3FCQUFTLEdBQUcsQ0FBQyxPQUFPLENBQUM7WUFBckIsQ0FBdEIsQ0FBUCxDQUE4RCxDQUFDLE9BQS9ELENBQXVFLENBQUMsV0FBRCxFQUFjLFFBQWQsQ0FBdkU7WUFDQSxNQUFBLENBQU8sS0FBSyxDQUFDLFFBQU4sQ0FBQSxDQUFQLENBQXdCLENBQUMsT0FBekIsQ0FBaUMsQ0FBQyxRQUFELEVBQVcsS0FBWCxDQUFqQztZQUNBLE1BQUEsQ0FBTyxLQUFLLENBQUMsVUFBYixDQUF3QixDQUFDLElBQXpCLENBQThCLEtBQTlCO21CQUNBLE1BQUEsQ0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQWYsQ0FBQSxDQUE0QixDQUFDLFNBQTdCLENBQUEsQ0FBUCxDQUFnRCxDQUFDLElBQWpELENBQXNELElBQXREO1VBMUJ3RixDQUExRjtpQkE0QkEsRUFBQSxDQUFHLGdIQUFILEVBQXFILFNBQUE7QUFDbkgsZ0JBQUE7WUFBQSxLQUFLLENBQUMsbUJBQU4sR0FBNEIsU0FBQTtxQkFBRyxDQUFDLFFBQUQsRUFBVyxRQUFYO1lBQUg7WUFDNUIsT0FBOEIsZUFBQSxDQUFnQixNQUFNLENBQUMsVUFBUCxDQUFrQixDQUFsQixDQUFvQixDQUFDLE9BQXJDLEVBQThDLE9BQU8sQ0FBQyxPQUF0RCxDQUE5QixFQUFDLHdCQUFELEVBQWlCO1lBQ2pCLE1BQU0sQ0FBQyxXQUFQLENBQW1CLGNBQW5CO1lBQ0EsTUFBQSxDQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsYUFBaEIsQ0FBOEIsY0FBOUIsQ0FBUCxDQUFxRCxDQUFDLFFBQXRELENBQUE7WUFDQSxPQUFPLENBQUMsVUFBUixDQUFtQixTQUFuQjtZQUNBLE1BQUEsQ0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLGFBQWhCLENBQThCLGNBQTlCLENBQVAsQ0FBcUQsQ0FBQyxRQUF0RCxDQUFBO1lBQ0EsT0FBTyxDQUFDLE1BQVIsQ0FBZSxTQUFmO1lBQ0EsTUFBQSxDQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsYUFBaEIsQ0FBOEIsY0FBOUIsQ0FBUCxDQUFxRCxDQUFDLFFBQXRELENBQUE7WUFDQSxNQUFBLENBQU8sSUFBSSxDQUFDLFFBQUwsQ0FBQSxDQUFQLENBQXVCLENBQUMsT0FBeEIsQ0FBZ0MsQ0FBQyxLQUFELEVBQVEsT0FBUixFQUFpQixLQUFqQixDQUFoQztZQUNBLE1BQUEsQ0FBTyxLQUFLLENBQUMsUUFBTixDQUFBLENBQVAsQ0FBd0IsQ0FBQyxPQUF6QixDQUFpQyxDQUFDLFFBQUQsQ0FBakM7WUFFQSxLQUFLLENBQUMsbUJBQU4sR0FBNEIsU0FBQTtxQkFBRyxDQUFDLE1BQUQ7WUFBSDtZQUM1QixPQUE4QixlQUFBLENBQWdCLE1BQU0sQ0FBQyxVQUFQLENBQWtCLENBQWxCLENBQW9CLENBQUMsT0FBckMsRUFBOEMsT0FBTyxDQUFDLE9BQXRELENBQTlCLEVBQUMsd0JBQUQsRUFBaUI7WUFDakIsTUFBTSxDQUFDLFdBQVAsQ0FBbUIsY0FBbkI7WUFDQSxNQUFBLENBQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxhQUFoQixDQUE4QixjQUE5QixDQUFQLENBQXFELENBQUMsUUFBdEQsQ0FBQTtZQUNBLE9BQU8sQ0FBQyxVQUFSLENBQW1CLFNBQW5CO1lBQ0EsTUFBQSxDQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsYUFBaEIsQ0FBOEIsY0FBOUIsQ0FBUCxDQUFxRCxDQUFDLEdBQUcsQ0FBQyxRQUExRCxDQUFBO1lBQ0EsT0FBTyxDQUFDLE1BQVIsQ0FBZSxTQUFmO1lBQ0EsTUFBQSxDQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsYUFBaEIsQ0FBOEIsY0FBOUIsQ0FBUCxDQUFxRCxDQUFDLFFBQXRELENBQUE7WUFDQSxNQUFBLENBQU8sSUFBSSxDQUFDLFFBQUwsQ0FBQSxDQUFQLENBQXVCLENBQUMsT0FBeEIsQ0FBZ0MsQ0FBQyxPQUFELEVBQVUsS0FBVixDQUFoQzttQkFDQSxNQUFBLENBQU8sS0FBSyxDQUFDLFFBQU4sQ0FBQSxDQUFQLENBQXdCLENBQUMsT0FBekIsQ0FBaUMsQ0FBQyxRQUFELEVBQVcsS0FBWCxDQUFqQztVQXJCbUgsQ0FBckg7UUF2QzBELENBQTVELEVBREY7O0lBOVNxQyxDQUF2QztJQTZXQSxRQUFBLENBQVMsb0NBQVQsRUFBK0MsU0FBQTthQUM3QyxFQUFBLENBQUcsMEJBQUgsRUFBK0IsU0FBQTtBQUM3QixZQUFBO1FBQUEsY0FBQSxHQUFpQixPQUFPLENBQUMsU0FBUixDQUFrQixnQkFBbEI7UUFDakIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLE1BQU0sQ0FBQyxPQUF6QixFQUFrQyxzQkFBbEMsRUFBMEQsY0FBMUQ7UUFFQSxpQkFBQSxDQUFrQixVQUFsQixFQUE4QixNQUFNLENBQUMsT0FBUCxDQUFBLENBQWlCLENBQUEsQ0FBQSxDQUFFLENBQUMsT0FBbEQ7UUFDQSxNQUFBLENBQU8sY0FBYyxDQUFDLFNBQXRCLENBQWdDLENBQUMsSUFBakMsQ0FBc0MsQ0FBdEM7UUFFQSxpQkFBQSxDQUFrQixVQUFsQixFQUE4QixNQUFNLENBQUMsT0FBckM7ZUFDQSxNQUFBLENBQU8sY0FBYyxDQUFDLFNBQXRCLENBQWdDLENBQUMsSUFBakMsQ0FBc0MsQ0FBdEM7TUFSNkIsQ0FBL0I7SUFENkMsQ0FBL0M7SUFXQSxRQUFBLENBQVMsNkNBQVQsRUFBd0QsU0FBQTtNQUN0RCxRQUFBLENBQVMsK0NBQVQsRUFBMEQsU0FBQTtRQUN4RCxVQUFBLENBQVcsU0FBQTtVQUNULElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixtQkFBaEIsRUFBcUMsSUFBckM7aUJBQ0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDRCQUFoQixFQUE4QyxHQUE5QztRQUZTLENBQVg7UUFJQSxRQUFBLENBQVMsaUNBQVQsRUFBNEMsU0FBQTtVQUMxQyxFQUFBLENBQUcsNENBQUgsRUFBaUQsU0FBQTtZQUMvQyxNQUFBLENBQU8sSUFBSSxDQUFDLGFBQUwsQ0FBQSxDQUFQLENBQTRCLENBQUMsSUFBN0IsQ0FBa0MsS0FBbEM7WUFDQSxNQUFNLENBQUMsT0FBTyxDQUFDLGFBQWYsQ0FBNkIsZUFBQSxDQUFnQixHQUFoQixDQUE3QjttQkFDQSxNQUFBLENBQU8sSUFBSSxDQUFDLGFBQUwsQ0FBQSxDQUFQLENBQTRCLENBQUMsSUFBN0IsQ0FBa0MsT0FBbEM7VUFIK0MsQ0FBakQ7aUJBS0EsRUFBQSxDQUFHLDRGQUFILEVBQWlHLFNBQUE7WUFDL0YsTUFBQSxDQUFPLElBQUksQ0FBQyxhQUFMLENBQUEsQ0FBUCxDQUE0QixDQUFDLElBQTdCLENBQWtDLEtBQWxDO1lBQ0EsTUFBTSxDQUFDLE9BQU8sQ0FBQyxhQUFmLENBQTZCLGVBQUEsQ0FBZ0IsRUFBaEIsQ0FBN0I7WUFDQSxNQUFBLENBQU8sSUFBSSxDQUFDLGFBQUwsQ0FBQSxDQUFQLENBQTRCLENBQUMsSUFBN0IsQ0FBa0MsS0FBbEM7WUFDQSxNQUFNLENBQUMsT0FBTyxDQUFDLGFBQWYsQ0FBNkIsZUFBQSxDQUFnQixFQUFoQixDQUE3QjtZQUNBLE1BQUEsQ0FBTyxJQUFJLENBQUMsYUFBTCxDQUFBLENBQVAsQ0FBNEIsQ0FBQyxJQUE3QixDQUFrQyxLQUFsQztZQUNBLE1BQU0sQ0FBQyxPQUFPLENBQUMsYUFBZixDQUE2QixlQUFBLENBQWdCLEVBQWhCLENBQTdCO21CQUNBLE1BQUEsQ0FBTyxJQUFJLENBQUMsYUFBTCxDQUFBLENBQVAsQ0FBNEIsQ0FBQyxJQUE3QixDQUFrQyxPQUFsQztVQVArRixDQUFqRztRQU4wQyxDQUE1QztRQWVBLFFBQUEsQ0FBUyxtQ0FBVCxFQUE4QyxTQUFBO2lCQUM1QyxFQUFBLENBQUcsNENBQUgsRUFBaUQsU0FBQTtZQUMvQyxNQUFBLENBQU8sSUFBSSxDQUFDLGFBQUwsQ0FBQSxDQUFQLENBQTRCLENBQUMsSUFBN0IsQ0FBa0MsS0FBbEM7WUFDQSxNQUFNLENBQUMsT0FBTyxDQUFDLGFBQWYsQ0FBNkIsZUFBQSxDQUFnQixDQUFDLEdBQWpCLENBQTdCO21CQUNBLE1BQUEsQ0FBTyxJQUFJLENBQUMsYUFBTCxDQUFBLENBQVAsQ0FBNEIsQ0FBQyxJQUE3QixDQUFrQyxLQUFsQztVQUgrQyxDQUFqRDtRQUQ0QyxDQUE5QztRQU1BLFFBQUEsQ0FBUywwREFBVCxFQUFxRSxTQUFBO2lCQUNuRSxFQUFBLENBQUcsZ0NBQUgsRUFBcUMsU0FBQTtZQUNuQyxNQUFBLENBQU8sSUFBSSxDQUFDLGFBQUwsQ0FBQSxDQUFQLENBQTRCLENBQUMsSUFBN0IsQ0FBa0MsS0FBbEM7WUFDQSxNQUFNLENBQUMsT0FBTyxDQUFDLGFBQWYsQ0FBNkIsd0JBQUEsQ0FBeUIsR0FBekIsQ0FBN0I7bUJBQ0EsTUFBQSxDQUFPLElBQUksQ0FBQyxhQUFMLENBQUEsQ0FBUCxDQUE0QixDQUFDLElBQTdCLENBQWtDLEtBQWxDO1VBSG1DLENBQXJDO1FBRG1FLENBQXJFO2VBTUEsUUFBQSxDQUFTLDREQUFULEVBQXVFLFNBQUE7aUJBQ3JFLEVBQUEsQ0FBRyxnQ0FBSCxFQUFxQyxTQUFBO1lBQ25DLE1BQUEsQ0FBTyxJQUFJLENBQUMsYUFBTCxDQUFBLENBQVAsQ0FBNEIsQ0FBQyxJQUE3QixDQUFrQyxLQUFsQztZQUNBLE1BQU0sQ0FBQyxPQUFPLENBQUMsYUFBZixDQUE2Qix3QkFBQSxDQUF5QixDQUFDLEdBQTFCLENBQTdCO21CQUNBLE1BQUEsQ0FBTyxJQUFJLENBQUMsYUFBTCxDQUFBLENBQVAsQ0FBNEIsQ0FBQyxJQUE3QixDQUFrQyxLQUFsQztVQUhtQyxDQUFyQztRQURxRSxDQUF2RTtNQWhDd0QsQ0FBMUQ7YUFzQ0EsUUFBQSxDQUFTLGdEQUFULEVBQTJELFNBQUE7UUFDekQsVUFBQSxDQUFXLFNBQUE7aUJBQ1QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLG1CQUFoQixFQUFxQyxLQUFyQztRQURTLENBQVg7UUFHQSxRQUFBLENBQVMsMENBQVQsRUFBcUQsU0FBQTtpQkFDbkQsRUFBQSxDQUFHLGdDQUFILEVBQXFDLFNBQUE7WUFDbkMsTUFBQSxDQUFPLElBQUksQ0FBQyxhQUFMLENBQUEsQ0FBUCxDQUE0QixDQUFDLElBQTdCLENBQWtDLEtBQWxDO1lBQ0EsTUFBTSxDQUFDLE9BQU8sQ0FBQyxhQUFmLENBQTZCLGVBQUEsQ0FBZ0IsR0FBaEIsQ0FBN0I7bUJBQ0EsTUFBQSxDQUFPLElBQUksQ0FBQyxhQUFMLENBQUEsQ0FBUCxDQUE0QixDQUFDLElBQTdCLENBQWtDLEtBQWxDO1VBSG1DLENBQXJDO1FBRG1ELENBQXJEO2VBTUEsUUFBQSxDQUFTLDRDQUFULEVBQXVELFNBQUE7aUJBQ3JELEVBQUEsQ0FBRyxnQ0FBSCxFQUFxQyxTQUFBO1lBQ25DLE1BQUEsQ0FBTyxJQUFJLENBQUMsYUFBTCxDQUFBLENBQVAsQ0FBNEIsQ0FBQyxJQUE3QixDQUFrQyxLQUFsQztZQUNBLE1BQU0sQ0FBQyxPQUFPLENBQUMsYUFBZixDQUE2QixlQUFBLENBQWdCLENBQUMsR0FBakIsQ0FBN0I7bUJBQ0EsTUFBQSxDQUFPLElBQUksQ0FBQyxhQUFMLENBQUEsQ0FBUCxDQUE0QixDQUFDLElBQTdCLENBQWtDLEtBQWxDO1VBSG1DLENBQXJDO1FBRHFELENBQXZEO01BVnlELENBQTNEO0lBdkNzRCxDQUF4RDtJQXVEQSxRQUFBLENBQVMsbURBQVQsRUFBOEQsU0FBQTtNQUM1RCxVQUFBLENBQVcsU0FBQTtlQUNULElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix1QkFBaEIsRUFBeUMsSUFBekM7TUFEUyxDQUFYO01BR0EsUUFBQSxDQUFTLHNCQUFULEVBQWlDLFNBQUE7ZUFDL0IsRUFBQSxDQUFHLG1CQUFILEVBQXdCLFNBQUE7VUFDdEIsTUFBQSxDQUFPLElBQUksQ0FBQyxRQUFMLENBQUEsQ0FBZSxDQUFDLE1BQXZCLENBQThCLENBQUMsSUFBL0IsQ0FBb0MsQ0FBcEM7aUJBQ0EsTUFBQSxDQUFPLE1BQVAsQ0FBYyxDQUFDLEdBQUcsQ0FBQyxXQUFuQixDQUErQixRQUEvQjtRQUZzQixDQUF4QjtNQUQrQixDQUFqQzthQUtBLFFBQUEsQ0FBUyxvQkFBVCxFQUErQixTQUFBO2VBQzdCLEVBQUEsQ0FBRyxtQkFBSCxFQUF3QixTQUFBO1VBQ3RCLE1BQUEsQ0FBTyxJQUFJLENBQUMsUUFBTCxDQUFBLENBQWUsQ0FBQyxNQUF2QixDQUE4QixDQUFDLElBQS9CLENBQW9DLENBQXBDO1VBQ0EsSUFBSSxDQUFDLFdBQUwsQ0FBaUIsS0FBakI7VUFDQSxJQUFJLENBQUMsV0FBTCxDQUFpQixLQUFqQjtVQUNBLE1BQUEsQ0FBTyxJQUFJLENBQUMsUUFBTCxDQUFBLENBQWUsQ0FBQyxNQUF2QixDQUE4QixDQUFDLElBQS9CLENBQW9DLENBQXBDO2lCQUNBLE1BQUEsQ0FBTyxNQUFQLENBQWMsQ0FBQyxHQUFHLENBQUMsV0FBbkIsQ0FBK0IsUUFBL0I7UUFMc0IsQ0FBeEI7TUFENkIsQ0FBL0I7SUFUNEQsQ0FBOUQ7SUFpQkEsUUFBQSxDQUFTLG9EQUFULEVBQStELFNBQUE7TUFDN0QsVUFBQSxDQUFXLFNBQUE7ZUFDVCxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsdUJBQWhCLEVBQXlDLEtBQXpDO01BRFMsQ0FBWDtNQUdBLFFBQUEsQ0FBUyxzQkFBVCxFQUFpQyxTQUFBO2VBQy9CLEVBQUEsQ0FBRyxtQkFBSCxFQUF3QixTQUFBO1VBQ3RCLE1BQUEsQ0FBTyxJQUFJLENBQUMsUUFBTCxDQUFBLENBQWUsQ0FBQyxNQUF2QixDQUE4QixDQUFDLElBQS9CLENBQW9DLENBQXBDO2lCQUNBLE1BQUEsQ0FBTyxNQUFQLENBQWMsQ0FBQyxHQUFHLENBQUMsV0FBbkIsQ0FBK0IsUUFBL0I7UUFGc0IsQ0FBeEI7TUFEK0IsQ0FBakM7YUFLQSxRQUFBLENBQVMsb0JBQVQsRUFBK0IsU0FBQTtlQUM3QixFQUFBLENBQUcsbUJBQUgsRUFBd0IsU0FBQTtVQUN0QixNQUFBLENBQU8sSUFBSSxDQUFDLFFBQUwsQ0FBQSxDQUFlLENBQUMsTUFBdkIsQ0FBOEIsQ0FBQyxJQUEvQixDQUFvQyxDQUFwQztVQUNBLElBQUksQ0FBQyxXQUFMLENBQWlCLEtBQWpCO1VBQ0EsSUFBSSxDQUFDLFdBQUwsQ0FBaUIsS0FBakI7VUFDQSxNQUFBLENBQU8sSUFBSSxDQUFDLFFBQUwsQ0FBQSxDQUFlLENBQUMsTUFBdkIsQ0FBOEIsQ0FBQyxJQUEvQixDQUFvQyxDQUFwQztpQkFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQWQsQ0FBc0IsQ0FBQyxXQUF2QixDQUFtQyxRQUFuQztRQUxzQixDQUF4QjtNQUQ2QixDQUEvQjtJQVQ2RCxDQUEvRDtJQWlCQSxJQUFHLG9EQUFBLElBQStDLHNEQUFsRDtNQUNFLFNBQUEsR0FBWSxTQUFDLElBQUQ7UUFDVixJQUFHLHNCQUFIO2lCQUNFLElBQUksQ0FBQyxTQUFMLENBQUEsRUFERjtTQUFBLE1BQUE7aUJBR0UsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQUEsQ0FBOEIsQ0FBQyxjQUEvQixDQUFBLENBQUEsS0FBbUQsS0FIckQ7O01BRFU7TUFNWixRQUFBLENBQVMsaUNBQVQsRUFBNEMsU0FBQTtRQUMxQyxVQUFBLENBQVcsU0FBQTtpQkFDVCxJQUFJLENBQUMsWUFBTCxDQUFBO1FBRFMsQ0FBWDtRQUdBLFFBQUEsQ0FBUyx3QkFBVCxFQUFtQyxTQUFBO2lCQUNqQyxFQUFBLENBQUcsNEJBQUgsRUFBaUMsU0FBQTtZQUMvQixPQUFBLEdBQVU7WUFDVixlQUFBLENBQWdCLFNBQUE7cUJBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLFlBQXBCLEVBQWtDO2dCQUFBLE9BQUEsRUFBUyxJQUFUO2VBQWxDLENBQWdELENBQUMsSUFBakQsQ0FBc0QsU0FBQyxDQUFEO3VCQUFPLE9BQUEsR0FBVTtjQUFqQixDQUF0RDtZQURjLENBQWhCO21CQUdBLElBQUEsQ0FBSyxTQUFBO2NBQ0gsSUFBSSxDQUFDLFlBQUwsQ0FBa0IsT0FBbEI7Y0FDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyxnQkFBZixDQUFnQyxZQUFoQyxDQUE2QyxDQUFDLE1BQXJELENBQTRELENBQUMsSUFBN0QsQ0FBa0UsQ0FBbEU7cUJBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFPLENBQUMsZ0JBQWYsQ0FBZ0MsTUFBaEMsQ0FBd0MsQ0FBQSxDQUFBLENBQUUsQ0FBQyxhQUEzQyxDQUF5RCxRQUF6RCxDQUFQLENBQTBFLENBQUMsV0FBM0UsQ0FBdUYsTUFBdkY7WUFIRyxDQUFMO1VBTCtCLENBQWpDO1FBRGlDLENBQW5DO1FBV0EsUUFBQSxDQUFTLHFEQUFULEVBQWdFLFNBQUE7aUJBQzlELEVBQUEsQ0FBRyw0Q0FBSCxFQUFpRCxTQUFBO1lBQy9DLE9BQUEsR0FBVTtZQUNWLGVBQUEsQ0FBZ0IsU0FBQTtxQkFDZCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsWUFBcEIsRUFBa0M7Z0JBQUEsT0FBQSxFQUFTLElBQVQ7ZUFBbEMsQ0FBZ0QsQ0FBQyxJQUFqRCxDQUFzRCxTQUFDLENBQUQ7dUJBQU8sT0FBQSxHQUFVO2NBQWpCLENBQXREO1lBRGMsQ0FBaEI7bUJBR0EsSUFBQSxDQUFLLFNBQUE7Y0FDSCxJQUFJLENBQUMsWUFBTCxDQUFrQixPQUFsQjtjQUNBLE1BQUEsQ0FBTyxTQUFBLENBQVUsT0FBVixDQUFQLENBQTBCLENBQUMsSUFBM0IsQ0FBZ0MsSUFBaEM7Y0FDQSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQUEsQ0FBOEIsQ0FBQyxVQUEvQixDQUFBLENBQXZCLEVBQW9FLHVCQUFwRTtxQkFDQSxNQUFBLENBQU8sU0FBQSxDQUFVLE9BQVYsQ0FBUCxDQUEwQixDQUFDLElBQTNCLENBQWdDLEtBQWhDO1lBSkcsQ0FBTDtVQUwrQyxDQUFqRDtRQUQ4RCxDQUFoRTtRQVlBLFFBQUEsQ0FBUyxrQ0FBVCxFQUE2QyxTQUFBO1VBQzNDLEVBQUEsQ0FBRywyQ0FBSCxFQUFnRCxTQUFBO0FBQzlDLGdCQUFBO1lBQUEsT0FBQSxHQUFVO1lBQ1YsT0FBQSxHQUFVO1lBRVYsZUFBQSxDQUFnQixTQUFBO3FCQUNkLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixZQUFwQixFQUFrQztnQkFBQSxPQUFBLEVBQVMsSUFBVDtlQUFsQyxDQUFnRCxDQUFDLElBQWpELENBQXNELFNBQUMsQ0FBRDtnQkFDcEQsT0FBQSxHQUFVO3VCQUNWLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixhQUFwQixFQUFtQztrQkFBQSxPQUFBLEVBQVMsSUFBVDtpQkFBbkMsQ0FBaUQsQ0FBQyxJQUFsRCxDQUF1RCxTQUFDLENBQUQ7eUJBQ3JELE9BQUEsR0FBVTtnQkFEMkMsQ0FBdkQ7Y0FGb0QsQ0FBdEQ7WUFEYyxDQUFoQjttQkFNQSxJQUFBLENBQUssU0FBQTtjQUNILE1BQUEsQ0FBTyxPQUFPLENBQUMsV0FBUixDQUFBLENBQVAsQ0FBNkIsQ0FBQyxJQUE5QixDQUFtQyxJQUFuQztjQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsVUFBUCxDQUFrQixPQUFsQixDQUFQLENBQWtDLENBQUMsYUFBbkMsQ0FBQTtxQkFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLFVBQVAsQ0FBa0IsT0FBbEIsQ0FBMEIsQ0FBQyxPQUFPLENBQUMsYUFBbkMsQ0FBaUQsUUFBakQsQ0FBUCxDQUFrRSxDQUFDLFdBQW5FLENBQStFLE1BQS9FO1lBSEcsQ0FBTDtVQVY4QyxDQUFoRDtpQkFlQSxFQUFBLENBQUcsc0RBQUgsRUFBMkQsU0FBQTtBQUN6RCxnQkFBQTtZQUFBLE9BQUEsR0FBVTtZQUVWLGVBQUEsQ0FBZ0IsU0FBQTtxQkFDZCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsWUFBcEIsRUFBa0M7Z0JBQUEsT0FBQSxFQUFTLElBQVQ7ZUFBbEMsQ0FBZ0QsQ0FBQyxJQUFqRCxDQUFzRCxTQUFDLENBQUQ7dUJBQU8sT0FBQSxHQUFVO2NBQWpCLENBQXREO1lBRGMsQ0FBaEI7bUJBR0EsSUFBQSxDQUFLLFNBQUE7Y0FDSCxJQUFJLENBQUMsWUFBTCxDQUFrQixPQUFsQjtjQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsVUFBUCxDQUFrQixPQUFsQixDQUEwQixDQUFDLE9BQU8sQ0FBQyxhQUFuQyxDQUFpRCxRQUFqRCxDQUFQLENBQWtFLENBQUMsV0FBbkUsQ0FBK0UsTUFBL0U7Y0FDQSxpQkFBQSxDQUFrQixVQUFsQixFQUE4QixNQUFNLENBQUMsVUFBUCxDQUFrQixPQUFsQixDQUEwQixDQUFDLE9BQXpELEVBQWtFO2dCQUFBLEtBQUEsRUFBTyxDQUFQO2VBQWxFO3FCQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsVUFBUCxDQUFrQixPQUFsQixDQUEwQixDQUFDLE9BQU8sQ0FBQyxhQUFuQyxDQUFpRCxRQUFqRCxDQUFQLENBQWtFLENBQUMsR0FBRyxDQUFDLFdBQXZFLENBQW1GLE1BQW5GO1lBSkcsQ0FBTDtVQU55RCxDQUEzRDtRQWhCMkMsQ0FBN0M7UUE0QkEsUUFBQSxDQUFTLHNDQUFULEVBQWlELFNBQUE7aUJBQy9DLEVBQUEsQ0FBRyxrQ0FBSCxFQUF1QyxTQUFBO1lBQ3JDLE9BQUEsR0FBVTtZQUNWLGVBQUEsQ0FBZ0IsU0FBQTtxQkFDZCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsWUFBcEIsRUFBa0M7Z0JBQUEsT0FBQSxFQUFTLElBQVQ7ZUFBbEMsQ0FBZ0QsQ0FBQyxJQUFqRCxDQUFzRCxTQUFDLENBQUQ7Z0JBQ3BELE9BQUEsR0FBVTtnQkFDVixJQUFJLENBQUMsWUFBTCxDQUFrQixPQUFsQjtnQkFDQSxPQUFPLENBQUMsVUFBUixDQUFtQixHQUFuQjt1QkFDQSxZQUFBLENBQWEsT0FBTyxDQUFDLE1BQU0sQ0FBQyxvQkFBNUI7Y0FKb0QsQ0FBdEQ7WUFEYyxDQUFoQjttQkFPQSxJQUFBLENBQUssU0FBQTtxQkFDSCxNQUFBLENBQU8sTUFBTSxDQUFDLFVBQVAsQ0FBa0IsT0FBbEIsQ0FBMEIsQ0FBQyxPQUFPLENBQUMsYUFBbkMsQ0FBaUQsUUFBakQsQ0FBUCxDQUFrRSxDQUFDLEdBQUcsQ0FBQyxXQUF2RSxDQUFtRixNQUFuRjtZQURHLENBQUw7VUFUcUMsQ0FBdkM7UUFEK0MsQ0FBakQ7UUFhQSxRQUFBLENBQVMsb0JBQVQsRUFBK0IsU0FBQTtpQkFDN0IsRUFBQSxDQUFHLHlCQUFILEVBQThCLFNBQUE7WUFDNUIsT0FBQSxHQUFVO1lBQ1YsZUFBQSxDQUFnQixTQUFBO3FCQUNkLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixJQUFJLENBQUMsSUFBTCxDQUFVLElBQUksQ0FBQyxTQUFMLENBQWUsT0FBZixDQUFWLEVBQW1DLFlBQW5DLENBQXBCLEVBQXNFO2dCQUFBLE9BQUEsRUFBUyxJQUFUO2VBQXRFLENBQW9GLENBQUMsSUFBckYsQ0FBMEYsU0FBQyxDQUFEO2dCQUN4RixPQUFBLEdBQVU7Z0JBQ1YsSUFBSSxDQUFDLFlBQUwsQ0FBa0IsT0FBbEI7dUJBQ0EsT0FBTyxDQUFDLElBQVIsQ0FBQTtjQUh3RixDQUExRjtZQURjLENBQWhCO21CQU1BLElBQUEsQ0FBSyxTQUFBO3FCQUNILE1BQUEsQ0FBTyxNQUFNLENBQUMsVUFBUCxDQUFrQixPQUFsQixDQUEwQixDQUFDLE9BQU8sQ0FBQyxhQUFuQyxDQUFpRCxRQUFqRCxDQUFQLENBQWtFLENBQUMsR0FBRyxDQUFDLFdBQXZFLENBQW1GLE1BQW5GO1lBREcsQ0FBTDtVQVI0QixDQUE5QjtRQUQ2QixDQUEvQjtRQVlBLFFBQUEsQ0FBUyw4QkFBVCxFQUF5QyxTQUFBO1VBQ3ZDLE9BQUEsR0FBVTtVQUNWLFVBQUEsQ0FBVyxTQUFBO21CQUNULGVBQUEsQ0FBZ0IsU0FBQTtxQkFDZCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsWUFBcEIsRUFBa0M7Z0JBQUEsT0FBQSxFQUFTLElBQVQ7ZUFBbEMsQ0FBZ0QsQ0FBQyxJQUFqRCxDQUFzRCxTQUFDLENBQUQ7dUJBQU8sT0FBQSxHQUFVO2NBQWpCLENBQXREO1lBRGMsQ0FBaEI7VUFEUyxDQUFYO1VBSUEsRUFBQSxDQUFHLHlDQUFILEVBQThDLFNBQUE7QUFDNUMsZ0JBQUE7WUFBQSxJQUFJLENBQUMsWUFBTCxDQUFrQixPQUFsQjtZQUNBLEtBQUEsR0FBUSxJQUFJLENBQUMsVUFBTCxDQUFnQjtjQUFBLGNBQUEsRUFBZ0IsSUFBaEI7YUFBaEI7WUFDUixPQUFBLEdBQWMsSUFBQSxVQUFBLENBQVcsS0FBWCxFQUFrQixRQUFsQjtZQUNkLFNBQUEsR0FBWSxLQUFLLENBQUMsYUFBTixDQUFBO1lBQ1osTUFBQSxDQUFPLFNBQUEsQ0FBVSxTQUFWLENBQVAsQ0FBNEIsQ0FBQyxJQUE3QixDQUFrQyxLQUFsQzttQkFDQSxNQUFBLENBQU8sT0FBTyxDQUFDLFVBQVIsQ0FBbUIsU0FBbkIsQ0FBNkIsQ0FBQyxPQUFPLENBQUMsYUFBdEMsQ0FBb0QsUUFBcEQsQ0FBUCxDQUFxRSxDQUFDLEdBQUcsQ0FBQyxXQUExRSxDQUFzRixNQUF0RjtVQU40QyxDQUE5QztpQkFRQSxFQUFBLENBQUcsdUNBQUgsRUFBNEMsU0FBQTtZQUMxQyxNQUFBLENBQU8sU0FBQSxDQUFVLE9BQVYsQ0FBUCxDQUEwQixDQUFDLElBQTNCLENBQWdDLElBQWhDO21CQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsVUFBUCxDQUFrQixPQUFsQixDQUEwQixDQUFDLE9BQU8sQ0FBQyxhQUFuQyxDQUFpRCxRQUFqRCxDQUFQLENBQWtFLENBQUMsV0FBbkUsQ0FBK0UsTUFBL0U7VUFGMEMsQ0FBNUM7UUFkdUMsQ0FBekM7ZUFrQkEsUUFBQSxDQUFTLGlEQUFULEVBQTRELFNBQUE7aUJBQzFELEVBQUEsQ0FBRywyQ0FBSCxFQUFnRCxTQUFBO1lBQzlDLE9BQUEsR0FBVTtZQUNWLGVBQUEsQ0FBZ0IsU0FBQTtxQkFDZCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsWUFBcEIsRUFBa0M7Z0JBQUEsT0FBQSxFQUFTLElBQVQ7ZUFBbEMsQ0FBZ0QsQ0FBQyxJQUFqRCxDQUFzRCxTQUFDLENBQUQ7dUJBQU8sT0FBQSxHQUFVO2NBQWpCLENBQXREO1lBRGMsQ0FBaEI7bUJBR0EsSUFBQSxDQUFLLFNBQUE7QUFDSCxrQkFBQTtjQUFBLElBQUksQ0FBQyxZQUFMLENBQWtCLE9BQWxCO2NBQ0EsS0FBQSxHQUFRLElBQUksQ0FBQyxVQUFMLENBQUE7Y0FFUixPQUFBLEdBQWMsSUFBQSxVQUFBLENBQVcsS0FBWCxFQUFrQixRQUFsQjtjQUNkLE9BQU8sQ0FBQyxvQkFBUixDQUE2QixJQUE3QixFQUFtQyxDQUFuQyxFQUFzQyxLQUF0QyxFQUE2QyxDQUE3QyxFQUFnRCxPQUFoRDtxQkFFQSxNQUFBLENBQU8sT0FBTyxDQUFDLFVBQVIsQ0FBbUIsS0FBSyxDQUFDLGFBQU4sQ0FBQSxDQUFuQixDQUF5QyxDQUFDLE9BQU8sQ0FBQyxhQUFsRCxDQUFnRSxRQUFoRSxDQUFQLENBQWlGLENBQUMsR0FBRyxDQUFDLFdBQXRGLENBQWtHLE1BQWxHO1lBUEcsQ0FBTDtVQUw4QyxDQUFoRDtRQUQwRCxDQUE1RDtNQWxHMEMsQ0FBNUMsRUFQRjs7V0F3SEEsUUFBQSxDQUFTLDBDQUFULEVBQXFELFNBQUE7QUFDbkQsVUFBQTtNQUFBLE9BQTBCLEVBQTFCLEVBQUMsb0JBQUQsRUFBYSxhQUFiLEVBQWtCO01BRWxCLFVBQUEsQ0FBVyxTQUFBO1FBQ1QsR0FBQSxHQUFNLE1BQU0sQ0FBQyxVQUFQLENBQWtCLE9BQWxCO1FBQ04sS0FBQSxDQUFNLEdBQU4sRUFBVyxnQkFBWCxDQUE0QixDQUFDLGNBQTdCLENBQUE7UUFDQSxLQUFBLENBQU0sR0FBTixFQUFXLGlCQUFYLENBQTZCLENBQUMsY0FBOUIsQ0FBQTtRQUVBLElBQUEsR0FBTyxNQUFNLENBQUMsVUFBUCxDQUFrQixLQUFsQjtRQUNQLElBQUksQ0FBQyxJQUFMLEdBQVk7UUFDWixLQUFBLENBQU0sSUFBTixFQUFZLGlCQUFaLENBQThCLENBQUMsY0FBL0IsQ0FBQTtRQUdBLFVBQUEsR0FBYSxPQUFPLENBQUMsWUFBUixDQUFxQixNQUFyQixFQUE2QixDQUFDLGVBQUQsRUFBa0IscUJBQWxCLEVBQXlDLGFBQXpDLEVBQXdELGtCQUF4RCxDQUE3QjtRQUNiLFVBQVUsQ0FBQyxXQUFXLENBQUMsV0FBdkIsQ0FBbUMsU0FBQyxNQUFEO2lCQUFZLE1BQUEsS0FBVTtRQUF0QixDQUFuQztRQUNBLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxXQUE1QixDQUF3QyxTQUFDLE1BQUQ7aUJBQVksTUFBQSxLQUFVO1FBQXRCLENBQXhDO1FBRUEsVUFBVSxDQUFDLGlCQUFYLEdBQStCLFNBQUMsUUFBRDs7WUFDN0IsSUFBQyxDQUFBLHdCQUF5Qjs7VUFDMUIsSUFBQyxDQUFBLHFCQUFxQixDQUFDLElBQXZCLENBQTRCLFFBQTVCO2lCQUNBO1lBQUEsT0FBQSxFQUFTLENBQUEsU0FBQSxLQUFBO3FCQUFBLFNBQUE7dUJBQUcsQ0FBQyxDQUFDLE1BQUYsQ0FBUyxLQUFDLENBQUEscUJBQVYsRUFBaUMsUUFBakM7Y0FBSDtZQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBVDs7UUFINkI7UUFJL0IsVUFBVSxDQUFDLG1CQUFYLEdBQWlDLFNBQUMsS0FBRDtBQUMvQixjQUFBO0FBQUE7QUFBQTtlQUFBLHNDQUFBOzt5QkFBQSxRQUFBLENBQVMsS0FBVDtBQUFBOztRQUQrQjtRQUdqQyxVQUFVLENBQUMsbUJBQVgsR0FBaUMsU0FBQyxRQUFEOztZQUMvQixJQUFDLENBQUEsMEJBQTJCOztVQUM1QixJQUFDLENBQUEsdUJBQXVCLENBQUMsSUFBekIsQ0FBOEIsUUFBOUI7aUJBQ0E7WUFBQSxPQUFBLEVBQVMsQ0FBQSxTQUFBLEtBQUE7cUJBQUEsU0FBQTt1QkFBRyxDQUFDLENBQUMsTUFBRixDQUFTLEtBQUMsQ0FBQSx1QkFBVixFQUFtQyxRQUFuQztjQUFIO1lBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFUOztRQUgrQjtRQUlqQyxVQUFVLENBQUMscUJBQVgsR0FBbUMsU0FBQyxLQUFEO0FBQ2pDLGNBQUE7QUFBQTtBQUFBO2VBQUEsc0NBQUE7O3lCQUFBLFFBQUEsQ0FBUyxLQUFUO0FBQUE7O1FBRGlDO1FBSW5DLEtBQUEsQ0FBTSxJQUFJLENBQUMsT0FBWCxFQUFvQix3QkFBcEIsQ0FBNkMsQ0FBQyxTQUE5QyxDQUF3RCxPQUFPLENBQUMsT0FBUixDQUFnQixVQUFoQixDQUF4RDtRQUVBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix3QkFBaEIsRUFBMEMsSUFBMUM7ZUFFQSxRQUFBLENBQVMsU0FBQTtBQUNQLGNBQUE7MEVBQWdDLENBQUUsZ0JBQWxDLEdBQTJDO1FBRHBDLENBQVQ7TUFqQ1MsQ0FBWDtNQW9DQSxRQUFBLENBQVMsc0NBQVQsRUFBaUQsU0FBQTtRQUMvQyxFQUFBLENBQUcsaUNBQUgsRUFBc0MsU0FBQTtVQUNwQyxVQUFVLENBQUMsbUJBQW1CLENBQUMsU0FBL0IsQ0FBeUMsS0FBekM7VUFDQSxHQUFHLENBQUMsZUFBSixDQUFvQixVQUFwQjtpQkFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyxnQkFBZixDQUFnQyxNQUFoQyxDQUF3QyxDQUFBLENBQUEsQ0FBRSxDQUFDLGFBQTNDLENBQXlELFFBQXpELENBQVAsQ0FBMEUsQ0FBQyxXQUEzRSxDQUF1RixjQUF2RjtRQUhvQyxDQUF0QztRQUtBLEVBQUEsQ0FBRyxzQ0FBSCxFQUEyQyxTQUFBO1VBQ3pDLFVBQVUsQ0FBQyxtQkFBbUIsQ0FBQyxTQUEvQixDQUF5QyxVQUF6QztVQUNBLEdBQUcsQ0FBQyxlQUFKLENBQW9CLFVBQXBCO2lCQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBTyxDQUFDLGdCQUFmLENBQWdDLE1BQWhDLENBQXdDLENBQUEsQ0FBQSxDQUFFLENBQUMsYUFBM0MsQ0FBeUQsUUFBekQsQ0FBUCxDQUEwRSxDQUFDLFdBQTNFLENBQXVGLGlCQUF2RjtRQUh5QyxDQUEzQztRQUtBLEVBQUEsQ0FBRyxxQ0FBSCxFQUEwQyxTQUFBO1VBQ3hDLFVBQVUsQ0FBQyxhQUFhLENBQUMsU0FBekIsQ0FBbUMsSUFBbkM7VUFDQSxHQUFHLENBQUMsZUFBSixDQUFvQixVQUFwQjtpQkFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyxnQkFBZixDQUFnQyxNQUFoQyxDQUF3QyxDQUFBLENBQUEsQ0FBRSxDQUFDLGFBQTNDLENBQXlELFFBQXpELENBQVAsQ0FBMEUsQ0FBQyxXQUEzRSxDQUF1RixnQkFBdkY7UUFId0MsQ0FBMUM7ZUFLQSxFQUFBLENBQUcseURBQUgsRUFBOEQsU0FBQTtVQUM1RCxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyxnQkFBZixDQUFnQyxNQUFoQyxDQUF3QyxDQUFBLENBQUEsQ0FBRSxDQUFDLGFBQTNDLENBQXlELFFBQXpELENBQVAsQ0FBMEUsQ0FBQyxHQUFHLENBQUMsV0FBL0UsQ0FBMkYsY0FBM0Y7VUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyxnQkFBZixDQUFnQyxNQUFoQyxDQUF3QyxDQUFBLENBQUEsQ0FBRSxDQUFDLGFBQTNDLENBQXlELFFBQXpELENBQVAsQ0FBMEUsQ0FBQyxHQUFHLENBQUMsV0FBL0UsQ0FBMkYsaUJBQTNGO2lCQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBTyxDQUFDLGdCQUFmLENBQWdDLE1BQWhDLENBQXdDLENBQUEsQ0FBQSxDQUFFLENBQUMsYUFBM0MsQ0FBeUQsUUFBekQsQ0FBUCxDQUEwRSxDQUFDLEdBQUcsQ0FBQyxXQUEvRSxDQUEyRixnQkFBM0Y7UUFINEQsQ0FBOUQ7TUFoQitDLENBQWpEO01BcUJBLFFBQUEsQ0FBUyw0Q0FBVCxFQUF1RCxTQUFBO1FBQ3JELEVBQUEsQ0FBRyw0Q0FBSCxFQUFpRCxTQUFBO1VBQy9DLEdBQUcsQ0FBQyxlQUFlLENBQUMsS0FBcEIsQ0FBQTtVQUNBLFVBQVUsQ0FBQyxxQkFBWCxDQUFBO2lCQUNBLE1BQUEsQ0FBTyxHQUFHLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxNQUFqQyxDQUF3QyxDQUFDLE9BQXpDLENBQWlELENBQWpEO1FBSCtDLENBQWpEO1FBS0EsRUFBQSxDQUFHLGlEQUFILEVBQXNELFNBQUE7VUFDcEQsVUFBVSxDQUFDLG1CQUFtQixDQUFDLEtBQS9CLENBQUE7VUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyxnQkFBZixDQUFnQyxNQUFoQyxDQUF3QyxDQUFBLENBQUEsQ0FBRSxDQUFDLGFBQTNDLENBQXlELFFBQXpELENBQVAsQ0FBMEUsQ0FBQyxHQUFHLENBQUMsV0FBL0UsQ0FBMkYsaUJBQTNGO1VBQ0EsVUFBVSxDQUFDLG1CQUFYLENBQStCO1lBQUMsSUFBQSxFQUFNLEdBQUcsQ0FBQyxJQUFYO1lBQWlCLFVBQUEsRUFBWSxVQUE3QjtXQUEvQjtVQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBTyxDQUFDLGdCQUFmLENBQWdDLE1BQWhDLENBQXdDLENBQUEsQ0FBQSxDQUFFLENBQUMsYUFBM0MsQ0FBeUQsUUFBekQsQ0FBUCxDQUEwRSxDQUFDLFdBQTNFLENBQXVGLGlCQUF2RjtpQkFDQSxNQUFBLENBQU8sVUFBVSxDQUFDLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxNQUE1QyxDQUFtRCxDQUFDLElBQXBELENBQXlELENBQXpEO1FBTG9ELENBQXREO2VBT0EsRUFBQSxDQUFHLHdEQUFILEVBQTZELFNBQUE7VUFDM0QsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFyQixDQUFBO1VBQ0EsVUFBVSxDQUFDLHFCQUFYLENBQUE7aUJBQ0EsTUFBQSxDQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLE1BQWxDLENBQXlDLENBQUMsT0FBMUMsQ0FBa0QsQ0FBbEQ7UUFIMkQsQ0FBN0Q7TUFicUQsQ0FBdkQ7TUFrQkEsUUFBQSxDQUFTLHVCQUFULEVBQWtDLFNBQUE7UUFDaEMsRUFBQSxDQUFHLHNFQUFILEVBQTJFLFNBQUE7VUFDekUsR0FBRyxDQUFDLGNBQWMsQ0FBQyxLQUFuQixDQUFBO1VBQ0EsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQXhCLENBQTZCLFVBQTdCLEVBQXlDO1lBQUMsSUFBQSxFQUFNLEdBQUcsQ0FBQyxJQUFYO1dBQXpDO2lCQUNBLE1BQUEsQ0FBTyxHQUFHLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxNQUFoQyxDQUF1QyxDQUFDLElBQXhDLENBQTZDLENBQTdDO1FBSHlFLENBQTNFO2VBS0EsRUFBQSxDQUFHLHlEQUFILEVBQThELFNBQUE7VUFDNUQsR0FBRyxDQUFDLGNBQWMsQ0FBQyxLQUFuQixDQUFBO1VBQ0EsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQXhCLENBQTZCLFVBQTdCLEVBQXlDO1lBQUMsSUFBQSxFQUFNLGtCQUFQO1dBQXpDO2lCQUNBLE1BQUEsQ0FBTyxHQUFHLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxNQUFoQyxDQUF1QyxDQUFDLElBQXhDLENBQTZDLENBQTdDO1FBSDRELENBQTlEO01BTmdDLENBQWxDO01BV0EsUUFBQSxDQUFTLG9EQUFULEVBQStELFNBQUE7UUFDN0QsRUFBQSxDQUFHLGtFQUFILEVBQXVFLFNBQUE7VUFDckUsVUFBVSxDQUFDLG1CQUFYLENBQStCO1lBQUMsSUFBQSxFQUFNLEdBQUcsQ0FBQyxJQUFYO1lBQWlCLFVBQUEsRUFBWSxLQUE3QjtXQUEvQjtVQUVBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBTyxDQUFDLGdCQUFmLENBQWdDLE1BQWhDLENBQXdDLENBQUEsQ0FBQSxDQUFFLENBQUMsYUFBM0MsQ0FBeUQsUUFBekQsQ0FBUCxDQUEwRSxDQUFDLFdBQTNFLENBQXVGLGNBQXZGO1VBQ0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHdCQUFoQixFQUEwQyxLQUExQztpQkFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyxnQkFBZixDQUFnQyxNQUFoQyxDQUF3QyxDQUFBLENBQUEsQ0FBRSxDQUFDLGFBQTNDLENBQXlELFFBQXpELENBQVAsQ0FBMEUsQ0FBQyxHQUFHLENBQUMsV0FBL0UsQ0FBMkYsY0FBM0Y7UUFMcUUsQ0FBdkU7ZUFPQSxFQUFBLENBQUcsNERBQUgsRUFBaUUsU0FBQTtVQUMvRCxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isd0JBQWhCLEVBQTBDLEtBQTFDO1VBQ0EsVUFBVSxDQUFDLG1CQUFtQixDQUFDLFNBQS9CLENBQXlDLFVBQXpDO1VBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFPLENBQUMsZ0JBQWYsQ0FBZ0MsTUFBaEMsQ0FBd0MsQ0FBQSxDQUFBLENBQUUsQ0FBQyxhQUEzQyxDQUF5RCxRQUF6RCxDQUFQLENBQTBFLENBQUMsR0FBRyxDQUFDLFdBQS9FLENBQTJGLGlCQUEzRjtVQUNBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix3QkFBaEIsRUFBMEMsSUFBMUM7VUFFQSxRQUFBLENBQVMsU0FBQTtBQUNQLGdCQUFBOzRFQUFnQyxDQUFFLGdCQUFsQyxHQUEyQztVQURwQyxDQUFUO2lCQUdBLElBQUEsQ0FBSyxTQUFBO21CQUNILE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBTyxDQUFDLGdCQUFmLENBQWdDLE1BQWhDLENBQXdDLENBQUEsQ0FBQSxDQUFFLENBQUMsYUFBM0MsQ0FBeUQsUUFBekQsQ0FBUCxDQUEwRSxDQUFDLFdBQTNFLENBQXVGLGlCQUF2RjtVQURHLENBQUw7UUFUK0QsQ0FBakU7TUFSNkQsQ0FBL0Q7TUFvQkEsSUFBRyxrQ0FBSDtlQUNFLFFBQUEsQ0FBUyxvQkFBVCxFQUErQixTQUFBO1VBQzdCLFVBQUEsQ0FBVyxTQUFBO21CQUFHLElBQUksQ0FBQyxRQUFMLENBQUE7VUFBSCxDQUFYO1VBQ0EsU0FBQSxDQUFVLFNBQUE7bUJBQUcsSUFBSSxDQUFDLFVBQUwsQ0FBQTtVQUFILENBQVY7aUJBQ0EsRUFBQSxDQUFHLDBCQUFILEVBQStCLFNBQUE7QUFDN0IsZ0JBQUE7WUFBQSxJQUFBLEdBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFmLENBQUE7WUFDUCxXQUFBLEdBQWMsSUFBSSxDQUFDLFVBQUwsQ0FBQTtZQUNkLElBQUEsR0FBVyxJQUFBLFFBQUEsQ0FBUyxhQUFUO1lBQ1gsTUFBQSxDQUFPLFdBQVcsQ0FBQyxnQkFBWixDQUE2QixNQUE3QixDQUFvQyxDQUFDLE1BQTVDLENBQW1ELENBQUMsSUFBcEQsQ0FBeUQsQ0FBekQ7WUFDQSxJQUFBLEdBQU8sSUFBSSxDQUFDLGFBQUwsQ0FBQTtZQUNQLElBQUksQ0FBQyxZQUFMLENBQWtCLElBQWxCO1lBQ0EsTUFBQSxDQUFPLFdBQVcsQ0FBQyxnQkFBWixDQUE2QixNQUE3QixDQUFvQyxDQUFDLE1BQTVDLENBQW1ELENBQUMsSUFBcEQsQ0FBeUQsQ0FBekQ7WUFDQSxJQUFJLENBQUMsV0FBTCxDQUFpQixJQUFqQjttQkFDQSxNQUFBLENBQU8sV0FBVyxDQUFDLGdCQUFaLENBQTZCLE1BQTdCLENBQW9DLENBQUMsTUFBNUMsQ0FBbUQsQ0FBQyxJQUFwRCxDQUF5RCxDQUF6RDtVQVQ2QixDQUEvQjtRQUg2QixDQUEvQixFQURGOztJQTdHbUQsQ0FBckQ7RUFydUNxQixDQUF2QjtBQTdEQSIsInNvdXJjZXNDb250ZW50IjpbIl8gPSByZXF1aXJlICd1bmRlcnNjb3JlLXBsdXMnXG5wYXRoID0gcmVxdWlyZSAncGF0aCdcbnRlbXAgPSByZXF1aXJlICd0ZW1wJ1xuVGFiQmFyVmlldyA9IHJlcXVpcmUgJy4uL2xpYi90YWItYmFyLXZpZXcnXG5sYXlvdXQgPSByZXF1aXJlICcuLi9saWIvbGF5b3V0J1xubWFpbiA9IHJlcXVpcmUgJy4uL2xpYi9tYWluJ1xue3RyaWdnZXJNb3VzZUV2ZW50LCBidWlsZERyYWdFdmVudHMsIGJ1aWxkV2hlZWxFdmVudCwgYnVpbGRXaGVlbFBsdXNTaGlmdEV2ZW50fSA9IHJlcXVpcmUgXCIuL2V2ZW50LWhlbHBlcnNcIlxuXG5hZGRJdGVtVG9QYW5lID0gKHBhbmUsIGl0ZW0sIGluZGV4KSAtPlxuICAjIFN1cHBvcnQgYm90aCB0aGUgMS41IGFuZCAxLjYgQVBJXG4gICMgVE9ETzogUmVtb3ZlIG9uY2UgMS42IGlzIHN0YWJsZSBbTUtUXVxuICBpZiBwYW5lLmFkZEl0ZW0ubGVuZ3RoIGlzIDJcbiAgICBwYW5lLmFkZEl0ZW0oaXRlbSwgaW5kZXg6IGluZGV4KVxuICBlbHNlIGlmIHBhbmUuYWRkSXRlbS5sZW5ndGggaXMgMyBvciBwYW5lLmFkZEl0ZW0ubGVuZ3RoIGlzIDRcbiAgICBwYW5lLmFkZEl0ZW0oaXRlbSwgaW5kZXgpXG4gIGVsc2VcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbnNwb29ydGVkIHBhbmUuYWRkSXRlbSBBUElcIilcblxuIyBUT0RPOiBSZW1vdmUgdGhpcyBhZnRlciBhdG9tL2F0b20jMTM5NzcgbGFuZHMgaW4gZmF2b3Igb2YgdW5ndWFyZGVkIGBnZXRDZW50ZXIoKWAgY2FsbHNcbmdldENlbnRlciA9IC0+IGF0b20ud29ya3NwYWNlLmdldENlbnRlcj8oKSA/IGF0b20ud29ya3NwYWNlXG5cbmRlc2NyaWJlIFwiVGFicyBwYWNrYWdlIG1haW5cIiwgLT5cbiAgY2VudGVyRWxlbWVudCA9IG51bGxcblxuICBiZWZvcmVFYWNoIC0+XG4gICAgY2VudGVyRWxlbWVudCA9IGdldENlbnRlcigpLnBhbmVDb250YWluZXIuZ2V0RWxlbWVudCgpXG5cbiAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oJ3NhbXBsZS5qcycpXG5cbiAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgIGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKFwidGFic1wiKVxuXG4gIGRlc2NyaWJlIFwiLmFjdGl2YXRlKClcIiwgLT5cbiAgICBpdCBcImFwcGVuZHMgYSB0YWIgYmFyIGFsbCBleGlzdGluZyBhbmQgbmV3IHBhbmVzXCIsIC0+XG4gICAgICBleHBlY3QoY2VudGVyRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucGFuZScpLmxlbmd0aCkudG9CZSAxXG4gICAgICBleHBlY3QoY2VudGVyRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucGFuZSA+IC50YWItYmFyJykubGVuZ3RoKS50b0JlIDFcblxuICAgICAgcGFuZSA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKVxuICAgICAgcGFuZS5zcGxpdFJpZ2h0KClcblxuICAgICAgZXhwZWN0KGNlbnRlckVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnBhbmUnKS5sZW5ndGgpLnRvQmUgMlxuICAgICAgdGFiQmFycyA9IGNlbnRlckVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnBhbmUgPiAudGFiLWJhcicpXG4gICAgICBleHBlY3QodGFiQmFycy5sZW5ndGgpLnRvQmUgMlxuICAgICAgZXhwZWN0KHRhYkJhcnNbMV0uZ2V0QXR0cmlidXRlKCdsb2NhdGlvbicpKS50b0JlKCdjZW50ZXInKVxuXG4gIGRlc2NyaWJlIFwiLmRlYWN0aXZhdGUoKVwiLCAtPlxuICAgIGl0IFwicmVtb3ZlcyBhbGwgdGFiIGJhciB2aWV3cyBhbmQgc3RvcHMgYWRkaW5nIHRoZW0gdG8gbmV3IHBhbmVzXCIsIC0+XG4gICAgICBwYW5lID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpXG4gICAgICBwYW5lLnNwbGl0UmlnaHQoKVxuICAgICAgZXhwZWN0KGNlbnRlckVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnBhbmUnKS5sZW5ndGgpLnRvQmUgMlxuICAgICAgZXhwZWN0KGNlbnRlckVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnBhbmUgPiAudGFiLWJhcicpLmxlbmd0aCkudG9CZSAyXG5cbiAgICAgIGF0b20ucGFja2FnZXMuZGVhY3RpdmF0ZVBhY2thZ2UoJ3RhYnMnKVxuICAgICAgZXhwZWN0KGNlbnRlckVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnBhbmUnKS5sZW5ndGgpLnRvQmUgMlxuICAgICAgZXhwZWN0KGNlbnRlckVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnBhbmUgPiAudGFiLWJhcicpLmxlbmd0aCkudG9CZSAwXG5cbiAgICAgIHBhbmUuc3BsaXRSaWdodCgpXG4gICAgICBleHBlY3QoY2VudGVyRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucGFuZScpLmxlbmd0aCkudG9CZSAzXG4gICAgICBleHBlY3QoY2VudGVyRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucGFuZSA+IC50YWItYmFyJykubGVuZ3RoKS50b0JlIDBcblxuZGVzY3JpYmUgXCJUYWJCYXJWaWV3XCIsIC0+XG4gIFtkZXNlcmlhbGl6ZXJEaXNwb3NhYmxlLCBpdGVtMSwgaXRlbTIsIGVkaXRvcjEsIHBhbmUsIHRhYkJhcl0gPSBbXVxuXG4gIGNsYXNzIFRlc3RWaWV3XG4gICAgQGRlc2VyaWFsaXplOiAoe3RpdGxlLCBsb25nVGl0bGUsIGljb25OYW1lfSkgLT4gbmV3IFRlc3RWaWV3KHRpdGxlLCBsb25nVGl0bGUsIGljb25OYW1lKVxuICAgIGNvbnN0cnVjdG9yOiAoQHRpdGxlLCBAbG9uZ1RpdGxlLCBAaWNvbk5hbWUsIEBwYXRoVVJJLCBpc1Blcm1hbmVudERvY2tJdGVtKSAtPlxuICAgICAgQF9pc1Blcm1hbmVudERvY2tJdGVtID0gaXNQZXJtYW5lbnREb2NrSXRlbVxuICAgICAgQGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgICAgQGVsZW1lbnQudGV4dENvbnRlbnQgPSBAdGl0bGVcbiAgICAgIGlmIGlzUGVybWFuZW50RG9ja0l0ZW0/XG4gICAgICAgIEBpc1Blcm1hbmVudERvY2tJdGVtID0gLT4gaXNQZXJtYW5lbnREb2NrSXRlbVxuICAgIGdldFRpdGxlOiAtPiBAdGl0bGVcbiAgICBnZXRMb25nVGl0bGU6IC0+IEBsb25nVGl0bGVcbiAgICBnZXRVUkk6IC0+IEBwYXRoVVJJXG4gICAgZ2V0SWNvbk5hbWU6IC0+IEBpY29uTmFtZVxuICAgIHNlcmlhbGl6ZTogLT4ge2Rlc2VyaWFsaXplcjogJ1Rlc3RWaWV3JywgQHRpdGxlLCBAbG9uZ1RpdGxlLCBAaWNvbk5hbWV9XG4gICAgY29weTogLT4gbmV3IFRlc3RWaWV3KEB0aXRsZSwgQGxvbmdUaXRsZSwgQGljb25OYW1lKVxuICAgIG9uRGlkQ2hhbmdlVGl0bGU6IChjYWxsYmFjaykgLT5cbiAgICAgIEB0aXRsZUNhbGxiYWNrcyA/PSBbXVxuICAgICAgQHRpdGxlQ2FsbGJhY2tzLnB1c2goY2FsbGJhY2spXG4gICAgICBkaXNwb3NlOiA9PiBfLnJlbW92ZShAdGl0bGVDYWxsYmFja3MsIGNhbGxiYWNrKVxuICAgIGVtaXRUaXRsZUNoYW5nZWQ6IC0+XG4gICAgICBjYWxsYmFjaygpIGZvciBjYWxsYmFjayBpbiBAdGl0bGVDYWxsYmFja3MgPyBbXVxuICAgIG9uRGlkQ2hhbmdlSWNvbjogKGNhbGxiYWNrKSAtPlxuICAgICAgQGljb25DYWxsYmFja3MgPz0gW11cbiAgICAgIEBpY29uQ2FsbGJhY2tzLnB1c2goY2FsbGJhY2spXG4gICAgICBkaXNwb3NlOiA9PiBfLnJlbW92ZShAaWNvbkNhbGxiYWNrcywgY2FsbGJhY2spXG4gICAgZW1pdEljb25DaGFuZ2VkOiAtPlxuICAgICAgY2FsbGJhY2soKSBmb3IgY2FsbGJhY2sgaW4gQGljb25DYWxsYmFja3MgPyBbXVxuICAgIG9uRGlkQ2hhbmdlTW9kaWZpZWQ6IC0+ICMgdG8gc3VwcHJlc3MgZGVwcmVjYXRpb24gd2FybmluZ1xuICAgICAgZGlzcG9zZTogLT5cblxuICBiZWZvcmVFYWNoIC0+XG4gICAgZGVzZXJpYWxpemVyRGlzcG9zYWJsZSA9IGF0b20uZGVzZXJpYWxpemVycy5hZGQoVGVzdFZpZXcpXG4gICAgaXRlbTEgPSBuZXcgVGVzdFZpZXcoJ0l0ZW0gMScsIHVuZGVmaW5lZCwgXCJzcXVpcnJlbFwiLCBcInNhbXBsZS5qc1wiKVxuICAgIGl0ZW0yID0gbmV3IFRlc3RWaWV3KCdJdGVtIDInKVxuXG4gICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKCdzYW1wbGUuanMnKVxuXG4gICAgcnVucyAtPlxuICAgICAgZWRpdG9yMSA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgICAgcGFuZSA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKVxuICAgICAgYWRkSXRlbVRvUGFuZShwYW5lLCBpdGVtMSwgMClcbiAgICAgIGFkZEl0ZW1Ub1BhbmUocGFuZSwgaXRlbTIsIDIpXG4gICAgICBwYW5lLmFjdGl2YXRlSXRlbShpdGVtMilcbiAgICAgIHRhYkJhciA9IG5ldyBUYWJCYXJWaWV3KHBhbmUsICdjZW50ZXInKVxuXG4gIGFmdGVyRWFjaCAtPlxuICAgIGRlc2VyaWFsaXplckRpc3Bvc2FibGUuZGlzcG9zZSgpXG5cbiAgZGVzY3JpYmUgXCJ3aGVuIHRoZSBtb3VzZSBpcyBtb3ZlZCBvdmVyIHRoZSB0YWIgYmFyXCIsIC0+XG4gICAgaXQgXCJmaXhlcyB0aGUgd2lkdGggb24gZXZlcnkgdGFiXCIsIC0+XG4gICAgICBqYXNtaW5lLmF0dGFjaFRvRE9NKHRhYkJhci5lbGVtZW50KVxuXG4gICAgICB0cmlnZ2VyTW91c2VFdmVudCgnbW91c2VlbnRlcicsIHRhYkJhci5lbGVtZW50KVxuXG4gICAgICBpbml0aWFsV2lkdGgxID0gdGFiQmFyLnRhYkF0SW5kZXgoMCkuZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aC50b0ZpeGVkKDApXG4gICAgICBpbml0aWFsV2lkdGgyID0gdGFiQmFyLnRhYkF0SW5kZXgoMikuZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aC50b0ZpeGVkKDApXG5cbiAgICAgICMgTWlub3IgT1MgZGlmZmVyZW5jZXMgY2F1c2UgZnJhY3Rpb25hbC1waXhlbCBkaWZmZXJlbmNlcyBzbyBpZ25vcmUgZnJhY3Rpb25hbCBwYXJ0XG4gICAgICBleHBlY3QocGFyc2VGbG9hdCh0YWJCYXIudGFiQXRJbmRleCgwKS5lbGVtZW50LnN0eWxlLm1heFdpZHRoLnJlcGxhY2UoJ3B4JywgJycpKS50b0ZpeGVkKDApKS50b0JlIGluaXRpYWxXaWR0aDFcbiAgICAgIGV4cGVjdChwYXJzZUZsb2F0KHRhYkJhci50YWJBdEluZGV4KDIpLmVsZW1lbnQuc3R5bGUubWF4V2lkdGgucmVwbGFjZSgncHgnLCAnJykpLnRvRml4ZWQoMCkpLnRvQmUgaW5pdGlhbFdpZHRoMlxuXG4gIGRlc2NyaWJlIFwid2hlbiB0aGUgbW91c2UgaXMgbW92ZWQgYXdheSBmcm9tIHRoZSB0YWIgYmFyXCIsIC0+XG4gICAgaXQgXCJyZXNldHMgdGhlIHdpZHRoIG9uIGV2ZXJ5IHRhYlwiLCAtPlxuICAgICAgamFzbWluZS5hdHRhY2hUb0RPTSh0YWJCYXIuZWxlbWVudClcblxuICAgICAgdHJpZ2dlck1vdXNlRXZlbnQoJ21vdXNlZW50ZXInLCB0YWJCYXIuZWxlbWVudClcbiAgICAgIHRyaWdnZXJNb3VzZUV2ZW50KCdtb3VzZWxlYXZlJywgdGFiQmFyLmVsZW1lbnQpXG5cbiAgICAgIGV4cGVjdCh0YWJCYXIudGFiQXRJbmRleCgwKS5lbGVtZW50LnN0eWxlLm1heFdpZHRoKS50b0JlICcnXG4gICAgICBleHBlY3QodGFiQmFyLnRhYkF0SW5kZXgoMSkuZWxlbWVudC5zdHlsZS5tYXhXaWR0aCkudG9CZSAnJ1xuXG4gIGRlc2NyaWJlIFwiLmluaXRpYWxpemUocGFuZSlcIiwgLT5cbiAgICBpdCBcImNyZWF0ZXMgYSB0YWIgZm9yIGVhY2ggaXRlbSBvbiB0aGUgdGFiIGJhcidzIHBhcmVudCBwYW5lXCIsIC0+XG4gICAgICBleHBlY3QocGFuZS5nZXRJdGVtcygpLmxlbmd0aCkudG9CZSAzXG4gICAgICBleHBlY3QodGFiQmFyLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRhYicpLmxlbmd0aCkudG9CZSAzXG5cbiAgICAgIGV4cGVjdCh0YWJCYXIuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudGFiJylbMF0ucXVlcnlTZWxlY3RvcignLnRpdGxlJykudGV4dENvbnRlbnQpLnRvQmUgaXRlbTEuZ2V0VGl0bGUoKVxuICAgICAgZXhwZWN0KHRhYkJhci5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWInKVswXS5xdWVyeVNlbGVjdG9yKCcudGl0bGUnKS5kYXRhc2V0Lm5hbWUpLnRvQmVVbmRlZmluZWQoKVxuICAgICAgZXhwZWN0KHRhYkJhci5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWInKVswXS5xdWVyeVNlbGVjdG9yKCcudGl0bGUnKS5kYXRhc2V0LnBhdGgpLnRvQmVVbmRlZmluZWQoKVxuICAgICAgZXhwZWN0KHRhYkJhci5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWInKVswXS5kYXRhc2V0LnR5cGUpLnRvQmUoJ1Rlc3RWaWV3JylcblxuICAgICAgZXhwZWN0KHRhYkJhci5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWInKVsxXS5xdWVyeVNlbGVjdG9yKCcudGl0bGUnKS50ZXh0Q29udGVudCkudG9CZSBlZGl0b3IxLmdldFRpdGxlKClcbiAgICAgIGV4cGVjdCh0YWJCYXIuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudGFiJylbMV0ucXVlcnlTZWxlY3RvcignLnRpdGxlJykuZGF0YXNldC5uYW1lKS50b0JlKHBhdGguYmFzZW5hbWUoZWRpdG9yMS5nZXRQYXRoKCkpKVxuICAgICAgZXhwZWN0KHRhYkJhci5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWInKVsxXS5xdWVyeVNlbGVjdG9yKCcudGl0bGUnKS5kYXRhc2V0LnBhdGgpLnRvQmUoZWRpdG9yMS5nZXRQYXRoKCkpXG4gICAgICBleHBlY3QodGFiQmFyLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRhYicpWzFdLmRhdGFzZXQudHlwZSkudG9CZSgnVGV4dEVkaXRvcicpXG5cbiAgICAgIGV4cGVjdCh0YWJCYXIuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudGFiJylbMl0ucXVlcnlTZWxlY3RvcignLnRpdGxlJykudGV4dENvbnRlbnQpLnRvQmUgaXRlbTIuZ2V0VGl0bGUoKVxuICAgICAgZXhwZWN0KHRhYkJhci5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWInKVsyXS5xdWVyeVNlbGVjdG9yKCcudGl0bGUnKS5kYXRhc2V0Lm5hbWUpLnRvQmVVbmRlZmluZWQoKVxuICAgICAgZXhwZWN0KHRhYkJhci5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWInKVsyXS5xdWVyeVNlbGVjdG9yKCcudGl0bGUnKS5kYXRhc2V0LnBhdGgpLnRvQmVVbmRlZmluZWQoKVxuICAgICAgZXhwZWN0KHRhYkJhci5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWInKVswXS5kYXRhc2V0LnR5cGUpLnRvQmUoJ1Rlc3RWaWV3JylcblxuICAgIGl0IFwiaGlnaGxpZ2h0cyB0aGUgdGFiIGZvciB0aGUgYWN0aXZlIHBhbmUgaXRlbVwiLCAtPlxuICAgICAgZXhwZWN0KHRhYkJhci5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWInKVsyXSkudG9IYXZlQ2xhc3MgJ2FjdGl2ZSdcblxuICAgIGl0IFwiZW1pdHMgYSB3YXJuaW5nIHdoZW4gOjpvbkRpZC4uLiBmdW5jdGlvbnMgYXJlIG5vdCB2YWxpZCBEaXNwb3NhYmxlc1wiLCAtPlxuICAgICAgY2xhc3MgQmFkVmlld1xuICAgICAgICBjb25zdHJ1Y3RvcjogLT5cbiAgICAgICAgICBAZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgICAgIGdldFRpdGxlOiAtPiBcIkFueXRoaW5nXCJcbiAgICAgICAgb25EaWRDaGFuZ2VUaXRsZTogLT5cbiAgICAgICAgb25EaWRDaGFuZ2VJY29uOiAtPlxuICAgICAgICBvbkRpZENoYW5nZU1vZGlmaWVkOiAtPlxuICAgICAgICBvbkRpZFNhdmU6IC0+XG4gICAgICAgIG9uRGlkQ2hhbmdlUGF0aDogLT5cblxuICAgICAgd2FybmluZ3MgPSBbXVxuICAgICAgc3B5T24oY29uc29sZSwgXCJ3YXJuXCIpLmFuZENhbGxGYWtlIChtZXNzYWdlLCBvYmplY3QpIC0+XG4gICAgICAgIHdhcm5pbmdzLnB1c2goe21lc3NhZ2UsIG9iamVjdH0pXG5cbiAgICAgIGJhZEl0ZW0gPSBuZXcgQmFkVmlldygnSXRlbSAzJylcbiAgICAgIHBhbmUuYWRkSXRlbShiYWRJdGVtKVxuXG4gICAgICBleHBlY3Qod2FybmluZ3NbMF0ubWVzc2FnZSkudG9Db250YWluKFwib25EaWRDaGFuZ2VUaXRsZVwiKVxuICAgICAgZXhwZWN0KHdhcm5pbmdzWzBdLm9iamVjdCkudG9CZShiYWRJdGVtKVxuXG4gICAgICBleHBlY3Qod2FybmluZ3NbMV0ubWVzc2FnZSkudG9Db250YWluKFwib25EaWRDaGFuZ2VQYXRoXCIpXG4gICAgICBleHBlY3Qod2FybmluZ3NbMV0ub2JqZWN0KS50b0JlKGJhZEl0ZW0pXG5cbiAgICAgIGV4cGVjdCh3YXJuaW5nc1syXS5tZXNzYWdlKS50b0NvbnRhaW4oXCJvbkRpZENoYW5nZUljb25cIilcbiAgICAgIGV4cGVjdCh3YXJuaW5nc1syXS5vYmplY3QpLnRvQmUoYmFkSXRlbSlcblxuICAgICAgZXhwZWN0KHdhcm5pbmdzWzNdLm1lc3NhZ2UpLnRvQ29udGFpbihcIm9uRGlkQ2hhbmdlTW9kaWZpZWRcIilcbiAgICAgIGV4cGVjdCh3YXJuaW5nc1szXS5vYmplY3QpLnRvQmUoYmFkSXRlbSlcblxuICAgICAgZXhwZWN0KHdhcm5pbmdzWzRdLm1lc3NhZ2UpLnRvQ29udGFpbihcIm9uRGlkU2F2ZVwiKVxuICAgICAgZXhwZWN0KHdhcm5pbmdzWzRdLm9iamVjdCkudG9CZShiYWRJdGVtKVxuXG4gIGRlc2NyaWJlIFwid2hlbiB0aGUgYWN0aXZlIHBhbmUgaXRlbSBjaGFuZ2VzXCIsIC0+XG4gICAgaXQgXCJoaWdobGlnaHRzIHRoZSB0YWIgZm9yIHRoZSBuZXcgYWN0aXZlIHBhbmUgaXRlbVwiLCAtPlxuICAgICAgcGFuZS5hY3RpdmF0ZUl0ZW0oaXRlbTEpXG4gICAgICBleHBlY3QodGFiQmFyLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmFjdGl2ZScpLmxlbmd0aCkudG9CZSAxXG4gICAgICBleHBlY3QodGFiQmFyLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRhYicpWzBdKS50b0hhdmVDbGFzcyAnYWN0aXZlJ1xuXG4gICAgICBwYW5lLmFjdGl2YXRlSXRlbShpdGVtMilcbiAgICAgIGV4cGVjdCh0YWJCYXIuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYWN0aXZlJykubGVuZ3RoKS50b0JlIDFcbiAgICAgIGV4cGVjdCh0YWJCYXIuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudGFiJylbMl0pLnRvSGF2ZUNsYXNzICdhY3RpdmUnXG5cbiAgZGVzY3JpYmUgXCJ3aGVuIGEgbmV3IGl0ZW0gaXMgYWRkZWQgdG8gdGhlIHBhbmVcIiwgLT5cbiAgICBpdCBcImFkZHMgdGhlICdtb2RpZmllZCcgY2xhc3MgdG8gdGhlIG5ldyB0YWIgaWYgdGhlIGl0ZW0gaXMgaW5pdGlhbGx5IG1vZGlmaWVkXCIsIC0+XG4gICAgICBlZGl0b3IyID0gbnVsbFxuXG4gICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgaWYgYXRvbS53b3Jrc3BhY2UuY3JlYXRlSXRlbUZvclVSST9cbiAgICAgICAgICBhdG9tLndvcmtzcGFjZS5jcmVhdGVJdGVtRm9yVVJJKCdzYW1wbGUudHh0JykudGhlbiAobykgLT4gZWRpdG9yMiA9IG9cbiAgICAgICAgZWxzZVxuICAgICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oJ3NhbXBsZS50eHQnLCB7YWN0aXZhdGVJdGVtOiBmYWxzZX0pLnRoZW4gKG8pIC0+IGVkaXRvcjIgPSBvXG5cbiAgICAgIHJ1bnMgLT5cbiAgICAgICAgZWRpdG9yMi5pbnNlcnRUZXh0KCd4JylcbiAgICAgICAgcGFuZS5hY3RpdmF0ZUl0ZW0oZWRpdG9yMilcbiAgICAgICAgZXhwZWN0KHRhYkJhci50YWJGb3JJdGVtKGVkaXRvcjIpLmVsZW1lbnQpLnRvSGF2ZUNsYXNzICdtb2RpZmllZCdcblxuICAgIGRlc2NyaWJlIFwid2hlbiBhZGROZXdUYWJzQXRFbmQgaXMgc2V0IHRvIHRydWUgaW4gcGFja2FnZSBzZXR0aW5nc1wiLCAtPlxuICAgICAgaXQgXCJhZGRzIGEgdGFiIGZvciB0aGUgbmV3IGl0ZW0gYXQgdGhlIGVuZCBvZiB0aGUgdGFiIGJhclwiLCAtPlxuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoXCJ0YWJzLmFkZE5ld1RhYnNBdEVuZFwiLCB0cnVlKVxuICAgICAgICBpdGVtMyA9IG5ldyBUZXN0VmlldygnSXRlbSAzJylcbiAgICAgICAgcGFuZS5hY3RpdmF0ZUl0ZW0oaXRlbTMpXG4gICAgICAgIGV4cGVjdCh0YWJCYXIuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudGFiJykubGVuZ3RoKS50b0JlIDRcbiAgICAgICAgZXhwZWN0KHRhYkJhci50YWJBdEluZGV4KDMpLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLnRpdGxlJykudGV4dENvbnRlbnQpLnRvTWF0Y2ggJ0l0ZW0gMydcblxuICAgICAgaXQgXCJwdXRzIHRoZSBuZXcgdGFiIGF0IHRoZSBsYXN0IGluZGV4IG9mIHRoZSBwYW5lJ3MgaXRlbXNcIiwgLT5cbiAgICAgICAgYXRvbS5jb25maWcuc2V0KFwidGFicy5hZGROZXdUYWJzQXRFbmRcIiwgdHJ1ZSlcbiAgICAgICAgaXRlbTMgPSBuZXcgVGVzdFZpZXcoJ0l0ZW0gMycpXG4gICAgICAgICMgYWN0aXZhdGUgaXRlbTEgc28gZGVmYXVsdCBpcyB0byBhZGQgaW1tZWRpYXRlbHkgYWZ0ZXJcbiAgICAgICAgcGFuZS5hY3RpdmF0ZUl0ZW0oaXRlbTEpXG4gICAgICAgIHBhbmUuYWN0aXZhdGVJdGVtKGl0ZW0zKVxuICAgICAgICBleHBlY3QocGFuZS5nZXRJdGVtcygpW3BhbmUuZ2V0SXRlbXMoKS5sZW5ndGggLSAxXSkudG9FcXVhbCBpdGVtM1xuXG4gICAgZGVzY3JpYmUgXCJ3aGVuIGFkZE5ld1RhYnNBdEVuZCBpcyBzZXQgdG8gZmFsc2UgaW4gcGFja2FnZSBzZXR0aW5nc1wiLCAtPlxuICAgICAgaXQgXCJhZGRzIGEgdGFiIGZvciB0aGUgbmV3IGl0ZW0gYXQgdGhlIHNhbWUgaW5kZXggYXMgdGhlIGl0ZW0gaW4gdGhlIHBhbmVcIiwgLT5cbiAgICAgICAgYXRvbS5jb25maWcuc2V0KFwidGFicy5hZGROZXdUYWJzQXRFbmRcIiwgZmFsc2UpXG4gICAgICAgIHBhbmUuYWN0aXZhdGVJdGVtKGl0ZW0xKVxuICAgICAgICBpdGVtMyA9IG5ldyBUZXN0VmlldygnSXRlbSAzJylcbiAgICAgICAgcGFuZS5hY3RpdmF0ZUl0ZW0oaXRlbTMpXG4gICAgICAgIGV4cGVjdCh0YWJCYXIuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudGFiJykubGVuZ3RoKS50b0JlIDRcbiAgICAgICAgZXhwZWN0KHRhYkJhci50YWJBdEluZGV4KDEpLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLnRpdGxlJykudGV4dENvbnRlbnQpLnRvTWF0Y2ggJ0l0ZW0gMydcblxuICBkZXNjcmliZSBcIndoZW4gYW4gaXRlbSBpcyByZW1vdmVkIGZyb20gdGhlIHBhbmVcIiwgLT5cbiAgICBpdCBcInJlbW92ZXMgdGhlIGl0ZW0ncyB0YWIgZnJvbSB0aGUgdGFiIGJhclwiLCAtPlxuICAgICAgcGFuZS5kZXN0cm95SXRlbShpdGVtMilcbiAgICAgIGV4cGVjdCh0YWJCYXIuZ2V0VGFicygpLmxlbmd0aCkudG9CZSAyXG4gICAgICBleHBlY3QodGFiQmFyLmVsZW1lbnQudGV4dENvbnRlbnQpLm5vdC50b01hdGNoKCdJdGVtIDInKVxuXG4gICAgaXQgXCJ1cGRhdGVzIHRoZSB0aXRsZXMgb2YgdGhlIHJlbWFpbmluZyB0YWJzXCIsIC0+XG4gICAgICBleHBlY3QodGFiQmFyLnRhYkZvckl0ZW0oaXRlbTIpLmVsZW1lbnQudGV4dENvbnRlbnQpLnRvTWF0Y2ggJ0l0ZW0gMidcbiAgICAgIGl0ZW0yLmxvbmdUaXRsZSA9ICcyJ1xuICAgICAgaXRlbTJhID0gbmV3IFRlc3RWaWV3KCdJdGVtIDInKVxuICAgICAgaXRlbTJhLmxvbmdUaXRsZSA9ICcyYSdcbiAgICAgIHBhbmUuYWN0aXZhdGVJdGVtKGl0ZW0yYSlcbiAgICAgIGV4cGVjdCh0YWJCYXIudGFiRm9ySXRlbShpdGVtMikuZWxlbWVudC50ZXh0Q29udGVudCkudG9NYXRjaCAnMidcbiAgICAgIGV4cGVjdCh0YWJCYXIudGFiRm9ySXRlbShpdGVtMmEpLmVsZW1lbnQudGV4dENvbnRlbnQpLnRvTWF0Y2ggJzJhJ1xuICAgICAgcGFuZS5kZXN0cm95SXRlbShpdGVtMmEpXG4gICAgICBleHBlY3QodGFiQmFyLnRhYkZvckl0ZW0oaXRlbTIpLmVsZW1lbnQudGV4dENvbnRlbnQpLnRvTWF0Y2ggJ0l0ZW0gMidcblxuICBkZXNjcmliZSBcIndoZW4gYSB0YWIgaXMgY2xpY2tlZFwiLCAtPlxuICAgIGl0IFwic2hvd3MgdGhlIGFzc29jaWF0ZWQgaXRlbSBvbiB0aGUgcGFuZSBhbmQgZm9jdXNlcyB0aGUgcGFuZVwiLCAtPlxuICAgICAgamFzbWluZS5hdHRhY2hUb0RPTSh0YWJCYXIuZWxlbWVudCkgIyBSZW1vdmUgYWZ0ZXIgQXRvbSAxLjIuMCBpcyByZWxlYXNlZFxuXG4gICAgICBzcHlPbihwYW5lLCAnYWN0aXZhdGUnKVxuXG4gICAgICBldmVudCA9IHRyaWdnZXJNb3VzZUV2ZW50KCdtb3VzZWRvd24nLCB0YWJCYXIudGFiQXRJbmRleCgwKS5lbGVtZW50LCB3aGljaDogMSlcbiAgICAgICMgUGFuZSBhY3RpdmF0aW9uIGlzIGRlbGF5ZWQgYmVjYXVzZSBmb2N1cyBpcyBzdG9sZW4gYnkgdGhlIHRhYiBiYXJcbiAgICAgICMgaW1tZWRpYXRlbHkgYWZ0ZXJ3YXJkIHVubGVzcyBwcm9wYWdhdGlvbiBvZiB0aGUgbW91c2Vkb3duIGV2ZW50IGlzXG4gICAgICAjIHN0b3BwZWQuIEJ1dCBzdG9wcGluZyBwcm9wYWdhdGlvbiBvZiB0aGUgbW91c2Vkb3duIGV2ZW50IHByZXZlbnRzIHRoZVxuICAgICAgIyBkcmFnc3RhcnQgZXZlbnQgZnJvbSBvY2N1cnJpbmcuXG4gICAgICBleHBlY3QocGFuZS5nZXRBY3RpdmVJdGVtKCkpLm5vdC50b0JlKHBhbmUuZ2V0SXRlbXMoKVswXSlcbiAgICAgIHdhaXRzRm9yIC0+XG4gICAgICAgIHBhbmUuZ2V0QWN0aXZlSXRlbSgpIGlzIHBhbmUuZ2V0SXRlbXMoKVswXVxuXG4gICAgICBydW5zIC0+XG4gICAgICAgIGV4cGVjdChldmVudC5wcmV2ZW50RGVmYXVsdCkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKSAjIGFsbG93cyBkcmFnZ2luZ1xuICAgICAgICBldmVudCA9IHRyaWdnZXJNb3VzZUV2ZW50KCdtb3VzZWRvd24nLCB0YWJCYXIudGFiQXRJbmRleCgyKS5lbGVtZW50LCB3aGljaDogMSlcbiAgICAgICAgZXhwZWN0KHBhbmUuZ2V0QWN0aXZlSXRlbSgpKS5ub3QudG9CZShwYW5lLmdldEl0ZW1zKClbMl0pXG5cbiAgICAgIHdhaXRzRm9yIC0+XG4gICAgICAgIHBhbmUuZ2V0QWN0aXZlSXRlbSgpIGlzIHBhbmUuZ2V0SXRlbXMoKVsyXVxuXG4gICAgICBydW5zIC0+XG4gICAgICAgIGV4cGVjdChldmVudC5wcmV2ZW50RGVmYXVsdCkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKSAjIGFsbG93cyBkcmFnZ2luZ1xuICAgICAgICBleHBlY3QocGFuZS5hY3RpdmF0ZS5jYWxsQ291bnQpLnRvQmUgMlxuXG4gICAgaXQgXCJjbG9zZXMgdGhlIHRhYiB3aGVuIG1pZGRsZSBjbGlja2VkXCIsIC0+XG4gICAgICBqYXNtaW5lLmF0dGFjaFRvRE9NKHRhYkJhci5lbGVtZW50KSAjIFJlbW92ZSBhZnRlciBBdG9tIDEuMi4wIGlzIHJlbGVhc2VkXG5cbiAgICAgIGV2ZW50ID0gdHJpZ2dlck1vdXNlRXZlbnQoJ21vdXNlZG93bicsIHRhYkJhci50YWJGb3JJdGVtKGVkaXRvcjEpLmVsZW1lbnQsIHdoaWNoOiAyKVxuXG4gICAgICBleHBlY3QocGFuZS5nZXRJdGVtcygpLmxlbmd0aCkudG9CZSAyXG4gICAgICBleHBlY3QocGFuZS5nZXRJdGVtcygpLmluZGV4T2YoZWRpdG9yMSkpLnRvQmUgLTFcbiAgICAgIGV4cGVjdChlZGl0b3IxLmRlc3Ryb3llZCkudG9CZVRydXRoeSgpXG4gICAgICBleHBlY3QodGFiQmFyLmdldFRhYnMoKS5sZW5ndGgpLnRvQmUgMlxuICAgICAgZXhwZWN0KHRhYkJhci5lbGVtZW50LnRleHRDb250ZW50KS5ub3QudG9NYXRjaCgnc2FtcGxlLmpzJylcblxuICAgICAgZXhwZWN0KGV2ZW50LnByZXZlbnREZWZhdWx0KS50b0hhdmVCZWVuQ2FsbGVkKClcblxuICAgIGl0IFwiZG9lc24ndCBzd2l0Y2ggdGFiIHdoZW4gcmlnaHQgKG9yIGN0cmwtbGVmdCkgY2xpY2tlZFwiLCAtPlxuICAgICAgamFzbWluZS5hdHRhY2hUb0RPTSh0YWJCYXIuZWxlbWVudCkgIyBSZW1vdmUgYWZ0ZXIgQXRvbSAxLjIuMCBpcyByZWxlYXNlZFxuXG4gICAgICBzcHlPbihwYW5lLCAnYWN0aXZhdGUnKVxuXG4gICAgICBldmVudCA9IHRyaWdnZXJNb3VzZUV2ZW50KCdtb3VzZWRvd24nLCB0YWJCYXIudGFiQXRJbmRleCgwKS5lbGVtZW50LCB3aGljaDogMylcbiAgICAgIGV4cGVjdChwYW5lLmdldEFjdGl2ZUl0ZW0oKSkubm90LnRvQmUgcGFuZS5nZXRJdGVtcygpWzBdXG4gICAgICBleHBlY3QoZXZlbnQucHJldmVudERlZmF1bHQpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuXG4gICAgICBldmVudCA9IHRyaWdnZXJNb3VzZUV2ZW50KCdtb3VzZWRvd24nLCB0YWJCYXIudGFiQXRJbmRleCgwKS5lbGVtZW50LCB3aGljaDogMSwgY3RybEtleTogdHJ1ZSlcbiAgICAgIGV4cGVjdChwYW5lLmdldEFjdGl2ZUl0ZW0oKSkubm90LnRvQmUgcGFuZS5nZXRJdGVtcygpWzBdXG4gICAgICBleHBlY3QoZXZlbnQucHJldmVudERlZmF1bHQpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuXG4gICAgICBleHBlY3QocGFuZS5hY3RpdmF0ZSkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuXG4gIGRlc2NyaWJlIFwid2hlbiBhIHRhYidzIGNsb3NlIGljb24gaXMgY2xpY2tlZFwiLCAtPlxuICAgIGl0IFwiZGVzdHJveXMgdGhlIHRhYidzIGl0ZW0gb24gdGhlIHBhbmVcIiwgLT5cbiAgICAgIGphc21pbmUuYXR0YWNoVG9ET00odGFiQmFyLmVsZW1lbnQpICMgUmVtb3ZlIGFmdGVyIEF0b20gMS4yLjAgaXMgcmVsZWFzZWRcblxuICAgICAgdGFiQmFyLnRhYkZvckl0ZW0oZWRpdG9yMSkuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuY2xvc2UtaWNvbicpLmNsaWNrKClcbiAgICAgIGV4cGVjdChwYW5lLmdldEl0ZW1zKCkubGVuZ3RoKS50b0JlIDJcbiAgICAgIGV4cGVjdChwYW5lLmdldEl0ZW1zKCkuaW5kZXhPZihlZGl0b3IxKSkudG9CZSAtMVxuICAgICAgZXhwZWN0KGVkaXRvcjEuZGVzdHJveWVkKS50b0JlVHJ1dGh5KClcbiAgICAgIGV4cGVjdCh0YWJCYXIuZ2V0VGFicygpLmxlbmd0aCkudG9CZSAyXG4gICAgICBleHBlY3QodGFiQmFyLmVsZW1lbnQudGV4dENvbnRlbnQpLm5vdC50b01hdGNoKCdzYW1wbGUuanMnKVxuXG4gIGRlc2NyaWJlIFwid2hlbiBhbiBpdGVtIGlzIGFjdGl2YXRlZFwiLCAtPlxuICAgIFtpdGVtM10gPSBbXVxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIGl0ZW0zID0gbmV3IFRlc3RWaWV3KFwiSXRlbSAzXCIpXG4gICAgICBwYW5lLmFjdGl2YXRlSXRlbShpdGVtMylcblxuICAgICAgIyBTZXQgdXAgc3R5bGVzIHNvIHRoZSB0YWIgYmFyIGhhcyBhIHNjcm9sbGJhclxuICAgICAgdGFiQmFyLmVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdmbGV4J1xuICAgICAgdGFiQmFyLmVsZW1lbnQuc3R5bGUub3ZlcmZsb3dYID0gJ3Njcm9sbCdcbiAgICAgIHRhYkJhci5lbGVtZW50LnN0eWxlLm1hcmdpbiA9ICcwJ1xuXG4gICAgICBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgICAgY29udGFpbmVyLnN0eWxlLndpZHRoID0gJzE1MHB4J1xuICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHRhYkJhci5lbGVtZW50KVxuICAgICAgamFzbWluZS5hdHRhY2hUb0RPTShjb250YWluZXIpXG5cbiAgICAgICMgRXhwZWN0IHRoZXJlIHRvIGJlIGNvbnRlbnQgdG8gc2Nyb2xsXG4gICAgICBleHBlY3QodGFiQmFyLmVsZW1lbnQuc2Nyb2xsV2lkdGgpLnRvQmVHcmVhdGVyVGhhbiB0YWJCYXIuZWxlbWVudC5jbGllbnRXaWR0aFxuXG4gICAgaXQgXCJkb2VzIG5vdCBzY3JvbGwgdG8gdGhlIGl0ZW0gd2hlbiBpdCBpcyB2aXNpYmxlXCIsIC0+XG4gICAgICBwYW5lLmFjdGl2YXRlSXRlbShpdGVtMSlcbiAgICAgIGV4cGVjdCh0YWJCYXIuZWxlbWVudC5zY3JvbGxMZWZ0KS50b0JlIDBcblxuICAgICAgcGFuZS5hY3RpdmF0ZUl0ZW0oZWRpdG9yMSlcbiAgICAgIGV4cGVjdCh0YWJCYXIuZWxlbWVudC5zY3JvbGxMZWZ0KS50b0JlIDBcblxuICAgICAgcGFuZS5hY3RpdmF0ZUl0ZW0oaXRlbTIpXG4gICAgICBleHBlY3QodGFiQmFyLmVsZW1lbnQuc2Nyb2xsTGVmdCkudG9CZSAwXG5cbiAgICAgIHBhbmUuYWN0aXZhdGVJdGVtKGl0ZW0zKVxuICAgICAgZXhwZWN0KHRhYkJhci5lbGVtZW50LnNjcm9sbExlZnQpLm5vdC50b0JlIDBcblxuICAgIGl0IFwic2Nyb2xscyB0byB0aGUgaXRlbSB3aGVuIGl0IGlzbid0IGNvbXBsZXRlbHkgdmlzaWJsZVwiLCAtPlxuICAgICAgdGFiQmFyLmVsZW1lbnQuc2Nyb2xsTGVmdCA9IDVcbiAgICAgIGV4cGVjdCh0YWJCYXIuZWxlbWVudC5zY3JvbGxMZWZ0KS50b0JlIDUgIyBUaGlzIGNhbiBiZSAwIGlmIHRoZXJlIGlzIG5vIGhvcml6b250YWwgc2Nyb2xsYmFyXG5cbiAgICAgIHBhbmUuYWN0aXZhdGVJdGVtKGl0ZW0xKVxuICAgICAgZXhwZWN0KHRhYkJhci5lbGVtZW50LnNjcm9sbExlZnQpLnRvQmUgMFxuXG4gICAgICBwYW5lLmFjdGl2YXRlSXRlbShpdGVtMylcbiAgICAgIGV4cGVjdCh0YWJCYXIuZWxlbWVudC5zY3JvbGxMZWZ0KS50b0JlIHRhYkJhci5lbGVtZW50LnNjcm9sbFdpZHRoIC0gdGFiQmFyLmVsZW1lbnQuY2xpZW50V2lkdGhcblxuICBkZXNjcmliZSBcIndoZW4gYSB0YWIgaXRlbSdzIHRpdGxlIGNoYW5nZXNcIiwgLT5cbiAgICBpdCBcInVwZGF0ZXMgdGhlIHRpdGxlIG9mIHRoZSBpdGVtJ3MgdGFiXCIsIC0+XG4gICAgICBlZGl0b3IxLmJ1ZmZlci5zZXRQYXRoKCcvdGhpcy9pcy1hL3Rlc3QudHh0JylcbiAgICAgIGV4cGVjdCh0YWJCYXIudGFiRm9ySXRlbShlZGl0b3IxKS5lbGVtZW50LnRleHRDb250ZW50KS50b01hdGNoICd0ZXN0LnR4dCdcblxuICBkZXNjcmliZSBcIndoZW4gdHdvIHRhYnMgaGF2ZSB0aGUgc2FtZSB0aXRsZVwiLCAtPlxuICAgIGl0IFwiZGlzcGxheXMgdGhlIGxvbmcgdGl0bGUgb24gdGhlIHRhYiBpZiBpdCdzIGF2YWlsYWJsZSBmcm9tIHRoZSBpdGVtXCIsIC0+XG4gICAgICBpdGVtMS50aXRsZSA9IFwiT2xkIE1hblwiXG4gICAgICBpdGVtMS5sb25nVGl0bGUgPSBcIkdydW1weSBPbGQgTWFuXCJcbiAgICAgIGl0ZW0xLmVtaXRUaXRsZUNoYW5nZWQoKVxuICAgICAgaXRlbTIudGl0bGUgPSBcIk9sZCBNYW5cIlxuICAgICAgaXRlbTIubG9uZ1RpdGxlID0gXCJKb2xseSBPbGQgTWFuXCJcbiAgICAgIGl0ZW0yLmVtaXRUaXRsZUNoYW5nZWQoKVxuXG4gICAgICBleHBlY3QodGFiQmFyLnRhYkZvckl0ZW0oaXRlbTEpLmVsZW1lbnQudGV4dENvbnRlbnQpLnRvTWF0Y2ggXCJHcnVtcHkgT2xkIE1hblwiXG4gICAgICBleHBlY3QodGFiQmFyLnRhYkZvckl0ZW0oaXRlbTIpLmVsZW1lbnQudGV4dENvbnRlbnQpLnRvTWF0Y2ggXCJKb2xseSBPbGQgTWFuXCJcblxuICAgICAgaXRlbTIubG9uZ1RpdGxlID0gdW5kZWZpbmVkXG4gICAgICBpdGVtMi5lbWl0VGl0bGVDaGFuZ2VkKClcblxuICAgICAgZXhwZWN0KHRhYkJhci50YWJGb3JJdGVtKGl0ZW0xKS5lbGVtZW50LnRleHRDb250ZW50KS50b01hdGNoIFwiR3J1bXB5IE9sZCBNYW5cIlxuICAgICAgZXhwZWN0KHRhYkJhci50YWJGb3JJdGVtKGl0ZW0yKS5lbGVtZW50LnRleHRDb250ZW50KS50b01hdGNoIFwiT2xkIE1hblwiXG5cbiAgZGVzY3JpYmUgXCJ0aGUgY2xvc2UgYnV0dG9uXCIsIC0+XG4gICAgaXQgXCJpcyBwcmVzZW50IGluIHRoZSBjZW50ZXIsIHJlZ2FyZGxlc3Mgb2YgdGhlIHZhbHVlIHJldHVybmVkIGJ5IGlzUGVybWFuZW50RG9ja0l0ZW0oKVwiLCAtPlxuICAgICAgaXRlbTMgPSBuZXcgVGVzdFZpZXcoJ0l0ZW0gMycsIHVuZGVmaW5lZCwgXCJzcXVpcnJlbFwiLCBcInNhbXBsZS5qc1wiKVxuICAgICAgZXhwZWN0KGl0ZW0zLmlzUGVybWFuZW50RG9ja0l0ZW0pLnRvQmVVbmRlZmluZWQoKVxuICAgICAgaXRlbTQgPSBuZXcgVGVzdFZpZXcoJ0l0ZW0gNCcsIHVuZGVmaW5lZCwgXCJzcXVpcnJlbFwiLCBcInNhbXBsZS5qc1wiLCB0cnVlKVxuICAgICAgZXhwZWN0KHR5cGVvZiBpdGVtNC5pc1Blcm1hbmVudERvY2tJdGVtKS50b0JlKCdmdW5jdGlvbicpXG4gICAgICBpdGVtNSA9IG5ldyBUZXN0VmlldygnSXRlbSA1JywgdW5kZWZpbmVkLCBcInNxdWlycmVsXCIsIFwic2FtcGxlLmpzXCIsIGZhbHNlKVxuICAgICAgZXhwZWN0KHR5cGVvZiBpdGVtNS5pc1Blcm1hbmVudERvY2tJdGVtKS50b0JlKCdmdW5jdGlvbicpXG4gICAgICBwYW5lLmFjdGl2YXRlSXRlbShpdGVtMylcbiAgICAgIHBhbmUuYWN0aXZhdGVJdGVtKGl0ZW00KVxuICAgICAgcGFuZS5hY3RpdmF0ZUl0ZW0oaXRlbTUpXG4gICAgICB0YWJzID0gdGFiQmFyLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRhYicpXG4gICAgICBleHBlY3QodGFic1syXS5xdWVyeVNlbGVjdG9yKCcuY2xvc2UtaWNvbicpKS5ub3QudG9FcXVhbChudWxsKVxuICAgICAgZXhwZWN0KHRhYnNbM10ucXVlcnlTZWxlY3RvcignLmNsb3NlLWljb24nKSkubm90LnRvRXF1YWwobnVsbClcbiAgICAgIGV4cGVjdCh0YWJzWzRdLnF1ZXJ5U2VsZWN0b3IoJy5jbG9zZS1pY29uJykpLm5vdC50b0VxdWFsKG51bGwpXG5cbiAgICByZXR1cm4gdW5sZXNzIGF0b20ud29ya3NwYWNlLmdldFJpZ2h0RG9jaz9cbiAgICBkZXNjcmliZSBcImluIGRvY2tzXCIsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIHBhbmUgPSBhdG9tLndvcmtzcGFjZS5nZXRSaWdodERvY2soKS5nZXRBY3RpdmVQYW5lKClcbiAgICAgICAgdGFiQmFyID0gbmV3IFRhYkJhclZpZXcocGFuZSwgJ3JpZ2h0JylcblxuICAgICAgaXQgXCJpc24ndCBzaG93biBpZiB0aGUgbWV0aG9kIHJldHVybnMgdHJ1ZVwiLCAtPlxuICAgICAgICBpdGVtMSA9IG5ldyBUZXN0VmlldygnSXRlbSAxJywgdW5kZWZpbmVkLCBcInNxdWlycmVsXCIsIFwic2FtcGxlLmpzXCIsIHRydWUpXG4gICAgICAgIGV4cGVjdCh0eXBlb2YgaXRlbTEuaXNQZXJtYW5lbnREb2NrSXRlbSkudG9CZSgnZnVuY3Rpb24nKVxuICAgICAgICBwYW5lLmFjdGl2YXRlSXRlbShpdGVtMSlcbiAgICAgICAgdGFiID0gdGFiQmFyLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLnRhYicpXG4gICAgICAgIGV4cGVjdCh0YWIucXVlcnlTZWxlY3RvcignLmNsb3NlLWljb24nKSkudG9FcXVhbChudWxsKVxuXG4gICAgICBpdCBcImlzIHNob3duIGlmIHRoZSBtZXRob2QgcmV0dXJucyBmYWxzZVwiLCAtPlxuICAgICAgICBpdGVtMSA9IG5ldyBUZXN0VmlldygnSXRlbSAxJywgdW5kZWZpbmVkLCBcInNxdWlycmVsXCIsIFwic2FtcGxlLmpzXCIsIGZhbHNlKVxuICAgICAgICBleHBlY3QodHlwZW9mIGl0ZW0xLmlzUGVybWFuZW50RG9ja0l0ZW0pLnRvQmUoJ2Z1bmN0aW9uJylcbiAgICAgICAgcGFuZS5hY3RpdmF0ZUl0ZW0oaXRlbTEpXG4gICAgICAgIHRhYiA9IHRhYkJhci5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy50YWInKVxuICAgICAgICBleHBlY3QodGFiLnF1ZXJ5U2VsZWN0b3IoJy5jbG9zZS1pY29uJykpLm5vdC50b0JlVW5kZWZpbmVkKClcblxuICAgICAgaXQgXCJpcyBzaG93biBpZiB0aGUgbWV0aG9kIGRvZXNuJ3QgZXhpc3RcIiwgLT5cbiAgICAgICAgaXRlbTEgPSBuZXcgVGVzdFZpZXcoJ0l0ZW0gMScsIHVuZGVmaW5lZCwgXCJzcXVpcnJlbFwiLCBcInNhbXBsZS5qc1wiKVxuICAgICAgICBleHBlY3QoaXRlbTEuaXNQZXJtYW5lbnREb2NrSXRlbSkudG9CZVVuZGVmaW5lZCgpXG4gICAgICAgIHBhbmUuYWN0aXZhdGVJdGVtKGl0ZW0xKVxuICAgICAgICB0YWIgPSB0YWJCYXIuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcudGFiJylcbiAgICAgICAgZXhwZWN0KHRhYi5xdWVyeVNlbGVjdG9yKCcuY2xvc2UtaWNvbicpKS5ub3QudG9FcXVhbChudWxsKVxuXG4gIGRlc2NyaWJlIFwid2hlbiBhbiBpdGVtIGhhcyBhbiBpY29uIGRlZmluZWRcIiwgLT5cbiAgICBpdCBcImRpc3BsYXlzIHRoZSBpY29uIG9uIHRoZSB0YWJcIiwgLT5cbiAgICAgIGV4cGVjdCh0YWJCYXIuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudGFiJylbMF0ucXVlcnlTZWxlY3RvcignLnRpdGxlJykpLnRvSGF2ZUNsYXNzIFwiaWNvblwiXG4gICAgICBleHBlY3QodGFiQmFyLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRhYicpWzBdLnF1ZXJ5U2VsZWN0b3IoJy50aXRsZScpKS50b0hhdmVDbGFzcyBcImljb24tc3F1aXJyZWxcIlxuXG4gICAgaXQgXCJoaWRlcyB0aGUgaWNvbiBmcm9tIHRoZSB0YWIgaWYgdGhlIGljb24gaXMgcmVtb3ZlZFwiLCAtPlxuICAgICAgaXRlbTEuZ2V0SWNvbk5hbWUgPSBudWxsXG4gICAgICBpdGVtMS5lbWl0SWNvbkNoYW5nZWQoKVxuICAgICAgZXhwZWN0KHRhYkJhci5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWInKVswXS5xdWVyeVNlbGVjdG9yKCcudGl0bGUnKSkubm90LnRvSGF2ZUNsYXNzIFwiaWNvblwiXG4gICAgICBleHBlY3QodGFiQmFyLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRhYicpWzBdLnF1ZXJ5U2VsZWN0b3IoJy50aXRsZScpKS5ub3QudG9IYXZlQ2xhc3MgXCJpY29uLXNxdWlycmVsXCJcblxuICAgIGl0IFwidXBkYXRlcyB0aGUgaWNvbiBvbiB0aGUgdGFiIGlmIHRoZSBpY29uIGlzIGNoYW5nZWRcIiwgLT5cbiAgICAgIGl0ZW0xLmdldEljb25OYW1lID0gLT4gXCJ6YXBcIlxuICAgICAgaXRlbTEuZW1pdEljb25DaGFuZ2VkKClcbiAgICAgIGV4cGVjdCh0YWJCYXIuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudGFiJylbMF0ucXVlcnlTZWxlY3RvcignLnRpdGxlJykpLnRvSGF2ZUNsYXNzIFwiaWNvblwiXG4gICAgICBleHBlY3QodGFiQmFyLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRhYicpWzBdLnF1ZXJ5U2VsZWN0b3IoJy50aXRsZScpKS50b0hhdmVDbGFzcyBcImljb24temFwXCJcblxuICAgIGRlc2NyaWJlIFwid2hlbiBzaG93SWNvbiBpcyBzZXQgdG8gdHJ1ZSBpbiBwYWNrYWdlIHNldHRpbmdzXCIsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIHNweU9uKHRhYkJhci50YWJGb3JJdGVtKGl0ZW0xKSwgJ3VwZGF0ZUljb25WaXNpYmlsaXR5JykuYW5kQ2FsbFRocm91Z2goKVxuXG4gICAgICAgIGF0b20uY29uZmlnLnNldChcInRhYnMuc2hvd0ljb25zXCIsIHRydWUpXG5cbiAgICAgICAgd2FpdHNGb3IgLT5cbiAgICAgICAgICB0YWJCYXIudGFiRm9ySXRlbShpdGVtMSkudXBkYXRlSWNvblZpc2liaWxpdHkuY2FsbENvdW50ID4gMFxuXG4gICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICB0YWJCYXIudGFiRm9ySXRlbShpdGVtMSkudXBkYXRlSWNvblZpc2liaWxpdHkucmVzZXQoKVxuXG4gICAgICBpdCBcImRvZXNuJ3QgaGlkZSB0aGUgaWNvblwiLCAtPlxuICAgICAgICBleHBlY3QodGFiQmFyLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRhYicpWzBdLnF1ZXJ5U2VsZWN0b3IoJy50aXRsZScpKS5ub3QudG9IYXZlQ2xhc3MgXCJoaWRlLWljb25cIlxuXG4gICAgICBpdCBcImhpZGVzIHRoZSBpY29uIGZyb20gdGhlIHRhYiB3aGVuIHNob3dJY29uIGlzIGNoYW5nZWQgdG8gZmFsc2VcIiwgLT5cbiAgICAgICAgYXRvbS5jb25maWcuc2V0KFwidGFicy5zaG93SWNvbnNcIiwgZmFsc2UpXG5cbiAgICAgICAgd2FpdHNGb3IgLT5cbiAgICAgICAgICB0YWJCYXIudGFiRm9ySXRlbShpdGVtMSkudXBkYXRlSWNvblZpc2liaWxpdHkuY2FsbENvdW50ID4gMFxuXG4gICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICBleHBlY3QodGFiQmFyLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRhYicpWzBdLnF1ZXJ5U2VsZWN0b3IoJy50aXRsZScpKS50b0hhdmVDbGFzcyBcImhpZGUtaWNvblwiXG5cbiAgICBkZXNjcmliZSBcIndoZW4gc2hvd0ljb24gaXMgc2V0IHRvIGZhbHNlIGluIHBhY2thZ2Ugc2V0dGluZ3NcIiwgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgc3B5T24odGFiQmFyLnRhYkZvckl0ZW0oaXRlbTEpLCAndXBkYXRlSWNvblZpc2liaWxpdHknKS5hbmRDYWxsVGhyb3VnaCgpXG5cbiAgICAgICAgYXRvbS5jb25maWcuc2V0KFwidGFicy5zaG93SWNvbnNcIiwgZmFsc2UpXG5cbiAgICAgICAgd2FpdHNGb3IgLT5cbiAgICAgICAgICB0YWJCYXIudGFiRm9ySXRlbShpdGVtMSkudXBkYXRlSWNvblZpc2liaWxpdHkuY2FsbENvdW50ID4gMFxuXG4gICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICB0YWJCYXIudGFiRm9ySXRlbShpdGVtMSkudXBkYXRlSWNvblZpc2liaWxpdHkucmVzZXQoKVxuXG4gICAgICBpdCBcImhpZGVzIHRoZSBpY29uXCIsIC0+XG4gICAgICAgIGV4cGVjdCh0YWJCYXIuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudGFiJylbMF0ucXVlcnlTZWxlY3RvcignLnRpdGxlJykpLnRvSGF2ZUNsYXNzIFwiaGlkZS1pY29uXCJcblxuICAgICAgaXQgXCJzaG93cyB0aGUgaWNvbiBvbiB0aGUgdGFiIHdoZW4gc2hvd0ljb24gaXMgY2hhbmdlZCB0byB0cnVlXCIsIC0+XG4gICAgICAgIGF0b20uY29uZmlnLnNldChcInRhYnMuc2hvd0ljb25zXCIsIHRydWUpXG5cbiAgICAgICAgd2FpdHNGb3IgLT5cbiAgICAgICAgICB0YWJCYXIudGFiRm9ySXRlbShpdGVtMSkudXBkYXRlSWNvblZpc2liaWxpdHkuY2FsbENvdW50ID4gMFxuXG4gICAgICAgIGV4cGVjdCh0YWJCYXIuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudGFiJylbMF0ucXVlcnlTZWxlY3RvcignLnRpdGxlJykpLm5vdC50b0hhdmVDbGFzcyBcImhpZGUtaWNvblwiXG5cbiAgZGVzY3JpYmUgXCJ3aGVuIHRoZSBpdGVtIGRvZXNuJ3QgaGF2ZSBhbiBpY29uIGRlZmluZWRcIiwgLT5cbiAgICBpdCBcImRvZXNuJ3QgZGlzcGxheSBhbiBpY29uIG9uIHRoZSB0YWJcIiwgLT5cbiAgICAgIGV4cGVjdCh0YWJCYXIuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudGFiJylbMl0ucXVlcnlTZWxlY3RvcignLnRpdGxlJykpLm5vdC50b0hhdmVDbGFzcyBcImljb25cIlxuICAgICAgZXhwZWN0KHRhYkJhci5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWInKVsyXS5xdWVyeVNlbGVjdG9yKCcudGl0bGUnKSkubm90LnRvSGF2ZUNsYXNzIFwiaWNvbi1zcXVpcnJlbFwiXG5cbiAgICBpdCBcInNob3dzIHRoZSBpY29uIG9uIHRoZSB0YWIgaWYgYW4gaWNvbiBpcyBkZWZpbmVkXCIsIC0+XG4gICAgICBpdGVtMi5nZXRJY29uTmFtZSA9IC0+IFwic3F1aXJyZWxcIlxuICAgICAgaXRlbTIuZW1pdEljb25DaGFuZ2VkKClcbiAgICAgIGV4cGVjdCh0YWJCYXIuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudGFiJylbMl0ucXVlcnlTZWxlY3RvcignLnRpdGxlJykpLnRvSGF2ZUNsYXNzIFwiaWNvblwiXG4gICAgICBleHBlY3QodGFiQmFyLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRhYicpWzJdLnF1ZXJ5U2VsZWN0b3IoJy50aXRsZScpKS50b0hhdmVDbGFzcyBcImljb24tc3F1aXJyZWxcIlxuXG4gIGRlc2NyaWJlIFwid2hlbiBhIHRhYiBpdGVtJ3MgbW9kaWZpZWQgc3RhdHVzIGNoYW5nZXNcIiwgLT5cbiAgICBpdCBcImFkZHMgb3IgcmVtb3ZlcyB0aGUgJ21vZGlmaWVkJyBjbGFzcyB0byB0aGUgdGFiIGJhc2VkIG9uIHRoZSBzdGF0dXNcIiwgLT5cbiAgICAgIHRhYiA9IHRhYkJhci50YWJGb3JJdGVtKGVkaXRvcjEpXG4gICAgICBleHBlY3QoZWRpdG9yMS5pc01vZGlmaWVkKCkpLnRvQmVGYWxzeSgpXG4gICAgICBleHBlY3QodGFiLmVsZW1lbnQpLm5vdC50b0hhdmVDbGFzcyAnbW9kaWZpZWQnXG5cbiAgICAgIGVkaXRvcjEuaW5zZXJ0VGV4dCgneCcpXG4gICAgICBhZHZhbmNlQ2xvY2soZWRpdG9yMS5idWZmZXIuc3RvcHBlZENoYW5naW5nRGVsYXkpXG4gICAgICBleHBlY3QoZWRpdG9yMS5pc01vZGlmaWVkKCkpLnRvQmVUcnV0aHkoKVxuICAgICAgZXhwZWN0KHRhYi5lbGVtZW50KS50b0hhdmVDbGFzcyAnbW9kaWZpZWQnXG5cbiAgICAgIGVkaXRvcjEudW5kbygpXG4gICAgICBhZHZhbmNlQ2xvY2soZWRpdG9yMS5idWZmZXIuc3RvcHBlZENoYW5naW5nRGVsYXkpXG4gICAgICBleHBlY3QoZWRpdG9yMS5pc01vZGlmaWVkKCkpLnRvQmVGYWxzeSgpXG4gICAgICBleHBlY3QodGFiLmVsZW1lbnQpLm5vdC50b0hhdmVDbGFzcyAnbW9kaWZpZWQnXG5cbiAgZGVzY3JpYmUgXCJ3aGVuIGEgcGFuZSBpdGVtIG1vdmVzIHRvIGEgbmV3IGluZGV4XCIsIC0+XG4gICAgIyBiZWhhdmlvciBpcyBpbmRlcGVuZGVudCBvZiBhZGROZXdUYWJzIGNvbmZpZ1xuICAgIGRlc2NyaWJlIFwid2hlbiBhZGROZXdUYWJzQXRFbmQgaXMgc2V0IHRvIHRydWUgaW4gcGFja2FnZSBzZXR0aW5nc1wiLCAtPlxuICAgICAgaXQgXCJ1cGRhdGVzIHRoZSBvcmRlciBvZiB0aGUgdGFicyB0byBtYXRjaCB0aGUgbmV3IGl0ZW0gb3JkZXJcIiwgLT5cbiAgICAgICAgYXRvbS5jb25maWcuc2V0KFwidGFicy5hZGROZXdUYWJzQXRFbmRcIiwgdHJ1ZSlcbiAgICAgICAgZXhwZWN0KHRhYkJhci5nZXRUYWJzKCkubWFwICh0YWIpIC0+IHRhYi5lbGVtZW50LnRleHRDb250ZW50KS50b0VxdWFsIFtcIkl0ZW0gMVwiLCBcInNhbXBsZS5qc1wiLCBcIkl0ZW0gMlwiXVxuICAgICAgICBwYW5lLm1vdmVJdGVtKGl0ZW0yLCAxKVxuICAgICAgICBleHBlY3QodGFiQmFyLmdldFRhYnMoKS5tYXAgKHRhYikgLT4gdGFiLmVsZW1lbnQudGV4dENvbnRlbnQpLnRvRXF1YWwgW1wiSXRlbSAxXCIsIFwiSXRlbSAyXCIsIFwic2FtcGxlLmpzXCJdXG4gICAgICAgIHBhbmUubW92ZUl0ZW0oZWRpdG9yMSwgMClcbiAgICAgICAgZXhwZWN0KHRhYkJhci5nZXRUYWJzKCkubWFwICh0YWIpIC0+IHRhYi5lbGVtZW50LnRleHRDb250ZW50KS50b0VxdWFsIFtcInNhbXBsZS5qc1wiLCBcIkl0ZW0gMVwiLCBcIkl0ZW0gMlwiXVxuICAgICAgICBwYW5lLm1vdmVJdGVtKGl0ZW0xLCAyKVxuICAgICAgICBleHBlY3QodGFiQmFyLmdldFRhYnMoKS5tYXAgKHRhYikgLT4gdGFiLmVsZW1lbnQudGV4dENvbnRlbnQpLnRvRXF1YWwgW1wic2FtcGxlLmpzXCIsIFwiSXRlbSAyXCIsIFwiSXRlbSAxXCJdXG5cbiAgICBkZXNjcmliZSBcIndoZW4gYWRkTmV3VGFic0F0RW5kIGlzIHNldCB0byBmYWxzZSBpbiBwYWNrYWdlIHNldHRpbmdzXCIsIC0+XG4gICAgICBpdCBcInVwZGF0ZXMgdGhlIG9yZGVyIG9mIHRoZSB0YWJzIHRvIG1hdGNoIHRoZSBuZXcgaXRlbSBvcmRlclwiLCAtPlxuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoXCJ0YWJzLmFkZE5ld1RhYnNBdEVuZFwiLCBmYWxzZSlcbiAgICAgICAgZXhwZWN0KHRhYkJhci5nZXRUYWJzKCkubWFwICh0YWIpIC0+IHRhYi5lbGVtZW50LnRleHRDb250ZW50KS50b0VxdWFsIFtcIkl0ZW0gMVwiLCBcInNhbXBsZS5qc1wiLCBcIkl0ZW0gMlwiXVxuICAgICAgICBwYW5lLm1vdmVJdGVtKGl0ZW0yLCAxKVxuICAgICAgICBleHBlY3QodGFiQmFyLmdldFRhYnMoKS5tYXAgKHRhYikgLT4gdGFiLmVsZW1lbnQudGV4dENvbnRlbnQpLnRvRXF1YWwgW1wiSXRlbSAxXCIsIFwiSXRlbSAyXCIsIFwic2FtcGxlLmpzXCJdXG4gICAgICAgIHBhbmUubW92ZUl0ZW0oZWRpdG9yMSwgMClcbiAgICAgICAgZXhwZWN0KHRhYkJhci5nZXRUYWJzKCkubWFwICh0YWIpIC0+IHRhYi5lbGVtZW50LnRleHRDb250ZW50KS50b0VxdWFsIFtcInNhbXBsZS5qc1wiLCBcIkl0ZW0gMVwiLCBcIkl0ZW0gMlwiXVxuICAgICAgICBwYW5lLm1vdmVJdGVtKGl0ZW0xLCAyKVxuICAgICAgICBleHBlY3QodGFiQmFyLmdldFRhYnMoKS5tYXAgKHRhYikgLT4gdGFiLmVsZW1lbnQudGV4dENvbnRlbnQpLnRvRXF1YWwgW1wic2FtcGxlLmpzXCIsIFwiSXRlbSAyXCIsIFwiSXRlbSAxXCJdXG5cbiAgZGVzY3JpYmUgXCJjb250ZXh0IG1lbnUgY29tbWFuZHNcIiwgLT5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBwYW5lRWxlbWVudCA9IHBhbmUuZ2V0RWxlbWVudCgpXG4gICAgICBwYW5lRWxlbWVudC5pbnNlcnRCZWZvcmUodGFiQmFyLmVsZW1lbnQsIHBhbmVFbGVtZW50LmZpcnN0Q2hpbGQpXG5cbiAgICBkZXNjcmliZSBcIndoZW4gdGFiczpjbG9zZS10YWIgaXMgZmlyZWRcIiwgLT5cbiAgICAgIGl0IFwiY2xvc2VzIHRoZSBhY3RpdmUgdGFiXCIsIC0+XG4gICAgICAgIHRyaWdnZXJNb3VzZUV2ZW50KCdtb3VzZWRvd24nLCB0YWJCYXIudGFiRm9ySXRlbShpdGVtMikuZWxlbWVudCwgd2hpY2g6IDMpXG4gICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2godGFiQmFyLmVsZW1lbnQsICd0YWJzOmNsb3NlLXRhYicpXG4gICAgICAgIGV4cGVjdChwYW5lLmdldEl0ZW1zKCkubGVuZ3RoKS50b0JlIDJcbiAgICAgICAgZXhwZWN0KHBhbmUuZ2V0SXRlbXMoKS5pbmRleE9mKGl0ZW0yKSkudG9CZSAtMVxuICAgICAgICBleHBlY3QodGFiQmFyLmdldFRhYnMoKS5sZW5ndGgpLnRvQmUgMlxuICAgICAgICBleHBlY3QodGFiQmFyLmVsZW1lbnQudGV4dENvbnRlbnQpLm5vdC50b01hdGNoKCdJdGVtIDInKVxuXG4gICAgZGVzY3JpYmUgXCJ3aGVuIHRhYnM6Y2xvc2Utb3RoZXItdGFicyBpcyBmaXJlZFwiLCAtPlxuICAgICAgaXQgXCJjbG9zZXMgYWxsIG90aGVyIHRhYnMgZXhjZXB0IHRoZSBhY3RpdmUgdGFiXCIsIC0+XG4gICAgICAgIHRyaWdnZXJNb3VzZUV2ZW50KCdtb3VzZWRvd24nLCB0YWJCYXIudGFiRm9ySXRlbShpdGVtMikuZWxlbWVudCwgd2hpY2g6IDMpXG4gICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2godGFiQmFyLmVsZW1lbnQsICd0YWJzOmNsb3NlLW90aGVyLXRhYnMnKVxuICAgICAgICBleHBlY3QocGFuZS5nZXRJdGVtcygpLmxlbmd0aCkudG9CZSAxXG4gICAgICAgIGV4cGVjdCh0YWJCYXIuZ2V0VGFicygpLmxlbmd0aCkudG9CZSAxXG4gICAgICAgIGV4cGVjdCh0YWJCYXIuZWxlbWVudC50ZXh0Q29udGVudCkubm90LnRvTWF0Y2goJ3NhbXBsZS5qcycpXG4gICAgICAgIGV4cGVjdCh0YWJCYXIuZWxlbWVudC50ZXh0Q29udGVudCkudG9NYXRjaCgnSXRlbSAyJylcblxuICAgIGRlc2NyaWJlIFwid2hlbiB0YWJzOmNsb3NlLXRhYnMtdG8tcmlnaHQgaXMgZmlyZWRcIiwgLT5cbiAgICAgIGl0IFwiY2xvc2VzIG9ubHkgdGhlIHRhYnMgdG8gdGhlIHJpZ2h0IG9mIHRoZSBhY3RpdmUgdGFiXCIsIC0+XG4gICAgICAgIHBhbmUuYWN0aXZhdGVJdGVtKGVkaXRvcjEpXG4gICAgICAgIHRyaWdnZXJNb3VzZUV2ZW50KCdtb3VzZWRvd24nLCB0YWJCYXIudGFiRm9ySXRlbShlZGl0b3IxKS5lbGVtZW50LCB3aGljaDogMylcbiAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh0YWJCYXIuZWxlbWVudCwgJ3RhYnM6Y2xvc2UtdGFicy10by1yaWdodCcpXG4gICAgICAgIGV4cGVjdChwYW5lLmdldEl0ZW1zKCkubGVuZ3RoKS50b0JlIDJcbiAgICAgICAgZXhwZWN0KHRhYkJhci5nZXRUYWJzKCkubGVuZ3RoKS50b0JlIDJcbiAgICAgICAgZXhwZWN0KHRhYkJhci5lbGVtZW50LnRleHRDb250ZW50KS5ub3QudG9NYXRjaCgnSXRlbSAyJylcbiAgICAgICAgZXhwZWN0KHRhYkJhci5lbGVtZW50LnRleHRDb250ZW50KS50b01hdGNoKCdJdGVtIDEnKVxuXG4gICAgZGVzY3JpYmUgXCJ3aGVuIHRhYnM6Y2xvc2UtdGFicy10by1sZWZ0IGlzIGZpcmVkXCIsIC0+XG4gICAgICBpdCBcImNsb3NlcyBvbmx5IHRoZSB0YWJzIHRvIHRoZSBsZWZ0IG9mIHRoZSBhY3RpdmUgdGFiXCIsIC0+XG4gICAgICAgIHBhbmUuYWN0aXZhdGVJdGVtKGVkaXRvcjEpXG4gICAgICAgIHRyaWdnZXJNb3VzZUV2ZW50KCdtb3VzZWRvd24nLCB0YWJCYXIudGFiRm9ySXRlbShlZGl0b3IxKS5lbGVtZW50LCB3aGljaDogMylcbiAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh0YWJCYXIuZWxlbWVudCwgJ3RhYnM6Y2xvc2UtdGFicy10by1sZWZ0JylcbiAgICAgICAgZXhwZWN0KHBhbmUuZ2V0SXRlbXMoKS5sZW5ndGgpLnRvQmUgMlxuICAgICAgICBleHBlY3QodGFiQmFyLmdldFRhYnMoKS5sZW5ndGgpLnRvQmUgMlxuICAgICAgICBleHBlY3QodGFiQmFyLmVsZW1lbnQudGV4dENvbnRlbnQpLnRvTWF0Y2goJ0l0ZW0gMicpXG4gICAgICAgIGV4cGVjdCh0YWJCYXIuZWxlbWVudC50ZXh0Q29udGVudCkubm90LnRvTWF0Y2goJ0l0ZW0gMScpXG5cbiAgICBkZXNjcmliZSBcIndoZW4gdGFiczpjbG9zZS1hbGwtdGFicyBpcyBmaXJlZFwiLCAtPlxuICAgICAgaXQgXCJjbG9zZXMgYWxsIHRoZSB0YWJzXCIsIC0+XG4gICAgICAgIGV4cGVjdChwYW5lLmdldEl0ZW1zKCkubGVuZ3RoKS50b0JlR3JlYXRlclRoYW4gMFxuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHRhYkJhci5lbGVtZW50LCAndGFiczpjbG9zZS1hbGwtdGFicycpXG4gICAgICAgIGV4cGVjdChwYW5lLmdldEl0ZW1zKCkubGVuZ3RoKS50b0JlIDBcblxuICAgIGRlc2NyaWJlIFwid2hlbiB0YWJzOmNsb3NlLXNhdmVkLXRhYnMgaXMgZmlyZWRcIiwgLT5cbiAgICAgIGl0IFwiY2xvc2VzIGFsbCB0aGUgc2F2ZWQgdGFic1wiLCAtPlxuICAgICAgICBpdGVtMS5pc01vZGlmaWVkID0gLT4gdHJ1ZVxuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHRhYkJhci5lbGVtZW50LCAndGFiczpjbG9zZS1zYXZlZC10YWJzJylcbiAgICAgICAgZXhwZWN0KHBhbmUuZ2V0SXRlbXMoKS5sZW5ndGgpLnRvQmUgMVxuICAgICAgICBleHBlY3QocGFuZS5nZXRJdGVtcygpWzBdKS50b0JlIGl0ZW0xXG5cbiAgICBkZXNjcmliZSBcIndoZW4gdGFiczpzcGxpdC11cCBpcyBmaXJlZFwiLCAtPlxuICAgICAgaXQgXCJzcGxpdHMgdGhlIHNlbGVjdGVkIHRhYiB1cFwiLCAtPlxuICAgICAgICB0cmlnZ2VyTW91c2VFdmVudCgnbW91c2Vkb3duJywgdGFiQmFyLnRhYkZvckl0ZW0oaXRlbTIpLmVsZW1lbnQsIHdoaWNoOiAzKVxuICAgICAgICBleHBlY3QoZ2V0Q2VudGVyKCkuZ2V0UGFuZXMoKS5sZW5ndGgpLnRvQmUgMVxuXG4gICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2godGFiQmFyLmVsZW1lbnQsICd0YWJzOnNwbGl0LXVwJylcbiAgICAgICAgZXhwZWN0KGdldENlbnRlcigpLmdldFBhbmVzKCkubGVuZ3RoKS50b0JlIDJcbiAgICAgICAgZXhwZWN0KGdldENlbnRlcigpLmdldFBhbmVzKClbMV0pLnRvQmUgcGFuZVxuICAgICAgICBleHBlY3QoZ2V0Q2VudGVyKCkuZ2V0UGFuZXMoKVswXS5nZXRJdGVtcygpWzBdLmdldFRpdGxlKCkpLnRvQmUgaXRlbTIuZ2V0VGl0bGUoKVxuXG4gICAgZGVzY3JpYmUgXCJ3aGVuIHRhYnM6c3BsaXQtZG93biBpcyBmaXJlZFwiLCAtPlxuICAgICAgaXQgXCJzcGxpdHMgdGhlIHNlbGVjdGVkIHRhYiBkb3duXCIsIC0+XG4gICAgICAgIHRyaWdnZXJNb3VzZUV2ZW50KCdtb3VzZWRvd24nLCB0YWJCYXIudGFiRm9ySXRlbShpdGVtMikuZWxlbWVudCwgd2hpY2g6IDMpXG4gICAgICAgIGV4cGVjdChnZXRDZW50ZXIoKS5nZXRQYW5lcygpLmxlbmd0aCkudG9CZSAxXG5cbiAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh0YWJCYXIuZWxlbWVudCwgJ3RhYnM6c3BsaXQtZG93bicpXG4gICAgICAgIGV4cGVjdChnZXRDZW50ZXIoKS5nZXRQYW5lcygpLmxlbmd0aCkudG9CZSAyXG4gICAgICAgIGV4cGVjdChnZXRDZW50ZXIoKS5nZXRQYW5lcygpWzBdKS50b0JlIHBhbmVcbiAgICAgICAgZXhwZWN0KGdldENlbnRlcigpLmdldFBhbmVzKClbMV0uZ2V0SXRlbXMoKVswXS5nZXRUaXRsZSgpKS50b0JlIGl0ZW0yLmdldFRpdGxlKClcblxuICAgIGRlc2NyaWJlIFwid2hlbiB0YWJzOnNwbGl0LWxlZnQgaXMgZmlyZWRcIiwgLT5cbiAgICAgIGl0IFwic3BsaXRzIHRoZSBzZWxlY3RlZCB0YWIgdG8gdGhlIGxlZnRcIiwgLT5cbiAgICAgICAgdHJpZ2dlck1vdXNlRXZlbnQoJ21vdXNlZG93bicsIHRhYkJhci50YWJGb3JJdGVtKGl0ZW0yKS5lbGVtZW50LCB3aGljaDogMylcbiAgICAgICAgZXhwZWN0KGdldENlbnRlcigpLmdldFBhbmVzKCkubGVuZ3RoKS50b0JlIDFcblxuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHRhYkJhci5lbGVtZW50LCAndGFiczpzcGxpdC1sZWZ0JylcbiAgICAgICAgZXhwZWN0KGdldENlbnRlcigpLmdldFBhbmVzKCkubGVuZ3RoKS50b0JlIDJcbiAgICAgICAgZXhwZWN0KGdldENlbnRlcigpLmdldFBhbmVzKClbMV0pLnRvQmUgcGFuZVxuICAgICAgICBleHBlY3QoZ2V0Q2VudGVyKCkuZ2V0UGFuZXMoKVswXS5nZXRJdGVtcygpWzBdLmdldFRpdGxlKCkpLnRvQmUgaXRlbTIuZ2V0VGl0bGUoKVxuXG4gICAgZGVzY3JpYmUgXCJ3aGVuIHRhYnM6c3BsaXQtcmlnaHQgaXMgZmlyZWRcIiwgLT5cbiAgICAgIGl0IFwic3BsaXRzIHRoZSBzZWxlY3RlZCB0YWIgdG8gdGhlIHJpZ2h0XCIsIC0+XG4gICAgICAgIHRyaWdnZXJNb3VzZUV2ZW50KCdtb3VzZWRvd24nLCB0YWJCYXIudGFiRm9ySXRlbShpdGVtMikuZWxlbWVudCwgd2hpY2g6IDMpXG4gICAgICAgIGV4cGVjdChnZXRDZW50ZXIoKS5nZXRQYW5lcygpLmxlbmd0aCkudG9CZSAxXG5cbiAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh0YWJCYXIuZWxlbWVudCwgJ3RhYnM6c3BsaXQtcmlnaHQnKVxuICAgICAgICBleHBlY3QoZ2V0Q2VudGVyKCkuZ2V0UGFuZXMoKS5sZW5ndGgpLnRvQmUgMlxuICAgICAgICBleHBlY3QoZ2V0Q2VudGVyKCkuZ2V0UGFuZXMoKVswXSkudG9CZSBwYW5lXG4gICAgICAgIGV4cGVjdChnZXRDZW50ZXIoKS5nZXRQYW5lcygpWzFdLmdldEl0ZW1zKClbMF0uZ2V0VGl0bGUoKSkudG9CZSBpdGVtMi5nZXRUaXRsZSgpXG5cbiAgICBkZXNjcmliZSBcIndoZW4gdGFiczpvcGVuLWluLW5ldy13aW5kb3cgaXMgZmlyZWRcIiwgLT5cbiAgICAgIGRlc2NyaWJlIFwiYnkgcmlnaHQtY2xpY2tpbmcgb24gYSB0YWJcIiwgLT5cbiAgICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICAgIHRyaWdnZXJNb3VzZUV2ZW50KCdtb3VzZWRvd24nLCB0YWJCYXIudGFiRm9ySXRlbShpdGVtMSkuZWxlbWVudCwgd2hpY2g6IDMpXG4gICAgICAgICAgZXhwZWN0KGdldENlbnRlcigpLmdldFBhbmVzKCkubGVuZ3RoKS50b0JlIDFcblxuICAgICAgICBpdCBcIm9wZW5zIG5ldyB3aW5kb3csIGNsb3NlcyBjdXJyZW50IHRhYlwiLCAtPlxuICAgICAgICAgIHNweU9uKGF0b20sICdvcGVuJylcbiAgICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHRhYkJhci5lbGVtZW50LCAndGFiczpvcGVuLWluLW5ldy13aW5kb3cnKVxuICAgICAgICAgIGV4cGVjdChhdG9tLm9wZW4pLnRvSGF2ZUJlZW5DYWxsZWQoKVxuXG4gICAgICAgICAgZXhwZWN0KHBhbmUuZ2V0SXRlbXMoKS5sZW5ndGgpLnRvQmUgMlxuICAgICAgICAgIGV4cGVjdCh0YWJCYXIuZ2V0VGFicygpLmxlbmd0aCkudG9CZSAyXG4gICAgICAgICAgZXhwZWN0KHRhYkJhci5lbGVtZW50LnRleHRDb250ZW50KS50b01hdGNoKCdJdGVtIDInKVxuICAgICAgICAgIGV4cGVjdCh0YWJCYXIuZWxlbWVudC50ZXh0Q29udGVudCkubm90LnRvTWF0Y2goJ0l0ZW0gMScpXG5cbiAgICAgIGRlc2NyaWJlIFwiZnJvbSB0aGUgY29tbWFuZCBwYWxldHRlXCIsIC0+XG4gICAgICAgICMgU2VlICMzMDkgZm9yIGJhY2tncm91bmRcblxuICAgICAgICBpdCBcImRvZXMgbm90aGluZ1wiLCAtPlxuICAgICAgICAgIHNweU9uKGF0b20sICdvcGVuJylcbiAgICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHRhYkJhci5lbGVtZW50LCAndGFiczpvcGVuLWluLW5ldy13aW5kb3cnKVxuICAgICAgICAgIGV4cGVjdChhdG9tLm9wZW4pLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcblxuICBkZXNjcmliZSBcImNvbW1hbmQgcGFsZXR0ZSBjb21tYW5kc1wiLCAtPlxuICAgIHBhbmVFbGVtZW50ID0gbnVsbFxuXG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgcGFuZUVsZW1lbnQgPSBwYW5lLmdldEVsZW1lbnQoKVxuXG4gICAgZGVzY3JpYmUgXCJ3aGVuIHRhYnM6Y2xvc2UtdGFiIGlzIGZpcmVkXCIsIC0+XG4gICAgICBpdCBcImNsb3NlcyB0aGUgYWN0aXZlIHRhYlwiLCAtPlxuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHBhbmVFbGVtZW50LCAndGFiczpjbG9zZS10YWInKVxuICAgICAgICBleHBlY3QocGFuZS5nZXRJdGVtcygpLmxlbmd0aCkudG9CZSAyXG4gICAgICAgIGV4cGVjdChwYW5lLmdldEl0ZW1zKCkuaW5kZXhPZihpdGVtMikpLnRvQmUgLTFcbiAgICAgICAgZXhwZWN0KHRhYkJhci5nZXRUYWJzKCkubGVuZ3RoKS50b0JlIDJcbiAgICAgICAgZXhwZWN0KHRhYkJhci5lbGVtZW50LnRleHRDb250ZW50KS5ub3QudG9NYXRjaCgnSXRlbSAyJylcblxuICAgICAgaXQgXCJkb2VzIG5vdGhpbmcgaWYgbm8gdGFicyBhcmUgb3BlblwiLCAtPlxuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHBhbmVFbGVtZW50LCAndGFiczpjbG9zZS10YWInKVxuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHBhbmVFbGVtZW50LCAndGFiczpjbG9zZS10YWInKVxuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHBhbmVFbGVtZW50LCAndGFiczpjbG9zZS10YWInKVxuICAgICAgICBleHBlY3QocGFuZS5nZXRJdGVtcygpLmxlbmd0aCkudG9CZSAwXG4gICAgICAgIGV4cGVjdCh0YWJCYXIuZ2V0VGFicygpLmxlbmd0aCkudG9CZSAwXG5cbiAgICBkZXNjcmliZSBcIndoZW4gdGFiczpjbG9zZS1vdGhlci10YWJzIGlzIGZpcmVkXCIsIC0+XG4gICAgICBpdCBcImNsb3NlcyBhbGwgb3RoZXIgdGFicyBleGNlcHQgdGhlIGFjdGl2ZSB0YWJcIiwgLT5cbiAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaChwYW5lRWxlbWVudCwgJ3RhYnM6Y2xvc2Utb3RoZXItdGFicycpXG4gICAgICAgIGV4cGVjdChwYW5lLmdldEl0ZW1zKCkubGVuZ3RoKS50b0JlIDFcbiAgICAgICAgZXhwZWN0KHRhYkJhci5nZXRUYWJzKCkubGVuZ3RoKS50b0JlIDFcbiAgICAgICAgZXhwZWN0KHRhYkJhci5lbGVtZW50LnRleHRDb250ZW50KS5ub3QudG9NYXRjaCgnc2FtcGxlLmpzJylcbiAgICAgICAgZXhwZWN0KHRhYkJhci5lbGVtZW50LnRleHRDb250ZW50KS50b01hdGNoKCdJdGVtIDInKVxuXG4gICAgZGVzY3JpYmUgXCJ3aGVuIHRhYnM6Y2xvc2UtdGFicy10by1yaWdodCBpcyBmaXJlZFwiLCAtPlxuICAgICAgaXQgXCJjbG9zZXMgb25seSB0aGUgdGFicyB0byB0aGUgcmlnaHQgb2YgdGhlIGFjdGl2ZSB0YWJcIiwgLT5cbiAgICAgICAgcGFuZS5hY3RpdmF0ZUl0ZW0oZWRpdG9yMSlcbiAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaChwYW5lRWxlbWVudCwgJ3RhYnM6Y2xvc2UtdGFicy10by1yaWdodCcpXG4gICAgICAgIGV4cGVjdChwYW5lLmdldEl0ZW1zKCkubGVuZ3RoKS50b0JlIDJcbiAgICAgICAgZXhwZWN0KHRhYkJhci5nZXRUYWJzKCkubGVuZ3RoKS50b0JlIDJcbiAgICAgICAgZXhwZWN0KHRhYkJhci5lbGVtZW50LnRleHRDb250ZW50KS5ub3QudG9NYXRjaCgnSXRlbSAyJylcbiAgICAgICAgZXhwZWN0KHRhYkJhci5lbGVtZW50LnRleHRDb250ZW50KS50b01hdGNoKCdJdGVtIDEnKVxuXG4gICAgZGVzY3JpYmUgXCJ3aGVuIHRhYnM6Y2xvc2UtYWxsLXRhYnMgaXMgZmlyZWRcIiwgLT5cbiAgICAgIGl0IFwiY2xvc2VzIGFsbCB0aGUgdGFic1wiLCAtPlxuICAgICAgICBleHBlY3QocGFuZS5nZXRJdGVtcygpLmxlbmd0aCkudG9CZUdyZWF0ZXJUaGFuIDBcbiAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaChwYW5lRWxlbWVudCwgJ3RhYnM6Y2xvc2UtYWxsLXRhYnMnKVxuICAgICAgICBleHBlY3QocGFuZS5nZXRJdGVtcygpLmxlbmd0aCkudG9CZSAwXG5cbiAgICBkZXNjcmliZSBcIndoZW4gdGFiczpjbG9zZS1zYXZlZC10YWJzIGlzIGZpcmVkXCIsIC0+XG4gICAgICBpdCBcImNsb3NlcyBhbGwgdGhlIHNhdmVkIHRhYnNcIiwgLT5cbiAgICAgICAgaXRlbTEuaXNNb2RpZmllZCA9IC0+IHRydWVcbiAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaChwYW5lRWxlbWVudCwgJ3RhYnM6Y2xvc2Utc2F2ZWQtdGFicycpXG4gICAgICAgIGV4cGVjdChwYW5lLmdldEl0ZW1zKCkubGVuZ3RoKS50b0JlIDFcbiAgICAgICAgZXhwZWN0KHBhbmUuZ2V0SXRlbXMoKVswXSkudG9CZSBpdGVtMVxuXG4gICAgZGVzY3JpYmUgXCJ3aGVuIHBhbmU6Y2xvc2UgaXMgZmlyZWRcIiwgLT5cbiAgICAgIGl0IFwiZGVzdHJveXMgYWxsIHRoZSB0YWJzIHdpdGhpbiB0aGUgcGFuZVwiLCAtPlxuICAgICAgICBwYW5lMiA9IHBhbmUuc3BsaXREb3duKGNvcHlBY3RpdmVJdGVtOiB0cnVlKVxuICAgICAgICB0YWJCYXIyID0gbmV3IFRhYkJhclZpZXcocGFuZTIsICdjZW50ZXInKVxuICAgICAgICB0YWIyID0gdGFiQmFyMi50YWJBdEluZGV4KDApXG4gICAgICAgIHNweU9uKHRhYjIsICdkZXN0cm95JylcblxuICAgICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgICBQcm9taXNlLnJlc29sdmUocGFuZTIuY2xvc2UoKSkudGhlbiAtPlxuICAgICAgICAgICAgZXhwZWN0KHRhYjIuZGVzdHJveSkudG9IYXZlQmVlbkNhbGxlZCgpXG5cbiAgZGVzY3JpYmUgXCJkcmFnZ2luZyBhbmQgZHJvcHBpbmcgdGFic1wiLCAtPlxuICAgIGRlc2NyaWJlIFwid2hlbiBhIHRhYiBpcyBkcmFnZ2VkIHdpdGhpbiB0aGUgc2FtZSBwYW5lXCIsIC0+XG4gICAgICBkZXNjcmliZSBcIndoZW4gaXQgaXMgZHJvcHBlZCBvbiB0YWIgdGhhdCdzIGxhdGVyIGluIHRoZSBsaXN0XCIsIC0+XG4gICAgICAgIGl0IFwibW92ZXMgdGhlIHRhYiBhbmQgaXRzIGl0ZW0sIHNob3dzIHRoZSB0YWIncyBpdGVtLCBhbmQgZm9jdXNlcyB0aGUgcGFuZVwiLCAtPlxuICAgICAgICAgIGV4cGVjdCh0YWJCYXIuZ2V0VGFicygpLm1hcCAodGFiKSAtPiB0YWIuZWxlbWVudC50ZXh0Q29udGVudCkudG9FcXVhbCBbXCJJdGVtIDFcIiwgXCJzYW1wbGUuanNcIiwgXCJJdGVtIDJcIl1cbiAgICAgICAgICBleHBlY3QocGFuZS5nZXRJdGVtcygpKS50b0VxdWFsIFtpdGVtMSwgZWRpdG9yMSwgaXRlbTJdXG4gICAgICAgICAgZXhwZWN0KHBhbmUuZ2V0QWN0aXZlSXRlbSgpKS50b0JlIGl0ZW0yXG4gICAgICAgICAgc3B5T24ocGFuZSwgJ2FjdGl2YXRlJylcblxuICAgICAgICAgIHRhYlRvRHJhZyA9IHRhYkJhci50YWJBdEluZGV4KDApXG4gICAgICAgICAgc3B5T24odGFiVG9EcmFnLCAnZGVzdHJveVRvb2x0aXAnKVxuICAgICAgICAgIHNweU9uKHRhYlRvRHJhZywgJ3VwZGF0ZVRvb2x0aXAnKVxuICAgICAgICAgIFtkcmFnU3RhcnRFdmVudCwgZHJvcEV2ZW50XSA9IGJ1aWxkRHJhZ0V2ZW50cyh0YWJUb0RyYWcuZWxlbWVudCwgdGFiQmFyLnRhYkF0SW5kZXgoMSkuZWxlbWVudClcbiAgICAgICAgICB0YWJCYXIub25EcmFnU3RhcnQoZHJhZ1N0YXJ0RXZlbnQpXG5cbiAgICAgICAgICBleHBlY3QodGFiVG9EcmFnLmRlc3Ryb3lUb29sdGlwKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgICAgICBleHBlY3QodGFiVG9EcmFnLnVwZGF0ZVRvb2x0aXApLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcblxuICAgICAgICAgIHRhYkJhci5vbkRyb3AoZHJvcEV2ZW50KVxuICAgICAgICAgIGV4cGVjdCh0YWJUb0RyYWcudXBkYXRlVG9vbHRpcCkudG9IYXZlQmVlbkNhbGxlZCgpXG5cbiAgICAgICAgICBleHBlY3QodGFiQmFyLmdldFRhYnMoKS5tYXAgKHRhYikgLT4gdGFiLmVsZW1lbnQudGV4dENvbnRlbnQpLnRvRXF1YWwgW1wic2FtcGxlLmpzXCIsIFwiSXRlbSAxXCIsIFwiSXRlbSAyXCJdXG4gICAgICAgICAgZXhwZWN0KHBhbmUuZ2V0SXRlbXMoKSkudG9FcXVhbCBbZWRpdG9yMSwgaXRlbTEsIGl0ZW0yXVxuICAgICAgICAgIGV4cGVjdChwYW5lLmdldEFjdGl2ZUl0ZW0oKSkudG9CZSBpdGVtMVxuICAgICAgICAgIGV4cGVjdChwYW5lLmFjdGl2YXRlKS50b0hhdmVCZWVuQ2FsbGVkKClcblxuICAgICAgZGVzY3JpYmUgXCJ3aGVuIGl0IGlzIGRyb3BwZWQgb24gYSB0YWIgdGhhdCdzIGVhcmxpZXIgaW4gdGhlIGxpc3RcIiwgLT5cbiAgICAgICAgaXQgXCJtb3ZlcyB0aGUgdGFiIGFuZCBpdHMgaXRlbSwgc2hvd3MgdGhlIHRhYidzIGl0ZW0sIGFuZCBmb2N1c2VzIHRoZSBwYW5lXCIsIC0+XG4gICAgICAgICAgZXhwZWN0KHRhYkJhci5nZXRUYWJzKCkubWFwICh0YWIpIC0+IHRhYi5lbGVtZW50LnRleHRDb250ZW50KS50b0VxdWFsIFtcIkl0ZW0gMVwiLCBcInNhbXBsZS5qc1wiLCBcIkl0ZW0gMlwiXVxuICAgICAgICAgIGV4cGVjdChwYW5lLmdldEl0ZW1zKCkpLnRvRXF1YWwgW2l0ZW0xLCBlZGl0b3IxLCBpdGVtMl1cbiAgICAgICAgICBleHBlY3QocGFuZS5nZXRBY3RpdmVJdGVtKCkpLnRvQmUgaXRlbTJcbiAgICAgICAgICBzcHlPbihwYW5lLCAnYWN0aXZhdGUnKVxuXG4gICAgICAgICAgW2RyYWdTdGFydEV2ZW50LCBkcm9wRXZlbnRdID0gYnVpbGREcmFnRXZlbnRzKHRhYkJhci50YWJBdEluZGV4KDIpLmVsZW1lbnQsIHRhYkJhci50YWJBdEluZGV4KDApLmVsZW1lbnQpXG4gICAgICAgICAgdGFiQmFyLm9uRHJhZ1N0YXJ0KGRyYWdTdGFydEV2ZW50KVxuICAgICAgICAgIHRhYkJhci5vbkRyb3AoZHJvcEV2ZW50KVxuXG4gICAgICAgICAgZXhwZWN0KHRhYkJhci5nZXRUYWJzKCkubWFwICh0YWIpIC0+IHRhYi5lbGVtZW50LnRleHRDb250ZW50KS50b0VxdWFsIFtcIkl0ZW0gMVwiLCBcIkl0ZW0gMlwiLCBcInNhbXBsZS5qc1wiXVxuICAgICAgICAgIGV4cGVjdChwYW5lLmdldEl0ZW1zKCkpLnRvRXF1YWwgW2l0ZW0xLCBpdGVtMiwgZWRpdG9yMV1cbiAgICAgICAgICBleHBlY3QocGFuZS5nZXRBY3RpdmVJdGVtKCkpLnRvQmUgaXRlbTJcbiAgICAgICAgICBleHBlY3QocGFuZS5hY3RpdmF0ZSkudG9IYXZlQmVlbkNhbGxlZCgpXG5cbiAgICAgIGRlc2NyaWJlIFwid2hlbiBpdCBpcyBkcm9wcGVkIG9uIGl0c2VsZlwiLCAtPlxuICAgICAgICBpdCBcImRvZXNuJ3QgbW92ZSB0aGUgdGFiIG9yIGl0ZW0sIGJ1dCBkb2VzIG1ha2UgaXQgdGhlIGFjdGl2ZSBpdGVtIGFuZCBmb2N1c2VzIHRoZSBwYW5lXCIsIC0+XG4gICAgICAgICAgZXhwZWN0KHRhYkJhci5nZXRUYWJzKCkubWFwICh0YWIpIC0+IHRhYi5lbGVtZW50LnRleHRDb250ZW50KS50b0VxdWFsIFtcIkl0ZW0gMVwiLCBcInNhbXBsZS5qc1wiLCBcIkl0ZW0gMlwiXVxuICAgICAgICAgIGV4cGVjdChwYW5lLmdldEl0ZW1zKCkpLnRvRXF1YWwgW2l0ZW0xLCBlZGl0b3IxLCBpdGVtMl1cbiAgICAgICAgICBleHBlY3QocGFuZS5nZXRBY3RpdmVJdGVtKCkpLnRvQmUgaXRlbTJcbiAgICAgICAgICBzcHlPbihwYW5lLCAnYWN0aXZhdGUnKVxuXG4gICAgICAgICAgW2RyYWdTdGFydEV2ZW50LCBkcm9wRXZlbnRdID0gYnVpbGREcmFnRXZlbnRzKHRhYkJhci50YWJBdEluZGV4KDApLmVsZW1lbnQsIHRhYkJhci50YWJBdEluZGV4KDApLmVsZW1lbnQpXG4gICAgICAgICAgdGFiQmFyLm9uRHJhZ1N0YXJ0KGRyYWdTdGFydEV2ZW50KVxuICAgICAgICAgIHRhYkJhci5vbkRyb3AoZHJvcEV2ZW50KVxuXG4gICAgICAgICAgZXhwZWN0KHRhYkJhci5nZXRUYWJzKCkubWFwICh0YWIpIC0+IHRhYi5lbGVtZW50LnRleHRDb250ZW50KS50b0VxdWFsIFtcIkl0ZW0gMVwiLCBcInNhbXBsZS5qc1wiLCBcIkl0ZW0gMlwiXVxuICAgICAgICAgIGV4cGVjdChwYW5lLmdldEl0ZW1zKCkpLnRvRXF1YWwgW2l0ZW0xLCBlZGl0b3IxLCBpdGVtMl1cbiAgICAgICAgICBleHBlY3QocGFuZS5nZXRBY3RpdmVJdGVtKCkpLnRvQmUgaXRlbTFcbiAgICAgICAgICBleHBlY3QocGFuZS5hY3RpdmF0ZSkudG9IYXZlQmVlbkNhbGxlZCgpXG5cbiAgICAgIGRlc2NyaWJlIFwid2hlbiBpdCBpcyBkcm9wcGVkIG9uIHRoZSB0YWIgYmFyXCIsIC0+XG4gICAgICAgIGl0IFwibW92ZXMgdGhlIHRhYiBhbmQgaXRzIGl0ZW0gdG8gdGhlIGVuZFwiLCAtPlxuICAgICAgICAgIGV4cGVjdCh0YWJCYXIuZ2V0VGFicygpLm1hcCAodGFiKSAtPiB0YWIuZWxlbWVudC50ZXh0Q29udGVudCkudG9FcXVhbCBbXCJJdGVtIDFcIiwgXCJzYW1wbGUuanNcIiwgXCJJdGVtIDJcIl1cbiAgICAgICAgICBleHBlY3QocGFuZS5nZXRJdGVtcygpKS50b0VxdWFsIFtpdGVtMSwgZWRpdG9yMSwgaXRlbTJdXG4gICAgICAgICAgZXhwZWN0KHBhbmUuZ2V0QWN0aXZlSXRlbSgpKS50b0JlIGl0ZW0yXG4gICAgICAgICAgc3B5T24ocGFuZSwgJ2FjdGl2YXRlJylcblxuICAgICAgICAgIFtkcmFnU3RhcnRFdmVudCwgZHJvcEV2ZW50XSA9IGJ1aWxkRHJhZ0V2ZW50cyh0YWJCYXIudGFiQXRJbmRleCgwKS5lbGVtZW50LCB0YWJCYXIuZWxlbWVudClcbiAgICAgICAgICB0YWJCYXIub25EcmFnU3RhcnQoZHJhZ1N0YXJ0RXZlbnQpXG4gICAgICAgICAgdGFiQmFyLm9uRHJvcChkcm9wRXZlbnQpXG5cbiAgICAgICAgICBleHBlY3QodGFiQmFyLmdldFRhYnMoKS5tYXAgKHRhYikgLT4gdGFiLmVsZW1lbnQudGV4dENvbnRlbnQpLnRvRXF1YWwgW1wic2FtcGxlLmpzXCIsIFwiSXRlbSAyXCIsIFwiSXRlbSAxXCJdXG4gICAgICAgICAgZXhwZWN0KHBhbmUuZ2V0SXRlbXMoKSkudG9FcXVhbCBbZWRpdG9yMSwgaXRlbTIsIGl0ZW0xXVxuXG4gICAgZGVzY3JpYmUgXCJ3aGVuIGEgdGFiIGlzIGRyYWdnZWQgdG8gYSBkaWZmZXJlbnQgcGFuZVwiLCAtPlxuICAgICAgW3BhbmUyLCB0YWJCYXIyLCBpdGVtMmJdID0gW11cblxuICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICBwYW5lMiA9IHBhbmUuc3BsaXRSaWdodChjb3B5QWN0aXZlSXRlbTogdHJ1ZSlcbiAgICAgICAgW2l0ZW0yYl0gPSBwYW5lMi5nZXRJdGVtcygpXG4gICAgICAgIHRhYkJhcjIgPSBuZXcgVGFiQmFyVmlldyhwYW5lMiwgJ2NlbnRlcicpXG5cbiAgICAgIGl0IFwicmVtb3ZlcyB0aGUgdGFiIGFuZCBpdGVtIGZyb20gdGhlaXIgb3JpZ2luYWwgcGFuZSBhbmQgbW92ZXMgdGhlbSB0byB0aGUgdGFyZ2V0IHBhbmVcIiwgLT5cbiAgICAgICAgZXhwZWN0KHRhYkJhci5nZXRUYWJzKCkubWFwICh0YWIpIC0+IHRhYi5lbGVtZW50LnRleHRDb250ZW50KS50b0VxdWFsIFtcIkl0ZW0gMVwiLCBcInNhbXBsZS5qc1wiLCBcIkl0ZW0gMlwiXVxuICAgICAgICBleHBlY3QocGFuZS5nZXRJdGVtcygpKS50b0VxdWFsIFtpdGVtMSwgZWRpdG9yMSwgaXRlbTJdXG4gICAgICAgIGV4cGVjdChwYW5lLmdldEFjdGl2ZUl0ZW0oKSkudG9CZSBpdGVtMlxuXG4gICAgICAgIGV4cGVjdCh0YWJCYXIyLmdldFRhYnMoKS5tYXAgKHRhYikgLT4gdGFiLmVsZW1lbnQudGV4dENvbnRlbnQpLnRvRXF1YWwgW1wiSXRlbSAyXCJdXG4gICAgICAgIGV4cGVjdChwYW5lMi5nZXRJdGVtcygpKS50b0VxdWFsIFtpdGVtMmJdXG4gICAgICAgIGV4cGVjdChwYW5lMi5hY3RpdmVJdGVtKS50b0JlIGl0ZW0yYlxuICAgICAgICBzcHlPbihwYW5lMiwgJ2FjdGl2YXRlJylcblxuICAgICAgICBbZHJhZ1N0YXJ0RXZlbnQsIGRyb3BFdmVudF0gPSBidWlsZERyYWdFdmVudHModGFiQmFyLnRhYkF0SW5kZXgoMCkuZWxlbWVudCwgdGFiQmFyMi50YWJBdEluZGV4KDApLmVsZW1lbnQpXG4gICAgICAgIHRhYkJhci5vbkRyYWdTdGFydChkcmFnU3RhcnRFdmVudClcbiAgICAgICAgdGFiQmFyMi5vbkRyb3AoZHJvcEV2ZW50KVxuXG4gICAgICAgIGV4cGVjdCh0YWJCYXIuZ2V0VGFicygpLm1hcCAodGFiKSAtPiB0YWIuZWxlbWVudC50ZXh0Q29udGVudCkudG9FcXVhbCBbXCJzYW1wbGUuanNcIiwgXCJJdGVtIDJcIl1cbiAgICAgICAgZXhwZWN0KHBhbmUuZ2V0SXRlbXMoKSkudG9FcXVhbCBbZWRpdG9yMSwgaXRlbTJdXG4gICAgICAgIGV4cGVjdChwYW5lLmdldEFjdGl2ZUl0ZW0oKSkudG9CZSBpdGVtMlxuXG4gICAgICAgIGV4cGVjdCh0YWJCYXIyLmdldFRhYnMoKS5tYXAgKHRhYikgLT4gdGFiLmVsZW1lbnQudGV4dENvbnRlbnQpLnRvRXF1YWwgW1wiSXRlbSAyXCIsIFwiSXRlbSAxXCJdXG4gICAgICAgIGV4cGVjdChwYW5lMi5nZXRJdGVtcygpKS50b0VxdWFsIFtpdGVtMmIsIGl0ZW0xXVxuICAgICAgICBleHBlY3QocGFuZTIuYWN0aXZlSXRlbSkudG9CZSBpdGVtMVxuICAgICAgICBleHBlY3QocGFuZTIuYWN0aXZhdGUpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuXG4gICAgICBkZXNjcmliZSBcIndoZW4gdGhlIHRhYiBpcyBkcmFnZ2VkIHRvIGFuIGVtcHR5IHBhbmVcIiwgLT5cbiAgICAgICAgaXQgXCJyZW1vdmVzIHRoZSB0YWIgYW5kIGl0ZW0gZnJvbSB0aGVpciBvcmlnaW5hbCBwYW5lIGFuZCBtb3ZlcyB0aGVtIHRvIHRoZSB0YXJnZXQgcGFuZVwiLCAtPlxuICAgICAgICAgIHBhbmUyLmRlc3Ryb3lJdGVtcygpXG5cbiAgICAgICAgICBleHBlY3QodGFiQmFyLmdldFRhYnMoKS5tYXAgKHRhYikgLT4gdGFiLmVsZW1lbnQudGV4dENvbnRlbnQpLnRvRXF1YWwgW1wiSXRlbSAxXCIsIFwic2FtcGxlLmpzXCIsIFwiSXRlbSAyXCJdXG4gICAgICAgICAgZXhwZWN0KHBhbmUuZ2V0SXRlbXMoKSkudG9FcXVhbCBbaXRlbTEsIGVkaXRvcjEsIGl0ZW0yXVxuICAgICAgICAgIGV4cGVjdChwYW5lLmdldEFjdGl2ZUl0ZW0oKSkudG9CZSBpdGVtMlxuXG4gICAgICAgICAgZXhwZWN0KHRhYkJhcjIuZ2V0VGFicygpLm1hcCAodGFiKSAtPiB0YWIuZWxlbWVudC50ZXh0Q29udGVudCkudG9FcXVhbCBbXVxuICAgICAgICAgIGV4cGVjdChwYW5lMi5nZXRJdGVtcygpKS50b0VxdWFsIFtdXG4gICAgICAgICAgZXhwZWN0KHBhbmUyLmFjdGl2ZUl0ZW0pLnRvQmVVbmRlZmluZWQoKVxuICAgICAgICAgIHNweU9uKHBhbmUyLCAnYWN0aXZhdGUnKVxuXG4gICAgICAgICAgW2RyYWdTdGFydEV2ZW50LCBkcm9wRXZlbnRdID0gYnVpbGREcmFnRXZlbnRzKHRhYkJhci50YWJBdEluZGV4KDApLmVsZW1lbnQsIHRhYkJhcjIuZWxlbWVudClcbiAgICAgICAgICB0YWJCYXIub25EcmFnU3RhcnQoZHJhZ1N0YXJ0RXZlbnQpXG4gICAgICAgICAgdGFiQmFyMi5vbkRyYWdPdmVyKGRyb3BFdmVudClcbiAgICAgICAgICB0YWJCYXIyLm9uRHJvcChkcm9wRXZlbnQpXG5cbiAgICAgICAgICBleHBlY3QodGFiQmFyLmdldFRhYnMoKS5tYXAgKHRhYikgLT4gdGFiLmVsZW1lbnQudGV4dENvbnRlbnQpLnRvRXF1YWwgW1wic2FtcGxlLmpzXCIsIFwiSXRlbSAyXCJdXG4gICAgICAgICAgZXhwZWN0KHBhbmUuZ2V0SXRlbXMoKSkudG9FcXVhbCBbZWRpdG9yMSwgaXRlbTJdXG4gICAgICAgICAgZXhwZWN0KHBhbmUuZ2V0QWN0aXZlSXRlbSgpKS50b0JlIGl0ZW0yXG5cbiAgICAgICAgICBleHBlY3QodGFiQmFyMi5nZXRUYWJzKCkubWFwICh0YWIpIC0+IHRhYi5lbGVtZW50LnRleHRDb250ZW50KS50b0VxdWFsIFtcIkl0ZW0gMVwiXVxuICAgICAgICAgIGV4cGVjdChwYW5lMi5nZXRJdGVtcygpKS50b0VxdWFsIFtpdGVtMV1cbiAgICAgICAgICBleHBlY3QocGFuZTIuYWN0aXZlSXRlbSkudG9CZSBpdGVtMVxuICAgICAgICAgIGV4cGVjdChwYW5lMi5hY3RpdmF0ZSkudG9IYXZlQmVlbkNhbGxlZCgpXG5cbiAgICAgIGRlc2NyaWJlIFwid2hlbiBhZGROZXdUYWJzQXRFbmQgaXMgc2V0IHRvIHRydWUgaW4gcGFja2FnZSBzZXR0aW5nc1wiLCAtPlxuICAgICAgICBpdCBcIm1vdmVzIHRoZSBkcmFnZ2VkIHRhYiB0byB0aGUgZGVzaXJlZCBpbmRleCBpbiB0aGUgbmV3IHBhbmVcIiwgLT5cbiAgICAgICAgICBhdG9tLmNvbmZpZy5zZXQoXCJ0YWJzLmFkZE5ld1RhYnNBdEVuZFwiLCB0cnVlKVxuICAgICAgICAgIGV4cGVjdCh0YWJCYXIuZ2V0VGFicygpLm1hcCAodGFiKSAtPiB0YWIuZWxlbWVudC50ZXh0Q29udGVudCkudG9FcXVhbCBbXCJJdGVtIDFcIiwgXCJzYW1wbGUuanNcIiwgXCJJdGVtIDJcIl1cbiAgICAgICAgICBleHBlY3QocGFuZS5nZXRJdGVtcygpKS50b0VxdWFsIFtpdGVtMSwgZWRpdG9yMSwgaXRlbTJdXG4gICAgICAgICAgZXhwZWN0KHBhbmUuZ2V0QWN0aXZlSXRlbSgpKS50b0JlIGl0ZW0yXG5cbiAgICAgICAgICBleHBlY3QodGFiQmFyMi5nZXRUYWJzKCkubWFwICh0YWIpIC0+IHRhYi5lbGVtZW50LnRleHRDb250ZW50KS50b0VxdWFsIFtcIkl0ZW0gMlwiXVxuICAgICAgICAgIGV4cGVjdChwYW5lMi5nZXRJdGVtcygpKS50b0VxdWFsIFtpdGVtMmJdXG4gICAgICAgICAgZXhwZWN0KHBhbmUyLmFjdGl2ZUl0ZW0pLnRvQmUgaXRlbTJiXG4gICAgICAgICAgc3B5T24ocGFuZTIsICdhY3RpdmF0ZScpXG5cbiAgICAgICAgICBbZHJhZ1N0YXJ0RXZlbnQsIGRyb3BFdmVudF0gPSBidWlsZERyYWdFdmVudHModGFiQmFyMi50YWJBdEluZGV4KDApLmVsZW1lbnQsIHRhYkJhci50YWJBdEluZGV4KDApLmVsZW1lbnQpXG4gICAgICAgICAgdGFiQmFyMi5vbkRyYWdTdGFydChkcmFnU3RhcnRFdmVudClcbiAgICAgICAgICB0YWJCYXIub25Ecm9wKGRyb3BFdmVudClcblxuICAgICAgICAgIGV4cGVjdCh0YWJCYXIuZ2V0VGFicygpLm1hcCAodGFiKSAtPiB0YWIuZWxlbWVudC50ZXh0Q29udGVudCkudG9FcXVhbCBbXCJJdGVtIDFcIiwgXCJJdGVtIDJcIiwgXCJzYW1wbGUuanNcIiwgXCJJdGVtIDJcIl1cbiAgICAgICAgICBleHBlY3QocGFuZS5nZXRJdGVtcygpKS50b0VxdWFsIFtpdGVtMSwgaXRlbTJiLCBlZGl0b3IxLCBpdGVtMl1cbiAgICAgICAgICBleHBlY3QocGFuZS5nZXRBY3RpdmVJdGVtKCkpLnRvQmUgaXRlbTJiXG5cbiAgICAgICAgICBhdG9tLmNvbmZpZy5zZXQoXCJ0YWJzLmFkZE5ld1RhYnNBdEVuZFwiLCBmYWxzZSlcblxuICAgIGRlc2NyaWJlIFwid2hlbiBhIHRhYiBpcyBkcmFnZ2VkIG92ZXIgYSBwYW5lIGl0ZW1cIiwgLT5cbiAgICAgIGl0IFwiZHJhd3MgYW4gb3ZlcmxheSBvdmVyIHRoZSBpdGVtXCIsIC0+XG4gICAgICAgIGV4cGVjdCh0YWJCYXIuZ2V0VGFicygpLm1hcCAodGFiKSAtPiB0YWIuZWxlbWVudC50ZXh0Q29udGVudCkudG9FcXVhbCBbXCJJdGVtIDFcIiwgXCJzYW1wbGUuanNcIiwgXCJJdGVtIDJcIl1cbiAgICAgICAgdGFiID0gdGFiQmFyLnRhYkF0SW5kZXgoMikuZWxlbWVudFxuICAgICAgICBsYXlvdXQudGVzdCA9XG4gICAgICAgICAgcGFuZTogcGFuZVxuICAgICAgICAgIGl0ZW1WaWV3OiBwYW5lLmdldEVsZW1lbnQoKS5xdWVyeVNlbGVjdG9yKCcuaXRlbS12aWV3cycpXG4gICAgICAgICAgcmVjdDoge3RvcDogMCwgbGVmdDogMCwgd2lkdGg6IDEwMCwgaGVpZ2h0OiAxMDB9XG5cbiAgICAgICAgZXhwZWN0KGxheW91dC52aWV3LmNsYXNzTGlzdC5jb250YWlucygndmlzaWJsZScpKS50b0JlKGZhbHNlKVxuICAgICAgICAjIERyYWcgaW50byBwYW5lXG4gICAgICAgIHRhYi5vbmRyYWcgdGFyZ2V0OiB0YWIsIGNsaWVudFg6IDUwLCBjbGllbnRZOiA1MFxuICAgICAgICBleHBlY3QobGF5b3V0LnZpZXcuY2xhc3NMaXN0LmNvbnRhaW5zKCd2aXNpYmxlJykpLnRvQmUodHJ1ZSlcbiAgICAgICAgZXhwZWN0KGxheW91dC52aWV3LnN0eWxlLmhlaWdodCkudG9CZShcIjEwMHB4XCIpXG4gICAgICAgIGV4cGVjdChsYXlvdXQudmlldy5zdHlsZS53aWR0aCkudG9CZShcIjEwMHB4XCIpXG4gICAgICAgICMgRHJhZyBvdXQgb2YgcGFuZVxuICAgICAgICBkZWxldGUgbGF5b3V0LnRlc3QucGFuZVxuICAgICAgICB0YWIub25kcmFnIHRhcmdldDogdGFiLCBjbGllbnRYOiAyMDAsIGNsaWVudFk6IDIwMFxuICAgICAgICBleHBlY3QobGF5b3V0LnZpZXcuY2xhc3NMaXN0LmNvbnRhaW5zKCd2aXNpYmxlJykpLnRvQmUoZmFsc2UpXG5cbiAgICAgIGl0IFwiY2xlYXZlcyB0aGUgcGFuZSBpbiB0d2FpblwiLCAtPlxuICAgICAgICBleHBlY3QodGFiQmFyLmdldFRhYnMoKS5tYXAgKHRhYikgLT4gdGFiLmVsZW1lbnQudGV4dENvbnRlbnQpLnRvRXF1YWwgW1wiSXRlbSAxXCIsIFwic2FtcGxlLmpzXCIsIFwiSXRlbSAyXCJdXG4gICAgICAgIHRhYiA9IHRhYkJhci50YWJBdEluZGV4KDIpLmVsZW1lbnRcbiAgICAgICAgbGF5b3V0LnRlc3QgPVxuICAgICAgICAgIHBhbmU6IHBhbmVcbiAgICAgICAgICBpdGVtVmlldzogcGFuZS5nZXRFbGVtZW50KCkucXVlcnlTZWxlY3RvcignLml0ZW0tdmlld3MnKVxuICAgICAgICAgIHJlY3Q6IHt0b3A6IDAsIGxlZnQ6IDAsIHdpZHRoOiAxMDAsIGhlaWdodDogMTAwfVxuXG4gICAgICAgIHRhYi5vbmRyYWcgdGFyZ2V0OiB0YWIsIGNsaWVudFg6IDgwLCBjbGllbnRZOiA1MFxuICAgICAgICB0YWIub25kcmFnZW5kIHRhcmdldDogdGFiLCBjbGllbnRYOiA4MCwgY2xpZW50WTogNTBcbiAgICAgICAgZXhwZWN0KGdldENlbnRlcigpLmdldFBhbmVzKCkubGVuZ3RoKS50b0VxdWFsKDIpXG4gICAgICAgIGV4cGVjdCh0YWJCYXIuZ2V0VGFicygpLm1hcCAodGFiKSAtPiB0YWIuZWxlbWVudC50ZXh0Q29udGVudCkudG9FcXVhbCBbXCJJdGVtIDFcIiwgXCJzYW1wbGUuanNcIl1cbiAgICAgICAgZXhwZWN0KGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKS5nZXRJdGVtcygpLmxlbmd0aCkudG9FcXVhbCgxKVxuXG4gICAgICBkZXNjcmliZSBcIndoZW4gdGhlIGRyYWdnZWQgdGFiIGlzIHRoZSBvbmx5IG9uZSBpbiB0aGUgcGFuZVwiLCAtPlxuICAgICAgICBpdCBcImRvZXMgbm90aGluZ1wiLCAtPlxuICAgICAgICAgIHRhYkJhci5nZXRUYWJzKClbMF0uZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuY2xvc2UtaWNvbicpLmNsaWNrKClcbiAgICAgICAgICB0YWJCYXIuZ2V0VGFicygpWzFdLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLmNsb3NlLWljb24nKS5jbGljaygpXG4gICAgICAgICAgZXhwZWN0KHRhYkJhci5nZXRUYWJzKCkubWFwICh0YWIpIC0+IHRhYi5lbGVtZW50LnRleHRDb250ZW50KS50b0VxdWFsIFtcInNhbXBsZS5qc1wiXVxuICAgICAgICAgIHRhYiA9IHRhYkJhci50YWJBdEluZGV4KDApLmVsZW1lbnRcbiAgICAgICAgICBsYXlvdXQudGVzdCA9XG4gICAgICAgICAgICBwYW5lOiBwYW5lXG4gICAgICAgICAgICBpdGVtVmlldzogcGFuZS5nZXRFbGVtZW50KCkucXVlcnlTZWxlY3RvcignLml0ZW0tdmlld3MnKVxuICAgICAgICAgICAgcmVjdDoge3RvcDogMCwgbGVmdDogMCwgd2lkdGg6IDEwMCwgaGVpZ2h0OiAxMDB9XG5cbiAgICAgICAgICB0YWIub25kcmFnIHRhcmdldDogdGFiLCBjbGllbnRYOiA4MCwgY2xpZW50WTogNTBcbiAgICAgICAgICB0YWIub25kcmFnZW5kIHRhcmdldDogdGFiLCBjbGllbnRYOiA4MCwgY2xpZW50WTogNTBcbiAgICAgICAgICBleHBlY3QoZ2V0Q2VudGVyKCkuZ2V0UGFuZXMoKS5sZW5ndGgpLnRvRXF1YWwoMSlcbiAgICAgICAgICBleHBlY3QodGFiQmFyLmdldFRhYnMoKS5tYXAgKHRhYikgLT4gdGFiLmVsZW1lbnQudGV4dENvbnRlbnQpLnRvRXF1YWwgW1wic2FtcGxlLmpzXCJdXG5cbiAgICAgIGRlc2NyaWJlIFwid2hlbiB0aGUgcGFuZSBpcyBlbXB0eVwiLCAtPlxuICAgICAgICBpdCBcIm1vdmVzIHRoZSB0YWIgdG8gdGhlIHRhcmdldCBwYW5lXCIsIC0+XG4gICAgICAgICAgdG9QYW5lID0gcGFuZS5zcGxpdERvd24oKVxuICAgICAgICAgIGV4cGVjdCh0YWJCYXIuZ2V0VGFicygpLm1hcCAodGFiKSAtPiB0YWIuZWxlbWVudC50ZXh0Q29udGVudCkudG9FcXVhbCBbXCJJdGVtIDFcIiwgXCJzYW1wbGUuanNcIiwgXCJJdGVtIDJcIl1cbiAgICAgICAgICBleHBlY3QodG9QYW5lLmdldEl0ZW1zKCkubGVuZ3RoKS50b0JlKDApXG4gICAgICAgICAgdGFiID0gdGFiQmFyLnRhYkF0SW5kZXgoMikuZWxlbWVudFxuICAgICAgICAgIGxheW91dC50ZXN0ID1cbiAgICAgICAgICAgIHBhbmU6IHRvUGFuZVxuICAgICAgICAgICAgaXRlbVZpZXc6IHRvUGFuZS5nZXRFbGVtZW50KCkucXVlcnlTZWxlY3RvcignLml0ZW0tdmlld3MnKVxuICAgICAgICAgICAgcmVjdDoge3RvcDogMCwgbGVmdDogMCwgd2lkdGg6IDEwMCwgaGVpZ2h0OiAxMDB9XG5cbiAgICAgICAgICB0YWIub25kcmFnIHRhcmdldDogdGFiLCBjbGllbnRYOiA4MCwgY2xpZW50WTogNTBcbiAgICAgICAgICB0YWIub25kcmFnZW5kIHRhcmdldDogdGFiLCBjbGllbnRYOiA4MCwgY2xpZW50WTogNTBcbiAgICAgICAgICBleHBlY3QoZ2V0Q2VudGVyKCkuZ2V0UGFuZXMoKS5sZW5ndGgpLnRvRXF1YWwoMilcbiAgICAgICAgICBleHBlY3QodGFiQmFyLmdldFRhYnMoKS5tYXAgKHRhYikgLT4gdGFiLmVsZW1lbnQudGV4dENvbnRlbnQpLnRvRXF1YWwgW1wiSXRlbSAxXCIsIFwic2FtcGxlLmpzXCJdXG4gICAgICAgICAgZXhwZWN0KGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKS5nZXRJdGVtcygpLmxlbmd0aCkudG9FcXVhbCgxKVxuXG4gICAgZGVzY3JpYmUgXCJ3aGVuIGEgbm9uLXRhYiBpcyBkcmFnZ2VkIHRvIHBhbmVcIiwgLT5cbiAgICAgIGl0IFwiaGFzIG5vIGVmZmVjdFwiLCAtPlxuICAgICAgICBleHBlY3QodGFiQmFyLmdldFRhYnMoKS5tYXAgKHRhYikgLT4gdGFiLmVsZW1lbnQudGV4dENvbnRlbnQpLnRvRXF1YWwgW1wiSXRlbSAxXCIsIFwic2FtcGxlLmpzXCIsIFwiSXRlbSAyXCJdXG4gICAgICAgIGV4cGVjdChwYW5lLmdldEl0ZW1zKCkpLnRvRXF1YWwgW2l0ZW0xLCBlZGl0b3IxLCBpdGVtMl1cbiAgICAgICAgZXhwZWN0KHBhbmUuZ2V0QWN0aXZlSXRlbSgpKS50b0JlIGl0ZW0yXG4gICAgICAgIHNweU9uKHBhbmUsICdhY3RpdmF0ZScpXG5cbiAgICAgICAgW2RyYWdTdGFydEV2ZW50LCBkcm9wRXZlbnRdID0gYnVpbGREcmFnRXZlbnRzKHRhYkJhci50YWJBdEluZGV4KDApLmVsZW1lbnQsIHRhYkJhci50YWJBdEluZGV4KDApLmVsZW1lbnQpXG4gICAgICAgIHRhYkJhci5vbkRyb3AoZHJvcEV2ZW50KVxuXG4gICAgICAgIGV4cGVjdCh0YWJCYXIuZ2V0VGFicygpLm1hcCAodGFiKSAtPiB0YWIuZWxlbWVudC50ZXh0Q29udGVudCkudG9FcXVhbCBbXCJJdGVtIDFcIiwgXCJzYW1wbGUuanNcIiwgXCJJdGVtIDJcIl1cbiAgICAgICAgZXhwZWN0KHBhbmUuZ2V0SXRlbXMoKSkudG9FcXVhbCBbaXRlbTEsIGVkaXRvcjEsIGl0ZW0yXVxuICAgICAgICBleHBlY3QocGFuZS5nZXRBY3RpdmVJdGVtKCkpLnRvQmUgaXRlbTJcbiAgICAgICAgZXhwZWN0KHBhbmUuYWN0aXZhdGUpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcblxuICAgIGRlc2NyaWJlIFwid2hlbiBhIHRhYiBpcyBkcmFnZ2VkIG91dCBvZiBhcHBsaWNhdGlvblwiLCAtPlxuICAgICAgaXQgXCJzaG91bGQgY2FycnkgdGhlIGZpbGUncyBpbmZvcm1hdGlvblwiLCAtPlxuICAgICAgICBbZHJhZ1N0YXJ0RXZlbnQsIGRyb3BFdmVudF0gPSBidWlsZERyYWdFdmVudHModGFiQmFyLnRhYkF0SW5kZXgoMSkuZWxlbWVudCwgdGFiQmFyLnRhYkF0SW5kZXgoMSkuZWxlbWVudClcbiAgICAgICAgdGFiQmFyLm9uRHJhZ1N0YXJ0KGRyYWdTdGFydEV2ZW50KVxuXG4gICAgICAgIGV4cGVjdChkcmFnU3RhcnRFdmVudC5kYXRhVHJhbnNmZXIuZ2V0RGF0YShcInRleHQvcGxhaW5cIikpLnRvRXF1YWwgZWRpdG9yMS5nZXRQYXRoKClcbiAgICAgICAgaWYgcHJvY2Vzcy5wbGF0Zm9ybSBpcyAnZGFyd2luJ1xuICAgICAgICAgIGV4cGVjdChkcmFnU3RhcnRFdmVudC5kYXRhVHJhbnNmZXIuZ2V0RGF0YShcInRleHQvdXJpLWxpc3RcIikpLnRvRXF1YWwgXCJmaWxlOi8vI3tlZGl0b3IxLmdldFBhdGgoKX1cIlxuXG4gICAgZGVzY3JpYmUgXCJ3aGVuIGEgdGFiIGlzIGRyYWdnZWQgdG8gYW5vdGhlciBBdG9tIHdpbmRvd1wiLCAtPlxuICAgICAgaXQgXCJjbG9zZXMgdGhlIHRhYiBpbiB0aGUgZmlyc3Qgd2luZG93IGFuZCBvcGVucyB0aGUgdGFiIGluIHRoZSBzZWNvbmQgd2luZG93XCIsIC0+XG4gICAgICAgIFtkcmFnU3RhcnRFdmVudCwgZHJvcEV2ZW50XSA9IGJ1aWxkRHJhZ0V2ZW50cyh0YWJCYXIudGFiQXRJbmRleCgxKS5lbGVtZW50LCB0YWJCYXIudGFiQXRJbmRleCgwKS5lbGVtZW50KVxuICAgICAgICB0YWJCYXIub25EcmFnU3RhcnQoZHJhZ1N0YXJ0RXZlbnQpXG4gICAgICAgIHRhYkJhci5vbkRyb3BPbk90aGVyV2luZG93KHBhbmUuaWQsIDEpXG5cbiAgICAgICAgZXhwZWN0KHBhbmUuZ2V0SXRlbXMoKSkudG9FcXVhbCBbaXRlbTEsIGl0ZW0yXVxuICAgICAgICBleHBlY3QocGFuZS5nZXRBY3RpdmVJdGVtKCkpLnRvQmUgaXRlbTJcblxuICAgICAgICBkcm9wRXZlbnQuZGF0YVRyYW5zZmVyLnNldERhdGEoJ2Zyb20td2luZG93LWlkJywgdGFiQmFyLmdldFdpbmRvd0lkKCkgKyAxKVxuXG4gICAgICAgIHNweU9uKHRhYkJhciwgJ21vdmVJdGVtQmV0d2VlblBhbmVzJykuYW5kQ2FsbFRocm91Z2goKVxuICAgICAgICB0YWJCYXIub25Ecm9wKGRyb3BFdmVudClcblxuICAgICAgICB3YWl0c0ZvciAtPlxuICAgICAgICAgIHRhYkJhci5tb3ZlSXRlbUJldHdlZW5QYW5lcy5jYWxsQ291bnQgPiAwXG5cbiAgICAgICAgcnVucyAtPlxuICAgICAgICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0UGF0aCgpKS50b0JlIGVkaXRvcjEuZ2V0UGF0aCgpXG4gICAgICAgICAgZXhwZWN0KHBhbmUuZ2V0SXRlbXMoKSkudG9FcXVhbCBbaXRlbTEsIGVkaXRvciwgaXRlbTJdXG5cbiAgICAgIGl0IFwidHJhbnNmZXJzIHRoZSB0ZXh0IG9mIHRoZSBlZGl0b3Igd2hlbiBpdCBpcyBtb2RpZmllZFwiLCAtPlxuICAgICAgICBlZGl0b3IxLnNldFRleHQoJ0kgY2FtZSBmcm9tIGFub3RoZXIgd2luZG93JylcbiAgICAgICAgW2RyYWdTdGFydEV2ZW50LCBkcm9wRXZlbnRdID0gYnVpbGREcmFnRXZlbnRzKHRhYkJhci50YWJBdEluZGV4KDEpLmVsZW1lbnQsIHRhYkJhci50YWJBdEluZGV4KDApLmVsZW1lbnQpXG4gICAgICAgIHRhYkJhci5vbkRyYWdTdGFydChkcmFnU3RhcnRFdmVudClcbiAgICAgICAgdGFiQmFyLm9uRHJvcE9uT3RoZXJXaW5kb3cocGFuZS5pZCwgMSlcblxuICAgICAgICBkcm9wRXZlbnQuZGF0YVRyYW5zZmVyLnNldERhdGEoJ2Zyb20td2luZG93LWlkJywgdGFiQmFyLmdldFdpbmRvd0lkKCkgKyAxKVxuXG4gICAgICAgIHNweU9uKHRhYkJhciwgJ21vdmVJdGVtQmV0d2VlblBhbmVzJykuYW5kQ2FsbFRocm91Z2goKVxuICAgICAgICB0YWJCYXIub25Ecm9wKGRyb3BFdmVudClcblxuICAgICAgICB3YWl0c0ZvciAtPlxuICAgICAgICAgIHRhYkJhci5tb3ZlSXRlbUJldHdlZW5QYW5lcy5jYWxsQ291bnQgPiAwXG5cbiAgICAgICAgcnVucyAtPlxuICAgICAgICAgIGV4cGVjdChhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCkuZ2V0VGV4dCgpKS50b0JlICdJIGNhbWUgZnJvbSBhbm90aGVyIHdpbmRvdydcblxuICAgICAgaXQgXCJhbGxvd3MgdW50aXRsZWQgZWRpdG9ycyB0byBiZSBtb3ZlZCBiZXR3ZWVuIHdpbmRvd3NcIiwgLT5cbiAgICAgICAgZWRpdG9yMS5nZXRCdWZmZXIoKS5zZXRQYXRoKG51bGwpXG4gICAgICAgIGVkaXRvcjEuc2V0VGV4dCgnSSBoYXZlIG5vIHBhdGgnKVxuXG4gICAgICAgIFtkcmFnU3RhcnRFdmVudCwgZHJvcEV2ZW50XSA9IGJ1aWxkRHJhZ0V2ZW50cyh0YWJCYXIudGFiQXRJbmRleCgxKS5lbGVtZW50LCB0YWJCYXIudGFiQXRJbmRleCgwKS5lbGVtZW50KVxuICAgICAgICB0YWJCYXIub25EcmFnU3RhcnQoZHJhZ1N0YXJ0RXZlbnQpXG4gICAgICAgIHRhYkJhci5vbkRyb3BPbk90aGVyV2luZG93KHBhbmUuaWQsIDEpXG5cbiAgICAgICAgZHJvcEV2ZW50LmRhdGFUcmFuc2Zlci5zZXREYXRhKCdmcm9tLXdpbmRvdy1pZCcsIHRhYkJhci5nZXRXaW5kb3dJZCgpICsgMSlcblxuICAgICAgICBzcHlPbih0YWJCYXIsICdtb3ZlSXRlbUJldHdlZW5QYW5lcycpLmFuZENhbGxUaHJvdWdoKClcbiAgICAgICAgdGFiQmFyLm9uRHJvcChkcm9wRXZlbnQpXG5cbiAgICAgICAgd2FpdHNGb3IgLT5cbiAgICAgICAgICB0YWJCYXIubW92ZUl0ZW1CZXR3ZWVuUGFuZXMuY2FsbENvdW50ID4gMFxuXG4gICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICBleHBlY3QoYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpLmdldFRleHQoKSkudG9CZSAnSSBoYXZlIG5vIHBhdGgnXG4gICAgICAgICAgZXhwZWN0KGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKS5nZXRQYXRoKCkpLnRvQmVVbmRlZmluZWQoKVxuXG4gICAgaWYgYXRvbS53b3Jrc3BhY2UuZ2V0TGVmdERvY2s/XG4gICAgICBkZXNjcmliZSBcIndoZW4gYSB0YWIgaXMgZHJhZ2dlZCB0byBhbm90aGVyIHBhbmUgY29udGFpbmVyXCIsIC0+XG4gICAgICAgIFtwYW5lMiwgdGFiQmFyMiwgZG9ja0l0ZW1dID0gW11cblxuICAgICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgICAgamFzbWluZS5hdHRhY2hUb0RPTShhdG9tLndvcmtzcGFjZS5nZXRFbGVtZW50KCkpXG4gICAgICAgICAgcGFuZSA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKVxuICAgICAgICAgIHBhbmUyID0gYXRvbS53b3Jrc3BhY2UuZ2V0TGVmdERvY2soKS5nZXRBY3RpdmVQYW5lKClcbiAgICAgICAgICBkb2NrSXRlbSA9IG5ldyBUZXN0VmlldygnRG9jayBJdGVtJylcbiAgICAgICAgICBwYW5lMi5hZGRJdGVtKGRvY2tJdGVtKVxuICAgICAgICAgIHRhYkJhcjIgPSBuZXcgVGFiQmFyVmlldyhwYW5lMiwgJ2xlZnQnKVxuXG4gICAgICAgIGl0IFwicmVtb3ZlcyB0aGUgdGFiIGFuZCBpdGVtIGZyb20gdGhlaXIgb3JpZ2luYWwgcGFuZSBhbmQgbW92ZXMgdGhlbSB0byB0aGUgdGFyZ2V0IHBhbmVcIiwgLT5cbiAgICAgICAgICBleHBlY3QoYXRvbS53b3Jrc3BhY2UuZ2V0TGVmdERvY2soKS5pc1Zpc2libGUoKSkudG9CZShmYWxzZSlcblxuICAgICAgICAgIGV4cGVjdCh0YWJCYXIuZ2V0VGFicygpLm1hcCAodGFiKSAtPiB0YWIuZWxlbWVudC50ZXh0Q29udGVudCkudG9FcXVhbCBbXCJJdGVtIDFcIiwgXCJzYW1wbGUuanNcIiwgXCJJdGVtIDJcIl1cbiAgICAgICAgICBleHBlY3QocGFuZS5nZXRJdGVtcygpKS50b0VxdWFsIFtpdGVtMSwgZWRpdG9yMSwgaXRlbTJdXG4gICAgICAgICAgZXhwZWN0KHBhbmUuZ2V0QWN0aXZlSXRlbSgpKS50b0JlKGl0ZW0yKVxuXG4gICAgICAgICAgZXhwZWN0KHRhYkJhcjIuZ2V0VGFicygpLm1hcCAodGFiKSAtPiB0YWIuZWxlbWVudC50ZXh0Q29udGVudCkudG9FcXVhbCBbXCJEb2NrIEl0ZW1cIl1cbiAgICAgICAgICBleHBlY3QocGFuZTIuZ2V0SXRlbXMoKSkudG9FcXVhbCBbZG9ja0l0ZW1dXG4gICAgICAgICAgZXhwZWN0KHBhbmUyLmdldEFjdGl2ZUl0ZW0oKSkudG9CZShkb2NrSXRlbSlcblxuICAgICAgICAgIFtkcmFnU3RhcnRFdmVudCwgZHJvcEV2ZW50XSA9IGJ1aWxkRHJhZ0V2ZW50cyh0YWJCYXIudGFiQXRJbmRleCgwKS5lbGVtZW50LCB0YWJCYXIyLmVsZW1lbnQpXG4gICAgICAgICAgdGFiQmFyLm9uRHJhZ1N0YXJ0KGRyYWdTdGFydEV2ZW50KVxuICAgICAgICAgIGV4cGVjdCh0YWJCYXIyLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLnBsYWNlaG9sZGVyJykpLnRvQmVOdWxsKClcbiAgICAgICAgICB0YWJCYXIyLm9uRHJhZ092ZXIoZHJvcEV2ZW50KVxuICAgICAgICAgIGV4cGVjdCh0YWJCYXIyLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLnBsYWNlaG9sZGVyJykpLm5vdC50b0JlTnVsbCgpXG4gICAgICAgICAgdGFiQmFyMi5vbkRyb3AoZHJvcEV2ZW50KVxuICAgICAgICAgIGV4cGVjdCh0YWJCYXIyLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLnBsYWNlaG9sZGVyJykpLnRvQmVOdWxsKClcblxuICAgICAgICAgIGV4cGVjdCh0YWJCYXIuZ2V0VGFicygpLm1hcCAodGFiKSAtPiB0YWIuZWxlbWVudC50ZXh0Q29udGVudCkudG9FcXVhbCBbXCJzYW1wbGUuanNcIiwgXCJJdGVtIDJcIl1cbiAgICAgICAgICBleHBlY3QocGFuZS5nZXRJdGVtcygpKS50b0VxdWFsIFtlZGl0b3IxLCBpdGVtMl1cbiAgICAgICAgICBleHBlY3QocGFuZS5nZXRBY3RpdmVJdGVtKCkpLnRvQmUgaXRlbTJcblxuICAgICAgICAgIGV4cGVjdCh0YWJCYXIyLmdldFRhYnMoKS5tYXAgKHRhYikgLT4gdGFiLmVsZW1lbnQudGV4dENvbnRlbnQpLnRvRXF1YWwgW1wiRG9jayBJdGVtXCIsIFwiSXRlbSAxXCJdXG4gICAgICAgICAgZXhwZWN0KHBhbmUyLmdldEl0ZW1zKCkpLnRvRXF1YWwgW2RvY2tJdGVtLCBpdGVtMV1cbiAgICAgICAgICBleHBlY3QocGFuZTIuYWN0aXZlSXRlbSkudG9CZSBpdGVtMVxuICAgICAgICAgIGV4cGVjdChhdG9tLndvcmtzcGFjZS5nZXRMZWZ0RG9jaygpLmlzVmlzaWJsZSgpKS50b0JlKHRydWUpXG5cbiAgICAgICAgaXQgXCJzaG93cyBhIHBsYWNlaG9sZGVyIGFuZCBhbGxvd3MgdGhlIHRhYiBiZSBkcm9wcGVkIG9ubHkgaWYgdGhlIGl0ZW0gc3VwcG9ydHMgdGhlIHRhcmdldCBwYW5lIGNvbnRhaW5lciBsb2NhdGlvblwiLCAtPlxuICAgICAgICAgIGl0ZW0xLmdldEFsbG93ZWRMb2NhdGlvbnMgPSAtPiBbJ2NlbnRlcicsICdib3R0b20nXVxuICAgICAgICAgIFtkcmFnU3RhcnRFdmVudCwgZHJvcEV2ZW50XSA9IGJ1aWxkRHJhZ0V2ZW50cyh0YWJCYXIudGFiQXRJbmRleCgwKS5lbGVtZW50LCB0YWJCYXIyLmVsZW1lbnQpXG4gICAgICAgICAgdGFiQmFyLm9uRHJhZ1N0YXJ0KGRyYWdTdGFydEV2ZW50KVxuICAgICAgICAgIGV4cGVjdCh0YWJCYXIyLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLnBsYWNlaG9sZGVyJykpLnRvQmVOdWxsKClcbiAgICAgICAgICB0YWJCYXIyLm9uRHJhZ092ZXIoZHJvcEV2ZW50KVxuICAgICAgICAgIGV4cGVjdCh0YWJCYXIyLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLnBsYWNlaG9sZGVyJykpLnRvQmVOdWxsKClcbiAgICAgICAgICB0YWJCYXIyLm9uRHJvcChkcm9wRXZlbnQpXG4gICAgICAgICAgZXhwZWN0KHRhYkJhcjIuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcucGxhY2Vob2xkZXInKSkudG9CZU51bGwoKVxuICAgICAgICAgIGV4cGVjdChwYW5lLmdldEl0ZW1zKCkpLnRvRXF1YWwgW2l0ZW0xLCBlZGl0b3IxLCBpdGVtMl1cbiAgICAgICAgICBleHBlY3QocGFuZTIuZ2V0SXRlbXMoKSkudG9FcXVhbCBbZG9ja0l0ZW1dXG5cbiAgICAgICAgICBpdGVtMS5nZXRBbGxvd2VkTG9jYXRpb25zID0gLT4gWydsZWZ0J11cbiAgICAgICAgICBbZHJhZ1N0YXJ0RXZlbnQsIGRyb3BFdmVudF0gPSBidWlsZERyYWdFdmVudHModGFiQmFyLnRhYkF0SW5kZXgoMCkuZWxlbWVudCwgdGFiQmFyMi5lbGVtZW50KVxuICAgICAgICAgIHRhYkJhci5vbkRyYWdTdGFydChkcmFnU3RhcnRFdmVudClcbiAgICAgICAgICBleHBlY3QodGFiQmFyMi5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGFjZWhvbGRlcicpKS50b0JlTnVsbCgpXG4gICAgICAgICAgdGFiQmFyMi5vbkRyYWdPdmVyKGRyb3BFdmVudClcbiAgICAgICAgICBleHBlY3QodGFiQmFyMi5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGFjZWhvbGRlcicpKS5ub3QudG9CZU51bGwoKVxuICAgICAgICAgIHRhYkJhcjIub25Ecm9wKGRyb3BFdmVudClcbiAgICAgICAgICBleHBlY3QodGFiQmFyMi5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGFjZWhvbGRlcicpKS50b0JlTnVsbCgpXG4gICAgICAgICAgZXhwZWN0KHBhbmUuZ2V0SXRlbXMoKSkudG9FcXVhbCBbZWRpdG9yMSwgaXRlbTJdXG4gICAgICAgICAgZXhwZWN0KHBhbmUyLmdldEl0ZW1zKCkpLnRvRXF1YWwgW2RvY2tJdGVtLCBpdGVtMV1cblxuICBkZXNjcmliZSBcIndoZW4gdGhlIHRhYiBiYXIgaXMgZG91YmxlIGNsaWNrZWRcIiwgLT5cbiAgICBpdCBcIm9wZW5zIGEgbmV3IGVtcHR5IGVkaXRvclwiLCAtPlxuICAgICAgbmV3RmlsZUhhbmRsZXIgPSBqYXNtaW5lLmNyZWF0ZVNweSgnbmV3RmlsZUhhbmRsZXInKVxuICAgICAgYXRvbS5jb21tYW5kcy5hZGQodGFiQmFyLmVsZW1lbnQsICdhcHBsaWNhdGlvbjpuZXctZmlsZScsIG5ld0ZpbGVIYW5kbGVyKVxuXG4gICAgICB0cmlnZ2VyTW91c2VFdmVudChcImRibGNsaWNrXCIsIHRhYkJhci5nZXRUYWJzKClbMF0uZWxlbWVudClcbiAgICAgIGV4cGVjdChuZXdGaWxlSGFuZGxlci5jYWxsQ291bnQpLnRvQmUgMFxuXG4gICAgICB0cmlnZ2VyTW91c2VFdmVudChcImRibGNsaWNrXCIsIHRhYkJhci5lbGVtZW50KVxuICAgICAgZXhwZWN0KG5ld0ZpbGVIYW5kbGVyLmNhbGxDb3VudCkudG9CZSAxXG5cbiAgZGVzY3JpYmUgXCJ3aGVuIHRoZSBtb3VzZSB3aGVlbCBpcyB1c2VkIG9uIHRoZSB0YWIgYmFyXCIsIC0+XG4gICAgZGVzY3JpYmUgXCJ3aGVuIHRhYlNjcm9sbGluZyBpcyB0cnVlIGluIHBhY2thZ2Ugc2V0dGluZ3NcIiwgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgYXRvbS5jb25maWcuc2V0KFwidGFicy50YWJTY3JvbGxpbmdcIiwgdHJ1ZSlcbiAgICAgICAgYXRvbS5jb25maWcuc2V0KFwidGFicy50YWJTY3JvbGxpbmdUaHJlc2hvbGRcIiwgMTIwKVxuXG4gICAgICBkZXNjcmliZSBcIndoZW4gdGhlIG1vdXNlIHdoZWVsIHNjcm9sbHMgdXBcIiwgLT5cbiAgICAgICAgaXQgXCJjaGFuZ2VzIHRoZSBhY3RpdmUgdGFiIHRvIHRoZSBwcmV2aW91cyB0YWJcIiwgLT5cbiAgICAgICAgICBleHBlY3QocGFuZS5nZXRBY3RpdmVJdGVtKCkpLnRvQmUgaXRlbTJcbiAgICAgICAgICB0YWJCYXIuZWxlbWVudC5kaXNwYXRjaEV2ZW50KGJ1aWxkV2hlZWxFdmVudCgxMjApKVxuICAgICAgICAgIGV4cGVjdChwYW5lLmdldEFjdGl2ZUl0ZW0oKSkudG9CZSBlZGl0b3IxXG5cbiAgICAgICAgaXQgXCJjaGFuZ2VzIHRoZSBhY3RpdmUgdGFiIHRvIHRoZSBwcmV2aW91cyB0YWIgb25seSBhZnRlciB0aGUgd2hlZWxEZWx0YSBjcm9zc2VzIHRoZSB0aHJlc2hvbGRcIiwgLT5cbiAgICAgICAgICBleHBlY3QocGFuZS5nZXRBY3RpdmVJdGVtKCkpLnRvQmUgaXRlbTJcbiAgICAgICAgICB0YWJCYXIuZWxlbWVudC5kaXNwYXRjaEV2ZW50KGJ1aWxkV2hlZWxFdmVudCg1MCkpXG4gICAgICAgICAgZXhwZWN0KHBhbmUuZ2V0QWN0aXZlSXRlbSgpKS50b0JlIGl0ZW0yXG4gICAgICAgICAgdGFiQmFyLmVsZW1lbnQuZGlzcGF0Y2hFdmVudChidWlsZFdoZWVsRXZlbnQoNTApKVxuICAgICAgICAgIGV4cGVjdChwYW5lLmdldEFjdGl2ZUl0ZW0oKSkudG9CZSBpdGVtMlxuICAgICAgICAgIHRhYkJhci5lbGVtZW50LmRpc3BhdGNoRXZlbnQoYnVpbGRXaGVlbEV2ZW50KDUwKSlcbiAgICAgICAgICBleHBlY3QocGFuZS5nZXRBY3RpdmVJdGVtKCkpLnRvQmUgZWRpdG9yMVxuXG4gICAgICBkZXNjcmliZSBcIndoZW4gdGhlIG1vdXNlIHdoZWVsIHNjcm9sbHMgZG93blwiLCAtPlxuICAgICAgICBpdCBcImNoYW5nZXMgdGhlIGFjdGl2ZSB0YWIgdG8gdGhlIHByZXZpb3VzIHRhYlwiLCAtPlxuICAgICAgICAgIGV4cGVjdChwYW5lLmdldEFjdGl2ZUl0ZW0oKSkudG9CZSBpdGVtMlxuICAgICAgICAgIHRhYkJhci5lbGVtZW50LmRpc3BhdGNoRXZlbnQoYnVpbGRXaGVlbEV2ZW50KC0xMjApKVxuICAgICAgICAgIGV4cGVjdChwYW5lLmdldEFjdGl2ZUl0ZW0oKSkudG9CZSBpdGVtMVxuXG4gICAgICBkZXNjcmliZSBcIndoZW4gdGhlIG1vdXNlIHdoZWVsIHNjcm9sbHMgdXAgYW5kIHNoaWZ0IGtleSBpcyBwcmVzc2VkXCIsIC0+XG4gICAgICAgIGl0IFwiZG9lcyBub3QgY2hhbmdlIHRoZSBhY3RpdmUgdGFiXCIsIC0+XG4gICAgICAgICAgZXhwZWN0KHBhbmUuZ2V0QWN0aXZlSXRlbSgpKS50b0JlIGl0ZW0yXG4gICAgICAgICAgdGFiQmFyLmVsZW1lbnQuZGlzcGF0Y2hFdmVudChidWlsZFdoZWVsUGx1c1NoaWZ0RXZlbnQoMTIwKSlcbiAgICAgICAgICBleHBlY3QocGFuZS5nZXRBY3RpdmVJdGVtKCkpLnRvQmUgaXRlbTJcblxuICAgICAgZGVzY3JpYmUgXCJ3aGVuIHRoZSBtb3VzZSB3aGVlbCBzY3JvbGxzIGRvd24gYW5kIHNoaWZ0IGtleSBpcyBwcmVzc2VkXCIsIC0+XG4gICAgICAgIGl0IFwiZG9lcyBub3QgY2hhbmdlIHRoZSBhY3RpdmUgdGFiXCIsIC0+XG4gICAgICAgICAgZXhwZWN0KHBhbmUuZ2V0QWN0aXZlSXRlbSgpKS50b0JlIGl0ZW0yXG4gICAgICAgICAgdGFiQmFyLmVsZW1lbnQuZGlzcGF0Y2hFdmVudChidWlsZFdoZWVsUGx1c1NoaWZ0RXZlbnQoLTEyMCkpXG4gICAgICAgICAgZXhwZWN0KHBhbmUuZ2V0QWN0aXZlSXRlbSgpKS50b0JlIGl0ZW0yXG5cbiAgICBkZXNjcmliZSBcIndoZW4gdGFiU2Nyb2xsaW5nIGlzIGZhbHNlIGluIHBhY2thZ2Ugc2V0dGluZ3NcIiwgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgYXRvbS5jb25maWcuc2V0KFwidGFicy50YWJTY3JvbGxpbmdcIiwgZmFsc2UpXG5cbiAgICAgIGRlc2NyaWJlIFwid2hlbiB0aGUgbW91c2Ugd2hlZWwgc2Nyb2xscyB1cCBvbmUgdW5pdFwiLCAtPlxuICAgICAgICBpdCBcImRvZXMgbm90IGNoYW5nZSB0aGUgYWN0aXZlIHRhYlwiLCAtPlxuICAgICAgICAgIGV4cGVjdChwYW5lLmdldEFjdGl2ZUl0ZW0oKSkudG9CZSBpdGVtMlxuICAgICAgICAgIHRhYkJhci5lbGVtZW50LmRpc3BhdGNoRXZlbnQoYnVpbGRXaGVlbEV2ZW50KDEyMCkpXG4gICAgICAgICAgZXhwZWN0KHBhbmUuZ2V0QWN0aXZlSXRlbSgpKS50b0JlIGl0ZW0yXG5cbiAgICAgIGRlc2NyaWJlIFwid2hlbiB0aGUgbW91c2Ugd2hlZWwgc2Nyb2xscyBkb3duIG9uZSB1bml0XCIsIC0+XG4gICAgICAgIGl0IFwiZG9lcyBub3QgY2hhbmdlIHRoZSBhY3RpdmUgdGFiXCIsIC0+XG4gICAgICAgICAgZXhwZWN0KHBhbmUuZ2V0QWN0aXZlSXRlbSgpKS50b0JlIGl0ZW0yXG4gICAgICAgICAgdGFiQmFyLmVsZW1lbnQuZGlzcGF0Y2hFdmVudChidWlsZFdoZWVsRXZlbnQoLTEyMCkpXG4gICAgICAgICAgZXhwZWN0KHBhbmUuZ2V0QWN0aXZlSXRlbSgpKS50b0JlIGl0ZW0yXG5cbiAgZGVzY3JpYmUgXCJ3aGVuIGFsd2F5c1Nob3dUYWJCYXIgaXMgdHJ1ZSBpbiBwYWNrYWdlIHNldHRpbmdzXCIsIC0+XG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgYXRvbS5jb25maWcuc2V0KFwidGFicy5hbHdheXNTaG93VGFiQmFyXCIsIHRydWUpXG5cbiAgICBkZXNjcmliZSBcIndoZW4gMiB0YWJzIGFyZSBvcGVuXCIsIC0+XG4gICAgICBpdCBcInNob3dzIHRoZSB0YWIgYmFyXCIsIC0+XG4gICAgICAgIGV4cGVjdChwYW5lLmdldEl0ZW1zKCkubGVuZ3RoKS50b0JlIDNcbiAgICAgICAgZXhwZWN0KHRhYkJhcikubm90LnRvSGF2ZUNsYXNzICdoaWRkZW4nXG5cbiAgICBkZXNjcmliZSBcIndoZW4gMSB0YWIgaXMgb3BlblwiLCAtPlxuICAgICAgaXQgXCJzaG93cyB0aGUgdGFiIGJhclwiLCAtPlxuICAgICAgICBleHBlY3QocGFuZS5nZXRJdGVtcygpLmxlbmd0aCkudG9CZSAzXG4gICAgICAgIHBhbmUuZGVzdHJveUl0ZW0oaXRlbTEpXG4gICAgICAgIHBhbmUuZGVzdHJveUl0ZW0oaXRlbTIpXG4gICAgICAgIGV4cGVjdChwYW5lLmdldEl0ZW1zKCkubGVuZ3RoKS50b0JlIDFcbiAgICAgICAgZXhwZWN0KHRhYkJhcikubm90LnRvSGF2ZUNsYXNzICdoaWRkZW4nXG5cbiAgZGVzY3JpYmUgXCJ3aGVuIGFsd2F5c1Nob3dUYWJCYXIgaXMgZmFsc2UgaW4gcGFja2FnZSBzZXR0aW5nc1wiLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIGF0b20uY29uZmlnLnNldChcInRhYnMuYWx3YXlzU2hvd1RhYkJhclwiLCBmYWxzZSlcblxuICAgIGRlc2NyaWJlIFwid2hlbiAyIHRhYnMgYXJlIG9wZW5cIiwgLT5cbiAgICAgIGl0IFwic2hvd3MgdGhlIHRhYiBiYXJcIiwgLT5cbiAgICAgICAgZXhwZWN0KHBhbmUuZ2V0SXRlbXMoKS5sZW5ndGgpLnRvQmUgM1xuICAgICAgICBleHBlY3QodGFiQmFyKS5ub3QudG9IYXZlQ2xhc3MgJ2hpZGRlbidcblxuICAgIGRlc2NyaWJlIFwid2hlbiAxIHRhYiBpcyBvcGVuXCIsIC0+XG4gICAgICBpdCBcImhpZGVzIHRoZSB0YWIgYmFyXCIsIC0+XG4gICAgICAgIGV4cGVjdChwYW5lLmdldEl0ZW1zKCkubGVuZ3RoKS50b0JlIDNcbiAgICAgICAgcGFuZS5kZXN0cm95SXRlbShpdGVtMSlcbiAgICAgICAgcGFuZS5kZXN0cm95SXRlbShpdGVtMilcbiAgICAgICAgZXhwZWN0KHBhbmUuZ2V0SXRlbXMoKS5sZW5ndGgpLnRvQmUgMVxuICAgICAgICBleHBlY3QodGFiQmFyLmVsZW1lbnQpLnRvSGF2ZUNsYXNzICdoaWRkZW4nXG5cbiAgaWYgYXRvbS53b3Jrc3BhY2UuYnVpbGRUZXh0RWRpdG9yKCkuaXNQZW5kaW5nPyBvciBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKCkuZ2V0QWN0aXZlSXRlbT9cbiAgICBpc1BlbmRpbmcgPSAoaXRlbSkgLT5cbiAgICAgIGlmIGl0ZW0uaXNQZW5kaW5nP1xuICAgICAgICBpdGVtLmlzUGVuZGluZygpXG4gICAgICBlbHNlXG4gICAgICAgIGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKS5nZXRQZW5kaW5nSXRlbSgpIGlzIGl0ZW1cblxuICAgIGRlc2NyaWJlIFwid2hlbiB0YWIncyBwYW5lIGl0ZW0gaXMgcGVuZGluZ1wiLCAtPlxuICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICBwYW5lLmRlc3Ryb3lJdGVtcygpXG5cbiAgICAgIGRlc2NyaWJlIFwid2hlbiBvcGVuaW5nIGEgbmV3IHRhYlwiLCAtPlxuICAgICAgICBpdCBcImFkZHMgdGFiIHdpdGggY2xhc3MgJ3RlbXAnXCIsIC0+XG4gICAgICAgICAgZWRpdG9yMSA9IG51bGxcbiAgICAgICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oJ3NhbXBsZS50eHQnLCBwZW5kaW5nOiB0cnVlKS50aGVuIChvKSAtPiBlZGl0b3IxID0gb1xuXG4gICAgICAgICAgcnVucyAtPlxuICAgICAgICAgICAgcGFuZS5hY3RpdmF0ZUl0ZW0oZWRpdG9yMSlcbiAgICAgICAgICAgIGV4cGVjdCh0YWJCYXIuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudGFiIC50ZW1wJykubGVuZ3RoKS50b0JlIDFcbiAgICAgICAgICAgIGV4cGVjdCh0YWJCYXIuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudGFiJylbMF0ucXVlcnlTZWxlY3RvcignLnRpdGxlJykpLnRvSGF2ZUNsYXNzICd0ZW1wJ1xuXG4gICAgICBkZXNjcmliZSBcIndoZW4gdGFiczprZWVwLXBlbmRpbmctdGFiIGlzIHRyaWdnZXJlZCBvbiB0aGUgcGFuZVwiLCAtPlxuICAgICAgICBpdCBcInRlcm1pbmF0ZXMgcGVuZGluZyBzdGF0ZSBvbiB0aGUgdGFiJ3MgaXRlbVwiLCAtPlxuICAgICAgICAgIGVkaXRvcjEgPSBudWxsXG4gICAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKCdzYW1wbGUudHh0JywgcGVuZGluZzogdHJ1ZSkudGhlbiAobykgLT4gZWRpdG9yMSA9IG9cblxuICAgICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICAgIHBhbmUuYWN0aXZhdGVJdGVtKGVkaXRvcjEpXG4gICAgICAgICAgICBleHBlY3QoaXNQZW5kaW5nKGVkaXRvcjEpKS50b0JlIHRydWVcbiAgICAgICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpLmdldEVsZW1lbnQoKSwgJ3RhYnM6a2VlcC1wZW5kaW5nLXRhYicpXG4gICAgICAgICAgICBleHBlY3QoaXNQZW5kaW5nKGVkaXRvcjEpKS50b0JlIGZhbHNlXG5cbiAgICAgIGRlc2NyaWJlIFwid2hlbiB0aGVyZSBpcyBhIHRlbXAgdGFiIGFscmVhZHlcIiwgLT5cbiAgICAgICAgaXQgXCJpdCB3aWxsIHJlcGxhY2UgYW4gZXhpc3RpbmcgdGVtcG9yYXJ5IHRhYlwiLCAtPlxuICAgICAgICAgIGVkaXRvcjEgPSBudWxsXG4gICAgICAgICAgZWRpdG9yMiA9IG51bGxcblxuICAgICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3Blbignc2FtcGxlLnR4dCcsIHBlbmRpbmc6IHRydWUpLnRoZW4gKG8pIC0+XG4gICAgICAgICAgICAgIGVkaXRvcjEgPSBvXG4gICAgICAgICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oJ3NhbXBsZTIudHh0JywgcGVuZGluZzogdHJ1ZSkudGhlbiAobykgLT5cbiAgICAgICAgICAgICAgICBlZGl0b3IyID0gb1xuXG4gICAgICAgICAgcnVucyAtPlxuICAgICAgICAgICAgZXhwZWN0KGVkaXRvcjEuaXNEZXN0cm95ZWQoKSkudG9CZSB0cnVlXG4gICAgICAgICAgICBleHBlY3QodGFiQmFyLnRhYkZvckl0ZW0oZWRpdG9yMSkpLnRvQmVVbmRlZmluZWQoKVxuICAgICAgICAgICAgZXhwZWN0KHRhYkJhci50YWJGb3JJdGVtKGVkaXRvcjIpLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLnRpdGxlJykpLnRvSGF2ZUNsYXNzICd0ZW1wJ1xuXG4gICAgICAgIGl0IFwibWFrZXMgdGhlIHRhYiBwZXJtYW5lbnQgd2hlbiBkb3VibGUtY2xpY2tpbmcgdGhlIHRhYlwiLCAtPlxuICAgICAgICAgIGVkaXRvcjIgPSBudWxsXG5cbiAgICAgICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oJ3NhbXBsZS50eHQnLCBwZW5kaW5nOiB0cnVlKS50aGVuIChvKSAtPiBlZGl0b3IyID0gb1xuXG4gICAgICAgICAgcnVucyAtPlxuICAgICAgICAgICAgcGFuZS5hY3RpdmF0ZUl0ZW0oZWRpdG9yMilcbiAgICAgICAgICAgIGV4cGVjdCh0YWJCYXIudGFiRm9ySXRlbShlZGl0b3IyKS5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy50aXRsZScpKS50b0hhdmVDbGFzcyAndGVtcCdcbiAgICAgICAgICAgIHRyaWdnZXJNb3VzZUV2ZW50KCdkYmxjbGljaycsIHRhYkJhci50YWJGb3JJdGVtKGVkaXRvcjIpLmVsZW1lbnQsIHdoaWNoOiAxKVxuICAgICAgICAgICAgZXhwZWN0KHRhYkJhci50YWJGb3JJdGVtKGVkaXRvcjIpLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLnRpdGxlJykpLm5vdC50b0hhdmVDbGFzcyAndGVtcCdcblxuICAgICAgZGVzY3JpYmUgXCJ3aGVuIGVkaXRpbmcgYSBmaWxlIGluIHBlbmRpbmcgc3RhdGVcIiwgLT5cbiAgICAgICAgaXQgXCJtYWtlcyB0aGUgaXRlbSBhbmQgdGFiIHBlcm1hbmVudFwiLCAtPlxuICAgICAgICAgIGVkaXRvcjEgPSBudWxsXG4gICAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKCdzYW1wbGUudHh0JywgcGVuZGluZzogdHJ1ZSkudGhlbiAobykgLT5cbiAgICAgICAgICAgICAgZWRpdG9yMSA9IG9cbiAgICAgICAgICAgICAgcGFuZS5hY3RpdmF0ZUl0ZW0oZWRpdG9yMSlcbiAgICAgICAgICAgICAgZWRpdG9yMS5pbnNlcnRUZXh0KCd4JylcbiAgICAgICAgICAgICAgYWR2YW5jZUNsb2NrKGVkaXRvcjEuYnVmZmVyLnN0b3BwZWRDaGFuZ2luZ0RlbGF5KVxuXG4gICAgICAgICAgcnVucyAtPlxuICAgICAgICAgICAgZXhwZWN0KHRhYkJhci50YWJGb3JJdGVtKGVkaXRvcjEpLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLnRpdGxlJykpLm5vdC50b0hhdmVDbGFzcyAndGVtcCdcblxuICAgICAgZGVzY3JpYmUgXCJ3aGVuIHNhdmluZyBhIGZpbGVcIiwgLT5cbiAgICAgICAgaXQgXCJtYWtlcyB0aGUgdGFiIHBlcm1hbmVudFwiLCAtPlxuICAgICAgICAgIGVkaXRvcjEgPSBudWxsXG4gICAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKHBhdGguam9pbih0ZW1wLm1rZGlyU3luYygndGFicy0nKSwgJ3NhbXBsZS50eHQnKSwgcGVuZGluZzogdHJ1ZSkudGhlbiAobykgLT5cbiAgICAgICAgICAgICAgZWRpdG9yMSA9IG9cbiAgICAgICAgICAgICAgcGFuZS5hY3RpdmF0ZUl0ZW0oZWRpdG9yMSlcbiAgICAgICAgICAgICAgZWRpdG9yMS5zYXZlKClcblxuICAgICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICAgIGV4cGVjdCh0YWJCYXIudGFiRm9ySXRlbShlZGl0b3IxKS5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy50aXRsZScpKS5ub3QudG9IYXZlQ2xhc3MgJ3RlbXAnXG5cbiAgICAgIGRlc2NyaWJlIFwid2hlbiBzcGxpdHRpbmcgYSBwZW5kaW5nIHRhYlwiLCAtPlxuICAgICAgICBlZGl0b3IxID0gbnVsbFxuICAgICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKCdzYW1wbGUudHh0JywgcGVuZGluZzogdHJ1ZSkudGhlbiAobykgLT4gZWRpdG9yMSA9IG9cblxuICAgICAgICBpdCBcIm1ha2VzIHRoZSB0YWIgcGVybWFuZW50IGluIHRoZSBuZXcgcGFuZVwiLCAtPlxuICAgICAgICAgIHBhbmUuYWN0aXZhdGVJdGVtKGVkaXRvcjEpXG4gICAgICAgICAgcGFuZTIgPSBwYW5lLnNwbGl0UmlnaHQoY29weUFjdGl2ZUl0ZW06IHRydWUpXG4gICAgICAgICAgdGFiQmFyMiA9IG5ldyBUYWJCYXJWaWV3KHBhbmUyLCAnY2VudGVyJylcbiAgICAgICAgICBuZXdFZGl0b3IgPSBwYW5lMi5nZXRBY3RpdmVJdGVtKClcbiAgICAgICAgICBleHBlY3QoaXNQZW5kaW5nKG5ld0VkaXRvcikpLnRvQmUgZmFsc2VcbiAgICAgICAgICBleHBlY3QodGFiQmFyMi50YWJGb3JJdGVtKG5ld0VkaXRvcikuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcudGl0bGUnKSkubm90LnRvSGF2ZUNsYXNzICd0ZW1wJ1xuXG4gICAgICAgIGl0IFwia2VlcHMgdGhlIHBlbmRpbmcgdGFiIGluIHRoZSBvbGQgcGFuZVwiLCAtPlxuICAgICAgICAgIGV4cGVjdChpc1BlbmRpbmcoZWRpdG9yMSkpLnRvQmUgdHJ1ZVxuICAgICAgICAgIGV4cGVjdCh0YWJCYXIudGFiRm9ySXRlbShlZGl0b3IxKS5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy50aXRsZScpKS50b0hhdmVDbGFzcyAndGVtcCdcblxuICAgICAgZGVzY3JpYmUgXCJ3aGVuIGRyYWdnaW5nIGEgcGVuZGluZyB0YWIgdG8gYSBkaWZmZXJlbnQgcGFuZVwiLCAtPlxuICAgICAgICBpdCBcIm1ha2VzIHRoZSB0YWIgcGVybWFuZW50IGluIHRoZSBvdGhlciBwYW5lXCIsIC0+XG4gICAgICAgICAgZWRpdG9yMSA9IG51bGxcbiAgICAgICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oJ3NhbXBsZS50eHQnLCBwZW5kaW5nOiB0cnVlKS50aGVuIChvKSAtPiBlZGl0b3IxID0gb1xuXG4gICAgICAgICAgcnVucyAtPlxuICAgICAgICAgICAgcGFuZS5hY3RpdmF0ZUl0ZW0oZWRpdG9yMSlcbiAgICAgICAgICAgIHBhbmUyID0gcGFuZS5zcGxpdFJpZ2h0KClcblxuICAgICAgICAgICAgdGFiQmFyMiA9IG5ldyBUYWJCYXJWaWV3KHBhbmUyLCAnY2VudGVyJylcbiAgICAgICAgICAgIHRhYkJhcjIubW92ZUl0ZW1CZXR3ZWVuUGFuZXMocGFuZSwgMCwgcGFuZTIsIDEsIGVkaXRvcjEpXG5cbiAgICAgICAgICAgIGV4cGVjdCh0YWJCYXIyLnRhYkZvckl0ZW0ocGFuZTIuZ2V0QWN0aXZlSXRlbSgpKS5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy50aXRsZScpKS5ub3QudG9IYXZlQ2xhc3MgJ3RlbXAnXG5cbiAgZGVzY3JpYmUgXCJpbnRlZ3JhdGlvbiB3aXRoIHZlcnNpb24gY29udHJvbCBzeXN0ZW1zXCIsIC0+XG4gICAgW3JlcG9zaXRvcnksIHRhYiwgdGFiMV0gPSBbXVxuXG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgdGFiID0gdGFiQmFyLnRhYkZvckl0ZW0oZWRpdG9yMSlcbiAgICAgIHNweU9uKHRhYiwgJ3NldHVwVmNzU3RhdHVzJykuYW5kQ2FsbFRocm91Z2goKVxuICAgICAgc3B5T24odGFiLCAndXBkYXRlVmNzU3RhdHVzJykuYW5kQ2FsbFRocm91Z2goKVxuXG4gICAgICB0YWIxID0gdGFiQmFyLnRhYkZvckl0ZW0oaXRlbTEpXG4gICAgICB0YWIxLnBhdGggPSAnL3NvbWUvcGF0aC9vdXRzaWRlL3RoZS9yZXBvc2l0b3J5J1xuICAgICAgc3B5T24odGFiMSwgJ3VwZGF0ZVZjc1N0YXR1cycpLmFuZENhbGxUaHJvdWdoKClcblxuICAgICAgIyBNb2NrIHRoZSByZXBvc2l0b3J5XG4gICAgICByZXBvc2l0b3J5ID0gamFzbWluZS5jcmVhdGVTcHlPYmogJ3JlcG8nLCBbJ2lzUGF0aElnbm9yZWQnLCAnZ2V0Q2FjaGVkUGF0aFN0YXR1cycsICdpc1N0YXR1c05ldycsICdpc1N0YXR1c01vZGlmaWVkJ11cbiAgICAgIHJlcG9zaXRvcnkuaXNTdGF0dXNOZXcuYW5kQ2FsbEZha2UgKHN0YXR1cykgLT4gc3RhdHVzIGlzICduZXcnXG4gICAgICByZXBvc2l0b3J5LmlzU3RhdHVzTW9kaWZpZWQuYW5kQ2FsbEZha2UgKHN0YXR1cykgLT4gc3RhdHVzIGlzICdtb2RpZmllZCdcblxuICAgICAgcmVwb3NpdG9yeS5vbkRpZENoYW5nZVN0YXR1cyA9IChjYWxsYmFjaykgLT5cbiAgICAgICAgQGNoYW5nZVN0YXR1c0NhbGxiYWNrcyA/PSBbXVxuICAgICAgICBAY2hhbmdlU3RhdHVzQ2FsbGJhY2tzLnB1c2goY2FsbGJhY2spXG4gICAgICAgIGRpc3Bvc2U6ID0+IF8ucmVtb3ZlKEBjaGFuZ2VTdGF0dXNDYWxsYmFja3MsIGNhbGxiYWNrKVxuICAgICAgcmVwb3NpdG9yeS5lbWl0RGlkQ2hhbmdlU3RhdHVzID0gKGV2ZW50KSAtPlxuICAgICAgICBjYWxsYmFjayhldmVudCkgZm9yIGNhbGxiYWNrIGluIEBjaGFuZ2VTdGF0dXNDYWxsYmFja3MgPyBbXVxuXG4gICAgICByZXBvc2l0b3J5Lm9uRGlkQ2hhbmdlU3RhdHVzZXMgPSAoY2FsbGJhY2spIC0+XG4gICAgICAgIEBjaGFuZ2VTdGF0dXNlc0NhbGxiYWNrcyA/PSBbXVxuICAgICAgICBAY2hhbmdlU3RhdHVzZXNDYWxsYmFja3MucHVzaChjYWxsYmFjaylcbiAgICAgICAgZGlzcG9zZTogPT4gXy5yZW1vdmUoQGNoYW5nZVN0YXR1c2VzQ2FsbGJhY2tzLCBjYWxsYmFjaylcbiAgICAgIHJlcG9zaXRvcnkuZW1pdERpZENoYW5nZVN0YXR1c2VzID0gKGV2ZW50KSAtPlxuICAgICAgICBjYWxsYmFjayhldmVudCkgZm9yIGNhbGxiYWNrIGluIEBjaGFuZ2VTdGF0dXNlc0NhbGxiYWNrcyA/IFtdXG5cbiAgICAgICMgTW9jayBhdG9tLnByb2plY3QgdG8gcHJldGVuZCB3ZSBhcmUgd29ya2luZyB3aXRoaW4gYSByZXBvc2l0b3J5XG4gICAgICBzcHlPbihhdG9tLnByb2plY3QsICdyZXBvc2l0b3J5Rm9yRGlyZWN0b3J5JykuYW5kUmV0dXJuIFByb21pc2UucmVzb2x2ZShyZXBvc2l0b3J5KVxuXG4gICAgICBhdG9tLmNvbmZpZy5zZXQgXCJ0YWJzLmVuYWJsZVZjc0NvbG9yaW5nXCIsIHRydWVcblxuICAgICAgd2FpdHNGb3IgLT5cbiAgICAgICAgcmVwb3NpdG9yeS5jaGFuZ2VTdGF0dXNDYWxsYmFja3M/Lmxlbmd0aCA+IDBcblxuICAgIGRlc2NyaWJlIFwid2hlbiB3b3JraW5nIGluc2lkZSBhIFZDUyByZXBvc2l0b3J5XCIsIC0+XG4gICAgICBpdCBcImFkZHMgY3VzdG9tIHN0eWxlIGZvciBuZXcgaXRlbXNcIiwgLT5cbiAgICAgICAgcmVwb3NpdG9yeS5nZXRDYWNoZWRQYXRoU3RhdHVzLmFuZFJldHVybiAnbmV3J1xuICAgICAgICB0YWIudXBkYXRlVmNzU3RhdHVzKHJlcG9zaXRvcnkpXG4gICAgICAgIGV4cGVjdCh0YWJCYXIuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudGFiJylbMV0ucXVlcnlTZWxlY3RvcignLnRpdGxlJykpLnRvSGF2ZUNsYXNzIFwic3RhdHVzLWFkZGVkXCJcblxuICAgICAgaXQgXCJhZGRzIGN1c3RvbSBzdHlsZSBmb3IgbW9kaWZpZWQgaXRlbXNcIiwgLT5cbiAgICAgICAgcmVwb3NpdG9yeS5nZXRDYWNoZWRQYXRoU3RhdHVzLmFuZFJldHVybiAnbW9kaWZpZWQnXG4gICAgICAgIHRhYi51cGRhdGVWY3NTdGF0dXMocmVwb3NpdG9yeSlcbiAgICAgICAgZXhwZWN0KHRhYkJhci5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWInKVsxXS5xdWVyeVNlbGVjdG9yKCcudGl0bGUnKSkudG9IYXZlQ2xhc3MgXCJzdGF0dXMtbW9kaWZpZWRcIlxuXG4gICAgICBpdCBcImFkZHMgY3VzdG9tIHN0eWxlIGZvciBpZ25vcmVkIGl0ZW1zXCIsIC0+XG4gICAgICAgIHJlcG9zaXRvcnkuaXNQYXRoSWdub3JlZC5hbmRSZXR1cm4gdHJ1ZVxuICAgICAgICB0YWIudXBkYXRlVmNzU3RhdHVzKHJlcG9zaXRvcnkpXG4gICAgICAgIGV4cGVjdCh0YWJCYXIuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudGFiJylbMV0ucXVlcnlTZWxlY3RvcignLnRpdGxlJykpLnRvSGF2ZUNsYXNzIFwic3RhdHVzLWlnbm9yZWRcIlxuXG4gICAgICBpdCBcImRvZXMgbm90IGFkZCBhbnkgc3R5bGVzIGZvciBpdGVtcyBub3QgaW4gdGhlIHJlcG9zaXRvcnlcIiwgLT5cbiAgICAgICAgZXhwZWN0KHRhYkJhci5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWInKVswXS5xdWVyeVNlbGVjdG9yKCcudGl0bGUnKSkubm90LnRvSGF2ZUNsYXNzIFwic3RhdHVzLWFkZGVkXCJcbiAgICAgICAgZXhwZWN0KHRhYkJhci5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWInKVswXS5xdWVyeVNlbGVjdG9yKCcudGl0bGUnKSkubm90LnRvSGF2ZUNsYXNzIFwic3RhdHVzLW1vZGlmaWVkXCJcbiAgICAgICAgZXhwZWN0KHRhYkJhci5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWInKVswXS5xdWVyeVNlbGVjdG9yKCcudGl0bGUnKSkubm90LnRvSGF2ZUNsYXNzIFwic3RhdHVzLWlnbm9yZWRcIlxuXG4gICAgZGVzY3JpYmUgXCJ3aGVuIGNoYW5nZXMgaW4gaXRlbSBzdGF0dXNlcyBhcmUgbm90aWZpZWRcIiwgLT5cbiAgICAgIGl0IFwidXBkYXRlcyBzdGF0dXMgZm9yIGl0ZW1zIGluIHRoZSByZXBvc2l0b3J5XCIsIC0+XG4gICAgICAgIHRhYi51cGRhdGVWY3NTdGF0dXMucmVzZXQoKVxuICAgICAgICByZXBvc2l0b3J5LmVtaXREaWRDaGFuZ2VTdGF0dXNlcygpXG4gICAgICAgIGV4cGVjdCh0YWIudXBkYXRlVmNzU3RhdHVzLmNhbGxzLmxlbmd0aCkudG9FcXVhbCAxXG5cbiAgICAgIGl0IFwidXBkYXRlcyB0aGUgc3RhdHVzIG9mIGFuIGl0ZW0gaWYgaXQgaGFzIGNoYW5nZWRcIiwgLT5cbiAgICAgICAgcmVwb3NpdG9yeS5nZXRDYWNoZWRQYXRoU3RhdHVzLnJlc2V0KClcbiAgICAgICAgZXhwZWN0KHRhYkJhci5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWInKVsxXS5xdWVyeVNlbGVjdG9yKCcudGl0bGUnKSkubm90LnRvSGF2ZUNsYXNzIFwic3RhdHVzLW1vZGlmaWVkXCJcbiAgICAgICAgcmVwb3NpdG9yeS5lbWl0RGlkQ2hhbmdlU3RhdHVzIHtwYXRoOiB0YWIucGF0aCwgcGF0aFN0YXR1czogXCJtb2RpZmllZFwifVxuICAgICAgICBleHBlY3QodGFiQmFyLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRhYicpWzFdLnF1ZXJ5U2VsZWN0b3IoJy50aXRsZScpKS50b0hhdmVDbGFzcyBcInN0YXR1cy1tb2RpZmllZFwiXG4gICAgICAgIGV4cGVjdChyZXBvc2l0b3J5LmdldENhY2hlZFBhdGhTdGF0dXMuY2FsbHMubGVuZ3RoKS50b0JlIDBcblxuICAgICAgaXQgXCJkb2VzIG5vdCB1cGRhdGUgc3RhdHVzIGZvciBpdGVtcyBub3QgaW4gdGhlIHJlcG9zaXRvcnlcIiwgLT5cbiAgICAgICAgdGFiMS51cGRhdGVWY3NTdGF0dXMucmVzZXQoKVxuICAgICAgICByZXBvc2l0b3J5LmVtaXREaWRDaGFuZ2VTdGF0dXNlcygpXG4gICAgICAgIGV4cGVjdCh0YWIxLnVwZGF0ZVZjc1N0YXR1cy5jYWxscy5sZW5ndGgpLnRvRXF1YWwgMFxuXG4gICAgZGVzY3JpYmUgXCJ3aGVuIGFuIGl0ZW0gaXMgc2F2ZWRcIiwgLT5cbiAgICAgIGl0IFwiZG9lcyBub3QgdXBkYXRlIFZDUyBzdWJzY3JpcHRpb24gaWYgdGhlIGl0ZW0ncyBwYXRoIHJlbWFpbnMgdGhlIHNhbWVcIiwgLT5cbiAgICAgICAgdGFiLnNldHVwVmNzU3RhdHVzLnJlc2V0KClcbiAgICAgICAgdGFiLml0ZW0uYnVmZmVyLmVtaXR0ZXIuZW1pdCAnZGlkLXNhdmUnLCB7cGF0aDogdGFiLnBhdGh9XG4gICAgICAgIGV4cGVjdCh0YWIuc2V0dXBWY3NTdGF0dXMuY2FsbHMubGVuZ3RoKS50b0JlIDBcblxuICAgICAgaXQgXCJ1cGRhdGVzIFZDUyBzdWJzY3JpcHRpb24gaWYgdGhlIGl0ZW0ncyBwYXRoIGhhcyBjaGFuZ2VkXCIsIC0+XG4gICAgICAgIHRhYi5zZXR1cFZjc1N0YXR1cy5yZXNldCgpXG4gICAgICAgIHRhYi5pdGVtLmJ1ZmZlci5lbWl0dGVyLmVtaXQgJ2RpZC1zYXZlJywge3BhdGg6ICcvc29tZS9vdGhlci9wYXRoJ31cbiAgICAgICAgZXhwZWN0KHRhYi5zZXR1cFZjc1N0YXR1cy5jYWxscy5sZW5ndGgpLnRvQmUgMVxuXG4gICAgZGVzY3JpYmUgXCJ3aGVuIGVuYWJsZVZjc0NvbG9yaW5nIGNoYW5nZXMgaW4gcGFja2FnZSBzZXR0aW5nc1wiLCAtPlxuICAgICAgaXQgXCJyZW1vdmVzIHN0YXR1cyBmcm9tIHRoZSB0YWIgaWYgZW5hYmxlVmNzQ29sb3JpbmcgaXMgc2V0IHRvIGZhbHNlXCIsIC0+XG4gICAgICAgIHJlcG9zaXRvcnkuZW1pdERpZENoYW5nZVN0YXR1cyB7cGF0aDogdGFiLnBhdGgsIHBhdGhTdGF0dXM6ICduZXcnfVxuXG4gICAgICAgIGV4cGVjdCh0YWJCYXIuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudGFiJylbMV0ucXVlcnlTZWxlY3RvcignLnRpdGxlJykpLnRvSGF2ZUNsYXNzIFwic3RhdHVzLWFkZGVkXCJcbiAgICAgICAgYXRvbS5jb25maWcuc2V0IFwidGFicy5lbmFibGVWY3NDb2xvcmluZ1wiLCBmYWxzZVxuICAgICAgICBleHBlY3QodGFiQmFyLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRhYicpWzFdLnF1ZXJ5U2VsZWN0b3IoJy50aXRsZScpKS5ub3QudG9IYXZlQ2xhc3MgXCJzdGF0dXMtYWRkZWRcIlxuXG4gICAgICBpdCBcImFkZHMgc3RhdHVzIHRvIHRoZSB0YWIgaWYgZW5hYmxlVmNzQ29sb3JpbmcgaXMgc2V0IHRvIHRydWVcIiwgLT5cbiAgICAgICAgYXRvbS5jb25maWcuc2V0IFwidGFicy5lbmFibGVWY3NDb2xvcmluZ1wiLCBmYWxzZVxuICAgICAgICByZXBvc2l0b3J5LmdldENhY2hlZFBhdGhTdGF0dXMuYW5kUmV0dXJuICdtb2RpZmllZCdcbiAgICAgICAgZXhwZWN0KHRhYkJhci5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWInKVsxXS5xdWVyeVNlbGVjdG9yKCcudGl0bGUnKSkubm90LnRvSGF2ZUNsYXNzIFwic3RhdHVzLW1vZGlmaWVkXCJcbiAgICAgICAgYXRvbS5jb25maWcuc2V0IFwidGFicy5lbmFibGVWY3NDb2xvcmluZ1wiLCB0cnVlXG5cbiAgICAgICAgd2FpdHNGb3IgLT5cbiAgICAgICAgICByZXBvc2l0b3J5LmNoYW5nZVN0YXR1c0NhbGxiYWNrcz8ubGVuZ3RoID4gMFxuXG4gICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICBleHBlY3QodGFiQmFyLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRhYicpWzFdLnF1ZXJ5U2VsZWN0b3IoJy50aXRsZScpKS50b0hhdmVDbGFzcyBcInN0YXR1cy1tb2RpZmllZFwiXG5cbiAgICBpZiBhdG9tLndvcmtzcGFjZS5nZXRMZWZ0RG9jaz9cbiAgICAgIGRlc2NyaWJlIFwiYSBwYW5lIGluIHRoZSBkb2NrXCIsIC0+XG4gICAgICAgIGJlZm9yZUVhY2ggLT4gbWFpbi5hY3RpdmF0ZSgpXG4gICAgICAgIGFmdGVyRWFjaCAtPiBtYWluLmRlYWN0aXZhdGUoKVxuICAgICAgICBpdCBcImdldHMgZGVjb3JhdGVkIHdpdGggdGFic1wiLCAtPlxuICAgICAgICAgIGRvY2sgPSBhdG9tLndvcmtzcGFjZS5nZXRMZWZ0RG9jaygpXG4gICAgICAgICAgZG9ja0VsZW1lbnQgPSBkb2NrLmdldEVsZW1lbnQoKVxuICAgICAgICAgIGl0ZW0gPSBuZXcgVGVzdFZpZXcoJ0RvY2sgSXRlbSAxJylcbiAgICAgICAgICBleHBlY3QoZG9ja0VsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRhYicpLmxlbmd0aCkudG9CZSgwKVxuICAgICAgICAgIHBhbmUgPSBkb2NrLmdldEFjdGl2ZVBhbmUoKVxuICAgICAgICAgIHBhbmUuYWN0aXZhdGVJdGVtKGl0ZW0pXG4gICAgICAgICAgZXhwZWN0KGRvY2tFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWInKS5sZW5ndGgpLnRvQmUoMSlcbiAgICAgICAgICBwYW5lLmRlc3Ryb3lJdGVtKGl0ZW0pXG4gICAgICAgICAgZXhwZWN0KGRvY2tFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWInKS5sZW5ndGgpLnRvQmUoMClcbiJdfQ==
