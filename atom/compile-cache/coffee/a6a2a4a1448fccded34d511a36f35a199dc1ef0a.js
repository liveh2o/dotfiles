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

    TabView.prototype.initialize = function(item) {
      var closeIcon;
      this.item = item;
      if (typeof this.item.getPath === 'function') {
        this.path = this.item.getPath();
        this.isPreviewTab = atom.config.get('tabs.usePreviewTabs');
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
      if (this.isPreviewTab) {
        this.itemTitle.classList.add('temp');
        this.classList.add('preview-tab');
        return this.addEventListener('dblclick', (function(_this) {
          return function() {
            return _this.clearPreview();
          };
        })(this));
      }
    };

    TabView.prototype.handleEvents = function() {
      var iconChangedHandler, modifiedHandler, onDidChangeIconDisposable, onDidChangeModifiedDisposable, onDidChangeTitleDisposable, onDidSaveDisposable, titleChangedHandler, _base;
      titleChangedHandler = (function(_this) {
        return function() {
          _this.updateDataAttributes();
          _this.updateTitle();
          return _this.updateTooltip();
        };
      })(this);
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
            _this.clearPreview();
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

    TabView.prototype.clearPreview = function() {
      this.isPreviewTab = false;
      this.itemTitle.classList.remove('temp');
      return this.classList.remove('preview-tab');
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
        this.clearPreview();
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RhYnMvbGliL3RhYi12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxvREFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUNBLE9BQW9DLE9BQUEsQ0FBUSxNQUFSLENBQXBDLEVBQUMsa0JBQUEsVUFBRCxFQUFhLDJCQUFBLG1CQURiLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osOEJBQUEsQ0FBQTs7OztLQUFBOztBQUFBLHNCQUFBLFVBQUEsR0FBWSxTQUFFLElBQUYsR0FBQTtBQUNWLFVBQUEsU0FBQTtBQUFBLE1BRFcsSUFBQyxDQUFBLE9BQUEsSUFDWixDQUFBO0FBQUEsTUFBQSxJQUFHLE1BQUEsQ0FBQSxJQUFRLENBQUEsSUFBSSxDQUFDLE9BQWIsS0FBd0IsVUFBM0I7QUFDRSxRQUFBLElBQUMsQ0FBQSxJQUFELEdBQVEsSUFBQyxDQUFBLElBQUksQ0FBQyxPQUFOLENBQUEsQ0FBUixDQUFBO0FBQUEsUUFDQSxJQUFDLENBQUEsWUFBRCxHQUFnQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IscUJBQWhCLENBRGhCLENBREY7T0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLFNBQVMsQ0FBQyxHQUFYLENBQWUsS0FBZixFQUFzQixVQUF0QixDQUpBLENBQUE7QUFBQSxNQU1BLElBQUMsQ0FBQSxTQUFELEdBQWEsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsS0FBdkIsQ0FOYixDQUFBO0FBQUEsTUFPQSxJQUFDLENBQUEsU0FBUyxDQUFDLFNBQVMsQ0FBQyxHQUFyQixDQUF5QixPQUF6QixDQVBBLENBQUE7QUFBQSxNQVFBLElBQUMsQ0FBQSxXQUFELENB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

//# sourceURL=/Users/ah/.atom/packages/tabs/lib/tab-view.coffee
