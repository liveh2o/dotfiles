var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _panel = require('./panel');

var _panel2 = _interopRequireDefault(_panel);

var _commands = require('./commands');

var _commands2 = _interopRequireDefault(_commands);

var _statusBar = require('./status-bar');

var _statusBar2 = _interopRequireDefault(_statusBar);

var _busySignal = require('./busy-signal');

var _busySignal2 = _interopRequireDefault(_busySignal);

var _intentions = require('./intentions');

var _intentions2 = _interopRequireDefault(_intentions);

var Editors = undefined;
var TreeView = undefined;

var LinterUI = (function () {
  function LinterUI() {
    _classCallCheck(this, LinterUI);

    this.name = 'Linter';
    this.idleCallbacks = new Set();
    this.signal = new _busySignal2['default']();
    this.commands = new _commands2['default']();
    this.messages = [];
    this.statusBar = new _statusBar2['default']();
    this.intentions = new _intentions2['default']();
    this.subscriptions = new _atom.CompositeDisposable();

    this.subscriptions.add(this.signal);
    this.subscriptions.add(this.commands);
    this.subscriptions.add(this.statusBar);

    var obsShowPanelCB = window.requestIdleCallback((function observeShowPanel() {
      this.idleCallbacks['delete'](obsShowPanelCB);
      this.panel = new _panel2['default']();
      this.panel.update(this.messages);
    }).bind(this));
    this.idleCallbacks.add(obsShowPanelCB);

    var obsShowDecorationsCB = window.requestIdleCallback((function observeShowDecorations() {
      var _this = this;

      this.idleCallbacks['delete'](obsShowDecorationsCB);
      if (!Editors) {
        Editors = require('./editors');
      }
      this.subscriptions.add(atom.config.observe('linter-ui-default.showDecorations', function (showDecorations) {
        if (showDecorations && !_this.editors) {
          _this.editors = new Editors();
          _this.editors.update({ added: _this.messages, removed: [], messages: _this.messages });
        } else if (!showDecorations && _this.editors) {
          _this.editors.dispose();
          _this.editors = null;
        }
      }));
    }).bind(this));
    this.idleCallbacks.add(obsShowDecorationsCB);
  }

  _createClass(LinterUI, [{
    key: 'render',
    value: function render(difference) {
      var editors = this.editors;

      this.messages = difference.messages;
      if (editors) {
        if (editors.isFirstRender()) {
          editors.update({ added: difference.messages, removed: [], messages: difference.messages });
        } else {
          editors.update(difference);
        }
      }
      // Initialize the TreeView subscription if necessary
      if (!this.treeview) {
        if (!TreeView) {
          TreeView = require('./tree-view');
        }
        this.treeview = new TreeView();
        this.subscriptions.add(this.treeview);
      }
      this.treeview.update(difference.messages);

      if (this.panel) {
        this.panel.update(difference.messages);
      }
      this.commands.update(difference.messages);
      this.intentions.update(difference.messages);
      this.statusBar.update(difference.messages);
    }
  }, {
    key: 'didBeginLinting',
    value: function didBeginLinting(linter, filePath) {
      this.signal.didBeginLinting(linter, filePath);
    }
  }, {
    key: 'didFinishLinting',
    value: function didFinishLinting(linter, filePath) {
      this.signal.didFinishLinting(linter, filePath);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.idleCallbacks.forEach(function (callbackID) {
        return window.cancelIdleCallback(callbackID);
      });
      this.idleCallbacks.clear();
      this.subscriptions.dispose();
      if (this.panel) {
        this.panel.dispose();
      }
      if (this.editors) {
        this.editors.dispose();
      }
    }
  }]);

  return LinterUI;
})();

module.exports = LinterUI;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7b0JBRW9DLE1BQU07O3FCQUN4QixTQUFTOzs7O3dCQUNOLFlBQVk7Ozs7eUJBQ1gsY0FBYzs7OzswQkFDYixlQUFlOzs7OzBCQUNmLGNBQWM7Ozs7QUFHckMsSUFBSSxPQUFPLFlBQUEsQ0FBQTtBQUNYLElBQUksUUFBUSxZQUFBLENBQUE7O0lBRU4sUUFBUTtBQWFELFdBYlAsUUFBUSxHQWFFOzBCQWJWLFFBQVE7O0FBY1YsUUFBSSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUE7QUFDcEIsUUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBO0FBQzlCLFFBQUksQ0FBQyxNQUFNLEdBQUcsNkJBQWdCLENBQUE7QUFDOUIsUUFBSSxDQUFDLFFBQVEsR0FBRywyQkFBYyxDQUFBO0FBQzlCLFFBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFBO0FBQ2xCLFFBQUksQ0FBQyxTQUFTLEdBQUcsNEJBQWUsQ0FBQTtBQUNoQyxRQUFJLENBQUMsVUFBVSxHQUFHLDZCQUFnQixDQUFBO0FBQ2xDLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7O0FBRTlDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUNuQyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7QUFDckMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFBOztBQUV0QyxRQUFNLGNBQWMsR0FBRyxNQUFNLENBQUMsbUJBQW1CLENBQUMsQ0FBQSxTQUFTLGdCQUFnQixHQUFHO0FBQzVFLFVBQUksQ0FBQyxhQUFhLFVBQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQTtBQUN6QyxVQUFJ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LE1BQU0sQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUE7S0FDM0M7OztXQUNjLHlCQUFDLE1BQWMsRUFBRSxRQUFnQixFQUFFO0FBQ2hELFVBQUksQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQTtLQUM5Qzs7O1dBQ2UsMEJBQUMsTUFBYyxFQUFFLFFBQWdCLEVBQUU7QUFDakQsVUFBSSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUE7S0FDL0M7OztXQUNNLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsVUFBQSxVQUFVO2VBQUksTUFBTSxDQUFDLGtCQUFrQixDQUFDLFVBQVUsQ0FBQztPQUFBLENBQUMsQ0FBQTtBQUMvRSxVQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxDQUFBO0FBQzFCLFVBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDNUIsVUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO0FBQ2QsWUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQTtPQUNyQjtBQUNELFVBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtBQUNoQixZQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFBO09BQ3ZCO0tBQ0Y7OztTQS9GRyxRQUFROzs7QUFrR2QsTUFBTSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUEiLCJmaWxlIjoiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2xpbnRlci11aS1kZWZhdWx0L2xpYi9tYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nXG5pbXBvcnQgUGFuZWwgZnJvbSAnLi9wYW5lbCdcbmltcG9ydCBDb21tYW5kcyBmcm9tICcuL2NvbW1hbmRzJ1xuaW1wb3J0IFN0YXR1c0JhciBmcm9tICcuL3N0YXR1cy1iYXInXG5pbXBvcnQgQnVzeVNpZ25hbCBmcm9tICcuL2J1c3ktc2lnbmFsJ1xuaW1wb3J0IEludGVudGlvbnMgZnJvbSAnLi9pbnRlbnRpb25zJ1xuaW1wb3J0IHR5cGUgeyBMaW50ZXIsIExpbnRlck1lc3NhZ2UsIE1lc3NhZ2VzUGF0Y2ggfSBmcm9tICcuL3R5cGVzJ1xuXG5sZXQgRWRpdG9yc1xubGV0IFRyZWVWaWV3XG5cbmNsYXNzIExpbnRlclVJIHtcbiAgbmFtZTogc3RyaW5nO1xuICBwYW5lbDogUGFuZWw7XG4gIHNpZ25hbDogQnVzeVNpZ25hbDtcbiAgZWRpdG9yczogP0VkaXRvcnM7XG4gIHRyZWV2aWV3OiBUcmVlVmlldztcbiAgY29tbWFuZHM6IENvbW1hbmRzO1xuICBtZXNzYWdlczogQXJyYXk8TGludGVyTWVzc2FnZT47XG4gIHN0YXR1c0JhcjogU3RhdHVzQmFyO1xuICBpbnRlbnRpb25zOiBJbnRlbnRpb25zO1xuICBzdWJzY3JpcHRpb25zOiBDb21wb3NpdGVEaXNwb3NhYmxlO1xuICBpZGxlQ2FsbGJhY2tzOiBTZXQ8bnVtYmVyPjtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLm5hbWUgPSAnTGludGVyJ1xuICAgIHRoaXMuaWRsZUNhbGxiYWNrcyA9IG5ldyBTZXQoKVxuICAgIHRoaXMuc2lnbmFsID0gbmV3IEJ1c3lTaWduYWwoKVxuICAgIHRoaXMuY29tbWFuZHMgPSBuZXcgQ29tbWFuZHMoKVxuICAgIHRoaXMubWVzc2FnZXMgPSBbXVxuICAgIHRoaXMuc3RhdHVzQmFyID0gbmV3IFN0YXR1c0JhcigpXG4gICAgdGhpcy5pbnRlbnRpb25zID0gbmV3IEludGVudGlvbnMoKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5zaWduYWwpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLmNvbW1hbmRzKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5zdGF0dXNCYXIpXG5cbiAgICBjb25zdCBvYnNTaG93UGFuZWxDQiA9IHdpbmRvdy5yZXF1ZXN0SWRsZUNhbGxiYWNrKGZ1bmN0aW9uIG9ic2VydmVTaG93UGFuZWwoKSB7XG4gICAgICB0aGlzLmlkbGVDYWxsYmFja3MuZGVsZXRlKG9ic1Nob3dQYW5lbENCKVxuICAgICAgdGhpcy5wYW5lbCA9IG5ldyBQYW5lbCgpXG4gICAgICB0aGlzLnBhbmVsLnVwZGF0ZSh0aGlzLm1lc3NhZ2VzKVxuICAgIH0uYmluZCh0aGlzKSlcbiAgICB0aGlzLmlkbGVDYWxsYmFja3MuYWRkKG9ic1Nob3dQYW5lbENCKVxuXG4gICAgY29uc3Qgb2JzU2hvd0RlY29yYXRpb25zQ0IgPSB3aW5kb3cucmVxdWVzdElkbGVDYWxsYmFjayhmdW5jdGlvbiBvYnNlcnZlU2hvd0RlY29yYXRpb25zKCkge1xuICAgICAgdGhpcy5pZGxlQ2FsbGJhY2tzLmRlbGV0ZShvYnNTaG93RGVjb3JhdGlvbnNDQilcbiAgICAgIGlmICghRWRpdG9ycykge1xuICAgICAgICBFZGl0b3JzID0gcmVxdWlyZSgnLi9lZGl0b3JzJylcbiAgICAgIH1cbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLXVpLWRlZmF1bHQuc2hvd0RlY29yYXRpb25zJywgKHNob3dEZWNvcmF0aW9ucykgPT4ge1xuICAgICAgICBpZiAoc2hvd0RlY29yYXRpb25zICYmICF0aGlzLmVkaXRvcnMpIHtcbiAgICAgICAgICB0aGlzLmVkaXRvcnMgPSBuZXcgRWRpdG9ycygpXG4gICAgICAgICAgdGhpcy5lZGl0b3JzLnVwZGF0ZSh7IGFkZGVkOiB0aGlzLm1lc3NhZ2VzLCByZW1vdmVkOiBbXSwgbWVzc2FnZXM6IHRoaXMubWVzc2FnZXMgfSlcbiAgICAgICAgfSBlbHNlIGlmICghc2hvd0RlY29yYXRpb25zICYmIHRoaXMuZWRpdG9ycykge1xuICAgICAgICAgIHRoaXMuZWRpdG9ycy5kaXNwb3NlKClcbiAgICAgICAgICB0aGlzLmVkaXRvcnMgPSBudWxsXG4gICAgICAgIH1cbiAgICAgIH0pKVxuICAgIH0uYmluZCh0aGlzKSlcbiAgICB0aGlzLmlkbGVDYWxsYmFja3MuYWRkKG9ic1Nob3dEZWNvcmF0aW9uc0NCKVxuICB9XG4gIHJlbmRlcihkaWZmZXJlbmNlOiBNZXNzYWdlc1BhdGNoKSB7XG4gICAgY29uc3QgZWRpdG9ycyA9IHRoaXMuZWRpdG9yc1xuXG4gICAgdGhpcy5tZXNzYWdlcyA9IGRpZmZlcmVuY2UubWVzc2FnZXNcbiAgICBpZiAoZWRpdG9ycykge1xuICAgICAgaWYgKGVkaXRvcnMuaXNGaXJzdFJlbmRlcigpKSB7XG4gICAgICAgIGVkaXRvcnMudXBkYXRlKHsgYWRkZWQ6IGRpZmZlcmVuY2UubWVzc2FnZXMsIHJlbW92ZWQ6IFtdLCBtZXNzYWdlczogZGlmZmVyZW5jZS5tZXNzYWdlcyB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWRpdG9ycy51cGRhdGUoZGlmZmVyZW5jZSlcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gSW5pdGlhbGl6ZSB0aGUgVHJlZVZpZXcgc3Vic2NyaXB0aW9uIGlmIG5lY2Vzc2FyeVxuICAgIGlmICghdGhpcy50cmVldmlldykge1xuICAgICAgaWYgKCFUcmVlVmlldykge1xuICAgICAgICBUcmVlVmlldyA9IHJlcXVpcmUoJy4vdHJlZS12aWV3JylcbiAgICAgIH1cbiAgICAgIHRoaXMudHJlZXZpZXcgPSBuZXcgVHJlZVZpZXcoKVxuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLnRyZWV2aWV3KVxuICAgIH1cbiAgICB0aGlzLnRyZWV2aWV3LnVwZGF0ZShkaWZmZXJlbmNlLm1lc3NhZ2VzKVxuXG4gICAgaWYgKHRoaXMucGFuZWwpIHtcbiAgICAgIHRoaXMucGFuZWwudXBkYXRlKGRpZmZlcmVuY2UubWVzc2FnZXMpXG4gICAgfVxuICAgIHRoaXMuY29tbWFuZHMudXBkYXRlKGRpZmZlcmVuY2UubWVzc2FnZXMpXG4gICAgdGhpcy5pbnRlbnRpb25zLnVwZGF0ZShkaWZmZXJlbmNlLm1lc3NhZ2VzKVxuICAgIHRoaXMuc3RhdHVzQmFyLnVwZGF0ZShkaWZmZXJlbmNlLm1lc3NhZ2VzKVxuICB9XG4gIGRpZEJlZ2luTGludGluZyhsaW50ZXI6IExpbnRlciwgZmlsZVBhdGg6IHN0cmluZykge1xuICAgIHRoaXMuc2lnbmFsLmRpZEJlZ2luTGludGluZyhsaW50ZXIsIGZpbGVQYXRoKVxuICB9XG4gIGRpZEZpbmlzaExpbnRpbmcobGludGVyOiBMaW50ZXIsIGZpbGVQYXRoOiBzdHJpbmcpIHtcbiAgICB0aGlzLnNpZ25hbC5kaWRGaW5pc2hMaW50aW5nKGxpbnRlciwgZmlsZVBhdGgpXG4gIH1cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLmlkbGVDYWxsYmFja3MuZm9yRWFjaChjYWxsYmFja0lEID0+IHdpbmRvdy5jYW5jZWxJZGxlQ2FsbGJhY2soY2FsbGJhY2tJRCkpXG4gICAgdGhpcy5pZGxlQ2FsbGJhY2tzLmNsZWFyKClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgaWYgKHRoaXMucGFuZWwpIHtcbiAgICAgIHRoaXMucGFuZWwuZGlzcG9zZSgpXG4gICAgfVxuICAgIGlmICh0aGlzLmVkaXRvcnMpIHtcbiAgICAgIHRoaXMuZWRpdG9ycy5kaXNwb3NlKClcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBMaW50ZXJVSVxuIl19