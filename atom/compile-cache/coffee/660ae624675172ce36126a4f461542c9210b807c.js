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
      });
    };

    ReleaseNotesStatusBar.prototype.initialize = function(previousVersion) {
      this.subscribe(this, 'click', (function(_this) {
        return function() {
          return atom.workspaceView.open('atom://release-notes');
        };
      })(this));
      this.subscribe(atom.workspaceView, 'window:update-available', (function(_this) {
        return function() {
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDJCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxPQUFRLE9BQUEsQ0FBUSxNQUFSLEVBQVIsSUFBRCxDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLDRDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLHFCQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxJQUFELENBQU07QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFBZ0IsT0FBQSxFQUFPLHNEQUF2QjtPQUFOLEVBRFE7SUFBQSxDQUFWLENBQUE7O0FBQUEsb0NBR0EsVUFBQSxHQUFZLFNBQUMsZUFBRCxHQUFBO0FBQ1YsTUFBQSxJQUFDLENBQUEsU0FBRCxDQUFXLElBQVgsRUFBaUIsT0FBakIsRUFBMEIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFBRyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQW5CLENBQXdCLHNCQUF4QixFQUFIO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBMUIsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsU0FBRCxDQUFXLElBQUksQ0FBQyxhQUFoQixFQUErQix5QkFBL0IsRUFBMEQsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFBRyxLQUFDLENBQUEsTUFBRCxDQUFBLEVBQUg7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUExRCxDQURBLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxVQUFELENBQVksc0NBQVosQ0FGQSxDQUFBO0FBR0EsTUFBQSxJQUFhLHlCQUFBLElBQXFCLGVBQUEsS0FBbUIsSUFBSSxDQUFDLFVBQUwsQ0FBQSxDQUFyRDtlQUFBLElBQUMsQ0FBQSxNQUFELENBQUEsRUFBQTtPQUpVO0lBQUEsQ0FIWixDQUFBOztBQUFBLG9DQVNBLE1BQUEsR0FBUSxTQUFBLEdBQUE7YUFDTixJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxXQUE3QixDQUF5QyxJQUF6QyxFQURNO0lBQUEsQ0FUUixDQUFBOztpQ0FBQTs7S0FEa0MsS0FIcEMsQ0FBQTtBQUFBIgp9
//# sourceURL=/Users/ah/.atom/packages/release-notes/lib/release-notes-status-bar.coffee