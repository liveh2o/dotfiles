(function() {
  var Disposable, FileIcons, layout;

  Disposable = require('atom').Disposable;

  FileIcons = require('./file-icons');

  layout = require('./layout');

  module.exports = {
    activate: function(state) {
      var MRUListView, TabBarView, _, base, configKey, keyBindSource;
      layout.activate();
      this.tabBarViews = [];
      this.mruListViews = [];
      TabBarView = require('./tab-bar-view');
      MRUListView = require('./mru-list-view');
      _ = require('underscore-plus');
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RhYnMvbGliL21haW4uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQyxhQUFjLE9BQUEsQ0FBUSxNQUFSOztFQUNmLFNBQUEsR0FBWSxPQUFBLENBQVEsY0FBUjs7RUFDWixNQUFBLEdBQVMsT0FBQSxDQUFRLFVBQVI7O0VBRVQsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLFFBQUEsRUFBVSxTQUFDLEtBQUQ7QUFDUixVQUFBO01BQUEsTUFBTSxDQUFDLFFBQVAsQ0FBQTtNQUNBLElBQUMsQ0FBQSxXQUFELEdBQWU7TUFDZixJQUFDLENBQUEsWUFBRCxHQUFnQjtNQUVoQixVQUFBLEdBQWEsT0FBQSxDQUFRLGdCQUFSO01BQ2IsV0FBQSxHQUFjLE9BQUEsQ0FBUSxpQkFBUjtNQUNkLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVI7TUFFSixhQUFBLEdBQWdCO01BQ2hCLFNBQUEsR0FBWTtNQUVaLElBQUMsQ0FBQSx1QkFBRCxHQUEyQixTQUFBO0FBRXpCLFlBQUE7UUFBQSxRQUFBLEdBQVcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxlQUFiLENBQ1Q7VUFBQSxNQUFBLEVBQVEsUUFBUSxDQUFDLElBQWpCO1VBQ0EsVUFBQSxFQUFZLFVBRFo7U0FEUztRQUdYLElBQVUsUUFBUSxDQUFDLE1BQVQsR0FBa0IsQ0FBbEIsSUFBd0IsUUFBUyxDQUFBLENBQUEsQ0FBRSxDQUFDLE1BQVosS0FBd0IsYUFBMUQ7QUFBQSxpQkFBQTs7UUFDQSxRQUFBLEdBQVcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxlQUFiLENBQ1Q7VUFBQSxNQUFBLEVBQVEsUUFBUSxDQUFDLElBQWpCO1VBQ0EsVUFBQSxFQUFZLGdCQURaO1NBRFM7UUFHWCxJQUFVLFFBQVEsQ0FBQyxNQUFULEdBQWtCLENBQWxCLElBQXdCLFFBQVMsQ0FBQSxDQUFBLENBQUUsQ0FBQyxN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Q0FBQTtpQkFDQSxLQUFDLENBQUEsZUFBRCxDQUFBO1FBRmE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVg7SUFIWSxDQW5FbEI7SUEwRUEsZUFBQSxFQUFpQixTQUFBO0FBQ2YsVUFBQTtBQUFBO0FBQUE7V0FBQSxxQ0FBQTs7OztBQUNFO0FBQUE7ZUFBQSx3Q0FBQTs7MEJBQUEsT0FBTyxDQUFDLFVBQVIsQ0FBQTtBQUFBOzs7QUFERjs7SUFEZSxDQTFFakI7O0FBTEYiLCJzb3VyY2VzQ29udGVudCI6WyJ7RGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xuRmlsZUljb25zID0gcmVxdWlyZSAnLi9maWxlLWljb25zJ1xubGF5b3V0ID0gcmVxdWlyZSAnLi9sYXlvdXQnXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgYWN0aXZhdGU6IChzdGF0ZSkgLT5cbiAgICBsYXlvdXQuYWN0aXZhdGUoKVxuICAgIEB0YWJCYXJWaWV3cyA9IFtdXG4gICAgQG1ydUxpc3RWaWV3cyA9IFtdXG5cbiAgICBUYWJCYXJWaWV3ID0gcmVxdWlyZSAnLi90YWItYmFyLXZpZXcnXG4gICAgTVJVTGlzdFZpZXcgPSByZXF1aXJlICcuL21ydS1saXN0LXZpZXcnXG4gICAgXyA9IHJlcXVpcmUgJ3VuZGVyc2NvcmUtcGx1cydcblxuICAgIGtleUJpbmRTb3VyY2UgPSAndGFicyBwYWNrYWdlJ1xuICAgIGNvbmZpZ0tleSA9ICd0YWJzLmVuYWJsZU1ydVRhYlN3aXRjaGluZydcblxuICAgIEB1cGRhdGVUcmF2ZXJzYWxLZXliaW5kcyA9IC0+XG4gICAgICAjIFdlIGRvbid0IG1vZGlmeSBrZXliaW5kaW5ncyBiYXNlZCBvbiBvdXIgc2V0dGluZyBpZiB0aGUgdXNlciBoYXMgYWxyZWFkeSB0d2Vha2VkIHRoZW0uXG4gICAgICBiaW5kaW5ncyA9IGF0b20ua2V5bWFwcy5maW5kS2V5QmluZGluZ3MoXG4gICAgICAgIHRhcmdldDogZG9jdW1lbnQuYm9keSxcbiAgICAgICAga2V5c3Ryb2tlczogJ2N0cmwtdGFiJylcbiAgICAgIHJldHVybiBpZiBiaW5kaW5ncy5sZW5ndGggPiAxIGFuZCBiaW5kaW5nc1swXS5zb3VyY2UgaXNudCBrZXlCaW5kU291cmNlXG4gICAgICBiaW5kaW5ncyA9IGF0b20ua2V5bWFwcy5maW5kS2V5QmluZGluZ3MoXG4gICAgICAgIHRhcmdldDogZG9jdW1lbnQuYm9keSxcbiAgICAgICAga2V5c3Ryb2tlczogJ2N0cmwtc2hpZnQtdGFiJylcbiAgICAgIHJldHVybiBpZiBiaW5kaW5ncy5sZW5ndGggPiAxIGFuZCBiaW5kaW5nc1swXS5zb3VyY2UgaXNudCBrZXlCaW5kU291cmNlXG5cbiAgICAgIGlmIGF0b20uY29uZmlnLmdldChjb25maWdLZXkpXG4gICAgICAgIGF0b20ua2V5bWFwcy5yZW1vdmVCaW5kaW5nc0Zyb21Tb3VyY2Uoa2V5QmluZFNvdXJjZSlcbiAgICAgIGVsc2VcbiAgICAgICAgZGlzYWJsZWRCaW5kaW5ncyA9XG4gICAgICAgICAgJ2JvZHknOlxuICAgICAgICAgICAgJ2N0cmwtdGFiJzogJ3BhbmU6c2hvdy1uZXh0LWl0ZW0nXG4gICAgICAgICAgICAnY3RybC10YWIgXmN0cmwnOiAndW5zZXQhJ1xuICAgICAgICAgICAgJ2N0cmwtc2hpZnQtdGFiJzogJ3BhbmU6c2hvdy1wcmV2aW91cy1pdGVtJ1xuICAgICAgICAgICAgJ2N0cmwtc2hpZnQtdGFiIF5jdHJsJzogJ3Vuc2V0ISdcbiAgICAgICAgYXRvbS5rZXltYXBzLmFkZChrZXlCaW5kU291cmNlLCBkaXNhYmxlZEJpbmRpbmdzLCAwKVxuXG4gICAgYXRvbS5jb25maWcub2JzZXJ2ZSBjb25maWdLZXksID0+IEB1cGRhdGVUcmF2ZXJzYWxLZXliaW5kcygpXG4gICAgYXRvbS5rZXltYXBzLm9uRGlkTG9hZFVzZXJLZXltYXA/ID0+IEB1cGRhdGVUcmF2ZXJzYWxLZXliaW5kcygpXG5cbiAgICAjIElmIHRoZSBjb21tYW5kIGJ1YmJsZXMgdXAgd2l0aG91dCBiZWluZyBoYW5kbGVkIGJ5IGEgcGFydGljdWxhciBwYW5lLFxuICAgICMgY2xvc2UgYWxsIHRhYnMgaW4gYWxsIHBhbmVzXG4gICAgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJyxcbiAgICAgICd0YWJzOmNsb3NlLWFsbC10YWJzJzogPT5cbiAgICAgICAgIyBXZSBsb29wIGJhY2t3YXJkcyBiZWNhdXNlIHRoZSBwYW5lcyBhcmVcbiAgICAgICAgIyByZW1vdmVkIGZyb20gdGhlIGFycmF5IGFzIHdlIGdvXG4gICAgICAgIGZvciB0YWJCYXJWaWV3IGluIEB0YWJCYXJWaWV3cyBieSAtMVxuICAgICAgICAgIHRhYkJhclZpZXcuY2xvc2VBbGxUYWJzKClcblxuICAgIEBwYW5lU3Vic2NyaXB0aW9uID0gYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVBhbmVzIChwYW5lKSA9PlxuICAgICAgdGFiQmFyVmlldyA9IG5ldyBUYWJCYXJWaWV3KHBhbmUpXG4gICAgICBtcnVMaXN0VmlldyA9IG5ldyBNUlVMaXN0Vmlld1xuICAgICAgbXJ1TGlzdFZpZXcuaW5pdGlhbGl6ZShwYW5lKVxuXG4gICAgICBwYW5lRWxlbWVudCA9IGF0b20udmlld3MuZ2V0VmlldyhwYW5lKVxuICAgICAgcGFuZUVsZW1lbnQuaW5zZXJ0QmVmb3JlKHRhYkJhclZpZXcuZWxlbWVudCwgcGFuZUVsZW1lbnQuZmlyc3RDaGlsZClcblxuICAgICAgQHRhYkJhclZpZXdzLnB1c2godGFiQmFyVmlldylcbiAgICAgIHBhbmUub25EaWREZXN0cm95ID0+IF8ucmVtb3ZlKEB0YWJCYXJWaWV3cywgdGFiQmFyVmlldylcbiAgICAgIEBtcnVMaXN0Vmlld3MucHVzaChtcnVMaXN0VmlldylcbiAgICAgIHBhbmUub25EaWREZXN0cm95ID0+IF8ucmVtb3ZlKEBtcnVMaXN0Vmlld3MsIG1ydUxpc3RWaWV3KVxuXG4gIGRlYWN0aXZhdGU6IC0+XG4gICAgbGF5b3V0LmRlYWN0aXZhdGUoKVxuICAgIEBwYW5lU3Vic2NyaXB0aW9uLmRpc3Bvc2UoKVxuICAgIEBmaWxlSWNvbnNEaXNwb3NhYmxlPy5kaXNwb3NlKClcbiAgICB0YWJCYXJWaWV3LmRlc3Ryb3koKSBmb3IgdGFiQmFyVmlldyBpbiBAdGFiQmFyVmlld3NcbiAgICBtcnVMaXN0Vmlldy5kZXN0cm95KCkgZm9yIG1ydUxpc3RWaWV3IGluIEBtcnVMaXN0Vmlld3NcbiAgICByZXR1cm5cblxuICBjb25zdW1lRmlsZUljb25zOiAoc2VydmljZSkgLT5cbiAgICBGaWxlSWNvbnMuc2V0U2VydmljZShzZXJ2aWNlKVxuICAgIEB1cGRhdGVGaWxlSWNvbnMoKVxuICAgIG5ldyBEaXNwb3NhYmxlID0+XG4gICAgICBGaWxlSWNvbnMucmVzZXRTZXJ2aWNlKClcbiAgICAgIEB1cGRhdGVGaWxlSWNvbnMoKVxuXG4gIHVwZGF0ZUZpbGVJY29uczogLT5cbiAgICBmb3IgdGFiQmFyVmlldyBpbiBAdGFiQmFyVmlld3NcbiAgICAgIHRhYlZpZXcudXBkYXRlSWNvbigpIGZvciB0YWJWaWV3IGluIHRhYkJhclZpZXcuZ2V0VGFicygpXG4iXX0=
