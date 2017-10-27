var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _commands = require('./commands');

var _commands2 = _interopRequireDefault(_commands);

var _statusBar = require('./status-bar');

var _statusBar2 = _interopRequireDefault(_statusBar);

var _busySignal = require('./busy-signal');

var _busySignal2 = _interopRequireDefault(_busySignal);

var _intentions = require('./intentions');

var _intentions2 = _interopRequireDefault(_intentions);

var Panel = undefined;
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
      var _this = this;

      this.idleCallbacks['delete'](obsShowPanelCB);
      if (!Panel) {
        Panel = require('./panel');
      }
      this.subscriptions.add(atom.config.observe('linter-ui-default.showPanel', function (showPanel) {
        if (showPanel && !_this.panel) {
          _this.panel = new Panel();
          _this.panel.update(_this.messages);
        } else if (!showPanel && _this.panel) {
          _this.panel.dispose();
          _this.panel = null;
        }
      }));
    }).bind(this));
    this.idleCallbacks.add(obsShowPanelCB);

    var obsShowDecorationsCB = window.requestIdleCallback((function observeShowDecorations() {
      var _this2 = this;

      this.idleCallbacks['delete'](obsShowDecorationsCB);
      if (!Editors) {
        Editors = require('./editors');
      }
      this.subscriptions.add(atom.config.observe('linter-ui-default.showDecorations', function (showDecorations) {
        if (showDecorations && !_this2.editors) {
          _this2.editors = new Editors();
          _this2.editors.update({ added: _this2.messages, removed: [], messages: _this2.messages });
        } else if (!showDecorations && _this2.editors) {
          _this2.editors.dispose();
          _this2.editors = null;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7b0JBRW9DLE1BQU07O3dCQUNyQixZQUFZOzs7O3lCQUNYLGNBQWM7Ozs7MEJBQ2IsZUFBZTs7OzswQkFDZixjQUFjOzs7O0FBR3JDLElBQUksS0FBSyxZQUFBLENBQUE7QUFDVCxJQUFJLE9BQU8sWUFBQSxDQUFBO0FBQ1gsSUFBSSxRQUFRLFlBQUEsQ0FBQTs7SUFFTixRQUFRO0FBYUQsV0FiUCxRQUFRLEdBYUU7MEJBYlYsUUFBUTs7QUFjVixRQUFJLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQTtBQUNwQixRQUFJLENBQUMsYUFBYSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUE7QUFDOUIsUUFBSSxDQUFDLE1BQU0sR0FBRyw2QkFBZ0IsQ0FBQTtBQUM5QixRQUFJLENBQUMsUUFBUSxHQUFHLDJCQUFjLENBQUE7QUFDOUIsUUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUE7QUFDbEIsUUFBSSxDQUFDLFNBQVMsR0FBRyw0QkFBZSxDQUFBO0FBQ2hDLFFBQUksQ0FBQyxVQUFVLEdBQUcsNkJBQWdCLENBQUE7QUFDbEMsUUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQTs7QUFFOUMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBQ25DLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUNyQyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUE7O0FBRXRDLFFBQU0sY0FBYyxHQUFHLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBLFNBQVMsZ0JBQWdCLEdBQUc7OztBQUM1RSxVQUFJLENBQUMsYUFBYSxVQUFPLENBQUMsY0FBYyxDQUFDLENB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QUNoQixZQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFBO09BQ3ZCO0tBQ0Y7OztTQXpHRyxRQUFROzs7QUE0R2QsTUFBTSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUEiLCJmaWxlIjoiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2xpbnRlci11aS1kZWZhdWx0L2xpYi9tYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nXG5pbXBvcnQgQ29tbWFuZHMgZnJvbSAnLi9jb21tYW5kcydcbmltcG9ydCBTdGF0dXNCYXIgZnJvbSAnLi9zdGF0dXMtYmFyJ1xuaW1wb3J0IEJ1c3lTaWduYWwgZnJvbSAnLi9idXN5LXNpZ25hbCdcbmltcG9ydCBJbnRlbnRpb25zIGZyb20gJy4vaW50ZW50aW9ucydcbmltcG9ydCB0eXBlIHsgTGludGVyLCBMaW50ZXJNZXNzYWdlLCBNZXNzYWdlc1BhdGNoIH0gZnJvbSAnLi90eXBlcydcblxubGV0IFBhbmVsXG5sZXQgRWRpdG9yc1xubGV0IFRyZWVWaWV3XG5cbmNsYXNzIExpbnRlclVJIHtcbiAgbmFtZTogc3RyaW5nO1xuICBwYW5lbDogP1BhbmVsO1xuICBzaWduYWw6IEJ1c3lTaWduYWw7XG4gIGVkaXRvcnM6ID9FZGl0b3JzO1xuICB0cmVldmlldzogVHJlZVZpZXc7XG4gIGNvbW1hbmRzOiBDb21tYW5kcztcbiAgbWVzc2FnZXM6IEFycmF5PExpbnRlck1lc3NhZ2U+O1xuICBzdGF0dXNCYXI6IFN0YXR1c0JhcjtcbiAgaW50ZW50aW9uczogSW50ZW50aW9ucztcbiAgc3Vic2NyaXB0aW9uczogQ29tcG9zaXRlRGlzcG9zYWJsZTtcbiAgaWRsZUNhbGxiYWNrczogU2V0PG51bWJlcj47XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5uYW1lID0gJ0xpbnRlcidcbiAgICB0aGlzLmlkbGVDYWxsYmFja3MgPSBuZXcgU2V0KClcbiAgICB0aGlzLnNpZ25hbCA9IG5ldyBCdXN5U2lnbmFsKClcbiAgICB0aGlzLmNvbW1hbmRzID0gbmV3IENvbW1hbmRzKClcbiAgICB0aGlzLm1lc3NhZ2VzID0gW11cbiAgICB0aGlzLnN0YXR1c0JhciA9IG5ldyBTdGF0dXNCYXIoKVxuICAgIHRoaXMuaW50ZW50aW9ucyA9IG5ldyBJbnRlbnRpb25zKClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuc2lnbmFsKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5jb21tYW5kcylcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuc3RhdHVzQmFyKVxuXG4gICAgY29uc3Qgb2JzU2hvd1BhbmVsQ0IgPSB3aW5kb3cucmVxdWVzdElkbGVDYWxsYmFjayhmdW5jdGlvbiBvYnNlcnZlU2hvd1BhbmVsKCkge1xuICAgICAgdGhpcy5pZGxlQ2FsbGJhY2tzLmRlbGV0ZShvYnNTaG93UGFuZWxDQilcbiAgICAgIGlmICghUGFuZWwpIHtcbiAgICAgICAgUGFuZWwgPSByZXF1aXJlKCcuL3BhbmVsJylcbiAgICAgIH1cbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLXVpLWRlZmF1bHQuc2hvd1BhbmVsJywgKHNob3dQYW5lbCkgPT4ge1xuICAgICAgICBpZiAoc2hvd1BhbmVsICYmICF0aGlzLnBhbmVsKSB7XG4gICAgICAgICAgdGhpcy5wYW5lbCA9IG5ldyBQYW5lbCgpXG4gICAgICAgICAgdGhpcy5wYW5lbC51cGRhdGUodGhpcy5tZXNzYWdlcylcbiAgICAgICAgfSBlbHNlIGlmICghc2hvd1BhbmVsICYmIHRoaXMucGFuZWwpIHtcbiAgICAgICAgICB0aGlzLnBhbmVsLmRpc3Bvc2UoKVxuICAgICAgICAgIHRoaXMucGFuZWwgPSBudWxsXG4gICAgICAgIH1cbiAgICAgIH0pKVxuICAgIH0uYmluZCh0aGlzKSlcbiAgICB0aGlzLmlkbGVDYWxsYmFja3MuYWRkKG9ic1Nob3dQYW5lbENCKVxuXG4gICAgY29uc3Qgb2JzU2hvd0RlY29yYXRpb25zQ0IgPSB3aW5kb3cucmVxdWVzdElkbGVDYWxsYmFjayhmdW5jdGlvbiBvYnNlcnZlU2hvd0RlY29yYXRpb25zKCkge1xuICAgICAgdGhpcy5pZGxlQ2FsbGJhY2tzLmRlbGV0ZShvYnNTaG93RGVjb3JhdGlvbnNDQilcbiAgICAgIGlmICghRWRpdG9ycykge1xuICAgICAgICBFZGl0b3JzID0gcmVxdWlyZSgnLi9lZGl0b3JzJylcbiAgICAgIH1cbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLXVpLWRlZmF1bHQuc2hvd0RlY29yYXRpb25zJywgKHNob3dEZWNvcmF0aW9ucykgPT4ge1xuICAgICAgICBpZiAoc2hvd0RlY29yYXRpb25zICYmICF0aGlzLmVkaXRvcnMpIHtcbiAgICAgICAgICB0aGlzLmVkaXRvcnMgPSBuZXcgRWRpdG9ycygpXG4gICAgICAgICAgdGhpcy5lZGl0b3JzLnVwZGF0ZSh7IGFkZGVkOiB0aGlzLm1lc3NhZ2VzLCByZW1vdmVkOiBbXSwgbWVzc2FnZXM6IHRoaXMubWVzc2FnZXMgfSlcbiAgICAgICAgfSBlbHNlIGlmICghc2hvd0RlY29yYXRpb25zICYmIHRoaXMuZWRpdG9ycykge1xuICAgICAgICAgIHRoaXMuZWRpdG9ycy5kaXNwb3NlKClcbiAgICAgICAgICB0aGlzLmVkaXRvcnMgPSBudWxsXG4gICAgICAgIH1cbiAgICAgIH0pKVxuICAgIH0uYmluZCh0aGlzKSlcbiAgICB0aGlzLmlkbGVDYWxsYmFja3MuYWRkKG9ic1Nob3dEZWNvcmF0aW9uc0NCKVxuICB9XG4gIHJlbmRlcihkaWZmZXJlbmNlOiBNZXNzYWdlc1BhdGNoKSB7XG4gICAgY29uc3QgZWRpdG9ycyA9IHRoaXMuZWRpdG9yc1xuXG4gICAgdGhpcy5tZXNzYWdlcyA9IGRpZmZlcmVuY2UubWVzc2FnZXNcbiAgICBpZiAoZWRpdG9ycykge1xuICAgICAgaWYgKGVkaXRvcnMuaXNGaXJzdFJlbmRlcigpKSB7XG4gICAgICAgIGVkaXRvcnMudXBkYXRlKHsgYWRkZWQ6IGRpZmZlcmVuY2UubWVzc2FnZXMsIHJlbW92ZWQ6IFtdLCBtZXNzYWdlczogZGlmZmVyZW5jZS5tZXNzYWdlcyB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWRpdG9ycy51cGRhdGUoZGlmZmVyZW5jZSlcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gSW5pdGlhbGl6ZSB0aGUgVHJlZVZpZXcgc3Vic2NyaXB0aW9uIGlmIG5lY2Vzc2FyeVxuICAgIGlmICghdGhpcy50cmVldmlldykge1xuICAgICAgaWYgKCFUcmVlVmlldykge1xuICAgICAgICBUcmVlVmlldyA9IHJlcXVpcmUoJy4vdHJlZS12aWV3JylcbiAgICAgIH1cbiAgICAgIHRoaXMudHJlZXZpZXcgPSBuZXcgVHJlZVZpZXcoKVxuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLnRyZWV2aWV3KVxuICAgIH1cbiAgICB0aGlzLnRyZWV2aWV3LnVwZGF0ZShkaWZmZXJlbmNlLm1lc3NhZ2VzKVxuXG4gICAgaWYgKHRoaXMucGFuZWwpIHtcbiAgICAgIHRoaXMucGFuZWwudXBkYXRlKGRpZmZlcmVuY2UubWVzc2FnZXMpXG4gICAgfVxuICAgIHRoaXMuY29tbWFuZHMudXBkYXRlKGRpZmZlcmVuY2UubWVzc2FnZXMpXG4gICAgdGhpcy5pbnRlbnRpb25zLnVwZGF0ZShkaWZmZXJlbmNlLm1lc3NhZ2VzKVxuICAgIHRoaXMuc3RhdHVzQmFyLnVwZGF0ZShkaWZmZXJlbmNlLm1lc3NhZ2VzKVxuICB9XG4gIGRpZEJlZ2luTGludGluZyhsaW50ZXI6IExpbnRlciwgZmlsZVBhdGg6IHN0cmluZykge1xuICAgIHRoaXMuc2lnbmFsLmRpZEJlZ2luTGludGluZyhsaW50ZXIsIGZpbGVQYXRoKVxuICB9XG4gIGRpZEZpbmlzaExpbnRpbmcobGludGVyOiBMaW50ZXIsIGZpbGVQYXRoOiBzdHJpbmcpIHtcbiAgICB0aGlzLnNpZ25hbC5kaWRGaW5pc2hMaW50aW5nKGxpbnRlciwgZmlsZVBhdGgpXG4gIH1cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLmlkbGVDYWxsYmFja3MuZm9yRWFjaChjYWxsYmFja0lEID0+IHdpbmRvdy5jYW5jZWxJZGxlQ2FsbGJhY2soY2FsbGJhY2tJRCkpXG4gICAgdGhpcy5pZGxlQ2FsbGJhY2tzLmNsZWFyKClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgaWYgKHRoaXMucGFuZWwpIHtcbiAgICAgIHRoaXMucGFuZWwuZGlzcG9zZSgpXG4gICAgfVxuICAgIGlmICh0aGlzLmVkaXRvcnMpIHtcbiAgICAgIHRoaXMuZWRpdG9ycy5kaXNwb3NlKClcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBMaW50ZXJVSVxuIl19