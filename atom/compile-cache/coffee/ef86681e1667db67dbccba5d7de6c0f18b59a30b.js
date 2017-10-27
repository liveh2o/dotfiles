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
      if (['TextEditor', 'TestView'].indexOf(this.item.constructor.name) > -1) {
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
      this.subscriptions.add(this.pane.onDidDestroy((function(_this) {
        return function() {
          return _this.destroy();
        };
      })(this)));
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
      } else if ((this.path != null) && (this.iconName = FileIcons.getService().iconClassForPath(this.path, "tabs"))) {
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RhYnMvbGliL3RhYi12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSx1RUFBQTtJQUFBOztzQkFBQTs7QUFBQSxFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUFQLENBQUE7O0FBQUEsRUFDQSxPQUFvQyxPQUFBLENBQVEsTUFBUixDQUFwQyxFQUFDLGtCQUFBLFVBQUQsRUFBYSwyQkFBQSxtQkFEYixDQUFBOztBQUFBLEVBRUEsU0FBQSxHQUFZLE9BQUEsQ0FBUSxjQUFSLENBRlosQ0FBQTs7QUFBQSxFQUlBLE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUixDQUpULENBQUE7O0FBQUEsRUFNQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osOEJBQUEsQ0FBQTs7OztLQUFBOztBQUFBLHNCQUFBLFVBQUEsR0FBWSxTQUFFLElBQUYsRUFBUyxJQUFULEdBQUE7QUFDVixVQUFBLFNBQUE7QUFBQSxNQURXLElBQUMsQ0FBQSxPQUFBLElBQ1osQ0FBQTtBQUFBLE1BRGtCLElBQUMsQ0FBQSxPQUFBLElBQ25CLENBQUE7QUFBQSxNQUFBLElBQUcsTUFBQSxDQUFBLElBQVEsQ0FBQSxJQUFJLENBQUMsT0FBYixLQUF3QixVQUEzQjtBQUNFLFFBQUEsSUFBQyxDQUFBLElBQUQsR0FBUSxJQUFDLENBQUEsSUFBSSxDQUFDLE9BQU4sQ0FBQSxDQUFSLENBREY7T0FBQTtBQUdBLE1BQUEsSUFBRyxDQUFDLFlBQUQsRUFBZSxVQUFmLENBQTBCLENBQUMsT0FBM0IsQ0FBbUMsSUFBQyxDQUFBLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBckQsQ0FBQSxHQUE2RCxDQUFBLENBQWhFO0FBQ0UsUUFBQSxJQUFDLENBQUEsU0FBUyxDQUFDLEdBQVgsQ0FBZSxZQUFmLENBQUEsQ0FERjtPQUhBO0FBQUEsTUFLQSxJQUFDLENBQUEsU0FBUyxDQUFDLEdBQVgsQ0FBZSxLQUFmLEVBQXNCLFVBQXRCLENBTEEsQ0FBQTtBQUFBLE1BT0EsSUFBQyxDQUFBLFNBQUQsR0FBYSxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QixDQVBiLENBQUE7QUFBQSxNQVFBLElBQUMsQ0FBQSxTQUFTLENBQUMsU0FBUyxDQUFDLEdBQXJCLENBQXlCLE9BQXpCLENBUkEsQ0FBQTtBQUFBLE1BU0EsSUFBQyxDQUFBLFdBQUQsQ0FBYSxJQUFDLENBQUEsU0FBZCxDQVRBLENBQUE7QUFBQSxNQVdBLFNBQUEsR0FBWSxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QixDQVhaLENBQUE7QUFBQSxNQVlBLFNBQVMsQ0FBQyxTQUFTLENBQUMsR0FBcEIsQ0FBd0IsWUFBeEIsQ0FaQSxDQUFBO0FBQUEsTUFhQSxJQUFDLENBQUEsV0FBRCxDQUFhLFNBQWIsQ0FiQSxDQUFBO0FBQUEsTUFlQSxJQUFDLENBQUEsYUFBRCxHQUFxQixJQUFBLG1CQUFBLENBQUEsQ0FmckIsQ0FBQTtBQUFBLE1BaUJBLElBQUMsQ0FBQSxZQUFELENBQUEsQ0FqQkEsQ0FBQTtBQUFBLE1Ba0JBLElBQUMsQ0FBQSxvQkFBRCxDQUFBLENBbEJBLENBQUE7QUFBQSxNQW1CQSxJQUFDLENBQUEsV0FBRCxDQUFBLENBbkJBLENBQUE7QUFBQSxNQW9CQSxJQUFDLENBQUEsVUFBRCxDQUFBLENBcEJBLENBQUE7QUFBQSxNQXFCQSxJQUFDLENBQUEsb0JBQUQsQ0FBQSxDQXJCQSxDQUFBO0FBQUEsTUFzQkEsSUFBQyxDQUFBLFlBQUQsQ0FBQSxDQXRCQSxDQUFBO0FBd0JBLE1BQUEsSUFBRyxJQUFDLENBQUEsYUFBRCxDQUFBLENBQUg7QUFDRSxRQUFBLElBQUMsQ0FBQSxTQUFTLENBQUMsU0FBUyxDQUFDLEdBQXJCLENBQXlCLE1BQXpCLENBQUEsQ0FBQTtBQUFBLFFBQ0EsSUFBQyxDQUFBLFNBQVMsQ0FBQyxHQUFYLENBQWUsYUFBZixDQURBLENBREY7T0F4QkE7QUFBQSxNQTRCQSxJQUFDLENBQUEsTUFBRCxHQUFVLFNBQUMsQ0FBRCxHQUFBO2VBQU8sTUFBTSxDQUFDLElBQVAsQ0FBWSxDQUFaLEVBQVA7TUFBQSxDQTVCVixDQUFBO2FBNkJBLElBQUMsQ0FBQSxTQUFELEdBQWEsU0FBQyxDQUFELEdBQUE7ZUFBTyxNQUFNLENBQUMsR0FBUCxDQUFXLENBQVgsRUFBUDtNQUFBLEVBOUJIO0lBQUEsQ0FBWixDQUFBOztBQUFBLHNCQWdDQSxZQUFBLEdBQWMsU0FBQSxHQUFBO0FBQ1osVUFBQSwrUEFBQTtBQUFBLE1BQUEsbUJBQUEsR0FBc0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDcEIsS0FBQyxDQUFBLFdBQUQsQ0FBQSxFQURvQjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXRCLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFDLENBQUEsSUFBSSxDQUFDLFlBQU4sQ0FBbUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFBRyxLQUFDLENBQUEsT0FBRCxDQUFBLEVBQUg7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFuQixDQUFuQixDQUhBLENBQUE7QUFNQSxNQUFBLElBQUcsTUFBQSxDQUFBLElBQVEsQ0FBQSxJQUFJLENBQUMsOEJBQWIsS0FBK0MsVUFBbEQ7QUFDRSxRQUFBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFDLENBQUEsSUFBSSxDQUFDLDhCQUFOLENBQXFDLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQyxJQUFELEdBQUE7QUFDdEQsWUFBQSxJQUFtQixJQUFBLEtBQVEsS0FBQyxDQUFBLElBQTVCO3FCQUFBLEtBQUMsQ0FBQSxZQUFELENBQUEsRUFBQTthQURzRDtVQUFBLEVBQUE7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXJDLENBQW5CLENBQUEsQ0FERjtPQUFBLE1BR0ssSUFBRyxNQUFBLENBQUEsSUFBUSxDQUFBLElBQUksQ0FBQywwQkFBYixLQUEyQyxVQUE5QztBQUNILFFBQUEsb0NBQUEsR0FBdUMsSUFBQyxDQUFBLElBQUksQ0FBQywwQkFBTixDQUFpQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTttQkFBRyxLQUFDLENBQUEsWUFBRCxDQUFBLEVBQUg7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFqQyxDQUF2QyxDQUFBO0FBQ0EsUUFBQSxJQUFHLFVBQVUsQ0FBQyxZQUFYLENBQXdCLG9DQUF4QixDQUFIO0FBQ0UsVUFBQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsb0NBQW5CLENBQUEsQ0FERjtTQUFBLE1BQUE7QUFHRSxVQUFBLE9BQU8sQ0FBQyxJQUFSLENBQWEsa0VBQWIsRUFBaUYsSUFBQyxDQUFBLElBQWxGLENBQUEsQ0FIRjtTQUZHO09BVEw7QUFnQkEsTUFBQSxJQUFHLE1BQUEsQ0FBQSxJQUFRLENBQUEsSUFBSSxDQUFDLGdCQUFiLEtBQWlDLFVBQXBDO0FBQ0UsUUFBQSwwQkFBQSxHQUE2QixJQUFDLENBQUEsSUFBSSxDQUFDLGdCQUFOLENBQXVCLG1CQUF2QixDQUE3QixDQUFBO0FBQ0EsUUFBQSxJQUFHLFVBQVUsQ0FBQyxZQUFYLENBQXdCLDBCQUF4QixDQUFIO0FBQ0UsVUFBQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsMEJBQW5CLENBQUEsQ0FERjtTQUFBLE1BQUE7QUFHRSxVQUFBLE9BQU8sQ0FBQyxJQUFSLENBQWEsd0RBQWIsRUFBdUUsSUFBQyxDQUFBLElBQXhFLENBQUEsQ0FIRjtTQUZGO09BQUEsTUFNSyxJQUFHLE1BQUEsQ0FBQSxJQUFRLENBQUEsSUFBSSxDQUFDLEVBQWIsS0FBbUIsVUFBdEI7QUFFSCxRQUFBLElBQUMsQ0FBQSxJQUFJLENBQUMsRUFBTixDQUFTLGVBQVQsRUFBMEIsbUJBQTFCLENBQUEsQ0FBQTtBQUFBLFFBQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CO0FBQUEsVUFBQSxPQUFBLEVBQVMsQ0FBQSxTQUFBLEtBQUEsR0FBQTttQkFBQSxTQUFBLEdBQUE7QUFDMUIsa0JBQUEsS0FBQTsyRUFBSyxDQUFDLElBQUssaUJBQWlCLDhCQURGO1lBQUEsRUFBQTtVQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBVDtTQUFuQixDQURBLENBRkc7T0F0Qkw7QUFBQSxNQTRCQSxrQkFBQSxHQUFxQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBRSxJQUFGLEdBQUE7QUFDbkIsVUFEb0IsS0FBQyxDQUFBLE9BQUEsSUFDckIsQ0FBQTtBQUFBLFVBQUEsS0FBQyxDQUFBLG9CQUFELENBQUEsQ0FBQSxDQUFBO0FBQUEsVUFDQSxLQUFDLENBQUEsV0FBRCxDQUFBLENBREEsQ0FBQTtpQkFFQSxLQUFDLENBQUEsYUFBRCxDQUFBLEVBSG1CO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0E1QnJCLENBQUE7QUFpQ0EsTUFBQSxJQUFHLE1BQUEsQ0FBQSxJQUFRLENBQUEsSUFBSSxDQUFDLGVBQWIsS0FBZ0MsVUFBbkM7QUFDRSxRQUFBLHlCQUFBLEdBQTRCLElBQUMsQ0FBQSxJQUFJLENBQUMsZUFBTixDQUFzQixrQkFBdEIsQ0FBNUIsQ0FBQTtBQUNBLFFBQUEsSUFBRyxVQUFVLENBQUMsWUFBWCxDQUF3Qix5QkFBeEIsQ0FBSDtBQUNFLFVBQUEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLHlCQUFuQixDQUFBLENBREY7U0FBQSxNQUFBO0FBR0UsVUFBQSxPQUFPLENBQUMsSUFBUixDQUFhLHVEQUFiLEVBQXNFLElBQUMsQ0FBQSxJQUF2RSxDQUFBLENBSEY7U0FGRjtPQUFBLE1BTUssSUFBRyxNQUFBLENBQUEsSUFBUSxDQUFBLElBQUksQ0FBQyxFQUFiLEtBQW1CLFVBQXRCO0FBRUgsUUFBQSxJQUFDLENBQUEsSUFBSSxDQUFDLEVBQU4sQ0FBUyxjQUFULEVBQXlCLGtCQUF6QixDQUFBLENBQUE7QUFBQSxRQUNBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQjtBQUFBLFVBQUEsT0FBQSxFQUFTLENBQUEsU0FBQSxLQUFBLEdBQUE7bUJBQUEsU0FBQSxHQUFBO0FBQzFCLGtCQUFBLEtBQUE7MkVBQUssQ0FBQyxJQUFLLGdCQUFnQiw2QkFERDtZQUFBLEVBQUE7VUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVQ7U0FBbkIsQ0FEQSxDQUZHO09BdkNMO0FBQUEsTUE2Q0Esa0JBQUEsR0FBcUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDbkIsS0FBQyxDQUFBLFVBQUQsQ0FBQSxFQURtQjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBN0NyQixDQUFBO0FBZ0RBLE1BQUEsSUFBRyxNQUFBLENBQUEsSUFBUSxDQUFBLElBQUksQ0FBQyxlQUFiLEtBQWdDLFVBQW5DO0FBQ0UsUUFBQSx5QkFBQSxvRUFBaUMsQ0FBQyxnQkFBaUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtpQkFBQSxTQUFBLEdBQUE7bUJBQ2pELEtBQUMsQ0FBQSxVQUFELENBQUEsRUFEaUQ7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxXQUFuRCxDQUFBO0FBRUEsUUFBQSxJQUFHLFVBQVUsQ0FBQyxZQUFYLENBQXdCLHlCQUF4QixDQUFIO0FBQ0UsVUFBQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIseUJBQW5CLENBQUEsQ0FERjtTQUFBLE1BQUE7QUFHRSxVQUFBLE9BQU8sQ0FBQyxJQUFSLENBQWEsdURBQWIsRUFBc0UsSUFBQyxDQUFBLElBQXZFLENBQUEsQ0FIRjtTQUhGO09BQUEsTUFPSyxJQUFHLE1BQUEsQ0FBQSxJQUFRLENBQUEsSUFBSSxDQUFDLEVBQWIsS0FBbUIsVUFBdEI7QUFFSCxRQUFBLElBQUMsQ0FBQSxJQUFJLENBQUMsRUFBTixDQUFTLGNBQVQsRUFBeUIsa0JBQXpCLENBQUEsQ0FBQTtBQUFBLFFBQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CO0FBQUEsVUFBQSxPQUFBLEVBQVMsQ0FBQSxTQUFBLEtBQUEsR0FBQTttQkFBQSxTQUFBLEdBQUE7QUFDMUIsa0JBQUEsTUFBQTs2RUFBSyxDQUFDLElBQUssZ0JBQWdCLDZCQUREO1lBQUEsRUFBQTtVQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBVDtTQUFuQixDQURBLENBRkc7T0F2REw7QUFBQSxNQTZEQSxlQUFBLEdBQWtCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQ2hCLEtBQUMsQ0FBQSxvQkFBRCxDQUFBLEVBRGdCO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0E3RGxCLENBQUE7QUFnRUEsTUFBQSxJQUFHLE1BQUEsQ0FBQSxJQUFRLENBQUEsSUFBSSxDQUFDLG1CQUFiLEtBQW9DLFVBQXZDO0FBQ0UsUUFBQSw2QkFBQSxHQUFnQyxJQUFDLENBQUEsSUFBSSxDQUFDLG1CQUFOLENBQTBCLGVBQTFCLENBQWhDLENBQUE7QUFDQSxRQUFBLElBQUcsVUFBVSxDQUFDLFlBQVgsQ0FBd0IsNkJBQXhCLENBQUg7QUFDRSxVQUFBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQiw2QkFBbkIsQ0FBQSxDQURGO1NBQUEsTUFBQTtBQUdFLFVBQUEsT0FBTyxDQUFDLElBQVIsQ0FBYSwyREFBYixFQUEwRSxJQUFDLENBQUEsSUFBM0UsQ0FBQSxDQUhGO1NBRkY7T0FBQSxNQU1LLElBQUcsTUFBQSxDQUFBLElBQVEsQ0FBQSxJQUFJLENBQUMsRUFBYixLQUFtQixVQUF0QjtBQUVILFFBQUEsSUFBQyxDQUFBLElBQUksQ0FBQyxFQUFOLENBQVMseUJBQVQsRUFBb0MsZUFBcEMsQ0FBQSxDQUFBO0FBQUEsUUFDQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUI7QUFBQSxVQUFBLE9BQUEsRUFBUyxDQUFBLFNBQUEsS0FBQSxHQUFBO21CQUFBLFNBQUEsR0FBQTtBQUMxQixrQkFBQSxNQUFBOzZFQUFLLENBQUMsSUFBSywyQkFBMkIsMEJBRFo7WUFBQSxFQUFBO1VBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFUO1NBQW5CLENBREEsQ0FGRztPQXRFTDtBQTRFQSxNQUFBLElBQUcsTUFBQSxDQUFBLElBQVEsQ0FBQSxJQUFJLENBQUMsU0FBYixLQUEwQixVQUE3QjtBQUNFLFFBQUEsbUJBQUEsR0FBc0IsSUFBQyxDQUFBLElBQUksQ0FBQyxTQUFOLENBQWdCLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQyxLQUFELEdBQUE7QUFDcEMsWUFBQSxLQUFDLENBQUEscUJBQUQsQ0FBQSxDQUFBLENBQUE7QUFDQSxZQUFBLElBQUcsS0FBSyxDQUFDLElBQU4sS0FBZ0IsS0FBQyxDQUFBLElBQXBCO0FBQ0UsY0FBQSxLQUFDLENBQUEsSUFBRCxHQUFRLEtBQUssQ0FBQyxJQUFkLENBQUE7QUFDQSxjQUFBLElBQXFCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix3QkFBaEIsQ0FBckI7dUJBQUEsS0FBQyxDQUFBLGNBQUQsQ0FBQSxFQUFBO2VBRkY7YUFGb0M7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFoQixDQUF0QixDQUFBO0FBTUEsUUFBQSxJQUFHLFVBQVUsQ0FBQyxZQUFYLENBQXdCLG1CQUF4QixDQUFIO0FBQ0UsVUFBQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsbUJBQW5CLENBQUEsQ0FERjtTQUFBLE1BQUE7QUFHRSxVQUFBLE9BQU8sQ0FBQyxJQUFSLENBQWEsaURBQWIsRUFBZ0UsSUFBQyxDQUFBLElBQWpFLENBQUEsQ0FIRjtTQVBGO09BNUVBO0FBQUEsTUF1RkEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBWixDQUFvQixnQkFBcEIsRUFBc0MsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDdkQsS0FBQyxDQUFBLG9CQUFELENBQUEsRUFEdUQ7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF0QyxDQUFuQixDQXZGQSxDQUFBO2FBMEZBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0Isd0JBQXBCLEVBQThDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLFNBQUQsR0FBQTtBQUMvRCxVQUFBLElBQUcsU0FBQSxJQUFjLG9CQUFqQjttQkFBNkIsS0FBQyxDQUFBLGNBQUQsQ0FBQSxFQUE3QjtXQUFBLE1BQUE7bUJBQW9ELEtBQUMsQ0FBQSxjQUFELENBQUEsRUFBcEQ7V0FEK0Q7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE5QyxDQUFuQixFQTNGWTtJQUFBLENBaENkLENBQUE7O0FBQUEsc0JBOEhBLFlBQUEsR0FBYyxTQUFBLEdBQUE7QUFFWixVQUFBLFlBQUE7QUFBQSxNQUFBLFlBQUEsR0FBZSxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ2IsVUFBQSxLQUFDLENBQUEsc0JBQXNCLENBQUMsT0FBeEIsQ0FBQSxDQUFBLENBQUE7QUFBQSxVQUNBLEtBQUMsQ0FBQSxpQkFBRCxHQUFxQixJQURyQixDQUFBO0FBQUEsVUFFQSxLQUFDLENBQUEsYUFBRCxDQUFBLENBRkEsQ0FBQTtpQkFLQSxLQUFDLENBQUEsYUFBRCxDQUFtQixJQUFBLFdBQUEsQ0FBWSxZQUFaLEVBQTBCO0FBQUEsWUFBQSxPQUFBLEVBQVMsSUFBVDtXQUExQixDQUFuQixFQU5hO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBZixDQUFBO0FBQUEsTUFRQSxJQUFDLENBQUEsc0JBQUQsR0FBMEI7QUFBQSxRQUFBLE9BQUEsRUFBUyxDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTtBQUNqQyxZQUFBLEtBQUMsQ0FBQSxtQkFBRCxDQUFxQixZQUFyQixFQUFtQyxZQUFuQyxDQUFBLENBQUE7bUJBQ0EsS0FBQyxDQUFBLHNCQUFELEdBQTBCLEtBRk87VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFUO09BUjFCLENBQUE7YUFZQSxJQUFDLENBQUEsZ0JBQUQsQ0FBa0IsWUFBbEIsRUFBZ0MsWUFBaEMsRUFkWTtJQUFBLENBOUhkLENBQUE7O0FBQUEsc0JBOElBLGFBQUEsR0FBZSxTQUFBLEdBQUE7QUFDYixNQUFBLElBQUEsQ0FBQSxJQUFlLENBQUEsaUJBQWY7QUFBQSxjQUFBLENBQUE7T0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLGNBQUQsQ0FBQSxDQUZBLENBQUE7QUFJQSxNQUFBLElBQUcsSUFBQyxDQUFBLElBQUo7ZUFDRSxJQUFDLENBQUEsT0FBRCxHQUFXLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixJQUFsQixFQUNUO0FBQUEsVUFBQSxLQUFBLEVBQU8sSUFBQyxDQUFBLElBQVI7QUFBQSxVQUNBLElBQUEsRUFBTSxLQUROO0FBQUEsVUFFQSxLQUFBLEVBQ0U7QUFBQSxZQUFBLElBQUEsRUFBTSxJQUFOO0FBQUEsWUFDQSxJQUFBLEVBQU0sR0FETjtXQUhGO0FBQUEsVUFLQSxTQUFBLEVBQVcsUUFMWDtTQURTLEVBRGI7T0FMYTtJQUFBLENBOUlmLENBQUE7O0FBQUEsc0JBNEpBLGNBQUEsR0FBZ0IsU0FBQSxHQUFBO0FBQ2QsVUFBQSxLQUFBO0FBQUEsTUFBQSxJQUFBLENBQUEsSUFBZSxDQUFBLGlCQUFmO0FBQUEsY0FBQSxDQUFBO09BQUE7bURBQ1EsQ0FBRSxPQUFWLENBQUEsV0FGYztJQUFBLENBNUpoQixDQUFBOztBQUFBLHNCQWdLQSxPQUFBLEdBQVMsU0FBQSxHQUFBO0FBQ1AsVUFBQSxtQkFBQTs7YUFBYyxDQUFFLE9BQWhCLENBQUE7T0FBQTs7YUFDdUIsQ0FBRSxPQUF6QixDQUFBO09BREE7O2FBRWtCLENBQUUsT0FBcEIsQ0FBQTtPQUZBO0FBQUEsTUFHQSxJQUFDLENBQUEsY0FBRCxDQUFBLENBSEEsQ0FBQTthQUlBLElBQUMsQ0FBQSxNQUFELENBQUEsRUFMTztJQUFBLENBaEtULENBQUE7O0FBQUEsc0JBdUtBLG9CQUFBLEdBQXNCLFNBQUEsR0FBQTtBQUNwQixVQUFBLGdCQUFBO0FBQUEsTUFBQSxJQUFHLElBQUMsQ0FBQSxJQUFKO0FBQ0UsUUFBQSxJQUFDLENBQUEsU0FBUyxDQUFDLE9BQU8sQ0FBQyxJQUFuQixHQUEwQixJQUFJLENBQUMsUUFBTCxDQUFjLElBQUMsQ0FBQSxJQUFmLENBQTFCLENBQUE7QUFBQSxRQUNBLElBQUMsQ0FBQSxTQUFTLENBQUMsT0FBTyxDQUFDLElBQW5CLEdBQTBCLElBQUMsQ0FBQSxJQUQzQixDQURGO09BQUEsTUFBQTtBQUlFLFFBQUEsTUFBQSxDQUFBLElBQVEsQ0FBQSxTQUFTLENBQUMsT0FBTyxDQUFDLElBQTFCLENBQUE7QUFBQSxRQUNBLE1BQUEsQ0FBQSxJQUFRLENBQUEsU0FBUyxDQUFDLE9BQU8sQ0FBQyxJQUQxQixDQUpGO09BQUE7QUFPQSxNQUFBLElBQUcsU0FBQSxrREFBNkIsQ0FBRSxhQUFsQztlQUNFLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxHQUFnQixVQURsQjtPQUFBLE1BQUE7ZUFHRSxNQUFBLENBQUEsSUFBUSxDQUFBLE9BQU8sQ0FBQyxLQUhsQjtPQVJvQjtJQUFBLENBdkt0QixDQUFBOztBQUFBLHNCQW9MQSxXQUFBLEdBQWEsU0FBQyxJQUFELEdBQUE7QUFDWCxVQUFBLDZGQUFBO0FBQUEsNkJBRFksT0FBK0IsSUFBOUIsdUJBQUEsZ0JBQWdCLHFCQUFBLFlBQzdCLENBQUE7QUFBQSxNQUFBLElBQVUsSUFBQyxDQUFBLGFBQVg7QUFBQSxjQUFBLENBQUE7T0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLGFBQUQsR0FBaUIsSUFEakIsQ0FBQTtBQUdBLE1BQUEsSUFBRyxjQUFBLEtBQWtCLEtBQXJCO0FBQ0UsUUFBQSxLQUFBLEdBQVEsSUFBQyxDQUFBLElBQUksQ0FBQyxRQUFOLENBQUEsQ0FBUixDQUFBO0FBQ0EsUUFBQSxJQUF5QyxZQUF6QztBQUFBLFVBQUEsS0FBQSxzSEFBZ0MsS0FBaEMsQ0FBQTtTQURBO0FBQUEsUUFFQSxJQUFDLENBQUEsU0FBUyxDQUFDLFdBQVgsR0FBeUIsS0FGekIsQ0FERjtPQUFBLE1BQUE7QUFLRSxRQUFBLEtBQUEsR0FBUSxJQUFDLENBQUEsSUFBSSxDQUFDLFFBQU4sQ0FBQSxDQUFSLENBQUE7QUFBQSxRQUNBLFlBQUEsR0FBZSxLQURmLENBQUE7QUFFQTtBQUFBLGFBQUEsNENBQUE7MEJBQUE7Y0FBMkIsR0FBQSxLQUFTO0FBQ2xDLFlBQUEsSUFBRyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVQsQ0FBQSxDQUFBLEtBQXVCLEtBQTFCO0FBQ0UsY0FBQSxHQUFHLENBQUMsV0FBSixDQUFnQjtBQUFBLGdCQUFBLGNBQUEsRUFBZ0IsS0FBaEI7QUFBQSxnQkFBdUIsWUFBQSxFQUFjLElBQXJDO2VBQWhCLENBQUEsQ0FBQTtBQUFBLGNBQ0EsWUFBQSxHQUFlLElBRGYsQ0FERjs7V0FERjtBQUFBLFNBRkE7QUFNQSxRQUFBLElBQXlDLFlBQXpDO0FBQUEsVUFBQSxLQUFBLHdIQUFnQyxLQUFoQyxDQUFBO1NBTkE7QUFBQSxRQVFBLElBQUMsQ0FBQSxTQUFTLENBQUMsV0FBWCxHQUF5QixLQVJ6QixDQUxGO09BSEE7YUFrQkEsSUFBQyxDQUFBLGFBQUQsR0FBaUIsTUFuQk47SUFBQSxDQXBMYixDQUFBOztBQUFBLHNCQXlNQSxVQUFBLEdBQVksU0FBQSxHQUFBO0FBQ1YsVUFBQSwwQkFBQTtBQUFBLE1BQUEsSUFBRyxJQUFDLENBQUEsUUFBSjtBQUNFLFFBQUEsS0FBQSxHQUFRLENBQUEsS0FBWSxDQUFDLE9BQU4sQ0FBYyxJQUFDLENBQUEsUUFBZixDQUFQLEdBQXFDLElBQUMsQ0FBQSxRQUFRLENBQUMsS0FBVixDQUFnQixNQUFoQixDQUFyQyxHQUFrRSxJQUFDLENBQUEsUUFBM0UsQ0FBQTtBQUFBLFFBQ0EsU0FBQSxJQUFDLENBQUEsU0FBUyxDQUFDLFNBQVgsQ0FBb0IsQ0FBQyxNQUFyQixjQUE0QixDQUFBLE1BQUEsRUFBUyxPQUFBLEdBQU8sS0FBTSxDQUFBLENBQUEsQ0FBTSxTQUFBLGFBQUEsS0FBQSxDQUFBLENBQXhELENBREEsQ0FERjtPQUFBO0FBSUEsTUFBQSxJQUFHLElBQUMsQ0FBQSxRQUFELGdFQUFpQixDQUFDLHNCQUFyQjtlQUNFLElBQUMsQ0FBQSxTQUFTLENBQUMsU0FBUyxDQUFDLEdBQXJCLENBQXlCLE1BQXpCLEVBQWtDLE9BQUEsR0FBTyxJQUFDLENBQUEsUUFBMUMsRUFERjtPQUFBLE1BRUssSUFBRyxtQkFBQSxJQUFXLENBQUEsSUFBQyxDQUFBLFFBQUQsR0FBWSxTQUFTLENBQUMsVUFBVixDQUFBLENBQXNCLENBQUMsZ0JBQXZCLENBQXdDLElBQUMsQ0FBQSxJQUF6QyxFQUErQyxNQUEvQyxDQUFaLENBQWQ7QUFDSCxRQUFBLElBQUEsQ0FBQSxLQUFZLENBQUMsT0FBTixDQUFjLEtBQUEsR0FBUSxJQUFDLENBQUEsUUFBdkIsQ0FBUDtBQUNFLFVBQUEsS0FBQSxHQUFRLEtBQUssQ0FBQyxRQUFOLENBQUEsQ0FBZ0IsQ0FBQyxLQUFqQixDQUF1QixNQUF2QixDQUFSLENBREY7U0FBQTtlQUdBLFNBQUEsSUFBQyxDQUFBLFNBQVMsQ0FBQyxTQUFYLENBQW9CLENBQUMsR0FBckIsY0FBeUIsQ0FBQSxNQUFRLFNBQUEsYUFBQSxLQUFBLENBQUEsQ0FBakMsRUFKRztPQVBLO0lBQUEsQ0F6TVosQ0FBQTs7QUFBQSxzQkFzTkEsT0FBQSxHQUFTLFNBQUEsR0FBQTtBQUNQLFVBQUEsWUFBQTt3SEFBMkMsR0FEcEM7SUFBQSxDQXROVCxDQUFBOztBQUFBLHNCQXlOQSxhQUFBLEdBQWUsU0FBQSxHQUFBO0FBQ2IsTUFBQSxJQUFHLGdDQUFIO2VBQ0UsSUFBQyxDQUFBLElBQUksQ0FBQyxjQUFOLENBQUEsQ0FBQSxLQUEwQixJQUFDLENBQUEsS0FEN0I7T0FBQSxNQUVLLElBQUcsMkJBQUg7ZUFDSCxJQUFDLENBQUEsSUFBSSxDQUFDLFNBQU4sQ0FBQSxFQURHO09BSFE7SUFBQSxDQXpOZixDQUFBOztBQUFBLHNCQStOQSxxQkFBQSxHQUF1QixTQUFBLEdBQUE7QUFDckIsTUFBQSxJQUFHLGtDQUFIO0FBQ0UsUUFBQSxJQUE0QixJQUFDLENBQUEsSUFBSSxDQUFDLGNBQU4sQ0FBQSxDQUFBLEtBQTBCLElBQUMsQ0FBQSxJQUF2RDtpQkFBQSxJQUFDLENBQUEsSUFBSSxDQUFDLGdCQUFOLENBQUEsRUFBQTtTQURGO09BQUEsTUFFSyxJQUFHLHVDQUFIO2VBQ0gsSUFBQyxDQUFBLElBQUksQ0FBQyxxQkFBTixDQUFBLEVBREc7T0FIZ0I7SUFBQSxDQS9OdkIsQ0FBQTs7QUFBQSxzQkFxT0EsWUFBQSxHQUFjLFNBQUEsR0FBQTtBQUNaLE1BQUEsSUFBQyxDQUFBLFNBQVMsQ0FBQyxTQUFTLENBQUMsTUFBckIsQ0FBNEIsTUFBNUIsQ0FBQSxDQUFBO2FBQ0EsSUFBQyxDQUFBLFNBQVMsQ0FBQyxNQUFYLENBQWtCLGFBQWxCLEVBRlk7SUFBQSxDQXJPZCxDQUFBOztBQUFBLHNCQXlPQSxvQkFBQSxHQUFzQixTQUFBLEdBQUE7QUFDcEIsTUFBQSxJQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixnQkFBaEIsQ0FBSDtlQUNFLElBQUMsQ0FBQSxTQUFTLENBQUMsU0FBUyxDQUFDLE1BQXJCLENBQTRCLFdBQTVCLEVBREY7T0FBQSxNQUFBO2VBR0UsSUFBQyxDQUFBLFNBQVMsQ0FBQyxTQUFTLENBQUMsR0FBckIsQ0FBeUIsV0FBekIsRUFIRjtPQURvQjtJQUFBLENBek90QixDQUFBOztBQUFBLHNCQStPQSxvQkFBQSxHQUFzQixTQUFBLEdBQUE7QUFDcEIsVUFBQSxLQUFBO0FBQUEsTUFBQSxnRUFBUSxDQUFDLHFCQUFUO0FBQ0UsUUFBQSxJQUFBLENBQUEsSUFBbUMsQ0FBQSxVQUFuQztBQUFBLFVBQUEsSUFBQyxDQUFBLFNBQVMsQ0FBQyxHQUFYLENBQWUsVUFBZixDQUFBLENBQUE7U0FBQTtlQUNBLElBQUMsQ0FBQSxVQUFELEdBQWMsS0FGaEI7T0FBQSxNQUFBO0FBSUUsUUFBQSxJQUFpQyxJQUFDLENBQUEsVUFBbEM7QUFBQSxVQUFBLElBQUMsQ0FBQSxTQUFTLENBQUMsTUFBWCxDQUFrQixVQUFsQixDQUFBLENBQUE7U0FBQTtlQUNBLElBQUMsQ0FBQSxVQUFELEdBQWMsTUFMaEI7T0FEb0I7SUFBQSxDQS9PdEIsQ0FBQTs7QUFBQSxzQkF1UEEsY0FBQSxHQUFnQixTQUFBLEdBQUE7QUFDZCxNQUFBLElBQWMsaUJBQWQ7QUFBQSxjQUFBLENBQUE7T0FBQTthQUNBLElBQUMsQ0FBQSxXQUFELENBQWEsSUFBQyxDQUFBLElBQWQsQ0FBbUIsQ0FBQyxJQUFwQixDQUF5QixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxJQUFELEdBQUE7QUFDdkIsVUFBQSxLQUFDLENBQUEsZUFBRCxDQUFpQixJQUFqQixDQUFBLENBQUE7aUJBQ0EsS0FBQyxDQUFBLGVBQUQsQ0FBaUIsSUFBakIsRUFGdUI7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF6QixFQUZjO0lBQUEsQ0F2UGhCLENBQUE7O0FBQUEsc0JBOFBBLGVBQUEsR0FBaUIsU0FBQyxJQUFELEdBQUE7QUFDZixVQUFBLEtBQUE7QUFBQSxNQUFBLElBQWMsWUFBZDtBQUFBLGNBQUEsQ0FBQTtPQUFBOzthQUdrQixDQUFFLE9BQXBCLENBQUE7T0FIQTtBQUFBLE1BSUEsSUFBQyxDQUFBLGlCQUFELEdBQXlCLElBQUEsbUJBQUEsQ0FBQSxDQUp6QixDQUFBO0FBQUEsTUFNQSxJQUFDLENBQUEsaUJBQWlCLENBQUMsR0FBbkIsQ0FBdUIsSUFBSSxDQUFDLGlCQUFMLENBQXVCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLEtBQUQsR0FBQTtBQUM1QyxVQUFBLElBQTRDLEtBQUssQ0FBQyxJQUFOLEtBQWMsS0FBQyxDQUFBLElBQTNEO21CQUFBLEtBQUMsQ0FBQSxlQUFELENBQWlCLElBQWpCLEVBQXVCLEtBQUssQ0FBQyxVQUE3QixFQUFBO1dBRDRDO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBdkIsQ0FBdkIsQ0FOQSxDQUFBO2FBUUEsSUFBQyxDQUFBLGlCQUFpQixDQUFDLEdBQW5CLENBQXVCLElBQUksQ0FBQyxtQkFBTCxDQUF5QixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUM5QyxLQUFDLENBQUEsZUFBRCxDQUFpQixJQUFqQixFQUQ4QztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXpCLENBQXZCLEVBVGU7SUFBQSxDQTlQakIsQ0FBQTs7QUFBQSxzQkEwUUEsV0FBQSxHQUFhLFNBQUEsR0FBQTtBQUNYLFVBQUEsb0JBQUE7QUFBQTtBQUFBLFdBQUEsNENBQUE7d0JBQUE7QUFDRSxRQUFBLElBQW1ELEdBQUcsQ0FBQyxRQUFKLENBQWEsSUFBQyxDQUFBLElBQWQsQ0FBbkQ7QUFBQSxpQkFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLHNCQUFiLENBQW9DLEdBQXBDLENBQVAsQ0FBQTtTQURGO0FBQUEsT0FBQTthQUVBLE9BQU8sQ0FBQyxPQUFSLENBQWdCLElBQWhCLEVBSFc7SUFBQSxDQTFRYixDQUFBOztBQUFBLHNCQWdSQSxlQUFBLEdBQWlCLFNBQUMsSUFBRCxFQUFPLE1BQVAsR0FBQTtBQUNmLFVBQUEsU0FBQTtBQUFBLE1BQUEsSUFBYyxZQUFkO0FBQUEsY0FBQSxDQUFBO09BQUE7QUFBQSxNQUVBLFNBQUEsR0FBWSxJQUZaLENBQUE7QUFHQSxNQUFBLElBQUcsSUFBSSxDQUFDLGFBQUwsQ0FBbUIsSUFBQyxDQUFBLElBQXBCLENBQUg7QUFDRSxRQUFBLFNBQUEsR0FBWSxTQUFaLENBREY7T0FBQSxNQUFBO0FBR0UsUUFBQSxJQUFnRCxjQUFoRDtBQUFBLFVBQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxtQkFBTCxDQUF5QixJQUFDLENBQUEsSUFBMUIsQ0FBVCxDQUFBO1NBQUE7QUFDQSxRQUFBLElBQUcsSUFBSSxDQUFDLGdCQUFMLENBQXNCLE1BQXRCLENBQUg7QUFDRSxVQUFBLFNBQUEsR0FBWSxVQUFaLENBREY7U0FBQSxNQUVLLElBQUcsSUFBSSxDQUFDLFdBQUwsQ0FBaUIsTUFBakIsQ0FBSDtBQUNILFVBQUEsU0FBQSxHQUFZLE9BQVosQ0FERztTQU5QO09BSEE7QUFZQSxNQUFBLElBQUcsU0FBQSxLQUFlLElBQUMsQ0FBQSxNQUFuQjtBQUNFLFFBQUEsSUFBQyxDQUFBLE1BQUQsR0FBVSxTQUFWLENBQUE7ZUFDQSxJQUFDLENBQUEsaUJBQUQsQ0FBQSxFQUZGO09BYmU7SUFBQSxDQWhSakIsQ0FBQTs7QUFBQSxzQkFpU0EsaUJBQUEsR0FBbUIsU0FBQSxHQUFBO0FBQ2pCLE1BQUEsSUFBQyxDQUFBLFNBQVMsQ0FBQyxTQUFTLENBQUMsTUFBckIsQ0FBNEIsZ0JBQTVCLEVBQThDLGlCQUE5QyxFQUFrRSxjQUFsRSxDQUFBLENBQUE7QUFDQSxNQUFBLElBQUcsSUFBQyxDQUFBLE1BQUQsSUFBWSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isd0JBQWhCLENBQWY7ZUFDRSxJQUFDLENBQUEsU0FBUyxDQUFDLFNBQVMsQ0FBQyxHQUFyQixDQUEwQixTQUFBLEdBQVMsSUFBQyxDQUFBLE1BQXBDLEVBREY7T0FGaUI7SUFBQSxDQWpTbkIsQ0FBQTs7QUFBQSxzQkFzU0EsY0FBQSxHQUFnQixTQUFBLEdBQUE7QUFDZCxVQUFBLEtBQUE7O2FBQWtCLENBQUUsT0FBcEIsQ0FBQTtPQUFBO0FBQUEsTUFDQSxNQUFBLENBQUEsSUFBUSxDQUFBLE1BRFIsQ0FBQTthQUVBLElBQUMsQ0FBQSxpQkFBRCxDQUFBLEVBSGM7SUFBQSxDQXRTaEIsQ0FBQTs7bUJBQUE7O0tBRG9CLFlBUHRCLENBQUE7O0FBQUEsRUFtVEEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsUUFBUSxDQUFDLGVBQVQsQ0FBeUIsVUFBekIsRUFBcUM7QUFBQSxJQUFBLFNBQUEsRUFBVyxPQUFPLENBQUMsU0FBbkI7QUFBQSxJQUE4QixTQUFBLEVBQVMsSUFBdkM7R0FBckMsQ0FuVGpCLENBQUE7QUFBQSIKfQ==

//# sourceURL=/Users/ah/.atom/packages/tabs/lib/tab-view.coffee
