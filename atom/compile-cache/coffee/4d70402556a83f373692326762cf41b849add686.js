(function() {
  var TabBarView, _, buildDragEvents, buildWheelEvent, buildWheelPlusShiftEvent, layout, main, path, ref, temp, triggerClickEvent, triggerMouseEvent;

  _ = require('underscore-plus');

  path = require('path');

  temp = require('temp');

  TabBarView = require('../lib/tab-bar-view');

  layout = require('../lib/layout');

  main = require('../lib/main');

  ref = require("./event-helpers"), triggerMouseEvent = ref.triggerMouseEvent, triggerClickEvent = ref.triggerClickEvent, buildDragEvents = ref.buildDragEvents, buildWheelEvent = ref.buildWheelEvent, buildWheelPlusShiftEvent = ref.buildWheelPlusShiftEvent;

  describe("Tabs package main", function() {
    var centerElement;
    centerElement = null;
    beforeEach(function() {
      centerElement = atom.workspace.getCenter().paneContainer.getElement();
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
        waitsForPromise(function() {
          return Promise.resolve(atom.packages.deactivatePackage('tabs'));
        });
        return runs(function() {
          expect(centerElement.querySelectorAll('.pane').length).toBe(2);
          expect(centerElement.querySelectorAll('.pane > .tab-bar').length).toBe(0);
          pane.splitRight();
          expect(centerElement.querySelectorAll('.pane').length).toBe(3);
          return expect(centerElement.querySelectorAll('.pane > .tab-bar').length).toBe(0);
        });
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
        pane.addItem(item1, {
          index: 0
        });
        pane.addItem(item2, {
          index: 2
        });
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
        var click, mousedown, ref2, ref3;
        jasmine.attachToDOM(tabBar.element);
        spyOn(pane, 'activate');
        ref2 = triggerClickEvent(tabBar.tabAtIndex(0).element, {
          which: 1
        }), mousedown = ref2.mousedown, click = ref2.click;
        expect(pane.getActiveItem()).toBe(pane.getItems()[0]);
        expect(mousedown.preventDefault).not.toHaveBeenCalled();
        expect(click.preventDefault).toHaveBeenCalled();
        ref3 = triggerClickEvent(tabBar.tabAtIndex(2).element, {
          which: 1
        }), mousedown = ref3.mousedown, click = ref3.click;
        expect(pane.getActiveItem()).toBe(pane.getItems()[2]);
        expect(mousedown.preventDefault).not.toHaveBeenCalled();
        expect(click.preventDefault).toHaveBeenCalled();
        return expect(pane.activate.callCount).toBe(2);
      });
      it("closes the tab when middle clicked", function() {
        var click;
        jasmine.attachToDOM(tabBar.element);
        click = triggerClickEvent(tabBar.tabForItem(editor1).element, {
          which: 2
        }).click;
        expect(pane.getItems().length).toBe(2);
        expect(pane.getItems().indexOf(editor1)).toBe(-1);
        expect(editor1.destroyed).toBeTruthy();
        expect(tabBar.getTabs().length).toBe(2);
        expect(tabBar.element.textContent).not.toMatch('sample.js');
        return expect(click.preventDefault).toHaveBeenCalled();
      });
      return it("doesn't switch tab when right (or ctrl-left) clicked", function() {
        var mousedown;
        jasmine.attachToDOM(tabBar.element);
        spyOn(pane, 'activate');
        mousedown = triggerClickEvent(tabBar.tabAtIndex(0).element, {
          which: 3
        }).mousedown;
        expect(pane.getActiveItem()).not.toBe(pane.getItems()[0]);
        expect(mousedown.preventDefault).toHaveBeenCalled();
        mousedown = triggerClickEvent(tabBar.tabAtIndex(0).element, {
          which: 1,
          ctrlKey: true
        }).mousedown;
        expect(pane.getActiveItem()).not.toBe(pane.getItems()[0]);
        expect(mousedown.preventDefault).toHaveBeenCalled();
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
          triggerClickEvent(tabBar.tabForItem(item2).element, {
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
          triggerClickEvent(tabBar.tabForItem(item2).element, {
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
          triggerClickEvent(tabBar.tabForItem(editor1).element, {
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
          triggerClickEvent(tabBar.tabForItem(editor1).element, {
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
          triggerClickEvent(tabBar.tabForItem(item2).element, {
            which: 3
          });
          expect(atom.workspace.getCenter().getPanes().length).toBe(1);
          atom.commands.dispatch(tabBar.element, 'tabs:split-up');
          expect(atom.workspace.getCenter().getPanes().length).toBe(2);
          expect(atom.workspace.getCenter().getPanes()[1]).toBe(pane);
          return expect(atom.workspace.getCenter().getPanes()[0].getItems()[0].getTitle()).toBe(item2.getTitle());
        });
      });
      describe("when tabs:split-down is fired", function() {
        return it("splits the selected tab down", function() {
          triggerClickEvent(tabBar.tabForItem(item2).element, {
            which: 3
          });
          expect(atom.workspace.getCenter().getPanes().length).toBe(1);
          atom.commands.dispatch(tabBar.element, 'tabs:split-down');
          expect(atom.workspace.getCenter().getPanes().length).toBe(2);
          expect(atom.workspace.getCenter().getPanes()[0]).toBe(pane);
          return expect(atom.workspace.getCenter().getPanes()[1].getItems()[0].getTitle()).toBe(item2.getTitle());
        });
      });
      describe("when tabs:split-left is fired", function() {
        return it("splits the selected tab to the left", function() {
          triggerClickEvent(tabBar.tabForItem(item2).element, {
            which: 3
          });
          expect(atom.workspace.getCenter().getPanes().length).toBe(1);
          atom.commands.dispatch(tabBar.element, 'tabs:split-left');
          expect(atom.workspace.getCenter().getPanes().length).toBe(2);
          expect(atom.workspace.getCenter().getPanes()[1]).toBe(pane);
          return expect(atom.workspace.getCenter().getPanes()[0].getItems()[0].getTitle()).toBe(item2.getTitle());
        });
      });
      describe("when tabs:split-right is fired", function() {
        return it("splits the selected tab to the right", function() {
          triggerClickEvent(tabBar.tabForItem(item2).element, {
            which: 3
          });
          expect(atom.workspace.getCenter().getPanes().length).toBe(1);
          atom.commands.dispatch(tabBar.element, 'tabs:split-right');
          expect(atom.workspace.getCenter().getPanes().length).toBe(2);
          expect(atom.workspace.getCenter().getPanes()[0]).toBe(pane);
          return expect(atom.workspace.getCenter().getPanes()[1].getItems()[0].getTitle()).toBe(item2.getTitle());
        });
      });
      return describe("when tabs:open-in-new-window is fired", function() {
        describe("by right-clicking on a tab", function() {
          beforeEach(function() {
            triggerClickEvent(tabBar.tabForItem(item1).element, {
              which: 3
            });
            return expect(atom.workspace.getCenter().getPanes().length).toBe(1);
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
          expect(atom.workspace.getCenter().getPanes().length).toEqual(2);
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
            expect(atom.workspace.getCenter().getPanes().length).toEqual(1);
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
            expect(atom.workspace.getCenter().getPanes().length).toEqual(2);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RhYnMvc3BlYy90YWJzLXNwZWMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSOztFQUNKLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFDUCxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsVUFBQSxHQUFhLE9BQUEsQ0FBUSxxQkFBUjs7RUFDYixNQUFBLEdBQVMsT0FBQSxDQUFRLGVBQVI7O0VBQ1QsSUFBQSxHQUFPLE9BQUEsQ0FBUSxhQUFSOztFQUNQLE1BQXFHLE9BQUEsQ0FBUSxpQkFBUixDQUFyRyxFQUFDLHlDQUFELEVBQW9CLHlDQUFwQixFQUF1QyxxQ0FBdkMsRUFBd0QscUNBQXhELEVBQXlFOztFQUV6RSxRQUFBLENBQVMsbUJBQVQsRUFBOEIsU0FBQTtBQUM1QixRQUFBO0lBQUEsYUFBQSxHQUFnQjtJQUVoQixVQUFBLENBQVcsU0FBQTtNQUNULGFBQUEsR0FBZ0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFmLENBQUEsQ0FBMEIsQ0FBQyxhQUFhLENBQUMsVUFBekMsQ0FBQTtNQUVoQixlQUFBLENBQWdCLFNBQUE7ZUFDZCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsV0FBcEI7TUFEYyxDQUFoQjthQUdBLGVBQUEsQ0FBZ0IsU0FBQTtlQUNkLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixNQUE5QjtNQURjLENBQWhCO0lBTlMsQ0FBWDtJQVNBLFFBQUEsQ0FBUyxhQUFULEVBQXdCLFNBQUE7YUFDdEIsRUFBQSxDQUFHLDhDQUFILEVBQW1ELFNBQUE7QUFDakQsWUFBQTtRQUFBLE1BQUEsQ0FBTyxhQUFhLENBQUMsZ0JBQWQsQ0FBK0IsT0FBL0IsQ0FBdUMsQ0FBQyxNQUEvQyxDQUFzRCxDQUFDLElBQXZELENBQTRELENB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cXVpcmUgJ3BhdGgnXG50ZW1wID0gcmVxdWlyZSAndGVtcCdcblRhYkJhclZpZXcgPSByZXF1aXJlICcuLi9saWIvdGFiLWJhci12aWV3J1xubGF5b3V0ID0gcmVxdWlyZSAnLi4vbGliL2xheW91dCdcbm1haW4gPSByZXF1aXJlICcuLi9saWIvbWFpbidcbnt0cmlnZ2VyTW91c2VFdmVudCwgdHJpZ2dlckNsaWNrRXZlbnQsIGJ1aWxkRHJhZ0V2ZW50cywgYnVpbGRXaGVlbEV2ZW50LCBidWlsZFdoZWVsUGx1c1NoaWZ0RXZlbnR9ID0gcmVxdWlyZSBcIi4vZXZlbnQtaGVscGVyc1wiXG5cbmRlc2NyaWJlIFwiVGFicyBwYWNrYWdlIG1haW5cIiwgLT5cbiAgY2VudGVyRWxlbWVudCA9IG51bGxcblxuICBiZWZvcmVFYWNoIC0+XG4gICAgY2VudGVyRWxlbWVudCA9IGF0b20ud29ya3NwYWNlLmdldENlbnRlcigpLnBhbmVDb250YWluZXIuZ2V0RWxlbWVudCgpXG5cbiAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oJ3NhbXBsZS5qcycpXG5cbiAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgIGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKFwidGFic1wiKVxuXG4gIGRlc2NyaWJlIFwiLmFjdGl2YXRlKClcIiwgLT5cbiAgICBpdCBcImFwcGVuZHMgYSB0YWIgYmFyIGFsbCBleGlzdGluZyBhbmQgbmV3IHBhbmVzXCIsIC0+XG4gICAgICBleHBlY3QoY2VudGVyRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucGFuZScpLmxlbmd0aCkudG9CZSAxXG4gICAgICBleHBlY3QoY2VudGVyRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucGFuZSA+IC50YWItYmFyJykubGVuZ3RoKS50b0JlIDFcblxuICAgICAgcGFuZSA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKVxuICAgICAgcGFuZS5zcGxpdFJpZ2h0KClcblxuICAgICAgZXhwZWN0KGNlbnRlckVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnBhbmUnKS5sZW5ndGgpLnRvQmUgMlxuICAgICAgdGFiQmFycyA9IGNlbnRlckVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnBhbmUgPiAudGFiLWJhcicpXG4gICAgICBleHBlY3QodGFiQmFycy5sZW5ndGgpLnRvQmUgMlxuICAgICAgZXhwZWN0KHRhYkJhcnNbMV0uZ2V0QXR0cmlidXRlKCdsb2NhdGlvbicpKS50b0JlKCdjZW50ZXInKVxuXG4gIGRlc2NyaWJlIFwiLmRlYWN0aXZhdGUoKVwiLCAtPlxuICAgIGl0IFwicmVtb3ZlcyBhbGwgdGFiIGJhciB2aWV3cyBhbmQgc3RvcHMgYWRkaW5nIHRoZW0gdG8gbmV3IHBhbmVzXCIsIC0+XG4gICAgICBwYW5lID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpXG4gICAgICBwYW5lLnNwbGl0UmlnaHQoKVxuICAgICAgZXhwZWN0KGNlbnRlckVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnBhbmUnKS5sZW5ndGgpLnRvQmUgMlxuICAgICAgZXhwZWN0KGNlbnRlckVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnBhbmUgPiAudGFiLWJhcicpLmxlbmd0aCkudG9CZSAyXG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICBQcm9taXNlLnJlc29sdmUoYXRvbS5wYWNrYWdlcy5kZWFjdGl2YXRlUGFja2FnZSgndGFicycpKSAjIFdyYXBwZWQgc28gd29ya3Mgd2l0aCBQcm9taXNlICYgbm9uLVByb21pc2UgZGVhY3RpdmF0ZVxuXG4gICAgICBydW5zIC0+XG4gICAgICAgIGV4cGVjdChjZW50ZXJFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5wYW5lJykubGVuZ3RoKS50b0JlIDJcbiAgICAgICAgZXhwZWN0KGNlbnRlckVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnBhbmUgPiAudGFiLWJhcicpLmxlbmd0aCkudG9CZSAwXG5cbiAgICAgICAgcGFuZS5zcGxpdFJpZ2h0KClcbiAgICAgICAgZXhwZWN0KGNlbnRlckVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnBhbmUnKS5sZW5ndGgpLnRvQmUgM1xuICAgICAgICBleHBlY3QoY2VudGVyRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucGFuZSA+IC50YWItYmFyJykubGVuZ3RoKS50b0JlIDBcblxuZGVzY3JpYmUgXCJUYWJCYXJWaWV3XCIsIC0+XG4gIFtkZXNlcmlhbGl6ZXJEaXNwb3NhYmxlLCBpdGVtMSwgaXRlbTIsIGVkaXRvcjEsIHBhbmUsIHRhYkJhcl0gPSBbXVxuXG4gIGNsYXNzIFRlc3RWaWV3XG4gICAgQGRlc2VyaWFsaXplOiAoe3RpdGxlLCBsb25nVGl0bGUsIGljb25OYW1lfSkgLT4gbmV3IFRlc3RWaWV3KHRpdGxlLCBsb25nVGl0bGUsIGljb25OYW1lKVxuICAgIGNvbnN0cnVjdG9yOiAoQHRpdGxlLCBAbG9uZ1RpdGxlLCBAaWNvbk5hbWUsIEBwYXRoVVJJLCBpc1Blcm1hbmVudERvY2tJdGVtKSAtPlxuICAgICAgQF9pc1Blcm1hbmVudERvY2tJdGVtID0gaXNQZXJtYW5lbnREb2NrSXRlbVxuICAgICAgQGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgICAgQGVsZW1lbnQudGV4dENvbnRlbnQgPSBAdGl0bGVcbiAgICAgIGlmIGlzUGVybWFuZW50RG9ja0l0ZW0/XG4gICAgICAgIEBpc1Blcm1hbmVudERvY2tJdGVtID0gLT4gaXNQZXJtYW5lbnREb2NrSXRlbVxuICAgIGdldFRpdGxlOiAtPiBAdGl0bGVcbiAgICBnZXRMb25nVGl0bGU6IC0+IEBsb25nVGl0bGVcbiAgICBnZXRVUkk6IC0+IEBwYXRoVVJJXG4gICAgZ2V0SWNvbk5hbWU6IC0+IEBpY29uTmFtZVxuICAgIHNlcmlhbGl6ZTogLT4ge2Rlc2VyaWFsaXplcjogJ1Rlc3RWaWV3JywgQHRpdGxlLCBAbG9uZ1RpdGxlLCBAaWNvbk5hbWV9XG4gICAgY29weTogLT4gbmV3IFRlc3RWaWV3KEB0aXRsZSwgQGxvbmdUaXRsZSwgQGljb25OYW1lKVxuICAgIG9uRGlkQ2hhbmdlVGl0bGU6IChjYWxsYmFjaykgLT5cbiAgICAgIEB0aXRsZUNhbGxiYWNrcyA/PSBbXVxuICAgICAgQHRpdGxlQ2FsbGJhY2tzLnB1c2goY2FsbGJhY2spXG4gICAgICBkaXNwb3NlOiA9PiBfLnJlbW92ZShAdGl0bGVDYWxsYmFja3MsIGNhbGxiYWNrKVxuICAgIGVtaXRUaXRsZUNoYW5nZWQ6IC0+XG4gICAgICBjYWxsYmFjaygpIGZvciBjYWxsYmFjayBpbiBAdGl0bGVDYWxsYmFja3MgPyBbXVxuICAgIG9uRGlkQ2hhbmdlSWNvbjogKGNhbGxiYWNrKSAtPlxuICAgICAgQGljb25DYWxsYmFja3MgPz0gW11cbiAgICAgIEBpY29uQ2FsbGJhY2tzLnB1c2goY2FsbGJhY2spXG4gICAgICBkaXNwb3NlOiA9PiBfLnJlbW92ZShAaWNvbkNhbGxiYWNrcywgY2FsbGJhY2spXG4gICAgZW1pdEljb25DaGFuZ2VkOiAtPlxuICAgICAgY2FsbGJhY2soKSBmb3IgY2FsbGJhY2sgaW4gQGljb25DYWxsYmFja3MgPyBbXVxuICAgIG9uRGlkQ2hhbmdlTW9kaWZpZWQ6IC0+ICMgdG8gc3VwcHJlc3MgZGVwcmVjYXRpb24gd2FybmluZ1xuICAgICAgZGlzcG9zZTogLT5cblxuICBiZWZvcmVFYWNoIC0+XG4gICAgZGVzZXJpYWxpemVyRGlzcG9zYWJsZSA9IGF0b20uZGVzZXJpYWxpemVycy5hZGQoVGVzdFZpZXcpXG4gICAgaXRlbTEgPSBuZXcgVGVzdFZpZXcoJ0l0ZW0gMScsIHVuZGVmaW5lZCwgXCJzcXVpcnJlbFwiLCBcInNhbXBsZS5qc1wiKVxuICAgIGl0ZW0yID0gbmV3IFRlc3RWaWV3KCdJdGVtIDInKVxuXG4gICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKCdzYW1wbGUuanMnKVxuXG4gICAgcnVucyAtPlxuICAgICAgZWRpdG9yMSA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgICAgcGFuZSA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKVxuICAgICAgcGFuZS5hZGRJdGVtKGl0ZW0xLCBpbmRleDogMClcbiAgICAgIHBhbmUuYWRkSXRlbShpdGVtMiwgaW5kZXg6IDIpXG4gICAgICBwYW5lLmFjdGl2YXRlSXRlbShpdGVtMilcbiAgICAgIHRhYkJhciA9IG5ldyBUYWJCYXJWaWV3KHBhbmUsICdjZW50ZXInKVxuXG4gIGFmdGVyRWFjaCAtPlxuICAgIGRlc2VyaWFsaXplckRpc3Bvc2FibGUuZGlzcG9zZSgpXG5cbiAgZGVzY3JpYmUgXCJ3aGVuIHRoZSBtb3VzZSBpcyBtb3ZlZCBvdmVyIHRoZSB0YWIgYmFyXCIsIC0+XG4gICAgaXQgXCJmaXhlcyB0aGUgd2lkdGggb24gZXZlcnkgdGFiXCIsIC0+XG4gICAgICBqYXNtaW5lLmF0dGFjaFRvRE9NKHRhYkJhci5lbGVtZW50KVxuXG4gICAgICB0cmlnZ2VyTW91c2VFdmVudCgnbW91c2VlbnRlcicsIHRhYkJhci5lbGVtZW50KVxuXG4gICAgICBpbml0aWFsV2lkdGgxID0gdGFiQmFyLnRhYkF0SW5kZXgoMCkuZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aC50b0ZpeGVkKDApXG4gICAgICBpbml0aWFsV2lkdGgyID0gdGFiQmFyLnRhYkF0SW5kZXgoMikuZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aC50b0ZpeGVkKDApXG5cbiAgICAgICMgTWlub3IgT1MgZGlmZmVyZW5jZXMgY2F1c2UgZnJhY3Rpb25hbC1waXhlbCBkaWZmZXJlbmNlcyBzbyBpZ25vcmUgZnJhY3Rpb25hbCBwYXJ0XG4gICAgICBleHBlY3QocGFyc2VGbG9hdCh0YWJCYXIudGFiQXRJbmRleCgwKS5lbGVtZW50LnN0eWxlLm1heFdpZHRoLnJlcGxhY2UoJ3B4JywgJycpKS50b0ZpeGVkKDApKS50b0JlIGluaXRpYWxXaWR0aDFcbiAgICAgIGV4cGVjdChwYXJzZUZsb2F0KHRhYkJhci50YWJBdEluZGV4KDIpLmVsZW1lbnQuc3R5bGUubWF4V2lkdGgucmVwbGFjZSgncHgnLCAnJykpLnRvRml4ZWQoMCkpLnRvQmUgaW5pdGlhbFdpZHRoMlxuXG4gIGRlc2NyaWJlIFwid2hlbiB0aGUgbW91c2UgaXMgbW92ZWQgYXdheSBmcm9tIHRoZSB0YWIgYmFyXCIsIC0+XG4gICAgaXQgXCJyZXNldHMgdGhlIHdpZHRoIG9uIGV2ZXJ5IHRhYlwiLCAtPlxuICAgICAgamFzbWluZS5hdHRhY2hUb0RPTSh0YWJCYXIuZWxlbWVudClcblxuICAgICAgdHJpZ2dlck1vdXNlRXZlbnQoJ21vdXNlZW50ZXInLCB0YWJCYXIuZWxlbWVudClcbiAgICAgIHRyaWdnZXJNb3VzZUV2ZW50KCdtb3VzZWxlYXZlJywgdGFiQmFyLmVsZW1lbnQpXG5cbiAgICAgIGV4cGVjdCh0YWJCYXIudGFiQXRJbmRleCgwKS5lbGVtZW50LnN0eWxlLm1heFdpZHRoKS50b0JlICcnXG4gICAgICBleHBlY3QodGFiQmFyLnRhYkF0SW5kZXgoMSkuZWxlbWVudC5zdHlsZS5tYXhXaWR0aCkudG9CZSAnJ1xuXG4gIGRlc2NyaWJlIFwiLmluaXRpYWxpemUocGFuZSlcIiwgLT5cbiAgICBpdCBcImNyZWF0ZXMgYSB0YWIgZm9yIGVhY2ggaXRlbSBvbiB0aGUgdGFiIGJhcidzIHBhcmVudCBwYW5lXCIsIC0+XG4gICAgICBleHBlY3QocGFuZS5nZXRJdGVtcygpLmxlbmd0aCkudG9CZSAzXG4gICAgICBleHBlY3QodGFiQmFyLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRhYicpLmxlbmd0aCkudG9CZSAzXG5cbiAgICAgIGV4cGVjdCh0YWJCYXIuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudGFiJylbMF0ucXVlcnlTZWxlY3RvcignLnRpdGxlJykudGV4dENvbnRlbnQpLnRvQmUgaXRlbTEuZ2V0VGl0bGUoKVxuICAgICAgZXhwZWN0KHRhYkJhci5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWInKVswXS5xdWVyeVNlbGVjdG9yKCcudGl0bGUnKS5kYXRhc2V0Lm5hbWUpLnRvQmVVbmRlZmluZWQoKVxuICAgICAgZXhwZWN0KHRhYkJhci5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWInKVswXS5xdWVyeVNlbGVjdG9yKCcudGl0bGUnKS5kYXRhc2V0LnBhdGgpLnRvQmVVbmRlZmluZWQoKVxuICAgICAgZXhwZWN0KHRhYkJhci5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWInKVswXS5kYXRhc2V0LnR5cGUpLnRvQmUoJ1Rlc3RWaWV3JylcblxuICAgICAgZXhwZWN0KHRhYkJhci5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWInKVsxXS5xdWVyeVNlbGVjdG9yKCcudGl0bGUnKS50ZXh0Q29udGVudCkudG9CZSBlZGl0b3IxLmdldFRpdGxlKClcbiAgICAgIGV4cGVjdCh0YWJCYXIuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudGFiJylbMV0ucXVlcnlTZWxlY3RvcignLnRpdGxlJykuZGF0YXNldC5uYW1lKS50b0JlKHBhdGguYmFzZW5hbWUoZWRpdG9yMS5nZXRQYXRoKCkpKVxuICAgICAgZXhwZWN0KHRhYkJhci5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWInKVsxXS5xdWVyeVNlbGVjdG9yKCcudGl0bGUnKS5kYXRhc2V0LnBhdGgpLnRvQmUoZWRpdG9yMS5nZXRQYXRoKCkpXG4gICAgICBleHBlY3QodGFiQmFyLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRhYicpWzFdLmRhdGFzZXQudHlwZSkudG9CZSgnVGV4dEVkaXRvcicpXG5cbiAgICAgIGV4cGVjdCh0YWJCYXIuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudGFiJylbMl0ucXVlcnlTZWxlY3RvcignLnRpdGxlJykudGV4dENvbnRlbnQpLnRvQmUgaXRlbTIuZ2V0VGl0bGUoKVxuICAgICAgZXhwZWN0KHRhYkJhci5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWInKVsyXS5xdWVyeVNlbGVjdG9yKCcudGl0bGUnKS5kYXRhc2V0Lm5hbWUpLnRvQmVVbmRlZmluZWQoKVxuICAgICAgZXhwZWN0KHRhYkJhci5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWInKVsyXS5xdWVyeVNlbGVjdG9yKCcudGl0bGUnKS5kYXRhc2V0LnBhdGgpLnRvQmVVbmRlZmluZWQoKVxuICAgICAgZXhwZWN0KHRhYkJhci5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWInKVswXS5kYXRhc2V0LnR5cGUpLnRvQmUoJ1Rlc3RWaWV3JylcblxuICAgIGl0IFwiaGlnaGxpZ2h0cyB0aGUgdGFiIGZvciB0aGUgYWN0aXZlIHBhbmUgaXRlbVwiLCAtPlxuICAgICAgZXhwZWN0KHRhYkJhci5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWInKVsyXSkudG9IYXZlQ2xhc3MgJ2FjdGl2ZSdcblxuICAgIGl0IFwiZW1pdHMgYSB3YXJuaW5nIHdoZW4gOjpvbkRpZC4uLiBmdW5jdGlvbnMgYXJlIG5vdCB2YWxpZCBEaXNwb3NhYmxlc1wiLCAtPlxuICAgICAgY2xhc3MgQmFkVmlld1xuICAgICAgICBjb25zdHJ1Y3RvcjogLT5cbiAgICAgICAgICBAZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgICAgIGdldFRpdGxlOiAtPiBcIkFueXRoaW5nXCJcbiAgICAgICAgb25EaWRDaGFuZ2VUaXRsZTogLT5cbiAgICAgICAgb25EaWRDaGFuZ2VJY29uOiAtPlxuICAgICAgICBvbkRpZENoYW5nZU1vZGlmaWVkOiAtPlxuICAgICAgICBvbkRpZFNhdmU6IC0+XG4gICAgICAgIG9uRGlkQ2hhbmdlUGF0aDogLT5cblxuICAgICAgd2FybmluZ3MgPSBbXVxuICAgICAgc3B5T24oY29uc29sZSwgXCJ3YXJuXCIpLmFuZENhbGxGYWtlIChtZXNzYWdlLCBvYmplY3QpIC0+XG4gICAgICAgIHdhcm5pbmdzLnB1c2goe21lc3NhZ2UsIG9iamVjdH0pXG5cbiAgICAgIGJhZEl0ZW0gPSBuZXcgQmFkVmlldygnSXRlbSAzJylcbiAgICAgIHBhbmUuYWRkSXRlbShiYWRJdGVtKVxuXG4gICAgICBleHBlY3Qod2FybmluZ3NbMF0ubWVzc2FnZSkudG9Db250YWluKFwib25EaWRDaGFuZ2VUaXRsZVwiKVxuICAgICAgZXhwZWN0KHdhcm5pbmdzWzBdLm9iamVjdCkudG9CZShiYWRJdGVtKVxuXG4gICAgICBleHBlY3Qod2FybmluZ3NbMV0ubWVzc2FnZSkudG9Db250YWluKFwib25EaWRDaGFuZ2VQYXRoXCIpXG4gICAgICBleHBlY3Qod2FybmluZ3NbMV0ub2JqZWN0KS50b0JlKGJhZEl0ZW0pXG5cbiAgICAgIGV4cGVjdCh3YXJuaW5nc1syXS5tZXNzYWdlKS50b0NvbnRhaW4oXCJvbkRpZENoYW5nZUljb25cIilcbiAgICAgIGV4cGVjdCh3YXJuaW5nc1syXS5vYmplY3QpLnRvQmUoYmFkSXRlbSlcblxuICAgICAgZXhwZWN0KHdhcm5pbmdzWzNdLm1lc3NhZ2UpLnRvQ29udGFpbihcIm9uRGlkQ2hhbmdlTW9kaWZpZWRcIilcbiAgICAgIGV4cGVjdCh3YXJuaW5nc1szXS5vYmplY3QpLnRvQmUoYmFkSXRlbSlcblxuICAgICAgZXhwZWN0KHdhcm5pbmdzWzRdLm1lc3NhZ2UpLnRvQ29udGFpbihcIm9uRGlkU2F2ZVwiKVxuICAgICAgZXhwZWN0KHdhcm5pbmdzWzRdLm9iamVjdCkudG9CZShiYWRJdGVtKVxuXG4gIGRlc2NyaWJlIFwid2hlbiB0aGUgYWN0aXZlIHBhbmUgaXRlbSBjaGFuZ2VzXCIsIC0+XG4gICAgaXQgXCJoaWdobGlnaHRzIHRoZSB0YWIgZm9yIHRoZSBuZXcgYWN0aXZlIHBhbmUgaXRlbVwiLCAtPlxuICAgICAgcGFuZS5hY3RpdmF0ZUl0ZW0oaXRlbTEpXG4gICAgICBleHBlY3QodGFiQmFyLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmFjdGl2ZScpLmxlbmd0aCkudG9CZSAxXG4gICAgICBleHBlY3QodGFiQmFyLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRhYicpWzBdKS50b0hhdmVDbGFzcyAnYWN0aXZlJ1xuXG4gICAgICBwYW5lLmFjdGl2YXRlSXRlbShpdGVtMilcbiAgICAgIGV4cGVjdCh0YWJCYXIuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYWN0aXZlJykubGVuZ3RoKS50b0JlIDFcbiAgICAgIGV4cGVjdCh0YWJCYXIuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudGFiJylbMl0pLnRvSGF2ZUNsYXNzICdhY3RpdmUnXG5cbiAgZGVzY3JpYmUgXCJ3aGVuIGEgbmV3IGl0ZW0gaXMgYWRkZWQgdG8gdGhlIHBhbmVcIiwgLT5cbiAgICBpdCBcImFkZHMgdGhlICdtb2RpZmllZCcgY2xhc3MgdG8gdGhlIG5ldyB0YWIgaWYgdGhlIGl0ZW0gaXMgaW5pdGlhbGx5IG1vZGlmaWVkXCIsIC0+XG4gICAgICBlZGl0b3IyID0gbnVsbFxuXG4gICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgaWYgYXRvbS53b3Jrc3BhY2UuY3JlYXRlSXRlbUZvclVSST9cbiAgICAgICAgICBhdG9tLndvcmtzcGFjZS5jcmVhdGVJdGVtRm9yVVJJKCdzYW1wbGUudHh0JykudGhlbiAobykgLT4gZWRpdG9yMiA9IG9cbiAgICAgICAgZWxzZVxuICAgICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oJ3NhbXBsZS50eHQnLCB7YWN0aXZhdGVJdGVtOiBmYWxzZX0pLnRoZW4gKG8pIC0+IGVkaXRvcjIgPSBvXG5cbiAgICAgIHJ1bnMgLT5cbiAgICAgICAgZWRpdG9yMi5pbnNlcnRUZXh0KCd4JylcbiAgICAgICAgcGFuZS5hY3RpdmF0ZUl0ZW0oZWRpdG9yMilcbiAgICAgICAgZXhwZWN0KHRhYkJhci50YWJGb3JJdGVtKGVkaXRvcjIpLmVsZW1lbnQpLnRvSGF2ZUNsYXNzICdtb2RpZmllZCdcblxuICAgIGRlc2NyaWJlIFwid2hlbiBhZGROZXdUYWJzQXRFbmQgaXMgc2V0IHRvIHRydWUgaW4gcGFja2FnZSBzZXR0aW5nc1wiLCAtPlxuICAgICAgaXQgXCJhZGRzIGEgdGFiIGZvciB0aGUgbmV3IGl0ZW0gYXQgdGhlIGVuZCBvZiB0aGUgdGFiIGJhclwiLCAtPlxuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoXCJ0YWJzLmFkZE5ld1RhYnNBdEVuZFwiLCB0cnVlKVxuICAgICAgICBpdGVtMyA9IG5ldyBUZXN0VmlldygnSXRlbSAzJylcbiAgICAgICAgcGFuZS5hY3RpdmF0ZUl0ZW0oaXRlbTMpXG4gICAgICAgIGV4cGVjdCh0YWJCYXIuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudGFiJykubGVuZ3RoKS50b0JlIDRcbiAgICAgICAgZXhwZWN0KHRhYkJhci50YWJBdEluZGV4KDMpLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLnRpdGxlJykudGV4dENvbnRlbnQpLnRvTWF0Y2ggJ0l0ZW0gMydcblxuICAgICAgaXQgXCJwdXRzIHRoZSBuZXcgdGFiIGF0IHRoZSBsYXN0IGluZGV4IG9mIHRoZSBwYW5lJ3MgaXRlbXNcIiwgLT5cbiAgICAgICAgYXRvbS5jb25maWcuc2V0KFwidGFicy5hZGROZXdUYWJzQXRFbmRcIiwgdHJ1ZSlcbiAgICAgICAgaXRlbTMgPSBuZXcgVGVzdFZpZXcoJ0l0ZW0gMycpXG4gICAgICAgICMgYWN0aXZhdGUgaXRlbTEgc28gZGVmYXVsdCBpcyB0byBhZGQgaW1tZWRpYXRlbHkgYWZ0ZXJcbiAgICAgICAgcGFuZS5hY3RpdmF0ZUl0ZW0oaXRlbTEpXG4gICAgICAgIHBhbmUuYWN0aXZhdGVJdGVtKGl0ZW0zKVxuICAgICAgICBleHBlY3QocGFuZS5nZXRJdGVtcygpW3BhbmUuZ2V0SXRlbXMoKS5sZW5ndGggLSAxXSkudG9FcXVhbCBpdGVtM1xuXG4gICAgZGVzY3JpYmUgXCJ3aGVuIGFkZE5ld1RhYnNBdEVuZCBpcyBzZXQgdG8gZmFsc2UgaW4gcGFja2FnZSBzZXR0aW5nc1wiLCAtPlxuICAgICAgaXQgXCJhZGRzIGEgdGFiIGZvciB0aGUgbmV3IGl0ZW0gYXQgdGhlIHNhbWUgaW5kZXggYXMgdGhlIGl0ZW0gaW4gdGhlIHBhbmVcIiwgLT5cbiAgICAgICAgYXRvbS5jb25maWcuc2V0KFwidGFicy5hZGROZXdUYWJzQXRFbmRcIiwgZmFsc2UpXG4gICAgICAgIHBhbmUuYWN0aXZhdGVJdGVtKGl0ZW0xKVxuICAgICAgICBpdGVtMyA9IG5ldyBUZXN0VmlldygnSXRlbSAzJylcbiAgICAgICAgcGFuZS5hY3RpdmF0ZUl0ZW0oaXRlbTMpXG4gICAgICAgIGV4cGVjdCh0YWJCYXIuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudGFiJykubGVuZ3RoKS50b0JlIDRcbiAgICAgICAgZXhwZWN0KHRhYkJhci50YWJBdEluZGV4KDEpLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLnRpdGxlJykudGV4dENvbnRlbnQpLnRvTWF0Y2ggJ0l0ZW0gMydcblxuICBkZXNjcmliZSBcIndoZW4gYW4gaXRlbSBpcyByZW1vdmVkIGZyb20gdGhlIHBhbmVcIiwgLT5cbiAgICBpdCBcInJlbW92ZXMgdGhlIGl0ZW0ncyB0YWIgZnJvbSB0aGUgdGFiIGJhclwiLCAtPlxuICAgICAgcGFuZS5kZXN0cm95SXRlbShpdGVtMilcbiAgICAgIGV4cGVjdCh0YWJCYXIuZ2V0VGFicygpLmxlbmd0aCkudG9CZSAyXG4gICAgICBleHBlY3QodGFiQmFyLmVsZW1lbnQudGV4dENvbnRlbnQpLm5vdC50b01hdGNoKCdJdGVtIDInKVxuXG4gICAgaXQgXCJ1cGRhdGVzIHRoZSB0aXRsZXMgb2YgdGhlIHJlbWFpbmluZyB0YWJzXCIsIC0+XG4gICAgICBleHBlY3QodGFiQmFyLnRhYkZvckl0ZW0oaXRlbTIpLmVsZW1lbnQudGV4dENvbnRlbnQpLnRvTWF0Y2ggJ0l0ZW0gMidcbiAgICAgIGl0ZW0yLmxvbmdUaXRsZSA9ICcyJ1xuICAgICAgaXRlbTJhID0gbmV3IFRlc3RWaWV3KCdJdGVtIDInKVxuICAgICAgaXRlbTJhLmxvbmdUaXRsZSA9ICcyYSdcbiAgICAgIHBhbmUuYWN0aXZhdGVJdGVtKGl0ZW0yYSlcbiAgICAgIGV4cGVjdCh0YWJCYXIudGFiRm9ySXRlbShpdGVtMikuZWxlbWVudC50ZXh0Q29udGVudCkudG9NYXRjaCAnMidcbiAgICAgIGV4cGVjdCh0YWJCYXIudGFiRm9ySXRlbShpdGVtMmEpLmVsZW1lbnQudGV4dENvbnRlbnQpLnRvTWF0Y2ggJzJhJ1xuICAgICAgcGFuZS5kZXN0cm95SXRlbShpdGVtMmEpXG4gICAgICBleHBlY3QodGFiQmFyLnRhYkZvckl0ZW0oaXRlbTIpLmVsZW1lbnQudGV4dENvbnRlbnQpLnRvTWF0Y2ggJ0l0ZW0gMidcblxuICBkZXNjcmliZSBcIndoZW4gYSB0YWIgaXMgY2xpY2tlZFwiLCAtPlxuICAgIGl0IFwic2hvd3MgdGhlIGFzc29jaWF0ZWQgaXRlbSBvbiB0aGUgcGFuZSBhbmQgZm9jdXNlcyB0aGUgcGFuZVwiLCAtPlxuICAgICAgamFzbWluZS5hdHRhY2hUb0RPTSh0YWJCYXIuZWxlbWVudCkgIyBSZW1vdmUgYWZ0ZXIgQXRvbSAxLjIuMCBpcyByZWxlYXNlZFxuICAgICAgc3B5T24ocGFuZSwgJ2FjdGl2YXRlJylcblxuICAgICAge21vdXNlZG93biwgY2xpY2t9ID0gdHJpZ2dlckNsaWNrRXZlbnQodGFiQmFyLnRhYkF0SW5kZXgoMCkuZWxlbWVudCwgd2hpY2g6IDEpXG4gICAgICBleHBlY3QocGFuZS5nZXRBY3RpdmVJdGVtKCkpLnRvQmUocGFuZS5nZXRJdGVtcygpWzBdKVxuICAgICAgIyBhbGxvd3MgZHJhZ2dpbmdcbiAgICAgIGV4cGVjdChtb3VzZWRvd24ucHJldmVudERlZmF1bHQpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIGV4cGVjdChjbGljay5wcmV2ZW50RGVmYXVsdCkudG9IYXZlQmVlbkNhbGxlZCgpXG5cbiAgICAgIHttb3VzZWRvd24sIGNsaWNrfSA9IHRyaWdnZXJDbGlja0V2ZW50KHRhYkJhci50YWJBdEluZGV4KDIpLmVsZW1lbnQsIHdoaWNoOiAxKVxuICAgICAgZXhwZWN0KHBhbmUuZ2V0QWN0aXZlSXRlbSgpKS50b0JlKHBhbmUuZ2V0SXRlbXMoKVsyXSlcbiAgICAgICMgYWxsb3dzIGRyYWdnaW5nXG4gICAgICBleHBlY3QobW91c2Vkb3duLnByZXZlbnREZWZhdWx0KS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICBleHBlY3QoY2xpY2sucHJldmVudERlZmF1bHQpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgZXhwZWN0KHBhbmUuYWN0aXZhdGUuY2FsbENvdW50KS50b0JlIDJcblxuICAgIGl0IFwiY2xvc2VzIHRoZSB0YWIgd2hlbiBtaWRkbGUgY2xpY2tlZFwiLCAtPlxuICAgICAgamFzbWluZS5hdHRhY2hUb0RPTSh0YWJCYXIuZWxlbWVudCkgIyBSZW1vdmUgYWZ0ZXIgQXRvbSAxLjIuMCBpcyByZWxlYXNlZFxuXG4gICAgICB7Y2xpY2t9ID0gdHJpZ2dlckNsaWNrRXZlbnQodGFiQmFyLnRhYkZvckl0ZW0oZWRpdG9yMSkuZWxlbWVudCwgd2hpY2g6IDIpXG5cbiAgICAgIGV4cGVjdChwYW5lLmdldEl0ZW1zKCkubGVuZ3RoKS50b0JlIDJcbiAgICAgIGV4cGVjdChwYW5lLmdldEl0ZW1zKCkuaW5kZXhPZihlZGl0b3IxKSkudG9CZSAtMVxuICAgICAgZXhwZWN0KGVkaXRvcjEuZGVzdHJveWVkKS50b0JlVHJ1dGh5KClcbiAgICAgIGV4cGVjdCh0YWJCYXIuZ2V0VGFicygpLmxlbmd0aCkudG9CZSAyXG4gICAgICBleHBlY3QodGFiQmFyLmVsZW1lbnQudGV4dENvbnRlbnQpLm5vdC50b01hdGNoKCdzYW1wbGUuanMnKVxuXG4gICAgICBleHBlY3QoY2xpY2sucHJldmVudERlZmF1bHQpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuXG4gICAgaXQgXCJkb2Vzbid0IHN3aXRjaCB0YWIgd2hlbiByaWdodCAob3IgY3RybC1sZWZ0KSBjbGlja2VkXCIsIC0+XG4gICAgICBqYXNtaW5lLmF0dGFjaFRvRE9NKHRhYkJhci5lbGVtZW50KSAjIFJlbW92ZSBhZnRlciBBdG9tIDEuMi4wIGlzIHJlbGVhc2VkXG5cbiAgICAgIHNweU9uKHBhbmUsICdhY3RpdmF0ZScpXG5cbiAgICAgIHttb3VzZWRvd259ID0gdHJpZ2dlckNsaWNrRXZlbnQodGFiQmFyLnRhYkF0SW5kZXgoMCkuZWxlbWVudCwgd2hpY2g6IDMpXG4gICAgICBleHBlY3QocGFuZS5nZXRBY3RpdmVJdGVtKCkpLm5vdC50b0JlIHBhbmUuZ2V0SXRlbXMoKVswXVxuICAgICAgZXhwZWN0KG1vdXNlZG93bi5wcmV2ZW50RGVmYXVsdCkudG9IYXZlQmVlbkNhbGxlZCgpXG5cbiAgICAgIHttb3VzZWRvd259ID0gdHJpZ2dlckNsaWNrRXZlbnQodGFiQmFyLnRhYkF0SW5kZXgoMCkuZWxlbWVudCwgd2hpY2g6IDEsIGN0cmxLZXk6IHRydWUpXG4gICAgICBleHBlY3QocGFuZS5nZXRBY3RpdmVJdGVtKCkpLm5vdC50b0JlIHBhbmUuZ2V0SXRlbXMoKVswXVxuICAgICAgZXhwZWN0KG1vdXNlZG93bi5wcmV2ZW50RGVmYXVsdCkudG9IYXZlQmVlbkNhbGxlZCgpXG5cbiAgICAgIGV4cGVjdChwYW5lLmFjdGl2YXRlKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG5cbiAgZGVzY3JpYmUgXCJ3aGVuIGEgdGFiJ3MgY2xvc2UgaWNvbiBpcyBjbGlja2VkXCIsIC0+XG4gICAgaXQgXCJkZXN0cm95cyB0aGUgdGFiJ3MgaXRlbSBvbiB0aGUgcGFuZVwiLCAtPlxuICAgICAgamFzbWluZS5hdHRhY2hUb0RPTSh0YWJCYXIuZWxlbWVudCkgIyBSZW1vdmUgYWZ0ZXIgQXRvbSAxLjIuMCBpcyByZWxlYXNlZFxuXG4gICAgICB0YWJCYXIudGFiRm9ySXRlbShlZGl0b3IxKS5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jbG9zZS1pY29uJykuY2xpY2soKVxuICAgICAgZXhwZWN0KHBhbmUuZ2V0SXRlbXMoKS5sZW5ndGgpLnRvQmUgMlxuICAgICAgZXhwZWN0KHBhbmUuZ2V0SXRlbXMoKS5pbmRleE9mKGVkaXRvcjEpKS50b0JlIC0xXG4gICAgICBleHBlY3QoZWRpdG9yMS5kZXN0cm95ZWQpLnRvQmVUcnV0aHkoKVxuICAgICAgZXhwZWN0KHRhYkJhci5nZXRUYWJzKCkubGVuZ3RoKS50b0JlIDJcbiAgICAgIGV4cGVjdCh0YWJCYXIuZWxlbWVudC50ZXh0Q29udGVudCkubm90LnRvTWF0Y2goJ3NhbXBsZS5qcycpXG5cbiAgZGVzY3JpYmUgXCJ3aGVuIGFuIGl0ZW0gaXMgYWN0aXZhdGVkXCIsIC0+XG4gICAgW2l0ZW0zXSA9IFtdXG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgaXRlbTMgPSBuZXcgVGVzdFZpZXcoXCJJdGVtIDNcIilcbiAgICAgIHBhbmUuYWN0aXZhdGVJdGVtKGl0ZW0zKVxuXG4gICAgICAjIFNldCB1cCBzdHlsZXMgc28gdGhlIHRhYiBiYXIgaGFzIGEgc2Nyb2xsYmFyXG4gICAgICB0YWJCYXIuZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ2ZsZXgnXG4gICAgICB0YWJCYXIuZWxlbWVudC5zdHlsZS5vdmVyZmxvd1ggPSAnc2Nyb2xsJ1xuICAgICAgdGFiQmFyLmVsZW1lbnQuc3R5bGUubWFyZ2luID0gJzAnXG5cbiAgICAgIGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgICBjb250YWluZXIuc3R5bGUud2lkdGggPSAnMTUwcHgnXG4gICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQodGFiQmFyLmVsZW1lbnQpXG4gICAgICBqYXNtaW5lLmF0dGFjaFRvRE9NKGNvbnRhaW5lcilcblxuICAgICAgIyBFeHBlY3QgdGhlcmUgdG8gYmUgY29udGVudCB0byBzY3JvbGxcbiAgICAgIGV4cGVjdCh0YWJCYXIuZWxlbWVudC5zY3JvbGxXaWR0aCkudG9CZUdyZWF0ZXJUaGFuIHRhYkJhci5lbGVtZW50LmNsaWVudFdpZHRoXG5cbiAgICBpdCBcImRvZXMgbm90IHNjcm9sbCB0byB0aGUgaXRlbSB3aGVuIGl0IGlzIHZpc2libGVcIiwgLT5cbiAgICAgIHBhbmUuYWN0aXZhdGVJdGVtKGl0ZW0xKVxuICAgICAgZXhwZWN0KHRhYkJhci5lbGVtZW50LnNjcm9sbExlZnQpLnRvQmUgMFxuXG4gICAgICBwYW5lLmFjdGl2YXRlSXRlbShlZGl0b3IxKVxuICAgICAgZXhwZWN0KHRhYkJhci5lbGVtZW50LnNjcm9sbExlZnQpLnRvQmUgMFxuXG4gICAgICBwYW5lLmFjdGl2YXRlSXRlbShpdGVtMilcbiAgICAgIGV4cGVjdCh0YWJCYXIuZWxlbWVudC5zY3JvbGxMZWZ0KS50b0JlIDBcblxuICAgICAgcGFuZS5hY3RpdmF0ZUl0ZW0oaXRlbTMpXG4gICAgICBleHBlY3QodGFiQmFyLmVsZW1lbnQuc2Nyb2xsTGVmdCkubm90LnRvQmUgMFxuXG4gICAgaXQgXCJzY3JvbGxzIHRvIHRoZSBpdGVtIHdoZW4gaXQgaXNuJ3QgY29tcGxldGVseSB2aXNpYmxlXCIsIC0+XG4gICAgICB0YWJCYXIuZWxlbWVudC5zY3JvbGxMZWZ0ID0gNVxuICAgICAgZXhwZWN0KHRhYkJhci5lbGVtZW50LnNjcm9sbExlZnQpLnRvQmUgNSAjIFRoaXMgY2FuIGJlIDAgaWYgdGhlcmUgaXMgbm8gaG9yaXpvbnRhbCBzY3JvbGxiYXJcblxuICAgICAgcGFuZS5hY3RpdmF0ZUl0ZW0oaXRlbTEpXG4gICAgICBleHBlY3QodGFiQmFyLmVsZW1lbnQuc2Nyb2xsTGVmdCkudG9CZSAwXG5cbiAgICAgIHBhbmUuYWN0aXZhdGVJdGVtKGl0ZW0zKVxuICAgICAgZXhwZWN0KHRhYkJhci5lbGVtZW50LnNjcm9sbExlZnQpLnRvQmUgdGFiQmFyLmVsZW1lbnQuc2Nyb2xsV2lkdGggLSB0YWJCYXIuZWxlbWVudC5jbGllbnRXaWR0aFxuXG4gIGRlc2NyaWJlIFwid2hlbiBhIHRhYiBpdGVtJ3MgdGl0bGUgY2hhbmdlc1wiLCAtPlxuICAgIGl0IFwidXBkYXRlcyB0aGUgdGl0bGUgb2YgdGhlIGl0ZW0ncyB0YWJcIiwgLT5cbiAgICAgIGVkaXRvcjEuYnVmZmVyLnNldFBhdGgoJy90aGlzL2lzLWEvdGVzdC50eHQnKVxuICAgICAgZXhwZWN0KHRhYkJhci50YWJGb3JJdGVtKGVkaXRvcjEpLmVsZW1lbnQudGV4dENvbnRlbnQpLnRvTWF0Y2ggJ3Rlc3QudHh0J1xuXG4gIGRlc2NyaWJlIFwid2hlbiB0d28gdGFicyBoYXZlIHRoZSBzYW1lIHRpdGxlXCIsIC0+XG4gICAgaXQgXCJkaXNwbGF5cyB0aGUgbG9uZyB0aXRsZSBvbiB0aGUgdGFiIGlmIGl0J3MgYXZhaWxhYmxlIGZyb20gdGhlIGl0ZW1cIiwgLT5cbiAgICAgIGl0ZW0xLnRpdGxlID0gXCJPbGQgTWFuXCJcbiAgICAgIGl0ZW0xLmxvbmdUaXRsZSA9IFwiR3J1bXB5IE9sZCBNYW5cIlxuICAgICAgaXRlbTEuZW1pdFRpdGxlQ2hhbmdlZCgpXG4gICAgICBpdGVtMi50aXRsZSA9IFwiT2xkIE1hblwiXG4gICAgICBpdGVtMi5sb25nVGl0bGUgPSBcIkpvbGx5IE9sZCBNYW5cIlxuICAgICAgaXRlbTIuZW1pdFRpdGxlQ2hhbmdlZCgpXG5cbiAgICAgIGV4cGVjdCh0YWJCYXIudGFiRm9ySXRlbShpdGVtMSkuZWxlbWVudC50ZXh0Q29udGVudCkudG9NYXRjaCBcIkdydW1weSBPbGQgTWFuXCJcbiAgICAgIGV4cGVjdCh0YWJCYXIudGFiRm9ySXRlbShpdGVtMikuZWxlbWVudC50ZXh0Q29udGVudCkudG9NYXRjaCBcIkpvbGx5IE9sZCBNYW5cIlxuXG4gICAgICBpdGVtMi5sb25nVGl0bGUgPSB1bmRlZmluZWRcbiAgICAgIGl0ZW0yLmVtaXRUaXRsZUNoYW5nZWQoKVxuXG4gICAgICBleHBlY3QodGFiQmFyLnRhYkZvckl0ZW0oaXRlbTEpLmVsZW1lbnQudGV4dENvbnRlbnQpLnRvTWF0Y2ggXCJHcnVtcHkgT2xkIE1hblwiXG4gICAgICBleHBlY3QodGFiQmFyLnRhYkZvckl0ZW0oaXRlbTIpLmVsZW1lbnQudGV4dENvbnRlbnQpLnRvTWF0Y2ggXCJPbGQgTWFuXCJcblxuICBkZXNjcmliZSBcInRoZSBjbG9zZSBidXR0b25cIiwgLT5cbiAgICBpdCBcImlzIHByZXNlbnQgaW4gdGhlIGNlbnRlciwgcmVnYXJkbGVzcyBvZiB0aGUgdmFsdWUgcmV0dXJuZWQgYnkgaXNQZXJtYW5lbnREb2NrSXRlbSgpXCIsIC0+XG4gICAgICBpdGVtMyA9IG5ldyBUZXN0VmlldygnSXRlbSAzJywgdW5kZWZpbmVkLCBcInNxdWlycmVsXCIsIFwic2FtcGxlLmpzXCIpXG4gICAgICBleHBlY3QoaXRlbTMuaXNQZXJtYW5lbnREb2NrSXRlbSkudG9CZVVuZGVmaW5lZCgpXG4gICAgICBpdGVtNCA9IG5ldyBUZXN0VmlldygnSXRlbSA0JywgdW5kZWZpbmVkLCBcInNxdWlycmVsXCIsIFwic2FtcGxlLmpzXCIsIHRydWUpXG4gICAgICBleHBlY3QodHlwZW9mIGl0ZW00LmlzUGVybWFuZW50RG9ja0l0ZW0pLnRvQmUoJ2Z1bmN0aW9uJylcbiAgICAgIGl0ZW01ID0gbmV3IFRlc3RWaWV3KCdJdGVtIDUnLCB1bmRlZmluZWQsIFwic3F1aXJyZWxcIiwgXCJzYW1wbGUuanNcIiwgZmFsc2UpXG4gICAgICBleHBlY3QodHlwZW9mIGl0ZW01LmlzUGVybWFuZW50RG9ja0l0ZW0pLnRvQmUoJ2Z1bmN0aW9uJylcbiAgICAgIHBhbmUuYWN0aXZhdGVJdGVtKGl0ZW0zKVxuICAgICAgcGFuZS5hY3RpdmF0ZUl0ZW0oaXRlbTQpXG4gICAgICBwYW5lLmFjdGl2YXRlSXRlbShpdGVtNSlcbiAgICAgIHRhYnMgPSB0YWJCYXIuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudGFiJylcbiAgICAgIGV4cGVjdCh0YWJzWzJdLnF1ZXJ5U2VsZWN0b3IoJy5jbG9zZS1pY29uJykpLm5vdC50b0VxdWFsKG51bGwpXG4gICAgICBleHBlY3QodGFic1szXS5xdWVyeVNlbGVjdG9yKCcuY2xvc2UtaWNvbicpKS5ub3QudG9FcXVhbChudWxsKVxuICAgICAgZXhwZWN0KHRhYnNbNF0ucXVlcnlTZWxlY3RvcignLmNsb3NlLWljb24nKSkubm90LnRvRXF1YWwobnVsbClcblxuICAgIHJldHVybiB1bmxlc3MgYXRvbS53b3Jrc3BhY2UuZ2V0UmlnaHREb2NrP1xuICAgIGRlc2NyaWJlIFwiaW4gZG9ja3NcIiwgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgcGFuZSA9IGF0b20ud29ya3NwYWNlLmdldFJpZ2h0RG9jaygpLmdldEFjdGl2ZVBhbmUoKVxuICAgICAgICB0YWJCYXIgPSBuZXcgVGFiQmFyVmlldyhwYW5lLCAncmlnaHQnKVxuXG4gICAgICBpdCBcImlzbid0IHNob3duIGlmIHRoZSBtZXRob2QgcmV0dXJucyB0cnVlXCIsIC0+XG4gICAgICAgIGl0ZW0xID0gbmV3IFRlc3RWaWV3KCdJdGVtIDEnLCB1bmRlZmluZWQsIFwic3F1aXJyZWxcIiwgXCJzYW1wbGUuanNcIiwgdHJ1ZSlcbiAgICAgICAgZXhwZWN0KHR5cGVvZiBpdGVtMS5pc1Blcm1hbmVudERvY2tJdGVtKS50b0JlKCdmdW5jdGlvbicpXG4gICAgICAgIHBhbmUuYWN0aXZhdGVJdGVtKGl0ZW0xKVxuICAgICAgICB0YWIgPSB0YWJCYXIuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcudGFiJylcbiAgICAgICAgZXhwZWN0KHRhYi5xdWVyeVNlbGVjdG9yKCcuY2xvc2UtaWNvbicpKS50b0VxdWFsKG51bGwpXG5cbiAgICAgIGl0IFwiaXMgc2hvd24gaWYgdGhlIG1ldGhvZCByZXR1cm5zIGZhbHNlXCIsIC0+XG4gICAgICAgIGl0ZW0xID0gbmV3IFRlc3RWaWV3KCdJdGVtIDEnLCB1bmRlZmluZWQsIFwic3F1aXJyZWxcIiwgXCJzYW1wbGUuanNcIiwgZmFsc2UpXG4gICAgICAgIGV4cGVjdCh0eXBlb2YgaXRlbTEuaXNQZXJtYW5lbnREb2NrSXRlbSkudG9CZSgnZnVuY3Rpb24nKVxuICAgICAgICBwYW5lLmFjdGl2YXRlSXRlbShpdGVtMSlcbiAgICAgICAgdGFiID0gdGFiQmFyLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLnRhYicpXG4gICAgICAgIGV4cGVjdCh0YWIucXVlcnlTZWxlY3RvcignLmNsb3NlLWljb24nKSkubm90LnRvQmVVbmRlZmluZWQoKVxuXG4gICAgICBpdCBcImlzIHNob3duIGlmIHRoZSBtZXRob2QgZG9lc24ndCBleGlzdFwiLCAtPlxuICAgICAgICBpdGVtMSA9IG5ldyBUZXN0VmlldygnSXRlbSAxJywgdW5kZWZpbmVkLCBcInNxdWlycmVsXCIsIFwic2FtcGxlLmpzXCIpXG4gICAgICAgIGV4cGVjdChpdGVtMS5pc1Blcm1hbmVudERvY2tJdGVtKS50b0JlVW5kZWZpbmVkKClcbiAgICAgICAgcGFuZS5hY3RpdmF0ZUl0ZW0oaXRlbTEpXG4gICAgICAgIHRhYiA9IHRhYkJhci5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy50YWInKVxuICAgICAgICBleHBlY3QodGFiLnF1ZXJ5U2VsZWN0b3IoJy5jbG9zZS1pY29uJykpLm5vdC50b0VxdWFsKG51bGwpXG5cbiAgZGVzY3JpYmUgXCJ3aGVuIGFuIGl0ZW0gaGFzIGFuIGljb24gZGVmaW5lZFwiLCAtPlxuICAgIGl0IFwiZGlzcGxheXMgdGhlIGljb24gb24gdGhlIHRhYlwiLCAtPlxuICAgICAgZXhwZWN0KHRhYkJhci5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWInKVswXS5xdWVyeVNlbGVjdG9yKCcudGl0bGUnKSkudG9IYXZlQ2xhc3MgXCJpY29uXCJcbiAgICAgIGV4cGVjdCh0YWJCYXIuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudGFiJylbMF0ucXVlcnlTZWxlY3RvcignLnRpdGxlJykpLnRvSGF2ZUNsYXNzIFwiaWNvbi1zcXVpcnJlbFwiXG5cbiAgICBpdCBcImhpZGVzIHRoZSBpY29uIGZyb20gdGhlIHRhYiBpZiB0aGUgaWNvbiBpcyByZW1vdmVkXCIsIC0+XG4gICAgICBpdGVtMS5nZXRJY29uTmFtZSA9IG51bGxcbiAgICAgIGl0ZW0xLmVtaXRJY29uQ2hhbmdlZCgpXG4gICAgICBleHBlY3QodGFiQmFyLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRhYicpWzBdLnF1ZXJ5U2VsZWN0b3IoJy50aXRsZScpKS5ub3QudG9IYXZlQ2xhc3MgXCJpY29uXCJcbiAgICAgIGV4cGVjdCh0YWJCYXIuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudGFiJylbMF0ucXVlcnlTZWxlY3RvcignLnRpdGxlJykpLm5vdC50b0hhdmVDbGFzcyBcImljb24tc3F1aXJyZWxcIlxuXG4gICAgaXQgXCJ1cGRhdGVzIHRoZSBpY29uIG9uIHRoZSB0YWIgaWYgdGhlIGljb24gaXMgY2hhbmdlZFwiLCAtPlxuICAgICAgaXRlbTEuZ2V0SWNvbk5hbWUgPSAtPiBcInphcFwiXG4gICAgICBpdGVtMS5lbWl0SWNvbkNoYW5nZWQoKVxuICAgICAgZXhwZWN0KHRhYkJhci5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWInKVswXS5xdWVyeVNlbGVjdG9yKCcudGl0bGUnKSkudG9IYXZlQ2xhc3MgXCJpY29uXCJcbiAgICAgIGV4cGVjdCh0YWJCYXIuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudGFiJylbMF0ucXVlcnlTZWxlY3RvcignLnRpdGxlJykpLnRvSGF2ZUNsYXNzIFwiaWNvbi16YXBcIlxuXG4gICAgZGVzY3JpYmUgXCJ3aGVuIHNob3dJY29uIGlzIHNldCB0byB0cnVlIGluIHBhY2thZ2Ugc2V0dGluZ3NcIiwgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgc3B5T24odGFiQmFyLnRhYkZvckl0ZW0oaXRlbTEpLCAndXBkYXRlSWNvblZpc2liaWxpdHknKS5hbmRDYWxsVGhyb3VnaCgpXG5cbiAgICAgICAgYXRvbS5jb25maWcuc2V0KFwidGFicy5zaG93SWNvbnNcIiwgdHJ1ZSlcblxuICAgICAgICB3YWl0c0ZvciAtPlxuICAgICAgICAgIHRhYkJhci50YWJGb3JJdGVtKGl0ZW0xKS51cGRhdGVJY29uVmlzaWJpbGl0eS5jYWxsQ291bnQgPiAwXG5cbiAgICAgICAgcnVucyAtPlxuICAgICAgICAgIHRhYkJhci50YWJGb3JJdGVtKGl0ZW0xKS51cGRhdGVJY29uVmlzaWJpbGl0eS5yZXNldCgpXG5cbiAgICAgIGl0IFwiZG9lc24ndCBoaWRlIHRoZSBpY29uXCIsIC0+XG4gICAgICAgIGV4cGVjdCh0YWJCYXIuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudGFiJylbMF0ucXVlcnlTZWxlY3RvcignLnRpdGxlJykpLm5vdC50b0hhdmVDbGFzcyBcImhpZGUtaWNvblwiXG5cbiAgICAgIGl0IFwiaGlkZXMgdGhlIGljb24gZnJvbSB0aGUgdGFiIHdoZW4gc2hvd0ljb24gaXMgY2hhbmdlZCB0byBmYWxzZVwiLCAtPlxuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoXCJ0YWJzLnNob3dJY29uc1wiLCBmYWxzZSlcblxuICAgICAgICB3YWl0c0ZvciAtPlxuICAgICAgICAgIHRhYkJhci50YWJGb3JJdGVtKGl0ZW0xKS51cGRhdGVJY29uVmlzaWJpbGl0eS5jYWxsQ291bnQgPiAwXG5cbiAgICAgICAgcnVucyAtPlxuICAgICAgICAgIGV4cGVjdCh0YWJCYXIuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudGFiJylbMF0ucXVlcnlTZWxlY3RvcignLnRpdGxlJykpLnRvSGF2ZUNsYXNzIFwiaGlkZS1pY29uXCJcblxuICAgIGRlc2NyaWJlIFwid2hlbiBzaG93SWNvbiBpcyBzZXQgdG8gZmFsc2UgaW4gcGFja2FnZSBzZXR0aW5nc1wiLCAtPlxuICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICBzcHlPbih0YWJCYXIudGFiRm9ySXRlbShpdGVtMSksICd1cGRhdGVJY29uVmlzaWJpbGl0eScpLmFuZENhbGxUaHJvdWdoKClcblxuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoXCJ0YWJzLnNob3dJY29uc1wiLCBmYWxzZSlcblxuICAgICAgICB3YWl0c0ZvciAtPlxuICAgICAgICAgIHRhYkJhci50YWJGb3JJdGVtKGl0ZW0xKS51cGRhdGVJY29uVmlzaWJpbGl0eS5jYWxsQ291bnQgPiAwXG5cbiAgICAgICAgcnVucyAtPlxuICAgICAgICAgIHRhYkJhci50YWJGb3JJdGVtKGl0ZW0xKS51cGRhdGVJY29uVmlzaWJpbGl0eS5yZXNldCgpXG5cbiAgICAgIGl0IFwiaGlkZXMgdGhlIGljb25cIiwgLT5cbiAgICAgICAgZXhwZWN0KHRhYkJhci5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWInKVswXS5xdWVyeVNlbGVjdG9yKCcudGl0bGUnKSkudG9IYXZlQ2xhc3MgXCJoaWRlLWljb25cIlxuXG4gICAgICBpdCBcInNob3dzIHRoZSBpY29uIG9uIHRoZSB0YWIgd2hlbiBzaG93SWNvbiBpcyBjaGFuZ2VkIHRvIHRydWVcIiwgLT5cbiAgICAgICAgYXRvbS5jb25maWcuc2V0KFwidGFicy5zaG93SWNvbnNcIiwgdHJ1ZSlcblxuICAgICAgICB3YWl0c0ZvciAtPlxuICAgICAgICAgIHRhYkJhci50YWJGb3JJdGVtKGl0ZW0xKS51cGRhdGVJY29uVmlzaWJpbGl0eS5jYWxsQ291bnQgPiAwXG5cbiAgICAgICAgZXhwZWN0KHRhYkJhci5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWInKVswXS5xdWVyeVNlbGVjdG9yKCcudGl0bGUnKSkubm90LnRvSGF2ZUNsYXNzIFwiaGlkZS1pY29uXCJcblxuICBkZXNjcmliZSBcIndoZW4gdGhlIGl0ZW0gZG9lc24ndCBoYXZlIGFuIGljb24gZGVmaW5lZFwiLCAtPlxuICAgIGl0IFwiZG9lc24ndCBkaXNwbGF5IGFuIGljb24gb24gdGhlIHRhYlwiLCAtPlxuICAgICAgZXhwZWN0KHRhYkJhci5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWInKVsyXS5xdWVyeVNlbGVjdG9yKCcudGl0bGUnKSkubm90LnRvSGF2ZUNsYXNzIFwiaWNvblwiXG4gICAgICBleHBlY3QodGFiQmFyLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRhYicpWzJdLnF1ZXJ5U2VsZWN0b3IoJy50aXRsZScpKS5ub3QudG9IYXZlQ2xhc3MgXCJpY29uLXNxdWlycmVsXCJcblxuICAgIGl0IFwic2hvd3MgdGhlIGljb24gb24gdGhlIHRhYiBpZiBhbiBpY29uIGlzIGRlZmluZWRcIiwgLT5cbiAgICAgIGl0ZW0yLmdldEljb25OYW1lID0gLT4gXCJzcXVpcnJlbFwiXG4gICAgICBpdGVtMi5lbWl0SWNvbkNoYW5nZWQoKVxuICAgICAgZXhwZWN0KHRhYkJhci5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWInKVsyXS5xdWVyeVNlbGVjdG9yKCcudGl0bGUnKSkudG9IYXZlQ2xhc3MgXCJpY29uXCJcbiAgICAgIGV4cGVjdCh0YWJCYXIuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudGFiJylbMl0ucXVlcnlTZWxlY3RvcignLnRpdGxlJykpLnRvSGF2ZUNsYXNzIFwiaWNvbi1zcXVpcnJlbFwiXG5cbiAgZGVzY3JpYmUgXCJ3aGVuIGEgdGFiIGl0ZW0ncyBtb2RpZmllZCBzdGF0dXMgY2hhbmdlc1wiLCAtPlxuICAgIGl0IFwiYWRkcyBvciByZW1vdmVzIHRoZSAnbW9kaWZpZWQnIGNsYXNzIHRvIHRoZSB0YWIgYmFzZWQgb24gdGhlIHN0YXR1c1wiLCAtPlxuICAgICAgdGFiID0gdGFiQmFyLnRhYkZvckl0ZW0oZWRpdG9yMSlcbiAgICAgIGV4cGVjdChlZGl0b3IxLmlzTW9kaWZpZWQoKSkudG9CZUZhbHN5KClcbiAgICAgIGV4cGVjdCh0YWIuZWxlbWVudCkubm90LnRvSGF2ZUNsYXNzICdtb2RpZmllZCdcblxuICAgICAgZWRpdG9yMS5pbnNlcnRUZXh0KCd4JylcbiAgICAgIGFkdmFuY2VDbG9jayhlZGl0b3IxLmJ1ZmZlci5zdG9wcGVkQ2hhbmdpbmdEZWxheSlcbiAgICAgIGV4cGVjdChlZGl0b3IxLmlzTW9kaWZpZWQoKSkudG9CZVRydXRoeSgpXG4gICAgICBleHBlY3QodGFiLmVsZW1lbnQpLnRvSGF2ZUNsYXNzICdtb2RpZmllZCdcblxuICAgICAgZWRpdG9yMS51bmRvKClcbiAgICAgIGFkdmFuY2VDbG9jayhlZGl0b3IxLmJ1ZmZlci5zdG9wcGVkQ2hhbmdpbmdEZWxheSlcbiAgICAgIGV4cGVjdChlZGl0b3IxLmlzTW9kaWZpZWQoKSkudG9CZUZhbHN5KClcbiAgICAgIGV4cGVjdCh0YWIuZWxlbWVudCkubm90LnRvSGF2ZUNsYXNzICdtb2RpZmllZCdcblxuICBkZXNjcmliZSBcIndoZW4gYSBwYW5lIGl0ZW0gbW92ZXMgdG8gYSBuZXcgaW5kZXhcIiwgLT5cbiAgICAjIGJlaGF2aW9yIGlzIGluZGVwZW5kZW50IG9mIGFkZE5ld1RhYnMgY29uZmlnXG4gICAgZGVzY3JpYmUgXCJ3aGVuIGFkZE5ld1RhYnNBdEVuZCBpcyBzZXQgdG8gdHJ1ZSBpbiBwYWNrYWdlIHNldHRpbmdzXCIsIC0+XG4gICAgICBpdCBcInVwZGF0ZXMgdGhlIG9yZGVyIG9mIHRoZSB0YWJzIHRvIG1hdGNoIHRoZSBuZXcgaXRlbSBvcmRlclwiLCAtPlxuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoXCJ0YWJzLmFkZE5ld1RhYnNBdEVuZFwiLCB0cnVlKVxuICAgICAgICBleHBlY3QodGFiQmFyLmdldFRhYnMoKS5tYXAgKHRhYikgLT4gdGFiLmVsZW1lbnQudGV4dENvbnRlbnQpLnRvRXF1YWwgW1wiSXRlbSAxXCIsIFwic2FtcGxlLmpzXCIsIFwiSXRlbSAyXCJdXG4gICAgICAgIHBhbmUubW92ZUl0ZW0oaXRlbTIsIDEpXG4gICAgICAgIGV4cGVjdCh0YWJCYXIuZ2V0VGFicygpLm1hcCAodGFiKSAtPiB0YWIuZWxlbWVudC50ZXh0Q29udGVudCkudG9FcXVhbCBbXCJJdGVtIDFcIiwgXCJJdGVtIDJcIiwgXCJzYW1wbGUuanNcIl1cbiAgICAgICAgcGFuZS5tb3ZlSXRlbShlZGl0b3IxLCAwKVxuICAgICAgICBleHBlY3QodGFiQmFyLmdldFRhYnMoKS5tYXAgKHRhYikgLT4gdGFiLmVsZW1lbnQudGV4dENvbnRlbnQpLnRvRXF1YWwgW1wic2FtcGxlLmpzXCIsIFwiSXRlbSAxXCIsIFwiSXRlbSAyXCJdXG4gICAgICAgIHBhbmUubW92ZUl0ZW0oaXRlbTEsIDIpXG4gICAgICAgIGV4cGVjdCh0YWJCYXIuZ2V0VGFicygpLm1hcCAodGFiKSAtPiB0YWIuZWxlbWVudC50ZXh0Q29udGVudCkudG9FcXVhbCBbXCJzYW1wbGUuanNcIiwgXCJJdGVtIDJcIiwgXCJJdGVtIDFcIl1cblxuICAgIGRlc2NyaWJlIFwid2hlbiBhZGROZXdUYWJzQXRFbmQgaXMgc2V0IHRvIGZhbHNlIGluIHBhY2thZ2Ugc2V0dGluZ3NcIiwgLT5cbiAgICAgIGl0IFwidXBkYXRlcyB0aGUgb3JkZXIgb2YgdGhlIHRhYnMgdG8gbWF0Y2ggdGhlIG5ldyBpdGVtIG9yZGVyXCIsIC0+XG4gICAgICAgIGF0b20uY29uZmlnLnNldChcInRhYnMuYWRkTmV3VGFic0F0RW5kXCIsIGZhbHNlKVxuICAgICAgICBleHBlY3QodGFiQmFyLmdldFRhYnMoKS5tYXAgKHRhYikgLT4gdGFiLmVsZW1lbnQudGV4dENvbnRlbnQpLnRvRXF1YWwgW1wiSXRlbSAxXCIsIFwic2FtcGxlLmpzXCIsIFwiSXRlbSAyXCJdXG4gICAgICAgIHBhbmUubW92ZUl0ZW0oaXRlbTIsIDEpXG4gICAgICAgIGV4cGVjdCh0YWJCYXIuZ2V0VGFicygpLm1hcCAodGFiKSAtPiB0YWIuZWxlbWVudC50ZXh0Q29udGVudCkudG9FcXVhbCBbXCJJdGVtIDFcIiwgXCJJdGVtIDJcIiwgXCJzYW1wbGUuanNcIl1cbiAgICAgICAgcGFuZS5tb3ZlSXRlbShlZGl0b3IxLCAwKVxuICAgICAgICBleHBlY3QodGFiQmFyLmdldFRhYnMoKS5tYXAgKHRhYikgLT4gdGFiLmVsZW1lbnQudGV4dENvbnRlbnQpLnRvRXF1YWwgW1wic2FtcGxlLmpzXCIsIFwiSXRlbSAxXCIsIFwiSXRlbSAyXCJdXG4gICAgICAgIHBhbmUubW92ZUl0ZW0oaXRlbTEsIDIpXG4gICAgICAgIGV4cGVjdCh0YWJCYXIuZ2V0VGFicygpLm1hcCAodGFiKSAtPiB0YWIuZWxlbWVudC50ZXh0Q29udGVudCkudG9FcXVhbCBbXCJzYW1wbGUuanNcIiwgXCJJdGVtIDJcIiwgXCJJdGVtIDFcIl1cblxuICBkZXNjcmliZSBcImNvbnRleHQgbWVudSBjb21tYW5kc1wiLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIHBhbmVFbGVtZW50ID0gcGFuZS5nZXRFbGVtZW50KClcbiAgICAgIHBhbmVFbGVtZW50Lmluc2VydEJlZm9yZSh0YWJCYXIuZWxlbWVudCwgcGFuZUVsZW1lbnQuZmlyc3RDaGlsZClcblxuICAgIGRlc2NyaWJlIFwid2hlbiB0YWJzOmNsb3NlLXRhYiBpcyBmaXJlZFwiLCAtPlxuICAgICAgaXQgXCJjbG9zZXMgdGhlIGFjdGl2ZSB0YWJcIiwgLT5cbiAgICAgICAgdHJpZ2dlckNsaWNrRXZlbnQodGFiQmFyLnRhYkZvckl0ZW0oaXRlbTIpLmVsZW1lbnQsIHdoaWNoOiAzKVxuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHRhYkJhci5lbGVtZW50LCAndGFiczpjbG9zZS10YWInKVxuICAgICAgICBleHBlY3QocGFuZS5nZXRJdGVtcygpLmxlbmd0aCkudG9CZSAyXG4gICAgICAgIGV4cGVjdChwYW5lLmdldEl0ZW1zKCkuaW5kZXhPZihpdGVtMikpLnRvQmUgLTFcbiAgICAgICAgZXhwZWN0KHRhYkJhci5nZXRUYWJzKCkubGVuZ3RoKS50b0JlIDJcbiAgICAgICAgZXhwZWN0KHRhYkJhci5lbGVtZW50LnRleHRDb250ZW50KS5ub3QudG9NYXRjaCgnSXRlbSAyJylcblxuICAgIGRlc2NyaWJlIFwid2hlbiB0YWJzOmNsb3NlLW90aGVyLXRhYnMgaXMgZmlyZWRcIiwgLT5cbiAgICAgIGl0IFwiY2xvc2VzIGFsbCBvdGhlciB0YWJzIGV4Y2VwdCB0aGUgYWN0aXZlIHRhYlwiLCAtPlxuICAgICAgICB0cmlnZ2VyQ2xpY2tFdmVudCh0YWJCYXIudGFiRm9ySXRlbShpdGVtMikuZWxlbWVudCwgd2hpY2g6IDMpXG4gICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2godGFiQmFyLmVsZW1lbnQsICd0YWJzOmNsb3NlLW90aGVyLXRhYnMnKVxuICAgICAgICBleHBlY3QocGFuZS5nZXRJdGVtcygpLmxlbmd0aCkudG9CZSAxXG4gICAgICAgIGV4cGVjdCh0YWJCYXIuZ2V0VGFicygpLmxlbmd0aCkudG9CZSAxXG4gICAgICAgIGV4cGVjdCh0YWJCYXIuZWxlbWVudC50ZXh0Q29udGVudCkubm90LnRvTWF0Y2goJ3NhbXBsZS5qcycpXG4gICAgICAgIGV4cGVjdCh0YWJCYXIuZWxlbWVudC50ZXh0Q29udGVudCkudG9NYXRjaCgnSXRlbSAyJylcblxuICAgIGRlc2NyaWJlIFwid2hlbiB0YWJzOmNsb3NlLXRhYnMtdG8tcmlnaHQgaXMgZmlyZWRcIiwgLT5cbiAgICAgIGl0IFwiY2xvc2VzIG9ubHkgdGhlIHRhYnMgdG8gdGhlIHJpZ2h0IG9mIHRoZSBhY3RpdmUgdGFiXCIsIC0+XG4gICAgICAgIHBhbmUuYWN0aXZhdGVJdGVtKGVkaXRvcjEpXG4gICAgICAgIHRyaWdnZXJDbGlja0V2ZW50KHRhYkJhci50YWJGb3JJdGVtKGVkaXRvcjEpLmVsZW1lbnQsIHdoaWNoOiAzKVxuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHRhYkJhci5lbGVtZW50LCAndGFiczpjbG9zZS10YWJzLXRvLXJpZ2h0JylcbiAgICAgICAgZXhwZWN0KHBhbmUuZ2V0SXRlbXMoKS5sZW5ndGgpLnRvQmUgMlxuICAgICAgICBleHBlY3QodGFiQmFyLmdldFRhYnMoKS5sZW5ndGgpLnRvQmUgMlxuICAgICAgICBleHBlY3QodGFiQmFyLmVsZW1lbnQudGV4dENvbnRlbnQpLm5vdC50b01hdGNoKCdJdGVtIDInKVxuICAgICAgICBleHBlY3QodGFiQmFyLmVsZW1lbnQudGV4dENvbnRlbnQpLnRvTWF0Y2goJ0l0ZW0gMScpXG5cbiAgICBkZXNjcmliZSBcIndoZW4gdGFiczpjbG9zZS10YWJzLXRvLWxlZnQgaXMgZmlyZWRcIiwgLT5cbiAgICAgIGl0IFwiY2xvc2VzIG9ubHkgdGhlIHRhYnMgdG8gdGhlIGxlZnQgb2YgdGhlIGFjdGl2ZSB0YWJcIiwgLT5cbiAgICAgICAgcGFuZS5hY3RpdmF0ZUl0ZW0oZWRpdG9yMSlcbiAgICAgICAgdHJpZ2dlckNsaWNrRXZlbnQodGFiQmFyLnRhYkZvckl0ZW0oZWRpdG9yMSkuZWxlbWVudCwgd2hpY2g6IDMpXG4gICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2godGFiQmFyLmVsZW1lbnQsICd0YWJzOmNsb3NlLXRhYnMtdG8tbGVmdCcpXG4gICAgICAgIGV4cGVjdChwYW5lLmdldEl0ZW1zKCkubGVuZ3RoKS50b0JlIDJcbiAgICAgICAgZXhwZWN0KHRhYkJhci5nZXRUYWJzKCkubGVuZ3RoKS50b0JlIDJcbiAgICAgICAgZXhwZWN0KHRhYkJhci5lbGVtZW50LnRleHRDb250ZW50KS50b01hdGNoKCdJdGVtIDInKVxuICAgICAgICBleHBlY3QodGFiQmFyLmVsZW1lbnQudGV4dENvbnRlbnQpLm5vdC50b01hdGNoKCdJdGVtIDEnKVxuXG4gICAgZGVzY3JpYmUgXCJ3aGVuIHRhYnM6Y2xvc2UtYWxsLXRhYnMgaXMgZmlyZWRcIiwgLT5cbiAgICAgIGl0IFwiY2xvc2VzIGFsbCB0aGUgdGFic1wiLCAtPlxuICAgICAgICBleHBlY3QocGFuZS5nZXRJdGVtcygpLmxlbmd0aCkudG9CZUdyZWF0ZXJUaGFuIDBcbiAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh0YWJCYXIuZWxlbWVudCwgJ3RhYnM6Y2xvc2UtYWxsLXRhYnMnKVxuICAgICAgICBleHBlY3QocGFuZS5nZXRJdGVtcygpLmxlbmd0aCkudG9CZSAwXG5cbiAgICBkZXNjcmliZSBcIndoZW4gdGFiczpjbG9zZS1zYXZlZC10YWJzIGlzIGZpcmVkXCIsIC0+XG4gICAgICBpdCBcImNsb3NlcyBhbGwgdGhlIHNhdmVkIHRhYnNcIiwgLT5cbiAgICAgICAgaXRlbTEuaXNNb2RpZmllZCA9IC0+IHRydWVcbiAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh0YWJCYXIuZWxlbWVudCwgJ3RhYnM6Y2xvc2Utc2F2ZWQtdGFicycpXG4gICAgICAgIGV4cGVjdChwYW5lLmdldEl0ZW1zKCkubGVuZ3RoKS50b0JlIDFcbiAgICAgICAgZXhwZWN0KHBhbmUuZ2V0SXRlbXMoKVswXSkudG9CZSBpdGVtMVxuXG4gICAgZGVzY3JpYmUgXCJ3aGVuIHRhYnM6c3BsaXQtdXAgaXMgZmlyZWRcIiwgLT5cbiAgICAgIGl0IFwic3BsaXRzIHRoZSBzZWxlY3RlZCB0YWIgdXBcIiwgLT5cbiAgICAgICAgdHJpZ2dlckNsaWNrRXZlbnQodGFiQmFyLnRhYkZvckl0ZW0oaXRlbTIpLmVsZW1lbnQsIHdoaWNoOiAzKVxuICAgICAgICBleHBlY3QoYXRvbS53b3Jrc3BhY2UuZ2V0Q2VudGVyKCkuZ2V0UGFuZXMoKS5sZW5ndGgpLnRvQmUgMVxuXG4gICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2godGFiQmFyLmVsZW1lbnQsICd0YWJzOnNwbGl0LXVwJylcbiAgICAgICAgZXhwZWN0KGF0b20ud29ya3NwYWNlLmdldENlbnRlcigpLmdldFBhbmVzKCkubGVuZ3RoKS50b0JlIDJcbiAgICAgICAgZXhwZWN0KGF0b20ud29ya3NwYWNlLmdldENlbnRlcigpLmdldFBhbmVzKClbMV0pLnRvQmUgcGFuZVxuICAgICAgICBleHBlY3QoYXRvbS53b3Jrc3BhY2UuZ2V0Q2VudGVyKCkuZ2V0UGFuZXMoKVswXS5nZXRJdGVtcygpWzBdLmdldFRpdGxlKCkpLnRvQmUgaXRlbTIuZ2V0VGl0bGUoKVxuXG4gICAgZGVzY3JpYmUgXCJ3aGVuIHRhYnM6c3BsaXQtZG93biBpcyBmaXJlZFwiLCAtPlxuICAgICAgaXQgXCJzcGxpdHMgdGhlIHNlbGVjdGVkIHRhYiBkb3duXCIsIC0+XG4gICAgICAgIHRyaWdnZXJDbGlja0V2ZW50KHRhYkJhci50YWJGb3JJdGVtKGl0ZW0yKS5lbGVtZW50LCB3aGljaDogMylcbiAgICAgICAgZXhwZWN0KGF0b20ud29ya3NwYWNlLmdldENlbnRlcigpLmdldFBhbmVzKCkubGVuZ3RoKS50b0JlIDFcblxuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHRhYkJhci5lbGVtZW50LCAndGFiczpzcGxpdC1kb3duJylcbiAgICAgICAgZXhwZWN0KGF0b20ud29ya3NwYWNlLmdldENlbnRlcigpLmdldFBhbmVzKCkubGVuZ3RoKS50b0JlIDJcbiAgICAgICAgZXhwZWN0KGF0b20ud29ya3NwYWNlLmdldENlbnRlcigpLmdldFBhbmVzKClbMF0pLnRvQmUgcGFuZVxuICAgICAgICBleHBlY3QoYXRvbS53b3Jrc3BhY2UuZ2V0Q2VudGVyKCkuZ2V0UGFuZXMoKVsxXS5nZXRJdGVtcygpWzBdLmdldFRpdGxlKCkpLnRvQmUgaXRlbTIuZ2V0VGl0bGUoKVxuXG4gICAgZGVzY3JpYmUgXCJ3aGVuIHRhYnM6c3BsaXQtbGVmdCBpcyBmaXJlZFwiLCAtPlxuICAgICAgaXQgXCJzcGxpdHMgdGhlIHNlbGVjdGVkIHRhYiB0byB0aGUgbGVmdFwiLCAtPlxuICAgICAgICB0cmlnZ2VyQ2xpY2tFdmVudCh0YWJCYXIudGFiRm9ySXRlbShpdGVtMikuZWxlbWVudCwgd2hpY2g6IDMpXG4gICAgICAgIGV4cGVjdChhdG9tLndvcmtzcGFjZS5nZXRDZW50ZXIoKS5nZXRQYW5lcygpLmxlbmd0aCkudG9CZSAxXG5cbiAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh0YWJCYXIuZWxlbWVudCwgJ3RhYnM6c3BsaXQtbGVmdCcpXG4gICAgICAgIGV4cGVjdChhdG9tLndvcmtzcGFjZS5nZXRDZW50ZXIoKS5nZXRQYW5lcygpLmxlbmd0aCkudG9CZSAyXG4gICAgICAgIGV4cGVjdChhdG9tLndvcmtzcGFjZS5nZXRDZW50ZXIoKS5nZXRQYW5lcygpWzFdKS50b0JlIHBhbmVcbiAgICAgICAgZXhwZWN0KGF0b20ud29ya3NwYWNlLmdldENlbnRlcigpLmdldFBhbmVzKClbMF0uZ2V0SXRlbXMoKVswXS5nZXRUaXRsZSgpKS50b0JlIGl0ZW0yLmdldFRpdGxlKClcblxuICAgIGRlc2NyaWJlIFwid2hlbiB0YWJzOnNwbGl0LXJpZ2h0IGlzIGZpcmVkXCIsIC0+XG4gICAgICBpdCBcInNwbGl0cyB0aGUgc2VsZWN0ZWQgdGFiIHRvIHRoZSByaWdodFwiLCAtPlxuICAgICAgICB0cmlnZ2VyQ2xpY2tFdmVudCh0YWJCYXIudGFiRm9ySXRlbShpdGVtMikuZWxlbWVudCwgd2hpY2g6IDMpXG4gICAgICAgIGV4cGVjdChhdG9tLndvcmtzcGFjZS5nZXRDZW50ZXIoKS5nZXRQYW5lcygpLmxlbmd0aCkudG9CZSAxXG5cbiAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh0YWJCYXIuZWxlbWVudCwgJ3RhYnM6c3BsaXQtcmlnaHQnKVxuICAgICAgICBleHBlY3QoYXRvbS53b3Jrc3BhY2UuZ2V0Q2VudGVyKCkuZ2V0UGFuZXMoKS5sZW5ndGgpLnRvQmUgMlxuICAgICAgICBleHBlY3QoYXRvbS53b3Jrc3BhY2UuZ2V0Q2VudGVyKCkuZ2V0UGFuZXMoKVswXSkudG9CZSBwYW5lXG4gICAgICAgIGV4cGVjdChhdG9tLndvcmtzcGFjZS5nZXRDZW50ZXIoKS5nZXRQYW5lcygpWzFdLmdldEl0ZW1zKClbMF0uZ2V0VGl0bGUoKSkudG9CZSBpdGVtMi5nZXRUaXRsZSgpXG5cbiAgICBkZXNjcmliZSBcIndoZW4gdGFiczpvcGVuLWluLW5ldy13aW5kb3cgaXMgZmlyZWRcIiwgLT5cbiAgICAgIGRlc2NyaWJlIFwiYnkgcmlnaHQtY2xpY2tpbmcgb24gYSB0YWJcIiwgLT5cbiAgICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICAgIHRyaWdnZXJDbGlja0V2ZW50KHRhYkJhci50YWJGb3JJdGVtKGl0ZW0xKS5lbGVtZW50LCB3aGljaDogMylcbiAgICAgICAgICBleHBlY3QoYXRvbS53b3Jrc3BhY2UuZ2V0Q2VudGVyKCkuZ2V0UGFuZXMoKS5sZW5ndGgpLnRvQmUgMVxuXG4gICAgICAgIGl0IFwib3BlbnMgbmV3IHdpbmRvdywgY2xvc2VzIGN1cnJlbnQgdGFiXCIsIC0+XG4gICAgICAgICAgc3B5T24oYXRvbSwgJ29wZW4nKVxuICAgICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2godGFiQmFyLmVsZW1lbnQsICd0YWJzOm9wZW4taW4tbmV3LXdpbmRvdycpXG4gICAgICAgICAgZXhwZWN0KGF0b20ub3BlbikudG9IYXZlQmVlbkNhbGxlZCgpXG5cbiAgICAgICAgICBleHBlY3QocGFuZS5nZXRJdGVtcygpLmxlbmd0aCkudG9CZSAyXG4gICAgICAgICAgZXhwZWN0KHRhYkJhci5nZXRUYWJzKCkubGVuZ3RoKS50b0JlIDJcbiAgICAgICAgICBleHBlY3QodGFiQmFyLmVsZW1lbnQudGV4dENvbnRlbnQpLnRvTWF0Y2goJ0l0ZW0gMicpXG4gICAgICAgICAgZXhwZWN0KHRhYkJhci5lbGVtZW50LnRleHRDb250ZW50KS5ub3QudG9NYXRjaCgnSXRlbSAxJylcblxuICAgICAgZGVzY3JpYmUgXCJmcm9tIHRoZSBjb21tYW5kIHBhbGV0dGVcIiwgLT5cbiAgICAgICAgIyBTZWUgIzMwOSBmb3IgYmFja2dyb3VuZFxuXG4gICAgICAgIGl0IFwiZG9lcyBub3RoaW5nXCIsIC0+XG4gICAgICAgICAgc3B5T24oYXRvbSwgJ29wZW4nKVxuICAgICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2godGFiQmFyLmVsZW1lbnQsICd0YWJzOm9wZW4taW4tbmV3LXdpbmRvdycpXG4gICAgICAgICAgZXhwZWN0KGF0b20ub3Blbikubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuXG4gIGRlc2NyaWJlIFwiY29tbWFuZCBwYWxldHRlIGNvbW1hbmRzXCIsIC0+XG4gICAgcGFuZUVsZW1lbnQgPSBudWxsXG5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBwYW5lRWxlbWVudCA9IHBhbmUuZ2V0RWxlbWVudCgpXG5cbiAgICBkZXNjcmliZSBcIndoZW4gdGFiczpjbG9zZS10YWIgaXMgZmlyZWRcIiwgLT5cbiAgICAgIGl0IFwiY2xvc2VzIHRoZSBhY3RpdmUgdGFiXCIsIC0+XG4gICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2gocGFuZUVsZW1lbnQsICd0YWJzOmNsb3NlLXRhYicpXG4gICAgICAgIGV4cGVjdChwYW5lLmdldEl0ZW1zKCkubGVuZ3RoKS50b0JlIDJcbiAgICAgICAgZXhwZWN0KHBhbmUuZ2V0SXRlbXMoKS5pbmRleE9mKGl0ZW0yKSkudG9CZSAtMVxuICAgICAgICBleHBlY3QodGFiQmFyLmdldFRhYnMoKS5sZW5ndGgpLnRvQmUgMlxuICAgICAgICBleHBlY3QodGFiQmFyLmVsZW1lbnQudGV4dENvbnRlbnQpLm5vdC50b01hdGNoKCdJdGVtIDInKVxuXG4gICAgICBpdCBcImRvZXMgbm90aGluZyBpZiBubyB0YWJzIGFyZSBvcGVuXCIsIC0+XG4gICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2gocGFuZUVsZW1lbnQsICd0YWJzOmNsb3NlLXRhYicpXG4gICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2gocGFuZUVsZW1lbnQsICd0YWJzOmNsb3NlLXRhYicpXG4gICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2gocGFuZUVsZW1lbnQsICd0YWJzOmNsb3NlLXRhYicpXG4gICAgICAgIGV4cGVjdChwYW5lLmdldEl0ZW1zKCkubGVuZ3RoKS50b0JlIDBcbiAgICAgICAgZXhwZWN0KHRhYkJhci5nZXRUYWJzKCkubGVuZ3RoKS50b0JlIDBcblxuICAgIGRlc2NyaWJlIFwid2hlbiB0YWJzOmNsb3NlLW90aGVyLXRhYnMgaXMgZmlyZWRcIiwgLT5cbiAgICAgIGl0IFwiY2xvc2VzIGFsbCBvdGhlciB0YWJzIGV4Y2VwdCB0aGUgYWN0aXZlIHRhYlwiLCAtPlxuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHBhbmVFbGVtZW50LCAndGFiczpjbG9zZS1vdGhlci10YWJzJylcbiAgICAgICAgZXhwZWN0KHBhbmUuZ2V0SXRlbXMoKS5sZW5ndGgpLnRvQmUgMVxuICAgICAgICBleHBlY3QodGFiQmFyLmdldFRhYnMoKS5sZW5ndGgpLnRvQmUgMVxuICAgICAgICBleHBlY3QodGFiQmFyLmVsZW1lbnQudGV4dENvbnRlbnQpLm5vdC50b01hdGNoKCdzYW1wbGUuanMnKVxuICAgICAgICBleHBlY3QodGFiQmFyLmVsZW1lbnQudGV4dENvbnRlbnQpLnRvTWF0Y2goJ0l0ZW0gMicpXG5cbiAgICBkZXNjcmliZSBcIndoZW4gdGFiczpjbG9zZS10YWJzLXRvLXJpZ2h0IGlzIGZpcmVkXCIsIC0+XG4gICAgICBpdCBcImNsb3NlcyBvbmx5IHRoZSB0YWJzIHRvIHRoZSByaWdodCBvZiB0aGUgYWN0aXZlIHRhYlwiLCAtPlxuICAgICAgICBwYW5lLmFjdGl2YXRlSXRlbShlZGl0b3IxKVxuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHBhbmVFbGVtZW50LCAndGFiczpjbG9zZS10YWJzLXRvLXJpZ2h0JylcbiAgICAgICAgZXhwZWN0KHBhbmUuZ2V0SXRlbXMoKS5sZW5ndGgpLnRvQmUgMlxuICAgICAgICBleHBlY3QodGFiQmFyLmdldFRhYnMoKS5sZW5ndGgpLnRvQmUgMlxuICAgICAgICBleHBlY3QodGFiQmFyLmVsZW1lbnQudGV4dENvbnRlbnQpLm5vdC50b01hdGNoKCdJdGVtIDInKVxuICAgICAgICBleHBlY3QodGFiQmFyLmVsZW1lbnQudGV4dENvbnRlbnQpLnRvTWF0Y2goJ0l0ZW0gMScpXG5cbiAgICBkZXNjcmliZSBcIndoZW4gdGFiczpjbG9zZS1hbGwtdGFicyBpcyBmaXJlZFwiLCAtPlxuICAgICAgaXQgXCJjbG9zZXMgYWxsIHRoZSB0YWJzXCIsIC0+XG4gICAgICAgIGV4cGVjdChwYW5lLmdldEl0ZW1zKCkubGVuZ3RoKS50b0JlR3JlYXRlclRoYW4gMFxuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHBhbmVFbGVtZW50LCAndGFiczpjbG9zZS1hbGwtdGFicycpXG4gICAgICAgIGV4cGVjdChwYW5lLmdldEl0ZW1zKCkubGVuZ3RoKS50b0JlIDBcblxuICAgIGRlc2NyaWJlIFwid2hlbiB0YWJzOmNsb3NlLXNhdmVkLXRhYnMgaXMgZmlyZWRcIiwgLT5cbiAgICAgIGl0IFwiY2xvc2VzIGFsbCB0aGUgc2F2ZWQgdGFic1wiLCAtPlxuICAgICAgICBpdGVtMS5pc01vZGlmaWVkID0gLT4gdHJ1ZVxuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHBhbmVFbGVtZW50LCAndGFiczpjbG9zZS1zYXZlZC10YWJzJylcbiAgICAgICAgZXhwZWN0KHBhbmUuZ2V0SXRlbXMoKS5sZW5ndGgpLnRvQmUgMVxuICAgICAgICBleHBlY3QocGFuZS5nZXRJdGVtcygpWzBdKS50b0JlIGl0ZW0xXG5cbiAgICBkZXNjcmliZSBcIndoZW4gcGFuZTpjbG9zZSBpcyBmaXJlZFwiLCAtPlxuICAgICAgaXQgXCJkZXN0cm95cyBhbGwgdGhlIHRhYnMgd2l0aGluIHRoZSBwYW5lXCIsIC0+XG4gICAgICAgIHBhbmUyID0gcGFuZS5zcGxpdERvd24oY29weUFjdGl2ZUl0ZW06IHRydWUpXG4gICAgICAgIHRhYkJhcjIgPSBuZXcgVGFiQmFyVmlldyhwYW5lMiwgJ2NlbnRlcicpXG4gICAgICAgIHRhYjIgPSB0YWJCYXIyLnRhYkF0SW5kZXgoMClcbiAgICAgICAgc3B5T24odGFiMiwgJ2Rlc3Ryb3knKVxuXG4gICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICAgIFByb21pc2UucmVzb2x2ZShwYW5lMi5jbG9zZSgpKS50aGVuIC0+XG4gICAgICAgICAgICBleHBlY3QodGFiMi5kZXN0cm95KS50b0hhdmVCZWVuQ2FsbGVkKClcblxuICBkZXNjcmliZSBcImRyYWdnaW5nIGFuZCBkcm9wcGluZyB0YWJzXCIsIC0+XG4gICAgZGVzY3JpYmUgXCJ3aGVuIGEgdGFiIGlzIGRyYWdnZWQgd2l0aGluIHRoZSBzYW1lIHBhbmVcIiwgLT5cbiAgICAgIGRlc2NyaWJlIFwid2hlbiBpdCBpcyBkcm9wcGVkIG9uIHRhYiB0aGF0J3MgbGF0ZXIgaW4gdGhlIGxpc3RcIiwgLT5cbiAgICAgICAgaXQgXCJtb3ZlcyB0aGUgdGFiIGFuZCBpdHMgaXRlbSwgc2hvd3MgdGhlIHRhYidzIGl0ZW0sIGFuZCBmb2N1c2VzIHRoZSBwYW5lXCIsIC0+XG4gICAgICAgICAgZXhwZWN0KHRhYkJhci5nZXRUYWJzKCkubWFwICh0YWIpIC0+IHRhYi5lbGVtZW50LnRleHRDb250ZW50KS50b0VxdWFsIFtcIkl0ZW0gMVwiLCBcInNhbXBsZS5qc1wiLCBcIkl0ZW0gMlwiXVxuICAgICAgICAgIGV4cGVjdChwYW5lLmdldEl0ZW1zKCkpLnRvRXF1YWwgW2l0ZW0xLCBlZGl0b3IxLCBpdGVtMl1cbiAgICAgICAgICBleHBlY3QocGFuZS5nZXRBY3RpdmVJdGVtKCkpLnRvQmUgaXRlbTJcbiAgICAgICAgICBzcHlPbihwYW5lLCAnYWN0aXZhdGUnKVxuXG4gICAgICAgICAgdGFiVG9EcmFnID0gdGFiQmFyLnRhYkF0SW5kZXgoMClcbiAgICAgICAgICBzcHlPbih0YWJUb0RyYWcsICdkZXN0cm95VG9vbHRpcCcpXG4gICAgICAgICAgc3B5T24odGFiVG9EcmFnLCAndXBkYXRlVG9vbHRpcCcpXG4gICAgICAgICAgW2RyYWdTdGFydEV2ZW50LCBkcm9wRXZlbnRdID0gYnVpbGREcmFnRXZlbnRzKHRhYlRvRHJhZy5lbGVtZW50LCB0YWJCYXIudGFiQXRJbmRleCgxKS5lbGVtZW50KVxuICAgICAgICAgIHRhYkJhci5vbkRyYWdTdGFydChkcmFnU3RhcnRFdmVudClcblxuICAgICAgICAgIGV4cGVjdCh0YWJUb0RyYWcuZGVzdHJveVRvb2x0aXApLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgICAgIGV4cGVjdCh0YWJUb0RyYWcudXBkYXRlVG9vbHRpcCkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuXG4gICAgICAgICAgdGFiQmFyLm9uRHJvcChkcm9wRXZlbnQpXG4gICAgICAgICAgZXhwZWN0KHRhYlRvRHJhZy51cGRhdGVUb29sdGlwKS50b0hhdmVCZWVuQ2FsbGVkKClcblxuICAgICAgICAgIGV4cGVjdCh0YWJCYXIuZ2V0VGFicygpLm1hcCAodGFiKSAtPiB0YWIuZWxlbWVudC50ZXh0Q29udGVudCkudG9FcXVhbCBbXCJzYW1wbGUuanNcIiwgXCJJdGVtIDFcIiwgXCJJdGVtIDJcIl1cbiAgICAgICAgICBleHBlY3QocGFuZS5nZXRJdGVtcygpKS50b0VxdWFsIFtlZGl0b3IxLCBpdGVtMSwgaXRlbTJdXG4gICAgICAgICAgZXhwZWN0KHBhbmUuZ2V0QWN0aXZlSXRlbSgpKS50b0JlIGl0ZW0xXG4gICAgICAgICAgZXhwZWN0KHBhbmUuYWN0aXZhdGUpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuXG4gICAgICBkZXNjcmliZSBcIndoZW4gaXQgaXMgZHJvcHBlZCBvbiBhIHRhYiB0aGF0J3MgZWFybGllciBpbiB0aGUgbGlzdFwiLCAtPlxuICAgICAgICBpdCBcIm1vdmVzIHRoZSB0YWIgYW5kIGl0cyBpdGVtLCBzaG93cyB0aGUgdGFiJ3MgaXRlbSwgYW5kIGZvY3VzZXMgdGhlIHBhbmVcIiwgLT5cbiAgICAgICAgICBleHBlY3QodGFiQmFyLmdldFRhYnMoKS5tYXAgKHRhYikgLT4gdGFiLmVsZW1lbnQudGV4dENvbnRlbnQpLnRvRXF1YWwgW1wiSXRlbSAxXCIsIFwic2FtcGxlLmpzXCIsIFwiSXRlbSAyXCJdXG4gICAgICAgICAgZXhwZWN0KHBhbmUuZ2V0SXRlbXMoKSkudG9FcXVhbCBbaXRlbTEsIGVkaXRvcjEsIGl0ZW0yXVxuICAgICAgICAgIGV4cGVjdChwYW5lLmdldEFjdGl2ZUl0ZW0oKSkudG9CZSBpdGVtMlxuICAgICAgICAgIHNweU9uKHBhbmUsICdhY3RpdmF0ZScpXG5cbiAgICAgICAgICBbZHJhZ1N0YXJ0RXZlbnQsIGRyb3BFdmVudF0gPSBidWlsZERyYWdFdmVudHModGFiQmFyLnRhYkF0SW5kZXgoMikuZWxlbWVudCwgdGFiQmFyLnRhYkF0SW5kZXgoMCkuZWxlbWVudClcbiAgICAgICAgICB0YWJCYXIub25EcmFnU3RhcnQoZHJhZ1N0YXJ0RXZlbnQpXG4gICAgICAgICAgdGFiQmFyLm9uRHJvcChkcm9wRXZlbnQpXG5cbiAgICAgICAgICBleHBlY3QodGFiQmFyLmdldFRhYnMoKS5tYXAgKHRhYikgLT4gdGFiLmVsZW1lbnQudGV4dENvbnRlbnQpLnRvRXF1YWwgW1wiSXRlbSAxXCIsIFwiSXRlbSAyXCIsIFwic2FtcGxlLmpzXCJdXG4gICAgICAgICAgZXhwZWN0KHBhbmUuZ2V0SXRlbXMoKSkudG9FcXVhbCBbaXRlbTEsIGl0ZW0yLCBlZGl0b3IxXVxuICAgICAgICAgIGV4cGVjdChwYW5lLmdldEFjdGl2ZUl0ZW0oKSkudG9CZSBpdGVtMlxuICAgICAgICAgIGV4cGVjdChwYW5lLmFjdGl2YXRlKS50b0hhdmVCZWVuQ2FsbGVkKClcblxuICAgICAgZGVzY3JpYmUgXCJ3aGVuIGl0IGlzIGRyb3BwZWQgb24gaXRzZWxmXCIsIC0+XG4gICAgICAgIGl0IFwiZG9lc24ndCBtb3ZlIHRoZSB0YWIgb3IgaXRlbSwgYnV0IGRvZXMgbWFrZSBpdCB0aGUgYWN0aXZlIGl0ZW0gYW5kIGZvY3VzZXMgdGhlIHBhbmVcIiwgLT5cbiAgICAgICAgICBleHBlY3QodGFiQmFyLmdldFRhYnMoKS5tYXAgKHRhYikgLT4gdGFiLmVsZW1lbnQudGV4dENvbnRlbnQpLnRvRXF1YWwgW1wiSXRlbSAxXCIsIFwic2FtcGxlLmpzXCIsIFwiSXRlbSAyXCJdXG4gICAgICAgICAgZXhwZWN0KHBhbmUuZ2V0SXRlbXMoKSkudG9FcXVhbCBbaXRlbTEsIGVkaXRvcjEsIGl0ZW0yXVxuICAgICAgICAgIGV4cGVjdChwYW5lLmdldEFjdGl2ZUl0ZW0oKSkudG9CZSBpdGVtMlxuICAgICAgICAgIHNweU9uKHBhbmUsICdhY3RpdmF0ZScpXG5cbiAgICAgICAgICBbZHJhZ1N0YXJ0RXZlbnQsIGRyb3BFdmVudF0gPSBidWlsZERyYWdFdmVudHModGFiQmFyLnRhYkF0SW5kZXgoMCkuZWxlbWVudCwgdGFiQmFyLnRhYkF0SW5kZXgoMCkuZWxlbWVudClcbiAgICAgICAgICB0YWJCYXIub25EcmFnU3RhcnQoZHJhZ1N0YXJ0RXZlbnQpXG4gICAgICAgICAgdGFiQmFyLm9uRHJvcChkcm9wRXZlbnQpXG5cbiAgICAgICAgICBleHBlY3QodGFiQmFyLmdldFRhYnMoKS5tYXAgKHRhYikgLT4gdGFiLmVsZW1lbnQudGV4dENvbnRlbnQpLnRvRXF1YWwgW1wiSXRlbSAxXCIsIFwic2FtcGxlLmpzXCIsIFwiSXRlbSAyXCJdXG4gICAgICAgICAgZXhwZWN0KHBhbmUuZ2V0SXRlbXMoKSkudG9FcXVhbCBbaXRlbTEsIGVkaXRvcjEsIGl0ZW0yXVxuICAgICAgICAgIGV4cGVjdChwYW5lLmdldEFjdGl2ZUl0ZW0oKSkudG9CZSBpdGVtMVxuICAgICAgICAgIGV4cGVjdChwYW5lLmFjdGl2YXRlKS50b0hhdmVCZWVuQ2FsbGVkKClcblxuICAgICAgZGVzY3JpYmUgXCJ3aGVuIGl0IGlzIGRyb3BwZWQgb24gdGhlIHRhYiBiYXJcIiwgLT5cbiAgICAgICAgaXQgXCJtb3ZlcyB0aGUgdGFiIGFuZCBpdHMgaXRlbSB0byB0aGUgZW5kXCIsIC0+XG4gICAgICAgICAgZXhwZWN0KHRhYkJhci5nZXRUYWJzKCkubWFwICh0YWIpIC0+IHRhYi5lbGVtZW50LnRleHRDb250ZW50KS50b0VxdWFsIFtcIkl0ZW0gMVwiLCBcInNhbXBsZS5qc1wiLCBcIkl0ZW0gMlwiXVxuICAgICAgICAgIGV4cGVjdChwYW5lLmdldEl0ZW1zKCkpLnRvRXF1YWwgW2l0ZW0xLCBlZGl0b3IxLCBpdGVtMl1cbiAgICAgICAgICBleHBlY3QocGFuZS5nZXRBY3RpdmVJdGVtKCkpLnRvQmUgaXRlbTJcbiAgICAgICAgICBzcHlPbihwYW5lLCAnYWN0aXZhdGUnKVxuXG4gICAgICAgICAgW2RyYWdTdGFydEV2ZW50LCBkcm9wRXZlbnRdID0gYnVpbGREcmFnRXZlbnRzKHRhYkJhci50YWJBdEluZGV4KDApLmVsZW1lbnQsIHRhYkJhci5lbGVtZW50KVxuICAgICAgICAgIHRhYkJhci5vbkRyYWdTdGFydChkcmFnU3RhcnRFdmVudClcbiAgICAgICAgICB0YWJCYXIub25Ecm9wKGRyb3BFdmVudClcblxuICAgICAgICAgIGV4cGVjdCh0YWJCYXIuZ2V0VGFicygpLm1hcCAodGFiKSAtPiB0YWIuZWxlbWVudC50ZXh0Q29udGVudCkudG9FcXVhbCBbXCJzYW1wbGUuanNcIiwgXCJJdGVtIDJcIiwgXCJJdGVtIDFcIl1cbiAgICAgICAgICBleHBlY3QocGFuZS5nZXRJdGVtcygpKS50b0VxdWFsIFtlZGl0b3IxLCBpdGVtMiwgaXRlbTFdXG5cbiAgICBkZXNjcmliZSBcIndoZW4gYSB0YWIgaXMgZHJhZ2dlZCB0byBhIGRpZmZlcmVudCBwYW5lXCIsIC0+XG4gICAgICBbcGFuZTIsIHRhYkJhcjIsIGl0ZW0yYl0gPSBbXVxuXG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIHBhbmUyID0gcGFuZS5zcGxpdFJpZ2h0KGNvcHlBY3RpdmVJdGVtOiB0cnVlKVxuICAgICAgICBbaXRlbTJiXSA9IHBhbmUyLmdldEl0ZW1zKClcbiAgICAgICAgdGFiQmFyMiA9IG5ldyBUYWJCYXJWaWV3KHBhbmUyLCAnY2VudGVyJylcblxuICAgICAgaXQgXCJyZW1vdmVzIHRoZSB0YWIgYW5kIGl0ZW0gZnJvbSB0aGVpciBvcmlnaW5hbCBwYW5lIGFuZCBtb3ZlcyB0aGVtIHRvIHRoZSB0YXJnZXQgcGFuZVwiLCAtPlxuICAgICAgICBleHBlY3QodGFiQmFyLmdldFRhYnMoKS5tYXAgKHRhYikgLT4gdGFiLmVsZW1lbnQudGV4dENvbnRlbnQpLnRvRXF1YWwgW1wiSXRlbSAxXCIsIFwic2FtcGxlLmpzXCIsIFwiSXRlbSAyXCJdXG4gICAgICAgIGV4cGVjdChwYW5lLmdldEl0ZW1zKCkpLnRvRXF1YWwgW2l0ZW0xLCBlZGl0b3IxLCBpdGVtMl1cbiAgICAgICAgZXhwZWN0KHBhbmUuZ2V0QWN0aXZlSXRlbSgpKS50b0JlIGl0ZW0yXG5cbiAgICAgICAgZXhwZWN0KHRhYkJhcjIuZ2V0VGFicygpLm1hcCAodGFiKSAtPiB0YWIuZWxlbWVudC50ZXh0Q29udGVudCkudG9FcXVhbCBbXCJJdGVtIDJcIl1cbiAgICAgICAgZXhwZWN0KHBhbmUyLmdldEl0ZW1zKCkpLnRvRXF1YWwgW2l0ZW0yYl1cbiAgICAgICAgZXhwZWN0KHBhbmUyLmFjdGl2ZUl0ZW0pLnRvQmUgaXRlbTJiXG4gICAgICAgIHNweU9uKHBhbmUyLCAnYWN0aXZhdGUnKVxuXG4gICAgICAgIFtkcmFnU3RhcnRFdmVudCwgZHJvcEV2ZW50XSA9IGJ1aWxkRHJhZ0V2ZW50cyh0YWJCYXIudGFiQXRJbmRleCgwKS5lbGVtZW50LCB0YWJCYXIyLnRhYkF0SW5kZXgoMCkuZWxlbWVudClcbiAgICAgICAgdGFiQmFyLm9uRHJhZ1N0YXJ0KGRyYWdTdGFydEV2ZW50KVxuICAgICAgICB0YWJCYXIyLm9uRHJvcChkcm9wRXZlbnQpXG5cbiAgICAgICAgZXhwZWN0KHRhYkJhci5nZXRUYWJzKCkubWFwICh0YWIpIC0+IHRhYi5lbGVtZW50LnRleHRDb250ZW50KS50b0VxdWFsIFtcInNhbXBsZS5qc1wiLCBcIkl0ZW0gMlwiXVxuICAgICAgICBleHBlY3QocGFuZS5nZXRJdGVtcygpKS50b0VxdWFsIFtlZGl0b3IxLCBpdGVtMl1cbiAgICAgICAgZXhwZWN0KHBhbmUuZ2V0QWN0aXZlSXRlbSgpKS50b0JlIGl0ZW0yXG5cbiAgICAgICAgZXhwZWN0KHRhYkJhcjIuZ2V0VGFicygpLm1hcCAodGFiKSAtPiB0YWIuZWxlbWVudC50ZXh0Q29udGVudCkudG9FcXVhbCBbXCJJdGVtIDJcIiwgXCJJdGVtIDFcIl1cbiAgICAgICAgZXhwZWN0KHBhbmUyLmdldEl0ZW1zKCkpLnRvRXF1YWwgW2l0ZW0yYiwgaXRlbTFdXG4gICAgICAgIGV4cGVjdChwYW5lMi5hY3RpdmVJdGVtKS50b0JlIGl0ZW0xXG4gICAgICAgIGV4cGVjdChwYW5lMi5hY3RpdmF0ZSkudG9IYXZlQmVlbkNhbGxlZCgpXG5cbiAgICAgIGRlc2NyaWJlIFwid2hlbiB0aGUgdGFiIGlzIGRyYWdnZWQgdG8gYW4gZW1wdHkgcGFuZVwiLCAtPlxuICAgICAgICBpdCBcInJlbW92ZXMgdGhlIHRhYiBhbmQgaXRlbSBmcm9tIHRoZWlyIG9yaWdpbmFsIHBhbmUgYW5kIG1vdmVzIHRoZW0gdG8gdGhlIHRhcmdldCBwYW5lXCIsIC0+XG4gICAgICAgICAgcGFuZTIuZGVzdHJveUl0ZW1zKClcblxuICAgICAgICAgIGV4cGVjdCh0YWJCYXIuZ2V0VGFicygpLm1hcCAodGFiKSAtPiB0YWIuZWxlbWVudC50ZXh0Q29udGVudCkudG9FcXVhbCBbXCJJdGVtIDFcIiwgXCJzYW1wbGUuanNcIiwgXCJJdGVtIDJcIl1cbiAgICAgICAgICBleHBlY3QocGFuZS5nZXRJdGVtcygpKS50b0VxdWFsIFtpdGVtMSwgZWRpdG9yMSwgaXRlbTJdXG4gICAgICAgICAgZXhwZWN0KHBhbmUuZ2V0QWN0aXZlSXRlbSgpKS50b0JlIGl0ZW0yXG5cbiAgICAgICAgICBleHBlY3QodGFiQmFyMi5nZXRUYWJzKCkubWFwICh0YWIpIC0+IHRhYi5lbGVtZW50LnRleHRDb250ZW50KS50b0VxdWFsIFtdXG4gICAgICAgICAgZXhwZWN0KHBhbmUyLmdldEl0ZW1zKCkpLnRvRXF1YWwgW11cbiAgICAgICAgICBleHBlY3QocGFuZTIuYWN0aXZlSXRlbSkudG9CZVVuZGVmaW5lZCgpXG4gICAgICAgICAgc3B5T24ocGFuZTIsICdhY3RpdmF0ZScpXG5cbiAgICAgICAgICBbZHJhZ1N0YXJ0RXZlbnQsIGRyb3BFdmVudF0gPSBidWlsZERyYWdFdmVudHModGFiQmFyLnRhYkF0SW5kZXgoMCkuZWxlbWVudCwgdGFiQmFyMi5lbGVtZW50KVxuICAgICAgICAgIHRhYkJhci5vbkRyYWdTdGFydChkcmFnU3RhcnRFdmVudClcbiAgICAgICAgICB0YWJCYXIyLm9uRHJhZ092ZXIoZHJvcEV2ZW50KVxuICAgICAgICAgIHRhYkJhcjIub25Ecm9wKGRyb3BFdmVudClcblxuICAgICAgICAgIGV4cGVjdCh0YWJCYXIuZ2V0VGFicygpLm1hcCAodGFiKSAtPiB0YWIuZWxlbWVudC50ZXh0Q29udGVudCkudG9FcXVhbCBbXCJzYW1wbGUuanNcIiwgXCJJdGVtIDJcIl1cbiAgICAgICAgICBleHBlY3QocGFuZS5nZXRJdGVtcygpKS50b0VxdWFsIFtlZGl0b3IxLCBpdGVtMl1cbiAgICAgICAgICBleHBlY3QocGFuZS5nZXRBY3RpdmVJdGVtKCkpLnRvQmUgaXRlbTJcblxuICAgICAgICAgIGV4cGVjdCh0YWJCYXIyLmdldFRhYnMoKS5tYXAgKHRhYikgLT4gdGFiLmVsZW1lbnQudGV4dENvbnRlbnQpLnRvRXF1YWwgW1wiSXRlbSAxXCJdXG4gICAgICAgICAgZXhwZWN0KHBhbmUyLmdldEl0ZW1zKCkpLnRvRXF1YWwgW2l0ZW0xXVxuICAgICAgICAgIGV4cGVjdChwYW5lMi5hY3RpdmVJdGVtKS50b0JlIGl0ZW0xXG4gICAgICAgICAgZXhwZWN0KHBhbmUyLmFjdGl2YXRlKS50b0hhdmVCZWVuQ2FsbGVkKClcblxuICAgICAgZGVzY3JpYmUgXCJ3aGVuIGFkZE5ld1RhYnNBdEVuZCBpcyBzZXQgdG8gdHJ1ZSBpbiBwYWNrYWdlIHNldHRpbmdzXCIsIC0+XG4gICAgICAgIGl0IFwibW92ZXMgdGhlIGRyYWdnZWQgdGFiIHRvIHRoZSBkZXNpcmVkIGluZGV4IGluIHRoZSBuZXcgcGFuZVwiLCAtPlxuICAgICAgICAgIGF0b20uY29uZmlnLnNldChcInRhYnMuYWRkTmV3VGFic0F0RW5kXCIsIHRydWUpXG4gICAgICAgICAgZXhwZWN0KHRhYkJhci5nZXRUYWJzKCkubWFwICh0YWIpIC0+IHRhYi5lbGVtZW50LnRleHRDb250ZW50KS50b0VxdWFsIFtcIkl0ZW0gMVwiLCBcInNhbXBsZS5qc1wiLCBcIkl0ZW0gMlwiXVxuICAgICAgICAgIGV4cGVjdChwYW5lLmdldEl0ZW1zKCkpLnRvRXF1YWwgW2l0ZW0xLCBlZGl0b3IxLCBpdGVtMl1cbiAgICAgICAgICBleHBlY3QocGFuZS5nZXRBY3RpdmVJdGVtKCkpLnRvQmUgaXRlbTJcblxuICAgICAgICAgIGV4cGVjdCh0YWJCYXIyLmdldFRhYnMoKS5tYXAgKHRhYikgLT4gdGFiLmVsZW1lbnQudGV4dENvbnRlbnQpLnRvRXF1YWwgW1wiSXRlbSAyXCJdXG4gICAgICAgICAgZXhwZWN0KHBhbmUyLmdldEl0ZW1zKCkpLnRvRXF1YWwgW2l0ZW0yYl1cbiAgICAgICAgICBleHBlY3QocGFuZTIuYWN0aXZlSXRlbSkudG9CZSBpdGVtMmJcbiAgICAgICAgICBzcHlPbihwYW5lMiwgJ2FjdGl2YXRlJylcblxuICAgICAgICAgIFtkcmFnU3RhcnRFdmVudCwgZHJvcEV2ZW50XSA9IGJ1aWxkRHJhZ0V2ZW50cyh0YWJCYXIyLnRhYkF0SW5kZXgoMCkuZWxlbWVudCwgdGFiQmFyLnRhYkF0SW5kZXgoMCkuZWxlbWVudClcbiAgICAgICAgICB0YWJCYXIyLm9uRHJhZ1N0YXJ0KGRyYWdTdGFydEV2ZW50KVxuICAgICAgICAgIHRhYkJhci5vbkRyb3AoZHJvcEV2ZW50KVxuXG4gICAgICAgICAgZXhwZWN0KHRhYkJhci5nZXRUYWJzKCkubWFwICh0YWIpIC0+IHRhYi5lbGVtZW50LnRleHRDb250ZW50KS50b0VxdWFsIFtcIkl0ZW0gMVwiLCBcIkl0ZW0gMlwiLCBcInNhbXBsZS5qc1wiLCBcIkl0ZW0gMlwiXVxuICAgICAgICAgIGV4cGVjdChwYW5lLmdldEl0ZW1zKCkpLnRvRXF1YWwgW2l0ZW0xLCBpdGVtMmIsIGVkaXRvcjEsIGl0ZW0yXVxuICAgICAgICAgIGV4cGVjdChwYW5lLmdldEFjdGl2ZUl0ZW0oKSkudG9CZSBpdGVtMmJcblxuICAgICAgICAgIGF0b20uY29uZmlnLnNldChcInRhYnMuYWRkTmV3VGFic0F0RW5kXCIsIGZhbHNlKVxuXG4gICAgZGVzY3JpYmUgXCJ3aGVuIGEgdGFiIGlzIGRyYWdnZWQgb3ZlciBhIHBhbmUgaXRlbVwiLCAtPlxuICAgICAgaXQgXCJkcmF3cyBhbiBvdmVybGF5IG92ZXIgdGhlIGl0ZW1cIiwgLT5cbiAgICAgICAgZXhwZWN0KHRhYkJhci5nZXRUYWJzKCkubWFwICh0YWIpIC0+IHRhYi5lbGVtZW50LnRleHRDb250ZW50KS50b0VxdWFsIFtcIkl0ZW0gMVwiLCBcInNhbXBsZS5qc1wiLCBcIkl0ZW0gMlwiXVxuICAgICAgICB0YWIgPSB0YWJCYXIudGFiQXRJbmRleCgyKS5lbGVtZW50XG4gICAgICAgIGxheW91dC50ZXN0ID1cbiAgICAgICAgICBwYW5lOiBwYW5lXG4gICAgICAgICAgaXRlbVZpZXc6IHBhbmUuZ2V0RWxlbWVudCgpLnF1ZXJ5U2VsZWN0b3IoJy5pdGVtLXZpZXdzJylcbiAgICAgICAgICByZWN0OiB7dG9wOiAwLCBsZWZ0OiAwLCB3aWR0aDogMTAwLCBoZWlnaHQ6IDEwMH1cblxuICAgICAgICBleHBlY3QobGF5b3V0LnZpZXcuY2xhc3NMaXN0LmNvbnRhaW5zKCd2aXNpYmxlJykpLnRvQmUoZmFsc2UpXG4gICAgICAgICMgRHJhZyBpbnRvIHBhbmVcbiAgICAgICAgdGFiLm9uZHJhZyB0YXJnZXQ6IHRhYiwgY2xpZW50WDogNTAsIGNsaWVudFk6IDUwXG4gICAgICAgIGV4cGVjdChsYXlvdXQudmlldy5jbGFzc0xpc3QuY29udGFpbnMoJ3Zpc2libGUnKSkudG9CZSh0cnVlKVxuICAgICAgICBleHBlY3QobGF5b3V0LnZpZXcuc3R5bGUuaGVpZ2h0KS50b0JlKFwiMTAwcHhcIilcbiAgICAgICAgZXhwZWN0KGxheW91dC52aWV3LnN0eWxlLndpZHRoKS50b0JlKFwiMTAwcHhcIilcbiAgICAgICAgIyBEcmFnIG91dCBvZiBwYW5lXG4gICAgICAgIGRlbGV0ZSBsYXlvdXQudGVzdC5wYW5lXG4gICAgICAgIHRhYi5vbmRyYWcgdGFyZ2V0OiB0YWIsIGNsaWVudFg6IDIwMCwgY2xpZW50WTogMjAwXG4gICAgICAgIGV4cGVjdChsYXlvdXQudmlldy5jbGFzc0xpc3QuY29udGFpbnMoJ3Zpc2libGUnKSkudG9CZShmYWxzZSlcblxuICAgICAgaXQgXCJjbGVhdmVzIHRoZSBwYW5lIGluIHR3YWluXCIsIC0+XG4gICAgICAgIGV4cGVjdCh0YWJCYXIuZ2V0VGFicygpLm1hcCAodGFiKSAtPiB0YWIuZWxlbWVudC50ZXh0Q29udGVudCkudG9FcXVhbCBbXCJJdGVtIDFcIiwgXCJzYW1wbGUuanNcIiwgXCJJdGVtIDJcIl1cbiAgICAgICAgdGFiID0gdGFiQmFyLnRhYkF0SW5kZXgoMikuZWxlbWVudFxuICAgICAgICBsYXlvdXQudGVzdCA9XG4gICAgICAgICAgcGFuZTogcGFuZVxuICAgICAgICAgIGl0ZW1WaWV3OiBwYW5lLmdldEVsZW1lbnQoKS5xdWVyeVNlbGVjdG9yKCcuaXRlbS12aWV3cycpXG4gICAgICAgICAgcmVjdDoge3RvcDogMCwgbGVmdDogMCwgd2lkdGg6IDEwMCwgaGVpZ2h0OiAxMDB9XG5cbiAgICAgICAgdGFiLm9uZHJhZyB0YXJnZXQ6IHRhYiwgY2xpZW50WDogODAsIGNsaWVudFk6IDUwXG4gICAgICAgIHRhYi5vbmRyYWdlbmQgdGFyZ2V0OiB0YWIsIGNsaWVudFg6IDgwLCBjbGllbnRZOiA1MFxuICAgICAgICBleHBlY3QoYXRvbS53b3Jrc3BhY2UuZ2V0Q2VudGVyKCkuZ2V0UGFuZXMoKS5sZW5ndGgpLnRvRXF1YWwoMilcbiAgICAgICAgZXhwZWN0KHRhYkJhci5nZXRUYWJzKCkubWFwICh0YWIpIC0+IHRhYi5lbGVtZW50LnRleHRDb250ZW50KS50b0VxdWFsIFtcIkl0ZW0gMVwiLCBcInNhbXBsZS5qc1wiXVxuICAgICAgICBleHBlY3QoYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpLmdldEl0ZW1zKCkubGVuZ3RoKS50b0VxdWFsKDEpXG5cbiAgICAgIGRlc2NyaWJlIFwid2hlbiB0aGUgZHJhZ2dlZCB0YWIgaXMgdGhlIG9ubHkgb25lIGluIHRoZSBwYW5lXCIsIC0+XG4gICAgICAgIGl0IFwiZG9lcyBub3RoaW5nXCIsIC0+XG4gICAgICAgICAgdGFiQmFyLmdldFRhYnMoKVswXS5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jbG9zZS1pY29uJykuY2xpY2soKVxuICAgICAgICAgIHRhYkJhci5nZXRUYWJzKClbMV0uZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuY2xvc2UtaWNvbicpLmNsaWNrKClcbiAgICAgICAgICBleHBlY3QodGFiQmFyLmdldFRhYnMoKS5tYXAgKHRhYikgLT4gdGFiLmVsZW1lbnQudGV4dENvbnRlbnQpLnRvRXF1YWwgW1wic2FtcGxlLmpzXCJdXG4gICAgICAgICAgdGFiID0gdGFiQmFyLnRhYkF0SW5kZXgoMCkuZWxlbWVudFxuICAgICAgICAgIGxheW91dC50ZXN0ID1cbiAgICAgICAgICAgIHBhbmU6IHBhbmVcbiAgICAgICAgICAgIGl0ZW1WaWV3OiBwYW5lLmdldEVsZW1lbnQoKS5xdWVyeVNlbGVjdG9yKCcuaXRlbS12aWV3cycpXG4gICAgICAgICAgICByZWN0OiB7dG9wOiAwLCBsZWZ0OiAwLCB3aWR0aDogMTAwLCBoZWlnaHQ6IDEwMH1cblxuICAgICAgICAgIHRhYi5vbmRyYWcgdGFyZ2V0OiB0YWIsIGNsaWVudFg6IDgwLCBjbGllbnRZOiA1MFxuICAgICAgICAgIHRhYi5vbmRyYWdlbmQgdGFyZ2V0OiB0YWIsIGNsaWVudFg6IDgwLCBjbGllbnRZOiA1MFxuICAgICAgICAgIGV4cGVjdChhdG9tLndvcmtzcGFjZS5nZXRDZW50ZXIoKS5nZXRQYW5lcygpLmxlbmd0aCkudG9FcXVhbCgxKVxuICAgICAgICAgIGV4cGVjdCh0YWJCYXIuZ2V0VGFicygpLm1hcCAodGFiKSAtPiB0YWIuZWxlbWVudC50ZXh0Q29udGVudCkudG9FcXVhbCBbXCJzYW1wbGUuanNcIl1cblxuICAgICAgZGVzY3JpYmUgXCJ3aGVuIHRoZSBwYW5lIGlzIGVtcHR5XCIsIC0+XG4gICAgICAgIGl0IFwibW92ZXMgdGhlIHRhYiB0byB0aGUgdGFyZ2V0IHBhbmVcIiwgLT5cbiAgICAgICAgICB0b1BhbmUgPSBwYW5lLnNwbGl0RG93bigpXG4gICAgICAgICAgZXhwZWN0KHRhYkJhci5nZXRUYWJzKCkubWFwICh0YWIpIC0+IHRhYi5lbGVtZW50LnRleHRDb250ZW50KS50b0VxdWFsIFtcIkl0ZW0gMVwiLCBcInNhbXBsZS5qc1wiLCBcIkl0ZW0gMlwiXVxuICAgICAgICAgIGV4cGVjdCh0b1BhbmUuZ2V0SXRlbXMoKS5sZW5ndGgpLnRvQmUoMClcbiAgICAgICAgICB0YWIgPSB0YWJCYXIudGFiQXRJbmRleCgyKS5lbGVtZW50XG4gICAgICAgICAgbGF5b3V0LnRlc3QgPVxuICAgICAgICAgICAgcGFuZTogdG9QYW5lXG4gICAgICAgICAgICBpdGVtVmlldzogdG9QYW5lLmdldEVsZW1lbnQoKS5xdWVyeVNlbGVjdG9yKCcuaXRlbS12aWV3cycpXG4gICAgICAgICAgICByZWN0OiB7dG9wOiAwLCBsZWZ0OiAwLCB3aWR0aDogMTAwLCBoZWlnaHQ6IDEwMH1cblxuICAgICAgICAgIHRhYi5vbmRyYWcgdGFyZ2V0OiB0YWIsIGNsaWVudFg6IDgwLCBjbGllbnRZOiA1MFxuICAgICAgICAgIHRhYi5vbmRyYWdlbmQgdGFyZ2V0OiB0YWIsIGNsaWVudFg6IDgwLCBjbGllbnRZOiA1MFxuICAgICAgICAgIGV4cGVjdChhdG9tLndvcmtzcGFjZS5nZXRDZW50ZXIoKS5nZXRQYW5lcygpLmxlbmd0aCkudG9FcXVhbCgyKVxuICAgICAgICAgIGV4cGVjdCh0YWJCYXIuZ2V0VGFicygpLm1hcCAodGFiKSAtPiB0YWIuZWxlbWVudC50ZXh0Q29udGVudCkudG9FcXVhbCBbXCJJdGVtIDFcIiwgXCJzYW1wbGUuanNcIl1cbiAgICAgICAgICBleHBlY3QoYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpLmdldEl0ZW1zKCkubGVuZ3RoKS50b0VxdWFsKDEpXG5cbiAgICBkZXNjcmliZSBcIndoZW4gYSBub24tdGFiIGlzIGRyYWdnZWQgdG8gcGFuZVwiLCAtPlxuICAgICAgaXQgXCJoYXMgbm8gZWZmZWN0XCIsIC0+XG4gICAgICAgIGV4cGVjdCh0YWJCYXIuZ2V0VGFicygpLm1hcCAodGFiKSAtPiB0YWIuZWxlbWVudC50ZXh0Q29udGVudCkudG9FcXVhbCBbXCJJdGVtIDFcIiwgXCJzYW1wbGUuanNcIiwgXCJJdGVtIDJcIl1cbiAgICAgICAgZXhwZWN0KHBhbmUuZ2V0SXRlbXMoKSkudG9FcXVhbCBbaXRlbTEsIGVkaXRvcjEsIGl0ZW0yXVxuICAgICAgICBleHBlY3QocGFuZS5nZXRBY3RpdmVJdGVtKCkpLnRvQmUgaXRlbTJcbiAgICAgICAgc3B5T24ocGFuZSwgJ2FjdGl2YXRlJylcblxuICAgICAgICBbZHJhZ1N0YXJ0RXZlbnQsIGRyb3BFdmVudF0gPSBidWlsZERyYWdFdmVudHModGFiQmFyLnRhYkF0SW5kZXgoMCkuZWxlbWVudCwgdGFiQmFyLnRhYkF0SW5kZXgoMCkuZWxlbWVudClcbiAgICAgICAgdGFiQmFyLm9uRHJvcChkcm9wRXZlbnQpXG5cbiAgICAgICAgZXhwZWN0KHRhYkJhci5nZXRUYWJzKCkubWFwICh0YWIpIC0+IHRhYi5lbGVtZW50LnRleHRDb250ZW50KS50b0VxdWFsIFtcIkl0ZW0gMVwiLCBcInNhbXBsZS5qc1wiLCBcIkl0ZW0gMlwiXVxuICAgICAgICBleHBlY3QocGFuZS5nZXRJdGVtcygpKS50b0VxdWFsIFtpdGVtMSwgZWRpdG9yMSwgaXRlbTJdXG4gICAgICAgIGV4cGVjdChwYW5lLmdldEFjdGl2ZUl0ZW0oKSkudG9CZSBpdGVtMlxuICAgICAgICBleHBlY3QocGFuZS5hY3RpdmF0ZSkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuXG4gICAgZGVzY3JpYmUgXCJ3aGVuIGEgdGFiIGlzIGRyYWdnZWQgb3V0IG9mIGFwcGxpY2F0aW9uXCIsIC0+XG4gICAgICBpdCBcInNob3VsZCBjYXJyeSB0aGUgZmlsZSdzIGluZm9ybWF0aW9uXCIsIC0+XG4gICAgICAgIFtkcmFnU3RhcnRFdmVudCwgZHJvcEV2ZW50XSA9IGJ1aWxkRHJhZ0V2ZW50cyh0YWJCYXIudGFiQXRJbmRleCgxKS5lbGVtZW50LCB0YWJCYXIudGFiQXRJbmRleCgxKS5lbGVtZW50KVxuICAgICAgICB0YWJCYXIub25EcmFnU3RhcnQoZHJhZ1N0YXJ0RXZlbnQpXG5cbiAgICAgICAgZXhwZWN0KGRyYWdTdGFydEV2ZW50LmRhdGFUcmFuc2Zlci5nZXREYXRhKFwidGV4dC9wbGFpblwiKSkudG9FcXVhbCBlZGl0b3IxLmdldFBhdGgoKVxuICAgICAgICBpZiBwcm9jZXNzLnBsYXRmb3JtIGlzICdkYXJ3aW4nXG4gICAgICAgICAgZXhwZWN0KGRyYWdTdGFydEV2ZW50LmRhdGFUcmFuc2Zlci5nZXREYXRhKFwidGV4dC91cmktbGlzdFwiKSkudG9FcXVhbCBcImZpbGU6Ly8je2VkaXRvcjEuZ2V0UGF0aCgpfVwiXG5cbiAgICBkZXNjcmliZSBcIndoZW4gYSB0YWIgaXMgZHJhZ2dlZCB0byBhbm90aGVyIEF0b20gd2luZG93XCIsIC0+XG4gICAgICBpdCBcImNsb3NlcyB0aGUgdGFiIGluIHRoZSBmaXJzdCB3aW5kb3cgYW5kIG9wZW5zIHRoZSB0YWIgaW4gdGhlIHNlY29uZCB3aW5kb3dcIiwgLT5cbiAgICAgICAgW2RyYWdTdGFydEV2ZW50LCBkcm9wRXZlbnRdID0gYnVpbGREcmFnRXZlbnRzKHRhYkJhci50YWJBdEluZGV4KDEpLmVsZW1lbnQsIHRhYkJhci50YWJBdEluZGV4KDApLmVsZW1lbnQpXG4gICAgICAgIHRhYkJhci5vbkRyYWdTdGFydChkcmFnU3RhcnRFdmVudClcbiAgICAgICAgdGFiQmFyLm9uRHJvcE9uT3RoZXJXaW5kb3cocGFuZS5pZCwgMSlcblxuICAgICAgICBleHBlY3QocGFuZS5nZXRJdGVtcygpKS50b0VxdWFsIFtpdGVtMSwgaXRlbTJdXG4gICAgICAgIGV4cGVjdChwYW5lLmdldEFjdGl2ZUl0ZW0oKSkudG9CZSBpdGVtMlxuXG4gICAgICAgIGRyb3BFdmVudC5kYXRhVHJhbnNmZXIuc2V0RGF0YSgnZnJvbS13aW5kb3ctaWQnLCB0YWJCYXIuZ2V0V2luZG93SWQoKSArIDEpXG5cbiAgICAgICAgc3B5T24odGFiQmFyLCAnbW92ZUl0ZW1CZXR3ZWVuUGFuZXMnKS5hbmRDYWxsVGhyb3VnaCgpXG4gICAgICAgIHRhYkJhci5vbkRyb3AoZHJvcEV2ZW50KVxuXG4gICAgICAgIHdhaXRzRm9yIC0+XG4gICAgICAgICAgdGFiQmFyLm1vdmVJdGVtQmV0d2VlblBhbmVzLmNhbGxDb3VudCA+IDBcblxuICAgICAgICBydW5zIC0+XG4gICAgICAgICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRQYXRoKCkpLnRvQmUgZWRpdG9yMS5nZXRQYXRoKClcbiAgICAgICAgICBleHBlY3QocGFuZS5nZXRJdGVtcygpKS50b0VxdWFsIFtpdGVtMSwgZWRpdG9yLCBpdGVtMl1cblxuICAgICAgaXQgXCJ0cmFuc2ZlcnMgdGhlIHRleHQgb2YgdGhlIGVkaXRvciB3aGVuIGl0IGlzIG1vZGlmaWVkXCIsIC0+XG4gICAgICAgIGVkaXRvcjEuc2V0VGV4dCgnSSBjYW1lIGZyb20gYW5vdGhlciB3aW5kb3cnKVxuICAgICAgICBbZHJhZ1N0YXJ0RXZlbnQsIGRyb3BFdmVudF0gPSBidWlsZERyYWdFdmVudHModGFiQmFyLnRhYkF0SW5kZXgoMSkuZWxlbWVudCwgdGFiQmFyLnRhYkF0SW5kZXgoMCkuZWxlbWVudClcbiAgICAgICAgdGFiQmFyLm9uRHJhZ1N0YXJ0KGRyYWdTdGFydEV2ZW50KVxuICAgICAgICB0YWJCYXIub25Ecm9wT25PdGhlcldpbmRvdyhwYW5lLmlkLCAxKVxuXG4gICAgICAgIGRyb3BFdmVudC5kYXRhVHJhbnNmZXIuc2V0RGF0YSgnZnJvbS13aW5kb3ctaWQnLCB0YWJCYXIuZ2V0V2luZG93SWQoKSArIDEpXG5cbiAgICAgICAgc3B5T24odGFiQmFyLCAnbW92ZUl0ZW1CZXR3ZWVuUGFuZXMnKS5hbmRDYWxsVGhyb3VnaCgpXG4gICAgICAgIHRhYkJhci5vbkRyb3AoZHJvcEV2ZW50KVxuXG4gICAgICAgIHdhaXRzRm9yIC0+XG4gICAgICAgICAgdGFiQmFyLm1vdmVJdGVtQmV0d2VlblBhbmVzLmNhbGxDb3VudCA+IDBcblxuICAgICAgICBydW5zIC0+XG4gICAgICAgICAgZXhwZWN0KGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKS5nZXRUZXh0KCkpLnRvQmUgJ0kgY2FtZSBmcm9tIGFub3RoZXIgd2luZG93J1xuXG4gICAgICBpdCBcImFsbG93cyB1bnRpdGxlZCBlZGl0b3JzIHRvIGJlIG1vdmVkIGJldHdlZW4gd2luZG93c1wiLCAtPlxuICAgICAgICBlZGl0b3IxLmdldEJ1ZmZlcigpLnNldFBhdGgobnVsbClcbiAgICAgICAgZWRpdG9yMS5zZXRUZXh0KCdJIGhhdmUgbm8gcGF0aCcpXG5cbiAgICAgICAgW2RyYWdTdGFydEV2ZW50LCBkcm9wRXZlbnRdID0gYnVpbGREcmFnRXZlbnRzKHRhYkJhci50YWJBdEluZGV4KDEpLmVsZW1lbnQsIHRhYkJhci50YWJBdEluZGV4KDApLmVsZW1lbnQpXG4gICAgICAgIHRhYkJhci5vbkRyYWdTdGFydChkcmFnU3RhcnRFdmVudClcbiAgICAgICAgdGFiQmFyLm9uRHJvcE9uT3RoZXJXaW5kb3cocGFuZS5pZCwgMSlcblxuICAgICAgICBkcm9wRXZlbnQuZGF0YVRyYW5zZmVyLnNldERhdGEoJ2Zyb20td2luZG93LWlkJywgdGFiQmFyLmdldFdpbmRvd0lkKCkgKyAxKVxuXG4gICAgICAgIHNweU9uKHRhYkJhciwgJ21vdmVJdGVtQmV0d2VlblBhbmVzJykuYW5kQ2FsbFRocm91Z2goKVxuICAgICAgICB0YWJCYXIub25Ecm9wKGRyb3BFdmVudClcblxuICAgICAgICB3YWl0c0ZvciAtPlxuICAgICAgICAgIHRhYkJhci5tb3ZlSXRlbUJldHdlZW5QYW5lcy5jYWxsQ291bnQgPiAwXG5cbiAgICAgICAgcnVucyAtPlxuICAgICAgICAgIGV4cGVjdChhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCkuZ2V0VGV4dCgpKS50b0JlICdJIGhhdmUgbm8gcGF0aCdcbiAgICAgICAgICBleHBlY3QoYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpLmdldFBhdGgoKSkudG9CZVVuZGVmaW5lZCgpXG5cbiAgICBpZiBhdG9tLndvcmtzcGFjZS5nZXRMZWZ0RG9jaz9cbiAgICAgIGRlc2NyaWJlIFwid2hlbiBhIHRhYiBpcyBkcmFnZ2VkIHRvIGFub3RoZXIgcGFuZSBjb250YWluZXJcIiwgLT5cbiAgICAgICAgW3BhbmUyLCB0YWJCYXIyLCBkb2NrSXRlbV0gPSBbXVxuXG4gICAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgICBqYXNtaW5lLmF0dGFjaFRvRE9NKGF0b20ud29ya3NwYWNlLmdldEVsZW1lbnQoKSlcbiAgICAgICAgICBwYW5lID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpXG4gICAgICAgICAgcGFuZTIgPSBhdG9tLndvcmtzcGFjZS5nZXRMZWZ0RG9jaygpLmdldEFjdGl2ZVBhbmUoKVxuICAgICAgICAgIGRvY2tJdGVtID0gbmV3IFRlc3RWaWV3KCdEb2NrIEl0ZW0nKVxuICAgICAgICAgIHBhbmUyLmFkZEl0ZW0oZG9ja0l0ZW0pXG4gICAgICAgICAgdGFiQmFyMiA9IG5ldyBUYWJCYXJWaWV3KHBhbmUyLCAnbGVmdCcpXG5cbiAgICAgICAgaXQgXCJyZW1vdmVzIHRoZSB0YWIgYW5kIGl0ZW0gZnJvbSB0aGVpciBvcmlnaW5hbCBwYW5lIGFuZCBtb3ZlcyB0aGVtIHRvIHRoZSB0YXJnZXQgcGFuZVwiLCAtPlxuICAgICAgICAgIGV4cGVjdChhdG9tLndvcmtzcGFjZS5nZXRMZWZ0RG9jaygpLmlzVmlzaWJsZSgpKS50b0JlKGZhbHNlKVxuXG4gICAgICAgICAgZXhwZWN0KHRhYkJhci5nZXRUYWJzKCkubWFwICh0YWIpIC0+IHRhYi5lbGVtZW50LnRleHRDb250ZW50KS50b0VxdWFsIFtcIkl0ZW0gMVwiLCBcInNhbXBsZS5qc1wiLCBcIkl0ZW0gMlwiXVxuICAgICAgICAgIGV4cGVjdChwYW5lLmdldEl0ZW1zKCkpLnRvRXF1YWwgW2l0ZW0xLCBlZGl0b3IxLCBpdGVtMl1cbiAgICAgICAgICBleHBlY3QocGFuZS5nZXRBY3RpdmVJdGVtKCkpLnRvQmUoaXRlbTIpXG5cbiAgICAgICAgICBleHBlY3QodGFiQmFyMi5nZXRUYWJzKCkubWFwICh0YWIpIC0+IHRhYi5lbGVtZW50LnRleHRDb250ZW50KS50b0VxdWFsIFtcIkRvY2sgSXRlbVwiXVxuICAgICAgICAgIGV4cGVjdChwYW5lMi5nZXRJdGVtcygpKS50b0VxdWFsIFtkb2NrSXRlbV1cbiAgICAgICAgICBleHBlY3QocGFuZTIuZ2V0QWN0aXZlSXRlbSgpKS50b0JlKGRvY2tJdGVtKVxuXG4gICAgICAgICAgW2RyYWdTdGFydEV2ZW50LCBkcm9wRXZlbnRdID0gYnVpbGREcmFnRXZlbnRzKHRhYkJhci50YWJBdEluZGV4KDApLmVsZW1lbnQsIHRhYkJhcjIuZWxlbWVudClcbiAgICAgICAgICB0YWJCYXIub25EcmFnU3RhcnQoZHJhZ1N0YXJ0RXZlbnQpXG4gICAgICAgICAgZXhwZWN0KHRhYkJhcjIuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcucGxhY2Vob2xkZXInKSkudG9CZU51bGwoKVxuICAgICAgICAgIHRhYkJhcjIub25EcmFnT3Zlcihkcm9wRXZlbnQpXG4gICAgICAgICAgZXhwZWN0KHRhYkJhcjIuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcucGxhY2Vob2xkZXInKSkubm90LnRvQmVOdWxsKClcbiAgICAgICAgICB0YWJCYXIyLm9uRHJvcChkcm9wRXZlbnQpXG4gICAgICAgICAgZXhwZWN0KHRhYkJhcjIuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcucGxhY2Vob2xkZXInKSkudG9CZU51bGwoKVxuXG4gICAgICAgICAgZXhwZWN0KHRhYkJhci5nZXRUYWJzKCkubWFwICh0YWIpIC0+IHRhYi5lbGVtZW50LnRleHRDb250ZW50KS50b0VxdWFsIFtcInNhbXBsZS5qc1wiLCBcIkl0ZW0gMlwiXVxuICAgICAgICAgIGV4cGVjdChwYW5lLmdldEl0ZW1zKCkpLnRvRXF1YWwgW2VkaXRvcjEsIGl0ZW0yXVxuICAgICAgICAgIGV4cGVjdChwYW5lLmdldEFjdGl2ZUl0ZW0oKSkudG9CZSBpdGVtMlxuXG4gICAgICAgICAgZXhwZWN0KHRhYkJhcjIuZ2V0VGFicygpLm1hcCAodGFiKSAtPiB0YWIuZWxlbWVudC50ZXh0Q29udGVudCkudG9FcXVhbCBbXCJEb2NrIEl0ZW1cIiwgXCJJdGVtIDFcIl1cbiAgICAgICAgICBleHBlY3QocGFuZTIuZ2V0SXRlbXMoKSkudG9FcXVhbCBbZG9ja0l0ZW0sIGl0ZW0xXVxuICAgICAgICAgIGV4cGVjdChwYW5lMi5hY3RpdmVJdGVtKS50b0JlIGl0ZW0xXG4gICAgICAgICAgZXhwZWN0KGF0b20ud29ya3NwYWNlLmdldExlZnREb2NrKCkuaXNWaXNpYmxlKCkpLnRvQmUodHJ1ZSlcblxuICAgICAgICBpdCBcInNob3dzIGEgcGxhY2Vob2xkZXIgYW5kIGFsbG93cyB0aGUgdGFiIGJlIGRyb3BwZWQgb25seSBpZiB0aGUgaXRlbSBzdXBwb3J0cyB0aGUgdGFyZ2V0IHBhbmUgY29udGFpbmVyIGxvY2F0aW9uXCIsIC0+XG4gICAgICAgICAgaXRlbTEuZ2V0QWxsb3dlZExvY2F0aW9ucyA9IC0+IFsnY2VudGVyJywgJ2JvdHRvbSddXG4gICAgICAgICAgW2RyYWdTdGFydEV2ZW50LCBkcm9wRXZlbnRdID0gYnVpbGREcmFnRXZlbnRzKHRhYkJhci50YWJBdEluZGV4KDApLmVsZW1lbnQsIHRhYkJhcjIuZWxlbWVudClcbiAgICAgICAgICB0YWJCYXIub25EcmFnU3RhcnQoZHJhZ1N0YXJ0RXZlbnQpXG4gICAgICAgICAgZXhwZWN0KHRhYkJhcjIuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcucGxhY2Vob2xkZXInKSkudG9CZU51bGwoKVxuICAgICAgICAgIHRhYkJhcjIub25EcmFnT3Zlcihkcm9wRXZlbnQpXG4gICAgICAgICAgZXhwZWN0KHRhYkJhcjIuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcucGxhY2Vob2xkZXInKSkudG9CZU51bGwoKVxuICAgICAgICAgIHRhYkJhcjIub25Ecm9wKGRyb3BFdmVudClcbiAgICAgICAgICBleHBlY3QodGFiQmFyMi5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGFjZWhvbGRlcicpKS50b0JlTnVsbCgpXG4gICAgICAgICAgZXhwZWN0KHBhbmUuZ2V0SXRlbXMoKSkudG9FcXVhbCBbaXRlbTEsIGVkaXRvcjEsIGl0ZW0yXVxuICAgICAgICAgIGV4cGVjdChwYW5lMi5nZXRJdGVtcygpKS50b0VxdWFsIFtkb2NrSXRlbV1cblxuICAgICAgICAgIGl0ZW0xLmdldEFsbG93ZWRMb2NhdGlvbnMgPSAtPiBbJ2xlZnQnXVxuICAgICAgICAgIFtkcmFnU3RhcnRFdmVudCwgZHJvcEV2ZW50XSA9IGJ1aWxkRHJhZ0V2ZW50cyh0YWJCYXIudGFiQXRJbmRleCgwKS5lbGVtZW50LCB0YWJCYXIyLmVsZW1lbnQpXG4gICAgICAgICAgdGFiQmFyLm9uRHJhZ1N0YXJ0KGRyYWdTdGFydEV2ZW50KVxuICAgICAgICAgIGV4cGVjdCh0YWJCYXIyLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLnBsYWNlaG9sZGVyJykpLnRvQmVOdWxsKClcbiAgICAgICAgICB0YWJCYXIyLm9uRHJhZ092ZXIoZHJvcEV2ZW50KVxuICAgICAgICAgIGV4cGVjdCh0YWJCYXIyLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLnBsYWNlaG9sZGVyJykpLm5vdC50b0JlTnVsbCgpXG4gICAgICAgICAgdGFiQmFyMi5vbkRyb3AoZHJvcEV2ZW50KVxuICAgICAgICAgIGV4cGVjdCh0YWJCYXIyLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLnBsYWNlaG9sZGVyJykpLnRvQmVOdWxsKClcbiAgICAgICAgICBleHBlY3QocGFuZS5nZXRJdGVtcygpKS50b0VxdWFsIFtlZGl0b3IxLCBpdGVtMl1cbiAgICAgICAgICBleHBlY3QocGFuZTIuZ2V0SXRlbXMoKSkudG9FcXVhbCBbZG9ja0l0ZW0sIGl0ZW0xXVxuXG4gIGRlc2NyaWJlIFwid2hlbiB0aGUgdGFiIGJhciBpcyBkb3VibGUgY2xpY2tlZFwiLCAtPlxuICAgIGl0IFwib3BlbnMgYSBuZXcgZW1wdHkgZWRpdG9yXCIsIC0+XG4gICAgICBuZXdGaWxlSGFuZGxlciA9IGphc21pbmUuY3JlYXRlU3B5KCduZXdGaWxlSGFuZGxlcicpXG4gICAgICBhdG9tLmNvbW1hbmRzLmFkZCh0YWJCYXIuZWxlbWVudCwgJ2FwcGxpY2F0aW9uOm5ldy1maWxlJywgbmV3RmlsZUhhbmRsZXIpXG5cbiAgICAgIHRyaWdnZXJNb3VzZUV2ZW50KFwiZGJsY2xpY2tcIiwgdGFiQmFyLmdldFRhYnMoKVswXS5lbGVtZW50KVxuICAgICAgZXhwZWN0KG5ld0ZpbGVIYW5kbGVyLmNhbGxDb3VudCkudG9CZSAwXG5cbiAgICAgIHRyaWdnZXJNb3VzZUV2ZW50KFwiZGJsY2xpY2tcIiwgdGFiQmFyLmVsZW1lbnQpXG4gICAgICBleHBlY3QobmV3RmlsZUhhbmRsZXIuY2FsbENvdW50KS50b0JlIDFcblxuICBkZXNjcmliZSBcIndoZW4gdGhlIG1vdXNlIHdoZWVsIGlzIHVzZWQgb24gdGhlIHRhYiBiYXJcIiwgLT5cbiAgICBkZXNjcmliZSBcIndoZW4gdGFiU2Nyb2xsaW5nIGlzIHRydWUgaW4gcGFja2FnZSBzZXR0aW5nc1wiLCAtPlxuICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoXCJ0YWJzLnRhYlNjcm9sbGluZ1wiLCB0cnVlKVxuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoXCJ0YWJzLnRhYlNjcm9sbGluZ1RocmVzaG9sZFwiLCAxMjApXG5cbiAgICAgIGRlc2NyaWJlIFwid2hlbiB0aGUgbW91c2Ugd2hlZWwgc2Nyb2xscyB1cFwiLCAtPlxuICAgICAgICBpdCBcImNoYW5nZXMgdGhlIGFjdGl2ZSB0YWIgdG8gdGhlIHByZXZpb3VzIHRhYlwiLCAtPlxuICAgICAgICAgIGV4cGVjdChwYW5lLmdldEFjdGl2ZUl0ZW0oKSkudG9CZSBpdGVtMlxuICAgICAgICAgIHRhYkJhci5lbGVtZW50LmRpc3BhdGNoRXZlbnQoYnVpbGRXaGVlbEV2ZW50KDEyMCkpXG4gICAgICAgICAgZXhwZWN0KHBhbmUuZ2V0QWN0aXZlSXRlbSgpKS50b0JlIGVkaXRvcjFcblxuICAgICAgICBpdCBcImNoYW5nZXMgdGhlIGFjdGl2ZSB0YWIgdG8gdGhlIHByZXZpb3VzIHRhYiBvbmx5IGFmdGVyIHRoZSB3aGVlbERlbHRhIGNyb3NzZXMgdGhlIHRocmVzaG9sZFwiLCAtPlxuICAgICAgICAgIGV4cGVjdChwYW5lLmdldEFjdGl2ZUl0ZW0oKSkudG9CZSBpdGVtMlxuICAgICAgICAgIHRhYkJhci5lbGVtZW50LmRpc3BhdGNoRXZlbnQoYnVpbGRXaGVlbEV2ZW50KDUwKSlcbiAgICAgICAgICBleHBlY3QocGFuZS5nZXRBY3RpdmVJdGVtKCkpLnRvQmUgaXRlbTJcbiAgICAgICAgICB0YWJCYXIuZWxlbWVudC5kaXNwYXRjaEV2ZW50KGJ1aWxkV2hlZWxFdmVudCg1MCkpXG4gICAgICAgICAgZXhwZWN0KHBhbmUuZ2V0QWN0aXZlSXRlbSgpKS50b0JlIGl0ZW0yXG4gICAgICAgICAgdGFiQmFyLmVsZW1lbnQuZGlzcGF0Y2hFdmVudChidWlsZFdoZWVsRXZlbnQoNTApKVxuICAgICAgICAgIGV4cGVjdChwYW5lLmdldEFjdGl2ZUl0ZW0oKSkudG9CZSBlZGl0b3IxXG5cbiAgICAgIGRlc2NyaWJlIFwid2hlbiB0aGUgbW91c2Ugd2hlZWwgc2Nyb2xscyBkb3duXCIsIC0+XG4gICAgICAgIGl0IFwiY2hhbmdlcyB0aGUgYWN0aXZlIHRhYiB0byB0aGUgcHJldmlvdXMgdGFiXCIsIC0+XG4gICAgICAgICAgZXhwZWN0KHBhbmUuZ2V0QWN0aXZlSXRlbSgpKS50b0JlIGl0ZW0yXG4gICAgICAgICAgdGFiQmFyLmVsZW1lbnQuZGlzcGF0Y2hFdmVudChidWlsZFdoZWVsRXZlbnQoLTEyMCkpXG4gICAgICAgICAgZXhwZWN0KHBhbmUuZ2V0QWN0aXZlSXRlbSgpKS50b0JlIGl0ZW0xXG5cbiAgICAgIGRlc2NyaWJlIFwid2hlbiB0aGUgbW91c2Ugd2hlZWwgc2Nyb2xscyB1cCBhbmQgc2hpZnQga2V5IGlzIHByZXNzZWRcIiwgLT5cbiAgICAgICAgaXQgXCJkb2VzIG5vdCBjaGFuZ2UgdGhlIGFjdGl2ZSB0YWJcIiwgLT5cbiAgICAgICAgICBleHBlY3QocGFuZS5nZXRBY3RpdmVJdGVtKCkpLnRvQmUgaXRlbTJcbiAgICAgICAgICB0YWJCYXIuZWxlbWVudC5kaXNwYXRjaEV2ZW50KGJ1aWxkV2hlZWxQbHVzU2hpZnRFdmVudCgxMjApKVxuICAgICAgICAgIGV4cGVjdChwYW5lLmdldEFjdGl2ZUl0ZW0oKSkudG9CZSBpdGVtMlxuXG4gICAgICBkZXNjcmliZSBcIndoZW4gdGhlIG1vdXNlIHdoZWVsIHNjcm9sbHMgZG93biBhbmQgc2hpZnQga2V5IGlzIHByZXNzZWRcIiwgLT5cbiAgICAgICAgaXQgXCJkb2VzIG5vdCBjaGFuZ2UgdGhlIGFjdGl2ZSB0YWJcIiwgLT5cbiAgICAgICAgICBleHBlY3QocGFuZS5nZXRBY3RpdmVJdGVtKCkpLnRvQmUgaXRlbTJcbiAgICAgICAgICB0YWJCYXIuZWxlbWVudC5kaXNwYXRjaEV2ZW50KGJ1aWxkV2hlZWxQbHVzU2hpZnRFdmVudCgtMTIwKSlcbiAgICAgICAgICBleHBlY3QocGFuZS5nZXRBY3RpdmVJdGVtKCkpLnRvQmUgaXRlbTJcblxuICAgIGRlc2NyaWJlIFwid2hlbiB0YWJTY3JvbGxpbmcgaXMgZmFsc2UgaW4gcGFja2FnZSBzZXR0aW5nc1wiLCAtPlxuICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoXCJ0YWJzLnRhYlNjcm9sbGluZ1wiLCBmYWxzZSlcblxuICAgICAgZGVzY3JpYmUgXCJ3aGVuIHRoZSBtb3VzZSB3aGVlbCBzY3JvbGxzIHVwIG9uZSB1bml0XCIsIC0+XG4gICAgICAgIGl0IFwiZG9lcyBub3QgY2hhbmdlIHRoZSBhY3RpdmUgdGFiXCIsIC0+XG4gICAgICAgICAgZXhwZWN0KHBhbmUuZ2V0QWN0aXZlSXRlbSgpKS50b0JlIGl0ZW0yXG4gICAgICAgICAgdGFiQmFyLmVsZW1lbnQuZGlzcGF0Y2hFdmVudChidWlsZFdoZWVsRXZlbnQoMTIwKSlcbiAgICAgICAgICBleHBlY3QocGFuZS5nZXRBY3RpdmVJdGVtKCkpLnRvQmUgaXRlbTJcblxuICAgICAgZGVzY3JpYmUgXCJ3aGVuIHRoZSBtb3VzZSB3aGVlbCBzY3JvbGxzIGRvd24gb25lIHVuaXRcIiwgLT5cbiAgICAgICAgaXQgXCJkb2VzIG5vdCBjaGFuZ2UgdGhlIGFjdGl2ZSB0YWJcIiwgLT5cbiAgICAgICAgICBleHBlY3QocGFuZS5nZXRBY3RpdmVJdGVtKCkpLnRvQmUgaXRlbTJcbiAgICAgICAgICB0YWJCYXIuZWxlbWVudC5kaXNwYXRjaEV2ZW50KGJ1aWxkV2hlZWxFdmVudCgtMTIwKSlcbiAgICAgICAgICBleHBlY3QocGFuZS5nZXRBY3RpdmVJdGVtKCkpLnRvQmUgaXRlbTJcblxuICBkZXNjcmliZSBcIndoZW4gYWx3YXlzU2hvd1RhYkJhciBpcyB0cnVlIGluIHBhY2thZ2Ugc2V0dGluZ3NcIiwgLT5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBhdG9tLmNvbmZpZy5zZXQoXCJ0YWJzLmFsd2F5c1Nob3dUYWJCYXJcIiwgdHJ1ZSlcblxuICAgIGRlc2NyaWJlIFwid2hlbiAyIHRhYnMgYXJlIG9wZW5cIiwgLT5cbiAgICAgIGl0IFwic2hvd3MgdGhlIHRhYiBiYXJcIiwgLT5cbiAgICAgICAgZXhwZWN0KHBhbmUuZ2V0SXRlbXMoKS5sZW5ndGgpLnRvQmUgM1xuICAgICAgICBleHBlY3QodGFiQmFyKS5ub3QudG9IYXZlQ2xhc3MgJ2hpZGRlbidcblxuICAgIGRlc2NyaWJlIFwid2hlbiAxIHRhYiBpcyBvcGVuXCIsIC0+XG4gICAgICBpdCBcInNob3dzIHRoZSB0YWIgYmFyXCIsIC0+XG4gICAgICAgIGV4cGVjdChwYW5lLmdldEl0ZW1zKCkubGVuZ3RoKS50b0JlIDNcbiAgICAgICAgcGFuZS5kZXN0cm95SXRlbShpdGVtMSlcbiAgICAgICAgcGFuZS5kZXN0cm95SXRlbShpdGVtMilcbiAgICAgICAgZXhwZWN0KHBhbmUuZ2V0SXRlbXMoKS5sZW5ndGgpLnRvQmUgMVxuICAgICAgICBleHBlY3QodGFiQmFyKS5ub3QudG9IYXZlQ2xhc3MgJ2hpZGRlbidcblxuICBkZXNjcmliZSBcIndoZW4gYWx3YXlzU2hvd1RhYkJhciBpcyBmYWxzZSBpbiBwYWNrYWdlIHNldHRpbmdzXCIsIC0+XG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgYXRvbS5jb25maWcuc2V0KFwidGFicy5hbHdheXNTaG93VGFiQmFyXCIsIGZhbHNlKVxuXG4gICAgZGVzY3JpYmUgXCJ3aGVuIDIgdGFicyBhcmUgb3BlblwiLCAtPlxuICAgICAgaXQgXCJzaG93cyB0aGUgdGFiIGJhclwiLCAtPlxuICAgICAgICBleHBlY3QocGFuZS5nZXRJdGVtcygpLmxlbmd0aCkudG9CZSAzXG4gICAgICAgIGV4cGVjdCh0YWJCYXIpLm5vdC50b0hhdmVDbGFzcyAnaGlkZGVuJ1xuXG4gICAgZGVzY3JpYmUgXCJ3aGVuIDEgdGFiIGlzIG9wZW5cIiwgLT5cbiAgICAgIGl0IFwiaGlkZXMgdGhlIHRhYiBiYXJcIiwgLT5cbiAgICAgICAgZXhwZWN0KHBhbmUuZ2V0SXRlbXMoKS5sZW5ndGgpLnRvQmUgM1xuICAgICAgICBwYW5lLmRlc3Ryb3lJdGVtKGl0ZW0xKVxuICAgICAgICBwYW5lLmRlc3Ryb3lJdGVtKGl0ZW0yKVxuICAgICAgICBleHBlY3QocGFuZS5nZXRJdGVtcygpLmxlbmd0aCkudG9CZSAxXG4gICAgICAgIGV4cGVjdCh0YWJCYXIuZWxlbWVudCkudG9IYXZlQ2xhc3MgJ2hpZGRlbidcblxuICBpZiBhdG9tLndvcmtzcGFjZS5idWlsZFRleHRFZGl0b3IoKS5pc1BlbmRpbmc/IG9yIGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKS5nZXRBY3RpdmVJdGVtP1xuICAgIGlzUGVuZGluZyA9IChpdGVtKSAtPlxuICAgICAgaWYgaXRlbS5pc1BlbmRpbmc/XG4gICAgICAgIGl0ZW0uaXNQZW5kaW5nKClcbiAgICAgIGVsc2VcbiAgICAgICAgYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpLmdldFBlbmRpbmdJdGVtKCkgaXMgaXRlbVxuXG4gICAgZGVzY3JpYmUgXCJ3aGVuIHRhYidzIHBhbmUgaXRlbSBpcyBwZW5kaW5nXCIsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIHBhbmUuZGVzdHJveUl0ZW1zKClcblxuICAgICAgZGVzY3JpYmUgXCJ3aGVuIG9wZW5pbmcgYSBuZXcgdGFiXCIsIC0+XG4gICAgICAgIGl0IFwiYWRkcyB0YWIgd2l0aCBjbGFzcyAndGVtcCdcIiwgLT5cbiAgICAgICAgICBlZGl0b3IxID0gbnVsbFxuICAgICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3Blbignc2FtcGxlLnR4dCcsIHBlbmRpbmc6IHRydWUpLnRoZW4gKG8pIC0+IGVkaXRvcjEgPSBvXG5cbiAgICAgICAgICBydW5zIC0+XG4gICAgICAgICAgICBwYW5lLmFjdGl2YXRlSXRlbShlZGl0b3IxKVxuICAgICAgICAgICAgZXhwZWN0KHRhYkJhci5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWIgLnRlbXAnKS5sZW5ndGgpLnRvQmUgMVxuICAgICAgICAgICAgZXhwZWN0KHRhYkJhci5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWInKVswXS5xdWVyeVNlbGVjdG9yKCcudGl0bGUnKSkudG9IYXZlQ2xhc3MgJ3RlbXAnXG5cbiAgICAgIGRlc2NyaWJlIFwid2hlbiB0YWJzOmtlZXAtcGVuZGluZy10YWIgaXMgdHJpZ2dlcmVkIG9uIHRoZSBwYW5lXCIsIC0+XG4gICAgICAgIGl0IFwidGVybWluYXRlcyBwZW5kaW5nIHN0YXRlIG9uIHRoZSB0YWIncyBpdGVtXCIsIC0+XG4gICAgICAgICAgZWRpdG9yMSA9IG51bGxcbiAgICAgICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oJ3NhbXBsZS50eHQnLCBwZW5kaW5nOiB0cnVlKS50aGVuIChvKSAtPiBlZGl0b3IxID0gb1xuXG4gICAgICAgICAgcnVucyAtPlxuICAgICAgICAgICAgcGFuZS5hY3RpdmF0ZUl0ZW0oZWRpdG9yMSlcbiAgICAgICAgICAgIGV4cGVjdChpc1BlbmRpbmcoZWRpdG9yMSkpLnRvQmUgdHJ1ZVxuICAgICAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaChhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKCkuZ2V0RWxlbWVudCgpLCAndGFiczprZWVwLXBlbmRpbmctdGFiJylcbiAgICAgICAgICAgIGV4cGVjdChpc1BlbmRpbmcoZWRpdG9yMSkpLnRvQmUgZmFsc2VcblxuICAgICAgZGVzY3JpYmUgXCJ3aGVuIHRoZXJlIGlzIGEgdGVtcCB0YWIgYWxyZWFkeVwiLCAtPlxuICAgICAgICBpdCBcIml0IHdpbGwgcmVwbGFjZSBhbiBleGlzdGluZyB0ZW1wb3JhcnkgdGFiXCIsIC0+XG4gICAgICAgICAgZWRpdG9yMSA9IG51bGxcbiAgICAgICAgICBlZGl0b3IyID0gbnVsbFxuXG4gICAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKCdzYW1wbGUudHh0JywgcGVuZGluZzogdHJ1ZSkudGhlbiAobykgLT5cbiAgICAgICAgICAgICAgZWRpdG9yMSA9IG9cbiAgICAgICAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3Blbignc2FtcGxlMi50eHQnLCBwZW5kaW5nOiB0cnVlKS50aGVuIChvKSAtPlxuICAgICAgICAgICAgICAgIGVkaXRvcjIgPSBvXG5cbiAgICAgICAgICBydW5zIC0+XG4gICAgICAgICAgICBleHBlY3QoZWRpdG9yMS5pc0Rlc3Ryb3llZCgpKS50b0JlIHRydWVcbiAgICAgICAgICAgIGV4cGVjdCh0YWJCYXIudGFiRm9ySXRlbShlZGl0b3IxKSkudG9CZVVuZGVmaW5lZCgpXG4gICAgICAgICAgICBleHBlY3QodGFiQmFyLnRhYkZvckl0ZW0oZWRpdG9yMikuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcudGl0bGUnKSkudG9IYXZlQ2xhc3MgJ3RlbXAnXG5cbiAgICAgICAgaXQgXCJtYWtlcyB0aGUgdGFiIHBlcm1hbmVudCB3aGVuIGRvdWJsZS1jbGlja2luZyB0aGUgdGFiXCIsIC0+XG4gICAgICAgICAgZWRpdG9yMiA9IG51bGxcblxuICAgICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3Blbignc2FtcGxlLnR4dCcsIHBlbmRpbmc6IHRydWUpLnRoZW4gKG8pIC0+IGVkaXRvcjIgPSBvXG5cbiAgICAgICAgICBydW5zIC0+XG4gICAgICAgICAgICBwYW5lLmFjdGl2YXRlSXRlbShlZGl0b3IyKVxuICAgICAgICAgICAgZXhwZWN0KHRhYkJhci50YWJGb3JJdGVtKGVkaXRvcjIpLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLnRpdGxlJykpLnRvSGF2ZUNsYXNzICd0ZW1wJ1xuICAgICAgICAgICAgdHJpZ2dlck1vdXNlRXZlbnQoJ2RibGNsaWNrJywgdGFiQmFyLnRhYkZvckl0ZW0oZWRpdG9yMikuZWxlbWVudCwgd2hpY2g6IDEpXG4gICAgICAgICAgICBleHBlY3QodGFiQmFyLnRhYkZvckl0ZW0oZWRpdG9yMikuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcudGl0bGUnKSkubm90LnRvSGF2ZUNsYXNzICd0ZW1wJ1xuXG4gICAgICBkZXNjcmliZSBcIndoZW4gZWRpdGluZyBhIGZpbGUgaW4gcGVuZGluZyBzdGF0ZVwiLCAtPlxuICAgICAgICBpdCBcIm1ha2VzIHRoZSBpdGVtIGFuZCB0YWIgcGVybWFuZW50XCIsIC0+XG4gICAgICAgICAgZWRpdG9yMSA9IG51bGxcbiAgICAgICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oJ3NhbXBsZS50eHQnLCBwZW5kaW5nOiB0cnVlKS50aGVuIChvKSAtPlxuICAgICAgICAgICAgICBlZGl0b3IxID0gb1xuICAgICAgICAgICAgICBwYW5lLmFjdGl2YXRlSXRlbShlZGl0b3IxKVxuICAgICAgICAgICAgICBlZGl0b3IxLmluc2VydFRleHQoJ3gnKVxuICAgICAgICAgICAgICBhZHZhbmNlQ2xvY2soZWRpdG9yMS5idWZmZXIuc3RvcHBlZENoYW5naW5nRGVsYXkpXG5cbiAgICAgICAgICBydW5zIC0+XG4gICAgICAgICAgICBleHBlY3QodGFiQmFyLnRhYkZvckl0ZW0oZWRpdG9yMSkuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcudGl0bGUnKSkubm90LnRvSGF2ZUNsYXNzICd0ZW1wJ1xuXG4gICAgICBkZXNjcmliZSBcIndoZW4gc2F2aW5nIGEgZmlsZVwiLCAtPlxuICAgICAgICBpdCBcIm1ha2VzIHRoZSB0YWIgcGVybWFuZW50XCIsIC0+XG4gICAgICAgICAgZWRpdG9yMSA9IG51bGxcbiAgICAgICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4ocGF0aC5qb2luKHRlbXAubWtkaXJTeW5jKCd0YWJzLScpLCAnc2FtcGxlLnR4dCcpLCBwZW5kaW5nOiB0cnVlKS50aGVuIChvKSAtPlxuICAgICAgICAgICAgICBlZGl0b3IxID0gb1xuICAgICAgICAgICAgICBwYW5lLmFjdGl2YXRlSXRlbShlZGl0b3IxKVxuICAgICAgICAgICAgICBlZGl0b3IxLnNhdmUoKVxuXG4gICAgICAgICAgcnVucyAtPlxuICAgICAgICAgICAgZXhwZWN0KHRhYkJhci50YWJGb3JJdGVtKGVkaXRvcjEpLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLnRpdGxlJykpLm5vdC50b0hhdmVDbGFzcyAndGVtcCdcblxuICAgICAgZGVzY3JpYmUgXCJ3aGVuIHNwbGl0dGluZyBhIHBlbmRpbmcgdGFiXCIsIC0+XG4gICAgICAgIGVkaXRvcjEgPSBudWxsXG4gICAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oJ3NhbXBsZS50eHQnLCBwZW5kaW5nOiB0cnVlKS50aGVuIChvKSAtPiBlZGl0b3IxID0gb1xuXG4gICAgICAgIGl0IFwibWFrZXMgdGhlIHRhYiBwZXJtYW5lbnQgaW4gdGhlIG5ldyBwYW5lXCIsIC0+XG4gICAgICAgICAgcGFuZS5hY3RpdmF0ZUl0ZW0oZWRpdG9yMSlcbiAgICAgICAgICBwYW5lMiA9IHBhbmUuc3BsaXRSaWdodChjb3B5QWN0aXZlSXRlbTogdHJ1ZSlcbiAgICAgICAgICB0YWJCYXIyID0gbmV3IFRhYkJhclZpZXcocGFuZTIsICdjZW50ZXInKVxuICAgICAgICAgIG5ld0VkaXRvciA9IHBhbmUyLmdldEFjdGl2ZUl0ZW0oKVxuICAgICAgICAgIGV4cGVjdChpc1BlbmRpbmcobmV3RWRpdG9yKSkudG9CZSBmYWxzZVxuICAgICAgICAgIGV4cGVjdCh0YWJCYXIyLnRhYkZvckl0ZW0obmV3RWRpdG9yKS5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy50aXRsZScpKS5ub3QudG9IYXZlQ2xhc3MgJ3RlbXAnXG5cbiAgICAgICAgaXQgXCJrZWVwcyB0aGUgcGVuZGluZyB0YWIgaW4gdGhlIG9sZCBwYW5lXCIsIC0+XG4gICAgICAgICAgZXhwZWN0KGlzUGVuZGluZyhlZGl0b3IxKSkudG9CZSB0cnVlXG4gICAgICAgICAgZXhwZWN0KHRhYkJhci50YWJGb3JJdGVtKGVkaXRvcjEpLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLnRpdGxlJykpLnRvSGF2ZUNsYXNzICd0ZW1wJ1xuXG4gICAgICBkZXNjcmliZSBcIndoZW4gZHJhZ2dpbmcgYSBwZW5kaW5nIHRhYiB0byBhIGRpZmZlcmVudCBwYW5lXCIsIC0+XG4gICAgICAgIGl0IFwibWFrZXMgdGhlIHRhYiBwZXJtYW5lbnQgaW4gdGhlIG90aGVyIHBhbmVcIiwgLT5cbiAgICAgICAgICBlZGl0b3IxID0gbnVsbFxuICAgICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3Blbignc2FtcGxlLnR4dCcsIHBlbmRpbmc6IHRydWUpLnRoZW4gKG8pIC0+IGVkaXRvcjEgPSBvXG5cbiAgICAgICAgICBydW5zIC0+XG4gICAgICAgICAgICBwYW5lLmFjdGl2YXRlSXRlbShlZGl0b3IxKVxuICAgICAgICAgICAgcGFuZTIgPSBwYW5lLnNwbGl0UmlnaHQoKVxuXG4gICAgICAgICAgICB0YWJCYXIyID0gbmV3IFRhYkJhclZpZXcocGFuZTIsICdjZW50ZXInKVxuICAgICAgICAgICAgdGFiQmFyMi5tb3ZlSXRlbUJldHdlZW5QYW5lcyhwYW5lLCAwLCBwYW5lMiwgMSwgZWRpdG9yMSlcblxuICAgICAgICAgICAgZXhwZWN0KHRhYkJhcjIudGFiRm9ySXRlbShwYW5lMi5nZXRBY3RpdmVJdGVtKCkpLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLnRpdGxlJykpLm5vdC50b0hhdmVDbGFzcyAndGVtcCdcblxuICBkZXNjcmliZSBcImludGVncmF0aW9uIHdpdGggdmVyc2lvbiBjb250cm9sIHN5c3RlbXNcIiwgLT5cbiAgICBbcmVwb3NpdG9yeSwgdGFiLCB0YWIxXSA9IFtdXG5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICB0YWIgPSB0YWJCYXIudGFiRm9ySXRlbShlZGl0b3IxKVxuICAgICAgc3B5T24odGFiLCAnc2V0dXBWY3NTdGF0dXMnKS5hbmRDYWxsVGhyb3VnaCgpXG4gICAgICBzcHlPbih0YWIsICd1cGRhdGVWY3NTdGF0dXMnKS5hbmRDYWxsVGhyb3VnaCgpXG5cbiAgICAgIHRhYjEgPSB0YWJCYXIudGFiRm9ySXRlbShpdGVtMSlcbiAgICAgIHRhYjEucGF0aCA9ICcvc29tZS9wYXRoL291dHNpZGUvdGhlL3JlcG9zaXRvcnknXG4gICAgICBzcHlPbih0YWIxLCAndXBkYXRlVmNzU3RhdHVzJykuYW5kQ2FsbFRocm91Z2goKVxuXG4gICAgICAjIE1vY2sgdGhlIHJlcG9zaXRvcnlcbiAgICAgIHJlcG9zaXRvcnkgPSBqYXNtaW5lLmNyZWF0ZVNweU9iaiAncmVwbycsIFsnaXNQYXRoSWdub3JlZCcsICdnZXRDYWNoZWRQYXRoU3RhdHVzJywgJ2lzU3RhdHVzTmV3JywgJ2lzU3RhdHVzTW9kaWZpZWQnXVxuICAgICAgcmVwb3NpdG9yeS5pc1N0YXR1c05ldy5hbmRDYWxsRmFrZSAoc3RhdHVzKSAtPiBzdGF0dXMgaXMgJ25ldydcbiAgICAgIHJlcG9zaXRvcnkuaXNTdGF0dXNNb2RpZmllZC5hbmRDYWxsRmFrZSAoc3RhdHVzKSAtPiBzdGF0dXMgaXMgJ21vZGlmaWVkJ1xuXG4gICAgICByZXBvc2l0b3J5Lm9uRGlkQ2hhbmdlU3RhdHVzID0gKGNhbGxiYWNrKSAtPlxuICAgICAgICBAY2hhbmdlU3RhdHVzQ2FsbGJhY2tzID89IFtdXG4gICAgICAgIEBjaGFuZ2VTdGF0dXNDYWxsYmFja3MucHVzaChjYWxsYmFjaylcbiAgICAgICAgZGlzcG9zZTogPT4gXy5yZW1vdmUoQGNoYW5nZVN0YXR1c0NhbGxiYWNrcywgY2FsbGJhY2spXG4gICAgICByZXBvc2l0b3J5LmVtaXREaWRDaGFuZ2VTdGF0dXMgPSAoZXZlbnQpIC0+XG4gICAgICAgIGNhbGxiYWNrKGV2ZW50KSBmb3IgY2FsbGJhY2sgaW4gQGNoYW5nZVN0YXR1c0NhbGxiYWNrcyA/IFtdXG5cbiAgICAgIHJlcG9zaXRvcnkub25EaWRDaGFuZ2VTdGF0dXNlcyA9IChjYWxsYmFjaykgLT5cbiAgICAgICAgQGNoYW5nZVN0YXR1c2VzQ2FsbGJhY2tzID89IFtdXG4gICAgICAgIEBjaGFuZ2VTdGF0dXNlc0NhbGxiYWNrcy5wdXNoKGNhbGxiYWNrKVxuICAgICAgICBkaXNwb3NlOiA9PiBfLnJlbW92ZShAY2hhbmdlU3RhdHVzZXNDYWxsYmFja3MsIGNhbGxiYWNrKVxuICAgICAgcmVwb3NpdG9yeS5lbWl0RGlkQ2hhbmdlU3RhdHVzZXMgPSAoZXZlbnQpIC0+XG4gICAgICAgIGNhbGxiYWNrKGV2ZW50KSBmb3IgY2FsbGJhY2sgaW4gQGNoYW5nZVN0YXR1c2VzQ2FsbGJhY2tzID8gW11cblxuICAgICAgIyBNb2NrIGF0b20ucHJvamVjdCB0byBwcmV0ZW5kIHdlIGFyZSB3b3JraW5nIHdpdGhpbiBhIHJlcG9zaXRvcnlcbiAgICAgIHNweU9uKGF0b20ucHJvamVjdCwgJ3JlcG9zaXRvcnlGb3JEaXJlY3RvcnknKS5hbmRSZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHJlcG9zaXRvcnkpXG5cbiAgICAgIGF0b20uY29uZmlnLnNldCBcInRhYnMuZW5hYmxlVmNzQ29sb3JpbmdcIiwgdHJ1ZVxuXG4gICAgICB3YWl0c0ZvciAtPlxuICAgICAgICByZXBvc2l0b3J5LmNoYW5nZVN0YXR1c0NhbGxiYWNrcz8ubGVuZ3RoID4gMFxuXG4gICAgZGVzY3JpYmUgXCJ3aGVuIHdvcmtpbmcgaW5zaWRlIGEgVkNTIHJlcG9zaXRvcnlcIiwgLT5cbiAgICAgIGl0IFwiYWRkcyBjdXN0b20gc3R5bGUgZm9yIG5ldyBpdGVtc1wiLCAtPlxuICAgICAgICByZXBvc2l0b3J5LmdldENhY2hlZFBhdGhTdGF0dXMuYW5kUmV0dXJuICduZXcnXG4gICAgICAgIHRhYi51cGRhdGVWY3NTdGF0dXMocmVwb3NpdG9yeSlcbiAgICAgICAgZXhwZWN0KHRhYkJhci5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWInKVsxXS5xdWVyeVNlbGVjdG9yKCcudGl0bGUnKSkudG9IYXZlQ2xhc3MgXCJzdGF0dXMtYWRkZWRcIlxuXG4gICAgICBpdCBcImFkZHMgY3VzdG9tIHN0eWxlIGZvciBtb2RpZmllZCBpdGVtc1wiLCAtPlxuICAgICAgICByZXBvc2l0b3J5LmdldENhY2hlZFBhdGhTdGF0dXMuYW5kUmV0dXJuICdtb2RpZmllZCdcbiAgICAgICAgdGFiLnVwZGF0ZVZjc1N0YXR1cyhyZXBvc2l0b3J5KVxuICAgICAgICBleHBlY3QodGFiQmFyLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRhYicpWzFdLnF1ZXJ5U2VsZWN0b3IoJy50aXRsZScpKS50b0hhdmVDbGFzcyBcInN0YXR1cy1tb2RpZmllZFwiXG5cbiAgICAgIGl0IFwiYWRkcyBjdXN0b20gc3R5bGUgZm9yIGlnbm9yZWQgaXRlbXNcIiwgLT5cbiAgICAgICAgcmVwb3NpdG9yeS5pc1BhdGhJZ25vcmVkLmFuZFJldHVybiB0cnVlXG4gICAgICAgIHRhYi51cGRhdGVWY3NTdGF0dXMocmVwb3NpdG9yeSlcbiAgICAgICAgZXhwZWN0KHRhYkJhci5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWInKVsxXS5xdWVyeVNlbGVjdG9yKCcudGl0bGUnKSkudG9IYXZlQ2xhc3MgXCJzdGF0dXMtaWdub3JlZFwiXG5cbiAgICAgIGl0IFwiZG9lcyBub3QgYWRkIGFueSBzdHlsZXMgZm9yIGl0ZW1zIG5vdCBpbiB0aGUgcmVwb3NpdG9yeVwiLCAtPlxuICAgICAgICBleHBlY3QodGFiQmFyLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRhYicpWzBdLnF1ZXJ5U2VsZWN0b3IoJy50aXRsZScpKS5ub3QudG9IYXZlQ2xhc3MgXCJzdGF0dXMtYWRkZWRcIlxuICAgICAgICBleHBlY3QodGFiQmFyLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRhYicpWzBdLnF1ZXJ5U2VsZWN0b3IoJy50aXRsZScpKS5ub3QudG9IYXZlQ2xhc3MgXCJzdGF0dXMtbW9kaWZpZWRcIlxuICAgICAgICBleHBlY3QodGFiQmFyLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRhYicpWzBdLnF1ZXJ5U2VsZWN0b3IoJy50aXRsZScpKS5ub3QudG9IYXZlQ2xhc3MgXCJzdGF0dXMtaWdub3JlZFwiXG5cbiAgICBkZXNjcmliZSBcIndoZW4gY2hhbmdlcyBpbiBpdGVtIHN0YXR1c2VzIGFyZSBub3RpZmllZFwiLCAtPlxuICAgICAgaXQgXCJ1cGRhdGVzIHN0YXR1cyBmb3IgaXRlbXMgaW4gdGhlIHJlcG9zaXRvcnlcIiwgLT5cbiAgICAgICAgdGFiLnVwZGF0ZVZjc1N0YXR1cy5yZXNldCgpXG4gICAgICAgIHJlcG9zaXRvcnkuZW1pdERpZENoYW5nZVN0YXR1c2VzKClcbiAgICAgICAgZXhwZWN0KHRhYi51cGRhdGVWY3NTdGF0dXMuY2FsbHMubGVuZ3RoKS50b0VxdWFsIDFcblxuICAgICAgaXQgXCJ1cGRhdGVzIHRoZSBzdGF0dXMgb2YgYW4gaXRlbSBpZiBpdCBoYXMgY2hhbmdlZFwiLCAtPlxuICAgICAgICByZXBvc2l0b3J5LmdldENhY2hlZFBhdGhTdGF0dXMucmVzZXQoKVxuICAgICAgICBleHBlY3QodGFiQmFyLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRhYicpWzFdLnF1ZXJ5U2VsZWN0b3IoJy50aXRsZScpKS5ub3QudG9IYXZlQ2xhc3MgXCJzdGF0dXMtbW9kaWZpZWRcIlxuICAgICAgICByZXBvc2l0b3J5LmVtaXREaWRDaGFuZ2VTdGF0dXMge3BhdGg6IHRhYi5wYXRoLCBwYXRoU3RhdHVzOiBcIm1vZGlmaWVkXCJ9XG4gICAgICAgIGV4cGVjdCh0YWJCYXIuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudGFiJylbMV0ucXVlcnlTZWxlY3RvcignLnRpdGxlJykpLnRvSGF2ZUNsYXNzIFwic3RhdHVzLW1vZGlmaWVkXCJcbiAgICAgICAgZXhwZWN0KHJlcG9zaXRvcnkuZ2V0Q2FjaGVkUGF0aFN0YXR1cy5jYWxscy5sZW5ndGgpLnRvQmUgMFxuXG4gICAgICBpdCBcImRvZXMgbm90IHVwZGF0ZSBzdGF0dXMgZm9yIGl0ZW1zIG5vdCBpbiB0aGUgcmVwb3NpdG9yeVwiLCAtPlxuICAgICAgICB0YWIxLnVwZGF0ZVZjc1N0YXR1cy5yZXNldCgpXG4gICAgICAgIHJlcG9zaXRvcnkuZW1pdERpZENoYW5nZVN0YXR1c2VzKClcbiAgICAgICAgZXhwZWN0KHRhYjEudXBkYXRlVmNzU3RhdHVzLmNhbGxzLmxlbmd0aCkudG9FcXVhbCAwXG5cbiAgICBkZXNjcmliZSBcIndoZW4gYW4gaXRlbSBpcyBzYXZlZFwiLCAtPlxuICAgICAgaXQgXCJkb2VzIG5vdCB1cGRhdGUgVkNTIHN1YnNjcmlwdGlvbiBpZiB0aGUgaXRlbSdzIHBhdGggcmVtYWlucyB0aGUgc2FtZVwiLCAtPlxuICAgICAgICB0YWIuc2V0dXBWY3NTdGF0dXMucmVzZXQoKVxuICAgICAgICB0YWIuaXRlbS5idWZmZXIuZW1pdHRlci5lbWl0ICdkaWQtc2F2ZScsIHtwYXRoOiB0YWIucGF0aH1cbiAgICAgICAgZXhwZWN0KHRhYi5zZXR1cFZjc1N0YXR1cy5jYWxscy5sZW5ndGgpLnRvQmUgMFxuXG4gICAgICBpdCBcInVwZGF0ZXMgVkNTIHN1YnNjcmlwdGlvbiBpZiB0aGUgaXRlbSdzIHBhdGggaGFzIGNoYW5nZWRcIiwgLT5cbiAgICAgICAgdGFiLnNldHVwVmNzU3RhdHVzLnJlc2V0KClcbiAgICAgICAgdGFiLml0ZW0uYnVmZmVyLmVtaXR0ZXIuZW1pdCAnZGlkLXNhdmUnLCB7cGF0aDogJy9zb21lL290aGVyL3BhdGgnfVxuICAgICAgICBleHBlY3QodGFiLnNldHVwVmNzU3RhdHVzLmNhbGxzLmxlbmd0aCkudG9CZSAxXG5cbiAgICBkZXNjcmliZSBcIndoZW4gZW5hYmxlVmNzQ29sb3JpbmcgY2hhbmdlcyBpbiBwYWNrYWdlIHNldHRpbmdzXCIsIC0+XG4gICAgICBpdCBcInJlbW92ZXMgc3RhdHVzIGZyb20gdGhlIHRhYiBpZiBlbmFibGVWY3NDb2xvcmluZyBpcyBzZXQgdG8gZmFsc2VcIiwgLT5cbiAgICAgICAgcmVwb3NpdG9yeS5lbWl0RGlkQ2hhbmdlU3RhdHVzIHtwYXRoOiB0YWIucGF0aCwgcGF0aFN0YXR1czogJ25ldyd9XG5cbiAgICAgICAgZXhwZWN0KHRhYkJhci5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWInKVsxXS5xdWVyeVNlbGVjdG9yKCcudGl0bGUnKSkudG9IYXZlQ2xhc3MgXCJzdGF0dXMtYWRkZWRcIlxuICAgICAgICBhdG9tLmNvbmZpZy5zZXQgXCJ0YWJzLmVuYWJsZVZjc0NvbG9yaW5nXCIsIGZhbHNlXG4gICAgICAgIGV4cGVjdCh0YWJCYXIuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudGFiJylbMV0ucXVlcnlTZWxlY3RvcignLnRpdGxlJykpLm5vdC50b0hhdmVDbGFzcyBcInN0YXR1cy1hZGRlZFwiXG5cbiAgICAgIGl0IFwiYWRkcyBzdGF0dXMgdG8gdGhlIHRhYiBpZiBlbmFibGVWY3NDb2xvcmluZyBpcyBzZXQgdG8gdHJ1ZVwiLCAtPlxuICAgICAgICBhdG9tLmNvbmZpZy5zZXQgXCJ0YWJzLmVuYWJsZVZjc0NvbG9yaW5nXCIsIGZhbHNlXG4gICAgICAgIHJlcG9zaXRvcnkuZ2V0Q2FjaGVkUGF0aFN0YXR1cy5hbmRSZXR1cm4gJ21vZGlmaWVkJ1xuICAgICAgICBleHBlY3QodGFiQmFyLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRhYicpWzFdLnF1ZXJ5U2VsZWN0b3IoJy50aXRsZScpKS5ub3QudG9IYXZlQ2xhc3MgXCJzdGF0dXMtbW9kaWZpZWRcIlxuICAgICAgICBhdG9tLmNvbmZpZy5zZXQgXCJ0YWJzLmVuYWJsZVZjc0NvbG9yaW5nXCIsIHRydWVcblxuICAgICAgICB3YWl0c0ZvciAtPlxuICAgICAgICAgIHJlcG9zaXRvcnkuY2hhbmdlU3RhdHVzQ2FsbGJhY2tzPy5sZW5ndGggPiAwXG5cbiAgICAgICAgcnVucyAtPlxuICAgICAgICAgIGV4cGVjdCh0YWJCYXIuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudGFiJylbMV0ucXVlcnlTZWxlY3RvcignLnRpdGxlJykpLnRvSGF2ZUNsYXNzIFwic3RhdHVzLW1vZGlmaWVkXCJcblxuICAgIGlmIGF0b20ud29ya3NwYWNlLmdldExlZnREb2NrP1xuICAgICAgZGVzY3JpYmUgXCJhIHBhbmUgaW4gdGhlIGRvY2tcIiwgLT5cbiAgICAgICAgYmVmb3JlRWFjaCAtPiBtYWluLmFjdGl2YXRlKClcbiAgICAgICAgYWZ0ZXJFYWNoIC0+IG1haW4uZGVhY3RpdmF0ZSgpXG4gICAgICAgIGl0IFwiZ2V0cyBkZWNvcmF0ZWQgd2l0aCB0YWJzXCIsIC0+XG4gICAgICAgICAgZG9jayA9IGF0b20ud29ya3NwYWNlLmdldExlZnREb2NrKClcbiAgICAgICAgICBkb2NrRWxlbWVudCA9IGRvY2suZ2V0RWxlbWVudCgpXG4gICAgICAgICAgaXRlbSA9IG5ldyBUZXN0VmlldygnRG9jayBJdGVtIDEnKVxuICAgICAgICAgIGV4cGVjdChkb2NrRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudGFiJykubGVuZ3RoKS50b0JlKDApXG4gICAgICAgICAgcGFuZSA9IGRvY2suZ2V0QWN0aXZlUGFuZSgpXG4gICAgICAgICAgcGFuZS5hY3RpdmF0ZUl0ZW0oaXRlbSlcbiAgICAgICAgICBleHBlY3QoZG9ja0VsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRhYicpLmxlbmd0aCkudG9CZSgxKVxuICAgICAgICAgIHBhbmUuZGVzdHJveUl0ZW0oaXRlbSlcbiAgICAgICAgICBleHBlY3QoZG9ja0VsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRhYicpLmxlbmd0aCkudG9CZSgwKVxuIl19
