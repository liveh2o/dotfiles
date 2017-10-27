(function() {
  var CompositeDisposable, Disposable, FileIcons, TabView, layout, path, ref,
    slice = [].slice;

  path = require('path');

  ref = require('atom'), Disposable = ref.Disposable, CompositeDisposable = ref.CompositeDisposable;

  FileIcons = require('./file-icons');

  layout = require('./layout');

  module.exports = TabView = (function() {
    function TabView(arg) {
      var closeIcon, didClickCloseIcon;
      this.item = arg.item, this.pane = arg.pane, didClickCloseIcon = arg.didClickCloseIcon, this.tabs = arg.tabs;
      if (typeof this.item.getPath === 'function') {
        this.path = this.item.getPath();
      }
      this.element = document.createElement('li');
      this.element.setAttribute('is', 'tabs-tab');
      if (['TextEditor', 'TestView'].indexOf(this.item.constructor.name) > -1) {
        this.element.classList.add('texteditor');
      }
      this.element.classList.add('tab', 'sortable');
      this.itemTitle = document.createElement('div');
      this.itemTitle.classList.add('title');
      this.element.appendChild(this.itemTitle);
      closeIcon = document.createElement('div');
      closeIcon.classList.add('close-icon');
      closeIcon.onclick = didClickCloseIcon;
      this.element.appendChild(closeIcon);
      this.subscriptions = new CompositeDisposable();
      this.handleEvents();
      this.updateDataAttributes();
      this.updateTitle();
      this.updateIcon();
      this.updateModifiedStatus();
      this.setupTooltip();
      if (this.isItemPending()) {
        this.itemTitle.classList.add('temp');
        this.element.classList.add('pending-tab');
      }
      this.element.ondrag = function(e) {
        return layout.drag(e);
      };
      this.element.ondragend = function(e) {
        return layout.end(e);
      };
      this.element.pane = this.pane;
      this.element.item = this.item;
      this.element.itemTitle = this.itemTitle;
      this.element.path = this.path;
    }

    TabView.prototype.handleEvents = function() {
      var base, iconChangedHandler, modifiedHandler, onDidChangeIconDisposable, onDidChangeModifiedDisposable, onDidChangePathDisposable, onDidChangeTitleDisposable, onDidSaveDisposable, onDidTerminatePendingStateDisposable, pathChangedHandler, titleChangedHandler;
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
              var base;
              return typeof (base = _this.item).off === "function" ? base.off('title-changed', titleChangedHandler) : void 0;
            };
          })(this)
        });
      }
      pathChangedHandler = (function(_this) {
        return function(path1) {
          _this.path = path1;
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
              var base;
              return typeof (base = _this.item).off === "function" ? base.off('path-changed', pathChangedHandler) : void 0;
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
        onDidChangeIconDisposable = typeof (base = this.item).onDidChangeIcon === "function" ? base.onDidChangeIcon((function(_this) {
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
              var base1;
              return typeof (base1 = _this.item).off === "function" ? base1.off('icon-changed', iconChangedHandler) : void 0;
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
              var base1;
              return typeof (base1 = _this.item).off === "function" ? base1.off('modified-status-changed', modifiedHandler) : void 0;
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
          return _this.element.dispatchEvent(new CustomEvent('mouseenter', {
            bubbles: true
          }));
        };
      })(this);
      this.mouseEnterSubscription = {
        dispose: (function(_this) {
          return function() {
            _this.element.removeEventListener('mouseenter', onMouseEnter);
            return _this.mouseEnterSubscription = null;
          };
        })(this)
      };
      return this.element.addEventListener('mouseenter', onMouseEnter);
    };

    TabView.prototype.updateTooltip = function() {
      if (!this.hasBeenMousedOver) {
        return;
      }
      this.destroyTooltip();
      if (this.path) {
        return this.tooltip = atom.tooltips.add(this.element, {
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
      var ref1;
      if (!this.hasBeenMousedOver) {
        return;
      }
      return (ref1 = this.tooltip) != null ? ref1.dispose() : void 0;
    };

    TabView.prototype.destroy = function() {
      var ref1, ref2, ref3;
      if ((ref1 = this.subscriptions) != null) {
        ref1.dispose();
      }
      if ((ref2 = this.mouseEnterSubscription) != null) {
        ref2.dispose();
      }
      if ((ref3 = this.repoSubscriptions) != null) {
        ref3.dispose();
      }
      this.destroyTooltip();
      return this.element.remove();
    };

    TabView.prototype.updateDataAttributes = function() {
      var itemClass, ref1;
      if (this.path) {
        this.itemTitle.dataset.name = path.basename(this.path);
        this.itemTitle.dataset.path = this.path;
      } else {
        delete this.itemTitle.dataset.name;
        delete this.itemTitle.dataset.path;
      }
      if (itemClass = (ref1 = this.item.constructor) != null ? ref1.name : void 0) {
        return this.element.dataset.type = itemClass;
      } else {
        return delete this.element.dataset.type;
      }
    };

    TabView.prototype.updateTitle = function(arg) {
      var base, base1, i, len, ref1, ref2, ref3, ref4, tab, title, updateSiblings, useLongTitle;
      ref1 = arg != null ? arg : {}, updateSiblings = ref1.updateSiblings, useLongTitle = ref1.useLongTitle;
      if (this.updatingTitle) {
        return;
      }
      this.updatingTitle = true;
      if (updateSiblings === false) {
        title = this.item.getTitle();
        if (useLongTitle) {
          title = (ref2 = typeof (base = this.item).getLongTitle === "function" ? base.getLongTitle() : void 0) != null ? ref2 : title;
        }
        this.itemTitle.textContent = title;
      } else {
        title = this.item.getTitle();
        useLongTitle = false;
        ref3 = this.tabs;
        for (i = 0, len = ref3.length; i < len; i++) {
          tab = ref3[i];
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
          title = (ref4 = typeof (base1 = this.item).getLongTitle === "function" ? base1.getLongTitle() : void 0) != null ? ref4 : title;
        }
        this.itemTitle.textContent = title;
      }
      return this.updatingTitle = false;
    };

    TabView.prototype.updateIcon = function() {
      var base, names, ref1, ref2;
      if (this.iconName) {
        names = !Array.isArray(this.iconName) ? this.iconName.split(/\s+/g) : this.iconName;
        (ref1 = this.itemTitle.classList).remove.apply(ref1, ['icon', "icon-" + names[0]].concat(slice.call(names)));
      }
      if (this.iconName = typeof (base = this.item).getIconName === "function" ? base.getIconName() : void 0) {
        return this.itemTitle.classList.add('icon', "icon-" + this.iconName);
      } else if ((this.path != null) && (this.iconName = FileIcons.getService().iconClassForPath(this.path, "tabs"))) {
        if (!Array.isArray(names = this.iconName)) {
          names = names.toString().split(/\s+/g);
        }
        return (ref2 = this.itemTitle.classList).add.apply(ref2, ['icon'].concat(slice.call(names)));
      }
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
      return this.element.classList.remove('pending-tab');
    };

    TabView.prototype.updateIconVisibility = function() {
      if (atom.config.get('tabs.showIcons')) {
        return this.itemTitle.classList.remove('hide-icon');
      } else {
        return this.itemTitle.classList.add('hide-icon');
      }
    };

    TabView.prototype.updateModifiedStatus = function() {
      var base;
      if (typeof (base = this.item).isModified === "function" ? base.isModified() : void 0) {
        if (!this.isModified) {
          this.element.classList.add('modified');
        }
        return this.isModified = true;
      } else {
        if (this.isModified) {
          this.element.classList.remove('modified');
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
      var ref1;
      if (repo == null) {
        return;
      }
      if ((ref1 = this.repoSubscriptions) != null) {
        ref1.dispose();
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
      var dir, i, len, ref1;
      ref1 = atom.project.getDirectories();
      for (i = 0, len = ref1.length; i < len; i++) {
        dir = ref1[i];
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
      var ref1;
      if ((ref1 = this.repoSubscriptions) != null) {
        ref1.dispose();
      }
      delete this.status;
      return this.updateVcsColoring();
    };

    return TabView;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RhYnMvbGliL3RhYi12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsc0VBQUE7SUFBQTs7RUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsTUFBb0MsT0FBQSxDQUFRLE1BQVIsQ0FBcEMsRUFBQywyQkFBRCxFQUFhOztFQUNiLFNBQUEsR0FBWSxPQUFBLENBQVEsY0FBUjs7RUFFWixNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVI7O0VBRVQsTUFBTSxDQUFDLE9BQVAsR0FDTTtJQUNTLGlCQUFDLEdBQUQ7QUFDWCxVQUFBO01BRGEsSUFBQyxDQUFBLFdBQUEsTUFBTSxJQUFDLENBQUEsV0FBQSxNQUFNLDJDQUFtQixJQUFDLENBQUEsV0FBQTtNQUMvQyxJQUFHLE9BQU8sSUFBQyxDQUFBLElBQUksQ0FBQyxPQUFiLEtBQXdCLFVBQTNCO1FBQ0UsSUFBQyxDQUFBLElBQUQsR0FBUSxJQUFDLENBQUEsSUFBSSxDQUFDLE9BQU4sQ0FBQSxFQURWOztNQUdBLElBQUMsQ0FBQSxPQUFELEdBQVcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsSUFBdkI7TUFDWCxJQUFDLENBQUEsT0FBTyxDQUFDLFlBQVQsQ0FBc0IsSUFBdEIsRUFBNEIsVUFBNUI7TUFDQSxJQUFHLENBQUMsWUFBRCxFQUFlLFVBQWYsQ0FBMEIsQ0FBQyxPQUEzQixDQUFtQyxJQUFDLENBQUEsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFyRCxDQUFBLEdBQTZELENBQUMsQ0FBakU7UUFDRSxJQUFDLENBQUEsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFuQixDQUF1QixZQUF2QixFQURGOztNQUVBLElBQUMsQ0FBQSxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQW5CLENBQXVCLEtBQXZCLEVBQThCLFVBQTlCO01BRUEsSUFBQyxDQUFBLFNBQUQsR0FBYSxRQUFRLENB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O1FBR0UsSUFBZ0QsY0FBaEQ7VUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLG1CQUFMLENBQXlCLElBQUMsQ0FBQSxJQUExQixFQUFUOztRQUNBLElBQUcsSUFBSSxDQUFDLGdCQUFMLENBQXNCLE1BQXRCLENBQUg7VUFDRSxTQUFBLEdBQVksV0FEZDtTQUFBLE1BRUssSUFBRyxJQUFJLENBQUMsV0FBTCxDQUFpQixNQUFqQixDQUFIO1VBQ0gsU0FBQSxHQUFZLFFBRFQ7U0FOUDs7TUFTQSxJQUFHLFNBQUEsS0FBZSxJQUFDLENBQUEsTUFBbkI7UUFDRSxJQUFDLENBQUEsTUFBRCxHQUFVO2VBQ1YsSUFBQyxDQUFBLGlCQUFELENBQUEsRUFGRjs7SUFiZTs7c0JBaUJqQixpQkFBQSxHQUFtQixTQUFBO01BQ2pCLElBQUMsQ0FBQSxTQUFTLENBQUMsU0FBUyxDQUFDLE1BQXJCLENBQTRCLGdCQUE1QixFQUE4QyxpQkFBOUMsRUFBa0UsY0FBbEU7TUFDQSxJQUFHLElBQUMsQ0FBQSxNQUFELElBQVksSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHdCQUFoQixDQUFmO2VBQ0UsSUFBQyxDQUFBLFNBQVMsQ0FBQyxTQUFTLENBQUMsR0FBckIsQ0FBeUIsU0FBQSxHQUFVLElBQUMsQ0FBQSxNQUFwQyxFQURGOztJQUZpQjs7c0JBS25CLGNBQUEsR0FBZ0IsU0FBQTtBQUNkLFVBQUE7O1lBQWtCLENBQUUsT0FBcEIsQ0FBQTs7TUFDQSxPQUFPLElBQUMsQ0FBQTthQUNSLElBQUMsQ0FBQSxpQkFBRCxDQUFBO0lBSGM7Ozs7O0FBblRsQiIsInNvdXJjZXNDb250ZW50IjpbInBhdGggPSByZXF1aXJlICdwYXRoJ1xue0Rpc3Bvc2FibGUsIENvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSAnYXRvbSdcbkZpbGVJY29ucyA9IHJlcXVpcmUgJy4vZmlsZS1pY29ucydcblxubGF5b3V0ID0gcmVxdWlyZSAnLi9sYXlvdXQnXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIFRhYlZpZXdcbiAgY29uc3RydWN0b3I6ICh7QGl0ZW0sIEBwYW5lLCBkaWRDbGlja0Nsb3NlSWNvbiwgQHRhYnN9KSAtPlxuICAgIGlmIHR5cGVvZiBAaXRlbS5nZXRQYXRoIGlzICdmdW5jdGlvbidcbiAgICAgIEBwYXRoID0gQGl0ZW0uZ2V0UGF0aCgpXG5cbiAgICBAZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJylcbiAgICBAZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2lzJywgJ3RhYnMtdGFiJylcbiAgICBpZiBbJ1RleHRFZGl0b3InLCAnVGVzdFZpZXcnXS5pbmRleE9mKEBpdGVtLmNvbnN0cnVjdG9yLm5hbWUpID4gLTFcbiAgICAgIEBlbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3RleHRlZGl0b3InKVxuICAgIEBlbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3RhYicsICdzb3J0YWJsZScpXG5cbiAgICBAaXRlbVRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICBAaXRlbVRpdGxlLmNsYXNzTGlzdC5hZGQoJ3RpdGxlJylcbiAgICBAZWxlbWVudC5hcHBlbmRDaGlsZChAaXRlbVRpdGxlKVxuXG4gICAgY2xvc2VJY29uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICBjbG9zZUljb24uY2xhc3NMaXN0LmFkZCgnY2xvc2UtaWNvbicpXG4gICAgY2xvc2VJY29uLm9uY2xpY2sgPSBkaWRDbGlja0Nsb3NlSWNvblxuICAgIEBlbGVtZW50LmFwcGVuZENoaWxkKGNsb3NlSWNvbilcblxuICAgIEBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuXG4gICAgQGhhbmRsZUV2ZW50cygpXG4gICAgQHVwZGF0ZURhdGFBdHRyaWJ1dGVzKClcbiAgICBAdXBkYXRlVGl0bGUoKVxuICAgIEB1cGRhdGVJY29uKClcbiAgICBAdXBkYXRlTW9kaWZpZWRTdGF0dXMoKVxuICAgIEBzZXR1cFRvb2x0aXAoKVxuXG4gICAgaWYgQGlzSXRlbVBlbmRpbmcoKVxuICAgICAgQGl0ZW1UaXRsZS5jbGFzc0xpc3QuYWRkKCd0ZW1wJylcbiAgICAgIEBlbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3BlbmRpbmctdGFiJylcblxuICAgIEBlbGVtZW50Lm9uZHJhZyA9IChlKSAtPiBsYXlvdXQuZHJhZyBlXG4gICAgQGVsZW1lbnQub25kcmFnZW5kID0gKGUpIC0+IGxheW91dC5lbmQgZVxuXG4gICAgQGVsZW1lbnQucGFuZSA9IEBwYW5lXG4gICAgQGVsZW1lbnQuaXRlbSA9IEBpdGVtXG4gICAgQGVsZW1lbnQuaXRlbVRpdGxlID0gQGl0ZW1UaXRsZVxuICAgIEBlbGVtZW50LnBhdGggPSBAcGF0aFxuXG4gIGhhbmRsZUV2ZW50czogLT5cbiAgICB0aXRsZUNoYW5nZWRIYW5kbGVyID0gPT5cbiAgICAgIEB1cGRhdGVUaXRsZSgpXG5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgQHBhbmUub25EaWREZXN0cm95ID0+IEBkZXN0cm95KClcblxuICAgICMgVE9ETzogcmVtb3ZlIGVsc2UgY29uZGl0aW9uIG9uY2UgcGVuZGluZyBBUEkgaXMgb24gc3RhYmxlIFtNS1RdXG4gICAgaWYgdHlwZW9mIEBwYW5lLm9uSXRlbURpZFRlcm1pbmF0ZVBlbmRpbmdTdGF0ZSBpcyAnZnVuY3Rpb24nXG4gICAgICBAc3Vic2NyaXB0aW9ucy5hZGQgQHBhbmUub25JdGVtRGlkVGVybWluYXRlUGVuZGluZ1N0YXRlIChpdGVtKSA9PlxuICAgICAgICBAY2xlYXJQZW5kaW5nKCkgaWYgaXRlbSBpcyBAaXRlbVxuICAgIGVsc2UgaWYgdHlwZW9mIEBpdGVtLm9uRGlkVGVybWluYXRlUGVuZGluZ1N0YXRlIGlzICdmdW5jdGlvbidcbiAgICAgIG9uRGlkVGVybWluYXRlUGVuZGluZ1N0YXRlRGlzcG9zYWJsZSA9IEBpdGVtLm9uRGlkVGVybWluYXRlUGVuZGluZ1N0YXRlID0+IEBjbGVhclBlbmRpbmcoKVxuICAgICAgaWYgRGlzcG9zYWJsZS5pc0Rpc3Bvc2FibGUob25EaWRUZXJtaW5hdGVQZW5kaW5nU3RhdGVEaXNwb3NhYmxlKVxuICAgICAgICBAc3Vic2NyaXB0aW9ucy5hZGQob25EaWRUZXJtaW5hdGVQZW5kaW5nU3RhdGVEaXNwb3NhYmxlKVxuICAgICAgZWxzZVxuICAgICAgICBjb25zb2xlLndhcm4gXCI6Om9uRGlkVGVybWluYXRlUGVuZGluZ1N0YXRlIGRvZXMgbm90IHJldHVybiBhIHZhbGlkIERpc3Bvc2FibGUhXCIsIEBpdGVtXG5cbiAgICBpZiB0eXBlb2YgQGl0ZW0ub25EaWRDaGFuZ2VUaXRsZSBpcyAnZnVuY3Rpb24nXG4gICAgICBvbkRpZENoYW5nZVRpdGxlRGlzcG9zYWJsZSA9IEBpdGVtLm9uRGlkQ2hhbmdlVGl0bGUodGl0bGVDaGFuZ2VkSGFuZGxlcilcbiAgICAgIGlmIERpc3Bvc2FibGUuaXNEaXNwb3NhYmxlKG9uRGlkQ2hhbmdlVGl0bGVEaXNwb3NhYmxlKVxuICAgICAgICBAc3Vic2NyaXB0aW9ucy5hZGQob25EaWRDaGFuZ2VUaXRsZURpc3Bvc2FibGUpXG4gICAgICBlbHNlXG4gICAgICAgIGNvbnNvbGUud2FybiBcIjo6b25EaWRDaGFuZ2VUaXRsZSBkb2VzIG5vdCByZXR1cm4gYSB2YWxpZCBEaXNwb3NhYmxlIVwiLCBAaXRlbVxuICAgIGVsc2UgaWYgdHlwZW9mIEBpdGVtLm9uIGlzICdmdW5jdGlvbidcbiAgICAgICNUT0RPIFJlbW92ZSBvbmNlIG9sZCBldmVudHMgYXJlIG5vIGxvbmdlciBzdXBwb3J0ZWRcbiAgICAgIEBpdGVtLm9uKCd0aXRsZS1jaGFuZ2VkJywgdGl0bGVDaGFuZ2VkSGFuZGxlcilcbiAgICAgIEBzdWJzY3JpcHRpb25zLmFkZCBkaXNwb3NlOiA9PlxuICAgICAgICBAaXRlbS5vZmY/KCd0aXRsZS1jaGFuZ2VkJywgdGl0bGVDaGFuZ2VkSGFuZGxlcilcblxuICAgIHBhdGhDaGFuZ2VkSGFuZGxlciA9IChAcGF0aCkgPT5cbiAgICAgIEB1cGRhdGVEYXRhQXR0cmlidXRlcygpXG4gICAgICBAdXBkYXRlVGl0bGUoKVxuICAgICAgQHVwZGF0ZVRvb2x0aXAoKVxuXG4gICAgaWYgdHlwZW9mIEBpdGVtLm9uRGlkQ2hhbmdlUGF0aCBpcyAnZnVuY3Rpb24nXG4gICAgICBvbkRpZENoYW5nZVBhdGhEaXNwb3NhYmxlID0gQGl0ZW0ub25EaWRDaGFuZ2VQYXRoKHBhdGhDaGFuZ2VkSGFuZGxlcilcbiAgICAgIGlmIERpc3Bvc2FibGUuaXNEaXNwb3NhYmxlKG9uRGlkQ2hhbmdlUGF0aERpc3Bvc2FibGUpXG4gICAgICAgIEBzdWJzY3JpcHRpb25zLmFkZChvbkRpZENoYW5nZVBhdGhEaXNwb3NhYmxlKVxuICAgICAgZWxzZVxuICAgICAgICBjb25zb2xlLndhcm4gXCI6Om9uRGlkQ2hhbmdlUGF0aCBkb2VzIG5vdCByZXR1cm4gYSB2YWxpZCBEaXNwb3NhYmxlIVwiLCBAaXRlbVxuICAgIGVsc2UgaWYgdHlwZW9mIEBpdGVtLm9uIGlzICdmdW5jdGlvbidcbiAgICAgICNUT0RPIFJlbW92ZSBvbmNlIG9sZCBldmVudHMgYXJlIG5vIGxvbmdlciBzdXBwb3J0ZWRcbiAgICAgIEBpdGVtLm9uKCdwYXRoLWNoYW5nZWQnLCBwYXRoQ2hhbmdlZEhhbmRsZXIpXG4gICAgICBAc3Vic2NyaXB0aW9ucy5hZGQgZGlzcG9zZTogPT5cbiAgICAgICAgQGl0ZW0ub2ZmPygncGF0aC1jaGFuZ2VkJywgcGF0aENoYW5nZWRIYW5kbGVyKVxuXG4gICAgaWNvbkNoYW5nZWRIYW5kbGVyID0gPT5cbiAgICAgIEB1cGRhdGVJY29uKClcblxuICAgIGlmIHR5cGVvZiBAaXRlbS5vbkRpZENoYW5nZUljb24gaXMgJ2Z1bmN0aW9uJ1xuICAgICAgb25EaWRDaGFuZ2VJY29uRGlzcG9zYWJsZSA9IEBpdGVtLm9uRGlkQ2hhbmdlSWNvbj8gPT5cbiAgICAgICAgQHVwZGF0ZUljb24oKVxuICAgICAgaWYgRGlzcG9zYWJsZS5pc0Rpc3Bvc2FibGUob25EaWRDaGFuZ2VJY29uRGlzcG9zYWJsZSlcbiAgICAgICAgQHN1YnNjcmlwdGlvbnMuYWRkKG9uRGlkQ2hhbmdlSWNvbkRpc3Bvc2FibGUpXG4gICAgICBlbHNlXG4gICAgICAgIGNvbnNvbGUud2FybiBcIjo6b25EaWRDaGFuZ2VJY29uIGRvZXMgbm90IHJldHVybiBhIHZhbGlkIERpc3Bvc2FibGUhXCIsIEBpdGVtXG4gICAgZWxzZSBpZiB0eXBlb2YgQGl0ZW0ub24gaXMgJ2Z1bmN0aW9uJ1xuICAgICAgI1RPRE8gUmVtb3ZlIG9uY2Ugb2xkIGV2ZW50cyBhcmUgbm8gbG9uZ2VyIHN1cHBvcnRlZFxuICAgICAgQGl0ZW0ub24oJ2ljb24tY2hhbmdlZCcsIGljb25DaGFuZ2VkSGFuZGxlcilcbiAgICAgIEBzdWJzY3JpcHRpb25zLmFkZCBkaXNwb3NlOiA9PlxuICAgICAgICBAaXRlbS5vZmY/KCdpY29uLWNoYW5nZWQnLCBpY29uQ2hhbmdlZEhhbmRsZXIpXG5cbiAgICBtb2RpZmllZEhhbmRsZXIgPSA9PlxuICAgICAgQHVwZGF0ZU1vZGlmaWVkU3RhdHVzKClcblxuICAgIGlmIHR5cGVvZiBAaXRlbS5vbkRpZENoYW5nZU1vZGlmaWVkIGlzICdmdW5jdGlvbidcbiAgICAgIG9uRGlkQ2hhbmdlTW9kaWZpZWREaXNwb3NhYmxlID0gQGl0ZW0ub25EaWRDaGFuZ2VNb2RpZmllZChtb2RpZmllZEhhbmRsZXIpXG4gICAgICBpZiBEaXNwb3NhYmxlLmlzRGlzcG9zYWJsZShvbkRpZENoYW5nZU1vZGlmaWVkRGlzcG9zYWJsZSlcbiAgICAgICAgQHN1YnNjcmlwdGlvbnMuYWRkKG9uRGlkQ2hhbmdlTW9kaWZpZWREaXNwb3NhYmxlKVxuICAgICAgZWxzZVxuICAgICAgICBjb25zb2xlLndhcm4gXCI6Om9uRGlkQ2hhbmdlTW9kaWZpZWQgZG9lcyBub3QgcmV0dXJuIGEgdmFsaWQgRGlzcG9zYWJsZSFcIiwgQGl0ZW1cbiAgICBlbHNlIGlmIHR5cGVvZiBAaXRlbS5vbiBpcyAnZnVuY3Rpb24nXG4gICAgICAjVE9ETyBSZW1vdmUgb25jZSBvbGQgZXZlbnRzIGFyZSBubyBsb25nZXIgc3VwcG9ydGVkXG4gICAgICBAaXRlbS5vbignbW9kaWZpZWQtc3RhdHVzLWNoYW5nZWQnLCBtb2RpZmllZEhhbmRsZXIpXG4gICAgICBAc3Vic2NyaXB0aW9ucy5hZGQgZGlzcG9zZTogPT5cbiAgICAgICAgQGl0ZW0ub2ZmPygnbW9kaWZpZWQtc3RhdHVzLWNoYW5nZWQnLCBtb2RpZmllZEhhbmRsZXIpXG5cbiAgICBpZiB0eXBlb2YgQGl0ZW0ub25EaWRTYXZlIGlzICdmdW5jdGlvbidcbiAgICAgIG9uRGlkU2F2ZURpc3Bvc2FibGUgPSBAaXRlbS5vbkRpZFNhdmUgKGV2ZW50KSA9PlxuICAgICAgICBAdGVybWluYXRlUGVuZGluZ1N0YXRlKClcbiAgICAgICAgaWYgZXZlbnQucGF0aCBpc250IEBwYXRoXG4gICAgICAgICAgQHBhdGggPSBldmVudC5wYXRoXG4gICAgICAgICAgQHNldHVwVmNzU3RhdHVzKCkgaWYgYXRvbS5jb25maWcuZ2V0ICd0YWJzLmVuYWJsZVZjc0NvbG9yaW5nJ1xuXG4gICAgICBpZiBEaXNwb3NhYmxlLmlzRGlzcG9zYWJsZShvbkRpZFNhdmVEaXNwb3NhYmxlKVxuICAgICAgICBAc3Vic2NyaXB0aW9ucy5hZGQob25EaWRTYXZlRGlzcG9zYWJsZSlcbiAgICAgIGVsc2VcbiAgICAgICAgY29uc29sZS53YXJuIFwiOjpvbkRpZFNhdmUgZG9lcyBub3QgcmV0dXJuIGEgdmFsaWQgRGlzcG9zYWJsZSFcIiwgQGl0ZW1cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb25maWcub2JzZXJ2ZSAndGFicy5zaG93SWNvbnMnLCA9PlxuICAgICAgQHVwZGF0ZUljb25WaXNpYmlsaXR5KClcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbmZpZy5vYnNlcnZlICd0YWJzLmVuYWJsZVZjc0NvbG9yaW5nJywgKGlzRW5hYmxlZCkgPT5cbiAgICAgIGlmIGlzRW5hYmxlZCBhbmQgQHBhdGg/IHRoZW4gQHNldHVwVmNzU3RhdHVzKCkgZWxzZSBAdW5zZXRWY3NTdGF0dXMoKVxuXG4gIHNldHVwVG9vbHRpcDogLT5cbiAgICAjIERlZmVyIGNyZWF0aW5nIHRoZSB0b29sdGlwIHVudGlsIHRoZSB0YWIgaXMgbW91c2VkIG92ZXJcbiAgICBvbk1vdXNlRW50ZXIgPSA9PlxuICAgICAgQG1vdXNlRW50ZXJTdWJzY3JpcHRpb24uZGlzcG9zZSgpXG4gICAgICBAaGFzQmVlbk1vdXNlZE92ZXIgPSB0cnVlXG4gICAgICBAdXBkYXRlVG9vbHRpcCgpXG5cbiAgICAgICMgVHJpZ2dlciBhZ2FpbiBzbyB0aGUgdG9vbHRpcCBzaG93c1xuICAgICAgQGVsZW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ21vdXNlZW50ZXInLCBidWJibGVzOiB0cnVlKSlcblxuICAgIEBtb3VzZUVudGVyU3Vic2NyaXB0aW9uID0gZGlzcG9zZTogPT5cbiAgICAgIEBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCBvbk1vdXNlRW50ZXIpXG4gICAgICBAbW91c2VFbnRlclN1YnNjcmlwdGlvbiA9IG51bGxcblxuICAgIEBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCBvbk1vdXNlRW50ZXIpXG5cbiAgdXBkYXRlVG9vbHRpcDogLT5cbiAgICByZXR1cm4gdW5sZXNzIEBoYXNCZWVuTW91c2VkT3ZlclxuXG4gICAgQGRlc3Ryb3lUb29sdGlwKClcblxuICAgIGlmIEBwYXRoXG4gICAgICBAdG9vbHRpcCA9IGF0b20udG9vbHRpcHMuYWRkIEBlbGVtZW50LFxuICAgICAgICB0aXRsZTogQHBhdGhcbiAgICAgICAgaHRtbDogZmFsc2VcbiAgICAgICAgZGVsYXk6XG4gICAgICAgICAgc2hvdzogMTAwMFxuICAgICAgICAgIGhpZGU6IDEwMFxuICAgICAgICBwbGFjZW1lbnQ6ICdib3R0b20nXG5cbiAgZGVzdHJveVRvb2x0aXA6IC0+XG4gICAgcmV0dXJuIHVubGVzcyBAaGFzQmVlbk1vdXNlZE92ZXJcbiAgICBAdG9vbHRpcD8uZGlzcG9zZSgpXG5cbiAgZGVzdHJveTogLT5cbiAgICBAc3Vic2NyaXB0aW9ucz8uZGlzcG9zZSgpXG4gICAgQG1vdXNlRW50ZXJTdWJzY3JpcHRpb24/LmRpc3Bvc2UoKVxuICAgIEByZXBvU3Vic2NyaXB0aW9ucz8uZGlzcG9zZSgpXG4gICAgQGRlc3Ryb3lUb29sdGlwKClcbiAgICBAZWxlbWVudC5yZW1vdmUoKVxuXG4gIHVwZGF0ZURhdGFBdHRyaWJ1dGVzOiAtPlxuICAgIGlmIEBwYXRoXG4gICAgICBAaXRlbVRpdGxlLmRhdGFzZXQubmFtZSA9IHBhdGguYmFzZW5hbWUoQHBhdGgpXG4gICAgICBAaXRlbVRpdGxlLmRhdGFzZXQucGF0aCA9IEBwYXRoXG4gICAgZWxzZVxuICAgICAgZGVsZXRlIEBpdGVtVGl0bGUuZGF0YXNldC5uYW1lXG4gICAgICBkZWxldGUgQGl0ZW1UaXRsZS5kYXRhc2V0LnBhdGhcblxuICAgIGlmIGl0ZW1DbGFzcyA9IEBpdGVtLmNvbnN0cnVjdG9yPy5uYW1lXG4gICAgICBAZWxlbWVudC5kYXRhc2V0LnR5cGUgPSBpdGVtQ2xhc3NcbiAgICBlbHNlXG4gICAgICBkZWxldGUgQGVsZW1lbnQuZGF0YXNldC50eXBlXG5cbiAgdXBkYXRlVGl0bGU6ICh7dXBkYXRlU2libGluZ3MsIHVzZUxvbmdUaXRsZX09e30pIC0+XG4gICAgcmV0dXJuIGlmIEB1cGRhdGluZ1RpdGxlXG4gICAgQHVwZGF0aW5nVGl0bGUgPSB0cnVlXG5cbiAgICBpZiB1cGRhdGVTaWJsaW5ncyBpcyBmYWxzZVxuICAgICAgdGl0bGUgPSBAaXRlbS5nZXRUaXRsZSgpXG4gICAgICB0aXRsZSA9IEBpdGVtLmdldExvbmdUaXRsZT8oKSA/IHRpdGxlIGlmIHVzZUxvbmdUaXRsZVxuICAgICAgQGl0ZW1UaXRsZS50ZXh0Q29udGVudCA9IHRpdGxlXG4gICAgZWxzZVxuICAgICAgdGl0bGUgPSBAaXRlbS5nZXRUaXRsZSgpXG4gICAgICB1c2VMb25nVGl0bGUgPSBmYWxzZVxuICAgICAgZm9yIHRhYiBpbiBAdGFicyB3aGVuIHRhYiBpc250IHRoaXNcbiAgICAgICAgaWYgdGFiLml0ZW0uZ2V0VGl0bGUoKSBpcyB0aXRsZVxuICAgICAgICAgIHRhYi51cGRhdGVUaXRsZSh1cGRhdGVTaWJsaW5nczogZmFsc2UsIHVzZUxvbmdUaXRsZTogdHJ1ZSlcbiAgICAgICAgICB1c2VMb25nVGl0bGUgPSB0cnVlXG4gICAgICB0aXRsZSA9IEBpdGVtLmdldExvbmdUaXRsZT8oKSA/IHRpdGxlIGlmIHVzZUxvbmdUaXRsZVxuXG4gICAgICBAaXRlbVRpdGxlLnRleHRDb250ZW50ID0gdGl0bGVcblxuICAgIEB1cGRhdGluZ1RpdGxlID0gZmFsc2VcblxuICB1cGRhdGVJY29uOiAtPlxuICAgIGlmIEBpY29uTmFtZVxuICAgICAgbmFtZXMgPSB1bmxlc3MgQXJyYXkuaXNBcnJheShAaWNvbk5hbWUpIHRoZW4gQGljb25OYW1lLnNwbGl0KC9cXHMrL2cpIGVsc2UgQGljb25OYW1lXG4gICAgICBAaXRlbVRpdGxlLmNsYXNzTGlzdC5yZW1vdmUoJ2ljb24nLCBcImljb24tI3tuYW1lc1swXX1cIiwgbmFtZXMuLi4pXG5cbiAgICBpZiBAaWNvbk5hbWUgPSBAaXRlbS5nZXRJY29uTmFtZT8oKVxuICAgICAgQGl0ZW1UaXRsZS5jbGFzc0xpc3QuYWRkKCdpY29uJywgXCJpY29uLSN7QGljb25OYW1lfVwiKVxuICAgIGVsc2UgaWYgQHBhdGg/IGFuZCBAaWNvbk5hbWUgPSBGaWxlSWNvbnMuZ2V0U2VydmljZSgpLmljb25DbGFzc0ZvclBhdGgoQHBhdGgsIFwidGFic1wiKVxuICAgICAgdW5sZXNzIEFycmF5LmlzQXJyYXkgbmFtZXMgPSBAaWNvbk5hbWVcbiAgICAgICAgbmFtZXMgPSBuYW1lcy50b1N0cmluZygpLnNwbGl0IC9cXHMrL2dcblxuICAgICAgQGl0ZW1UaXRsZS5jbGFzc0xpc3QuYWRkKCdpY29uJywgbmFtZXMuLi4pXG5cbiAgaXNJdGVtUGVuZGluZzogLT5cbiAgICBpZiBAcGFuZS5nZXRQZW5kaW5nSXRlbT9cbiAgICAgIEBwYW5lLmdldFBlbmRpbmdJdGVtKCkgaXMgQGl0ZW1cbiAgICBlbHNlIGlmIEBpdGVtLmlzUGVuZGluZz9cbiAgICAgIEBpdGVtLmlzUGVuZGluZygpXG5cbiAgdGVybWluYXRlUGVuZGluZ1N0YXRlOiAtPlxuICAgIGlmIEBwYW5lLmNsZWFyUGVuZGluZ0l0ZW0/XG4gICAgICBAcGFuZS5jbGVhclBlbmRpbmdJdGVtKCkgaWYgQHBhbmUuZ2V0UGVuZGluZ0l0ZW0oKSBpcyBAaXRlbVxuICAgIGVsc2UgaWYgQGl0ZW0udGVybWluYXRlUGVuZGluZ1N0YXRlP1xuICAgICAgQGl0ZW0udGVybWluYXRlUGVuZGluZ1N0YXRlKClcblxuICBjbGVhclBlbmRpbmc6IC0+XG4gICAgQGl0ZW1UaXRsZS5jbGFzc0xpc3QucmVtb3ZlKCd0ZW1wJylcbiAgICBAZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdwZW5kaW5nLXRhYicpXG5cbiAgdXBkYXRlSWNvblZpc2liaWxpdHk6IC0+XG4gICAgaWYgYXRvbS5jb25maWcuZ2V0ICd0YWJzLnNob3dJY29ucydcbiAgICAgIEBpdGVtVGl0bGUuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZS1pY29uJylcbiAgICBlbHNlXG4gICAgICBAaXRlbVRpdGxlLmNsYXNzTGlzdC5hZGQoJ2hpZGUtaWNvbicpXG5cbiAgdXBkYXRlTW9kaWZpZWRTdGF0dXM6IC0+XG4gICAgaWYgQGl0ZW0uaXNNb2RpZmllZD8oKVxuICAgICAgQGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnbW9kaWZpZWQnKSB1bmxlc3MgQGlzTW9kaWZpZWRcbiAgICAgIEBpc01vZGlmaWVkID0gdHJ1ZVxuICAgIGVsc2VcbiAgICAgIEBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ21vZGlmaWVkJykgaWYgQGlzTW9kaWZpZWRcbiAgICAgIEBpc01vZGlmaWVkID0gZmFsc2VcblxuICBzZXR1cFZjc1N0YXR1czogLT5cbiAgICByZXR1cm4gdW5sZXNzIEBwYXRoP1xuICAgIEByZXBvRm9yUGF0aChAcGF0aCkudGhlbiAocmVwbykgPT5cbiAgICAgIEBzdWJzY3JpYmVUb1JlcG8ocmVwbylcbiAgICAgIEB1cGRhdGVWY3NTdGF0dXMocmVwbylcblxuICAjIFN1YnNjcmliZSB0byB0aGUgcHJvamVjdCdzIHJlcG8gZm9yIGNoYW5nZXMgdG8gdGhlIFZDUyBzdGF0dXMgb2YgdGhlIGZpbGUuXG4gIHN1YnNjcmliZVRvUmVwbzogKHJlcG8pIC0+XG4gICAgcmV0dXJuIHVubGVzcyByZXBvP1xuXG4gICAgIyBSZW1vdmUgcHJldmlvdXMgcmVwbyBzdWJzY3JpcHRpb25zLlxuICAgIEByZXBvU3Vic2NyaXB0aW9ucz8uZGlzcG9zZSgpXG4gICAgQHJlcG9TdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuXG4gICAgQHJlcG9TdWJzY3JpcHRpb25zLmFkZCByZXBvLm9uRGlkQ2hhbmdlU3RhdHVzIChldmVudCkgPT5cbiAgICAgIEB1cGRhdGVWY3NTdGF0dXMocmVwbywgZXZlbnQucGF0aFN0YXR1cykgaWYgZXZlbnQucGF0aCBpcyBAcGF0aFxuICAgIEByZXBvU3Vic2NyaXB0aW9ucy5hZGQgcmVwby5vbkRpZENoYW5nZVN0YXR1c2VzID0+XG4gICAgICBAdXBkYXRlVmNzU3RhdHVzKHJlcG8pXG5cbiAgcmVwb0ZvclBhdGg6IC0+XG4gICAgZm9yIGRpciBpbiBhdG9tLnByb2plY3QuZ2V0RGlyZWN0b3JpZXMoKVxuICAgICAgcmV0dXJuIGF0b20ucHJvamVjdC5yZXBvc2l0b3J5Rm9yRGlyZWN0b3J5KGRpcikgaWYgZGlyLmNvbnRhaW5zIEBwYXRoXG4gICAgUHJvbWlzZS5yZXNvbHZlKG51bGwpXG5cbiAgIyBVcGRhdGUgdGhlIFZDUyBzdGF0dXMgcHJvcGVydHkgb2YgdGhpcyB0YWIgdXNpbmcgdGhlIHJlcG8uXG4gIHVwZGF0ZVZjc1N0YXR1czogKHJlcG8sIHN0YXR1cykgLT5cbiAgICByZXR1cm4gdW5sZXNzIHJlcG8/XG5cbiAgICBuZXdTdGF0dXMgPSBudWxsXG4gICAgaWYgcmVwby5pc1BhdGhJZ25vcmVkKEBwYXRoKVxuICAgICAgbmV3U3RhdHVzID0gJ2lnbm9yZWQnXG4gICAgZWxzZVxuICAgICAgc3RhdHVzID0gcmVwby5nZXRDYWNoZWRQYXRoU3RhdHVzKEBwYXRoKSB1bmxlc3Mgc3RhdHVzP1xuICAgICAgaWYgcmVwby5pc1N0YXR1c01vZGlmaWVkKHN0YXR1cylcbiAgICAgICAgbmV3U3RhdHVzID0gJ21vZGlmaWVkJ1xuICAgICAgZWxzZSBpZiByZXBvLmlzU3RhdHVzTmV3KHN0YXR1cylcbiAgICAgICAgbmV3U3RhdHVzID0gJ2FkZGVkJ1xuXG4gICAgaWYgbmV3U3RhdHVzIGlzbnQgQHN0YXR1c1xuICAgICAgQHN0YXR1cyA9IG5ld1N0YXR1c1xuICAgICAgQHVwZGF0ZVZjc0NvbG9yaW5nKClcblxuICB1cGRhdGVWY3NDb2xvcmluZzogLT5cbiAgICBAaXRlbVRpdGxlLmNsYXNzTGlzdC5yZW1vdmUoJ3N0YXR1cy1pZ25vcmVkJywgJ3N0YXR1cy1tb2RpZmllZCcsICAnc3RhdHVzLWFkZGVkJylcbiAgICBpZiBAc3RhdHVzIGFuZCBhdG9tLmNvbmZpZy5nZXQgJ3RhYnMuZW5hYmxlVmNzQ29sb3JpbmcnXG4gICAgICBAaXRlbVRpdGxlLmNsYXNzTGlzdC5hZGQoXCJzdGF0dXMtI3tAc3RhdHVzfVwiKVxuXG4gIHVuc2V0VmNzU3RhdHVzOiAtPlxuICAgIEByZXBvU3Vic2NyaXB0aW9ucz8uZGlzcG9zZSgpXG4gICAgZGVsZXRlIEBzdGF0dXNcbiAgICBAdXBkYXRlVmNzQ29sb3JpbmcoKVxuIl19
