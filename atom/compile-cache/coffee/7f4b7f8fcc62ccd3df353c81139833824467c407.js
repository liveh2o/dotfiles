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
          tab = $(target).closest('.tab').view();
          if (which === 3 || (which === 1 && ctrlKey === true)) {
            _this.find('.right-clicked').removeClass('right-clicked');
            tab.addClass('right-clicked');
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
          tab = $(target).closest('.tab').view();
          _this.pane.destroyItem(tab.item);
          return false;
        };
      })(this));
      this.on('click', '.tab', (function(_this) {
        return function(_arg) {
          var tab, target, which;
          target = _arg.target, which = _arg.which;
          tab = $(target).closest('.tab').view();
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
      return this.insertTabAtIndex(new TabView(item, this.pane), index);
    };

    TabBarView.prototype.moveItemTabToIndex = function(item, index) {
      var tab;
      tab = this.tabForItem(item);
      tab.detach();
      return this.insertTabAtIndex(tab, index);
    };

    TabBarView.prototype.insertTabAtIndex = function(tab, index) {
      var followingTab;
      if (index != null) {
        followingTab = this.tabAtIndex(index);
      }
      if (followingTab) {
        tab.insertBefore(followingTab);
      } else {
        this.append(tab);
      }
      return tab.updateTitle();
    };

    TabBarView.prototype.removeTabForItem = function(item) {
      var tab, _i, _len, _ref1;
      this.tabForItem(item).remove();
      _ref1 = this.getTabs();
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        tab = _ref1[_i];
        tab.updateTitle();
      }
    };

    TabBarView.prototype.getTabs = function() {
      return this.children('.tab').toArray().map(function(element) {
        return $(element).view();
      });
    };

    TabBarView.prototype.tabAtIndex = function(index) {
      return this.children(".tab:eq(" + index + ")").view();
    };

    TabBarView.prototype.tabForItem = function(item) {
      return _.detect(this.getTabs(), function(tab) {
        return tab.item === item;
      });
    };

    TabBarView.prototype.setActiveTab = function(tabView) {
      if ((tabView != null) && !tabView.hasClass('active')) {
        this.find(".tab.active").removeClass('active');
        return tabView.addClass('active');
      }
    };

    TabBarView.prototype.updateActiveTab = function() {
      return this.setActiveTab(this.tabForItem(this.pane.activeItem));
    };

    TabBarView.prototype.closeTab = function(tab) {
      if (tab == null) {
        tab = this.children('.right-clicked').view();
      }
      return this.pane.destroyItem(tab.item);
    };

    TabBarView.prototype.closeOtherTabs = function() {
      var active, tab, tabs, _i, _len, _results;
      tabs = this.getTabs();
      active = this.children('.right-clicked').view();
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
      active = this.children('.right-clicked').view();
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
      var element, item, pane, paneIndex, _ref1;
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
      if (item.getPath != null) {
        if (process.platform !== 'linux') {
          event.originalEvent.dataTransfer.setData('text/uri-list', "file://" + (item.getPath()));
        }
        event.originalEvent.dataTransfer.setData('text/plain', (_ref1 = item.getPath()) != null ? _ref1 : '');
        if ((typeof item.isModified === "function" ? item.isModified() : void 0) && (item.getText != null)) {
          event.originalEvent.dataTransfer.setData('has-unsaved-changes', 'true');
          return event.originalEvent.dataTransfer.setData('modified-text', item.getText());
        }
      }
    };

    TabBarView.prototype.onDragLeave = function(event) {
      return this.removePlaceholderElement();
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
        return this.getPlaceholderElement().insertBefore(element);
      } else {
        element = sortableObjects.eq(newDropTargetIndex - 1).addClass('drop-target-is-after');
        return this.getPlaceholderElement().insertAfter(element);
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
      return this.removePlaceholderElement();
    };

    TabBarView.prototype.onDrop = function(event) {
      var dataTransfer, droppedPath, fromIndex, fromPane, fromPaneId, fromPaneIndex, fromProcessId, fromRoutingId, hasUnsavedChanges, item, modifiedText, toIndex, toPane, _ref1;
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
        item = ((_ref1 = fromPane.find(".tab-bar .sortable:eq(" + fromIndex + ")").view()) != null ? _ref1 : {}).item;
        if (item != null) {
          return this.moveItemBetweenPanes(fromPane, fromIndex, toPane, toIndex, item);
        }
      } else {
        droppedPath = dataTransfer.getData('text/plain');
        atom.workspace.open(droppedPath).then((function(_this) {
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
      if (this.isPlaceholderElement(target)) {
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

    TabBarView.prototype.getPlaceholderElement = function() {
      return this.placeholderEl != null ? this.placeholderEl : this.placeholderEl = $('<li/>', {
        "class": 'placeholder'
      });
    };

    TabBarView.prototype.removePlaceholderElement = function() {
      var _ref1;
      if ((_ref1 = this.placeholderEl) != null) {
        _ref1.remove();
      }
      return this.placeholderEl = null;
    };

    TabBarView.prototype.isPlaceholderElement = function(element) {
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