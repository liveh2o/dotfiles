(function() {
  var $, TabView, View, path, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom'), $ = _ref.$, View = _ref.View;

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
      var _base, _base1;
      this.item = item;
      this.pane = pane;
      if (typeof (_base = this.item).on === "function") {
        _base.on('title-changed', (function(_this) {
          return function() {
            _this.updateTitle();
            return _this.updateTooltip();
          };
        })(this));
      }
      if (typeof (_base1 = this.item).on === "function") {
        _base1.on('modified-status-changed', (function(_this) {
          return function() {
            return _this.updateModifiedStatus();
          };
        })(this));
      }
      this.updateTitle();
      this.updateModifiedStatus();
      return this.updateTooltip();
    };

    TabView.prototype.updateTooltip = function() {
      var itemPath, _base;
      this.destroyTooltip();
      if (itemPath = typeof (_base = this.item).getPath === "function" ? _base.getPath() : void 0) {
        return this.setTooltip({
          title: itemPath,
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

    TabView.prototype.getSiblingTabs = function() {
      return this.siblings('.tab').views();
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDRCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxPQUFZLE9BQUEsQ0FBUSxNQUFSLENBQVosRUFBQyxTQUFBLENBQUQsRUFBSSxZQUFBLElBQUosQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQURQLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osOEJBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsT0FBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsRUFBRCxDQUFJO0FBQUEsUUFBQSxPQUFBLEVBQU8sY0FBUDtPQUFKLEVBQTJCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDekIsVUFBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxPQUFBLEVBQU8sT0FBUDtBQUFBLFlBQWdCLE1BQUEsRUFBUSxPQUF4QjtXQUFMLENBQUEsQ0FBQTtpQkFDQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxPQUFBLEVBQU8sWUFBUDtXQUFMLEVBRnlCO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBM0IsRUFEUTtJQUFBLENBQVYsQ0FBQTs7QUFBQSxzQkFLQSxVQUFBLEdBQVksU0FBRSxJQUFGLEVBQVMsSUFBVCxHQUFBO0FBQ1YsVUFBQSxhQUFBO0FBQUEsTUFEVyxJQUFDLENBQUEsT0FBQSxJQUNaLENBQUE7QUFBQSxNQURrQixJQUFDLENBQUEsT0FBQSxJQUNuQixDQUFBOzthQUFLLENBQUMsR0FBSSxpQkFBaUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7QUFDekIsWUFBQSxLQUFDLENBQUEsV0FBRCxDQUFBLENBQUEs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
//# sourceURL=/Users/ah/.atom/packages/tabs/lib/tab-view.coffee