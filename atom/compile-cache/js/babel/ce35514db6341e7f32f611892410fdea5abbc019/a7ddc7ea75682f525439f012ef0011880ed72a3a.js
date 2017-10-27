Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _sbEventKit = require('sb-event-kit');

var _panel = require('./panel');

var _panel2 = _interopRequireDefault(_panel);

var _editors = require('./editors');

var _editors2 = _interopRequireDefault(_editors);

var _treeView = require('./tree-view');

var _treeView2 = _interopRequireDefault(_treeView);

var _commands = require('./commands');

var _commands2 = _interopRequireDefault(_commands);

var _statusBar = require('./status-bar');

var _statusBar2 = _interopRequireDefault(_statusBar);

var _busySignal = require('./busy-signal');

var _busySignal2 = _interopRequireDefault(_busySignal);

var _intentions = require('./intentions');

var _intentions2 = _interopRequireDefault(_intentions);

var LinterUI = (function () {
  function LinterUI() {
    var _this = this;

    _classCallCheck(this, LinterUI);

    this.name = 'Linter';
    this.signal = new _busySignal2['default']();
    this.treeview = new _treeView2['default']();
    this.commands = new _commands2['default']();
    this.messages = [];
    this.statusBar = new _statusBar2['default']();
    this.intentions = new _intentions2['default']();
    this.subscriptions = new _sbEventKit.CompositeDisposable();

    this.subscriptions.add(this.signal);
    this.subscriptions.add(this.treeview);
    this.subscriptions.add(this.commands);
    this.subscriptions.add(this.statusBar);

    this.subscriptions.add(atom.config.observe('linter-ui-default.showPanel', function (showPanel) {
      if (showPanel && !_this.panel) {
        _this.panel = new _panel2['default']();
        _this.panel.update(_this.messages);
      } else if (!showPanel && _this.panel) {
        _this.panel.dispose();
        _this.panel = null;
      }
    }));
    this.subscriptions.add(atom.config.observe('linter-ui-default.showDecorations', function (showDecorations) {
      if (showDecorations && !_this.editors) {
        _this.editors = new _editors2['default']();
        _this.editors.update({ added: _this.messages, removed: [], messages: _this.messages });
      } else if (!showDecorations && _this.editors) {
        _this.editors.dispose();
        _this.editors = null;
      }
    }));
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
      if (this.panel) {
        this.panel.update(difference.messages);
      }
      this.commands.update(difference.messages);
      this.treeview.update(difference.messages);
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

exports['default'] = LinterUI;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OzBCQUVvQyxjQUFjOztxQkFDaEMsU0FBUzs7Ozt1QkFDUCxXQUFXOzs7O3dCQUNWLGFBQWE7Ozs7d0JBQ2IsWUFBWTs7Ozt5QkFDWCxjQUFjOzs7OzBCQUNiLGVBQWU7Ozs7MEJBQ2YsY0FBYzs7OztJQUdoQixRQUFRO0FBWWhCLFdBWlEsUUFBUSxHQVliOzs7MEJBWkssUUFBUTs7QUFhekIsUUFBSSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUE7QUFDcEIsUUFBSSxDQUFDLE1BQU0sR0FBRyw2QkFBZ0IsQ0FBQTtBQUM5QixRQUFJLENBQUMsUUFBUSxHQUFHLDJCQUFjLENBQUE7QUFDOUIsUUFBSSxDQUFDLFFBQVEsR0FBRywyQkFBYyxDQUFBO0FBQzlCLFFBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFBO0FBQ2xCLFFBQUksQ0FBQyxTQUFTLEdBQUcsNEJBQWUsQ0FBQTtBQUNoQyxRQUFJLENBQUMsVUFBVSxHQUFHLDZCQUFnQixDQUFBO0FBQ2xDLFFBQUksQ0FBQyxhQUFhLEdBQUcscUNBQXlCLENBQUE7O0FBRTlDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUNuQyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7QUFDckMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQ3JDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQTs7QUFFdEMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsNkJBQTZCLEVBQUUsVUFBQyxT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QUFPLEVBQUUsQ0FBQTtPQUN2QjtLQUNGOzs7U0EvRWtCLFFBQVE7OztxQkFBUixRQUFRIiwiZmlsZSI6Ii9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXItdWktZGVmYXVsdC9saWIvbWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdzYi1ldmVudC1raXQnXG5pbXBvcnQgUGFuZWwgZnJvbSAnLi9wYW5lbCdcbmltcG9ydCBFZGl0b3JzIGZyb20gJy4vZWRpdG9ycydcbmltcG9ydCBUcmVlVmlldyBmcm9tICcuL3RyZWUtdmlldydcbmltcG9ydCBDb21tYW5kcyBmcm9tICcuL2NvbW1hbmRzJ1xuaW1wb3J0IFN0YXR1c0JhciBmcm9tICcuL3N0YXR1cy1iYXInXG5pbXBvcnQgQnVzeVNpZ25hbCBmcm9tICcuL2J1c3ktc2lnbmFsJ1xuaW1wb3J0IEludGVudGlvbnMgZnJvbSAnLi9pbnRlbnRpb25zJ1xuaW1wb3J0IHR5cGUgeyBMaW50ZXIsIExpbnRlck1lc3NhZ2UsIE1lc3NhZ2VzUGF0Y2ggfSBmcm9tICcuL3R5cGVzJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMaW50ZXJVSSB7XG4gIG5hbWU6IHN0cmluZztcbiAgcGFuZWw6ID9QYW5lbDtcbiAgc2lnbmFsOiBCdXN5U2lnbmFsO1xuICBlZGl0b3JzOiA/RWRpdG9ycztcbiAgdHJlZXZpZXc6IFRyZWVWaWV3O1xuICBjb21tYW5kczogQ29tbWFuZHM7XG4gIG1lc3NhZ2VzOiBBcnJheTxMaW50ZXJNZXNzYWdlPjtcbiAgc3RhdHVzQmFyOiBTdGF0dXNCYXI7XG4gIGludGVudGlvbnM6IEludGVudGlvbnM7XG4gIHN1YnNjcmlwdGlvbnM6IENvbXBvc2l0ZURpc3Bvc2FibGU7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5uYW1lID0gJ0xpbnRlcidcbiAgICB0aGlzLnNpZ25hbCA9IG5ldyBCdXN5U2lnbmFsKClcbiAgICB0aGlzLnRyZWV2aWV3ID0gbmV3IFRyZWVWaWV3KClcbiAgICB0aGlzLmNvbW1hbmRzID0gbmV3IENvbW1hbmRzKClcbiAgICB0aGlzLm1lc3NhZ2VzID0gW11cbiAgICB0aGlzLnN0YXR1c0JhciA9IG5ldyBTdGF0dXNCYXIoKVxuICAgIHRoaXMuaW50ZW50aW9ucyA9IG5ldyBJbnRlbnRpb25zKClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuc2lnbmFsKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy50cmVldmlldylcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuY29tbWFuZHMpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLnN0YXR1c0JhcilcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLXVpLWRlZmF1bHQuc2hvd1BhbmVsJywgKHNob3dQYW5lbCkgPT4ge1xuICAgICAgaWYgKHNob3dQYW5lbCAmJiAhdGhpcy5wYW5lbCkge1xuICAgICAgICB0aGlzLnBhbmVsID0gbmV3IFBhbmVsKClcbiAgICAgICAgdGhpcy5wYW5lbC51cGRhdGUodGhpcy5tZXNzYWdlcylcbiAgICAgIH0gZWxzZSBpZiAoIXNob3dQYW5lbCAmJiB0aGlzLnBhbmVsKSB7XG4gICAgICAgIHRoaXMucGFuZWwuZGlzcG9zZSgpXG4gICAgICAgIHRoaXMucGFuZWwgPSBudWxsXG4gICAgICB9XG4gICAgfSkpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItdWktZGVmYXVsdC5zaG93RGVjb3JhdGlvbnMnLCAoc2hvd0RlY29yYXRpb25zKSA9PiB7XG4gICAgICBpZiAoc2hvd0RlY29yYXRpb25zICYmICF0aGlzLmVkaXRvcnMpIHtcbiAgICAgICAgdGhpcy5lZGl0b3JzID0gbmV3IEVkaXRvcnMoKVxuICAgICAgICB0aGlzLmVkaXRvcnMudXBkYXRlKHsgYWRkZWQ6IHRoaXMubWVzc2FnZXMsIHJlbW92ZWQ6IFtdLCBtZXNzYWdlczogdGhpcy5tZXNzYWdlcyB9KVxuICAgICAgfSBlbHNlIGlmICghc2hvd0RlY29yYXRpb25zICYmIHRoaXMuZWRpdG9ycykge1xuICAgICAgICB0aGlzLmVkaXRvcnMuZGlzcG9zZSgpXG4gICAgICAgIHRoaXMuZWRpdG9ycyA9IG51bGxcbiAgICAgIH1cbiAgICB9KSlcbiAgfVxuICByZW5kZXIoZGlmZmVyZW5jZTogTWVzc2FnZXNQYXRjaCkge1xuICAgIGNvbnN0IGVkaXRvcnMgPSB0aGlzLmVkaXRvcnNcblxuICAgIHRoaXMubWVzc2FnZXMgPSBkaWZmZXJlbmNlLm1lc3NhZ2VzXG4gICAgaWYgKGVkaXRvcnMpIHtcbiAgICAgIGlmIChlZGl0b3JzLmlzRmlyc3RSZW5kZXIoKSkge1xuICAgICAgICBlZGl0b3JzLnVwZGF0ZSh7IGFkZGVkOiBkaWZmZXJlbmNlLm1lc3NhZ2VzLCByZW1vdmVkOiBbXSwgbWVzc2FnZXM6IGRpZmZlcmVuY2UubWVzc2FnZXMgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVkaXRvcnMudXBkYXRlKGRpZmZlcmVuY2UpXG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0aGlzLnBhbmVsKSB7XG4gICAgICB0aGlzLnBhbmVsLnVwZGF0ZShkaWZmZXJlbmNlLm1lc3NhZ2VzKVxuICAgIH1cbiAgICB0aGlzLmNvbW1hbmRzLnVwZGF0ZShkaWZmZXJlbmNlLm1lc3NhZ2VzKVxuICAgIHRoaXMudHJlZXZpZXcudXBkYXRlKGRpZmZlcmVuY2UubWVzc2FnZXMpXG4gICAgdGhpcy5pbnRlbnRpb25zLnVwZGF0ZShkaWZmZXJlbmNlLm1lc3NhZ2VzKVxuICAgIHRoaXMuc3RhdHVzQmFyLnVwZGF0ZShkaWZmZXJlbmNlLm1lc3NhZ2VzKVxuICB9XG4gIGRpZEJlZ2luTGludGluZyhsaW50ZXI6IExpbnRlciwgZmlsZVBhdGg6IHN0cmluZykge1xuICAgIHRoaXMuc2lnbmFsLmRpZEJlZ2luTGludGluZyhsaW50ZXIsIGZpbGVQYXRoKVxuICB9XG4gIGRpZEZpbmlzaExpbnRpbmcobGludGVyOiBMaW50ZXIsIGZpbGVQYXRoOiBzdHJpbmcpIHtcbiAgICB0aGlzLnNpZ25hbC5kaWRGaW5pc2hMaW50aW5nKGxpbnRlciwgZmlsZVBhdGgpXG4gIH1cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgaWYgKHRoaXMucGFuZWwpIHtcbiAgICAgIHRoaXMucGFuZWwuZGlzcG9zZSgpXG4gICAgfVxuICAgIGlmICh0aGlzLmVkaXRvcnMpIHtcbiAgICAgIHRoaXMuZWRpdG9ycy5kaXNwb3NlKClcbiAgICB9XG4gIH1cbn1cbiJdfQ==