(function() {
  var $, CompositeDisposable, Disposable, TabView, path, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  path = require('path');

  $ = require('atom-space-pen-views').$;

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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RhYnMvbGliL3RhYi12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx1REFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUNDLElBQUssT0FBQSxDQUFRLHNCQUFSLEVBQUwsQ0FERCxDQUFBOztBQUFBLEVBRUEsT0FBb0MsT0FBQSxDQUFRLE1BQVIsQ0FBcEMsRUFBQyxrQkFBQSxVQUFELEVBQWEsMkJBQUEsbUJBRmIsQ0FBQTs7QUFBQSxFQUlBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSiw4QkFBQSxDQUFBOzs7O0tBQUE7O0FBQUEsc0JBQUEsVUFBQSxHQUFZLFNBQUUsSUFBRixHQUFBO0FBQ1YsVUFBQSxTQUFBO0FBQUEsTUFEVyxJQUFDLENBQUEsT0FBQSxJQUNaLENBQUE7QUFBQSxNQUFBLElBQUcsTUFBQSxDQUFBLElBQVEsQ0FBQSxJQUFJLENBQUMsT0FBYixLQUF3QixVQUEzQjtBQUNFLFFBQUEsSUFBQyxDQUFBLElBQUQsR0FBUSxJQUFDLENBQUEsSUFBSSxDQUFDLE9BQU4sQ0FBQSxDQUFSLENBQUE7QUFBQSxRQUNBLElBQUMsQ0FBQSxZQUFELEdBQWdCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixxQkFBaEIsQ0FEaEIsQ0FERjtPQUFBO0FBQUEsTUFJQSxJQUFDLENBQUEsU0FBUyxDQUFDLEdBQVgsQ0FBZSxLQUFmLEVBQXNCLFVBQXRCLENBSkEsQ0FBQTtBQUFBLE1BTUEsSUFBQyxDQUFBLFNBQUQsR0FBYSxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QixDQU5iLENBQUE7QUFBQSxNQU9BLElBQUMsQ0FBQSxTQUFTLENBQUMsU0FBUyxDQUFDLEdBQXJCLENB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

//# sourceURL=/Users/ah/.atom/packages/tabs/lib/tab-view.coffee
