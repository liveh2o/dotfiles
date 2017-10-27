'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BottomTab = (function (_HTMLElement) {
  _inherits(BottomTab, _HTMLElement);

  function BottomTab() {
    _classCallCheck(this, BottomTab);

    _get(Object.getPrototypeOf(BottomTab.prototype), 'constructor', this).apply(this, arguments);
  }

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
      this.count = 0;
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
    get: function get() {
      return this._count;
    },
    set: function set(value) {
      this._count = value;
      this.countSpan.textContent = value;
    }
  }]);

  return BottomTab;
})(HTMLElement);

module.exports = BottomTab = document.registerElement('linter-bottom-tab', { prototype: BottomTab.prototype });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL3VpL2JvdHRvbS10YWIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDOzs7Ozs7Ozs7O0lBRVAsU0FBUztZQUFULFNBQVM7O1dBQVQsU0FBUzswQkFBVCxTQUFTOzsrQkFBVCxTQUFTOzs7ZUFBVCxTQUFTOztXQUVOLGlCQUFDLElBQUksRUFBRTtBQUNaLFVBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFBO0FBQ2hCLFVBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFBO0FBQ3JCLFVBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFBO0FBQ25CLFVBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFBO0FBQ2hDLFVBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUMvQyxVQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUE7QUFDckMsVUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEdBQUcsR0FBRyxDQUFBO0FBQ2hDLFVBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxHQUFHLENBQUE7QUFDaEMsVUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUE7QUFDaEMsVUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUE7QUFDZCxhQUFPLElBQUksQ0FBQTtLQUNaOzs7V0FFZSw0QkFBRztBQUNqQixVQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQTtLQUNyQjs7O1dBRWUsNEJBQUc7QUFDakIsVUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUE7S0FDdEI7OztTQUVTLGVBQUc7QUFDWCxhQUFPLElBQUksQ0FBQyxPQUFPLENBQUE7S0FDcEI7U0FFUyxhQUFDLEtBQUssRUFBRTtBQUNoQixVQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQTtBQUNwQixVQUFJLEtBQUssRUFBRTtBQUNULFlBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFBO09BQzdCLE1BQU07QUFDTCxZQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQTtPQUNoQztLQUNGOzs7U0FFUSxlQUFFO0FBQ1QsYUFBTyxJQUFJLENBQUMsTUFBTSxDQUFBO0tBQ25CO1NBRVEsYUFBQyxLQUFLLEVBQUU7QUFDZixVQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQTtBQUNuQixVQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUE7S0FDbkM7OztTQTVDRyxTQUFTO0dBQVMsV0FBVzs7QUFnRG5DLE1BQU0sQ0FBQyxPQUFPLEdBQUcsU0FBUyxHQUFHLFFBQVEsQ0FDbEMsZUFBZSxDQUNkLG1CQUFtQixFQUNuQixFQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsU0FBUyxFQUFDLENBQ2pDLENBQUEiLCJmaWxlIjoiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvdWkvYm90dG9tLXRhYi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuY2xhc3MgQm90dG9tVGFiIGV4dGVuZHMgSFRNTEVsZW1lbnR7XG5cbiAgcHJlcGFyZShuYW1lKSB7XG4gICAgdGhpcy5uYW1lID0gbmFtZVxuICAgIHRoaXMuYXR0YWNoZWQgPSBmYWxzZVxuICAgIHRoaXMuYWN0aXZlID0gZmFsc2VcbiAgICB0aGlzLmNsYXNzTGlzdC5hZGQoJ2xpbnRlci10YWInKVxuICAgIHRoaXMuY291bnRTcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXG4gICAgdGhpcy5jb3VudFNwYW4uY2xhc3NMaXN0LmFkZCgnY291bnQnKVxuICAgIHRoaXMuY291bnRTcGFuLnRleHRDb250ZW50ID0gJzAnXG4gICAgdGhpcy5pbm5lckhUTUwgPSB0aGlzLm5hbWUgKyAnICdcbiAgICB0aGlzLmFwcGVuZENoaWxkKHRoaXMuY291bnRTcGFuKVxuICAgIHRoaXMuY291bnQgPSAwXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIGF0dGFjaGVkQ2FsbGJhY2soKSB7XG4gICAgdGhpcy5hdHRhY2hlZCA9IHRydWVcbiAgfVxuXG4gIGRldGFjaGVkQ2FsbGJhY2soKSB7XG4gICAgdGhpcy5hdHRhY2hlZCA9IGZhbHNlXG4gIH1cblxuICBnZXQgYWN0aXZlKCkge1xuICAgIHJldHVybiB0aGlzLl9hY3RpdmVcbiAgfVxuXG4gIHNldCBhY3RpdmUodmFsdWUpIHtcbiAgICB0aGlzLl9hY3RpdmUgPSB2YWx1ZVxuICAgIGlmICh2YWx1ZSkge1xuICAgICAgdGhpcy5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG4gICAgfVxuICB9XG5cbiAgZ2V0IGNvdW50KCl7XG4gICAgcmV0dXJuIHRoaXMuX2NvdW50XG4gIH1cblxuICBzZXQgY291bnQodmFsdWUpIHtcbiAgICB0aGlzLl9jb3VudCA9IHZhbHVlXG4gICAgdGhpcy5jb3VudFNwYW4udGV4dENvbnRlbnQgPSB2YWx1ZVxuICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBCb3R0b21UYWIgPSBkb2N1bWVudFxuICAucmVnaXN0ZXJFbGVtZW50KFxuICAgICdsaW50ZXItYm90dG9tLXRhYicsXG4gICAge3Byb3RvdHlwZTogQm90dG9tVGFiLnByb3RvdHlwZX1cbiAgKVxuIl19