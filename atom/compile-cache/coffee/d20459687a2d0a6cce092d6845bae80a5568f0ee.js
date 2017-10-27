(function() {
  var BrowserWindow, CompositeDisposable, TabBarView, TabView, closest, indexOf, ipcRenderer, matches, _, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BrowserWindow = null;

  ipcRenderer = require('electron').ipcRenderer;

  _ref = require('./html-helpers'), matches = _ref.matches, closest = _ref.closest, indexOf = _ref.indexOf;

  CompositeDisposable = require('atom').CompositeDisposable;

  _ = require('underscore-plus');

  TabView = require('./tab-view');

  TabBarView = (function(_super) {
    __extends(TabBarView, _super);

    function TabBarView() {
      return TabBarView.__super__.constructor.apply(this, arguments);
    }

    TabBarView.prototype.createdCallback = function() {
      this.classList.add("list-inline");
      this.classList.add("tab-bar");
      this.classList.add("inset-panel");
      return this.setAttribute("tabindex", -1);
    };

    TabBarView.prototype.initialize = function(pane) {
      var addElementCommands, item, _i, _len, _ref1;
      this.pane = pane;
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
          return _this.subscriptions.add(atom.commands.add(_this, commandsWithPropagationStopped));
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
      this.addEventListener("mouseenter", this.onMouseEnter);
      this.addEventListener("mouseleave", this.onMouseLeave);
      this.addEventListener("dragstart", this.onDragStart);
      this.addEventListener("dragend", this.onDragEnd);
      this.addEventListener("dragleave", this.onDragLeave);
      this.addEventListener("dragover", this.onDragOver);
      this.addEventListener("drop", this.onDrop);
      this.paneContainer = this.pane.getContainer();
      _ref1 = this.pane.getItems();
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        item = _ref1[_i];
        this.addTabForItem(item);
      }
      this.subscriptions.add(this.pane.onDidDestroy((function(_this) {
        return function() {
          return _this.unsubscribe();
        };
      })(this)));
      this.subscriptions.add(this.pane.onDidAddItem((function(_this) {
        return function(_arg) {
          var index, item;
          item = _arg.item, index = _arg.index;
          return _this.addTabForItem(item, index);
        };
      })(this)));
      this.subscriptions.add(this.pane.onDidMoveItem((function(_this) {
        return function(_arg) {
          var item, newIndex;
          item = _arg.item, newIndex = _arg.newIndex;
          return _this.moveItemTabToIndex(item, newIndex);
        };
      })(this)));
      this.subscriptions.add(this.pane.onDidRemoveItem((function(_this) {
        return function(_arg) {
          var item;
          item = _arg.item;
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
      this.addEventListener("mousedown", this.onMouseDown);
      this.addEventListener("dblclick", this.onDoubleClick);
      this.addEventListener("click", this.onClick);
      this.onDropOnOtherWindow = this.onDropOnOtherWindow.bind(this);
      return ipcRenderer.on('tab:dropped', this.onDropOnOtherWindow);
    };

    TabBarView.prototype.unsubscribe = function() {
      ipcRenderer.removeListener('tab:dropped', this.onDropOnOtherWindow);
      return this.subscriptions.dispose();
    };

    TabBarView.prototype.terminatePendingStates = function() {
      var tab, _i, _len, _ref1;
      _ref1 = this.getTabs();
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        tab = _ref1[_i];
        if (typeof tab.terminatePendingState === "function") {
          tab.terminatePendingState();
        }
      }
    };

    TabBarView.prototype.addTabForItem = function(item, index) {
      var tabView;
      tabView = new TabView();
      tabView.initialize(item, this.pane);
      if (this.isItemMovingBetweenPanes) {
        tabView.terminatePendingState();
      }
      this.insertTabAtIndex(tabView, index);
      if (atom.config.get('tabs.addNewTabsAtEnd')) {
        if (!this.isItemMovingBetweenPanes) {
          return this.pane.moveItem(item, this.pane.getItems().length - 1);
        }
      }
    };

    TabBarView.prototype.moveItemTabToIndex = function(item, index) {
      var tab;
      if (tab = this.tabForItem(item)) {
        tab.remove();
        return this.insertTabAtIndex(tab, index);
      }
    };

    TabBarView.prototype.insertTabAtIndex = function(tab, index) {
      var followingTab;
      if (index != null) {
        followingTab = this.tabAtIndex(index);
      }
      if (followingTab) {
        this.insertBefore(tab, followingTab);
      } else {
        this.appendChild(tab);
      }
      tab.updateTitle();
      return this.updateTabBarVisibility();
    };

    TabBarView.prototype.removeTabForItem = function(item) {
      var tab, _i, _len, _ref1, _ref2;
      if ((_ref1 = this.tabForItem(item)) != null) {
        _ref1.destroy();
      }
      _ref2 = this.getTabs();
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        tab = _ref2[_i];
        tab.updateTitle();
      }
      return this.updateTabBarVisibility();
    };

    TabBarView.prototype.scrollToTab = function(tab) {
      var tabBarRightEdge, tabRightEdge;
      tabRightEdge = tab.offsetLeft + tab.clientWidth;
      tabBarRightEdge = this.scrollLeft + this.clientWidth;
      if (tabRightEdge > tabBarRightEdge) {
        return this.scrollLeft = tabRightEdge - this.clientWidth;
      } else if (this.scrollLeft > tab.offsetLeft) {
        return this.scrollLeft = tab.offsetLeft;
      }
    };

    TabBarView.prototype.updateTabBarVisibility = function() {
      if (!atom.config.get('tabs.alwaysShowTabBar') && !this.shouldAllowDrag()) {
        return this.classList.add('hidden');
      } else {
        return this.classList.remove('hidden');
      }
    };

    TabBarView.prototype.getTabs = function() {
      var tab, _i, _len, _ref1, _results;
      _ref1 = this.querySelectorAll(".tab");
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        tab = _ref1[_i];
        _results.push(tab);
      }
      return _results;
    };

    TabBarView.prototype.tabAtIndex = function(index) {
      return this.querySelectorAll(".tab")[index];
    };

    TabBarView.prototype.tabForItem = function(item) {
      return _.detect(this.getTabs(), function(tab) {
        return tab.item === item;
      });
    };

    TabBarView.prototype.setActiveTab = function(tabView) {
      var _ref1;
      if ((tabView != null) && !tabView.classList.contains('active')) {
        if ((_ref1 = this.querySelector('.tab.active')) != null) {
          _ref1.classList.remove('active');
        }
        tabView.classList.add('active');
        return this.scrollToTab(tabView);
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
        tab = this.querySelector('.right-clicked');
      }
      if (tab != null) {
        return this.pane.destroyItem(tab.item);
      }
    };

    TabBarView.prototype.openInNewWindow = function(tab) {
      var item, itemURI, pathsToOpen;
      if (tab == null) {
        tab = this.querySelector('.right-clicked');
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
      var copiedItem, item, _ref1;
      if (item = (_ref1 = this.querySelector('.right-clicked')) != null ? _ref1.item : void 0) {
        if (copiedItem = this.copyItem(item)) {
          return this.pane[fn]({
            items: [copiedItem]
          });
        }
      }
    };

    TabBarView.prototype.copyItem = function(item) {
      var _ref1;
      return (_ref1 = typeof item.copy === "function" ? item.copy() : void 0) != null ? _ref1 : atom.deserializers.deserialize(item.serialize());
    };

    TabBarView.prototype.closeOtherTabs = function(active) {
      var tab, tabs, _i, _len, _results;
      tabs = this.getTabs();
      if (active == null) {
        active = this.querySelector('.right-clicked');
      }
      if (active == null) {
        return;
      }
      _results = [];
      for (_i = 0, _len = tabs.length; _i < _len; _i++) {
        tab = tabs[_i];
        if (tab !== active) {
          _results.push(this.closeTab(tab));
        }
      }
      return _results;
    };

    TabBarView.prototype.closeTabsToRight = function(active) {
      var i, index, tab, tabs, _i, _len, _results;
      tabs = this.getTabs();
      if (active == null) {
        active = this.querySelector('.right-clicked');
      }
      index = tabs.indexOf(active);
      if (index === -1) {
        return;
      }
      _results = [];
      for (i = _i = 0, _len = tabs.length; _i < _len; i = ++_i) {
        tab = tabs[i];
        if (i > index) {
          _results.push(this.closeTab(tab));
        }
      }
      return _results;
    };

    TabBarView.prototype.closeTabsToLeft = function(active) {
      var i, index, tab, tabs, _i, _len, _results;
      tabs = this.getTabs();
      if (active == null) {
        active = this.querySelector('.right-clicked');
      }
      index = tabs.indexOf(active);
      if (index === -1) {
        return;
      }
      _results = [];
      for (i = _i = 0, _len = tabs.length; _i < _len; i = ++_i) {
        tab = tabs[i];
        if (i < index) {
          _results.push(this.closeTab(tab));
        }
      }
      return _results;
    };

    TabBarView.prototype.closeSavedTabs = function() {
      var tab, _base, _i, _len, _ref1, _results;
      _ref1 = this.getTabs();
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        tab = _ref1[_i];
        if (!(typeof (_base = tab.item).isModified === "function" ? _base.isModified() : void 0)) {
          _results.push(this.closeTab(tab));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    TabBarView.prototype.closeAllTabs = function() {
      var tab, _i, _len, _ref1, _results;
      _ref1 = this.getTabs();
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        tab = _ref1[_i];
        _results.push(this.closeTab(tab));
      }
      return _results;
    };

    TabBarView.prototype.getWindowId = function() {
      return this.windowId != null ? this.windowId : this.windowId = atom.getCurrentWindow().id;
    };

    TabBarView.prototype.shouldAllowDrag = function() {
      return (this.paneContainer.getPanes().length > 1) || (this.pane.getItems().length > 1);
    };

    TabBarView.prototype.onDragStart = function(event) {
      var element, item, itemURI, paneIndex, _ref1, _ref2, _ref3;
      if (!matches(event.target, '.sortable')) {
        return;
      }
      event.dataTransfer.setData('atom-event', 'true');
      element = closest(event.target, '.sortable');
      element.classList.add('is-dragging');
      element.destroyTooltip();
      event.dataTransfer.setData('sortable-index', indexOf(element));
      paneIndex = this.paneContainer.getPanes().indexOf(this.pane);
      event.dataTransfer.setData('from-pane-index', paneIndex);
      event.dataTransfer.setData('from-pane-id', this.pane.id);
      event.dataTransfer.setData('from-window-id', this.getWindowId());
      item = this.pane.getItems()[indexOf(element)];
      if (item == null) {
        return;
      }
      if (typeof item.getURI === 'function') {
        itemURI = (_ref1 = item.getURI()) != null ? _ref1 : '';
      } else if (typeof item.getPath === 'function') {
        itemURI = (_ref2 = item.getPath()) != null ? _ref2 : '';
      } else if (typeof item.getUri === 'function') {
        itemURI = (_ref3 = item.getUri()) != null ? _ref3 : '';
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
      } catch (_error) {
        error = _error;
        return false;
      }
    };

    TabBarView.prototype.onDragLeave = function(event) {
      return this.removePlaceholder();
    };

    TabBarView.prototype.onDragEnd = function(event) {
      if (!matches(event.target, '.sortable')) {
        return;
      }
      return this.clearDropTarget();
    };

    TabBarView.prototype.onDragOver = function(event) {
      var element, newDropTargetIndex, placeholder, sibling, sortableObjects, tabBar;
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
      tabBar = this.getTabBar(event.target);
      sortableObjects = tabBar.querySelectorAll(".sortable");
      placeholder = this.getPlaceholder();
      if (placeholder == null) {
        return;
      }
      if (newDropTargetIndex < sortableObjects.length) {
        element = sortableObjects[newDropTargetIndex];
        element.classList.add('is-drop-target');
        return element.parentElement.insertBefore(placeholder, element);
      } else {
        if (element = sortableObjects[newDropTargetIndex - 1]) {
          element.classList.add('drop-target-is-after');
          if (sibling = element.nextSibling) {
            return element.parentElement.insertBefore(placeholder, sibling);
          } else {
            return element.parentElement.appendChild(placeholder);
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
      var element;
      element = this.querySelector(".is-dragging");
      if (element != null) {
        element.classList.remove('is-dragging');
      }
      if (element != null) {
        element.updateTooltip();
      }
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
      var tab, _ref1;
      if (!matches(event.target, ".tab")) {
        return;
      }
      tab = closest(event.target, '.tab');
      if (event.which === 3 || (event.which === 1 && event.ctrlKey === true)) {
        if ((_ref1 = this.querySelector('.right-clicked')) != null) {
          _ref1.classList.remove('right-clicked');
        }
        tab.classList.add('right-clicked');
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
      var tab, _base;
      if (tab = closest(event.target, '.tab')) {
        return typeof (_base = tab.item).terminatePendingState === "function" ? _base.terminatePendingState() : void 0;
      } else if (event.target === this) {
        atom.commands.dispatch(this, 'application:new-file');
        return event.preventDefault();
      }
    };

    TabBarView.prototype.onClick = function(event) {
      var tab;
      if (!matches(event.target, ".tab .close-icon")) {
        return;
      }
      tab = closest(event.target, '.tab');
      this.pane.destroyItem(tab.item);
      return false;
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
        return this.addEventListener('mousewheel', this.onMouseWheel);
      } else {
        return this.removeEventListener('mousewheel', this.onMouseWheel);
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
      var dropTarget, workspaceElement, _i, _j, _len, _len1, _ref1, _ref2, _results;
      workspaceElement = atom.views.getView(atom.workspace);
      _ref1 = workspaceElement.querySelectorAll('.tab-bar .is-drop-target');
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        dropTarget = _ref1[_i];
        dropTarget.classList.remove('is-drop-target');
      }
      _ref2 = workspaceElement.querySelectorAll('.tab-bar .drop-target-is-after');
      _results = [];
      for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
        dropTarget = _ref2[_j];
        _results.push(dropTarget.classList.remove('drop-target-is-after'));
      }
      return _results;
    };

    TabBarView.prototype.getDropTargetIndex = function(event) {
      var element, elementCenter, elementIndex, left, sortables, tabBar, target, width, _ref1;
      target = event.target;
      tabBar = this.getTabBar(target);
      if (this.isPlaceholder(target)) {
        return;
      }
      sortables = tabBar.querySelectorAll(".sortable");
      element = closest(target, '.sortable');
      if (element == null) {
        element = sortables[sortables.length - 1];
      }
      if (element == null) {
        return 0;
      }
      _ref1 = element.getBoundingClientRect(), left = _ref1.left, width = _ref1.width;
      elementCenter = left + width / 2;
      elementIndex = indexOf(element, sortables);
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
      var _ref1;
      if ((_ref1 = this.placeholderEl) != null) {
        _ref1.remove();
      }
      return this.placeholderEl = null;
    };

    TabBarView.prototype.isPlaceholder = function(element) {
      return element.classList.contains('placeholder');
    };

    TabBarView.prototype.getTabBar = function(target) {
      if (target.classList.contains('tab-bar')) {
        return target;
      } else {
        return closest(target, '.tab-bar');
      }
    };

    TabBarView.prototype.onMouseEnter = function() {
      var tab, width, _i, _len, _ref1;
      _ref1 = this.getTabs();
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        tab = _ref1[_i];
        width = tab.getBoundingClientRect().width;
        tab.style.maxWidth = width.toFixed(2) + 'px';
      }
    };

    TabBarView.prototype.onMouseLeave = function() {
      var tab, _i, _len, _ref1;
      _ref1 = this.getTabs();
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        tab = _ref1[_i];
        tab.style.maxWidth = '';
      }
    };

    return TabBarView;

  })(HTMLElement);

  module.exports = document.registerElement("atom-tabs", {
    prototype: TabBarView.prototype,
    "extends": "ul"
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RhYnMvbGliL3RhYi1iYXItdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsd0dBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLGFBQUEsR0FBZ0IsSUFBaEIsQ0FBQTs7QUFBQSxFQUNDLGNBQWUsT0FBQSxDQUFRLFVBQVIsRUFBZixXQURELENBQUE7O0FBQUEsRUFHQSxPQUE4QixPQUFBLENBQVEsZ0JBQVIsQ0FBOUIsRUFBQyxlQUFBLE9BQUQsRUFBVSxlQUFBLE9BQVYsRUFBbUIsZUFBQSxPQUhuQixDQUFBOztBQUFBLEVBSUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUpELENBQUE7O0FBQUEsRUFLQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBTEosQ0FBQTs7QUFBQSxFQU1BLE9BQUEsR0FBVSxPQUFBLENBQVEsWUFBUixDQU5WLENBQUE7O0FBQUEsRUFRTTtBQUNKLGlDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSx5QkFBQSxlQUFBLEdBQWlCLFNBQUEsR0FBQTtBQUNmLE1BQUEsSUFBQyxDQUFBLFNBQVMsQ0FBQyxHQUFYLENBQWUsYUFBZixDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxTQUFTLENBQUMsR0FBWCxDQUFlLFNBQWYsQ0FEQSxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsU0FBUyxDQUFDLEdBQVgsQ0FBZSxhQUFmLENBRkEsQ0FBQTthQUdBLElBQUMsQ0FBQSxZQUFELENBQWMsVUFBZCxFQUEwQixDQUFBLENBQTFCLEVBSmU7SUFBQSxDQUFqQixDQUFBOztBQUFBLHlCQU1BLFVBQUEsR0FBWSxTQUFFLElBQUYsR0FBQTtBQUNWLFVBQUEseUNBQUE7QUFBQSxNQURXLElBQUMsQ0FBQSxPQUFBLElBQ1osQ0FBQTtBQUFB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

//# sourceURL=/Users/ah/.atom/packages/tabs/lib/tab-bar-view.coffee
