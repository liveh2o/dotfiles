'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var MockSoftWrapStatus = (function () {
  function MockSoftWrapStatus(shouldRenderIndicator, shouldBeLit) {
    _classCallCheck(this, MockSoftWrapStatus);

    this.render = shouldRenderIndicator;
    this.light = shouldBeLit;
    this.toggled = false;
  }

  _createClass(MockSoftWrapStatus, [{
    key: 'shouldBeLit',
    value: function shouldBeLit() {
      return this.light;
    }
  }, {
    key: 'shouldRenderIndicator',
    value: function shouldRenderIndicator() {
      return this.render;
    }
  }, {
    key: 'toggleSoftWrapped',
    value: function toggleSoftWrapped() {
      this.toggled = true;
    }
  }]);

  return MockSoftWrapStatus;
})();

exports['default'] = MockSoftWrapStatus;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9zb2Z0LXdyYXAtaW5kaWNhdG9yL3NwZWMvbW9jay1zb2Z0LXdyYXAtc3RhdHVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQTs7Ozs7Ozs7OztJQUVVLGtCQUFrQjtBQUN6QixXQURPLGtCQUFrQixDQUN4QixxQkFBcUIsRUFBRSxXQUFXLEVBQUU7MEJBRDlCLGtCQUFrQjs7QUFFbkMsUUFBSSxDQUFDLE1BQU0sR0FBRyxxQkFBcUIsQ0FBQTtBQUNuQyxRQUFJLENBQUMsS0FBSyxHQUFHLFdBQVcsQ0FBQTtBQUN4QixRQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQTtHQUNyQjs7ZUFMa0Isa0JBQWtCOztXQU96Qix1QkFBRztBQUNiLGFBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQTtLQUNsQjs7O1dBRXFCLGlDQUFHO0FBQ3ZCLGFBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQTtLQUNuQjs7O1dBRWlCLDZCQUFHO0FBQ25CLFVBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFBO0tBQ3BCOzs7U0FqQmtCLGtCQUFrQjs7O3FCQUFsQixrQkFBa0IiLCJmaWxlIjoiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL3NvZnQtd3JhcC1pbmRpY2F0b3Ivc3BlYy9tb2NrLXNvZnQtd3JhcC1zdGF0dXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNb2NrU29mdFdyYXBTdGF0dXMge1xuICBjb25zdHJ1Y3RvciAoc2hvdWxkUmVuZGVySW5kaWNhdG9yLCBzaG91bGRCZUxpdCkge1xuICAgIHRoaXMucmVuZGVyID0gc2hvdWxkUmVuZGVySW5kaWNhdG9yXG4gICAgdGhpcy5saWdodCA9IHNob3VsZEJlTGl0XG4gICAgdGhpcy50b2dnbGVkID0gZmFsc2VcbiAgfVxuXG4gIHNob3VsZEJlTGl0ICgpIHtcbiAgICByZXR1cm4gdGhpcy5saWdodFxuICB9XG5cbiAgc2hvdWxkUmVuZGVySW5kaWNhdG9yICgpIHtcbiAgICByZXR1cm4gdGhpcy5yZW5kZXJcbiAgfVxuXG4gIHRvZ2dsZVNvZnRXcmFwcGVkICgpIHtcbiAgICB0aGlzLnRvZ2dsZWQgPSB0cnVlXG4gIH1cbn1cbiJdfQ==
//# sourceURL=/Users/ah/.atom/packages/soft-wrap-indicator/spec/mock-soft-wrap-status.js
