(function() {
  var CompositeDisposable, ReleaseNotesStatusBar, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('space-pen').View;

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

    ReleaseNotesStatusBar.prototype.initialize = function(previousVersion) {
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
      return document.querySelector('status-bar').addRightTile({
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdEQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxPQUFRLE9BQUEsQ0FBUSxXQUFSLEVBQVIsSUFBRCxDQUFBOztBQUFBLEVBQ0Msc0JBQXVCLE9BQUEsQ0FBUSxNQUFSLEVBQXZCLG1CQURELENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osNENBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEscUJBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLElBQUQsQ0FBTTtBQUFBLFFBQUEsSUFBQSxFQUFNLFFBQU47QUFBQSxRQUFnQixPQUFBLEVBQU8sc0RBQXZCO09BQU4sRUFEUTtJQUFBLENBQVYsQ0FBQTs7QUFBQSxvQ0FHQSxVQUFBLEdBQVksU0FBQyxlQUFELEdBQUE7QUFDVixNQUFBLElBQUMsQ0FBQSxhQUFELEdBQXFCLElBQUEsbUJBQUEsQ0FBQSxDQUFyQixDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsRUFBRCxDQUFJLE9BQUosRUFBYSxTQUFBLEdBQUE7ZUFBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0Isc0JBQXBCLEVBQUg7TUFBQSxDQUFiLENBRkEsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0MseUJBQXBDLEVBQStELENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQUcsS0FBQyxDQUFBLE1BQUQsQ0FBQSxFQUFIO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBL0QsQ0FBbkIsQ0FIQSxDQUFBO0FBQUEsTUFLQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLElBQUMsQ0FBQSxPQUFuQixFQUE0QjtBQUFBLFFBQUEsS0FBQSxFQUFPLGlDQUFQO09BQTVCLENBQW5CLENBTEEsQ0FBQTtBQU1BLE1BQUEsSUFBYSx5QkFBQSxJQUFxQixlQUFBLEtBQXFCLElBQUksQ0FBQyxVQUFMLENBQUEsQ0FBdkQ7ZUFBQSxJQUFDLENBQUEsTUFBRCxDQUFBLEVBQUE7T0FQVTtJQUFBLENBSFosQ0FBQTs7QUFBQSxvQ0FZQSxNQUFBLEdBQVEsU0FBQSxHQUFBO2FBQ04sUUFBUSxDQUFDLGFBQVQsQ0FBdUIsWUFBdkIsQ0FBb0MsQ0FBQyxZQUFyQyxDQUFrRDtBQUFBLFFBQUEsSUFBQSxFQUFNLElBQU47QUFBQSxRQUFZLFFBQUEsRUFBVSxDQUFBLEdBQXRCO09BQWxELEVBRE07SUFBQSxDQVpSLENBQUE7O0FBQUEsb0NBZUEsUUFBQSxHQUFVLFNBQUEsR0FBQTtBQUNSLFVBQUEsSUFBQTtzREFBYSxDQUFFLE9BQWYsQ0FBQSxXQURRO0lBQUEsQ0FmVixDQUFBOztpQ0FBQTs7S0FEa0MsS0FKcEMsQ0FBQTtBQUFBIgp9
//# sourceURL=/Users/ah/.atom/packages/release-notes/lib/release-notes-status-bar.coffee