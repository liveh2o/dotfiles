(function() {
  var CompositeDisposable, Disposable, FileIcons, TabView, layout, path, ref,
    slice = [].slice;

  path = require('path');

  ref = require('atom'), Disposable = ref.Disposable, CompositeDisposable = ref.CompositeDisposable;

  FileIcons = require('./file-icons');

  layout = require('./layout');

  module.exports = TabView = (function() {
    function TabView(arg) {
      var base, closeIcon, didClickCloseIcon, location;
      this.item = arg.item, this.pane = arg.pane, didClickCloseIcon = arg.didClickCloseIcon, this.tabs = arg.tabs, location = arg.location;
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
      if (location === 'center' || !(typeof (base = this.item).isPermanentDockItem === "function" ? base.isPermanentDockItem() : void 0)) {
        closeIcon = document.createElement('div');
        closeIcon.classList.add('close-icon');
        closeIcon.onclick = didClickCloseIcon;
        this.element.appendChild(closeIcon);
      }
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RhYnMvbGliL3RhYi12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsc0VBQUE7SUFBQTs7RUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsTUFBb0MsT0FBQSxDQUFRLE1BQVIsQ0FBcEMsRUFBQywyQkFBRCxFQUFhOztFQUNiLFNBQUEsR0FBWSxPQUFBLENBQVEsY0FBUjs7RUFFWixNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVI7O0VBRVQsTUFBTSxDQUFDLE9BQVAsR0FDTTtJQUNTLGlCQUFDLEdBQUQ7QUFDWCxVQUFBO01BRGEsSUFBQyxDQUFBLFdBQUEsTUFBTSxJQUFDLENBQUEsV0FBQSxNQUFNLDJDQUFtQixJQUFDLENBQUEsV0FBQSxNQUFNO01BQ3JELElBQUcsT0FBTyxJQUFDLENBQUEsSUFBSSxDQUFDLE9BQWIsS0FBd0IsVUFBM0I7UUFDRSxJQUFDLENBQUEsSUFBRCxHQUFRLElBQUMsQ0FBQSxJQUFJLENBQUMsT0FBTixDQUFBLEVBRFY7O01BR0EsSUFBQyxDQUFBLE9BQUQsR0FBVyxRQUFRLENBQUMsYUFBVCxDQUF1QixJQUF2QjtNQUNYLElBQUMsQ0FBQSxPQUFPLENBQUMsWUFBVCxDQUFzQixJQUF0QixFQUE0QixVQUE1QjtNQUNBLElBQUcsQ0FBQyxZQUFELEVBQWUsVUFBZixDQUEwQixDQUFDLE9BQTNCLENBQW1DLElBQUMsQ0FBQSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQXJELENBQUEsR0FBNkQsQ0FBQyxDQUFqRTtRQUNFLElBQUMsQ0FBQSxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQW5CLENBQXVCLFlBQXZCLEVBREY7O01BRUEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBbkIsQ0FBdUIsS0FBdkIsRUFBOEIsVUFBOUI7TUFFQSxJQUFDLENBQUEsU0FBRCxHQUFhLFFB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QUFMLENBQW1CLElBQUMsQ0FBQSxJQUFwQixDQUFIO1FBQ0UsU0FBQSxHQUFZLFVBRGQ7T0FBQSxNQUFBO1FBR0UsSUFBZ0QsY0FBaEQ7VUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLG1CQUFMLENBQXlCLElBQUMsQ0FBQSxJQUExQixFQUFUOztRQUNBLElBQUcsSUFBSSxDQUFDLGdCQUFMLENBQXNCLE1BQXRCLENBQUg7VUFDRSxTQUFBLEdBQVksV0FEZDtTQUFBLE1BRUssSUFBRyxJQUFJLENBQUMsV0FBTCxDQUFpQixNQUFqQixDQUFIO1VBQ0gsU0FBQSxHQUFZLFFBRFQ7U0FOUDs7TUFTQSxJQUFHLFNBQUEsS0FBZSxJQUFDLENBQUEsTUFBbkI7UUFDRSxJQUFDLENBQUEsTUFBRCxHQUFVO2VBQ1YsSUFBQyxDQUFBLGlCQUFELENBQUEsRUFGRjs7SUFiZTs7c0JBaUJqQixpQkFBQSxHQUFtQixTQUFBO01BQ2pCLElBQUMsQ0FBQSxTQUFTLENBQUMsU0FBUyxDQUFDLE1BQXJCLENBQTRCLGdCQUE1QixFQUE4QyxpQkFBOUMsRUFBa0UsY0FBbEU7TUFDQSxJQUFHLElBQUMsQ0FBQSxNQUFELElBQVksSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHdCQUFoQixDQUFmO2VBQ0UsSUFBQyxDQUFBLFNBQVMsQ0FBQyxTQUFTLENBQUMsR0FBckIsQ0FBeUIsU0FBQSxHQUFVLElBQUMsQ0FBQSxNQUFwQyxFQURGOztJQUZpQjs7c0JBS25CLGNBQUEsR0FBZ0IsU0FBQTtBQUNkLFVBQUE7O1lBQWtCLENBQUUsT0FBcEIsQ0FBQTs7TUFDQSxPQUFPLElBQUMsQ0FBQTthQUNSLElBQUMsQ0FBQSxpQkFBRCxDQUFBO0lBSGM7Ozs7O0FBcFRsQiIsInNvdXJjZXNDb250ZW50IjpbInBhdGggPSByZXF1aXJlICdwYXRoJ1xue0Rpc3Bvc2FibGUsIENvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSAnYXRvbSdcbkZpbGVJY29ucyA9IHJlcXVpcmUgJy4vZmlsZS1pY29ucydcblxubGF5b3V0ID0gcmVxdWlyZSAnLi9sYXlvdXQnXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIFRhYlZpZXdcbiAgY29uc3RydWN0b3I6ICh7QGl0ZW0sIEBwYW5lLCBkaWRDbGlja0Nsb3NlSWNvbiwgQHRhYnMsIGxvY2F0aW9ufSkgLT5cbiAgICBpZiB0eXBlb2YgQGl0ZW0uZ2V0UGF0aCBpcyAnZnVuY3Rpb24nXG4gICAgICBAcGF0aCA9IEBpdGVtLmdldFBhdGgoKVxuXG4gICAgQGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpXG4gICAgQGVsZW1lbnQuc2V0QXR0cmlidXRlKCdpcycsICd0YWJzLXRhYicpXG4gICAgaWYgWydUZXh0RWRpdG9yJywgJ1Rlc3RWaWV3J10uaW5kZXhPZihAaXRlbS5jb25zdHJ1Y3Rvci5uYW1lKSA+IC0xXG4gICAgICBAZWxlbWVudC5jbGFzc0xpc3QuYWRkKCd0ZXh0ZWRpdG9yJylcbiAgICBAZWxlbWVudC5jbGFzc0xpc3QuYWRkKCd0YWInLCAnc29ydGFibGUnKVxuXG4gICAgQGl0ZW1UaXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgQGl0ZW1UaXRsZS5jbGFzc0xpc3QuYWRkKCd0aXRsZScpXG4gICAgQGVsZW1lbnQuYXBwZW5kQ2hpbGQoQGl0ZW1UaXRsZSlcblxuICAgIGlmIGxvY2F0aW9uIGlzICdjZW50ZXInIG9yIG5vdCBAaXRlbS5pc1Blcm1hbmVudERvY2tJdGVtPygpXG4gICAgICBjbG9zZUljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgICAgY2xvc2VJY29uLmNsYXNzTGlzdC5hZGQoJ2Nsb3NlLWljb24nKVxuICAgICAgY2xvc2VJY29uLm9uY2xpY2sgPSBkaWRDbGlja0Nsb3NlSWNvblxuICAgICAgQGVsZW1lbnQuYXBwZW5kQ2hpbGQoY2xvc2VJY29uKVxuXG4gICAgQHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgICBAaGFuZGxlRXZlbnRzKClcbiAgICBAdXBkYXRlRGF0YUF0dHJpYnV0ZXMoKVxuICAgIEB1cGRhdGVUaXRsZSgpXG4gICAgQHVwZGF0ZUljb24oKVxuICAgIEB1cGRhdGVNb2RpZmllZFN0YXR1cygpXG4gICAgQHNldHVwVG9vbHRpcCgpXG5cbiAgICBpZiBAaXNJdGVtUGVuZGluZygpXG4gICAgICBAaXRlbVRpdGxlLmNsYXNzTGlzdC5hZGQoJ3RlbXAnKVxuICAgICAgQGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgncGVuZGluZy10YWInKVxuXG4gICAgQGVsZW1lbnQub25kcmFnID0gKGUpIC0+IGxheW91dC5kcmFnIGVcbiAgICBAZWxlbWVudC5vbmRyYWdlbmQgPSAoZSkgLT4gbGF5b3V0LmVuZCBlXG5cbiAgICBAZWxlbWVudC5wYW5lID0gQHBhbmVcbiAgICBAZWxlbWVudC5pdGVtID0gQGl0ZW1cbiAgICBAZWxlbWVudC5pdGVtVGl0bGUgPSBAaXRlbVRpdGxlXG4gICAgQGVsZW1lbnQucGF0aCA9IEBwYXRoXG5cbiAgaGFuZGxlRXZlbnRzOiAtPlxuICAgIHRpdGxlQ2hhbmdlZEhhbmRsZXIgPSA9PlxuICAgICAgQHVwZGF0ZVRpdGxlKClcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBAcGFuZS5vbkRpZERlc3Ryb3kgPT4gQGRlc3Ryb3koKVxuXG4gICAgIyBUT0RPOiByZW1vdmUgZWxzZSBjb25kaXRpb24gb25jZSBwZW5kaW5nIEFQSSBpcyBvbiBzdGFibGUgW01LVF1cbiAgICBpZiB0eXBlb2YgQHBhbmUub25JdGVtRGlkVGVybWluYXRlUGVuZGluZ1N0YXRlIGlzICdmdW5jdGlvbidcbiAgICAgIEBzdWJzY3JpcHRpb25zLmFkZCBAcGFuZS5vbkl0ZW1EaWRUZXJtaW5hdGVQZW5kaW5nU3RhdGUgKGl0ZW0pID0+XG4gICAgICAgIEBjbGVhclBlbmRpbmcoKSBpZiBpdGVtIGlzIEBpdGVtXG4gICAgZWxzZSBpZiB0eXBlb2YgQGl0ZW0ub25EaWRUZXJtaW5hdGVQZW5kaW5nU3RhdGUgaXMgJ2Z1bmN0aW9uJ1xuICAgICAgb25EaWRUZXJtaW5hdGVQZW5kaW5nU3RhdGVEaXNwb3NhYmxlID0gQGl0ZW0ub25EaWRUZXJtaW5hdGVQZW5kaW5nU3RhdGUgPT4gQGNsZWFyUGVuZGluZygpXG4gICAgICBpZiBEaXNwb3NhYmxlLmlzRGlzcG9zYWJsZShvbkRpZFRlcm1pbmF0ZVBlbmRpbmdTdGF0ZURpc3Bvc2FibGUpXG4gICAgICAgIEBzdWJzY3JpcHRpb25zLmFkZChvbkRpZFRlcm1pbmF0ZVBlbmRpbmdTdGF0ZURpc3Bvc2FibGUpXG4gICAgICBlbHNlXG4gICAgICAgIGNvbnNvbGUud2FybiBcIjo6b25EaWRUZXJtaW5hdGVQZW5kaW5nU3RhdGUgZG9lcyBub3QgcmV0dXJuIGEgdmFsaWQgRGlzcG9zYWJsZSFcIiwgQGl0ZW1cblxuICAgIGlmIHR5cGVvZiBAaXRlbS5vbkRpZENoYW5nZVRpdGxlIGlzICdmdW5jdGlvbidcbiAgICAgIG9uRGlkQ2hhbmdlVGl0bGVEaXNwb3NhYmxlID0gQGl0ZW0ub25EaWRDaGFuZ2VUaXRsZSh0aXRsZUNoYW5nZWRIYW5kbGVyKVxuICAgICAgaWYgRGlzcG9zYWJsZS5pc0Rpc3Bvc2FibGUob25EaWRDaGFuZ2VUaXRsZURpc3Bvc2FibGUpXG4gICAgICAgIEBzdWJzY3JpcHRpb25zLmFkZChvbkRpZENoYW5nZVRpdGxlRGlzcG9zYWJsZSlcbiAgICAgIGVsc2VcbiAgICAgICAgY29uc29sZS53YXJuIFwiOjpvbkRpZENoYW5nZVRpdGxlIGRvZXMgbm90IHJldHVybiBhIHZhbGlkIERpc3Bvc2FibGUhXCIsIEBpdGVtXG4gICAgZWxzZSBpZiB0eXBlb2YgQGl0ZW0ub24gaXMgJ2Z1bmN0aW9uJ1xuICAgICAgI1RPRE8gUmVtb3ZlIG9uY2Ugb2xkIGV2ZW50cyBhcmUgbm8gbG9uZ2VyIHN1cHBvcnRlZFxuICAgICAgQGl0ZW0ub24oJ3RpdGxlLWNoYW5nZWQnLCB0aXRsZUNoYW5nZWRIYW5kbGVyKVxuICAgICAgQHN1YnNjcmlwdGlvbnMuYWRkIGRpc3Bvc2U6ID0+XG4gICAgICAgIEBpdGVtLm9mZj8oJ3RpdGxlLWNoYW5nZWQnLCB0aXRsZUNoYW5nZWRIYW5kbGVyKVxuXG4gICAgcGF0aENoYW5nZWRIYW5kbGVyID0gKEBwYXRoKSA9PlxuICAgICAgQHVwZGF0ZURhdGFBdHRyaWJ1dGVzKClcbiAgICAgIEB1cGRhdGVUaXRsZSgpXG4gICAgICBAdXBkYXRlVG9vbHRpcCgpXG5cbiAgICBpZiB0eXBlb2YgQGl0ZW0ub25EaWRDaGFuZ2VQYXRoIGlzICdmdW5jdGlvbidcbiAgICAgIG9uRGlkQ2hhbmdlUGF0aERpc3Bvc2FibGUgPSBAaXRlbS5vbkRpZENoYW5nZVBhdGgocGF0aENoYW5nZWRIYW5kbGVyKVxuICAgICAgaWYgRGlzcG9zYWJsZS5pc0Rpc3Bvc2FibGUob25EaWRDaGFuZ2VQYXRoRGlzcG9zYWJsZSlcbiAgICAgICAgQHN1YnNjcmlwdGlvbnMuYWRkKG9uRGlkQ2hhbmdlUGF0aERpc3Bvc2FibGUpXG4gICAgICBlbHNlXG4gICAgICAgIGNvbnNvbGUud2FybiBcIjo6b25EaWRDaGFuZ2VQYXRoIGRvZXMgbm90IHJldHVybiBhIHZhbGlkIERpc3Bvc2FibGUhXCIsIEBpdGVtXG4gICAgZWxzZSBpZiB0eXBlb2YgQGl0ZW0ub24gaXMgJ2Z1bmN0aW9uJ1xuICAgICAgI1RPRE8gUmVtb3ZlIG9uY2Ugb2xkIGV2ZW50cyBhcmUgbm8gbG9uZ2VyIHN1cHBvcnRlZFxuICAgICAgQGl0ZW0ub24oJ3BhdGgtY2hhbmdlZCcsIHBhdGhDaGFuZ2VkSGFuZGxlcilcbiAgICAgIEBzdWJzY3JpcHRpb25zLmFkZCBkaXNwb3NlOiA9PlxuICAgICAgICBAaXRlbS5vZmY/KCdwYXRoLWNoYW5nZWQnLCBwYXRoQ2hhbmdlZEhhbmRsZXIpXG5cbiAgICBpY29uQ2hhbmdlZEhhbmRsZXIgPSA9PlxuICAgICAgQHVwZGF0ZUljb24oKVxuXG4gICAgaWYgdHlwZW9mIEBpdGVtLm9uRGlkQ2hhbmdlSWNvbiBpcyAnZnVuY3Rpb24nXG4gICAgICBvbkRpZENoYW5nZUljb25EaXNwb3NhYmxlID0gQGl0ZW0ub25EaWRDaGFuZ2VJY29uPyA9PlxuICAgICAgICBAdXBkYXRlSWNvbigpXG4gICAgICBpZiBEaXNwb3NhYmxlLmlzRGlzcG9zYWJsZShvbkRpZENoYW5nZUljb25EaXNwb3NhYmxlKVxuICAgICAgICBAc3Vic2NyaXB0aW9ucy5hZGQob25EaWRDaGFuZ2VJY29uRGlzcG9zYWJsZSlcbiAgICAgIGVsc2VcbiAgICAgICAgY29uc29sZS53YXJuIFwiOjpvbkRpZENoYW5nZUljb24gZG9lcyBub3QgcmV0dXJuIGEgdmFsaWQgRGlzcG9zYWJsZSFcIiwgQGl0ZW1cbiAgICBlbHNlIGlmIHR5cGVvZiBAaXRlbS5vbiBpcyAnZnVuY3Rpb24nXG4gICAgICAjVE9ETyBSZW1vdmUgb25jZSBvbGQgZXZlbnRzIGFyZSBubyBsb25nZXIgc3VwcG9ydGVkXG4gICAgICBAaXRlbS5vbignaWNvbi1jaGFuZ2VkJywgaWNvbkNoYW5nZWRIYW5kbGVyKVxuICAgICAgQHN1YnNjcmlwdGlvbnMuYWRkIGRpc3Bvc2U6ID0+XG4gICAgICAgIEBpdGVtLm9mZj8oJ2ljb24tY2hhbmdlZCcsIGljb25DaGFuZ2VkSGFuZGxlcilcblxuICAgIG1vZGlmaWVkSGFuZGxlciA9ID0+XG4gICAgICBAdXBkYXRlTW9kaWZpZWRTdGF0dXMoKVxuXG4gICAgaWYgdHlwZW9mIEBpdGVtLm9uRGlkQ2hhbmdlTW9kaWZpZWQgaXMgJ2Z1bmN0aW9uJ1xuICAgICAgb25EaWRDaGFuZ2VNb2RpZmllZERpc3Bvc2FibGUgPSBAaXRlbS5vbkRpZENoYW5nZU1vZGlmaWVkKG1vZGlmaWVkSGFuZGxlcilcbiAgICAgIGlmIERpc3Bvc2FibGUuaXNEaXNwb3NhYmxlKG9uRGlkQ2hhbmdlTW9kaWZpZWREaXNwb3NhYmxlKVxuICAgICAgICBAc3Vic2NyaXB0aW9ucy5hZGQob25EaWRDaGFuZ2VNb2RpZmllZERpc3Bvc2FibGUpXG4gICAgICBlbHNlXG4gICAgICAgIGNvbnNvbGUud2FybiBcIjo6b25EaWRDaGFuZ2VNb2RpZmllZCBkb2VzIG5vdCByZXR1cm4gYSB2YWxpZCBEaXNwb3NhYmxlIVwiLCBAaXRlbVxuICAgIGVsc2UgaWYgdHlwZW9mIEBpdGVtLm9uIGlzICdmdW5jdGlvbidcbiAgICAgICNUT0RPIFJlbW92ZSBvbmNlIG9sZCBldmVudHMgYXJlIG5vIGxvbmdlciBzdXBwb3J0ZWRcbiAgICAgIEBpdGVtLm9uKCdtb2RpZmllZC1zdGF0dXMtY2hhbmdlZCcsIG1vZGlmaWVkSGFuZGxlcilcbiAgICAgIEBzdWJzY3JpcHRpb25zLmFkZCBkaXNwb3NlOiA9PlxuICAgICAgICBAaXRlbS5vZmY/KCdtb2RpZmllZC1zdGF0dXMtY2hhbmdlZCcsIG1vZGlmaWVkSGFuZGxlcilcblxuICAgIGlmIHR5cGVvZiBAaXRlbS5vbkRpZFNhdmUgaXMgJ2Z1bmN0aW9uJ1xuICAgICAgb25EaWRTYXZlRGlzcG9zYWJsZSA9IEBpdGVtLm9uRGlkU2F2ZSAoZXZlbnQpID0+XG4gICAgICAgIEB0ZXJtaW5hdGVQZW5kaW5nU3RhdGUoKVxuICAgICAgICBpZiBldmVudC5wYXRoIGlzbnQgQHBhdGhcbiAgICAgICAgICBAcGF0aCA9IGV2ZW50LnBhdGhcbiAgICAgICAgICBAc2V0dXBWY3NTdGF0dXMoKSBpZiBhdG9tLmNvbmZpZy5nZXQgJ3RhYnMuZW5hYmxlVmNzQ29sb3JpbmcnXG5cbiAgICAgIGlmIERpc3Bvc2FibGUuaXNEaXNwb3NhYmxlKG9uRGlkU2F2ZURpc3Bvc2FibGUpXG4gICAgICAgIEBzdWJzY3JpcHRpb25zLmFkZChvbkRpZFNhdmVEaXNwb3NhYmxlKVxuICAgICAgZWxzZVxuICAgICAgICBjb25zb2xlLndhcm4gXCI6Om9uRGlkU2F2ZSBkb2VzIG5vdCByZXR1cm4gYSB2YWxpZCBEaXNwb3NhYmxlIVwiLCBAaXRlbVxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbmZpZy5vYnNlcnZlICd0YWJzLnNob3dJY29ucycsID0+XG4gICAgICBAdXBkYXRlSWNvblZpc2liaWxpdHkoKVxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29uZmlnLm9ic2VydmUgJ3RhYnMuZW5hYmxlVmNzQ29sb3JpbmcnLCAoaXNFbmFibGVkKSA9PlxuICAgICAgaWYgaXNFbmFibGVkIGFuZCBAcGF0aD8gdGhlbiBAc2V0dXBWY3NTdGF0dXMoKSBlbHNlIEB1bnNldFZjc1N0YXR1cygpXG5cbiAgc2V0dXBUb29sdGlwOiAtPlxuICAgICMgRGVmZXIgY3JlYXRpbmcgdGhlIHRvb2x0aXAgdW50aWwgdGhlIHRhYiBpcyBtb3VzZWQgb3ZlclxuICAgIG9uTW91c2VFbnRlciA9ID0+XG4gICAgICBAbW91c2VFbnRlclN1YnNjcmlwdGlvbi5kaXNwb3NlKClcbiAgICAgIEBoYXNCZWVuTW91c2VkT3ZlciA9IHRydWVcbiAgICAgIEB1cGRhdGVUb29sdGlwKClcblxuICAgICAgIyBUcmlnZ2VyIGFnYWluIHNvIHRoZSB0b29sdGlwIHNob3dzXG4gICAgICBAZWxlbWVudC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnbW91c2VlbnRlcicsIGJ1YmJsZXM6IHRydWUpKVxuXG4gICAgQG1vdXNlRW50ZXJTdWJzY3JpcHRpb24gPSBkaXNwb3NlOiA9PlxuICAgICAgQGVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsIG9uTW91c2VFbnRlcilcbiAgICAgIEBtb3VzZUVudGVyU3Vic2NyaXB0aW9uID0gbnVsbFxuXG4gICAgQGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsIG9uTW91c2VFbnRlcilcblxuICB1cGRhdGVUb29sdGlwOiAtPlxuICAgIHJldHVybiB1bmxlc3MgQGhhc0JlZW5Nb3VzZWRPdmVyXG5cbiAgICBAZGVzdHJveVRvb2x0aXAoKVxuXG4gICAgaWYgQHBhdGhcbiAgICAgIEB0b29sdGlwID0gYXRvbS50b29sdGlwcy5hZGQgQGVsZW1lbnQsXG4gICAgICAgIHRpdGxlOiBAcGF0aFxuICAgICAgICBodG1sOiBmYWxzZVxuICAgICAgICBkZWxheTpcbiAgICAgICAgICBzaG93OiAxMDAwXG4gICAgICAgICAgaGlkZTogMTAwXG4gICAgICAgIHBsYWNlbWVudDogJ2JvdHRvbSdcblxuICBkZXN0cm95VG9vbHRpcDogLT5cbiAgICByZXR1cm4gdW5sZXNzIEBoYXNCZWVuTW91c2VkT3ZlclxuICAgIEB0b29sdGlwPy5kaXNwb3NlKClcblxuICBkZXN0cm95OiAtPlxuICAgIEBzdWJzY3JpcHRpb25zPy5kaXNwb3NlKClcbiAgICBAbW91c2VFbnRlclN1YnNjcmlwdGlvbj8uZGlzcG9zZSgpXG4gICAgQHJlcG9TdWJzY3JpcHRpb25zPy5kaXNwb3NlKClcbiAgICBAZGVzdHJveVRvb2x0aXAoKVxuICAgIEBlbGVtZW50LnJlbW92ZSgpXG5cbiAgdXBkYXRlRGF0YUF0dHJpYnV0ZXM6IC0+XG4gICAgaWYgQHBhdGhcbiAgICAgIEBpdGVtVGl0bGUuZGF0YXNldC5uYW1lID0gcGF0aC5iYXNlbmFtZShAcGF0aClcbiAgICAgIEBpdGVtVGl0bGUuZGF0YXNldC5wYXRoID0gQHBhdGhcbiAgICBlbHNlXG4gICAgICBkZWxldGUgQGl0ZW1UaXRsZS5kYXRhc2V0Lm5hbWVcbiAgICAgIGRlbGV0ZSBAaXRlbVRpdGxlLmRhdGFzZXQucGF0aFxuXG4gICAgaWYgaXRlbUNsYXNzID0gQGl0ZW0uY29uc3RydWN0b3I/Lm5hbWVcbiAgICAgIEBlbGVtZW50LmRhdGFzZXQudHlwZSA9IGl0ZW1DbGFzc1xuICAgIGVsc2VcbiAgICAgIGRlbGV0ZSBAZWxlbWVudC5kYXRhc2V0LnR5cGVcblxuICB1cGRhdGVUaXRsZTogKHt1cGRhdGVTaWJsaW5ncywgdXNlTG9uZ1RpdGxlfT17fSkgLT5cbiAgICByZXR1cm4gaWYgQHVwZGF0aW5nVGl0bGVcbiAgICBAdXBkYXRpbmdUaXRsZSA9IHRydWVcblxuICAgIGlmIHVwZGF0ZVNpYmxpbmdzIGlzIGZhbHNlXG4gICAgICB0aXRsZSA9IEBpdGVtLmdldFRpdGxlKClcbiAgICAgIHRpdGxlID0gQGl0ZW0uZ2V0TG9uZ1RpdGxlPygpID8gdGl0bGUgaWYgdXNlTG9uZ1RpdGxlXG4gICAgICBAaXRlbVRpdGxlLnRleHRDb250ZW50ID0gdGl0bGVcbiAgICBlbHNlXG4gICAgICB0aXRsZSA9IEBpdGVtLmdldFRpdGxlKClcbiAgICAgIHVzZUxvbmdUaXRsZSA9IGZhbHNlXG4gICAgICBmb3IgdGFiIGluIEB0YWJzIHdoZW4gdGFiIGlzbnQgdGhpc1xuICAgICAgICBpZiB0YWIuaXRlbS5nZXRUaXRsZSgpIGlzIHRpdGxlXG4gICAgICAgICAgdGFiLnVwZGF0ZVRpdGxlKHVwZGF0ZVNpYmxpbmdzOiBmYWxzZSwgdXNlTG9uZ1RpdGxlOiB0cnVlKVxuICAgICAgICAgIHVzZUxvbmdUaXRsZSA9IHRydWVcbiAgICAgIHRpdGxlID0gQGl0ZW0uZ2V0TG9uZ1RpdGxlPygpID8gdGl0bGUgaWYgdXNlTG9uZ1RpdGxlXG5cbiAgICAgIEBpdGVtVGl0bGUudGV4dENvbnRlbnQgPSB0aXRsZVxuXG4gICAgQHVwZGF0aW5nVGl0bGUgPSBmYWxzZVxuXG4gIHVwZGF0ZUljb246IC0+XG4gICAgaWYgQGljb25OYW1lXG4gICAgICBuYW1lcyA9IHVubGVzcyBBcnJheS5pc0FycmF5KEBpY29uTmFtZSkgdGhlbiBAaWNvbk5hbWUuc3BsaXQoL1xccysvZykgZWxzZSBAaWNvbk5hbWVcbiAgICAgIEBpdGVtVGl0bGUuY2xhc3NMaXN0LnJlbW92ZSgnaWNvbicsIFwiaWNvbi0je25hbWVzWzBdfVwiLCBuYW1lcy4uLilcblxuICAgIGlmIEBpY29uTmFtZSA9IEBpdGVtLmdldEljb25OYW1lPygpXG4gICAgICBAaXRlbVRpdGxlLmNsYXNzTGlzdC5hZGQoJ2ljb24nLCBcImljb24tI3tAaWNvbk5hbWV9XCIpXG4gICAgZWxzZSBpZiBAcGF0aD8gYW5kIEBpY29uTmFtZSA9IEZpbGVJY29ucy5nZXRTZXJ2aWNlKCkuaWNvbkNsYXNzRm9yUGF0aChAcGF0aCwgXCJ0YWJzXCIpXG4gICAgICB1bmxlc3MgQXJyYXkuaXNBcnJheSBuYW1lcyA9IEBpY29uTmFtZVxuICAgICAgICBuYW1lcyA9IG5hbWVzLnRvU3RyaW5nKCkuc3BsaXQgL1xccysvZ1xuXG4gICAgICBAaXRlbVRpdGxlLmNsYXNzTGlzdC5hZGQoJ2ljb24nLCBuYW1lcy4uLilcblxuICBpc0l0ZW1QZW5kaW5nOiAtPlxuICAgIGlmIEBwYW5lLmdldFBlbmRpbmdJdGVtP1xuICAgICAgQHBhbmUuZ2V0UGVuZGluZ0l0ZW0oKSBpcyBAaXRlbVxuICAgIGVsc2UgaWYgQGl0ZW0uaXNQZW5kaW5nP1xuICAgICAgQGl0ZW0uaXNQZW5kaW5nKClcblxuICB0ZXJtaW5hdGVQZW5kaW5nU3RhdGU6IC0+XG4gICAgaWYgQHBhbmUuY2xlYXJQZW5kaW5nSXRlbT9cbiAgICAgIEBwYW5lLmNsZWFyUGVuZGluZ0l0ZW0oKSBpZiBAcGFuZS5nZXRQZW5kaW5nSXRlbSgpIGlzIEBpdGVtXG4gICAgZWxzZSBpZiBAaXRlbS50ZXJtaW5hdGVQZW5kaW5nU3RhdGU/XG4gICAgICBAaXRlbS50ZXJtaW5hdGVQZW5kaW5nU3RhdGUoKVxuXG4gIGNsZWFyUGVuZGluZzogLT5cbiAgICBAaXRlbVRpdGxlLmNsYXNzTGlzdC5yZW1vdmUoJ3RlbXAnKVxuICAgIEBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ3BlbmRpbmctdGFiJylcblxuICB1cGRhdGVJY29uVmlzaWJpbGl0eTogLT5cbiAgICBpZiBhdG9tLmNvbmZpZy5nZXQgJ3RhYnMuc2hvd0ljb25zJ1xuICAgICAgQGl0ZW1UaXRsZS5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlLWljb24nKVxuICAgIGVsc2VcbiAgICAgIEBpdGVtVGl0bGUuY2xhc3NMaXN0LmFkZCgnaGlkZS1pY29uJylcblxuICB1cGRhdGVNb2RpZmllZFN0YXR1czogLT5cbiAgICBpZiBAaXRlbS5pc01vZGlmaWVkPygpXG4gICAgICBAZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdtb2RpZmllZCcpIHVubGVzcyBAaXNNb2RpZmllZFxuICAgICAgQGlzTW9kaWZpZWQgPSB0cnVlXG4gICAgZWxzZVxuICAgICAgQGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnbW9kaWZpZWQnKSBpZiBAaXNNb2RpZmllZFxuICAgICAgQGlzTW9kaWZpZWQgPSBmYWxzZVxuXG4gIHNldHVwVmNzU3RhdHVzOiAtPlxuICAgIHJldHVybiB1bmxlc3MgQHBhdGg/XG4gICAgQHJlcG9Gb3JQYXRoKEBwYXRoKS50aGVuIChyZXBvKSA9PlxuICAgICAgQHN1YnNjcmliZVRvUmVwbyhyZXBvKVxuICAgICAgQHVwZGF0ZVZjc1N0YXR1cyhyZXBvKVxuXG4gICMgU3Vic2NyaWJlIHRvIHRoZSBwcm9qZWN0J3MgcmVwbyBmb3IgY2hhbmdlcyB0byB0aGUgVkNTIHN0YXR1cyBvZiB0aGUgZmlsZS5cbiAgc3Vic2NyaWJlVG9SZXBvOiAocmVwbykgLT5cbiAgICByZXR1cm4gdW5sZXNzIHJlcG8/XG5cbiAgICAjIFJlbW92ZSBwcmV2aW91cyByZXBvIHN1YnNjcmlwdGlvbnMuXG4gICAgQHJlcG9TdWJzY3JpcHRpb25zPy5kaXNwb3NlKClcbiAgICBAcmVwb1N1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgICBAcmVwb1N1YnNjcmlwdGlvbnMuYWRkIHJlcG8ub25EaWRDaGFuZ2VTdGF0dXMgKGV2ZW50KSA9PlxuICAgICAgQHVwZGF0ZVZjc1N0YXR1cyhyZXBvLCBldmVudC5wYXRoU3RhdHVzKSBpZiBldmVudC5wYXRoIGlzIEBwYXRoXG4gICAgQHJlcG9TdWJzY3JpcHRpb25zLmFkZCByZXBvLm9uRGlkQ2hhbmdlU3RhdHVzZXMgPT5cbiAgICAgIEB1cGRhdGVWY3NTdGF0dXMocmVwbylcblxuICByZXBvRm9yUGF0aDogLT5cbiAgICBmb3IgZGlyIGluIGF0b20ucHJvamVjdC5nZXREaXJlY3RvcmllcygpXG4gICAgICByZXR1cm4gYXRvbS5wcm9qZWN0LnJlcG9zaXRvcnlGb3JEaXJlY3RvcnkoZGlyKSBpZiBkaXIuY29udGFpbnMgQHBhdGhcbiAgICBQcm9taXNlLnJlc29sdmUobnVsbClcblxuICAjIFVwZGF0ZSB0aGUgVkNTIHN0YXR1cyBwcm9wZXJ0eSBvZiB0aGlzIHRhYiB1c2luZyB0aGUgcmVwby5cbiAgdXBkYXRlVmNzU3RhdHVzOiAocmVwbywgc3RhdHVzKSAtPlxuICAgIHJldHVybiB1bmxlc3MgcmVwbz9cblxuICAgIG5ld1N0YXR1cyA9IG51bGxcbiAgICBpZiByZXBvLmlzUGF0aElnbm9yZWQoQHBhdGgpXG4gICAgICBuZXdTdGF0dXMgPSAnaWdub3JlZCdcbiAgICBlbHNlXG4gICAgICBzdGF0dXMgPSByZXBvLmdldENhY2hlZFBhdGhTdGF0dXMoQHBhdGgpIHVubGVzcyBzdGF0dXM/XG4gICAgICBpZiByZXBvLmlzU3RhdHVzTW9kaWZpZWQoc3RhdHVzKVxuICAgICAgICBuZXdTdGF0dXMgPSAnbW9kaWZpZWQnXG4gICAgICBlbHNlIGlmIHJlcG8uaXNTdGF0dXNOZXcoc3RhdHVzKVxuICAgICAgICBuZXdTdGF0dXMgPSAnYWRkZWQnXG5cbiAgICBpZiBuZXdTdGF0dXMgaXNudCBAc3RhdHVzXG4gICAgICBAc3RhdHVzID0gbmV3U3RhdHVzXG4gICAgICBAdXBkYXRlVmNzQ29sb3JpbmcoKVxuXG4gIHVwZGF0ZVZjc0NvbG9yaW5nOiAtPlxuICAgIEBpdGVtVGl0bGUuY2xhc3NMaXN0LnJlbW92ZSgnc3RhdHVzLWlnbm9yZWQnLCAnc3RhdHVzLW1vZGlmaWVkJywgICdzdGF0dXMtYWRkZWQnKVxuICAgIGlmIEBzdGF0dXMgYW5kIGF0b20uY29uZmlnLmdldCAndGFicy5lbmFibGVWY3NDb2xvcmluZydcbiAgICAgIEBpdGVtVGl0bGUuY2xhc3NMaXN0LmFkZChcInN0YXR1cy0je0BzdGF0dXN9XCIpXG5cbiAgdW5zZXRWY3NTdGF0dXM6IC0+XG4gICAgQHJlcG9TdWJzY3JpcHRpb25zPy5kaXNwb3NlKClcbiAgICBkZWxldGUgQHN0YXR1c1xuICAgIEB1cGRhdGVWY3NDb2xvcmluZygpXG4iXX0=
