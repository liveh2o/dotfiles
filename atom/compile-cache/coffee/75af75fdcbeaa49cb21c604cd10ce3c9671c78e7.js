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
        title: 'The time taken to rebuild the previously opened editors'
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3RpbWVjb3AvbGliL3dpbmRvdy1wYW5lbC12aWV3LmNvZmZlZSIKICBdLAogICJuYW1lcyI6IFtdLAogICJtYXBwaW5ncyI6ICJBQUFBO0FBQUEsTUFBQSxxQkFBQTtJQUFBO21TQUFBOztBQUFBLEVBQUMsT0FBUSxPQUFBLENBQVEsc0JBQVIsRUFBUixJQUFELENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osc0NBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsZUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8saUNBQVA7T0FBTCxFQUErQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUM3QyxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxPQUFBLEVBQU8sYUFBUDtXQUFMLEVBQTJCLFNBQUEsR0FBQTtBQUN6QixZQUFBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxjQUFBLE9BQUEsRUFBTyxlQUFQO2FBQUwsRUFBNkIsY0FBN0IsQ0FBQSxDQUFBO21CQUNBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxjQUFBLE9BQUEsRUFBTyxtQkFBUDthQUFMLEVBQWlDLFNBQUEsR0FBQTtBQUMvQixjQUFBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxnQkFBQSxPQUFBLEVBQU8sUUFBUDtBQUFBLGdCQUFpQixNQUFBLEVBQVEsY0FBekI7ZUFBTCxFQUE4QyxTQUFBLEdBQUE7QUFDNUMsZ0JBQUEsS0FBQyxDQUFBLElBQUQsQ0FBTTtBQUFBLGtCQUFBLE9BQUEsRUFBTyxjQUFQO2lCQUFOLEVBQTZCLGtCQUE3QixDQUFBLENBQUE7dUJBQ0EsS0FBQyxDQUFBLElBQUQsQ0FBTTtBQUFBLGtCQUFB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

//# sourceURL=/Users/ah/.atom/packages/timecop/lib/window-panel-view.coffee
