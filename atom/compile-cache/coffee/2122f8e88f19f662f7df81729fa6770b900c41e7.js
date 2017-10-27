(function() {
  var path;

  path = require('path');

  module.exports = {
    configDefaults: {
      showOnStartup: true
    },
    activate: function() {
      atom.workspaceView.command('welcome:show-welcome-buffer', (function(_this) {
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
      return atom.workspaceView.open(path.join(__dirname, 'welcome.md'));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLElBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBUCxDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsY0FBQSxFQUNFO0FBQUEsTUFBQSxhQUFBLEVBQWUsSUFBZjtLQURGO0FBQUEsSUFHQSxRQUFBLEVBQVUsU0FBQSxHQUFBO0FBQ1IsTUFBQSxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQW5CLENBQTJCLDZCQUEzQixFQUEwRCxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUFHLEtBQUMsQ0FBQSxJQUFELENBQUEsRUFBSDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTFELENBQUEsQ0FBQTtBQUNBLE1BQUEsSUFBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsdUJBQWhCLENBQUg7QUFDRSxRQUFBLElBQUMsQ0FBQSxJQUFELENBQUEsQ0FBQSxDQUFBO2VBQ0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHVCQUFoQixFQUF5QyxLQUF6QyxFQUZGO09BRlE7SUFBQSxDQUhWO0FBQUEsSUFTQSxJQUFBLEVBQU0sU0FBQSxHQUFBO2FBQ0osSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFuQixDQUF3QixJQUFJLENBQUMsSUFBTCxDQUFVLFNBQVYsRUFBcUIsWUFBckIsQ0FBeEIsRUFESTtJQUFBLENBVE47R0FIRixDQUFBO0FBQUEiCn0=
//# sourceURL=/Users/ah/.atom/packages/welcome/lib/welcome.coffee