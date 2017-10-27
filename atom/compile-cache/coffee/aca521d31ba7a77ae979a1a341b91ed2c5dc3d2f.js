(function() {
  var $$, Disposable, ReleaseNotesView, View, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('space-pen'), $$ = _ref.$$, View = _ref.View;

  Disposable = require('atom').Disposable;

  module.exports = ReleaseNotesView = (function(_super) {
    __extends(ReleaseNotesView, _super);

    function ReleaseNotesView() {
      return ReleaseNotesView.__super__.constructor.apply(this, arguments);
    }

    ReleaseNotesView.content = function() {
      return this.div({
        "class": 'release-notes padded pane-item native-key-bindings',
        tabindex: -1
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'block'
          }, function() {
            _this.button({
              "class": 'inline-block hidden btn btn-success',
              outlet: 'updateButton'
            }, 'Restart and update');
            return _this.button({
              "class": 'inline-block btn',
              outlet: 'viewReleaseNotesButton'
            }, 'View on atom.io');
          });
          return _this.div({
            "class": 'block'
          }, function() {
            return _this.div({
              outlet: 'notesContainer'
            });
          });
        };
      })(this));
    };

    ReleaseNotesView.prototype.getTitle = function() {
      return 'Release Notes';
    };

    ReleaseNotesView.prototype.getIconName = function() {
      return 'squirrel';
    };

    ReleaseNotesView.prototype.getURI = function() {
      return this.uri;
    };

    ReleaseNotesView.prototype.serialize = function() {
      return {
        deserializer: this.constructor.name,
        uri: this.uri,
        releaseNotes: this.releaseNotes,
        releaseVersion: this.releaseVersion
      };
    };

    ReleaseNotesView.prototype.onDidChangeTitle = function() {
      return new Disposable();
    };

    ReleaseNotesView.prototype.onDidChangeModified = function() {
      return new Disposable();
    };

    ReleaseNotesView.prototype.initialize = function(uri, releaseVersion, releaseNotes) {
      this.uri = uri;
      this.releaseVersion = releaseVersion;
      this.releaseNotes = releaseNotes;
      if (this.releaseVersion == null) {
        this.releaseVersion = atom.getVersion();
      }
      if (typeof this.releaseNotes === 'string') {
        this.releaseNotes = [
          {
            version: this.releaseVersion,
            notes: this.releaseNotes,
            error: true
          }
        ];
      }
      if (this.releaseNotes == null) {
        this.releaseNotes = [];
      }
      if (this.releaseVersion !== atom.getVersion()) {
        this.updateButton.removeClass('hidden');
      }
      this.addReleaseNotes();
      this.fetchReleaseNotes();
      this.updateButton.on('click', function() {
        return atom.commands.dispatch(atom.views.getView(atom.workspace), 'application:install-update');
      });
      return this.viewReleaseNotesButton.on('click', function() {
        return require('shell').openExternal('https://atom.io/releases');
      });
    };

    ReleaseNotesView.prototype.fetchReleaseNotes = function() {
      return require('./release-notes').fetch(this.releaseVersion, (function(_this) {
        return function(releaseNotes) {
          if (releaseNotes.length === 0) {
            return;
          }
          if (_this.releaseNotes.length === 0 || _this.releaseNotes[0].error || !releaseNotes[0].error) {
            _this.releaseNotes = releaseNotes;
            return _this.addReleaseNotes();
          }
        };
      })(this));
    };

    ReleaseNotesView.prototype.addReleaseNotes = function() {
      var date, notes, version, _i, _len, _ref1, _ref2, _results;
      this.notesContainer.empty();
      _ref1 = this.releaseNotes;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        _ref2 = _ref1[_i], date = _ref2.date, notes = _ref2.notes, version = _ref2.version;
        _results.push(this.notesContainer.append($$(function() {
          if (date != null) {
            this.h1({
              "class": 'section-heading'
            }, (function(_this) {
              return function() {
                _this.span({
                  "class": 'text-highlight'
                }, "" + version + " ");
                return _this.small(new Date(date).toLocaleString());
              };
            })(this));
          } else {
            this.h1({
              "class": 'section-heading text-highlight'
            }, version);
          }
          return this.div({
            "class": 'description'
          }, (function(_this) {
            return function() {
              return _this.raw(notes);
            };
          })(this));
        })));
      }
      return _results;
    };

    return ReleaseNotesView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDRDQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxPQUFhLE9BQUEsQ0FBUSxXQUFSLENBQWIsRUFBQyxVQUFBLEVBQUQsRUFBSyxZQUFBLElBQUwsQ0FBQTs7QUFBQSxFQUNDLGFBQWMsT0FBQSxDQUFRLE1BQVIsRUFBZCxVQURELENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osdUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsZ0JBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLG9EQUFQO0FBQUEsUUFBNkQsUUFBQSxFQUFVLENBQUEsQ0FBdkU7T0FBTCxFQUFnRixDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQzlFLFVBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFPLE9BQVA7V0FBTCxFQUFxQixTQUFBLEdBQUE7QUFDbkIsWUFBQSxLQUFDLENBQUEsTUFBRCxDQUFRO0FBQUEsY0FBQSxPQUFBLEVBQU8scUNBQVA7QUFBQSxjQUE4QyxNQUFBLEVBQVEsY0FBdEQ7YUFBUixFQUE4RSxvQkFBOUUsQ0FBQSxDQUFBO21CQUNBLEtBQUMsQ0FBQSxNQUFELENBQVE7QUFBQSxjQUFBLE9BQUEsRUFBTyxrQkFBUDtBQUFBLGNBQTJCLE1BQUEsRUFBUSx3QkFBbkM7YUFBUixFQUFxRSxpQkFBckUsRUFGbUI7VUFBQSxDQUFyQixDQUFBLENBQUE7aUJBR0EsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFPLE9BQVA7V0FBTCxFQUFxQixTQUFBLEdBQUE7bUJBQ25CLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFB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
//# sourceURL=/Users/ah/.atom/packages/release-notes/lib/release-notes-view.coffee