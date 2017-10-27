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
        return tabView.classList.add('active');
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
