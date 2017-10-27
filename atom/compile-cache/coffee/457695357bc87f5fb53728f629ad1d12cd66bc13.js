(function() {
  var BrowserWindow, CompositeDisposable, RendererIpc, TabBarView, TabView, closest, indexOf, matches, _, _ref,
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
      return RendererIpc.on('tab:dropped', this.onDropOnOtherWindow.bind(this));
    };

    TabBarView.prototype.unsubscribe = function() {
      RendererIpc.removeListener('tab:dropped', this.onDropOnOtherWindow.bind(this));
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RhYnMvbGliL3RhYi1iYXItdmlldy5jb2ZmZWUiCiAgXSwKICAibmFtZXMiOiBbXSwKICAibWFwcGluZ3MiOiAiQUFBQTtBQUFBLE1BQUEsd0dBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFBLGFBQUEsR0FBZ0IsSUFBaEIsQ0FBQTs7QUFBQSxFQUNBLFdBQUEsR0FBYyxPQUFBLENBQVEsS0FBUixDQURkLENBQUE7O0FBQUEsRUFHQSxPQUE4QixPQUFBLENBQVEsZ0JBQVIsQ0FBOUIsRUFBQyxlQUFBLE9BQUQsRUFBVSxlQUFBLE9BQVYsRUFBbUIsZUFBQSxPQUhuQixDQUFBOztBQUFBLEVBSUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUpELENBQUE7O0FBQUEsRUFLQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBTEosQ0FBQTs7QUFBQSxFQU1BLE9BQUEsR0FBVSxPQUFBLENBQVEsWUFBUixDQU5WLENBQUE7O0FBQUEsRUFRTTtBQUNKLGlDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSx5QkFBQSxlQUFBLEdBQWlCLFNBQUEsR0FBQTtBQUNmLE1BQUEsSUFBQyxDQUFBLFNBQVMsQ0FBQyxHQUFYLENBQWUsYUFBZixDQUFBLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxTQUFTLENBQUMsR0FBWCxDQUFlLFNBQWYsQ0FEQSxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsU0FBUyxDQUFDLEdBQVgsQ0FBZSxhQUFmLENBRkEsQ0FBQTthQUdBLElBQUMsQ0FBQSxZQUFELENBQWMsVUFBZCxFQUEwQixDQUFBLENBQTFCLEVBSmU7SUFBQSxDQUFqQixDQUFBOztBQUFBLHlCQU1BLFVBQUEsR0FBWSxTQUFFLElBQUYsRUFBUSxLQUFSLEdBQUE7QUFDVixVQUFBLHlDQUFBO0FBQUEsTUFEVyxJQUFDLENBQUEsT0FBQSxJQUNa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

//# sourceURL=/Users/ah/.atom/packages/tabs/lib/tab-bar-view.coffee
