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
      var base, base1, base2, base3, base4, configKey, keyBindSource, paneContainers, ref1;
      this.subscriptions = new CompositeDisposable();
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
      this.subscriptions.add(atom.config.observe(configKey, (function(_this) {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RhYnMvbGliL21haW4uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxNQUFvQyxPQUFBLENBQVEsTUFBUixDQUFwQyxFQUFDLDZDQUFELEVBQXNCOztFQUN0QixTQUFBLEdBQVksT0FBQSxDQUFRLGNBQVI7O0VBQ1osTUFBQSxHQUFTLE9BQUEsQ0FBUSxVQUFSOztFQUNULFVBQUEsR0FBYSxPQUFBLENBQVEsZ0JBQVI7O0VBQ2IsV0FBQSxHQUFjLE9BQUEsQ0FBUSxpQkFBUjs7RUFDZCxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSOztFQUVKLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxRQUFBLEVBQVUsU0FBQyxLQUFEO0FBQ1IsVUFBQTtNQUFBLElBQUMsQ0FBQSxhQUFELEdBQXFCLElBQUEsbUJBQUEsQ0FBQTtNQUNyQixNQUFNLENBQUMsUUFBUCxDQUFBO01BQ0EsSUFBQyxDQUFBLFdBQUQsR0FBZTtNQUNmLElBQUMsQ0FBQSxZQUFELEdBQWdCO01BRWhCLGFBQUEsR0FBZ0I7TUFDaEIsU0FBQSxHQUFZO01BRVosSUFBQyxDQUFBLHVCQUFELEdBQTJCLFNBQUE7QUFFekIsWUFBQTtRQUFBLFFBQUEsR0FBVyxJQUFJLENBQUMsT0FBTyxDQUFDLGVBQWIsQ0FDVDtVQUFBLE1BQUEsRUFBUSxRQUFRLENBQUMsSUFBakI7VUFDQSxVQUFBLEVBQVksVUFEWjtTQURTO1FBR1gsSUFBVSxRQUFRLENBQUMsTUFBVCxHQUFrQixDQUFsQixJQUF3QixRQUFTLENBQUEsQ0FBQSxDQUFFLENBQUMsTUFBWixLQUF3QixhQUExRDtBQUFBLGlCQUFBOztRQUNBLFFBQUEsR0FBVyxJQUFJLENBQUMsT0FBTyxDQUFDLGVBQWIsQ0FDVDtVQUFBLE1BQUEsRUFBUSxRQUFRLENBQUMsSUFBakI7VUFDQSxVQUFBLEVBQVksZ0JBRFo7U0FE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LFdBQXhCO1lBQUgsQ0FBbEI7VUFYd0MsQ0FBdkIsQ0FBbkI7UUFIa0M7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXBDO0lBakRRLENBQVY7SUFpRUEsVUFBQSxFQUFZLFNBQUE7QUFDVixVQUFBO01BQUEsTUFBTSxDQUFDLFVBQVAsQ0FBQTtNQUNBLElBQUMsQ0FBQSxhQUFhLENBQUMsT0FBZixDQUFBOztZQUNvQixDQUFFLE9BQXRCLENBQUE7O0FBQ0E7QUFBQSxXQUFBLHNDQUFBOztRQUFBLFVBQVUsQ0FBQyxPQUFYLENBQUE7QUFBQTtBQUNBO0FBQUEsV0FBQSx3Q0FBQTs7UUFBQSxXQUFXLENBQUMsT0FBWixDQUFBO0FBQUE7SUFMVSxDQWpFWjtJQXlFQSxnQkFBQSxFQUFrQixTQUFDLE9BQUQ7TUFDaEIsU0FBUyxDQUFDLFVBQVYsQ0FBcUIsT0FBckI7TUFDQSxJQUFDLENBQUEsZUFBRCxDQUFBO2FBQ0ksSUFBQSxVQUFBLENBQVcsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO1VBQ2IsU0FBUyxDQUFDLFlBQVYsQ0FBQTtpQkFDQSxLQUFDLENBQUEsZUFBRCxDQUFBO1FBRmE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVg7SUFIWSxDQXpFbEI7SUFnRkEsZUFBQSxFQUFpQixTQUFBO0FBQ2YsVUFBQTtBQUFBO0FBQUE7V0FBQSxzQ0FBQTs7OztBQUNFO0FBQUE7ZUFBQSx3Q0FBQTs7MEJBQUEsT0FBTyxDQUFDLFVBQVIsQ0FBQTtBQUFBOzs7QUFERjs7SUFEZSxDQWhGakI7O0FBUkYiLCJzb3VyY2VzQ29udGVudCI6WyJ7Q29tcG9zaXRlRGlzcG9zYWJsZSwgRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xuRmlsZUljb25zID0gcmVxdWlyZSAnLi9maWxlLWljb25zJ1xubGF5b3V0ID0gcmVxdWlyZSAnLi9sYXlvdXQnXG5UYWJCYXJWaWV3ID0gcmVxdWlyZSAnLi90YWItYmFyLXZpZXcnXG5NUlVMaXN0VmlldyA9IHJlcXVpcmUgJy4vbXJ1LWxpc3Qtdmlldydcbl8gPSByZXF1aXJlICd1bmRlcnNjb3JlLXBsdXMnXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgYWN0aXZhdGU6IChzdGF0ZSkgLT5cbiAgICBAc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICBsYXlvdXQuYWN0aXZhdGUoKVxuICAgIEB0YWJCYXJWaWV3cyA9IFtdXG4gICAgQG1ydUxpc3RWaWV3cyA9IFtdXG5cbiAgICBrZXlCaW5kU291cmNlID0gJ3RhYnMgcGFja2FnZSdcbiAgICBjb25maWdLZXkgPSAndGFicy5lbmFibGVNcnVUYWJTd2l0Y2hpbmcnXG5cbiAgICBAdXBkYXRlVHJhdmVyc2FsS2V5YmluZHMgPSAtPlxuICAgICAgIyBXZSBkb24ndCBtb2RpZnkga2V5YmluZGluZ3MgYmFzZWQgb24gb3VyIHNldHRpbmcgaWYgdGhlIHVzZXIgaGFzIGFscmVhZHkgdHdlYWtlZCB0aGVtLlxuICAgICAgYmluZGluZ3MgPSBhdG9tLmtleW1hcHMuZmluZEtleUJpbmRpbmdzKFxuICAgICAgICB0YXJnZXQ6IGRvY3VtZW50LmJvZHksXG4gICAgICAgIGtleXN0cm9rZXM6ICdjdHJsLXRhYicpXG4gICAgICByZXR1cm4gaWYgYmluZGluZ3MubGVuZ3RoID4gMSBhbmQgYmluZGluZ3NbMF0uc291cmNlIGlzbnQga2V5QmluZFNvdXJjZVxuICAgICAgYmluZGluZ3MgPSBhdG9tLmtleW1hcHMuZmluZEtleUJpbmRpbmdzKFxuICAgICAgICB0YXJnZXQ6IGRvY3VtZW50LmJvZHksXG4gICAgICAgIGtleXN0cm9rZXM6ICdjdHJsLXNoaWZ0LXRhYicpXG4gICAgICByZXR1cm4gaWYgYmluZGluZ3MubGVuZ3RoID4gMSBhbmQgYmluZGluZ3NbMF0uc291cmNlIGlzbnQga2V5QmluZFNvdXJjZVxuXG4gICAgICBpZiBhdG9tLmNvbmZpZy5nZXQoY29uZmlnS2V5KVxuICAgICAgICBhdG9tLmtleW1hcHMucmVtb3ZlQmluZGluZ3NGcm9tU291cmNlKGtleUJpbmRTb3VyY2UpXG4gICAgICBlbHNlXG4gICAgICAgIGRpc2FibGVkQmluZGluZ3MgPVxuICAgICAgICAgICdib2R5JzpcbiAgICAgICAgICAgICdjdHJsLXRhYic6ICdwYW5lOnNob3ctbmV4dC1pdGVtJ1xuICAgICAgICAgICAgJ2N0cmwtdGFiIF5jdHJsJzogJ3Vuc2V0ISdcbiAgICAgICAgICAgICdjdHJsLXNoaWZ0LXRhYic6ICdwYW5lOnNob3ctcHJldmlvdXMtaXRlbSdcbiAgICAgICAgICAgICdjdHJsLXNoaWZ0LXRhYiBeY3RybCc6ICd1bnNldCEnXG4gICAgICAgIGF0b20ua2V5bWFwcy5hZGQoa2V5QmluZFNvdXJjZSwgZGlzYWJsZWRCaW5kaW5ncywgMClcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbmZpZy5vYnNlcnZlIGNvbmZpZ0tleSwgPT4gQHVwZGF0ZVRyYXZlcnNhbEtleWJpbmRzKClcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5rZXltYXBzLm9uRGlkTG9hZFVzZXJLZXltYXA/ID0+IEB1cGRhdGVUcmF2ZXJzYWxLZXliaW5kcygpXG5cbiAgICAjIElmIHRoZSBjb21tYW5kIGJ1YmJsZXMgdXAgd2l0aG91dCBiZWluZyBoYW5kbGVkIGJ5IGEgcGFydGljdWxhciBwYW5lLFxuICAgICMgY2xvc2UgYWxsIHRhYnMgaW4gYWxsIHBhbmVzXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsXG4gICAgICAndGFiczpjbG9zZS1hbGwtdGFicyc6ID0+XG4gICAgICAgICMgV2UgbG9vcCBiYWNrd2FyZHMgYmVjYXVzZSB0aGUgcGFuZXMgYXJlXG4gICAgICAgICMgcmVtb3ZlZCBmcm9tIHRoZSBhcnJheSBhcyB3ZSBnb1xuICAgICAgICBmb3IgdGFiQmFyVmlldyBpbiBAdGFiQmFyVmlld3MgYnkgLTFcbiAgICAgICAgICB0YWJCYXJWaWV3LmNsb3NlQWxsVGFicygpXG5cbiAgICBwYW5lQ29udGFpbmVycyA9XG4gICAgICBjZW50ZXI6IGF0b20ud29ya3NwYWNlLmdldENlbnRlcj8oKSA/IGF0b20ud29ya3NwYWNlXG4gICAgICBsZWZ0OiBhdG9tLndvcmtzcGFjZS5nZXRMZWZ0RG9jaz8oKVxuICAgICAgcmlnaHQ6IGF0b20ud29ya3NwYWNlLmdldFJpZ2h0RG9jaz8oKVxuICAgICAgYm90dG9tOiBhdG9tLndvcmtzcGFjZS5nZXRCb3R0b21Eb2NrPygpXG5cbiAgICBPYmplY3Qua2V5cyhwYW5lQ29udGFpbmVycykuZm9yRWFjaCAobG9jYXRpb24pID0+XG4gICAgICBjb250YWluZXIgPSBwYW5lQ29udGFpbmVyc1tsb2NhdGlvbl1cbiAgICAgIHJldHVybiB1bmxlc3MgY29udGFpbmVyXG4gICAgICBAc3Vic2NyaXB0aW9ucy5hZGQgY29udGFpbmVyLm9ic2VydmVQYW5lcyAocGFuZSkgPT5cbiAgICAgICAgdGFiQmFyVmlldyA9IG5ldyBUYWJCYXJWaWV3KHBhbmUsIGxvY2F0aW9uKVxuICAgICAgICBtcnVMaXN0VmlldyA9IG5ldyBNUlVMaXN0Vmlld1xuICAgICAgICBtcnVMaXN0Vmlldy5pbml0aWFsaXplKHBhbmUpXG5cbiAgICAgICAgcGFuZUVsZW1lbnQgPSBwYW5lLmdldEVsZW1lbnQoKVxuICAgICAgICBwYW5lRWxlbWVudC5pbnNlcnRCZWZvcmUodGFiQmFyVmlldy5lbGVtZW50LCBwYW5lRWxlbWVudC5maXJzdENoaWxkKVxuXG4gICAgICAgIEB0YWJCYXJWaWV3cy5wdXNoKHRhYkJhclZpZXcpXG4gICAgICAgIHBhbmUub25EaWREZXN0cm95ID0+IF8ucmVtb3ZlKEB0YWJCYXJWaWV3cywgdGFiQmFyVmlldylcbiAgICAgICAgQG1ydUxpc3RWaWV3cy5wdXNoKG1ydUxpc3RWaWV3KVxuICAgICAgICBwYW5lLm9uRGlkRGVzdHJveSA9PiBfLnJlbW92ZShAbXJ1TGlzdFZpZXdzLCBtcnVMaXN0VmlldylcblxuICBkZWFjdGl2YXRlOiAtPlxuICAgIGxheW91dC5kZWFjdGl2YXRlKClcbiAgICBAc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICBAZmlsZUljb25zRGlzcG9zYWJsZT8uZGlzcG9zZSgpXG4gICAgdGFiQmFyVmlldy5kZXN0cm95KCkgZm9yIHRhYkJhclZpZXcgaW4gQHRhYkJhclZpZXdzXG4gICAgbXJ1TGlzdFZpZXcuZGVzdHJveSgpIGZvciBtcnVMaXN0VmlldyBpbiBAbXJ1TGlzdFZpZXdzXG4gICAgcmV0dXJuXG5cbiAgY29uc3VtZUZpbGVJY29uczogKHNlcnZpY2UpIC0+XG4gICAgRmlsZUljb25zLnNldFNlcnZpY2Uoc2VydmljZSlcbiAgICBAdXBkYXRlRmlsZUljb25zKClcbiAgICBuZXcgRGlzcG9zYWJsZSA9PlxuICAgICAgRmlsZUljb25zLnJlc2V0U2VydmljZSgpXG4gICAgICBAdXBkYXRlRmlsZUljb25zKClcblxuICB1cGRhdGVGaWxlSWNvbnM6IC0+XG4gICAgZm9yIHRhYkJhclZpZXcgaW4gQHRhYkJhclZpZXdzXG4gICAgICB0YWJWaWV3LnVwZGF0ZUljb24oKSBmb3IgdGFiVmlldyBpbiB0YWJCYXJWaWV3LmdldFRhYnMoKVxuIl19
