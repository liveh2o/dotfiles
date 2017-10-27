(function() {
  var BrowserWindow, CompositeDisposable, RendererIpc, TabBarView, TabView, closest, indexOf, matches, _, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BrowserWindow = null;

  RendererIpc = require('ipc');

  _ref = require('./html-helpers'), matches = _ref.matches, closest = _ref.closest, indexOf = _ref.indexOf;

  CompositeDisposable = require('atom').CompositeDisposable;

  _ = require('underscore-plus');

  TabView = require('./tab-view');

  TabBarView = (function(_super) {
    __extends(TabBarView, _super);

    function TabBarView() {
      this.onClick = __bind(this.onClick, this);
      this.onDoubleClick = __bind(this.onDoubleClick, this);
      this.onMouseDown = __bind(this.onMouseDown, this);
      this.onMouseWheel = __bind(this.onMouseWheel, this);
      this.onDrop = __bind(this.onDrop, this);
      this.onDropOnOtherWindow = __bind(this.onDropOnOtherWindow, this);
      this.onDragOver = __bind(this.onDragOver, this);
      this.onDragEnd = __bind(this.onDragEnd, this);
      this.onDragLeave = __bind(this.onDragLeave, this);
      this.onDragStart = __bind(this.onDragStart, this);
      return TabBarView.__super__.constructor.apply(this, arguments);
    }

    TabBarView.prototype.createdCallback = function() {
      this.classList.add("list-inline");
      this.classList.add("tab-bar");
      this.classList.add("inset-panel");
      return this.setAttribute("tabindex", -1);
    };

    TabBarView.prototype.initialize = function(pane, state) {
      var addElementCommands, item, _i, _len, _ref1;
      this.pane = pane;
      if (state == null) {
        state = {};
      }
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.commands.add(atom.views.getView(this.pane), {
        'tabs:keep-preview-tab': (function(_this) {
          return function() {
            return _this.clearPreviewTabs();
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
      this.setInitialPreviewTab(state.previewTabURI);
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
          _this.destroyPreviousPreviewTab();
          return _this.updateActiveTab();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('tabs.tabScrolling', (function(_this) {
        return function() {
          return _this.updateTabScrolling();
        };
      })(this)));
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
      this.handleTreeViewEvents();
      this.updateActiveTab();
      this.addEventListener("mousedown", this.onMouseDown);
      this.addEventListener("dblclick", this.onDoubleClick);
      this.addEventListener("click", this.onClick);
      return RendererIpc.on('tab:dropped', this.onDropOnOtherWindow);
    };

    TabBarView.prototype.unsubscribe = function() {
      RendererIpc.removeListener('tab:dropped', this.onDropOnOtherWindow);
      return this.subscriptions.dispose();
    };

    TabBarView.prototype.handleTreeViewEvents = function() {
      var clearPreviewTabForFile, treeViewSelector;
      treeViewSelector = '.tree-view .entry.file';
      clearPreviewTabForFile = (function(_this) {
        return function(_arg) {
          var itemPath, target, _ref1;
          target = _arg.target;
          if (!_this.pane.isFocused()) {
            return;
          }
          if (!matches(target, treeViewSelector)) {
            return;
          }
          if (!target.dataset.path) {
            target = target.querySelector('[data-path]');
          }
          if (itemPath = target.dataset.path) {
            return (_ref1 = _this.tabForItem(_this.pane.itemForURI(itemPath))) != null ? _ref1.clearPreview() : void 0;
          }
        };
      })(this);
      document.body.addEventListener('dblclick', clearPreviewTabForFile);
      return this.subscriptions.add({
        dispose: function() {
          return document.body.removeEventListener('dblclick', clearPreviewTabForFile);
        }
      });
    };

    TabBarView.prototype.setInitialPreviewTab = function(previewTabURI) {
      var tab, _i, _len, _ref1;
      _ref1 = this.getTabs();
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        tab = _ref1[_i];
        if (tab.isPreviewTab) {
          if (tab.item.getURI() !== previewTabURI) {
            tab.clearPreview();
          }
        }
      }
    };

    TabBarView.prototype.getPreviewTabURI = function() {
      var tab, _i, _len, _ref1;
      _ref1 = this.getTabs();
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        tab = _ref1[_i];
        if (tab.isPreviewTab) {
          return tab.item.getURI();
        }
      }
    };

    TabBarView.prototype.clearPreviewTabs = function() {
      var tab, _i, _len, _ref1;
      _ref1 = this.getTabs();
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        tab = _ref1[_i];
        tab.clearPreview();
      }
    };

    TabBarView.prototype.storePreviewTabToDestroy = function() {
      var tab, _i, _len, _ref1;
      _ref1 = this.getTabs();
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        tab = _ref1[_i];
        if (tab.isPreviewTab) {
          this.previewTabToDestroy = tab;
        }
      }
    };

    TabBarView.prototype.destroyPreviousPreviewTab = function() {
      var _ref1;
      if ((_ref1 = this.previewTabToDestroy) != null ? _ref1.isPreviewTab : void 0) {
        this.pane.destroyItem(this.previewTabToDestroy.item);
      }
      return this.previewTabToDestroy = null;
    };

    TabBarView.prototype.addTabForItem = function(item, index) {
      var tabView;
      tabView = new TabView();
      tabView.initialize(item);
      if (this.isItemMovingBetweenPanes) {
        tabView.clearPreview();
      }
      if (tabView.isPreviewTab) {
        this.storePreviewTabToDestroy();
      }
      return this.insertTabAtIndex(tabView, index);
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
            return _this.pane.activate();
          };
        })(this));
      } else if (event.which === 2) {
        this.pane.destroyItem(tab.item);
        return event.preventDefault();
      }
    };

    TabBarView.prototype.onDoubleClick = function(event) {
      if (event.target === this) {
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

    TabBarView.prototype.updateTabScrolling = function() {
      this.tabScrolling = atom.config.get('tabs.tabScrolling');
      this.tabScrollingThreshold = atom.config.get('tabs.tabScrollingThreshold');
      if (this.tabScrolling) {
        return this.addEventListener('mousewheel', this.onMouseWheel);
      } else {
        return this.removeEventListener('mousewheel', this.onMouseWheel);
      }
    };

    TabBarView.prototype.browserWindowForId = function(id) {
      if (BrowserWindow == null) {
        BrowserWindow = require('remote').require('browser-window');
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RhYnMvbGliL3RhYi1iYXItdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsd0dBQUE7SUFBQTs7bVNBQUE7O0FBQUEsRUFBQSxhQUFBLEdBQWdCLElBQWhCLENBQUE7O0FBQUEsRUFDQSxXQUFBLEdBQWMsT0FBQSxDQUFRLEtBQVIsQ0FEZCxDQUFBOztBQUFBLEVBR0EsT0FBOEIsT0FBQSxDQUFRLGdCQUFSLENBQTlCLEVBQUMsZUFBQSxPQUFELEVBQVUsZUFBQSxPQUFWLEVBQW1CLGVBQUEsT0FIbkIsQ0FBQTs7QUFBQSxFQUlDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFKRCxDQUFBOztBQUFBLEVBS0EsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQUxKLENBQUE7O0FBQUEsRUFNQSxPQUFBLEdBQVUsT0FBQSxDQUFRLFlBQVIsQ0FOVixDQUFBOztBQUFBLEVBUU07QUFDSixpQ0FBQSxDQUFBOzs7Ozs7Ozs7Ozs7OztLQUFBOztBQUFBLHlCQUFBLGVBQUEsR0FBaUIsU0FBQSxHQUFBO0FBQ2YsTUFBQSxJQUFDLENBQUEsU0FBUyxDQUFDLEdBQVgsQ0FBZSxhQUFmLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFNBQVMsQ0FBQyxHQUFYLENBQWUsU0FBZixDQURBLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxTQUFTLENBQUMsR0FBWCxDQUFlLGFBQWYsQ0FGQSxDQUFBO2FBR0EsSUFBQyxDQUFBLFlBQUQsQ0FBYyxVQUFkLEVBQTBCLENBQUEsQ0FBMUIsRUFKZTtJQUFBLENBQWpCLENBQUE7O0FBQUEseUJBTUEsVUFBQSxHQUFZLFNBQUUsSUFBRixFQUFRLEtBQVIsR0FBQTtBQUNWLFVBQUEseUNBQUE7QUFBQSxNQURXLElBQUMsQ0FB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

//# sourceURL=/Users/ah/.atom/packages/tabs/lib/tab-bar-view.coffee
