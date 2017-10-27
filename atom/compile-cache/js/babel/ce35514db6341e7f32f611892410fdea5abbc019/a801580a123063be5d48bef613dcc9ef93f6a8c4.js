Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

var _disposify = require('disposify');

var _disposify2 = _interopRequireDefault(_disposify);

var _element = require('./element');

var _element2 = _interopRequireDefault(_element);

var _registry = require('./registry');

var _registry2 = _interopRequireDefault(_registry);

var BusySignal = (function () {
  function BusySignal() {
    var _this = this;

    _classCallCheck(this, BusySignal);

    this.element = new _element2['default']();
    this.registry = new _registry2['default']();
    this.subscriptions = new _atom.CompositeDisposable();

    this.subscriptions.add(this.element);
    this.subscriptions.add(this.registry);

    this.registry.onDidUpdate(function () {
      _this.element.update(_this.registry.getActiveTitles(), _this.registry.getOldTitles());
    });
  }

  _createClass(BusySignal, [{
    key: 'attach',
    value: function attach(statusBar) {
      this.subscriptions.add((0, _disposify2['default'])(statusBar.addRightTile({
        item: this.element,
        priority: 500
      })));
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
    }
  }]);

  return BusySignal;
})();

exports['default'] = BusySignal;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9idXN5LXNpZ25hbC9saWIvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O29CQUVvQyxNQUFNOzt5QkFDcEIsV0FBVzs7Ozt1QkFDYixXQUFXOzs7O3dCQUNWLFlBQVk7Ozs7SUFFWixVQUFVO0FBS2xCLFdBTFEsVUFBVSxHQUtmOzs7MEJBTEssVUFBVTs7QUFNM0IsUUFBSSxDQUFDLE9BQU8sR0FBRywwQkFBYSxDQUFBO0FBQzVCLFFBQUksQ0FBQyxRQUFRLEdBQUcsMkJBQWMsQ0FBQTtBQUM5QixRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFBOztBQUU5QyxRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7QUFDcEMsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFBOztBQUVyQyxRQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxZQUFNO0FBQzlCLFlBQUssT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFLLFFBQVEsQ0FBQyxlQUFlLEVBQUUsRUFBRSxNQUFLLFFBQVEsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFBO0tBQ25GLENBQUMsQ0FBQTtHQUNIOztlQWhCa0IsVUFBVTs7V0FpQnZCLGdCQUFDLFNBQWlCLEVBQUU7QUFDeEIsVUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsNEJBQVUsU0FBUyxDQUFDLFlBQVksQ0FBQztBQUN0RCxZQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU87QUFDbEIsZ0JBQVEsRUFBRSxHQUFHO09BQ2QsQ0FBQyxDQUFDLENBQUMsQ0FBQTtLQUNMOzs7V0FDTSxtQkFBRztBQUNSLFVBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUE7S0FDN0I7OztTQXpCa0IsVUFBVTs7O3FCQUFWLFVBQVUiLCJmaWxlIjoiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2J1c3ktc2lnbmFsL2xpYi9tYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nXG5pbXBvcnQgZGlzcG9zaWZ5IGZyb20gJ2Rpc3Bvc2lmeSdcbmltcG9ydCBFbGVtZW50IGZyb20gJy4vZWxlbWVudCdcbmltcG9ydCBSZWdpc3RyeSBmcm9tICcuL3JlZ2lzdHJ5J1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCdXN5U2lnbmFsIHtcbiAgZWxlbWVudDogRWxlbWVudDtcbiAgcmVnaXN0cnk6IFJlZ2lzdHJ5O1xuICBzdWJzY3JpcHRpb25zOiBDb21wb3NpdGVEaXNwb3NhYmxlO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuZWxlbWVudCA9IG5ldyBFbGVtZW50KClcbiAgICB0aGlzLnJlZ2lzdHJ5ID0gbmV3IFJlZ2lzdHJ5KClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuZWxlbWVudClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMucmVnaXN0cnkpXG5cbiAgICB0aGlzLnJlZ2lzdHJ5Lm9uRGlkVXBkYXRlKCgpID0+IHtcbiAgICAgIHRoaXMuZWxlbWVudC51cGRhdGUodGhpcy5yZWdpc3RyeS5nZXRBY3RpdmVUaXRsZXMoKSwgdGhpcy5yZWdpc3RyeS5nZXRPbGRUaXRsZXMoKSlcbiAgICB9KVxuICB9XG4gIGF0dGFjaChzdGF0dXNCYXI6IE9iamVjdCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoZGlzcG9zaWZ5KHN0YXR1c0Jhci5hZGRSaWdodFRpbGUoe1xuICAgICAgaXRlbTogdGhpcy5lbGVtZW50LFxuICAgICAgcHJpb3JpdHk6IDUwMCxcbiAgICB9KSkpXG4gIH1cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gIH1cbn1cbiJdfQ==