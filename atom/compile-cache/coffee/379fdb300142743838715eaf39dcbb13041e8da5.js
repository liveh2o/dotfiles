(function() {
  var path;

  path = require('path');

  module.exports = {
    config: {
      showOnStartup: {
        type: 'boolean',
        "default": true
      }
    },
    activate: function() {
      atom.commands.add('atom-workspace', 'welcome:show-welcome-buffer', (function(_this) {
        return function() {
          return _this.show();
        };
      })(this));
      if (atom.config.get('welcome.showOnStartup')) {
        this.show();
        return atom.config.set('welcome.showOnStartup', false);
      }
    },
    show: function() {
      var welcomePath;
      welcomePath = path.resolve(__dirname, '..', 'docs', process.platform, 'welcome.md');
      return atom.workspace.open(welcomePath);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLElBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBUCxDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsTUFBQSxFQUNFO0FBQUEsTUFBQSxhQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsSUFEVDtPQURGO0tBREY7QUFBQSxJQUtBLFFBQUEsRUFBVSxTQUFBLEdBQUE7QUFDUixNQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0MsNkJBQXBDLEVBQW1FLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQUcsS0FBQyxDQUFBLElBQUQsQ0FBQSxFQUFIO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbkUsQ0FBQSxDQUFBO0FBQ0EsTUFBQSxJQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix1QkFBaEIsQ0FBSDtBQUNFLFFBQUEsSUFBQyxDQUFBLElBQUQsQ0FBQSxDQUFBLENBQUE7ZUFDQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsdUJBQWhCLEVBQXlDLEtBQXpDLEVBRkY7T0FGUTtJQUFBLENBTFY7QUFBQSxJQVdBLElBQUEsRUFBTSxTQUFBLEdBQUE7QUFDSixVQUFBLFdBQUE7QUFBQSxNQUFBLFdBQUEsR0FBYyxJQUFJLENBQUMsT0FBTCxDQUFhLFNBQWIsRUFBd0IsSUFBeEIsRUFBOEIsTUFBOUIsRUFBc0MsT0FBTyxDQUFDLFFBQTlDLEVBQXdELFlBQXhELENBQWQsQ0FBQTthQUNBLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixXQUFwQixFQUZJO0lBQUEsQ0FYTjtHQUhGLENBQUE7QUFBQSIKfQ==
//# sourceURL=/Users/ah/.atom/packages/welcome/lib/welcome.coffee