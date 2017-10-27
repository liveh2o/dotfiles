(function() {
  var CompositeDisposable, ConsentUri, ConsentView, GuideUri, GuideView, Reporter, WelcomeUri, WelcomeView, createConsentView, createGuideView, createWelcomeView;

  CompositeDisposable = require('atom').CompositeDisposable;

  Reporter = null;

  WelcomeView = null;

  GuideView = null;

  ConsentView = null;

  WelcomeUri = 'atom://welcome/welcome';

  GuideUri = 'atom://welcome/guide';

  ConsentUri = 'atom://welcome/consent';

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

  createConsentView = function(state) {
    if (ConsentView == null) {
      ConsentView = require('./consent-view');
    }
    return new ConsentView(state);
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
          _this.subscriptions.add(atom.deserializers.add({
            name: 'ConsentView',
            deserialize: function(state) {
              return createConsentView(state);
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
          _this.subscriptions.add(atom.workspace.addOpener(function(filePath) {
            if (filePath === ConsentUri) {
              return createConsentView({
                uri: ConsentUri
              });
            }
          }));
          _this.subscriptions.add(atom.commands.add('atom-workspace', 'welcome:show', function() {
            return _this.show();
          }));
          if (atom.config.get('core.telemetryConsent') === 'undecided') {
            atom.workspace.open(ConsentUri);
          }
          if (atom.config.get('welcome.showOnStartup')) {
            _this.show();
            if (Reporter == null) {
              Reporter = require('./reporter');
            }
            return Reporter.sendEvent('show-on-initial-load');
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3dlbGNvbWUvbGliL3dlbGNvbWUuY29mZmVlIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDJKQUFBOztBQUFBLEVBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQUFELENBQUE7O0FBQUEsRUFDQSxRQUFBLEdBQVcsSUFEWCxDQUFBOztBQUFBLEVBRUEsV0FBQSxHQUFjLElBRmQsQ0FBQTs7QUFBQSxFQUdBLFNBQUEsR0FBWSxJQUhaLENBQUE7O0FBQUEsRUFJQSxXQUFBLEdBQWMsSUFKZCxDQUFBOztBQUFBLEVBTUEsVUFBQSxHQUFhLHdCQU5iLENBQUE7O0FBQUEsRUFPQSxRQUFBLEdBQVcsc0JBUFgsQ0FBQTs7QUFBQSxFQVFBLFVBQUEsR0FBYSx3QkFSYixDQUFBOztBQUFBLEVBVUEsaUJBQUEsR0FBb0IsU0FBQyxLQUFELEdBQUE7O01BQ2xCLGNBQWUsT0FBQSxDQUFRLGdCQUFSO0tBQWY7V0FDSSxJQUFBLFdBQUEsQ0FBWSxLQUFaLEVBRmM7RUFBQSxDQVZwQixDQUFBOztBQUFBLEVBY0EsZUFBQSxHQUFrQixTQUFDLEtBQUQsR0FBQTs7TUFDaEIsWUFBYSxPQUFBLENBQVEsY0FBUjtLQUFiO1dBQ0ksSUFBQSxTQUFBLENBQVUsS0FBVixFQUZZO0VBQUEsQ0FkbEIsQ0FBQTs7QUFBQSxFQWtCQSxpQkFBQSxHQUFvQixTQUFDLEtBQUQsR0FBQTs7TUFDbEIsY0FBZSxPQUFBLENBQVEsZ0JBQVI7S0FBZjtXQUNJLElBQUEsV0FBQSxDQUFZLEtBQVosRUFGYztFQUFBLENBbEJwQixDQUFBOztBQUFBLEVBc0JBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLFFBQUEsRUFBVSxTQUFBLEdBQUE7QUFDUixNQUFBLElBQUMsQ0FBQSxhQUFELEdBQWlCLEdBQUEs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

//# sourceURL=/Users/ah/.atom/packages/welcome/lib/welcome.coffee
