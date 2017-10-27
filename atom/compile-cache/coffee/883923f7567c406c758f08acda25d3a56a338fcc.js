(function() {
  var $, TabBarView, TabView, View, _, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom'), $ = _ref.$, View = _ref.View;

  _ = require('underscore-plus');

  TabView = require('./tab-view');

  module.exports = TabBarView = (function(_super) {
    __extends(TabBarView, _super);

    function TabBarView() {
      this.onDrop = __bind(this.onDrop, this);
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
        return function(pane) {
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
            return tab.addClass('right-clicked');
          } else if (which === 1 && !target.classList.contains('close-icon')) {
            _this.pane.showItem(tab.item);
            return _this.pane.focus();
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
      this.on('mouseup', '.tab', (function(_this) {
        return function(_arg) {
          var tab, target, which;
          target = _arg.target, which = _arg.which;
          if (which === 2) {
            tab = $(target).closest('.tab').view();
            _this.pane.destroyItem(tab.item);
          }
          return false;
        };
      })(this));
      return this.pane.prepend(this);
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
      return this.children('.tab').toArray().map(function(elt) {
        return $(elt).view();
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

    TabBarView.prototype.shouldAllowDrag = function() {
      return (this.paneContainer.getPanes().length > 1) || (this.pane.getItems().length > 1);
    };

    TabBarView.prototype.onDragStart = function(event) {
      var el, item, pane, paneIndex;
      if (this.shouldAllowDrag()) {
        event.originalEvent.dataTransfer.setData('atom-event', 'true');
      }
      el = $(event.target).closest('.sortable');
      el.addClass('is-dragging');
      event.originalEvent.dataTransfer.setData('sortable-index', el.index());
      pane = $(event.target).closest('.pane');
      paneIndex = this.paneContainer.indexOfPane(pane);
      event.originalEvent.dataTransfer.setData('from-pane-index', paneIndex);
      item = this.pane.getItems()[el.index()];
      if (item.getPath != null) {
        event.originalEvent.dataTransfer.setData('text/uri-list', 'file://' + item.getPath());
        return event.originalEvent.dataTransfer.setData('text/plain', item.getPath());
      }
    };

    TabBarView.prototype.onDragLeave = function(event) {
      return this.removePlaceholderElement();
    };

    TabBarView.prototype.onDragEnd = function(event) {
      this.find(".is-dragging").removeClass('is-dragging');
      this.removeDropTargetClasses();
      return this.removePlaceholderElement();
    };

    TabBarView.prototype.onDragOver = function(event) {
      var el, newDropTargetIndex, sortableObjects, tabBar;
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
        el = sortableObjects.eq(newDropTargetIndex).addClass('is-drop-target');
        return this.getPlaceholderElement().insertBefore(el);
      } else {
        el = sortableObjects.eq(newDropTargetIndex - 1).addClass('drop-target-is-after');
        return this.getPlaceholderElement().insertAfter(el);
      }
    };

    TabBarView.prototype.onDrop = function(event) {
      var dataTransfer, draggedTab, fromIndex, fromPane, fromPaneIndex, item, toIndex, toPane;
      if (event.originalEvent.dataTransfer.getData('atom-event') !== 'true') {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      this.find(".is-dragging").removeClass('is-dragging');
      this.removeDropTargetClasses();
      this.removePlaceholderElement();
      event.stopPropagation();
      dataTransfer = event.originalEvent.dataTransfer;
      fromIndex = parseInt(dataTransfer.getData('sortable-index'));
      fromPaneIndex = parseInt(dataTransfer.getData('from-pane-index'));
      fromPane = this.paneContainer.paneAtIndex(fromPaneIndex);
      toIndex = this.getDropTargetIndex(event);
      toPane = $(event.target).closest('.pane').view();
      draggedTab = fromPane.find(".tab-bar .sortable:eq(" + fromIndex + ")").view();
      item = draggedTab.item;
      if (toPane === fromPane) {
        if (fromIndex < toIndex) {
          toIndex--;
        }
        toPane.moveItem(item, toIndex);
      } else {
        fromPane.moveItemToPane(item, toPane, toIndex--);
      }
      toPane.showItem(item);
      return toPane.focus();
    };

    TabBarView.prototype.removeDropTargetClasses = function() {
      atom.workspaceView.find('.tab-bar .is-drop-target').removeClass('is-drop-target');
      return atom.workspaceView.find('.tab-bar .drop-target-is-after').removeClass('drop-target-is-after');
    };

    TabBarView.prototype.getDropTargetIndex = function(event) {
      var el, elementCenter, sortables, tabBar, target;
      target = $(event.target);
      tabBar = this.getTabBar(event.target);
      if (this.isPlaceholderElement(target)) {
        return;
      }
      sortables = tabBar.find('.sortable');
      el = target.closest('.sortable');
      if (el.length === 0) {
        el = sortables.last();
      }
      if (!el.length) {
        return 0;
      }
      elementCenter = el.offset().left + el.width() / 2;
      if (event.originalEvent.pageX < elementCenter) {
        return sortables.index(el);
      } else if (el.next('.sortable').length > 0) {
        return sortables.index(el.next('.sortable'));
      } else {
        return sortables.index(el) + 1;
      }
    };

    TabBarView.prototype.getPlaceholderElement = function() {
      if (!this.placeholderEl) {
        this.placeholderEl = $('<li/>', {
          "class": 'placeholder'
        });
      }
      return this.placeholderEl;
    };

    TabBarView.prototype.removePlaceholderElement = function() {
      if (this.placeholderEl) {
        this.placeholderEl.remove();
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHFDQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUEsT0FBWSxPQUFBLENBQVEsTUFBUixDQUFaLEVBQUMsU0FBQSxDQUFELEVBQUksWUFBQSxJQUFKLENBQUE7O0FBQUEsRUFDQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBREosQ0FBQTs7QUFBQSxFQUVBLE9BQUEsR0FBVSxPQUFBLENBQVEsWUFBUixDQUZWLENBQUE7O0FBQUEsRUFJQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osaUNBQUEsQ0FBQTs7Ozs7Ozs7O0tBQUE7O0FBQUEsSUFBQSxVQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxFQUFELENBQUk7QUFBQSxRQUFBLFFBQUEsRUFBVSxDQUFBLENBQVY7QUFBQSxRQUFjLE9BQUEsRUFBTyxpQ0FBckI7T0FBSixFQURRO0lBQUEsQ0FBVixDQUFBOztBQUFBLHlCQUdBLFVBQUEsR0FBWSxTQUFFLElBQUYsR0FBQTtBQUNWLFVBQUEscUJBQUE7QUFBQSxNQURXLElBQUMsQ0FBQSxPQUFBLElBQ1osQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLE9BQUQsQ0FBUyxnQkFBVCxFQUEyQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUFHLEtBQUMsQ0FBQSxRQUFELENBQUEsRUFBSDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTNCLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLE9BQUQsQ0FBUyx1QkFBVCxFQUFrQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUFHLEtBQUMsQ0FBQSxjQUFELENBQUEsRUFBSDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJ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
//# sourceURL=/Users/ah/.atom/packages/tabs/lib/tab-bar-view.coffee