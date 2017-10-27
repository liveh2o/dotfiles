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

module.exports = EditorRegistry;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL2VkaXRvci1yZWdpc3RyeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7b0JBRTZDLE1BQU07OzRCQUUxQixpQkFBaUI7Ozs7SUFFcEMsY0FBYztBQU1QLFdBTlAsY0FBYyxHQU1KOzs7MEJBTlYsY0FBYzs7QUFPaEIsUUFBSSxDQUFDLE9BQU8sR0FBRyxtQkFBYSxDQUFBO0FBQzVCLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7QUFDOUMsUUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBOztBQUU5QixRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7QUFDcEMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsbUJBQW1CLEVBQUUsVUFBQyxVQUFVLEVBQUs7QUFDOUUsWUFBSyxVQUFVLEdBQUcsVUFBVSxDQUFBO0tBQzdCLENBQUMsQ0FBQyxDQUFBO0dBQ0o7O2VBZkcsY0FBYzs7V0FnQlYsb0JBQUc7OztBQUNULFVBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsVUFBQyxVQUFVLEVBQUs7QUFDdkUsZUFBSyxvQkFBb0IsQ0FBQyxVQUFVLENBQUMsQ0FBQTtPQUN0QyxDQUFDLENBQUMsQ0FBQTtLQUNKOzs7V0FDRSxhQUFDLFVBQXNCLEVBQWlCO0FBQ3pDLGFBQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUE7S0FDMUM7OztXQUNtQiw4QkFBQyxVQUFzQixFQUFnQjs7O0FBQ3pELFVBQUksWUFBWSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFBO0FBQ3JELFVBQUksWUFBWSxFQUFFO0FBQ2hCLGVBQU8sWUFBWSxDQUFBO09BQ3BCO0FBQ0Qsa0JBQVksR0FBRyw4QkFBaUIsVUFBVSxDQUFDLENBQUE7QUFDM0Msa0JBQVksQ0FBQyxZQUFZLENBQUMsWUFBTTtBQUM5QixlQUFLLGFBQWEsVUFBTyxDQUFDLFVBQVUsQ0FBQyxDQUFBO09BQ3RDLENBQUMsQ0FBQTtBQUNGLFVBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxZQUFZLENBQUMsQ0FBQTtBQUNoRCxVQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsWUFBWSxDQUFDLENBQUE7QUFDMUMsVUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO0FBQ25CLG9CQUFZLENBQUMsSUFBSSxFQUFFLENBQUE7T0FDcEI7QUFDRCxhQUFPLFlBQVksQ0FBQTtLQUNwQjs7O1dBQ00saUJBQUMsUUFBZ0QsRUFBYztBQUNwRSxVQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUNwQyxhQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQTtLQUM1Qzs7O1dBQ00sbUJBQUc7QUFDUixXQUFLLElBQU0sS0FBSyxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLEVBQUU7QUFDL0MsYUFBSyxDQUFDLE9BQU8sRUFBRSxDQUFBO09BQ2hCO0FBQ0QsVUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtLQUM3Qjs7O1NBakRHLGNBQWM7OztBQW9EcEIsTUFBTSxDQUFDLE9BQU8sR0FBRyxjQUFjLENBQUEiLCJmaWxlIjoiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvZWRpdG9yLXJlZ2lzdHJ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IHsgRW1pdHRlciwgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nXG5pbXBvcnQgdHlwZSB7IERpc3Bvc2FibGUsIFRleHRFZGl0b3IgfSBmcm9tICdhdG9tJ1xuaW1wb3J0IEVkaXRvckxpbnRlciBmcm9tICcuL2VkaXRvci1saW50ZXInXG5cbmNsYXNzIEVkaXRvclJlZ2lzdHJ5IHtcbiAgZW1pdHRlcjogRW1pdHRlcjtcbiAgbGludE9uT3BlbjogYm9vbGVhbjtcbiAgc3Vic2NyaXB0aW9uczogQ29tcG9zaXRlRGlzcG9zYWJsZTtcbiAgZWRpdG9yTGludGVyczogTWFwPFRleHRFZGl0b3IsIEVkaXRvckxpbnRlcj47XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXIoKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcbiAgICB0aGlzLmVkaXRvckxpbnRlcnMgPSBuZXcgTWFwKClcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQodGhpcy5lbWl0dGVyKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLmxpbnRPbk9wZW4nLCAobGludE9uT3BlbikgPT4ge1xuICAgICAgdGhpcy5saW50T25PcGVuID0gbGludE9uT3BlblxuICAgIH0pKVxuICB9XG4gIGFjdGl2YXRlKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzKCh0ZXh0RWRpdG9yKSA9PiB7XG4gICAgICB0aGlzLmNyZWF0ZUZyb21UZXh0RWRpdG9yKHRleHRFZGl0b3IpXG4gICAgfSkpXG4gIH1cbiAgZ2V0KHRleHRFZGl0b3I6IFRleHRFZGl0b3IpOiA/RWRpdG9yTGludGVyIHtcbiAgICByZXR1cm4gdGhpcy5lZGl0b3JMaW50ZXJzLmdldCh0ZXh0RWRpdG9yKVxuICB9XG4gIGNyZWF0ZUZyb21UZXh0RWRpdG9yKHRleHRFZGl0b3I6IFRleHRFZGl0b3IpOiBFZGl0b3JMaW50ZXIge1xuICAgIGxldCBlZGl0b3JMaW50ZXIgPSB0aGlzLmVkaXRvckxpbnRlcnMuZ2V0KHRleHRFZGl0b3IpXG4gICAgaWYgKGVkaXRvckxpbnRlcikge1xuICAgICAgcmV0dXJuIGVkaXRvckxpbnRlclxuICAgIH1cbiAgICBlZGl0b3JMaW50ZXIgPSBuZXcgRWRpdG9yTGludGVyKHRleHRFZGl0b3IpXG4gICAgZWRpdG9yTGludGVyLm9uRGlkRGVzdHJveSgoKSA9PiB7XG4gICAgICB0aGlzLmVkaXRvckxpbnRlcnMuZGVsZXRlKHRleHRFZGl0b3IpXG4gICAgfSlcbiAgICB0aGlzLmVkaXRvckxpbnRlcnMuc2V0KHRleHRFZGl0b3IsIGVkaXRvckxpbnRlcilcbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnb2JzZXJ2ZScsIGVkaXRvckxpbnRlcilcbiAgICBpZiAodGhpcy5saW50T25PcGVuKSB7XG4gICAgICBlZGl0b3JMaW50ZXIubGludCgpXG4gICAgfVxuICAgIHJldHVybiBlZGl0b3JMaW50ZXJcbiAgfVxuICBvYnNlcnZlKGNhbGxiYWNrOiAoKGVkaXRvckxpbnRlcjogRWRpdG9yTGludGVyKSA9PiB2b2lkKSk6IERpc3Bvc2FibGUge1xuICAgIHRoaXMuZWRpdG9yTGludGVycy5mb3JFYWNoKGNhbGxiYWNrKVxuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ29ic2VydmUnLCBjYWxsYmFjaylcbiAgfVxuICBkaXNwb3NlKCkge1xuICAgIGZvciAoY29uc3QgZW50cnkgb2YgdGhpcy5lZGl0b3JMaW50ZXJzLnZhbHVlcygpKSB7XG4gICAgICBlbnRyeS5kaXNwb3NlKClcbiAgICB9XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRWRpdG9yUmVnaXN0cnlcbiJdfQ==