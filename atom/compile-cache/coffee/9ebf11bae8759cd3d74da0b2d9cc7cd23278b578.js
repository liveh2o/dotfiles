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

  atom.deserializers.add({
    name: 'WelcomeView',
    deserialize: function(state) {
      return createWelcomeView(state);
    }
  });

  atom.deserializers.add({
    name: 'GuideView',
    deserialize: function(state) {
      return createGuideView(state);
    }
  });

  module.exports = {
    config: {
      showOnStartup: {
        type: 'boolean',
        "default": true
      }
    },
    activate: function() {
      this.subscriptions = new CompositeDisposable;
      return process.nextTick((function(_this) {
        return function() {
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
