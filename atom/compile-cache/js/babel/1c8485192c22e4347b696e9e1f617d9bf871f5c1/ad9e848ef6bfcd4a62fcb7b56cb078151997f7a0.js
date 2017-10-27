'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var Message = require('./message');

var BottomPanel = (function (_HTMLElement) {
  function BottomPanel() {
    _classCallCheck(this, BottomPanel);

    _get(Object.getPrototypeOf(BottomPanel.prototype), 'constructor', this).apply(this, arguments);
  }

  _inherits(BottomPanel, _HTMLElement);

  _createClass(BottomPanel, [{
    key: 'prepare',
    value: function prepare() {
      // priority because of https://github.com/AtomLinter/Linter/issues/668
      this.panel = atom.workspace.addBottomPanel({ item: this, visible: false, priority: 500 });
      this.panelVisibility = true;
      return this;
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.panel.destroy();
    }
  }, {
    key: 'updateMessages',
    value: function updateMessages(messages, isProject) {
      this.clear();
      if (!messages.length) {
        return this.visibility = false;
      }
      this.visibility = true;
      messages.forEach((function (message) {
        this.appendChild(Message.fromMessage(message, { addPath: isProject, cloneNode: true }));
      }).bind(this));
    }
  }, {
    key: 'clear',
    value: function clear() {
      while (this.firstChild) {
        this.removeChild(this.firstChild);
      }
    }
  }, {
    key: 'panelVisibility',
    get: function get() {
      return this._panelVisibility;
    },
    set: function set(value) {
      this._panelVisibility = value;
      if (value) this.panel.show();else this.panel.hide();
    }
  }, {
    key: 'visibility',
    get: function get() {
      return this._visibility;
    },
    set: function set(value) {
      this._visibility = value;
      if (value) {
        this.removeAttribute('hidden');
      } else {
        this.setAttribute('hidden', true);
      }
    }
  }]);

  return BottomPanel;
})(HTMLElement);

module.exports = document.registerElement('linter-panel', { prototype: BottomPanel.prototype });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9haC8uYXRvbS9wYWNrYWdlcy9saW50ZXIvbGliL3ZpZXdzL2JvdHRvbS1wYW5lbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUE7Ozs7Ozs7Ozs7QUFFWixJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUE7O0lBRTVCLFdBQVc7V0FBWCxXQUFXOzBCQUFYLFdBQVc7OytCQUFYLFdBQVc7OztZQUFYLFdBQVc7O2VBQVgsV0FBVzs7V0FDUixtQkFBRTs7QUFFUCxVQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUMsQ0FBQyxDQUFBO0FBQ3ZGLFVBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFBO0FBQzNCLGFBQU8sSUFBSSxDQUFBO0tBQ1o7OztXQUNNLG1CQUFFO0FBQ1AsVUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQTtLQUNyQjs7O1dBb0JhLHdCQUFDLFFBQVEsRUFBRSxTQUFTLEVBQUM7QUFDakMsVUFBSSxDQUFDLEtBQUssRUFBRSxDQUFBO0FBQ1osVUFBRyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUM7QUFDbEIsZUFBTyxJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQTtPQUMvQjtBQUNELFVBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFBO0FBQ3RCLGNBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQSxVQUFTLE9BQU8sRUFBQztBQUNoQyxZQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLEVBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQyxDQUFBO09BQ3RGLENBQUEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQTtLQUNkOzs7V0FDSSxpQkFBRTtBQUNMLGFBQU0sSUFBSSxDQUFDLFVBQVUsRUFBQztBQUNwQixZQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQTtPQUNsQztLQUNGOzs7U0FqQ2tCLGVBQUU7QUFDbkIsYUFBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUE7S0FDN0I7U0FDa0IsYUFBQyxLQUFLLEVBQUM7QUFDeEIsVUFBSSxDQUFDLGdCQUFnQixHQUFHLEtBQUssQ0FBQTtBQUM3QixVQUFHLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFBLEtBQ3RCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUE7S0FDdkI7OztTQUNhLGVBQUU7QUFDZCxhQUFPLElBQUksQ0FBQyxXQUFXLENBQUE7S0FDeEI7U0FDYSxhQUFDLEtBQUssRUFBQztBQUNuQixVQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQTtBQUN4QixVQUFHLEtBQUssRUFBQztBQUNQLFlBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUE7T0FDL0IsTUFBTTtBQUNMLFlBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFBO09BQ2xDO0tBQ0Y7OztTQTVCRyxXQUFXO0dBQVMsV0FBVzs7QUE4Q3JDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxjQUFjLEVBQUUsRUFBQyxTQUFTLEVBQUUsV0FBVyxDQUFDLFNBQVMsRUFBQyxDQUFDLENBQUEiLCJmaWxlIjoiL1VzZXJzL2FoLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9saWIvdmlld3MvYm90dG9tLXBhbmVsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbmxldCBNZXNzYWdlID0gcmVxdWlyZSgnLi9tZXNzYWdlJylcblxuY2xhc3MgQm90dG9tUGFuZWwgZXh0ZW5kcyBIVE1MRWxlbWVudHtcbiAgcHJlcGFyZSgpe1xuICAgIC8vIHByaW9yaXR5IGJlY2F1c2Ugb2YgaHR0cHM6Ly9naXRodWIuY29tL0F0b21MaW50ZXIvTGludGVyL2lzc3Vlcy82NjhcbiAgICB0aGlzLnBhbmVsID0gYXRvbS53b3Jrc3BhY2UuYWRkQm90dG9tUGFuZWwoe2l0ZW06IHRoaXMsIHZpc2libGU6IGZhbHNlLCBwcmlvcml0eTogNTAwfSlcbiAgICB0aGlzLnBhbmVsVmlzaWJpbGl0eSA9IHRydWVcbiAgICByZXR1cm4gdGhpc1xuICB9XG4gIGRlc3Ryb3koKXtcbiAgICB0aGlzLnBhbmVsLmRlc3Ryb3koKVxuICB9XG4gIGdldCBwYW5lbFZpc2liaWxpdHkoKXtcbiAgICByZXR1cm4gdGhpcy5fcGFuZWxWaXNpYmlsaXR5XG4gIH1cbiAgc2V0IHBhbmVsVmlzaWJpbGl0eSh2YWx1ZSl7XG4gICAgdGhpcy5fcGFuZWxWaXNpYmlsaXR5ID0gdmFsdWVcbiAgICBpZih2YWx1ZSkgdGhpcy5wYW5lbC5zaG93KClcbiAgICBlbHNlIHRoaXMucGFuZWwuaGlkZSgpXG4gIH1cbiAgZ2V0IHZpc2liaWxpdHkoKXtcbiAgICByZXR1cm4gdGhpcy5fdmlzaWJpbGl0eVxuICB9XG4gIHNldCB2aXNpYmlsaXR5KHZhbHVlKXtcbiAgICB0aGlzLl92aXNpYmlsaXR5ID0gdmFsdWVcbiAgICBpZih2YWx1ZSl7XG4gICAgICB0aGlzLnJlbW92ZUF0dHJpYnV0ZSgnaGlkZGVuJylcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoJ2hpZGRlbicsIHRydWUpXG4gICAgfVxuICB9XG4gIHVwZGF0ZU1lc3NhZ2VzKG1lc3NhZ2VzLCBpc1Byb2plY3Qpe1xuICAgIHRoaXMuY2xlYXIoKVxuICAgIGlmKCFtZXNzYWdlcy5sZW5ndGgpe1xuICAgICAgcmV0dXJuIHRoaXMudmlzaWJpbGl0eSA9IGZhbHNlXG4gICAgfVxuICAgIHRoaXMudmlzaWJpbGl0eSA9IHRydWVcbiAgICBtZXNzYWdlcy5mb3JFYWNoKGZ1bmN0aW9uKG1lc3NhZ2Upe1xuICAgICAgdGhpcy5hcHBlbmRDaGlsZChNZXNzYWdlLmZyb21NZXNzYWdlKG1lc3NhZ2UsIHthZGRQYXRoOiBpc1Byb2plY3QsIGNsb25lTm9kZTogdHJ1ZX0pKVxuICAgIH0uYmluZCh0aGlzKSlcbiAgfVxuICBjbGVhcigpe1xuICAgIHdoaWxlKHRoaXMuZmlyc3RDaGlsZCl7XG4gICAgICB0aGlzLnJlbW92ZUNoaWxkKHRoaXMuZmlyc3RDaGlsZClcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBkb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoJ2xpbnRlci1wYW5lbCcsIHtwcm90b3R5cGU6IEJvdHRvbVBhbmVsLnByb3RvdHlwZX0pXG4iXX0=