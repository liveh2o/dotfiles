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
    key: 'prepare',
    value: function prepare(name) {
      this.name = name;
      this.attached = false;
      this.active = false;
      this.classList.add('linter-tab');
      this.countSpan = document.createElement('span');
      this.countSpan.classList.add('count');
      this.countSpan.textContent = '0';
      this.innerHTML = this.name + ' ';
      this.appendChild(this.countSpan);
      return this;
    }
  }, {
    key: 'attachedCallback',
    value: function attachedCallback() {
      this.attached = true;
    }
  }, {
    key: 'detachedCallback',
    value: function detachedCallback() {
      this.attached = false;
    }
  }, {
    key: 'active',
    get: function get() {
      return this._active;
    },
    set: function set(value) {
      this._active = value;
      if (value) {
        this.classList.add('active');
      } else {
        this.classList.remove('active');
      }
    }
  }, {
    key: 'count',
    set: function set(value) {
      this.countSpan.textContent = value;
    }
  }]);

  return BottomTab;
})(HTMLElement);

module.exports = BottomTab = document.registerElement('linter-bottom-tab', {
  prototype: BottomTab.prototype
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL3ZpZXdzL2JvdHRvbS10YWIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDOzs7Ozs7Ozs7O0lBRVAsU0FBUztXQUFULFNBQVM7MEJBQVQsU0FBUzs7K0JBQVQsU0FBUzs7O1lBQVQsU0FBUzs7ZUFBVCxTQUFTOztXQUNOLGlCQUFDLElBQUksRUFBQztBQUNYLFVBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFBO0FBQ2hCLFVBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFBO0FBQ3JCLFVBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFBO0FBQ25CLFVBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFBO0FBQ2hDLFVBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUMvQyxVQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUE7QUFDckMsVUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEdBQUcsR0FBRyxDQUFBO0FBQ2hDLFVBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxHQUFHLENBQUE7QUFDaEMsVUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUE7QUFDaEMsYUFBTyxJQUFJLENBQUE7S0FDWjs7O1dBQ2UsNEJBQUc7QUFDakIsVUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUE7S0FDckI7OztXQUNlLDRCQUFFO0FBQ2hCLFVBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFBO0tBQ3RCOzs7U0FDUyxlQUFHO0FBQ1gsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFBO0tBQ3BCO1NBQ1MsYUFBQyxLQUFLLEVBQUU7QUFDaEIsVUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUE7QUFDcEIsVUFBSSxLQUFLLEVBQUU7QUFDVCxZQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQTtPQUM3QixNQUFNO0FBQ0wsWUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUE7T0FDaEM7S0FDRjs7O1NBQ1EsYUFBQyxLQUFLLEVBQUU7QUFDZixVQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUE7S0FDbkM7OztTQWhDRyxTQUFTO0dBQVMsV0FBVzs7QUFtQ25DLE1BQU0sQ0FBQyxPQUFPLEdBQUcsU0FBUyxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsbUJBQW1CLEVBQUU7QUFDekUsV0FBUyxFQUFFLFNBQVMsQ0FBQyxTQUFTO0NBQy9CLENBQUMsQ0FBQSIsImZpbGUiOiIvVXNlcnMvYWgvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi92aWV3cy9ib3R0b20tdGFiLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG5jbGFzcyBCb3R0b21UYWIgZXh0ZW5kcyBIVE1MRWxlbWVudHtcbiAgcHJlcGFyZShuYW1lKXtcbiAgICB0aGlzLm5hbWUgPSBuYW1lXG4gICAgdGhpcy5hdHRhY2hlZCA9IGZhbHNlXG4gICAgdGhpcy5hY3RpdmUgPSBmYWxzZVxuICAgIHRoaXMuY2xhc3NMaXN0LmFkZCgnbGludGVyLXRhYicpXG4gICAgdGhpcy5jb3VudFNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgICB0aGlzLmNvdW50U3Bhbi5jbGFzc0xpc3QuYWRkKCdjb3VudCcpXG4gICAgdGhpcy5jb3VudFNwYW4udGV4dENvbnRlbnQgPSAnMCdcbiAgICB0aGlzLmlubmVySFRNTCA9IHRoaXMubmFtZSArICcgJ1xuICAgIHRoaXMuYXBwZW5kQ2hpbGQodGhpcy5jb3VudFNwYW4pXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuICBhdHRhY2hlZENhbGxiYWNrKCkge1xuICAgIHRoaXMuYXR0YWNoZWQgPSB0cnVlXG4gIH1cbiAgZGV0YWNoZWRDYWxsYmFjaygpe1xuICAgIHRoaXMuYXR0YWNoZWQgPSBmYWxzZVxuICB9XG4gIGdldCBhY3RpdmUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2FjdGl2ZVxuICB9XG4gIHNldCBhY3RpdmUodmFsdWUpIHtcbiAgICB0aGlzLl9hY3RpdmUgPSB2YWx1ZVxuICAgIGlmICh2YWx1ZSkge1xuICAgICAgdGhpcy5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG4gICAgfVxuICB9XG4gIHNldCBjb3VudCh2YWx1ZSkge1xuICAgIHRoaXMuY291bnRTcGFuLnRleHRDb250ZW50ID0gdmFsdWVcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEJvdHRvbVRhYiA9IGRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudCgnbGludGVyLWJvdHRvbS10YWInLCB7XG4gIHByb3RvdHlwZTogQm90dG9tVGFiLnByb3RvdHlwZVxufSlcbiJdfQ==