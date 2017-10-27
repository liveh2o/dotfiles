(function() {
  var $, TabView, path,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  path = require('path');

  $ = require('atom-space-pen-views').$;

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
            show: 1000,
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
      var itemClass, itemPath, _base, _ref;
      if (itemPath = typeof (_base = this.item).getPath === "function" ? _base.getPath() : void 0) {
        this.itemTitle.dataset.name = path.basename(itemPath);
        this.itemTitle.dataset.path = itemPath;
      } else {
        delete this.itemTitle.dataset.name;
        delete this.itemTitle.dataset.path;
      }
      if (itemClass = (_ref = this.item.constructor) != null ? _ref.name : void 0) {
        return this.dataset.type = itemClass;
      } else {
        return delete this.dataset.type;
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
