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

    TabView.prototype.updateTitle = function() {
      var tab, title, useLongTitle, _base, _i, _len, _ref1, _ref2;
      if (this.updatingTitle) {
        return;
      }
      this.updatingTitle = true;
      title = this.item.getTitle();
      useLongTitle = false;
      _ref1 = this.getSiblingTabs();
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        tab = _ref1[_i];
        if (tab.item.getTitle() === title) {
          tab.updateTitle();
          useLongTitle = true;
        }
      }
      if (useLongTitle) {
        title = (_ref2 = typeof (_base = this.item).getLongTitle === "function" ? _base.getLongTitle() : void 0) != null ? _ref2 : title;
      }
      this.title.text(title);
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