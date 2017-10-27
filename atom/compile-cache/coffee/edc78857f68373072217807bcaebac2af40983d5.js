(function() {
  var Disposable, FileIcons, MRUListView, TabBarView, _, layout;

  Disposable = require('atom').Disposable;

  FileIcons = require('./file-icons');

  layout = require('./layout');

  TabBarView = require('./tab-bar-view');

  MRUListView = require('./mru-list-view');

  _ = require('underscore-plus');

  module.exports = {
    activate: function(state) {
      var base, configKey, keyBindSource;
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
            var i, ref, results, tabBarView;
            ref = _this.tabBarViews;
            results = [];
            for (i = ref.length - 1; i >= 0; i += -1) {
              tabBarView = ref[i];
              results.push(tabBarView.closeAllTabs());
            }
            return results;
          };
        })(this)
      });
      return this.paneSubscription = atom.workspace.observePanes((function(_this) {
        return function(pane) {
          var mruListView, paneElement, tabBarView;
          tabBarView = new TabBarView(pane);
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
      })(this));
    },
    deactivate: function() {
      var i, j, len, len1, mruListView, ref, ref1, ref2, tabBarView;
      layout.deactivate();
      this.paneSubscription.dispose();
      if ((ref = this.fileIconsDisposable) != null) {
        ref.dispose();
      }
      ref1 = this.tabBarViews;
      for (i = 0, len = ref1.length; i < len; i++) {
        tabBarView = ref1[i];
        tabBarView.destroy();
      }
      ref2 = this.mruListViews;
      for (j = 0, len1 = ref2.length; j < len1; j++) {
        mruListView = ref2[j];
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
      var i, len, ref, results, tabBarView, tabView;
      ref = this.tabBarViews;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        tabBarView = ref[i];
        results.push((function() {
          var j, len1, ref1, results1;
          ref1 = tabBarView.getTabs();
          results1 = [];
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            tabView = ref1[j];
            results1.push(tabView.updateIcon());
          }
          return results1;
        })());
      }
      return results;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RhYnMvbGliL21haW4uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQyxhQUFjLE9BQUEsQ0FBUSxNQUFSOztFQUNmLFNBQUEsR0FBWSxPQUFBLENBQVEsY0FBUjs7RUFDWixNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVI7O0VBQ1QsVUFBQSxHQUFhLE9BQUEsQ0FBUSxnQkFBUjs7RUFDYixXQUFBLEdBQWMsT0FBQSxDQUFRLGlCQUFSOztFQUNkLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVI7O0VBRUosTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLFFBQUEsRUFBVSxTQUFDLEtBQUQ7QUFDUixVQUFBO01BQUEsTUFBTSxDQUFDLFFBQVAsQ0FBQTtNQUNBLElBQUMsQ0FBQSxXQUFELEdBQWU7TUFDZixJQUFDLENBQUEsWUFBRCxHQUFnQjtNQUVoQixhQUFBLEdBQWdCO01BQ2hCLFNBQUEsR0FBWTtNQUVaLElBQUMsQ0FBQSx1QkFBRCxHQUEyQixTQUFBO0FBRXpCLFlBQUE7UUFBQSxRQUFBLEdBQVcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxlQUFiLENBQ1Q7VUFBQSxNQUFBLEVBQVEsUUFBUSxDQUFDLElBQWpCO1VBQ0EsVUFBQSxFQUFZLFVBRFo7U0FEUztRQUdYLElBQVUsUUFBUSxDQUFDLE1BQVQsR0FBa0IsQ0FBbEIsSUFBd0IsUUFBUyxDQUFBLENBQUEsQ0FBRSxDQUFDLE1BQVosS0FBd0IsYUFBMUQ7QUFBQSxpQkFBQTs7UUFDQSxRQUFBLEdBQVcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxlQUFiLENBQ1Q7VUFBQSxNQUFBLEVBQVEsUUFBUSxDQUFDLElBQWpCO1VBQ0EsVUFBQSxFQUFZLGdCQURaO1NBRFM7UUFHWCxJQUFVLFFBQVEsQ0FBQyxNQUFULEdBQWtCLENBQWxCLElBQXdCLFFBQVMsQ0FBQSxDQUFBLENBQUUsQ0FB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QVYsQ0FBQTtpQkFDQSxLQUFDLENBQUEsZUFBRCxDQUFBO1FBRmE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVg7SUFIWSxDQS9EbEI7SUFzRUEsZUFBQSxFQUFpQixTQUFBO0FBQ2YsVUFBQTtBQUFBO0FBQUE7V0FBQSxxQ0FBQTs7OztBQUNFO0FBQUE7ZUFBQSx3Q0FBQTs7MEJBQUEsT0FBTyxDQUFDLFVBQVIsQ0FBQTtBQUFBOzs7QUFERjs7SUFEZSxDQXRFakI7O0FBUkYiLCJzb3VyY2VzQ29udGVudCI6WyJ7RGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xuRmlsZUljb25zID0gcmVxdWlyZSAnLi9maWxlLWljb25zJ1xubGF5b3V0ID0gcmVxdWlyZSAnLi9sYXlvdXQnXG5UYWJCYXJWaWV3ID0gcmVxdWlyZSAnLi90YWItYmFyLXZpZXcnXG5NUlVMaXN0VmlldyA9IHJlcXVpcmUgJy4vbXJ1LWxpc3Qtdmlldydcbl8gPSByZXF1aXJlICd1bmRlcnNjb3JlLXBsdXMnXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgYWN0aXZhdGU6IChzdGF0ZSkgLT5cbiAgICBsYXlvdXQuYWN0aXZhdGUoKVxuICAgIEB0YWJCYXJWaWV3cyA9IFtdXG4gICAgQG1ydUxpc3RWaWV3cyA9IFtdXG5cbiAgICBrZXlCaW5kU291cmNlID0gJ3RhYnMgcGFja2FnZSdcbiAgICBjb25maWdLZXkgPSAndGFicy5lbmFibGVNcnVUYWJTd2l0Y2hpbmcnXG5cbiAgICBAdXBkYXRlVHJhdmVyc2FsS2V5YmluZHMgPSAtPlxuICAgICAgIyBXZSBkb24ndCBtb2RpZnkga2V5YmluZGluZ3MgYmFzZWQgb24gb3VyIHNldHRpbmcgaWYgdGhlIHVzZXIgaGFzIGFscmVhZHkgdHdlYWtlZCB0aGVtLlxuICAgICAgYmluZGluZ3MgPSBhdG9tLmtleW1hcHMuZmluZEtleUJpbmRpbmdzKFxuICAgICAgICB0YXJnZXQ6IGRvY3VtZW50LmJvZHksXG4gICAgICAgIGtleXN0cm9rZXM6ICdjdHJsLXRhYicpXG4gICAgICByZXR1cm4gaWYgYmluZGluZ3MubGVuZ3RoID4gMSBhbmQgYmluZGluZ3NbMF0uc291cmNlIGlzbnQga2V5QmluZFNvdXJjZVxuICAgICAgYmluZGluZ3MgPSBhdG9tLmtleW1hcHMuZmluZEtleUJpbmRpbmdzKFxuICAgICAgICB0YXJnZXQ6IGRvY3VtZW50LmJvZHksXG4gICAgICAgIGtleXN0cm9rZXM6ICdjdHJsLXNoaWZ0LXRhYicpXG4gICAgICByZXR1cm4gaWYgYmluZGluZ3MubGVuZ3RoID4gMSBhbmQgYmluZGluZ3NbMF0uc291cmNlIGlzbnQga2V5QmluZFNvdXJjZVxuXG4gICAgICBpZiBhdG9tLmNvbmZpZy5nZXQoY29uZmlnS2V5KVxuICAgICAgICBhdG9tLmtleW1hcHMucmVtb3ZlQmluZGluZ3NGcm9tU291cmNlKGtleUJpbmRTb3VyY2UpXG4gICAgICBlbHNlXG4gICAgICAgIGRpc2FibGVkQmluZGluZ3MgPVxuICAgICAgICAgICdib2R5JzpcbiAgICAgICAgICAgICdjdHJsLXRhYic6ICdwYW5lOnNob3ctbmV4dC1pdGVtJ1xuICAgICAgICAgICAgJ2N0cmwtdGFiIF5jdHJsJzogJ3Vuc2V0ISdcbiAgICAgICAgICAgICdjdHJsLXNoaWZ0LXRhYic6ICdwYW5lOnNob3ctcHJldmlvdXMtaXRlbSdcbiAgICAgICAgICAgICdjdHJsLXNoaWZ0LXRhYiBeY3RybCc6ICd1bnNldCEnXG4gICAgICAgIGF0b20ua2V5bWFwcy5hZGQoa2V5QmluZFNvdXJjZSwgZGlzYWJsZWRCaW5kaW5ncywgMClcblxuICAgIGF0b20uY29uZmlnLm9ic2VydmUgY29uZmlnS2V5LCA9PiBAdXBkYXRlVHJhdmVyc2FsS2V5YmluZHMoKVxuICAgIGF0b20ua2V5bWFwcy5vbkRpZExvYWRVc2VyS2V5bWFwPyA9PiBAdXBkYXRlVHJhdmVyc2FsS2V5YmluZHMoKVxuXG4gICAgIyBJZiB0aGUgY29tbWFuZCBidWJibGVzIHVwIHdpdGhvdXQgYmVpbmcgaGFuZGxlZCBieSBhIHBhcnRpY3VsYXIgcGFuZSxcbiAgICAjIGNsb3NlIGFsbCB0YWJzIGluIGFsbCBwYW5lc1xuICAgIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsXG4gICAgICAndGFiczpjbG9zZS1hbGwtdGFicyc6ID0+XG4gICAgICAgICMgV2UgbG9vcCBiYWNrd2FyZHMgYmVjYXVzZSB0aGUgcGFuZXMgYXJlXG4gICAgICAgICMgcmVtb3ZlZCBmcm9tIHRoZSBhcnJheSBhcyB3ZSBnb1xuICAgICAgICBmb3IgdGFiQmFyVmlldyBpbiBAdGFiQmFyVmlld3MgYnkgLTFcbiAgICAgICAgICB0YWJCYXJWaWV3LmNsb3NlQWxsVGFicygpXG5cbiAgICBAcGFuZVN1YnNjcmlwdGlvbiA9IGF0b20ud29ya3NwYWNlLm9ic2VydmVQYW5lcyAocGFuZSkgPT5cbiAgICAgIHRhYkJhclZpZXcgPSBuZXcgVGFiQmFyVmlldyhwYW5lKVxuICAgICAgbXJ1TGlzdFZpZXcgPSBuZXcgTVJVTGlzdFZpZXdcbiAgICAgIG1ydUxpc3RWaWV3LmluaXRpYWxpemUocGFuZSlcblxuICAgICAgcGFuZUVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcocGFuZSlcbiAgICAgIHBhbmVFbGVtZW50Lmluc2VydEJlZm9yZSh0YWJCYXJWaWV3LmVsZW1lbnQsIHBhbmVFbGVtZW50LmZpcnN0Q2hpbGQpXG5cbiAgICAgIEB0YWJCYXJWaWV3cy5wdXNoKHRhYkJhclZpZXcpXG4gICAgICBwYW5lLm9uRGlkRGVzdHJveSA9PiBfLnJlbW92ZShAdGFiQmFyVmlld3MsIHRhYkJhclZpZXcpXG4gICAgICBAbXJ1TGlzdFZpZXdzLnB1c2gobXJ1TGlzdFZpZXcpXG4gICAgICBwYW5lLm9uRGlkRGVzdHJveSA9PiBfLnJlbW92ZShAbXJ1TGlzdFZpZXdzLCBtcnVMaXN0VmlldylcblxuICBkZWFjdGl2YXRlOiAtPlxuICAgIGxheW91dC5kZWFjdGl2YXRlKClcbiAgICBAcGFuZVN1YnNjcmlwdGlvbi5kaXNwb3NlKClcbiAgICBAZmlsZUljb25zRGlzcG9zYWJsZT8uZGlzcG9zZSgpXG4gICAgdGFiQmFyVmlldy5kZXN0cm95KCkgZm9yIHRhYkJhclZpZXcgaW4gQHRhYkJhclZpZXdzXG4gICAgbXJ1TGlzdFZpZXcuZGVzdHJveSgpIGZvciBtcnVMaXN0VmlldyBpbiBAbXJ1TGlzdFZpZXdzXG4gICAgcmV0dXJuXG5cbiAgY29uc3VtZUZpbGVJY29uczogKHNlcnZpY2UpIC0+XG4gICAgRmlsZUljb25zLnNldFNlcnZpY2Uoc2VydmljZSlcbiAgICBAdXBkYXRlRmlsZUljb25zKClcbiAgICBuZXcgRGlzcG9zYWJsZSA9PlxuICAgICAgRmlsZUljb25zLnJlc2V0U2VydmljZSgpXG4gICAgICBAdXBkYXRlRmlsZUljb25zKClcblxuICB1cGRhdGVGaWxlSWNvbnM6IC0+XG4gICAgZm9yIHRhYkJhclZpZXcgaW4gQHRhYkJhclZpZXdzXG4gICAgICB0YWJWaWV3LnVwZGF0ZUljb24oKSBmb3IgdGFiVmlldyBpbiB0YWJCYXJWaWV3LmdldFRhYnMoKVxuIl19
