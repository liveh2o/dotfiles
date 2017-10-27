(function() {
  var $, TabView, path,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  path = require('path');

  $ = require('space-pen').$;

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
      } else if (typeof this.item.on === 'function') {
        this.item.on('title-changed', titleChangedHandler);
        this.titleSubscription = {
          dispose: (function(_this) {
            return function() {
              var _base;
              return typeof (_base = _this.item).off === "function" ? _base.off('title-changed', titleChangedHandler) : void 0;
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
              var _base1;
              return typeof (_base1 = _this.item).off === "function" ? _base1.off('icon-changed', iconChangedHandler) : void 0;
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
      } else if (typeof this.item.on === 'function') {
        this.item.on('modified-status-changed', modifiedHandler);
        this.modifiedSubscription = {
          dispose: (function(_this) {
            return function() {
              var _base1;
              return typeof (_base1 = _this.item).off === "function" ? _base1.off('modified-status-changed', modifiedHandler) : void 0;
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
      this.destroyTooltip();
      if (itemPath = typeof (_base = this.item).getPath === "function" ? _base.getPath() : void 0) {
        return this.tooltip = atom.tooltips.add(this, {
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

    TabView.prototype.destroyTooltip = function() {
      var _ref;
      if (!this.hasBeenMousedOver) {
        return;
      }
      return (_ref = this.tooltip) != null ? _ref.dispose() : void 0;
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
        _ref4.dispose();
      }
      this.destroyTooltip();
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBUCxDQUFBOztBQUFBLEVBQ0MsSUFBSyxPQUFBLENBQVEsV0FBUixFQUFMLENBREQsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSiw4QkFBQSxDQUFBOzs7O0tBQUE7O0FBQUEsc0JBQUEsVUFBQSxHQUFZLFNBQUUsSUFBRixHQUFBO0FBQ1YsVUFBQSxTQUFBO0FBQUEsTUFEVyxJQUFDLENBQUEsT0FBQSxJQUNaLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxTQUFTLENBQUMsR0FBWCxDQUFlLEtBQWYsRUFBc0IsVUFBdEIsQ0FBQSxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsU0FBRCxHQUFhLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCLENBRmIsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLFNBQVMsQ0FBQyxTQUFTLENBQUMsR0FBckIsQ0FBeUIsT0FBekIsQ0FIQSxDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsV0FBRCxDQUFhLElBQUMsQ0FBQSxTQUFkLENBSkEsQ0FBQTtBQUFBLE1BTUEsU0FBQSxHQUFZLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCLENBTlosQ0FBQTtBQUFBLE1BT0EsU0FBUyxDQUFDLFNBQVMsQ0FBQyxHQUFwQixDQUF3QixZQUF4QixDQVBBLENBQUE7QUFBQSxNQVFBLElBQUMsQ0FBQSxXQUFELENBQWEsU0FBYixDQVJBLENBQUE7QUFBQSxNQVVBLElBQUMsQ0FBQSxZQUFELENBQUEsQ0FWQSxDQUFBO0FBQUEsTUFXQSxJQUFDLENBQUEsb0JBQUQsQ0FBQSxDQVhBLENBQUE7QUFBQSxNQVlBLElBQUMsQ0FBQSxXQUFELENB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
//# sourceURL=/Users/ah/.atom/packages/tabs/lib/tab-view.coffee