Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _elementsList = require('./elements/list');

var _elementsList2 = _interopRequireDefault(_elementsList);

var ListView = (function () {
  function ListView() {
    _classCallCheck(this, ListView);

    this.emitter = new _atom.Emitter();
    this.element = new _elementsList2['default']();
    this.subscriptions = new _atom.CompositeDisposable();

    this.subscriptions.add(this.emitter);
    this.subscriptions.add(this.element);
  }

  _createClass(ListView, [{
    key: 'activate',
    value: function activate(editor, suggestions) {
      var _this = this;

      this.element.render(suggestions, function (selected) {
        _this.emitter.emit('did-select', selected);
        _this.dispose();
      });
      this.element.move('move-to-top');

      var bufferPosition = editor.getCursorBufferPosition();
      var marker = editor.markBufferRange([bufferPosition, bufferPosition], { invalidate: 'never' });
      editor.decorateMarker(marker, {
        type: 'overlay',
        item: this.element
      });
      this.subscriptions.add(new _atom.Disposable(function () {
        marker.destroy();
      }));
    }
  }, {
    key: 'move',
    value: function move(movement) {
      this.element.move(movement);
    }
  }, {
    key: 'select',
    value: function select() {
      this.element.select();
    }
  }, {
    key: 'onDidSelect',
    value: function onDidSelect(callback) {
      return this.emitter.on('did-select', callback);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
    }
  }]);

  return ListView;
})();

exports['default'] = ListView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9pbnRlbnRpb25zL2xpYi92aWV3LWxpc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztvQkFFeUQsTUFBTTs7NEJBR3ZDLGlCQUFpQjs7OztJQUdwQixRQUFRO0FBS2hCLFdBTFEsUUFBUSxHQUtiOzBCQUxLLFFBQVE7O0FBTXpCLFFBQUksQ0FBQyxPQUFPLEdBQUcsbUJBQWEsQ0FBQTtBQUM1QixRQUFJLENBQUMsT0FBTyxHQUFHLCtCQUFpQixDQUFBO0FBQ2hDLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7O0FBRTlDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUNwQyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7R0FDckM7O2VBWmtCLFFBQVE7O1dBYW5CLGtCQUFDLE1BQWtCLEVBQUUsV0FBNEIsRUFBRTs7O0FBQ3pELFVBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxVQUFBLFFBQVEsRUFBSTtBQUMzQyxjQUFLLE9BQU8sQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLFFBQVEsQ0FBQyxDQUFBO0FBQ3pDLGNBQUssT0FBTyxFQUFFLENBQUE7T0FDZixDQUFDLENBQUE7QUFDRixVQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQTs7QUFFaEMsVUFBTSxjQUFjLEdBQUcsTUFBTSxDQUFDLHVCQUF1QixFQUFFLENBQUE7QUFDdkQsVUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDLGNBQWMsRUFBRSxjQUFjLENBQUMsRUFBRSxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFBO0FBQ2hHLFlBQU0sQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFO0FBQzVCLFlBQUksRUFBRSxTQUFTO0FBQ2YsWUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPO09BQ25CLENBQUMsQ0FBQTtBQUNGLFVBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLHFCQUFlLFlBQVc7QUFDL0MsY0FBTSxDQUFDLE9BQU8sRUFBRSxDQUFBO09BQ2pCLENBQUMsQ0FBQyxDQUFBO0tBQ0o7OztXQUNHLGNBQUMsUUFBc0IsRUFBRTtBQUMzQixVQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQTtLQUM1Qjs7O1dBQ0ssa0JBQUc7QUFDUCxVQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFBO0tBQ3RCOzs7V0FDVSxxQkFBQyxRQUFrQixFQUFjO0FBQzFDLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLFFBQVEsQ0FBQyxDQUFBO0tBQy9DOzs7V0FDTSxtQkFBRztBQUNSLFVBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUE7S0FDN0I7OztTQXpDa0IsUUFBUTs7O3FCQUFSLFFBQVEiLCJmaWxlIjoiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2ludGVudGlvbnMvbGliL3ZpZXctbGlzdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUsIEVtaXR0ZXIsIERpc3Bvc2FibGUgfSBmcm9tICdhdG9tJ1xuaW1wb3J0IHR5cGUgeyBUZXh0RWRpdG9yIH0gZnJvbSAnYXRvbSdcblxuaW1wb3J0IExpc3RFbGVtZW50IGZyb20gJy4vZWxlbWVudHMvbGlzdCdcbmltcG9ydCB0eXBlIHsgTGlzdEl0ZW0sIExpc3RNb3ZlbWVudCB9IGZyb20gJy4vdHlwZXMnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExpc3RWaWV3IHtcbiAgZW1pdHRlcjogRW1pdHRlcjtcbiAgZWxlbWVudDogTGlzdEVsZW1lbnQ7XG4gIHN1YnNjcmlwdGlvbnM6IENvbXBvc2l0ZURpc3Bvc2FibGU7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXIoKVxuICAgIHRoaXMuZWxlbWVudCA9IG5ldyBMaXN0RWxlbWVudCgpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLmVtaXR0ZXIpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLmVsZW1lbnQpXG4gIH1cbiAgYWN0aXZhdGUoZWRpdG9yOiBUZXh0RWRpdG9yLCBzdWdnZXN0aW9uczogQXJyYXk8TGlzdEl0ZW0+KSB7XG4gICAgdGhpcy5lbGVtZW50LnJlbmRlcihzdWdnZXN0aW9ucywgc2VsZWN0ZWQgPT4ge1xuICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1zZWxlY3QnLCBzZWxlY3RlZClcbiAgICAgIHRoaXMuZGlzcG9zZSgpXG4gICAgfSlcbiAgICB0aGlzLmVsZW1lbnQubW92ZSgnbW92ZS10by10b3AnKVxuXG4gICAgY29uc3QgYnVmZmVyUG9zaXRpb24gPSBlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKVxuICAgIGNvbnN0IG1hcmtlciA9IGVkaXRvci5tYXJrQnVmZmVyUmFuZ2UoW2J1ZmZlclBvc2l0aW9uLCBidWZmZXJQb3NpdGlvbl0sIHsgaW52YWxpZGF0ZTogJ25ldmVyJyB9KVxuICAgIGVkaXRvci5kZWNvcmF0ZU1hcmtlcihtYXJrZXIsIHtcbiAgICAgIHR5cGU6ICdvdmVybGF5JyxcbiAgICAgIGl0ZW06IHRoaXMuZWxlbWVudCxcbiAgICB9KVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQobmV3IERpc3Bvc2FibGUoZnVuY3Rpb24oKSB7XG4gICAgICBtYXJrZXIuZGVzdHJveSgpXG4gICAgfSkpXG4gIH1cbiAgbW92ZShtb3ZlbWVudDogTGlzdE1vdmVtZW50KSB7XG4gICAgdGhpcy5lbGVtZW50Lm1vdmUobW92ZW1lbnQpXG4gIH1cbiAgc2VsZWN0KCkge1xuICAgIHRoaXMuZWxlbWVudC5zZWxlY3QoKVxuICB9XG4gIG9uRGlkU2VsZWN0KGNhbGxiYWNrOiBGdW5jdGlvbik6IERpc3Bvc2FibGUge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC1zZWxlY3QnLCBjYWxsYmFjaylcbiAgfVxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgfVxufVxuIl19