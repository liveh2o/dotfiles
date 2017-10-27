Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _atom = require('atom');

'use babel';

var BottomTab = (function (_HTMLElement) {
  _inherits(BottomTab, _HTMLElement);

  function BottomTab() {
    _classCallCheck(this, BottomTab);

    _get(Object.getPrototypeOf(BottomTab.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(BottomTab, [{
    key: 'createdCallback',
    value: function createdCallback() {
      this.subscriptions = new _atom.CompositeDisposable();
      this.emitter = new _atom.Emitter();

      this.nameElement = document.createTextNode('');
      this.countElement = document.createElement('span');
      this.countElement.classList.add('count');

      this.appendChild(this.nameElement);
      this.appendChild(document.createTextNode(' '));
      this.appendChild(this.countElement);

      this.count = 0;

      this.subscriptions.add(this.emitter);
      this.addEventListener('click', function () {
        if (this.active) {
          this.emitter.emit('should-toggle-panel');
        } else {
          this.emitter.emit('did-change-tab', this.name);
        }
      });
    }
  }, {
    key: 'prepare',
    value: function prepare(name) {
      var _this = this;

      this.name = name;
      this.nameElement.textContent = name;
      this.subscriptions.add(atom.config.observe('linter.showErrorTab' + name, function (status) {
        if (status) {
          _this.removeAttribute('hidden');
        } else {
          _this.setAttribute('hidden', true);
        }
      }));
    }
  }, {
    key: 'onDidChangeTab',
    value: function onDidChangeTab(callback) {
      return this.emitter.on('did-change-tab', callback);
    }
  }, {
    key: 'onShouldTogglePanel',
    value: function onShouldTogglePanel(callback) {
      return this.emitter.on('should-toggle-panel', callback);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.subscriptions.dispose();
    }
  }, {
    key: 'count',
    set: function set(count) {
      this._count = count;
      this.countElement.textContent = count;
    },
    get: function get() {
      return this._count;
    }
  }, {
    key: 'active',
    set: function set(value) {
      this._active = value;
      if (value) {
        this.classList.add('active');
      } else {
        this.classList.remove('active');
      }
    },
    get: function get() {
      return this._active;
    }
  }], [{
    key: 'create',
    value: function create(name) {
      var el = document.createElement('linter-bottom-tab');
      el.prepare(name);
      return el;
    }
  }]);

  return BottomTab;
})(HTMLElement);

exports['default'] = BottomTab;

document.registerElement('linter-bottom-tab', {
  prototype: BottomTab.prototype
});
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL3VpL2JvdHRvbS10YWIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O29CQUUyQyxNQUFNOztBQUZqRCxXQUFXLENBQUE7O0lBSVUsU0FBUztZQUFULFNBQVM7O1dBQVQsU0FBUzswQkFBVCxTQUFTOzsrQkFBVCxTQUFTOzs7ZUFBVCxTQUFTOztXQUNiLDJCQUFHO0FBQ2hCLFVBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUE7QUFDOUMsVUFBSSxDQUFDLE9BQU8sR0FBRyxtQkFBYSxDQUFBOztBQUU1QixVQUFJLENBQUMsV0FBVyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLENBQUE7QUFDOUMsVUFBSSxDQUFDLFlBQVksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBQ2xELFVBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQTs7QUFFeEMsVUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUE7QUFDbEMsVUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7QUFDOUMsVUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUE7O0FBRW5DLFVBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFBOztBQUVkLFVBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUNwQyxVQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFlBQVc7QUFDeEMsWUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQ2YsY0FBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsQ0FBQTtTQUN6QyxNQUFNO0FBQ0wsY0FBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO1NBQy9DO09BQ0YsQ0FBQyxDQUFBO0tBQ0g7OztXQUNNLGlCQUFDLElBQUksRUFBRTs7O0FBQ1osVUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUE7QUFDaEIsVUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFBO0FBQ25DLFVBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyx5QkFBdUIsSUFBSSxFQUFJLFVBQUEsTUFBTSxFQUFJO0FBQ2pGLFlBQUksTUFBTSxFQUFFO0FBQ1YsZ0JBQUssZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFBO1NBQy9CLE1BQU07QUFDTCxnQkFBSyxZQUFZLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFBO1NBQ2xDO09BQ0YsQ0FBQyxDQUFDLENBQUE7S0FDSjs7O1dBQ2Esd0JBQUMsUUFBUSxFQUFFO0FBQ3ZCLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLEVBQUUsUUFBUSxDQUFDLENBQUE7S0FDbkQ7OztXQUNrQiw2QkFBQyxRQUFRLEVBQUU7QUFDNUIsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxxQkFBcUIsRUFBRSxRQUFRLENBQUMsQ0FBQTtLQUN4RDs7O1dBQ00sbUJBQUc7QUFDUixVQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFBO0tBQzdCOzs7U0FFUSxhQUFDLEtBQUssRUFBRTtBQUNmLFVBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFBO0FBQ25CLFVBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQTtLQUN0QztTQUNRLGVBQUc7QUFDVixhQUFPLElBQUksQ0FBQyxNQUFNLENBQUE7S0FDbkI7OztTQUVTLGFBQUMsS0FBSyxFQUFFO0FBQ2hCLFVBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFBO0FBQ3BCLFVBQUksS0FBSyxFQUFFO0FBQ1QsWUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUE7T0FDN0IsTUFBTTtBQUNMLFlBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFBO09BQ2hDO0tBQ0Y7U0FDUyxlQUFHO0FBQ1gsYUFBTyxJQUFJLENBQUMsT0FBTyxDQUFBO0tBQ3BCOzs7V0FFWSxnQkFBQyxJQUFJLEVBQUU7QUFDbEIsVUFBTSxFQUFFLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO0FBQ3RELFFBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDaEIsYUFBTyxFQUFFLENBQUE7S0FDVjs7O1NBckVrQixTQUFTO0dBQVMsV0FBVzs7cUJBQTdCLFNBQVM7O0FBd0U5QixRQUFRLENBQUMsZUFBZSxDQUFDLG1CQUFtQixFQUFFO0FBQzVDLFdBQVMsRUFBRSxTQUFTLENBQUMsU0FBUztDQUMvQixDQUFDLENBQUEiLCJmaWxlIjoiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvdWkvYm90dG9tLXRhYi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnXG5cbmltcG9ydCB7Q29tcG9zaXRlRGlzcG9zYWJsZSwgRW1pdHRlcn0gZnJvbSAnYXRvbSdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQm90dG9tVGFiIGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuICBjcmVhdGVkQ2FsbGJhY2soKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBFbWl0dGVyKClcblxuICAgIHRoaXMubmFtZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnJylcbiAgICB0aGlzLmNvdW50RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxuICAgIHRoaXMuY291bnRFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2NvdW50JylcblxuICAgIHRoaXMuYXBwZW5kQ2hpbGQodGhpcy5uYW1lRWxlbWVudClcbiAgICB0aGlzLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcgJykpXG4gICAgdGhpcy5hcHBlbmRDaGlsZCh0aGlzLmNvdW50RWxlbWVudClcblxuICAgIHRoaXMuY291bnQgPSAwXG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKHRoaXMuZW1pdHRlcilcbiAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICBpZiAodGhpcy5hY3RpdmUpIHtcbiAgICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ3Nob3VsZC10b2dnbGUtcGFuZWwnKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1jaGFuZ2UtdGFiJywgdGhpcy5uYW1lKVxuICAgICAgfVxuICAgIH0pXG4gIH1cbiAgcHJlcGFyZShuYW1lKSB7XG4gICAgdGhpcy5uYW1lID0gbmFtZVxuICAgIHRoaXMubmFtZUVsZW1lbnQudGV4dENvbnRlbnQgPSBuYW1lXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKGBsaW50ZXIuc2hvd0Vycm9yVGFiJHtuYW1lfWAsIHN0YXR1cyA9PiB7XG4gICAgICBpZiAoc3RhdHVzKSB7XG4gICAgICAgIHRoaXMucmVtb3ZlQXR0cmlidXRlKCdoaWRkZW4nKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoJ2hpZGRlbicsIHRydWUpXG4gICAgICB9XG4gICAgfSkpXG4gIH1cbiAgb25EaWRDaGFuZ2VUYWIoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtY2hhbmdlLXRhYicsIGNhbGxiYWNrKVxuICB9XG4gIG9uU2hvdWxkVG9nZ2xlUGFuZWwoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdzaG91bGQtdG9nZ2xlLXBhbmVsJywgY2FsbGJhY2spXG4gIH1cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gIH1cblxuICBzZXQgY291bnQoY291bnQpIHtcbiAgICB0aGlzLl9jb3VudCA9IGNvdW50XG4gICAgdGhpcy5jb3VudEVsZW1lbnQudGV4dENvbnRlbnQgPSBjb3VudFxuICB9XG4gIGdldCBjb3VudCgpIHtcbiAgICByZXR1cm4gdGhpcy5fY291bnRcbiAgfVxuXG4gIHNldCBhY3RpdmUodmFsdWUpIHtcbiAgICB0aGlzLl9hY3RpdmUgPSB2YWx1ZVxuICAgIGlmICh2YWx1ZSkge1xuICAgICAgdGhpcy5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpXG4gICAgfVxuICB9XG4gIGdldCBhY3RpdmUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2FjdGl2ZVxuICB9XG5cbiAgc3RhdGljIGNyZWF0ZShuYW1lKSB7XG4gICAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaW50ZXItYm90dG9tLXRhYicpXG4gICAgZWwucHJlcGFyZShuYW1lKVxuICAgIHJldHVybiBlbFxuICB9XG59XG5cbmRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudCgnbGludGVyLWJvdHRvbS10YWInLCB7XG4gIHByb3RvdHlwZTogQm90dG9tVGFiLnByb3RvdHlwZVxufSlcbiJdfQ==
//# sourceURL=/Users/ah/.atom/packages/linter/lib/ui/bottom-tab.js
