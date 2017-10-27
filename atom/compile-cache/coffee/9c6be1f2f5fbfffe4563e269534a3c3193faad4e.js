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
      this.tabs = [];
      this.tabsByElement = new WeakMap;
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.commands.add(atom.views.getView(this.pane), {
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
        if (copiedItem = this.copyItem(item)) {
          return this.pane[fn]({
            items: [copiedItem]
          });
        }
      }
    };

    TabBarView.prototype.copyItem = function(item) {
      var ref;
      return (ref = typeof item.copy === "function" ? item.copy() : void 0) != null ? ref : atom.deserializers.deserialize(item.serialize());
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
      } else if (event.which === 1 && !event.target.classList.contains('close-icon')) {
        return setImmediate((function(_this) {
          return function() {
            _this.pane.activateItem(tab.item);
            if (!_this.pane.isDestroyed()) {
              return _this.pane.activate();
            }
          };
        })(this));
      } else if (event.which === 2) {
        this.pane.destroyItem(tab.item);
        return event.preventDefault();
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
      workspaceElement = atom.views.getView(atom.workspace);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RhYnMvbGliL3RhYi1iYXItdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLGFBQUEsR0FBZ0I7O0VBQ2YsY0FBZSxPQUFBLENBQVEsVUFBUjs7RUFFZixzQkFBdUIsT0FBQSxDQUFRLE1BQVI7O0VBQ3hCLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVI7O0VBQ0osT0FBQSxHQUFVLE9BQUEsQ0FBUSxZQUFSOztFQUVWLE1BQU0sQ0FBQyxPQUFQLEdBQ007SUFDUyxvQkFBQyxLQUFELEVBQVEsU0FBUjtBQUNYLFVBQUE7TUFEWSxJQUFDLENBQUEsT0FBRDtNQUFPLElBQUMsQ0FBQSxXQUFEO01BQ25CLElBQUMsQ0FBQSxPQUFELEdBQVcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsSUFBdkI7TUFDWCxJQUFDLENBQUEsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFuQixDQUF1QixhQUF2QjtNQUNBLElBQUMsQ0FBQSxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQW5CLENBQXVCLFNBQXZCO01BQ0EsSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBbkIsQ0FBdUIsYUFBdkI7TUFDQSxJQUFDLENBQUEsT0FBTyxDQUFDLFlBQVQsQ0FBc0IsSUFBdEIsRUFBNEIsV0FBNUI7TUFDQSxJQUFDLENBQUEsT0FBTyxDQUFDLFlBQVQsQ0FBc0IsVUFBdEIsRUFBa0MsQ0FBQyxDQUFuQztNQUVBLElBQUMsQ0FBQSxJQUFELEdBQVE7TUFDUixJQUFDLENBQUEsYUFBRCxHQUFpQixJQUFJO01BQ3JCLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUk7TUFFckIsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBQyxD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QUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsY0FBbkIsQ0FBVDtBQUNFLGlCQUFPLElBRFQ7U0FBQSxNQUFBO1VBR0UsY0FBQSxHQUFpQixjQUFjLENBQUMsY0FIbEM7O01BREY7SUFGYTs7Ozs7O0VBUWpCLFdBQUEsR0FBYyxTQUFDLEtBQUQ7QUFDWixRQUFBO0FBQUE7QUFBQSxTQUFBLHFDQUFBOztNQUNFLElBQUcsSUFBSSxDQUFDLElBQUwsS0FBYSxZQUFoQjtBQUNFLGVBQU8sS0FEVDs7QUFERjtBQUlBLFdBQU87RUFMSzs7RUFPZCxhQUFBLEdBQWdCLFNBQUMsS0FBRCxFQUFRLFFBQVI7QUFDZCxRQUFBO0FBQUE7QUFBQSxTQUFBLHFDQUFBOztNQUNFLElBQUcsSUFBSSxDQUFDLElBQUwsS0FBYSxxQkFBYixJQUFzQyxJQUFJLENBQUMsSUFBTCxLQUFhLENBQUEsbUJBQUEsR0FBb0IsUUFBcEIsQ0FBdEQ7QUFDRSxlQUFPLEtBRFQ7O0FBREY7QUFJQSxXQUFPO0VBTE87QUE3Z0JoQiIsInNvdXJjZXNDb250ZW50IjpbIkJyb3dzZXJXaW5kb3cgPSBudWxsICMgRGVmZXIgcmVxdWlyZSB1bnRpbCBhY3R1YWxseSB1c2VkXG57aXBjUmVuZGVyZXJ9ID0gcmVxdWlyZSAnZWxlY3Ryb24nXG5cbntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG5fID0gcmVxdWlyZSAndW5kZXJzY29yZS1wbHVzJ1xuVGFiVmlldyA9IHJlcXVpcmUgJy4vdGFiLXZpZXcnXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIFRhYkJhclZpZXdcbiAgY29uc3RydWN0b3I6IChAcGFuZSwgQGxvY2F0aW9uKSAtPlxuICAgIEBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndWwnKVxuICAgIEBlbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJsaXN0LWlubGluZVwiKVxuICAgIEBlbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJ0YWItYmFyXCIpXG4gICAgQGVsZW1lbnQuY2xhc3NMaXN0LmFkZChcImluc2V0LXBhbmVsXCIpXG4gICAgQGVsZW1lbnQuc2V0QXR0cmlidXRlKCdpcycsICdhdG9tLXRhYnMnKVxuICAgIEBlbGVtZW50LnNldEF0dHJpYnV0ZShcInRhYmluZGV4XCIsIC0xKVxuXG4gICAgQHRhYnMgPSBbXVxuICAgIEB0YWJzQnlFbGVtZW50ID0gbmV3IFdlYWtNYXBcbiAgICBAc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgYXRvbS52aWV3cy5nZXRWaWV3KEBwYW5lKSxcbiAgICAgICd0YWJzOmtlZXAtcGVuZGluZy10YWInOiA9PiBAdGVybWluYXRlUGVuZGluZ1N0YXRlcygpXG4gICAgICAndGFiczpjbG9zZS10YWInOiA9PiBAY2xvc2VUYWIoQGdldEFjdGl2ZVRhYigpKVxuICAgICAgJ3RhYnM6Y2xvc2Utb3RoZXItdGFicyc6ID0+IEBjbG9zZU90aGVyVGFicyhAZ2V0QWN0aXZlVGFiKCkpXG4gICAgICAndGFiczpjbG9zZS10YWJzLXRvLXJpZ2h0JzogPT4gQGNsb3NlVGFic1RvUmlnaHQoQGdldEFjdGl2ZVRhYigpKVxuICAgICAgJ3RhYnM6Y2xvc2UtdGFicy10by1sZWZ0JzogPT4gQGNsb3NlVGFic1RvTGVmdChAZ2V0QWN0aXZlVGFiKCkpXG4gICAgICAndGFiczpjbG9zZS1zYXZlZC10YWJzJzogPT4gQGNsb3NlU2F2ZWRUYWJzKClcbiAgICAgICd0YWJzOmNsb3NlLWFsbC10YWJzJzogKGV2ZW50KSA9PlxuICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICBAY2xvc2VBbGxUYWJzKClcbiAgICAgICd0YWJzOm9wZW4taW4tbmV3LXdpbmRvdyc6ID0+IEBvcGVuSW5OZXdXaW5kb3coKVxuXG4gICAgYWRkRWxlbWVudENvbW1hbmRzID0gKGNvbW1hbmRzKSA9PlxuICAgICAgY29tbWFuZHNXaXRoUHJvcGFnYXRpb25TdG9wcGVkID0ge31cbiAgICAgIE9iamVjdC5rZXlzKGNvbW1hbmRzKS5mb3JFYWNoIChuYW1lKSAtPlxuICAgICAgICBjb21tYW5kc1dpdGhQcm9wYWdhdGlvblN0b3BwZWRbbmFtZV0gPSAoZXZlbnQpIC0+XG4gICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgICBjb21tYW5kc1tuYW1lXSgpXG5cbiAgICAgIEBzdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbW1hbmRzLmFkZChAZWxlbWVudCwgY29tbWFuZHNXaXRoUHJvcGFnYXRpb25TdG9wcGVkKSlcblxuICAgIGFkZEVsZW1lbnRDb21tYW5kc1xuICAgICAgJ3RhYnM6Y2xvc2UtdGFiJzogPT4gQGNsb3NlVGFiKClcbiAgICAgICd0YWJzOmNsb3NlLW90aGVyLXRhYnMnOiA9PiBAY2xvc2VPdGhlclRhYnMoKVxuICAgICAgJ3RhYnM6Y2xvc2UtdGFicy10by1yaWdodCc6ID0+IEBjbG9zZVRhYnNUb1JpZ2h0KClcbiAgICAgICd0YWJzOmNsb3NlLXRhYnMtdG8tbGVmdCc6ID0+IEBjbG9zZVRhYnNUb0xlZnQoKVxuICAgICAgJ3RhYnM6Y2xvc2Utc2F2ZWQtdGFicyc6ID0+IEBjbG9zZVNhdmVkVGFicygpXG4gICAgICAndGFiczpjbG9zZS1hbGwtdGFicyc6ID0+IEBjbG9zZUFsbFRhYnMoKVxuICAgICAgJ3RhYnM6c3BsaXQtdXAnOiA9PiBAc3BsaXRUYWIoJ3NwbGl0VXAnKVxuICAgICAgJ3RhYnM6c3BsaXQtZG93bic6ID0+IEBzcGxpdFRhYignc3BsaXREb3duJylcbiAgICAgICd0YWJzOnNwbGl0LWxlZnQnOiA9PiBAc3BsaXRUYWIoJ3NwbGl0TGVmdCcpXG4gICAgICAndGFiczpzcGxpdC1yaWdodCc6ID0+IEBzcGxpdFRhYignc3BsaXRSaWdodCcpXG5cbiAgICBAZWxlbWVudC5hZGRFdmVudExpc3RlbmVyIFwibW91c2VlbnRlclwiLCBAb25Nb3VzZUVudGVyLmJpbmQodGhpcylcbiAgICBAZWxlbWVudC5hZGRFdmVudExpc3RlbmVyIFwibW91c2VsZWF2ZVwiLCBAb25Nb3VzZUxlYXZlLmJpbmQodGhpcylcbiAgICBAZWxlbWVudC5hZGRFdmVudExpc3RlbmVyIFwiZHJhZ3N0YXJ0XCIsIEBvbkRyYWdTdGFydC5iaW5kKHRoaXMpXG4gICAgQGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lciBcImRyYWdlbmRcIiwgQG9uRHJhZ0VuZC5iaW5kKHRoaXMpXG4gICAgQGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lciBcImRyYWdsZWF2ZVwiLCBAb25EcmFnTGVhdmUuYmluZCh0aGlzKVxuICAgIEBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIgXCJkcmFnb3ZlclwiLCBAb25EcmFnT3Zlci5iaW5kKHRoaXMpXG4gICAgQGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lciBcImRyb3BcIiwgQG9uRHJvcC5iaW5kKHRoaXMpXG5cbiAgICBAcGFuZUNvbnRhaW5lciA9IEBwYW5lLmdldENvbnRhaW5lcigpXG4gICAgQGFkZFRhYkZvckl0ZW0oaXRlbSkgZm9yIGl0ZW0gaW4gQHBhbmUuZ2V0SXRlbXMoKVxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIEBwYW5lLm9uRGlkRGVzdHJveSA9PlxuICAgICAgQGRlc3Ryb3koKVxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIEBwYW5lLm9uRGlkQWRkSXRlbSAoe2l0ZW0sIGluZGV4fSkgPT5cbiAgICAgIEBhZGRUYWJGb3JJdGVtKGl0ZW0sIGluZGV4KVxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIEBwYW5lLm9uRGlkTW92ZUl0ZW0gKHtpdGVtLCBuZXdJbmRleH0pID0+XG4gICAgICBAbW92ZUl0ZW1UYWJUb0luZGV4KGl0ZW0sIG5ld0luZGV4KVxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIEBwYW5lLm9uRGlkUmVtb3ZlSXRlbSAoe2l0ZW19KSA9PlxuICAgICAgQHJlbW92ZVRhYkZvckl0ZW0oaXRlbSlcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBAcGFuZS5vbkRpZENoYW5nZUFjdGl2ZUl0ZW0gKGl0ZW0pID0+XG4gICAgICBAdXBkYXRlQWN0aXZlVGFiKClcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbmZpZy5vYnNlcnZlICd0YWJzLnRhYlNjcm9sbGluZycsIEB1cGRhdGVUYWJTY3JvbGxpbmcuYmluZCh0aGlzKVxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbmZpZy5vYnNlcnZlICd0YWJzLnRhYlNjcm9sbGluZ1RocmVzaG9sZCcsID0+IEB1cGRhdGVUYWJTY3JvbGxpbmdUaHJlc2hvbGQoKVxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbmZpZy5vYnNlcnZlICd0YWJzLmFsd2F5c1Nob3dUYWJCYXInLCA9PiBAdXBkYXRlVGFiQmFyVmlzaWJpbGl0eSgpXG5cbiAgICBAdXBkYXRlQWN0aXZlVGFiKClcblxuICAgIEBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIgXCJtb3VzZWRvd25cIiwgQG9uTW91c2VEb3duLmJpbmQodGhpcylcbiAgICBAZWxlbWVudC5hZGRFdmVudExpc3RlbmVyIFwiZGJsY2xpY2tcIiwgQG9uRG91YmxlQ2xpY2suYmluZCh0aGlzKVxuXG4gICAgQG9uRHJvcE9uT3RoZXJXaW5kb3cgPSBAb25Ecm9wT25PdGhlcldpbmRvdy5iaW5kKHRoaXMpXG4gICAgaXBjUmVuZGVyZXIub24oJ3RhYjpkcm9wcGVkJywgQG9uRHJvcE9uT3RoZXJXaW5kb3cpXG5cbiAgZGVzdHJveTogLT5cbiAgICBpcGNSZW5kZXJlci5yZW1vdmVMaXN0ZW5lcigndGFiOmRyb3BwZWQnLCBAb25Ecm9wT25PdGhlcldpbmRvdylcbiAgICBAc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICBAZWxlbWVudC5yZW1vdmUoKVxuXG4gIHRlcm1pbmF0ZVBlbmRpbmdTdGF0ZXM6IC0+XG4gICAgdGFiLnRlcm1pbmF0ZVBlbmRpbmdTdGF0ZT8oKSBmb3IgdGFiIGluIEBnZXRUYWJzKClcbiAgICByZXR1cm5cblxuICBhZGRUYWJGb3JJdGVtOiAoaXRlbSwgaW5kZXgpIC0+XG4gICAgdGFiVmlldyA9IG5ldyBUYWJWaWV3KHtcbiAgICAgIGl0ZW0sXG4gICAgICBAcGFuZSxcbiAgICAgIEB0YWJzLFxuICAgICAgZGlkQ2xpY2tDbG9zZUljb246ID0+XG4gICAgICAgIEBjbG9zZVRhYih0YWJWaWV3KVxuICAgICAgICByZXR1cm5cbiAgICAgIEBsb2NhdGlvblxuICAgIH0pXG4gICAgdGFiVmlldy50ZXJtaW5hdGVQZW5kaW5nU3RhdGUoKSBpZiBAaXNJdGVtTW92aW5nQmV0d2VlblBhbmVzXG4gICAgQHRhYnNCeUVsZW1lbnQuc2V0KHRhYlZpZXcuZWxlbWVudCwgdGFiVmlldylcbiAgICBAaW5zZXJ0VGFiQXRJbmRleCh0YWJWaWV3LCBpbmRleClcbiAgICBpZiBhdG9tLmNvbmZpZy5nZXQoJ3RhYnMuYWRkTmV3VGFic0F0RW5kJylcbiAgICAgIEBwYW5lLm1vdmVJdGVtKGl0ZW0sIEBwYW5lLmdldEl0ZW1zKCkubGVuZ3RoIC0gMSkgdW5sZXNzIEBpc0l0ZW1Nb3ZpbmdCZXR3ZWVuUGFuZXNcblxuICBtb3ZlSXRlbVRhYlRvSW5kZXg6IChpdGVtLCBpbmRleCkgLT5cbiAgICB0YWJJbmRleCA9IEB0YWJzLmZpbmRJbmRleCgodCkgLT4gdC5pdGVtIGlzIGl0ZW0pXG4gICAgaWYgdGFiSW5kZXggaXNudCAtMVxuICAgICAgdGFiID0gQHRhYnNbdGFiSW5kZXhdXG4gICAgICB0YWIuZWxlbWVudC5yZW1vdmUoKVxuICAgICAgQHRhYnMuc3BsaWNlKHRhYkluZGV4LCAxKVxuICAgICAgQGluc2VydFRhYkF0SW5kZXgodGFiLCBpbmRleClcblxuICBpbnNlcnRUYWJBdEluZGV4OiAodGFiLCBpbmRleCkgLT5cbiAgICBmb2xsb3dpbmdUYWIgPSBAdGFic1tpbmRleF0gaWYgaW5kZXg/XG4gICAgaWYgZm9sbG93aW5nVGFiXG4gICAgICBAZWxlbWVudC5pbnNlcnRCZWZvcmUodGFiLmVsZW1lbnQsIGZvbGxvd2luZ1RhYi5lbGVtZW50KVxuICAgICAgQHRhYnMuc3BsaWNlKGluZGV4LCAwLCB0YWIpXG4gICAgZWxzZVxuICAgICAgQGVsZW1lbnQuYXBwZW5kQ2hpbGQodGFiLmVsZW1lbnQpXG4gICAgICBAdGFicy5wdXNoKHRhYilcblxuICAgIHRhYi51cGRhdGVUaXRsZSgpXG4gICAgQHVwZGF0ZVRhYkJhclZpc2liaWxpdHkoKVxuXG4gIHJlbW92ZVRhYkZvckl0ZW06IChpdGVtKSAtPlxuICAgIHRhYkluZGV4ID0gQHRhYnMuZmluZEluZGV4KCh0KSAtPiB0Lml0ZW0gaXMgaXRlbSlcbiAgICBpZiB0YWJJbmRleCBpc250IC0xXG4gICAgICB0YWIgPSBAdGFic1t0YWJJbmRleF1cbiAgICAgIEB0YWJzLnNwbGljZSh0YWJJbmRleCwgMSlcbiAgICAgIEB0YWJzQnlFbGVtZW50LmRlbGV0ZSh0YWIpXG4gICAgICB0YWIuZGVzdHJveSgpXG4gICAgdGFiLnVwZGF0ZVRpdGxlKCkgZm9yIHRhYiBpbiBAZ2V0VGFicygpXG4gICAgQHVwZGF0ZVRhYkJhclZpc2liaWxpdHkoKVxuXG4gIHVwZGF0ZVRhYkJhclZpc2liaWxpdHk6IC0+XG4gICAgaWYgbm90IGF0b20uY29uZmlnLmdldCgndGFicy5hbHdheXNTaG93VGFiQmFyJykgYW5kIG5vdCBAc2hvdWxkQWxsb3dEcmFnKClcbiAgICAgIEBlbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpXG4gICAgZWxzZVxuICAgICAgQGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJylcblxuICBnZXRUYWJzOiAtPlxuICAgIEB0YWJzLnNsaWNlKClcblxuICB0YWJBdEluZGV4OiAoaW5kZXgpIC0+XG4gICAgQHRhYnNbaW5kZXhdXG5cbiAgdGFiRm9ySXRlbTogKGl0ZW0pIC0+XG4gICAgQHRhYnMuZmluZCgodCkgLT4gdC5pdGVtIGlzIGl0ZW0pXG5cbiAgc2V0QWN0aXZlVGFiOiAodGFiVmlldykgLT5cbiAgICBpZiB0YWJWaWV3PyBhbmQgdGFiVmlldyBpc250IEBhY3RpdmVUYWJcbiAgICAgIEBhY3RpdmVUYWI/LmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcbiAgICAgIEBhY3RpdmVUYWIgPSB0YWJWaWV3XG4gICAgICBAYWN0aXZlVGFiLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJylcbiAgICAgIEBhY3RpdmVUYWIuZWxlbWVudC5zY3JvbGxJbnRvVmlldyhmYWxzZSlcblxuICBnZXRBY3RpdmVUYWI6IC0+XG4gICAgQHRhYkZvckl0ZW0oQHBhbmUuZ2V0QWN0aXZlSXRlbSgpKVxuXG4gIHVwZGF0ZUFjdGl2ZVRhYjogLT5cbiAgICBAc2V0QWN0aXZlVGFiKEB0YWJGb3JJdGVtKEBwYW5lLmdldEFjdGl2ZUl0ZW0oKSkpXG5cbiAgY2xvc2VUYWI6ICh0YWIpIC0+XG4gICAgdGFiID89IEByaWdodENsaWNrZWRUYWJcbiAgICBAcGFuZS5kZXN0cm95SXRlbSh0YWIuaXRlbSkgaWYgdGFiP1xuXG4gIG9wZW5Jbk5ld1dpbmRvdzogKHRhYikgLT5cbiAgICB0YWIgPz0gQHJpZ2h0Q2xpY2tlZFRhYlxuICAgIGl0ZW0gPSB0YWI/Lml0ZW1cbiAgICByZXR1cm4gdW5sZXNzIGl0ZW0/XG4gICAgaWYgdHlwZW9mIGl0ZW0uZ2V0VVJJIGlzICdmdW5jdGlvbidcbiAgICAgIGl0ZW1VUkkgPSBpdGVtLmdldFVSSSgpXG4gICAgZWxzZSBpZiB0eXBlb2YgaXRlbS5nZXRQYXRoIGlzICdmdW5jdGlvbidcbiAgICAgIGl0ZW1VUkkgPSBpdGVtLmdldFBhdGgoKVxuICAgIGVsc2UgaWYgdHlwZW9mIGl0ZW0uZ2V0VXJpIGlzICdmdW5jdGlvbidcbiAgICAgIGl0ZW1VUkkgPSBpdGVtLmdldFVyaSgpXG4gICAgcmV0dXJuIHVubGVzcyBpdGVtVVJJP1xuICAgIEBjbG9zZVRhYih0YWIpXG4gICAgcGF0aHNUb09wZW4gPSBbYXRvbS5wcm9qZWN0LmdldFBhdGhzKCksIGl0ZW1VUkldLnJlZHVjZSAoKGEsIGIpIC0+IGEuY29uY2F0KGIpKSwgW11cbiAgICBhdG9tLm9wZW4oe3BhdGhzVG9PcGVuOiBwYXRoc1RvT3BlbiwgbmV3V2luZG93OiB0cnVlLCBkZXZNb2RlOiBhdG9tLmRldk1vZGUsIHNhZmVNb2RlOiBhdG9tLnNhZmVNb2RlfSlcblxuICBzcGxpdFRhYjogKGZuKSAtPlxuICAgIGlmIGl0ZW0gPSBAcmlnaHRDbGlja2VkVGFiPy5pdGVtXG4gICAgICBpZiBjb3BpZWRJdGVtID0gQGNvcHlJdGVtKGl0ZW0pXG4gICAgICAgIEBwYW5lW2ZuXShpdGVtczogW2NvcGllZEl0ZW1dKVxuXG4gIGNvcHlJdGVtOiAoaXRlbSkgLT5cbiAgICBpdGVtLmNvcHk/KCkgPyBhdG9tLmRlc2VyaWFsaXplcnMuZGVzZXJpYWxpemUoaXRlbS5zZXJpYWxpemUoKSlcblxuICBjbG9zZU90aGVyVGFiczogKGFjdGl2ZSkgLT5cbiAgICB0YWJzID0gQGdldFRhYnMoKVxuICAgIGFjdGl2ZSA/PSBAcmlnaHRDbGlja2VkVGFiXG4gICAgcmV0dXJuIHVubGVzcyBhY3RpdmU/XG4gICAgQGNsb3NlVGFiIHRhYiBmb3IgdGFiIGluIHRhYnMgd2hlbiB0YWIgaXNudCBhY3RpdmVcblxuICBjbG9zZVRhYnNUb1JpZ2h0OiAoYWN0aXZlKSAtPlxuICAgIHRhYnMgPSBAZ2V0VGFicygpXG4gICAgYWN0aXZlID89IEByaWdodENsaWNrZWRUYWJcbiAgICBpbmRleCA9IHRhYnMuaW5kZXhPZihhY3RpdmUpXG4gICAgcmV0dXJuIGlmIGluZGV4IGlzIC0xXG4gICAgQGNsb3NlVGFiIHRhYiBmb3IgdGFiLCBpIGluIHRhYnMgd2hlbiBpID4gaW5kZXhcblxuICBjbG9zZVRhYnNUb0xlZnQ6IChhY3RpdmUpIC0+XG4gICAgdGFicyA9IEBnZXRUYWJzKClcbiAgICBhY3RpdmUgPz0gQHJpZ2h0Q2xpY2tlZFRhYlxuICAgIGluZGV4ID0gdGFicy5pbmRleE9mKGFjdGl2ZSlcbiAgICByZXR1cm4gaWYgaW5kZXggaXMgLTFcbiAgICBAY2xvc2VUYWIgdGFiIGZvciB0YWIsIGkgaW4gdGFicyB3aGVuIGkgPCBpbmRleFxuXG4gIGNsb3NlU2F2ZWRUYWJzOiAtPlxuICAgIGZvciB0YWIgaW4gQGdldFRhYnMoKVxuICAgICAgQGNsb3NlVGFiKHRhYikgdW5sZXNzIHRhYi5pdGVtLmlzTW9kaWZpZWQ/KClcblxuICBjbG9zZUFsbFRhYnM6IC0+XG4gICAgQGNsb3NlVGFiKHRhYikgZm9yIHRhYiBpbiBAZ2V0VGFicygpXG5cbiAgZ2V0V2luZG93SWQ6IC0+XG4gICAgQHdpbmRvd0lkID89IGF0b20uZ2V0Q3VycmVudFdpbmRvdygpLmlkXG5cbiAgc2hvdWxkQWxsb3dEcmFnOiAtPlxuICAgIChAcGFuZUNvbnRhaW5lci5nZXRQYW5lcygpLmxlbmd0aCA+IDEpIG9yIChAcGFuZS5nZXRJdGVtcygpLmxlbmd0aCA+IDEpXG5cbiAgb25EcmFnU3RhcnQ6IChldmVudCkgLT5cbiAgICBAZHJhZ2dlZFRhYiA9IEB0YWJGb3JFbGVtZW50KGV2ZW50LnRhcmdldClcbiAgICByZXR1cm4gdW5sZXNzIEBkcmFnZ2VkVGFiXG5cbiAgICBldmVudC5kYXRhVHJhbnNmZXIuc2V0RGF0YSAnYXRvbS1ldmVudCcsICd0cnVlJ1xuXG4gICAgQGRyYWdnZWRUYWIuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdpcy1kcmFnZ2luZycpXG4gICAgQGRyYWdnZWRUYWIuZGVzdHJveVRvb2x0aXAoKVxuXG4gICAgdGFiSW5kZXggPSBAdGFicy5pbmRleE9mKEBkcmFnZ2VkVGFiKVxuICAgIGV2ZW50LmRhdGFUcmFuc2Zlci5zZXREYXRhICdzb3J0YWJsZS1pbmRleCcsIHRhYkluZGV4XG5cbiAgICBwYW5lSW5kZXggPSBAcGFuZUNvbnRhaW5lci5nZXRQYW5lcygpLmluZGV4T2YoQHBhbmUpXG4gICAgZXZlbnQuZGF0YVRyYW5zZmVyLnNldERhdGEgJ2Zyb20tcGFuZS1pbmRleCcsIHBhbmVJbmRleFxuICAgIGV2ZW50LmRhdGFUcmFuc2Zlci5zZXREYXRhICdmcm9tLXBhbmUtaWQnLCBAcGFuZS5pZFxuICAgIGV2ZW50LmRhdGFUcmFuc2Zlci5zZXREYXRhICdmcm9tLXdpbmRvdy1pZCcsIEBnZXRXaW5kb3dJZCgpXG5cbiAgICBpdGVtID0gQHBhbmUuZ2V0SXRlbXMoKVtAdGFicy5pbmRleE9mKEBkcmFnZ2VkVGFiKV1cbiAgICByZXR1cm4gdW5sZXNzIGl0ZW0/XG5cbiAgICBpZiB0eXBlb2YgaXRlbS5nZXRVUkkgaXMgJ2Z1bmN0aW9uJ1xuICAgICAgaXRlbVVSSSA9IGl0ZW0uZ2V0VVJJKCkgPyAnJ1xuICAgIGVsc2UgaWYgdHlwZW9mIGl0ZW0uZ2V0UGF0aCBpcyAnZnVuY3Rpb24nXG4gICAgICBpdGVtVVJJID0gaXRlbS5nZXRQYXRoKCkgPyAnJ1xuICAgIGVsc2UgaWYgdHlwZW9mIGl0ZW0uZ2V0VXJpIGlzICdmdW5jdGlvbidcbiAgICAgIGl0ZW1VUkkgPSBpdGVtLmdldFVyaSgpID8gJydcblxuICAgIGlmIHR5cGVvZiBpdGVtLmdldEFsbG93ZWRMb2NhdGlvbnMgaXMgJ2Z1bmN0aW9uJ1xuICAgICAgZm9yIGxvY2F0aW9uIGluIGl0ZW0uZ2V0QWxsb3dlZExvY2F0aW9ucygpXG4gICAgICAgIGV2ZW50LmRhdGFUcmFuc2Zlci5zZXREYXRhKFwiYWxsb3dlZC1sb2NhdGlvbi0je2xvY2F0aW9ufVwiLCAndHJ1ZScpXG4gICAgZWxzZVxuICAgICAgZXZlbnQuZGF0YVRyYW5zZmVyLnNldERhdGEgJ2FsbG93LWFsbC1sb2NhdGlvbnMnLCAndHJ1ZSdcblxuICAgIGlmIGl0ZW1VUkk/XG4gICAgICBldmVudC5kYXRhVHJhbnNmZXIuc2V0RGF0YSAndGV4dC9wbGFpbicsIGl0ZW1VUklcblxuICAgICAgaWYgcHJvY2Vzcy5wbGF0Zm9ybSBpcyAnZGFyd2luJyAjIHNlZSAjNjlcbiAgICAgICAgaXRlbVVSSSA9IFwiZmlsZTovLyN7aXRlbVVSSX1cIiB1bmxlc3MgQHVyaUhhc1Byb3RvY29sKGl0ZW1VUkkpXG4gICAgICAgIGV2ZW50LmRhdGFUcmFuc2Zlci5zZXREYXRhICd0ZXh0L3VyaS1saXN0JywgaXRlbVVSSVxuXG4gICAgICBpZiBpdGVtLmlzTW9kaWZpZWQ/KCkgYW5kIGl0ZW0uZ2V0VGV4dD9cbiAgICAgICAgZXZlbnQuZGF0YVRyYW5zZmVyLnNldERhdGEgJ2hhcy11bnNhdmVkLWNoYW5nZXMnLCAndHJ1ZSdcbiAgICAgICAgZXZlbnQuZGF0YVRyYW5zZmVyLnNldERhdGEgJ21vZGlmaWVkLXRleHQnLCBpdGVtLmdldFRleHQoKVxuXG4gIHVyaUhhc1Byb3RvY29sOiAodXJpKSAtPlxuICAgIHRyeVxuICAgICAgcmVxdWlyZSgndXJsJykucGFyc2UodXJpKS5wcm90b2NvbD9cbiAgICBjYXRjaCBlcnJvclxuICAgICAgZmFsc2VcblxuICBvbkRyYWdMZWF2ZTogKGV2ZW50KSAtPlxuICAgIEByZW1vdmVQbGFjZWhvbGRlcigpXG5cbiAgb25EcmFnRW5kOiAoZXZlbnQpIC0+XG4gICAgcmV0dXJuIHVubGVzcyBAdGFiRm9yRWxlbWVudChldmVudC50YXJnZXQpXG5cbiAgICBAY2xlYXJEcm9wVGFyZ2V0KClcblxuICBvbkRyYWdPdmVyOiAoZXZlbnQpIC0+XG4gICAgdW5sZXNzIGlzQXRvbUV2ZW50KGV2ZW50KVxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgIHJldHVyblxuXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgIG5ld0Ryb3BUYXJnZXRJbmRleCA9IEBnZXREcm9wVGFyZ2V0SW5kZXgoZXZlbnQpXG4gICAgcmV0dXJuIHVubGVzcyBuZXdEcm9wVGFyZ2V0SW5kZXg/XG4gICAgcmV0dXJuIHVubGVzcyBpdGVtSXNBbGxvd2VkKGV2ZW50LCBAbG9jYXRpb24pXG5cbiAgICBAcmVtb3ZlRHJvcFRhcmdldENsYXNzZXMoKVxuXG4gICAgdGFicyA9IEBnZXRUYWJzKClcbiAgICBwbGFjZWhvbGRlciA9IEBnZXRQbGFjZWhvbGRlcigpXG4gICAgcmV0dXJuIHVubGVzcyBwbGFjZWhvbGRlcj9cblxuICAgIGlmIG5ld0Ryb3BUYXJnZXRJbmRleCA8IHRhYnMubGVuZ3RoXG4gICAgICB0YWIgPSB0YWJzW25ld0Ryb3BUYXJnZXRJbmRleF1cbiAgICAgIHRhYi5lbGVtZW50LmNsYXNzTGlzdC5hZGQgJ2lzLWRyb3AtdGFyZ2V0J1xuICAgICAgdGFiLmVsZW1lbnQucGFyZW50RWxlbWVudC5pbnNlcnRCZWZvcmUocGxhY2Vob2xkZXIsIHRhYi5lbGVtZW50KVxuICAgIGVsc2VcbiAgICAgIGlmIHRhYiA9IHRhYnNbbmV3RHJvcFRhcmdldEluZGV4IC0gMV1cbiAgICAgICAgdGFiLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCAnZHJvcC10YXJnZXQtaXMtYWZ0ZXInXG4gICAgICAgIGlmIHNpYmxpbmcgPSB0YWIuZWxlbWVudC5uZXh0U2libGluZ1xuICAgICAgICAgIHRhYi5lbGVtZW50LnBhcmVudEVsZW1lbnQuaW5zZXJ0QmVmb3JlKHBsYWNlaG9sZGVyLCBzaWJsaW5nKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgdGFiLmVsZW1lbnQucGFyZW50RWxlbWVudC5hcHBlbmRDaGlsZChwbGFjZWhvbGRlcilcblxuICBvbkRyb3BPbk90aGVyV2luZG93OiAoZnJvbVBhbmVJZCwgZnJvbUl0ZW1JbmRleCkgLT5cbiAgICBpZiBAcGFuZS5pZCBpcyBmcm9tUGFuZUlkXG4gICAgICBpZiBpdGVtVG9SZW1vdmUgPSBAcGFuZS5nZXRJdGVtcygpW2Zyb21JdGVtSW5kZXhdXG4gICAgICAgIEBwYW5lLmRlc3Ryb3lJdGVtKGl0ZW1Ub1JlbW92ZSlcblxuICAgIEBjbGVhckRyb3BUYXJnZXQoKVxuXG4gIGNsZWFyRHJvcFRhcmdldDogLT5cbiAgICBAZHJhZ2dlZFRhYj8uZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdpcy1kcmFnZ2luZycpXG4gICAgQGRyYWdnZWRUYWI/LnVwZGF0ZVRvb2x0aXAoKVxuICAgIEBkcmFnZ2VkVGFiID0gbnVsbFxuICAgIEByZW1vdmVEcm9wVGFyZ2V0Q2xhc3NlcygpXG4gICAgQHJlbW92ZVBsYWNlaG9sZGVyKClcblxuICBvbkRyb3A6IChldmVudCkgLT5cbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cbiAgICByZXR1cm4gdW5sZXNzIGV2ZW50LmRhdGFUcmFuc2Zlci5nZXREYXRhKCdhdG9tLWV2ZW50JykgaXMgJ3RydWUnXG5cbiAgICBmcm9tV2luZG93SWQgID0gcGFyc2VJbnQoZXZlbnQuZGF0YVRyYW5zZmVyLmdldERhdGEoJ2Zyb20td2luZG93LWlkJykpXG4gICAgZnJvbVBhbmVJZCAgICA9IHBhcnNlSW50KGV2ZW50LmRhdGFUcmFuc2Zlci5nZXREYXRhKCdmcm9tLXBhbmUtaWQnKSlcbiAgICBmcm9tSW5kZXggICAgID0gcGFyc2VJbnQoZXZlbnQuZGF0YVRyYW5zZmVyLmdldERhdGEoJ3NvcnRhYmxlLWluZGV4JykpXG4gICAgZnJvbVBhbmVJbmRleCA9IHBhcnNlSW50KGV2ZW50LmRhdGFUcmFuc2Zlci5nZXREYXRhKCdmcm9tLXBhbmUtaW5kZXgnKSlcblxuICAgIGhhc1Vuc2F2ZWRDaGFuZ2VzID0gZXZlbnQuZGF0YVRyYW5zZmVyLmdldERhdGEoJ2hhcy11bnNhdmVkLWNoYW5nZXMnKSBpcyAndHJ1ZSdcbiAgICBtb2RpZmllZFRleHQgPSBldmVudC5kYXRhVHJhbnNmZXIuZ2V0RGF0YSgnbW9kaWZpZWQtdGV4dCcpXG5cbiAgICB0b0luZGV4ID0gQGdldERyb3BUYXJnZXRJbmRleChldmVudClcbiAgICB0b1BhbmUgPSBAcGFuZVxuXG4gICAgQGNsZWFyRHJvcFRhcmdldCgpXG5cbiAgICByZXR1cm4gdW5sZXNzIGl0ZW1Jc0FsbG93ZWQoZXZlbnQsIEBsb2NhdGlvbilcblxuICAgIGlmIGZyb21XaW5kb3dJZCBpcyBAZ2V0V2luZG93SWQoKVxuICAgICAgZnJvbVBhbmUgPSBAcGFuZUNvbnRhaW5lci5nZXRQYW5lcygpW2Zyb21QYW5lSW5kZXhdXG4gICAgICBpZiBmcm9tUGFuZT8uaWQgaXNudCBmcm9tUGFuZUlkXG4gICAgICAgICMgSWYgZHJhZ2dpbmcgZnJvbSBhIGRpZmZlcmVudCBwYW5lIGNvbnRhaW5lciwgd2UgaGF2ZSB0byBiZSBtb3JlXG4gICAgICAgICMgZXhoYXVzdGl2ZSBpbiBvdXIgc2VhcmNoLlxuICAgICAgICBmcm9tUGFuZSA9IEFycmF5LmZyb20gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnYXRvbS1wYW5lJylcbiAgICAgICAgICAubWFwIChwYW5lRWwpIC0+IHBhbmVFbC5tb2RlbFxuICAgICAgICAgIC5maW5kIChwYW5lKSAtPiBwYW5lLmlkIGlzIGZyb21QYW5lSWRcbiAgICAgIGl0ZW0gPSBmcm9tUGFuZS5nZXRJdGVtcygpW2Zyb21JbmRleF1cbiAgICAgIEBtb3ZlSXRlbUJldHdlZW5QYW5lcyhmcm9tUGFuZSwgZnJvbUluZGV4LCB0b1BhbmUsIHRvSW5kZXgsIGl0ZW0pIGlmIGl0ZW0/XG4gICAgZWxzZVxuICAgICAgZHJvcHBlZFVSSSA9IGV2ZW50LmRhdGFUcmFuc2Zlci5nZXREYXRhKCd0ZXh0L3BsYWluJylcbiAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oZHJvcHBlZFVSSSkudGhlbiAoaXRlbSkgPT5cbiAgICAgICAgIyBNb3ZlIHRoZSBpdGVtIGZyb20gdGhlIHBhbmUgaXQgd2FzIG9wZW5lZCBvbiB0byB0aGUgdGFyZ2V0IHBhbmVcbiAgICAgICAgIyB3aGVyZSBpdCB3YXMgZHJvcHBlZCBvbnRvXG4gICAgICAgIGFjdGl2ZVBhbmUgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKClcbiAgICAgICAgYWN0aXZlSXRlbUluZGV4ID0gYWN0aXZlUGFuZS5nZXRJdGVtcygpLmluZGV4T2YoaXRlbSlcbiAgICAgICAgQG1vdmVJdGVtQmV0d2VlblBhbmVzKGFjdGl2ZVBhbmUsIGFjdGl2ZUl0ZW1JbmRleCwgdG9QYW5lLCB0b0luZGV4LCBpdGVtKVxuICAgICAgICBpdGVtLnNldFRleHQ/KG1vZGlmaWVkVGV4dCkgaWYgaGFzVW5zYXZlZENoYW5nZXNcblxuICAgICAgICBpZiBub3QgaXNOYU4oZnJvbVdpbmRvd0lkKVxuICAgICAgICAgICMgTGV0IHRoZSB3aW5kb3cgd2hlcmUgdGhlIGRyYWcgc3RhcnRlZCBrbm93IHRoYXQgdGhlIHRhYiB3YXMgZHJvcHBlZFxuICAgICAgICAgIGJyb3dzZXJXaW5kb3cgPSBAYnJvd3NlcldpbmRvd0ZvcklkKGZyb21XaW5kb3dJZClcbiAgICAgICAgICBicm93c2VyV2luZG93Py53ZWJDb250ZW50cy5zZW5kKCd0YWI6ZHJvcHBlZCcsIGZyb21QYW5lSWQsIGZyb21JbmRleClcblxuICAgICAgYXRvbS5mb2N1cygpXG5cbiAgb25Nb3VzZVdoZWVsOiAoZXZlbnQpIC0+XG4gICAgcmV0dXJuIGlmIGV2ZW50LnNoaWZ0S2V5XG5cbiAgICBAd2hlZWxEZWx0YSA/PSAwXG4gICAgQHdoZWVsRGVsdGEgKz0gZXZlbnQud2hlZWxEZWx0YVlcblxuICAgIGlmIEB3aGVlbERlbHRhIDw9IC1AdGFiU2Nyb2xsaW5nVGhyZXNob2xkXG4gICAgICBAd2hlZWxEZWx0YSA9IDBcbiAgICAgIEBwYW5lLmFjdGl2YXRlTmV4dEl0ZW0oKVxuICAgIGVsc2UgaWYgQHdoZWVsRGVsdGEgPj0gQHRhYlNjcm9sbGluZ1RocmVzaG9sZFxuICAgICAgQHdoZWVsRGVsdGEgPSAwXG4gICAgICBAcGFuZS5hY3RpdmF0ZVByZXZpb3VzSXRlbSgpXG5cbiAgb25Nb3VzZURvd246IChldmVudCkgLT5cbiAgICB0YWIgPSBAdGFiRm9yRWxlbWVudChldmVudC50YXJnZXQpXG4gICAgcmV0dXJuIHVubGVzcyB0YWJcblxuICAgIGlmIGV2ZW50LndoaWNoIGlzIDMgb3IgKGV2ZW50LndoaWNoIGlzIDEgYW5kIGV2ZW50LmN0cmxLZXkgaXMgdHJ1ZSlcbiAgICAgIEByaWdodENsaWNrZWRUYWI/LmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgncmlnaHQtY2xpY2tlZCcpXG4gICAgICBAcmlnaHRDbGlja2VkVGFiID0gdGFiXG4gICAgICBAcmlnaHRDbGlja2VkVGFiLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgncmlnaHQtY2xpY2tlZCcpXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgZWxzZSBpZiBldmVudC53aGljaCBpcyAxIGFuZCBub3QgZXZlbnQudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnY2xvc2UtaWNvbicpXG4gICAgICAjIERlbGF5IGFjdGlvbi4gVGhpcyBpcyBpbXBvcnRhbnQgYmVjYXVzZSB0aGUgYnJvd3NlciB3aWxsIHNldCB0aGUgZm9jdXNcbiAgICAgICMgYXMgcGFydCBvZiB0aGUgZGVmYXVsdCBhY3Rpb24gb2YgdGhlIG1vdXNlZG93biBldmVudDsgdGhlcmVmb3JlLCBhbnlcbiAgICAgICMgY2hhbmdlIHdlIG1ha2UgdG8gdGhlIGZvY3VzIGFzIHBhcnQgb2YgdGhlIGhhbmRsZXIgd291bGQgYmUgb3ZlcndyaXR0ZW4uXG4gICAgICAjIFdlIGNvdWxkIHVzZSBgcHJldmVudERlZmF1bHQoKWAgdG8gYWRkcmVzcyB0aGlzLCBidXQgdGhhdCB3b3VsZCBhbHNvXG4gICAgICAjIG1ha2UgdGhlIHRhYiB1bmRyYWdnYWJsZS5cbiAgICAgIHNldEltbWVkaWF0ZSA9PlxuICAgICAgICBAcGFuZS5hY3RpdmF0ZUl0ZW0odGFiLml0ZW0pXG4gICAgICAgIEBwYW5lLmFjdGl2YXRlKCkgdW5sZXNzIEBwYW5lLmlzRGVzdHJveWVkKClcbiAgICBlbHNlIGlmIGV2ZW50LndoaWNoIGlzIDJcbiAgICAgIEBwYW5lLmRlc3Ryb3lJdGVtKHRhYi5pdGVtKVxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuXG4gIG9uRG91YmxlQ2xpY2s6IChldmVudCkgLT5cbiAgICBpZiB0YWIgPSBAdGFiRm9yRWxlbWVudChldmVudC50YXJnZXQpXG4gICAgICB0YWIuaXRlbS50ZXJtaW5hdGVQZW5kaW5nU3RhdGU/KClcbiAgICBlbHNlIGlmIGV2ZW50LnRhcmdldCBpcyBAZWxlbWVudFxuICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaChAZWxlbWVudCwgJ2FwcGxpY2F0aW9uOm5ldy1maWxlJylcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcblxuICB1cGRhdGVUYWJTY3JvbGxpbmdUaHJlc2hvbGQ6IC0+XG4gICAgQHRhYlNjcm9sbGluZ1RocmVzaG9sZCA9IGF0b20uY29uZmlnLmdldCgndGFicy50YWJTY3JvbGxpbmdUaHJlc2hvbGQnKVxuXG4gIHVwZGF0ZVRhYlNjcm9sbGluZzogKHZhbHVlKSAtPlxuICAgIGlmIHZhbHVlIGlzICdwbGF0Zm9ybSdcbiAgICAgIEB0YWJTY3JvbGxpbmcgPSAocHJvY2Vzcy5wbGF0Zm9ybSBpcyAnbGludXgnKVxuICAgIGVsc2VcbiAgICAgIEB0YWJTY3JvbGxpbmcgPSB2YWx1ZVxuICAgIEB0YWJTY3JvbGxpbmdUaHJlc2hvbGQgPSBhdG9tLmNvbmZpZy5nZXQoJ3RhYnMudGFiU2Nyb2xsaW5nVGhyZXNob2xkJylcblxuICAgIGlmIEB0YWJTY3JvbGxpbmdcbiAgICAgIEBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIgJ21vdXNld2hlZWwnLCBAb25Nb3VzZVdoZWVsLmJpbmQodGhpcylcbiAgICBlbHNlXG4gICAgICBAZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyICdtb3VzZXdoZWVsJywgQG9uTW91c2VXaGVlbC5iaW5kKHRoaXMpXG5cbiAgYnJvd3NlcldpbmRvd0ZvcklkOiAoaWQpIC0+XG4gICAgQnJvd3NlcldpbmRvdyA/PSByZXF1aXJlKCdlbGVjdHJvbicpLnJlbW90ZS5Ccm93c2VyV2luZG93XG5cbiAgICBCcm93c2VyV2luZG93LmZyb21JZCBpZFxuXG4gIG1vdmVJdGVtQmV0d2VlblBhbmVzOiAoZnJvbVBhbmUsIGZyb21JbmRleCwgdG9QYW5lLCB0b0luZGV4LCBpdGVtKSAtPlxuICAgIHRyeVxuICAgICAgaWYgdG9QYW5lIGlzIGZyb21QYW5lXG4gICAgICAgIHRvSW5kZXgtLSBpZiBmcm9tSW5kZXggPCB0b0luZGV4XG4gICAgICAgIHRvUGFuZS5tb3ZlSXRlbShpdGVtLCB0b0luZGV4KVxuICAgICAgZWxzZVxuICAgICAgICBAaXNJdGVtTW92aW5nQmV0d2VlblBhbmVzID0gdHJ1ZVxuICAgICAgICBmcm9tUGFuZS5tb3ZlSXRlbVRvUGFuZShpdGVtLCB0b1BhbmUsIHRvSW5kZXgtLSlcbiAgICAgIHRvUGFuZS5hY3RpdmF0ZUl0ZW0oaXRlbSlcbiAgICAgIHRvUGFuZS5hY3RpdmF0ZSgpXG4gICAgZmluYWxseVxuICAgICAgQGlzSXRlbU1vdmluZ0JldHdlZW5QYW5lcyA9IGZhbHNlXG5cbiAgcmVtb3ZlRHJvcFRhcmdldENsYXNzZXM6IC0+XG4gICAgd29ya3NwYWNlRWxlbWVudCA9IGF0b20udmlld3MuZ2V0VmlldyhhdG9tLndvcmtzcGFjZSlcbiAgICBmb3IgZHJvcFRhcmdldCBpbiB3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWItYmFyIC5pcy1kcm9wLXRhcmdldCcpXG4gICAgICBkcm9wVGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoJ2lzLWRyb3AtdGFyZ2V0JylcblxuICAgIGZvciBkcm9wVGFyZ2V0IGluIHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRhYi1iYXIgLmRyb3AtdGFyZ2V0LWlzLWFmdGVyJylcbiAgICAgIGRyb3BUYXJnZXQuY2xhc3NMaXN0LnJlbW92ZSgnZHJvcC10YXJnZXQtaXMtYWZ0ZXInKVxuXG4gIGdldERyb3BUYXJnZXRJbmRleDogKGV2ZW50KSAtPlxuICAgIHRhcmdldCA9IGV2ZW50LnRhcmdldFxuXG4gICAgcmV0dXJuIGlmIEBpc1BsYWNlaG9sZGVyKHRhcmdldClcblxuICAgIHRhYnMgPSBAZ2V0VGFicygpXG4gICAgdGFiID0gQHRhYkZvckVsZW1lbnQodGFyZ2V0KVxuICAgIHRhYiA/PSB0YWJzW3RhYnMubGVuZ3RoIC0gMV1cblxuICAgIHJldHVybiAwIHVubGVzcyB0YWI/XG5cbiAgICB7bGVmdCwgd2lkdGh9ID0gdGFiLmVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICBlbGVtZW50Q2VudGVyID0gbGVmdCArIHdpZHRoIC8gMlxuICAgIGVsZW1lbnRJbmRleCA9IHRhYnMuaW5kZXhPZih0YWIpXG5cbiAgICBpZiBldmVudC5wYWdlWCA8IGVsZW1lbnRDZW50ZXJcbiAgICAgIGVsZW1lbnRJbmRleFxuICAgIGVsc2VcbiAgICAgIGVsZW1lbnRJbmRleCArIDFcblxuICBnZXRQbGFjZWhvbGRlcjogLT5cbiAgICByZXR1cm4gQHBsYWNlaG9sZGVyRWwgaWYgQHBsYWNlaG9sZGVyRWw/XG5cbiAgICBAcGxhY2Vob2xkZXJFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaVwiKVxuICAgIEBwbGFjZWhvbGRlckVsLmNsYXNzTGlzdC5hZGQoXCJwbGFjZWhvbGRlclwiKVxuICAgIEBwbGFjZWhvbGRlckVsXG5cbiAgcmVtb3ZlUGxhY2Vob2xkZXI6IC0+XG4gICAgQHBsYWNlaG9sZGVyRWw/LnJlbW92ZSgpXG4gICAgQHBsYWNlaG9sZGVyRWwgPSBudWxsXG5cbiAgaXNQbGFjZWhvbGRlcjogKGVsZW1lbnQpIC0+XG4gICAgZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ3BsYWNlaG9sZGVyJylcblxuICBvbk1vdXNlRW50ZXI6IC0+XG4gICAgZm9yIHRhYiBpbiBAZ2V0VGFicygpXG4gICAgICB7d2lkdGh9ID0gdGFiLmVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICAgIHRhYi5lbGVtZW50LnN0eWxlLm1heFdpZHRoID0gd2lkdGgudG9GaXhlZCgyKSArICdweCdcbiAgICByZXR1cm5cblxuICBvbk1vdXNlTGVhdmU6IC0+XG4gICAgdGFiLmVsZW1lbnQuc3R5bGUubWF4V2lkdGggPSAnJyBmb3IgdGFiIGluIEBnZXRUYWJzKClcbiAgICByZXR1cm5cblxuICB0YWJGb3JFbGVtZW50OiAoZWxlbWVudCkgLT5cbiAgICBjdXJyZW50RWxlbWVudCA9IGVsZW1lbnRcbiAgICB3aGlsZSBjdXJyZW50RWxlbWVudD9cbiAgICAgIGlmIHRhYiA9IEB0YWJzQnlFbGVtZW50LmdldChjdXJyZW50RWxlbWVudClcbiAgICAgICAgcmV0dXJuIHRhYlxuICAgICAgZWxzZVxuICAgICAgICBjdXJyZW50RWxlbWVudCA9IGN1cnJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnRcblxuaXNBdG9tRXZlbnQgPSAoZXZlbnQpIC0+XG4gIGZvciBpdGVtIGluIGV2ZW50LmRhdGFUcmFuc2Zlci5pdGVtc1xuICAgIGlmIGl0ZW0udHlwZSBpcyAnYXRvbS1ldmVudCdcbiAgICAgIHJldHVybiB0cnVlXG5cbiAgcmV0dXJuIGZhbHNlXG5cbml0ZW1Jc0FsbG93ZWQgPSAoZXZlbnQsIGxvY2F0aW9uKSAtPlxuICBmb3IgaXRlbSBpbiBldmVudC5kYXRhVHJhbnNmZXIuaXRlbXNcbiAgICBpZiBpdGVtLnR5cGUgaXMgJ2FsbG93LWFsbC1sb2NhdGlvbnMnIG9yIGl0ZW0udHlwZSBpcyBcImFsbG93ZWQtbG9jYXRpb24tI3tsb2NhdGlvbn1cIlxuICAgICAgcmV0dXJuIHRydWVcblxuICByZXR1cm4gZmFsc2VcbiJdfQ==
