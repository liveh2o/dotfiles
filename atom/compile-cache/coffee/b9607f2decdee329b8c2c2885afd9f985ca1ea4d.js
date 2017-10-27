(function() {
  var CompositeDisposable, Disposable, TabView, path, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  path = require('path');

  _ref = require('atom'), Disposable = _ref.Disposable, CompositeDisposable = _ref.CompositeDisposable;

  module.exports = TabView = (function(_super) {
    __extends(TabView, _super);

    function TabView() {
      return TabView.__super__.constructor.apply(this, arguments);
    }

    TabView.prototype.initialize = function(item, pane) {
      var closeIcon;
      this.item = item;
      this.pane = pane;
      if (typeof this.item.getPath === 'function') {
        this.path = this.item.getPath();
      }
      if (['TextEditor', 'TestView'].indexOf(item.constructor.name) > -1) {
        this.classList.add('texteditor');
      }
      this.classList.add('tab', 'sortable');
      this.itemTitle = document.createElement('div');
      this.itemTitle.classList.add('title');
      this.appendChild(this.itemTitle);
      closeIcon = document.createElement('div');
      closeIcon.classList.add('close-icon');
      this.appendChild(closeIcon);
      this.subscriptions = new CompositeDisposable();
      this.handleEvents();
      this.updateDataAttributes();
      this.updateTitle();
      this.updateIcon();
      this.updateModifiedStatus();
      this.setupTooltip();
      if (this.isItemPending()) {
        this.itemTitle.classList.add('temp');
        return this.classList.add('pending-tab');
      }
    };

    TabView.prototype.handleEvents = function() {
      var iconChangedHandler, modifiedHandler, onDidChangeIconDisposable, onDidChangeModifiedDisposable, onDidChangeTitleDisposable, onDidSaveDisposable, onDidTerminatePendingStateDisposable, titleChangedHandler, _base;
      titleChangedHandler = (function(_this) {
        return function() {
          _this.updateDataAttributes();
          _this.updateTitle();
          return _this.updateTooltip();
        };
      })(this);
      if (typeof this.pane.onItemDidTerminatePendingState === 'function') {
        this.subscriptions.add(this.pane.onItemDidTerminatePendingState((function(_this) {
          return function(item) {
            if (item === _this.item) {
              return _this.clearPending();
            }
          };
        })(this)));
      } else if (typeof this.item.onDidTerminatePendingState === 'function') {
        onDidTerminatePendingStateDisposable = this.item.onDidTerminatePendingState((function(_this) {
          return function() {
            return _this.clearPending();
          };
        })(this));
        if (Disposable.isDisposable(onDidTerminatePendingStateDisposable)) {
          this.subscriptions.add(onDidTerminatePendingStateDisposable);
        } else {
          console.warn("::onDidTerminatePendingState does not return a valid Disposable!", this.item);
        }
      }
      if (typeof this.item.onDidChangeTitle === 'function') {
        onDidChangeTitleDisposable = this.item.onDidChangeTitle(titleChangedHandler);
        if (Disposable.isDisposable(onDidChangeTitleDisposable)) {
          this.subscriptions.add(onDidChangeTitleDisposable);
        } else {
          console.warn("::onDidChangeTitle does not return a valid Disposable!", this.item);
        }
      } else if (typeof this.item.on === 'function') {
        this.item.on('title-changed', titleChangedHandler);
        this.subscriptions.add({
          dispose: (function(_this) {
            return function() {
              var _base;
              return typeof (_base = _this.item).off === "function" ? _base.off('title-changed', titleChangedHandler) : void 0;
            };
          })(this)
        });
      }
      iconChangedHandler = (function(_this) {
        return function() {
          return _this.updateIcon();
        };
      })(this);
      if (typeof this.item.onDidChangeIcon === 'function') {
        onDidChangeIconDisposable = typeof (_base = this.item).onDidChangeIcon === "function" ? _base.onDidChangeIcon((function(_this) {
          return function() {
            return _this.updateIcon();
          };
        })(this)) : void 0;
        if (Disposable.isDisposable(onDidChangeIconDisposable)) {
          this.subscriptions.add(onDidChangeIconDisposable);
        } else {
          console.warn("::onDidChangeIcon does not return a valid Disposable!", this.item);
        }
      } else if (typeof this.item.on === 'function') {
        this.item.on('icon-changed', iconChangedHandler);
        this.subscriptions.add({
          dispose: (function(_this) {
            return function() {
              var _base1;
              return typeof (_base1 = _this.item).off === "function" ? _base1.off('icon-changed', iconChangedHandler) : void 0;
            };
          })(this)
        });
      }
      modifiedHandler = (function(_this) {
        return function() {
          return _this.updateModifiedStatus();
        };
      })(this);
      if (typeof this.item.onDidChangeModified === 'function') {
        onDidChangeModifiedDisposable = this.item.onDidChangeModified(modifiedHandler);
        if (Disposable.isDisposable(onDidChangeModifiedDisposable)) {
          this.subscriptions.add(onDidChangeModifiedDisposable);
        } else {
          console.warn("::onDidChangeModified does not return a valid Disposable!", this.item);
        }
      } else if (typeof this.item.on === 'function') {
        this.item.on('modified-status-changed', modifiedHandler);
        this.subscriptions.add({
          dispose: (function(_this) {
            return function() {
              var _base1;
              return typeof (_base1 = _this.item).off === "function" ? _base1.off('modified-status-changed', modifiedHandler) : void 0;
            };
          })(this)
        });
      }
      if (typeof this.item.onDidSave === 'function') {
        onDidSaveDisposable = this.item.onDidSave((function(_this) {
          return function(event) {
            _this.terminatePendingState();
            if (event.path !== _this.path) {
              _this.path = event.path;
              if (atom.config.get('tabs.enableVcsColoring')) {
                return _this.setupVcsStatus();
              }
            }
          };
        })(this));
        if (Disposable.isDisposable(onDidSaveDisposable)) {
          this.subscriptions.add(onDidSaveDisposable);
        } else {
          console.warn("::onDidSave does not return a valid Disposable!", this.item);
        }
      }
      this.subscriptions.add(atom.config.observe('tabs.showIcons', (function(_this) {
        return function() {
          return _this.updateIconVisibility();
        };
      })(this)));
      return this.subscriptions.add(atom.config.observe('tabs.enableVcsColoring', (function(_this) {
        return function(isEnabled) {
          if (isEnabled && (_this.path != null)) {
            return _this.setupVcsStatus();
          } else {
            return _this.unsetVcsStatus();
          }
        };
      })(this)));
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
      if (!this.hasBeenMousedOver) {
        return;
      }
      this.destroyTooltip();
      if (this.path) {
        return this.tooltip = atom.tooltips.add(this, {
          title: this.path,
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
      var _ref1;
      if (!this.hasBeenMousedOver) {
        return;
      }
      return (_ref1 = this.tooltip) != null ? _ref1.dispose() : void 0;
    };

    TabView.prototype.destroy = function() {
      var _ref1, _ref2, _ref3;
      if ((_ref1 = this.subscriptions) != null) {
        _ref1.dispose();
      }
      if ((_ref2 = this.mouseEnterSubscription) != null) {
        _ref2.dispose();
      }
      if ((_ref3 = this.repoSubscriptions) != null) {
        _ref3.dispose();
      }
      this.destroyTooltip();
      return this.remove();
    };

    TabView.prototype.updateDataAttributes = function() {
      var itemClass, _ref1;
      if (this.path) {
        this.itemTitle.dataset.name = path.basename(this.path);
        this.itemTitle.dataset.path = this.path;
      } else {
        delete this.itemTitle.dataset.name;
        delete this.itemTitle.dataset.path;
      }
      if (itemClass = (_ref1 = this.item.constructor) != null ? _ref1.name : void 0) {
        return this.dataset.type = itemClass;
      } else {
        return delete this.dataset.type;
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
        this.itemTitle.textContent = title;
      } else {
        title = this.item.getTitle();
        useLongTitle = false;
        _ref3 = this.getTabs();
        for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
          tab = _ref3[_i];
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
          title = (_ref4 = typeof (_base1 = this.item).getLongTitle === "function" ? _base1.getLongTitle() : void 0) != null ? _ref4 : title;
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
      var _ref1, _ref2;
      return (_ref1 = (_ref2 = this.parentElement) != null ? _ref2.querySelectorAll('.tab') : void 0) != null ? _ref1 : [];
    };

    TabView.prototype.isItemPending = function() {
      if (this.pane.getPendingItem != null) {
        return this.pane.getPendingItem() === this.item;
      } else if (this.item.isPending != null) {
        return this.item.isPending();
      }
    };

    TabView.prototype.terminatePendingState = function() {
      if (this.pane.clearPendingItem != null) {
        if (this.pane.getPendingItem() === this.item) {
          return this.pane.clearPendingItem();
        }
      } else if (this.item.terminatePendingState != null) {
        return this.item.terminatePendingState();
      }
    };

    TabView.prototype.clearPending = function() {
      this.itemTitle.classList.remove('temp');
      return this.classList.remove('pending-tab');
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

    TabView.prototype.setupVcsStatus = function() {
      if (this.path == null) {
        return;
      }
      return this.repoForPath(this.path).then((function(_this) {
        return function(repo) {
          _this.subscribeToRepo(repo);
          return _this.updateVcsStatus(repo);
        };
      })(this));
    };

    TabView.prototype.subscribeToRepo = function(repo) {
      var _ref1;
      if (repo == null) {
        return;
      }
      if ((_ref1 = this.repoSubscriptions) != null) {
        _ref1.dispose();
      }
      this.repoSubscriptions = new CompositeDisposable();
      this.repoSubscriptions.add(repo.onDidChangeStatus((function(_this) {
        return function(event) {
          if (event.path === _this.path) {
            return _this.updateVcsStatus(repo, event.pathStatus);
          }
        };
      })(this)));
      return this.repoSubscriptions.add(repo.onDidChangeStatuses((function(_this) {
        return function() {
          return _this.updateVcsStatus(repo);
        };
      })(this)));
    };

    TabView.prototype.repoForPath = function() {
      var dir, _i, _len, _ref1;
      _ref1 = atom.project.getDirectories();
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        dir = _ref1[_i];
        if (dir.contains(this.path)) {
          return atom.project.repositoryForDirectory(dir);
        }
      }
      return Promise.resolve(null);
    };

    TabView.prototype.updateVcsStatus = function(repo, status) {
      var newStatus;
      if (repo == null) {
        return;
      }
      newStatus = null;
      if (repo.isPathIgnored(this.path)) {
        newStatus = 'ignored';
      } else {
        if (status == null) {
          status = repo.getCachedPathStatus(this.path);
        }
        if (repo.isStatusModified(status)) {
          newStatus = 'modified';
        } else if (repo.isStatusNew(status)) {
          newStatus = 'added';
        }
      }
      if (newStatus !== this.status) {
        this.status = newStatus;
        return this.updateVcsColoring();
      }
    };

    TabView.prototype.updateVcsColoring = function() {
      this.itemTitle.classList.remove('status-ignored', 'status-modified', 'status-added');
      if (this.status && atom.config.get('tabs.enableVcsColoring')) {
        return this.itemTitle.classList.add("status-" + this.status);
      }
    };

    TabView.prototype.unsetVcsStatus = function() {
      var _ref1;
      if ((_ref1 = this.repoSubscriptions) != null) {
        _ref1.dispose();
      }
      delete this.status;
      return this.updateVcsColoring();
    };

    return TabView;

  })(HTMLElement);

  module.exports = document.registerElement('tabs-tab', {
    prototype: TabView.prototype,
    "extends": 'li'
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RhYnMvbGliL3RhYi12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxvREFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUNBLE9BQW9DLE9BQUEsQ0FBUSxNQUFSLENBQXBDLEVBQUMsa0JBQUEsVUFBRCxFQUFhLDJCQUFBLG1CQURiLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osOEJBQUEsQ0FBQTs7OztLQUFBOztBQUFBLHNCQUFBLFVBQUEsR0FBWSxTQUFFLElBQUYsRUFBUyxJQUFULEdBQUE7QUFDVixVQUFBLFNBQUE7QUFBQSxNQURXLElBQUMsQ0FBQSxPQUFBLElBQ1osQ0FBQTtBQUFBLE1BRGtCLElBQUMsQ0FBQSxPQUFBLElBQ25CLENBQUE7QUFBQSxNQUFBLElBQUcsTUFBQSxDQUFBLElBQVEsQ0FBQSxJQUFJLENBQUMsT0FBYixLQUF3QixVQUEzQjtBQUNFLFFBQUEsSUFBQyxDQUFBLElBQUQsR0FBUSxJQUFDLENBQUEsSUFBSSxDQUFDLE9BQU4sQ0FBQSxDQUFSLENBREY7T0FBQTtBQUdBLE1BQUEsSUFBRyxDQUFDLFlBQUQsRUFBZSxVQUFmLENBQTBCLENBQUMsT0FBM0IsQ0FBbUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFwRCxDQUFBLEdBQTRELENBQUEsQ0FBL0Q7QUFDRSxRQUFBLElBQUMsQ0FBQSxTQUFTLENBQUMsR0FBWCxDQUFlLFlBQWYsQ0FBQSxDQURGO09BSEE7QUFBQSxNQUtBLElBQUMsQ0FBQSxTQUFTLENBQUMsR0FBWCxDQUFlLEtBQWYsRUFBc0IsVUFBdEIsQ0FMQSxDQUFBO0FBQUEsTUFPQSxJQUFDLENBQUEsU0FBRCxHQUFh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

//# sourceURL=/Users/ah/.atom/packages/tabs/lib/tab-view.coffee
