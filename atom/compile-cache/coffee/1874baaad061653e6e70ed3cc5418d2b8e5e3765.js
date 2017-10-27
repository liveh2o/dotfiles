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

    TabBarView.prototype.initialize = function(pane) {
      var item, _i, _len, _ref1;
      this.pane = pane;
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.commands.add(this.element, {
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
      }));
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
        return function() {
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
      this.on('click', '.tab', (function(_this) {
        return function(_arg) {
          var tab, target, which;
          target = _arg.target, which = _arg.which;
          tab = $(target).closest('.tab')[0];
          if (which === 1 && !target.classList.contains('close-icon')) {
            _this.pane.activateItem(tab.item);
            _this.pane.activate();
            return false;
          }
        };
      })(this));
      return RendererIpc.on('tab:dropped', this.onDropOnOtherWindow);
    };

    TabBarView.prototype.unsubscribe = function() {
      RendererIpc.removeListener('tab:dropped', this.onDropOnOtherWindow);
      return this.subscriptions.dispose();
    };

    TabBarView.prototype.addTabForItem = function(item, index) {
      var tabView;
      tabView = new TabView();
      tabView.initialize(item);
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

    TabBarView.prototype.updateActiveTab = function() {
      return this.setActiveTab(this.tabForItem(this.pane.getActiveItem()));
    };

    TabBarView.prototype.closeTab = function(tab) {
      if (tab == null) {
        tab = this.children('.right-clicked')[0];
      }
      return this.pane.destroyItem(tab.item);
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

    TabBarView.prototype.closeOtherTabs = function() {
      var active, tab, tabs, _i, _len, _results;
      tabs = this.getTabs();
      active = this.children('.right-clicked')[0];
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

    TabBarView.prototype.closeTabsToRight = function() {
      var active, i, index, tab, tabs, _i, _len, _results;
      tabs = this.getTabs();
      active = this.children('.right-clicked')[0];
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
      if (toPane === fromPane) {
        if (fromIndex < toIndex) {
          toIndex--;
        }
        toPane.moveItem(item, toIndex);
      } else {
        fromPane.moveItemToPane(item, toPane, toIndex--);
      }
      toPane.activateItem(item);
      return toPane.activate();
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNGQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUEsYUFBQSxHQUFnQixJQUFoQixDQUFBOztBQUFBLEVBQ0EsV0FBQSxHQUFjLE9BQUEsQ0FBUSxLQUFSLENBRGQsQ0FBQTs7QUFBQSxFQUdBLE9BQVksT0FBQSxDQUFRLHNCQUFSLENBQVosRUFBQyxTQUFBLENBQUQsRUFBSSxZQUFBLElBSEosQ0FBQTs7QUFBQSxFQUlDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFKRCxDQUFBOztBQUFBLEVBS0EsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQUxKLENBQUE7O0FBQUEsRUFNQSxPQUFBLEdBQVUsT0FBQSxDQUFRLFlBQVIsQ0FOVixDQUFBOztBQUFBLEVBUUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLGlDQUFBLENBQUE7Ozs7Ozs7Ozs7O0tBQUE7O0FBQUEsSUFBQSxVQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxFQUFELENBQUk7QUFBQSxRQUFBLFFBQUEsRUFBVSxDQUFBLENBQVY7QUFBQSxRQUFjLE9BQUEsRUFBTyxpQ0FBckI7T0FBSixFQURRO0lBQUEsQ0FBVixDQUFBOztBQUFBLHlCQUdBLFVBQUEsR0FBWSxTQUFFLElBQUYsR0FBQTtBQUNWLFVBQUEscUJBQUE7QUFBQSxNQURXLElBQUMsQ0FBQSxPQUFBLElBQ1osQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLGFBQUQsR0FBaUIsR0FBQSxDQUFBLG1CQUFqQixDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLElBQUMsQ0FBQSxPQUFuQixFQUNqQjtBQUFBLFFBQUEsZ0JBQUEsRUFB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
//# sourceURL=/Users/ah/.atom/packages/tabs/lib/tab-bar-view.coffee