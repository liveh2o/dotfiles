(function() {
  var $, BrowserWindow, CompositeDisposable, RendererIpc, TabBarView, TabView, View, _, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BrowserWindow = null;

  RendererIpc = require('ipc');

  _ref = require('atom-space-pen-views'), $ = _ref.$, View = _ref.View;

  CompositeDisposable = require('atom').CompositeDisposable;

  _ = require('underscore-plus');

  TabView = require('./tab-view');

  module.exports = TabBarView = (function(_super) {
    __extends(TabBarView, _super);

    function TabBarView() {
      this.onMouseWheel = __bind(this.onMouseWheel, this);
      this.onDrop = __bind(this.onDrop, this);
      this.onDropOnOtherWindow = __bind(this.onDropOnOtherWindow, this);
      this.onDragOver = __bind(this.onDragOver, this);
      this.onDragEnd = __bind(this.onDragEnd, this);
      this.onDragLeave = __bind(this.onDragLeave, this);
      this.onDragStart = __bind(this.onDragStart, this);
      return TabBarView.__super__.constructor.apply(this, arguments);
    }

    TabBarView.content = function() {
      return this.ul({
        tabindex: -1,
        "class": "list-inline tab-bar inset-panel"
      });
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
      this.on('dragstart', '.sortable', this.onDragStart);
      this.on('dragend', '.sortable', this.onDragEnd);
      this.on('dragleave', this.onDragLeave);
      this.on('dragover', this.onDragOver);
      this.on('drop', this.onDrop);
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
      this.on('mousedown', '.tab', (function(_this) {
        return function(_arg) {
          var ctrlKey, tab, target, which;
          target = _arg.target, which = _arg.which, ctrlKey = _arg.ctrlKey;
          tab = $(target).closest('.tab')[0];
          if (which === 3 || (which === 1 && ctrlKey === true)) {
            _this.find('.right-clicked').removeClass('right-clicked');
            tab.classList.add('right-clicked');
            return false;
          } else if (which === 1 && !target.classList.contains('close-icon')) {
            _this.pane.activateItem(tab.item);
            setImmediate(function() {
              return _this.pane.activate();
            });
            return true;
          } else if (which === 2) {
            _this.pane.destroyItem(tab.item);
            return false;
          }
        };
      })(this));
      this.on('dblclick', (function(_this) {
        return function(_arg) {
          var target;
          target = _arg.target;
          if (target === _this.element) {
            atom.commands.dispatch(_this.element, 'application:new-file');
            return false;
          }
        };
      })(this));
      this.on('click', '.tab .close-icon', (function(_this) {
        return function(_arg) {
          var tab, target;
          target = _arg.target;
          tab = $(target).closest('.tab')[0];
          _this.pane.destroyItem(tab.item);
          return false;
        };
      })(this));
      return RendererIpc.on('tab:dropped', this.onDropOnOtherWindow);
    };

    TabBarView.prototype.unsubscribe = function() {
      RendererIpc.removeListener('tab:dropped', this.onDropOnOtherWindow);
      return this.subscriptions.dispose();
    };

    TabBarView.prototype.handleTreeViewEvents = function() {
      var clearPreviewTabForFile, treeViewSelector;
      treeViewSelector = '.tree-view li[is=tree-view-file]';
      clearPreviewTabForFile = (function(_this) {
        return function(_arg) {
          var itemPath, target, _ref1;
          target = _arg.target;
          if (!_this.pane.isFocused()) {
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
      $(document.body).on('dblclick', treeViewSelector, clearPreviewTabForFile);
      return this.subscriptions.add({
        dispose: function() {
          return $(document.body).off('dblclick', treeViewSelector, clearPreviewTabForFile);
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
        this.element.insertBefore(tab, followingTab);
      } else {
        this.element.appendChild(tab);
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
        return this.element.classList.add('hidden');
      } else {
        return this.element.classList.remove('hidden');
      }
    };

    TabBarView.prototype.getTabs = function() {
      return this.children('.tab').toArray();
    };

    TabBarView.prototype.tabAtIndex = function(index) {
      return this.children(".tab:eq(" + index + ")")[0];
    };

    TabBarView.prototype.tabForItem = function(item) {
      return _.detect(this.getTabs(), function(tab) {
        return tab.item === item;
      });
    };

    TabBarView.prototype.setActiveTab = function(tabView) {
      var _ref1;
      if ((tabView != null) && !tabView.classList.contains('active')) {
        if ((_ref1 = this.element.querySelector('.tab.active')) != null) {
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
        tab = this.children('.right-clicked')[0];
      }
      if (tab != null) {
        return this.pane.destroyItem(tab.item);
      }
    };

    TabBarView.prototype.splitTab = function(fn) {
      var copiedItem, item, _ref1;
      if (item = (_ref1 = this.children('.right-clicked')[0]) != null ? _ref1.item : void 0) {
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
        active = this.children('.right-clicked')[0];
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
        active = this.children('.right-clicked')[0];
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

    TabBarView.prototype.getProcessId = function() {
      return this.processId != null ? this.processId : this.processId = atom.getCurrentWindow().getProcessId();
    };

    TabBarView.prototype.getRoutingId = function() {
      return this.routingId != null ? this.routingId : this.routingId = atom.getCurrentWindow().getRoutingId();
    };

    TabBarView.prototype.shouldAllowDrag = function() {
      return (this.paneContainer.getPanes().length > 1) || (this.pane.getItems().length > 1);
    };

    TabBarView.prototype.onDragStart = function(event) {
      var element, item, itemURI, paneIndex, _ref1, _ref2, _ref3;
      event.originalEvent.dataTransfer.setData('atom-event', 'true');
      element = $(event.target).closest('.sortable');
      element.addClass('is-dragging');
      element[0].destroyTooltip();
      event.originalEvent.dataTransfer.setData('sortable-index', element.index());
      paneIndex = this.paneContainer.getPanes().indexOf(this.pane);
      event.originalEvent.dataTransfer.setData('from-pane-index', paneIndex);
      event.originalEvent.dataTransfer.setData('from-pane-id', this.pane.id);
      event.originalEvent.dataTransfer.setData('from-process-id', this.getProcessId());
      event.originalEvent.dataTransfer.setData('from-routing-id', this.getRoutingId());
      item = this.pane.getItems()[element.index()];
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
        event.originalEvent.dataTransfer.setData('text/plain', itemURI);
        if (process.platform === 'darwin') {
          if (!this.uriHasProtocol(itemURI)) {
            itemURI = "file://" + itemURI;
          }
          event.originalEvent.dataTransfer.setData('text/uri-list', itemURI);
        }
        if ((typeof item.isModified === "function" ? item.isModified() : void 0) && (item.getText != null)) {
          event.originalEvent.dataTransfer.setData('has-unsaved-changes', 'true');
          return event.originalEvent.dataTransfer.setData('modified-text', item.getText());
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
      return this.clearDropTarget();
    };

    TabBarView.prototype.onDragOver = function(event) {
      var element, newDropTargetIndex, sortableObjects, tabBar;
      if (event.originalEvent.dataTransfer.getData('atom-event') !== 'true') {
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
      sortableObjects = tabBar.find(".sortable");
      if (newDropTargetIndex < sortableObjects.length) {
        element = sortableObjects.eq(newDropTargetIndex).addClass('is-drop-target');
        return this.getPlaceholder().insertBefore(element);
      } else {
        element = sortableObjects.eq(newDropTargetIndex - 1).addClass('drop-target-is-after');
        return this.getPlaceholder().insertAfter(element);
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
      var element, _ref1;
      element = this.find(".is-dragging");
      element.removeClass('is-dragging');
      if ((_ref1 = element[0]) != null) {
        _ref1.updateTooltip();
      }
      this.removeDropTargetClasses();
      return this.removePlaceholder();
    };

    TabBarView.prototype.onDrop = function(event) {
      var dataTransfer, droppedURI, fromIndex, fromPane, fromPaneId, fromPaneIndex, fromProcessId, fromRoutingId, hasUnsavedChanges, item, modifiedText, toIndex, toPane;
      event.preventDefault();
      dataTransfer = event.originalEvent.dataTransfer;
      if (dataTransfer.getData('atom-event') !== 'true') {
        return;
      }
      fromProcessId = parseInt(dataTransfer.getData('from-process-id'));
      fromRoutingId = parseInt(dataTransfer.getData('from-routing-id'));
      fromPaneId = parseInt(dataTransfer.getData('from-pane-id'));
      fromIndex = parseInt(dataTransfer.getData('sortable-index'));
      fromPaneIndex = parseInt(dataTransfer.getData('from-pane-index'));
      hasUnsavedChanges = dataTransfer.getData('has-unsaved-changes') === 'true';
      modifiedText = dataTransfer.getData('modified-text');
      toIndex = this.getDropTargetIndex(event);
      toPane = this.pane;
      this.clearDropTarget();
      if (fromProcessId === this.getProcessId()) {
        fromPane = this.paneContainer.getPanes()[fromPaneIndex];
        item = fromPane.getItems()[fromIndex];
        if (item != null) {
          return this.moveItemBetweenPanes(fromPane, fromIndex, toPane, toIndex, item);
        }
      } else {
        droppedURI = dataTransfer.getData('text/plain');
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
            if (!isNaN(fromProcessId) && !isNaN(fromRoutingId)) {
              browserWindow = _this.browserWindowForProcessIdAndRoutingId(fromProcessId, fromRoutingId);
              return browserWindow != null ? browserWindow.webContents.send('tab:dropped', fromPaneId, fromIndex) : void 0;
            }
          };
        })(this));
        return atom.focus();
      }
    };

    TabBarView.prototype.onMouseWheel = function(_arg) {
      var originalEvent;
      originalEvent = _arg.originalEvent;
      if (originalEvent.shiftKey) {
        return;
      }
      if (this.wheelDelta == null) {
        this.wheelDelta = 0;
      }
      this.wheelDelta += originalEvent.wheelDelta;
      if (this.wheelDelta <= -this.tabScrollingThreshold) {
        this.wheelDelta = 0;
        return this.pane.activateNextItem();
      } else if (this.wheelDelta >= this.tabScrollingThreshold) {
        this.wheelDelta = 0;
        return this.pane.activatePreviousItem();
      }
    };

    TabBarView.prototype.updateTabScrollingThreshold = function() {
      return this.tabScrollingThreshold = atom.config.get('tabs.tabScrollingThreshold');
    };

    TabBarView.prototype.updateTabScrolling = function() {
      this.tabScrolling = atom.config.get('tabs.tabScrolling');
      this.tabScrollingThreshold = atom.config.get('tabs.tabScrollingThreshold');
      if (this.tabScrolling) {
        return this.on('wheel', this.onMouseWheel);
      } else {
        return this.off('wheel');
      }
    };

    TabBarView.prototype.browserWindowForProcessIdAndRoutingId = function(processId, routingId) {
      var browserWindow, _i, _len, _ref1;
      if (BrowserWindow == null) {
        BrowserWindow = require('remote').require('browser-window');
      }
      _ref1 = BrowserWindow.getAllWindows();
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        browserWindow = _ref1[_i];
        if (browserWindow.getProcessId() === processId && browserWindow.getRoutingId() === routingId) {
          return browserWindow;
        }
      }
      return null;
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
      var workspaceElement;
      workspaceElement = $(atom.views.getView(atom.workspace));
      workspaceElement.find('.tab-bar .is-drop-target').removeClass('is-drop-target');
      return workspaceElement.find('.tab-bar .drop-target-is-after').removeClass('drop-target-is-after');
    };

    TabBarView.prototype.getDropTargetIndex = function(event) {
      var element, elementCenter, sortables, tabBar, target;
      target = $(event.target);
      tabBar = this.getTabBar(event.target);
      if (this.isPlaceholder(target)) {
        return;
      }
      sortables = tabBar.find('.sortable');
      element = target.closest('.sortable');
      if (element.length === 0) {
        element = sortables.last();
      }
      if (!element.length) {
        return 0;
      }
      elementCenter = element.offset().left + element.width() / 2;
      if (event.originalEvent.pageX < elementCenter) {
        return sortables.index(element);
      } else if (element.next('.sortable').length > 0) {
        return sortables.index(element.next('.sortable'));
      } else {
        return sortables.index(element) + 1;
      }
    };

    TabBarView.prototype.getPlaceholder = function() {
      return this.placeholderEl != null ? this.placeholderEl : this.placeholderEl = $('<li/>', {
        "class": 'placeholder'
      });
    };

    TabBarView.prototype.removePlaceholder = function() {
      var _ref1;
      if ((_ref1 = this.placeholderEl) != null) {
        _ref1.remove();
      }
      return this.placeholderEl = null;
    };

    TabBarView.prototype.isPlaceholder = function(element) {
      return element.is('.placeholder');
    };

    TabBarView.prototype.getTabBar = function(target) {
      target = $(target);
      if (target.is('.tab-bar')) {
        return target;
      } else {
        return target.parents('.tab-bar');
      }
    };

    return TabBarView;

  })(View);

}).call(this);
