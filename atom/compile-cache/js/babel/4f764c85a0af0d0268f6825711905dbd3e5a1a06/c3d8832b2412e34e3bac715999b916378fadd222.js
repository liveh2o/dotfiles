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
    key: 'initialize',
    value: function initialize() {
      this.classList.add('inline-block');
      this.classList.add('linter-highlight');

      this.iconSpan = document.createElement('span');
      this.iconSpan.classList.add('icon');
      this.appendChild(this.iconSpan);

      this.count = 0;
    }
  }, {
    key: 'count',
    set: function set(Value) {
      if (Value) {
        this.classList.remove('status-success');
        this.iconSpan.classList.remove('icon-check');

        this.classList.add('status-error');
        this.iconSpan.classList.add('icon-x');

        this.iconSpan.textContent = Value === 1 ? '1 Error' : Value + ' Errors';
      } else {
        this.classList.remove('status-error');
        this.iconSpan.classList.remove('icon-x');

        this.classList.add('status-success');
        this.iconSpan.classList.add('icon-check');

        this.iconSpan.textContent = 'No Errors';
      }
    }
  }]);

  return BottomStatus;
})(HTMLElement);

module.exports = BottomStatus = document.registerElement('linter-bottom-status', { prototype: BottomStatus.prototype });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL3ZpZXdzL2JvdHRvbS1zdGF0dXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDOzs7Ozs7Ozs7O0lBRVAsWUFBWTtXQUFaLFlBQVk7MEJBQVosWUFBWTs7K0JBQVosWUFBWTs7O1lBQVosWUFBWTs7ZUFBWixZQUFZOztXQUVOLHNCQUFHO0FBQ1gsVUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUE7QUFDbEMsVUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsQ0FBQTs7QUFFdEMsVUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBQzlDLFVBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUNuQyxVQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQTs7QUFFL0IsVUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUE7S0FDZjs7O1NBRVEsYUFBQyxLQUFLLEVBQUU7QUFDZixVQUFJLEtBQUssRUFBRTtBQUNULFlBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUE7QUFDdkMsWUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFBOztBQUU1QyxZQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQTtBQUNsQyxZQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUE7O0FBRXJDLFlBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxHQUFHLEtBQUssS0FBSyxDQUFDLEdBQUcsU0FBUyxHQUFNLEtBQUssWUFBUyxDQUFBO09BQ3hFLE1BQU07QUFDTCxZQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQTtBQUNyQyxZQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUE7O0FBRXhDLFlBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUE7QUFDcEMsWUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFBOztBQUV6QyxZQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUE7T0FDeEM7S0FDRjs7O1NBL0JHLFlBQVk7R0FBUyxXQUFXOztBQW1DdEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxZQUFZLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxzQkFBc0IsRUFBRSxFQUFDLFNBQVMsRUFBRSxZQUFZLENBQUMsU0FBUyxFQUFDLENBQUMsQ0FBQSIsImZpbGUiOiIvVXNlcnMvYWgvLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi92aWV3cy9ib3R0b20tc3RhdHVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG5jbGFzcyBCb3R0b21TdGF0dXMgZXh0ZW5kcyBIVE1MRWxlbWVudHtcblxuICBpbml0aWFsaXplKCkge1xuICAgIHRoaXMuY2xhc3NMaXN0LmFkZCgnaW5saW5lLWJsb2NrJylcbiAgICB0aGlzLmNsYXNzTGlzdC5hZGQoJ2xpbnRlci1oaWdobGlnaHQnKVxuXG4gICAgdGhpcy5pY29uU3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxuICAgIHRoaXMuaWNvblNwYW4uY2xhc3NMaXN0LmFkZCgnaWNvbicpXG4gICAgdGhpcy5hcHBlbmRDaGlsZCh0aGlzLmljb25TcGFuKVxuXG4gICAgdGhpcy5jb3VudCA9IDBcbiAgfVxuXG4gIHNldCBjb3VudChWYWx1ZSkge1xuICAgIGlmIChWYWx1ZSkge1xuICAgICAgdGhpcy5jbGFzc0xpc3QucmVtb3ZlKCdzdGF0dXMtc3VjY2VzcycpXG4gICAgICB0aGlzLmljb25TcGFuLmNsYXNzTGlzdC5yZW1vdmUoJ2ljb24tY2hlY2snKVxuXG4gICAgICB0aGlzLmNsYXNzTGlzdC5hZGQoJ3N0YXR1cy1lcnJvcicpXG4gICAgICB0aGlzLmljb25TcGFuLmNsYXNzTGlzdC5hZGQoJ2ljb24teCcpXG5cbiAgICAgIHRoaXMuaWNvblNwYW4udGV4dENvbnRlbnQgPSBWYWx1ZSA9PT0gMSA/ICcxIEVycm9yJyA6IGAke1ZhbHVlfSBFcnJvcnNgXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY2xhc3NMaXN0LnJlbW92ZSgnc3RhdHVzLWVycm9yJylcbiAgICAgIHRoaXMuaWNvblNwYW4uY2xhc3NMaXN0LnJlbW92ZSgnaWNvbi14JylcblxuICAgICAgdGhpcy5jbGFzc0xpc3QuYWRkKCdzdGF0dXMtc3VjY2VzcycpXG4gICAgICB0aGlzLmljb25TcGFuLmNsYXNzTGlzdC5hZGQoJ2ljb24tY2hlY2snKVxuXG4gICAgICB0aGlzLmljb25TcGFuLnRleHRDb250ZW50ID0gJ05vIEVycm9ycydcbiAgICB9XG4gIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEJvdHRvbVN0YXR1cyA9IGRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudCgnbGludGVyLWJvdHRvbS1zdGF0dXMnLCB7cHJvdG90eXBlOiBCb3R0b21TdGF0dXMucHJvdG90eXBlfSlcbiJdfQ==