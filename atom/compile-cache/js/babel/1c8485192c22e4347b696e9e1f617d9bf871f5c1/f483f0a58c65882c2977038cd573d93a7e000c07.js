'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var BottomStatus = (function (_HTMLElement) {
  function BottomStatus() {
    _classCallCheck(this, BottomStatus);

    _get(Object.getPrototypeOf(BottomStatus.prototype), 'constructor', this).apply(this, arguments);
  }

  _inherits(BottomStatus, _HTMLElement);

  _createClass(BottomStatus, [{
    key: 'createdCallback',
    value: function createdCallback() {
      this.classList.add('inline-block');
      this.classList.add('linter-highlight');

      this.iconSpan = document.createElement('span');
      this.iconSpan.classList.add('icon');
      this.appendChild(this.iconSpan);

      this.count = 0;

      this.addEventListener('click', function () {
        atom.commands.dispatch(atom.views.getView(atom.workspace), 'linter:next-error');
      });
    }
  }, {
    key: 'count',
    set: function set(Value) {
      if (Value) {
        this.classList.remove('status-success');
        this.iconSpan.classList.remove('icon-check');

        this.classList.add('status-error');
        this.iconSpan.classList.add('icon-x');

        this.iconSpan.textContent = Value === 1 ? '1 Issue' : Value + ' Issues';
      } else {
        this.classList.remove('status-error');
        this.iconSpan.classList.remove('icon-x');

        this.classList.add('status-success');
        this.iconSpan.classList.add('icon-check');

        this.iconSpan.textContent = 'No Issues';
      }
    }
  }]);

  return BottomStatus;
})(HTMLElement);

module.exports = BottomStatus = document.registerElement('linter-bottom-status', { prototype: BottomStatus.prototype });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL3ZpZXdzL2JvdHRvbS1zdGF0dXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDOzs7Ozs7Ozs7O0lBRVAsWUFBWTtXQUFaLFlBQVk7MEJBQVosWUFBWTs7K0JBQVosWUFBWTs7O1lBQVosWUFBWTs7ZUFBWixZQUFZOztXQUNELDJCQUFHO0FBQ2hCLFVBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFBO0FBQ2xDLFVBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUE7O0FBRXRDLFVBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUM5QyxVQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDbkMsVUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7O0FBRS9CLFVBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFBOztBQUVkLFVBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsWUFBVTtBQUN2QyxZQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsbUJBQW1CLENBQUMsQ0FBQTtPQUNoRixDQUFDLENBQUE7S0FDSDs7O1NBQ1EsYUFBQyxLQUFLLEVBQUU7QUFDZixVQUFJLEtBQUssRUFBRTtBQUNULFlBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUE7QUFDdkMsWUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFBOztBQUU1QyxZQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQTtBQUNsQyxZQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUE7O0FBRXJDLFlBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxHQUFHLEtBQUssS0FBSyxDQUFDLEdBQUcsU0FBUyxHQUFNLEtBQUssWUFBUyxDQUFBO09BQ3hFLE1BQU07QUFDTCxZQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQTtBQUNyQyxZQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUE7O0FBRXhDLFlBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUE7QUFDcEMsWUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFBOztBQUV6QyxZQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUE7T0FDeEM7S0FDRjs7O1NBakNHLFlBQVk7R0FBUyxXQUFXOztBQXFDdEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxZQUFZLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxzQkFBc0IsRUFBRSxFQUFDLFNBQVMsRUFBRSxZQUFZLENBQUMsU0FBUyxFQUFDLENBQUMsQ0FBQSIsImZpbGUiOiIvVXNlcnMvYWgvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi92aWV3cy9ib3R0b20tc3RhdHVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG5jbGFzcyBCb3R0b21TdGF0dXMgZXh0ZW5kcyBIVE1MRWxlbWVudHtcbiAgY3JlYXRlZENhbGxiYWNrKCkge1xuICAgIHRoaXMuY2xhc3NMaXN0LmFkZCgnaW5saW5lLWJsb2NrJylcbiAgICB0aGlzLmNsYXNzTGlzdC5hZGQoJ2xpbnRlci1oaWdobGlnaHQnKVxuXG4gICAgdGhpcy5pY29uU3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxuICAgIHRoaXMuaWNvblNwYW4uY2xhc3NMaXN0LmFkZCgnaWNvbicpXG4gICAgdGhpcy5hcHBlbmRDaGlsZCh0aGlzLmljb25TcGFuKVxuXG4gICAgdGhpcy5jb3VudCA9IDBcblxuICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpe1xuICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaChhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpLCAnbGludGVyOm5leHQtZXJyb3InKVxuICAgIH0pXG4gIH1cbiAgc2V0IGNvdW50KFZhbHVlKSB7XG4gICAgaWYgKFZhbHVlKSB7XG4gICAgICB0aGlzLmNsYXNzTGlzdC5yZW1vdmUoJ3N0YXR1cy1zdWNjZXNzJylcbiAgICAgIHRoaXMuaWNvblNwYW4uY2xhc3NMaXN0LnJlbW92ZSgnaWNvbi1jaGVjaycpXG5cbiAgICAgIHRoaXMuY2xhc3NMaXN0LmFkZCgnc3RhdHVzLWVycm9yJylcbiAgICAgIHRoaXMuaWNvblNwYW4uY2xhc3NMaXN0LmFkZCgnaWNvbi14JylcblxuICAgICAgdGhpcy5pY29uU3Bhbi50ZXh0Q29udGVudCA9IFZhbHVlID09PSAxID8gJzEgSXNzdWUnIDogYCR7VmFsdWV9IElzc3Vlc2BcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jbGFzc0xpc3QucmVtb3ZlKCdzdGF0dXMtZXJyb3InKVxuICAgICAgdGhpcy5pY29uU3Bhbi5jbGFzc0xpc3QucmVtb3ZlKCdpY29uLXgnKVxuXG4gICAgICB0aGlzLmNsYXNzTGlzdC5hZGQoJ3N0YXR1cy1zdWNjZXNzJylcbiAgICAgIHRoaXMuaWNvblNwYW4uY2xhc3NMaXN0LmFkZCgnaWNvbi1jaGVjaycpXG5cbiAgICAgIHRoaXMuaWNvblNwYW4udGV4dENvbnRlbnQgPSAnTm8gSXNzdWVzJ1xuICAgIH1cbiAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gQm90dG9tU3RhdHVzID0gZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KCdsaW50ZXItYm90dG9tLXN0YXR1cycsIHtwcm90b3R5cGU6IEJvdHRvbVN0YXR1cy5wcm90b3R5cGV9KVxuIl19