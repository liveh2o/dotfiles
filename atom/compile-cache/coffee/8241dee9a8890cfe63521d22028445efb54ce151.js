(function() {
  var TabBarView, _, addItemToPane, buildDragEvents, buildWheelEvent, buildWheelPlusShiftEvent, getCenter, layout, main, path, ref, temp, triggerClickEvent, triggerMouseEvent;

  _ = require('underscore-plus');

  path = require('path');

  temp = require('temp');

  TabBarView = require('../lib/tab-bar-view');

  layout = require('../lib/layout');

  main = require('../lib/main');

  ref = require("./event-helpers"), triggerMouseEvent = ref.triggerMouseEvent, triggerClickEvent = ref.triggerClickEvent, buildDragEvents = ref.buildDragEvents, buildWheelEvent = ref.buildWheelEvent, buildWheelPlusShiftEvent = ref.buildWheelPlusShiftEvent;

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
          expect(getCenter().getPanes().length).toBe(1);
          atom.commands.dispatch(tabBar.element, 'tabs:split-up');
          expect(getCenter().getPanes().length).toBe(2);
          expect(getCenter().getPanes()[1]).toBe(pane);
          return expect(getCenter().getPanes()[0].getItems()[0].getTitle()).toBe(item2.getTitle());
        });
      });
      describe("when tabs:split-down is fired", function() {
        return it("splits the selected tab down", function() {
          triggerClickEvent(tabBar.tabForItem(item2).element, {
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
          triggerClickEvent(tabBar.tabForItem(item2).element, {
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
          triggerClickEvent(tabBar.tabForItem(item2).element, {
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
            triggerClickEvent(tabBar.tabForItem(item1).element, {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RhYnMvc3BlYy90YWJzLXNwZWMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSOztFQUNKLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFDUCxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsVUFBQSxHQUFhLE9BQUEsQ0FBUSxxQkFBUjs7RUFDYixNQUFBLEdBQVMsT0FBQSxDQUFRLGVBQVI7O0VBQ1QsSUFBQSxHQUFPLE9BQUEsQ0FBUSxhQUFSOztFQUNQLE1BQXFHLE9BQUEsQ0FBUSxpQkFBUixDQUFyRyxFQUFDLHlDQUFELEVBQW9CLHlDQUFwQixFQUF1QyxxQ0FBdkMsRUFBd0QscUNBQXhELEVBQXlFOztFQUV6RSxhQUFBLEdBQWdCLFNBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxLQUFiO0lBR2QsSUFBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQWIsS0FBdUIsQ0FBMUI7YUFDRSxJQUFJLENBQUMsT0FBTCxDQUFhLElBQWIsRUFBbUI7UUFBQSxLQUFBLEVBQU8sS0FBUDtPQUFuQixFQURGO0tBQUEsTUFFSyxJQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBYixLQUF1QixDQUF2QixJQUE0QixJQUFJLENBQUMsT0FBTyxDQUFDLE1BQWIsS0FBdUIsQ0FBdEQ7YUFDSCxJQUFJLENBQUMsT0FBTCxDQUFhLElBQWIsRUFBbUIsS0FBbkIsRUFERztLQUFBLE1BQUE7QUFHSCxZQUFVLElBQUEsS0FBQSxDQUFNLDZCQUFOLEVBSFA7O0VBTFM7O0VBV2hCLFNBQUEsR0FBWSxTQUFBO0FBQUcsUUFBQTt5SEFBOEIsSUFBSSxDQUFDO0VBQXRDOztFQUVaLFFBQUEsQ0FBUyxtQkFBVCxFQUE4QixTQUFBO0FBQzVCLFFBQUE7SUFBQSxhQUFBLEdBQWdCO0lBRWhCLFVB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O01Bb0JBLElBQUcsa0NBQUg7ZUFDRSxRQUFBLENBQVMsb0JBQVQsRUFBK0IsU0FBQTtVQUM3QixVQUFBLENBQVcsU0FBQTttQkFBRyxJQUFJLENBQUMsUUFBTCxDQUFBO1VBQUgsQ0FBWDtVQUNBLFNBQUEsQ0FBVSxTQUFBO21CQUFHLElBQUksQ0FBQyxVQUFMLENBQUE7VUFBSCxDQUFWO2lCQUNBLEVBQUEsQ0FBRywwQkFBSCxFQUErQixTQUFBO0FBQzdCLGdCQUFBO1lBQUEsSUFBQSxHQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBZixDQUFBO1lBQ1AsV0FBQSxHQUFjLElBQUksQ0FBQyxVQUFMLENBQUE7WUFDZCxJQUFBLEdBQVcsSUFBQSxRQUFBLENBQVMsYUFBVDtZQUNYLE1BQUEsQ0FBTyxXQUFXLENBQUMsZ0JBQVosQ0FBNkIsTUFBN0IsQ0FBb0MsQ0FBQyxNQUE1QyxDQUFtRCxDQUFDLElBQXBELENBQXlELENBQXpEO1lBQ0EsSUFBQSxHQUFPLElBQUksQ0FBQyxhQUFMLENBQUE7WUFDUCxJQUFJLENBQUMsWUFBTCxDQUFrQixJQUFsQjtZQUNBLE1BQUEsQ0FBTyxXQUFXLENBQUMsZ0JBQVosQ0FBNkIsTUFBN0IsQ0FBb0MsQ0FBQyxNQUE1QyxDQUFtRCxDQUFDLElBQXBELENBQXlELENBQXpEO1lBQ0EsSUFBSSxDQUFDLFdBQUwsQ0FBaUIsSUFBakI7bUJBQ0EsTUFBQSxDQUFPLFdBQVcsQ0FBQyxnQkFBWixDQUE2QixNQUE3QixDQUFvQyxDQUFDLE1BQTVDLENBQW1ELENBQUMsSUFBcEQsQ0FBeUQsQ0FBekQ7VUFUNkIsQ0FBL0I7UUFINkIsQ0FBL0IsRUFERjs7SUE3R21ELENBQXJEO0VBNXRDcUIsQ0FBdkI7QUFoRUEiLCJzb3VyY2VzQ29udGVudCI6WyJfID0gcmVxdWlyZSAndW5kZXJzY29yZS1wbHVzJ1xucGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG50ZW1wID0gcmVxdWlyZSAndGVtcCdcblRhYkJhclZpZXcgPSByZXF1aXJlICcuLi9saWIvdGFiLWJhci12aWV3J1xubGF5b3V0ID0gcmVxdWlyZSAnLi4vbGliL2xheW91dCdcbm1haW4gPSByZXF1aXJlICcuLi9saWIvbWFpbidcbnt0cmlnZ2VyTW91c2VFdmVudCwgdHJpZ2dlckNsaWNrRXZlbnQsIGJ1aWxkRHJhZ0V2ZW50cywgYnVpbGRXaGVlbEV2ZW50LCBidWlsZFdoZWVsUGx1c1NoaWZ0RXZlbnR9ID0gcmVxdWlyZSBcIi4vZXZlbnQtaGVscGVyc1wiXG5cbmFkZEl0ZW1Ub1BhbmUgPSAocGFuZSwgaXRlbSwgaW5kZXgpIC0+XG4gICMgU3VwcG9ydCBib3RoIHRoZSAxLjUgYW5kIDEuNiBBUElcbiAgIyBUT0RPOiBSZW1vdmUgb25jZSAxLjYgaXMgc3RhYmxlIFtNS1RdXG4gIGlmIHBhbmUuYWRkSXRlbS5sZW5ndGggaXMgMlxuICAgIHBhbmUuYWRkSXRlbShpdGVtLCBpbmRleDogaW5kZXgpXG4gIGVsc2UgaWYgcGFuZS5hZGRJdGVtLmxlbmd0aCBpcyAzIG9yIHBhbmUuYWRkSXRlbS5sZW5ndGggaXMgNFxuICAgIHBhbmUuYWRkSXRlbShpdGVtLCBpbmRleClcbiAgZWxzZVxuICAgIHRocm93IG5ldyBFcnJvcihcIlVuc3Bvb3J0ZWQgcGFuZS5hZGRJdGVtIEFQSVwiKVxuXG4jIFRPRE86IFJlbW92ZSB0aGlzIGFmdGVyIGF0b20vYXRvbSMxMzk3NyBsYW5kcyBpbiBmYXZvciBvZiB1bmd1YXJkZWQgYGdldENlbnRlcigpYCBjYWxsc1xuZ2V0Q2VudGVyID0gLT4gYXRvbS53b3Jrc3BhY2UuZ2V0Q2VudGVyPygpID8gYXRvbS53b3Jrc3BhY2VcblxuZGVzY3JpYmUgXCJUYWJzIHBhY2thZ2UgbWFpblwiLCAtPlxuICBjZW50ZXJFbGVtZW50ID0gbnVsbFxuXG4gIGJlZm9yZUVhY2ggLT5cbiAgICBjZW50ZXJFbGVtZW50ID0gZ2V0Q2VudGVyKCkucGFuZUNvbnRhaW5lci5nZXRFbGVtZW50KClcblxuICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgYXRvbS53b3Jrc3BhY2Uub3Blbignc2FtcGxlLmpzJylcblxuICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoXCJ0YWJzXCIpXG5cbiAgZGVzY3JpYmUgXCIuYWN0aXZhdGUoKVwiLCAtPlxuICAgIGl0IFwiYXBwZW5kcyBhIHRhYiBiYXIgYWxsIGV4aXN0aW5nIGFuZCBuZXcgcGFuZXNcIiwgLT5cbiAgICAgIGV4cGVjdChjZW50ZXJFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5wYW5lJykubGVuZ3RoKS50b0JlIDFcbiAgICAgIGV4cGVjdChjZW50ZXJFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5wYW5lID4gLnRhYi1iYXInKS5sZW5ndGgpLnRvQmUgMVxuXG4gICAgICBwYW5lID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpXG4gICAgICBwYW5lLnNwbGl0UmlnaHQoKVxuXG4gICAgICBleHBlY3QoY2VudGVyRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucGFuZScpLmxlbmd0aCkudG9CZSAyXG4gICAgICB0YWJCYXJzID0gY2VudGVyRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucGFuZSA+IC50YWItYmFyJylcbiAgICAgIGV4cGVjdCh0YWJCYXJzLmxlbmd0aCkudG9CZSAyXG4gICAgICBleHBlY3QodGFiQmFyc1sxXS5nZXRBdHRyaWJ1dGUoJ2xvY2F0aW9uJykpLnRvQmUoJ2NlbnRlcicpXG5cbiAgZGVzY3JpYmUgXCIuZGVhY3RpdmF0ZSgpXCIsIC0+XG4gICAgaXQgXCJyZW1vdmVzIGFsbCB0YWIgYmFyIHZpZXdzIGFuZCBzdG9wcyBhZGRpbmcgdGhlbSB0byBuZXcgcGFuZXNcIiwgLT5cbiAgICAgIHBhbmUgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKClcbiAgICAgIHBhbmUuc3BsaXRSaWdodCgpXG4gICAgICBleHBlY3QoY2VudGVyRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucGFuZScpLmxlbmd0aCkudG9CZSAyXG4gICAgICBleHBlY3QoY2VudGVyRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucGFuZSA+IC50YWItYmFyJykubGVuZ3RoKS50b0JlIDJcblxuICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgIFByb21pc2UucmVzb2x2ZShhdG9tLnBhY2thZ2VzLmRlYWN0aXZhdGVQYWNrYWdlKCd0YWJzJykpICMgV3JhcHBlZCBzbyB3b3JrcyB3aXRoIFByb21pc2UgJiBub24tUHJvbWlzZSBkZWFjdGl2YXRlXG5cbiAgICAgIHJ1bnMgLT5cbiAgICAgICAgZXhwZWN0KGNlbnRlckVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnBhbmUnKS5sZW5ndGgpLnRvQmUgMlxuICAgICAgICBleHBlY3QoY2VudGVyRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucGFuZSA+IC50YWItYmFyJykubGVuZ3RoKS50b0JlIDBcblxuICAgICAgICBwYW5lLnNwbGl0UmlnaHQoKVxuICAgICAgICBleHBlY3QoY2VudGVyRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucGFuZScpLmxlbmd0aCkudG9CZSAzXG4gICAgICAgIGV4cGVjdChjZW50ZXJFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5wYW5lID4gLnRhYi1iYXInKS5sZW5ndGgpLnRvQmUgMFxuXG5kZXNjcmliZSBcIlRhYkJhclZpZXdcIiwgLT5cbiAgW2Rlc2VyaWFsaXplckRpc3Bvc2FibGUsIGl0ZW0xLCBpdGVtMiwgZWRpdG9yMSwgcGFuZSwgdGFiQmFyXSA9IFtdXG5cbiAgY2xhc3MgVGVzdFZpZXdcbiAgICBAZGVzZXJpYWxpemU6ICh7dGl0bGUsIGxvbmdUaXRsZSwgaWNvbk5hbWV9KSAtPiBuZXcgVGVzdFZpZXcodGl0bGUsIGxvbmdUaXRsZSwgaWNvbk5hbWUpXG4gICAgY29uc3RydWN0b3I6IChAdGl0bGUsIEBsb25nVGl0bGUsIEBpY29uTmFtZSwgQHBhdGhVUkksIGlzUGVybWFuZW50RG9ja0l0ZW0pIC0+XG4gICAgICBAX2lzUGVybWFuZW50RG9ja0l0ZW0gPSBpc1Blcm1hbmVudERvY2tJdGVtXG4gICAgICBAZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgICBAZWxlbWVudC50ZXh0Q29udGVudCA9IEB0aXRsZVxuICAgICAgaWYgaXNQZXJtYW5lbnREb2NrSXRlbT9cbiAgICAgICAgQGlzUGVybWFuZW50RG9ja0l0ZW0gPSAtPiBpc1Blcm1hbmVudERvY2tJdGVtXG4gICAgZ2V0VGl0bGU6IC0+IEB0aXRsZVxuICAgIGdldExvbmdUaXRsZTogLT4gQGxvbmdUaXRsZVxuICAgIGdldFVSSTogLT4gQHBhdGhVUklcbiAgICBnZXRJY29uTmFtZTogLT4gQGljb25OYW1lXG4gICAgc2VyaWFsaXplOiAtPiB7ZGVzZXJpYWxpemVyOiAnVGVzdFZpZXcnLCBAdGl0bGUsIEBsb25nVGl0bGUsIEBpY29uTmFtZX1cbiAgICBjb3B5OiAtPiBuZXcgVGVzdFZpZXcoQHRpdGxlLCBAbG9uZ1RpdGxlLCBAaWNvbk5hbWUpXG4gICAgb25EaWRDaGFuZ2VUaXRsZTogKGNhbGxiYWNrKSAtPlxuICAgICAgQHRpdGxlQ2FsbGJhY2tzID89IFtdXG4gICAgICBAdGl0bGVDYWxsYmFja3MucHVzaChjYWxsYmFjaylcbiAgICAgIGRpc3Bvc2U6ID0+IF8ucmVtb3ZlKEB0aXRsZUNhbGxiYWNrcywgY2FsbGJhY2spXG4gICAgZW1pdFRpdGxlQ2hhbmdlZDogLT5cbiAgICAgIGNhbGxiYWNrKCkgZm9yIGNhbGxiYWNrIGluIEB0aXRsZUNhbGxiYWNrcyA/IFtdXG4gICAgb25EaWRDaGFuZ2VJY29uOiAoY2FsbGJhY2spIC0+XG4gICAgICBAaWNvbkNhbGxiYWNrcyA/PSBbXVxuICAgICAgQGljb25DYWxsYmFja3MucHVzaChjYWxsYmFjaylcbiAgICAgIGRpc3Bvc2U6ID0+IF8ucmVtb3ZlKEBpY29uQ2FsbGJhY2tzLCBjYWxsYmFjaylcbiAgICBlbWl0SWNvbkNoYW5nZWQ6IC0+XG4gICAgICBjYWxsYmFjaygpIGZvciBjYWxsYmFjayBpbiBAaWNvbkNhbGxiYWNrcyA/IFtdXG4gICAgb25EaWRDaGFuZ2VNb2RpZmllZDogLT4gIyB0byBzdXBwcmVzcyBkZXByZWNhdGlvbiB3YXJuaW5nXG4gICAgICBkaXNwb3NlOiAtPlxuXG4gIGJlZm9yZUVhY2ggLT5cbiAgICBkZXNlcmlhbGl6ZXJEaXNwb3NhYmxlID0gYXRvbS5kZXNlcmlhbGl6ZXJzLmFkZChUZXN0VmlldylcbiAgICBpdGVtMSA9IG5ldyBUZXN0VmlldygnSXRlbSAxJywgdW5kZWZpbmVkLCBcInNxdWlycmVsXCIsIFwic2FtcGxlLmpzXCIpXG4gICAgaXRlbTIgPSBuZXcgVGVzdFZpZXcoJ0l0ZW0gMicpXG5cbiAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oJ3NhbXBsZS5qcycpXG5cbiAgICBydW5zIC0+XG4gICAgICBlZGl0b3IxID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICBwYW5lID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpXG4gICAgICBhZGRJdGVtVG9QYW5lKHBhbmUsIGl0ZW0xLCAwKVxuICAgICAgYWRkSXRlbVRvUGFuZShwYW5lLCBpdGVtMiwgMilcbiAgICAgIHBhbmUuYWN0aXZhdGVJdGVtKGl0ZW0yKVxuICAgICAgdGFiQmFyID0gbmV3IFRhYkJhclZpZXcocGFuZSwgJ2NlbnRlcicpXG5cbiAgYWZ0ZXJFYWNoIC0+XG4gICAgZGVzZXJpYWxpemVyRGlzcG9zYWJsZS5kaXNwb3NlKClcblxuICBkZXNjcmliZSBcIndoZW4gdGhlIG1vdXNlIGlzIG1vdmVkIG92ZXIgdGhlIHRhYiBiYXJcIiwgLT5cbiAgICBpdCBcImZpeGVzIHRoZSB3aWR0aCBvbiBldmVyeSB0YWJcIiwgLT5cbiAgICAgIGphc21pbmUuYXR0YWNoVG9ET00odGFiQmFyLmVsZW1lbnQpXG5cbiAgICAgIHRyaWdnZXJNb3VzZUV2ZW50KCdtb3VzZWVudGVyJywgdGFiQmFyLmVsZW1lbnQpXG5cbiAgICAgIGluaXRpYWxXaWR0aDEgPSB0YWJCYXIudGFiQXRJbmRleCgwKS5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoLnRvRml4ZWQoMClcbiAgICAgIGluaXRpYWxXaWR0aDIgPSB0YWJCYXIudGFiQXRJbmRleCgyKS5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoLnRvRml4ZWQoMClcblxuICAgICAgIyBNaW5vciBPUyBkaWZmZXJlbmNlcyBjYXVzZSBmcmFjdGlvbmFsLXBpeGVsIGRpZmZlcmVuY2VzIHNvIGlnbm9yZSBmcmFjdGlvbmFsIHBhcnRcbiAgICAgIGV4cGVjdChwYXJzZUZsb2F0KHRhYkJhci50YWJBdEluZGV4KDApLmVsZW1lbnQuc3R5bGUubWF4V2lkdGgucmVwbGFjZSgncHgnLCAnJykpLnRvRml4ZWQoMCkpLnRvQmUgaW5pdGlhbFdpZHRoMVxuICAgICAgZXhwZWN0KHBhcnNlRmxvYXQodGFiQmFyLnRhYkF0SW5kZXgoMikuZWxlbWVudC5zdHlsZS5tYXhXaWR0aC5yZXBsYWNlKCdweCcsICcnKSkudG9GaXhlZCgwKSkudG9CZSBpbml0aWFsV2lkdGgyXG5cbiAgZGVzY3JpYmUgXCJ3aGVuIHRoZSBtb3VzZSBpcyBtb3ZlZCBhd2F5IGZyb20gdGhlIHRhYiBiYXJcIiwgLT5cbiAgICBpdCBcInJlc2V0cyB0aGUgd2lkdGggb24gZXZlcnkgdGFiXCIsIC0+XG4gICAgICBqYXNtaW5lLmF0dGFjaFRvRE9NKHRhYkJhci5lbGVtZW50KVxuXG4gICAgICB0cmlnZ2VyTW91c2VFdmVudCgnbW91c2VlbnRlcicsIHRhYkJhci5lbGVtZW50KVxuICAgICAgdHJpZ2dlck1vdXNlRXZlbnQoJ21vdXNlbGVhdmUnLCB0YWJCYXIuZWxlbWVudClcblxuICAgICAgZXhwZWN0KHRhYkJhci50YWJBdEluZGV4KDApLmVsZW1lbnQuc3R5bGUubWF4V2lkdGgpLnRvQmUgJydcbiAgICAgIGV4cGVjdCh0YWJCYXIudGFiQXRJbmRleCgxKS5lbGVtZW50LnN0eWxlLm1heFdpZHRoKS50b0JlICcnXG5cbiAgZGVzY3JpYmUgXCIuaW5pdGlhbGl6ZShwYW5lKVwiLCAtPlxuICAgIGl0IFwiY3JlYXRlcyBhIHRhYiBmb3IgZWFjaCBpdGVtIG9uIHRoZSB0YWIgYmFyJ3MgcGFyZW50IHBhbmVcIiwgLT5cbiAgICAgIGV4cGVjdChwYW5lLmdldEl0ZW1zKCkubGVuZ3RoKS50b0JlIDNcbiAgICAgIGV4cGVjdCh0YWJCYXIuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudGFiJykubGVuZ3RoKS50b0JlIDNcblxuICAgICAgZXhwZWN0KHRhYkJhci5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWInKVswXS5xdWVyeVNlbGVjdG9yKCcudGl0bGUnKS50ZXh0Q29udGVudCkudG9CZSBpdGVtMS5nZXRUaXRsZSgpXG4gICAgICBleHBlY3QodGFiQmFyLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRhYicpWzBdLnF1ZXJ5U2VsZWN0b3IoJy50aXRsZScpLmRhdGFzZXQubmFtZSkudG9CZVVuZGVmaW5lZCgpXG4gICAgICBleHBlY3QodGFiQmFyLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRhYicpWzBdLnF1ZXJ5U2VsZWN0b3IoJy50aXRsZScpLmRhdGFzZXQucGF0aCkudG9CZVVuZGVmaW5lZCgpXG4gICAgICBleHBlY3QodGFiQmFyLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRhYicpWzBdLmRhdGFzZXQudHlwZSkudG9CZSgnVGVzdFZpZXcnKVxuXG4gICAgICBleHBlY3QodGFiQmFyLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRhYicpWzFdLnF1ZXJ5U2VsZWN0b3IoJy50aXRsZScpLnRleHRDb250ZW50KS50b0JlIGVkaXRvcjEuZ2V0VGl0bGUoKVxuICAgICAgZXhwZWN0KHRhYkJhci5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWInKVsxXS5xdWVyeVNlbGVjdG9yKCcudGl0bGUnKS5kYXRhc2V0Lm5hbWUpLnRvQmUocGF0aC5iYXNlbmFtZShlZGl0b3IxLmdldFBhdGgoKSkpXG4gICAgICBleHBlY3QodGFiQmFyLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRhYicpWzFdLnF1ZXJ5U2VsZWN0b3IoJy50aXRsZScpLmRhdGFzZXQucGF0aCkudG9CZShlZGl0b3IxLmdldFBhdGgoKSlcbiAgICAgIGV4cGVjdCh0YWJCYXIuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudGFiJylbMV0uZGF0YXNldC50eXBlKS50b0JlKCdUZXh0RWRpdG9yJylcblxuICAgICAgZXhwZWN0KHRhYkJhci5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWInKVsyXS5xdWVyeVNlbGVjdG9yKCcudGl0bGUnKS50ZXh0Q29udGVudCkudG9CZSBpdGVtMi5nZXRUaXRsZSgpXG4gICAgICBleHBlY3QodGFiQmFyLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRhYicpWzJdLnF1ZXJ5U2VsZWN0b3IoJy50aXRsZScpLmRhdGFzZXQubmFtZSkudG9CZVVuZGVmaW5lZCgpXG4gICAgICBleHBlY3QodGFiQmFyLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRhYicpWzJdLnF1ZXJ5U2VsZWN0b3IoJy50aXRsZScpLmRhdGFzZXQucGF0aCkudG9CZVVuZGVmaW5lZCgpXG4gICAgICBleHBlY3QodGFiQmFyLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRhYicpWzBdLmRhdGFzZXQudHlwZSkudG9CZSgnVGVzdFZpZXcnKVxuXG4gICAgaXQgXCJoaWdobGlnaHRzIHRoZSB0YWIgZm9yIHRoZSBhY3RpdmUgcGFuZSBpdGVtXCIsIC0+XG4gICAgICBleHBlY3QodGFiQmFyLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRhYicpWzJdKS50b0hhdmVDbGFzcyAnYWN0aXZlJ1xuXG4gICAgaXQgXCJlbWl0cyBhIHdhcm5pbmcgd2hlbiA6Om9uRGlkLi4uIGZ1bmN0aW9ucyBhcmUgbm90IHZhbGlkIERpc3Bvc2FibGVzXCIsIC0+XG4gICAgICBjbGFzcyBCYWRWaWV3XG4gICAgICAgIGNvbnN0cnVjdG9yOiAtPlxuICAgICAgICAgIEBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICAgICAgZ2V0VGl0bGU6IC0+IFwiQW55dGhpbmdcIlxuICAgICAgICBvbkRpZENoYW5nZVRpdGxlOiAtPlxuICAgICAgICBvbkRpZENoYW5nZUljb246IC0+XG4gICAgICAgIG9uRGlkQ2hhbmdlTW9kaWZpZWQ6IC0+XG4gICAgICAgIG9uRGlkU2F2ZTogLT5cbiAgICAgICAgb25EaWRDaGFuZ2VQYXRoOiAtPlxuXG4gICAgICB3YXJuaW5ncyA9IFtdXG4gICAgICBzcHlPbihjb25zb2xlLCBcIndhcm5cIikuYW5kQ2FsbEZha2UgKG1lc3NhZ2UsIG9iamVjdCkgLT5cbiAgICAgICAgd2FybmluZ3MucHVzaCh7bWVzc2FnZSwgb2JqZWN0fSlcblxuICAgICAgYmFkSXRlbSA9IG5ldyBCYWRWaWV3KCdJdGVtIDMnKVxuICAgICAgcGFuZS5hZGRJdGVtKGJhZEl0ZW0pXG5cbiAgICAgIGV4cGVjdCh3YXJuaW5nc1swXS5tZXNzYWdlKS50b0NvbnRhaW4oXCJvbkRpZENoYW5nZVRpdGxlXCIpXG4gICAgICBleHBlY3Qod2FybmluZ3NbMF0ub2JqZWN0KS50b0JlKGJhZEl0ZW0pXG5cbiAgICAgIGV4cGVjdCh3YXJuaW5nc1sxXS5tZXNzYWdlKS50b0NvbnRhaW4oXCJvbkRpZENoYW5nZVBhdGhcIilcbiAgICAgIGV4cGVjdCh3YXJuaW5nc1sxXS5vYmplY3QpLnRvQmUoYmFkSXRlbSlcblxuICAgICAgZXhwZWN0KHdhcm5pbmdzWzJdLm1lc3NhZ2UpLnRvQ29udGFpbihcIm9uRGlkQ2hhbmdlSWNvblwiKVxuICAgICAgZXhwZWN0KHdhcm5pbmdzWzJdLm9iamVjdCkudG9CZShiYWRJdGVtKVxuXG4gICAgICBleHBlY3Qod2FybmluZ3NbM10ubWVzc2FnZSkudG9Db250YWluKFwib25EaWRDaGFuZ2VNb2RpZmllZFwiKVxuICAgICAgZXhwZWN0KHdhcm5pbmdzWzNdLm9iamVjdCkudG9CZShiYWRJdGVtKVxuXG4gICAgICBleHBlY3Qod2FybmluZ3NbNF0ubWVzc2FnZSkudG9Db250YWluKFwib25EaWRTYXZlXCIpXG4gICAgICBleHBlY3Qod2FybmluZ3NbNF0ub2JqZWN0KS50b0JlKGJhZEl0ZW0pXG5cbiAgZGVzY3JpYmUgXCJ3aGVuIHRoZSBhY3RpdmUgcGFuZSBpdGVtIGNoYW5nZXNcIiwgLT5cbiAgICBpdCBcImhpZ2hsaWdodHMgdGhlIHRhYiBmb3IgdGhlIG5ldyBhY3RpdmUgcGFuZSBpdGVtXCIsIC0+XG4gICAgICBwYW5lLmFjdGl2YXRlSXRlbShpdGVtMSlcbiAgICAgIGV4cGVjdCh0YWJCYXIuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYWN0aXZlJykubGVuZ3RoKS50b0JlIDFcbiAgICAgIGV4cGVjdCh0YWJCYXIuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudGFiJylbMF0pLnRvSGF2ZUNsYXNzICdhY3RpdmUnXG5cbiAgICAgIHBhbmUuYWN0aXZhdGVJdGVtKGl0ZW0yKVxuICAgICAgZXhwZWN0KHRhYkJhci5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5hY3RpdmUnKS5sZW5ndGgpLnRvQmUgMVxuICAgICAgZXhwZWN0KHRhYkJhci5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWInKVsyXSkudG9IYXZlQ2xhc3MgJ2FjdGl2ZSdcblxuICBkZXNjcmliZSBcIndoZW4gYSBuZXcgaXRlbSBpcyBhZGRlZCB0byB0aGUgcGFuZVwiLCAtPlxuICAgIGl0IFwiYWRkcyB0aGUgJ21vZGlmaWVkJyBjbGFzcyB0byB0aGUgbmV3IHRhYiBpZiB0aGUgaXRlbSBpcyBpbml0aWFsbHkgbW9kaWZpZWRcIiwgLT5cbiAgICAgIGVkaXRvcjIgPSBudWxsXG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICBpZiBhdG9tLndvcmtzcGFjZS5jcmVhdGVJdGVtRm9yVVJJP1xuICAgICAgICAgIGF0b20ud29ya3NwYWNlLmNyZWF0ZUl0ZW1Gb3JVUkkoJ3NhbXBsZS50eHQnKS50aGVuIChvKSAtPiBlZGl0b3IyID0gb1xuICAgICAgICBlbHNlXG4gICAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3Blbignc2FtcGxlLnR4dCcsIHthY3RpdmF0ZUl0ZW06IGZhbHNlfSkudGhlbiAobykgLT4gZWRpdG9yMiA9IG9cblxuICAgICAgcnVucyAtPlxuICAgICAgICBlZGl0b3IyLmluc2VydFRleHQoJ3gnKVxuICAgICAgICBwYW5lLmFjdGl2YXRlSXRlbShlZGl0b3IyKVxuICAgICAgICBleHBlY3QodGFiQmFyLnRhYkZvckl0ZW0oZWRpdG9yMikuZWxlbWVudCkudG9IYXZlQ2xhc3MgJ21vZGlmaWVkJ1xuXG4gICAgZGVzY3JpYmUgXCJ3aGVuIGFkZE5ld1RhYnNBdEVuZCBpcyBzZXQgdG8gdHJ1ZSBpbiBwYWNrYWdlIHNldHRpbmdzXCIsIC0+XG4gICAgICBpdCBcImFkZHMgYSB0YWIgZm9yIHRoZSBuZXcgaXRlbSBhdCB0aGUgZW5kIG9mIHRoZSB0YWIgYmFyXCIsIC0+XG4gICAgICAgIGF0b20uY29uZmlnLnNldChcInRhYnMuYWRkTmV3VGFic0F0RW5kXCIsIHRydWUpXG4gICAgICAgIGl0ZW0zID0gbmV3IFRlc3RWaWV3KCdJdGVtIDMnKVxuICAgICAgICBwYW5lLmFjdGl2YXRlSXRlbShpdGVtMylcbiAgICAgICAgZXhwZWN0KHRhYkJhci5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWInKS5sZW5ndGgpLnRvQmUgNFxuICAgICAgICBleHBlY3QodGFiQmFyLnRhYkF0SW5kZXgoMykuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcudGl0bGUnKS50ZXh0Q29udGVudCkudG9NYXRjaCAnSXRlbSAzJ1xuXG4gICAgICBpdCBcInB1dHMgdGhlIG5ldyB0YWIgYXQgdGhlIGxhc3QgaW5kZXggb2YgdGhlIHBhbmUncyBpdGVtc1wiLCAtPlxuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoXCJ0YWJzLmFkZE5ld1RhYnNBdEVuZFwiLCB0cnVlKVxuICAgICAgICBpdGVtMyA9IG5ldyBUZXN0VmlldygnSXRlbSAzJylcbiAgICAgICAgIyBhY3RpdmF0ZSBpdGVtMSBzbyBkZWZhdWx0IGlzIHRvIGFkZCBpbW1lZGlhdGVseSBhZnRlclxuICAgICAgICBwYW5lLmFjdGl2YXRlSXRlbShpdGVtMSlcbiAgICAgICAgcGFuZS5hY3RpdmF0ZUl0ZW0oaXRlbTMpXG4gICAgICAgIGV4cGVjdChwYW5lLmdldEl0ZW1zKClbcGFuZS5nZXRJdGVtcygpLmxlbmd0aCAtIDFdKS50b0VxdWFsIGl0ZW0zXG5cbiAgICBkZXNjcmliZSBcIndoZW4gYWRkTmV3VGFic0F0RW5kIGlzIHNldCB0byBmYWxzZSBpbiBwYWNrYWdlIHNldHRpbmdzXCIsIC0+XG4gICAgICBpdCBcImFkZHMgYSB0YWIgZm9yIHRoZSBuZXcgaXRlbSBhdCB0aGUgc2FtZSBpbmRleCBhcyB0aGUgaXRlbSBpbiB0aGUgcGFuZVwiLCAtPlxuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoXCJ0YWJzLmFkZE5ld1RhYnNBdEVuZFwiLCBmYWxzZSlcbiAgICAgICAgcGFuZS5hY3RpdmF0ZUl0ZW0oaXRlbTEpXG4gICAgICAgIGl0ZW0zID0gbmV3IFRlc3RWaWV3KCdJdGVtIDMnKVxuICAgICAgICBwYW5lLmFjdGl2YXRlSXRlbShpdGVtMylcbiAgICAgICAgZXhwZWN0KHRhYkJhci5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWInKS5sZW5ndGgpLnRvQmUgNFxuICAgICAgICBleHBlY3QodGFiQmFyLnRhYkF0SW5kZXgoMSkuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcudGl0bGUnKS50ZXh0Q29udGVudCkudG9NYXRjaCAnSXRlbSAzJ1xuXG4gIGRlc2NyaWJlIFwid2hlbiBhbiBpdGVtIGlzIHJlbW92ZWQgZnJvbSB0aGUgcGFuZVwiLCAtPlxuICAgIGl0IFwicmVtb3ZlcyB0aGUgaXRlbSdzIHRhYiBmcm9tIHRoZSB0YWIgYmFyXCIsIC0+XG4gICAgICBwYW5lLmRlc3Ryb3lJdGVtKGl0ZW0yKVxuICAgICAgZXhwZWN0KHRhYkJhci5nZXRUYWJzKCkubGVuZ3RoKS50b0JlIDJcbiAgICAgIGV4cGVjdCh0YWJCYXIuZWxlbWVudC50ZXh0Q29udGVudCkubm90LnRvTWF0Y2goJ0l0ZW0gMicpXG5cbiAgICBpdCBcInVwZGF0ZXMgdGhlIHRpdGxlcyBvZiB0aGUgcmVtYWluaW5nIHRhYnNcIiwgLT5cbiAgICAgIGV4cGVjdCh0YWJCYXIudGFiRm9ySXRlbShpdGVtMikuZWxlbWVudC50ZXh0Q29udGVudCkudG9NYXRjaCAnSXRlbSAyJ1xuICAgICAgaXRlbTIubG9uZ1RpdGxlID0gJzInXG4gICAgICBpdGVtMmEgPSBuZXcgVGVzdFZpZXcoJ0l0ZW0gMicpXG4gICAgICBpdGVtMmEubG9uZ1RpdGxlID0gJzJhJ1xuICAgICAgcGFuZS5hY3RpdmF0ZUl0ZW0oaXRlbTJhKVxuICAgICAgZXhwZWN0KHRhYkJhci50YWJGb3JJdGVtKGl0ZW0yKS5lbGVtZW50LnRleHRDb250ZW50KS50b01hdGNoICcyJ1xuICAgICAgZXhwZWN0KHRhYkJhci50YWJGb3JJdGVtKGl0ZW0yYSkuZWxlbWVudC50ZXh0Q29udGVudCkudG9NYXRjaCAnMmEnXG4gICAgICBwYW5lLmRlc3Ryb3lJdGVtKGl0ZW0yYSlcbiAgICAgIGV4cGVjdCh0YWJCYXIudGFiRm9ySXRlbShpdGVtMikuZWxlbWVudC50ZXh0Q29udGVudCkudG9NYXRjaCAnSXRlbSAyJ1xuXG4gIGRlc2NyaWJlIFwid2hlbiBhIHRhYiBpcyBjbGlja2VkXCIsIC0+XG4gICAgaXQgXCJzaG93cyB0aGUgYXNzb2NpYXRlZCBpdGVtIG9uIHRoZSBwYW5lIGFuZCBmb2N1c2VzIHRoZSBwYW5lXCIsIC0+XG4gICAgICBqYXNtaW5lLmF0dGFjaFRvRE9NKHRhYkJhci5lbGVtZW50KSAjIFJlbW92ZSBhZnRlciBBdG9tIDEuMi4wIGlzIHJlbGVhc2VkXG4gICAgICBzcHlPbihwYW5lLCAnYWN0aXZhdGUnKVxuXG4gICAgICB7bW91c2Vkb3duLCBjbGlja30gPSB0cmlnZ2VyQ2xpY2tFdmVudCh0YWJCYXIudGFiQXRJbmRleCgwKS5lbGVtZW50LCB3aGljaDogMSlcbiAgICAgIGV4cGVjdChwYW5lLmdldEFjdGl2ZUl0ZW0oKSkudG9CZShwYW5lLmdldEl0ZW1zKClbMF0pXG4gICAgICAjIGFsbG93cyBkcmFnZ2luZ1xuICAgICAgZXhwZWN0KG1vdXNlZG93bi5wcmV2ZW50RGVmYXVsdCkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgZXhwZWN0KGNsaWNrLnByZXZlbnREZWZhdWx0KS50b0hhdmVCZWVuQ2FsbGVkKClcblxuICAgICAge21vdXNlZG93biwgY2xpY2t9ID0gdHJpZ2dlckNsaWNrRXZlbnQodGFiQmFyLnRhYkF0SW5kZXgoMikuZWxlbWVudCwgd2hpY2g6IDEpXG4gICAgICBleHBlY3QocGFuZS5nZXRBY3RpdmVJdGVtKCkpLnRvQmUocGFuZS5nZXRJdGVtcygpWzJdKVxuICAgICAgIyBhbGxvd3MgZHJhZ2dpbmdcbiAgICAgIGV4cGVjdChtb3VzZWRvd24ucHJldmVudERlZmF1bHQpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIGV4cGVjdChjbGljay5wcmV2ZW50RGVmYXVsdCkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICBleHBlY3QocGFuZS5hY3RpdmF0ZS5jYWxsQ291bnQpLnRvQmUgMlxuXG4gICAgaXQgXCJjbG9zZXMgdGhlIHRhYiB3aGVuIG1pZGRsZSBjbGlja2VkXCIsIC0+XG4gICAgICBqYXNtaW5lLmF0dGFjaFRvRE9NKHRhYkJhci5lbGVtZW50KSAjIFJlbW92ZSBhZnRlciBBdG9tIDEuMi4wIGlzIHJlbGVhc2VkXG5cbiAgICAgIHtjbGlja30gPSB0cmlnZ2VyQ2xpY2tFdmVudCh0YWJCYXIudGFiRm9ySXRlbShlZGl0b3IxKS5lbGVtZW50LCB3aGljaDogMilcblxuICAgICAgZXhwZWN0KHBhbmUuZ2V0SXRlbXMoKS5sZW5ndGgpLnRvQmUgMlxuICAgICAgZXhwZWN0KHBhbmUuZ2V0SXRlbXMoKS5pbmRleE9mKGVkaXRvcjEpKS50b0JlIC0xXG4gICAgICBleHBlY3QoZWRpdG9yMS5kZXN0cm95ZWQpLnRvQmVUcnV0aHkoKVxuICAgICAgZXhwZWN0KHRhYkJhci5nZXRUYWJzKCkubGVuZ3RoKS50b0JlIDJcbiAgICAgIGV4cGVjdCh0YWJCYXIuZWxlbWVudC50ZXh0Q29udGVudCkubm90LnRvTWF0Y2goJ3NhbXBsZS5qcycpXG5cbiAgICAgIGV4cGVjdChjbGljay5wcmV2ZW50RGVmYXVsdCkudG9IYXZlQmVlbkNhbGxlZCgpXG5cbiAgICBpdCBcImRvZXNuJ3Qgc3dpdGNoIHRhYiB3aGVuIHJpZ2h0IChvciBjdHJsLWxlZnQpIGNsaWNrZWRcIiwgLT5cbiAgICAgIGphc21pbmUuYXR0YWNoVG9ET00odGFiQmFyLmVsZW1lbnQpICMgUmVtb3ZlIGFmdGVyIEF0b20gMS4yLjAgaXMgcmVsZWFzZWRcblxuICAgICAgc3B5T24ocGFuZSwgJ2FjdGl2YXRlJylcblxuICAgICAge21vdXNlZG93bn0gPSB0cmlnZ2VyQ2xpY2tFdmVudCh0YWJCYXIudGFiQXRJbmRleCgwKS5lbGVtZW50LCB3aGljaDogMylcbiAgICAgIGV4cGVjdChwYW5lLmdldEFjdGl2ZUl0ZW0oKSkubm90LnRvQmUgcGFuZS5nZXRJdGVtcygpWzBdXG4gICAgICBleHBlY3QobW91c2Vkb3duLnByZXZlbnREZWZhdWx0KS50b0hhdmVCZWVuQ2FsbGVkKClcblxuICAgICAge21vdXNlZG93bn0gPSB0cmlnZ2VyQ2xpY2tFdmVudCh0YWJCYXIudGFiQXRJbmRleCgwKS5lbGVtZW50LCB3aGljaDogMSwgY3RybEtleTogdHJ1ZSlcbiAgICAgIGV4cGVjdChwYW5lLmdldEFjdGl2ZUl0ZW0oKSkubm90LnRvQmUgcGFuZS5nZXRJdGVtcygpWzBdXG4gICAgICBleHBlY3QobW91c2Vkb3duLnByZXZlbnREZWZhdWx0KS50b0hhdmVCZWVuQ2FsbGVkKClcblxuICAgICAgZXhwZWN0KHBhbmUuYWN0aXZhdGUpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcblxuICBkZXNjcmliZSBcIndoZW4gYSB0YWIncyBjbG9zZSBpY29uIGlzIGNsaWNrZWRcIiwgLT5cbiAgICBpdCBcImRlc3Ryb3lzIHRoZSB0YWIncyBpdGVtIG9uIHRoZSBwYW5lXCIsIC0+XG4gICAgICBqYXNtaW5lLmF0dGFjaFRvRE9NKHRhYkJhci5lbGVtZW50KSAjIFJlbW92ZSBhZnRlciBBdG9tIDEuMi4wIGlzIHJlbGVhc2VkXG5cbiAgICAgIHRhYkJhci50YWJGb3JJdGVtKGVkaXRvcjEpLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLmNsb3NlLWljb24nKS5jbGljaygpXG4gICAgICBleHBlY3QocGFuZS5nZXRJdGVtcygpLmxlbmd0aCkudG9CZSAyXG4gICAgICBleHBlY3QocGFuZS5nZXRJdGVtcygpLmluZGV4T2YoZWRpdG9yMSkpLnRvQmUgLTFcbiAgICAgIGV4cGVjdChlZGl0b3IxLmRlc3Ryb3llZCkudG9CZVRydXRoeSgpXG4gICAgICBleHBlY3QodGFiQmFyLmdldFRhYnMoKS5sZW5ndGgpLnRvQmUgMlxuICAgICAgZXhwZWN0KHRhYkJhci5lbGVtZW50LnRleHRDb250ZW50KS5ub3QudG9NYXRjaCgnc2FtcGxlLmpzJylcblxuICBkZXNjcmliZSBcIndoZW4gYW4gaXRlbSBpcyBhY3RpdmF0ZWRcIiwgLT5cbiAgICBbaXRlbTNdID0gW11cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBpdGVtMyA9IG5ldyBUZXN0VmlldyhcIkl0ZW0gM1wiKVxuICAgICAgcGFuZS5hY3RpdmF0ZUl0ZW0oaXRlbTMpXG5cbiAgICAgICMgU2V0IHVwIHN0eWxlcyBzbyB0aGUgdGFiIGJhciBoYXMgYSBzY3JvbGxiYXJcbiAgICAgIHRhYkJhci5lbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnZmxleCdcbiAgICAgIHRhYkJhci5lbGVtZW50LnN0eWxlLm92ZXJmbG93WCA9ICdzY3JvbGwnXG4gICAgICB0YWJCYXIuZWxlbWVudC5zdHlsZS5tYXJnaW4gPSAnMCdcblxuICAgICAgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICAgIGNvbnRhaW5lci5zdHlsZS53aWR0aCA9ICcxNTBweCdcbiAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0YWJCYXIuZWxlbWVudClcbiAgICAgIGphc21pbmUuYXR0YWNoVG9ET00oY29udGFpbmVyKVxuXG4gICAgICAjIEV4cGVjdCB0aGVyZSB0byBiZSBjb250ZW50IHRvIHNjcm9sbFxuICAgICAgZXhwZWN0KHRhYkJhci5lbGVtZW50LnNjcm9sbFdpZHRoKS50b0JlR3JlYXRlclRoYW4gdGFiQmFyLmVsZW1lbnQuY2xpZW50V2lkdGhcblxuICAgIGl0IFwiZG9lcyBub3Qgc2Nyb2xsIHRvIHRoZSBpdGVtIHdoZW4gaXQgaXMgdmlzaWJsZVwiLCAtPlxuICAgICAgcGFuZS5hY3RpdmF0ZUl0ZW0oaXRlbTEpXG4gICAgICBleHBlY3QodGFiQmFyLmVsZW1lbnQuc2Nyb2xsTGVmdCkudG9CZSAwXG5cbiAgICAgIHBhbmUuYWN0aXZhdGVJdGVtKGVkaXRvcjEpXG4gICAgICBleHBlY3QodGFiQmFyLmVsZW1lbnQuc2Nyb2xsTGVmdCkudG9CZSAwXG5cbiAgICAgIHBhbmUuYWN0aXZhdGVJdGVtKGl0ZW0yKVxuICAgICAgZXhwZWN0KHRhYkJhci5lbGVtZW50LnNjcm9sbExlZnQpLnRvQmUgMFxuXG4gICAgICBwYW5lLmFjdGl2YXRlSXRlbShpdGVtMylcbiAgICAgIGV4cGVjdCh0YWJCYXIuZWxlbWVudC5zY3JvbGxMZWZ0KS5ub3QudG9CZSAwXG5cbiAgICBpdCBcInNjcm9sbHMgdG8gdGhlIGl0ZW0gd2hlbiBpdCBpc24ndCBjb21wbGV0ZWx5IHZpc2libGVcIiwgLT5cbiAgICAgIHRhYkJhci5lbGVtZW50LnNjcm9sbExlZnQgPSA1XG4gICAgICBleHBlY3QodGFiQmFyLmVsZW1lbnQuc2Nyb2xsTGVmdCkudG9CZSA1ICMgVGhpcyBjYW4gYmUgMCBpZiB0aGVyZSBpcyBubyBob3Jpem9udGFsIHNjcm9sbGJhclxuXG4gICAgICBwYW5lLmFjdGl2YXRlSXRlbShpdGVtMSlcbiAgICAgIGV4cGVjdCh0YWJCYXIuZWxlbWVudC5zY3JvbGxMZWZ0KS50b0JlIDBcblxuICAgICAgcGFuZS5hY3RpdmF0ZUl0ZW0oaXRlbTMpXG4gICAgICBleHBlY3QodGFiQmFyLmVsZW1lbnQuc2Nyb2xsTGVmdCkudG9CZSB0YWJCYXIuZWxlbWVudC5zY3JvbGxXaWR0aCAtIHRhYkJhci5lbGVtZW50LmNsaWVudFdpZHRoXG5cbiAgZGVzY3JpYmUgXCJ3aGVuIGEgdGFiIGl0ZW0ncyB0aXRsZSBjaGFuZ2VzXCIsIC0+XG4gICAgaXQgXCJ1cGRhdGVzIHRoZSB0aXRsZSBvZiB0aGUgaXRlbSdzIHRhYlwiLCAtPlxuICAgICAgZWRpdG9yMS5idWZmZXIuc2V0UGF0aCgnL3RoaXMvaXMtYS90ZXN0LnR4dCcpXG4gICAgICBleHBlY3QodGFiQmFyLnRhYkZvckl0ZW0oZWRpdG9yMSkuZWxlbWVudC50ZXh0Q29udGVudCkudG9NYXRjaCAndGVzdC50eHQnXG5cbiAgZGVzY3JpYmUgXCJ3aGVuIHR3byB0YWJzIGhhdmUgdGhlIHNhbWUgdGl0bGVcIiwgLT5cbiAgICBpdCBcImRpc3BsYXlzIHRoZSBsb25nIHRpdGxlIG9uIHRoZSB0YWIgaWYgaXQncyBhdmFpbGFibGUgZnJvbSB0aGUgaXRlbVwiLCAtPlxuICAgICAgaXRlbTEudGl0bGUgPSBcIk9sZCBNYW5cIlxuICAgICAgaXRlbTEubG9uZ1RpdGxlID0gXCJHcnVtcHkgT2xkIE1hblwiXG4gICAgICBpdGVtMS5lbWl0VGl0bGVDaGFuZ2VkKClcbiAgICAgIGl0ZW0yLnRpdGxlID0gXCJPbGQgTWFuXCJcbiAgICAgIGl0ZW0yLmxvbmdUaXRsZSA9IFwiSm9sbHkgT2xkIE1hblwiXG4gICAgICBpdGVtMi5lbWl0VGl0bGVDaGFuZ2VkKClcblxuICAgICAgZXhwZWN0KHRhYkJhci50YWJGb3JJdGVtKGl0ZW0xKS5lbGVtZW50LnRleHRDb250ZW50KS50b01hdGNoIFwiR3J1bXB5IE9sZCBNYW5cIlxuICAgICAgZXhwZWN0KHRhYkJhci50YWJGb3JJdGVtKGl0ZW0yKS5lbGVtZW50LnRleHRDb250ZW50KS50b01hdGNoIFwiSm9sbHkgT2xkIE1hblwiXG5cbiAgICAgIGl0ZW0yLmxvbmdUaXRsZSA9IHVuZGVmaW5lZFxuICAgICAgaXRlbTIuZW1pdFRpdGxlQ2hhbmdlZCgpXG5cbiAgICAgIGV4cGVjdCh0YWJCYXIudGFiRm9ySXRlbShpdGVtMSkuZWxlbWVudC50ZXh0Q29udGVudCkudG9NYXRjaCBcIkdydW1weSBPbGQgTWFuXCJcbiAgICAgIGV4cGVjdCh0YWJCYXIudGFiRm9ySXRlbShpdGVtMikuZWxlbWVudC50ZXh0Q29udGVudCkudG9NYXRjaCBcIk9sZCBNYW5cIlxuXG4gIGRlc2NyaWJlIFwidGhlIGNsb3NlIGJ1dHRvblwiLCAtPlxuICAgIGl0IFwiaXMgcHJlc2VudCBpbiB0aGUgY2VudGVyLCByZWdhcmRsZXNzIG9mIHRoZSB2YWx1ZSByZXR1cm5lZCBieSBpc1Blcm1hbmVudERvY2tJdGVtKClcIiwgLT5cbiAgICAgIGl0ZW0zID0gbmV3IFRlc3RWaWV3KCdJdGVtIDMnLCB1bmRlZmluZWQsIFwic3F1aXJyZWxcIiwgXCJzYW1wbGUuanNcIilcbiAgICAgIGV4cGVjdChpdGVtMy5pc1Blcm1hbmVudERvY2tJdGVtKS50b0JlVW5kZWZpbmVkKClcbiAgICAgIGl0ZW00ID0gbmV3IFRlc3RWaWV3KCdJdGVtIDQnLCB1bmRlZmluZWQsIFwic3F1aXJyZWxcIiwgXCJzYW1wbGUuanNcIiwgdHJ1ZSlcbiAgICAgIGV4cGVjdCh0eXBlb2YgaXRlbTQuaXNQZXJtYW5lbnREb2NrSXRlbSkudG9CZSgnZnVuY3Rpb24nKVxuICAgICAgaXRlbTUgPSBuZXcgVGVzdFZpZXcoJ0l0ZW0gNScsIHVuZGVmaW5lZCwgXCJzcXVpcnJlbFwiLCBcInNhbXBsZS5qc1wiLCBmYWxzZSlcbiAgICAgIGV4cGVjdCh0eXBlb2YgaXRlbTUuaXNQZXJtYW5lbnREb2NrSXRlbSkudG9CZSgnZnVuY3Rpb24nKVxuICAgICAgcGFuZS5hY3RpdmF0ZUl0ZW0oaXRlbTMpXG4gICAgICBwYW5lLmFjdGl2YXRlSXRlbShpdGVtNClcbiAgICAgIHBhbmUuYWN0aXZhdGVJdGVtKGl0ZW01KVxuICAgICAgdGFicyA9IHRhYkJhci5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWInKVxuICAgICAgZXhwZWN0KHRhYnNbMl0ucXVlcnlTZWxlY3RvcignLmNsb3NlLWljb24nKSkubm90LnRvRXF1YWwobnVsbClcbiAgICAgIGV4cGVjdCh0YWJzWzNdLnF1ZXJ5U2VsZWN0b3IoJy5jbG9zZS1pY29uJykpLm5vdC50b0VxdWFsKG51bGwpXG4gICAgICBleHBlY3QodGFic1s0XS5xdWVyeVNlbGVjdG9yKCcuY2xvc2UtaWNvbicpKS5ub3QudG9FcXVhbChudWxsKVxuXG4gICAgcmV0dXJuIHVubGVzcyBhdG9tLndvcmtzcGFjZS5nZXRSaWdodERvY2s/XG4gICAgZGVzY3JpYmUgXCJpbiBkb2Nrc1wiLCAtPlxuICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICBwYW5lID0gYXRvbS53b3Jrc3BhY2UuZ2V0UmlnaHREb2NrKCkuZ2V0QWN0aXZlUGFuZSgpXG4gICAgICAgIHRhYkJhciA9IG5ldyBUYWJCYXJWaWV3KHBhbmUsICdyaWdodCcpXG5cbiAgICAgIGl0IFwiaXNuJ3Qgc2hvd24gaWYgdGhlIG1ldGhvZCByZXR1cm5zIHRydWVcIiwgLT5cbiAgICAgICAgaXRlbTEgPSBuZXcgVGVzdFZpZXcoJ0l0ZW0gMScsIHVuZGVmaW5lZCwgXCJzcXVpcnJlbFwiLCBcInNhbXBsZS5qc1wiLCB0cnVlKVxuICAgICAgICBleHBlY3QodHlwZW9mIGl0ZW0xLmlzUGVybWFuZW50RG9ja0l0ZW0pLnRvQmUoJ2Z1bmN0aW9uJylcbiAgICAgICAgcGFuZS5hY3RpdmF0ZUl0ZW0oaXRlbTEpXG4gICAgICAgIHRhYiA9IHRhYkJhci5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy50YWInKVxuICAgICAgICBleHBlY3QodGFiLnF1ZXJ5U2VsZWN0b3IoJy5jbG9zZS1pY29uJykpLnRvRXF1YWwobnVsbClcblxuICAgICAgaXQgXCJpcyBzaG93biBpZiB0aGUgbWV0aG9kIHJldHVybnMgZmFsc2VcIiwgLT5cbiAgICAgICAgaXRlbTEgPSBuZXcgVGVzdFZpZXcoJ0l0ZW0gMScsIHVuZGVmaW5lZCwgXCJzcXVpcnJlbFwiLCBcInNhbXBsZS5qc1wiLCBmYWxzZSlcbiAgICAgICAgZXhwZWN0KHR5cGVvZiBpdGVtMS5pc1Blcm1hbmVudERvY2tJdGVtKS50b0JlKCdmdW5jdGlvbicpXG4gICAgICAgIHBhbmUuYWN0aXZhdGVJdGVtKGl0ZW0xKVxuICAgICAgICB0YWIgPSB0YWJCYXIuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcudGFiJylcbiAgICAgICAgZXhwZWN0KHRhYi5xdWVyeVNlbGVjdG9yKCcuY2xvc2UtaWNvbicpKS5ub3QudG9CZVVuZGVmaW5lZCgpXG5cbiAgICAgIGl0IFwiaXMgc2hvd24gaWYgdGhlIG1ldGhvZCBkb2Vzbid0IGV4aXN0XCIsIC0+XG4gICAgICAgIGl0ZW0xID0gbmV3IFRlc3RWaWV3KCdJdGVtIDEnLCB1bmRlZmluZWQsIFwic3F1aXJyZWxcIiwgXCJzYW1wbGUuanNcIilcbiAgICAgICAgZXhwZWN0KGl0ZW0xLmlzUGVybWFuZW50RG9ja0l0ZW0pLnRvQmVVbmRlZmluZWQoKVxuICAgICAgICBwYW5lLmFjdGl2YXRlSXRlbShpdGVtMSlcbiAgICAgICAgdGFiID0gdGFiQmFyLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLnRhYicpXG4gICAgICAgIGV4cGVjdCh0YWIucXVlcnlTZWxlY3RvcignLmNsb3NlLWljb24nKSkubm90LnRvRXF1YWwobnVsbClcblxuICBkZXNjcmliZSBcIndoZW4gYW4gaXRlbSBoYXMgYW4gaWNvbiBkZWZpbmVkXCIsIC0+XG4gICAgaXQgXCJkaXNwbGF5cyB0aGUgaWNvbiBvbiB0aGUgdGFiXCIsIC0+XG4gICAgICBleHBlY3QodGFiQmFyLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRhYicpWzBdLnF1ZXJ5U2VsZWN0b3IoJy50aXRsZScpKS50b0hhdmVDbGFzcyBcImljb25cIlxuICAgICAgZXhwZWN0KHRhYkJhci5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWInKVswXS5xdWVyeVNlbGVjdG9yKCcudGl0bGUnKSkudG9IYXZlQ2xhc3MgXCJpY29uLXNxdWlycmVsXCJcblxuICAgIGl0IFwiaGlkZXMgdGhlIGljb24gZnJvbSB0aGUgdGFiIGlmIHRoZSBpY29uIGlzIHJlbW92ZWRcIiwgLT5cbiAgICAgIGl0ZW0xLmdldEljb25OYW1lID0gbnVsbFxuICAgICAgaXRlbTEuZW1pdEljb25DaGFuZ2VkKClcbiAgICAgIGV4cGVjdCh0YWJCYXIuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudGFiJylbMF0ucXVlcnlTZWxlY3RvcignLnRpdGxlJykpLm5vdC50b0hhdmVDbGFzcyBcImljb25cIlxuICAgICAgZXhwZWN0KHRhYkJhci5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWInKVswXS5xdWVyeVNlbGVjdG9yKCcudGl0bGUnKSkubm90LnRvSGF2ZUNsYXNzIFwiaWNvbi1zcXVpcnJlbFwiXG5cbiAgICBpdCBcInVwZGF0ZXMgdGhlIGljb24gb24gdGhlIHRhYiBpZiB0aGUgaWNvbiBpcyBjaGFuZ2VkXCIsIC0+XG4gICAgICBpdGVtMS5nZXRJY29uTmFtZSA9IC0+IFwiemFwXCJcbiAgICAgIGl0ZW0xLmVtaXRJY29uQ2hhbmdlZCgpXG4gICAgICBleHBlY3QodGFiQmFyLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRhYicpWzBdLnF1ZXJ5U2VsZWN0b3IoJy50aXRsZScpKS50b0hhdmVDbGFzcyBcImljb25cIlxuICAgICAgZXhwZWN0KHRhYkJhci5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWInKVswXS5xdWVyeVNlbGVjdG9yKCcudGl0bGUnKSkudG9IYXZlQ2xhc3MgXCJpY29uLXphcFwiXG5cbiAgICBkZXNjcmliZSBcIndoZW4gc2hvd0ljb24gaXMgc2V0IHRvIHRydWUgaW4gcGFja2FnZSBzZXR0aW5nc1wiLCAtPlxuICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICBzcHlPbih0YWJCYXIudGFiRm9ySXRlbShpdGVtMSksICd1cGRhdGVJY29uVmlzaWJpbGl0eScpLmFuZENhbGxUaHJvdWdoKClcblxuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoXCJ0YWJzLnNob3dJY29uc1wiLCB0cnVlKVxuXG4gICAgICAgIHdhaXRzRm9yIC0+XG4gICAgICAgICAgdGFiQmFyLnRhYkZvckl0ZW0oaXRlbTEpLnVwZGF0ZUljb25WaXNpYmlsaXR5LmNhbGxDb3VudCA+IDBcblxuICAgICAgICBydW5zIC0+XG4gICAgICAgICAgdGFiQmFyLnRhYkZvckl0ZW0oaXRlbTEpLnVwZGF0ZUljb25WaXNpYmlsaXR5LnJlc2V0KClcblxuICAgICAgaXQgXCJkb2Vzbid0IGhpZGUgdGhlIGljb25cIiwgLT5cbiAgICAgICAgZXhwZWN0KHRhYkJhci5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWInKVswXS5xdWVyeVNlbGVjdG9yKCcudGl0bGUnKSkubm90LnRvSGF2ZUNsYXNzIFwiaGlkZS1pY29uXCJcblxuICAgICAgaXQgXCJoaWRlcyB0aGUgaWNvbiBmcm9tIHRoZSB0YWIgd2hlbiBzaG93SWNvbiBpcyBjaGFuZ2VkIHRvIGZhbHNlXCIsIC0+XG4gICAgICAgIGF0b20uY29uZmlnLnNldChcInRhYnMuc2hvd0ljb25zXCIsIGZhbHNlKVxuXG4gICAgICAgIHdhaXRzRm9yIC0+XG4gICAgICAgICAgdGFiQmFyLnRhYkZvckl0ZW0oaXRlbTEpLnVwZGF0ZUljb25WaXNpYmlsaXR5LmNhbGxDb3VudCA+IDBcblxuICAgICAgICBydW5zIC0+XG4gICAgICAgICAgZXhwZWN0KHRhYkJhci5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWInKVswXS5xdWVyeVNlbGVjdG9yKCcudGl0bGUnKSkudG9IYXZlQ2xhc3MgXCJoaWRlLWljb25cIlxuXG4gICAgZGVzY3JpYmUgXCJ3aGVuIHNob3dJY29uIGlzIHNldCB0byBmYWxzZSBpbiBwYWNrYWdlIHNldHRpbmdzXCIsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIHNweU9uKHRhYkJhci50YWJGb3JJdGVtKGl0ZW0xKSwgJ3VwZGF0ZUljb25WaXNpYmlsaXR5JykuYW5kQ2FsbFRocm91Z2goKVxuXG4gICAgICAgIGF0b20uY29uZmlnLnNldChcInRhYnMuc2hvd0ljb25zXCIsIGZhbHNlKVxuXG4gICAgICAgIHdhaXRzRm9yIC0+XG4gICAgICAgICAgdGFiQmFyLnRhYkZvckl0ZW0oaXRlbTEpLnVwZGF0ZUljb25WaXNpYmlsaXR5LmNhbGxDb3VudCA+IDBcblxuICAgICAgICBydW5zIC0+XG4gICAgICAgICAgdGFiQmFyLnRhYkZvckl0ZW0oaXRlbTEpLnVwZGF0ZUljb25WaXNpYmlsaXR5LnJlc2V0KClcblxuICAgICAgaXQgXCJoaWRlcyB0aGUgaWNvblwiLCAtPlxuICAgICAgICBleHBlY3QodGFiQmFyLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRhYicpWzBdLnF1ZXJ5U2VsZWN0b3IoJy50aXRsZScpKS50b0hhdmVDbGFzcyBcImhpZGUtaWNvblwiXG5cbiAgICAgIGl0IFwic2hvd3MgdGhlIGljb24gb24gdGhlIHRhYiB3aGVuIHNob3dJY29uIGlzIGNoYW5nZWQgdG8gdHJ1ZVwiLCAtPlxuICAgICAgICBhdG9tLmNvbmZpZy5zZXQoXCJ0YWJzLnNob3dJY29uc1wiLCB0cnVlKVxuXG4gICAgICAgIHdhaXRzRm9yIC0+XG4gICAgICAgICAgdGFiQmFyLnRhYkZvckl0ZW0oaXRlbTEpLnVwZGF0ZUljb25WaXNpYmlsaXR5LmNhbGxDb3VudCA+IDBcblxuICAgICAgICBleHBlY3QodGFiQmFyLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRhYicpWzBdLnF1ZXJ5U2VsZWN0b3IoJy50aXRsZScpKS5ub3QudG9IYXZlQ2xhc3MgXCJoaWRlLWljb25cIlxuXG4gIGRlc2NyaWJlIFwid2hlbiB0aGUgaXRlbSBkb2Vzbid0IGhhdmUgYW4gaWNvbiBkZWZpbmVkXCIsIC0+XG4gICAgaXQgXCJkb2Vzbid0IGRpc3BsYXkgYW4gaWNvbiBvbiB0aGUgdGFiXCIsIC0+XG4gICAgICBleHBlY3QodGFiQmFyLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRhYicpWzJdLnF1ZXJ5U2VsZWN0b3IoJy50aXRsZScpKS5ub3QudG9IYXZlQ2xhc3MgXCJpY29uXCJcbiAgICAgIGV4cGVjdCh0YWJCYXIuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudGFiJylbMl0ucXVlcnlTZWxlY3RvcignLnRpdGxlJykpLm5vdC50b0hhdmVDbGFzcyBcImljb24tc3F1aXJyZWxcIlxuXG4gICAgaXQgXCJzaG93cyB0aGUgaWNvbiBvbiB0aGUgdGFiIGlmIGFuIGljb24gaXMgZGVmaW5lZFwiLCAtPlxuICAgICAgaXRlbTIuZ2V0SWNvbk5hbWUgPSAtPiBcInNxdWlycmVsXCJcbiAgICAgIGl0ZW0yLmVtaXRJY29uQ2hhbmdlZCgpXG4gICAgICBleHBlY3QodGFiQmFyLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRhYicpWzJdLnF1ZXJ5U2VsZWN0b3IoJy50aXRsZScpKS50b0hhdmVDbGFzcyBcImljb25cIlxuICAgICAgZXhwZWN0KHRhYkJhci5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWInKVsyXS5xdWVyeVNlbGVjdG9yKCcudGl0bGUnKSkudG9IYXZlQ2xhc3MgXCJpY29uLXNxdWlycmVsXCJcblxuICBkZXNjcmliZSBcIndoZW4gYSB0YWIgaXRlbSdzIG1vZGlmaWVkIHN0YXR1cyBjaGFuZ2VzXCIsIC0+XG4gICAgaXQgXCJhZGRzIG9yIHJlbW92ZXMgdGhlICdtb2RpZmllZCcgY2xhc3MgdG8gdGhlIHRhYiBiYXNlZCBvbiB0aGUgc3RhdHVzXCIsIC0+XG4gICAgICB0YWIgPSB0YWJCYXIudGFiRm9ySXRlbShlZGl0b3IxKVxuICAgICAgZXhwZWN0KGVkaXRvcjEuaXNNb2RpZmllZCgpKS50b0JlRmFsc3koKVxuICAgICAgZXhwZWN0KHRhYi5lbGVtZW50KS5ub3QudG9IYXZlQ2xhc3MgJ21vZGlmaWVkJ1xuXG4gICAgICBlZGl0b3IxLmluc2VydFRleHQoJ3gnKVxuICAgICAgYWR2YW5jZUNsb2NrKGVkaXRvcjEuYnVmZmVyLnN0b3BwZWRDaGFuZ2luZ0RlbGF5KVxuICAgICAgZXhwZWN0KGVkaXRvcjEuaXNNb2RpZmllZCgpKS50b0JlVHJ1dGh5KClcbiAgICAgIGV4cGVjdCh0YWIuZWxlbWVudCkudG9IYXZlQ2xhc3MgJ21vZGlmaWVkJ1xuXG4gICAgICBlZGl0b3IxLnVuZG8oKVxuICAgICAgYWR2YW5jZUNsb2NrKGVkaXRvcjEuYnVmZmVyLnN0b3BwZWRDaGFuZ2luZ0RlbGF5KVxuICAgICAgZXhwZWN0KGVkaXRvcjEuaXNNb2RpZmllZCgpKS50b0JlRmFsc3koKVxuICAgICAgZXhwZWN0KHRhYi5lbGVtZW50KS5ub3QudG9IYXZlQ2xhc3MgJ21vZGlmaWVkJ1xuXG4gIGRlc2NyaWJlIFwid2hlbiBhIHBhbmUgaXRlbSBtb3ZlcyB0byBhIG5ldyBpbmRleFwiLCAtPlxuICAgICMgYmVoYXZpb3IgaXMgaW5kZXBlbmRlbnQgb2YgYWRkTmV3VGFicyBjb25maWdcbiAgICBkZXNjcmliZSBcIndoZW4gYWRkTmV3VGFic0F0RW5kIGlzIHNldCB0byB0cnVlIGluIHBhY2thZ2Ugc2V0dGluZ3NcIiwgLT5cbiAgICAgIGl0IFwidXBkYXRlcyB0aGUgb3JkZXIgb2YgdGhlIHRhYnMgdG8gbWF0Y2ggdGhlIG5ldyBpdGVtIG9yZGVyXCIsIC0+XG4gICAgICAgIGF0b20uY29uZmlnLnNldChcInRhYnMuYWRkTmV3VGFic0F0RW5kXCIsIHRydWUpXG4gICAgICAgIGV4cGVjdCh0YWJCYXIuZ2V0VGFicygpLm1hcCAodGFiKSAtPiB0YWIuZWxlbWVudC50ZXh0Q29udGVudCkudG9FcXVhbCBbXCJJdGVtIDFcIiwgXCJzYW1wbGUuanNcIiwgXCJJdGVtIDJcIl1cbiAgICAgICAgcGFuZS5tb3ZlSXRlbShpdGVtMiwgMSlcbiAgICAgICAgZXhwZWN0KHRhYkJhci5nZXRUYWJzKCkubWFwICh0YWIpIC0+IHRhYi5lbGVtZW50LnRleHRDb250ZW50KS50b0VxdWFsIFtcIkl0ZW0gMVwiLCBcIkl0ZW0gMlwiLCBcInNhbXBsZS5qc1wiXVxuICAgICAgICBwYW5lLm1vdmVJdGVtKGVkaXRvcjEsIDApXG4gICAgICAgIGV4cGVjdCh0YWJCYXIuZ2V0VGFicygpLm1hcCAodGFiKSAtPiB0YWIuZWxlbWVudC50ZXh0Q29udGVudCkudG9FcXVhbCBbXCJzYW1wbGUuanNcIiwgXCJJdGVtIDFcIiwgXCJJdGVtIDJcIl1cbiAgICAgICAgcGFuZS5tb3ZlSXRlbShpdGVtMSwgMilcbiAgICAgICAgZXhwZWN0KHRhYkJhci5nZXRUYWJzKCkubWFwICh0YWIpIC0+IHRhYi5lbGVtZW50LnRleHRDb250ZW50KS50b0VxdWFsIFtcInNhbXBsZS5qc1wiLCBcIkl0ZW0gMlwiLCBcIkl0ZW0gMVwiXVxuXG4gICAgZGVzY3JpYmUgXCJ3aGVuIGFkZE5ld1RhYnNBdEVuZCBpcyBzZXQgdG8gZmFsc2UgaW4gcGFja2FnZSBzZXR0aW5nc1wiLCAtPlxuICAgICAgaXQgXCJ1cGRhdGVzIHRoZSBvcmRlciBvZiB0aGUgdGFicyB0byBtYXRjaCB0aGUgbmV3IGl0ZW0gb3JkZXJcIiwgLT5cbiAgICAgICAgYXRvbS5jb25maWcuc2V0KFwidGFicy5hZGROZXdUYWJzQXRFbmRcIiwgZmFsc2UpXG4gICAgICAgIGV4cGVjdCh0YWJCYXIuZ2V0VGFicygpLm1hcCAodGFiKSAtPiB0YWIuZWxlbWVudC50ZXh0Q29udGVudCkudG9FcXVhbCBbXCJJdGVtIDFcIiwgXCJzYW1wbGUuanNcIiwgXCJJdGVtIDJcIl1cbiAgICAgICAgcGFuZS5tb3ZlSXRlbShpdGVtMiwgMSlcbiAgICAgICAgZXhwZWN0KHRhYkJhci5nZXRUYWJzKCkubWFwICh0YWIpIC0+IHRhYi5lbGVtZW50LnRleHRDb250ZW50KS50b0VxdWFsIFtcIkl0ZW0gMVwiLCBcIkl0ZW0gMlwiLCBcInNhbXBsZS5qc1wiXVxuICAgICAgICBwYW5lLm1vdmVJdGVtKGVkaXRvcjEsIDApXG4gICAgICAgIGV4cGVjdCh0YWJCYXIuZ2V0VGFicygpLm1hcCAodGFiKSAtPiB0YWIuZWxlbWVudC50ZXh0Q29udGVudCkudG9FcXVhbCBbXCJzYW1wbGUuanNcIiwgXCJJdGVtIDFcIiwgXCJJdGVtIDJcIl1cbiAgICAgICAgcGFuZS5tb3ZlSXRlbShpdGVtMSwgMilcbiAgICAgICAgZXhwZWN0KHRhYkJhci5nZXRUYWJzKCkubWFwICh0YWIpIC0+IHRhYi5lbGVtZW50LnRleHRDb250ZW50KS50b0VxdWFsIFtcInNhbXBsZS5qc1wiLCBcIkl0ZW0gMlwiLCBcIkl0ZW0gMVwiXVxuXG4gIGRlc2NyaWJlIFwiY29udGV4dCBtZW51IGNvbW1hbmRzXCIsIC0+XG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgcGFuZUVsZW1lbnQgPSBwYW5lLmdldEVsZW1lbnQoKVxuICAgICAgcGFuZUVsZW1lbnQuaW5zZXJ0QmVmb3JlKHRhYkJhci5lbGVtZW50LCBwYW5lRWxlbWVudC5maXJzdENoaWxkKVxuXG4gICAgZGVzY3JpYmUgXCJ3aGVuIHRhYnM6Y2xvc2UtdGFiIGlzIGZpcmVkXCIsIC0+XG4gICAgICBpdCBcImNsb3NlcyB0aGUgYWN0aXZlIHRhYlwiLCAtPlxuICAgICAgICB0cmlnZ2VyQ2xpY2tFdmVudCh0YWJCYXIudGFiRm9ySXRlbShpdGVtMikuZWxlbWVudCwgd2hpY2g6IDMpXG4gICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2godGFiQmFyLmVsZW1lbnQsICd0YWJzOmNsb3NlLXRhYicpXG4gICAgICAgIGV4cGVjdChwYW5lLmdldEl0ZW1zKCkubGVuZ3RoKS50b0JlIDJcbiAgICAgICAgZXhwZWN0KHBhbmUuZ2V0SXRlbXMoKS5pbmRleE9mKGl0ZW0yKSkudG9CZSAtMVxuICAgICAgICBleHBlY3QodGFiQmFyLmdldFRhYnMoKS5sZW5ndGgpLnRvQmUgMlxuICAgICAgICBleHBlY3QodGFiQmFyLmVsZW1lbnQudGV4dENvbnRlbnQpLm5vdC50b01hdGNoKCdJdGVtIDInKVxuXG4gICAgZGVzY3JpYmUgXCJ3aGVuIHRhYnM6Y2xvc2Utb3RoZXItdGFicyBpcyBmaXJlZFwiLCAtPlxuICAgICAgaXQgXCJjbG9zZXMgYWxsIG90aGVyIHRhYnMgZXhjZXB0IHRoZSBhY3RpdmUgdGFiXCIsIC0+XG4gICAgICAgIHRyaWdnZXJDbGlja0V2ZW50KHRhYkJhci50YWJGb3JJdGVtKGl0ZW0yKS5lbGVtZW50LCB3aGljaDogMylcbiAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh0YWJCYXIuZWxlbWVudCwgJ3RhYnM6Y2xvc2Utb3RoZXItdGFicycpXG4gICAgICAgIGV4cGVjdChwYW5lLmdldEl0ZW1zKCkubGVuZ3RoKS50b0JlIDFcbiAgICAgICAgZXhwZWN0KHRhYkJhci5nZXRUYWJzKCkubGVuZ3RoKS50b0JlIDFcbiAgICAgICAgZXhwZWN0KHRhYkJhci5lbGVtZW50LnRleHRDb250ZW50KS5ub3QudG9NYXRjaCgnc2FtcGxlLmpzJylcbiAgICAgICAgZXhwZWN0KHRhYkJhci5lbGVtZW50LnRleHRDb250ZW50KS50b01hdGNoKCdJdGVtIDInKVxuXG4gICAgZGVzY3JpYmUgXCJ3aGVuIHRhYnM6Y2xvc2UtdGFicy10by1yaWdodCBpcyBmaXJlZFwiLCAtPlxuICAgICAgaXQgXCJjbG9zZXMgb25seSB0aGUgdGFicyB0byB0aGUgcmlnaHQgb2YgdGhlIGFjdGl2ZSB0YWJcIiwgLT5cbiAgICAgICAgcGFuZS5hY3RpdmF0ZUl0ZW0oZWRpdG9yMSlcbiAgICAgICAgdHJpZ2dlckNsaWNrRXZlbnQodGFiQmFyLnRhYkZvckl0ZW0oZWRpdG9yMSkuZWxlbWVudCwgd2hpY2g6IDMpXG4gICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2godGFiQmFyLmVsZW1lbnQsICd0YWJzOmNsb3NlLXRhYnMtdG8tcmlnaHQnKVxuICAgICAgICBleHBlY3QocGFuZS5nZXRJdGVtcygpLmxlbmd0aCkudG9CZSAyXG4gICAgICAgIGV4cGVjdCh0YWJCYXIuZ2V0VGFicygpLmxlbmd0aCkudG9CZSAyXG4gICAgICAgIGV4cGVjdCh0YWJCYXIuZWxlbWVudC50ZXh0Q29udGVudCkubm90LnRvTWF0Y2goJ0l0ZW0gMicpXG4gICAgICAgIGV4cGVjdCh0YWJCYXIuZWxlbWVudC50ZXh0Q29udGVudCkudG9NYXRjaCgnSXRlbSAxJylcblxuICAgIGRlc2NyaWJlIFwid2hlbiB0YWJzOmNsb3NlLXRhYnMtdG8tbGVmdCBpcyBmaXJlZFwiLCAtPlxuICAgICAgaXQgXCJjbG9zZXMgb25seSB0aGUgdGFicyB0byB0aGUgbGVmdCBvZiB0aGUgYWN0aXZlIHRhYlwiLCAtPlxuICAgICAgICBwYW5lLmFjdGl2YXRlSXRlbShlZGl0b3IxKVxuICAgICAgICB0cmlnZ2VyQ2xpY2tFdmVudCh0YWJCYXIudGFiRm9ySXRlbShlZGl0b3IxKS5lbGVtZW50LCB3aGljaDogMylcbiAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh0YWJCYXIuZWxlbWVudCwgJ3RhYnM6Y2xvc2UtdGFicy10by1sZWZ0JylcbiAgICAgICAgZXhwZWN0KHBhbmUuZ2V0SXRlbXMoKS5sZW5ndGgpLnRvQmUgMlxuICAgICAgICBleHBlY3QodGFiQmFyLmdldFRhYnMoKS5sZW5ndGgpLnRvQmUgMlxuICAgICAgICBleHBlY3QodGFiQmFyLmVsZW1lbnQudGV4dENvbnRlbnQpLnRvTWF0Y2goJ0l0ZW0gMicpXG4gICAgICAgIGV4cGVjdCh0YWJCYXIuZWxlbWVudC50ZXh0Q29udGVudCkubm90LnRvTWF0Y2goJ0l0ZW0gMScpXG5cbiAgICBkZXNjcmliZSBcIndoZW4gdGFiczpjbG9zZS1hbGwtdGFicyBpcyBmaXJlZFwiLCAtPlxuICAgICAgaXQgXCJjbG9zZXMgYWxsIHRoZSB0YWJzXCIsIC0+XG4gICAgICAgIGV4cGVjdChwYW5lLmdldEl0ZW1zKCkubGVuZ3RoKS50b0JlR3JlYXRlclRoYW4gMFxuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHRhYkJhci5lbGVtZW50LCAndGFiczpjbG9zZS1hbGwtdGFicycpXG4gICAgICAgIGV4cGVjdChwYW5lLmdldEl0ZW1zKCkubGVuZ3RoKS50b0JlIDBcblxuICAgIGRlc2NyaWJlIFwid2hlbiB0YWJzOmNsb3NlLXNhdmVkLXRhYnMgaXMgZmlyZWRcIiwgLT5cbiAgICAgIGl0IFwiY2xvc2VzIGFsbCB0aGUgc2F2ZWQgdGFic1wiLCAtPlxuICAgICAgICBpdGVtMS5pc01vZGlmaWVkID0gLT4gdHJ1ZVxuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHRhYkJhci5lbGVtZW50LCAndGFiczpjbG9zZS1zYXZlZC10YWJzJylcbiAgICAgICAgZXhwZWN0KHBhbmUuZ2V0SXRlbXMoKS5sZW5ndGgpLnRvQmUgMVxuICAgICAgICBleHBlY3QocGFuZS5nZXRJdGVtcygpWzBdKS50b0JlIGl0ZW0xXG5cbiAgICBkZXNjcmliZSBcIndoZW4gdGFiczpzcGxpdC11cCBpcyBmaXJlZFwiLCAtPlxuICAgICAgaXQgXCJzcGxpdHMgdGhlIHNlbGVjdGVkIHRhYiB1cFwiLCAtPlxuICAgICAgICB0cmlnZ2VyQ2xpY2tFdmVudCh0YWJCYXIudGFiRm9ySXRlbShpdGVtMikuZWxlbWVudCwgd2hpY2g6IDMpXG4gICAgICAgIGV4cGVjdChnZXRDZW50ZXIoKS5nZXRQYW5lcygpLmxlbmd0aCkudG9CZSAxXG5cbiAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh0YWJCYXIuZWxlbWVudCwgJ3RhYnM6c3BsaXQtdXAnKVxuICAgICAgICBleHBlY3QoZ2V0Q2VudGVyKCkuZ2V0UGFuZXMoKS5sZW5ndGgpLnRvQmUgMlxuICAgICAgICBleHBlY3QoZ2V0Q2VudGVyKCkuZ2V0UGFuZXMoKVsxXSkudG9CZSBwYW5lXG4gICAgICAgIGV4cGVjdChnZXRDZW50ZXIoKS5nZXRQYW5lcygpWzBdLmdldEl0ZW1zKClbMF0uZ2V0VGl0bGUoKSkudG9CZSBpdGVtMi5nZXRUaXRsZSgpXG5cbiAgICBkZXNjcmliZSBcIndoZW4gdGFiczpzcGxpdC1kb3duIGlzIGZpcmVkXCIsIC0+XG4gICAgICBpdCBcInNwbGl0cyB0aGUgc2VsZWN0ZWQgdGFiIGRvd25cIiwgLT5cbiAgICAgICAgdHJpZ2dlckNsaWNrRXZlbnQodGFiQmFyLnRhYkZvckl0ZW0oaXRlbTIpLmVsZW1lbnQsIHdoaWNoOiAzKVxuICAgICAgICBleHBlY3QoZ2V0Q2VudGVyKCkuZ2V0UGFuZXMoKS5sZW5ndGgpLnRvQmUgMVxuXG4gICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2godGFiQmFyLmVsZW1lbnQsICd0YWJzOnNwbGl0LWRvd24nKVxuICAgICAgICBleHBlY3QoZ2V0Q2VudGVyKCkuZ2V0UGFuZXMoKS5sZW5ndGgpLnRvQmUgMlxuICAgICAgICBleHBlY3QoZ2V0Q2VudGVyKCkuZ2V0UGFuZXMoKVswXSkudG9CZSBwYW5lXG4gICAgICAgIGV4cGVjdChnZXRDZW50ZXIoKS5nZXRQYW5lcygpWzFdLmdldEl0ZW1zKClbMF0uZ2V0VGl0bGUoKSkudG9CZSBpdGVtMi5nZXRUaXRsZSgpXG5cbiAgICBkZXNjcmliZSBcIndoZW4gdGFiczpzcGxpdC1sZWZ0IGlzIGZpcmVkXCIsIC0+XG4gICAgICBpdCBcInNwbGl0cyB0aGUgc2VsZWN0ZWQgdGFiIHRvIHRoZSBsZWZ0XCIsIC0+XG4gICAgICAgIHRyaWdnZXJDbGlja0V2ZW50KHRhYkJhci50YWJGb3JJdGVtKGl0ZW0yKS5lbGVtZW50LCB3aGljaDogMylcbiAgICAgICAgZXhwZWN0KGdldENlbnRlcigpLmdldFBhbmVzKCkubGVuZ3RoKS50b0JlIDFcblxuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHRhYkJhci5lbGVtZW50LCAndGFiczpzcGxpdC1sZWZ0JylcbiAgICAgICAgZXhwZWN0KGdldENlbnRlcigpLmdldFBhbmVzKCkubGVuZ3RoKS50b0JlIDJcbiAgICAgICAgZXhwZWN0KGdldENlbnRlcigpLmdldFBhbmVzKClbMV0pLnRvQmUgcGFuZVxuICAgICAgICBleHBlY3QoZ2V0Q2VudGVyKCkuZ2V0UGFuZXMoKVswXS5nZXRJdGVtcygpWzBdLmdldFRpdGxlKCkpLnRvQmUgaXRlbTIuZ2V0VGl0bGUoKVxuXG4gICAgZGVzY3JpYmUgXCJ3aGVuIHRhYnM6c3BsaXQtcmlnaHQgaXMgZmlyZWRcIiwgLT5cbiAgICAgIGl0IFwic3BsaXRzIHRoZSBzZWxlY3RlZCB0YWIgdG8gdGhlIHJpZ2h0XCIsIC0+XG4gICAgICAgIHRyaWdnZXJDbGlja0V2ZW50KHRhYkJhci50YWJGb3JJdGVtKGl0ZW0yKS5lbGVtZW50LCB3aGljaDogMylcbiAgICAgICAgZXhwZWN0KGdldENlbnRlcigpLmdldFBhbmVzKCkubGVuZ3RoKS50b0JlIDFcblxuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKHRhYkJhci5lbGVtZW50LCAndGFiczpzcGxpdC1yaWdodCcpXG4gICAgICAgIGV4cGVjdChnZXRDZW50ZXIoKS5nZXRQYW5lcygpLmxlbmd0aCkudG9CZSAyXG4gICAgICAgIGV4cGVjdChnZXRDZW50ZXIoKS5nZXRQYW5lcygpWzBdKS50b0JlIHBhbmVcbiAgICAgICAgZXhwZWN0KGdldENlbnRlcigpLmdldFBhbmVzKClbMV0uZ2V0SXRlbXMoKVswXS5nZXRUaXRsZSgpKS50b0JlIGl0ZW0yLmdldFRpdGxlKClcblxuICAgIGRlc2NyaWJlIFwid2hlbiB0YWJzOm9wZW4taW4tbmV3LXdpbmRvdyBpcyBmaXJlZFwiLCAtPlxuICAgICAgZGVzY3JpYmUgXCJieSByaWdodC1jbGlja2luZyBvbiBhIHRhYlwiLCAtPlxuICAgICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgICAgdHJpZ2dlckNsaWNrRXZlbnQodGFiQmFyLnRhYkZvckl0ZW0oaXRlbTEpLmVsZW1lbnQsIHdoaWNoOiAzKVxuICAgICAgICAgIGV4cGVjdChnZXRDZW50ZXIoKS5nZXRQYW5lcygpLmxlbmd0aCkudG9CZSAxXG5cbiAgICAgICAgaXQgXCJvcGVucyBuZXcgd2luZG93LCBjbG9zZXMgY3VycmVudCB0YWJcIiwgLT5cbiAgICAgICAgICBzcHlPbihhdG9tLCAnb3BlbicpXG4gICAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh0YWJCYXIuZWxlbWVudCwgJ3RhYnM6b3Blbi1pbi1uZXctd2luZG93JylcbiAgICAgICAgICBleHBlY3QoYXRvbS5vcGVuKS50b0hhdmVCZWVuQ2FsbGVkKClcblxuICAgICAgICAgIGV4cGVjdChwYW5lLmdldEl0ZW1zKCkubGVuZ3RoKS50b0JlIDJcbiAgICAgICAgICBleHBlY3QodGFiQmFyLmdldFRhYnMoKS5sZW5ndGgpLnRvQmUgMlxuICAgICAgICAgIGV4cGVjdCh0YWJCYXIuZWxlbWVudC50ZXh0Q29udGVudCkudG9NYXRjaCgnSXRlbSAyJylcbiAgICAgICAgICBleHBlY3QodGFiQmFyLmVsZW1lbnQudGV4dENvbnRlbnQpLm5vdC50b01hdGNoKCdJdGVtIDEnKVxuXG4gICAgICBkZXNjcmliZSBcImZyb20gdGhlIGNvbW1hbmQgcGFsZXR0ZVwiLCAtPlxuICAgICAgICAjIFNlZSAjMzA5IGZvciBiYWNrZ3JvdW5kXG5cbiAgICAgICAgaXQgXCJkb2VzIG5vdGhpbmdcIiwgLT5cbiAgICAgICAgICBzcHlPbihhdG9tLCAnb3BlbicpXG4gICAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCh0YWJCYXIuZWxlbWVudCwgJ3RhYnM6b3Blbi1pbi1uZXctd2luZG93JylcbiAgICAgICAgICBleHBlY3QoYXRvbS5vcGVuKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG5cbiAgZGVzY3JpYmUgXCJjb21tYW5kIHBhbGV0dGUgY29tbWFuZHNcIiwgLT5cbiAgICBwYW5lRWxlbWVudCA9IG51bGxcblxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIHBhbmVFbGVtZW50ID0gcGFuZS5nZXRFbGVtZW50KClcblxuICAgIGRlc2NyaWJlIFwid2hlbiB0YWJzOmNsb3NlLXRhYiBpcyBmaXJlZFwiLCAtPlxuICAgICAgaXQgXCJjbG9zZXMgdGhlIGFjdGl2ZSB0YWJcIiwgLT5cbiAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaChwYW5lRWxlbWVudCwgJ3RhYnM6Y2xvc2UtdGFiJylcbiAgICAgICAgZXhwZWN0KHBhbmUuZ2V0SXRlbXMoKS5sZW5ndGgpLnRvQmUgMlxuICAgICAgICBleHBlY3QocGFuZS5nZXRJdGVtcygpLmluZGV4T2YoaXRlbTIpKS50b0JlIC0xXG4gICAgICAgIGV4cGVjdCh0YWJCYXIuZ2V0VGFicygpLmxlbmd0aCkudG9CZSAyXG4gICAgICAgIGV4cGVjdCh0YWJCYXIuZWxlbWVudC50ZXh0Q29udGVudCkubm90LnRvTWF0Y2goJ0l0ZW0gMicpXG5cbiAgICAgIGl0IFwiZG9lcyBub3RoaW5nIGlmIG5vIHRhYnMgYXJlIG9wZW5cIiwgLT5cbiAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaChwYW5lRWxlbWVudCwgJ3RhYnM6Y2xvc2UtdGFiJylcbiAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaChwYW5lRWxlbWVudCwgJ3RhYnM6Y2xvc2UtdGFiJylcbiAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaChwYW5lRWxlbWVudCwgJ3RhYnM6Y2xvc2UtdGFiJylcbiAgICAgICAgZXhwZWN0KHBhbmUuZ2V0SXRlbXMoKS5sZW5ndGgpLnRvQmUgMFxuICAgICAgICBleHBlY3QodGFiQmFyLmdldFRhYnMoKS5sZW5ndGgpLnRvQmUgMFxuXG4gICAgZGVzY3JpYmUgXCJ3aGVuIHRhYnM6Y2xvc2Utb3RoZXItdGFicyBpcyBmaXJlZFwiLCAtPlxuICAgICAgaXQgXCJjbG9zZXMgYWxsIG90aGVyIHRhYnMgZXhjZXB0IHRoZSBhY3RpdmUgdGFiXCIsIC0+XG4gICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2gocGFuZUVsZW1lbnQsICd0YWJzOmNsb3NlLW90aGVyLXRhYnMnKVxuICAgICAgICBleHBlY3QocGFuZS5nZXRJdGVtcygpLmxlbmd0aCkudG9CZSAxXG4gICAgICAgIGV4cGVjdCh0YWJCYXIuZ2V0VGFicygpLmxlbmd0aCkudG9CZSAxXG4gICAgICAgIGV4cGVjdCh0YWJCYXIuZWxlbWVudC50ZXh0Q29udGVudCkubm90LnRvTWF0Y2goJ3NhbXBsZS5qcycpXG4gICAgICAgIGV4cGVjdCh0YWJCYXIuZWxlbWVudC50ZXh0Q29udGVudCkudG9NYXRjaCgnSXRlbSAyJylcblxuICAgIGRlc2NyaWJlIFwid2hlbiB0YWJzOmNsb3NlLXRhYnMtdG8tcmlnaHQgaXMgZmlyZWRcIiwgLT5cbiAgICAgIGl0IFwiY2xvc2VzIG9ubHkgdGhlIHRhYnMgdG8gdGhlIHJpZ2h0IG9mIHRoZSBhY3RpdmUgdGFiXCIsIC0+XG4gICAgICAgIHBhbmUuYWN0aXZhdGVJdGVtKGVkaXRvcjEpXG4gICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2gocGFuZUVsZW1lbnQsICd0YWJzOmNsb3NlLXRhYnMtdG8tcmlnaHQnKVxuICAgICAgICBleHBlY3QocGFuZS5nZXRJdGVtcygpLmxlbmd0aCkudG9CZSAyXG4gICAgICAgIGV4cGVjdCh0YWJCYXIuZ2V0VGFicygpLmxlbmd0aCkudG9CZSAyXG4gICAgICAgIGV4cGVjdCh0YWJCYXIuZWxlbWVudC50ZXh0Q29udGVudCkubm90LnRvTWF0Y2goJ0l0ZW0gMicpXG4gICAgICAgIGV4cGVjdCh0YWJCYXIuZWxlbWVudC50ZXh0Q29udGVudCkudG9NYXRjaCgnSXRlbSAxJylcblxuICAgIGRlc2NyaWJlIFwid2hlbiB0YWJzOmNsb3NlLWFsbC10YWJzIGlzIGZpcmVkXCIsIC0+XG4gICAgICBpdCBcImNsb3NlcyBhbGwgdGhlIHRhYnNcIiwgLT5cbiAgICAgICAgZXhwZWN0KHBhbmUuZ2V0SXRlbXMoKS5sZW5ndGgpLnRvQmVHcmVhdGVyVGhhbiAwXG4gICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2gocGFuZUVsZW1lbnQsICd0YWJzOmNsb3NlLWFsbC10YWJzJylcbiAgICAgICAgZXhwZWN0KHBhbmUuZ2V0SXRlbXMoKS5sZW5ndGgpLnRvQmUgMFxuXG4gICAgZGVzY3JpYmUgXCJ3aGVuIHRhYnM6Y2xvc2Utc2F2ZWQtdGFicyBpcyBmaXJlZFwiLCAtPlxuICAgICAgaXQgXCJjbG9zZXMgYWxsIHRoZSBzYXZlZCB0YWJzXCIsIC0+XG4gICAgICAgIGl0ZW0xLmlzTW9kaWZpZWQgPSAtPiB0cnVlXG4gICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2gocGFuZUVsZW1lbnQsICd0YWJzOmNsb3NlLXNhdmVkLXRhYnMnKVxuICAgICAgICBleHBlY3QocGFuZS5nZXRJdGVtcygpLmxlbmd0aCkudG9CZSAxXG4gICAgICAgIGV4cGVjdChwYW5lLmdldEl0ZW1zKClbMF0pLnRvQmUgaXRlbTFcblxuICAgIGRlc2NyaWJlIFwid2hlbiBwYW5lOmNsb3NlIGlzIGZpcmVkXCIsIC0+XG4gICAgICBpdCBcImRlc3Ryb3lzIGFsbCB0aGUgdGFicyB3aXRoaW4gdGhlIHBhbmVcIiwgLT5cbiAgICAgICAgcGFuZTIgPSBwYW5lLnNwbGl0RG93bihjb3B5QWN0aXZlSXRlbTogdHJ1ZSlcbiAgICAgICAgdGFiQmFyMiA9IG5ldyBUYWJCYXJWaWV3KHBhbmUyLCAnY2VudGVyJylcbiAgICAgICAgdGFiMiA9IHRhYkJhcjIudGFiQXRJbmRleCgwKVxuICAgICAgICBzcHlPbih0YWIyLCAnZGVzdHJveScpXG5cbiAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgICAgUHJvbWlzZS5yZXNvbHZlKHBhbmUyLmNsb3NlKCkpLnRoZW4gLT5cbiAgICAgICAgICAgIGV4cGVjdCh0YWIyLmRlc3Ryb3kpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuXG4gIGRlc2NyaWJlIFwiZHJhZ2dpbmcgYW5kIGRyb3BwaW5nIHRhYnNcIiwgLT5cbiAgICBkZXNjcmliZSBcIndoZW4gYSB0YWIgaXMgZHJhZ2dlZCB3aXRoaW4gdGhlIHNhbWUgcGFuZVwiLCAtPlxuICAgICAgZGVzY3JpYmUgXCJ3aGVuIGl0IGlzIGRyb3BwZWQgb24gdGFiIHRoYXQncyBsYXRlciBpbiB0aGUgbGlzdFwiLCAtPlxuICAgICAgICBpdCBcIm1vdmVzIHRoZSB0YWIgYW5kIGl0cyBpdGVtLCBzaG93cyB0aGUgdGFiJ3MgaXRlbSwgYW5kIGZvY3VzZXMgdGhlIHBhbmVcIiwgLT5cbiAgICAgICAgICBleHBlY3QodGFiQmFyLmdldFRhYnMoKS5tYXAgKHRhYikgLT4gdGFiLmVsZW1lbnQudGV4dENvbnRlbnQpLnRvRXF1YWwgW1wiSXRlbSAxXCIsIFwic2FtcGxlLmpzXCIsIFwiSXRlbSAyXCJdXG4gICAgICAgICAgZXhwZWN0KHBhbmUuZ2V0SXRlbXMoKSkudG9FcXVhbCBbaXRlbTEsIGVkaXRvcjEsIGl0ZW0yXVxuICAgICAgICAgIGV4cGVjdChwYW5lLmdldEFjdGl2ZUl0ZW0oKSkudG9CZSBpdGVtMlxuICAgICAgICAgIHNweU9uKHBhbmUsICdhY3RpdmF0ZScpXG5cbiAgICAgICAgICB0YWJUb0RyYWcgPSB0YWJCYXIudGFiQXRJbmRleCgwKVxuICAgICAgICAgIHNweU9uKHRhYlRvRHJhZywgJ2Rlc3Ryb3lUb29sdGlwJylcbiAgICAgICAgICBzcHlPbih0YWJUb0RyYWcsICd1cGRhdGVUb29sdGlwJylcbiAgICAgICAgICBbZHJhZ1N0YXJ0RXZlbnQsIGRyb3BFdmVudF0gPSBidWlsZERyYWdFdmVudHModGFiVG9EcmFnLmVsZW1lbnQsIHRhYkJhci50YWJBdEluZGV4KDEpLmVsZW1lbnQpXG4gICAgICAgICAgdGFiQmFyLm9uRHJhZ1N0YXJ0KGRyYWdTdGFydEV2ZW50KVxuXG4gICAgICAgICAgZXhwZWN0KHRhYlRvRHJhZy5kZXN0cm95VG9vbHRpcCkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICAgICAgZXhwZWN0KHRhYlRvRHJhZy51cGRhdGVUb29sdGlwKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG5cbiAgICAgICAgICB0YWJCYXIub25Ecm9wKGRyb3BFdmVudClcbiAgICAgICAgICBleHBlY3QodGFiVG9EcmFnLnVwZGF0ZVRvb2x0aXApLnRvSGF2ZUJlZW5DYWxsZWQoKVxuXG4gICAgICAgICAgZXhwZWN0KHRhYkJhci5nZXRUYWJzKCkubWFwICh0YWIpIC0+IHRhYi5lbGVtZW50LnRleHRDb250ZW50KS50b0VxdWFsIFtcInNhbXBsZS5qc1wiLCBcIkl0ZW0gMVwiLCBcIkl0ZW0gMlwiXVxuICAgICAgICAgIGV4cGVjdChwYW5lLmdldEl0ZW1zKCkpLnRvRXF1YWwgW2VkaXRvcjEsIGl0ZW0xLCBpdGVtMl1cbiAgICAgICAgICBleHBlY3QocGFuZS5nZXRBY3RpdmVJdGVtKCkpLnRvQmUgaXRlbTFcbiAgICAgICAgICBleHBlY3QocGFuZS5hY3RpdmF0ZSkudG9IYXZlQmVlbkNhbGxlZCgpXG5cbiAgICAgIGRlc2NyaWJlIFwid2hlbiBpdCBpcyBkcm9wcGVkIG9uIGEgdGFiIHRoYXQncyBlYXJsaWVyIGluIHRoZSBsaXN0XCIsIC0+XG4gICAgICAgIGl0IFwibW92ZXMgdGhlIHRhYiBhbmQgaXRzIGl0ZW0sIHNob3dzIHRoZSB0YWIncyBpdGVtLCBhbmQgZm9jdXNlcyB0aGUgcGFuZVwiLCAtPlxuICAgICAgICAgIGV4cGVjdCh0YWJCYXIuZ2V0VGFicygpLm1hcCAodGFiKSAtPiB0YWIuZWxlbWVudC50ZXh0Q29udGVudCkudG9FcXVhbCBbXCJJdGVtIDFcIiwgXCJzYW1wbGUuanNcIiwgXCJJdGVtIDJcIl1cbiAgICAgICAgICBleHBlY3QocGFuZS5nZXRJdGVtcygpKS50b0VxdWFsIFtpdGVtMSwgZWRpdG9yMSwgaXRlbTJdXG4gICAgICAgICAgZXhwZWN0KHBhbmUuZ2V0QWN0aXZlSXRlbSgpKS50b0JlIGl0ZW0yXG4gICAgICAgICAgc3B5T24ocGFuZSwgJ2FjdGl2YXRlJylcblxuICAgICAgICAgIFtkcmFnU3RhcnRFdmVudCwgZHJvcEV2ZW50XSA9IGJ1aWxkRHJhZ0V2ZW50cyh0YWJCYXIudGFiQXRJbmRleCgyKS5lbGVtZW50LCB0YWJCYXIudGFiQXRJbmRleCgwKS5lbGVtZW50KVxuICAgICAgICAgIHRhYkJhci5vbkRyYWdTdGFydChkcmFnU3RhcnRFdmVudClcbiAgICAgICAgICB0YWJCYXIub25Ecm9wKGRyb3BFdmVudClcblxuICAgICAgICAgIGV4cGVjdCh0YWJCYXIuZ2V0VGFicygpLm1hcCAodGFiKSAtPiB0YWIuZWxlbWVudC50ZXh0Q29udGVudCkudG9FcXVhbCBbXCJJdGVtIDFcIiwgXCJJdGVtIDJcIiwgXCJzYW1wbGUuanNcIl1cbiAgICAgICAgICBleHBlY3QocGFuZS5nZXRJdGVtcygpKS50b0VxdWFsIFtpdGVtMSwgaXRlbTIsIGVkaXRvcjFdXG4gICAgICAgICAgZXhwZWN0KHBhbmUuZ2V0QWN0aXZlSXRlbSgpKS50b0JlIGl0ZW0yXG4gICAgICAgICAgZXhwZWN0KHBhbmUuYWN0aXZhdGUpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuXG4gICAgICBkZXNjcmliZSBcIndoZW4gaXQgaXMgZHJvcHBlZCBvbiBpdHNlbGZcIiwgLT5cbiAgICAgICAgaXQgXCJkb2Vzbid0IG1vdmUgdGhlIHRhYiBvciBpdGVtLCBidXQgZG9lcyBtYWtlIGl0IHRoZSBhY3RpdmUgaXRlbSBhbmQgZm9jdXNlcyB0aGUgcGFuZVwiLCAtPlxuICAgICAgICAgIGV4cGVjdCh0YWJCYXIuZ2V0VGFicygpLm1hcCAodGFiKSAtPiB0YWIuZWxlbWVudC50ZXh0Q29udGVudCkudG9FcXVhbCBbXCJJdGVtIDFcIiwgXCJzYW1wbGUuanNcIiwgXCJJdGVtIDJcIl1cbiAgICAgICAgICBleHBlY3QocGFuZS5nZXRJdGVtcygpKS50b0VxdWFsIFtpdGVtMSwgZWRpdG9yMSwgaXRlbTJdXG4gICAgICAgICAgZXhwZWN0KHBhbmUuZ2V0QWN0aXZlSXRlbSgpKS50b0JlIGl0ZW0yXG4gICAgICAgICAgc3B5T24ocGFuZSwgJ2FjdGl2YXRlJylcblxuICAgICAgICAgIFtkcmFnU3RhcnRFdmVudCwgZHJvcEV2ZW50XSA9IGJ1aWxkRHJhZ0V2ZW50cyh0YWJCYXIudGFiQXRJbmRleCgwKS5lbGVtZW50LCB0YWJCYXIudGFiQXRJbmRleCgwKS5lbGVtZW50KVxuICAgICAgICAgIHRhYkJhci5vbkRyYWdTdGFydChkcmFnU3RhcnRFdmVudClcbiAgICAgICAgICB0YWJCYXIub25Ecm9wKGRyb3BFdmVudClcblxuICAgICAgICAgIGV4cGVjdCh0YWJCYXIuZ2V0VGFicygpLm1hcCAodGFiKSAtPiB0YWIuZWxlbWVudC50ZXh0Q29udGVudCkudG9FcXVhbCBbXCJJdGVtIDFcIiwgXCJzYW1wbGUuanNcIiwgXCJJdGVtIDJcIl1cbiAgICAgICAgICBleHBlY3QocGFuZS5nZXRJdGVtcygpKS50b0VxdWFsIFtpdGVtMSwgZWRpdG9yMSwgaXRlbTJdXG4gICAgICAgICAgZXhwZWN0KHBhbmUuZ2V0QWN0aXZlSXRlbSgpKS50b0JlIGl0ZW0xXG4gICAgICAgICAgZXhwZWN0KHBhbmUuYWN0aXZhdGUpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuXG4gICAgICBkZXNjcmliZSBcIndoZW4gaXQgaXMgZHJvcHBlZCBvbiB0aGUgdGFiIGJhclwiLCAtPlxuICAgICAgICBpdCBcIm1vdmVzIHRoZSB0YWIgYW5kIGl0cyBpdGVtIHRvIHRoZSBlbmRcIiwgLT5cbiAgICAgICAgICBleHBlY3QodGFiQmFyLmdldFRhYnMoKS5tYXAgKHRhYikgLT4gdGFiLmVsZW1lbnQudGV4dENvbnRlbnQpLnRvRXF1YWwgW1wiSXRlbSAxXCIsIFwic2FtcGxlLmpzXCIsIFwiSXRlbSAyXCJdXG4gICAgICAgICAgZXhwZWN0KHBhbmUuZ2V0SXRlbXMoKSkudG9FcXVhbCBbaXRlbTEsIGVkaXRvcjEsIGl0ZW0yXVxuICAgICAgICAgIGV4cGVjdChwYW5lLmdldEFjdGl2ZUl0ZW0oKSkudG9CZSBpdGVtMlxuICAgICAgICAgIHNweU9uKHBhbmUsICdhY3RpdmF0ZScpXG5cbiAgICAgICAgICBbZHJhZ1N0YXJ0RXZlbnQsIGRyb3BFdmVudF0gPSBidWlsZERyYWdFdmVudHModGFiQmFyLnRhYkF0SW5kZXgoMCkuZWxlbWVudCwgdGFiQmFyLmVsZW1lbnQpXG4gICAgICAgICAgdGFiQmFyLm9uRHJhZ1N0YXJ0KGRyYWdTdGFydEV2ZW50KVxuICAgICAgICAgIHRhYkJhci5vbkRyb3AoZHJvcEV2ZW50KVxuXG4gICAgICAgICAgZXhwZWN0KHRhYkJhci5nZXRUYWJzKCkubWFwICh0YWIpIC0+IHRhYi5lbGVtZW50LnRleHRDb250ZW50KS50b0VxdWFsIFtcInNhbXBsZS5qc1wiLCBcIkl0ZW0gMlwiLCBcIkl0ZW0gMVwiXVxuICAgICAgICAgIGV4cGVjdChwYW5lLmdldEl0ZW1zKCkpLnRvRXF1YWwgW2VkaXRvcjEsIGl0ZW0yLCBpdGVtMV1cblxuICAgIGRlc2NyaWJlIFwid2hlbiBhIHRhYiBpcyBkcmFnZ2VkIHRvIGEgZGlmZmVyZW50IHBhbmVcIiwgLT5cbiAgICAgIFtwYW5lMiwgdGFiQmFyMiwgaXRlbTJiXSA9IFtdXG5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgcGFuZTIgPSBwYW5lLnNwbGl0UmlnaHQoY29weUFjdGl2ZUl0ZW06IHRydWUpXG4gICAgICAgIFtpdGVtMmJdID0gcGFuZTIuZ2V0SXRlbXMoKVxuICAgICAgICB0YWJCYXIyID0gbmV3IFRhYkJhclZpZXcocGFuZTIsICdjZW50ZXInKVxuXG4gICAgICBpdCBcInJlbW92ZXMgdGhlIHRhYiBhbmQgaXRlbSBmcm9tIHRoZWlyIG9yaWdpbmFsIHBhbmUgYW5kIG1vdmVzIHRoZW0gdG8gdGhlIHRhcmdldCBwYW5lXCIsIC0+XG4gICAgICAgIGV4cGVjdCh0YWJCYXIuZ2V0VGFicygpLm1hcCAodGFiKSAtPiB0YWIuZWxlbWVudC50ZXh0Q29udGVudCkudG9FcXVhbCBbXCJJdGVtIDFcIiwgXCJzYW1wbGUuanNcIiwgXCJJdGVtIDJcIl1cbiAgICAgICAgZXhwZWN0KHBhbmUuZ2V0SXRlbXMoKSkudG9FcXVhbCBbaXRlbTEsIGVkaXRvcjEsIGl0ZW0yXVxuICAgICAgICBleHBlY3QocGFuZS5nZXRBY3RpdmVJdGVtKCkpLnRvQmUgaXRlbTJcblxuICAgICAgICBleHBlY3QodGFiQmFyMi5nZXRUYWJzKCkubWFwICh0YWIpIC0+IHRhYi5lbGVtZW50LnRleHRDb250ZW50KS50b0VxdWFsIFtcIkl0ZW0gMlwiXVxuICAgICAgICBleHBlY3QocGFuZTIuZ2V0SXRlbXMoKSkudG9FcXVhbCBbaXRlbTJiXVxuICAgICAgICBleHBlY3QocGFuZTIuYWN0aXZlSXRlbSkudG9CZSBpdGVtMmJcbiAgICAgICAgc3B5T24ocGFuZTIsICdhY3RpdmF0ZScpXG5cbiAgICAgICAgW2RyYWdTdGFydEV2ZW50LCBkcm9wRXZlbnRdID0gYnVpbGREcmFnRXZlbnRzKHRhYkJhci50YWJBdEluZGV4KDApLmVsZW1lbnQsIHRhYkJhcjIudGFiQXRJbmRleCgwKS5lbGVtZW50KVxuICAgICAgICB0YWJCYXIub25EcmFnU3RhcnQoZHJhZ1N0YXJ0RXZlbnQpXG4gICAgICAgIHRhYkJhcjIub25Ecm9wKGRyb3BFdmVudClcblxuICAgICAgICBleHBlY3QodGFiQmFyLmdldFRhYnMoKS5tYXAgKHRhYikgLT4gdGFiLmVsZW1lbnQudGV4dENvbnRlbnQpLnRvRXF1YWwgW1wic2FtcGxlLmpzXCIsIFwiSXRlbSAyXCJdXG4gICAgICAgIGV4cGVjdChwYW5lLmdldEl0ZW1zKCkpLnRvRXF1YWwgW2VkaXRvcjEsIGl0ZW0yXVxuICAgICAgICBleHBlY3QocGFuZS5nZXRBY3RpdmVJdGVtKCkpLnRvQmUgaXRlbTJcblxuICAgICAgICBleHBlY3QodGFiQmFyMi5nZXRUYWJzKCkubWFwICh0YWIpIC0+IHRhYi5lbGVtZW50LnRleHRDb250ZW50KS50b0VxdWFsIFtcIkl0ZW0gMlwiLCBcIkl0ZW0gMVwiXVxuICAgICAgICBleHBlY3QocGFuZTIuZ2V0SXRlbXMoKSkudG9FcXVhbCBbaXRlbTJiLCBpdGVtMV1cbiAgICAgICAgZXhwZWN0KHBhbmUyLmFjdGl2ZUl0ZW0pLnRvQmUgaXRlbTFcbiAgICAgICAgZXhwZWN0KHBhbmUyLmFjdGl2YXRlKS50b0hhdmVCZWVuQ2FsbGVkKClcblxuICAgICAgZGVzY3JpYmUgXCJ3aGVuIHRoZSB0YWIgaXMgZHJhZ2dlZCB0byBhbiBlbXB0eSBwYW5lXCIsIC0+XG4gICAgICAgIGl0IFwicmVtb3ZlcyB0aGUgdGFiIGFuZCBpdGVtIGZyb20gdGhlaXIgb3JpZ2luYWwgcGFuZSBhbmQgbW92ZXMgdGhlbSB0byB0aGUgdGFyZ2V0IHBhbmVcIiwgLT5cbiAgICAgICAgICBwYW5lMi5kZXN0cm95SXRlbXMoKVxuXG4gICAgICAgICAgZXhwZWN0KHRhYkJhci5nZXRUYWJzKCkubWFwICh0YWIpIC0+IHRhYi5lbGVtZW50LnRleHRDb250ZW50KS50b0VxdWFsIFtcIkl0ZW0gMVwiLCBcInNhbXBsZS5qc1wiLCBcIkl0ZW0gMlwiXVxuICAgICAgICAgIGV4cGVjdChwYW5lLmdldEl0ZW1zKCkpLnRvRXF1YWwgW2l0ZW0xLCBlZGl0b3IxLCBpdGVtMl1cbiAgICAgICAgICBleHBlY3QocGFuZS5nZXRBY3RpdmVJdGVtKCkpLnRvQmUgaXRlbTJcblxuICAgICAgICAgIGV4cGVjdCh0YWJCYXIyLmdldFRhYnMoKS5tYXAgKHRhYikgLT4gdGFiLmVsZW1lbnQudGV4dENvbnRlbnQpLnRvRXF1YWwgW11cbiAgICAgICAgICBleHBlY3QocGFuZTIuZ2V0SXRlbXMoKSkudG9FcXVhbCBbXVxuICAgICAgICAgIGV4cGVjdChwYW5lMi5hY3RpdmVJdGVtKS50b0JlVW5kZWZpbmVkKClcbiAgICAgICAgICBzcHlPbihwYW5lMiwgJ2FjdGl2YXRlJylcblxuICAgICAgICAgIFtkcmFnU3RhcnRFdmVudCwgZHJvcEV2ZW50XSA9IGJ1aWxkRHJhZ0V2ZW50cyh0YWJCYXIudGFiQXRJbmRleCgwKS5lbGVtZW50LCB0YWJCYXIyLmVsZW1lbnQpXG4gICAgICAgICAgdGFiQmFyLm9uRHJhZ1N0YXJ0KGRyYWdTdGFydEV2ZW50KVxuICAgICAgICAgIHRhYkJhcjIub25EcmFnT3Zlcihkcm9wRXZlbnQpXG4gICAgICAgICAgdGFiQmFyMi5vbkRyb3AoZHJvcEV2ZW50KVxuXG4gICAgICAgICAgZXhwZWN0KHRhYkJhci5nZXRUYWJzKCkubWFwICh0YWIpIC0+IHRhYi5lbGVtZW50LnRleHRDb250ZW50KS50b0VxdWFsIFtcInNhbXBsZS5qc1wiLCBcIkl0ZW0gMlwiXVxuICAgICAgICAgIGV4cGVjdChwYW5lLmdldEl0ZW1zKCkpLnRvRXF1YWwgW2VkaXRvcjEsIGl0ZW0yXVxuICAgICAgICAgIGV4cGVjdChwYW5lLmdldEFjdGl2ZUl0ZW0oKSkudG9CZSBpdGVtMlxuXG4gICAgICAgICAgZXhwZWN0KHRhYkJhcjIuZ2V0VGFicygpLm1hcCAodGFiKSAtPiB0YWIuZWxlbWVudC50ZXh0Q29udGVudCkudG9FcXVhbCBbXCJJdGVtIDFcIl1cbiAgICAgICAgICBleHBlY3QocGFuZTIuZ2V0SXRlbXMoKSkudG9FcXVhbCBbaXRlbTFdXG4gICAgICAgICAgZXhwZWN0KHBhbmUyLmFjdGl2ZUl0ZW0pLnRvQmUgaXRlbTFcbiAgICAgICAgICBleHBlY3QocGFuZTIuYWN0aXZhdGUpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuXG4gICAgICBkZXNjcmliZSBcIndoZW4gYWRkTmV3VGFic0F0RW5kIGlzIHNldCB0byB0cnVlIGluIHBhY2thZ2Ugc2V0dGluZ3NcIiwgLT5cbiAgICAgICAgaXQgXCJtb3ZlcyB0aGUgZHJhZ2dlZCB0YWIgdG8gdGhlIGRlc2lyZWQgaW5kZXggaW4gdGhlIG5ldyBwYW5lXCIsIC0+XG4gICAgICAgICAgYXRvbS5jb25maWcuc2V0KFwidGFicy5hZGROZXdUYWJzQXRFbmRcIiwgdHJ1ZSlcbiAgICAgICAgICBleHBlY3QodGFiQmFyLmdldFRhYnMoKS5tYXAgKHRhYikgLT4gdGFiLmVsZW1lbnQudGV4dENvbnRlbnQpLnRvRXF1YWwgW1wiSXRlbSAxXCIsIFwic2FtcGxlLmpzXCIsIFwiSXRlbSAyXCJdXG4gICAgICAgICAgZXhwZWN0KHBhbmUuZ2V0SXRlbXMoKSkudG9FcXVhbCBbaXRlbTEsIGVkaXRvcjEsIGl0ZW0yXVxuICAgICAgICAgIGV4cGVjdChwYW5lLmdldEFjdGl2ZUl0ZW0oKSkudG9CZSBpdGVtMlxuXG4gICAgICAgICAgZXhwZWN0KHRhYkJhcjIuZ2V0VGFicygpLm1hcCAodGFiKSAtPiB0YWIuZWxlbWVudC50ZXh0Q29udGVudCkudG9FcXVhbCBbXCJJdGVtIDJcIl1cbiAgICAgICAgICBleHBlY3QocGFuZTIuZ2V0SXRlbXMoKSkudG9FcXVhbCBbaXRlbTJiXVxuICAgICAgICAgIGV4cGVjdChwYW5lMi5hY3RpdmVJdGVtKS50b0JlIGl0ZW0yYlxuICAgICAgICAgIHNweU9uKHBhbmUyLCAnYWN0aXZhdGUnKVxuXG4gICAgICAgICAgW2RyYWdTdGFydEV2ZW50LCBkcm9wRXZlbnRdID0gYnVpbGREcmFnRXZlbnRzKHRhYkJhcjIudGFiQXRJbmRleCgwKS5lbGVtZW50LCB0YWJCYXIudGFiQXRJbmRleCgwKS5lbGVtZW50KVxuICAgICAgICAgIHRhYkJhcjIub25EcmFnU3RhcnQoZHJhZ1N0YXJ0RXZlbnQpXG4gICAgICAgICAgdGFiQmFyLm9uRHJvcChkcm9wRXZlbnQpXG5cbiAgICAgICAgICBleHBlY3QodGFiQmFyLmdldFRhYnMoKS5tYXAgKHRhYikgLT4gdGFiLmVsZW1lbnQudGV4dENvbnRlbnQpLnRvRXF1YWwgW1wiSXRlbSAxXCIsIFwiSXRlbSAyXCIsIFwic2FtcGxlLmpzXCIsIFwiSXRlbSAyXCJdXG4gICAgICAgICAgZXhwZWN0KHBhbmUuZ2V0SXRlbXMoKSkudG9FcXVhbCBbaXRlbTEsIGl0ZW0yYiwgZWRpdG9yMSwgaXRlbTJdXG4gICAgICAgICAgZXhwZWN0KHBhbmUuZ2V0QWN0aXZlSXRlbSgpKS50b0JlIGl0ZW0yYlxuXG4gICAgICAgICAgYXRvbS5jb25maWcuc2V0KFwidGFicy5hZGROZXdUYWJzQXRFbmRcIiwgZmFsc2UpXG5cbiAgICBkZXNjcmliZSBcIndoZW4gYSB0YWIgaXMgZHJhZ2dlZCBvdmVyIGEgcGFuZSBpdGVtXCIsIC0+XG4gICAgICBpdCBcImRyYXdzIGFuIG92ZXJsYXkgb3ZlciB0aGUgaXRlbVwiLCAtPlxuICAgICAgICBleHBlY3QodGFiQmFyLmdldFRhYnMoKS5tYXAgKHRhYikgLT4gdGFiLmVsZW1lbnQudGV4dENvbnRlbnQpLnRvRXF1YWwgW1wiSXRlbSAxXCIsIFwic2FtcGxlLmpzXCIsIFwiSXRlbSAyXCJdXG4gICAgICAgIHRhYiA9IHRhYkJhci50YWJBdEluZGV4KDIpLmVsZW1lbnRcbiAgICAgICAgbGF5b3V0LnRlc3QgPVxuICAgICAgICAgIHBhbmU6IHBhbmVcbiAgICAgICAgICBpdGVtVmlldzogcGFuZS5nZXRFbGVtZW50KCkucXVlcnlTZWxlY3RvcignLml0ZW0tdmlld3MnKVxuICAgICAgICAgIHJlY3Q6IHt0b3A6IDAsIGxlZnQ6IDAsIHdpZHRoOiAxMDAsIGhlaWdodDogMTAwfVxuXG4gICAgICAgIGV4cGVjdChsYXlvdXQudmlldy5jbGFzc0xpc3QuY29udGFpbnMoJ3Zpc2libGUnKSkudG9CZShmYWxzZSlcbiAgICAgICAgIyBEcmFnIGludG8gcGFuZVxuICAgICAgICB0YWIub25kcmFnIHRhcmdldDogdGFiLCBjbGllbnRYOiA1MCwgY2xpZW50WTogNTBcbiAgICAgICAgZXhwZWN0KGxheW91dC52aWV3LmNsYXNzTGlzdC5jb250YWlucygndmlzaWJsZScpKS50b0JlKHRydWUpXG4gICAgICAgIGV4cGVjdChsYXlvdXQudmlldy5zdHlsZS5oZWlnaHQpLnRvQmUoXCIxMDBweFwiKVxuICAgICAgICBleHBlY3QobGF5b3V0LnZpZXcuc3R5bGUud2lkdGgpLnRvQmUoXCIxMDBweFwiKVxuICAgICAgICAjIERyYWcgb3V0IG9mIHBhbmVcbiAgICAgICAgZGVsZXRlIGxheW91dC50ZXN0LnBhbmVcbiAgICAgICAgdGFiLm9uZHJhZyB0YXJnZXQ6IHRhYiwgY2xpZW50WDogMjAwLCBjbGllbnRZOiAyMDBcbiAgICAgICAgZXhwZWN0KGxheW91dC52aWV3LmNsYXNzTGlzdC5jb250YWlucygndmlzaWJsZScpKS50b0JlKGZhbHNlKVxuXG4gICAgICBpdCBcImNsZWF2ZXMgdGhlIHBhbmUgaW4gdHdhaW5cIiwgLT5cbiAgICAgICAgZXhwZWN0KHRhYkJhci5nZXRUYWJzKCkubWFwICh0YWIpIC0+IHRhYi5lbGVtZW50LnRleHRDb250ZW50KS50b0VxdWFsIFtcIkl0ZW0gMVwiLCBcInNhbXBsZS5qc1wiLCBcIkl0ZW0gMlwiXVxuICAgICAgICB0YWIgPSB0YWJCYXIudGFiQXRJbmRleCgyKS5lbGVtZW50XG4gICAgICAgIGxheW91dC50ZXN0ID1cbiAgICAgICAgICBwYW5lOiBwYW5lXG4gICAgICAgICAgaXRlbVZpZXc6IHBhbmUuZ2V0RWxlbWVudCgpLnF1ZXJ5U2VsZWN0b3IoJy5pdGVtLXZpZXdzJylcbiAgICAgICAgICByZWN0OiB7dG9wOiAwLCBsZWZ0OiAwLCB3aWR0aDogMTAwLCBoZWlnaHQ6IDEwMH1cblxuICAgICAgICB0YWIub25kcmFnIHRhcmdldDogdGFiLCBjbGllbnRYOiA4MCwgY2xpZW50WTogNTBcbiAgICAgICAgdGFiLm9uZHJhZ2VuZCB0YXJnZXQ6IHRhYiwgY2xpZW50WDogODAsIGNsaWVudFk6IDUwXG4gICAgICAgIGV4cGVjdChnZXRDZW50ZXIoKS5nZXRQYW5lcygpLmxlbmd0aCkudG9FcXVhbCgyKVxuICAgICAgICBleHBlY3QodGFiQmFyLmdldFRhYnMoKS5tYXAgKHRhYikgLT4gdGFiLmVsZW1lbnQudGV4dENvbnRlbnQpLnRvRXF1YWwgW1wiSXRlbSAxXCIsIFwic2FtcGxlLmpzXCJdXG4gICAgICAgIGV4cGVjdChhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKCkuZ2V0SXRlbXMoKS5sZW5ndGgpLnRvRXF1YWwoMSlcblxuICAgICAgZGVzY3JpYmUgXCJ3aGVuIHRoZSBkcmFnZ2VkIHRhYiBpcyB0aGUgb25seSBvbmUgaW4gdGhlIHBhbmVcIiwgLT5cbiAgICAgICAgaXQgXCJkb2VzIG5vdGhpbmdcIiwgLT5cbiAgICAgICAgICB0YWJCYXIuZ2V0VGFicygpWzBdLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLmNsb3NlLWljb24nKS5jbGljaygpXG4gICAgICAgICAgdGFiQmFyLmdldFRhYnMoKVsxXS5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jbG9zZS1pY29uJykuY2xpY2soKVxuICAgICAgICAgIGV4cGVjdCh0YWJCYXIuZ2V0VGFicygpLm1hcCAodGFiKSAtPiB0YWIuZWxlbWVudC50ZXh0Q29udGVudCkudG9FcXVhbCBbXCJzYW1wbGUuanNcIl1cbiAgICAgICAgICB0YWIgPSB0YWJCYXIudGFiQXRJbmRleCgwKS5lbGVtZW50XG4gICAgICAgICAgbGF5b3V0LnRlc3QgPVxuICAgICAgICAgICAgcGFuZTogcGFuZVxuICAgICAgICAgICAgaXRlbVZpZXc6IHBhbmUuZ2V0RWxlbWVudCgpLnF1ZXJ5U2VsZWN0b3IoJy5pdGVtLXZpZXdzJylcbiAgICAgICAgICAgIHJlY3Q6IHt0b3A6IDAsIGxlZnQ6IDAsIHdpZHRoOiAxMDAsIGhlaWdodDogMTAwfVxuXG4gICAgICAgICAgdGFiLm9uZHJhZyB0YXJnZXQ6IHRhYiwgY2xpZW50WDogODAsIGNsaWVudFk6IDUwXG4gICAgICAgICAgdGFiLm9uZHJhZ2VuZCB0YXJnZXQ6IHRhYiwgY2xpZW50WDogODAsIGNsaWVudFk6IDUwXG4gICAgICAgICAgZXhwZWN0KGdldENlbnRlcigpLmdldFBhbmVzKCkubGVuZ3RoKS50b0VxdWFsKDEpXG4gICAgICAgICAgZXhwZWN0KHRhYkJhci5nZXRUYWJzKCkubWFwICh0YWIpIC0+IHRhYi5lbGVtZW50LnRleHRDb250ZW50KS50b0VxdWFsIFtcInNhbXBsZS5qc1wiXVxuXG4gICAgICBkZXNjcmliZSBcIndoZW4gdGhlIHBhbmUgaXMgZW1wdHlcIiwgLT5cbiAgICAgICAgaXQgXCJtb3ZlcyB0aGUgdGFiIHRvIHRoZSB0YXJnZXQgcGFuZVwiLCAtPlxuICAgICAgICAgIHRvUGFuZSA9IHBhbmUuc3BsaXREb3duKClcbiAgICAgICAgICBleHBlY3QodGFiQmFyLmdldFRhYnMoKS5tYXAgKHRhYikgLT4gdGFiLmVsZW1lbnQudGV4dENvbnRlbnQpLnRvRXF1YWwgW1wiSXRlbSAxXCIsIFwic2FtcGxlLmpzXCIsIFwiSXRlbSAyXCJdXG4gICAgICAgICAgZXhwZWN0KHRvUGFuZS5nZXRJdGVtcygpLmxlbmd0aCkudG9CZSgwKVxuICAgICAgICAgIHRhYiA9IHRhYkJhci50YWJBdEluZGV4KDIpLmVsZW1lbnRcbiAgICAgICAgICBsYXlvdXQudGVzdCA9XG4gICAgICAgICAgICBwYW5lOiB0b1BhbmVcbiAgICAgICAgICAgIGl0ZW1WaWV3OiB0b1BhbmUuZ2V0RWxlbWVudCgpLnF1ZXJ5U2VsZWN0b3IoJy5pdGVtLXZpZXdzJylcbiAgICAgICAgICAgIHJlY3Q6IHt0b3A6IDAsIGxlZnQ6IDAsIHdpZHRoOiAxMDAsIGhlaWdodDogMTAwfVxuXG4gICAgICAgICAgdGFiLm9uZHJhZyB0YXJnZXQ6IHRhYiwgY2xpZW50WDogODAsIGNsaWVudFk6IDUwXG4gICAgICAgICAgdGFiLm9uZHJhZ2VuZCB0YXJnZXQ6IHRhYiwgY2xpZW50WDogODAsIGNsaWVudFk6IDUwXG4gICAgICAgICAgZXhwZWN0KGdldENlbnRlcigpLmdldFBhbmVzKCkubGVuZ3RoKS50b0VxdWFsKDIpXG4gICAgICAgICAgZXhwZWN0KHRhYkJhci5nZXRUYWJzKCkubWFwICh0YWIpIC0+IHRhYi5lbGVtZW50LnRleHRDb250ZW50KS50b0VxdWFsIFtcIkl0ZW0gMVwiLCBcInNhbXBsZS5qc1wiXVxuICAgICAgICAgIGV4cGVjdChhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKCkuZ2V0SXRlbXMoKS5sZW5ndGgpLnRvRXF1YWwoMSlcblxuICAgIGRlc2NyaWJlIFwid2hlbiBhIG5vbi10YWIgaXMgZHJhZ2dlZCB0byBwYW5lXCIsIC0+XG4gICAgICBpdCBcImhhcyBubyBlZmZlY3RcIiwgLT5cbiAgICAgICAgZXhwZWN0KHRhYkJhci5nZXRUYWJzKCkubWFwICh0YWIpIC0+IHRhYi5lbGVtZW50LnRleHRDb250ZW50KS50b0VxdWFsIFtcIkl0ZW0gMVwiLCBcInNhbXBsZS5qc1wiLCBcIkl0ZW0gMlwiXVxuICAgICAgICBleHBlY3QocGFuZS5nZXRJdGVtcygpKS50b0VxdWFsIFtpdGVtMSwgZWRpdG9yMSwgaXRlbTJdXG4gICAgICAgIGV4cGVjdChwYW5lLmdldEFjdGl2ZUl0ZW0oKSkudG9CZSBpdGVtMlxuICAgICAgICBzcHlPbihwYW5lLCAnYWN0aXZhdGUnKVxuXG4gICAgICAgIFtkcmFnU3RhcnRFdmVudCwgZHJvcEV2ZW50XSA9IGJ1aWxkRHJhZ0V2ZW50cyh0YWJCYXIudGFiQXRJbmRleCgwKS5lbGVtZW50LCB0YWJCYXIudGFiQXRJbmRleCgwKS5lbGVtZW50KVxuICAgICAgICB0YWJCYXIub25Ecm9wKGRyb3BFdmVudClcblxuICAgICAgICBleHBlY3QodGFiQmFyLmdldFRhYnMoKS5tYXAgKHRhYikgLT4gdGFiLmVsZW1lbnQudGV4dENvbnRlbnQpLnRvRXF1YWwgW1wiSXRlbSAxXCIsIFwic2FtcGxlLmpzXCIsIFwiSXRlbSAyXCJdXG4gICAgICAgIGV4cGVjdChwYW5lLmdldEl0ZW1zKCkpLnRvRXF1YWwgW2l0ZW0xLCBlZGl0b3IxLCBpdGVtMl1cbiAgICAgICAgZXhwZWN0KHBhbmUuZ2V0QWN0aXZlSXRlbSgpKS50b0JlIGl0ZW0yXG4gICAgICAgIGV4cGVjdChwYW5lLmFjdGl2YXRlKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG5cbiAgICBkZXNjcmliZSBcIndoZW4gYSB0YWIgaXMgZHJhZ2dlZCBvdXQgb2YgYXBwbGljYXRpb25cIiwgLT5cbiAgICAgIGl0IFwic2hvdWxkIGNhcnJ5IHRoZSBmaWxlJ3MgaW5mb3JtYXRpb25cIiwgLT5cbiAgICAgICAgW2RyYWdTdGFydEV2ZW50LCBkcm9wRXZlbnRdID0gYnVpbGREcmFnRXZlbnRzKHRhYkJhci50YWJBdEluZGV4KDEpLmVsZW1lbnQsIHRhYkJhci50YWJBdEluZGV4KDEpLmVsZW1lbnQpXG4gICAgICAgIHRhYkJhci5vbkRyYWdTdGFydChkcmFnU3RhcnRFdmVudClcblxuICAgICAgICBleHBlY3QoZHJhZ1N0YXJ0RXZlbnQuZGF0YVRyYW5zZmVyLmdldERhdGEoXCJ0ZXh0L3BsYWluXCIpKS50b0VxdWFsIGVkaXRvcjEuZ2V0UGF0aCgpXG4gICAgICAgIGlmIHByb2Nlc3MucGxhdGZvcm0gaXMgJ2RhcndpbidcbiAgICAgICAgICBleHBlY3QoZHJhZ1N0YXJ0RXZlbnQuZGF0YVRyYW5zZmVyLmdldERhdGEoXCJ0ZXh0L3VyaS1saXN0XCIpKS50b0VxdWFsIFwiZmlsZTovLyN7ZWRpdG9yMS5nZXRQYXRoKCl9XCJcblxuICAgIGRlc2NyaWJlIFwid2hlbiBhIHRhYiBpcyBkcmFnZ2VkIHRvIGFub3RoZXIgQXRvbSB3aW5kb3dcIiwgLT5cbiAgICAgIGl0IFwiY2xvc2VzIHRoZSB0YWIgaW4gdGhlIGZpcnN0IHdpbmRvdyBhbmQgb3BlbnMgdGhlIHRhYiBpbiB0aGUgc2Vjb25kIHdpbmRvd1wiLCAtPlxuICAgICAgICBbZHJhZ1N0YXJ0RXZlbnQsIGRyb3BFdmVudF0gPSBidWlsZERyYWdFdmVudHModGFiQmFyLnRhYkF0SW5kZXgoMSkuZWxlbWVudCwgdGFiQmFyLnRhYkF0SW5kZXgoMCkuZWxlbWVudClcbiAgICAgICAgdGFiQmFyLm9uRHJhZ1N0YXJ0KGRyYWdTdGFydEV2ZW50KVxuICAgICAgICB0YWJCYXIub25Ecm9wT25PdGhlcldpbmRvdyhwYW5lLmlkLCAxKVxuXG4gICAgICAgIGV4cGVjdChwYW5lLmdldEl0ZW1zKCkpLnRvRXF1YWwgW2l0ZW0xLCBpdGVtMl1cbiAgICAgICAgZXhwZWN0KHBhbmUuZ2V0QWN0aXZlSXRlbSgpKS50b0JlIGl0ZW0yXG5cbiAgICAgICAgZHJvcEV2ZW50LmRhdGFUcmFuc2Zlci5zZXREYXRhKCdmcm9tLXdpbmRvdy1pZCcsIHRhYkJhci5nZXRXaW5kb3dJZCgpICsgMSlcblxuICAgICAgICBzcHlPbih0YWJCYXIsICdtb3ZlSXRlbUJldHdlZW5QYW5lcycpLmFuZENhbGxUaHJvdWdoKClcbiAgICAgICAgdGFiQmFyLm9uRHJvcChkcm9wRXZlbnQpXG5cbiAgICAgICAgd2FpdHNGb3IgLT5cbiAgICAgICAgICB0YWJCYXIubW92ZUl0ZW1CZXR3ZWVuUGFuZXMuY2FsbENvdW50ID4gMFxuXG4gICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldFBhdGgoKSkudG9CZSBlZGl0b3IxLmdldFBhdGgoKVxuICAgICAgICAgIGV4cGVjdChwYW5lLmdldEl0ZW1zKCkpLnRvRXF1YWwgW2l0ZW0xLCBlZGl0b3IsIGl0ZW0yXVxuXG4gICAgICBpdCBcInRyYW5zZmVycyB0aGUgdGV4dCBvZiB0aGUgZWRpdG9yIHdoZW4gaXQgaXMgbW9kaWZpZWRcIiwgLT5cbiAgICAgICAgZWRpdG9yMS5zZXRUZXh0KCdJIGNhbWUgZnJvbSBhbm90aGVyIHdpbmRvdycpXG4gICAgICAgIFtkcmFnU3RhcnRFdmVudCwgZHJvcEV2ZW50XSA9IGJ1aWxkRHJhZ0V2ZW50cyh0YWJCYXIudGFiQXRJbmRleCgxKS5lbGVtZW50LCB0YWJCYXIudGFiQXRJbmRleCgwKS5lbGVtZW50KVxuICAgICAgICB0YWJCYXIub25EcmFnU3RhcnQoZHJhZ1N0YXJ0RXZlbnQpXG4gICAgICAgIHRhYkJhci5vbkRyb3BPbk90aGVyV2luZG93KHBhbmUuaWQsIDEpXG5cbiAgICAgICAgZHJvcEV2ZW50LmRhdGFUcmFuc2Zlci5zZXREYXRhKCdmcm9tLXdpbmRvdy1pZCcsIHRhYkJhci5nZXRXaW5kb3dJZCgpICsgMSlcblxuICAgICAgICBzcHlPbih0YWJCYXIsICdtb3ZlSXRlbUJldHdlZW5QYW5lcycpLmFuZENhbGxUaHJvdWdoKClcbiAgICAgICAgdGFiQmFyLm9uRHJvcChkcm9wRXZlbnQpXG5cbiAgICAgICAgd2FpdHNGb3IgLT5cbiAgICAgICAgICB0YWJCYXIubW92ZUl0ZW1CZXR3ZWVuUGFuZXMuY2FsbENvdW50ID4gMFxuXG4gICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICBleHBlY3QoYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpLmdldFRleHQoKSkudG9CZSAnSSBjYW1lIGZyb20gYW5vdGhlciB3aW5kb3cnXG5cbiAgICAgIGl0IFwiYWxsb3dzIHVudGl0bGVkIGVkaXRvcnMgdG8gYmUgbW92ZWQgYmV0d2VlbiB3aW5kb3dzXCIsIC0+XG4gICAgICAgIGVkaXRvcjEuZ2V0QnVmZmVyKCkuc2V0UGF0aChudWxsKVxuICAgICAgICBlZGl0b3IxLnNldFRleHQoJ0kgaGF2ZSBubyBwYXRoJylcblxuICAgICAgICBbZHJhZ1N0YXJ0RXZlbnQsIGRyb3BFdmVudF0gPSBidWlsZERyYWdFdmVudHModGFiQmFyLnRhYkF0SW5kZXgoMSkuZWxlbWVudCwgdGFiQmFyLnRhYkF0SW5kZXgoMCkuZWxlbWVudClcbiAgICAgICAgdGFiQmFyLm9uRHJhZ1N0YXJ0KGRyYWdTdGFydEV2ZW50KVxuICAgICAgICB0YWJCYXIub25Ecm9wT25PdGhlcldpbmRvdyhwYW5lLmlkLCAxKVxuXG4gICAgICAgIGRyb3BFdmVudC5kYXRhVHJhbnNmZXIuc2V0RGF0YSgnZnJvbS13aW5kb3ctaWQnLCB0YWJCYXIuZ2V0V2luZG93SWQoKSArIDEpXG5cbiAgICAgICAgc3B5T24odGFiQmFyLCAnbW92ZUl0ZW1CZXR3ZWVuUGFuZXMnKS5hbmRDYWxsVGhyb3VnaCgpXG4gICAgICAgIHRhYkJhci5vbkRyb3AoZHJvcEV2ZW50KVxuXG4gICAgICAgIHdhaXRzRm9yIC0+XG4gICAgICAgICAgdGFiQmFyLm1vdmVJdGVtQmV0d2VlblBhbmVzLmNhbGxDb3VudCA+IDBcblxuICAgICAgICBydW5zIC0+XG4gICAgICAgICAgZXhwZWN0KGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKS5nZXRUZXh0KCkpLnRvQmUgJ0kgaGF2ZSBubyBwYXRoJ1xuICAgICAgICAgIGV4cGVjdChhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCkuZ2V0UGF0aCgpKS50b0JlVW5kZWZpbmVkKClcblxuICAgIGlmIGF0b20ud29ya3NwYWNlLmdldExlZnREb2NrP1xuICAgICAgZGVzY3JpYmUgXCJ3aGVuIGEgdGFiIGlzIGRyYWdnZWQgdG8gYW5vdGhlciBwYW5lIGNvbnRhaW5lclwiLCAtPlxuICAgICAgICBbcGFuZTIsIHRhYkJhcjIsIGRvY2tJdGVtXSA9IFtdXG5cbiAgICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICAgIGphc21pbmUuYXR0YWNoVG9ET00oYXRvbS53b3Jrc3BhY2UuZ2V0RWxlbWVudCgpKVxuICAgICAgICAgIHBhbmUgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKClcbiAgICAgICAgICBwYW5lMiA9IGF0b20ud29ya3NwYWNlLmdldExlZnREb2NrKCkuZ2V0QWN0aXZlUGFuZSgpXG4gICAgICAgICAgZG9ja0l0ZW0gPSBuZXcgVGVzdFZpZXcoJ0RvY2sgSXRlbScpXG4gICAgICAgICAgcGFuZTIuYWRkSXRlbShkb2NrSXRlbSlcbiAgICAgICAgICB0YWJCYXIyID0gbmV3IFRhYkJhclZpZXcocGFuZTIsICdsZWZ0JylcblxuICAgICAgICBpdCBcInJlbW92ZXMgdGhlIHRhYiBhbmQgaXRlbSBmcm9tIHRoZWlyIG9yaWdpbmFsIHBhbmUgYW5kIG1vdmVzIHRoZW0gdG8gdGhlIHRhcmdldCBwYW5lXCIsIC0+XG4gICAgICAgICAgZXhwZWN0KGF0b20ud29ya3NwYWNlLmdldExlZnREb2NrKCkuaXNWaXNpYmxlKCkpLnRvQmUoZmFsc2UpXG5cbiAgICAgICAgICBleHBlY3QodGFiQmFyLmdldFRhYnMoKS5tYXAgKHRhYikgLT4gdGFiLmVsZW1lbnQudGV4dENvbnRlbnQpLnRvRXF1YWwgW1wiSXRlbSAxXCIsIFwic2FtcGxlLmpzXCIsIFwiSXRlbSAyXCJdXG4gICAgICAgICAgZXhwZWN0KHBhbmUuZ2V0SXRlbXMoKSkudG9FcXVhbCBbaXRlbTEsIGVkaXRvcjEsIGl0ZW0yXVxuICAgICAgICAgIGV4cGVjdChwYW5lLmdldEFjdGl2ZUl0ZW0oKSkudG9CZShpdGVtMilcblxuICAgICAgICAgIGV4cGVjdCh0YWJCYXIyLmdldFRhYnMoKS5tYXAgKHRhYikgLT4gdGFiLmVsZW1lbnQudGV4dENvbnRlbnQpLnRvRXF1YWwgW1wiRG9jayBJdGVtXCJdXG4gICAgICAgICAgZXhwZWN0KHBhbmUyLmdldEl0ZW1zKCkpLnRvRXF1YWwgW2RvY2tJdGVtXVxuICAgICAgICAgIGV4cGVjdChwYW5lMi5nZXRBY3RpdmVJdGVtKCkpLnRvQmUoZG9ja0l0ZW0pXG5cbiAgICAgICAgICBbZHJhZ1N0YXJ0RXZlbnQsIGRyb3BFdmVudF0gPSBidWlsZERyYWdFdmVudHModGFiQmFyLnRhYkF0SW5kZXgoMCkuZWxlbWVudCwgdGFiQmFyMi5lbGVtZW50KVxuICAgICAgICAgIHRhYkJhci5vbkRyYWdTdGFydChkcmFnU3RhcnRFdmVudClcbiAgICAgICAgICBleHBlY3QodGFiQmFyMi5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGFjZWhvbGRlcicpKS50b0JlTnVsbCgpXG4gICAgICAgICAgdGFiQmFyMi5vbkRyYWdPdmVyKGRyb3BFdmVudClcbiAgICAgICAgICBleHBlY3QodGFiQmFyMi5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGFjZWhvbGRlcicpKS5ub3QudG9CZU51bGwoKVxuICAgICAgICAgIHRhYkJhcjIub25Ecm9wKGRyb3BFdmVudClcbiAgICAgICAgICBleHBlY3QodGFiQmFyMi5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGFjZWhvbGRlcicpKS50b0JlTnVsbCgpXG5cbiAgICAgICAgICBleHBlY3QodGFiQmFyLmdldFRhYnMoKS5tYXAgKHRhYikgLT4gdGFiLmVsZW1lbnQudGV4dENvbnRlbnQpLnRvRXF1YWwgW1wic2FtcGxlLmpzXCIsIFwiSXRlbSAyXCJdXG4gICAgICAgICAgZXhwZWN0KHBhbmUuZ2V0SXRlbXMoKSkudG9FcXVhbCBbZWRpdG9yMSwgaXRlbTJdXG4gICAgICAgICAgZXhwZWN0KHBhbmUuZ2V0QWN0aXZlSXRlbSgpKS50b0JlIGl0ZW0yXG5cbiAgICAgICAgICBleHBlY3QodGFiQmFyMi5nZXRUYWJzKCkubWFwICh0YWIpIC0+IHRhYi5lbGVtZW50LnRleHRDb250ZW50KS50b0VxdWFsIFtcIkRvY2sgSXRlbVwiLCBcIkl0ZW0gMVwiXVxuICAgICAgICAgIGV4cGVjdChwYW5lMi5nZXRJdGVtcygpKS50b0VxdWFsIFtkb2NrSXRlbSwgaXRlbTFdXG4gICAgICAgICAgZXhwZWN0KHBhbmUyLmFjdGl2ZUl0ZW0pLnRvQmUgaXRlbTFcbiAgICAgICAgICBleHBlY3QoYXRvbS53b3Jrc3BhY2UuZ2V0TGVmdERvY2soKS5pc1Zpc2libGUoKSkudG9CZSh0cnVlKVxuXG4gICAgICAgIGl0IFwic2hvd3MgYSBwbGFjZWhvbGRlciBhbmQgYWxsb3dzIHRoZSB0YWIgYmUgZHJvcHBlZCBvbmx5IGlmIHRoZSBpdGVtIHN1cHBvcnRzIHRoZSB0YXJnZXQgcGFuZSBjb250YWluZXIgbG9jYXRpb25cIiwgLT5cbiAgICAgICAgICBpdGVtMS5nZXRBbGxvd2VkTG9jYXRpb25zID0gLT4gWydjZW50ZXInLCAnYm90dG9tJ11cbiAgICAgICAgICBbZHJhZ1N0YXJ0RXZlbnQsIGRyb3BFdmVudF0gPSBidWlsZERyYWdFdmVudHModGFiQmFyLnRhYkF0SW5kZXgoMCkuZWxlbWVudCwgdGFiQmFyMi5lbGVtZW50KVxuICAgICAgICAgIHRhYkJhci5vbkRyYWdTdGFydChkcmFnU3RhcnRFdmVudClcbiAgICAgICAgICBleHBlY3QodGFiQmFyMi5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGFjZWhvbGRlcicpKS50b0JlTnVsbCgpXG4gICAgICAgICAgdGFiQmFyMi5vbkRyYWdPdmVyKGRyb3BFdmVudClcbiAgICAgICAgICBleHBlY3QodGFiQmFyMi5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGFjZWhvbGRlcicpKS50b0JlTnVsbCgpXG4gICAgICAgICAgdGFiQmFyMi5vbkRyb3AoZHJvcEV2ZW50KVxuICAgICAgICAgIGV4cGVjdCh0YWJCYXIyLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLnBsYWNlaG9sZGVyJykpLnRvQmVOdWxsKClcbiAgICAgICAgICBleHBlY3QocGFuZS5nZXRJdGVtcygpKS50b0VxdWFsIFtpdGVtMSwgZWRpdG9yMSwgaXRlbTJdXG4gICAgICAgICAgZXhwZWN0KHBhbmUyLmdldEl0ZW1zKCkpLnRvRXF1YWwgW2RvY2tJdGVtXVxuXG4gICAgICAgICAgaXRlbTEuZ2V0QWxsb3dlZExvY2F0aW9ucyA9IC0+IFsnbGVmdCddXG4gICAgICAgICAgW2RyYWdTdGFydEV2ZW50LCBkcm9wRXZlbnRdID0gYnVpbGREcmFnRXZlbnRzKHRhYkJhci50YWJBdEluZGV4KDApLmVsZW1lbnQsIHRhYkJhcjIuZWxlbWVudClcbiAgICAgICAgICB0YWJCYXIub25EcmFnU3RhcnQoZHJhZ1N0YXJ0RXZlbnQpXG4gICAgICAgICAgZXhwZWN0KHRhYkJhcjIuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcucGxhY2Vob2xkZXInKSkudG9CZU51bGwoKVxuICAgICAgICAgIHRhYkJhcjIub25EcmFnT3Zlcihkcm9wRXZlbnQpXG4gICAgICAgICAgZXhwZWN0KHRhYkJhcjIuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcucGxhY2Vob2xkZXInKSkubm90LnRvQmVOdWxsKClcbiAgICAgICAgICB0YWJCYXIyLm9uRHJvcChkcm9wRXZlbnQpXG4gICAgICAgICAgZXhwZWN0KHRhYkJhcjIuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcucGxhY2Vob2xkZXInKSkudG9CZU51bGwoKVxuICAgICAgICAgIGV4cGVjdChwYW5lLmdldEl0ZW1zKCkpLnRvRXF1YWwgW2VkaXRvcjEsIGl0ZW0yXVxuICAgICAgICAgIGV4cGVjdChwYW5lMi5nZXRJdGVtcygpKS50b0VxdWFsIFtkb2NrSXRlbSwgaXRlbTFdXG5cbiAgZGVzY3JpYmUgXCJ3aGVuIHRoZSB0YWIgYmFyIGlzIGRvdWJsZSBjbGlja2VkXCIsIC0+XG4gICAgaXQgXCJvcGVucyBhIG5ldyBlbXB0eSBlZGl0b3JcIiwgLT5cbiAgICAgIG5ld0ZpbGVIYW5kbGVyID0gamFzbWluZS5jcmVhdGVTcHkoJ25ld0ZpbGVIYW5kbGVyJylcbiAgICAgIGF0b20uY29tbWFuZHMuYWRkKHRhYkJhci5lbGVtZW50LCAnYXBwbGljYXRpb246bmV3LWZpbGUnLCBuZXdGaWxlSGFuZGxlcilcblxuICAgICAgdHJpZ2dlck1vdXNlRXZlbnQoXCJkYmxjbGlja1wiLCB0YWJCYXIuZ2V0VGFicygpWzBdLmVsZW1lbnQpXG4gICAgICBleHBlY3QobmV3RmlsZUhhbmRsZXIuY2FsbENvdW50KS50b0JlIDBcblxuICAgICAgdHJpZ2dlck1vdXNlRXZlbnQoXCJkYmxjbGlja1wiLCB0YWJCYXIuZWxlbWVudClcbiAgICAgIGV4cGVjdChuZXdGaWxlSGFuZGxlci5jYWxsQ291bnQpLnRvQmUgMVxuXG4gIGRlc2NyaWJlIFwid2hlbiB0aGUgbW91c2Ugd2hlZWwgaXMgdXNlZCBvbiB0aGUgdGFiIGJhclwiLCAtPlxuICAgIGRlc2NyaWJlIFwid2hlbiB0YWJTY3JvbGxpbmcgaXMgdHJ1ZSBpbiBwYWNrYWdlIHNldHRpbmdzXCIsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIGF0b20uY29uZmlnLnNldChcInRhYnMudGFiU2Nyb2xsaW5nXCIsIHRydWUpXG4gICAgICAgIGF0b20uY29uZmlnLnNldChcInRhYnMudGFiU2Nyb2xsaW5nVGhyZXNob2xkXCIsIDEyMClcblxuICAgICAgZGVzY3JpYmUgXCJ3aGVuIHRoZSBtb3VzZSB3aGVlbCBzY3JvbGxzIHVwXCIsIC0+XG4gICAgICAgIGl0IFwiY2hhbmdlcyB0aGUgYWN0aXZlIHRhYiB0byB0aGUgcHJldmlvdXMgdGFiXCIsIC0+XG4gICAgICAgICAgZXhwZWN0KHBhbmUuZ2V0QWN0aXZlSXRlbSgpKS50b0JlIGl0ZW0yXG4gICAgICAgICAgdGFiQmFyLmVsZW1lbnQuZGlzcGF0Y2hFdmVudChidWlsZFdoZWVsRXZlbnQoMTIwKSlcbiAgICAgICAgICBleHBlY3QocGFuZS5nZXRBY3RpdmVJdGVtKCkpLnRvQmUgZWRpdG9yMVxuXG4gICAgICAgIGl0IFwiY2hhbmdlcyB0aGUgYWN0aXZlIHRhYiB0byB0aGUgcHJldmlvdXMgdGFiIG9ubHkgYWZ0ZXIgdGhlIHdoZWVsRGVsdGEgY3Jvc3NlcyB0aGUgdGhyZXNob2xkXCIsIC0+XG4gICAgICAgICAgZXhwZWN0KHBhbmUuZ2V0QWN0aXZlSXRlbSgpKS50b0JlIGl0ZW0yXG4gICAgICAgICAgdGFiQmFyLmVsZW1lbnQuZGlzcGF0Y2hFdmVudChidWlsZFdoZWVsRXZlbnQoNTApKVxuICAgICAgICAgIGV4cGVjdChwYW5lLmdldEFjdGl2ZUl0ZW0oKSkudG9CZSBpdGVtMlxuICAgICAgICAgIHRhYkJhci5lbGVtZW50LmRpc3BhdGNoRXZlbnQoYnVpbGRXaGVlbEV2ZW50KDUwKSlcbiAgICAgICAgICBleHBlY3QocGFuZS5nZXRBY3RpdmVJdGVtKCkpLnRvQmUgaXRlbTJcbiAgICAgICAgICB0YWJCYXIuZWxlbWVudC5kaXNwYXRjaEV2ZW50KGJ1aWxkV2hlZWxFdmVudCg1MCkpXG4gICAgICAgICAgZXhwZWN0KHBhbmUuZ2V0QWN0aXZlSXRlbSgpKS50b0JlIGVkaXRvcjFcblxuICAgICAgZGVzY3JpYmUgXCJ3aGVuIHRoZSBtb3VzZSB3aGVlbCBzY3JvbGxzIGRvd25cIiwgLT5cbiAgICAgICAgaXQgXCJjaGFuZ2VzIHRoZSBhY3RpdmUgdGFiIHRvIHRoZSBwcmV2aW91cyB0YWJcIiwgLT5cbiAgICAgICAgICBleHBlY3QocGFuZS5nZXRBY3RpdmVJdGVtKCkpLnRvQmUgaXRlbTJcbiAgICAgICAgICB0YWJCYXIuZWxlbWVudC5kaXNwYXRjaEV2ZW50KGJ1aWxkV2hlZWxFdmVudCgtMTIwKSlcbiAgICAgICAgICBleHBlY3QocGFuZS5nZXRBY3RpdmVJdGVtKCkpLnRvQmUgaXRlbTFcblxuICAgICAgZGVzY3JpYmUgXCJ3aGVuIHRoZSBtb3VzZSB3aGVlbCBzY3JvbGxzIHVwIGFuZCBzaGlmdCBrZXkgaXMgcHJlc3NlZFwiLCAtPlxuICAgICAgICBpdCBcImRvZXMgbm90IGNoYW5nZSB0aGUgYWN0aXZlIHRhYlwiLCAtPlxuICAgICAgICAgIGV4cGVjdChwYW5lLmdldEFjdGl2ZUl0ZW0oKSkudG9CZSBpdGVtMlxuICAgICAgICAgIHRhYkJhci5lbGVtZW50LmRpc3BhdGNoRXZlbnQoYnVpbGRXaGVlbFBsdXNTaGlmdEV2ZW50KDEyMCkpXG4gICAgICAgICAgZXhwZWN0KHBhbmUuZ2V0QWN0aXZlSXRlbSgpKS50b0JlIGl0ZW0yXG5cbiAgICAgIGRlc2NyaWJlIFwid2hlbiB0aGUgbW91c2Ugd2hlZWwgc2Nyb2xscyBkb3duIGFuZCBzaGlmdCBrZXkgaXMgcHJlc3NlZFwiLCAtPlxuICAgICAgICBpdCBcImRvZXMgbm90IGNoYW5nZSB0aGUgYWN0aXZlIHRhYlwiLCAtPlxuICAgICAgICAgIGV4cGVjdChwYW5lLmdldEFjdGl2ZUl0ZW0oKSkudG9CZSBpdGVtMlxuICAgICAgICAgIHRhYkJhci5lbGVtZW50LmRpc3BhdGNoRXZlbnQoYnVpbGRXaGVlbFBsdXNTaGlmdEV2ZW50KC0xMjApKVxuICAgICAgICAgIGV4cGVjdChwYW5lLmdldEFjdGl2ZUl0ZW0oKSkudG9CZSBpdGVtMlxuXG4gICAgZGVzY3JpYmUgXCJ3aGVuIHRhYlNjcm9sbGluZyBpcyBmYWxzZSBpbiBwYWNrYWdlIHNldHRpbmdzXCIsIC0+XG4gICAgICBiZWZvcmVFYWNoIC0+XG4gICAgICAgIGF0b20uY29uZmlnLnNldChcInRhYnMudGFiU2Nyb2xsaW5nXCIsIGZhbHNlKVxuXG4gICAgICBkZXNjcmliZSBcIndoZW4gdGhlIG1vdXNlIHdoZWVsIHNjcm9sbHMgdXAgb25lIHVuaXRcIiwgLT5cbiAgICAgICAgaXQgXCJkb2VzIG5vdCBjaGFuZ2UgdGhlIGFjdGl2ZSB0YWJcIiwgLT5cbiAgICAgICAgICBleHBlY3QocGFuZS5nZXRBY3RpdmVJdGVtKCkpLnRvQmUgaXRlbTJcbiAgICAgICAgICB0YWJCYXIuZWxlbWVudC5kaXNwYXRjaEV2ZW50KGJ1aWxkV2hlZWxFdmVudCgxMjApKVxuICAgICAgICAgIGV4cGVjdChwYW5lLmdldEFjdGl2ZUl0ZW0oKSkudG9CZSBpdGVtMlxuXG4gICAgICBkZXNjcmliZSBcIndoZW4gdGhlIG1vdXNlIHdoZWVsIHNjcm9sbHMgZG93biBvbmUgdW5pdFwiLCAtPlxuICAgICAgICBpdCBcImRvZXMgbm90IGNoYW5nZSB0aGUgYWN0aXZlIHRhYlwiLCAtPlxuICAgICAgICAgIGV4cGVjdChwYW5lLmdldEFjdGl2ZUl0ZW0oKSkudG9CZSBpdGVtMlxuICAgICAgICAgIHRhYkJhci5lbGVtZW50LmRpc3BhdGNoRXZlbnQoYnVpbGRXaGVlbEV2ZW50KC0xMjApKVxuICAgICAgICAgIGV4cGVjdChwYW5lLmdldEFjdGl2ZUl0ZW0oKSkudG9CZSBpdGVtMlxuXG4gIGRlc2NyaWJlIFwid2hlbiBhbHdheXNTaG93VGFiQmFyIGlzIHRydWUgaW4gcGFja2FnZSBzZXR0aW5nc1wiLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIGF0b20uY29uZmlnLnNldChcInRhYnMuYWx3YXlzU2hvd1RhYkJhclwiLCB0cnVlKVxuXG4gICAgZGVzY3JpYmUgXCJ3aGVuIDIgdGFicyBhcmUgb3BlblwiLCAtPlxuICAgICAgaXQgXCJzaG93cyB0aGUgdGFiIGJhclwiLCAtPlxuICAgICAgICBleHBlY3QocGFuZS5nZXRJdGVtcygpLmxlbmd0aCkudG9CZSAzXG4gICAgICAgIGV4cGVjdCh0YWJCYXIpLm5vdC50b0hhdmVDbGFzcyAnaGlkZGVuJ1xuXG4gICAgZGVzY3JpYmUgXCJ3aGVuIDEgdGFiIGlzIG9wZW5cIiwgLT5cbiAgICAgIGl0IFwic2hvd3MgdGhlIHRhYiBiYXJcIiwgLT5cbiAgICAgICAgZXhwZWN0KHBhbmUuZ2V0SXRlbXMoKS5sZW5ndGgpLnRvQmUgM1xuICAgICAgICBwYW5lLmRlc3Ryb3lJdGVtKGl0ZW0xKVxuICAgICAgICBwYW5lLmRlc3Ryb3lJdGVtKGl0ZW0yKVxuICAgICAgICBleHBlY3QocGFuZS5nZXRJdGVtcygpLmxlbmd0aCkudG9CZSAxXG4gICAgICAgIGV4cGVjdCh0YWJCYXIpLm5vdC50b0hhdmVDbGFzcyAnaGlkZGVuJ1xuXG4gIGRlc2NyaWJlIFwid2hlbiBhbHdheXNTaG93VGFiQmFyIGlzIGZhbHNlIGluIHBhY2thZ2Ugc2V0dGluZ3NcIiwgLT5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBhdG9tLmNvbmZpZy5zZXQoXCJ0YWJzLmFsd2F5c1Nob3dUYWJCYXJcIiwgZmFsc2UpXG5cbiAgICBkZXNjcmliZSBcIndoZW4gMiB0YWJzIGFyZSBvcGVuXCIsIC0+XG4gICAgICBpdCBcInNob3dzIHRoZSB0YWIgYmFyXCIsIC0+XG4gICAgICAgIGV4cGVjdChwYW5lLmdldEl0ZW1zKCkubGVuZ3RoKS50b0JlIDNcbiAgICAgICAgZXhwZWN0KHRhYkJhcikubm90LnRvSGF2ZUNsYXNzICdoaWRkZW4nXG5cbiAgICBkZXNjcmliZSBcIndoZW4gMSB0YWIgaXMgb3BlblwiLCAtPlxuICAgICAgaXQgXCJoaWRlcyB0aGUgdGFiIGJhclwiLCAtPlxuICAgICAgICBleHBlY3QocGFuZS5nZXRJdGVtcygpLmxlbmd0aCkudG9CZSAzXG4gICAgICAgIHBhbmUuZGVzdHJveUl0ZW0oaXRlbTEpXG4gICAgICAgIHBhbmUuZGVzdHJveUl0ZW0oaXRlbTIpXG4gICAgICAgIGV4cGVjdChwYW5lLmdldEl0ZW1zKCkubGVuZ3RoKS50b0JlIDFcbiAgICAgICAgZXhwZWN0KHRhYkJhci5lbGVtZW50KS50b0hhdmVDbGFzcyAnaGlkZGVuJ1xuXG4gIGlmIGF0b20ud29ya3NwYWNlLmJ1aWxkVGV4dEVkaXRvcigpLmlzUGVuZGluZz8gb3IgYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpLmdldEFjdGl2ZUl0ZW0/XG4gICAgaXNQZW5kaW5nID0gKGl0ZW0pIC0+XG4gICAgICBpZiBpdGVtLmlzUGVuZGluZz9cbiAgICAgICAgaXRlbS5pc1BlbmRpbmcoKVxuICAgICAgZWxzZVxuICAgICAgICBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKCkuZ2V0UGVuZGluZ0l0ZW0oKSBpcyBpdGVtXG5cbiAgICBkZXNjcmliZSBcIndoZW4gdGFiJ3MgcGFuZSBpdGVtIGlzIHBlbmRpbmdcIiwgLT5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgcGFuZS5kZXN0cm95SXRlbXMoKVxuXG4gICAgICBkZXNjcmliZSBcIndoZW4gb3BlbmluZyBhIG5ldyB0YWJcIiwgLT5cbiAgICAgICAgaXQgXCJhZGRzIHRhYiB3aXRoIGNsYXNzICd0ZW1wJ1wiLCAtPlxuICAgICAgICAgIGVkaXRvcjEgPSBudWxsXG4gICAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKCdzYW1wbGUudHh0JywgcGVuZGluZzogdHJ1ZSkudGhlbiAobykgLT4gZWRpdG9yMSA9IG9cblxuICAgICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICAgIHBhbmUuYWN0aXZhdGVJdGVtKGVkaXRvcjEpXG4gICAgICAgICAgICBleHBlY3QodGFiQmFyLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRhYiAudGVtcCcpLmxlbmd0aCkudG9CZSAxXG4gICAgICAgICAgICBleHBlY3QodGFiQmFyLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRhYicpWzBdLnF1ZXJ5U2VsZWN0b3IoJy50aXRsZScpKS50b0hhdmVDbGFzcyAndGVtcCdcblxuICAgICAgZGVzY3JpYmUgXCJ3aGVuIHRhYnM6a2VlcC1wZW5kaW5nLXRhYiBpcyB0cmlnZ2VyZWQgb24gdGhlIHBhbmVcIiwgLT5cbiAgICAgICAgaXQgXCJ0ZXJtaW5hdGVzIHBlbmRpbmcgc3RhdGUgb24gdGhlIHRhYidzIGl0ZW1cIiwgLT5cbiAgICAgICAgICBlZGl0b3IxID0gbnVsbFxuICAgICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3Blbignc2FtcGxlLnR4dCcsIHBlbmRpbmc6IHRydWUpLnRoZW4gKG8pIC0+IGVkaXRvcjEgPSBvXG5cbiAgICAgICAgICBydW5zIC0+XG4gICAgICAgICAgICBwYW5lLmFjdGl2YXRlSXRlbShlZGl0b3IxKVxuICAgICAgICAgICAgZXhwZWN0KGlzUGVuZGluZyhlZGl0b3IxKSkudG9CZSB0cnVlXG4gICAgICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKS5nZXRFbGVtZW50KCksICd0YWJzOmtlZXAtcGVuZGluZy10YWInKVxuICAgICAgICAgICAgZXhwZWN0KGlzUGVuZGluZyhlZGl0b3IxKSkudG9CZSBmYWxzZVxuXG4gICAgICBkZXNjcmliZSBcIndoZW4gdGhlcmUgaXMgYSB0ZW1wIHRhYiBhbHJlYWR5XCIsIC0+XG4gICAgICAgIGl0IFwiaXQgd2lsbCByZXBsYWNlIGFuIGV4aXN0aW5nIHRlbXBvcmFyeSB0YWJcIiwgLT5cbiAgICAgICAgICBlZGl0b3IxID0gbnVsbFxuICAgICAgICAgIGVkaXRvcjIgPSBudWxsXG5cbiAgICAgICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oJ3NhbXBsZS50eHQnLCBwZW5kaW5nOiB0cnVlKS50aGVuIChvKSAtPlxuICAgICAgICAgICAgICBlZGl0b3IxID0gb1xuICAgICAgICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKCdzYW1wbGUyLnR4dCcsIHBlbmRpbmc6IHRydWUpLnRoZW4gKG8pIC0+XG4gICAgICAgICAgICAgICAgZWRpdG9yMiA9IG9cblxuICAgICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICAgIGV4cGVjdChlZGl0b3IxLmlzRGVzdHJveWVkKCkpLnRvQmUgdHJ1ZVxuICAgICAgICAgICAgZXhwZWN0KHRhYkJhci50YWJGb3JJdGVtKGVkaXRvcjEpKS50b0JlVW5kZWZpbmVkKClcbiAgICAgICAgICAgIGV4cGVjdCh0YWJCYXIudGFiRm9ySXRlbShlZGl0b3IyKS5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy50aXRsZScpKS50b0hhdmVDbGFzcyAndGVtcCdcblxuICAgICAgICBpdCBcIm1ha2VzIHRoZSB0YWIgcGVybWFuZW50IHdoZW4gZG91YmxlLWNsaWNraW5nIHRoZSB0YWJcIiwgLT5cbiAgICAgICAgICBlZGl0b3IyID0gbnVsbFxuXG4gICAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKCdzYW1wbGUudHh0JywgcGVuZGluZzogdHJ1ZSkudGhlbiAobykgLT4gZWRpdG9yMiA9IG9cblxuICAgICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICAgIHBhbmUuYWN0aXZhdGVJdGVtKGVkaXRvcjIpXG4gICAgICAgICAgICBleHBlY3QodGFiQmFyLnRhYkZvckl0ZW0oZWRpdG9yMikuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcudGl0bGUnKSkudG9IYXZlQ2xhc3MgJ3RlbXAnXG4gICAgICAgICAgICB0cmlnZ2VyTW91c2VFdmVudCgnZGJsY2xpY2snLCB0YWJCYXIudGFiRm9ySXRlbShlZGl0b3IyKS5lbGVtZW50LCB3aGljaDogMSlcbiAgICAgICAgICAgIGV4cGVjdCh0YWJCYXIudGFiRm9ySXRlbShlZGl0b3IyKS5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy50aXRsZScpKS5ub3QudG9IYXZlQ2xhc3MgJ3RlbXAnXG5cbiAgICAgIGRlc2NyaWJlIFwid2hlbiBlZGl0aW5nIGEgZmlsZSBpbiBwZW5kaW5nIHN0YXRlXCIsIC0+XG4gICAgICAgIGl0IFwibWFrZXMgdGhlIGl0ZW0gYW5kIHRhYiBwZXJtYW5lbnRcIiwgLT5cbiAgICAgICAgICBlZGl0b3IxID0gbnVsbFxuICAgICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3Blbignc2FtcGxlLnR4dCcsIHBlbmRpbmc6IHRydWUpLnRoZW4gKG8pIC0+XG4gICAgICAgICAgICAgIGVkaXRvcjEgPSBvXG4gICAgICAgICAgICAgIHBhbmUuYWN0aXZhdGVJdGVtKGVkaXRvcjEpXG4gICAgICAgICAgICAgIGVkaXRvcjEuaW5zZXJ0VGV4dCgneCcpXG4gICAgICAgICAgICAgIGFkdmFuY2VDbG9jayhlZGl0b3IxLmJ1ZmZlci5zdG9wcGVkQ2hhbmdpbmdEZWxheSlcblxuICAgICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICAgIGV4cGVjdCh0YWJCYXIudGFiRm9ySXRlbShlZGl0b3IxKS5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy50aXRsZScpKS5ub3QudG9IYXZlQ2xhc3MgJ3RlbXAnXG5cbiAgICAgIGRlc2NyaWJlIFwid2hlbiBzYXZpbmcgYSBmaWxlXCIsIC0+XG4gICAgICAgIGl0IFwibWFrZXMgdGhlIHRhYiBwZXJtYW5lbnRcIiwgLT5cbiAgICAgICAgICBlZGl0b3IxID0gbnVsbFxuICAgICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbihwYXRoLmpvaW4odGVtcC5ta2RpclN5bmMoJ3RhYnMtJyksICdzYW1wbGUudHh0JyksIHBlbmRpbmc6IHRydWUpLnRoZW4gKG8pIC0+XG4gICAgICAgICAgICAgIGVkaXRvcjEgPSBvXG4gICAgICAgICAgICAgIHBhbmUuYWN0aXZhdGVJdGVtKGVkaXRvcjEpXG4gICAgICAgICAgICAgIGVkaXRvcjEuc2F2ZSgpXG5cbiAgICAgICAgICBydW5zIC0+XG4gICAgICAgICAgICBleHBlY3QodGFiQmFyLnRhYkZvckl0ZW0oZWRpdG9yMSkuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcudGl0bGUnKSkubm90LnRvSGF2ZUNsYXNzICd0ZW1wJ1xuXG4gICAgICBkZXNjcmliZSBcIndoZW4gc3BsaXR0aW5nIGEgcGVuZGluZyB0YWJcIiwgLT5cbiAgICAgICAgZWRpdG9yMSA9IG51bGxcbiAgICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3Blbignc2FtcGxlLnR4dCcsIHBlbmRpbmc6IHRydWUpLnRoZW4gKG8pIC0+IGVkaXRvcjEgPSBvXG5cbiAgICAgICAgaXQgXCJtYWtlcyB0aGUgdGFiIHBlcm1hbmVudCBpbiB0aGUgbmV3IHBhbmVcIiwgLT5cbiAgICAgICAgICBwYW5lLmFjdGl2YXRlSXRlbShlZGl0b3IxKVxuICAgICAgICAgIHBhbmUyID0gcGFuZS5zcGxpdFJpZ2h0KGNvcHlBY3RpdmVJdGVtOiB0cnVlKVxuICAgICAgICAgIHRhYkJhcjIgPSBuZXcgVGFiQmFyVmlldyhwYW5lMiwgJ2NlbnRlcicpXG4gICAgICAgICAgbmV3RWRpdG9yID0gcGFuZTIuZ2V0QWN0aXZlSXRlbSgpXG4gICAgICAgICAgZXhwZWN0KGlzUGVuZGluZyhuZXdFZGl0b3IpKS50b0JlIGZhbHNlXG4gICAgICAgICAgZXhwZWN0KHRhYkJhcjIudGFiRm9ySXRlbShuZXdFZGl0b3IpLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLnRpdGxlJykpLm5vdC50b0hhdmVDbGFzcyAndGVtcCdcblxuICAgICAgICBpdCBcImtlZXBzIHRoZSBwZW5kaW5nIHRhYiBpbiB0aGUgb2xkIHBhbmVcIiwgLT5cbiAgICAgICAgICBleHBlY3QoaXNQZW5kaW5nKGVkaXRvcjEpKS50b0JlIHRydWVcbiAgICAgICAgICBleHBlY3QodGFiQmFyLnRhYkZvckl0ZW0oZWRpdG9yMSkuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcudGl0bGUnKSkudG9IYXZlQ2xhc3MgJ3RlbXAnXG5cbiAgICAgIGRlc2NyaWJlIFwid2hlbiBkcmFnZ2luZyBhIHBlbmRpbmcgdGFiIHRvIGEgZGlmZmVyZW50IHBhbmVcIiwgLT5cbiAgICAgICAgaXQgXCJtYWtlcyB0aGUgdGFiIHBlcm1hbmVudCBpbiB0aGUgb3RoZXIgcGFuZVwiLCAtPlxuICAgICAgICAgIGVkaXRvcjEgPSBudWxsXG4gICAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKCdzYW1wbGUudHh0JywgcGVuZGluZzogdHJ1ZSkudGhlbiAobykgLT4gZWRpdG9yMSA9IG9cblxuICAgICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICAgIHBhbmUuYWN0aXZhdGVJdGVtKGVkaXRvcjEpXG4gICAgICAgICAgICBwYW5lMiA9IHBhbmUuc3BsaXRSaWdodCgpXG5cbiAgICAgICAgICAgIHRhYkJhcjIgPSBuZXcgVGFiQmFyVmlldyhwYW5lMiwgJ2NlbnRlcicpXG4gICAgICAgICAgICB0YWJCYXIyLm1vdmVJdGVtQmV0d2VlblBhbmVzKHBhbmUsIDAsIHBhbmUyLCAxLCBlZGl0b3IxKVxuXG4gICAgICAgICAgICBleHBlY3QodGFiQmFyMi50YWJGb3JJdGVtKHBhbmUyLmdldEFjdGl2ZUl0ZW0oKSkuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcudGl0bGUnKSkubm90LnRvSGF2ZUNsYXNzICd0ZW1wJ1xuXG4gIGRlc2NyaWJlIFwiaW50ZWdyYXRpb24gd2l0aCB2ZXJzaW9uIGNvbnRyb2wgc3lzdGVtc1wiLCAtPlxuICAgIFtyZXBvc2l0b3J5LCB0YWIsIHRhYjFdID0gW11cblxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIHRhYiA9IHRhYkJhci50YWJGb3JJdGVtKGVkaXRvcjEpXG4gICAgICBzcHlPbih0YWIsICdzZXR1cFZjc1N0YXR1cycpLmFuZENhbGxUaHJvdWdoKClcbiAgICAgIHNweU9uKHRhYiwgJ3VwZGF0ZVZjc1N0YXR1cycpLmFuZENhbGxUaHJvdWdoKClcblxuICAgICAgdGFiMSA9IHRhYkJhci50YWJGb3JJdGVtKGl0ZW0xKVxuICAgICAgdGFiMS5wYXRoID0gJy9zb21lL3BhdGgvb3V0c2lkZS90aGUvcmVwb3NpdG9yeSdcbiAgICAgIHNweU9uKHRhYjEsICd1cGRhdGVWY3NTdGF0dXMnKS5hbmRDYWxsVGhyb3VnaCgpXG5cbiAgICAgICMgTW9jayB0aGUgcmVwb3NpdG9yeVxuICAgICAgcmVwb3NpdG9yeSA9IGphc21pbmUuY3JlYXRlU3B5T2JqICdyZXBvJywgWydpc1BhdGhJZ25vcmVkJywgJ2dldENhY2hlZFBhdGhTdGF0dXMnLCAnaXNTdGF0dXNOZXcnLCAnaXNTdGF0dXNNb2RpZmllZCddXG4gICAgICByZXBvc2l0b3J5LmlzU3RhdHVzTmV3LmFuZENhbGxGYWtlIChzdGF0dXMpIC0+IHN0YXR1cyBpcyAnbmV3J1xuICAgICAgcmVwb3NpdG9yeS5pc1N0YXR1c01vZGlmaWVkLmFuZENhbGxGYWtlIChzdGF0dXMpIC0+IHN0YXR1cyBpcyAnbW9kaWZpZWQnXG5cbiAgICAgIHJlcG9zaXRvcnkub25EaWRDaGFuZ2VTdGF0dXMgPSAoY2FsbGJhY2spIC0+XG4gICAgICAgIEBjaGFuZ2VTdGF0dXNDYWxsYmFja3MgPz0gW11cbiAgICAgICAgQGNoYW5nZVN0YXR1c0NhbGxiYWNrcy5wdXNoKGNhbGxiYWNrKVxuICAgICAgICBkaXNwb3NlOiA9PiBfLnJlbW92ZShAY2hhbmdlU3RhdHVzQ2FsbGJhY2tzLCBjYWxsYmFjaylcbiAgICAgIHJlcG9zaXRvcnkuZW1pdERpZENoYW5nZVN0YXR1cyA9IChldmVudCkgLT5cbiAgICAgICAgY2FsbGJhY2soZXZlbnQpIGZvciBjYWxsYmFjayBpbiBAY2hhbmdlU3RhdHVzQ2FsbGJhY2tzID8gW11cblxuICAgICAgcmVwb3NpdG9yeS5vbkRpZENoYW5nZVN0YXR1c2VzID0gKGNhbGxiYWNrKSAtPlxuICAgICAgICBAY2hhbmdlU3RhdHVzZXNDYWxsYmFja3MgPz0gW11cbiAgICAgICAgQGNoYW5nZVN0YXR1c2VzQ2FsbGJhY2tzLnB1c2goY2FsbGJhY2spXG4gICAgICAgIGRpc3Bvc2U6ID0+IF8ucmVtb3ZlKEBjaGFuZ2VTdGF0dXNlc0NhbGxiYWNrcywgY2FsbGJhY2spXG4gICAgICByZXBvc2l0b3J5LmVtaXREaWRDaGFuZ2VTdGF0dXNlcyA9IChldmVudCkgLT5cbiAgICAgICAgY2FsbGJhY2soZXZlbnQpIGZvciBjYWxsYmFjayBpbiBAY2hhbmdlU3RhdHVzZXNDYWxsYmFja3MgPyBbXVxuXG4gICAgICAjIE1vY2sgYXRvbS5wcm9qZWN0IHRvIHByZXRlbmQgd2UgYXJlIHdvcmtpbmcgd2l0aGluIGEgcmVwb3NpdG9yeVxuICAgICAgc3B5T24oYXRvbS5wcm9qZWN0LCAncmVwb3NpdG9yeUZvckRpcmVjdG9yeScpLmFuZFJldHVybiBQcm9taXNlLnJlc29sdmUocmVwb3NpdG9yeSlcblxuICAgICAgYXRvbS5jb25maWcuc2V0IFwidGFicy5lbmFibGVWY3NDb2xvcmluZ1wiLCB0cnVlXG5cbiAgICAgIHdhaXRzRm9yIC0+XG4gICAgICAgIHJlcG9zaXRvcnkuY2hhbmdlU3RhdHVzQ2FsbGJhY2tzPy5sZW5ndGggPiAwXG5cbiAgICBkZXNjcmliZSBcIndoZW4gd29ya2luZyBpbnNpZGUgYSBWQ1MgcmVwb3NpdG9yeVwiLCAtPlxuICAgICAgaXQgXCJhZGRzIGN1c3RvbSBzdHlsZSBmb3IgbmV3IGl0ZW1zXCIsIC0+XG4gICAgICAgIHJlcG9zaXRvcnkuZ2V0Q2FjaGVkUGF0aFN0YXR1cy5hbmRSZXR1cm4gJ25ldydcbiAgICAgICAgdGFiLnVwZGF0ZVZjc1N0YXR1cyhyZXBvc2l0b3J5KVxuICAgICAgICBleHBlY3QodGFiQmFyLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRhYicpWzFdLnF1ZXJ5U2VsZWN0b3IoJy50aXRsZScpKS50b0hhdmVDbGFzcyBcInN0YXR1cy1hZGRlZFwiXG5cbiAgICAgIGl0IFwiYWRkcyBjdXN0b20gc3R5bGUgZm9yIG1vZGlmaWVkIGl0ZW1zXCIsIC0+XG4gICAgICAgIHJlcG9zaXRvcnkuZ2V0Q2FjaGVkUGF0aFN0YXR1cy5hbmRSZXR1cm4gJ21vZGlmaWVkJ1xuICAgICAgICB0YWIudXBkYXRlVmNzU3RhdHVzKHJlcG9zaXRvcnkpXG4gICAgICAgIGV4cGVjdCh0YWJCYXIuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudGFiJylbMV0ucXVlcnlTZWxlY3RvcignLnRpdGxlJykpLnRvSGF2ZUNsYXNzIFwic3RhdHVzLW1vZGlmaWVkXCJcblxuICAgICAgaXQgXCJhZGRzIGN1c3RvbSBzdHlsZSBmb3IgaWdub3JlZCBpdGVtc1wiLCAtPlxuICAgICAgICByZXBvc2l0b3J5LmlzUGF0aElnbm9yZWQuYW5kUmV0dXJuIHRydWVcbiAgICAgICAgdGFiLnVwZGF0ZVZjc1N0YXR1cyhyZXBvc2l0b3J5KVxuICAgICAgICBleHBlY3QodGFiQmFyLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRhYicpWzFdLnF1ZXJ5U2VsZWN0b3IoJy50aXRsZScpKS50b0hhdmVDbGFzcyBcInN0YXR1cy1pZ25vcmVkXCJcblxuICAgICAgaXQgXCJkb2VzIG5vdCBhZGQgYW55IHN0eWxlcyBmb3IgaXRlbXMgbm90IGluIHRoZSByZXBvc2l0b3J5XCIsIC0+XG4gICAgICAgIGV4cGVjdCh0YWJCYXIuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudGFiJylbMF0ucXVlcnlTZWxlY3RvcignLnRpdGxlJykpLm5vdC50b0hhdmVDbGFzcyBcInN0YXR1cy1hZGRlZFwiXG4gICAgICAgIGV4cGVjdCh0YWJCYXIuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudGFiJylbMF0ucXVlcnlTZWxlY3RvcignLnRpdGxlJykpLm5vdC50b0hhdmVDbGFzcyBcInN0YXR1cy1tb2RpZmllZFwiXG4gICAgICAgIGV4cGVjdCh0YWJCYXIuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudGFiJylbMF0ucXVlcnlTZWxlY3RvcignLnRpdGxlJykpLm5vdC50b0hhdmVDbGFzcyBcInN0YXR1cy1pZ25vcmVkXCJcblxuICAgIGRlc2NyaWJlIFwid2hlbiBjaGFuZ2VzIGluIGl0ZW0gc3RhdHVzZXMgYXJlIG5vdGlmaWVkXCIsIC0+XG4gICAgICBpdCBcInVwZGF0ZXMgc3RhdHVzIGZvciBpdGVtcyBpbiB0aGUgcmVwb3NpdG9yeVwiLCAtPlxuICAgICAgICB0YWIudXBkYXRlVmNzU3RhdHVzLnJlc2V0KClcbiAgICAgICAgcmVwb3NpdG9yeS5lbWl0RGlkQ2hhbmdlU3RhdHVzZXMoKVxuICAgICAgICBleHBlY3QodGFiLnVwZGF0ZVZjc1N0YXR1cy5jYWxscy5sZW5ndGgpLnRvRXF1YWwgMVxuXG4gICAgICBpdCBcInVwZGF0ZXMgdGhlIHN0YXR1cyBvZiBhbiBpdGVtIGlmIGl0IGhhcyBjaGFuZ2VkXCIsIC0+XG4gICAgICAgIHJlcG9zaXRvcnkuZ2V0Q2FjaGVkUGF0aFN0YXR1cy5yZXNldCgpXG4gICAgICAgIGV4cGVjdCh0YWJCYXIuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudGFiJylbMV0ucXVlcnlTZWxlY3RvcignLnRpdGxlJykpLm5vdC50b0hhdmVDbGFzcyBcInN0YXR1cy1tb2RpZmllZFwiXG4gICAgICAgIHJlcG9zaXRvcnkuZW1pdERpZENoYW5nZVN0YXR1cyB7cGF0aDogdGFiLnBhdGgsIHBhdGhTdGF0dXM6IFwibW9kaWZpZWRcIn1cbiAgICAgICAgZXhwZWN0KHRhYkJhci5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWInKVsxXS5xdWVyeVNlbGVjdG9yKCcudGl0bGUnKSkudG9IYXZlQ2xhc3MgXCJzdGF0dXMtbW9kaWZpZWRcIlxuICAgICAgICBleHBlY3QocmVwb3NpdG9yeS5nZXRDYWNoZWRQYXRoU3RhdHVzLmNhbGxzLmxlbmd0aCkudG9CZSAwXG5cbiAgICAgIGl0IFwiZG9lcyBub3QgdXBkYXRlIHN0YXR1cyBmb3IgaXRlbXMgbm90IGluIHRoZSByZXBvc2l0b3J5XCIsIC0+XG4gICAgICAgIHRhYjEudXBkYXRlVmNzU3RhdHVzLnJlc2V0KClcbiAgICAgICAgcmVwb3NpdG9yeS5lbWl0RGlkQ2hhbmdlU3RhdHVzZXMoKVxuICAgICAgICBleHBlY3QodGFiMS51cGRhdGVWY3NTdGF0dXMuY2FsbHMubGVuZ3RoKS50b0VxdWFsIDBcblxuICAgIGRlc2NyaWJlIFwid2hlbiBhbiBpdGVtIGlzIHNhdmVkXCIsIC0+XG4gICAgICBpdCBcImRvZXMgbm90IHVwZGF0ZSBWQ1Mgc3Vic2NyaXB0aW9uIGlmIHRoZSBpdGVtJ3MgcGF0aCByZW1haW5zIHRoZSBzYW1lXCIsIC0+XG4gICAgICAgIHRhYi5zZXR1cFZjc1N0YXR1cy5yZXNldCgpXG4gICAgICAgIHRhYi5pdGVtLmJ1ZmZlci5lbWl0dGVyLmVtaXQgJ2RpZC1zYXZlJywge3BhdGg6IHRhYi5wYXRofVxuICAgICAgICBleHBlY3QodGFiLnNldHVwVmNzU3RhdHVzLmNhbGxzLmxlbmd0aCkudG9CZSAwXG5cbiAgICAgIGl0IFwidXBkYXRlcyBWQ1Mgc3Vic2NyaXB0aW9uIGlmIHRoZSBpdGVtJ3MgcGF0aCBoYXMgY2hhbmdlZFwiLCAtPlxuICAgICAgICB0YWIuc2V0dXBWY3NTdGF0dXMucmVzZXQoKVxuICAgICAgICB0YWIuaXRlbS5idWZmZXIuZW1pdHRlci5lbWl0ICdkaWQtc2F2ZScsIHtwYXRoOiAnL3NvbWUvb3RoZXIvcGF0aCd9XG4gICAgICAgIGV4cGVjdCh0YWIuc2V0dXBWY3NTdGF0dXMuY2FsbHMubGVuZ3RoKS50b0JlIDFcblxuICAgIGRlc2NyaWJlIFwid2hlbiBlbmFibGVWY3NDb2xvcmluZyBjaGFuZ2VzIGluIHBhY2thZ2Ugc2V0dGluZ3NcIiwgLT5cbiAgICAgIGl0IFwicmVtb3ZlcyBzdGF0dXMgZnJvbSB0aGUgdGFiIGlmIGVuYWJsZVZjc0NvbG9yaW5nIGlzIHNldCB0byBmYWxzZVwiLCAtPlxuICAgICAgICByZXBvc2l0b3J5LmVtaXREaWRDaGFuZ2VTdGF0dXMge3BhdGg6IHRhYi5wYXRoLCBwYXRoU3RhdHVzOiAnbmV3J31cblxuICAgICAgICBleHBlY3QodGFiQmFyLmVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRhYicpWzFdLnF1ZXJ5U2VsZWN0b3IoJy50aXRsZScpKS50b0hhdmVDbGFzcyBcInN0YXR1cy1hZGRlZFwiXG4gICAgICAgIGF0b20uY29uZmlnLnNldCBcInRhYnMuZW5hYmxlVmNzQ29sb3JpbmdcIiwgZmFsc2VcbiAgICAgICAgZXhwZWN0KHRhYkJhci5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWInKVsxXS5xdWVyeVNlbGVjdG9yKCcudGl0bGUnKSkubm90LnRvSGF2ZUNsYXNzIFwic3RhdHVzLWFkZGVkXCJcblxuICAgICAgaXQgXCJhZGRzIHN0YXR1cyB0byB0aGUgdGFiIGlmIGVuYWJsZVZjc0NvbG9yaW5nIGlzIHNldCB0byB0cnVlXCIsIC0+XG4gICAgICAgIGF0b20uY29uZmlnLnNldCBcInRhYnMuZW5hYmxlVmNzQ29sb3JpbmdcIiwgZmFsc2VcbiAgICAgICAgcmVwb3NpdG9yeS5nZXRDYWNoZWRQYXRoU3RhdHVzLmFuZFJldHVybiAnbW9kaWZpZWQnXG4gICAgICAgIGV4cGVjdCh0YWJCYXIuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudGFiJylbMV0ucXVlcnlTZWxlY3RvcignLnRpdGxlJykpLm5vdC50b0hhdmVDbGFzcyBcInN0YXR1cy1tb2RpZmllZFwiXG4gICAgICAgIGF0b20uY29uZmlnLnNldCBcInRhYnMuZW5hYmxlVmNzQ29sb3JpbmdcIiwgdHJ1ZVxuXG4gICAgICAgIHdhaXRzRm9yIC0+XG4gICAgICAgICAgcmVwb3NpdG9yeS5jaGFuZ2VTdGF0dXNDYWxsYmFja3M/Lmxlbmd0aCA+IDBcblxuICAgICAgICBydW5zIC0+XG4gICAgICAgICAgZXhwZWN0KHRhYkJhci5lbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWInKVsxXS5xdWVyeVNlbGVjdG9yKCcudGl0bGUnKSkudG9IYXZlQ2xhc3MgXCJzdGF0dXMtbW9kaWZpZWRcIlxuXG4gICAgaWYgYXRvbS53b3Jrc3BhY2UuZ2V0TGVmdERvY2s/XG4gICAgICBkZXNjcmliZSBcImEgcGFuZSBpbiB0aGUgZG9ja1wiLCAtPlxuICAgICAgICBiZWZvcmVFYWNoIC0+IG1haW4uYWN0aXZhdGUoKVxuICAgICAgICBhZnRlckVhY2ggLT4gbWFpbi5kZWFjdGl2YXRlKClcbiAgICAgICAgaXQgXCJnZXRzIGRlY29yYXRlZCB3aXRoIHRhYnNcIiwgLT5cbiAgICAgICAgICBkb2NrID0gYXRvbS53b3Jrc3BhY2UuZ2V0TGVmdERvY2soKVxuICAgICAgICAgIGRvY2tFbGVtZW50ID0gZG9jay5nZXRFbGVtZW50KClcbiAgICAgICAgICBpdGVtID0gbmV3IFRlc3RWaWV3KCdEb2NrIEl0ZW0gMScpXG4gICAgICAgICAgZXhwZWN0KGRvY2tFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWInKS5sZW5ndGgpLnRvQmUoMClcbiAgICAgICAgICBwYW5lID0gZG9jay5nZXRBY3RpdmVQYW5lKClcbiAgICAgICAgICBwYW5lLmFjdGl2YXRlSXRlbShpdGVtKVxuICAgICAgICAgIGV4cGVjdChkb2NrRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudGFiJykubGVuZ3RoKS50b0JlKDEpXG4gICAgICAgICAgcGFuZS5kZXN0cm95SXRlbShpdGVtKVxuICAgICAgICAgIGV4cGVjdChkb2NrRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudGFiJykubGVuZ3RoKS50b0JlKDApXG4iXX0=
