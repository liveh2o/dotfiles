(function() {
  var BrowserWindow, CompositeDisposable, TabBarView, TabView, closest, indexOf, ipcRenderer, matches, _, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BrowserWindow = null;

  try {
    ipcRenderer = require('electron').ipcRenderer;
  } catch (_error) {
    ipcRenderer = require('ipc');
  }

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
        return this.pane.moveItem(item, this.pane.getItems().length - 1);
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
      item = tab.item;
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
      try {
        if (BrowserWindow == null) {
          BrowserWindow = require('electron').remote.BrowserWindow;
        }
      } catch (_error) {
        if (BrowserWindow == null) {
          BrowserWindow = require('remote').require('browser-window');
        }
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

    return TabBarView;

  })(HTMLElement);

  module.exports = document.registerElement("atom-tabs", {
    prototype: TabBarView.prototype,
    "extends": "ul"
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RhYnMvbGliL3RhYi1iYXItdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsd0dBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLGFBQUEsR0FBZ0IsSUFBaEIsQ0FBQTs7QUFFQTtBQUFJLElBQUMsY0FBZSxPQUFBLENBQVEsVUFBUixFQUFmLFdBQUQsQ0FBSjtHQUFBLGNBQUE7QUFBa0QsSUFBQSxXQUFBLEdBQWMsT0FBQSxDQUFRLEtBQVIsQ0FBZCxDQUFsRDtHQUZBOztBQUFBLEVBSUEsT0FBOEIsT0FBQSxDQUFRLGdCQUFSLENBQTlCLEVBQUMsZUFBQSxPQUFELEVBQVUsZUFBQSxPQUFWLEVBQW1CLGVBQUEsT0FKbkIsQ0FBQTs7QUFBQSxFQUtDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFMRCxDQUFBOztBQUFBLEVBTUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQU5KLENBQUE7O0FBQUEsRUFPQSxPQUFBLEdBQVUsT0FBQSxDQUFRLFlBQVIsQ0FQVixDQUFBOztBQUFBLEVBU007QUFDSixpQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEseUJBQUEsZUFBQSxHQUFpQixTQUFBLEdBQUE7QUFDZixNQUFBLElBQUMsQ0FBQSxTQUFTLENBQUMsR0FBWCxDQUFlLGFBQWYsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsU0FBUyxDQUFDLEdBQVgsQ0FBZSxTQUFmLENBREEsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLFNBQVMsQ0FBQyxHQUFYLENBQWUsYUFBZixDQUZBLENBQUE7YUFHQSxJQUFDLENBQUEsWUFBRCxDQUFjLFVBQWQsRUFBMEIsQ0FBQSxDQUExQixFQUplO0lBQUEsQ0FBakIsQ0FBQTs7QUFBQSx5QkFNQSxVQUFBLEdBQVksU0FB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

//# sourceURL=/Users/ah/.atom/packages/tabs/lib/tab-bar-view.coffee
