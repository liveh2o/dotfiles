(function() {
  var CompositeDisposable, Disposable, FileIcons, TabView, layout, path, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  path = require('path');

  _ref = require('atom'), Disposable = _ref.Disposable, CompositeDisposable = _ref.CompositeDisposable;

  FileIcons = require('./file-icons');

  layout = require('./layout');

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
        this.classList.add('pending-tab');
      }
      this.ondrag = function(e) {
        return layout.drag(e);
      };
      return this.ondragend = function(e) {
        return layout.end(e);
      };
    };

    TabView.prototype.handleEvents = function() {
      var iconChangedHandler, modifiedHandler, onDidChangeIconDisposable, onDidChangeModifiedDisposable, onDidChangePathDisposable, onDidChangeTitleDisposable, onDidSaveDisposable, onDidTerminatePendingStateDisposable, pathChangedHandler, titleChangedHandler, _base;
      titleChangedHandler = (function(_this) {
        return function() {
          return _this.updateTitle();
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
      pathChangedHandler = (function(_this) {
        return function(path) {
          _this.path = path;
          _this.updateDataAttributes();
          _this.updateTitle();
          return _this.updateTooltip();
        };
      })(this);
      if (typeof this.item.onDidChangePath === 'function') {
        onDidChangePathDisposable = this.item.onDidChangePath(pathChangedHandler);
        if (Disposable.isDisposable(onDidChangePathDisposable)) {
          this.subscriptions.add(onDidChangePathDisposable);
        } else {
          console.warn("::onDidChangePath does not return a valid Disposable!", this.item);
        }
      } else if (typeof this.item.on === 'function') {
        this.item.on('path-changed', pathChangedHandler);
        this.subscriptions.add({
          dispose: (function(_this) {
            return function() {
              var _base;
              return typeof (_base = _this.item).off === "function" ? _base.off('path-changed', pathChangedHandler) : void 0;
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
      var names, _base, _ref1, _ref2;
      if (this.iconName) {
        names = !Array.isArray(this.iconName) ? this.iconName.split(/\s+/g) : this.iconName;
        (_ref1 = this.itemTitle.classList).remove.apply(_ref1, ['icon', "icon-" + names[0]].concat(__slice.call(names)));
      }
      if (this.iconName = typeof (_base = this.item).getIconName === "function" ? _base.getIconName() : void 0) {
        return this.itemTitle.classList.add('icon', "icon-" + this.iconName);
      } else if ((this.path != null) && (this.iconName = FileIcons.getService().iconClassForPath(this.path, this))) {
        if (!Array.isArray(names = this.iconName)) {
          names = names.toString().split(/\s+/g);
        }
        return (_ref2 = this.itemTitle.classList).add.apply(_ref2, ['icon'].concat(__slice.call(names)));
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RhYnMvbGliL3RhYi12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx1RUFBQTtJQUFBOztzQkFBQTs7QUFBQSxFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUFQLENBQUE7O0FBQUEsRUFDQSxPQUFvQyxPQUFBLENBQVEsTUFBUixDQUFwQyxFQUFDLGtCQUFBLFVBQUQsRUFBYSwyQkFBQSxtQkFEYixDQUFBOztBQUFBLEVBRUEsU0FBQSxHQUFZLE9BQUEsQ0FBUSxjQUFSLENBRlosQ0FBQTs7QUFBQSxFQUlBLE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUixDQUpULENBQUE7O0FBQUEsRUFNQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osOEJBQUEsQ0FBQTs7OztLQUFBOztBQUFBLHNCQUFBLFVBQUEsR0FBWSxTQUFFLElBQUYsRUFBUyxJQUFULEdBQUE7QUFDVixVQUFBLFNBQUE7QUFBQSxNQURXLElBQUMsQ0FBQSxPQUFBLElBQ1osQ0FBQTtBQUFBLE1BRGtCLElBQUMsQ0FBQSxPQUFBLElBQ25CLENBQUE7QUFBQSxNQUFBLElBQUcsTUFBQSxDQUFBLElBQVEsQ0FBQSxJQUFJLENBQUMsT0FBYixLQUF3QixVQUEzQjtBQUNFLFFBQUEsSUFBQyxDQUFBLElBQUQsR0FBUSxJQUFDLENBQUEsSUFBSSxDQUFDLE9BQU4sQ0FBQSxDQUFSLENBREY7T0FBQTtBQUdBLE1BQUEsSUFBRyxDQUFDLFlBQUQsRUFBZSxVQUFmLENBQTBCLENBQUMsT0FBM0IsQ0FBbUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFwRCxDQUFBLEdBQTRELENBQUEsQ0FBL0Q7QUFDRSxRQUFBLElBQUMsQ0FBQSxTQUFTLENBQUMsR0FBWCxDQUFlLFlBQWYsQ0FBQSxDQURGO09BSEE7QUFB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

//# sourceURL=/Users/ah/.atom/packages/tabs/lib/tab-view.coffee
