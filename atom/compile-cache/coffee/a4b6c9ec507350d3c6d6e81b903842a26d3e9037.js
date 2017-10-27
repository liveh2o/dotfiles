(function() {
  var CompositeDisposable, GuideUri, GuideView, Reporter, WelcomeUri, WelcomeView, createGuideView, createWelcomeView;

  CompositeDisposable = require('atom').CompositeDisposable;

  Reporter = null;

  WelcomeView = null;

  GuideView = null;

  WelcomeUri = 'atom://welcome/welcome';

  GuideUri = 'atom://welcome/guide';

  createWelcomeView = function(state) {
    if (WelcomeView == null) {
      WelcomeView = require('./welcome-view');
    }
    return new WelcomeView(state);
  };

  createGuideView = function(state) {
    if (GuideView == null) {
      GuideView = require('./guide-view');
    }
    return new GuideView(state);
  };

  module.exports = {
    activate: function() {
      this.subscriptions = new CompositeDisposable;
      return process.nextTick((function(_this) {
        return function() {
          _this.subscriptions.add(atom.deserializers.add({
            name: 'WelcomeView',
            deserialize: function(state) {
              return createWelcomeView(state);
            }
          }));
          _this.subscriptions.add(atom.deserializers.add({
            name: 'GuideView',
            deserialize: function(state) {
              return createGuideView(state);
            }
          }));
          _this.subscriptions.add(atom.workspace.addOpener(function(filePath) {
            if (filePath === WelcomeUri) {
              return createWelcomeView({
                uri: WelcomeUri
              });
            }
          }));
          _this.subscriptions.add(atom.workspace.addOpener(function(filePath) {
            if (filePath === GuideUri) {
              return createGuideView({
                uri: GuideUri
              });
            }
          }));
          _this.subscriptions.add(atom.commands.add('atom-workspace', 'welcome:show', function() {
            return _this.show();
          }));
          if (atom.config.get('welcome.showOnStartup')) {
            _this.show();
            if (Reporter == null) {
              Reporter = require('./reporter');
            }
            Reporter.sendEvent('show-on-initial-load');
            return atom.config.set('welcome.showOnStartup', false);
          }
        };
      })(this));
    },
    show: function() {
      atom.workspace.open(WelcomeUri);
      return atom.workspace.open(GuideUri, {
        split: 'right'
      });
    },
    consumeReporter: function(reporter) {
      if (Reporter == null) {
        Reporter = require('./reporter');
      }
      return Reporter.setReporter(reporter);
    },
    deactivate: function() {
      return this.subscriptions.dispose();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3dlbGNvbWUvbGliL3dlbGNvbWUuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLCtHQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFDQSxRQUFBLEdBQVcsSUFEWCxDQUFBOztBQUFBLEVBRUEsV0FBQSxHQUFjLElBRmQsQ0FBQTs7QUFBQSxFQUdBLFNBQUEsR0FBWSxJQUhaLENBQUE7O0FBQUEsRUFLQSxVQUFBLEdBQWEsd0JBTGIsQ0FBQTs7QUFBQSxFQU1BLFFBQUEsR0FBVyxzQkFOWCxDQUFBOztBQUFBLEVBUUEsaUJBQUEsR0FBb0IsU0FBQyxLQUFELEdBQUE7O01BQ2xCLGNBQWUsT0FBQSxDQUFRLGdCQUFSO0tBQWY7V0FDSSxJQUFBLFdBQUEsQ0FBWSxLQUFaLEVBRmM7RUFBQSxDQVJwQixDQUFBOztBQUFBLEVBWUEsZUFBQSxHQUFrQixTQUFDLEtBQUQsR0FBQTs7TUFDaEIsWUFBYSxPQUFBLENBQVEsY0FBUjtLQUFiO1dBQ0ksSUFBQSxTQUFBLENBQVUsS0FBVixFQUZZO0VBQUEsQ0FabEIsQ0FBQTs7QUFBQSxFQWdCQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxRQUFBLEVBQVUsU0FBQSxHQUFBO0FBQ1IsTUFBQSxJQUFDLENBQUEsYUFBRCxHQUFpQixHQUFBLENBQUEsbUJBQWpCLENBQUE7YUFFQSxPQUFPLENBQUMsUUFBUixDQUFpQixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ2YsVUFBQSxLQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFuQixDQUNqQjtBQUFBLFlBQUEsSUFBQSxFQUFNLGFBQU47QUFBQSxZ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

//# sourceURL=/Users/ah/.atom/packages/welcome/lib/welcome.coffee
