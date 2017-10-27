(function() {
  var CompositeDisposable, Disposable, FileIcons, MRUListView, TabBarView, _, layout, ref;

  ref = require('atom'), CompositeDisposable = ref.CompositeDisposable, Disposable = ref.Disposable;

  FileIcons = require('./file-icons');

  layout = require('./layout');

  TabBarView = require('./tab-bar-view');

  MRUListView = require('./mru-list-view');

  _ = require('underscore-plus');

  module.exports = {
    activate: function(state) {
      var base, base1, base2, base3, base4, configKey, container, keyBindSource, location, paneContainers, ref1, subscriptions;
      layout.activate();
      this.tabBarViews = [];
      this.mruListViews = [];
      keyBindSource = 'tabs package';
      configKey = 'tabs.enableMruTabSwitching';
      this.updateTraversalKeybinds = function() {
        var bindings, disabledBindings;
        bindings = atom.keymaps.findKeyBindings({
          target: document.body,
          keystrokes: 'ctrl-tab'
        });
        if (bindings.length > 1 && bindings[0].source !== keyBindSource) {
          return;
        }
        bindings = atom.keymaps.findKeyBindings({
          target: document.body,
          keystrokes: 'ctrl-shift-tab'
        });
        if (bindings.length > 1 && bindings[0].source !== keyBindSource) {
          return;
        }
        if (atom.config.get(configKey)) {
          return atom.keymaps.removeBindingsFromSource(keyBindSource);
        } else {
          disabledBindings = {
            'body': {
              'ctrl-tab': 'pane:show-next-item',
              'ctrl-tab ^ctrl': 'unset!',
              'ctrl-shift-tab': 'pane:show-previous-item',
              'ctrl-shift-tab ^ctrl': 'unset!'
            }
          };
          return atom.keymaps.add(keyBindSource, disabledBindings, 0);
        }
      };
      atom.config.observe(configKey, (function(_this) {
        return function() {
          return _this.updateTraversalKeybinds();
        };
      })(this));
      if (typeof (base = atom.keymaps).onDidLoadUserKeymap === "function") {
        base.onDidLoadUserKeymap((function(_this) {
          return function() {
            return _this.updateTraversalKeybinds();
          };
        })(this));
      }
      atom.commands.add('atom-workspace', {
        'tabs:close-all-tabs': (function(_this) {
          return function() {
            var i, ref1, results, tabBarView;
            ref1 = _this.tabBarViews;
            results = [];
            for (i = ref1.length - 1; i >= 0; i += -1) {
              tabBarView = ref1[i];
              results.push(tabBarView.closeAllTabs());
            }
            return results;
          };
        })(this)
      });
      paneContainers = {
        center: (ref1 = typeof (base1 = atom.workspace).getCenter === "function" ? base1.getCenter() : void 0) != null ? ref1 : atom.workspace,
        left: typeof (base2 = atom.workspace).getLeftDock === "function" ? base2.getLeftDock() : void 0,
        right: typeof (base3 = atom.workspace).getRightDock === "function" ? base3.getRightDock() : void 0,
        bottom: typeof (base4 = atom.workspace).getBottomDock === "function" ? base4.getBottomDock() : void 0
      };
      subscriptions = (function() {
        var results;
        results = [];
        for (location in paneContainers) {
          container = paneContainers[location];
          if (!container) {
            continue;
          }
          results.push(container.observePanes((function(_this) {
            return function(pane) {
              var mruListView, paneElement, tabBarView;
              tabBarView = new TabBarView(pane, location);
              mruListView = new MRUListView;
              mruListView.initialize(pane);
              paneElement = atom.views.getView(pane);
              paneElement.insertBefore(tabBarView.element, paneElement.firstChild);
              _this.tabBarViews.push(tabBarView);
              pane.onDidDestroy(function() {
                return _.remove(_this.tabBarViews, tabBarView);
              });
              _this.mruListViews.push(mruListView);
              return pane.onDidDestroy(function() {
                return _.remove(_this.mruListViews, mruListView);
              });
            };
          })(this)));
        }
        return results;
      }).call(this);
      return this.paneSubscription = (function(func, args, ctor) {
        ctor.prototype = func.prototype;
        var child = new ctor, result = func.apply(child, args);
        return Object(result) === result ? result : child;
      })(CompositeDisposable, subscriptions, function(){});
    },
    deactivate: function() {
      var i, j, len, len1, mruListView, ref1, ref2, ref3, tabBarView;
      layout.deactivate();
      this.paneSubscription.dispose();
      if ((ref1 = this.fileIconsDisposable) != null) {
        ref1.dispose();
      }
      ref2 = this.tabBarViews;
      for (i = 0, len = ref2.length; i < len; i++) {
        tabBarView = ref2[i];
        tabBarView.destroy();
      }
      ref3 = this.mruListViews;
      for (j = 0, len1 = ref3.length; j < len1; j++) {
        mruListView = ref3[j];
        mruListView.destroy();
      }
    },
    consumeFileIcons: function(service) {
      FileIcons.setService(service);
      this.updateFileIcons();
      return new Disposable((function(_this) {
        return function() {
          FileIcons.resetService();
          return _this.updateFileIcons();
        };
      })(this));
    },
    updateFileIcons: function() {
      var i, len, ref1, results, tabBarView, tabView;
      ref1 = this.tabBarViews;
      results = [];
      for (i = 0, len = ref1.length; i < len; i++) {
        tabBarView = ref1[i];
        results.push((function() {
          var j, len1, ref2, results1;
          ref2 = tabBarView.getTabs();
          results1 = [];
          for (j = 0, len1 = ref2.length; j < len1; j++) {
            tabView = ref2[j];
            results1.push(tabView.updateIcon());
          }
          return results1;
        })());
      }
      return results;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RhYnMvbGliL21haW4uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxNQUFvQyxPQUFBLENBQVEsTUFBUixDQUFwQyxFQUFDLDZDQUFELEVBQXNCOztFQUN0QixTQUFBLEdBQVksT0FBQSxDQUFRLGNBQVI7O0VBQ1osTUFBQSxHQUFTLE9BQUEsQ0FBUSxVQUFSOztFQUNULFVBQUEsR0FBYSxPQUFBLENBQVEsZ0JBQVI7O0VBQ2IsV0FBQSxHQUFjLE9BQUEsQ0FBUSxpQkFBUjs7RUFDZCxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSOztFQUVKLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxRQUFBLEVBQVUsU0FBQyxLQUFEO0FBQ1IsVUFBQTtNQUFBLE1BQU0sQ0FBQyxRQUFQLENBQUE7TUFDQSxJQUFDLENBQUEsV0FBRCxHQUFlO01BQ2YsSUFBQyxDQUFBLFlBQUQsR0FBZ0I7TUFFaEIsYUFBQSxHQUFnQjtNQUNoQixTQUFBLEdBQVk7TUFFWixJQUFDLENBQUEsdUJBQUQsR0FBMkIsU0FBQTtBQUV6QixZQUFBO1FBQUEsUUFBQSxHQUFXLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBYixDQUNUO1VBQUEsTUFBQSxFQUFRLFFBQVEsQ0FBQyxJQUFqQjtVQUNBLFVBQUEsRUFBWSxVQURaO1NBRFM7UUFHWCxJQUFVLFFBQVEsQ0FBQyxNQUFULEdBQWtCLENBQWxCLElBQXdCLFFBQVMsQ0FBQSxDQUFBLENBQUUsQ0FBQyxNQUFaLEtBQXdCLGFBQTFEO0FBQUEsaUJBQUE7O1FBQ0EsUUFBQSxHQUFXLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBYixDQUNUO1VBQUEsTUFBQSxFQUFRLFFBQVEsQ0FBQyxJQUFqQjtVQUNBLFVBQUEsRUFBWSxnQkFEWjtTQURTO1FBR1gsSUFBVSxRQUFRLENBQUMsTUFBVCxHQUFrQixDQUFsQixJQUF3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QUE7O0FBQ0E7QUFBQSxXQUFBLHNDQUFBOztRQUFBLFVBQVUsQ0FBQyxPQUFYLENBQUE7QUFBQTtBQUNBO0FBQUEsV0FBQSx3Q0FBQTs7UUFBQSxXQUFXLENBQUMsT0FBWixDQUFBO0FBQUE7SUFMVSxDQWxFWjtJQTBFQSxnQkFBQSxFQUFrQixTQUFDLE9BQUQ7TUFDaEIsU0FBUyxDQUFDLFVBQVYsQ0FBcUIsT0FBckI7TUFDQSxJQUFDLENBQUEsZUFBRCxDQUFBO2FBQ0ksSUFBQSxVQUFBLENBQVcsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO1VBQ2IsU0FBUyxDQUFDLFlBQVYsQ0FBQTtpQkFDQSxLQUFDLENBQUEsZUFBRCxDQUFBO1FBRmE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVg7SUFIWSxDQTFFbEI7SUFpRkEsZUFBQSxFQUFpQixTQUFBO0FBQ2YsVUFBQTtBQUFBO0FBQUE7V0FBQSxzQ0FBQTs7OztBQUNFO0FBQUE7ZUFBQSx3Q0FBQTs7MEJBQUEsT0FBTyxDQUFDLFVBQVIsQ0FBQTtBQUFBOzs7QUFERjs7SUFEZSxDQWpGakI7O0FBUkYiLCJzb3VyY2VzQ29udGVudCI6WyJ7Q29tcG9zaXRlRGlzcG9zYWJsZSwgRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xuRmlsZUljb25zID0gcmVxdWlyZSAnLi9maWxlLWljb25zJ1xubGF5b3V0ID0gcmVxdWlyZSAnLi9sYXlvdXQnXG5UYWJCYXJWaWV3ID0gcmVxdWlyZSAnLi90YWItYmFyLXZpZXcnXG5NUlVMaXN0VmlldyA9IHJlcXVpcmUgJy4vbXJ1LWxpc3Qtdmlldydcbl8gPSByZXF1aXJlICd1bmRlcnNjb3JlLXBsdXMnXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgYWN0aXZhdGU6IChzdGF0ZSkgLT5cbiAgICBsYXlvdXQuYWN0aXZhdGUoKVxuICAgIEB0YWJCYXJWaWV3cyA9IFtdXG4gICAgQG1ydUxpc3RWaWV3cyA9IFtdXG5cbiAgICBrZXlCaW5kU291cmNlID0gJ3RhYnMgcGFja2FnZSdcbiAgICBjb25maWdLZXkgPSAndGFicy5lbmFibGVNcnVUYWJTd2l0Y2hpbmcnXG5cbiAgICBAdXBkYXRlVHJhdmVyc2FsS2V5YmluZHMgPSAtPlxuICAgICAgIyBXZSBkb24ndCBtb2RpZnkga2V5YmluZGluZ3MgYmFzZWQgb24gb3VyIHNldHRpbmcgaWYgdGhlIHVzZXIgaGFzIGFscmVhZHkgdHdlYWtlZCB0aGVtLlxuICAgICAgYmluZGluZ3MgPSBhdG9tLmtleW1hcHMuZmluZEtleUJpbmRpbmdzKFxuICAgICAgICB0YXJnZXQ6IGRvY3VtZW50LmJvZHksXG4gICAgICAgIGtleXN0cm9rZXM6ICdjdHJsLXRhYicpXG4gICAgICByZXR1cm4gaWYgYmluZGluZ3MubGVuZ3RoID4gMSBhbmQgYmluZGluZ3NbMF0uc291cmNlIGlzbnQga2V5QmluZFNvdXJjZVxuICAgICAgYmluZGluZ3MgPSBhdG9tLmtleW1hcHMuZmluZEtleUJpbmRpbmdzKFxuICAgICAgICB0YXJnZXQ6IGRvY3VtZW50LmJvZHksXG4gICAgICAgIGtleXN0cm9rZXM6ICdjdHJsLXNoaWZ0LXRhYicpXG4gICAgICByZXR1cm4gaWYgYmluZGluZ3MubGVuZ3RoID4gMSBhbmQgYmluZGluZ3NbMF0uc291cmNlIGlzbnQga2V5QmluZFNvdXJjZVxuXG4gICAgICBpZiBhdG9tLmNvbmZpZy5nZXQoY29uZmlnS2V5KVxuICAgICAgICBhdG9tLmtleW1hcHMucmVtb3ZlQmluZGluZ3NGcm9tU291cmNlKGtleUJpbmRTb3VyY2UpXG4gICAgICBlbHNlXG4gICAgICAgIGRpc2FibGVkQmluZGluZ3MgPVxuICAgICAgICAgICdib2R5JzpcbiAgICAgICAgICAgICdjdHJsLXRhYic6ICdwYW5lOnNob3ctbmV4dC1pdGVtJ1xuICAgICAgICAgICAgJ2N0cmwtdGFiIF5jdHJsJzogJ3Vuc2V0ISdcbiAgICAgICAgICAgICdjdHJsLXNoaWZ0LXRhYic6ICdwYW5lOnNob3ctcHJldmlvdXMtaXRlbSdcbiAgICAgICAgICAgICdjdHJsLXNoaWZ0LXRhYiBeY3RybCc6ICd1bnNldCEnXG4gICAgICAgIGF0b20ua2V5bWFwcy5hZGQoa2V5QmluZFNvdXJjZSwgZGlzYWJsZWRCaW5kaW5ncywgMClcblxuICAgIGF0b20uY29uZmlnLm9ic2VydmUgY29uZmlnS2V5LCA9PiBAdXBkYXRlVHJhdmVyc2FsS2V5YmluZHMoKVxuICAgIGF0b20ua2V5bWFwcy5vbkRpZExvYWRVc2VyS2V5bWFwPyA9PiBAdXBkYXRlVHJhdmVyc2FsS2V5YmluZHMoKVxuXG4gICAgIyBJZiB0aGUgY29tbWFuZCBidWJibGVzIHVwIHdpdGhvdXQgYmVpbmcgaGFuZGxlZCBieSBhIHBhcnRpY3VsYXIgcGFuZSxcbiAgICAjIGNsb3NlIGFsbCB0YWJzIGluIGFsbCBwYW5lc1xuICAgIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsXG4gICAgICAndGFiczpjbG9zZS1hbGwtdGFicyc6ID0+XG4gICAgICAgICMgV2UgbG9vcCBiYWNrd2FyZHMgYmVjYXVzZSB0aGUgcGFuZXMgYXJlXG4gICAgICAgICMgcmVtb3ZlZCBmcm9tIHRoZSBhcnJheSBhcyB3ZSBnb1xuICAgICAgICBmb3IgdGFiQmFyVmlldyBpbiBAdGFiQmFyVmlld3MgYnkgLTFcbiAgICAgICAgICB0YWJCYXJWaWV3LmNsb3NlQWxsVGFicygpXG5cbiAgICBwYW5lQ29udGFpbmVycyA9XG4gICAgICBjZW50ZXI6IGF0b20ud29ya3NwYWNlLmdldENlbnRlcj8oKSA/IGF0b20ud29ya3NwYWNlXG4gICAgICBsZWZ0OiBhdG9tLndvcmtzcGFjZS5nZXRMZWZ0RG9jaz8oKVxuICAgICAgcmlnaHQ6IGF0b20ud29ya3NwYWNlLmdldFJpZ2h0RG9jaz8oKVxuICAgICAgYm90dG9tOiBhdG9tLndvcmtzcGFjZS5nZXRCb3R0b21Eb2NrPygpXG5cbiAgICBzdWJzY3JpcHRpb25zID1cbiAgICAgIGZvciBsb2NhdGlvbiwgY29udGFpbmVyIG9mIHBhbmVDb250YWluZXJzXG4gICAgICAgIGNvbnRpbnVlIHVubGVzcyBjb250YWluZXJcbiAgICAgICAgY29udGFpbmVyLm9ic2VydmVQYW5lcyAocGFuZSkgPT5cbiAgICAgICAgICB0YWJCYXJWaWV3ID0gbmV3IFRhYkJhclZpZXcocGFuZSwgbG9jYXRpb24pXG4gICAgICAgICAgbXJ1TGlzdFZpZXcgPSBuZXcgTVJVTGlzdFZpZXdcbiAgICAgICAgICBtcnVMaXN0Vmlldy5pbml0aWFsaXplKHBhbmUpXG5cbiAgICAgICAgICBwYW5lRWxlbWVudCA9IGF0b20udmlld3MuZ2V0VmlldyhwYW5lKVxuICAgICAgICAgIHBhbmVFbGVtZW50Lmluc2VydEJlZm9yZSh0YWJCYXJWaWV3LmVsZW1lbnQsIHBhbmVFbGVtZW50LmZpcnN0Q2hpbGQpXG5cbiAgICAgICAgICBAdGFiQmFyVmlld3MucHVzaCh0YWJCYXJWaWV3KVxuICAgICAgICAgIHBhbmUub25EaWREZXN0cm95ID0+IF8ucmVtb3ZlKEB0YWJCYXJWaWV3cywgdGFiQmFyVmlldylcbiAgICAgICAgICBAbXJ1TGlzdFZpZXdzLnB1c2gobXJ1TGlzdFZpZXcpXG4gICAgICAgICAgcGFuZS5vbkRpZERlc3Ryb3kgPT4gXy5yZW1vdmUoQG1ydUxpc3RWaWV3cywgbXJ1TGlzdFZpZXcpXG5cbiAgICBAcGFuZVN1YnNjcmlwdGlvbiA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKHN1YnNjcmlwdGlvbnMuLi4pXG5cbiAgZGVhY3RpdmF0ZTogLT5cbiAgICBsYXlvdXQuZGVhY3RpdmF0ZSgpXG4gICAgQHBhbmVTdWJzY3JpcHRpb24uZGlzcG9zZSgpXG4gICAgQGZpbGVJY29uc0Rpc3Bvc2FibGU/LmRpc3Bvc2UoKVxuICAgIHRhYkJhclZpZXcuZGVzdHJveSgpIGZvciB0YWJCYXJWaWV3IGluIEB0YWJCYXJWaWV3c1xuICAgIG1ydUxpc3RWaWV3LmRlc3Ryb3koKSBmb3IgbXJ1TGlzdFZpZXcgaW4gQG1ydUxpc3RWaWV3c1xuICAgIHJldHVyblxuXG4gIGNvbnN1bWVGaWxlSWNvbnM6IChzZXJ2aWNlKSAtPlxuICAgIEZpbGVJY29ucy5zZXRTZXJ2aWNlKHNlcnZpY2UpXG4gICAgQHVwZGF0ZUZpbGVJY29ucygpXG4gICAgbmV3IERpc3Bvc2FibGUgPT5cbiAgICAgIEZpbGVJY29ucy5yZXNldFNlcnZpY2UoKVxuICAgICAgQHVwZGF0ZUZpbGVJY29ucygpXG5cbiAgdXBkYXRlRmlsZUljb25zOiAtPlxuICAgIGZvciB0YWJCYXJWaWV3IGluIEB0YWJCYXJWaWV3c1xuICAgICAgdGFiVmlldy51cGRhdGVJY29uKCkgZm9yIHRhYlZpZXcgaW4gdGFiQmFyVmlldy5nZXRUYWJzKClcbiJdfQ==
