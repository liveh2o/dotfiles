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
      return (_ref = this.subscriptions) != null ? _ref.dispose() : void 0;
    };

    return ReleaseNotesStatusBar;

  })(View);

}).call(this);
