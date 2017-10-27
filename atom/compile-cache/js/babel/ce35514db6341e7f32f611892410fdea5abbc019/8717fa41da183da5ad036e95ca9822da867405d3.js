Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _helpers = require('./helpers');

var Provider = (function () {
  function Provider() {
    _classCallCheck(this, Provider);

    this.id = (0, _helpers.generateRandom)();
    this.emitter = new _atom.Emitter();
    this.subscriptions = new _atom.CompositeDisposable();

    this.subscriptions.add(this.emitter);
  }

  // Public

  _createClass(Provider, [{
    key: 'add',
    value: function add(title) {
      this.emitter.emit('did-add', title);
    }

    // Public
  }, {
    key: 'remove',
    value: function remove(title) {
      this.emitter.emit('did-remove', title);
    }

    // Public
  }, {
    key: 'clear',
    value: function clear() {
      this.emitter.emit('did-clear');
    }
  }, {
    key: 'onDidAdd',
    value: function onDidAdd(callback) {
      return this.emitter.on('did-add', callback);
    }
  }, {
    key: 'onDidRemove',
    value: function onDidRemove(callback) {
      return this.emitter.on('did-remove', callback);
    }
  }, {
    key: 'onDidClear',
    value: function onDidClear(callback) {
      return this.emitter.on('did-clear', callback);
    }
  }, {
    key: 'onDidDispose',
    value: function onDidDispose(callback) {
      return this.emitter.on('did-dispose', callback);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.emitter.emit('did-dispose');
      this.subscriptions.dispose();
    }
  }]);

  return Provider;
})();

exports['default'] = Provider;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9idXN5LXNpZ25hbC9saWIvcHJvdmlkZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7b0JBRTZDLE1BQU07O3VCQUVwQixXQUFXOztJQUVyQixRQUFRO0FBS2hCLFdBTFEsUUFBUSxHQUtiOzBCQUxLLFFBQVE7O0FBTXpCLFFBQUksQ0FBQyxFQUFFLEdBQUcsOEJBQWdCLENBQUE7QUFDMUIsUUFBSSxDQUFDLE9BQU8sR0FBRyxtQkFBYSxDQUFBO0FBQzVCLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7O0FBRTlDLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtHQUNyQzs7OztlQVhrQixRQUFROztXQWF4QixhQUFDLEtBQWEsRUFBRTtBQUNqQixVQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUE7S0FDcEM7Ozs7O1dBRUssZ0JBQUMsS0FBYSxFQUFFO0FBQ3BCLFVBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxLQUFLLENBQUMsQ0FBQTtLQUN2Qzs7Ozs7V0FFSSxpQkFBRztBQUNOLFVBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFBO0tBQy9COzs7V0FDTyxrQkFBQyxRQUFrQyxFQUFjO0FBQ3ZELGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFBO0tBQzVDOzs7V0FDVSxxQkFBQyxRQUFrQyxFQUFjO0FBQzFELGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLFFBQVEsQ0FBQyxDQUFBO0tBQy9DOzs7V0FDUyxvQkFBQyxRQUFxQixFQUFjO0FBQzVDLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsV0FBVyxFQUFFLFFBQVEsQ0FBQyxDQUFBO0tBQzlDOzs7V0FDVyxzQkFBQyxRQUFrQixFQUFjO0FBQzNDLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLFFBQVEsQ0FBQyxDQUFBO0tBQ2hEOzs7V0FDTSxtQkFBRztBQUNSLFVBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFBO0FBQ2hDLFVBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUE7S0FDN0I7OztTQXZDa0IsUUFBUTs7O3FCQUFSLFFBQVEiLCJmaWxlIjoiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2J1c3ktc2lnbmFsL2xpYi9wcm92aWRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUsIEVtaXR0ZXIgfSBmcm9tICdhdG9tJ1xuaW1wb3J0IHR5cGUgeyBEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSdcbmltcG9ydCB7IGdlbmVyYXRlUmFuZG9tIH0gZnJvbSAnLi9oZWxwZXJzJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQcm92aWRlciB7XG4gIGlkOiBzdHJpbmc7XG4gIGVtaXR0ZXI6IEVtaXR0ZXI7XG4gIHN1YnNjcmlwdGlvbnM6IENvbXBvc2l0ZURpc3Bvc2FibGU7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5pZCA9IGdlbmVyYXRlUmFuZG9tKClcbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZCh0aGlzLmVtaXR0ZXIpXG4gIH1cbiAgLy8gUHVibGljXG4gIGFkZCh0aXRsZTogc3RyaW5nKSB7XG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1hZGQnLCB0aXRsZSlcbiAgfVxuICAvLyBQdWJsaWNcbiAgcmVtb3ZlKHRpdGxlOiBzdHJpbmcpIHtcbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLXJlbW92ZScsIHRpdGxlKVxuICB9XG4gIC8vIFB1YmxpY1xuICBjbGVhcigpIHtcbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWNsZWFyJylcbiAgfVxuICBvbkRpZEFkZChjYWxsYmFjazogKCh0aXRsZTogc3RyaW5nKSA9PiBhbnkpKTogRGlzcG9zYWJsZSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLWFkZCcsIGNhbGxiYWNrKVxuICB9XG4gIG9uRGlkUmVtb3ZlKGNhbGxiYWNrOiAoKHRpdGxlOiBzdHJpbmcpID0+IGFueSkpOiBEaXNwb3NhYmxlIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtcmVtb3ZlJywgY2FsbGJhY2spXG4gIH1cbiAgb25EaWRDbGVhcihjYWxsYmFjazogKCgpID0+IGFueSkpOiBEaXNwb3NhYmxlIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtY2xlYXInLCBjYWxsYmFjaylcbiAgfVxuICBvbkRpZERpc3Bvc2UoY2FsbGJhY2s6IEZ1bmN0aW9uKTogRGlzcG9zYWJsZSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLWRpc3Bvc2UnLCBjYWxsYmFjaylcbiAgfVxuICBkaXNwb3NlKCkge1xuICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtZGlzcG9zZScpXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICB9XG59XG4iXX0=