(function() {
  var BrowserWindow, CompositeDisposable, TabBarView, TabView, _, ipcRenderer, isAtomEvent, itemIsAllowed;

  BrowserWindow = null;

  ipcRenderer = require('electron').ipcRenderer;

  CompositeDisposable = require('atom').CompositeDisposable;

  _ = require('underscore-plus');

  TabView = require('./tab-view');

  module.exports = TabBarView = (function() {
    function TabBarView(pane1, location1) {
      var addElementCommands, item, j, len, ref;
      this.pane = pane1;
      this.location = location1;
      this.element = document.createElement('ul');
      this.element.classList.add("list-inline");
      this.element.classList.add("tab-bar");
      this.element.classList.add("inset-panel");
      this.element.setAttribute('is', 'atom-tabs');
      this.element.setAttribute("tabindex", -1);
      this.element.setAttribute("location", this.location);
      this.tabs = [];
      this.tabsByElement = new WeakMap;
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.commands.add(this.pane.getElement(), {
        'tabs:keep-pending-tab': (function(_this) {
          return function() {
            return _this.terminatePendingStates();
          };
        })(this),
        'tabs:close-tab': (function(_this) {
          return function() {
            return _this.closeTab(_this.getActiveTab());
          };
        })(this),
        'tabs:close-other-tabs': (function(_this) {
          return function() {
            return _this.closeOtherTabs(_this.getActiveTab());
          };
        })(this),
        'tabs:close-tabs-to-right': (function(_this) {
          return function() {
            return _this.closeTabsToRight(_this.getActiveTab());
          };
        })(this),
        'tabs:close-tabs-to-left': (function(_this) {
          return function() {
            return _this.closeTabsToLeft(_this.getActiveTab());
          };
        })(this),
        'tabs:close-saved-tabs': (function(_this) {
          return function() {
            return _this.closeSavedTabs();
          };
        })(this),
        'tabs:close-all-tabs': (function(_this) {
          return function(event) {
            event.stopPropagation();
            return _this.closeAllTabs();
          };
        })(this),
        'tabs:open-in-new-window': (function(_this) {
          return function() {
            return _this.openInNewWindow();
          };
        })(this)
      }));
      addElementCommands = (function(_this) {
        return function(commands) {
          var commandsWithPropagationStopped;
          commandsWithPropagationStopped = {};
          Object.keys(commands).forEach(function(name) {
            return commandsWithPropagationStopped[name] = function(event) {
              event.stopPropagation();
              return commands[name]();
            };
          });
          return _this.subscriptions.add(atom.commands.add(_this.element, commandsWithPropagationStopped));
        };
      })(this);
      addElementCommands({
        'tabs:close-tab': (function(_this) {
          return function() {
            return _this.closeTab();
          };
        })(this),
        'tabs:close-other-tabs': (function(_this) {
          return function() {
            return _this.closeOtherTabs();
          };
        })(this),
        'tabs:close-tabs-to-right': (function(_this) {
          return function() {
            return _this.closeTabsToRight();
          };
        })(this),
        'tabs:close-tabs-to-left': (function(_this) {
          return function() {
            return _this.closeTabsToLeft();
          };
        })(this),
        'tabs:close-saved-tabs': (function(_this) {
          return function() {
            return _this.closeSavedTabs();
          };
        })(this),
        'tabs:close-all-tabs': (function(_this) {
          return function() {
            return _this.closeAllTabs();
          };
        })(this),
        'tabs:split-up': (function(_this) {
          return function() {
            return _this.splitTab('splitUp');
          };
        })(this),
        'tabs:split-down': (function(_this) {
          return function() {
            return _this.splitTab('splitDown');
          };
        })(this),
        'tabs:split-left': (function(_this) {
          return function() {
            return _this.splitTab('splitLeft');
          };
        })(this),
        'tabs:split-right': (function(_this) {
          return function() {
            return _this.splitTab('splitRight');
          };
        })(this)
      });
      this.element.addEventListener("mouseenter", this.onMouseEnter.bind(this));
      this.element.addEventListener("mouseleave", this.onMouseLeave.bind(this));
      this.element.addEventListener("dragstart", this.onDragStart.bind(this));
      this.element.addEventListener("dragend", this.onDragEnd.bind(this));
      this.element.addEventListener("dragleave", this.onDragLeave.bind(this));
      this.element.addEventListener("dragover", this.onDragOver.bind(this));
      this.element.addEventListener("drop", this.onDrop.bind(this));
      this.paneContainer = this.pane.getContainer();
      ref = this.pane.getItems();
      for (j = 0, len = ref.length; j < len; j++) {
        item = ref[j];
        this.addTabForItem(item);
      }
      this.subscriptions.add(this.pane.onDidDestroy((function(_this) {
        return function() {
          return _this.destroy();
        };
      })(this)));
      this.subscriptions.add(this.pane.onDidAddItem((function(_this) {
        return function(arg) {
          var index, item;
          item = arg.item, index = arg.index;
          return _this.addTabForItem(item, index);
        };
      })(this)));
      this.subscriptions.add(this.pane.onDidMoveItem((function(_this) {
        return function(arg) {
          var item, newIndex;
          item = arg.item, newIndex = arg.newIndex;
          return _this.moveItemTabToIndex(item, newIndex);
        };
      })(this)));
      this.subscriptions.add(this.pane.onDidRemoveItem((function(_this) {
        return function(arg) {
          var item;
          item = arg.item;
          return _this.removeTabForItem(item);
        };
      })(this)));
      this.subscriptions.add(this.pane.onDidChangeActiveItem((function(_this) {
        return function(item) {
          return _this.updateActiveTab();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('tabs.tabScrolling', this.updateTabScrolling.bind(this)));
      this.subscriptions.add(atom.config.observe('tabs.tabScrollingThreshold', (function(_this) {
        return function() {
          return _this.updateTabScrollingThreshold();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('tabs.alwaysShowTabBar', (function(_this) {
        return function() {
          return _this.updateTabBarVisibility();
        };
      })(this)));
      this.updateActiveTab();
      this.element.addEventListener("mousedown", this.onMouseDown.bind(this));
      this.element.addEventListener("click", this.onClick.bind(this));
      this.element.addEventListener("dblclick", this.onDoubleClick.bind(this));
      this.onDropOnOtherWindow = this.onDropOnOtherWindow.bind(this);
      ipcRenderer.on('tab:dropped', this.onDropOnOtherWindow);
    }

    TabBarView.prototype.destroy = function() {
      ipcRenderer.removeListener('tab:dropped', this.onDropOnOtherWindow);
      this.subscriptions.dispose();
      return this.element.remove();
    };

    TabBarView.prototype.terminatePendingStates = function() {
      var j, len, ref, tab;
      ref = this.getTabs();
      for (j = 0, len = ref.length; j < len; j++) {
        tab = ref[j];
        if (typeof tab.terminatePendingState === "function") {
          tab.terminatePendingState();
        }
      }
    };

    TabBarView.prototype.addTabForItem = function(item, index) {
      var tabView;
      tabView = new TabView({
        item: item,
        pane: this.pane,
        tabs: this.tabs,
        didClickCloseIcon: (function(_this) {
          return function() {
            _this.closeTab(tabView);
          };
        })(this),
        location: this.location
      });
      if (this.isItemMovingBetweenPanes) {
        tabView.terminatePendingState();
      }
      this.tabsByElement.set(tabView.element, tabView);
      this.insertTabAtIndex(tabView, index);
      if (atom.config.get('tabs.addNewTabsAtEnd')) {
        if (!this.isItemMovingBetweenPanes) {
          return this.pane.moveItem(item, this.pane.getItems().length - 1);
        }
      }
    };

    TabBarView.prototype.moveItemTabToIndex = function(item, index) {
      var tab, tabIndex;
      tabIndex = this.tabs.findIndex(function(t) {
        return t.item === item;
      });
      if (tabIndex !== -1) {
        tab = this.tabs[tabIndex];
        tab.element.remove();
        this.tabs.splice(tabIndex, 1);
        return this.insertTabAtIndex(tab, index);
      }
    };

    TabBarView.prototype.insertTabAtIndex = function(tab, index) {
      var followingTab;
      if (index != null) {
        followingTab = this.tabs[index];
      }
      if (followingTab) {
        this.element.insertBefore(tab.element, followingTab.element);
        this.tabs.splice(index, 0, tab);
      } else {
        this.element.appendChild(tab.element);
        this.tabs.push(tab);
      }
      tab.updateTitle();
      return this.updateTabBarVisibility();
    };

    TabBarView.prototype.removeTabForItem = function(item) {
      var j, len, ref, tab, tabIndex;
      tabIndex = this.tabs.findIndex(function(t) {
        return t.item === item;
      });
      if (tabIndex !== -1) {
        tab = this.tabs[tabIndex];
        this.tabs.splice(tabIndex, 1);
        this.tabsByElement["delete"](tab);
        tab.destroy();
      }
      ref = this.getTabs();
      for (j = 0, len = ref.length; j < len; j++) {
        tab = ref[j];
        tab.updateTitle();
      }
      return this.updateTabBarVisibility();
    };

    TabBarView.prototype.updateTabBarVisibility = function() {
      if (!atom.config.get('tabs.alwaysShowTabBar') && !this.shouldAllowDrag()) {
        return this.element.classList.add('hidden');
      } else {
        return this.element.classList.remove('hidden');
      }
    };

    TabBarView.prototype.getTabs = function() {
      return this.tabs.slice();
    };

    TabBarView.prototype.tabAtIndex = function(index) {
      return this.tabs[index];
    };

    TabBarView.prototype.tabForItem = function(item) {
      return this.tabs.find(function(t) {
        return t.item === item;
      });
    };

    TabBarView.prototype.setActiveTab = function(tabView) {
      var ref;
      if ((tabView != null) && tabView !== this.activeTab) {
        if ((ref = this.activeTab) != null) {
          ref.element.classList.remove('active');
        }
        this.activeTab = tabView;
        this.activeTab.element.classList.add('active');
        return this.activeTab.element.scrollIntoView(false);
      }
    };

    TabBarView.prototype.getActiveTab = function() {
      return this.tabForItem(this.pane.getActiveItem());
    };

    TabBarView.prototype.updateActiveTab = function() {
      return this.setActiveTab(this.tabForItem(this.pane.getActiveItem()));
    };

    TabBarView.prototype.closeTab = function(tab) {
      if (tab == null) {
        tab = this.rightClickedTab;
      }
      if (tab != null) {
        return this.pane.destroyItem(tab.item);
      }
    };

    TabBarView.prototype.openInNewWindow = function(tab) {
      var item, itemURI, j, len, pathsToOpen, ref;
      if (tab == null) {
        tab = this.rightClickedTab;
      }
      item = tab != null ? tab.item : void 0;
      if (item == null) {
        return;
      }
      if (typeof item.getURI === 'function') {
        itemURI = item.getURI();
      } else if (typeof item.getPath === 'function') {
        itemURI = item.getPath();
      } else if (typeof item.getUri === 'function') {
        itemURI = item.getUri();
      }
      if (itemURI == null) {
        return;
      }
      this.closeTab(tab);
      ref = this.getTabs();
      for (j = 0, len = ref.length; j < len; j++) {
        tab = ref[j];
        tab.element.style.maxWidth = '';
      }
      pathsToOpen = [atom.project.getPaths(), itemURI].reduce((function(a, b) {
        return a.concat(b);
      }), []);
      return atom.open({
        pathsToOpen: pathsToOpen,
        newWindow: true,
        devMode: atom.devMode,
        safeMode: atom.safeMode
      });
    };

    TabBarView.prototype.splitTab = function(fn) {
      var copiedItem, item, ref;
      if (item = (ref = this.rightClickedTab) != null ? ref.item : void 0) {
        if (copiedItem = typeof item.copy === "function" ? item.copy() : void 0) {
          return this.pane[fn]({
            items: [copiedItem]
          });
        }
      }
    };

    TabBarView.prototype.closeOtherTabs = function(active) {
      var j, len, results, tab, tabs;
      tabs = this.getTabs();
      if (active == null) {
        active = this.rightClickedTab;
      }
      if (active == null) {
        return;
      }
      results = [];
      for (j = 0, len = tabs.length; j < len; j++) {
        tab = tabs[j];
        if (tab !== active) {
          results.push(this.closeTab(tab));
        }
      }
      return results;
    };

    TabBarView.prototype.closeTabsToRight = function(active) {
      var i, index, j, len, results, tab, tabs;
      tabs = this.getTabs();
      if (active == null) {
        active = this.rightClickedTab;
      }
      index = tabs.indexOf(active);
      if (index === -1) {
        return;
      }
      results = [];
      for (i = j = 0, len = tabs.length; j < len; i = ++j) {
        tab = tabs[i];
        if (i > index) {
          results.push(this.closeTab(tab));
        }
      }
      return results;
    };

    TabBarView.prototype.closeTabsToLeft = function(active) {
      var i, index, j, len, results, tab, tabs;
      tabs = this.getTabs();
      if (active == null) {
        active = this.rightClickedTab;
      }
      index = tabs.indexOf(active);
      if (index === -1) {
        return;
      }
      results = [];
      for (i = j = 0, len = tabs.length; j < len; i = ++j) {
        tab = tabs[i];
        if (i < index) {
          results.push(this.closeTab(tab));
        }
      }
      return results;
    };

    TabBarView.prototype.closeSavedTabs = function() {
      var base, j, len, ref, results, tab;
      ref = this.getTabs();
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        tab = ref[j];
        if (!(typeof (base = tab.item).isModified === "function" ? base.isModified() : void 0)) {
          results.push(this.closeTab(tab));
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    TabBarView.prototype.closeAllTabs = function() {
      var j, len, ref, results, tab;
      ref = this.getTabs();
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        tab = ref[j];
        results.push(this.closeTab(tab));
      }
      return results;
    };

    TabBarView.prototype.getWindowId = function() {
      return this.windowId != null ? this.windowId : this.windowId = atom.getCurrentWindow().id;
    };

    TabBarView.prototype.shouldAllowDrag = function() {
      return (this.paneContainer.getPanes().length > 1) || (this.pane.getItems().length > 1);
    };

    TabBarView.prototype.onDragStart = function(event) {
      var item, itemURI, j, len, location, paneIndex, ref, ref1, ref2, ref3, tabIndex;
      this.draggedTab = this.tabForElement(event.target);
      if (!this.draggedTab) {
        return;
      }
      event.dataTransfer.setData('atom-event', 'true');
      this.draggedTab.element.classList.add('is-dragging');
      this.draggedTab.destroyTooltip();
      tabIndex = this.tabs.indexOf(this.draggedTab);
      event.dataTransfer.setData('sortable-index', tabIndex);
      paneIndex = this.paneContainer.getPanes().indexOf(this.pane);
      event.dataTransfer.setData('from-pane-index', paneIndex);
      event.dataTransfer.setData('from-pane-id', this.pane.id);
      event.dataTransfer.setData('from-window-id', this.getWindowId());
      item = this.pane.getItems()[this.tabs.indexOf(this.draggedTab)];
      if (item == null) {
        return;
      }
      if (typeof item.getURI === 'function') {
        itemURI = (ref = item.getURI()) != null ? ref : '';
      } else if (typeof item.getPath === 'function') {
        itemURI = (ref1 = item.getPath()) != null ? ref1 : '';
      } else if (typeof item.getUri === 'function') {
        itemURI = (ref2 = item.getUri()) != null ? ref2 : '';
      }
      if (typeof item.getAllowedLocations === 'function') {
        ref3 = item.getAllowedLocations();
        for (j = 0, len = ref3.length; j < len; j++) {
          location = ref3[j];
          event.dataTransfer.setData("allowed-location-" + location, 'true');
        }
      } else {
        event.dataTransfer.setData('allow-all-locations', 'true');
      }
      if (itemURI != null) {
        event.dataTransfer.setData('text/plain', itemURI);
        if (process.platform === 'darwin') {
          if (!this.uriHasProtocol(itemURI)) {
            itemURI = "file://" + itemURI;
          }
          event.dataTransfer.setData('text/uri-list', itemURI);
        }
        if ((typeof item.isModified === "function" ? item.isModified() : void 0) && (item.getText != null)) {
          event.dataTransfer.setData('has-unsaved-changes', 'true');
          return event.dataTransfer.setData('modified-text', item.getText());
        }
      }
    };

    TabBarView.prototype.uriHasProtocol = function(uri) {
      var error;
      try {
        return require('url').parse(uri).protocol != null;
      } catch (error1) {
        error = error1;
        return false;
      }
    };

    TabBarView.prototype.onDragLeave = function(event) {
      var j, len, ref, tab;
      ref = this.getTabs();
      for (j = 0, len = ref.length; j < len; j++) {
        tab = ref[j];
        tab.element.style.maxWidth = '';
      }
      return this.removePlaceholder();
    };

    TabBarView.prototype.onDragEnd = function(event) {
      if (!this.tabForElement(event.target)) {
        return;
      }
      return this.clearDropTarget();
    };

    TabBarView.prototype.onDragOver = function(event) {
      var newDropTargetIndex, placeholder, sibling, tab, tabs;
      if (!isAtomEvent(event)) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      event.preventDefault();
      newDropTargetIndex = this.getDropTargetIndex(event);
      if (newDropTargetIndex == null) {
        return;
      }
      if (!itemIsAllowed(event, this.location)) {
        return;
      }
      this.removeDropTargetClasses();
      tabs = this.getTabs();
      placeholder = this.getPlaceholder();
      if (placeholder == null) {
        return;
      }
      if (newDropTargetIndex < tabs.length) {
        tab = tabs[newDropTargetIndex];
        tab.element.classList.add('is-drop-target');
        return tab.element.parentElement.insertBefore(placeholder, tab.element);
      } else {
        if (tab = tabs[newDropTargetIndex - 1]) {
          tab.element.classList.add('drop-target-is-after');
          if (sibling = tab.element.nextSibling) {
            return tab.element.parentElement.insertBefore(placeholder, sibling);
          } else {
            return tab.element.parentElement.appendChild(placeholder);
          }
        }
      }
    };

    TabBarView.prototype.onDropOnOtherWindow = function(fromPaneId, fromItemIndex) {
      var itemToRemove;
      if (this.pane.id === fromPaneId) {
        if (itemToRemove = this.pane.getItems()[fromItemIndex]) {
          this.pane.destroyItem(itemToRemove);
        }
      }
      return this.clearDropTarget();
    };

    TabBarView.prototype.clearDropTarget = function() {
      var ref, ref1;
      if ((ref = this.draggedTab) != null) {
        ref.element.classList.remove('is-dragging');
      }
      if ((ref1 = this.draggedTab) != null) {
        ref1.updateTooltip();
      }
      this.draggedTab = null;
      this.removeDropTargetClasses();
      return this.removePlaceholder();
    };

    TabBarView.prototype.onDrop = function(event) {
      var droppedURI, fromIndex, fromPane, fromPaneId, fromPaneIndex, fromWindowId, hasUnsavedChanges, item, modifiedText, toIndex, toPane;
      event.preventDefault();
      if (event.dataTransfer.getData('atom-event') !== 'true') {
        return;
      }
      fromWindowId = parseInt(event.dataTransfer.getData('from-window-id'));
      fromPaneId = parseInt(event.dataTransfer.getData('from-pane-id'));
      fromIndex = parseInt(event.dataTransfer.getData('sortable-index'));
      fromPaneIndex = parseInt(event.dataTransfer.getData('from-pane-index'));
      hasUnsavedChanges = event.dataTransfer.getData('has-unsaved-changes') === 'true';
      modifiedText = event.dataTransfer.getData('modified-text');
      toIndex = this.getDropTargetIndex(event);
      toPane = this.pane;
      this.clearDropTarget();
      if (!itemIsAllowed(event, this.location)) {
        return;
      }
      if (fromWindowId === this.getWindowId()) {
        fromPane = this.paneContainer.getPanes()[fromPaneIndex];
        if ((fromPane != null ? fromPane.id : void 0) !== fromPaneId) {
          fromPane = Array.from(document.querySelectorAll('atom-pane')).map(function(paneEl) {
            return paneEl.model;
          }).find(function(pane) {
            return pane.id === fromPaneId;
          });
        }
        item = fromPane.getItems()[fromIndex];
        if (item != null) {
          return this.moveItemBetweenPanes(fromPane, fromIndex, toPane, toIndex, item);
        }
      } else {
        droppedURI = event.dataTransfer.getData('text/plain');
        atom.workspace.open(droppedURI).then((function(_this) {
          return function(item) {
            var activeItemIndex, activePane, browserWindow;
            activePane = atom.workspace.getActivePane();
            activeItemIndex = activePane.getItems().indexOf(item);
            _this.moveItemBetweenPanes(activePane, activeItemIndex, toPane, toIndex, item);
            if (hasUnsavedChanges) {
              if (typeof item.setText === "function") {
                item.setText(modifiedText);
              }
            }
            if (!isNaN(fromWindowId)) {
              browserWindow = _this.browserWindowForId(fromWindowId);
              return browserWindow != null ? browserWindow.webContents.send('tab:dropped', fromPaneId, fromIndex) : void 0;
            }
          };
        })(this));
        return atom.focus();
      }
    };

    TabBarView.prototype.onMouseWheel = function(event) {
      if (event.shiftKey) {
        return;
      }
      if (this.wheelDelta == null) {
        this.wheelDelta = 0;
      }
      this.wheelDelta += event.wheelDeltaY;
      if (this.wheelDelta <= -this.tabScrollingThreshold) {
        this.wheelDelta = 0;
        return this.pane.activateNextItem();
      } else if (this.wheelDelta >= this.tabScrollingThreshold) {
        this.wheelDelta = 0;
        return this.pane.activatePreviousItem();
      }
    };

    TabBarView.prototype.onMouseDown = function(event) {
      var ref, tab;
      tab = this.tabForElement(event.target);
      if (!tab) {
        return;
      }
      if (event.which === 3 || (event.which === 1 && event.ctrlKey === true)) {
        if ((ref = this.rightClickedTab) != null) {
          ref.element.classList.remove('right-clicked');
        }
        this.rightClickedTab = tab;
        this.rightClickedTab.element.classList.add('right-clicked');
        return event.preventDefault();
      } else if (event.which === 2) {
        return event.preventDefault();
      }
    };

    TabBarView.prototype.onClick = function(event) {
      var tab;
      tab = this.tabForElement(event.target);
      if (!tab) {
        return;
      }
      event.preventDefault();
      if (event.which === 3 || (event.which === 1 && event.ctrlKey === true)) {

      } else if (event.which === 1 && !event.target.classList.contains('close-icon')) {
        this.pane.activateItem(tab.item);
        if (!this.pane.isDestroyed()) {
          return this.pane.activate();
        }
      } else if (event.which === 2) {
        return this.pane.destroyItem(tab.item);
      }
    };

    TabBarView.prototype.onDoubleClick = function(event) {
      var base, tab;
      if (tab = this.tabForElement(event.target)) {
        return typeof (base = tab.item).terminatePendingState === "function" ? base.terminatePendingState() : void 0;
      } else if (event.target === this.element) {
        atom.commands.dispatch(this.element, 'application:new-file');
        return event.preventDefault();
      }
    };

    TabBarView.prototype.updateTabScrollingThreshold = function() {
      return this.tabScrollingThreshold = atom.config.get('tabs.tabScrollingThreshold');
    };

    TabBarView.prototype.updateTabScrolling = function(value) {
      if (value === 'platform') {
        this.tabScrolling = process.platform === 'linux';
      } else {
        this.tabScrolling = value;
      }
      this.tabScrollingThreshold = atom.config.get('tabs.tabScrollingThreshold');
      if (this.tabScrolling) {
        return this.element.addEventListener('mousewheel', this.onMouseWheel.bind(this));
      } else {
        return this.element.removeEventListener('mousewheel', this.onMouseWheel.bind(this));
      }
    };

    TabBarView.prototype.browserWindowForId = function(id) {
      if (BrowserWindow == null) {
        BrowserWindow = require('electron').remote.BrowserWindow;
      }
      return BrowserWindow.fromId(id);
    };

    TabBarView.prototype.moveItemBetweenPanes = function(fromPane, fromIndex, toPane, toIndex, item) {
      try {
        if (toPane === fromPane) {
          if (fromIndex < toIndex) {
            toIndex--;
          }
          toPane.moveItem(item, toIndex);
        } else {
          this.isItemMovingBetweenPanes = true;
          fromPane.moveItemToPane(item, toPane, toIndex--);
        }
        toPane.activateItem(item);
        return toPane.activate();
      } finally {
        this.isItemMovingBetweenPanes = false;
      }
    };

    TabBarView.prototype.removeDropTargetClasses = function() {
      var dropTarget, j, k, len, len1, ref, ref1, results, workspaceElement;
      workspaceElement = atom.workspace.getElement();
      ref = workspaceElement.querySelectorAll('.tab-bar .is-drop-target');
      for (j = 0, len = ref.length; j < len; j++) {
        dropTarget = ref[j];
        dropTarget.classList.remove('is-drop-target');
      }
      ref1 = workspaceElement.querySelectorAll('.tab-bar .drop-target-is-after');
      results = [];
      for (k = 0, len1 = ref1.length; k < len1; k++) {
        dropTarget = ref1[k];
        results.push(dropTarget.classList.remove('drop-target-is-after'));
      }
      return results;
    };

    TabBarView.prototype.getDropTargetIndex = function(event) {
      var elementCenter, elementIndex, left, ref, tab, tabs, target, width;
      target = event.target;
      if (this.isPlaceholder(target)) {
        return;
      }
      tabs = this.getTabs();
      tab = this.tabForElement(target);
      if (tab == null) {
        tab = tabs[tabs.length - 1];
      }
      if (tab == null) {
        return 0;
      }
      ref = tab.element.getBoundingClientRect(), left = ref.left, width = ref.width;
      elementCenter = left + width / 2;
      elementIndex = tabs.indexOf(tab);
      if (event.pageX < elementCenter) {
        return elementIndex;
      } else {
        return elementIndex + 1;
      }
    };

    TabBarView.prototype.getPlaceholder = function() {
      if (this.placeholderEl != null) {
        return this.placeholderEl;
      }
      this.placeholderEl = document.createElement("li");
      this.placeholderEl.classList.add("placeholder");
      return this.placeholderEl;
    };

    TabBarView.prototype.removePlaceholder = function() {
      var ref;
      if ((ref = this.placeholderEl) != null) {
        ref.remove();
      }
      return this.placeholderEl = null;
    };

    TabBarView.prototype.isPlaceholder = function(element) {
      return element.classList.contains('placeholder');
    };

    TabBarView.prototype.onMouseEnter = function() {
      var j, len, ref, tab, width;
      ref = this.getTabs();
      for (j = 0, len = ref.length; j < len; j++) {
        tab = ref[j];
        width = tab.element.getBoundingClientRect().width;
        tab.element.style.maxWidth = width.toFixed(2) + 'px';
      }
    };

    TabBarView.prototype.onMouseLeave = function() {
      var j, len, ref, tab;
      ref = this.getTabs();
      for (j = 0, len = ref.length; j < len; j++) {
        tab = ref[j];
        tab.element.style.maxWidth = '';
      }
    };

    TabBarView.prototype.tabForElement = function(element) {
      var currentElement, tab;
      currentElement = element;
      while (currentElement != null) {
        if (tab = this.tabsByElement.get(currentElement)) {
          return tab;
        } else {
          currentElement = currentElement.parentElement;
        }
      }
    };

    return TabBarView;

  })();

  isAtomEvent = function(event) {
    var item, j, len, ref;
    ref = event.dataTransfer.items;
    for (j = 0, len = ref.length; j < len; j++) {
      item = ref[j];
      if (item.type === 'atom-event') {
        return true;
      }
    }
    return false;
  };

  itemIsAllowed = function(event, location) {
    var item, j, len, ref;
    ref = event.dataTransfer.items;
    for (j = 0, len = ref.length; j < len; j++) {
      item = ref[j];
      if (item.type === 'allow-all-locations' || item.type === ("allowed-location-" + location)) {
        return true;
      }
    }
    return false;
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3Rlc3QvLmRvdGZpbGVzL2F0b20vcGFja2FnZXMvdGFicy9saWIvdGFiLWJhci12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsYUFBQSxHQUFnQjs7RUFDZixjQUFlLE9BQUEsQ0FBUSxVQUFSOztFQUVmLHNCQUF1QixPQUFBLENBQVEsTUFBUjs7RUFDeEIsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUjs7RUFDSixPQUFBLEdBQVUsT0FBQSxDQUFRLFlBQVI7O0VBRVYsTUFBTSxDQUFDLE9BQVAsR0FDTTtJQUNTLG9CQUFDLEtBQUQsRUFBUSxTQUFSO0FBQ1gsVUFBQTtNQURZLElBQUMsQ0FBQSxPQUFEO01BQU8sSUFBQyxDQUFBLFdBQUQ7TUFDbkIsSUFBQyxDQUFBLE9BQUQsR0FBVyxRQUFRLENBQUMsYUFBVCxDQUF1QixJQUF2QjtNQUNYLElBQUMsQ0FBQSxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQW5CLENBQXVCLGFBQXZCO01BQ0EsSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBbkIsQ0FBdUIsU0FBdkI7TUFDQSxJQUFDLENBQUEsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFuQixDQUF1QixhQUF2QjtNQUNBLElBQUMsQ0FBQSxPQUFPLENBQUMsWUFBVCxDQUFzQixJQUF0QixFQUE0QixXQUE1QjtNQUNBLElBQUMsQ0FBQSxPQUFPLENBQUMsWUFBVCxDQUFzQixVQUF0QixFQUFrQyxDQUFDLENBQW5DO01BQ0EsSUFBQyxDQUFBLE9BQU8sQ0FBQyxZQUFULENBQXNCLFVBQXRCLEVBQWtDLElBQUMsQ0FBQSxRQUFuQztNQUVBLElBQUMsQ0FBQSxJQUFELEdBQVE7TUFDUixJQUFDLENBQUEsYUFBRCxHQUFpQixJQUFJO01BQ3JCLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUk7TUFFckIsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFm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ciByZXF1aXJlIHVudGlsIGFjdHVhbGx5IHVzZWRcbntpcGNSZW5kZXJlcn0gPSByZXF1aXJlICdlbGVjdHJvbidcblxue0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSAnYXRvbSdcbl8gPSByZXF1aXJlICd1bmRlcnNjb3JlLXBsdXMnXG5UYWJWaWV3ID0gcmVxdWlyZSAnLi90YWItdmlldydcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgVGFiQmFyVmlld1xuICBjb25zdHJ1Y3RvcjogKEBwYW5lLCBAbG9jYXRpb24pIC0+XG4gICAgQGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpXG4gICAgQGVsZW1lbnQuY2xhc3NMaXN0LmFkZChcImxpc3QtaW5saW5lXCIpXG4gICAgQGVsZW1lbnQuY2xhc3NMaXN0LmFkZChcInRhYi1iYXJcIilcbiAgICBAZWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiaW5zZXQtcGFuZWxcIilcbiAgICBAZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2lzJywgJ2F0b20tdGFicycpXG4gICAgQGVsZW1lbnQuc2V0QXR0cmlidXRlKFwidGFiaW5kZXhcIiwgLTEpXG4gICAgQGVsZW1lbnQuc2V0QXR0cmlidXRlKFwibG9jYXRpb25cIiwgQGxvY2F0aW9uKVxuXG4gICAgQHRhYnMgPSBbXVxuICAgIEB0YWJzQnlFbGVtZW50ID0gbmV3IFdlYWtNYXBcbiAgICBAc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgQHBhbmUuZ2V0RWxlbWVudCgpLFxuICAgICAgJ3RhYnM6a2VlcC1wZW5kaW5nLXRhYic6ID0+IEB0ZXJtaW5hdGVQZW5kaW5nU3RhdGVzKClcbiAgICAgICd0YWJzOmNsb3NlLXRhYic6ID0+IEBjbG9zZVRhYihAZ2V0QWN0aXZlVGFiKCkpXG4gICAgICAndGFiczpjbG9zZS1vdGhlci10YWJzJzogPT4gQGNsb3NlT3RoZXJUYWJzKEBnZXRBY3RpdmVUYWIoKSlcbiAgICAgICd0YWJzOmNsb3NlLXRhYnMtdG8tcmlnaHQnOiA9PiBAY2xvc2VUYWJzVG9SaWdodChAZ2V0QWN0aXZlVGFiKCkpXG4gICAgICAndGFiczpjbG9zZS10YWJzLXRvLWxlZnQnOiA9PiBAY2xvc2VUYWJzVG9MZWZ0KEBnZXRBY3RpdmVUYWIoKSlcbiAgICAgICd0YWJzOmNsb3NlLXNhdmVkLXRhYnMnOiA9PiBAY2xvc2VTYXZlZFRhYnMoKVxuICAgICAgJ3RhYnM6Y2xvc2UtYWxsLXRhYnMnOiAoZXZlbnQpID0+XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgIEBjbG9zZUFsbFRhYnMoKVxuICAgICAgJ3RhYnM6b3Blbi1pbi1uZXctd2luZG93JzogPT4gQG9wZW5Jbk5ld1dpbmRvdygpXG5cbiAgICBhZGRFbGVtZW50Q29tbWFuZHMgPSAoY29tbWFuZHMpID0+XG4gICAgICBjb21tYW5kc1dpdGhQcm9wYWdhdGlvblN0b3BwZWQgPSB7fVxuICAgICAgT2JqZWN0LmtleXMoY29tbWFuZHMpLmZvckVhY2ggKG5hbWUpIC0+XG4gICAgICAgIGNvbW1hbmRzV2l0aFByb3BhZ2F0aW9uU3RvcHBlZFtuYW1lXSA9IChldmVudCkgLT5cbiAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICAgIGNvbW1hbmRzW25hbWVdKClcblxuICAgICAgQHN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29tbWFuZHMuYWRkKEBlbGVtZW50LCBjb21tYW5kc1dpdGhQcm9wYWdhdGlvblN0b3BwZWQpKVxuXG4gICAgYWRkRWxlbWVudENvbW1hbmRzXG4gICAgICAndGFiczpjbG9zZS10YWInOiA9PiBAY2xvc2VUYWIoKVxuICAgICAgJ3RhYnM6Y2xvc2Utb3RoZXItdGFicyc6ID0+IEBjbG9zZU90aGVyVGFicygpXG4gICAgICAndGFiczpjbG9zZS10YWJzLXRvLXJpZ2h0JzogPT4gQGNsb3NlVGFic1RvUmlnaHQoKVxuICAgICAgJ3RhYnM6Y2xvc2UtdGFicy10by1sZWZ0JzogPT4gQGNsb3NlVGFic1RvTGVmdCgpXG4gICAgICAndGFiczpjbG9zZS1zYXZlZC10YWJzJzogPT4gQGNsb3NlU2F2ZWRUYWJzKClcbiAgICAgICd0YWJzOmNsb3NlLWFsbC10YWJzJzogPT4gQGNsb3NlQWxsVGFicygpXG4gICAgICAndGFiczpzcGxpdC11cCc6ID0+IEBzcGxpdFRhYignc3BsaXRVcCcpXG4gICAgICAndGFiczpzcGxpdC1kb3duJzogPT4gQHNwbGl0VGFiKCdzcGxpdERvd24nKVxuICAgICAgJ3RhYnM6c3BsaXQtbGVmdCc6ID0+IEBzcGxpdFRhYignc3BsaXRMZWZ0JylcbiAgICAgICd0YWJzOnNwbGl0LXJpZ2h0JzogPT4gQHNwbGl0VGFiKCdzcGxpdFJpZ2h0JylcblxuICAgIEBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIgXCJtb3VzZWVudGVyXCIsIEBvbk1vdXNlRW50ZXIuYmluZCh0aGlzKVxuICAgIEBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIgXCJtb3VzZWxlYXZlXCIsIEBvbk1vdXNlTGVhdmUuYmluZCh0aGlzKVxuICAgIEBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIgXCJkcmFnc3RhcnRcIiwgQG9uRHJhZ1N0YXJ0LmJpbmQodGhpcylcbiAgICBAZWxlbWVudC5hZGRFdmVudExpc3RlbmVyIFwiZHJhZ2VuZFwiLCBAb25EcmFnRW5kLmJpbmQodGhpcylcbiAgICBAZWxlbWVudC5hZGRFdmVudExpc3RlbmVyIFwiZHJhZ2xlYXZlXCIsIEBvbkRyYWdMZWF2ZS5iaW5kKHRoaXMpXG4gICAgQGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lciBcImRyYWdvdmVyXCIsIEBvbkRyYWdPdmVyLmJpbmQodGhpcylcbiAgICBAZWxlbWVudC5hZGRFdmVudExpc3RlbmVyIFwiZHJvcFwiLCBAb25Ecm9wLmJpbmQodGhpcylcblxuICAgIEBwYW5lQ29udGFpbmVyID0gQHBhbmUuZ2V0Q29udGFpbmVyKClcbiAgICBAYWRkVGFiRm9ySXRlbShpdGVtKSBmb3IgaXRlbSBpbiBAcGFuZS5nZXRJdGVtcygpXG5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgQHBhbmUub25EaWREZXN0cm95ID0+XG4gICAgICBAZGVzdHJveSgpXG5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgQHBhbmUub25EaWRBZGRJdGVtICh7aXRlbSwgaW5kZXh9KSA9PlxuICAgICAgQGFkZFRhYkZvckl0ZW0oaXRlbSwgaW5kZXgpXG5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgQHBhbmUub25EaWRNb3ZlSXRlbSAoe2l0ZW0sIG5ld0luZGV4fSkgPT5cbiAgICAgIEBtb3ZlSXRlbVRhYlRvSW5kZXgoaXRlbSwgbmV3SW5kZXgpXG5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgQHBhbmUub25EaWRSZW1vdmVJdGVtICh7aXRlbX0pID0+XG4gICAgICBAcmVtb3ZlVGFiRm9ySXRlbShpdGVtKVxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIEBwYW5lLm9uRGlkQ2hhbmdlQWN0aXZlSXRlbSAoaXRlbSkgPT5cbiAgICAgIEB1cGRhdGVBY3RpdmVUYWIoKVxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29uZmlnLm9ic2VydmUgJ3RhYnMudGFiU2Nyb2xsaW5nJywgQHVwZGF0ZVRhYlNjcm9sbGluZy5iaW5kKHRoaXMpXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29uZmlnLm9ic2VydmUgJ3RhYnMudGFiU2Nyb2xsaW5nVGhyZXNob2xkJywgPT4gQHVwZGF0ZVRhYlNjcm9sbGluZ1RocmVzaG9sZCgpXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29uZmlnLm9ic2VydmUgJ3RhYnMuYWx3YXlzU2hvd1RhYkJhcicsID0+IEB1cGRhdGVUYWJCYXJWaXNpYmlsaXR5KClcblxuICAgIEB1cGRhdGVBY3RpdmVUYWIoKVxuXG4gICAgQGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lciBcIm1vdXNlZG93blwiLCBAb25Nb3VzZURvd24uYmluZCh0aGlzKVxuICAgIEBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIgXCJjbGlja1wiLCBAb25DbGljay5iaW5kKHRoaXMpXG4gICAgQGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lciBcImRibGNsaWNrXCIsIEBvbkRvdWJsZUNsaWNrLmJpbmQodGhpcylcblxuICAgIEBvbkRyb3BPbk90aGVyV2luZG93ID0gQG9uRHJvcE9uT3RoZXJXaW5kb3cuYmluZCh0aGlzKVxuICAgIGlwY1JlbmRlcmVyLm9uKCd0YWI6ZHJvcHBlZCcsIEBvbkRyb3BPbk90aGVyV2luZG93KVxuXG4gIGRlc3Ryb3k6IC0+XG4gICAgaXBjUmVuZGVyZXIucmVtb3ZlTGlzdGVuZXIoJ3RhYjpkcm9wcGVkJywgQG9uRHJvcE9uT3RoZXJXaW5kb3cpXG4gICAgQHN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgQGVsZW1lbnQucmVtb3ZlKClcblxuICB0ZXJtaW5hdGVQZW5kaW5nU3RhdGVzOiAtPlxuICAgIHRhYi50ZXJtaW5hdGVQZW5kaW5nU3RhdGU/KCkgZm9yIHRhYiBpbiBAZ2V0VGFicygpXG4gICAgcmV0dXJuXG5cbiAgYWRkVGFiRm9ySXRlbTogKGl0ZW0sIGluZGV4KSAtPlxuICAgIHRhYlZpZXcgPSBuZXcgVGFiVmlldyh7XG4gICAgICBpdGVtLFxuICAgICAgQHBhbmUsXG4gICAgICBAdGFicyxcbiAgICAgIGRpZENsaWNrQ2xvc2VJY29uOiA9PlxuICAgICAgICBAY2xvc2VUYWIodGFiVmlldylcbiAgICAgICAgcmV0dXJuXG4gICAgICBAbG9jYXRpb25cbiAgICB9KVxuICAgIHRhYlZpZXcudGVybWluYXRlUGVuZGluZ1N0YXRlKCkgaWYgQGlzSXRlbU1vdmluZ0JldHdlZW5QYW5lc1xuICAgIEB0YWJzQnlFbGVtZW50LnNldCh0YWJWaWV3LmVsZW1lbnQsIHRhYlZpZXcpXG4gICAgQGluc2VydFRhYkF0SW5kZXgodGFiVmlldywgaW5kZXgpXG4gICAgaWYgYXRvbS5jb25maWcuZ2V0KCd0YWJzLmFkZE5ld1RhYnNBdEVuZCcpXG4gICAgICBAcGFuZS5tb3ZlSXRlbShpdGVtLCBAcGFuZS5nZXRJdGVtcygpLmxlbmd0aCAtIDEpIHVubGVzcyBAaXNJdGVtTW92aW5nQmV0d2VlblBhbmVzXG5cbiAgbW92ZUl0ZW1UYWJUb0luZGV4OiAoaXRlbSwgaW5kZXgpIC0+XG4gICAgdGFiSW5kZXggPSBAdGFicy5maW5kSW5kZXgoKHQpIC0+IHQuaXRlbSBpcyBpdGVtKVxuICAgIGlmIHRhYkluZGV4IGlzbnQgLTFcbiAgICAgIHRhYiA9IEB0YWJzW3RhYkluZGV4XVxuICAgICAgdGFiLmVsZW1lbnQucmVtb3ZlKClcbiAgICAgIEB0YWJzLnNwbGljZSh0YWJJbmRleCwgMSlcbiAgICAgIEBpbnNlcnRUYWJBdEluZGV4KHRhYiwgaW5kZXgpXG5cbiAgaW5zZXJ0VGFiQXRJbmRleDogKHRhYiwgaW5kZXgpIC0+XG4gICAgZm9sbG93aW5nVGFiID0gQHRhYnNbaW5kZXhdIGlmIGluZGV4P1xuICAgIGlmIGZvbGxvd2luZ1RhYlxuICAgICAgQGVsZW1lbnQuaW5zZXJ0QmVmb3JlKHRhYi5lbGVtZW50LCBmb2xsb3dpbmdUYWIuZWxlbWVudClcbiAgICAgIEB0YWJzLnNwbGljZShpbmRleCwgMCwgdGFiKVxuICAgIGVsc2VcbiAgICAgIEBlbGVtZW50LmFwcGVuZENoaWxkKHRhYi5lbGVtZW50KVxuICAgICAgQHRhYnMucHVzaCh0YWIpXG5cbiAgICB0YWIudXBkYXRlVGl0bGUoKVxuICAgIEB1cGRhdGVUYWJCYXJWaXNpYmlsaXR5KClcblxuICByZW1vdmVUYWJGb3JJdGVtOiAoaXRlbSkgLT5cbiAgICB0YWJJbmRleCA9IEB0YWJzLmZpbmRJbmRleCgodCkgLT4gdC5pdGVtIGlzIGl0ZW0pXG4gICAgaWYgdGFiSW5kZXggaXNudCAtMVxuICAgICAgdGFiID0gQHRhYnNbdGFiSW5kZXhdXG4gICAgICBAdGFicy5zcGxpY2UodGFiSW5kZXgsIDEpXG4gICAgICBAdGFic0J5RWxlbWVudC5kZWxldGUodGFiKVxuICAgICAgdGFiLmRlc3Ryb3koKVxuICAgIHRhYi51cGRhdGVUaXRsZSgpIGZvciB0YWIgaW4gQGdldFRhYnMoKVxuICAgIEB1cGRhdGVUYWJCYXJWaXNpYmlsaXR5KClcblxuICB1cGRhdGVUYWJCYXJWaXNpYmlsaXR5OiAtPlxuICAgIGlmIG5vdCBhdG9tLmNvbmZpZy5nZXQoJ3RhYnMuYWx3YXlzU2hvd1RhYkJhcicpIGFuZCBub3QgQHNob3VsZEFsbG93RHJhZygpXG4gICAgICBAZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKVxuICAgIGVsc2VcbiAgICAgIEBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpXG5cbiAgZ2V0VGFiczogLT5cbiAgICBAdGFicy5zbGljZSgpXG5cbiAgdGFiQXRJbmRleDogKGluZGV4KSAtPlxuICAgIEB0YWJzW2luZGV4XVxuXG4gIHRhYkZvckl0ZW06IChpdGVtKSAtPlxuICAgIEB0YWJzLmZpbmQoKHQpIC0+IHQuaXRlbSBpcyBpdGVtKVxuXG4gIHNldEFjdGl2ZVRhYjogKHRhYlZpZXcpIC0+XG4gICAgaWYgdGFiVmlldz8gYW5kIHRhYlZpZXcgaXNudCBAYWN0aXZlVGFiXG4gICAgICBAYWN0aXZlVGFiPy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG4gICAgICBAYWN0aXZlVGFiID0gdGFiVmlld1xuICAgICAgQGFjdGl2ZVRhYi5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXG4gICAgICBAYWN0aXZlVGFiLmVsZW1lbnQuc2Nyb2xsSW50b1ZpZXcoZmFsc2UpXG5cbiAgZ2V0QWN0aXZlVGFiOiAtPlxuICAgIEB0YWJGb3JJdGVtKEBwYW5lLmdldEFjdGl2ZUl0ZW0oKSlcblxuICB1cGRhdGVBY3RpdmVUYWI6IC0+XG4gICAgQHNldEFjdGl2ZVRhYihAdGFiRm9ySXRlbShAcGFuZS5nZXRBY3RpdmVJdGVtKCkpKVxuXG4gIGNsb3NlVGFiOiAodGFiKSAtPlxuICAgIHRhYiA/PSBAcmlnaHRDbGlja2VkVGFiXG4gICAgQHBhbmUuZGVzdHJveUl0ZW0odGFiLml0ZW0pIGlmIHRhYj9cblxuICBvcGVuSW5OZXdXaW5kb3c6ICh0YWIpIC0+XG4gICAgdGFiID89IEByaWdodENsaWNrZWRUYWJcbiAgICBpdGVtID0gdGFiPy5pdGVtXG4gICAgcmV0dXJuIHVubGVzcyBpdGVtP1xuICAgIGlmIHR5cGVvZiBpdGVtLmdldFVSSSBpcyAnZnVuY3Rpb24nXG4gICAgICBpdGVtVVJJID0gaXRlbS5nZXRVUkkoKVxuICAgIGVsc2UgaWYgdHlwZW9mIGl0ZW0uZ2V0UGF0aCBpcyAnZnVuY3Rpb24nXG4gICAgICBpdGVtVVJJID0gaXRlbS5nZXRQYXRoKClcbiAgICBlbHNlIGlmIHR5cGVvZiBpdGVtLmdldFVyaSBpcyAnZnVuY3Rpb24nXG4gICAgICBpdGVtVVJJID0gaXRlbS5nZXRVcmkoKVxuICAgIHJldHVybiB1bmxlc3MgaXRlbVVSST9cbiAgICBAY2xvc2VUYWIodGFiKVxuICAgIHRhYi5lbGVtZW50LnN0eWxlLm1heFdpZHRoID0gJycgZm9yIHRhYiBpbiBAZ2V0VGFicygpXG4gICAgcGF0aHNUb09wZW4gPSBbYXRvbS5wcm9qZWN0LmdldFBhdGhzKCksIGl0ZW1VUkldLnJlZHVjZSAoKGEsIGIpIC0+IGEuY29uY2F0KGIpKSwgW11cbiAgICBhdG9tLm9wZW4oe3BhdGhzVG9PcGVuOiBwYXRoc1RvT3BlbiwgbmV3V2luZG93OiB0cnVlLCBkZXZNb2RlOiBhdG9tLmRldk1vZGUsIHNhZmVNb2RlOiBhdG9tLnNhZmVNb2RlfSlcblxuICBzcGxpdFRhYjogKGZuKSAtPlxuICAgIGlmIGl0ZW0gPSBAcmlnaHRDbGlja2VkVGFiPy5pdGVtXG4gICAgICBpZiBjb3BpZWRJdGVtID0gaXRlbS5jb3B5PygpXG4gICAgICAgIEBwYW5lW2ZuXShpdGVtczogW2NvcGllZEl0ZW1dKVxuXG4gIGNsb3NlT3RoZXJUYWJzOiAoYWN0aXZlKSAtPlxuICAgIHRhYnMgPSBAZ2V0VGFicygpXG4gICAgYWN0aXZlID89IEByaWdodENsaWNrZWRUYWJcbiAgICByZXR1cm4gdW5sZXNzIGFjdGl2ZT9cbiAgICBAY2xvc2VUYWIgdGFiIGZvciB0YWIgaW4gdGFicyB3aGVuIHRhYiBpc250IGFjdGl2ZVxuXG4gIGNsb3NlVGFic1RvUmlnaHQ6IChhY3RpdmUpIC0+XG4gICAgdGFicyA9IEBnZXRUYWJzKClcbiAgICBhY3RpdmUgPz0gQHJpZ2h0Q2xpY2tlZFRhYlxuICAgIGluZGV4ID0gdGFicy5pbmRleE9mKGFjdGl2ZSlcbiAgICByZXR1cm4gaWYgaW5kZXggaXMgLTFcbiAgICBAY2xvc2VUYWIgdGFiIGZvciB0YWIsIGkgaW4gdGFicyB3aGVuIGkgPiBpbmRleFxuXG4gIGNsb3NlVGFic1RvTGVmdDogKGFjdGl2ZSkgLT5cbiAgICB0YWJzID0gQGdldFRhYnMoKVxuICAgIGFjdGl2ZSA/PSBAcmlnaHRDbGlja2VkVGFiXG4gICAgaW5kZXggPSB0YWJzLmluZGV4T2YoYWN0aXZlKVxuICAgIHJldHVybiBpZiBpbmRleCBpcyAtMVxuICAgIEBjbG9zZVRhYiB0YWIgZm9yIHRhYiwgaSBpbiB0YWJzIHdoZW4gaSA8IGluZGV4XG5cbiAgY2xvc2VTYXZlZFRhYnM6IC0+XG4gICAgZm9yIHRhYiBpbiBAZ2V0VGFicygpXG4gICAgICBAY2xvc2VUYWIodGFiKSB1bmxlc3MgdGFiLml0ZW0uaXNNb2RpZmllZD8oKVxuXG4gIGNsb3NlQWxsVGFiczogLT5cbiAgICBAY2xvc2VUYWIodGFiKSBmb3IgdGFiIGluIEBnZXRUYWJzKClcblxuICBnZXRXaW5kb3dJZDogLT5cbiAgICBAd2luZG93SWQgPz0gYXRvbS5nZXRDdXJyZW50V2luZG93KCkuaWRcblxuICBzaG91bGRBbGxvd0RyYWc6IC0+XG4gICAgKEBwYW5lQ29udGFpbmVyLmdldFBhbmVzKCkubGVuZ3RoID4gMSkgb3IgKEBwYW5lLmdldEl0ZW1zKCkubGVuZ3RoID4gMSlcblxuICBvbkRyYWdTdGFydDogKGV2ZW50KSAtPlxuICAgIEBkcmFnZ2VkVGFiID0gQHRhYkZvckVsZW1lbnQoZXZlbnQudGFyZ2V0KVxuICAgIHJldHVybiB1bmxlc3MgQGRyYWdnZWRUYWJcblxuICAgIGV2ZW50LmRhdGFUcmFuc2Zlci5zZXREYXRhICdhdG9tLWV2ZW50JywgJ3RydWUnXG5cbiAgICBAZHJhZ2dlZFRhYi5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2lzLWRyYWdnaW5nJylcbiAgICBAZHJhZ2dlZFRhYi5kZXN0cm95VG9vbHRpcCgpXG5cbiAgICB0YWJJbmRleCA9IEB0YWJzLmluZGV4T2YoQGRyYWdnZWRUYWIpXG4gICAgZXZlbnQuZGF0YVRyYW5zZmVyLnNldERhdGEgJ3NvcnRhYmxlLWluZGV4JywgdGFiSW5kZXhcblxuICAgIHBhbmVJbmRleCA9IEBwYW5lQ29udGFpbmVyLmdldFBhbmVzKCkuaW5kZXhPZihAcGFuZSlcbiAgICBldmVudC5kYXRhVHJhbnNmZXIuc2V0RGF0YSAnZnJvbS1wYW5lLWluZGV4JywgcGFuZUluZGV4XG4gICAgZXZlbnQuZGF0YVRyYW5zZmVyLnNldERhdGEgJ2Zyb20tcGFuZS1pZCcsIEBwYW5lLmlkXG4gICAgZXZlbnQuZGF0YVRyYW5zZmVyLnNldERhdGEgJ2Zyb20td2luZG93LWlkJywgQGdldFdpbmRvd0lkKClcblxuICAgIGl0ZW0gPSBAcGFuZS5nZXRJdGVtcygpW0B0YWJzLmluZGV4T2YoQGRyYWdnZWRUYWIpXVxuICAgIHJldHVybiB1bmxlc3MgaXRlbT9cblxuICAgIGlmIHR5cGVvZiBpdGVtLmdldFVSSSBpcyAnZnVuY3Rpb24nXG4gICAgICBpdGVtVVJJID0gaXRlbS5nZXRVUkkoKSA/ICcnXG4gICAgZWxzZSBpZiB0eXBlb2YgaXRlbS5nZXRQYXRoIGlzICdmdW5jdGlvbidcbiAgICAgIGl0ZW1VUkkgPSBpdGVtLmdldFBhdGgoKSA/ICcnXG4gICAgZWxzZSBpZiB0eXBlb2YgaXRlbS5nZXRVcmkgaXMgJ2Z1bmN0aW9uJ1xuICAgICAgaXRlbVVSSSA9IGl0ZW0uZ2V0VXJpKCkgPyAnJ1xuXG4gICAgaWYgdHlwZW9mIGl0ZW0uZ2V0QWxsb3dlZExvY2F0aW9ucyBpcyAnZnVuY3Rpb24nXG4gICAgICBmb3IgbG9jYXRpb24gaW4gaXRlbS5nZXRBbGxvd2VkTG9jYXRpb25zKClcbiAgICAgICAgZXZlbnQuZGF0YVRyYW5zZmVyLnNldERhdGEoXCJhbGxvd2VkLWxvY2F0aW9uLSN7bG9jYXRpb259XCIsICd0cnVlJylcbiAgICBlbHNlXG4gICAgICBldmVudC5kYXRhVHJhbnNmZXIuc2V0RGF0YSAnYWxsb3ctYWxsLWxvY2F0aW9ucycsICd0cnVlJ1xuXG4gICAgaWYgaXRlbVVSST9cbiAgICAgIGV2ZW50LmRhdGFUcmFuc2Zlci5zZXREYXRhICd0ZXh0L3BsYWluJywgaXRlbVVSSVxuXG4gICAgICBpZiBwcm9jZXNzLnBsYXRmb3JtIGlzICdkYXJ3aW4nICMgc2VlICM2OVxuICAgICAgICBpdGVtVVJJID0gXCJmaWxlOi8vI3tpdGVtVVJJfVwiIHVubGVzcyBAdXJpSGFzUHJvdG9jb2woaXRlbVVSSSlcbiAgICAgICAgZXZlbnQuZGF0YVRyYW5zZmVyLnNldERhdGEgJ3RleHQvdXJpLWxpc3QnLCBpdGVtVVJJXG5cbiAgICAgIGlmIGl0ZW0uaXNNb2RpZmllZD8oKSBhbmQgaXRlbS5nZXRUZXh0P1xuICAgICAgICBldmVudC5kYXRhVHJhbnNmZXIuc2V0RGF0YSAnaGFzLXVuc2F2ZWQtY2hhbmdlcycsICd0cnVlJ1xuICAgICAgICBldmVudC5kYXRhVHJhbnNmZXIuc2V0RGF0YSAnbW9kaWZpZWQtdGV4dCcsIGl0ZW0uZ2V0VGV4dCgpXG5cbiAgdXJpSGFzUHJvdG9jb2w6ICh1cmkpIC0+XG4gICAgdHJ5XG4gICAgICByZXF1aXJlKCd1cmwnKS5wYXJzZSh1cmkpLnByb3RvY29sP1xuICAgIGNhdGNoIGVycm9yXG4gICAgICBmYWxzZVxuXG4gIG9uRHJhZ0xlYXZlOiAoZXZlbnQpIC0+XG4gICAgdGFiLmVsZW1lbnQuc3R5bGUubWF4V2lkdGggPSAnJyBmb3IgdGFiIGluIEBnZXRUYWJzKClcbiAgICBAcmVtb3ZlUGxhY2Vob2xkZXIoKVxuXG4gIG9uRHJhZ0VuZDogKGV2ZW50KSAtPlxuICAgIHJldHVybiB1bmxlc3MgQHRhYkZvckVsZW1lbnQoZXZlbnQudGFyZ2V0KVxuXG4gICAgQGNsZWFyRHJvcFRhcmdldCgpXG5cbiAgb25EcmFnT3ZlcjogKGV2ZW50KSAtPlxuICAgIHVubGVzcyBpc0F0b21FdmVudChldmVudClcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICByZXR1cm5cblxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICBuZXdEcm9wVGFyZ2V0SW5kZXggPSBAZ2V0RHJvcFRhcmdldEluZGV4KGV2ZW50KVxuICAgIHJldHVybiB1bmxlc3MgbmV3RHJvcFRhcmdldEluZGV4P1xuICAgIHJldHVybiB1bmxlc3MgaXRlbUlzQWxsb3dlZChldmVudCwgQGxvY2F0aW9uKVxuXG4gICAgQHJlbW92ZURyb3BUYXJnZXRDbGFzc2VzKClcblxuICAgIHRhYnMgPSBAZ2V0VGFicygpXG4gICAgcGxhY2Vob2xkZXIgPSBAZ2V0UGxhY2Vob2xkZXIoKVxuICAgIHJldHVybiB1bmxlc3MgcGxhY2Vob2xkZXI/XG5cbiAgICBpZiBuZXdEcm9wVGFyZ2V0SW5kZXggPCB0YWJzLmxlbmd0aFxuICAgICAgdGFiID0gdGFic1tuZXdEcm9wVGFyZ2V0SW5kZXhdXG4gICAgICB0YWIuZWxlbWVudC5jbGFzc0xpc3QuYWRkICdpcy1kcm9wLXRhcmdldCdcbiAgICAgIHRhYi5lbGVtZW50LnBhcmVudEVsZW1lbnQuaW5zZXJ0QmVmb3JlKHBsYWNlaG9sZGVyLCB0YWIuZWxlbWVudClcbiAgICBlbHNlXG4gICAgICBpZiB0YWIgPSB0YWJzW25ld0Ryb3BUYXJnZXRJbmRleCAtIDFdXG4gICAgICAgIHRhYi5lbGVtZW50LmNsYXNzTGlzdC5hZGQgJ2Ryb3AtdGFyZ2V0LWlzLWFmdGVyJ1xuICAgICAgICBpZiBzaWJsaW5nID0gdGFiLmVsZW1lbnQubmV4dFNpYmxpbmdcbiAgICAgICAgICB0YWIuZWxlbWVudC5wYXJlbnRFbGVtZW50Lmluc2VydEJlZm9yZShwbGFjZWhvbGRlciwgc2libGluZylcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHRhYi5lbGVtZW50LnBhcmVudEVsZW1lbnQuYXBwZW5kQ2hpbGQocGxhY2Vob2xkZXIpXG5cbiAgb25Ecm9wT25PdGhlcldpbmRvdzogKGZyb21QYW5lSWQsIGZyb21JdGVtSW5kZXgpIC0+XG4gICAgaWYgQHBhbmUuaWQgaXMgZnJvbVBhbmVJZFxuICAgICAgaWYgaXRlbVRvUmVtb3ZlID0gQHBhbmUuZ2V0SXRlbXMoKVtmcm9tSXRlbUluZGV4XVxuICAgICAgICBAcGFuZS5kZXN0cm95SXRlbShpdGVtVG9SZW1vdmUpXG5cbiAgICBAY2xlYXJEcm9wVGFyZ2V0KClcblxuICBjbGVhckRyb3BUYXJnZXQ6IC0+XG4gICAgQGRyYWdnZWRUYWI/LmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnaXMtZHJhZ2dpbmcnKVxuICAgIEBkcmFnZ2VkVGFiPy51cGRhdGVUb29sdGlwKClcbiAgICBAZHJhZ2dlZFRhYiA9IG51bGxcbiAgICBAcmVtb3ZlRHJvcFRhcmdldENsYXNzZXMoKVxuICAgIEByZW1vdmVQbGFjZWhvbGRlcigpXG5cbiAgb25Ecm9wOiAoZXZlbnQpIC0+XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuXG4gICAgcmV0dXJuIHVubGVzcyBldmVudC5kYXRhVHJhbnNmZXIuZ2V0RGF0YSgnYXRvbS1ldmVudCcpIGlzICd0cnVlJ1xuXG4gICAgZnJvbVdpbmRvd0lkICA9IHBhcnNlSW50KGV2ZW50LmRhdGFUcmFuc2Zlci5nZXREYXRhKCdmcm9tLXdpbmRvdy1pZCcpKVxuICAgIGZyb21QYW5lSWQgICAgPSBwYXJzZUludChldmVudC5kYXRhVHJhbnNmZXIuZ2V0RGF0YSgnZnJvbS1wYW5lLWlkJykpXG4gICAgZnJvbUluZGV4ICAgICA9IHBhcnNlSW50KGV2ZW50LmRhdGFUcmFuc2Zlci5nZXREYXRhKCdzb3J0YWJsZS1pbmRleCcpKVxuICAgIGZyb21QYW5lSW5kZXggPSBwYXJzZUludChldmVudC5kYXRhVHJhbnNmZXIuZ2V0RGF0YSgnZnJvbS1wYW5lLWluZGV4JykpXG5cbiAgICBoYXNVbnNhdmVkQ2hhbmdlcyA9IGV2ZW50LmRhdGFUcmFuc2Zlci5nZXREYXRhKCdoYXMtdW5zYXZlZC1jaGFuZ2VzJykgaXMgJ3RydWUnXG4gICAgbW9kaWZpZWRUZXh0ID0gZXZlbnQuZGF0YVRyYW5zZmVyLmdldERhdGEoJ21vZGlmaWVkLXRleHQnKVxuXG4gICAgdG9JbmRleCA9IEBnZXREcm9wVGFyZ2V0SW5kZXgoZXZlbnQpXG4gICAgdG9QYW5lID0gQHBhbmVcblxuICAgIEBjbGVhckRyb3BUYXJnZXQoKVxuXG4gICAgcmV0dXJuIHVubGVzcyBpdGVtSXNBbGxvd2VkKGV2ZW50LCBAbG9jYXRpb24pXG5cbiAgICBpZiBmcm9tV2luZG93SWQgaXMgQGdldFdpbmRvd0lkKClcbiAgICAgIGZyb21QYW5lID0gQHBhbmVDb250YWluZXIuZ2V0UGFuZXMoKVtmcm9tUGFuZUluZGV4XVxuICAgICAgaWYgZnJvbVBhbmU/LmlkIGlzbnQgZnJvbVBhbmVJZFxuICAgICAgICAjIElmIGRyYWdnaW5nIGZyb20gYSBkaWZmZXJlbnQgcGFuZSBjb250YWluZXIsIHdlIGhhdmUgdG8gYmUgbW9yZVxuICAgICAgICAjIGV4aGF1c3RpdmUgaW4gb3VyIHNlYXJjaC5cbiAgICAgICAgZnJvbVBhbmUgPSBBcnJheS5mcm9tIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2F0b20tcGFuZScpXG4gICAgICAgICAgLm1hcCAocGFuZUVsKSAtPiBwYW5lRWwubW9kZWxcbiAgICAgICAgICAuZmluZCAocGFuZSkgLT4gcGFuZS5pZCBpcyBmcm9tUGFuZUlkXG4gICAgICBpdGVtID0gZnJvbVBhbmUuZ2V0SXRlbXMoKVtmcm9tSW5kZXhdXG4gICAgICBAbW92ZUl0ZW1CZXR3ZWVuUGFuZXMoZnJvbVBhbmUsIGZyb21JbmRleCwgdG9QYW5lLCB0b0luZGV4LCBpdGVtKSBpZiBpdGVtP1xuICAgIGVsc2VcbiAgICAgIGRyb3BwZWRVUkkgPSBldmVudC5kYXRhVHJhbnNmZXIuZ2V0RGF0YSgndGV4dC9wbGFpbicpXG4gICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKGRyb3BwZWRVUkkpLnRoZW4gKGl0ZW0pID0+XG4gICAgICAgICMgTW92ZSB0aGUgaXRlbSBmcm9tIHRoZSBwYW5lIGl0IHdhcyBvcGVuZWQgb24gdG8gdGhlIHRhcmdldCBwYW5lXG4gICAgICAgICMgd2hlcmUgaXQgd2FzIGRyb3BwZWQgb250b1xuICAgICAgICBhY3RpdmVQYW5lID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpXG4gICAgICAgIGFjdGl2ZUl0ZW1JbmRleCA9IGFjdGl2ZVBhbmUuZ2V0SXRlbXMoKS5pbmRleE9mKGl0ZW0pXG4gICAgICAgIEBtb3ZlSXRlbUJldHdlZW5QYW5lcyhhY3RpdmVQYW5lLCBhY3RpdmVJdGVtSW5kZXgsIHRvUGFuZSwgdG9JbmRleCwgaXRlbSlcbiAgICAgICAgaXRlbS5zZXRUZXh0Pyhtb2RpZmllZFRleHQpIGlmIGhhc1Vuc2F2ZWRDaGFuZ2VzXG5cbiAgICAgICAgaWYgbm90IGlzTmFOKGZyb21XaW5kb3dJZClcbiAgICAgICAgICAjIExldCB0aGUgd2luZG93IHdoZXJlIHRoZSBkcmFnIHN0YXJ0ZWQga25vdyB0aGF0IHRoZSB0YWIgd2FzIGRyb3BwZWRcbiAgICAgICAgICBicm93c2VyV2luZG93ID0gQGJyb3dzZXJXaW5kb3dGb3JJZChmcm9tV2luZG93SWQpXG4gICAgICAgICAgYnJvd3NlcldpbmRvdz8ud2ViQ29udGVudHMuc2VuZCgndGFiOmRyb3BwZWQnLCBmcm9tUGFuZUlkLCBmcm9tSW5kZXgpXG5cbiAgICAgIGF0b20uZm9jdXMoKVxuXG4gIG9uTW91c2VXaGVlbDogKGV2ZW50KSAtPlxuICAgIHJldHVybiBpZiBldmVudC5zaGlmdEtleVxuXG4gICAgQHdoZWVsRGVsdGEgPz0gMFxuICAgIEB3aGVlbERlbHRhICs9IGV2ZW50LndoZWVsRGVsdGFZXG5cbiAgICBpZiBAd2hlZWxEZWx0YSA8PSAtQHRhYlNjcm9sbGluZ1RocmVzaG9sZFxuICAgICAgQHdoZWVsRGVsdGEgPSAwXG4gICAgICBAcGFuZS5hY3RpdmF0ZU5leHRJdGVtKClcbiAgICBlbHNlIGlmIEB3aGVlbERlbHRhID49IEB0YWJTY3JvbGxpbmdUaHJlc2hvbGRcbiAgICAgIEB3aGVlbERlbHRhID0gMFxuICAgICAgQHBhbmUuYWN0aXZhdGVQcmV2aW91c0l0ZW0oKVxuXG4gIG9uTW91c2VEb3duOiAoZXZlbnQpIC0+XG4gICAgdGFiID0gQHRhYkZvckVsZW1lbnQoZXZlbnQudGFyZ2V0KVxuICAgIHJldHVybiB1bmxlc3MgdGFiXG5cbiAgICBpZiBldmVudC53aGljaCBpcyAzIG9yIChldmVudC53aGljaCBpcyAxIGFuZCBldmVudC5jdHJsS2V5IGlzIHRydWUpXG4gICAgICBAcmlnaHRDbGlja2VkVGFiPy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ3JpZ2h0LWNsaWNrZWQnKVxuICAgICAgQHJpZ2h0Q2xpY2tlZFRhYiA9IHRhYlxuICAgICAgQHJpZ2h0Q2xpY2tlZFRhYi5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3JpZ2h0LWNsaWNrZWQnKVxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgIGVsc2UgaWYgZXZlbnQud2hpY2ggaXMgMlxuICAgICAgIyBUaGlzIHByZXZlbnRzIENocm9taXVtIGZyb20gYWN0aXZhdGluZyBcInNjcm9sbCBtb2RlXCIgd2hlblxuICAgICAgIyBtaWRkbGUtY2xpY2tpbmcgd2hpbGUgc29tZSB0YWJzIGFyZSBvZmYtc2NyZWVuLlxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuXG4gIG9uQ2xpY2s6IChldmVudCkgLT5cbiAgICB0YWIgPSBAdGFiRm9yRWxlbWVudChldmVudC50YXJnZXQpXG4gICAgcmV0dXJuIHVubGVzcyB0YWJcblxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICBpZiBldmVudC53aGljaCBpcyAzIG9yIChldmVudC53aGljaCBpcyAxIGFuZCBldmVudC5jdHJsS2V5IGlzIHRydWUpXG4gICAgICAjIEJhaWwgb3V0IGVhcmx5IHdoZW4gcmVjZWl2aW5nIHRoaXMgZXZlbnQsIGJlY2F1c2Ugd2UgaGF2ZSBhbHJlYWR5XG4gICAgICAjIGhhbmRsZWQgaXQgaW4gdGhlIG1vdXNlZG93biBoYW5kbGVyLlxuICAgICAgcmV0dXJuXG4gICAgZWxzZSBpZiBldmVudC53aGljaCBpcyAxIGFuZCBub3QgZXZlbnQudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnY2xvc2UtaWNvbicpXG4gICAgICBAcGFuZS5hY3RpdmF0ZUl0ZW0odGFiLml0ZW0pXG4gICAgICBAcGFuZS5hY3RpdmF0ZSgpIHVubGVzcyBAcGFuZS5pc0Rlc3Ryb3llZCgpXG4gICAgZWxzZSBpZiBldmVudC53aGljaCBpcyAyXG4gICAgICBAcGFuZS5kZXN0cm95SXRlbSh0YWIuaXRlbSlcblxuICBvbkRvdWJsZUNsaWNrOiAoZXZlbnQpIC0+XG4gICAgaWYgdGFiID0gQHRhYkZvckVsZW1lbnQoZXZlbnQudGFyZ2V0KVxuICAgICAgdGFiLml0ZW0udGVybWluYXRlUGVuZGluZ1N0YXRlPygpXG4gICAgZWxzZSBpZiBldmVudC50YXJnZXQgaXMgQGVsZW1lbnRcbiAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goQGVsZW1lbnQsICdhcHBsaWNhdGlvbjpuZXctZmlsZScpXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cbiAgdXBkYXRlVGFiU2Nyb2xsaW5nVGhyZXNob2xkOiAtPlxuICAgIEB0YWJTY3JvbGxpbmdUaHJlc2hvbGQgPSBhdG9tLmNvbmZpZy5nZXQoJ3RhYnMudGFiU2Nyb2xsaW5nVGhyZXNob2xkJylcblxuICB1cGRhdGVUYWJTY3JvbGxpbmc6ICh2YWx1ZSkgLT5cbiAgICBpZiB2YWx1ZSBpcyAncGxhdGZvcm0nXG4gICAgICBAdGFiU2Nyb2xsaW5nID0gKHByb2Nlc3MucGxhdGZvcm0gaXMgJ2xpbnV4JylcbiAgICBlbHNlXG4gICAgICBAdGFiU2Nyb2xsaW5nID0gdmFsdWVcbiAgICBAdGFiU2Nyb2xsaW5nVGhyZXNob2xkID0gYXRvbS5jb25maWcuZ2V0KCd0YWJzLnRhYlNjcm9sbGluZ1RocmVzaG9sZCcpXG5cbiAgICBpZiBAdGFiU2Nyb2xsaW5nXG4gICAgICBAZWxlbWVudC5hZGRFdmVudExpc3RlbmVyICdtb3VzZXdoZWVsJywgQG9uTW91c2VXaGVlbC5iaW5kKHRoaXMpXG4gICAgZWxzZVxuICAgICAgQGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lciAnbW91c2V3aGVlbCcsIEBvbk1vdXNlV2hlZWwuYmluZCh0aGlzKVxuXG4gIGJyb3dzZXJXaW5kb3dGb3JJZDogKGlkKSAtPlxuICAgIEJyb3dzZXJXaW5kb3cgPz0gcmVxdWlyZSgnZWxlY3Ryb24nKS5yZW1vdGUuQnJvd3NlcldpbmRvd1xuXG4gICAgQnJvd3NlcldpbmRvdy5mcm9tSWQgaWRcblxuICBtb3ZlSXRlbUJldHdlZW5QYW5lczogKGZyb21QYW5lLCBmcm9tSW5kZXgsIHRvUGFuZSwgdG9JbmRleCwgaXRlbSkgLT5cbiAgICB0cnlcbiAgICAgIGlmIHRvUGFuZSBpcyBmcm9tUGFuZVxuICAgICAgICB0b0luZGV4LS0gaWYgZnJvbUluZGV4IDwgdG9JbmRleFxuICAgICAgICB0b1BhbmUubW92ZUl0ZW0oaXRlbSwgdG9JbmRleClcbiAgICAgIGVsc2VcbiAgICAgICAgQGlzSXRlbU1vdmluZ0JldHdlZW5QYW5lcyA9IHRydWVcbiAgICAgICAgZnJvbVBhbmUubW92ZUl0ZW1Ub1BhbmUoaXRlbSwgdG9QYW5lLCB0b0luZGV4LS0pXG4gICAgICB0b1BhbmUuYWN0aXZhdGVJdGVtKGl0ZW0pXG4gICAgICB0b1BhbmUuYWN0aXZhdGUoKVxuICAgIGZpbmFsbHlcbiAgICAgIEBpc0l0ZW1Nb3ZpbmdCZXR3ZWVuUGFuZXMgPSBmYWxzZVxuXG4gIHJlbW92ZURyb3BUYXJnZXRDbGFzc2VzOiAtPlxuICAgIHdvcmtzcGFjZUVsZW1lbnQgPSBhdG9tLndvcmtzcGFjZS5nZXRFbGVtZW50KClcbiAgICBmb3IgZHJvcFRhcmdldCBpbiB3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWItYmFyIC5pcy1kcm9wLXRhcmdldCcpXG4gICAgICBkcm9wVGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoJ2lzLWRyb3AtdGFyZ2V0JylcblxuICAgIGZvciBkcm9wVGFyZ2V0IGluIHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRhYi1iYXIgLmRyb3AtdGFyZ2V0LWlzLWFmdGVyJylcbiAgICAgIGRyb3BUYXJnZXQuY2xhc3NMaXN0LnJlbW92ZSgnZHJvcC10YXJnZXQtaXMtYWZ0ZXInKVxuXG4gIGdldERyb3BUYXJnZXRJbmRleDogKGV2ZW50KSAtPlxuICAgIHRhcmdldCA9IGV2ZW50LnRhcmdldFxuXG4gICAgcmV0dXJuIGlmIEBpc1BsYWNlaG9sZGVyKHRhcmdldClcblxuICAgIHRhYnMgPSBAZ2V0VGFicygpXG4gICAgdGFiID0gQHRhYkZvckVsZW1lbnQodGFyZ2V0KVxuICAgIHRhYiA/PSB0YWJzW3RhYnMubGVuZ3RoIC0gMV1cblxuICAgIHJldHVybiAwIHVubGVzcyB0YWI/XG5cbiAgICB7bGVmdCwgd2lkdGh9ID0gdGFiLmVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICBlbGVtZW50Q2VudGVyID0gbGVmdCArIHdpZHRoIC8gMlxuICAgIGVsZW1lbnRJbmRleCA9IHRhYnMuaW5kZXhPZih0YWIpXG5cbiAgICBpZiBldmVudC5wYWdlWCA8IGVsZW1lbnRDZW50ZXJcbiAgICAgIGVsZW1lbnRJbmRleFxuICAgIGVsc2VcbiAgICAgIGVsZW1lbnRJbmRleCArIDFcblxuICBnZXRQbGFjZWhvbGRlcjogLT5cbiAgICByZXR1cm4gQHBsYWNlaG9sZGVyRWwgaWYgQHBsYWNlaG9sZGVyRWw/XG5cbiAgICBAcGxhY2Vob2xkZXJFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaVwiKVxuICAgIEBwbGFjZWhvbGRlckVsLmNsYXNzTGlzdC5hZGQoXCJwbGFjZWhvbGRlclwiKVxuICAgIEBwbGFjZWhvbGRlckVsXG5cbiAgcmVtb3ZlUGxhY2Vob2xkZXI6IC0+XG4gICAgQHBsYWNlaG9sZGVyRWw/LnJlbW92ZSgpXG4gICAgQHBsYWNlaG9sZGVyRWwgPSBudWxsXG5cbiAgaXNQbGFjZWhvbGRlcjogKGVsZW1lbnQpIC0+XG4gICAgZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ3BsYWNlaG9sZGVyJylcblxuICBvbk1vdXNlRW50ZXI6IC0+XG4gICAgZm9yIHRhYiBpbiBAZ2V0VGFicygpXG4gICAgICB7d2lkdGh9ID0gdGFiLmVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICAgIHRhYi5lbGVtZW50LnN0eWxlLm1heFdpZHRoID0gd2lkdGgudG9GaXhlZCgyKSArICdweCdcbiAgICByZXR1cm5cblxuICBvbk1vdXNlTGVhdmU6IC0+XG4gICAgdGFiLmVsZW1lbnQuc3R5bGUubWF4V2lkdGggPSAnJyBmb3IgdGFiIGluIEBnZXRUYWJzKClcbiAgICByZXR1cm5cblxuICB0YWJGb3JFbGVtZW50OiAoZWxlbWVudCkgLT5cbiAgICBjdXJyZW50RWxlbWVudCA9IGVsZW1lbnRcbiAgICB3aGlsZSBjdXJyZW50RWxlbWVudD9cbiAgICAgIGlmIHRhYiA9IEB0YWJzQnlFbGVtZW50LmdldChjdXJyZW50RWxlbWVudClcbiAgICAgICAgcmV0dXJuIHRhYlxuICAgICAgZWxzZVxuICAgICAgICBjdXJyZW50RWxlbWVudCA9IGN1cnJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnRcblxuaXNBdG9tRXZlbnQgPSAoZXZlbnQpIC0+XG4gIGZvciBpdGVtIGluIGV2ZW50LmRhdGFUcmFuc2Zlci5pdGVtc1xuICAgIGlmIGl0ZW0udHlwZSBpcyAnYXRvbS1ldmVudCdcbiAgICAgIHJldHVybiB0cnVlXG5cbiAgcmV0dXJuIGZhbHNlXG5cbml0ZW1Jc0FsbG93ZWQgPSAoZXZlbnQsIGxvY2F0aW9uKSAtPlxuICBmb3IgaXRlbSBpbiBldmVudC5kYXRhVHJhbnNmZXIuaXRlbXNcbiAgICBpZiBpdGVtLnR5cGUgaXMgJ2FsbG93LWFsbC1sb2NhdGlvbnMnIG9yIGl0ZW0udHlwZSBpcyBcImFsbG93ZWQtbG9jYXRpb24tI3tsb2NhdGlvbn1cIlxuICAgICAgcmV0dXJuIHRydWVcblxuICByZXR1cm4gZmFsc2VcbiJdfQ==
