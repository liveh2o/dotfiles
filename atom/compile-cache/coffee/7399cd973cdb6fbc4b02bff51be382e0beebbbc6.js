(function() {
  var $, BrowserWindow, RendererIpc, TabBarView, TabView, View, _, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BrowserWindow = null;

  RendererIpc = require('ipc');

  _ref = require('atom'), $ = _ref.$, View = _ref.View;

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
      this.command('tabs:close-tab', (function(_this) {
        return function() {
          return _this.closeTab();
        };
      })(this));
      this.command('tabs:close-other-tabs', (function(_this) {
        return function() {
          return _this.closeOtherTabs();
        };
      })(this));
      this.command('tabs:close-tabs-to-right', (function(_this) {
        return function() {
          return _this.closeTabsToRight();
        };
      })(this));
      this.command('tabs:close-saved-tabs', (function(_this) {
        return function() {
          return _this.closeSavedTabs();
        };
      })(this));
      this.command('tabs:close-all-tabs', (function(_this) {
        return function() {
          return _this.closeAllTabs();
        };
      })(this));
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
      this.subscribe(this.paneContainer, 'pane:removed', (function(_this) {
        return function(e, pane) {
          if (pane === _this.pane) {
            return _this.unsubscribe();
          }
        };
      })(this));
      this.subscribe(this.pane, 'pane:item-added', (function(_this) {
        return function(e, item, index) {
          _this.addTabForItem(item, index);
          return true;
        };
      })(this));
      this.subscribe(this.pane, 'pane:item-moved', (function(_this) {
        return function(e, item, index) {
          _this.moveItemTabToIndex(item, index);
          return true;
        };
      })(this));
      this.subscribe(this.pane, 'pane:item-removed', (function(_this) {
        return function(e, item) {
          _this.removeTabForItem(item);
          return true;
        };
      })(this));
      this.subscribe(this.pane, 'pane:active-item-changed', (function(_this) {
        return function() {
          _this.updateActiveTab();
          return true;
        };
      })(this));
      this.subscribe(atom.config.observe('tabs.tabScrolling', (function(_this) {
        return function() {
          return _this.updateTabScrolling();
        };
      })(this)));
      this.subscribe(atom.config.observe('tabs.tabScrollingThreshold', (function(_this) {
        return function() {
          return _this.updateTabScrollingThreshold();
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
          if (target === _this[0]) {
            _this.pane.trigger('application:new-file');
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
            _this.pane.focus();
            return false;
          }
        };
      })(this));
      RendererIpc.on('tab:dropped', this.onDropOnOtherWindow);
      return this.pane.prepend(this);
    };

    TabBarView.prototype.unsubscribe = function() {
      RendererIpc.removeListener('tab:dropped', this.onDropOnOtherWindow);
      return TabBarView.__super__.unsubscribe.apply(this, arguments);
    };

    TabBarView.prototype.addTabForItem = function(item, index) {
      var tabView;
      tabView = new TabView();
      tabView.initialize(item);
      return this.insertTabAtIndex(tabView, index);
    };

    TabBarView.prototype.moveItemTabToIndex = function(item, index) {
      var tab;
      tab = this.tabForItem(item);
      tab.remove();
      return this.insertTabAtIndex(tab, index);
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
      return tab.updateTitle();
    };

    TabBarView.prototype.removeTabForItem = function(item) {
      var tab, _i, _len, _ref1;
      this.tabForItem(item).destroy();
      _ref1 = this.getTabs();
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        tab = _ref1[_i];
        tab.updateTitle();
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
      return this.setActiveTab(this.tabForItem(this.pane.activeItem));
    };

    TabBarView.prototype.closeTab = function(tab) {
      if (tab == null) {
        tab = this.children('.right-clicked')[0];
      }
      return this.pane.destroyItem(tab.item);
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
      var element, item, itemUri, pane, paneIndex, _ref1, _ref2;
      event.originalEvent.dataTransfer.setData('atom-event', 'true');
      element = $(event.target).closest('.sortable');
      element.addClass('is-dragging');
      event.originalEvent.dataTransfer.setData('sortable-index', element.index());
      pane = $(event.target).closest('.pane');
      paneIndex = this.paneContainer.indexOfPane(pane);
      event.originalEvent.dataTransfer.setData('from-pane-index', paneIndex);
      event.originalEvent.dataTransfer.setData('from-pane-id', this.pane.model.id);
      event.originalEvent.dataTransfer.setData('from-process-id', this.getProcessId());
      event.originalEvent.dataTransfer.setData('from-routing-id', this.getRoutingId());
      item = this.pane.getItems()[element.index()];
      if (typeof item.getUri === 'function' || typeof item.getPath === 'function') {
        itemUri = (_ref1 = (_ref2 = typeof item.getUri === "function" ? item.getUri() : void 0) != null ? _ref2 : typeof item.getPath === "function" ? item.getPath() : void 0) != null ? _ref1 : '';
        event.originalEvent.dataTransfer.setData('text/plain', itemUri);
        if (process.platform === 'darwin') {
          if (!this.uriHasProtocol(itemUri)) {
            itemUri = "file://" + itemUri;
          }
          event.originalEvent.dataTransfer.setData('text/uri-list', itemUri);
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
      if (this.pane.model.id === fromPaneId) {
        if (itemToRemove = this.pane.itemAtIndex(fromItemIndex)) {
          this.pane.destroyItem(itemToRemove);
        }
      }
      return this.clearDropTarget();
    };

    TabBarView.prototype.clearDropTarget = function() {
      this.find(".is-dragging").removeClass('is-dragging');
      this.removeDropTargetClasses();
      return this.removePlaceholder();
    };

    TabBarView.prototype.onDrop = function(event) {
      var dataTransfer, droppedUri, fromIndex, fromPane, fromPaneId, fromPaneIndex, fromProcessId, fromRoutingId, hasUnsavedChanges, item, modifiedText, toIndex, toPane, _ref1;
      event.preventDefault();
      event.stopPropagation();
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
      toPane = $(event.target).closest('.pane').view();
      this.clearDropTarget();
      if (fromProcessId === this.getProcessId()) {
        fromPane = this.paneContainer.paneAtIndex(fromPaneIndex);
        item = ((_ref1 = fromPane.find(".tab-bar .sortable:eq(" + fromIndex + ")")[0]) != null ? _ref1 : {}).item;
        if (item != null) {
          return this.moveItemBetweenPanes(fromPane, fromIndex, toPane, toIndex, item);
        }
      } else {
        droppedUri = dataTransfer.getData('text/plain');
        atom.workspace.open(droppedUri).then((function(_this) {
          return function(item) {
            var activeItemIndex, activePane, browserWindow;
            activePane = atom.workspaceView.getActivePaneView();
            activeItemIndex = activePane.getActiveItemIndex();
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
      return toPane.focus();
    };

    TabBarView.prototype.removeDropTargetClasses = function() {
      atom.workspaceView.find('.tab-bar .is-drop-target').removeClass('is-drop-target');
      return atom.workspaceView.find('.tab-bar .drop-target-is-after').removeClass('drop-target-is-after');
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlFQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUEsYUFBQSxHQUFnQixJQUFoQixDQUFBOztBQUFBLEVBQ0EsV0FBQSxHQUFjLE9BQUEsQ0FBUSxLQUFSLENBRGQsQ0FBQTs7QUFBQSxFQUdBLE9BQVksT0FBQSxDQUFRLE1BQVIsQ0FBWixFQUFDLFNBQUEsQ0FBRCxFQUFJLFlBQUEsSUFISixDQUFBOztBQUFBLEVBSUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQUpKLENBQUE7O0FBQUEsRUFLQSxPQUFBLEdBQVUsT0FBQSxDQUFRLFlBQVIsQ0FMVixDQUFBOztBQUFBLEVBT0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLGlDQUFBLENBQUE7Ozs7Ozs7Ozs7O0tBQUE7O0FBQUEsSUFBQSxVQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxFQUFELENBQUk7QUFBQSxRQUFBLFFBQUEsRUFBVSxDQUFBLENBQVY7QUFBQSxRQUFjLE9BQUEsRUFBTyxpQ0FBckI7T0FBSixFQURRO0lBQUEsQ0FBVixDQUFBOztBQUFBLHlCQUdBLFVBQUEsR0FBWSxTQUFFLElBQUYsR0FBQTtBQUNWLFVBQUEscUJBQUE7QUFBQSxNQURXLElBQUMsQ0FBQSxPQUFBLElBQ1osQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLE9BQUQsQ0FBUyxnQkFBVCxFQUEyQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUFHLEtBQUMsQ0FBQSxRQUFELENBQUEsRUFBSDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTNCLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLE9BQUQsQ0FBUyx1QkFBVCxFQUFrQyxDQUFBLFNBQUEsS0FBQSxH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
//# sourceURL=/Users/ah/.atom/packages/tabs/lib/tab-bar-view.coffee