(function() {
  var ReleaseNotesStatusBar, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom').View;

  module.exports = ReleaseNotesStatusBar = (function(_super) {
    __extends(ReleaseNotesStatusBar, _super);

    function ReleaseNotesStatusBar() {
      return ReleaseNotesStatusBar.__super__.constructor.apply(this, arguments);
    }

    ReleaseNotesStatusBar.content = function() {
      return this.span({
        type: 'button',
        "class": 'release-notes-status icon icon-squirrel inline-block'
      }, (function(_this) {
        return function() {
          return _this.a({
            href: '#',
            "class": 'text-info',
            outlet: 'upgradeText'
          }, " Upgrade");
        };
      })(this));
    };

    ReleaseNotesStatusBar.prototype.initialize = function(previousVersion) {
      this.upgradeText.hide();
      this.subscribe(this, 'click', function() {
        return atom.workspaceView.open('atom://release-notes');
      });
      this.subscribe(atom.workspaceView, 'window:update-available', (function(_this) {
        return function() {
          if (process.platform === 'win32') {
            _this.upgradeText.show();
          }
          return _this.attach();
        };
      })(this));
      this.setTooltip('Click here to view the release notes');
      if ((previousVersion != null) && previousVersion !== atom.getVersion()) {
        return this.attach();
      }
    };

    ReleaseNotesStatusBar.prototype.attach = function() {
      return atom.workspaceView.statusBar.appendRight(this);
    };

    return ReleaseNotesStatusBar;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDJCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxPQUFRLE9BQUEsQ0FBUSxNQUFSLEVBQVIsSUFBRCxDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLDRDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLHFCQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxJQUFELENBQU07QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFBZ0IsT0FBQSxFQUFPLHNEQUF2QjtPQUFOLEVBQXFGLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQ25GLEtBQUMsQ0FBQSxDQUFELENBQUc7QUFBQSxZQUFBLElBQUEsRUFBTSxHQUFOO0FBQUEsWUFBVyxPQUFBLEVBQU8sV0FBbEI7QUFBQSxZQUErQixNQUFBLEVBQVEsYUFBdkM7V0FBSCxFQUF5RCxVQUF6RCxFQURtRjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXJGLEVBRFE7SUFBQSxDQUFWLENBQUE7O0FBQUEsb0NBSUEsVUFBQSxHQUFZLFNBQUMsZUFBRCxHQUFBO0FBQ1YsTUFBQSxJQUFDLENBQUEsV0FBVyxDQUFDLElBQWIsQ0FBQSxDQUFBLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxTQUFELENBQVcsSUFBWCxFQUFpQixPQUFqQixFQUEwQixTQUFBLEdBQUE7ZUFBRyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQW5CLENBQXdCLHNCQUF4QixFQUFIO01BQUEsQ0FBMUIsQ0FGQSxDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsU0FBRCxDQUFXLElBQUksQ0FBQyxhQUFoQixFQUErQix5QkFBL0IsRUFBMEQsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUN4RCxVQUFBLElBQXVCLE9BQU8sQ0FBQyxRQUFSLEtBQW9CLE9BQTNDO0FBQUEsWUFBQSxLQUFDLENBQUEsV0FBVyxDQUFDLElBQWIsQ0FBQSxDQUFBLENBQUE7V0FBQTtpQkFDQSxLQUFDLENBQUEsTUFBRCxDQUFBLEVBRndEO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBMUQsQ0FIQSxDQUFBO0FBQUEsTUFNQSxJQUFDLENBQUEsVUFBRCxDQUFZLHNDQUFaLENBTkEsQ0FBQTtBQU9BLE1BQUEsSUFBYSx5QkFBQSxJQUFxQixlQUFBLEtBQW1CLElBQUksQ0FBQyxVQUFMLENBQUEsQ0FBckQ7ZUFBQSxJQUFDLENBQUEsTUFBRCxDQUFBLEVBQUE7T0FSVTtJQUFBLENBSlosQ0FBQTs7QUFBQSxvQ0FjQSxNQUFBLEdBQVEsU0FBQSxHQUFBO2FBQ04sSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsV0FBN0IsQ0FBeUMsSUFBekMsRUFETTtJQUFBLENBZFIsQ0FBQTs7aUNBQUE7O0tBRGtDLEtBSHBDLENBQUE7QUFBQSIKfQ==
//# sourceURL=/Users/ah/.atom/packages/release-notes/lib/release-notes-status-bar.coffee