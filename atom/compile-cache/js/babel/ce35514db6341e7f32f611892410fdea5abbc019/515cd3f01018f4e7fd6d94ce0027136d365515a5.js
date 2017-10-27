Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _editorLinter = require('./editor-linter');

var _editorLinter2 = _interopRequireDefault(_editorLinter);

var EditorRegistry = (function () {
  function EditorRegistry() {
    var _this = this;

    _classCallCheck(this, EditorRegistry);

    this.emitter = new _atom.Emitter();
    this.subscriptions = new _atom.CompositeDisposable();
    this.editorLinters = new Map();

    this.subscriptions.add(this.emitter);
    this.subscriptions.add(atom.config.observe('linter.lintOnOpen', function (lintOnOpen) {
      _this.lintOnOpen = lintOnOpen;
    }));
  }

  _createClass(EditorRegistry, [{
    key: 'activate',
    value: function activate() {
      var _this2 = this;

      this.subscriptions.add(atom.workspace.observeTextEditors(function (textEditor) {
        _this2.createFromTextEditor(textEditor);
      }));
    }
  }, {
    key: 'get',
    value: function get(textEditor) {
      return this.editorLinters.get(textEditor);
    }
  }, {
    key: 'createFromTextEditor',
    value: function createFromTextEditor(textEditor) {
      var _this3 = this;

      var editorLinter = this.editorLinters.get(textEditor);
      if (editorLinter) {
        return editorLinter;
      }
      editorLinter = new _editorLinter2['default'](textEditor);
      editorLinter.onDidDestroy(function () {
        _this3.editorLinters['delete'](textEditor);
      });
      this.editorLinters.set(textEditor, editorLinter);
      this.emitter.emit('observe', editorLinter);
      if (this.lintOnOpen) {
        editorLinter.lint();
      }
      return editorLinter;
    }
  }, {
    key: 'observe',
    value: function observe(callback) {
      this.editorLinters.forEach(callback);
      return this.emitter.on('observe', callback);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      for (var entry of this.editorLinters.values()) {
        entry.dispose();
      }
      this.subscriptions.dispose();
    }
  }]);

  return EditorRegistry;
})();

exports['default'] = EditorRegistry;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL2VkaXRvci1yZWdpc3RyeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O29CQUU2QyxNQUFNOzs0QkFFMUIsaUJBQWlCOzs7O0lBRXJCLGNBQWM7QUFNdEIsV0FOUSxjQUFjLEdBTW5COzs7MEJBTkssY0FBYzs7QUFPL0IsUUFBSSxDQUFDLE9BQU8sR0FBRyxtQkFBYSxDQUFBO0FBQzVCLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7QUFDOUMsUUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBOztBQUU5QixRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7QUFDcEMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsbUJBQW1CLEVBQUUsVUFBQyxVQUFVLEVBQUs7QUFDOUUsWUFBSyxVQUFVLEdBQUcsVUFBVSxDQUFBO0tBQzdCLENBQUMsQ0FBQyxDQUFBO0dBQ0o7O2VBZmtCLGNBQWM7O1dBZ0J6QixvQkFBRzs7O0FBQ1QsVUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxVQUFDLFVBQVUsRUFBSztBQUN2RSxlQUFLLG9CQUFvQixDQUFDLFVBQVUsQ0FBQyxDQUFBO09BQ3RDLENBQUMsQ0FBQyxDQUFBO0tBQ0o7OztXQUNFLGFBQUMsVUFBc0IsRUFBaUI7QUFDekMsYUFBTyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQTtLQUMxQzs7O1dBQ21CLDhCQUFDLFVBQXNCLEVBQWdCOzs7QUFDekQsVUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUE7QUFDckQsVUFBSSxZQUFZLEVBQUU7QUFDaEIsZUFBTyxZQUFZLENBQUE7T0FDcEI7QUFDRCxrQkFBWSxHQUFHLDhCQUFpQixVQUFVLENBQUMsQ0FBQTtBQUMzQyxrQkFBWSxDQUFDLFlBQVksQ0FBQyxZQUFNO0FBQzlCLGVBQUssYUFBYSxVQUFPLENBQUMsVUFBVSxDQUFDLENBQUE7T0FDdEMsQ0FBQyxDQUFBO0FBQ0YsVUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLFlBQVksQ0FBQyxDQUFBO0FBQ2hELFVBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxZQUFZLENBQUMsQ0FBQTtBQUMxQyxVQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7QUFDbkIsb0JBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQTtPQUNwQjtBQUNELGFBQU8sWUFBWSxDQUFBO0tBQ3BCOzs7V0FDTSxpQkFBQyxRQUFnRCxFQUFjO0FBQ3BFLFVBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBQ3BDLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFBO0tBQzVDOzs7V0FDTSxtQkFBRztBQUNSLFdBQUssSUFBTSxLQUFLLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsRUFBRTtBQUMvQyxhQUFLLENBQUMsT0FBTyxFQUFFLENBQUE7T0FDaEI7QUFDRCxVQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFBO0tBQzdCOzs7U0FqRGtCLGNBQWM7OztxQkFBZCxjQUFjIiwiZmlsZSI6Ii9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL2VkaXRvci1yZWdpc3RyeS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCB7IEVtaXR0ZXIsIENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdhdG9tJ1xuaW1wb3J0IHR5cGUgeyBEaXNwb3NhYmxlLCBUZXh0RWRpdG9yIH0gZnJvbSAnYXRvbSdcbmltcG9ydCBFZGl0b3JMaW50ZXIgZnJvbSAnLi9lZGl0b3ItbGludGVyJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFZGl0b3JSZWdpc3RyeSB7XG4gIGVtaXR0ZXI6IEVtaXR0ZXI7XG4gIGxpbnRPbk9wZW46IGJvb2xlYW47XG4gIHN1YnNjcmlwdGlvbnM6IENvbXBvc2l0ZURpc3Bvc2FibGU7XG4gIGVkaXRvckxpbnRlcnM6IE1hcDxUZXh0RWRpdG9yLCBFZGl0b3JMaW50ZXI+O1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgdGhpcy5lZGl0b3JMaW50ZXJzID0gbmV3IE1hcCgpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuZW1pdHRlcilcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci5saW50T25PcGVuJywgKGxpbnRPbk9wZW4pID0+IHtcbiAgICAgIHRoaXMubGludE9uT3BlbiA9IGxpbnRPbk9wZW5cbiAgICB9KSlcbiAgfVxuICBhY3RpdmF0ZSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20ud29ya3NwYWNlLm9ic2VydmVUZXh0RWRpdG9ycygodGV4dEVkaXRvcikgPT4ge1xuICAgICAgdGhpcy5jcmVhdGVGcm9tVGV4dEVkaXRvcih0ZXh0RWRpdG9yKVxuICAgIH0pKVxuICB9XG4gIGdldCh0ZXh0RWRpdG9yOiBUZXh0RWRpdG9yKTogP0VkaXRvckxpbnRlciB7XG4gICAgcmV0dXJuIHRoaXMuZWRpdG9yTGludGVycy5nZXQodGV4dEVkaXRvcilcbiAgfVxuICBjcmVhdGVGcm9tVGV4dEVkaXRvcih0ZXh0RWRpdG9yOiBUZXh0RWRpdG9yKTogRWRpdG9yTGludGVyIHtcbiAgICBsZXQgZWRpdG9yTGludGVyID0gdGhpcy5lZGl0b3JMaW50ZXJzLmdldCh0ZXh0RWRpdG9yKVxuICAgIGlmIChlZGl0b3JMaW50ZXIpIHtcbiAgICAgIHJldHVybiBlZGl0b3JMaW50ZXJcbiAgICB9XG4gICAgZWRpdG9yTGludGVyID0gbmV3IEVkaXRvckxpbnRlcih0ZXh0RWRpdG9yKVxuICAgIGVkaXRvckxpbnRlci5vbkRpZERlc3Ryb3koKCkgPT4ge1xuICAgICAgdGhpcy5lZGl0b3JMaW50ZXJzLmRlbGV0ZSh0ZXh0RWRpdG9yKVxuICAgIH0pXG4gICAgdGhpcy5lZGl0b3JMaW50ZXJzLnNldCh0ZXh0RWRpdG9yLCBlZGl0b3JMaW50ZXIpXG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ29ic2VydmUnLCBlZGl0b3JMaW50ZXIpXG4gICAgaWYgKHRoaXMubGludE9uT3Blbikge1xuICAgICAgZWRpdG9yTGludGVyLmxpbnQoKVxuICAgIH1cbiAgICByZXR1cm4gZWRpdG9yTGludGVyXG4gIH1cbiAgb2JzZXJ2ZShjYWxsYmFjazogKChlZGl0b3JMaW50ZXI6IEVkaXRvckxpbnRlcikgPT4gdm9pZCkpOiBEaXNwb3NhYmxlIHtcbiAgICB0aGlzLmVkaXRvckxpbnRlcnMuZm9yRWFjaChjYWxsYmFjaylcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdvYnNlcnZlJywgY2FsbGJhY2spXG4gIH1cbiAgZGlzcG9zZSgpIHtcbiAgICBmb3IgKGNvbnN0IGVudHJ5IG9mIHRoaXMuZWRpdG9yTGludGVycy52YWx1ZXMoKSkge1xuICAgICAgZW50cnkuZGlzcG9zZSgpXG4gICAgfVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgfVxufVxuIl19