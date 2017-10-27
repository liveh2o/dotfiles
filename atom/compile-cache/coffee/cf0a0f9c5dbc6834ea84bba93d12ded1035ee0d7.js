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
      var item, itemURI, pathsToOpen;
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RhYnMvbGliL3RhYi1iYXItdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLGFBQUEsR0FBZ0I7O0VBQ2YsY0FBZSxPQUFBLENBQVEsVUFBUjs7RUFFZixzQkFBdUIsT0FBQSxDQUFRLE1BQVI7O0VBQ3hCLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVI7O0VBQ0osT0FBQSxHQUFVLE9BQUEsQ0FBUSxZQUFSOztFQUVWLE1BQU0sQ0FBQyxPQUFQLEdBQ007SUFDUyxvQkFBQyxLQUFELEVBQVEsU0FBUjtBQUNYLFVBQUE7TUFEWSxJQUFDLENBQUEsT0FBRDtNQUFPLElBQUMsQ0FBQSxXQUFEO01BQ25CLElBQUMsQ0FBQSxPQUFELEdBQVcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsSUFBdkI7TUFDWCxJQUFDLENBQUEsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFuQixDQUF1QixhQUF2QjtNQUNBLElBQUMsQ0FBQSxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQW5CLENBQXVCLFNBQXZCO01BQ0EsSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBbkIsQ0FBdUIsYUFBdkI7TUFDQSxJQUFDLENBQUEsT0FBTyxDQUFDLFlBQVQsQ0FBc0IsSUFBdEIsRUFBNEIsV0FBNUI7TUFDQSxJQUFDLENBQUEsT0FBTyxDQUFDLFlBQVQsQ0FBc0IsVUFBdEIsRUFBa0MsQ0FBQyxDQUFuQztNQUNBLElBQUMsQ0FBQSxPQUFPLENBQUMsWUFBVCxDQUFzQixVQUF0QixFQUFrQyxJQUFDLENBQUEsUUFBbkM7TUFFQSxJQUFDLENBQUEsSUFBRCxHQUFRO01BQ1IsSUFBQyxDQUFBLGFBQUQsR0FBaUIsSUFBSTtNQUNyQixJQUFDLENBQUEsYUFBRCxHQUFpQixJQUFJO01BRXJCLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJ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YyxDQUFkLENBQUEsR0FBbUI7QUFGbEQ7SUFEWTs7eUJBTWQsWUFBQSxHQUFjLFNBQUE7QUFDWixVQUFBO0FBQUE7QUFBQSxXQUFBLHFDQUFBOztRQUFBLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFFBQWxCLEdBQTZCO0FBQTdCO0lBRFk7O3lCQUlkLGFBQUEsR0FBZSxTQUFDLE9BQUQ7QUFDYixVQUFBO01BQUEsY0FBQSxHQUFpQjtBQUNqQixhQUFNLHNCQUFOO1FBQ0UsSUFBRyxHQUFBLEdBQU0sSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLGNBQW5CLENBQVQ7QUFDRSxpQkFBTyxJQURUO1NBQUEsTUFBQTtVQUdFLGNBQUEsR0FBaUIsY0FBYyxDQUFDLGNBSGxDOztNQURGO0lBRmE7Ozs7OztFQVFqQixXQUFBLEdBQWMsU0FBQyxLQUFEO0FBQ1osUUFBQTtBQUFBO0FBQUEsU0FBQSxxQ0FBQTs7TUFDRSxJQUFHLElBQUksQ0FBQyxJQUFMLEtBQWEsWUFBaEI7QUFDRSxlQUFPLEtBRFQ7O0FBREY7QUFJQSxXQUFPO0VBTEs7O0VBT2QsYUFBQSxHQUFnQixTQUFDLEtBQUQsRUFBUSxRQUFSO0FBQ2QsUUFBQTtBQUFBO0FBQUEsU0FBQSxxQ0FBQTs7TUFDRSxJQUFHLElBQUksQ0FBQyxJQUFMLEtBQWEscUJBQWIsSUFBc0MsSUFBSSxDQUFDLElBQUwsS0FBYSxDQUFBLG1CQUFBLEdBQW9CLFFBQXBCLENBQXREO0FBQ0UsZUFBTyxLQURUOztBQURGO0FBSUEsV0FBTztFQUxPO0FBbmhCaEIiLCJzb3VyY2VzQ29udGVudCI6WyJCcm93c2VyV2luZG93ID0gbnVsbCAjIERlZmVyIHJlcXVpcmUgdW50aWwgYWN0dWFsbHkgdXNlZFxue2lwY1JlbmRlcmVyfSA9IHJlcXVpcmUgJ2VsZWN0cm9uJ1xuXG57Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xuXyA9IHJlcXVpcmUgJ3VuZGVyc2NvcmUtcGx1cydcblRhYlZpZXcgPSByZXF1aXJlICcuL3RhYi12aWV3J1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBUYWJCYXJWaWV3XG4gIGNvbnN0cnVjdG9yOiAoQHBhbmUsIEBsb2NhdGlvbikgLT5cbiAgICBAZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3VsJylcbiAgICBAZWxlbWVudC5jbGFzc0xpc3QuYWRkKFwibGlzdC1pbmxpbmVcIilcbiAgICBAZWxlbWVudC5jbGFzc0xpc3QuYWRkKFwidGFiLWJhclwiKVxuICAgIEBlbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJpbnNldC1wYW5lbFwiKVxuICAgIEBlbGVtZW50LnNldEF0dHJpYnV0ZSgnaXMnLCAnYXRvbS10YWJzJylcbiAgICBAZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJ0YWJpbmRleFwiLCAtMSlcbiAgICBAZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJsb2NhdGlvblwiLCBAbG9jYXRpb24pXG5cbiAgICBAdGFicyA9IFtdXG4gICAgQHRhYnNCeUVsZW1lbnQgPSBuZXcgV2Vha01hcFxuICAgIEBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCBAcGFuZS5nZXRFbGVtZW50KCksXG4gICAgICAndGFiczprZWVwLXBlbmRpbmctdGFiJzogPT4gQHRlcm1pbmF0ZVBlbmRpbmdTdGF0ZXMoKVxuICAgICAgJ3RhYnM6Y2xvc2UtdGFiJzogPT4gQGNsb3NlVGFiKEBnZXRBY3RpdmVUYWIoKSlcbiAgICAgICd0YWJzOmNsb3NlLW90aGVyLXRhYnMnOiA9PiBAY2xvc2VPdGhlclRhYnMoQGdldEFjdGl2ZVRhYigpKVxuICAgICAgJ3RhYnM6Y2xvc2UtdGFicy10by1yaWdodCc6ID0+IEBjbG9zZVRhYnNUb1JpZ2h0KEBnZXRBY3RpdmVUYWIoKSlcbiAgICAgICd0YWJzOmNsb3NlLXRhYnMtdG8tbGVmdCc6ID0+IEBjbG9zZVRhYnNUb0xlZnQoQGdldEFjdGl2ZVRhYigpKVxuICAgICAgJ3RhYnM6Y2xvc2Utc2F2ZWQtdGFicyc6ID0+IEBjbG9zZVNhdmVkVGFicygpXG4gICAgICAndGFiczpjbG9zZS1hbGwtdGFicyc6IChldmVudCkgPT5cbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgQGNsb3NlQWxsVGFicygpXG4gICAgICAndGFiczpvcGVuLWluLW5ldy13aW5kb3cnOiA9PiBAb3BlbkluTmV3V2luZG93KClcblxuICAgIGFkZEVsZW1lbnRDb21tYW5kcyA9IChjb21tYW5kcykgPT5cbiAgICAgIGNvbW1hbmRzV2l0aFByb3BhZ2F0aW9uU3RvcHBlZCA9IHt9XG4gICAgICBPYmplY3Qua2V5cyhjb21tYW5kcykuZm9yRWFjaCAobmFtZSkgLT5cbiAgICAgICAgY29tbWFuZHNXaXRoUHJvcGFnYXRpb25TdG9wcGVkW25hbWVdID0gKGV2ZW50KSAtPlxuICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgICAgY29tbWFuZHNbbmFtZV0oKVxuXG4gICAgICBAc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb21tYW5kcy5hZGQoQGVsZW1lbnQsIGNvbW1hbmRzV2l0aFByb3BhZ2F0aW9uU3RvcHBlZCkpXG5cbiAgICBhZGRFbGVtZW50Q29tbWFuZHNcbiAgICAgICd0YWJzOmNsb3NlLXRhYic6ID0+IEBjbG9zZVRhYigpXG4gICAgICAndGFiczpjbG9zZS1vdGhlci10YWJzJzogPT4gQGNsb3NlT3RoZXJUYWJzKClcbiAgICAgICd0YWJzOmNsb3NlLXRhYnMtdG8tcmlnaHQnOiA9PiBAY2xvc2VUYWJzVG9SaWdodCgpXG4gICAgICAndGFiczpjbG9zZS10YWJzLXRvLWxlZnQnOiA9PiBAY2xvc2VUYWJzVG9MZWZ0KClcbiAgICAgICd0YWJzOmNsb3NlLXNhdmVkLXRhYnMnOiA9PiBAY2xvc2VTYXZlZFRhYnMoKVxuICAgICAgJ3RhYnM6Y2xvc2UtYWxsLXRhYnMnOiA9PiBAY2xvc2VBbGxUYWJzKClcbiAgICAgICd0YWJzOnNwbGl0LXVwJzogPT4gQHNwbGl0VGFiKCdzcGxpdFVwJylcbiAgICAgICd0YWJzOnNwbGl0LWRvd24nOiA9PiBAc3BsaXRUYWIoJ3NwbGl0RG93bicpXG4gICAgICAndGFiczpzcGxpdC1sZWZ0JzogPT4gQHNwbGl0VGFiKCdzcGxpdExlZnQnKVxuICAgICAgJ3RhYnM6c3BsaXQtcmlnaHQnOiA9PiBAc3BsaXRUYWIoJ3NwbGl0UmlnaHQnKVxuXG4gICAgQGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lciBcIm1vdXNlZW50ZXJcIiwgQG9uTW91c2VFbnRlci5iaW5kKHRoaXMpXG4gICAgQGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lciBcIm1vdXNlbGVhdmVcIiwgQG9uTW91c2VMZWF2ZS5iaW5kKHRoaXMpXG4gICAgQGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lciBcImRyYWdzdGFydFwiLCBAb25EcmFnU3RhcnQuYmluZCh0aGlzKVxuICAgIEBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIgXCJkcmFnZW5kXCIsIEBvbkRyYWdFbmQuYmluZCh0aGlzKVxuICAgIEBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIgXCJkcmFnbGVhdmVcIiwgQG9uRHJhZ0xlYXZlLmJpbmQodGhpcylcbiAgICBAZWxlbWVudC5hZGRFdmVudExpc3RlbmVyIFwiZHJhZ292ZXJcIiwgQG9uRHJhZ092ZXIuYmluZCh0aGlzKVxuICAgIEBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIgXCJkcm9wXCIsIEBvbkRyb3AuYmluZCh0aGlzKVxuXG4gICAgQHBhbmVDb250YWluZXIgPSBAcGFuZS5nZXRDb250YWluZXIoKVxuICAgIEBhZGRUYWJGb3JJdGVtKGl0ZW0pIGZvciBpdGVtIGluIEBwYW5lLmdldEl0ZW1zKClcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBAcGFuZS5vbkRpZERlc3Ryb3kgPT5cbiAgICAgIEBkZXN0cm95KClcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBAcGFuZS5vbkRpZEFkZEl0ZW0gKHtpdGVtLCBpbmRleH0pID0+XG4gICAgICBAYWRkVGFiRm9ySXRlbShpdGVtLCBpbmRleClcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBAcGFuZS5vbkRpZE1vdmVJdGVtICh7aXRlbSwgbmV3SW5kZXh9KSA9PlxuICAgICAgQG1vdmVJdGVtVGFiVG9JbmRleChpdGVtLCBuZXdJbmRleClcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBAcGFuZS5vbkRpZFJlbW92ZUl0ZW0gKHtpdGVtfSkgPT5cbiAgICAgIEByZW1vdmVUYWJGb3JJdGVtKGl0ZW0pXG5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgQHBhbmUub25EaWRDaGFuZ2VBY3RpdmVJdGVtIChpdGVtKSA9PlxuICAgICAgQHVwZGF0ZUFjdGl2ZVRhYigpXG5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb25maWcub2JzZXJ2ZSAndGFicy50YWJTY3JvbGxpbmcnLCBAdXBkYXRlVGFiU2Nyb2xsaW5nLmJpbmQodGhpcylcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb25maWcub2JzZXJ2ZSAndGFicy50YWJTY3JvbGxpbmdUaHJlc2hvbGQnLCA9PiBAdXBkYXRlVGFiU2Nyb2xsaW5nVGhyZXNob2xkKClcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb25maWcub2JzZXJ2ZSAndGFicy5hbHdheXNTaG93VGFiQmFyJywgPT4gQHVwZGF0ZVRhYkJhclZpc2liaWxpdHkoKVxuXG4gICAgQHVwZGF0ZUFjdGl2ZVRhYigpXG5cbiAgICBAZWxlbWVudC5hZGRFdmVudExpc3RlbmVyIFwibW91c2Vkb3duXCIsIEBvbk1vdXNlRG93bi5iaW5kKHRoaXMpXG4gICAgQGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lciBcImNsaWNrXCIsIEBvbkNsaWNrLmJpbmQodGhpcylcbiAgICBAZWxlbWVudC5hZGRFdmVudExpc3RlbmVyIFwiZGJsY2xpY2tcIiwgQG9uRG91YmxlQ2xpY2suYmluZCh0aGlzKVxuXG4gICAgQG9uRHJvcE9uT3RoZXJXaW5kb3cgPSBAb25Ecm9wT25PdGhlcldpbmRvdy5iaW5kKHRoaXMpXG4gICAgaXBjUmVuZGVyZXIub24oJ3RhYjpkcm9wcGVkJywgQG9uRHJvcE9uT3RoZXJXaW5kb3cpXG5cbiAgZGVzdHJveTogLT5cbiAgICBpcGNSZW5kZXJlci5yZW1vdmVMaXN0ZW5lcigndGFiOmRyb3BwZWQnLCBAb25Ecm9wT25PdGhlcldpbmRvdylcbiAgICBAc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICBAZWxlbWVudC5yZW1vdmUoKVxuXG4gIHRlcm1pbmF0ZVBlbmRpbmdTdGF0ZXM6IC0+XG4gICAgdGFiLnRlcm1pbmF0ZVBlbmRpbmdTdGF0ZT8oKSBmb3IgdGFiIGluIEBnZXRUYWJzKClcbiAgICByZXR1cm5cblxuICBhZGRUYWJGb3JJdGVtOiAoaXRlbSwgaW5kZXgpIC0+XG4gICAgdGFiVmlldyA9IG5ldyBUYWJWaWV3KHtcbiAgICAgIGl0ZW0sXG4gICAgICBAcGFuZSxcbiAgICAgIEB0YWJzLFxuICAgICAgZGlkQ2xpY2tDbG9zZUljb246ID0+XG4gICAgICAgIEBjbG9zZVRhYih0YWJWaWV3KVxuICAgICAgICByZXR1cm5cbiAgICAgIEBsb2NhdGlvblxuICAgIH0pXG4gICAgdGFiVmlldy50ZXJtaW5hdGVQZW5kaW5nU3RhdGUoKSBpZiBAaXNJdGVtTW92aW5nQmV0d2VlblBhbmVzXG4gICAgQHRhYnNCeUVsZW1lbnQuc2V0KHRhYlZpZXcuZWxlbWVudCwgdGFiVmlldylcbiAgICBAaW5zZXJ0VGFiQXRJbmRleCh0YWJWaWV3LCBpbmRleClcbiAgICBpZiBhdG9tLmNvbmZpZy5nZXQoJ3RhYnMuYWRkTmV3VGFic0F0RW5kJylcbiAgICAgIEBwYW5lLm1vdmVJdGVtKGl0ZW0sIEBwYW5lLmdldEl0ZW1zKCkubGVuZ3RoIC0gMSkgdW5sZXNzIEBpc0l0ZW1Nb3ZpbmdCZXR3ZWVuUGFuZXNcblxuICBtb3ZlSXRlbVRhYlRvSW5kZXg6IChpdGVtLCBpbmRleCkgLT5cbiAgICB0YWJJbmRleCA9IEB0YWJzLmZpbmRJbmRleCgodCkgLT4gdC5pdGVtIGlzIGl0ZW0pXG4gICAgaWYgdGFiSW5kZXggaXNudCAtMVxuICAgICAgdGFiID0gQHRhYnNbdGFiSW5kZXhdXG4gICAgICB0YWIuZWxlbWVudC5yZW1vdmUoKVxuICAgICAgQHRhYnMuc3BsaWNlKHRhYkluZGV4LCAxKVxuICAgICAgQGluc2VydFRhYkF0SW5kZXgodGFiLCBpbmRleClcblxuICBpbnNlcnRUYWJBdEluZGV4OiAodGFiLCBpbmRleCkgLT5cbiAgICBmb2xsb3dpbmdUYWIgPSBAdGFic1tpbmRleF0gaWYgaW5kZXg/XG4gICAgaWYgZm9sbG93aW5nVGFiXG4gICAgICBAZWxlbWVudC5pbnNlcnRCZWZvcmUodGFiLmVsZW1lbnQsIGZvbGxvd2luZ1RhYi5lbGVtZW50KVxuICAgICAgQHRhYnMuc3BsaWNlKGluZGV4LCAwLCB0YWIpXG4gICAgZWxzZVxuICAgICAgQGVsZW1lbnQuYXBwZW5kQ2hpbGQodGFiLmVsZW1lbnQpXG4gICAgICBAdGFicy5wdXNoKHRhYilcblxuICAgIHRhYi51cGRhdGVUaXRsZSgpXG4gICAgQHVwZGF0ZVRhYkJhclZpc2liaWxpdHkoKVxuXG4gIHJlbW92ZVRhYkZvckl0ZW06IChpdGVtKSAtPlxuICAgIHRhYkluZGV4ID0gQHRhYnMuZmluZEluZGV4KCh0KSAtPiB0Lml0ZW0gaXMgaXRlbSlcbiAgICBpZiB0YWJJbmRleCBpc250IC0xXG4gICAgICB0YWIgPSBAdGFic1t0YWJJbmRleF1cbiAgICAgIEB0YWJzLnNwbGljZSh0YWJJbmRleCwgMSlcbiAgICAgIEB0YWJzQnlFbGVtZW50LmRlbGV0ZSh0YWIpXG4gICAgICB0YWIuZGVzdHJveSgpXG4gICAgdGFiLnVwZGF0ZVRpdGxlKCkgZm9yIHRhYiBpbiBAZ2V0VGFicygpXG4gICAgQHVwZGF0ZVRhYkJhclZpc2liaWxpdHkoKVxuXG4gIHVwZGF0ZVRhYkJhclZpc2liaWxpdHk6IC0+XG4gICAgaWYgbm90IGF0b20uY29uZmlnLmdldCgndGFicy5hbHdheXNTaG93VGFiQmFyJykgYW5kIG5vdCBAc2hvdWxkQWxsb3dEcmFnKClcbiAgICAgIEBlbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpXG4gICAgZWxzZVxuICAgICAgQGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJylcblxuICBnZXRUYWJzOiAtPlxuICAgIEB0YWJzLnNsaWNlKClcblxuICB0YWJBdEluZGV4OiAoaW5kZXgpIC0+XG4gICAgQHRhYnNbaW5kZXhdXG5cbiAgdGFiRm9ySXRlbTogKGl0ZW0pIC0+XG4gICAgQHRhYnMuZmluZCgodCkgLT4gdC5pdGVtIGlzIGl0ZW0pXG5cbiAgc2V0QWN0aXZlVGFiOiAodGFiVmlldykgLT5cbiAgICBpZiB0YWJWaWV3PyBhbmQgdGFiVmlldyBpc250IEBhY3RpdmVUYWJcbiAgICAgIEBhY3RpdmVUYWI/LmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcbiAgICAgIEBhY3RpdmVUYWIgPSB0YWJWaWV3XG4gICAgICBAYWN0aXZlVGFiLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcbiAgICAgIEBhY3RpdmVUYWIuZWxlbWVudC5zY3JvbGxJbnRvVmlldyhmYWxzZSlcblxuICBnZXRBY3RpdmVUYWI6IC0+XG4gICAgQHRhYkZvckl0ZW0oQHBhbmUuZ2V0QWN0aXZlSXRlbSgpKVxuXG4gIHVwZGF0ZUFjdGl2ZVRhYjogLT5cbiAgICBAc2V0QWN0aXZlVGFiKEB0YWJGb3JJdGVtKEBwYW5lLmdldEFjdGl2ZUl0ZW0oKSkpXG5cbiAgY2xvc2VUYWI6ICh0YWIpIC0+XG4gICAgdGFiID89IEByaWdodENsaWNrZWRUYWJcbiAgICBAcGFuZS5kZXN0cm95SXRlbSh0YWIuaXRlbSkgaWYgdGFiP1xuXG4gIG9wZW5Jbk5ld1dpbmRvdzogKHRhYikgLT5cbiAgICB0YWIgPz0gQHJpZ2h0Q2xpY2tlZFRhYlxuICAgIGl0ZW0gPSB0YWI/Lml0ZW1cbiAgICByZXR1cm4gdW5sZXNzIGl0ZW0/XG4gICAgaWYgdHlwZW9mIGl0ZW0uZ2V0VVJJIGlzICdmdW5jdGlvbidcbiAgICAgIGl0ZW1VUkkgPSBpdGVtLmdldFVSSSgpXG4gICAgZWxzZSBpZiB0eXBlb2YgaXRlbS5nZXRQYXRoIGlzICdmdW5jdGlvbidcbiAgICAgIGl0ZW1VUkkgPSBpdGVtLmdldFBhdGgoKVxuICAgIGVsc2UgaWYgdHlwZW9mIGl0ZW0uZ2V0VXJpIGlzICdmdW5jdGlvbidcbiAgICAgIGl0ZW1VUkkgPSBpdGVtLmdldFVyaSgpXG4gICAgcmV0dXJuIHVubGVzcyBpdGVtVVJJP1xuICAgIEBjbG9zZVRhYih0YWIpXG4gICAgcGF0aHNUb09wZW4gPSBbYXRvbS5wcm9qZWN0LmdldFBhdGhzKCksIGl0ZW1VUkldLnJlZHVjZSAoKGEsIGIpIC0+IGEuY29uY2F0KGIpKSwgW11cbiAgICBhdG9tLm9wZW4oe3BhdGhzVG9PcGVuOiBwYXRoc1RvT3BlbiwgbmV3V2luZG93OiB0cnVlLCBkZXZNb2RlOiBhdG9tLmRldk1vZGUsIHNhZmVNb2RlOiBhdG9tLnNhZmVNb2RlfSlcblxuICBzcGxpdFRhYjogKGZuKSAtPlxuICAgIGlmIGl0ZW0gPSBAcmlnaHRDbGlja2VkVGFiPy5pdGVtXG4gICAgICBpZiBjb3BpZWRJdGVtID0gaXRlbS5jb3B5PygpXG4gICAgICAgIEBwYW5lW2ZuXShpdGVtczogW2NvcGllZEl0ZW1dKVxuXG4gIGNsb3NlT3RoZXJUYWJzOiAoYWN0aXZlKSAtPlxuICAgIHRhYnMgPSBAZ2V0VGFicygpXG4gICAgYWN0aXZlID89IEByaWdodENsaWNrZWRUYWJcbiAgICByZXR1cm4gdW5sZXNzIGFjdGl2ZT9cbiAgICBAY2xvc2VUYWIgdGFiIGZvciB0YWIgaW4gdGFicyB3aGVuIHRhYiBpc250IGFjdGl2ZVxuXG4gIGNsb3NlVGFic1RvUmlnaHQ6IChhY3RpdmUpIC0+XG4gICAgdGFicyA9IEBnZXRUYWJzKClcbiAgICBhY3RpdmUgPz0gQHJpZ2h0Q2xpY2tlZFRhYlxuICAgIGluZGV4ID0gdGFicy5pbmRleE9mKGFjdGl2ZSlcbiAgICByZXR1cm4gaWYgaW5kZXggaXMgLTFcbiAgICBAY2xvc2VUYWIgdGFiIGZvciB0YWIsIGkgaW4gdGFicyB3aGVuIGkgPiBpbmRleFxuXG4gIGNsb3NlVGFic1RvTGVmdDogKGFjdGl2ZSkgLT5cbiAgICB0YWJzID0gQGdldFRhYnMoKVxuICAgIGFjdGl2ZSA/PSBAcmlnaHRDbGlja2VkVGFiXG4gICAgaW5kZXggPSB0YWJzLmluZGV4T2YoYWN0aXZlKVxuICAgIHJldHVybiBpZiBpbmRleCBpcyAtMVxuICAgIEBjbG9zZVRhYiB0YWIgZm9yIHRhYiwgaSBpbiB0YWJzIHdoZW4gaSA8IGluZGV4XG5cbiAgY2xvc2VTYXZlZFRhYnM6IC0+XG4gICAgZm9yIHRhYiBpbiBAZ2V0VGFicygpXG4gICAgICBAY2xvc2VUYWIodGFiKSB1bmxlc3MgdGFiLml0ZW0uaXNNb2RpZmllZD8oKVxuXG4gIGNsb3NlQWxsVGFiczogLT5cbiAgICBAY2xvc2VUYWIodGFiKSBmb3IgdGFiIGluIEBnZXRUYWJzKClcblxuICBnZXRXaW5kb3dJZDogLT5cbiAgICBAd2luZG93SWQgPz0gYXRvbS5nZXRDdXJyZW50V2luZG93KCkuaWRcblxuICBzaG91bGRBbGxvd0RyYWc6IC0+XG4gICAgKEBwYW5lQ29udGFpbmVyLmdldFBhbmVzKCkubGVuZ3RoID4gMSkgb3IgKEBwYW5lLmdldEl0ZW1zKCkubGVuZ3RoID4gMSlcblxuICBvbkRyYWdTdGFydDogKGV2ZW50KSAtPlxuICAgIEBkcmFnZ2VkVGFiID0gQHRhYkZvckVsZW1lbnQoZXZlbnQudGFyZ2V0KVxuICAgIHJldHVybiB1bmxlc3MgQGRyYWdnZWRUYWJcblxuICAgIGV2ZW50LmRhdGFUcmFuc2Zlci5zZXREYXRhICdhdG9tLWV2ZW50JywgJ3RydWUnXG5cbiAgICBAZHJhZ2dlZFRhYi5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2lzLWRyYWdnaW5nJylcbiAgICBAZHJhZ2dlZFRhYi5kZXN0cm95VG9vbHRpcCgpXG5cbiAgICB0YWJJbmRleCA9IEB0YWJzLmluZGV4T2YoQGRyYWdnZWRUYWIpXG4gICAgZXZlbnQuZGF0YVRyYW5zZmVyLnNldERhdGEgJ3NvcnRhYmxlLWluZGV4JywgdGFiSW5kZXhcblxuICAgIHBhbmVJbmRleCA9IEBwYW5lQ29udGFpbmVyLmdldFBhbmVzKCkuaW5kZXhPZihAcGFuZSlcbiAgICBldmVudC5kYXRhVHJhbnNmZXIuc2V0RGF0YSAnZnJvbS1wYW5lLWluZGV4JywgcGFuZUluZGV4XG4gICAgZXZlbnQuZGF0YVRyYW5zZmVyLnNldERhdGEgJ2Zyb20tcGFuZS1pZCcsIEBwYW5lLmlkXG4gICAgZXZlbnQuZGF0YVRyYW5zZmVyLnNldERhdGEgJ2Zyb20td2luZG93LWlkJywgQGdldFdpbmRvd0lkKClcblxuICAgIGl0ZW0gPSBAcGFuZS5nZXRJdGVtcygpW0B0YWJzLmluZGV4T2YoQGRyYWdnZWRUYWIpXVxuICAgIHJldHVybiB1bmxlc3MgaXRlbT9cblxuICAgIGlmIHR5cGVvZiBpdGVtLmdldFVSSSBpcyAnZnVuY3Rpb24nXG4gICAgICBpdGVtVVJJID0gaXRlbS5nZXRVUkkoKSA/ICcnXG4gICAgZWxzZSBpZiB0eXBlb2YgaXRlbS5nZXRQYXRoIGlzICdmdW5jdGlvbidcbiAgICAgIGl0ZW1VUkkgPSBpdGVtLmdldFBhdGgoKSA/ICcnXG4gICAgZWxzZSBpZiB0eXBlb2YgaXRlbS5nZXRVcmkgaXMgJ2Z1bmN0aW9uJ1xuICAgICAgaXRlbVVSSSA9IGl0ZW0uZ2V0VXJpKCkgPyAnJ1xuXG4gICAgaWYgdHlwZW9mIGl0ZW0uZ2V0QWxsb3dlZExvY2F0aW9ucyBpcyAnZnVuY3Rpb24nXG4gICAgICBmb3IgbG9jYXRpb24gaW4gaXRlbS5nZXRBbGxvd2VkTG9jYXRpb25zKClcbiAgICAgICAgZXZlbnQuZGF0YVRyYW5zZmVyLnNldERhdGEoXCJhbGxvd2VkLWxvY2F0aW9uLSN7bG9jYXRpb259XCIsICd0cnVlJylcbiAgICBlbHNlXG4gICAgICBldmVudC5kYXRhVHJhbnNmZXIuc2V0RGF0YSAnYWxsb3ctYWxsLWxvY2F0aW9ucycsICd0cnVlJ1xuXG4gICAgaWYgaXRlbVVSST9cbiAgICAgIGV2ZW50LmRhdGFUcmFuc2Zlci5zZXREYXRhICd0ZXh0L3BsYWluJywgaXRlbVVSSVxuXG4gICAgICBpZiBwcm9jZXNzLnBsYXRmb3JtIGlzICdkYXJ3aW4nICMgc2VlICM2OVxuICAgICAgICBpdGVtVVJJID0gXCJmaWxlOi8vI3tpdGVtVVJJfVwiIHVubGVzcyBAdXJpSGFzUHJvdG9jb2woaXRlbVVSSSlcbiAgICAgICAgZXZlbnQuZGF0YVRyYW5zZmVyLnNldERhdGEgJ3RleHQvdXJpLWxpc3QnLCBpdGVtVVJJXG5cbiAgICAgIGlmIGl0ZW0uaXNNb2RpZmllZD8oKSBhbmQgaXRlbS5nZXRUZXh0P1xuICAgICAgICBldmVudC5kYXRhVHJhbnNmZXIuc2V0RGF0YSAnaGFzLXVuc2F2ZWQtY2hhbmdlcycsICd0cnVlJ1xuICAgICAgICBldmVudC5kYXRhVHJhbnNmZXIuc2V0RGF0YSAnbW9kaWZpZWQtdGV4dCcsIGl0ZW0uZ2V0VGV4dCgpXG5cbiAgdXJpSGFzUHJvdG9jb2w6ICh1cmkpIC0+XG4gICAgdHJ5XG4gICAgICByZXF1aXJlKCd1cmwnKS5wYXJzZSh1cmkpLnByb3RvY29sP1xuICAgIGNhdGNoIGVycm9yXG4gICAgICBmYWxzZVxuXG4gIG9uRHJhZ0xlYXZlOiAoZXZlbnQpIC0+XG4gICAgQHJlbW92ZVBsYWNlaG9sZGVyKClcblxuICBvbkRyYWdFbmQ6IChldmVudCkgLT5cbiAgICByZXR1cm4gdW5sZXNzIEB0YWJGb3JFbGVtZW50KGV2ZW50LnRhcmdldClcblxuICAgIEBjbGVhckRyb3BUYXJnZXQoKVxuXG4gIG9uRHJhZ092ZXI6IChldmVudCkgLT5cbiAgICB1bmxlc3MgaXNBdG9tRXZlbnQoZXZlbnQpXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgcmV0dXJuXG5cbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgbmV3RHJvcFRhcmdldEluZGV4ID0gQGdldERyb3BUYXJnZXRJbmRleChldmVudClcbiAgICByZXR1cm4gdW5sZXNzIG5ld0Ryb3BUYXJnZXRJbmRleD9cbiAgICByZXR1cm4gdW5sZXNzIGl0ZW1Jc0FsbG93ZWQoZXZlbnQsIEBsb2NhdGlvbilcblxuICAgIEByZW1vdmVEcm9wVGFyZ2V0Q2xhc3NlcygpXG5cbiAgICB0YWJzID0gQGdldFRhYnMoKVxuICAgIHBsYWNlaG9sZGVyID0gQGdldFBsYWNlaG9sZGVyKClcbiAgICByZXR1cm4gdW5sZXNzIHBsYWNlaG9sZGVyP1xuXG4gICAgaWYgbmV3RHJvcFRhcmdldEluZGV4IDwgdGFicy5sZW5ndGhcbiAgICAgIHRhYiA9IHRhYnNbbmV3RHJvcFRhcmdldEluZGV4XVxuICAgICAgdGFiLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCAnaXMtZHJvcC10YXJnZXQnXG4gICAgICB0YWIuZWxlbWVudC5wYXJlbnRFbGVtZW50Lmluc2VydEJlZm9yZShwbGFjZWhvbGRlciwgdGFiLmVsZW1lbnQpXG4gICAgZWxzZVxuICAgICAgaWYgdGFiID0gdGFic1tuZXdEcm9wVGFyZ2V0SW5kZXggLSAxXVxuICAgICAgICB0YWIuZWxlbWVudC5jbGFzc0xpc3QuYWRkICdkcm9wLXRhcmdldC1pcy1hZnRlcidcbiAgICAgICAgaWYgc2libGluZyA9IHRhYi5lbGVtZW50Lm5leHRTaWJsaW5nXG4gICAgICAgICAgdGFiLmVsZW1lbnQucGFyZW50RWxlbWVudC5pbnNlcnRCZWZvcmUocGxhY2Vob2xkZXIsIHNpYmxpbmcpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICB0YWIuZWxlbWVudC5wYXJlbnRFbGVtZW50LmFwcGVuZENoaWxkKHBsYWNlaG9sZGVyKVxuXG4gIG9uRHJvcE9uT3RoZXJXaW5kb3c6IChmcm9tUGFuZUlkLCBmcm9tSXRlbUluZGV4KSAtPlxuICAgIGlmIEBwYW5lLmlkIGlzIGZyb21QYW5lSWRcbiAgICAgIGlmIGl0ZW1Ub1JlbW92ZSA9IEBwYW5lLmdldEl0ZW1zKClbZnJvbUl0ZW1JbmRleF1cbiAgICAgICAgQHBhbmUuZGVzdHJveUl0ZW0oaXRlbVRvUmVtb3ZlKVxuXG4gICAgQGNsZWFyRHJvcFRhcmdldCgpXG5cbiAgY2xlYXJEcm9wVGFyZ2V0OiAtPlxuICAgIEBkcmFnZ2VkVGFiPy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2lzLWRyYWdnaW5nJylcbiAgICBAZHJhZ2dlZFRhYj8udXBkYXRlVG9vbHRpcCgpXG4gICAgQGRyYWdnZWRUYWIgPSBudWxsXG4gICAgQHJlbW92ZURyb3BUYXJnZXRDbGFzc2VzKClcbiAgICBAcmVtb3ZlUGxhY2Vob2xkZXIoKVxuXG4gIG9uRHJvcDogKGV2ZW50KSAtPlxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcblxuICAgIHJldHVybiB1bmxlc3MgZXZlbnQuZGF0YVRyYW5zZmVyLmdldERhdGEoJ2F0b20tZXZlbnQnKSBpcyAndHJ1ZSdcblxuICAgIGZyb21XaW5kb3dJZCAgPSBwYXJzZUludChldmVudC5kYXRhVHJhbnNmZXIuZ2V0RGF0YSgnZnJvbS13aW5kb3ctaWQnKSlcbiAgICBmcm9tUGFuZUlkICAgID0gcGFyc2VJbnQoZXZlbnQuZGF0YVRyYW5zZmVyLmdldERhdGEoJ2Zyb20tcGFuZS1pZCcpKVxuICAgIGZyb21JbmRleCAgICAgPSBwYXJzZUludChldmVudC5kYXRhVHJhbnNmZXIuZ2V0RGF0YSgnc29ydGFibGUtaW5kZXgnKSlcbiAgICBmcm9tUGFuZUluZGV4ID0gcGFyc2VJbnQoZXZlbnQuZGF0YVRyYW5zZmVyLmdldERhdGEoJ2Zyb20tcGFuZS1pbmRleCcpKVxuXG4gICAgaGFzVW5zYXZlZENoYW5nZXMgPSBldmVudC5kYXRhVHJhbnNmZXIuZ2V0RGF0YSgnaGFzLXVuc2F2ZWQtY2hhbmdlcycpIGlzICd0cnVlJ1xuICAgIG1vZGlmaWVkVGV4dCA9IGV2ZW50LmRhdGFUcmFuc2Zlci5nZXREYXRhKCdtb2RpZmllZC10ZXh0JylcblxuICAgIHRvSW5kZXggPSBAZ2V0RHJvcFRhcmdldEluZGV4KGV2ZW50KVxuICAgIHRvUGFuZSA9IEBwYW5lXG5cbiAgICBAY2xlYXJEcm9wVGFyZ2V0KClcblxuICAgIHJldHVybiB1bmxlc3MgaXRlbUlzQWxsb3dlZChldmVudCwgQGxvY2F0aW9uKVxuXG4gICAgaWYgZnJvbVdpbmRvd0lkIGlzIEBnZXRXaW5kb3dJZCgpXG4gICAgICBmcm9tUGFuZSA9IEBwYW5lQ29udGFpbmVyLmdldFBhbmVzKClbZnJvbVBhbmVJbmRleF1cbiAgICAgIGlmIGZyb21QYW5lPy5pZCBpc250IGZyb21QYW5lSWRcbiAgICAgICAgIyBJZiBkcmFnZ2luZyBmcm9tIGEgZGlmZmVyZW50IHBhbmUgY29udGFpbmVyLCB3ZSBoYXZlIHRvIGJlIG1vcmVcbiAgICAgICAgIyBleGhhdXN0aXZlIGluIG91ciBzZWFyY2guXG4gICAgICAgIGZyb21QYW5lID0gQXJyYXkuZnJvbSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdhdG9tLXBhbmUnKVxuICAgICAgICAgIC5tYXAgKHBhbmVFbCkgLT4gcGFuZUVsLm1vZGVsXG4gICAgICAgICAgLmZpbmQgKHBhbmUpIC0+IHBhbmUuaWQgaXMgZnJvbVBhbmVJZFxuICAgICAgaXRlbSA9IGZyb21QYW5lLmdldEl0ZW1zKClbZnJvbUluZGV4XVxuICAgICAgQG1vdmVJdGVtQmV0d2VlblBhbmVzKGZyb21QYW5lLCBmcm9tSW5kZXgsIHRvUGFuZSwgdG9JbmRleCwgaXRlbSkgaWYgaXRlbT9cbiAgICBlbHNlXG4gICAgICBkcm9wcGVkVVJJID0gZXZlbnQuZGF0YVRyYW5zZmVyLmdldERhdGEoJ3RleHQvcGxhaW4nKVxuICAgICAgYXRvbS53b3Jrc3BhY2Uub3Blbihkcm9wcGVkVVJJKS50aGVuIChpdGVtKSA9PlxuICAgICAgICAjIE1vdmUgdGhlIGl0ZW0gZnJvbSB0aGUgcGFuZSBpdCB3YXMgb3BlbmVkIG9uIHRvIHRoZSB0YXJnZXQgcGFuZVxuICAgICAgICAjIHdoZXJlIGl0IHdhcyBkcm9wcGVkIG9udG9cbiAgICAgICAgYWN0aXZlUGFuZSA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKVxuICAgICAgICBhY3RpdmVJdGVtSW5kZXggPSBhY3RpdmVQYW5lLmdldEl0ZW1zKCkuaW5kZXhPZihpdGVtKVxuICAgICAgICBAbW92ZUl0ZW1CZXR3ZWVuUGFuZXMoYWN0aXZlUGFuZSwgYWN0aXZlSXRlbUluZGV4LCB0b1BhbmUsIHRvSW5kZXgsIGl0ZW0pXG4gICAgICAgIGl0ZW0uc2V0VGV4dD8obW9kaWZpZWRUZXh0KSBpZiBoYXNVbnNhdmVkQ2hhbmdlc1xuXG4gICAgICAgIGlmIG5vdCBpc05hTihmcm9tV2luZG93SWQpXG4gICAgICAgICAgIyBMZXQgdGhlIHdpbmRvdyB3aGVyZSB0aGUgZHJhZyBzdGFydGVkIGtub3cgdGhhdCB0aGUgdGFiIHdhcyBkcm9wcGVkXG4gICAgICAgICAgYnJvd3NlcldpbmRvdyA9IEBicm93c2VyV2luZG93Rm9ySWQoZnJvbVdpbmRvd0lkKVxuICAgICAgICAgIGJyb3dzZXJXaW5kb3c/LndlYkNvbnRlbnRzLnNlbmQoJ3RhYjpkcm9wcGVkJywgZnJvbVBhbmVJZCwgZnJvbUluZGV4KVxuXG4gICAgICBhdG9tLmZvY3VzKClcblxuICBvbk1vdXNlV2hlZWw6IChldmVudCkgLT5cbiAgICByZXR1cm4gaWYgZXZlbnQuc2hpZnRLZXlcblxuICAgIEB3aGVlbERlbHRhID89IDBcbiAgICBAd2hlZWxEZWx0YSArPSBldmVudC53aGVlbERlbHRhWVxuXG4gICAgaWYgQHdoZWVsRGVsdGEgPD0gLUB0YWJTY3JvbGxpbmdUaHJlc2hvbGRcbiAgICAgIEB3aGVlbERlbHRhID0gMFxuICAgICAgQHBhbmUuYWN0aXZhdGVOZXh0SXRlbSgpXG4gICAgZWxzZSBpZiBAd2hlZWxEZWx0YSA+PSBAdGFiU2Nyb2xsaW5nVGhyZXNob2xkXG4gICAgICBAd2hlZWxEZWx0YSA9IDBcbiAgICAgIEBwYW5lLmFjdGl2YXRlUHJldmlvdXNJdGVtKClcblxuICBvbk1vdXNlRG93bjogKGV2ZW50KSAtPlxuICAgIHRhYiA9IEB0YWJGb3JFbGVtZW50KGV2ZW50LnRhcmdldClcbiAgICByZXR1cm4gdW5sZXNzIHRhYlxuXG4gICAgaWYgZXZlbnQud2hpY2ggaXMgMyBvciAoZXZlbnQud2hpY2ggaXMgMSBhbmQgZXZlbnQuY3RybEtleSBpcyB0cnVlKVxuICAgICAgQHJpZ2h0Q2xpY2tlZFRhYj8uZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdyaWdodC1jbGlja2VkJylcbiAgICAgIEByaWdodENsaWNrZWRUYWIgPSB0YWJcbiAgICAgIEByaWdodENsaWNrZWRUYWIuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdyaWdodC1jbGlja2VkJylcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICBlbHNlIGlmIGV2ZW50LndoaWNoIGlzIDJcbiAgICAgICMgVGhpcyBwcmV2ZW50cyBDaHJvbWl1bSBmcm9tIGFjdGl2YXRpbmcgXCJzY3JvbGwgbW9kZVwiIHdoZW5cbiAgICAgICMgbWlkZGxlLWNsaWNraW5nIHdoaWxlIHNvbWUgdGFicyBhcmUgb2ZmLXNjcmVlbi5cbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcblxuICBvbkNsaWNrOiAoZXZlbnQpIC0+XG4gICAgdGFiID0gQHRhYkZvckVsZW1lbnQoZXZlbnQudGFyZ2V0KVxuICAgIHJldHVybiB1bmxlc3MgdGFiXG5cbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgaWYgZXZlbnQud2hpY2ggaXMgMyBvciAoZXZlbnQud2hpY2ggaXMgMSBhbmQgZXZlbnQuY3RybEtleSBpcyB0cnVlKVxuICAgICAgIyBCYWlsIG91dCBlYXJseSB3aGVuIHJlY2VpdmluZyB0aGlzIGV2ZW50LCBiZWNhdXNlIHdlIGhhdmUgYWxyZWFkeVxuICAgICAgIyBoYW5kbGVkIGl0IGluIHRoZSBtb3VzZWRvd24gaGFuZGxlci5cbiAgICAgIHJldHVyblxuICAgIGVsc2UgaWYgZXZlbnQud2hpY2ggaXMgMSBhbmQgbm90IGV2ZW50LnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2Nsb3NlLWljb24nKVxuICAgICAgQHBhbmUuYWN0aXZhdGVJdGVtKHRhYi5pdGVtKVxuICAgICAgQHBhbmUuYWN0aXZhdGUoKSB1bmxlc3MgQHBhbmUuaXNEZXN0cm95ZWQoKVxuICAgIGVsc2UgaWYgZXZlbnQud2hpY2ggaXMgMlxuICAgICAgQHBhbmUuZGVzdHJveUl0ZW0odGFiLml0ZW0pXG5cbiAgb25Eb3VibGVDbGljazogKGV2ZW50KSAtPlxuICAgIGlmIHRhYiA9IEB0YWJGb3JFbGVtZW50KGV2ZW50LnRhcmdldClcbiAgICAgIHRhYi5pdGVtLnRlcm1pbmF0ZVBlbmRpbmdTdGF0ZT8oKVxuICAgIGVsc2UgaWYgZXZlbnQudGFyZ2V0IGlzIEBlbGVtZW50XG4gICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKEBlbGVtZW50LCAnYXBwbGljYXRpb246bmV3LWZpbGUnKVxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuXG4gIHVwZGF0ZVRhYlNjcm9sbGluZ1RocmVzaG9sZDogLT5cbiAgICBAdGFiU2Nyb2xsaW5nVGhyZXNob2xkID0gYXRvbS5jb25maWcuZ2V0KCd0YWJzLnRhYlNjcm9sbGluZ1RocmVzaG9sZCcpXG5cbiAgdXBkYXRlVGFiU2Nyb2xsaW5nOiAodmFsdWUpIC0+XG4gICAgaWYgdmFsdWUgaXMgJ3BsYXRmb3JtJ1xuICAgICAgQHRhYlNjcm9sbGluZyA9IChwcm9jZXNzLnBsYXRmb3JtIGlzICdsaW51eCcpXG4gICAgZWxzZVxuICAgICAgQHRhYlNjcm9sbGluZyA9IHZhbHVlXG4gICAgQHRhYlNjcm9sbGluZ1RocmVzaG9sZCA9IGF0b20uY29uZmlnLmdldCgndGFicy50YWJTY3JvbGxpbmdUaHJlc2hvbGQnKVxuXG4gICAgaWYgQHRhYlNjcm9sbGluZ1xuICAgICAgQGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lciAnbW91c2V3aGVlbCcsIEBvbk1vdXNlV2hlZWwuYmluZCh0aGlzKVxuICAgIGVsc2VcbiAgICAgIEBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIgJ21vdXNld2hlZWwnLCBAb25Nb3VzZVdoZWVsLmJpbmQodGhpcylcblxuICBicm93c2VyV2luZG93Rm9ySWQ6IChpZCkgLT5cbiAgICBCcm93c2VyV2luZG93ID89IHJlcXVpcmUoJ2VsZWN0cm9uJykucmVtb3RlLkJyb3dzZXJXaW5kb3dcblxuICAgIEJyb3dzZXJXaW5kb3cuZnJvbUlkIGlkXG5cbiAgbW92ZUl0ZW1CZXR3ZWVuUGFuZXM6IChmcm9tUGFuZSwgZnJvbUluZGV4LCB0b1BhbmUsIHRvSW5kZXgsIGl0ZW0pIC0+XG4gICAgdHJ5XG4gICAgICBpZiB0b1BhbmUgaXMgZnJvbVBhbmVcbiAgICAgICAgdG9JbmRleC0tIGlmIGZyb21JbmRleCA8IHRvSW5kZXhcbiAgICAgICAgdG9QYW5lLm1vdmVJdGVtKGl0ZW0sIHRvSW5kZXgpXG4gICAgICBlbHNlXG4gICAgICAgIEBpc0l0ZW1Nb3ZpbmdCZXR3ZWVuUGFuZXMgPSB0cnVlXG4gICAgICAgIGZyb21QYW5lLm1vdmVJdGVtVG9QYW5lKGl0ZW0sIHRvUGFuZSwgdG9JbmRleC0tKVxuICAgICAgdG9QYW5lLmFjdGl2YXRlSXRlbShpdGVtKVxuICAgICAgdG9QYW5lLmFjdGl2YXRlKClcbiAgICBmaW5hbGx5XG4gICAgICBAaXNJdGVtTW92aW5nQmV0d2VlblBhbmVzID0gZmFsc2VcblxuICByZW1vdmVEcm9wVGFyZ2V0Q2xhc3NlczogLT5cbiAgICB3b3Jrc3BhY2VFbGVtZW50ID0gYXRvbS53b3Jrc3BhY2UuZ2V0RWxlbWVudCgpXG4gICAgZm9yIGRyb3BUYXJnZXQgaW4gd29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudGFiLWJhciAuaXMtZHJvcC10YXJnZXQnKVxuICAgICAgZHJvcFRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKCdpcy1kcm9wLXRhcmdldCcpXG5cbiAgICBmb3IgZHJvcFRhcmdldCBpbiB3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWItYmFyIC5kcm9wLXRhcmdldC1pcy1hZnRlcicpXG4gICAgICBkcm9wVGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoJ2Ryb3AtdGFyZ2V0LWlzLWFmdGVyJylcblxuICBnZXREcm9wVGFyZ2V0SW5kZXg6IChldmVudCkgLT5cbiAgICB0YXJnZXQgPSBldmVudC50YXJnZXRcblxuICAgIHJldHVybiBpZiBAaXNQbGFjZWhvbGRlcih0YXJnZXQpXG5cbiAgICB0YWJzID0gQGdldFRhYnMoKVxuICAgIHRhYiA9IEB0YWJGb3JFbGVtZW50KHRhcmdldClcbiAgICB0YWIgPz0gdGFic1t0YWJzLmxlbmd0aCAtIDFdXG5cbiAgICByZXR1cm4gMCB1bmxlc3MgdGFiP1xuXG4gICAge2xlZnQsIHdpZHRofSA9IHRhYi5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgZWxlbWVudENlbnRlciA9IGxlZnQgKyB3aWR0aCAvIDJcbiAgICBlbGVtZW50SW5kZXggPSB0YWJzLmluZGV4T2YodGFiKVxuXG4gICAgaWYgZXZlbnQucGFnZVggPCBlbGVtZW50Q2VudGVyXG4gICAgICBlbGVtZW50SW5kZXhcbiAgICBlbHNlXG4gICAgICBlbGVtZW50SW5kZXggKyAxXG5cbiAgZ2V0UGxhY2Vob2xkZXI6IC0+XG4gICAgcmV0dXJuIEBwbGFjZWhvbGRlckVsIGlmIEBwbGFjZWhvbGRlckVsP1xuXG4gICAgQHBsYWNlaG9sZGVyRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlcIilcbiAgICBAcGxhY2Vob2xkZXJFbC5jbGFzc0xpc3QuYWRkKFwicGxhY2Vob2xkZXJcIilcbiAgICBAcGxhY2Vob2xkZXJFbFxuXG4gIHJlbW92ZVBsYWNlaG9sZGVyOiAtPlxuICAgIEBwbGFjZWhvbGRlckVsPy5yZW1vdmUoKVxuICAgIEBwbGFjZWhvbGRlckVsID0gbnVsbFxuXG4gIGlzUGxhY2Vob2xkZXI6IChlbGVtZW50KSAtPlxuICAgIGVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdwbGFjZWhvbGRlcicpXG5cbiAgb25Nb3VzZUVudGVyOiAtPlxuICAgIGZvciB0YWIgaW4gQGdldFRhYnMoKVxuICAgICAge3dpZHRofSA9IHRhYi5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICB0YWIuZWxlbWVudC5zdHlsZS5tYXhXaWR0aCA9IHdpZHRoLnRvRml4ZWQoMikgKyAncHgnXG4gICAgcmV0dXJuXG5cbiAgb25Nb3VzZUxlYXZlOiAtPlxuICAgIHRhYi5lbGVtZW50LnN0eWxlLm1heFdpZHRoID0gJycgZm9yIHRhYiBpbiBAZ2V0VGFicygpXG4gICAgcmV0dXJuXG5cbiAgdGFiRm9yRWxlbWVudDogKGVsZW1lbnQpIC0+XG4gICAgY3VycmVudEVsZW1lbnQgPSBlbGVtZW50XG4gICAgd2hpbGUgY3VycmVudEVsZW1lbnQ/XG4gICAgICBpZiB0YWIgPSBAdGFic0J5RWxlbWVudC5nZXQoY3VycmVudEVsZW1lbnQpXG4gICAgICAgIHJldHVybiB0YWJcbiAgICAgIGVsc2VcbiAgICAgICAgY3VycmVudEVsZW1lbnQgPSBjdXJyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50XG5cbmlzQXRvbUV2ZW50ID0gKGV2ZW50KSAtPlxuICBmb3IgaXRlbSBpbiBldmVudC5kYXRhVHJhbnNmZXIuaXRlbXNcbiAgICBpZiBpdGVtLnR5cGUgaXMgJ2F0b20tZXZlbnQnXG4gICAgICByZXR1cm4gdHJ1ZVxuXG4gIHJldHVybiBmYWxzZVxuXG5pdGVtSXNBbGxvd2VkID0gKGV2ZW50LCBsb2NhdGlvbikgLT5cbiAgZm9yIGl0ZW0gaW4gZXZlbnQuZGF0YVRyYW5zZmVyLml0ZW1zXG4gICAgaWYgaXRlbS50eXBlIGlzICdhbGxvdy1hbGwtbG9jYXRpb25zJyBvciBpdGVtLnR5cGUgaXMgXCJhbGxvd2VkLWxvY2F0aW9uLSN7bG9jYXRpb259XCJcbiAgICAgIHJldHVybiB0cnVlXG5cbiAgcmV0dXJuIGZhbHNlXG4iXX0=
