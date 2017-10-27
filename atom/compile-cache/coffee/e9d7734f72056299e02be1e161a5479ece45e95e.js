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

    TabView.prototype.destroyTooltip = function() {
      if (!this.hasBeenMousedOver) {
        return;
      }
      return $(this).destroyTooltip();
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBUCxDQUFBOztBQUFBLEVBQ0MsSUFBSyxPQUFBLENBQVEsTUFBUixFQUFMLENBREQsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSiw4QkFBQSxDQUFBOzs7O0tBQUE7O0FBQUEsc0JBQUEsVUFBQSxHQUFZLFNBQUUsSUFBRixHQUFBO0FBQ1YsVUFBQSxTQUFBO0FBQUEsTUFEVyxJQUFDLENBQUEsT0FBQSxJQUNaLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxTQUFTLENBQUMsR0FBWCxDQUFlLEtBQWYsRUFBc0IsVUFBdEIsQ0FBQSxDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsU0FBRCxHQUFhLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCLENBRmIsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLFNBQVMsQ0FBQyxTQUFTLENBQUMsR0FBckIsQ0FBeUIsT0FBekIsQ0FIQSxDQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsV0FBRCxDQUFhLElBQUMsQ0FBQSxTQUFkLENBSkEsQ0FBQTtBQUFBLE1BTUEsU0FBQSxHQUFZLFFBQVEsQ0FBQyxhQUFULENBQXVCLEtBQXZCLENBTlosQ0FBQTtBQUFBLE1BT0EsU0FBUyxDQUFDLFNBQVMsQ0FBQyxHQUFwQixDQUF3QixZQUF4QixDQVBBLENBQUE7QUFBQSxNQVFBLElBQUMsQ0FBQSxXQUFELENBQWEsU0FBYixDQVJBLENBQUE7QUFBQSxNQVVBLElBQUMsQ0FBQSxZQUFELENBQUEsQ0FWQSxDQUFBO0FBQUEsTUFXQSxJQUFDLENBQUEsb0JBQUQsQ0FBQSxDQVhBLENBQUE7QUFBQSxNQVlBLElBQUMsQ0FBQSxXQUFELENB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
//# sourceURL=/Users/ah/.atom/packages/tabs/lib/tab-view.coffee