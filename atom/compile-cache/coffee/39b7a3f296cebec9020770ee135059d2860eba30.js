(function() {
  var CompositeDisposable, ReleaseNotesStatusBar, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom-space-pen-views').View;

  CompositeDisposable = require('atom').CompositeDisposable;

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

    ReleaseNotesStatusBar.prototype.initialize = function(statusBar, previousVersion) {
      this.statusBar = statusBar;
      this.subscriptions = new CompositeDisposable();
      this.on('click', function() {
        return atom.workspace.open('atom://release-notes');
      });
      this.subscriptions.add(atom.commands.add('atom-workspace', 'window:update-available', (function(_this) {
        return function() {
          return _this.attach();
        };
      })(this)));
      this.subscriptions.add(atom.tooltips.add(this.element, {
        title: 'Click to view the release notes'
      }));
      if ((previousVersion != null) && previousVersion !== atom.getVersion()) {
        return this.attach();
      }
    };

    ReleaseNotesStatusBar.prototype.attach = function() {
      return this.statusBar.addRightTile({
        item: this,
        priority: -100
      });
    };

    ReleaseNotesStatusBar.prototype.detached = function() {
      var _ref;
      return (_ref = this.subsriptions) != null ? _ref.dispose() : void 0;
    };

    return ReleaseNotesStatusBar;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdEQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxPQUFRLE9BQUEsQ0FBUSxzQkFBUixFQUFSLElBQUQsQ0FBQTs7QUFBQSxFQUNDLHNCQUF1QixPQUFBLENBQVEsTUFBUixFQUF2QixtQkFERCxDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLDRDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLHFCQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxJQUFELENBQU07QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFBZ0IsT0FBQSxFQUFPLHNEQUF2QjtPQUFOLEVBRFE7SUFBQSxDQUFWLENBQUE7O0FBQUEsb0NBR0EsVUFBQSxHQUFZLFNBQUUsU0FBRixFQUFhLGVBQWIsR0FBQTtBQUNWLE1BRFcsSUFBQyxDQUFBLFlBQUEsU0FDWixDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsYUFBRCxHQUFxQixJQUFBLG1CQUFBLENBQUEsQ0FBckIsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLEVBQUQsQ0FBSSxPQUFKLEVBQWEsU0FBQSxHQUFBO2VBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLHNCQUFwQixFQUFIO01BQUEsQ0FBYixDQUZBLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQW9DLHlCQUFwQyxFQUErRCxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUFHLEtBQUMsQ0FBQSxNQUFELENBQUEsRUFBSDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQS9ELENBQW5CLENBSEEsQ0FBQTtBQUFBLE1BS0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixJQUFDLENBQUEsT0FBbkIsRUFBNEI7QUFBQSxRQUFBLEtBQUEsRUFBTyxpQ0FBUDtPQUE1QixDQUFuQixDQUxBLENBQUE7QUFNQSxNQUFBLElBQWEseUJBQUEsSUFBcUIsZUFBQSxLQUFxQixJQUFJLENBQUMsVUFBTCxDQUFBLENBQXZEO2VBQUEsSUFBQyxDQUFBLE1BQUQsQ0FBQSxFQUFBO09BUFU7SUFBQSxDQUhaLENBQUE7O0FBQUEsb0NBWUEsTUFBQSxHQUFRLFNBQUEsR0FBQTthQUNOLElBQUMsQ0FBQSxTQUFTLENBQUMsWUFBWCxDQUF3QjtBQUFBLFFBQUEsSUFBQSxFQUFNLElBQU47QUFBQSxRQUFZLFFBQUEsRUFBVSxDQUFBLEdBQXRCO09BQXhCLEVBRE07SUFBQSxDQVpSLENBQUE7O0FBQUEsb0NBZUEsUUFBQSxHQUFVLFNBQUEsR0FBQTtBQUNSLFVBQUEsSUFBQTtzREFBYSxDQUFFLE9BQWYsQ0FBQSxXQURRO0lBQUEsQ0FmVixDQUFBOztpQ0FBQTs7S0FEa0MsS0FKcEMsQ0FBQTtBQUFBIgp9
//# sourceURL=/Users/ah/.atom/packages/release-notes/lib/release-notes-status-bar.coffee