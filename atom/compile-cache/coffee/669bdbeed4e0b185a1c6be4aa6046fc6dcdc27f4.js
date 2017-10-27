(function() {
  var $$, Disposable, ReleaseNotesView, View, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $$ = _ref.$$, View = _ref.View;

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
