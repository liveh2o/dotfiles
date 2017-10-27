'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var BottomTab = (function (_HTMLElement) {
  function BottomTab() {
    _classCallCheck(this, BottomTab);

    _get(Object.getPrototypeOf(BottomTab.prototype), 'constructor', this).apply(this, arguments);
  }

  _inherits(BottomTab, _HTMLElement);

  _createClass(BottomTab, [{
    key: 'initialize',
    value: function initialize(Content, onClick) {
      this.innerHTML = Content;
      this.classList.add('linter-tab');

      this.countSpan = document.createElement('span');
      this.countSpan.classList.add('count');
      this.countSpan.textContent = '0';

      this.appendChild(document.createTextNode(' '));
      this.appendChild(this.countSpan);

      this.addEventListener('click', onClick);
    }
  }, {
    key: 'active',
    set: function set(value) {
      if (value) {
        this.classList.add('active');
      } else {
        this.classList.remove('active');
      }
      this._active = value;
    }
  }, {
    key: 'count',
    set: function set(value) {
      this._count = value;
      this.countSpan.textContent = value;
    }
  }]);

  return BottomTab;
})(HTMLElement);

module.exports = BottomTab = document.registerElement('linter-bottom-tab', {
  prototype: BottomTab.prototype
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL3ZpZXdzL2JvdHRvbS10YWIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDOzs7Ozs7Ozs7O0lBRVAsU0FBUztXQUFULFNBQVM7MEJBQVQsU0FBUzs7K0JBQVQsU0FBUzs7O1lBQVQsU0FBUzs7ZUFBVCxTQUFTOztXQUVILG9CQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUU7QUFDM0IsVUFBSSxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUE7QUFDeEIsVUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUE7O0FBRWhDLFVBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUMvQyxVQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUE7QUFDckMsVUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEdBQUcsR0FBRyxDQUFBOztBQUVoQyxVQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTtBQUM5QyxVQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQTs7QUFFaEMsVUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQTtLQUN4Qzs7O1NBRVMsYUFBQyxLQUFLLEVBQUU7QUFDaEIsVUFBSSxLQUFLLEVBQUU7QUFDVCxZQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQTtPQUM3QixNQUFNO0FBQ0wsWUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUE7T0FDaEM7QUFDRCxVQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQTtLQUNyQjs7O1NBRVEsYUFBQyxLQUFLLEVBQUU7QUFDZixVQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQTtBQUNuQixVQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUE7S0FDbkM7OztTQTVCRyxTQUFTO0dBQVMsV0FBVzs7QUErQm5DLE1BQU0sQ0FBQyxPQUFPLEdBQUcsU0FBUyxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsbUJBQW1CLEVBQUU7QUFDekUsV0FBUyxFQUFFLFNBQVMsQ0FBQyxTQUFTO0NBQy9CLENBQUMsQ0FBQSIsImZpbGUiOiIvVXNlcnMvYWgvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi92aWV3cy9ib3R0b20tdGFiLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG5jbGFzcyBCb3R0b21UYWIgZXh0ZW5kcyBIVE1MRWxlbWVudHtcblxuICBpbml0aWFsaXplKENvbnRlbnQsIG9uQ2xpY2spIHtcbiAgICB0aGlzLmlubmVySFRNTCA9IENvbnRlbnRcbiAgICB0aGlzLmNsYXNzTGlzdC5hZGQoJ2xpbnRlci10YWInKVxuXG4gICAgdGhpcy5jb3VudFNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgICB0aGlzLmNvdW50U3Bhbi5jbGFzc0xpc3QuYWRkKCdjb3VudCcpXG4gICAgdGhpcy5jb3VudFNwYW4udGV4dENvbnRlbnQgPSAnMCdcblxuICAgIHRoaXMuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJyAnKSlcbiAgICB0aGlzLmFwcGVuZENoaWxkKHRoaXMuY291bnRTcGFuKVxuXG4gICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uQ2xpY2spXG4gIH1cblxuICBzZXQgYWN0aXZlKHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICB0aGlzLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJylcbiAgICB9XG4gICAgdGhpcy5fYWN0aXZlID0gdmFsdWVcbiAgfVxuXG4gIHNldCBjb3VudCh2YWx1ZSkge1xuICAgIHRoaXMuX2NvdW50ID0gdmFsdWVcbiAgICB0aGlzLmNvdW50U3Bhbi50ZXh0Q29udGVudCA9IHZhbHVlXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBCb3R0b21UYWIgPSBkb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoJ2xpbnRlci1ib3R0b20tdGFiJywge1xuICBwcm90b3R5cGU6IEJvdHRvbVRhYi5wcm90b3R5cGVcbn0pXG4iXX0=