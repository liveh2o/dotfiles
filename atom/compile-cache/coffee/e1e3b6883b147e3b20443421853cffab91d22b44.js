(function() {
  var CompositeDisposable, Disposable, MRUListView, TabBarView, _, getIconServices, layout, ref;

  ref = require('atom'), CompositeDisposable = ref.CompositeDisposable, Disposable = ref.Disposable;

  getIconServices = require('./get-icon-services');

  layout = require('./layout');

  TabBarView = require('./tab-bar-view');

  MRUListView = require('./mru-list-view');

  _ = require('underscore-plus');

  module.exports = {
    activate: function(state) {
      var base, base1, base2, base3, base4, enableMruConfigKey, keyBindSource, paneContainers, ref1;
      this.subscriptions = new CompositeDisposable();
      layout.activate();
      this.tabBarViews = [];
      this.mruListViews = [];
      keyBindSource = 'tabs package';
      enableMruConfigKey = 'tabs.enableMruTabSwitching';
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
        if (atom.config.get(enableMruConfigKey)) {
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
      this.subscriptions.add(atom.config.observe(enableMruConfigKey, (function(_this) {
        return function() {
          return _this.updateTraversalKeybinds();
        };
      })(this)));
      this.subscriptions.add(typeof (base = atom.keymaps).onDidLoadUserKeymap === "function" ? base.onDidLoadUserKeymap((function(_this) {
        return function() {
          return _this.updateTraversalKeybinds();
        };
      })(this)) : void 0);
      this.subscriptions.add(atom.commands.add('atom-workspace', {
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
      }));
      paneContainers = {
        center: (ref1 = typeof (base1 = atom.workspace).getCenter === "function" ? base1.getCenter() : void 0) != null ? ref1 : atom.workspace,
        left: typeof (base2 = atom.workspace).getLeftDock === "function" ? base2.getLeftDock() : void 0,
        right: typeof (base3 = atom.workspace).getRightDock === "function" ? base3.getRightDock() : void 0,
        bottom: typeof (base4 = atom.workspace).getBottomDock === "function" ? base4.getBottomDock() : void 0
      };
      return Object.keys(paneContainers).forEach((function(_this) {
        return function(location) {
          var container;
          container = paneContainers[location];
          if (!container) {
            return;
          }
          return _this.subscriptions.add(container.observePanes(function(pane) {
            var mruListView, paneElement, tabBarView;
            tabBarView = new TabBarView(pane, location);
            mruListView = new MRUListView;
            mruListView.initialize(pane);
            paneElement = pane.getElement();
            paneElement.insertBefore(tabBarView.element, paneElement.firstChild);
            _this.tabBarViews.push(tabBarView);
            pane.onDidDestroy(function() {
              return _.remove(_this.tabBarViews, tabBarView);
            });
            _this.mruListViews.push(mruListView);
            return pane.onDidDestroy(function() {
              return _.remove(_this.mruListViews, mruListView);
            });
          }));
        };
      })(this));
    },
    deactivate: function() {
      var i, j, len, len1, mruListView, ref1, ref2, ref3, tabBarView;
      layout.deactivate();
      this.subscriptions.dispose();
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
    consumeElementIcons: function(service) {
      getIconServices().setElementIcons(service);
      this.updateFileIcons();
      return new Disposable((function(_this) {
        return function() {
          getIconServices().resetElementIcons();
          return _this.updateFileIcons();
        };
      })(this));
    },
    consumeFileIcons: function(service) {
      getIconServices().setFileIcons(service);
      this.updateFileIcons();
      return new Disposable((function(_this) {
        return function() {
          getIconServices().resetFileIcons();
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3Rlc3QvLmRvdGZpbGVzL2F0b20vcGFja2FnZXMvdGFicy9saWIvbWFpbi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLE1BQW9DLE9BQUEsQ0FBUSxNQUFSLENBQXBDLEVBQUMsNkNBQUQsRUFBc0I7O0VBQ3RCLGVBQUEsR0FBa0IsT0FBQSxDQUFRLHFCQUFSOztFQUNsQixNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVI7O0VBQ1QsVUFBQSxHQUFhLE9BQUEsQ0FBUSxnQkFBUjs7RUFDYixXQUFBLEdBQWMsT0FBQSxDQUFRLGlCQUFSOztFQUNkLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVI7O0VBRUosTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLFFBQUEsRUFBVSxTQUFDLEtBQUQ7QUFDUixVQUFBO01BQUEsSUFBQyxDQUFBLGFBQUQsR0FBcUIsSUFBQSxtQkFBQSxDQUFBO01BQ3JCLE1BQU0sQ0FBQyxRQUFQLENBQUE7TUFDQSxJQUFDLENBQUEsV0FBRCxHQUFlO01BQ2YsSUFBQyxDQUFBLFlBQUQsR0FBZ0I7TUFFaEIsYUFBQSxHQUFnQjtNQUNoQixrQkFBQSxHQUFxQjtNQUVyQixJQUFDLENBQUEsdUJBQUQsR0FBMkIsU0FBQTtBQUV6QixZQUFBO1FBQUEsUUFBQSxHQUFXLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBYixDQUNUO1VBQUEsTUFBQSxFQUFRLFFBQVEsQ0FBQyxJQUFqQjtVQUNBLFVBQUEsRUFBWSxVQURaO1NBRFM7UUFHWCxJQUFVLFFBQVEsQ0FBQyxNQUFULEdBQWtCLENBQWxCLElBQXdCLFFBQVMsQ0FBQSxDQUFBLENBQUUsQ0FBQyxNQUFaLEtBQXdCLGFBQTFEO0FBQUEsaUJBQUE7O1FBQ0EsUUFBQSxHQUFXLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBYixDQUNUO1VBQUEsTUFBQSxFQUFRLFFBQVEsQ0FBQyxJQUFqQjtVQUNBLFVB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O0FBQUE7ZUFBQSx3Q0FBQTs7MEJBQUEsT0FBTyxDQUFDLFVBQVIsQ0FBQTtBQUFBOzs7QUFERjs7SUFEZSxDQXZGakI7O0FBUkYiLCJzb3VyY2VzQ29udGVudCI6WyJ7Q29tcG9zaXRlRGlzcG9zYWJsZSwgRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xuZ2V0SWNvblNlcnZpY2VzID0gcmVxdWlyZSAnLi9nZXQtaWNvbi1zZXJ2aWNlcydcbmxheW91dCA9IHJlcXVpcmUgJy4vbGF5b3V0J1xuVGFiQmFyVmlldyA9IHJlcXVpcmUgJy4vdGFiLWJhci12aWV3J1xuTVJVTGlzdFZpZXcgPSByZXF1aXJlICcuL21ydS1saXN0LXZpZXcnXG5fID0gcmVxdWlyZSAndW5kZXJzY29yZS1wbHVzJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIGFjdGl2YXRlOiAoc3RhdGUpIC0+XG4gICAgQHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgbGF5b3V0LmFjdGl2YXRlKClcbiAgICBAdGFiQmFyVmlld3MgPSBbXVxuICAgIEBtcnVMaXN0Vmlld3MgPSBbXVxuXG4gICAga2V5QmluZFNvdXJjZSA9ICd0YWJzIHBhY2thZ2UnXG4gICAgZW5hYmxlTXJ1Q29uZmlnS2V5ID0gJ3RhYnMuZW5hYmxlTXJ1VGFiU3dpdGNoaW5nJ1xuXG4gICAgQHVwZGF0ZVRyYXZlcnNhbEtleWJpbmRzID0gLT5cbiAgICAgICMgV2UgZG9uJ3QgbW9kaWZ5IGtleWJpbmRpbmdzIGJhc2VkIG9uIG91ciBzZXR0aW5nIGlmIHRoZSB1c2VyIGhhcyBhbHJlYWR5IHR3ZWFrZWQgdGhlbS5cbiAgICAgIGJpbmRpbmdzID0gYXRvbS5rZXltYXBzLmZpbmRLZXlCaW5kaW5ncyhcbiAgICAgICAgdGFyZ2V0OiBkb2N1bWVudC5ib2R5LFxuICAgICAgICBrZXlzdHJva2VzOiAnY3RybC10YWInKVxuICAgICAgcmV0dXJuIGlmIGJpbmRpbmdzLmxlbmd0aCA+IDEgYW5kIGJpbmRpbmdzWzBdLnNvdXJjZSBpc250IGtleUJpbmRTb3VyY2VcbiAgICAgIGJpbmRpbmdzID0gYXRvbS5rZXltYXBzLmZpbmRLZXlCaW5kaW5ncyhcbiAgICAgICAgdGFyZ2V0OiBkb2N1bWVudC5ib2R5LFxuICAgICAgICBrZXlzdHJva2VzOiAnY3RybC1zaGlmdC10YWInKVxuICAgICAgcmV0dXJuIGlmIGJpbmRpbmdzLmxlbmd0aCA+IDEgYW5kIGJpbmRpbmdzWzBdLnNvdXJjZSBpc250IGtleUJpbmRTb3VyY2VcblxuICAgICAgaWYgYXRvbS5jb25maWcuZ2V0KGVuYWJsZU1ydUNvbmZpZ0tleSlcbiAgICAgICAgYXRvbS5rZXltYXBzLnJlbW92ZUJpbmRpbmdzRnJvbVNvdXJjZShrZXlCaW5kU291cmNlKVxuICAgICAgZWxzZVxuICAgICAgICBkaXNhYmxlZEJpbmRpbmdzID1cbiAgICAgICAgICAnYm9keSc6XG4gICAgICAgICAgICAnY3RybC10YWInOiAncGFuZTpzaG93LW5leHQtaXRlbSdcbiAgICAgICAgICAgICdjdHJsLXRhYiBeY3RybCc6ICd1bnNldCEnXG4gICAgICAgICAgICAnY3RybC1zaGlmdC10YWInOiAncGFuZTpzaG93LXByZXZpb3VzLWl0ZW0nXG4gICAgICAgICAgICAnY3RybC1zaGlmdC10YWIgXmN0cmwnOiAndW5zZXQhJ1xuICAgICAgICBhdG9tLmtleW1hcHMuYWRkKGtleUJpbmRTb3VyY2UsIGRpc2FibGVkQmluZGluZ3MsIDApXG5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb25maWcub2JzZXJ2ZSBlbmFibGVNcnVDb25maWdLZXksID0+IEB1cGRhdGVUcmF2ZXJzYWxLZXliaW5kcygpXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20ua2V5bWFwcy5vbkRpZExvYWRVc2VyS2V5bWFwPyA9PiBAdXBkYXRlVHJhdmVyc2FsS2V5YmluZHMoKVxuXG4gICAgIyBJZiB0aGUgY29tbWFuZCBidWJibGVzIHVwIHdpdGhvdXQgYmVpbmcgaGFuZGxlZCBieSBhIHBhcnRpY3VsYXIgcGFuZSxcbiAgICAjIGNsb3NlIGFsbCB0YWJzIGluIGFsbCBwYW5lc1xuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLFxuICAgICAgJ3RhYnM6Y2xvc2UtYWxsLXRhYnMnOiA9PlxuICAgICAgICAjIFdlIGxvb3AgYmFja3dhcmRzIGJlY2F1c2UgdGhlIHBhbmVzIGFyZVxuICAgICAgICAjIHJlbW92ZWQgZnJvbSB0aGUgYXJyYXkgYXMgd2UgZ29cbiAgICAgICAgZm9yIHRhYkJhclZpZXcgaW4gQHRhYkJhclZpZXdzIGJ5IC0xXG4gICAgICAgICAgdGFiQmFyVmlldy5jbG9zZUFsbFRhYnMoKVxuXG4gICAgcGFuZUNvbnRhaW5lcnMgPVxuICAgICAgY2VudGVyOiBhdG9tLndvcmtzcGFjZS5nZXRDZW50ZXI/KCkgPyBhdG9tLndvcmtzcGFjZVxuICAgICAgbGVmdDogYXRvbS53b3Jrc3BhY2UuZ2V0TGVmdERvY2s/KClcbiAgICAgIHJpZ2h0OiBhdG9tLndvcmtzcGFjZS5nZXRSaWdodERvY2s/KClcbiAgICAgIGJvdHRvbTogYXRvbS53b3Jrc3BhY2UuZ2V0Qm90dG9tRG9jaz8oKVxuXG4gICAgT2JqZWN0LmtleXMocGFuZUNvbnRhaW5lcnMpLmZvckVhY2ggKGxvY2F0aW9uKSA9PlxuICAgICAgY29udGFpbmVyID0gcGFuZUNvbnRhaW5lcnNbbG9jYXRpb25dXG4gICAgICByZXR1cm4gdW5sZXNzIGNvbnRhaW5lclxuICAgICAgQHN1YnNjcmlwdGlvbnMuYWRkIGNvbnRhaW5lci5vYnNlcnZlUGFuZXMgKHBhbmUpID0+XG4gICAgICAgIHRhYkJhclZpZXcgPSBuZXcgVGFiQmFyVmlldyhwYW5lLCBsb2NhdGlvbilcbiAgICAgICAgbXJ1TGlzdFZpZXcgPSBuZXcgTVJVTGlzdFZpZXdcbiAgICAgICAgbXJ1TGlzdFZpZXcuaW5pdGlhbGl6ZShwYW5lKVxuXG4gICAgICAgIHBhbmVFbGVtZW50ID0gcGFuZS5nZXRFbGVtZW50KClcbiAgICAgICAgcGFuZUVsZW1lbnQuaW5zZXJ0QmVmb3JlKHRhYkJhclZpZXcuZWxlbWVudCwgcGFuZUVsZW1lbnQuZmlyc3RDaGlsZClcblxuICAgICAgICBAdGFiQmFyVmlld3MucHVzaCh0YWJCYXJWaWV3KVxuICAgICAgICBwYW5lLm9uRGlkRGVzdHJveSA9PiBfLnJlbW92ZShAdGFiQmFyVmlld3MsIHRhYkJhclZpZXcpXG4gICAgICAgIEBtcnVMaXN0Vmlld3MucHVzaChtcnVMaXN0VmlldylcbiAgICAgICAgcGFuZS5vbkRpZERlc3Ryb3kgPT4gXy5yZW1vdmUoQG1ydUxpc3RWaWV3cywgbXJ1TGlzdFZpZXcpXG5cbiAgZGVhY3RpdmF0ZTogLT5cbiAgICBsYXlvdXQuZGVhY3RpdmF0ZSgpXG4gICAgQHN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgQGZpbGVJY29uc0Rpc3Bvc2FibGU/LmRpc3Bvc2UoKVxuICAgIHRhYkJhclZpZXcuZGVzdHJveSgpIGZvciB0YWJCYXJWaWV3IGluIEB0YWJCYXJWaWV3c1xuICAgIG1ydUxpc3RWaWV3LmRlc3Ryb3koKSBmb3IgbXJ1TGlzdFZpZXcgaW4gQG1ydUxpc3RWaWV3c1xuICAgIHJldHVyblxuXG4gIGNvbnN1bWVFbGVtZW50SWNvbnM6IChzZXJ2aWNlKSAtPlxuICAgIGdldEljb25TZXJ2aWNlcygpLnNldEVsZW1lbnRJY29ucyBzZXJ2aWNlXG4gICAgQHVwZGF0ZUZpbGVJY29ucygpXG4gICAgbmV3IERpc3Bvc2FibGUgPT5cbiAgICAgIGdldEljb25TZXJ2aWNlcygpLnJlc2V0RWxlbWVudEljb25zKClcbiAgICAgIEB1cGRhdGVGaWxlSWNvbnMoKVxuXG4gIGNvbnN1bWVGaWxlSWNvbnM6IChzZXJ2aWNlKSAtPlxuICAgIGdldEljb25TZXJ2aWNlcygpLnNldEZpbGVJY29ucyBzZXJ2aWNlXG4gICAgQHVwZGF0ZUZpbGVJY29ucygpXG4gICAgbmV3IERpc3Bvc2FibGUgPT5cbiAgICAgIGdldEljb25TZXJ2aWNlcygpLnJlc2V0RmlsZUljb25zKClcbiAgICAgIEB1cGRhdGVGaWxlSWNvbnMoKVxuXG4gIHVwZGF0ZUZpbGVJY29uczogLT5cbiAgICBmb3IgdGFiQmFyVmlldyBpbiBAdGFiQmFyVmlld3NcbiAgICAgIHRhYlZpZXcudXBkYXRlSWNvbigpIGZvciB0YWJWaWV3IGluIHRhYkJhclZpZXcuZ2V0VGFicygpXG4iXX0=
