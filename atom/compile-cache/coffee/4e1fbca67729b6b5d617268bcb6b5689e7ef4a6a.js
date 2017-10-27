(function() {
  var View, WindowPanelView,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom-space-pen-views').View;

  module.exports = WindowPanelView = (function(_super) {
    __extends(WindowPanelView, _super);

    function WindowPanelView() {
      return WindowPanelView.__super__.constructor.apply(this, arguments);
    }

    WindowPanelView.content = function() {
      return this.div({
        "class": 'tool-panel padded package-panel'
      }, (function(_this) {
        return function() {
          return _this.div({
            "class": 'inset-panel'
          }, function() {
            _this.div({
              "class": 'panel-heading'
            }, 'Startup Time');
            return _this.div({
              "class": 'panel-body padded'
            }, function() {
              _this.div({
                "class": 'timing',
                outlet: 'windowTiming'
              }, function() {
                _this.span({
                  "class": 'inline-block'
                }, 'Window load time');
                return _this.span({
                  "class": 'inline-block',
                  outlet: 'windowLoadTime'
                });
              });
              _this.div({
                "class": 'timing',
                outlet: 'shellTiming'
              }, function() {
                _this.span({
                  "class": 'inline-block'
                }, 'Shell load time');
                return _this.span({
                  "class": 'inline-block',
                  outlet: 'shellLoadTime'
                });
              });
              return _this.div({
                outlet: 'deserializeTimings'
              }, function() {
                _this.div({
                  "class": 'timing',
                  outlet: 'workspaceTiming'
                }, function() {
                  _this.span({
                    "class": 'inline-block'
                  }, 'Workspace load time');
                  return _this.span({
                    "class": 'inline-block',
                    outlet: 'workspaceLoadTime'
                  });
                });
                _this.div({
                  "class": 'timing',
                  outlet: 'projectTiming'
                }, function() {
                  _this.span({
                    "class": 'inline-block'
                  }, 'Project load time');
                  return _this.span({
                    "class": 'inline-block',
                    outlet: 'projectLoadTime'
                  });
                });
                return _this.div({
                  "class": 'timing',
                  outlet: 'atomTiming'
                }, function() {
                  _this.span({
                    "class": 'inline-block'
                  }, 'Window state load time');
                  return _this.span({
                    "class": 'inline-block',
                    outlet: 'atomLoadTime'
                  });
                });
              });
            });
          });
        };
      })(this));
    };

    WindowPanelView.prototype.initialize = function() {
      atom.tooltips.add(this.windowTiming[0], {
        title: 'The time taken to load this window'
      });
      atom.tooltips.add(this.shellTiming[0], {
        title: 'The time taken to launch the app'
      });
      atom.tooltips.add(this.workspaceTiming[0], {
        title: 'The time taken to rebuild the prevoiusly opened editors'
      });
      atom.tooltips.add(this.projectTiming[0], {
        title: 'The time taken to rebuild the previously opened buffers'
      });
      return atom.tooltips.add(this.atomTiming[0], {
        title: 'The time taken to read and parse the stored window state'
      });
    };

    WindowPanelView.prototype.updateWindowLoadTime = function() {
      var shellLoadTime, time;
      time = atom.getWindowLoadTime();
      this.windowLoadTime.addClass(this.getHighlightClass(time));
      this.windowLoadTime.text("" + time + "ms");
      shellLoadTime = atom.getLoadSettings().shellLoadTime;
      if (shellLoadTime != null) {
        this.shellLoadTime.addClass(this.getHighlightClass(shellLoadTime));
        this.shellLoadTime.text("" + shellLoadTime + "ms");
      } else {
        this.shellTiming.hide();
      }
      if (atom.deserializeTimings != null) {
        this.workspaceLoadTime.addClass(this.getHighlightClass(atom.deserializeTimings.workspace));
        this.workspaceLoadTime.text("" + atom.deserializeTimings.workspace + "ms");
        this.projectLoadTime.addClass(this.getHighlightClass(atom.deserializeTimings.project));
        this.projectLoadTime.text("" + atom.deserializeTimings.project + "ms");
        this.atomLoadTime.addClass(this.getHighlightClass(atom.deserializeTimings.atom));
        return this.atomLoadTime.text("" + atom.deserializeTimings.atom + "ms");
      } else {
        return this.deserializeTimings.hide();
      }
    };

    WindowPanelView.prototype.getHighlightClass = function(time) {
      if (time > 1000) {
        return 'highlight-error';
      } else if (time > 800) {
        return 'highlight-warning';
      } else {
        return 'highlight-info';
      }
    };

    WindowPanelView.prototype.populate = function() {
      return this.updateWindowLoadTime();
    };

    return WindowPanelView;

  })(View);

}).call(this);
