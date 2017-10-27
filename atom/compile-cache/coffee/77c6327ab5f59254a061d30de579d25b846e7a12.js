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
      var tab, _i, _len, _ref1, _results;
      this.tabForItem(item).remove();
      _ref1 = this.getTabs();
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        tab = _ref1[_i];
        _results.push(tab.updateTitle());
      }
      return _results;
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
        event.originalEvent.dataTransfer.setData('text/uri-list', 'file://' + item.getPath());
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
            if (!isNaN(fromProcessId) && !isNaN(fromProcessId)) {
              browserWindow = _this.browserWindowForProcessIdAndRoutingId(fromProcessId, fromRoutingId);
              return browserWindow != null ? browserWindow.webContents.send('tab:dropped', fromPaneId, fromIndex) : void 0;
            }
          };
        })(this));
        return atom.focus();
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlFQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUEsYUFBQSxHQUFnQixJQUFoQixDQUFBOztBQUFBLEVBQ0EsV0FBQSxHQUFjLE9BQUEsQ0FBUSxLQUFSLENBRGQsQ0FBQTs7QUFBQSxFQUdBLE9BQVksT0FBQSxDQUFRLE1BQVIsQ0FBWixFQUFDLFNBQUEsQ0FBRCxFQUFJLFlBQUEsSUFISixDQUFBOztBQUFBLEVBSUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxpQkFBUixDQUpKLENBQUE7O0FBQUEsRUFLQSxPQUFBLEdBQVUsT0FBQSxDQUFRLFlBQVIsQ0FMVixDQUFBOztBQUFBLEVBT0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLGlDQUFBLENBQUE7Ozs7Ozs7Ozs7S0FBQTs7QUFBQSxJQUFBLFVBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEVBQUQsQ0FBSTtBQUFBLFFBQUEsUUFBQSxFQUFVLENBQUEsQ0FBVjtBQUFBLFFBQWMsT0FBQSxFQUFPLGlDQUFyQjtPQUFKLEVBRFE7SUFBQSxDQUFWLENBQUE7O0FBQUEseUJBR0EsVUFBQSxHQUFZLFNBQUUsSUFBRixHQUFBO0FBQ1YsVUFBQSxxQkFBQTtBQUFBLE1BRFcsSUFBQyxDQUFBLE9BQUEsSUFDWixDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsT0FBRCxDQUFTLGdCQUFULEVBQTJCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQUcsS0FBQyxDQUFBLFFBQUQsQ0FBQSxFQUFIO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBM0IsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsT0FBRCxDQUFTLHVCQUFULEVBQWtDLENBQUEsU0FBQSxLQUFBLEdB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
//# sourceURL=/Users/ah/.atom/packages/tabs/lib/tab-bar-view.coffee