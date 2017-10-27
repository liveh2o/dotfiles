(function() {
  var BrowserWindow, CompositeDisposable, TabBarView, TabView, _, ipcRenderer;

  BrowserWindow = null;

  ipcRenderer = require('electron').ipcRenderer;

  CompositeDisposable = require('atom').CompositeDisposable;

  _ = require('underscore-plus');

  TabView = require('./tab-view');

  module.exports = TabBarView = (function() {
    function TabBarView(pane1) {
      var addElementCommands, item, j, len, ref;
      this.pane = pane1;
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
        })(this)
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
      if (event.dataTransfer.getData('atom-event') !== 'true') {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      event.preventDefault();
      newDropTargetIndex = this.getDropTargetIndex(event);
      if (newDropTargetIndex == null) {
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

    return TabBarView;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RhYnMvbGliL3RhYi1iYXItdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLGFBQUEsR0FBZ0I7O0VBQ2YsY0FBZSxPQUFBLENBQVEsVUFBUjs7RUFFZixzQkFBdUIsT0FBQSxDQUFRLE1BQVI7O0VBQ3hCLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVI7O0VBQ0osT0FBQSxHQUFVLE9BQUEsQ0FBUSxZQUFSOztFQUVWLE1BQU0sQ0FBQyxPQUFQLEdBQ007SUFDUyxvQkFBQyxLQUFEO0FBQ1gsVUFBQTtNQURZLElBQUMsQ0FBQSxPQUFEO01BQ1osSUFBQyxDQUFBLE9BQUQsR0FBVyxRQUFRLENBQUMsYUFBVCxDQUF1QixJQUF2QjtNQUNYLElBQUMsQ0FBQSxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQW5CLENBQXVCLGFBQXZCO01BQ0EsSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBbkIsQ0FBdUIsU0FBdkI7TUFDQSxJQUFDLENBQUEsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFuQixDQUF1QixhQUF2QjtNQUNBLElBQUMsQ0FBQSxPQUFPLENBQUMsWUFBVCxDQUFzQixJQUF0QixFQUE0QixXQUE1QjtNQUNBLElBQUMsQ0FBQSxPQUFPLENBQUMsWUFBVCxDQUFzQixVQUF0QixFQUFrQyxDQUFDLENBQW5DO01BRUEsSUFBQyxDQUFBLElBQUQsR0FBUTtNQUNSLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUk7TUFDckIsSUFBQyxDQUFBLGFBQUQsR0FBaUIsSUFBSTtNQUVyQixJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixJQUFDLENBQUEsSUFBcEIsQ0FBbEIsRUFDakI7UUFBQSx1QkFB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QUFjLENBQUUsTUFBaEIsQ0FBQTs7YUFDQSxJQUFDLENBQUEsYUFBRCxHQUFpQjtJQUZBOzt5QkFJbkIsYUFBQSxHQUFlLFNBQUMsT0FBRDthQUNiLE9BQU8sQ0FBQyxTQUFTLENBQUMsUUFBbEIsQ0FBMkIsYUFBM0I7SUFEYTs7eUJBR2YsWUFBQSxHQUFjLFNBQUE7QUFDWixVQUFBO0FBQUE7QUFBQSxXQUFBLHFDQUFBOztRQUNHLFFBQVMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxxQkFBWixDQUFBO1FBQ1YsR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsUUFBbEIsR0FBNkIsS0FBSyxDQUFDLE9BQU4sQ0FBYyxDQUFkLENBQUEsR0FBbUI7QUFGbEQ7SUFEWTs7eUJBTWQsWUFBQSxHQUFjLFNBQUE7QUFDWixVQUFBO0FBQUE7QUFBQSxXQUFBLHFDQUFBOztRQUFBLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFFBQWxCLEdBQTZCO0FBQTdCO0lBRFk7O3lCQUlkLGFBQUEsR0FBZSxTQUFDLE9BQUQ7QUFDYixVQUFBO01BQUEsY0FBQSxHQUFpQjtBQUNqQixhQUFNLHNCQUFOO1FBQ0UsSUFBRyxHQUFBLEdBQU0sSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLGNBQW5CLENBQVQ7QUFDRSxpQkFBTyxJQURUO1NBQUEsTUFBQTtVQUdFLGNBQUEsR0FBaUIsY0FBYyxDQUFDLGNBSGxDOztNQURGO0lBRmE7Ozs7O0FBOWVqQiIsInNvdXJjZXNDb250ZW50IjpbIkJyb3dzZXJXaW5kb3cgPSBudWxsICMgRGVmZXIgcmVxdWlyZSB1bnRpbCBhY3R1YWxseSB1c2VkXG57aXBjUmVuZGVyZXJ9ID0gcmVxdWlyZSAnZWxlY3Ryb24nXG5cbntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG5fID0gcmVxdWlyZSAndW5kZXJzY29yZS1wbHVzJ1xuVGFiVmlldyA9IHJlcXVpcmUgJy4vdGFiLXZpZXcnXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIFRhYkJhclZpZXdcbiAgY29uc3RydWN0b3I6IChAcGFuZSkgLT5cbiAgICBAZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3VsJylcbiAgICBAZWxlbWVudC5jbGFzc0xpc3QuYWRkKFwibGlzdC1pbmxpbmVcIilcbiAgICBAZWxlbWVudC5jbGFzc0xpc3QuYWRkKFwidGFiLWJhclwiKVxuICAgIEBlbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJpbnNldC1wYW5lbFwiKVxuICAgIEBlbGVtZW50LnNldEF0dHJpYnV0ZSgnaXMnLCAnYXRvbS10YWJzJylcbiAgICBAZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJ0YWJpbmRleFwiLCAtMSlcblxuICAgIEB0YWJzID0gW11cbiAgICBAdGFic0J5RWxlbWVudCA9IG5ldyBXZWFrTWFwXG4gICAgQHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkIGF0b20udmlld3MuZ2V0VmlldyhAcGFuZSksXG4gICAgICAndGFiczprZWVwLXBlbmRpbmctdGFiJzogPT4gQHRlcm1pbmF0ZVBlbmRpbmdTdGF0ZXMoKVxuICAgICAgJ3RhYnM6Y2xvc2UtdGFiJzogPT4gQGNsb3NlVGFiKEBnZXRBY3RpdmVUYWIoKSlcbiAgICAgICd0YWJzOmNsb3NlLW90aGVyLXRhYnMnOiA9PiBAY2xvc2VPdGhlclRhYnMoQGdldEFjdGl2ZVRhYigpKVxuICAgICAgJ3RhYnM6Y2xvc2UtdGFicy10by1yaWdodCc6ID0+IEBjbG9zZVRhYnNUb1JpZ2h0KEBnZXRBY3RpdmVUYWIoKSlcbiAgICAgICd0YWJzOmNsb3NlLXRhYnMtdG8tbGVmdCc6ID0+IEBjbG9zZVRhYnNUb0xlZnQoQGdldEFjdGl2ZVRhYigpKVxuICAgICAgJ3RhYnM6Y2xvc2Utc2F2ZWQtdGFicyc6ID0+IEBjbG9zZVNhdmVkVGFicygpXG4gICAgICAndGFiczpjbG9zZS1hbGwtdGFicyc6IChldmVudCkgPT5cbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgQGNsb3NlQWxsVGFicygpXG4gICAgICAndGFiczpvcGVuLWluLW5ldy13aW5kb3cnOiA9PiBAb3BlbkluTmV3V2luZG93KClcblxuICAgIGFkZEVsZW1lbnRDb21tYW5kcyA9IChjb21tYW5kcykgPT5cbiAgICAgIGNvbW1hbmRzV2l0aFByb3BhZ2F0aW9uU3RvcHBlZCA9IHt9XG4gICAgICBPYmplY3Qua2V5cyhjb21tYW5kcykuZm9yRWFjaCAobmFtZSkgLT5cbiAgICAgICAgY29tbWFuZHNXaXRoUHJvcGFnYXRpb25TdG9wcGVkW25hbWVdID0gKGV2ZW50KSAtPlxuICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgICAgY29tbWFuZHNbbmFtZV0oKVxuXG4gICAgICBAc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb21tYW5kcy5hZGQoQGVsZW1lbnQsIGNvbW1hbmRzV2l0aFByb3BhZ2F0aW9uU3RvcHBlZCkpXG5cbiAgICBhZGRFbGVtZW50Q29tbWFuZHNcbiAgICAgICd0YWJzOmNsb3NlLXRhYic6ID0+IEBjbG9zZVRhYigpXG4gICAgICAndGFiczpjbG9zZS1vdGhlci10YWJzJzogPT4gQGNsb3NlT3RoZXJUYWJzKClcbiAgICAgICd0YWJzOmNsb3NlLXRhYnMtdG8tcmlnaHQnOiA9PiBAY2xvc2VUYWJzVG9SaWdodCgpXG4gICAgICAndGFiczpjbG9zZS10YWJzLXRvLWxlZnQnOiA9PiBAY2xvc2VUYWJzVG9MZWZ0KClcbiAgICAgICd0YWJzOmNsb3NlLXNhdmVkLXRhYnMnOiA9PiBAY2xvc2VTYXZlZFRhYnMoKVxuICAgICAgJ3RhYnM6Y2xvc2UtYWxsLXRhYnMnOiA9PiBAY2xvc2VBbGxUYWJzKClcbiAgICAgICd0YWJzOnNwbGl0LXVwJzogPT4gQHNwbGl0VGFiKCdzcGxpdFVwJylcbiAgICAgICd0YWJzOnNwbGl0LWRvd24nOiA9PiBAc3BsaXRUYWIoJ3NwbGl0RG93bicpXG4gICAgICAndGFiczpzcGxpdC1sZWZ0JzogPT4gQHNwbGl0VGFiKCdzcGxpdExlZnQnKVxuICAgICAgJ3RhYnM6c3BsaXQtcmlnaHQnOiA9PiBAc3BsaXRUYWIoJ3NwbGl0UmlnaHQnKVxuXG4gICAgQGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lciBcIm1vdXNlZW50ZXJcIiwgQG9uTW91c2VFbnRlci5iaW5kKHRoaXMpXG4gICAgQGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lciBcIm1vdXNlbGVhdmVcIiwgQG9uTW91c2VMZWF2ZS5iaW5kKHRoaXMpXG4gICAgQGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lciBcImRyYWdzdGFydFwiLCBAb25EcmFnU3RhcnQuYmluZCh0aGlzKVxuICAgIEBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIgXCJkcmFnZW5kXCIsIEBvbkRyYWdFbmQuYmluZCh0aGlzKVxuICAgIEBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIgXCJkcmFnbGVhdmVcIiwgQG9uRHJhZ0xlYXZlLmJpbmQodGhpcylcbiAgICBAZWxlbWVudC5hZGRFdmVudExpc3RlbmVyIFwiZHJhZ292ZXJcIiwgQG9uRHJhZ092ZXIuYmluZCh0aGlzKVxuICAgIEBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIgXCJkcm9wXCIsIEBvbkRyb3AuYmluZCh0aGlzKVxuXG4gICAgQHBhbmVDb250YWluZXIgPSBAcGFuZS5nZXRDb250YWluZXIoKVxuICAgIEBhZGRUYWJGb3JJdGVtKGl0ZW0pIGZvciBpdGVtIGluIEBwYW5lLmdldEl0ZW1zKClcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBAcGFuZS5vbkRpZERlc3Ryb3kgPT5cbiAgICAgIEBkZXN0cm95KClcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBAcGFuZS5vbkRpZEFkZEl0ZW0gKHtpdGVtLCBpbmRleH0pID0+XG4gICAgICBAYWRkVGFiRm9ySXRlbShpdGVtLCBpbmRleClcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBAcGFuZS5vbkRpZE1vdmVJdGVtICh7aXRlbSwgbmV3SW5kZXh9KSA9PlxuICAgICAgQG1vdmVJdGVtVGFiVG9JbmRleChpdGVtLCBuZXdJbmRleClcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBAcGFuZS5vbkRpZFJlbW92ZUl0ZW0gKHtpdGVtfSkgPT5cbiAgICAgIEByZW1vdmVUYWJGb3JJdGVtKGl0ZW0pXG5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgQHBhbmUub25EaWRDaGFuZ2VBY3RpdmVJdGVtIChpdGVtKSA9PlxuICAgICAgQHVwZGF0ZUFjdGl2ZVRhYigpXG5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb25maWcub2JzZXJ2ZSAndGFicy50YWJTY3JvbGxpbmcnLCBAdXBkYXRlVGFiU2Nyb2xsaW5nLmJpbmQodGhpcylcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb25maWcub2JzZXJ2ZSAndGFicy50YWJTY3JvbGxpbmdUaHJlc2hvbGQnLCA9PiBAdXBkYXRlVGFiU2Nyb2xsaW5nVGhyZXNob2xkKClcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb25maWcub2JzZXJ2ZSAndGFicy5hbHdheXNTaG93VGFiQmFyJywgPT4gQHVwZGF0ZVRhYkJhclZpc2liaWxpdHkoKVxuXG4gICAgQHVwZGF0ZUFjdGl2ZVRhYigpXG5cbiAgICBAZWxlbWVudC5hZGRFdmVudExpc3RlbmVyIFwibW91c2Vkb3duXCIsIEBvbk1vdXNlRG93bi5iaW5kKHRoaXMpXG4gICAgQGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lciBcImRibGNsaWNrXCIsIEBvbkRvdWJsZUNsaWNrLmJpbmQodGhpcylcblxuICAgIEBvbkRyb3BPbk90aGVyV2luZG93ID0gQG9uRHJvcE9uT3RoZXJXaW5kb3cuYmluZCh0aGlzKVxuICAgIGlwY1JlbmRlcmVyLm9uKCd0YWI6ZHJvcHBlZCcsIEBvbkRyb3BPbk90aGVyV2luZG93KVxuXG4gIGRlc3Ryb3k6IC0+XG4gICAgaXBjUmVuZGVyZXIucmVtb3ZlTGlzdGVuZXIoJ3RhYjpkcm9wcGVkJywgQG9uRHJvcE9uT3RoZXJXaW5kb3cpXG4gICAgQHN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgQGVsZW1lbnQucmVtb3ZlKClcblxuICB0ZXJtaW5hdGVQZW5kaW5nU3RhdGVzOiAtPlxuICAgIHRhYi50ZXJtaW5hdGVQZW5kaW5nU3RhdGU/KCkgZm9yIHRhYiBpbiBAZ2V0VGFicygpXG4gICAgcmV0dXJuXG5cbiAgYWRkVGFiRm9ySXRlbTogKGl0ZW0sIGluZGV4KSAtPlxuICAgIHRhYlZpZXcgPSBuZXcgVGFiVmlldyh7XG4gICAgICBpdGVtLFxuICAgICAgQHBhbmUsXG4gICAgICBAdGFicyxcbiAgICAgIGRpZENsaWNrQ2xvc2VJY29uOiA9PlxuICAgICAgICBAY2xvc2VUYWIodGFiVmlldylcbiAgICAgICAgcmV0dXJuXG4gICAgfSlcbiAgICB0YWJWaWV3LnRlcm1pbmF0ZVBlbmRpbmdTdGF0ZSgpIGlmIEBpc0l0ZW1Nb3ZpbmdCZXR3ZWVuUGFuZXNcbiAgICBAdGFic0J5RWxlbWVudC5zZXQodGFiVmlldy5lbGVtZW50LCB0YWJWaWV3KVxuICAgIEBpbnNlcnRUYWJBdEluZGV4KHRhYlZpZXcsIGluZGV4KVxuICAgIGlmIGF0b20uY29uZmlnLmdldCgndGFicy5hZGROZXdUYWJzQXRFbmQnKVxuICAgICAgQHBhbmUubW92ZUl0ZW0oaXRlbSwgQHBhbmUuZ2V0SXRlbXMoKS5sZW5ndGggLSAxKSB1bmxlc3MgQGlzSXRlbU1vdmluZ0JldHdlZW5QYW5lc1xuXG4gIG1vdmVJdGVtVGFiVG9JbmRleDogKGl0ZW0sIGluZGV4KSAtPlxuICAgIHRhYkluZGV4ID0gQHRhYnMuZmluZEluZGV4KCh0KSAtPiB0Lml0ZW0gaXMgaXRlbSlcbiAgICBpZiB0YWJJbmRleCBpc250IC0xXG4gICAgICB0YWIgPSBAdGFic1t0YWJJbmRleF1cbiAgICAgIHRhYi5lbGVtZW50LnJlbW92ZSgpXG4gICAgICBAdGFicy5zcGxpY2UodGFiSW5kZXgsIDEpXG4gICAgICBAaW5zZXJ0VGFiQXRJbmRleCh0YWIsIGluZGV4KVxuXG4gIGluc2VydFRhYkF0SW5kZXg6ICh0YWIsIGluZGV4KSAtPlxuICAgIGZvbGxvd2luZ1RhYiA9IEB0YWJzW2luZGV4XSBpZiBpbmRleD9cbiAgICBpZiBmb2xsb3dpbmdUYWJcbiAgICAgIEBlbGVtZW50Lmluc2VydEJlZm9yZSh0YWIuZWxlbWVudCwgZm9sbG93aW5nVGFiLmVsZW1lbnQpXG4gICAgICBAdGFicy5zcGxpY2UoaW5kZXgsIDAsIHRhYilcbiAgICBlbHNlXG4gICAgICBAZWxlbWVudC5hcHBlbmRDaGlsZCh0YWIuZWxlbWVudClcbiAgICAgIEB0YWJzLnB1c2godGFiKVxuXG4gICAgdGFiLnVwZGF0ZVRpdGxlKClcbiAgICBAdXBkYXRlVGFiQmFyVmlzaWJpbGl0eSgpXG5cbiAgcmVtb3ZlVGFiRm9ySXRlbTogKGl0ZW0pIC0+XG4gICAgdGFiSW5kZXggPSBAdGFicy5maW5kSW5kZXgoKHQpIC0+IHQuaXRlbSBpcyBpdGVtKVxuICAgIGlmIHRhYkluZGV4IGlzbnQgLTFcbiAgICAgIHRhYiA9IEB0YWJzW3RhYkluZGV4XVxuICAgICAgQHRhYnMuc3BsaWNlKHRhYkluZGV4LCAxKVxuICAgICAgQHRhYnNCeUVsZW1lbnQuZGVsZXRlKHRhYilcbiAgICAgIHRhYi5kZXN0cm95KClcbiAgICB0YWIudXBkYXRlVGl0bGUoKSBmb3IgdGFiIGluIEBnZXRUYWJzKClcbiAgICBAdXBkYXRlVGFiQmFyVmlzaWJpbGl0eSgpXG5cbiAgdXBkYXRlVGFiQmFyVmlzaWJpbGl0eTogLT5cbiAgICBpZiBub3QgYXRvbS5jb25maWcuZ2V0KCd0YWJzLmFsd2F5c1Nob3dUYWJCYXInKSBhbmQgbm90IEBzaG91bGRBbGxvd0RyYWcoKVxuICAgICAgQGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnaGlkZGVuJylcbiAgICBlbHNlXG4gICAgICBAZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKVxuXG4gIGdldFRhYnM6IC0+XG4gICAgQHRhYnMuc2xpY2UoKVxuXG4gIHRhYkF0SW5kZXg6IChpbmRleCkgLT5cbiAgICBAdGFic1tpbmRleF1cblxuICB0YWJGb3JJdGVtOiAoaXRlbSkgLT5cbiAgICBAdGFicy5maW5kKCh0KSAtPiB0Lml0ZW0gaXMgaXRlbSlcblxuICBzZXRBY3RpdmVUYWI6ICh0YWJWaWV3KSAtPlxuICAgIGlmIHRhYlZpZXc/IGFuZCB0YWJWaWV3IGlzbnQgQGFjdGl2ZVRhYlxuICAgICAgQGFjdGl2ZVRhYj8uZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKVxuICAgICAgQGFjdGl2ZVRhYiA9IHRhYlZpZXdcbiAgICAgIEBhY3RpdmVUYWIuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxuICAgICAgQGFjdGl2ZVRhYi5lbGVtZW50LnNjcm9sbEludG9WaWV3KGZhbHNlKVxuXG4gIGdldEFjdGl2ZVRhYjogLT5cbiAgICBAdGFiRm9ySXRlbShAcGFuZS5nZXRBY3RpdmVJdGVtKCkpXG5cbiAgdXBkYXRlQWN0aXZlVGFiOiAtPlxuICAgIEBzZXRBY3RpdmVUYWIoQHRhYkZvckl0ZW0oQHBhbmUuZ2V0QWN0aXZlSXRlbSgpKSlcblxuICBjbG9zZVRhYjogKHRhYikgLT5cbiAgICB0YWIgPz0gQHJpZ2h0Q2xpY2tlZFRhYlxuICAgIEBwYW5lLmRlc3Ryb3lJdGVtKHRhYi5pdGVtKSBpZiB0YWI/XG5cbiAgb3BlbkluTmV3V2luZG93OiAodGFiKSAtPlxuICAgIHRhYiA/PSBAcmlnaHRDbGlja2VkVGFiXG4gICAgaXRlbSA9IHRhYj8uaXRlbVxuICAgIHJldHVybiB1bmxlc3MgaXRlbT9cbiAgICBpZiB0eXBlb2YgaXRlbS5nZXRVUkkgaXMgJ2Z1bmN0aW9uJ1xuICAgICAgaXRlbVVSSSA9IGl0ZW0uZ2V0VVJJKClcbiAgICBlbHNlIGlmIHR5cGVvZiBpdGVtLmdldFBhdGggaXMgJ2Z1bmN0aW9uJ1xuICAgICAgaXRlbVVSSSA9IGl0ZW0uZ2V0UGF0aCgpXG4gICAgZWxzZSBpZiB0eXBlb2YgaXRlbS5nZXRVcmkgaXMgJ2Z1bmN0aW9uJ1xuICAgICAgaXRlbVVSSSA9IGl0ZW0uZ2V0VXJpKClcbiAgICByZXR1cm4gdW5sZXNzIGl0ZW1VUkk/XG4gICAgQGNsb3NlVGFiKHRhYilcbiAgICBwYXRoc1RvT3BlbiA9IFthdG9tLnByb2plY3QuZ2V0UGF0aHMoKSwgaXRlbVVSSV0ucmVkdWNlICgoYSwgYikgLT4gYS5jb25jYXQoYikpLCBbXVxuICAgIGF0b20ub3Blbih7cGF0aHNUb09wZW46IHBhdGhzVG9PcGVuLCBuZXdXaW5kb3c6IHRydWUsIGRldk1vZGU6IGF0b20uZGV2TW9kZSwgc2FmZU1vZGU6IGF0b20uc2FmZU1vZGV9KVxuXG4gIHNwbGl0VGFiOiAoZm4pIC0+XG4gICAgaWYgaXRlbSA9IEByaWdodENsaWNrZWRUYWI/Lml0ZW1cbiAgICAgIGlmIGNvcGllZEl0ZW0gPSBAY29weUl0ZW0oaXRlbSlcbiAgICAgICAgQHBhbmVbZm5dKGl0ZW1zOiBbY29waWVkSXRlbV0pXG5cbiAgY29weUl0ZW06IChpdGVtKSAtPlxuICAgIGl0ZW0uY29weT8oKSA/IGF0b20uZGVzZXJpYWxpemVycy5kZXNlcmlhbGl6ZShpdGVtLnNlcmlhbGl6ZSgpKVxuXG4gIGNsb3NlT3RoZXJUYWJzOiAoYWN0aXZlKSAtPlxuICAgIHRhYnMgPSBAZ2V0VGFicygpXG4gICAgYWN0aXZlID89IEByaWdodENsaWNrZWRUYWJcbiAgICByZXR1cm4gdW5sZXNzIGFjdGl2ZT9cbiAgICBAY2xvc2VUYWIgdGFiIGZvciB0YWIgaW4gdGFicyB3aGVuIHRhYiBpc250IGFjdGl2ZVxuXG4gIGNsb3NlVGFic1RvUmlnaHQ6IChhY3RpdmUpIC0+XG4gICAgdGFicyA9IEBnZXRUYWJzKClcbiAgICBhY3RpdmUgPz0gQHJpZ2h0Q2xpY2tlZFRhYlxuICAgIGluZGV4ID0gdGFicy5pbmRleE9mKGFjdGl2ZSlcbiAgICByZXR1cm4gaWYgaW5kZXggaXMgLTFcbiAgICBAY2xvc2VUYWIgdGFiIGZvciB0YWIsIGkgaW4gdGFicyB3aGVuIGkgPiBpbmRleFxuXG4gIGNsb3NlVGFic1RvTGVmdDogKGFjdGl2ZSkgLT5cbiAgICB0YWJzID0gQGdldFRhYnMoKVxuICAgIGFjdGl2ZSA/PSBAcmlnaHRDbGlja2VkVGFiXG4gICAgaW5kZXggPSB0YWJzLmluZGV4T2YoYWN0aXZlKVxuICAgIHJldHVybiBpZiBpbmRleCBpcyAtMVxuICAgIEBjbG9zZVRhYiB0YWIgZm9yIHRhYiwgaSBpbiB0YWJzIHdoZW4gaSA8IGluZGV4XG5cbiAgY2xvc2VTYXZlZFRhYnM6IC0+XG4gICAgZm9yIHRhYiBpbiBAZ2V0VGFicygpXG4gICAgICBAY2xvc2VUYWIodGFiKSB1bmxlc3MgdGFiLml0ZW0uaXNNb2RpZmllZD8oKVxuXG4gIGNsb3NlQWxsVGFiczogLT5cbiAgICBAY2xvc2VUYWIodGFiKSBmb3IgdGFiIGluIEBnZXRUYWJzKClcblxuICBnZXRXaW5kb3dJZDogLT5cbiAgICBAd2luZG93SWQgPz0gYXRvbS5nZXRDdXJyZW50V2luZG93KCkuaWRcblxuICBzaG91bGRBbGxvd0RyYWc6IC0+XG4gICAgKEBwYW5lQ29udGFpbmVyLmdldFBhbmVzKCkubGVuZ3RoID4gMSkgb3IgKEBwYW5lLmdldEl0ZW1zKCkubGVuZ3RoID4gMSlcblxuICBvbkRyYWdTdGFydDogKGV2ZW50KSAtPlxuICAgIEBkcmFnZ2VkVGFiID0gQHRhYkZvckVsZW1lbnQoZXZlbnQudGFyZ2V0KVxuICAgIHJldHVybiB1bmxlc3MgQGRyYWdnZWRUYWJcblxuICAgIGV2ZW50LmRhdGFUcmFuc2Zlci5zZXREYXRhICdhdG9tLWV2ZW50JywgJ3RydWUnXG5cbiAgICBAZHJhZ2dlZFRhYi5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2lzLWRyYWdnaW5nJylcbiAgICBAZHJhZ2dlZFRhYi5kZXN0cm95VG9vbHRpcCgpXG5cbiAgICB0YWJJbmRleCA9IEB0YWJzLmluZGV4T2YoQGRyYWdnZWRUYWIpXG4gICAgZXZlbnQuZGF0YVRyYW5zZmVyLnNldERhdGEgJ3NvcnRhYmxlLWluZGV4JywgdGFiSW5kZXhcblxuICAgIHBhbmVJbmRleCA9IEBwYW5lQ29udGFpbmVyLmdldFBhbmVzKCkuaW5kZXhPZihAcGFuZSlcbiAgICBldmVudC5kYXRhVHJhbnNmZXIuc2V0RGF0YSAnZnJvbS1wYW5lLWluZGV4JywgcGFuZUluZGV4XG4gICAgZXZlbnQuZGF0YVRyYW5zZmVyLnNldERhdGEgJ2Zyb20tcGFuZS1pZCcsIEBwYW5lLmlkXG4gICAgZXZlbnQuZGF0YVRyYW5zZmVyLnNldERhdGEgJ2Zyb20td2luZG93LWlkJywgQGdldFdpbmRvd0lkKClcblxuICAgIGl0ZW0gPSBAcGFuZS5nZXRJdGVtcygpW0B0YWJzLmluZGV4T2YoQGRyYWdnZWRUYWIpXVxuICAgIHJldHVybiB1bmxlc3MgaXRlbT9cblxuICAgIGlmIHR5cGVvZiBpdGVtLmdldFVSSSBpcyAnZnVuY3Rpb24nXG4gICAgICBpdGVtVVJJID0gaXRlbS5nZXRVUkkoKSA/ICcnXG4gICAgZWxzZSBpZiB0eXBlb2YgaXRlbS5nZXRQYXRoIGlzICdmdW5jdGlvbidcbiAgICAgIGl0ZW1VUkkgPSBpdGVtLmdldFBhdGgoKSA/ICcnXG4gICAgZWxzZSBpZiB0eXBlb2YgaXRlbS5nZXRVcmkgaXMgJ2Z1bmN0aW9uJ1xuICAgICAgaXRlbVVSSSA9IGl0ZW0uZ2V0VXJpKCkgPyAnJ1xuXG4gICAgaWYgaXRlbVVSST9cbiAgICAgIGV2ZW50LmRhdGFUcmFuc2Zlci5zZXREYXRhICd0ZXh0L3BsYWluJywgaXRlbVVSSVxuXG4gICAgICBpZiBwcm9jZXNzLnBsYXRmb3JtIGlzICdkYXJ3aW4nICMgc2VlICM2OVxuICAgICAgICBpdGVtVVJJID0gXCJmaWxlOi8vI3tpdGVtVVJJfVwiIHVubGVzcyBAdXJpSGFzUHJvdG9jb2woaXRlbVVSSSlcbiAgICAgICAgZXZlbnQuZGF0YVRyYW5zZmVyLnNldERhdGEgJ3RleHQvdXJpLWxpc3QnLCBpdGVtVVJJXG5cbiAgICAgIGlmIGl0ZW0uaXNNb2RpZmllZD8oKSBhbmQgaXRlbS5nZXRUZXh0P1xuICAgICAgICBldmVudC5kYXRhVHJhbnNmZXIuc2V0RGF0YSAnaGFzLXVuc2F2ZWQtY2hhbmdlcycsICd0cnVlJ1xuICAgICAgICBldmVudC5kYXRhVHJhbnNmZXIuc2V0RGF0YSAnbW9kaWZpZWQtdGV4dCcsIGl0ZW0uZ2V0VGV4dCgpXG5cbiAgdXJpSGFzUHJvdG9jb2w6ICh1cmkpIC0+XG4gICAgdHJ5XG4gICAgICByZXF1aXJlKCd1cmwnKS5wYXJzZSh1cmkpLnByb3RvY29sP1xuICAgIGNhdGNoIGVycm9yXG4gICAgICBmYWxzZVxuXG4gIG9uRHJhZ0xlYXZlOiAoZXZlbnQpIC0+XG4gICAgQHJlbW92ZVBsYWNlaG9sZGVyKClcblxuICBvbkRyYWdFbmQ6IChldmVudCkgLT5cbiAgICByZXR1cm4gdW5sZXNzIEB0YWJGb3JFbGVtZW50KGV2ZW50LnRhcmdldClcblxuICAgIEBjbGVhckRyb3BUYXJnZXQoKVxuXG4gIG9uRHJhZ092ZXI6IChldmVudCkgLT5cbiAgICB1bmxlc3MgZXZlbnQuZGF0YVRyYW5zZmVyLmdldERhdGEoJ2F0b20tZXZlbnQnKSBpcyAndHJ1ZSdcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICByZXR1cm5cblxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICBuZXdEcm9wVGFyZ2V0SW5kZXggPSBAZ2V0RHJvcFRhcmdldEluZGV4KGV2ZW50KVxuICAgIHJldHVybiB1bmxlc3MgbmV3RHJvcFRhcmdldEluZGV4P1xuXG4gICAgQHJlbW92ZURyb3BUYXJnZXRDbGFzc2VzKClcblxuICAgIHRhYnMgPSBAZ2V0VGFicygpXG4gICAgcGxhY2Vob2xkZXIgPSBAZ2V0UGxhY2Vob2xkZXIoKVxuICAgIHJldHVybiB1bmxlc3MgcGxhY2Vob2xkZXI/XG5cbiAgICBpZiBuZXdEcm9wVGFyZ2V0SW5kZXggPCB0YWJzLmxlbmd0aFxuICAgICAgdGFiID0gdGFic1tuZXdEcm9wVGFyZ2V0SW5kZXhdXG4gICAgICB0YWIuZWxlbWVudC5jbGFzc0xpc3QuYWRkICdpcy1kcm9wLXRhcmdldCdcbiAgICAgIHRhYi5lbGVtZW50LnBhcmVudEVsZW1lbnQuaW5zZXJ0QmVmb3JlKHBsYWNlaG9sZGVyLCB0YWIuZWxlbWVudClcbiAgICBlbHNlXG4gICAgICBpZiB0YWIgPSB0YWJzW25ld0Ryb3BUYXJnZXRJbmRleCAtIDFdXG4gICAgICAgIHRhYi5lbGVtZW50LmNsYXNzTGlzdC5hZGQgJ2Ryb3AtdGFyZ2V0LWlzLWFmdGVyJ1xuICAgICAgICBpZiBzaWJsaW5nID0gdGFiLmVsZW1lbnQubmV4dFNpYmxpbmdcbiAgICAgICAgICB0YWIuZWxlbWVudC5wYXJlbnRFbGVtZW50Lmluc2VydEJlZm9yZShwbGFjZWhvbGRlciwgc2libGluZylcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHRhYi5lbGVtZW50LnBhcmVudEVsZW1lbnQuYXBwZW5kQ2hpbGQocGxhY2Vob2xkZXIpXG5cbiAgb25Ecm9wT25PdGhlcldpbmRvdzogKGZyb21QYW5lSWQsIGZyb21JdGVtSW5kZXgpIC0+XG4gICAgaWYgQHBhbmUuaWQgaXMgZnJvbVBhbmVJZFxuICAgICAgaWYgaXRlbVRvUmVtb3ZlID0gQHBhbmUuZ2V0SXRlbXMoKVtmcm9tSXRlbUluZGV4XVxuICAgICAgICBAcGFuZS5kZXN0cm95SXRlbShpdGVtVG9SZW1vdmUpXG5cbiAgICBAY2xlYXJEcm9wVGFyZ2V0KClcblxuICBjbGVhckRyb3BUYXJnZXQ6IC0+XG4gICAgQGRyYWdnZWRUYWI/LmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnaXMtZHJhZ2dpbmcnKVxuICAgIEBkcmFnZ2VkVGFiPy51cGRhdGVUb29sdGlwKClcbiAgICBAZHJhZ2dlZFRhYiA9IG51bGxcbiAgICBAcmVtb3ZlRHJvcFRhcmdldENsYXNzZXMoKVxuICAgIEByZW1vdmVQbGFjZWhvbGRlcigpXG5cbiAgb25Ecm9wOiAoZXZlbnQpIC0+XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuXG4gICAgcmV0dXJuIHVubGVzcyBldmVudC5kYXRhVHJhbnNmZXIuZ2V0RGF0YSgnYXRvbS1ldmVudCcpIGlzICd0cnVlJ1xuXG4gICAgZnJvbVdpbmRvd0lkICA9IHBhcnNlSW50KGV2ZW50LmRhdGFUcmFuc2Zlci5nZXREYXRhKCdmcm9tLXdpbmRvdy1pZCcpKVxuICAgIGZyb21QYW5lSWQgICAgPSBwYXJzZUludChldmVudC5kYXRhVHJhbnNmZXIuZ2V0RGF0YSgnZnJvbS1wYW5lLWlkJykpXG4gICAgZnJvbUluZGV4ICAgICA9IHBhcnNlSW50KGV2ZW50LmRhdGFUcmFuc2Zlci5nZXREYXRhKCdzb3J0YWJsZS1pbmRleCcpKVxuICAgIGZyb21QYW5lSW5kZXggPSBwYXJzZUludChldmVudC5kYXRhVHJhbnNmZXIuZ2V0RGF0YSgnZnJvbS1wYW5lLWluZGV4JykpXG5cbiAgICBoYXNVbnNhdmVkQ2hhbmdlcyA9IGV2ZW50LmRhdGFUcmFuc2Zlci5nZXREYXRhKCdoYXMtdW5zYXZlZC1jaGFuZ2VzJykgaXMgJ3RydWUnXG4gICAgbW9kaWZpZWRUZXh0ID0gZXZlbnQuZGF0YVRyYW5zZmVyLmdldERhdGEoJ21vZGlmaWVkLXRleHQnKVxuXG4gICAgdG9JbmRleCA9IEBnZXREcm9wVGFyZ2V0SW5kZXgoZXZlbnQpXG4gICAgdG9QYW5lID0gQHBhbmVcblxuICAgIEBjbGVhckRyb3BUYXJnZXQoKVxuXG4gICAgaWYgZnJvbVdpbmRvd0lkIGlzIEBnZXRXaW5kb3dJZCgpXG4gICAgICBmcm9tUGFuZSA9IEBwYW5lQ29udGFpbmVyLmdldFBhbmVzKClbZnJvbVBhbmVJbmRleF1cbiAgICAgIGlmIGZyb21QYW5lPy5pZCBpc250IGZyb21QYW5lSWRcbiAgICAgICAgIyBJZiBkcmFnZ2luZyBmcm9tIGEgZGlmZmVyZW50IHBhbmUgY29udGFpbmVyLCB3ZSBoYXZlIHRvIGJlIG1vcmVcbiAgICAgICAgIyBleGhhdXN0aXZlIGluIG91ciBzZWFyY2guXG4gICAgICAgIGZyb21QYW5lID0gQXJyYXkuZnJvbSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdhdG9tLXBhbmUnKVxuICAgICAgICAgIC5tYXAgKHBhbmVFbCkgLT4gcGFuZUVsLm1vZGVsXG4gICAgICAgICAgLmZpbmQgKHBhbmUpIC0+IHBhbmUuaWQgaXMgZnJvbVBhbmVJZFxuICAgICAgaXRlbSA9IGZyb21QYW5lLmdldEl0ZW1zKClbZnJvbUluZGV4XVxuICAgICAgQG1vdmVJdGVtQmV0d2VlblBhbmVzKGZyb21QYW5lLCBmcm9tSW5kZXgsIHRvUGFuZSwgdG9JbmRleCwgaXRlbSkgaWYgaXRlbT9cbiAgICBlbHNlXG4gICAgICBkcm9wcGVkVVJJID0gZXZlbnQuZGF0YVRyYW5zZmVyLmdldERhdGEoJ3RleHQvcGxhaW4nKVxuICAgICAgYXRvbS53b3Jrc3BhY2Uub3Blbihkcm9wcGVkVVJJKS50aGVuIChpdGVtKSA9PlxuICAgICAgICAjIE1vdmUgdGhlIGl0ZW0gZnJvbSB0aGUgcGFuZSBpdCB3YXMgb3BlbmVkIG9uIHRvIHRoZSB0YXJnZXQgcGFuZVxuICAgICAgICAjIHdoZXJlIGl0IHdhcyBkcm9wcGVkIG9udG9cbiAgICAgICAgYWN0aXZlUGFuZSA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKVxuICAgICAgICBhY3RpdmVJdGVtSW5kZXggPSBhY3RpdmVQYW5lLmdldEl0ZW1zKCkuaW5kZXhPZihpdGVtKVxuICAgICAgICBAbW92ZUl0ZW1CZXR3ZWVuUGFuZXMoYWN0aXZlUGFuZSwgYWN0aXZlSXRlbUluZGV4LCB0b1BhbmUsIHRvSW5kZXgsIGl0ZW0pXG4gICAgICAgIGl0ZW0uc2V0VGV4dD8obW9kaWZpZWRUZXh0KSBpZiBoYXNVbnNhdmVkQ2hhbmdlc1xuXG4gICAgICAgIGlmIG5vdCBpc05hTihmcm9tV2luZG93SWQpXG4gICAgICAgICAgIyBMZXQgdGhlIHdpbmRvdyB3aGVyZSB0aGUgZHJhZyBzdGFydGVkIGtub3cgdGhhdCB0aGUgdGFiIHdhcyBkcm9wcGVkXG4gICAgICAgICAgYnJvd3NlcldpbmRvdyA9IEBicm93c2VyV2luZG93Rm9ySWQoZnJvbVdpbmRvd0lkKVxuICAgICAgICAgIGJyb3dzZXJXaW5kb3c/LndlYkNvbnRlbnRzLnNlbmQoJ3RhYjpkcm9wcGVkJywgZnJvbVBhbmVJZCwgZnJvbUluZGV4KVxuXG4gICAgICBhdG9tLmZvY3VzKClcblxuICBvbk1vdXNlV2hlZWw6IChldmVudCkgLT5cbiAgICByZXR1cm4gaWYgZXZlbnQuc2hpZnRLZXlcblxuICAgIEB3aGVlbERlbHRhID89IDBcbiAgICBAd2hlZWxEZWx0YSArPSBldmVudC53aGVlbERlbHRhWVxuXG4gICAgaWYgQHdoZWVsRGVsdGEgPD0gLUB0YWJTY3JvbGxpbmdUaHJlc2hvbGRcbiAgICAgIEB3aGVlbERlbHRhID0gMFxuICAgICAgQHBhbmUuYWN0aXZhdGVOZXh0SXRlbSgpXG4gICAgZWxzZSBpZiBAd2hlZWxEZWx0YSA+PSBAdGFiU2Nyb2xsaW5nVGhyZXNob2xkXG4gICAgICBAd2hlZWxEZWx0YSA9IDBcbiAgICAgIEBwYW5lLmFjdGl2YXRlUHJldmlvdXNJdGVtKClcblxuICBvbk1vdXNlRG93bjogKGV2ZW50KSAtPlxuICAgIHRhYiA9IEB0YWJGb3JFbGVtZW50KGV2ZW50LnRhcmdldClcbiAgICByZXR1cm4gdW5sZXNzIHRhYlxuXG4gICAgaWYgZXZlbnQud2hpY2ggaXMgMyBvciAoZXZlbnQud2hpY2ggaXMgMSBhbmQgZXZlbnQuY3RybEtleSBpcyB0cnVlKVxuICAgICAgQHJpZ2h0Q2xpY2tlZFRhYj8uZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdyaWdodC1jbGlja2VkJylcbiAgICAgIEByaWdodENsaWNrZWRUYWIgPSB0YWJcbiAgICAgIEByaWdodENsaWNrZWRUYWIuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdyaWdodC1jbGlja2VkJylcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICBlbHNlIGlmIGV2ZW50LndoaWNoIGlzIDEgYW5kIG5vdCBldmVudC50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdjbG9zZS1pY29uJylcbiAgICAgIEBwYW5lLmFjdGl2YXRlSXRlbSh0YWIuaXRlbSlcbiAgICAgIHNldEltbWVkaWF0ZSA9PiBAcGFuZS5hY3RpdmF0ZSgpIHVubGVzcyBAcGFuZS5pc0Rlc3Ryb3llZCgpXG4gICAgZWxzZSBpZiBldmVudC53aGljaCBpcyAyXG4gICAgICBAcGFuZS5kZXN0cm95SXRlbSh0YWIuaXRlbSlcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcblxuICBvbkRvdWJsZUNsaWNrOiAoZXZlbnQpIC0+XG4gICAgaWYgdGFiID0gQHRhYkZvckVsZW1lbnQoZXZlbnQudGFyZ2V0KVxuICAgICAgdGFiLml0ZW0udGVybWluYXRlUGVuZGluZ1N0YXRlPygpXG4gICAgZWxzZSBpZiBldmVudC50YXJnZXQgaXMgQGVsZW1lbnRcbiAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goQGVsZW1lbnQsICdhcHBsaWNhdGlvbjpuZXctZmlsZScpXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cbiAgdXBkYXRlVGFiU2Nyb2xsaW5nVGhyZXNob2xkOiAtPlxuICAgIEB0YWJTY3JvbGxpbmdUaHJlc2hvbGQgPSBhdG9tLmNvbmZpZy5nZXQoJ3RhYnMudGFiU2Nyb2xsaW5nVGhyZXNob2xkJylcblxuICB1cGRhdGVUYWJTY3JvbGxpbmc6ICh2YWx1ZSkgLT5cbiAgICBpZiB2YWx1ZSBpcyAncGxhdGZvcm0nXG4gICAgICBAdGFiU2Nyb2xsaW5nID0gKHByb2Nlc3MucGxhdGZvcm0gaXMgJ2xpbnV4JylcbiAgICBlbHNlXG4gICAgICBAdGFiU2Nyb2xsaW5nID0gdmFsdWVcbiAgICBAdGFiU2Nyb2xsaW5nVGhyZXNob2xkID0gYXRvbS5jb25maWcuZ2V0KCd0YWJzLnRhYlNjcm9sbGluZ1RocmVzaG9sZCcpXG5cbiAgICBpZiBAdGFiU2Nyb2xsaW5nXG4gICAgICBAZWxlbWVudC5hZGRFdmVudExpc3RlbmVyICdtb3VzZXdoZWVsJywgQG9uTW91c2VXaGVlbC5iaW5kKHRoaXMpXG4gICAgZWxzZVxuICAgICAgQGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lciAnbW91c2V3aGVlbCcsIEBvbk1vdXNlV2hlZWwuYmluZCh0aGlzKVxuXG4gIGJyb3dzZXJXaW5kb3dGb3JJZDogKGlkKSAtPlxuICAgIEJyb3dzZXJXaW5kb3cgPz0gcmVxdWlyZSgnZWxlY3Ryb24nKS5yZW1vdGUuQnJvd3NlcldpbmRvd1xuXG4gICAgQnJvd3NlcldpbmRvdy5mcm9tSWQgaWRcblxuICBtb3ZlSXRlbUJldHdlZW5QYW5lczogKGZyb21QYW5lLCBmcm9tSW5kZXgsIHRvUGFuZSwgdG9JbmRleCwgaXRlbSkgLT5cbiAgICB0cnlcbiAgICAgIGlmIHRvUGFuZSBpcyBmcm9tUGFuZVxuICAgICAgICB0b0luZGV4LS0gaWYgZnJvbUluZGV4IDwgdG9JbmRleFxuICAgICAgICB0b1BhbmUubW92ZUl0ZW0oaXRlbSwgdG9JbmRleClcbiAgICAgIGVsc2VcbiAgICAgICAgQGlzSXRlbU1vdmluZ0JldHdlZW5QYW5lcyA9IHRydWVcbiAgICAgICAgZnJvbVBhbmUubW92ZUl0ZW1Ub1BhbmUoaXRlbSwgdG9QYW5lLCB0b0luZGV4LS0pXG4gICAgICB0b1BhbmUuYWN0aXZhdGVJdGVtKGl0ZW0pXG4gICAgICB0b1BhbmUuYWN0aXZhdGUoKVxuICAgIGZpbmFsbHlcbiAgICAgIEBpc0l0ZW1Nb3ZpbmdCZXR3ZWVuUGFuZXMgPSBmYWxzZVxuXG4gIHJlbW92ZURyb3BUYXJnZXRDbGFzc2VzOiAtPlxuICAgIHdvcmtzcGFjZUVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpXG4gICAgZm9yIGRyb3BUYXJnZXQgaW4gd29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudGFiLWJhciAuaXMtZHJvcC10YXJnZXQnKVxuICAgICAgZHJvcFRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKCdpcy1kcm9wLXRhcmdldCcpXG5cbiAgICBmb3IgZHJvcFRhcmdldCBpbiB3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy50YWItYmFyIC5kcm9wLXRhcmdldC1pcy1hZnRlcicpXG4gICAgICBkcm9wVGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoJ2Ryb3AtdGFyZ2V0LWlzLWFmdGVyJylcblxuICBnZXREcm9wVGFyZ2V0SW5kZXg6IChldmVudCkgLT5cbiAgICB0YXJnZXQgPSBldmVudC50YXJnZXRcblxuICAgIHJldHVybiBpZiBAaXNQbGFjZWhvbGRlcih0YXJnZXQpXG5cbiAgICB0YWJzID0gQGdldFRhYnMoKVxuICAgIHRhYiA9IEB0YWJGb3JFbGVtZW50KHRhcmdldClcbiAgICB0YWIgPz0gdGFic1t0YWJzLmxlbmd0aCAtIDFdXG5cbiAgICByZXR1cm4gMCB1bmxlc3MgdGFiP1xuXG4gICAge2xlZnQsIHdpZHRofSA9IHRhYi5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgZWxlbWVudENlbnRlciA9IGxlZnQgKyB3aWR0aCAvIDJcbiAgICBlbGVtZW50SW5kZXggPSB0YWJzLmluZGV4T2YodGFiKVxuXG4gICAgaWYgZXZlbnQucGFnZVggPCBlbGVtZW50Q2VudGVyXG4gICAgICBlbGVtZW50SW5kZXhcbiAgICBlbHNlXG4gICAgICBlbGVtZW50SW5kZXggKyAxXG5cbiAgZ2V0UGxhY2Vob2xkZXI6IC0+XG4gICAgcmV0dXJuIEBwbGFjZWhvbGRlckVsIGlmIEBwbGFjZWhvbGRlckVsP1xuXG4gICAgQHBsYWNlaG9sZGVyRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlcIilcbiAgICBAcGxhY2Vob2xkZXJFbC5jbGFzc0xpc3QuYWRkKFwicGxhY2Vob2xkZXJcIilcbiAgICBAcGxhY2Vob2xkZXJFbFxuXG4gIHJlbW92ZVBsYWNlaG9sZGVyOiAtPlxuICAgIEBwbGFjZWhvbGRlckVsPy5yZW1vdmUoKVxuICAgIEBwbGFjZWhvbGRlckVsID0gbnVsbFxuXG4gIGlzUGxhY2Vob2xkZXI6IChlbGVtZW50KSAtPlxuICAgIGVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdwbGFjZWhvbGRlcicpXG5cbiAgb25Nb3VzZUVudGVyOiAtPlxuICAgIGZvciB0YWIgaW4gQGdldFRhYnMoKVxuICAgICAge3dpZHRofSA9IHRhYi5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICB0YWIuZWxlbWVudC5zdHlsZS5tYXhXaWR0aCA9IHdpZHRoLnRvRml4ZWQoMikgKyAncHgnXG4gICAgcmV0dXJuXG5cbiAgb25Nb3VzZUxlYXZlOiAtPlxuICAgIHRhYi5lbGVtZW50LnN0eWxlLm1heFdpZHRoID0gJycgZm9yIHRhYiBpbiBAZ2V0VGFicygpXG4gICAgcmV0dXJuXG5cbiAgdGFiRm9yRWxlbWVudDogKGVsZW1lbnQpIC0+XG4gICAgY3VycmVudEVsZW1lbnQgPSBlbGVtZW50XG4gICAgd2hpbGUgY3VycmVudEVsZW1lbnQ/XG4gICAgICBpZiB0YWIgPSBAdGFic0J5RWxlbWVudC5nZXQoY3VycmVudEVsZW1lbnQpXG4gICAgICAgIHJldHVybiB0YWJcbiAgICAgIGVsc2VcbiAgICAgICAgY3VycmVudEVsZW1lbnQgPSBjdXJyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50XG4iXX0=
