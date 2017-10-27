(function() {
  var $, BrowserWindow, CompositeDisposable, RendererIpc, TabBarView, TabView, View, _, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BrowserWindow = null;

  RendererIpc = require('ipc');

  _ref = require('space-pen'), $ = _ref.$, View = _ref.View;

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
      var tab, _i, _len, _ref1, _ref2;
      if ((_ref1 = this.tabForItem(item)) != null) {
        _ref1.destroy();
      }
      _ref2 = this.getTabs();
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        tab = _ref2[_i];
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
      var element, item, itemUri, paneIndex, _ref1, _ref2;
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
      var dataTransfer, droppedUri, fromIndex, fromPane, fromPaneId, fromPaneIndex, fromProcessId, fromRoutingId, hasUnsavedChanges, item, modifiedText, toIndex, toPane;
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
        droppedUri = dataTransfer.getData('text/plain');
        atom.workspace.open(droppedUri).then((function(_this) {
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNGQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUEsYUFBQSxHQUFnQixJQUFoQixDQUFBOztBQUFBLEVBQ0EsV0FBQSxHQUFjLE9BQUEsQ0FBUSxLQUFSLENBRGQsQ0FBQTs7QUFBQSxFQUdBLE9BQVksT0FBQSxDQUFRLFdBQVIsQ0FBWixFQUFDLFNBQUEsQ0FBRCxFQUFJLFlBQUEsSUFISixDQUFBOztBQUFBLEVBSUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUpELENBQUE7O0FBQUEsRUFLQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBTEosQ0FBQTs7QUFBQSxFQU1BLE9BQUEsR0FBVSxPQUFBLENBQVEsWUFBUixDQU5WLENBQUE7O0FBQUEsRUFRQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osaUNBQUEsQ0FBQTs7Ozs7Ozs7Ozs7S0FBQTs7QUFBQSxJQUFBLFVBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEVBQUQsQ0FBSTtBQUFBLFFBQUEsUUFBQSxFQUFVLENBQUEsQ0FBVjtBQUFBLFFBQWMsT0FBQSxFQUFPLGlDQUFyQjtPQUFKLEVBRFE7SUFBQSxDQUFWLENBQUE7O0FBQUEseUJBR0EsVUFBQSxHQUFZLFNBQUUsSUFBRixHQUFBO0FBQ1YsVUFBQSxxQkFBQTtBQUFBLE1BRFcsSUFBQyxDQUFBLE9BQUEsSUFDWixDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsYUFBRCxHQUFpQixHQUFBLENBQUEsbUJBQWpCLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsSUFBQyxDQUFBLE9BQW5CLEVBQ2pCO0FBQUEsUUFBQSxnQkFBQSxFQUFr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
//# sourceURL=/Users/ah/.atom/packages/tabs/lib/tab-bar-view.coffee