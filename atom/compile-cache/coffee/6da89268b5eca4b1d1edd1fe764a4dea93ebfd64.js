(function() {
  var BrowserWindow, CompositeDisposable, TabBarView, TabView, _, ipcRenderer, itemIsAllowed;

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
      var item, itemURI, paneIndex, ref, ref1, ref2, tabIndex;
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
        event.dataTransfer.setData('allowed-locations', item.getAllowedLocations().join('|'));
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
      if (!this.isAtomEvent(event)) {
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
        this.pane.activateItem(tab.item);
        return setImmediate((function(_this) {
          return function() {
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

    TabBarView.prototype.isAtomEvent = function(event) {
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

    return TabBarView;

  })();

  itemIsAllowed = function(event, location) {
    var allowedLocations;
    allowedLocations = (event.dataTransfer.getData('allowed-locations') || '').trim();
    return !allowedLocations || allowedLocations.split('|').includes(location);
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RhYnMvbGliL3RhYi1iYXItdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLGFBQUEsR0FBZ0I7O0VBQ2YsY0FBZSxPQUFBLENBQVEsVUFBUjs7RUFFZixzQkFBdUIsT0FBQSxDQUFRLE1BQVI7O0VBQ3hCLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVI7O0VBQ0osT0FBQSxHQUFVLE9BQUEsQ0FBUSxZQUFSOztFQUVWLE1BQU0sQ0FBQyxPQUFQLEdBQ007SUFDUyxvQkFBQyxLQUFELEVBQVEsU0FBUjtBQUNYLFVBQUE7TUFEWSxJQUFDLENBQUEsT0FBRDtNQUFPLElBQUMsQ0FBQSxXQUFEO01BQ25CLElBQUMsQ0FBQSxPQUFELEdBQVcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsSUFBdkI7TUFDWCxJQUFDLENBQUEsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFuQixDQUF1QixhQUF2QjtNQUNBLElBQUMsQ0FBQSxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQW5CLENBQXVCLFNBQXZCO01BQ0EsSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBbkIsQ0FBdUIsYUFBdkI7TUFDQSxJQUFDLENBQUEsT0FBTyxDQUFDLFlBQVQsQ0FBc0IsSUFBdEIsRUFBNEIsV0FBNUI7TUFDQSxJQUFDLENBQUEsT0FBTyxDQUFDLFlBQVQsQ0FBc0IsVUFBdEIsRUFBa0MsQ0FBQyxDQUFuQztNQUVBLElBQUMsQ0FBQSxJQUFELEdBQVE7TUFDUixJQUFDLENBQUEsYUFBRCxHQUFpQixJQUFJO01BQ3JCLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUk7TUFFckIsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBQyxD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TyxJQURUO1NBQUEsTUFBQTtVQUdFLGNBQUEsR0FBaUIsY0FBYyxDQUFDLGNBSGxDOztNQURGO0lBRmE7O3lCQVFmLFdBQUEsR0FBYSxTQUFDLEtBQUQ7QUFDWCxVQUFBO0FBQUE7QUFBQSxXQUFBLHFDQUFBOztRQUNFLElBQUcsSUFBSSxDQUFDLElBQUwsS0FBYSxZQUFoQjtBQUNFLGlCQUFPLEtBRFQ7O0FBREY7QUFJQSxhQUFPO0lBTEk7Ozs7OztFQU9mLGFBQUEsR0FBZ0IsU0FBQyxLQUFELEVBQVEsUUFBUjtBQUNkLFFBQUE7SUFBQSxnQkFBQSxHQUFtQixDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsT0FBbkIsQ0FBMkIsbUJBQTNCLENBQUEsSUFBbUQsRUFBcEQsQ0FBdUQsQ0FBQyxJQUF4RCxDQUFBO1dBQ25CLENBQUksZ0JBQUosSUFBd0IsZ0JBQWdCLENBQUMsS0FBakIsQ0FBdUIsR0FBdkIsQ0FBMkIsQ0FBQyxRQUE1QixDQUFxQyxRQUFyQztFQUZWO0FBcGdCaEIiLCJzb3VyY2VzQ29udGVudCI6WyJCcm93c2VyV2luZG93ID0gbnVsbCAjIERlZmVyIHJlcXVpcmUgdW50aWwgYWN0dWFsbHkgdXNlZFxue2lwY1JlbmRlcmVyfSA9IHJlcXVpcmUgJ2VsZWN0cm9uJ1xuXG57Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xuXyA9IHJlcXVpcmUgJ3VuZGVyc2NvcmUtcGx1cydcblRhYlZpZXcgPSByZXF1aXJlICcuL3RhYi12aWV3J1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBUYWJCYXJWaWV3XG4gIGNvbnN0cnVjdG9yOiAoQHBhbmUsIEBsb2NhdGlvbikgLT5cbiAgICBAZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3VsJylcbiAgICBAZWxlbWVudC5jbGFzc0xpc3QuYWRkKFwibGlzdC1pbmxpbmVcIilcbiAgICBAZWxlbWVudC5jbGFzc0xpc3QuYWRkKFwidGFiLWJhclwiKVxuICAgIEBlbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJpbnNldC1wYW5lbFwiKVxuICAgIEBlbGVtZW50LnNldEF0dHJpYnV0ZSgnaXMnLCAnYXRvbS10YWJzJylcbiAgICBAZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJ0YWJpbmRleFwiLCAtMSlcblxuICAgIEB0YWJzID0gW11cbiAgICBAdGFic0J5RWxlbWVudCA9IG5ldyBXZWFrTWFwXG4gICAgQHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkIGF0b20udmlld3MuZ2V0VmlldyhAcGFuZSksXG4gICAgICAndGFiczprZWVwLXBlbmRpbmctdGFiJzogPT4gQHRlcm1pbmF0ZVBlbmRpbmdTdGF0ZXMoKVxuICAgICAgJ3RhYnM6Y2xvc2UtdGFiJzogPT4gQGNsb3NlVGFiKEBnZXRBY3RpdmVUYWIoKSlcbiAgICAgICd0YWJzOmNsb3NlLW90aGVyLXRhYnMnOiA9PiBAY2xvc2VPdGhlclRhYnMoQGdldEFjdGl2ZVRhYigpKVxuICAgICAgJ3RhYnM6Y2xvc2UtdGFicy10by1yaWdodCc6ID0+IEBjbG9zZVRhYnNUb1JpZ2h0KEBnZXRBY3RpdmVUYWIoKSlcbiAgICAgICd0YWJzOmNsb3NlLXRhYnMtdG8tbGVmdCc6ID0+IEBjbG9zZVRhYnNUb0xlZnQoQGdldEFjdGl2ZVRhYigpKVxuICAgICAgJ3RhYnM6Y2xvc2Utc2F2ZWQtdGFicyc6ID0+IEBjbG9zZVNhdmVkVGFicygpXG4gICAgICAndGFiczpjbG9zZS1hbGwtdGFicyc6IChldmVudCkgPT5cbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgQGNsb3NlQWxsVGFicygpXG4gICAgICAndGFiczpvcGVuLWluLW5ldy13aW5kb3cnOiA9PiBAb3BlbkluTmV3V2luZG93KClcblxuICAgIGFkZEVsZW1lbnRDb21tYW5kcyA9IChjb21tYW5kcykgPT5cbiAgICAgIGNvbW1hbmRzV2l0aFByb3BhZ2F0aW9uU3RvcHBlZCA9IHt9XG4gICAgICBPYmplY3Qua2V5cyhjb21tYW5kcykuZm9yRWFjaCAobmFtZSkgLT5cbiAgICAgICAgY29tbWFuZHNXaXRoUHJvcGFnYXRpb25TdG9wcGVkW25hbWVdID0gKGV2ZW50KSAtPlxuICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgICAgY29tbWFuZHNbbmFtZV0oKVxuXG4gICAgICBAc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb21tYW5kcy5hZGQoQGVsZW1lbnQsIGNvbW1hbmRzV2l0aFByb3BhZ2F0aW9uU3RvcHBlZCkpXG5cbiAgICBhZGRFbGVtZW50Q29tbWFuZHNcbiAgICAgICd0YWJzOmNsb3NlLXRhYic6ID0+IEBjbG9zZVRhYigpXG4gICAgICAndGFiczpjbG9zZS1vdGhlci10YWJzJzogPT4gQGNsb3NlT3RoZXJUYWJzKClcbiAgICAgICd0YWJzOmNsb3NlLXRhYnMtdG8tcmlnaHQnOiA9PiBAY2xvc2VUYWJzVG9SaWdodCgpXG4gICAgICAndGFiczpjbG9zZS10YWJzLXRvLWxlZnQnOiA9PiBAY2xvc2VUYWJzVG9MZWZ0KClcbiAgICAgICd0YWJzOmNsb3NlLXNhdmVkLXRhYnMnOiA9PiBAY2xvc2VTYXZlZFRhYnMoKVxuICAgICAgJ3RhYnM6Y2xvc2UtYWxsLXRhYnMnOiA9PiBAY2xvc2VBbGxUYWJzKClcbiAgICAgICd0YWJzOnNwbGl0LXVwJzogPT4gQHNwbGl0VGFiKCdzcGxpdFVwJylcbiAgICAgICd0YWJzOnNwbGl0LWRvd24nOiA9PiBAc3BsaXRUYWIoJ3NwbGl0RG93bicpXG4gICAgICAndGFiczpzcGxpdC1sZWZ0JzogPT4gQHNwbGl0VGFiKCdzcGxpdExlZnQnKVxuICAgICAgJ3RhYnM6c3BsaXQtcmlnaHQnOiA9PiBAc3BsaXRUYWIoJ3NwbGl0UmlnaHQnKVxuXG4gICAgQGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lciBcIm1vdXNlZW50ZXJcIiwgQG9uTW91c2VFbnRlci5iaW5kKHRoaXMpXG4gICAgQGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lciBcIm1vdXNlbGVhdmVcIiwgQG9uTW91c2VMZWF2ZS5iaW5kKHRoaXMpXG4gICAgQGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lciBcImRyYWdzdGFydFwiLCBAb25EcmFnU3RhcnQuYmluZCh0aGlzKVxuICAgIEBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIgXCJkcmFnZW5kXCIsIEBvbkRyYWdFbmQuYmluZCh0aGlzKVxuICAgIEBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIgXCJkcmFnbGVhdmVcIiwgQG9uRHJhZ0xlYXZlLmJpbmQodGhpcylcbiAgICBAZWxlbWVudC5hZGRFdmVudExpc3RlbmVyIFwiZHJhZ292ZXJcIiwgQG9uRHJhZ092ZXIuYmluZCh0aGlzKVxuICAgIEBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIgXCJkcm9wXCIsIEBvbkRyb3AuYmluZCh0aGlzKVxuXG4gICAgQHBhbmVDb250YWluZXIgPSBAcGFuZS5nZXRDb250YWluZXIoKVxuICAgIEBhZGRUYWJGb3JJdGVtKGl0ZW0pIGZvciBpdGVtIGluIEBwYW5lLmdldEl0ZW1zKClcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBAcGFuZS5vbkRpZERlc3Ryb3kgPT5cbiAgICAgIEBkZXN0cm95KClcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBAcGFuZS5vbkRpZEFkZEl0ZW0gKHtpdGVtLCBpbmRleH0pID0+XG4gICAgICBAYWRkVGFiRm9ySXRlbShpdGVtLCBpbmRleClcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBAcGFuZS5vbkRpZE1vdmVJdGVtICh7aXRlbSwgbmV3SW5kZXh9KSA9PlxuICAgICAgQG1vdmVJdGVtVGFiVG9JbmRleChpdGVtLCBuZXdJbmRleClcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBAcGFuZS5vbkRpZFJlbW92ZUl0ZW0gKHtpdGVtfSkgPT5cbiAgICAgIEByZW1vdmVUYWJGb3JJdGVtKGl0ZW0pXG5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgQHBhbmUub25EaWRDaGFuZ2VBY3RpdmVJdGVtIChpdGVtKSA9PlxuICAgICAgQHVwZGF0ZUFjdGl2ZVRhYigpXG5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb25maWcub2JzZXJ2ZSAndGFicy50YWJTY3JvbGxpbmcnLCBAdXBkYXRlVGFiU2Nyb2xsaW5nLmJpbmQodGhpcylcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb25maWcub2JzZXJ2ZSAndGFicy50YWJTY3JvbGxpbmdUaHJlc2hvbGQnLCA9PiBAdXBkYXRlVGFiU2Nyb2xsaW5nVGhyZXNob2xkKClcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb25maWcub2JzZXJ2ZSAndGFicy5hbHdheXNTaG93VGFiQmFyJywgPT4gQHVwZGF0ZVRhYkJhclZpc2liaWxpdHkoKVxuXG4gICAgQHVwZGF0ZUFjdGl2ZVRhYigpXG5cbiAgICBAZWxlbWVudC5hZGRFdmVudExpc3RlbmVyIFwibW91c2Vkb3duXCIsIEBvbk1vdXNlRG93bi5iaW5kKHRoaXMpXG4gICAgQGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lciBcImRibGNsaWNrXCIsIEBvbkRvdWJsZUNsaWNrLmJpbmQodGhpcylcblxuICAgIEBvbkRyb3BPbk90aGVyV2luZG93ID0gQG9uRHJvcE9uT3RoZXJXaW5kb3cuYmluZCh0aGlzKVxuICAgIGlwY1JlbmRlcmVyLm9uKCd0YWI6ZHJvcHBlZCcsIEBvbkRyb3BPbk90aGVyV2luZG93KVxuXG4gIGRlc3Ryb3k6IC0+XG4gICAgaXBjUmVuZGVyZXIucmVtb3ZlTGlzdGVuZXIoJ3RhYjpkcm9wcGVkJywgQG9uRHJvcE9uT3RoZXJXaW5kb3cpXG4gICAgQHN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgQGVsZW1lbnQucmVtb3ZlKClcblxuICB0ZXJtaW5hdGVQZW5kaW5nU3RhdGVzOiAtPlxuICAgIHRhYi50ZXJtaW5hdGVQZW5kaW5nU3RhdGU/KCkgZm9yIHRhYiBpbiBAZ2V0VGFicygpXG4gICAgcmV0dXJuXG5cbiAgYWRkVGFiRm9ySXRlbTogKGl0ZW0sIGluZGV4KSAtPlxuICAgIHRhYlZpZXcgPSBuZXcgVGFiVmlldyh7XG4gICAgICBpdGVtLFxuICAgICAgQHBhbmUsXG4gICAgICBAdGFicyxcbiAgICAgIGRpZENsaWNrQ2xvc2VJY29uOiA9PlxuICAgICAgICBAY2xvc2VUYWIodGFiVmlldylcbiAgICAgICAgcmV0dXJuXG4gICAgICBAbG9jYXRpb25cbiAgICB9KVxuICAgIHRhYlZpZXcudGVybWluYXRlUGVuZGluZ1N0YXRlKCkgaWYgQGlzSXRlbU1vdmluZ0JldHdlZW5QYW5lc1xuICAgIEB0YWJzQnlFbGVtZW50LnNldCh0YWJWaWV3LmVsZW1lbnQsIHRhYlZpZXcpXG4gICAgQGluc2VydFRhYkF0SW5kZXgodGFiVmlldywgaW5kZXgpXG4gICAgaWYgYXRvbS5jb25maWcuZ2V0KCd0YWJzLmFkZE5ld1RhYnNBdEVuZCcpXG4gICAgICBAcGFuZS5tb3ZlSXRlbShpdGVtLCBAcGFuZS5nZXRJdGVtcygpLmxlbmd0aCAtIDEpIHVubGVzcyBAaXNJdGVtTW92aW5nQmV0d2VlblBhbmVzXG5cbiAgbW92ZUl0ZW1UYWJUb0luZGV4OiAoaXRlbSwgaW5kZXgpIC0+XG4gICAgdGFiSW5kZXggPSBAdGFicy5maW5kSW5kZXgoKHQpIC0+IHQuaXRlbSBpcyBpdGVtKVxuICAgIGlmIHRhYkluZGV4IGlzbnQgLTFcbiAgICAgIHRhYiA9IEB0YWJzW3RhYkluZGV4XVxuICAgICAgdGFiLmVsZW1lbnQucmVtb3ZlKClcbiAgICAgIEB0YWJzLnNwbGljZSh0YWJJbmRleCwgMSlcbiAgICAgIEBpbnNlcnRUYWJBdEluZGV4KHRhYiwgaW5kZXgpXG5cbiAgaW5zZXJ0VGFiQXRJbmRleDogKHRhYiwgaW5kZXgpIC0+XG4gICAgZm9sbG93aW5nVGFiID0gQHRhYnNbaW5kZXhdIGlmIGluZGV4P1xuICAgIGlmIGZvbGxvd2luZ1RhYlxuICAgICAgQGVsZW1lbnQuaW5zZXJ0QmVmb3JlKHRhYi5lbGVtZW50LCBmb2xsb3dpbmdUYWIuZWxlbWVudClcbiAgICAgIEB0YWJzLnNwbGljZShpbmRleCwgMCwgdGFiKVxuICAgIGVsc2VcbiAgICAgIEBlbGVtZW50LmFwcGVuZENoaWxkKHRhYi5lbGVtZW50KVxuICAgICAgQHRhYnMucHVzaCh0YWIpXG5cbiAgICB0YWIudXBkYXRlVGl0bGUoKVxuICAgIEB1cGRhdGVUYWJCYXJWaXNpYmlsaXR5KClcblxuICByZW1vdmVUYWJGb3JJdGVtOiAoaXRlbSkgLT5cbiAgICB0YWJJbmRleCA9IEB0YWJzLmZpbmRJbmRleCgodCkgLT4gdC5pdGVtIGlzIGl0ZW0pXG4gICAgaWYgdGFiSW5kZXggaXNudCAtMVxuICAgICAgdGFiID0gQHRhYnNbdGFiSW5kZXhdXG4gICAgICBAdGFicy5zcGxpY2UodGFiSW5kZXgsIDEpXG4gICAgICBAdGFic0J5RWxlbWVudC5kZWxldGUodGFiKVxuICAgICAgdGFiLmRlc3Ryb3koKVxuICAgIHRhYi51cGRhdGVUaXRsZSgpIGZvciB0YWIgaW4gQGdldFRhYnMoKVxuICAgIEB1cGRhdGVUYWJCYXJWaXNpYmlsaXR5KClcblxuICB1cGRhdGVUYWJCYXJWaXNpYmlsaXR5OiAtPlxuICAgIGlmIG5vdCBhdG9tLmNvbmZpZy5nZXQoJ3RhYnMuYWx3YXlzU2hvd1RhYkJhcicpIGFuZCBub3QgQHNob3VsZEFsbG93RHJhZygpXG4gICAgICBAZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKVxuICAgIGVsc2VcbiAgICAgIEBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpXG5cbiAgZ2V0VGFiczogLT5cbiAgICBAdGFicy5zbGljZSgpXG5cbiAgdGFiQXRJbmRleDogKGluZGV4KSAtPlxuICAgIEB0YWJzW2luZGV4XVxuXG4gIHRhYkZvckl0ZW06IChpdGVtKSAtPlxuICAgIEB0YWJzLmZpbmQoKHQpIC0+IHQuaXRlbSBpcyBpdGVtKVxuXG4gIHNldEFjdGl2ZVRhYjogKHRhYlZpZXcpIC0+XG4gICAgaWYgdGFiVmlldz8gYW5kIHRhYlZpZXcgaXNudCBAYWN0aXZlVGFiXG4gICAgICBAYWN0aXZlVGFiPy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG4gICAgICBAYWN0aXZlVGFiID0gdGFiVmlld1xuICAgICAgQGFjdGl2ZVRhYi5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXG4gICAgICBAYWN0aXZlVGFiLmVsZW1lbnQuc2Nyb2xsSW50b1ZpZXcoZmFsc2UpXG5cbiAgZ2V0QWN0aXZlVGFiOiAtPlxuICAgIEB0YWJGb3JJdGVtKEBwYW5lLmdldEFjdGl2ZUl0ZW0oKSlcblxuICB1cGRhdGVBY3RpdmVUYWI6IC0+XG4gICAgQHNldEFjdGl2ZVRhYihAdGFiRm9ySXRlbShAcGFuZS5nZXRBY3RpdmVJdGVtKCkpKVxuXG4gIGNsb3NlVGFiOiAodGFiKSAtPlxuICAgIHRhYiA/PSBAcmlnaHRDbGlja2VkVGFiXG4gICAgQHBhbmUuZGVzdHJveUl0ZW0odGFiLml0ZW0pIGlmIHRhYj9cblxuICBvcGVuSW5OZXdXaW5kb3c6ICh0YWIpIC0+XG4gICAgdGFiID89IEByaWdodENsaWNrZWRUYWJcbiAgICBpdGVtID0gdGFiPy5pdGVtXG4gICAgcmV0dXJuIHVubGVzcyBpdGVtP1xuICAgIGlmIHR5cGVvZiBpdGVtLmdldFVSSSBpcyAnZnVuY3Rpb24nXG4gICAgICBpdGVtVVJJID0gaXRlbS5nZXRVUkkoKVxuICAgIGVsc2UgaWYgdHlwZW9mIGl0ZW0uZ2V0UGF0aCBpcyAnZnVuY3Rpb24nXG4gICAgICBpdGVtVVJJID0gaXRlbS5nZXRQYXRoKClcbiAgICBlbHNlIGlmIHR5cGVvZiBpdGVtLmdldFVyaSBpcyAnZnVuY3Rpb24nXG4gICAgICBpdGVtVVJJID0gaXRlbS5nZXRVcmkoKVxuICAgIHJldHVybiB1bmxlc3MgaXRlbVVSST9cbiAgICBAY2xvc2VUYWIodGFiKVxuICAgIHBhdGhzVG9PcGVuID0gW2F0b20ucHJvamVjdC5nZXRQYXRocygpLCBpdGVtVVJJXS5yZWR1Y2UgKChhLCBiKSAtPiBhLmNvbmNhdChiKSksIFtdXG4gICAgYXRvbS5vcGVuKHtwYXRoc1RvT3BlbjogcGF0aHNUb09wZW4sIG5ld1dpbmRvdzogdHJ1ZSwgZGV2TW9kZTogYXRvbS5kZXZNb2RlLCBzYWZlTW9kZTogYXRvbS5zYWZlTW9kZX0pXG5cbiAgc3BsaXRUYWI6IChmbikgLT5cbiAgICBpZiBpdGVtID0gQHJpZ2h0Q2xpY2tlZFRhYj8uaXRlbVxuICAgICAgaWYgY29waWVkSXRlbSA9IEBjb3B5SXRlbShpdGVtKVxuICAgICAgICBAcGFuZVtmbl0oaXRlbXM6IFtjb3BpZWRJdGVtXSlcblxuICBjb3B5SXRlbTogKGl0ZW0pIC0+XG4gICAgaXRlbS5jb3B5PygpID8gYXRvbS5kZXNlcmlhbGl6ZXJzLmRlc2VyaWFsaXplKGl0ZW0uc2VyaWFsaXplKCkpXG5cbiAgY2xvc2VPdGhlclRhYnM6IChhY3RpdmUpIC0+XG4gICAgdGFicyA9IEBnZXRUYWJzKClcbiAgICBhY3RpdmUgPz0gQHJpZ2h0Q2xpY2tlZFRhYlxuICAgIHJldHVybiB1bmxlc3MgYWN0aXZlP1xuICAgIEBjbG9zZVRhYiB0YWIgZm9yIHRhYiBpbiB0YWJzIHdoZW4gdGFiIGlzbnQgYWN0aXZlXG5cbiAgY2xvc2VUYWJzVG9SaWdodDogKGFjdGl2ZSkgLT5cbiAgICB0YWJzID0gQGdldFRhYnMoKVxuICAgIGFjdGl2ZSA/PSBAcmlnaHRDbGlja2VkVGFiXG4gICAgaW5kZXggPSB0YWJzLmluZGV4T2YoYWN0aXZlKVxuICAgIHJldHVybiBpZiBpbmRleCBpcyAtMVxuICAgIEBjbG9zZVRhYiB0YWIgZm9yIHRhYiwgaSBpbiB0YWJzIHdoZW4gaSA+IGluZGV4XG5cbiAgY2xvc2VUYWJzVG9MZWZ0OiAoYWN0aXZlKSAtPlxuICAgIHRhYnMgPSBAZ2V0VGFicygpXG4gICAgYWN0aXZlID89IEByaWdodENsaWNrZWRUYWJcbiAgICBpbmRleCA9IHRhYnMuaW5kZXhPZihhY3RpdmUpXG4gICAgcmV0dXJuIGlmIGluZGV4IGlzIC0xXG4gICAgQGNsb3NlVGFiIHRhYiBmb3IgdGFiLCBpIGluIHRhYnMgd2hlbiBpIDwgaW5kZXhcblxuICBjbG9zZVNhdmVkVGFiczogLT5cbiAgICBmb3IgdGFiIGluIEBnZXRUYWJzKClcbiAgICAgIEBjbG9zZVRhYih0YWIpIHVubGVzcyB0YWIuaXRlbS5pc01vZGlmaWVkPygpXG5cbiAgY2xvc2VBbGxUYWJzOiAtPlxuICAgIEBjbG9zZVRhYih0YWIpIGZvciB0YWIgaW4gQGdldFRhYnMoKVxuXG4gIGdldFdpbmRvd0lkOiAtPlxuICAgIEB3aW5kb3dJZCA/PSBhdG9tLmdldEN1cnJlbnRXaW5kb3coKS5pZFxuXG4gIHNob3VsZEFsbG93RHJhZzogLT5cbiAgICAoQHBhbmVDb250YWluZXIuZ2V0UGFuZXMoKS5sZW5ndGggPiAxKSBvciAoQHBhbmUuZ2V0SXRlbXMoKS5sZW5ndGggPiAxKVxuXG4gIG9uRHJhZ1N0YXJ0OiAoZXZlbnQpIC0+XG4gICAgQGRyYWdnZWRUYWIgPSBAdGFiRm9yRWxlbWVudChldmVudC50YXJnZXQpXG4gICAgcmV0dXJuIHVubGVzcyBAZHJhZ2dlZFRhYlxuXG4gICAgZXZlbnQuZGF0YVRyYW5zZmVyLnNldERhdGEgJ2F0b20tZXZlbnQnLCAndHJ1ZSdcblxuICAgIEBkcmFnZ2VkVGFiLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnaXMtZHJhZ2dpbmcnKVxuICAgIEBkcmFnZ2VkVGFiLmRlc3Ryb3lUb29sdGlwKClcblxuICAgIHRhYkluZGV4ID0gQHRhYnMuaW5kZXhPZihAZHJhZ2dlZFRhYilcbiAgICBldmVudC5kYXRhVHJhbnNmZXIuc2V0RGF0YSAnc29ydGFibGUtaW5kZXgnLCB0YWJJbmRleFxuXG4gICAgcGFuZUluZGV4ID0gQHBhbmVDb250YWluZXIuZ2V0UGFuZXMoKS5pbmRleE9mKEBwYW5lKVxuICAgIGV2ZW50LmRhdGFUcmFuc2Zlci5zZXREYXRhICdmcm9tLXBhbmUtaW5kZXgnLCBwYW5lSW5kZXhcbiAgICBldmVudC5kYXRhVHJhbnNmZXIuc2V0RGF0YSAnZnJvbS1wYW5lLWlkJywgQHBhbmUuaWRcbiAgICBldmVudC5kYXRhVHJhbnNmZXIuc2V0RGF0YSAnZnJvbS13aW5kb3ctaWQnLCBAZ2V0V2luZG93SWQoKVxuXG4gICAgaXRlbSA9IEBwYW5lLmdldEl0ZW1zKClbQHRhYnMuaW5kZXhPZihAZHJhZ2dlZFRhYildXG4gICAgcmV0dXJuIHVubGVzcyBpdGVtP1xuXG4gICAgaWYgdHlwZW9mIGl0ZW0uZ2V0VVJJIGlzICdmdW5jdGlvbidcbiAgICAgIGl0ZW1VUkkgPSBpdGVtLmdldFVSSSgpID8gJydcbiAgICBlbHNlIGlmIHR5cGVvZiBpdGVtLmdldFBhdGggaXMgJ2Z1bmN0aW9uJ1xuICAgICAgaXRlbVVSSSA9IGl0ZW0uZ2V0UGF0aCgpID8gJydcbiAgICBlbHNlIGlmIHR5cGVvZiBpdGVtLmdldFVyaSBpcyAnZnVuY3Rpb24nXG4gICAgICBpdGVtVVJJID0gaXRlbS5nZXRVcmkoKSA/ICcnXG5cbiAgICBpZiB0eXBlb2YgaXRlbS5nZXRBbGxvd2VkTG9jYXRpb25zIGlzICdmdW5jdGlvbidcbiAgICAgIGV2ZW50LmRhdGFUcmFuc2Zlci5zZXREYXRhICdhbGxvd2VkLWxvY2F0aW9ucycsIGl0ZW0uZ2V0QWxsb3dlZExvY2F0aW9ucygpLmpvaW4oJ3wnKVxuXG4gICAgaWYgaXRlbVVSST9cbiAgICAgIGV2ZW50LmRhdGFUcmFuc2Zlci5zZXREYXRhICd0ZXh0L3BsYWluJywgaXRlbVVSSVxuXG4gICAgICBpZiBwcm9jZXNzLnBsYXRmb3JtIGlzICdkYXJ3aW4nICMgc2VlICM2OVxuICAgICAgICBpdGVtVVJJID0gXCJmaWxlOi8vI3tpdGVtVVJJfVwiIHVubGVzcyBAdXJpSGFzUHJvdG9jb2woaXRlbVVSSSlcbiAgICAgICAgZXZlbnQuZGF0YVRyYW5zZmVyLnNldERhdGEgJ3RleHQvdXJpLWxpc3QnLCBpdGVtVVJJXG5cbiAgICAgIGlmIGl0ZW0uaXNNb2RpZmllZD8oKSBhbmQgaXRlbS5nZXRUZXh0P1xuICAgICAgICBldmVudC5kYXRhVHJhbnNmZXIuc2V0RGF0YSAnaGFzLXVuc2F2ZWQtY2hhbmdlcycsICd0cnVlJ1xuICAgICAgICBldmVudC5kYXRhVHJhbnNmZXIuc2V0RGF0YSAnbW9kaWZpZWQtdGV4dCcsIGl0ZW0uZ2V0VGV4dCgpXG5cbiAgdXJpSGFzUHJvdG9jb2w6ICh1cmkpIC0+XG4gICAgdHJ5XG4gICAgICByZXF1aXJlKCd1cmwnKS5wYXJzZSh1cmkpLnByb3RvY29sP1xuICAgIGNhdGNoIGVycm9yXG4gICAgICBmYWxzZVxuXG4gIG9uRHJhZ0xlYXZlOiAoZXZlbnQpIC0+XG4gICAgQHJlbW92ZVBsYWNlaG9sZGVyKClcblxuICBvbkRyYWdFbmQ6IChldmVudCkgLT5cbiAgICByZXR1cm4gdW5sZXNzIEB0YWJGb3JFbGVtZW50KGV2ZW50LnRhcmdldClcblxuICAgIEBjbGVhckRyb3BUYXJnZXQoKVxuXG4gIG9uRHJhZ092ZXI6IChldmVudCkgLT5cbiAgICB1bmxlc3MgQGlzQXRvbUV2ZW50KGV2ZW50KVxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgIHJldHVyblxuXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgIG5ld0Ryb3BUYXJnZXRJbmRleCA9IEBnZXREcm9wVGFyZ2V0SW5kZXgoZXZlbnQpXG4gICAgcmV0dXJuIHVubGVzcyBuZXdEcm9wVGFyZ2V0SW5kZXg/XG4gICAgcmV0dXJuIHVubGVzcyBpdGVtSXNBbGxvd2VkKGV2ZW50LCBAbG9jYXRpb24pXG5cbiAgICBAcmVtb3ZlRHJvcFRhcmdldENsYXNzZXMoKVxuXG4gICAgdGFicyA9IEBnZXRUYWJzKClcbiAgICBwbGFjZWhvbGRlciA9IEBnZXRQbGFjZWhvbGRlcigpXG4gICAgcmV0dXJuIHVubGVzcyBwbGFjZWhvbGRlcj9cblxuICAgIGlmIG5ld0Ryb3BUYXJnZXRJbmRleCA8IHRhYnMubGVuZ3RoXG4gICAgICB0YWIgPSB0YWJzW25ld0Ryb3BUYXJnZXRJbmRleF1cbiAgICAgIHRhYi5lbGVtZW50LmNsYXNzTGlzdC5hZGQgJ2lzLWRyb3AtdGFyZ2V0J1xuICAgICAgdGFiLmVsZW1lbnQucGFyZW50RWxlbWVudC5pbnNlcnRCZWZvcmUocGxhY2Vob2xkZXIsIHRhYi5lbGVtZW50KVxuICAgIGVsc2VcbiAgICAgIGlmIHRhYiA9IHRhYnNbbmV3RHJvcFRhcmdldEluZGV4IC0gMV1cbiAgICAgICAgdGFiLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCAnZHJvcC10YXJnZXQtaXMtYWZ0ZXInXG4gICAgICAgIGlmIHNpYmxpbmcgPSB0YWIuZWxlbWVudC5uZXh0U2libGluZ1xuICAgICAgICAgIHRhYi5lbGVtZW50LnBhcmVudEVsZW1lbnQuaW5zZXJ0QmVmb3JlKHBsYWNlaG9sZGVyLCBzaWJsaW5nKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgdGFiLmVsZW1lbnQucGFyZW50RWxlbWVudC5hcHBlbmRDaGlsZChwbGFjZWhvbGRlcilcblxuICBvbkRyb3BPbk90aGVyV2luZG93OiAoZnJvbVBhbmVJZCwgZnJvbUl0ZW1JbmRleCkgLT5cbiAgICBpZiBAcGFuZS5pZCBpcyBmcm9tUGFuZUlkXG4gICAgICBpZiBpdGVtVG9SZW1vdmUgPSBAcGFuZS5nZXRJdGVtcygpW2Zyb21JdGVtSW5kZXhdXG4gICAgICAgIEBwYW5lLmRlc3Ryb3lJdGVtKGl0ZW1Ub1JlbW92ZSlcblxuICAgIEBjbGVhckRyb3BUYXJnZXQoKVxuXG4gIGNsZWFyRHJvcFRhcmdldDogLT5cbiAgICBAZHJhZ2dlZFRhYj8uZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdpcy1kcmFnZ2luZycpXG4gICAgQGRyYWdnZWRUYWI/LnVwZGF0ZVRvb2x0aXAoKVxuICAgIEBkcmFnZ2VkVGFiID0gbnVsbFxuICAgIEByZW1vdmVEcm9wVGFyZ2V0Q2xhc3NlcygpXG4gICAgQHJlbW92ZVBsYWNlaG9sZGVyKClcblxuICBvbkRyb3A6IChldmVudCkgLT5cbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cbiAgICByZXR1cm4gdW5sZXNzIGV2ZW50LmRhdGFUcmFuc2Zlci5nZXREYXRhKCdhdG9tLWV2ZW50JykgaXMgJ3RydWUnXG5cbiAgICBmcm9tV2luZG93SWQgID0gcGFyc2VJbnQoZXZlbnQuZGF0YVRyYW5zZmVyLmdldERhdGEoJ2Zyb20td2luZG93LWlkJykpXG4gICAgZnJvbVBhbmVJZCAgICA9IHBhcnNlSW50KGV2ZW50LmRhdGFUcmFuc2Zlci5nZXREYXRhKCdmcm9tLXBhbmUtaWQnKSlcbiAgICBmcm9tSW5kZXggICAgID0gcGFyc2VJbnQoZXZlbnQuZGF0YVRyYW5zZmVyLmdldERhdGEoJ3NvcnRhYmxlLWluZGV4JykpXG4gICAgZnJvbVBhbmVJbmRleCA9IHBhcnNlSW50KGV2ZW50LmRhdGFUcmFuc2Zlci5nZXREYXRhKCdmcm9tLXBhbmUtaW5kZXgnKSlcblxuICAgIGhhc1Vuc2F2ZWRDaGFuZ2VzID0gZXZlbnQuZGF0YVRyYW5zZmVyLmdldERhdGEoJ2hhcy11bnNhdmVkLWNoYW5nZXMnKSBpcyAndHJ1ZSdcbiAgICBtb2RpZmllZFRleHQgPSBldmVudC5kYXRhVHJhbnNmZXIuZ2V0RGF0YSgnbW9kaWZpZWQtdGV4dCcpXG5cbiAgICB0b0luZGV4ID0gQGdldERyb3BUYXJnZXRJbmRleChldmVudClcbiAgICB0b1BhbmUgPSBAcGFuZVxuXG4gICAgQGNsZWFyRHJvcFRhcmdldCgpXG5cbiAgICByZXR1cm4gdW5sZXNzIGl0ZW1Jc0FsbG93ZWQoZXZlbnQsIEBsb2NhdGlvbilcblxuICAgIGlmIGZyb21XaW5kb3dJZCBpcyBAZ2V0V2luZG93SWQoKVxuICAgICAgZnJvbVBhbmUgPSBAcGFuZUNvbnRhaW5lci5nZXRQYW5lcygpW2Zyb21QYW5lSW5kZXhdXG4gICAgICBpZiBmcm9tUGFuZT8uaWQgaXNudCBmcm9tUGFuZUlkXG4gICAgICAgICMgSWYgZHJhZ2dpbmcgZnJvbSBhIGRpZmZlcmVudCBwYW5lIGNvbnRhaW5lciwgd2UgaGF2ZSB0byBiZSBtb3JlXG4gICAgICAgICMgZXhoYXVzdGl2ZSBpbiBvdXIgc2VhcmNoLlxuICAgICAgICBmcm9tUGFuZSA9IEFycmF5LmZyb20gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnYXRvbS1wYW5lJylcbiAgICAgICAgICAubWFwIChwYW5lRWwpIC0+IHBhbmVFbC5tb2RlbFxuICAgICAgICAgIC5maW5kIChwYW5lKSAtPiBwYW5lLmlkIGlzIGZyb21QYW5lSWRcbiAgICAgIGl0ZW0gPSBmcm9tUGFuZS5nZXRJdGVtcygpW2Zyb21JbmRleF1cbiAgICAgIEBtb3ZlSXRlbUJldHdlZW5QYW5lcyhmcm9tUGFuZSwgZnJvbUluZGV4LCB0b1BhbmUsIHRvSW5kZXgsIGl0ZW0pIGlmIGl0ZW0/XG4gICAgZWxzZVxuICAgICAgZHJvcHBlZFVSSSA9IGV2ZW50LmRhdGFUcmFuc2Zlci5nZXREYXRhKCd0ZXh0L3BsYWluJylcbiAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oZHJvcHBlZFVSSSkudGhlbiAoaXRlbSkgPT5cbiAgICAgICAgIyBNb3ZlIHRoZSBpdGVtIGZyb20gdGhlIHBhbmUgaXQgd2FzIG9wZW5lZCBvbiB0byB0aGUgdGFyZ2V0IHBhbmVcbiAgICAgICAgIyB3aGVyZSBpdCB3YXMgZHJvcHBlZCBvbnRvXG4gICAgICAgIGFjdGl2ZVBhbmUgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKClcbiAgICAgICAgYWN0aXZlSXRlbUluZGV4ID0gYWN0aXZlUGFuZS5nZXRJdGVtcygpLmluZGV4T2YoaXRlbSlcbiAgICAgICAgQG1vdmVJdGVtQmV0d2VlblBhbmVzKGFjdGl2ZVBhbmUsIGFjdGl2ZUl0ZW1JbmRleCwgdG9QYW5lLCB0b0luZGV4LCBpdGVtKVxuICAgICAgICBpdGVtLnNldFRleHQ/KG1vZGlmaWVkVGV4dCkgaWYgaGFzVW5zYXZlZENoYW5nZXNcblxuICAgICAgICBpZiBub3QgaXNOYU4oZnJvbVdpbmRvd0lkKVxuICAgICAgICAgICMgTGV0IHRoZSB3aW5kb3cgd2hlcmUgdGhlIGRyYWcgc3RhcnRlZCBrbm93IHRoYXQgdGhlIHRhYiB3YXMgZHJvcHBlZFxuICAgICAgICAgIGJyb3dzZXJXaW5kb3cgPSBAYnJvd3NlcldpbmRvd0ZvcklkKGZyb21XaW5kb3dJZClcbiAgICAgICAgICBicm93c2VyV2luZG93Py53ZWJDb250ZW50cy5zZW5kKCd0YWI6ZHJvcHBlZCcsIGZyb21QYW5lSWQsIGZyb21JbmRleClcblxuICAgICAgYXRvbS5mb2N1cygpXG5cbiAgb25Nb3VzZVdoZWVsOiAoZXZlbnQpIC0+XG4gICAgcmV0dXJuIGlmIGV2ZW50LnNoaWZ0S2V5XG5cbiAgICBAd2hlZWxEZWx0YSA/PSAwXG4gICAgQHdoZWVsRGVsdGEgKz0gZXZlbnQud2hlZWxEZWx0YVlcblxuICAgIGlmIEB3aGVlbERlbHRhIDw9IC1AdGFiU2Nyb2xsaW5nVGhyZXNob2xkXG4gICAgICBAd2hlZWxEZWx0YSA9IDBcbiAgICAgIEBwYW5lLmFjdGl2YXRlTmV4dEl0ZW0oKVxuICAgIGVsc2UgaWYgQHdoZWVsRGVsdGEgPj0gQHRhYlNjcm9sbGluZ1RocmVzaG9sZFxuICAgICAgQHdoZWVsRGVsdGEgPSAwXG4gICAgICBAcGFuZS5hY3RpdmF0ZVByZXZpb3VzSXRlbSgpXG5cbiAgb25Nb3VzZURvd246IChldmVudCkgLT5cbiAgICB0YWIgPSBAdGFiRm9yRWxlbWVudChldmVudC50YXJnZXQpXG4gICAgcmV0dXJuIHVubGVzcyB0YWJcblxuICAgIGlmIGV2ZW50LndoaWNoIGlzIDMgb3IgKGV2ZW50LndoaWNoIGlzIDEgYW5kIGV2ZW50LmN0cmxLZXkgaXMgdHJ1ZSlcbiAgICAgIEByaWdodENsaWNrZWRUYWI/LmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgncmlnaHQtY2xpY2tlZCcpXG4gICAgICBAcmlnaHRDbGlja2VkVGFiID0gdGFiXG4gICAgICBAcmlnaHRDbGlja2VkVGFiLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgncmlnaHQtY2xpY2tlZCcpXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgZWxzZSBpZiBldmVudC53aGljaCBpcyAxIGFuZCBub3QgZXZlbnQudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnY2xvc2UtaWNvbicpXG4gICAgICBAcGFuZS5hY3RpdmF0ZUl0ZW0odGFiLml0ZW0pXG4gICAgICBzZXRJbW1lZGlhdGUgPT4gQHBhbmUuYWN0aXZhdGUoKSB1bmxlc3MgQHBhbmUuaXNEZXN0cm95ZWQoKVxuICAgIGVsc2UgaWYgZXZlbnQud2hpY2ggaXMgMlxuICAgICAgQHBhbmUuZGVzdHJveUl0ZW0odGFiLml0ZW0pXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cbiAgb25Eb3VibGVDbGljazogKGV2ZW50KSAtPlxuICAgIGlmIHRhYiA9IEB0YWJGb3JFbGVtZW50KGV2ZW50LnRhcmdldClcbiAgICAgIHRhYi5pdGVtLnRlcm1pbmF0ZVBlbmRpbmdTdGF0ZT8oKVxuICAgIGVsc2UgaWYgZXZlbnQudGFyZ2V0IGlzIEBlbGVtZW50XG4gICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKEBlbGVtZW50LCAnYXBwbGljYXRpb246bmV3LWZpbGUnKVxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuXG4gIHVwZGF0ZVRhYlNjcm9sbGluZ1RocmVzaG9sZDogLT5cbiAgICBAdGFiU2Nyb2xsaW5nVGhyZXNob2xkID0gYXRvbS5jb25maWcuZ2V0KCd0YWJzLnRhYlNjcm9sbGluZ1RocmVzaG9sZCcpXG5cbiAgdXBkYXRlVGFiU2Nyb2xsaW5nOiAodmFsdWUpIC0+XG4gICAgaWYgdmFsdWUgaXMgJ3BsYXRmb3JtJ1xuICAgICAgQHRhYlNjcm9sbGluZyA9IChwcm9jZXNzLnBsYXRmb3JtIGlzICdsaW51eCcpXG4gICAgZWxzZVxuICAgICAgQHRhYlNjcm9sbGluZyA9IHZhbHVlXG4gICAgQHRhYlNjcm9sbGluZ1RocmVzaG9sZCA9IGF0b20uY29uZmlnLmdldCgndGFicy50YWJTY3JvbGxpbmdUaHJlc2hvbGQnKVxuXG4gICAgaWYgQHRhYlNjcm9sbGluZ1xuICAgICAgQGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lciAnbW91c2V3aGVlbCcsIEBvbk1vdXNlV2hlZWwuYmluZCh0aGlzKVxuICAgIGVsc2VcbiAgICAgIEBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIgJ21vdXNld2hlZWwnLCBAb25Nb3VzZVdoZWVsLmJpbmQodGhpcylcblxuICBicm93c2VyV2luZG93Rm9ySWQ6IChpZCkgLT5cbiAgICBCcm93c2VyV2luZG93ID89IHJlcXVpcmUoJ2VsZWN0cm9uJykucmVtb3RlLkJyb3dzZXJXaW5kb3dcblxuICAgIEJyb3dzZXJXaW5kb3cuZnJvbUlkIGlkXG5cbiAgbW92ZUl0ZW1CZXR3ZWVuUGFuZXM6IChmcm9tUGFuZSwgZnJvbUluZGV4LCB0b1BhbmUsIHRvSW5kZXgsIGl0ZW0pIC0+XG4gICAgdHJ5XG4gICAgICBpZiB0b1BhbmUgaXMgZnJvbVBhbmVcbiAgICAgICAgdG9JbmRleC0tIGlmIGZyb21JbmRleCA8IHRvSW5kZXhcbiAgICAgICAgdG9QYW5lLm1vdmVJdGVtKGl0ZW0sIHRvSW5kZXgpXG4gICAgICBlbHNlXG4gICAgICAgIEBpc0l0ZW1Nb3ZpbmdCZXR3ZWVuUGFuZXMgPSB0cnVlXG4gICAgICAgIGZyb21QYW5lLm1vdmVJdGVtVG9QYW5lKGl0ZW0sIHRvUGFuZSwgdG9JbmRleC0tKVxuICAgICAgdG9QYW5lLmFjdGl2YXRlSXRlbShpdGVtKVxuICAgICAgdG9QYW5lLmFjdGl2YXRlKClcbiAgICBmaW5hbGx5XG4gICAgICBAaXNJdGVtTW92aW5nQmV0d2VlblBhbmVzID0gZmFsc2VcblxuICByZW1vdmVEcm9wVGFyZ2V0Q2xhc3NlczogLT5cbiAgICB3b3Jrc3BhY2VFbGVtZW50ID0gYXRvbS52aWV3cy5nZXRWaWV3KGF0b20ud29ya3NwYWNlKVxuICAgIGZvciBkcm9wVGFyZ2V0IGluIHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnRhYi1iYXIgLmlzLWRyb3AtdGFyZ2V0JylcbiAgICAgIGRyb3BUYXJnZXQuY2xhc3NMaXN0LnJlbW92ZSgnaXMtZHJvcC10YXJnZXQnKVxuXG4gICAgZm9yIGRyb3BUYXJnZXQgaW4gd29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudGFiLWJhciAuZHJvcC10YXJnZXQtaXMtYWZ0ZXInKVxuICAgICAgZHJvcFRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKCdkcm9wLXRhcmdldC1pcy1hZnRlcicpXG5cbiAgZ2V0RHJvcFRhcmdldEluZGV4OiAoZXZlbnQpIC0+XG4gICAgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0XG5cbiAgICByZXR1cm4gaWYgQGlzUGxhY2Vob2xkZXIodGFyZ2V0KVxuXG4gICAgdGFicyA9IEBnZXRUYWJzKClcbiAgICB0YWIgPSBAdGFiRm9yRWxlbWVudCh0YXJnZXQpXG4gICAgdGFiID89IHRhYnNbdGFicy5sZW5ndGggLSAxXVxuXG4gICAgcmV0dXJuIDAgdW5sZXNzIHRhYj9cblxuICAgIHtsZWZ0LCB3aWR0aH0gPSB0YWIuZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgIGVsZW1lbnRDZW50ZXIgPSBsZWZ0ICsgd2lkdGggLyAyXG4gICAgZWxlbWVudEluZGV4ID0gdGFicy5pbmRleE9mKHRhYilcblxuICAgIGlmIGV2ZW50LnBhZ2VYIDwgZWxlbWVudENlbnRlclxuICAgICAgZWxlbWVudEluZGV4XG4gICAgZWxzZVxuICAgICAgZWxlbWVudEluZGV4ICsgMVxuXG4gIGdldFBsYWNlaG9sZGVyOiAtPlxuICAgIHJldHVybiBAcGxhY2Vob2xkZXJFbCBpZiBAcGxhY2Vob2xkZXJFbD9cblxuICAgIEBwbGFjZWhvbGRlckVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpXCIpXG4gICAgQHBsYWNlaG9sZGVyRWwuY2xhc3NMaXN0LmFkZChcInBsYWNlaG9sZGVyXCIpXG4gICAgQHBsYWNlaG9sZGVyRWxcblxuICByZW1vdmVQbGFjZWhvbGRlcjogLT5cbiAgICBAcGxhY2Vob2xkZXJFbD8ucmVtb3ZlKClcbiAgICBAcGxhY2Vob2xkZXJFbCA9IG51bGxcblxuICBpc1BsYWNlaG9sZGVyOiAoZWxlbWVudCkgLT5cbiAgICBlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygncGxhY2Vob2xkZXInKVxuXG4gIG9uTW91c2VFbnRlcjogLT5cbiAgICBmb3IgdGFiIGluIEBnZXRUYWJzKClcbiAgICAgIHt3aWR0aH0gPSB0YWIuZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgICAgdGFiLmVsZW1lbnQuc3R5bGUubWF4V2lkdGggPSB3aWR0aC50b0ZpeGVkKDIpICsgJ3B4J1xuICAgIHJldHVyblxuXG4gIG9uTW91c2VMZWF2ZTogLT5cbiAgICB0YWIuZWxlbWVudC5zdHlsZS5tYXhXaWR0aCA9ICcnIGZvciB0YWIgaW4gQGdldFRhYnMoKVxuICAgIHJldHVyblxuXG4gIHRhYkZvckVsZW1lbnQ6IChlbGVtZW50KSAtPlxuICAgIGN1cnJlbnRFbGVtZW50ID0gZWxlbWVudFxuICAgIHdoaWxlIGN1cnJlbnRFbGVtZW50P1xuICAgICAgaWYgdGFiID0gQHRhYnNCeUVsZW1lbnQuZ2V0KGN1cnJlbnRFbGVtZW50KVxuICAgICAgICByZXR1cm4gdGFiXG4gICAgICBlbHNlXG4gICAgICAgIGN1cnJlbnRFbGVtZW50ID0gY3VycmVudEVsZW1lbnQucGFyZW50RWxlbWVudFxuXG4gIGlzQXRvbUV2ZW50OiAoZXZlbnQpIC0+XG4gICAgZm9yIGl0ZW0gaW4gZXZlbnQuZGF0YVRyYW5zZmVyLml0ZW1zXG4gICAgICBpZiBpdGVtLnR5cGUgaXMgJ2F0b20tZXZlbnQnXG4gICAgICAgIHJldHVybiB0cnVlXG5cbiAgICByZXR1cm4gZmFsc2VcblxuaXRlbUlzQWxsb3dlZCA9IChldmVudCwgbG9jYXRpb24pIC0+XG4gIGFsbG93ZWRMb2NhdGlvbnMgPSAoZXZlbnQuZGF0YVRyYW5zZmVyLmdldERhdGEoJ2FsbG93ZWQtbG9jYXRpb25zJykgb3IgJycpLnRyaW0oKVxuICBub3QgYWxsb3dlZExvY2F0aW9ucyBvciBhbGxvd2VkTG9jYXRpb25zLnNwbGl0KCd8JykuaW5jbHVkZXMobG9jYXRpb24pXG4iXX0=
