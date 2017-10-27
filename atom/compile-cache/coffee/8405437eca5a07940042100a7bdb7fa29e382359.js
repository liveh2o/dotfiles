(function() {
  var CachePanelView, Disposable, PackagePanelView, ScrollView, TimecopView, WindowPanelView, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('underscore-plus');

  Disposable = require('atom').Disposable;

  ScrollView = require('atom-space-pen-views').ScrollView;

  CachePanelView = require('./cache-panel-view');

  PackagePanelView = require('./package-panel-view');

  WindowPanelView = require('./window-panel-view');

  module.exports = TimecopView = (function(_super) {
    __extends(TimecopView, _super);

    function TimecopView() {
      return TimecopView.__super__.constructor.apply(this, arguments);
    }

    TimecopView.content = function() {
      return this.div({
        "class": 'timecop pane-item native-key-bindings',
        tabindex: -1
      }, (function(_this) {
        return function() {
          return _this.div({
            "class": 'timecop-panel'
          }, function() {
            _this.div({
              "class": 'panels'
            }, function() {
              _this.subview('windowLoadingPanel', new WindowPanelView());
              return _this.subview('cacheLoadingPanel', new CachePanelView());
            });
            return _this.div({
              "class": 'panels'
            }, function() {
              _this.subview('packageLoadingPanel', new PackagePanelView('Package Loading'));
              _this.subview('packageActivationPanel', new PackagePanelView('Package Activation'));
              _this.subview('themeLoadingPanel', new PackagePanelView('Theme Loading'));
              return _this.subview('themeActivationPanel', new PackagePanelView('Theme Activation'));
            });
          });
        };
      })(this));
    };

    TimecopView.prototype.onDidChangeTitle = function() {
      return new Disposable(function() {});
    };

    TimecopView.prototype.onDidChangeModified = function() {
      return new Disposable(function() {});
    };

    TimecopView.prototype.initialize = function(_arg) {
      this.uri = _arg.uri;
      if (atom.packages.getActivePackages().length > 0) {
        return this.populateViews();
      } else {
        return setImmediate((function(_this) {
          return function() {
            return _this.populateViews();
          };
        })(this));
      }
    };

    TimecopView.prototype.populateViews = function() {
      this.windowLoadingPanel.populate();
      this.cacheLoadingPanel.populate();
      this.showLoadedPackages();
      this.showActivePackages();
      this.showLoadedThemes();
      return this.showActiveThemes();
    };

    TimecopView.prototype.getSlowPackages = function(packages, timeKey) {
      var count, time;
      time = 0;
      count = 0;
      packages = packages.filter(function(pack) {
        time += pack[timeKey];
        count++;
        return pack[timeKey] > 5;
      });
      packages.sort(function(pack1, pack2) {
        return pack2[timeKey] - pack1[timeKey];
      });
      return {
        time: time,
        count: count,
        packages: packages
      };
    };

    TimecopView.prototype.showLoadedPackages = function() {
      var count, packages, time, _ref;
      packages = atom.packages.getLoadedPackages().filter(function(pack) {
        return pack.getType() !== 'theme';
      });
      _ref = this.getSlowPackages(packages, 'loadTime'), time = _ref.time, count = _ref.count, packages = _ref.packages;
      this.packageLoadingPanel.addPackages(packages, 'loadTime');
      return this.packageLoadingPanel.summary.text("Loaded " + count + " packages in " + time + "ms.\n" + (_.pluralize(packages.length, 'package')) + " took longer than 5ms to load.");
    };

    TimecopView.prototype.showActivePackages = function() {
      var count, packages, time, _ref;
      packages = atom.packages.getActivePackages().filter(function(pack) {
        return pack.getType() !== 'theme';
      });
      _ref = this.getSlowPackages(packages, 'activateTime'), time = _ref.time, count = _ref.count, packages = _ref.packages;
      this.packageActivationPanel.addPackages(packages, 'activateTime');
      return this.packageActivationPanel.summary.text("Activated " + count + " packages in " + time + "ms.\n" + (_.pluralize(packages.length, 'package')) + " took longer than 5ms to activate.");
    };

    TimecopView.prototype.showLoadedThemes = function() {
      var count, packages, time, _ref;
      _ref = this.getSlowPackages(atom.themes.getLoadedThemes(), 'loadTime'), time = _ref.time, count = _ref.count, packages = _ref.packages;
      this.themeLoadingPanel.addPackages(packages, 'loadTime');
      return this.themeLoadingPanel.summary.text("Loaded " + count + " themes in " + time + "ms.\n" + (_.pluralize(packages.length, 'theme')) + " took longer than 5ms to load.");
    };

    TimecopView.prototype.showActiveThemes = function() {
      var count, packages, time, _ref;
      _ref = this.getSlowPackages(atom.themes.getActiveThemes(), 'activateTime'), time = _ref.time, count = _ref.count, packages = _ref.packages;
      this.themeActivationPanel.addPackages(packages, 'activateTime');
      return this.themeActivationPanel.summary.text("Activated " + count + " themes in " + time + "ms.\n" + (_.pluralize(packages.length, 'theme')) + " took longer than 5ms to activate.");
    };

    TimecopView.prototype.serialize = function() {
      return {
        deserializer: this.constructor.name,
        uri: this.getURI()
      };
    };

    TimecopView.prototype.getURI = function() {
      return this.uri;
    };

    TimecopView.prototype.getTitle = function() {
      return 'Timecop';
    };

    TimecopView.prototype.getIconName = function() {
      return 'dashboard';
    };

    return TimecopView;

  })(ScrollView);

}).call(this);
