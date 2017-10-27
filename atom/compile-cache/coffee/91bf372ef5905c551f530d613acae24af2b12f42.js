(function() {
  var $, TabView, View, path, _, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom'), $ = _ref.$, View = _ref.View;

  _ = require('underscore-plus');

  path = require('path');

  module.exports = TabView = (function(_super) {
    __extends(TabView, _super);

    function TabView() {
      return TabView.__super__.constructor.apply(this, arguments);
    }

    TabView.content = function() {
      return this.li({
        "class": 'tab sortable'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'title',
            outlet: 'title'
          });
          return _this.div({
            "class": 'close-icon'
          });
        };
      })(this));
    };

    TabView.prototype.initialize = function(item, pane) {
      var _base, _base1, _base2;
      this.item = item;
      this.pane = pane;
      if (typeof (_base = this.item).on === "function") {
        _base.on('title-changed', (function(_this) {
          return function() {
            _this.updateDataAttributes();
            _this.updateTitle();
            return _this.updateTooltip();
          };
        })(this));
      }
      if (typeof (_base1 = this.item).on === "function") {
        _base1.on('icon-changed', (function(_this) {
          return function() {
            return _this.updateIcon();
          };
        })(this));
      }
      if (typeof (_base2 = this.item).on === "function") {
        _base2.on('modified-status-changed', (function(_this) {
          return function() {
            return _this.updateModifiedStatus();
          };
        })(this));
      }
      this.subscribe(atom.config.observe('tabs.showIcons', (function(_this) {
        return function() {
          return _this.updateIconVisibility();
        };
      })(this)));
      this.updateDataAttributes();
      this.updateTitle();
      this.updateIcon();
      this.updateModifiedStatus();
      return this.updateTooltip();
    };

    TabView.prototype.updateTooltip = function() {
      var itemPath, _base;
      this.destroyTooltip();
      if (itemPath = typeof (_base = this.item).getPath === "function" ? _base.getPath() : void 0) {
        return this.setTooltip({
          title: _.escape(itemPath),
          delay: {
            show: 2000,
            hide: 100
          },
          placement: 'bottom'
        });
      }
    };

    TabView.prototype.beforeRemove = function() {
      return this.destroyTooltip();
    };

    TabView.prototype.updateDataAttributes = function() {
      var itemPath, _base;
      if (itemPath = typeof (_base = this.item).getPath === "function" ? _base.getPath() : void 0) {
        this.title.attr('data-name', path.basename(itemPath));
        return this.title.attr('data-path', itemPath);
      }
    };

    TabView.prototype.updateTitle = function(_arg) {
      var tab, title, updateSiblings, useLongTitle, _base, _base1, _i, _len, _ref1, _ref2, _ref3, _ref4;
      _ref1 = _arg != null ? _arg : {}, updateSiblings = _ref1.updateSiblings, useLongTitle = _ref1.useLongTitle;
      if (this.updatingTitle) {
        return;
      }
      this.updatingTitle = true;
      if (updateSiblings === false) {
        title = this.item.getTitle();
        if (useLongTitle) {
          title = (_ref2 = typeof (_base = this.item).getLongTitle === "function" ? _base.getLongTitle() : void 0) != null ? _ref2 : title;
        }
        this.title.text(title);
      } else {
        title = this.item.getTitle();
        useLongTitle = false;
        _ref3 = this.getSiblingTabs();
        for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
          tab = _ref3[_i];
          if (tab.item.getTitle() === title) {
            tab.updateTitle({
              updateSiblings: false,
              useLongTitle: true
            });
            useLongTitle = true;
          }
        }
        if (useLongTitle) {
          title = (_ref4 = typeof (_base1 = this.item).getLongTitle === "function" ? _base1.getLongTitle() : void 0) != null ? _ref4 : title;
        }
        this.title.text(title);
      }
      return this.updatingTitle = false;
    };

    TabView.prototype.updateIcon = function() {
      var _base;
      if (this.iconName) {
        this.title.removeClass("icon icon-" + this.iconName);
      }
      if (this.iconName = typeof (_base = this.item).getIconName === "function" ? _base.getIconName() : void 0) {
        return this.title.addClass("icon icon-" + this.iconName);
      }
    };

    TabView.prototype.getSiblingTabs = function() {
      return this.siblings('.tab').views();
    };

    TabView.prototype.updateIconVisibility = function() {
      if (atom.config.get("tabs.showIcons")) {
        return this.title.removeClass("hide-icon");
      } else {
        return this.title.addClass("hide-icon");
      }
    };

    TabView.prototype.updateModifiedStatus = function() {
      var _base;
      if (typeof (_base = this.item).isModified === "function" ? _base.isModified() : void 0) {
        if (!this.isModified) {
          this.addClass('modified');
        }
        return this.isModified = true;
      } else {
        if (this.isModified) {
          this.removeClass('modified');
        }
        return this.isModified = false;
      }
    };

    return TabView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLCtCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxPQUFZLE9BQUEsQ0FBUSxNQUFSLENBQVosRUFBQyxTQUFBLENBQUQsRUFBSSxZQUFBLElBQUosQ0FBQTs7QUFBQSxFQUNBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVIsQ0FESixDQUFBOztBQUFBLEVBRUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRlAsQ0FBQTs7QUFBQSxFQUlBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSiw4QkFBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSxPQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxFQUFELENBQUk7QUFBQSxRQUFBLE9BQUEsRUFBTyxjQUFQO09BQUosRUFBMkIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUN6QixVQUFBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE9BQUEsRUFBTyxPQUFQO0FBQUEsWUFBZ0IsTUFBQSxFQUFRLE9BQXhCO1dBQUwsQ0FBQSxDQUFBO2lCQUNBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE9BQUEsRUFBTyxZQUFQO1dBQUwsRUFGeUI7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUEzQixFQURRO0lBQUEsQ0FBVixDQUFBOztBQUFBLHNCQUtBLFVBQUEsR0FBWSxTQUFFLElBQUYsRUFBUyxJQUFULEdBQUE7QUFDVixVQUFBLHFCQUFBO0FBQUEsTUFEVyxJQUFDLENBQUEsT0FBQSxJQUNaLENBQUE7QUFBQSxNQURrQixJQUFDLENBQUEsT0FBQSxJQUNuQixDQUFBOzthQUFLLENBQUMsR0FBSSxpQkFBaUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFB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
//# sourceURL=/Users/ah/.atom/packages/tabs/lib/tab-view.coffee