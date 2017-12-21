(function() {
  var CompositeDisposable, Disposable, TabView, getIconServices, layout, path, ref;

  path = require('path');

  ref = require('atom'), Disposable = ref.Disposable, CompositeDisposable = ref.CompositeDisposable;

  getIconServices = require('./get-icon-services');

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
          _this.updateTooltip();
          return _this.updateIcon();
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
      this.subscriptions.add(getIconServices().onDidChange((function(_this) {
        return function() {
          return _this.updateIcon();
        };
      })(this)));
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
      return getIconServices().updateTabIcon(this);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3Rlc3QvLmRvdGZpbGVzL2F0b20vcGFja2FnZXMvdGFicy9saWIvdGFiLXZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsTUFBb0MsT0FBQSxDQUFRLE1BQVIsQ0FBcEMsRUFBQywyQkFBRCxFQUFhOztFQUNiLGVBQUEsR0FBa0IsT0FBQSxDQUFRLHFCQUFSOztFQUVsQixNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVI7O0VBRVQsTUFBTSxDQUFDLE9BQVAsR0FDTTtJQUNTLGlCQUFDLEdBQUQ7QUFDWCxVQUFBO01BRGEsSUFBQyxDQUFBLFdBQUEsTUFBTSxJQUFDLENBQUEsV0FBQSxNQUFNLDJDQUFtQixJQUFDLENBQUEsV0FBQSxNQUFNO01BQ3JELElBQUcsT0FBTyxJQUFDLENBQUEsSUFBSSxDQUFDLE9BQWIsS0FBd0IsVUFBM0I7UUFDRSxJQUFDLENBQUEsSUFBRCxHQUFRLElBQUMsQ0FBQSxJQUFJLENBQUMsT0FBTixDQUFBLEVBRFY7O01BR0EsSUFBQyxDQUFBLE9BQUQsR0FBVyxRQUFRLENBQUMsYUFBVCxDQUF1QixJQUF2QjtNQUNYLElBQUMsQ0FBQSxPQUFPLENBQUMsWUFBVCxDQUFzQixJQUF0QixFQUE0QixVQUE1QjtNQUNBLElBQUcsQ0FBQyxZQUFELEVBQWUsVUFBZixDQUEwQixDQUFDLE9BQTNCLENBQW1DLElBQUMsQ0FBQSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQXJELENBQUEsR0FBNkQsQ0FBQyxDQUFqRTtRQUNFLElBQUMsQ0FBQSxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQW5CLENBQXVCLFlBQXZCLEVBREY7O01BRUEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBbkIsQ0FBdUIsS0FBdkIsRUFBOEIsVUFBOUI7TUFFQSxJQUFDLENBQUEsU0FBRCxHQUFh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U0FBUyxDQUFDLFNBQVMsQ0FBQyxHQUFyQixDQUF5QixTQUFBLEdBQVUsSUFBQyxDQUFBLE1BQXBDLEVBREY7O0lBRmlCOztzQkFLbkIsY0FBQSxHQUFnQixTQUFBO0FBQ2QsVUFBQTs7WUFBa0IsQ0FBRSxPQUFwQixDQUFBOztNQUNBLE9BQU8sSUFBQyxDQUFBO2FBQ1IsSUFBQyxDQUFBLGlCQUFELENBQUE7SUFIYzs7Ozs7QUE3U2xCIiwic291cmNlc0NvbnRlbnQiOlsicGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG57RGlzcG9zYWJsZSwgQ29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xuZ2V0SWNvblNlcnZpY2VzID0gcmVxdWlyZSAnLi9nZXQtaWNvbi1zZXJ2aWNlcydcblxubGF5b3V0ID0gcmVxdWlyZSAnLi9sYXlvdXQnXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIFRhYlZpZXdcbiAgY29uc3RydWN0b3I6ICh7QGl0ZW0sIEBwYW5lLCBkaWRDbGlja0Nsb3NlSWNvbiwgQHRhYnMsIGxvY2F0aW9ufSkgLT5cbiAgICBpZiB0eXBlb2YgQGl0ZW0uZ2V0UGF0aCBpcyAnZnVuY3Rpb24nXG4gICAgICBAcGF0aCA9IEBpdGVtLmdldFBhdGgoKVxuXG4gICAgQGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpXG4gICAgQGVsZW1lbnQuc2V0QXR0cmlidXRlKCdpcycsICd0YWJzLXRhYicpXG4gICAgaWYgWydUZXh0RWRpdG9yJywgJ1Rlc3RWaWV3J10uaW5kZXhPZihAaXRlbS5jb25zdHJ1Y3Rvci5uYW1lKSA+IC0xXG4gICAgICBAZWxlbWVudC5jbGFzc0xpc3QuYWRkKCd0ZXh0ZWRpdG9yJylcbiAgICBAZWxlbWVudC5jbGFzc0xpc3QuYWRkKCd0YWInLCAnc29ydGFibGUnKVxuXG4gICAgQGl0ZW1UaXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgQGl0ZW1UaXRsZS5jbGFzc0xpc3QuYWRkKCd0aXRsZScpXG4gICAgQGVsZW1lbnQuYXBwZW5kQ2hpbGQoQGl0ZW1UaXRsZSlcblxuICAgIGlmIGxvY2F0aW9uIGlzICdjZW50ZXInIG9yIG5vdCBAaXRlbS5pc1Blcm1hbmVudERvY2tJdGVtPygpXG4gICAgICBjbG9zZUljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgICAgY2xvc2VJY29uLmNsYXNzTGlzdC5hZGQoJ2Nsb3NlLWljb24nKVxuICAgICAgY2xvc2VJY29uLm9uY2xpY2sgPSBkaWRDbGlja0Nsb3NlSWNvblxuICAgICAgQGVsZW1lbnQuYXBwZW5kQ2hpbGQoY2xvc2VJY29uKVxuXG4gICAgQHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgICBAaGFuZGxlRXZlbnRzKClcbiAgICBAdXBkYXRlRGF0YUF0dHJpYnV0ZXMoKVxuICAgIEB1cGRhdGVUaXRsZSgpXG4gICAgQHVwZGF0ZUljb24oKVxuICAgIEB1cGRhdGVNb2RpZmllZFN0YXR1cygpXG4gICAgQHNldHVwVG9vbHRpcCgpXG5cbiAgICBpZiBAaXNJdGVtUGVuZGluZygpXG4gICAgICBAaXRlbVRpdGxlLmNsYXNzTGlzdC5hZGQoJ3RlbXAnKVxuICAgICAgQGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgncGVuZGluZy10YWInKVxuXG4gICAgQGVsZW1lbnQub25kcmFnID0gKGUpIC0+IGxheW91dC5kcmFnIGVcbiAgICBAZWxlbWVudC5vbmRyYWdlbmQgPSAoZSkgLT4gbGF5b3V0LmVuZCBlXG5cbiAgICBAZWxlbWVudC5wYW5lID0gQHBhbmVcbiAgICBAZWxlbWVudC5pdGVtID0gQGl0ZW1cbiAgICBAZWxlbWVudC5pdGVtVGl0bGUgPSBAaXRlbVRpdGxlXG4gICAgQGVsZW1lbnQucGF0aCA9IEBwYXRoXG5cbiAgaGFuZGxlRXZlbnRzOiAtPlxuICAgIHRpdGxlQ2hhbmdlZEhhbmRsZXIgPSA9PlxuICAgICAgQHVwZGF0ZVRpdGxlKClcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBAcGFuZS5vbkRpZERlc3Ryb3kgPT4gQGRlc3Ryb3koKVxuXG4gICAgIyBUT0RPOiByZW1vdmUgZWxzZSBjb25kaXRpb24gb25jZSBwZW5kaW5nIEFQSSBpcyBvbiBzdGFibGUgW01LVF1cbiAgICBpZiB0eXBlb2YgQHBhbmUub25JdGVtRGlkVGVybWluYXRlUGVuZGluZ1N0YXRlIGlzICdmdW5jdGlvbidcbiAgICAgIEBzdWJzY3JpcHRpb25zLmFkZCBAcGFuZS5vbkl0ZW1EaWRUZXJtaW5hdGVQZW5kaW5nU3RhdGUgKGl0ZW0pID0+XG4gICAgICAgIEBjbGVhclBlbmRpbmcoKSBpZiBpdGVtIGlzIEBpdGVtXG4gICAgZWxzZSBpZiB0eXBlb2YgQGl0ZW0ub25EaWRUZXJtaW5hdGVQZW5kaW5nU3RhdGUgaXMgJ2Z1bmN0aW9uJ1xuICAgICAgb25EaWRUZXJtaW5hdGVQZW5kaW5nU3RhdGVEaXNwb3NhYmxlID0gQGl0ZW0ub25EaWRUZXJtaW5hdGVQZW5kaW5nU3RhdGUgPT4gQGNsZWFyUGVuZGluZygpXG4gICAgICBpZiBEaXNwb3NhYmxlLmlzRGlzcG9zYWJsZShvbkRpZFRlcm1pbmF0ZVBlbmRpbmdTdGF0ZURpc3Bvc2FibGUpXG4gICAgICAgIEBzdWJzY3JpcHRpb25zLmFkZChvbkRpZFRlcm1pbmF0ZVBlbmRpbmdTdGF0ZURpc3Bvc2FibGUpXG4gICAgICBlbHNlXG4gICAgICAgIGNvbnNvbGUud2FybiBcIjo6b25EaWRUZXJtaW5hdGVQZW5kaW5nU3RhdGUgZG9lcyBub3QgcmV0dXJuIGEgdmFsaWQgRGlzcG9zYWJsZSFcIiwgQGl0ZW1cblxuICAgIGlmIHR5cGVvZiBAaXRlbS5vbkRpZENoYW5nZVRpdGxlIGlzICdmdW5jdGlvbidcbiAgICAgIG9uRGlkQ2hhbmdlVGl0bGVEaXNwb3NhYmxlID0gQGl0ZW0ub25EaWRDaGFuZ2VUaXRsZSh0aXRsZUNoYW5nZWRIYW5kbGVyKVxuICAgICAgaWYgRGlzcG9zYWJsZS5pc0Rpc3Bvc2FibGUob25EaWRDaGFuZ2VUaXRsZURpc3Bvc2FibGUpXG4gICAgICAgIEBzdWJzY3JpcHRpb25zLmFkZChvbkRpZENoYW5nZVRpdGxlRGlzcG9zYWJsZSlcbiAgICAgIGVsc2VcbiAgICAgICAgY29uc29sZS53YXJuIFwiOjpvbkRpZENoYW5nZVRpdGxlIGRvZXMgbm90IHJldHVybiBhIHZhbGlkIERpc3Bvc2FibGUhXCIsIEBpdGVtXG4gICAgZWxzZSBpZiB0eXBlb2YgQGl0ZW0ub24gaXMgJ2Z1bmN0aW9uJ1xuICAgICAgI1RPRE8gUmVtb3ZlIG9uY2Ugb2xkIGV2ZW50cyBhcmUgbm8gbG9uZ2VyIHN1cHBvcnRlZFxuICAgICAgQGl0ZW0ub24oJ3RpdGxlLWNoYW5nZWQnLCB0aXRsZUNoYW5nZWRIYW5kbGVyKVxuICAgICAgQHN1YnNjcmlwdGlvbnMuYWRkIGRpc3Bvc2U6ID0+XG4gICAgICAgIEBpdGVtLm9mZj8oJ3RpdGxlLWNoYW5nZWQnLCB0aXRsZUNoYW5nZWRIYW5kbGVyKVxuXG4gICAgcGF0aENoYW5nZWRIYW5kbGVyID0gKEBwYXRoKSA9PlxuICAgICAgQHVwZGF0ZURhdGFBdHRyaWJ1dGVzKClcbiAgICAgIEB1cGRhdGVUaXRsZSgpXG4gICAgICBAdXBkYXRlVG9vbHRpcCgpXG4gICAgICBAdXBkYXRlSWNvbigpXG5cbiAgICBpZiB0eXBlb2YgQGl0ZW0ub25EaWRDaGFuZ2VQYXRoIGlzICdmdW5jdGlvbidcbiAgICAgIG9uRGlkQ2hhbmdlUGF0aERpc3Bvc2FibGUgPSBAaXRlbS5vbkRpZENoYW5nZVBhdGgocGF0aENoYW5nZWRIYW5kbGVyKVxuICAgICAgaWYgRGlzcG9zYWJsZS5pc0Rpc3Bvc2FibGUob25EaWRDaGFuZ2VQYXRoRGlzcG9zYWJsZSlcbiAgICAgICAgQHN1YnNjcmlwdGlvbnMuYWRkKG9uRGlkQ2hhbmdlUGF0aERpc3Bvc2FibGUpXG4gICAgICBlbHNlXG4gICAgICAgIGNvbnNvbGUud2FybiBcIjo6b25EaWRDaGFuZ2VQYXRoIGRvZXMgbm90IHJldHVybiBhIHZhbGlkIERpc3Bvc2FibGUhXCIsIEBpdGVtXG4gICAgZWxzZSBpZiB0eXBlb2YgQGl0ZW0ub24gaXMgJ2Z1bmN0aW9uJ1xuICAgICAgI1RPRE8gUmVtb3ZlIG9uY2Ugb2xkIGV2ZW50cyBhcmUgbm8gbG9uZ2VyIHN1cHBvcnRlZFxuICAgICAgQGl0ZW0ub24oJ3BhdGgtY2hhbmdlZCcsIHBhdGhDaGFuZ2VkSGFuZGxlcilcbiAgICAgIEBzdWJzY3JpcHRpb25zLmFkZCBkaXNwb3NlOiA9PlxuICAgICAgICBAaXRlbS5vZmY/KCdwYXRoLWNoYW5nZWQnLCBwYXRoQ2hhbmdlZEhhbmRsZXIpXG5cbiAgICBpY29uQ2hhbmdlZEhhbmRsZXIgPSA9PlxuICAgICAgQHVwZGF0ZUljb24oKVxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGdldEljb25TZXJ2aWNlcygpLm9uRGlkQ2hhbmdlID0+IEB1cGRhdGVJY29uKClcblxuICAgIGlmIHR5cGVvZiBAaXRlbS5vbkRpZENoYW5nZUljb24gaXMgJ2Z1bmN0aW9uJ1xuICAgICAgb25EaWRDaGFuZ2VJY29uRGlzcG9zYWJsZSA9IEBpdGVtLm9uRGlkQ2hhbmdlSWNvbj8gPT5cbiAgICAgICAgQHVwZGF0ZUljb24oKVxuICAgICAgaWYgRGlzcG9zYWJsZS5pc0Rpc3Bvc2FibGUob25EaWRDaGFuZ2VJY29uRGlzcG9zYWJsZSlcbiAgICAgICAgQHN1YnNjcmlwdGlvbnMuYWRkKG9uRGlkQ2hhbmdlSWNvbkRpc3Bvc2FibGUpXG4gICAgICBlbHNlXG4gICAgICAgIGNvbnNvbGUud2FybiBcIjo6b25EaWRDaGFuZ2VJY29uIGRvZXMgbm90IHJldHVybiBhIHZhbGlkIERpc3Bvc2FibGUhXCIsIEBpdGVtXG4gICAgZWxzZSBpZiB0eXBlb2YgQGl0ZW0ub24gaXMgJ2Z1bmN0aW9uJ1xuICAgICAgI1RPRE8gUmVtb3ZlIG9uY2Ugb2xkIGV2ZW50cyBhcmUgbm8gbG9uZ2VyIHN1cHBvcnRlZFxuICAgICAgQGl0ZW0ub24oJ2ljb24tY2hhbmdlZCcsIGljb25DaGFuZ2VkSGFuZGxlcilcbiAgICAgIEBzdWJzY3JpcHRpb25zLmFkZCBkaXNwb3NlOiA9PlxuICAgICAgICBAaXRlbS5vZmY/KCdpY29uLWNoYW5nZWQnLCBpY29uQ2hhbmdlZEhhbmRsZXIpXG5cbiAgICBtb2RpZmllZEhhbmRsZXIgPSA9PlxuICAgICAgQHVwZGF0ZU1vZGlmaWVkU3RhdHVzKClcblxuICAgIGlmIHR5cGVvZiBAaXRlbS5vbkRpZENoYW5nZU1vZGlmaWVkIGlzICdmdW5jdGlvbidcbiAgICAgIG9uRGlkQ2hhbmdlTW9kaWZpZWREaXNwb3NhYmxlID0gQGl0ZW0ub25EaWRDaGFuZ2VNb2RpZmllZChtb2RpZmllZEhhbmRsZXIpXG4gICAgICBpZiBEaXNwb3NhYmxlLmlzRGlzcG9zYWJsZShvbkRpZENoYW5nZU1vZGlmaWVkRGlzcG9zYWJsZSlcbiAgICAgICAgQHN1YnNjcmlwdGlvbnMuYWRkKG9uRGlkQ2hhbmdlTW9kaWZpZWREaXNwb3NhYmxlKVxuICAgICAgZWxzZVxuICAgICAgICBjb25zb2xlLndhcm4gXCI6Om9uRGlkQ2hhbmdlTW9kaWZpZWQgZG9lcyBub3QgcmV0dXJuIGEgdmFsaWQgRGlzcG9zYWJsZSFcIiwgQGl0ZW1cbiAgICBlbHNlIGlmIHR5cGVvZiBAaXRlbS5vbiBpcyAnZnVuY3Rpb24nXG4gICAgICAjVE9ETyBSZW1vdmUgb25jZSBvbGQgZXZlbnRzIGFyZSBubyBsb25nZXIgc3VwcG9ydGVkXG4gICAgICBAaXRlbS5vbignbW9kaWZpZWQtc3RhdHVzLWNoYW5nZWQnLCBtb2RpZmllZEhhbmRsZXIpXG4gICAgICBAc3Vic2NyaXB0aW9ucy5hZGQgZGlzcG9zZTogPT5cbiAgICAgICAgQGl0ZW0ub2ZmPygnbW9kaWZpZWQtc3RhdHVzLWNoYW5nZWQnLCBtb2RpZmllZEhhbmRsZXIpXG5cbiAgICBpZiB0eXBlb2YgQGl0ZW0ub25EaWRTYXZlIGlzICdmdW5jdGlvbidcbiAgICAgIG9uRGlkU2F2ZURpc3Bvc2FibGUgPSBAaXRlbS5vbkRpZFNhdmUgKGV2ZW50KSA9PlxuICAgICAgICBAdGVybWluYXRlUGVuZGluZ1N0YXRlKClcbiAgICAgICAgaWYgZXZlbnQucGF0aCBpc250IEBwYXRoXG4gICAgICAgICAgQHBhdGggPSBldmVudC5wYXRoXG4gICAgICAgICAgQHNldHVwVmNzU3RhdHVzKCkgaWYgYXRvbS5jb25maWcuZ2V0ICd0YWJzLmVuYWJsZVZjc0NvbG9yaW5nJ1xuXG4gICAgICBpZiBEaXNwb3NhYmxlLmlzRGlzcG9zYWJsZShvbkRpZFNhdmVEaXNwb3NhYmxlKVxuICAgICAgICBAc3Vic2NyaXB0aW9ucy5hZGQob25EaWRTYXZlRGlzcG9zYWJsZSlcbiAgICAgIGVsc2VcbiAgICAgICAgY29uc29sZS53YXJuIFwiOjpvbkRpZFNhdmUgZG9lcyBub3QgcmV0dXJuIGEgdmFsaWQgRGlzcG9zYWJsZSFcIiwgQGl0ZW1cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb25maWcub2JzZXJ2ZSAndGFicy5zaG93SWNvbnMnLCA9PlxuICAgICAgQHVwZGF0ZUljb25WaXNpYmlsaXR5KClcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbmZpZy5vYnNlcnZlICd0YWJzLmVuYWJsZVZjc0NvbG9yaW5nJywgKGlzRW5hYmxlZCkgPT5cbiAgICAgIGlmIGlzRW5hYmxlZCBhbmQgQHBhdGg/IHRoZW4gQHNldHVwVmNzU3RhdHVzKCkgZWxzZSBAdW5zZXRWY3NTdGF0dXMoKVxuXG4gIHNldHVwVG9vbHRpcDogLT5cbiAgICAjIERlZmVyIGNyZWF0aW5nIHRoZSB0b29sdGlwIHVudGlsIHRoZSB0YWIgaXMgbW91c2VkIG92ZXJcbiAgICBvbk1vdXNlRW50ZXIgPSA9PlxuICAgICAgQG1vdXNlRW50ZXJTdWJzY3JpcHRpb24uZGlzcG9zZSgpXG4gICAgICBAaGFzQmVlbk1vdXNlZE92ZXIgPSB0cnVlXG4gICAgICBAdXBkYXRlVG9vbHRpcCgpXG5cbiAgICAgICMgVHJpZ2dlciBhZ2FpbiBzbyB0aGUgdG9vbHRpcCBzaG93c1xuICAgICAgQGVsZW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ21vdXNlZW50ZXInLCBidWJibGVzOiB0cnVlKSlcblxuICAgIEBtb3VzZUVudGVyU3Vic2NyaXB0aW9uID0gZGlzcG9zZTogPT5cbiAgICAgIEBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCBvbk1vdXNlRW50ZXIpXG4gICAgICBAbW91c2VFbnRlclN1YnNjcmlwdGlvbiA9IG51bGxcblxuICAgIEBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCBvbk1vdXNlRW50ZXIpXG5cbiAgdXBkYXRlVG9vbHRpcDogLT5cbiAgICByZXR1cm4gdW5sZXNzIEBoYXNCZWVuTW91c2VkT3ZlclxuXG4gICAgQGRlc3Ryb3lUb29sdGlwKClcblxuICAgIGlmIEBwYXRoXG4gICAgICBAdG9vbHRpcCA9IGF0b20udG9vbHRpcHMuYWRkIEBlbGVtZW50LFxuICAgICAgICB0aXRsZTogQHBhdGhcbiAgICAgICAgaHRtbDogZmFsc2VcbiAgICAgICAgZGVsYXk6XG4gICAgICAgICAgc2hvdzogMTAwMFxuICAgICAgICAgIGhpZGU6IDEwMFxuICAgICAgICBwbGFjZW1lbnQ6ICdib3R0b20nXG5cbiAgZGVzdHJveVRvb2x0aXA6IC0+XG4gICAgcmV0dXJuIHVubGVzcyBAaGFzQmVlbk1vdXNlZE92ZXJcbiAgICBAdG9vbHRpcD8uZGlzcG9zZSgpXG5cbiAgZGVzdHJveTogLT5cbiAgICBAc3Vic2NyaXB0aW9ucz8uZGlzcG9zZSgpXG4gICAgQG1vdXNlRW50ZXJTdWJzY3JpcHRpb24/LmRpc3Bvc2UoKVxuICAgIEByZXBvU3Vic2NyaXB0aW9ucz8uZGlzcG9zZSgpXG4gICAgQGRlc3Ryb3lUb29sdGlwKClcbiAgICBAZWxlbWVudC5yZW1vdmUoKVxuXG4gIHVwZGF0ZURhdGFBdHRyaWJ1dGVzOiAtPlxuICAgIGlmIEBwYXRoXG4gICAgICBAaXRlbVRpdGxlLmRhdGFzZXQubmFtZSA9IHBhdGguYmFzZW5hbWUoQHBhdGgpXG4gICAgICBAaXRlbVRpdGxlLmRhdGFzZXQucGF0aCA9IEBwYXRoXG4gICAgZWxzZVxuICAgICAgZGVsZXRlIEBpdGVtVGl0bGUuZGF0YXNldC5uYW1lXG4gICAgICBkZWxldGUgQGl0ZW1UaXRsZS5kYXRhc2V0LnBhdGhcblxuICAgIGlmIGl0ZW1DbGFzcyA9IEBpdGVtLmNvbnN0cnVjdG9yPy5uYW1lXG4gICAgICBAZWxlbWVudC5kYXRhc2V0LnR5cGUgPSBpdGVtQ2xhc3NcbiAgICBlbHNlXG4gICAgICBkZWxldGUgQGVsZW1lbnQuZGF0YXNldC50eXBlXG5cbiAgdXBkYXRlVGl0bGU6ICh7dXBkYXRlU2libGluZ3MsIHVzZUxvbmdUaXRsZX09e30pIC0+XG4gICAgcmV0dXJuIGlmIEB1cGRhdGluZ1RpdGxlXG4gICAgQHVwZGF0aW5nVGl0bGUgPSB0cnVlXG5cbiAgICBpZiB1cGRhdGVTaWJsaW5ncyBpcyBmYWxzZVxuICAgICAgdGl0bGUgPSBAaXRlbS5nZXRUaXRsZSgpXG4gICAgICB0aXRsZSA9IEBpdGVtLmdldExvbmdUaXRsZT8oKSA/IHRpdGxlIGlmIHVzZUxvbmdUaXRsZVxuICAgICAgQGl0ZW1UaXRsZS50ZXh0Q29udGVudCA9IHRpdGxlXG4gICAgZWxzZVxuICAgICAgdGl0bGUgPSBAaXRlbS5nZXRUaXRsZSgpXG4gICAgICB1c2VMb25nVGl0bGUgPSBmYWxzZVxuICAgICAgZm9yIHRhYiBpbiBAdGFicyB3aGVuIHRhYiBpc250IHRoaXNcbiAgICAgICAgaWYgdGFiLml0ZW0uZ2V0VGl0bGUoKSBpcyB0aXRsZVxuICAgICAgICAgIHRhYi51cGRhdGVUaXRsZSh1cGRhdGVTaWJsaW5nczogZmFsc2UsIHVzZUxvbmdUaXRsZTogdHJ1ZSlcbiAgICAgICAgICB1c2VMb25nVGl0bGUgPSB0cnVlXG4gICAgICB0aXRsZSA9IEBpdGVtLmdldExvbmdUaXRsZT8oKSA/IHRpdGxlIGlmIHVzZUxvbmdUaXRsZVxuXG4gICAgICBAaXRlbVRpdGxlLnRleHRDb250ZW50ID0gdGl0bGVcblxuICAgIEB1cGRhdGluZ1RpdGxlID0gZmFsc2VcblxuICB1cGRhdGVJY29uOiAtPlxuICAgIGdldEljb25TZXJ2aWNlcygpLnVwZGF0ZVRhYkljb24odGhpcylcblxuICBpc0l0ZW1QZW5kaW5nOiAtPlxuICAgIGlmIEBwYW5lLmdldFBlbmRpbmdJdGVtP1xuICAgICAgQHBhbmUuZ2V0UGVuZGluZ0l0ZW0oKSBpcyBAaXRlbVxuICAgIGVsc2UgaWYgQGl0ZW0uaXNQZW5kaW5nP1xuICAgICAgQGl0ZW0uaXNQZW5kaW5nKClcblxuICB0ZXJtaW5hdGVQZW5kaW5nU3RhdGU6IC0+XG4gICAgaWYgQHBhbmUuY2xlYXJQZW5kaW5nSXRlbT9cbiAgICAgIEBwYW5lLmNsZWFyUGVuZGluZ0l0ZW0oKSBpZiBAcGFuZS5nZXRQZW5kaW5nSXRlbSgpIGlzIEBpdGVtXG4gICAgZWxzZSBpZiBAaXRlbS50ZXJtaW5hdGVQZW5kaW5nU3RhdGU/XG4gICAgICBAaXRlbS50ZXJtaW5hdGVQZW5kaW5nU3RhdGUoKVxuXG4gIGNsZWFyUGVuZGluZzogLT5cbiAgICBAaXRlbVRpdGxlLmNsYXNzTGlzdC5yZW1vdmUoJ3RlbXAnKVxuICAgIEBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ3BlbmRpbmctdGFiJylcblxuICB1cGRhdGVJY29uVmlzaWJpbGl0eTogLT5cbiAgICBpZiBhdG9tLmNvbmZpZy5nZXQgJ3RhYnMuc2hvd0ljb25zJ1xuICAgICAgQGl0ZW1UaXRsZS5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlLWljb24nKVxuICAgIGVsc2VcbiAgICAgIEBpdGVtVGl0bGUuY2xhc3NMaXN0LmFkZCgnaGlkZS1pY29uJylcblxuICB1cGRhdGVNb2RpZmllZFN0YXR1czogLT5cbiAgICBpZiBAaXRlbS5pc01vZGlmaWVkPygpXG4gICAgICBAZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdtb2RpZmllZCcpIHVubGVzcyBAaXNNb2RpZmllZFxuICAgICAgQGlzTW9kaWZpZWQgPSB0cnVlXG4gICAgZWxzZVxuICAgICAgQGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnbW9kaWZpZWQnKSBpZiBAaXNNb2RpZmllZFxuICAgICAgQGlzTW9kaWZpZWQgPSBmYWxzZVxuXG4gIHNldHVwVmNzU3RhdHVzOiAtPlxuICAgIHJldHVybiB1bmxlc3MgQHBhdGg/XG4gICAgQHJlcG9Gb3JQYXRoKEBwYXRoKS50aGVuIChyZXBvKSA9PlxuICAgICAgQHN1YnNjcmliZVRvUmVwbyhyZXBvKVxuICAgICAgQHVwZGF0ZVZjc1N0YXR1cyhyZXBvKVxuXG4gICMgU3Vic2NyaWJlIHRvIHRoZSBwcm9qZWN0J3MgcmVwbyBmb3IgY2hhbmdlcyB0byB0aGUgVkNTIHN0YXR1cyBvZiB0aGUgZmlsZS5cbiAgc3Vic2NyaWJlVG9SZXBvOiAocmVwbykgLT5cbiAgICByZXR1cm4gdW5sZXNzIHJlcG8/XG5cbiAgICAjIFJlbW92ZSBwcmV2aW91cyByZXBvIHN1YnNjcmlwdGlvbnMuXG4gICAgQHJlcG9TdWJzY3JpcHRpb25zPy5kaXNwb3NlKClcbiAgICBAcmVwb1N1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgICBAcmVwb1N1YnNjcmlwdGlvbnMuYWRkIHJlcG8ub25EaWRDaGFuZ2VTdGF0dXMgKGV2ZW50KSA9PlxuICAgICAgQHVwZGF0ZVZjc1N0YXR1cyhyZXBvLCBldmVudC5wYXRoU3RhdHVzKSBpZiBldmVudC5wYXRoIGlzIEBwYXRoXG4gICAgQHJlcG9TdWJzY3JpcHRpb25zLmFkZCByZXBvLm9uRGlkQ2hhbmdlU3RhdHVzZXMgPT5cbiAgICAgIEB1cGRhdGVWY3NTdGF0dXMocmVwbylcblxuICByZXBvRm9yUGF0aDogLT5cbiAgICBmb3IgZGlyIGluIGF0b20ucHJvamVjdC5nZXREaXJlY3RvcmllcygpXG4gICAgICByZXR1cm4gYXRvbS5wcm9qZWN0LnJlcG9zaXRvcnlGb3JEaXJlY3RvcnkoZGlyKSBpZiBkaXIuY29udGFpbnMgQHBhdGhcbiAgICBQcm9taXNlLnJlc29sdmUobnVsbClcblxuICAjIFVwZGF0ZSB0aGUgVkNTIHN0YXR1cyBwcm9wZXJ0eSBvZiB0aGlzIHRhYiB1c2luZyB0aGUgcmVwby5cbiAgdXBkYXRlVmNzU3RhdHVzOiAocmVwbywgc3RhdHVzKSAtPlxuICAgIHJldHVybiB1bmxlc3MgcmVwbz9cblxuICAgIG5ld1N0YXR1cyA9IG51bGxcbiAgICBpZiByZXBvLmlzUGF0aElnbm9yZWQoQHBhdGgpXG4gICAgICBuZXdTdGF0dXMgPSAnaWdub3JlZCdcbiAgICBlbHNlXG4gICAgICBzdGF0dXMgPSByZXBvLmdldENhY2hlZFBhdGhTdGF0dXMoQHBhdGgpIHVubGVzcyBzdGF0dXM/XG4gICAgICBpZiByZXBvLmlzU3RhdHVzTW9kaWZpZWQoc3RhdHVzKVxuICAgICAgICBuZXdTdGF0dXMgPSAnbW9kaWZpZWQnXG4gICAgICBlbHNlIGlmIHJlcG8uaXNTdGF0dXNOZXcoc3RhdHVzKVxuICAgICAgICBuZXdTdGF0dXMgPSAnYWRkZWQnXG5cbiAgICBpZiBuZXdTdGF0dXMgaXNudCBAc3RhdHVzXG4gICAgICBAc3RhdHVzID0gbmV3U3RhdHVzXG4gICAgICBAdXBkYXRlVmNzQ29sb3JpbmcoKVxuXG4gIHVwZGF0ZVZjc0NvbG9yaW5nOiAtPlxuICAgIEBpdGVtVGl0bGUuY2xhc3NMaXN0LnJlbW92ZSgnc3RhdHVzLWlnbm9yZWQnLCAnc3RhdHVzLW1vZGlmaWVkJywgICdzdGF0dXMtYWRkZWQnKVxuICAgIGlmIEBzdGF0dXMgYW5kIGF0b20uY29uZmlnLmdldCAndGFicy5lbmFibGVWY3NDb2xvcmluZydcbiAgICAgIEBpdGVtVGl0bGUuY2xhc3NMaXN0LmFkZChcInN0YXR1cy0je0BzdGF0dXN9XCIpXG5cbiAgdW5zZXRWY3NTdGF0dXM6IC0+XG4gICAgQHJlcG9TdWJzY3JpcHRpb25zPy5kaXNwb3NlKClcbiAgICBkZWxldGUgQHN0YXR1c1xuICAgIEB1cGRhdGVWY3NDb2xvcmluZygpXG4iXX0=
