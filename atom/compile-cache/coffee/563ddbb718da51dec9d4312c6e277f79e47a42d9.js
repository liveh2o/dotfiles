(function() {
  var $, TabView, path,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  path = require('path');

  $ = require('atom').$;

  module.exports = TabView = (function(_super) {
    __extends(TabView, _super);

    function TabView() {
      return TabView.__super__.constructor.apply(this, arguments);
    }

    TabView.prototype.initialize = function(item) {
      var closeIcon;
      this.item = item;
      this.classList.add('tab', 'sortable');
      this.itemTitle = document.createElement('div');
      this.itemTitle.classList.add('title');
      this.appendChild(this.itemTitle);
      closeIcon = document.createElement('div');
      closeIcon.classList.add('close-icon');
      this.appendChild(closeIcon);
      this.handleEvents();
      this.updateDataAttributes();
      this.updateTitle();
      this.updateIcon();
      this.updateModifiedStatus();
      return this.setupTooltip();
    };

    TabView.prototype.handleEvents = function() {
      var iconChangedHandler, modifiedHandler, titleChangedHandler, _base;
      titleChangedHandler = (function(_this) {
        return function() {
          _this.updateDataAttributes();
          _this.updateTitle();
          return _this.updateTooltip();
        };
      })(this);
      if (typeof this.item.onDidChangeTitle === 'function') {
        this.titleSubscription = this.item.onDidChangeTitle(titleChangedHandler);
      } else {
        this.item.on('title-changed', titleChangedHandler);
        this.titleSubscription = {
          dispose: (function(_this) {
            return function() {
              return _this.item.off('title-changed', titleChangedHandler);
            };
          })(this)
        };
      }
      iconChangedHandler = (function(_this) {
        return function() {
          return _this.updateIcon();
        };
      })(this);
      if (typeof this.item.onDidChangeIcon === 'function') {
        this.iconSubscription = typeof (_base = this.item).onDidChangeIcon === "function" ? _base.onDidChangeIcon((function(_this) {
          return function() {
            return _this.updateIcon();
          };
        })(this)) : void 0;
      } else if (typeof this.item.on === 'function') {
        this.item.on('icon-changed', iconChangedHandler);
        this.iconSubscription = {
          dispose: (function(_this) {
            return function() {
              return _this.item.off('icon-changed', iconChangedHandler);
            };
          })(this)
        };
      }
      modifiedHandler = (function(_this) {
        return function() {
          return _this.updateModifiedStatus();
        };
      })(this);
      if (typeof this.item.onDidChangeModified === 'function') {
        this.modifiedSubscription = this.item.onDidChangeModified(modifiedHandler);
      } else {
        this.item.on('modified-status-changed', modifiedHandler);
        this.modifiedSubscription = {
          dispose: (function(_this) {
            return function() {
              return _this.item.off('modified-status-changed', modifiedHandler);
            };
          })(this)
        };
      }
      return this.configSubscription = atom.config.observe('tabs.showIcons', (function(_this) {
        return function() {
          return _this.updateIconVisibility();
        };
      })(this));
    };

    TabView.prototype.setupTooltip = function() {
      var onMouseEnter;
      onMouseEnter = (function(_this) {
        return function() {
          _this.mouseEnterSubscription.dispose();
          _this.hasBeenMousedOver = true;
          _this.updateTooltip();
          return _this.dispatchEvent(new CustomEvent('mouseenter', {
            bubbles: true
          }));
        };
      })(this);
      this.mouseEnterSubscription = {
        dispose: (function(_this) {
          return function() {
            _this.removeEventListener('mouseenter', onMouseEnter);
            return _this.mouseEnterSubscription = null;
          };
        })(this)
      };
      return this.addEventListener('mouseenter', onMouseEnter);
    };

    TabView.prototype.updateTooltip = function() {
      var itemPath, _base;
      if (!this.hasBeenMousedOver) {
        return;
      }
      $(this).destroyTooltip();
      if (itemPath = typeof (_base = this.item).getPath === "function" ? _base.getPath() : void 0) {
        return $(this).setTooltip({
          title: itemPath,
          html: false,
          delay: {
            show: 2000,
            hide: 100
          },
          placement: 'bottom'
        });
      }
    };

    TabView.prototype.destroy = function() {
      var _ref, _ref1, _ref2, _ref3, _ref4;
      if ((_ref = this.titleSubscription) != null) {
        _ref.dispose();
      }
      if ((_ref1 = this.modifiedSubscription) != null) {
        _ref1.dispose();
      }
      if ((_ref2 = this.iconSubscription) != null) {
        _ref2.dispose();
      }
      if ((_ref3 = this.mouseEnterSubscription) != null) {
        _ref3.dispose();
      }
      if ((_ref4 = this.configSubscription) != null) {
        _ref4.off();
      }
      if (this.hasBeenMousedOver) {
        $(this).destroyTooltip();
      }
      return this.remove();
    };

    TabView.prototype.updateDataAttributes = function() {
      var itemPath, _base;
      if (itemPath = typeof (_base = this.item).getPath === "function" ? _base.getPath() : void 0) {
        this.itemTitle.dataset.name = path.basename(itemPath);
        return this.itemTitle.dataset.path = itemPath;
      }
    };

    TabView.prototype.updateTitle = function(_arg) {
      var tab, title, updateSiblings, useLongTitle, _base, _base1, _i, _len, _ref, _ref1, _ref2, _ref3;
      _ref = _arg != null ? _arg : {}, updateSiblings = _ref.updateSiblings, useLongTitle = _ref.useLongTitle;
      if (this.updatingTitle) {
        return;
      }
      this.updatingTitle = true;
      if (updateSiblings === false) {
        title = this.item.getTitle();
        if (useLongTitle) {
          title = (_ref1 = typeof (_base = this.item).getLongTitle === "function" ? _base.getLongTitle() : void 0) != null ? _ref1 : title;
        }
        this.itemTitle.textContent = title;
      } else {
        title = this.item.getTitle();
        useLongTitle = false;
        _ref2 = this.getTabs();
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          tab = _ref2[_i];
          if (tab !== this) {
            if (tab.item.getTitle() === title) {
              tab.updateTitle({
                updateSiblings: false,
                useLongTitle: true
              });
              useLongTitle = true;
            }
          }
        }
        if (useLongTitle) {
          title = (_ref3 = typeof (_base1 = this.item).getLongTitle === "function" ? _base1.getLongTitle() : void 0) != null ? _ref3 : title;
        }
        this.itemTitle.textContent = title;
      }
      return this.updatingTitle = false;
    };

    TabView.prototype.updateIcon = function() {
      var _base;
      if (this.iconName) {
        this.itemTitle.classList.remove('icon', "icon-" + this.iconName);
      }
      if (this.iconName = typeof (_base = this.item).getIconName === "function" ? _base.getIconName() : void 0) {
        return this.itemTitle.classList.add('icon', "icon-" + this.iconName);
      }
    };

    TabView.prototype.getTabs = function() {
      var _ref, _ref1;
      return (_ref = (_ref1 = this.parentElement) != null ? _ref1.querySelectorAll('.tab') : void 0) != null ? _ref : [];
    };

    TabView.prototype.updateIconVisibility = function() {
      if (atom.config.get('tabs.showIcons')) {
        return this.itemTitle.classList.remove('hide-icon');
      } else {
        return this.itemTitle.classList.add('hide-icon');
      }
    };

    TabView.prototype.updateModifiedStatus = function() {
      var _base;
      if (typeof (_base = this.item).isModified === "function" ? _base.isModified() : void 0) {
        if (!this.isModified) {
          this.classList.add('modified');
        }
        return this.isModified = true;
      } else {
        if (this.isModified) {
          this.classList.remove('modified');
        }
        return this.isModified = false;
      }
    };

    return TabView;

  })(HTMLElement);

  module.exports = document.registerElement('tabs-tab', {
    prototype: TabView.prototype,
    "extends": 'li'
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBUCxDQUFBOztBQUFBLEVBQ0MsSUFBSyxPQUFBLENBQVEsTUFBUixFQUFMLENBREQsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSiw4QkFBQSxDQUFBOzs7O0tBQUE7O0FBQUEsc0JBQUEsVUFBQSxHQUFZLFNBQUUsSUFBRixHQUFBO0FBQ1YsVUFBQSxTQUFBO0FBQUEsTUFEVyxJQUFDLENBQUEsT0FBQSxJQUNaLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxTQUFTLENBQUMsR0FBWCxDQUFlLEtBQWYsRUFBc0IsVUFBdEIsQ0FBQSxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsU0FBRCxHQUFhLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCLENBRmIsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLFNBQVMsQ0FBQyxTQUFTLENBQUMsR0FBckIsQ0FBeUIsT0FBekIsQ0FIQSxDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsV0FBRCxDQUFhLElBQUMsQ0FBQSxTQUFkLENBSkEsQ0FBQTtBQUFBLE1BTUEsU0FBQSxHQUFZLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCLENBTlosQ0FBQTtBQUFBLE1BT0EsU0FBUyxDQUFDLFNBQVMsQ0FBQyxHQUFwQixDQUF3QixZQUF4QixDQVBBLENBQUE7QUFBQSxNQVFBLElBQUMsQ0FBQSxXQUFELENBQWEsU0FBYixDQVJBLENBQUE7QUFBQSxNQVVBLElBQUMsQ0FBQSxZQUFELENBQUEsQ0FWQSxDQUFBO0FBQUEsTUFXQSxJQUFDLENBQUEsb0JBQUQsQ0FBQSxDQVhBLENBQUE7QUFBQSxNQVlBLElBQUMsQ0FBQSxXQUFELENB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
//# sourceURL=/Users/ah/.atom/packages/tabs/lib/tab-view.coffee